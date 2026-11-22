var Oi=Object.defineProperty;var Bi=(e,t,r)=>t in e?Oi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>Bi(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.
querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.
addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){
const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin===
"use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}
function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();const Ni="modulepreload",Mi=function(e,t){return new URL(
e,t).href},Br={},Ri=function(t,r,n){let i=Promise.resolve();if(r&&r.length>0){let s=function(h){return Promise.all(h.map(
g=>Promise.resolve(g).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};const a=document.getElementsByTagName(
"link"),d=document.querySelector("meta[property=csp-nonce]"),l=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute(
"nonce"));i=s(r.map(h=>{if(h=Mi(h,n),h in Br)return;Br[h]=!0;const g=h.endsWith(".css"),u=g?'[rel="stylesheet"]':"";if(!!n)
for(let v=a.length-1;v>=0;v--){const y=a[v];if(y.href===h&&(!g||y.rel==="stylesheet"))return}else if(document.querySelector(
`link[href="${h}"]${u}`))return;const b=document.createElement("link");if(b.rel=g?"stylesheet":Ni,g||(b.as="script"),b.crossOrigin=
"",b.href=h,l&&b.setAttribute("nonce",l),document.head.appendChild(b),g)return new Promise((v,y)=>{b.addEventListener("l\
oad",v),b.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${h}`)))})}))}function o(s){const a=new Event(
"vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{
for(const a of s||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};class _i{constructor(){p(this,"index",0);
p(this,"input","")}new(t){return this.index=0,this.input=t,this}readAtomically(t){const r=this.index,n=t();return n===void 0&&
(this.index=r),n}parseWith(t){const r=t();if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.
length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(t){
return this.readAtomically(()=>{const r=this.readChar();if(r===t)return r})}readSeparator(t,r,n){return this.readAtomically(
()=>{if(!(r>0&&this.readGivenChar(t)===void 0))return n()})}readNumber(t,r,n,i){return this.readAtomically(()=>{let o=0,
s=0;const a=this.peekChar();if(a===void 0)return;const d=a==="0",l=2**(8*i)-1;for(;;){const h=this.readAtomically(()=>{const g=this.
readChar();if(g===void 0)return;const u=Number.parseInt(g,t);if(!Number.isNaN(u))return u});if(h===void 0)break;if(o*=t,
o+=h,o>l||(s+=1,r!==void 0&&s>r))return}if(s!==0)return!n&&d&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{
const t=new Uint8Array(4);for(let r=0;r<t.length;r++){const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===
void 0)return;t[r]=n}return t})}readIPv6Addr(){const t=r=>{for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.
readSeparator(":",n,()=>this.readIPv4Addr());if(s!==void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}
const o=this.readSeparator(":",n,()=>this.readNumber(16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[
r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(16),[n,i]=t(r);if(n===16)return r;if(i||this.readGivenChar(
":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(14),s=16-(n+2),[a]=t(o.subarray(0,s));return r.
set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const Di=45,Ui=15,ut=new _i;
function Li(e){if(!(e.length>Ui))return ut.new(e).parseWith(()=>ut.readIPv4Addr())}function ki(e){if(e.includes("%")&&(e=
e.split("%")[0]),!(e.length>Di))return ut.new(e).parseWith(()=>ut.readIPv6Addr())}function In(e){return!!Li(e)}function zi(e){
return!!ki(e)}function vn(e=0){return new Uint8Array(e)}function Pi(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function Fi(e){if(Pi(e))return e;const t=e.slice();return new Uint8Array(t.buffer,0,t.byteLength)}function Tn(e,t){t==null&&
(t=e.reduce((i,o)=>i+o.length,0));const r=vn(t);let n=0;for(const i of e)r.set(i,n),n+=i.length;return Fi(r)}function Gi(e,t){
if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])return!1;return!0}
function He(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return Qe(e);if(e instanceof ArrayBuffer)return new Uint8Array(
e);if(ArrayBuffer.isView(e))return Qe(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type,\
 must be binary type")}function $i(e){const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}
const Nr=4096;function qi(e){const t=e.length;if(t<=Nr)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)
r+=String.fromCharCode.apply(String,e.subarray(n,n+=Nr));return r}function ji(e){return(e==null?void 0:e.buffer)instanceof
ArrayBuffer}function Qe(e){return ji(e)?e:e.slice()}function Wi(e,t,r){if(e.length>=255)throw new TypeError("Alphabet to\
o long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(
0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().
charCodeAt(0);d!==a&&(n[d]=o),l!==a&&(n[l]=o)}}var h=e.length,g=e.charAt(0),u=Math.log(h)/Math.log(256),m=Math.log(256)/
Math.log(h);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):
Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===
0)return"";for(var f=0,S=0,E=0,I=c.length;E!==I&&c[E]===0;)E++,f++;for(var T=(I-E)*m+1>>>0,A=new Uint8Array(T);E!==I;){for(var x=c[E],
R=0,w=T-1;(x!==0||R<S)&&w!==-1;w--,R++)x+=256*A[w]>>>0,A[w]=x%h>>>0,x=x/h>>>0;if(x!==0)throw new Error("Non-zero carry");
S=R,E++}for(var N=T-S;N!==T&&A[N]===0;)N++;for(var U=g.repeat(f);N<T;++N)U+=e.charAt(A[N]);return U}function v(c){if(typeof c!=
"string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;var f=0;if(c[f]!==" "){for(var S=0,
E=0;c[f]===g;)S++,f++;for(var I=(c.length-f)*u+1>>>0,T=new Uint8Array(I);c[f];){var A=n[c.charCodeAt(f)];if(A===255)return;
for(var x=0,R=I-1;(A!==0||x<E)&&R!==-1;R--,x++)A+=h*T[R]>>>0,T[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-ze\
ro carry");E=x,f++}if(c[f]!==" "){for(var w=I-E;w!==I&&T[w]===0;)w++;for(var N=new Uint8Array(S+(I-w)),U=S;w!==I;)N[U++]=
T[w++];return N}}}function y(c){var f=v(c);if(f)return f;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:v,
decode:y}}var Vi=Wi,Hi=Vi;let Qi=class{constructor(t,r,n){p(this,"name");p(this,"prefix");p(this,"baseEncode");this.name=
t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error(
"Unknown type, must be binary type")}},Yi=class{constructor(t,r,n){p(this,"name");p(this,"prefix");p(this,"baseDecode");
p(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error("Invalid pref\
ix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t=="string"){if(t.codePointAt(0)!==this.prefixCodePoint)
throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supports inputs prefixed \
with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else throw Error("Can only multibase decode st\
rings")}or(t){return Cn(this,t)}},Ki=class{constructor(t){p(this,"decoders");this.decoders=t}or(t){return Cn(this,t)}decode(t){
const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(`Unable to decode multibase string ${JSON.
stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Cn(e,t){return new Ki(
{...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let Xi=class{constructor(t,r,n,i){p(this,"name");p(this,"\
prefix");p(this,"baseEncode");p(this,"baseDecode");p(this,"encoder");p(this,"decoder");this.name=t,this.prefix=r,this.baseEncode=
n,this.baseDecode=i,this.encoder=new Qi(t,r,n),this.decoder=new Yi(t,r,i)}encode(t){return this.encoder.encode(t)}decode(t){
return this.decoder.decode(t)}};function It({name:e,prefix:t,encode:r,decode:n}){return new Xi(e,t,r,n)}function Ke({name:e,
prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Hi(r,e,n);return It({prefix:t,name:e,encode:i,decode:s=>He(
o(s))})}function Ji(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,d=0;for(let l=0;l<
i;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|h,s+=r,s>=8&&(s-=8,o[d++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Zi(e,t,r){const n=t[t.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=
t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function eo(e,t){const r={};for(let n=0;n<e.length;++n)if(r[e[n]]=
n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&(r[o]=n)}return r}function j({name:e,prefix:t,
bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=eo(n,i);return It({prefix:t,name:e,encode(s){return Zi(s,n,r)},decode(s){
return Ji(s,o,r,e)}})}const to=Ke({prefix:"9",name:"base10",alphabet:"0123456789"}),ro=Object.freeze(Object.defineProperty(
{__proto__:null,base10:to},Symbol.toStringTag,{value:"Module"})),no=j({prefix:"f",name:"base16",alphabet:"0123456789abcd\
ef",bitsPerChar:4,caseInsensitive:!0}),io=j({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
oo=Object.freeze(Object.defineProperty({__proto__:null,base16:no,base16upper:io},Symbol.toStringTag,{value:"Module"})),so=j(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),ao=Object.freeze(Object.defineProperty({__proto__:null,base2:so},
Symbol.toStringTag,{value:"Module"})),On=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
co=On.reduce((e,t,r)=>(e[r]=t,e),[]),fo=On.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${t}`);return e[n]=r,e},[]);function uo(e){return e.reduce((t,r)=>(t+=co[r],t),"")}function lo(e){const t=[];
for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=fo[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(t)}const ho=It({prefix:"🚀",name:"\
base256emoji",encode:uo,decode:lo}),po=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:ho},Symbol.toStringTag,
{value:"Module"})),_e=j({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
bo=j({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),mo=j(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),go=j({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),yo=j({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),wo=j({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Eo=j({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),xo=j({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),So=j({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Ao=Object.freeze(Object.defineProperty({__proto__:null,
base32:_e,base32hex:yo,base32hexpad:Eo,base32hexpadupper:xo,base32hexupper:wo,base32pad:mo,base32padupper:go,base32upper:bo,
base32z:So},Symbol.toStringTag,{value:"Module"})),nt=Ke({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),Io=Ke({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
vo=Object.freeze(Object.defineProperty({__proto__:null,base36:nt,base36upper:Io},Symbol.toStringTag,{value:"Module"})),pe=Ke(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),To=Ke({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Co=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:pe,base58flickr:To},Symbol.toStringTag,{value:"Module"})),Oo=j({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Bo=j({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Bn=j({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),No=j({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Mo=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Oo,base64pad:Bo,base64url:Bn,base64urlpad:No},Symbol.toStringTag,{value:"Module"})),Ro=j({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),_o=Object.freeze(Object.defineProperty({__proto__:null,base8:Ro},Symbol.
toStringTag,{value:"Module"})),Do=It({prefix:"\0",name:"identity",encode:e=>qi(He(e)),decode:e=>He($i(e))}),Uo=Object.freeze(
Object.defineProperty({__proto__:null,identity:Do},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var Lo=Nn,Mr=128,ko=-128,zo=Math.pow(2,31);function Nn(e,t,r){t=t||[],r=r||0;for(var n=r;e>=zo;)t[r++]=e&255|Mr,e/=128;for(;e&
ko;)t[r++]=e&255|Mr,e>>>=7;return t[r]=e|0,Nn.bytes=r-n+1,t}var Po=Yt,Fo=128,Rr=127;function Yt(e,n){var r=0,n=n||0,i=0,
o=n,s,a=e.length;do{if(o>=a)throw Yt.bytes=0,new RangeError("Could not decode varint");s=e[o++],r+=i<28?(s&Rr)<<i:(s&Rr)*
Math.pow(2,i),i+=7}while(s>=Fo);return Yt.bytes=o-n,r}var Go=Math.pow(2,7),$o=Math.pow(2,14),qo=Math.pow(2,21),jo=Math.pow(
2,28),Wo=Math.pow(2,35),Vo=Math.pow(2,42),Ho=Math.pow(2,49),Qo=Math.pow(2,56),Yo=Math.pow(2,63),Ko=function(e){return e<
Go?1:e<$o?2:e<qo?3:e<jo?4:e<Wo?5:e<Vo?6:e<Ho?7:e<Qo?8:e<Yo?9:10},Xo={encode:Lo,decode:Po,encodingLength:Ko},lt=Xo;function Kt(e,t=0){
const r=lt.decode(e,t),n=lt.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function ht(e,t,r=0){return lt.encode(e,t,r),t}function pt(e){return lt.
encodingLength(e)}function Jo(e,t){const r=t.byteLength,n=pt(e),i=n+pt(r),o=new Uint8Array(i+r);return ht(e,o,0),ht(r,o,
n),o.set(t,i),new mr(e,r,t,o)}function Zo(e){const t=He(e),[r,n]=Kt(t),[i,o]=Kt(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new mr(r,i,s,t)}function es(e,t){if(e===t)return!0;{const r=t;return e.code===
r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&Gi(e.bytes,r.bytes)}}let mr=class{constructor(t,r,n,i){p(this,"c\
ode");p(this,"size");p(this,"digest");p(this,"bytes");this.code=t,this.size=r,this.digest=Qe(n),this.bytes=Qe(i)}};function _r(e,t){
const{bytes:r,version:n}=e;switch(n){case 0:return ns(r,Xt(e),t??pe.encoder);default:return is(r,Xt(e),t??_e.encoder)}}const Dr=new WeakMap;
function Xt(e){const t=Dr.get(e);if(t==null){const r=new Map;return Dr.set(e,r),r}return t}var En;let ts=class H{constructor(t,r,n,i){
p(this,"code");p(this,"version");p(this,"multihash");p(this,"bytes");p(this,"/");p(this,En,"CID");this.code=r,this.version=
t,this.multihash=n,this.bytes=Qe(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
Le)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==os)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return H.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=Jo(t,
r);return H.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return H.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&es(t.multihash,n.multihash)}toString(t){return _r(this,t)}toJSON(){return{"/":_r(
this)}}link(){return this}[(En=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof H)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new H(n,i,o,s??Ur(n,i,o.bytes))}else if(r[ss]===!0){const{version:n,
multihash:i,code:o}=r,s=Zo(i);return H.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==Le)throw new Error(`Version 0 CID must use dag-pb (code: ${Le}) block encoding`);return new H(t,r,n,n.bytes)}case 1:{
const i=Ur(t,r,n.bytes);return new H(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return H.create(
0,Le,t)}static createV1(t,r){return H.create(1,t,r)}static decode(t){const[r,n]=H.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=H.inspectBytes(t),n=r.size-r.multihashSize,i=He(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new mr(r.multihashCode,r.digestSize,o,i);return[r.version===0?H.createV0(s):H.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[g,u]=Kt(t.subarray(r));return r+=u,g};let i=n(),o=Le;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),d=n(),l=r+d,h=l-s;return{version:i,
codec:o,multihashCode:a,digestSize:d,multihashSize:h,size:l}}static parse(t,r){const[n,i]=rs(t,r),o=H.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Xt(o).set(n,t),o}};function rs(e,t){
switch(e[0]){case"Q":{const r=t??pe;return[pe.prefix,r.decode(`${pe.prefix}${e}`)]}case pe.prefix:{const r=t??pe;return[
pe.prefix,r.decode(e)]}case _e.prefix:{const r=t??_e;return[_e.prefix,r.decode(e)]}case nt.prefix:{const r=t??nt;return[
nt.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function ns(e,t,r){const{prefix:n}=r;if(n!==pe.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function is(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const Le=112,os=18;function Ur(e,t,r){const n=pt(e),i=n+pt(t),o=new Uint8Array(i+r.byteLength);return ht(e,o,0),
ht(t,o,n),o.set(r,i),o}const ss=Symbol.for("@ipld/js-cid/CID"),Jt={...Uo,...ao,..._o,...ro,...oo,...Ao,...vo,...Co,...Mo,
...po};function Mn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}const Lr=Mn("u\
tf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),kt=Mn("ascii","a",e=>{let t="\
a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=vn(e.length);for(let r=0;r<
e.length;r++)t[r]=e.charCodeAt(r);return t}),Rn={utf8:Lr,"utf-8":Lr,hex:Jt.base16,latin1:kt,ascii:kt,binary:kt,...Jt};function _n(e,t="\
utf8"){const r=Rn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.decoder.decode(`${r.prefix}${e}`)}
function bt(e,t="utf8"){const r=Rn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.encoder.encode(
e).substring(1)}class Oe extends Error{constructor(){super(...arguments);p(this,"name","InvalidMultiaddrError")}}p(Oe,"n\
ame","InvalidMultiaddrError");class Ue extends Error{constructor(){super(...arguments);p(this,"name","ValidationError")}}
p(Ue,"name","ValidationError");class Dn extends Error{constructor(){super(...arguments);p(this,"name","UnknownProtocolEr\
ror")}}p(Dn,"name","UnknownProtocolError");const as=4,cs=6,ds=273,fs=33,us=41,ls=42,hs=43,ps=53,bs=54,ms=55,gs=56,ys=132,
ws=301,Es=302,xs=400,Ss=421,As=444,Is=445,vs=446,Ts=447,Cs=448,Os=449,Bs=454,Ns=460,Ms=461,Rs=465,_s=466,Ds=480,Us=481,Ls=443,
ks=477,zs=478,Ps=479,Fs=277,Gs=275,$s=276,qs=280,js=281,Ws=290,Vs=777;function kr(e){return t=>bt(t,e)}function zr(e){return t=>_n(
t,e)}function je(e){return new DataView(e.buffer).getUint16(e.byteOffset).toString()}function Me(e){const t=new ArrayBuffer(
2);return new DataView(t).setUint16(0,typeof e=="string"?parseInt(e):e),new Uint8Array(t)}function Hs(e){const t=e.split(
":");if(t.length!==2)throw new Error(`failed to parse onion addr: ["'${t.join('", "')}'"]' does not contain a port numbe\
r`);if(t[0].length!==16)throw new Error(`failed to parse onion addr: ${t[0]} not a Tor onion address.`);const r=_n(t[0],
"base32"),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=Me(n);return Tn(
[r,i],r.length+i.length)}function Qs(e){const t=e.split(":");if(t.length!==2)throw new Error(`failed to parse onion addr\
: ["'${t.join('", "')}'"]' does not contain a port number`);if(t[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${t[0]} not a Tor onion3 address.`);const r=_e.decode(`b${t[0]}`),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=Me(n);return Tn([r,i],r.length+i.length)}function Pr(e){const t=e.subarray(
0,e.length-2),r=e.subarray(e.length-2),n=bt(t,"base32"),i=je(r);return`${n}:${i}`}const Un=function(e){e=e.toString().trim();
const t=new Uint8Array(4);return e.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new Oe(
"Invalid byte value in IP address");t[n]=i}),t},Ys=function(e){let t=0;e=e.toString().trim();const r=e.split(":",8);let n;
for(n=0;n<r.length;n++){const o=In(r[n]);let s;o&&(s=Un(r[n]),r[n]=bt(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,bt(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(t+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new Oe("Invalid byte value in IP address");i[t++]=o>>8&255,i[t++]=o&255}return i},Ks=function(e){
if(e.byteLength!==4)throw new Oe("IPv4 address was incorrect length");const t=[];for(let r=0;r<e.byteLength;r++)t.push(e[r]);
return t.join(".")},Xs=function(e){if(e.byteLength!==16)throw new Oe("IPv6 address was incorrect length");const t=[];for(let n=0;n<
e.byteLength;n+=2){const i=e[n],o=e[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;t.push(s)}
const r=t.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new Oe(
`Invalid IPv6 address "${r}"`)}};function Js(e){try{const t=new URL(`http://[${e}]`);return t.hostname.substring(1,t.hostname.
length-1)}catch{throw new Oe(`Invalid IPv6 address "${e}"`)}}const zt=Object.values(Jt).map(e=>e.decoder),Zs=(function(){
let e=zt[0].or(zt[1]);return zt.slice(2).forEach(t=>e=e.or(t)),e})();function ea(e){return Zs.decode(e)}function ta(e){return t=>e.
encoder.encode(t)}function ra(e){if(parseInt(e).toString()!==e)throw new Ue("Value must be an integer")}function na(e){if(e<
0)throw new Ue("Value must be a positive integer, or zero")}function ia(e){return t=>{if(t>e)throw new Ue(`Value must be\
 smaller than or equal to ${e}`)}}function oa(...e){return t=>{for(const r of e)r(t)}}const Ze=oa(ra,na,ia(65535)),Z=-1;
class sa{constructor(){p(this,"protocolsByCode",new Map);p(this,"protocolsByName",new Map)}getProtocol(t){let r;if(typeof t==
"string"?r=this.protocolsByName.get(t):r=this.protocolsByCode.get(t),r==null)throw new Dn(`Protocol ${t} was unknown`);return r}addProtocol(t){
var r;this.protocolsByCode.set(t.code,t),this.protocolsByName.set(t.name,t),(r=t.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,t)})}removeProtocol(t){var n;const r=this.protocolsByCode.get(t);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const aa=new sa,ca=[
{code:as,name:"ip4",size:32,valueToBytes:Un,bytesToValue:Ks,validate:e=>{if(!In(e))throw new Ue(`Invalid IPv4 address "${e}\
"`)}},{code:cs,name:"tcp",size:16,valueToBytes:Me,bytesToValue:je,validate:Ze},{code:ds,name:"udp",size:16,valueToBytes:Me,
bytesToValue:je,validate:Ze},{code:fs,name:"dccp",size:16,valueToBytes:Me,bytesToValue:je,validate:Ze},{code:us,name:"ip\
6",size:128,valueToBytes:Ys,bytesToValue:Xs,stringToValue:Js,validate:e=>{if(!zi(e))throw new Ue(`Invalid IPv6 address "${e}\
"`)}},{code:ls,name:"ip6zone",size:Z},{code:hs,name:"ipcidr",size:8,bytesToValue:kr("base10"),valueToBytes:zr("base10")},
{code:ps,name:"dns",size:Z},{code:bs,name:"dns4",size:Z},{code:ms,name:"dns6",size:Z},{code:gs,name:"dnsaddr",size:Z},{code:ys,
name:"sctp",size:16,valueToBytes:Me,bytesToValue:je,validate:Ze},{code:ws,name:"udt"},{code:Es,name:"utp"},{code:xs,name:"\
unix",size:Z,stringToValue:e=>decodeURIComponent(e),valueToString:e=>encodeURIComponent(e)},{code:Ss,name:"p2p",aliases:[
"ipfs"],size:Z,bytesToValue:kr("base58btc"),valueToBytes:e=>e.startsWith("Q")||e.startsWith("1")?zr("base58btc")(e):ts.parse(
e).multihash.bytes},{code:As,name:"onion",size:96,bytesToValue:Pr,valueToBytes:Hs},{code:Is,name:"onion3",size:296,bytesToValue:Pr,
valueToBytes:Qs},{code:vs,name:"garlic64",size:Z},{code:Ts,name:"garlic32",size:Z},{code:Cs,name:"tls"},{code:Os,name:"s\
ni",size:Z},{code:Bs,name:"noise"},{code:Ns,name:"quic"},{code:Ms,name:"quic-v1"},{code:Rs,name:"webtransport"},{code:_s,
name:"certhash",size:Z,bytesToValue:ta(Bn),valueToBytes:ea},{code:Ds,name:"http"},{code:Us,name:"http-path",size:Z,stringToValue:e=>`\
/${decodeURIComponent(e)}`,valueToString:e=>encodeURIComponent(e.substring(1))},{code:Ls,name:"https"},{code:ks,name:"ws"},
{code:zs,name:"wss"},{code:Ps,name:"p2p-websocket-star"},{code:Fs,name:"p2p-stardust"},{code:Gs,name:"p2p-webrtc-star"},
{code:$s,name:"p2p-webrtc-direct"},{code:qs,name:"webrtc-direct"},{code:js,name:"webrtc"},{code:Ws,name:"p2p-circuit"},{
code:Vs,name:"memory",size:Z}];ca.forEach(e=>{aa.addProtocol(e)});function Zt(e){if(e instanceof Uint8Array&&e.constructor.
name==="Uint8Array")return Gr(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Gr(
new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function da(e){
const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}const Fr=4096;function fa(e){const t=e.
length;if(t<=Fr)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.
subarray(n,n+=Fr));return r}function ua(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function Gr(e){return ua(
e)?e:e.slice()}function la(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==
a&&(n[l]=o)}}var h=e.length,g=e.charAt(0),u=Math.log(h)/Math.log(256),m=Math.log(256)/Math.log(h);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var f=0,S=0,
E=0,I=c.length;E!==I&&c[E]===0;)E++,f++;for(var T=(I-E)*m+1>>>0,A=new Uint8Array(T);E!==I;){for(var x=c[E],R=0,w=T-1;(x!==
0||R<S)&&w!==-1;w--,R++)x+=256*A[w]>>>0,A[w]=x%h>>>0,x=x/h>>>0;if(x!==0)throw new Error("Non-zero carry");S=R,E++}for(var N=T-
S;N!==T&&A[N]===0;)N++;for(var U=g.repeat(f);N<T;++N)U+=e.charAt(A[N]);return U}function v(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var f=0;if(c[f]!==" "){for(var S=0,E=0;c[f]===g;)S++,f++;for(var I=(c.
length-f)*u+1>>>0,T=new Uint8Array(I);c[f];){var A=n[c.charCodeAt(f)];if(A===255)return;for(var x=0,R=I-1;(A!==0||x<E)&&
R!==-1;R--,x++)A+=h*T[R]>>>0,T[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");E=x,f++}if(c[f]!==" "){
for(var w=I-E;w!==I&&T[w]===0;)w++;for(var N=new Uint8Array(S+(I-w)),U=S;w!==I;)N[U++]=T[w++];return N}}}function y(c){var f=v(
c);if(f)return f;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:v,decode:y}}var ha=la,pa=ha;let ba=class{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},ma=class{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseDecode");p(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Ln(this,t)}},ga=class{constructor(t){p(this,"decoders");this.
decoders=t}or(t){return Ln(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Ln(e,t){return new ga({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let ya=class{constructor(t,r,n,i){
p(this,"name");p(this,"prefix");p(this,"baseEncode");p(this,"baseDecode");p(this,"encoder");p(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ba(t,r,n),this.decoder=new ma(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function vt({name:e,prefix:t,encode:r,decode:n}){return new ya(
e,t,r,n)}function Xe({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=pa(r,e,n);return vt({prefix:t,
name:e,encode:i,decode:s=>Zt(o(s))})}function wa(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|h,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Ea(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function xa(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function W({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=xa(n,i);return vt(
{prefix:t,name:e,encode(s){return Ea(s,n,r)},decode(s){return wa(s,o,r,e)}})}Xe({prefix:"9",name:"base10",alphabet:"0123\
456789"});W({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});W({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});W({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const kn=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Sa=kn.reduce((e,t,r)=>(e[r]=t,e),[]),Aa=kn.reduce((e,t,r)=>{const n=t.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);function Ia(e){return e.reduce(
(t,r)=>(t+=Sa[r],t),"")}function va(e){const t=[];for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=Aa[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(
t)}vt({prefix:"🚀",name:"base256emoji",encode:Ia,decode:va});W({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
tuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});W({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0});W({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0});W({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});
W({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});W({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});W({prefix:"t",name:"\
base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});W({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});W({prefix:"h",name:"base32z",
alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Xe({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijk\
lmnopqrstuvwxyz",caseInsensitive:!0});Xe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
caseInsensitive:!0});Xe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxy\
z"});Xe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});W({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});W({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});W({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});W({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});W({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3});vt({prefix:"\0",name:"identity",encode:e=>fa(Zt(e)),decode:e=>Zt(da(
e))});new TextEncoder;new TextDecoder;const Ta="/",Ca=new TextEncoder().encode(Ta);Ca[0];function Oa(e){if(e instanceof Uint8Array&&
e.constructor.name==="Uint8Array")return e;if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))
return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new Error("Unknown type, must be binary type")}function Ba(e){
return new TextEncoder().encode(e)}function Na(e){return new TextDecoder().decode(e)}function Ma(e,t){if(e.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<e.length;i++){var o=e.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=e.length,d=e.charAt(0),l=Math.log(
a)/Math.log(256),h=Math.log(256)/Math.log(a);function g(b){if(b instanceof Uint8Array||(ArrayBuffer.isView(b)?b=new Uint8Array(
b.buffer,b.byteOffset,b.byteLength):Array.isArray(b)&&(b=Uint8Array.from(b))),!(b instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(b.length===0)return"";for(var v=0,y=0,c=0,f=b.length;c!==f&&b[c]===0;)c++,v++;for(var S=(f-c)*
h+1>>>0,E=new Uint8Array(S);c!==f;){for(var I=b[c],T=0,A=S-1;(I!==0||T<y)&&A!==-1;A--,T++)I+=256*E[A]>>>0,E[A]=I%a>>>0,I=
I/a>>>0;if(I!==0)throw new Error("Non-zero carry");y=T,c++}for(var x=S-y;x!==S&&E[x]===0;)x++;for(var R=d.repeat(v);x<S;++x)
R+=e.charAt(E[x]);return R}function u(b){if(typeof b!="string")throw new TypeError("Expected String");if(b.length===0)return new Uint8Array;
var v=0;if(b[v]!==" "){for(var y=0,c=0;b[v]===d;)y++,v++;for(var f=(b.length-v)*l+1>>>0,S=new Uint8Array(f);b[v];){var E=r[b.
charCodeAt(v)];if(E===255)return;for(var I=0,T=f-1;(E!==0||I<c)&&T!==-1;T--,I++)E+=a*S[T]>>>0,S[T]=E%256>>>0,E=E/256>>>0;
if(E!==0)throw new Error("Non-zero carry");c=I,v++}if(b[v]!==" "){for(var A=f-c;A!==f&&S[A]===0;)A++;for(var x=new Uint8Array(
y+(f-A)),R=y;A!==f;)x[R++]=S[A++];return x}}}function m(b){var v=u(b);if(v)return v;throw new Error(`Non-${t} character`)}
return{encode:g,decodeUnsafe:u,decode:m}}var Ra=Ma,_a=Ra;let Da=class{constructor(t,r,n){p(this,"name");p(this,"prefix");
p(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},Ua=class{constructor(t,r,n){p(this,"name");p(this,"pr\
efix");p(this,"baseDecode");p(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t=="string"){if(t.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(t){return zn(this,t)}},La=class{constructor(t){p(this,"decoders");this.decoders=t}or(t){
return zn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function zn(e,t){
return new La({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let ka=class{constructor(t,r,n,i){p(this,"n\
ame");p(this,"prefix");p(this,"baseEncode");p(this,"baseDecode");p(this,"encoder");p(this,"decoder");this.name=t,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Da(t,r,n),this.decoder=new Ua(t,r,i)}encode(t){return this.encoder.
encode(t)}decode(t){return this.decoder.decode(t)}};function Tt({name:e,prefix:t,encode:r,decode:n}){return new ka(e,t,r,
n)}function Je({name:e,prefix:t,alphabet:r}){const{encode:n,decode:i}=_a(r,e);return Tt({prefix:t,name:e,encode:n,decode:o=>Oa(
i(o))})}function za(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,d=0;for(let l=0;l<
i;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|h,s+=r,s>=8&&(s-=8,o[d++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Pa(e,t,r){const n=t[t.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=
t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Fa(e){const t={};for(let r=0;r<e.length;++r)t[e[r]]=r;return t}
function V({name:e,prefix:t,bitsPerChar:r,alphabet:n}){const i=Fa(n);return Tt({prefix:t,name:e,encode(o){return Pa(o,n,
r)},decode(o){return za(o,i,r,e)}})}const Ga=Je({prefix:"9",name:"base10",alphabet:"0123456789"}),$a=Object.freeze(Object.
defineProperty({__proto__:null,base10:Ga},Symbol.toStringTag,{value:"Module"})),qa=V({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),ja=V({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Wa=Object.
freeze(Object.defineProperty({__proto__:null,base16:qa,base16upper:ja},Symbol.toStringTag,{value:"Module"})),Va=V({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),Ha=Object.freeze(Object.defineProperty({__proto__:null,base2:Va},Symbol.toStringTag,
{value:"Module"})),Pn=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Qa=Pn.reduce((e,t,r)=>(e[r]=t,e),[]),
Ya=Pn.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);
function Ka(e){return e.reduce((t,r)=>(t+=Qa[r],t),"")}function Xa(e){const t=[];for(const r of e){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Ya[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);t.push(i)}return new Uint8Array(t)}const Ja=Tt({prefix:"🚀",name:"base256emoji",encode:Ka,decode:Xa}),Za=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Ja},Symbol.toStringTag,{value:"Module"})),ec=V({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),tc=V({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),rc=V({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),nc=V({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),ic=V(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),oc=V({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),sc=V({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ac=V({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),cc=V({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
dc=Object.freeze(Object.defineProperty({__proto__:null,base32:ec,base32hex:ic,base32hexpad:sc,base32hexpadupper:ac,base32hexupper:oc,
base32pad:rc,base32padupper:nc,base32upper:tc,base32z:cc},Symbol.toStringTag,{value:"Module"})),fc=Je({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),uc=Je({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),lc=Object.freeze(Object.defineProperty({__proto__:null,base36:fc,base36upper:uc},Symbol.toStringTag,
{value:"Module"})),hc=Je({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),pc=Je({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),bc=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:hc,base58flickr:pc},Symbol.toStringTag,{value:"Module"})),mc=V({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),gc=V({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),yc=V({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),wc=V({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Ec=Object.
freeze(Object.defineProperty({__proto__:null,base64:mc,base64pad:gc,base64url:yc,base64urlpad:wc},Symbol.toStringTag,{value:"\
Module"})),xc=V({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Sc=Object.freeze(Object.defineProperty({__proto__:null,
base8:xc},Symbol.toStringTag,{value:"Module"})),Ac=Tt({prefix:"\0",name:"identity",encode:e=>Na(e),decode:e=>Ba(e)}),Ic=Object.
freeze(Object.defineProperty({__proto__:null,identity:Ac},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const $r={...Ic,...Ha,...Sc,...$a,...Wa,...dc,...lc,...bc,...Ec,...Za};function er(e=0){return new Uint8Array(e)}function mt(e=0){
return new Uint8Array(e)}function Fn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}
const qr=Fn("utf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),Pt=Fn("asci\
i","a",e=>{let t="a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=mt(e.
length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}),vc={utf8:qr,"utf-8":qr,hex:$r.base16,latin1:Pt,ascii:Pt,
binary:Pt,...$r};function Tc(e,t="utf8"){const r=vc[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.
decoder.decode(`${r.prefix}${e}`)}const Cc=Math.pow(2,7),Oc=Math.pow(2,14),Bc=Math.pow(2,21),Gn=Math.pow(2,28),$n=Math.pow(
2,35),qn=Math.pow(2,42),jn=Math.pow(2,49),J=128,Ee=127;function gr(e){if(e<Cc)return 1;if(e<Oc)return 2;if(e<Bc)return 3;
if(e<Gn)return 4;if(e<$n)return 5;if(e<qn)return 6;if(e<jn)return 7;if(Number.MAX_SAFE_INTEGER!=null&&e>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Nc(e,t,r=0){switch(gr(e)){case 8:t[r++]=e&255|J,e/=128;case 7:
t[r++]=e&255|J,e/=128;case 6:t[r++]=e&255|J,e/=128;case 5:t[r++]=e&255|J,e/=128;case 4:t[r++]=e&255|J,e>>>=7;case 3:t[r++]=
e&255|J,e>>>=7;case 2:t[r++]=e&255|J,e>>>=7;case 1:{t[r++]=e&255,e>>>=7;break}default:throw new Error("unreachable")}return t}
function Mc(e,t){let r=e[t],n=0;if(n+=r&Ee,r<J||(r=e[t+1],n+=(r&Ee)<<7,r<J)||(r=e[t+2],n+=(r&Ee)<<14,r<J)||(r=e[t+3],n+=
(r&Ee)<<21,r<J)||(r=e[t+4],n+=(r&Ee)*Gn,r<J)||(r=e[t+5],n+=(r&Ee)*$n,r<J)||(r=e[t+6],n+=(r&Ee)*qn,r<J)||(r=e[t+7],n+=(r&
Ee)*jn,r<J))return n;throw new RangeError("Could not decode varint")}const yr=new Float32Array([-0]),Ae=new Uint8Array(yr.
buffer);function Rc(e,t,r){yr[0]=e,t[r]=Ae[0],t[r+1]=Ae[1],t[r+2]=Ae[2],t[r+3]=Ae[3]}function _c(e,t){return Ae[0]=e[t],
Ae[1]=e[t+1],Ae[2]=e[t+2],Ae[3]=e[t+3],yr[0]}const wr=new Float64Array([-0]),Y=new Uint8Array(wr.buffer);function Dc(e,t,r){
wr[0]=e,t[r]=Y[0],t[r+1]=Y[1],t[r+2]=Y[2],t[r+3]=Y[3],t[r+4]=Y[4],t[r+5]=Y[5],t[r+6]=Y[6],t[r+7]=Y[7]}function Uc(e,t){return Y[0]=
e[t],Y[1]=e[t+1],Y[2]=e[t+2],Y[3]=e[t+3],Y[4]=e[t+4],Y[5]=e[t+5],Y[6]=e[t+6],Y[7]=e[t+7],wr[0]}const Lc=BigInt(Number.MAX_SAFE_INTEGER),
kc=BigInt(Number.MIN_SAFE_INTEGER);class K{constructor(t,r){p(this,"lo");p(this,"hi");this.lo=t|0,this.hi=r|0}toNumber(t=!1){
if(!t&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(t=!1){if(t)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(t=!1){return this.toBigInt(t).toString()}zzEncode(){const t=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this}zzDecode(){const t=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this}length(){const t=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?t<16384?t<128?1:2:t<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(t){if(t===
0n)return Ce;if(t<Lc&&t>kc)return this.fromNumber(Number(t));const r=t<0n;r&&(t=-t);let n=t>>32n,i=t-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>jr&&(i=0n,++n>jr&&(n=0n))),new K(Number(i),Number(n))}static fromNumber(t){if(t===0)return Ce;const r=t<
0;r&&(t=-t);let n=t>>>0,i=(t-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new K(n,i)}static from(t){return typeof t=="number"?K.fromNumber(t):typeof t=="bigint"?K.fromBigInt(t):typeof t=="string"?
K.fromBigInt(BigInt(t)):t.low!=null||t.high!=null?new K(t.low>>>0,t.high>>>0):Ce}}const Ce=new K(0,0);Ce.toBigInt=function(){
return 0n};Ce.zzEncode=Ce.zzDecode=function(){return this};Ce.length=function(){return 1};const jr=4294967296n;function zc(e){
let t=0,r=0;for(let n=0;n<e.length;++n)r=e.charCodeAt(n),r<128?t+=1:r<2048?t+=2:(r&64512)===55296&&(e.charCodeAt(n+1)&64512)===
56320?(++n,t+=4):t+=3;return t}function Pc(e,t,r){if(r-t<1)return"";let i;const o=[];let s=0,a;for(;t<r;)a=e[t++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|e[t++]&63:a>239&&a<365?(a=((a&7)<<18|(e[t++]&63)<<12|(e[t++]&63)<<6|e[t++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(e[t++]&63)<<6|e[t++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Wn(e,t,r){const n=r;let i,o;for(let s=0;s<e.length;++s)i=e.charCodeAt(
s),i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===55296&&((o=e.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=
i>>6&63|128,t[r++]=i&63|128);return r-n}function oe(e,t){return RangeError(`index out of range: ${e.pos} + ${t??1} > ${e.
len}`)}function et(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}class Fc{constructor(t){p(this,"buf");p(this,
"pos");p(this,"len");p(this,"_slice",Uint8Array.prototype.subarray);this.buf=t,this.pos=0,this.len=t.length}uint32(){let t=4294967295;
if(t=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(t=(t|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(t=(t|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(t=(t|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(t=(t|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return t;if((this.pos+=5)>this.len)throw this.
pos=this.len,oe(this,10);return t}int32(){return this.uint32()|0}sint32(){const t=this.uint32();return t>>>1^-(t&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw oe(this,4);return et(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw oe(this,4);return et(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw oe(this,4);const t=_c(
this.buf,this.pos);return this.pos+=4,t}double(){if(this.pos+8>this.len)throw oe(this,4);const t=Uc(this.buf,this.pos);return this.
pos+=8,t}bytes(){const t=this.uint32(),r=this.pos,n=this.pos+t;if(n>this.len)throw oe(this,t);return this.pos+=t,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const t=this.bytes();return Pc(t,0,t.length)}skip(t){if(typeof t=="number"){if(this.pos+
t>this.len)throw oe(this,t);this.pos+=t}else do if(this.pos>=this.len)throw oe(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(t=this.uint32()&7)!==4;)this.skipType(t);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${t} at offset ${this.pos}`)}return this}readLongVarint(){const t=new K(0,0);let r=0;if(this.len-this.pos>4){
for(;r<4;++r)if(t.lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(this.buf[this.
pos]&127)<<28)>>>0,t.hi=(t.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return t;r=0}else{for(;r<3;++r){
if(this.pos>=this.len)throw oe(this);if(t.lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t}
return t.lo=(t.lo|(this.buf[this.pos++]&127)<<r*7)>>>0,t}if(this.len-this.pos>4){for(;r<5;++r)if(t.hi=(t.hi|(this.buf[this.
pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return t}else for(;r<5;++r){if(this.pos>=this.len)throw oe(this);if(t.hi=
(t.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw oe(this,8);const t=et(this.buf,this.pos+=4),r=et(this.buf,this.pos+=4);return new K(t,r)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const t=Mc(this.buf,this.pos);
return this.pos+=gr(t),t}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Gc(e){return new Fc(e instanceof Uint8Array?e:
e.subarray())}function Er(e,t,r){const n=Gc(e);return t.decode(n,void 0,r)}function $c(e){let n,i=8192;return function(s){
if(s<1||s>4096)return mt(s);i+s>8192&&(n=mt(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class We{constructor(t,r,n){
p(this,"fn");p(this,"len");p(this,"next");p(this,"val");this.fn=t,this.len=r,this.next=void 0,this.val=n}}function Ft(){}
class qc{constructor(t){p(this,"head");p(this,"tail");p(this,"len");p(this,"next");this.head=t.head,this.tail=t.tail,this.
len=t.len,this.next=t.states}}const jc=$c();function Wc(e){return globalThis.Buffer!=null?mt(e):jc(e)}class tr{constructor(){
p(this,"len");p(this,"head");p(this,"tail");p(this,"states");this.len=0,this.head=new We(Ft,0,0),this.tail=this.head,this.
states=null}_push(t,r,n){return this.tail=this.tail.next=new We(t,r,n),this.len+=r,this}uint32(t){return this.len+=(this.
tail=this.tail.next=new Hc((t=t>>>0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this}int32(t){return t<0?this._push(
tt,10,K.fromNumber(t)):this.uint32(t)}sint32(t){return this.uint32((t<<1^t>>31)>>>0)}uint64(t){const r=K.fromBigInt(t);return this.
_push(tt,r.length(),r)}uint64Number(t){return this._push(Nc,gr(t),t)}uint64String(t){return this.uint64(BigInt(t))}int64(t){
return this.uint64(t)}int64Number(t){return this.uint64Number(t)}int64String(t){return this.uint64String(t)}sint64(t){const r=K.
fromBigInt(t).zzEncode();return this._push(tt,r.length(),r)}sint64Number(t){const r=K.fromNumber(t).zzEncode();return this.
_push(tt,r.length(),r)}sint64String(t){return this.sint64(BigInt(t))}bool(t){return this._push(Gt,1,t?1:0)}fixed32(t){return this.
_push(ke,4,t>>>0)}sfixed32(t){return this.fixed32(t)}fixed64(t){const r=K.fromBigInt(t);return this._push(ke,4,r.lo)._push(
ke,4,r.hi)}fixed64Number(t){const r=K.fromNumber(t);return this._push(ke,4,r.lo)._push(ke,4,r.hi)}fixed64String(t){return this.
fixed64(BigInt(t))}sfixed64(t){return this.fixed64(t)}sfixed64Number(t){return this.fixed64Number(t)}sfixed64String(t){return this.
fixed64String(t)}float(t){return this._push(Rc,4,t)}double(t){return this._push(Dc,8,t)}bytes(t){const r=t.length>>>0;return r===
0?this._push(Gt,1,0):this.uint32(r)._push(Qc,r,t)}string(t){const r=zc(t);return r!==0?this.uint32(r)._push(Wn,r,t):this.
_push(Gt,1,0)}fork(){return this.states=new qc(this),this.head=this.tail=new We(Ft,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new We(Ft,0,0),this.len=0),this}ldelim(){const t=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=t.next,this.tail=r,this.len+=n),this}finish(){let t=this.head.next;const r=Wc(this.len);
let n=0;for(;t!=null;)t.fn(t.val,r,n),n+=t.len,t=t.next;return r}}function Gt(e,t,r){t[r]=e&255}function Vc(e,t,r){for(;e>
127;)t[r++]=e&127|128,e>>>=7;t[r]=e}class Hc extends We{constructor(r,n){super(Vc,r,n);p(this,"next");this.next=void 0}}
function tt(e,t,r){for(;e.hi!==0;)t[r++]=e.lo&127|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[r++]=e.lo&
127|128,e.lo=e.lo>>>7;t[r++]=e.lo}function ke(e,t,r){t[r]=e&255,t[r+1]=e>>>8&255,t[r+2]=e>>>16&255,t[r+3]=e>>>24}function Qc(e,t,r){
t.set(e,r)}globalThis.Buffer!=null&&(tr.prototype.bytes=function(e){const t=e.length>>>0;return this.uint32(t),t>0&&this.
_push(Yc,t,e),this},tr.prototype.string=function(e){const t=globalThis.Buffer.byteLength(e);return this.uint32(t),t>0&&this.
_push(Kc,t,e),this});function Yc(e,t,r){t.set(e,r)}function Kc(e,t,r){e.length<40?Wn(e,t,r):t.utf8Write!=null?t.utf8Write(
e,r):t.set(Tc(e),r)}function Xc(){return new tr}function xr(e,t){const r=Xc();return t.encode(e,r,{lengthDelimited:!1}),
r.finish()}var rr;(function(e){e[e.VARINT=0]="VARINT",e[e.BIT64=1]="BIT64",e[e.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",e[e.
START_GROUP=3]="START_GROUP",e[e.END_GROUP=4]="END_GROUP",e[e.BIT32=5]="BIT32"})(rr||(rr={}));function Jc(e,t,r,n){return{
name:e,type:t,encode:r,decode:n}}function Sr(e,t){return Jc("message",rr.LENGTH_DELIMITED,e,t)}class nr extends Error{constructor(){
super(...arguments);p(this,"code","ERR_MAX_LENGTH");p(this,"name","MaxLengthError")}}var xn,Sn;(Sn=(xn=globalThis.process)==
null?void 0:xn.env)!=null&&Sn.DUMP_SESSION_KEYS;var gt;(function(e){let t;e.codec=()=>(t==null&&(t=Sr((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,d;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const l=r.uint32();switch(l>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new nr('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((d=i.limits)==null?void 0:d.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new nr('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(l&7);break}}}return o})),t),e.encode=r=>xr(r,e.codec()),e.decode=(r,n)=>Er(r,e.codec(),n)})(gt||(gt={}));var Wr;
(function(e){let t;e.codec=()=>(t==null&&(t=Sr((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),gt.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:er(0),identitySig:er(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const d=r.uint32();
switch(d>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=gt.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(d&7);break}}}return o})),
t),e.encode=r=>xr(r,e.codec()),e.decode=(r,n)=>Er(r,e.codec(),n)})(Wr||(Wr={}));var Vr;(function(e){let t;e.codec=()=>(t==
null&&(t=Sr((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:er(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const d=r.uint32();switch(d>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new nr(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(d&7);break}}}
return o})),t),e.encode=r=>xr(r,e.codec()),e.decode=(r,n)=>Er(r,e.codec(),n)})(Vr||(Vr={}));new TextEncoder;new TextDecoder(
"utf-8",{fatal:!0});new TextEncoder;new TextDecoder;const Zc=e=>e/2**32|0,ed=e=>e>>>0;function td(e,t,r,n){const i=Zc(r),o=ed(r);e.setUint32(t,n?o:i,n),e.setUint32(t+4,n?i:
o,n)}function Hr(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"&&"BYTES_PER\
_ELEMENT"in e&&e.BYTES_PER_ELEMENT===1}const rd=e=>e?`"${e}" `:"";function Ar(e,t,r=""){if(Hr(e)&&t===void 0)return e;const n=Hr(
e),i="",o=n?`length=${e.length}`:`type=${typeof e}`,s=rd(r)+"expected Uint8Array"+i+", got "+o;throw n?new RangeError(s):
new TypeError(s)}const nd=(e,t)=>{if(e===null||typeof e!="object"||Array.isArray(e))throw new TypeError((t==="object"?"":
`"${t}" `)+"expected object, got type="+typeof e)},Qr=(e,t)=>{nd(e,t);const r=Object.getPrototypeOf(e);if(r!==Object.prototype&&
r!==null)throw new TypeError(`"${t}" expected plain object`);if(Object.hasOwn(e,"__proto__"))throw new TypeError(`"${t}.\
__proto__" is not allowed`)};function Yr(e,t=!0){if(e.destroyed)throw new Error("hash was destroyed");if(t&&e.finished)throw new Error(
"digest() was already called")}function id(e,t){Ar(e,void 0,"output");const r=t.outputLen;if(!(e.length>=r))throw new RangeError(
'"output" expected length >= '+r)}function Kr(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function $t(e){return new DataView(
e.buffer,e.byteOffset,e.byteLength)}function fe(e,t){return e<<32-t|e>>>t}const od=typeof Uint8Array.from([]).toHex=="fu\
nction"&&typeof Uint8Array.fromHex=="function",sd=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function Vn(e){
if(Ar(e),od)return e.toHex();let t="";for(let r=0;r<e.length;r++)t+=sd[e[r]];return t}function ad(e,t,r="opts"){return Qr(
e,"defaults"),t!==void 0&&Qr(t,r),Object.assign(Object.create(null),e,t)}function cd(e,t={}){if(typeof e!="function")throw new TypeError(
'"hashCons" expected function, got type='+typeof e);t=ad({},t,"info");const r=(i,o)=>e(o).update(i).digest(),n=e(void 0);
return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.canXOF=n.canXOF,r.create=i=>e(i),Object.assign(r,t),Object.freeze(
r)}const dd=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});function fd(e,t,r){return e&t^~e&r}function ud(e,t,r){
return e&t^e&r^t&r}class ld{constructor(t,r,n,i){p(this,"blockLen");p(this,"outputLen");p(this,"canXOF",!1);p(this,"padO\
ffset");p(this,"isLE");p(this,"buffer");p(this,"view");p(this,"finished",!1);p(this,"length",0);p(this,"pos",0);p(this,"\
destroyed",!1);this.blockLen=t,this.outputLen=r,this.padOffset=n,this.isLE=i,this.buffer=new Uint8Array(t),this.view=$t(
this.buffer)}update(t){Yr(this),Ar(t);const{view:r,buffer:n,blockLen:i}=this,o=t.length;let s=!1;for(let a=0;a<o;){const d=Math.
min(i-this.pos,o-a);if(d===i){const l=$t(t);for(;i<=o-a;a+=i)this.process(l,a);s=!0;continue}n.set(a===0&&d===o?t:t.subarray(
a,a+d),this.pos),this.pos+=d,a+=d,this.pos===i&&(this.process(r,0),this.pos=0,s=!0)}return this.length+=t.length,s&&this.
roundClean(),this}digestInto(t){Yr(this),id(t,this),this.finished=!0;const{buffer:r,view:n,blockLen:i,isLE:o}=this;let{pos:s}=this;
r[s++]=128,r.fill(0,s),this.padOffset>i-s&&(this.process(n,0),r.fill(0)),td(n,i-8,this.length*8,o),this.process(n,0),this.
roundClean();const a=t===r?n:$t(t),d=this.outputLen,l=d/4,h=this.get();if(d%4||l>h.length)throw new Error("invalid outpu\
tLen");for(let g=0;g<l;g++)a.setUint32(4*g,h[g],o)}digest(){const{buffer:t,outputLen:r}=this;this.digestInto(t);const n=t.
slice(0,r);return this.destroy(),n}_cloneIntoMeta(t){const{buffer:r,length:n,finished:i,destroyed:o,pos:s}=this;return t.
destroyed=o,t.finished=i,t.length=n,t.pos=s,s&&t.buffer.set(r),t}clone(){return this._cloneInto()}}const hd=Uint32Array.
from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),pd=Uint32Array.from([1116352408,
1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,
2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,
2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,
1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,
430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,
2428436474,2756734187,3204031479,3329325298]),xe=new Uint32Array(64);class bd extends ld{constructor(r,n){super(64,r,8,!1);
p(this,"A",0);p(this,"B",0);p(this,"C",0);p(this,"D",0);p(this,"E",0);p(this,"F",0);p(this,"G",0);p(this,"H",0);this.A=n[0]|
0,this.B=n[1]|0,this.C=n[2]|0,this.D=n[3]|0,this.E=n[4]|0,this.F=n[5]|0,this.G=n[6]|0,this.H=n[7]|0}get(){const{A:r,B:n,
C:i,D:o,E:s,F:a,G:d,H:l}=this;return[r,n,i,o,s,a,d,l]}set(r,n,i,o,s,a,d,l){this.A=r|0,this.B=n|0,this.C=i|0,this.D=o|0,this.
E=s|0,this.F=a|0,this.G=d|0,this.H=l|0}_cloneInto(r){return(r||(r=new this.constructor)).set(...this.get()),this._cloneIntoMeta(
r)}process(r,n){for(let u=0;u<16;u++,n+=4)xe[u]=r.getUint32(n,!1);for(let u=16;u<64;u++){const m=xe[u-15],b=xe[u-2],v=fe(
m,7)^fe(m,18)^m>>>3,y=fe(b,17)^fe(b,19)^b>>>10;xe[u]=y+xe[u-7]+v+xe[u-16]|0}let{A:i,B:o,C:s,D:a,E:d,F:l,G:h,H:g}=this;for(let u=0;u<
64;u++){const m=fe(d,6)^fe(d,11)^fe(d,25),b=g+m+fd(d,l,h)+pd[u]+xe[u]|0,y=(fe(i,2)^fe(i,13)^fe(i,22))+ud(i,o,s)|0;g=h,h=
l,l=d,d=a+b|0,a=s,s=o,o=i,i=b+y|0}i=i+this.A|0,o=o+this.B|0,s=s+this.C|0,a=a+this.D|0,d=d+this.E|0,l=l+this.F|0,h=h+this.
G|0,g=g+this.H|0,this.set(i,o,s,a,d,l,h,g)}roundClean(){Kr(xe)}destroy(){this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),Kr(
this.buffer)}}class md extends bd{constructor(){super(32,hd)}}const Hn=cd(()=>new md,dd(1));function gd(e,t){if(e===t)return!0;
if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])return!1;return!0}function Ir(e){if(e instanceof
Uint8Array&&e.constructor.name==="Uint8Array")return Ye(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.
isView(e))return Ye(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function yd(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function Ye(e){return yd(e)?e:e.slice()}function wd(e,t,r){
if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var d=s.
toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==a&&(n[l]=o)}}var h=e.length,g=e.charAt(0),
u=Math.log(h)/Math.log(256),m=Math.log(256)/Math.log(h);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var f=0,S=0,E=0,I=c.length;E!==I&&c[E]===0;)E++,
f++;for(var T=(I-E)*m+1>>>0,A=new Uint8Array(T);E!==I;){for(var x=c[E],R=0,w=T-1;(x!==0||R<S)&&w!==-1;w--,R++)x+=256*A[w]>>>
0,A[w]=x%h>>>0,x=x/h>>>0;if(x!==0)throw new Error("Non-zero carry");S=R,E++}for(var N=T-S;N!==T&&A[N]===0;)N++;for(var U=g.
repeat(f);N<T;++N)U+=e.charAt(A[N]);return U}function v(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var f=0;if(c[f]!==" "){for(var S=0,E=0;c[f]===g;)S++,f++;for(var I=(c.length-f)*u+
1>>>0,T=new Uint8Array(I);c[f];){var A=n[c.charCodeAt(f)];if(A===255)return;for(var x=0,R=I-1;(A!==0||x<E)&&R!==-1;R--,x++)
A+=h*T[R]>>>0,T[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");E=x,f++}if(c[f]!==" "){for(var w=I-E;w!==
I&&T[w]===0;)w++;for(var N=new Uint8Array(S+(I-w)),U=S;w!==I;)N[U++]=T[w++];return N}}}function y(c){var f=v(c);if(f)return f;
throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:v,decode:y}}var Ed=wd,xd=Ed;let Sd=class{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},Ad=class{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseDecode");p(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Qn(this,t)}},Id=class{constructor(t){p(this,"decoders");this.
decoders=t}or(t){return Qn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Qn(e,t){return new Id({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let vd=class{constructor(t,r,n,i){
p(this,"name");p(this,"prefix");p(this,"baseEncode");p(this,"baseDecode");p(this,"encoder");p(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Sd(t,r,n),this.decoder=new Ad(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function Yn({name:e,prefix:t,encode:r,decode:n}){return new vd(
e,t,r,n)}function Ct({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=xd(r,e,n);return Yn({prefix:t,
name:e,encode:i,decode:s=>Ir(o(s))})}function Td(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|h,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Cd(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Od(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function ge({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Od(n,i);return Yn(
{prefix:t,name:e,encode(s){return Cd(s,n,r)},decode(s){return Td(s,o,r,e)}})}const it=ge({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ge({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ge({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ge({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const qt=Ct(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ct({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Se=Ct({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ct({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Bd=Kn,Xr=128,Nd=-128,Md=Math.pow(2,31);function Kn(e,t,r){t=t||[],r=
r||0;for(var n=r;e>=Md;)t[r++]=e&255|Xr,e/=128;for(;e&Nd;)t[r++]=e&255|Xr,e>>>=7;return t[r]=e|0,Kn.bytes=r-n+1,t}var Rd=ir,
_d=128,Jr=127;function ir(e,n){var r=0,n=n||0,i=0,o=n,s,a=e.length;do{if(o>=a)throw ir.bytes=0,new RangeError("Could not\
 decode varint");s=e[o++],r+=i<28?(s&Jr)<<i:(s&Jr)*Math.pow(2,i),i+=7}while(s>=_d);return ir.bytes=o-n,r}var Dd=Math.pow(
2,7),Ud=Math.pow(2,14),Ld=Math.pow(2,21),kd=Math.pow(2,28),zd=Math.pow(2,35),Pd=Math.pow(2,42),Fd=Math.pow(2,49),Gd=Math.
pow(2,56),$d=Math.pow(2,63),qd=function(e){return e<Dd?1:e<Ud?2:e<Ld?3:e<kd?4:e<zd?5:e<Pd?6:e<Fd?7:e<Gd?8:e<$d?9:10},jd={
encode:Bd,decode:Rd,encodingLength:qd},yt=jd;function or(e,t=0){const r=yt.decode(e,t),n=yt.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function wt(e,t,r=0){return yt.encode(e,t,r),t}function Et(e){return yt.encodingLength(e)}function Wd(e,t){const r=t.
byteLength,n=Et(e),i=n+Et(r),o=new Uint8Array(i+r);return wt(e,o,0),wt(r,o,n),o.set(t,i),new vr(e,r,t,o)}function Vd(e){
const t=Ir(e),[r,n]=or(t),[i,o]=or(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new vr(r,i,s,t)}function Hd(e,t){if(e===t)return!0;{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof
Uint8Array&&gd(e.bytes,r.bytes)}}class vr{constructor(t,r,n,i){p(this,"code");p(this,"size");p(this,"digest");p(this,"by\
tes");this.code=t,this.size=r,this.digest=Ye(n),this.bytes=Ye(i)}}function Zr(e,t){const{bytes:r,version:n}=e;switch(n){case 0:
return Yd(r,sr(e),t??Se.encoder);default:return Kd(r,sr(e),t??it.encoder)}}const en=new WeakMap;function sr(e){const t=en.
get(e);if(t==null){const r=new Map;return en.set(e,r),r}return t}var An;class ${constructor(t,r,n,i){p(this,"code");p(this,
"version");p(this,"multihash");p(this,"bytes");p(this,"/");p(this,An,"CID");this.code=r,this.version=t,this.multihash=n,
this.bytes=Ye(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
ze)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Xd)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return $.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=Wd(t,
r);return $.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return $.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&Hd(t.multihash,n.multihash)}toString(t){return Zr(this,t)}toJSON(){return{"/":Zr(
this)}}link(){return this}[(An=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof $)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new $(n,i,o,s??tn(n,i,o.bytes))}else if(r[Jd]===!0){const{version:n,
multihash:i,code:o}=r,s=Vd(i);return $.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==ze)throw new Error(`Version 0 CID must use dag-pb (code: ${ze}) block encoding`);return new $(t,r,n,n.bytes)}case 1:{
const i=tn(t,r,n.bytes);return new $(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return $.create(
0,ze,t)}static createV1(t,r){return $.create(1,t,r)}static decode(t){const[r,n]=$.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=$.inspectBytes(t),n=r.size-r.multihashSize,i=Ir(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new vr(r.multihashCode,r.digestSize,o,i);return[r.version===0?$.createV0(s):$.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[g,u]=or(t.subarray(r));return r+=u,g};let i=n(),o=ze;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),d=n(),l=r+d,h=l-s;return{version:i,
codec:o,multihashCode:a,digestSize:d,multihashSize:h,size:l}}static parse(t,r){const[n,i]=Qd(t,r),o=$.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return sr(o).set(n,t),o}}function Qd(e,t){
switch(e[0]){case"Q":{const r=t??Se;return[Se.prefix,r.decode(`${Se.prefix}${e}`)]}case Se.prefix:{const r=t??Se;return[
Se.prefix,r.decode(e)]}case it.prefix:{const r=t??it;return[it.prefix,r.decode(e)]}case qt.prefix:{const r=t??qt;return[
qt.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function Yd(e,t,r){const{prefix:n}=r;if(n!==Se.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function Kd(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const ze=112,Xd=18;function tn(e,t,r){const n=Et(e),i=n+Et(t),o=new Uint8Array(i+r.byteLength);return wt(e,o,0),
wt(t,o,n),o.set(r,i),o}const Jd=Symbol.for("@ipld/js-cid/CID"),Xn=new TextEncoder;function Zd(e,t=Number.MAX_SAFE_INTEGER,r=0){
if(!Number.isSafeInteger(e)||e<r||e>t)throw new TypeError("Invalid evidence integer");return e}function ef(e,t=128){if(typeof e!=
"string"||!e.length||Xn.encode(e).length>t||/[\u0000-\u001f\u007f]/u.test(e))throw new TypeError("Invalid evidence text");
return e}function tf(e){if(!/^[a-f0-9]{64}$/.test(e))throw new TypeError("Invalid evidence digest");return e}function ar(e){
return Array.isArray(e)?e.map(ar):e&&typeof e=="object"?Object.fromEntries(Object.keys(e).sort().map(t=>[t,ar(e[t])])):e}
function rf(e){return Vn(Hn(Xn.encode(JSON.stringify(ar(e)))))}function Du(e){if(!Array.isArray(e)||!e.length||e.length>
1024)throw new TypeError("Invalid evidence package files");const t=new Set;return rf(e.map(r=>{const n=ef(r.path,512);if(/[\\%?#:\u0000-\u001f\u007f]/u.
test(n)||n.split("/").some(o=>!o||o==="."||o==="..")||t.has(n))throw new TypeError("Invalid evidence package path");t.add(
n);const i=r.sha256?{sha256:tf(r.sha256)}:{gitBlobSha1:r.gitBlobSha1};if(i.gitBlobSha1!==void 0&&!/^[a-f0-9]{40}$/.test(
i.gitBlobSha1))throw new TypeError("Invalid evidence Git digest");if(!i.sha256&&!i.gitBlobSha1)throw new TypeError("Evid\
ence package requires source digests");return{path:n,size:Zd(r.size),...i}}).sort((r,n)=>r.path<n.path?-1:r.path>n.path?
1:0))}function nf(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return rn(e);if(e instanceof ArrayBuffer)
return new Uint8Array(e);if(ArrayBuffer.isView(e))return rn(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error(
"Unknown type, must be binary type")}function of(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function rn(e){
return of(e)?e:e.slice()}function sf(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var d=s.toLowerCase().charCodeAt(0),l=s.toUpperCase().charCodeAt(0);d!==a&&(n[d]=o),l!==
a&&(n[l]=o)}}var h=e.length,g=e.charAt(0),u=Math.log(h)/Math.log(256),m=Math.log(256)/Math.log(h);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var f=0,S=0,
E=0,I=c.length;E!==I&&c[E]===0;)E++,f++;for(var T=(I-E)*m+1>>>0,A=new Uint8Array(T);E!==I;){for(var x=c[E],R=0,w=T-1;(x!==
0||R<S)&&w!==-1;w--,R++)x+=256*A[w]>>>0,A[w]=x%h>>>0,x=x/h>>>0;if(x!==0)throw new Error("Non-zero carry");S=R,E++}for(var N=T-
S;N!==T&&A[N]===0;)N++;for(var U=g.repeat(f);N<T;++N)U+=e.charAt(A[N]);return U}function v(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var f=0;if(c[f]!==" "){for(var S=0,E=0;c[f]===g;)S++,f++;for(var I=(c.
length-f)*u+1>>>0,T=new Uint8Array(I);c[f];){var A=n[c.charCodeAt(f)];if(A===255)return;for(var x=0,R=I-1;(A!==0||x<E)&&
R!==-1;R--,x++)A+=h*T[R]>>>0,T[R]=A%256>>>0,A=A/256>>>0;if(A!==0)throw new Error("Non-zero carry");E=x,f++}if(c[f]!==" "){
for(var w=I-E;w!==I&&T[w]===0;)w++;for(var N=new Uint8Array(S+(I-w)),U=S;w!==I;)N[U++]=T[w++];return N}}}function y(c){var f=v(
c);if(f)return f;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:v,decode:y}}var af=sf,cf=af;class df{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}}class ff{constructor(t,r,n){
p(this,"name");p(this,"prefix");p(this,"baseDecode");p(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Jn(this,t)}}class uf{constructor(t){p(this,"decoders");this.
decoders=t}or(t){return Jn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function Jn(e,t){return new uf({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class lf{constructor(t,r,n,i){
p(this,"name");p(this,"prefix");p(this,"baseEncode");p(this,"baseDecode");p(this,"encoder");p(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new df(t,r,n),this.decoder=new ff(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function Zn({name:e,prefix:t,encode:r,decode:n}){return new lf(
e,t,r,n)}function Ot({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=cf(r,e,n);return Zn({prefix:t,
name:e,encode:i,decode:s=>nf(o(s))})}function hf(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,d=0;for(let l=0;l<i;++l){const h=t[e[l]];if(h===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|h,s+=r,s>=8&&(s-=8,o[d++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function pf(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let d=0;d<e.length;++d)for(a=a<<8|e[d],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function bf(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function ye({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=bf(n,i);return Zn(
{prefix:t,name:e,encode(s){return pf(s,n,r)},decode(s){return hf(s,o,r,e)}})}ye({prefix:"b",name:"base32",alphabet:"abcd\
efghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ye({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ye({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrst\
uvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ye({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZ234567=",bitsPerChar:5,caseInsensitive:!0});ye({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});ye({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});ye({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
ye({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});
ye({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Ot({prefix:"k",name:"base36",alphabet:"\
0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ot({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFG\
HIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});Ot({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabc\
defghijkmnopqrstuvwxyz"});Ot({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQ\
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const mf="peercompute.artifact.manifest.v1",ei=256*1024,gf=16*
1024**3,xt=new TextEncoder;function yf(e){const t=$.asCID(e)||$.parse(String(e));if(![85,112].includes(t.code)||t.multihash.
code!==18||t.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return t.toV1()}function ot(e,t=0,r={remaining:ei}){if(t>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>r.remaining||
(r.remaining-=xt.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||typeof e==
"boolean"||typeof e=="number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return e.map(i=>ot(i,t+1,r))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(e);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(ot(i,t+1,r),[i,ot(e[i],t+1,r)])))}function wf(e,{
maximumBytes:t=ei,maximumFiles:r=1024,maximumFileBytes:n=gf}={}){if(!e||e.schema!==mf||!Array.isArray(e.files)||e.files.
length===0||e.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(d=>!i.has(d)))
throw new TypeError("Unsupported manifest field.");for(const d of["name","description"])if(e[d]!==void 0&&typeof e[d]!="\
string")throw new TypeError(`Manifest ${d} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||
Array.isArray(e.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=e.files.map(
d=>{if(!d||typeof d!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(d).some(g=>!["path","cid","si\
ze","sha256","mediaType"].includes(g)))throw new TypeError("Unsupported manifest file field.");const{path:l,size:h}=d;if(typeof l!=
"string"||!l||xt.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(l)||l.split("/").some(g=>!g||g==="."||g==="..")||
o.has(l))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(h)||h<0||h>n)throw new RangeError("Invalid file size.");if(d.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(d.sha256))
throw new TypeError("Invalid SHA-256.");if(d.mediaType!==void 0&&(typeof d.mediaType!="string"||d.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(l),{...d,cid:yf(d.cid).toString()}}).sort((d,l)=>d.path<l.path?-1:
d.path>l.path?1:0),a=ot({...e,files:s},0,{remaining:t});if(xt.encode(JSON.stringify(a)).byteLength>t)throw new RangeError(
"Manifest exceeds byte limit.");return a}function Uu(e,t){return xt.encode(JSON.stringify(wf(e,t)))}const De=Object.freeze(
{count:4,dimension:2048,pixels:8*1024**2,byteLength:8*1024**2}),P=e=>{throw new Error(`Invalid generated mesh texture: ${e}`)},
Ef=[137,80,78,71,13,10,26,10];function cr(e,t){return(!Number.isSafeInteger(e)||!Number.isSafeInteger(t)||e<1||t<1||e>De.
dimension||t>De.dimension)&&P("dimensions"),{width:e,height:t,pixels:e*t}}function xf(e,t,r){let n=4294967295;for(let i=t;i<
r;i++){n^=e[i];for(let o=0;o<8;o++)n=n>>>1^3988292384&-(n&1)}return(n^4294967295)>>>0}function Sf(e,t){Ef.every((a,d)=>e[d]===
a)||P("PNG signature");let r=8,n,i=!1,o=!1,s=!1;for(;r+12<=e.length;){const a=t.getUint32(r),d=r+12+a;d>e.length&&P("PNG\
 chunk range");const l=String.fromCharCode(...e.subarray(r+4,r+8));if(t.getUint32(d-4)!==xf(e,r+4,d-4)&&P("PNG chunk che\
cksum"),["IHDR","IDAT","IEND","PLTE","tRNS","sRGB","gAMA","cHRM","pHYs"].includes(l)||P("PNG chunk type"),r===8&&l!=="IH\
DR"&&P("PNG header order"),l==="IHDR")(n||a!==13||e[r+16]!==8||![0,2,3,4,6].includes(e[r+17])||e[r+18]!==0||e[r+19]!==0||
e[r+20]!==0)&&P("PNG header"),n=cr(t.getUint32(r+8),t.getUint32(r+12)),n.colorType=e[r+17];else if(l==="PLTE")(i||s||!a||
a>768||a%3)&&P("PNG palette"),s=!0;else if(l==="IDAT")(o||n.colorType===3&&!s)&&P("PNG image order"),i=!0;else{if(l==="I\
END")return(a||!i||d!==e.length)&&P("PNG end"),cr(n.width,n.height);{i&&(o=!0);const h={sRGB:1,gAMA:4,cHRM:32,pHYs:9}[l];
(h!==void 0?a!==h:a>256)&&P("PNG metadata length")}}r=d}P("PNG truncated")}function Af(e,t){(e[0]!==255||e[1]!==216)&&P(
"JPEG signature");let r=2,n,i=!1,o=!1;for(;r<e.length;){if(o)for(;r<e.length&&e[r]!==255;)r++;for(e[r++]!==255&&P("JPEG \
marker");e[r]===255;)r++;const s=e[r++];if(o&&(s===0||s>=208&&s<=215))continue;if(o=!1,s===217)return(!n||!i||r!==e.length)&&
P("JPEG end"),n;(s===void 0||s===0||s===216||s===1||s>=208&&s<=215||r+2>e.length)&&P("JPEG marker");const a=t.getUint16(
r),d=r+a;if((a<2||d>e.length)&&P("JPEG segment range"),[192,193,194].includes(s)){(n||i||a<11||e[r+2]!==8)&&P("JPEG fram\
e");const l=e[r+7];(![1,3].includes(l)||a!==8+3*l)&&P("JPEG components"),n=cr(t.getUint16(r+5),t.getUint16(r+3))}else s>=
192&&s<=207&&![196].includes(s)&&P("JPEG frame type");s===218?((!n||a<6||a!==6+2*e[r+2])&&P("JPEG scan"),i=!0,o=!0):![192,
193,194,196,219,221,254].includes(s)&&!(s>=224&&s<=239)&&P("JPEG unsupported segment"),r=d}P("JPEG truncated")}function ti(e,t){
(!(e instanceof Uint8Array)||e.length<12||e.length>De.byteLength)&&P("encoded byte limit");const r=new DataView(e.buffer,
e.byteOffset,e.byteLength);if(t==="image/png")return{mimeType:t,...Sf(e,r)};if(t==="image/jpeg")return{mimeType:t,...Af(
e,r)};P("MIME type")}const ae=Object.freeze({byteLength:16*1024**2,jsonBytes:256*1024,vertices:1e5,triangles:15e4,coordinate:1e6}),
If="model/gltf-binary",vf=new TextEncoder,Tf=new TextDecoder("utf-8",{fatal:!0}),D=e=>{throw new Error(`Invalid generate\
d mesh: ${e}`)};function te(e,t,r){return(!Number.isSafeInteger(e)||e<t||e>r)&&D("numeric limit"),e}function q(e,t){return(!e||
typeof e!="object"||Array.isArray(e)||Object.keys(e).some(r=>!t.includes(r)))&&D("unsupported GLB field"),e}function nn(e,t,r=-ae.
coordinate,n=ae.coordinate){return(!Array.isArray(e)||e.length!==t||e.some(i=>!Number.isFinite(i)||i<r||i>n))&&D("invali\
d vector"),[...e]}function Ne(e){return(!Array.isArray(e)||e.length!==1)&&D("expected one static mesh"),e[0]}const dr=(e,t)=>JSON.
stringify(e)===JSON.stringify(t);function Cf(e,t=[],{allowTextures:r=!0}={}){var R,w,N,U,k;const n=new DataView(e.buffer,
e.byteOffset,e.byteLength);(n.getUint32(0,!0)!==1179937895||n.getUint32(4,!0)!==2||n.getUint32(8,!0)!==e.byteLength)&&D(
"GLB header");const i=n.getUint32(12,!0);(!i||i%4||i>ae.jsonBytes||20+i+8>e.byteLength||n.getUint32(16,!0)!==1313821514)&&
D("JSON chunk");let o;try{o=JSON.parse(Tf.decode(e.subarray(20,20+i)))}catch{D("JSON syntax")}const s=20+i,a=n.getUint32(
s,!0);(a%4||n.getUint32(s+4,!0)!==5130562||s+8+a!==e.byteLength)&&D("BIN chunk"),q(o,["asset","scene","scenes","nodes","\
meshes","buffers","bufferViews","accessors","materials","images","textures","samplers"]),q(o.asset,["version","generator"]),
(o.asset.version!=="2.0"||o.asset.generator!==void 0&&(typeof o.asset.generator!="string"||o.asset.generator.length>128))&&
D("asset version"),o.scene!==0&&D("scene");const d=q(Ne(o.scenes),["nodes"]);dr(d.nodes,[0])||D("scene nodes"),q(Ne(o.nodes),
["mesh"]).mesh!==0&&D("node mesh");const h=q(Ne(o.meshes),["primitives"]),g=q(Ne(h.primitives),["attributes","indices","\
mode","material"]);g.mode!==void 0&&g.mode!==4&&D("only triangles are supported"),q(g.attributes,["POSITION","NORMAL","C\
OLOR_0","TEXCOORD_0","TANGENT"]),!r&&(g.attributes.TEXCOORD_0!==void 0||g.attributes.TANGENT!==void 0||o.images!==void 0||
o.textures!==void 0||o.samplers!==void 0)&&D("textured profile requires a compatible peer"),Object.hasOwn(g.attributes,"\
POSITION")||D("missing positions");const u=q(Ne(o.buffers),["byteLength"]);te(u.byteLength,1,a),a-u.byteLength>3&&D("BIN\
 padding"),(!Array.isArray(o.bufferViews)||o.bufferViews.length<2||o.bufferViews.length>6+De.count||!Array.isArray(o.accessors)||
o.accessors.length<2||o.accessors.length>6)&&D("accessor count");const m=[];for(const C of o.bufferViews){q(C,["buffer",
"byteOffset","byteLength","target"]),(C.buffer!==0||C.target!==void 0&&![34962,34963].includes(C.target))&&D("buffer vie\
w");const B=te(C.byteOffset??0,0,u.byteLength),M=te(C.byteLength,1,u.byteLength-B);B%4&&D("buffer alignment"),m.some(([O,
_])=>B<_&&B+M>O)&&D("overlapping buffer views"),m.push([B,B+M])}const b=new Set,v=new Set;function y(C,B){te(C,0,o.accessors.
length-1),b.has(C)&&D("reused accessor"),b.add(C);const M=q(o.accessors[C],["bufferView","byteOffset","componentType","c\
ount","type","min","max"]);te(M.bufferView,0,o.bufferViews.length-1),v.has(M.bufferView)&&D("reused buffer view"),v.add(
M.bufferView);const O=B==="indices"?1:B==="uvs"?2:B==="tangents"||B==="colors"&&M.type==="VEC4"?4:3;(M.type!==(O===1?"SC\
ALAR":`VEC${O}`)||(B==="indices"?![5123,5125].includes(M.componentType):M.componentType!==5126))&&D("accessor format");const _=M.
componentType===5123?2:4,z=te(M.count,3,B==="indices"?ae.triangles*3:ae.vertices),G=m[M.bufferView],ue=te(M.byteOffset??
0,0,G[1]-G[0]);(ue%_||ue+z*O*_!==G[1]-G[0])&&D("accessor byte range");const X=new DataView(e.buffer,e.byteOffset+s+8+G[0]+
ue,z*O*_),Te=M.componentType===5126?ce=>X.getFloat32(ce*4,!0):M.componentType===5125?ce=>X.getUint32(ce*4,!0):ce=>X.getUint16(
ce*2,!0);return{entry:M,count:z,components:O,get:Te}}const c=y(g.attributes.POSITION,"positions"),f={min:[1/0,1/0,1/0],max:[
-1/0,-1/0,-1/0]};for(let C=0;C<c.count*3;C++){const B=c.get(C);(!Number.isFinite(B)||Math.abs(B)>ae.coordinate)&&D("nonf\
inite or excessive position"),f.min[C%3]=Math.min(f.min[C%3],B),f.max[C%3]=Math.max(f.max[C%3],B)}for(const C of["min","\
max"])dr(nn(c.entry[C],3),f[C])||D("position bounds mismatch");f.min.every((C,B)=>C===f.max[B])&&D("empty geometry");for(const[
C,B]of[["NORMAL","normals"],["COLOR_0","colors"],["TEXCOORD_0","uvs"],["TANGENT","tangents"]]){if(!Object.hasOwn(g.attributes,
C))continue;const M=y(g.attributes[C],B);(M.count!==c.count||M.entry.min!==void 0||M.entry.max!==void 0)&&D("attribute c\
ount or bounds");for(let O=0;O<M.count*M.components;O++){const _=M.get(O);(!Number.isFinite(_)||_<(["colors","uvs"].includes(
B)?0:-1.001)||_>(["colors","uvs"].includes(B)?1:1.001))&&D("invalid attribute value")}if(B==="normals"||B==="tangents")for(let O=0;O<
M.count;O++){const _=O*M.components,z=Math.hypot(M.get(_),M.get(_+1),M.get(_+2));Math.abs(z-1)>.001&&D("normal or tangen\
t must be a unit vector"),B==="tangents"&&![-1,1].includes(M.get(_+3))&&D("tangent handedness")}}g.attributes.TANGENT!==
void 0&&g.attributes.NORMAL===void 0&&D("tangent requires normals");const S=y(g.indices,"indices");(S.count%3||S.entry.min!==
void 0||S.entry.max!==void 0)&&D("triangle indices");for(let C=0;C<S.count;C++){const B=S.get(C);B>=c.count&&D("index ou\
tside positions"),S.entry.componentType===5123&&B===65535&&D("primitive restart index")}const E=new Set,I=new Set,T=new Set;
function A(C,B=!1){q(C,B?["index","texCoord","scale"]:["index","texCoord"]),(!Array.isArray(o.textures)||C.texCoord!==void 0&&
C.texCoord!==0||g.attributes.TEXCOORD_0===void 0)&&D("texture coordinates"),te(C.index,0,o.textures.length-1),E.add(C.index),
B&&(g.attributes.NORMAL===void 0||C.scale!==void 0&&(!Number.isFinite(C.scale)||C.scale<0||C.scale>1))&&D("normal textur\
e")}if(o.materials!==void 0){const C=q(Ne(o.materials),["pbrMetallicRoughness","doubleSided","alphaMode","normalTexture"]);
C.doubleSided!==void 0&&typeof C.doubleSided!="boolean"&&D("material"),C.alphaMode!==void 0&&C.alphaMode!=="OPAQUE"&&D("\
material alpha");const B=q(C.pbrMetallicRoughness,["baseColorFactor","metallicFactor","roughnessFactor","baseColorTextur\
e","metallicRoughnessTexture"]);B.baseColorFactor!==void 0&&nn(B.baseColorFactor,4,0,1);for(const M of["metallicFactor",
"roughnessFactor"])B[M]!==void 0&&(!Number.isFinite(B[M])||B[M]<0||B[M]>1)&&D("material factor");g.material!==0&&D("mate\
rial index");for(const M of["baseColorTexture","metallicRoughnessTexture"])B[M]!==void 0&&A(B[M]);C.normalTexture!==void 0&&
A(C.normalTexture,!0)}else g.material!==void 0&&D("missing material");for(const C of["textures","images","samplers"])o[C]!==
void 0&&(!Array.isArray(o[C])||o[C].length<1||o[C].length>De.count)&&D("texture table count");for(const C of o.textures??
[])q(C,["source","sampler"]),te(C.source,0,(((R=o.images)==null?void 0:R.length)??0)-1),I.add(C.source),C.sampler!==void 0&&
(te(C.sampler,0,(((w=o.samplers)==null?void 0:w.length)??0)-1),T.add(C.sampler));for(const C of o.samplers??[]){q(C,["ma\
gFilter","minFilter","wrapS","wrapT"]);for(const B of["magFilter","minFilter","wrapS","wrapT"])C[B]!==void 0&&!(B.startsWith(
"wrap")?[33071,33648,10497]:B==="magFilter"?[9728,9729]:[9728,9729,9984,9985,9986,9987]).includes(C[B])&&D("texture samp\
ler")}let x=0;for(const C of o.images??[]){q(C,["bufferView","mimeType"]),te(C.bufferView,0,o.bufferViews.length-1),(v.has(
C.bufferView)||o.bufferViews[C.bufferView].target!==void 0)&&D("image buffer view"),v.add(C.bufferView);const B=m[C.bufferView],
M=s+8,O=e.subarray(M+B[0],M+B[1]),_=ti(O,C.mimeType);x+=_.pixels,x>De.pixels&&D("texture pixel limit"),t.push({..._,data:O})}
return(E.size!==(((N=o.textures)==null?void 0:N.length)??0)||I.size!==(((U=o.images)==null?void 0:U.length)??0)||T.size!==
(((k=o.samplers)==null?void 0:k.length)??0))&&D("unused texture resource"),(b.size!==o.accessors.length||v.size!==o.bufferViews.
length)&&D("unused accessor"),{vertexCount:c.count,triangleCount:S.count/3,bounds:f}}function Of(e,t={}){(!((e==null?void 0:
e.data)instanceof Uint8Array)||e.data.byteLength<32||e.data.byteLength>ae.byteLength)&&D("binary byte limit");const r=new Uint8Array(
e.data),n={format:"glb",mimeType:If,byteLength:r.byteLength,sha256:Vn(Hn(r)),...Cf(r,[],t)};for(const i of Object.keys(n))
e[i]!==void 0&&!dr(e[i],n[i])&&D(`${i} mismatch`);return{...n,data:r}}function Lu({positions:e,indices:t,normals:r,colors:n,
uvs:i,tangents:o,textures:s,roughness:a=1,metallic:d=0}){(!(e instanceof Float32Array)||e.length%3||!(t instanceof Uint16Array||
t instanceof Uint32Array)||t.length%3)&&D("geometry arrays");const l=te(e.length/3,3,ae.vertices);te(t.length/3,1,ae.triangles),
r!==void 0&&(!(r instanceof Float32Array)||r.length!==e.length)&&D("normal array"),n!==void 0&&(!(n instanceof Float32Array)||
![l*3,l*4].includes(n.length))&&D("color array"),i!==void 0&&(!(i instanceof Float32Array)||i.length!==l*2)&&D("UV array"),
o!==void 0&&(!(o instanceof Float32Array)||o.length!==l*4)&&D("tangent array"),s!==void 0&&q(s,["baseColor","normal","me\
tallicRoughness"]);const h={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let w=0;w<e.length;w++)h.min[w%3]=Math.min(h.min[w%
3],e[w]),h.max[w%3]=Math.max(h.max[w%3],e[w]);const g=[],u=[],m=[],b={};let v=0;const y=(w,N,U,k={})=>{const C=u.length,
B=new Uint8Array(w.byteLength),M=new DataView(B.buffer);for(let O=0;O<w.length;O++)w instanceof Float32Array?M.setFloat32(
O*4,w[O],!0):w instanceof Uint32Array?M.setUint32(O*4,w[O],!0):M.setUint16(O*2,w[O],!0);return g.push({offset:v,data:B}),
m.push({buffer:0,byteOffset:v,byteLength:B.byteLength,target:U}),u.push({bufferView:C,componentType:w instanceof Float32Array?
5126:w instanceof Uint32Array?5125:5123,count:N==="SCALAR"?w.length:l,type:N,...k}),v+=Math.ceil(B.byteLength/4)*4,C};b.
POSITION=y(e,"VEC3",34962,h),r!==void 0&&(b.NORMAL=y(r,"VEC3",34962)),n!==void 0&&(b.COLOR_0=y(n,n.length===l*4?"VEC4":"\
VEC3",34962)),i!==void 0&&(b.TEXCOORD_0=y(i,"VEC2",34962)),o!==void 0&&(b.TANGENT=y(o,"VEC4",34962));const c=y(t,"SCALAR",
34963),f={pbrMetallicRoughness:{metallicFactor:d,roughnessFactor:a},doubleSided:!0},S=[],E=[];for(const w of["baseColor",
"normal","metallicRoughness"]){if((s==null?void 0:s[w])===void 0)continue;const N=q(s[w],["data","mimeType"]);ti(N.data,
N.mimeType);const U=S.length;S.push({bufferView:m.length,mimeType:N.mimeType}),E.push({source:U,sampler:0}),m.push({buffer:0,
byteOffset:v,byteLength:N.data.byteLength}),g.push({offset:v,data:N.data}),v+=Math.ceil(N.data.byteLength/4)*4,w==="norm\
al"?f.normalTexture={index:U}:f.pbrMetallicRoughness[`${w}Texture`]={index:U}}const I=vf.encode(JSON.stringify({asset:{version:"\
2.0",generator:"PeerCompute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:b,
indices:c,mode:4,material:0}]}],materials:[f],buffers:[{byteLength:v}],bufferViews:m,accessors:u,...S.length?{images:S,textures:E,
samplers:[{magFilter:9729,minFilter:9729}]}:{}})),T=Math.ceil(I.byteLength/4)*4,A=28+T+v;(A>ae.byteLength||T>ae.jsonBytes)&&
D("encoded byte limit");const x=new Uint8Array(A),R=new DataView(x.buffer);R.setUint32(0,1179937895,!0),R.setUint32(4,2,
!0),R.setUint32(8,A,!0),R.setUint32(12,T,!0),R.setUint32(16,1313821514,!0),x.fill(32,20,20+T),x.set(I,20),R.setUint32(20+
T,v,!0),R.setUint32(24+T,5130562,!0);for(const w of g)x.set(w.data,28+T+w.offset);return Of({data:x})}new TextEncoder;new TextEncoder;
new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextDecoder;
new TextEncoder;new TextDecoder;const Bt="peercompute.capabilities.workload-sizing.v1",Bf=Object.freeze({mobile:.4,laptop:1,
workstation:2,cluster:4}),Nf=Object.freeze({software:.2,low:.45,mid:1,high:1.75,workstation:3});function ne(e,t,r){return Math.
min(r,Math.max(t,e))}function L(e,t,r=1,n=Number.MAX_SAFE_INTEGER){const i=Math.floor(Number(e));return Number.isFinite(
i)?ne(i,r,n):t}function me(e,t,r=0,n=Number.MAX_SAFE_INTEGER){const i=Number(e);return Number.isFinite(i)?ne(i,r,n):t}function Ie(e,t=1){
const r=Math.max(1,Math.floor(t));return Math.max(r,Math.round(e/r)*r)}function Nt(e={},t=null){var s;const r=((s=e==null?
void 0:e.webgpu)==null?void 0:s.limits)||(e==null?void 0:e.gpuLimits)||{},n=L((t==null?void 0:t.maxBufferSize)??r.maxBufferSize,
null,1),i=L((t==null?void 0:t.maxStorageBufferBindingSize)??r.maxStorageBufferBindingSize,null,1),o=n!=null&&i!=null?Math.
min(n,i):i??n??null;return{maxBufferSize:n,maxStorageBufferBindingSize:i,singleBufferLimitBytes:o,maxComputeWorkgroupsPerDimension:L(
r.maxComputeWorkgroupsPerDimension,65535,1),maxComputeInvocationsPerWorkgroup:L(r.maxComputeInvocationsPerWorkgroup,256,
1),maxTextureDimension2D:L(r.maxTextureDimension2D,null,1),maxTextureDimension3D:L(r.maxTextureDimension3D,null,1)}}function Mt(e={},t=null,r=null){
const n=(e==null?void 0:e.planningBudgets)||{},i=(t==null?void 0:t.workingSetGuidance)||{},o=i.cpuBudgetMB??n.memoryBudgetMB??
(e==null?void 0:e.memoryBudgetMB)??1024,s=i.gpuBudgetMB??n.gpuMemoryBudgetMB??(e==null?void 0:e.gpuMemoryBudgetMB)??512,
a=me(r==null?void 0:r.cpuBytes,o*1024*1024,0),d=me(r==null?void 0:r.gpuBytes,s*1024*1024,0);return{cpuBudgetBytes:a,gpuBudgetBytes:d}}
function Rt(e={},t=null,r=null){var o,s;const n=me((r==null?void 0:r.budgetScale)??((o=e==null?void 0:e.planningBudgets)==
null?void 0:o.budgetScale),1,.05,16);if(t!=null&&t.performanceClass){const a=Nf[t.performanceClass]??1,d=(s=t.scores)==null?
void 0:s.overallScore,l=Number.isFinite(d)?ne(.5*a+.5*d,.15,6):a;return ne(l*n,.1,16)}const i=(r==null?void 0:r.tier)||(e==
null?void 0:e.tier)||"laptop";return ne((Bf[i]??1)*n,.1,16)}function _t(e={},t=null,r=null){var s;const n=me((s=e==null?
void 0:e.display)==null?void 0:s.devicePixelRatio,1,.5,8),i=me(r==null?void 0:r.dprCap,null,1,4);if(i!=null)return Math.
min(n,i);const o=(t==null?void 0:t.performanceClass)||null;return o==="software"||o==="low"?Math.min(n,1.25):(e==null?void 0:
e.tier)==="mobile"?Math.min(n,1.5):Math.min(n,2)}function Mf(e={},{capabilities:t={},benchmark:r=null,overrides:n=null,budgets:i=null}={}){
var O;const o=L(e.minCount,1,1),s=L(e.maxCount,1e6,o),a=L(e.baseCount,o,o,s),d=e.requestedCount!=null?L(e.requestedCount,
a,o,s):null,l=L(e.multiple,1,1),h=L(e.strideBytes,0,0),g=L(e.buffersCount,1,1),u=L(e.storageBufferBytesPerItem,h,0),m=h*
g,b=me(e.memoryFraction,.5,.01,1),v=e.gpuRequired!==!1,y=L(e.workgroupSize,64,1),c=L(e.dispatchDimensions,1,1,3),f=String(
e.complexity||"O(N)"),S=Nt(t,i),E=Mt(t,r,i),I=Rt(t,r,n),T=((O=t==null?void 0:t.webgpu)==null?void 0:O.available)!==!1,A=[],
x={configuredMax:s,gpuSingleBufferMax:s,gpuDispatchMax:s,gpuWorkingSetMax:s,cpuMemoryMax:s,complexityMax:s};if(v&&u>0&&S.
singleBufferLimitBytes!=null&&(x.gpuSingleBufferMax=Math.max(o,Math.floor(S.singleBufferLimitBytes*.9/u))),v&&c===1&&(x.
gpuDispatchMax=Math.max(o,S.maxComputeWorkgroupsPerDimension*y)),v&&m>0&&E.gpuBudgetBytes>0&&(x.gpuWorkingSetMax=Math.max(
o,Math.floor(E.gpuBudgetBytes*b/m))),m>0&&E.cpuBudgetBytes>0&&(x.cpuMemoryMax=Math.max(o,Math.floor(E.cpuBudgetBytes*b/m))),
f==="O(N^2)"){const _=L(e.quadraticBaseCap,2048,o,s);x.complexityMax=Math.max(o,Math.floor(_*Math.sqrt(I)))}let R=s,w="n\
one";for(const[_,z]of Object.entries(x))z<R&&(R=z,w=_);R=Math.max(o,R);let N;d!=null?N=d:f==="O(N^2)"?N=Ie(a*Math.sqrt(I),
l):f==="O(N log N)"?N=Ie(a*Math.pow(I,.85),l):N=Ie(a*I,l);const U=ne(Ie(N,l),o,R),k=(d??N)>R;k&&A.push(`Clamped to ${R} \
by ${w}`),v&&!T&&A.push("Hardware WebGPU is unavailable");const C=L(e.maxSubSteps,8,1,64),B=L(e.baseSubSteps,1,1,C),M=ne(
Math.round(B*ne(I,.5,2)),1,C);return{schema:Bt,kind:"count",name:e.name||"items",count:U,minCount:o,maxCount:s,effectiveMaxCount:R,
clamped:k,limitingFactor:k?w:"none",ceilings:x,perfScale:Number(I.toFixed(3)),recommendedSubSteps:M,recommendedDpr:_t(t,
r,n),estimatedSingleBufferBytes:U*u,estimatedTotalBytes:U*m,reasons:A}}function Rf(e={},{capabilities:t={},benchmark:r=null,
overrides:n=null,budgets:i=null}={}){var B;const o=(M,O)=>{if(Array.isArray(M)&&M.length===3)return M.map((z,G)=>L(z,O[G],
1));if(M&&typeof M=="object"&&("x"in M||"y"in M||"z"in M))return[L(M.x,O[0],1),L(M.y,O[1],1),L(M.z,O[2],1)];const _=L(M,
O[0],1);return[_,_,_]},s=o(e.minDim??8,[8,8,8]),a=o(e.maxDim??256,[256,256,256]),d=o(e.baseDim??32,[32,32,32]),l=e.requestedDim!=
null?o(e.requestedDim,d):null,h=L(e.step,1,1),g=L(e.cellStrideBytes,32,1),u=L(e.buffersCount,1,1),m=me(e.memoryFraction,
.4,.01,1),b=L(e.workgroupSize,64,1),v=L(e.dispatchDimensions,1,1,3),y=e.webgl3dTexture===!0,c=Nt(t,i),f=Mt(t,r,i),S=Rt(t,
r,n),E=[];let I=Math.max(...a);y&&((B=t==null?void 0:t.webgl)!=null&&B.max3DTextureSize)?I=Math.min(I,t.webgl.max3DTextureSize):
e.webgpu3dTexture&&c.maxTextureDimension3D&&(I=Math.min(I,c.maxTextureDimension3D));let T=a[0]*a[1]*a[2],A="none";const x=(M,O)=>{
Number.isFinite(M)&&M>0&&M<T&&(T=Math.floor(M),A=O)};!y&&c.singleBufferLimitBytes!=null&&x(c.singleBufferLimitBytes*.9/g,
"gpuSingleBufferMax"),!y&&v===1&&x(c.maxComputeWorkgroupsPerDimension*b,"gpuDispatchMax"),f.gpuBudgetBytes>0&&!y&&x(f.gpuBudgetBytes*
m/(g*u),"gpuWorkingSetMax"),y&&f.cpuBudgetBytes>0&&x(f.cpuBudgetBytes*m/Math.max(4,g*u),"cpuMemoryMax");const R=Math.cbrt(
S);let w=l?[...l]:d.map((M,O)=>ne(Ie(M*R,h),s[O],a[O])),N=!1;w=w.map((M,O)=>{const _=Math.min(a[O],I);return M>_?(N=!0,A===
"none"&&(A="max3DTextureSize"),ne(Math.floor(_/h)*h,s[O],_)):ne(M,s[O],_)});const U=s[0]*s[1]*s[2],k=Math.max(U,T);let C=w[0]*
w[1]*w[2];if(C>k){N=!0;const M=Math.cbrt(k/C);for(w=w.map((O,_)=>{const z=Math.floor(O*M/h)*h;return ne(Math.max(h,z),s[_],
Math.min(a[_],I))});w[0]*w[1]*w[2]>k;){let O=0;for(let _=1;_<3;_+=1)w[_]-s[_]>w[O]-s[O]&&(O=_);if(w[O]<=s[O])break;w[O]=
Math.max(s[O],w[O]-h)}C=w[0]*w[1]*w[2],E.push(`Clamped 3D grid to ${w.join("x")} (${C} cells) by ${A}`)}return{schema:Bt,
kind:"grid3d",name:e.name||"grid3d",dim:w,x:w[0],y:w[1],z:w[2],cellCount:C,effectiveMaxCells:k,clamped:N,limitingFactor:N?
A:"none",estimatedSingleBufferBytes:C*g,estimatedTotalBytes:C*g*u,recommendedDpr:_t(t,r,n),reasons:E}}function _f(e={},{
capabilities:t={},benchmark:r=null,overrides:n=null,budgets:i=null}={}){var R;const o=L(e.minWidth??e.minDim,16,1),s=L(e.
maxWidth??e.maxDim,2048,o),a=L(e.baseWidth??e.baseDim,256,o,s),d=me(e.aspectRatio,1,.1,10),l=L(e.step,1,1),h=L(e.cellStrideBytes,
16,1),g=L(e.buffersCount,1,1),u=me(e.memoryFraction,.35,.01,1),m=e.gpuRequired!==!1,b=Nt(t,i),v=Mt(t,r,i),y=Rt(t,r,n),c=[];
let f=s,S="none";if(m&&b.maxTextureDimension2D&&b.maxTextureDimension2D<f&&(f=b.maxTextureDimension2D,S="maxTextureDimen\
sion2D"),!m&&((R=t==null?void 0:t.webgl)!=null&&R.maxTextureSize)&&t.webgl.maxTextureSize<f&&(f=t.webgl.maxTextureSize,S=
"webglMaxTextureSize"),m&&b.singleBufferLimitBytes!=null){const w=Math.floor(b.singleBufferLimitBytes*.9/h),N=Math.floor(
Math.sqrt(w/d));N<f&&(f=N,S="gpuSingleBufferMax")}const E=m?v.gpuBudgetBytes:v.cpuBudgetBytes;if(E>0){const w=Math.floor(
E*u/(h*g)),N=Math.floor(Math.sqrt(w/d));N<f&&(f=N,S=m?"gpuWorkingSetMax":"cpuMemoryMax")}f=Math.max(o,f);const I=e.requestedWidth!=
null?L(e.requestedWidth,a,o,s):Ie(a*Math.sqrt(y),l),T=ne(Ie(I,l),o,f),A=Math.max(1,Ie(T*d,l)),x=I>f;return x&&c.push(`Cl\
amped 2D grid width to ${T} by ${S}`),{schema:Bt,kind:"grid2d",name:e.name||"grid2d",width:T,height:A,cellCount:T*A,clamped:x,
limitingFactor:x?S:"none",estimatedTotalBytes:T*A*h*g,recommendedDpr:_t(t,r,n),reasons:c}}function Df(e={},{capabilities:t={},
benchmark:r=null,overrides:n=null,budgets:i=null}={}){var y,c;const o=Array.isArray(e.presets)?e.presets:[];if(!o.length)
throw new TypeError("selectQualityPreset requires a non-empty presets array");const s=Rt(t,r,n),a=Mt(t,r,i),d=Nt(t,i),l={
mobile:0,laptop:1,workstation:2,cluster:3},h={software:0,low:1,mid:2,high:3,workstation:4},g=l[(n==null?void 0:n.tier)||
(t==null?void 0:t.tier)||"laptop"]??1,u=(r==null?void 0:r.performanceClass)!=null?h[r.performanceClass]??2:null;let m=o[0],
b=0;const v=[];for(let f=0;f<o.length;f+=1){const S=o[f];S.minTier&&(l[S.minTier]??0)>g||S.minPerformanceClass&&u!=null&&
(h[S.minPerformanceClass]??0)>u||Number.isFinite(S.minPerfScale)&&s<S.minPerfScale||S.requireWebGPU&&((y=t==null?void 0:
t.webgpu)==null?void 0:y.available)!==!0||S.requireWebGL2&&(t!=null&&t.webgl)&&t.webgl.webgl2!==!0||Number.isFinite(S.estimatedMemoryBytes)&&
a.cpuBudgetBytes>0&&S.estimatedMemoryBytes>a.cpuBudgetBytes||Number.isFinite(S.estimatedGpuBytes)&&a.gpuBudgetBytes>0&&S.
estimatedGpuBytes>a.gpuBudgetBytes||Number.isFinite(S.minBufferSizeBytes)&&d.singleBufferLimitBytes!=null&&S.minBufferSizeBytes>
d.singleBufferLimitBytes||Number.isFinite(S.required3DTextureSize)&&((c=t==null?void 0:t.webgl)!=null&&c.max3DTextureSize)&&
S.required3DTextureSize>t.webgl.max3DTextureSize||(m=S,b=f)}return b<o.length-1&&v.push(`Selected preset "${m.id||b}" fo\
r perfScale=${s.toFixed(2)}`),{schema:Bt,kind:"preset",name:e.name||"preset",presetId:m.id??String(b),presetIndex:b,preset:m,
perfScale:Number(s.toFixed(3)),recommendedDpr:_t(t,r,n),reasons:v}}function ku(e={},t={}){const r=String((e==null?void 0:
e.kind)||"count").trim().toLowerCase();return r==="grid3d"?Rf(e,t):r==="grid2d"?_f(e,t):r==="preset"?Df(e,t):Mf(e,t)}const Pe="\
Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Fe="5ce3fd841676adf2c1a10d7193637d46007e88f7",on=[{path:".gitat\
tributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1\
e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{
path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8d\
e2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"ar\
tifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,
gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f\
892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"\
tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,
gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Uf="This catalog supports verified storage and distribution. Ex\
ecution is admitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and reso\
urce checks.";function ri(e){for(const t of Object.values(e))t&&typeof t=="object"&&ri(t);return Object.freeze(e)}const Lf=ri(
{"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Pe,
revision:Fe,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"\
unavailable",executionReason:Uf},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Pe}/blob/${Fe}/LICENSE`,
notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Pe,revision:Fe,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Pe}/blob/${Fe}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Pe,revision:Fe},weightBytes:14199740480,
totalBytes:on.reduce((e,t)=>e+t.size,0),files:on}});function ni(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.
values(e).forEach(ni),Object.freeze(e)),e}const kf=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
an GGUF Q5_K_M, experimental text)",repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae\
104ddf9fff92031a73d8",dtype:"q5_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The\
 publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refu\
sal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Ev\
il-Q5_K_M.gguf",size:6467969824,sha256:"bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README\
.md",size:4013,sha256:"825f21663874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7\
274149e70cfd0dc7940d87",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104d\
df9fff92031a73d8",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a55\
82c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evi\
l-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e4\
39639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{
repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},
{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"0\
1597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689\
a9d2da3897eae104ddf9fff92031a73d8",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwe\
n3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Clau\
de-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{
repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c71\
25009808"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; no\
t a guarantee of refusal-free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidA\
U source. The browser adapter currently runs text only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UN\
CENSORED.Q4_K_M.gguf",size:5627045888,sha256:"b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"\
README.md",size:5730,sha256:"eea5e514740c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e\
17cf35bea52a3a2d74e42b14a24a",source:{repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-\
GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"\
0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",
source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd\
7cda7c7125009808",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a55\
82c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"\
c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 \
9B Evil (mradermacher GGUF Q8_0, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99f\
db7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"\
b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",
notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. \
Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qw\
en3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},
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
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-m\
radermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Q\
wen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bo\
wmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,
behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile resp\
onses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context beh\
avior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25\
fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9\
b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwe\
n3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",
size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef428\
5739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed01\
5cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1\
e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"\
b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65\
960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmansl\
ayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,
sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e627395833067\
30adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"\
EVALUATION.md"}}]}],zf=ni(Object.fromEntries(kf.map(e=>{const{dtype:t,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=e,
a=o.files.find(d=>d.path==="LICENSE").source;return[o.id,{...o,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+a.repository+"/blob/"+a.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:o.repository,revision:o.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+o.repository+"/blob/"+o.revision+"/README.md",sourceModel:{...r,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:n,
nextnPredictLayers:i,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:o.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:t,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:o.repository,revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.
files.reduce((d,l)=>d+l.size,0)}]})));function Tr(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).
forEach(Tr),Object.freeze(e)),e}const be="Tsotchke-Corporation",ii=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${be}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",architecture:"qwen3_moe",quantizationTypes:["F32","Q8_0","\
Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-Coder-30B-A3B-Instruct-abliterated",revision:"b84c58d52ac4\
4041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimental lossy mixed quantization of an abliterated parent. Beh\
avioral quality, SAE certification and runtime qualification are untested.",files:[{path:".gitattributes",size:1609,gitBlobSha1:"\
3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LICENSE",size:11343,gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea61\
8ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ece140e83416522e0d00b53880e8bb13"},{path:"Qwen3-Coder-30B-A3B-GeoRefi\
ne-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51"},
{path:"README.md",size:2765,gitBlobSha1:"00227290350d0484631d06756736f4dff2e8bd66"},{path:"artifact-manifest.json",size:7659,
gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6e5d05"},{path:"chat_template.jinja",size:6853,gitBlobSha1:"3656cd64ff2fc\
c6ae59312eb87a709e0aa25b2eb"},{path:"config.json",size:1065,gitBlobSha1:"5288c67c42b574d39f790e6bf8836f57ec477483"},{path:"\
generation_config.json",size:235,gitBlobSha1:"f1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"tokenizer_config.json",size:5644,
gitBlobSha1:"b2cbe86ae45a1274c9b93ec060466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,gitBlobSha1:"57027eb4562807\
80650ef6bc44524b396734cbcf"}]},{id:"qwen3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_X\
S GGUF, candidate text)",repository:`${be}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
671898b95",architecture:"qwen3_5_moe",quantizationTypes:["F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],sourceModel:{repository:"e\
ricpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-bf16",revision:"f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed"},publisherLimitations:"\
The publisher records a failed coding-quality gate and no complete capability certificate. Its internal qLLM Metal gguf-\
c20 runtime is not a public portable-runtime qualification; a public pinned clean-machine recipe remains unverified. Thi\
s is not the GeoRefine TBE codec.",files:[{path:".gitattributes",size:1699,gitBlobSha1:"f44e4e63e69c8b9a20797fd820049ea2\
7bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,gitBlobSha1:"3cb693fce32249c21d7a621060df41dbf5df64a9"},{path:"LICENSE",
size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:465,gitBlobSha1:"4852a35fe237eb43\
35504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,sha256:"027f3c99a065\
fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96"},{path:"README.md",size:4914,gitBlobSha1:"601a361b4a8308e912174981\
0fb103b644c581c1"},{path:"artifact-manifest.json",size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a008315f8a1a9f"},{path:"\
config.json",size:3148,gitBlobSha1:"09981f690fa954e74c4ae3d66163bb68435d14ca"},{path:"generation_config.json",size:243,gitBlobSha1:"\
be05abc6b17ea7880b71c67d31f7264f92c34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"1838f3b7f5e64b0f32abbd9\
8181ea3ca8b3abfbc"},{path:"tokenizer.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19f\
f992d9ac7"},{path:"tokenizer_config.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec"},{path:"veri\
fy_c20.py",size:886,gitBlobSha1:"2ba7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-georefine-l162-gguf",name:"\
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${be}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
4268ff007ddb5e8813a391fbdd3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32","Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{
repository:"huihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f6c238ce1e5b70008612ae42cdd"},publisherLimitations:"\
Experimental lossy mixed quantization; behavioral quality and runtime qualification are untested. Q4_K_M_CUSTOM labels a\
 custom allocation of standard GGUF tensor types, not a custom codec or the standard llama.cpp Q4_K_M allocation recipe.\
 The inherited Q8_0 header label does not describe the tensor mix.",files:[{path:".gitattributes",size:1694,gitBlobSha1:"\
f41c1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},{path:"Qwen3.8-27B-GeoRefine-L162-\
abl-MIXED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd"},
{path:"README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},{path:"artifact-manifest.json",size:5897,
gitBlobSha1:"fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d7\
0d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"\
generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}]}],Pf=Tr(Object.fromEntries(ii.map(e=>{const{architecture:t,quantizationTypes:r,sourceModel:n,
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
reduce((s,a)=>s+a.size,0)}]})));Tr({organization:be,sourceUrl:`https://huggingface.co/${be}`,checkedAt:"2026-11-04",repositories:[
...ii.map(({id:e,repository:t,revision:r})=>({repository:t,revision:r,catalogId:e,format:"GGUF",codecRequired:!1})),{repository:`${be}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${be}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${be}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${be}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const st="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",at="036d46331b5ef633654ff516e739\
73e81c8eca79",sn="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",an=`https://huggingface.co/${st}/blob/${at}/README.\
md`,jt=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59b\
b8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028\
c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function oi(e){return e&&typeof e=="object"&&
!Object.isFrozen(e)&&(Object.values(e).forEach(oi),Object.freeze(e)),e}const Ff=oi({[sn]:{id:sn,name:"MiMo V2.6 Distill \
Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:st,revision:at,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"\
User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolat\
ion, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher\
-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"\
MIT",sourceUrl:an,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked \
parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:st,revision:at,format:"GGUF",
metadataCheckedAt:"2026-11-10",modelCardUrl:an,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"\
1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion i\
nput revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for t\
hese GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 o\
nly; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"\
working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not suppl\
ied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",
task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:st,revision:at},weightBytes:jt[0].
size,totalBytes:jt.reduce((e,t)=>e+t.size,0),files:jt}}),ct="TrevorJS/gemma-4-12B-it-uncensored-GGUF",dt="d878d412b001a7\
20b9a62eaac432d00aac9d1b4f",cn="gemma4-12b-uncensored-q4-k-m-gguf",Gf=`https://huggingface.co/${ct}/blob/${dt}/README.md`,
dn="TrevorJS/gemma-4-12B-it-uncensored",fn="159eb7a8a04efb31ed43887e4732ff3edccff8ac",Wt=[{path:"gemma-4-12B-it-uncensor\
ed-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README\
.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961\
e18b9a380366eb9ed3d6ee"}];function si(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(si),
Object.freeze(e)),e}const ai=si({[cn]:{id:cn,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:ct,revision:dt,
status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this\
 exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires sh\
ader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publi\
sher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apa\
che-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. Th\
e conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENS\
E file."},provenance:{repository:ct,revision:dt,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:Gf,sourceModel:{
repository:dn,revision:fn,modelCardUrl:`https://huggingface.co/${dn}/blob/${fn}/README.md`,modelCardBytes:4929,modelCardSha256:"\
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
shader-f16"],repository:ct,revision:dt},weightBytes:Wt[0].size,totalBytes:Wt.reduce((e,t)=>e+t.size,0),files:Wt}});function ci(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(ci),Object.freeze(e)),e}const fr=ci({id:"ge\
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
ur=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:fr.size,sha256:fr.sha256}),Ve=ai["gemma4-12b-uncensored-q4-\
k-m-gguf"],un="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",ln=[...Ve.files,ur],Ge=fr;function di(e){return e&&typeof e==
"object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(di),Object.freeze(e)),e}const $f=di({[un]:{...Ve,id:un,name:"Ge\
mma 4 12B Uncensored (Q4_K_M, vision + audio)",files:ln,description:"Image and audio understanding with text replies. Re\
uses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading thi\
s package to avoid keeping two 12B models in GPU memory.",capabilities:{...Ve.capabilities,executionStatus:"tested",executionReason:"\
Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained rel\
oad and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; \
speech synthesis uses a separate model."},model:{...Ve.model,modalities:["text","image","audio"],ggufMedia:{profile:"gem\
ma4-unified-v1",projectorPath:ur.path}},provenance:{...Ve.provenance,vision:"A separately derived Gemma4Unified companio\
n supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browse\
r execution remains unverified.",derivedArtifacts:[{path:ur.path,recipe:Ge.id,sourceRepository:Ge.source.repository,sourceRevision:Ge.
source.revision,sourcePath:"model.safetensors",sourceFileSha256:Ge.source.publisherSha256,sourceDigestVerification:"Publ\
isher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source c\
heckpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:Ge.converterRevision,outputType:"f16"},
processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config\
.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced \
explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understan\
ding and transcription are distinct from image or speech generation."},totalBytes:ln.reduce((e,t)=>e+t.size,0)}}),$e="ba\
rtowski/Qwen_Qwen3.5-0.8B-GGUF",qe="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Vt=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",
size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"\
499cb320f9f2f3963beee9d8b890046f825c6f5d"}],lr=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function fi(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(fi),Object.freeze(e)),e}const qf=Object.fromEntries(
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
LICENSE"}}]}].map(({architecture:e,...t})=>[t.id,fi({...t,status:"execution-candidate",format:"GGUF",capabilities:lr,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${t.files[2].source.repository}/blob/${t.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:t.
repository,revision:t.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${t.repository}\
/blob/${t.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:t.repository,revision:t.revision},weightBytes:t.files[0].size,totalBytes:t.files.reduce((r,n)=>r+n.size,
0)})])),zu=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:$e,revision:qe,status:"execution-candidate",format:"GGUF",capabilities:lr,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${$e}/blob/${qe}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:$e,revision:qe,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${$e}/blob/${qe}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:$e,revision:qe},weightBytes:Vt[0].size,totalBytes:Vt.
reduce((e,t)=>e+t.size,0),files:Vt},...qf,...zf,...Ff,...ai,...$f,...Pf,...Object.fromEntries(Object.entries(Lf).map(([e,
t])=>[e,{...t,status:"execution-candidate",capabilities:lr}]))}),Re=[{path:"u2netp.onnx",size:4574861,sha256:"309c846925\
8dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6a\
d64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"e447db65818dba51c001c1a5c9fc43\
c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07\
720c",path:"README.md"}}],hr={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817\
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
`},ui={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
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
`},li=[{path:"weights.bin",size:2285308688,sha256:"0e5c23c8c502492c0b4432006ac30f2d11b2a4c102a3bf9f21c2fcf094ddbffd",source:{
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
d2f58d27395b0be9c633671b439b4aac482549",path:"tets_indices.bin"}}],hn={spdx:"LicenseRef-Stability-AI-Community",sourceUrl:"\
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
"Trade Control Laws" means any applicable U.S. and non-U.S. export control and trade sanctions laws and regulations.`},Be={
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
671b439b4aac482549"}};Be.files=[...li,...Re];Be.totalBytes=Be.files.reduce((e,t)=>e+t.size,0);Be.weightBytes=li[0].size+
Re[0].size;Be.license={spdx:"LicenseRef-Stability-AI-Community AND Apache-2.0",sourceUrl:hn.sourceUrl,notice:"Powered by\
 Stability AI. Full model license and derivative notice are included. U2Net foreground weights use Apache-2.0.",components:[
{...hn,derivativeNotice:`This Stability AI Model is licensed under the Stability AI Community License, Copyright © Stabi\
lity AI Ltd. All Rights Reserved

Powered by Stability AI.

Stable Fast 3D originates with Stability AI. The WebGPU port is from
lyonsno/sf3d-webgpu, commit 86b7b68109434ffc33218f5fb697c7057c2518f9.

PeerCompute changed the port's asset loading, worker ownership, raw-image and
texture encoding interfaces, cancellation checks, and allocation cleanup.
The authored bounded artifact adapter streams the same checkpoint tensors and
retains the original WGSL kernels. The model weights themselves are unchanged.
See README.md for the exact integration changes and LICENSE.md for the license.
`},hr,ui,{spdx:"MIT AND BSD-3-Clause",sourceUrl:"https://www.npmjs.com/package/@kaminos/webgpu-inference-kit/v/0.1.60",notice:`\
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
`}]};function hi(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(hi),Object.freeze(e)),e}
const jf=hi({[Be.id]:Be});function Dt(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Dt),
Object.freeze(e)),e}const pi=Dt({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"\
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
weightBytes:484845236,totalBytes:484848869}}),Pu=Dt(Object.values(pi)),he=pi["triposr-q8-onnx"],Fu=Dt({"triposr-q8-onnx":{
...he,model:{...he.model,backgroundRemoval:"u2netp"},files:[...he.files,...Re],weightBytes:he.weightBytes+Re[0].size,totalBytes:he.
totalBytes+Re.reduce((e,t)=>e+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:he.license.sourceUrl,notice:"TripoS\
R © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full o\
riginal license texts are retained in this package.",components:[he.license,hr,ui]},provenance:{...he.provenance,foreground:{
repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielga\
tis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5\
b6ad64ba6578eba63f1ae07720c/README.md",sha256:Re[0].sha256,licenseUrl:hr.sourceUrl}},capabilities:{...he.capabilities,executionStatus:"\
tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShap\
er to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload res\
tored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{
checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained objec\
t reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a96\
3c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"\
/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,
unpinnedObserverCacheCollected:!0}}}},...jf}),St=1024**3,ve=Object.freeze({maximumBytes:8*St,maximumFileBytes:2*St-1,maximumConfigBytes:1024**
2,contextTokens:2048,legacyMaximumBytes:1536*1024**2}),bi=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),Wf=["qwen2","\
qwen3","llama"],pn=["phi","phi3","gemma","gemma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2",
"nemotron_h"],bn=["idefics3","smolvlm","qwen3_5"],Vf=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","gemma4",
"phi3","phi2","granite","starcoder2","olmo","olmo2","stablelm","nemotron","smollm3"],mi=Object.freeze([...[...Wf,...pn,...bn].
map(e=>{const t=bn.includes(e);return Object.freeze({runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:e,task:t?
"image-text-to-text":"text-generation",qualification:"candidate",modalities:Object.freeze(t?["text","image"]:["text"]),modules:Object.
freeze(t?["embed_tokens","vision_encoder","decoder_model_merged"]:["model"]),dtypes:e==="qwen3_5"?Object.freeze(["q4"]):
bi,requiresMemoryProfile:pn.includes(e),contextTokens:2048,maximumBytes:t?e==="qwen3_5"?2*St:ve.legacyMaximumBytes:ve.maximumBytes,
maximumFileBytes:ve.maximumFileBytes})}),...Vf.map(e=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,
modelArchitecture:e==="qwen35"?"qwen3_5":e,task:"text-generation",modalities:Object.freeze(["text"]),qualification:"cand\
idate"}))]);function Cr(e,t){return mi.find(r=>r.runtime===e&&r.architecture===t)??null}function Gu(e){return mi.filter(
t=>t.runtime===e)}function Hf(e){const t=typeof e=="string"?[e]:e&&typeof e=="object"&&!Array.isArray(e)?Object.values(e):
[];if(!t.length||t.length>16||t.some(r=>!bi.includes(r)))throw new Error("Unsupported ONNX precision");return t}function gi(e){
const t=(e==null?void 0:e["transformers.js_config"])??{},r=t.device_config??{};return Object.hasOwn(r,"webgpu")?{...t,...r.
webgpu}:{...t}}function Qf(e,t={}){const r=Hf(e),n=gi(t).kv_cache_dtype;return r.some(o=>["fp16","q4f16"].includes(o)||(typeof n==
"string"?n:n==null?void 0:n[o])==="float16")?["shader-f16"]:[]}function ee(e,t,r=1048576,n=1){if(!Number.isSafeInteger(e)||
e<n||e>r)throw new Error(`Invalid model memory dimension: ${t}`);return e}function Yf(e){const t=gi(e).free_dimension_overrides;
if(t&&(typeof t!="object"||Array.isArray(t)||Object.keys(t).length))throw new Error("Dynamic ONNX free_dimension_overrid\
es are not admitted by this memory profile");const r=e==null?void 0:e.model_type,n=Cr("transformers.js",r);if(!n)throw new Error(
"Unsupported model memory architecture");const i=n.task==="image-text-to-text"?e.text_config??e:e,o=i.layer_types??i.layers_block_type,
s=ee(i.num_hidden_layers??(o==null?void 0:o.length),"layers",512),a=ee(i.hidden_size,"hidden size",65536),d=ee(i.num_attention_heads,
"attention heads",1024),l=ee(i.num_key_value_heads??d,"KV heads",1024),h=ee(i.head_dim??a/d,"head dimension",4096),g=ee(
i.vocab_size??e.vocab_size,"vocabulary");if(o!==void 0&&(!Array.isArray(o)||o.length!==s||o.some(S=>!["attention","mamba",
"mlp","moe","full_attention","sliding_attention","linear_attention"].includes(S))))throw new Error("Invalid model memory\
 layer types");let u=s,m=0,b=0,v=0,y=0,c=0,f=0;if(r==="nemotron_h"){if(!o)throw new Error("Nemotron requires explicit re\
current layer types");if(u=o.filter(E=>E==="attention").length,m=o.filter(E=>E==="mamba").length,o.some(E=>!["attention",
"mamba","mlp","moe"].includes(E)))throw new Error("Unsupported Nemotron layer type");y=ee(i.mamba_num_heads,"SSM heads",
1024),c=ee(i.mamba_head_dim,"SSM head dimension",4096),f=ee(i.ssm_state_size,"SSM state size",4096);const S=ee(i.n_groups,
"SSM groups",1024);v=ee(i.conv_kernel,"convolution kernel",256),b=ee(y*c+2*S*f,"convolution channels")}return Ut({schema:"\
peercompute.onnx.memory.v1",architecture:r,layers:s,hiddenSize:a,heads:d,kvHeads:l,headDim:h,vocabulary:g,attentionLayers:u,
recurrentLayers:m,convChannels:b,convKernel:v,ssmHeads:y,ssmHeadDim:c,stateSize:f})}function Ut(e){const t=["schema","ar\
chitecture","layers","hiddenSize","heads","kvHeads","headDim","vocabulary","attentionLayers","recurrentLayers","convChan\
nels","convKernel","ssmHeads","ssmHeadDim","stateSize"];if(!e||e.schema!=="peercompute.onnx.memory.v1"||!Cr("transformer\
s.js",e.architecture)||Object.keys(e).some(n=>!t.includes(n)))throw new Error("Invalid model memory profile");for(const n of t.
slice(2))ee(e[n],n,1048576,["attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","sta\
teSize"].includes(n)?0:1);if(e.layers>512||e.attentionLayers+e.recurrentLayers>e.layers||e.kvHeads>e.heads||e.architecture!==
"nemotron_h"&&e.recurrentLayers)throw new Error("Invalid model memory layer geometry");const r=2*(2*e.attentionLayers*e.
kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4);if(!Number.
isSafeInteger(r)||r>16*St)throw new Error("Model cache/state exceeds its bounded memory envelope");return Object.fromEntries(
t.map(n=>[n,e[n]]))}function Kf(e){const t=Ut(e);return 2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*
(t.ssmHeads*t.ssmHeadDim*t.stateSize+t.convChannels*t.convKernel)*4)}function yi(e,t){if((t==null?void 0:t.model_type)!==
e.architecture)throw new Error("Model config architecture does not match its admitted manifest");if(t.auto_map&&Object.keys(
t.auto_map).length)throw new Error("Custom model code is not admitted");if(e.memoryProfile&&JSON.stringify(Ut(e.memoryProfile))!==
JSON.stringify(Yf(t)))throw new Error("Model memory profile differs from its verified config");return Qf(e.dtype,t)}const mn="\
transformers.js",wi="4.3.2",F=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:ve.maximumBytes,maxFileBytes:ve.
maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,
chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),Xf=Object.freeze({maxModelBytes:2*1024**
3,maxFileBytes:F.maxFileBytes,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),Ei=Object.
freeze({maxModelBytes:F.maxModelBytes,maxFileBytes:F.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:F.
maxImagePixels}),Jf=Object.freeze({...Ei,maxModelBytes:ve.legacyMaximumBytes});function xi(e,{files:t,totalBytes:r,config:n}={}){
const i=(e==null?void 0:e.architecture)==="qwen3_5"?Xf:["idefics3","smolvlm"].includes(e==null?void 0:e.architecture)?Jf:
Ei;if(n&&yi(e,n),t){r=0;for(const l of t){if(!Number.isSafeInteger(l.size)||l.size<0)throw new Error("Invalid model file\
 size");if(l.size>F.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONNX fi\
le must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=l.size}}if(r!==void 0&&(!Number.isSafeInteger(r)||
r<0||r>i.maxModelBytes))throw Object.assign(new Error(`Model exceeds its admitted file budget of ${i.maxModelBytes/1024**
3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const o=(e==null?void 0:e.memoryProfile)&&Ut(e.memoryProfile);if(o&&o.architecture!==
e.architecture)throw new Error("Model memory architecture mismatch");if(!o&&!(r>ve.legacyMaximumBytes))return i;const s=r??
0,a=o?Kf(o):0,d=1024**3;return{...i,minimumCpuBytes:Math.max(i.minimumCpuBytes,2*s+2*d+a),minimumGpuBytes:Math.max(i.minimumGpuBytes,
2*s+d+a),cacheBytes:a}}function pr(e="Operation cancelled"){return(e==null?void 0:e.name)==="AbortError"?e:new DOMException(
typeof e=="string"?e:"Operation cancelled","AbortError")}function Q(e){if(e!=null&&e.aborted)throw pr(e.reason)}function rt(e){
if(typeof e!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(e))throw new Error("Invalid model session ID");return e}function At(e){
if(typeof e!="string"||!e||new TextEncoder().encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(e)||e.startsWith("\
/")||e.split("/").some(t=>!t||t==="."||t===".."))throw new Error("Invalid model artifact path");return e}function Zf(e){
var g;let t;try{t=JSON.stringify(e)}catch{throw new Error("Invalid model manifest")}if(!t||new TextEncoder().encode(t).length>
F.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(t);if(((g=r.model)==
null?void 0:g.composition)!==void 0)throw new Error("This ONNX runtime does not support model adapters");if(r.schema!=="\
peercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>F.maxFiles)throw new Error("\
Invalid model manifest files");const n=new Set,i=xi(r.model,{files:r.files});let o=0;for(const u of r.files){if(At(u.path),
n.has(u.path))throw new Error("Duplicate model artifact path");n.add(u.path);const m=$.parse(u.cid);if(![85,112].includes(
m.code)||m.multihash.code!==18||m.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(
u.size)||u.size<0||!/^[a-f0-9]{64}$/i.test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.
sha256.toLowerCase(),o+=u.size,!Number.isSafeInteger(o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted f\
ile budget")}const s=r.model,a=Cr(mn,s==null?void 0:s.architecture);if((s==null?void 0:s.runtime)!==mn||s.runtimeVersion!==
wi||!a)throw new Error("Model runtime, architecture or dtype is not approved");if(s.task??(s.task=a.task),s.task!==a.task)
throw new Error("Model task does not match its admitted architecture");if((a.requiresMemoryProfile||a.task==="text-gener\
ation"&&o>ve.legacyMaximumBytes)&&!s.memoryProfile)throw new Error("This model requires a verified config memory profile");
const d=typeof s.dtype=="string"?[["model",s.dtype]]:s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(
s.dtype):[];if(!d.length||d.length>16||d.some(([u,m])=>!/^[A-Za-z0-9_-]{1,100}$/.test(u)||!["fp32","fp16","q4","q4f16","\
q8"].includes(m)))throw new Error("Invalid model dtype configuration");if(s.architecture==="qwen3_5"&&d.some(([,u])=>u!==
"q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=u=>u==="fp32"?"":u==="q8"?"_quantized":`_${u}`,
h=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&h.
push(...d.map(([u,m])=>`onnx/${u}${l(m)}.onnx`)),s.task==="image-text-to-text")for(const u of["embed_tokens","vision_enc\
oder","decoder_model_merged"]){const m=typeof s.dtype=="string"?s.dtype:s.dtype[u];if(!m)throw new Error("Multimodal dty\
pe configuration is missing a module");h.push(`onnx/${u}${l(m)}.onnx`),s.architecture==="qwen3_5"&&h.push(`onnx/${u}${l(
m)}.onnx_data`)}if(h.some(u=>!n.has(u)))throw new Error("Incomplete model package");if(s.task==="image-text-to-text"&&!n.
has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor configuration is \
missing");if(s.requiredFeatures!==void 0&&(!Array.isArray(s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.
some(u=>typeof u!="string"||u.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}
function eu(e,t){const r=new URL(t),n={};for(const i of["mjs","wasm"]){if(typeof(e==null?void 0:e[i])!="string")throw new Error(
"Trusted ORT runtime assets are required");const o=new URL(e[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||
!["http:","https:"].includes(o.protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved sam\
e-origin runtime files");n[i]=o.href}return n}const tu="peercompute.model-artifact-read.v1",Or=tu;function Si(e,t){var n;
const r=i=>t(i.data);return e.addEventListener("message",r),(n=e.start)==null||n.call(e),()=>e.removeEventListener("mess\
age",r)}function re(e,t,r=[]){e.postMessage({protocol:Or,...t},r)}function $u(e,{store:t,manifest:r,chunkBytes:n=F.chunkBytes,
maxReads:i=F.maxReads}={}){if(!(t!=null&&t.stat)||!(t!=null&&t.openRead))throw new Error("A verified artifact store is r\
equired");if(!Number.isInteger(n)||n<1||n>F.chunkBytes||!Number.isInteger(i)||i<1||i>F.maxReads)throw new Error("Invalid\
 artifact bridge bounds");const o=new Map(r.files.map(u=>[At(u.path),u])),s=new Map;let a=!1,d=0;async function l(u,m){var v,
y;const b=s.get(u);if(b){s.delete(u),b.controller.abort(m);try{await((y=(v=b.iterator)==null?void 0:v.return)==null?void 0:
y.call(v))}catch{}}}async function h(u){var b,v;if(a||(u==null?void 0:u.protocol)!==Or||typeof u.id!="string"||u.id.length>
128)return;const{id:m}=u;try{if(u.type==="cancel"){await l(m,"Reader cancelled");return}if(u.type==="open"){if(s.has(m))
throw new Error("Duplicate artifact reader");if(s.size>=i)throw new Error("Artifact reader limit reached");const E=o.get(
u.path);if(!E)throw new Error("Artifact path is not in the manifest");const I=u.offset??0,T=u.length??E.size-I;if(!Number.
isSafeInteger(I)||!Number.isSafeInteger(T)||I<0||T<0||I>E.size||T>E.size-I)throw new Error("Invalid artifact byte range");
const A={controller:new AbortController,remaining:T,pulling:!1};s.set(m,A);const x=await t.stat(E.cid);if(Q(A.controller.
signal),a||s.get(m)!==A)return;if(!x||x.status!=="complete"||x.size!==E.size||x.sha256!==E.sha256)throw new Error("Model\
 artifact is incomplete or has a different size");const R=await t.openRead(E.cid,{offset:I,length:T,signal:A.controller.
signal});if(A.iterator=R[Symbol.asyncIterator](),a||A.controller.signal.aborted||s.get(m)!==A){await((v=(b=A.iterator).return)==
null?void 0:v.call(b));return}re(e,{type:"ready",id:m,size:T});return}if(u.type!=="pull")return;const y=s.get(m);if(!(y!=
null&&y.iterator)||y.pulling)throw new Error("Invalid artifact pull credit");y.pulling=!0;const c=await y.iterator.next();
if(a||y.controller.signal.aborted||s.get(m)!==y)return;if(c.done){if(y.remaining!==0)throw new Error("Truncated model ar\
tifact");s.delete(m),re(e,{type:"end",id:m});return}const f=c.value;if(!(f instanceof Uint8Array)||!f.byteLength||f.byteLength>
n||f.byteLength>y.remaining)throw new Error("Artifact chunk exceeds admitted bounds");y.remaining-=f.byteLength,y.pulling=
!1,d+=f.byteLength;const S=f.slice();re(e,{type:"chunk",id:m,bytes:S},[S.buffer])}catch(y){await l(m,y),a||re(e,{type:"e\
rror",id:m,message:(y==null?void 0:y.message)||"Artifact read failed"})}}const g=Si(e,u=>{h(u)});return{getStats:()=>({activeReads:s.
size,deliveredBytes:d}),async close(){if(!a){a=!0;try{re(e,{type:"closed",message:"Artifact bridge closed"})}catch{}g(),
await Promise.all([...s.keys()].map(u=>l(u,"Artifact bridge closed"))),e.close()}}}}function ru(e,{manifest:t,baseUrl:r,
signal:n,chunkBytes:i=F.chunkBytes,maxReads:o=F.maxReads,maxQueuedReads:s=32}={}){if(!Number.isInteger(o)||o<1||o>F.maxReads||
!Number.isInteger(s)||s<0||s>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),d=new Map(t.files.
map(c=>[At(c.path),c])),l=new Map,h=[];let g=0,u=!1;function m(){for(;!u&&l.size<o&&h.length;){const c=h.shift();l.set(c.
id,c),c.active=!0,re(e,{type:"open",id:c.id,path:c.path})}}function b(c,f){var E,I,T,A;l.delete(c.id);const S=h.indexOf(
c);if(S>=0&&h.splice(S,1),n==null||n.removeEventListener("abort",c.abort),(E=c.requestSignal)==null||E.removeEventListener(
"abort",c.abort),f){(I=c.reject)==null||I.call(c,f);try{(T=c.streamController)==null||T.error(f)}catch{}}(A=c.resolvePull)==
null||A.call(c),m()}const v=Si(e,c=>{if((c==null?void 0:c.protocol)!==Or)return;const f=l.get(c.id);if(f){if(c.type==="e\
rror"){b(f,new Error(c.message));return}if(c.type==="ready"){if(f.ready||c.size!==f.file.size){b(f,new Error("Invalid ar\
tifact response size")),re(e,{type:"cancel",id:f.id});return}f.ready=!0,re(e,{type:"pull",id:f.id})}else if(c.type==="ch\
unk"){if(!f.ready||!f.resolvePull||!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||c.bytes.byteLength>i||f.received+
c.bytes.byteLength>f.file.size){re(e,{type:"cancel",id:f.id}),b(f,new Error("Invalid artifact chunk"));return}f.received+=
c.bytes.byteLength,f.streamController.enqueue(c.bytes);const S=f.resolvePull;f.resolvePull=null,S()}else c.type==="end"&&
(!f.ready||f.received!==f.file.size?b(f,new Error("Truncated artifact response")):(f.streamController.close(),b(f)))}});
async function y(c,f={}){if(u)throw new Error("Artifact bridge is closed");if(Q(n),Q(f.signal),f.method&&f.method!=="GET")
throw new Error("Model adapter supports GET only");const S=String(c);if(/[\\]/.test(S)||/%(?:2e|2f|5c|00)/i.test(S)||/\/(?:\.|\.\.)(?:\/|$)/.
test(S))throw new Error("Invalid artifact URL");const E=new URL(S,a);if(E.origin!==a.origin||E.username||E.password||E.search||
E.hash||!E.pathname.startsWith(a.pathname))throw new Error("Model path is outside its manifest");const I=At(decodeURIComponent(
E.pathname.slice(a.pathname.length))),T=d.get(I);if(!T)return new Response("Artifact path is not in the manifest",{status:404});
const A=`read-${++g}`,x={id:A,path:I,file:T,requestSignal:f.signal,received:0,ready:!1,active:!1,queued:!1};x.abort=()=>{
var w;x.active&&re(e,{type:"cancel",id:A}),b(x,pr((n==null?void 0:n.reason)??((w=f.signal)==null?void 0:w.reason)))};const R=new ReadableStream(
{start(w){x.streamController=w},pull(){if(u)throw new Error("Artifact bridge is closed");if(Q(n),Q(f.signal),!x.active&&
!x.queued&&l.size>=o&&h.length>=s)throw new Error("Artifact reader limit reached");return new Promise(w=>{var N;x.resolvePull=
w,x.ready?re(e,{type:"pull",id:A}):x.queued||(x.queued=!0,n==null||n.addEventListener("abort",x.abort,{once:!0}),(N=f.signal)==
null||N.addEventListener("abort",x.abort,{once:!0}),h.push(x),m())})},cancel(){x.active&&re(e,{type:"cancel",id:A}),b(x)}},
{highWaterMark:0});return new Response(R,{headers:{"Content-Length":String(T.size),"Content-Type":T.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:y,close(c="Artifact bridge closed"){if(!u){u=!0;for(const f of[...l.values(),...h])f.active&&
re(e,{type:"cancel",id:f.id}),b(f,pr(c));v(),e.close()}}}}function nu(e,t){if(typeof(e==null?void 0:e.createBuffer)!="fu\
nction")return()=>{};const r=Object.getOwnPropertyDescriptor(e,"createBuffer"),n=e.createBuffer;let i=0;const o=function(...s){
var g;const a=n.apply(e,s),d=a.size??((g=s[0])==null?void 0:g.size);if(!Number.isSafeInteger(d)||d<0||!Number.isSafeInteger(
i+d))return a;i+=d,t.requestedGpuBufferPeakBytes=Math.max(t.requestedGpuBufferPeakBytes??0,i);const l=a.destroy;let h=!1;
if(typeof l=="function")try{a.destroy=function(...u){const m=l.apply(this,u);return h||(h=!0,i-=d),m}}catch{}return a};try{
e.createBuffer=o}catch{return()=>{}}return()=>{e.createBuffer===o&&(r?Object.defineProperty(e,"createBuffer",r):delete e.
createBuffer)}}const iu="4.3.2",ou=new Set(["qwen3_5","qwen3_5_text"]),Ht=new WeakMap,Qt="_get_text_only_rope_index";function gn(e,t,r){
var o,s,a,d;const[n,i]=e??[];if((n==null?void 0:n.type)!=="int64"||(i==null?void 0:i.type)!=="int64"||((o=n.dims)==null?
void 0:o.length)!==3||n.dims[0]!==3||n.dims[1]!==t||n.dims[2]!==r||((s=i.dims)==null?void 0:s.length)!==2||i.dims[0]!==t||
i.dims[1]!==1||((a=n.data)==null?void 0:a.length)!==3*t*r||((d=i.data)==null?void 0:d.length)!==t)throw new Error("Unsup\
ported Qwen text position result");return{positions:n,deltas:i}}function su(e,t){var a,d,l;if(((a=t==null?void 0:t.env)==
null?void 0:a.version)!==iu||!ou.has((d=e==null?void 0:e.config)==null?void 0:d.model_type))return!1;if(Ht.has(e)){if(e[Qt]!==
Ht.get(e))throw new Error("Qwen text position compatibility was replaced");return!0}const r=e[Qt];if(typeof r!="function"||
typeof t.Tensor!="function")throw new Error("Qwen text position compatibility is unavailable");const n=new t.Tensor("int\
64",[10n,11n],[1,2]),i=new t.Tensor("int64",[1n,1n],[1,2]);let o;try{o=r.call(e,n,i);const{positions:h,deltas:g}=gn(o,1,
2);if([...h.data].some((u,m)=>u!==BigInt(m%2)))throw new Error("Unsupported Qwen text position calculation");if(g.data[0]===
0n)return!1;if(g.data[0]!==4n)throw new Error("Unsupported Qwen text position offset")}finally{for(const h of new Set([n,
i,...Array.isArray(o)?o:[]]))(l=h==null?void 0:h.dispose)==null||l.call(h)}function s(h,g){var m,b;const u=r.call(this,h,
g);if(!g)return u;try{const[v,y]=g.dims??[];if(((m=g.dims)==null?void 0:m.length)!==2||!Number.isSafeInteger(v)||v<1||!Number.
isSafeInteger(y)||y<1)throw new Error("Invalid Qwen text position dimensions");const{positions:c,deltas:f}=gn(u,v,y);for(let E=0;E<
v;E++){let I=c.data[E*y];for(let T=1;T<y;T++){const A=c.data[E*y+T];A>I&&(I=A)}if(f.data[E]!==I+1n+BigInt(y))throw new Error(
"Qwen text position behavior changed")}const S=2n*BigInt(y);for(let E=0;E<v;E++)f.data[E]-=S;return u}catch(v){for(const y of new Set(
Array.isArray(u)?u:[]))(b=y==null?void 0:y.dispose)==null||b.call(y);throw v}}return Object.defineProperty(e,Qt,{value:s,
configurable:!0,writable:!0}),Ht.set(e,s),!0}const ft=e=>new TextEncoder().encode(e).byteLength;function au(){if(typeof WorkerGlobalScope>
"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}
function Ai(e){if(e==null)return null;if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<
1||e.width*e.height>F.maxImagePixels||e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||
e.data.byteLength!==e.width*e.height*4||e.data.byteLength>F.maxImageBytes)throw new Error("Image must contain bounded RG\
BA pixels; image URLs and encoded files are not accepted");return e}function Ii(e){const t=e.messages??(typeof e.prompt==
"string"?[{role:"user",content:e.prompt}]:null);if(!Array.isArray(t)||!t.length||t.length>F.maxMessages)throw new Error(
"Invalid inference messages");let r=0;return t.map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.
content!="string")throw new Error("Only text message content is accepted");if(r+=ft(n.content),r>F.maxPromptBytes)throw new Error(
"Prompt exceeds its byte budget");return{role:n.role,content:n.content}})}async function vi(e){var n;if(!e)return;let t;
const r=new Set;for(const i of[e.model,e.processor,e.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.dispose)==null?
void 0:n.call(i))}catch(o){t??(t=o)}}if(t)throw t}function br(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.
add(e),typeof e.dispose=="function"){e.dispose();return}for(const r of Object.values(e))br(r,t)}}function cu(e){const t=e.
findIndex(n=>n.role==="user");if(t<0)return null;const r=e.findIndex((n,i)=>i>t&&n.role==="user");return r<0||!e.some((n,i)=>i>
t&&i<r&&n.role==="assistant")?null:e.filter((n,i)=>i<t||i>=r||n.role==="system")}function du(e,t,r){const n={...e.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,e.generation_config);const i=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],o=t.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===BigInt(o))?"stop":t.length>=r?"length":"unknown"}function se(e,t,r){const n=e===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(
(t==null?void 0:t.message)??t??"operation failed").slice(0,240)}`,i=new Error(`Model session lost: ${r} ${n}`,{cause:t});
return i.code=e==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",i}function fu(e){let t,r,n=!1;const i=a=>{
var d;n||(e.lost=!0,(!e.gpuFailure||a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=a),(d=e.active)==null||d.abort(
a))},o=({error:a})=>{var d;return i(se(((d=a==null?void 0:a.constructor)==null?void 0:d.name)==="GPUOutOfMemoryError"?"o\
ut-of-memory":"uncaptured error",a,(r==null?void 0:r.stage)??"resident model"))},s=()=>{if(!(!r||r.device)){r.device=t;for(const a of[
"validation","out-of-memory","internal"])t.pushErrorScope(a),r.filters.push(a)}};return{attach(a){var d,l;if(t&&t!==a)throw se(
"device changed",null,"load");if(!t){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!="function"||typeof((d=
a.queue)==null?void 0:d.onSubmittedWorkDone)!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!=
"function"||typeof a.destroy!="function"||typeof((l=a.lost)==null?void 0:l.then)!="function")throw se("device unavailabl\
e",null,"load");t=a,e.runtimeDevice=t,e.restoreResourceEvidence=nu(t,e),t.addEventListener("uncapturederror",o),t.lost.then(
h=>i(se("device lost",h,(r==null?void 0:r.stage)??"resident model")),h=>i(se("device lost",h,(r==null?void 0:r.stage)??"\
resident model")))}try{s()}catch(h){const g=se("error scope failure",h,(r==null?void 0:r.stage)??"load");throw i(g),g}},
async run(a,d){if(e.lost)throw e.gpuFailure??se("device lost",null,a);if(r)throw new Error("Overlapping model GPU operat\
ions are not allowed");const l={stage:a,filters:[],device:null};r=l;let h,g;try{if(t&&this.attach(t),h=await d(),!t)throw se(
"device unavailable",null,a)}catch(b){g=b}if(t)try{await t.queue.onSubmittedWorkDone()}catch(b){i(se("queue failure",b,a))}
const u=await Promise.all(l.filters.reverse().map(async b=>{try{return{filter:b,error:await l.device.popErrorScope()}}catch(v){
return{filter:b,error:v,scopeFailed:!0}}}));r=null;for(const b of u)b.scopeFailed&&i(se("error scope failure",b.error,a));
const m=["out-of-memory","internal","validation"].map(b=>u.find(v=>v.filter===b&&v.error&&!v.scopeFailed)).find(Boolean);
if(m&&i(se(m.filter,m.error,a)),g instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((g==null?void 0:
g.message)??"")){const b=new Error("Model session lost: native inference runtime failed",{cause:g});b.code="ERR_MODEL_RU\
NTIME",i(b)}if(typeof(g==null?void 0:g.code)=="string"&&g.code.startsWith("ERR_MODEL_GPU")&&i(g),e.gpuFailure)throw e.gpuFailure;
if(g)throw g;return h},dispose(){var a;n=!0,t==null||t.removeEventListener("uncapturederror",o),(a=e.restoreResourceEvidence)==
null||a.call(e)}}}function uu(e){var i;const t=["maxBindGroups","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPe\
rDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBufferSize","maxComputeInvocationsPerWor\
kgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],r={};for(const o of t){const s=(i=
e.limits)==null?void 0:i[o];if(!Number.isSafeInteger(s)||s<=0)throw new Error(`WebGPU adapter has an invalid ${o} limit`);
r[o]=s}const n=["chromium-experimental-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgroup-size-contro\
l"].filter(o=>e.features.has(o));return{requiredLimits:r,requiredFeatures:n}}async function yn(e){var t,r,n;await vi(e.components),
(t=e.restoreGpuEvidence)==null||t.call(e),(r=e.gpuGuard)==null||r.dispose(),(n=e.ownedDevice)==null||n.destroy(),e.ownedDevice=
null}async function lu({library:e,modelPath:t,options:r,manifest:n,adapterFeatures:i=[]}){const o={};try{const s=await e.
AutoConfig.from_pretrained(t,r),a=yi(n.model,s);for(const l of a)if(!i.includes(l))throw new Error(`Model config require\
s unsupported GPU feature: ${l}`);const d={...r,config:s};if(n.model.architecture==="qwen3_5"&&(d.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture===
"qwen3_5"){const l=o.processor.image_processor;if(!l)throw new Error("Qwen3.5 image processor is unavailable");l.min_pixels=
256*256,l.max_pixels=xi(n.model).maxProcessedImagePixels,l.do_normalize??(l.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await e.AutoModelForImageTextToText.from_pretrained(t,d)}else o.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),o.model=await e.AutoModelForCausalLM.from_pretrained(t,d);return o}catch(s){throw await vi(o),s}}function wn(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,requestedGpuBufferPeakBytes:e.requestedGpuBufferPeakBytes,
gpuDispatches:e.gpuDispatches??0,gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.
collectGpuEvidence===!0,runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,qwenTextRopeCompatibility:e.
qwenTextRopeCompatibility===!0}}function Ti({loadLibrary:e=()=>Ri(()=>import("./transformers.web-BT_bOziL.js"),[],
import.meta.url),loadModel:t=lu,gpu:r=(o=>(o=globalThis.navigator)==null?void 0:o.gpu)(),baseUrl:n=(s=>(s=globalThis.location)==
null?void 0:s.href)(),assertWorker:i=au}={}){const a=new Map;let d;async function l(g,u){var f,S,E,I,T,A;if(a.size)throw new Error(
"This inference worker already has a resident/loading model");const m=rt(g.sessionId),{manifest:b}=Zf(g.manifest),v=eu(g.
runtimeAssets,n);if(!((f=g.artifactPort)!=null&&f.postMessage))throw new Error("An artifact reader port is required");Q(
u.signal);const y={sessionId:m,manifest:b,manifestCid:g.manifestCid,status:"loading",workerId:u.workerId??null,generatedRequests:0,
components:null};a.set(m,y);let c;try{const x=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));
if(Q(u.signal),!x||(S=x.info)!=null&&S.isFallbackAdapter||x.isFallbackAdapter)throw new Error("A hardware WebGPU adapter\
 is required; CPU/software fallback is disabled");const R=typeof b.model.dtype=="string"?[b.model.dtype]:Object.values(b.
model.dtype),w=new Set(b.model.requiredFeatures??[]);R.some(O=>["fp16","q4f16"].includes(O))&&w.add("shader-f16");for(const O of w)
if(!x.features.has(O))throw new Error(`Model requires unsupported GPU feature: ${O}`);y.adapter={vendor:((E=x.info)==null?
void 0:E.vendor)??"",architecture:((I=x.info)==null?void 0:I.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...w]};
const N=await(d??(d=e()));if(Q(u.signal),N.env.version!==wi)throw new Error("Unexpected Transformers runtime version");const U=new URL(
"/__peercompute_models/",n);c=ru(g.artifactPort,{manifest:b,baseUrl:new URL(`${m}/`,U).href,signal:u.signal});const{env:k}=N;
k.logLevel=50,k.allowLocalModels=!0,k.allowRemoteModels=!1,k.localModelPath=U.pathname,k.useBrowserCache=!1,k.useFSCache=
!1,k.useWasmCache=!1,k.fetch=async(...O)=>{var _;try{return await c.fetch(...O)}catch(z){throw(_=u.emitProgress)==null||
_.call(u,{type:"artifact-read-error",sessionId:m,message:z.message}),z}},k.backends.onnx.wasm.proxy=!1,k.backends.onnx.wasm.
numThreads=1,k.backends.onnx.wasm.wasmPaths=v,y.gpuDispatches=0,y.gpuProfileSamples=0,y.gpuSubmissions=0,y.collectGpuEvidence=
g.collectGpuEvidence===!0,k.backends.onnx.webgpu&&(k.backends.onnx.webgpu.profiling={mode:g.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{y.gpuProfileSamples+=1}});const C={local_files_only:!0,device:"webgpu",dtype:b.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:O=>{var _,z;(_=u.signal)!=null&&_.aborted||(z=u.emitProgress)==null||z.
call(u,{type:"model-load",sessionId:m,status:String(O.status??"").slice(0,40),file:typeof O.file=="string"?O.file.slice(
0,512):void 0,loaded:Number.isFinite(O.loaded)?O.loaded:void 0,total:Number.isFinite(O.total)?O.total:void 0})}};y.library=
N,y.gpuGuard=fu(y),await y.gpuGuard.run("load",async()=>{const O=k.backends.onnx.webgpu;if(!O)throw new Error("The WebGP\
U runtime is unavailable");O.adapter=x,y.ownedDevice=await x.requestDevice(uu(x)),y.gpuGuard.attach(y.ownedDevice),C.session_options.
executionProviders=[{name:"webgpu",device:y.ownedDevice}],y.components=await t({library:N,modelPath:m,options:C,manifest:b,
adapterFeatures:[...x.features]}),y.qwenTextRopeCompatibility=su(y.components.model,N);for(const _ of w)if(!y.runtimeDevice.
features.has(_))throw new Error(`ORT device is missing required GPU feature: ${_}`);Q(u.signal)});const B=y.runtimeDevice;
if(y.runtimeFeatures=[...(B==null?void 0:B.features)??[]],y.collectGpuEvidence&&B){const O=B.createCommandEncoder.bind(B),
_=B.queue.submit.bind(B.queue),z=Object.getOwnPropertyDescriptor(B,"createCommandEncoder"),G=Object.getOwnPropertyDescriptor(
B.queue,"submit");y.restoreGpuEvidence=()=>{z?Object.defineProperty(B,"createCommandEncoder",z):delete B.createCommandEncoder,
G?Object.defineProperty(B.queue,"submit",G):delete B.queue.submit,y.restoreGpuEvidence=null},B.createCommandEncoder=(...ue)=>{
const X=O(...ue),Te=X.beginComputePass.bind(X);return X.beginComputePass=(...ce)=>{const ie=Te(...ce);for(const de of["d\
ispatchWorkgroups","dispatchWorkgroupsIndirect"]){const we=ie[de].bind(ie);ie[de]=(...Lt)=>{const le=we(...Lt);return y.
gpuDispatches+=1,le}}return ie},X},B.queue.submit=(...ue)=>{const X=_(...ue);return y.gpuSubmissions+=1,X}}const M=(B==null?
void 0:B.adapterInfo)??((A=(T=k.backends.onnx.webgpu)==null?void 0:T.adapter)==null?void 0:A.info);if(M){if(M.isFallbackAdapter)
throw new Error("ORT selected a software GPU adapter");y.runtimeAdapter={vendor:M.vendor,architecture:M.architecture,isFallbackAdapter:M.
isFallbackAdapter??!1}}if(Q(u.signal),y.lost)throw y.gpuFailure;return y.status="ready",wn(y)}catch(x){try{await yn(y),a.
delete(m)}catch(R){y.status="ready",y.lost=!0;const w=new Error(`MODEL_DISPOSE_FAILED: ${R.message}`);throw w.code="MODE\
L_DISPOSE_FAILED",w}throw x}finally{c==null||c.close(),c||g.artifactPort.close()}}async function h(g,u){var k,C,B,M;const m=a.
get(rt(g.sessionId));if(!m||m.lost)throw new Error("Model session lost or not loaded");if(m.status!=="ready")throw new Error(
"Model session is busy");const b=rt(g.requestId),v=g.maxNewTokens??F.maxNewTokens;if(!Number.isInteger(v)||v<1||v>F.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let y=Ii(g);const c=Ai(g.image);if(c&&m.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");Q(u.signal);const f=new AbortController,S=new m.
library.InterruptableStoppingCriteria,E=()=>{var O;f.abort((O=u.signal)==null?void 0:O.reason),S.interrupt()};(k=u.signal)==
null||k.addEventListener("abort",E,{once:!0}),f.signal.addEventListener("abort",()=>S.interrupt(),{once:!0}),m.active=f,
m.requestId=b,m.status="generating";let I,T,A=0,x=0,R,w=!1;const N=m.gpuDispatches??0,U=m.gpuSubmissions??0;try{Q(u.signal);
const{tokenizer:O,processor:_,model:z}=m.components;let G;for(;;){Q(f.signal);let ie=y;if(_&&(ie=y.map(le=>({role:le.role,
content:[{type:"text",text:le.content}]})),c)){const le=ie.findLast(Ci=>Ci.role==="user");if(!le)throw new Error("An ima\
ge requires a user message");le.content.unshift({type:"image"})}const de=(_??O).apply_chat_template(ie,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof de!="string"||ft(de)>F.maxPromptBytes)throw new Error("Templated prompt exceeds its byte \
budget");if(c){const le=new m.library.RawImage(c.data,c.width,c.height,c.channels);I=await _(de,le,{do_image_splitting:!1})}else
I=await O(de,{truncation:!1,padding:!1});if(Q(f.signal),G=(B=(C=I.input_ids)==null?void 0:C.dims)==null?void 0:B.at(-1),
!Number.isSafeInteger(G)||G<1)throw new Error("Invalid model input token count");if(G+v<=F.maxContextTokens)break;const we=cu(
y);if(!we)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or \
request fewer output tokens");const Lt=I;I=void 0,br(Lt),y=we,w=!0}Q(f.signal);const ue=new m.library.TextStreamer(O,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:ie=>{var de;if(!(f.signal.aborted||R)){if(x+=ft(ie),x>F.maxOutputBytes){R=new Error(
"Generated text exceeded its byte budget"),f.abort(R);return}try{if(((de=u.emitProgress)==null?void 0:de.call(u,{type:"t\
oken",sessionId:m.sessionId,requestId:b,sequence:A++,text:ie}))===!1)throw new Error("Token consumer rejected output")}catch(we){
R=we,f.abort(we)}}}});if(await m.gpuGuard.run("generation",async()=>{T=await z.generate({...I,max_new_tokens:v,do_sample:!1,
streamer:ue,stopping_criteria:[S]})}),R)throw R;if(m.lost)throw m.gpuFailure;Q(f.signal);const X=T.tolist();if(X.length!==
1||X[0].length<G||X[0].length>G+v)throw new Error("Model returned an over-budget token sequence");const Te=X[0].slice(G),
ce=O.decode(Te,{skip_special_tokens:!0});if(ft(ce)>F.maxOutputBytes)throw new Error("Generated text exceeds its byte bud\
get");return m.generatedRequests+=1,{sessionId:m.sessionId,requestId:b,text:ce,inputTokens:G,requestedGpuBufferPeakBytes:m.
requestedGpuBufferPeakBytes,outputTokens:Te.length,finishReason:du(z,Te,v),contextTruncated:w,workerId:m.workerId,gpuDispatches:(m.
gpuDispatches??0)-N,gpuSubmissions:(m.gpuSubmissions??0)-U,gpuProfileSamples:m.gpuProfileSamples??0}}catch(O){throw m.gpuFailure??
O}finally{(M=u.signal)==null||M.removeEventListener("abort",E);try{const O=new Set;let _;for(const z of[I,T])try{br(z,O)}catch(G){
_??(_=G)}if(_){m.lost=!0;const z=m.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:_});throw z.
code??(z.code="MODEL_DISPOSE_FAILED"),m.gpuFailure=z,z}}finally{m.active=null,m.requestId=null,m.status="ready"}}}return async function(u={},m={}){
var v;if(i(),u.command==="load")return l(u,m);if(u.command==="generate")return h(u,m);const b=a.get(rt(u.sessionId));if(u.
command==="status")return b?wn(b):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return(b==null?void 0:
b.requestId)===u.requestId&&((v=b.active)==null||v.abort("Generation cancelled")),{sessionId:u.sessionId,cancellationRequested:!0};
if(u.command==="unload"){if(!b)return{sessionId:u.sessionId,status:"absent"};if(b.status!=="ready")throw new Error("Canc\
el and await active model work before unloading");b.status="unloading";try{await yn(b)}catch(y){b.status="ready",b.lost=
!0;const c=new Error(`MODEL_DISPOSE_FAILED: ${y.message}`);throw c.code="MODEL_DISPOSE_FAILED",c}return a.delete(u.sessionId),
{sessionId:u.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const hu=Ti(),pu=(e,t)=>hu(e,t),
qu=Object.freeze(Object.defineProperty({__proto__:null,createModelTaskRuntime:Ti,handleModelTask:pu,normalizeModelMessages:Ii,
validateImageInput:Ai},Symbol.toStringTag,{value:"Module"})),bu=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.
freeze([...bu,"compute_probabilities"]);new TextEncoder;new TextDecoder("utf-8",{fatal:!0});export{mf as A,tu as B,$ as C,qu as D,zu as G,Pu as L,F as M,ve as O,jf as S,Ri as _,Zf as a,rt as b,Ai as c,pr as d,rf as e,
$u as f,yi as g,wf as h,Wd as i,Hn as j,Uu as k,yf as l,Du as m,Ii as n,nu as o,gf as p,At as q,_t as r,ku as s,Q as t,Gu as u,
eu as v,ru as w,Of as x,Lu as y,Fu as z};
