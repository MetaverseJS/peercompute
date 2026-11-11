var ui=Object.defineProperty;var li=(e,t,r)=>t in e?ui(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var l=(e,t,r)=>li(e,typeof t!="symbol"?t+"":t,r);import{i as hi}from"./device-B4S7QtIr.js";const pi="modulepreload",bi=function(e,t){return new URL(e,t).href},gr={},mi=function(t,r,n){let i=Promise.resolve();if(r&&
r.length>0){let s=function(m){return Promise.all(m.map(E=>Promise.resolve(E).then(u=>({status:"fulfilled",value:u}),u=>({
status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),f=document.querySelector("meta[property=c\
sp-nonce]"),h=(f==null?void 0:f.nonce)||(f==null?void 0:f.getAttribute("nonce"));i=s(r.map(m=>{if(m=bi(m,n),m in gr)return;
gr[m]=!0;const E=m.endsWith(".css"),u=E?'[rel="stylesheet"]':"";if(!!n)for(let I=a.length-1;I>=0;I--){const g=a[I];if(g.
href===m&&(!E||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${m}"]${u}`))return;const b=document.
createElement("link");if(b.rel=E?"stylesheet":pi,E||(b.as="script"),b.crossOrigin="",b.href=m,h&&b.setAttribute("nonce",
h),document.head.appendChild(b),E)return new Promise((I,g)=>{b.addEventListener("load",I),b.addEventListener("error",()=>g(
new Error(`Unable to preload CSS for ${m}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});
if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="re\
jected"&&o(a.reason);return t().catch(o)})};class gi{constructor(){l(this,"index",0);l(this,"input","")}new(t){return this.
index=0,this.input=t,this}readAtomically(t){const r=this.index,n=t();return n===void 0&&(this.index=r),n}parseWith(t){const r=t();
if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){
if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(t){return this.readAtomically(()=>{const r=this.
readChar();if(r===t)return r})}readSeparator(t,r,n){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(t)===void 0))
return n()})}readNumber(t,r,n,i){return this.readAtomically(()=>{let o=0,s=0;const a=this.peekChar();if(a===void 0)return;
const f=a==="0",h=2**(8*i)-1;for(;;){const m=this.readAtomically(()=>{const E=this.readChar();if(E===void 0)return;const u=Number.
parseInt(E,t);if(!Number.isNaN(u))return u});if(m===void 0)break;if(o*=t,o+=m,o>h||(s+=1,r!==void 0&&s>r))return}if(s!==
0)return!n&&f&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{const t=new Uint8Array(4);for(let r=0;r<t.length;r++){
const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;t[r]=n}return t})}readIPv6Addr(){const t=r=>{
for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.readSeparator(":",n,()=>this.readIPv4Addr());if(s!==
void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}const o=this.readSeparator(":",n,()=>this.readNumber(
16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(
16),[n,i]=t(r);if(n===16)return r;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(
14),s=16-(n+2),[a]=t(o.subarray(0,s));return r.set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.
readIPv6Addr()}}const yi=45,wi=15,st=new gi;function Ei(e){if(!(e.length>wi))return st.new(e).parseWith(()=>st.readIPv4Addr())}
function vi(e){if(e.includes("%")&&(e=e.split("%")[0]),!(e.length>yi))return st.new(e).parseWith(()=>st.readIPv6Addr())}
function pn(e){return!!Ei(e)}function xi(e){return!!vi(e)}function bn(e=0){return new Uint8Array(e)}function Si(e){return(e==
null?void 0:e.buffer)instanceof ArrayBuffer}function Ai(e){if(Si(e))return e;const t=e.slice();return new Uint8Array(t.buffer,
0,t.byteLength)}function mn(e,t){t==null&&(t=e.reduce((i,o)=>i+o.length,0));const r=bn(t);let n=0;for(const i of e)r.set(
i,n),n+=i.length;return Ai(r)}function Ii(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.
byteLength;r++)if(e[r]!==t[r])return!1;return!0}function Pe(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Ar\
ray")return Ge(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Ge(new Uint8Array(
e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function Ci(e){const t=new Uint8Array(
e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}const yr=4096;function _i(e){const t=e.length;if(t<=yr)
return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.subarray(n,n+=yr));
return r}function Ti(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function Ge(e){return Ti(e)?e:e.slice()}function Oi(e,t,r){
if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var f=s.
toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==a&&(n[h]=o)}}var m=e.length,E=e.charAt(0),
u=Math.log(m)/Math.log(256),y=Math.log(256)/Math.log(m);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,w=0,p=0,v=c.length;p!==v&&c[p]===0;)p++,
d++;for(var A=(v-p)*y+1>>>0,S=new Uint8Array(A);p!==v;){for(var x=c[p],_=0,C=A-1;(x!==0||_<w)&&C!==-1;C--,_++)x+=256*S[C]>>>
0,S[C]=x%m>>>0,x=x/m>>>0;if(x!==0)throw new Error("Non-zero carry");w=_,p++}for(var T=A-w;T!==A&&S[T]===0;)T++;for(var U=E.
repeat(d);T<A;++T)U+=e.charAt(S[T]);return U}function I(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var w=0,p=0;c[d]===E;)w++,d++;for(var v=(c.length-d)*u+
1>>>0,A=new Uint8Array(v);c[d];){var S=n[c.charCodeAt(d)];if(S===255)return;for(var x=0,_=v-1;(S!==0||x<p)&&_!==-1;_--,x++)
S+=m*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");p=x,d++}if(c[d]!==" "){for(var C=v-p;C!==
v&&A[C]===0;)C++;for(var T=new Uint8Array(w+(v-C)),U=w;C!==v;)T[U++]=A[C++];return T}}}function g(c){var d=I(c);if(d)return d;
throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:I,decode:g}}var Bi=Oi,Ui=Bi;let Mi=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},Ri=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return gn(this,t)}},ki=class{constructor(t){l(this,"decoders");this.
decoders=t}or(t){return gn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function gn(e,t){return new ki({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let Ni=class{constructor(t,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Mi(t,r,n),this.decoder=new Ri(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function wt({name:e,prefix:t,encode:r,decode:n}){return new Ni(
e,t,r,n)}function je({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Ui(r,e,n);return wt({prefix:t,
name:e,encode:i,decode:s=>Pe(o(s))})}function Di(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const m=t[e[h]];if(m===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|m,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function zi(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<e.length;++f)for(a=a<<8|e[f],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Li(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function L({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Li(n,i);return wt(
{prefix:t,name:e,encode(s){return zi(s,n,r)},decode(s){return Di(s,o,r,e)}})}const $i=je({prefix:"9",name:"base10",alphabet:"\
0123456789"}),Pi=Object.freeze(Object.defineProperty({__proto__:null,base10:$i},Symbol.toStringTag,{value:"Module"})),Gi=L(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Fi=L({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),ji=Object.freeze(Object.defineProperty({__proto__:null,
base16:Gi,base16upper:Fi},Symbol.toStringTag,{value:"Module"})),qi=L({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
Qi=Object.freeze(Object.defineProperty({__proto__:null,base2:qi},Symbol.toStringTag,{value:"Module"})),yn=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),Vi=yn.reduce((e,t,r)=>(e[r]=t,e),[]),Wi=yn.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${t}`);return e[n]=r,e},[]);function Hi(e){return e.reduce((t,r)=>(t+=Vi[r],t),"")}function Ki(e){const t=[];
for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Wi[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(t)}const Xi=wt({prefix:"🚀",name:"\
base256emoji",encode:Hi,decode:Ki}),Yi=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:Xi},Symbol.toStringTag,
{value:"Module"})),Ae=L({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
Ji=L({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Zi=L(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),eo=L({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),to=L({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),ro=L({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),no=L({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),io=L({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),oo=L({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),so=Object.freeze(Object.defineProperty({__proto__:null,
base32:Ae,base32hex:to,base32hexpad:no,base32hexpadupper:io,base32hexupper:ro,base32pad:Zi,base32padupper:eo,base32upper:Ji,
base32z:oo},Symbol.toStringTag,{value:"Module"})),Je=je({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),ao=je({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
co=Object.freeze(Object.defineProperty({__proto__:null,base36:Je,base36upper:ao},Symbol.toStringTag,{value:"Module"})),ce=je(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),fo=je({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),uo=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:ce,base58flickr:fo},Symbol.toStringTag,{value:"Module"})),lo=L({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),ho=L({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),wn=L({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),po=L({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),bo=Object.freeze(Object.defineProperty(
{__proto__:null,base64:lo,base64pad:ho,base64url:wn,base64urlpad:po},Symbol.toStringTag,{value:"Module"})),mo=L({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),go=Object.freeze(Object.defineProperty({__proto__:null,base8:mo},Symbol.
toStringTag,{value:"Module"})),yo=wt({prefix:"\0",name:"identity",encode:e=>_i(Pe(e)),decode:e=>Pe(Ci(e))}),wo=Object.freeze(
Object.defineProperty({__proto__:null,identity:yo},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var Eo=En,wr=128,vo=-128,xo=Math.pow(2,31);function En(e,t,r){t=t||[],r=r||0;for(var n=r;e>=xo;)t[r++]=e&255|wr,e/=128;for(;e&
vo;)t[r++]=e&255|wr,e>>>=7;return t[r]=e|0,En.bytes=r-n+1,t}var So=Pt,Ao=128,Er=127;function Pt(e,n){var r=0,n=n||0,i=0,
o=n,s,a=e.length;do{if(o>=a)throw Pt.bytes=0,new RangeError("Could not decode varint");s=e[o++],r+=i<28?(s&Er)<<i:(s&Er)*
Math.pow(2,i),i+=7}while(s>=Ao);return Pt.bytes=o-n,r}var Io=Math.pow(2,7),Co=Math.pow(2,14),_o=Math.pow(2,21),To=Math.pow(
2,28),Oo=Math.pow(2,35),Bo=Math.pow(2,42),Uo=Math.pow(2,49),Mo=Math.pow(2,56),Ro=Math.pow(2,63),ko=function(e){return e<
Io?1:e<Co?2:e<_o?3:e<To?4:e<Oo?5:e<Bo?6:e<Uo?7:e<Mo?8:e<Ro?9:10},No={encode:Eo,decode:So,encodingLength:ko},at=No;function Gt(e,t=0){
const r=at.decode(e,t),n=at.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function ct(e,t,r=0){return at.encode(e,t,r),t}function dt(e){return at.
encodingLength(e)}function Do(e,t){const r=t.byteLength,n=dt(e),i=n+dt(r),o=new Uint8Array(i+r);return ct(e,o,0),ct(r,o,
n),o.set(t,i),new ir(e,r,t,o)}function zo(e){const t=Pe(e),[r,n]=Gt(t),[i,o]=Gt(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new ir(r,i,s,t)}function Lo(e,t){if(e===t)return!0;{const r=t;return e.code===
r.code&&e.size===r.size&&r.bytes instanceof Uint8Array&&Ii(e.bytes,r.bytes)}}let ir=class{constructor(t,r,n,i){l(this,"c\
ode");l(this,"size");l(this,"digest");l(this,"bytes");this.code=t,this.size=r,this.digest=Ge(n),this.bytes=Ge(i)}};function vr(e,t){
const{bytes:r,version:n}=e;switch(n){case 0:return Go(r,Ft(e),t??ce.encoder);default:return Fo(r,Ft(e),t??Ae.encoder)}}const xr=new WeakMap;
function Ft(e){const t=xr.get(e);if(t==null){const r=new Map;return xr.set(e,r),r}return t}var fn;let $o=class G{constructor(t,r,n,i){
l(this,"code");l(this,"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,fn,"CID");this.code=r,this.version=
t,this.multihash=n,this.bytes=Ge(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
Oe)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==jo)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return G.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=Do(t,
r);return G.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return G.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&Lo(t.multihash,n.multihash)}toString(t){return vr(this,t)}toJSON(){return{"/":vr(
this)}}link(){return this}[(fn=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof G)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new G(n,i,o,s??Sr(n,i,o.bytes))}else if(r[qo]===!0){const{version:n,
multihash:i,code:o}=r,s=zo(i);return G.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==Oe)throw new Error(`Version 0 CID must use dag-pb (code: ${Oe}) block encoding`);return new G(t,r,n,n.bytes)}case 1:{
const i=Sr(t,r,n.bytes);return new G(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return G.create(
0,Oe,t)}static createV1(t,r){return G.create(1,t,r)}static decode(t){const[r,n]=G.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=G.inspectBytes(t),n=r.size-r.multihashSize,i=Pe(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new ir(r.multihashCode,r.digestSize,o,i);return[r.version===0?G.createV0(s):G.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[E,u]=Gt(t.subarray(r));return r+=u,E};let i=n(),o=Oe;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),h=r+f,m=h-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:m,size:h}}static parse(t,r){const[n,i]=Po(t,r),o=G.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ft(o).set(n,t),o}};function Po(e,t){
switch(e[0]){case"Q":{const r=t??ce;return[ce.prefix,r.decode(`${ce.prefix}${e}`)]}case ce.prefix:{const r=t??ce;return[
ce.prefix,r.decode(e)]}case Ae.prefix:{const r=t??Ae;return[Ae.prefix,r.decode(e)]}case Je.prefix:{const r=t??Je;return[
Je.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function Go(e,t,r){const{prefix:n}=r;if(n!==ce.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function Fo(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const Oe=112,jo=18;function Sr(e,t,r){const n=dt(e),i=n+dt(t),o=new Uint8Array(i+r.byteLength);return ct(e,o,0),
ct(t,o,n),o.set(r,i),o}const qo=Symbol.for("@ipld/js-cid/CID"),jt={...wo,...Qi,...go,...Pi,...ji,...so,...co,...uo,...bo,
...Yi};function vn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}const Ar=vn("u\
tf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),_t=vn("ascii","a",e=>{let t="\
a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=bn(e.length);for(let r=0;r<
e.length;r++)t[r]=e.charCodeAt(r);return t}),xn={utf8:Ar,"utf-8":Ar,hex:jt.base16,latin1:_t,ascii:_t,binary:_t,...jt};function Sn(e,t="\
utf8"){const r=xn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.decoder.decode(`${r.prefix}${e}`)}
function ft(e,t="utf8"){const r=xn[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.encoder.encode(
e).substring(1)}class Ee extends Error{constructor(){super(...arguments);l(this,"name","InvalidMultiaddrError")}}l(Ee,"n\
ame","InvalidMultiaddrError");class Ie extends Error{constructor(){super(...arguments);l(this,"name","ValidationError")}}
l(Ie,"name","ValidationError");class An extends Error{constructor(){super(...arguments);l(this,"name","UnknownProtocolEr\
ror")}}l(An,"name","UnknownProtocolError");const Qo=4,Vo=6,Wo=273,Ho=33,Ko=41,Xo=42,Yo=43,Jo=53,Zo=54,es=55,ts=56,rs=132,
ns=301,is=302,os=400,ss=421,as=444,cs=445,ds=446,fs=447,us=448,ls=449,hs=454,ps=460,bs=461,ms=465,gs=466,ys=480,ws=481,Es=443,
vs=477,xs=478,Ss=479,As=277,Is=275,Cs=276,_s=280,Ts=281,Os=290,Bs=777;function Ir(e){return t=>ft(t,e)}function Cr(e){return t=>Sn(
t,e)}function ze(e){return new DataView(e.buffer).getUint16(e.byteOffset).toString()}function Se(e){const t=new ArrayBuffer(
2);return new DataView(t).setUint16(0,typeof e=="string"?parseInt(e):e),new Uint8Array(t)}function Us(e){const t=e.split(
":");if(t.length!==2)throw new Error(`failed to parse onion addr: ["'${t.join('", "')}'"]' does not contain a port numbe\
r`);if(t[0].length!==16)throw new Error(`failed to parse onion addr: ${t[0]} not a Tor onion address.`);const r=Sn(t[0],
"base32"),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=Se(n);return mn(
[r,i],r.length+i.length)}function Ms(e){const t=e.split(":");if(t.length!==2)throw new Error(`failed to parse onion addr\
: ["'${t.join('", "')}'"]' does not contain a port number`);if(t[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${t[0]} not a Tor onion3 address.`);const r=Ae.decode(`b${t[0]}`),n=parseInt(t[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=Se(n);return mn([r,i],r.length+i.length)}function _r(e){const t=e.subarray(
0,e.length-2),r=e.subarray(e.length-2),n=ft(t,"base32"),i=ze(r);return`${n}:${i}`}const In=function(e){e=e.toString().trim();
const t=new Uint8Array(4);return e.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new Ee(
"Invalid byte value in IP address");t[n]=i}),t},Rs=function(e){let t=0;e=e.toString().trim();const r=e.split(":",8);let n;
for(n=0;n<r.length;n++){const o=pn(r[n]);let s;o&&(s=In(r[n]),r[n]=ft(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,ft(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(t+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new Ee("Invalid byte value in IP address");i[t++]=o>>8&255,i[t++]=o&255}return i},ks=function(e){
if(e.byteLength!==4)throw new Ee("IPv4 address was incorrect length");const t=[];for(let r=0;r<e.byteLength;r++)t.push(e[r]);
return t.join(".")},Ns=function(e){if(e.byteLength!==16)throw new Ee("IPv6 address was incorrect length");const t=[];for(let n=0;n<
e.byteLength;n+=2){const i=e[n],o=e[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;t.push(s)}
const r=t.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new Ee(
`Invalid IPv6 address "${r}"`)}};function Ds(e){try{const t=new URL(`http://[${e}]`);return t.hostname.substring(1,t.hostname.
length-1)}catch{throw new Ee(`Invalid IPv6 address "${e}"`)}}const Tt=Object.values(jt).map(e=>e.decoder),zs=(function(){
let e=Tt[0].or(Tt[1]);return Tt.slice(2).forEach(t=>e=e.or(t)),e})();function Ls(e){return zs.decode(e)}function $s(e){return t=>e.
encoder.encode(t)}function Ps(e){if(parseInt(e).toString()!==e)throw new Ie("Value must be an integer")}function Gs(e){if(e<
0)throw new Ie("Value must be a positive integer, or zero")}function Fs(e){return t=>{if(t>e)throw new Ie(`Value must be\
 smaller than or equal to ${e}`)}}function js(...e){return t=>{for(const r of e)r(t)}}const We=js(Ps,Gs,Fs(65535)),W=-1;
class qs{constructor(){l(this,"protocolsByCode",new Map);l(this,"protocolsByName",new Map)}getProtocol(t){let r;if(typeof t==
"string"?r=this.protocolsByName.get(t):r=this.protocolsByCode.get(t),r==null)throw new An(`Protocol ${t} was unknown`);return r}addProtocol(t){
var r;this.protocolsByCode.set(t.code,t),this.protocolsByName.set(t.name,t),(r=t.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,t)})}removeProtocol(t){var n;const r=this.protocolsByCode.get(t);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const Qs=new qs,Vs=[
{code:Qo,name:"ip4",size:32,valueToBytes:In,bytesToValue:ks,validate:e=>{if(!pn(e))throw new Ie(`Invalid IPv4 address "${e}\
"`)}},{code:Vo,name:"tcp",size:16,valueToBytes:Se,bytesToValue:ze,validate:We},{code:Wo,name:"udp",size:16,valueToBytes:Se,
bytesToValue:ze,validate:We},{code:Ho,name:"dccp",size:16,valueToBytes:Se,bytesToValue:ze,validate:We},{code:Ko,name:"ip\
6",size:128,valueToBytes:Rs,bytesToValue:Ns,stringToValue:Ds,validate:e=>{if(!xi(e))throw new Ie(`Invalid IPv6 address "${e}\
"`)}},{code:Xo,name:"ip6zone",size:W},{code:Yo,name:"ipcidr",size:8,bytesToValue:Ir("base10"),valueToBytes:Cr("base10")},
{code:Jo,name:"dns",size:W},{code:Zo,name:"dns4",size:W},{code:es,name:"dns6",size:W},{code:ts,name:"dnsaddr",size:W},{code:rs,
name:"sctp",size:16,valueToBytes:Se,bytesToValue:ze,validate:We},{code:ns,name:"udt"},{code:is,name:"utp"},{code:os,name:"\
unix",size:W,stringToValue:e=>decodeURIComponent(e),valueToString:e=>encodeURIComponent(e)},{code:ss,name:"p2p",aliases:[
"ipfs"],size:W,bytesToValue:Ir("base58btc"),valueToBytes:e=>e.startsWith("Q")||e.startsWith("1")?Cr("base58btc")(e):$o.parse(
e).multihash.bytes},{code:as,name:"onion",size:96,bytesToValue:_r,valueToBytes:Us},{code:cs,name:"onion3",size:296,bytesToValue:_r,
valueToBytes:Ms},{code:ds,name:"garlic64",size:W},{code:fs,name:"garlic32",size:W},{code:us,name:"tls"},{code:ls,name:"s\
ni",size:W},{code:hs,name:"noise"},{code:ps,name:"quic"},{code:bs,name:"quic-v1"},{code:ms,name:"webtransport"},{code:gs,
name:"certhash",size:W,bytesToValue:$s(wn),valueToBytes:Ls},{code:ys,name:"http"},{code:ws,name:"http-path",size:W,stringToValue:e=>`\
/${decodeURIComponent(e)}`,valueToString:e=>encodeURIComponent(e.substring(1))},{code:Es,name:"https"},{code:vs,name:"ws"},
{code:xs,name:"wss"},{code:Ss,name:"p2p-websocket-star"},{code:As,name:"p2p-stardust"},{code:Is,name:"p2p-webrtc-star"},
{code:Cs,name:"p2p-webrtc-direct"},{code:_s,name:"webrtc-direct"},{code:Ts,name:"webrtc"},{code:Os,name:"p2p-circuit"},{
code:Bs,name:"memory",size:W}];Vs.forEach(e=>{Qs.addProtocol(e)});function qt(e){if(e instanceof Uint8Array&&e.constructor.
name==="Uint8Array")return Or(e);if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Or(
new Uint8Array(e.buffer,e.byteOffset,e.byteLength));throw new Error("Unknown type, must be binary type")}function Ws(e){
const t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}const Tr=4096;function Hs(e){const t=e.
length;if(t<=Tr)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.
subarray(n,n+=Tr));return r}function Ks(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}function Or(e){return Ks(
e)?e:e.slice()}function Xs(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==
a&&(n[h]=o)}}var m=e.length,E=e.charAt(0),u=Math.log(m)/Math.log(256),y=Math.log(256)/Math.log(m);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,w=0,
p=0,v=c.length;p!==v&&c[p]===0;)p++,d++;for(var A=(v-p)*y+1>>>0,S=new Uint8Array(A);p!==v;){for(var x=c[p],_=0,C=A-1;(x!==
0||_<w)&&C!==-1;C--,_++)x+=256*S[C]>>>0,S[C]=x%m>>>0,x=x/m>>>0;if(x!==0)throw new Error("Non-zero carry");w=_,p++}for(var T=A-
w;T!==A&&S[T]===0;)T++;for(var U=E.repeat(d);T<A;++T)U+=e.charAt(S[T]);return U}function I(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var w=0,p=0;c[d]===E;)w++,d++;for(var v=(c.
length-d)*u+1>>>0,A=new Uint8Array(v);c[d];){var S=n[c.charCodeAt(d)];if(S===255)return;for(var x=0,_=v-1;(S!==0||x<p)&&
_!==-1;_--,x++)S+=m*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");p=x,d++}if(c[d]!==" "){
for(var C=v-p;C!==v&&A[C]===0;)C++;for(var T=new Uint8Array(w+(v-C)),U=w;C!==v;)T[U++]=A[C++];return T}}}function g(c){var d=I(
c);if(d)return d;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:I,decode:g}}var Ys=Xs,Js=Ys;let Zs=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},ea=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Cn(this,t)}},ta=class{constructor(t){l(this,"decoders");this.
decoders=t}or(t){return Cn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Cn(e,t){return new ta({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let ra=class{constructor(t,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Zs(t,r,n),this.decoder=new ea(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function Et({name:e,prefix:t,encode:r,decode:n}){return new ra(
e,t,r,n)}function qe({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Js(r,e,n);return Et({prefix:t,
name:e,encode:i,decode:s=>qt(o(s))})}function na(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const m=t[e[h]];if(m===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|m,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function ia(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<e.length;++f)for(a=a<<8|e[f],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function oa(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function $({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=oa(n,i);return Et(
{prefix:t,name:e,encode(s){return ia(s,n,r)},decode(s){return na(s,o,r,e)}})}qe({prefix:"9",name:"base10",alphabet:"0123\
456789"});$({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});$({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});$({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const _n=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),sa=_n.reduce((e,t,r)=>(e[r]=t,e),[]),aa=_n.reduce((e,t,r)=>{const n=t.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);function ca(e){return e.reduce(
(t,r)=>(t+=sa[r],t),"")}function da(e){const t=[];for(const r of e){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=aa[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);t.push(i)}return new Uint8Array(
t)}Et({prefix:"🚀",name:"base256emoji",encode:ca,decode:da});$({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
tuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});$({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0});$({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0});$({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});
$({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});$({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});$({prefix:"t",name:"\
base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});$({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});$({prefix:"h",name:"base32z",
alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});qe({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijk\
lmnopqrstuvwxyz",caseInsensitive:!0});qe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
caseInsensitive:!0});qe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxy\
z"});qe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});$({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});$({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});$({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});$({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});$({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3});Et({prefix:"\0",name:"identity",encode:e=>Hs(qt(e)),decode:e=>qt(Ws(
e))});new TextEncoder;new TextDecoder;const fa="/",ua=new TextEncoder().encode(fa);ua[0];function la(e){if(e instanceof Uint8Array&&
e.constructor.name==="Uint8Array")return e;if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))
return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new Error("Unknown type, must be binary type")}function ha(e){
return new TextEncoder().encode(e)}function pa(e){return new TextDecoder().decode(e)}function ba(e,t){if(e.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<e.length;i++){var o=e.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=e.length,f=e.charAt(0),h=Math.log(
a)/Math.log(256),m=Math.log(256)/Math.log(a);function E(b){if(b instanceof Uint8Array||(ArrayBuffer.isView(b)?b=new Uint8Array(
b.buffer,b.byteOffset,b.byteLength):Array.isArray(b)&&(b=Uint8Array.from(b))),!(b instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(b.length===0)return"";for(var I=0,g=0,c=0,d=b.length;c!==d&&b[c]===0;)c++,I++;for(var w=(d-c)*
m+1>>>0,p=new Uint8Array(w);c!==d;){for(var v=b[c],A=0,S=w-1;(v!==0||A<g)&&S!==-1;S--,A++)v+=256*p[S]>>>0,p[S]=v%a>>>0,v=
v/a>>>0;if(v!==0)throw new Error("Non-zero carry");g=A,c++}for(var x=w-g;x!==w&&p[x]===0;)x++;for(var _=f.repeat(I);x<w;++x)
_+=e.charAt(p[x]);return _}function u(b){if(typeof b!="string")throw new TypeError("Expected String");if(b.length===0)return new Uint8Array;
var I=0;if(b[I]!==" "){for(var g=0,c=0;b[I]===f;)g++,I++;for(var d=(b.length-I)*h+1>>>0,w=new Uint8Array(d);b[I];){var p=r[b.
charCodeAt(I)];if(p===255)return;for(var v=0,A=d-1;(p!==0||v<c)&&A!==-1;A--,v++)p+=a*w[A]>>>0,w[A]=p%256>>>0,p=p/256>>>0;
if(p!==0)throw new Error("Non-zero carry");c=v,I++}if(b[I]!==" "){for(var S=d-c;S!==d&&w[S]===0;)S++;for(var x=new Uint8Array(
g+(d-S)),_=g;S!==d;)x[_++]=w[S++];return x}}}function y(b){var I=u(b);if(I)return I;throw new Error(`Non-${t} character`)}
return{encode:E,decodeUnsafe:u,decode:y}}var ma=ba,ga=ma;let ya=class{constructor(t,r,n){l(this,"name");l(this,"prefix");
l(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},wa=class{constructor(t,r,n){l(this,"name");l(this,"pr\
efix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t=="string"){if(t.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(t){return Tn(this,t)}},Ea=class{constructor(t){l(this,"decoders");this.decoders=t}or(t){
return Tn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Tn(e,t){
return new Ea({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let va=class{constructor(t,r,n,i){l(this,"n\
ame");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=t,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ya(t,r,n),this.decoder=new wa(t,r,i)}encode(t){return this.encoder.
encode(t)}decode(t){return this.decoder.decode(t)}};function vt({name:e,prefix:t,encode:r,decode:n}){return new va(e,t,r,
n)}function Qe({name:e,prefix:t,alphabet:r}){const{encode:n,decode:i}=ga(r,e);return vt({prefix:t,name:e,encode:n,decode:o=>la(
i(o))})}function xa(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,f=0;for(let h=0;h<
i;++h){const m=t[e[h]];if(m===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|m,s+=r,s>=8&&(s-=8,o[f++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Sa(e,t,r){const n=t[t.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<e.length;++f)for(a=a<<8|e[f],s+=8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=
t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Aa(e){const t={};for(let r=0;r<e.length;++r)t[e[r]]=r;return t}
function P({name:e,prefix:t,bitsPerChar:r,alphabet:n}){const i=Aa(n);return vt({prefix:t,name:e,encode(o){return Sa(o,n,
r)},decode(o){return xa(o,i,r,e)}})}const Ia=Qe({prefix:"9",name:"base10",alphabet:"0123456789"}),Ca=Object.freeze(Object.
defineProperty({__proto__:null,base10:Ia},Symbol.toStringTag,{value:"Module"})),_a=P({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),Ta=P({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Oa=Object.
freeze(Object.defineProperty({__proto__:null,base16:_a,base16upper:Ta},Symbol.toStringTag,{value:"Module"})),Ba=P({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),Ua=Object.freeze(Object.defineProperty({__proto__:null,base2:Ba},Symbol.toStringTag,
{value:"Module"})),On=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Ma=On.reduce((e,t,r)=>(e[r]=t,e),[]),
Ra=On.reduce((e,t,r)=>{const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);return e[n]=r,e},[]);
function ka(e){return e.reduce((t,r)=>(t+=Ma[r],t),"")}function Na(e){const t=[];for(const r of e){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Ra[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);t.push(i)}return new Uint8Array(t)}const Da=vt({prefix:"🚀",name:"base256emoji",encode:ka,decode:Na}),za=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Da},Symbol.toStringTag,{value:"Module"})),La=P({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),$a=P({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Pa=P({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),Ga=P({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Fa=P(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),ja=P({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),qa=P({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Qa=P({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),Va=P({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
Wa=Object.freeze(Object.defineProperty({__proto__:null,base32:La,base32hex:Fa,base32hexpad:qa,base32hexpadupper:Qa,base32hexupper:ja,
base32pad:Pa,base32padupper:Ga,base32upper:$a,base32z:Va},Symbol.toStringTag,{value:"Module"})),Ha=Qe({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Ka=Qe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),Xa=Object.freeze(Object.defineProperty({__proto__:null,base36:Ha,base36upper:Ka},Symbol.toStringTag,
{value:"Module"})),Ya=Qe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),Ja=Qe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Za=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:Ya,base58flickr:Ja},Symbol.toStringTag,{value:"Module"})),ec=P({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),tc=P({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),rc=P({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),nc=P({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ic=Object.
freeze(Object.defineProperty({__proto__:null,base64:ec,base64pad:tc,base64url:rc,base64urlpad:nc},Symbol.toStringTag,{value:"\
Module"})),oc=P({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),sc=Object.freeze(Object.defineProperty({__proto__:null,
base8:oc},Symbol.toStringTag,{value:"Module"})),ac=vt({prefix:"\0",name:"identity",encode:e=>pa(e),decode:e=>ha(e)}),cc=Object.
freeze(Object.defineProperty({__proto__:null,identity:ac},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Br={...cc,...Ua,...sc,...Ca,...Oa,...Wa,...Xa,...Za,...ic,...za};function Qt(e=0){return new Uint8Array(e)}function ut(e=0){
return new Uint8Array(e)}function Bn(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}
const Ur=Bn("utf8","u",e=>"u"+new TextDecoder("utf8").decode(e),e=>new TextEncoder().encode(e.substring(1))),Ot=Bn("asci\
i","a",e=>{let t="a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},e=>{e=e.substring(1);const t=ut(e.
length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}),dc={utf8:Ur,"utf-8":Ur,hex:Br.base16,latin1:Ot,ascii:Ot,
binary:Ot,...Br};function fc(e,t="utf8"){const r=dc[t];if(r==null)throw new Error(`Unsupported encoding "${t}"`);return r.
decoder.decode(`${r.prefix}${e}`)}const uc=Math.pow(2,7),lc=Math.pow(2,14),hc=Math.pow(2,21),Un=Math.pow(2,28),Mn=Math.pow(
2,35),Rn=Math.pow(2,42),kn=Math.pow(2,49),Q=128,pe=127;function or(e){if(e<uc)return 1;if(e<lc)return 2;if(e<hc)return 3;
if(e<Un)return 4;if(e<Mn)return 5;if(e<Rn)return 6;if(e<kn)return 7;if(Number.MAX_SAFE_INTEGER!=null&&e>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function pc(e,t,r=0){switch(or(e)){case 8:t[r++]=e&255|Q,e/=128;case 7:
t[r++]=e&255|Q,e/=128;case 6:t[r++]=e&255|Q,e/=128;case 5:t[r++]=e&255|Q,e/=128;case 4:t[r++]=e&255|Q,e>>>=7;case 3:t[r++]=
e&255|Q,e>>>=7;case 2:t[r++]=e&255|Q,e>>>=7;case 1:{t[r++]=e&255,e>>>=7;break}default:throw new Error("unreachable")}return t}
function bc(e,t){let r=e[t],n=0;if(n+=r&pe,r<Q||(r=e[t+1],n+=(r&pe)<<7,r<Q)||(r=e[t+2],n+=(r&pe)<<14,r<Q)||(r=e[t+3],n+=
(r&pe)<<21,r<Q)||(r=e[t+4],n+=(r&pe)*Un,r<Q)||(r=e[t+5],n+=(r&pe)*Mn,r<Q)||(r=e[t+6],n+=(r&pe)*Rn,r<Q)||(r=e[t+7],n+=(r&
pe)*kn,r<Q))return n;throw new RangeError("Could not decode varint")}const sr=new Float32Array([-0]),ge=new Uint8Array(sr.
buffer);function mc(e,t,r){sr[0]=e,t[r]=ge[0],t[r+1]=ge[1],t[r+2]=ge[2],t[r+3]=ge[3]}function gc(e,t){return ge[0]=e[t],
ge[1]=e[t+1],ge[2]=e[t+2],ge[3]=e[t+3],sr[0]}const ar=new Float64Array([-0]),j=new Uint8Array(ar.buffer);function yc(e,t,r){
ar[0]=e,t[r]=j[0],t[r+1]=j[1],t[r+2]=j[2],t[r+3]=j[3],t[r+4]=j[4],t[r+5]=j[5],t[r+6]=j[6],t[r+7]=j[7]}function wc(e,t){return j[0]=
e[t],j[1]=e[t+1],j[2]=e[t+2],j[3]=e[t+3],j[4]=e[t+4],j[5]=e[t+5],j[6]=e[t+6],j[7]=e[t+7],ar[0]}const Ec=BigInt(Number.MAX_SAFE_INTEGER),
vc=BigInt(Number.MIN_SAFE_INTEGER);class q{constructor(t,r){l(this,"lo");l(this,"hi");this.lo=t|0,this.hi=r|0}toNumber(t=!1){
if(!t&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(t=!1){if(t)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(t=!1){return this.toBigInt(t).toString()}zzEncode(){const t=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this}zzDecode(){const t=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this}length(){const t=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?t<16384?t<128?1:2:t<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(t){if(t===
0n)return we;if(t<Ec&&t>vc)return this.fromNumber(Number(t));const r=t<0n;r&&(t=-t);let n=t>>32n,i=t-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>Mr&&(i=0n,++n>Mr&&(n=0n))),new q(Number(i),Number(n))}static fromNumber(t){if(t===0)return we;const r=t<
0;r&&(t=-t);let n=t>>>0,i=(t-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new q(n,i)}static from(t){return typeof t=="number"?q.fromNumber(t):typeof t=="bigint"?q.fromBigInt(t):typeof t=="string"?
q.fromBigInt(BigInt(t)):t.low!=null||t.high!=null?new q(t.low>>>0,t.high>>>0):we}}const we=new q(0,0);we.toBigInt=function(){
return 0n};we.zzEncode=we.zzDecode=function(){return this};we.length=function(){return 1};const Mr=4294967296n;function xc(e){
let t=0,r=0;for(let n=0;n<e.length;++n)r=e.charCodeAt(n),r<128?t+=1:r<2048?t+=2:(r&64512)===55296&&(e.charCodeAt(n+1)&64512)===
56320?(++n,t+=4):t+=3;return t}function Sc(e,t,r){if(r-t<1)return"";let i;const o=[];let s=0,a;for(;t<r;)a=e[t++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|e[t++]&63:a>239&&a<365?(a=((a&7)<<18|(e[t++]&63)<<12|(e[t++]&63)<<6|e[t++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(e[t++]&63)<<6|e[t++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Nn(e,t,r){const n=r;let i,o;for(let s=0;s<e.length;++s)i=e.charCodeAt(
s),i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===55296&&((o=e.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=
i>>6&63|128,t[r++]=i&63|128);return r-n}function Z(e,t){return RangeError(`index out of range: ${e.pos} + ${t??1} > ${e.
len}`)}function He(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}class Ac{constructor(t){l(this,"buf");l(this,
"pos");l(this,"len");l(this,"_slice",Uint8Array.prototype.subarray);this.buf=t,this.pos=0,this.len=t.length}uint32(){let t=4294967295;
if(t=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(t=(t|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(t=(t|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(t=(t|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(t=(t|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return t;if((this.pos+=5)>this.len)throw this.
pos=this.len,Z(this,10);return t}int32(){return this.uint32()|0}sint32(){const t=this.uint32();return t>>>1^-(t&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw Z(this,4);return He(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw Z(this,4);return He(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Z(this,4);const t=gc(
this.buf,this.pos);return this.pos+=4,t}double(){if(this.pos+8>this.len)throw Z(this,4);const t=wc(this.buf,this.pos);return this.
pos+=8,t}bytes(){const t=this.uint32(),r=this.pos,n=this.pos+t;if(n>this.len)throw Z(this,t);return this.pos+=t,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const t=this.bytes();return Sc(t,0,t.length)}skip(t){if(typeof t=="number"){if(this.pos+
t>this.len)throw Z(this,t);this.pos+=t}else do if(this.pos>=this.len)throw Z(this);while((this.buf[this.pos++]&128)!==0);
return this}skipType(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:
for(;(t=this.uint32()&7)!==4;)this.skipType(t);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${t}\
 at offset ${this.pos}`)}return this}readLongVarint(){const t=new q(0,0);let r=0;if(this.len-this.pos>4){for(;r<4;++r)if(t.
lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(this.buf[this.pos]&127)<<28)>>>
0,t.hi=(t.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return t;r=0}else{for(;r<3;++r){if(this.pos>=this.
len)throw Z(this);if(t.lo=(t.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return t}return t.lo=(t.lo|(this.
buf[this.pos++]&127)<<r*7)>>>0,t}if(this.len-this.pos>4){for(;r<5;++r)if(t.hi=(t.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,
this.buf[this.pos++]<128)return t}else for(;r<5;++r){if(this.pos>=this.len)throw Z(this);if(t.hi=(t.hi|(this.buf[this.pos]&
127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.
len)throw Z(this,8);const t=He(this.buf,this.pos+=4),r=He(this.buf,this.pos+=4);return new q(t,r)}int64(){return this.readLongVarint().
toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){
return this.readLongVarint().toBigInt(!0)}uint64Number(){const t=bc(this.buf,this.pos);return this.pos+=or(t),t}uint64String(){
return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.
readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.
readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().
toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){
return this.readFixed64().toString()}}function Ic(e){return new Ac(e instanceof Uint8Array?e:e.subarray())}function cr(e,t,r){
const n=Ic(e);return t.decode(n,void 0,r)}function Cc(e){let n,i=8192;return function(s){if(s<1||s>4096)return ut(s);i+s>
8192&&(n=ut(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class Le{constructor(t,r,n){l(this,"fn");
l(this,"len");l(this,"next");l(this,"val");this.fn=t,this.len=r,this.next=void 0,this.val=n}}function Bt(){}class _c{constructor(t){
l(this,"head");l(this,"tail");l(this,"len");l(this,"next");this.head=t.head,this.tail=t.tail,this.len=t.len,this.next=t.
states}}const Tc=Cc();function Oc(e){return globalThis.Buffer!=null?ut(e):Tc(e)}class Vt{constructor(){l(this,"len");l(this,
"head");l(this,"tail");l(this,"states");this.len=0,this.head=new Le(Bt,0,0),this.tail=this.head,this.states=null}_push(t,r,n){
return this.tail=this.tail.next=new Le(t,r,n),this.len+=r,this}uint32(t){return this.len+=(this.tail=this.tail.next=new Uc(
(t=t>>>0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this}int32(t){return t<0?this._push(Ke,10,q.fromNumber(t)):
this.uint32(t)}sint32(t){return this.uint32((t<<1^t>>31)>>>0)}uint64(t){const r=q.fromBigInt(t);return this._push(Ke,r.length(),
r)}uint64Number(t){return this._push(pc,or(t),t)}uint64String(t){return this.uint64(BigInt(t))}int64(t){return this.uint64(
t)}int64Number(t){return this.uint64Number(t)}int64String(t){return this.uint64String(t)}sint64(t){const r=q.fromBigInt(
t).zzEncode();return this._push(Ke,r.length(),r)}sint64Number(t){const r=q.fromNumber(t).zzEncode();return this._push(Ke,
r.length(),r)}sint64String(t){return this.sint64(BigInt(t))}bool(t){return this._push(Ut,1,t?1:0)}fixed32(t){return this.
_push(Be,4,t>>>0)}sfixed32(t){return this.fixed32(t)}fixed64(t){const r=q.fromBigInt(t);return this._push(Be,4,r.lo)._push(
Be,4,r.hi)}fixed64Number(t){const r=q.fromNumber(t);return this._push(Be,4,r.lo)._push(Be,4,r.hi)}fixed64String(t){return this.
fixed64(BigInt(t))}sfixed64(t){return this.fixed64(t)}sfixed64Number(t){return this.fixed64Number(t)}sfixed64String(t){return this.
fixed64String(t)}float(t){return this._push(mc,4,t)}double(t){return this._push(yc,8,t)}bytes(t){const r=t.length>>>0;return r===
0?this._push(Ut,1,0):this.uint32(r)._push(Mc,r,t)}string(t){const r=xc(t);return r!==0?this.uint32(r)._push(Nn,r,t):this.
_push(Ut,1,0)}fork(){return this.states=new _c(this),this.head=this.tail=new Le(Bt,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Le(Bt,0,0),this.len=0),this}ldelim(){const t=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=t.next,this.tail=r,this.len+=n),this}finish(){let t=this.head.next;const r=Oc(this.len);
let n=0;for(;t!=null;)t.fn(t.val,r,n),n+=t.len,t=t.next;return r}}function Ut(e,t,r){t[r]=e&255}function Bc(e,t,r){for(;e>
127;)t[r++]=e&127|128,e>>>=7;t[r]=e}class Uc extends Le{constructor(r,n){super(Bc,r,n);l(this,"next");this.next=void 0}}
function Ke(e,t,r){for(;e.hi!==0;)t[r++]=e.lo&127|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[r++]=e.lo&
127|128,e.lo=e.lo>>>7;t[r++]=e.lo}function Be(e,t,r){t[r]=e&255,t[r+1]=e>>>8&255,t[r+2]=e>>>16&255,t[r+3]=e>>>24}function Mc(e,t,r){
t.set(e,r)}globalThis.Buffer!=null&&(Vt.prototype.bytes=function(e){const t=e.length>>>0;return this.uint32(t),t>0&&this.
_push(Rc,t,e),this},Vt.prototype.string=function(e){const t=globalThis.Buffer.byteLength(e);return this.uint32(t),t>0&&this.
_push(kc,t,e),this});function Rc(e,t,r){t.set(e,r)}function kc(e,t,r){e.length<40?Nn(e,t,r):t.utf8Write!=null?t.utf8Write(
e,r):t.set(fc(e),r)}function Nc(){return new Vt}function dr(e,t){const r=Nc();return t.encode(e,r,{lengthDelimited:!1}),
r.finish()}var Wt;(function(e){e[e.VARINT=0]="VARINT",e[e.BIT64=1]="BIT64",e[e.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",e[e.
START_GROUP=3]="START_GROUP",e[e.END_GROUP=4]="END_GROUP",e[e.BIT32=5]="BIT32"})(Wt||(Wt={}));function Dc(e,t,r,n){return{
name:e,type:t,encode:r,decode:n}}function fr(e,t){return Dc("message",Wt.LENGTH_DELIMITED,e,t)}class Ht extends Error{constructor(){
super(...arguments);l(this,"code","ERR_MAX_LENGTH");l(this,"name","MaxLengthError")}}var un,ln;(ln=(un=globalThis.process)==
null?void 0:un.env)!=null&&ln.DUMP_SESSION_KEYS;var lt;(function(e){let t;e.codec=()=>(t==null&&(t=fr((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,f;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const h=r.uint32();switch(h>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new Ht('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((f=i.limits)==null?void 0:f.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new Ht('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(h&7);break}}}return o})),t),e.encode=r=>dr(r,e.codec()),e.decode=(r,n)=>cr(r,e.codec(),n)})(lt||(lt={}));var Rr;
(function(e){let t;e.codec=()=>(t==null&&(t=fr((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),lt.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:Qt(0),identitySig:Qt(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();
switch(f>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=lt.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(f&7);break}}}return o})),
t),e.encode=r=>dr(r,e.codec()),e.decode=(r,n)=>cr(r,e.codec(),n)})(Rr||(Rr={}));var kr;(function(e){let t;e.codec=()=>(t==
null&&(t=fr((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:Qt(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();switch(f>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new Ht(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(f&7);break}}}
return o})),t),e.encode=r=>dr(r,e.codec()),e.decode=(r,n)=>cr(r,e.codec(),n)})(kr||(kr={}));new TextEncoder;new TextDecoder(
"utf-8",{fatal:!0});new TextEncoder;new TextDecoder;function zc(e,t){if(e===t)return!0;if(e.byteLength!==t.byteLength)return!1;for(let r=0;r<e.byteLength;r++)if(e[r]!==t[r])
return!1;return!0}function ur(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return Fe(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return Fe(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function Lc(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function Fe(e){return Lc(e)?e:e.slice()}function $c(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==
a&&(n[h]=o)}}var m=e.length,E=e.charAt(0),u=Math.log(m)/Math.log(256),y=Math.log(256)/Math.log(m);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,w=0,
p=0,v=c.length;p!==v&&c[p]===0;)p++,d++;for(var A=(v-p)*y+1>>>0,S=new Uint8Array(A);p!==v;){for(var x=c[p],_=0,C=A-1;(x!==
0||_<w)&&C!==-1;C--,_++)x+=256*S[C]>>>0,S[C]=x%m>>>0,x=x/m>>>0;if(x!==0)throw new Error("Non-zero carry");w=_,p++}for(var T=A-
w;T!==A&&S[T]===0;)T++;for(var U=E.repeat(d);T<A;++T)U+=e.charAt(S[T]);return U}function I(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var w=0,p=0;c[d]===E;)w++,d++;for(var v=(c.
length-d)*u+1>>>0,A=new Uint8Array(v);c[d];){var S=n[c.charCodeAt(d)];if(S===255)return;for(var x=0,_=v-1;(S!==0||x<p)&&
_!==-1;_--,x++)S+=m*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");p=x,d++}if(c[d]!==" "){
for(var C=v-p;C!==v&&A[C]===0;)C++;for(var T=new Uint8Array(w+(v-C)),U=w;C!==v;)T[U++]=A[C++];return T}}}function g(c){var d=I(
c);if(d)return d;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:I,decode:g}}var Pc=$c,Gc=Pc;let Fc=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}},jc=class{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return Dn(this,t)}},qc=class{constructor(t){l(this,"decoders");this.
decoders=t}or(t){return Dn(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Dn(e,t){return new qc({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}let Qc=class{constructor(t,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Fc(t,r,n),this.decoder=new jc(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}};function zn({name:e,prefix:t,encode:r,decode:n}){return new Qc(
e,t,r,n)}function xt({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Gc(r,e,n);return zn({prefix:t,
name:e,encode:i,decode:s=>ur(o(s))})}function Vc(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const m=t[e[h]];if(m===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|m,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Wc(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<e.length;++f)for(a=a<<8|e[f],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Hc(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function fe({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Hc(n,i);return zn(
{prefix:t,name:e,encode(s){return Wc(s,n,r)},decode(s){return Vc(s,o,r,e)}})}const Ze=fe({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});fe({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});fe({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});fe({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Mt=xt(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});xt({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const me=xt({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});xt({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Kc=Ln,Nr=128,Xc=-128,Yc=Math.pow(2,31);function Ln(e,t,r){t=t||[],r=
r||0;for(var n=r;e>=Yc;)t[r++]=e&255|Nr,e/=128;for(;e&Xc;)t[r++]=e&255|Nr,e>>>=7;return t[r]=e|0,Ln.bytes=r-n+1,t}var Jc=Kt,
Zc=128,Dr=127;function Kt(e,n){var r=0,n=n||0,i=0,o=n,s,a=e.length;do{if(o>=a)throw Kt.bytes=0,new RangeError("Could not\
 decode varint");s=e[o++],r+=i<28?(s&Dr)<<i:(s&Dr)*Math.pow(2,i),i+=7}while(s>=Zc);return Kt.bytes=o-n,r}var ed=Math.pow(
2,7),td=Math.pow(2,14),rd=Math.pow(2,21),nd=Math.pow(2,28),id=Math.pow(2,35),od=Math.pow(2,42),sd=Math.pow(2,49),ad=Math.
pow(2,56),cd=Math.pow(2,63),dd=function(e){return e<ed?1:e<td?2:e<rd?3:e<nd?4:e<id?5:e<od?6:e<sd?7:e<ad?8:e<cd?9:10},fd={
encode:Kc,decode:Jc,encodingLength:dd},ht=fd;function Xt(e,t=0){const r=ht.decode(e,t),n=ht.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&e[t+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function pt(e,t,r=0){return ht.encode(e,t,r),t}function bt(e){return ht.encodingLength(e)}function ud(e,t){const r=t.
byteLength,n=bt(e),i=n+bt(r),o=new Uint8Array(i+r);return pt(e,o,0),pt(r,o,n),o.set(t,i),new lr(e,r,t,o)}function ld(e){
const t=ur(e),[r,n]=Xt(t),[i,o]=Xt(t.subarray(n)),s=t.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new lr(r,i,s,t)}function hd(e,t){if(e===t)return!0;{const r=t;return e.code===r.code&&e.size===r.size&&r.bytes instanceof
Uint8Array&&zc(e.bytes,r.bytes)}}class lr{constructor(t,r,n,i){l(this,"code");l(this,"size");l(this,"digest");l(this,"by\
tes");this.code=t,this.size=r,this.digest=Fe(n),this.bytes=Fe(i)}}function zr(e,t){const{bytes:r,version:n}=e;switch(n){case 0:
return bd(r,Yt(e),t??me.encoder);default:return md(r,Yt(e),t??Ze.encoder)}}const Lr=new WeakMap;function Yt(e){const t=Lr.
get(e);if(t==null){const r=new Map;return Lr.set(e,r),r}return t}var hn;class N{constructor(t,r,n,i){l(this,"code");l(this,
"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,hn,"CID");this.code=r,this.version=t,this.multihash=n,
this.bytes=Fe(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:t,multihash:r}=this;if(t!==
Ue)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==gd)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return N.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:t,digest:r}=this.multihash,n=ud(t,
r);return N.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(t){return N.equals(this,t)}static equals(t,r){const n=r;return n!=null&&
t.code===n.code&&t.version===n.version&&hd(t.multihash,n.multihash)}toString(t){return zr(this,t)}toJSON(){return{"/":zr(
this)}}link(){return this}[(hn=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(t){if(t==null)return null;const r=t;if(r instanceof N)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new N(n,i,o,s??$r(n,i,o.bytes))}else if(r[yd]===!0){const{version:n,
multihash:i,code:o}=r,s=ld(i);return N.create(n,o,s)}else return null}static create(t,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(t){case 0:{
if(r!==Ue)throw new Error(`Version 0 CID must use dag-pb (code: ${Ue}) block encoding`);return new N(t,r,n,n.bytes)}case 1:{
const i=$r(t,r,n.bytes);return new N(t,r,n,i)}default:throw new Error("Invalid version")}}static createV0(t){return N.create(
0,Ue,t)}static createV1(t,r){return N.create(1,t,r)}static decode(t){const[r,n]=N.decodeFirst(t);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(t){const r=N.inspectBytes(t),n=r.size-r.multihashSize,i=ur(t.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new lr(r.multihashCode,r.digestSize,o,i);return[r.version===0?N.createV0(s):N.createV1(r.codec,s),t.subarray(
r.size)]}static inspectBytes(t){let r=0;const n=()=>{const[E,u]=Xt(t.subarray(r));return r+=u,E};let i=n(),o=Ue;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),h=r+f,m=h-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:m,size:h}}static parse(t,r){const[n,i]=pd(t,r),o=N.decode(i);if(o.version===
0&&t[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Yt(o).set(n,t),o}}function pd(e,t){
switch(e[0]){case"Q":{const r=t??me;return[me.prefix,r.decode(`${me.prefix}${e}`)]}case me.prefix:{const r=t??me;return[
me.prefix,r.decode(e)]}case Ze.prefix:{const r=t??Ze;return[Ze.prefix,r.decode(e)]}case Mt.prefix:{const r=t??Mt;return[
Mt.prefix,r.decode(e)]}default:{if(t==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[e[0],t.decode(e)]}}}function bd(e,t,r){const{prefix:n}=r;if(n!==me.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=t.get(n);if(i==null){const o=r.encode(e).slice(1);return t.set(n,
o),o}else return i}function md(e,t,r){const{prefix:n}=r,i=t.get(n);if(i==null){const o=r.encode(e);return t.set(n,o),o}else
return i}const Ue=112,gd=18;function $r(e,t,r){const n=bt(e),i=n+bt(t),o=new Uint8Array(i+r.byteLength);return pt(e,o,0),
pt(t,o,n),o.set(r,i),o}const yd=Symbol.for("@ipld/js-cid/CID"),wd=e=>e/2**32|0,Ed=e=>e>>>0;function vd(e,t,r,n){const i=wd(
r),o=Ed(r);e.setUint32(t,n?o:i,n),e.setUint32(t+4,n?i:o,n)}function Pr(e){return e instanceof Uint8Array||ArrayBuffer.isView(
e)&&e.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in e&&e.BYTES_PER_ELEMENT===1}const xd=e=>e?`"${e}" `:"";function hr(e,t,r=""){
if(Pr(e)&&t===void 0)return e;const n=Pr(e),i="",o=n?`length=${e.length}`:`type=${typeof e}`,s=xd(r)+"expected Uint8Arra\
y"+i+", got "+o;throw n?new RangeError(s):new TypeError(s)}const Sd=(e,t)=>{if(e===null||typeof e!="object"||Array.isArray(
e))throw new TypeError((t==="object"?"":`"${t}" `)+"expected object, got type="+typeof e)},Gr=(e,t)=>{Sd(e,t);const r=Object.
getPrototypeOf(e);if(r!==Object.prototype&&r!==null)throw new TypeError(`"${t}" expected plain object`);if(Object.hasOwn(
e,"__proto__"))throw new TypeError(`"${t}.__proto__" is not allowed`)};function Fr(e,t=!0){if(e.destroyed)throw new Error(
"hash was destroyed");if(t&&e.finished)throw new Error("digest() was already called")}function Ad(e,t){hr(e,void 0,"outp\
ut");const r=t.outputLen;if(!(e.length>=r))throw new RangeError('"output" expected length >= '+r)}function jr(...e){for(let t=0;t<
e.length;t++)e[t].fill(0)}function Rt(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function ie(e,t){return e<<
32-t|e>>>t}const Id=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",Cd=Array.from({length:256},
(e,t)=>t.toString(16).padStart(2,"0"));function _d(e){if(hr(e),Id)return e.toHex();let t="";for(let r=0;r<e.length;r++)t+=
Cd[e[r]];return t}function Td(e,t,r="opts"){return Gr(e,"defaults"),t!==void 0&&Gr(t,r),Object.assign(Object.create(null),
e,t)}function Od(e,t={}){if(typeof e!="function")throw new TypeError('"hashCons" expected function, got type='+typeof e);
t=Td({},t,"info");const r=(i,o)=>e(o).update(i).digest(),n=e(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,
r.canXOF=n.canXOF,r.create=i=>e(i),Object.assign(r,t),Object.freeze(r)}const Bd=e=>({oid:Uint8Array.from([6,9,96,134,72,
1,101,3,4,2,e])});function Ud(e,t,r){return e&t^~e&r}function Md(e,t,r){return e&t^e&r^t&r}class Rd{constructor(t,r,n,i){
l(this,"blockLen");l(this,"outputLen");l(this,"canXOF",!1);l(this,"padOffset");l(this,"isLE");l(this,"buffer");l(this,"v\
iew");l(this,"finished",!1);l(this,"length",0);l(this,"pos",0);l(this,"destroyed",!1);this.blockLen=t,this.outputLen=r,this.
padOffset=n,this.isLE=i,this.buffer=new Uint8Array(t),this.view=Rt(this.buffer)}update(t){Fr(this),hr(t);const{view:r,buffer:n,
blockLen:i}=this,o=t.length;let s=!1;for(let a=0;a<o;){const f=Math.min(i-this.pos,o-a);if(f===i){const h=Rt(t);for(;i<=
o-a;a+=i)this.process(h,a);s=!0;continue}n.set(a===0&&f===o?t:t.subarray(a,a+f),this.pos),this.pos+=f,a+=f,this.pos===i&&
(this.process(r,0),this.pos=0,s=!0)}return this.length+=t.length,s&&this.roundClean(),this}digestInto(t){Fr(this),Ad(t,this),
this.finished=!0;const{buffer:r,view:n,blockLen:i,isLE:o}=this;let{pos:s}=this;r[s++]=128,r.fill(0,s),this.padOffset>i-s&&
(this.process(n,0),r.fill(0)),vd(n,i-8,this.length*8,o),this.process(n,0),this.roundClean();const a=t===r?n:Rt(t),f=this.
outputLen,h=f/4,m=this.get();if(f%4||h>m.length)throw new Error("invalid outputLen");for(let E=0;E<h;E++)a.setUint32(4*E,
m[E],o)}digest(){const{buffer:t,outputLen:r}=this;this.digestInto(t);const n=t.slice(0,r);return this.destroy(),n}_cloneIntoMeta(t){
const{buffer:r,length:n,finished:i,destroyed:o,pos:s}=this;return t.destroyed=o,t.finished=i,t.length=n,t.pos=s,s&&t.buffer.
set(r),t}clone(){return this._cloneInto()}}const kd=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,
2600822924,528734635,1541459225]),Nd=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,
2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,
113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,
3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,
1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),be=new Uint32Array(
64);class Dd extends Rd{constructor(r,n){super(64,r,8,!1);l(this,"A",0);l(this,"B",0);l(this,"C",0);l(this,"D",0);l(this,
"E",0);l(this,"F",0);l(this,"G",0);l(this,"H",0);this.A=n[0]|0,this.B=n[1]|0,this.C=n[2]|0,this.D=n[3]|0,this.E=n[4]|0,this.
F=n[5]|0,this.G=n[6]|0,this.H=n[7]|0}get(){const{A:r,B:n,C:i,D:o,E:s,F:a,G:f,H:h}=this;return[r,n,i,o,s,a,f,h]}set(r,n,i,o,s,a,f,h){
this.A=r|0,this.B=n|0,this.C=i|0,this.D=o|0,this.E=s|0,this.F=a|0,this.G=f|0,this.H=h|0}_cloneInto(r){return(r||(r=new this.
constructor)).set(...this.get()),this._cloneIntoMeta(r)}process(r,n){for(let u=0;u<16;u++,n+=4)be[u]=r.getUint32(n,!1);for(let u=16;u<
64;u++){const y=be[u-15],b=be[u-2],I=ie(y,7)^ie(y,18)^y>>>3,g=ie(b,17)^ie(b,19)^b>>>10;be[u]=g+be[u-7]+I+be[u-16]|0}let{
A:i,B:o,C:s,D:a,E:f,F:h,G:m,H:E}=this;for(let u=0;u<64;u++){const y=ie(f,6)^ie(f,11)^ie(f,25),b=E+y+Ud(f,h,m)+Nd[u]+be[u]|
0,g=(ie(i,2)^ie(i,13)^ie(i,22))+Md(i,o,s)|0;E=m,m=h,h=f,f=a+b|0,a=s,s=o,o=i,i=b+g|0}i=i+this.A|0,o=o+this.B|0,s=s+this.C|
0,a=a+this.D|0,f=f+this.E|0,h=h+this.F|0,m=m+this.G|0,E=E+this.H|0,this.set(i,o,s,a,f,h,m,E)}roundClean(){jr(be)}destroy(){
this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),jr(this.buffer)}}class zd extends Dd{constructor(){super(32,kd)}}const Ld=Od(
()=>new zd,Bd(1));function $d(e){if(e instanceof Uint8Array&&e.constructor.name==="Uint8Array")return qr(e);if(e instanceof
ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return qr(new Uint8Array(e.buffer,e.byteOffset,e.byteLength));
throw new Error("Unknown type, must be binary type")}function Pd(e){return(e==null?void 0:e.buffer)instanceof ArrayBuffer}
function qr(e){return Pd(e)?e:e.slice()}function Gd(e,t,r){if(e.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<e.length;o++){var s=e.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==
a&&(n[h]=o)}}var m=e.length,E=e.charAt(0),u=Math.log(m)/Math.log(256),y=Math.log(256)/Math.log(m);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,w=0,
p=0,v=c.length;p!==v&&c[p]===0;)p++,d++;for(var A=(v-p)*y+1>>>0,S=new Uint8Array(A);p!==v;){for(var x=c[p],_=0,C=A-1;(x!==
0||_<w)&&C!==-1;C--,_++)x+=256*S[C]>>>0,S[C]=x%m>>>0,x=x/m>>>0;if(x!==0)throw new Error("Non-zero carry");w=_,p++}for(var T=A-
w;T!==A&&S[T]===0;)T++;for(var U=E.repeat(d);T<A;++T)U+=e.charAt(S[T]);return U}function I(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var w=0,p=0;c[d]===E;)w++,d++;for(var v=(c.
length-d)*u+1>>>0,A=new Uint8Array(v);c[d];){var S=n[c.charCodeAt(d)];if(S===255)return;for(var x=0,_=v-1;(S!==0||x<p)&&
_!==-1;_--,x++)S+=m*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");p=x,d++}if(c[d]!==" "){
for(var C=v-p;C!==v&&A[C]===0;)C++;for(var T=new Uint8Array(w+(v-C)),U=w;C!==v;)T[U++]=A[C++];return T}}}function g(c){var d=I(
c);if(d)return d;throw new Error(`Non-${t} character`)}return{encode:b,decodeUnsafe:I,decode:g}}var Fd=Gd,jd=Fd;class qd{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=t,this.prefix=r,this.baseEncode=n}encode(t){if(t instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(t)}`;throw Error("Unknown type, must be binary type")}}class Qd{constructor(t,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=t,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(t){if(typeof t==
"string"){if(t.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(t)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(t.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(t){return $n(this,t)}}class Vd{constructor(t){l(this,"decoders");this.
decoders=t}or(t){return $n(this,t)}decode(t){const r=t[0],n=this.decoders[r];if(n!=null)return n.decode(t);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(t)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function $n(e,t){return new Vd({...e.decoders??{[e.prefix]:e},...t.decoders??{[t.prefix]:t}})}class Wd{constructor(t,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
t,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new qd(t,r,n),this.decoder=new Qd(t,r,i)}encode(t){return this.
encoder.encode(t)}decode(t){return this.decoder.decode(t)}}function Pn({name:e,prefix:t,encode:r,decode:n}){return new Wd(
e,t,r,n)}function St({name:e,prefix:t,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=jd(r,e,n);return Pn({prefix:t,
name:e,encode:i,decode:s=>$d(o(s))})}function Hd(e,t,r,n){let i=e.length;for(;e[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const m=t[e[h]];if(m===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|m,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Kd(e,t,r){const n=t[t.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<e.length;++f)for(a=a<<8|e[f],s+=
8;s>r;)s-=r,o+=t[i&a>>s];if(s!==0&&(o+=t[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Xd(e,t){const r={};
for(let n=0;n<e.length;++n)if(r[e[n]]=n,t){const i=e[n].toLowerCase(),o=e[n].toUpperCase();i!==e[n]&&(r[i]=n),o!==e[n]&&
(r[o]=n)}return r}function ue({name:e,prefix:t,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Xd(n,i);return Pn(
{prefix:t,name:e,encode(s){return Kd(s,n,r)},decode(s){return Hd(s,o,r,e)}})}ue({prefix:"b",name:"base32",alphabet:"abcd\
efghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ue({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ue({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrst\
uvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ue({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZ234567=",bitsPerChar:5,caseInsensitive:!0});ue({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});ue({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});ue({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
ue({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});
ue({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});St({prefix:"k",name:"base36",alphabet:"\
0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});St({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFG\
HIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});St({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabc\
defghijkmnopqrstuvwxyz"});St({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQ\
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const Yd="peercompute.artifact.manifest.v1",Gn=256*1024,Jd=16*
1024**3,mt=new TextEncoder;function Zd(e){const t=N.asCID(e)||N.parse(String(e));if(![85,112].includes(t.code)||t.multihash.
code!==18||t.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return t.toV1()}function et(e,t=0,r={remaining:Gn}){if(t>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof e=="string"){if(e.length>r.remaining||
(r.remaining-=mt.encode(e).length)<0)throw new RangeError("Manifest exceeds byte limit.");return e}if(e===null||typeof e==
"boolean"||typeof e=="number"&&Number.isFinite(e))return e;if(Array.isArray(e)){if(e.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return e.map(i=>et(i,t+1,r))}if(!e||typeof e!="object"||Object.getPrototypeOf(e)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(e);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(et(i,t+1,r),[i,et(e[i],t+1,r)])))}function ef(e,{
maximumBytes:t=Gn,maximumFiles:r=1024,maximumFileBytes:n=Jd}={}){if(!e||e.schema!==Yd||!Array.isArray(e.files)||e.files.
length===0||e.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(e).some(f=>!i.has(f)))
throw new TypeError("Unsupported manifest field.");for(const f of["name","description"])if(e[f]!==void 0&&typeof e[f]!="\
string")throw new TypeError(`Manifest ${f} must be a string.`);if(e.model!==void 0&&(!e.model||typeof e.model!="object"||
Array.isArray(e.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=e.files.map(
f=>{if(!f||typeof f!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(f).some(E=>!["path","cid","si\
ze","sha256","mediaType"].includes(E)))throw new TypeError("Unsupported manifest file field.");const{path:h,size:m}=f;if(typeof h!=
"string"||!h||mt.encode(h).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(h)||h.split("/").some(E=>!E||E==="."||E==="..")||
o.has(h))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(m)||m<0||m>n)throw new RangeError("Invalid file size.");if(f.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(f.sha256))
throw new TypeError("Invalid SHA-256.");if(f.mediaType!==void 0&&(typeof f.mediaType!="string"||f.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(h),{...f,cid:Zd(f.cid).toString()}}).sort((f,h)=>f.path<h.path?-1:
f.path>h.path?1:0),a=et({...e,files:s},0,{remaining:t});if(mt.encode(JSON.stringify(a)).byteLength>t)throw new RangeError(
"Manifest exceeds byte limit.");return a}function l0(e,t){return mt.encode(JSON.stringify(ef(e,t)))}new TextEncoder;new TextEncoder;
new TextEncoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;const tf="\
peercompute.gpu.resident-stage-executor.v0",rf="peercompute.gpu.resident-stage-worker-policy.v0";function te(e,t=null){return String(
e??"").trim()||t}function kt(e){return e==null?null:JSON.parse(JSON.stringify(e))}function Qr(e,t=!1){return typeof e=="\
boolean"?e:t}function nf(e,t=null){const r=Math.floor(Number(e));return Number.isFinite(r)&&r>=0?r:t}function of(e={},t=null){
const r=e&&typeof e=="object"?e:{},n=te(r.mode??r.residencyMode,null),i=!!(r.worker||r.workerReady||r.workerModuleUrl||r.
workerType),o=n||(i?"dedicated-worker":"inline"),s=Qr(r.workerReady,!1)||!!r.worker,a=o==="dedicated-worker"||o==="webgp\
u-worker"||o==="gpu-compute-worker",f=a?"dedicated-worker":"inline",h=a?s?"worker-ready":"blocked-worker-backend-missing":
"inline-ready";return{schema:rf,stageId:t,mode:f,status:h,workerType:te(r.workerType,a?"webgpu-compute-worker":null),workerModuleUrl:te(
r.workerModuleUrl??r.moduleUrl,null),startupMode:te(r.startupMode,a?"warm-on-first-use":"inline"),idleTtlMs:nf(r.idleTtlMs,
a?6e4:null),sameDeviceRequired:Qr(r.sameDeviceRequired,a),bufferTransferPolicy:te(r.bufferTransferPolicy,a?"worker-owns-\
device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:h==="blocked-worker-backend-mis\
sing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function sf(e,t){
if(typeof e=="function")return e(t);if(e&&typeof e.runStage=="function")return e.runStage(t);throw new Error("[GPUHubMan\
ager] Resident stage worker backend must be a function or expose runStage()")}class af{constructor(t={}){this.frameBudgetMs=
t.frameBudgetMs??4,this.hotStore=t.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,
this.residentStageExecutorAliases=new Map}async initialize(t={}){if(t.device)return this.device=t.device,this.device;if(typeof navigator>
"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.
gpu.requestAdapter(t.adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.
device=await r.requestDevice(t.deviceDescriptor),this.device}setDevice(t){this.device=t}getHotStore(){return this.hotStore}registerHotBuffer(t,r){
this.hotStore.set(t,r)}registerHotBufferSet(t,r){this.hotStore.set(t,r)}getHotBufferSet(t){return this.hotStore.get(t)}getHotBuffer(t){
return this.hotStore.get(t)}createHotBuffer(t,r,n,i){if(!this.device)throw new Error("[GPUHubManager] Device not initial\
ized");const o=this.device.createBuffer({size:r,usage:n,label:i});return this.hotStore.set(t,o),o}removeHotBuffer(t){this.
hotStore.delete(t)}registerResidentStageExecutor(t,r=null){var f;const n=typeof t=="string"?{stageId:t,executor:r}:{...t||
{}},i=te(n.stageId??n.id,null);if(!i)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const o=n.
executor||r,s=n.workerRunner||n.workerBackend||((f=n.workerPolicy)==null?void 0:f.workerRunner)||null;if(typeof o!="func\
tion"&&!s)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${i}`);const a={schema:tf,stageId:i,
lawNodeId:te(n.lawNodeId,null),runtimeTarget:te(n.runtimeTarget,s?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-\
executor"),executor:typeof o=="function"?o:null,workerRunner:s,workerPolicy:of({...n.workerPolicy||n.workerResidency||{},
workerReady:(n.workerPolicy||n.workerResidency||{}).workerReady||!!s},i),metadata:kt(n.metadata||{}),registeredAt:Date.now()};
return this.residentStageExecutors.set(i,a),a.lawNodeId&&this.residentStageExecutorAliases.set(a.lawNodeId,i),this.describeResidentStageExecutor(
i)}describeResidentStageExecutor(t){const r=this.getResidentStageExecutorRecord(t);return r?{schema:r.schema,stageId:r.stageId,
lawNodeId:r.lawNodeId,runtimeTarget:r.runtimeTarget,workerPolicy:kt(r.workerPolicy),metadata:kt(r.metadata||{}),registeredAt:r.
registeredAt}:null}getResidentStageExecutorRecord(t){const r=te(typeof t=="string"?t:(t==null?void 0:t.id)??(t==null?void 0:
t.stageId),null),n=te(typeof t=="string"?null:t==null?void 0:t.lawNodeId,null);if(r&&this.residentStageExecutors.has(r))
return this.residentStageExecutors.get(r);const i=n?this.residentStageExecutorAliases.get(n):null;return i?this.residentStageExecutors.
get(i):null}hasResidentStageExecutor(t){return!!this.getResidentStageExecutorRecord(t)}listResidentStageExecutors(){return[
...this.residentStageExecutors.keys()].sort().map(t=>this.describeResidentStageExecutor(t))}async executeResidentStage(t={}){
var i,o;const r=this.getResidentStageExecutorRecord(t.stage);if(!r){const s=te(((i=t.stage)==null?void 0:i.id)??((o=t.stage)==
null?void 0:o.stageId),"unknown"),a=new Error(`[GPUHubManager] Missing resident stage executor: ${s}`);throw a.code="ERR\
_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",a.stage=t.stage||null,a}const n={...t,gpuHub:this,device:this.device,executor:this.
describeResidentStageExecutor(r.stageId)};return r.workerRunner?sf(r.workerRunner,n):r.executor(n)}registerTask(t,r){this.
tasks.set(t,r)}unregisterTask(t){this.tasks.delete(t)}tick(){}}const Me="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-\
abl-GGUF",Re="5ce3fd841676adf2c1a10d7193637d46007e88f7",Vr=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd44\
1111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"N\
OTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_X\
S.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,
gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5\
593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913\
dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.js\
on",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"\
5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9a\
e04fff09706ef"}],cf="This catalog supports verified storage and distribution. Execution is admitted separately by the ma\
naged llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function Fn(e){for(const t of Object.
values(e))t&&typeof t=="object"&&Fn(t);return Object.freeze(e)}const df=Fn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.\
8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Me,revision:Re,status:"storage-only",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:cf},
license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Me}/blob/${Re}/LICENSE`,notice:"Preserve upstream LICENSE\
, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Me,revision:Re,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${Me}/blob/${Re}/README.md`,sourceManifestPath:"artifact-manifest.json"},
model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:[
"IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Me,revision:Re},weightBytes:14199740480,totalBytes:Vr.reduce((e,t)=>e+
t.size,0),files:Vr}});function jn(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(jn),Object.
freeze(e)),e}const ff=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental \
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
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],uf=jn(Object.fromEntries(
ff.map(e=>{const{dtype:t,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=e,a=o.files.find(f=>f.path==="LICENSE").source;
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
revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.files.reduce((f,h)=>f+h.size,0)}]})));function pr(e){return e&&
typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(pr),Object.freeze(e)),e}const de="Tsotchke-Corporatio\
n",qn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
text)",repository:`${de}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",
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
en3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${de}\
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
 Q4_K GGUF, candidate text)",repository:`${de}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd\
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
06e0df3640f9ae04fff09706ef"}]}],lf=pr(Object.fromEntries(qn.map(e=>{const{architecture:t,quantizationTypes:r,sourceModel:n,
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
reduce((s,a)=>s+a.size,0)}]})));pr({organization:de,sourceUrl:`https://huggingface.co/${de}`,checkedAt:"2026-11-04",repositories:[
...qn.map(({id:e,repository:t,revision:r})=>({repository:t,revision:r,catalogId:e,format:"GGUF",codecRequired:!1})),{repository:`${de}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${de}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${de}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${de}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const tt="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",rt="036d46331b5ef633654ff516e739\
73e81c8eca79",Wr="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",Hr=`https://huggingface.co/${tt}/blob/${rt}/README.\
md`,Nt=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59b\
b8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028\
c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function Qn(e){return e&&typeof e=="object"&&
!Object.isFrozen(e)&&(Object.values(e).forEach(Qn),Object.freeze(e)),e}const hf=Qn({[Wr]:{id:Wr,name:"MiMo V2.6 Distill \
Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:tt,revision:rt,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"\
User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolat\
ion, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher\
-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"\
MIT",sourceUrl:Hr,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked \
parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:tt,revision:rt,format:"GGUF",
metadataCheckedAt:"2026-11-10",modelCardUrl:Hr,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"\
1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion i\
nput revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for t\
hese GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 o\
nly; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"\
working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not suppl\
ied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",
task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:tt,revision:rt},weightBytes:Nt[0].
size,totalBytes:Nt.reduce((e,t)=>e+t.size,0),files:Nt}}),nt="TrevorJS/gemma-4-12B-it-uncensored-GGUF",it="d878d412b001a7\
20b9a62eaac432d00aac9d1b4f",Kr="gemma4-12b-uncensored-q4-k-m-gguf",pf=`https://huggingface.co/${nt}/blob/${it}/README.md`,
Xr="TrevorJS/gemma-4-12B-it-uncensored",Yr="159eb7a8a04efb31ed43887e4732ff3edccff8ac",Dt=[{path:"gemma-4-12B-it-uncensor\
ed-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README\
.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961\
e18b9a380366eb9ed3d6ee"}];function Vn(e){return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Vn),
Object.freeze(e)),e}const Wn=Vn({[Kr]:{id:Kr,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:nt,revision:it,
status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this\
 exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires sh\
ader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publi\
sher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apa\
che-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. Th\
e conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENS\
E file."},provenance:{repository:nt,revision:it,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:pf,sourceModel:{
repository:Xr,revision:Yr,modelCardUrl:`https://huggingface.co/${Xr}/blob/${Yr}/README.md`,modelCardBytes:4929,modelCardSha256:"\
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
shader-f16"],repository:nt,revision:it},weightBytes:Dt[0].size,totalBytes:Dt.reduce((e,t)=>e+t.size,0),files:Dt}});function Hn(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Hn),Object.freeze(e)),e}const Jt=Hn({id:"ge\
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
Zt=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:Jt.size,sha256:Jt.sha256}),$e=Wn["gemma4-12b-uncensored-q4-\
k-m-gguf"],Jr="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",Zr=[...$e.files,Zt],ke=Jt;function Kn(e){return e&&typeof e==
"object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Kn),Object.freeze(e)),e}const bf=Kn({[Jr]:{...$e,id:Jr,name:"Ge\
mma 4 12B Uncensored (Q4_K_M, vision + audio)",files:Zr,description:"Image and audio understanding with text replies. Re\
uses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading thi\
s package to avoid keeping two 12B models in GPU memory.",capabilities:{...$e.capabilities,executionStatus:"tested",executionReason:"\
Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained rel\
oad and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; \
speech synthesis uses a separate model."},model:{...$e.model,modalities:["text","image","audio"],ggufMedia:{profile:"gem\
ma4-unified-v1",projectorPath:Zt.path}},provenance:{...$e.provenance,vision:"A separately derived Gemma4Unified companio\
n supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browse\
r execution remains unverified.",derivedArtifacts:[{path:Zt.path,recipe:ke.id,sourceRepository:ke.source.repository,sourceRevision:ke.
source.revision,sourcePath:"model.safetensors",sourceFileSha256:ke.source.publisherSha256,sourceDigestVerification:"Publ\
isher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source c\
heckpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:ke.converterRevision,outputType:"f16"},
processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config\
.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced \
explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understan\
ding and transcription are distinct from image or speech generation."},totalBytes:Zr.reduce((e,t)=>e+t.size,0)}}),Ne="ba\
rtowski/Qwen_Qwen3.5-0.8B-GGUF",De="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",zt=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",
size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"\
499cb320f9f2f3963beee9d8b890046f825c6f5d"}],er=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function Xn(e){
return e&&typeof e=="object"&&!Object.isFrozen(e)&&(Object.values(e).forEach(Xn),Object.freeze(e)),e}const mf=Object.fromEntries(
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
LICENSE"}}]}].map(({architecture:e,...t})=>[t.id,Xn({...t,status:"execution-candidate",format:"GGUF",capabilities:er,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${t.files[2].source.repository}/blob/${t.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:t.
repository,revision:t.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${t.repository}\
/blob/${t.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:t.repository,revision:t.revision},weightBytes:t.files[0].size,totalBytes:t.files.reduce((r,n)=>r+n.size,
0)})])),h0=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:Ne,revision:De,status:"execution-candidate",format:"GGUF",capabilities:er,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Ne}/blob/${De}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:Ne,revision:De,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${Ne}/blob/${De}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Ne,revision:De},weightBytes:zt[0].size,totalBytes:zt.
reduce((e,t)=>e+t.size,0),files:zt},...mf,...uf,...hf,...Wn,...bf,...lf,...Object.fromEntries(Object.entries(df).map(([e,
t])=>[e,{...t,status:"execution-candidate",capabilities:er}]))});function At(e){return e&&typeof e=="object"&&!Object.isFrozen(
e)&&(Object.values(e).forEach(At),Object.freeze(e)),e}const Yn=At({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR\
 · image to 3D (Q8)",repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"O\
NNX",status:"tested",pipeline:"triposr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"\
7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"\
048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"\
50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"\
048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff435\
81f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"04872\
5e957f485cc6bc082a9d6a239fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b7\
4a7a700f80ed3d43aa12c864ad58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9\
d6a239fcf7d8880a",path:"README.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/10\
7cefdc244c39106fa830359024f6a2f1c78871/LICENSE",notice:`MIT License

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
weightBytes:484845236,totalBytes:484848869}}),p0=At(Object.values(Yn)),se=Yn["triposr-q8-onnx"],Xe=[{path:"u2netp.onnx",
size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2n\
etp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"\
e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee3\
7ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],en={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.c\
om/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache L\
icense
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
`},gf={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e8045\
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
`},b0=At({"triposr-q8-onnx":{...se,model:{...se.model,backgroundRemoval:"u2netp"},files:[...se.files,...Xe],weightBytes:se.
weightBytes+Xe[0].size,totalBytes:se.totalBytes+Xe.reduce((e,t)=>e+t.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:se.
license.sourceUrl,notice:"TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution ©\
 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.",components:[se.license,en,gf]},provenance:{
...se.provenance,foreground:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"\
https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetool\
s/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md",sha256:Xe[0].sha256,licenseUrl:en.sourceUrl}},capabilities:{
...se.capabilities,executionStatus:"tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner \
chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same \
isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No \
shader-f16 required.",executionEvidence:{checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inferen\
ce, two CubeChat pages and retained object reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShap\
er 512x512 RGBA chair",meshSha256:"277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,
peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,
ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}}}}),re=Object.freeze({byteLength:16*1024**2,jsonBytes:256*
1024,vertices:1e5,triangles:15e4,coordinate:1e6}),yf="model/gltf-binary",wf=new TextEncoder,Ef=new TextDecoder("utf-8",{
fatal:!0}),O=e=>{throw new Error(`Invalid generated mesh: ${e}`)};function ae(e,t,r){return(!Number.isSafeInteger(e)||e<
t||e>r)&&O("numeric limit"),e}function X(e,t){return(!e||typeof e!="object"||Array.isArray(e)||Object.keys(e).some(r=>!t.
includes(r)))&&O("unsupported GLB field"),e}function tn(e,t,r=-re.coordinate,n=re.coordinate){return(!Array.isArray(e)||
e.length!==t||e.some(i=>!Number.isFinite(i)||i<r||i>n))&&O("invalid vector"),[...e]}function ve(e){return(!Array.isArray(
e)||e.length!==1)&&O("expected one static mesh"),e[0]}const tr=(e,t)=>JSON.stringify(e)===JSON.stringify(t);function vf(e){
const t=new DataView(e.buffer,e.byteOffset,e.byteLength);(t.getUint32(0,!0)!==1179937895||t.getUint32(4,!0)!==2||t.getUint32(
8,!0)!==e.byteLength)&&O("GLB header");const r=t.getUint32(12,!0);(!r||r%4||r>re.jsonBytes||20+r+8>e.byteLength||t.getUint32(
16,!0)!==1313821514)&&O("JSON chunk");let n;try{n=JSON.parse(Ef.decode(e.subarray(20,20+r)))}catch{O("JSON syntax")}const i=20+
r,o=t.getUint32(i,!0);(o%4||t.getUint32(i+4,!0)!==5130562||i+8+o!==e.byteLength)&&O("BIN chunk"),X(n,["asset","scene","s\
cenes","nodes","meshes","buffers","bufferViews","accessors","materials"]),X(n.asset,["version","generator"]),(n.asset.version!==
"2.0"||n.asset.generator!==void 0&&(typeof n.asset.generator!="string"||n.asset.generator.length>128))&&O("asset version"),
n.scene!==0&&O("scene");const s=X(ve(n.scenes),["nodes"]);tr(s.nodes,[0])||O("scene nodes"),X(ve(n.nodes),["mesh"]).mesh!==
0&&O("node mesh");const f=X(ve(n.meshes),["primitives"]),h=X(ve(f.primitives),["attributes","indices","mode","material"]);
h.mode!==void 0&&h.mode!==4&&O("only triangles are supported"),X(h.attributes,["POSITION","NORMAL","COLOR_0"]),Object.hasOwn(
h.attributes,"POSITION")||O("missing positions");const m=X(ve(n.buffers),["byteLength"]);ae(m.byteLength,1,o),o-m.byteLength>
3&&O("BIN padding"),(!Array.isArray(n.bufferViews)||n.bufferViews.length<2||n.bufferViews.length>4||!Array.isArray(n.accessors)||
n.accessors.length!==n.bufferViews.length)&&O("accessor count");const E=[];for(const d of n.bufferViews){X(d,["buffer","\
byteOffset","byteLength","target"]),(d.buffer!==0||d.target!==void 0&&![34962,34963].includes(d.target))&&O("buffer view");
const w=ae(d.byteOffset??0,0,m.byteLength),p=ae(d.byteLength,1,m.byteLength-w);w%4&&O("buffer alignment"),E.some(([v,A])=>w<
A&&w+p>v)&&O("overlapping buffer views"),E.push([w,w+p])}const u=new Set,y=new Set;function b(d,w){ae(d,0,n.accessors.length-
1),u.has(d)&&O("reused accessor"),u.add(d);const p=X(n.accessors[d],["bufferView","byteOffset","componentType","count","\
type","min","max"]);ae(p.bufferView,0,n.bufferViews.length-1),y.has(p.bufferView)&&O("reused buffer view"),y.add(p.bufferView);
const v=w==="indices"?1:w==="colors"&&p.type==="VEC4"?4:3;(p.type!==(v===1?"SCALAR":`VEC${v}`)||(w==="indices"?![5123,5125].
includes(p.componentType):p.componentType!==5126))&&O("accessor format");const A=p.componentType===5123?2:4,S=ae(p.count,
3,w==="indices"?re.triangles*3:re.vertices),x=E[p.bufferView],_=ae(p.byteOffset??0,0,x[1]-x[0]);(_%A||_+S*v*A!==x[1]-x[0])&&
O("accessor byte range");const C=new DataView(e.buffer,e.byteOffset+i+8+x[0]+_,S*v*A),T=p.componentType===5126?U=>C.getFloat32(
U*4,!0):p.componentType===5125?U=>C.getUint32(U*4,!0):U=>C.getUint16(U*2,!0);return{entry:p,count:S,components:v,get:T}}
const I=b(h.attributes.POSITION,"positions"),g={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let d=0;d<I.count*3;d++){const w=I.
get(d);(!Number.isFinite(w)||Math.abs(w)>re.coordinate)&&O("nonfinite or excessive position"),g.min[d%3]=Math.min(g.min[d%
3],w),g.max[d%3]=Math.max(g.max[d%3],w)}for(const d of["min","max"])tr(tn(I.entry[d],3),g[d])||O("position bounds mismat\
ch");g.min.every((d,w)=>d===g.max[w])&&O("empty geometry");for(const[d,w]of[["NORMAL","normals"],["COLOR_0","colors"]]){
if(!Object.hasOwn(h.attributes,d))continue;const p=b(h.attributes[d],w);(p.count!==I.count||p.entry.min!==void 0||p.entry.
max!==void 0)&&O("attribute count or bounds");for(let v=0;v<p.count*p.components;v++){const A=p.get(v);(!Number.isFinite(
A)||A<(w==="colors"?0:-1.001)||A>(w==="colors"?1:1.001))&&O("invalid attribute value")}if(w==="normals")for(let v=0;v<p.
count;v++){const A=Math.hypot(p.get(v*3),p.get(v*3+1),p.get(v*3+2));Math.abs(A-1)>.001&&O("normal must be a unit vector")}}
const c=b(h.indices,"indices");(c.count%3||c.entry.min!==void 0||c.entry.max!==void 0)&&O("triangle indices");for(let d=0;d<
c.count;d++){const w=c.get(d);w>=I.count&&O("index outside positions"),c.entry.componentType===5123&&w===65535&&O("primi\
tive restart index")}if((u.size!==n.accessors.length||y.size!==n.bufferViews.length)&&O("unused accessor"),n.materials!==
void 0){const d=X(ve(n.materials),["pbrMetallicRoughness","doubleSided","alphaMode"]);d.doubleSided!==void 0&&typeof d.doubleSided!=
"boolean"&&O("material"),d.alphaMode!==void 0&&d.alphaMode!=="OPAQUE"&&O("material alpha");const w=X(d.pbrMetallicRoughness,
["baseColorFactor","metallicFactor","roughnessFactor"]);w.baseColorFactor!==void 0&&tn(w.baseColorFactor,4,0,1);for(const p of[
"metallicFactor","roughnessFactor"])w[p]!==void 0&&(!Number.isFinite(w[p])||w[p]<0||w[p]>1)&&O("material factor");h.material!==
0&&O("material index")}else h.material!==void 0&&O("missing material");return{vertexCount:I.count,triangleCount:c.count/
3,bounds:g}}function xf(e){(!((e==null?void 0:e.data)instanceof Uint8Array)||e.data.byteLength<32||e.data.byteLength>re.
byteLength)&&O("binary byte limit");const t=new Uint8Array(e.data),r={format:"glb",mimeType:yf,byteLength:t.byteLength,sha256:_d(
Ld(t)),...vf(t)};for(const n of Object.keys(r))e[n]!==void 0&&!tr(e[n],r[n])&&O(`${n} mismatch`);return{...r,data:t}}function m0({
positions:e,indices:t,normals:r,colors:n}){(!(e instanceof Float32Array)||e.length%3||!(t instanceof Uint16Array||t instanceof
Uint32Array)||t.length%3)&&O("geometry arrays");const i=ae(e.length/3,3,re.vertices);ae(t.length/3,1,re.triangles),r!==void 0&&
(!(r instanceof Float32Array)||r.length!==e.length)&&O("normal array"),n!==void 0&&(!(n instanceof Float32Array)||![i*3,
i*4].includes(n.length))&&O("color array");const o={min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]};for(let d=0;d<e.length;d++)o.
min[d%3]=Math.min(o.min[d%3],e[d]),o.max[d%3]=Math.max(o.max[d%3],e[d]);const s=[],a=[],f=[],h={};let m=0;const E=(d,w,p,v={})=>{
const A=a.length,S=new Uint8Array(d.byteLength),x=new DataView(S.buffer);for(let _=0;_<d.length;_++)d instanceof Float32Array?
x.setFloat32(_*4,d[_],!0):d instanceof Uint32Array?x.setUint32(_*4,d[_],!0):x.setUint16(_*2,d[_],!0);return s.push({offset:m,
data:S}),f.push({buffer:0,byteOffset:m,byteLength:S.byteLength,target:p}),a.push({bufferView:A,componentType:d instanceof
Float32Array?5126:d instanceof Uint32Array?5125:5123,count:w==="SCALAR"?d.length:i,type:w,...v}),m+=Math.ceil(S.byteLength/
4)*4,A};h.POSITION=E(e,"VEC3",34962,o),r!==void 0&&(h.NORMAL=E(r,"VEC3",34962)),n!==void 0&&(h.COLOR_0=E(n,n.length===i*
4?"VEC4":"VEC3",34962));const u=E(t,"SCALAR",34963),y=wf.encode(JSON.stringify({asset:{version:"2.0",generator:"PeerComp\
ute generated mesh"},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:h,indices:u,mode:4,material:0}]}],
materials:[{pbrMetallicRoughness:{metallicFactor:0,roughnessFactor:1},doubleSided:!0}],buffers:[{byteLength:m}],bufferViews:f,
accessors:a})),b=Math.ceil(y.byteLength/4)*4,I=28+b+m;(I>re.byteLength||b>re.jsonBytes)&&O("encoded byte limit");const g=new Uint8Array(
I),c=new DataView(g.buffer);c.setUint32(0,1179937895,!0),c.setUint32(4,2,!0),c.setUint32(8,I,!0),c.setUint32(12,b,!0),c.
setUint32(16,1313821514,!0),g.fill(32,20,20+b),g.set(y,20),c.setUint32(20+b,m,!0),c.setUint32(24+b,5130562,!0);for(const d of s)
g.set(d.data,28+b+d.offset);return xf({data:g})}const gt=1024**3,ye=Object.freeze({maximumBytes:8*gt,maximumFileBytes:2*
gt-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*1024**2}),Jn=Object.freeze(["q4","q4f16","q8",
"fp16","fp32"]),Sf=["qwen2","qwen3","llama"],rn=["phi","phi3","gemma","gemma2","gemma3_text","mistral","granite","starco\
der2","smollm3","olmo","olmo2","nemotron_h"],nn=["idefics3","smolvlm","qwen3_5"],Af=["llama","qwen2","qwen3","qwen35","g\
emma","gemma2","gemma3","gemma4","phi3","phi2","granite","starcoder2","olmo","olmo2","stablelm","nemotron","smollm3"],Zn=Object.
freeze([...[...Sf,...rn,...nn].map(e=>{const t=nn.includes(e);return Object.freeze({runtime:"transformers.js",runtimeVersion:"\
4.3.2",architecture:e,task:t?"image-text-to-text":"text-generation",qualification:"candidate",modalities:Object.freeze(t?
["text","image"]:["text"]),modules:Object.freeze(t?["embed_tokens","vision_encoder","decoder_model_merged"]:["model"]),dtypes:e===
"qwen3_5"?Object.freeze(["q4"]):Jn,requiresMemoryProfile:rn.includes(e),contextTokens:2048,maximumBytes:t?e==="qwen3_5"?
2*gt:ye.legacyMaximumBytes:ye.maximumBytes,maximumFileBytes:ye.maximumFileBytes})}),...Af.map(e=>Object.freeze({runtime:"\
llama.cpp",runtimeVersion:"3.8.1",architecture:e,modelArchitecture:e==="qwen35"?"qwen3_5":e,task:"text-generation",modalities:Object.
freeze(["text"]),qualification:"candidate"}))]);function br(e,t){return Zn.find(r=>r.runtime===e&&r.architecture===t)??null}
function g0(e){return Zn.filter(t=>t.runtime===e)}function If(e){const t=typeof e=="string"?[e]:e&&typeof e=="object"&&!Array.
isArray(e)?Object.values(e):[];if(!t.length||t.length>16||t.some(r=>!Jn.includes(r)))throw new Error("Unsupported ONNX p\
recision");return t}function ei(e){const t=(e==null?void 0:e["transformers.js_config"])??{},r=t.device_config??{};return Object.
hasOwn(r,"webgpu")?{...t,...r.webgpu}:{...t}}function Cf(e,t={}){const r=If(e),n=ei(t).kv_cache_dtype;return r.some(o=>[
"fp16","q4f16"].includes(o)||(typeof n=="string"?n:n==null?void 0:n[o])==="float16")?["shader-f16"]:[]}function H(e,t,r=1048576,n=1){
if(!Number.isSafeInteger(e)||e<n||e>r)throw new Error(`Invalid model memory dimension: ${t}`);return e}function _f(e){const t=ei(
e).free_dimension_overrides;if(t&&(typeof t!="object"||Array.isArray(t)||Object.keys(t).length))throw new Error("Dynamic\
 ONNX free_dimension_overrides are not admitted by this memory profile");const r=e==null?void 0:e.model_type,n=br("trans\
formers.js",r);if(!n)throw new Error("Unsupported model memory architecture");const i=n.task==="image-text-to-text"?e.text_config??
e:e,o=i.layer_types??i.layers_block_type,s=H(i.num_hidden_layers??(o==null?void 0:o.length),"layers",512),a=H(i.hidden_size,
"hidden size",65536),f=H(i.num_attention_heads,"attention heads",1024),h=H(i.num_key_value_heads??f,"KV heads",1024),m=H(
i.head_dim??a/f,"head dimension",4096),E=H(i.vocab_size??e.vocab_size,"vocabulary");if(o!==void 0&&(!Array.isArray(o)||o.
length!==s||o.some(w=>!["attention","mamba","mlp","moe","full_attention","sliding_attention","linear_attention"].includes(
w))))throw new Error("Invalid model memory layer types");let u=s,y=0,b=0,I=0,g=0,c=0,d=0;if(r==="nemotron_h"){if(!o)throw new Error(
"Nemotron requires explicit recurrent layer types");if(u=o.filter(p=>p==="attention").length,y=o.filter(p=>p==="mamba").
length,o.some(p=>!["attention","mamba","mlp","moe"].includes(p)))throw new Error("Unsupported Nemotron layer type");g=H(
i.mamba_num_heads,"SSM heads",1024),c=H(i.mamba_head_dim,"SSM head dimension",4096),d=H(i.ssm_state_size,"SSM state size",
4096);const w=H(i.n_groups,"SSM groups",1024);I=H(i.conv_kernel,"convolution kernel",256),b=H(g*c+2*w*d,"convolution cha\
nnels")}return It({schema:"peercompute.onnx.memory.v1",architecture:r,layers:s,hiddenSize:a,heads:f,kvHeads:h,headDim:m,
vocabulary:E,attentionLayers:u,recurrentLayers:y,convChannels:b,convKernel:I,ssmHeads:g,ssmHeadDim:c,stateSize:d})}function It(e){
const t=["schema","architecture","layers","hiddenSize","heads","kvHeads","headDim","vocabulary","attentionLayers","recur\
rentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"];if(!e||e.schema!=="peercompute.onnx.memory.\
v1"||!br("transformers.js",e.architecture)||Object.keys(e).some(n=>!t.includes(n)))throw new Error("Invalid model memory\
 profile");for(const n of t.slice(2))H(e[n],n,1048576,["attentionLayers","recurrentLayers","convChannels","convKernel","\
ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(e.layers>512||e.attentionLayers+e.recurrentLayers>e.layers||e.kvHeads>
e.heads||e.architecture!=="nemotron_h"&&e.recurrentLayers)throw new Error("Invalid model memory layer geometry");const r=2*
(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*e.
convKernel)*4);if(!Number.isSafeInteger(r)||r>16*gt)throw new Error("Model cache/state exceeds its bounded memory envelo\
pe");return Object.fromEntries(t.map(n=>[n,e[n]]))}function Tf(e){const t=It(e);return 2*(2*t.attentionLayers*t.kvHeads*
t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*t.ssmHeadDim*t.stateSize+t.convChannels*t.convKernel)*4)}function ti(e,t){
if((t==null?void 0:t.model_type)!==e.architecture)throw new Error("Model config architecture does not match its admitted\
 manifest");if(t.auto_map&&Object.keys(t.auto_map).length)throw new Error("Custom model code is not admitted");if(e.memoryProfile&&
JSON.stringify(It(e.memoryProfile))!==JSON.stringify(_f(t)))throw new Error("Model memory profile differs from its verif\
ied config");return Cf(e.dtype,t)}const on="transformers.js",ri="4.3.2",M=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,
maxModelBytes:ye.maximumBytes,maxFileBytes:ye.maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*
1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*
1024*1024}),Of=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:M.maxFileBytes,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*
1024**3,maxProcessedImagePixels:512*512}),ni=Object.freeze({maxModelBytes:M.maxModelBytes,maxFileBytes:M.maxFileBytes,minimumCpuBytes:0,
minimumGpuBytes:0,maxProcessedImagePixels:M.maxImagePixels}),Bf=Object.freeze({...ni,maxModelBytes:ye.legacyMaximumBytes});
function ii(e,{files:t,totalBytes:r,config:n}={}){const i=(e==null?void 0:e.architecture)==="qwen3_5"?Of:["idefics3","sm\
olvlm"].includes(e==null?void 0:e.architecture)?Bf:ni;if(n&&ti(e,n),t){r=0;for(const h of t){if(!Number.isSafeInteger(h.
size)||h.size<0)throw new Error("Invalid model file size");if(h.size>M.maxFileBytes)throw Object.assign(new Error("Model\
 file exceeds its bounded file budget (each ONNX file must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=
h.size}}if(r!==void 0&&(!Number.isSafeInteger(r)||r<0||r>i.maxModelBytes))throw Object.assign(new Error(`Model exceeds i\
ts admitted file budget of ${i.maxModelBytes/1024**3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const o=(e==null?void 0:
e.memoryProfile)&&It(e.memoryProfile);if(o&&o.architecture!==e.architecture)throw new Error("Model memory architecture m\
ismatch");if(!o&&!(r>ye.legacyMaximumBytes))return i;const s=r??0,a=o?Tf(o):0,f=1024**3;return{...i,minimumCpuBytes:Math.
max(i.minimumCpuBytes,2*s+2*f+a),minimumGpuBytes:Math.max(i.minimumGpuBytes,2*s+f+a),cacheBytes:a}}function rr(e="Operat\
ion cancelled"){return(e==null?void 0:e.name)==="AbortError"?e:new DOMException(typeof e=="string"?e:"Operation cancelle\
d","AbortError")}function F(e){if(e!=null&&e.aborted)throw rr(e.reason)}function Ye(e){if(typeof e!="string"||!/^[A-Za-z0-9_-]{1,128}$/.
test(e))throw new Error("Invalid model session ID");return e}function yt(e){if(typeof e!="string"||!e||new TextEncoder().
encode(e).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(e)||e.startsWith("/")||e.split("/").some(t=>!t||t==="."||t===".\
."))throw new Error("Invalid model artifact path");return e}function Uf(e){var E;let t;try{t=JSON.stringify(e)}catch{throw new Error(
"Invalid model manifest")}if(!t||new TextEncoder().encode(t).length>M.maxManifestBytes)throw new Error("Model manifest e\
xceeds its metadata budget");const r=JSON.parse(t);if(((E=r.model)==null?void 0:E.composition)!==void 0)throw new Error(
"This ONNX runtime does not support model adapters");if(r.schema!=="peercompute.artifact.manifest.v1"||!Array.isArray(r.
files)||!r.files.length||r.files.length>M.maxFiles)throw new Error("Invalid model manifest files");const n=new Set,i=ii(
r.model,{files:r.files});let o=0;for(const u of r.files){if(yt(u.path),n.has(u.path))throw new Error("Duplicate model ar\
tifact path");n.add(u.path);const y=N.parse(u.cid);if(![85,112].includes(y.code)||y.multihash.code!==18||y.multihash.size!==
32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||!/^[a-f0-9]{64}$/i.test(
u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),o+=u.size,!Number.isSafeInteger(
o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const s=r.model,a=br(on,s==null?void 0:s.
architecture);if((s==null?void 0:s.runtime)!==on||s.runtimeVersion!==ri||!a)throw new Error("Model runtime, architecture\
 or dtype is not approved");if(s.task??(s.task=a.task),s.task!==a.task)throw new Error("Model task does not match its ad\
mitted architecture");if((a.requiresMemoryProfile||a.task==="text-generation"&&o>ye.legacyMaximumBytes)&&!s.memoryProfile)
throw new Error("This model requires a verified config memory profile");const f=typeof s.dtype=="string"?[["model",s.dtype]]:
s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(s.dtype):[];if(!f.length||f.length>16||f.some(
([u,y])=>!/^[A-Za-z0-9_-]{1,100}$/.test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(y)))throw new Error("Invalid mod\
el dtype configuration");if(s.architecture==="qwen3_5"&&f.some(([,u])=>u!=="q4"))throw new Error("Qwen3.5 admits q4 lang\
uage and vision modules");const h=u=>u==="fp32"?"":u==="q8"?"_quantized":`_${u}`,m=["config.json","tokenizer.json","toke\
nizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&m.push(...f.map(([u,y])=>`onnx/${u}${h(y)}\
.onnx`)),s.task==="image-text-to-text")for(const u of["embed_tokens","vision_encoder","decoder_model_merged"]){const y=typeof s.
dtype=="string"?s.dtype:s.dtype[u];if(!y)throw new Error("Multimodal dtype configuration is missing a module");m.push(`o\
nnx/${u}${h(y)}.onnx`),s.architecture==="qwen3_5"&&m.push(`onnx/${u}${h(y)}.onnx_data`)}if(m.some(u=>!n.has(u)))throw new Error(
"Incomplete model package");if(s.task==="image-text-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_conf\
ig.json"))throw new Error("Multimodal processor configuration is missing");if(s.requiredFeatures!==void 0&&(!Array.isArray(
s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.some(u=>typeof u!="string"||u.length>80)))throw new Error(
"Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}function Mf(e,t){const r=new URL(t),n={};
for(const i of["mjs","wasm"]){if(typeof(e==null?void 0:e[i])!="string")throw new Error("Trusted ORT runtime assets are r\
equired");const o=new URL(e[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||!["http:","https:"].includes(o.
protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved same-origin runtime files");n[i]=o.
href}return n}const Rf="peercompute.model-artifact-read.v1",mr=Rf;function oi(e,t){var n;const r=i=>t(i.data);return e.addEventListener(
"message",r),(n=e.start)==null||n.call(e),()=>e.removeEventListener("message",r)}function K(e,t,r=[]){e.postMessage({protocol:mr,
...t},r)}function y0(e,{store:t,manifest:r,chunkBytes:n=M.chunkBytes,maxReads:i=M.maxReads}={}){if(!(t!=null&&t.stat)||!(t!=
null&&t.openRead))throw new Error("A verified artifact store is required");if(!Number.isInteger(n)||n<1||n>M.chunkBytes||
!Number.isInteger(i)||i<1||i>M.maxReads)throw new Error("Invalid artifact bridge bounds");const o=new Map(r.files.map(u=>[
yt(u.path),u])),s=new Map;let a=!1,f=0;async function h(u,y){var I,g;const b=s.get(u);if(b){s.delete(u),b.controller.abort(
y);try{await((g=(I=b.iterator)==null?void 0:I.return)==null?void 0:g.call(I))}catch{}}}async function m(u){var b,I;if(a||
(u==null?void 0:u.protocol)!==mr||typeof u.id!="string"||u.id.length>128)return;const{id:y}=u;try{if(u.type==="cancel"){
await h(y,"Reader cancelled");return}if(u.type==="open"){if(s.has(y))throw new Error("Duplicate artifact reader");if(s.size>=
i)throw new Error("Artifact reader limit reached");const p=o.get(u.path);if(!p)throw new Error("Artifact path is not in \
the manifest");const v=u.offset??0,A=u.length??p.size-v;if(!Number.isSafeInteger(v)||!Number.isSafeInteger(A)||v<0||A<0||
v>p.size||A>p.size-v)throw new Error("Invalid artifact byte range");const S={controller:new AbortController,remaining:A,
pulling:!1};s.set(y,S);const x=await t.stat(p.cid);if(F(S.controller.signal),a||s.get(y)!==S)return;if(!x||x.status!=="c\
omplete"||x.size!==p.size||x.sha256!==p.sha256)throw new Error("Model artifact is incomplete or has a different size");const _=await t.
openRead(p.cid,{offset:v,length:A,signal:S.controller.signal});if(S.iterator=_[Symbol.asyncIterator](),a||S.controller.signal.
aborted||s.get(y)!==S){await((I=(b=S.iterator).return)==null?void 0:I.call(b));return}K(e,{type:"ready",id:y,size:A});return}
if(u.type!=="pull")return;const g=s.get(y);if(!(g!=null&&g.iterator)||g.pulling)throw new Error("Invalid artifact pull c\
redit");g.pulling=!0;const c=await g.iterator.next();if(a||g.controller.signal.aborted||s.get(y)!==g)return;if(c.done){if(g.
remaining!==0)throw new Error("Truncated model artifact");s.delete(y),K(e,{type:"end",id:y});return}const d=c.value;if(!(d instanceof
Uint8Array)||!d.byteLength||d.byteLength>n||d.byteLength>g.remaining)throw new Error("Artifact chunk exceeds admitted bo\
unds");g.remaining-=d.byteLength,g.pulling=!1,f+=d.byteLength;const w=d.slice();K(e,{type:"chunk",id:y,bytes:w},[w.buffer])}catch(g){
await h(y,g),a||K(e,{type:"error",id:y,message:(g==null?void 0:g.message)||"Artifact read failed"})}}const E=oi(e,u=>{m(
u)});return{getStats:()=>({activeReads:s.size,deliveredBytes:f}),async close(){if(!a){a=!0;try{K(e,{type:"closed",message:"\
Artifact bridge closed"})}catch{}E(),await Promise.all([...s.keys()].map(u=>h(u,"Artifact bridge closed"))),e.close()}}}}
function kf(e,{manifest:t,baseUrl:r,signal:n,chunkBytes:i=M.chunkBytes,maxReads:o=M.maxReads,maxQueuedReads:s=32}={}){if(!Number.
isInteger(o)||o<1||o>M.maxReads||!Number.isInteger(s)||s<0||s>32)throw new RangeError("Invalid artifact reader limits");
const a=new URL(r),f=new Map(t.files.map(c=>[yt(c.path),c])),h=new Map,m=[];let E=0,u=!1;function y(){for(;!u&&h.size<o&&
m.length;){const c=m.shift();h.set(c.id,c),c.active=!0,K(e,{type:"open",id:c.id,path:c.path})}}function b(c,d){var p,v,A,
S;h.delete(c.id);const w=m.indexOf(c);if(w>=0&&m.splice(w,1),n==null||n.removeEventListener("abort",c.abort),(p=c.requestSignal)==
null||p.removeEventListener("abort",c.abort),d){(v=c.reject)==null||v.call(c,d);try{(A=c.streamController)==null||A.error(
d)}catch{}}(S=c.resolvePull)==null||S.call(c),y()}const I=oi(e,c=>{if((c==null?void 0:c.protocol)!==mr)return;const d=h.
get(c.id);if(d){if(c.type==="error"){b(d,new Error(c.message));return}if(c.type==="ready"){if(d.ready||c.size!==d.file.size){
b(d,new Error("Invalid artifact response size")),K(e,{type:"cancel",id:d.id});return}d.ready=!0,K(e,{type:"pull",id:d.id})}else if(c.
type==="chunk"){if(!d.ready||!d.resolvePull||!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||c.bytes.byteLength>i||
d.received+c.bytes.byteLength>d.file.size){K(e,{type:"cancel",id:d.id}),b(d,new Error("Invalid artifact chunk"));return}
d.received+=c.bytes.byteLength,d.streamController.enqueue(c.bytes);const w=d.resolvePull;d.resolvePull=null,w()}else c.type===
"end"&&(!d.ready||d.received!==d.file.size?b(d,new Error("Truncated artifact response")):(d.streamController.close(),b(d)))}});
async function g(c,d={}){if(u)throw new Error("Artifact bridge is closed");if(F(n),F(d.signal),d.method&&d.method!=="GET")
throw new Error("Model adapter supports GET only");const w=String(c);if(/[\\]/.test(w)||/%(?:2e|2f|5c|00)/i.test(w)||/\/(?:\.|\.\.)(?:\/|$)/.
test(w))throw new Error("Invalid artifact URL");const p=new URL(w,a);if(p.origin!==a.origin||p.username||p.password||p.search||
p.hash||!p.pathname.startsWith(a.pathname))throw new Error("Model path is outside its manifest");const v=yt(decodeURIComponent(
p.pathname.slice(a.pathname.length))),A=f.get(v);if(!A)return new Response("Artifact path is not in the manifest",{status:404});
const S=`read-${++E}`,x={id:S,path:v,file:A,requestSignal:d.signal,received:0,ready:!1,active:!1,queued:!1};x.abort=()=>{
var C;x.active&&K(e,{type:"cancel",id:S}),b(x,rr((n==null?void 0:n.reason)??((C=d.signal)==null?void 0:C.reason)))};const _=new ReadableStream(
{start(C){x.streamController=C},pull(){if(u)throw new Error("Artifact bridge is closed");if(F(n),F(d.signal),!x.active&&
!x.queued&&h.size>=o&&m.length>=s)throw new Error("Artifact reader limit reached");return new Promise(C=>{var T;x.resolvePull=
C,x.ready?K(e,{type:"pull",id:S}):x.queued||(x.queued=!0,n==null||n.addEventListener("abort",x.abort,{once:!0}),(T=d.signal)==
null||T.addEventListener("abort",x.abort,{once:!0}),m.push(x),y())})},cancel(){x.active&&K(e,{type:"cancel",id:S}),b(x)}},
{highWaterMark:0});return new Response(_,{headers:{"Content-Length":String(A.size),"Content-Type":A.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:g,close(c="Artifact bridge closed"){if(!u){u=!0;for(const d of[...h.values(),...m])d.active&&
K(e,{type:"cancel",id:d.id}),b(d,rr(c));I(),e.close()}}}}const Nf="4.3.2",Df=new Set(["qwen3_5","qwen3_5_text"]),Lt=new WeakMap,
$t="_get_text_only_rope_index";function sn(e,t,r){var o,s,a,f;const[n,i]=e??[];if((n==null?void 0:n.type)!=="int64"||(i==
null?void 0:i.type)!=="int64"||((o=n.dims)==null?void 0:o.length)!==3||n.dims[0]!==3||n.dims[1]!==t||n.dims[2]!==r||((s=
i.dims)==null?void 0:s.length)!==2||i.dims[0]!==t||i.dims[1]!==1||((a=n.data)==null?void 0:a.length)!==3*t*r||((f=i.data)==
null?void 0:f.length)!==t)throw new Error("Unsupported Qwen text position result");return{positions:n,deltas:i}}function zf(e,t){
var a,f,h;if(((a=t==null?void 0:t.env)==null?void 0:a.version)!==Nf||!Df.has((f=e==null?void 0:e.config)==null?void 0:f.
model_type))return!1;if(Lt.has(e)){if(e[$t]!==Lt.get(e))throw new Error("Qwen text position compatibility was replaced");
return!0}const r=e[$t];if(typeof r!="function"||typeof t.Tensor!="function")throw new Error("Qwen text position compatib\
ility is unavailable");const n=new t.Tensor("int64",[10n,11n],[1,2]),i=new t.Tensor("int64",[1n,1n],[1,2]);let o;try{o=r.
call(e,n,i);const{positions:m,deltas:E}=sn(o,1,2);if([...m.data].some((u,y)=>u!==BigInt(y%2)))throw new Error("Unsupport\
ed Qwen text position calculation");if(E.data[0]===0n)return!1;if(E.data[0]!==4n)throw new Error("Unsupported Qwen text \
position offset")}finally{for(const m of new Set([n,i,...Array.isArray(o)?o:[]]))(h=m==null?void 0:m.dispose)==null||h.call(
m)}function s(m,E){var y,b;const u=r.call(this,m,E);if(!E)return u;try{const[I,g]=E.dims??[];if(((y=E.dims)==null?void 0:
y.length)!==2||!Number.isSafeInteger(I)||I<1||!Number.isSafeInteger(g)||g<1)throw new Error("Invalid Qwen text position \
dimensions");const{positions:c,deltas:d}=sn(u,I,g);for(let p=0;p<I;p++){let v=c.data[p*g];for(let A=1;A<g;A++){const S=c.
data[p*g+A];S>v&&(v=S)}if(d.data[p]!==v+1n+BigInt(g))throw new Error("Qwen text position behavior changed")}const w=2n*BigInt(
g);for(let p=0;p<I;p++)d.data[p]-=w;return u}catch(I){for(const g of new Set(Array.isArray(u)?u:[]))(b=g==null?void 0:g.
dispose)==null||b.call(g);throw I}}return Object.defineProperty(e,$t,{value:s,configurable:!0,writable:!0}),Lt.set(e,s),
!0}const ot=e=>new TextEncoder().encode(e).byteLength;function Lf(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function si(e){if(e==null)return null;
if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1||e.width*e.height>M.maxImagePixels||
e.channels!==4||!(e.data instanceof Uint8Array||e.data instanceof Uint8ClampedArray)||e.data.byteLength!==e.width*e.height*
4||e.data.byteLength>M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fil\
es are not accepted");return e}function ai(e){const t=e.messages??(typeof e.prompt=="string"?[{role:"user",content:e.prompt}]:
null);if(!Array.isArray(t)||!t.length||t.length>M.maxMessages)throw new Error("Invalid inference messages");let r=0;return t.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=ot(n.content),r>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function ci(e){var n;if(!e)return;let t;const r=new Set;for(const i of[e.model,e.
processor,e.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.dispose)==null?void 0:n.call(i))}catch(o){t??(t=o)}}if(t)
throw t}function nr(e,t=new Set){if(!(!e||typeof e!="object"||t.has(e))){if(t.add(e),typeof e.dispose=="function"){e.dispose();
return}for(const r of Object.values(e))nr(r,t)}}function $f(e){const t=e.findIndex(n=>n.role==="user");if(t<0)return null;
const r=e.findIndex((n,i)=>i>t&&n.role==="user");return r<0?null:e.filter((n,i)=>i<t||i>=r||n.role==="system")}function Pf(e,t,r){
const n={...e.config};for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,e.generation_config);
const i=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],o=t.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(
a)&&a>=0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===BigInt(o))?"stop":t.length>=r?"length":"unknown"}function ee(e,t,r){const n=e===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${e}: ${String(
(t==null?void 0:t.message)??t??"operation failed").slice(0,240)}`,i=new Error(`Model session lost: ${r} ${n}`,{cause:t});
return i.code=e==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",i}function Gf(e){let t,r,n=!1;const i=a=>{
var f;n||(e.lost=!0,(!e.gpuFailure||a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(e.gpuFailure=a),(f=e.active)==null||f.abort(
a))},o=({error:a})=>{var f;return i(ee(((f=a==null?void 0:a.constructor)==null?void 0:f.name)==="GPUOutOfMemoryError"?"o\
ut-of-memory":"uncaptured error",a,(r==null?void 0:r.stage)??"resident model"))},s=()=>{if(!(!r||r.device)){r.device=t;for(const a of[
"validation","out-of-memory","internal"])t.pushErrorScope(a),r.filters.push(a)}};return{attach(a){var f,h;if(t&&t!==a)throw ee(
"device changed",null,"load");if(!t){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!="function"||typeof((f=
a.queue)==null?void 0:f.onSubmittedWorkDone)!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!=
"function"||typeof a.destroy!="function"||typeof((h=a.lost)==null?void 0:h.then)!="function")throw ee("device unavailabl\
e",null,"load");t=a,e.runtimeDevice=t,t.addEventListener("uncapturederror",o),t.lost.then(m=>i(ee("device lost",m,(r==null?
void 0:r.stage)??"resident model")),m=>i(ee("device lost",m,(r==null?void 0:r.stage)??"resident model")))}try{s()}catch(m){
const E=ee("error scope failure",m,(r==null?void 0:r.stage)??"load");throw i(E),E}},async run(a,f){if(e.lost)throw e.gpuFailure??
ee("device lost",null,a);if(r)throw new Error("Overlapping model GPU operations are not allowed");const h={stage:a,filters:[],
device:null};r=h;let m,E;try{if(t&&this.attach(t),m=await f(),!t)throw ee("device unavailable",null,a)}catch(b){E=b}if(t)
try{await t.queue.onSubmittedWorkDone()}catch(b){i(ee("queue failure",b,a))}const u=await Promise.all(h.filters.reverse().
map(async b=>{try{return{filter:b,error:await h.device.popErrorScope()}}catch(I){return{filter:b,error:I,scopeFailed:!0}}}));
r=null;for(const b of u)b.scopeFailed&&i(ee("error scope failure",b.error,a));const y=["out-of-memory","internal","valid\
ation"].map(b=>u.find(I=>I.filter===b&&I.error&&!I.scopeFailed)).find(Boolean);if(y&&i(ee(y.filter,y.error,a)),E instanceof
WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((E==null?void 0:E.message)??"")){const b=new Error("Model \
session lost: native inference runtime failed",{cause:E});b.code="ERR_MODEL_RUNTIME",i(b)}if(typeof(E==null?void 0:E.code)==
"string"&&E.code.startsWith("ERR_MODEL_GPU")&&i(E),e.gpuFailure)throw e.gpuFailure;if(E)throw E;return m},dispose(){n=!0,
t==null||t.removeEventListener("uncapturederror",o)}}}function Ff(e){var i;const t=["maxBindGroups","maxComputeWorkgroup\
StorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBuff\
erSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSi\
zeZ"],r={};for(const o of t){const s=(i=e.limits)==null?void 0:i[o];if(!Number.isSafeInteger(s)||s<=0)throw new Error(`W\
ebGPU adapter has an invalid ${o} limit`);r[o]=s}const n=["chromium-experimental-subgroup-matrix","timestamp-query","sha\
der-f16","subgroups","subgroup-size-control"].filter(o=>e.features.has(o));return{requiredLimits:r,requiredFeatures:n}}async function an(e){
var t,r,n;await ci(e.components),(t=e.restoreGpuEvidence)==null||t.call(e),(r=e.gpuGuard)==null||r.dispose(),(n=e.ownedDevice)==
null||n.destroy(),e.ownedDevice=null}async function jf({library:e,modelPath:t,options:r,manifest:n,adapterFeatures:i=[]}){
const o={};try{const s=await e.AutoConfig.from_pretrained(t,r),a=ti(n.model,s);for(const h of a)if(!i.includes(h))throw new Error(
`Model config requires unsupported GPU feature: ${h}`);const f={...r,config:s};if(n.model.architecture==="qwen3_5"&&(f.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await e.AutoProcessor.from_pretrained(t,r),n.model.architecture===
"qwen3_5"){const h=o.processor.image_processor;if(!h)throw new Error("Qwen3.5 image processor is unavailable");h.min_pixels=
256*256,h.max_pixels=ii(n.model).maxProcessedImagePixels,h.do_normalize??(h.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await e.AutoModelForImageTextToText.from_pretrained(t,f)}else o.tokenizer=await e.AutoTokenizer.from_pretrained(
t,r),o.model=await e.AutoModelForCausalLM.from_pretrained(t,f);return o}catch(s){throw await ci(o),s}}function cn(e){return{
sessionId:e.sessionId,manifestCid:e.manifestCid,status:e.lost?"lost":e.status,task:e.manifest.model.task,dtype:e.manifest.
model.dtype,workerId:e.workerId,adapter:e.adapter,runtimeAdapter:e.runtimeAdapter??null,gpuDispatches:e.gpuDispatches??0,
gpuSubmissions:e.gpuSubmissions??0,gpuProfileSamples:e.gpuProfileSamples??0,collectGpuEvidence:e.collectGpuEvidence===!0,
runtimeFeatures:e.runtimeFeatures??[],generatedRequests:e.generatedRequests,qwenTextRopeCompatibility:e.qwenTextRopeCompatibility===
!0}}function di({loadLibrary:e=()=>mi(()=>import("./transformers.web-Dn8CClj3.js"),[],import.meta.url),loadModel:t=jf,
gpu:r=(o=>(o=globalThis.navigator)==null?void 0:o.gpu)(),baseUrl:n=(s=>(s=globalThis.location)==null?void 0:s.href)(),assertWorker:i=Lf}={}){
const a=new Map;let f;async function h(E,u){var d,w,p,v,A,S;if(a.size)throw new Error("This inference worker already has\
 a resident/loading model");const y=Ye(E.sessionId),{manifest:b}=Uf(E.manifest),I=Mf(E.runtimeAssets,n);if(!((d=E.artifactPort)!=
null&&d.postMessage))throw new Error("An artifact reader port is required");F(u.signal);const g={sessionId:y,manifest:b,
manifestCid:E.manifestCid,status:"loading",workerId:u.workerId??null,generatedRequests:0,components:null};a.set(y,g);let c;
try{const x=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(F(u.signal),!x||(w=x.info)!=
null&&w.isFallbackAdapter||x.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fall\
back is disabled");const _=typeof b.model.dtype=="string"?[b.model.dtype]:Object.values(b.model.dtype),C=new Set(b.model.
requiredFeatures??[]);_.some(B=>["fp16","q4f16"].includes(B))&&C.add("shader-f16");for(const B of C)if(!x.features.has(B))
throw new Error(`Model requires unsupported GPU feature: ${B}`);g.adapter={vendor:((p=x.info)==null?void 0:p.vendor)??"",
architecture:((v=x.info)==null?void 0:v.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...C]};const T=await(f??
(f=e()));if(F(u.signal),T.env.version!==ri)throw new Error("Unexpected Transformers runtime version");const U=new URL("/\
__peercompute_models/",n);c=kf(E.artifactPort,{manifest:b,baseUrl:new URL(`${y}/`,U).href,signal:u.signal});const{env:D}=T;
D.logLevel=50,D.allowLocalModels=!0,D.allowRemoteModels=!1,D.localModelPath=U.pathname,D.useBrowserCache=!1,D.useFSCache=
!1,D.useWasmCache=!1,D.fetch=async(...B)=>{var z;try{return await c.fetch(...B)}catch(k){throw(z=u.emitProgress)==null||
z.call(u,{type:"artifact-read-error",sessionId:y,message:k.message}),k}},D.backends.onnx.wasm.proxy=!1,D.backends.onnx.wasm.
numThreads=1,D.backends.onnx.wasm.wasmPaths=I,g.gpuDispatches=0,g.gpuProfileSamples=0,g.gpuSubmissions=0,g.collectGpuEvidence=
E.collectGpuEvidence===!0,D.backends.onnx.webgpu&&(D.backends.onnx.webgpu.profiling={mode:E.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{g.gpuProfileSamples+=1}});const Ce={local_files_only:!0,device:"webgpu",dtype:b.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:B=>{var z,k;(z=u.signal)!=null&&z.aborted||(k=u.emitProgress)==null||k.
call(u,{type:"model-load",sessionId:y,status:String(B.status??"").slice(0,40),file:typeof B.file=="string"?B.file.slice(
0,512):void 0,loaded:Number.isFinite(B.loaded)?B.loaded:void 0,total:Number.isFinite(B.total)?B.total:void 0})}};g.library=
T,g.gpuGuard=Gf(g),await g.gpuGuard.run("load",async()=>{const B=D.backends.onnx.webgpu;if(!B)throw new Error("The WebGP\
U runtime is unavailable");B.adapter=x,g.ownedDevice=await x.requestDevice(Ff(x)),g.gpuGuard.attach(g.ownedDevice),Ce.session_options.
executionProviders=[{name:"webgpu",device:g.ownedDevice}],g.components=await t({library:T,modelPath:y,options:Ce,manifest:b,
adapterFeatures:[...x.features]}),g.qwenTextRopeCompatibility=zf(g.components.model,T);for(const z of C)if(!g.runtimeDevice.
features.has(z))throw new Error(`ORT device is missing required GPU feature: ${z}`);F(u.signal)});const R=g.runtimeDevice;
if(g.runtimeFeatures=[...(R==null?void 0:R.features)??[]],g.collectGpuEvidence&&R){const B=R.createCommandEncoder.bind(R),
z=R.queue.submit.bind(R.queue),k=Object.getOwnPropertyDescriptor(R,"createCommandEncoder"),V=Object.getOwnPropertyDescriptor(
R.queue,"submit");g.restoreGpuEvidence=()=>{k?Object.defineProperty(R,"createCommandEncoder",k):delete R.createCommandEncoder,
V?Object.defineProperty(R.queue,"submit",V):delete R.queue.submit,g.restoreGpuEvidence=null},R.createCommandEncoder=(..._e)=>{
const Y=B(..._e),Te=Y.beginComputePass.bind(Y);return Y.beginComputePass=(...Ve)=>{const J=Te(...Ve);for(const ne of["di\
spatchWorkgroups","dispatchWorkgroupsIndirect"]){const he=J[ne].bind(J);J[ne]=(...Ct)=>{const oe=he(...Ct);return g.gpuDispatches+=
1,oe}}return J},Y},R.queue.submit=(..._e)=>{const Y=z(..._e);return g.gpuSubmissions+=1,Y}}const le=(R==null?void 0:R.adapterInfo)??
((S=(A=D.backends.onnx.webgpu)==null?void 0:A.adapter)==null?void 0:S.info);if(le){if(le.isFallbackAdapter)throw new Error(
"ORT selected a software GPU adapter");g.runtimeAdapter={vendor:le.vendor,architecture:le.architecture,isFallbackAdapter:le.
isFallbackAdapter??!1}}if(F(u.signal),g.lost)throw g.gpuFailure;return g.status="ready",cn(g)}catch(x){try{await an(g),a.
delete(y)}catch(_){g.status="ready",g.lost=!0;const C=new Error(`MODEL_DISPOSE_FAILED: ${_.message}`);throw C.code="MODE\
L_DISPOSE_FAILED",C}throw x}finally{c==null||c.close(),c||E.artifactPort.close()}}async function m(E,u){var D,Ce,R,le;const y=a.
get(Ye(E.sessionId));if(!y||y.lost)throw new Error("Model session lost or not loaded");if(y.status!=="ready")throw new Error(
"Model session is busy");const b=Ye(E.requestId),I=E.maxNewTokens??M.maxNewTokens;if(!Number.isInteger(I)||I<1||I>M.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let g=ai(E);const c=si(E.image);if(c&&y.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");F(u.signal);const d=new AbortController,w=new y.
library.InterruptableStoppingCriteria,p=()=>{var B;d.abort((B=u.signal)==null?void 0:B.reason),w.interrupt()};(D=u.signal)==
null||D.addEventListener("abort",p,{once:!0}),d.signal.addEventListener("abort",()=>w.interrupt(),{once:!0}),y.active=d,
y.requestId=b,y.status="generating";let v,A,S=0,x=0,_,C=!1;const T=y.gpuDispatches??0,U=y.gpuSubmissions??0;try{F(u.signal);
const{tokenizer:B,processor:z,model:k}=y.components;let V;for(;;){F(d.signal);let J=g;if(z&&(J=g.map(oe=>({role:oe.role,
content:[{type:"text",text:oe.content}]})),c)){const oe=J.findLast(fi=>fi.role==="user");if(!oe)throw new Error("An imag\
e requires a user message");oe.content.unshift({type:"image"})}const ne=(z??B).apply_chat_template(J,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof ne!="string"||ot(ne)>M.maxPromptBytes)throw new Error("Templated prompt exceeds its byte \
budget");if(c){const oe=new y.library.RawImage(c.data,c.width,c.height,c.channels);v=await z(ne,oe,{do_image_splitting:!1})}else
v=await B(ne,{truncation:!1,padding:!1});if(F(d.signal),V=(R=(Ce=v.input_ids)==null?void 0:Ce.dims)==null?void 0:R.at(-1),
!Number.isSafeInteger(V)||V<1)throw new Error("Invalid model input token count");if(V+I<=M.maxContextTokens)break;const he=$f(
g);if(!he)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or \
request fewer output tokens");const Ct=v;v=void 0,nr(Ct),g=he,C=!0}F(d.signal);const _e=new y.library.TextStreamer(B,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:J=>{var ne;if(!(d.signal.aborted||_)){if(x+=ot(J),x>M.maxOutputBytes){_=new Error(
"Generated text exceeded its byte budget"),d.abort(_);return}try{if(((ne=u.emitProgress)==null?void 0:ne.call(u,{type:"t\
oken",sessionId:y.sessionId,requestId:b,sequence:S++,text:J}))===!1)throw new Error("Token consumer rejected output")}catch(he){
_=he,d.abort(he)}}}});if(await y.gpuGuard.run("generation",async()=>{A=await k.generate({...v,max_new_tokens:I,do_sample:!1,
streamer:_e,stopping_criteria:[w]})}),_)throw _;if(y.lost)throw y.gpuFailure;F(d.signal);const Y=A.tolist();if(Y.length!==
1||Y[0].length<V||Y[0].length>V+I)throw new Error("Model returned an over-budget token sequence");const Te=Y[0].slice(V),
Ve=B.decode(Te,{skip_special_tokens:!0});if(ot(Ve)>M.maxOutputBytes)throw new Error("Generated text exceeds its byte bud\
get");return y.generatedRequests+=1,{sessionId:y.sessionId,requestId:b,text:Ve,inputTokens:V,outputTokens:Te.length,finishReason:Pf(
k,Te,I),contextTruncated:C,workerId:y.workerId,gpuDispatches:(y.gpuDispatches??0)-T,gpuSubmissions:(y.gpuSubmissions??0)-
U,gpuProfileSamples:y.gpuProfileSamples??0}}catch(B){throw y.gpuFailure??B}finally{(le=u.signal)==null||le.removeEventListener(
"abort",p);try{const B=new Set;let z;for(const k of[v,A])try{nr(k,B)}catch(V){z??(z=V)}if(z){y.lost=!0;const k=y.gpuFailure??
new Error("Model session lost: tensor cleanup failed",{cause:z});throw k.code??(k.code="MODEL_DISPOSE_FAILED"),y.gpuFailure=
k,k}}finally{y.active=null,y.requestId=null,y.status="ready"}}}return async function(u={},y={}){var I;if(i(),u.command===
"load")return h(u,y);if(u.command==="generate")return m(u,y);const b=a.get(Ye(u.sessionId));if(u.command==="status")return b?
cn(b):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return(b==null?void 0:b.requestId)===u.requestId&&
((I=b.active)==null||I.abort("Generation cancelled")),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="u\
nload"){if(!b)return{sessionId:u.sessionId,status:"absent"};if(b.status!=="ready")throw new Error("Cancel and await acti\
ve model work before unloading");b.status="unloading";try{await an(b)}catch(g){b.status="ready",b.lost=!0;const c=new Error(
`MODEL_DISPOSE_FAILED: ${g.message}`);throw c.code="MODEL_DISPOSE_FAILED",c}return a.delete(u.sessionId),{sessionId:u.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const qf=di(),Qf=(e,t)=>qf(e,t),w0=Object.freeze(Object.
defineProperty({__proto__:null,createModelTaskRuntime:di,handleModelTask:Qf,normalizeModelMessages:ai,validateImageInput:si},
Symbol.toStringTag,{value:"Module"})),Vf=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...Vf,"co\
mpute_probabilities"]);let xe=null,dn=null;async function E0(){if(xe)return xe;try{return dn=new af({frameBudgetMs:6}),xe=
await dn.initialize(),xe}catch(e){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",e);
const{device:t}=await hi();return xe=t,xe}}export{Yd as A,N as C,h0 as G,p0 as L,M,ye as O,mi as _,Uf as a,Ye as b,si as c,rr as d,ti as e,ef as f,E0 as g,ud as h,
Ld as i,l0 as j,Zd as k,Jd as l,yt as m,ai as n,g0 as o,kf as p,m0 as q,b0 as r,y0 as s,F as t,Rf as u,Mf as v,w0 as w};
