function lt(e,t){if(typeof e?.createBuffer!="function")return()=>{};const r=Object.getOwnPropertyDescriptor(e,"createBuf\
fer"),n=e.createBuffer;let s=0;const i=function(...o){const d=n.apply(e,o),u=d.size??o[0]?.size;if(!Number.isSafeInteger(
u)||u<0||!Number.isSafeInteger(s+u))return d;s+=u,t.requestedGpuBufferPeakBytes=Math.max(t.requestedGpuBufferPeakBytes??
0,s);const l=d.destroy;let h=!1;if(typeof l=="function")try{d.destroy=function(...f){const m=l.apply(this,f);return h||(h=
!0,s-=u),m}}catch{}return d};try{e.createBuffer=i}catch{return()=>{}}return()=>{e.createBuffer===i&&(r?Object.defineProperty(
e,"createBuffer",r):delete e.createBuffer)}}function we(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<
e.byteLength;r++)if(e[r]!==t[r])return!1;return!0}function Q(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8A\
rray")return U(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return U(new Uint8Array(
e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function be(e){return e?.buffer instanceof
ArrayBuffer}function U(e){return be(e)?e:e.slice()}function ge(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too\
 long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<e.length;i++){var o=e.charAt(i),d=o.charCodeAt(
0);if(n[d]!==255)throw new TypeError(o+" is ambiguous");if(n[d]=i,r){var u=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().
charCodeAt(0);u!==d&&(n[u]=i),l!==d&&(n[l]=i)}}var h=e.length,f=e.charAt(0),m=Math.log(h)/Math.log(256),L=Math.log(256)/
Math.log(h);function E(a){if(a instanceof Uint8Array||(ArrayBuffer.isView(a)?a=new Uint8Array(a.buffer,a.byteOffset,a.byteLength):
Array.isArray(a)&&(a=Uint8Array.from(a))),!(a instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(a.length===
0)return"";for(var c=0,w=0,p=0,O=a.length;p!==O&&a[p]===0;)p++,c++;for(var v=(O-p)*L+1>>>0,b=new Uint8Array(v);p!==O;){for(var y=a[p],
M=0,x=v-1;(y!==0||M<w)&&x!==-1;x--,M++)y+=256*b[x]>>>0,b[x]=y%h>>>0,y=y/h>>>0;if(y!==0)throw new Error("Non-zero carry");
w=M,p++}for(var I=v-w;I!==v&&b[I]===0;)I++;for(var j=f.repeat(c);I<v;++I)j+=e.charAt(b[I]);return j}function k(a){if(typeof a!=
"string")throw new TypeError("Expected String");if(a.length===0)return new Uint8Array;var c=0;if(a[c]!==" "){for(var w=0,
p=0;a[c]===f;)w++,c++;for(var O=(a.length-c)*m+1>>>0,v=new Uint8Array(O);a[c];){var b=n[a.charCodeAt(c)];if(b===255)return;
for(var y=0,M=O-1;(b!==0||y<p)&&M!==-1;M--,y++)b+=h*v[M]>>>0,v[M]=b%256>>>0,b=b/256>>>0;if(b!==0)throw new Error("Non-ze\
ro carry");p=y,c++}if(a[c]!==" "){for(var x=O-p;x!==O&&v[x]===0;)x++;for(var I=new Uint8Array(w+(O-x)),j=w;x!==O;)I[j++]=
v[x++];return I}}}function q(a){var c=k(a);if(c)return c;throw new Error(`Non-${t} character`)}return{encode:E,decodeUnsafe:k,
decode:q}}var ve=ge,xe=ve;class Ee{name;prefix;baseEncode;constructor(t,r,n){this.name=t,this.prefix=r,this.baseEncode=n}encode(t){
if(t instanceof Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}}
class Oe{name;prefix;baseDecode;prefixCodePoint;constructor(t,r,n){this.name=t,this.prefix=r;const s=r.codePointAt(0);if(s===
void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.baseDecode=n}decode(t){if(typeof t=="stri\
ng"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.
name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return de(this,t)}}class ze{decoders;constructor(t){this.decoders=
t}or(t){return de(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(`Unab\
le to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supporte\
d`)}}function de(e,t){return new ze({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class Me{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(t,r,n,s){
this.name=t,this.prefix=r,this.baseEncode=n,this.baseDecode=s,this.encoder=new Ee(t,r,n),this.decoder=new Oe(t,r,s)}encode(t){
return this.encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function fe({name:e,prefix:t,encode:r,decode:n}){
return new Me(e,t,r,n)}function V({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=xe(r,e,n);
return fe({prefix:t,name:e,encode:s,decode:o=>Q(i(o))})}function Ae(e,t,r,n){let s=e.length;for(;e[s-1]==="=";)--s;const i=new Uint8Array(
s*r/8|0);let o=0,d=0,u=0;for(let l=0;l<s;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);
d=d<<r|h,o+=r,o>=8&&(o-=8,i[u++]=255&d>>o)}if(o>=r||(255&d<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Ie(e,t,r){const n=t[t.length-1]==="=",s=(1<<r)-1;let i="",o=0,d=0;for(let u=0;u<e.length;++u)for(d=d<<8|e[u],o+=
8;o>r;)o-=r,i+=t[s&d>>o];if(o!==0&&(i+=t[s&d<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function _e(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const s=e[n].toLowerCase(),i=e[n].toUpperCase();s!==e[n]&&(r[s]=n),i!==e[n]&&
(r[i]=n)}return r}function _({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=_e(n,s);return fe(
{prefix:t,name:e,encode(o){return Ie(o,n,r)},decode(o){return Ae(o,i,r,e)}})}const R=_({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});_({prefix:"B",name:"base32upper",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});_({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqr\
stuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});_({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUV\
WXYZ234567=",bitsPerChar:5,caseInsensitive:!0});_({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});_({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});_({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
_({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});_(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const H=V({prefix:"k",name:"base3\
6",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});V({prefix:"K",name:"base36upper",alphabet:"01234\
56789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const S=V({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGH\
JKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});V({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvw\
xyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Ce=ue,te=128,Se=-128,Be=Math.pow(2,31);function ue(e,t,r){t=t||[],r=r||0;for(var n=r;e>=
Be;)t[r++]=e&255|te,e/=128;for(;e&Se;)t[r++]=e&255|te,e>>>=7;return t[r]=e|0,ue.bytes=r-n+1,t}var Le=K,ke=128,re=127;function K(e,n){
var r=0,n=n||0,s=0,i=n,o,d=e.length;do{if(i>=d)throw K.bytes=0,new RangeError("Could not decode varint");o=e[i++],r+=s<28?
(o&re)<<s:(o&re)*Math.pow(2,s),s+=7}while(o>=ke);return K.bytes=i-n,r}var qe=Math.pow(2,7),Ne=Math.pow(2,14),Ue=Math.pow(
2,21),je=Math.pow(2,28),Pe=Math.pow(2,35),Re=Math.pow(2,42),Te=Math.pow(2,49),De=Math.pow(2,56),$e=Math.pow(2,63),Fe=function(e){
return e<qe?1:e<Ne?2:e<Ue?3:e<je?4:e<Pe?5:e<Re?6:e<Te?7:e<De?8:e<$e?9:10},Ve={encode:Ce,decode:Le,encodingLength:Fe},T=Ve;
function J(e,t=0){const r=T.decode(e,t),n=T.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&
e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,n]}function D(e,t,r=0){return T.encode(
e,t,r),t}function $(e){return T.encodingLength(e)}function Ge(e,t){const r=t.byteLength,n=$(e),s=n+$(r),i=new Uint8Array(
s+r);return D(e,i,0),D(r,i,n),i.set(t,s),new Z(e,r,t,i)}function He(e){const t=Q(e),[r,n]=J(t),[s,i]=J(t.subarray(n)),o=t.
subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new Z(r,s,o,t)}function Ke(e,t){if(e===t)return!0;
{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&we(e.bytes,r.bytes)}}class Z{code;size;digest;bytes;constructor(t,r,n,s){
this.code=t,this.size=r,this.digest=U(n),this.bytes=U(s)}}function ne(e,t){const{bytes:r,version:n}=e;switch(n){case 0:return We(
r,W(e),t??S.encoder);default:return Xe(r,W(e),t??R.encoder)}}const se=new WeakMap;function W(e){const t=se.get(e);if(t==
null){const r=new Map;return se.set(e,r),r}return t}class g{code;version;multihash;bytes;"/";constructor(t,r,n,s){this.code=
r,this.version=t,this.multihash=n,this.bytes=U(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.
bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{
code:t,multihash:r}=this;if(t!==N)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Ye)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return g.createV0(r)}default:throw Error(`Can not convert CID vers\
ion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.
multihash,n=Ge(t,r);return g.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(t){return g.equals(this,t)}static equals(t,r){const n=r;return n!=
null&&t.code===n.code&&t.version===n.version&&Ke(t.multihash,n.multihash)}toString(t){return ne(this,t)}toJSON(){return{
"/":ne(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof g)return r;if(r["/"]!=null&&r["/"]===r.bytes||
r.asCID===r){const{version:n,code:s,multihash:i,bytes:o}=r;return new g(n,s,i,o??ie(n,s,i.bytes))}else if(r[Qe]===!0){const{
version:n,multihash:s,code:i}=r,o=He(s);return g.create(n,i,o)}else return null}static create(t,r,n){if(typeof r!="numbe\
r")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid\
 digest");switch(t){case 0:{if(r!==N)throw new Error(`Version 0 CID must use dag-pb (code: ${N}) block encoding`);return new g(
t,r,n,n.bytes)}case 1:{const s=ie(t,r,n.bytes);return new g(t,r,n,s)}default:throw new Error("Invalid version")}}static createV0(t){
return g.create(0,N,t)}static createV1(t,r){return g.create(1,t,r)}static decode(t){const[r,n]=g.decodeFirst(t);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(t){const r=g.inspectBytes(t),n=r.size-r.multihashSize,
s=Q(t.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new Z(r.multihashCode,r.digestSize,i,s);return[r.version===0?g.createV0(o):g.createV1(r.
codec,o),t.subarray(r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[f,m]=J(t.subarray(r));return r+=m,f};let s=n(),
i=N;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,d=n(),u=n(),l=r+u,
h=l-o;return{version:s,codec:i,multihashCode:d,digestSize:u,multihashSize:h,size:l}}static parse(t,r){const[n,s]=Je(t,r),
i=g.decode(s);if(i.version===0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return W(
i).set(n,t),i}}function Je(e,t){switch(e[0]){case"Q":{const r=t??S;return[S.prefix,r.decode(`${S.prefix}${e}`)]}case S.prefix:{
const r=t??S;return[S.prefix,r.decode(e)]}case R.prefix:{const r=t??R;return[R.prefix,r.decode(e)]}case H.prefix:{const r=t??
H;return[H.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID mul\
tibase decoder must be provided");return[e[0],t.decode(e)]}}}function We(e,t,r){const{prefix:n}=r;if(n!==S.prefix)throw Error(
`Cannot string encode V0 in ${r.name} encoding`);const s=t.get(n);if(s==null){const i=r.encode(e).slice(1);return t.set(
n,i),i}else return s}function Xe(e,t,r){const{prefix:n}=r,s=t.get(n);if(s==null){const i=r.encode(e);return t.set(n,i),i}else
return s}const N=112,Ye=18;function ie(e,t,r){const n=$(e),s=n+$(t),i=new Uint8Array(s+r.byteLength);return D(e,i,0),D(t,
i,n),i.set(r,s),i}const Qe=Symbol.for("@ipld/js-cid/CID"),F=1024**3,B=Object.freeze({maximumBytes:8*F,maximumFileBytes:2*
F-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*1024**2}),le=Object.freeze(["q4","q4f16","q8",
"fp16","fp32"]),Ze=["qwen2","qwen3","llama"],oe=["phi","phi3","gemma","gemma2","gemma3_text","mistral","granite","starco\
der2","smollm3","olmo","olmo2","nemotron_h"],ae=["idefics3","smolvlm","qwen3_5"],et=["llama","qwen2","qwen3","qwen35","g\
emma","gemma2","gemma3","gemma4","phi3","phi2","granite","starcoder2","olmo","olmo2","stablelm","nemotron","smollm3"],he=Object.
freeze([...[...Ze,...oe,...ae].map(e=>{const t=ae.includes(e);return Object.freeze({runtime:"transformers.js",runtimeVersion:"\
4.3.2",architecture:e,task:t?"image-text-to-text":"text-generation",qualification:"candidate",modalities:Object.freeze(t?
["text","image"]:["text"]),modules:Object.freeze(t?["embed_tokens","vision_encoder","decoder_model_merged"]:["model"]),dtypes:e===
"qwen3_5"?Object.freeze(["q4"]):le,requiresMemoryProfile:oe.includes(e),contextTokens:2048,maximumBytes:t?e==="qwen3_5"?
2*F:B.legacyMaximumBytes:B.maximumBytes,maximumFileBytes:B.maximumFileBytes})}),...et.map(e=>Object.freeze({runtime:"lla\
ma.cpp",runtimeVersion:"3.8.1",architecture:e,modelArchitecture:e==="qwen35"?"qwen3_5":e,task:"text-generation",modalities:Object.
freeze(["text"]),qualification:"candidate"}))]);function ee(e,t){return he.find(r=>r.runtime===e&&r.architecture===t)??null}
function ht(e){return he.filter(t=>t.runtime===e)}function tt(e){const t=typeof e=="string"?[e]:e&&typeof e=="object"&&!Array.
isArray(e)?Object.values(e):[];if(!t.length||t.length>16||t.some(r=>!le.includes(r)))throw new Error("Unsupported ONNX p\
recision");return t}function me(e){const t=e?.["transformers.js_config"]??{},r=t.device_config??{};return Object.hasOwn(
r,"webgpu")?{...t,...r.webgpu}:{...t}}function rt(e,t={}){const r=tt(e),n=me(t).kv_cache_dtype;return r.some(i=>["fp16",
"q4f16"].includes(i)||(typeof n=="string"?n:n?.[i])==="float16")?["shader-f16"]:[]}function z(e,t,r=1048576,n=1){if(!Number.
isSafeInteger(e)||e<n||e>r)throw new Error(`Invalid model memory dimension: ${t}`);return e}function nt(e){const t=me(e).
free_dimension_overrides;if(t&&(typeof t!="object"||Array.isArray(t)||Object.keys(t).length))throw new Error("Dynamic ON\
NX free_dimension_overrides are not admitted by this memory profile");const r=e?.model_type,n=ee("transformers.js",r);if(!n)
throw new Error("Unsupported model memory architecture");const s=n.task==="image-text-to-text"?e.text_config??e:e,i=s.layer_types??
s.layers_block_type,o=z(s.num_hidden_layers??i?.length,"layers",512),d=z(s.hidden_size,"hidden size",65536),u=z(s.num_attention_heads,
"attention heads",1024),l=z(s.num_key_value_heads??u,"KV heads",1024),h=z(s.head_dim??d/u,"head dimension",4096),f=z(s.vocab_size??
e.vocab_size,"vocabulary");if(i!==void 0&&(!Array.isArray(i)||i.length!==o||i.some(w=>!["attention","mamba","mlp","moe",
"full_attention","sliding_attention","linear_attention"].includes(w))))throw new Error("Invalid model memory layer types");
let m=o,L=0,E=0,k=0,q=0,a=0,c=0;if(r==="nemotron_h"){if(!i)throw new Error("Nemotron requires explicit recurrent layer t\
ypes");if(m=i.filter(p=>p==="attention").length,L=i.filter(p=>p==="mamba").length,i.some(p=>!["attention","mamba","mlp",
"moe"].includes(p)))throw new Error("Unsupported Nemotron layer type");q=z(s.mamba_num_heads,"SSM heads",1024),a=z(s.mamba_head_dim,
"SSM head dimension",4096),c=z(s.ssm_state_size,"SSM state size",4096);const w=z(s.n_groups,"SSM groups",1024);k=z(s.conv_kernel,
"convolution kernel",256),E=z(q*a+2*w*c,"convolution channels")}return G({schema:"peercompute.onnx.memory.v1",architecture:r,
layers:o,hiddenSize:d,heads:u,kvHeads:l,headDim:h,vocabulary:f,attentionLayers:m,recurrentLayers:L,convChannels:E,convKernel:k,
ssmHeads:q,ssmHeadDim:a,stateSize:c})}function G(e){const t=["schema","architecture","layers","hiddenSize","heads","kvHe\
ads","headDim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","sta\
teSize"];if(!e||e.schema!=="peercompute.onnx.memory.v1"||!ee("transformers.js",e.architecture)||Object.keys(e).some(n=>!t.
includes(n)))throw new Error("Invalid model memory profile");for(const n of t.slice(2))z(e[n],n,1048576,["attentionLayer\
s","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(e.layers>512||
e.attentionLayers+e.recurrentLayers>e.layers||e.kvHeads>e.heads||e.architecture!=="nemotron_h"&&e.recurrentLayers)throw new Error(
"Invalid model memory layer geometry");const r=2*(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*
e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*F)throw new Error("Model cach\
e/state exceeds its bounded memory envelope");return Object.fromEntries(t.map(n=>[n,e[n]]))}function st(e){const t=G(e);
return 2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*t.ssmHeadDim*t.stateSize+t.convChannels*
t.convKernel)*4)}function it(e,t){if(t?.model_type!==e.architecture)throw new Error("Model config architecture does not \
match its admitted manifest");if(t.auto_map&&Object.keys(t.auto_map).length)throw new Error("Custom model code is not ad\
mitted");if(e.memoryProfile&&JSON.stringify(G(e.memoryProfile))!==JSON.stringify(nt(t)))throw new Error("Model memory pr\
ofile differs from its verified config");return rt(e.dtype,t)}const ce="transformers.js",ot="4.3.2",A=Object.freeze({maxManifestBytes:256*
1024,maxFiles:1024,maxModelBytes:B.maximumBytes,maxFileBytes:B.maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,
maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*
1024,maxImageBytes:4*1024*1024}),at=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:A.maxFileBytes,minimumCpuBytes:8*
1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),ye=Object.freeze({maxModelBytes:A.maxModelBytes,maxFileBytes:A.
maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:A.maxImagePixels}),ct=Object.freeze({...ye,maxModelBytes:B.
legacyMaximumBytes});function dt(e,{files:t,totalBytes:r,config:n}={}){const s=e?.architecture==="qwen3_5"?at:["idefics3",
"smolvlm"].includes(e?.architecture)?ct:ye;if(n&&it(e,n),t){r=0;for(const l of t){if(!Number.isSafeInteger(l.size)||l.size<
0)throw new Error("Invalid model file size");if(l.size>A.maxFileBytes)throw Object.assign(new Error("Model file exceeds \
its bounded file budget (each ONNX file must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=l.size}}if(r!==
void 0&&(!Number.isSafeInteger(r)||r<0||r>s.maxModelBytes))throw Object.assign(new Error(`Model exceeds its admitted fil\
e budget of ${s.maxModelBytes/1024**3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const i=e?.memoryProfile&&G(e.memoryProfile);
if(i&&i.architecture!==e.architecture)throw new Error("Model memory architecture mismatch");if(!i&&!(r>B.legacyMaximumBytes))
return s;const o=r??0,d=i?st(i):0,u=1024**3;return{...s,minimumCpuBytes:Math.max(s.minimumCpuBytes,2*o+2*u+d),minimumGpuBytes:Math.
max(s.minimumGpuBytes,2*o+u+d),cacheBytes:d}}function X(e="Operation cancelled"){return e?.name==="AbortError"?e:new DOMException(
typeof e=="string"?e:"Operation cancelled","AbortError")}function P(e){if(e?.aborted)throw X(e.reason)}function mt(e){if(typeof e!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(e))throw new Error("Invalid model session ID");return e}function Y(e){if(typeof e!=
"string"||!e||new TextEncoder().encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(e)||e.startsWith("/")||e.split(
"/").some(t=>!t||t==="."||t===".."))throw new Error("Invalid model artifact path");return e}function yt(e){let t;try{t=JSON.
stringify(e)}catch{throw new Error("Invalid model manifest")}if(!t||new TextEncoder().encode(t).length>A.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(t);if(r.model?.composition!==void 0)throw new Error(
"This ONNX runtime does not support model adapters");if(r.schema!=="peercompute.artifact.manifest.v1"||!Array.isArray(r.
files)||!r.files.length||r.files.length>A.maxFiles)throw new Error("Invalid model manifest files");const n=new Set,s=dt(
r.model,{files:r.files});let i=0;for(const f of r.files){if(Y(f.path),n.has(f.path))throw new Error("Duplicate model art\
ifact path");n.add(f.path);const m=g.parse(f.cid);if(![85,112].includes(m.code)||m.multihash.code!==18||m.multihash.size!==
32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(f.size)||f.size<0||!/^[a-f0-9]{64}$/i.test(
f.sha256??""))throw new Error("Invalid model file size/digest");if(f.sha256=f.sha256.toLowerCase(),i+=f.size,!Number.isSafeInteger(
i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=r.model,d=ee(ce,o?.architecture);
if(o?.runtime!==ce||o.runtimeVersion!==ot||!d)throw new Error("Model runtime, architecture or dtype is not approved");if(o.
task??=d.task,o.task!==d.task)throw new Error("Model task does not match its admitted architecture");if((d.requiresMemoryProfile||
d.task==="text-generation"&&i>B.legacyMaximumBytes)&&!o.memoryProfile)throw new Error("This model requires a verified co\
nfig memory profile");const u=typeof o.dtype=="string"?[["model",o.dtype]]:o.dtype&&typeof o.dtype=="object"&&!Array.isArray(
o.dtype)?Object.entries(o.dtype):[];if(!u.length||u.length>16||u.some(([f,m])=>!/^[A-Za-z0-9_-]{1,100}$/.test(f)||!["fp3\
2","fp16","q4","q4f16","q8"].includes(m)))throw new Error("Invalid model dtype configuration");if(o.architecture==="qwen\
3_5"&&u.some(([,f])=>f!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=f=>f==="fp32"?"":
f==="q8"?"_quantized":`_${f}`,h=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof o.dtype!="string"||o.
task==="text-generation")&&h.push(...u.map(([f,m])=>`onnx/${f}${l(m)}.onnx`)),o.task==="image-text-to-text")for(const f of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const m=typeof o.dtype=="string"?o.dtype:o.dtype[f];if(!m)throw new Error(
"Multimodal dtype configuration is missing a module");h.push(`onnx/${f}${l(m)}.onnx`),o.architecture==="qwen3_5"&&h.push(
`onnx/${f}${l(m)}.onnx_data`)}if(h.some(f=>!n.has(f)))throw new Error("Incomplete model package");if(o.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(o.requiredFeatures!==void 0&&(!Array.isArray(o.requiredFeatures)||o.requiredFeatures.length>
32||o.requiredFeatures.some(f=>typeof f!="string"||f.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,
totalBytes:i,resourcePolicy:s}}function pt(e,t){const r=new URL(t),n={};for(const s of["mjs","wasm"]){if(typeof e?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(e[s],r);if(i.origin!==r.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const ft="peercompute.model-artifact-read.v1",pe=ft;function ut(e,t){
const r=n=>t(n.data);return e.addEventListener("message",r),e.start?.(),()=>e.removeEventListener("message",r)}function C(e,t,r=[]){
e.postMessage({protocol:pe,...t},r)}function wt(e,{manifest:t,baseUrl:r,signal:n,chunkBytes:s=A.chunkBytes,maxReads:i=A.
maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>A.maxReads||!Number.isInteger(o)||o<0||o>32)throw new RangeError(
"Invalid artifact reader limits");const d=new URL(r),u=new Map(t.files.map(a=>[Y(a.path),a])),l=new Map,h=[];let f=0,m=!1;
function L(){for(;!m&&l.size<i&&h.length;){const a=h.shift();l.set(a.id,a),a.active=!0,C(e,{type:"open",id:a.id,path:a.path})}}
function E(a,c){l.delete(a.id);const w=h.indexOf(a);if(w>=0&&h.splice(w,1),n?.removeEventListener("abort",a.abort),a.requestSignal?.
removeEventListener("abort",a.abort),c){a.reject?.(c);try{a.streamController?.error(c)}catch{}}a.resolvePull?.(),L()}const k=ut(
e,a=>{if(a?.protocol!==pe)return;const c=l.get(a.id);if(c){if(a.type==="error"){E(c,new Error(a.message));return}if(a.type===
"ready"){if(c.ready||a.size!==c.file.size){E(c,new Error("Invalid artifact response size")),C(e,{type:"cancel",id:c.id});
return}c.ready=!0,C(e,{type:"pull",id:c.id})}else if(a.type==="chunk"){if(!c.ready||!c.resolvePull||!(a.bytes instanceof
Uint8Array)||!a.bytes.byteLength||a.bytes.byteLength>s||c.received+a.bytes.byteLength>c.file.size){C(e,{type:"cancel",id:c.
id}),E(c,new Error("Invalid artifact chunk"));return}c.received+=a.bytes.byteLength,c.streamController.enqueue(a.bytes);
const w=c.resolvePull;c.resolvePull=null,w()}else a.type==="end"&&(!c.ready||c.received!==c.file.size?E(c,new Error("Tru\
ncated artifact response")):(c.streamController.close(),E(c)))}});async function q(a,c={}){if(m)throw new Error("Artifac\
t bridge is closed");if(P(n),P(c.signal),c.method&&c.method!=="GET")throw new Error("Model adapter supports GET only");const w=String(
a);if(/[\\]/.test(w)||/%(?:2e|2f|5c|00)/i.test(w)||/\/(?:\.|\.\.)(?:\/|$)/.test(w))throw new Error("Invalid artifact URL");
const p=new URL(w,d);if(p.origin!==d.origin||p.username||p.password||p.search||p.hash||!p.pathname.startsWith(d.pathname))
throw new Error("Model path is outside its manifest");const O=Y(decodeURIComponent(p.pathname.slice(d.pathname.length))),
v=u.get(O);if(!v)return new Response("Artifact path is not in the manifest",{status:404});const b=`read-${++f}`,y={id:b,
path:O,file:v,requestSignal:c.signal,received:0,ready:!1,active:!1,queued:!1};y.abort=()=>{y.active&&C(e,{type:"cancel",
id:b}),E(y,X(n?.reason??c.signal?.reason))};const M=new ReadableStream({start(x){y.streamController=x},pull(){if(m)throw new Error(
"Artifact bridge is closed");if(P(n),P(c.signal),!y.active&&!y.queued&&l.size>=i&&h.length>=o)throw new Error("Artifact \
reader limit reached");return new Promise(x=>{y.resolvePull=x,y.ready?C(e,{type:"pull",id:b}):y.queued||(y.queued=!0,n?.
addEventListener("abort",y.abort,{once:!0}),c.signal?.addEventListener("abort",y.abort,{once:!0}),h.push(y),L())})},cancel(){
y.active&&C(e,{type:"cancel",id:b}),E(y)}},{highWaterMark:0});return new Response(M,{headers:{"Content-Length":String(v.
size),"Content-Type":v.mediaType||"application/octet-stream"}})}return{fetch:q,close(a="Artifact bridge closed"){if(!m){
m=!0;for(const c of[...l.values(),...h])c.active&&C(e,{type:"cancel",id:c.id}),E(c,X(a));k(),e.close()}}}}export{ft as A,g as C,A as M,mt as a,X as b,Ge as c,wt as d,pt as e,yt as f,ot as g,it as h,ht as l,dt as m,lt as o,P as t,
Y as v};
