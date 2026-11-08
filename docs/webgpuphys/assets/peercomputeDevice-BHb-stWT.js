var nn=Object.defineProperty;var on=(t,e,r)=>e in t?nn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var f=(t,e,r)=>on(t,typeof e!="symbol"?e+"":e,r);import{i as sn}from"./device-B4S7QtIr.js";const an="modulepreload",cn=function(t,e){return new URL(t,e).href},Lt={},dn=function(e,r,n){let i=Promise.resolve();if(r&&
r.length>0){let s=function(u){return Promise.all(u.map(x=>Promise.resolve(x).then(h=>({status:"fulfilled",value:h}),h=>({
status:"rejected",reason:h}))))};const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=c\
sp-nonce]"),m=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));i=s(r.map(u=>{if(u=cn(u,n),u in Lt)return;
Lt[u]=!0;const x=u.endsWith(".css"),h=x?'[rel="stylesheet"]':"";if(!!n)for(let I=a.length-1;I>=0;I--){const g=a[I];if(g.
href===u&&(!x||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${h}`))return;const p=document.
createElement("link");if(p.rel=x?"stylesheet":an,x||(p.as="script"),p.crossOrigin="",p.href=u,m&&p.setAttribute("nonce",
m),document.head.appendChild(p),x)return new Promise((I,g)=>{p.addEventListener("load",I),p.addEventListener("error",()=>g(
new Error(`Unable to preload CSS for ${u}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});
if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="re\
jected"&&o(a.reason);return e().catch(o)})};class fn{constructor(){f(this,"index",0);f(this,"input","")}new(e){return this.
index=0,this.input=e,this}readAtomically(e){const r=this.index,n=e();return n===void 0&&(this.index=r),n}parseWith(e){const r=e();
if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){
if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const r=this.
readChar();if(r===e)return r})}readSeparator(e,r,n){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(e)===void 0))
return n()})}readNumber(e,r,n,i){return this.readAtomically(()=>{let o=0,s=0;const a=this.peekChar();if(a===void 0)return;
const l=a==="0",m=2**(8*i)-1;for(;;){const u=this.readAtomically(()=>{const x=this.readChar();if(x===void 0)return;const h=Number.
parseInt(x,e);if(!Number.isNaN(h))return h});if(u===void 0)break;if(o*=e,o+=u,o>m||(s+=1,r!==void 0&&s>r))return}if(s!==
0)return!n&&l&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let r=0;r<e.length;r++){
const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;e[r]=n}return e})}readIPv6Addr(){const e=r=>{
for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.readSeparator(":",n,()=>this.readIPv4Addr());if(s!==
void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}const o=this.readSeparator(":",n,()=>this.readNumber(
16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(
16),[n,i]=e(r);if(n===16)return r;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(
14),s=16-(n+2),[a]=e(o.subarray(0,s));return r.set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.
readIPv6Addr()}}const ln=45,un=15,qe=new fn;function hn(t){if(!(t.length>un))return qe.new(t).parseWith(()=>qe.readIPv4Addr())}
function pn(t){if(t.includes("%")&&(t=t.split("%")[0]),!(t.length>ln))return qe.new(t).parseWith(()=>qe.readIPv6Addr())}
function Er(t){return!!hn(t)}function bn(t){return!!pn(t)}function vr(t=0){return new Uint8Array(t)}function wn(t){return(t==
null?void 0:t.buffer)instanceof ArrayBuffer}function mn(t){if(wn(t))return t;const e=t.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function xr(t,e){e==null&&(e=t.reduce((i,o)=>i+o.length,0));const r=vr(e);let n=0;for(const i of t)r.set(
i,n),n+=i.length;return mn(r)}function gn(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.
byteLength;r++)if(t[r]!==e[r])return!1;return!0}function Ce(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Ar\
ray")return Ie(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Ie(new Uint8Array(
t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function yn(t){const e=new Uint8Array(
t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const qt=4096;function En(t){const e=t.length;if(e<=qt)
return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=qt));
return r}function vn(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function Ie(t){return vn(t)?t:t.slice()}function xn(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var l=s.
toLowerCase().charCodeAt(0),m=s.toUpperCase().charCodeAt(0);l!==a&&(n[l]=o),m!==a&&(n[m]=o)}}var u=t.length,x=t.charAt(0),
h=Math.log(u)/Math.log(256),A=Math.log(256)/Math.log(u);function p(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,C=0,b=0,E=c.length;b!==E&&c[b]===0;)b++,
d++;for(var v=(E-b)*A+1>>>0,w=new Uint8Array(v);b!==E;){for(var y=c[b],_=0,S=v-1;(y!==0||_<C)&&S!==-1;S--,_++)y+=256*w[S]>>>
0,w[S]=y%u>>>0,y=y/u>>>0;if(y!==0)throw new Error("Non-zero carry");C=_,b++}for(var U=v-C;U!==v&&w[U]===0;)U++;for(var T=x.
repeat(d);U<v;++U)T+=t.charAt(w[U]);return T}function I(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var C=0,b=0;c[d]===x;)C++,d++;for(var E=(c.length-d)*h+
1>>>0,v=new Uint8Array(E);c[d];){var w=n[c.charCodeAt(d)];if(w===255)return;for(var y=0,_=E-1;(w!==0||y<b)&&_!==-1;_--,y++)
w+=u*v[_]>>>0,v[_]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");b=y,d++}if(c[d]!==" "){for(var S=E-b;S!==
E&&v[S]===0;)S++;for(var U=new Uint8Array(C+(E-S)),T=C;S!==E;)U[T++]=v[S++];return U}}}function g(c){var d=I(c);if(d)return d;
throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:I,decode:g}}var An=xn,Sn=An;let Cn=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},In=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseDecode");f(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Ar(this,e)}},_n=class{constructor(e){f(this,"decoders");this.
decoders=e}or(e){return Ar(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Ar(t,e){return new _n({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let Un=class{constructor(e,r,n,i){
f(this,"name");f(this,"prefix");f(this,"baseEncode");f(this,"baseDecode");f(this,"encoder");f(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Cn(e,r,n),this.decoder=new In(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function et({name:t,prefix:e,encode:r,decode:n}){return new Un(
t,e,r,n)}function Ue({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Sn(r,t,n);return et({prefix:e,
name:t,encode:i,decode:s=>Ce(o(s))})}function Tn(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,l=0;for(let m=0;m<i;++m){const u=e[t[m]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|u,s+=r,s>=8&&(s-=8,o[l++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Bn(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let l=0;l<t.length;++l)for(a=a<<8|t[l],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function $n(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function N({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=$n(n,i);return et(
{prefix:e,name:t,encode(s){return Bn(s,n,r)},decode(s){return Tn(s,o,r,t)}})}const kn=Ue({prefix:"9",name:"base10",alphabet:"\
0123456789"}),Mn=Object.freeze(Object.defineProperty({__proto__:null,base10:kn},Symbol.toStringTag,{value:"Module"})),zn=N(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Dn=N({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Nn=Object.freeze(Object.defineProperty({__proto__:null,
base16:zn,base16upper:Dn},Symbol.toStringTag,{value:"Module"})),On=N({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
Pn=Object.freeze(Object.defineProperty({__proto__:null,base2:On},Symbol.toStringTag,{value:"Module"})),Sr=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),Rn=Sr.reduce((t,e,r)=>(t[r]=e,t),[]),Fn=Sr.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function Gn(t){return t.reduce((e,r)=>(e+=Rn[r],e),"")}function Ln(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Fn[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(e)}const qn=et({prefix:"🚀",name:"\
base256emoji",encode:Gn,decode:Ln}),jn=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:qn},Symbol.toStringTag,
{value:"Module"})),he=N({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
Vn=N({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Qn=N(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Kn=N({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Wn=N({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Hn=N({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Xn=N({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Jn=N({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Zn=N({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Yn=Object.freeze(Object.defineProperty({__proto__:null,
base32:he,base32hex:Wn,base32hexpad:Xn,base32hexpadupper:Jn,base32hexupper:Hn,base32pad:Qn,base32padupper:Kn,base32upper:Vn,
base32z:Zn},Symbol.toStringTag,{value:"Module"})),Pe=Ue({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),ei=Ue({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
ti=Object.freeze(Object.defineProperty({__proto__:null,base36:Pe,base36upper:ei},Symbol.toStringTag,{value:"Module"})),ee=Ue(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),ri=Ue({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),ni=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:ee,base58flickr:ri},Symbol.toStringTag,{value:"Module"})),ii=N({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),oi=N({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Cr=N({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),si=N({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ai=Object.freeze(Object.defineProperty(
{__proto__:null,base64:ii,base64pad:oi,base64url:Cr,base64urlpad:si},Symbol.toStringTag,{value:"Module"})),ci=N({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),di=Object.freeze(Object.defineProperty({__proto__:null,base8:ci},Symbol.
toStringTag,{value:"Module"})),fi=et({prefix:"\0",name:"identity",encode:t=>En(Ce(t)),decode:t=>Ce(yn(t))}),li=Object.freeze(
Object.defineProperty({__proto__:null,identity:fi},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var ui=Ir,jt=128,hi=-128,pi=Math.pow(2,31);function Ir(t,e,r){e=e||[],r=r||0;for(var n=r;t>=pi;)e[r++]=t&255|jt,t/=128;for(;t&
hi;)e[r++]=t&255|jt,t>>>=7;return e[r]=t|0,Ir.bytes=r-n+1,e}var bi=wt,wi=128,Vt=127;function wt(t,n){var r=0,n=n||0,i=0,
o=n,s,a=t.length;do{if(o>=a)throw wt.bytes=0,new RangeError("Could not decode varint");s=t[o++],r+=i<28?(s&Vt)<<i:(s&Vt)*
Math.pow(2,i),i+=7}while(s>=wi);return wt.bytes=o-n,r}var mi=Math.pow(2,7),gi=Math.pow(2,14),yi=Math.pow(2,21),Ei=Math.pow(
2,28),vi=Math.pow(2,35),xi=Math.pow(2,42),Ai=Math.pow(2,49),Si=Math.pow(2,56),Ci=Math.pow(2,63),Ii=function(t){return t<
mi?1:t<gi?2:t<yi?3:t<Ei?4:t<vi?5:t<xi?6:t<Ai?7:t<Si?8:t<Ci?9:10},_i={encode:ui,decode:bi,encodingLength:Ii},je=_i;function mt(t,e=0){
const r=je.decode(t,e),n=je.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function Ve(t,e,r=0){return je.encode(t,e,r),e}function Qe(t){return je.
encodingLength(t)}function Ui(t,e){const r=e.byteLength,n=Qe(t),i=n+Qe(r),o=new Uint8Array(i+r);return Ve(t,o,0),Ve(r,o,
n),o.set(e,i),new kt(t,r,e,o)}function Ti(t){const e=Ce(t),[r,n]=mt(e),[i,o]=mt(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new kt(r,i,s,e)}function Bi(t,e){if(t===e)return!0;{const r=e;return t.code===
r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&gn(t.bytes,r.bytes)}}let kt=class{constructor(e,r,n,i){f(this,"c\
ode");f(this,"size");f(this,"digest");f(this,"bytes");this.code=e,this.size=r,this.digest=Ie(n),this.bytes=Ie(i)}};function Qt(t,e){
const{bytes:r,version:n}=t;switch(n){case 0:return Mi(r,gt(t),e??ee.encoder);default:return zi(r,gt(t),e??he.encoder)}}const Kt=new WeakMap;
function gt(t){const e=Kt.get(t);if(e==null){const r=new Map;return Kt.set(t,r),r}return e}var wr;let $i=class F{constructor(e,r,n,i){
f(this,"code");f(this,"version");f(this,"multihash");f(this,"bytes");f(this,"/");f(this,wr,"CID");this.code=r,this.version=
e,this.multihash=n,this.bytes=Ie(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
we)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Di)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return F.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=Ui(e,
r);return F.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return F.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&Bi(e.multihash,n.multihash)}toString(e){return Qt(this,e)}toJSON(){return{"/":Qt(
this)}}link(){return this}[(wr=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof F)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new F(n,i,o,s??Wt(n,i,o.bytes))}else if(r[Ni]===!0){const{version:n,
multihash:i,code:o}=r,s=Ti(i);return F.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==we)throw new Error(`Version 0 CID must use dag-pb (code: ${we}) block encoding`);return new F(e,r,n,n.bytes)}case 1:{
const i=Wt(e,r,n.bytes);return new F(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return F.create(
0,we,e)}static createV1(e,r){return F.create(1,e,r)}static decode(e){const[r,n]=F.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=F.inspectBytes(e),n=r.size-r.multihashSize,i=Ce(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new kt(r.multihashCode,r.digestSize,o,i);return[r.version===0?F.createV0(s):F.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[x,h]=mt(e.subarray(r));return r+=h,x};let i=n(),o=we;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),l=n(),m=r+l,u=m-s;return{version:i,
codec:o,multihashCode:a,digestSize:l,multihashSize:u,size:m}}static parse(e,r){const[n,i]=ki(e,r),o=F.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return gt(o).set(n,e),o}};function ki(t,e){
switch(t[0]){case"Q":{const r=e??ee;return[ee.prefix,r.decode(`${ee.prefix}${t}`)]}case ee.prefix:{const r=e??ee;return[
ee.prefix,r.decode(t)]}case he.prefix:{const r=e??he;return[he.prefix,r.decode(t)]}case Pe.prefix:{const r=e??Pe;return[
Pe.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function Mi(t,e,r){const{prefix:n}=r;if(n!==ee.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function zi(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const we=112,Di=18;function Wt(t,e,r){const n=Qe(t),i=n+Qe(e),o=new Uint8Array(i+r.byteLength);return Ve(t,o,0),
Ve(e,o,n),o.set(r,i),o}const Ni=Symbol.for("@ipld/js-cid/CID"),yt={...li,...Pn,...di,...Mn,...Nn,...Yn,...ti,...ni,...ai,
...jn};function _r(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const Ht=_r("u\
tf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),at=_r("ascii","a",t=>{let e="\
a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=vr(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}),Ur={utf8:Ht,"utf-8":Ht,hex:yt.base16,latin1:at,ascii:at,binary:at,...yt};function Tr(t,e="\
utf8"){const r=Ur[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}
function Ke(t,e="utf8"){const r=Ur[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(
t).substring(1)}class fe extends Error{constructor(){super(...arguments);f(this,"name","InvalidMultiaddrError")}}f(fe,"n\
ame","InvalidMultiaddrError");class pe extends Error{constructor(){super(...arguments);f(this,"name","ValidationError")}}
f(pe,"name","ValidationError");class Br extends Error{constructor(){super(...arguments);f(this,"name","UnknownProtocolEr\
ror")}}f(Br,"name","UnknownProtocolError");const Oi=4,Pi=6,Ri=273,Fi=33,Gi=41,Li=42,qi=43,ji=53,Vi=54,Qi=55,Ki=56,Wi=132,
Hi=301,Xi=302,Ji=400,Zi=421,Yi=444,eo=445,to=446,ro=447,no=448,io=449,oo=454,so=460,ao=461,co=465,fo=466,lo=480,uo=481,ho=443,
po=477,bo=478,wo=479,mo=277,go=275,yo=276,Eo=280,vo=281,xo=290,Ao=777;function Xt(t){return e=>Ke(e,t)}function Jt(t){return e=>Tr(
e,t)}function Ae(t){return new DataView(t.buffer).getUint16(t.byteOffset).toString()}function ue(t){const e=new ArrayBuffer(
2);return new DataView(e).setUint16(0,typeof t=="string"?parseInt(t):t),new Uint8Array(e)}function So(t){const e=t.split(
":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port numbe\
r`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const r=Tr(e[0],
"base32"),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=ue(n);return xr(
[r,i],r.length+i.length)}function Co(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr\
: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${e[0]} not a Tor onion3 address.`);const r=he.decode(`b${e[0]}`),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=ue(n);return xr([r,i],r.length+i.length)}function Zt(t){const e=t.subarray(
0,t.length-2),r=t.subarray(t.length-2),n=Ke(e,"base32"),i=Ae(r);return`${n}:${i}`}const $r=function(t){t=t.toString().trim();
const e=new Uint8Array(4);return t.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new fe(
"Invalid byte value in IP address");e[n]=i}),e},Io=function(t){let e=0;t=t.toString().trim();const r=t.split(":",8);let n;
for(n=0;n<r.length;n++){const o=Er(r[n]);let s;o&&(s=$r(r[n]),r[n]=Ke(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,Ke(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(e+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new fe("Invalid byte value in IP address");i[e++]=o>>8&255,i[e++]=o&255}return i},_o=function(t){
if(t.byteLength!==4)throw new fe("IPv4 address was incorrect length");const e=[];for(let r=0;r<t.byteLength;r++)e.push(t[r]);
return e.join(".")},Uo=function(t){if(t.byteLength!==16)throw new fe("IPv6 address was incorrect length");const e=[];for(let n=0;n<
t.byteLength;n+=2){const i=t[n],o=t[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;e.push(s)}
const r=e.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new fe(
`Invalid IPv6 address "${r}"`)}};function To(t){try{const e=new URL(`http://[${t}]`);return e.hostname.substring(1,e.hostname.
length-1)}catch{throw new fe(`Invalid IPv6 address "${t}"`)}}const ct=Object.values(yt).map(t=>t.decoder),Bo=(function(){
let t=ct[0].or(ct[1]);return ct.slice(2).forEach(e=>t=t.or(e)),t})();function $o(t){return Bo.decode(t)}function ko(t){return e=>t.
encoder.encode(e)}function Mo(t){if(parseInt(t).toString()!==t)throw new pe("Value must be an integer")}function zo(t){if(t<
0)throw new pe("Value must be a positive integer, or zero")}function Do(t){return e=>{if(e>t)throw new pe(`Value must be\
 smaller than or equal to ${t}`)}}function No(...t){return e=>{for(const r of t)r(e)}}const ze=No(Mo,zo,Do(65535)),V=-1;
class Oo{constructor(){f(this,"protocolsByCode",new Map);f(this,"protocolsByName",new Map)}getProtocol(e){let r;if(typeof e==
"string"?r=this.protocolsByName.get(e):r=this.protocolsByCode.get(e),r==null)throw new Br(`Protocol ${e} was unknown`);return r}addProtocol(e){
var r;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(r=e.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,e)})}removeProtocol(e){var n;const r=this.protocolsByCode.get(e);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const Po=new Oo,Ro=[
{code:Oi,name:"ip4",size:32,valueToBytes:$r,bytesToValue:_o,validate:t=>{if(!Er(t))throw new pe(`Invalid IPv4 address "${t}\
"`)}},{code:Pi,name:"tcp",size:16,valueToBytes:ue,bytesToValue:Ae,validate:ze},{code:Ri,name:"udp",size:16,valueToBytes:ue,
bytesToValue:Ae,validate:ze},{code:Fi,name:"dccp",size:16,valueToBytes:ue,bytesToValue:Ae,validate:ze},{code:Gi,name:"ip\
6",size:128,valueToBytes:Io,bytesToValue:Uo,stringToValue:To,validate:t=>{if(!bn(t))throw new pe(`Invalid IPv6 address "${t}\
"`)}},{code:Li,name:"ip6zone",size:V},{code:qi,name:"ipcidr",size:8,bytesToValue:Xt("base10"),valueToBytes:Jt("base10")},
{code:ji,name:"dns",size:V},{code:Vi,name:"dns4",size:V},{code:Qi,name:"dns6",size:V},{code:Ki,name:"dnsaddr",size:V},{code:Wi,
name:"sctp",size:16,valueToBytes:ue,bytesToValue:Ae,validate:ze},{code:Hi,name:"udt"},{code:Xi,name:"utp"},{code:Ji,name:"\
unix",size:V,stringToValue:t=>decodeURIComponent(t),valueToString:t=>encodeURIComponent(t)},{code:Zi,name:"p2p",aliases:[
"ipfs"],size:V,bytesToValue:Xt("base58btc"),valueToBytes:t=>t.startsWith("Q")||t.startsWith("1")?Jt("base58btc")(t):$i.parse(
t).multihash.bytes},{code:Yi,name:"onion",size:96,bytesToValue:Zt,valueToBytes:So},{code:eo,name:"onion3",size:296,bytesToValue:Zt,
valueToBytes:Co},{code:to,name:"garlic64",size:V},{code:ro,name:"garlic32",size:V},{code:no,name:"tls"},{code:io,name:"s\
ni",size:V},{code:oo,name:"noise"},{code:so,name:"quic"},{code:ao,name:"quic-v1"},{code:co,name:"webtransport"},{code:fo,
name:"certhash",size:V,bytesToValue:ko(Cr),valueToBytes:$o},{code:lo,name:"http"},{code:uo,name:"http-path",size:V,stringToValue:t=>`\
/${decodeURIComponent(t)}`,valueToString:t=>encodeURIComponent(t.substring(1))},{code:ho,name:"https"},{code:po,name:"ws"},
{code:bo,name:"wss"},{code:wo,name:"p2p-websocket-star"},{code:mo,name:"p2p-stardust"},{code:go,name:"p2p-webrtc-star"},
{code:yo,name:"p2p-webrtc-direct"},{code:Eo,name:"webrtc-direct"},{code:vo,name:"webrtc"},{code:xo,name:"p2p-circuit"},{
code:Ao,name:"memory",size:V}];Ro.forEach(t=>{Po.addProtocol(t)});function Et(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return er(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return er(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function Fo(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const Yt=4096;function Go(t){const e=t.
length;if(e<=Yt)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=Yt));return r}function Lo(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function er(t){return Lo(
t)?t:t.slice()}function qo(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var l=s.toLowerCase().charCodeAt(0),m=s.toUpperCase().charCodeAt(0);l!==a&&(n[l]=o),m!==
a&&(n[m]=o)}}var u=t.length,x=t.charAt(0),h=Math.log(u)/Math.log(256),A=Math.log(256)/Math.log(u);function p(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,C=0,
b=0,E=c.length;b!==E&&c[b]===0;)b++,d++;for(var v=(E-b)*A+1>>>0,w=new Uint8Array(v);b!==E;){for(var y=c[b],_=0,S=v-1;(y!==
0||_<C)&&S!==-1;S--,_++)y+=256*w[S]>>>0,w[S]=y%u>>>0,y=y/u>>>0;if(y!==0)throw new Error("Non-zero carry");C=_,b++}for(var U=v-
C;U!==v&&w[U]===0;)U++;for(var T=x.repeat(d);U<v;++U)T+=t.charAt(w[U]);return T}function I(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var C=0,b=0;c[d]===x;)C++,d++;for(var E=(c.
length-d)*h+1>>>0,v=new Uint8Array(E);c[d];){var w=n[c.charCodeAt(d)];if(w===255)return;for(var y=0,_=E-1;(w!==0||y<b)&&
_!==-1;_--,y++)w+=u*v[_]>>>0,v[_]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");b=y,d++}if(c[d]!==" "){
for(var S=E-b;S!==E&&v[S]===0;)S++;for(var U=new Uint8Array(C+(E-S)),T=C;S!==E;)U[T++]=v[S++];return U}}}function g(c){var d=I(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:I,decode:g}}var jo=qo,Vo=jo;let Qo=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Ko=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseDecode");f(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return kr(this,e)}},Wo=class{constructor(e){f(this,"decoders");this.
decoders=e}or(e){return kr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function kr(t,e){return new Wo({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let Ho=class{constructor(e,r,n,i){
f(this,"name");f(this,"prefix");f(this,"baseEncode");f(this,"baseDecode");f(this,"encoder");f(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Qo(e,r,n),this.decoder=new Ko(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function tt({name:t,prefix:e,encode:r,decode:n}){return new Ho(
t,e,r,n)}function Te({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Vo(r,t,n);return tt({prefix:e,
name:t,encode:i,decode:s=>Et(o(s))})}function Xo(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,l=0;for(let m=0;m<i;++m){const u=e[t[m]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|u,s+=r,s>=8&&(s-=8,o[l++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Jo(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let l=0;l<t.length;++l)for(a=a<<8|t[l],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Zo(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function O({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Zo(n,i);return tt(
{prefix:e,name:t,encode(s){return Jo(s,n,r)},decode(s){return Xo(s,o,r,t)}})}Te({prefix:"9",name:"base10",alphabet:"0123\
456789"});O({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});O({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});O({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const Mr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Yo=Mr.reduce((t,e,r)=>(t[r]=e,t),[]),es=Mr.reduce((t,e,r)=>{const n=e.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);function ts(t){return t.reduce(
(e,r)=>(e+=Yo[r],e),"")}function rs(t){const e=[];for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=es[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(
e)}tt({prefix:"🚀",name:"base256emoji",encode:ts,decode:rs});O({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
tuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});O({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0});O({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0});O({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});
O({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});O({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});O({prefix:"t",name:"\
base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});O({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});O({prefix:"h",name:"base32z",
alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Te({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijk\
lmnopqrstuvwxyz",caseInsensitive:!0});Te({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
caseInsensitive:!0});Te({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxy\
z"});Te({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});O({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});O({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});O({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});O({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});O({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3});tt({prefix:"\0",name:"identity",encode:t=>Go(Et(t)),decode:t=>Et(Fo(
t))});new TextEncoder;new TextDecoder;const ns="/",is=new TextEncoder().encode(ns);is[0];function os(t){if(t instanceof Uint8Array&&
t.constructor.name==="Uint8Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))
return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function ss(t){
return new TextEncoder().encode(t)}function as(t){return new TextDecoder().decode(t)}function cs(t,e){if(t.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<t.length;i++){var o=t.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=t.length,l=t.charAt(0),m=Math.log(
a)/Math.log(256),u=Math.log(256)/Math.log(a);function x(p){if(p instanceof Uint8Array||(ArrayBuffer.isView(p)?p=new Uint8Array(
p.buffer,p.byteOffset,p.byteLength):Array.isArray(p)&&(p=Uint8Array.from(p))),!(p instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(p.length===0)return"";for(var I=0,g=0,c=0,d=p.length;c!==d&&p[c]===0;)c++,I++;for(var C=(d-c)*
u+1>>>0,b=new Uint8Array(C);c!==d;){for(var E=p[c],v=0,w=C-1;(E!==0||v<g)&&w!==-1;w--,v++)E+=256*b[w]>>>0,b[w]=E%a>>>0,E=
E/a>>>0;if(E!==0)throw new Error("Non-zero carry");g=v,c++}for(var y=C-g;y!==C&&b[y]===0;)y++;for(var _=l.repeat(I);y<C;++y)
_+=t.charAt(b[y]);return _}function h(p){if(typeof p!="string")throw new TypeError("Expected String");if(p.length===0)return new Uint8Array;
var I=0;if(p[I]!==" "){for(var g=0,c=0;p[I]===l;)g++,I++;for(var d=(p.length-I)*m+1>>>0,C=new Uint8Array(d);p[I];){var b=r[p.
charCodeAt(I)];if(b===255)return;for(var E=0,v=d-1;(b!==0||E<c)&&v!==-1;v--,E++)b+=a*C[v]>>>0,C[v]=b%256>>>0,b=b/256>>>0;
if(b!==0)throw new Error("Non-zero carry");c=E,I++}if(p[I]!==" "){for(var w=d-c;w!==d&&C[w]===0;)w++;for(var y=new Uint8Array(
g+(d-w)),_=g;w!==d;)y[_++]=C[w++];return y}}}function A(p){var I=h(p);if(I)return I;throw new Error(`Non-${e} character`)}
return{encode:x,decodeUnsafe:h,decode:A}}var ds=cs,fs=ds;let ls=class{constructor(e,r,n){f(this,"name");f(this,"prefix");
f(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},us=class{constructor(e,r,n){f(this,"name");f(this,"pr\
efix");f(this,"baseDecode");f(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return zr(this,e)}},hs=class{constructor(e){f(this,"decoders");this.decoders=e}or(e){
return zr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function zr(t,e){
return new hs({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let ps=class{constructor(e,r,n,i){f(this,"n\
ame");f(this,"prefix");f(this,"baseEncode");f(this,"baseDecode");f(this,"encoder");f(this,"decoder");this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ls(e,r,n),this.decoder=new us(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function rt({name:t,prefix:e,encode:r,decode:n}){return new ps(t,e,r,
n)}function Be({name:t,prefix:e,alphabet:r}){const{encode:n,decode:i}=fs(r,t);return rt({prefix:e,name:t,encode:n,decode:o=>os(
i(o))})}function bs(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,l=0;for(let m=0;m<
i;++m){const u=e[t[m]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|u,s+=r,s>=8&&(s-=8,o[l++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function ws(t,e,r){const n=e[e.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let l=0;l<t.length;++l)for(a=a<<8|t[l],s+=8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=
e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function ms(t){const e={};for(let r=0;r<t.length;++r)e[t[r]]=r;return e}
function P({name:t,prefix:e,bitsPerChar:r,alphabet:n}){const i=ms(n);return rt({prefix:e,name:t,encode(o){return ws(o,n,
r)},decode(o){return bs(o,i,r,t)}})}const gs=Be({prefix:"9",name:"base10",alphabet:"0123456789"}),ys=Object.freeze(Object.
defineProperty({__proto__:null,base10:gs},Symbol.toStringTag,{value:"Module"})),Es=P({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),vs=P({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),xs=Object.
freeze(Object.defineProperty({__proto__:null,base16:Es,base16upper:vs},Symbol.toStringTag,{value:"Module"})),As=P({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),Ss=Object.freeze(Object.defineProperty({__proto__:null,base2:As},Symbol.toStringTag,
{value:"Module"})),Dr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Cs=Dr.reduce((t,e,r)=>(t[r]=e,t),[]),
Is=Dr.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);
function _s(t){return t.reduce((e,r)=>(e+=Cs[r],e),"")}function Us(t){const e=[];for(const r of t){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Is[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);e.push(i)}return new Uint8Array(e)}const Ts=rt({prefix:"🚀",name:"base256emoji",encode:_s,decode:Us}),Bs=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Ts},Symbol.toStringTag,{value:"Module"})),$s=P({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),ks=P({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Ms=P({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),zs=P({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Ds=P(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Ns=P({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Os=P({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),Ps=P({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),Rs=P({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
Fs=Object.freeze(Object.defineProperty({__proto__:null,base32:$s,base32hex:Ds,base32hexpad:Os,base32hexpadupper:Ps,base32hexupper:Ns,
base32pad:Ms,base32padupper:zs,base32upper:ks,base32z:Rs},Symbol.toStringTag,{value:"Module"})),Gs=Be({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),Ls=Be({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),qs=Object.freeze(Object.defineProperty({__proto__:null,base36:Gs,base36upper:Ls},Symbol.toStringTag,
{value:"Module"})),js=Be({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),Vs=Be({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Qs=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:js,base58flickr:Vs},Symbol.toStringTag,{value:"Module"})),Ks=P({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Ws=P({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Hs=P({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Xs=P({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Js=Object.
freeze(Object.defineProperty({__proto__:null,base64:Ks,base64pad:Ws,base64url:Hs,base64urlpad:Xs},Symbol.toStringTag,{value:"\
Module"})),Zs=P({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Ys=Object.freeze(Object.defineProperty({__proto__:null,
base8:Zs},Symbol.toStringTag,{value:"Module"})),ea=rt({prefix:"\0",name:"identity",encode:t=>as(t),decode:t=>ss(t)}),ta=Object.
freeze(Object.defineProperty({__proto__:null,identity:ea},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const tr={...ta,...Ss,...Ys,...ys,...xs,...Fs,...qs,...Qs,...Js,...Bs};function vt(t=0){return new Uint8Array(t)}function We(t=0){
return new Uint8Array(t)}function Nr(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}
const rr=Nr("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),dt=Nr("asci\
i","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=We(t.
length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),ra={utf8:rr,"utf-8":rr,hex:tr.base16,latin1:dt,ascii:dt,
binary:dt,...tr};function na(t,e="utf8"){const r=ra[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.
decoder.decode(`${r.prefix}${t}`)}const ia=Math.pow(2,7),oa=Math.pow(2,14),sa=Math.pow(2,21),Or=Math.pow(2,28),Pr=Math.pow(
2,35),Rr=Math.pow(2,42),Fr=Math.pow(2,49),j=128,oe=127;function Mt(t){if(t<ia)return 1;if(t<oa)return 2;if(t<sa)return 3;
if(t<Or)return 4;if(t<Pr)return 5;if(t<Rr)return 6;if(t<Fr)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function aa(t,e,r=0){switch(Mt(t)){case 8:e[r++]=t&255|j,t/=128;case 7:
e[r++]=t&255|j,t/=128;case 6:e[r++]=t&255|j,t/=128;case 5:e[r++]=t&255|j,t/=128;case 4:e[r++]=t&255|j,t>>>=7;case 3:e[r++]=
t&255|j,t>>>=7;case 2:e[r++]=t&255|j,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreachable")}return e}
function ca(t,e){let r=t[e],n=0;if(n+=r&oe,r<j||(r=t[e+1],n+=(r&oe)<<7,r<j)||(r=t[e+2],n+=(r&oe)<<14,r<j)||(r=t[e+3],n+=
(r&oe)<<21,r<j)||(r=t[e+4],n+=(r&oe)*Or,r<j)||(r=t[e+5],n+=(r&oe)*Pr,r<j)||(r=t[e+6],n+=(r&oe)*Rr,r<j)||(r=t[e+7],n+=(r&
oe)*Fr,r<j))return n;throw new RangeError("Could not decode varint")}const zt=new Float32Array([-0]),ae=new Uint8Array(zt.
buffer);function da(t,e,r){zt[0]=t,e[r]=ae[0],e[r+1]=ae[1],e[r+2]=ae[2],e[r+3]=ae[3]}function fa(t,e){return ae[0]=t[e],
ae[1]=t[e+1],ae[2]=t[e+2],ae[3]=t[e+3],zt[0]}const Dt=new Float64Array([-0]),L=new Uint8Array(Dt.buffer);function la(t,e,r){
Dt[0]=t,e[r]=L[0],e[r+1]=L[1],e[r+2]=L[2],e[r+3]=L[3],e[r+4]=L[4],e[r+5]=L[5],e[r+6]=L[6],e[r+7]=L[7]}function ua(t,e){return L[0]=
t[e],L[1]=t[e+1],L[2]=t[e+2],L[3]=t[e+3],L[4]=t[e+4],L[5]=t[e+5],L[6]=t[e+6],L[7]=t[e+7],Dt[0]}const ha=BigInt(Number.MAX_SAFE_INTEGER),
pa=BigInt(Number.MIN_SAFE_INTEGER);class q{constructor(e,r){f(this,"lo");f(this,"hi");this.lo=e|0,this.hi=r|0}toNumber(e=!1){
if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===
0n)return de;if(e<ha&&e>pa)return this.fromNumber(Number(e));const r=e<0n;r&&(e=-e);let n=e>>32n,i=e-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>nr&&(i=0n,++n>nr&&(n=0n))),new q(Number(i),Number(n))}static fromNumber(e){if(e===0)return de;const r=e<
0;r&&(e=-e);let n=e>>>0,i=(e-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new q(n,i)}static from(e){return typeof e=="number"?q.fromNumber(e):typeof e=="bigint"?q.fromBigInt(e):typeof e=="string"?
q.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new q(e.low>>>0,e.high>>>0):de}}const de=new q(0,0);de.toBigInt=function(){
return 0n};de.zzEncode=de.zzDecode=function(){return this};de.length=function(){return 1};const nr=4294967296n;function ba(t){
let e=0,r=0;for(let n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(n+1)&64512)===
56320?(++n,e+=4):e+=3;return e}function wa(t,e,r){if(r-e<1)return"";let i;const o=[];let s=0,a;for(;e<r;)a=t[e++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|t[e++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Gr(t,e,r){const n=r;let i,o;for(let s=0;s<t.length;++s)i=t.charCodeAt(
s),i<128?e[r++]=i:i<2048?(e[r++]=i>>6|192,e[r++]=i&63|128):(i&64512)===55296&&((o=t.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,e[r++]=i>>18|240,e[r++]=i>>12&63|128,e[r++]=i>>6&63|128,e[r++]=i&63|128):(e[r++]=i>>12|224,e[r++]=
i>>6&63|128,e[r++]=i&63|128);return r-n}function W(t,e){return RangeError(`index out of range: ${t.pos} + ${e??1} > ${t.
len}`)}function De(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class ma{constructor(e){f(this,"buf");f(this,
"pos");f(this,"len");f(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;
if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.
pos=this.len,W(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw W(this,4);return De(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw W(this,4);return De(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw W(this,4);const e=fa(
this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw W(this,4);const e=ua(this.buf,this.pos);return this.
pos+=8,e}bytes(){const e=this.uint32(),r=this.pos,n=this.pos+e;if(n>this.len)throw W(this,e);return this.pos+=e,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const e=this.bytes();return wa(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw W(this,e);this.pos+=e}else do if(this.pos>=this.len)throw W(this);while((this.buf[this.pos++]&128)!==0);
return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:
for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e}\
 at offset ${this.pos}`)}return this}readLongVarint(){const e=new q(0,0);let r=0;if(this.len-this.pos>4){for(;r<4;++r)if(e.
lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>
0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;r=0}else{for(;r<3;++r){if(this.pos>=this.
len)throw W(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.
buf[this.pos++]&127)<<r*7)>>>0,e}if(this.len-this.pos>4){for(;r<5;++r)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,
this.buf[this.pos++]<128)return e}else for(;r<5;++r){if(this.pos>=this.len)throw W(this);if(e.hi=(e.hi|(this.buf[this.pos]&
127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.
len)throw W(this,8);const e=De(this.buf,this.pos+=4),r=De(this.buf,this.pos+=4);return new q(e,r)}int64(){return this.readLongVarint().
toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){
return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=ca(this.buf,this.pos);return this.pos+=Mt(e),e}uint64String(){
return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.
readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.
readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().
toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){
return this.readFixed64().toString()}}function ga(t){return new ma(t instanceof Uint8Array?t:t.subarray())}function Nt(t,e,r){
const n=ga(t);return e.decode(n,void 0,r)}function ya(t){let n,i=8192;return function(s){if(s<1||s>4096)return We(s);i+s>
8192&&(n=We(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class Se{constructor(e,r,n){f(this,"fn");
f(this,"len");f(this,"next");f(this,"val");this.fn=e,this.len=r,this.next=void 0,this.val=n}}function ft(){}class Ea{constructor(e){
f(this,"head");f(this,"tail");f(this,"len");f(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.
states}}const va=ya();function xa(t){return globalThis.Buffer!=null?We(t):va(t)}class xt{constructor(){f(this,"len");f(this,
"head");f(this,"tail");f(this,"states");this.len=0,this.head=new Se(ft,0,0),this.tail=this.head,this.states=null}_push(e,r,n){
return this.tail=this.tail.next=new Se(e,r,n),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.tail.next=new Sa(
(e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Ne,10,q.fromNumber(e)):
this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=q.fromBigInt(e);return this._push(Ne,r.length(),
r)}uint64Number(e){return this._push(aa,Mt(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(
e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=q.fromBigInt(
e).zzEncode();return this._push(Ne,r.length(),r)}sint64Number(e){const r=q.fromNumber(e).zzEncode();return this._push(Ne,
r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(lt,1,e?1:0)}fixed32(e){return this.
_push(me,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=q.fromBigInt(e);return this._push(me,4,r.lo)._push(
me,4,r.hi)}fixed64Number(e){const r=q.fromNumber(e);return this._push(me,4,r.lo)._push(me,4,r.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(da,4,e)}double(e){return this._push(la,8,e)}bytes(e){const r=e.length>>>0;return r===
0?this._push(lt,1,0):this.uint32(r)._push(Ca,r,e)}string(e){const r=ba(e);return r!==0?this.uint32(r)._push(Gr,r,e):this.
_push(lt,1,0)}fork(){return this.states=new Ea(this),this.head=this.tail=new Se(ft,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Se(ft,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=r,this.len+=n),this}finish(){let e=this.head.next;const r=xa(this.len);
let n=0;for(;e!=null;)e.fn(e.val,r,n),n+=e.len,e=e.next;return r}}function lt(t,e,r){e[r]=t&255}function Aa(t,e,r){for(;t>
127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class Sa extends Se{constructor(r,n){super(Aa,r,n);f(this,"next");this.next=void 0}}
function Ne(t,e,r){for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&
127|128,t.lo=t.lo>>>7;e[r++]=t.lo}function me(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function Ca(t,e,r){
e.set(t,r)}globalThis.Buffer!=null&&(xt.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this.
_push(Ia,e,t),this},xt.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this.
_push(_a,e,t),this});function Ia(t,e,r){e.set(t,r)}function _a(t,e,r){t.length<40?Gr(t,e,r):e.utf8Write!=null?e.utf8Write(
t,r):e.set(na(t),r)}function Ua(){return new xt}function Ot(t,e){const r=Ua();return e.encode(t,r,{lengthDelimited:!1}),
r.finish()}var At;(function(t){t[t.VARINT=0]="VARINT",t[t.BIT64=1]="BIT64",t[t.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",t[t.
START_GROUP=3]="START_GROUP",t[t.END_GROUP=4]="END_GROUP",t[t.BIT32=5]="BIT32"})(At||(At={}));function Ta(t,e,r,n){return{
name:t,type:e,encode:r,decode:n}}function Pt(t,e){return Ta("message",At.LENGTH_DELIMITED,t,e)}class St extends Error{constructor(){
super(...arguments);f(this,"code","ERR_MAX_LENGTH");f(this,"name","MaxLengthError")}}var mr,gr;(gr=(mr=globalThis.process)==
null?void 0:mr.env)!=null&&gr.DUMP_SESSION_KEYS;var He;(function(t){let e;t.codec=()=>(e==null&&(e=Pt((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,l;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const m=r.uint32();switch(m>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new St('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((l=i.limits)==null?void 0:l.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new St('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(m&7);break}}}return o})),e),t.encode=r=>Ot(r,t.codec()),t.decode=(r,n)=>Nt(r,t.codec(),n)})(He||(He={}));var ir;
(function(t){let e;t.codec=()=>(e==null&&(e=Pt((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),He.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:vt(0),identitySig:vt(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const l=r.uint32();
switch(l>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=He.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(l&7);break}}}return o})),
e),t.encode=r=>Ot(r,t.codec()),t.decode=(r,n)=>Nt(r,t.codec(),n)})(ir||(ir={}));var or;(function(t){let e;t.codec=()=>(e==
null&&(e=Pt((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:vt(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const l=r.uint32();switch(l>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new St(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(l&7);break}}}
return o})),e),t.encode=r=>Ot(r,t.codec()),t.decode=(r,n)=>Nt(r,t.codec(),n)})(or||(or={}));new TextEncoder;new TextDecoder;function Ba(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])
return!1;return!0}function Rt(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return _e(t);if(t instanceof
ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return _e(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));
throw new Error("Unknown type, must be binary type")}function $a(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}
function _e(t){return $a(t)?t:t.slice()}function ka(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var l=s.toLowerCase().charCodeAt(0),m=s.toUpperCase().charCodeAt(0);l!==a&&(n[l]=o),m!==
a&&(n[m]=o)}}var u=t.length,x=t.charAt(0),h=Math.log(u)/Math.log(256),A=Math.log(256)/Math.log(u);function p(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,C=0,
b=0,E=c.length;b!==E&&c[b]===0;)b++,d++;for(var v=(E-b)*A+1>>>0,w=new Uint8Array(v);b!==E;){for(var y=c[b],_=0,S=v-1;(y!==
0||_<C)&&S!==-1;S--,_++)y+=256*w[S]>>>0,w[S]=y%u>>>0,y=y/u>>>0;if(y!==0)throw new Error("Non-zero carry");C=_,b++}for(var U=v-
C;U!==v&&w[U]===0;)U++;for(var T=x.repeat(d);U<v;++U)T+=t.charAt(w[U]);return T}function I(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var C=0,b=0;c[d]===x;)C++,d++;for(var E=(c.
length-d)*h+1>>>0,v=new Uint8Array(E);c[d];){var w=n[c.charCodeAt(d)];if(w===255)return;for(var y=0,_=E-1;(w!==0||y<b)&&
_!==-1;_--,y++)w+=u*v[_]>>>0,v[_]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");b=y,d++}if(c[d]!==" "){
for(var S=E-b;S!==E&&v[S]===0;)S++;for(var U=new Uint8Array(C+(E-S)),T=C;S!==E;)U[T++]=v[S++];return U}}}function g(c){var d=I(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:p,decodeUnsafe:I,decode:g}}var Ma=ka,za=Ma;let Da=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Na=class{constructor(e,r,n){
f(this,"name");f(this,"prefix");f(this,"baseDecode");f(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Lr(this,e)}},Oa=class{constructor(e){f(this,"decoders");this.
decoders=e}or(e){return Lr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Lr(t,e){return new Oa({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let Pa=class{constructor(e,r,n,i){
f(this,"name");f(this,"prefix");f(this,"baseEncode");f(this,"baseDecode");f(this,"encoder");f(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Da(e,r,n),this.decoder=new Na(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function qr({name:t,prefix:e,encode:r,decode:n}){return new Pa(
t,e,r,n)}function nt({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=za(r,t,n);return qr({prefix:e,
name:t,encode:i,decode:s=>Rt(o(s))})}function Ra(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,l=0;for(let m=0;m<i;++m){const u=e[t[m]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|u,s+=r,s>=8&&(s-=8,o[l++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Fa(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let l=0;l<t.length;++l)for(a=a<<8|t[l],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Ga(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function te({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Ga(n,i);return qr(
{prefix:e,name:t,encode(s){return Fa(s,n,r)},decode(s){return Ra(s,o,r,t)}})}const Re=te({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});te({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});te({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});te({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});te({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});te({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});te({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});te({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});te({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const ut=nt(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});nt({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const se=nt({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});nt({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var La=jr,sr=128,qa=-128,ja=Math.pow(2,31);function jr(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=ja;)e[r++]=t&255|sr,t/=128;for(;t&qa;)e[r++]=t&255|sr,t>>>=7;return e[r]=t|0,jr.bytes=r-n+1,e}var Va=Ct,
Qa=128,ar=127;function Ct(t,n){var r=0,n=n||0,i=0,o=n,s,a=t.length;do{if(o>=a)throw Ct.bytes=0,new RangeError("Could not\
 decode varint");s=t[o++],r+=i<28?(s&ar)<<i:(s&ar)*Math.pow(2,i),i+=7}while(s>=Qa);return Ct.bytes=o-n,r}var Ka=Math.pow(
2,7),Wa=Math.pow(2,14),Ha=Math.pow(2,21),Xa=Math.pow(2,28),Ja=Math.pow(2,35),Za=Math.pow(2,42),Ya=Math.pow(2,49),ec=Math.
pow(2,56),tc=Math.pow(2,63),rc=function(t){return t<Ka?1:t<Wa?2:t<Ha?3:t<Xa?4:t<Ja?5:t<Za?6:t<Ya?7:t<ec?8:t<tc?9:10},nc={
encode:La,decode:Va,encodingLength:rc},Xe=nc;function It(t,e=0){const r=Xe.decode(t,e),n=Xe.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function Je(t,e,r=0){return Xe.encode(t,e,r),e}function Ze(t){return Xe.encodingLength(t)}function ic(t,e){const r=e.
byteLength,n=Ze(t),i=n+Ze(r),o=new Uint8Array(i+r);return Je(t,o,0),Je(r,o,n),o.set(e,i),new Ft(t,r,e,o)}function oc(t){
const e=Rt(t),[r,n]=It(e),[i,o]=It(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new Ft(r,i,s,e)}function sc(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&Ba(t.bytes,r.bytes)}}class Ft{constructor(e,r,n,i){f(this,"code");f(this,"size");f(this,"digest");f(this,"by\
tes");this.code=e,this.size=r,this.digest=_e(n),this.bytes=_e(i)}}function cr(t,e){const{bytes:r,version:n}=t;switch(n){case 0:
return cc(r,_t(t),e??se.encoder);default:return dc(r,_t(t),e??Re.encoder)}}const dr=new WeakMap;function _t(t){const e=dr.
get(t);if(e==null){const r=new Map;return dr.set(t,r),r}return e}var yr;class M{constructor(e,r,n,i){f(this,"code");f(this,
"version");f(this,"multihash");f(this,"bytes");f(this,"/");f(this,yr,"CID");this.code=r,this.version=e,this.multihash=n,
this.bytes=_e(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
ge)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==fc)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return M.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=ic(e,
r);return M.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return M.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&sc(e.multihash,n.multihash)}toString(e){return cr(this,e)}toJSON(){return{"/":cr(
this)}}link(){return this}[(yr=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof M)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new M(n,i,o,s??fr(n,i,o.bytes))}else if(r[lc]===!0){const{version:n,
multihash:i,code:o}=r,s=oc(i);return M.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==ge)throw new Error(`Version 0 CID must use dag-pb (code: ${ge}) block encoding`);return new M(e,r,n,n.bytes)}case 1:{
const i=fr(e,r,n.bytes);return new M(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return M.create(
0,ge,e)}static createV1(e,r){return M.create(1,e,r)}static decode(e){const[r,n]=M.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=M.inspectBytes(e),n=r.size-r.multihashSize,i=Rt(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new Ft(r.multihashCode,r.digestSize,o,i);return[r.version===0?M.createV0(s):M.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[x,h]=It(e.subarray(r));return r+=h,x};let i=n(),o=ge;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),l=n(),m=r+l,u=m-s;return{version:i,
codec:o,multihashCode:a,digestSize:l,multihashSize:u,size:m}}static parse(e,r){const[n,i]=ac(e,r),o=M.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return _t(o).set(n,e),o}}function ac(t,e){
switch(t[0]){case"Q":{const r=e??se;return[se.prefix,r.decode(`${se.prefix}${t}`)]}case se.prefix:{const r=e??se;return[
se.prefix,r.decode(t)]}case Re.prefix:{const r=e??Re;return[Re.prefix,r.decode(t)]}case ut.prefix:{const r=e??ut;return[
ut.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function cc(t,e,r){const{prefix:n}=r;if(n!==se.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function dc(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const ge=112,fc=18;function fr(t,e,r){const n=Ze(t),i=n+Ze(e),o=new Uint8Array(i+r.byteLength);return Je(t,o,0),
Je(e,o,n),o.set(r,i),o}const lc=Symbol.for("@ipld/js-cid/CID");function uc(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return lr(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return lr(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function hc(t){
return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function lr(t){return hc(t)?t:t.slice()}function pc(t,e,r){if(t.length>=
255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){
var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var l=s.toLowerCase().
charCodeAt(0),m=s.toUpperCase().charCodeAt(0);l!==a&&(n[l]=o),m!==a&&(n[m]=o)}}var u=t.length,x=t.charAt(0),h=Math.log(u)/
Math.log(256),A=Math.log(256)/Math.log(u);function p(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(
c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(c.length===0)return"";for(var d=0,C=0,b=0,E=c.length;b!==E&&c[b]===0;)b++,d++;for(var v=(E-b)*
A+1>>>0,w=new Uint8Array(v);b!==E;){for(var y=c[b],_=0,S=v-1;(y!==0||_<C)&&S!==-1;S--,_++)y+=256*w[S]>>>0,w[S]=y%u>>>0,y=
y/u>>>0;if(y!==0)throw new Error("Non-zero carry");C=_,b++}for(var U=v-C;U!==v&&w[U]===0;)U++;for(var T=x.repeat(d);U<v;++U)
T+=t.charAt(w[U]);return T}function I(c){if(typeof c!="string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;
var d=0;if(c[d]!==" "){for(var C=0,b=0;c[d]===x;)C++,d++;for(var E=(c.length-d)*h+1>>>0,v=new Uint8Array(E);c[d];){var w=n[c.
charCodeAt(d)];if(w===255)return;for(var y=0,_=E-1;(w!==0||y<b)&&_!==-1;_--,y++)w+=u*v[_]>>>0,v[_]=w%256>>>0,w=w/256>>>0;
if(w!==0)throw new Error("Non-zero carry");b=y,d++}if(c[d]!==" "){for(var S=E-b;S!==E&&v[S]===0;)S++;for(var U=new Uint8Array(
C+(E-S)),T=C;S!==E;)U[T++]=v[S++];return U}}}function g(c){var d=I(c);if(d)return d;throw new Error(`Non-${e} character`)}
return{encode:p,decodeUnsafe:I,decode:g}}var bc=pc,wc=bc;class mc{constructor(e,r,n){f(this,"name");f(this,"prefix");f(this,
"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class gc{constructor(e,r,n){f(this,"name");f(this,"pre\
fix");f(this,"baseDecode");f(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return Vr(this,e)}}class yc{constructor(e){f(this,"decoders");this.decoders=e}or(e){return Vr(
this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to decode multi\
base string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Vr(t,e){
return new yc({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class Ec{constructor(e,r,n,i){f(this,"name");
f(this,"prefix");f(this,"baseEncode");f(this,"baseDecode");f(this,"encoder");f(this,"decoder");this.name=e,this.prefix=r,
this.baseEncode=n,this.baseDecode=i,this.encoder=new mc(e,r,n),this.decoder=new gc(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}}function Qr({name:t,prefix:e,encode:r,decode:n}){return new Ec(t,e,r,
n)}function it({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=wc(r,t,n);return Qr({prefix:e,
name:t,encode:i,decode:s=>uc(o(s))})}function vc(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,l=0;for(let m=0;m<i;++m){const u=e[t[m]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|u,s+=r,s>=8&&(s-=8,o[l++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function xc(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let l=0;l<t.length;++l)for(a=a<<8|t[l],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Ac(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function re({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Ac(n,i);return Qr(
{prefix:e,name:t,encode(s){return xc(s,n,r)},decode(s){return vc(s,o,r,t)}})}re({prefix:"b",name:"base32",alphabet:"abcd\
efghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});re({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});re({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrst\
uvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});re({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZ234567=",bitsPerChar:5,caseInsensitive:!0});re({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});re({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});re({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
re({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});
re({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});it({prefix:"k",name:"base36",alphabet:"\
0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});it({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFG\
HIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});it({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabc\
defghijkmnopqrstuvwxyz"});it({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQ\
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const Sc="peercompute.artifact.manifest.v1",Kr=256*1024,Cc=16*
1024**3,Ut=new TextEncoder;function Ic(t){const e=M.asCID(t)||M.parse(String(t));if(![85,112].includes(e.code)||e.multihash.
code!==18||e.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return e.toV1()}function Fe(t,e=0,r={remaining:Kr}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof t=="string"){if(t.length>r.remaining||
(r.remaining-=Ut.encode(t).length)<0)throw new RangeError("Manifest exceeds byte limit.");return t}if(t===null||typeof t==
"boolean"||typeof t=="number"&&Number.isFinite(t))return t;if(Array.isArray(t)){if(t.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return t.map(i=>Fe(i,e+1,r))}if(!t||typeof t!="object"||Object.getPrototypeOf(t)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(t);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(Fe(i,e+1,r),[i,Fe(t[i],e+1,r)])))}function md(t,{
maximumBytes:e=Kr,maximumFiles:r=1024,maximumFileBytes:n=Cc}={}){if(!t||t.schema!==Sc||!Array.isArray(t.files)||t.files.
length===0||t.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(t).some(l=>!i.has(l)))
throw new TypeError("Unsupported manifest field.");for(const l of["name","description"])if(t[l]!==void 0&&typeof t[l]!="\
string")throw new TypeError(`Manifest ${l} must be a string.`);if(t.model!==void 0&&(!t.model||typeof t.model!="object"||
Array.isArray(t.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=t.files.map(
l=>{if(!l||typeof l!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(l).some(x=>!["path","cid","si\
ze","sha256","mediaType"].includes(x)))throw new TypeError("Unsupported manifest file field.");const{path:m,size:u}=l;if(typeof m!=
"string"||!m||Ut.encode(m).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(m)||m.split("/").some(x=>!x||x==="."||x==="..")||
o.has(m))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(u)||u<0||u>n)throw new RangeError("Invalid file size.");if(l.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(l.sha256))
throw new TypeError("Invalid SHA-256.");if(l.mediaType!==void 0&&(typeof l.mediaType!="string"||l.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(m),{...l,cid:Ic(l.cid).toString()}}).sort((l,m)=>l.path<m.path?-1:
l.path>m.path?1:0),a=Fe({...t,files:s},0,{remaining:e});if(Ut.encode(JSON.stringify(a)).byteLength>e)throw new RangeError(
"Manifest exceeds byte limit.");return a}const _c="peercompute.gpu.resident-stage-executor.v0",Uc="peercompute.gpu.resid\
ent-stage-worker-policy.v0";function H(t,e=null){return String(t??"").trim()||e}function ht(t){return t==null?null:JSON.
parse(JSON.stringify(t))}function ur(t,e=!1){return typeof t=="boolean"?t:e}function Tc(t,e=null){const r=Math.floor(Number(
t));return Number.isFinite(r)&&r>=0?r:e}function Bc(t={},e=null){const r=t&&typeof t=="object"?t:{},n=H(r.mode??r.residencyMode,
null),i=!!(r.worker||r.workerReady||r.workerModuleUrl||r.workerType),o=n||(i?"dedicated-worker":"inline"),s=ur(r.workerReady,
!1)||!!r.worker,a=o==="dedicated-worker"||o==="webgpu-worker"||o==="gpu-compute-worker",l=a?"dedicated-worker":"inline",
m=a?s?"worker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:Uc,stageId:e,mode:l,status:m,workerType:H(
r.workerType,a?"webgpu-compute-worker":null),workerModuleUrl:H(r.workerModuleUrl??r.moduleUrl,null),startupMode:H(r.startupMode,
a?"warm-on-first-use":"inline"),idleTtlMs:Tc(r.idleTtlMs,a?6e4:null),sameDeviceRequired:ur(r.sameDeviceRequired,a),bufferTransferPolicy:H(
r.bufferTransferPolicy,a?"worker-owns-device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:m===
"blocked-worker-backend-missing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-w\
orker-policy"}}async function $c(t,e){if(typeof t=="function")return t(e);if(t&&typeof t.runStage=="function")return t.runStage(
e);throw new Error("[GPUHubManager] Resident stage worker backend must be a function or expose runStage()")}class kc{constructor(e={}){
this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=
new Map,this.residentStageExecutorAliases=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;
if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.
gpu.requestAdapter(e.adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.
device=await r.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,r){
this.hotStore.set(e,r)}registerHotBufferSet(e,r){this.hotStore.set(e,r)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){
return this.hotStore.get(e)}createHotBuffer(e,r,n,i){if(!this.device)throw new Error("[GPUHubManager] Device not initial\
ized");const o=this.device.createBuffer({size:r,usage:n,label:i});return this.hotStore.set(e,o),o}removeHotBuffer(e){this.
hotStore.delete(e)}registerResidentStageExecutor(e,r=null){var l;const n=typeof e=="string"?{stageId:e,executor:r}:{...e||
{}},i=H(n.stageId??n.id,null);if(!i)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const o=n.
executor||r,s=n.workerRunner||n.workerBackend||((l=n.workerPolicy)==null?void 0:l.workerRunner)||null;if(typeof o!="func\
tion"&&!s)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${i}`);const a={schema:_c,stageId:i,
lawNodeId:H(n.lawNodeId,null),runtimeTarget:H(n.runtimeTarget,s?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-ex\
ecutor"),executor:typeof o=="function"?o:null,workerRunner:s,workerPolicy:Bc({...n.workerPolicy||n.workerResidency||{},workerReady:(n.
workerPolicy||n.workerResidency||{}).workerReady||!!s},i),metadata:ht(n.metadata||{}),registeredAt:Date.now()};return this.
residentStageExecutors.set(i,a),a.lawNodeId&&this.residentStageExecutorAliases.set(a.lawNodeId,i),this.describeResidentStageExecutor(
i)}describeResidentStageExecutor(e){const r=this.getResidentStageExecutorRecord(e);return r?{schema:r.schema,stageId:r.stageId,
lawNodeId:r.lawNodeId,runtimeTarget:r.runtimeTarget,workerPolicy:ht(r.workerPolicy),metadata:ht(r.metadata||{}),registeredAt:r.
registeredAt}:null}getResidentStageExecutorRecord(e){const r=H(typeof e=="string"?e:(e==null?void 0:e.id)??(e==null?void 0:
e.stageId),null),n=H(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);if(r&&this.residentStageExecutors.has(r))return this.
residentStageExecutors.get(r);const i=n?this.residentStageExecutorAliases.get(n):null;return i?this.residentStageExecutors.
get(i):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(e)}listResidentStageExecutors(){return[
...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(e))}async executeResidentStage(e={}){
var i,o;const r=this.getResidentStageExecutorRecord(e.stage);if(!r){const s=H(((i=e.stage)==null?void 0:i.id)??((o=e.stage)==
null?void 0:o.stageId),"unknown"),a=new Error(`[GPUHubManager] Missing resident stage executor: ${s}`);throw a.code="ERR\
_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",a.stage=e.stage||null,a}const n={...e,gpuHub:this,device:this.device,executor:this.
describeResidentStageExecutor(r.stageId)};return r.workerRunner?$c(r.workerRunner,n):r.executor(n)}registerTask(e,r){this.
tasks.set(e,r)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const ye="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-\
abl-GGUF",Ee="5ce3fd841676adf2c1a10d7193637d46007e88f7",hr=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd44\
1111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"N\
OTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_X\
S.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,
gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5\
593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913\
dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.js\
on",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"\
5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9a\
e04fff09706ef"}],Mc="This catalog supports verified storage and distribution. Execution is admitted separately by the ma\
naged llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function Wr(t){for(const e of Object.
values(t))e&&typeof e=="object"&&Wr(e);return Object.freeze(t)}const zc=Wr({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.\
8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:ye,revision:Ee,status:"storage-only",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Mc},
license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${ye}/blob/${Ee}/LICENSE`,notice:"Preserve upstream LICENSE\
, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:ye,revision:Ee,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${ye}/blob/${Ee}/README.md`,sourceManifestPath:"artifact-manifest.json"},
model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:[
"IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:ye,revision:Ee},weightBytes:14199740480,totalBytes:hr.reduce((t,e)=>t+
e.size,0),files:hr}});function Hr(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(Hr),Object.
freeze(t)),t}const Dc=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental \
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
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],Nc=Hr(Object.fromEntries(
Dc.map(t=>{const{dtype:e,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=t,a=o.files.find(l=>l.path==="LICENSE").source;
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
qwen3_5",format:"GGUF",task:"text-generation",dtype:e,modalities:["text"],requiredFeatures:["shader-f16"],repository:o.repository,
revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.files.reduce((l,m)=>l+m.size,0)}]}))),ve="bartowski/Qwen_Q\
wen3.5-0.8B-GGUF",xe="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",pt=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,
sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499\
cb320f9f2f3963beee9d8b890046f825c6f5d"}],Tt=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function Xr(t){
return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(Xr),Object.freeze(t)),t}const Oc=Object.fromEntries(
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
LICENSE"}}]}].map(({architecture:t,...e})=>[e.id,Xr({...e,status:"execution-candidate",format:"GGUF",capabilities:Tt,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:e.
repository,revision:e.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}\
/blob/${e.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:e.repository,revision:e.revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((r,n)=>r+n.size,
0)})])),gd=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:ve,revision:xe,status:"execution-candidate",format:"GGUF",capabilities:Tt,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${ve}/blob/${xe}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:ve,revision:xe,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${ve}/blob/${xe}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:ve,revision:xe},weightBytes:pt[0].size,totalBytes:pt.
reduce((t,e)=>t+e.size,0),files:pt},...Oc,...Nc,...Object.fromEntries(Object.entries(zc).map(([t,e])=>[t,{...e,status:"e\
xecution-candidate",capabilities:Tt}]))}),Pc="transformers.js",Jr="4.3.2",k=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,
maxModelBytes:1536*1024*1024,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,
maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),Rc=Object.freeze({maxModelBytes:2*
1024**3,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),Fc=Object.freeze({maxModelBytes:k.
maxModelBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:k.maxImagePixels}),bt=new Set(["qwen3","qwen2",
"llama"]);function Zr(t){return(t==null?void 0:t.architecture)==="qwen3_5"?Rc:Fc}function Bt(t="Operation cancelled"){return(t==
null?void 0:t.name)==="AbortError"?t:new DOMException(typeof t=="string"?t:"Operation cancelled","AbortError")}function G(t){
if(t!=null&&t.aborted)throw Bt(t.reason)}function Oe(t){if(typeof t!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(t))throw new Error(
"Invalid model session ID");return t}function Ye(t){if(typeof t!="string"||!t||new TextEncoder().encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.
test(t)||t.startsWith("/")||t.split("/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return t}
function Gc(t){let e;try{e=JSON.stringify(t)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(
e).length>k.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(e);if(r.schema!==
"peercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>k.maxFiles)throw new Error(
"Invalid model manifest files");const n=new Set,i=Zr(r.model);let o=0;for(const u of r.files){if(Ye(u.path),n.has(u.path))
throw new Error("Duplicate model artifact path");n.add(u.path);const x=M.parse(u.cid);if(![85,112].includes(x.code)||x.multihash.
code!==18||x.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<
0||!/^[a-f0-9]{64}$/i.test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),
o+=u.size,!Number.isSafeInteger(o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const s=r.
model;if((s==null?void 0:s.runtime)!==Pc||s.runtimeVersion!==Jr||![...bt,"idefics3","smolvlm","qwen3_5"].includes(s.architecture))
throw new Error("Model runtime, architecture or dtype is not approved");if(s.task??(s.task=bt.has(s.architecture)?"text-\
generation":"image-text-to-text"),!["text-generation","image-text-to-text"].includes(s.task)||bt.has(s.architecture)!==(s.
task==="text-generation"))throw new Error("Model task does not match its admitted architecture");const a=typeof s.dtype==
"string"?[["model",s.dtype]]:s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(s.dtype):[];if(!a.
length||a.length>16||a.some(([u,x])=>!/^[A-Za-z0-9_-]{1,100}$/.test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(x)))
throw new Error("Invalid model dtype configuration");if(s.architecture==="qwen3_5"&&a.some(([,u])=>u!=="q4"))throw new Error(
"Qwen3.5 admits q4 language and vision modules");const l=u=>u==="fp32"?"":u==="q8"?"_quantized":`_${u}`,m=["config.json",
"tokenizer.json","tokenizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&m.push(...a.map(([u,
x])=>`onnx/${u}${l(x)}.onnx`)),s.task==="image-text-to-text")for(const u of["embed_tokens","vision_encoder","decoder_mod\
el_merged"]){const x=typeof s.dtype=="string"?s.dtype:s.dtype[u];if(!x)throw new Error("Multimodal dtype configuration i\
s missing a module");m.push(`onnx/${u}${l(x)}.onnx`),s.architecture==="qwen3_5"&&m.push(`onnx/${u}${l(x)}.onnx_data`)}if(m.
some(u=>!n.has(u)))throw new Error("Incomplete model package");if(s.task==="image-text-to-text"&&!n.has("preprocessor_co\
nfig.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor configuration is missing");if(s.requiredFeatures!==
void 0&&(!Array.isArray(s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.some(u=>typeof u!="string"||
u.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}function Lc(t,e){
const r=new URL(e),n={};for(const i of["mjs","wasm"]){if(typeof(t==null?void 0:t[i])!="string")throw new Error("Trusted \
ORT runtime assets are required");const o=new URL(t[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||!["htt\
p:","https:"].includes(o.protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved same-orig\
in runtime files");n[i]=o.href}return n}const qc="peercompute.model-artifact-read.v1",Gt=qc;function Yr(t,e){var n;const r=i=>e(
i.data);return t.addEventListener("message",r),(n=t.start)==null||n.call(t),()=>t.removeEventListener("message",r)}function Q(t,e,r=[]){
t.postMessage({protocol:Gt,...e},r)}function yd(t,{store:e,manifest:r,chunkBytes:n=k.chunkBytes,maxReads:i=k.maxReads}={}){
if(!(e!=null&&e.stat)||!(e!=null&&e.openRead))throw new Error("A verified artifact store is required");if(!Number.isInteger(
n)||n<1||n>k.chunkBytes||!Number.isInteger(i)||i<1||i>k.maxReads)throw new Error("Invalid artifact bridge bounds");const o=new Map(
r.files.map(h=>[Ye(h.path),h])),s=new Map;let a=!1,l=0;async function m(h,A){var I,g;const p=s.get(h);if(p){s.delete(h),
p.controller.abort(A);try{await((g=(I=p.iterator)==null?void 0:I.return)==null?void 0:g.call(I))}catch{}}}async function u(h){
var p,I;if(a||(h==null?void 0:h.protocol)!==Gt||typeof h.id!="string"||h.id.length>128)return;const{id:A}=h;try{if(h.type===
"cancel"){await m(A,"Reader cancelled");return}if(h.type==="open"){if(s.has(A))throw new Error("Duplicate artifact reade\
r");if(s.size>=i)throw new Error("Artifact reader limit reached");const b=o.get(h.path);if(!b)throw new Error("Artifact \
path is not in the manifest");const E=h.offset??0,v=h.length??b.size-E;if(!Number.isSafeInteger(E)||!Number.isSafeInteger(
v)||E<0||v<0||E>b.size||v>b.size-E)throw new Error("Invalid artifact byte range");const w={controller:new AbortController,
remaining:v,pulling:!1};s.set(A,w);const y=await e.stat(b.cid);if(G(w.controller.signal),a||s.get(A)!==w)return;if(!y||y.
status!=="complete"||y.size!==b.size||y.sha256!==b.sha256)throw new Error("Model artifact is incomplete or has a differe\
nt size");const _=await e.openRead(b.cid,{offset:E,length:v,signal:w.controller.signal});if(w.iterator=_[Symbol.asyncIterator](),
a||w.controller.signal.aborted||s.get(A)!==w){await((I=(p=w.iterator).return)==null?void 0:I.call(p));return}Q(t,{type:"\
ready",id:A,size:v});return}if(h.type!=="pull")return;const g=s.get(A);if(!(g!=null&&g.iterator)||g.pulling)throw new Error(
"Invalid artifact pull credit");g.pulling=!0;const c=await g.iterator.next();if(a||g.controller.signal.aborted||s.get(A)!==
g)return;if(c.done){if(g.remaining!==0)throw new Error("Truncated model artifact");s.delete(A),Q(t,{type:"end",id:A});return}
const d=c.value;if(!(d instanceof Uint8Array)||!d.byteLength||d.byteLength>n||d.byteLength>g.remaining)throw new Error("\
Artifact chunk exceeds admitted bounds");g.remaining-=d.byteLength,g.pulling=!1,l+=d.byteLength;const C=d.slice();Q(t,{type:"\
chunk",id:A,bytes:C},[C.buffer])}catch(g){await m(A,g),a||Q(t,{type:"error",id:A,message:(g==null?void 0:g.message)||"Ar\
tifact read failed"})}}const x=Yr(t,h=>{u(h)});return{getStats:()=>({activeReads:s.size,deliveredBytes:l}),async close(){
if(!a){a=!0;try{Q(t,{type:"closed",message:"Artifact bridge closed"})}catch{}x(),await Promise.all([...s.keys()].map(h=>m(
h,"Artifact bridge closed"))),t.close()}}}}function jc(t,{manifest:e,baseUrl:r,signal:n,chunkBytes:i=k.chunkBytes,maxReads:o=k.
maxReads,maxQueuedReads:s=32}={}){if(!Number.isInteger(o)||o<1||o>k.maxReads||!Number.isInteger(s)||s<0||s>32)throw new RangeError(
"Invalid artifact reader limits");const a=new URL(r),l=new Map(e.files.map(c=>[Ye(c.path),c])),m=new Map,u=[];let x=0,h=!1;
function A(){for(;!h&&m.size<o&&u.length;){const c=u.shift();m.set(c.id,c),c.active=!0,Q(t,{type:"open",id:c.id,path:c.path})}}
function p(c,d){var b,E,v,w;m.delete(c.id);const C=u.indexOf(c);if(C>=0&&u.splice(C,1),n==null||n.removeEventListener("a\
bort",c.abort),(b=c.requestSignal)==null||b.removeEventListener("abort",c.abort),d){(E=c.reject)==null||E.call(c,d);try{
(v=c.streamController)==null||v.error(d)}catch{}}(w=c.resolvePull)==null||w.call(c),A()}const I=Yr(t,c=>{if((c==null?void 0:
c.protocol)!==Gt)return;const d=m.get(c.id);if(d){if(c.type==="error"){p(d,new Error(c.message));return}if(c.type==="rea\
dy"){if(d.ready||c.size!==d.file.size){p(d,new Error("Invalid artifact response size")),Q(t,{type:"cancel",id:d.id});return}
d.ready=!0,Q(t,{type:"pull",id:d.id})}else if(c.type==="chunk"){if(!d.ready||!d.resolvePull||!(c.bytes instanceof Uint8Array)||
!c.bytes.byteLength||c.bytes.byteLength>i||d.received+c.bytes.byteLength>d.file.size){Q(t,{type:"cancel",id:d.id}),p(d,new Error(
"Invalid artifact chunk"));return}d.received+=c.bytes.byteLength,d.streamController.enqueue(c.bytes);const C=d.resolvePull;
d.resolvePull=null,C()}else c.type==="end"&&(!d.ready||d.received!==d.file.size?p(d,new Error("Truncated artifact respon\
se")):(d.streamController.close(),p(d)))}});async function g(c,d={}){if(h)throw new Error("Artifact bridge is closed");if(G(
n),G(d.signal),d.method&&d.method!=="GET")throw new Error("Model adapter supports GET only");const C=String(c);if(/[\\]/.
test(C)||/%(?:2e|2f|5c|00)/i.test(C)||/\/(?:\.|\.\.)(?:\/|$)/.test(C))throw new Error("Invalid artifact URL");const b=new URL(
C,a);if(b.origin!==a.origin||b.username||b.password||b.search||b.hash||!b.pathname.startsWith(a.pathname))throw new Error(
"Model path is outside its manifest");const E=Ye(decodeURIComponent(b.pathname.slice(a.pathname.length))),v=l.get(E);if(!v)
return new Response("Artifact path is not in the manifest",{status:404});const w=`read-${++x}`,y={id:w,path:E,file:v,requestSignal:d.
signal,received:0,ready:!1,active:!1,queued:!1};y.abort=()=>{var S;y.active&&Q(t,{type:"cancel",id:w}),p(y,Bt((n==null?void 0:
n.reason)??((S=d.signal)==null?void 0:S.reason)))};const _=new ReadableStream({start(S){y.streamController=S},pull(){if(h)
throw new Error("Artifact bridge is closed");if(G(n),G(d.signal),!y.active&&!y.queued&&m.size>=o&&u.length>=s)throw new Error(
"Artifact reader limit reached");return new Promise(S=>{var U;y.resolvePull=S,y.ready?Q(t,{type:"pull",id:w}):y.queued||
(y.queued=!0,n==null||n.addEventListener("abort",y.abort,{once:!0}),(U=d.signal)==null||U.addEventListener("abort",y.abort,
{once:!0}),u.push(y),A())})},cancel(){y.active&&Q(t,{type:"cancel",id:w}),p(y)}},{highWaterMark:0});return new Response(
_,{headers:{"Content-Length":String(v.size),"Content-Type":v.mediaType||"application/octet-stream"}})}return{fetch:g,close(c="\
Artifact bridge closed"){if(!h){h=!0;for(const d of[...m.values(),...u])d.active&&Q(t,{type:"cancel",id:d.id}),p(d,Bt(c));
I(),t.close()}}}}const Ge=t=>new TextEncoder().encode(t).byteLength;function Vc(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function en(t){if(t==null)return null;
if(!Number.isSafeInteger(t.width)||!Number.isSafeInteger(t.height)||t.width<1||t.height<1||t.width*t.height>k.maxImagePixels||
t.channels!==4||!(t.data instanceof Uint8Array||t.data instanceof Uint8ClampedArray)||t.data.byteLength!==t.width*t.height*
4||t.data.byteLength>k.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fil\
es are not accepted");return t}function tn(t){const e=t.messages??(typeof t.prompt=="string"?[{role:"user",content:t.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>k.maxMessages)throw new Error("Invalid inference messages");let r=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=Ge(n.content),r>k.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function $t(t){var n;if(!t)return;let e;const r=new Set;for(const i of[t.model,t.
processor,t.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.dispose)==null?void 0:n.call(i))}catch(o){e??(e=o)}}if(e)
throw e}function Le(t,e=new Set){if(!(!t||typeof t!="object"||e.has(t))){if(e.add(t),typeof t.dispose=="function"){t.dispose();
return}for(const r of Object.values(t))Le(r,e)}}function Qc(t){const e=t.findIndex(n=>n.role==="user");if(e<0)return null;
const r=t.findIndex((n,i)=>i>e&&n.role==="user");return r<0?null:t.filter((n,i)=>i<e||i>=r||n.role==="system")}function Kc(t,e,r){
const n={...t.config};for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,t.generation_config);
const i=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],o=e.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(
a)&&a>=0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===BigInt(o))?"stop":e.length>=r?"length":"unknown"}async function Wc({library:t,
modelPath:e,options:r,manifest:n}){const i={};try{const o=await t.AutoConfig.from_pretrained(e,r);if(o.model_type!==n.model.
architecture)throw new Error("Model config architecture does not match its admitted manifest");const s={...r,config:o};if(n.
model.architecture==="qwen3_5"&&(s.use_external_data_format=1),n.model.task==="image-text-to-text"){if(i.processor=await t.
AutoProcessor.from_pretrained(e,r),n.model.architecture==="qwen3_5"){const a=i.processor.image_processor;if(!a)throw new Error(
"Qwen3.5 image processor is unavailable");a.min_pixels=256*256,a.max_pixels=Zr(n.model).maxProcessedImagePixels,a.do_normalize??
(a.do_normalize=!0)}i.tokenizer=i.processor.tokenizer,i.model=await t.AutoModelForImageTextToText.from_pretrained(e,s)}else
i.tokenizer=await t.AutoTokenizer.from_pretrained(e,r),i.model=await t.AutoModelForCausalLM.from_pretrained(e,s);return i}catch(o){
throw await $t(i),o}}function pr(t){return{sessionId:t.sessionId,manifestCid:t.manifestCid,status:t.lost?"lost":t.status,
task:t.manifest.model.task,dtype:t.manifest.model.dtype,workerId:t.workerId,adapter:t.adapter,runtimeAdapter:t.runtimeAdapter??
null,gpuDispatches:t.gpuDispatches??0,gpuSubmissions:t.gpuSubmissions??0,gpuProfileSamples:t.gpuProfileSamples??0,collectGpuEvidence:t.
collectGpuEvidence===!0,runtimeFeatures:t.runtimeFeatures??[],generatedRequests:t.generatedRequests}}function rn({loadLibrary:t=()=>dn(
()=>import("./transformers.web-Dn8CClj3.js"),[],import.meta.url),loadModel:e=Wc,gpu:r=(o=>(o=globalThis.navigator)==
null?void 0:o.gpu)(),baseUrl:n=(s=>(s=globalThis.location)==null?void 0:s.href)(),assertWorker:i=Vc}={}){const a=new Map;
let l;async function m(x,h){var d,C,b,E,v,w,y,_;if(a.size)throw new Error("This inference worker already has a resident/\
loading model");const A=Oe(x.sessionId),{manifest:p}=Gc(x.manifest),I=Lc(x.runtimeAssets,n);if(!((d=x.artifactPort)!=null&&
d.postMessage))throw new Error("An artifact reader port is required");G(h.signal);const g={sessionId:A,manifest:p,manifestCid:x.
manifestCid,status:"loading",workerId:h.workerId??null,generatedRequests:0,components:null};a.set(A,g);let c;try{const S=await(r==
null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(G(h.signal),!S||(C=S.info)!=null&&C.isFallbackAdapter||
S.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fallback is disabled");const U=typeof p.
model.dtype=="string"?[p.model.dtype]:Object.values(p.model.dtype),T=new Set(p.model.requiredFeatures??[]);U.some($=>["f\
p16","q4f16"].includes($))&&T.add("shader-f16");for(const $ of T)if(!S.features.has($))throw new Error(`Model requires u\
nsupported GPU feature: ${$}`);g.adapter={vendor:((b=S.info)==null?void 0:b.vendor)??"",architecture:((E=S.info)==null?void 0:
E.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...T]};const ce=await(l??(l=t()));if(G(h.signal),ce.env.version!==
Jr)throw new Error("Unexpected Transformers runtime version");const be=new URL("/__peercompute_models/",n);c=jc(x.artifactPort,
{manifest:p,baseUrl:new URL(`${A}/`,be).href,signal:h.signal});const{env:z}=ce;z.logLevel=50,z.allowLocalModels=!0,z.allowRemoteModels=
!1,z.localModelPath=be.pathname,z.useBrowserCache=!1,z.useFSCache=!1,z.useWasmCache=!1,z.fetch=async(...$)=>{var X;try{return await c.
fetch(...$)}catch(D){throw(X=h.emitProgress)==null||X.call(h,{type:"artifact-read-error",sessionId:A,message:D.message}),
D}},z.backends.onnx.wasm.proxy=!1,z.backends.onnx.wasm.numThreads=1,z.backends.onnx.wasm.wasmPaths=I,g.gpuDispatches=0,g.
gpuProfileSamples=0,g.gpuSubmissions=0,g.collectGpuEvidence=x.collectGpuEvidence===!0,z.backends.onnx.webgpu&&(z.backends.
onnx.webgpu.profiling={mode:x.collectGpuEvidence===!0?"default":"off",ondata:()=>{g.gpuProfileSamples+=1}});const $e={local_files_only:!0,
device:"webgpu",dtype:p.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:$=>{var X,D;(X=h.signal)!=
null&&X.aborted||(D=h.emitProgress)==null||D.call(h,{type:"model-load",sessionId:A,status:String($.status??"").slice(0,40),
file:typeof $.file=="string"?$.file.slice(0,512):void 0,loaded:Number.isFinite($.loaded)?$.loaded:void 0,total:Number.isFinite(
$.total)?$.total:void 0})}};g.library=ce,g.components=await e({library:ce,modelPath:A,options:$e,manifest:p}),G(h.signal);
const B=await((v=z.backends.onnx.webgpu)==null?void 0:v.device);if(g.runtimeDevice=B,g.runtimeFeatures=[...(B==null?void 0:
B.features)??[]],g.collectGpuEvidence&&B){const $=B.createCommandEncoder.bind(B),X=B.queue.submit.bind(B.queue),D=Object.
getOwnPropertyDescriptor(B,"createCommandEncoder"),ke=Object.getOwnPropertyDescriptor(B.queue,"submit");g.restoreGpuEvidence=
()=>{D?Object.defineProperty(B,"createCommandEncoder",D):delete B.createCommandEncoder,ke?Object.defineProperty(B.queue,
"submit",ke):delete B.queue.submit,g.restoreGpuEvidence=null},B.createCommandEncoder=(...ne)=>{const J=$(...ne),Me=J.beginComputePass.
bind(J);return J.beginComputePass=(...ie)=>{const K=Me(...ie);for(const Z of["dispatchWorkgroups","dispatchWorkgroupsInd\
irect"]){const ot=K[Z].bind(K);K[Z]=(...Y)=>{const st=ot(...Y);return g.gpuDispatches+=1,st}}return K},J},B.queue.submit=
(...ne)=>{const J=X(...ne);return g.gpuSubmissions+=1,J}}const R=(B==null?void 0:B.adapterInfo)??((y=(w=z.backends.onnx.
webgpu)==null?void 0:w.adapter)==null?void 0:y.info);if(R){if(R.isFallbackAdapter)throw new Error("ORT selected a softwa\
re GPU adapter");g.runtimeAdapter={vendor:R.vendor,architecture:R.architecture,isFallbackAdapter:R.isFallbackAdapter??!1}}
return B!=null&&B.lost&&B.lost.then(()=>{var $;a.get(A)===g&&(g.lost=!0,($=g.active)==null||$.abort("GPU device lost"))}),
G(h.signal),g.status="ready",pr(g)}catch(S){try{await $t(g.components),(_=g.restoreGpuEvidence)==null||_.call(g),a.delete(
A)}catch(U){g.status="ready",g.lost=!0;const T=new Error(`MODEL_DISPOSE_FAILED: ${U.message}`);throw T.code="MODEL_DISPO\
SE_FAILED",T}throw S}finally{c==null||c.close(),c||x.artifactPort.close()}}async function u(x,h){var ce,be,z,$e,B;const A=a.
get(Oe(x.sessionId));if(!A||A.lost)throw new Error("Model session lost or not loaded");if(A.status!=="ready")throw new Error(
"Model session is busy");const p=Oe(x.requestId),I=x.maxNewTokens??k.maxNewTokens;if(!Number.isInteger(I)||I<1||I>k.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let g=tn(x);const c=en(x.image);if(c&&A.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");G(h.signal);const d=new AbortController,C=new A.
library.InterruptableStoppingCriteria,b=()=>{var R;d.abort((R=h.signal)==null?void 0:R.reason),C.interrupt()};(ce=h.signal)==
null||ce.addEventListener("abort",b,{once:!0}),d.signal.addEventListener("abort",()=>C.interrupt(),{once:!0}),A.active=d,
A.requestId=p,A.status="generating";let E,v,w=0,y=0,_,S=!1;const U=A.gpuDispatches??0,T=A.gpuSubmissions??0;try{G(h.signal);
const{tokenizer:R,processor:$,model:X}=A.components;let D;for(;;){G(d.signal);let ie=g;if($&&(ie=g.map(Y=>({role:Y.role,
content:[{type:"text",text:Y.content}]})),c)){const Y=ie.findLast(st=>st.role==="user");if(!Y)throw new Error("An image \
requires a user message");Y.content.unshift({type:"image"})}const K=($??R).apply_chat_template(ie,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof K!="string"||Ge(K)>k.maxPromptBytes)throw new Error("Templated prompt exceeds its byte bu\
dget");if(c){const Y=new A.library.RawImage(c.data,c.width,c.height,c.channels);E=await $(K,Y,{do_image_splitting:!1})}else
E=await R(K,{truncation:!1,padding:!1});if(G(d.signal),D=(z=(be=E.input_ids)==null?void 0:be.dims)==null?void 0:z.at(-1),
!Number.isSafeInteger(D)||D<1)throw new Error("Invalid model input token count");if(D+I<=k.maxContextTokens)break;const Z=Qc(
g);if(!Z)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or r\
equest fewer output tokens");const ot=E;E=void 0,Le(ot),g=Z,S=!0}G(d.signal);const ke=new A.library.TextStreamer(R,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:ie=>{var K;if(!(d.signal.aborted||_)){if(y+=Ge(ie),y>k.maxOutputBytes){_=new Error(
"Generated text exceeded its byte budget"),d.abort(_);return}try{if(((K=h.emitProgress)==null?void 0:K.call(h,{type:"tok\
en",sessionId:A.sessionId,requestId:p,sequence:w++,text:ie}))===!1)throw new Error("Token consumer rejected output")}catch(Z){
_=Z,d.abort(Z)}}}});if(v=await X.generate({...E,max_new_tokens:I,do_sample:!1,streamer:ke,stopping_criteria:[C]}),await(($e=
A.runtimeDevice)==null?void 0:$e.queue.onSubmittedWorkDone()),_)throw _;if(A.lost)throw new Error("GPU device lost; mode\
l session is unavailable");G(d.signal);const ne=v.tolist();if(ne.length!==1||ne[0].length<D||ne[0].length>D+I)throw new Error(
"Model returned an over-budget token sequence");const J=ne[0].slice(D),Me=R.decode(J,{skip_special_tokens:!0});if(Ge(Me)>
k.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");return A.generatedRequests+=1,{sessionId:A.sessionId,
requestId:p,text:Me,inputTokens:D,outputTokens:J.length,finishReason:Kc(X,J,I),contextTruncated:S,workerId:A.workerId,gpuDispatches:(A.
gpuDispatches??0)-U,gpuSubmissions:(A.gpuSubmissions??0)-T,gpuProfileSamples:A.gpuProfileSamples??0}}finally{(B=h.signal)==
null||B.removeEventListener("abort",b);try{const R=new Set;Le(E,R),Le(v,R)}finally{A.active=null,A.requestId=null,A.status=
"ready"}}}return async function(h={},A={}){var I,g;if(i(),h.command==="load")return m(h,A);if(h.command==="generate")return u(
h,A);const p=a.get(Oe(h.sessionId));if(h.command==="status")return p?pr(p):{sessionId:h.sessionId,status:"absent"};if(h.
command==="cancel")return(p==null?void 0:p.requestId)===h.requestId&&((I=p.active)==null||I.abort("Generation cancelled")),
{sessionId:h.sessionId,cancellationRequested:!0};if(h.command==="unload"){if(!p)return{sessionId:h.sessionId,status:"abs\
ent"};if(p.status!=="ready")throw new Error("Cancel and await active model work before unloading");p.status="unloading";
try{await $t(p.components),(g=p.restoreGpuEvidence)==null||g.call(p)}catch(c){p.status="ready",p.lost=!0;const d=new Error(
`MODEL_DISPOSE_FAILED: ${c.message}`);throw d.code="MODEL_DISPOSE_FAILED",d}return a.delete(h.sessionId),{sessionId:h.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const Hc=rn(),Xc=(t,e)=>Hc(t,e),Ed=Object.freeze(Object.
defineProperty({__proto__:null,createModelTaskRuntime:rn,handleModelTask:Xc,normalizeModelMessages:tn,validateImageInput:en},
Symbol.toStringTag,{value:"Module"})),Jc=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...Jc,"co\
mpute_probabilities"]);let le=null,br=null;async function vd(){if(le)return le;try{return br=new kc({frameBudgetMs:6}),le=
await br.initialize(),le}catch(t){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",t);
const{device:e}=await sn();return le=e,le}}export{qc as A,M as C,gd as G,k as M,dn as _,Gc as a,Oe as b,en as c,Bt as d,md as e,Ye as f,vd as g,Ed as m,tn as n,yd as s,
G as t,Lc as v};
