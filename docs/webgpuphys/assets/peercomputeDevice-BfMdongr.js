var Ei=Object.defineProperty;var vi=(e,t,r)=>t in e?Ei(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var h=(e,t,r)=>vi(e,typeof t!="symbol"?t+"":t,r);import{i as Ai}from"./device-B4S7QtIr.js";const Si="modulepreload",xi=function(e,t){return new URL(e,t).href},Ar={},Ii=function(t,r,n){let i=Promise.resolve();if(r&&
r.length>0){let s=function(b){return Promise.all(b.map(g=>Promise.resolve(g).then(f=>({status:"fulfilled",value:f}),f=>({
status:"rejected",reason:f}))))};const a=document.getElementsByTagName("link"),d=document.querySelector("meta[property=c\
sp-nonce]"),l=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));i=s(r.map(b=>{if(b=xi(b,n),b in Ar)return;
Ar[b]=!0;const g=b.endsWith(".css"),f=g?'[rel="stylesheet"]':"";if(!!n)for(let S=a.length-1;S>=0;S--){const m=a[S];if(m.
href===b&&(!g||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${b}"]${f}`))return;const p=document.
createElement("link");if(p.rel=g?"stylesheet":Si,g||(p.as="script"),p.crossOrigin="",p.href=b,l&&p.setAttribute("nonce",
l),document.head.appendChild(p),g)return new Promise((S,m)=>{p.addEventListener("load",S),p.addEventListener("error",()=>m(
new Error(`Unable to preload CSS for ${b}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});
if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="re\
jected"&&o(a.reason);return t().catch(o)})};class Ti{constructor(){h(this,"index",0);h(this,"input","")}new(t){return this.
index=0,this.input=t,this}readAtomically(t){const r=this.index,n=t();return n===void 0&&(this.index=r),n}parseWith(t){const r=t();
if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){
if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(t){return this.readAtomically(()=>{const r=this.
readChar();if(r===t)return r})}readSeparator(t,r,n){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(t)===void 0))
return n()})}readNumber(t,r,n,i){return this.readAtomically(()=>{let o=0,s=0;const a=this.peekChar();if(a===void 0)return;
const d=a==="0",l=2**(8*i)-1;for(;;){const b=this.readAtomically(()=>{const g=this.readChar();if(g===void 0)return;const f=Number.
parseInt(g,t);if(!Number.isNaN(f))return f});if(b===void 0)break;if(o*=t,o+=b,o>l||(s+=1,r!==void 0&&s>r))return}if(s!==
0)return!n&&d&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{const t=new Uint8Array(4);for(let r=0;r<t.length;r++){
const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;t[r]=n}return t})}readIPv6Addr(){const t=r=>{
for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.readSeparator(":",n,()=>this.readIPv4Addr());if(s!==
void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}const o=this.readSeparator(":",n,()=>this.readNumber(
16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(
16),[n,i]=t(r);if(n===16)return r;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(
14),s=16-(n+2),[a]=t(o.subarray(0,s));return r.set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.
readIPv6Addr()}}const Ci=45,Oi=15,dt=new Ti;function Ri(e){if(!(e.length>Oi))return dt.new(e).parseWith(()=>dt.readIPv4Addr())}
function Ni(e){if(e.includes("%")&&(e=e.split("%")[0]),!(e.length>Ci))return dt.new(e).parseWith(()=>dt.readIPv6Addr())}
function wn(e){return!!Ri(e)}function _i(e){return!!Ni(e)}function En(e=0){return new Uint8Array(e)}function Mi(e){return(e==
null?void 0:e.buffer)instanceof ArrayBuffer}function Ui(e){if(Mi(e))return e;const t=e.slice();return new Uint8Array(t.buffer,
0,t.byteLength)}function vn(e,t){t==null&&(t=e.reduce((i,o)=>i+o.length,0));const r=En(t);let n=0;for(const i of e)r.set(
i,n),n+=i.length;return Ui(r)}function Bi(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.
byteLength;r++)if(e[r]!==t[r])return!1;return!0}function We(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Ar\
ray")return He(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return He(new Uint8Array(
e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function Di(e){const t=new Uint8Array(
e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}const Sr=4096;function ki(e){const t=e.length;if(t<=Sr)
return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.subarray(n,n+=Sr));
return r}function Li(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function He(e){return Li(e)?e:e.slice()}function Pi(e,t,r){
if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var d=s.
toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==a&&(n[l]=o)}}var b=e.length,g=e.charAt(0),
f=Math.log(b)/Math.log(256),y=Math.log(256)/Math.log(b);function p(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var u=0,C=0,w=0,I=c.length;w!==I&&c[w]===0;)w++,
u++;for(var x=(I-w)*y+1>>>0,A=new Uint8Array(x);w!==I;){for(var E=c[w],R=0,v=x-1;(E!==0||R<C)&&v!==-1;v--,R++)E+=256*A[v]>>>
0,A[v]=E%b>>>0,E=E/b>>>0;if(E!==0)throw new Error("Non-zero carry");C=R,w++}for(var N=x-C;N!==x&&A[N]===0;)N++;for(var D=g.
repeat(u);N<x;++N)D+=e.charAt(A[N]);return D}function S(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var u=0;if(c[u]!==" "){for(var C=0,w=0;c[u]===g;)C++,u++;for(var I=(c.length-u)*f+
1>>>0,x=new Uint8Array(I);c[u];){var A=n[c.charCodeAt(u)];if(A===255)return;for(var E=0,R=I-1;(A!==0||E<w)&&R!==-1;R--,E++)
A+=b*x[R]>>>0,x[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");w=E,u++}if(c[u]!==" "){for(var v=I-w;v!==
I&&x[v]===0;)v++;for(var N=new Uint8Array(C+(I-v)),D=C;v!==I;)N[D++]=x[v++];return N}}}function m(c){var u=S(c);if(u)return u;
throw new Error(`Non-${t} character`)}return{encode:p,decodeUnsafe:S,decode:m}}var zi=Pi,Fi=zi;let Gi=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},$i=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseDecode");h(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return An(this,t)}},ji=class{constructor(t){h(this,"decoders");this.
decoders=t}or(t){return An(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function An(e,t){return new ji({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let qi=class{constructor(t,r,n,i){
h(this,"name");h(this,"prefix");h(this,"baseEncode");h(this,"baseDecode");h(this,"encoder");h(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Gi(t,r,n),this.decoder=new $i(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function At({name:e,prefix:t,encode:r,decode:n}){return new qi(
e,t,r,n)}function Qe({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Fi(r,e,n);return At({prefix:t,
name:e,encode:i,decode:s=>We(o(s))})}function Wi(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const b=t[e[l]];if(b===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|b,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Hi(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Vi(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function j({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Vi(n,i);return At(
{prefix:t,name:e,encode(s){return Hi(s,n,r)},decode(s){return Wi(s,o,r,e)}})}const Qi=Qe({prefix:"9",name:"base10",alphabet:"\
0123456789"}),Yi=Object.freeze(Object.defineProperty({__proto__:null,base10:Qi},Symbol.toStringTag,{value:"Module"})),Ki=j(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Xi=j({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Ji=Object.freeze(Object.defineProperty({__proto__:null,
base16:Ki,base16upper:Xi},Symbol.toStringTag,{value:"Module"})),Zi=j({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
eo=Object.freeze(Object.defineProperty({__proto__:null,base2:Zi},Symbol.toStringTag,{value:"Module"})),Sn=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),to=Sn.reduce((e,t,r)=>(e[r]=t,e),[]),ro=Sn.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${t}`);return e[n]=r,e},[]);function no(e){return e.reduce((t,r)=>(t+=to[r],t),"")}function io(e){const t=[];
for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=ro[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(t)}const oo=At({prefix:"🚀",name:"\
base256emoji",encode:no,decode:io}),so=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:oo},Symbol.toStringTag,
{value:"Module"})),_e=j({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
ao=j({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),co=j(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),fo=j({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),uo=j({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),lo=j({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),ho=j({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),po=j({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),bo=j({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),mo=Object.freeze(Object.defineProperty({__proto__:null,
base32:_e,base32hex:uo,base32hexpad:ho,base32hexpadupper:po,base32hexupper:lo,base32pad:co,base32padupper:fo,base32upper:ao,
base32z:bo},Symbol.toStringTag,{value:"Module"})),tt=Qe({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),go=Qe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
yo=Object.freeze(Object.defineProperty({__proto__:null,base36:tt,base36upper:go},Symbol.toStringTag,{value:"Module"})),he=Qe(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),wo=Qe({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Eo=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:he,base58flickr:wo},Symbol.toStringTag,{value:"Module"})),vo=j({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Ao=j({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),xn=j({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),So=j({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),xo=Object.freeze(Object.defineProperty(
{__proto__:null,base64:vo,base64pad:Ao,base64url:xn,base64urlpad:So},Symbol.toStringTag,{value:"Module"})),Io=j({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),To=Object.freeze(Object.defineProperty({__proto__:null,base8:Io},Symbol.
toStringTag,{value:"Module"})),Co=At({prefix:"\0",name:"identity",encode:e=>ki(We(e)),decode:e=>We(Di(e))}),Oo=Object.freeze(
Object.defineProperty({__proto__:null,identity:Co},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var Ro=In,xr=128,No=-128,_o=Math.pow(2,31);function In(e,t,r){t=t||[],r=r||0;for(var n=r;e>=_o;)t[r++]=e&255|xr,e/=128;for(;e&
No;)t[r++]=e&255|xr,e>>>=7;return t[r]=e|0,In.bytes=r-n+1,t}var Mo=jt,Uo=128,Ir=127;function jt(e,n){var r=0,n=n||0,i=0,
o=n,s,a=e.length;do{if(o>=a)throw jt.bytes=0,new RangeError("Could not decode varint");s=e[o++],r+=i<28?(s&Ir)<<i:(s&Ir)*
Math.pow(2,i),i+=7}while(s>=Uo);return jt.bytes=o-n,r}var Bo=Math.pow(2,7),Do=Math.pow(2,14),ko=Math.pow(2,21),Lo=Math.pow(
2,28),Po=Math.pow(2,35),zo=Math.pow(2,42),Fo=Math.pow(2,49),Go=Math.pow(2,56),$o=Math.pow(2,63),jo=function(e){return e<
Bo?1:e<Do?2:e<ko?3:e<Lo?4:e<Po?5:e<zo?6:e<Fo?7:e<Go?8:e<$o?9:10},qo={encode:Ro,decode:Mo,encodingLength:jo},ft=qo;function qt(e,t=0){
const r=ft.decode(e,t),n=ft.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function ut(e,t,r=0){return ft.encode(e,t,r),t}function lt(e){return ft.
encodingLength(e)}function Wo(e,t){const r=t.byteLength,n=lt(e),i=n+lt(r),o=new Uint8Array(i+r);return ut(e,o,0),ut(r,o,
n),o.set(t,i),new dr(e,r,t,o)}function Ho(e){const t=We(e),[r,n]=qt(t),[i,o]=qt(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new dr(r,i,s,t)}function Vo(e,t){if(e===t)return!0;{const r=t;return e.code===
r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&Bi(e.bytes,r.bytes)}}let dr=class{constructor(t,r,n,i){h(this,"c\
ode");h(this,"size");h(this,"digest");h(this,"bytes");this.code=t,this.size=r,this.digest=He(n),this.bytes=He(i)}};function Tr(e,t){
const{bytes:r,version:n}=e;switch(n){case 0:return Ko(r,Wt(e),t??he.encoder);default:return Xo(r,Wt(e),t??_e.encoder)}}const Cr=new WeakMap;
function Wt(e){const t=Cr.get(e);if(t==null){const r=new Map;return Cr.set(e,r),r}return t}var bn;let Qo=class H{constructor(t,r,n,i){
h(this,"code");h(this,"version");h(this,"multihash");h(this,"bytes");h(this,"/");h(this,bn,"CID");this.code=r,this.version=
t,this.multihash=n,this.bytes=He(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
Be)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Jo)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return H.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=Wo(t,
r);return H.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return H.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&Vo(t.multihash,n.multihash)}toString(t){return Tr(this,t)}toJSON(){return{"/":Tr(
this)}}link(){return this}[(bn=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof H)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new H(n,i,o,s??Or(n,i,o.bytes))}else if(r[Zo]===!0){const{version:n,
multihash:i,code:o}=r,s=Ho(i);return H.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==Be)throw new Error(`Version 0 CID must use dag-pb (code: ${Be}) block encoding`);return new H(t,r,n,n.bytes)}case 1:{
const i=Or(t,r,n.bytes);return new H(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return H.create(
0,Be,t)}static createV1(t,r){return H.create(1,t,r)}static decode(t){const[r,n]=H.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=H.inspectBytes(t),n=r.size-r.multihashSize,i=We(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new dr(r.multihashCode,r.digestSize,o,i);return[r.version===0?H.createV0(s):H.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[g,f]=qt(t.subarray(r));return r+=f,g};let i=n(),o=Be;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),d=n(),l=r+d,b=l-s;return{version:i,
codec:o,multihashCode:a,digestSize:d,multihashSize:b,size:l}}static parse(t,r){const[n,i]=Yo(t,r),o=H.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Wt(o).set(n,t),o}};function Yo(e,t){
switch(e[0]){case"Q":{const r=t??he;return[he.prefix,r.decode(`${he.prefix}${e}`)]}case he.prefix:{const r=t??he;return[
he.prefix,r.decode(e)]}case _e.prefix:{const r=t??_e;return[_e.prefix,r.decode(e)]}case tt.prefix:{const r=t??tt;return[
tt.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function Ko(e,t,r){const{prefix:n}=r;if(n!==he.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function Xo(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const Be=112,Jo=18;function Or(e,t,r){const n=lt(e),i=n+lt(t),o=new Uint8Array(i+r.byteLength);return ut(e,o,0),
ut(t,o,n),o.set(r,i),o}const Zo=Symbol.for("@ipld/js-cid/CID"),Ht={...Oo,...eo,...To,...Yi,...Ji,...mo,...yo,...Eo,...xo,
...so};function Tn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}const Rr=Tn("u\
tf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),Nt=Tn("ascii","a",e=>{let t="\
a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=En(e.length);for(let r=0;r<
e.length;r++)t[r]=e.charCodeAt(r);return t}),Cn={utf8:Rr,"utf-8":Rr,hex:Ht.base16,latin1:Nt,ascii:Nt,binary:Nt,...Ht};function On(e,t="\
utf8"){const r=Cn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.decoder.decode(`${r.prefix}${e}`)}
function ht(e,t="utf8"){const r=Cn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.encoder.encode(
e).substring(1)}class Ie extends Error{constructor(){super(...arguments);h(this,"name","InvalidMultiaddrError")}}h(Ie,"n\
ame","InvalidMultiaddrError");class Ue extends Error{constructor(){super(...arguments);h(this,"name","ValidationError")}}
h(Ue,"name","ValidationError");class Rn extends Error{constructor(){super(...arguments);h(this,"name","UnknownProtocolEr\
ror")}}h(Rn,"name","UnknownProtocolError");const es=4,ts=6,rs=273,ns=33,is=41,os=42,ss=43,as=53,cs=54,ds=55,fs=56,us=132,
ls=301,hs=302,ps=400,bs=421,ms=444,gs=445,ys=446,ws=447,Es=448,vs=449,As=454,Ss=460,xs=461,Is=465,Ts=466,Cs=480,Os=481,Rs=443,
Ns=477,_s=478,Ms=479,Us=277,Bs=275,Ds=276,ks=280,Ls=281,Ps=290,zs=777;function Nr(e){return t=>ht(t,e)}function _r(e){return t=>On(
t,e)}function $e(e){return new DataView(e.buffer).getUint16(e.byteOffset).toString()}function Re(e){const t=new ArrayBuffer(
2);return new DataView(t).setUint16(0,typeof e=="string"?parseInt(e):e),new Uint8Array(t)}function Fs(e){const t=e.split(
":");if(t.length!==2)throw new Error(`failed to parse onion addr: ["'${t.join('", "')}'"]' does not contain a port numbe\
r`);if(t[0].length!==16)throw new Error(`failed to parse onion addr: ${t[0]} not a Tor onion address.`);const r=On(t[0],
"base32"),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=Re(n);return vn(
[r,i],r.length+i.length)}function Gs(e){const t=e.split(":");if(t.length!==2)throw new Error(`failed to parse onion addr\
: ["'${t.join('", "')}'"]' does not contain a port number`);if(t[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${t[0]} not a Tor onion3 address.`);const r=_e.decode(`b${t[0]}`),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=Re(n);return vn([r,i],r.length+i.length)}function Mr(e){const t=e.subarray(
0,e.length-2),r=e.subarray(e.length-2),n=ht(t,"base32"),i=$e(r);return`${n}:${i}`}const Nn=function(e){e=e.toString().trim();
const t=new Uint8Array(4);return e.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new Ie(
"Invalid byte value in IP address");t[n]=i}),t},$s=function(e){let t=0;e=e.toString().trim();const r=e.split(":",8);let n;
for(n=0;n<r.length;n++){const o=wn(r[n]);let s;o&&(s=Nn(r[n]),r[n]=ht(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,ht(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(t+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new Ie("Invalid byte value in IP address");i[t++]=o>>8&255,i[t++]=o&255}return i},js=function(e){
if(e.byteLength!==4)throw new Ie("IPv4 address was incorrect length");const t=[];for(let r=0;r<e.byteLength;r++)t.push(e[r]);
return t.join(".")},qs=function(e){if(e.byteLength!==16)throw new Ie("IPv6 address was incorrect length");const t=[];for(let n=0;n<
e.byteLength;n+=2){const i=e[n],o=e[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;t.push(s)}
const r=t.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new Ie(
`Invalid IPv6 address "${r}"`)}};function Ws(e){try{const t=new URL(`http://[${e}]`);return t.hostname.substring(1,t.hostname.
length-1)}catch{throw new Ie(`Invalid IPv6 address "${e}"`)}}const _t=Object.values(Ht).map(e=>e.decoder),Hs=(function(){
let e=_t[0].or(_t[1]);return _t.slice(2).forEach(t=>e=e.or(t)),e})();function Vs(e){return Hs.decode(e)}function Qs(e){return t=>e.
encoder.encode(t)}function Ys(e){if(parseInt(e).toString()!==e)throw new Ue("Value must be an integer")}function Ks(e){if(e<
0)throw new Ue("Value must be a positive integer, or zero")}function Xs(e){return t=>{if(t>e)throw new Ue(`Value must be\
 smaller than or equal to ${e}`)}}function Js(...e){return t=>{for(const r of e)r(t)}}const Xe=Js(Ys,Ks,Xs(65535)),J=-1;
class Zs{constructor(){h(this,"protocolsByCode",new Map);h(this,"protocolsByName",new Map)}getProtocol(t){let r;if(typeof t==
"string"?r=this.protocolsByName.get(t):r=this.protocolsByCode.get(t),r==null)throw new Rn(`Protocol ${t} was unknown`);return r}addProtocol(t){
var r;this.protocolsByCode.set(t.code,t),this.protocolsByName.set(t.name,t),(r=t.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,t)})}removeProtocol(t){var n;const r=this.protocolsByCode.get(t);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const ea=new Zs,ta=[
{code:es,name:"ip4",size:32,valueToBytes:Nn,bytesToValue:js,validate:e=>{if(!wn(e))throw new Ue(`Invalid IPv4 address "${e}\
"`)}},{code:ts,name:"tcp",size:16,valueToBytes:Re,bytesToValue:$e,validate:Xe},{code:rs,name:"udp",size:16,valueToBytes:Re,
bytesToValue:$e,validate:Xe},{code:ns,name:"dccp",size:16,valueToBytes:Re,bytesToValue:$e,validate:Xe},{code:is,name:"ip\
6",size:128,valueToBytes:$s,bytesToValue:qs,stringToValue:Ws,validate:e=>{if(!_i(e))throw new Ue(`Invalid IPv6 address "${e}\
"`)}},{code:os,name:"ip6zone",size:J},{code:ss,name:"ipcidr",size:8,bytesToValue:Nr("base10"),valueToBytes:_r("base10")},
{code:as,name:"dns",size:J},{code:cs,name:"dns4",size:J},{code:ds,name:"dns6",size:J},{code:fs,name:"dnsaddr",size:J},{code:us,
name:"sctp",size:16,valueToBytes:Re,bytesToValue:$e,validate:Xe},{code:ls,name:"udt"},{code:hs,name:"utp"},{code:ps,name:"\
unix",size:J,stringToValue:e=>decodeURIComponent(e),valueToString:e=>encodeURIComponent(e)},{code:bs,name:"p2p",aliases:[
"ipfs"],size:J,bytesToValue:Nr("base58btc"),valueToBytes:e=>e.startsWith("Q")||e.startsWith("1")?_r("base58btc")(e):Qo.parse(
e).multihash.bytes},{code:ms,name:"onion",size:96,bytesToValue:Mr,valueToBytes:Fs},{code:gs,name:"onion3",size:296,bytesToValue:Mr,
valueToBytes:Gs},{code:ys,name:"garlic64",size:J},{code:ws,name:"garlic32",size:J},{code:Es,name:"tls"},{code:vs,name:"s\
ni",size:J},{code:As,name:"noise"},{code:Ss,name:"quic"},{code:xs,name:"quic-v1"},{code:Is,name:"webtransport"},{code:Ts,
name:"certhash",size:J,bytesToValue:Qs(xn),valueToBytes:Vs},{code:Cs,name:"http"},{code:Os,name:"http-path",size:J,stringToValue:e=>`\
/${decodeURIComponent(e)}`,valueToString:e=>encodeURIComponent(e.substring(1))},{code:Rs,name:"https"},{code:Ns,name:"ws"},
{code:_s,name:"wss"},{code:Ms,name:"p2p-websocket-star"},{code:Us,name:"p2p-stardust"},{code:Bs,name:"p2p-webrtc-star"},
{code:Ds,name:"p2p-webrtc-direct"},{code:ks,name:"webrtc-direct"},{code:Ls,name:"webrtc"},{code:Ps,name:"p2p-circuit"},{
code:zs,name:"memory",size:J}];ta.forEach(e=>{ea.addProtocol(e)});function Vt(e){if(e instanceof Uint8Array&&e.constructor.
name==="Uint8Array")return Br(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Br(
new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function ra(e){
const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}const Ur=4096;function na(e){const t=e.
length;if(t<=Ur)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.
subarray(n,n+=Ur));return r}function ia(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function Br(e){return ia(
e)?e:e.slice()}function oa(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==
a&&(n[l]=o)}}var b=e.length,g=e.charAt(0),f=Math.log(b)/Math.log(256),y=Math.log(256)/Math.log(b);function p(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var u=0,C=0,
w=0,I=c.length;w!==I&&c[w]===0;)w++,u++;for(var x=(I-w)*y+1>>>0,A=new Uint8Array(x);w!==I;){for(var E=c[w],R=0,v=x-1;(E!==
0||R<C)&&v!==-1;v--,R++)E+=256*A[v]>>>0,A[v]=E%b>>>0,E=E/b>>>0;if(E!==0)throw new Error("Non-zero carry");C=R,w++}for(var N=x-
C;N!==x&&A[N]===0;)N++;for(var D=g.repeat(u);N<x;++N)D+=e.charAt(A[N]);return D}function S(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var u=0;if(c[u]!==" "){for(var C=0,w=0;c[u]===g;)C++,u++;for(var I=(c.
length-u)*f+1>>>0,x=new Uint8Array(I);c[u];){var A=n[c.charCodeAt(u)];if(A===255)return;for(var E=0,R=I-1;(A!==0||E<w)&&
R!==-1;R--,E++)A+=b*x[R]>>>0,x[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");w=E,u++}if(c[u]!==" "){
for(var v=I-w;v!==I&&x[v]===0;)v++;for(var N=new Uint8Array(C+(I-v)),D=C;v!==I;)N[D++]=x[v++];return N}}}function m(c){var u=S(
c);if(u)return u;throw new Error(`Non-${t} character`)}return{encode:p,decodeUnsafe:S,decode:m}}var sa=oa,aa=sa;let ca=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},da=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseDecode");h(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return _n(this,t)}},fa=class{constructor(t){h(this,"decoders");this.
decoders=t}or(t){return _n(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function _n(e,t){return new fa({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let ua=class{constructor(t,r,n,i){
h(this,"name");h(this,"prefix");h(this,"baseEncode");h(this,"baseDecode");h(this,"encoder");h(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ca(t,r,n),this.decoder=new da(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function St({name:e,prefix:t,encode:r,decode:n}){return new ua(
e,t,r,n)}function Ye({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=aa(r,e,n);return St({prefix:t,
name:e,encode:i,decode:s=>Vt(o(s))})}function la(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const b=t[e[l]];if(b===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|b,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function ha(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function pa(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function q({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=pa(n,i);return St(
{prefix:t,name:e,encode(s){return ha(s,n,r)},decode(s){return la(s,o,r,e)}})}Ye({prefix:"9",name:"base10",alphabet:"0123\
456789"});q({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});q({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});q({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const Mn=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),ba=Mn.reduce((e,t,r)=>(e[r]=t,e),[]),ma=Mn.reduce((e,t,r)=>{const n=t.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);function ga(e){return e.reduce(
(t,r)=>(t+=ba[r],t),"")}function ya(e){const t=[];for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=ma[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(
t)}St({prefix:"🚀",name:"base256emoji",encode:ga,decode:ya});q({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
tuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});q({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0});q({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0});q({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});
q({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});q({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});q({prefix:"t",name:"\
base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});q({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});q({prefix:"h",name:"base32z",
alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Ye({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijk\
lmnopqrstuvwxyz",caseInsensitive:!0});Ye({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
caseInsensitive:!0});Ye({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxy\
z"});Ye({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});q({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});q({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});q({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});q({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});q({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3});St({prefix:"\0",name:"identity",encode:e=>na(Vt(e)),decode:e=>Vt(ra(
e))});new TextEncoder;new TextDecoder;const wa="/",Ea=new TextEncoder().encode(wa);Ea[0];function va(e){if(e instanceof Uint8Array&&
e.constructor.name==="Uint8Array")return e;if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))
return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new Error("Unknown type, must be binary type")}function Aa(e){
return new TextEncoder().encode(e)}function Sa(e){return new TextDecoder().decode(e)}function xa(e,t){if(e.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<e.length;i++){var o=e.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=e.length,d=e.charAt(0),l=Math.log(
a)/Math.log(256),b=Math.log(256)/Math.log(a);function g(p){if(p instanceof Uint8Array||(ArrayBuffer.isView(p)?p=new Uint8Array(
p.buffer,p.byteOffset,p.byteLength):Array.isArray(p)&&(p=Uint8Array.from(p))),!(p instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(p.length===0)return"";for(var S=0,m=0,c=0,u=p.length;c!==u&&p[c]===0;)c++,S++;for(var C=(u-c)*
b+1>>>0,w=new Uint8Array(C);c!==u;){for(var I=p[c],x=0,A=C-1;(I!==0||x<m)&&A!==-1;A--,x++)I+=256*w[A]>>>0,w[A]=I%a>>>0,I=
I/a>>>0;if(I!==0)throw new Error("Non-zero carry");m=x,c++}for(var E=C-m;E!==C&&w[E]===0;)E++;for(var R=d.repeat(S);E<C;++E)
R+=e.charAt(w[E]);return R}function f(p){if(typeof p!="string")throw new TypeError("Expected String");if(p.length===0)return new Uint8Array;
var S=0;if(p[S]!==" "){for(var m=0,c=0;p[S]===d;)m++,S++;for(var u=(p.length-S)*l+1>>>0,C=new Uint8Array(u);p[S];){var w=r[p.
charCodeAt(S)];if(w===255)return;for(var I=0,x=u-1;(w!==0||I<c)&&x!==-1;x--,I++)w+=a*C[x]>>>0,C[x]=w%256>>>0,w=w/256>>>0;
if(w!==0)throw new Error("Non-zero carry");c=I,S++}if(p[S]!==" "){for(var A=u-c;A!==u&&C[A]===0;)A++;for(var E=new Uint8Array(
m+(u-A)),R=m;A!==u;)E[R++]=C[A++];return E}}}function y(p){var S=f(p);if(S)return S;throw new Error(`Non-${t} character`)}
return{encode:g,decodeUnsafe:f,decode:y}}var Ia=xa,Ta=Ia;let Ca=class{constructor(t,r,n){h(this,"name");h(this,"prefix");
h(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},Oa=class{constructor(t,r,n){h(this,"name");h(this,"pr\
efix");h(this,"baseDecode");h(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t=="string"){if(t.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(t){return Un(this,t)}},Ra=class{constructor(t){h(this,"decoders");this.decoders=t}or(t){
return Un(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Un(e,t){
return new Ra({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let Na=class{constructor(t,r,n,i){h(this,"n\
ame");h(this,"prefix");h(this,"baseEncode");h(this,"baseDecode");h(this,"encoder");h(this,"decoder");this.name=t,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Ca(t,r,n),this.decoder=new Oa(t,r,i)}encode(t){return this.encoder.
encode(t)}decode(t){return this.decoder.decode(t)}};function xt({name:e,prefix:t,encode:r,decode:n}){return new Na(e,t,r,
n)}function Ke({name:e,prefix:t,alphabet:r}){const{encode:n,decode:i}=Ta(r,e);return xt({prefix:t,name:e,encode:n,decode:o=>va(
i(o))})}function _a(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,d=0;for(let l=0;l<
i;++l){const b=t[e[l]];if(b===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|b,s+=r,s>=8&&(s-=8,o[d++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Ma(e,t,r){const n=t[t.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=
t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Ua(e){const t={};for(let r=0;r<e.length;++r)t[e[r]]=r;return t}
function W({name:e,prefix:t,bitsPerChar:r,alphabet:n}){const i=Ua(n);return xt({prefix:t,name:e,encode(o){return Ma(o,n,
r)},decode(o){return _a(o,i,r,e)}})}const Ba=Ke({prefix:"9",name:"base10",alphabet:"0123456789"}),Da=Object.freeze(Object.
defineProperty({__proto__:null,base10:Ba},Symbol.toStringTag,{value:"Module"})),ka=W({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),La=W({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Pa=Object.
freeze(Object.defineProperty({__proto__:null,base16:ka,base16upper:La},Symbol.toStringTag,{value:"Module"})),za=W({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),Fa=Object.freeze(Object.defineProperty({__proto__:null,base2:za},Symbol.toStringTag,
{value:"Module"})),Bn=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Ga=Bn.reduce((e,t,r)=>(e[r]=t,e),[]),
$a=Bn.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);
function ja(e){return e.reduce((t,r)=>(t+=Ga[r],t),"")}function qa(e){const t=[];for(const r of e){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=$a[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);t.push(i)}return new Uint8Array(t)}const Wa=xt({prefix:"🚀",name:"base256emoji",encode:ja,decode:qa}),Ha=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Wa},Symbol.toStringTag,{value:"Module"})),Va=W({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Qa=W({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Ya=W({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),Ka=W({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Xa=W(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Ja=W({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Za=W({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ec=W({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),tc=W({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
rc=Object.freeze(Object.defineProperty({__proto__:null,base32:Va,base32hex:Xa,base32hexpad:Za,base32hexpadupper:ec,base32hexupper:Ja,
base32pad:Ya,base32padupper:Ka,base32upper:Qa,base32z:tc},Symbol.toStringTag,{value:"Module"})),nc=Ke({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),ic=Ke({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),oc=Object.freeze(Object.defineProperty({__proto__:null,base36:nc,base36upper:ic},Symbol.toStringTag,
{value:"Module"})),sc=Ke({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),ac=Ke({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),cc=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:sc,base58flickr:ac},Symbol.toStringTag,{value:"Module"})),dc=W({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),fc=W({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),uc=W({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),lc=W({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),hc=Object.
freeze(Object.defineProperty({__proto__:null,base64:dc,base64pad:fc,base64url:uc,base64urlpad:lc},Symbol.toStringTag,{value:"\
Module"})),pc=W({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),bc=Object.freeze(Object.defineProperty({__proto__:null,
base8:pc},Symbol.toStringTag,{value:"Module"})),mc=xt({prefix:"\0",name:"identity",encode:e=>Sa(e),decode:e=>Aa(e)}),gc=Object.
freeze(Object.defineProperty({__proto__:null,identity:mc},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Dr={...gc,...Fa,...bc,...Da,...Pa,...rc,...oc,...cc,...hc,...Ha};function Qt(e=0){return new Uint8Array(e)}function pt(e=0){
return new Uint8Array(e)}function Dn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}
const kr=Dn("utf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),Mt=Dn("asci\
i","a",e=>{let t="a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=pt(e.
length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}),yc={utf8:kr,"utf-8":kr,hex:Dr.base16,latin1:Mt,ascii:Mt,
binary:Mt,...Dr};function wc(e,t="utf8"){const r=yc[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.
decoder.decode(`${r.prefix}${e}`)}const Ec=Math.pow(2,7),vc=Math.pow(2,14),Ac=Math.pow(2,21),kn=Math.pow(2,28),Ln=Math.pow(
2,35),Pn=Math.pow(2,42),zn=Math.pow(2,49),X=128,ye=127;function fr(e){if(e<Ec)return 1;if(e<vc)return 2;if(e<Ac)return 3;
if(e<kn)return 4;if(e<Ln)return 5;if(e<Pn)return 6;if(e<zn)return 7;if(Number.MAX_SAFE_INTEGER!=null&&e>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Sc(e,t,r=0){switch(fr(e)){case 8:t[r++]=e&255|X,e/=128;case 7:
t[r++]=e&255|X,e/=128;case 6:t[r++]=e&255|X,e/=128;case 5:t[r++]=e&255|X,e/=128;case 4:t[r++]=e&255|X,e>>>=7;case 3:t[r++]=
e&255|X,e>>>=7;case 2:t[r++]=e&255|X,e>>>=7;case 1:{t[r++]=e&255,e>>>=7;break}default:throw new Error("unreachable")}return t}
function xc(e,t){let r=e[t],n=0;if(n+=r&ye,r<X||(r=e[t+1],n+=(r&ye)<<7,r<X)||(r=e[t+2],n+=(r&ye)<<14,r<X)||(r=e[t+3],n+=
(r&ye)<<21,r<X)||(r=e[t+4],n+=(r&ye)*kn,r<X)||(r=e[t+5],n+=(r&ye)*Ln,r<X)||(r=e[t+6],n+=(r&ye)*Pn,r<X)||(r=e[t+7],n+=(r&
ye)*zn,r<X))return n;throw new RangeError("Could not decode varint")}const ur=new Float32Array([-0]),ve=new Uint8Array(ur.
buffer);function Ic(e,t,r){ur[0]=e,t[r]=ve[0],t[r+1]=ve[1],t[r+2]=ve[2],t[r+3]=ve[3]}function Tc(e,t){return ve[0]=e[t],
ve[1]=e[t+1],ve[2]=e[t+2],ve[3]=e[t+3],ur[0]}const lr=new Float64Array([-0]),Q=new Uint8Array(lr.buffer);function Cc(e,t,r){
lr[0]=e,t[r]=Q[0],t[r+1]=Q[1],t[r+2]=Q[2],t[r+3]=Q[3],t[r+4]=Q[4],t[r+5]=Q[5],t[r+6]=Q[6],t[r+7]=Q[7]}function Oc(e,t){return Q[0]=
e[t],Q[1]=e[t+1],Q[2]=e[t+2],Q[3]=e[t+3],Q[4]=e[t+4],Q[5]=e[t+5],Q[6]=e[t+6],Q[7]=e[t+7],lr[0]}const Rc=BigInt(Number.MAX_SAFE_INTEGER),
Nc=BigInt(Number.MIN_SAFE_INTEGER);class Y{constructor(t,r){h(this,"lo");h(this,"hi");this.lo=t|0,this.hi=r|0}toNumber(t=!1){
if(!t&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(t=!1){if(t)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(t=!1){return this.toBigInt(t).toString()}zzEncode(){const t=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this}zzDecode(){const t=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this}length(){const t=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?t<16384?t<128?1:2:t<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(t){if(t===
0n)return xe;if(t<Rc&&t>Nc)return this.fromNumber(Number(t));const r=t<0n;r&&(t=-t);let n=t>>32n,i=t-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>Lr&&(i=0n,++n>Lr&&(n=0n))),new Y(Number(i),Number(n))}static fromNumber(t){if(t===0)return xe;const r=t<
0;r&&(t=-t);let n=t>>>0,i=(t-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new Y(n,i)}static from(t){return typeof t=="number"?Y.fromNumber(t):typeof t=="bigint"?Y.fromBigInt(t):typeof t=="string"?
Y.fromBigInt(BigInt(t)):t.low!=null||t.high!=null?new Y(t.low>>>0,t.high>>>0):xe}}const xe=new Y(0,0);xe.toBigInt=function(){
return 0n};xe.zzEncode=xe.zzDecode=function(){return this};xe.length=function(){return 1};const Lr=4294967296n;function _c(e){
let t=0,r=0;for(let n=0;n<e.length;++n)r=e.charCodeAt(n),r<128?t+=1:r<2048?t+=2:(r&64512)===55296&&(e.charCodeAt(n+1)&64512)===
56320?(++n,t+=4):t+=3;return t}function Mc(e,t,r){if(r-t<1)return"";let i;const o=[];let s=0,a;for(;t<r;)a=e[t++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|e[t++]&63:a>239&&a<365?(a=((a&7)<<18|(e[t++]&63)<<12|(e[t++]&63)<<6|e[t++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(e[t++]&63)<<6|e[t++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Fn(e,t,r){const n=r;let i,o;for(let s=0;s<e.length;++s)i=e.charCodeAt(
s),i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===55296&&((o=e.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=
i>>6&63|128,t[r++]=i&63|128);return r-n}function ne(e,t){return RangeError(`index out of range: ${e.pos} + ${t??1} > ${e.
len}`)}function Je(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}class Uc{constructor(t){h(this,"buf");h(this,
"pos");h(this,"len");h(this,"_slice",Uint8Array.prototype.subarray);this.buf=t,this.pos=0,this.len=t.length}uint32(){let t=4294967295;
if(t=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(t=(t|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(t=(t|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(t=(t|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(t=(t|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return t;if((this.pos+=5)>this.len)throw this.
pos=this.len,ne(this,10);return t}int32(){return this.uint32()|0}sint32(){const t=this.uint32();return t>>>1^-(t&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw ne(this,4);return Je(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw ne(this,4);return Je(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw ne(this,4);const t=Tc(
this.buf,this.pos);return this.pos+=4,t}double(){if(this.pos+8>this.len)throw ne(this,4);const t=Oc(this.buf,this.pos);return this.
pos+=8,t}bytes(){const t=this.uint32(),r=this.pos,n=this.pos+t;if(n>this.len)throw ne(this,t);return this.pos+=t,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const t=this.bytes();return Mc(t,0,t.length)}skip(t){if(typeof t=="number"){if(this.pos+
t>this.len)throw ne(this,t);this.pos+=t}else do if(this.pos>=this.len)throw ne(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(t=this.uint32()&7)!==4;)this.skipType(t);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${t} at offset ${this.pos}`)}return this}readLongVarint(){const t=new Y(0,0);let r=0;if(this.len-this.pos>4){
for(;r<4;++r)if(t.lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(this.buf[this.
pos]&127)<<28)>>>0,t.hi=(t.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return t;r=0}else{for(;r<3;++r){
if(this.pos>=this.len)throw ne(this);if(t.lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t}
return t.lo=(t.lo|(this.buf[this.pos++]&127)<<r*7)>>>0,t}if(this.len-this.pos>4){for(;r<5;++r)if(t.hi=(t.hi|(this.buf[this.
pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return t}else for(;r<5;++r){if(this.pos>=this.len)throw ne(this);if(t.hi=
(t.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw ne(this,8);const t=Je(this.buf,this.pos+=4),r=Je(this.buf,this.pos+=4);return new Y(t,r)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const t=xc(this.buf,this.pos);
return this.pos+=fr(t),t}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Bc(e){return new Uc(e instanceof Uint8Array?e:
e.subarray())}function hr(e,t,r){const n=Bc(e);return t.decode(n,void 0,r)}function Dc(e){let n,i=8192;return function(s){
if(s<1||s>4096)return pt(s);i+s>8192&&(n=pt(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class je{constructor(t,r,n){
h(this,"fn");h(this,"len");h(this,"next");h(this,"val");this.fn=t,this.len=r,this.next=void 0,this.val=n}}function Ut(){}
class kc{constructor(t){h(this,"head");h(this,"tail");h(this,"len");h(this,"next");this.head=t.head,this.tail=t.tail,this.
len=t.len,this.next=t.states}}const Lc=Dc();function Pc(e){return globalThis.Buffer!=null?pt(e):Lc(e)}class Yt{constructor(){
h(this,"len");h(this,"head");h(this,"tail");h(this,"states");this.len=0,this.head=new je(Ut,0,0),this.tail=this.head,this.
states=null}_push(t,r,n){return this.tail=this.tail.next=new je(t,r,n),this.len+=r,this}uint32(t){return this.len+=(this.
tail=this.tail.next=new Fc((t=t>>>0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this}int32(t){return t<0?this._push(
Ze,10,Y.fromNumber(t)):this.uint32(t)}sint32(t){return this.uint32((t<<1^t>>31)>>>0)}uint64(t){const r=Y.fromBigInt(t);return this.
_push(Ze,r.length(),r)}uint64Number(t){return this._push(Sc,fr(t),t)}uint64String(t){return this.uint64(BigInt(t))}int64(t){
return this.uint64(t)}int64Number(t){return this.uint64Number(t)}int64String(t){return this.uint64String(t)}sint64(t){const r=Y.
fromBigInt(t).zzEncode();return this._push(Ze,r.length(),r)}sint64Number(t){const r=Y.fromNumber(t).zzEncode();return this.
_push(Ze,r.length(),r)}sint64String(t){return this.sint64(BigInt(t))}bool(t){return this._push(Bt,1,t?1:0)}fixed32(t){return this.
_push(De,4,t>>>0)}sfixed32(t){return this.fixed32(t)}fixed64(t){const r=Y.fromBigInt(t);return this._push(De,4,r.lo)._push(
De,4,r.hi)}fixed64Number(t){const r=Y.fromNumber(t);return this._push(De,4,r.lo)._push(De,4,r.hi)}fixed64String(t){return this.
fixed64(BigInt(t))}sfixed64(t){return this.fixed64(t)}sfixed64Number(t){return this.fixed64Number(t)}sfixed64String(t){return this.
fixed64String(t)}float(t){return this._push(Ic,4,t)}double(t){return this._push(Cc,8,t)}bytes(t){const r=t.length>>>0;return r===
0?this._push(Bt,1,0):this.uint32(r)._push(Gc,r,t)}string(t){const r=_c(t);return r!==0?this.uint32(r)._push(Fn,r,t):this.
_push(Bt,1,0)}fork(){return this.states=new kc(this),this.head=this.tail=new je(Ut,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new je(Ut,0,0),this.len=0),this}ldelim(){const t=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=t.next,this.tail=r,this.len+=n),this}finish(){let t=this.head.next;const r=Pc(this.len);
let n=0;for(;t!=null;)t.fn(t.val,r,n),n+=t.len,t=t.next;return r}}function Bt(e,t,r){t[r]=e&255}function zc(e,t,r){for(;e>
127;)t[r++]=e&127|128,e>>>=7;t[r]=e}class Fc extends je{constructor(r,n){super(zc,r,n);h(this,"next");this.next=void 0}}
function Ze(e,t,r){for(;e.hi!==0;)t[r++]=e.lo&127|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[r++]=e.lo&
127|128,e.lo=e.lo>>>7;t[r++]=e.lo}function De(e,t,r){t[r]=e&255,t[r+1]=e>>>8&255,t[r+2]=e>>>16&255,t[r+3]=e>>>24}function Gc(e,t,r){
t.set(e,r)}globalThis.Buffer!=null&&(Yt.prototype.bytes=function(e){const t=e.length>>>0;return this.uint32(t),t>0&&this.
_push($c,t,e),this},Yt.prototype.string=function(e){const t=globalThis.Buffer.byteLength(e);return this.uint32(t),t>0&&this.
_push(jc,t,e),this});function $c(e,t,r){t.set(e,r)}function jc(e,t,r){e.length<40?Fn(e,t,r):t.utf8Write!=null?t.utf8Write(
e,r):t.set(wc(e),r)}function qc(){return new Yt}function pr(e,t){const r=qc();return t.encode(e,r,{lengthDelimited:!1}),
r.finish()}var Kt;(function(e){e[e.VARINT=0]="VARINT",e[e.BIT64=1]="BIT64",e[e.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",e[e.
START_GROUP=3]="START_GROUP",e[e.END_GROUP=4]="END_GROUP",e[e.BIT32=5]="BIT32"})(Kt||(Kt={}));function Wc(e,t,r,n){return{
name:e,type:t,encode:r,decode:n}}function br(e,t){return Wc("message",Kt.LENGTH_DELIMITED,e,t)}class Xt extends Error{constructor(){
super(...arguments);h(this,"code","ERR_MAX_LENGTH");h(this,"name","MaxLengthError")}}var mn,gn;(gn=(mn=globalThis.process)==
null?void 0:mn.env)!=null&&gn.DUMP_SESSION_KEYS;var bt;(function(e){let t;e.codec=()=>(t==null&&(t=br((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,d;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const l=r.uint32();switch(l>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new Xt('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((d=i.limits)==null?void 0:d.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new Xt('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(l&7);break}}}return o})),t),e.encode=r=>pr(r,e.codec()),e.decode=(r,n)=>hr(r,e.codec(),n)})(bt||(bt={}));var Pr;
(function(e){let t;e.codec=()=>(t==null&&(t=br((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),bt.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:Qt(0),identitySig:Qt(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const d=r.uint32();
switch(d>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=bt.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(d&7);break}}}return o})),
t),e.encode=r=>pr(r,e.codec()),e.decode=(r,n)=>hr(r,e.codec(),n)})(Pr||(Pr={}));var zr;(function(e){let t;e.codec=()=>(t==
null&&(t=br((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:Qt(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const d=r.uint32();switch(d>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new Xt(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(d&7);break}}}
return o})),t),e.encode=r=>pr(r,e.codec()),e.decode=(r,n)=>hr(r,e.codec(),n)})(zr||(zr={}));new TextEncoder;new TextDecoder(
"utf-8",{fatal:!0});new TextEncoder;new TextDecoder;function Hc(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])
return!1;return!0}function mr(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return Ve(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Ve(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function Vc(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function Ve(e){return Vc(e)?e:e.slice()}function Qc(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==
a&&(n[l]=o)}}var b=e.length,g=e.charAt(0),f=Math.log(b)/Math.log(256),y=Math.log(256)/Math.log(b);function p(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var u=0,C=0,
w=0,I=c.length;w!==I&&c[w]===0;)w++,u++;for(var x=(I-w)*y+1>>>0,A=new Uint8Array(x);w!==I;){for(var E=c[w],R=0,v=x-1;(E!==
0||R<C)&&v!==-1;v--,R++)E+=256*A[v]>>>0,A[v]=E%b>>>0,E=E/b>>>0;if(E!==0)throw new Error("Non-zero carry");C=R,w++}for(var N=x-
C;N!==x&&A[N]===0;)N++;for(var D=g.repeat(u);N<x;++N)D+=e.charAt(A[N]);return D}function S(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var u=0;if(c[u]!==" "){for(var C=0,w=0;c[u]===g;)C++,u++;for(var I=(c.
length-u)*f+1>>>0,x=new Uint8Array(I);c[u];){var A=n[c.charCodeAt(u)];if(A===255)return;for(var E=0,R=I-1;(A!==0||E<w)&&
R!==-1;R--,E++)A+=b*x[R]>>>0,x[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");w=E,u++}if(c[u]!==" "){
for(var v=I-w;v!==I&&x[v]===0;)v++;for(var N=new Uint8Array(C+(I-v)),D=C;v!==I;)N[D++]=x[v++];return N}}}function m(c){var u=S(
c);if(u)return u;throw new Error(`Non-${t} character`)}return{encode:p,decodeUnsafe:S,decode:m}}var Yc=Qc,Kc=Yc;let Xc=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},Jc=class{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseDecode");h(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Gn(this,t)}},Zc=class{constructor(t){h(this,"decoders");this.
decoders=t}or(t){return Gn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Gn(e,t){return new Zc({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let ed=class{constructor(t,r,n,i){
h(this,"name");h(this,"prefix");h(this,"baseEncode");h(this,"baseDecode");h(this,"encoder");h(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Xc(t,r,n),this.decoder=new Jc(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function $n({name:e,prefix:t,encode:r,decode:n}){return new ed(
e,t,r,n)}function It({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Kc(r,e,n);return $n({prefix:t,
name:e,encode:i,decode:s=>mr(o(s))})}function td(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const b=t[e[l]];if(b===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|b,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function rd(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function nd(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function be({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=nd(n,i);return $n(
{prefix:t,name:e,encode(s){return rd(s,n,r)},decode(s){return td(s,o,r,e)}})}const rt=be({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});be({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});be({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});be({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});be({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});be({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});be({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});be({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});be({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Dt=It(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});It({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Ee=It({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});It({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var id=jn,Fr=128,od=-128,sd=Math.pow(2,31);function jn(e,t,r){t=t||[],r=
r||0;for(var n=r;e>=sd;)t[r++]=e&255|Fr,e/=128;for(;e&od;)t[r++]=e&255|Fr,e>>>=7;return t[r]=e|0,jn.bytes=r-n+1,t}var ad=Jt,
cd=128,Gr=127;function Jt(e,n){var r=0,n=n||0,i=0,o=n,s,a=e.length;do{if(o>=a)throw Jt.bytes=0,new RangeError("Could not\
 decode varint");s=e[o++],r+=i<28?(s&Gr)<<i:(s&Gr)*Math.pow(2,i),i+=7}while(s>=cd);return Jt.bytes=o-n,r}var dd=Math.pow(
2,7),fd=Math.pow(2,14),ud=Math.pow(2,21),ld=Math.pow(2,28),hd=Math.pow(2,35),pd=Math.pow(2,42),bd=Math.pow(2,49),md=Math.
pow(2,56),gd=Math.pow(2,63),yd=function(e){return e<dd?1:e<fd?2:e<ud?3:e<ld?4:e<hd?5:e<pd?6:e<bd?7:e<md?8:e<gd?9:10},wd={
encode:id,decode:ad,encodingLength:yd},mt=wd;function Zt(e,t=0){const r=mt.decode(e,t),n=mt.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function gt(e,t,r=0){return mt.encode(e,t,r),t}function yt(e){return mt.encodingLength(e)}function Ed(e,t){const r=t.
byteLength,n=yt(e),i=n+yt(r),o=new Uint8Array(i+r);return gt(e,o,0),gt(r,o,n),o.set(t,i),new gr(e,r,t,o)}function vd(e){
const t=mr(e),[r,n]=Zt(t),[i,o]=Zt(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new gr(r,i,s,t)}function Ad(e,t){if(e===t)return!0;{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof
Uint8Array&&Hc(e.bytes,r.bytes)}}class gr{constructor(t,r,n,i){h(this,"code");h(this,"size");h(this,"digest");h(this,"by\
tes");this.code=t,this.size=r,this.digest=Ve(n),this.bytes=Ve(i)}}function $r(e,t){const{bytes:r,version:n}=e;switch(n){case 0:
return xd(r,er(e),t??Ee.encoder);default:return Id(r,er(e),t??rt.encoder)}}const jr=new WeakMap;function er(e){const t=jr.
get(e);if(t==null){const r=new Map;return jr.set(e,r),r}return t}var yn;class G{constructor(t,r,n,i){h(this,"code");h(this,
"version");h(this,"multihash");h(this,"bytes");h(this,"/");h(this,yn,"CID");this.code=r,this.version=t,this.multihash=n,
this.bytes=Ve(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
ke)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Td)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return G.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=Ed(t,
r);return G.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return G.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&Ad(t.multihash,n.multihash)}toString(t){return $r(this,t)}toJSON(){return{"/":$r(
this)}}link(){return this}[(yn=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof G)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new G(n,i,o,s??qr(n,i,o.bytes))}else if(r[Cd]===!0){const{version:n,
multihash:i,code:o}=r,s=vd(i);return G.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==ke)throw new Error(`Version 0 CID must use dag-pb (code: ${ke}) block encoding`);return new G(t,r,n,n.bytes)}case 1:{
const i=qr(t,r,n.bytes);return new G(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return G.create(
0,ke,t)}static createV1(t,r){return G.create(1,t,r)}static decode(t){const[r,n]=G.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=G.inspectBytes(t),n=r.size-r.multihashSize,i=mr(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new gr(r.multihashCode,r.digestSize,o,i);return[r.version===0?G.createV0(s):G.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[g,f]=Zt(t.subarray(r));return r+=f,g};let i=n(),o=ke;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),d=n(),l=r+d,b=l-s;return{version:i,
codec:o,multihashCode:a,digestSize:d,multihashSize:b,size:l}}static parse(t,r){const[n,i]=Sd(t,r),o=G.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return er(o).set(n,t),o}}function Sd(e,t){
switch(e[0]){case"Q":{const r=t??Ee;return[Ee.prefix,r.decode(`${Ee.prefix}${e}`)]}case Ee.prefix:{const r=t??Ee;return[
Ee.prefix,r.decode(e)]}case rt.prefix:{const r=t??rt;return[rt.prefix,r.decode(e)]}case Dt.prefix:{const r=t??Dt;return[
Dt.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function xd(e,t,r){const{prefix:n}=r;if(n!==Ee.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function Id(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const ke=112,Td=18;function qr(e,t,r){const n=yt(e),i=n+yt(t),o=new Uint8Array(i+r.byteLength);return gt(e,o,0),
gt(t,o,n),o.set(r,i),o}const Cd=Symbol.for("@ipld/js-cid/CID"),Od=e=>e/2**32|0,Rd=e=>e>>>0;function Nd(e,t,r,n){const i=Od(
r),o=Rd(r);e.setUint32(t,n?o:i,n),e.setUint32(t+4,n?i:o,n)}function Wr(e){return e instanceof Uint8Array||ArrayBuffer.isView(
e)&&e.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in e&&e.BYTES_PER_ELEMENT===1}const _d=e=>e?`"${e}" `:"";function yr(e,t,r=""){
if(Wr(e)&&t===void 0)return e;const n=Wr(e),i="",o=n?`length=${e.length}`:`type=${typeof e}`,s=_d(r)+"expected Uint8Arra\
y"+i+", got "+o;throw n?new RangeError(s):new TypeError(s)}const Md=(e,t)=>{if(e===null||typeof e!="object"||Array.isArray(
e))throw new TypeError((t==="object"?"":`"${t}" `)+"expected object, got type="+typeof e)},Hr=(e,t)=>{Md(e,t);const r=Object.
getPrototypeOf(e);if(r!==Object.prototype&&r!==null)throw new TypeError(`"${t}" expected plain object`);if(Object.hasOwn(
e,"__proto__"))throw new TypeError(`"${t}.__proto__" is not allowed`)};function Vr(e,t=!0){if(e.destroyed)throw new Error(
"hash was destroyed");if(t&&e.finished)throw new Error("digest() was already called")}function Ud(e,t){yr(e,void 0,"outp\
ut");const r=t.outputLen;if(!(e.length>=r))throw new RangeError('"output" expected length >= '+r)}function Qr(...e){for(let t=0;t<
e.length;t++)e[t].fill(0)}function kt(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function de(e,t){return e<<
32-t|e>>>t}const Bd=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",Dd=Array.from({length:256},
(e,t)=>t.toString(16).padStart(2,"0"));function kd(e){if(yr(e),Bd)return e.toHex();let t="";for(let r=0;r<e.length;r++)t+=
Dd[e[r]];return t}function Ld(e,t,r="opts"){return Hr(e,"defaults"),t!==void 0&&Hr(t,r),Object.assign(Object.create(null),
e,t)}function Pd(e,t={}){if(typeof e!="function")throw new TypeError('"hashCons" expected function, got type='+typeof e);
t=Ld({},t,"info");const r=(i,o)=>e(o).update(i).digest(),n=e(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,
r.canXOF=n.canXOF,r.create=i=>e(i),Object.assign(r,t),Object.freeze(r)}const zd=e=>({oid:Uint8Array.from([6,9,96,134,72,
1,101,3,4,2,e])});function Fd(e,t,r){return e&t^~e&r}function Gd(e,t,r){return e&t^e&r^t&r}class $d{constructor(t,r,n,i){
h(this,"blockLen");h(this,"outputLen");h(this,"canXOF",!1);h(this,"padOffset");h(this,"isLE");h(this,"buffer");h(this,"v\
iew");h(this,"finished",!1);h(this,"length",0);h(this,"pos",0);h(this,"destroyed",!1);this.blockLen=t,this.outputLen=r,this.
padOffset=n,this.isLE=i,this.buffer=new Uint8Array(t),this.view=kt(this.buffer)}update(t){Vr(this),yr(t);const{view:r,buffer:n,
blockLen:i}=this,o=t.length;let s=!1;for(let a=0;a<o;){const d=Math.min(i-this.pos,o-a);if(d===i){const l=kt(t);for(;i<=
o-a;a+=i)this.process(l,a);s=!0;continue}n.set(a===0&&d===o?t:t.subarray(a,a+d),this.pos),this.pos+=d,a+=d,this.pos===i&&
(this.process(r,0),this.pos=0,s=!0)}return this.length+=t.length,s&&this.roundClean(),this}digestInto(t){Vr(this),Ud(t,this),
this.finished=!0;const{buffer:r,view:n,blockLen:i,isLE:o}=this;let{pos:s}=this;r[s++]=128,r.fill(0,s),this.padOffset>i-s&&
(this.process(n,0),r.fill(0)),Nd(n,i-8,this.length*8,o),this.process(n,0),this.roundClean();const a=t===r?n:kt(t),d=this.
outputLen,l=d/4,b=this.get();if(d%4||l>b.length)throw new Error("invalid outputLen");for(let g=0;g<l;g++)a.setUint32(4*g,
b[g],o)}digest(){const{buffer:t,outputLen:r}=this;this.digestInto(t);const n=t.slice(0,r);return this.destroy(),n}_cloneIntoMeta(t){
const{buffer:r,length:n,finished:i,destroyed:o,pos:s}=this;return t.destroyed=o,t.finished=i,t.length=n,t.pos=s,s&&t.buffer.
set(r),t}clone(){return this._cloneInto()}}const jd=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,
2600822924,528734635,1541459225]),qd=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,
2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,
113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,
3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,
1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),we=new Uint32Array(
64);class Wd extends $d{constructor(r,n){super(64,r,8,!1);h(this,"A",0);h(this,"B",0);h(this,"C",0);h(this,"D",0);h(this,
"E",0);h(this,"F",0);h(this,"G",0);h(this,"H",0);this.A=n[0]|0,this.B=n[1]|0,this.C=n[2]|0,this.D=n[3]|0,this.E=n[4]|0,this.
F=n[5]|0,this.G=n[6]|0,this.H=n[7]|0}get(){const{A:r,B:n,C:i,D:o,E:s,F:a,G:d,H:l}=this;return[r,n,i,o,s,a,d,l]}set(r,n,i,o,s,a,d,l){
this.A=r|0,this.B=n|0,this.C=i|0,this.D=o|0,this.E=s|0,this.F=a|0,this.G=d|0,this.H=l|0}_cloneInto(r){return(r||(r=new this.
constructor)).set(...this.get()),this._cloneIntoMeta(r)}process(r,n){for(let f=0;f<16;f++,n+=4)we[f]=r.getUint32(n,!1);for(let f=16;f<
64;f++){const y=we[f-15],p=we[f-2],S=de(y,7)^de(y,18)^y>>>3,m=de(p,17)^de(p,19)^p>>>10;we[f]=m+we[f-7]+S+we[f-16]|0}let{
A:i,B:o,C:s,D:a,E:d,F:l,G:b,H:g}=this;for(let f=0;f<64;f++){const y=de(d,6)^de(d,11)^de(d,25),p=g+y+Fd(d,l,b)+qd[f]+we[f]|
0,m=(de(i,2)^de(i,13)^de(i,22))+Gd(i,o,s)|0;g=b,b=l,l=d,d=a+p|0,a=s,s=o,o=i,i=p+m|0}i=i+this.A|0,o=o+this.B|0,s=s+this.C|
0,a=a+this.D|0,d=d+this.E|0,l=l+this.F|0,b=b+this.G|0,g=g+this.H|0,this.set(i,o,s,a,d,l,b,g)}roundClean(){Qr(we)}destroy(){
this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),Qr(this.buffer)}}class Hd extends Wd{constructor(){super(32,jd)}}const Vd=Pd(
()=>new Hd,zd(1));function Qd(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return Yr(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Yr(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function Yd(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function Yr(e){return Yd(e)?e:e.slice()}function Kd(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==
a&&(n[l]=o)}}var b=e.length,g=e.charAt(0),f=Math.log(b)/Math.log(256),y=Math.log(256)/Math.log(b);function p(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var u=0,C=0,
w=0,I=c.length;w!==I&&c[w]===0;)w++,u++;for(var x=(I-w)*y+1>>>0,A=new Uint8Array(x);w!==I;){for(var E=c[w],R=0,v=x-1;(E!==
0||R<C)&&v!==-1;v--,R++)E+=256*A[v]>>>0,A[v]=E%b>>>0,E=E/b>>>0;if(E!==0)throw new Error("Non-zero carry");C=R,w++}for(var N=x-
C;N!==x&&A[N]===0;)N++;for(var D=g.repeat(u);N<x;++N)D+=e.charAt(A[N]);return D}function S(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var u=0;if(c[u]!==" "){for(var C=0,w=0;c[u]===g;)C++,u++;for(var I=(c.
length-u)*f+1>>>0,x=new Uint8Array(I);c[u];){var A=n[c.charCodeAt(u)];if(A===255)return;for(var E=0,R=I-1;(A!==0||E<w)&&
R!==-1;R--,E++)A+=b*x[R]>>>0,x[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");w=E,u++}if(c[u]!==" "){
for(var v=I-w;v!==I&&x[v]===0;)v++;for(var N=new Uint8Array(C+(I-v)),D=C;v!==I;)N[D++]=x[v++];return N}}}function m(c){var u=S(
c);if(u)return u;throw new Error(`Non-${t} character`)}return{encode:p,decodeUnsafe:S,decode:m}}var Xd=Kd,Jd=Xd;class Zd{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}}class ef{constructor(t,r,n){
h(this,"name");h(this,"prefix");h(this,"baseDecode");h(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return qn(this,t)}}class tf{constructor(t){h(this,"decoders");this.
decoders=t}or(t){return qn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function qn(e,t){return new tf({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class rf{constructor(t,r,n,i){
h(this,"name");h(this,"prefix");h(this,"baseEncode");h(this,"baseDecode");h(this,"encoder");h(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Zd(t,r,n),this.decoder=new ef(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function Wn({name:e,prefix:t,encode:r,decode:n}){return new rf(
e,t,r,n)}function Tt({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Jd(r,e,n);return Wn({prefix:t,
name:e,encode:i,decode:s=>Qd(o(s))})}function nf(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const b=t[e[l]];if(b===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|b,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function of(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function sf(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function me({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=sf(n,i);return Wn(
{prefix:t,name:e,encode(s){return of(s,n,r)},decode(s){return nf(s,o,r,e)}})}me({prefix:"b",name:"base32",alphabet:"abcd\
efghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});me({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});me({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrst\
uvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});me({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZ234567=",bitsPerChar:5,caseInsensitive:!0});me({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});me({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});me({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
me({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});
me({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Tt({prefix:"k",name:"base36",alphabet:"\
0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Tt({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFG\
HIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});Tt({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabc\
defghijkmnopqrstuvwxyz"});Tt({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQ\
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const af="peercompute.artifact.manifest.v1",Hn=256*1024,cf=16*
1024**3,wt=new TextEncoder;function df(e){const t=G.asCID(e)||G.parse(String(e));if(![85,112].includes(t.code)||t.multihash.
code!==18||t.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return t.toV1()}function nt(e,t=0,r={remaining:Hn}){if(t>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>r.remaining||
(r.remaining-=wt.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||typeof e==
"boolean"||typeof e=="number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return e.map(i=>nt(i,t+1,r))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(e);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(nt(i,t+1,r),[i,nt(e[i],t+1,r)])))}function ff(e,{
maximumBytes:t=Hn,maximumFiles:r=1024,maximumFileBytes:n=cf}={}){if(!e||e.schema!==af||!Array.isArray(e.files)||e.files.
length===0||e.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(d=>!i.has(d)))
throw new TypeError("Unsupported manifest field.");for(const d of["name","description"])if(e[d]!==void 0&&typeof e[d]!="\
string")throw new TypeError(`Manifest ${d} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||
Array.isArray(e.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=e.files.map(
d=>{if(!d||typeof d!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(d).some(g=>!["path","cid","si\
ze","sha256","mediaType"].includes(g)))throw new TypeError("Unsupported manifest file field.");const{path:l,size:b}=d;if(typeof l!=
"string"||!l||wt.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(l)||l.split("/").some(g=>!g||g==="."||g==="..")||
o.has(l))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(b)||b<0||b>n)throw new RangeError("Invalid file size.");if(d.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(d.sha256))
throw new TypeError("Invalid SHA-256.");if(d.mediaType!==void 0&&(typeof d.mediaType!="string"||d.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(l),{...d,cid:df(d.cid).toString()}}).sort((d,l)=>d.path<l.path?-1:
d.path>l.path?1:0),a=nt({...e,files:s},0,{remaining:t});if(wt.encode(JSON.stringify(a)).byteLength>t)throw new RangeError(
"Manifest exceeds byte limit.");return a}function Iu(e,t){return wt.encode(JSON.stringify(ff(e,t)))}const Me=Object.freeze(
{count:4,dimension:2048,pixels:8*1024**2,byteLength:8*1024**2}),L=e=>{throw new Error(`Invalid generated mesh texture: ${e}`)},
uf=[137,80,78,71,13,10,26,10];function tr(e,t){return(!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||e<1||t<1||e>Me.
dimension||t>Me.dimension)&&L("dimensions"),{width:e,height:t,pixels:e*t}}function lf(e,t,r){let n=4294967295;for(let i=t;i<
r;i++){n^=e[i];for(let o=0;o<8;o++)n=n>>>1^3988292384&-(n&1)}return(n^4294967295)>>>0}function hf(e,t){uf.every((a,d)=>e[d]===
a)||L("PNG signature");let r=8,n,i=!1,o=!1,s=!1;for(;r+12<=e.length;){const a=t.getUint32(r),d=r+12+a;d>e.length&&L("PNG\
 chunk range");const l=String.fromCharCode(...e.subarray(r+4,r+8));if(t.getUint32(d-4)!==lf(e,r+4,d-4)&&L("PNG chunk che\
cksum"),["IHDR","IDAT","IEND","PLTE","tRNS","sRGB","gAMA","cHRM","pHYs"].includes(l)||L("PNG chunk type"),r===8&&l!=="IH\
DR"&&L("PNG header order"),l==="IHDR")(n||a!==13||e[r+16]!==8||![0,2,3,4,6].includes(e[r+17])||e[r+18]!==0||e[r+19]!==0||
e[r+20]!==0)&&L("PNG header"),n=tr(t.getUint32(r+8),t.getUint32(r+12)),n.colorType=e[r+17];else if(l==="PLTE")(i||s||!a||
a>768||a%3)&&L("PNG palette"),s=!0;else if(l==="IDAT")(o||n.colorType===3&&!s)&&L("PNG image order"),i=!0;else{if(l==="I\
END")return(a||!i||d!==e.length)&&L("PNG end"),tr(n.width,n.height);{i&&(o=!0);const b={sRGB:1,gAMA:4,cHRM:32,pHYs:9}[l];
(b!==void 0?a!==b:a>256)&&L("PNG metadata length")}}r=d}L("PNG truncated")}function pf(e,t){(e[0]!==255||e[1]!==216)&&L(
"JPEG signature");let r=2,n,i=!1,o=!1;for(;r<e.length;){if(o)for(;r<e.length&&e[r]!==255;)r++;for(e[r++]!==255&&L("JPEG \
marker");e[r]===255;)r++;const s=e[r++];if(o&&(s===0||s>=208&&s<=215))continue;if(o=!1,s===217)return(!n||!i||r!==e.length)&&
L("JPEG end"),n;(s===void 0||s===0||s===216||s===1||s>=208&&s<=215||r+2>e.length)&&L("JPEG marker");const a=t.getUint16(
r),d=r+a;if((a<2||d>e.length)&&L("JPEG segment range"),[192,193,194].includes(s)){(n||i||a<11||e[r+2]!==8)&&L("JPEG fram\
e");const l=e[r+7];(![1,3].includes(l)||a!==8+3*l)&&L("JPEG components"),n=tr(t.getUint16(r+5),t.getUint16(r+3))}else s>=
192&&s<=207&&![196].includes(s)&&L("JPEG frame type");s===218?((!n||a<6||a!==6+2*e[r+2])&&L("JPEG scan"),i=!0,o=!0):![192,
193,194,196,219,221,254].includes(s)&&!(s>=224&&s<=239)&&L("JPEG unsupported segment"),r=d}L("JPEG truncated")}function Vn(e,t){
(!(e instanceof Uint8Array)||e.length<12||e.length>Me.byteLength)&&L("encoded byte limit");const r=new DataView(e.buffer,
e.byteOffset,e.byteLength);if(t==="image/png")return{mimeType:t,...hf(e,r)};if(t==="image/jpeg")return{mimeType:t,...pf(
e,r)};L("MIME type")}const se=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),
bf="model/gltf-binary",mf=new TextEncoder,gf=new TextDecoder("utf-8",{fatal:!0}),M=e=>{throw new Error(`Invalid generate\
d mesh: ${e}`)};function ee(e,t,r){return(!Number.isSafeInteger(e)||e<t||e>r)&&M("numeric limit"),e}function $(e,t){return(!e||
typeof e!="object"||Array.isArray(e)||Object.keys(e).some(r=>!t.includes(r)))&&M("unsupported GLB field"),e}function Kr(e,t,r=-se.
coordinate,n=se.coordinate){return(!Array.isArray(e)||e.length!==t||e.some(i=>!Number.isFinite(i)||i<r||i>n))&&M("invali\
d vector"),[...e]}function Ce(e){return(!Array.isArray(e)||e.length!==1)&&M("expected one static mesh"),e[0]}const rr=(e,t)=>JSON.
stringify(e)===JSON.stringify(t);function yf(e,t=[],{allowTextures:r=!0}={}){var R,v,N,D,z;const n=new DataView(e.buffer,
e.byteOffset,e.byteLength);(n.getUint32(0,!0)!==1179937895||n.getUint32(4,!0)!==2||n.getUint32(8,!0)!==e.byteLength)&&M(
"GLB header");const i=n.getUint32(12,!0);(!i||i%4||i>se.jsonBytes||20+i+8>e.byteLength||n.getUint32(16,!0)!==1313821514)&&
M("JSON chunk");let o;try{o=JSON.parse(gf.decode(e.subarray(20,20+i)))}catch{M("JSON syntax")}const s=20+i,a=n.getUint32(
s,!0);(a%4||n.getUint32(s+4,!0)!==5130562||s+8+a!==e.byteLength)&&M("BIN chunk"),$(o,["asset","scene","scenes","nodes","\
meshes","buffers","bufferViews","accessors","materials","images","textures","samplers"]),$(o.asset,["version","generator"]),
(o.asset.version!=="2.0"||o.asset.generator!==void 0&&(typeof o.asset.generator!="string"||o.asset.generator.length>128))&&
M("asset version"),o.scene!==0&&M("scene");const d=$(Ce(o.scenes),["nodes"]);rr(d.nodes,[0])||M("scene nodes"),$(Ce(o.nodes),
["mesh"]).mesh!==0&&M("node mesh");const b=$(Ce(o.meshes),["primitives"]),g=$(Ce(b.primitives),["attributes","indices","\
mode","material"]);g.mode!==void 0&&g.mode!==4&&M("only triangles are supported"),$(g.attributes,["POSITION","NORMAL","C\
OLOR_0","TEXCOORD_0","TANGENT"]),!r&&(g.attributes.TEXCOORD_0!==void 0||g.attributes.TANGENT!==void 0||o.images!==void 0||
o.textures!==void 0||o.samplers!==void 0)&&M("textured profile requires a compatible peer"),Object.hasOwn(g.attributes,"\
POSITION")||M("missing positions");const f=$(Ce(o.buffers),["byteLength"]);ee(f.byteLength,1,a),a-f.byteLength>3&&M("BIN\
 padding"),(!Array.isArray(o.bufferViews)||o.bufferViews.length<2||o.bufferViews.length>6+Me.count||!Array.isArray(o.accessors)||
o.accessors.length<2||o.accessors.length>6)&&M("accessor count");const y=[];for(const T of o.bufferViews){$(T,["buffer",
"byteOffset","byteLength","target"]),(T.buffer!==0||T.target!==void 0&&![34962,34963].includes(T.target))&&M("buffer vie\
w");const O=ee(T.byteOffset??0,0,f.byteLength),U=ee(T.byteLength,1,f.byteLength-O);O%4&&M("buffer alignment"),y.some(([_,
B])=>O<B&&O+U>_)&&M("overlapping buffer views"),y.push([O,O+U])}const p=new Set,S=new Set;function m(T,O){ee(T,0,o.accessors.
length-1),p.has(T)&&M("reused accessor"),p.add(T);const U=$(o.accessors[T],["bufferView","byteOffset","componentType","c\
ount","type","min","max"]);ee(U.bufferView,0,o.bufferViews.length-1),S.has(U.bufferView)&&M("reused buffer view"),S.add(
U.bufferView);const _=O==="indices"?1:O==="uvs"?2:O==="tangents"||O==="colors"&&U.type==="VEC4"?4:3;(U.type!==(_===1?"SC\
ALAR":`VEC${_}`)||(O==="indices"?![5123,5125].includes(U.componentType):U.componentType!==5126))&&M("accessor format");const B=U.
componentType===5123?2:4,k=ee(U.count,3,O==="indices"?se.triangles*3:se.vertices),F=y[U.bufferView],fe=ee(U.byteOffset??
0,0,F[1]-F[0]);(fe%B||fe+k*_*B!==F[1]-F[0])&&M("accessor byte range");const K=new DataView(e.buffer,e.byteOffset+s+8+F[0]+
fe,k*_*B),Se=U.componentType===5126?ae=>K.getFloat32(ae*4,!0):U.componentType===5125?ae=>K.getUint32(ae*4,!0):ae=>K.getUint16(
ae*2,!0);return{entry:U,count:k,components:_,get:Se}}const c=m(g.attributes.POSITION,"positions"),u={min:[1/0,1/0,1/0],max:[
-1/0,-1/0,-1/0]};for(let T=0;T<c.count*3;T++){const O=c.get(T);(!Number.isFinite(O)||Math.abs(O)>se.coordinate)&&M("nonf\
inite or excessive position"),u.min[T%3]=Math.min(u.min[T%3],O),u.max[T%3]=Math.max(u.max[T%3],O)}for(const T of["min","\
max"])rr(Kr(c.entry[T],3),u[T])||M("position bounds mismatch");u.min.every((T,O)=>T===u.max[O])&&M("empty geometry");for(const[
T,O]of[["NORMAL","normals"],["COLOR_0","colors"],["TEXCOORD_0","uvs"],["TANGENT","tangents"]]){if(!Object.hasOwn(g.attributes,
T))continue;const U=m(g.attributes[T],O);(U.count!==c.count||U.entry.min!==void 0||U.entry.max!==void 0)&&M("attribute c\
ount or bounds");for(let _=0;_<U.count*U.components;_++){const B=U.get(_);(!Number.isFinite(B)||B<(["colors","uvs"].includes(
O)?0:-1.001)||B>(["colors","uvs"].includes(O)?1:1.001))&&M("invalid attribute value")}if(O==="normals"||O==="tangents")for(let _=0;_<
U.count;_++){const B=_*U.components,k=Math.hypot(U.get(B),U.get(B+1),U.get(B+2));Math.abs(k-1)>.001&&M("normal or tangen\
t must be a unit vector"),O==="tangents"&&![-1,1].includes(U.get(B+3))&&M("tangent handedness")}}g.attributes.TANGENT!==
void 0&&g.attributes.NORMAL===void 0&&M("tangent requires normals");const C=m(g.indices,"indices");(C.count%3||C.entry.min!==
void 0||C.entry.max!==void 0)&&M("triangle indices");for(let T=0;T<C.count;T++){const O=C.get(T);O>=c.count&&M("index ou\
tside positions"),C.entry.componentType===5123&&O===65535&&M("primitive restart index")}const w=new Set,I=new Set,x=new Set;
function A(T,O=!1){$(T,O?["index","texCoord","scale"]:["index","texCoord"]),(!Array.isArray(o.textures)||T.texCoord!==void 0&&
T.texCoord!==0||g.attributes.TEXCOORD_0===void 0)&&M("texture coordinates"),ee(T.index,0,o.textures.length-1),w.add(T.index),
O&&(g.attributes.NORMAL===void 0||T.scale!==void 0&&(!Number.isFinite(T.scale)||T.scale<0||T.scale>1))&&M("normal textur\
e")}if(o.materials!==void 0){const T=$(Ce(o.materials),["pbrMetallicRoughness","doubleSided","alphaMode","normalTexture"]);
T.doubleSided!==void 0&&typeof T.doubleSided!="boolean"&&M("material"),T.alphaMode!==void 0&&T.alphaMode!=="OPAQUE"&&M("\
material alpha");const O=$(T.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor","baseColorTextur\
e","metallicRoughnessTexture"]);O.baseColorFactor!==void 0&&Kr(O.baseColorFactor,4,0,1);for(const U of["metallicFactor",
"roughnessFactor"])O[U]!==void 0&&(!Number.isFinite(O[U])||O[U]<0||O[U]>1)&&M("material factor");g.material!==0&&M("mate\
rial index");for(const U of["baseColorTexture","metallicRoughnessTexture"])O[U]!==void 0&&A(O[U]);T.normalTexture!==void 0&&
A(T.normalTexture,!0)}else g.material!==void 0&&M("missing material");for(const T of["textures","images","samplers"])o[T]!==
void 0&&(!Array.isArray(o[T])||o[T].length<1||o[T].length>Me.count)&&M("texture table count");for(const T of o.textures??
[])$(T,["source","sampler"]),ee(T.source,0,(((R=o.images)==null?void 0:R.length)??0)-1),I.add(T.source),T.sampler!==void 0&&
(ee(T.sampler,0,(((v=o.samplers)==null?void 0:v.length)??0)-1),x.add(T.sampler));for(const T of o.samplers??[]){$(T,["ma\
gFilter","minFilter","wrapS","wrapT"]);for(const O of["magFilter","minFilter","wrapS","wrapT"])T[O]!==void 0&&!(O.startsWith(
"wrap")?[33071,33648,10497]:O==="magFilter"?[9728,9729]:[9728,9729,9984,9985,9986,9987]).includes(T[O])&&M("texture samp\
ler")}let E=0;for(const T of o.images??[]){$(T,["bufferView","mimeType"]),ee(T.bufferView,0,o.bufferViews.length-1),(S.has(
T.bufferView)||o.bufferViews[T.bufferView].target!==void 0)&&M("image buffer view"),S.add(T.bufferView);const O=y[T.bufferView],
U=s+8,_=e.subarray(U+O[0],U+O[1]),B=Vn(_,T.mimeType);E+=B.pixels,E>Me.pixels&&M("texture pixel limit"),t.push({...B,data:_})}
return(w.size!==(((N=o.textures)==null?void 0:N.length)??0)||I.size!==(((D=o.images)==null?void 0:D.length)??0)||x.size!==
(((z=o.samplers)==null?void 0:z.length)??0))&&M("unused texture resource"),(p.size!==o.accessors.length||S.size!==o.bufferViews.
length)&&M("unused accessor"),{vertexCount:c.count,triangleCount:C.count/3,bounds:u}}function wf(e,t={}){(!((e==null?void 0:
e.data)instanceof Uint8Array)||e.data.byteLength<32||e.data.byteLength>se.byteLength)&&M("binary byte limit");const r=new Uint8Array(
e.data),n={format:"glb",mimeType:bf,byteLength:r.byteLength,sha256:kd(Vd(r)),...yf(r,[],t)};for(const i of Object.keys(n))
e[i]!==void 0&&!rr(e[i],n[i])&&M(`${i} mismatch`);return{...n,data:r}}function Tu({positions:e,indices:t,normals:r,colors:n,
uvs:i,tangents:o,textures:s,roughness:a=1,metallic:d=0}){(!(e instanceof Float32Array)||e.length%3||!(t instanceof Uint16Array||
t instanceof Uint32Array)||t.length%3)&&M("geometry arrays");const l=ee(e.length/3,3,se.vertices);ee(t.length/3,1,se.triangles),
r!==void 0&&(!(r instanceof Float32Array)||r.length!==e.length)&&M("normal array"),n!==void 0&&(!(n instanceof Float32Array)||
![l*3,l*4].includes(n.length))&&M("color array"),i!==void 0&&(!(i instanceof Float32Array)||i.length!==l*2)&&M("UV array"),
o!==void 0&&(!(o instanceof Float32Array)||o.length!==l*4)&&M("tangent array"),s!==void 0&&$(s,["baseColor","normal","me\
tallicRoughness"]);const b={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let v=0;v<e.length;v++)b.min[v%3]=Math.min(b.min[v%
3],e[v]),b.max[v%3]=Math.max(b.max[v%3],e[v]);const g=[],f=[],y=[],p={};let S=0;const m=(v,N,D,z={})=>{const T=f.length,
O=new Uint8Array(v.byteLength),U=new DataView(O.buffer);for(let _=0;_<v.length;_++)v instanceof Float32Array?U.setFloat32(
_*4,v[_],!0):v instanceof Uint32Array?U.setUint32(_*4,v[_],!0):U.setUint16(_*2,v[_],!0);return g.push({offset:S,data:O}),
y.push({buffer:0,byteOffset:S,byteLength:O.byteLength,target:D}),f.push({bufferView:T,componentType:v instanceof Float32Array?
5126:v instanceof Uint32Array?5125:5123,count:N==="SCALAR"?v.length:l,type:N,...z}),S+=Math.ceil(O.byteLength/4)*4,T};p.
POSITION=m(e,"VEC3",34962,b),r!==void 0&&(p.NORMAL=m(r,"VEC3",34962)),n!==void 0&&(p.COLOR_0=m(n,n.length===l*4?"VEC4":"\
VEC3",34962)),i!==void 0&&(p.TEXCOORD_0=m(i,"VEC2",34962)),o!==void 0&&(p.TANGENT=m(o,"VEC4",34962));const c=m(t,"SCALAR",
34963),u={pbrMetallicRoughness:{metallicFactor:d,roughnessFactor:a},doubleSided:!0},C=[],w=[];for(const v of["baseColor",
"normal","metallicRoughness"]){if((s==null?void 0:s[v])===void 0)continue;const N=$(s[v],["data","mimeType"]);Vn(N.data,
N.mimeType);const D=C.length;C.push({bufferView:y.length,mimeType:N.mimeType}),w.push({source:D,sampler:0}),y.push({buffer:0,
byteOffset:S,byteLength:N.data.byteLength}),g.push({offset:S,data:N.data}),S+=Math.ceil(N.data.byteLength/4)*4,v==="norm\
al"?u.normalTexture={index:D}:u.pbrMetallicRoughness[`${v}Texture`]={index:D}}const I=mf.encode(JSON.stringify({asset:{version:"\
2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:p,
indices:c,mode:4,material:0}]}],materials:[u],buffers:[{byteLength:S}],bufferViews:y,accessors:f,...C.length?{images:C,textures:w,
samplers:[{magFilter:9729,minFilter:9729}]}:{}})),x=Math.ceil(I.byteLength/4)*4,A=28+x+S;(A>se.byteLength||x>se.jsonBytes)&&
M("encoded byte limit");const E=new Uint8Array(A),R=new DataView(E.buffer);R.setUint32(0,1179937895,!0),R.setUint32(4,2,
!0),R.setUint32(8,A,!0),R.setUint32(12,x,!0),R.setUint32(16,1313821514,!0),E.fill(32,20,20+x),E.set(I,20),R.setUint32(20+
x,S,!0),R.setUint32(24+x,5130562,!0);for(const v of g)E.set(v.data,28+x+v.offset);return wf({data:E})}new TextEncoder;new TextEncoder;
new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextDecoder;
new TextEncoder;new TextDecoder;const Ef="peercompute.gpu.resident-stage-executor.v0",vf="peercompute.gpu.resident-stage\
-worker-policy.v0";function oe(e,t=null){return String(e??"").trim()||t}function Lt(e){return e==null?null:JSON.parse(JSON.
stringify(e))}function Xr(e,t=!1){return typeof e=="boolean"?e:t}function Af(e,t=null){const r=Math.floor(Number(e));return Number.
isFinite(r)&&r>=0?r:t}function Sf(e={},t=null){const r=e&&typeof e=="object"?e:{},n=oe(r.mode??r.residencyMode,null),i=!!(r.
worker||r.workerReady||r.workerModuleUrl||r.workerType),o=n||(i?"dedicated-worker":"inline"),s=Xr(r.workerReady,!1)||!!r.
worker,a=o==="dedicated-worker"||o==="webgpu-worker"||o==="gpu-compute-worker",d=a?"dedicated-worker":"inline",l=a?s?"wo\
rker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:vf,stageId:t,mode:d,status:l,workerType:oe(r.workerType,
a?"webgpu-compute-worker":null),workerModuleUrl:oe(r.workerModuleUrl??r.moduleUrl,null),startupMode:oe(r.startupMode,a?"\
warm-on-first-use":"inline"),idleTtlMs:Af(r.idleTtlMs,a?6e4:null),sameDeviceRequired:Xr(r.sameDeviceRequired,a),bufferTransferPolicy:oe(
r.bufferTransferPolicy,a?"worker-owns-device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:l===
"blocked-worker-backend-missing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-w\
orker-policy"}}async function xf(e,t){if(typeof e=="function")return e(t);if(e&&typeof e.runStage=="function")return e.runStage(
t);throw new Error("[GPUHubManager] Resident stage worker backend must be a function or expose runStage()")}class If{constructor(t={}){
this.frameBudgetMs=t.frameBudgetMs??4,this.hotStore=t.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=
new Map,this.residentStageExecutorAliases=new Map}async initialize(t={}){if(t.device)return this.device=t.device,this.device;
if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.
gpu.requestAdapter(t.adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.
device=await r.requestDevice(t.deviceDescriptor),this.device}setDevice(t){this.device=t}getHotStore(){return this.hotStore}registerHotBuffer(t,r){
this.hotStore.set(t,r)}registerHotBufferSet(t,r){this.hotStore.set(t,r)}getHotBufferSet(t){return this.hotStore.get(t)}getHotBuffer(t){
return this.hotStore.get(t)}createHotBuffer(t,r,n,i){if(!this.device)throw new Error("[GPUHubManager] Device not initial\
ized");const o=this.device.createBuffer({size:r,usage:n,label:i});return this.hotStore.set(t,o),o}removeHotBuffer(t){this.
hotStore.delete(t)}registerResidentStageExecutor(t,r=null){var d;const n=typeof t=="string"?{stageId:t,executor:r}:{...t||
{}},i=oe(n.stageId??n.id,null);if(!i)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const o=n.
executor||r,s=n.workerRunner||n.workerBackend||((d=n.workerPolicy)==null?void 0:d.workerRunner)||null;if(typeof o!="func\
tion"&&!s)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${i}`);const a={schema:Ef,stageId:i,
lawNodeId:oe(n.lawNodeId,null),runtimeTarget:oe(n.runtimeTarget,s?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-\
executor"),executor:typeof o=="function"?o:null,workerRunner:s,workerPolicy:Sf({...n.workerPolicy||n.workerResidency||{},
workerReady:(n.workerPolicy||n.workerResidency||{}).workerReady||!!s},i),metadata:Lt(n.metadata||{}),registeredAt:Date.now()};
return this.residentStageExecutors.set(i,a),a.lawNodeId&&this.residentStageExecutorAliases.set(a.lawNodeId,i),this.describeResidentStageExecutor(
i)}describeResidentStageExecutor(t){const r=this.getResidentStageExecutorRecord(t);return r?{schema:r.schema,stageId:r.stageId,
lawNodeId:r.lawNodeId,runtimeTarget:r.runtimeTarget,workerPolicy:Lt(r.workerPolicy),metadata:Lt(r.metadata||{}),registeredAt:r.
registeredAt}:null}getResidentStageExecutorRecord(t){const r=oe(typeof t=="string"?t:(t==null?void 0:t.id)??(t==null?void 0:
t.stageId),null),n=oe(typeof t=="string"?null:t==null?void 0:t.lawNodeId,null);if(r&&this.residentStageExecutors.has(r))
return this.residentStageExecutors.get(r);const i=n?this.residentStageExecutorAliases.get(n):null;return i?this.residentStageExecutors.
get(i):null}hasResidentStageExecutor(t){return!!this.getResidentStageExecutorRecord(t)}listResidentStageExecutors(){return[
...this.residentStageExecutors.keys()].sort().map(t=>this.describeResidentStageExecutor(t))}async executeResidentStage(t={}){
var i,o;const r=this.getResidentStageExecutorRecord(t.stage);if(!r){const s=oe(((i=t.stage)==null?void 0:i.id)??((o=t.stage)==
null?void 0:o.stageId),"unknown"),a=new Error(`[GPUHubManager] Missing resident stage executor: ${s}`);throw a.code="ERR\
_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",a.stage=t.stage||null,a}const n={...t,gpuHub:this,device:this.device,executor:this.
describeResidentStageExecutor(r.stageId)};return r.workerRunner?xf(r.workerRunner,n):r.executor(n)}registerTask(t,r){this.
tasks.set(t,r)}unregisterTask(t){this.tasks.delete(t)}tick(){}}const Le="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-\
abl-GGUF",Pe="5ce3fd841676adf2c1a10d7193637d46007e88f7",Jr=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd44\
1111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"N\
OTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_X\
S.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,
gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5\
593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913\
dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.js\
on",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"\
5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9a\
e04fff09706ef"}],Tf="This catalog supports verified storage and distribution. Execution is admitted separately by the ma\
naged llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function Qn(e){for(const t of Object.
values(e))t&&typeof t=="object"&&Qn(t);return Object.freeze(e)}const Cf=Qn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.\
8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Le,revision:Pe,status:"storage-only",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Tf},
license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Le}/blob/${Pe}/LICENSE`,notice:"Preserve upstream LICENSE\
, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Le,revision:Pe,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${Le}/blob/${Pe}/README.md`,sourceManifestPath:"artifact-manifest.json"},
model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:[
"IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Le,revision:Pe},weightBytes:14199740480,totalBytes:Jr.reduce((e,t)=>e+
t.size,0),files:Jr}});function Yn(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Yn),Object.
freeze(e)),e}const Of=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental \
text)",repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",dtype:"\
q5_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},
blockCount:32,nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability \
damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; th\
inking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-Q5_K_M.gguf",size:6467969824,
sha256:"bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README.md",size:4013,sha256:"825f21663\
874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7274149e70cfd0dc7940d87",source:{
repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"README.m\
d"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f\
938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689\
a9d2da3897eae104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b\
7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qw\
en3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,
sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e627395833067\
30adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d\
8",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwen3.5 9B Claude HighIQ Thinking H\
eretic (DavidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-U\
NCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{repository:"DavidAU/Qwen\
3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808"},blockCount:32,
nextnPredictLayers:0,behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; not a guarantee of refusal-\
free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidAU source. The browser ada\
pter currently runs text only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",size:5627045888,
sha256:"b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"README.md",size:5730,sha256:"eea5e5147\
40c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e17cf35bea52a3a2d74e42b14a24a",source:{
repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb3358452\
1767646adf9663b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"0afc6c4508d99e8966cfd6164d6a3ea924c67\
81c97319223170c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",source:{repository:"DavidAU/Qwen3.5-\
9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808",path:"README.md"}},
{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f93813\
6e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"c202236235762e1c871ad0ccb60c8ee5ba337\
b9a",path:"LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q8_0, expe\
rimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",
dtype:"q8_0",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015\
cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capab\
ility damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claim\
ed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,
sha256:"e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},{path:"README.md",size:4035,sha256:"2d11817c7\
5831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{
repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},
{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"\
defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570\
a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwe\
n3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"\
86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},
{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"0\
1597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13a\
f75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evi\
l (mradermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e\
067bceb703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b6\
6fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",
notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. \
Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qw\
en3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},
{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21\
a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067b\
ceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4\
e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmansl\
ayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,
sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d\
97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"\
LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"\
1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdc\
da83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Q\
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],Rf=Yn(Object.fromEntries(
Of.map(e=>{const{dtype:t,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=e,a=o.files.find(d=>d.path==="LICENSE").source;
return[o.id,{...o,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, c\
ross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device executio\
n validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/"+a.repository+"/blob/"+a.revision+"/LICENS\
E",notice:"The inherited Apache-2.0 license, conversion/source cards and available modification notices are included."},
provenance:{repository:o.repository,revision:o.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https\
://huggingface.co/"+o.repository+"/blob/"+o.revision+"/README.md",sourceModel:{...r,revisionPurpose:"Pinned source docum\
entation and license reference; the converter does not identify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},
upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:n,nextnPredictLayers:i,inspectedPrefixBytes:65536},
vision:"Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the curre\
nt managed GGUF adapter rejects images.",behavior:o.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"\
qwen3_5",format:"GGUF",task:"text-generation",dtype:t,modalities:["text"],requiredFeatures:["shader-f16"],repository:o.repository,
revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.files.reduce((d,l)=>d+l.size,0)}]})));function wr(e){return e&&
typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(wr),Object.freeze(e)),e}const pe="Tsotchke-Corporatio\
n",Kn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
text)",repository:`${pe}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",
architecture:"qwen3_moe",quantizationTypes:["F32","Q8_0","Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-\
Coder-30B-A3B-Instruct-abliterated",revision:"b84c58d52ac44041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimen\
tal lossy mixed quantization of an abliterated parent. Behavioral quality, SAE certification and runtime qualification a\
re untested.",files:[{path:".gitattributes",size:1609,gitBlobSha1:"3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LIC\
ENSE",size:11343,gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ec\
e140e83416522e0d00b53880e8bb13"},{path:"Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"\
2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51"},{path:"README.md",size:2765,gitBlobSha1:"00227290350d\
0484631d06756736f4dff2e8bd66"},{path:"artifact-manifest.json",size:7659,gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6\
e5d05"},{path:"chat_template.jinja",size:6853,gitBlobSha1:"3656cd64ff2fcc6ae59312eb87a709e0aa25b2eb"},{path:"config.json",
size:1065,gitBlobSha1:"5288c67c42b574d39f790e6bf8836f57ec477483"},{path:"generation_config.json",size:235,gitBlobSha1:"f\
1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"tokenizer_config.json",size:5644,gitBlobSha1:"b2cbe86ae45a1274c9b93ec06\
0466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,gitBlobSha1:"57027eb456280780650ef6bc44524b396734cbcf"}]},{id:"qw\
en3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${pe}\
/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac671898b95",architecture:"qwen3_5_moe",quantizationTypes:[
"F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],sourceModel:{repository:"ericpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-\
bf16",revision:"f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed"},publisherLimitations:"The publisher records a failed coding-q\
uality gate and no complete capability certificate. Its internal qLLM Metal gguf-c20 runtime is not a public portable-ru\
ntime qualification; a public pinned clean-machine recipe remains unverified. This is not the GeoRefine TBE codec.",files:[
{path:".gitattributes",size:1699,gitBlobSha1:"f44e4e63e69c8b9a20797fd820049ea27bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,
gitBlobSha1:"3cb693fce32249c21d7a621060df41dbf5df64a9"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e\
21ebe6f181687d02"},{path:"NOTICE",size:465,gitBlobSha1:"4852a35fe237eb4335504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3\
B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,sha256:"027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce91\
1c96"},{path:"README.md",size:4914,gitBlobSha1:"601a361b4a8308e9121749810fb103b644c581c1"},{path:"artifact-manifest.json",
size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a008315f8a1a9f"},{path:"config.json",size:3148,gitBlobSha1:"09981f690fa\
954e74c4ae3d66163bb68435d14ca"},{path:"generation_config.json",size:243,gitBlobSha1:"be05abc6b17ea7880b71c67d31f7264f92c\
34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"1838f3b7f5e64b0f32abbd98181ea3ca8b3abfbc"},{path:"tokenize\
r.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19ff992d9ac7"},{path:"tokenizer_config\
.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec"},{path:"verify_c20.py",size:886,gitBlobSha1:"2b\
a7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-georefine-l162-gguf",name:"Qwen3.8 27B GeoRefine L162 (mixed\
 Q4_K GGUF, candidate text)",repository:`${pe}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd\
3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32","Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{repository:"hu\
ihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f6c238ce1e5b70008612ae42cdd"},publisherLimitations:"Exper\
imental lossy mixed quantization; behavioral quality and runtime qualification are untested. Q4_K_M_CUSTOM labels a cust\
om allocation of standard GGUF tensor types, not a custom codec or the standard llama.cpp Q4_K_M allocation recipe. The \
inherited Q8_0 header label does not describe the tensor mix.",files:[{path:".gitattributes",size:1694,gitBlobSha1:"f41c\
1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},
{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},{path:"Qwen3.8-27B-GeoRefine-L162-abl-MI\
XED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd"},{path:"\
README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},{path:"artifact-manifest.json",size:5897,gitBlobSha1:"\
fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}]}],Nf=wr(Object.fromEntries(Kn.map(e=>{const{architecture:t,quantizationTypes:r,sourceModel:n,
publisherLimitations:i,...o}=e;return[e.id,{...o,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${e.repository}\
/blob/${e.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:e.repository,revision:e.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:n,
publisherLimitations:i,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:r,modalities:["text"],requiredFeatures:["shader-f16"],repository:e.repository,
revision:e.revision},weightBytes:e.files.filter(s=>s.path.endsWith(".gguf")).reduce((s,a)=>s+a.size,0),totalBytes:e.files.
reduce((s,a)=>s+a.size,0)}]})));wr({organization:pe,sourceUrl:`https://huggingface.co/${pe}`,checkedAt:"2026-11-04",repositories:[
...Kn.map(({id:e,repository:t,revision:r})=>({repository:t,revision:r,catalogId:e,format:"GGUF",codecRequired:!1})),{repository:`${pe}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${pe}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${pe}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${pe}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const it="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",ot="036d46331b5ef633654ff516e739\
73e81c8eca79",Zr="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",en=`https://huggingface.co/${it}/blob/${ot}/README.\
md`,Pt=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59b\
b8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028\
c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function Xn(e){return e&&typeof e=="object"&&
!Object.isFrozen(e)&&(Object.values(e).forEach(Xn),Object.freeze(e)),e}const _f=Xn({[Zr]:{id:Zr,name:"MiMo V2.6 Distill \
Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:it,revision:ot,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"\
User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolat\
ion, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher\
-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"\
MIT",sourceUrl:en,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked \
parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:it,revision:ot,format:"GGUF",
metadataCheckedAt:"2026-11-10",modelCardUrl:en,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"\
1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion i\
nput revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for t\
hese GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 o\
nly; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"\
working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not suppl\
ied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",
task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:it,revision:ot},weightBytes:Pt[0].
size,totalBytes:Pt.reduce((e,t)=>e+t.size,0),files:Pt}}),st="TrevorJS/gemma-4-12B-it-uncensored-GGUF",at="d878d412b001a7\
20b9a62eaac432d00aac9d1b4f",tn="gemma4-12b-uncensored-q4-k-m-gguf",Mf=`https://huggingface.co/${st}/blob/${at}/README.md`,
rn="TrevorJS/gemma-4-12B-it-uncensored",nn="159eb7a8a04efb31ed43887e4732ff3edccff8ac",zt=[{path:"gemma-4-12B-it-uncensor\
ed-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README\
.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961\
e18b9a380366eb9ed3d6ee"}];function Jn(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Jn),
Object.freeze(e)),e}const Zn=Jn({[tn]:{id:tn,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:st,revision:at,
status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this\
 exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires sh\
ader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publi\
sher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apa\
che-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. Th\
e conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENS\
E file."},provenance:{repository:st,revision:at,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:Mf,sourceModel:{
repository:rn,revision:nn,modelCardUrl:`https://huggingface.co/${rn}/blob/${nn}/README.md`,modelCardBytes:4929,modelCardSha256:"\
d2994dbe94e6a1c3fce070b0b6efc5fe8e9aa4a7803b41f29c1479713bad352b",revisionPurpose:"Pinned source metadata reference; not\
 a verified conversion input revision.",conversionInputRevisionVerified:!1},upstreamModel:{repository:"google/gemma-4-12\
B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",revisionPurpose:"Pinned upstream metadata and license referenc\
e.",architecture:"Gemma4UnifiedForConditionalGeneration",modalities:["text","image","audio"]},vision:"The upstream model\
 is multimodal; this is a text-only GGUF package without a vision or audio projector. Upstream capabilities do not estab\
lish browser support.",publisherEvaluation:"The source card reports native llama.cpp Q8 testing; it does not establish Q\
4_K_M browser execution.",runtimeRequirement:"Gemma4Unified support from llama.cpp PR #24118 (2026-06-04 or later), incl\
uding the gemma4 tokenizer.",ggufHeader:{version:3,architecture:"gemma4",tokenizer:"gemma4",blockCount:48,tensorCount:667,
contextLength:262144,completeHeaderBytes:15822379,tensorTypes:["F32","Q4_K","Q6_K"]}},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:"gemma4",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["\
shader-f16"],repository:st,revision:at},weightBytes:zt[0].size,totalBytes:zt.reduce((e,t)=>e+t.size,0),files:zt}});function ei(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(ei),Object.freeze(e)),e}const nr=ei({id:"ge\
mma4-unified-trevor-159eb7a8-f16-v1",converterRevision:"46ca246de9bb1c35269722a6240d37d9dfd79cad",source:{repository:"Tr\
evorJS/gemma-4-12B-it-uncensored",revision:"159eb7a8a04efb31ed43887e4732ff3edccff8ac",url:"https://huggingface.co/Trevor\
JS/gemma-4-12B-it-uncensored/resolve/159eb7a8a04efb31ed43887e4732ff3edccff8ac/model.safetensors",size:23919549408,publisherSha256:"\
dd7fcab67274aea3adaf0f29fb6bc120b504f8b1a597124f03c15259e20c6f84"},sourceTensorBytes:104759808,size:122030944,sha256:"ee\
1fed84b7d15ffc4d13c44b59fff59e50fe89f36adcc5ec4900c83efd0edc27",headerHex:"47475546030000000b000000000000001b00000000000\
000140000000000000067656e6572616c2e617263686974656374757265080000000400000000000000636c69700c0000000000000067656e6572616\
c2e747970650800000006000000000000006d6d70726f6a0c0000000000000067656e6572616c2e6e616d6508000000230000000000000047656d6d6\
1342031324220547265766f7220556e696669656420436f6d70616e696f6e120000000000000067656e6572616c2e73697a655f6c6162656c0800000\
0030000000000000035324d110000000000000067656e6572616c2e66696c655f7479706504000000010000001700000000000000636c69702e68617\
35f766973696f6e5f656e636f64657207000000011a00000000000000636c69702e766973696f6e2e70726f6a656374696f6e5f64696d04000000000\
f00001600000000000000636c69702e766973696f6e2e696d6167655f73697a6504000000e00000001600000000000000636c69702e766973696f6e2\
e70617463685f73697a6504000000100000001c00000000000000636c69702e766973696f6e2e656d62656464696e675f6c656e67746804000000000\
f00001f00000000000000636c69702e766973696f6e2e666565645f666f72776172645f6c656e67746804000000000000001700000000000000636c6\
9702e766973696f6e2e626c6f636b5f636f756e7404000000000000002000000000000000636c69702e766973696f6e2e617474656e74696f6e2e686\
561645f636f756e7404000000000000001600000000000000636c69702e766973696f6e2e696d6167655f6d65616e090000000600000003000000000\
000000000000000000000000000001500000000000000636c69702e766973696f6e2e696d6167655f737464090000000600000003000000000000000\
000803f0000803f0000803f1600000000000000636c69702e6861735f617564696f5f656e636f64657207000000011900000000000000636c69702e6\
17564696f2e70726f6a656374696f6e5f64696d04000000000f00001b00000000000000636c69702e617564696f2e656d62656464696e675f6c656e6\
7746804000000800200001e00000000000000636c69702e617564696f2e666565645f666f72776172645f6c656e67746804000000000000001600000\
000000000636c69702e617564696f2e626c6f636b5f636f756e7404000000000000001f00000000000000636c69702e617564696f2e617474656e746\
96f6e2e686561645f636f756e7404000000000000001a00000000000000636c69702e766973696f6e2e70726f6a6563746f725f74797065080000000\
80000000000000067656d6d613475762800000000000000636c69702e766973696f6e2e617474656e74696f6e2e6c617965725f6e6f726d5f6570736\
96c6f6e06000000bd3786351900000000000000636c69702e617564696f2e70726f6a6563746f725f7479706508000000080000000000000067656d6\
d613475611700000000000000636c69702e617564696f2e6e756d5f6d656c5f62696e7304000000800000002700000000000000636c69702e6175646\
96f2e617474656e74696f6e2e6c617965725f6e6f726d5f657073696c6f6e06000000bd3786351c0000000000000067656e6572616c2e7175616e746\
97a6174696f6e5f76657273696f6e04000000020000001c000000000000006d6d2e612e696e7075745f70726f6a656374696f6e2e776569676874020\
000008002000000000000000f0000000000000100000000000000000000001a000000000000006d6d2e696e7075745f70726f6a656374696f6e2e776\
56967687402000000000f000000000000000f0000000000000100000000004b00000000001100000000000000762e70617463685f656d62642e62696\
17301000000000f0000000000000000000000000d02000000001300000000000000762e70617463685f656d62642e77656967687402000000001b000\
000000000000f00000000000001000000003c0d02000000001300000000000000762e70617463685f6e6f726d2e312e6269617301000000001b00000\
000000000000000003c3705000000001500000000000000762e70617463685f6e6f726d2e312e77656967687401000000001b0000000000000000000\
000a83705000000001300000000000000762e70617463685f6e6f726d2e322e6269617301000000000f0000000000000000000000143805000000001\
500000000000000762e70617463685f6e6f726d2e322e77656967687401000000000f000000000000000000000050380500000000160000000000000\
0762e706f736974696f6e5f656d62642e77656967687403000000000f0000000000006004000000000000020000000000000000000000008c3805000\
000001300000000000000762e70617463685f6e6f726d2e332e6269617301000000000f00000000000000000000008c4507000000001500000000000\
000762e70617463685f6e6f726d2e332e77656967687401000000000f0000000000000000000000c8450700000000000000000000000000000000000\
00000000000",tensors:[{sourceName:"model.embed_audio.embedding_projection.weight",sourceOffset:88960,sourceBytes:4915200,
sourceSha256:"13acfa416b1b5462172e035f4d0bfa8b5687ffcbe8e39a641c0f6255deae55aa",transform:"identity",outputName:"mm.a.in\
put_projection.weight",outputType:"f16",outputOffset:1888,outputBytes:4915200},{sourceName:"model.embed_vision.embedding\
_projection.weight",sourceOffset:5004160,sourceBytes:29491200,sourceSha256:"24b039b273e7abb78598449b14ca508f52b2b6f8a9de\
e02636eb999dd74b76cb",transform:"identity",outputName:"mm.input_projection.weight",outputType:"f16",outputOffset:4917088,
outputBytes:29491200},{sourceName:"model.vision_embedder.patch_dense.bias",sourceOffset:23849196e3,sourceBytes:7680,sourceSha256:"\
cff453202ce800f6ae86de0155916397807569cf9982aff6ecbf4d338d4e6367",transform:"identity",outputName:"v.patch_embd.bias",outputType:"\
f32",outputOffset:34408288,outputBytes:15360},{sourceName:"model.vision_embedder.patch_dense.weight",sourceOffset:23849203680,
sourceBytes:53084160,sourceSha256:"3e6de438f7269759f3f380cf17ea4b7be38f66fb1bf080a13afe52d08db2d8cb",transform:"patch-ch\
w",outputName:"v.patch_embd.weight",outputType:"f16",outputOffset:34423648,outputBytes:53084160},{sourceName:"model.visi\
on_embedder.patch_ln1.bias",sourceOffset:23902287840,sourceBytes:13824,sourceSha256:"59feb36622246d1b1e063f36c13e0219b0e\
a8bf85387c963ef74e4572f9c4a62",transform:"patch-chw",outputName:"v.patch_norm.1.bias",outputType:"f32",outputOffset:87507808,
outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln1.weight",sourceOffset:23902301664,sourceBytes:13824,sourceSha256:"\
9f24ede566712933ce0e196985bda3678db26d2ba9986de83473d601236c266a",transform:"patch-chw",outputName:"v.patch_norm.1.weigh\
t",outputType:"f32",outputOffset:87535456,outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln2.bias",sourceOffset:23902315488,
sourceBytes:7680,sourceSha256:"7f0c14a2d8e734bcd6441ae26199efb5c29d08b51b43bbd32d65b8e4865e3df9",transform:"identity",outputName:"\
v.patch_norm.2.bias",outputType:"f32",outputOffset:87563104,outputBytes:15360},{sourceName:"model.vision_embedder.patch_\
ln2.weight",sourceOffset:23902323168,sourceBytes:7680,sourceSha256:"a4abbf0ce48d752c4b605d2f5bc882c84e4f02729c0dfcd3421e\
0905f7a03a90",transform:"identity",outputName:"v.patch_norm.2.weight",outputType:"f32",outputOffset:87578464,outputBytes:15360},
{sourceName:"model.vision_embedder.pos_embedding",sourceOffset:23902330848,sourceBytes:17203200,sourceSha256:"fec2505806\
22e6ae1e39ee89cf9c173e0a15a7987d75c5dcb1975ba08df178d0",transform:"position-xy",outputName:"v.position_embd.weight",outputType:"\
f32",outputOffset:87593824,outputBytes:34406400},{sourceName:"model.vision_embedder.pos_norm.bias",sourceOffset:23919534048,
sourceBytes:7680,sourceSha256:"43b0a2fbb80dcb85bb0602a686588ca8387703da9bf65ae55e20f8e763368aa1",transform:"identity",outputName:"\
v.patch_norm.3.bias",outputType:"f32",outputOffset:122000224,outputBytes:15360},{sourceName:"model.vision_embedder.pos_n\
orm.weight",sourceOffset:23919541728,sourceBytes:7680,sourceSha256:"712aba394794531a970fdfb9451492cc8286ecbb431951950dc2\
296c18697e5d",transform:"identity",outputName:"v.patch_norm.3.weight",outputType:"f32",outputOffset:122015584,outputBytes:15360}]}),
ir=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:nr.size,sha256:nr.sha256}),qe=Zn["gemma4-12b-uncensored-q4-\
k-m-gguf"],on="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",sn=[...qe.files,ir],ze=nr;function ti(e){return e&&typeof e==
"object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(ti),Object.freeze(e)),e}const Uf=ti({[on]:{...qe,id:on,name:"Ge\
mma 4 12B Uncensored (Q4_K_M, vision + audio)",files:sn,description:"Image and audio understanding with text replies. Re\
uses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading thi\
s package to avoid keeping two 12B models in GPU memory.",capabilities:{...qe.capabilities,executionStatus:"tested",executionReason:"\
Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained rel\
oad and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; \
speech synthesis uses a separate model."},model:{...qe.model,modalities:["text","image","audio"],ggufMedia:{profile:"gem\
ma4-unified-v1",projectorPath:ir.path}},provenance:{...qe.provenance,vision:"A separately derived Gemma4Unified companio\
n supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browse\
r execution remains unverified.",derivedArtifacts:[{path:ir.path,recipe:ze.id,sourceRepository:ze.source.repository,sourceRevision:ze.
source.revision,sourcePath:"model.safetensors",sourceFileSha256:ze.source.publisherSha256,sourceDigestVerification:"Publ\
isher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source c\
heckpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:ze.converterRevision,outputType:"f16"},
processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config\
.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced \
explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understan\
ding and transcription are distinct from image or speech generation."},totalBytes:sn.reduce((e,t)=>e+t.size,0)}}),Fe="ba\
rtowski/Qwen_Qwen3.5-0.8B-GGUF",Ge="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Ft=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",
size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"\
499cb320f9f2f3963beee9d8b890046f825c6f5d"}],or=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function ri(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(ri),Object.freeze(e)),e}const Bf=Object.fromEntries(
[{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0\
.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-\
abliterated.q4_k_m.gguf",size:396704896,sha256:"a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"\
README.md",size:2525,sha256:"bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363b\
e8f7103979938cc420c932911dbb",source:{repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149a\
af072a6490a68e144e",path:"README.md"}},{path:"LICENSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7\
d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"\
c1899de289a04d12100db370d81485cdf75e47ca",path:"LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.\
8B Abliterated (GGUF Q4_K_M, text)",repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27\
bfcb9804ab6122f119",architecture:"qwen3_5",files:[{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"ee\
f9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678\
ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"\
xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LI\
CENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd\
92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"\
LICENSE"}}]}].map(({architecture:e,...t})=>[t.id,ri({...t,status:"execution-candidate",format:"GGUF",capabilities:or,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${t.files[2].source.repository}/blob/${t.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:t.
repository,revision:t.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${t.repository}\
/blob/${t.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:t.repository,revision:t.revision},weightBytes:t.files[0].size,totalBytes:t.files.reduce((r,n)=>r+n.size,
0)})])),Cu=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:Fe,revision:Ge,status:"execution-candidate",format:"GGUF",capabilities:or,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Fe}/blob/${Ge}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:Fe,revision:Ge,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${Fe}/blob/${Ge}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Fe,revision:Ge},weightBytes:Ft[0].size,totalBytes:Ft.
reduce((e,t)=>e+t.size,0),files:Ft},...Bf,...Rf,..._f,...Zn,...Uf,...Nf,...Object.fromEntries(Object.entries(Cf).map(([e,
t])=>[e,{...t,status:"execution-candidate",capabilities:or}]))}),Ne=[{path:"u2netp.onnx",size:4574861,sha256:"309c846925\
8dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6a\
d64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"e447db65818dba51c001c1a5c9fc43\
c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07\
720c",path:"README.md"}}],sr={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817\
ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`},ni={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
7/LICENSE.txt",notice:`MIT License

Copyright (c) 2020 Daniel Gatis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},ii=[{path:"weights.bin",size:2285308688,sha256:"0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",source:{
repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"weights.bin"}},{
path:"README.md",size:2706,sha256:"00cf8aee3adbf563b1593ab4c96af59ed47582466658fafd924e1349ab51751a",source:{repository:"\
BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"README.md"}},{path:"LICENSE.\
md",size:11726,sha256:"9b60b9d0411f54d4087484ad4acf28ca6fd9f6a84c30ddacb04de2c623254749",source:{repository:"BasinShaper\
s/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"LICENSE.md"}},{path:"NOTICE",size:1464,
sha256:"b9b71f7a22dc2529840a5a53f61022bff499994d15446d0506eb5591a3f90376",source:{repository:"BasinShapers/sf3d-webgpu-w\
eights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",path:"NOTICE"}},{path:"tets/vertices.bin",size:6430584,sha256:"\
16f4ee01a050d1757c19b13a7e1dbd4d0918d08208d961c105ff74cbfc345dac",source:{repository:"needle-tools/SF3D-webgpu",revision:"\
56d2f58d27395b0be9c633671b439b4aac482549",path:"tets_vertices.bin"}},{path:"tets/indices.bin",size:47543232,sha256:"606c\
c8b47f8744a64ff6f1f3c088d9d9113ff80539bd62cb1651f8dc629d1f1e",source:{repository:"needle-tools/SF3D-webgpu",revision:"56\
d2f58d27395b0be9c633671b439b4aac482549",path:"tets_indices.bin"}}],an={spdx:"LicenseRef-Stability-AI-Community",sourceUrl:"\
https://huggingface.co/BasinShapers/sf3d-webgpu-weights/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/LICENSE.md",notice:`\
STABILITY AI COMMUNITY LICENSE AGREEMENT
Last Updated: July 5, 2024


I. INTRODUCTION

This Agreement applies to any individual person or entity ("You", "Your" or "Licensee") that uses or distributes any por\
tion or element of the Stability AI Materials  or Derivative Works thereof for any Research & Non-Commercial or Commerci\
al purpose. Capitalized terms not otherwise defined herein are defined in Section V below.


This Agreement is intended to allow research, non-commercial, and limited commercial uses of the Models free of charge. \
In order to ensure that certain limited commercial uses of the Models continue to be allowed, this Agreement  preserves \
free access to the Models for people or organizations  generating annual revenue of less than US $1,000,000 (or local cu\
rrency equivalent).  


By clicking "I Accept"  or by using or distributing or using any portion or element of the Stability Materials or Deriva\
tive Works, You agree that You have read, understood and are bound by the terms of this Agreement. If You are acting on \
behalf of a company, organization or other entity, then "You" includes you and that entity, and You agree that You: (i) \
are an authorized representative of such entity with the authority to bind such entity to this Agreement, and (ii) You a\
gree to the terms of this Agreement on that entity's behalf. 

II. RESEARCH & NON-COMMERCIAL USE LICENSE

Subject to the terms of this Agreement, Stability AI grants You a non-exclusive, worldwide, non-transferable, non-sublic\
ensable, revocable and royalty-free limited license under Stability AI's intellectual property or other rights owned by \
Stability AI embodied in the Stability AI Materials to use, reproduce, distribute, and create Derivative Works of, and m\
ake modifications to, the Stability AI Materials for any Research or Non-Commercial Purpose. "Research Purpose" means ac\
ademic or scientific advancement, and in each case, is not primarily intended for commercial advantage or monetary compe\
nsation to You or others. "Non-Commercial Purpose" means any purpose other than a Research Purpose that is not primarily\
 intended for commercial advantage or monetary compensation to You or others, such as personal use (i.e., hobbyist) or e\
valuation and testing.  

III. COMMERCIAL USE LICENSE

Subject to the terms of this Agreement (including the remainder of this Section III), Stability AI grants You a non-excl\
usive, worldwide, non-transferable, non-sublicensable, revocable and royalty-free limited license under Stability AI's i\
ntellectual property or other rights owned by Stability AI embodied in the Stability AI Materials to use, reproduce, dis\
tribute, and create Derivative Works of, and make modifications to, the Stability AI Materials for any Commercial Purpos\
e. "Commercial Purpose" means any purpose other than a Research Purpose or Non-Commercial Purpose that is primarily inte\
nded for commercial advantage or monetary compensation to You or others, including but not limited to, (i) creating, mod\
ifying, or distributing Your product or service, including via a hosted service or application programming interface, an\
d (ii) for Your business's or organization's internal operations. 
If You are using or distributing the Stability AI Materials for a Commercial Purpose, You must register with Stability A\
I at (https://stability.ai/community-license). If at any time You or Your Affiliate(s), either individually or in aggreg\
ate, generate more than USD $1,000,000 in annual revenue (or the equivalent thereof in Your local currency), regardless \
of whether that revenue is generated directly or indirectly from the Stability AI Materials or Derivative Works, any lic\
enses granted to You under this Agreement shall terminate as of such date. You must request a license from Stability AI \
at (https://stability.ai/enterprise) , which Stability AI may grant to You in its sole discretion. If you receive Stabil\
ity AI Materials, or any Derivative Works thereof, from a Licensee as part of an integrated end user product, then Secti\
on III of this Agreement will not apply to you.

IV. GENERAL TERMS

Your Research, Non-Commercial, and Commercial License(s) under this Agreement are subject to the following terms.
a.  Distribution & Attribution. If You distribute or make available the Stability AI Materials or a Derivative Work to a\
 third party, or a product or service that uses any portion of them, You shall: (i) provide a copy of this Agreement to \
that third party, (ii) retain the following attribution notice within a "Notice" text file distributed as a part of such\
 copies: "This Stability AI Model is licensed under the Stability AI Community License, Copyright ©  Stability AI Ltd. A\
ll Rights Reserved", and (iii) prominently display "Powered by Stability AI" on a related website, user interface, blogp\
ost, about page, or product documentation.  If You create a Derivative Work, You may add your own attribution notice(s) \
to the "Notice" text file included with that Derivative Work, provided that You clearly indicate which attributions appl\
y to the Stability AI Materials and state in the "Notice" text file that You changed the Stability AI Materials and how \
it was modified.
b.  Use Restrictions. Your use of the Stability AI Materials and Derivative Works, including any output or results of th\
e Stability AI Materials or Derivative Works, must comply with applicable laws and regulations (including Trade Control \
Laws and equivalent regulations) and adhere to the Documentation and Stability AI's AUP, which is hereby incorporated by\
 reference. Furthermore, You will not use the Stability AI Materials or Derivative Works, or any output or results of th\
e Stability AI Materials or Derivative Works, to create or improve any foundational generative AI model (excluding the M\
odels or Derivative Works). 
c.  Intellectual Property. 
(i) Trademark License.  No trademark licenses are granted under this Agreement, and in connection with the Stability AI \
Materials or Derivative Works, You may not use any name or mark owned by or associated with Stability AI or any of its A\
ffiliates, except as required under Section IV(a) herein.
(ii)  Ownership of Derivative Works.  As between You and Stability AI, You are the owner of Derivative Works You create,\
 subject to Stability AI's ownership of the Stability AI Materials and any Derivative Works made by or for Stability AI.\

(iii)  Ownership of Outputs. As between You and Stability AI, You own any outputs generated from the Models or Derivativ\
e Works to the extent permitted by applicable law. 
(iv)  Disputes.  If You or Your Affiliate(s) institute litigation or other proceedings against Stability AI (including a\
 cross-claim or counterclaim in a lawsuit) alleging that the Stability AI Materials, Derivative Works or associated outp\
uts or results, or any portion of any of the foregoing, constitutes infringement of intellectual property or other right\
s owned or licensable by You, then any licenses granted to You under this Agreement shall terminate as of the date such \
litigation or claim is filed or instituted. You will indemnify and hold harmless Stability AI from and against any claim\
 by any third party arising out of or related to Your use or distribution of the Stability AI Materials or Derivative Wo\
rks in violation of this Agreement.
(v)  Feedback.  From time to time, You may provide Stability AI with verbal and/or written suggestions, comments or othe\
r feedback related to Stability AI's existing or prospective technology, products or services (collectively, "Feedback")\
. You are not obligated to provide Stability AI with Feedback, but to the extent that You do, You hereby grant Stability\
 AI a perpetual, irrevocable, royalty-free, fully-paid, sub-licensable, transferable, non-exclusive, worldwide right and\
 license to exploit the Feedback in any manner without restriction. Your Feedback is provided "AS IS" and You make no wa\
rranties whatsoever about any Feedback.
d.  Disclaimer Of Warranty. UNLESS REQUIRED BY APPLICABLE LAW, THE STABILITY AI MATERIALS AND ANY OUTPUT AND RESULTS THE\
REFROM ARE PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT L\
IMITATION, ANY WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE. YOU ARE SOLE\
LY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OR LAWFULNESS OF USING OR REDISTRIBUTING THE STABILITY AI MATERIALS, \
DERIVATIVE WORKS OR ANY OUTPUT OR RESULTS AND ASSUME ANY RISKS ASSOCIATED WITH YOUR USE OF THE STABILITY AI MATERIALS, D\
ERIVATIVE WORKS AND ANY OUTPUT AND RESULTS.
e.  Limitation Of Liability. IN NO EVENT WILL STABILITY AI OR ITS AFFILIATES BE LIABLE UNDER ANY THEORY OF LIABILITY, WH\
ETHER IN CONTRACT, TORT, NEGLIGENCE, PRODUCTS LIABILITY, OR OTHERWISE, ARISING OUT OF THIS AGREEMENT, FOR ANY LOST PROFI\
TS OR ANY DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF STABILITY AI OR I\
TS AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF ANY OF THE FOREGOING.
f.  Term And Termination. The term of this Agreement will commence upon Your acceptance of this Agreement or access to t\
he Stability AI Materials and will continue in full force and effect until terminated in accordance with the terms and c\
onditions herein. Stability AI may terminate this Agreement if You are in breach of any term or condition of this Agreem\
ent. Upon termination of this Agreement, You shall delete and cease use of any Stability AI Materials or Derivative Work\
s. Section IV(d), (e), and (g) shall survive the termination of this Agreement.
g.  Governing Law.  This Agreement will be governed by and constructed in accordance with the laws of the United States \
and the State of California without regard to choice of law principles, and the UN Convention on Contracts for Internati\
onal Sale of Goods does not apply to this Agreement.

V. DEFINITIONS 

"Affiliate(s)" means any entity that directly or indirectly controls, is controlled by, or is under common control with \
the subject entity; for purposes of this definition, "control" means direct or indirect ownership or control of more tha\
n 50% of the voting interests of the subject entity.
"Agreement" means this Stability AI Community License Agreement.
"AUP" means the Stability AI Acceptable Use Policy available at https://stability.ai/use-policy, as may be updated from \
time to time.
"Derivative Work(s)" means (a) any derivative work of the Stability AI Materials as recognized by U.S. copyright laws an\
d (b) any modifications to a Model, and any other model created which is based on or derived from the Model or the Model\
's output, including"fine tune" and "low-rank adaptation" models derived from a Model or a Model's output, but do not in\
clude the output of any Model.
"Documentation" means any specifications, manuals, documentation, and other written information provided by Stability AI\
 related to the Software or Models.
"Model(s)" means, collectively, Stability AI's proprietary models and algorithms, including machine-learning models, tra\
ined model weights and other elements of the foregoing listed on Stability's Core Models Webpage available at, https://s\
tability.ai/core-models, as may be updated from time to time.
"Stability AI" or "we" means Stability AI Ltd. and its Affiliates.
"Software" means Stability AI's proprietary software made available under this Agreement now or in the future.
"Stability AI Materials" means, collectively, Stability's proprietary Models, Software and Documentation (and any portio\
n or combination thereof) made available under this Agreement. 
"Trade Control Laws" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations.`},Te={
id:"stable-fast-3d-webgpu",name:"Stable Fast 3D · textured meshes (WebGPU)",description:"Image to textured 3D meshes, U\
Vs and material estimates. Powered by Stability AI. FP16 stored weights execute FP32 GPU math. Static geometry; no riggi\
ng or animation.",repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"\
SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",status:"tested",model:{runtime:"webgpu-sf3d",runtimeVersion:"0.1.\
60",task:"image-to-3d",format:"SF3D",pipeline:"sf3d",architecture:"sf3d",dtype:"fp16",computeDtype:"fp32",modalities:["i\
mage"],outputModalities:["mesh"],requiredFeatures:[],repository:"BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0\
abe77443b97d8684da1ea36bc4af7",kernelRevision:"86b7b68109434ffc33218f5fb697c7057c2518f9",imageSize:512,textureSize:1024,
foregroundRatio:.85,backgroundRemoval:"u2netp"},capabilities:{pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"tested",executionReason:"Tested in a managed browser worker on NVIDIA 16 GiB: opaque/cutout images, rep\
eated local and encrypted peer generation, cancellation, retained reload and browser restart. CubeChat textured props an\
d avatars verified. Static meshes; no shader-f16 requirement. Other devices are unqualified.",import:!0},provenance:{repository:"\
BasinShapers/sf3d-webgpu-weights",revision:"53cfd8926e0abe77443b97d8684da1ea36bc4af7",format:"SF3D",metadataCheckedAt:"2\
026-11-11",originalModel:"stabilityai/stable-fast-3d",modelCardUrl:"https://huggingface.co/BasinShapers/sf3d-webgpu-weig\
hts/blob/53cfd8926e0abe77443b97d8684da1ea36bc4af7/README.md",kernelRepository:"https://github.com/lyonsno/sf3d-webgpu",kernelRevision:"\
86b7b68109434ffc33218f5fb697c7057c2518f9",gridRepository:"needle-tools/SF3D-webgpu",gridRevision:"56d2f58d27395b0be9c633\
671b439b4aac482549"}};Te.files=[...ii,...Ne];Te.totalBytes=Te.files.reduce((e,t)=>e+t.size,0);Te.weightBytes=ii[0].size+
Ne[0].size;Te.license={spdx:"LicenseRef-Stability-AI-Community AND Apache-2.0",sourceUrl:an.sourceUrl,notice:"Powered by\
 Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.",components:[
{...an,derivativeNotice:`This Stability AI Model is licensed under the Stability AI Community License, Copyright © Stabi\
lity AI Ltd. All Rights Reserved

Powered by Stability AI.

Stable Fast 3D originates with Stability AI. The WebGPU port is from
lyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.

PeerCompute changed the port's asset loading, worker ownership, raw-image and
texture encoding interfaces, cancellation checks, and allocation cleanup.
The authored bounded artifact adapter streams the same checkpoint tensors and
retains the original WGSL kernels. The model weights themselves are unchanged.
See README.md for the exact integration changes and LICENSE.md for the license.
`},sr,ni,{spdx:"MIT AND BSD-3-Clause",sourceUrl:"https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60",notice:`\
MIT License

Copyright (c) 2026 Noah Lyons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Third-Party Notices

The MIT license covers the Kaminos implementation in this package.
Third-party components retain their own terms. Model weights and separately
loaded assets are not licensed by this package's MIT license.

The split4 linear shader in src/linear-kernel.js is adapted from WebGPU
Samples' visionTransformer mlp.wgsl. Its BSD-3-Clause terms follow. This notice
also accompanies standalone model bundles that include the Kit shader.

WebGPU Samples
https://github.com/webgpu/webgpu-samples
License: BSD-3-Clause
Source: https://github.com/webgpu/webgpu-samples/blob/main/LICENSE.txt

Copyright 2019 WebGPU Samples Contributors

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

   3. Neither the name of the copyright holder nor the names of its
      contributors may be used to endorse or promote products derived from this
      software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
`}]};function oi(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(oi),Object.freeze(e)),e}
const Df=oi({[Te.id]:Te});function Ct(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Ct),
Object.freeze(e)),e}const si=Ct({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"\
cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"tri\
posr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21f\
b8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a\
239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d\
2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d\
6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d3\
3985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239\
fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864a\
d58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"R\
EADME.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa83035902\
4f6a2f1c78871/LICENSE",notice:`MIT License

Copyright (c) 2024 Tripo AI & Stability AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",
executionReason:"Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted \
inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CI\
D; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static object\
s only; no rigging or animation.",executionEvidence:{checkedAt:"2026-11-11",scope:"local managed worker, encrypted v5 pe\
er inference, and two CubeChat pages",gpuArchitecture:"NVIDIA Blackwell",shaderF16Required:!1,fixture:"TripoSR MIT chair\
.png",meshSha256:"778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",meshBytes:590056,triangles:4908,gpuDispatches:1207,
cancellationRecovery:!0,retainedRestart:!0,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",peerCancellationRecovery:!0,
peerOutputMatchesLocal:!0,cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}},
provenance:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",metadataCheckedAt:"\
2026-11-11",modelCardUrl:"https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/R\
EADME.md"},model:{runtime:"onnx-mesh",runtimeVersion:"1.31.1",task:"image-to-3d",format:"ONNX",pipeline:"triposr",architecture:"\
triposr",dtype:"q8",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"cgb/triposr-onnx-webg\
pu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",resolution:64,densityThreshold:25,radius:.87,imageSize:512,foregroundRatio:.85},
weightBytes:484845236,totalBytes:484848869}}),Ou=Ct(Object.values(si)),le=si["triposr-q8-onnx"],Ru=Ct({"triposr-q8-onnx":{
...le,model:{...le.model,backgroundRemoval:"u2netp"},files:[...le.files,...Ne],weightBytes:le.weightBytes+Ne[0].size,totalBytes:le.
totalBytes+Ne.reduce((e,t)=>e+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:le.license.sourceUrl,notice:"TripoS\
R © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full o\
riginal license texts are retained in this package.",components:[le.license,sr,ni]},provenance:{...le.provenance,foreground:{
repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielga\
tis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5\
b6ad64ba6578eba63f1ae07720c/README.md",sha256:Ne[0].sha256,licenseUrl:sr.sourceUrl}},capabilities:{...le.capabilities,executionStatus:"\
tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShap\
er to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload res\
tored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{
checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained objec\
t reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a96\
3c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"\
/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,
unpinnedObserverCacheCollected:!0}}}},...Df}),Et=1024**3,Ae=Object.freeze({maximumBytes:8*Et,maximumFileBytes:2*Et-1,maximumConfigBytes:1024**
2,contextTokens:2048,legacyMaximumBytes:1536*1024**2}),ai=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),kf=["qwen2","\
qwen3","llama"],cn=["phi","phi3","gemma","gemma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2",
"nemotron_h"],dn=["idefics3","smolvlm","qwen3_5"],Lf=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","gemma4",
"phi3","phi2","granite","starcoder2","olmo","olmo2","stablelm","nemotron","smollm3"],ci=Object.freeze([...[...kf,...cn,...dn].
map(e=>{const t=dn.includes(e);return Object.freeze({runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:e,task:t?
"image-text-to-text":"text-generation",qualification:"candidate",modalities:Object.freeze(t?["text","image"]:["text"]),modules:Object.
freeze(t?["embed_tokens","vision_encoder","decoder_model_merged"]:["model"]),dtypes:e==="qwen3_5"?Object.freeze(["q4"]):
ai,requiresMemoryProfile:cn.includes(e),contextTokens:2048,maximumBytes:t?e==="qwen3_5"?2*Et:Ae.legacyMaximumBytes:Ae.maximumBytes,
maximumFileBytes:Ae.maximumFileBytes})}),...Lf.map(e=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,
modelArchitecture:e==="qwen35"?"qwen3_5":e,task:"text-generation",modalities:Object.freeze(["text"]),qualification:"cand\
idate"}))]);function Er(e,t){return ci.find(r=>r.runtime===e&&r.architecture===t)??null}function Nu(e){return ci.filter(
t=>t.runtime===e)}function Pf(e){const t=typeof e=="string"?[e]:e&&typeof e=="object"&&!Array.isArray(e)?Object.values(e):
[];if(!t.length||t.length>16||t.some(r=>!ai.includes(r)))throw new Error("Unsupported ONNX precision");return t}function di(e){
const t=(e==null?void 0:e["transformers.js_config"])??{},r=t.device_config??{};return Object.hasOwn(r,"webgpu")?{...t,...r.
webgpu}:{...t}}function zf(e,t={}){const r=Pf(e),n=di(t).kv_cache_dtype;return r.some(o=>["fp16","q4f16"].includes(o)||(typeof n==
"string"?n:n==null?void 0:n[o])==="float16")?["shader-f16"]:[]}function Z(e,t,r=1048576,n=1){if(!Number.isSafeInteger(e)||
e<n||e>r)throw new Error(`Invalid model memory dimension: ${t}`);return e}function Ff(e){const t=di(e).free_dimension_overrides;
if(t&&(typeof t!="object"||Array.isArray(t)||Object.keys(t).length))throw new Error("Dynamic ONNX free_dimension_overrid\
es are not admitted by this memory profile");const r=e==null?void 0:e.model_type,n=Er("transformers.js",r);if(!n)throw new Error(
"Unsupported model memory architecture");const i=n.task==="image-text-to-text"?e.text_config??e:e,o=i.layer_types??i.layers_block_type,
s=Z(i.num_hidden_layers??(o==null?void 0:o.length),"layers",512),a=Z(i.hidden_size,"hidden size",65536),d=Z(i.num_attention_heads,
"attention heads",1024),l=Z(i.num_key_value_heads??d,"KV heads",1024),b=Z(i.head_dim??a/d,"head dimension",4096),g=Z(i.vocab_size??
e.vocab_size,"vocabulary");if(o!==void 0&&(!Array.isArray(o)||o.length!==s||o.some(C=>!["attention","mamba","mlp","moe",
"full_attention","sliding_attention","linear_attention"].includes(C))))throw new Error("Invalid model memory layer types");
let f=s,y=0,p=0,S=0,m=0,c=0,u=0;if(r==="nemotron_h"){if(!o)throw new Error("Nemotron requires explicit recurrent layer t\
ypes");if(f=o.filter(w=>w==="attention").length,y=o.filter(w=>w==="mamba").length,o.some(w=>!["attention","mamba","mlp",
"moe"].includes(w)))throw new Error("Unsupported Nemotron layer type");m=Z(i.mamba_num_heads,"SSM heads",1024),c=Z(i.mamba_head_dim,
"SSM head dimension",4096),u=Z(i.ssm_state_size,"SSM state size",4096);const C=Z(i.n_groups,"SSM groups",1024);S=Z(i.conv_kernel,
"convolution kernel",256),p=Z(m*c+2*C*u,"convolution channels")}return Ot({schema:"peercompute.onnx.memory.v1",architecture:r,
layers:s,hiddenSize:a,heads:d,kvHeads:l,headDim:b,vocabulary:g,attentionLayers:f,recurrentLayers:y,convChannels:p,convKernel:S,
ssmHeads:m,ssmHeadDim:c,stateSize:u})}function Ot(e){const t=["schema","architecture","layers","hiddenSize","heads","kvH\
eads","headDim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","st\
ateSize"];if(!e||e.schema!=="peercompute.onnx.memory.v1"||!Er("transformers.js",e.architecture)||Object.keys(e).some(n=>!t.
includes(n)))throw new Error("Invalid model memory profile");for(const n of t.slice(2))Z(e[n],n,1048576,["attentionLayer\
s","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(e.layers>512||
e.attentionLayers+e.recurrentLayers>e.layers||e.kvHeads>e.heads||e.architecture!=="nemotron_h"&&e.recurrentLayers)throw new Error(
"Invalid model memory layer geometry");const r=2*(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*
e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*Et)throw new Error("Model cac\
he/state exceeds its bounded memory envelope");return Object.fromEntries(t.map(n=>[n,e[n]]))}function Gf(e){const t=Ot(e);
return 2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*t.ssmHeadDim*t.stateSize+t.convChannels*
t.convKernel)*4)}function fi(e,t){if((t==null?void 0:t.model_type)!==e.architecture)throw new Error("Model config archit\
ecture does not match its admitted manifest");if(t.auto_map&&Object.keys(t.auto_map).length)throw new Error("Custom mode\
l code is not admitted");if(e.memoryProfile&&JSON.stringify(Ot(e.memoryProfile))!==JSON.stringify(Ff(t)))throw new Error(
"Model memory profile differs from its verified config");return zf(e.dtype,t)}const fn="transformers.js",ui="4.3.2",P=Object.
freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:Ae.maximumBytes,maxFileBytes:Ae.maximumFileBytes,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),$f=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:P.maxFileBytes,
minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),li=Object.freeze({maxModelBytes:P.
maxModelBytes,maxFileBytes:P.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:P.maxImagePixels}),
jf=Object.freeze({...li,maxModelBytes:Ae.legacyMaximumBytes});function hi(e,{files:t,totalBytes:r,config:n}={}){const i=(e==
null?void 0:e.architecture)==="qwen3_5"?$f:["idefics3","smolvlm"].includes(e==null?void 0:e.architecture)?jf:li;if(n&&fi(
e,n),t){r=0;for(const l of t){if(!Number.isSafeInteger(l.size)||l.size<0)throw new Error("Invalid model file size");if(l.
size>P.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONNX file must be sm\
aller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=l.size}}if(r!==void 0&&(!Number.isSafeInteger(r)||r<0||r>i.maxModelBytes))
throw Object.assign(new Error(`Model exceeds its admitted file budget of ${i.maxModelBytes/1024**3} GiB`),{code:"ERR_MOD\
EL_PACKAGE_TOO_LARGE"});const o=(e==null?void 0:e.memoryProfile)&&Ot(e.memoryProfile);if(o&&o.architecture!==e.architecture)
throw new Error("Model memory architecture mismatch");if(!o&&!(r>Ae.legacyMaximumBytes))return i;const s=r??0,a=o?Gf(o):
0,d=1024**3;return{...i,minimumCpuBytes:Math.max(i.minimumCpuBytes,2*s+2*d+a),minimumGpuBytes:Math.max(i.minimumGpuBytes,
2*s+d+a),cacheBytes:a}}function ar(e="Operation cancelled"){return(e==null?void 0:e.name)==="AbortError"?e:new DOMException(
typeof e=="string"?e:"Operation cancelled","AbortError")}function V(e){if(e!=null&&e.aborted)throw ar(e.reason)}function et(e){
if(typeof e!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(e))throw new Error("Invalid model session ID");return e}function vt(e){
if(typeof e!="string"||!e||new TextEncoder().encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(e)||e.startsWith("\
/")||e.split("/").some(t=>!t||t==="."||t===".."))throw new Error("Invalid model artifact path");return e}function qf(e){
var g;let t;try{t=JSON.stringify(e)}catch{throw new Error("Invalid model manifest")}if(!t||new TextEncoder().encode(t).length>
P.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(t);if(((g=r.model)==
null?void 0:g.composition)!==void 0)throw new Error("This ONNX runtime does not support model adapters");if(r.schema!=="\
peercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>P.maxFiles)throw new Error("\
Invalid model manifest files");const n=new Set,i=hi(r.model,{files:r.files});let o=0;for(const f of r.files){if(vt(f.path),
n.has(f.path))throw new Error("Duplicate model artifact path");n.add(f.path);const y=G.parse(f.cid);if(![85,112].includes(
y.code)||y.multihash.code!==18||y.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(
f.size)||f.size<0||!/^[a-f0-9]{64}$/i.test(f.sha256??""))throw new Error("Invalid model file size/digest");if(f.sha256=f.
sha256.toLowerCase(),o+=f.size,!Number.isSafeInteger(o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted f\
ile budget")}const s=r.model,a=Er(fn,s==null?void 0:s.architecture);if((s==null?void 0:s.runtime)!==fn||s.runtimeVersion!==
ui||!a)throw new Error("Model runtime, architecture or dtype is not approved");if(s.task??(s.task=a.task),s.task!==a.task)
throw new Error("Model task does not match its admitted architecture");if((a.requiresMemoryProfile||a.task==="text-gener\
ation"&&o>Ae.legacyMaximumBytes)&&!s.memoryProfile)throw new Error("This model requires a verified config memory profile");
const d=typeof s.dtype=="string"?[["model",s.dtype]]:s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(
s.dtype):[];if(!d.length||d.length>16||d.some(([f,y])=>!/^[A-Za-z0-9_-]{1,100}$/.test(f)||!["fp32","fp16","q4","q4f16","\
q8"].includes(y)))throw new Error("Invalid model dtype configuration");if(s.architecture==="qwen3_5"&&d.some(([,f])=>f!==
"q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=f=>f==="fp32"?"":f==="q8"?"_quantized":`_${f}`,
b=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&b.
push(...d.map(([f,y])=>`onnx/${f}${l(y)}.onnx`)),s.task==="image-text-to-text")for(const f of["embed_tokens","vision_enc\
oder","decoder_model_merged"]){const y=typeof s.dtype=="string"?s.dtype:s.dtype[f];if(!y)throw new Error("Multimodal dty\
pe configuration is missing a module");b.push(`onnx/${f}${l(y)}.onnx`),s.architecture==="qwen3_5"&&b.push(`onnx/${f}${l(
y)}.onnx_data`)}if(b.some(f=>!n.has(f)))throw new Error("Incomplete model package");if(s.task==="image-text-to-text"&&!n.
has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor configuration is \
missing");if(s.requiredFeatures!==void 0&&(!Array.isArray(s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.
some(f=>typeof f!="string"||f.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}
function Wf(e,t){const r=new URL(t),n={};for(const i of["mjs","wasm"]){if(typeof(e==null?void 0:e[i])!="string")throw new Error(
"Trusted ORT runtime assets are required");const o=new URL(e[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||
!["http:","https:"].includes(o.protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved sam\
e-origin runtime files");n[i]=o.href}return n}const Hf="peercompute.model-artifact-read.v1",vr=Hf;function pi(e,t){var n;
const r=i=>t(i.data);return e.addEventListener("message",r),(n=e.start)==null||n.call(e),()=>e.removeEventListener("mess\
age",r)}function te(e,t,r=[]){e.postMessage({protocol:vr,...t},r)}function _u(e,{store:t,manifest:r,chunkBytes:n=P.chunkBytes,
maxReads:i=P.maxReads}={}){if(!(t!=null&&t.stat)||!(t!=null&&t.openRead))throw new Error("A verified artifact store is r\
equired");if(!Number.isInteger(n)||n<1||n>P.chunkBytes||!Number.isInteger(i)||i<1||i>P.maxReads)throw new Error("Invalid\
 artifact bridge bounds");const o=new Map(r.files.map(f=>[vt(f.path),f])),s=new Map;let a=!1,d=0;async function l(f,y){var S,
m;const p=s.get(f);if(p){s.delete(f),p.controller.abort(y);try{await((m=(S=p.iterator)==null?void 0:S.return)==null?void 0:
m.call(S))}catch{}}}async function b(f){var p,S;if(a||(f==null?void 0:f.protocol)!==vr||typeof f.id!="string"||f.id.length>
128)return;const{id:y}=f;try{if(f.type==="cancel"){await l(y,"Reader cancelled");return}if(f.type==="open"){if(s.has(y))
throw new Error("Duplicate artifact reader");if(s.size>=i)throw new Error("Artifact reader limit reached");const w=o.get(
f.path);if(!w)throw new Error("Artifact path is not in the manifest");const I=f.offset??0,x=f.length??w.size-I;if(!Number.
isSafeInteger(I)||!Number.isSafeInteger(x)||I<0||x<0||I>w.size||x>w.size-I)throw new Error("Invalid artifact byte range");
const A={controller:new AbortController,remaining:x,pulling:!1};s.set(y,A);const E=await t.stat(w.cid);if(V(A.controller.
signal),a||s.get(y)!==A)return;if(!E||E.status!=="complete"||E.size!==w.size||E.sha256!==w.sha256)throw new Error("Model\
 artifact is incomplete or has a different size");const R=await t.openRead(w.cid,{offset:I,length:x,signal:A.controller.
signal});if(A.iterator=R[Symbol.asyncIterator](),a||A.controller.signal.aborted||s.get(y)!==A){await((S=(p=A.iterator).return)==
null?void 0:S.call(p));return}te(e,{type:"ready",id:y,size:x});return}if(f.type!=="pull")return;const m=s.get(y);if(!(m!=
null&&m.iterator)||m.pulling)throw new Error("Invalid artifact pull credit");m.pulling=!0;const c=await m.iterator.next();
if(a||m.controller.signal.aborted||s.get(y)!==m)return;if(c.done){if(m.remaining!==0)throw new Error("Truncated model ar\
tifact");s.delete(y),te(e,{type:"end",id:y});return}const u=c.value;if(!(u instanceof Uint8Array)||!u.byteLength||u.byteLength>
n||u.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bounds");m.remaining-=u.byteLength,m.pulling=
!1,d+=u.byteLength;const C=u.slice();te(e,{type:"chunk",id:y,bytes:C},[C.buffer])}catch(m){await l(y,m),a||te(e,{type:"e\
rror",id:y,message:(m==null?void 0:m.message)||"Artifact read failed"})}}const g=pi(e,f=>{b(f)});return{getStats:()=>({activeReads:s.
size,deliveredBytes:d}),async close(){if(!a){a=!0;try{te(e,{type:"closed",message:"Artifact bridge closed"})}catch{}g(),
await Promise.all([...s.keys()].map(f=>l(f,"Artifact bridge closed"))),e.close()}}}}function Vf(e,{manifest:t,baseUrl:r,
signal:n,chunkBytes:i=P.chunkBytes,maxReads:o=P.maxReads,maxQueuedReads:s=32}={}){if(!Number.isInteger(o)||o<1||o>P.maxReads||
!Number.isInteger(s)||s<0||s>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),d=new Map(t.files.
map(c=>[vt(c.path),c])),l=new Map,b=[];let g=0,f=!1;function y(){for(;!f&&l.size<o&&b.length;){const c=b.shift();l.set(c.
id,c),c.active=!0,te(e,{type:"open",id:c.id,path:c.path})}}function p(c,u){var w,I,x,A;l.delete(c.id);const C=b.indexOf(
c);if(C>=0&&b.splice(C,1),n==null||n.removeEventListener("abort",c.abort),(w=c.requestSignal)==null||w.removeEventListener(
"abort",c.abort),u){(I=c.reject)==null||I.call(c,u);try{(x=c.streamController)==null||x.error(u)}catch{}}(A=c.resolvePull)==
null||A.call(c),y()}const S=pi(e,c=>{if((c==null?void 0:c.protocol)!==vr)return;const u=l.get(c.id);if(u){if(c.type==="e\
rror"){p(u,new Error(c.message));return}if(c.type==="ready"){if(u.ready||c.size!==u.file.size){p(u,new Error("Invalid ar\
tifact response size")),te(e,{type:"cancel",id:u.id});return}u.ready=!0,te(e,{type:"pull",id:u.id})}else if(c.type==="ch\
unk"){if(!u.ready||!u.resolvePull||!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||c.bytes.byteLength>i||u.received+
c.bytes.byteLength>u.file.size){te(e,{type:"cancel",id:u.id}),p(u,new Error("Invalid artifact chunk"));return}u.received+=
c.bytes.byteLength,u.streamController.enqueue(c.bytes);const C=u.resolvePull;u.resolvePull=null,C()}else c.type==="end"&&
(!u.ready||u.received!==u.file.size?p(u,new Error("Truncated artifact response")):(u.streamController.close(),p(u)))}});
async function m(c,u={}){if(f)throw new Error("Artifact bridge is closed");if(V(n),V(u.signal),u.method&&u.method!=="GET")
throw new Error("Model adapter supports GET only");const C=String(c);if(/[\\]/.test(C)||/%(?:2e|2f|5c|00)/i.test(C)||/\/(?:\.|\.\.)(?:\/|$)/.
test(C))throw new Error("Invalid artifact URL");const w=new URL(C,a);if(w.origin!==a.origin||w.username||w.password||w.search||
w.hash||!w.pathname.startsWith(a.pathname))throw new Error("Model path is outside its manifest");const I=vt(decodeURIComponent(
w.pathname.slice(a.pathname.length))),x=d.get(I);if(!x)return new Response("Artifact path is not in the manifest",{status:404});
const A=`read-${++g}`,E={id:A,path:I,file:x,requestSignal:u.signal,received:0,ready:!1,active:!1,queued:!1};E.abort=()=>{
var v;E.active&&te(e,{type:"cancel",id:A}),p(E,ar((n==null?void 0:n.reason)??((v=u.signal)==null?void 0:v.reason)))};const R=new ReadableStream(
{start(v){E.streamController=v},pull(){if(f)throw new Error("Artifact bridge is closed");if(V(n),V(u.signal),!E.active&&
!E.queued&&l.size>=o&&b.length>=s)throw new Error("Artifact reader limit reached");return new Promise(v=>{var N;E.resolvePull=
v,E.ready?te(e,{type:"pull",id:A}):E.queued||(E.queued=!0,n==null||n.addEventListener("abort",E.abort,{once:!0}),(N=u.signal)==
null||N.addEventListener("abort",E.abort,{once:!0}),b.push(E),y())})},cancel(){E.active&&te(e,{type:"cancel",id:A}),p(E)}},
{highWaterMark:0});return new Response(R,{headers:{"Content-Length":String(x.size),"Content-Type":x.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:m,close(c="Artifact bridge closed"){if(!f){f=!0;for(const u of[...l.values(),...b])u.active&&
te(e,{type:"cancel",id:u.id}),p(u,ar(c));S(),e.close()}}}}const Qf="4.3.2",Yf=new Set(["qwen3_5","qwen3_5_text"]),Gt=new WeakMap,
$t="_get_text_only_rope_index";function un(e,t,r){var o,s,a,d;const[n,i]=e??[];if((n==null?void 0:n.type)!=="int64"||(i==
null?void 0:i.type)!=="int64"||((o=n.dims)==null?void 0:o.length)!==3||n.dims[0]!==3||n.dims[1]!==t||n.dims[2]!==r||((s=
i.dims)==null?void 0:s.length)!==2||i.dims[0]!==t||i.dims[1]!==1||((a=n.data)==null?void 0:a.length)!==3*t*r||((d=i.data)==
null?void 0:d.length)!==t)throw new Error("Unsupported Qwen text position result");return{positions:n,deltas:i}}function Kf(e,t){
var a,d,l;if(((a=t==null?void 0:t.env)==null?void 0:a.version)!==Qf||!Yf.has((d=e==null?void 0:e.config)==null?void 0:d.
model_type))return!1;if(Gt.has(e)){if(e[$t]!==Gt.get(e))throw new Error("Qwen text position compatibility was replaced");
return!0}const r=e[$t];if(typeof r!="function"||typeof t.Tensor!="function")throw new Error("Qwen text position compatib\
ility is unavailable");const n=new t.Tensor("int64",[10n,11n],[1,2]),i=new t.Tensor("int64",[1n,1n],[1,2]);let o;try{o=r.
call(e,n,i);const{positions:b,deltas:g}=un(o,1,2);if([...b.data].some((f,y)=>f!==BigInt(y%2)))throw new Error("Unsupport\
ed Qwen text position calculation");if(g.data[0]===0n)return!1;if(g.data[0]!==4n)throw new Error("Unsupported Qwen text \
position offset")}finally{for(const b of new Set([n,i,...Array.isArray(o)?o:[]]))(l=b==null?void 0:b.dispose)==null||l.call(
b)}function s(b,g){var y,p;const f=r.call(this,b,g);if(!g)return f;try{const[S,m]=g.dims??[];if(((y=g.dims)==null?void 0:
y.length)!==2||!Number.isSafeInteger(S)||S<1||!Number.isSafeInteger(m)||m<1)throw new Error("Invalid Qwen text position \
dimensions");const{positions:c,deltas:u}=un(f,S,m);for(let w=0;w<S;w++){let I=c.data[w*m];for(let x=1;x<m;x++){const A=c.
data[w*m+x];A>I&&(I=A)}if(u.data[w]!==I+1n+BigInt(m))throw new Error("Qwen text position behavior changed")}const C=2n*BigInt(
m);for(let w=0;w<S;w++)u.data[w]-=C;return f}catch(S){for(const m of new Set(Array.isArray(f)?f:[]))(p=m==null?void 0:m.
dispose)==null||p.call(m);throw S}}return Object.defineProperty(e,$t,{value:s,configurable:!0,writable:!0}),Gt.set(e,s),
!0}const ct=e=>new TextEncoder().encode(e).byteLength;function Xf(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function bi(e){if(e==null)return null;
if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>P.maxImagePixels||
e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*
4||e.data.byteLength>P.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fil\
es are not accepted");return e}function mi(e){const t=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:
null);if(!Array.isArray(t)||!t.length||t.length>P.maxMessages)throw new Error("Invalid inference messages");let r=0;return t.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=ct(n.content),r>P.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function gi(e){var n;if(!e)return;let t;const r=new Set;for(const i of[e.model,e.
processor,e.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.dispose)==null?void 0:n.call(i))}catch(o){t??(t=o)}}if(t)
throw t}function cr(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();
return}for(const r of Object.values(e))cr(r,t)}}function Jf(e){const t=e.findIndex(n=>n.role==="user");if(t<0)return null;
const r=e.findIndex((n,i)=>i>t&&n.role==="user");return r<0||!e.some((n,i)=>i>t&&i<r&&n.role==="assistant")?null:e.filter(
(n,i)=>i<t||i>=r||n.role==="system")}function Zf(e,t,r){const n={...e.config};for(const a of["decoder","generator","text\
_config"])Object.assign(n,n[a]);Object.assign(n,e.generation_config);const i=Array.isArray(n.eos_token_id)?n.eos_token_id:
[n.eos_token_id],o=t.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===
BigInt(o))?"stop":t.length>=r?"length":"unknown"}function ie(e,t,r){const n=e==="out-of-memory"?"GPU out of memory. Clos\
e GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String((t==null?void 0:t.message)??t??"op\
eration failed").slice(0,240)}`,i=new Error(`Model session lost: ${r} ${n}`,{cause:t});return i.code=e==="out-of-memory"?
"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",i}function eu(e){let t,r,n=!1;const i=a=>{var d;n||(e.lost=!0,(!e.gpuFailure||
a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=a),(d=e.active)==null||d.abort(a))},o=({error:a})=>{var d;return i(
ie(((d=a==null?void 0:a.constructor)==null?void 0:d.name)==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",a,(r==
null?void 0:r.stage)??"resident model"))},s=()=>{if(!(!r||r.device)){r.device=t;for(const a of["validation","out-of-memo\
ry","internal"])t.pushErrorScope(a),r.filters.push(a)}};return{attach(a){var d,l;if(t&&t!==a)throw ie("device changed",null,
"load");if(!t){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!="function"||typeof((d=a.queue)==null?
void 0:d.onSubmittedWorkDone)!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!="functio\
n"||typeof a.destroy!="function"||typeof((l=a.lost)==null?void 0:l.then)!="function")throw ie("device unavailable",null,
"load");t=a,e.runtimeDevice=t,t.addEventListener("uncapturederror",o),t.lost.then(b=>i(ie("device lost",b,(r==null?void 0:
r.stage)??"resident model")),b=>i(ie("device lost",b,(r==null?void 0:r.stage)??"resident model")))}try{s()}catch(b){const g=ie(
"error scope failure",b,(r==null?void 0:r.stage)??"load");throw i(g),g}},async run(a,d){if(e.lost)throw e.gpuFailure??ie(
"device lost",null,a);if(r)throw new Error("Overlapping model GPU operations are not allowed");const l={stage:a,filters:[],
device:null};r=l;let b,g;try{if(t&&this.attach(t),b=await d(),!t)throw ie("device unavailable",null,a)}catch(p){g=p}if(t)
try{await t.queue.onSubmittedWorkDone()}catch(p){i(ie("queue failure",p,a))}const f=await Promise.all(l.filters.reverse().
map(async p=>{try{return{filter:p,error:await l.device.popErrorScope()}}catch(S){return{filter:p,error:S,scopeFailed:!0}}}));
r=null;for(const p of f)p.scopeFailed&&i(ie("error scope failure",p.error,a));const y=["out-of-memory","internal","valid\
ation"].map(p=>f.find(S=>S.filter===p&&S.error&&!S.scopeFailed)).find(Boolean);if(y&&i(ie(y.filter,y.error,a)),g instanceof
WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((g==null?void 0:g.message)??"")){const p=new Error("Model \
session lost: native inference runtime failed",{cause:g});p.code="ERR_MODEL_RUNTIME",i(p)}if(typeof(g==null?void 0:g.code)==
"string"&&g.code.startsWith("ERR_MODEL_GPU")&&i(g),e.gpuFailure)throw e.gpuFailure;if(g)throw g;return b},dispose(){n=!0,
t==null||t.removeEventListener("uncapturederror",o)}}}function tu(e){var i;const t=["maxBindGroups","maxComputeWorkgroup\
StorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBuff\
erSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSi\
zeZ"],r={};for(const o of t){const s=(i=e.limits)==null?void 0:i[o];if(!Number.isSafeInteger(s)||s<=0)throw new Error(`W\
ebGPU adapter has an invalid ${o} limit`);r[o]=s}const n=["chromium-experimental-subgroup-matrix","timestamp-query","sha\
der-f16","subgroups","subgroup-size-control"].filter(o=>e.features.has(o));return{requiredLimits:r,requiredFeatures:n}}async function ln(e){
var t,r,n;await gi(e.components),(t=e.restoreGpuEvidence)==null||t.call(e),(r=e.gpuGuard)==null||r.dispose(),(n=e.ownedDevice)==
null||n.destroy(),e.ownedDevice=null}async function ru({library:e,modelPath:t,options:r,manifest:n,adapterFeatures:i=[]}){
const o={};try{const s=await e.AutoConfig.from_pretrained(t,r),a=fi(n.model,s);for(const l of a)if(!i.includes(l))throw new Error(
`Model config requires unsupported GPU feature: ${l}`);const d={...r,config:s};if(n.model.architecture==="qwen3_5"&&(d.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture===
"qwen3_5"){const l=o.processor.image_processor;if(!l)throw new Error("Qwen3.5 image processor is unavailable");l.min_pixels=
256*256,l.max_pixels=hi(n.model).maxProcessedImagePixels,l.do_normalize??(l.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await e.AutoModelForImageTextToText.from_pretrained(t,d)}else o.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),o.model=await e.AutoModelForCausalLM.from_pretrained(t,d);return o}catch(s){throw await gi(o),s}}function hn(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,
gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.collectGpuEvidence===!0,
runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,qwenTextRopeCompatibility:e.qwenTextRopeCompatibility===
!0}}function yi({loadLibrary:e=()=>Ii(()=>import("./transformers.web-BT_bOziL.js"),[],import.meta.url),loadModel:t=ru,
gpu:r=(o=>(o=globalThis.navigator)==null?void 0:o.gpu)(),baseUrl:n=(s=>(s=globalThis.location)==null?void 0:s.href)(),assertWorker:i=Xf}={}){
const a=new Map;let d;async function l(g,f){var u,C,w,I,x,A;if(a.size)throw new Error("This inference worker already has\
 a resident/loading model");const y=et(g.sessionId),{manifest:p}=qf(g.manifest),S=Wf(g.runtimeAssets,n);if(!((u=g.artifactPort)!=
null&&u.postMessage))throw new Error("An artifact reader port is required");V(f.signal);const m={sessionId:y,manifest:p,
manifestCid:g.manifestCid,status:"loading",workerId:f.workerId??null,generatedRequests:0,components:null};a.set(y,m);let c;
try{const E=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(V(f.signal),!E||(C=E.info)!=
null&&C.isFallbackAdapter||E.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fall\
back is disabled");const R=typeof p.model.dtype=="string"?[p.model.dtype]:Object.values(p.model.dtype),v=new Set(p.model.
requiredFeatures??[]);R.some(_=>["fp16","q4f16"].includes(_))&&v.add("shader-f16");for(const _ of v)if(!E.features.has(_))
throw new Error(`Model requires unsupported GPU feature: ${_}`);m.adapter={vendor:((w=E.info)==null?void 0:w.vendor)??"",
architecture:((I=E.info)==null?void 0:I.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...v]};const N=await(d??
(d=e()));if(V(f.signal),N.env.version!==ui)throw new Error("Unexpected Transformers runtime version");const D=new URL("/\
__peercompute_models/",n);c=Vf(g.artifactPort,{manifest:p,baseUrl:new URL(`${y}/`,D).href,signal:f.signal});const{env:z}=N;
z.logLevel=50,z.allowLocalModels=!0,z.allowRemoteModels=!1,z.localModelPath=D.pathname,z.useBrowserCache=!1,z.useFSCache=
!1,z.useWasmCache=!1,z.fetch=async(..._)=>{var B;try{return await c.fetch(..._)}catch(k){throw(B=f.emitProgress)==null||
B.call(f,{type:"artifact-read-error",sessionId:y,message:k.message}),k}},z.backends.onnx.wasm.proxy=!1,z.backends.onnx.wasm.
numThreads=1,z.backends.onnx.wasm.wasmPaths=S,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=
g.collectGpuEvidence===!0,z.backends.onnx.webgpu&&(z.backends.onnx.webgpu.profiling={mode:g.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{m.gpuProfileSamples+=1}});const T={local_files_only:!0,device:"webgpu",dtype:p.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:_=>{var B,k;(B=f.signal)!=null&&B.aborted||(k=f.emitProgress)==null||k.
call(f,{type:"model-load",sessionId:y,status:String(_.status??"").slice(0,40),file:typeof _.file=="string"?_.file.slice(
0,512):void 0,loaded:Number.isFinite(_.loaded)?_.loaded:void 0,total:Number.isFinite(_.total)?_.total:void 0})}};m.library=
N,m.gpuGuard=eu(m),await m.gpuGuard.run("load",async()=>{const _=z.backends.onnx.webgpu;if(!_)throw new Error("The WebGP\
U runtime is unavailable");_.adapter=E,m.ownedDevice=await E.requestDevice(tu(E)),m.gpuGuard.attach(m.ownedDevice),T.session_options.
executionProviders=[{name:"webgpu",device:m.ownedDevice}],m.components=await t({library:N,modelPath:y,options:T,manifest:p,
adapterFeatures:[...E.features]}),m.qwenTextRopeCompatibility=Kf(m.components.model,N);for(const B of v)if(!m.runtimeDevice.
features.has(B))throw new Error(`ORT device is missing required GPU feature: ${B}`);V(f.signal)});const O=m.runtimeDevice;
if(m.runtimeFeatures=[...(O==null?void 0:O.features)??[]],m.collectGpuEvidence&&O){const _=O.createCommandEncoder.bind(O),
B=O.queue.submit.bind(O.queue),k=Object.getOwnPropertyDescriptor(O,"createCommandEncoder"),F=Object.getOwnPropertyDescriptor(
O.queue,"submit");m.restoreGpuEvidence=()=>{k?Object.defineProperty(O,"createCommandEncoder",k):delete O.createCommandEncoder,
F?Object.defineProperty(O.queue,"submit",F):delete O.queue.submit,m.restoreGpuEvidence=null},O.createCommandEncoder=(...fe)=>{
const K=_(...fe),Se=K.beginComputePass.bind(K);return K.beginComputePass=(...ae)=>{const re=Se(...ae);for(const ce of["d\
ispatchWorkgroups","dispatchWorkgroupsIndirect"]){const ge=re[ce].bind(re);re[ce]=(...Rt)=>{const ue=ge(...Rt);return m.
gpuDispatches+=1,ue}}return re},K},O.queue.submit=(...fe)=>{const K=B(...fe);return m.gpuSubmissions+=1,K}}const U=(O==null?
void 0:O.adapterInfo)??((A=(x=z.backends.onnx.webgpu)==null?void 0:x.adapter)==null?void 0:A.info);if(U){if(U.isFallbackAdapter)
throw new Error("ORT selected a software GPU adapter");m.runtimeAdapter={vendor:U.vendor,architecture:U.architecture,isFallbackAdapter:U.
isFallbackAdapter??!1}}if(V(f.signal),m.lost)throw m.gpuFailure;return m.status="ready",hn(m)}catch(E){try{await ln(m),a.
delete(y)}catch(R){m.status="ready",m.lost=!0;const v=new Error(`MODEL_DISPOSE_FAILED: ${R.message}`);throw v.code="MODE\
L_DISPOSE_FAILED",v}throw E}finally{c==null||c.close(),c||g.artifactPort.close()}}async function b(g,f){var z,T,O,U;const y=a.
get(et(g.sessionId));if(!y||y.lost)throw new Error("Model session lost or not loaded");if(y.status!=="ready")throw new Error(
"Model session is busy");const p=et(g.requestId),S=g.maxNewTokens??P.maxNewTokens;if(!Number.isInteger(S)||S<1||S>P.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let m=mi(g);const c=bi(g.image);if(c&&y.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");V(f.signal);const u=new AbortController,C=new y.
library.InterruptableStoppingCriteria,w=()=>{var _;u.abort((_=f.signal)==null?void 0:_.reason),C.interrupt()};(z=f.signal)==
null||z.addEventListener("abort",w,{once:!0}),u.signal.addEventListener("abort",()=>C.interrupt(),{once:!0}),y.active=u,
y.requestId=p,y.status="generating";let I,x,A=0,E=0,R,v=!1;const N=y.gpuDispatches??0,D=y.gpuSubmissions??0;try{V(f.signal);
const{tokenizer:_,processor:B,model:k}=y.components;let F;for(;;){V(u.signal);let re=m;if(B&&(re=m.map(ue=>({role:ue.role,
content:[{type:"text",text:ue.content}]})),c)){const ue=re.findLast(wi=>wi.role==="user");if(!ue)throw new Error("An ima\
ge requires a user message");ue.content.unshift({type:"image"})}const ce=(B??_).apply_chat_template(re,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof ce!="string"||ct(ce)>P.maxPromptBytes)throw new Error("Templated prompt exceeds its byte \
budget");if(c){const ue=new y.library.RawImage(c.data,c.width,c.height,c.channels);I=await B(ce,ue,{do_image_splitting:!1})}else
I=await _(ce,{truncation:!1,padding:!1});if(V(u.signal),F=(O=(T=I.input_ids)==null?void 0:T.dims)==null?void 0:O.at(-1),
!Number.isSafeInteger(F)||F<1)throw new Error("Invalid model input token count");if(F+S<=P.maxContextTokens)break;const ge=Jf(
m);if(!ge)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or \
request fewer output tokens");const Rt=I;I=void 0,cr(Rt),m=ge,v=!0}V(u.signal);const fe=new y.library.TextStreamer(_,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:re=>{var ce;if(!(u.signal.aborted||R)){if(E+=ct(re),E>P.maxOutputBytes){R=new Error(
"Generated text exceeded its byte budget"),u.abort(R);return}try{if(((ce=f.emitProgress)==null?void 0:ce.call(f,{type:"t\
oken",sessionId:y.sessionId,requestId:p,sequence:A++,text:re}))===!1)throw new Error("Token consumer rejected output")}catch(ge){
R=ge,u.abort(ge)}}}});if(await y.gpuGuard.run("generation",async()=>{x=await k.generate({...I,max_new_tokens:S,do_sample:!1,
streamer:fe,stopping_criteria:[C]})}),R)throw R;if(y.lost)throw y.gpuFailure;V(u.signal);const K=x.tolist();if(K.length!==
1||K[0].length<F||K[0].length>F+S)throw new Error("Model returned an over-budget token sequence");const Se=K[0].slice(F),
ae=_.decode(Se,{skip_special_tokens:!0});if(ct(ae)>P.maxOutputBytes)throw new Error("Generated text exceeds its byte bud\
get");return y.generatedRequests+=1,{sessionId:y.sessionId,requestId:p,text:ae,inputTokens:F,outputTokens:Se.length,finishReason:Zf(
k,Se,S),contextTruncated:v,workerId:y.workerId,gpuDispatches:(y.gpuDispatches??0)-N,gpuSubmissions:(y.gpuSubmissions??0)-
D,gpuProfileSamples:y.gpuProfileSamples??0}}catch(_){throw y.gpuFailure??_}finally{(U=f.signal)==null||U.removeEventListener(
"abort",w);try{const _=new Set;let B;for(const k of[I,x])try{cr(k,_)}catch(F){B??(B=F)}if(B){y.lost=!0;const k=y.gpuFailure??
new Error("Model session lost: tensor cleanup failed",{cause:B});throw k.code??(k.code="MODEL_DISPOSE_FAILED"),y.gpuFailure=
k,k}}finally{y.active=null,y.requestId=null,y.status="ready"}}}return async function(f={},y={}){var S;if(i(),f.command===
"load")return l(f,y);if(f.command==="generate")return b(f,y);const p=a.get(et(f.sessionId));if(f.command==="status")return p?
hn(p):{sessionId:f.sessionId,status:"absent"};if(f.command==="cancel")return(p==null?void 0:p.requestId)===f.requestId&&
((S=p.active)==null||S.abort("Generation cancelled")),{sessionId:f.sessionId,cancellationRequested:!0};if(f.command==="u\
nload"){if(!p)return{sessionId:f.sessionId,status:"absent"};if(p.status!=="ready")throw new Error("Cancel and await acti\
ve model work before unloading");p.status="unloading";try{await ln(p)}catch(m){p.status="ready",p.lost=!0;const c=new Error(
`MODEL_DISPOSE_FAILED: ${m.message}`);throw c.code="MODEL_DISPOSE_FAILED",c}return a.delete(f.sessionId),{sessionId:f.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const nu=yi(),iu=(e,t)=>nu(e,t),Mu=Object.freeze(Object.
defineProperty({__proto__:null,createModelTaskRuntime:yi,handleModelTask:iu,normalizeModelMessages:mi,validateImageInput:bi},
Symbol.toStringTag,{value:"Module"})),ou=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...ou,"co\
mpute_probabilities"]);let Oe=null,pn=null;async function Uu(){if(Oe)return Oe;try{return pn=new If({frameBudgetMs:6}),Oe=
await pn.initialize(),Oe}catch(e){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",e);
const{device:t}=await Ai();return Oe=t,Oe}}export{af as A,G as C,Cu as G,Ou as L,P as M,Ae as O,Df as S,Ii as _,qf as a,et as b,bi as c,ar as d,fi as e,ff as f,Uu as g,
Ed as h,Vd as i,Iu as j,df as k,cf as l,vt as m,mi as n,Nu as o,Vf as p,wf as q,Tu as r,_u as s,V as t,Ru as u,Wf as v,Hf as w,
Mu as x};
