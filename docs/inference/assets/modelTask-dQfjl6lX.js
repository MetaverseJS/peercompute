function Me(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])
return!1;return!0}function de(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return j(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return j(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function _e(e){return e?.buffer instanceof ArrayBuffer}function j(e){
return _e(e)?e:e.slice()}function Oe(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var o=0;o<e.length;o++){var i=e.charAt(o),u=i.charCodeAt(0);if(n[u]!==255)throw new TypeError(
i+" is ambiguous");if(n[u]=o,r){var A=i.toLowerCase().charCodeAt(0),p=i.toUpperCase().charCodeAt(0);A!==u&&(n[A]=o),p!==
u&&(n[p]=o)}}var a=e.length,l=e.charAt(0),w=Math.log(a)/Math.log(256),_=Math.log(256)/Math.log(a);function f(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,b=0,
v=0,g=c.length;v!==g&&c[v]===0;)v++,d++;for(var I=(g-v)*_+1>>>0,h=new Uint8Array(I);v!==g;){for(var m=c[v],y=0,x=I-1;(m!==
0||y<b)&&x!==-1;x--,y++)m+=256*h[x]>>>0,h[x]=m%a>>>0,m=m/a>>>0;if(m!==0)throw new Error("Non-zero carry");b=y,v++}for(var k=I-
b;k!==I&&h[k]===0;)k++;for(var z=l.repeat(d);k<I;++k)z+=e.charAt(h[k]);return z}function S(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var b=0,v=0;c[d]===l;)b++,d++;for(var g=(c.
length-d)*w+1>>>0,I=new Uint8Array(g);c[d];){var h=n[c.charCodeAt(d)];if(h===255)return;for(var m=0,y=g-1;(h!==0||m<v)&&
y!==-1;y--,m++)h+=a*I[y]>>>0,I[y]=h%256>>>0,h=h/256>>>0;if(h!==0)throw new Error("Non-zero carry");v=m,d++}if(c[d]!==" "){
for(var x=g-v;x!==g&&I[x]===0;)x++;for(var k=new Uint8Array(b+(g-x)),z=b;x!==g;)k[z++]=I[x++];return k}}}function E(c){var d=S(
c);if(d)return d;throw new Error(`Non-${t} character`)}return{encode:f,decodeUnsafe:S,decode:E}}var qe=Oe,ze=qe;class Le{name;prefix;baseEncode;constructor(t,r,n){
this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
t)}`;throw Error("Unknown type, must be binary type")}}class Pe{name;prefix;baseDecode;prefixCodePoint;constructor(t,r,n){
this.name=t,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(t){if(typeof t=="string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(t.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(t){return ge(this,t)}}class Te{decoders;constructor(t){
this.decoders=t}or(t){return ge(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function ge(e,t){return new Te({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class Ue{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(t,r,n,s){
this.name=t,this.prefix=r,this.baseEncode=n,this.baseDecode=s,this.encoder=new Le(t,r,n),this.decoder=new Pe(t,r,s)}encode(t){
return this.encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function be({name:e,prefix:t,encode:r,decode:n}){
return new Ue(e,t,r,n)}function H({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:o}=ze(r,e,n);
return be({prefix:t,name:e,encode:s,decode:i=>de(o(i))})}function De(e,t,r,n){let s=e.length;for(;e[s-1]==="=";)--s;const o=new Uint8Array(
s*r/8|0);let i=0,u=0,A=0;for(let p=0;p<s;++p){const a=t[e[p]];if(a===void 0)throw new SyntaxError(`Non-${n} character`);
u=u<<r|a,i+=r,i>=8&&(i-=8,o[A++]=255&u>>i)}if(i>=r||(255&u<<8-i)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Re(e,t,r){const n=t[t.length-1]==="=",s=(1<<r)-1;let o="",i=0,u=0;for(let A=0;A<e.length;++A)for(u=u<<8|e[A],i+=
8;i>r;)i-=r,o+=t[s&u>>i];if(i!==0&&(o+=t[s&u<<r-i]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Be(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const s=e[n].toLowerCase(),o=e[n].toUpperCase();s!==e[n]&&(r[s]=n),o!==e[n]&&
(r[o]=n)}return r}function P({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const o=Be(n,s);return be(
{prefix:t,name:e,encode(i){return Re(i,n,r)},decode(i){return De(i,o,r,e)}})}const J=P({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});P({prefix:"B",name:"base32upper",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});P({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqr\
stuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});P({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUV\
WXYZ234567=",bitsPerChar:5,caseInsensitive:!0});P({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});P({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});P({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
P({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});P(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const te=H({prefix:"k",name:"base\
36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});H({prefix:"K",name:"base36upper",alphabet:"0123\
456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const R=H({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFG\
HJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});H({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuv\
wxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Fe=ye,ue=128,Ne=-128,$e=Math.pow(2,31);function ye(e,t,r){t=t||[],r=r||0;for(var n=r;e>=
$e;)t[r++]=e&255|ue,e/=128;for(;e&Ne;)t[r++]=e&255|ue,e>>>=7;return t[r]=e|0,ye.bytes=r-n+1,t}var Ge=ne,je=128,fe=127;function ne(e,n){
var r=0,n=n||0,s=0,o=n,i,u=e.length;do{if(o>=u)throw ne.bytes=0,new RangeError("Could not decode varint");i=e[o++],r+=s<
28?(i&fe)<<s:(i&fe)*Math.pow(2,s),s+=7}while(i>=je);return ne.bytes=o-n,r}var Ve=Math.pow(2,7),We=Math.pow(2,14),Je=Math.
pow(2,21),Qe=Math.pow(2,28),Ke=Math.pow(2,35),Xe=Math.pow(2,42),Ye=Math.pow(2,49),Ze=Math.pow(2,56),He=Math.pow(2,63),et=function(e){
return e<Ve?1:e<We?2:e<Je?3:e<Qe?4:e<Ke?5:e<Xe?6:e<Ye?7:e<Ze?8:e<He?9:10},tt={encode:Fe,decode:Ge,encodingLength:et},X=tt;
function se(e,t=0){const r=X.decode(e,t),n=X.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&
e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,n]}function Y(e,t,r=0){return X.encode(
e,t,r),t}function Z(e){return X.encodingLength(e)}function rt(e,t){const r=t.byteLength,n=Z(e),s=n+Z(r),o=new Uint8Array(
s+r);return Y(e,o,0),Y(r,o,n),o.set(t,s),new le(e,r,t,o)}function nt(e){const t=de(e),[r,n]=se(t),[s,o]=se(t.subarray(n)),
i=t.subarray(n+o);if(i.byteLength!==s)throw new Error("Incorrect length");return new le(r,s,i,t)}function st(e,t){if(e===
t)return!0;{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&Me(e.bytes,r.bytes)}}class le{code;size;digest;bytes;constructor(t,r,n,s){
this.code=t,this.size=r,this.digest=j(n),this.bytes=j(s)}}function he(e,t){const{bytes:r,version:n}=e;switch(n){case 0:return it(
r,oe(e),t??R.encoder);default:return at(r,oe(e),t??J.encoder)}}const pe=new WeakMap;function oe(e){const t=pe.get(e);if(t==
null){const r=new Map;return pe.set(e,r),r}return t}class C{code;version;multihash;bytes;"/";constructor(t,r,n,s){this.code=
r,this.version=t,this.multihash=n,this.bytes=j(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.
bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{
code:t,multihash:r}=this;if(t!==G)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==ct)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return C.createV0(r)}default:throw Error(`Can not convert CID vers\
ion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.
multihash,n=rt(t,r);return C.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(t){return C.equals(this,t)}static equals(t,r){const n=r;return n!=
null&&t.code===n.code&&t.version===n.version&&st(t.multihash,n.multihash)}toString(t){return he(this,t)}toJSON(){return{
"/":he(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof C)return r;if(r["/"]!=null&&r["/"]===r.bytes||
r.asCID===r){const{version:n,code:s,multihash:o,bytes:i}=r;return new C(n,s,o,i??me(n,s,o.bytes))}else if(r[dt]===!0){const{
version:n,multihash:s,code:o}=r,i=nt(s);return C.create(n,o,i)}else return null}static create(t,r,n){if(typeof r!="numbe\
r")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid\
 digest");switch(t){case 0:{if(r!==G)throw new Error(`Version 0 CID must use dag-pb (code: ${G}) block encoding`);return new C(
t,r,n,n.bytes)}case 1:{const s=me(t,r,n.bytes);return new C(t,r,n,s)}default:throw new Error("Invalid version")}}static createV0(t){
return C.create(0,G,t)}static createV1(t,r){return C.create(1,t,r)}static decode(t){const[r,n]=C.decodeFirst(t);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(t){const r=C.inspectBytes(t),n=r.size-r.multihashSize,
s=de(t.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=s.subarray(
r.multihashSize-r.digestSize),i=new le(r.multihashCode,r.digestSize,o,s);return[r.version===0?C.createV0(i):C.createV1(r.
codec,i),t.subarray(r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[l,w]=se(t.subarray(r));return r+=w,l};let s=n(),
o=G;if(s===18?(s=0,r=0):o=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const i=r,u=n(),A=n(),p=r+A,
a=p-i;return{version:s,codec:o,multihashCode:u,digestSize:A,multihashSize:a,size:p}}static parse(t,r){const[n,s]=ot(t,r),
o=C.decode(s);if(o.version===0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return oe(
o).set(n,t),o}}function ot(e,t){switch(e[0]){case"Q":{const r=t??R;return[R.prefix,r.decode(`${R.prefix}${e}`)]}case R.prefix:{
const r=t??R;return[R.prefix,r.decode(e)]}case J.prefix:{const r=t??J;return[J.prefix,r.decode(e)]}case te.prefix:{const r=t??
te;return[te.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID m\
ultibase decoder must be provided");return[e[0],t.decode(e)]}}}function it(e,t,r){const{prefix:n}=r;if(n!==R.prefix)throw Error(
`Cannot string encode V0 in ${r.name} encoding`);const s=t.get(n);if(s==null){const o=r.encode(e).slice(1);return t.set(
n,o),o}else return s}function at(e,t,r){const{prefix:n}=r,s=t.get(n);if(s==null){const o=r.encode(e);return t.set(n,o),o}else
return s}const G=112,ct=18;function me(e,t,r){const n=Z(e),s=n+Z(t),o=new Uint8Array(s+r.byteLength);return Y(e,o,0),Y(t,
o,n),o.set(r,s),o}const dt=Symbol.for("@ipld/js-cid/CID"),lt="transformers.js",ve="4.3.2",M=Object.freeze({maxManifestBytes:256*
1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*
1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),ut=Object.
freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),ft=Object.
freeze({maxModelBytes:M.maxModelBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:M.maxImagePixels}),re=new Set(
["qwen3","qwen2","llama"]);function Ee(e){return e?.architecture==="qwen3_5"?ut:ft}function ie(e="Operation cancelled"){
return e?.name==="AbortError"?e:new DOMException(typeof e=="string"?e:"Operation cancelled","AbortError")}function q(e){
if(e?.aborted)throw ie(e.reason)}function W(e){if(typeof e!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(e))throw new Error(
"Invalid model session ID");return e}function ae(e){if(typeof e!="string"||!e||new TextEncoder().encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.
test(e)||e.startsWith("/")||e.split("/").some(t=>!t||t==="."||t===".."))throw new Error("Invalid model artifact path");return e}
function ht(e){let t;try{t=JSON.stringify(e)}catch{throw new Error("Invalid model manifest")}if(!t||new TextEncoder().encode(
t).length>M.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(t);if(r.schema!==
"peercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>M.maxFiles)throw new Error(
"Invalid model manifest files");const n=new Set,s=Ee(r.model);let o=0;for(const a of r.files){if(ae(a.path),n.has(a.path))
throw new Error("Duplicate model artifact path");n.add(a.path);const l=C.parse(a.cid);if(![85,112].includes(l.code)||l.multihash.
code!==18||l.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(a.size)||a.size<
0||!/^[a-f0-9]{64}$/i.test(a.sha256??""))throw new Error("Invalid model file size/digest");if(a.sha256=a.sha256.toLowerCase(),
o+=a.size,!Number.isSafeInteger(o)||o>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const i=r.
model;if(i?.runtime!==lt||i.runtimeVersion!==ve||![...re,"idefics3","smolvlm","qwen3_5"].includes(i.architecture))throw new Error(
"Model runtime, architecture or dtype is not approved");if(i.task??=re.has(i.architecture)?"text-generation":"image-text\
-to-text",!["text-generation","image-text-to-text"].includes(i.task)||re.has(i.architecture)!==(i.task==="text-generatio\
n"))throw new Error("Model task does not match its admitted architecture");const u=typeof i.dtype=="string"?[["model",i.
dtype]]:i.dtype&&typeof i.dtype=="object"&&!Array.isArray(i.dtype)?Object.entries(i.dtype):[];if(!u.length||u.length>16||
u.some(([a,l])=>!/^[A-Za-z0-9_-]{1,100}$/.test(a)||!["fp32","fp16","q4","q4f16","q8"].includes(l)))throw new Error("Inva\
lid model dtype configuration");if(i.architecture==="qwen3_5"&&u.some(([,a])=>a!=="q4"))throw new Error("Qwen3.5 admits \
q4 language and vision modules");const A=a=>a==="fp32"?"":a==="q8"?"_quantized":`_${a}`,p=["config.json","tokenizer.json",
"tokenizer_config.json"];if((typeof i.dtype!="string"||i.task==="text-generation")&&p.push(...u.map(([a,l])=>`onnx/${a}${A(
l)}.onnx`)),i.task==="image-text-to-text")for(const a of["embed_tokens","vision_encoder","decoder_model_merged"]){const l=typeof i.
dtype=="string"?i.dtype:i.dtype[a];if(!l)throw new Error("Multimodal dtype configuration is missing a module");p.push(`o\
nnx/${a}${A(l)}.onnx`),i.architecture==="qwen3_5"&&p.push(`onnx/${a}${A(l)}.onnx_data`)}if(p.some(a=>!n.has(a)))throw new Error(
"Incomplete model package");if(i.task==="image-text-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_conf\
ig.json"))throw new Error("Multimodal processor configuration is missing");if(i.requiredFeatures!==void 0&&(!Array.isArray(
i.requiredFeatures)||i.requiredFeatures.length>32||i.requiredFeatures.some(a=>typeof a!="string"||a.length>80)))throw new Error(
"Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:s}}function pt(e,t){const r=new URL(t),n={};
for(const s of["mjs","wasm"]){if(typeof e?.[s]!="string")throw new Error("Trusted ORT runtime assets are required");const o=new URL(
e[s],r);if(o.origin!==r.origin||o.username||o.password||o.hash||!["http:","https:"].includes(o.protocol)||!o.pathname.endsWith(
`.${s}`))throw new Error("ORT assets must be approved same-origin runtime files");n[s]=o.href}return n}const mt="peercom\
pute.model-artifact-read.v1",xe=mt;function wt(e,t){const r=n=>t(n.data);return e.addEventListener("message",r),e.start?.(),
()=>e.removeEventListener("message",r)}function D(e,t,r=[]){e.postMessage({protocol:xe,...t},r)}function gt(e,{manifest:t,
baseUrl:r,signal:n,chunkBytes:s=M.chunkBytes,maxReads:o=M.maxReads,maxQueuedReads:i=32}={}){if(!Number.isInteger(o)||o<1||
o>M.maxReads||!Number.isInteger(i)||i<0||i>32)throw new RangeError("Invalid artifact reader limits");const u=new URL(r),
A=new Map(t.files.map(c=>[ae(c.path),c])),p=new Map,a=[];let l=0,w=!1;function _(){for(;!w&&p.size<o&&a.length;){const c=a.
shift();p.set(c.id,c),c.active=!0,D(e,{type:"open",id:c.id,path:c.path})}}function f(c,d){p.delete(c.id);const b=a.indexOf(
c);if(b>=0&&a.splice(b,1),n?.removeEventListener("abort",c.abort),c.requestSignal?.removeEventListener("abort",c.abort),
d){c.reject?.(d);try{c.streamController?.error(d)}catch{}}c.resolvePull?.(),_()}const S=wt(e,c=>{if(c?.protocol!==xe)return;
const d=p.get(c.id);if(d){if(c.type==="error"){f(d,new Error(c.message));return}if(c.type==="ready"){if(d.ready||c.size!==
d.file.size){f(d,new Error("Invalid artifact response size")),D(e,{type:"cancel",id:d.id});return}d.ready=!0,D(e,{type:"\
pull",id:d.id})}else if(c.type==="chunk"){if(!d.ready||!d.resolvePull||!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||
c.bytes.byteLength>s||d.received+c.bytes.byteLength>d.file.size){D(e,{type:"cancel",id:d.id}),f(d,new Error("Invalid art\
ifact chunk"));return}d.received+=c.bytes.byteLength,d.streamController.enqueue(c.bytes);const b=d.resolvePull;d.resolvePull=
null,b()}else c.type==="end"&&(!d.ready||d.received!==d.file.size?f(d,new Error("Truncated artifact response")):(d.streamController.
close(),f(d)))}});async function E(c,d={}){if(w)throw new Error("Artifact bridge is closed");if(q(n),q(d.signal),d.method&&
d.method!=="GET")throw new Error("Model adapter supports GET only");const b=String(c);if(/[\\]/.test(b)||/%(?:2e|2f|5c|00)/i.
test(b)||/\/(?:\.|\.\.)(?:\/|$)/.test(b))throw new Error("Invalid artifact URL");const v=new URL(b,u);if(v.origin!==u.origin||
v.username||v.password||v.search||v.hash||!v.pathname.startsWith(u.pathname))throw new Error("Model path is outside its \
manifest");const g=ae(decodeURIComponent(v.pathname.slice(u.pathname.length))),I=A.get(g);if(!I)return new Response("Art\
ifact path is not in the manifest",{status:404});const h=`read-${++l}`,m={id:h,path:g,file:I,requestSignal:d.signal,received:0,
ready:!1,active:!1,queued:!1};m.abort=()=>{m.active&&D(e,{type:"cancel",id:h}),f(m,ie(n?.reason??d.signal?.reason))};const y=new ReadableStream(
{start(x){m.streamController=x},pull(){if(w)throw new Error("Artifact bridge is closed");if(q(n),q(d.signal),!m.active&&
!m.queued&&p.size>=o&&a.length>=i)throw new Error("Artifact reader limit reached");return new Promise(x=>{m.resolvePull=
x,m.ready?D(e,{type:"pull",id:h}):m.queued||(m.queued=!0,n?.addEventListener("abort",m.abort,{once:!0}),d.signal?.addEventListener(
"abort",m.abort,{once:!0}),a.push(m),_())})},cancel(){m.active&&D(e,{type:"cancel",id:h}),f(m)}},{highWaterMark:0});return new Response(
y,{headers:{"Content-Length":String(I.size),"Content-Type":I.mediaType||"application/octet-stream"}})}return{fetch:E,close(c="\
Artifact bridge closed"){if(!w){w=!0;for(const d of[...p.values(),...a])d.active&&D(e,{type:"cancel",id:d.id}),f(d,ie(c));
S(),e.close()}}}}const Q=e=>new TextEncoder().encode(e).byteLength;function bt(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function Ie(e){if(e==null)return null;
if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>M.maxImagePixels||
e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*
4||e.data.byteLength>M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fil\
es are not accepted");return e}function ke(e){const t=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:
null);if(!Array.isArray(t)||!t.length||t.length>M.maxMessages)throw new Error("Invalid inference messages");let r=0;return t.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=Q(n.content),r>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function ce(e){if(!e)return;let t;const r=new Set;for(const n of[e.model,e.processor,
e.tokenizer])if(!(!n||r.has(n))){r.add(n);try{await n.dispose?.()}catch(s){t??=s}}if(t)throw t}function K(e,t=new Set){if(!(!e||
typeof e!="object"||t.has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();return}for(const r of Object.values(
e))K(r,t)}}function yt(e){const t=e.findIndex(n=>n.role==="user");if(t<0)return null;const r=e.findIndex((n,s)=>s>t&&n.role===
"user");return r<0?null:e.filter((n,s)=>s<t||s>=r||n.role==="system")}function vt(e,t,r){const n={...e.config};for(const u of[
"decoder","generator","text_config"])Object.assign(n,n[u]);Object.assign(n,e.generation_config);const s=Array.isArray(n.
eos_token_id)?n.eos_token_id:[n.eos_token_id],o=t.at(-1),i=u=>typeof u=="bigint"||Number.isSafeInteger(u)&&u>=0;return i(
o)&&s.some(u=>i(u)&&BigInt(u)===BigInt(o))?"stop":t.length>=r?"length":"unknown"}async function Et({library:e,modelPath:t,
options:r,manifest:n}){const s={};try{const o=await e.AutoConfig.from_pretrained(t,r);if(o.model_type!==n.model.architecture)
throw new Error("Model config architecture does not match its admitted manifest");const i={...r,config:o};if(n.model.architecture===
"qwen3_5"&&(i.use_external_data_format=1),n.model.task==="image-text-to-text"){if(s.processor=await e.AutoProcessor.from_pretrained(
t,r),n.model.architecture==="qwen3_5"){const u=s.processor.image_processor;if(!u)throw new Error("Qwen3.5 image processo\
r is unavailable");u.min_pixels=256*256,u.max_pixels=Ee(n.model).maxProcessedImagePixels,u.do_normalize??=!0}s.tokenizer=
s.processor.tokenizer,s.model=await e.AutoModelForImageTextToText.from_pretrained(t,i)}else s.tokenizer=await e.AutoTokenizer.
from_pretrained(t,r),s.model=await e.AutoModelForCausalLM.from_pretrained(t,i);return s}catch(o){throw await ce(s),o}}function we(e){
return{sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.
manifest.model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,gpuDispatches:e.gpuDispatches??
0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.collectGpuEvidence===
!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests}}function Ae({loadLibrary:e=()=>import("./transformers.web-CsR9rRO0.js"),
loadModel:t=Et,gpu:r=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=bt}={}){const o=new Map;
let i;async function u(p,a){if(o.size)throw new Error("This inference worker already has a resident/loading model");const l=W(
p.sessionId),{manifest:w}=ht(p.manifest),_=pt(p.runtimeAssets,n);if(!p.artifactPort?.postMessage)throw new Error("An art\
ifact reader port is required");q(a.signal);const f={sessionId:l,manifest:w,manifestCid:p.manifestCid,status:"loading",workerId:a.
workerId??null,generatedRequests:0,components:null};o.set(l,f);let S;try{const E=await r?.requestAdapter({powerPreference:"\
high-performance"});if(q(a.signal),!E||E.info?.isFallbackAdapter||E.isFallbackAdapter)throw new Error("A hardware WebGPU\
 adapter is required; CPU/software fallback is disabled");const c=typeof w.model.dtype=="string"?[w.model.dtype]:Object.
values(w.model.dtype),d=new Set(w.model.requiredFeatures??[]);c.some(y=>["fp16","q4f16"].includes(y))&&d.add("shader-f16");
for(const y of d)if(!E.features.has(y))throw new Error(`Model requires unsupported GPU feature: ${y}`);f.adapter={vendor:E.
info?.vendor??"",architecture:E.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...d]};const b=await(i??=e());
if(q(a.signal),b.env.version!==ve)throw new Error("Unexpected Transformers runtime version");const v=new URL("/__peercom\
pute_models/",n);S=gt(p.artifactPort,{manifest:w,baseUrl:new URL(`${l}/`,v).href,signal:a.signal});const{env:g}=b;g.logLevel=
50,g.allowLocalModels=!0,g.allowRemoteModels=!1,g.localModelPath=v.pathname,g.useBrowserCache=!1,g.useFSCache=!1,g.useWasmCache=
!1,g.fetch=async(...y)=>{try{return await S.fetch(...y)}catch(x){throw a.emitProgress?.({type:"artifact-read-error",sessionId:l,
message:x.message}),x}},g.backends.onnx.wasm.proxy=!1,g.backends.onnx.wasm.numThreads=1,g.backends.onnx.wasm.wasmPaths=_,
f.gpuDispatches=0,f.gpuProfileSamples=0,f.gpuSubmissions=0,f.collectGpuEvidence=p.collectGpuEvidence===!0,g.backends.onnx.
webgpu&&(g.backends.onnx.webgpu.profiling={mode:p.collectGpuEvidence===!0?"default":"off",ondata:()=>{f.gpuProfileSamples+=
1}});const I={local_files_only:!0,device:"webgpu",dtype:w.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:y=>{
a.signal?.aborted||a.emitProgress?.({type:"model-load",sessionId:l,status:String(y.status??"").slice(0,40),file:typeof y.
file=="string"?y.file.slice(0,512):void 0,loaded:Number.isFinite(y.loaded)?y.loaded:void 0,total:Number.isFinite(y.total)?
y.total:void 0})}};f.library=b,f.components=await t({library:b,modelPath:l,options:I,manifest:w}),q(a.signal);const h=await g.
backends.onnx.webgpu?.device;if(f.runtimeDevice=h,f.runtimeFeatures=[...h?.features??[]],f.collectGpuEvidence&&h){const y=h.
createCommandEncoder.bind(h),x=h.queue.submit.bind(h.queue),k=Object.getOwnPropertyDescriptor(h,"createCommandEncoder"),
z=Object.getOwnPropertyDescriptor(h.queue,"submit");f.restoreGpuEvidence=()=>{k?Object.defineProperty(h,"createCommandEn\
coder",k):delete h.createCommandEncoder,z?Object.defineProperty(h.queue,"submit",z):delete h.queue.submit,f.restoreGpuEvidence=
null},h.createCommandEncoder=(...F)=>{const O=y(...F),ee=O.beginComputePass.bind(O);return O.beginComputePass=(...N)=>{const T=ee(
...N);for(const $ of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const U=T[$].bind(T);T[$]=(...L)=>{const V=U(...L);
return f.gpuDispatches+=1,V}}return T},O},h.queue.submit=(...F)=>{const O=x(...F);return f.gpuSubmissions+=1,O}}const m=h?.
adapterInfo??g.backends.onnx.webgpu?.adapter?.info;if(m){if(m.isFallbackAdapter)throw new Error("ORT selected a software\
 GPU adapter");f.runtimeAdapter={vendor:m.vendor,architecture:m.architecture,isFallbackAdapter:m.isFallbackAdapter??!1}}
return h?.lost&&h.lost.then(()=>{o.get(l)===f&&(f.lost=!0,f.active?.abort("GPU device lost"))}),q(a.signal),f.status="re\
ady",we(f)}catch(E){try{await ce(f.components),f.restoreGpuEvidence?.(),o.delete(l)}catch(c){f.status="ready",f.lost=!0;
const d=new Error(`MODEL_DISPOSE_FAILED: ${c.message}`);throw d.code="MODEL_DISPOSE_FAILED",d}throw E}finally{S?.close(),
S||p.artifactPort.close()}}async function A(p,a){const l=o.get(W(p.sessionId));if(!l||l.lost)throw new Error("Model sess\
ion lost or not loaded");if(l.status!=="ready")throw new Error("Model session is busy");const w=W(p.requestId),_=p.maxNewTokens??
M.maxNewTokens;if(!Number.isInteger(_)||_<1||_>M.maxNewTokens)throw new Error("Generation exceeds its output-token budge\
t");let f=ke(p);const S=Ie(p.image);if(S&&l.manifest.model.task!=="image-text-to-text")throw new Error("This model does \
not admit image inputs");q(a.signal);const E=new AbortController,c=new l.library.InterruptableStoppingCriteria,d=()=>{E.
abort(a.signal?.reason),c.interrupt()};a.signal?.addEventListener("abort",d,{once:!0}),E.signal.addEventListener("abort",
()=>c.interrupt(),{once:!0}),l.active=E,l.requestId=w,l.status="generating";let b,v,g=0,I=0,h,m=!1;const y=l.gpuDispatches??
0,x=l.gpuSubmissions??0;try{q(a.signal);const{tokenizer:k,processor:z,model:F}=l.components;let O;for(;;){q(E.signal);let U=f;
if(z&&(U=f.map(B=>({role:B.role,content:[{type:"text",text:B.content}]})),S)){const B=U.findLast(Ce=>Ce.role==="user");if(!B)
throw new Error("An image requires a user message");B.content.unshift({type:"image"})}const L=(z??k).apply_chat_template(
U,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof L!="string"||Q(L)>M.maxPromptBytes)throw new Error(
"Templated prompt exceeds its byte budget");if(S){const B=new l.library.RawImage(S.data,S.width,S.height,S.channels);b=await z(
L,B,{do_image_splitting:!1})}else b=await k(L,{truncation:!1,padding:!1});if(q(E.signal),O=b.input_ids?.dims?.at(-1),!Number.
isSafeInteger(O)||O<1)throw new Error("Invalid model input token count");if(O+_<=M.maxContextTokens)break;const V=yt(f);
if(!V)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or requ\
est fewer output tokens");const Se=b;b=void 0,K(Se),f=V,m=!0}q(E.signal);const ee=new l.library.TextStreamer(k,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:U=>{if(!(E.signal.aborted||h)){if(I+=Q(U),I>M.maxOutputBytes){h=new Error("Gene\
rated text exceeded its byte budget"),E.abort(h);return}try{if(a.emitProgress?.({type:"token",sessionId:l.sessionId,requestId:w,
sequence:g++,text:U})===!1)throw new Error("Token consumer rejected output")}catch(L){h=L,E.abort(L)}}}});if(v=await F.generate(
{...b,max_new_tokens:_,do_sample:!1,streamer:ee,stopping_criteria:[c]}),await l.runtimeDevice?.queue.onSubmittedWorkDone(),
h)throw h;if(l.lost)throw new Error("GPU device lost; model session is unavailable");q(E.signal);const N=v.tolist();if(N.
length!==1||N[0].length<O||N[0].length>O+_)throw new Error("Model returned an over-budget token sequence");const T=N[0].
slice(O),$=k.decode(T,{skip_special_tokens:!0});if(Q($)>M.maxOutputBytes)throw new Error("Generated text exceeds its byt\
e budget");return l.generatedRequests+=1,{sessionId:l.sessionId,requestId:w,text:$,inputTokens:O,outputTokens:T.length,finishReason:vt(
F,T,_),contextTruncated:m,workerId:l.workerId,gpuDispatches:(l.gpuDispatches??0)-y,gpuSubmissions:(l.gpuSubmissions??0)-
x,gpuProfileSamples:l.gpuProfileSamples??0}}finally{a.signal?.removeEventListener("abort",d);try{const k=new Set;K(b,k),
K(v,k)}finally{l.active=null,l.requestId=null,l.status="ready"}}}return async function(a={},l={}){if(s(),a.command==="lo\
ad")return u(a,l);if(a.command==="generate")return A(a,l);const w=o.get(W(a.sessionId));if(a.command==="status")return w?
we(w):{sessionId:a.sessionId,status:"absent"};if(a.command==="cancel")return w?.requestId===a.requestId&&w.active?.abort(
"Generation cancelled"),{sessionId:a.sessionId,cancellationRequested:!0};if(a.command==="unload"){if(!w)return{sessionId:a.
sessionId,status:"absent"};if(w.status!=="ready")throw new Error("Cancel and await active model work before unloading");
w.status="unloading";try{await ce(w.components),w.restoreGpuEvidence?.()}catch(_){w.status="ready",w.lost=!0;const f=new Error(
`MODEL_DISPOSE_FAILED: ${_.message}`);throw f.code="MODEL_DISPOSE_FAILED",f}return o.delete(a.sessionId),{sessionId:a.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const xt=Ae(),It=(e,t)=>xt(e,t);var kt=Object.freeze({
__proto__:null,createModelTaskRuntime:Ae,handleModelTask:It,normalizeModelMessages:ke,validateImageInput:Ie});export{mt as A,C,M,ie as a,ae as b,kt as m,ke as n,q as t,W as v};
