var De=Object.defineProperty;var Re=(e,t,r)=>t in e?De(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var I=(e,t,r)=>Re(e,typeof t!="symbol"?t+"":t,r);function Be(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])
return!1;return!0}function ye(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return Y(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Y(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function Fe(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function Y(e){return Fe(e)?e:e.slice()}function Ne(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),o=0;o<n.length;o++)n[o]=255;for(var s=0;s<e.length;s++){var i=e.charAt(s),d=i.charCodeAt(0);if(n[d]!==255)throw new TypeError(
i+" is ambiguous");if(n[d]=s,r){var M=i.toLowerCase().charCodeAt(0),A=i.toUpperCase().charCodeAt(0);M!==d&&(n[M]=s),A!==
d&&(n[A]=s)}}var u=e.length,m=e.charAt(0),l=Math.log(u)/Math.log(256),f=Math.log(256)/Math.log(u);function p(a){if(a instanceof
Uint8Array||(ArrayBuffer.isView(a)?a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength):Array.isArray(a)&&(a=Uint8Array.
from(a))),!(a instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(a.length===0)return"";for(var c=0,k=0,
b=0,y=a.length;b!==y&&a[b]===0;)b++,c++;for(var E=(y-b)*f+1>>>0,x=new Uint8Array(E);b!==y;){for(var w=a[b],C=0,g=E-1;(w!==
0||C<k)&&g!==-1;g--,C++)w+=256*x[g]>>>0,x[g]=w%u>>>0,w=w/u>>>0;if(w!==0)throw new Error("Non-zero carry");k=C,b++}for(var _=E-
k;_!==E&&x[_]===0;)_++;for(var D=m.repeat(c);_<E;++_)D+=e.charAt(x[_]);return D}function q(a){if(typeof a!="string")throw new TypeError(
"Expected String");if(a.length===0)return new Uint8Array;var c=0;if(a[c]!==" "){for(var k=0,b=0;a[c]===m;)k++,c++;for(var y=(a.
length-c)*l+1>>>0,E=new Uint8Array(y);a[c];){var x=n[a.charCodeAt(c)];if(x===255)return;for(var w=0,C=y-1;(x!==0||w<b)&&
C!==-1;C--,w++)x+=u*E[C]>>>0,E[C]=x%256>>>0,x=x/256>>>0;if(x!==0)throw new Error("Non-zero carry");b=w,c++}if(a[c]!==" "){
for(var g=y-b;g!==y&&E[g]===0;)g++;for(var _=new Uint8Array(k+(y-g)),D=k;g!==y;)_[D++]=E[g++];return _}}}function h(a){var c=q(
a);if(c)return c;throw new Error(`Non-${t} character`)}return{encode:p,decodeUnsafe:q,decode:h}}var $e=Ne,Ge=$e;class je{constructor(t,r,n){
I(this,"name");I(this,"prefix");I(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}}class Ve{constructor(t,r,n){
I(this,"name");I(this,"prefix");I(this,"baseDecode");I(this,"prefixCodePoint");this.name=t,this.prefix=r;const o=r.codePointAt(
0);if(o===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=o,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Me(this,t)}}class We{constructor(t){I(this,"decoders");this.
decoders=t}or(t){return Me(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function Me(e,t){return new We({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class Je{constructor(t,r,n,o){
I(this,"name");I(this,"prefix");I(this,"baseEncode");I(this,"baseDecode");I(this,"encoder");I(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=o,this.encoder=new je(t,r,n),this.decoder=new Ve(t,r,o)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function _e({name:e,prefix:t,encode:r,decode:n}){return new Je(
e,t,r,n)}function ce({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:o,decode:s}=Ge(r,e,n);return _e({prefix:t,
name:e,encode:o,decode:i=>ye(s(i))})}function Qe(e,t,r,n){let o=e.length;for(;e[o-1]==="=";)--o;const s=new Uint8Array(o*
r/8|0);let i=0,d=0,M=0;for(let A=0;A<o;++A){const u=t[e[A]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);d=
d<<r|u,i+=r,i>=8&&(i-=8,s[M++]=255&d>>i)}if(i>=r||(255&d<<8-i)!==0)throw new SyntaxError("Unexpected end of data");return s}
function Ke(e,t,r){const n=t[t.length-1]==="=",o=(1<<r)-1;let s="",i=0,d=0;for(let M=0;M<e.length;++M)for(d=d<<8|e[M],i+=
8;i>r;)i-=r,s+=t[o&d>>i];if(i!==0&&(s+=t[o&d<<r-i]),n)for(;(s.length*r&7)!==0;)s+="=";return s}function Xe(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const o=e[n].toLowerCase(),s=e[n].toUpperCase();o!==e[n]&&(r[o]=n),s!==e[n]&&
(r[s]=n)}return r}function G({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:o=!1}){const s=Xe(n,o);return _e(
{prefix:t,name:e,encode(i){return Ke(i,n,r)},decode(i){return Qe(i,s,r,e)}})}const re=G({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});G({prefix:"B",name:"base32upper",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});G({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqr\
stuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});G({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUV\
WXYZ234567=",bitsPerChar:5,caseInsensitive:!0});G({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});G({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});G({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
G({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});G(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const le=ce({prefix:"k",name:"bas\
e36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});ce({prefix:"K",name:"base36upper",alphabet:"01\
23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const J=ce({name:"base58btc",prefix:"z",alphabet:"123456789ABCD\
EFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ce({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqr\
stuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Ye=Oe,Ee=128,Ze=-128,He=Math.pow(2,31);function Oe(e,t,r){t=t||[],r=r||0;for(var n=r;e>=
He;)t[r++]=e&255|Ee,e/=128;for(;e&Ze;)t[r++]=e&255|Ee,e>>>=7;return t[r]=e|0,Oe.bytes=r-n+1,t}var et=he,tt=128,xe=127;function he(e,n){
var r=0,n=n||0,o=0,s=n,i,d=e.length;do{if(s>=d)throw he.bytes=0,new RangeError("Could not decode varint");i=e[s++],r+=o<
28?(i&xe)<<o:(i&xe)*Math.pow(2,o),o+=7}while(i>=tt);return he.bytes=s-n,r}var rt=Math.pow(2,7),nt=Math.pow(2,14),ot=Math.
pow(2,21),st=Math.pow(2,28),it=Math.pow(2,35),at=Math.pow(2,42),ct=Math.pow(2,49),dt=Math.pow(2,56),ut=Math.pow(2,63),lt=function(e){
return e<rt?1:e<nt?2:e<ot?3:e<st?4:e<it?5:e<at?6:e<ct?7:e<dt?8:e<ut?9:10},ft={encode:Ye,decode:et,encodingLength:lt},se=ft;
function pe(e,t=0){const r=se.decode(e,t),n=se.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>
1&&e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,n]}function ie(e,t,r=0){return se.
encode(e,t,r),t}function ae(e){return se.encodingLength(e)}function ht(e,t){const r=t.byteLength,n=ae(e),o=n+ae(r),s=new Uint8Array(
o+r);return ie(e,s,0),ie(r,s,n),s.set(t,o),new ve(e,r,t,s)}function pt(e){const t=ye(e),[r,n]=pe(t),[o,s]=pe(t.subarray(
n)),i=t.subarray(n+s);if(i.byteLength!==o)throw new Error("Incorrect length");return new ve(r,o,i,t)}function mt(e,t){if(e===
t)return!0;{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&Be(e.bytes,r.bytes)}}class ve{constructor(t,r,n,o){
I(this,"code");I(this,"size");I(this,"digest");I(this,"bytes");this.code=t,this.size=r,this.digest=Y(n),this.bytes=Y(o)}}
function Ie(e,t){const{bytes:r,version:n}=e;switch(n){case 0:return gt(r,me(e),t??J.encoder);default:return bt(r,me(e),t??
re.encoder)}}const ke=new WeakMap;function me(e){const t=ke.get(e);if(t==null){const r=new Map;return ke.set(e,r),r}return t}
var Ce;class L{constructor(t,r,n,o){I(this,"code");I(this,"version");I(this,"multihash");I(this,"bytes");I(this,"/");I(this,
Ce,"CID");this.code=r,this.version=t,this.multihash=n,this.bytes=Y(o),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:t,multihash:r}=this;if(t!==X)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==yt)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return L.createV0(r)}default:throw Error(`Can not convert CID vers\
ion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.
multihash,n=ht(t,r);return L.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(t){return L.equals(this,t)}static equals(t,r){const n=r;return n!=
null&&t.code===n.code&&t.version===n.version&&mt(t.multihash,n.multihash)}toString(t){return Ie(this,t)}toJSON(){return{
"/":Ie(this)}}link(){return this}[(Ce=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.
toString()})`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof L)return r;if(r["/"]!=null&&r["/"]===r.bytes||
r.asCID===r){const{version:n,code:o,multihash:s,bytes:i}=r;return new L(n,o,s,i??Ae(n,o,s.bytes))}else if(r[vt]===!0){const{
version:n,multihash:o,code:s}=r,i=pt(o);return L.create(n,s,i)}else return null}static create(t,r,n){if(typeof r!="numbe\
r")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid\
 digest");switch(t){case 0:{if(r!==X)throw new Error(`Version 0 CID must use dag-pb (code: ${X}) block encoding`);return new L(
t,r,n,n.bytes)}case 1:{const o=Ae(t,r,n.bytes);return new L(t,r,n,o)}default:throw new Error("Invalid version")}}static createV0(t){
return L.create(0,X,t)}static createV1(t,r){return L.create(1,t,r)}static decode(t){const[r,n]=L.decodeFirst(t);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(t){const r=L.inspectBytes(t),n=r.size-r.multihashSize,
o=ye(t.subarray(n,n+r.multihashSize));if(o.byteLength!==r.multihashSize)throw new Error("Incorrect length");const s=o.subarray(
r.multihashSize-r.digestSize),i=new ve(r.multihashCode,r.digestSize,s,o);return[r.version===0?L.createV0(i):L.createV1(r.
codec,i),t.subarray(r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[m,l]=pe(t.subarray(r));return r+=l,m};let o=n(),
s=X;if(o===18?(o=0,r=0):s=n(),o!==0&&o!==1)throw new RangeError(`Invalid CID version ${o}`);const i=r,d=n(),M=n(),A=r+M,
u=A-i;return{version:o,codec:s,multihashCode:d,digestSize:M,multihashSize:u,size:A}}static parse(t,r){const[n,o]=wt(t,r),
s=L.decode(o);if(s.version===0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return me(
s).set(n,t),s}}function wt(e,t){switch(e[0]){case"Q":{const r=t??J;return[J.prefix,r.decode(`${J.prefix}${e}`)]}case J.prefix:{
const r=t??J;return[J.prefix,r.decode(e)]}case re.prefix:{const r=t??re;return[re.prefix,r.decode(e)]}case le.prefix:{const r=t??
le;return[le.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID m\
ultibase decoder must be provided");return[e[0],t.decode(e)]}}}function gt(e,t,r){const{prefix:n}=r;if(n!==J.prefix)throw Error(
`Cannot string encode V0 in ${r.name} encoding`);const o=t.get(n);if(o==null){const s=r.encode(e).slice(1);return t.set(
n,s),s}else return o}function bt(e,t,r){const{prefix:n}=r,o=t.get(n);if(o==null){const s=r.encode(e);return t.set(n,s),s}else
return o}const X=112,yt=18;function Ae(e,t,r){const n=ae(e),o=n+ae(t),s=new Uint8Array(o+r.byteLength);return ie(e,s,0),
ie(t,s,n),s.set(r,o),s}const vt=Symbol.for("@ipld/js-cid/CID"),Et="transformers.js",qe="4.3.2",P=Object.freeze({maxManifestBytes:256*
1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*
1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),xt=Object.
freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),It=Object.
freeze({maxModelBytes:P.maxModelBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:P.maxImagePixels}),fe=new Set(
["qwen3","qwen2","llama"]);function ze(e){return(e==null?void 0:e.architecture)==="qwen3_5"?xt:It}function we(e="Operati\
on cancelled"){return(e==null?void 0:e.name)==="AbortError"?e:new DOMException(typeof e=="string"?e:"Operation cancelled",
"AbortError")}function U(e){if(e!=null&&e.aborted)throw we(e.reason)}function te(e){if(typeof e!="string"||!/^[A-Za-z0-9_-]{1,128}$/.
test(e))throw new Error("Invalid model session ID");return e}function ge(e){if(typeof e!="string"||!e||new TextEncoder().
encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(e)||e.startsWith("/")||e.split("/").some(t=>!t||t==="."||t===".\
."))throw new Error("Invalid model artifact path");return e}function kt(e){let t;try{t=JSON.stringify(e)}catch{throw new Error(
"Invalid model manifest")}if(!t||new TextEncoder().encode(t).length>P.maxManifestBytes)throw new Error("Model manifest e\
xceeds its metadata budget");const r=JSON.parse(t);if(r.schema!=="peercompute.artifact.manifest.v1"||!Array.isArray(r.files)||
!r.files.length||r.files.length>P.maxFiles)throw new Error("Invalid model manifest files");const n=new Set,o=ze(r.model);
let s=0;for(const u of r.files){if(ge(u.path),n.has(u.path))throw new Error("Duplicate model artifact path");n.add(u.path);
const m=L.parse(u.cid);if(![85,112].includes(m.code)||m.multihash.code!==18||m.multihash.size!==32)throw new Error("Unsu\
pported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||!/^[a-f0-9]{64}$/i.test(u.sha256??""))throw new Error(
"Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),s+=u.size,!Number.isSafeInteger(s)||s>o.maxModelBytes)
throw new Error("Model exceeds its admitted file budget")}const i=r.model;if((i==null?void 0:i.runtime)!==Et||i.runtimeVersion!==
qe||![...fe,"idefics3","smolvlm","qwen3_5"].includes(i.architecture))throw new Error("Model runtime, architecture or dty\
pe is not approved");if(i.task??(i.task=fe.has(i.architecture)?"text-generation":"image-text-to-text"),!["text-generatio\
n","image-text-to-text"].includes(i.task)||fe.has(i.architecture)!==(i.task==="text-generation"))throw new Error("Model \
task does not match its admitted architecture");const d=typeof i.dtype=="string"?[["model",i.dtype]]:i.dtype&&typeof i.dtype==
"object"&&!Array.isArray(i.dtype)?Object.entries(i.dtype):[];if(!d.length||d.length>16||d.some(([u,m])=>!/^[A-Za-z0-9_-]{1,100}$/.
test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(m)))throw new Error("Invalid model dtype configuration");if(i.architecture===
"qwen3_5"&&d.some(([,u])=>u!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const M=u=>u==="fp3\
2"?"":u==="q8"?"_quantized":`_${u}`,A=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof i.dtype!="stri\
ng"||i.task==="text-generation")&&A.push(...d.map(([u,m])=>`onnx/${u}${M(m)}.onnx`)),i.task==="image-text-to-text")for(const u of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const m=typeof i.dtype=="string"?i.dtype:i.dtype[u];if(!m)throw new Error(
"Multimodal dtype configuration is missing a module");A.push(`onnx/${u}${M(m)}.onnx`),i.architecture==="qwen3_5"&&A.push(
`onnx/${u}${M(m)}.onnx_data`)}if(A.some(u=>!n.has(u)))throw new Error("Incomplete model package");if(i.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(i.requiredFeatures!==void 0&&(!Array.isArray(i.requiredFeatures)||i.requiredFeatures.length>
32||i.requiredFeatures.some(u=>typeof u!="string"||u.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,
totalBytes:s,resourcePolicy:o}}function At(e,t){const r=new URL(t),n={};for(const o of["mjs","wasm"]){if(typeof(e==null?
void 0:e[o])!="string")throw new Error("Trusted ORT runtime assets are required");const s=new URL(e[o],r);if(s.origin!==
r.origin||s.username||s.password||s.hash||!["http:","https:"].includes(s.protocol)||!s.pathname.endsWith(`.${o}`))throw new Error(
"ORT assets must be approved same-origin runtime files");n[o]=s.href}return n}const St="peercompute.model-artifact-read.\
v1",Le=St;function Ct(e,t){var n;const r=o=>t(o.data);return e.addEventListener("message",r),(n=e.start)==null||n.call(e),
()=>e.removeEventListener("message",r)}function W(e,t,r=[]){e.postMessage({protocol:Le,...t},r)}function Mt(e,{manifest:t,
baseUrl:r,signal:n,chunkBytes:o=P.chunkBytes,maxReads:s=P.maxReads,maxQueuedReads:i=32}={}){if(!Number.isInteger(s)||s<1||
s>P.maxReads||!Number.isInteger(i)||i<0||i>32)throw new RangeError("Invalid artifact reader limits");const d=new URL(r),
M=new Map(t.files.map(a=>[ge(a.path),a])),A=new Map,u=[];let m=0,l=!1;function f(){for(;!l&&A.size<s&&u.length;){const a=u.
shift();A.set(a.id,a),a.active=!0,W(e,{type:"open",id:a.id,path:a.path})}}function p(a,c){var b,y,E,x;A.delete(a.id);const k=u.
indexOf(a);if(k>=0&&u.splice(k,1),n==null||n.removeEventListener("abort",a.abort),(b=a.requestSignal)==null||b.removeEventListener(
"abort",a.abort),c){(y=a.reject)==null||y.call(a,c);try{(E=a.streamController)==null||E.error(c)}catch{}}(x=a.resolvePull)==
null||x.call(a),f()}const q=Ct(e,a=>{if((a==null?void 0:a.protocol)!==Le)return;const c=A.get(a.id);if(c){if(a.type==="e\
rror"){p(c,new Error(a.message));return}if(a.type==="ready"){if(c.ready||a.size!==c.file.size){p(c,new Error("Invalid ar\
tifact response size")),W(e,{type:"cancel",id:c.id});return}c.ready=!0,W(e,{type:"pull",id:c.id})}else if(a.type==="chun\
k"){if(!c.ready||!c.resolvePull||!(a.bytes instanceof Uint8Array)||!a.bytes.byteLength||a.bytes.byteLength>o||c.received+
a.bytes.byteLength>c.file.size){W(e,{type:"cancel",id:c.id}),p(c,new Error("Invalid artifact chunk"));return}c.received+=
a.bytes.byteLength,c.streamController.enqueue(a.bytes);const k=c.resolvePull;c.resolvePull=null,k()}else a.type==="end"&&
(!c.ready||c.received!==c.file.size?p(c,new Error("Truncated artifact response")):(c.streamController.close(),p(c)))}});
async function h(a,c={}){if(l)throw new Error("Artifact bridge is closed");if(U(n),U(c.signal),c.method&&c.method!=="GET")
throw new Error("Model adapter supports GET only");const k=String(a);if(/[\\]/.test(k)||/%(?:2e|2f|5c|00)/i.test(k)||/\/(?:\.|\.\.)(?:\/|$)/.
test(k))throw new Error("Invalid artifact URL");const b=new URL(k,d);if(b.origin!==d.origin||b.username||b.password||b.search||
b.hash||!b.pathname.startsWith(d.pathname))throw new Error("Model path is outside its manifest");const y=ge(decodeURIComponent(
b.pathname.slice(d.pathname.length))),E=M.get(y);if(!E)return new Response("Artifact path is not in the manifest",{status:404});
const x=`read-${++m}`,w={id:x,path:y,file:E,requestSignal:c.signal,received:0,ready:!1,active:!1,queued:!1};w.abort=()=>{
var g;w.active&&W(e,{type:"cancel",id:x}),p(w,we((n==null?void 0:n.reason)??((g=c.signal)==null?void 0:g.reason)))};const C=new ReadableStream(
{start(g){w.streamController=g},pull(){if(l)throw new Error("Artifact bridge is closed");if(U(n),U(c.signal),!w.active&&
!w.queued&&A.size>=s&&u.length>=i)throw new Error("Artifact reader limit reached");return new Promise(g=>{var _;w.resolvePull=
g,w.ready?W(e,{type:"pull",id:x}):w.queued||(w.queued=!0,n==null||n.addEventListener("abort",w.abort,{once:!0}),(_=c.signal)==
null||_.addEventListener("abort",w.abort,{once:!0}),u.push(w),f())})},cancel(){w.active&&W(e,{type:"cancel",id:x}),p(w)}},
{highWaterMark:0});return new Response(C,{headers:{"Content-Length":String(E.size),"Content-Type":E.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:h,close(a="Artifact bridge closed"){if(!l){l=!0;for(const c of[...A.values(),...u])c.active&&
W(e,{type:"cancel",id:c.id}),p(c,we(a));q(),e.close()}}}}const ne=e=>new TextEncoder().encode(e).byteLength;function _t(){
if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a \
ComputeManager-owned worker")}function Pe(e){if(e==null)return null;if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(
e.height)||e.width<1||e.height<1||e.width*e.height>P.maxImagePixels||e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof
Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*4||e.data.byteLength>P.maxImageBytes)throw new Error("Image mus\
t contain bounded RGBA pixels; image URLs and encoded files are not accepted");return e}function Te(e){const t=e.messages??
(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:null);if(!Array.isArray(t)||!t.length||t.length>P.maxMessages)
throw new Error("Invalid inference messages");let r=0;return t.map(n=>{if(!n||!["system","user","assistant"].includes(n.
role)||typeof n.content!="string")throw new Error("Only text message content is accepted");if(r+=ne(n.content),r>P.maxPromptBytes)
throw new Error("Prompt exceeds its byte budget");return{role:n.role,content:n.content}})}async function be(e){var n;if(!e)
return;let t;const r=new Set;for(const o of[e.model,e.processor,e.tokenizer])if(!(!o||r.has(o))){r.add(o);try{await((n=o.
dispose)==null?void 0:n.call(o))}catch(s){t??(t=s)}}if(t)throw t}function oe(e,t=new Set){if(!(!e||typeof e!="object"||t.
has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();return}for(const r of Object.values(e))oe(r,t)}}function Ot(e){
const t=e.findIndex(n=>n.role==="user");if(t<0)return null;const r=e.findIndex((n,o)=>o>t&&n.role==="user");return r<0?null:
e.filter((n,o)=>o<t||o>=r||n.role==="system")}function qt(e,t,r){const n={...e.config};for(const d of["decoder","generat\
or","text_config"])Object.assign(n,n[d]);Object.assign(n,e.generation_config);const o=Array.isArray(n.eos_token_id)?n.eos_token_id:
[n.eos_token_id],s=t.at(-1),i=d=>typeof d=="bigint"||Number.isSafeInteger(d)&&d>=0;return i(s)&&o.some(d=>i(d)&&BigInt(d)===
BigInt(s))?"stop":t.length>=r?"length":"unknown"}async function zt({library:e,modelPath:t,options:r,manifest:n}){const o={};
try{const s=await e.AutoConfig.from_pretrained(t,r);if(s.model_type!==n.model.architecture)throw new Error("Model config\
 architecture does not match its admitted manifest");const i={...r,config:s};if(n.model.architecture==="qwen3_5"&&(i.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture===
"qwen3_5"){const d=o.processor.image_processor;if(!d)throw new Error("Qwen3.5 image processor is unavailable");d.min_pixels=
256*256,d.max_pixels=ze(n.model).maxProcessedImagePixels,d.do_normalize??(d.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await e.AutoModelForImageTextToText.from_pretrained(t,i)}else o.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),o.model=await e.AutoModelForCausalLM.from_pretrained(t,i);return o}catch(s){throw await be(o),s}}function Se(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,
gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.collectGpuEvidence===!0,
runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests}}function Ue({loadLibrary:e=()=>import("./transformers.web-C7Eqzws9.js"),
loadModel:t=zt,gpu:r=(s=>(s=globalThis.navigator)==null?void 0:s.gpu)(),baseUrl:n=(i=>(i=globalThis.location)==null?void 0:
i.href)(),assertWorker:o=_t}={}){const d=new Map;let M;async function A(m,l){var c,k,b,y,E,x,w,C;if(d.size)throw new Error(
"This inference worker already has a resident/loading model");const f=te(m.sessionId),{manifest:p}=kt(m.manifest),q=At(m.
runtimeAssets,n);if(!((c=m.artifactPort)!=null&&c.postMessage))throw new Error("An artifact reader port is required");U(
l.signal);const h={sessionId:f,manifest:p,manifestCid:m.manifestCid,status:"loading",workerId:l.workerId??null,generatedRequests:0,
components:null};d.set(f,h);let a;try{const g=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));
if(U(l.signal),!g||(k=g.info)!=null&&k.isFallbackAdapter||g.isFallbackAdapter)throw new Error("A hardware WebGPU adapter\
 is required; CPU/software fallback is disabled");const _=typeof p.model.dtype=="string"?[p.model.dtype]:Object.values(p.
model.dtype),D=new Set(p.model.requiredFeatures??[]);_.some(S=>["fp16","q4f16"].includes(S))&&D.add("shader-f16");for(const S of D)
if(!g.features.has(S))throw new Error(`Model requires unsupported GPU feature: ${S}`);h.adapter={vendor:((b=g.info)==null?
void 0:b.vendor)??"",architecture:((y=g.info)==null?void 0:y.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...D]};
const Q=await(M??(M=e()));if(U(l.signal),Q.env.version!==qe)throw new Error("Unexpected Transformers runtime version");const K=new URL(
"/__peercompute_models/",n);a=Mt(m.artifactPort,{manifest:p,baseUrl:new URL(`${f}/`,K).href,signal:l.signal});const{env:O}=Q;
O.logLevel=50,O.allowLocalModels=!0,O.allowRemoteModels=!1,O.localModelPath=K.pathname,O.useBrowserCache=!1,O.useFSCache=
!1,O.useWasmCache=!1,O.fetch=async(...S)=>{var B;try{return await a.fetch(...S)}catch(z){throw(B=l.emitProgress)==null||
B.call(l,{type:"artifact-read-error",sessionId:f,message:z.message}),z}},O.backends.onnx.wasm.proxy=!1,O.backends.onnx.wasm.
numThreads=1,O.backends.onnx.wasm.wasmPaths=q,h.gpuDispatches=0,h.gpuProfileSamples=0,h.gpuSubmissions=0,h.collectGpuEvidence=
m.collectGpuEvidence===!0,O.backends.onnx.webgpu&&(O.backends.onnx.webgpu.profiling={mode:m.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{h.gpuProfileSamples+=1}});const Z={local_files_only:!0,device:"webgpu",dtype:p.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:S=>{var B,z;(B=l.signal)!=null&&B.aborted||(z=l.emitProgress)==null||z.
call(l,{type:"model-load",sessionId:f,status:String(S.status??"").slice(0,40),file:typeof S.file=="string"?S.file.slice(
0,512):void 0,loaded:Number.isFinite(S.loaded)?S.loaded:void 0,total:Number.isFinite(S.total)?S.total:void 0})}};h.library=
Q,h.components=await t({library:Q,modelPath:f,options:Z,manifest:p}),U(l.signal);const v=await((E=O.backends.onnx.webgpu)==
null?void 0:E.device);if(h.runtimeDevice=v,h.runtimeFeatures=[...(v==null?void 0:v.features)??[]],h.collectGpuEvidence&&
v){const S=v.createCommandEncoder.bind(v),B=v.queue.submit.bind(v.queue),z=Object.getOwnPropertyDescriptor(v,"createComm\
andEncoder"),H=Object.getOwnPropertyDescriptor(v.queue,"submit");h.restoreGpuEvidence=()=>{z?Object.defineProperty(v,"cr\
eateCommandEncoder",z):delete v.createCommandEncoder,H?Object.defineProperty(v.queue,"submit",H):delete v.queue.submit,h.
restoreGpuEvidence=null},v.createCommandEncoder=(...j)=>{const F=S(...j),ee=F.beginComputePass.bind(F);return F.beginComputePass=
(...V)=>{const R=ee(...V);for(const N of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const de=R[N].bind(R);R[N]=
(...$)=>{const ue=de(...$);return h.gpuDispatches+=1,ue}}return R},F},v.queue.submit=(...j)=>{const F=B(...j);return h.gpuSubmissions+=
1,F}}const T=(v==null?void 0:v.adapterInfo)??((w=(x=O.backends.onnx.webgpu)==null?void 0:x.adapter)==null?void 0:w.info);
if(T){if(T.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");h.runtimeAdapter={vendor:T.vendor,architecture:T.
architecture,isFallbackAdapter:T.isFallbackAdapter??!1}}return v!=null&&v.lost&&v.lost.then(()=>{var S;d.get(f)===h&&(h.
lost=!0,(S=h.active)==null||S.abort("GPU device lost"))}),U(l.signal),h.status="ready",Se(h)}catch(g){try{await be(h.components),
(C=h.restoreGpuEvidence)==null||C.call(h),d.delete(f)}catch(_){h.status="ready",h.lost=!0;const D=new Error(`MODEL_DISPO\
SE_FAILED: ${_.message}`);throw D.code="MODEL_DISPOSE_FAILED",D}throw g}finally{a==null||a.close(),a||m.artifactPort.close()}}
async function u(m,l){var Q,K,O,Z,v;const f=d.get(te(m.sessionId));if(!f||f.lost)throw new Error("Model session lost or \
not loaded");if(f.status!=="ready")throw new Error("Model session is busy");const p=te(m.requestId),q=m.maxNewTokens??P.
maxNewTokens;if(!Number.isInteger(q)||q<1||q>P.maxNewTokens)throw new Error("Generation exceeds its output-token budget");
let h=Te(m);const a=Pe(m.image);if(a&&f.manifest.model.task!=="image-text-to-text")throw new Error("This model does not \
admit image inputs");U(l.signal);const c=new AbortController,k=new f.library.InterruptableStoppingCriteria,b=()=>{var T;
c.abort((T=l.signal)==null?void 0:T.reason),k.interrupt()};(Q=l.signal)==null||Q.addEventListener("abort",b,{once:!0}),c.
signal.addEventListener("abort",()=>k.interrupt(),{once:!0}),f.active=c,f.requestId=p,f.status="generating";let y,E,x=0,
w=0,C,g=!1;const _=f.gpuDispatches??0,D=f.gpuSubmissions??0;try{U(l.signal);const{tokenizer:T,processor:S,model:B}=f.components;
let z;for(;;){U(c.signal);let V=h;if(S&&(V=h.map($=>({role:$.role,content:[{type:"text",text:$.content}]})),a)){const $=V.
findLast(ue=>ue.role==="user");if(!$)throw new Error("An image requires a user message");$.content.unshift({type:"image"})}
const R=(S??T).apply_chat_template(V,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof R!="string"||ne(
R)>P.maxPromptBytes)throw new Error("Templated prompt exceeds its byte budget");if(a){const $=new f.library.RawImage(a.data,
a.width,a.height,a.channels);y=await S(R,$,{do_image_splitting:!1})}else y=await T(R,{truncation:!1,padding:!1});if(U(c.
signal),z=(O=(K=y.input_ids)==null?void 0:K.dims)==null?void 0:O.at(-1),!Number.isSafeInteger(z)||z<1)throw new Error("I\
nvalid model input token count");if(z+q<=P.maxContextTokens)break;const N=Ot(h);if(!N)throw new Error("Latest prompt/ima\
ge and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const de=y;y=void 0,
oe(de),h=N,g=!0}U(c.signal);const H=new f.library.TextStreamer(T,{skip_prompt:!0,skip_special_tokens:!0,callback_function:V=>{
var R;if(!(c.signal.aborted||C)){if(w+=ne(V),w>P.maxOutputBytes){C=new Error("Generated text exceeded its byte budget"),
c.abort(C);return}try{if(((R=l.emitProgress)==null?void 0:R.call(l,{type:"token",sessionId:f.sessionId,requestId:p,sequence:x++,
text:V}))===!1)throw new Error("Token consumer rejected output")}catch(N){C=N,c.abort(N)}}}});if(E=await B.generate({...y,
max_new_tokens:q,do_sample:!1,streamer:H,stopping_criteria:[k]}),await((Z=f.runtimeDevice)==null?void 0:Z.queue.onSubmittedWorkDone()),
C)throw C;if(f.lost)throw new Error("GPU device lost; model session is unavailable");U(c.signal);const j=E.tolist();if(j.
length!==1||j[0].length<z||j[0].length>z+q)throw new Error("Model returned an over-budget token sequence");const F=j[0].
slice(z),ee=T.decode(F,{skip_special_tokens:!0});if(ne(ee)>P.maxOutputBytes)throw new Error("Generated text exceeds its \
byte budget");return f.generatedRequests+=1,{sessionId:f.sessionId,requestId:p,text:ee,inputTokens:z,outputTokens:F.length,
finishReason:qt(B,F,q),contextTruncated:g,workerId:f.workerId,gpuDispatches:(f.gpuDispatches??0)-_,gpuSubmissions:(f.gpuSubmissions??
0)-D,gpuProfileSamples:f.gpuProfileSamples??0}}finally{(v=l.signal)==null||v.removeEventListener("abort",b);try{const T=new Set;
oe(y,T),oe(E,T)}finally{f.active=null,f.requestId=null,f.status="ready"}}}return async function(l={},f={}){var q,h;if(o(),
l.command==="load")return A(l,f);if(l.command==="generate")return u(l,f);const p=d.get(te(l.sessionId));if(l.command==="\
status")return p?Se(p):{sessionId:l.sessionId,status:"absent"};if(l.command==="cancel")return(p==null?void 0:p.requestId)===
l.requestId&&((q=p.active)==null||q.abort("Generation cancelled")),{sessionId:l.sessionId,cancellationRequested:!0};if(l.
command==="unload"){if(!p)return{sessionId:l.sessionId,status:"absent"};if(p.status!=="ready")throw new Error("Cancel an\
d await active model work before unloading");p.status="unloading";try{await be(p.components),(h=p.restoreGpuEvidence)==null||
h.call(p)}catch(a){p.status="ready",p.lost=!0;const c=new Error(`MODEL_DISPOSE_FAILED: ${a.message}`);throw c.code="MODE\
L_DISPOSE_FAILED",c}return d.delete(l.sessionId),{sessionId:l.sessionId,status:"unloaded"}}throw new Error("Unknown mode\
l task command")}}const Lt=Ue(),Pt=(e,t)=>Lt(e,t);var Ut=Object.freeze({__proto__:null,createModelTaskRuntime:Ue,handleModelTask:Pt,
normalizeModelMessages:Te,validateImageInput:Pe});export{St as A,L as C,P as M,we as a,ge as b,Ut as m,Te as n,U as t,te as v};
