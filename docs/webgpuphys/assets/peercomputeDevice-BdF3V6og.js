var Sn=Object.defineProperty;var _n=(t,e,r)=>e in t?Sn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var l=(t,e,r)=>_n(t,typeof e!="symbol"?e+"":e,r);import{i as An}from"./device-B4S7QtIr.js";const Cn="modulepreload",In=function(t,e){return new URL(t,e).href},Wt={},Bn=function(e,r,n){let i=Promise.resolve();if(r&&
r.length>0){let s=function(g){return Promise.all(g.map(h=>Promise.resolve(h).then(u=>({status:"fulfilled",value:u}),u=>({
status:"rejected",reason:u}))))};const a=document.getElementsByTagName("link"),f=document.querySelector("meta[property=c\
sp-nonce]"),p=(f==null?void 0:f.nonce)||(f==null?void 0:f.getAttribute("nonce"));i=s(r.map(g=>{if(g=In(g,n),g in Wt)return;
Wt[g]=!0;const h=g.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let _=a.length-1;_>=0;_--){const m=a[_];if(m.
href===g&&(!h||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${g}"]${u}`))return;const b=document.
createElement("link");if(b.rel=h?"stylesheet":Cn,h||(b.as="script"),b.crossOrigin="",b.href=g,p&&b.setAttribute("nonce",
p),document.head.appendChild(b),h)return new Promise((_,m)=>{b.addEventListener("load",_),b.addEventListener("error",()=>m(
new Error(`Unable to preload CSS for ${g}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});
if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="re\
jected"&&o(a.reason);return e().catch(o)})};class Un{constructor(){l(this,"index",0);l(this,"input","")}new(e){return this.
index=0,this.input=e,this}readAtomically(e){const r=this.index,n=e();return n===void 0&&(this.index=r),n}parseWith(e){const r=e();
if(this.index===this.input.length)return r}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){
if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const r=this.
readChar();if(r===e)return r})}readSeparator(e,r,n){return this.readAtomically(()=>{if(!(r>0&&this.readGivenChar(e)===void 0))
return n()})}readNumber(e,r,n,i){return this.readAtomically(()=>{let o=0,s=0;const a=this.peekChar();if(a===void 0)return;
const f=a==="0",p=2**(8*i)-1;for(;;){const g=this.readAtomically(()=>{const h=this.readChar();if(h===void 0)return;const u=Number.
parseInt(h,e);if(!Number.isNaN(u))return u});if(g===void 0)break;if(o*=e,o+=g,o>p||(s+=1,r!==void 0&&s>r))return}if(s!==
0)return!n&&f&&s>1?void 0:o})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let r=0;r<e.length;r++){
const n=this.readSeparator(".",r,()=>this.readNumber(10,3,!1,1));if(n===void 0)return;e[r]=n}return e})}readIPv6Addr(){const e=r=>{
for(let n=0;n<r.length/2;n++){const i=n*2;if(n<r.length-3){const s=this.readSeparator(":",n,()=>this.readIPv4Addr());if(s!==
void 0)return r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],r[i+3]=s[3],[i+4,!0]}const o=this.readSeparator(":",n,()=>this.readNumber(
16,4,!0,2));if(o===void 0)return[i,!1];r[i]=o>>8,r[i+1]=o&255}return[r.length,!1]};return this.readAtomically(()=>{const r=new Uint8Array(
16),[n,i]=e(r);if(n===16)return r;if(i||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const o=new Uint8Array(
14),s=16-(n+2),[a]=e(o.subarray(0,s));return r.set(o.subarray(0,a),16-a),r})}readIPAddr(){return this.readIPv4Addr()??this.
readIPv6Addr()}}const Tn=45,Mn=15,Qe=new Un;function zn(t){if(!(t.length>Mn))return Qe.new(t).parseWith(()=>Qe.readIPv4Addr())}
function kn(t){if(t.includes("%")&&(t=t.split("%")[0]),!(t.length>Tn))return Qe.new(t).parseWith(()=>Qe.readIPv6Addr())}
function Mr(t){return!!zn(t)}function $n(t){return!!kn(t)}function zr(t=0){return new Uint8Array(t)}function On(t){return(t==
null?void 0:t.buffer)instanceof ArrayBuffer}function Dn(t){if(On(t))return t;const e=t.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function kr(t,e){e==null&&(e=t.reduce((i,o)=>i+o.length,0));const r=zr(e);let n=0;for(const i of t)r.set(
i,n),n+=i.length;return Dn(r)}function Rn(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.
byteLength;r++)if(t[r]!==e[r])return!1;return!0}function Te(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Ar\
ray")return Me(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Me(new Uint8Array(
t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function Pn(t){const e=new Uint8Array(
t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const Ht=4096;function Nn(t){const e=t.length;if(e<=Ht)
return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Ht));
return r}function Gn(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function Me(t){return Gn(t)?t:t.slice()}function Fn(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<
t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var f=s.
toLowerCase().charCodeAt(0),p=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),p!==a&&(n[p]=o)}}var g=t.length,h=t.charAt(0),
u=Math.log(g)/Math.log(256),v=Math.log(256)/Math.log(g);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?
c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,w=0,x=c.length;w!==x&&c[w]===0;)w++,
d++;for(var S=(x-w)*v+1>>>0,E=new Uint8Array(S);w!==x;){for(var y=c[w],I=0,C=S-1;(y!==0||I<A)&&C!==-1;C--,I++)y+=256*E[C]>>>
0,E[C]=y%g>>>0,y=y/g>>>0;if(y!==0)throw new Error("Non-zero carry");A=I,w++}for(var B=S-A;B!==S&&E[B]===0;)B++;for(var T=h.
repeat(d);B<S;++B)T+=t.charAt(E[B]);return T}function _(c){if(typeof c!="string")throw new TypeError("Expected String");
if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,w=0;c[d]===h;)A++,d++;for(var x=(c.length-d)*u+
1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var y=0,I=x-1;(E!==0||y<w)&&I!==-1;I--,y++)
E+=g*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");w=y,d++}if(c[d]!==" "){for(var C=x-w;C!==
x&&S[C]===0;)C++;for(var B=new Uint8Array(A+(x-C)),T=A;C!==x;)B[T++]=S[C++];return B}}}function m(c){var d=_(c);if(d)return d;
throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:_,decode:m}}var Ln=Fn,qn=Ln;let jn=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Qn=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return $r(this,e)}},Vn=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return $r(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function $r(t,e){return new Vn({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let Kn=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new jn(e,r,n),this.decoder=new Qn(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function nt({name:t,prefix:e,encode:r,decode:n}){return new Kn(
t,e,r,n)}function ke({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=qn(r,t,n);return nt({prefix:e,
name:t,encode:i,decode:s=>Te(o(s))})}function Wn(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let p=0;p<i;++p){const g=e[t[p]];if(g===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|g,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Hn(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Xn(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function R({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Xn(n,i);return nt(
{prefix:e,name:t,encode(s){return Hn(s,n,r)},decode(s){return Wn(s,o,r,t)}})}const Jn=ke({prefix:"9",name:"base10",alphabet:"\
0123456789"}),Zn=Object.freeze(Object.defineProperty({__proto__:null,base10:Jn},Symbol.toStringTag,{value:"Module"})),Yn=R(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),ei=R({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),ti=Object.freeze(Object.defineProperty({__proto__:null,
base16:Yn,base16upper:ei},Symbol.toStringTag,{value:"Module"})),ri=R({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
ni=Object.freeze(Object.defineProperty({__proto__:null,base2:ri},Symbol.toStringTag,{value:"Module"})),Or=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),ii=Or.reduce((t,e,r)=>(t[r]=e,t),[]),oi=Or.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function si(t){return t.reduce((e,r)=>(e+=ii[r],e),"")}function ai(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=oi[n];if(i==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(e)}const ci=nt({prefix:"🚀",name:"\
base256emoji",encode:si,decode:ai}),di=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:ci},Symbol.toStringTag,
{value:"Module"})),me=R({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
fi=R({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),li=R(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),ui=R({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),hi=R({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),pi=R({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),bi=R({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),mi=R({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),wi=R({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),gi=Object.freeze(Object.defineProperty({__proto__:null,
base32:me,base32hex:hi,base32hexpad:bi,base32hexpadupper:mi,base32hexupper:pi,base32pad:li,base32padupper:ui,base32upper:fi,
base32z:wi},Symbol.toStringTag,{value:"Module"})),Fe=ke({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),yi=ke({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
Ei=Object.freeze(Object.defineProperty({__proto__:null,base36:Fe,base36upper:yi},Symbol.toStringTag,{value:"Module"})),re=ke(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),vi=ke({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),xi=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:re,base58flickr:vi},Symbol.toStringTag,{value:"Module"})),Si=R({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),_i=R({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Dr=R({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Ai=R({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Ci=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Si,base64pad:_i,base64url:Dr,base64urlpad:Ai},Symbol.toStringTag,{value:"Module"})),Ii=R({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Bi=Object.freeze(Object.defineProperty({__proto__:null,base8:Ii},Symbol.
toStringTag,{value:"Module"})),Ui=nt({prefix:"\0",name:"identity",encode:t=>Nn(Te(t)),decode:t=>Te(Pn(t))}),Ti=Object.freeze(
Object.defineProperty({__proto__:null,identity:Ui},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var Mi=Rr,Xt=128,zi=-128,ki=Math.pow(2,31);function Rr(t,e,r){e=e||[],r=r||0;for(var n=r;t>=ki;)e[r++]=t&255|Xt,t/=128;for(;t&
zi;)e[r++]=t&255|Xt,t>>>=7;return e[r]=t|0,Rr.bytes=r-n+1,e}var $i=Et,Oi=128,Jt=127;function Et(t,n){var r=0,n=n||0,i=0,
o=n,s,a=t.length;do{if(o>=a)throw Et.bytes=0,new RangeError("Could not decode varint");s=t[o++],r+=i<28?(s&Jt)<<i:(s&Jt)*
Math.pow(2,i),i+=7}while(s>=Oi);return Et.bytes=o-n,r}var Di=Math.pow(2,7),Ri=Math.pow(2,14),Pi=Math.pow(2,21),Ni=Math.pow(
2,28),Gi=Math.pow(2,35),Fi=Math.pow(2,42),Li=Math.pow(2,49),qi=Math.pow(2,56),ji=Math.pow(2,63),Qi=function(t){return t<
Di?1:t<Ri?2:t<Pi?3:t<Ni?4:t<Gi?5:t<Fi?6:t<Li?7:t<qi?8:t<ji?9:10},Vi={encode:Mi,decode:$i,encodingLength:Qi},Ve=Vi;function vt(t,e=0){
const r=Ve.decode(t,e),n=Ve.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[r,n]}function Ke(t,e,r=0){return Ve.encode(t,e,r),e}function We(t){return Ve.
encodingLength(t)}function Ki(t,e){const r=e.byteLength,n=We(t),i=n+We(r),o=new Uint8Array(i+r);return Ke(t,o,0),Ke(r,o,
n),o.set(e,i),new Dt(t,r,e,o)}function Wi(t){const e=Te(t),[r,n]=vt(e),[i,o]=vt(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==
i)throw new Error("Incorrect length");return new Dt(r,i,s,e)}function Hi(t,e){if(t===e)return!0;{const r=e;return t.code===
r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&Rn(t.bytes,r.bytes)}}let Dt=class{constructor(e,r,n,i){l(this,"c\
ode");l(this,"size");l(this,"digest");l(this,"bytes");this.code=e,this.size=r,this.digest=Me(n),this.bytes=Me(i)}};function Zt(t,e){
const{bytes:r,version:n}=t;switch(n){case 0:return Zi(r,xt(t),e??re.encoder);default:return Yi(r,xt(t),e??me.encoder)}}const Yt=new WeakMap;
function xt(t){const e=Yt.get(t);if(e==null){const r=new Map;return Yt.set(t,r),r}return e}var Ir;let Xi=class G{constructor(e,r,n,i){
l(this,"code");l(this,"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,Ir,"CID");this.code=r,this.version=
e,this.multihash=n,this.bytes=Me(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
ve)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==eo)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return G.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=Ki(e,
r);return G.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return G.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&Hi(e.multihash,n.multihash)}toString(e){return Zt(this,e)}toJSON(){return{"/":Zt(
this)}}link(){return this}[(Ir=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof G)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new G(n,i,o,s??er(n,i,o.bytes))}else if(r[to]===!0){const{version:n,
multihash:i,code:o}=r,s=Wi(i);return G.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==ve)throw new Error(`Version 0 CID must use dag-pb (code: ${ve}) block encoding`);return new G(e,r,n,n.bytes)}case 1:{
const i=er(e,r,n.bytes);return new G(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return G.create(
0,ve,e)}static createV1(e,r){return G.create(1,e,r)}static decode(e){const[r,n]=G.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=G.inspectBytes(e),n=r.size-r.multihashSize,i=Te(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new Dt(r.multihashCode,r.digestSize,o,i);return[r.version===0?G.createV0(s):G.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[h,u]=vt(e.subarray(r));return r+=u,h};let i=n(),o=ve;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),p=r+f,g=p-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:g,size:p}}static parse(e,r){const[n,i]=Ji(e,r),o=G.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return xt(o).set(n,e),o}};function Ji(t,e){
switch(t[0]){case"Q":{const r=e??re;return[re.prefix,r.decode(`${re.prefix}${t}`)]}case re.prefix:{const r=e??re;return[
re.prefix,r.decode(t)]}case me.prefix:{const r=e??me;return[me.prefix,r.decode(t)]}case Fe.prefix:{const r=e??Fe;return[
Fe.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function Zi(t,e,r){const{prefix:n}=r;if(n!==re.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function Yi(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const ve=112,eo=18;function er(t,e,r){const n=We(t),i=n+We(e),o=new Uint8Array(i+r.byteLength);return Ke(t,o,0),
Ke(e,o,n),o.set(r,i),o}const to=Symbol.for("@ipld/js-cid/CID"),St={...Ti,...ni,...Bi,...Zn,...ti,...gi,...Ei,...xi,...Ci,
...di};function Pr(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const tr=Pr("u\
tf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),ft=Pr("ascii","a",t=>{let e="\
a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=zr(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}),Nr={utf8:tr,"utf-8":tr,hex:St.base16,latin1:ft,ascii:ft,binary:ft,...St};function Gr(t,e="\
utf8"){const r=Nr[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}
function He(t,e="utf8"){const r=Nr[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(
t).substring(1)}class he extends Error{constructor(){super(...arguments);l(this,"name","InvalidMultiaddrError")}}l(he,"n\
ame","InvalidMultiaddrError");class we extends Error{constructor(){super(...arguments);l(this,"name","ValidationError")}}
l(we,"name","ValidationError");class Fr extends Error{constructor(){super(...arguments);l(this,"name","UnknownProtocolEr\
ror")}}l(Fr,"name","UnknownProtocolError");const ro=4,no=6,io=273,oo=33,so=41,ao=42,co=43,fo=53,lo=54,uo=55,ho=56,po=132,
bo=301,mo=302,wo=400,go=421,yo=444,Eo=445,vo=446,xo=447,So=448,_o=449,Ao=454,Co=460,Io=461,Bo=465,Uo=466,To=480,Mo=481,zo=443,
ko=477,$o=478,Oo=479,Do=277,Ro=275,Po=276,No=280,Go=281,Fo=290,Lo=777;function rr(t){return e=>He(e,t)}function nr(t){return e=>Gr(
e,t)}function Be(t){return new DataView(t.buffer).getUint16(t.byteOffset).toString()}function be(t){const e=new ArrayBuffer(
2);return new DataView(e).setUint16(0,typeof t=="string"?parseInt(t):t),new Uint8Array(e)}function qo(t){const e=t.split(
":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port numbe\
r`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const r=Gr(e[0],
"base32"),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error("Port number is not in range(1, 65536)");const i=be(n);return kr(
[r,i],r.length+i.length)}function jo(t){const e=t.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr\
: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion a\
ddr: ${e[0]} not a Tor onion3 address.`);const r=me.decode(`b${e[0]}`),n=parseInt(e[1],10);if(n<1||n>65536)throw new Error(
"Port number is not in range(1, 65536)");const i=be(n);return kr([r,i],r.length+i.length)}function ir(t){const e=t.subarray(
0,t.length-2),r=t.subarray(t.length-2),n=He(e,"base32"),i=Be(r);return`${n}:${i}`}const Lr=function(t){t=t.toString().trim();
const e=new Uint8Array(4);return t.split(/\./g).forEach((r,n)=>{const i=parseInt(r,10);if(isNaN(i)||i<0||i>255)throw new he(
"Invalid byte value in IP address");e[n]=i}),e},Qo=function(t){let e=0;t=t.toString().trim();const r=t.split(":",8);let n;
for(n=0;n<r.length;n++){const o=Mr(r[n]);let s;o&&(s=Lr(r[n]),r[n]=He(s.subarray(0,2),"base16")),s!=null&&++n<8&&r.splice(
n,0,He(s.subarray(2,4),"base16"))}if(r[0]==="")for(;r.length<8;)r.unshift("0");else if(r[r.length-1]==="")for(;r.length<
8;)r.push("0");else if(r.length<8){for(n=0;n<r.length&&r[n]!=="";n++);const o=[n,1];for(n=9-r.length;n>0;n--)o.push("0");
r.splice.apply(r,o)}const i=new Uint8Array(e+16);for(n=0;n<r.length;n++){r[n]===""&&(r[n]="0");const o=parseInt(r[n],16);
if(isNaN(o)||o<0||o>65535)throw new he("Invalid byte value in IP address");i[e++]=o>>8&255,i[e++]=o&255}return i},Vo=function(t){
if(t.byteLength!==4)throw new he("IPv4 address was incorrect length");const e=[];for(let r=0;r<t.byteLength;r++)e.push(t[r]);
return e.join(".")},Ko=function(t){if(t.byteLength!==16)throw new he("IPv6 address was incorrect length");const e=[];for(let n=0;n<
t.byteLength;n+=2){const i=t[n],o=t[n+1],s=`${i.toString(16).padStart(2,"0")}${o.toString(16).padStart(2,"0")}`;e.push(s)}
const r=e.join(":");try{const n=new URL(`http://[${r}]`);return n.hostname.substring(1,n.hostname.length-1)}catch{throw new he(
`Invalid IPv6 address "${r}"`)}};function Wo(t){try{const e=new URL(`http://[${t}]`);return e.hostname.substring(1,e.hostname.
length-1)}catch{throw new he(`Invalid IPv6 address "${t}"`)}}const lt=Object.values(St).map(t=>t.decoder),Ho=(function(){
let t=lt[0].or(lt[1]);return lt.slice(2).forEach(e=>t=t.or(e)),t})();function Xo(t){return Ho.decode(t)}function Jo(t){return e=>t.
encoder.encode(e)}function Zo(t){if(parseInt(t).toString()!==t)throw new we("Value must be an integer")}function Yo(t){if(t<
0)throw new we("Value must be a positive integer, or zero")}function es(t){return e=>{if(e>t)throw new we(`Value must be\
 smaller than or equal to ${t}`)}}function ts(...t){return e=>{for(const r of t)r(e)}}const Re=ts(Zo,Yo,es(65535)),V=-1;
class rs{constructor(){l(this,"protocolsByCode",new Map);l(this,"protocolsByName",new Map)}getProtocol(e){let r;if(typeof e==
"string"?r=this.protocolsByName.get(e):r=this.protocolsByCode.get(e),r==null)throw new Fr(`Protocol ${e} was unknown`);return r}addProtocol(e){
var r;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(r=e.aliases)==null||r.forEach(n=>{this.protocolsByName.
set(n,e)})}removeProtocol(e){var n;const r=this.protocolsByCode.get(e);r!=null&&(this.protocolsByCode.delete(r.code),this.
protocolsByName.delete(r.name),(n=r.aliases)==null||n.forEach(i=>{this.protocolsByName.delete(i)}))}}const ns=new rs,is=[
{code:ro,name:"ip4",size:32,valueToBytes:Lr,bytesToValue:Vo,validate:t=>{if(!Mr(t))throw new we(`Invalid IPv4 address "${t}\
"`)}},{code:no,name:"tcp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:io,name:"udp",size:16,valueToBytes:be,
bytesToValue:Be,validate:Re},{code:oo,name:"dccp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:so,name:"ip\
6",size:128,valueToBytes:Qo,bytesToValue:Ko,stringToValue:Wo,validate:t=>{if(!$n(t))throw new we(`Invalid IPv6 address "${t}\
"`)}},{code:ao,name:"ip6zone",size:V},{code:co,name:"ipcidr",size:8,bytesToValue:rr("base10"),valueToBytes:nr("base10")},
{code:fo,name:"dns",size:V},{code:lo,name:"dns4",size:V},{code:uo,name:"dns6",size:V},{code:ho,name:"dnsaddr",size:V},{code:po,
name:"sctp",size:16,valueToBytes:be,bytesToValue:Be,validate:Re},{code:bo,name:"udt"},{code:mo,name:"utp"},{code:wo,name:"\
unix",size:V,stringToValue:t=>decodeURIComponent(t),valueToString:t=>encodeURIComponent(t)},{code:go,name:"p2p",aliases:[
"ipfs"],size:V,bytesToValue:rr("base58btc"),valueToBytes:t=>t.startsWith("Q")||t.startsWith("1")?nr("base58btc")(t):Xi.parse(
t).multihash.bytes},{code:yo,name:"onion",size:96,bytesToValue:ir,valueToBytes:qo},{code:Eo,name:"onion3",size:296,bytesToValue:ir,
valueToBytes:jo},{code:vo,name:"garlic64",size:V},{code:xo,name:"garlic32",size:V},{code:So,name:"tls"},{code:_o,name:"s\
ni",size:V},{code:Ao,name:"noise"},{code:Co,name:"quic"},{code:Io,name:"quic-v1"},{code:Bo,name:"webtransport"},{code:Uo,
name:"certhash",size:V,bytesToValue:Jo(Dr),valueToBytes:Xo},{code:To,name:"http"},{code:Mo,name:"http-path",size:V,stringToValue:t=>`\
/${decodeURIComponent(t)}`,valueToString:t=>encodeURIComponent(t.substring(1))},{code:zo,name:"https"},{code:ko,name:"ws"},
{code:$o,name:"wss"},{code:Oo,name:"p2p-websocket-star"},{code:Do,name:"p2p-stardust"},{code:Ro,name:"p2p-webrtc-star"},
{code:Po,name:"p2p-webrtc-direct"},{code:No,name:"webrtc-direct"},{code:Go,name:"webrtc"},{code:Fo,name:"p2p-circuit"},{
code:Lo,name:"memory",size:V}];is.forEach(t=>{ns.addProtocol(t)});function _t(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return sr(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return sr(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function os(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const or=4096;function ss(t){const e=t.
length;if(e<=or)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=or));return r}function as(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function sr(t){return as(
t)?t:t.slice()}function cs(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),p=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),p!==
a&&(n[p]=o)}}var g=t.length,h=t.charAt(0),u=Math.log(g)/Math.log(256),v=Math.log(256)/Math.log(g);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,
w=0,x=c.length;w!==x&&c[w]===0;)w++,d++;for(var S=(x-w)*v+1>>>0,E=new Uint8Array(S);w!==x;){for(var y=c[w],I=0,C=S-1;(y!==
0||I<A)&&C!==-1;C--,I++)y+=256*E[C]>>>0,E[C]=y%g>>>0,y=y/g>>>0;if(y!==0)throw new Error("Non-zero carry");A=I,w++}for(var B=S-
A;B!==S&&E[B]===0;)B++;for(var T=h.repeat(d);B<S;++B)T+=t.charAt(E[B]);return T}function _(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,w=0;c[d]===h;)A++,d++;for(var x=(c.
length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var y=0,I=x-1;(E!==0||y<w)&&
I!==-1;I--,y++)E+=g*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");w=y,d++}if(c[d]!==" "){
for(var C=x-w;C!==x&&S[C]===0;)C++;for(var B=new Uint8Array(A+(x-C)),T=A;C!==x;)B[T++]=S[C++];return B}}}function m(c){var d=_(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:_,decode:m}}var ds=cs,fs=ds;let ls=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},us=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return qr(this,e)}},hs=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return qr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function qr(t,e){return new hs({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let ps=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ls(e,r,n),this.decoder=new us(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function it({name:t,prefix:e,encode:r,decode:n}){return new ps(
t,e,r,n)}function $e({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=fs(r,t,n);return it({prefix:e,
name:t,encode:i,decode:s=>_t(o(s))})}function bs(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let p=0;p<i;++p){const g=e[t[p]];if(g===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|g,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function ms(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function ws(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function P({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=ws(n,i);return it(
{prefix:e,name:t,encode(s){return ms(s,n,r)},decode(s){return bs(s,o,r,t)}})}$e({prefix:"9",name:"base10",alphabet:"0123\
456789"});P({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});P({prefix:"F",name:"\
base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});P({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});
const jr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎\
😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺\
🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟\
🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐\
📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),gs=jr.reduce((t,e,r)=>(t[r]=e,t),[]),ys=jr.reduce((t,e,r)=>{const n=e.
codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);function Es(t){return t.reduce(
(e,r)=>(e+=gs[r],e),"")}function vs(t){const e=[];for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${r}`);const i=ys[n];if(i==null)throw new Error(`Non-base256emoji character: ${r}`);e.push(i)}return new Uint8Array(
e)}it({prefix:"🚀",name:"base256emoji",encode:Es,decode:vs});P({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrs\
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
7",name:"base8",alphabet:"01234567",bitsPerChar:3});it({prefix:"\0",name:"identity",encode:t=>ss(_t(t)),decode:t=>_t(os(
t))});new TextEncoder;new TextDecoder;const xs="/",Ss=new TextEncoder().encode(xs);Ss[0];function _s(t){if(t instanceof Uint8Array&&
t.constructor.name==="Uint8Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))
return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function As(t){
return new TextEncoder().encode(t)}function Cs(t){return new TextDecoder().decode(t)}function Is(t,e){if(t.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<t.length;i++){var o=t.charAt(
i),s=o.charCodeAt(0);if(r[s]!==255)throw new TypeError(o+" is ambiguous");r[s]=i}var a=t.length,f=t.charAt(0),p=Math.log(
a)/Math.log(256),g=Math.log(256)/Math.log(a);function h(b){if(b instanceof Uint8Array||(ArrayBuffer.isView(b)?b=new Uint8Array(
b.buffer,b.byteOffset,b.byteLength):Array.isArray(b)&&(b=Uint8Array.from(b))),!(b instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(b.length===0)return"";for(var _=0,m=0,c=0,d=b.length;c!==d&&b[c]===0;)c++,_++;for(var A=(d-c)*
g+1>>>0,w=new Uint8Array(A);c!==d;){for(var x=b[c],S=0,E=A-1;(x!==0||S<m)&&E!==-1;E--,S++)x+=256*w[E]>>>0,w[E]=x%a>>>0,x=
x/a>>>0;if(x!==0)throw new Error("Non-zero carry");m=S,c++}for(var y=A-m;y!==A&&w[y]===0;)y++;for(var I=f.repeat(_);y<A;++y)
I+=t.charAt(w[y]);return I}function u(b){if(typeof b!="string")throw new TypeError("Expected String");if(b.length===0)return new Uint8Array;
var _=0;if(b[_]!==" "){for(var m=0,c=0;b[_]===f;)m++,_++;for(var d=(b.length-_)*p+1>>>0,A=new Uint8Array(d);b[_];){var w=r[b.
charCodeAt(_)];if(w===255)return;for(var x=0,S=d-1;(w!==0||x<c)&&S!==-1;S--,x++)w+=a*A[S]>>>0,A[S]=w%256>>>0,w=w/256>>>0;
if(w!==0)throw new Error("Non-zero carry");c=x,_++}if(b[_]!==" "){for(var E=d-c;E!==d&&A[E]===0;)E++;for(var y=new Uint8Array(
m+(d-E)),I=m;E!==d;)y[I++]=A[E++];return y}}}function v(b){var _=u(b);if(_)return _;throw new Error(`Non-${e} character`)}
return{encode:h,decodeUnsafe:u,decode:v}}var Bs=Is,Us=Bs;let Ts=class{constructor(e,r,n){l(this,"name");l(this,"prefix");
l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},Ms=class{constructor(e,r,n){l(this,"name");l(this,"pr\
efix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return Qr(this,e)}},zs=class{constructor(e){l(this,"decoders");this.decoders=e}or(e){
return Qr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to de\
code multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Qr(t,e){
return new zs({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let ks=class{constructor(e,r,n,i){l(this,"n\
ame");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=i,this.encoder=new Ts(e,r,n),this.decoder=new Ms(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function ot({name:t,prefix:e,encode:r,decode:n}){return new ks(t,e,r,
n)}function Oe({name:t,prefix:e,alphabet:r}){const{encode:n,decode:i}=Us(r,t);return ot({prefix:e,name:t,encode:n,decode:o=>_s(
i(o))})}function $s(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*r/8|0);let s=0,a=0,f=0;for(let p=0;p<
i;++p){const g=e[t[p]];if(g===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|g,s+=r,s>=8&&(s-=8,o[f++]=255&a>>
s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}function Os(t,e,r){const n=e[e.length-
1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=
e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Ds(t){const e={};for(let r=0;r<t.length;++r)e[t[r]]=r;return e}
function N({name:t,prefix:e,bitsPerChar:r,alphabet:n}){const i=Ds(n);return ot({prefix:e,name:t,encode(o){return Os(o,n,
r)},decode(o){return $s(o,i,r,t)}})}const Rs=Oe({prefix:"9",name:"base10",alphabet:"0123456789"}),Ps=Object.freeze(Object.
defineProperty({__proto__:null,base10:Rs},Symbol.toStringTag,{value:"Module"})),Ns=N({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4}),Gs=N({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),Fs=Object.
freeze(Object.defineProperty({__proto__:null,base16:Ns,base16upper:Gs},Symbol.toStringTag,{value:"Module"})),Ls=N({prefix:"\
0",name:"base2",alphabet:"01",bitsPerChar:1}),qs=Object.freeze(Object.defineProperty({__proto__:null,base2:Ls},Symbol.toStringTag,
{value:"Module"})),Vr=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪\
😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬\
🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨\
😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌\
📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),js=Vr.reduce((t,e,r)=>(t[r]=e,t),[]),
Qs=Vr.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${e}`);return t[n]=r,t},[]);
function Vs(t){return t.reduce((e,r)=>(e+=js[r],e),"")}function Ks(t){const e=[];for(const r of t){const n=r.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${r}`);const i=Qs[n];if(i==null)throw new Error(`Non-base256emoji char\
acter: ${r}`);e.push(i)}return new Uint8Array(e)}const Ws=ot({prefix:"🚀",name:"base256emoji",encode:Vs,decode:Ks}),Hs=Object.
freeze(Object.defineProperty({__proto__:null,base256emoji:Ws},Symbol.toStringTag,{value:"Module"})),Xs=N({prefix:"b",name:"\
base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Js=N({prefix:"B",name:"base32upper",alphabet:"ABCDEF\
GHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),Zs=N({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567\
=",bitsPerChar:5}),Ys=N({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),ea=N(
{prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),ta=N({prefix:"V",name:"base32he\
xupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),ra=N({prefix:"t",name:"base32hexpad",alphabet:"01234\
56789abcdefghijklmnopqrstuv=",bitsPerChar:5}),na=N({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKL\
MNOPQRSTUV=",bitsPerChar:5}),ia=N({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),
oa=Object.freeze(Object.defineProperty({__proto__:null,base32:Xs,base32hex:ea,base32hexpad:ra,base32hexpadupper:na,base32hexupper:ta,
base32pad:Zs,base32padupper:Ys,base32upper:Js,base32z:ia},Symbol.toStringTag,{value:"Module"})),sa=Oe({prefix:"k",name:"\
base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),aa=Oe({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDE\
FGHIJKLMNOPQRSTUVWXYZ"}),ca=Object.freeze(Object.defineProperty({__proto__:null,base36:sa,base36upper:aa},Symbol.toStringTag,
{value:"Module"})),da=Oe({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwx\
yz"}),fa=Oe({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),la=Object.
freeze(Object.defineProperty({__proto__:null,base58btc:da,base58flickr:fa},Symbol.toStringTag,{value:"Module"})),ua=N({prefix:"\
m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),ha=N({prefix:"\
M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),pa=N({prefix:"\
u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),ba=N({prefix:"\
U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ma=Object.
freeze(Object.defineProperty({__proto__:null,base64:ua,base64pad:ha,base64url:pa,base64urlpad:ba},Symbol.toStringTag,{value:"\
Module"})),wa=N({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),ga=Object.freeze(Object.defineProperty({__proto__:null,
base8:wa},Symbol.toStringTag,{value:"Module"})),ya=ot({prefix:"\0",name:"identity",encode:t=>Cs(t),decode:t=>As(t)}),Ea=Object.
freeze(Object.defineProperty({__proto__:null,identity:ya},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const ar={...Ea,...qs,...ga,...Ps,...Fs,...oa,...ca,...la,...ma,...Hs};function At(t=0){return new Uint8Array(t)}function Xe(t=0){
return new Uint8Array(t)}function Kr(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}
const cr=Kr("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),ut=Kr("asci\
i","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=Xe(t.
length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),va={utf8:cr,"utf-8":cr,hex:ar.base16,latin1:ut,ascii:ut,
binary:ut,...ar};function xa(t,e="utf8"){const r=va[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.
decoder.decode(`${r.prefix}${t}`)}const Sa=Math.pow(2,7),_a=Math.pow(2,14),Aa=Math.pow(2,21),Wr=Math.pow(2,28),Hr=Math.pow(
2,35),Xr=Math.pow(2,42),Jr=Math.pow(2,49),j=128,ce=127;function Rt(t){if(t<Sa)return 1;if(t<_a)return 2;if(t<Aa)return 3;
if(t<Wr)return 4;if(t<Hr)return 5;if(t<Xr)return 6;if(t<Jr)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Ca(t,e,r=0){switch(Rt(t)){case 8:e[r++]=t&255|j,t/=128;case 7:
e[r++]=t&255|j,t/=128;case 6:e[r++]=t&255|j,t/=128;case 5:e[r++]=t&255|j,t/=128;case 4:e[r++]=t&255|j,t>>>=7;case 3:e[r++]=
t&255|j,t>>>=7;case 2:e[r++]=t&255|j,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreachable")}return e}
function Ia(t,e){let r=t[e],n=0;if(n+=r&ce,r<j||(r=t[e+1],n+=(r&ce)<<7,r<j)||(r=t[e+2],n+=(r&ce)<<14,r<j)||(r=t[e+3],n+=
(r&ce)<<21,r<j)||(r=t[e+4],n+=(r&ce)*Wr,r<j)||(r=t[e+5],n+=(r&ce)*Hr,r<j)||(r=t[e+6],n+=(r&ce)*Xr,r<j)||(r=t[e+7],n+=(r&
ce)*Jr,r<j))return n;throw new RangeError("Could not decode varint")}const Pt=new Float32Array([-0]),fe=new Uint8Array(Pt.
buffer);function Ba(t,e,r){Pt[0]=t,e[r]=fe[0],e[r+1]=fe[1],e[r+2]=fe[2],e[r+3]=fe[3]}function Ua(t,e){return fe[0]=t[e],
fe[1]=t[e+1],fe[2]=t[e+2],fe[3]=t[e+3],Pt[0]}const Nt=new Float64Array([-0]),L=new Uint8Array(Nt.buffer);function Ta(t,e,r){
Nt[0]=t,e[r]=L[0],e[r+1]=L[1],e[r+2]=L[2],e[r+3]=L[3],e[r+4]=L[4],e[r+5]=L[5],e[r+6]=L[6],e[r+7]=L[7]}function Ma(t,e){return L[0]=
t[e],L[1]=t[e+1],L[2]=t[e+2],L[3]=t[e+3],L[4]=t[e+4],L[5]=t[e+5],L[6]=t[e+6],L[7]=t[e+7],Nt[0]}const za=BigInt(Number.MAX_SAFE_INTEGER),
ka=BigInt(Number.MIN_SAFE_INTEGER);class q{constructor(e,r){l(this,"lo");l(this,"hi");this.lo=e|0,this.hi=r|0}toNumber(e=!1){
if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(r+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const r=~this.
lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===
0n)return ue;if(e<za&&e>ka)return this.fromNumber(Number(e));const r=e<0n;r&&(e=-e);let n=e>>32n,i=e-(n<<32n);return r&&
(n=~n|0n,i=~i|0n,++i>dr&&(i=0n,++n>dr&&(n=0n))),new q(Number(i),Number(n))}static fromNumber(e){if(e===0)return ue;const r=e<
0;r&&(e=-e);let n=e>>>0,i=(e-n)/4294967296>>>0;return r&&(i=~i>>>0,n=~n>>>0,++n>4294967295&&(n=0,++i>4294967295&&(i=0))),
new q(n,i)}static from(e){return typeof e=="number"?q.fromNumber(e):typeof e=="bigint"?q.fromBigInt(e):typeof e=="string"?
q.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new q(e.low>>>0,e.high>>>0):ue}}const ue=new q(0,0);ue.toBigInt=function(){
return 0n};ue.zzEncode=ue.zzDecode=function(){return this};ue.length=function(){return 1};const dr=4294967296n;function $a(t){
let e=0,r=0;for(let n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(n+1)&64512)===
56320?(++n,e+=4):e+=3;return e}function Oa(t,e,r){if(r-e<1)return"";let i;const o=[];let s=0,a;for(;e<r;)a=t[e++],a<128?
o[s++]=a:a>191&&a<224?o[s++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|t[e++]&63)-65536,
o[s++]=55296+(a>>10),o[s++]=56320+(a&1023)):o[s++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,s>8191&&((i??(i=[])).push(String.
fromCharCode.apply(String,o)),s=0);return i!=null?(s>0&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):
String.fromCharCode.apply(String,o.slice(0,s))}function Zr(t,e,r){const n=r;let i,o;for(let s=0;s<t.length;++s)i=t.charCodeAt(
s),i<128?e[r++]=i:i<2048?(e[r++]=i>>6|192,e[r++]=i&63|128):(i&64512)===55296&&((o=t.charCodeAt(s+1))&64512)===56320?(i=65536+
((i&1023)<<10)+(o&1023),++s,e[r++]=i>>18|240,e[r++]=i>>12&63|128,e[r++]=i>>6&63|128,e[r++]=i&63|128):(e[r++]=i>>12|224,e[r++]=
i>>6&63|128,e[r++]=i&63|128);return r-n}function J(t,e){return RangeError(`index out of range: ${t.pos} + ${e??1} > ${t.
len}`)}function Pe(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class Da{constructor(e){l(this,"buf");l(this,
"pos");l(this,"len");l(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;
if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<
128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.
pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.
pos=this.len,J(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){
return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw J(this,4);return Pe(this.buf,this.pos+=4)}sfixed32(){if(this.
pos+4>this.len)throw J(this,4);return Pe(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw J(this,4);const e=Ua(
this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw J(this,4);const e=Ma(this.buf,this.pos);return this.
pos+=8,e}bytes(){const e=this.uint32(),r=this.pos,n=this.pos+e;if(n>this.len)throw J(this,e);return this.pos+=e,r===n?new Uint8Array(
0):this.buf.subarray(r,n)}string(){const e=this.bytes();return Oa(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
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
return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Ia(this.buf,this.pos);return this.pos+=Rt(e),e}uint64String(){
return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.
readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.
readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().
toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){
return this.readFixed64().toString()}}function Ra(t){return new Da(t instanceof Uint8Array?t:t.subarray())}function Gt(t,e,r){
const n=Ra(t);return e.decode(n,void 0,r)}function Pa(t){let n,i=8192;return function(s){if(s<1||s>4096)return Xe(s);i+s>
8192&&(n=Xe(8192),i=0);const a=n.subarray(i,i+=s);return(i&7)!==0&&(i=(i|7)+1),a}}class Ue{constructor(e,r,n){l(this,"fn");
l(this,"len");l(this,"next");l(this,"val");this.fn=e,this.len=r,this.next=void 0,this.val=n}}function ht(){}class Na{constructor(e){
l(this,"head");l(this,"tail");l(this,"len");l(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.
states}}const Ga=Pa();function Fa(t){return globalThis.Buffer!=null?Xe(t):Ga(t)}class Ct{constructor(){l(this,"len");l(this,
"head");l(this,"tail");l(this,"states");this.len=0,this.head=new Ue(ht,0,0),this.tail=this.head,this.states=null}_push(e,r,n){
return this.tail=this.tail.next=new Ue(e,r,n),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.tail.next=new qa(
(e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Ne,10,q.fromNumber(e)):
this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=q.fromBigInt(e);return this._push(Ne,r.length(),
r)}uint64Number(e){return this._push(Ca,Rt(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(
e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=q.fromBigInt(
e).zzEncode();return this._push(Ne,r.length(),r)}sint64Number(e){const r=q.fromNumber(e).zzEncode();return this._push(Ne,
r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(pt,1,e?1:0)}fixed32(e){return this.
_push(xe,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=q.fromBigInt(e);return this._push(xe,4,r.lo)._push(
xe,4,r.hi)}fixed64Number(e){const r=q.fromNumber(e);return this._push(xe,4,r.lo)._push(xe,4,r.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(Ba,4,e)}double(e){return this._push(Ta,8,e)}bytes(e){const r=e.length>>>0;return r===
0?this._push(pt,1,0):this.uint32(r)._push(ja,r,e)}string(e){const r=$a(e);return r!==0?this.uint32(r)._push(Zr,r,e):this.
_push(pt,1,0)}fork(){return this.states=new Na(this),this.head=this.tail=new Ue(ht,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Ue(ht,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=r,this.len+=n),this}finish(){let e=this.head.next;const r=Fa(this.len);
let n=0;for(;e!=null;)e.fn(e.val,r,n),n+=e.len,e=e.next;return r}}function pt(t,e,r){e[r]=t&255}function La(t,e,r){for(;t>
127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class qa extends Ue{constructor(r,n){super(La,r,n);l(this,"next");this.next=void 0}}
function Ne(t,e,r){for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&
127|128,t.lo=t.lo>>>7;e[r++]=t.lo}function xe(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function ja(t,e,r){
e.set(t,r)}globalThis.Buffer!=null&&(Ct.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this.
_push(Qa,e,t),this},Ct.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this.
_push(Va,e,t),this});function Qa(t,e,r){e.set(t,r)}function Va(t,e,r){t.length<40?Zr(t,e,r):e.utf8Write!=null?e.utf8Write(
t,r):e.set(xa(t),r)}function Ka(){return new Ct}function Ft(t,e){const r=Ka();return e.encode(t,r,{lengthDelimited:!1}),
r.finish()}var It;(function(t){t[t.VARINT=0]="VARINT",t[t.BIT64=1]="BIT64",t[t.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",t[t.
START_GROUP=3]="START_GROUP",t[t.END_GROUP=4]="END_GROUP",t[t.BIT32=5]="BIT32"})(It||(It={}));function Wa(t,e,r,n){return{
name:t,type:e,encode:r,decode:n}}function Lt(t,e){return Wa("message",It.LENGTH_DELIMITED,t,e)}class Bt extends Error{constructor(){
super(...arguments);l(this,"code","ERR_MAX_LENGTH");l(this,"name","MaxLengthError")}}var Br,Ur;(Ur=(Br=globalThis.process)==
null?void 0:Br.env)!=null&&Ur.DUMP_SESSION_KEYS;var Je;(function(t){let e;t.codec=()=>(e==null&&(e=Lt((r,n,i={})=>{if(i.
lengthDelimited!==!1&&n.fork(),r.webtransportCerthashes!=null)for(const o of r.webtransportCerthashes)n.uint32(10),n.bytes(
o);if(r.streamMuxers!=null)for(const o of r.streamMuxers)n.uint32(18),n.string(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a,f;const o={webtransportCerthashes:[],streamMuxers:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const p=r.uint32();switch(p>>>
3){case 1:{if(((a=i.limits)==null?void 0:a.webtransportCerthashes)!=null&&o.webtransportCerthashes.length===i.limits.webtransportCerthashes)
throw new Bt('Decode error - map field "webtransportCerthashes" had too many elements');o.webtransportCerthashes.push(r.
bytes());break}case 2:{if(((f=i.limits)==null?void 0:f.streamMuxers)!=null&&o.streamMuxers.length===i.limits.streamMuxers)
throw new Bt('Decode error - map field "streamMuxers" had too many elements');o.streamMuxers.push(r.string());break}default:{
r.skipType(p&7);break}}}return o})),e),t.encode=r=>Ft(r,t.codec()),t.decode=(r,n)=>Gt(r,t.codec(),n)})(Je||(Je={}));var fr;
(function(t){let e;t.codec=()=>(e==null&&(e=Lt((r,n,i={})=>{i.lengthDelimited!==!1&&n.fork(),r.identityKey!=null&&r.identityKey.
byteLength>0&&(n.uint32(10),n.bytes(r.identityKey)),r.identitySig!=null&&r.identitySig.byteLength>0&&(n.uint32(18),n.bytes(
r.identitySig)),r.extensions!=null&&(n.uint32(34),Je.codec().encode(r.extensions,n)),i.lengthDelimited!==!1&&n.ldelim()},
(r,n,i={})=>{var a;const o={identityKey:At(0),identitySig:At(0)},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();
switch(f>>>3){case 1:{o.identityKey=r.bytes();break}case 2:{o.identitySig=r.bytes();break}case 4:{o.extensions=Je.codec().
decode(r,r.uint32(),{limits:(a=i.limits)==null?void 0:a.extensions});break}default:{r.skipType(f&7);break}}}return o})),
e),t.encode=r=>Ft(r,t.codec()),t.decode=(r,n)=>Gt(r,t.codec(),n)})(fr||(fr={}));var lr;(function(t){let e;t.codec=()=>(e==
null&&(e=Lt((r,n,i={})=>{if(i.lengthDelimited!==!1&&n.fork(),r.publicKey!=null&&r.publicKey.byteLength>0&&(n.uint32(10),
n.bytes(r.publicKey)),r.addrs!=null)for(const o of r.addrs)n.uint32(18),n.bytes(o);i.lengthDelimited!==!1&&n.ldelim()},(r,n,i={})=>{
var a;const o={publicKey:At(0),addrs:[]},s=n==null?r.len:r.pos+n;for(;r.pos<s;){const f=r.uint32();switch(f>>>3){case 1:{
o.publicKey=r.bytes();break}case 2:{if(((a=i.limits)==null?void 0:a.addrs)!=null&&o.addrs.length===i.limits.addrs)throw new Bt(
'Decode error - map field "addrs" had too many elements');o.addrs.push(r.bytes());break}default:{r.skipType(f&7);break}}}
return o})),e),t.encode=r=>Ft(r,t.codec()),t.decode=(r,n)=>Gt(r,t.codec(),n)})(lr||(lr={}));new TextEncoder;new TextDecoder(
"utf-8",{fatal:!0});new TextEncoder;new TextDecoder;function Ha(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])
return!1;return!0}function qt(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return ze(t);if(t instanceof
ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return ze(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));
throw new Error("Unknown type, must be binary type")}function Xa(t){return(t==null?void 0:t.buffer)instanceof ArrayBuffer}
function ze(t){return Xa(t)?t:t.slice()}function Ja(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(
s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().charCodeAt(0),p=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),p!==
a&&(n[p]=o)}}var g=t.length,h=t.charAt(0),u=Math.log(g)/Math.log(256),v=Math.log(256)/Math.log(g);function b(c){if(c instanceof
Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.
from(c))),!(c instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,
w=0,x=c.length;w!==x&&c[w]===0;)w++,d++;for(var S=(x-w)*v+1>>>0,E=new Uint8Array(S);w!==x;){for(var y=c[w],I=0,C=S-1;(y!==
0||I<A)&&C!==-1;C--,I++)y+=256*E[C]>>>0,E[C]=y%g>>>0,y=y/g>>>0;if(y!==0)throw new Error("Non-zero carry");A=I,w++}for(var B=S-
A;B!==S&&E[B]===0;)B++;for(var T=h.repeat(d);B<S;++B)T+=t.charAt(E[B]);return T}function _(c){if(typeof c!="string")throw new TypeError(
"Expected String");if(c.length===0)return new Uint8Array;var d=0;if(c[d]!==" "){for(var A=0,w=0;c[d]===h;)A++,d++;for(var x=(c.
length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.charCodeAt(d)];if(E===255)return;for(var y=0,I=x-1;(E!==0||y<w)&&
I!==-1;I--,y++)E+=g*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");w=y,d++}if(c[d]!==" "){
for(var C=x-w;C!==x&&S[C]===0;)C++;for(var B=new Uint8Array(A+(x-C)),T=A;C!==x;)B[T++]=S[C++];return B}}}function m(c){var d=_(
c);if(d)return d;throw new Error(`Non-${e} character`)}return{encode:b,decodeUnsafe:_,decode:m}}var Za=Ja,Ya=Za;let ec=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof
Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},tc=class{constructor(e,r,n){
l(this,"name");l(this,"prefix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(
0);if(i===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Yr(this,e)}},rc=class{constructor(e){l(this,"decoders");this.
decoders=e}or(e){return Yr(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}};function Yr(t,e){return new rc({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}let nc=class{constructor(e,r,n,i){
l(this,"name");l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=
e,this.prefix=r,this.baseEncode=n,this.baseDecode=i,this.encoder=new ec(e,r,n),this.decoder=new tc(e,r,i)}encode(e){return this.
encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function en({name:t,prefix:e,encode:r,decode:n}){return new nc(
t,e,r,n)}function st({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Ya(r,t,n);return en({prefix:e,
name:t,encode:i,decode:s=>qt(o(s))})}function ic(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let p=0;p<i;++p){const g=e[t[p]];if(g===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|g,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function oc(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function sc(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function ie({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=sc(n,i);return en(
{prefix:e,name:t,encode(s){return oc(s,n,r)},decode(s){return ic(s,o,r,t)}})}const Le=ie({prefix:"b",name:"base32",alphabet:"\
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
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var ac=tn,ur=128,cc=-128,dc=Math.pow(2,31);function tn(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=dc;)e[r++]=t&255|ur,t/=128;for(;t&cc;)e[r++]=t&255|ur,t>>>=7;return e[r]=t|0,tn.bytes=r-n+1,e}var fc=Ut,
lc=128,hr=127;function Ut(t,n){var r=0,n=n||0,i=0,o=n,s,a=t.length;do{if(o>=a)throw Ut.bytes=0,new RangeError("Could not\
 decode varint");s=t[o++],r+=i<28?(s&hr)<<i:(s&hr)*Math.pow(2,i),i+=7}while(s>=lc);return Ut.bytes=o-n,r}var uc=Math.pow(
2,7),hc=Math.pow(2,14),pc=Math.pow(2,21),bc=Math.pow(2,28),mc=Math.pow(2,35),wc=Math.pow(2,42),gc=Math.pow(2,49),yc=Math.
pow(2,56),Ec=Math.pow(2,63),vc=function(t){return t<uc?1:t<hc?2:t<pc?3:t<bc?4:t<mc?5:t<wc?6:t<gc?7:t<yc?8:t<Ec?9:10},xc={
encode:ac,decode:fc,encodingLength:vc},Ze=xc;function Tt(t,e=0){const r=Ze.decode(t,e),n=Ze.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function Ye(t,e,r=0){return Ze.encode(t,e,r),e}function et(t){return Ze.encodingLength(t)}function Sc(t,e){const r=e.
byteLength,n=et(t),i=n+et(r),o=new Uint8Array(i+r);return Ye(t,o,0),Ye(r,o,n),o.set(e,i),new jt(t,r,e,o)}function _c(t){
const e=qt(t),[r,n]=Tt(e),[i,o]=Tt(e.subarray(n)),s=e.subarray(n+o);if(s.byteLength!==i)throw new Error("Incorrect lengt\
h");return new jt(r,i,s,e)}function Ac(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&Ha(t.bytes,r.bytes)}}class jt{constructor(e,r,n,i){l(this,"code");l(this,"size");l(this,"digest");l(this,"by\
tes");this.code=e,this.size=r,this.digest=ze(n),this.bytes=ze(i)}}function pr(t,e){const{bytes:r,version:n}=t;switch(n){case 0:
return Ic(r,Mt(t),e??de.encoder);default:return Bc(r,Mt(t),e??Le.encoder)}}const br=new WeakMap;function Mt(t){const e=br.
get(t);if(e==null){const r=new Map;return br.set(t,r),r}return e}var Tr;class ${constructor(e,r,n,i){l(this,"code");l(this,
"version");l(this,"multihash");l(this,"bytes");l(this,"/");l(this,Tr,"CID");this.code=r,this.version=e,this.multihash=n,
this.bytes=ze(i),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
Se)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Uc)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return $.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ver\
sion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=Sc(e,
r);return $.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to\
 version 1. This is a bug please report`)}}equals(e){return $.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&Ac(e.multihash,n.multihash)}toString(e){return pr(this,e)}toJSON(){return{"/":pr(
this)}}link(){return this}[(Tr=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof $)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:i,multihash:o,bytes:s}=r;return new $(n,i,o,s??mr(n,i,o.bytes))}else if(r[Tc]===!0){const{version:n,
multihash:i,code:o}=r,s=_c(i);return $.create(n,o,s)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==Se)throw new Error(`Version 0 CID must use dag-pb (code: ${Se}) block encoding`);return new $(e,r,n,n.bytes)}case 1:{
const i=mr(e,r,n.bytes);return new $(e,r,n,i)}default:throw new Error("Invalid version")}}static createV0(e){return $.create(
0,Se,e)}static createV1(e,r){return $.create(1,e,r)}static decode(e){const[r,n]=$.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=$.inspectBytes(e),n=r.size-r.multihashSize,i=qt(e.subarray(n,
n+r.multihashSize));if(i.byteLength!==r.multihashSize)throw new Error("Incorrect length");const o=i.subarray(r.multihashSize-
r.digestSize),s=new jt(r.multihashCode,r.digestSize,o,i);return[r.version===0?$.createV0(s):$.createV1(r.codec,s),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[h,u]=Tt(e.subarray(r));return r+=u,h};let i=n(),o=Se;if(i===18?
(i=0,r=0):o=n(),i!==0&&i!==1)throw new RangeError(`Invalid CID version ${i}`);const s=r,a=n(),f=n(),p=r+f,g=p-s;return{version:i,
codec:o,multihashCode:a,digestSize:f,multihashSize:g,size:p}}static parse(e,r){const[n,i]=Cc(e,r),o=$.decode(i);if(o.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Mt(o).set(n,e),o}}function Cc(t,e){
switch(t[0]){case"Q":{const r=e??de;return[de.prefix,r.decode(`${de.prefix}${t}`)]}case de.prefix:{const r=e??de;return[
de.prefix,r.decode(t)]}case Le.prefix:{const r=e??Le;return[Le.prefix,r.decode(t)]}case bt.prefix:{const r=e??bt;return[
bt.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function Ic(t,e,r){const{prefix:n}=r;if(n!==de.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const i=e.get(n);if(i==null){const o=r.encode(t).slice(1);return e.set(n,
o),o}else return i}function Bc(t,e,r){const{prefix:n}=r,i=e.get(n);if(i==null){const o=r.encode(t);return e.set(n,o),o}else
return i}const Se=112,Uc=18;function mr(t,e,r){const n=et(t),i=n+et(e),o=new Uint8Array(i+r.byteLength);return Ye(t,o,0),
Ye(e,o,n),o.set(r,i),o}const Tc=Symbol.for("@ipld/js-cid/CID");function Mc(t){if(t instanceof Uint8Array&&t.constructor.
name==="Uint8Array")return wr(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return wr(
new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function zc(t){
return(t==null?void 0:t.buffer)instanceof ArrayBuffer}function wr(t){return zc(t)?t:t.slice()}function kc(t,e,r){if(t.length>=
255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),i=0;i<n.length;i++)n[i]=255;for(var o=0;o<t.length;o++){
var s=t.charAt(o),a=s.charCodeAt(0);if(n[a]!==255)throw new TypeError(s+" is ambiguous");if(n[a]=o,r){var f=s.toLowerCase().
charCodeAt(0),p=s.toUpperCase().charCodeAt(0);f!==a&&(n[f]=o),p!==a&&(n[p]=o)}}var g=t.length,h=t.charAt(0),u=Math.log(g)/
Math.log(256),v=Math.log(256)/Math.log(g);function b(c){if(c instanceof Uint8Array||(ArrayBuffer.isView(c)?c=new Uint8Array(
c.buffer,c.byteOffset,c.byteLength):Array.isArray(c)&&(c=Uint8Array.from(c))),!(c instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(c.length===0)return"";for(var d=0,A=0,w=0,x=c.length;w!==x&&c[w]===0;)w++,d++;for(var S=(x-w)*
v+1>>>0,E=new Uint8Array(S);w!==x;){for(var y=c[w],I=0,C=S-1;(y!==0||I<A)&&C!==-1;C--,I++)y+=256*E[C]>>>0,E[C]=y%g>>>0,y=
y/g>>>0;if(y!==0)throw new Error("Non-zero carry");A=I,w++}for(var B=S-A;B!==S&&E[B]===0;)B++;for(var T=h.repeat(d);B<S;++B)
T+=t.charAt(E[B]);return T}function _(c){if(typeof c!="string")throw new TypeError("Expected String");if(c.length===0)return new Uint8Array;
var d=0;if(c[d]!==" "){for(var A=0,w=0;c[d]===h;)A++,d++;for(var x=(c.length-d)*u+1>>>0,S=new Uint8Array(x);c[d];){var E=n[c.
charCodeAt(d)];if(E===255)return;for(var y=0,I=x-1;(E!==0||y<w)&&I!==-1;I--,y++)E+=g*S[I]>>>0,S[I]=E%256>>>0,E=E/256>>>0;
if(E!==0)throw new Error("Non-zero carry");w=y,d++}if(c[d]!==" "){for(var C=x-w;C!==x&&S[C]===0;)C++;for(var B=new Uint8Array(
A+(x-C)),T=A;C!==x;)B[T++]=S[C++];return B}}}function m(c){var d=_(c);if(d)return d;throw new Error(`Non-${e} character`)}
return{encode:b,decodeUnsafe:_,decode:m}}var $c=kc,Oc=$c;class Dc{constructor(e,r,n){l(this,"name");l(this,"prefix");l(this,
"baseEncode");this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.
baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class Rc{constructor(e,r,n){l(this,"name");l(this,"pre\
fix");l(this,"baseDecode");l(this,"prefixCodePoint");this.name=e,this.prefix=r;const i=r.codePointAt(0);if(i===void 0)throw new Error(
"Invalid prefix character");this.prefixCodePoint=i,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==
this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supp\
orts inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can onl\
y multibase decode strings")}or(e){return rn(this,e)}}class Pc{constructor(e){l(this,"decoders");this.decoders=e}or(e){return rn(
this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(`Unable to decode multi\
base string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function rn(t,e){
return new Pc({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class Nc{constructor(e,r,n,i){l(this,"name");
l(this,"prefix");l(this,"baseEncode");l(this,"baseDecode");l(this,"encoder");l(this,"decoder");this.name=e,this.prefix=r,
this.baseEncode=n,this.baseDecode=i,this.encoder=new Dc(e,r,n),this.decoder=new Rc(e,r,i)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}}function nn({name:t,prefix:e,encode:r,decode:n}){return new Nc(t,e,r,
n)}function at({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:i,decode:o}=Oc(r,t,n);return nn({prefix:e,
name:t,encode:i,decode:s=>Mc(o(s))})}function Gc(t,e,r,n){let i=t.length;for(;t[i-1]==="=";)--i;const o=new Uint8Array(i*
r/8|0);let s=0,a=0,f=0;for(let p=0;p<i;++p){const g=e[t[p]];if(g===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|g,s+=r,s>=8&&(s-=8,o[f++]=255&a>>s)}if(s>=r||(255&a<<8-s)!==0)throw new SyntaxError("Unexpected end of data");return o}
function Fc(t,e,r){const n=e[e.length-1]==="=",i=(1<<r)-1;let o="",s=0,a=0;for(let f=0;f<t.length;++f)for(a=a<<8|t[f],s+=
8;s>r;)s-=r,o+=e[i&a>>s];if(s!==0&&(o+=e[i&a<<r-s]),n)for(;(o.length*r&7)!==0;)o+="=";return o}function Lc(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const i=t[n].toLowerCase(),o=t[n].toUpperCase();i!==t[n]&&(r[i]=n),o!==t[n]&&
(r[o]=n)}return r}function oe({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:i=!1}){const o=Lc(n,i);return nn(
{prefix:e,name:t,encode(s){return Fc(s,n,r)},decode(s){return Gc(s,o,r,t)}})}oe({prefix:"b",name:"base32",alphabet:"abcd\
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
RSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;const qc="peercompute.artifact.manifest.v1",on=256*1024,jc=16*
1024**3,zt=new TextEncoder;function Qc(t){const e=$.asCID(t)||$.parse(String(t));if(![85,112].includes(e.code)||e.multihash.
code!==18||e.multihash.digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");
return e.toV1()}function qe(t,e=0,r={remaining:on}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");
if((r.remaining-=2)<0)throw new RangeError("Manifest exceeds byte limit.");if(typeof t=="string"){if(t.length>r.remaining||
(r.remaining-=zt.encode(t).length)<0)throw new RangeError("Manifest exceeds byte limit.");return t}if(t===null||typeof t==
"boolean"||typeof t=="number"&&Number.isFinite(t))return t;if(Array.isArray(t)){if(t.length>4096)throw new RangeError("M\
anifest array exceeds item limit.");return t.map(i=>qe(i,e+1,r))}if(!t||typeof t!="object"||Object.getPrototypeOf(t)!==Object.
prototype)throw new TypeError("Manifest values must be JSON values.");const n=Object.keys(t);if(n.length>1024)throw new RangeError(
"Manifest object exceeds key limit.");return Object.fromEntries(n.sort().map(i=>(qe(i,e+1,r),[i,qe(t[i],e+1,r)])))}function Kd(t,{
maximumBytes:e=on,maximumFiles:r=1024,maximumFileBytes:n=jc}={}){if(!t||t.schema!==qc||!Array.isArray(t.files)||t.files.
length===0||t.files.length>r)throw new TypeError("Manifest requires the supported schema and a bounded, nonempty files a\
rray.");const i=new Set(["schema","name","description","files","model","provenance"]);if(Object.keys(t).some(f=>!i.has(f)))
throw new TypeError("Unsupported manifest field.");for(const f of["name","description"])if(t[f]!==void 0&&typeof t[f]!="\
string")throw new TypeError(`Manifest ${f} must be a string.`);if(t.model!==void 0&&(!t.model||typeof t.model!="object"||
Array.isArray(t.model)))throw new TypeError("Manifest model extension must be an object.");const o=new Set,s=t.files.map(
f=>{if(!f||typeof f!="object")throw new TypeError("Invalid manifest file.");if(Object.keys(f).some(h=>!["path","cid","si\
ze","sha256","mediaType"].includes(h)))throw new TypeError("Unsupported manifest file field.");const{path:p,size:g}=f;if(typeof p!=
"string"||!p||zt.encode(p).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.test(p)||p.split("/").some(h=>!h||h==="."||h==="..")||
o.has(p))throw new TypeError("Manifest paths must be unique, relative POSIX paths without traversal or URL escapes.");if(!Number.
isSafeInteger(g)||g<0||g>n)throw new RangeError("Invalid file size.");if(f.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(f.sha256))
throw new TypeError("Invalid SHA-256.");if(f.mediaType!==void 0&&(typeof f.mediaType!="string"||f.mediaType.length>256))
throw new TypeError("Invalid media type.");return o.add(p),{...f,cid:Qc(f.cid).toString()}}).sort((f,p)=>f.path<p.path?-1:
f.path>p.path?1:0),a=qe({...t,files:s},0,{remaining:e});if(zt.encode(JSON.stringify(a)).byteLength>e)throw new RangeError(
"Manifest exceeds byte limit.");return a}new TextEncoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextDecoder;
const Vc="peercompute.gpu.resident-stage-executor.v0",Kc="peercompute.gpu.resident-stage-worker-policy.v0";function Y(t,e=null){
return String(t??"").trim()||e}function mt(t){return t==null?null:JSON.parse(JSON.stringify(t))}function gr(t,e=!1){return typeof t==
"boolean"?t:e}function Wc(t,e=null){const r=Math.floor(Number(t));return Number.isFinite(r)&&r>=0?r:e}function Hc(t={},e=null){
const r=t&&typeof t=="object"?t:{},n=Y(r.mode??r.residencyMode,null),i=!!(r.worker||r.workerReady||r.workerModuleUrl||r.
workerType),o=n||(i?"dedicated-worker":"inline"),s=gr(r.workerReady,!1)||!!r.worker,a=o==="dedicated-worker"||o==="webgp\
u-worker"||o==="gpu-compute-worker",f=a?"dedicated-worker":"inline",p=a?s?"worker-ready":"blocked-worker-backend-missing":
"inline-ready";return{schema:Kc,stageId:e,mode:f,status:p,workerType:Y(r.workerType,a?"webgpu-compute-worker":null),workerModuleUrl:Y(
r.workerModuleUrl??r.moduleUrl,null),startupMode:Y(r.startupMode,a?"warm-on-first-use":"inline"),idleTtlMs:Wc(r.idleTtlMs,
a?6e4:null),sameDeviceRequired:gr(r.sameDeviceRequired,a),bufferTransferPolicy:Y(r.bufferTransferPolicy,a?"worker-owns-d\
evice-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:p==="blocked-worker-backend-miss\
ing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function Xc(t,e){
if(typeof t=="function")return t(e);if(t&&typeof t.runStage=="function")return t.runStage(e);throw new Error("[GPUHubMan\
ager] Resident stage worker backend must be a function or expose runStage()")}class Jc{constructor(e={}){this.frameBudgetMs=
e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,
this.residentStageExecutorAliases=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>
"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const r=await navigator.
gpu.requestAdapter(e.adapterOptions);if(!r)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.
device=await r.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,r){
this.hotStore.set(e,r)}registerHotBufferSet(e,r){this.hotStore.set(e,r)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){
return this.hotStore.get(e)}createHotBuffer(e,r,n,i){if(!this.device)throw new Error("[GPUHubManager] Device not initial\
ized");const o=this.device.createBuffer({size:r,usage:n,label:i});return this.hotStore.set(e,o),o}removeHotBuffer(e){this.
hotStore.delete(e)}registerResidentStageExecutor(e,r=null){var f;const n=typeof e=="string"?{stageId:e,executor:r}:{...e||
{}},i=Y(n.stageId??n.id,null);if(!i)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const o=n.
executor||r,s=n.workerRunner||n.workerBackend||((f=n.workerPolicy)==null?void 0:f.workerRunner)||null;if(typeof o!="func\
tion"&&!s)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${i}`);const a={schema:Vc,stageId:i,
lawNodeId:Y(n.lawNodeId,null),runtimeTarget:Y(n.runtimeTarget,s?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-ex\
ecutor"),executor:typeof o=="function"?o:null,workerRunner:s,workerPolicy:Hc({...n.workerPolicy||n.workerResidency||{},workerReady:(n.
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
describeResidentStageExecutor(r.stageId)};return r.workerRunner?Xc(r.workerRunner,n):r.executor(n)}registerTask(e,r){this.
tasks.set(e,r)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const _e="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-\
abl-GGUF",Ae="5ce3fd841676adf2c1a10d7193637d46007e88f7",yr=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd44\
1111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"N\
OTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_X\
S.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,
gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5\
593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913\
dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.js\
on",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"\
5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9a\
e04fff09706ef"}],Zc="This catalog supports verified storage and distribution. Execution is admitted separately by the ma\
naged llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function sn(t){for(const e of Object.
values(t))e&&typeof e=="object"&&sn(e);return Object.freeze(t)}const Yc=sn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.\
8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:_e,revision:Ae,status:"storage-only",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Zc},
license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${_e}/blob/${Ae}/LICENSE`,notice:"Preserve upstream LICENSE\
, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:_e,revision:Ae,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:`https://huggingface.co/${_e}/blob/${Ae}/README.md`,sourceManifestPath:"artifact-manifest.json"},
model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:[
"IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:_e,revision:Ae},weightBytes:14199740480,totalBytes:yr.reduce((t,e)=>t+
e.size,0),files:yr}});function an(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(an),Object.
freeze(t)),t}const ed=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental \
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
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],td=an(Object.fromEntries(
ed.map(t=>{const{dtype:e,sourceModel:r,blockCount:n,nextnPredictLayers:i,...o}=t,a=o.files.find(f=>f.path==="LICENSE").source;
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
revision:o.revision},weightBytes:o.files[0].size,totalBytes:o.files.reduce((f,p)=>f+p.size,0)}]})));function Qt(t){return t&&
typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).forEach(Qt),Object.freeze(t)),t}const ne="Tsotchke-Corporatio\
n",cn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
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
06e0df3640f9ae04fff09706ef"}]}],rd=Qt(Object.fromEntries(cn.map(t=>{const{architecture:e,quantizationTypes:r,sourceModel:n,
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
reduce((s,a)=>s+a.size,0)}]})));Qt({organization:ne,sourceUrl:`https://huggingface.co/${ne}`,checkedAt:"2026-11-04",repositories:[
...cn.map(({id:t,repository:e,revision:r})=>({repository:e,revision:r,catalogId:t,format:"GGUF",codecRequired:!1})),{repository:`${ne}\
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
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],kt=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function dn(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(dn),Object.freeze(t)),t}const nd=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:t,...e})=>[e.id,dn({...e,
status:"execution-candidate",format:"GGUF",capabilities:kt,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:t,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((r,n)=>r+n.size,0)})])),Wd=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Ce,revision:Ie,status:"ex\
ecution-candidate",format:"GGUF",capabilities:kt,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ce}/blob\
/${Ie}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Ce,
revision:Ie,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ce}/blob/${Ie}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Ce,revision:Ie},weightBytes:wt[0].size,totalBytes:wt.reduce((t,e)=>t+e.size,0),files:wt},
...nd,...td,...rd,...Object.fromEntries(Object.entries(Yc).map(([t,e])=>[t,{...e,status:"execution-candidate",capabilities:kt}]))}),
tt=1024**3,le=Object.freeze({maximumBytes:8*tt,maximumFileBytes:2*tt-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*
1024**2}),fn=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),id=["qwen2","qwen3","llama"],Er=["phi","phi3","gemma","gem\
ma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2","nemotron_h"],vr=["idefics3","smolvlm","qwe\
n3_5"],od=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","phi3","phi2","granite","starcoder2","olmo","olmo2",
"stablelm","nemotron","smollm3"],ln=Object.freeze([...[...id,...Er,...vr].map(t=>{const e=vr.includes(t);return Object.freeze(
{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:t,task:e?"image-text-to-text":"text-generation",qualification:"\
candidate",modalities:Object.freeze(e?["text","image"]:["text"]),modules:Object.freeze(e?["embed_tokens","vision_encoder",
"decoder_model_merged"]:["model"]),dtypes:t==="qwen3_5"?Object.freeze(["q4"]):fn,requiresMemoryProfile:Er.includes(t),contextTokens:2048,
maximumBytes:e?t==="qwen3_5"?2*tt:le.legacyMaximumBytes:le.maximumBytes,maximumFileBytes:le.maximumFileBytes})}),...od.map(
t=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,modelArchitecture:t==="qwen35"?"qwen3_5":t,task:"\
text-generation",modalities:Object.freeze(["text"]),qualification:"candidate"}))]);function Vt(t,e){return ln.find(r=>r.
runtime===t&&r.architecture===e)??null}function Hd(t){return ln.filter(e=>e.runtime===t)}function sd(t){const e=typeof t==
"string"?[t]:t&&typeof t=="object"&&!Array.isArray(t)?Object.values(t):[];if(!e.length||e.length>16||e.some(r=>!fn.includes(
r)))throw new Error("Unsupported ONNX precision");return e}function un(t){const e=(t==null?void 0:t["transformers.js_con\
fig"])??{},r=e.device_config??{};return Object.hasOwn(r,"webgpu")?{...e,...r.webgpu}:{...e}}function ad(t,e={}){const r=sd(
t),n=un(e).kv_cache_dtype;return r.some(o=>["fp16","q4f16"].includes(o)||(typeof n=="string"?n:n==null?void 0:n[o])==="f\
loat16")?["shader-f16"]:[]}function K(t,e,r=1048576,n=1){if(!Number.isSafeInteger(t)||t<n||t>r)throw new Error(`Invalid \
model memory dimension: ${e}`);return t}function cd(t){const e=un(t).free_dimension_overrides;if(e&&(typeof e!="object"||
Array.isArray(e)||Object.keys(e).length))throw new Error("Dynamic ONNX free_dimension_overrides are not admitted by this\
 memory profile");const r=t==null?void 0:t.model_type,n=Vt("transformers.js",r);if(!n)throw new Error("Unsupported model\
 memory architecture");const i=n.task==="image-text-to-text"?t.text_config??t:t,o=i.layer_types??i.layers_block_type,s=K(
i.num_hidden_layers??(o==null?void 0:o.length),"layers",512),a=K(i.hidden_size,"hidden size",65536),f=K(i.num_attention_heads,
"attention heads",1024),p=K(i.num_key_value_heads??f,"KV heads",1024),g=K(i.head_dim??a/f,"head dimension",4096),h=K(i.vocab_size??
t.vocab_size,"vocabulary");if(o!==void 0&&(!Array.isArray(o)||o.length!==s||o.some(A=>!["attention","mamba","mlp","moe",
"full_attention","sliding_attention","linear_attention"].includes(A))))throw new Error("Invalid model memory layer types");
let u=s,v=0,b=0,_=0,m=0,c=0,d=0;if(r==="nemotron_h"){if(!o)throw new Error("Nemotron requires explicit recurrent layer t\
ypes");if(u=o.filter(w=>w==="attention").length,v=o.filter(w=>w==="mamba").length,o.some(w=>!["attention","mamba","mlp",
"moe"].includes(w)))throw new Error("Unsupported Nemotron layer type");m=K(i.mamba_num_heads,"SSM heads",1024),c=K(i.mamba_head_dim,
"SSM head dimension",4096),d=K(i.ssm_state_size,"SSM state size",4096);const A=K(i.n_groups,"SSM groups",1024);_=K(i.conv_kernel,
"convolution kernel",256),b=K(m*c+2*A*d,"convolution channels")}return ct({schema:"peercompute.onnx.memory.v1",architecture:r,
layers:s,hiddenSize:a,heads:f,kvHeads:p,headDim:g,vocabulary:h,attentionLayers:u,recurrentLayers:v,convChannels:b,convKernel:_,
ssmHeads:m,ssmHeadDim:c,stateSize:d})}function ct(t){const e=["schema","architecture","layers","hiddenSize","heads","kvH\
eads","headDim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","st\
ateSize"];if(!t||t.schema!=="peercompute.onnx.memory.v1"||!Vt("transformers.js",t.architecture)||Object.keys(t).some(n=>!e.
includes(n)))throw new Error("Invalid model memory profile");for(const n of e.slice(2))K(t[n],n,1048576,["attentionLayer\
s","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(t.layers>512||
t.attentionLayers+t.recurrentLayers>t.layers||t.kvHeads>t.heads||t.architecture!=="nemotron_h"&&t.recurrentLayers)throw new Error(
"Invalid model memory layer geometry");const r=2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*
t.ssmHeadDim*t.stateSize+t.convChannels*t.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*tt)throw new Error("Model cac\
he/state exceeds its bounded memory envelope");return Object.fromEntries(e.map(n=>[n,t[n]]))}function dd(t){const e=ct(t);
return 2*(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*
e.convKernel)*4)}function hn(t,e){if((e==null?void 0:e.model_type)!==t.architecture)throw new Error("Model config archit\
ecture does not match its admitted manifest");if(e.auto_map&&Object.keys(e.auto_map).length)throw new Error("Custom mode\
l code is not admitted");if(t.memoryProfile&&JSON.stringify(ct(t.memoryProfile))!==JSON.stringify(cd(e)))throw new Error(
"Model memory profile differs from its verified config");return ad(t.dtype,e)}const xr="transformers.js",pn="4.3.2",M=Object.
freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:le.maximumBytes,maxFileBytes:le.maximumFileBytes,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),fd=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:M.maxFileBytes,
minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),bn=Object.freeze({maxModelBytes:M.
maxModelBytes,maxFileBytes:M.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:M.maxImagePixels}),
ld=Object.freeze({...bn,maxModelBytes:le.legacyMaximumBytes});function mn(t,{files:e,totalBytes:r,config:n}={}){const i=(t==
null?void 0:t.architecture)==="qwen3_5"?fd:["idefics3","smolvlm"].includes(t==null?void 0:t.architecture)?ld:bn;if(n&&hn(
t,n),e){r=0;for(const p of e){if(!Number.isSafeInteger(p.size)||p.size<0)throw new Error("Invalid model file size");if(p.
size>M.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONNX file must be sm\
aller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=p.size}}if(r!==void 0&&(!Number.isSafeInteger(r)||r<0||r>i.maxModelBytes))
throw Object.assign(new Error(`Model exceeds its admitted file budget of ${i.maxModelBytes/1024**3} GiB`),{code:"ERR_MOD\
EL_PACKAGE_TOO_LARGE"});const o=(t==null?void 0:t.memoryProfile)&&ct(t.memoryProfile);if(o&&o.architecture!==t.architecture)
throw new Error("Model memory architecture mismatch");if(!o&&!(r>le.legacyMaximumBytes))return i;const s=r??0,a=o?dd(o):
0,f=1024**3;return{...i,minimumCpuBytes:Math.max(i.minimumCpuBytes,2*s+2*f+a),minimumGpuBytes:Math.max(i.minimumGpuBytes,
2*s+f+a),cacheBytes:a}}function $t(t="Operation cancelled"){return(t==null?void 0:t.name)==="AbortError"?t:new DOMException(
typeof t=="string"?t:"Operation cancelled","AbortError")}function F(t){if(t!=null&&t.aborted)throw $t(t.reason)}function Ge(t){
if(typeof t!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(t))throw new Error("Invalid model session ID");return t}function rt(t){
if(typeof t!="string"||!t||new TextEncoder().encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("\
/")||t.split("/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return t}function ud(t){
let e;try{e=JSON.stringify(t)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>
M.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(e);if(r.schema!=="pe\
ercompute.artifact.manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>M.maxFiles)throw new Error("In\
valid model manifest files");const n=new Set,i=mn(r.model,{files:r.files});let o=0;for(const h of r.files){if(rt(h.path),
n.has(h.path))throw new Error("Duplicate model artifact path");n.add(h.path);const u=$.parse(h.cid);if(![85,112].includes(
u.code)||u.multihash.code!==18||u.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(
h.size)||h.size<0||!/^[a-f0-9]{64}$/i.test(h.sha256??""))throw new Error("Invalid model file size/digest");if(h.sha256=h.
sha256.toLowerCase(),o+=h.size,!Number.isSafeInteger(o)||o>i.maxModelBytes)throw new Error("Model exceeds its admitted f\
ile budget")}const s=r.model,a=Vt(xr,s==null?void 0:s.architecture);if((s==null?void 0:s.runtime)!==xr||s.runtimeVersion!==
pn||!a)throw new Error("Model runtime, architecture or dtype is not approved");if(s.task??(s.task=a.task),s.task!==a.task)
throw new Error("Model task does not match its admitted architecture");if((a.requiresMemoryProfile||a.task==="text-gener\
ation"&&o>le.legacyMaximumBytes)&&!s.memoryProfile)throw new Error("This model requires a verified config memory profile");
const f=typeof s.dtype=="string"?[["model",s.dtype]]:s.dtype&&typeof s.dtype=="object"&&!Array.isArray(s.dtype)?Object.entries(
s.dtype):[];if(!f.length||f.length>16||f.some(([h,u])=>!/^[A-Za-z0-9_-]{1,100}$/.test(h)||!["fp32","fp16","q4","q4f16","\
q8"].includes(u)))throw new Error("Invalid model dtype configuration");if(s.architecture==="qwen3_5"&&f.some(([,h])=>h!==
"q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const p=h=>h==="fp32"?"":h==="q8"?"_quantized":`_${h}`,
g=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof s.dtype!="string"||s.task==="text-generation")&&g.
push(...f.map(([h,u])=>`onnx/${h}${p(u)}.onnx`)),s.task==="image-text-to-text")for(const h of["embed_tokens","vision_enc\
oder","decoder_model_merged"]){const u=typeof s.dtype=="string"?s.dtype:s.dtype[h];if(!u)throw new Error("Multimodal dty\
pe configuration is missing a module");g.push(`onnx/${h}${p(u)}.onnx`),s.architecture==="qwen3_5"&&g.push(`onnx/${h}${p(
u)}.onnx_data`)}if(g.some(h=>!n.has(h)))throw new Error("Incomplete model package");if(s.task==="image-text-to-text"&&!n.
has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor configuration is \
missing");if(s.requiredFeatures!==void 0&&(!Array.isArray(s.requiredFeatures)||s.requiredFeatures.length>32||s.requiredFeatures.
some(h=>typeof h!="string"||h.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,totalBytes:o,resourcePolicy:i}}
function hd(t,e){const r=new URL(e),n={};for(const i of["mjs","wasm"]){if(typeof(t==null?void 0:t[i])!="string")throw new Error(
"Trusted ORT runtime assets are required");const o=new URL(t[i],r);if(o.origin!==r.origin||o.username||o.password||o.hash||
!["http:","https:"].includes(o.protocol)||!o.pathname.endsWith(`.${i}`))throw new Error("ORT assets must be approved sam\
e-origin runtime files");n[i]=o.href}return n}const pd="peercompute.model-artifact-read.v1",Kt=pd;function wn(t,e){var n;
const r=i=>e(i.data);return t.addEventListener("message",r),(n=t.start)==null||n.call(t),()=>t.removeEventListener("mess\
age",r)}function W(t,e,r=[]){t.postMessage({protocol:Kt,...e},r)}function Xd(t,{store:e,manifest:r,chunkBytes:n=M.chunkBytes,
maxReads:i=M.maxReads}={}){if(!(e!=null&&e.stat)||!(e!=null&&e.openRead))throw new Error("A verified artifact store is r\
equired");if(!Number.isInteger(n)||n<1||n>M.chunkBytes||!Number.isInteger(i)||i<1||i>M.maxReads)throw new Error("Invalid\
 artifact bridge bounds");const o=new Map(r.files.map(u=>[rt(u.path),u])),s=new Map;let a=!1,f=0;async function p(u,v){var _,
m;const b=s.get(u);if(b){s.delete(u),b.controller.abort(v);try{await((m=(_=b.iterator)==null?void 0:_.return)==null?void 0:
m.call(_))}catch{}}}async function g(u){var b,_;if(a||(u==null?void 0:u.protocol)!==Kt||typeof u.id!="string"||u.id.length>
128)return;const{id:v}=u;try{if(u.type==="cancel"){await p(v,"Reader cancelled");return}if(u.type==="open"){if(s.has(v))
throw new Error("Duplicate artifact reader");if(s.size>=i)throw new Error("Artifact reader limit reached");const w=o.get(
u.path);if(!w)throw new Error("Artifact path is not in the manifest");const x=u.offset??0,S=u.length??w.size-x;if(!Number.
isSafeInteger(x)||!Number.isSafeInteger(S)||x<0||S<0||x>w.size||S>w.size-x)throw new Error("Invalid artifact byte range");
const E={controller:new AbortController,remaining:S,pulling:!1};s.set(v,E);const y=await e.stat(w.cid);if(F(E.controller.
signal),a||s.get(v)!==E)return;if(!y||y.status!=="complete"||y.size!==w.size||y.sha256!==w.sha256)throw new Error("Model\
 artifact is incomplete or has a different size");const I=await e.openRead(w.cid,{offset:x,length:S,signal:E.controller.
signal});if(E.iterator=I[Symbol.asyncIterator](),a||E.controller.signal.aborted||s.get(v)!==E){await((_=(b=E.iterator).return)==
null?void 0:_.call(b));return}W(t,{type:"ready",id:v,size:S});return}if(u.type!=="pull")return;const m=s.get(v);if(!(m!=
null&&m.iterator)||m.pulling)throw new Error("Invalid artifact pull credit");m.pulling=!0;const c=await m.iterator.next();
if(a||m.controller.signal.aborted||s.get(v)!==m)return;if(c.done){if(m.remaining!==0)throw new Error("Truncated model ar\
tifact");s.delete(v),W(t,{type:"end",id:v});return}const d=c.value;if(!(d instanceof Uint8Array)||!d.byteLength||d.byteLength>
n||d.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bounds");m.remaining-=d.byteLength,m.pulling=
!1,f+=d.byteLength;const A=d.slice();W(t,{type:"chunk",id:v,bytes:A},[A.buffer])}catch(m){await p(v,m),a||W(t,{type:"err\
or",id:v,message:(m==null?void 0:m.message)||"Artifact read failed"})}}const h=wn(t,u=>{g(u)});return{getStats:()=>({activeReads:s.
size,deliveredBytes:f}),async close(){if(!a){a=!0;try{W(t,{type:"closed",message:"Artifact bridge closed"})}catch{}h(),await Promise.
all([...s.keys()].map(u=>p(u,"Artifact bridge closed"))),t.close()}}}}function bd(t,{manifest:e,baseUrl:r,signal:n,chunkBytes:i=M.
chunkBytes,maxReads:o=M.maxReads,maxQueuedReads:s=32}={}){if(!Number.isInteger(o)||o<1||o>M.maxReads||!Number.isInteger(
s)||s<0||s>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),f=new Map(e.files.map(c=>[rt(c.path),
c])),p=new Map,g=[];let h=0,u=!1;function v(){for(;!u&&p.size<o&&g.length;){const c=g.shift();p.set(c.id,c),c.active=!0,
W(t,{type:"open",id:c.id,path:c.path})}}function b(c,d){var w,x,S,E;p.delete(c.id);const A=g.indexOf(c);if(A>=0&&g.splice(
A,1),n==null||n.removeEventListener("abort",c.abort),(w=c.requestSignal)==null||w.removeEventListener("abort",c.abort),d){
(x=c.reject)==null||x.call(c,d);try{(S=c.streamController)==null||S.error(d)}catch{}}(E=c.resolvePull)==null||E.call(c),
v()}const _=wn(t,c=>{if((c==null?void 0:c.protocol)!==Kt)return;const d=p.get(c.id);if(d){if(c.type==="error"){b(d,new Error(
c.message));return}if(c.type==="ready"){if(d.ready||c.size!==d.file.size){b(d,new Error("Invalid artifact response size")),
W(t,{type:"cancel",id:d.id});return}d.ready=!0,W(t,{type:"pull",id:d.id})}else if(c.type==="chunk"){if(!d.ready||!d.resolvePull||
!(c.bytes instanceof Uint8Array)||!c.bytes.byteLength||c.bytes.byteLength>i||d.received+c.bytes.byteLength>d.file.size){
W(t,{type:"cancel",id:d.id}),b(d,new Error("Invalid artifact chunk"));return}d.received+=c.bytes.byteLength,d.streamController.
enqueue(c.bytes);const A=d.resolvePull;d.resolvePull=null,A()}else c.type==="end"&&(!d.ready||d.received!==d.file.size?b(
d,new Error("Truncated artifact response")):(d.streamController.close(),b(d)))}});async function m(c,d={}){if(u)throw new Error(
"Artifact bridge is closed");if(F(n),F(d.signal),d.method&&d.method!=="GET")throw new Error("Model adapter supports GET \
only");const A=String(c);if(/[\\]/.test(A)||/%(?:2e|2f|5c|00)/i.test(A)||/\/(?:\.|\.\.)(?:\/|$)/.test(A))throw new Error(
"Invalid artifact URL");const w=new URL(A,a);if(w.origin!==a.origin||w.username||w.password||w.search||w.hash||!w.pathname.
startsWith(a.pathname))throw new Error("Model path is outside its manifest");const x=rt(decodeURIComponent(w.pathname.slice(
a.pathname.length))),S=f.get(x);if(!S)return new Response("Artifact path is not in the manifest",{status:404});const E=`\
read-${++h}`,y={id:E,path:x,file:S,requestSignal:d.signal,received:0,ready:!1,active:!1,queued:!1};y.abort=()=>{var C;y.
active&&W(t,{type:"cancel",id:E}),b(y,$t((n==null?void 0:n.reason)??((C=d.signal)==null?void 0:C.reason)))};const I=new ReadableStream(
{start(C){y.streamController=C},pull(){if(u)throw new Error("Artifact bridge is closed");if(F(n),F(d.signal),!y.active&&
!y.queued&&p.size>=o&&g.length>=s)throw new Error("Artifact reader limit reached");return new Promise(C=>{var B;y.resolvePull=
C,y.ready?W(t,{type:"pull",id:E}):y.queued||(y.queued=!0,n==null||n.addEventListener("abort",y.abort,{once:!0}),(B=d.signal)==
null||B.addEventListener("abort",y.abort,{once:!0}),g.push(y),v())})},cancel(){y.active&&W(t,{type:"cancel",id:E}),b(y)}},
{highWaterMark:0});return new Response(I,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"applicat\
ion/octet-stream"}})}return{fetch:m,close(c="Artifact bridge closed"){if(!u){u=!0;for(const d of[...p.values(),...g])d.active&&
W(t,{type:"cancel",id:d.id}),b(d,$t(c));_(),t.close()}}}}const md="4.3.2",wd=new Set(["qwen3_5","qwen3_5_text"]),gt=new WeakMap,
yt="_get_text_only_rope_index";function Sr(t,e,r){var o,s,a,f;const[n,i]=t??[];if((n==null?void 0:n.type)!=="int64"||(i==
null?void 0:i.type)!=="int64"||((o=n.dims)==null?void 0:o.length)!==3||n.dims[0]!==3||n.dims[1]!==e||n.dims[2]!==r||((s=
i.dims)==null?void 0:s.length)!==2||i.dims[0]!==e||i.dims[1]!==1||((a=n.data)==null?void 0:a.length)!==3*e*r||((f=i.data)==
null?void 0:f.length)!==e)throw new Error("Unsupported Qwen text position result");return{positions:n,deltas:i}}function gd(t,e){
var a,f,p;if(((a=e==null?void 0:e.env)==null?void 0:a.version)!==md||!wd.has((f=t==null?void 0:t.config)==null?void 0:f.
model_type))return!1;if(gt.has(t)){if(t[yt]!==gt.get(t))throw new Error("Qwen text position compatibility was replaced");
return!0}const r=t[yt];if(typeof r!="function"||typeof e.Tensor!="function")throw new Error("Qwen text position compatib\
ility is unavailable");const n=new e.Tensor("int64",[10n,11n],[1,2]),i=new e.Tensor("int64",[1n,1n],[1,2]);let o;try{o=r.
call(t,n,i);const{positions:g,deltas:h}=Sr(o,1,2);if([...g.data].some((u,v)=>u!==BigInt(v%2)))throw new Error("Unsupport\
ed Qwen text position calculation");if(h.data[0]===0n)return!1;if(h.data[0]!==4n)throw new Error("Unsupported Qwen text \
position offset")}finally{for(const g of new Set([n,i,...Array.isArray(o)?o:[]]))(p=g==null?void 0:g.dispose)==null||p.call(
g)}function s(g,h){var v,b;const u=r.call(this,g,h);if(!h)return u;try{const[_,m]=h.dims??[];if(((v=h.dims)==null?void 0:
v.length)!==2||!Number.isSafeInteger(_)||_<1||!Number.isSafeInteger(m)||m<1)throw new Error("Invalid Qwen text position \
dimensions");const{positions:c,deltas:d}=Sr(u,_,m);for(let w=0;w<_;w++){let x=c.data[w*m];for(let S=1;S<m;S++){const E=c.
data[w*m+S];E>x&&(x=E)}if(d.data[w]!==x+1n+BigInt(m))throw new Error("Qwen text position behavior changed")}const A=2n*BigInt(
m);for(let w=0;w<_;w++)d.data[w]-=A;return u}catch(_){for(const m of new Set(Array.isArray(u)?u:[]))(b=m==null?void 0:m.
dispose)==null||b.call(m);throw _}}return Object.defineProperty(t,yt,{value:s,configurable:!0,writable:!0}),gt.set(t,s),
!0}const je=t=>new TextEncoder().encode(t).byteLength;function yd(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function gn(t){if(t==null)return null;
if(!Number.isSafeInteger(t.width)||!Number.isSafeInteger(t.height)||t.width<1||t.height<1||t.width*t.height>M.maxImagePixels||
t.channels!==4||!(t.data instanceof Uint8Array||t.data instanceof Uint8ClampedArray)||t.data.byteLength!==t.width*t.height*
4||t.data.byteLength>M.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fil\
es are not accepted");return t}function yn(t){const e=t.messages??(typeof t.prompt=="string"?[{role:"user",content:t.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>M.maxMessages)throw new Error("Invalid inference messages");let r=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=je(n.content),r>M.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function En(t){var n;if(!t)return;let e;const r=new Set;for(const i of[t.model,t.
processor,t.tokenizer])if(!(!i||r.has(i))){r.add(i);try{await((n=i.dispose)==null?void 0:n.call(i))}catch(o){e??(e=o)}}if(e)
throw e}function Ot(t,e=new Set){if(!(!t||typeof t!="object"||e.has(t))){if(e.add(t),typeof t.dispose=="function"){t.dispose();
return}for(const r of Object.values(t))Ot(r,e)}}function Ed(t){const e=t.findIndex(n=>n.role==="user");if(e<0)return null;
const r=t.findIndex((n,i)=>i>e&&n.role==="user");return r<0?null:t.filter((n,i)=>i<e||i>=r||n.role==="system")}function vd(t,e,r){
const n={...t.config};for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,t.generation_config);
const i=Array.isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],o=e.at(-1),s=a=>typeof a=="bigint"||Number.isSafeInteger(
a)&&a>=0;return s(o)&&i.some(a=>s(a)&&BigInt(a)===BigInt(o))?"stop":e.length>=r?"length":"unknown"}function Z(t,e,r){const n=t===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${t}: ${String(
(e==null?void 0:e.message)??e??"operation failed").slice(0,240)}`,i=new Error(`Model session lost: ${r} ${n}`,{cause:e});
return i.code=t==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",i}function xd(t){let e,r,n=!1;const i=a=>{
var f;n||(t.lost=!0,(!t.gpuFailure||a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(t.gpuFailure=a),(f=t.active)==null||f.abort(
a))},o=({error:a})=>{var f;return i(Z(((f=a==null?void 0:a.constructor)==null?void 0:f.name)==="GPUOutOfMemoryError"?"ou\
t-of-memory":"uncaptured error",a,(r==null?void 0:r.stage)??"resident model"))},s=()=>{if(!(!r||r.device)){r.device=e;for(const a of[
"validation","out-of-memory","internal"])e.pushErrorScope(a),r.filters.push(a)}};return{attach(a){var f,p;if(e&&e!==a)throw Z(
"device changed",null,"load");if(!e){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!="function"||typeof((f=
a.queue)==null?void 0:f.onSubmittedWorkDone)!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!=
"function"||typeof a.destroy!="function"||typeof((p=a.lost)==null?void 0:p.then)!="function")throw Z("device unavailable",
null,"load");e=a,t.runtimeDevice=e,e.addEventListener("uncapturederror",o),e.lost.then(g=>i(Z("device lost",g,(r==null?void 0:
r.stage)??"resident model")),g=>i(Z("device lost",g,(r==null?void 0:r.stage)??"resident model")))}try{s()}catch(g){const h=Z(
"error scope failure",g,(r==null?void 0:r.stage)??"load");throw i(h),h}},async run(a,f){if(t.lost)throw t.gpuFailure??Z(
"device lost",null,a);if(r)throw new Error("Overlapping model GPU operations are not allowed");const p={stage:a,filters:[],
device:null};r=p;let g,h;try{if(e&&this.attach(e),g=await f(),!e)throw Z("device unavailable",null,a)}catch(b){h=b}if(e)
try{await e.queue.onSubmittedWorkDone()}catch(b){i(Z("queue failure",b,a))}const u=await Promise.all(p.filters.reverse().
map(async b=>{try{return{filter:b,error:await p.device.popErrorScope()}}catch(_){return{filter:b,error:_,scopeFailed:!0}}}));
r=null;for(const b of u)b.scopeFailed&&i(Z("error scope failure",b.error,a));const v=["out-of-memory","internal","valida\
tion"].map(b=>u.find(_=>_.filter===b&&_.error&&!_.scopeFailed)).find(Boolean);if(v&&i(Z(v.filter,v.error,a)),h instanceof
WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((h==null?void 0:h.message)??"")){const b=new Error("Model \
session lost: native inference runtime failed",{cause:h});b.code="ERR_MODEL_RUNTIME",i(b)}if(typeof(h==null?void 0:h.code)==
"string"&&h.code.startsWith("ERR_MODEL_GPU")&&i(h),t.gpuFailure)throw t.gpuFailure;if(h)throw h;return g},dispose(){n=!0,
e==null||e.removeEventListener("uncapturederror",o)}}}function Sd(t){var i;const e=["maxBindGroups","maxComputeWorkgroup\
StorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBuff\
erSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSi\
zeZ"],r={};for(const o of e){const s=(i=t.limits)==null?void 0:i[o];if(!Number.isSafeInteger(s)||s<=0)throw new Error(`W\
ebGPU adapter has an invalid ${o} limit`);r[o]=s}const n=["chromium-experimental-subgroup-matrix","timestamp-query","sha\
der-f16","subgroups","subgroup-size-control"].filter(o=>t.features.has(o));return{requiredLimits:r,requiredFeatures:n}}async function _r(t){
var e,r,n;await En(t.components),(e=t.restoreGpuEvidence)==null||e.call(t),(r=t.gpuGuard)==null||r.dispose(),(n=t.ownedDevice)==
null||n.destroy(),t.ownedDevice=null}async function _d({library:t,modelPath:e,options:r,manifest:n,adapterFeatures:i=[]}){
const o={};try{const s=await t.AutoConfig.from_pretrained(e,r),a=hn(n.model,s);for(const p of a)if(!i.includes(p))throw new Error(
`Model config requires unsupported GPU feature: ${p}`);const f={...r,config:s};if(n.model.architecture==="qwen3_5"&&(f.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(o.processor=await t.AutoProcessor.from_pretrained(e,r),n.model.architecture===
"qwen3_5"){const p=o.processor.image_processor;if(!p)throw new Error("Qwen3.5 image processor is unavailable");p.min_pixels=
256*256,p.max_pixels=mn(n.model).maxProcessedImagePixels,p.do_normalize??(p.do_normalize=!0)}o.tokenizer=o.processor.tokenizer,
o.model=await t.AutoModelForImageTextToText.from_pretrained(e,f)}else o.tokenizer=await t.AutoTokenizer.from_pretrained(
e,r),o.model=await t.AutoModelForCausalLM.from_pretrained(e,f);return o}catch(s){throw await En(o),s}}function Ar(t){return{
sessionId:t.sessionId,manifestCid:t.manifestCid,status:t.lost?"lost":t.status,task:t.manifest.model.task,dtype:t.manifest.
model.dtype,workerId:t.workerId,adapter:t.adapter,runtimeAdapter:t.runtimeAdapter??null,gpuDispatches:t.gpuDispatches??0,
gpuSubmissions:t.gpuSubmissions??0,gpuProfileSamples:t.gpuProfileSamples??0,collectGpuEvidence:t.collectGpuEvidence===!0,
runtimeFeatures:t.runtimeFeatures??[],generatedRequests:t.generatedRequests,qwenTextRopeCompatibility:t.qwenTextRopeCompatibility===
!0}}function vn({loadLibrary:t=()=>Bn(()=>import("./transformers.web-Dn8CClj3.js"),[],import.meta.url),loadModel:e=_d,
gpu:r=(o=>(o=globalThis.navigator)==null?void 0:o.gpu)(),baseUrl:n=(s=>(s=globalThis.location)==null?void 0:s.href)(),assertWorker:i=yd}={}){
const a=new Map;let f;async function p(h,u){var d,A,w,x,S,E;if(a.size)throw new Error("This inference worker already has\
 a resident/loading model");const v=Ge(h.sessionId),{manifest:b}=ud(h.manifest),_=hd(h.runtimeAssets,n);if(!((d=h.artifactPort)!=
null&&d.postMessage))throw new Error("An artifact reader port is required");F(u.signal);const m={sessionId:v,manifest:b,
manifestCid:h.manifestCid,status:"loading",workerId:u.workerId??null,generatedRequests:0,components:null};a.set(v,m);let c;
try{const y=await(r==null?void 0:r.requestAdapter({powerPreference:"high-performance"}));if(F(u.signal),!y||(A=y.info)!=
null&&A.isFallbackAdapter||y.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fall\
back is disabled");const I=typeof b.model.dtype=="string"?[b.model.dtype]:Object.values(b.model.dtype),C=new Set(b.model.
requiredFeatures??[]);I.some(U=>["fp16","q4f16"].includes(U))&&C.add("shader-f16");for(const U of C)if(!y.features.has(U))
throw new Error(`Model requires unsupported GPU feature: ${U}`);m.adapter={vendor:((w=y.info)==null?void 0:w.vendor)??"",
architecture:((x=y.info)==null?void 0:x.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[...C]};const B=await(f??
(f=t()));if(F(u.signal),B.env.version!==pn)throw new Error("Unexpected Transformers runtime version");const T=new URL("/\
__peercompute_models/",n);c=bd(h.artifactPort,{manifest:b,baseUrl:new URL(`${v}/`,T).href,signal:u.signal});const{env:O}=B;
O.logLevel=50,O.allowLocalModels=!0,O.allowRemoteModels=!1,O.localModelPath=T.pathname,O.useBrowserCache=!1,O.useFSCache=
!1,O.useWasmCache=!1,O.fetch=async(...U)=>{var D;try{return await c.fetch(...U)}catch(k){throw(D=u.emitProgress)==null||
D.call(u,{type:"artifact-read-error",sessionId:v,message:k.message}),k}},O.backends.onnx.wasm.proxy=!1,O.backends.onnx.wasm.
numThreads=1,O.backends.onnx.wasm.wasmPaths=_,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=
h.collectGpuEvidence===!0,O.backends.onnx.webgpu&&(O.backends.onnx.webgpu.profiling={mode:h.collectGpuEvidence===!0?"def\
ault":"off",ondata:()=>{m.gpuProfileSamples+=1}});const ge={local_files_only:!0,device:"webgpu",dtype:b.model.dtype,session_options:{
executionProviders:["webgpu"]},progress_callback:U=>{var D,k;(D=u.signal)!=null&&D.aborted||(k=u.emitProgress)==null||k.
call(u,{type:"model-load",sessionId:v,status:String(U.status??"").slice(0,40),file:typeof U.file=="string"?U.file.slice(
0,512):void 0,loaded:Number.isFinite(U.loaded)?U.loaded:void 0,total:Number.isFinite(U.total)?U.total:void 0})}};m.library=
B,m.gpuGuard=xd(m),await m.gpuGuard.run("load",async()=>{const U=O.backends.onnx.webgpu;if(!U)throw new Error("The WebGP\
U runtime is unavailable");U.adapter=y,m.ownedDevice=await y.requestDevice(Sd(y)),m.gpuGuard.attach(m.ownedDevice),ge.session_options.
executionProviders=[{name:"webgpu",device:m.ownedDevice}],m.components=await e({library:B,modelPath:v,options:ge,manifest:b,
adapterFeatures:[...y.features]}),m.qwenTextRopeCompatibility=gd(m.components.model,B);for(const D of C)if(!m.runtimeDevice.
features.has(D))throw new Error(`ORT device is missing required GPU feature: ${D}`);F(u.signal)});const z=m.runtimeDevice;
if(m.runtimeFeatures=[...(z==null?void 0:z.features)??[]],m.collectGpuEvidence&&z){const U=z.createCommandEncoder.bind(z),
D=z.queue.submit.bind(z.queue),k=Object.getOwnPropertyDescriptor(z,"createCommandEncoder"),Q=Object.getOwnPropertyDescriptor(
z.queue,"submit");m.restoreGpuEvidence=()=>{k?Object.defineProperty(z,"createCommandEncoder",k):delete z.createCommandEncoder,
Q?Object.defineProperty(z.queue,"submit",Q):delete z.queue.submit,m.restoreGpuEvidence=null},z.createCommandEncoder=(...ye)=>{
const H=U(...ye),Ee=H.beginComputePass.bind(H);return H.beginComputePass=(...De)=>{const X=Ee(...De);for(const ee of["di\
spatchWorkgroups","dispatchWorkgroupsIndirect"]){const ae=X[ee].bind(X);X[ee]=(...dt)=>{const te=ae(...dt);return m.gpuDispatches+=
1,te}}return X},H},z.queue.submit=(...ye)=>{const H=D(...ye);return m.gpuSubmissions+=1,H}}const se=(z==null?void 0:z.adapterInfo)??
((E=(S=O.backends.onnx.webgpu)==null?void 0:S.adapter)==null?void 0:E.info);if(se){if(se.isFallbackAdapter)throw new Error(
"ORT selected a software GPU adapter");m.runtimeAdapter={vendor:se.vendor,architecture:se.architecture,isFallbackAdapter:se.
isFallbackAdapter??!1}}if(F(u.signal),m.lost)throw m.gpuFailure;return m.status="ready",Ar(m)}catch(y){try{await _r(m),a.
delete(v)}catch(I){m.status="ready",m.lost=!0;const C=new Error(`MODEL_DISPOSE_FAILED: ${I.message}`);throw C.code="MODE\
L_DISPOSE_FAILED",C}throw y}finally{c==null||c.close(),c||h.artifactPort.close()}}async function g(h,u){var O,ge,z,se;const v=a.
get(Ge(h.sessionId));if(!v||v.lost)throw new Error("Model session lost or not loaded");if(v.status!=="ready")throw new Error(
"Model session is busy");const b=Ge(h.requestId),_=h.maxNewTokens??M.maxNewTokens;if(!Number.isInteger(_)||_<1||_>M.maxNewTokens)
throw new Error("Generation exceeds its output-token budget");let m=yn(h);const c=gn(h.image);if(c&&v.manifest.model.task!==
"image-text-to-text")throw new Error("This model does not admit image inputs");F(u.signal);const d=new AbortController,A=new v.
library.InterruptableStoppingCriteria,w=()=>{var U;d.abort((U=u.signal)==null?void 0:U.reason),A.interrupt()};(O=u.signal)==
null||O.addEventListener("abort",w,{once:!0}),d.signal.addEventListener("abort",()=>A.interrupt(),{once:!0}),v.active=d,
v.requestId=b,v.status="generating";let x,S,E=0,y=0,I,C=!1;const B=v.gpuDispatches??0,T=v.gpuSubmissions??0;try{F(u.signal);
const{tokenizer:U,processor:D,model:k}=v.components;let Q;for(;;){F(d.signal);let X=m;if(D&&(X=m.map(te=>({role:te.role,
content:[{type:"text",text:te.content}]})),c)){const te=X.findLast(xn=>xn.role==="user");if(!te)throw new Error("An imag\
e requires a user message");te.content.unshift({type:"image"})}const ee=(D??U).apply_chat_template(X,{tokenize:!1,add_generation_prompt:!0,
enable_thinking:!1});if(typeof ee!="string"||je(ee)>M.maxPromptBytes)throw new Error("Templated prompt exceeds its byte \
budget");if(c){const te=new v.library.RawImage(c.data,c.width,c.height,c.channels);x=await D(ee,te,{do_image_splitting:!1})}else
x=await U(ee,{truncation:!1,padding:!1});if(F(d.signal),Q=(z=(ge=x.input_ids)==null?void 0:ge.dims)==null?void 0:z.at(-1),
!Number.isSafeInteger(Q)||Q<1)throw new Error("Invalid model input token count");if(Q+_<=M.maxContextTokens)break;const ae=Ed(
m);if(!ae)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or \
request fewer output tokens");const dt=x;x=void 0,Ot(dt),m=ae,C=!0}F(d.signal);const ye=new v.library.TextStreamer(U,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:X=>{var ee;if(!(d.signal.aborted||I)){if(y+=je(X),y>M.maxOutputBytes){I=new Error(
"Generated text exceeded its byte budget"),d.abort(I);return}try{if(((ee=u.emitProgress)==null?void 0:ee.call(u,{type:"t\
oken",sessionId:v.sessionId,requestId:b,sequence:E++,text:X}))===!1)throw new Error("Token consumer rejected output")}catch(ae){
I=ae,d.abort(ae)}}}});if(await v.gpuGuard.run("generation",async()=>{S=await k.generate({...x,max_new_tokens:_,do_sample:!1,
streamer:ye,stopping_criteria:[A]})}),I)throw I;if(v.lost)throw v.gpuFailure;F(d.signal);const H=S.tolist();if(H.length!==
1||H[0].length<Q||H[0].length>Q+_)throw new Error("Model returned an over-budget token sequence");const Ee=H[0].slice(Q),
De=U.decode(Ee,{skip_special_tokens:!0});if(je(De)>M.maxOutputBytes)throw new Error("Generated text exceeds its byte bud\
get");return v.generatedRequests+=1,{sessionId:v.sessionId,requestId:b,text:De,inputTokens:Q,outputTokens:Ee.length,finishReason:vd(
k,Ee,_),contextTruncated:C,workerId:v.workerId,gpuDispatches:(v.gpuDispatches??0)-B,gpuSubmissions:(v.gpuSubmissions??0)-
T,gpuProfileSamples:v.gpuProfileSamples??0}}catch(U){throw v.gpuFailure??U}finally{(se=u.signal)==null||se.removeEventListener(
"abort",w);try{const U=new Set;let D;for(const k of[x,S])try{Ot(k,U)}catch(Q){D??(D=Q)}if(D){v.lost=!0;const k=v.gpuFailure??
new Error("Model session lost: tensor cleanup failed",{cause:D});throw k.code??(k.code="MODEL_DISPOSE_FAILED"),v.gpuFailure=
k,k}}finally{v.active=null,v.requestId=null,v.status="ready"}}}return async function(u={},v={}){var _;if(i(),u.command===
"load")return p(u,v);if(u.command==="generate")return g(u,v);const b=a.get(Ge(u.sessionId));if(u.command==="status")return b?
Ar(b):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return(b==null?void 0:b.requestId)===u.requestId&&
((_=b.active)==null||_.abort("Generation cancelled")),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="u\
nload"){if(!b)return{sessionId:u.sessionId,status:"absent"};if(b.status!=="ready")throw new Error("Cancel and await acti\
ve model work before unloading");b.status="unloading";try{await _r(b)}catch(m){b.status="ready",b.lost=!0;const c=new Error(
`MODEL_DISPOSE_FAILED: ${m.message}`);throw c.code="MODEL_DISPOSE_FAILED",c}return a.delete(u.sessionId),{sessionId:u.sessionId,
status:"unloaded"}}throw new Error("Unknown model task command")}}const Ad=vn(),Cd=(t,e)=>Ad(t,e),Jd=Object.freeze(Object.
defineProperty({__proto__:null,createModelTaskRuntime:vn,handleModelTask:Cd,normalizeModelMessages:yn,validateImageInput:gn},
Symbol.toStringTag,{value:"Module"})),Id=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...Id,"co\
mpute_probabilities"]);let pe=null,Cr=null;async function Zd(){if(pe)return pe;try{return Cr=new Jc({frameBudgetMs:6}),pe=
await Cr.initialize(),pe}catch(t){console.warn("[webgpuphys] GPU hub unavailable, falling back to local WebGPU init",t);
const{device:e}=await An();return pe=e,pe}}export{pd as A,$ as C,Wd as G,M,le as O,Bn as _,ud as a,Ge as b,gn as c,$t as d,hn as e,rt as f,Zd as g,Kd as h,bd as i,
Hd as l,Jd as m,yn as n,Xd as s,F as t,hd as v};
