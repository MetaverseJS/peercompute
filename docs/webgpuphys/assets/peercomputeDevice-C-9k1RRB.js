var En=Object.defineProperty;var vn=(t,e,r)=>e in t?En(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var l=(t,e,r)=>vn(t,typeof e!="symbol"?e+"":e,r);import{i as xn}from"./device-B4S7QtIr.js";const Sn="modulepreload",An=function(t,e){return new URL(t,e).href},Vt={},_n=function(e,r,n){let i=Promise.resolve();if(r&&
r.length>0){let s=function(w){return Promise.all(w.map(p=>Promise.resolve(p).then(u=>({status:"fulfilled",value:u}),u=>({
status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),f=document.querySelector("meta[property=c\
sp-nonce]"),h=(f==null?void 0:f.nonce)||(f==null?void 0:f.getAttribute("nonce"));i=s(r.map(w=>{if(w=An(w,n),w in Vt)return;
Vt[w]=!0;const p=w.endsWith(".css"),u=p?'[rel="stylesheet"]':"";if(!!n)for(let C=a.length-1;C>=0;C--){const y=a[C];if(y.
href===w&&(!p||y.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${w}"]${u}`))return;const b=document.
createElement("link");if(b.rel=p?"stylesheet":Sn,p||(b.as="script"),b.crossOrigin="",b.href=w,h&&b.setAttribute("nonce",
h),document.head.appendChild(b),p)return new Promise((C,y)=>{b.addEventListener("load",C),b.addEventListener("error",()=>y(
new Error(`Unable to preload CSS for ${w}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});
if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="re\
jected"&&o(a.reason);return e().catch(o)})};class Cn{constructor(){l(this,"index",0);l(this,"input","")}new(e){return this.
index=0,this.input=e,this}readAtomically(e){const r=this.index,n=e();return n===void 0&&(this.index=r),n}parseWith(e){const r=e();
if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){
if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const r=this.
readChar();if(r===e)return r})}readSeparator(e,r,n){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(e)===void 0))
return n()})}readNumber(e,r,n,i){return this.readAtomically(()=>{let o=0,s=0;const a=this.peekChar();if(a===void 0)return;
const f=a==="0",h=2**(8*i)-1;for(;;){const w=this.readAtomically(()=>{const p=this.readChar();if(p===void 0)return;const u=Number.
parseInt(p,e);if(!Number.isNaN(u))return u});if(w===void 0)break;if(o*=e,o+=w,o>h||(s+=1,r!==void 0&&s>r))return}if(s!==
0)return!n&&f&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let r=0;r<e.length;r++){
const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;e[r]=n}return e})}readIPv6Addr(){const e=r=>{
for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.readSeparator(":",n,()=>this.readIPv4Addr());if(s!==
void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}const o=this.readSeparator(":",n,()=>this.readNumber(
16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(
16),[n,i]=e(r);if(n===16)return r;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(
14),s=16-(n+2),[a]=e(o.subarray(0,s));return r.set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.
readIPv6Addr()}}const In=45,Bn=15,Qe=new Cn;function Un(t){if(!(t.length>Bn))return Qe.new(t).parseWith(()=>Qe.readIPv4Addr())}
function Mn(t){if(t.includes("%")&&(t=t.split("%")[0]),!(t.length>In))return Qe.new(t).parseWith(()=>Qe.readIPv6Addr())}
function Br(t){return!!Un(t)}function zn(t){return!!Mn(t)}function Ur(t=0){return new Uint8Array(t)}function Tn(t){return(t==
null?void 0:t.buffer)instanceof ArrayBuffer}function kn(t){if(Tn(t))return t;const e=t.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function Mr(t,e){e==null&&(e=t.reduce((i,o)=>i+o.length,0));const r=Ur(e);let n=0;for(const i of t)r.set(
i,n),n+=i.length;return kn(r)}function $n(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.
byteLength;r++)if(t[r]!==e[r])return!1;return!0}function Me(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Ar\
ray")return ze(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return ze(new Uint8Array(
t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function On(t){const e=new Uint8Array(
t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const Kt=4096;function Dn(t){const e=t.length;if(e<=Kt)
return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Kt));
return r}function Rn(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function ze(t){return Rn(t)?t:t.slice()}function Pn(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var f=s.
toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==a&&(n[h]=o)}}var w=t.length,p=t.charAt(0),
u=Math.log(w)/Math.log(256),v=Math.log(256)/Math.log(w);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,m=0,x=c.length;m!==x&&c[m]===0;)m++,
d++;for(var S=(x-m)*v+1>>>0,E=new Uint8Array(S);m!==x;){for(var g=c[m],I=0,_=S-1;(g!==0||I<A)&&_!==-1;_--,I++)g+=256*E[_]>>>
0,E[_]=g%w>>>0,g=g/w>>>0;if(g!==0)throw new Error("Non-zero carry");A=I,m++}for(var B=S-A;B!==S&&E[B]===0;)B++;for(var M=p.
repeat(d);B<S;++B)M+=t.charAt(E[B]);return M}function C(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,m=0;c[d]===p;)A++,d++;for(var x=(c.length-d)*u+
1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var g=0,I=x-1;(E!==0||g<m)&&I!==-1;I--,g++)
E+=w*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");m=g,d++}if(c[d]!==" "){for(var _=x-m;_!==
x&&S[_]===0;)_++;for(var B=new Uint8Array(A+(x-_)),M=A;_!==x;)B[M++]=S[_++];return B}}}function y(c){var d=C(c);if(d)return d;
throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:C,decode:y}}var Nn=Pn,Gn=Nn;let Fn=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Ln=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return zr(this,e)}},qn=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return zr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function zr(t,e){return new qn({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let jn=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Fn(e,r,n),this.decoder=new Ln(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function nt({name:t,prefix:e,encode:r,decode:n}){return new jn(
t,e,r,n)}function ke({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Gn(r,t,n);return nt({prefix:e,
name:t,encode:i,decode:s=>Me(o(s))})}function Qn(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const w=e[t[h]];if(w===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|w,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Vn(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Kn(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function R({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Kn(n,i);return nt(
{prefix:e,name:t,encode(s){return Vn(s,n,r)},decode(s){return Qn(s,o,r,t)}})}const Hn=ke({prefix:"9",name:"base10",alphabet:"\
0123456789"}),Wn=Object.freeze(Object.defineProperty({__proto__:null,base10:Hn},Symbol.toStringTag,{value:"Module"})),Xn=R(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Jn=R({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Zn=Object.freeze(Object.defineProperty({__proto__:null,
base16:Xn,base16upper:Jn},Symbol.toStringTag,{value:"Module"})),Yn=R({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
ei=Object.freeze(Object.defineProperty({__proto__:null,base2:Yn},Symbol.toStringTag,{value:"Module"})),Tr=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),ti=Tr.reduce((t,e,r)=>(t[r]=e,t),[]),ri=Tr.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function ni(t){return t.reduce((e,r)=>(e+=ti[r],e),"")}function ii(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=ri[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(e)}const oi=nt({prefix:"🚀",name:"\
base256emoji",encode:ni,decode:ii}),si=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:oi},Symbol.toStringTag,
{value:"Module"})),me=R({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
ai=R({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),ci=R(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),di=R({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),fi=R({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),li=R({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),ui=R({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),hi=R({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),pi=R({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),bi=Object.freeze(Object.defineProperty({__proto__:null,
base32:me,base32hex:fi,base32hexpad:ui,base32hexpadupper:hi,base32hexupper:li,base32pad:ci,base32padupper:di,base32upper:ai,
base32z:pi},Symbol.toStringTag,{value:"Module"})),Fe=ke({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),mi=ke({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
wi=Object.freeze(Object.defineProperty({__proto__:null,base36:Fe,base36upper:mi},Symbol.toStringTag,{value:"Module"})),re=ke(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),gi=ke({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),yi=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:re,base58flickr:gi},Symbol.toStringTag,{value:"Module"})),Ei=R({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),vi=R({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),kr=R({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),xi=R({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Si=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Ei,base64pad:vi,base64url:kr,base64urlpad:xi},Symbol.toStringTag,{value:"Module"})),Ai=R({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),_i=Object.freeze(Object.defineProperty({__proto__:null,base8:Ai},Symbol.
toStringTag,{value:"Module"})),Ci=nt({prefix:"\0",name:"identity",encode:t=>Dn(Me(t)),decode:t=>Me(On(t))}),Ii=Object.freeze(
Object.defineProperty({__proto__:null,identity:Ci},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var Bi=$r,Ht=128,Ui=-128,Mi=Math.pow(2,31);function $r(t,e,r){e=e||[],r=r||0;for(var n=r;t>=Mi;)e[r++]=t&255|Ht,t/=128;for(;t&
Ui;)e[r++]=t&255|Ht,t>>>=7;return e[r]=t|0,$r.bytes=r-n+1,e}var zi=gt,Ti=128,Wt=127;function gt(t,n){var r=0,n=n||0,i=0,
o=n,s,a=t.length;do{if(o>=a)throw gt.bytes=0,new RangeError("Could not decode varint");s=t[o++],r+=i<28?(s&Wt)<<i:(s&Wt)*
Math.pow(2,i),i+=7}while(s>=Ti);return gt.bytes=o-n,r}var ki=Math.pow(2,7),$i=Math.pow(2,14),Oi=Math.pow(2,21),Di=Math.pow(
2,28),Ri=Math.pow(2,35),Pi=Math.pow(2,42),Ni=Math.pow(2,49),Gi=Math.pow(2,56),Fi=Math.pow(2,63),Li=function(t){return t<
ki?1:t<$i?2:t<Oi?3:t<Di?4:t<Ri?5:t<Pi?6:t<Ni?7:t<Gi?8:t<Fi?9:10},qi={encode:Bi,decode:zi,encodingLength:Li},Ve=qi;function yt(t,e=0){
const r=Ve.decode(t,e),n=Ve.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function Ke(t,e,r=0){return Ve.encode(t,e,r),e}function He(t){return Ve.
encodingLength(t)}function ji(t,e){const r=e.byteLength,n=He(t),i=n+He(r),o=new Uint8Array(i+r);return Ke(t,o,0),Ke(r,o,
n),o.set(e,i),new $t(t,r,e,o)}function Qi(t){const e=Me(t),[r,n]=yt(e),[i,o]=yt(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new $t(r,i,s,e)}function Vi(t,e){if(t===e)return!0;{const r=e;return t.code===
r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&$n(t.bytes,r.bytes)}}let $t=class{constructor(e,r,n,i){l(this,"c\
ode");l(this,"size");l(this,"digest");l(this,"bytes");this.code=e,this.size=r,this.digest=ze(n),this.bytes=ze(i)}};function Xt(t,e){
const{bytes:r,version:n}=t;switch(n){case 0:return Wi(r,Et(t),e??re.encoder);default:return Xi(r,Et(t),e??me.encoder)}}const Jt=new WeakMap;
function Et(t){const e=Jt.get(t);if(e==null){const r=new Map;return Jt.set(t,r),r}return e}var Ar;let Ki=class G{constructor(e,r,n,i){
l(this,"code");l(this,"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,Ar,"CID");this.code=r,this.version=
e,this.multihash=n,this.bytes=ze(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
ve)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Ji)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return G.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=ji(e,
r);return G.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return G.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&Vi(e.multihash,n.multihash)}toString(e){return Xt(this,e)}toJSON(){return{"/":Xt(
this)}}link(){return this}[(Ar=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof G)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new G(n,i,o,s??Zt(n,i,o.bytes))}else if(r[Zi]===!0){const{version:n,
multihash:i,code:o}=r,s=Qi(i);return G.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==ve)throw new Error(`Version 0 CID must use dag-pb (code: ${ve}) block encoding`);return new G(e,r,n,n.bytes)}case 1:{
const i=Zt(e,r,n.bytes);return new G(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return G.create(
0,ve,e)}static createV1(e,r){return G.create(1,e,r)}static decode(e){const[r,n]=G.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=G.inspectBytes(e),n=r.size-r.multihashSize,i=Me(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new $t(r.multihashCode,r.digestSize,o,i);return[r.version===0?G.createV0(s):G.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[p,u]=yt(e.subarray(r));return r+=u,p};let i=n(),o=ve;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),h=r+f,w=h-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:w,size:h}}static parse(e,r){const[n,i]=Hi(e,r),o=G.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Et(o).set(n,e),o}};function Hi(t,e){
switch(t[0]){case"Q":{const r=e??re;return[re.prefix,r.decode(`${re.prefix}${t}`)]}case re.prefix:{const r=e??re;return[
re.prefix,r.decode(t)]}case me.prefix:{const r=e??me;return[me.prefix,r.decode(t)]}case Fe.prefix:{const r=e??Fe;return[
Fe.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function Wi(t,e,r){const{prefix:n}=r;if(n!==re.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function Xi(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const ve=112,Ji=18;function Zt(t,e,r){const n=He(t),i=n+He(e),o=new Uint8Array(i+r.byteLength);return Ke(t,o,0),
Ke(e,o,n),o.set(r,i),o}const Zi=Symbol.for("@ipld/js-cid/CID"),vt={...Ii,...ei,..._i,...Wn,...Zn,...bi,...wi,...yi,...Si,
...si};function Or(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const Yt=Or("u\
tf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),ft=Or("ascii","a",t=>{let e="\
a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=Ur(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}),Dr={utf8:Yt,"utf-8":Yt,hex:vt.base16,latin1:ft,ascii:ft,binary:ft,...vt};function Rr(t,e="\
utf8"){const r=Dr[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}
function We(t,e="utf8"){const r=Dr[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(
t).substring(1)}class he extends Error{constructor(){super(...arguments);l(this,"name","InvalidMultiaddrError")}}l(he,"n\
ame","InvalidMultiaddrError");class we extends Error{constructor(){super(...arguments);l(this,"name","ValidationError")}}
l(we,"name","ValidationError");class Pr extends Error{constructor(){super(...arguments);l(this,"name","UnknownProtocolEr\
ror")}}l(Pr,"name","UnknownProtocolError");const Yi=4,eo=6,to=273,ro=33,no=41,io=42,oo=43,so=53,ao=54,co=55,fo=56,lo=132,
uo=301,ho=302,po=400,bo=421,mo=444,wo=445,go=446,yo=447,Eo=448,vo=449,xo=454,So=460,Ao=461,_o=465,Co=466,Io=480,Bo=481,Uo=443,
Mo=477,zo=478,To=479,ko=277,$o=275,Oo=276,Do=280,Ro=281,Po=290,No=777;function er(t){return e=>We(e,t)}function tr(t){return e=>Rr(
e,t)}function Be(t){return new DataView(t.buffer).getUint16(t.byteOffset).toString()}function be(t){const e=new ArrayBuffer(
2);return new DataView(e).setUint16(0,typeof t=="string"?parseInt(t):t),new Uint8Array(e)}function Go(t){const e=t.split(
":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port numbe\
r`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const r=Rr(e[0],
"base32"),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=be(n);return Mr(
[r,i],r.length+i.length)}function Fo(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr\
: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${e[0]} not a Tor onion3 address.`);const r=me.decode(`b${e[0]}`),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=be(n);return Mr([r,i],r.length+i.length)}function rr(t){const e=t.subarray(
0,t.length-2),r=t.subarray(t.length-2),n=We(e,"base32"),i=Be(r);return`${n}:${i}`}const Nr=function(t){t=t.toString().trim();
const e=new Uint8Array(4);return t.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new he(
"Invalid byte value in IP address");e[n]=i}),e},Lo=function(t){let e=0;t=t.toString().trim();const r=t.split(":",8);let n;
for(n=0;n<r.length;n++){const o=Br(r[n]);let s;o&&(s=Nr(r[n]),r[n]=We(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,We(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(e+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new he("Invalid byte value in IP address");i[e++]=o>>8&255,i[e++]=o&255}return i},qo=function(t){
if(t.byteLength!==4)throw new he("IPv4 address was incorrect length");const e=[];for(let r=0;r<t.byteLength;r++)e.push(t[r]);
return e.join(".")},jo=function(t){if(t.byteLength!==16)throw new he("IPv6 address was incorrect length");const e=[];for(let n=0;n<
t.byteLength;n+=2){const i=t[n],o=t[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;e.push(s)}
const r=e.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new he(
`Invalid IPv6 address "${r}"`)}};function Qo(t){try{const e=new URL(`http://[${t}]`);return e.hostname.substring(1,e.hostname.
length-1)}catch{throw new he(`Invalid IPv6 address "${t}"`)}}const lt=Object.values(vt).map(t=>t.decoder),Vo=(function(){
let t=lt[0].or(lt[1]);return lt.slice(2).forEach(e=>t=t.or(e)),t})();function Ko(t){return Vo.decode(t)}function Ho(t){return e=>t.
encoder.encode(e)}function Wo(t){if(parseInt(t).toString()!==t)throw new we("Value must be an integer")}function Xo(t){if(t<
0)throw new we("Value must be a positive integer, or zero")}function Jo(t){return e=>{if(e>t)throw new we(`Value must be\
 smaller than or equal to ${t}`)}}function Zo(...t){return e=>{for(const r of t)r(e)}}const Re=Zo(Wo,Xo,Jo(65535)),V=-1;
class Yo{constructor(){l(this,"protocolsByCode",new Map);l(this,"protocolsByName",new Map)}getProtocol(e){let r;if(typeof e==
"string"?r=this.protocolsByName.get(e):r=this.protocolsByCode.get(e),r==null)throw new Pr(`Protocol ${e} was unknown`);return r}addProtocol(e){
var r;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(r=e.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,e)})}removeProtocol(e){var n;const r=this.protocolsByCode.get(e);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const es=new Yo,ts=[
{code:Yi,name:"ip4",size:32,valueToBytes:Nr,bytesToValue:qo,validate:t=>{if(!Br(t))throw new we(`Invalid IPv4 address "${t}\
"`)}},{code:eo,name:"tcp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:to,name:"udp",size:16,valueToBytes:be,
bytesToValue:Be,validate:Re},{code:ro,name:"dccp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:no,name:"ip\
6",size:128,valueToBytes:Lo,bytesToValue:jo,stringToValue:Qo,validate:t=>{if(!zn(t))throw new we(`Invalid IPv6 address "${t}\
"`)}},{code:io,name:"ip6zone",size:V},{code:oo,name:"ipcidr",size:8,bytesToValue:er("base10"),valueToBytes:tr("base10")},
{code:so,name:"dns",size:V},{code:ao,name:"dns4",size:V},{code:co,name:"dns6",size:V},{code:fo,name:"dnsaddr",size:V},{code:lo,
name:"sctp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:uo,name:"udt"},{code:ho,name:"utp"},{code:po,name:"\
unix",size:V,stringToValue:t=>decodeURIComponent(t),valueToString:t=>encodeURIComponent(t)},{code:bo,name:"p2p",aliases:[
"ipfs"],size:V,bytesToValue:er("base58btc"),valueToBytes:t=>t.startsWith("Q")||t.startsWith("1")?tr("base58btc")(t):Ki.parse(
t).multihash.bytes},{code:mo,name:"onion",size:96,bytesToValue:rr,valueToBytes:Go},{code:wo,name:"onion3",size:296,bytesToValue:rr,
valueToBytes:Fo},{code:go,name:"garlic64",size:V},{code:yo,name:"garlic32",size:V},{code:Eo,name:"tls"},{code:vo,name:"s\
ni",size:V},{code:xo,name:"noise"},{code:So,name:"quic"},{code:Ao,name:"quic-v1"},{code:_o,name:"webtransport"},{code:Co,
name:"certhash",size:V,bytesToValue:Ho(kr),valueToBytes:Ko},{code:Io,name:"http"},{code:Bo,name:"http-path",size:V,stringToValue:t=>`\
/${decodeURIComponent(t)}`,valueToString:t=>encodeURIComponent(t.substring(1))},{code:Uo,name:"https"},{code:Mo,name:"ws"},
{code:zo,name:"wss"},{code:To,name:"p2p-websocket-star"},{code:ko,name:"p2p-stardust"},{code:$o,name:"p2p-webrtc-star"},
{code:Oo,name:"p2p-webrtc-direct"},{code:Do,name:"webrtc-direct"},{code:Ro,name:"webrtc"},{code:Po,name:"p2p-circuit"},{
code:No,name:"memory",size:V}];ts.forEach(t=>{es.addProtocol(t)});function xt(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return ir(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return ir(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function rs(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const nr=4096;function ns(t){const e=t.
length;if(e<=nr)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=nr));return r}function is(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function ir(t){return is(
t)?t:t.slice()}function os(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==
a&&(n[h]=o)}}var w=t.length,p=t.charAt(0),u=Math.log(w)/Math.log(256),v=Math.log(256)/Math.log(w);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,
m=0,x=c.length;m!==x&&c[m]===0;)m++,d++;for(var S=(x-m)*v+1>>>0,E=new Uint8Array(S);m!==x;){for(var g=c[m],I=0,_=S-1;(g!==
0||I<A)&&_!==-1;_--,I++)g+=256*E[_]>>>0,E[_]=g%w>>>0,g=g/w>>>0;if(g!==0)throw new Error("Non-zero carry");A=I,m++}for(var B=S-
A;B!==S&&E[B]===0;)B++;for(var M=p.repeat(d);B<S;++B)M+=t.charAt(E[B]);return M}function C(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,m=0;c[d]===p;)A++,d++;for(var x=(c.
length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var g=0,I=x-1;(E!==0||g<m)&&
I!==-1;I--,g++)E+=w*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");m=g,d++}if(c[d]!==" "){
for(var _=x-m;_!==x&&S[_]===0;)_++;for(var B=new Uint8Array(A+(x-_)),M=A;_!==x;)B[M++]=S[_++];return B}}}function y(c){var d=C(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:C,decode:y}}var ss=os,as=ss;let cs=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},ds=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Gr(this,e)}},fs=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return Gr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Gr(t,e){return new fs({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let ls=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new cs(e,r,n),this.decoder=new ds(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function it({name:t,prefix:e,encode:r,decode:n}){return new ls(
t,e,r,n)}function $e({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=as(r,t,n);return it({prefix:e,
name:t,encode:i,decode:s=>xt(o(s))})}function us(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const w=e[t[h]];if(w===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|w,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function hs(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function ps(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function P({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=ps(n,i);return it(
{prefix:e,name:t,encode(s){return hs(s,n,r)},decode(s){return us(s,o,r,t)}})}$e({prefix:"9",name:"base10",alphabet:"0123\
456789"});P({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});P({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});P({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const Fr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),bs=Fr.reduce((t,e,r)=>(t[r]=e,t),[]),ms=Fr.reduce((t,e,r)=>{const n=e.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);function ws(t){return t.reduce(
(e,r)=>(e+=bs[r],e),"")}function gs(t){const e=[];for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=ms[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(
e)}it({prefix:"🚀",name:"base256emoji",encode:ws,decode:gs});P({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
tuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});P({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0});P({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0});P({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});
P({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});P({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});P({prefix:"t",name:"\
base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});P({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});P({prefix:"h",name:"base32z",
alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});$e({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijk\
lmnopqrstuvwxyz",caseInsensitive:!0});$e({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
caseInsensitive:!0});$e({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxy\
z"});$e({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});P({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});P({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});P({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});P({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});P({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3});it({prefix:"\0",name:"identity",encode:t=>ns(xt(t)),decode:t=>xt(rs(
t))});new TextEncoder;new TextDecoder;const ys="/",Es=new TextEncoder().encode(ys);Es[0];function vs(t){if(t instanceof Uint8Array&&
t.constructor.name==="Uint8Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))
return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function xs(t){
return new TextEncoder().encode(t)}function Ss(t){return new TextDecoder().decode(t)}function As(t,e){if(t.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<t.length;i++){var o=t.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=t.length,f=t.charAt(0),h=Math.log(
a)/Math.log(256),w=Math.log(256)/Math.log(a);function p(b){if(b instanceof Uint8Array||(ArrayBuffer.isView(b)?b=new Uint8Array(
b.buffer,b.byteOffset,b.byteLength):Array.isArray(b)&&(b=Uint8Array.from(b))),!(b instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(b.length===0)return"";for(var C=0,y=0,c=0,d=b.length;c!==d&&b[c]===0;)c++,C++;for(var A=(d-c)*
w+1>>>0,m=new Uint8Array(A);c!==d;){for(var x=b[c],S=0,E=A-1;(x!==0||S<y)&&E!==-1;E--,S++)x+=256*m[E]>>>0,m[E]=x%a>>>0,x=
x/a>>>0;if(x!==0)throw new Error("Non-zero carry");y=S,c++}for(var g=A-y;g!==A&&m[g]===0;)g++;for(var I=f.repeat(C);g<A;++g)
I+=t.charAt(m[g]);return I}function u(b){if(typeof b!="string")throw new TypeError("Expected String");if(b.length===0)return new Uint8Array;
var C=0;if(b[C]!==" "){for(var y=0,c=0;b[C]===f;)y++,C++;for(var d=(b.length-C)*h+1>>>0,A=new Uint8Array(d);b[C];){var m=r[b.
charCodeAt(C)];if(m===255)return;for(var x=0,S=d-1;(m!==0||x<c)&&S!==-1;S--,x++)m+=a*A[S]>>>0,A[S]=m%256>>>0,m=m/256>>>0;
if(m!==0)throw new Error("Non-zero carry");c=x,C++}if(b[C]!==" "){for(var E=d-c;E!==d&&A[E]===0;)E++;for(var g=new Uint8Array(
y+(d-E)),I=y;E!==d;)g[I++]=A[E++];return g}}}function v(b){var C=u(b);if(C)return C;throw new Error(`Non-${e} character`)}
return{encode:p,decodeUnsafe:u,decode:v}}var _s=As,Cs=_s;let Is=class{constructor(e,r,n){l(this,"name");l(this,"prefix");
l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Bs=class{constructor(e,r,n){l(this,"name");l(this,"pr\
efix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return Lr(this,e)}},Us=class{constructor(e){l(this,"decoders");this.decoders=e}or(e){
return Lr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Lr(t,e){
return new Us({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let Ms=class{constructor(e,r,n,i){l(this,"n\
ame");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Is(e,r,n),this.decoder=new Bs(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function ot({name:t,prefix:e,encode:r,decode:n}){return new Ms(t,e,r,
n)}function Oe({name:t,prefix:e,alphabet:r}){const{encode:n,decode:i}=Cs(r,t);return ot({prefix:e,name:t,encode:n,decode:o=>vs(
i(o))})}function zs(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,f=0;for(let h=0;h<
i;++h){const w=e[t[h]];if(w===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|w,s+=r,s>=8&&(s-=8,o[f++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Ts(t,e,r){const n=e[e.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=
e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function ks(t){const e={};for(let r=0;r<t.length;++r)e[t[r]]=r;return e}
function N({name:t,prefix:e,bitsPerChar:r,alphabet:n}){const i=ks(n);return ot({prefix:e,name:t,encode(o){return Ts(o,n,
r)},decode(o){return zs(o,i,r,t)}})}const $s=Oe({prefix:"9",name:"base10",alphabet:"0123456789"}),Os=Object.freeze(Object.
defineProperty({__proto__:null,base10:$s},Symbol.toStringTag,{value:"Module"})),Ds=N({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),Rs=N({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Ps=Object.
freeze(Object.defineProperty({__proto__:null,base16:Ds,base16upper:Rs},Symbol.toStringTag,{value:"Module"})),Ns=N({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),Gs=Object.freeze(Object.defineProperty({__proto__:null,base2:Ns},Symbol.toStringTag,
{value:"Module"})),qr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Fs=qr.reduce((t,e,r)=>(t[r]=e,t),[]),
Ls=qr.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);
function qs(t){return t.reduce((e,r)=>(e+=Fs[r],e),"")}function js(t){const e=[];for(const r of t){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Ls[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);e.push(i)}return new Uint8Array(e)}const Qs=ot({prefix:"🚀",name:"base256emoji",encode:qs,decode:js}),Vs=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Qs},Symbol.toStringTag,{value:"Module"})),Ks=N({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Hs=N({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Ws=N({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),Xs=N({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),Js=N(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),Zs=N({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),Ys=N({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ea=N({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),ta=N({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
ra=Object.freeze(Object.defineProperty({__proto__:null,base32:Ks,base32hex:Js,base32hexpad:Ys,base32hexpadupper:ea,base32hexupper:Zs,
base32pad:Ws,base32padupper:Xs,base32upper:Hs,base32z:ta},Symbol.toStringTag,{value:"Module"})),na=Oe({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),ia=Oe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),oa=Object.freeze(Object.defineProperty({__proto__:null,base36:na,base36upper:ia},Symbol.toStringTag,
{value:"Module"})),sa=Oe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),aa=Oe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),ca=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:sa,base58flickr:aa},Symbol.toStringTag,{value:"Module"})),da=N({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),fa=N({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),la=N({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),ua=N({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ha=Object.
freeze(Object.defineProperty({__proto__:null,base64:da,base64pad:fa,base64url:la,base64urlpad:ua},Symbol.toStringTag,{value:"\
Module"})),pa=N({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),ba=Object.freeze(Object.defineProperty({__proto__:null,
base8:pa},Symbol.toStringTag,{value:"Module"})),ma=ot({prefix:"\0",name:"identity",encode:t=>Ss(t),decode:t=>xs(t)}),wa=Object.
freeze(Object.defineProperty({__proto__:null,identity:ma},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const or={...wa,...Gs,...ba,...Os,...Ps,...ra,...oa,...ca,...ha,...Vs};function St(t=0){return new Uint8Array(t)}function Xe(t=0){
return new Uint8Array(t)}function jr(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}
const sr=jr("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),ut=jr("asci\
i","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=Xe(t.
length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),ga={utf8:sr,"utf-8":sr,hex:or.base16,latin1:ut,ascii:ut,
binary:ut,...or};function ya(t,e="utf8"){const r=ga[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.
decoder.decode(`${r.prefix}${t}`)}const Ea=Math.pow(2,7),va=Math.pow(2,14),xa=Math.pow(2,21),Qr=Math.pow(2,28),Vr=Math.pow(
2,35),Kr=Math.pow(2,42),Hr=Math.pow(2,49),j=128,ce=127;function Ot(t){if(t<Ea)return 1;if(t<va)return 2;if(t<xa)return 3;
if(t<Qr)return 4;if(t<Vr)return 5;if(t<Kr)return 6;if(t<Hr)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Sa(t,e,r=0){switch(Ot(t)){case 8:e[r++]=t&255|j,t/=128;case 7:
e[r++]=t&255|j,t/=128;case 6:e[r++]=t&255|j,t/=128;case 5:e[r++]=t&255|j,t/=128;case 4:e[r++]=t&255|j,t>>>=7;case 3:e[r++]=
t&255|j,t>>>=7;case 2:e[r++]=t&255|j,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreachable")}return e}
function Aa(t,e){let r=t[e],n=0;if(n+=r&ce,r<j||(r=t[e+1],n+=(r&ce)<<7,r<j)||(r=t[e+2],n+=(r&ce)<<14,r<j)||(r=t[e+3],n+=
(r&ce)<<21,r<j)||(r=t[e+4],n+=(r&ce)*Qr,r<j)||(r=t[e+5],n+=(r&ce)*Vr,r<j)||(r=t[e+6],n+=(r&ce)*Kr,r<j)||(r=t[e+7],n+=(r&
ce)*Hr,r<j))return n;throw new RangeError("Could not decode varint")}const Dt=new Float32Array([-0]),fe=new Uint8Array(Dt.
buffer);function _a(t,e,r){Dt[0]=t,e[r]=fe[0],e[r+1]=fe[1],e[r+2]=fe[2],e[r+3]=fe[3]}function Ca(t,e){return fe[0]=t[e],
fe[1]=t[e+1],fe[2]=t[e+2],fe[3]=t[e+3],Dt[0]}const Rt=new Float64Array([-0]),L=new Uint8Array(Rt.buffer);function Ia(t,e,r){
Rt[0]=t,e[r]=L[0],e[r+1]=L[1],e[r+2]=L[2],e[r+3]=L[3],e[r+4]=L[4],e[r+5]=L[5],e[r+6]=L[6],e[r+7]=L[7]}function Ba(t,e){return L[0]=
t[e],L[1]=t[e+1],L[2]=t[e+2],L[3]=t[e+3],L[4]=t[e+4],L[5]=t[e+5],L[6]=t[e+6],L[7]=t[e+7],Rt[0]}const Ua=BigInt(Number.MAX_SAFE_INTEGER),
Ma=BigInt(Number.MIN_SAFE_INTEGER);class q{constructor(e,r){l(this,"lo");l(this,"hi");this.lo=e|0,this.hi=r|0}toNumber(e=!1){
if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===
0n)return ue;if(e<Ua&&e>Ma)return this.fromNumber(Number(e));const r=e<0n;r&&(e=-e);let n=e>>32n,i=e-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>ar&&(i=0n,++n>ar&&(n=0n))),new q(Number(i),Number(n))}static fromNumber(e){if(e===0)return ue;const r=e<
0;r&&(e=-e);let n=e>>>0,i=(e-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new q(n,i)}static from(e){return typeof e=="number"?q.fromNumber(e):typeof e=="bigint"?q.fromBigInt(e):typeof e=="string"?
q.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new q(e.low>>>0,e.high>>>0):ue}}const ue=new q(0,0);ue.toBigInt=function(){
return 0n};ue.zzEncode=ue.zzDecode=function(){return this};ue.length=function(){return 1};const ar=4294967296n;function za(t){
let e=0,r=0;for(let n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(n+1)&64512)===
56320?(++n,e+=4):e+=3;return e}function Ta(t,e,r){if(r-e<1)return"";let i;const o=[];let s=0,a;for(;e<r;)a=t[e++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|t[e++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Wr(t,e,r){const n=r;let i,o;for(let s=0;s<t.length;++s)i=t.charCodeAt(
s),i<128?e[r++]=i:i<2048?(e[r++]=i>>6|192,e[r++]=i&63|128):(i&64512)===55296&&((o=t.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,e[r++]=i>>18|240,e[r++]=i>>12&63|128,e[r++]=i>>6&63|128,e[r++]=i&63|128):(e[r++]=i>>12|224,e[r++]=
i>>6&63|128,e[r++]=i&63|128);return r-n}function J(t,e){return RangeError(`index out of range: ${t.pos} + ${e??1} > ${t.
len}`)}function Pe(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class ka{constructor(e){l(this,"buf");l(this,
"pos");l(this,"len");l(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;
if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.
pos=this.len,J(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw J(this,4);return Pe(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw J(this,4);return Pe(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw J(this,4);const e=Ca(
this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw J(this,4);const e=Ba(this.buf,this.pos);return this.
pos+=8,e}bytes(){const e=this.uint32(),r=this.pos,n=this.pos+e;if(n>this.len)throw J(this,e);return this.pos+=e,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const e=this.bytes();return Ta(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw J(this,e);this.pos+=e}else do if(this.pos>=this.len)throw J(this);while((this.buf[this.pos++]&128)!==0);
return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:
for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e}\
 at offset ${this.pos}`)}return this}readLongVarint(){const e=new q(0,0);let r=0;if(this.len-this.pos>4){for(;r<4;++r)if(e.
lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>
0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;r=0}else{for(;r<3;++r){if(this.pos>=this.
len)throw J(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.
buf[this.pos++]&127)<<r*7)>>>0,e}if(this.len-this.pos>4){for(;r<5;++r)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,
this.buf[this.pos++]<128)return e}else for(;r<5;++r){if(this.pos>=this.len)throw J(this);if(e.hi=(e.hi|(this.buf[this.pos]&
127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.
len)throw J(this,8);const e=Pe(this.buf,this.pos+=4),r=Pe(this.buf,this.pos+=4);return new q(e,r)}int64(){return this.readLongVarint().
toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){
return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Aa(this.buf,this.pos);return this.pos+=Ot(e),e}uint64String(){
return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.
readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.
readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().
toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){
return this.readFixed64().toString()}}function $a(t){return new ka(t instanceof Uint8Array?t:t.subarray())}function Pt(t,e,r){
const n=$a(t);return e.decode(n,void 0,r)}function Oa(t){let n,i=8192;return function(s){if(s<1||s>4096)return Xe(s);i+s>
8192&&(n=Xe(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class Ue{constructor(e,r,n){l(this,"fn");
l(this,"len");l(this,"next");l(this,"val");this.fn=e,this.len=r,this.next=void 0,this.val=n}}function ht(){}class Da{constructor(e){
l(this,"head");l(this,"tail");l(this,"len");l(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.
states}}const Ra=Oa();function Pa(t){return globalThis.Buffer!=null?Xe(t):Ra(t)}class At{constructor(){l(this,"len");l(this,
"head");l(this,"tail");l(this,"states");this.len=0,this.head=new Ue(ht,0,0),this.tail=this.head,this.states=null}_push(e,r,n){
return this.tail=this.tail.next=new Ue(e,r,n),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.tail.next=new Ga(
(e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Ne,10,q.fromNumber(e)):
this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=q.fromBigInt(e);return this._push(Ne,r.length(),
r)}uint64Number(e){return this._push(Sa,Ot(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(
e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=q.fromBigInt(
e).zzEncode();return this._push(Ne,r.length(),r)}sint64Number(e){const r=q.fromNumber(e).zzEncode();return this._push(Ne,
r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(pt,1,e?1:0)}fixed32(e){return this.
_push(xe,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=q.fromBigInt(e);return this._push(xe,4,r.lo)._push(
xe,4,r.hi)}fixed64Number(e){const r=q.fromNumber(e);return this._push(xe,4,r.lo)._push(xe,4,r.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(_a,4,e)}double(e){return this._push(Ia,8,e)}bytes(e){const r=e.length>>>0;return r===
0?this._push(pt,1,0):this.uint32(r)._push(Fa,r,e)}string(e){const r=za(e);return r!==0?this.uint32(r)._push(Wr,r,e):this.
_push(pt,1,0)}fork(){return this.states=new Da(this),this.head=this.tail=new Ue(ht,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Ue(ht,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=r,this.len+=n),this}finish(){let e=this.head.next;const r=Pa(this.len);
let n=0;for(;e!=null;)e.fn(e.val,r,n),n+=e.len,e=e.next;return r}}function pt(t,e,r){e[r]=t&255}function Na(t,e,r){for(;t>
127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class Ga extends Ue{constructor(r,n){super(Na,r,n);l(this,"next");this.next=void 0}}
function Ne(t,e,r){for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&
127|128,t.lo=t.lo>>>7;e[r++]=t.lo}function xe(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function Fa(t,e,r){
e.set(t,r)}globalThis.Buffer!=null&&(At.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this.
_push(La,e,t),this},At.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this.
_push(qa,e,t),this});function La(t,e,r){e.set(t,r)}function qa(t,e,r){t.length<40?Wr(t,e,r):e.utf8Write!=null?e.utf8Write(
t,r):e.set(ya(t),r)}function ja(){return new At}function Nt(t,e){const r=ja();return e.encode(t,r,{lengthDelimited:!1}),
r.finish()}var _t;(function(t){t[t.VARINT=0]="VARINT",t[t.BIT64=1]="BIT64",t[t.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",t[t.
START_GROUP=3]="START_GROUP",t[t.END_GROUP=4]="END_GROUP",t[t.BIT32=5]="BIT32"})(_t||(_t={}));function Qa(t,e,r,n){return{
name:t,type:e,encode:r,decode:n}}function Gt(t,e){return Qa("message",_t.LENGTH_DELIMITED,t,e)}class Ct extends Error{constructor(){
super(...arguments);l(this,"code","ERR_MAX_LENGTH");l(this,"name","MaxLengthError")}}var _r,Cr;(Cr=(_r=globalThis.process)==
null?void 0:_r.env)!=null&&Cr.DUMP_SESSION_KEYS;var Je;(function(t){let e;t.codec=()=>(e==null&&(e=Gt((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,f;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const h=r.uint32();switch(h>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new Ct('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((f=i.limits)==null?void 0:f.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new Ct('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(h&7);break}}}return o})),e),t.encode=r=>Nt(r,t.codec()),t.decode=(r,n)=>Pt(r,t.codec(),n)})(Je||(Je={}));var cr;
(function(t){let e;t.codec=()=>(e==null&&(e=Gt((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),Je.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:St(0),identitySig:St(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();
switch(f>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=Je.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(f&7);break}}}return o})),
e),t.encode=r=>Nt(r,t.codec()),t.decode=(r,n)=>Pt(r,t.codec(),n)})(cr||(cr={}));var dr;(function(t){let e;t.codec=()=>(e==
null&&(e=Gt((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:St(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();switch(f>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new Ct(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(f&7);break}}}
return o})),e),t.encode=r=>Nt(r,t.codec()),t.decode=(r,n)=>Pt(r,t.codec(),n)})(dr||(dr={}));new TextEncoder;new TextDecoder;function Va(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])
return!1;return!0}function Ft(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Te(t);if(t instanceof
ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Te(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));
throw new Error("Unknown type, must be binary type")}function Ka(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}
function Te(t){return Ka(t)?t:t.slice()}function Ha(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==
a&&(n[h]=o)}}var w=t.length,p=t.charAt(0),u=Math.log(w)/Math.log(256),v=Math.log(256)/Math.log(w);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,
m=0,x=c.length;m!==x&&c[m]===0;)m++,d++;for(var S=(x-m)*v+1>>>0,E=new Uint8Array(S);m!==x;){for(var g=c[m],I=0,_=S-1;(g!==
0||I<A)&&_!==-1;_--,I++)g+=256*E[_]>>>0,E[_]=g%w>>>0,g=g/w>>>0;if(g!==0)throw new Error("Non-zero carry");A=I,m++}for(var B=S-
A;B!==S&&E[B]===0;)B++;for(var M=p.repeat(d);B<S;++B)M+=t.charAt(E[B]);return M}function C(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,m=0;c[d]===p;)A++,d++;for(var x=(c.
length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var g=0,I=x-1;(E!==0||g<m)&&
I!==-1;I--,g++)E+=w*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");m=g,d++}if(c[d]!==" "){
for(var _=x-m;_!==x&&S[_]===0;)_++;for(var B=new Uint8Array(A+(x-_)),M=A;_!==x;)B[M++]=S[_++];return B}}}function y(c){var d=C(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:C,decode:y}}var Wa=Ha,Xa=Wa;let Ja=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Za=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Xr(this,e)}},Ya=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return Xr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Xr(t,e){return new Ya({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let ec=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Ja(e,r,n),this.decoder=new Za(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function Jr({name:t,prefix:e,encode:r,decode:n}){return new ec(
t,e,r,n)}function st({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Xa(r,t,n);return Jr({prefix:e,
name:t,encode:i,decode:s=>Ft(o(s))})}function tc(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const w=e[t[h]];if(w===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|w,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function rc(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function nc(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function ie({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=nc(n,i);return Jr(
{prefix:e,name:t,encode(s){return rc(s,n,r)},decode(s){return tc(s,o,r,t)}})}const Le=ie({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ie({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ie({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ie({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const bt=st(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});st({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const de=st({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});st({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var ic=Zr,fr=128,oc=-128,sc=Math.pow(2,31);function Zr(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=sc;)e[r++]=t&255|fr,t/=128;for(;t&oc;)e[r++]=t&255|fr,t>>>=7;return e[r]=t|0,Zr.bytes=r-n+1,e}var ac=It,
cc=128,lr=127;function It(t,n){var r=0,n=n||0,i=0,o=n,s,a=t.length;do{if(o>=a)throw It.bytes=0,new RangeError("Could not\
 decode varint");s=t[o++],r+=i<28?(s&lr)<<i:(s&lr)*Math.pow(2,i),i+=7}while(s>=cc);return It.bytes=o-n,r}var dc=Math.pow(
2,7),fc=Math.pow(2,14),lc=Math.pow(2,21),uc=Math.pow(2,28),hc=Math.pow(2,35),pc=Math.pow(2,42),bc=Math.pow(2,49),mc=Math.
pow(2,56),wc=Math.pow(2,63),gc=function(t){return t<dc?1:t<fc?2:t<lc?3:t<uc?4:t<hc?5:t<pc?6:t<bc?7:t<mc?8:t<wc?9:10},yc={
encode:ic,decode:ac,encodingLength:gc},Ze=yc;function Bt(t,e=0){const r=Ze.decode(t,e),n=Ze.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function Ye(t,e,r=0){return Ze.encode(t,e,r),e}function et(t){return Ze.encodingLength(t)}function Ec(t,e){const r=e.
byteLength,n=et(t),i=n+et(r),o=new Uint8Array(i+r);return Ye(t,o,0),Ye(r,o,n),o.set(e,i),new Lt(t,r,e,o)}function vc(t){
const e=Ft(t),[r,n]=Bt(e),[i,o]=Bt(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new Lt(r,i,s,e)}function xc(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&Va(t.bytes,r.bytes)}}class Lt{constructor(e,r,n,i){l(this,"code");l(this,"size");l(this,"digest");l(this,"by\
tes");this.code=e,this.size=r,this.digest=Te(n),this.bytes=Te(i)}}function ur(t,e){const{bytes:r,version:n}=t;switch(n){case 0:
return Ac(r,Ut(t),e??de.encoder);default:return _c(r,Ut(t),e??Le.encoder)}}const hr=new WeakMap;function Ut(t){const e=hr.
get(t);if(e==null){const r=new Map;return hr.set(t,r),r}return e}var Ir;class ${constructor(e,r,n,i){l(this,"code");l(this,
"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,Ir,"CID");this.code=r,this.version=e,this.multihash=n,
this.bytes=Te(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
Se)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Cc)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return $.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=Ec(e,
r);return $.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return $.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&xc(e.multihash,n.multihash)}toString(e){return ur(this,e)}toJSON(){return{"/":ur(
this)}}link(){return this}[(Ir=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof $)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new $(n,i,o,s??pr(n,i,o.bytes))}else if(r[Ic]===!0){const{version:n,
multihash:i,code:o}=r,s=vc(i);return $.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==Se)throw new Error(`Version 0 CID must use dag-pb (code: ${Se}) block encoding`);return new $(e,r,n,n.bytes)}case 1:{
const i=pr(e,r,n.bytes);return new $(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return $.create(
0,Se,e)}static createV1(e,r){return $.create(1,e,r)}static decode(e){const[r,n]=$.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=$.inspectBytes(e),n=r.size-r.multihashSize,i=Ft(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new Lt(r.multihashCode,r.digestSize,o,i);return[r.version===0?$.createV0(s):$.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[p,u]=Bt(e.subarray(r));return r+=u,p};let i=n(),o=Se;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),h=r+f,w=h-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:w,size:h}}static parse(e,r){const[n,i]=Sc(e,r),o=$.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ut(o).set(n,e),o}}function Sc(t,e){
switch(t[0]){case"Q":{const r=e??de;return[de.prefix,r.decode(`${de.prefix}${t}`)]}case de.prefix:{const r=e??de;return[
de.prefix,r.decode(t)]}case Le.prefix:{const r=e??Le;return[Le.prefix,r.decode(t)]}case bt.prefix:{const r=e??bt;return[
bt.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function Ac(t,e,r){const{prefix:n}=r;if(n!==de.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function _c(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const Se=112,Cc=18;function pr(t,e,r){const n=et(t),i=n+et(e),o=new Uint8Array(i+r.byteLength);return Ye(t,o,0),
Ye(e,o,n),o.set(r,i),o}const Ic=Symbol.for("@ipld/js-cid/CID");function Bc(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return br(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return br(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function Uc(t){
return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function br(t){return Uc(t)?t:t.slice()}function Mc(t,e,r){if(t.length>=
255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){
var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().
charCodeAt(0),h=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),h!==a&&(n[h]=o)}}var w=t.length,p=t.charAt(0),u=Math.log(w)/
Math.log(256),v=Math.log(256)/Math.log(w);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(
c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,m=0,x=c.length;m!==x&&c[m]===0;)m++,d++;for(var S=(x-m)*
v+1>>>0,E=new Uint8Array(S);m!==x;){for(var g=c[m],I=0,_=S-1;(g!==0||I<A)&&_!==-1;_--,I++)g+=256*E[_]>>>0,E[_]=g%w>>>0,g=
g/w>>>0;if(g!==0)throw new Error("Non-zero carry");A=I,m++}for(var B=S-A;B!==S&&E[B]===0;)B++;for(var M=p.repeat(d);B<S;++B)
M+=t.charAt(E[B]);return M}function C(c){if(typeof c!="string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;
var d=0;if(c[d]!==" "){for(var A=0,m=0;c[d]===p;)A++,d++;for(var x=(c.length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.
charCodeAt(d)];if(E===255)return;for(var g=0,I=x-1;(E!==0||g<m)&&I!==-1;I--,g++)E+=w*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;
if(E!==0)throw new Error("Non-zero carry");m=g,d++}if(c[d]!==" "){for(var _=x-m;_!==x&&S[_]===0;)_++;for(var B=new Uint8Array(
A+(x-_)),M=A;_!==x;)B[M++]=S[_++];return B}}}function y(c){var d=C(c);if(d)return d;throw new Error(`Non-${e} character`)}
return{encode:b,decodeUnsafe:C,decode:y}}var zc=Mc,Tc=zc;class kc{constructor(e,r,n){l(this,"name");l(this,"prefix");l(this,
"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class $c{constructor(e,r,n){l(this,"name");l(this,"pre\
fix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return Yr(this,e)}}class Oc{constructor(e){l(this,"decoders");this.decoders=e}or(e){return Yr(
this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to decode multi\
base string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function Yr(t,e){
return new Oc({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class Dc{constructor(e,r,n,i){l(this,"name");
l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=r,
this.baseEncode=n,this.baseDecode=i,this.encoder=new kc(e,r,n),this.decoder=new $c(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}}function en({name:t,prefix:e,encode:r,decode:n}){return new Dc(t,e,r,
n)}function at({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Tc(r,t,n);return en({prefix:e,
name:t,encode:i,decode:s=>Bc(o(s))})}function Rc(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let h=0;h<i;++h){const w=e[t[h]];if(w===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|w,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Pc(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Nc(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function oe({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Nc(n,i);return en(
{prefix:e,name:t,encode(s){return Pc(s,n,r)},decode(s){return Rc(s,o,r,t)}})}oe({prefix:"b",name:"base32",alphabet:"abcd\
efghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});oe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});oe({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrst\
uvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});oe({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZ234567=",bitsPerChar:5,caseInsensitive:!0});oe({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstu\
v",bitsPerChar:5,caseInsensitive:!0});oe({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,
caseInsensitive:!0});oe({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});
oe({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});
oe({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});at({prefix:"k",name:"base36",alphabet:"\
0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});at({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFG\
HIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});at({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabc\
defghijkmnopqrstuvwxyz"});at({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQ\
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const Gc="peercompute.artifact.manifest.v1",tn=256*1024,Fc=16*
1024**3,Mt=new TextEncoder;function Lc(t){const e=$.asCID(t)||$.parse(String(t));if(![85,112].includes(e.code)||e.multihash.
code!==18||e.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return e.toV1()}function qe(t,e=0,r={remaining:tn}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof t=="string"){if(t.length>r.remaining||
(r.remaining-=Mt.encode(t).length)<0)throw new RangeError("Manifest exceeds byte limit.");return t}if(t===null||typeof t==
"boolean"||typeof t=="number"&&Number.isFinite(t))return t;if(Array.isArray(t)){if(t.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return t.map(i=>qe(i,e+1,r))}if(!t||typeof t!="object"||Object.getPrototypeOf(t)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(t);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(qe(i,e+1,r),[i,qe(t[i],e+1,r)])))}function Fd(t,{
maximumBytes:e=tn,maximumFiles:r=1024,maximumFileBytes:n=Fc}={}){if(!t||t.schema!==Gc||!Array.isArray(t.files)||t.files.
length===0||t.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(t).some(f=>!i.has(f)))
throw new TypeError("Unsupported manifest field.");for(const f of["name","description"])if(t[f]!==void 0&&typeof t[f]!="\
string")throw new TypeError(`Manifest ${f} must be a string.`);if(t.model!==void 0&&(!t.model||typeof t.model!="object"||
Array.isArray(t.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=t.files.map(
f=>{if(!f||typeof f!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(f).some(p=>!["path","cid","si\
ze","sha256","mediaType"].includes(p)))throw new TypeError("Unsupported manifest file field.");const{path:h,size:w}=f;if(typeof h!=
"string"||!h||Mt.encode(h).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(h)||h.split("/").some(p=>!p||p==="."||p==="..")||
o.has(h))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(w)||w<0||w>n)throw new RangeError("Invalid file size.");if(f.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(f.sha256))
throw new TypeError("Invalid SHA-256.");if(f.mediaType!==void 0&&(typeof f.mediaType!="string"||f.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(h),{...f,cid:Lc(f.cid).toString()}}).sort((f,h)=>f.path<h.path?-1:
f.path>h.path?1:0),a=qe({...t,files:s},0,{remaining:e});if(Mt.encode(JSON.stringify(a)).byteLength>e)throw new RangeError(
"Manifest exceeds byte limit.");return a}new TextEncoder;new TextEncoder;const qc="peercompute.gpu.resident-stage-execut\
or.v0",jc="peercompute.gpu.resident-stage-worker-policy.v0";function Y(t,e=null){return String(t??"").trim()||e}function mt(t){
return t==null?null:JSON.parse(JSON.stringify(t))}function mr(t,e=!1){return typeof t=="boolean"?t:e}function Qc(t,e=null){
const r=Math.floor(Number(t));return Number.isFinite(r)&&r>=0?r:e}function Vc(t={},e=null){const r=t&&typeof t=="object"?
t:{},n=Y(r.mode??r.residencyMode,null),i=!!(r.worker||r.workerReady||r.workerModuleUrl||r.workerType),o=n||(i?"dedicated\
-worker":"inline"),s=mr(r.workerReady,!1)||!!r.worker,a=o==="dedicated-worker"||o==="webgpu-worker"||o==="gpu-compute-wo\
rker",f=a?"dedicated-worker":"inline",h=a?s?"worker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:jc,
stageId:e,mode:f,status:h,workerType:Y(r.workerType,a?"webgpu-compute-worker":null),workerModuleUrl:Y(r.workerModuleUrl??
r.moduleUrl,null),startupMode:Y(r.startupMode,a?"warm-on-first-use":"inline"),idleTtlMs:Qc(r.idleTtlMs,a?6e4:null),sameDeviceRequired:mr(
r.sameDeviceRequired,a),bufferTransferPolicy:Y(r.bufferTransferPolicy,a?"worker-owns-device-and-retained-buffers-require\
d":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:h==="blocked-worker-backend-missing"?"gpu-hub-inline-stage-executo\
r":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function Kc(t,e){if(typeof t=="function")
return t(e);if(t&&typeof t.runStage=="function")return t.runStage(e);throw new Error("[GPUHubManager] Resident stage wor\
ker backend must be a function or expose runStage()")}class Hc{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.
hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,this.residentStageExecutorAliases=
new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)
throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.gpu.requestAdapter(e.
adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await r.requestDevice(
e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,r){this.
hotStore.set(e,r)}registerHotBufferSet(e,r){this.hotStore.set(e,r)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){
return this.hotStore.get(e)}createHotBuffer(e,r,n,i){if(!this.device)throw new Error("[GPUHubManager] Device not initial\
ized");const o=this.device.createBuffer({size:r,usage:n,label:i});return this.hotStore.set(e,o),o}removeHotBuffer(e){this.
hotStore.delete(e)}registerResidentStageExecutor(e,r=null){var f;const n=typeof e=="string"?{stageId:e,executor:r}:{...e||
{}},i=Y(n.stageId??n.id,null);if(!i)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const o=n.
executor||r,s=n.workerRunner||n.workerBackend||((f=n.workerPolicy)==null?void 0:f.workerRunner)||null;if(typeof o!="func\
tion"&&!s)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${i}`);const a={schema:qc,stageId:i,
lawNodeId:Y(n.lawNodeId,null),runtimeTarget:Y(n.runtimeTarget,s?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-ex\
ecutor"),executor:typeof o=="function"?o:null,workerRunner:s,workerPolicy:Vc({...n.workerPolicy||n.workerResidency||{},workerReady:(n.
workerPolicy||n.workerResidency||{}).workerReady||!!s},i),metadata:mt(n.metadata||{}),registeredAt:Date.now()};return this.
residentStageExecutors.set(i,a),a.lawNodeId&&this.residentStageExecutorAliases.set(a.lawNodeId,i),this.describeResidentStageExecutor(
i)}describeResidentStageExecutor(e){const r=this.getResidentStageExecutorRecord(e);return r?{schema:r.schema,stageId:r.stageId,
lawNodeId:r.lawNodeId,runtimeTarget:r.runtimeTarget,workerPolicy:mt(r.workerPolicy),metadata:mt(r.metadata||{}),registeredAt:r.
registeredAt}:null}getResidentStageExecutorRecord(e){const r=Y(typeof e=="string"?e:(e==null?void 0:e.id)??(e==null?void 0:
e.stageId),null),n=Y(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);if(r&&this.residentStageExecutors.has(r))return this.
residentStageExecutors.get(r);const i=n?this.residentStageExecutorAliases.get(n):null;return i?this.residentStageExecutors.
get(i):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(e)}listResidentStageExecutors(){return[
...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(e))}async executeResidentStage(e={}){
var i,o;const r=this.getResidentStageExecutorRecord(e.stage);if(!r){const s=Y(((i=e.stage)==null?void 0:i.id)??((o=e.stage)==
null?void 0:o.stageId),"unknown"),a=new Error(`[GPUHubManager] Missing resident stage executor: ${s}`);throw a.code="ERR\
_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",a.stage=e.stage||null,a}const n={...e,gpuHub:this,device:this.device,executor:this.
describeResidentStageExecutor(r.stageId)};return r.workerRunner?Kc(r.workerRunner,n):r.executor(n)}registerTask(e,r){this.
tasks.set(e,r)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const Ae="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-\
abl-GGUF",_e="5ce3fd841676adf2c1a10d7193637d46007e88f7",wr=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd44\
1111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"N\
OTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_X\
S.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,
gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5\
593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913\
dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.js\
on",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"\
5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9a\
e04fff09706ef"}],Wc="This catalog supports verified storage and distribution. Execution is admitted separately by the ma\
naged llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function rn(t){for(const e of Object.
values(t))e&&typeof e=="object"&&rn(e);return Object.freeze(t)}const Xc=rn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.\
8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ae,revision:_e,status:"storage-only",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Wc},
license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ae}/blob/${_e}/LICENSE`,notice:"Preserve upstream LICENSE\
, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ae,revision:_e,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${Ae}/blob/${_e}/README.md`,sourceManifestPath:"artifact-manifest.json"},
model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:[
"IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ae,revision:_e},weightBytes:14199740480,totalBytes:wr.reduce((t,e)=>t+
e.size,0),files:wr}});function nn(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(nn),Object.
freeze(t)),t}const Jc=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental \
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
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],Zc=nn(Object.fromEntries(
Jc.map(t=>{const{dtype:e,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=t,a=o.files.find(f=>f.path==="LICENSE").source;
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
revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.files.reduce((f,h)=>f+h.size,0)}]})));function qt(t){return t&&
typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(qt),Object.freeze(t)),t}const ne="Tsotchke-Corporatio\
n",on=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
text)",repository:`${ne}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",
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
en3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${ne}\
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
 Q4_K GGUF, candidate text)",repository:`${ne}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd\
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
06e0df3640f9ae04fff09706ef"}]}],Yc=qt(Object.fromEntries(on.map(t=>{const{architecture:e,quantizationTypes:r,sourceModel:n,
publisherLimitations:i,...o}=t;return[t.id,{...o,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${t.repository}\
/blob/${t.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:t.repository,revision:t.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${t.repository}/blob/${t.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:n,
publisherLimitations:i,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:r,modalities:["text"],requiredFeatures:["shader-f16"],repository:t.repository,
revision:t.revision},weightBytes:t.files.filter(s=>s.path.endsWith(".gguf")).reduce((s,a)=>s+a.size,0),totalBytes:t.files.
reduce((s,a)=>s+a.size,0)}]})));qt({organization:ne,sourceUrl:`https://huggingface.co/${ne}`,checkedAt:"2026-11-04",repositories:[
...on.map(({id:t,repository:e,revision:r})=>({repository:e,revision:r,catalogId:t,format:"GGUF",codecRequired:!1})),{repository:`${ne}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${ne}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${ne}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${ne}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Ce="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ie="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",wt=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],zt=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function sn(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(sn),Object.freeze(t)),t}const ed=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
en3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71\
149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"a5\
ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f21f\
a8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"\
mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",path:"README.md"}},{path:"LICE\
NSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848\
ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"c1899de289a04d12100db370d81485cdf75e47ca",path:"\
LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.8B Abliterated (GGUF Q4_K_M, text)",repository:"\
xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",architecture:"qwen3_5",files:[
{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5e\
f067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"\
15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef0731\
75dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d\
87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.\
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:t,...e})=>[e.id,sn({...e,
status:"execution-candidate",format:"GGUF",capabilities:zt,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:t,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((r,n)=>r+n.size,0)})])),Ld=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Ce,revision:Ie,status:"ex\
ecution-candidate",format:"GGUF",capabilities:zt,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ce}/blob\
/${Ie}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Ce,
revision:Ie,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ce}/blob/${Ie}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Ce,revision:Ie},weightBytes:wt[0].size,totalBytes:wt.reduce((t,e)=>t+e.size,0),files:wt},
...ed,...Zc,...Yc,...Object.fromEntries(Object.entries(Xc).map(([t,e])=>[t,{...e,status:"execution-candidate",capabilities:zt}]))}),
tt=1024**3,le=Object.freeze({maximumBytes:8*tt,maximumFileBytes:2*tt-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*
1024**2}),an=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),td=["qwen2","qwen3","llama"],gr=["phi","phi3","gemma","gem\
ma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2","nemotron_h"],yr=["idefics3","smolvlm","qwe\
n3_5"],rd=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","phi3","phi2","granite","starcoder2","olmo","olmo2",
"stablelm","nemotron","smollm3"],cn=Object.freeze([...[...td,...gr,...yr].map(t=>{const e=yr.includes(t);return Object.freeze(
{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:t,task:e?"image-text-to-text":"text-generation",qualification:"\
candidate",modalities:Object.freeze(e?["text","image"]:["text"]),modules:Object.freeze(e?["embed_tokens","vision_encoder",
"decoder_model_merged"]:["model"]),dtypes:t==="qwen3_5"?Object.freeze(["q4"]):an,requiresMemoryProfile:gr.includes(t),contextTokens:2048,
maximumBytes:e?t==="qwen3_5"?2*tt:le.legacyMaximumBytes:le.maximumBytes,maximumFileBytes:le.maximumFileBytes})}),...rd.map(
t=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,modelArchitecture:t==="qwen35"?"qwen3_5":t,task:"\
text-generation",modalities:Object.freeze(["text"]),qualification:"candidate"}))]);function jt(t,e){return cn.find(r=>r.
runtime===t&&r.architecture===e)??null}function qd(t){return cn.filter(e=>e.runtime===t)}function nd(t){const e=typeof t==
"string"?[t]:t&&typeof t=="object"&&!Array.isArray(t)?Object.values(t):[];if(!e.length||e.length>16||e.some(r=>!an.includes(
r)))throw new Error("Unsupported ONNX precision");return e}function dn(t){const e=(t==null?void 0:t["transformers.js_con\
fig"])??{},r=e.device_config??{};return Object.hasOwn(r,"webgpu")?{...e,...r.webgpu}:{...e}}function id(t,e={}){const r=nd(
t),n=dn(e).kv_cache_dtype;return r.some(o=>["fp16","q4f16"].includes(o)||(typeof n=="string"?n:n==null?void 0:n[o])==="f\
loat16")?["shader-f16"]:[]}function K(t,e,r=1048576,n=1){if(!Number.isSafeInteger(t)||t<n||t>r)throw new Error(`Invalid \
model memory dimension: ${e}`);return t}function od(t){const e=dn(t).free_dimension_overrides;if(e&&(typeof e!="object"||
Array.isArray(e)||Object.keys(e).length))throw new Error("Dynamic ONNX free_dimension_overrides are not admitted by this\
 memory profile");const r=t==null?void 0:t.model_type,n=jt("transformers.js",r);if(!n)throw new Error("Unsupported model\
 memory architecture");const i=n.task==="image-text-to-text"?t.text_config??t:t,o=i.layer_types??i.layers_block_type,s=K(
i.num_hidden_layers??(o==null?void 0:o.length),"layers",512),a=K(i.hidden_size,"hidden size",65536),f=K(i.num_attention_heads,
"attention heads",1024),h=K(i.num_key_value_heads??f,"KV heads",1024),w=K(i.head_dim??a/f,"head dimension",4096),p=K(i.vocab_size??
t.vocab_size,"vocabulary");if(o!==void 0&&(!Array.isArray(o)||o.length!==s||o.some(A=>!["attention","mamba","mlp","moe",
"full_attention","sliding_attention","linear_attention"].includes(A))))throw new Error("Invalid model memory layer types");
let u=s,v=0,b=0,C=0,y=0,c=0,d=0;if(r==="nemotron_h"){if(!o)throw new Error("Nemotron requires explicit recurrent layer t\
ypes");if(u=o.filter(m=>m==="attention").length,v=o.filter(m=>m==="mamba").length,o.some(m=>!["attention","mamba","mlp",
"moe"].includes(m)))throw new Error("Unsupported Nemotron layer type");y=K(i.mamba_num_heads,"SSM heads",1024),c=K(i.mamba_head_dim,
"SSM head dimension",4096),d=K(i.ssm_state_size,"SSM state size",4096);const A=K(i.n_groups,"SSM groups",1024);C=K(i.conv_kernel,
"convolution kernel",256),b=K(y*c+2*A*d,"convolution channels")}return ct({schema:"peercompute.onnx.memory.v1",architecture:r,
layers:s,hiddenSize:a,heads:f,kvHeads:h,headDim:w,vocabulary:p,attentionLayers:u,recurrentLayers:v,convChannels:b,convKernel:C,
ssmHeads:y,ssmHeadDim:c,stateSize:d})}function ct(t){const e=["schema","architecture","layers","hiddenSize","heads","kvH\
eads","headDim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","st\
ateSize"];if(!t||t.schema!=="peercompute.onnx.memory.v1"||!jt("transformers.js",t.architecture)||Object.keys(t).some(n=>!e.
includes(n)))throw new Error("Invalid model memory profile");for(const n of e.slice(2))K(t[n],n,1048576,["attentionLayer\
s","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(t.layers>512||
t.attentionLayers+t.recurrentLayers>t.layers||t.kvHeads>t.heads||t.architecture!=="nemotron_h"&&t.recurrentLayers)throw new Error(
"Invalid model memory layer geometry");const r=2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*
t.ssmHeadDim*t.stateSize+t.convChannels*t.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*tt)throw new Error("Model cac\
he/state exceeds its bounded memory envelope");return Object.fromEntries(e.map(n=>[n,t[n]]))}function sd(t){const e=ct(t);
return 2*(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*
e.convKernel)*4)}function fn(t,e){if((e==null?void 0:e.model_type)!==t.architecture)throw new Error("Model config archit\
ecture does not match its admitted manifest");if(e.auto_map&&Object.keys(e.auto_map).length)throw new Error("Custom mode\
l code is not admitted");if(t.memoryProfile&&JSON.stringify(ct(t.memoryProfile))!==JSON.stringify(od(e)))throw new Error(
"Model memory profile differs from its verified config");return id(t.dtype,e)}const Er="transformers.js",ln="4.3.2",z=Object.
freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:le.maximumBytes,maxFileBytes:le.maximumFileBytes,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),ad=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:z.maxFileBytes,
minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),un=Object.freeze({maxModelBytes:z.
maxModelBytes,maxFileBytes:z.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:z.maxImagePixels}),
cd=Object.freeze({...un,maxModelBytes:le.legacyMaximumBytes});function hn(t,{files:e,totalBytes:r,config:n}={}){const i=(t==
null?void 0:t.architecture)==="qwen3_5"?ad:["idefics3","smolvlm"].includes(t==null?void 0:t.architecture)?cd:un;if(n&&fn(
t,n),e){r=0;for(const h of e){if(!Number.isSafeInteger(h.size)||h.size<0)throw new Error("Invalid model file size");if(h.
size>z.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONNX file must be sm\
aller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=h.size}}if(r!==void 0&&(!Number.isSafeInteger(r)||r<0||r>i.maxModelBytes))
throw Object.assign(new Error(`Model exceeds its admitted file budget of ${i.maxModelBytes/1024**3} GiB`),{code:"ERR_MOD\
EL_PACKAGE_TOO_LARGE"});const o=(t==null?void 0:t.memoryProfile)&&ct(t.memoryProfile);if(o&&o.architecture!==t.architecture)
throw new Error("Model memory architecture mismatch");if(!o&&!(r>le.legacyMaximumBytes))return i;const s=r??0,a=o?sd(o):
0,f=1024**3;return{...i,minimumCpuBytes:Math.max(i.minimumCpuBytes,2*s+2*f+a),minimumGpuBytes:Math.max(i.minimumGpuBytes,
2*s+f+a),cacheBytes:a}}function Tt(t="Operation cancelled"){return(t==null?void 0:t.name)==="AbortError"?t:new DOMException(
typeof t=="string"?t:"Operation cancelled","AbortError")}function F(t){if(t!=null&&t.aborted)throw Tt(t.reason)}function Ge(t){
if(typeof t!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(t))throw new Error("Invalid model session ID");return t}function rt(t){
if(typeof t!="string"||!t||new TextEncoder().encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("\
/")||t.split("/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return t}function dd(t){
let e;try{e=JSON.stringify(t)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>
z.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(e);if(r.schema!=="pe\
ercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>z.maxFiles)throw new Error("In\
valid model manifest files");const n=new Set,i=hn(r.model,{files:r.files});let o=0;for(const p of r.files){if(rt(p.path),
n.has(p.path))throw new Error("Duplicate model artifact path");n.add(p.path);const u=$.parse(p.cid);if(![85,112].includes(
u.code)||u.multihash.code!==18||u.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(
p.size)||p.size<0||!/^[a-f0-9]{64}$/i.test(p.sha256??""))throw new Error("Invalid model file size/digest");if(p.sha256=p.
sha256.toLowerCase(),o+=p.size,!Number.isSafeInteger(o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted f\
ile budget")}const s=r.model,a=jt(Er,s==null?void 0:s.architecture);if((s==null?void 0:s.runtime)!==Er||s.runtimeVersion!==
ln||!a)throw new Error("Model runtime, architecture or dtype is not approved");if(s.task??(s.task=a.task),s.task!==a.task)
throw new Error("Model task does not match its admitted architecture");if((a.requiresMemoryProfile||a.task==="text-gener\
ation"&&o>le.legacyMaximumBytes)&&!s.memoryProfile)throw new Error("This model requires a verified config memory profile");
const f=typeof s.dtype=="string"?[["model",s.dtype]]:s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(
s.dtype):[];if(!f.length||f.length>16||f.some(([p,u])=>!/^[A-Za-z0-9_-]{1,100}$/.test(p)||!["fp32","fp16","q4","q4f16","\
q8"].includes(u)))throw new Error("Invalid model dtype configuration");if(s.architecture==="qwen3_5"&&f.some(([,p])=>p!==
"q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const h=p=>p==="fp32"?"":p==="q8"?"_quantized":`_${p}`,
w=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&w.
push(...f.map(([p,u])=>`onnx/${p}${h(u)}.onnx`)),s.task==="image-text-to-text")for(const p of["embed_tokens","vision_enc\
oder","decoder_model_merged"]){const u=typeof s.dtype=="string"?s.dtype:s.dtype[p];if(!u)throw new Error("Multimodal dty\
pe configuration is missing a module");w.push(`onnx/${p}${h(u)}.onnx`),s.architecture==="qwen3_5"&&w.push(`onnx/${p}${h(
u)}.onnx_data`)}if(w.some(p=>!n.has(p)))throw new Error("Incomplete model package");if(s.task==="image-text-to-text"&&!n.
has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor configuration is \
missing");if(s.requiredFeatures!==void 0&&(!Array.isArray(s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.
some(p=>typeof p!="string"||p.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}
function fd(t,e){const r=new URL(e),n={};for(const i of["mjs","wasm"]){if(typeof(t==null?void 0:t[i])!="string")throw new Error(
"Trusted ORT runtime assets are required");const o=new URL(t[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||
!["http:","https:"].includes(o.protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved sam\
e-origin runtime files");n[i]=o.href}return n}const ld="peercompute.model-artifact-read.v1",Qt=ld;function pn(t,e){var n;
const r=i=>e(i.data);return t.addEventListener("message",r),(n=t.start)==null||n.call(t),()=>t.removeEventListener("mess\
age",r)}function H(t,e,r=[]){t.postMessage({protocol:Qt,...e},r)}function jd(t,{store:e,manifest:r,chunkBytes:n=z.chunkBytes,
maxReads:i=z.maxReads}={}){if(!(e!=null&&e.stat)||!(e!=null&&e.openRead))throw new Error("A verified artifact store is r\
equired");if(!Number.isInteger(n)||n<1||n>z.chunkBytes||!Number.isInteger(i)||i<1||i>z.maxReads)throw new Error("Invalid\
 artifact bridge bounds");const o=new Map(r.files.map(u=>[rt(u.path),u])),s=new Map;let a=!1,f=0;async function h(u,v){var C,
y;const b=s.get(u);if(b){s.delete(u),b.controller.abort(v);try{await((y=(C=b.iterator)==null?void 0:C.return)==null?void 0:
y.call(C))}catch{}}}async function w(u){var b,C;if(a||(u==null?void 0:u.protocol)!==Qt||typeof u.id!="string"||u.id.length>
128)return;const{id:v}=u;try{if(u.type==="cancel"){await h(v,"Reader cancelled");return}if(u.type==="open"){if(s.has(v))
throw new Error("Duplicate artifact reader");if(s.size>=i)throw new Error("Artifact reader limit reached");const m=o.get(
u.path);if(!m)throw new Error("Artifact path is not in the manifest");const x=u.offset??0,S=u.length??m.size-x;if(!Number.
isSafeInteger(x)||!Number.isSafeInteger(S)||x<0||S<0||x>m.size||S>m.size-x)throw new Error("Invalid artifact byte range");
const E={controller:new AbortController,remaining:S,pulling:!1};s.set(v,E);const g=await e.stat(m.cid);if(F(E.controller.
signal),a||s.get(v)!==E)return;if(!g||g.status!=="complete"||g.size!==m.size||g.sha256!==m.sha256)throw new Error("Model\
 artifact is incomplete or has a different size");const I=await e.openRead(m.cid,{offset:x,length:S,signal:E.controller.
signal});if(E.iterator=I[Symbol.asyncIterator](),a||E.controller.signal.aborted||s.get(v)!==E){await((C=(b=E.iterator).return)==
null?void 0:C.call(b));return}H(t,{type:"ready",id:v,size:S});return}if(u.type!=="pull")return;const y=s.get(v);if(!(y!=
null&&y.iterator)||y.pulling)throw new Error("Invalid artifact pull credit");y.pulling=!0;const c=await y.iterator.next();
if(a||y.controller.signal.aborted||s.get(v)!==y)return;if(c.done){if(y.remaining!==0)throw new Error("Truncated model ar\
tifact");s.delete(v),H(t,{type:"end",id:v});return}const d=c.value;if(!(d instanceof Uint8Array)||!d.byteLength||d.byteLength>
n||d.byteLength>y.remaining)throw new Error("Artifact chunk exceeds admitted bounds");y.remaining-=d.byteLength,y.pulling=
!1,f+=d.byteLength;const A=d.slice();H(t,{type:"chunk",id:v,bytes:A},[A.buffer])}catch(y){await h(v,y),a||H(t,{type:"err\
or",id:v,message:(y==null?void 0:y.message)||"Artifact read failed"})}}const p=pn(t,u=>{w(u)});return{getStats:()=>({activeReads:s.
size,deliveredBytes:f}),async close(){if(!a){a=!0;try{H(t,{type:"closed",message:"Artifact bridge closed"})}catch{}p(),await Promise.
all([...s.keys()].map(u=>h(u,"Artifact bridge closed"))),t.close()}}}}function ud(t,{manifest:e,baseUrl:r,signal:n,chunkBytes:i=z.
chunkBytes,maxReads:o=z.maxReads,maxQueuedReads:s=32}={}){if(!Number.isInteger(o)||o<1||o>z.maxReads||!Number.isInteger(
s)||s<0||s>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),f=new Map(e.files.map(c=>[rt(c.path),
c])),h=new Map,w=[];let p=0,u=!1;function v(){for(;!u&&h.size<o&&w.length;){const c=w.shift();h.set(c.id,c),c.active=!0,
H(t,{type:"open",id:c.id,path:c.path})}}function b(c,d){var m,x,S,E;h.delete(c.id);const A=w.indexOf(c);if(A>=0&&w.splice(
A,1),n==null||n.removeEventListener("abort",c.abort),(m=c.requestSignal)==null||m.removeEventListener("abort",c.abort),d){
(x=c.reject)==null||x.call(c,d);try{(S=c.streamController)==null||S.error(d)}catch{}}(E=c.resolvePull)==null||E.call(c),
v()}const C=pn(t,c=>{if((c==null?void 0:c.protocol)!==Qt)return;const d=h.get(c.id);if(d){if(c.type==="error"){b(d,new Error(
c.message));return}if(c.type==="ready"){if(d.ready||c.size!==d.file.size){b(d,new Error("Invalid artifact response size")),
H(t,{type:"cancel",id:d.id});return}d.ready=!0,H(t,{type:"pull",id:d.id})}else if(c.type==="chunk"){if(!d.ready||!d.resolvePull||
!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||c.bytes.byteLength>i||d.received+c.bytes.byteLength>d.file.size){
H(t,{type:"cancel",id:d.id}),b(d,new Error("Invalid artifact chunk"));return}d.received+=c.bytes.byteLength,d.streamController.
enqueue(c.bytes);const A=d.resolvePull;d.resolvePull=null,A()}else c.type==="end"&&(!d.ready||d.received!==d.file.size?b(
d,new Error("Truncated artifact response")):(d.streamController.close(),b(d)))}});async function y(c,d={}){if(u)throw new Error(
"Artifact bridge is closed");if(F(n),F(d.signal),d.method&&d.method!=="GET")throw new Error("Model adapter supports GET \
only");const A=String(c);if(/[\\]/.test(A)||/%(?:2e|2f|5c|00)/i.test(A)||/\/(?:\.|\.\.)(?:\/|$)/.test(A))throw new Error(
"Invalid artifact URL");const m=new URL(A,a);if(m.origin!==a.origin||m.username||m.password||m.search||m.hash||!m.pathname.
startsWith(a.pathname))throw new Error("Model path is outside its manifest");const x=rt(decodeURIComponent(m.pathname.slice(
a.pathname.length))),S=f.get(x);if(!S)return new Response("Artifact path is not in the manifest",{status:404});const E=`\
read-${++p}`,g={id:E,path:x,file:S,requestSignal:d.signal,received:0,ready:!1,active:!1,queued:!1};g.abort=()=>{var _;g.
active&&H(t,{type:"cancel",id:E}),b(g,Tt((n==null?void 0:n.reason)??((_=d.signal)==null?void 0:_.reason)))};const I=new ReadableStream(
{start(_){g.streamController=_},pull(){if(u)throw new Error("Artifact bridge is closed");if(F(n),F(d.signal),!g.active&&
!g.queued&&h.size>=o&&w.length>=s)throw new Error("Artifact reader limit reached");return new Promise(_=>{var B;g.resolvePull=
_,g.ready?H(t,{type:"pull",id:E}):g.queued||(g.queued=!0,n==null||n.addEventListener("abort",g.abort,{once:!0}),(B=d.signal)==
null||B.addEventListener("abort",g.abort,{once:!0}),w.push(g),v())})},cancel(){g.active&&H(t,{type:"cancel",id:E}),b(g)}},
{highWaterMark:0});return new Response(I,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:y,close(c="Artifact bridge closed"){if(!u){u=!0;for(const d of[...h.values(),...w])d.active&&
H(t,{type:"cancel",id:d.id}),b(d,Tt(c));C(),t.close()}}}}const je=t=>new TextEncoder().encode(t).byteLength;function hd(){
if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a \
ComputeManager-owned worker")}function bn(t){if(t==null)return null;if(!Number.isSafeInteger(t.width)||!Number.isSafeInteger(
t.height)||t.width<1||t.height<1||t.width*t.height>z.maxImagePixels||t.channels!==4||!(t.data instanceof Uint8Array||t.data instanceof
Uint8ClampedArray)||t.data.byteLength!==t.width*t.height*4||t.data.byteLength>z.maxImageBytes)throw new Error("Image mus\
t contain bounded RGBA pixels; image URLs and encoded files are not accepted");return t}function mn(t){const e=t.messages??
(typeof t.prompt=="string"?[{role:"user",content:t.prompt}]:null);if(!Array.isArray(e)||!e.length||e.length>z.maxMessages)
throw new Error("Invalid inference messages");let r=0;return e.map(n=>{if(!n||!["system","user","assistant"].includes(n.
role)||typeof n.content!="string")throw new Error("Only text message content is accepted");if(r+=je(n.content),r>z.maxPromptBytes)
throw new Error("Prompt exceeds its byte budget");return{role:n.role,content:n.content}})}async function wn(t){var n;if(!t)
return;let e;const r=new Set;for(const i of[t.model,t.processor,t.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.
dispose)==null?void 0:n.call(i))}catch(o){e??(e=o)}}if(e)throw e}function kt(t,e=new Set){if(!(!t||typeof t!="object"||e.
has(t))){if(e.add(t),typeof t.dispose=="function"){t.dispose();return}for(const r of Object.values(t))kt(r,e)}}function pd(t){
const e=t.findIndex(n=>n.role==="user");if(e<0)return null;const r=t.findIndex((n,i)=>i>e&&n.role==="user");return r<0?null:
t.filter((n,i)=>i<e||i>=r||n.role==="system")}function bd(t,e,r){const n={...t.config};for(const a of["decoder","generat\
or","text_config"])Object.assign(n,n[a]);Object.assign(n,t.generation_config);const i=Array.isArray(n.eos_token_id)?n.eos_token_id:
[n.eos_token_id],o=e.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===
BigInt(o))?"stop":e.length>=r?"length":"unknown"}function Z(t,e,r){const n=t==="out-of-memory"?"GPU out of memory. Close\
 GPU-heavy apps or unload other models, then reload this model.":`GPU ${t}: ${String((e==null?void 0:e.message)??e??"ope\
ration failed").slice(0,240)}`,i=new Error(`Model session lost: ${r} ${n}`,{cause:e});return i.code=t==="out-of-memory"?
"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",i}function md(t){let e,r,n=!1;const i=a=>{var f;n||(t.lost=!0,(!t.gpuFailure||
a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(t.gpuFailure=a),(f=t.active)==null||f.abort(a))},o=({error:a})=>{var f;return i(
Z(((f=a==null?void 0:a.constructor)==null?void 0:f.name)==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",a,(r==
null?void 0:r.stage)??"resident model"))},s=()=>{if(!(!r||r.device)){r.device=e;for(const a of["validation","out-of-memo\
ry","internal"])e.pushErrorScope(a),r.filters.push(a)}};return{attach(a){var f,h;if(e&&e!==a)throw Z("device changed",null,
"load");if(!e){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!="function"||typeof((f=a.queue)==null?
void 0:f.onSubmittedWorkDone)!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!="functio\
n"||typeof a.destroy!="function"||typeof((h=a.lost)==null?void 0:h.then)!="function")throw Z("device unavailable",null,"\
load");e=a,t.runtimeDevice=e,e.addEventListener("uncapturederror",o),e.lost.then(w=>i(Z("device lost",w,(r==null?void 0:
r.stage)??"resident model")),w=>i(Z("device lost",w,(r==null?void 0:r.stage)??"resident model")))}try{s()}catch(w){const p=Z(
"error scope failure",w,(r==null?void 0:r.stage)??"load");throw i(p),p}},async run(a,f){if(t.lost)throw t.gpuFailure??Z(
"device lost",null,a);if(r)throw new Error("Overlapping model GPU operations are not allowed");const h={stage:a,filters:[],
device:null};r=h;let w,p;try{if(e&&this.attach(e),w=await f(),!e)throw Z("device unavailable",null,a)}catch(b){p=b}if(e)
try{await e.queue.onSubmittedWorkDone()}catch(b){i(Z("queue failure",b,a))}const u=await Promise.all(h.filters.reverse().
map(async b=>{try{return{filter:b,error:await h.device.popErrorScope()}}catch(C){return{filter:b,error:C,scopeFailed:!0}}}));
r=null;for(const b of u)b.scopeFailed&&i(Z("error scope failure",b.error,a));const v=["out-of-memory","internal","valida\
tion"].map(b=>u.find(C=>C.filter===b&&C.error&&!C.scopeFailed)).find(Boolean);if(v&&i(Z(v.filter,v.error,a)),p instanceof
WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((p==null?void 0:p.message)??"")){const b=new Error("Model \
session lost: native inference runtime failed",{cause:p});b.code="ERR_MODEL_RUNTIME",i(b)}if(typeof(p==null?void 0:p.code)==
"string"&&p.code.startsWith("ERR_MODEL_GPU")&&i(p),t.gpuFailure)throw t.gpuFailure;if(p)throw p;return w},dispose(){n=!0,
e==null||e.removeEventListener("uncapturederror",o)}}}function wd(t){var i;const e=["maxBindGroups","maxComputeWorkgroup\
StorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBuff\
erSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSi\
zeZ"],r={};for(const o of e){const s=(i=t.limits)==null?void 0:i[o];if(!Number.isSafeInteger(s)||s<=0)throw new Error(`W\
ebGPU adapter has an invalid ${o} limit`);r[o]=s}const n=["chromium-experimental-subgroup-matrix","timestamp-query","sha\
der-f16","subgroups","subgroup-size-control"].filter(o=>t.features.has(o));return{requiredLimits:r,requiredFeatures:n}}async function vr(t){
var e,r,n;await wn(t.components),(e=t.restoreGpuEvidence)==null||e.call(t),(r=t.gpuGuard)==null||r.dispose(),(n=t.ownedDevice)==
null||n.destroy(),t.ownedDevice=null}async function gd({library:t,modelPath:e,options:r,manifest:n,adapterFeatures:i=[]}){
const o={};try{const s=await t.AutoConfig.from_pretrained(e,r),a=fn(n.model,s);for(const h of a)if(!i.includes(h))throw new Error(
`Model config requires unsupported GPU feature: ${h}`);const f={...r,config:s};if(n.model.architecture==="qwen3_5"&&(f.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await t.AutoProcessor.from_pretrained(e,r),n.model.architecture===
"qwen3_5"){const h=o.processor.image_processor;if(!h)throw new Error("Qwen3.5 image processor is unavailable");h.min_pixels=
256*256,h.max_pixels=hn(n.model).maxProcessedImagePixels,h.do_normalize??(h.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await t.AutoModelForImageTextToText.from_pretrained(e,f)}else o.tokenizer=await t.AutoTokenizer.from_pretrained(
e,r),o.model=await t.AutoModelForCausalLM.from_pretrained(e,f);return o}catch(s){throw await wn(o),s}}function xr(t){return{
sessionId:t.sessionId,manifestCid:t.manifestCid,status:t.lost?"lost":t.status,task:t.manifest.model.task,dtype:t.manifest.
model.dtype,workerId:t.workerId,adapter:t.adapter,runtimeAdapter:t.runtimeAdapter??null,gpuDispatches:t.gpuDispatches??0,
gpuSubmissions:t.gpuSubmissions??0,gpuProfileSamples:t.gpuProfileSamples??0,collectGpuEvidence:t.collectGpuEvidence===!0,
runtimeFeatures:t.runtimeFeatures??[],generatedRequests:t.generatedRequests}}function gn({loadLibrary:t=()=>_n(()=>import("./transformers.web-Dn8CClj3.js"),
[],import.meta.url),loadModel:e=gd,gpu:r=(o=>(o=globalThis.navigator)==null?void 0:o.gpu)(),baseUrl:n=(s=>(s=
globalThis.location)==null?void 0:s.href)(),assertWorker:i=hd}={}){const a=new Map;let f;async function h(p,u){var d,A,m,
x,S,E;if(a.size)throw new Error("This inference worker already has a resident/loading model");const v=Ge(p.sessionId),{manifest:b}=dd(
p.manifest),C=fd(p.runtimeAssets,n);if(!((d=p.artifactPort)!=null&&d.postMessage))throw new Error("An artifact reader po\
rt is required");F(u.signal);const y={sessionId:v,manifest:b,manifestCid:p.manifestCid,status:"loading",workerId:u.workerId??
null,generatedRequests:0,components:null};a.set(v,y);let c;try{const g=await(r==null?void 0:r.requestAdapter({powerPreference:"\
high-performance"}));if(F(u.signal),!g||(A=g.info)!=null&&A.isFallbackAdapter||g.isFallbackAdapter)throw new Error("A ha\
rdware WebGPU adapter is required; CPU/software fallback is disabled");const I=typeof b.model.dtype=="string"?[b.model.dtype]:
Object.values(b.model.dtype),_=new Set(b.model.requiredFeatures??[]);I.some(U=>["fp16","q4f16"].includes(U))&&_.add("sha\
der-f16");for(const U of _)if(!g.features.has(U))throw new Error(`Model requires unsupported GPU feature: ${U}`);y.adapter=
{vendor:((m=g.info)==null?void 0:m.vendor)??"",architecture:((x=g.info)==null?void 0:x.architecture)??"",isFallbackAdapter:!1,
requiredFeatures:[..._]};const B=await(f??(f=t()));if(F(u.signal),B.env.version!==ln)throw new Error("Unexpected Transfo\
rmers runtime version");const M=new URL("/__peercompute_models/",n);c=ud(p.artifactPort,{manifest:b,baseUrl:new URL(`${v}\
/`,M).href,signal:u.signal});const{env:O}=B;O.logLevel=50,O.allowLocalModels=!0,O.allowRemoteModels=!1,O.localModelPath=
M.pathname,O.useBrowserCache=!1,O.useFSCache=!1,O.useWasmCache=!1,O.fetch=async(...U)=>{var D;try{return await c.fetch(...U)}catch(k){
throw(D=u.emitProgress)==null||D.call(u,{type:"artifact-read-error",sessionId:v,message:k.message}),k}},O.backends.onnx.
wasm.proxy=!1,O.backends.onnx.wasm.numThreads=1,O.backends.onnx.wasm.wasmPaths=C,y.gpuDispatches=0,y.gpuProfileSamples=0,
y.gpuSubmissions=0,y.collectGpuEvidence=p.collectGpuEvidence===!0,O.backends.onnx.webgpu&&(O.backends.onnx.webgpu.profiling=
{mode:p.collectGpuEvidence===!0?"default":"off",ondata:()=>{y.gpuProfileSamples+=1}});const ge={local_files_only:!0,device:"\
webgpu",dtype:b.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:U=>{var D,k;(D=u.signal)!=
null&&D.aborted||(k=u.emitProgress)==null||k.call(u,{type:"model-load",sessionId:v,status:String(U.status??"").slice(0,40),
file:typeof U.file=="string"?U.file.slice(0,512):void 0,loaded:Number.isFinite(U.loaded)?U.loaded:void 0,total:Number.isFinite(
U.total)?U.total:void 0})}};y.library=B,y.gpuGuard=md(y),await y.gpuGuard.run("load",async()=>{const U=O.backends.onnx.webgpu;
if(!U)throw new Error("The WebGPU runtime is unavailable");U.adapter=g,y.ownedDevice=await g.requestDevice(wd(g)),y.gpuGuard.
attach(y.ownedDevice),ge.session_options.executionProviders=[{name:"webgpu",device:y.ownedDevice}],y.components=await e(
{library:B,modelPath:v,options:ge,manifest:b,adapterFeatures:[...g.features]});for(const D of _)if(!y.runtimeDevice.features.
has(D))throw new Error(`ORT device is missing required GPU feature: ${D}`);F(u.signal)});const T=y.runtimeDevice;if(y.runtimeFeatures=
[...(T==null?void 0:T.features)??[]],y.collectGpuEvidence&&T){const U=T.createCommandEncoder.bind(T),D=T.queue.submit.bind(
T.queue),k=Object.getOwnPropertyDescriptor(T,"createCommandEncoder"),Q=Object.getOwnPropertyDescriptor(T.queue,"submit");
y.restoreGpuEvidence=()=>{k?Object.defineProperty(T,"createCommandEncoder",k):delete T.createCommandEncoder,Q?Object.defineProperty(
T.queue,"submit",Q):delete T.queue.submit,y.restoreGpuEvidence=null},T.createCommandEncoder=(...ye)=>{const W=U(...ye),Ee=W.
beginComputePass.bind(W);return W.beginComputePass=(...De)=>{const X=Ee(...De);for(const ee of["dispatchWorkgroups","dis\
patchWorkgroupsIndirect"]){const ae=X[ee].bind(X);X[ee]=(...dt)=>{const te=ae(...dt);return y.gpuDispatches+=1,te}}return X},
W},T.queue.submit=(...ye)=>{const W=D(...ye);return y.gpuSubmissions+=1,W}}const se=(T==null?void 0:T.adapterInfo)??((E=
(S=O.backends.onnx.webgpu)==null?void 0:S.adapter)==null?void 0:E.info);if(se){if(se.isFallbackAdapter)throw new Error("\
ORT selected a software GPU adapter");y.runtimeAdapter={vendor:se.vendor,architecture:se.architecture,isFallbackAdapter:se.
isFallbackAdapter??!1}}if(F(u.signal),y.lost)throw y.gpuFailure;return y.status="ready",xr(y)}catch(g){try{await vr(y),a.
delete(v)}catch(I){y.status="ready",y.lost=!0;const _=new Error(`MODEL_DISPOSE_FAILED: ${I.message}`);throw _.code="MODE\
L_DISPOSE_FAILED",_}throw g}finally{c==null||c.close(),c||p.artifactPort.close()}}async function w(p,u){var O,ge,T,se;const v=a.
get(Ge(p.sessionId));if(!v||v.lost)throw new Error("Model session lost or not loaded");if(v.status!=="ready")throw new Error(
"Model session is busy");const b=Ge(p.requestId),C=p.maxNewTokens??z.maxNewTokens;if(!Number.isInteger(C)||C<1||C>z.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let y=mn(p);const c=bn(p.image);if(c&&v.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");F(u.signal);const d=new AbortController,A=new v.
library.InterruptableStoppingCriteria,m=()=>{var U;d.abort((U=u.signal)==null?void 0:U.reason),A.interrupt()};(O=u.signal)==
null||O.addEventListener("abort",m,{once:!0}),d.signal.addEventListener("abort",()=>A.interrupt(),{once:!0}),v.active=d,
v.requestId=b,v.status="generating";let x,S,E=0,g=0,I,_=!1;const B=v.gpuDispatches??0,M=v.gpuSubmissions??0;try{F(u.signal);
const{tokenizer:U,processor:D,model:k}=v.components;let Q;for(;;){F(d.signal);let X=y;if(D&&(X=y.map(te=>({role:te.role,
content:[{type:"text",text:te.content}]})),c)){const te=X.findLast(yn=>yn.role==="user");if(!te)throw new Error("An imag\
e requires a user message");te.content.unshift({type:"image"})}const ee=(D??U).apply_chat_template(X,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof ee!="string"||je(ee)>z.maxPromptBytes)throw new Error("Templated prompt exceeds its byte \
budget");if(c){const te=new v.library.RawImage(c.data,c.width,c.height,c.channels);x=await D(ee,te,{do_image_splitting:!1})}else
x=await U(ee,{truncation:!1,padding:!1});if(F(d.signal),Q=(T=(ge=x.input_ids)==null?void 0:ge.dims)==null?void 0:T.at(-1),
!Number.isSafeInteger(Q)||Q<1)throw new Error("Invalid model input token count");if(Q+C<=z.maxContextTokens)break;const ae=pd(
y);if(!ae)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or \
request fewer output tokens");const dt=x;x=void 0,kt(dt),y=ae,_=!0}F(d.signal);const ye=new v.library.TextStreamer(U,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:X=>{var ee;if(!(d.signal.aborted||I)){if(g+=je(X),g>z.maxOutputBytes){I=new Error(
"Generated text exceeded its byte budget"),d.abort(I);return}try{if(((ee=u.emitProgress)==null?void 0:ee.call(u,{type:"t\
oken",sessionId:v.sessionId,requestId:b,sequence:E++,text:X}))===!1)throw new Error("Token consumer rejected output")}catch(ae){
I=ae,d.abort(ae)}}}});if(await v.gpuGuard.run("generation",async()=>{S=await k.generate({...x,max_new_tokens:C,do_sample:!1,
streamer:ye,stopping_criteria:[A]})}),I)throw I;if(v.lost)throw v.gpuFailure;F(d.signal);const W=S.tolist();if(W.length!==
1||W[0].length<Q||W[0].length>Q+C)throw new Error("Model returned an over-budget token sequence");const Ee=W[0].slice(Q),
De=U.decode(Ee,{skip_special_tokens:!0});if(je(De)>z.maxOutputBytes)throw new Error("Generated text exceeds its byte bud\
get");return v.generatedRequests+=1,{sessionId:v.sessionId,requestId:b,text:De,inputTokens:Q,outputTokens:Ee.length,finishReason:bd(
k,Ee,C),contextTruncated:_,workerId:v.workerId,gpuDispatches:(v.gpuDispatches??0)-B,gpuSubmissions:(v.gpuSubmissions??0)-
M,gpuProfileSamples:v.gpuProfileSamples??0}}catch(U){throw v.gpuFailure??U}finally{(se=u.signal)==null||se.removeEventListener(
"abort",m);try{const U=new Set;let D;for(const k of[x,S])try{kt(k,U)}catch(Q){D??(D=Q)}if(D){v.lost=!0;const k=v.gpuFailure??
new Error("Model session lost: tensor cleanup failed",{cause:D});throw k.code??(k.code="MODEL_DISPOSE_FAILED"),v.gpuFailure=
k,k}}finally{v.active=null,v.requestId=null,v.status="ready"}}}return async function(u={},v={}){var C;if(i(),u.command===
"load")return h(u,v);if(u.command==="generate")return w(u,v);const b=a.get(Ge(u.sessionId));if(u.command==="status")return b?
xr(b):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return(b==null?void 0:b.requestId)===u.requestId&&
((C=b.active)==null||C.abort("Generation cancelled")),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="u\
nload"){if(!b)return{sessionId:u.sessionId,status:"absent"};if(b.status!=="ready")throw new Error("Cancel and await acti\
ve model work before unloading");b.status="unloading";try{await vr(b)}catch(y){b.status="ready",b.lost=!0;const c=new Error(
`MODEL_DISPOSE_FAILED: ${y.message}`);throw c.code="MODEL_DISPOSE_FAILED",c}return a.delete(u.sessionId),{sessionId:u.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const yd=gn(),Ed=(t,e)=>yd(t,e),Qd=Object.freeze(Object.
defineProperty({__proto__:null,createModelTaskRuntime:gn,handleModelTask:Ed,normalizeModelMessages:mn,validateImageInput:bn},
Symbol.toStringTag,{value:"Module"})),vd=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...vd,"co\
mpute_probabilities"]);let pe=null,Sr=null;async function Vd(){if(pe)return pe;try{return Sr=new Hc({frameBudgetMs:6}),pe=
await Sr.initialize(),pe}catch(t){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",t);
const{device:e}=await xn();return pe=e,pe}}export{ld as A,$ as C,Ld as G,z as M,le as O,_n as _,dd as a,Ge as b,bn as c,Tt as d,fn as e,rt as f,Vd as g,Fd as h,ud as i,
qd as l,Qd as m,mn as n,jd as s,F as t,fd as v};
