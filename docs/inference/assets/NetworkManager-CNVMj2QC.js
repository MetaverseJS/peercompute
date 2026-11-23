const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./IpfsArtifactTransport-D8IQLqOX.js","./main-C89yjy-g.js","./index-B60xyIcO.js","./main-LVsr3z-5.css","./ArtifactProviderRecord-BAxGrAux.js","./PeerInferenceService-BV7U6-l0.js"])))=>i.map(i=>d[i]);
import{_ as jc}from"./index-B60xyIcO.js";import{I as L,r as Hv,a as jv,b as Xv,e as Qv,p as hu,c as Yv,d as Jv,i as va,f as Zv,
C as Hi,g as Om,h as Bm,j as zm,k as Vm,l as ts,m as eS,n as qm,o as du,q as as,s as Wm,t as B,u as tS,v as nS,w as rS,x as _n,
y as Sa,z as sS,A as iS,B as Km,D as fu,E as ra,F as Gm,G as ni,H as Hd,J as oS,K as aS,L as Hm,N as cs,O as kt,Q as cS,
P as ir,R as ls,U as sa,S as Yr,T as jm,V as jd,W as lS,X as Gs,Y as uS,Z as hS,_ as dS,$ as fS,a0 as pS,a1 as vr,a2 as Dt,
a3 as or,a4 as Oe,a5 as pc,a6 as Tr,a7 as O,a8 as Ft,a9 as ri,aa as pu,ab as Mh,ac as gu,ad as gS,ae as mS,af as bS,ag as te,
ah as gc,ai as yS,aj as wS,ak as je,al as q,am as Xm,an as ia,ao as Qm,ap as Ai,aq as Ym,ar as mu,as as vS,at as bu,au as SS,
av as Y,aw as Aa,ax as AS,ay as Xd,az as Jm,aA as _S,aB as Ph,aC as Zm,aD as eb,aE as Ut,aF as tb,aG as nb,aH as ES,aI as CS,
aJ as xS,aK as yu,aL as po,aM as rb,aN as Nn,aO as $n,aP as Dr,aQ as se,aR as ie,aS as oe,aT as $r,aU as Jt,aV as ji,aW as wu,
aX as IS,aY as oa,aZ as MS,a_ as PS,a$ as mc,b0 as sb,b1 as ib,b2 as TS,b3 as DS,b4 as $S,b5 as Qd,b6 as ob,b7 as kS,b8 as LS}from"./main-C89yjy-g.js";
const RS=Symbol.for("@libp2p/connection"),Yd=Symbol.for("@libp2p/content-routing");class NS extends Event{data;constructor(e,t){
super("message",t),this.data=e}}class bc extends Event{error;local;constructor(e,t,r){super("close",r),this.error=t,this.
local=e}}class FS extends bc{constructor(e,t){super(!0,e,t)}}class US extends bc{constructor(e,t){super(!1,e,t)}}const _a=Symbol.
for("@libp2p/peer-discovery"),Jd=Symbol.for("@libp2p/peer-routing"),Th="keep-alive";function Dh(n){return n!=null&&typeof n.
start=="function"&&typeof n.stop=="function"}async function ab(...n){const e=[];for(const t of n)Dh(t)&&e.push(t);await Promise.
all(e.map(async t=>{t.beforeStart!=null&&await t.beforeStart()})),await Promise.all(e.map(async t=>{await t.start()})),await Promise.
all(e.map(async t=>{t.afterStart!=null&&await t.afterStart()}))}async function cb(...n){const e=[];for(const t of n)Dh(t)&&
e.push(t);await Promise.all(e.map(async t=>{t.beforeStop!=null&&await t.beforeStop()})),await Promise.all(e.map(async t=>{
await t.stop()})),await Promise.all(e.map(async t=>{t.afterStop!=null&&await t.afterStop()}))}const $h=Symbol.for("@libp\
2p/transport");var En;(function(n){n[n.FATAL_ALL=0]="FATAL_ALL",n[n.NO_FATAL=1]="NO_FATAL"})(En||(En={}));function y9(){}
function OS(n){return typeof n?.handleEvent=="function"}function BS(n){return n===!0||n===!1}function zS(n){return BS(n)?
n:n?.capture??!1}function vu(n){const e={capture:zS(n),once:!!n?.once};return n?.passive!=null&&(e.passive=n?.passive),n?.
signal!=null&&(e.signal=n?.signal),e}function Zd(n,e){return vu(n).capture===vu(e).capture}class he extends EventTarget{#e=new Map;constructor(){
super()}listenerCount(e){const t=this.#e.get(e);return t==null?0:t.length}addEventListener(e,t,r){const s=vu(r);if(s?.signal?.
aborted===!0)return;const i=l=>{s.once&&this.removeEventListener(e,t,s),OS(t)?t.handleEvent(l):t(l)};let o=this.#e.get(e);
if(o==null&&(o=[],this.#e.set(e,o)),o.some(l=>l.callback!==t?!1:Zd(l.options,s)))return;super.addEventListener(e,i,s);const c=()=>{
this.removeEventListener(e,t,s)};s.signal?.addEventListener("abort",c),o.push({callback:t,wrapper:i,options:s,onAbort:c})}removeEventListener(e,t,r){
const s=this.#e.get(e);if(s==null){super.removeEventListener(e,t??null,r);return}this.#e.set(e,s.filter(i=>i.callback===
t&&Zd(i.options,r)?(super.removeEventListener(e,i.wrapper,r),i.options?.signal?.removeEventListener("abort",i.onAbort),!1):
!0))}safeDispatchEvent(e,t={}){return this.dispatchEvent(new CustomEvent(e,t))}}const st=Symbol.for("@libp2p/service-cap\
abilities"),us=Symbol.for("@libp2p/service-dependencies");let ae=class extends Error{code="ERR_MAX_LENGTH";name="MaxLeng\
thError"};function lb(n){if(isNaN(n)||n<=0)throw new L("random bytes length must be a Number bigger than 0");return Hv(n)}
function Su(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return tf(n);if(n instanceof ArrayBuffer)return new Uint8Array(
n);if(ArrayBuffer.isView(n))return tf(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type,\
 must be binary type")}function VS(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}
const ef=4096;function qS(n){const e=n.length;if(e<=ef)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)
t+=String.fromCharCode.apply(String,n.subarray(r,r+=ef));return t}function WS(n){return n?.buffer instanceof ArrayBuffer}
function tf(n){return WS(n)?n:n.slice()}function KS(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(
256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,
m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==
0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-
_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var GS=KS,HS=GS;let jS=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},XS=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ub(this,e)}},
QS=class{decoders;constructor(e){this.decoders=e}or(e){return ub(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function ub(n,e){return new QS({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let YS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new jS(e,t,r),this.decoder=new XS(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function yc({name:n,prefix:e,encode:t,decode:r}){return new YS(n,e,t,
r)}function Xi({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=HS(t,n,r);return yc({prefix:e,
name:n,encode:s,decode:o=>Su(i(o))})}function JS(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function ZS(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function e2(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ge({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=e2(r,s);return yc(
{prefix:e,name:n,encode(o){return ZS(o,r,t)},decode(o){return JS(o,i,t,n)}})}const t2=Xi({prefix:"9",name:"base10",alphabet:"\
0123456789"}),n2=Object.freeze(Object.defineProperty({__proto__:null,base10:t2},Symbol.toStringTag,{value:"Module"})),r2=ge(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),s2=ge({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),i2=Object.freeze(Object.defineProperty({__proto__:null,
base16:r2,base16upper:s2},Symbol.toStringTag,{value:"Module"})),o2=ge({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
a2=Object.freeze(Object.defineProperty({__proto__:null,base2:o2},Symbol.toStringTag,{value:"Module"})),hb=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),c2=hb.reduce((n,e,t)=>(n[t]=e,n),[]),l2=hb.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function u2(n){return n.reduce((e,t)=>(e+=c2[t],e),"")}function h2(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=l2[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const d2=yc({prefix:"🚀",name:"\
base256emoji",encode:u2,decode:h2}),f2=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:d2},Symbol.toStringTag,
{value:"Module"})),p2=ge({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
g2=ge({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),m2=ge(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),b2=ge({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),y2=ge({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),w2=ge({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),v2=ge({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),S2=ge({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),A2=ge({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),_2=Object.freeze(Object.defineProperty({__proto__:null,
base32:p2,base32hex:y2,base32hexpad:v2,base32hexpadupper:S2,base32hexupper:w2,base32pad:m2,base32padupper:b2,base32upper:g2,
base32z:A2},Symbol.toStringTag,{value:"Module"})),E2=Xi({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),C2=Xi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
x2=Object.freeze(Object.defineProperty({__proto__:null,base36:E2,base36upper:C2},Symbol.toStringTag,{value:"Module"})),I2=Xi(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),M2=Xi({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),P2=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:I2,base58flickr:M2},Symbol.toStringTag,{value:"Module"})),T2=ge({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),D2=ge({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),$2=ge({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),k2=ge({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),L2=Object.freeze(Object.defineProperty(
{__proto__:null,base64:T2,base64pad:D2,base64url:$2,base64urlpad:k2},Symbol.toStringTag,{value:"Module"})),R2=ge({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),N2=Object.freeze(Object.defineProperty({__proto__:null,base8:R2},Symbol.
toStringTag,{value:"Module"})),F2=yc({prefix:"\0",name:"identity",encode:n=>qS(Su(n)),decode:n=>Su(VS(n))}),U2=Object.freeze(
Object.defineProperty({__proto__:null,identity:F2},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const nf={...U2,...a2,...N2,...n2,...i2,..._2,...x2,...P2,...L2,...f2};function db(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const rf=db("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Xc=db("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=jv(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),O2={utf8:rf,"utf-8":rf,
hex:nf.base16,latin1:Xc,ascii:Xc,binary:Xc,...nf};function ar(n,e="utf8"){const t=O2[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}const kh={32:16777619n,64:1099511628211n,128:309485009821345068724781371n,
256:374144419156711147060143317175368453031918731002211n,512:35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759n,
1024:5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573n},
fb={32:2166136261n,64:14695981039346656037n,128:144066263297769815596495629667062367629n,256:100029257958052580907070968620625704837092796014241193945225284501741471925557n,
512:9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785n,
1024:14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915n},
pb=new globalThis.TextEncoder;function B2(n,e){const t=kh[e];let r=fb[e];for(let s=0;s<n.length;s++)r^=BigInt(n[s]),r=BigInt.
asUintN(e,r*t);return r}function z2(n,e,t){if(t.length===0)throw new Error("The `utf8Buffer` option must have a length g\
reater than zero");const r=kh[e];let s=fb[e],i=n;for(;i.length>0;){const o=pb.encodeInto(i,t);i=i.slice(o.read);for(let a=0;a<
o.written;a++)s^=BigInt(t[a]),s=BigInt.asUintN(e,s*r)}return s}function V2(n,{size:e=32,utf8Buffer:t}={}){if(!kh[e])throw new Error(
"The `size` option must be one of 32, 64, 128, 256, 512, or 1024");if(typeof n=="string"){if(t)return z2(n,e,t);n=pb.encode(
n)}return B2(n,e)}const Lh={hash:n=>Number(V2(n,{size:32})),hashV:(n,e)=>q2(Lh.hash(n,e))};function q2(n){let e=n.toString(
16);return e.length%2===1&&(e=`0${e}`),ar(e,"base16")}const gb=64;class er{fp;h;seed;constructor(e,t,r,s=2){if(s>gb)throw new TypeError(
"Invalid Fingerprint Size");const i=t.hashV(e,r),o=Xv(s);for(let a=0;a<o.length;a++)o[a]=i[a];o.length===0&&(o[0]=7),this.
fp=o,this.h=t,this.seed=r}hash(){return this.h.hash(this.fp,this.seed)}equals(e){return e?.fp instanceof Uint8Array?Qv(this.
fp,e.fp):!1}}function Ea(n,e){return Math.floor(Math.random()*(e-n))+n}class go{contents;constructor(e){this.contents=new Array(
e).fill(null)}has(e){if(!(e instanceof er))throw new TypeError("Invalid Fingerprint");return this.contents.some(t=>e.equals(
t))}add(e){if(!(e instanceof er))throw new TypeError("Invalid Fingerprint");for(let t=0;t<this.contents.length;t++)if(this.
contents[t]==null)return this.contents[t]=e,!0;return!0}swap(e){if(!(e instanceof er))throw new TypeError("Invalid Finge\
rprint");const t=Ea(0,this.contents.length-1),r=this.contents[t];return this.contents[t]=e,r}remove(e){if(!(e instanceof
er))throw new TypeError("Invalid Fingerprint");const t=this.contents.findIndex(r=>e.equals(r));return t>-1?(this.contents[t]=
null,!0):!1}}const W2=500;class sf{bucketSize;filterSize;fingerprintSize;buckets;count;hash;seed;constructor(e){this.filterSize=
e.filterSize,this.bucketSize=e.bucketSize??4,this.fingerprintSize=e.fingerprintSize??2,this.count=0,this.buckets=[],this.
hash=e.hash??Lh,this.seed=e.seed??Ea(0,Math.pow(2,10))}add(e){typeof e=="string"&&(e=ar(e));const t=new er(e,this.hash,this.
seed,this.fingerprintSize),r=this.hash.hash(e,this.seed)%this.filterSize,s=(r^t.hash())%this.filterSize;if(this.buckets[r]==
null&&(this.buckets[r]=new go(this.bucketSize)),this.buckets[s]==null&&(this.buckets[s]=new go(this.bucketSize)),this.buckets[r].
add(t)||this.buckets[s].add(t))return this.count++,!0;const i=[r,s];let o=i[Ea(0,i.length-1)];this.buckets[o]==null&&(this.
buckets[o]=new go(this.bucketSize));for(let a=0;a<W2;a++){const c=this.buckets[o].swap(t);if(c!=null&&(o=(o^c.hash())%this.
filterSize,this.buckets[o]==null&&(this.buckets[o]=new go(this.bucketSize)),this.buckets[o].add(c)))return this.count++,
!0}return!1}has(e){typeof e=="string"&&(e=ar(e));const t=new er(e,this.hash,this.seed,this.fingerprintSize),r=this.hash.
hash(e,this.seed)%this.filterSize,s=this.buckets[r]?.has(t)??!1;if(s)return s;const i=(r^t.hash())%this.filterSize;return this.
buckets[i]?.has(t)??!1}remove(e){typeof e=="string"&&(e=ar(e));const t=new er(e,this.hash,this.seed,this.fingerprintSize),
r=this.hash.hash(e,this.seed)%this.filterSize,s=this.buckets[r]?.remove(t)??!1;if(s)return this.count--,s;const i=(r^t.hash())%
this.filterSize,o=this.buckets[i]?.remove(t)??!1;return o&&this.count--,o}get reliable(){return Math.floor(100*(this.count/
this.filterSize))<=90}}const K2={1:.5,2:.84,4:.95,8:.98};function G2(n=.001){return n>.002?2:n>1e-5?4:8}function H2(n,e=.001){
const t=G2(e),r=K2[t],s=Math.round(n/r),i=Math.min(Math.ceil(Math.log2(1/e)+Math.log2(2*t)),gb);return{filterSize:s,bucketSize:t,
fingerprintSize:i}}class j2{filterSize;bucketSize;fingerprintSize;scale;filterSeries;hash;seed;constructor(e){this.bucketSize=
e.bucketSize??4,this.filterSize=e.filterSize??(1<<18)/this.bucketSize,this.fingerprintSize=e.fingerprintSize??2,this.scale=
e.scale??2,this.hash=e.hash??Lh,this.seed=e.seed??Ea(0,Math.pow(2,10)),this.filterSeries=[new sf({filterSize:this.filterSize,
bucketSize:this.bucketSize,fingerprintSize:this.fingerprintSize,hash:this.hash,seed:this.seed})]}add(e){if(typeof e=="st\
ring"&&(e=ar(e)),this.has(e))return!0;let t=this.filterSeries.find(r=>r.reliable);if(t==null){const r=this.filterSize*Math.
pow(this.scale,this.filterSeries.length);t=new sf({filterSize:r,bucketSize:this.bucketSize,fingerprintSize:this.fingerprintSize,
hash:this.hash,seed:this.seed}),this.filterSeries.push(t)}return t.add(e)}has(e){typeof e=="string"&&(e=ar(e));for(let t=0;t<
this.filterSeries.length;t++)if(this.filterSeries[t].has(e))return!0;return!1}remove(e){typeof e=="string"&&(e=ar(e));for(let t=0;t<
this.filterSeries.length;t++)if(this.filterSeries[t].remove(e))return!0;return!1}get count(){return this.filterSeries.reduce(
(e,t)=>e+t.count,0)}}function _i(n,e=.001,t){return new j2({...H2(n,e)})}function mb(n){const e=n.getComponents(),t={};let r=0;
return e[r]?.name==="ip6zone"&&(t.zone=`${e[r].value}`,r++),e[r]?.name==="ip4"||e[r]?.name==="ip6"||e[r]?.name==="dns"||
e[r]?.name==="dns4"||e[r]?.name==="dns6"?(t.type=e[r].name,t.host=e[r].value,r++):e[r]?.name==="dnsaddr"&&(t.type=e[r].name,
t.host=`_dnsaddr.${e[r].value}`,r++),(e[r]?.name==="tcp"||e[r]?.name==="udp")&&(t.protocol=e[r].name==="tcp"?"tcp":"udp",
t.port=parseInt(`${e[r].value}`),r++),e[r]?.name==="ipcidr"&&(t.type==="ip4"?t.cidr=parseInt(`${e[r].value}`):t.type==="\
ip6"&&(t.cidr=`${e[r].value}`),r++),t.type==null||t.host==null?null:(e[r]?.name==="tls"&&e[r+1]?.name==="sni"&&(t.sni=e[r+
1].value,r+=2),t)}function ne(n){const e=mb(n);if(e==null)throw new L(`Multiaddr ${n} was not an IPv4, IPv6, DNS, DNS4, \
DNS6 or DNSADDR address`);return e}function X2(n,e,t){let r=0;for(const s of n)if(!(r<e)){if(r>t)break;if(s!==255)return!1;
r++}return!0}function Q2(n,e,t,r){let s=0;for(const i of n)if(!(s<t)){if(s>r)break;if(i!==e[s])return!1;s++}return!0}function Y2(n){
switch(n.length){case Ei:return n.join(".");case Ci:{const e=[];for(let t=0;t<n.length;t++)t%2===0&&e.push(n[t].toString(
16).padStart(2,"0")+n[t+1].toString(16).padStart(2,"0"));return e.join(":")}default:throw new Error("Invalid ip length")}}
function J2(n){let e=0;for(let[t,r]of n.entries()){if(r===255){e+=8;continue}for(;(r&128)!=0;)e++,r=r<<1;if((r&128)!=0)return-1;
for(let s=t+1;s<n.length;s++)if(n[s]!=0)return-1;break}return e}function Z2(n){let e="0x";for(const t of n)e+=(t>>4).toString(
16)+(t&15).toString(16);return e}const Ei=4,Ci=16,e1=new Uint8Array([0,0,0,0,0,0,0,0,0,0,255,255]);function bb(n,e){e.length===
Ci&&n.length===Ei&&X2(e,0,11)&&(e=e.slice(12)),e.length===Ei&&n.length===Ci&&Q2(n,e1,0,11)&&(n=n.slice(12));const t=n.length;
if(t!=e.length)throw new Error("Failed to mask ip");const r=new Uint8Array(t);for(let s=0;s<t;s++)r[s]=n[s]&e[s];return r}
function t1(n,e){if(typeof e=="string"&&(e=hu(e)),e==null)throw new Error("Invalid ip");if(e.length!==n.network.length)return!1;
for(let t=0;t<e.length;t++)if((n.network[t]&n.mask[t])!==(e[t]&n.mask[t]))return!1;return!0}function n1(n){const[e,t]=n.
split("/");if(!e||!t)throw new Error("Failed to parse given CIDR: "+n);let r=Ei,s=Yv(e);if(s==null&&(r=Ci,s=Jv(e),s==null))
throw new Error("Failed to parse given CIDR: "+n);const i=parseInt(t,10);if(Number.isNaN(i)||String(i).length!==t.length||
i<0||i>r*8)throw new Error("Failed to parse given CIDR: "+n);const o=yb(i,8*r);return{network:bb(s,o),mask:o}}function yb(n,e){
if(e!==8*Ei&&e!==8*Ci)throw new Error("Invalid CIDR mask");if(n<0||n>e)throw new Error("Invalid CIDR mask");const t=e/8,
r=new Uint8Array(t);for(let s=0;s<t;s++){if(n>=8){r[s]=255,n-=8;continue}r[s]=255-(255>>n),n=0}return r}class wb{constructor(e,t){
if(t==null)({network:this.network,mask:this.mask}=n1(e));else{const r=hu(e);if(r==null)throw new Error("Failed to parse \
network");t=String(t);const s=parseInt(t,10);if(Number.isNaN(s)||String(s).length!==t.length||s<0||s>r.length*8){const i=hu(
t);if(i==null)throw new Error("Failed to parse mask");this.mask=i}else this.mask=yb(s,8*r.length);this.network=bb(r,this.
mask)}}contains(e){return t1({network:this.network,mask:this.mask},e)}toString(){const e=J2(this.mask),t=e!==-1?String(e):
Z2(this.mask);return Y2(this.network)+"/"+t}}function r1(n,e){return new wb(n).contains(e)}function s1(n){try{const e=ne(
n);switch(e.type){case"ip6":return r1("2000::/3",e.host);default:return!1}}catch{return!1}}function i1(n){try{const e=ne(
n);switch(e.type){case"ip4":return e.host.startsWith("169.254.");case"ip6":return e.host.toLowerCase().startsWith("fe80");default:
return!1}}catch{return!1}}function o1(n){return/^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(n)||/^::1$/.test(
n)}function Au(n){try{const e=ne(n);switch(e.type){case"ip4":case"ip6":return o1(e.host);default:return!1}}catch{return!1}}
function yt(n){return mb(n)!==null}var Kr={},of;function a1(){return of||(of=1,(function(){var n,e,t,r,s,i,o,a;a=function(c){
var l,u,h,d;return l=(c&255<<24)>>>24,u=(c&255<<16)>>>16,h=(c&65280)>>>8,d=c&255,[l,u,h,d].join(".")},o=function(c){var l,
u,h,d,p,v;for(l=[],h=d=0;d<=3&&c.length!==0;h=++d){if(h>0){if(c[0]!==".")throw new Error("Invalid IP");c=c.substring(1)}
v=e(c),p=v[0],u=v[1],c=c.substring(u),l.push(p)}if(c.length!==0)throw new Error("Invalid IP");switch(l.length){case 1:if(l[0]>
4294967295)throw new Error("Invalid IP");return l[0]>>>0;case 2:if(l[0]>255||l[1]>16777215)throw new Error("Invalid IP");
return(l[0]<<24|l[1])>>>0;case 3:if(l[0]>255||l[1]>255||l[2]>65535)throw new Error("Invalid IP");return(l[0]<<24|l[1]<<16|
l[2])>>>0;case 4:if(l[0]>255||l[1]>255||l[2]>255||l[3]>255)throw new Error("Invalid IP");return(l[0]<<24|l[1]<<16|l[2]<<
8|l[3])>>>0;default:throw new Error("Invalid IP")}},t=function(c){return c.charCodeAt(0)},r=t("0"),i=t("a"),s=t("A"),e=function(c){
var l,u,h,d,p;for(d=0,l=10,u="9",h=0,c.length>1&&c[h]==="0"&&(c[h+1]==="x"||c[h+1]==="X"?(h+=2,l=16):"0"<=c[h+1]&&c[h+1]<=
"9"&&(h++,l=8,u="7")),p=h;h<c.length;){if("0"<=c[h]&&c[h]<=u)d=d*l+(t(c[h])-r)>>>0;else if(l===16)if("a"<=c[h]&&c[h]<="f")
d=d*l+(10+t(c[h])-i)>>>0;else if("A"<=c[h]&&c[h]<="F")d=d*l+(10+t(c[h])-s)>>>0;else break;else break;if(d>4294967295)throw new Error(
"too large");h++}if(h===p)throw new Error("empty octet");return[d,h]},n=(function(){function c(l,u){var h,d,p;if(typeof l!=
"string")throw new Error("Missing `net' parameter");if(u||(p=l.split("/",2),l=p[0],u=p[1]),u||(u=32),typeof u=="string"&&
u.indexOf(".")>-1){try{this.maskLong=o(u)}catch{throw new Error("Invalid mask: "+u)}for(h=d=32;d>=0;h=--d)if(this.maskLong===
4294967295<<32-h>>>0){this.bitmask=h;break}}else if(u||u===0)this.bitmask=parseInt(u,10),this.maskLong=0,this.bitmask>0&&
(this.maskLong=4294967295<<32-this.bitmask>>>0);else throw new Error("Invalid mask: empty");try{this.netLong=(o(l)&this.
maskLong)>>>0}catch{throw new Error("Invalid net address: "+l)}if(!(this.bitmask<=32))throw new Error("Invalid mask for \
ip4: "+u);this.size=Math.pow(2,32-this.bitmask),this.base=a(this.netLong),this.mask=a(this.maskLong),this.hostmask=a(~this.
maskLong),this.first=this.bitmask<=30?a(this.netLong+1):this.base,this.last=this.bitmask<=30?a(this.netLong+this.size-2):
a(this.netLong+this.size-1),this.broadcast=this.bitmask<=30?a(this.netLong+this.size-1):void 0}return c.prototype.contains=
function(l){return typeof l=="string"&&(l.indexOf("/")>0||l.split(".").length!==4)&&(l=new c(l)),l instanceof c?this.contains(
l.base)&&this.contains(l.broadcast||l.last):(o(l)&this.maskLong)>>>0===(this.netLong&this.maskLong)>>>0},c.prototype.next=
function(l){return l==null&&(l=1),new c(a(this.netLong+this.size*l),this.mask)},c.prototype.forEach=function(l){var u,h,
d;for(d=o(this.first),h=o(this.last),u=0;d<=h;)l(a(d),d,u),u++,d++},c.prototype.toString=function(){return this.base+"/"+
this.bitmask},c})(),Kr.ip2long=o,Kr.long2ip=a,Kr.Netmask=n}).call(Kr)),Kr}var c1=a1();const l1=["0.0.0.0/8","10.0.0.0/8",
"100.64.0.0/10","127.0.0.0/8","169.254.0.0/16","172.16.0.0/12","192.0.0.0/24","192.0.0.0/29","192.0.0.8/32","192.0.0.9/3\
2","192.0.0.10/32","192.0.0.170/32","192.0.0.171/32","192.0.2.0/24","192.31.196.0/24","192.52.193.0/24","192.88.99.0/24",
"192.168.0.0/16","192.175.48.0/24","198.18.0.0/15","198.51.100.0/24","203.0.113.0/24","240.0.0.0/4","255.255.255.255/32"],
u1=l1.map(n=>new c1.Netmask(n));function Rh(n){for(const e of u1)if(e.contains(n))return!0;return!1}function h1(n){return/^::ffff:([0-9a-fA-F]{1,4}):([0-9a-fA-F]{1,4})$/.
test(n)}function d1(n){const e=n.split(":");if(e.length<2)return!1;const t=e[e.length-1].padStart(4,"0"),r=e[e.length-2].
padStart(4,"0"),s=`${parseInt(r.substring(0,2),16)}.${parseInt(r.substring(2),16)}.${parseInt(t.substring(0,2),16)}.${parseInt(
t.substring(2),16)}`;return Rh(s)}function f1(n){return/^::ffff:([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.
test(n)}function p1(n){const e=n.split(":"),t=e[e.length-1];return Rh(t)}function g1(n){return/^::$/.test(n)||/^::1$/.test(
n)||/^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(n)||/^100::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001:2[0-9a-fA-F]:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001:db8:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2002:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^f[c-d]([0-9a-fA-F]{2,2}):/i.test(n)||/^fe[8-9a-bA-B][0-9a-fA-F]:/i.test(n)||/^ff([0-9a-fA-F]{2,2}):/i.test(n)}
function Nh(n){if(va(n))return Rh(n);if(h1(n))return d1(n);if(f1(n))return p1(n);if(Zv(n))return g1(n)}function hs(n){try{
const e=ne(n);switch(e.type){case"ip4":case"ip6":return Nh(e.host)??!1;default:return e.host==="localhost"}}catch{return!1}}
const J=n=>({match:e=>{const t=e[0];return t==null||t.code!==n||t.value!=null?!1:e.slice(1)}}),R=(n,e)=>({match:t=>{const r=t[0];
return r?.code!==n||r.value==null||e!=null&&r.value!==e?!1:t.slice(1)}}),m1=n=>({match:e=>n.match(e)===!1?e:!1}),z=n=>({
match:e=>{const t=n.match(e);return t===!1?e:t}}),Xe=(...n)=>({match:e=>{let t;for(const r of n){const s=r.match(e);s!==
!1&&(t==null||s.length<t.length)&&(t=s)}return t??!1}}),K=(...n)=>({match:e=>{for(const t of n){const r=t.match(e);if(r===
!1)return!1;e=r}return e}});function Z(...n){function e(s){if(s==null)return!1;let i=s.getComponents();for(const o of n){
const a=o.match(i);if(a===!1)return!1;i=a}return i}function t(s){return e(s)!==!1}function r(s){const i=e(s);return i===
!1?!1:i.length===0}return{matchers:n,matches:t,exactMatch:r}}const b1=R(B),y1=Z(b1),wc=R(Bm),vc=R(zm),Sc=R(Om),Fh=R(Km);
Z(wc,z(R(B)));Z(vc,z(R(B)));Z(Sc,z(R(B)));Z(Xe(Fh,Sc,wc,vc),z(R(B)));const vb=K(R(du),z(R(qm))),Sb=K(z(R(Wm)),R(as),z(R(
qm))),Uh=Xe(vb,Sb),Is=Xe(Uh,Fh,wc,vc,Sc),w1=Z(Xe(Uh,K(Xe(Fh,Sc,wc,vc),z(R(B))))),af=Z(vb),cf=Z(Sb);Z(Uh);const Oh=K(Is,R(
_n)),Qi=K(Is,R(nS)),Ca=Z(K(Oh,z(R(B))));Z(Qi);const Bh=K(Qi,J(rS),z(R(B))),Ac=K(Qi,J(tS),z(R(B))),v1=Xe(Bh,Ac);Z(Bh);const S1=Z(
Ac),_u=Xe(Is,Oh,Qi,Bh,Ac),Ab=Xe(K(_u,J(Vm),z(R(B)))),xi=Z(Ab),_b=Xe(K(_u,J(eS),z(R(B))),K(_u,J(ts),z(R(fu)),J(Vm),z(R(B)))),
xa=Z(_b),Eb=K(Qi,J(sS),z(R(Sa)),z(R(Sa)),z(R(B))),lf=Z(Eb),Cb=K(Ac,J(iS),z(R(Sa)),z(R(Sa)),z(R(B))),uf=Z(Cb),Ia=Xe(Ab,_b,
K(Oh,z(R(B))),K(v1,z(R(B))),K(Is,z(R(B))),Eb,Cb,R(B)),zh=Z(Ia),A1=K(z(Ia),J(Hi),m1(J(ra)),z(R(B))),ds=Z(A1),_1=Xe(K(Ia,J(
Hi),J(ra),z(R(B))),K(Ia,J(ra),z(R(B))),K(J(ra),z(R(B)))),Eu=Z(_1),E1=K(Is,Xe(K(R(_n,"80")),K(R(_n),J(ni)),J(ni)),z(R(Gm)),
z(R(B)));Z(E1);const C1=K(Is,Xe(K(R(_n,"443")),K(R(_n,"443"),J(ni)),K(R(_n),J(Hd)),K(R(_n),J(ts),J(ni)),K(J(ts),J(ni)),J(
ts),J(Hd)),z(R(Gm)),z(R(B)));Z(C1);const x1=Xe(K(R(oS),z(R(B))));Z(x1);const I1=Xe(K(R(aS),z(R(B))));Z(I1);function M1(n,e){
const t=Ca.exactMatch(n),r=Ca.exactMatch(e);if(t&&!r)return-1;if(!t&&r)return 1;const s=xa.exactMatch(n),i=xa.exactMatch(
e);if(s&&!i)return-1;if(!s&&i)return 1;const o=xi.exactMatch(n),a=xi.exactMatch(e);if(o&&!a)return-1;if(!o&&a)return 1;const c=Eu.
exactMatch(n),l=Eu.exactMatch(e);if(c&&!l)return-1;if(!c&&l)return 1;const u=lf.exactMatch(n),h=lf.exactMatch(e);if(u&&!h)
return-1;if(!u&&h)return 1;const d=uf.exactMatch(n),p=uf.exactMatch(e);return d&&!p?-1:!d&&p?1:0}function P1(n,e){const t=Au(
n),r=Au(e);return t&&!r?1:!t&&r?-1:0}function T1(n,e){const t=hs(n),r=hs(e);return t&&!r?1:!t&&r?-1:0}function D1(n,e){const t=ds.
exactMatch(n),r=ds.exactMatch(e);return t&&!r?1:!t&&r?-1:0}function Ma(n,e){let t;const r=function(){const s=function(){
t=void 0,n()};clearTimeout(t),t=setTimeout(s,e)};return r.start=()=>{},r.stop=()=>{clearTimeout(t)},r}let $1=class{deferred;signal;onProgress;constructor(e){
this.signal=e?.signal,this.onProgress=e?.onProgress,this.deferred=Hm(),this.onAbort=this.onAbort.bind(this),this.signal?.
addEventListener("abort",this.onAbort)}onAbort(){this.deferred.reject(this.signal?.reason??new cs)}cleanup(){this.signal?.
removeEventListener("abort",this.onAbort)}};function k1(){return`${parseInt(String(Math.random()*1e9),10).toString()}${Date.
now()}`}const hf=new WeakMap;let L1=class{id;fn;options;recipients;status;timeline;controller;dispatchingProgress;constructor(e,t){
this.id=k1(),this.status="queued",this.fn=e,this.options=t,this.recipients=[],this.timeline={created:Date.now()},this.controller=
new AbortController,this.controller.signal,this.dispatchingProgress=!1,this.onAbort=this.onAbort.bind(this)}abort(e){this.
controller.abort(e)}onAbort(){this.recipients.reduce((t,r)=>t&&r.signal?.aborted===!0,!0)&&(this.controller.abort(new cs),
this.cleanup())}async join(e){const t=new $1(e);return this.recipients.push(t),e?.signal?.addEventListener("abort",this.
onAbort),t.deferred.promise}async run(){this.status="running",this.timeline.started=Date.now();try{this.controller.signal.
throwIfAborted();const e=await kt(this.fn({...this.options??{},signal:this.controller.signal,onProgress:t=>{if(this.recipients.
length!==0&&!this.dispatchingProgress){if(typeof t=="object"&&t!==null){let r=hf.get(t);if(r==null&&(r=new WeakSet,hf.set(
t,r)),r.has(this))return;r.add(this)}this.dispatchingProgress=!0;try{this.recipients.forEach(r=>{r.onProgress?.(t)})}finally{
this.dispatchingProgress=!1}}}}),this.controller.signal);this.recipients.forEach(t=>{t.deferred.resolve(e)}),this.status=
"complete"}catch(e){this.recipients.forEach(t=>{t.deferred.reject(e)}),this.status="errored"}finally{this.timeline.finished=
Date.now(),this.cleanup()}}cleanup(){this.recipients.forEach(e=>{e.deferred.reject(e.signal?.reason??new cs),e.cleanup(),
e.signal?.removeEventListener("abort",this.onAbort)}),this.recipients.splice(0,this.recipients.length)}},xb=class extends he{concurrency;maxSize;queue;pending;sort;paused;constructor(e={}){
super(),this.concurrency=e.concurrency??Number.POSITIVE_INFINITY,this.maxSize=e.maxSize??Number.POSITIVE_INFINITY,this.pending=
0,this.paused=!1,e.metricName!=null&&e.metrics?.registerMetricGroup(e.metricName,{calculate:()=>({size:this.queue.length,
running:this.pending,queued:this.queue.length-this.pending})}),this.sort=e.sort,this.queue=[],this.emitEmpty=Ma(this.emitEmpty.
bind(this),1),this.emitIdle=Ma(this.emitIdle.bind(this),1)}emitEmpty(){this.size===0&&this.safeDispatchEvent("empty")}emitIdle(){
this.running===0&&this.safeDispatchEvent("idle")}pause(){this.paused=!0}resume(){this.paused&&(this.paused=!1,this.tryToStartAnother())}tryToStartAnother(){
if(this.paused)return!1;if(this.size===0)return this.emitEmpty(),this.running===0&&this.emitIdle(),!1;if(this.pending<this.
concurrency){let e;for(const t of this.queue)if(t.status==="queued"){e=t;break}return e==null?!1:(this.safeDispatchEvent(
"active"),this.pending++,e.run().finally(()=>{for(let t=0;t<this.queue.length;t++)if(this.queue[t]===e){this.queue.splice(
t,1);break}this.pending--,this.tryToStartAnother(),this.safeDispatchEvent("next")}),!0)}return!1}enqueue(e){this.queue.push(
e),this.sort!=null&&this.queue.sort(this.sort)}async add(e,t){if(t?.signal?.throwIfAborted(),this.size===this.maxSize)throw new cS;
const r=new L1(e,t);this.enqueue(r),this.safeDispatchEvent("add");const s=r.join(t).then(i=>(this.safeDispatchEvent("com\
pleted",{detail:i}),this.safeDispatchEvent("success",{detail:{job:r,result:i}}),i)).catch(i=>{if(r.status==="queued"){for(let o=0;o<
this.queue.length;o++)if(this.queue[o]===r){this.queue.splice(o,1);break}}throw this.safeDispatchEvent("failure",{detail:{
job:r,error:i}}),i});return this.tryToStartAnother(),s}clear(){this.queue.splice(0,this.queue.length)}abort(){this.queue.
forEach(e=>{e.abort(new cs)}),this.clear()}async onEmpty(e){this.size!==0&&await ir(this,"empty",e)}async onSizeLessThan(e,t){
this.size<e||await ir(this,"next",{...t,filter:()=>this.size<e})}async onIdle(e){this.pending===0&&this.size===0||await ir(
this,"idle",e)}get size(){return this.queue.length}get queued(){return this.queue.length-this.pending}get running(){return this.
pending}async*toGenerator(e){e?.signal?.throwIfAborted();const t=ls({objectMode:!0}),r=c=>{c!=null?this.abort():this.clear(),
t.end(c)},s=c=>{c.detail!=null&&t.push(c.detail)},i=c=>{r(c.detail.error)},o=()=>{r()},a=()=>{r(new cs("Queue aborted"))};
this.addEventListener("completed",s),this.addEventListener("failure",i),this.addEventListener("idle",o),e?.signal?.addEventListener(
"abort",a);try{yield*t}finally{this.removeEventListener("completed",s),this.removeEventListener("failure",i),this.removeEventListener(
"idle",o),e?.signal?.removeEventListener("abort",a),r()}}};const R1=Math.pow(2,20)*4;class Vh extends he{status;timeline;inactivityTimeout;maxReadBufferLength;maxWriteBufferLength;log;direction;maxMessageSize;readStatus;writeStatus;remoteReadStatus;remoteWriteStatus;writableNeedsDrain;readBuffer;writeBuffer;sendingData;#e=!1;#t;#n=new Set;onDrainPromise;constructor(e){
super(),this.status="open",this.log=e.log,this.direction=e.direction??"outbound",this.inactivityTimeout=e.inactivityTimeout??
12e4,this.maxReadBufferLength=e.maxReadBufferLength??R1,this.maxWriteBufferLength=e.maxWriteBufferLength,this.maxMessageSize=
e.maxMessageSize,this.readBuffer=new sa,this.writeBuffer=new sa,this.readStatus="readable",this.remoteReadStatus="readab\
le",this.writeStatus="writable",this.remoteWriteStatus="writable",this.sendingData=!1,this.writableNeedsDrain=!1,this.timeline=
{open:Date.now()},this.processSendQueue=this.processSendQueue.bind(this);const t=()=>{this.writableNeedsDrain&&(this.log.
trace("drain event received, continue sending data"),this.writableNeedsDrain=!1,queueMicrotask(()=>{try{this.processSendQueue()}catch(s){
this.log.error("processSendQueue threw - %e",s)}})),this.onDrainPromise?.resolve()};this.addEventListener("drain",t);const r=s=>{
this.onDrainPromise?.reject(s.error??new lS)};this.addEventListener("close",r)}get readBufferLength(){return this.readBuffer.
byteLength}get readableEnded(){return this.#e}get writeBufferLength(){return this.writeBuffer.byteLength}async onDrain(e){
return this.writableNeedsDrain!==!0?Promise.resolve():(this.onDrainPromise==null&&(this.onDrainPromise=Promise.withResolvers()),
kt(this.onDrainPromise.promise,e?.signal))}async*[Symbol.asyncIterator](){const e=ls();let t;const r=i=>{e.push(i.data)};
this.addEventListener("message",r);const s=()=>{this.#n.delete(s),this.removeEventListener("message",r),t=this.#t,e.end()};
this.#n.add(s),this.readableDone()&&s();try{if(yield*e,t!=null)throw t}finally{this.removeEventListener("message",r),this.#n.
delete(s)}}readableDone(){return this.readBuffer.byteLength===0&&(this.remoteWriteStatus==="closed"||this.readStatus==="\
closing"||this.readStatus==="closed")}isReadable(){return this.status==="open"}send(e){if(this.writeStatus==="closed"||this.
writeStatus==="closing")throw new Yr(`Cannot write to a stream that is ${this.writeStatus}`);return this.log.trace("appe\
nd %d bytes to write buffer",e.byteLength),this.writeBuffer.append(e),this.processSendQueue()}abort(e){if(this.status===
"aborted"||this.status==="reset"||this.status==="closed"){this.readBuffer.byteLength>0&&(this.#t??=e,this.readBuffer.consume(
this.readBuffer.byteLength),this.readStatus="closed",this.maybeDispatchEnd());return}this.log.error("abort with error - \
%e",e),this.status="aborted",this.#t=e,this.readBuffer.byteLength>0&&this.readBuffer.consume(this.readBuffer.byteLength),
this.writeBuffer.byteLength>0&&(this.writeBuffer.consume(this.writeBuffer.byteLength),this.safeDispatchEvent("idle")),this.
writeStatus="closed",this.remoteWriteStatus="closed",this.readStatus="closed",this.remoteReadStatus="closed",this.timeline.
close=Date.now(),this.maybeDispatchEnd();try{this.sendReset(e)}catch(t){this.log.error("failed to send reset to remote -\
 %e",t)}this.dispatchEvent(new FS(e))}pause(){if(this.readStatus==="closed"||this.readStatus==="closing")throw new Yr("C\
annot pause a stream that is closing/closed");this.readStatus!=="paused"&&(this.readStatus="paused",this.sendPause())}resume(){
if(this.readStatus==="closed"||this.readStatus==="closing")throw new Yr("Cannot resume a stream that is closing/closed");
this.readStatus!=="readable"&&(this.readStatus="readable",this.dispatchReadBuffer(),this.sendResume())}push(e){if(this.readStatus===
"closed"||this.readStatus==="closing")throw new Yr(`Cannot push data onto a stream that is ${this.readStatus}`);if(e.byteLength!==
0){if(this.readBuffer.append(e),this.readStatus==="paused"||this.listenerCount("message")===0){this.checkReadBufferLength();
return}setTimeout(()=>{this.dispatchReadBuffer()},0)}}unshift(e){if(this.readStatus==="closed"||this.readStatus==="closi\
ng")throw new Yr(`Cannot push data onto a stream that is ${this.readStatus}`);if(e.byteLength!==0){if(this.readBuffer.prepend(
e),this.readStatus==="paused"||this.listenerCount("message")===0){this.checkReadBufferLength();return}setTimeout(()=>{this.
dispatchReadBuffer()},0)}}onData(e){if(e.byteLength!==0){if(this.readStatus==="closing"||this.readStatus==="closed"){this.
log("ignoring data - read status %s",this.readStatus);return}this.readBuffer.append(e),this.dispatchReadBuffer()}}addEventListener(...e){
super.addEventListener.apply(this,e),e[0]==="message"&&this.readBuffer.byteLength>0&&queueMicrotask(()=>{this.dispatchReadBuffer()})}onRemoteReset(){
if(this.status==="aborted"||this.status==="reset"||this.status==="closed")return;this.log("remote reset");const e=new jm;
this.#t=e,this.status="reset",this.writeStatus="closed",this.remoteWriteStatus="closed",this.remoteReadStatus="closed",this.
timeline.close=Date.now(),this.readBuffer.byteLength===0&&(this.readStatus="closed",this.maybeDispatchEnd()),this.dispatchEvent(
new US(e))}onTransportClosed(e){this.log("transport closed"),this.readStatus==="readable"&&this.readBuffer.byteLength===
0&&(this.log("close readable end after transport closed and read buffer is empty"),this.readStatus="closed"),this.remoteReadStatus!==
"closed"&&(this.remoteReadStatus="closed"),this.remoteWriteStatus!=="closed"&&(this.remoteWriteStatus="closed"),this.writeStatus!==
"closed"&&(this.writeStatus="closed"),e!=null?this.abort(e):(this.status==="open"||this.status==="closing")&&(this.timeline.
close=Date.now(),this.status="closed",this.maybeDispatchEnd(),this.dispatchEvent(new bc))}onRemoteCloseWrite(){this.remoteWriteStatus!==
"closed"&&(this.log.trace("on remote close write"),this.remoteWriteStatus="closed",this.safeDispatchEvent("remoteCloseWr\
ite"),this.maybeDispatchEnd(),this.writeStatus==="closed"&&this.onTransportClosed())}onRemoteCloseRead(){this.log.trace(
"on remote close read"),this.remoteReadStatus="closed",this.writeBuffer.byteLength>0&&(this.writeBuffer.consume(this.writeBuffer.
byteLength),this.safeDispatchEvent("idle"))}processSendQueue(){if(this.writableNeedsDrain)return this.log.trace("not pro\
cessing send queue as drain is required"),this.checkWriteBufferLength(),!1;if(this.writeBuffer.byteLength===0)return this.
log.trace("not processing send queue as no bytes to send"),!0;if(this.sendingData)return this.log.trace("not processing \
send queue as already sending data"),!0;if(this.writeStatus!=="writable"&&this.writeStatus!=="closing")return this.log.trace(
"not processing send queue as stream is %s",this.writeStatus),!1;this.sendingData=!0,this.log.trace("processing send que\
ue with %d queued bytes",this.writeBuffer.byteLength);try{let e=!0;const t=this.writeBuffer.byteLength;let r=0;for(;this.
writeBuffer.byteLength>0;){const s=Math.min(this.maxMessageSize??this.writeBuffer.byteLength,this.writeBuffer.byteLength);
if(s===0){e=!1;break}const i=this.writeBuffer.sublist(0,s),o=new sa(i);this.writeBuffer.consume(i.byteLength);let a;try{
a=this.sendData(i)}catch(c){throw this.writeBuffer.prepend(o),this.abort(c),c}if(e=a.canSendMore,r+=a.sentBytes,a.sentBytes!==
o.byteLength&&(o.consume(a.sentBytes),this.writeBuffer.prepend(o)),!e)break}return e||(this.log.trace("sent %d/%d bytes,\
 pausing sending because underlying stream is full, %d bytes left in the write buffer",r,t,this.writeBuffer.byteLength),
this.writableNeedsDrain=!0,this.checkWriteBufferLength()),this.writeBuffer.byteLength===0&&this.safeDispatchEvent("idle"),
e}finally{this.sendingData=!1}}maybeDispatchEnd(){this.readableDone()&&(this.#n.forEach(e=>{e()}),!this.#e&&(this.#e=!0,
this.safeDispatchEvent("end")))}dispatchReadBuffer(){try{if(this.listenerCount("message")===0){this.log.trace("not dispa\
tching pause buffer as there are no listeners for the message event");return}if(this.readBuffer.byteLength===0){this.log.
trace("not dispatching pause buffer as there is no data to dispatch");return}if(this.readStatus==="paused"){this.log.trace(
"not dispatching pause buffer we are paused");return}if(this.readStatus==="closing"||this.readStatus==="closed"){this.log(
"dropping %d bytes because the readable end is %s",this.readBuffer.byteLength,this.readStatus),this.readBuffer.consume(this.
readBuffer.byteLength);return}const e=this.readBuffer.sublist();this.readBuffer.consume(e.byteLength),this.dispatchEvent(
new NS(e))}finally{this.readBuffer.byteLength===0&&this.remoteWriteStatus==="closed"&&(this.log("close readable end afte\
r dispatching read buffer and remote writable end is closed"),this.readStatus="closed",this.maybeDispatchEnd()),this.checkReadBufferLength()}}checkReadBufferLength(){
this.readBuffer.byteLength>this.maxReadBufferLength&&this.abort(new jd(`Read buffer length of ${this.readBuffer.byteLength}\
 exceeded limit of ${this.maxReadBufferLength}, read status is ${this.readStatus}`))}checkWriteBufferLength(){this.maxWriteBufferLength!=
null&&this.writeBuffer.byteLength>this.maxWriteBufferLength&&this.abort(new jd(`Write buffer length of ${this.writeBuffer.
byteLength} exceeded limit of ${this.maxWriteBufferLength}, write status is ${this.writeStatus}`))}onMuxerNeedsDrain(){this.
writableNeedsDrain=!0}onMuxerDrain(){this.safeDispatchEvent("drain")}}class qh extends Vh{remoteAddr;metricPrefix;metrics;constructor(e){
super(e),this.metricPrefix=e.metricPrefix??"",this.metrics=e.metrics,this.remoteAddr=e.remoteAddr,this.addEventListener(
"close",t=>{this.metrics?.increment({[`${this.metricPrefix}end`]:!0}),t.error!=null?t.local?this.metrics?.increment({[`${this.
metricPrefix}abort`]:!0}):this.metrics?.increment({[`${this.metricPrefix}reset`]:!0}):t.local?this.metrics?.increment({[`${this.
metricPrefix}_local_close`]:!0}):this.metrics?.increment({[`${this.metricPrefix}_remote_close`]:!0})})}async close(e){this.
status==="open"&&(this.status="closing",this.writeStatus="closing",this.remoteWriteStatus="closing",this.remoteReadStatus=
"closing",(this.sendingData||this.writeBuffer.byteLength>0)&&(this.log("waiting for write queue to become idle before cl\
osing writable end of stream, %d unsent bytes",this.writeBuffer.byteLength),await ir(this,"idle",{...e,rejectionEvents:[
"close"]})),this.writableNeedsDrain&&(this.log("waiting for write queue to drain before closing writable end of stream, \
%d unsent bytes",this.writeBuffer.byteLength),await ir(this,"drain",{...e,rejectionEvents:["close"]})),await this.sendClose(
e),this.onTransportClosed())}}function N1(n){return n==null?!1:typeof n.then=="function"&&typeof n.catch=="function"&&typeof n.
finally=="function"}class Ib extends he{streams;protocol;status;log;maConn;streamOptions;earlyStreams;maxEarlyStreams;metrics;constructor(e,t){
super(),this.maConn=e,this.protocol=t.protocol,this.streams=[],this.earlyStreams=[],this.status="open",this.log=e.log.newScope(
t.name),this.streamOptions=t.streamOptions,this.maxEarlyStreams=t.maxEarlyStreams??10,this.metrics=t.metrics;const r=o=>{
try{this.onData(o.data)}catch(a){this.abort(a),this.maConn.abort(a)}};this.maConn.addEventListener("message",r);const s=()=>{
this.log("underlying stream drained, signal %d streams to continue writing",this.streams.length),this.streams.forEach(o=>{
o.onMuxerDrain()})};this.maConn.addEventListener("drain",s);const i=()=>{this.log("underlying stream closed with status \
%s and %d streams",this.status,this.streams.length),this.onTransportClosed()};this.maConn.addEventListener("close",i)}send(e){
const t=this.maConn.send(e);return t===!1&&(this.log("underlying stream saturated, signal %d streams to pause writing",this.
streams.length),this.streams.forEach(r=>{r.onMuxerNeedsDrain()})),t}async close(e){this.status==="closed"||this.status===
"closing"||(this.status="closing",await kt(Promise.all([...this.streams].map(async t=>{await t.close(e)})),e?.signal),this.
status="closed")}abort(e){this.status!=="closed"&&(this.status="closing",[...this.streams].forEach(t=>{t.abort(e)}),this.
status="closed")}onTransportClosed(e){this.status="closing";try{[...this.streams].forEach(t=>{t.onTransportClosed(e)})}catch(t){
this.abort(t)}this.status="closed"}async createStream(e){if(this.status!=="open")throw new Gs;let t=this.onCreateStream(
{...this.streamOptions,...e});return N1(t)&&(t=await t),this.streams.push(t),this.cleanUpStream(t),t}onRemoteStream(e){if(this.
streams.push(e),this.cleanUpStream(e),this.listenerCount("stream")===0){this.earlyStreams.push(e),this.earlyStreams.length>
this.maxEarlyStreams&&this.abort(new uS(`Too many early streams were opened - ${this.earlyStreams.length}/${this.maxEarlyStreams}`));
return}this.safeDispatchEvent("stream",{detail:e})}cleanUpStream(e){const t=r=>{const s=this.streams.findIndex(i=>i===e);
s!==-1&&this.streams.splice(s,1),r.error!=null?r.local?this.metrics?.increment({[`${e.direction}_stream_reset`]:!0}):this.
metrics?.increment({[`${e.direction}_stream_abort`]:!0}):this.metrics?.increment({[`${e.direction}_stream_end`]:!0})};e.
addEventListener("close",t),this.metrics?.increment({[`${e.direction}_stream`]:!0})}addEventListener(...e){super.addEventListener.
apply(this,e),e[0]==="stream"&&this.earlyStreams.length>0&&queueMicrotask(()=>{this.earlyStreams.forEach(t=>{this.safeDispatchEvent(
"stream",{detail:t})}),this.earlyStreams=[]})}}class Mb extends Vh{id;protocol;constructor(e){super(e),this.id=e.id,this.
protocol=e.protocol??""}async close(e){this.writeStatus==="closing"||this.writeStatus==="closed"||(this.writeStatus="clo\
sing",(this.sendingData||this.writeBuffer.byteLength>0)&&(this.log("waiting for write queue to become idle before closin\
g writable end of stream, %d unsent bytes",this.writeBuffer.byteLength),await ir(this,"idle",{...e,rejectionEvents:["clo\
se"]})),this.writableNeedsDrain&&(this.log("waiting for write queue to drain before closing writable end of stream, %d u\
nsent bytes, sending %s",this.writeBuffer.byteLength,this.sendingData),await ir(this,"drain",{...e,rejectionEvents:["clo\
se"]}),this.log("write queue drained, closing writable end of stream, %d unsent bytes, sending %s",this.writeBuffer.byteLength,
this.sendingData)),await this.sendCloseWrite(e),this.writeStatus="closed",this.log("closed writable end gracefully"),this.
remoteWriteStatus==="closed"&&this.onTransportClosed())}async closeRead(e){if(!(this.readStatus==="closing"||this.readStatus===
"closed")){this.readBuffer.byteLength>0&&this.readBuffer.consume(this.readBuffer.byteLength),this.readStatus="closing",this.
maybeDispatchEnd();try{await this.sendCloseRead(e)}catch(t){throw this.log.error("failed to close readable end - %e",t),
t}finally{this.readStatus="closed"}this.log("closed readable end gracefully")}}}function Fn(n){const e=new globalThis.AbortController;
function t(){const i=n.filter(o=>o?.aborted===!0).map(o=>o?.reason).pop();e.abort(i);for(const o of n)o?.removeEventListener!=
null&&o.removeEventListener("abort",t)}for(const i of n){if(i?.aborted===!0){t();break}i?.addEventListener!=null&&i.addEventListener(
"abort",t)}function r(){for(const i of n)i?.removeEventListener!=null&&i.removeEventListener("abort",t)}const s=e.signal;
return s.clear=r,s}class Qc{movingAverage;variance;deviation;forecast;timeSpan;previousTime;constructor(e){this.timeSpan=
e,this.movingAverage=0,this.variance=0,this.deviation=0,this.forecast=0}alpha(e,t){return 1-Math.exp(-(e-t)/this.timeSpan)}push(e,t=Date.
now()){if(this.previousTime!=null){const r=this.alpha(t,this.previousTime),s=e-this.movingAverage,i=r*s;this.movingAverage=
r*e+(1-r)*this.movingAverage,this.variance=(1-r)*(this.variance+s*i),this.deviation=Math.sqrt(this.variance),this.forecast=
this.movingAverage+r*s}else this.movingAverage=e;this.previousTime=t}}const F1=1.2,U1=2,O1=5e3,B1=6e4,z1=5e3;class V1{success;failure;next;metric;timeoutMultiplier;failureMultiplier;minTimeout;maxTimeout;constructor(e={}){
const t=e.interval??z1;this.success=new Qc(t),this.failure=new Qc(t),this.next=new Qc(t),this.failureMultiplier=e.failureMultiplier??
U1,this.timeoutMultiplier=e.timeoutMultiplier??F1,this.minTimeout=e.minTimeout??O1,this.maxTimeout=e.maxTimeout??B1,e.metricName!=
null&&(this.metric=e.metrics?.registerMetricGroup(e.metricName))}getTimeoutSignal(e={}){let t=Math.round(this.next.movingAverage*
(e.timeoutFactor??this.timeoutMultiplier));t<this.minTimeout&&(t=this.minTimeout),t>this.maxTimeout&&(t=this.maxTimeout);
const r=AbortSignal.timeout(t),s=Fn([e.signal,r]);return s.start=Date.now(),s.timeout=t,s}cleanUp(e){e.clear();const t=Date.
now()-e.start;e.aborted?(this.failure.push(t),this.next.push(t*this.failureMultiplier),this.metric?.update({failureMovingAverage:this.
failure.movingAverage,failureDeviation:this.failure.deviation,failureForecast:this.failure.forecast,failureVariance:this.
failure.variance,failure:t})):(this.success.push(t),this.next.push(t),this.metric?.update({successMovingAverage:this.success.
movingAverage,successDeviation:this.success.deviation,successForecast:this.success.forecast,successVariance:this.success.
variance,success:t}))}}const q1=1024*1024*4,W1=1024*1024*4;class K1{buffer;maxBufferSize;lengthDecoder;maxDataLength;encodingLength;constructor(e={}){
this.buffer=new sa,this.maxBufferSize=e.maxBufferSize??q1,this.maxDataLength=e.maxDataLength??W1,this.lengthDecoder=e.lengthDecoder??
hS,this.encodingLength=e.encodingLength??dS}*decode(e){if(this.buffer.append(e),this.buffer.byteLength>this.maxBufferSize)
throw new L(`Buffer length limit exceeded - ${this.buffer.byteLength}/${this.maxBufferSize}`);for(;;){let t;try{t=this.lengthDecoder(
this.buffer)}catch(i){if(i instanceof RangeError)break;throw i}if(t<0||t>this.maxDataLength)throw new fS("Invalid messag\
e length");const r=this.encodingLength(t),s=r+t;if(this.buffer.byteLength>=s){const i=this.buffer.sublist(r,s);this.buffer.
consume(s),i.byteLength>0&&(yield i)}else break}}}function G1(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8\
Array")return df(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return df(new Uint8Array(
n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function H1(n){return n?.buffer instanceof
ArrayBuffer}function df(n){return H1(n)?n:n.slice()}function j1(n,e,t){if(n.length>=255)throw new TypeError("Alphabet to\
o long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(
0);if(r[a]!==255)throw new TypeError(o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().
charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/
Math.log(u);function v(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):
Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===
0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],
x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");
_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!=
"string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,
m=0;f[b]===h;)_++,b++;for(var y=(f.length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;
for(var S=0,x=y-1;(w!==0||S<m)&&x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-ze\
ro carry");m=S,b++}if(f[b]!==" "){for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=
A[C++];return I}}}function E(f){var b=g(f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,
decode:E}}var X1=j1,Q1=X1;let Y1=class{name;prefix;baseEncode;constructor(e,t,r){this.name=e,this.prefix=t,this.baseEncode=
r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be bi\
nary type")}},J1=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){this.name=e,this.prefix=t;const s=t.codePointAt(
0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.baseDecode=r}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Pb(this,e)}},Z1=class{decoders;constructor(e){this.decoders=
e}or(e){return Pb(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=null)return r.decode(e);throw RangeError(`Unab\
le to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supporte\
d`)}};function Pb(n,e){return new Z1({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let eA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){
this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=s,this.encoder=new Y1(e,t,r),this.decoder=new J1(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function Tb({name:n,prefix:e,encode:t,decode:r}){
return new eA(n,e,t,r)}function Db({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=Q1(t,n,r);
return Tb({prefix:e,name:n,encode:s,decode:o=>G1(i(o))})}function tA(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function nA(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function rA(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function pt({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=rA(r,s);return Tb(
{prefix:e,name:n,encode(o){return nA(o,r,t)},decode(o){return tA(o,i,t,n)}})}const sA=pt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});pt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});pt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});pt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const iA=Db(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Db({name:"base58fli\
ckr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});const oA=pt({prefix:"m",name:"ba\
se64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});pt({prefix:"M",name:"b\
ase64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});pt({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});pt({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});const fs=1e3,
ps=fs*60,gs=ps*60,Sr=gs*24,Ii=Sr*7,ms=Sr*365.25,Mi=ms/12;function aA(n,e){if(typeof n=="string")return cA(n);if(typeof n==
"number")return hA(n,e);throw Error(`Value provided to ms() must be a string or number. value=${JSON.stringify(n)}`)}var $b=aA;
function cA(n){if(typeof n!="string"||n.length===0||n.length>100)throw Error(`Value provided to ms.parse() must be a str\
ing with length between 1 and 99. value=${JSON.stringify(n)}`);let e=/^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.
exec(n);if(!e?.groups)return NaN;let{value:t,unit:r="ms"}=e.groups,s=parseFloat(t),i=r.toLowerCase();switch(i){case"year\
s":case"year":case"yrs":case"yr":case"y":return s*ms;case"months":case"month":case"mo":return s*Mi;case"weeks":case"week":case"\
w":return s*Ii;case"days":case"day":case"d":return s*Sr;case"hours":case"hour":case"hrs":case"hr":case"h":return s*gs;case"\
minutes":case"minute":case"mins":case"min":case"m":return s*ps;case"seconds":case"second":case"secs":case"sec":case"s":return s*
fs;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s;default:throw Error(`Unknown unit "${i}\
" provided to ms.parse(). value=${JSON.stringify(n)}`)}}function lA(n){let e=Math.abs(n);return e>=ms?`${Math.round(n/ms)}\
y`:e>=Mi?`${Math.round(n/Mi)}mo`:e>=Ii?`${Math.round(n/Ii)}w`:e>=Sr?`${Math.round(n/Sr)}d`:e>=gs?`${Math.round(n/gs)}h`:
e>=ps?`${Math.round(n/ps)}m`:e>=fs?`${Math.round(n/fs)}s`:`${n}ms`}function uA(n){let e=Math.abs(n);return e>=ms?Vn(n,e,
ms,"year"):e>=Mi?Vn(n,e,Mi,"month"):e>=Ii?Vn(n,e,Ii,"week"):e>=Sr?Vn(n,e,Sr,"day"):e>=gs?Vn(n,e,gs,"hour"):e>=ps?Vn(n,e,
ps,"minute"):e>=fs?Vn(n,e,fs,"second"):`${n} ms`}function hA(n,e){if(typeof n!="number"||!Number.isFinite(n))throw Error(
"Value provided to ms.format() must be of type number.");return e?.long?uA(n):lA(n)}function Vn(n,e,t,r){let s=e>=t*1.5;
return`${Math.round(n/t)} ${r}${s?"s":""}`}function dA(n){t.debug=t,t.default=t,t.coerce=c,t.disable=i,t.enable=s,t.enabled=
o,t.humanize=$b,t.destroy=l,Object.keys(n).forEach(u=>{t[u]=n[u]}),t.names=[],t.skips=[],t.formatters={};function e(u){let h=0;
for(let d=0;d<u.length;d++)h=(h<<5)-h+u.charCodeAt(d),h|=0;return t.colors[Math.abs(h)%t.colors.length]}t.selectColor=e;
function t(u,h){let d,p=null,v,g;function E(...f){if(!E.enabled)return;const b=E,_=Number(new Date),m=_-(d||_);b.diff=m,
b.prev=d,b.curr=_,d=_,f[0]=t.coerce(f[0]),typeof f[0]!="string"&&f.unshift("%O");let y=0;f[0]=f[0].replace(/%([a-zA-Z%])/g,
(w,S)=>{if(w==="%%")return"%";y++;const x=t.formatters[S];if(typeof x=="function"){const C=f[y];w=x.call(b,C),f.splice(y,
1),y--}return w}),t.formatArgs.call(b,f),h?.onLog!=null&&h.onLog(...f),(b.log||t.log).apply(b,f)}return E.namespace=u,E.
useColors=t.useColors(),E.color=t.selectColor(u),E.extend=r,E.destroy=t.destroy,Object.defineProperty(E,"enabled",{enumerable:!0,
configurable:!1,get:()=>p!==null?p:(v!==t.namespaces&&(v=t.namespaces,g=t.enabled(u)),g),set:f=>{p=f}}),typeof t.init=="\
function"&&t.init(E),E}function r(u,h){const d=t(this.namespace+(typeof h>"u"?":":h)+u);return d.log=this.log,d}function s(u){
t.save(u),t.namespaces=u,t.names=[],t.skips=[];let h;const d=(typeof u=="string"?u:"").split(/[\s,]+/),p=d.length;for(h=
0;h<p;h++)d[h]&&(u=d[h].replace(/\*/g,".*?"),u[0]==="-"?t.skips.push(new RegExp("^"+u.substr(1)+"$")):t.names.push(new RegExp(
"^"+u+"$")))}function i(){const u=[...t.names.map(a),...t.skips.map(a).map(h=>"-"+h)].join(",");return t.enable(""),u}function o(u){
if(u[u.length-1]==="*")return!0;let h,d;for(h=0,d=t.skips.length;h<d;h++)if(t.skips[h].test(u))return!1;for(h=0,d=t.names.
length;h<d;h++)if(t.names[h].test(u))return!0;return!1}function a(u){return u.toString().substring(2,u.toString().length-
2).replace(/\.\*\?$/,"*")}function c(u){return u instanceof Error?u.stack??u.message:u}function l(){console.warn("Instan\
ce method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `\
debug`.")}return t.setupFormatters(t.formatters),t.enable(t.load()),t}var fA={};const Pa=vA(),pA=["#0000CC","#0000FF","#\
0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#\
3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#\
33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#\
99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#\
CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#\
FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#\
FFCC00","#FFCC33"];function gA(){return typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.
__nwjs)?!0:typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/)!=null?!1:typeof document<
"u"&&document.documentElement?.style?.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.
console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/)!=
null&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/)}function mA(n){
if(n[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+n[0]+(this.useColors?"%c ":" ")+"+"+$b(this.diff),
!this.useColors)return;const e="color: "+this.color;n.splice(1,0,e,"color: inherit");let t=0,r=0;n[0].replace(/%[a-zA-Z%]/g,
s=>{s!=="%%"&&(t++,s==="%c"&&(r=t))}),n.splice(r,0,e)}const bA=console.debug??console.log??(()=>{});function yA(n){try{n?
Pa?.setItem("debug",n):Pa?.removeItem("debug")}catch{}}function wA(){let n;try{n=Pa?.getItem("debug")}catch{}return!n&&typeof globalThis.
process<"u"&&"env"in globalThis.process&&(n=fA.DEBUG),n}function vA(){try{return localStorage}catch{}}function SA(n){n.j=
function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}}const ft=dA({formatArgs:mA,
save:yA,load:wA,useColors:gA,setupFormatters:SA,colors:pA,storage:Pa,log:bA});ft.formatters.b=n=>n==null?"undefined":iA.
baseEncode(n);ft.formatters.t=n=>n==null?"undefined":sA.baseEncode(n);ft.formatters.m=n=>n==null?"undefined":oA.baseEncode(
n);ft.formatters.p=n=>n==null?"undefined":n.toString();ft.formatters.c=n=>n==null?"undefined":n.toString();ft.formatters.
k=n=>n==null?"undefined":n.toString();ft.formatters.a=n=>n==null?"undefined":n.toString();function ff(n,e=""){const t=pf(
n.message),r=pf(n.stack);return t!=null&&r!=null?r.includes(t)?`${r.split(`
`).join(`
${e}`)}`:`${t}
${e}${r.split(`
`).join(`
${e}`)}`:r!=null?`${r.split(`
`).join(`
${e}`)}`:t!=null?`${t}`:`${n.toString()}`}function AA(n){return n instanceof AggregateError||n?.name==="AggregateError"&&
Array.isArray(n.errors)}function kb(n,e=""){if(AA(n)){let t=ff(n,e);return n.errors.length>0?(e=`${e}    `,t+=`
${e}${n.errors.map(r=>`${kb(r,`${e}`)}`).join(`
${e}`)}`):t+=`
${e}[Error list was empty]`,t.trim()}return ff(n,e)}ft.formatters.e=n=>n==null?"undefined":kb(n);function _A(n){const e=()=>{};
return e.enabled=!1,e.color="",e.diff=0,e.log=()=>{},e.namespace=n,e.destroy=()=>!0,e.extend=()=>e,e.useColors=()=>!1,e}
function Lb(n){return{forComponent(e){return Rb(e,n)}}}function Rb(n,e){let t=_A(`${n}:trace`);return ft.enabled(`${n}:t\
race`)&&ft.names.map(r=>r.toString()).find(r=>r.includes(":trace"))!=null&&(t=ft(`${n}:trace`,e)),Object.assign(ft(n,e),
{error:ft(`${n}:error`,e),trace:t,newScope:r=>Rb(`${n}:${r}`,e)})}function pf(n){if(n!=null&&(n=n.trim(),n.length!==0))return n}
class Wh extends xb{has(e){return this.find(e)!=null}find(e){return this.queue.find(t=>e.equals(t.options.peerId))}}let EA=class extends xb{constructor(e={}){
super({...e,sort:(t,r)=>t.options.priority>r.options.priority?-1:t.options.priority<r.options.priority?1:0})}};class CA{memoryStorage;points;duration;blockDuration;keyPrefix;constructor(e={}){
this.points=e.points??4,this.duration=e.duration??1,this.blockDuration=e.blockDuration??0,this.keyPrefix=e.keyPrefix??"r\
lflx",this.memoryStorage=new xA}consume(e,t=1,r={}){const s=this.getKey(e),i=this._getKeySecDuration(r);let o=this.memoryStorage.
incrby(s,t,i);if(o.remainingPoints=Math.max(this.points-o.consumedPoints,0),o.consumedPoints>this.points)throw this.blockDuration>
0&&o.consumedPoints<=this.points+t&&(o=this.memoryStorage.set(s,o.consumedPoints,this.blockDuration)),new pS("Rate limit\
 exceeded",o);return o}penalty(e,t=1,r={}){const s=this.getKey(e),i=this._getKeySecDuration(r),o=this.memoryStorage.incrby(
s,t,i);return o.remainingPoints=Math.max(this.points-o.consumedPoints,0),o}reward(e,t=1,r={}){const s=this.getKey(e),i=this.
_getKeySecDuration(r),o=this.memoryStorage.incrby(s,-t,i);return o.remainingPoints=Math.max(this.points-o.consumedPoints,
0),o}block(e,t){const r=t*1e3,s=this.points+1;return this.memoryStorage.set(this.getKey(e),s,t),{remainingPoints:0,msBeforeNext:r===
0?-1:r,consumedPoints:s,isFirstInDuration:!1}}set(e,t,r=0){const s=(r>=0?r:this.duration)*1e3;return this.memoryStorage.
set(this.getKey(e),t,r),{remainingPoints:0,msBeforeNext:s===0?-1:s,consumedPoints:t,isFirstInDuration:!1}}get(e){const t=this.
memoryStorage.get(this.getKey(e));return t!=null&&(t.remainingPoints=Math.max(this.points-t.consumedPoints,0)),t}delete(e){
this.memoryStorage.delete(this.getKey(e))}_getKeySecDuration(e){return e?.customDuration!=null&&e.customDuration>=0?e.customDuration:
this.duration}getKey(e){return this.keyPrefix.length>0?`${this.keyPrefix}:${e}`:e}parseKey(e){return e.substring(this.keyPrefix.
length)}}class xA{storage;constructor(){this.storage=new Map}incrby(e,t,r){const s=this.storage.get(e);if(s!=null){const i=s.
expiresAt!=null?s.expiresAt.getTime()-new Date().getTime():-1;return s.expiresAt==null||i>0?(s.value+=t,{remainingPoints:0,
msBeforeNext:i,consumedPoints:s.value,isFirstInDuration:!1}):this.set(e,t,r)}return this.set(e,t,r)}set(e,t,r){const s=r*
1e3,i=this.storage.get(e);i!=null&&clearTimeout(i.timeoutId);const o={value:t,expiresAt:s>0?new Date(Date.now()+s):void 0};
return this.storage.set(e,o),s>0&&(o.timeoutId=setTimeout(()=>{this.storage.delete(e)},s),o.timeoutId.unref!=null&&o.timeoutId.
unref()),{remainingPoints:0,msBeforeNext:s===0?-1:s,consumedPoints:o.value,isFirstInDuration:!0}}get(e){const t=this.storage.
get(e);if(t!=null)return{remainingPoints:0,msBeforeNext:t.expiresAt!=null?t.expiresAt.getTime()-new Date().getTime():-1,
consumedPoints:t.value,isFirstInDuration:!1}}delete(e){const t=this.storage.get(e);return t!=null?(t.timeoutId!=null&&clearTimeout(
t.timeoutId),this.storage.delete(e),!0):!1}}function Nb(n,e,t){let r,s,i=!1;function o(){const l={signal:s.signal};let u;
t?.timeout!=null&&(u=Fn([s.signal,AbortSignal.timeout(t.timeout)]),l.signal=u),i=!0,Promise.resolve().then(async()=>{await n(
l)}).catch(()=>{}).finally(()=>{u!=null&&(u.aborted?u.clear():u.addEventListener("abort",()=>{u.clear()},{once:!0})),i=!1,
!s.signal.aborted&&(r=setTimeout(o,e))})}const a=Ma(o,t?.debounce??100);let c=!1;return{setInterval:l=>{e!==l&&(e=l,r!=null&&
(clearTimeout(r),r=setTimeout(o,e)))},setTimeout:l=>{t??={},t.timeout=l},run:()=>{i||(clearTimeout(r),a())},start:()=>{c||
(c=!0,s=new AbortController,s.signal,t?.runImmediately===!0?queueMicrotask(()=>{o()}):r=setTimeout(o,e))},stop:()=>{clearTimeout(
r),s?.abort(),c=!1}}}class IA extends Map{metric;constructor(e){super();const{name:t,metrics:r}=e;this.metric=r.registerMetric(
t),this.updateComponentMetric()}set(e,t){return super.set(e,t),this.updateComponentMetric(),this}delete(e){const t=super.
delete(e);return this.updateComponentMetric(),t}clear(){super.clear(),this.updateComponentMetric()}updateComponentMetric(){
this.metric.update(this.size)}}function Zt(n){const{name:e,metrics:t}=n;let r;return t!=null?r=new IA({name:e,metrics:t}):
r=new Map,r}function MA(n){return n[Symbol.asyncIterator]!=null}function Cu(n){if(MA(n))return(async()=>{const t=[];for await(const r of n)
t.push(r);return t})();const e=[];for(const t of n)e.push(t);return e}function kr(n,e){if(n===e)return!0;if(n.byteLength!==
e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function PA(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function bs(n){if(n instanceof
Uint8Array&&n.constructor.name==="Uint8Array")return Pi(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.
isView(n))return Pi(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function TA(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const gf=4096;
function DA(n){const e=n.length;if(e<=gf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.
apply(String,n.subarray(r,r+=gf));return t}function $A(n){return n?.buffer instanceof ArrayBuffer}function Pi(n){return $A(
n)?n:n.slice()}function kA(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),
s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,
m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==
0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-
_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var LA=kA,RA=LA;let NA=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},FA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Fb(this,e)}},
UA=class{decoders;constructor(e){this.decoders=e}or(e){return Fb(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Fb(n,e){return new UA({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let OA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new NA(e,t,r),this.decoder=new FA(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function _c({name:n,prefix:e,encode:t,decode:r}){return new OA(n,e,t,
r)}function Yi({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=RA(t,n,r);return _c({prefix:e,
name:n,encode:s,decode:o=>bs(i(o))})}function BA(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function zA(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function VA(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function me({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=VA(r,s);return _c(
{prefix:e,name:n,encode(o){return zA(o,r,t)},decode(o){return BA(o,i,t,n)}})}const ct=Yi({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),qA=Yi({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),WA=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ct,
base58flickr:qA},Symbol.toStringTag,{value:"Module"})),si=me({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),KA=me({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),GA=me({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),HA=me({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),jA=me({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),XA=me({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
QA=me({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),YA=me(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),JA=me(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),ZA=Object.freeze(Object.defineProperty(
{__proto__:null,base32:si,base32hex:jA,base32hexpad:QA,base32hexpadupper:YA,base32hexupper:XA,base32pad:GA,base32padupper:HA,
base32upper:KA,base32z:JA},Symbol.toStringTag,{value:"Module"})),aa=Yi({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),e_=Yi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),t_=Object.freeze(Object.defineProperty({__proto__:null,base36:aa,base36upper:e_},Symbol.
toStringTag,{value:"Module"}));var n_=Ub,mf=128,r_=-128,s_=Math.pow(2,31);function Ub(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
s_;)e[t++]=n&255|mf,n/=128;for(;n&r_;)e[t++]=n&255|mf,n>>>=7;return e[t]=n|0,Ub.bytes=t-r+1,e}var i_=xu,o_=128,bf=127;function xu(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw xu.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&bf)<<s:(o&bf)*Math.pow(2,s),s+=7}while(o>=o_);return xu.bytes=i-r,t}var a_=Math.pow(2,7),c_=Math.pow(2,14),l_=Math.
pow(2,21),u_=Math.pow(2,28),h_=Math.pow(2,35),d_=Math.pow(2,42),f_=Math.pow(2,49),p_=Math.pow(2,56),g_=Math.pow(2,63),m_=function(n){
return n<a_?1:n<c_?2:n<l_?3:n<u_?4:n<h_?5:n<d_?6:n<f_?7:n<p_?8:n<g_?9:10},b_={encode:n_,decode:i_,encodingLength:m_},Ta=b_;
function Iu(n,e=0){const t=Ta.decode(n,e),r=Ta.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function Da(n,e,t=0){return Ta.
encode(n,e,t),e}function $a(n){return Ta.encodingLength(n)}function Ec(n,e){const t=e.byteLength,r=$a(n),s=r+$a(t),i=new Uint8Array(
s+t);return Da(n,i,0),Da(t,i,r),i.set(e,s),new Kh(n,t,e,i)}function y_(n){const e=bs(n),[t,r]=Iu(e),[s,i]=Iu(e.subarray(
r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new Kh(t,s,o,e)}function w_(n,e){if(n===
e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&PA(n.bytes,t.bytes)}}let Kh=class{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Pi(r),this.bytes=Pi(s)}};function yf(n,e){const{bytes:t,version:r}=n;switch(r){case 0:
return S_(t,Mu(n),e??ct.encoder);default:return A_(t,Mu(n),e??si.encoder)}}const wf=new WeakMap;function Mu(n){const e=wf.
get(n);if(e==null){const t=new Map;return wf.set(n,t),t}return e}let Cc=class Ee{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Pi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==Ts)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==__)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return Ee.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=Ec(e,t);return Ee.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return Ee.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&w_(e.multihash,r.multihash)}toString(e){return yf(this,e)}toJSON(){return{
"/":yf(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ee)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new Ee(r,s,i,o??vf(r,s,i.bytes))}else if(t[E_]===!0){const{
version:r,multihash:s,code:i}=t,o=y_(s);return Ee.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==Ts)throw new Error(`Version 0 CID must use dag-pb (code: ${Ts}) block encoding`);return new Ee(
e,t,r,r.bytes)}case 1:{const s=vf(e,t,r.bytes);return new Ee(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return Ee.create(0,Ts,e)}static createV1(e,t){return Ee.create(1,e,t)}static decode(e){const[t,r]=Ee.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ee.inspectBytes(e),r=t.size-t.multihashSize,
s=bs(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Kh(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ee.createV0(o):Ee.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,d]=Iu(e.subarray(t));return t+=d,h};let s=r(),
i=Ts;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=v_(e,t),
i=Ee.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Mu(
i).set(r,e),i}};function v_(n,e){switch(n[0]){case"Q":{const t=e??ct;return[ct.prefix,t.decode(`${ct.prefix}${n}`)]}case ct.
prefix:{const t=e??ct;return[ct.prefix,t.decode(n)]}case si.prefix:{const t=e??si;return[si.prefix,t.decode(n)]}case aa.
prefix:{const t=e??aa;return[aa.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function S_(n,e,t){const{prefix:r}=t;if(r!==
ct.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function A_(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Ts=112,__=18;function vf(n,e,t){const r=$a(n),s=r+$a(e),i=new Uint8Array(s+t.
byteLength);return Da(n,i,0),Da(e,i,r),i.set(t,s),i}const E_=Symbol.for("@ipld/js-cid/CID"),Ob=0,C_="identity",Bb=bs;function x_(n,e){
if(e?.truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Ec(Ob,Bb(n))}const Gh={code:Ob,
name:C_,encode:Bb,digest:x_};function I_(n){return n.buffer instanceof ArrayBuffer}function Un(n){return I_(n)?n:n.slice()}
async function M_(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,Un(e),Un(
t.subarray()));return r?.signal?.throwIfAborted(),i}function an(n=0){return new Uint8Array(n)}function Ar(n=0){return new Uint8Array(
n)}function P_(n){return n?.buffer instanceof ArrayBuffer}function T_(n){if(P_(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Pu(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=Ar(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return T_(t)}const zb=Symbol.for("@achingbrain/uint8arraylist");function Sf(n,e){if(e==null||e<0)
throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-
t};t=s}throw new RangeError("index is out of bounds")}function mo(n){return!!n?.[zb]}let en=class ca{bufs;length;[zb]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(mo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(mo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=Sf(this.bufs,e);return t.buf[t.index]}set(e,t){const r=Sf(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(mo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Pu(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:Pu(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ca;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!mo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=Ar(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=an(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=an(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=an(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=Ar(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=an(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=an(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=an(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=an(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=an(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ca)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!kr(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ca;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const D_=Yi({prefix:"9",name:"\
base10",alphabet:"0123456789"}),$_=Object.freeze(Object.defineProperty({__proto__:null,base10:D_},Symbol.toStringTag,{value:"\
Module"})),k_=me({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),L_=me({prefix:"\
F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),R_=Object.freeze(Object.defineProperty(
{__proto__:null,base16:k_,base16upper:L_},Symbol.toStringTag,{value:"Module"})),N_=me({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),F_=Object.freeze(Object.defineProperty({__proto__:null,base2:N_},Symbol.toStringTag,{value:"Module"})),
Vb=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),U_=Vb.reduce((n,e,t)=>(n[t]=e,n),[]),O_=Vb.reduce((n,e,t)=>{const r=e.codePointAt(
0);if(r==null)throw new Error(`Invalid character: ${e}`);return n[r]=t,n},[]);function B_(n){return n.reduce((e,t)=>(e+=
U_[t],e),"")}function z_(n){const e=[];for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=O_[r];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const V_=_c({prefix:"🚀",name:"base256emoji",encode:B_,decode:z_}),q_=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:V_},Symbol.toStringTag,{value:"Module"})),W_=me({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),K_=me({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOP\
QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),G_=me({prefix:"u",name:"base64url",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),H_=me({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),j_=Object.freeze(Object.defineProperty(
{__proto__:null,base64:W_,base64pad:K_,base64url:G_,base64urlpad:H_},Symbol.toStringTag,{value:"Module"})),X_=me({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Q_=Object.freeze(Object.defineProperty({__proto__:null,base8:X_},Symbol.
toStringTag,{value:"Module"})),Y_=_c({prefix:"\0",name:"identity",encode:n=>DA(bs(n)),decode:n=>bs(TA(n))}),J_=Object.freeze(
Object.defineProperty({__proto__:null,identity:Y_},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Z_=20;function eE({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new tE(n,e,t,r,s)}let tE=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??Z_,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
Af(r,this.code,t?.truncate):r.then(s=>Af(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Af(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return Ec(e,n)}function nE(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const rE=eE({name:"sha2-256",code:18,encode:nE("SHA-256")}),_f={...J_,...F_,...Q_,...$_,...R_,...ZA,
...t_,...WA,...j_,...q_};function qb(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const Ef=qb("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Yc=qb("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Ar(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Wb={utf8:Ef,"utf-8":Ef,hex:_f.base16,latin1:Yc,ascii:Yc,
binary:Yc,..._f};function On(n,e="utf8"){const t=Wb[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function lt(n,e="utf8"){const t=Wb[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const sE=parseInt("11111",2),Tu=parseInt("10000000",2),iE=parseInt("01\
111111",2),Cf={0:Ds,1:Ds,2:oE,3:lE,4:uE,5:cE,6:aE,16:Ds,22:Ds,48:Ds};function xc(n,e={offset:0}){const t=n[e.offset]&sE;
if(e.offset++,Cf[t]!=null)return Cf[t](n,e);throw new Error("No decoder for tag "+t)}function Ji(n,e){let t=0;if((n[e.offset]&
Tu)===Tu){const r=n[e.offset]&iE;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)throw new Error(
"invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}function Ds(n,e){
Ji(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=xc(n,e);if(r===null)break;t.push(r)}return t}function oE(n,e){
const t=Ji(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.offset+=t,Uint8Array.
from(i)}function aE(n,e){const t=Ji(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function cE(n,e){return e.offset++,null}function lE(n,e){
const t=Ji(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=t,r!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function uE(n,e){const t=Ji(n,e),r=n.subarray(e.offset,e.offset+t);
return e.offset+=t,r}function hE(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new en;for(let r=0;r<e.length;r+=
2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function Hh(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=hE(n.byteLength);return new en(Uint8Array.from([e.byteLength|Tu]),e)}function Du(n){const e=new en,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new en(Uint8Array.from([2]),Hh(e),e)}function Kb(n){
const e=Uint8Array.from([0]),t=new en(e,n);return new en(Uint8Array.from([3]),Hh(t),t)}function ii(n,e=48){const t=new en;
for(const r of n)t.append(r);return new en(Uint8Array.from([e]),Hh(t),t)}const dE=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),fE=Uint8Array.from([6,5,43,129,4,0,34]),pE=Uint8Array.from([6,5,43,129,4,0,35]),gE={ext:!0,kty:"EC",crv:"P-256"},
mE={ext:!0,kty:"EC",crv:"P-384"},bE={ext:!0,kty:"EC",crv:"P-521"},Jc=32,Zc=48,el=66;function yE(n){const e=xc(n);return wE(
e)}function wE(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===Jc*2+1)return r=lt(e.subarray(t,t+Jc),"base64url"),s=
lt(e.subarray(t+Jc),"base64url"),new tl({...gE,key_ops:["verify"],x:r,y:s});if(e.byteLength===Zc*2+1)return r=lt(e.subarray(
t,t+Zc),"base64url"),s=lt(e.subarray(t+Zc),"base64url"),new tl({...mE,key_ops:["verify"],x:r,y:s});if(e.byteLength===el*
2+1)return r=lt(e.subarray(t,t+el),"base64url"),s=lt(e.subarray(t+el),"base64url"),new tl({...bE,key_ops:["verify"],x:r,
y:s});throw new L(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function vE(n){return ii(
[Du(Uint8Array.from([1])),ii([SE(n.crv)],160),ii([Kb(new en(Uint8Array.from([4]),On(n.x??"","base64url"),On(n.y??"","bas\
e64url")))],161)]).subarray()}function SE(n){if(n==="P-256")return dE;if(n==="P-384")return fE;if(n==="P-521")return pE;
throw new L(`Invalid curve ${n}`)}let tl=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=vE(this.jwk)),this._raw}toMultihash(){return Gh.digest(ed(this))}toCID(){return Cc.createV1(114,this.toMultihash())}toString(){
return ct.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:kr(this.
raw,e.raw)}async verify(e,t,r){return M_(this.jwk,t,e,r)}},xf=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},AE=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const _r={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new AE(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},Gb=32,jh=64,$u=32;let ns;const Hb=(async()=>{try{return await _r.get().
subtle.generateKey({name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();function _E(){const n=vr.utils.randomSecretKey(),
e=vr.getPublicKey(n);return{privateKey:TE(n,e),publicKey:e}}async function EE(n,e){let t;n.length===jh?t=n.subarray(0,32):
t=n;const r={crv:"Ed25519",kty:"OKP",x:lt(n.subarray(32),"base64url"),d:lt(t,"base64url"),ext:!0,key_ops:["sign"]},s=await _r.
get().subtle.importKey("jwk",r,{name:"Ed25519"},!0,["sign"]),i=await _r.get().subtle.sign({name:"Ed25519"},s,Un(e instanceof
Uint8Array?e:e.subarray()));return new Uint8Array(i,0,i.byteLength)}function CE(n,e){const t=n.subarray(0,$u);return vr.
sign(e instanceof Uint8Array?e:e.subarray(),t)}async function xE(n,e){return ns==null&&(ns=await Hb),ns?EE(n,e):CE(n,e)}
async function IE(n,e,t){if(n.buffer instanceof ArrayBuffer){const r=await _r.get().subtle.importKey("raw",n.buffer,{name:"\
Ed25519"},!1,["verify"]);return await _r.get().subtle.verify({name:"Ed25519"},r,Un(e),Un(t instanceof Uint8Array?t:t.subarray()))}
throw new TypeError("WebCrypto does not support SharedArrayBuffer for Ed25519 keys")}function ME(n,e,t){return vr.verify(
e,t instanceof Uint8Array?t:t.subarray(),n)}async function PE(n,e,t){return ns==null&&(ns=await Hb),ns?IE(n,e,t):ME(n,e,
t)}function TE(n,e){const t=new Uint8Array(jh);for(let r=0;r<$u;r++)t[r]=n[r],t[$u+r]=e[r];return t}function Xh(n){return n==
null?!1:typeof n.then=="function"&&typeof n.catch=="function"&&typeof n.finally=="function"}let jb=class{type="Ed25519";raw;constructor(e){
this.raw=Qh(e,Gb)}toMultihash(){return Gh.digest(ed(this))}toCID(){return Cc.createV1(114,this.toMultihash())}toString(){
return ct.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:kr(this.
raw,e.raw)}verify(e,t,r){r?.signal?.throwIfAborted();const s=PE(this.raw,t,e);return Xh(s)?s.then(i=>(r?.signal?.throwIfAborted(),
i)):s}};class DE{type="Ed25519";raw;publicKey;constructor(e,t){this.raw=Qh(e,jh),this.publicKey=new jb(t)}equals(e){return e==
null||!(e.raw instanceof Uint8Array)?!1:kr(this.raw,e.raw)}sign(e,t){t?.signal?.throwIfAborted();const r=xE(this.raw,e);
return Xh(r)?r.then(s=>(t?.signal?.throwIfAborted(),s)):(t?.signal?.throwIfAborted(),r)}}function $E(n){return n=Qh(n,Gb),
new jb(n)}async function kE(){const{privateKey:n,publicKey:e}=_E();return new DE(n,e)}function Qh(n,e){if(n=Uint8Array.from(
n??[]),n.length!==e)throw new L(`Key must be a Uint8Array of length ${e}, got ${n.length}`);return n}const LE=Math.pow(2,
7),RE=Math.pow(2,14),NE=Math.pow(2,21),Xb=Math.pow(2,28),Qb=Math.pow(2,35),Yb=Math.pow(2,42),Jb=Math.pow(2,49),qe=128,cn=127;
function Yh(n){if(n<LE)return 1;if(n<RE)return 2;if(n<NE)return 3;if(n<Xb)return 4;if(n<Qb)return 5;if(n<Yb)return 6;if(n<
Jb)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");
return 8}function FE(n,e,t=0){switch(Yh(n)){case 8:e[t++]=n&255|qe,n/=128;case 7:e[t++]=n&255|qe,n/=128;case 6:e[t++]=n&
255|qe,n/=128;case 5:e[t++]=n&255|qe,n/=128;case 4:e[t++]=n&255|qe,n>>>=7;case 3:e[t++]=n&255|qe,n>>>=7;case 2:e[t++]=n&
255|qe,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function UE(n,e){let t=n[e],
r=0;if(r+=t&cn,t<qe||(t=n[e+1],r+=(t&cn)<<7,t<qe)||(t=n[e+2],r+=(t&cn)<<14,t<qe)||(t=n[e+3],r+=(t&cn)<<21,t<qe)||(t=n[e+
4],r+=(t&cn)*Xb,t<qe)||(t=n[e+5],r+=(t&cn)*Qb,t<qe)||(t=n[e+6],r+=(t&cn)*Yb,t<qe)||(t=n[e+7],r+=(t&cn)*Jb,t<qe))return r;
throw new RangeError("Could not decode varint")}const Jh=new Float32Array([-0]),Cn=new Uint8Array(Jh.buffer);function OE(n,e,t){
Jh[0]=n,e[t]=Cn[0],e[t+1]=Cn[1],e[t+2]=Cn[2],e[t+3]=Cn[3]}function BE(n,e){return Cn[0]=n[e],Cn[1]=n[e+1],Cn[2]=n[e+2],Cn[3]=
n[e+3],Jh[0]}const Zh=new Float64Array([-0]),Ie=new Uint8Array(Zh.buffer);function zE(n,e,t){Zh[0]=n,e[t]=Ie[0],e[t+1]=Ie[1],
e[t+2]=Ie[2],e[t+3]=Ie[3],e[t+4]=Ie[4],e[t+5]=Ie[5],e[t+6]=Ie[6],e[t+7]=Ie[7]}function VE(n,e){return Ie[0]=n[e],Ie[1]=n[e+
1],Ie[2]=n[e+2],Ie[3]=n[e+3],Ie[4]=n[e+4],Ie[5]=n[e+5],Ie[6]=n[e+6],Ie[7]=n[e+7],Zh[0]}const qE=BigInt(Number.MAX_SAFE_INTEGER),
WE=BigInt(Number.MIN_SAFE_INTEGER);let Wt=class Kn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&
this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.
hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+
1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;
return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===
0n)return cr;if(e<qE&&e>WE)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>If&&(s=0n,++r>If&&(r=0n))),new Kn(Number(s),Number(r))}static fromNumber(e){if(e===0)return cr;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new Kn(r,s)}static from(e){return typeof e=="number"?Kn.fromNumber(e):typeof e=="bigint"?Kn.fromBigInt(e):typeof e=="str\
ing"?Kn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Kn(e.low>>>0,e.high>>>0):cr}};const cr=new Wt(0,0);cr.toBigInt=
function(){return 0n};cr.zzEncode=cr.zzDecode=function(){return this};cr.length=function(){return 1};const If=4294967296n;
function KE(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function GE(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Zb(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function wt(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function bo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let HE=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Un(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,wt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw wt(this,4);return bo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw wt(
this,4);return bo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw wt(this,4);const e=BE(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw wt(this,4);const e=VE(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw wt(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return GE(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw wt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw wt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Wt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw wt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw wt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw wt(this,8);const e=bo(this.buf,this.pos+=4),t=bo(this.buf,this.pos+=4);return new Wt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=UE(this.buf,this.pos);
return this.pos+=Yh(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function ey(n){return new HE(n instanceof Uint8Array?
n:n.subarray())}function ty(n,e,t){const r=ey(n);return e.decode(r,void 0,t)}function jE(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Ar(o);s+o>8192&&(r=Ar(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Hs=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function nl(){}let XE=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const QE=jE();function YE(n){return globalThis.Buffer!=null?
Ar(n):QE(n)}let ku=class{len;head;tail;states;constructor(){this.len=0,this.head=new Hs(nl,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Hs(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new ZE((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
yo,10,Wt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Wt.fromBigInt(e);
return this._push(yo,t.length(),t)}uint64Number(e){return this._push(FE,Yh(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Wt.fromBigInt(e).zzEncode();return this._push(yo,t.length(),t)}sint64Number(e){const t=Wt.fromNumber(e).zzEncode();
return this._push(yo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(rl,1,e?1:0)}fixed32(e){
return this._push($s,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Wt.fromBigInt(e);return this._push($s,
4,t.lo)._push($s,4,t.hi)}fixed64Number(e){const t=Wt.fromNumber(e);return this._push($s,4,t.lo)._push($s,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(OE,4,e)}double(e){return this._push(zE,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(rl,1,0):this.uint32(t)._push(eC,t,e)}string(e){const t=KE(e);return t!==0?this.uint32(t)._push(
Zb,t,e):this._push(rl,1,0)}fork(){return this.states=new XE(this),this.head=this.tail=new Hs(nl,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Hs(nl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=YE(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function rl(n,e,t){e[t]=n&255}function JE(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let ZE=class extends Hs{next;constructor(e,t){super(JE,e,t),this.next=void 0}};
function yo(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function $s(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function eC(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(ku.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(tC,e,n),this},ku.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(nC,e,n),this});function tC(n,e,t){e.set(n,t)}function nC(n,e,t){n.length<40?Zb(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(On(n),t)}function rC(){return new ku}function ny(n,e){const t=rC();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*ry(n,e,t){const r=ey(n);yield*e.stream(r,void 0,".",t)}const sy={VARINT:0,LENGTH_DELIMITED:2};function iy(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function sC(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return iy("enum",sy.VARINT,t,r,s)}function oy(n,e,t){return iy("message",sy.LENGTH_DELIMITED,n,e,
t)}var Re;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Re||(Re={}));var Lu;(function(n){
n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(Lu||(Lu={}));(function(n){
n.codec=()=>sC(Lu)})(Re||(Re={}));var Ti;(function(n){let e;n.codec=()=>(e==null&&(e=oy((i,o,a={})=>{a.lengthDelimited!==
!1&&o.fork(),i.Type!=null&&(o.uint32(8),Re.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Re.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Re.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return ny(i,n.codec())}n.encode=t;function r(i,o){return ty(i,n.codec(),o)}n.decode=r;function s(i,o){return ry(i,n.codec(),
o)}n.stream=s})(Ti||(Ti={}));var Mf;(function(n){let e;n.codec=()=>(e==null&&(e=oy((i,o,a={})=>{a.lengthDelimited!==!1&&
o.fork(),i.Type!=null&&(o.uint32(8),Re.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Re.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Re.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return ny(i,n.codec())}n.encode=t;function r(i,o){return ty(i,n.codec(),o)}n.decode=r;function s(i,o){return ry(i,n.codec(),
o)}n.stream=s})(Mf||(Mf={}));let iC=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){
return this._raw==null&&(this._raw=uC(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return Cc.createV1(
114,this._multihash)}toString(){return ct.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:kr(this.raw,e.raw)}verify(e,t,r){return fC(this.jwk,t,e,r)}};const oC=18,aC=1062,cC=Uint8Array.from([48,13,
6,9,42,134,72,134,247,13,1,1,1,5,0]);function lC(n){const e=xc(n[1],{offset:0});return{kty:"RSA",n:lt(e[0],"base64url"),
e:lt(e[1],"base64url")}}function uC(n){if(n.n==null||n.e==null)throw new L("JWK was missing components");return ii([cC,Kb(
ii([Du(On(n.n,"base64url")),Du(On(n.e,"base64url"))]))]).subarray()}function hC(n,e){if(n.byteLength>=aC)throw new Dt("K\
ey size is too large");const t=xc(n,{offset:0});return dC(t,n,e)}function dC(n,e,t){const r=lC(n);if(t==null){const s=or(
Ti.encode({Type:Re.RSA,Data:e}));t=Ec(oC,s)}return new iC(r,t)}async function fC(n,e,t,r){const s=await _r.get().subtle.
importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await _r.
get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Un(e),Un(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),
i}function pC(n,e,t,r){const s=rE.digest(t instanceof Uint8Array?t:t.subarray());if(Xh(s))return s.then(({digest:i})=>(r?.
signal?.throwIfAborted(),Oe.verify(e,i,n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new xf(String(
i))});try{return r?.signal?.throwIfAborted(),Oe.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new xf(String(
i))}}let gC=class{type="secp256k1";raw;_key;constructor(e){this._key=yC(e),this.raw=bC(this._key)}toMultihash(){return Gh.
digest(ed(this))}toCID(){return Cc.createV1(114,this.toMultihash())}toString(){return ct.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:kr(this.raw,e.raw)}verify(e,t,r){return pC(this.
_key,t,e,r)}};function mC(n){return new gC(n)}function bC(n){return Oe.Point.fromBytes(n).toBytes()}function yC(n){try{return Oe.
Point.fromBytes(n),n}catch(e){throw new Dt(String(e))}}async function wC(n,e){return kE()}function vC(n,e){const{Type:t,
Data:r}=Ti.decode(n),s=r??new Uint8Array;switch(t){case Re.RSA:return hC(s,e);case Re.Ed25519:return $E(s);case Re.secp256k1:
return mC(s);case Re.ECDSA:return yE(s);default:throw new pc}}function ed(n){return Ti.encode({Type:Re[n.type],Data:n.raw})}
async function SC(n,e,t){if(t?.signal?.throwIfAborted(),e!=null){let r;try{r=e instanceof Uint8Array?vC(e):e}catch(s){throw new Dt(
`Could not decode public key - ${s.message}`)}if(!kr(r.toMultihash().bytes,n.toMultihash().bytes))throw new Dt("Public k\
ey does not match peer id");return r}if(n.publicKey==null)throw new Dt("No public key available for peer id");return n.publicKey}
async function AC(n){if(n.connectionProtector===null&&globalThis.process?.env?.LIBP2P_FORCE_PNET!=null)throw new L("Priv\
ate network is enforced, but no protector was provided");return n}function ay(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return ka(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return ka(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function _C(n){
return n?.buffer instanceof ArrayBuffer}function ka(n){return _C(n)?n:n.slice()}function EC(n,e,t){if(n.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(
i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(
256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,
f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>
0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>
0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=
n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.
charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;
if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(
_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(f);if(b)return b;throw new Error(`Non-${e} character`)}
return{encode:v,decodeUnsafe:g,decode:E}}var CC=EC,xC=CC;let IC=class{name;prefix;baseEncode;constructor(e,t,r){this.name=
e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},MC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return cy(this,e)}},
PC=class{decoders;constructor(e){this.decoders=e}or(e){return cy(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function cy(n,e){return new PC({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let TC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new IC(e,t,r),this.decoder=new MC(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function DC({name:n,prefix:e,encode:t,decode:r}){return new TC(n,e,t,
r)}function ly({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=xC(t,n,r);return DC({prefix:e,
name:n,encode:s,decode:o=>ay(i(o))})}const $C=ly({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXY\
Zabcdefghijkmnopqrstuvwxyz"});ly({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKL\
MNPQRSTUVWXYZ"});var kC=uy,Pf=128,LC=-128,RC=Math.pow(2,31);function uy(n,e,t){e=e||[],t=t||0;for(var r=t;n>=RC;)e[t++]=
n&255|Pf,n/=128;for(;n&LC;)e[t++]=n&255|Pf,n>>>=7;return e[t]=n|0,uy.bytes=t-r+1,e}var NC=Ru,FC=128,Tf=127;function Ru(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw Ru.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&Tf)<<s:(o&Tf)*Math.pow(2,s),s+=7}while(o>=FC);return Ru.bytes=i-r,t}var UC=Math.pow(2,7),OC=Math.pow(2,14),BC=Math.
pow(2,21),zC=Math.pow(2,28),VC=Math.pow(2,35),qC=Math.pow(2,42),WC=Math.pow(2,49),KC=Math.pow(2,56),GC=Math.pow(2,63),HC=function(n){
return n<UC?1:n<OC?2:n<BC?3:n<zC?4:n<VC?5:n<qC?6:n<WC?7:n<KC?8:n<GC?9:10},jC={encode:kC,decode:NC,encodingLength:HC},Df=jC;
function $f(n,e=0){const t=Df.decode(n,e),r=Df.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function XC(n){const e=ay(n),[
t,r]=$f(e),[s,i]=$f(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new QC(
t,s,o,e)}let QC=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=ka(r),this.bytes=ka(
s)}};function oi(n,e){const t={[Symbol.iterator]:()=>t,next:()=>{const r=n.next(),s=r.value;return r.done===!0||s==null?
{done:!0,value:void 0}:{done:!1,value:e(s)}}};return t}function sl(n){const e=XC($C.decode(`z${n}`));return Tr(e)}class Lr{map;constructor(e){
if(this.map=new Map,e!=null)for(const[t,r]of e.entries())this.map.set(t.toString(),{key:t,value:r})}[Symbol.iterator](){
return this.entries()}clear(){this.map.clear()}delete(e){return this.map.delete(e.toString())}entries(){return oi(this.map.
entries(),e=>[e[1].key,e[1].value])}forEach(e){this.map.forEach((t,r)=>{e(t.value,t.key,this)})}get(e){return this.map.get(
e.toString())?.value}has(e){return this.map.has(e.toString())}set(e,t){this.map.set(e.toString(),{key:e,value:t})}keys(){
return oi(this.map.values(),e=>e.key)}values(){return oi(this.map.values(),e=>e.value)}get size(){return this.map.size}}
class lr{set;constructor(e){if(this.set=new Set,e!=null)for(const t of e)this.set.add(t.toString())}get size(){return this.
set.size}[Symbol.iterator](){return this.values()}add(e){this.set.add(e.toString())}clear(){this.set.clear()}delete(e){this.
set.delete(e.toString())}entries(){return oi(this.set.entries(),e=>{const t=sl(e[0]);return[t,t]})}forEach(e){this.set.forEach(
t=>{const r=sl(t);e(r,r,this)})}has(e){return this.set.has(e.toString())}values(){return oi(this.set.values(),e=>sl(e))}intersection(e){
const t=new lr;for(const r of e)this.has(r)&&t.add(r);return t}difference(e){const t=new lr;for(const r of this)e.has(r)||
t.add(r);return t}union(e){const t=new lr;for(const r of e)t.add(r);for(const r of this)t.add(r);return t}}class YC{filter;constructor(e,t){
this.filter=_i(e,t)}has(e){return this.filter.has(e.toMultihash().bytes)}add(e){this.filter.add(e.toMultihash().bytes)}remove(e){
this.filter.remove?.(e.toMultihash().bytes)}}function JC(n,e=.001){return new YC(n,e)}class ZC extends Lr{metric;constructor(e){
super();const{name:t,metrics:r}=e;this.metric=r.registerMetric(t),this.updateComponentMetric()}set(e,t){return super.set(
e,t),this.updateComponentMetric(),this}delete(e){const t=super.delete(e);return this.updateComponentMetric(),t}clear(){super.
clear(),this.updateComponentMetric()}updateComponentMetric(){this.metric.update(this.size)}}function ex(n){const{name:e,
metrics:t}=n;let r;return t!=null?r=new ZC({name:e,metrics:t}):r=new Lr,r}function Ms(n,e){if(n===e)return!0;if(n.byteLength!==
e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function tx(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function ys(n){if(n instanceof
Uint8Array&&n.constructor.name==="Uint8Array")return Di(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.
isView(n))return Di(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function nx(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const kf=4096;
function rx(n){const e=n.length;if(e<=kf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.
apply(String,n.subarray(r,r+=kf));return t}function sx(n){return n?.buffer instanceof ArrayBuffer}function Di(n){return sx(
n)?n:n.slice()}function ix(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),
s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,
m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==
0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-
_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var ox=ix,ax=ox;let cx=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},lx=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return hy(this,e)}},
ux=class{decoders;constructor(e){this.decoders=e}or(e){return hy(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function hy(n,e){return new ux({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let hx=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new cx(e,t,r),this.decoder=new lx(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Ic({name:n,prefix:e,encode:t,decode:r}){return new hx(n,e,t,
r)}function Zi({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=ax(t,n,r);return Ic({prefix:e,
name:n,encode:s,decode:o=>ys(i(o))})}function dx(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function fx(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function px(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function be({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=px(r,s);return Ic(
{prefix:e,name:n,encode(o){return fx(o,r,t)},decode(o){return dx(o,i,t,n)}})}const ut=Zi({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),gx=Zi({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),mx=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ut,
base58flickr:gx},Symbol.toStringTag,{value:"Module"})),ai=be({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),bx=be({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),yx=be({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),wx=be({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),vx=be({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),Sx=be({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
Ax=be({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),_x=be(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Ex=be(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Cx=Object.freeze(Object.defineProperty(
{__proto__:null,base32:ai,base32hex:vx,base32hexpad:Ax,base32hexpadupper:_x,base32hexupper:Sx,base32pad:yx,base32padupper:wx,
base32upper:bx,base32z:Ex},Symbol.toStringTag,{value:"Module"})),la=Zi({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),xx=Zi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),Ix=Object.freeze(Object.defineProperty({__proto__:null,base36:la,base36upper:xx},Symbol.
toStringTag,{value:"Module"}));var Mx=dy,Lf=128,Px=-128,Tx=Math.pow(2,31);function dy(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
Tx;)e[t++]=n&255|Lf,n/=128;for(;n&Px;)e[t++]=n&255|Lf,n>>>=7;return e[t]=n|0,dy.bytes=t-r+1,e}var Dx=Nu,$x=128,Rf=127;function Nu(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw Nu.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&Rf)<<s:(o&Rf)*Math.pow(2,s),s+=7}while(o>=$x);return Nu.bytes=i-r,t}var kx=Math.pow(2,7),Lx=Math.pow(2,14),Rx=Math.
pow(2,21),Nx=Math.pow(2,28),Fx=Math.pow(2,35),Ux=Math.pow(2,42),Ox=Math.pow(2,49),Bx=Math.pow(2,56),zx=Math.pow(2,63),Vx=function(n){
return n<kx?1:n<Lx?2:n<Rx?3:n<Nx?4:n<Fx?5:n<Ux?6:n<Ox?7:n<Bx?8:n<zx?9:10},qx={encode:Mx,decode:Dx,encodingLength:Vx},La=qx;
function Fu(n,e=0){const t=La.decode(n,e),r=La.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function Ra(n,e,t=0){return La.
encode(n,e,t),e}function Na(n){return La.encodingLength(n)}function Mc(n,e){const t=e.byteLength,r=Na(n),s=r+Na(t),i=new Uint8Array(
s+t);return Ra(n,i,0),Ra(t,i,r),i.set(e,s),new td(n,t,e,i)}function fy(n){const e=ys(n),[t,r]=Fu(e),[s,i]=Fu(e.subarray(
r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new td(t,s,o,e)}function Wx(n,e){if(n===
e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&tx(n.bytes,t.bytes)}}let td=class{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Di(r),this.bytes=Di(s)}};function Nf(n,e){const{bytes:t,version:r}=n;switch(r){case 0:
return Gx(t,Uu(n),e??ut.encoder);default:return Hx(t,Uu(n),e??ai.encoder)}}const Ff=new WeakMap;function Uu(n){const e=Ff.
get(n);if(e==null){const t=new Map;return Ff.set(n,t),t}return e}let Pc=class Ce{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Di(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==ks)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==jx)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return Ce.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=Mc(e,t);return Ce.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return Ce.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&Wx(e.multihash,r.multihash)}toString(e){return Nf(this,e)}toJSON(){return{
"/":Nf(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ce)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new Ce(r,s,i,o??Uf(r,s,i.bytes))}else if(t[Xx]===!0){const{
version:r,multihash:s,code:i}=t,o=fy(s);return Ce.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==ks)throw new Error(`Version 0 CID must use dag-pb (code: ${ks}) block encoding`);return new Ce(
e,t,r,r.bytes)}case 1:{const s=Uf(e,t,r.bytes);return new Ce(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return Ce.create(0,ks,e)}static createV1(e,t){return Ce.create(1,e,t)}static decode(e){const[t,r]=Ce.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ce.inspectBytes(e),r=t.size-t.multihashSize,
s=ys(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new td(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ce.createV0(o):Ce.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,d]=Fu(e.subarray(t));return t+=d,h};let s=r(),
i=ks;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=Kx(e,t),
i=Ce.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Uu(
i).set(r,e),i}};function Kx(n,e){switch(n[0]){case"Q":{const t=e??ut;return[ut.prefix,t.decode(`${ut.prefix}${n}`)]}case ut.
prefix:{const t=e??ut;return[ut.prefix,t.decode(n)]}case ai.prefix:{const t=e??ai;return[ai.prefix,t.decode(n)]}case la.
prefix:{const t=e??la;return[la.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function Gx(n,e,t){const{prefix:r}=t;if(r!==
ut.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function Hx(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const ks=112,jx=18;function Uf(n,e,t){const r=Na(n),s=r+Na(e),i=new Uint8Array(s+t.
byteLength);return Ra(n,i,0),Ra(e,i,r),i.set(t,s),i}const Xx=Symbol.for("@ipld/js-cid/CID"),py=0,Qx="identity",gy=ys;function Yx(n,e){
if(e?.truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Mc(py,gy(n))}const nd={code:py,
name:Qx,encode:gy,digest:Yx};function Jx(n){return n.buffer instanceof ArrayBuffer}function Er(n){return Jx(n)?n:n.slice()}
async function Zx(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,Er(e),Er(
t.subarray()));return r?.signal?.throwIfAborted(),i}function tt(n=0){return new Uint8Array(n)}function Bn(n=0){return new Uint8Array(
n)}function eI(n){return n?.buffer instanceof ArrayBuffer}function tI(n){if(eI(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Of(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=Bn(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return tI(t)}const my=Symbol.for("@achingbrain/uint8arraylist");function Bf(n,e){if(e==null||e<0)
throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-
t};t=s}throw new RangeError("index is out of bounds")}function wo(n){return!!n?.[my]}let Ot=class ua{bufs;length;[my]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(wo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(wo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=Bf(this.bufs,e);return t.buf[t.index]}set(e,t){const r=Bf(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(wo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Of(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:Of(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ua;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!wo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=Bn(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=tt(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=tt(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=tt(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=Bn(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=tt(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=tt(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=tt(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=tt(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=tt(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ua)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!Ms(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ua;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const nI=Zi({prefix:"9",name:"\
base10",alphabet:"0123456789"}),rI=Object.freeze(Object.defineProperty({__proto__:null,base10:nI},Symbol.toStringTag,{value:"\
Module"})),sI=be({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),iI=be({prefix:"\
F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),oI=Object.freeze(Object.defineProperty(
{__proto__:null,base16:sI,base16upper:iI},Symbol.toStringTag,{value:"Module"})),aI=be({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),cI=Object.freeze(Object.defineProperty({__proto__:null,base2:aI},Symbol.toStringTag,{value:"Module"})),
by=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),lI=by.reduce((n,e,t)=>(n[t]=e,n),[]),uI=by.reduce((n,e,t)=>{const r=e.codePointAt(
0);if(r==null)throw new Error(`Invalid character: ${e}`);return n[r]=t,n},[]);function hI(n){return n.reduce((e,t)=>(e+=
lI[t],e),"")}function dI(n){const e=[];for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=uI[r];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const fI=Ic({prefix:"🚀",name:"base256emoji",encode:hI,decode:dI}),pI=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:fI},Symbol.toStringTag,{value:"Module"})),gI=be({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),mI=be({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOP\
QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),bI=be({prefix:"u",name:"base64url",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),yI=be({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),wI=Object.freeze(Object.defineProperty(
{__proto__:null,base64:gI,base64pad:mI,base64url:bI,base64urlpad:yI},Symbol.toStringTag,{value:"Module"})),vI=be({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),SI=Object.freeze(Object.defineProperty({__proto__:null,base8:vI},Symbol.
toStringTag,{value:"Module"})),AI=Ic({prefix:"\0",name:"identity",encode:n=>rx(ys(n)),decode:n=>ys(nx(n))}),_I=Object.freeze(
Object.defineProperty({__proto__:null,identity:AI},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const EI=20;function CI({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new xI(n,e,t,r,s)}let xI=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??EI,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
zf(r,this.code,t?.truncate):r.then(s=>zf(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function zf(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return Mc(e,n)}function II(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const MI=CI({name:"sha2-256",code:18,encode:II("SHA-256")}),Vf={..._I,...cI,...SI,...rI,...oI,...Cx,
...Ix,...mx,...wI,...pI};function yy(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const qf=yy("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),il=yy("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Bn(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),wy={utf8:qf,"utf-8":qf,hex:Vf.base16,latin1:il,ascii:il,
binary:il,...Vf};function ws(n,e="utf8"){const t=wy[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function vn(n,e="utf8"){const t=wy[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const PI=parseInt("11111",2),Ou=parseInt("10000000",2),TI=parseInt("01\
111111",2),Wf={0:Ls,1:Ls,2:DI,3:LI,4:RI,5:kI,6:$I,16:Ls,22:Ls,48:Ls};function Tc(n,e={offset:0}){const t=n[e.offset]&PI;
if(e.offset++,Wf[t]!=null)return Wf[t](n,e);throw new Error("No decoder for tag "+t)}function eo(n,e){let t=0;if((n[e.offset]&
Ou)===Ou){const r=n[e.offset]&TI;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)throw new Error(
"invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}function Ls(n,e){
eo(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=Tc(n,e);if(r===null)break;t.push(r)}return t}function DI(n,e){
const t=eo(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.offset+=t,Uint8Array.
from(i)}function $I(n,e){const t=eo(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function kI(n,e){return e.offset++,null}function LI(n,e){
const t=eo(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=t,r!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function RI(n,e){const t=eo(n,e),r=n.subarray(e.offset,e.offset+t);
return e.offset+=t,r}function NI(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new Ot;for(let r=0;r<e.length;r+=
2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function rd(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=NI(n.byteLength);return new Ot(Uint8Array.from([e.byteLength|Ou]),e)}function Bu(n){const e=new Ot,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new Ot(Uint8Array.from([2]),rd(e),e)}function vy(n){
const e=Uint8Array.from([0]),t=new Ot(e,n);return new Ot(Uint8Array.from([3]),rd(t),t)}function ci(n,e=48){const t=new Ot;
for(const r of n)t.append(r);return new Ot(Uint8Array.from([e]),rd(t),t)}const FI=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),UI=Uint8Array.from([6,5,43,129,4,0,34]),OI=Uint8Array.from([6,5,43,129,4,0,35]),BI={ext:!0,kty:"EC",crv:"P-256"},
zI={ext:!0,kty:"EC",crv:"P-384"},VI={ext:!0,kty:"EC",crv:"P-521"},ol=32,al=48,cl=66;function qI(n){const e=Tc(n);return WI(
e)}function WI(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===ol*2+1)return r=vn(e.subarray(t,t+ol),"base64url"),s=
vn(e.subarray(t+ol),"base64url"),new ll({...BI,key_ops:["verify"],x:r,y:s});if(e.byteLength===al*2+1)return r=vn(e.subarray(
t,t+al),"base64url"),s=vn(e.subarray(t+al),"base64url"),new ll({...zI,key_ops:["verify"],x:r,y:s});if(e.byteLength===cl*
2+1)return r=vn(e.subarray(t,t+cl),"base64url"),s=vn(e.subarray(t+cl),"base64url"),new ll({...VI,key_ops:["verify"],x:r,
y:s});throw new L(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function KI(n){return ci(
[Bu(Uint8Array.from([1])),ci([GI(n.crv)],160),ci([vy(new Ot(Uint8Array.from([4]),ws(n.x??"","base64url"),ws(n.y??"","bas\
e64url")))],161)]).subarray()}function GI(n){if(n==="P-256")return FI;if(n==="P-384")return UI;if(n==="P-521")return OI;
throw new L(`Invalid curve ${n}`)}let ll=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=KI(this.jwk)),this._raw}toMultihash(){return nd.digest(Dc(this))}toCID(){return Pc.createV1(114,this.toMultihash())}toString(){
return ut.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ms(this.
raw,e.raw)}async verify(e,t,r){return Zx(this.jwk,t,e,r)}},Kf=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},HI=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const $i={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new HI(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},Sy=32;let ul;const jI=(async()=>{try{return await $i.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function XI(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await $i.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await $i.get().subtle.verify(
{name:"Ed25519"},r,Er(e),Er(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function QI(n,e,t){return vr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function YI(n,e,t){
return ul==null&&(ul=await jI),ul?XI(n,e,t):QI(n,e,t)}function Ay(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}let JI=class{type="Ed25519";raw;constructor(e){this.raw=_y(e,Sy)}toMultihash(){
return nd.digest(Dc(this))}toCID(){return Pc.createV1(114,this.toMultihash())}toString(){return ut.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ms(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=YI(this.raw,t,e);return Ay(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}};function ZI(n){return n=
_y(n,Sy),new JI(n)}function _y(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new L(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}const eM=Math.pow(2,7),tM=Math.pow(2,14),nM=Math.pow(2,21),Ey=Math.pow(2,28),Cy=Math.
pow(2,35),xy=Math.pow(2,42),Iy=Math.pow(2,49),ce=128,ln=127;function to(n){if(n<eM)return 1;if(n<tM)return 2;if(n<nM)return 3;
if(n<Ey)return 4;if(n<Cy)return 5;if(n<xy)return 6;if(n<Iy)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function My(n,e,t=0){switch(to(n)){case 8:e[t++]=n&255|ce,n/=128;case 7:
e[t++]=n&255|ce,n/=128;case 6:e[t++]=n&255|ce,n/=128;case 5:e[t++]=n&255|ce,n/=128;case 4:e[t++]=n&255|ce,n>>>=7;case 3:
e[t++]=n&255|ce,n>>>=7;case 2:e[t++]=n&255|ce,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function rM(n,e,t=0){switch(to(n)){case 8:e.set(t++,n&255|ce),n/=128;case 7:e.set(t++,n&255|ce),n/=128;case 6:
e.set(t++,n&255|ce),n/=128;case 5:e.set(t++,n&255|ce),n/=128;case 4:e.set(t++,n&255|ce),n>>>=7;case 3:e.set(t++,n&255|ce),
n>>>=7;case 2:e.set(t++,n&255|ce),n>>>=7;case 1:{e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}
function sM(n,e){let t=n[e],r=0;if(r+=t&ln,t<ce||(t=n[e+1],r+=(t&ln)<<7,t<ce)||(t=n[e+2],r+=(t&ln)<<14,t<ce)||(t=n[e+3],
r+=(t&ln)<<21,t<ce)||(t=n[e+4],r+=(t&ln)*Ey,t<ce)||(t=n[e+5],r+=(t&ln)*Cy,t<ce)||(t=n[e+6],r+=(t&ln)*xy,t<ce)||(t=n[e+7],
r+=(t&ln)*Iy,t<ce))return r;throw new RangeError("Could not decode varint")}function hl(n,e,t=0){return e==null&&(e=Bn(to(
n))),e instanceof Uint8Array?My(n,e,t):rM(n,e,t)}const sd=new Float32Array([-0]),xn=new Uint8Array(sd.buffer);function iM(n,e,t){
sd[0]=n,e[t]=xn[0],e[t+1]=xn[1],e[t+2]=xn[2],e[t+3]=xn[3]}function oM(n,e){return xn[0]=n[e],xn[1]=n[e+1],xn[2]=n[e+2],xn[3]=
n[e+3],sd[0]}const id=new Float64Array([-0]),Me=new Uint8Array(id.buffer);function aM(n,e,t){id[0]=n,e[t]=Me[0],e[t+1]=Me[1],
e[t+2]=Me[2],e[t+3]=Me[3],e[t+4]=Me[4],e[t+5]=Me[5],e[t+6]=Me[6],e[t+7]=Me[7]}function cM(n,e){return Me[0]=n[e],Me[1]=n[e+
1],Me[2]=n[e+2],Me[3]=n[e+3],Me[4]=n[e+4],Me[5]=n[e+5],Me[6]=n[e+6],Me[7]=n[e+7],id[0]}const lM=BigInt(Number.MAX_SAFE_INTEGER),
uM=BigInt(Number.MIN_SAFE_INTEGER);let Kt=class Gn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&
this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.
hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+
1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;
return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===
0n)return ur;if(e<lM&&e>uM)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>Gf&&(s=0n,++r>Gf&&(r=0n))),new Gn(Number(s),Number(r))}static fromNumber(e){if(e===0)return ur;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new Gn(r,s)}static from(e){return typeof e=="number"?Gn.fromNumber(e):typeof e=="bigint"?Gn.fromBigInt(e):typeof e=="str\
ing"?Gn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Gn(e.low>>>0,e.high>>>0):ur}};const ur=new Kt(0,0);ur.toBigInt=
function(){return 0n};ur.zzEncode=ur.zzDecode=function(){return this};ur.length=function(){return 1};const Gf=4294967296n;
function hM(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function dM(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Py(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function vt(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function vo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let fM=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Er(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,vt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw vt(this,4);return vo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw vt(
this,4);return vo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw vt(this,4);const e=oM(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw vt(this,4);const e=cM(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw vt(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return dM(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw vt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw vt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Kt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw vt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw vt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw vt(this,8);const e=vo(this.buf,this.pos+=4),t=vo(this.buf,this.pos+=4);return new Kt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=sM(this.buf,this.pos);
return this.pos+=to(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function Ty(n){return new fM(n instanceof Uint8Array?
n:n.subarray())}function ki(n,e,t){const r=Ty(n);return e.decode(r,void 0,t)}function pM(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Bn(o);s+o>8192&&(r=Bn(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let js=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function dl(){}let gM=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const mM=pM();function bM(n){return globalThis.Buffer!=null?
Bn(n):mM(n)}let zu=class{len;head;tail;states;constructor(){this.len=0,this.head=new js(dl,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new js(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new wM((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
So,10,Kt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Kt.fromBigInt(e);
return this._push(So,t.length(),t)}uint64Number(e){return this._push(My,to(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Kt.fromBigInt(e).zzEncode();return this._push(So,t.length(),t)}sint64Number(e){const t=Kt.fromNumber(e).zzEncode();
return this._push(So,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(fl,1,e?1:0)}fixed32(e){
return this._push(Rs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Kt.fromBigInt(e);return this._push(Rs,
4,t.lo)._push(Rs,4,t.hi)}fixed64Number(e){const t=Kt.fromNumber(e);return this._push(Rs,4,t.lo)._push(Rs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(iM,4,e)}double(e){return this._push(aM,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(fl,1,0):this.uint32(t)._push(vM,t,e)}string(e){const t=hM(e);return t!==0?this.uint32(t)._push(
Py,t,e):this._push(fl,1,0)}fork(){return this.states=new gM(this),this.head=this.tail=new js(dl,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new js(dl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=bM(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function fl(n,e,t){e[t]=n&255}function yM(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let wM=class extends js{next;constructor(e,t){super(yM,e,t),this.next=void 0}};
function So(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Rs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function vM(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(zu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(SM,e,n),this},zu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(AM,e,n),this});function SM(n,e,t){e.set(n,t)}function AM(n,e,t){n.length<40?Py(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(ws(n),t)}function _M(){return new zu}function Li(n,e){const t=_M();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*Ri(n,e,t){const r=Ty(n);yield*e.stream(r,void 0,".",t)}const Dy={VARINT:0,LENGTH_DELIMITED:2};function $y(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function EM(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return $y("enum",Dy.VARINT,t,r,s)}function Ni(n,e,t){return $y("message",Dy.LENGTH_DELIMITED,n,e,
t)}let Hf=class extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"};var Ne;(function(n){n.RSA="RSA",n.Ed25519="Ed\
25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Ne||(Ne={}));var Vu;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed255\
19",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(Vu||(Vu={}));(function(n){n.codec=()=>EM(Vu)})(Ne||(Ne={}));var Fi;
(function(n){let e;n.codec=()=>(e==null&&(e=Ni((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),
Ne.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{
const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ne.codec().decode(i);break}case 2:{
c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ne.codec().decode(i)};break}case 2:{yield{
field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Li(i,n.codec())}n.
encode=t;function r(i,o){return ki(i,n.codec(),o)}n.decode=r;function s(i,o){return Ri(i,n.codec(),o)}n.stream=s})(Fi||(Fi=
{}));var jf;(function(n){let e;n.codec=()=>(e==null&&(e=Ni((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.
uint32(8),Ne.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ne.codec().
decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ne.codec().decode(
i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Li(
i,n.codec())}n.encode=t;function r(i,o){return ki(i,n.codec(),o)}n.decode=r;function s(i,o){return Ri(i,n.codec(),o)}n.stream=
s})(jf||(jf={}));let CM=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this.
_raw==null&&(this._raw=TM(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return Pc.createV1(114,this.
_multihash)}toString(){return ut.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:Ms(this.raw,e.raw)}verify(e,t,r){return kM(this.jwk,t,e,r)}};const xM=18,IM=1062,MM=Uint8Array.from([48,13,
6,9,42,134,72,134,247,13,1,1,1,5,0]);function PM(n){const e=Tc(n[1],{offset:0});return{kty:"RSA",n:vn(e[0],"base64url"),
e:vn(e[1],"base64url")}}function TM(n){if(n.n==null||n.e==null)throw new L("JWK was missing components");return ci([MM,vy(
ci([Bu(ws(n.n,"base64url")),Bu(ws(n.e,"base64url"))]))]).subarray()}function DM(n,e){if(n.byteLength>=IM)throw new Dt("K\
ey size is too large");const t=Tc(n,{offset:0});return $M(t,n,e)}function $M(n,e,t){const r=PM(n);if(t==null){const s=or(
Fi.encode({Type:Ne.RSA,Data:e}));t=Mc(xM,s)}return new CM(r,t)}async function kM(n,e,t,r){const s=await $i.get().subtle.
importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await $i.
get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Er(e),Er(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),
i}function LM(n,e,t,r){const s=MI.digest(t instanceof Uint8Array?t:t.subarray());if(Ay(s))return s.then(({digest:i})=>(r?.
signal?.throwIfAborted(),Oe.verify(e,i,n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new Kf(String(
i))});try{return r?.signal?.throwIfAborted(),Oe.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new Kf(String(
i))}}let RM=class{type="secp256k1";raw;_key;constructor(e){this._key=UM(e),this.raw=FM(this._key)}toMultihash(){return nd.
digest(Dc(this))}toCID(){return Pc.createV1(114,this.toMultihash())}toString(){return ut.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ms(this.raw,e.raw)}verify(e,t,r){return LM(this.
_key,t,e,r)}};function NM(n){return new RM(n)}function FM(n){return Oe.Point.fromBytes(n).toBytes()}function UM(n){try{return Oe.
Point.fromBytes(n),n}catch(e){throw new Dt(String(e))}}function OM(n,e){const{Type:t,Data:r}=Fi.decode(n),s=r??new Uint8Array;
switch(t){case Ne.RSA:return DM(s,e);case Ne.Ed25519:return ZI(s);case Ne.secp256k1:return NM(s);case Ne.ECDSA:return qI(
s);default:throw new pc}}function Dc(n){return Fi.encode({Type:Ne[n.type],Data:n.raw})}var Fa;(function(n){let e;n.codec=
()=>(e==null&&(e=Ni((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.publicKey!=null&&i.publicKey.byteLength>0&&(o.uint32(
10),o.bytes(i.publicKey)),i.payloadType!=null&&i.payloadType.byteLength>0&&(o.uint32(18),o.bytes(i.payloadType)),i.payload!=
null&&i.payload.byteLength>0&&(o.uint32(26),o.bytes(i.payload)),i.signature!=null&&i.signature.byteLength>0&&(o.uint32(42),
o.bytes(i.signature)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={publicKey:tt(0),payloadType:tt(0),payload:tt(
0),signature:tt(0)},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.publicKey=i.bytes();
break}case 2:{c.payloadType=i.bytes();break}case 3:{c.payload=i.bytes();break}case 5:{c.signature=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{yield{field:`${a}.payloadType`,value:i.
bytes()};break}case 3:{yield{field:`${a}.payload`,value:i.bytes()};break}case 5:{yield{field:`${a}.signature`,value:i.bytes()};
break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Li(i,n.codec())}n.encode=t;function r(i,o){return ki(
i,n.codec(),o)}n.decode=r;function s(i,o){return Ri(i,n.codec(),o)}n.stream=s})(Fa||(Fa={}));class BM extends Error{constructor(e="\
Invalid signature"){super(e),this.name="InvalidSignatureError"}}class Qt{static createFromProtobuf=e=>{const t=Fa.decode(
e),r=OM(t.publicKey);return new Qt({publicKey:r,payloadType:t.payloadType,payload:t.payload,signature:t.signature})};static seal=async(e,t,r)=>{
if(t==null)throw new Error("Missing private key");const s=e.domain,i=e.codec,o=e.marshal(),a=Xf(s,i,o),c=await t.sign(a.
subarray(),r);return new Qt({publicKey:t.publicKey,payloadType:i,payload:o,signature:c})};static openAndCertify=async(e,t,r)=>{
const s=Qt.createFromProtobuf(e);if(!await s.validate(t,r))throw new BM("Envelope signature is not valid for the given d\
omain");return s};publicKey;payloadType;payload;signature;marshaled;constructor(e){const{publicKey:t,payloadType:r,payload:s,
signature:i}=e;this.publicKey=t,this.payloadType=r,this.payload=s,this.signature=i}marshal(){return this.marshaled==null&&
(this.marshaled=Fa.encode({publicKey:Dc(this.publicKey),payloadType:this.payloadType,payload:this.payload.subarray(),signature:this.
signature})),this.marshaled}equals(e){return e==null?!1:Ms(this.marshal(),e.marshal())}async validate(e,t){const r=Xf(e,
this.payloadType,this.payload);return this.publicKey.verify(r.subarray(),this.signature,t)}}const Xf=(n,e,t)=>{const r=ws(
n),s=hl(r.byteLength),i=hl(e.length),o=hl(t.length);return new Ot(s,r,i,e,o,t)},zM="libp2p-peer-record",VM=Uint8Array.from(
[3,1]);var Ua;(function(n){(function(i){let o;i.codec=()=>(o==null&&(o=Ni((u,h,d={})=>{d.lengthDelimited!==!1&&h.fork(),
u.multiaddr!=null&&u.multiaddr.byteLength>0&&(h.uint32(10),h.bytes(u.multiaddr)),d.lengthDelimited!==!1&&h.ldelim()},(u,h,d={})=>{
const p={multiaddr:tt(0)},v=h==null?u.len:u.pos+h;for(;u.pos<v;){const g=u.uint32();switch(g>>>3){case 1:{p.multiaddr=u.
bytes();break}default:{u.skipType(g&7);break}}}return p},function*(u,h,d,p={}){const v=h==null?u.len:u.pos+h;for(;u.pos<
v;){const g=u.uint32();switch(g>>>3){case 1:{yield{field:`${d}.multiaddr`,value:u.bytes()};break}default:{u.skipType(g&7);
break}}}})),o);function a(u){return Li(u,i.codec())}i.encode=a;function c(u,h){return ki(u,i.codec(),h)}i.decode=c;function l(u,h){
return Ri(u,i.codec(),h)}i.stream=l})(n.AddressInfo||(n.AddressInfo={}));let e;n.codec=()=>(e==null&&(e=Ni((i,o,a={})=>{
if(a.lengthDelimited!==!1&&o.fork(),i.peerId!=null&&i.peerId.byteLength>0&&(o.uint32(10),o.bytes(i.peerId)),i.seq!=null&&
i.seq!==0n&&(o.uint32(16),o.uint64(i.seq)),i.addresses!=null&&i.addresses.length>0)for(const c of i.addresses)o.uint32(26),
n.AddressInfo.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={peerId:tt(0),seq:0n,addresses:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.peerId=i.bytes();break}case 2:{c.seq=i.
uint64();break}case 3:{if(a.limits?.addresses!=null&&c.addresses.length===a.limits.addresses)throw new Hf('Decode error \
- repeated field "addresses" had too many elements');c.addresses.push(n.AddressInfo.codec().decode(i,i.uint32(),{limits:a.
limits?.addresses$}));break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addresses:0},u=o==
null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.peerId`,value:i.bytes()};break}case 2:{
yield{field:`${a}.seq`,value:i.uint64()};break}case 3:{if(c.limits?.addresses!=null&&l.addresses===c.limits.addresses)throw new Hf(
'Streaming decode error - repeated field "addresses" had too many elements');for(const d of n.AddressInfo.codec().stream(
i,i.uint32(),`${a}.addresses[]`,{limits:c.limits?.addresses$}))yield{...d,index:l.addresses};l.addresses++;break}default:{
i.skipType(h&7);break}}}})),e);function t(i){return Li(i,n.codec())}n.encode=t;function r(i,o){return ki(i,n.codec(),o)}
n.decode=r;function s(i,o){return Ri(i,n.codec(),o)}n.stream=s})(Ua||(Ua={}));function qM(n,e){const t=(r,s)=>r.toString().
localeCompare(s.toString());return n.length!==e.length?!1:(e.sort(t),n.sort(t).every((r,s)=>e[s].equals(r)))}class bt{static createFromProtobuf=e=>{
const t=Ua.decode(e),r=Tr(fy(t.peerId)),s=(t.addresses??[]).map(o=>O(o.multiaddr)),i=t.seq;return new bt({peerId:r,multiaddrs:s,
seqNumber:i})};static DOMAIN=zM;static CODEC=VM;peerId;multiaddrs;seqNumber;domain=bt.DOMAIN;codec=bt.CODEC;marshaled;constructor(e){
const{peerId:t,multiaddrs:r,seqNumber:s}=e;this.peerId=t,this.multiaddrs=r??[],this.seqNumber=s??BigInt(Date.now())}marshal(){
return this.marshaled==null&&(this.marshaled=Ua.encode({peerId:this.peerId.toMultihash().bytes,seq:BigInt(this.seqNumber),
addresses:this.multiaddrs.map(e=>({multiaddr:e.bytes}))})),this.marshaled}equals(e){return!(!(e instanceof bt)||!this.peerId.
equals(e.peerId)||this.seqNumber!==e.seqNumber||!qM(this.multiaddrs,e.multiaddrs))}}let vs=class extends Error{static name="\
AbortError";name="AbortError";constructor(e="The operation was aborted",...t){super(e,...t)}};async function pl(n,e,t,r){
const s=new vs(r?.errorMessage);r?.errorCode!=null&&(s.code=r.errorCode);const i=r?.errorEvent??"error";return t?.aborted===
!0?Promise.reject(s):new Promise((o,a)=>{function c(){ml(t,"abort",h),ml(n,e,l),ml(n,i,u)}const l=d=>{try{if(r?.filter?.(
d)===!1)return}catch(p){c(),a(p);return}c(),o(d)},u=d=>{if(c(),d instanceof Error){a(d);return}a(d.detail??r?.error??new Error(
`The "${r?.errorEvent}" event was emitted but the event had no '.detail' field. Pass an 'error' option to race-event to \
change this message.`))},h=()=>{c(),a(s)};gl(t,"abort",h),gl(n,e,l),gl(n,i,u)})}function gl(n,e,t){n!=null&&(ky(n)?n.addEventListener(
e,t):n.addListener(e,t))}function ml(n,e,t){n!=null&&(ky(n)?n.removeEventListener(e,t):n.removeListener(e,t))}function ky(n){
return typeof n.addEventListener=="function"&&typeof n.removeEventListener=="function"}class WM extends Error{static name="\
QueueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class KM{deferred;signal;constructor(e){
this.signal=e,this.deferred=Promise.withResolvers(),this.onAbort=this.onAbort.bind(this),this.signal?.addEventListener("\
abort",this.onAbort)}onAbort(){this.deferred.reject(this.signal?.reason??new vs)}cleanup(){this.signal?.removeEventListener(
"abort",this.onAbort)}}function GM(){return`${parseInt(String(Math.random()*1e9),10).toString()}${Date.now()}`}class HM{id;fn;options;recipients;status;timeline;controller;constructor(e,t){
this.id=GM(),this.status="queued",this.fn=e,this.options=t,this.recipients=[],this.timeline={created:Date.now()},this.controller=
new AbortController,this.controller.signal,this.onAbort=this.onAbort.bind(this)}abort(e){this.controller.abort(e)}onAbort(){
this.recipients.reduce((t,r)=>t&&r.signal?.aborted===!0,!0)&&(this.controller.abort(new vs),this.cleanup())}async join(e={}){
const t=new KM(e.signal);return this.recipients.push(t),e.signal?.addEventListener("abort",this.onAbort),t.deferred.promise}async run(){
this.status="running",this.timeline.started=Date.now();try{this.controller.signal.throwIfAborted();const e=await kt(this.
fn({...this.options??{},signal:this.controller.signal}),this.controller.signal);this.recipients.forEach(t=>{t.deferred.resolve(
e)}),this.status="complete"}catch(e){this.recipients.forEach(t=>{t.deferred.reject(e)}),this.status="errored"}finally{this.
timeline.finished=Date.now(),this.cleanup()}}cleanup(){this.recipients.forEach(e=>{e.cleanup(),e.signal?.removeEventListener(
"abort",this.onAbort)})}}function Qf(n,e){let t;const r=function(){const s=function(){t=void 0,n()};clearTimeout(t),t=setTimeout(
s,e)};return r.start=()=>{},r.stop=()=>{clearTimeout(t)},r}class Yf extends he{concurrency;maxSize;queue;pending;sort;autoStart;constructor(e={}){
super(),this.concurrency=e.concurrency??Number.POSITIVE_INFINITY,this.maxSize=e.maxSize??Number.POSITIVE_INFINITY,this.pending=
0,this.autoStart=e.autoStart??!0,this.sort=e.sort,this.queue=[],this.emitEmpty=Qf(this.emitEmpty.bind(this),1),this.emitIdle=
Qf(this.emitIdle.bind(this),1)}[Symbol.asyncIterator](){return this.toGenerator()}emitEmpty(){this.size===0&&this.safeDispatchEvent(
"empty")}emitIdle(){this.running===0&&this.safeDispatchEvent("idle")}tryToStartAnother(){if(this.size===0)return this.emitEmpty(),
this.running===0&&this.emitIdle(),!1;if(this.pending<this.concurrency){let e;for(const t of this.queue)if(t.status==="qu\
eued"){e=t;break}return e==null?!1:(this.safeDispatchEvent("active"),this.pending++,e.run().finally(()=>{for(let t=0;t<this.
queue.length;t++)if(this.queue[t]===e){this.queue.splice(t,1);break}this.pending--,this.safeDispatchEvent("next"),this.autoStart&&
this.tryToStartAnother()}),!0)}return!1}enqueue(e){this.queue.push(e),this.sort!=null&&this.queue.sort(this.sort)}start(){
this.autoStart===!1&&(this.autoStart=!0,this.tryToStartAnother())}pause(){this.autoStart=!1}async add(e,t){if(t?.signal?.
throwIfAborted(),this.size===this.maxSize)throw new WM;const r=new HM(e,t);return this.enqueue(r),this.safeDispatchEvent(
"add"),this.autoStart&&this.tryToStartAnother(),r.join(t).then(s=>(this.safeDispatchEvent("success",{detail:{job:r,result:s}}),
s)).catch(s=>{if(r.status==="queued"){for(let i=0;i<this.queue.length;i++)if(this.queue[i]===r){this.queue.splice(i,1);break}}
throw this.safeDispatchEvent("failure",{detail:{job:r,error:s}}),s})}clear(){this.queue.splice(0,this.queue.length)}abort(){
this.queue.forEach(e=>{e.abort(new vs)}),this.clear()}async onEmpty(e){this.size!==0&&await pl(this,"empty",e?.signal)}async onSizeLessThan(e,t){
this.size<e||await pl(this,"next",t?.signal,{filter:()=>this.size<e})}async onIdle(e){this.pending===0&&this.size===0||await pl(
this,"idle",e?.signal)}get size(){return this.queue.length}get queued(){return this.queue.length-this.pending}get running(){
return this.pending}async*toGenerator(e){e?.signal?.throwIfAborted();const t=ls({objectMode:!0}),r=c=>{c!=null?this.abort():
this.clear(),t.end(c)},s=c=>{c.detail!=null&&t.push(c.detail.result)},i=c=>{r(c.detail.error)},o=()=>{r()},a=()=>{r(new vs(
"Queue aborted"))};this.addEventListener("success",s),this.addEventListener("failure",i),this.addEventListener("idle",o),
e?.signal?.addEventListener("abort",a);try{yield*t}finally{this.removeEventListener("success",s),this.removeEventListener(
"failure",i),this.removeEventListener("idle",o),e?.signal?.removeEventListener("abort",a),r()}}}const Ly="lock:worker:re\
quest-read",Ry="lock:worker:abort-read-request",Ny="lock:worker:release-read",Fy="lock:master:grant-read",Uy="lock:maste\
r:error-read",Oy="lock:worker:request-write",By="lock:worker:abort-write-request",zy="lock:worker:release-write",Vy="loc\
k:master:grant-write",qy="lock:master:error-write",Wy="lock:worker:finalize",Ky="mortice",jM={singleProcess:!1},Jf=(n,e,t,r,s,i,o,a,c)=>l=>{
if(l.data==null)return;const u={type:l.data.type,name:l.data.name,identifier:l.data.identifier};u.type===s&&n.safeDispatchEvent(
t,{detail:{name:u.name,identifier:u.identifier,handler:async()=>{e.postMessage({type:c,name:u.name,identifier:u.identifier}),
await new Promise(h=>{const d=p=>{if(p?.data==null)return;const v={type:p.data.type,name:p.data.name,identifier:p.data.identifier};
v.type===a&&v.identifier===u.identifier&&(e.removeEventListener("message",d),h())};e.addEventListener("message",d)})},onError:h=>{
e.postMessage({type:o,name:u.name,identifier:u.identifier,error:{message:h.message,name:h.name,stack:h.stack}})}}}),u.type===
i&&n.safeDispatchEvent(r,{detail:{name:u.name,identifier:u.identifier}}),u.type===Wy&&n.safeDispatchEvent("finalizeReque\
st",{detail:{name:u.name}})},XM=(n=10)=>Math.random().toString().substring(2,n+2);class QM{name;channel;constructor(e){this.
name=e,this.channel=new BroadcastChannel(Ky)}readLock(e){return this.sendRequest(Ly,Ry,Fy,Uy,Ny,e)}writeLock(e){return this.
sendRequest(Oy,By,Vy,qy,zy,e)}finalize(){this.channel.postMessage({type:Wy,name:this.name}),this.channel.close()}async sendRequest(e,t,r,s,i,o){
o?.signal?.throwIfAborted();const a=XM();return this.channel.postMessage({type:e,identifier:a,name:this.name}),new Promise(
(c,l)=>{const u=()=>{this.channel.postMessage({type:t,identifier:a,name:this.name})};o?.signal?.addEventListener("abort",
u,{once:!0});const h=d=>{if(d.data?.identifier===a&&(d.data?.type===r&&(this.channel.removeEventListener("message",h),o?.
signal?.removeEventListener("abort",u),c(()=>{this.channel.postMessage({type:i,identifier:a,name:this.name})})),d.data.type===
s)){this.channel.removeEventListener("message",h),o?.signal?.removeEventListener("abort",u);const p=new Error;d.data.error!=
null&&(p.message=d.data.error.message,p.name=d.data.error.name,p.stack=d.data.error.stack),l(p)}};this.channel.addEventListener(
"message",h)})}}const YM=n=>{if(n=Object.assign({},jM,n),!!globalThis.document||n.singleProcess){const t=new BroadcastChannel(
Ky),r=new he;return t.addEventListener("message",Jf(r,t,"requestReadLock","abortReadLockRequest",Ly,Ry,Uy,Ny,Fy)),t.addEventListener(
"message",Jf(r,t,"requestWriteLock","abortWriteLockRequest",Oy,By,qy,zy,Vy)),r}return new QM(n.name)},tr=new Map;let Ns;
function Gy(n){return typeof n?.readLock=="function"&&typeof n?.writeLock=="function"}function JM(n){if(Ns==null&&(Ns=YM(
n),!Gy(Ns))){const e=Ns;e.addEventListener("requestReadLock",t=>{const r=t.detail.name,s=t.detail.identifier,i=tr.get(r);
if(i==null)return;const o=new AbortController,a=c=>{c.detail.name!==r||c.detail.identifier!==s||o.abort()};e.addEventListener(
"abortReadLockRequest",a),i.readLock({signal:o.signal}).then(async c=>{await t.detail.handler().finally(()=>{c()})}).catch(
c=>{t.detail.onError(c)}).finally(()=>{e.removeEventListener("abortReadLockRequest",a)})}),e.addEventListener("requestWr\
iteLock",t=>{const r=t.detail.name,s=t.detail.identifier,i=tr.get(r);if(i==null)return;const o=new AbortController,a=c=>{
c.detail.name!==r||c.detail.identifier!==s||o.abort()};e.addEventListener("abortWriteLockRequest",a),i.writeLock({signal:o.
signal}).then(async c=>{await t.detail.handler().finally(()=>{c()})}).catch(c=>{t.detail.onError(c)}).finally(()=>{e.removeEventListener(
"abortWriteLockRequest",a)})}),e.addEventListener("finalizeRequest",t=>{const r=t.detail.name,s=tr.get(r);s?.finalize()})}
return Ns}async function bl(n,e){let t,r;const s=new Promise((o,a)=>{t=o,r=a}),i=()=>{r(new vs)};return e?.signal?.addEventListener(
"abort",i,{once:!0}),n.add(async()=>{await new Promise(o=>{t(()=>{e?.signal?.removeEventListener("abort",i),o()})})},{signal:e?.
signal}).catch(o=>{r(o)}),s}const ZM=(n,e)=>{let t=tr.get(n);if(t!=null)return t;const r=JM(e);if(Gy(r))return t=r,tr.set(
n,t),t;const s=new Yf({concurrency:1});let i;return t={async readLock(o){if(i!=null)return bl(i,o);i=new Yf({concurrency:e.
concurrency,autoStart:!1});const a=i,c=bl(i,o);return s.add(async()=>{a.start(),await a.onIdle().then(()=>{i===a&&(i=null)})}),
c},async writeLock(o){return i=null,bl(s,o)},finalize:()=>{tr.delete(n)},queue:s},tr.set(n,t),e.autoFinalize===!0&&s.addEventListener(
"idle",()=>{t.finalize()},{once:!0}),t},eP={name:"lock",concurrency:1/0,singleProcess:!1,autoFinalize:!1};function tP(n){
const e=Object.assign({},eP,n);return ZM(e.name,e)}function nP(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;
for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Ss(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Ui(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Ui(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function rP(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Zf=4096;function sP(n){const e=n.
length;if(e<=Zf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=Zf));return t}function iP(n){return n?.buffer instanceof ArrayBuffer}function Ui(n){return iP(n)?n:n.slice()}
function oP(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===
0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=
256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;
for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var aP=oP,cP=aP;let lP=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},uP=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Hy(this,e)}},
hP=class{decoders;constructor(e){this.decoders=e}or(e){return Hy(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Hy(n,e){return new hP({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let dP=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new lP(e,t,r),this.decoder=new uP(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function $c({name:n,prefix:e,encode:t,decode:r}){return new dP(n,e,t,
r)}function no({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=cP(t,n,r);return $c({prefix:e,
name:n,encode:s,decode:o=>Ss(i(o))})}function fP(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function pP(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function gP(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ye({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=gP(r,s);return $c(
{prefix:e,name:n,encode(o){return pP(o,r,t)},decode(o){return fP(o,i,t,n)}})}const rs=ye({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),mP=ye({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),bP=ye({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),yP=ye({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),wP=ye({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),vP=ye({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),SP=ye({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),AP=ye({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),_P=ye({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),EP=Object.freeze(Object.defineProperty({__proto__:null,base32:rs,base32hex:wP,base32hexpad:SP,
base32hexpadupper:AP,base32hexupper:vP,base32pad:bP,base32padupper:yP,base32upper:mP,base32z:_P},Symbol.toStringTag,{value:"\
Module"})),ha=no({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),CP=no({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),xP=Object.freeze(Object.defineProperty(
{__proto__:null,base36:ha,base36upper:CP},Symbol.toStringTag,{value:"Module"})),ht=no({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),IP=no({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),MP=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ht,
base58flickr:IP},Symbol.toStringTag,{value:"Module"}));var PP=jy,ep=128,TP=-128,DP=Math.pow(2,31);function jy(n,e,t){e=e||
[],t=t||0;for(var r=t;n>=DP;)e[t++]=n&255|ep,n/=128;for(;n&TP;)e[t++]=n&255|ep,n>>>=7;return e[t]=n|0,jy.bytes=t-r+1,e}var $P=qu,
kP=128,tp=127;function qu(n,r){var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw qu.bytes=0,new RangeError("Could not\
 decode varint");o=n[i++],t+=s<28?(o&tp)<<s:(o&tp)*Math.pow(2,s),s+=7}while(o>=kP);return qu.bytes=i-r,t}var LP=Math.pow(
2,7),RP=Math.pow(2,14),NP=Math.pow(2,21),FP=Math.pow(2,28),UP=Math.pow(2,35),OP=Math.pow(2,42),BP=Math.pow(2,49),zP=Math.
pow(2,56),VP=Math.pow(2,63),qP=function(n){return n<LP?1:n<RP?2:n<NP?3:n<FP?4:n<UP?5:n<OP?6:n<BP?7:n<zP?8:n<VP?9:10},WP={
encode:PP,decode:$P,encodingLength:qP},Oa=WP;function Wu(n,e=0){const t=Oa.decode(n,e),r=Oa.decode.bytes;if(r>9)throw new RangeError(
"Invalid varint: too long");if(r>1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
r]}function Ba(n,e,t=0){return Oa.encode(n,e,t),e}function za(n){return Oa.encodingLength(n)}function kc(n,e){const t=e.
byteLength,r=za(n),s=r+za(t),i=new Uint8Array(s+t);return Ba(n,i,0),Ba(t,i,r),i.set(e,s),new od(n,t,e,i)}function KP(n){
const e=Ss(n),[t,r]=Wu(e),[s,i]=Wu(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new od(t,s,o,e)}function GP(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof
Uint8Array&&nP(n.bytes,t.bytes)}}let od=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=
Ui(r),this.bytes=Ui(s)}};function np(n,e){const{bytes:t,version:r}=n;switch(r){case 0:return jP(t,Ku(n),e??ht.encoder);default:
return XP(t,Ku(n),e??rs.encoder)}}const rp=new WeakMap;function Ku(n){const e=rp.get(n);if(e==null){const t=new Map;return rp.
set(n,t),t}return e}let ro=class xe{code;version;multihash;bytes;"/";constructor(e,t,r,s){this.code=t,this.version=e,this.
multihash=r,this.bytes=Ui(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Fs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==QP)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return xe.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,r=kc(e,
t);return xe.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return xe.equals(this,e)}static equals(e,t){const r=t;return r!=null&&
e.code===r.code&&e.version===r.version&&GP(e.multihash,r.multihash)}toString(e){return np(this,e)}toJSON(){return{"/":np(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof xe)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:r,code:s,multihash:i,bytes:o}=t;return new xe(r,s,i,o??sp(r,s,i.bytes))}else if(t[YP]===!0){const{version:r,
multihash:s,code:i}=t,o=KP(s);return xe.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Fs)throw new Error(`Version 0 CID must use dag-pb (code: ${Fs}) block encoding`);return new xe(e,t,r,r.bytes)}case 1:{
const s=sp(e,t,r.bytes);return new xe(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){return xe.
create(0,Fs,e)}static createV1(e,t){return xe.create(1,e,t)}static decode(e){const[t,r]=xe.decodeFirst(e);if(r.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=xe.inspectBytes(e),r=t.size-t.multihashSize,
s=Ss(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new od(t.multihashCode,t.digestSize,i,s);return[t.version===0?xe.createV0(o):xe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,d]=Wu(e.subarray(t));return t+=d,h};let s=r(),
i=Fs;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=HP(e,t),
i=xe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ku(
i).set(r,e),i}};function HP(n,e){switch(n[0]){case"Q":{const t=e??ht;return[ht.prefix,t.decode(`${ht.prefix}${n}`)]}case ht.
prefix:{const t=e??ht;return[ht.prefix,t.decode(n)]}case rs.prefix:{const t=e??rs;return[rs.prefix,t.decode(n)]}case ha.
prefix:{const t=e??ha;return[ha.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function jP(n,e,t){const{prefix:r}=t;if(r!==
ht.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function XP(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Fs=112,QP=18;function sp(n,e,t){const r=za(n),s=r+za(e),i=new Uint8Array(s+t.
byteLength);return Ba(n,i,0),Ba(e,i,r),i.set(t,s),i}const YP=Symbol.for("@ipld/js-cid/CID"),JP=36e5,ZP=216e5;function Rt(n=0){
return new Uint8Array(n)}function Cr(n=0){return new Uint8Array(n)}const eT=Math.pow(2,7),tT=Math.pow(2,14),nT=Math.pow(
2,21),Xy=Math.pow(2,28),Qy=Math.pow(2,35),Yy=Math.pow(2,42),Jy=Math.pow(2,49),We=128,un=127;function ad(n){if(n<eT)return 1;
if(n<tT)return 2;if(n<nT)return 3;if(n<Xy)return 4;if(n<Qy)return 5;if(n<Yy)return 6;if(n<Jy)return 7;if(Number.MAX_SAFE_INTEGER!=
null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function rT(n,e,t=0){switch(ad(
n)){case 8:e[t++]=n&255|We,n/=128;case 7:e[t++]=n&255|We,n/=128;case 6:e[t++]=n&255|We,n/=128;case 5:e[t++]=n&255|We,n/=
128;case 4:e[t++]=n&255|We,n>>>=7;case 3:e[t++]=n&255|We,n>>>=7;case 2:e[t++]=n&255|We,n>>>=7;case 1:{e[t++]=n&255,n>>>=
7;break}default:throw new Error("unreachable")}return e}function sT(n,e){let t=n[e],r=0;if(r+=t&un,t<We||(t=n[e+1],r+=(t&
un)<<7,t<We)||(t=n[e+2],r+=(t&un)<<14,t<We)||(t=n[e+3],r+=(t&un)<<21,t<We)||(t=n[e+4],r+=(t&un)*Xy,t<We)||(t=n[e+5],r+=(t&
un)*Qy,t<We)||(t=n[e+6],r+=(t&un)*Yy,t<We)||(t=n[e+7],r+=(t&un)*Jy,t<We))return r;throw new RangeError("Could not decode\
 varint")}function iT(n){return n.buffer instanceof ArrayBuffer}function xr(n){return iT(n)?n:n.slice()}const cd=new Float32Array(
[-0]),In=new Uint8Array(cd.buffer);function oT(n,e,t){cd[0]=n,e[t]=In[0],e[t+1]=In[1],e[t+2]=In[2],e[t+3]=In[3]}function aT(n,e){
return In[0]=n[e],In[1]=n[e+1],In[2]=n[e+2],In[3]=n[e+3],cd[0]}const ld=new Float64Array([-0]),Pe=new Uint8Array(ld.buffer);
function cT(n,e,t){ld[0]=n,e[t]=Pe[0],e[t+1]=Pe[1],e[t+2]=Pe[2],e[t+3]=Pe[3],e[t+4]=Pe[4],e[t+5]=Pe[5],e[t+6]=Pe[6],e[t+
7]=Pe[7]}function lT(n,e){return Pe[0]=n[e],Pe[1]=n[e+1],Pe[2]=n[e+2],Pe[3]=n[e+3],Pe[4]=n[e+4],Pe[5]=n[e+5],Pe[6]=n[e+6],
Pe[7]=n[e+7],ld[0]}const uT=BigInt(Number.MAX_SAFE_INTEGER),hT=BigInt(Number.MIN_SAFE_INTEGER);let Gt=class Hn{lo;hi;constructor(e,t){
this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=
r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:r<128?9:10}static fromBigInt(e){if(e===0n)return hr;if(e<uT&&e>hT)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>ip&&(s=0n,++r>ip&&(r=0n))),new Hn(Number(s),Number(r))}static fromNumber(e){
if(e===0)return hr;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&
(r=0,++s>4294967295&&(s=0))),new Hn(r,s)}static from(e){return typeof e=="number"?Hn.fromNumber(e):typeof e=="bigint"?Hn.
fromBigInt(e):typeof e=="string"?Hn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Hn(e.low>>>0,e.high>>>0):hr}};const hr=new Gt(
0,0);hr.toBigInt=function(){return 0n};hr.zzEncode=hr.zzDecode=function(){return this};hr.length=function(){return 1};const ip=4294967296n;
function dT(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function fT(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Zy(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function St(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function Ao(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let pT=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=xr(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,St(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw St(this,4);return Ao(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw St(
this,4);return Ao(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw St(this,4);const e=aT(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw St(this,4);const e=lT(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw St(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return fT(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw St(this,e);this.pos+=e}else do if(this.pos>=this.len)throw St(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Gt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw St(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw St(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw St(this,8);const e=Ao(this.buf,this.pos+=4),t=Ao(this.buf,this.pos+=4);return new Gt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=sT(this.buf,this.pos);
return this.pos+=ad(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function ew(n){return new pT(n instanceof Uint8Array?
n:n.subarray())}function dr(n,e,t){const r=ew(n);return e.decode(r,void 0,t)}const gT=no({prefix:"9",name:"base10",alphabet:"\
0123456789"}),mT=Object.freeze(Object.defineProperty({__proto__:null,base10:gT},Symbol.toStringTag,{value:"Module"})),bT=ye(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),yT=ye({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),wT=Object.freeze(Object.defineProperty({__proto__:null,
base16:bT,base16upper:yT},Symbol.toStringTag,{value:"Module"})),vT=ye({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
ST=Object.freeze(Object.defineProperty({__proto__:null,base2:vT},Symbol.toStringTag,{value:"Module"})),tw=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),AT=tw.reduce((n,e,t)=>(n[t]=e,n),[]),_T=tw.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function ET(n){return n.reduce((e,t)=>(e+=AT[t],e),"")}function CT(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=_T[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const xT=$c({prefix:"🚀",name:"\
base256emoji",encode:ET,decode:CT}),IT=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:xT},Symbol.toStringTag,
{value:"Module"})),MT=ye({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),PT=ye({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),TT=ye({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),DT=ye({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),$T=Object.freeze(Object.defineProperty({__proto__:null,base64:MT,base64pad:PT,
base64url:TT,base64urlpad:DT},Symbol.toStringTag,{value:"Module"})),kT=ye({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
LT=Object.freeze(Object.defineProperty({__proto__:null,base8:kT},Symbol.toStringTag,{value:"Module"})),RT=$c({prefix:"\0",
name:"identity",encode:n=>sP(Ss(n)),decode:n=>Ss(rP(n))}),NT=Object.freeze(Object.defineProperty({__proto__:null,identity:RT},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const nw=0,FT="identity",rw=Ss;function UT(n,e){if(e?.
truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid truncate op\
tion, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return kc(nw,rw(n))}const ud={code:nw,name:FT,
encode:rw,digest:UT},OT=20;function BT({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new zT(n,e,t,
r,s)}let zT=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){this.name=e,this.code=t,this.encode=
r,this.minDigestLength=s??OT,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){if(t.truncate<this.minDigestLength)
throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.maxDigestLength!=
null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or equal to ${this.maxDigestLength}`)}
if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?op(r,this.code,t?.truncate):r.then(s=>op(
s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};function op(n,e,t){if(t!=null&&t!==n.byteLength){
if(t>n.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(
0,t)}return kc(e,n)}function VT(n){return async e=>new Uint8Array(await crypto.subtle.digest(n,e))}const qT=BT({name:"sh\
a2-256",code:18,encode:VT("SHA-256")}),ap={...NT,...ST,...LT,...mT,...wT,...EP,...xP,...MP,...$T,...IT};function sw(n,e,t,r){
return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const cp=sw("utf8","u",n=>"u"+new TextDecoder(
"utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),yl=sw("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)
e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Cr(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(
t);return e}),iw={utf8:cp,"utf-8":cp,hex:ap.base16,latin1:yl,ascii:yl,binary:yl,...ap};function Oi(n,e="utf8"){const t=iw[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function WT(n){let r,
s=8192;return function(o){if(o<1||o>4096)return Cr(o);s+o>8192&&(r=Cr(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==
0&&(s=(s|7)+1),a}}let Xs=class{fn;len;next;val;constructor(e,t,r){this.fn=e,this.len=t,this.next=void 0,this.val=r}};function wl(){}
let KT=class{head;tail;len;next;constructor(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const GT=WT();
function HT(n){return globalThis.Buffer!=null?Cr(n):GT(n)}let Gu=class{len;head;tail;states;constructor(){this.len=0,this.
head=new Xs(wl,0,0),this.tail=this.head,this.states=null}_push(e,t,r){return this.tail=this.tail.next=new Xs(e,t,r),this.
len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new XT((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?
4:5,e)).len,this}int32(e){return e<0?this._push(_o,10,Gt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<
1^e>>31)>>>0)}uint64(e){const t=Gt.fromBigInt(e);return this._push(_o,t.length(),t)}uint64Number(e){return this._push(rT,
ad(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(
e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Gt.fromBigInt(e).zzEncode();return this._push(_o,t.length(),
t)}sint64Number(e){const t=Gt.fromNumber(e).zzEncode();return this._push(_o,t.length(),t)}sint64String(e){return this.sint64(
BigInt(e))}bool(e){return this._push(vl,1,e?1:0)}fixed32(e){return this._push(Us,4,e>>>0)}sfixed32(e){return this.fixed32(
e)}fixed64(e){const t=Gt.fromBigInt(e);return this._push(Us,4,t.lo)._push(Us,4,t.hi)}fixed64Number(e){const t=Gt.fromNumber(
e);return this._push(Us,4,t.lo)._push(Us,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.
fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this.
_push(oT,4,e)}double(e){return this._push(cT,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(vl,1,0):this.uint32(
t)._push(QT,t,e)}string(e){const t=dT(e);return t!==0?this.uint32(t)._push(Zy,t,e):this._push(vl,1,0)}fork(){return this.
states=new KT(this),this.head=this.tail=new Xs(wl,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.
states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Xs(
wl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.reset().uint32(r),r!==0&&(this.tail.
next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=HT(this.len);let r=0;for(;e!=null;)e.fn(
e.val,t,r),r+=e.len,e=e.next;return t}};function vl(n,e,t){e[t]=n&255}function jT(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=
7;e[t]=n}let XT=class extends Xs{next;constructor(e,t){super(jT,e,t),this.next=void 0}};function _o(n,e,t){for(;n.hi!==0;)
e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}
function Us(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function QT(n,e,t){e.set(n,t)}globalThis.
Buffer!=null&&(Gu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(YT,e,n),this},Gu.
prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(JT,e,n),this});
function YT(n,e,t){e.set(n,t)}function JT(n,e,t){n.length<40?Zy(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(Oi(n),t)}
function ZT(){return new Gu}function fr(n,e){const t=ZT();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}function*pr(n,e,t){
const r=ew(n);yield*e.stream(r,void 0,".",t)}const ow={VARINT:0,LENGTH_DELIMITED:2};function aw(n,e,t,r,s){return{name:n,
type:e,encode:t,decode:r,stream:s}}function eD(n){function e(i){if(n[i.toString()]==null)throw new Error("Invalid enum v\
alue");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(a)},s=function*(o,a){};
return aw("enum",ow.VARINT,t,r,s)}function gr(n,e,t){return aw("message",ow.LENGTH_DELIMITED,n,e,t)}let Gr=class extends Error{code="\
ERR_MAX_LENGTH";name="MaxLengthError"};class lp extends Error{code="ERR_MAX_SIZE";name="MaxSizeError"}var nr;(function(n){
(function(i){let o;i.codec=()=>(o==null&&(o=gr((u,h,d={})=>{d.lengthDelimited!==!1&&h.fork(),u.key!=null&&u.key!==""&&(h.
uint32(10),h.string(u.key)),u.value!=null&&u.value.byteLength>0&&(h.uint32(18),h.bytes(u.value)),d.lengthDelimited!==!1&&
h.ldelim()},(u,h,d={})=>{const p={key:"",value:Rt(0)},v=h==null?u.len:u.pos+h;for(;u.pos<v;){const g=u.uint32();switch(g>>>
3){case 1:{p.key=u.string();break}case 2:{p.value=u.bytes();break}default:{u.skipType(g&7);break}}}return p},function*(u,h,d,p={}){
const v=h==null?u.len:u.pos+h;for(;u.pos<v;){const g=u.uint32();switch(g>>>3){case 1:{yield{field:`${d}.key`,value:u.string()};
break}case 2:{yield{field:`${d}.value`,value:u.bytes()};break}default:{u.skipType(g&7);break}}}})),o);function a(u){return fr(
u,i.codec())}i.encode=a;function c(u,h){return dr(u,i.codec(),h)}i.decode=c;function l(u,h){return pr(u,i.codec(),h)}i.stream=
l})(n.Peer$metadataEntry||(n.Peer$metadataEntry={})),(function(i){let o;i.codec=()=>(o==null&&(o=gr((u,h,d={})=>{d.lengthDelimited!==
!1&&h.fork(),u.key!=null&&u.key!==""&&(h.uint32(10),h.string(u.key)),u.value!=null&&(h.uint32(18),ui.codec().encode(u.value,
h)),d.lengthDelimited!==!1&&h.ldelim()},(u,h,d={})=>{const p={key:""},v=h==null?u.len:u.pos+h;for(;u.pos<v;){const g=u.uint32();
switch(g>>>3){case 1:{p.key=u.string();break}case 2:{p.value=ui.codec().decode(u,u.uint32(),{limits:d.limits?.value});break}default:{
u.skipType(g&7);break}}}return p},function*(u,h,d,p={}){const v=h==null?u.len:u.pos+h;for(;u.pos<v;){const g=u.uint32();
switch(g>>>3){case 1:{yield{field:`${d}.key`,value:u.string()};break}case 2:{yield*ui.codec().stream(u,u.uint32(),`${d}.\
value`,{limits:p.limits?.value});break}default:{u.skipType(g&7);break}}}})),o);function a(u){return fr(u,i.codec())}i.encode=
a;function c(u,h){return dr(u,i.codec(),h)}i.decode=c;function l(u,h){return pr(u,i.codec(),h)}i.stream=l})(n.Peer$tagsEntry||
(n.Peer$tagsEntry={}));let e;n.codec=()=>(e==null&&(e=gr((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.addresses!=null&&
i.addresses.length>0)for(const c of i.addresses)o.uint32(10),li.codec().encode(c,o);if(i.protocols!=null&&i.protocols.length>
0)for(const c of i.protocols)o.uint32(18),o.string(c);if(i.publicKey!=null&&(o.uint32(34),o.bytes(i.publicKey)),i.peerRecordEnvelope!=
null&&(o.uint32(42),o.bytes(i.peerRecordEnvelope)),i.metadata!=null&&i.metadata.size>0)for(const[c,l]of i.metadata.entries())
o.uint32(50),n.Peer$metadataEntry.codec().encode({key:c,value:l},o);if(i.tags!=null&&i.tags.size>0)for(const[c,l]of i.tags.
entries())o.uint32(58),n.Peer$tagsEntry.codec().encode({key:c,value:l},o);i.updated!=null&&(o.uint32(64),o.uint64Number(
i.updated)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={addresses:[],protocols:[],metadata:new Map,tags:new Map},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{if(a.limits?.addresses!=null&&c.addresses.
length===a.limits.addresses)throw new Gr('Decode error - repeated field "addresses" had too many elements');c.addresses.
push(li.codec().decode(i,i.uint32(),{limits:a.limits?.addresses$}));break}case 2:{if(a.limits?.protocols!=null&&c.protocols.
length===a.limits.protocols)throw new Gr('Decode error - repeated field "protocols" had too many elements');c.protocols.
push(i.string());break}case 4:{c.publicKey=i.bytes();break}case 5:{c.peerRecordEnvelope=i.bytes();break}case 6:{if(a.limits?.
metadata!=null&&c.metadata.size===a.limits.metadata)throw new lp('Decode error - map field "metadata" had too many eleme\
nts');const h=n.Peer$metadataEntry.codec().decode(i,i.uint32(),{limits:{value:a.limits?.metadata$value}});c.metadata.set(
h.key,h.value);break}case 7:{if(a.limits?.tags!=null&&c.tags.size===a.limits.tags)throw new lp('Decode error - map field\
 "tags" had too many elements');const h=n.Peer$tagsEntry.codec().decode(i,i.uint32(),{limits:{value:a.limits?.tags$value}});
c.tags.set(h.key,h.value);break}case 8:{c.updated=i.uint64Number();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l={addresses:0,protocols:0,metadata:0,tags:0},u=o==null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>
3){case 1:{if(c.limits?.addresses!=null&&l.addresses===c.limits.addresses)throw new Gr('Streaming decode error - repeate\
d field "addresses" had too many elements');for(const d of li.codec().stream(i,i.uint32(),`${a}.addresses[]`,{limits:c.limits?.
addresses$}))yield{...d,index:l.addresses};l.addresses++;break}case 2:{if(c.limits?.protocols!=null&&l.protocols===c.limits.
protocols)throw new Gr('Streaming decode error - repeated field "protocols" had too many elements');yield{field:`${a}.pr\
otocols[]`,index:l.protocols,value:i.string()},l.protocols++;break}case 4:{yield{field:`${a}.publicKey`,value:i.bytes()};
break}case 5:{yield{field:`${a}.peerRecordEnvelope`,value:i.bytes()};break}case 6:{if(c.limits?.metadata!=null&&l.metadata===
c.limits.metadata)throw new Gr('Decode error - map field "metadata" had too many elements');yield*n.Peer$metadataEntry.codec().
stream(i,i.uint32(),`${a}.metadata{}`,{limits:{value:c.limits?.metadata$value}}),l.metadata++;break}case 7:{if(c.limits?.
tags!=null&&l.tags===c.limits.tags)throw new Gr('Decode error - map field "tags" had too many elements');yield*n.Peer$tagsEntry.
codec().stream(i,i.uint32(),`${a}.tags{}`,{limits:{value:c.limits?.tags$value}}),l.tags++;break}case 8:{yield{field:`${a}\
.updated`,value:i.uint64Number()};break}default:{i.skipType(h&7);break}}}})),e);function t(i){return fr(i,n.codec())}n.encode=
t;function r(i,o){return dr(i,n.codec(),o)}n.decode=r;function s(i,o){return pr(i,n.codec(),o)}n.stream=s})(nr||(nr={}));
var li;(function(n){let e;n.codec=()=>(e==null&&(e=gr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.multiaddr!=null&&i.
multiaddr.byteLength>0&&(o.uint32(10),o.bytes(i.multiaddr)),i.isCertified!=null&&(o.uint32(16),o.bool(i.isCertified)),i.
observed!=null&&(o.uint32(24),o.uint64Number(i.observed)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={multiaddr:Rt(
0)},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.multiaddr=i.bytes();break}case 2:{
c.isCertified=i.bool();break}case 3:{c.observed=i.uint64Number();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.multiaddr`,value:i.
bytes()};break}case 2:{yield{field:`${a}.isCertified`,value:i.bool()};break}case 3:{yield{field:`${a}.observed`,value:i.
uint64Number()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return fr(i,n.codec())}n.encode=t;function r(i,o){
return dr(i,n.codec(),o)}n.decode=r;function s(i,o){return pr(i,n.codec(),o)}n.stream=s})(li||(li={}));var ui;(function(n){
let e;n.codec=()=>(e==null&&(e=gr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.value!=null&&i.value!==0&&(o.uint32(8),
o.uint32(i.value)),i.expiry!=null&&(o.uint32(16),o.uint64(i.expiry)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={
value:0},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.value=i.uint32();break}case 2:{
c.expiry=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;
for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.value`,value:i.uint32()};break}case 2:{yield{field:`${a}\
.expiry`,value:i.uint64()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return fr(i,n.codec())}n.encode=t;
function r(i,o){return dr(i,n.codec(),o)}n.decode=r;function s(i,o){return pr(i,n.codec(),o)}n.stream=s})(ui||(ui={}));function on(n,e){
if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}
async function tD(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,xr(e),xr(
t.subarray()));return r?.signal?.throwIfAborted(),i}function nD(n){return n?.buffer instanceof ArrayBuffer}function rD(n){
if(nD(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function up(n,e){e==null&&(e=n.reduce(
(s,i)=>s+i.length,0));const t=Cr(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return rD(t)}const cw=Symbol.for("@a\
chingbrain/uint8arraylist");function hp(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){
const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Eo(n){
return!!n?.[cw]}let tn=class da{bufs;length;[cw]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.appendAll(
e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(Eo(r)){t+=r.byteLength;for(const s of r.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,
this.bufs.unshift(r);else if(Eo(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=hp(this.bufs,e);return t.buf[t.index]}set(e,t){
const r=hp(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,
e[r]);else if(Eo(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{
bufs:r,length:s}=this._subList(e,t);return up(r,s)}subarray(e,t){const{bufs:r,length:s}=this._subList(e,t);return r.length===
1?r[0]:up(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new da;return i.length=s,i.bufs=r,i}_subList(e,t){
if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)throw new RangeError("index \
is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[...this.bufs],length:this.length};
const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===
0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.
push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Eo(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(
t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;
for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;
for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=Cr(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=Rt(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=Rt(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=Rt(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=Cr(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=Rt(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=Rt(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=Rt(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=Rt(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=Rt(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof da)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!on(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new da;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};function Sn(n,e="utf8"){const t=iw[e];if(t==null)throw new Error(
`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}const sD=parseInt("11111",2),Hu=parseInt("1000000\
0",2),iD=parseInt("01111111",2),dp={0:Os,1:Os,2:oD,3:lD,4:uD,5:cD,6:aD,16:Os,22:Os,48:Os};function Lc(n,e={offset:0}){const t=n[e.
offset]&sD;if(e.offset++,dp[t]!=null)return dp[t](n,e);throw new Error("No decoder for tag "+t)}function so(n,e){let t=0;
if((n[e.offset]&Hu)===Hu){const r=n[e.offset]&iD;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)
throw new Error("invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],
e.offset++;if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}
function Os(n,e){so(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=Lc(n,e);if(r===null)break;t.push(r)}return t}
function oD(n,e){const t=so(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.
offset+=t,Uint8Array.from(i)}function aD(n,e){const t=so(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=
0,o=s):s<80?(i=1,o=s-40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(
l&127),l<128){c.reverse();let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function cD(n,e){return e.
offset++,null}function lD(n,e){const t=so(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=
t,r!==0)throw new Error("Unused bits in bit string is unimplemented");return s}function uD(n,e){const t=so(n,e),r=n.subarray(
e.offset,e.offset+t);return e.offset+=t,r}function hD(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new tn;for(let r=0;r<
e.length;r+=2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function hd(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=hD(n.byteLength);return new tn(Uint8Array.from([e.byteLength|Hu]),e)}function ju(n){const e=new tn,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new tn(Uint8Array.from([2]),hd(e),e)}function lw(n){
const e=Uint8Array.from([0]),t=new tn(e,n);return new tn(Uint8Array.from([3]),hd(t),t)}function hi(n,e=48){const t=new tn;
for(const r of n)t.append(r);return new tn(Uint8Array.from([e]),hd(t),t)}const dD=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),fD=Uint8Array.from([6,5,43,129,4,0,34]),pD=Uint8Array.from([6,5,43,129,4,0,35]),gD={ext:!0,kty:"EC",crv:"P-256"},
mD={ext:!0,kty:"EC",crv:"P-384"},bD={ext:!0,kty:"EC",crv:"P-521"},Sl=32,Al=48,_l=66;function yD(n){const e=Lc(n);return wD(
e)}function wD(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===Sl*2+1)return r=Sn(e.subarray(t,t+Sl),"base64url"),s=
Sn(e.subarray(t+Sl),"base64url"),new El({...gD,key_ops:["verify"],x:r,y:s});if(e.byteLength===Al*2+1)return r=Sn(e.subarray(
t,t+Al),"base64url"),s=Sn(e.subarray(t+Al),"base64url"),new El({...mD,key_ops:["verify"],x:r,y:s});if(e.byteLength===_l*
2+1)return r=Sn(e.subarray(t,t+_l),"base64url"),s=Sn(e.subarray(t+_l),"base64url"),new El({...bD,key_ops:["verify"],x:r,
y:s});throw new L(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function vD(n){return hi(
[ju(Uint8Array.from([1])),hi([SD(n.crv)],160),hi([lw(new tn(Uint8Array.from([4]),Oi(n.x??"","base64url"),Oi(n.y??"","bas\
e64url")))],161)]).subarray()}function SD(n){if(n==="P-256")return dD;if(n==="P-384")return fD;if(n==="P-521")return pD;
throw new L(`Invalid curve ${n}`)}let El=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=vD(this.jwk)),this._raw}toMultihash(){return ud.digest(ss(this))}toCID(){return ro.createV1(114,this.toMultihash())}toString(){
return ht.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:on(this.
raw,e.raw)}async verify(e,t,r){return tD(this.jwk,t,e,r)}},fp=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},AD=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const Bi={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new AD(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},uw=32;let Cl;const _D=(async()=>{try{return await Bi.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function ED(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await Bi.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await Bi.get().subtle.verify(
{name:"Ed25519"},r,xr(e),xr(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function CD(n,e,t){return vr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function xD(n,e,t){
return Cl==null&&(Cl=await _D),Cl?ED(n,e,t):CD(n,e,t)}function hw(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}let ID=class{type="Ed25519";raw;constructor(e){this.raw=dw(e,uw)}toMultihash(){
return ud.digest(ss(this))}toCID(){return ro.createV1(114,this.toMultihash())}toString(){return ht.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:on(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=xD(this.raw,t,e);return hw(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}};function MD(n){return n=
dw(n,uw),new ID(n)}function dw(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new L(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}var Fe;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA=
"ECDSA"})(Fe||(Fe={}));var Xu;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=
3]="ECDSA"})(Xu||(Xu={}));(function(n){n.codec=()=>eD(Xu)})(Fe||(Fe={}));var zi;(function(n){let e;n.codec=()=>(e==null&&
(e=gr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Fe.codec().encode(i.Type,o)),i.Data!=null&&
(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Fe.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Fe.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.
bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return fr(i,n.codec())}n.encode=t;function r(i,o){return dr(
i,n.codec(),o)}n.decode=r;function s(i,o){return pr(i,n.codec(),o)}n.stream=s})(zi||(zi={}));var pp;(function(n){let e;n.
codec=()=>(e==null&&(e=gr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Fe.codec().encode(i.Type,
o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Fe.codec().decode(i);break}case 2:{c.Data=i.bytes();
break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.
uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Fe.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,
value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return fr(i,n.codec())}n.encode=t;function r(i,o){
return dr(i,n.codec(),o)}n.decode=r;function s(i,o){return pr(i,n.codec(),o)}n.stream=s})(pp||(pp={}));let PD=class{type="\
RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this._raw==null&&(this._raw=LD(this.
jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return ro.createV1(114,this._multihash)}toString(){return ht.
encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:on(this.raw,e.
raw)}verify(e,t,r){return FD(this.jwk,t,e,r)}};const TD=18,DD=1062,$D=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,
1,1,5,0]);function kD(n){const e=Lc(n[1],{offset:0});return{kty:"RSA",n:Sn(e[0],"base64url"),e:Sn(e[1],"base64url")}}function LD(n){
if(n.n==null||n.e==null)throw new L("JWK was missing components");return hi([$D,lw(hi([ju(Oi(n.n,"base64url")),ju(Oi(n.e,
"base64url"))]))]).subarray()}function RD(n,e){if(n.byteLength>=DD)throw new Dt("Key size is too large");const t=Lc(n,{offset:0});
return ND(t,n,e)}function ND(n,e,t){const r=kD(n);if(t==null){const s=or(zi.encode({Type:Fe.RSA,Data:e}));t=kc(TD,s)}return new PD(
r,t)}async function FD(n,e,t,r){const s=await Bi.get().subtle.importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SH\
A-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await Bi.get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,xr(
e),xr(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),i}function UD(n,e,t,r){const s=qT.digest(
t instanceof Uint8Array?t:t.subarray());if(hw(s))return s.then(({digest:i})=>(r?.signal?.throwIfAborted(),Oe.verify(e,i,
n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new fp(String(i))});try{return r?.signal?.throwIfAborted(),
Oe.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new fp(String(i))}}let OD=class{type="secp256k1";raw;_key;constructor(e){
this._key=VD(e),this.raw=zD(this._key)}toMultihash(){return ud.digest(ss(this))}toCID(){return ro.createV1(114,this.toMultihash())}toString(){
return ht.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:on(this.
raw,e.raw)}verify(e,t,r){return UD(this._key,t,e,r)}};function BD(n){return new OD(n)}function zD(n){return Oe.Point.fromBytes(
n).toBytes()}function VD(n){try{return Oe.Point.fromBytes(n),n}catch(e){throw new Dt(String(e))}}function qD(n,e){const{
Type:t,Data:r}=zi.decode(n),s=r??new Uint8Array;switch(t){case Fe.RSA:return RD(s,e);case Fe.Ed25519:return MD(s);case Fe.
secp256k1:return BD(s);case Fe.ECDSA:return yD(s);default:throw new pc}}function ss(n){return zi.encode({Type:Fe[n.type],
Data:n.raw})}function WD(n,e){if(n.publicKey!=null||e.publicKey==null)return n;let t;n.type==="RSA"&&(t=n.toMultihash());
const r=qD(e.publicKey,t);return Ft(r)}function KD(n,e,t){const r=nr.decode(e);return Qs(n,r,t)}function Qs(n,e,t){const r=new Map,
s=BigInt(Date.now());for(const[i,o]of e.tags.entries())o.expiry!=null&&o.expiry<s||r.set(i,o);return{...e,id:WD(n,e),addresses:e.
addresses.filter(({observed:i})=>i!=null&&i>Date.now()-t).map(({multiaddr:i,isCertified:o})=>({multiaddr:O(i),isCertified:o??
!1})),metadata:e.metadata,peerRecordEnvelope:e.peerRecordEnvelope??void 0,tags:r}}function GD(n,e){return HD(n.addresses,
e.addresses)&&jD(n.protocols,e.protocols)&&XD(n.publicKey,e.publicKey)&&QD(n.peerRecordEnvelope,e.peerRecordEnvelope)&&YD(
n.metadata,e.metadata)&&JD(n.tags,e.tags)}function HD(n,e){return pw(n,e,(t,r)=>!(t.isCertified!==r.isCertified||!on(t.multiaddr,
r.multiaddr)))}function jD(n,e){return pw(n,e,(t,r)=>t===r)}function XD(n,e){return fw(n,e)}function QD(n,e){return fw(n,
e)}function YD(n,e){return gw(n,e,(t,r)=>on(t,r))}function JD(n,e){return gw(n,e,(t,r)=>t.value===r.value&&t.expiry===r.
expiry)}function fw(n,e){return n==null&&e==null?!0:n!=null&&e!=null?on(n,e):!1}function pw(n,e,t){if(n.length!==e.length)
return!1;for(let r=0;r<n.length;r++)if(!t(n[r],e[r]))return!1;return!0}function gw(n,e,t){if(n.size!==e.size)return!1;for(const[
r,s]of n.entries()){const i=e.get(r);if(i==null||!t(s,i))return!1}return!0}const mw="/peers/";function Co(n){if(!ri(n)||
n.type==null)throw new L("Invalid PeerId");const e=n.toCID().toString();return new pu(`${mw}${e}`)}async function ZD(n,e,t,r,s){
const i=new Map;for(const o of t){if(o==null)continue;if(o.multiaddr instanceof Uint8Array&&(o.multiaddr=O(o.multiaddr)),
!Mh(o.multiaddr))throw new L("Multiaddr was invalid");if(!await e(n,o.multiaddr,s))continue;const a=o.isCertified??!1,c=o.
multiaddr.toString(),l=i.get(c);l!=null?o.isCertified=l.isCertified||a:i.set(c,{multiaddr:o.multiaddr,isCertified:a})}return[
...i.values()].sort((o,a)=>o.multiaddr.toString().localeCompare(a.multiaddr.toString())).map(({isCertified:o,multiaddr:a})=>{
const c=a.getComponents().find(l=>l.code===B)?.value;return n.equals(c)&&(a=a.decapsulate(O(`/p2p/${n}`))),{isCertified:o,
multiaddr:a.bytes}})}async function xl(n,e,t,r){if(e==null)throw new L("Invalid PeerData");if(e.publicKey!=null&&!n.equals(
e.publicKey.toMultihash().bytes))throw new L("publicKey does not match peer id");const s=r.existingPeer?.peer;if(s!=null&&
!n.equals(s.id))throw new L("peer id did not match existing peer id");let i=s?.addresses??[],o=new Set(s?.protocols??[]),
a=s?.metadata??new Map,c=s?.tags??new Map,l=s?.peerRecordEnvelope;if(t==="patch"){if((e.multiaddrs!=null||e.addresses!=null)&&
(i=[],e.multiaddrs!=null&&i.push(...e.multiaddrs.map(d=>({isCertified:!1,multiaddr:d}))),e.addresses!=null&&i.push(...e.
addresses)),e.protocols!=null&&(o=new Set(e.protocols)),e.metadata!=null){const d=e.metadata instanceof Map?[...e.metadata.
entries()]:Object.entries(e.metadata);a=xo(d,{validate:gp})}if(e.tags!=null){const d=e.tags instanceof Map?[...e.tags.entries()]:
Object.entries(e.tags);c=xo(d,{validate:mp,map:bp})}e.peerRecordEnvelope!=null&&(l=e.peerRecordEnvelope)}if(t==="merge"){
if(e.multiaddrs!=null&&i.push(...e.multiaddrs.map(d=>({isCertified:!1,multiaddr:d}))),e.addresses!=null&&i.push(...e.addresses),
e.protocols!=null&&(o=new Set([...o,...e.protocols])),e.metadata!=null){const d=e.metadata instanceof Map?[...e.metadata.
entries()]:Object.entries(e.metadata);for(const[p,v]of d)v==null?a.delete(p):a.set(p,v);a=xo([...a.entries()],{validate:gp})}
if(e.tags!=null){const d=e.tags instanceof Map?[...e.tags.entries()]:Object.entries(e.tags),p=new Map(c);for(const[v,g]of d)
g==null?p.delete(v):p.set(v,g);c=xo([...p.entries()],{validate:mp,map:bp})}e.peerRecordEnvelope!=null&&(l=e.peerRecordEnvelope)}
let u;s?.id.publicKey!=null?u=ss(s.id.publicKey):e.publicKey!=null?u=ss(e.publicKey):n.publicKey!=null&&(u=ss(n.publicKey));
const h={addresses:await ZD(n,r.addressFilter??(async()=>!0),i,r.existingPeer?.peerPB.addresses,r),protocols:[...o.values()].
sort((d,p)=>d.localeCompare(p)),metadata:a,tags:c,publicKey:u,peerRecordEnvelope:l};return h.addresses.forEach(d=>{d.observed=
r.existingPeer?.peerPB.addresses?.find(p=>on(p.multiaddr,d.multiaddr))?.observed??Date.now()}),n.type!=="RSA"&&delete h.
publicKey,h}function xo(n,e){const t=new Map;for(const[r,s]of n)s!=null&&e.validate(r,s);for(const[r,s]of n.sort(([i],[o])=>i.
localeCompare(o)))s!=null&&t.set(r,e.map?.(r,s)??s);return t}function gp(n,e){if(typeof n!="string")throw new L("Metadat\
a key must be a string");if(!(e instanceof Uint8Array))throw new L("Metadata value must be a Uint8Array")}function mp(n,e){
if(typeof n!="string")throw new L("Tag name must be a string");if(e.value!=null){if(parseInt(`${e.value}`,10)!==e.value)
throw new L("Tag value must be an integer");if(e.value<0||e.value>100)throw new L("Tag value must be between 0-100")}if(e.
ttl!=null){if(parseInt(`${e.ttl}`,10)!==e.ttl)throw new L("Tag ttl must be an integer");if(e.ttl<0)throw new L("Tag ttl \
must be between greater than 0")}}function bp(n,e){let t;e.expiry!=null&&(t=e.expiry),e.ttl!=null&&(t=BigInt(Date.now()+
Number(e.ttl)));const r={value:e.value??0};return t!=null&&(r.expiry=t),r}function bw(n){const e=n.toString().split("/")[2],
t=ro.parse(e,rs);return gS(t)}function Il(n,e,t){const r=bw(n);return KD(r,e,t)}function e$(n,e){return{prefix:mw,filters:(n.
filters??[]).map(t=>({key:r,value:s})=>t(Il(r,s,e))),orders:(n.orders??[]).map(t=>(r,s)=>t(Il(r.key,r.value,e),Il(s.key,
s.value,e)))}}class t${peerId;datastore;locks;addressFilter;log;maxAddressAge;maxPeerAge;constructor(e,t={}){this.log=e.
logger.forComponent("libp2p:peer-store"),this.peerId=e.peerId,this.datastore=e.datastore,this.addressFilter=t.addressFilter,
this.locks=ex({name:"libp2p_peer_store_locks",metrics:e.metrics}),this.maxAddressAge=t.maxAddressAge??JP,this.maxPeerAge=
t.maxPeerAge??ZP}getLock(e){let t=this.locks.get(e);return t==null&&(t={refs:0,lock:tP({name:e.toString(),singleProcess:!0})},
this.locks.set(e,t)),t.refs++,t}maybeRemoveLock(e,t){t.refs--,t.refs===0&&(t.lock.finalize(),this.locks.delete(e))}async getReadLock(e,t){
const r=this.getLock(e);try{const s=await r.lock.readLock(t);return()=>{s(),this.maybeRemoveLock(e,r)}}catch(s){throw this.
maybeRemoveLock(e,r),s}}async getWriteLock(e,t){const r=this.getLock(e);try{const s=await r.lock.writeLock(t);return()=>{
s(),this.maybeRemoveLock(e,r)}}catch(s){throw this.maybeRemoveLock(e,r),s}}async has(e,t){try{return await this.load(e,t),
!0}catch(r){if(r.name!=="NotFoundError")throw r}return!1}async delete(e,t){this.peerId.equals(e)||await this.datastore.delete(
Co(e),t)}async load(e,t){const r=Co(e),s=await this.datastore.get(r,t),i=nr.decode(s);if(this.#n(e,i))throw await this.datastore.
delete(r,t),new gu;return Qs(e,i,this.peerId.equals(e)?1/0:this.maxAddressAge)}async save(e,t,r){const s=await this.#e(e,
r),i=await xl(e,t,"patch",{...r,addressFilter:this.addressFilter});return this.#t(e,i,s)}async patch(e,t,r){const s=await this.#e(
e,r),i=await xl(e,t,"patch",{...r,addressFilter:this.addressFilter,existingPeer:s});return this.#t(e,i,s)}async merge(e,t,r){
const s=await this.#e(e,r),i=await xl(e,t,"merge",{addressFilter:this.addressFilter,existingPeer:s});return this.#t(e,i,
s)}async*all(e){for await(const{key:t,value:r}of this.datastore.query(e$(e??{},this.maxAddressAge),e)){const s=bw(t);if(s.
equals(this.peerId))continue;const i=nr.decode(r);if(this.#n(s,i)){await this.datastore.delete(t,e);continue}yield Qs(s,
i,this.peerId.equals(s)?1/0:this.maxAddressAge)}}async#e(e,t){try{const r=Co(e),s=await this.datastore.get(r,t),i=nr.decode(
s);if(this.#n(e,i))throw await this.datastore.delete(r,t),new gu;return{peerPB:i,peer:Qs(e,i,this.maxAddressAge)}}catch(r){
r.name!=="NotFoundError"&&this.log.error("invalid peer data found in peer store - %e",r)}}async#t(e,t,r,s){t.updated=Date.
now();const i=nr.encode(t);return await this.datastore.put(Co(e),i,s),{peer:Qs(e,t,this.maxAddressAge),previous:r?.peer,
updated:r==null||!GD(t,r.peerPB)}}#n(e,t){if(t.updated==null)return!0;if(this.peerId.equals(e))return!1;const r=t.updated<
Date.now()-this.maxPeerAge,s=Date.now()-this.maxAddressAge,i=t.addresses.filter(o=>o.observed!=null&&o.observed>s);return r&&
i.length===0}}class n${store;events;peerId;log;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:peer-store"),this.
events=e.events,this.peerId=e.peerId,this.store=new t$(e,t)}[Symbol.toStringTag]="@libp2p/peer-store";async forEach(e,t){
for await(const r of this.store.all(t))e(r)}async all(e){return Cu(this.store.all(e))}async delete(e,t){const r=await this.
store.getReadLock(e,t);try{await this.store.delete(e,t)}finally{r()}}async has(e,t){const r=await this.store.getReadLock(
e,t);try{return await this.store.has(e,t)}finally{this.log.trace("has release read lock"),r?.()}}async get(e,t){const r=await this.
store.getReadLock(e,t);try{return await this.store.load(e,t)}finally{r?.()}}async getInfo(e,t){const r=await this.get(e,
t);return{id:r.id,multiaddrs:r.addresses.map(({multiaddr:s})=>s)}}async save(e,t,r){const s=await this.store.getWriteLock(
e,r);try{const i=await this.store.save(e,t,r);return this.#e(e,i),i.peer}finally{s?.()}}async patch(e,t,r){const s=await this.
store.getWriteLock(e,r);try{const i=await this.store.patch(e,t,r);return this.#e(e,i),i.peer}finally{s?.()}}async merge(e,t,r){
const s=await this.store.getWriteLock(e,r);try{const i=await this.store.merge(e,t,r);return this.#e(e,i),i.peer}finally{
s?.()}}async consumePeerRecord(e,t,r){const s=ri(t)?t:ri(t?.expectedPeer)?t.expectedPeer:void 0,i=ri(t)||t===void 0?r:t,
o=await Qt.openAndCertify(e,bt.DOMAIN,i),a=Ft(o.publicKey);if(s?.equals(a)===!1)return this.log("envelope peer id was no\
t the expected peer id - expected: %p received: %p",s,a),!1;const c=bt.createFromProtobuf(o.payload);if(!c.peerId.equals(
a))return this.log("signing key did not match peer id in the peer record - signer: %p record: %p",a,c.peerId),!1;let l;try{
l=await this.get(a,i)}catch(u){if(u.name!=="NotFoundError")throw u}if(l?.peerRecordEnvelope!=null){const u=Qt.createFromProtobuf(
l.peerRecordEnvelope),h=bt.createFromProtobuf(u.payload);if(h.seqNumber>=c.seqNumber)return this.log("sequence number wa\
s lower or equal to existing sequence number - stored: %d received: %d",h.seqNumber,c.seqNumber),!1}return await this.patch(
c.peerId,{peerRecordEnvelope:e,addresses:c.multiaddrs.map(u=>({isCertified:!0,multiaddr:u}))},i),!0}#e(e,t){t.updated&&(this.
peerId.equals(e)?this.events.safeDispatchEvent("self:peer:update",{detail:t}):this.events.safeDispatchEvent("peer:update",
{detail:t}))}}function r$(n,e={}){return new n$(n,e)}function s$(n){return n[Symbol.asyncIterator]!=null}function yp(n){
if(s$(n))return(async()=>{for await(const e of n);})();for(const e of n);}function i$(n){return n[Symbol.asyncIterator]!=
null}function Hr(n,e){let t=0;if(i$(n))return(async function*(){for await(const c of n)await e(c,t++)&&(yield c)})();const r=mS(
n),{value:s,done:i}=r.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o.then=="function")return(async function*(){
await o&&(yield s);for(const c of r)await e(c,t++)&&(yield c)})();const a=e;return(function*(){o===!0&&(yield s);for(const c of r)
a(c,t++)&&(yield c)})()}function o$(n){return n[Symbol.asyncIterator]!=null}function wp(n,e){return o$(n)?(async function*(){
yield*(await Cu(n)).sort(e)})():(function*(){yield*Cu(n).sort(e)})()}function a$(n){return n[Symbol.asyncIterator]!=null}
function vp(n,e){return a$(n)?(async function*(){let t=0;if(!(e<1)){for await(const r of n)if(yield r,t++,t===e)return}})():
(function*(){let t=0;if(!(e<1)){for(const r of n)if(yield r,t++,t===e)return}})()}class c${put(e,t,r){return Promise.reject(
new Error(".put is not implemented"))}get(e,t){return Promise.reject(new Error(".get is not implemented"))}has(e,t){return Promise.
reject(new Error(".has is not implemented"))}delete(e,t){return Promise.reject(new Error(".delete is not implemented"))}async*putMany(e,t={}){
for await(const{key:r,value:s}of e)await this.put(r,s,t),yield r}async*getMany(e,t={}){for await(const r of e)yield{key:r,
value:await this.get(r,t)}}async*deleteMany(e,t={}){for await(const r of e)await this.delete(r,t),yield r}batch(){let e=[],
t=[];return{put(r,s){e.push({key:r,value:s})},delete(r){t.push(r)},commit:async r=>{await yp(this.putMany(e,r)),e=[],await yp(
this.deleteMany(t,r)),t=[]}}}async*_all(e,t){throw new Error("._all is not implemented")}async*_allKeys(e,t){throw new Error(
"._allKeys is not implemented")}query(e,t){let r=this._all(e,t);if(e.prefix!=null){const s=e.prefix;r=Hr(r,i=>i.key.toString().
startsWith(s))}if(Array.isArray(e.filters)&&(r=e.filters.reduce((s,i)=>Hr(s,i),r)),Array.isArray(e.orders)&&(r=e.orders.
reduce((s,i)=>wp(s,i),r)),e.offset!=null){let s=0;const i=e.offset;r=Hr(r,()=>s++>=i)}return e.limit!=null&&(r=vp(r,e.limit)),
r}queryKeys(e,t){let r=this._allKeys(e,t);if(e.prefix!=null){const s=e.prefix;r=Hr(r,i=>i.toString().startsWith(s))}if(Array.
isArray(e.filters)&&(r=e.filters.reduce((s,i)=>Hr(s,i),r)),Array.isArray(e.orders)&&(r=e.orders.reduce((s,i)=>wp(s,i),r)),
e.offset!=null){const s=e.offset;let i=0;r=Hr(r,()=>i++>=s)}return e.limit!=null&&(r=vp(r,e.limit)),r}}class l$ extends c${data;constructor(){
super(),this.data=new Map}put(e,t,r){return r?.signal?.throwIfAborted(),this.data.set(e.toString(),t),e}get(e,t){t?.signal?.
throwIfAborted();const r=this.data.get(e.toString());if(r==null)throw new bS;return r}has(e,t){return t?.signal?.throwIfAborted(),
this.data.has(e.toString())}delete(e,t){t?.signal?.throwIfAborted(),this.data.delete(e.toString())}*_all(e,t){t?.signal?.
throwIfAborted();for(const[r,s]of this.data.entries())yield{key:new pu(r),value:s},t?.signal?.throwIfAborted()}*_allKeys(e,t){
t?.signal?.throwIfAborted();for(const r of this.data.keys())yield new pu(r),t?.signal?.throwIfAborted()}}const Sp=864e13;
class u${log;mappings;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:dns-mappings"),this.mappings=
Zt({name:"libp2p_address_manager_dns_mappings",metrics:e.metrics})}has(e){const t=ne(e);let r=t.host;(t.type==="ip4"||t.
type==="ip6")&&t.sni!=null&&(r=t.sni);for(const s of this.mappings.values())if(s.domain===r)return!0;return!1}add(e,t){t.
forEach(r=>{this.log("add DNS mapping %s to %s",r,e);const s=Nh(r)===!0;this.mappings.set(r,{domain:e,verified:s,expires:s?
Sp-Date.now():0,lastVerified:s?Sp-Date.now():void 0})})}remove(e){const t=ne(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;
let r=!1;for(const[s,i]of this.mappings.entries())i.domain===t.sni&&(this.log("removing %s to %s DNS mapping %e",s,i.domain),
this.mappings.delete(s),r=r||i.verified);return r}getAll(e){const t=[];for(let r=0;r<e.length;r++){const s=e[r].multiaddr;
if(!yt(s))continue;const i=ne(s);for(const[o,a]of this.mappings.entries()){if(i.host!==o)continue;const c=this.maybeAddSNIComponent(
s,a.domain);c!=null&&(e.splice(r,1),r--,t.push({multiaddr:c,verified:a.verified,type:"dns-mapping",expires:a.expires,lastVerified:a.
lastVerified}))}}return t}maybeAddSNIComponent(e,t){const r=e.getComponents();for(let s=0;s<r.length;s++)if(r[s].code===
ts&&r[s+1]?.code!==fu)return r.splice(s+1,0,{name:"sni",code:fu,value:t}),O(r)}confirm(e,t){const r=ne(e);let s=r.host;(r.
type==="ip4"||r.type==="ip6")&&r.sni!=null&&(s=r.sni);let i=!1;for(const[o,a]of this.mappings.entries())a.domain===s&&(this.
log("marking %s to %s DNS mapping as verified",o,a.domain),i=a.verified,a.verified=!0,a.expires=Date.now()+t,a.lastVerified=
Date.now());return i}unconfirm(e,t){const r=ne(e);if(r.type!=="ip4"&&r.type!=="ip6")return!1;const s=r.sni??r.host;let i=!1;
for(const[o,a]of this.mappings.entries())a.domain===s&&(this.log("removing verification of %s to %s DNS mapping",o,a.domain),
i=i||a.verified,a.verified=!1,a.expires=Date.now()+t);return i}}class h${log;mappings;constructor(e,t={}){this.log=e.logger.
forComponent("libp2p:address-manager:ip-mappings"),this.mappings=Zt({name:"libp2p_address_manager_ip_mappings",metrics:e.
metrics})}has(e){const t=ne(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;for(const r of this.mappings.values())for(const s of r)
if(s.externalIp===t.host)return!0;return!1}add(e,t,r,s=t,i="tcp"){const o=`${e}-${t}-${i}`,a=this.mappings.get(o)??[],c={
internalIp:e,internalPort:t,externalIp:r,externalPort:s,externalFamily:va(r)?4:6,protocol:i,verified:!1,expires:0};a.push(
c),this.mappings.set(o,a)}remove(e){const t=ne(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;let r=!1;for(const[s,i]of this.
mappings.entries()){for(let o=0;o<i.length;o++){const a=i[o];a.externalIp===t.host&&a.externalPort===t.port&&a.protocol===
t.protocol&&(this.log("removing %s:%s to %s:%s %s IP mapping",a.externalIp,a.externalPort,t.host,t.port,t.protocol),r=r||
a.verified,i.splice(o,1),o--)}i.length===0&&this.mappings.delete(s)}return r}getAll(e){const t=[];for(const{multiaddr:r}of e){
if(!yt(r))continue;const s=ne(r);if(s.type!=="ip4"&&s.type!=="ip6")continue;let i;if(s.protocol==="tcp"?i=`${s.host}-${s.
port}-tcp`:s.protocol==="udp"&&(i=`${s.host}-${s.port}-udp`),i==null)continue;const o=this.mappings.get(i);if(o!=null)for(const a of o)
t.push({multiaddr:this.maybeOverrideIp(r,a.externalIp,a.externalFamily,a.protocol,a.externalPort),verified:a.verified,type:"\
ip-mapping",expires:a.expires,lastVerified:a.lastVerified})}return t}maybeOverrideIp(e,t,r,s,i){const o=e.getComponents(),
a=o.findIndex(l=>l.code===du||l.code===as),c=o.findIndex(l=>l.name===s);return a>-1&&c>-1?(o[a].value=t,o[a].code=r===4?
du:as,o[c].value=`${i}`,O(o)):e}confirm(e,t){if(!yt(e))return!1;const r=ne(e);let s=!1;for(const i of this.mappings.values())
for(const o of i)o.externalIp===r.host&&(this.log("marking %s to %s IP mapping as verified",o.internalIp,o.externalIp),s=
o.verified,o.verified=!0,o.expires=Date.now()+t,o.lastVerified=Date.now());return s}unconfirm(e,t){if(!yt(e))return!1;const r=ne(
e);let s=!1;for(const i of this.mappings.values())for(let o=0;o<i.length;o++){const a=i[o];a.externalIp===r.host&&a.externalPort===
r.port&&a.protocol===r.protocol&&(this.log("removing verification of %s:%s to %s:%s %s IP mapping",a.externalIp,a.externalPort,
r.host,r.port,r.protocol),s=s||a.verified,a.verified=!1,a.expires=Date.now()+t)}return s}}const d$={maxObservedAddresses:10};
class f${log;addresses;maxObservedAddresses;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:o\
bserved-addresses"),this.addresses=Zt({name:"libp2p_address_manager_observed_addresses",metrics:e.metrics}),this.maxObservedAddresses=
t.maxObservedAddresses??d$.maxObservedAddresses}has(e){return this.addresses.has(e.toString())}removePrefixed(e){for(const t of this.
addresses.keys())t.toString().startsWith(e)&&this.addresses.delete(t)}add(e){this.addresses.size!==this.maxObservedAddresses&&
(hs(e)||i1(e)||(this.log("adding observed address %a",e),this.addresses.set(e.toString(),{verified:!1,expires:0})))}getAll(){
return Array.from(this.addresses).map(([e,t])=>({multiaddr:O(e),verified:t.verified,type:"observed",expires:t.expires,lastVerified:t.
lastVerified}))}remove(e){const t=this.addresses.get(e.toString())?.verified??!1;return this.log("removing observed addr\
ess %a",e),this.addresses.delete(e.toString()),t}confirm(e,t){const r=e.toString(),s=this.addresses.get(r)??{verified:!1,
expires:Date.now()+t,lastVerified:Date.now()},i=s.verified;return s.verified=!0,s.expires=Date.now()+t,s.lastVerified=Date.
now(),this.log("marking observed address %a as verified",r),this.addresses.set(r,s),i}}const p$={maxObservedAddresses:10};
class g${log;addresses;maxObservedAddresses;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:o\
bserved-addresses"),this.addresses=Zt({name:"libp2p_address_manager_transport_addresses",metrics:e.metrics}),this.maxObservedAddresses=
t.maxObservedAddresses??p$.maxObservedAddresses}get(e,t){if(hs(e))return{multiaddr:e,verified:!0,type:"transport",expires:Date.
now()+t,lastVerified:Date.now()};const r=this.toKey(e);let s=this.addresses.get(r);return s==null&&(s={verified:!yt(e),expires:0},
this.addresses.set(r,s)),{multiaddr:e,verified:s.verified,type:"transport",expires:s.expires,lastVerified:s.lastVerified}}has(e){
const t=this.toKey(e);return this.addresses.has(t)}remove(e){const t=this.toKey(e),r=this.addresses.get(t)?.verified??!1;
return this.log("removing observed address %a",e),this.addresses.delete(t),r}confirm(e,t){const r=this.toKey(e),s=this.addresses.
get(r)??{verified:!1,expires:0,lastVerified:0},i=s.verified;return s.verified=!0,s.expires=Date.now()+t,s.lastVerified=Date.
now(),this.addresses.set(r,s),i}unconfirm(e,t){const r=this.toKey(e),s=this.addresses.get(r)??{verified:!1,expires:0},i=s.
verified;return s.verified=!1,s.expires=Date.now()+t,this.addresses.set(r,s),i}toKey(e){if(!yt(e))return e.toString();const t=ne(
e);return`${t.host}-${t.port}-${t.protocol}`}}const Ap=6e4,_p={addressVerificationTTL:Ap*10,addressVerificationRetry:Ap*
5},m$=n=>n;function Ml(n,e){const t=n.getComponents().findLast(r=>r.code===B)?.value;return t!=null&&te(t).equals(e)&&(n=
n.decapsulate(O(`/p2p/${e.toString()}`))),n}class b${log;components;listen;announce;appendAnnounce;announceFilter;observed;dnsMappings;ipMappings;transportAddresses;observedAddressFilter;addressVerificationTTL;addressVerificationRetry;constructor(e,t={}){
const{listen:r=[],announce:s=[],appendAnnounce:i=[]}=t;this.components=e,this.log=e.logger.forComponent("libp2p:address-\
manager"),this.listen=r.map(o=>o.toString()),this.announce=new Set(s.map(o=>o.toString())),this.appendAnnounce=new Set(i.
map(o=>o.toString())),this.observed=new f$(e,t),this.dnsMappings=new u$(e,t),this.ipMappings=new h$(e,t),this.transportAddresses=
new g$(e,t),this.announceFilter=t.announceFilter??m$,this.observedAddressFilter=_i(1024),this.addressVerificationTTL=t.addressVerificationTTL??
_p.addressVerificationTTL,this.addressVerificationRetry=t.addressVerificationRetry??_p.addressVerificationRetry,this._updatePeerStoreAddresses=
Ma(this._updatePeerStoreAddresses.bind(this),1e3),e.events.addEventListener("transport:listening",()=>{this._updatePeerStoreAddresses()}),
e.events.addEventListener("transport:close",()=>{this._updatePeerStoreAddresses()})}[Symbol.toStringTag]="@libp2p/addres\
s-manager";_updatePeerStoreAddresses(){const e=this.getAddresses().map(t=>t.getComponents().findLast(r=>r.code===B)?.value===
this.components.peerId.toString()?t.decapsulate(`/p2p/${this.components.peerId.toString()}`):t);this.components.peerStore.
patch(this.components.peerId,{multiaddrs:e}).catch(t=>{this.log.error("error updating addresses - %e",t)})}getListenAddrs(){
return Array.from(this.listen).map(e=>O(e))}getAnnounceAddrs(){return Array.from(this.announce).map(e=>O(e))}getAppendAnnounceAddrs(){
return Array.from(this.appendAnnounce).map(e=>O(e))}getObservedAddrs(){return this.observed.getAll().map(e=>e.multiaddr)}addObservedAddr(e){
const t=ne(e);let r;switch(t.type){case"ip4":{r=`${t.host}:${t.port}`;break}case"ip6":{r=`[${t.host}]:${t.port}`;break}default:
return}this.observedAddressFilter.has(r)||(this.observedAddressFilter.add(r),e=Ml(e,this.components.peerId),!this.ipMappings.
has(e)&&(this.dnsMappings.has(e)||this.observed.add(e)))}confirmObservedAddr(e,t){e=Ml(e,this.components.peerId);let r=!0;
(t?.type==="transport"||this.transportAddresses.has(e))&&!this.transportAddresses.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="dns-mapping"||this.dnsMappings.has(e))&&!this.dnsMappings.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="ip-mapping"||this.ipMappings.has(e))&&!this.ipMappings.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="observed"||this.observed.has(e))&&(this.maybeUpgradeToIPMapping(e)?(this.ipMappings.confirm(e,t?.ttl??
this.addressVerificationTTL),r=!1):!this.observed.confirm(e,t?.ttl??this.addressVerificationTTL)&&r&&(r=!1)),r||this._updatePeerStoreAddresses()}removeObservedAddr(e,t){
e=Ml(e,this.components.peerId);let r=!0;this.observed.has(e)&&this.observed.remove(e)&&r&&(r=!1),this.transportAddresses.
has(e)&&this.transportAddresses.unconfirm(e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),this.dnsMappings.has(e)&&this.
dnsMappings.unconfirm(e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),this.ipMappings.has(e)&&this.ipMappings.unconfirm(
e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),r||this._updatePeerStoreAddresses()}getAddresses(){const e=new Set,t=this.
getAddressesWithMetadata().filter(r=>{if(!r.verified)return!1;const s=r.multiaddr.toString();return e.has(s)?!1:(e.add(s),
!0)}).map(r=>r.multiaddr);return this.announceFilter(t.map(r=>{const s=O(r);return s.getComponents().pop()?.value===this.
components.peerId.toString()?s:s.encapsulate(`/p2p/${this.components.peerId.toString()}`)}))}getAddressesWithMetadata(){
const e=this.getAnnounceAddrs();if(e.length>0)return this.components.transportManager.getListeners().forEach(s=>{s.updateAnnounceAddrs(
e)}),e.map(s=>({multiaddr:s,verified:!0,type:"announce",expires:Date.now()+this.addressVerificationTTL,lastVerified:Date.
now()}));let t=[];t=t.concat(this.components.transportManager.getAddrs().map(s=>this.transportAddresses.get(s,this.addressVerificationTTL)));
const r=this.getAppendAnnounceAddrs();return r.length>0&&(this.components.transportManager.getListeners().forEach(s=>{s.
updateAnnounceAddrs(r)}),t=t.concat(r.map(s=>({multiaddr:s,verified:!0,type:"announce",expires:Date.now()+this.addressVerificationTTL,
lastVerified:Date.now()})))),t=t.concat(this.observed.getAll()),t=t.concat(this.ipMappings.getAll(t)),t=t.concat(this.dnsMappings.
getAll(t)),t}addDNSMapping(e,t){this.dnsMappings.add(e,t)}removeDNSMapping(e){this.dnsMappings.remove(O(`/dns/${e}`))&&this.
_updatePeerStoreAddresses()}addPublicAddressMapping(e,t,r,s=t,i="tcp"){this.ipMappings.add(e,t,r,s,i),this.observed.removePrefixed(
`/ip${va(r)?4:6}/${r}/${i}/${s}`)}removePublicAddressMapping(e,t,r,s=t,i="tcp"){this.ipMappings.remove(O(`/ip${va(r)?4:6}\
/${r}/${i}/${s}`))&&this._updatePeerStoreAddresses()}maybeUpgradeToIPMapping(e){if(this.ipMappings.has(e)||!yt(e))return!1;
const t=ne(e);if(t.type!=="ip4"||Nh(t.host)===!0)return!1;const r=this.components.transportManager.getListeners(),s=[i=>xi.
exactMatch(i)||xa.exactMatch(i),i=>Ca.exactMatch(i),i=>S1.exactMatch(i)];for(const i of s){if(!i(e))continue;const o=r.filter(
l=>l.getAddrs().filter(u=>ne(u).type==="ip4"&&i(u)).length>0);if(o.length!==1)continue;const a=o[0].getAddrs().filter(l=>!Au(
l)).pop();if(a==null)continue;const c=ne(a);return c.port==null?!1:(this.observed.remove(e),this.ipMappings.add(c.host,c.
port,t.host,t.port,t.protocol),!0)}return!1}}var Ep;(function(n){n.NOT_STARTED_YET="The libp2p node is not started yet",
n.NOT_FOUND="Not found"})(Ep||(Ep={}));class y$ extends Error{constructor(e="Missing service"){super(e),this.name="Missi\
ngServiceError"}}class w$ extends Error{constructor(e="Unmet service dependencies"){super(e),this.name="UnmetServiceDepe\
ndenciesError"}}class Pl extends Error{constructor(e="No content routers available"){super(e),this.name="NoContentRouter\
sError"}}class Cp extends Error{constructor(e="No peer routers available"){super(e),this.name="NoPeerRoutersError"}}class v$ extends Error{constructor(e="\
Should not try to find self"){super(e),this.name="QueriedForSelfError"}}class S$ extends Error{constructor(e="Unhandled \
protocol error"){super(e),this.name="UnhandledProtocolError"}}class A$ extends Error{constructor(e="Duplicate protocol h\
andler error"){super(e),this.name="DuplicateProtocolHandlerError"}}class xp extends Error{constructor(e="Dial denied err\
or"){super(e),this.name="DialDeniedError"}}class _$ extends Error{constructor(e="No transport was configured to listen o\
n this address"){super(e),this.name="UnsupportedListenAddressError"}}class E$ extends Error{constructor(e="Configured li\
sten addresses could not be listened on"){super(e),this.name="UnsupportedListenAddressesError"}}class C$ extends Error{constructor(e="\
No valid addresses"){super(e),this.name="NoValidAddressesError"}}class x$ extends Error{constructor(e="Connection interc\
epted"){super(e),this.name="ConnectionInterceptedError"}}class I$ extends Error{constructor(e="Connection denied"){super(
e),this.name="ConnectionDeniedError"}}class fa extends Error{constructor(e="Stream is not multiplexed"){super(e),this.name=
"MuxerUnavailableError"}}class Io extends Error{constructor(e="Encryption failed"){super(e),this.name="EncryptionFailedE\
rror"}}class M$ extends Error{constructor(e="Transport unavailable"){super(e),this.name="TransportUnavailableError"}}class P$ extends Error{constructor(e="\
Max recursive depth reached"){super(e),this.name="RecursionLimitError"}}class T${components={};_started=!1;constructor(e={}){
this.components={};for(const[t,r]of Object.entries(e))this.components[t]=r;this.components.logger==null&&(this.components.
logger=Lb())}isStarted(){return this._started}async _invokeStartableMethod(e){await Promise.all(Object.values(this.components).
filter(t=>Dh(t)).map(async t=>{await t[e]?.()}))}async beforeStart(){await this._invokeStartableMethod("beforeStart")}async start(){
await this._invokeStartableMethod("start"),this._started=!0}async afterStart(){await this._invokeStartableMethod("afterS\
tart")}async beforeStop(){await this._invokeStartableMethod("beforeStop")}async stop(){await this._invokeStartableMethod(
"stop"),this._started=!1}async afterStop(){await this._invokeStartableMethod("afterStop")}}const D$=["metrics","connecti\
onProtector","dns"],$$=["components","isStarted","beforeStart","start","afterStart","beforeStop","stop","afterStop","the\
n","_invokeStartableMethod"];function k$(n={}){const e=new T$(n);return new Proxy(e,{get(r,s,i){if(typeof s=="string"&&!$$.
includes(s)){const o=e.components[s];if(o==null&&!D$.includes(s))throw new y$(`${s} not set`);return o}return Reflect.get(
r,s,i)},set(r,s,i){return typeof s=="string"?e.components[s]=i:Reflect.set(r,s,i),!0}})}function L$(n){const e={};for(const t of Object.
values(n.components))for(const r of R$(t))e[r]=!0;for(const t of Object.values(n.components))for(const r of N$(t))if(e[r]!==
!0)throw new w$(`Service "${F$(t)}" required capability "${r}" but it was not provided by any component, you may need to\
 add additional configuration when creating your node.`)}function R$(n){return Array.isArray(n?.[st])?n[st]:[]}function N$(n){
return Array.isArray(n?.[us])?n[us]:[]}function F$(n){return n?.[Symbol.toStringTag]??n?.toString()??"unknown"}function U$(n={}){
return n.denyDialMultiaddr==null&&(n.denyDialMultiaddr=e=>xi.matches(e)?!0:hs(e)),n}let O$=class yw extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,yw)}};const B$=n=>"reason"in n?n.reason:new DOMException(
"This operation was aborted.","AbortError"),z$=2**31-1,V$=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function q$(n,e){
const{milliseconds:t,fallback:r,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
n.cancel?.()}catch{}},h=new Promise((d,p)=>{const v=()=>{p(B$(o)),l()},g=V$(t,i);try{g?p(g):o?.aborted?v():o&&(c=v,o.addEventListener(
"abort",c,{once:!0}))}finally{n.then(d,p)}if(g||o?.aborted||t>z$)return;const E=r||s===!1||s instanceof Error?void 0:new O$(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{d(r())}catch(f){p(f)}else s===!1?
d():p(s instanceof Error?s:E);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const ww=n=>typeof n=="function"?{filter:n}:
{...n},W$=n=>n===1/0||Number.isSafeInteger(n)&&n>=0,K$=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],G$=n=>{for(const[e,t]of K$){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="functi\
on")return{addListener:r.bind(n),removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},H$=n=>{const e=new Map;
for(const[t,r]of n)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},j$=({addListener:n,removeListener:e,
handlers:t,signal:r,abortHandler:s,isDone:i})=>{r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){
e(o,a);return}},X$=({removeListener:n,handlers:e,signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener(
"abort",r)},Q$=(n,e,t)=>{let r=Promise.resolve();return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function Y$(n,e,t){let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=ww(t);const{
filter:l}=t;if(!W$(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=G$(n);if(t.count===0){a([]);return}const d=[],p=m=>{
r(),c(m)},v=Q$(l,()=>s,p),g=m=>{d.push(m),t.count===d.length&&(r(),a(d))},E=(...m)=>{if(s)return;const y=t.multiArgs?m:m[0];
if(!l){g(y);return}v(y,A=>{A&&g(y)})},f=(...m)=>{p(t.rejectionMultiArgs?m:m[0])},b=()=>{p(t.signal.reason)},_={addListener:u,
removeListener:h,handlers:H$([[e,E],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:b,isDone:()=>s};r=()=>{
s=!0,clearTimeout(i),X$(_)},j$(_),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
r,t.timeout)),a(d))});if(o.cancel=r,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=q$(o,{milliseconds:t.
timeout});return a.cancel=()=>{r(),a.clear()},a}return o}function Qu(n,e,t){const r=Y$(n,e,{...ww(t),count:1,resolveImmediately:!1}),
s=r.then(i=>i[0]);return s.cancel=r.cancel,s}function vw(n){if(ri(n))return{peerId:n,multiaddrs:[]};let e=Array.isArray(
n)?n:[n],t;if(e.length>0){const r=e[0].getComponents().findLast(s=>s.code===B)?.value;t=r==null?void 0:te(r),e.forEach(s=>{
if(!Mh(s))throw new gc("Invalid multiaddr");const i=s.getComponents().findLast(o=>o.code===B)?.value;if(i==null){if(t!=null)
throw new L("Multiaddrs must all have the same peer id or have no peer id")}else{const o=te(i);if(t?.equals(o)!==!0)throw new L(
"Multiaddrs must all have the same peer id or have no peer id")}})}return e=e.filter(r=>!y1.exactMatch(r)),{peerId:t,multiaddrs:e}}
const J$=["/ipfs/id/1.0.0","/ipfs/id/push/1.0.0","/libp2p/autonat/1.0.0","/libp2p/dcutr"];async function Z$(n,e){const t=n?.
streams?.map(s=>s.protocol)??[],r=e?.closableProtocols??J$;if(!(t.filter(s=>s!=null&&!r.includes(s)).length>0))try{await n?.
close(e)}catch(s){n?.abort(s)}}function Yu(n){const e=ne(n);let t=e.cidr;if(e.type!=="ip4"&&e.type!=="ip6")throw new L(`\
Multiaddr ${n} was not an IPv4 or IPv6 address`);if(t==null)switch(e.type){case"ip4":{t=32;break}case"ip6":{t=128;break}default:
throw new L(`Multiaddr ${n} was not an IPv4 or IPv6 address`)}return new wb(e.host,t)}function Sw(n){return!ds.exactMatch(
n)}function Aw(n,e,t){if(n==null||e==null)return;const r=e.filter(i=>i.status==="open").sort((i,o)=>i.direct?-1:o.direct?
1:0).find(i=>i.limits==null);if(r==null||r.direct||t==null)return r;if(!t.some(i=>Sw(i)))return r}class ek{connectionManager;peerStore;allow;events;log;constructor(e,t={}){
this.allow=(t.allow??[]).map(r=>Yu(r)),this.connectionManager=e.connectionManager,this.peerStore=e.peerStore,this.events=
e.events,this.log=e.logger.forComponent("libp2p:connection-manager:connection-pruner"),this.maybePruneConnections=this.maybePruneConnections.
bind(this)}start(){this.events.addEventListener("connection:open",this.maybePruneConnections)}stop(){this.events.removeEventListener(
"connection:open",this.maybePruneConnections)}maybePruneConnections(){this._maybePruneConnections().catch(e=>{this.log.error(
"error while pruning connections - %e",e)})}async _maybePruneConnections(){const e=this.connectionManager.getConnections(),
t=e.length,r=this.connectionManager.getMaxConnections();if(this.log("checking max connections limit %d/%d",t,r),t<=r)return;
const s=new Lr;for(const c of e){const l=c.remotePeer;if(!s.has(l)){s.set(l,0);try{const u=await this.peerStore.get(l);s.
set(l,[...u.tags.values()].reduce((h,d)=>h+d.value,0))}catch(u){u.name!=="NotFoundError"&&this.log.error("error loading \
peer tags - %e",u)}}}const i=this.sortConnections(e,s),o=Math.max(t-r,0),a=[];for(const c of i)if(this.log("too many con\
nections open - closing a connection to %p",c.remotePeer),this.allow.some(u=>{if(yt(c.remoteAddr)){const h=ne(c.remoteAddr);
return u.contains(h.host)}return!0})||a.push(c),a.length===o)break;await Promise.all(a.map(async c=>{await Z$(c,{signal:AbortSignal.
timeout(1e3)})})),this.events.safeDispatchEvent("connection:prune",{detail:a})}sortConnections(e,t){return e.sort((r,s)=>{
const i=r.timeline.open,o=s.timeline.open;return i<o?1:i>o?-1:0}).sort((r,s)=>r.direction==="outbound"&&s.direction==="i\
nbound"?1:r.direction==="inbound"&&s.direction==="outbound"?-1:0).sort((r,s)=>r.streams.length>s.streams.length?1:r.streams.
length<s.streams.length?-1:0).sort((r,s)=>{const i=t.get(r.remotePeer)??0,o=t.get(s.remotePeer)??0;return i>o?1:i<o?-1:0})}}
const _w=1e4,Ew=6e3,Cw=1e3,tk=1e4,Va=1e4,xw=25,nk=5,rk=10,sk=5,ik="last-dial-failure",ok="last-dial-success",Iw=500,ak=32,
ck=100,Mw=50;function lk(n,e){return n.isCertified&&!e.isCertified?-1:!n.isCertified&&e.isCertified?1:0}function uk(n){return n.
sort((e,t)=>P1(e.multiaddr,t.multiaddr)||T1(e.multiaddr,t.multiaddr)||D1(e.multiaddr,t.multiaddr)||lk(e,t)||M1(e.multiaddr,
t.multiaddr))}class hk extends AggregateError{static name="DNSQueryFailedError";name="DNSQueryFailedError"}function dk(n,e,t){
let r=0,s=n.length;for(;s>0;){const i=Math.trunc(s/2);let o=r+i;t(n[o],e)<=0?(r=++o,s-=i+1):s=i}return r}class fk{#e=[];enqueue(e,t){
const{priority:r=0,id:s}=t??{},i={priority:r,id:s,run:e};if(this.size===0||this.#e[this.size-1].priority>=r){this.#e.push(
i);return}const o=dk(this.#e,i,(a,c)=>c.priority-a.priority);this.#e.splice(o,0,i)}setPriority(e,t){const r=this.#e.findIndex(
i=>i.id===e);if(r===-1)throw new ReferenceError(`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.
splice(r,1);this.enqueue(s.run,{priority:t,id:e})}dequeue(){return this.#e.shift()?.run}filter(e){return this.#e.filter(
t=>t.priority===e.priority).map(t=>t.run)}get size(){return this.#e.length}}class Pw extends yS{#e;#t;#n=0;#f;#p=!1;#g=!1;#l;#w=0;#m=0;#i;#o;#r;#v;#s=0;#u;#a;#x=1n;#h=new Map;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:fk,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expected \`inte\
rvalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString()??""}\` (${typeof e.intervalCap})`);if(e.interval===
void 0||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a finite number >= \
0, got \`${e.interval?.toString()??""}\` (${typeof e.interval})`);if(this.#e=e.carryoverIntervalCount??e.carryoverConcurrencyCount??
!1,this.#t=e.intervalCap===Number.POSITIVE_INFINITY||e.interval===0,this.#f=e.intervalCap,this.#l=e.interval,this.#r=new e.
queueClass,this.#v=e.queueClass,this.concurrency=e.concurrency,e.timeout!==void 0&&!(Number.isFinite(e.timeout)&&e.timeout>
0))throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.timeout})`);
this.timeout=e.timeout,this.#a=e.autoStart===!1,this.#k()}get#I(){return this.#t||this.#n<this.#f}get#M(){return this.#s<
this.#u}#P(){this.#s--,this.#s===0&&this.emit("pendingZero"),this.#b(),this.emit("next")}#T(){this.#E(),this.#_(),this.#o=
void 0}get#D(){const e=Date.now();if(this.#i===void 0){const t=this.#w-e;if(t<0){if(this.#m>0){const r=e-this.#m;if(r<this.#l)
return this.#S(this.#l-r),!0}this.#n=this.#e?this.#s:0}else return this.#S(t),!0}return!1}#S(e){this.#o===void 0&&(this.#o=
setTimeout(()=>{this.#T()},e))}#A(){this.#i&&(clearInterval(this.#i),this.#i=void 0)}#$(){this.#o&&(clearTimeout(this.#o),
this.#o=void 0)}#b(){if(this.#r.size===0)return this.#A(),this.emit("empty"),this.#s===0&&(this.#$(),this.emit("idle")),
!1;let e=!1;if(!this.#a){const t=!this.#D;if(this.#I&&this.#M){const r=this.#r.dequeue();this.#t||(this.#n++,this.#d()),
this.emit("active"),this.#m=Date.now(),r(),t&&this.#_(),e=!0}}return e}#_(){this.#t||this.#i!==void 0||(this.#i=setInterval(
()=>{this.#E()},this.#l),this.#w=Date.now()+this.#l)}#E(){this.#n===0&&this.#s===0&&this.#i&&this.#A(),this.#n=this.#e?this.#s:
0,this.#y(),this.#d()}#y(){for(;this.#b(););}get concurrency(){return this.#u}set concurrency(e){if(!(typeof e=="number"&&
e>=1))throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this.#u=e,
this.#y()}setPriority(e,t){if(typeof t!="number"||!Number.isFinite(t))throw new TypeError(`Expected \`priority\` to be a f\
inite number, got \`${t}\` (${typeof t})`);this.#r.setPriority(e,t)}async add(e,t={}){return t.id??=(this.#x++).toString(),
t={timeout:this.timeout,...t},new Promise((r,s)=>{const i=Symbol(`task-${t.id}`);this.#r.enqueue(async()=>{this.#s++,this.#h.
set(i,{id:t.id,priority:t.priority??0,startTime:Date.now(),timeout:t.timeout});let o;try{try{t.signal?.throwIfAborted()}catch(l){
throw this.#t||this.#n--,this.#h.delete(i),l}let a=e({signal:t.signal});if(t.timeout&&(a=wS(Promise.resolve(a),{milliseconds:t.
timeout,message:`Task timed out after ${t.timeout}ms (queue has ${this.#s} running, ${this.#r.size} waiting)`})),t.signal){
const{signal:l}=t;a=Promise.race([a,new Promise((u,h)=>{o=()=>{h(l.reason)},l.addEventListener("abort",o,{once:!0})})])}
const c=await a;r(c),this.emit("completed",c)}catch(a){s(a),this.emit("error",a)}finally{o&&t.signal?.removeEventListener(
"abort",o),this.#h.delete(i),queueMicrotask(()=>{this.#P()})}},t),this.emit("add"),this.#b()})}async addAll(e,t){return Promise.
all(e.map(async r=>this.add(r,t)))}start(){return this.#a?(this.#a=!1,this.#y(),this):this}pause(){this.#a=!0}clear(){this.#r=
new this.#v,this.#C()}async onEmpty(){this.#r.size!==0&&await this.#c("empty")}async onSizeLessThan(e){this.#r.size<e||await this.#c(
"next",()=>this.#r.size<e)}async onIdle(){this.#s===0&&this.#r.size===0||await this.#c("idle")}async onPendingZero(){this.#s!==
0&&await this.#c("pendingZero")}async onRateLimit(){this.isRateLimited||await this.#c("rateLimit")}async onRateLimitCleared(){
this.isRateLimited&&await this.#c("rateLimitCleared")}async onError(){return new Promise((e,t)=>{const r=s=>{this.off("e\
rror",r),t(s)};this.on("error",r)})}async#c(e,t){return new Promise(r=>{const s=()=>{t&&!t()||(this.off(e,s),r())};this.
on(e,s)})}get size(){return this.#r.size}sizeBy(e){return this.#r.filter(e).length}get pending(){return this.#s}get isPaused(){
return this.#a}#k(){this.#t||(this.on("add",()=>{this.#r.size>0&&this.#d()}),this.on("next",()=>{this.#d()}))}#d(){this.#t||
this.#g||(this.#g=!0,queueMicrotask(()=>{this.#g=!1,this.#C()}))}#C(){const e=this.#p,t=!this.#t&&this.#n>=this.#f&&this.#r.
size>0;t!==e&&(this.#p=t,this.emit(t?"rateLimit":"rateLimitCleared"))}get isRateLimited(){return this.#p}get isSaturated(){
return this.#s===this.#u&&this.#r.size>0||this.isRateLimited&&this.#r.size>0}get runningTasks(){return[...this.#h.values()].
map(e=>({...e}))}}function Tw(n){const e=[zn.A];return n==null?e:Array.isArray(n)?n.length===0?e:n:[n]}const Dw=60;function $w(n){
return{Status:n.Status??0,TC:n.TC??n.flag_tc??!1,RD:n.RD??n.flag_rd??!1,RA:n.RA??n.flag_ra??!1,AD:n.AD??n.flag_ad??!1,CD:n.
CD??n.flag_cd??!1,Question:(n.Question??n.questions??[]).map(e=>({name:e.name,type:zn[e.type]})),Answer:(n.Answer??n.answers??
[]).map(e=>({name:e.name,type:zn[e.type],TTL:e.TTL??e.ttl??Dw,data:e.data instanceof Uint8Array?je(e.data):e.data}))}}const pk=4;
function Ip(n,e={}){const t=new Pw({concurrency:e.queryConcurrency??pk});return async(r,s={})=>{const i=new URLSearchParams;
i.set("name",r),Tw(s.types).forEach(a=>{i.append("type",zn[a])}),s.onProgress?.(new q("dns:query",r));const o=await t.add(
async()=>{const a=await fetch(`${n}?${i}`,{headers:{accept:"application/dns-json"},signal:s?.signal});if(a.status!==200)
throw new Error(`Unexpected HTTP status: ${a.status} - ${a.statusText}`);const c=$w(await a.json());return s.onProgress?.(
new q("dns:response",c)),c},{signal:s.signal});if(o==null)throw new Error("No DNS response received");return o}}function gk(){
return[Ip("https://cloudflare-dns.com/dns-query"),Ip("https://dns.google/resolve")]}var Tl,Mp;function mk(){return Mp||(Mp=
1,Tl=function(n){if(!n)throw Error("hashlru must have a max value, of type number, greater than 0");var e=0,t=Object.create(
null),r=Object.create(null);function s(i,o){t[i]=o,e++,e>=n&&(e=0,r=t,t=Object.create(null))}return{has:function(i){return t[i]!==
void 0||r[i]!==void 0},remove:function(i){t[i]!==void 0&&(t[i]=void 0),r[i]!==void 0&&(r[i]=void 0)},get:function(i){var o=t[i];
if(o!==void 0)return o;if((o=r[i])!==void 0)return s(i,o),o},set:function(i,o){t[i]!==void 0?t[i]=o:s(i,o)},clear:function(){
t=Object.create(null),r=Object.create(null)}}}),Tl}var bk=mk();const yk=Xm(bk);class wk{lru;constructor(e){this.lru=yk(e)}get(e,t){
let r=!0;const s=[];for(const i of t){const o=this.getAnswers(e,i);if(o.length===0){r=!1;break}s.push(...o)}if(r)return $w(
{answers:s})}getAnswers(e,t){const r=`${e.toLowerCase()}-${t}`,s=this.lru.get(r);if(s!=null){const i=s.filter(o=>o.expires>
Date.now()).map(({expires:o,value:a})=>({...a,TTL:Math.round((o-Date.now())/1e3),type:zn[a.type]}));return i.length===0&&
this.lru.remove(r),i}return[]}add(e,t){const r=`${e.toLowerCase()}-${t.type}`,s=this.lru.get(r)??[];s.push({expires:Date.
now()+(t.TTL??Dw)*1e3,value:t}),this.lru.set(r,s)}remove(e,t){const r=`${e.toLowerCase()}-${t}`;this.lru.remove(r)}clear(){
this.lru.clear()}}function vk(n){return new wk(n)}const Sk=1e3;class Ak{resolvers;cache;constructor(e){this.resolvers={},
this.cache=vk(e.cacheSize??Sk),Object.entries(e.resolvers??{}).forEach(([t,r])=>{Array.isArray(r)||(r=[r]),t.endsWith(".")||
(t=`${t}.`),this.resolvers[t]=r}),this.resolvers["."]==null&&(this.resolvers["."]=gk())}async query(e,t={}){const r=Tw(t.
types),s=t.cached!==!1?this.cache.get(e,r):void 0;if(s!=null)return t.onProgress?.(new q("dns:cache",s)),s;const i=`${e.
split(".").pop()}.`,o=(this.resolvers[i]??this.resolvers["."]).sort(()=>Math.random()>.5?-1:1),a=[];for(const c of o){if(t.
signal?.aborted===!0)break;try{const l=await c(e,{...t,types:r});for(const u of l.Answer)this.cache.add(e,u);return l}catch(l){
a.push(l),t.onProgress?.(new q("dns:error",l))}}throw new hk(a,`DNS lookup of ${e} ${r} failed`)}}var zn;(function(n){n[n.
A=1]="A",n[n.CNAME=5]="CNAME",n[n.TXT=16]="TXT",n[n.AAAA=28]="AAAA"})(zn||(zn={}));function _k(n={}){return new Ak(n)}class Ek{dns;canResolve(e){
return e.getComponents().some(({name:t})=>t==="dnsaddr")}async resolve(e,t){const r=e.getComponents().find(c=>c.name==="\
dnsaddr")?.value;if(r==null)return[e];const s=this.getDNS(t);let i;try{i=await s.query(`_dnsaddr.${r}`,{signal:t?.signal,
types:[zn.TXT]})}catch(c){if(c.name==="DNSQueryFailedError"&&Array.isArray(c.errors)&&c.errors.length>0&&c.errors.every(
u=>u.name==="EmptyDNSAnswerError"))return[];throw c}const o=e.getComponents().find(c=>c.name==="p2p")?.value,a=[];for(const c of i.
Answer){const l=c.data.replace(/["']/g,"").trim().split("=")[1];l!=null&&(o!=null&&!l.includes(o)||a.push(O(l)))}return a}getDNS(e){
return e.dns!=null?e.dns:(this.dns==null&&(this.dns=_k()),this.dns)}}const kw=new Ek;async function Lw(n,e,t){const r=t.
depth??0;if(r>(t.maxRecursiveDepth??ak))throw new P$("Max recursive depth reached");let s=!1;const i=[];for(const o of Object.
values(e))if(o.canResolve(n)){s=!0;const a=await o.resolve(n,t);for(const c of a)i.push(...await Lw(c,e,{...t,depth:r+1}))}
return s===!1&&i.push(n),i}const jr={maxParallelDials:Mw,maxDialQueueLength:Iw,maxPeerAddrsToDial:xw,dialTimeout:_w,addressDialTimeout:Ew,
resolvers:{dnsaddr:kw}};class Ck{queue;components;addressSorter;maxPeerAddrsToDial;maxDialQueueLength;dialTimeout;addressDialTimeout;shutDownController;connections;log;resolvers;constructor(e,t={}){
this.addressSorter=t.addressSorter,this.maxPeerAddrsToDial=t.maxPeerAddrsToDial??jr.maxPeerAddrsToDial,this.maxDialQueueLength=
t.maxDialQueueLength??jr.maxDialQueueLength,this.dialTimeout=t.dialTimeout??jr.dialTimeout,this.addressDialTimeout=t.addressDialTimeout??
jr.addressDialTimeout,this.connections=t.connections??new Lr,this.log=e.logger.forComponent("libp2p:connection-manager:d\
ial-queue"),this.components=e,this.resolvers=t.resolvers??jr.resolvers,this.shutDownController=new AbortController,this.
shutDownController.signal,this.queue=new EA({concurrency:t.maxParallelDials??jr.maxParallelDials,metricName:"libp2p_dial\
_queue",metrics:e.metrics}),this.queue.addEventListener("failure",r=>{r.detail?.error.name!==cs.name&&this.log.error("er\
ror in dial queue - %e",r.detail.error)})}start(){this.shutDownController=new AbortController,this.shutDownController.signal}stop(){
this.shutDownController.abort(),this.queue.abort()}async dial(e,t={}){const{peerId:r,multiaddrs:s}=vw(e);if(r!=null&&t.force!==
!0){const o=Aw(r,this.connections.get(r),s);if(o!=null)return this.log("already connected to %a",o.remoteAddr),t.onProgress?.(
new q("dial-queue:already-connected",o)),o}const i=this.queue.queue.find(o=>{if(r?.equals(o.options.peerId)===!0)return!0;
const a=o.options.multiaddrs;if(a==null)return!1;for(const c of s)if(a.has(c.toString()))return!0;return!1});if(i!=null){
this.log("joining existing dial target for %p",r);for(const o of s)i.options.multiaddrs.add(o.toString());return t.onProgress?.(
new q("dial-queue:already-in-dial-queue")),i.join(t)}if(this.queue.size>=this.maxDialQueueLength)throw new ia("Dial queu\
e is full");return this.log("creating dial target for %p",r,s.map(o=>o.toString())),t.onProgress?.(new q("dial-queue:add\
-to-dial-queue")),this.queue.add(async o=>{o.onProgress?.(new q("dial-queue:start-dial"));const a=Fn([this.shutDownController.
signal,o.signal]);try{return await this.dialPeer(o,a)}finally{a.clear()}},{peerId:r,priority:t.priority??Rw,multiaddrs:new Set(
s.map(o=>o.toString())),signal:t.signal??AbortSignal.timeout(this.dialTimeout),onProgress:t.onProgress})}async dialPeer(e,t){
const r=e.peerId,s=e.multiaddrs,i=new Set;let o=e.multiaddrs.size===0,a=0,c=0;const l=[];for(this.log("starting dial to \
%p",r);o||s.size>0;){c++,o=!1;const u=[],h=new Set(e.multiaddrs);s.clear(),this.log("calculating addrs to dial %p from %\
s",r,[...h]);const d=await this.calculateMultiaddrs(r,h,{...e,signal:t});for(const p of d){if(i.has(p.multiaddr.toString())){
this.log.trace("skipping previously failed multiaddr %a while dialing %p",p.multiaddr,r);continue}u.push(p)}this.log("%s\
 dial to %p with %s",c===1?"starting":"continuing",r,u.map(p=>p.multiaddr.toString())),e?.onProgress?.(new q("dial-queue\
:calculated-addresses",u));for(const p of u){if(a===this.maxPeerAddrsToDial)throw this.log("dialed maxPeerAddrsToDial (%\
d) addresses for %p, not trying any others",a,e.peerId),new ia("Peer had more than maxPeerAddrsToDial");a++;const v=Fn([
t,AbortSignal.timeout(this.addressDialTimeout)]);try{const g=await this.components.transportManager.dial(p.multiaddr,{...e,
signal:v});this.log("dial to %a succeeded",p.multiaddr);try{await this.components.peerStore.merge(g.remotePeer,{multiaddrs:[
g.remoteAddr],metadata:{[ok]:On(Date.now().toString())}})}catch(E){this.log.error("could not update last dial failure ke\
y for %p - %e",r,E)}return g}catch(g){if(this.log.error("dial failed to %a - %e",p.multiaddr,g),i.add(p.multiaddr.toString()),
r!=null)try{await this.components.peerStore.merge(r,{metadata:{[ik]:On(Date.now().toString())}})}catch(E){this.log.error(
"could not update last dial failure key for %p - %e",r,E)}if(t.aborted)throw new Qm(g.message);l.push(g)}finally{v.clear()}}}
throw l.length===1?l[0]:new AggregateError(l,"All multiaddr dials failed")}async calculateMultiaddrs(e,t=new Set,r={}){const s=[
...t].map(h=>({multiaddr:O(h),isCertified:!1}));if(e!=null){if(this.components.peerId.equals(e))throw new ia("Tried to d\
ial self");if(await this.components.connectionGater.denyDialPeer?.(e)===!0)throw new xp("The dial request is blocked by \
gater.allowDialPeer");if(s.length===0){this.log("loading multiaddrs for %p",e);try{const h=await this.components.peerStore.
get(e);s.push(...h.addresses),this.log("loaded multiaddrs for %p",e,s.map(({multiaddr:d})=>d.toString()))}catch(h){if(h.
name!=="NotFoundError")throw h}}if(s.length===0){this.log("looking up multiaddrs for %p in the peer routing",e);try{const h=await this.
components.peerRouting.findPeer(e,r);this.log("found multiaddrs for %p in the peer routing",e,s.map(({multiaddr:d})=>d.toString())),
s.push(...h.multiaddrs.map(d=>({multiaddr:d,isCertified:!1})))}catch(h){h.name==="NoPeerRoutersError"?this.log("no peer \
routers configured",e):this.log.error("looking up multiaddrs for %p in the peer routing failed - %e",e,h)}}}let i=(await Promise.
all(s.map(async h=>{const d=await Lw(h.multiaddr,this.resolvers,{dns:this.components.dns,log:this.log,...r});return d.length===
1&&d[0].equals(h.multiaddr)?h:d.map(p=>({multiaddr:p,isCertified:!1}))}))).flat();if(e!=null){const h=`/p2p/${e.toString()}`;
i=i.map(d=>d.multiaddr.getComponents().pop()?.name!=="p2p"?{multiaddr:d.multiaddr.encapsulate(h),isCertified:d.isCertified}:
d)}const o=i.filter(h=>{if(this.components.transportManager.dialTransportForMultiaddr(h.multiaddr)==null)return!1;const d=h.
multiaddr.getComponents().findLast(p=>p.code===B)?.value;return e!=null&&d!=null?e.equals(d):!0}),a=new Map;for(const h of o){
const d=h.multiaddr.toString(),p=a.get(d);if(p!=null){p.isCertified=p.isCertified||h.isCertified||!1;continue}a.set(d,h)}
const c=[...a.values()];if(c.length===0)throw new C$(`The dial request has no valid addresses for peer: ${e?.toString()??
"unknown peer"}`);const l=[];for(const h of c)this.components.connectionGater.denyDialMultiaddr!=null&&await this.components.
connectionGater.denyDialMultiaddr(h.multiaddr)||l.push(h);const u=this.addressSorter==null?uk(l):l.sort(this.addressSorter);
if(u.length===0)throw new xp(`The connection gater denied all addresses in the dial request for peer: ${e?.toString()??"\
unknown peer"}`);return this.log.trace("addresses for %p before filtering",e??"unknown peer",i.map(({multiaddr:h})=>h.toString())),
this.log.trace("addresses for %p after filtering",e??"unknown peer",u.map(({multiaddr:h})=>h.toString())),u}async isDialable(e,t={}){
Array.isArray(e)||(e=[e]);try{const r=await this.calculateMultiaddrs(void 0,new Set(e.map(s=>s.toString())),t);return t.
runOnLimitedConnection===!1?r.find(s=>!ds.matches(s.multiaddr))!=null:!0}catch{}return!1}}const xk=Object.prototype.toString,
Ik=n=>xk.call(n)==="[object Error]",Mk=new Set(["network error","Failed to fetch","NetworkError when attempting to fetch\
 resource.","The Internet connection appears to be offline.","Network request failed","fetch failed","terminated"," A ne\
twork error occurred.","Network connection lost"]);function Pk(n){if(!(n&&Ik(n)&&n.name==="TypeError"&&typeof n.message==
"string"))return!1;const{message:t,stack:r}=n;return t==="Load failed"?r===void 0||"__sentry_captured__"in n:t.startsWith(
"error sending request for url")?!0:Mk.has(t)}function Tk(n){if(typeof n=="number"){if(n<0)throw new TypeError("Expected\
 `retries` to be a non-negative number.");if(Number.isNaN(n))throw new TypeError("Expected `retries` to be a valid numbe\
r or Infinity, got NaN.");if(Number.isFinite(n)&&!Number.isInteger(n))throw new TypeError("Expected `retries` to be a no\
n-negative integer or Infinity.")}else if(n!==void 0)throw new TypeError("Expected `retries` to be a number or Infinity.")}
function Mo(n,e,{min:t=0,allowInfinity:r=!1}={}){if(e!==void 0){if(typeof e!="number"||Number.isNaN(e))throw new TypeError(
`Expected \`${n}\` to be a number${r?" or Infinity":""}.`);if(!r&&!Number.isFinite(e))throw new TypeError(`Expected \`${n}\
\` to be a finite number.`);if(e<t)throw new TypeError(`Expected \`${n}\` to be ≥ ${t}.`)}}function Dl(n,e){if(e!==void 0&&
typeof e!="function")throw new TypeError(`Expected \`${n}\` to be a function.`)}let Dk=class extends Error{constructor(e){
super(),e instanceof Error?(this.originalError=e,{message:e}=e):(this.originalError=new Error(e),this.originalError.stack=
this.stack),this.name="AbortError",this.message=e}};function $k(n,e){const t=Math.max(1,n+1),r=e.randomize?Math.random()+
1:1;let s=Math.round(r*e.minTimeout*e.factor**(t-1));return s=Math.min(s,e.maxTimeout),s}function Po(n,e){return Number.
isFinite(e)?e-(performance.now()-n):e}async function kk(n,e){n<=0||await new Promise((t,r)=>{const s=()=>{clearTimeout(i),
e.signal?.removeEventListener("abort",s),r(e.signal.reason)},i=setTimeout(()=>{e.signal?.removeEventListener("abort",s),
t()},n);e.unref&&i.unref?.(),e.signal?.addEventListener("abort",s,{once:!0})})}async function Lk({error:n,attemptNumber:e,
retriesConsumed:t,startTime:r,options:s}){const i=n instanceof Error?n:new TypeError(`Non-error was thrown: "${n}". You \
should only throw errors.`);if(i instanceof Dk)throw i.originalError;const o=Number.isFinite(s.retries)?Math.max(0,s.retries-
t):s.retries,a=s.maxRetryTime??Number.POSITIVE_INFINITY,c=$k(t,s);if(Po(r,a)<=0){const f=Object.freeze({error:i,attemptNumber:e,
retriesLeft:o,retriesConsumed:t,retryDelay:0});throw await s.onFailedAttempt(f),i}const u=Object.freeze({error:i,attemptNumber:e,
retriesLeft:o,retriesConsumed:t,retryDelay:o>0?c:0}),h=await s.shouldConsumeRetry(u),d=h&&o>0?c:0,p=Object.freeze({error:i,
attemptNumber:e,retriesLeft:o,retriesConsumed:t,retryDelay:d});if(await s.onFailedAttempt(p),Po(r,a)<=0||Po(r,a)<=0||o<=
0||i instanceof TypeError&&!Pk(i)||!await s.shouldRetry(p))throw i;const g=Po(r,a);if(g<=0)throw i;if(!h)return s.signal?.
throwIfAborted(),!1;const E=Math.min(d,g);return s.signal?.throwIfAborted(),await kk(E,s),s.signal?.throwIfAborted(),!0}
async function Rk(n,e={}){if(e={...e},Tk(e.retries),Object.hasOwn(e,"forever"))throw new Error("The `forever` option is \
no longer supported. For many use-cases, you can set `retries: Infinity` instead.");e.retries??=10,e.factor??=2,e.minTimeout??=
1e3,e.maxTimeout??=Number.POSITIVE_INFINITY,e.maxRetryTime??=Number.POSITIVE_INFINITY,e.randomize??=!1,e.onFailedAttempt??=
()=>{},e.shouldRetry??=()=>!0,e.shouldConsumeRetry??=()=>!0,Dl("onFailedAttempt",e.onFailedAttempt),Dl("shouldRetry",e.shouldRetry),
Dl("shouldConsumeRetry",e.shouldConsumeRetry),Mo("factor",e.factor,{min:0,allowInfinity:!1}),Mo("minTimeout",e.minTimeout,
{min:0,allowInfinity:!1}),Mo("maxTimeout",e.maxTimeout,{min:0,allowInfinity:!0}),Mo("maxRetryTime",e.maxRetryTime,{min:0,
allowInfinity:!0}),e.factor>0||(e.factor=1),e.signal?.throwIfAborted();let t=0,r=0;const s=performance.now();for(;!Number.
isFinite(e.retries)||r<=e.retries;){t++;try{e.signal?.throwIfAborted();const i=await n(t);return e.signal?.throwIfAborted(),
i}catch(i){await Lk({error:i,attemptNumber:t,retriesConsumed:r,startTime:s,options:e})&&r++}}throw new Error("Retry atte\
mpts exhausted without throwing an error.")}class Nk{log;queue;started;peerStore;retries;retryInterval;backoffFactor;connectionManager;events;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:reconnect-queue"),this.peerStore=e.peerStore,this.connectionManager=e.connectionManager,
this.queue=new Wh({concurrency:t.maxParallelReconnects??sk,metricName:"libp2p_reconnect_queue",metrics:e.metrics}),this.
started=!1,this.retries=t.retries??5,this.backoffFactor=t.backoffFactor,this.retryInterval=t.retryInterval,this.events=e.
events,e.events.addEventListener("peer:disconnect",r=>{this.maybeReconnect(r.detail).catch(s=>{this.log.error("failed to\
 maybe reconnect to %p - %e",r.detail,s)})})}async maybeReconnect(e){if(!this.started)return;const t=await this.peerStore.
get(e);Pp(t)&&(this.queue.has(e)||this.queue.add(async r=>{await Rk(async s=>{if(this.started)try{await this.connectionManager.
openConnection(e,{signal:r?.signal})}catch(i){throw this.log("reconnecting to %p attempt %d of %d failed - %e",e,s,this.
retries,i),i}},{signal:r?.signal,retries:this.retries,factor:this.backoffFactor,minTimeout:this.retryInterval})},{peerId:e}).
catch(async r=>{this.log.error("failed to reconnect to %p - %e",e,r);const s={};[...t.tags.keys()].forEach(i=>{i.startsWith(
Th)&&(s[i]=void 0)}),await this.peerStore.merge(e,{tags:s}),this.events.safeDispatchEvent("peer:reconnect-failure",{detail:e})}).
catch(async r=>{this.log.error("failed to remove keep-alive tag from %p - %e",e,r)}))}start(){this.started=!0}async afterStart(){
Promise.resolve().then(async()=>{const e=await this.peerStore.all({filters:[t=>Pp(t)]});await Promise.all(e.map(async t=>{
await this.connectionManager.openConnection(t.id).catch(r=>{this.log.error("could not open connection to keepalive peer \
- %e",r)})}))}).catch(e=>{this.log.error("error reconnect to peers after start - %e",e)})}stop(){this.started=!1,this.queue.
abort()}}function Pp(n){for(const e of n.tags.keys())if(e.startsWith(Th))return!0;return!1}const Rw=50,$l={maxConnections:ck,
inboundConnectionThreshold:nk,maxIncomingPendingConnections:rk};class Fk{started;connections;allow;deny;maxIncomingPendingConnections;incomingPendingConnections;outboundPendingConnections;maxConnections;dialQueue;reconnectQueue;connectionPruner;inboundConnectionRateLimiter;peerStore;metrics;events;log;peerId;constructor(e,t={}){
if(this.maxConnections=t.maxConnections??$l.maxConnections,this.maxConnections<1)throw new L("Connection Manager maxConn\
ections must be greater than 0");this.connections=new Lr,this.started=!1,this.peerId=e.peerId,this.peerStore=e.peerStore,
this.metrics=e.metrics,this.events=e.events,this.log=e.logger.forComponent("libp2p:connection-manager"),this.onConnect=this.
onConnect.bind(this),this.onDisconnect=this.onDisconnect.bind(this),this.allow=(t.allow??[]).map(r=>Yu(O(r))),this.deny=
(t.deny??[]).map(r=>Yu(O(r))),this.incomingPendingConnections=0,this.maxIncomingPendingConnections=t.maxIncomingPendingConnections??
$l.maxIncomingPendingConnections,this.outboundPendingConnections=0,this.inboundConnectionRateLimiter=new CA({points:t.inboundConnectionThreshold??
$l.inboundConnectionThreshold,duration:1}),this.connectionPruner=new ek({connectionManager:this,peerStore:e.peerStore,events:e.
events,logger:e.logger},{allow:t.allow?.map(r=>O(r))}),this.dialQueue=new Ck(e,{addressSorter:t.addressSorter,maxParallelDials:t.
maxParallelDials??Mw,maxDialQueueLength:t.maxDialQueueLength??Iw,maxPeerAddrsToDial:t.maxPeerAddrsToDial??xw,dialTimeout:t.
dialTimeout??_w,addressDialTimeout:t.addressDialTimeout??Ew,resolvers:t.resolvers??{dnsaddr:kw},connections:this.connections}),
this.reconnectQueue=new Nk({events:e.events,peerStore:e.peerStore,logger:e.logger,connectionManager:this},{retries:t.reconnectRetries,
retryInterval:t.reconnectRetryInterval,backoffFactor:t.reconnectBackoffFactor,maxParallelReconnects:t.maxParallelReconnects})}[Symbol.
toStringTag]="@libp2p/connection-manager";async start(){this.metrics?.registerMetricGroup("libp2p_connection_manager_con\
nections",{calculate:()=>{const e={inbound:0,"inbound pending":this.incomingPendingConnections,outbound:0,"outbound pend\
ing":this.outboundPendingConnections};for(const t of this.connections.values())for(const r of t)e[r.direction]++;return e}}),
this.metrics?.registerMetricGroup("libp2p_protocol_streams_total",{label:"protocol",calculate:()=>{const e={};for(const t of this.
connections.values())for(const r of t)for(const s of r.streams){const i=`${s.direction} ${s.protocol??"unnegotiated"}`;e[i]=
(e[i]??0)+1}return e}}),this.metrics?.registerMetricGroup("libp2p_connection_manager_protocol_streams_per_connection_90t\
h_percentile",{label:"protocol",calculate:()=>{const e={};for(const r of this.connections.values())for(const s of r){const i={};
for(const o of s.streams){const a=`${o.direction} ${o.protocol??"unnegotiated"}`;i[a]=(i[a]??0)+1}for(const[o,a]of Object.
entries(i))e[o]=e[o]??[],e[o].push(a)}const t={};for(let[r,s]of Object.entries(e)){s=s.sort((o,a)=>o-a);const i=Math.floor(
s.length*.9);t[r]=s[i]}return t}}),this.events.addEventListener("connection:open",this.onConnect),this.events.addEventListener(
"connection:close",this.onDisconnect),await ab(this.dialQueue,this.reconnectQueue,this.connectionPruner),this.started=!0,
this.log("started")}async stop(){this.events.removeEventListener("connection:open",this.onConnect),this.events.removeEventListener(
"connection:close",this.onDisconnect),await cb(this.reconnectQueue,this.dialQueue,this.connectionPruner);const e=[];for(const t of this.
connections.values())for(const r of t)e.push(Promise.all([Qu(r,"close",{signal:AbortSignal.timeout(500)}),r.close({signal:AbortSignal.
timeout(500)})]).catch(s=>{r.abort(s)}));this.log("closing %d connections",e.length),await Promise.all(e),this.connections.
clear(),this.log("stopped")}getMaxConnections(){return this.maxConnections}setMaxConnections(e){if(e<1)throw new L("Conn\
ection Manager maxConnections must be greater than 0");let t=!1;e<this.maxConnections&&(t=!0),this.maxConnections=e,t&&this.
connectionPruner.maybePruneConnections()}onConnect(e){this._onConnect(e).catch(t=>{this.log.error("could not connect - %\
e",t)})}async _onConnect(e){const{detail:t}=e;if(!this.started){await t.close();return}if(t.status!=="open")return;const r=t.
remotePeer,s=!this.connections.has(r),i=this.connections.get(r)??[];i.push(t),this.connections.set(r,i),r.publicKey!=null&&
r.type==="RSA"&&await this.peerStore.patch(r,{publicKey:r.publicKey}),s&&this.events.safeDispatchEvent("peer:connect",{detail:t.
remotePeer})}onDisconnect(e){const{detail:t}=e,r=t.remotePeer,i=(this.connections.get(r)??[]).filter(o=>o.id!==t.id);this.
connections.set(r,i),i.length===0&&(this.log.trace("peer %p disconnected, removing connection map entry",r),this.connections.
delete(r),this.events.safeDispatchEvent("peer:disconnect",{detail:r}))}getConnections(e){if(e!=null)return this.connections.
get(e)??[];let t=[];for(const r of this.connections.values())t=t.concat(r);return t}getConnectionsMap(){return this.connections}async openConnection(e,t={}){
if(!this.started)throw new Ai("Not started");this.outboundPendingConnections++;try{t.signal?.throwIfAborted(),t?.onProgress?.(
new q("connection:open",e));const{peerId:r,multiaddrs:s}=vw(e);if(this.peerId.equals(r))throw new Ym("Can not dial self");
if(r!=null&&t.force!==!0){this.log("dial %p",r);const c=Aw(r,this.getConnections(r),s);if(c!=null)return this.log("had a\
n existing connection to %p as %a",r,c.remoteAddr),t.onProgress?.(new q("dial-queue:already-connected")),t.onProgress?.(
new q("connection:opened",c)),c}const i=await this.dialQueue.dial(e,{...t,priority:t.priority??Rw});if(i.status!=="open")
throw new mu("Remote closed connection during opening");let o=this.connections.get(i.remotePeer);o==null&&(o=[],this.connections.
set(i.remotePeer,o));let a=!1;for(const c of o)if(c.id===i.id&&(a=!0),t.force!==!0&&c.id!==i.id&&c.remoteAddr.equals(i.remoteAddr))
return i.abort(new gc("Duplicate multiaddr connection")),c;return a||o.push(i),t.onProgress?.(new q("connection:opened",
i)),i}finally{this.outboundPendingConnections--}}async openStream(e,t,r={}){return(await this.openConnection(e,r)).newStream(
t,r)}async closeConnections(e,t={}){const r=this.connections.get(e)??[];await Promise.all(r.map(async s=>{try{await Promise.
all([Qu(s,"close",t),s.close(t)])}catch(i){s.abort(i)}}))}acceptIncomingConnection(e){if(this.deny.some(s=>{if(yt(e.remoteAddr)){
const i=ne(e.remoteAddr);return s.contains(i.host)}return!1}))return this.log("connection from %a refused - connection r\
emote address was in deny list",e.remoteAddr),!1;if(this.allow.some(s=>{if(yt(e.remoteAddr)){const i=ne(e.remoteAddr);return s.
contains(i.host)}return!0}))return this.incomingPendingConnections++,!0;if(this.incomingPendingConnections===this.maxIncomingPendingConnections)
return this.log("connection from %a refused - incomingPendingConnections exceeded by host",e.remoteAddr),!1;if(yt(e.remoteAddr)){
const s=ne(e.remoteAddr);try{this.inboundConnectionRateLimiter.consume(s.host,1)}catch{return this.log("connection from \
%a refused - inboundConnectionThreshold exceeded by host %s",e.remoteAddr,s.host),!1}}return this.getConnections().length<
this.maxConnections?(this.incomingPendingConnections++,!0):(this.log("connection from %a refused - maxConnections exceed\
ed",e.remoteAddr),!1)}afterUpgradeInbound(){this.incomingPendingConnections--}getDialQueue(){const e={queued:"queued",running:"\
active",errored:"error",complete:"success"};return this.dialQueue.queue.queue.map(t=>({id:t.id,status:e[t.status],peerId:t.
options.peerId,multiaddrs:[...t.options.multiaddrs].map(r=>O(r))}))}async isDialable(e,t={}){return this.dialQueue.isDialable(
e,t)}}const Uk=1e4,Ok="1.0.0",Bk="ping",zk="ipfs",Tp=32,Vk=!0;class qk{protocol;components;log;heartbeatInterval;pingIntervalMs;abortController;timeout;abortConnectionOnPingFailure;constructor(e,t={}){
this.components=e,this.protocol=`/${t.protocolPrefix??zk}/${Bk}/${Ok}`,this.log=e.logger.forComponent("libp2p:connection\
-monitor"),this.pingIntervalMs=t.pingInterval??Uk,this.abortConnectionOnPingFailure=t.abortConnectionOnPingFailure??Vk,this.
timeout=new V1({...t.pingTimeout??{},metrics:e.metrics,metricName:"libp2p_connection_monitor_ping_time_milliseconds"})}[Symbol.
toStringTag]="@libp2p/connection-monitor";[st]=["@libp2p/connection-monitor"];start(){this.abortController=new AbortController,
this.abortController.signal,this.heartbeatInterval=setInterval(()=>{this.components.connectionManager.getConnections().forEach(
e=>{Promise.resolve().then(async()=>{let t=Date.now();const r=this.timeout.getTimeoutSignal({signal:this.abortController?.
signal});let s;try{s=await e.newStream(this.protocol,{signal:r,runOnLimitedConnection:!0});const i=vS(s);t=Date.now(),await Promise.
all([i.write(crypto.getRandomValues(new Uint8Array(Tp)),{signal:r}),i.read({bytes:Tp,signal:r})]),e.rtt=Date.now()-t,await s.
close({signal:r})}catch(i){if(s?.abort(i),i.name!=="UnsupportedProtocolError")throw i;e.rtt=(Date.now()-t)/2}finally{this.
timeout.cleanUp(r)}}).catch(t=>{this.log.error("error during heartbeat - %e",t),this.abortConnectionOnPingFailure?(this.
log.error("aborting connection due to ping failure"),e.abort(t)):this.log("connection ping failed, but not aborting due \
to abortConnectionOnPingFailure flag")})})},this.pingIntervalMs)}stop(){this.abortController?.abort(),this.heartbeatInterval!=
null&&clearInterval(this.heartbeatInterval)}}class Wk{routers;started;components;constructor(e,t){this.routers=t.routers??
[],this.started=!1,this.components=e,this.findProviders=e.metrics?.traceFunction("libp2p.contentRouting.findProviders",this.
findProviders.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,cid:r.toString()}),getAttributesFromYieldedValue:(r,s)=>({
...s,providers:[...Array.isArray(s.providers)?s.providers:[],r.id.toString()]})})??this.findProviders,this.provide=e.metrics?.
traceFunction("libp2p.contentRouting.provide",this.provide.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,
cid:r.toString()})})??this.provide,this.cancelReprovide=e.metrics?.traceFunction("libp2p.contentRouting.cancelReprovide",
this.cancelReprovide.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,cid:r.toString()})})??this.cancelReprovide,
this.put=e.metrics?.traceFunction("libp2p.contentRouting.put",this.put.bind(this),{optionsIndex:2,getAttributesFromArgs:([
r])=>({key:lt(r,"base36")})})??this.put,this.get=e.metrics?.traceFunction("libp2p.contentRouting.get",this.get.bind(this),
{optionsIndex:1,getAttributesFromArgs:([r])=>({key:lt(r,"base36")})})??this.get}[Symbol.toStringTag]="@libp2p/content-ro\
uting";isStarted(){return this.started}async start(){this.started=!0}async stop(){this.started=!1}async*findProviders(e,t={}){
if(this.routers.length===0)throw new Pl("No content routers available");const r=this,s=new lr;for await(const i of bu(...r.
routers.filter(o=>o.findProviders instanceof Function).map(o=>o.findProviders(e,t))))i!=null&&(i.multiaddrs.length>0&&await this.
components.peerStore.merge(i.id,{multiaddrs:i.multiaddrs},t),!s.has(i.id)&&(s.add(i.id),yield i))}async provide(e,t={}){
if(this.routers.length===0)throw new Pl("No content routers available");await Promise.all(this.routers.filter(r=>r.provide instanceof
Function).map(async r=>{await r.provide(e,t)}))}async cancelReprovide(e,t={}){if(this.routers.length===0)throw new Pl("N\
o content routers available");await Promise.all(this.routers.filter(r=>r.cancelReprovide instanceof Function).map(async r=>{
await r.cancelReprovide(e,t)}))}async put(e,t,r){if(!this.isStarted())throw new Ai;await Promise.all(this.routers.filter(
s=>s.put instanceof Function).map(async s=>{await s.put(e,t,r)}))}async get(e,t){if(!this.isStarted())throw new Ai;return Promise.
any(this.routers.filter(r=>r.get instanceof Function).map(async r=>r.get(e,t)))}}class Kk{log;peerId;peerStore;routers;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:peer-routing"),this.peerId=e.peerId,this.peerStore=e.peerStore,this.routers=t.routers??
[],this.findPeer=e.metrics?.traceFunction("libp2p.peerRouting.findPeer",this.findPeer.bind(this),{optionsIndex:1,getAttributesFromArgs:([
r],s)=>({...s,peer:r.toString()})})??this.findPeer,this.getClosestPeers=e.metrics?.traceFunction("libp2p.peerRouting.get\
ClosestPeers",this.getClosestPeers.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,key:lt(r,"base36")}),
getAttributesFromYieldedValue:(r,s)=>({...s,peers:[...Array.isArray(s.peers)?s.peers:[],r.id.toString()]})})??this.getClosestPeers}[Symbol.
toStringTag]="@libp2p/peer-routing";async findPeer(e,t){if(this.routers.length===0)throw new Cp("No peer routers availab\
le");if(e.toString()===this.peerId.toString())throw new v$("Should not try to find self");const r=this,s=bu(...this.routers.
filter(i=>i.findPeer instanceof Function).map(i=>(async function*(){try{yield await i.findPeer(e,t)}catch(o){r.log.error(
"router failed to find peer - %e",o)}})()));for await(const i of s)if(i!=null)return i.multiaddrs.length>0&&await this.peerStore.
merge(i.id,{multiaddrs:i.multiaddrs},t),i;throw new gu}async*getClosestPeers(e,t={}){if(this.routers.length===0)throw new Cp(
"No peer routers available");const r=this,s=_i(1024);for await(const i of SS((async function*(){const o=bu(...r.routers.
filter(a=>a.getClosestPeers instanceof Function).map(a=>a.getClosestPeers(e,t)));for await(let a of o)yield async()=>{if(a.
multiaddrs.length===0)try{a=await r.findPeer(a.id,{...t,useCache:!1})}catch(c){r.log.error("could not find peer multiadd\
rs - %e",c);return}return a}})()))i!=null&&(i.multiaddrs.length>0&&await this.peerStore.merge(i.id,{multiaddrs:i.multiaddrs},
t),!s.has(i.id.toMultihash().bytes)&&(s.add(i.id.toMultihash().bytes),yield i))}}class Gk extends he{peerRouting;log;walking;walkers;shutdownController;walkController;needNext;constructor(e){
super(),this.log=e.logger.forComponent("libp2p:random-walk"),this.peerRouting=e.peerRouting,this.walkers=0,this.walking=
!1,this.shutdownController=new AbortController,this.shutdownController.signal}[Symbol.toStringTag]="@libp2p/random-walk";start(){
this.shutdownController=new AbortController,this.shutdownController.signal}stop(){this.shutdownController.abort()}async*walk(e){
this.walking||this.startWalk(),this.walkers++;const t=Fn([this.shutdownController.signal,e?.signal]);try{for(;;)this.needNext?.
resolve(),this.needNext=Hm(),yield(await Qu(this,"walk:peer",{signal:t,rejectionEvents:["walk:error"]})).detail}catch(r){
throw r.detail!=null?r.detail:r}finally{t.clear(),this.walkers--,this.walkers===0&&(this.walkController?.abort(),this.walkController=
void 0)}}startWalk(){this.walking=!0,this.walkController=new AbortController,this.walkController.signal;const e=Fn([this.
walkController.signal,this.shutdownController.signal]),t=Date.now();let r=0;Promise.resolve().then(async()=>{for(this.log(
"start walk");this.walkers>0;)try{const s=crypto.getRandomValues(new Uint8Array(32));let i=Date.now();for await(const o of this.
peerRouting.getClosestPeers(s,{signal:e}))e.aborted&&this.log("aborting walk"),e.throwIfAborted(),this.log("found peer %\
p after %dms for %d walkers",o.id,Date.now()-i,this.walkers),r++,this.safeDispatchEvent("walk:peer",{detail:o}),this.walkers===
1&&this.needNext!=null&&(this.log("wait for need next"),await kt(this.needNext.promise,e)),i=Date.now();this.log("walk i\
teration for %b and %d walkers finished, found %d peers",s,this.walkers,r)}catch(s){this.log.error("random walk errored \
- %e",s),this.safeDispatchEvent("walk:error",{detail:s})}this.log("no walkers left, ended walk")}).catch(s=>{this.log.error(
"random walk errored - %e",s)}).finally(()=>{this.log("finished walk, found %d peers after %dms",r,Date.now()-t),this.walking=
!1})}}const Nw=32,Fw=64;class Hk{log;topologies;handlers;components;middleware;globalMiddleware=[];constructor(e){this.components=
e,this.log=e.logger.forComponent("libp2p:registrar"),this.middleware=new Map,this.topologies=new Map,e.metrics?.registerMetricGroup(
"libp2p_registrar_topologies",{calculate:()=>{const t={};for(const[r,s]of this.topologies)t[r]=s.size;return t}}),this.handlers=
Zt({name:"libp2p_registrar_protocol_handlers",metrics:e.metrics}),this._onDisconnect=this._onDisconnect.bind(this),this.
_onPeerUpdate=this._onPeerUpdate.bind(this),this._onPeerIdentify=this._onPeerIdentify.bind(this),this.components.events.
addEventListener("peer:disconnect",this._onDisconnect),this.components.events.addEventListener("peer:update",this._onPeerUpdate),
this.components.events.addEventListener("peer:identify",this._onPeerIdentify)}[Symbol.toStringTag]="@libp2p/registrar";getProtocols(){
return Array.from(new Set([...this.handlers.keys()])).sort()}getHandler(e){const t=this.handlers.get(e);if(t==null)throw new S$(
`No handler registered for protocol ${e}`);return t}getTopologies(e){const t=this.topologies.get(e);return t==null?[]:[...t.
values()]}async handle(e,t,r){if(this.handlers.has(e)&&r?.force!==!0)throw new A$(`Handler already registered for protoc\
ol ${e}`);this.handlers.set(e,{handler:t,options:{maxInboundStreams:Nw,maxOutboundStreams:Fw,...r}}),await this.components.
peerStore.merge(this.components.peerId,{protocols:[e]},r)}async unhandle(e,t){(Array.isArray(e)?e:[e]).forEach(s=>{this.
handlers.delete(s)}),await this.components.peerStore.patch(this.components.peerId,{protocols:this.getProtocols()},t)}async register(e,t){
if(t==null)throw new L("invalid topology");const r=`${(Math.random()*1e9).toString(36)}${Date.now()}`;let s=this.topologies.
get(e);return s==null&&(s=new Map,this.topologies.set(e,s)),s.set(r,t),r}unregister(e){for(const[t,r]of this.topologies.
entries())r.has(e)&&(r.delete(e),r.size===0&&this.topologies.delete(t))}use(e,t){if(typeof e=="function"){this.globalMiddleware.
push(e);return}if(t==null)throw new L("Protocol middleware is required");this.middleware.set(e,t)}unuse(e){typeof e=="fu\
nction"?this.globalMiddleware=this.globalMiddleware.filter(t=>t!==e):this.middleware.delete(e)}getMiddleware(e){return[...this.
globalMiddleware,...this.middleware.get(e)??[]]}async _onDisconnect(e){const t=e.detail,r={signal:AbortSignal.timeout(5e3)};
try{const s=await this.components.peerStore.get(t,r);for(const i of s.protocols){const o=this.topologies.get(i);o!=null&&
await Promise.all([...o.values()].map(async a=>{a.filter!=null&&a.filter.has(t)!==!0||(a.filter?.remove(t),await a.onDisconnect?.(
t))}))}}catch(s){if(s.name==="NotFoundError")return;this.log.error("could not inform topologies of disconnecting peer %p\
 - %e",t,s)}}async _onPeerUpdate(e){const{peer:t,previous:r}=e.detail,s=(r?.protocols??[]).filter(i=>!t.protocols.includes(
i));try{for(const i of s){const o=this.topologies.get(i);o!=null&&await Promise.all([...o.values()].map(async a=>{a.filter!=
null&&a.filter.has(t.id)!==!0||(a.filter?.remove(t.id),await a.onDisconnect?.(t.id))}))}}catch(i){this.log.error("could \
not inform topologies of updated peer %p - %e",t.id,i)}}async _onPeerIdentify(e){const t=e.detail.protocols,r=e.detail.connection,
s=e.detail.peerId;try{for(const i of t){const o=this.topologies.get(i);o!=null&&await Promise.all([...o.values()].map(async a=>{
r.limits!=null&&a.notifyOnLimitedConnection!==!0||a.filter?.has(s)!==!0&&(a.filter?.add(s),await a.onConnect?.(s,r))}))}}catch(i){
this.log.error("could not inform topologies of updated peer after identify %p - %e",s,i)}}}class jk{log;components;transports;listeners;faultTolerance;started;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:transports"),this.components=e,this.started=!1,this.transports=Zt({name:"libp2p_t\
ransport_manager_transports",metrics:this.components.metrics}),this.listeners=Zt({name:"libp2p_transport_manager_listene\
rs",metrics:this.components.metrics}),this.faultTolerance=t.faultTolerance??En.FATAL_ALL}[Symbol.toStringTag]="@libp2p/t\
ransport-manager";add(e){const t=e[Symbol.toStringTag];if(t==null)throw new L("Transport must have a valid tag");if(this.
transports.has(t))throw new L(`There is already a transport with the tag ${t}`);this.log("adding transport %s",t),this.transports.
set(t,e),this.listeners.has(t)||this.listeners.set(t,[])}isStarted(){return this.started}start(){this.started=!0}async afterStart(){
const e=this.components.addressManager.getListenAddrs();await this.listen(e)}async stop(){const e=[];for(const[t,r]of this.
listeners)for(this.log("closing listeners for %s",t);r.length>0;){const s=r.pop();s!=null&&e.push(s.close())}await Promise.
all(e),this.log("all listeners closed");for(const t of this.listeners.keys())this.listeners.set(t,[]);this.started=!1}async dial(e,t){
const r=this.dialTransportForMultiaddr(e);if(r==null)throw new M$(`No transport available for address ${String(e)}`);return t?.
onProgress?.(new q("transport-manager:selected-transport",r[Symbol.toStringTag])),r.dial(e,{...t,upgrader:this.components.
upgrader})}getAddrs(){let e=[];for(const t of this.listeners.values())for(const r of t)e=[...e,...r.getAddrs()];return e}getTransports(){
return Array.of(...this.transports.values())}getListeners(){return Array.of(...this.listeners.values()).flat()}dialTransportForMultiaddr(e){
for(const t of this.transports.values())if(t.dialFilter([e]).length>0)return t}listenTransportForMultiaddr(e){for(const t of this.
transports.values())if(t.listenFilter([e]).length>0)return t}async listen(e){if(!this.isStarted())throw new Ai("Not star\
ted");if(e==null||e.length===0){this.log("no addresses were provided for listening, this node is dial only");return}const t={
errors:new Map,ipv4:{success:0,attempts:0},ipv6:{success:0,attempts:0}};e.forEach(i=>{t.errors.set(i.toString(),new _$)});
const r=[];for(const[i,o]of this.transports.entries()){const a=o.listenFilter(e);for(const c of a){this.log("creating li\
stener for %s on %a",i,c);const l=o.createListener({upgrader:this.components.upgrader});let u=this.listeners.get(i)??[];
u==null&&(u=[],this.listeners.set(i,u)),u.push(l),l.addEventListener("listening",()=>{this.components.events.safeDispatchEvent(
"transport:listening",{detail:l})}),l.addEventListener("close",()=>{const h=u.findIndex(d=>d===l);u.splice(h,1),this.components.
events.safeDispatchEvent("transport:close",{detail:l})}),af.matches(c)?t.ipv4.attempts++:cf.matches(c)&&t.ipv6.attempts++,
r.push(l.listen(c).then(()=>{t.errors.delete(c.toString()),af.matches(c)&&t.ipv4.success++,cf.matches(c)&&t.ipv6.success++},
h=>{throw this.log.error("transport %s could not listen on address %a - %e",i,c,h),t.errors.set(c.toString(),h),h}))}}const s=await Promise.
allSettled(r);if(!(s.length>0&&s.every(i=>i.status==="fulfilled"))){if(this.ipv6Unsupported(t)){this.log("all IPv4 addre\
sses succeed but all IPv6 failed");return}if(this.faultTolerance===En.NO_FATAL){this.log("failed to listen on any addres\
s but fault tolerance allows this");return}throw new E$(`Some configured addresses failed to be listened on, you may nee\
d to remove one or more listen addresses from your configuration or set \`transportManager.faultTolerance\` to NO_FATAL:
${[...t.errors.entries()].map(([i,o])=>`
  ${i}: ${`${Xk(o)}`.split(`
`).join(`
  `)}
`).join("")}`)}}ipv6Unsupported(e){if(e.ipv4.attempts===0||e.ipv6.attempts===0)return!1;const t=e.ipv4.attempts===e.ipv4.
success,r=e.ipv6.success===0;return t&&r}async remove(e){const t=this.listeners.get(e)??[];this.log.trace("removing tran\
sport %s",e);const r=[];for(this.log.trace("closing listeners for %s",e);t.length>0;){const s=t.pop();s!=null&&r.push(s.
close())}await Promise.all(r),this.transports.delete(e),this.listeners.delete(e)}async removeAll(){const e=[];for(const t of this.
transports.keys())e.push(this.remove(t));await Promise.all(e)}}function Xk(n){return n.stack!=null&&n.stack.trim()!==""?
n.stack:n.message!=null?n.message:n.toString()}const rr="/multistream/1.0.0",Uw=1024;function Ju(n){if(n instanceof Uint8Array&&
n.constructor.name==="Uint8Array")return $p(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(
n))return $p(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function Qk(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Dp=4096;function Yk(n){const e=n.
length;if(e<=Dp)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=Dp));return t}function Jk(n){return n?.buffer instanceof ArrayBuffer}function $p(n){return Jk(n)?n:n.slice()}
function Zk(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===
0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=
256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;
for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var e3=Zk,t3=e3;let n3=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},r3=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Ow(this,e)}},
s3=class{decoders;constructor(e){this.decoders=e}or(e){return Ow(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Ow(n,e){return new s3({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let i3=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new n3(e,t,r),this.decoder=new r3(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Rc({name:n,prefix:e,encode:t,decode:r}){return new i3(n,e,t,
r)}function io({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=t3(t,n,r);return Rc({prefix:e,
name:n,encode:s,decode:o=>Ju(i(o))})}function o3(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function a3(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function c3(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function we({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=c3(r,s);return Rc(
{prefix:e,name:n,encode(o){return a3(o,r,t)},decode(o){return o3(o,i,t,n)}})}const l3=io({prefix:"9",name:"base10",alphabet:"\
0123456789"}),u3=Object.freeze(Object.defineProperty({__proto__:null,base10:l3},Symbol.toStringTag,{value:"Module"})),h3=we(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),d3=we({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),f3=Object.freeze(Object.defineProperty({__proto__:null,
base16:h3,base16upper:d3},Symbol.toStringTag,{value:"Module"})),p3=we({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
g3=Object.freeze(Object.defineProperty({__proto__:null,base2:p3},Symbol.toStringTag,{value:"Module"})),Bw=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),m3=Bw.reduce((n,e,t)=>(n[t]=e,n),[]),b3=Bw.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function y3(n){return n.reduce((e,t)=>(e+=m3[t],e),"")}function w3(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=b3[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const v3=Rc({prefix:"🚀",name:"\
base256emoji",encode:y3,decode:w3}),S3=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:v3},Symbol.toStringTag,
{value:"Module"})),A3=we({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
_3=we({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),E3=we(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),C3=we({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),x3=we({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),I3=we({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),M3=we({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),P3=we({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),T3=we({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),D3=Object.freeze(Object.defineProperty({__proto__:null,
base32:A3,base32hex:x3,base32hexpad:M3,base32hexpadupper:P3,base32hexupper:I3,base32pad:E3,base32padupper:C3,base32upper:_3,
base32z:T3},Symbol.toStringTag,{value:"Module"})),$3=io({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),k3=io({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
L3=Object.freeze(Object.defineProperty({__proto__:null,base36:$3,base36upper:k3},Symbol.toStringTag,{value:"Module"})),R3=io(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),N3=io({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),F3=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:R3,base58flickr:N3},Symbol.toStringTag,{value:"Module"})),U3=we({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),O3=we({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),B3=we({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),z3=we({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),V3=Object.freeze(Object.defineProperty(
{__proto__:null,base64:U3,base64pad:O3,base64url:B3,base64urlpad:z3},Symbol.toStringTag,{value:"Module"})),q3=we({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),W3=Object.freeze(Object.defineProperty({__proto__:null,base8:q3},Symbol.
toStringTag,{value:"Module"})),K3=Rc({prefix:"\0",name:"identity",encode:n=>Yk(Ju(n)),decode:n=>Ju(Qk(n))}),G3=Object.freeze(
Object.defineProperty({__proto__:null,identity:K3},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const kp={...G3,...g3,...W3,...u3,...f3,...D3,...L3,...F3,...V3,...S3};function hn(n=0){return new Uint8Array(n)}function As(n=0){
return new Uint8Array(n)}function zw(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const Lp=zw("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),kl=zw("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=As(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Vw={utf8:Lp,"utf-8":Lp,hex:kp.base16,latin1:kl,ascii:kl,
binary:kl,...kp};function Xt(n,e="utf8"){const t=Vw[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function H3(n,e="utf8"){const t=Vw[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const j3=Xt(`
`);async function Zu(n,e){const r=(await n.read(e)).subarray();if(r.byteLength===0||r[r.length-1]!==j3[0])throw new Y("M\
issing newline");return H3(r).trimEnd()}async function eh(n,e,t={}){if(e=Array.isArray(e)?[...e]:[e],e.length===0)throw new Error(
"At least one protocol must be specified");const r=n.log.newScope("mss:select"),s=Aa(n,{...t,maxDataLength:Uw});for(let i=0;i<
e.length;i++){const o=e[i];let a;if(i===0){r.trace('write ["%s", "%s"]',rr,o);const c=Xt(`${rr}
`),l=Xt(`${o}
`);if(await s.writeV([c,l],t),r.trace("reading multistream-select header"),a=await Zu(s,t),r.trace('read "%s"',a),a!==rr){
r.error("did not read multistream-select header from response");break}}else r.trace('write "%s"',o),await s.write(Xt(`${o}\

`),t);if(r.trace("reading protocol response"),a=await Zu(s,t),r.trace('read "%s"',a),a===o)return r.trace('selected "%s"\
 after negotiation',a),s.unwrap(),o}throw new AS(`Protocol selection failed - could not negotiate ${e}`)}const X3=Math.pow(
2,7),Q3=Math.pow(2,14),Y3=Math.pow(2,21),J3=Math.pow(2,28),Z3=Math.pow(2,35),eL=Math.pow(2,42),tL=Math.pow(2,49),nt=128;
function Nc(n){if(n<X3)return 1;if(n<Q3)return 2;if(n<Y3)return 3;if(n<J3)return 4;if(n<Z3)return 5;if(n<eL)return 6;if(n<
tL)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");
return 8}function nL(n,e,t=0){switch(Nc(n)){case 8:e[t++]=n&255|nt,n/=128;case 7:e[t++]=n&255|nt,n/=128;case 6:e[t++]=n&
255|nt,n/=128;case 5:e[t++]=n&255|nt,n/=128;case 4:e[t++]=n&255|nt,n>>>=7;case 3:e[t++]=n&255|nt,n>>>=7;case 2:e[t++]=n&
255|nt,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function rL(n,e,t=0){switch(Nc(
n)){case 8:e.set(t++,n&255|nt),n/=128;case 7:e.set(t++,n&255|nt),n/=128;case 6:e.set(t++,n&255|nt),n/=128;case 5:e.set(t++,
n&255|nt),n/=128;case 4:e.set(t++,n&255|nt),n>>>=7;case 3:e.set(t++,n&255|nt),n>>>=7;case 2:e.set(t++,n&255|nt),n>>>=7;case 1:{
e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}function sL(n,e,t=0){return e==null&&(e=As(
Nc(n))),e instanceof Uint8Array?nL(n,e,t):rL(n,e,t)}function iL(n){return n?.buffer instanceof ArrayBuffer}function oL(n){
if(iL(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Rp(n,e){e==null&&(e=n.reduce(
(s,i)=>s+i.length,0));const t=As(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return oL(t)}function aL(n,e){if(n===
e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const qw=Symbol.
for("@achingbrain/uint8arraylist");function Np(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function To(n){return!!n?.[qw]}let Ww=class pa{bufs;length;[qw]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>
0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(
e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(To(r)){t+=
r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array\
 or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(To(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Np(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=Np(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(To(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Rp(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:Rp(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new pa;return i.
length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(
o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!To(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=As(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=hn(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=hn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=hn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=As(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=hn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=hn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=hn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=hn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=hn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof pa)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!aL(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new pa;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const Kw=1024*1024*4;let cL=class extends Error{name="\
InvalidDataLengthError";code="ERR_MSG_DATA_TOO_LONG"};function lL(n){return n[Symbol.asyncIterator]!=null}function Gw(n,e){
if(n.byteLength>e)throw new cL("Message length too long")}const Fc=n=>{const e=Nc(n),t=As(e);return sL(n,t),Fc.bytes=e,t};
Fc.bytes=0;function Hw(n,e){e=e??{};const t=e.lengthEncoder??Fc,r=e?.maxDataLength??Kw;function*s(i){Gw(i,r);const o=t(i.
byteLength);o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:yield*i}return lL(n)?(async function*(){
for await(const i of n)yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}Hw.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??
Fc,r=e?.maxDataLength??Kw;return Gw(n,r),new Ww(t(n.byteLength),n)};var Fp;(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=
1]="DATA"})(Fp||(Fp={}));async function th(n,e,t={}){e=Array.isArray(e)?e:[e];const r=n.log.newScope("mss:handle"),s=Aa(
n,{...t,maxDataLength:Uw,maxLengthLength:2});for(;;){r.trace("reading incoming string");const i=await Zu(s,t);if(r.trace(
'read "%s"',i),i===rr){r.trace('respond with "%s" for "%s"',rr,i),await s.write(Xt(`${rr}
`),t),r.trace('responded with "%s" for "%s"',rr,i);continue}if(e.includes(i))return r.trace('respond with "%s" for "%s"',
i,i),await s.write(Xt(`${i}
`),t),r.trace('responded with "%s" for "%s"',i,i),s.unwrap(),i;if(i==="ls"){const o=new Ww(...e.map(a=>Hw.single(Xt(`${a}\

`))),Xt(`
`));r.trace('respond with "%s" for %s',e,i),await s.write(o,t),r.trace('responded with "%s" for %s',e,i);continue}r.trace(
'respond with "na" for "%s"',i),await s.write(Xt(`na
`),t),r('responded with "na" for "%s"',i)}}class uL extends he{id;remoteAddr;remotePeer;direction;timeline;direct;multiplexer;encryption;limits;log;maConn;muxer;components;outboundStreamProtocolNegotiationTimeout;inboundStreamProtocolNegotiationTimeout;closeTimeout;constructor(e,t){
super(),this.components=e,this.id=t.id,this.remoteAddr=t.maConn.remoteAddr,this.remotePeer=t.remotePeer,this.direction=t.
direction??"outbound",this.timeline=t.maConn.timeline,this.encryption=t.cryptoProtocol,this.limits=t.limits,this.maConn=
t.maConn,this.log=t.maConn.log,this.outboundStreamProtocolNegotiationTimeout=t.outboundStreamProtocolNegotiationTimeout??
Va,this.inboundStreamProtocolNegotiationTimeout=t.inboundStreamProtocolNegotiationTimeout??Va,this.closeTimeout=t.closeTimeout??
Cw,this.direct=Sw(t.maConn.remoteAddr),this.onIncomingStream=this.onIncomingStream.bind(this),this.remoteAddr.getComponents().
find(r=>r.code===B)==null&&(this.remoteAddr=this.remoteAddr.encapsulate(`/p2p/${this.remotePeer}`)),t.muxer!=null&&(this.
multiplexer=t.muxer.protocol,this.muxer=t.muxer,this.muxer.addEventListener("stream",this.onIncomingStream)),this.maConn.
addEventListener("close",r=>{this.dispatchEvent(new bc(r.local,r.error))})}[Symbol.toStringTag]="Connection";[RS]=!0;get streams(){
return this.muxer?.streams??[]}get status(){return this.maConn.status}newStream=async(e,t={})=>{if(this.muxer==null)throw new fa(
"Connection is not multiplexed");if(this.muxer.status!=="open")throw new mu(`The connection muxer is "${this.muxer.status}\
" and not "open"`);if(this.maConn.status!=="open")throw new mu(`The connection is "${this.status}" and not "open"`);if(this.
limits!=null&&t?.runOnLimitedConnection!==!0)throw new Xd("Cannot open protocol stream on limited connection");Array.isArray(
e)||(e=[e]),t.onProgress?.(new q("connection:open-stream",{connection:this,protocols:e})),this.log.trace("starting new s\
tream for protocols %s",e);const r=await this.muxer.createStream({...t,protocol:e.length===1?e[0]:void 0});this.log.trace(
"started new stream %s for protocols %s",r.id,e);try{if(t.signal==null){r.log("no abort signal was passed while trying t\
o negotiate protocols %s falling back to default timeout",e);const c=AbortSignal.timeout(this.outboundStreamProtocolNegotiationTimeout);
t={...t,signal:c}}r.protocol===""?(r.log.trace("selecting protocol from protocols %s",e),r.protocol=await eh(r,e,t),r.log(
"negotiated protocol %s",r.protocol)):r.log("pre-negotiated protocol %s",r.protocol);const s=fL(r.protocol,this.components.
registrar,t),i=Up(r.protocol,"outbound",this);if(i>s){const c=new Jm(`Too many outbound protocol streams for protocol "${r.
protocol}" - ${i}/${s}`);throw r.abort(c),c}await this.components.peerStore.merge(this.remotePeer,{protocols:[r.protocol]}),
this.components.metrics?.trackProtocolStream(r);const o=this.components.registrar.getMiddleware(r.protocol),a=await this.
runMiddlewareChain(r,this,o);return t.onProgress?.(new q("connection:opened-stream",{connection:this,stream:a})),a}catch(s){
throw r.status==="open"?r.abort(s):this.log.error("could not create new outbound stream on connection %s %a for protocol\
s %s - %e",this.direction==="inbound"?"from":"to",this.remoteAddr,e,s),s}};async onIncomingStream(e){const t=e.detail,r=AbortSignal.
timeout(this.inboundStreamProtocolNegotiationTimeout);t.log("start protocol negotiation, timing out after %dms",this.inboundStreamProtocolNegotiationTimeout);
try{if(t.protocol===""){const l=this.components.registrar.getProtocols();t.log.trace("selecting protocol from protocols \
%s",l),t.protocol=await th(t,l,{signal:r}),t.log("negotiated protocol %s",t.protocol)}else t.log("pre-negotiated protoco\
l %s",t.protocol);const s=dL(t.protocol,this.components.registrar);if(Up(t.protocol,"inbound",this)>s)throw new _S(`Too \
many inbound protocol streams for protocol "${t.protocol}" - limit ${s}`);await this.components.peerStore.merge(this.remotePeer,
{protocols:[t.protocol]},{signal:r}),this.components.metrics?.trackProtocolStream(t);const{handler:o,options:a}=this.components.
registrar.getHandler(t.protocol);if(this.limits!=null&&a.runOnLimitedConnection!==!0)throw new Xd("Cannot open protocol \
stream on limited connection");const c=this.components.registrar.getMiddleware(t.protocol);c.push(async(l,u,h)=>{await o(
l,u),h(l,u)}),await this.runMiddlewareChain(t,this,c)}catch(s){t.abort(s)}}async runMiddlewareChain(e,t,r){for(let s=0;s<
r.length;s++){const i=r[s];e.log.trace("running middleware",s,i),await new Promise((o,a)=>{try{const c=i(e,t,(l,u)=>{e=l,
t=u,o()});c instanceof Promise&&c.catch(a)}catch(c){a(c)}}),e.log.trace("ran middleware",s,i)}return e}async close(e={}){
if(this.log("closing connection to %a",this.remoteAddr),e.signal==null){const t=AbortSignal.timeout(this.closeTimeout);e=
{...e,signal:t}}await this.muxer?.close(e),await this.maConn.close(e)}abort(e){this.muxer?.abort(e),this.maConn.abort(e)}}
function hL(n,e){return new uL(n,e)}function dL(n,e){try{const{options:t}=e.getHandler(n);if(t.maxInboundStreams!=null)return t.
maxInboundStreams}catch(t){if(t.name!=="UnhandledProtocolError")throw t}return Nw}function fL(n,e,t={}){try{const{options:r}=e.
getHandler(n);if(r.maxOutboundStreams!=null)return r.maxOutboundStreams}catch(r){if(r.name!=="UnhandledProtocolError")throw r}
return t.maxOutboundStreams??Fw}function Up(n,e,t){let r=0;return t.streams.forEach(s=>{s.direction===e&&s.protocol===n&&
r++}),r}class pL{components;connectionEncrypters;streamMuxers;inboundUpgradeTimeout;inboundStreamProtocolNegotiationTimeout;outboundStreamProtocolNegotiationTimeout;events;metrics;connectionCloseTimeout;constructor(e,t){
this.components=e,this.connectionEncrypters=Zt({name:"libp2p_upgrader_connection_encrypters",metrics:this.components.metrics}),
t.connectionEncrypters.forEach(r=>{this.connectionEncrypters.set(r.protocol,r)}),this.streamMuxers=Zt({name:"libp2p_upgr\
ader_stream_multiplexers",metrics:this.components.metrics}),t.streamMuxers.forEach(r=>{this.streamMuxers.set(r.protocol,
r)}),this.inboundUpgradeTimeout=t.inboundUpgradeTimeout??tk,this.inboundStreamProtocolNegotiationTimeout=t.inboundStreamProtocolNegotiationTimeout??
Va,this.outboundStreamProtocolNegotiationTimeout=t.outboundStreamProtocolNegotiationTimeout??Va,this.connectionCloseTimeout=
t.connectionCloseTimeout??Cw,this.events=e.events,this.metrics={dials:e.metrics?.registerCounterGroup("libp2p_connection\
_manager_dials_total"),errors:e.metrics?.registerCounterGroup("libp2p_connection_manager_dial_errors_total"),inboundErrors:e.
metrics?.registerCounterGroup("libp2p_connection_manager_dials_inbound_errors_total"),outboundErrors:e.metrics?.registerCounterGroup(
"libp2p_connection_manager_dials_outbound_errors_total")}}[Symbol.toStringTag]="@libp2p/upgrader";async shouldBlockConnection(e,...t){
const r=this.components.connectionGater[e];if(r==null)return;if(await r.apply(this.components.connectionGater,t)===!0)throw new x$(
`The multiaddr connection is blocked by gater.${e}`)}createInboundAbortSignal(e){return Fn([AbortSignal.timeout(this.inboundUpgradeTimeout),
e])}async upgradeInbound(e,t){let r=!1;const s=this.createInboundAbortSignal(t.signal);try{if(this.metrics.dials?.increment(
{inbound:!0}),r=this.components.connectionManager.acceptIncomingConnection(e),!r)throw new I$("Connection denied");await kt(
this.shouldBlockConnection("denyInboundConnection",e),s),await this._performUpgrade(e,"inbound",{...t,signal:s})}catch(i){
throw this.metrics.errors?.increment({inbound:!0}),this.metrics.inboundErrors?.increment({[i.name??"Error"]:!0}),i}finally{
s.clear(),r&&this.components.connectionManager.afterUpgradeInbound()}}async upgradeOutbound(e,t){try{this.metrics.dials?.
increment({outbound:!0});const r=e.remoteAddr.getComponents().findLast(o=>o.code===B)?.value;let s;r!=null&&(s=te(r),await kt(
this.shouldBlockConnection("denyOutboundConnection",s,e),t.signal));let i="outbound";return t.initiator===!1&&(i="inboun\
d"),await this._performUpgrade(e,i,t)}catch(r){throw this.metrics.errors?.increment({outbound:!0}),this.metrics.outboundErrors?.
increment({[r.name??"Error"]:!0}),r}}async _performUpgrade(e,t,r){let s=e,i,o,a,c;const l=`${parseInt(String(Math.random()*
1e9)).toString(36)}${Date.now()}`;if(e.log=e.log.newScope(`${t}:${l}`),this.components.metrics?.trackMultiaddrConnection(
e),e.log.trace("starting the %s connection upgrade",t),r?.skipProtection!==!0){const h=this.components.connectionProtector;
h!=null&&(e.log("protecting the %s connection",t),s=await h.protect(s,r))}try{if(gL(r)){if(r.remotePeer==null)throw new gc(
`${t} connection that skipped encryption must have a peer id`);c="native",i=r.remotePeer}else{const h=e.remoteAddr.getComponents().
findLast(p=>p.code===B)?.value;let d;if(h!=null&&(d=te(h)),r?.onProgress?.(new q(`upgrader:encrypt-${t}-connection`)),{connection:s,
remotePeer:i,protocol:c,streamMuxer:o}=await(t==="inbound"?this._encryptInbound(s,{...r,remotePeer:d}):this._encryptOutbound(
s,{...r,remotePeer:d})),d!=null&&!d.equals(i)){const p=new Ph(`Expected remote peer ${d} but connected to ${i}`);throw e.
abort(p),p}}if(i.equals(this.components.peerId)){const h=new Ym("Can not dial self");throw e.abort(h),h}await this.shouldBlockConnection(
t==="inbound"?"denyInboundEncryptedConnection":"denyOutboundEncryptedConnection",i,e),r?.muxerFactory!=null?o=r.muxerFactory:
o==null&&this.streamMuxers.size>0&&(r?.onProgress?.(new q(`upgrader:multiplex-${t}-connection`)),o=await(t==="inbound"?this.
_multiplexInbound(s,this.streamMuxers,r):this._multiplexOutbound(s,this.streamMuxers,r)))}catch(h){throw e.log.error("fa\
iled to upgrade %s connection %s %a - %e",t,t==="inbound"?"from":"to",e.remoteAddr,h),h}o!=null&&(e.log("create muxer %s",
o.protocol),a=o.createStreamMuxer(s)),await this.shouldBlockConnection(t==="inbound"?"denyInboundUpgradedConnection":"de\
nyOutboundUpgradedConnection",i,e);const u=this._createConnection({id:l,cryptoProtocol:c,direction:t,maConn:e,stream:s,muxer:a,
remotePeer:i,limits:r?.limits,closeTimeout:this.connectionCloseTimeout});return u.log("successfully upgraded connection"),
u}_createConnection(e){const t=hL(this.components,{...e,outboundStreamProtocolNegotiationTimeout:this.outboundStreamProtocolNegotiationTimeout,
inboundStreamProtocolNegotiationTimeout:this.inboundStreamProtocolNegotiationTimeout});return t.addEventListener("close",
()=>{this.events.safeDispatchEvent("connection:close",{detail:t})}),this.events.safeDispatchEvent("connection:open",{detail:t}),
t}async _encryptInbound(e,t){const r=Array.from(this.connectionEncrypters.keys());try{const s=await th(e,r,t),i=this.connectionEncrypters.
get(s);if(i==null)throw new Io(`no crypto module found for ${s}`);return e.log("encrypting inbound connection using %s",
s),{...await i.secureInbound(e,t),protocol:s}}catch(s){throw new Io(s.message)}}async _encryptOutbound(e,t){const r=Array.
from(this.connectionEncrypters.keys());try{e.log.trace("selecting encrypter from %s",r);const s=await eh(e,r,t),i=this.connectionEncrypters.
get(s);if(i==null)throw new Io(`no crypto module found for ${s}`);return e.log("encrypting outbound connection using %s",
s),{...await i.secureOutbound(e,t),protocol:s}}catch(s){throw new Io(s.message)}}async _multiplexOutbound(e,t,r){const s=Array.
from(t.keys());e.log("outbound selecting muxer %s",s);try{e.log.trace("selecting stream muxer from %s",s);const i=await eh(
e,s,r),o=t.get(i);if(o==null)throw new fa(`No muxer configured for protocol "${i}"`);return e.log("selected %s as muxer \
protocol",i),o}catch(i){throw e.log.error("error multiplexing outbound connection - %e",i),new fa(String(i))}}async _multiplexInbound(e,t,r){
const s=Array.from(t.keys());e.log("inbound handling muxers %s",s);try{e.log.trace("selecting stream muxer from %s",s);const i=await th(
e,s,r),o=t.get(i);if(o==null)throw new fa(`No muxer configured for protocol "${i}"`);return e.log("selected %s as muxer \
protocol",i),o}catch(i){throw e.log.error("error multiplexing inbound connection - %e",i),i}}getConnectionEncrypters(){return this.
connectionEncrypters}getStreamMuxers(){return this.streamMuxers}}function gL(n){return n.skipEncryption===!0}const jw="3\
.5.1",Xw="js-libp2p";function mL(n,e){return`${n??Xw}/${e??jw} browser/${globalThis.navigator.userAgent}`}class Qw extends he{peerId;peerStore;contentRouting;peerRouting;metrics;services;logger;status;components;log;constructor(e){
super(),this.status="stopped";const t=new he,r=t.dispatchEvent.bind(t);t.dispatchEvent=l=>{const u=r(l),h=this.dispatchEvent(
new CustomEvent(l.type,{detail:l.detail}));return u||h},this.peerId=e.peerId,this.logger=e.logger??Lb(),this.log=this.logger.
forComponent("libp2p"),this.services={};const s=e.nodeInfo?.name??Xw,i=e.nodeInfo?.version??jw,o=this.components=k$({peerId:e.
peerId,privateKey:e.privateKey,nodeInfo:{name:s,version:i,userAgent:e.nodeInfo?.userAgent??mL(s,i)},logger:this.logger,events:t,
datastore:e.datastore??new l$,connectionGater:U$(e.connectionGater),dns:e.dns});e.metrics!=null&&(this.metrics=this.configureComponent(
"metrics",e.metrics(this.components))),this.peerStore=this.configureComponent("peerStore",r$(o,{addressFilter:this.components.
connectionGater.filterMultiaddrForPeer,...e.peerStore})),o.events.addEventListener("peer:update",l=>{if(l.detail.previous==
null){const u={id:l.detail.peer.id,multiaddrs:l.detail.peer.addresses.map(h=>h.multiaddr)};o.events.safeDispatchEvent("p\
eer:discovery",{detail:u})}}),e.connectionProtector!=null&&this.configureComponent("connectionProtector",e.connectionProtector(
o)),this.components.upgrader=new pL(this.components,{connectionEncrypters:(e.connectionEncrypters??[]).map((l,u)=>this.configureComponent(
`connection-encryption-${u}`,l(this.components))),streamMuxers:(e.streamMuxers??[]).map((l,u)=>this.configureComponent(`\
stream-muxers-${u}`,l(this.components))),inboundUpgradeTimeout:e.connectionManager?.inboundUpgradeTimeout,inboundStreamProtocolNegotiationTimeout:e.
connectionManager?.inboundStreamProtocolNegotiationTimeout,outboundStreamProtocolNegotiationTimeout:e.connectionManager?.
outboundStreamProtocolNegotiationTimeout,connectionCloseTimeout:e.connectionManager?.connectionCloseTimeout}),this.configureComponent(
"transportManager",new jk(this.components,e.transportManager)),this.configureComponent("connectionManager",new Fk(this.components,
e.connectionManager)),e.connectionMonitor?.enabled!==!1&&this.configureComponent("connectionMonitor",new qk(this.components,
e.connectionMonitor)),this.configureComponent("registrar",new Hk(this.components)),this.configureComponent("addressManag\
er",new b$(this.components,e.addresses));const a=(e.peerRouters??[]).map((l,u)=>this.configureComponent(`peer-router-${u}`,
l(this.components)));this.peerRouting=this.components.peerRouting=this.configureComponent("peerRouting",new Kk(this.components,
{routers:a}));const c=(e.contentRouters??[]).map((l,u)=>this.configureComponent(`content-router-${u}`,l(this.components)));
if(this.contentRouting=this.components.contentRouting=this.configureComponent("contentRouting",new Wk(this.components,{routers:c})),
this.configureComponent("randomWalk",new Gk(this.components)),(e.peerDiscovery??[]).forEach((l,u)=>{this.configureComponent(
`peer-discovery-${u}`,l(this.components)).addEventListener("peer",d=>{this.#e(d)})}),e.transports?.forEach((l,u)=>{this.
components.transportManager.add(this.configureComponent(`transport-${u}`,l(this.components)))}),e.services!=null)for(const l of Object.
keys(e.services)){const u=e.services[l],h=u(this.components);if(h==null){this.log.error("service factory %s returned nul\
l or undefined instance",l);continue}this.services[l]=h,this.configureComponent(l,h),h[Yd]!=null&&(this.log("registering\
 service %s for content routing",l),c.push(h[Yd])),h[Jd]!=null&&(this.log("registering service %s for peer routing",l),a.
push(h[Jd])),h[_a]!=null&&(this.log("registering service %s for peer discovery",l),h[_a].addEventListener?.("peer",d=>{this.#e(
d)}))}L$(o)}configureComponent(e,t){return t==null&&this.log.error("component %s was null or undefined",e),this.components[e]=
t,t}async start(){if(this.status==="stopped"){this.status="starting",this.log("libp2p is starting");try{await this.components.
beforeStart?.(),await this.components.start(),await this.components.afterStart?.(),this.status="started",this.safeDispatchEvent(
"start",{detail:this}),this.log("libp2p has started with peer id %p",this.peerId)}catch(e){throw this.log.error("an erro\
r occurred starting libp2p - %e",e),this.status="started",await this.stop(),e}}}async stop(){this.status==="started"&&(this.
log("libp2p is stopping"),this.status="stopping",await this.components.beforeStop?.(),await this.components.stop(),await this.
components.afterStop?.(),this.status="stopped",this.safeDispatchEvent("stop",{detail:this}),this.log("libp2p has stopped"))}getConnections(e){
return this.components.connectionManager.getConnections(e)}getDialQueue(){return this.components.connectionManager.getDialQueue()}getPeers(){
const e=new lr;for(const t of this.components.connectionManager.getConnections())e.add(t.remotePeer);return Array.from(e)}async dial(e,t={}){
return this.components.connectionManager.openConnection(e,{priority:75,...t})}async dialProtocol(e,t,r={}){if(t==null)throw new L(
"no protocols were provided to open a stream");if(t=Array.isArray(t)?t:[t],t.length===0)throw new L("no protocols were p\
rovided to open a stream");return this.components.connectionManager.openStream(e,t,r)}getMultiaddrs(){return this.components.
addressManager.getAddresses()}getProtocols(){return this.components.registrar.getProtocols()}async hangUp(e,t={}){Mh(e)&&
(e=te(e.getComponents().findLast(r=>r.code===B)?.value??"")),await this.components.connectionManager.closeConnections(e,
t)}async getPublicKey(e,t={}){if(this.log("getPublicKey %p",e),e.publicKey!=null)return e.publicKey;try{const o=await this.
peerStore.get(e,t);if(o.id.publicKey!=null)return o.id.publicKey}catch(o){if(o.name!=="NotFoundError")throw o}const r=Pu(
[On("/pk/"),e.toMultihash().bytes]),s=await this.contentRouting.get(r,t),i=await SC(e,s,t);return await this.peerStore.patch(
e,{publicKey:i},t),i}async handle(e,t,r){Array.isArray(e)||(e=[e]),await Promise.all(e.map(async s=>{await this.components.
registrar.handle(s,t,r)}))}async unhandle(e,t){Array.isArray(e)||(e=[e]),await Promise.all(e.map(async r=>{await this.components.
registrar.unhandle(r,t)}))}async register(e,t,r){return this.components.registrar.register(e,t,r)}unregister(e){this.components.
registrar.unregister(e)}use(e,t){if(typeof e=="function"){this.components.registrar.use(e);return}if(t==null)throw new L(
"Protocol middleware is required");this.components.registrar.use(e,Array.isArray(t)?t:[t])}unuse(e){if(typeof e=="functi\
on"){this.components.registrar.unuse(e);return}this.components.registrar.unuse(e)}async isDialable(e,t={}){return this.components.
connectionManager.isDialable(e,t)}#e(e){const{detail:t}=e;if(t.id.toString()===this.peerId.toString()){this.log.error("p\
eer discovery mechanism discovered self");return}this.components.peerStore.merge(t.id,{multiaddrs:t.multiaddrs}).catch(r=>{
this.log.error("could not update multiaddrs of discovered peer - %e",r)})}}async function bL(n={}){n.privateKey??=await wC();
const e=new Qw({...await AC(n),peerId:Zm(n.privateKey)});return n.start!==!1&&await e.start(),e}const yL=["dial","dialPr\
otocol","hangUp","handle","unhandle","getMultiaddrs","getProtocols"];function qV(n){return n==null?!1:n instanceof Qw?!0:
yL.every(e=>typeof n[e]=="function")}const wL=[_n,Km,Om,Bm,zm];function Op(n){return Yw("sni",n)?.value}function Bp(n){const e=Yw(
"tcp",n)?.value;return e==null?"":`:${e}`}function Yw(n,e){return e.find(t=>t.name===n)}function zp(n){return n.some(({code:e})=>e===
ts)}function At(n,e){const t=Jw[n.name];if(t==null)throw new Error(`Can't interpret protocol ${n.name}`);const r=t(n,e);
return n.code===as?`[${r}]`:r}const Jw={ip4:(n,e)=>n.value,ip6:(n,e)=>e.length===0?n.value:`[${n.value}]`,tcp:(n,e)=>{const t=e.
pop();if(t==null)throw new Error("Unexpected end of multiaddr");return`tcp://${At(t,e)}:${n.value}`},udp:(n,e)=>{const t=e.
pop();if(t==null)throw new Error("Unexpected end of multiaddr");return`udp://${At(t,e)}:${n.value}`},dnsaddr:(n,e)=>n.value,
dns4:(n,e)=>n.value,dns6:(n,e)=>n.value,dns:(n,e)=>n.value,ipfs:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unex\
pected end of multiaddr");return`${At(t,e)}`},p2p:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of \
multiaddr");return`${At(t,e)}`},http:(n,e)=>{const t=zp(e),r=Op(e),s=Bp(e);if(t&&r!=null)return`https://${r}${s}`;const i=t?
"https://":"http://",o=e.pop();if(o==null)throw new Error("Unexpected end of multiaddr");let a=At(o,e);return a=a?.replace(
"tcp://",""),`${i}${a}`},"http-path":(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");const r=At(
t,e),s=decodeURIComponent(n.value??"");return`${r}${s}`},tls:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpec\
ted end of multiaddr");return At(t,e)},sni:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiad\
dr");return At(t,e)},https:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");let r=At(t,
e);return r=r?.replace("tcp://",""),`https://${r}`},ws:(n,e)=>{const t=zp(e),r=Op(e),s=Bp(e);if(t&&r!=null)return`wss://${r}${s}`;
const i=t?"wss://":"ws://",o=e.pop();if(o==null)throw new Error("Unexpected end of multiaddr");let a=At(o,e);return a=a?.
replace("tcp://",""),`${i}${a}`},wss:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");let r=At(
t,e);return r=r?.replace("tcp://",""),`wss://${r}`}};function vL(n,e){const r=O(n).getComponents(),s=r.pop();if(s==null)
throw new Error("Unexpected end of multiaddr");const i=Jw[s.name];if(i==null)throw new Error(`No interpreter found for ${s.
name}`);let o=i(s,r)??"";return wL.includes(s.code)&&(o=o.replace(/^.*:\/\//,""),s.value==="443"?o=`https://${o}`:o=`htt\
p://${o}`),(o.startsWith("http://")||o.startsWith("https://")||o.startsWith("ws://")||o.startsWith("wss://"))&&(o=new URL(
o).toString(),o.endsWith("/")&&(o=o.substring(0,o.length-1))),o}let SL=class Zw extends Error{name="TimeoutError";constructor(e,t){
super(e,t),Error.captureStackTrace?.(this,Zw)}};const AL=n=>"reason"in n?n.reason:new DOMException("This operation was a\
borted.","AbortError"),_L=2**31-1,EL=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(`Expected \`mil\
liseconds\` to be a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!="functi\
on")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function CL(n,e){
const{milliseconds:t,fallback:r,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
n.cancel?.()}catch{}},h=new Promise((d,p)=>{const v=()=>{p(AL(o)),l()},g=EL(t,i);try{g?p(g):o?.aborted?v():o&&(c=v,o.addEventListener(
"abort",c,{once:!0}))}finally{n.then(d,p)}if(g||o?.aborted||t>_L)return;const E=r||s===!1||s instanceof Error?void 0:new SL(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{d(r())}catch(f){p(f)}else s===!1?
d():p(s instanceof Error?s:E);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const e0=n=>typeof n=="function"?{filter:n}:
{...n},xL=n=>n===1/0||Number.isSafeInteger(n)&&n>=0,IL=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],ML=n=>{for(const[e,t]of IL){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="functi\
on")return{addListener:r.bind(n),removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},PL=n=>{const e=new Map;
for(const[t,r]of n)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},TL=({addListener:n,removeListener:e,
handlers:t,signal:r,abortHandler:s,isDone:i})=>{r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){
e(o,a);return}},DL=({removeListener:n,handlers:e,signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener(
"abort",r)},$L=(n,e,t)=>{let r=Promise.resolve();return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function kL(n,e,t){let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=e0(t);const{
filter:l}=t;if(!xL(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=ML(n);if(t.count===0){a([]);return}const d=[],p=m=>{
r(),c(m)},v=$L(l,()=>s,p),g=m=>{d.push(m),t.count===d.length&&(r(),a(d))},E=(...m)=>{if(s)return;const y=t.multiArgs?m:m[0];
if(!l){g(y);return}v(y,A=>{A&&g(y)})},f=(...m)=>{p(t.rejectionMultiArgs?m:m[0])},b=()=>{p(t.signal.reason)},_={addListener:u,
removeListener:h,handlers:PL([[e,E],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:b,isDone:()=>s};r=()=>{
s=!0,clearTimeout(i),DL(_)},TL(_),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
r,t.timeout)),a(d))});if(o.cancel=r,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=CL(o,{milliseconds:t.
timeout});return a.cancel=()=>{r(),a.clear()},a}return o}function LL(n,e,t){const r=kL(n,e,{...e0(t),count:1,resolveImmediately:!1}),
s=r.then(i=>i[0]);return s.cancel=r.cancel,s}function RL(){throw new Error("WebSocket Servers can not be created in the \
browser!")}function NL(n=0){return new Uint8Array(n)}function nh(n){if(n instanceof Uint8Array&&n.constructor.name==="Ui\
nt8Array")return qp(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return qp(new Uint8Array(
n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function FL(n){const e=new Uint8Array(
n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Vp=4096;function UL(n){const e=n.length;if(e<=Vp)
return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.subarray(r,r+=Vp));
return t}function OL(n){return n?.buffer instanceof ArrayBuffer}function qp(n){return OL(n)?n:n.slice()}function BL(n,e,t){
if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<
n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambiguous");if(r[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),
d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===0;)m++,
b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>
0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;for(var M=h.
repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.length-b)*d+
1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&x!==-1;x--,S++)
w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){for(var C=y-m;C!==
y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var zL=BL,VL=zL;let qL=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},WL=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return t0(this,e)}},
KL=class{decoders;constructor(e){this.decoders=e}or(e){return t0(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function t0(n,e){return new KL({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let GL=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new qL(e,t,r),this.decoder=new WL(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Uc({name:n,prefix:e,encode:t,decode:r}){return new GL(n,e,t,
r)}function oo({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=VL(t,n,r);return Uc({prefix:e,
name:n,encode:s,decode:o=>nh(i(o))})}function HL(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function jL(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function XL(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ve({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=XL(r,s);return Uc(
{prefix:e,name:n,encode(o){return jL(o,r,t)},decode(o){return HL(o,i,t,n)}})}const QL=oo({prefix:"9",name:"base10",alphabet:"\
0123456789"}),YL=Object.freeze(Object.defineProperty({__proto__:null,base10:QL},Symbol.toStringTag,{value:"Module"})),JL=ve(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),ZL=ve({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),e6=Object.freeze(Object.defineProperty({__proto__:null,
base16:JL,base16upper:ZL},Symbol.toStringTag,{value:"Module"})),t6=ve({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
n6=Object.freeze(Object.defineProperty({__proto__:null,base2:t6},Symbol.toStringTag,{value:"Module"})),n0=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),r6=n0.reduce((n,e,t)=>(n[t]=e,n),[]),s6=n0.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function i6(n){return n.reduce((e,t)=>(e+=r6[t],e),"")}function o6(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=s6[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const a6=Uc({prefix:"🚀",name:"\
base256emoji",encode:i6,decode:o6}),c6=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:a6},Symbol.toStringTag,
{value:"Module"})),l6=ve({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
u6=ve({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),h6=ve(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),d6=ve({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),f6=ve({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),p6=ve({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),g6=ve({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),m6=ve({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),b6=ve({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),y6=Object.freeze(Object.defineProperty({__proto__:null,
base32:l6,base32hex:f6,base32hexpad:g6,base32hexpadupper:m6,base32hexupper:p6,base32pad:h6,base32padupper:d6,base32upper:u6,
base32z:b6},Symbol.toStringTag,{value:"Module"})),w6=oo({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),v6=oo({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
S6=Object.freeze(Object.defineProperty({__proto__:null,base36:w6,base36upper:v6},Symbol.toStringTag,{value:"Module"})),A6=oo(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),_6=oo({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),E6=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:A6,base58flickr:_6},Symbol.toStringTag,{value:"Module"})),C6=ve({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),x6=ve({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),I6=ve({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),M6=ve({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),P6=Object.freeze(Object.defineProperty(
{__proto__:null,base64:C6,base64pad:x6,base64url:I6,base64urlpad:M6},Symbol.toStringTag,{value:"Module"})),T6=ve({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),D6=Object.freeze(Object.defineProperty({__proto__:null,base8:T6},Symbol.
toStringTag,{value:"Module"})),$6=Uc({prefix:"\0",name:"identity",encode:n=>UL(nh(n)),decode:n=>nh(FL(n))}),k6=Object.freeze(
Object.defineProperty({__proto__:null,identity:$6},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Wp={...k6,...n6,...D6,...YL,...e6,...y6,...S6,...E6,...P6,...c6};function r0(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const Kp=r0("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Ll=r0("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=NL(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),L6={utf8:Kp,"utf-8":Kp,
hex:Wp.base16,latin1:Ll,ascii:Ll,binary:Ll,...Wp};function R6(n,e="utf8"){const t=L6[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function N6(n){return n.buffer instanceof ArrayBuffer}
function F6(n){return N6(n)?n:n.slice()}const U6=1024*1024*4,O6=10;class B6 extends qh{websocket;maxBufferedAmount;checkBufferedAmountTask;constructor(e){
super(e),this.websocket=e.websocket,this.maxBufferedAmount=e.maxBufferedAmount??U6,this.checkBufferedAmountTask=Nb(this.
checkBufferedAmount.bind(this),e.bufferedAmountPollInterval??O6),this.websocket.addEventListener("close",t=>{if(this.log(
'closed - code %d, reason "%s", wasClean %s',t.code,t.reason,t.wasClean),this.checkBufferedAmountTask.stop(),!t.wasClean){
this.onRemoteReset();return}this.onTransportClosed()},{once:!0}),this.websocket.addEventListener("message",t=>{try{let r;
if(typeof t.data=="string")r=R6(t.data);else if(t.data instanceof ArrayBuffer)r=new Uint8Array(t.data,0,t.data.byteLength);else{
this.abort(new Error("Incorrect binary type"));return}this.onData(r)}catch(r){this.log.error("error receiving data - %e",
r)}})}sendData(e){for(const r of e)this.websocket.send(F6(r));const t=this.websocket.bufferedAmount<this.maxBufferedAmount;
return t||this.checkBufferedAmountTask.start(),{sentBytes:e.byteLength,canSendMore:t}}sendReset(){this.websocket.close(1006)}async sendClose(e){
this.websocket.close(),e?.signal?.throwIfAborted()}sendPause(){}sendResume(){}checkBufferedAmount(){this.log("buffered a\
mount now %d",this.websocket.bufferedAmount),this.websocket.bufferedAmount===0&&(this.checkBufferedAmountTask.stop(),this.
safeDispatchEvent("drain"))}}function z6(n){return new B6(n)}class V6{log;init;logger;metrics;components;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:websockets"),this.logger=e.logger,this.components=e,this.init=t,e.metrics!=null&&
(this.metrics={dialerEvents:e.metrics.registerCounterGroup("libp2p_websockets_dialer_events_total",{label:"event",help:"\
Total count of WebSockets dialer events by type"})})}[$h]=!0;[Symbol.toStringTag]="@libp2p/websockets";[st]=["@libp2p/tr\
ansport"];async dial(e,t){this.log("dialing %s",e),t=t??{};const r=z6({websocket:await this._connect(e,t),remoteAddr:e,metrics:this.
metrics?.dialerEvents,direction:"outbound",log:this.components.logger.forComponent("libp2p:websockets:connection"),maxBufferedAmount:this.
init.maxBufferedAmount,bufferedAmountPollInterval:this.init.bufferedAmountPollInterval});this.log("new outbound connecti\
on %s",r.remoteAddr);const s=await t.upgrader.upgradeOutbound(r,t);return this.log("outbound connection %s upgraded",r.remoteAddr),
s}async _connect(e,t){t?.signal?.throwIfAborted();const r=vL(e);this.log("create websocket connection to %s",r);const s=new WebSocket(
r);s.binaryType="arraybuffer";try{t.onProgress?.(new q("websockets:open-connection")),await LL(s,"open",t)}catch(i){if(t.
signal?.aborted)throw this.metrics?.dialerEvents.increment({abort:!0}),new eb(`Could not connect to ${r}`);this.metrics?.
dialerEvents.increment({error:!0});try{s.close()}catch{}throw i}return this.log("connected %s",e),this.metrics?.dialerEvents.
increment({connect:!0}),s}createListener(e){return RL({logger:this.logger,events:this.components.events,metrics:this.components.
metrics},{...this.init,...e})}listenFilter(e){return e.filter(t=>xi.exactMatch(t)||xa.exactMatch(t))}dialFilter(e){return this.
listenFilter(e)}}function q6(n={}){return e=>new V6(e,n)}function dn(n=0){return new Uint8Array(n)}function nn(n=0){return new Uint8Array(
n)}const W6=Math.pow(2,7),K6=Math.pow(2,14),G6=Math.pow(2,21),dd=Math.pow(2,28),fd=Math.pow(2,35),pd=Math.pow(2,42),gd=Math.
pow(2,49),j=128,Te=127;function Mt(n){if(n<W6)return 1;if(n<K6)return 2;if(n<G6)return 3;if(n<dd)return 4;if(n<fd)return 5;
if(n<pd)return 6;if(n<gd)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Coul\
d not encode varint");return 8}function s0(n,e,t=0){switch(Mt(n)){case 8:e[t++]=n&255|j,n/=128;case 7:e[t++]=n&255|j,n/=
128;case 6:e[t++]=n&255|j,n/=128;case 5:e[t++]=n&255|j,n/=128;case 4:e[t++]=n&255|j,n>>>=7;case 3:e[t++]=n&255|j,n>>>=7;case 2:
e[t++]=n&255|j,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function H6(n,e,t=0){
switch(Mt(n)){case 8:e.set(t++,n&255|j),n/=128;case 7:e.set(t++,n&255|j),n/=128;case 6:e.set(t++,n&255|j),n/=128;case 5:
e.set(t++,n&255|j),n/=128;case 4:e.set(t++,n&255|j),n>>>=7;case 3:e.set(t++,n&255|j),n>>>=7;case 2:e.set(t++,n&255|j),n>>>=
7;case 1:{e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}function i0(n,e){let t=n[e],r=0;
if(r+=t&Te,t<j||(t=n[e+1],r+=(t&Te)<<7,t<j)||(t=n[e+2],r+=(t&Te)<<14,t<j)||(t=n[e+3],r+=(t&Te)<<21,t<j)||(t=n[e+4],r+=(t&
Te)*dd,t<j)||(t=n[e+5],r+=(t&Te)*fd,t<j)||(t=n[e+6],r+=(t&Te)*pd,t<j)||(t=n[e+7],r+=(t&Te)*gd,t<j))return r;throw new RangeError(
"Could not decode varint")}function j6(n,e){let t=n.get(e),r=0;if(r+=t&Te,t<j||(t=n.get(e+1),r+=(t&Te)<<7,t<j)||(t=n.get(
e+2),r+=(t&Te)<<14,t<j)||(t=n.get(e+3),r+=(t&Te)<<21,t<j)||(t=n.get(e+4),r+=(t&Te)*dd,t<j)||(t=n.get(e+5),r+=(t&Te)*fd,t<
j)||(t=n.get(e+6),r+=(t&Te)*pd,t<j)||(t=n.get(e+7),r+=(t&Te)*gd,t<j))return r;throw new RangeError("Could not decode var\
int")}function X6(n,e,t=0){return e==null&&(e=nn(Mt(n))),e instanceof Uint8Array?s0(n,e,t):H6(n,e,t)}function Q6(n,e=0){
return n instanceof Uint8Array?i0(n,e):j6(n,e)}function Y6(n){return n.buffer instanceof ArrayBuffer}function o0(n){return Y6(
n)?n:n.slice()}const md=new Float32Array([-0]),Mn=new Uint8Array(md.buffer);function J6(n,e,t){md[0]=n,e[t]=Mn[0],e[t+1]=
Mn[1],e[t+2]=Mn[2],e[t+3]=Mn[3]}function Z6(n,e){return Mn[0]=n[e],Mn[1]=n[e+1],Mn[2]=n[e+2],Mn[3]=n[e+3],md[0]}const bd=new Float64Array(
[-0]),De=new Uint8Array(bd.buffer);function eR(n,e,t){bd[0]=n,e[t]=De[0],e[t+1]=De[1],e[t+2]=De[2],e[t+3]=De[3],e[t+4]=De[4],
e[t+5]=De[5],e[t+6]=De[6],e[t+7]=De[7]}function tR(n,e){return De[0]=n[e],De[1]=n[e+1],De[2]=n[e+2],De[3]=n[e+3],De[4]=n[e+
4],De[5]=n[e+5],De[6]=n[e+6],De[7]=n[e+7],bd[0]}const nR=BigInt(Number.MAX_SAFE_INTEGER),rR=BigInt(Number.MIN_SAFE_INTEGER);
let Ht=class jn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>
0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(
this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>
0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(
e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,
this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){
const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?
t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===0n)return mr;if(e<nR&&e>rR)return this.fromNumber(Number(
e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>Gp&&(s=0n,++r>Gp&&(r=0n))),new jn(Number(
s),Number(r))}static fromNumber(e){if(e===0)return mr;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&
(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),new jn(r,s)}static from(e){return typeof e=="number"?jn.
fromNumber(e):typeof e=="bigint"?jn.fromBigInt(e):typeof e=="string"?jn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?
new jn(e.low>>>0,e.high>>>0):mr}};const mr=new Ht(0,0);mr.toBigInt=function(){return 0n};mr.zzEncode=mr.zzDecode=function(){
return this};mr.length=function(){return 1};const Gp=4294967296n;function sR(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=
n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function iR(n,e,t){
if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>
239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=
(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>
0&&s.push(String.fromCharCode.apply(String,i.slice(0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function a0(n,e,t){
const r=t;let s,i;for(let o=0;o<n.length;++o)s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&
64512)===55296&&((i=n.charCodeAt(o+1))&64512)===56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&
63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function _t(n,e){
return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function Do(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<
16|n[e-1]<<24)>>>0}let oR=class{buf;pos;len;_slice=Uint8Array.prototype.subarray;constructor(e){this.buf=o0(e),this.pos=
0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.
pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))
return e;if((this.pos+=5)>this.len)throw this.pos=this.len,_t(this,10);return e}int32(){return this.uint32()|0}sint32(){
const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw _t(this,
4);return Do(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw _t(this,4);return Do(this.buf,this.pos+=4)|0}float(){
if(this.pos+4>this.len)throw _t(this,4);const e=Z6(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)
throw _t(this,4);const e=tR(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,r=this.pos+
e;if(r>this.len)throw _t(this,e);return this.pos+=e,t===r?new Uint8Array(0):this.buf.subarray(t,r)}string(){const e=this.
bytes();return iR(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw _t(this,e);this.pos+=e}else do
if(this.pos>=this.len)throw _t(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.
skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(
e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){
const e=new Ht(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.
pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.
pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw _t(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<
t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>
4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){
if(this.pos>=this.len)throw _t(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}
throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw _t(this,8);const e=Do(this.buf,this.pos+=
4),t=Do(this.buf,this.pos+=4);return new Ht(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.
readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().
toBigInt(!0)}uint64Number(){const e=i0(this.buf,this.pos);return this.pos+=Mt(e),e}uint64String(){return this.readLongVarint().
toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().
toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){
return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().
toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}};
function c0(n){return new oR(n instanceof Uint8Array?n:n.subarray())}function l0(n,e,t){const r=c0(n);return e.decode(r,
void 0,t)}function rh(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return jp(n);if(n instanceof ArrayBuffer)
return new Uint8Array(n);if(ArrayBuffer.isView(n))return jp(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error(
"Unknown type, must be binary type")}function aR(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(
t);return e}const Hp=4096;function cR(n){const e=n.length;if(e<=Hp)return String.fromCharCode.apply(String,n);let t="",r=0;
for(;r<e;)t+=String.fromCharCode.apply(String,n.subarray(r,r+=Hp));return t}function lR(n){return n?.buffer instanceof ArrayBuffer}
function jp(n){return lR(n)?n:n.slice()}function uR(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(
256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,
m=0,y=f.length;m!==y&&f[m]===0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==
0||x<_)&&C!==-1;C--,x++)S+=256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-
_;I!==A&&w[I]===0;)I++;for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var hR=uR,dR=hR;let fR=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},pR=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return u0(this,e)}},
gR=class{decoders;constructor(e){this.decoders=e}or(e){return u0(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function u0(n,e){return new gR({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let mR=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new fR(e,t,r),this.decoder=new pR(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Oc({name:n,prefix:e,encode:t,decode:r}){return new mR(n,e,t,
r)}function ao({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=dR(t,n,r);return Oc({prefix:e,
name:n,encode:s,decode:o=>rh(i(o))})}function bR(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function yR(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function wR(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function Se({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=wR(r,s);return Oc(
{prefix:e,name:n,encode(o){return yR(o,r,t)},decode(o){return bR(o,i,t,n)}})}const vR=ao({prefix:"9",name:"base10",alphabet:"\
0123456789"}),SR=Object.freeze(Object.defineProperty({__proto__:null,base10:vR},Symbol.toStringTag,{value:"Module"})),AR=Se(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),_R=Se({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),ER=Object.freeze(Object.defineProperty({__proto__:null,
base16:AR,base16upper:_R},Symbol.toStringTag,{value:"Module"})),CR=Se({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
xR=Object.freeze(Object.defineProperty({__proto__:null,base2:CR},Symbol.toStringTag,{value:"Module"})),h0=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),IR=h0.reduce((n,e,t)=>(n[t]=e,n),[]),MR=h0.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function PR(n){return n.reduce((e,t)=>(e+=IR[t],e),"")}function TR(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=MR[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const DR=Oc({prefix:"🚀",name:"\
base256emoji",encode:PR,decode:TR}),$R=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:DR},Symbol.toStringTag,
{value:"Module"})),kR=Se({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
LR=Se({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),RR=Se(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),NR=Se({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),FR=Se({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),UR=Se({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),OR=Se({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),BR=Se({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),zR=Se({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),VR=Object.freeze(Object.defineProperty({__proto__:null,
base32:kR,base32hex:FR,base32hexpad:OR,base32hexpadupper:BR,base32hexupper:UR,base32pad:RR,base32padupper:NR,base32upper:LR,
base32z:zR},Symbol.toStringTag,{value:"Module"})),qR=ao({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),WR=ao({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
KR=Object.freeze(Object.defineProperty({__proto__:null,base36:qR,base36upper:WR},Symbol.toStringTag,{value:"Module"})),GR=ao(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),HR=ao({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),jR=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:GR,base58flickr:HR},Symbol.toStringTag,{value:"Module"})),XR=Se({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),QR=Se({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),YR=Se({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),JR=Se({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ZR=Object.freeze(Object.defineProperty(
{__proto__:null,base64:XR,base64pad:QR,base64url:YR,base64urlpad:JR},Symbol.toStringTag,{value:"Module"})),e8=Se({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),t8=Object.freeze(Object.defineProperty({__proto__:null,base8:e8},Symbol.
toStringTag,{value:"Module"})),n8=Oc({prefix:"\0",name:"identity",encode:n=>cR(rh(n)),decode:n=>rh(aR(n))}),r8=Object.freeze(
Object.defineProperty({__proto__:null,identity:n8},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Xp={...r8,...xR,...t8,...SR,...ER,...VR,...KR,...jR,...ZR,...$R};function d0(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const Qp=d0("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Rl=d0("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=nn(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),s8={utf8:Qp,"utf-8":Qp,
hex:Xp.base16,latin1:Rl,ascii:Rl,binary:Rl,...Xp};function i8(n,e="utf8"){const t=s8[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function o8(n){let r,s=8192;return function(o){if(o<
1||o>4096)return nn(o);s+o>8192&&(r=nn(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Ys=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function Nl(){}let a8=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const c8=o8();function l8(n){return globalThis.Buffer!=null?
nn(n):c8(n)}let sh=class{len;head;tail;states;constructor(){this.len=0,this.head=new Ys(Nl,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Ys(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new h8((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
$o,10,Ht.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Ht.fromBigInt(e);
return this._push($o,t.length(),t)}uint64Number(e){return this._push(s0,Mt(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Ht.fromBigInt(e).zzEncode();return this._push($o,t.length(),t)}sint64Number(e){const t=Ht.fromNumber(e).zzEncode();
return this._push($o,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Fl,1,e?1:0)}fixed32(e){
return this._push(Bs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Ht.fromBigInt(e);return this._push(Bs,
4,t.lo)._push(Bs,4,t.hi)}fixed64Number(e){const t=Ht.fromNumber(e);return this._push(Bs,4,t.lo)._push(Bs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(J6,4,e)}double(e){return this._push(eR,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Fl,1,0):this.uint32(t)._push(d8,t,e)}string(e){const t=sR(e);return t!==0?this.uint32(t)._push(
a0,t,e):this._push(Fl,1,0)}fork(){return this.states=new a8(this),this.head=this.tail=new Ys(Nl,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Ys(Nl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=l8(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function Fl(n,e,t){e[t]=n&255}function u8(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let h8=class extends Ys{next;constructor(e,t){super(u8,e,t),this.next=void 0}};
function $o(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Bs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function d8(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(sh.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(f8,e,n),this},sh.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(p8,e,n),this});function f8(n,e,t){e.set(n,t)}function p8(n,e,t){n.length<40?a0(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(i8(n),t)}function g8(){return new sh}function f0(n,e){const t=g8();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*p0(n,e,t){const r=c0(n);yield*e.stream(r,void 0,".",t)}const g0={VARINT:0,LENGTH_DELIMITED:2};function m0(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function b0(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return m0("enum",g0.VARINT,t,r,s)}function y0(n,e,t){return m0("message",g0.LENGTH_DELIMITED,n,e,
t)}var Qe;(function(n){(function(o){o.FIN="FIN",o.STOP_SENDING="STOP_SENDING",o.RESET="RESET",o.FIN_ACK="FIN_ACK"})(n.Flag||
(n.Flag={}));let e;(function(o){o[o.FIN=0]="FIN",o[o.STOP_SENDING=1]="STOP_SENDING",o[o.RESET=2]="RESET",o[o.FIN_ACK=3]=
"FIN_ACK"})(e||(e={})),(function(o){o.codec=()=>b0(e)})(n.Flag||(n.Flag={}));let t;n.codec=()=>(t==null&&(t=y0((o,a,c={})=>{
c.lengthDelimited!==!1&&a.fork(),o.flag!=null&&(a.uint32(8),n.Flag.codec().encode(o.flag,a)),o.message!=null&&(a.uint32(
18),a.bytes(o.message)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){
const h=o.uint32();switch(h>>>3){case 1:{l.flag=n.Flag.codec().decode(o);break}case 2:{l.message=o.bytes();break}default:{
o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();
switch(h>>>3){case 1:{yield{field:`${c}.flag`,value:n.Flag.codec().decode(o)};break}case 2:{yield{field:`${c}.message`,value:o.
bytes()};break}default:{o.skipType(h&7);break}}}})),t);function r(o){return f0(o,n.codec())}n.encode=r;function s(o,a){return l0(
o,n.codec(),a)}n.decode=s;function i(o,a){return p0(o,n.codec(),a)}n.stream=i})(Qe||(Qe={}));const m8=["stun:stun.l.goog\
le.com:19302","stun:global.stun.twilio.com:3478","stun:stun.cloudflare.com:3478","stun:stun.services.mozilla.com:3478"];
Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");const b8=2*1024*1024,yd=16*1024,y8=yd,w8=10,
v8=8;function S8(n=yd){const e=Mt(n-Mt(n)),t=1+Mt(Object.keys(Qe.Flag).length-1),r=1,s=n-e-t-r,i=Mt(s);return e+t+r+i}const A8=S8(),
_8=1e4,w0="/webrtc",ih="/webrtc-signaling/0.0.1";function E8(n){return n?.buffer instanceof ArrayBuffer}function C8(n){if(E8(
n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Yp(n,e){e==null&&(e=n.reduce((s,i)=>s+
i.length,0));const t=nn(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return C8(t)}function x8(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const v0=Symbol.
for("@achingbrain/uint8arraylist");function Jp(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function ko(n){return!!n?.[v0]}let wd=class ga{bufs;length;[v0]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>
0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(
e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(ko(r)){t+=
r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array\
 or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(ko(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Jp(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=Jp(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(ko(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Yp(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:Yp(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new ga;return i.
length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(
o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!ko(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=nn(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=dn(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=dn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=nn(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=dn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=dn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=dn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ga)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!x8(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new ga;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const I8=8,vd=1024*1024*4;let M8=class extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"},S0=class extends Error{name="InvalidDataLengthError";code="ERR\
_MSG_DATA_TOO_LONG"},P8=class extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"},Zp=class extends Error{name="\
UnexpectedEOFError";code="ERR_UNEXPECTED_EOF"};function A0(n){return n[Symbol.asyncIterator]!=null}function _0(n,e){if(n.
byteLength>e)throw new S0("Message length too long")}const Bc=n=>{const e=Mt(n),t=nn(e);return X6(n,t),Bc.bytes=e,t};Bc.
bytes=0;function oh(n,e){e=e??{};const t=e.lengthEncoder??Bc,r=e?.maxDataLength??vd;function*s(i){_0(i,r);const o=t(i.byteLength);
o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:yield*i}return A0(n)?(async function*(){for await(const i of n)
yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}oh.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??Bc,r=e?.maxDataLength??
vd;return _0(n,r),new wd(t(n.byteLength),n)};var Jn;(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=1]="DATA"})(Jn||(Jn={}));
const Sd=n=>{const e=Q6(n);return Sd.bytes=Mt(e),e};Sd.bytes=0;function ah(n,e){const t=new wd;let r=Jn.LENGTH,s=-1;const i=e?.
lengthDecoder??Sd,o=e?.maxLengthLength??I8,a=e?.maxDataLength??vd;function*c(){for(;t.byteLength>0;){if(r===Jn.LENGTH)try{
if(s=i(t),s<0)throw new M8("Invalid message length");if(s>a)throw new S0("Message length too long");const l=i.bytes;t.consume(
l),e?.onLength!=null&&e.onLength(s),r=Jn.DATA}catch(l){if(l instanceof RangeError){if(t.byteLength>o)throw new P8("Messa\
ge length length too long");break}throw l}if(r===Jn.DATA){if(t.byteLength<s)break;const l=t.sublist(0,s);t.consume(s),e?.
onData!=null&&e.onData(l),yield l,r=Jn.LENGTH}}}return A0(n)?(async function*(){for await(const l of n)t.append(l),yield*c();
if(t.byteLength>0)throw new Zp("Unexpected end of input")})():(function*(){for(const l of n)t.append(l),yield*c();if(t.byteLength>
0)throw new Zp("Unexpected end of input")})()}ah.fromReader=(n,e)=>{let t=1;const r=(async function*(){for(;;)try{const{
done:i,value:o}=await n.next(t);if(i===!0)return;o!=null&&(yield o)}catch(i){if(i.code==="ERR_UNDER_READ")return{done:!0,
value:null};throw i}finally{t=1}})();return ah(r,{...e??{},onLength:i=>{t=i}})};let T8=class extends Error{constructor(e){
super(e),this.name="TimeoutError"}};class D8 extends Error{constructor(e){super(),this.name="AbortError",this.message=e}}
const eg=n=>globalThis.DOMException===void 0?new D8(n):new DOMException(n),tg=n=>{const e=n.reason===void 0?eg("This ope\
ration was aborted."):n.reason;return e instanceof Error?e:eg(e)};function $8(n,e){const{milliseconds:t,fallback:r,message:s,
customTimers:i={setTimeout,clearTimeout}}=e;let o,a;const l=new Promise((u,h)=>{if(typeof t!="number"||Math.sign(t)!==1)
throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(e.signal){const{signal:p}=e;p.
aborted&&h(tg(p)),a=()=>{h(tg(p))},p.addEventListener("abort",a,{once:!0})}if(t===Number.POSITIVE_INFINITY){n.then(u,h);
return}const d=new T8;o=i.setTimeout.call(void 0,()=>{if(r){try{u(r())}catch(p){h(p)}return}typeof n.cancel=="function"&&
n.cancel(),s===!1?u():s instanceof Error?h(s):(d.message=s??`Promise timed out after ${t} milliseconds`,h(d))},t),(async()=>{
try{u(await n)}catch(p){h(p)}})()}).finally(()=>{l.clear(),a&&e.signal&&e.signal.removeEventListener("abort",a)});return l.
clear=()=>{i.clearTimeout.call(void 0,o),o=void 0},l}const k8=n=>{const e=n.addEventListener||n.on||n.addListener,t=n.removeEventListener||
n.off||n.removeListener;if(!e||!t)throw new TypeError("Emitter is not compatible");return{addListener:e.bind(n),removeListener:t.
bind(n)}};function L8(n,e,t){let r;const s=new Promise((i,o)=>{if(t={rejectionEvents:["error"],multiArgs:!1,rejectionMultiArgs:!1,
resolveImmediately:!1,...t},!(t.count>=0&&(t.count===Number.POSITIVE_INFINITY||Number.isInteger(t.count))))throw new TypeError(
"The `count` option should be at least 0 or more");t.signal?.throwIfAborted();const a=[e].flat(),c=[],{addListener:l,removeListener:u}=k8(
n),h=async(...p)=>{const v=t.multiArgs?p:p[0];if(t.filter)try{if(!await t.filter(v))return}catch(g){r(),o(g);return}c.push(
v),t.count===c.length&&(r(),i(c))},d=(...p)=>{r(),o(t.rejectionMultiArgs?p:p[0])};r=()=>{for(const p of a)u(p,h);for(const p of t.
rejectionEvents)a.includes(p)||u(p,d)};for(const p of a)l(p,h);for(const p of t.rejectionEvents)a.includes(p)||l(p,d);t.
signal&&t.signal.addEventListener("abort",()=>{d(t.signal.reason)},{once:!0}),t.resolveImmediately&&i(c)});if(s.cancel=r,
typeof t.timeout=="number"){const i=$8(s,{milliseconds:t.timeout});return i.cancel=()=>{r(),i.clear()},i}return s}function di(n,e,t){
typeof t=="function"&&(t={filter:t}),t={...t,count:1,resolveImmediately:!1};const r=L8(n,e,t),s=r.then(i=>i[0]);return s.
cancel=r.cancel,s}class R8 extends Mb{channel;incomingData;maxBufferedAmount;receivedFinAck;finAckTimeout;constructor(e){
super({...e,maxMessageSize:(e.maxMessageSize??yd)-A8}),this.channel=e.channel,this.channel.binaryType="arraybuffer",this.
incomingData=ls(),this.maxBufferedAmount=e.maxBufferedAmount??b8,this.finAckTimeout=e.finAckTimeout??_8,this.channel.onclose=
()=>{this.log.trace("received datachannel close event"),this.onRemoteCloseWrite(),this.onTransportClosed()},this.channel.
onerror=r=>{const s=r.error;this.log.trace("received datachannel error event - %e",s),this.abort(s)},this.channel.onmessage=
async r=>{this.log("incoming message %d bytes",r.data.byteLength);const{data:s}=r;s===null||s.byteLength===0||this.incomingData.
push(new Uint8Array(s,0,s.byteLength))},this.channel.bufferedAmountLowThreshold=0,this.channel.onbufferedamountlow=()=>{
this.writableNeedsDrain&&this.safeDispatchEvent("drain")},Promise.resolve().then(async()=>{for await(const r of ah(this.
incomingData))this.processIncomingProtobuf(r)}).catch(r=>{this.log.error("error processing incoming data channel message\
s - %e",r)});const t=()=>{this.channel.readyState==="open"&&(this.log.trace("stream closed, closing underlying datachann\
el"),this.channel.close())};this.addEventListener("close",t),this.channel.readyState!=="open"&&(this.log('channel ready \
state is "%s" and not "open", waiting for "open" event before sending data',this.channel.readyState),di(this.channel,"op\
en",{rejectionEvents:["close","error"]}).then(()=>{this.log('channel ready state is now "%s", dispatching drain',this.channel.
readyState),this.safeDispatchEvent("drain")}).catch(r=>{this.abort(r.error??r)}))}sendNewStream(){}_sendMessage(e){if(this.
channel.readyState!=="open")throw new Yr(`Invalid datachannel state - ${this.channel.readyState}`);this.log.trace('sendi\
ng message, channel state "%s"',this.channel.readyState);try{for(const t of e)this.channel.send(o0(t))}catch(t){this.log.
error("error sending datachannel message - %e",t),this.abort(t)}}sendData(e){return this.channel.readyState!=="open"?{sentBytes:0,
canSendMore:!1}:(this._sendMessage(oh.single(Qe.encode({message:e.subarray()}))),{sentBytes:e.byteLength,canSendMore:this.
channel.bufferedAmount<this.maxBufferedAmount})}sendReset(e){try{this.log.error("sending reset - %e",e),this._sendFlag(Qe.
Flag.RESET),this.receivedFinAck?.reject(e)}catch(t){this.log.error("failed to send reset - %e",t)}}async sendCloseWrite(e){
this._sendFlag(Qe.Flag.FIN),e?.signal?.throwIfAborted(),this.receivedFinAck=Promise.withResolvers();const t=e?.signal??AbortSignal.
timeout(this.finAckTimeout),r=[di(this.channel,"close",{signal:t}),di(this.channel,"error",{signal:t})];await Promise.any(
[kt(this.receivedFinAck.promise,t),...r]).finally(()=>{r.forEach(s=>s.cancel())})}async sendCloseRead(e){this._sendFlag(
Qe.Flag.STOP_SENDING),e?.signal?.throwIfAborted()}processIncomingProtobuf(e){const t=Qe.decode(e);t.message!=null&&(this.
readStatus==="readable"||this.readStatus==="paused")&&this.onData(new wd(t.message)),t.flag!==void 0&&(this.log.trace('i\
ncoming flag %s, write status "%s", read status "%s"',t.flag,this.writeStatus,this.readStatus),t.flag===Qe.Flag.FIN&&(this.
_sendFlag(Qe.Flag.FIN_ACK),this.onRemoteCloseWrite()),t.flag===Qe.Flag.RESET&&(this.receivedFinAck?.reject(new jm("The s\
tream was reset")),this.onRemoteReset()),t.flag===Qe.Flag.STOP_SENDING&&this.onRemoteCloseRead(),t.flag===Qe.Flag.FIN_ACK&&
this.receivedFinAck?.resolve())}_sendFlag(e){if(this.channel.readyState!=="open")return this.log.trace('not sending flag\
 %s because channel is "%s" and not "open"',e.toString(),this.channel.readyState),!1;this.log.trace("sending flag %s",e.
toString());const t=Qe.encode({flag:e}),r=oh.single(t);try{return this._sendMessage(r),!0}catch(s){this.log.error("could\
 not send flag %s - %e",e.toString(),s)}return!1}sendPause(){}sendResume(){}}function ng(n){const{channel:e,direction:t,
isHandshake:r}=n;return new R8({...n,id:`${e.id}`,log:n.log.newScope(`${r===!0?"handshake":t}:${e.id}`),protocol:""})}function Ad(n,e){
try{n.close()}catch(t){e?.trace("error closing early data channel - %e",t)}}function ch(n,e){n.channel.onmessage=null,n.
messages.length=0,Ad(n.channel,e)}class E0{protocol;peerConnection;metrics;log;dataChannelOptions;maxEarlyStreams;earlyDataChannels;handedOff=!1;constructor(e){
this.onEarlyDataChannel=this.onEarlyDataChannel.bind(this),this.peerConnection=e.peerConnection,this.metrics=e.metrics,this.
log=e.log,this.protocol=e.protocol??w0,this.dataChannelOptions=e.dataChannelOptions??{},this.maxEarlyStreams=e.maxEarlyStreams??
w8,this.peerConnection.addEventListener("datachannel",this.onEarlyDataChannel),this.earlyDataChannels=[]}onEarlyDataChannel(e){
const t=e.channel;if(this.earlyDataChannels.length>=this.maxEarlyStreams){this.log?.("rejecting early data channel %d - \
too many early channels",t.id),this.metrics?.increment({early_data_channel_count_exceeded:!0}),Ad(t,this.log);return}t.binaryType=
"arraybuffer";const r={channel:t,messages:[]};t.onmessage=s=>{const{data:i}=s;if(!(i instanceof ArrayBuffer)){this.closeEarlyDataChannel(
r,"invalid_message");return}if(r.messages.length>=v8){this.closeEarlyDataChannel(r,"message_count_exceeded");return}if(r.
messages.reduce((a,c)=>a+c.data.byteLength,0)+i.byteLength>y8){this.closeEarlyDataChannel(r,"byte_count_exceeded");return}
r.messages.push(s)},this.earlyDataChannels.push(r)}closeEarlyDataChannel(e,t){this.log?.("closing early data channel %d \
- %s",e.channel.id,t),this.metrics?.increment({[`early_data_channel_${t}`]:!0}),ch(e,this.log);const r=this.earlyDataChannels.
indexOf(e);r!==-1&&this.earlyDataChannels.splice(r,1)}createStreamMuxer(e){return this.handedOff=!0,this.peerConnection.
removeEventListener("datachannel",this.onEarlyDataChannel),new N8(e,{peerConnection:this.peerConnection,dataChannelOptions:this.
dataChannelOptions,metrics:this.metrics,protocol:this.protocol,maxEarlyStreams:this.maxEarlyStreams,earlyDataChannels:this.
earlyDataChannels})}close(){if(!this.handedOff){this.peerConnection.removeEventListener("datachannel",this.onEarlyDataChannel);
for(const e of this.earlyDataChannels)ch(e,this.log);this.earlyDataChannels.length=0}}}class N8 extends Ib{peerConnection;dataChannelOptions;constructor(e,t){
super(e,{...t,name:"muxer"}),this.peerConnection=t.peerConnection,this.protocol=t.protocol??w0,this.dataChannelOptions=t.
dataChannelOptions??{},this.peerConnection.ondatachannel=({channel:r})=>{this.onDataChannel(r)},queueMicrotask(()=>{if(this.
status!=="open"){t.earlyDataChannels.forEach(r=>{ch(r,this.log)});return}t.earlyDataChannels.forEach(({channel:r,messages:s})=>{
try{this.onDataChannel(r,s)}catch(i){this.log.error("error adopting early data channel %d - %e",r.id,i)}})})}onDataChannel(e,t){
if(this.log("incoming datachannel with channel id %d, protocol %s and status %s",e.id,e.protocol,e.readyState),e.label===
"init"){this.log.trace("closing init channel %d",e.id),Ad(e,this.log);return}const r=ng({...this.streamOptions,...this.dataChannelOptions,
channel:e,direction:"inbound",log:this.log});t?.forEach(s=>{e.onmessage?.(s)}),this.onRemoteStream(r)}async onCreateStream(e){
const t=this.peerConnection.createDataChannel("",{});return this.log("open channel %d for protocol %s",t.id,e?.protocol),
ng({...e,...this.dataChannelOptions,channel:t,direction:"outbound",log:this.log})}onData(){}}class F8 extends qh{peerConnection;constructor(e){
super(e),this.peerConnection=e.peerConnection;const t=e.peerConnection.connectionState;this.peerConnection.onconnectionstatechange=
()=>{this.log.trace("peer connection state change %s initial state %s",this.peerConnection.connectionState,t),(this.peerConnection.
connectionState==="failed"||this.peerConnection.connectionState==="closed")&&(this.onTransportClosed(),this.peerConnection.
close())}}sendData(e){return{sentBytes:e.byteLength,canSendMore:!0}}async sendClose(e){this.peerConnection.close(),e?.signal?.
throwIfAborted()}sendReset(){this.peerConnection.close()}sendPause(){}sendResume(){}}const rg=n=>new F8(n);async function sg(n){
return n=n??{},typeof n=="function"&&(n=await n()),n.iceServers=n.iceServers??m8.map(e=>({urls:[e]})),n}const C0=globalThis.
RTCPeerConnection,x0=globalThis.RTCSessionDescription,U8=globalThis.RTCIceCandidate;class O8 extends Error{constructor(e){
super(`WebRTC transport error: ${e}`),this.name="WebRTCTransportError"}}class Pn extends O8{constructor(e="SDP handshake\
 failed"){super(e),this.name="SDPHandshakeFailedError"}}var Pt;(function(n){(function(o){o.SDP_OFFER="SDP_OFFER",o.SDP_ANSWER=
"SDP_ANSWER",o.ICE_CANDIDATE="ICE_CANDIDATE"})(n.Type||(n.Type={}));let e;(function(o){o[o.SDP_OFFER=0]="SDP_OFFER",o[o.
SDP_ANSWER=1]="SDP_ANSWER",o[o.ICE_CANDIDATE=2]="ICE_CANDIDATE"})(e||(e={})),(function(o){o.codec=()=>b0(e)})(n.Type||(n.
Type={}));let t;n.codec=()=>(t==null&&(t=y0((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),n.Type.
codec().encode(o.type,a)),o.data!=null&&(a.uint32(18),a.string(o.data)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{
const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{l.type=n.Type.codec().decode(
o);break}case 2:{l.data=o.string();break}default:{o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?
o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(
o)};break}case 2:{yield{field:`${c}.data`,value:o.string()};break}default:{o.skipType(h&7);break}}}})),t);function r(o){
return f0(o,n.codec())}n.encode=r;function s(o,a){return l0(o,n.codec(),a)}n.decode=s;function i(o,a){return p0(o,n.codec(),
a)}n.stream=i})(Pt||(Pt={}));const I0=async(n,e,t)=>{try{const r=Promise.withResolvers();for(B8(n,r);;){const s=await Promise.
race([r.promise,e.read({signal:t.signal})]);if(s==null){t.signal?.throwIfAborted();break}if(s.type!==Pt.Type.ICE_CANDIDATE)
throw new Y("ICE candidate message expected");const i=JSON.parse(s.data??"null");if(i===""||i===null){t.onProgress?.(new q(
"webrtc:end-of-ice-candidates")),t.log.trace("end-of-candidates received");continue}const o=new U8(i);t.log.trace("%s re\
ceived new ICE candidate %o",t.direction,i);try{t.onProgress?.(new q("webrtc:add-ice-candidate",o.candidate)),await n.addIceCandidate(
o)}catch(a){t.log.error("%s bad candidate received %o - %e",t.direction,i,a)}}}catch(r){if(t.log.error("%s error parsing\
 ICE candidate - %e",t.direction,r),t.signal?.aborted===!0&&n.connectionState!=="connected")throw r}};function B8(n,e){if(n.
connectionState==="connected"){e.resolve();return}n.onconnectionstatechange=t=>{switch(n.connectionState){case"connected":
e.resolve();break;case"failed":case"closed":e.reject(new eb(`RTCPeerConnection connection state became "${n.connectionState}\
"`));break}}}function M0(n){let e;for(const t of n.getComponents())t.name==="p2p"&&(e=te(t.value??""));if(e==null)throw new gc(
"Remote peerId must be present in multiaddr");return e}async function z8({rtcConfiguration:n,dataChannel:e,maxEarlyStreams:t,
signal:r,metrics:s,multiaddr:i,connectionManager:o,transportManager:a,log:c,logger:l,onProgress:u}){const{circuitAddress:h,
targetPeer:d}=W8(i);s?.dialerEvents.increment({open:!0}),c.trace("dialing circuit address: %a",h);const p=o.getConnections(
d);let v;p.length===0?(u?.(new q("webrtc:dial-relay")),v=await a.dial(h,{signal:r,onProgress:u})):(u?.(new q("webrtc:reu\
se-relay-connection")),v=p[0]),u?.(new q("webrtc:open-signaling-stream"));const g=await v.newStream(ih,{signal:r,runOnLimitedConnection:!0}),
E=Ut(g).pb(Pt),f=new C0(n);f.addEventListener("connectionstatechange",()=>{switch(f.connectionState){case"closed":f.close();
break}});const b=new E0({peerConnection:f,dataChannelOptions:e,maxEarlyStreams:t,metrics:s?.dialerEvents,log:c});try{const _=f.
createDataChannel("init");f.onicecandidate=({candidate:w})=>{if(f.connectionState==="connected"){c.trace("ignore new ice\
 candidate as peer connection is already connected");return}if(w==null||w?.candidate===""){c.trace("initiator detected e\
nd of ICE candidates");return}const S=JSON.stringify(w?.toJSON()??null);c.trace("initiator sending ICE candidate %o",w),
E.write({type:Pt.Type.ICE_CANDIDATE,data:S},{signal:r}).catch(x=>{c.error("error sending ICE candidate - %e",x)})},f.onicecandidateerror=
w=>{c.error("initiator ICE candidate error",w)};const m=await f.createOffer().catch(w=>{throw c.error("could not execute\
 createOffer - %e",w),new Pn("Failed to set createOffer")});c.trace("initiator send SDP offer %s",m.sdp),u?.(new q("webr\
tc:send-sdp-offer")),await E.write({type:Pt.Type.SDP_OFFER,data:m.sdp},{signal:r}),await f.setLocalDescription(m).catch(
w=>{throw c.error("could not execute setLocalDescription - %e",w),new Pn("Failed to set localDescription")}),u?.(new q("\
webrtc:read-sdp-answer")),c.trace("initiator read SDP answer");const y=await E.read({signal:r});if(y.type!==Pt.Type.SDP_ANSWER)
throw new Pn("Remote should send an SDP answer");c.trace("initiator received SDP answer %s",y.data);const A=new x0({type:"\
answer",sdp:y.data});return await f.setRemoteDescription(A).catch(w=>{throw c.error("could not execute setRemoteDescript\
ion - %e",w),new Pn("Failed to set remoteDescription")}),c.trace("initiator read candidates until connected"),u?.(new q(
"webrtc:read-ice-candidates")),await I0(f,E,{direction:"initiator",signal:r,log:c,onProgress:u}),c.trace("initiator conn\
ected"),_.readyState!=="open"&&(c.trace("wait for init channel to open"),await di(_,"open",{signal:r})),c.trace("closing\
 init channel"),_.close(),c.trace("waiting for init channel to close"),await di(_,"close",{signal:r}),u?.(new q("webrtc:\
close-signaling-stream")),c.trace("closing signaling channel"),await g.close({signal:r}),c.trace("initiator connected to\
 remote address %s",i),{remoteAddress:i,peerConnection:f,muxerFactory:b}}catch(_){throw c.error("outgoing signaling erro\
r - %e",_),b.close(),f.close(),g.abort(_),_}finally{f.onicecandidate=null,f.onicecandidateerror=null}}const ig=Z(zh.matchers[0],
J(Hi));class _d extends he{transportManager;shutdownController;events;constructor(e,t){super(),this.transportManager=e.transportManager,
this.events=e.events,this.shutdownController=t.shutdownController,this.onTransportListening=this.onTransportListening.bind(
this)}async listen(){this.events.addEventListener("transport:listening",this.onTransportListening)}onTransportListening(e){
e.detail.getAddrs().filter(r=>ig.exactMatch(r)).map(r=>r.encapsulate("/webrtc")).length>0&&this.safeDispatchEvent("liste\
ning")}getAddrs(){return this.transportManager.getListeners().filter(e=>!(e instanceof _d)).map(e=>e.getAddrs().filter(t=>ig.
exactMatch(t)).map(t=>t.encapsulate("/webrtc"))).flat()}updateAnnounceAddrs(){}async close(){this.events.removeEventListener(
"transport:listening",this.onTransportListening),this.shutdownController.abort(),queueMicrotask(()=>{this.safeDispatchEvent(
"close")})}}async function V8(n,e,{peerConnection:t,signal:r,log:s}){s.trace("new inbound signaling stream");const i=Ut(
n).pb(Pt);try{t.onicecandidate=({candidate:h})=>{if(t.connectionState==="connected"){s.trace("ignore new ice candidate a\
s peer connection is already connected");return}if(h==null||h?.candidate===""){s.trace("recipient detected end of ICE ca\
ndidates");return}const d=JSON.stringify(h?.toJSON()??null);s.trace("recipient sending ICE candidate %s",d),i.write({type:Pt.
Type.ICE_CANDIDATE,data:d},{signal:r}).catch(p=>{s.error("error sending ICE candidate - %e",p)})},s.trace("recipient rea\
d SDP offer");const c=await i.read({signal:r});if(c.type!==Pt.Type.SDP_OFFER)throw new Pn(`expected message type SDP_OFF\
ER, received: ${c.type??"undefined"} `);s.trace("recipient received SDP offer %s",c.data);const l=new x0({type:"offer",sdp:c.
data});await t.setRemoteDescription(l).catch(h=>{throw s.error("could not execute setRemoteDescription - %e",h),new Pn("\
Failed to set remoteDescription")});const u=await t.createAnswer().catch(h=>{throw s.error("could not execute createAnsw\
er - %e",h),new Pn("Failed to create answer")});s.trace("recipient send SDP answer %s",u.sdp),await i.write({type:Pt.Type.
SDP_ANSWER,data:u.sdp},{signal:r}),await t.setLocalDescription(u).catch(h=>{throw s.error("could not execute setLocalDes\
cription - %e",h),new Pn("Failed to set localDescription")}),s.trace("recipient read candidates until connected"),await I0(
t,i,{direction:"recipient",signal:r,log:s})}catch(c){if(t.connectionState!=="connected")throw s.error("error while handl\
ing signaling stream from peer %a - %e",e.remoteAddr,c),t.close(),c;s("error while handling signaling stream from peer %\
a, ignoring as the RTCPeerConnection is already connected",e.remoteAddr,c)}const o=M0(e.remoteAddr),a=O(`/webrtc/p2p/${o}`);
return s.trace("recipient connected to remote address %s",a),{remoteAddress:a,remotePeer:o}}class q8{components;init;log;_started=!1;metrics;shutdownController;constructor(e,t={}){
this.components=e,this.init=t,this.log=e.logger.forComponent("libp2p:webrtc"),this.shutdownController=new AbortController,
this.shutdownController.signal,e.metrics!=null&&(this.metrics={dialerEvents:e.metrics.registerCounterGroup("libp2p_webrt\
c_dialer_events_total",{label:"event",help:"Total count of WebRTC dialer events by type"}),listenerEvents:e.metrics.registerCounterGroup(
"libp2p_webrtc_listener_events_total",{label:"event",help:"Total count of WebRTC listener events by type"})})}[$h]=!0;[Symbol.
toStringTag]="@libp2p/webrtc";[st]=["@libp2p/transport"];[us]=["@libp2p/identify","@libp2p/circuit-relay-v2-transport"];isStarted(){
return this._started}async start(){await this.components.registrar.handle(ih,(e,t)=>{const r=this.components.upgrader.createInboundAbortSignal(
this.shutdownController.signal);this._onProtocol(e,t,r).catch(s=>{this.log.error("failed to handle incoming connect from\
 %p - %e",t.remotePeer,s)}).finally(()=>{r.clear()})},{runOnLimitedConnection:!0}),this._started=!0}async stop(){await this.
components.registrar.unhandle(ih),this._started=!1}createListener(e){return new _d(this.components,{shutdownController:this.
shutdownController})}listenFilter(e){return e.filter(Eu.exactMatch)}dialFilter(e){return this.listenFilter(e)}async dial(e,t){
this.log.trace("dialing address: %a",e);const{remoteAddress:r,peerConnection:s,muxerFactory:i}=await z8({rtcConfiguration:await sg(
this.init.rtcConfiguration),dataChannel:this.init.dataChannel,maxEarlyStreams:this.init.maxEarlyStreams,multiaddr:e,dataChannelOptions:this.
init.dataChannel,signal:t.signal,connectionManager:this.components.connectionManager,transportManager:this.components.transportManager,
metrics:this.metrics,log:this.log,logger:this.components.logger,onProgress:t.onProgress}),o=rg({peerConnection:s,remoteAddr:r,
metrics:this.metrics?.dialerEvents,direction:"outbound",log:this.components.logger.forComponent("libp2p:webrtc:connectio\
n")});let a;try{a=await t.upgrader.upgradeOutbound(o,{skipProtection:!0,skipEncryption:!0,remotePeer:M0(e),muxerFactory:i,
onProgress:t.onProgress,signal:t.signal})}catch(c){throw i.close(),s.close(),c}return this._closeOnShutdown(s,o),a}async _onProtocol(e,t,r){
const s=new C0(await sg(this.init.rtcConfiguration));s.addEventListener("connectionstatechange",()=>{switch(s.connectionState){case"\
closed":s.close();break}});const i=new E0({peerConnection:s,dataChannelOptions:this.init.dataChannel,maxEarlyStreams:this.
init.maxEarlyStreams,metrics:this.metrics?.listenerEvents,log:this.log});try{const{remoteAddress:o,remotePeer:a}=await V8(
e,t,{peerConnection:s,signal:r,log:this.log});await e.close({signal:r});const c=rg({peerConnection:s,remoteAddr:o,metrics:this.
metrics?.listenerEvents,direction:"inbound",log:this.components.logger.forComponent("libp2p:webrtc:connection")});await this.
components.upgrader.upgradeInbound(c,{skipEncryption:!0,skipProtection:!0,remotePeer:a,muxerFactory:i,signal:r}),this._closeOnShutdown(
s,c)}catch(o){throw this.log.error("incoming signaling error - %e",o),i.close(),s.close(),e.abort(o),o}}_closeOnShutdown(e,t){
const r=()=>{t.close().catch(s=>{this.log.error("could not close WebRTCMultiaddrConnection - %e",s)})};this.shutdownController.
signal.addEventListener("abort",r),e.addEventListener("close",()=>{this.shutdownController.signal.removeEventListener("a\
bort",r)})}}function W8(n){const e=n.getComponents().filter(({name:r})=>r==="p2p").map(({value:r})=>r).pop();if(e==null)
throw new L("Destination peer id was missing");return{circuitAddress:O(n.getComponents().filter(({name:r})=>r!=="webrtc")),
targetPeer:te(e)}}/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */function K8(n){return n instanceof
Uint8Array||ArrayBuffer.isView(n)&&n.constructor.name==="Uint8Array"}function lh(n){if(typeof n!="boolean")throw new Error(
`boolean expected, not ${n}`)}function Ul(n){if(!Number.isSafeInteger(n)||n<0)throw new Error("positive integer expected\
, got "+n)}function He(n,e,t=""){const r=K8(n),s=n?.length,i=e!==void 0;if(!r||i&&s!==e){const o=t&&`"${t}" `,a=i?` of l\
ength ${e}`:"",c=r?`length=${s}`:`type=${typeof n}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return n}function og(n,e=!0){
if(n.destroyed)throw new Error("Hash instance has been destroyed");if(e&&n.finished)throw new Error("Hash#digest() has a\
lready been called")}function G8(n,e){He(n,void 0,"output");const t=e.outputLen;if(n.length<t)throw new Error("digestInt\
o() expects output buffer of length at least "+t)}function kn(n){return new Uint32Array(n.buffer,n.byteOffset,Math.floor(
n.byteLength/4))}function _s(...n){for(let e=0;e<n.length;e++)n[e].fill(0)}function H8(n){return new DataView(n.buffer,n.
byteOffset,n.byteLength)}const j8=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function X8(n,e){if(e==null||
typeof e!="object")throw new Error("options must be defined");return Object.assign(n,e)}function Q8(n,e){if(n.length!==e.
length)return!1;let t=0;for(let r=0;r<n.length;r++)t|=n[r]^e[r];return t===0}const Y8=(n,e)=>{function t(r,...s){if(He(r,
void 0,"key"),!j8)throw new Error("Non little-endian hardware is not yet supported");if(n.nonceLength!==void 0){const u=s[0];
He(u,n.varSizeNonce?void 0:n.nonceLength,"nonce")}const i=n.tagLength;i&&s[1]!==void 0&&He(s[1],void 0,"AAD");const o=e(
r,...s),a=(u,h)=>{if(h!==void 0){if(u!==2)throw new Error("cipher output not supported");He(h,void 0,"output")}};let c=!1;
return{encrypt(u,h){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,He(u),a(o.encrypt.length,
h),o.encrypt(u,h)},decrypt(u,h){if(He(u),i&&u.length<i)throw new Error('"ciphertext" expected length bigger than tagLeng\
th='+i);return a(o.decrypt.length,h),o.decrypt(u,h)}}}return Object.assign(t,n),t};function ag(n,e,t=!0){if(e===void 0)return new Uint8Array(
n);if(e.length!==n)throw new Error('"output" expected Uint8Array of length '+n+", got: "+e.length);if(t&&!Z8(e))throw new Error(
"invalid output, must be aligned");return e}function J8(n,e,t){lh(t);const r=new Uint8Array(16),s=H8(r);return s.setBigUint64(
0,BigInt(e),t),s.setBigUint64(8,BigInt(n),t),r}function Z8(n){return n.byteOffset%4===0}function qa(n){return Uint8Array.
from(n)}const P0=n=>Uint8Array.from(n.split(""),e=>e.charCodeAt(0)),e4=P0("expand 16-byte k"),t4=P0("expand 32-byte k"),
n4=kn(e4),r4=kn(t4);function W(n,e){return n<<e|n>>>32-e}function uh(n){return n.byteOffset%4===0}const Lo=64,s4=16,T0=2**
32-1,cg=Uint32Array.of();function i4(n,e,t,r,s,i,o,a){const c=s.length,l=new Uint8Array(Lo),u=kn(l),h=uh(s)&&uh(i),d=h?kn(
s):cg,p=h?kn(i):cg;for(let v=0;v<c;o++){if(n(e,t,r,u,o,a),o>=T0)throw new Error("arx: counter overflow");const g=Math.min(
Lo,c-v);if(h&&g===Lo){const E=v/4;if(v%4!==0)throw new Error("arx: invalid block position");for(let f=0,b;f<s4;f++)b=E+f,
p[b]=d[b]^u[f];v+=Lo;continue}for(let E=0,f;E<g;E++)f=v+E,i[f]=s[f]^l[E];v+=g}}function o4(n,e){const{allowShortKeys:t,extendNonceFn:r,
counterLength:s,counterRight:i,rounds:o}=X8({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},e);if(typeof n!=
"function")throw new Error("core must be a function");return Ul(s),Ul(o),lh(i),lh(t),(a,c,l,u,h=0)=>{He(a,void 0,"key"),
He(c,void 0,"nonce"),He(l,void 0,"data");const d=l.length;if(u===void 0&&(u=new Uint8Array(d)),He(u,void 0,"output"),Ul(
h),h<0||h>=T0)throw new Error("arx: counter overflow");if(u.length<d)throw new Error(`arx: output (${u.length}) is short\
er than data (${d})`);const p=[];let v=a.length,g,E;if(v===32)p.push(g=qa(a)),E=r4;else if(v===16&&t)g=new Uint8Array(32),
g.set(a),g.set(a,16),E=n4,p.push(g);else throw He(a,32,"arx key"),new Error("invalid key size");uh(c)||p.push(c=qa(c));const f=kn(
g);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(E,f,kn(c.subarray(0,16)),f),c=c.subarray(
16)}const b=16-s;if(b!==c.length)throw new Error(`arx: nonce must be ${b} or 16 bytes`);if(b!==12){const m=new Uint8Array(
12);m.set(c,i?0:12-c.length),c=m,p.push(c)}const _=kn(c);return i4(n,E,f,_,l,u,h,o),_s(...p),u}}function de(n,e){return n[e++]&
255|(n[e++]&255)<<8}class a4{blockLen=16;outputLen=16;buffer=new Uint8Array(16);r=new Uint16Array(10);h=new Uint16Array(
10);pad=new Uint16Array(8);pos=0;finished=!1;constructor(e){e=qa(He(e,32,"key"));const t=de(e,0),r=de(e,2),s=de(e,4),i=de(
e,6),o=de(e,8),a=de(e,10),c=de(e,12),l=de(e,14);this.r[0]=t&8191,this.r[1]=(t>>>13|r<<3)&8191,this.r[2]=(r>>>10|s<<6)&7939,
this.r[3]=(s>>>7|i<<9)&8191,this.r[4]=(i>>>4|o<<12)&255,this.r[5]=o>>>1&8190,this.r[6]=(o>>>14|a<<2)&8191,this.r[7]=(a>>>
11|c<<5)&8065,this.r[8]=(c>>>8|l<<8)&8191,this.r[9]=l>>>5&127;for(let u=0;u<8;u++)this.pad[u]=de(e,16+2*u)}process(e,t,r=!1){
const s=r?0:2048,{h:i,r:o}=this,a=o[0],c=o[1],l=o[2],u=o[3],h=o[4],d=o[5],p=o[6],v=o[7],g=o[8],E=o[9],f=de(e,t+0),b=de(e,
t+2),_=de(e,t+4),m=de(e,t+6),y=de(e,t+8),A=de(e,t+10),w=de(e,t+12),S=de(e,t+14);let x=i[0]+(f&8191),C=i[1]+((f>>>13|b<<3)&
8191),I=i[2]+((b>>>10|_<<6)&8191),M=i[3]+((_>>>7|m<<9)&8191),k=i[4]+((m>>>4|y<<12)&8191),$=i[5]+(y>>>1&8191),F=i[6]+((y>>>
14|A<<2)&8191),P=i[7]+((A>>>11|w<<5)&8191),D=i[8]+((w>>>8|S<<8)&8191),U=i[9]+(S>>>5|s),T=0,N=T+x*a+C*(5*E)+I*(5*g)+M*(5*
v)+k*(5*p);T=N>>>13,N&=8191,N+=$*(5*d)+F*(5*h)+P*(5*u)+D*(5*l)+U*(5*c),T+=N>>>13,N&=8191;let G=T+x*c+C*a+I*(5*E)+M*(5*g)+
k*(5*v);T=G>>>13,G&=8191,G+=$*(5*p)+F*(5*d)+P*(5*h)+D*(5*u)+U*(5*l),T+=G>>>13,G&=8191;let X=T+x*l+C*c+I*a+M*(5*E)+k*(5*g);
T=X>>>13,X&=8191,X+=$*(5*v)+F*(5*p)+P*(5*d)+D*(5*h)+U*(5*u),T+=X>>>13,X&=8191;let re=T+x*u+C*l+I*c+M*a+k*(5*E);T=re>>>13,
re&=8191,re+=$*(5*g)+F*(5*v)+P*(5*p)+D*(5*d)+U*(5*h),T+=re>>>13,re&=8191;let Or=T+x*h+C*u+I*l+M*c+k*a;T=Or>>>13,Or&=8191,
Or+=$*(5*E)+F*(5*g)+P*(5*v)+D*(5*p)+U*(5*d),T+=Or>>>13,Or&=8191;let Br=T+x*d+C*h+I*u+M*l+k*c;T=Br>>>13,Br&=8191,Br+=$*a+
F*(5*E)+P*(5*g)+D*(5*v)+U*(5*p),T+=Br>>>13,Br&=8191;let zr=T+x*p+C*d+I*h+M*u+k*l;T=zr>>>13,zr&=8191,zr+=$*c+F*a+P*(5*E)+
D*(5*g)+U*(5*v),T+=zr>>>13,zr&=8191;let Vr=T+x*v+C*p+I*d+M*h+k*u;T=Vr>>>13,Vr&=8191,Vr+=$*l+F*c+P*a+D*(5*E)+U*(5*g),T+=Vr>>>
13,Vr&=8191;let qr=T+x*g+C*v+I*p+M*d+k*h;T=qr>>>13,qr&=8191,qr+=$*u+F*l+P*c+D*a+U*(5*E),T+=qr>>>13,qr&=8191;let Wr=T+x*E+
C*g+I*v+M*p+k*d;T=Wr>>>13,Wr&=8191,Wr+=$*h+F*u+P*l+D*c+U*a,T+=Wr>>>13,Wr&=8191,T=(T<<2)+T|0,T=T+N|0,N=T&8191,T=T>>>13,G+=
T,i[0]=N,i[1]=G,i[2]=X,i[3]=re,i[4]=Or,i[5]=Br,i[6]=zr,i[7]=Vr,i[8]=qr,i[9]=Wr}finalize(){const{h:e,pad:t}=this,r=new Uint16Array(
10);let s=e[1]>>>13;e[1]&=8191;for(let a=2;a<10;a++)e[a]+=s,s=e[a]>>>13,e[a]&=8191;e[0]+=s*5,s=e[0]>>>13,e[0]&=8191,e[1]+=
s,s=e[1]>>>13,e[1]&=8191,e[2]+=s,r[0]=e[0]+5,s=r[0]>>>13,r[0]&=8191;for(let a=1;a<10;a++)r[a]=e[a]+s,s=r[a]>>>13,r[a]&=8191;
r[9]-=8192;let i=(s^1)-1;for(let a=0;a<10;a++)r[a]&=i;i=~i;for(let a=0;a<10;a++)e[a]=e[a]&i|r[a];e[0]=(e[0]|e[1]<<13)&65535,
e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<
14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let o=e[0]+t[0];e[0]=
o&65535;for(let a=1;a<8;a++)o=(e[a]+t[a]|0)+(o>>>16)|0,e[a]=o&65535;_s(r)}update(e){og(this),He(e),e=qa(e);const{buffer:t,
blockLen:r}=this,s=e.length;for(let i=0;i<s;){const o=Math.min(r-this.pos,s-i);if(o===r){for(;r<=s-i;i+=r)this.process(e,
i);continue}t.set(e.subarray(i,i+o),this.pos),this.pos+=o,i+=o,this.pos===r&&(this.process(t,0,!1),this.pos=0)}return this}destroy(){
_s(this.h,this.r,this.buffer,this.pad)}digestInto(e){og(this),G8(e,this),this.finished=!0;const{buffer:t,h:r}=this;let{pos:s}=this;
if(s){for(t[s++]=1;s<16;s++)t[s]=0;this.process(t,0,!0)}this.finalize();let i=0;for(let o=0;o<8;o++)e[i++]=r[o]>>>0,e[i++]=
r[o]>>>8;return e}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const r=e.slice(0,t);return this.destroy(),
r}}function c4(n){const e=(r,s)=>n(s).update(r).digest(),t=n(new Uint8Array(32));return e.outputLen=t.outputLen,e.blockLen=
t.blockLen,e.create=r=>n(r),e}const l4=c4(n=>new a4(n));function u4(n,e,t,r,s,i=20){let o=n[0],a=n[1],c=n[2],l=n[3],u=e[0],
h=e[1],d=e[2],p=e[3],v=e[4],g=e[5],E=e[6],f=e[7],b=s,_=t[0],m=t[1],y=t[2],A=o,w=a,S=c,x=l,C=u,I=h,M=d,k=p,$=v,F=g,P=E,D=f,
U=b,T=_,N=m,G=y;for(let re=0;re<i;re+=2)A=A+C|0,U=W(U^A,16),$=$+U|0,C=W(C^$,12),A=A+C|0,U=W(U^A,8),$=$+U|0,C=W(C^$,7),w=
w+I|0,T=W(T^w,16),F=F+T|0,I=W(I^F,12),w=w+I|0,T=W(T^w,8),F=F+T|0,I=W(I^F,7),S=S+M|0,N=W(N^S,16),P=P+N|0,M=W(M^P,12),S=S+
M|0,N=W(N^S,8),P=P+N|0,M=W(M^P,7),x=x+k|0,G=W(G^x,16),D=D+G|0,k=W(k^D,12),x=x+k|0,G=W(G^x,8),D=D+G|0,k=W(k^D,7),A=A+I|0,
G=W(G^A,16),P=P+G|0,I=W(I^P,12),A=A+I|0,G=W(G^A,8),P=P+G|0,I=W(I^P,7),w=w+M|0,U=W(U^w,16),D=D+U|0,M=W(M^D,12),w=w+M|0,U=
W(U^w,8),D=D+U|0,M=W(M^D,7),S=S+k|0,T=W(T^S,16),$=$+T|0,k=W(k^$,12),S=S+k|0,T=W(T^S,8),$=$+T|0,k=W(k^$,7),x=x+C|0,N=W(N^
x,16),F=F+N|0,C=W(C^F,12),x=x+C|0,N=W(N^x,8),F=F+N|0,C=W(C^F,7);let X=0;r[X++]=o+A|0,r[X++]=a+w|0,r[X++]=c+S|0,r[X++]=l+
x|0,r[X++]=u+C|0,r[X++]=h+I|0,r[X++]=d+M|0,r[X++]=p+k|0,r[X++]=v+$|0,r[X++]=g+F|0,r[X++]=E+P|0,r[X++]=f+D|0,r[X++]=b+U|0,
r[X++]=_+T|0,r[X++]=m+N|0,r[X++]=y+G|0}const h4=o4(u4,{counterRight:!1,counterLength:4,allowShortKeys:!1}),d4=new Uint8Array(
16),lg=(n,e)=>{n.update(e);const t=e.length%16;t&&n.update(d4.subarray(t))},f4=new Uint8Array(32);function ug(n,e,t,r,s){
s!==void 0&&He(s,void 0,"AAD");const i=n(e,t,f4),o=J8(r.length,s?s.length:0,!0),a=l4.create(i);s&&lg(a,s),lg(a,r),a.update(
o);const c=a.digest();return _s(i,o),c}const p4=n=>(e,t,r)=>({encrypt(i,o){const a=i.length;o=ag(a+16,o,!1),o.set(i);const c=o.
subarray(0,-16);n(e,t,c,c,1);const l=ug(n,e,t,c,r);return o.set(l,a),_s(l),o},decrypt(i,o){o=ag(i.length-16,o,!1);const a=i.
subarray(0,-16),c=i.subarray(-16),l=ug(n,e,t,a,r);if(!Q8(c,l))throw new Error("invalid tag");return o.set(i.subarray(0,-16)),
n(e,t,o,o,1),_s(l),o}}),hg=Y8({blockSize:64,nonceLength:12,tagLength:16},p4(h4));function g4(n,e,t){return tb(n),t===void 0&&
(t=new Uint8Array(n.outputLen)),nb(n,t,e)}const Ol=Uint8Array.of(0),dg=Uint8Array.of();function m4(n,e,t,r=32){tb(n),ES(
r,"length");const s=n.outputLen;if(r>255*s)throw new Error("Length must be <= 255*HashLen");const i=Math.ceil(r/s);t===void 0?
t=dg:xS(t,void 0,"info");const o=new Uint8Array(i*s),a=nb.create(n,e),c=a._cloneInto(),l=new Uint8Array(a.outputLen);for(let u=0;u<
i;u++)Ol[0]=u+1,c.update(u===0?dg:l).update(t).update(Ol).digestInto(l),o.set(l,s*u),a._cloneInto(c);return a.destroy(),
c.destroy(),CS(l,Ol),o.slice(0,r)}function fg(n){return e=>new q8(e,n)}function Wa(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Ka(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Ka(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function b4(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const pg=4096;function y4(n){const e=n.
length;if(e<=pg)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=pg));return t}function w4(n){return n?.buffer instanceof ArrayBuffer}function Ka(n){return w4(n)?n:n.slice()}
function v4(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===
0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=
256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;
for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var S4=v4,A4=S4;let _4=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},E4=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return D0(this,e)}},
C4=class{decoders;constructor(e){this.decoders=e}or(e){return D0(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function D0(n,e){return new C4({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let x4=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new _4(e,t,r),this.decoder=new E4(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function zc({name:n,prefix:e,encode:t,decode:r}){return new x4(n,e,t,
r)}function co({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=A4(t,n,r);return zc({prefix:e,
name:n,encode:s,decode:o=>Wa(i(o))})}function I4(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function M4(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function P4(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function Ae({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=P4(r,s);return zc(
{prefix:e,name:n,encode(o){return M4(o,r,t)},decode(o){return I4(o,i,t,n)}})}const T4=co({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),D4=co({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),$4=Object.freeze(Object.defineProperty({__proto__:null,base58btc:T4,
base58flickr:D4},Symbol.toStringTag,{value:"Module"})),k4=Ae({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),L4=Ae({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),R4=Ae({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),N4=Ae({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),F4=Ae({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),U4=Ae({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
O4=Ae({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),B4=Ae(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),z4=Ae(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),V4=Object.freeze(Object.defineProperty(
{__proto__:null,base32:k4,base32hex:F4,base32hexpad:O4,base32hexpadupper:B4,base32hexupper:U4,base32pad:R4,base32padupper:N4,
base32upper:L4,base32z:z4},Symbol.toStringTag,{value:"Module"})),q4=co({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),W4=co({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),K4=Object.freeze(Object.defineProperty({__proto__:null,base36:q4,base36upper:W4},Symbol.
toStringTag,{value:"Module"}));var G4=$0,gg=128,H4=-128,j4=Math.pow(2,31);function $0(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
j4;)e[t++]=n&255|gg,n/=128;for(;n&H4;)e[t++]=n&255|gg,n>>>=7;return e[t]=n|0,$0.bytes=t-r+1,e}var X4=hh,Q4=128,mg=127;function hh(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw hh.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&mg)<<s:(o&mg)*Math.pow(2,s),s+=7}while(o>=Q4);return hh.bytes=i-r,t}var Y4=Math.pow(2,7),J4=Math.pow(2,14),Z4=Math.
pow(2,21),eN=Math.pow(2,28),tN=Math.pow(2,35),nN=Math.pow(2,42),rN=Math.pow(2,49),sN=Math.pow(2,56),iN=Math.pow(2,63),oN=function(n){
return n<Y4?1:n<J4?2:n<Z4?3:n<eN?4:n<tN?5:n<nN?6:n<rN?7:n<sN?8:n<iN?9:10},aN={encode:G4,decode:X4,encodingLength:oN},bg=aN;
function yg(n,e=0){const t=bg.decode(n,e),r=bg.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function cN(n){const e=Wa(n),[
t,r]=yg(e),[s,i]=yg(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new lN(
t,s,o,e)}let lN=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=Ka(r),this.bytes=Ka(
s)}};function uN(n){return n.buffer instanceof ArrayBuffer}function hN(n){return uN(n)?n:n.slice()}function is(n=0){return new Uint8Array(
n)}function Ga(n=0){return new Uint8Array(n)}const dN=co({prefix:"9",name:"base10",alphabet:"0123456789"}),fN=Object.freeze(
Object.defineProperty({__proto__:null,base10:dN},Symbol.toStringTag,{value:"Module"})),pN=Ae({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),gN=Ae({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,
caseInsensitive:!0}),mN=Object.freeze(Object.defineProperty({__proto__:null,base16:pN,base16upper:gN},Symbol.toStringTag,
{value:"Module"})),bN=Ae({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),yN=Object.freeze(Object.defineProperty({
__proto__:null,base2:bN},Symbol.toStringTag,{value:"Module"})),k0=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿\
😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋\
👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫\
⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌\
🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
wN=k0.reduce((n,e,t)=>(n[t]=e,n),[]),vN=k0.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(`Invalid\
 character: ${e}`);return n[r]=t,n},[]);function SN(n){return n.reduce((e,t)=>(e+=wN[t],e),"")}function AN(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=vN[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const _N=zc({prefix:"🚀",name:"\
base256emoji",encode:SN,decode:AN}),EN=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:_N},Symbol.toStringTag,
{value:"Module"})),CN=Ae({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),xN=Ae({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),IN=Ae({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),MN=Ae({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),PN=Object.freeze(Object.defineProperty({__proto__:null,base64:CN,base64pad:xN,
base64url:IN,base64urlpad:MN},Symbol.toStringTag,{value:"Module"})),TN=Ae({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
DN=Object.freeze(Object.defineProperty({__proto__:null,base8:TN},Symbol.toStringTag,{value:"Module"})),$N=zc({prefix:"\0",
name:"identity",encode:n=>y4(Wa(n)),decode:n=>Wa(b4(n))}),kN=Object.freeze(Object.defineProperty({__proto__:null,identity:$N},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const wg={...kN,...yN,...DN,...fN,...mN,...V4,...K4,
...$4,...PN,...EN};function L0(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const vg=L0(
"utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Bl=L0("ascii","a",n=>{let e="\
a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Ga(n.length);for(let t=0;t<
n.length;t++)e[t]=n.charCodeAt(t);return e}),R0={utf8:vg,"utf-8":vg,hex:wg.base16,latin1:Bl,ascii:Bl,binary:Bl,...wg};function LN(n,e="\
utf8"){const t=R0[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}
function RN(n,e="utf8"){const t=R0[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(
n).substring(1)}const NN=Math.pow(2,7),FN=Math.pow(2,14),UN=Math.pow(2,21),N0=Math.pow(2,28),F0=Math.pow(2,35),U0=Math.pow(
2,42),O0=Math.pow(2,49),Ke=128,fn=127;function Ed(n){if(n<NN)return 1;if(n<FN)return 2;if(n<UN)return 3;if(n<N0)return 4;
if(n<F0)return 5;if(n<U0)return 6;if(n<O0)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError(
"Could not encode varint");return 8}function ON(n,e,t=0){switch(Ed(n)){case 8:e[t++]=n&255|Ke,n/=128;case 7:e[t++]=n&255|
Ke,n/=128;case 6:e[t++]=n&255|Ke,n/=128;case 5:e[t++]=n&255|Ke,n/=128;case 4:e[t++]=n&255|Ke,n>>>=7;case 3:e[t++]=n&255|
Ke,n>>>=7;case 2:e[t++]=n&255|Ke,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}
function BN(n,e){let t=n[e],r=0;if(r+=t&fn,t<Ke||(t=n[e+1],r+=(t&fn)<<7,t<Ke)||(t=n[e+2],r+=(t&fn)<<14,t<Ke)||(t=n[e+3],
r+=(t&fn)<<21,t<Ke)||(t=n[e+4],r+=(t&fn)*N0,t<Ke)||(t=n[e+5],r+=(t&fn)*F0,t<Ke)||(t=n[e+6],r+=(t&fn)*U0,t<Ke)||(t=n[e+7],
r+=(t&fn)*O0,t<Ke))return r;throw new RangeError("Could not decode varint")}const Cd=new Float32Array([-0]),Tn=new Uint8Array(
Cd.buffer);function zN(n,e,t){Cd[0]=n,e[t]=Tn[0],e[t+1]=Tn[1],e[t+2]=Tn[2],e[t+3]=Tn[3]}function VN(n,e){return Tn[0]=n[e],
Tn[1]=n[e+1],Tn[2]=n[e+2],Tn[3]=n[e+3],Cd[0]}const xd=new Float64Array([-0]),$e=new Uint8Array(xd.buffer);function qN(n,e,t){
xd[0]=n,e[t]=$e[0],e[t+1]=$e[1],e[t+2]=$e[2],e[t+3]=$e[3],e[t+4]=$e[4],e[t+5]=$e[5],e[t+6]=$e[6],e[t+7]=$e[7]}function WN(n,e){
return $e[0]=n[e],$e[1]=n[e+1],$e[2]=n[e+2],$e[3]=n[e+3],$e[4]=n[e+4],$e[5]=n[e+5],$e[6]=n[e+6],$e[7]=n[e+7],xd[0]}const KN=BigInt(
Number.MAX_SAFE_INTEGER),GN=BigInt(Number.MIN_SAFE_INTEGER);let jt=class Xn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|
0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}
return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>
31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.
lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.
hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.
lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.
hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){
if(e===0n)return br;if(e<KN&&e>GN)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>Sg&&(s=0n,++r>Sg&&(r=0n))),new Xn(Number(s),Number(r))}static fromNumber(e){if(e===0)return br;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new Xn(r,s)}static from(e){return typeof e=="number"?Xn.fromNumber(e):typeof e=="bigint"?Xn.fromBigInt(e):typeof e=="str\
ing"?Xn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Xn(e.low>>>0,e.high>>>0):br}};const br=new jt(0,0);br.toBigInt=
function(){return 0n};br.zzEncode=br.zzDecode=function(){return this};br.length=function(){return 1};const Sg=4294967296n;
function HN(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function jN(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function B0(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function Et(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function Ro(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let XN=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=hN(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Et(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Et(this,4);return Ro(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Et(
this,4);return Ro(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Et(this,4);const e=VN(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Et(this,4);const e=WN(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw Et(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return jN(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Et(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Et(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new jt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Et(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Et(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Et(this,8);const e=Ro(this.buf,this.pos+=4),t=Ro(this.buf,this.pos+=4);return new jt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=BN(this.buf,this.pos);
return this.pos+=Ed(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function z0(n){return new XN(n instanceof Uint8Array?
n:n.subarray())}function Rr(n,e,t){const r=z0(n);return e.decode(r,void 0,t)}function QN(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Ga(o);s+o>8192&&(r=Ga(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Js=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function zl(){}let YN=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const JN=QN();function ZN(n){return globalThis.Buffer!=null?
Ga(n):JN(n)}let dh=class{len;head;tail;states;constructor(){this.len=0,this.head=new Js(zl,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Js(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new tF((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
No,10,jt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=jt.fromBigInt(e);
return this._push(No,t.length(),t)}uint64Number(e){return this._push(ON,Ed(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=jt.fromBigInt(e).zzEncode();return this._push(No,t.length(),t)}sint64Number(e){const t=jt.fromNumber(e).zzEncode();
return this._push(No,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Vl,1,e?1:0)}fixed32(e){
return this._push(zs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=jt.fromBigInt(e);return this._push(zs,
4,t.lo)._push(zs,4,t.hi)}fixed64Number(e){const t=jt.fromNumber(e);return this._push(zs,4,t.lo)._push(zs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(zN,4,e)}double(e){return this._push(qN,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Vl,1,0):this.uint32(t)._push(nF,t,e)}string(e){const t=HN(e);return t!==0?this.uint32(t)._push(
B0,t,e):this._push(Vl,1,0)}fork(){return this.states=new YN(this),this.head=this.tail=new Js(zl,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Js(zl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=ZN(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function Vl(n,e,t){e[t]=n&255}function eF(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let tF=class extends Js{next;constructor(e,t){super(eF,e,t),this.next=void 0}};
function No(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function zs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function nF(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(dh.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(rF,e,n),this},dh.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(sF,e,n),this});function rF(n,e,t){e.set(n,t)}function sF(n,e,t){n.length<40?B0(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(LN(n),t)}function iF(){return new dh}function Nr(n,e){const t=iF();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*Fr(n,e,t){const r=z0(n);yield*e.stream(r,void 0,".",t)}const V0={VARINT:0,LENGTH_DELIMITED:2};function q0(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function Id(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return q0("enum",V0.VARINT,t,r,s)}function Ur(n,e,t){return q0("message",V0.LENGTH_DELIMITED,n,e,
t)}let Ha=class extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"};const oF=1,W0=5e3,aF=100,Fo=`${Th}-circuit-re\
lay`;BigInt(1<<17);const ja="/libp2p/circuit/relay/0.2.0/hop",Ag="/libp2p/circuit/relay/0.2.0/stop",_g=300,cF=4096,lF=.001;
var Es;(function(n){(function(o){o.RESERVE="RESERVE",o.CONNECT="CONNECT",o.STATUS="STATUS"})(n.Type||(n.Type={}));let e;
(function(o){o[o.RESERVE=0]="RESERVE",o[o.CONNECT=1]="CONNECT",o[o.STATUS=2]="STATUS"})(e||(e={})),(function(o){o.codec=
()=>Id(e)})(n.Type||(n.Type={}));let t;n.codec=()=>(t==null&&(t=Ur((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=
null&&(a.uint32(8),n.Type.codec().encode(o.type,a)),o.peer!=null&&(a.uint32(18),Ln.codec().encode(o.peer,a)),o.reservation!=
null&&(a.uint32(26),fi.codec().encode(o.reservation,a)),o.limit!=null&&(a.uint32(34),Rn.codec().encode(o.limit,a)),o.status!=
null&&(a.uint32(40),pe.codec().encode(o.status,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?
o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{l.type=n.Type.codec().decode(o);break}case 2:{l.peer=
Ln.codec().decode(o,o.uint32(),{limits:c.limits?.peer});break}case 3:{l.reservation=fi.codec().decode(o,o.uint32(),{limits:c.
limits?.reservation});break}case 4:{l.limit=Rn.codec().decode(o,o.uint32(),{limits:c.limits?.limit});break}case 5:{l.status=
pe.codec().decode(o);break}default:{o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+
a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(o)};break}case 2:{
yield*Ln.codec().stream(o,o.uint32(),`${c}.peer`,{limits:l.limits?.peer});break}case 3:{yield*fi.codec().stream(o,o.uint32(),
`${c}.reservation`,{limits:l.limits?.reservation});break}case 4:{yield*Rn.codec().stream(o,o.uint32(),`${c}.limit`,{limits:l.
limits?.limit});break}case 5:{yield{field:`${c}.status`,value:pe.codec().decode(o)};break}default:{o.skipType(h&7);break}}}})),
t);function r(o){return Nr(o,n.codec())}n.encode=r;function s(o,a){return Rr(o,n.codec(),a)}n.decode=s;function i(o,a){return Fr(
o,n.codec(),a)}n.stream=i})(Es||(Es={}));var Vt;(function(n){(function(o){o.CONNECT="CONNECT",o.STATUS="STATUS"})(n.Type||
(n.Type={}));let e;(function(o){o[o.CONNECT=0]="CONNECT",o[o.STATUS=1]="STATUS"})(e||(e={})),(function(o){o.codec=()=>Id(
e)})(n.Type||(n.Type={}));let t;n.codec=()=>(t==null&&(t=Ur((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=null&&
(a.uint32(8),n.Type.codec().encode(o.type,a)),o.peer!=null&&(a.uint32(18),Ln.codec().encode(o.peer,a)),o.limit!=null&&(a.
uint32(26),Rn.codec().encode(o.limit,a)),o.status!=null&&(a.uint32(32),pe.codec().encode(o.status,a)),c.lengthDelimited!==
!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{
l.type=n.Type.codec().decode(o);break}case 2:{l.peer=Ln.codec().decode(o,o.uint32(),{limits:c.limits?.peer});break}case 3:{
l.limit=Rn.codec().decode(o,o.uint32(),{limits:c.limits?.limit});break}case 4:{l.status=pe.codec().decode(o);break}default:{
o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();
switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(o)};break}case 2:{yield*Ln.codec().stream(o,o.
uint32(),`${c}.peer`,{limits:l.limits?.peer});break}case 3:{yield*Rn.codec().stream(o,o.uint32(),`${c}.limit`,{limits:l.
limits?.limit});break}case 4:{yield{field:`${c}.status`,value:pe.codec().decode(o)};break}default:{o.skipType(h&7);break}}}})),
t);function r(o){return Nr(o,n.codec())}n.encode=r;function s(o,a){return Rr(o,n.codec(),a)}n.decode=s;function i(o,a){return Fr(
o,n.codec(),a)}n.stream=i})(Vt||(Vt={}));var Ln;(function(n){let e;n.codec=()=>(e==null&&(e=Ur((i,o,a={})=>{if(a.lengthDelimited!==
!1&&o.fork(),i.id!=null&&i.id.byteLength>0&&(o.uint32(10),o.bytes(i.id)),i.addrs!=null&&i.addrs.length>0)for(const c of i.
addrs)o.uint32(18),o.bytes(c);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={id:is(0),addrs:[]},l=o==null?i.len:
i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.id=i.bytes();break}case 2:{if(a.limits?.addrs!=null&&c.
addrs.length===a.limits.addrs)throw new Ha('Decode error - repeated field "addrs" had too many elements');c.addrs.push(i.
bytes());break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addrs:0},u=o==null?i.len:i.pos+
o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.id`,value:i.bytes()};break}case 2:{if(c.limits?.
addrs!=null&&l.addrs===c.limits.addrs)throw new Ha('Streaming decode error - repeated field "addrs" had too many element\
s');yield{field:`${a}.addrs[]`,index:l.addrs,value:i.bytes()},l.addrs++;break}default:{i.skipType(h&7);break}}}})),e);function t(i){
return Nr(i,n.codec())}n.encode=t;function r(i,o){return Rr(i,n.codec(),o)}n.decode=r;function s(i,o){return Fr(i,n.codec(),
o)}n.stream=s})(Ln||(Ln={}));var fi;(function(n){let e;n.codec=()=>(e==null&&(e=Ur((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.expire!=null&&i.expire!==0n&&(o.uint32(8),o.uint64(i.expire)),i.addrs!=null&&i.addrs.length>0)for(const c of i.
addrs)o.uint32(18),o.bytes(c);i.voucher!=null&&(o.uint32(26),gi.codec().encode(i.voucher,o)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={expire:0n,addrs:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.expire=i.uint64();break}case 2:{if(a.limits?.addrs!=null&&c.addrs.length===a.limits.addrs)throw new Ha('Decode error -\
 repeated field "addrs" had too many elements');c.addrs.push(i.bytes());break}case 3:{c.voucher=gi.codec().decode(i,i.uint32(),
{limits:a.limits?.voucher});break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addrs:0},u=o==
null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.expire`,value:i.uint64()};break}case 2:{
if(c.limits?.addrs!=null&&l.addrs===c.limits.addrs)throw new Ha('Streaming decode error - repeated field "addrs" had too\
 many elements');yield{field:`${a}.addrs[]`,index:l.addrs,value:i.bytes()},l.addrs++;break}case 3:{yield*gi.codec().stream(
i,i.uint32(),`${a}.voucher`,{limits:c.limits?.voucher});break}default:{i.skipType(h&7);break}}}})),e);function t(i){return Nr(
i,n.codec())}n.encode=t;function r(i,o){return Rr(i,n.codec(),o)}n.decode=r;function s(i,o){return Fr(i,n.codec(),o)}n.stream=
s})(fi||(fi={}));var Rn;(function(n){let e;n.codec=()=>(e==null&&(e=Ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.duration!=
null&&(o.uint32(8),o.uint32(i.duration)),i.data!=null&&(o.uint32(16),o.uint64(i.data)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.duration=i.uint32();
break}case 2:{c.data=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.duration`,value:i.uint32()};break}case 2:{
yield{field:`${a}.data`,value:i.uint64()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Nr(i,n.codec())}
n.encode=t;function r(i,o){return Rr(i,n.codec(),o)}n.decode=r;function s(i,o){return Fr(i,n.codec(),o)}n.stream=s})(Rn||
(Rn={}));var pe;(function(n){n.UNUSED="UNUSED",n.OK="OK",n.RESERVATION_REFUSED="RESERVATION_REFUSED",n.RESOURCE_LIMIT_EXCEEDED=
"RESOURCE_LIMIT_EXCEEDED",n.PERMISSION_DENIED="PERMISSION_DENIED",n.CONNECTION_FAILED="CONNECTION_FAILED",n.NO_RESERVATION=
"NO_RESERVATION",n.MALFORMED_MESSAGE="MALFORMED_MESSAGE",n.UNEXPECTED_MESSAGE="UNEXPECTED_MESSAGE"})(pe||(pe={}));var fh;
(function(n){n[n.UNUSED=0]="UNUSED",n[n.OK=100]="OK",n[n.RESERVATION_REFUSED=200]="RESERVATION_REFUSED",n[n.RESOURCE_LIMIT_EXCEEDED=
201]="RESOURCE_LIMIT_EXCEEDED",n[n.PERMISSION_DENIED=202]="PERMISSION_DENIED",n[n.CONNECTION_FAILED=203]="CONNECTION_FAI\
LED",n[n.NO_RESERVATION=204]="NO_RESERVATION",n[n.MALFORMED_MESSAGE=400]="MALFORMED_MESSAGE",n[n.UNEXPECTED_MESSAGE=401]=
"UNEXPECTED_MESSAGE"})(fh||(fh={}));(function(n){n.codec=()=>Id(fh)})(pe||(pe={}));var pi;(function(n){let e;n.codec=()=>(e==
null&&(e=Ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.relay!=null&&i.relay.byteLength>0&&(o.uint32(10),o.bytes(i.relay)),
i.peer!=null&&i.peer.byteLength>0&&(o.uint32(18),o.bytes(i.peer)),i.expiration!=null&&i.expiration!==0n&&(o.uint32(24),o.
uint64(i.expiration)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={relay:is(0),peer:is(0),expiration:0n},l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.relay=i.bytes();break}case 2:{c.peer=i.bytes();
break}case 3:{c.expiration=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.relay`,value:i.bytes()};break}case 2:{
yield{field:`${a}.peer`,value:i.bytes()};break}case 3:{yield{field:`${a}.expiration`,value:i.uint64()};break}default:{i.
skipType(u&7);break}}}})),e);function t(i){return Nr(i,n.codec())}n.encode=t;function r(i,o){return Rr(i,n.codec(),o)}n.
decode=r;function s(i,o){return Fr(i,n.codec(),o)}n.stream=s})(pi||(pi={}));var gi;(function(n){let e;n.codec=()=>(e==null&&
(e=Ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.publicKey!=null&&i.publicKey.byteLength>0&&(o.uint32(10),o.bytes(i.
publicKey)),i.payloadType!=null&&i.payloadType.byteLength>0&&(o.uint32(18),o.bytes(i.payloadType)),i.payload!=null&&(o.uint32(
26),pi.codec().encode(i.payload,o)),i.signature!=null&&i.signature.byteLength>0&&(o.uint32(42),o.bytes(i.signature)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={publicKey:is(0),payloadType:is(0),signature:is(0)},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.publicKey=i.bytes();break}case 2:{c.payloadType=i.bytes();break}case 3:{
c.payload=pi.codec().decode(i,i.uint32(),{limits:a.limits?.payload});break}case 5:{c.signature=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{yield{field:`${a}.payloadType`,value:i.
bytes()};break}case 3:{yield*pi.codec().stream(i,i.uint32(),`${a}.payload`,{limits:c.limits?.payload});break}case 5:{yield{
field:`${a}.signature`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Nr(i,n.codec())}
n.encode=t;function r(i,o){return Rr(i,n.codec(),o)}n.decode=r;function s(i,o){return Fr(i,n.codec(),o)}n.stream=s})(gi||
(gi={}));class Eg extends Error{static name="HadEnoughRelaysError";name="HadEnoughRelaysError"}class uF extends Error{static name="\
DoubleRelayError";name="DoubleRelayError"}class hF extends Error{static name="RelayQueueFullError";name="RelayQueueFullE\
rror"}function Cg(n){const e=n*BigInt(1e3),t=new Date().getTime();return Number(e-BigInt(t))}class xg{expires;bytes;constructor(e){
e?.duration!=null&&e?.duration!==0&&(this.expires=Date.now()+e.duration*1e3),this.bytes=e?.data,this.bytes===0n&&(this.bytes=
void 0),this.onData=this.onData.bind(this)}onData(e){this.bytes!=null&&(this.bytes-=BigInt(e.byteLength),this.bytes<0n&&
(this.bytes=0n))}getLimits(){if(this.expires==null&&this.bytes==null)return;const e={};if(this.bytes!=null){const t=this;
Object.defineProperty(e,"bytes",{get(){return t.bytes}})}if(this.expires!=null){const t=this;Object.defineProperty(e,"se\
conds",{get(){return Math.round(((t.expires??0)-Date.now())/1e3)}})}return e}}const K0=Z(K(zh.matchers[0],J(Hi))),G0=Z(J(
Hi));class dF extends he{components;started;running;topologyId;log;discoveryController;filter;queue;constructor(e,t={}){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:discover-relays"),this.components=e,this.started=!1,this.running=
!1,this.filter=t.filter,this.discoveryController=new AbortController,this.discoveryController.signal,this.dialPeer=this.
dialPeer.bind(this),this.onPeer=this.onPeer.bind(this)}isStarted(){return this.started}async start(){this.topologyId=await this.
components.registrar.register(ja,{filter:this.filter,onConnect:e=>{this.log.trace("discovered relay %p queue (length: %d\
, active %d)",e,this.queue?.size,this.queue?.running),this.safeDispatchEvent("relay:discover",{detail:e})}}),this.started=
!0}stop(){this.topologyId!=null&&this.components.registrar.unregister(this.topologyId),this.running&&this.stopDiscovery(),
this.started=!1}startDiscovery(){this.running||(this.log("start discovery"),this.running=!0,this.discoveryController=new AbortController,
this.discoveryController.signal,this.components.events.addEventListener("peer:discovery",this.onPeer),Promise.resolve().
then(async()=>{this.log("searching peer store for relays");const e=await this.components.peerStore.all({filters:[r=>r.protocols.
includes(ja)],orders:[()=>Math.random()<.5?1:-1,(r,s)=>{const i=Ig(r),o=Ig(s);return i>o?-1:o>i?1:0}]});for(const r of e)
this.log.trace("found relay peer %p in peer store",r.id),this.safeDispatchEvent("relay:discover",{detail:r.id});this.log(
"found %d relay peers in peer store",e.length);const t=this.queue=new Wh({concurrency:5});this.log("start random walk");
for await(const r of this.components.randomWalk.walk({signal:this.discoveryController.signal})){if(this.log.trace("found\
 random peer %p",r.id),t.has(r.id)){this.log.trace("random peer %p was already in queue",r.id);continue}if(this.components.
connectionManager.getConnections(r.id)?.length>0){this.log.trace("random peer %p was already connected",r.id);continue}if(!await this.
components.connectionManager.isDialable(r.multiaddrs)){this.log.trace("random peer %p was not dialable",r.id,r.multiaddrs.
map(s=>s.toString()));continue}t.queued>10&&(this.log.trace("wait for space in queue for %p",r.id),await t.onSizeLessThan(
10,{signal:this.discoveryController.signal})),this.log("adding random peer %p to dial queue (length: %d, active %d)",r.id,
t.size,t.running),t.add(this.dialPeer,{peerId:r.id,signal:this.discoveryController.signal}).catch(s=>{this.log.error("er\
ror opening connection to random peer %p - %e",r.id,s)})}this.log("stop random walk"),await t.onIdle()}).catch(e=>{this.
discoveryController.signal.aborted||this.log.error("failed when finding relays on the network - %e",e)}))}stopDiscovery(){
this.log("stop discovery"),this.running=!1,this.discoveryController?.abort(),this.queue?.clear(),this.components.events.
removeEventListener("peer:discovery",this.onPeer)}onPeer(e){this.log.trace("maybe dialing discovered peer %p",e.detail.id),
this.maybeDialPeer(e).catch(t=>{this.log.trace("error dialing discovered peer %p - %e",e.detail.id,t)})}async maybeDialPeer(e){
if(this.queue==null)return;const t=e.detail.id,r=e.detail.multiaddrs;if(this.queue.has(t)){this.log.trace("random peer %\
p was already in queue",t);return}if(this.components.connectionManager.getConnections(t)?.length>0){this.log.trace("rand\
om peer %p was already connected",t);return}if(!await this.components.connectionManager.isDialable(r)){this.log.trace("r\
andom peer %p was not dialable",t);return}this.queue?.add(this.dialPeer,{peerId:e.detail.id,signal:this.discoveryController.
signal}).catch(s=>{this.log.error("error opening connection to discovered peer %p - %e",e.detail.id,s)})}async dialPeer({
peerId:e,signal:t}){const r=Fn([AbortSignal.timeout(5e3),t]);try{await this.components.connectionManager.openConnection(
e,{signal:r})}finally{r.clear()}}}function Ig(n){const e=n.metadata.get("last-dial-success");return e==null?0:new Date(RN(
e)).getTime()}class fF extends he{connectionManager;addressManager;reservationStore;listeningAddrs;log;listenTimeout;reservationId;relay;constructor(e,t={}){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:transport:listener"),this.connectionManager=e.connectionManager,
this.addressManager=e.addressManager,this.reservationStore=e.reservationStore,this.listeningAddrs=[],this.listenTimeout=
t.listenTimeout??W0,this.reservationStore.addEventListener("relay:removed",this._onRemoveRelayPeer),this.reservationStore.
addEventListener("relay:created-reservation",this._onAddRelayPeer)}_onRemoveRelayPeer=e=>{this.log("relay removed %p our\
 relay %p",e.detail.relay,this.relay,this.relay?.equals(e.detail.relay)),this.relay?.equals(e.detail.relay)===!0&&(this.
log("relay peer removed %p",e.detail.relay),this.listeningAddrs.forEach(t=>{this.addressManager.removeObservedAddr(t)}),
this.listeningAddrs=[],this.safeDispatchEvent("listening"))};_onAddRelayPeer=e=>{const{details:t}=e.detail;if(t.type==="\
configured"){this.relay?.equals(e.detail.relay)===!0&&this.addedRelay(e.detail);return}t.id===this.reservationId&&this.addedRelay(
e.detail)};async listen(e){if(G0.exactMatch(e))this.log("searching for circuit relay servers"),this.reservationId=this.reservationStore.
reserveRelay();else if(K0.exactMatch(e)){this.log("listen on specific relay server %a",e);const t=AbortSignal.timeout(this.
listenTimeout),r=e.decapsulate("/p2p-circuit"),s=await this.connectionManager.openConnection(r,{signal:t});if(!this.reservationStore.
hasReservation(s.remotePeer)){this.log("making reservation on peer %p",s.remotePeer);const i=await this.reservationStore.
addRelay(s.remotePeer,"configured");this.addedRelay(i)}}else throw new yu(`Could not listen on p2p-circuit address "${e}\
"`)}getAddrs(){return[...this.listeningAddrs.values()].flat()}updateAnnounceAddrs(){}async close(){this.reservationStore.
cancelReservations(),this.listeningAddrs=[],this.reservationStore.removeEventListener("relay:removed",this._onRemoveRelayPeer),
queueMicrotask(()=>{this.safeDispatchEvent("close")})}addedRelay(e){this.log("relay peer added %p",e.relay),this.relay=e.
relay;const t=this.listeningAddrs;this.listeningAddrs=e.details.reservation.addrs.map(r=>O(r).encapsulate("/p2p-circuit")),
this.listeningAddrs.forEach(r=>{this.addressManager.confirmObservedAddr(r,{type:"transport"})}),t.filter(r=>!this.listeningAddrs.
some(s=>s.equals(r))).forEach(r=>{this.addressManager.removeObservedAddr(r)}),queueMicrotask(()=>{this.safeDispatchEvent(
"listening")})}}function pF(n){return new fF(n)}let gF="57X6y3wQZNzYjJB2L_10pxbackgroundhimselfUTF-8DEMOGRAPHICSVqvt4KW9",
mF=(n=21)=>{for(var e="",t=crypto.getRandomValues(new Uint8Array(n|=0));n--;)e+=gF[t[n]&63];return e};const bF=60*1e3*10,
yF=60*1e3*5,wF=30*1e3;class vF extends he{peerId;connectionManager;peerStore;events;reserveQueue;reservations;pendingReservations;maxReservationQueueLength;reservationCompletionTimeout;started;log;relayFilter;constructor(e,t){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:transport:reservation-store"),this.peerId=e.peerId,this.connectionManager=
e.connectionManager,this.peerStore=e.peerStore,this.events=e.events,this.reservations=new Lr,this.pendingReservations=[],
this.maxReservationQueueLength=t?.maxReservationQueueLength??aF,this.reservationCompletionTimeout=t?.reservationCompletionTimeout??
W0,this.started=!1,this.relayFilter=_i(100),this.reserveQueue=new Wh({concurrency:t?.reservationConcurrency??oF,metricName:"\
libp2p_relay_reservation_queue",metrics:e.metrics}),this.events.addEventListener("connection:close",r=>{[...this.reservations.
values()].find(i=>i.connection===r.detail.id)!=null&&this.#t(r.detail.remotePeer).catch(i=>{this.log.error("could not re\
move relay %p - %e",r.detail.remotePeer,i)})})}isStarted(){return this.started}start(){this.started=!0}afterStart(){Promise.
resolve().then(async()=>{const e=await this.peerStore.all({filters:[t=>t.tags.has(Fo)]});this.log("removing tag from %d \
old relays",e.length),await Promise.all(e.map(async t=>{await this.peerStore.merge(t.id,{tags:{[Fo]:void 0}})})),this.log(
"redialing %d old relays",e.length),await Promise.all(e.map(async t=>this.addRelay(t.id,"discovered"))),this.#n()}).catch(
e=>{this.log.error("failed to clean up and redial old relays during afterStart - %e",e)})}stop(){this.reserveQueue.clear(),
this.reservations.forEach(({timeout:e})=>{clearTimeout(e)}),this.reservations.clear(),this.started=!1}reserveRelay(){const e=mF();
return this.pendingReservations.push(e),this.#n(),e}async addRelay(e,t){if(this.peerId.equals(e))throw this.log.trace("n\
ot trying to use self as relay"),new yu("Cannot use self as relay");if(this.reserveQueue.size>this.maxReservationQueueLength)
throw new hF("The reservation queue is full");const r=this.reserveQueue.find(e);if(r!=null)return this.log.trace("potent\
ial relay peer %p is already in the reservation queue",e),r.join();if(this.relayFilter.has(e.toMultihash().bytes))throw new yu(
"The relay was previously invalid");return this.log.trace("try to reserve relay slot with %p",e),this.reserveQueue.add(async()=>{
const s=Date.now();try{const i=this.reservations.get(e);if(i!=null){const v=this.connectionManager.getConnections(e);let g=!1;
if(v.length===0&&this.log("already have relay reservation with %p but we are no longer connected",e),v.map(E=>E.id).includes(
i.connection)&&(this.log("already have relay reservation with %p and the original connection is still open",e),g=!0),g&&
Cg(i.reservation.expire)>bF)return this.log("already have relay reservation with %p but we are still connected and it do\
es not expire soon",e),{relay:e,details:i};g||await this.#t(e)}if(t==="discovered"&&i==null&&this.pendingReservations.length===
0)throw new Eg("Not making reservation on discovered relay because we do not need any more relays");const o=AbortSignal.
timeout(this.reservationCompletionTimeout);const a=await this.connectionManager.openConnection(e,{signal:o});if(ds.matches(
a.remoteAddr))throw new uF("not creating reservation over relayed connection");const c=await this.#e(a,{signal:o}),l=Cg(
c.expire);this.log("created reservation on relay peer %p, expiry date is %s",e,new Date(Date.now()+l).toString());const u=Math.
min(Math.max(l-yF,wF),Math.pow(2,31)-1),h=setTimeout(()=>{this.log("refresh reservation to relay %p",e),this.addRelay(e,
t).catch(async v=>{this.log.error("could not refresh reservation to relay %p - %e",e,v),await this.#t(e)}).catch(v=>{this.
log.error("could not remove expired reservation to relay %p - %e",e,v)})},u);let d;if(t==="discovered"){const v=this.reservations.
get(e),g=v?.type==="discovered"?v.id:this.pendingReservations.pop();if(g==null)throw new Eg("Made reservation on relay b\
ut did not need any more discovered relays");d={timeout:h,reservation:c,type:t,connection:a.id,id:g}}else d={timeout:h,reservation:c,
type:t,connection:a.id};i!=null&&clearTimeout(i.timeout),this.reservations.set(e,d),await this.peerStore.merge(e,{tags:{
[Fo]:{value:1,ttl:l}}}),this.#n();const p={relay:e,details:d};return this.safeDispatchEvent("relay:created-reservation",
{detail:p}),p}catch(i){throw t==="discovered"&&i.name==="HadEnoughRelaysError"||this.log.error("could not reserve slot o\
n %p after %dms - %e",e,Date.now()-s,i),(i.name==="DialError"||i.name==="UnsupportedProtocolError")&&this.relayFilter.add(
e.toMultihash().bytes),this.#t(e).catch(o=>{this.log.error("could not remove reservation on %p after reserving slot fail\
ed - %e",e,o)}),i}},{peerId:e})}hasReservation(e){return this.reservations.has(e)}getReservation(e){return this.reservations.
get(e)?.reservation}reservationCount(e){return e==null?this.reservations.size:[...this.reservations.values()].reduce((t,r)=>(r.
type===e&&t++,t),0)}cancelReservations(){[...this.reservations.values()].forEach(e=>{clearTimeout(e.timeout)}),this.reservations.
clear()}async#e(e,t){t.signal?.throwIfAborted(),this.log("requesting reservation from %p",e.remotePeer);const r=await e.
newStream(ja,t),i=Ut(r).pb(Es);this.log.trace("send RESERVE to %p",e.remotePeer),await i.write({type:Es.Type.RESERVE},t);
let o;try{this.log.trace("reading response from %p",e.remotePeer),o=await i.read(t)}catch(c){throw r.abort(c),c}finally{
r.status!=="closed"&&await r.close(t)}if(this.log.trace("read response %s",o.status),o.status===pe.OK&&o.reservation!=null){
const c=new Set;c.add(e.remoteAddr.toString());for(const l of o.reservation.addrs){let u=O(l);u.getComponents().find(h=>h.
code===B)==null&&(u=u.encapsulate(`/p2p/${e.remotePeer}`)),u=O(u.toString().replace(`/p2p/${e.remotePeer}/p2p/${e.remotePeer}`,
`/p2p/${e.remotePeer}`)),c.add(u.toString())}return o.reservation.addrs=[...c].map(l=>O(l).bytes),o.reservation}const a=`\
reservation failed with status ${o.status??"undefined"}`;throw this.log.error(a),new Error(a)}async#t(e){const t=this.reservations.
get(e);t!=null&&(this.log("removing relay reservation with %p from local store",e),clearTimeout(t.timeout),this.reservations.
delete(e),t.type==="discovered"&&this.pendingReservations.push(t.id),this.safeDispatchEvent("relay:removed",{detail:{relay:e,
details:t}}),this.#n(),await this.peerStore.merge(e,{tags:{[Fo]:void 0}}))}#n(){if(this.pendingReservations.length===0){
this.log.trace("have discovered enough relays"),this.reserveQueue.clear(),this.safeDispatchEvent("relay:found-enough-rel\
ays");return}this.relayFilter=_i(100),this.log("not discovered enough relays %d/%d",this.reservations.size,this.pendingReservations.
length),this.safeDispatchEvent("relay:not-enough-relays")}}class SF extends qh{stream;init;constructor(e){super({...e,direction:e.
stream.direction}),this.init=e,this.stream=e.stream,this.stream.addEventListener("close",t=>{this.onTransportClosed(t.error)}),
this.stream.addEventListener("remoteCloseWrite",t=>{this.onRemoteCloseWrite(),this.close().catch(r=>{this.abort(r)})}),this.
stream.addEventListener("message",t=>{e.onDataRead?.(t.data),this.onData(t.data)}),this.stream.addEventListener("drain",
()=>{this.safeDispatchEvent("drain")})}sendData(e){return this.init.onDataWrite?.(e),{sentBytes:e.byteLength,canSendMore:this.
stream.send(e)}}async sendClose(e){await this.stream.close(e)}sendReset(){this.stream.abort(new Error("An error occurred"))}sendPause(){
this.stream.pause()}sendResume(){this.stream.resume()}}function Mg(n){return new SF(n)}const AF=n=>{if(n.peer==null)return!1;
try{n.peer.addrs.forEach(O)}catch{return!1}return!0},Pg={maxInboundStopStreams:_g,maxOutboundStopStreams:_g};class _F{components;discovery;reservationStore;maxInboundStopStreams;maxOutboundStopStreams;started;log;shutdownController;constructor(e,t={}){
this.components=e,this.log=e.logger.forComponent("libp2p:circuit-relay:transport"),this.maxInboundStopStreams=t.maxInboundStopStreams??
Pg.maxInboundStopStreams,this.maxOutboundStopStreams=t.maxOutboundStopStreams??Pg.maxOutboundStopStreams,this.shutdownController=
new AbortController,this.discovery=new dF(e,{filter:t.discoveryFilter??JC(cF,lF)}),this.discovery.addEventListener("rela\
y:discover",r=>{this.reservationStore.addRelay(r.detail,"discovered").catch(s=>{s.name!=="HadEnoughRelaysError"&&s.name!==
"RelayQueueFullError"&&this.log.error("could not add discovered relay %p - %e",r.detail,s)})}),this.reservationStore=new vF(
e,t),this.reservationStore.addEventListener("relay:not-enough-relays",()=>{this.discovery?.startDiscovery()}),this.reservationStore.
addEventListener("relay:found-enough-relays",()=>{this.discovery?.stopDiscovery()}),this.started=!1,this.onStop=this.onStop.
bind(this)}[Symbol.toStringTag]="@libp2p/circuit-relay-v2-transport";[st]=["@libp2p/transport","@libp2p/circuit-relay-v2\
-transport"];get[us](){return this.discovery!=null?["@libp2p/identify"]:[]}[$h]=!0;isStarted(){return this.started}async start(){
this.shutdownController=new AbortController,this.shutdownController.signal,await this.components.registrar.handle(Ag,this.
onStop,{maxInboundStreams:this.maxInboundStopStreams,maxOutboundStreams:this.maxOutboundStopStreams,runOnLimitedConnection:!0}),
await ab(this.discovery,this.reservationStore),this.started=!0}async stop(){this.shutdownController.abort(),await cb(this.
discovery,this.reservationStore),await this.components.registrar.unhandle(Ag),this.started=!1}async dial(e,t){const r=e.
toString().split("/p2p-circuit"),s=O(r[0]),i=O(r[r.length-1]),o=s.getComponents().find(p=>p.code===B)?.value,a=i.getComponents().
find(p=>p.code===B)?.value;if(o==null||a==null){const p=`ircuit relay dial to ${e.toString()} failed as address did not \
have both relay and destination PeerIDs`;throw this.log.error(`c${p}`),new ia(`C${p}`)}const c=te(o),l=te(a);let h=this.
components.connectionManager.getConnections(c)[0];h==null?(await this.components.peerStore.merge(c,{multiaddrs:[s]}),t.onProgress?.(
new q("circuit-relay:open-connection")),h=await this.components.connectionManager.openConnection(c,t)):t.onProgress?.(new q(
"circuit-relay:reuse-connection"));let d;try{t.onProgress?.(new q("circuit-relay:open-hop-stream")),d=await h.newStream(
ja,t);const p=Ut(d).pb(Es);t.onProgress?.(new q("circuit-relay:write-connect-message")),await p.write({type:Es.Type.CONNECT,
peer:{id:l.toMultihash().bytes,addrs:[O(i).bytes]}},t),t.onProgress?.(new q("circuit-relay:read-connect-response"));const v=await p.
read(t);if(v.status!==pe.OK)throw new Y(`failed to connect via relay with status ${v?.status?.toString()??"undefined"}`);
const g=new xg(v.limit),E=Mg({stream:p.unwrap().unwrap(),remoteAddr:e,localAddr:s.encapsulate(`/p2p-circuit/p2p/${this.components.
peerId.toString()}`),onDataRead:g.onData,onDataWrite:g.onData,log:d.log.newScope("circuit-relay:connection")}),f=await this.
components.upgrader.upgradeOutbound(E,{...t,limits:g.getLimits()});return f.log("outbound relayed connection established\
 to %p with limits %o, over connection %s",f.remotePeer,v.limit??"none",h.id),f}catch(p){throw this.log.error("circuit r\
elay dial to destination %p via relay %p failed - %e",l,c,p),d?.abort(p),p}}createListener(e){return pF({peerId:this.components.
peerId,connectionManager:this.components.connectionManager,addressManager:this.components.addressManager,reservationStore:this.
reservationStore,logger:this.components.logger})}listenFilter(e){return e=Array.isArray(e)?e:[e],e.filter(t=>K0.exactMatch(
t)||G0.exactMatch(t))}dialFilter(e){return e=Array.isArray(e)?e:[e],e.filter(t=>ds.exactMatch(t))}async onStop(e,t){const r=this.
components.upgrader.createInboundAbortSignal(this.shutdownController.signal);try{if(!this.reservationStore.hasReservation(
t.remotePeer))try{this.log("dialed via relay we did not have a reservation on, start listening on that relay address"),await this.
components.transportManager.listen([t.remoteAddr.encapsulate("/p2p-circuit")])}catch(h){this.log.error("failed to listen\
 on a relay peer we were dialed via but did not have a reservation on - %e",h)}const s=Ut(e).pb(Vt),i=await s.read({signal:r});
if(this.log("new circuit relay v2 stop stream from %p with type %s",t.remotePeer,i.type),i?.type===void 0){this.log.error(
"type was missing from circuit v2 stop protocol request from %s",t.remotePeer),await s.write({type:Vt.Type.STATUS,status:pe.
MALFORMED_MESSAGE},{signal:r}),await e.close({signal:r});return}if(i.type!==Vt.Type.CONNECT){this.log.error("invalid sto\
p connect request via peer %p",t.remotePeer),await s.write({type:Vt.Type.STATUS,status:pe.UNEXPECTED_MESSAGE},{signal:r}),
await e.close({signal:r});return}if(!AF(i)){this.log.error("invalid stop connect request via peer %p",t.remotePeer),await s.
write({type:Vt.Type.STATUS,status:pe.MALFORMED_MESSAGE},{signal:r}),await e.close({signal:r});return}const o=Tr(cN(i.peer.
id));if(await this.components.connectionGater.denyInboundRelayedConnection?.(t.remotePeer,o)===!0){this.log.error("conne\
ction gater denied inbound relayed connection from %p",t.remotePeer),await s.write({type:Vt.Type.STATUS,status:pe.PERMISSION_DENIED},
{signal:r}),await e.close({signal:r});return}this.log.trace("sending success response to %p",t.remotePeer),await s.write(
{type:Vt.Type.STATUS,status:pe.OK},{signal:r});const a=new xg(i.limit),c=t.remoteAddr.encapsulate(`/p2p-circuit/p2p/${o.
toString()}`),l=this.components.addressManager.getAddresses()[0],u=Mg({stream:s.unwrap().unwrap(),remoteAddr:c,localAddr:l,
onDataRead:a.onData,onDataWrite:a.onData,log:e.log.newScope("circuit-relay:connection")});await this.components.upgrader.
upgradeInbound(u,{limits:a.getLimits(),signal:r}),u.log("inbound relayed connection established to %p with limits %o, ov\
er connection %s",o,i.limit??"none",t.id)}finally{r?.clear()}}}function EF(n={}){return e=>new _F(e,n)}const Vi=65535,Tg=Vi-
16,lo=!!globalThis.process?.env?.DUMP_SESSION_KEYS,Dg=16,CF={hashSHA256(n){return or(n.subarray())},getHKDF(n,e){const t=g4(
or,e,n),s=m4(or,t,void 0,96),i=s.subarray(0,32),o=s.subarray(32,64),a=s.subarray(64,96);return[i,o,a]},generateX25519KeyPair(){
const n=po.utils.randomSecretKey();return{publicKey:po.getPublicKey(n),privateKey:n}},generateX25519KeyPairFromSeed(n){return{
publicKey:po.getPublicKey(n),privateKey:n}},generateX25519SharedKey(n,e){return po.getSharedSecret(n.subarray(),e.subarray())},
chaCha20Poly1305Encrypt(n,e,t,r){return hg(r,e,t).encrypt(n.subarray())},chaCha20Poly1305Decrypt(n,e,t,r,s){return hg(r,
e,t).decrypt(n.subarray(),s)}},xF=CF;function IF(n){return{generateKeypair:n.generateX25519KeyPair,dh:(e,t)=>n.generateX25519SharedKey(
e.privateKey,t).subarray(0,32),encrypt:n.chaCha20Poly1305Encrypt,decrypt:n.chaCha20Poly1305Decrypt,hash:n.hashSHA256,hkdf:n.
getHKDF}}const Xa=n=>{const e=rb(2);return e[0]=n>>8,e[1]=n,e};Xa.bytes=2;const Qa=n=>{if(n.length<2)throw RangeError("C\
ould not decode int16BE");if(n instanceof Uint8Array){let e=0;return e+=n[0]<<8,e+=n[1],e}return n.getUint16(0)};Qa.bytes=
2;function MF(n){return{xxHandshakeSuccesses:n.registerCounter("libp2p_noise_xxhandshake_successes_total",{help:"Total c\
ount of noise xxHandshakes successes_"}),xxHandshakeErrors:n.registerCounter("libp2p_noise_xxhandshake_error_total",{help:"\
Total count of noise xxHandshakes errors"}),encryptedPackets:n.registerCounter("libp2p_noise_encrypted_packets_total",{help:"\
Total count of noise encrypted packets successfully"}),decryptedPackets:n.registerCounter("libp2p_noise_decrypted_packet\
s_total",{help:"Total count of noise decrypted packets"}),decryptErrors:n.registerCounter("libp2p_noise_decrypt_errors_t\
otal",{help:"Total count of noise decrypt errors"})}}function H0(n,e){!e.enabled||!lo||(n?(e(`LOCAL_STATIC_PUBLIC_KEY ${je(
n.publicKey,"hex")}`),e(`LOCAL_STATIC_PRIVATE_KEY ${je(n.privateKey,"hex")}`)):e("Missing local static keys."))}function j0(n,e){
!e.enabled||!lo||(n?(e(`LOCAL_PUBLIC_EPHEMERAL_KEY ${je(n.publicKey,"hex")}`),e(`LOCAL_PRIVATE_EPHEMERAL_KEY ${je(n.privateKey,
"hex")}`)):e("Missing local ephemeral keys."))}function PF(n,e){!e.enabled||!lo||e(n?`REMOTE_STATIC_PUBLIC_KEY ${je(n.subarray(),
"hex")}`:"Missing remote static public key.")}function X0(n,e){!e.enabled||!lo||e(n?`REMOTE_EPHEMERAL_PUBLIC_KEY ${je(n.
subarray(),"hex")}`:"Missing remote ephemeral keys.")}function Q0(n,e,t){!t.enabled||!lo||(t(`CIPHER_STATE_1 ${n.n.getUint64()}\
 ${n.k&&je(n.k,"hex")}`),t(`CIPHER_STATE_2 ${e.n.getUint64()} ${e.k&&je(e.k,"hex")}`))}class mi extends Error{code;constructor(e="\
Invalid crypto exchange"){super(e),this.code=mi.code}static code="ERR_INVALID_CRYPTO_EXCHANGE"}const TF=0,DF=4294967295,
$F="Cipher state has reached maximum n, a new handshake must be performed";class kF{n;bytes;view;constructor(e=TF){this.
n=e,this.bytes=Nn(12),this.view=new DataView(this.bytes.buffer,this.bytes.byteOffset,this.bytes.byteLength),this.view.setUint32(
4,e,!0)}increment(){this.n++,this.view.setUint32(4,this.n,!0)}getBytes(){return this.bytes}getUint64(){return this.n}assertValue(){
if(this.n>DF)throw new Error($F)}}const os=Nn(0);class Uo{k;n;crypto;constructor(e,t=void 0,r=0){this.crypto=e,this.k=t,
this.n=new kF(r)}hasKey(){return!!this.k}encryptWithAd(e,t){if(!this.hasKey())return t;this.n.assertValue();const r=this.
crypto.encrypt(t,this.n.getBytes(),e,this.k);return this.n.increment(),r}decryptWithAd(e,t,r){if(!this.hasKey())return t;
this.n.assertValue();const s=this.crypto.decrypt(t,this.n.getBytes(),e,this.k,r);return this.n.increment(),s}}class LF{cs;ck;h;crypto;constructor(e,t){
this.crypto=e;const r=Dr(t,"utf-8");this.h=NF(e,r),this.ck=this.h,this.cs=new Uo(e)}mixKey(e){const[t,r]=this.crypto.hkdf(
this.ck,e);this.ck=t,this.cs=new Uo(this.crypto,r)}mixHash(e){this.h=this.crypto.hash(new $n(this.h,e))}encryptAndHash(e){
const t=this.cs.encryptWithAd(this.h,e);return this.mixHash(t),t}decryptAndHash(e){const t=this.cs.decryptWithAd(this.h,
e);return this.mixHash(e),t}split(){const[e,t]=this.crypto.hkdf(this.ck,os);return[new Uo(this.crypto,e),new Uo(this.crypto,
t)]}}class RF{ss;s;e;rs;re;initiator;crypto;constructor(e){const{crypto:t,protocolName:r,prologue:s,initiator:i,s:o,e:a,
rs:c,re:l}=e;this.crypto=t,this.ss=new LF(t,r),this.ss.mixHash(s),this.initiator=i,this.s=o,this.e=a,this.rs=c,this.re=l}writeE(){
if(this.e)throw new Error("ephemeral keypair is already set");const e=this.crypto.generateKeypair();return this.ss.mixHash(
e.publicKey),this.e=e,e.publicKey}writeS(){if(!this.s)throw new Error("static keypair is not set");return this.ss.encryptAndHash(
this.s.publicKey)}writeEE(){if(!this.e)throw new Error("ephemeral keypair is not set");if(!this.re)throw new Error("remo\
te ephemeral public key is not set");this.ss.mixKey(this.crypto.dh(this.e,this.re))}writeES(){if(this.initiator){if(!this.
e)throw new Error("ephemeral keypair is not set");if(!this.rs)throw new Error("remote static public key is not set");this.
ss.mixKey(this.crypto.dh(this.e,this.rs))}else{if(!this.s)throw new Error("static keypair is not set");if(!this.re)throw new Error(
"remote ephemeral public key is not set");this.ss.mixKey(this.crypto.dh(this.s,this.re))}}writeSE(){if(this.initiator){if(!this.
s)throw new Error("static keypair is not set");if(!this.re)throw new Error("remote ephemeral public key is not set");this.
ss.mixKey(this.crypto.dh(this.s,this.re))}else{if(!this.e)throw new Error("ephemeral keypair is not set");if(!this.rs)throw new Error(
"remote static public key is not set");this.ss.mixKey(this.crypto.dh(this.e,this.rs))}}readE(e,t=0){if(this.re)throw new Error(
"remote ephemeral public key is already set");if(e.byteLength<t+32)throw new Error("message is not long enough");this.re=
e.sublist(t,t+32),this.ss.mixHash(this.re)}readS(e,t=0){if(this.rs)throw new Error("remote static public key is already \
set");const r=32+(this.ss.cs.hasKey()?16:0);if(e.byteLength<t+r)throw new Error("message is not long enough");const s=e.
sublist(t,t+r);return this.rs=this.ss.decryptAndHash(s),r}readEE(){this.writeEE()}readES(){this.writeES()}readSE(){this.
writeSE()}}class Y0 extends RF{writeMessageA(e){return new $n(this.writeE(),this.ss.encryptAndHash(e))}writeMessageB(e){
const t=this.writeE();this.writeEE();const r=this.writeS();return this.writeES(),new $n(t,r,this.ss.encryptAndHash(e))}writeMessageC(e){
const t=this.writeS();return this.writeSE(),new $n(t,this.ss.encryptAndHash(e))}readMessageA(e){try{return this.readE(e),
this.ss.decryptAndHash(e.sublist(32))}catch(t){throw new mi(`handshake stage 0 validation fail: ${t.message}`)}}readMessageB(e){
try{this.readE(e),this.readEE();const t=this.readS(e,32);return this.readES(),this.ss.decryptAndHash(e.sublist(32+t))}catch(t){
throw new mi(`handshake stage 1 validation fail: ${t.message}`)}}readMessageC(e){try{const t=this.readS(e);return this.readSE(),
this.ss.decryptAndHash(e.sublist(t))}catch(t){throw new mi(`handshake stage 2 validation fail: ${t.message}`)}}}function NF(n,e){
if(e.length<=32){const t=Nn(32);return t.set(e),t}else return n.hash(e)}var Ya;(function(n){let e;n.codec=()=>(e==null&&
(e=se((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.webtransportCerthashes!=null)for(const i of t.webtransportCerthashes)
r.uint32(10),r.bytes(i);if(t.streamMuxers!=null)for(const i of t.streamMuxers)r.uint32(18),r.string(i);s.lengthDelimited!==
!1&&r.ldelim()},(t,r,s={})=>{const i={webtransportCerthashes:[],streamMuxers:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){
const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.webtransportCerthashes!=null&&i.webtransportCerthashes.length===s.
limits.webtransportCerthashes)throw new ae('Decode error - map field "webtransportCerthashes" had too many elements');i.
webtransportCerthashes.push(t.bytes());break}case 2:{if(s.limits?.streamMuxers!=null&&i.streamMuxers.length===s.limits.streamMuxers)
throw new ae('Decode error - map field "streamMuxers" had too many elements');i.streamMuxers.push(t.string());break}default:{
t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(Ya||(Ya={}));var Ja;
(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.identityKey!=null&&t.identityKey.
byteLength>0&&(r.uint32(10),r.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(r.uint32(18),r.bytes(
t.identitySig)),t.extensions!=null&&(r.uint32(34),Ya.codec().encode(t.extensions,r)),s.lengthDelimited!==!1&&r.ldelim()},
(t,r,s={})=>{const i={identityKey:Nn(0),identitySig:Nn(0)},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>
3){case 1:{i.identityKey=t.bytes();break}case 2:{i.identitySig=t.bytes();break}case 4:{i.extensions=Ya.codec().decode(t,
t.uint32(),{limits:s.limits?.extensions});break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.codec()),
n.decode=(t,r)=>oe(t,n.codec(),r)})(Ja||(Ja={}));async function J0(n,e,t){const r=await n.sign(ev(e));return Ja.encode({
identityKey:$r(n.publicKey),identitySig:r,extensions:t})}async function Z0(n,e,t){try{const r=Ja.decode(n),s=Jt(r.identityKey);
if(t?.equals(s)===!1)throw new Error(`Payload identity key ${s} does not match expected remote identity key ${t}`);if(!e)
throw new Error("Remote static does not exist");const i=ev(e);if(!await s.verify(i,r.identitySig))throw new Error("Inval\
id payload signature");return r}catch(r){throw new Ph(r.message)}}function ev(n){const e=Dr("noise-libp2p-static-key:");
return n instanceof Uint8Array?ji([e,n],e.length+n.length):(n.prepend(e),n)}class FF extends Vh{stream;handshake;metrics;decoder;constructor(e,t,r){
super({log:e.log,inactivityTimeout:e.inactivityTimeout,maxReadBufferLength:e.maxReadBufferLength,direction:e.direction}),
this.stream=e,this.handshake=t,this.metrics=r,this.decoder=new K1({lengthDecoder:Qa,maxBufferSize:16*1024*1024,encodingLength:()=>2});
const s=c=>{try{for(const l of this.decoder.decode(c.data))this.onData(this.decrypt(l))}catch(l){this.abort(l)}};this.stream.
addEventListener("message",s);const i=c=>{c.error!=null?c.local===!0?this.abort(c.error):this.onRemoteReset():this.onTransportClosed()};
this.stream.addEventListener("close",i);const o=()=>{this.safeDispatchEvent("drain")};this.stream.addEventListener("drai\
n",o);const a=()=>{this.onRemoteCloseWrite()};this.stream.addEventListener("remoteCloseWrite",a)}encrypt(e){const t=new $n;
for(let r=0;r<e.byteLength;r+=Tg){let s=r+Tg;s>e.byteLength&&(s=e.byteLength);let i;e instanceof Uint8Array?i=this.handshake.
encrypt(e.subarray(r,s)):i=this.handshake.encrypt(e.sublist(r,s)),this.metrics?.encryptedPackets.increment(),t.append(Xa(
i.byteLength)),t.append(i)}return t}decrypt(e){const t=new $n;for(let r=0;r<e.byteLength;r+=Vi){let s=r+Vi;if(s>e.byteLength&&
(s=e.byteLength),s-Dg<r)throw new Error("Invalid chunk");let i;e instanceof Uint8Array?i=e.subarray(r,s):i=e.sublist(r,s);
const o=e.subarray(r,s-Dg);try{const a=this.handshake.decrypt(i,o);this.metrics?.decryptedPackets.increment(),t.append(a)}catch(a){
throw this.metrics?.decryptErrors.increment(),a}}return t}close(e){return this.stream.close(e)}sendPause(){this.stream.pause()}sendResume(){
this.stream.resume()}sendReset(e){this.stream.abort(e)}sendData(e){return{sentBytes:e.byteLength,canSendMore:this.stream.
send(this.encrypt(e))}}}function $g(n,e,t){return new FF(n,e,t)}async function UF(n,e){const{log:t,connection:r,crypto:s,
privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=n,u=await J0(i,a.publicKey,l),h=new Y0({crypto:s,protocolName:"\
Noise_XX_25519_ChaChaPoly_SHA256",initiator:!0,prologue:o,s:a});H0(h.s,t),t.trace("Stage 0 - Initiator starting to send \
first message."),await r.write(h.writeMessageA(os),e),t.trace("Stage 0 - Initiator finished sending first message."),j0(
h.e,t),t.trace("Stage 1 - Initiator waiting to receive first message from responder...");const d=h.readMessageB(await r.
read(e));t.trace("Stage 1 - Initiator received the message."),X0(h.re,t),PF(h.rs,t),t.trace("Initiator going to check re\
mote's signature...");const p=await Z0(d,h.rs,c);t.trace("All good with the signature!"),t.trace("Stage 2 - Initiator se\
nding third handshake message."),await r.write(h.writeMessageC(u),e),t.trace("Stage 2 - Initiator sent message with sign\
ed payload.");const[v,g]=h.ss.split();return Q0(v,g,t),{payload:p,encrypt:E=>v.encryptWithAd(os,E),decrypt:(E,f)=>g.decryptWithAd(
os,E,f)}}async function OF(n,e){const{log:t,connection:r,crypto:s,privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=n,
u=await J0(i,a.publicKey,l),h=new Y0({crypto:s,protocolName:"Noise_XX_25519_ChaChaPoly_SHA256",initiator:!1,prologue:o,s:a});
H0(h.s,t),t.trace("Stage 0 - Responder waiting to receive first message."),h.readMessageA(await r.read(e)),t.trace("Stag\
e 0 - Responder received first message."),X0(h.re,t),t.trace("Stage 1 - Responder sending out first message with signed \
payload and static key."),await r.write(h.writeMessageB(u),e),t.trace("Stage 1 - Responder sent the second handshake mes\
sage with signed payload."),j0(h.e,t),t.trace("Stage 2 - Responder waiting for third handshake message...");const d=h.readMessageC(
await r.read(e));t.trace("Stage 2 - Responder received the message, finished handshake.");const p=await Z0(d,h.rs,c),[v,
g]=h.ss.split();return Q0(v,g,t),{payload:p,encrypt:E=>g.encryptWithAd(os,E),decrypt:(E,f)=>v.decryptWithAd(os,E,f)}}class BF{protocol="\
/noise";crypto;prologue;staticKey;extensions;metrics;components;log;constructor(e,t={}){const{staticNoiseKey:r,extensions:s,
crypto:i,prologueBytes:o}=t,{metrics:a}=e;this.components=e,this.log=e.logger.forComponent("libp2p:noise");const c=i??xF;
this.crypto=IF(c),this.extensions={webtransportCerthashes:[],...s},this.metrics=a?MF(a):void 0,r?this.staticKey=c.generateX25519KeyPairFromSeed(
r):this.staticKey=c.generateX25519KeyPair(),this.prologue=o??Nn(0)}[Symbol.toStringTag]="@libp2p/noise";[st]=["@libp2p/c\
onnection-encryption","@libp2p/noise"];async secureOutbound(e,t){const r=e.log?.newScope("noise")??this.log,s=Aa(e,{lengthEncoder:Xa,
lengthDecoder:Qa,maxDataLength:Vi}),i=await this.performHandshakeInitiator(s,this.components.privateKey,r,t?.remotePeer?.
publicKey,t),o=Jt(i.payload.identityKey);return{connection:$g(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,
remotePeer:Ft(o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}getStreamMuxer(e){
if(e==null||e.length===0)return;const t=this.components.upgrader.getStreamMuxers();if(t!=null)for(const r of e){const s=t.
get(r);if(s!=null)return s}if(e.length)throw new wu("Early muxer negotiation was requested but the initiator and respond\
er had no common muxers")}async secureInbound(e,t){const r=e.log?.newScope("noise")??this.log,s=Aa(e,{lengthEncoder:Xa,lengthDecoder:Qa,
maxDataLength:Vi}),i=await this.performHandshakeResponder(s,this.components.privateKey,r,t?.remotePeer?.publicKey,t),o=Jt(
i.payload.identityKey);return{connection:$g(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,remotePeer:Ft(
o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}async performHandshakeInitiator(e,t,r,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await UF(
{connection:e,privateKey:t,remoteIdentityKey:s,log:r.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}async performHandshakeResponder(e,t,r,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await OF(
{connection:e,privateKey:t,remoteIdentityKey:s,log:r.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}}function zF(n={}){return e=>new BF(e,
n)}var ph;(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.id!=null&&(r.uint32(
10),r.bytes(t.id)),t.pubkey!=null&&(r.uint32(18),Za.codec().encode(t.pubkey,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.id=t.bytes();break}case 2:{
i.pubkey=Za.codec().decode(t,t.uint32(),{limits:s.limits?.pubkey});break}default:{t.skipType(a&7);break}}}return i})),e),
n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(ph||(ph={}));var Ir;(function(n){n.RSA="RSA",n.Ed25519="\
Ed25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Ir||(Ir={}));var gh;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed2\
5519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(gh||(gh={}));(function(n){n.codec=()=>IS(gh)})(Ir||(Ir={}));var Za;
(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.Type!=null&&(r.uint32(8),
Ir.codec().encode(t.Type,r)),t.Data!=null&&t.Data.byteLength>0&&(r.uint32(18),r.bytes(t.Data)),s.lengthDelimited!==!1&&r.
ldelim()},(t,r,s={})=>{const i={Data:Nn(0)},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{
i.Type=Ir.codec().decode(t);break}case 2:{i.Data=t.bytes();break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=
t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(Za||(Za={}));const VF="/plaintext/2.0.0";class qF{protocol=VF;privateKey;log;constructor(e){
this.privateKey=e.privateKey,this.log=e.logger.forComponent("libp2p:plaintext")}[Symbol.toStringTag]="@libp2p/plaintext";[st]=[
"@libp2p/connection-encryption"];async secureInbound(e,t){return this._encrypt(e,t)}async secureOutbound(e,t){return this.
_encrypt(e,t)}async _encrypt(e,t){const r=e.log?.newScope("plaintext")??this.log,s=Ut(e).pb(ph);r("write pubkey exchange\
 to peer %p",t?.remotePeer);const i=this.privateKey.publicKey;await s.write({id:i.toMultihash().bytes,pubkey:{Type:Ir[i.
type],Data:i.raw}},t);const o=await s.read(t);let a;try{if(o.pubkey==null)throw new oa("Public key missing");if(o.pubkey.
Data.byteLength===0)throw new oa("Public key data too short");if(o.id==null)throw new oa("Remote id missing");const c=MS(
o.pubkey.Data);if(a=Ft(c),!PS(a.toMultihash().bytes,o.id))throw new wu("Public key did not match id")}catch(c){throw r.error(
"invalid public key - %e",c),new wu(`Invalid public key - ${c.message}`)}if(t?.remotePeer!=null&&!a.equals(t?.remotePeer))
throw new Ph;return r("plaintext key exchange completed successfully with peer %p",a),{connection:s.unwrap().unwrap(),remotePeer:a}}}
function WF(){return n=>new qF(n)}function pn(n=0){return new Uint8Array(n)}function mh(n=0){return new Uint8Array(n)}function KF(n){
return n?.buffer instanceof ArrayBuffer}function GF(n){if(KF(n))return n;const e=n.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function kg(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=mh(e);let r=0;for(const s of n)t.set(
s,r),r+=s.length;return GF(t)}function HF(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.
byteLength;t++)if(n[t]!==e[t])return!1;return!0}const tv=Symbol.for("@achingbrain/uint8arraylist");function Lg(n,e){if(e==
null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{
buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Oo(n){return!!n?.[tv]}let nv=class ma{bufs;length;[tv]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(Oo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Oo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=Lg(this.bufs,e);return t.buf[t.index]}set(e,t){const r=Lg(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Oo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return kg(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:kg(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ma;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Oo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=mh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=pn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=pn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=pn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=mh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=pn(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=pn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=pn(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=pn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=pn(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ma)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!HF(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ma;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};var ue;(function(n){n[n.Data=
0]="Data",n[n.WindowUpdate=1]="WindowUpdate",n[n.Ping=2]="Ping",n[n.GoAway=3]="GoAway"})(ue||(ue={}));var H;(function(n){
n[n.SYN=1]="SYN",n[n.ACK=2]="ACK",n[n.FIN=4]="FIN",n[n.RST=8]="RST"})(H||(H={}));Object.values(H).filter(n=>typeof n!="s\
tring");const jF=0;var at;(function(n){n[n.NormalTermination=0]="NormalTermination",n[n.ProtocolError=1]="ProtocolError",
n[n.InternalError=2]="InternalError"})(at||(at={}));const sr=12;class Vc extends Error{static name="ProtocolError";reason;constructor(e,t){
super(e),this.name="ProtocolError",this.reason=t}}function XF(n){return n?.reason!==null}class Jr extends Vc{static name="\
InvalidFrameError";constructor(e="The frame was invalid"){super(e,at.ProtocolError),this.name="InvalidFrameError"}}class QF extends Vc{static name="\
UnRequestedPingError";constructor(e="Un-requested ping error"){super(e,at.ProtocolError),this.name="UnRequestedPingError"}}
class YF extends Vc{static name="NotMatchingPingError";constructor(e="Not matching ping error"){super(e,at.ProtocolError),
this.name="NotMatchingPingError"}}class JF extends Vc{static name="ReceiveWindowExceededError";constructor(e="Receive wi\
ndow exceeded"){super(e,at.ProtocolError),this.name="ReceiveWindowExceededError"}}const rv=256*1024,ZF=16*1024*1024,Bo={
enableKeepAlive:!0,keepAliveInterval:3e4,maxInboundStreams:1e3,maxOutboundStreams:1e3};function e5(n){if(n.keepAliveInterval!=
null&&n.keepAliveInterval<=0)throw new L("keep-alive interval must be positive");if(n.maxInboundStreams!=null&&n.maxInboundStreams<
0)throw new L("max inbound streams must be larger or equal 0");if(n.maxOutboundStreams!=null&&n.maxOutboundStreams<0)throw new L(
"max outbound streams must be larger or equal 0");if(n.maxMessageSize!=null&&n.maxMessageSize<1024)throw new L("MaxMessa\
geSize must be greater than a kilobyte");if(n.streamOptions?.initialStreamWindowSize!=null&&n.streamOptions?.initialStreamWindowSize<
rv)throw new L("InitialStreamWindowSize must be larger or equal 256 kB");if(n.streamOptions?.maxStreamWindowSize!=null&&
n.streamOptions?.initialStreamWindowSize!=null&&n.streamOptions?.maxStreamWindowSize<n.streamOptions?.initialStreamWindowSize)
throw new L("MaxStreamWindowSize must be larger than the InitialStreamWindowSize");if(n.streamOptions?.maxStreamWindowSize!=
null&&n.streamOptions?.maxStreamWindowSize>2**32-1)throw new L("MaxStreamWindowSize must be less than equal MAX_UINT32")}
function t5(n){return n.header.type===ue.Data&&n.data!==null}const Rg=2**24;function n5(n){if(n[0]!==jF)throw new Jr("In\
valid frame version");return{type:n[1],flag:(n[2]<<8)+n[3],streamID:n[4]*Rg+(n[5]<<16)+(n[6]<<8)+n[7],length:n[8]*Rg+(n[9]<<
16)+(n[10]<<8)+n[11]}}let r5=class{buffer;constructor(){this.buffer=new nv}*emitFrames(e){for(this.buffer.append(e);;){const t=this.
readFrame();if(t===void 0)break;yield t}}readFrame(){let e=sr;if(this.buffer.byteLength<sr)return;const t=n5(this.buffer.
subarray(0,sr));if(t.type===ue.Data){if(e+=t.length,this.buffer.byteLength<e)return;const r=this.buffer.sublist(sr,e);return this.
buffer.consume(e),{header:t,data:r}}return this.buffer.consume(e),{header:t}}};function Ng(n){const e=new Uint8Array(sr);
return e[1]=n.type,e[2]=n.flag>>>8,e[3]=n.flag,e[4]=n.streamID>>>24,e[5]=n.streamID>>>16,e[6]=n.streamID>>>8,e[7]=n.streamID,
e[8]=n.length>>>24,e[9]=n.length>>>16,e[10]=n.length>>>8,e[11]=n.length,e}var Ze;(function(n){n[n.Init=0]="Init",n[n.SYNSent=
1]="SYNSent",n[n.SYNReceived=2]="SYNReceived",n[n.Established=3]="Established",n[n.Finished=4]="Finished",n[n.Paused=5]=
"Paused"})(Ze||(Ze={}));class s5 extends Mb{streamId;state;sendWindowCapacity;recvWindow;recvWindowCapacity;maxStreamWindowSize;epochStart;getRTT;sendFrame;constructor(e){
const t=e.initialStreamWindowSize??rv;super({...e,maxMessageSize:t-sr}),this.streamId=e.streamId,this.state=e.state,this.
sendWindowCapacity=t,this.recvWindow=t,this.recvWindowCapacity=this.recvWindow,this.maxStreamWindowSize=e.maxStreamWindowSize??
ZF,this.epochStart=Date.now(),this.getRTT=e.getRTT,this.sendFrame=e.sendFrame;const r=()=>{this.state=Ze.Finished};this.
addEventListener("close",r)}sendData(e){const t=e.byteLength;let r=0,s=!0;for(this.log?.trace("send window capacity is %\
d bytes",this.sendWindowCapacity);e.byteLength>0;){if(this.sendWindowCapacity===0){s=!1,this.log?.trace("sent %d/%d byte\
s, exhausted send window, waiting for window update",r,t);break}const i=Math.min(this.sendWindowCapacity,e.byteLength),o=this.
getSendFlags(),a=e.sublist(0,i);e.consume(i);const c=this.sendFrame({type:ue.Data,flag:o,streamID:this.streamId,length:i},
a);if(this.sendWindowCapacity-=i,r+=i,!c){s=c,this.log.trace("sent %d/%d bytes, wait for muxer to have more send capacit\
y",r,t);break}}return{sentBytes:r,canSendMore:s}}sendReset(){this.sendFrame({type:ue.WindowUpdate,flag:H.RST,streamID:this.
streamId,length:0})}async sendCloseWrite(){const e=this.getSendFlags()|H.FIN;this.sendFrame({type:ue.WindowUpdate,flag:e,
streamID:this.streamId,length:0})}async sendCloseRead(e){e?.signal?.throwIfAborted()}sendPause(){this.state=Ze.Paused}sendResume(){
this.state=Ze.Established,this.sendWindowUpdate()}handleWindowUpdate(e){this.processFlags(e.header.flag),this.sendWindowCapacity+=
e.header.length,this.maxMessageSize=this.sendWindowCapacity-sr,this.maxMessageSize<0&&(this.maxMessageSize=0),this.maxMessageSize!==
0&&this.writeBuffer.byteLength>0&&(this.log?.trace("window update of %d bytes allows more data to be sent, have %d bytes\
 queued, sending data %s",e.header.length,this.writeBuffer.byteLength,this.sendingData),this.safeDispatchEvent("drain"))}handleData(e){
if(!t5(e))throw new Jr("Frame was not data frame");if(this.processFlags(e.header.flag),this.recvWindowCapacity<e.header.
length)throw new JF("Receive window exceeded");this.recvWindowCapacity-=e.header.length,this.onData(e.data),this.sendWindowUpdate()}processFlags(e){
(e&H.ACK)===H.ACK&&this.state===Ze.SYNSent&&(this.state=Ze.Established),(e&H.FIN)===H.FIN&&this.onRemoteCloseWrite(),(e&
H.RST)===H.RST&&this.onRemoteReset()}getSendFlags(){switch(this.state){case Ze.Init:return this.state=Ze.SYNSent,H.SYN;case Ze.
SYNReceived:return this.state=Ze.Established,H.ACK;default:return 0}}sendWindowUpdate(){if(this.state===Ze.Paused){this.
epochStart=Date.now();return}const e=this.getSendFlags(),t=Date.now(),r=this.getRTT();if(e===0&&r>-1&&t-this.epochStart<=
r*4&&(this.recvWindow=Math.min(this.recvWindow*2,this.maxStreamWindowSize)),this.recvWindowCapacity>=this.recvWindow&&e===
0)return;const s=this.recvWindow-this.recvWindowCapacity;this.recvWindowCapacity=this.recvWindow,this.epochStart=t,this.
sendFrame({type:ue.WindowUpdate,flag:e,streamID:this.streamId,length:s})}}function Fg(n){return{type:ue[n.type],flags:[(n.
flag&H.SYN)===H.SYN?"SYN":void 0,(n.flag&H.ACK)===H.ACK?"ACK":void 0,(n.flag&H.FIN)===H.FIN?"FIN":void 0,(n.flag&H.RST)===
H.RST?"RST":void 0].filter(Boolean),streamID:n.streamID,length:n.length}}const sv="/yamux/1.0.0";class i5{protocol=sv;_init;constructor(e={}){
this._init=e}[Symbol.toStringTag]="@libp2p/yamux";[st]=["@libp2p/stream-multiplexing"];createStreamMuxer(e){return new o5(
e,{...this._init})}}class o5 extends Ib{nextStreamID;nextPingID;activePing;rtt;client;localGoAway;remoteGoAway;numInboundStreams;numOutboundStreams;decoder;keepAlive;enableKeepAlive;keepAliveInterval;maxInboundStreams;maxOutboundStreams;constructor(e,t={}){
super(e,{...t,protocol:sv,name:"yamux"}),this.client=e.direction==="outbound",e5(t),this.enableKeepAlive=t.enableKeepAlive??
Bo.enableKeepAlive,this.keepAliveInterval=t.keepAliveInterval??Bo.keepAliveInterval,this.maxInboundStreams=t.maxInboundStreams??
Bo.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams??Bo.maxOutboundStreams,this.decoder=new r5,this.numInboundStreams=
0,this.numOutboundStreams=0,this.nextStreamID=this.client?1:2,this.nextPingID=0,this.rtt=-1,this.log.trace("muxer create\
d"),this.enableKeepAlive&&(this.log.trace("muxer keepalive enabled interval=%s",this.keepAliveInterval),this.keepAlive=Nb(
async r=>{try{await this.ping(r)}catch(s){this.log.error("ping error: %s",s)}},this.keepAliveInterval,{runImmediately:!0}),
this.keepAlive.start())}onData(e){for(const t of this.decoder.emitFrames(e))this.handleFrame(t)}onCreateStream(){if(this.
remoteGoAway!==void 0)throw new Gs("Muxer closed remotely");if(this.localGoAway!==void 0)throw new Gs("Muxer closed loca\
lly");const e=this.nextStreamID;if(this.nextStreamID+=2,this.numOutboundStreams>=this.maxOutboundStreams)throw new Jm("m\
ax outbound streams exceeded");this.log.trace("new outgoing stream id=%s",e);const t=this._newStream(e,Ze.Init,"outbound");
return this.numOutboundStreams++,queueMicrotask(()=>{t.sendWindowUpdate()}),t}async ping(e){if(this.remoteGoAway!==void 0)
throw new Gs("Muxer closed remotely");if(this.localGoAway!==void 0)throw new Gs("Muxer closed locally");if(this.activePing!=
null)return kt(this.activePing.promise,e?.signal);this.activePing=Object.assign(Promise.withResolvers(),{id:this.nextPingID++,
start:Date.now()}),this.sendPing(this.activePing.id);try{this.rtt=await kt(this.activePing.promise,e?.signal)}finally{this.
activePing=void 0}return this.rtt}getRTT(){return this.rtt}async close(e={}){if(this.status==="open")try{const t=e?.reason??
at.NormalTermination;this.log.trace("muxer close reason=%s",at[t]),await super.close(e),this.sendGoAway(t)}finally{this.
keepAlive?.stop()}}abort(e){if(this.status==="open")try{super.abort(e);let t=at.InternalError;XF(e)&&(t=e.reason),this.log.
error("muxer abort reason=%s error=%s",t,e),this.sendGoAway(t)}finally{this.keepAlive?.stop()}}onTransportClosed(){try{super.
onTransportClosed()}finally{this.keepAlive?.stop()}}_newStream(e,t,r){if(this.streams.find(i=>i.streamId===e)!=null)throw new L(
"Stream already exists with that id");const s=new s5({...this.streamOptions,id:`${e}`,streamId:e,state:t,direction:r,sendFrame:this.
sendFrame.bind(this),log:this.log.newScope(`${r}:${e}`),getRTT:this.getRTT.bind(this)});return s.addEventListener("close",
()=>{this.closeStream(e)},{once:!0}),s}closeStream(e){this.client===(e%2===0)?this.numInboundStreams--:this.numOutboundStreams--}handleFrame(e){
const{streamID:t,type:r,length:s}=e.header;if(this.log.trace("received frame %o",Fg(e.header)),t===0)switch(r){case ue.Ping:{
this.handlePing(e.header);return}case ue.GoAway:{this.handleGoAway(s);return}default:throw new Jr("Invalid frame type")}else
switch(e.header.type){case ue.Data:case ue.WindowUpdate:{this.handleStreamMessage(e);return}default:throw new Jr("Invali\
d frame type")}}handlePing(e){if(e.flag===H.SYN)this.log.trace("received ping request pingId=%s",e.length),this.sendPing(
e.length,H.ACK);else if(e.flag===H.ACK)this.log.trace("received ping response pingId=%s",e.length),this.handlePingResponse(
e.length);else throw new Jr("Invalid frame flag")}handlePingResponse(e){if(this.activePing===void 0)throw new QF("ping n\
ot requested");if(this.activePing.id!==e)throw new YF("ping doesn't match our id");this.activePing.resolve(Date.now()-this.
activePing.start)}handleGoAway(e){this.log.trace("received GoAway reason=%s",at[e]??"unknown"),this.remoteGoAway=e,e===at.
NormalTermination?this.onTransportClosed():this.abort(new Error("Remote sent GoAway"))}handleStreamMessage(e){const{streamID:t,
flag:r,type:s}=e.header;(r&H.SYN)===H.SYN&&this.incomingStream(t);const i=this.streams.find(o=>o.streamId===t);if(i===void 0){
this.log.trace("frame for missing stream id=%s",t);return}switch(s){case ue.WindowUpdate:{i.handleWindowUpdate(e);return}case ue.
Data:{i.handleData(e);return}default:throw new Error("unreachable")}}incomingStream(e){if(this.client!==(e%2===0))throw new L(
"Both endpoints are clients");if(this.streams.find(r=>r.streamId===e))return;if(this.log.trace("new incoming stream id=%\
s",e),this.localGoAway!==void 0){this.sendFrame({type:ue.WindowUpdate,flag:H.RST,streamID:e,length:0});return}if(this.numInboundStreams>=
this.maxInboundStreams){this.log("maxIncomingStreams exceeded, forcing stream reset"),this.sendFrame({type:ue.WindowUpdate,
flag:H.RST,streamID:e,length:0});return}const t=this._newStream(e,Ze.SYNReceived,"inbound");this.numInboundStreams++,this.
onRemoteStream(t)}sendFrame(e,t){let r;if(e.type===ue.Data){if(t==null)throw new Jr("Invalid frame");r=new nv(Ng(e),t)}else
r=Ng(e);return this.log.trace("sending frame %o",Fg(e)),this.send(r)}sendPing(e,t=H.SYN){t===H.SYN?this.log.trace("sendi\
ng ping request pingId=%s",e):this.log.trace("sending ping response pingId=%s",e),this.sendFrame({type:ue.Ping,flag:t,streamID:0,
length:e})}sendGoAway(e=at.NormalTermination){this.log("sending GoAway reason=%s",at[e]),this.localGoAway=e,this.sendFrame(
{type:ue.GoAway,flag:0,streamID:0,length:e})}}function a5(n={}){return()=>new i5(n)}const c5=Symbol.for("@libp2p/pubsub");
let l5=class{entries;validityMs;lastPruneTime=0;constructor(e){this.entries=new Map,this.validityMs=e.validityMs}put(e,t){
this.entries.set(e,{value:t,validUntilMs:Date.now()+this.validityMs}),this.prune()}prune(){const e=Date.now();if(!(e-this.
lastPruneTime<200)){this.lastPruneTime=e;for(const[t,r]of this.entries.entries())if(r.validUntilMs<e)this.entries.delete(
t);else break}}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);return t!=null&&t.validUntilMs>=Date.
now()?t.value:void 0}clear(){this.entries=new Map,this.lastPruneTime=0}};var qi;(function(n){(function(t){let r;t.codec=
()=>(r==null&&(r=se((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.subscribe!=null&&(i.uint32(8),i.bool(s.subscribe)),s.
topic!=null&&(i.uint32(18),i.string(s.topic)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:
s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.subscribe=s.bool();break}case 2:{a.topic=s.string();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.SubOpts||(n.SubOpts=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.from!=null&&(i.uint32(
10),i.bytes(s.from)),s.data!=null&&(i.uint32(18),i.bytes(s.data)),s.sequenceNumber!=null&&(i.uint32(26),i.bytes(s.sequenceNumber)),
s.topic!=null&&(i.uint32(34),i.string(s.topic)),s.signature!=null&&(i.uint32(42),i.bytes(s.signature)),s.key!=null&&(i.uint32(
50),i.bytes(s.key)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.
uint32();switch(l>>>3){case 1:{a.from=s.bytes();break}case 2:{a.data=s.bytes();break}case 3:{a.sequenceNumber=s.bytes();
break}case 4:{a.topic=s.string();break}case 5:{a.signature=s.bytes();break}case 6:{a.key=s.bytes();break}default:{s.skipType(
l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.Message||(n.Message={}));let e;
n.codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.subscriptions!=null)for(const i of t.subscriptions)
r.uint32(10),n.SubOpts.codec().encode(i,r);if(t.messages!=null)for(const i of t.messages)r.uint32(18),n.Message.codec().
encode(i,r);t.control!=null&&(r.uint32(26),ec.codec().encode(t.control,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={subscriptions:[],messages:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.
limits?.subscriptions!=null&&i.subscriptions.length===s.limits.subscriptions)throw new ae('Decode error - map field "sub\
scriptions" had too many elements');i.subscriptions.push(n.SubOpts.codec().decode(t,t.uint32(),{limits:s.limits?.subscriptions$}));
break}case 2:{if(s.limits?.messages!=null&&i.messages.length===s.limits.messages)throw new ae('Decode error - map field \
"messages" had too many elements');i.messages.push(n.Message.codec().decode(t,t.uint32(),{limits:s.limits?.messages$}));
break}case 3:{i.control=ec.codec().decode(t,t.uint32(),{limits:s.limits?.control});break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(qi||(qi={}));var ec;(function(n){let e;n.
codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.ihave!=null)for(const i of t.ihave)r.uint32(
10),tc.codec().encode(i,r);if(t.iwant!=null)for(const i of t.iwant)r.uint32(18),nc.codec().encode(i,r);if(t.graft!=null)
for(const i of t.graft)r.uint32(26),rc.codec().encode(i,r);if(t.prune!=null)for(const i of t.prune)r.uint32(34),sc.codec().
encode(i,r);s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={ihave:[],iwant:[],graft:[],prune:[]},o=r==null?t.len:
t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.ihave!=null&&i.ihave.length===s.limits.ihave)
throw new ae('Decode error - map field "ihave" had too many elements');i.ihave.push(tc.codec().decode(t,t.uint32(),{limits:s.
limits?.ihave$}));break}case 2:{if(s.limits?.iwant!=null&&i.iwant.length===s.limits.iwant)throw new ae('Decode error - m\
ap field "iwant" had too many elements');i.iwant.push(nc.codec().decode(t,t.uint32(),{limits:s.limits?.iwant$}));break}case 3:{
if(s.limits?.graft!=null&&i.graft.length===s.limits.graft)throw new ae('Decode error - map field "graft" had too many el\
ements');i.graft.push(rc.codec().decode(t,t.uint32(),{limits:s.limits?.graft$}));break}case 4:{if(s.limits?.prune!=null&&
i.prune.length===s.limits.prune)throw new ae('Decode error - map field "prune" had too many elements');i.prune.push(sc.codec().
decode(t,t.uint32(),{limits:s.limits?.prune$}));break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.
codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(ec||(ec={}));var tc;(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{
if(s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(10),r.string(t.topic)),t.messageIDs!=null)for(const i of t.
messageIDs)r.uint32(18),r.bytes(i);s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={messageIDs:[]},o=r==null?t.
len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}case 2:{if(s.limits?.messageIDs!=
null&&i.messageIDs.length===s.limits.messageIDs)throw new ae('Decode error - map field "messageIDs" had too many element\
s');i.messageIDs.push(t.bytes());break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=
(t,r)=>oe(t,n.codec(),r)})(tc||(tc={}));var nc;(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.lengthDelimited!==
!1&&r.fork(),t.messageIDs!=null)for(const i of t.messageIDs)r.uint32(10),r.bytes(i);s.lengthDelimited!==!1&&r.ldelim()},
(t,r,s={})=>{const i={messageIDs:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.
limits?.messageIDs!=null&&i.messageIDs.length===s.limits.messageIDs)throw new ae('Decode error - map field "messageIDs" \
had too many elements');i.messageIDs.push(t.bytes());break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(
t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(nc||(nc={}));var rc;(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{
s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(10),r.string(t.topic)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}default:{
t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(rc||(rc={}));var sc;
(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(
10),r.string(t.topic)),t.peers!=null)for(const i of t.peers)r.uint32(18),ic.codec().encode(i,r);t.backoff!=null&&(r.uint32(
24),r.uint64(t.backoff)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={peers:[]},o=r==null?t.len:t.pos+r;for(;t.
pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}case 2:{if(s.limits?.peers!=null&&i.peers.length===
s.limits.peers)throw new ae('Decode error - map field "peers" had too many elements');i.peers.push(ic.codec().decode(t,t.
uint32(),{limits:s.limits?.peers$}));break}case 3:{i.backoff=t.uint64();break}default:{t.skipType(a&7);break}}}return i})),
e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(sc||(sc={}));var ic;(function(n){let e;n.codec=()=>(e==
null&&(e=se((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.peerID!=null&&(r.uint32(10),r.bytes(t.peerID)),t.signedPeerRecord!=
null&&(r.uint32(18),r.bytes(t.signedPeerRecord)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={},o=r==null?t.
len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.peerID=t.bytes();break}case 2:{i.signedPeerRecord=
t.bytes();break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),
r)})(ic||(ic={}));class u5 extends he{peerId;shutDownController;inboundPb;outboundPb;constructor(e){super(),this.peerId=
e,this.shutDownController=new AbortController}attachInboundStream(e,t){this.inboundPb=Ut(e,t).pb(qi),Promise.resolve().then(
async()=>{for(;;){if(this.inboundPb==null)return;const r=await this.inboundPb.read({signal:this.shutDownController.signal});
this.safeDispatchEvent("message",{detail:r})}}).catch(r=>{this.inboundPb?.unwrap().unwrap().abort(r)})}attachOutboundStream(e,t){
this.outboundPb=Ut(e,t).pb(qi)}write(e){this.outboundPb!=null&&this.outboundPb.write(e,{signal:this.shutDownController.signal}).
catch(t=>{this.outboundPb?.unwrap().unwrap().abort(t)})}close(){this.shutDownController.abort(),Promise.all([this.inboundPb?.
unwrap().unwrap().close().catch(e=>{this.inboundPb?.unwrap().unwrap().abort(e)}),this.outboundPb?.unwrap().unwrap().close().
catch(e=>{this.inboundPb?.unwrap().unwrap().abort(e)})]).finally(()=>{this.safeDispatchEvent("close")})}}function h5(){return BigInt(
`0x${je(lb(8),"base16")}`)}const d5=(n,e)=>{const t=Dr(e.toString(16).padStart(16,"0"),"base16"),r=$r(n),s=new Uint8Array(
r.byteLength+t.length);return s.set(r,0),s.set(t,r.byteLength),s},f5=n=>sb.encode(n),p5=async n=>{if(n.sequenceNumber==null||
n.from==null||n.signature==null)return!1;const e=Tr(mc(n.from));if(e.publicKey!=null)return!0;if(n.key!=null){const t=n.
key;return Ft(Jt(t)).equals(e)}return!1},g5=async n=>{if(n.from==null)throw new Y("RPC message was missing from");if(!await p5(
n))return{type:"unsigned",topic:n.topic??"",data:n.data??new Uint8Array(0)};const e=Tr(mc(n.from)),t=n.key??e.publicKey;
if(t==null)throw new Y("RPC message was missing public key");return{type:"signed",from:e,topic:n.topic??"",sequenceNumber:b5(
n.sequenceNumber??new Uint8Array(0)),data:n.data??new Uint8Array(0),signature:n.signature??new Uint8Array(0),key:t instanceof
Uint8Array?Jt(t):t}},Md=n=>n.type==="signed"?{from:n.from.toMultihash().bytes,data:n.data,sequenceNumber:m5(n.sequenceNumber),
topic:n.topic,signature:n.signature,key:n.key?$r(n.key):void 0}:{data:n.data,topic:n.topic},m5=n=>{let e=n.toString(16);
return e.length%2!==0&&(e=`0${e}`),Dr(e,"base16")},b5=n=>BigInt(`0x${je(n,"base16")}`),iv=Dr("libp2p-pubsub:");async function y5(n,e,t){
const r={type:"signed",topic:e.topic,data:e.data,sequenceNumber:e.sequenceNumber,from:Zm(n)},s=ji([iv,t(Md(r)).subarray()]);
return r.signature=await n.sign(s),r.key=n.publicKey,r}async function w5(n,e){if(n.type!=="signed")throw new Error('Mess\
age type must be "signed" to be verified');if(n.signature==null)throw new Error("Message must contain a signature to be \
verified");if(n.from==null)throw new Error("Message must contain a from property to be verified");const t=ji([iv,e({...Md(
n),signature:void 0,key:void 0}).subarray()]);return v5(n).verify(t,n.signature)}function v5(n){if(n.type!=="signed")throw new Error(
'Message type must be "signed" to have a public key');if(n.from==null)throw new Error("Could not get the public key from\
 the originator id");if(n.key!=null)return n.key;if(n.from.publicKey!=null)return n.from.publicKey;throw new Error("Coul\
d not get the public key from the originator id")}class S5 extends he{log;started;topics;subscriptions;peers;globalSignaturePolicy;canRelayMessage;emitSelf;topicValidators;queue;protocol;components;_registrarTopologyId;maxInboundStreams;maxOutboundStreams;seenCache;constructor(e,t){
super(),this.log=e.logger.forComponent("libp2p:floodsub"),this.components=e,this.protocol=t.protocol??A5,this.started=!1,
this.topics=new Map,this.subscriptions=new Set,this.peers=new Lr,this.globalSignaturePolicy=t.globalSignaturePolicy==="S\
trictNoSign"?"StrictNoSign":"StrictSign",this.canRelayMessage=t.canRelayMessage??!0,this.emitSelf=t.emitSelf??!1,this.topicValidators=
new Map,this.queue=new Pw({concurrency:t.messageProcessingConcurrency??10}),this.maxInboundStreams=t.maxInboundStreams??
1,this.maxOutboundStreams=t.maxOutboundStreams??1,this.seenCache=new l5({validityMs:t?.seenTTL??3e4}),this._onIncomingStream=
this._onIncomingStream.bind(this),this._onPeerConnected=this._onPeerConnected.bind(this),this._onPeerDisconnected=this._onPeerDisconnected.
bind(this)}[c5]=!0;[Symbol.toStringTag]="@libp2p/floodsub";[st]=["@libp2p/pubsub"];[us]=["@libp2p/identify"];async start(){
this.started||(this.log("starting"),await this.components.registrar.handle(this.protocol,this._onIncomingStream,{maxInboundStreams:this.
maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams}),this._registrarTopologyId=await this.components.registrar.
register(this.protocol,{onConnect:this._onPeerConnected,onDisconnect:this._onPeerDisconnected}),this.log("started"),this.
started=!0)}async stop(){if(!this.started)return;const e=this.components.registrar;this._registrarTopologyId!=null&&e.unregister(
this._registrarTopologyId),await e.unhandle(this.protocol),this.log("stopping");for(const t of this.peers.values())t.close();
this.peers.clear(),this.subscriptions=new Set,this.started=!1,this.log("stopped")}isStarted(){return this.started}_onIncomingStream(e,t){
this.addPeer(t.remotePeer,e).attachInboundStream(e)}async _onPeerConnected(e,t){if(this.log("connected %p",e),t.streams.
find(i=>i.direction==="outbound"&&i.protocol===this.protocol)){this.log("outbound pubsub stream already present on conne\
ction from %p",e);return}const r=await t.newStream(this.protocol);this.addPeer(e,r).attachOutboundStream(r),this.send(e,
{subscriptions:Array.from(this.subscriptions).map(i=>i.toString()),subscribe:!0})}_onPeerDisconnected(e,t){this.log("con\
nection ended %p",e),this._removePeer(e)}addPeer(e,t){const r=this.peers.get(e);if(r!=null)return r;this.log("new peer %\
p",e);const s=new u5(e);return this.peers.set(e,s),s.addEventListener("message",i=>{const o=i.detail,a=[];for(const c of o.
messages??[]){if(c.from==null||c.data==null||c.topic==null){this.log("message from %p was missing from, data or topic fi\
elds, dropping",e);continue}a.push({from:c.from,data:c.data,topic:c.topic,sequenceNumber:c.sequenceNumber??void 0,signature:c.
signature??void 0,key:c.key??void 0})}this.processRpc(s,{subscriptions:(o.subscriptions??[]).map(c=>({subscribe:!!c.subscribe,
topic:c.topic??""})),messages:a}).catch(c=>{this.log(c)})}),s.addEventListener("close",()=>this._removePeer(e),{once:!0}),
s}_removePeer(e){const t=this.peers.get(e);if(t!=null){t.close(),this.log("delete peer %p",e),this.peers.delete(e);for(const r of this.
topics.values())r.delete(e)}}async processRpc(e,t){this.log("rpc from %p",e.peerId);const{subscriptions:r,messages:s}=t;
return r!=null&&r.length>0&&(this.log("subscription update from %p",e.peerId),r.forEach(i=>{this.processRpcSubOpt(e.peerId,
i)}),super.dispatchEvent(new CustomEvent("subscription-change",{detail:{peerId:e.peerId,subscriptions:r.map(({topic:i,subscribe:o})=>({
topic:`${i??""}`,subscribe:!!o}))}}))),s!=null&&s.length>0&&(this.log("messages from %p",e.peerId),this.queue.addAll(s.map(
i=>async()=>{if(i.topic==null||!this.subscriptions.has(i.topic)&&!this.canRelayMessage)return this.log("received message\
 we didn't subscribe to. Dropping."),!1;try{const o=await g5(i);await this.processMessage(e.peerId,o)}catch(o){this.log.
error("failed to queue messages from %p - %e",e.peerId,o)}})).catch(i=>{this.log(i)})),!0}processRpcSubOpt(e,t){const r=t.
topic;if(r==null)return;let s=this.topics.get(r);s==null&&(s=new lr,this.topics.set(r,s)),t.subscribe===!0?s.add(e):s.delete(
e)}async processMessage(e,t){if(this.components.peerId.equals(e)&&!this.emitSelf)return;const r=await this.getMsgId(t),s=je(
r,"base64");if(!this.seenCache.has(s)){this.seenCache.put(s,!0);try{await this.validate(e,t)}catch(i){this.log("Message \
is invalid, dropping it. %O",i);return}this.subscriptions.has(t.topic)&&(!this.components.peerId.equals(e)||this.emitSelf)&&
super.dispatchEvent(new CustomEvent("message",{detail:t})),await this.publishMessage(e,t)}}getMsgId(e){switch(this.globalSignaturePolicy){case"\
StrictSign":if(e.type!=="signed")throw new Y('Message type should be "signed" when signature policy is StrictSign but it\
 was not');if(e.sequenceNumber==null)throw new Y("Need sequence number when signature policy is StrictSign but it was mi\
ssing");if(e.key==null)throw new Y("Need key when signature policy is StrictSign but it was missing");return d5(e.key,e.
sequenceNumber);case"StrictNoSign":return f5(e.data);default:throw new Y("Cannot get message id: unhandled signature pol\
icy")}}encodeMessage(e){return qi.Message.encode(e)}send(e,t){const{messages:r,subscriptions:s,subscribe:i}=t;this.sendRpc(
e,{subscriptions:(s??[]).map(o=>({topic:o,subscribe:!!i})),messages:(r??[]).map(Md)})}sendRpc(e,t){const r=this.peers.get(
e);if(r==null){this.log.error("cannot send RPC to %p as there are no streams to it available",e);return}r.write(t)}async validate(e,t){
switch(this.globalSignaturePolicy){case"StrictNoSign":if(t.type!=="unsigned")throw new Y('Message type should be "unsign\
ed" when signature policy is StrictNoSign but it was not');if(t.signature!=null)throw new Y("StrictNoSigning: signature \
should not be present");if(t.key!=null)throw new Y("StrictNoSigning: key should not be present");if(t.sequenceNumber!=null)
throw new Y("StrictNoSigning: seqno should not be present");break;case"StrictSign":if(t.type!=="signed")throw new Y('Mes\
sage type should be "signed" when signature policy is StrictSign but it was not');if(t.signature==null)throw new Y("Stri\
ctSigning: Signing required and no signature was present");if(t.sequenceNumber==null)throw new Y("StrictSigning: Signing\
 required and no sequenceNumber was present");if(!await w5(t,this.encodeMessage.bind(this)))throw new Y("StrictSigning: \
Invalid message signature");break;default:throw new Y("Cannot validate message: unhandled signature policy")}const s=this.
topicValidators.get(t.topic);if(s!=null){const i=await s(e,t);if(i===oc.Reject||i===oc.Ignore)throw new Y("Message valid\
ation failed")}}async buildMessage(e){switch(this.globalSignaturePolicy){case"StrictSign":return y5(this.components.privateKey,
e,this.encodeMessage.bind(this));case"StrictNoSign":return Promise.resolve({type:"unsigned",...e});default:throw new Y("\
Cannot build message: unhandled signature policy")}}getSubscribers(e){if(!this.started)throw new Ai("not started yet");if(e==
null)throw new L("Topic is required");const t=this.topics.get(e.toString());return t==null?[]:Array.from(t.values())}async publish(e,t){
if(!this.started)throw new Error("Pubsub has not started");const r={from:this.components.peerId,topic:e,data:t??new Uint8Array(
0),sequenceNumber:h5()};this.log("publish topic: %s from: %p data: %m",e,r.from,r.data);const s=await this.buildMessage(
r);let i=!1;this.emitSelf&&this.subscriptions.has(e)&&(i=!0,super.dispatchEvent(new CustomEvent("message",{detail:s})));
const o=await this.publishMessage(this.components.peerId,s);return i&&(o.recipients=[...o.recipients,this.components.peerId]),
o}async publishMessage(e,t){const r=this.getSubscribers(t.topic),s=[];return r==null||r.length===0?(this.log("no peers a\
re subscribed to topic %s",t.topic),{recipients:s}):(r.forEach(i=>{if(this.components.peerId.equals(i)){this.log("not se\
nding message on topic %s to myself",t.topic);return}if(i.equals(e)){this.log("not sending message on topic %s to sender\
 %p",t.topic,i);return}this.log("publish msgs on topics %s %p",t.topic,i),s.push(i),this.send(i,{messages:[t]})}),{recipients:s})}subscribe(e){
if(!this.started)throw new Error("Pubsub has not started");if(!this.subscriptions.has(e)){this.log("subscribe to topic: \
%s",e),this.subscriptions.add(e);for(const t of this.peers.keys())this.send(t,{subscriptions:[e],subscribe:!0})}}unsubscribe(e){
if(!this.started)throw new Error("Pubsub is not started");if(this.subscriptions.has(e)){this.log("unsubscribe from %s",e),
this.subscriptions.delete(e);for(const t of this.peers.keys())this.send(t,{subscriptions:[e],subscribe:!1})}}getTopics(){
if(!this.started)throw new Error("Pubsub is not started");return Array.from(this.subscriptions)}getPeers(){if(!this.started)
throw new Error("Pubsub is not started");return Array.from(this.peers.keys())}}const A5="/floodsub/1.0.0";var oc;(function(n){
n.Accept="accept",n.Ignore="ignore",n.Reject="reject"})(oc||(oc={}));function _5(n={}){return e=>new S5(e,n)}const Ps=1e3,
Pd=60*Ps,Ug="/floodsub/1.0.0",Og="/meshsub/1.0.0",E5="/meshsub/1.1.0",ql="/meshsub/1.2.0",C5=6,x5=4,I5=12,M5=4,P5=2,T5=5,
D5=3,$5=6,k5=.25,L5=3,Bg=100,R5=Ps,N5=Pd,F5=16,U5=Pd,O5=10*Ps,B5=15,z5=300,V5=Ps,q5=60,W5=2,K5=10*Ps,Xr=5e3,G5=10,H5=3*Ps,
j5=2*Pd,X5=120*1e3,Q5="ERR_TOPIC_VALIDATOR_REJECT",Y5="ERR_TOPIC_VALIDATOR_IGNORE",J5=0,Z5=128,eU=1e3,tU=1e3,nU=1,rU=512,
sU=512,iU=8,Td=1024*1024*4;class oU extends Error{name="InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class ov extends Error{name="\
InvalidDataLengthError";code="ERR_MSG_DATA_TOO_LONG"}class aU extends Error{name="InvalidDataLengthLengthError";code="ER\
R_MSG_LENGTH_TOO_LONG"}class zg extends Error{name="UnexpectedEOFError";code="ERR_UNEXPECTED_EOF"}function av(n){return n[Symbol.
asyncIterator]!=null}function cv(n,e){if(n.byteLength>e)throw new ov("Message length too long")}const qc=n=>{const e=ib(
n),t=rb(e);return TS(n,t),qc.bytes=e,t};qc.bytes=0;function Dd(n,e){e=e??{};const t=e.lengthEncoder??qc,r=e?.maxDataLength??
Td;function*s(i){cv(i,r);const o=t(i.byteLength);o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:
yield*i}return av(n)?(async function*(){for await(const i of n)yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}
Dd.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??qc,r=e?.maxDataLength??Td;return cv(n,r),new $n(t(n.byteLength),n)};var Zn;
(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=1]="DATA"})(Zn||(Zn={}));const $d=n=>{const e=DS(n);return $d.bytes=ib(e),e};
$d.bytes=0;function bh(n,e){const t=new $n;let r=Zn.LENGTH,s=-1;const i=e?.lengthDecoder??$d,o=e?.maxLengthLength??iU,a=e?.
maxDataLength??Td;function*c(){for(;t.byteLength>0;){if(r===Zn.LENGTH)try{if(s=i(t),s<0)throw new oU("Invalid message le\
ngth");if(s>a)throw new ov("Message length too long");const l=i.bytes;t.consume(l),e?.onLength!=null&&e.onLength(s),r=Zn.
DATA}catch(l){if(l instanceof RangeError){if(t.byteLength>o)throw new aU("Message length length too long");break}throw l}
if(r===Zn.DATA){if(t.byteLength<s)break;const l=t.sublist(0,s);t.consume(s),e?.onData!=null&&e.onData(l),yield l,r=Zn.LENGTH}}}
return av(n)?(async function*(){for await(const l of n)t.append(l),yield*c();if(t.byteLength>0)throw new zg("Unexpected \
end of input")})():(function*(){for(const l of n)t.append(l),yield*c();if(t.byteLength>0)throw new zg("Unexpected end of\
 input")})()}bh.fromReader=(n,e)=>{let t=1;const r=(async function*(){for(;;)try{const{done:i,value:o}=await n.next(t);if(i===
!0)return;o!=null&&(yield o)}catch(i){if(i.code==="ERR_UNDER_READ")return{done:!0,value:null};throw i}finally{t=1}})();return bh(
r,{...e??{},onLength:i=>{t=i}})};const cU={maxSubscriptions:1/0,maxMessages:1/0,maxIhaveMessageIDs:1/0,maxIwantMessageIDs:1/0,
maxIdontwantMessageIDs:1/0,maxControlMessages:1/0,maxPeerInfos:1/0};var yr;(function(n){(function(t){let r;t.codec=()=>(r==
null&&(r=se((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.subscribe!=null&&(i.uint32(8),i.bool(s.subscribe)),s.topic!=
null&&(i.uint32(18),i.string(s.topic)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+
i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.subscribe=s.bool();break}case 2:{a.topic=s.string();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.SubOpts||(n.SubOpts=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.from!=null&&(i.uint32(
10),i.bytes(s.from)),s.data!=null&&(i.uint32(18),i.bytes(s.data)),s.seqno!=null&&(i.uint32(26),i.bytes(s.seqno)),s.topic!=
null&&s.topic!==""&&(i.uint32(34),i.string(s.topic)),s.signature!=null&&(i.uint32(42),i.bytes(s.signature)),s.key!=null&&
(i.uint32(50),i.bytes(s.key)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={topic:""},c=i==null?s.len:s.pos+
i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.from=s.bytes();break}case 2:{a.data=s.bytes();break}case 3:{
a.seqno=s.bytes();break}case 4:{a.topic=s.string();break}case 5:{a.signature=s.bytes();break}case 6:{a.key=s.bytes();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.Message||(n.Message=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{if(o.lengthDelimited!==!1&&i.fork(),s.ihave!=null)for(const a of s.
ihave)i.uint32(10),n.ControlIHave.codec().encode(a,i);if(s.iwant!=null)for(const a of s.iwant)i.uint32(18),n.ControlIWant.
codec().encode(a,i);if(s.graft!=null)for(const a of s.graft)i.uint32(26),n.ControlGraft.codec().encode(a,i);if(s.prune!=
null)for(const a of s.prune)i.uint32(34),n.ControlPrune.codec().encode(a,i);if(s.idontwant!=null)for(const a of s.idontwant)
i.uint32(42),n.ControlIDontWant.codec().encode(a,i);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={ihave:[],iwant:[],
graft:[],prune:[],idontwant:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{if(o.limits?.
ihave!=null&&a.ihave.length===o.limits.ihave)throw new ae('Decode error - map field "ihave" had too many elements');a.ihave.
push(n.ControlIHave.codec().decode(s,s.uint32(),{limits:o.limits?.ihave$}));break}case 2:{if(o.limits?.iwant!=null&&a.iwant.
length===o.limits.iwant)throw new ae('Decode error - map field "iwant" had too many elements');a.iwant.push(n.ControlIWant.
codec().decode(s,s.uint32(),{limits:o.limits?.iwant$}));break}case 3:{if(o.limits?.graft!=null&&a.graft.length===o.limits.
graft)throw new ae('Decode error - map field "graft" had too many elements');a.graft.push(n.ControlGraft.codec().decode(
s,s.uint32(),{limits:o.limits?.graft$}));break}case 4:{if(o.limits?.prune!=null&&a.prune.length===o.limits.prune)throw new ae(
'Decode error - map field "prune" had too many elements');a.prune.push(n.ControlPrune.codec().decode(s,s.uint32(),{limits:o.
limits?.prune$}));break}case 5:{if(o.limits?.idontwant!=null&&a.idontwant.length===o.limits.idontwant)throw new ae('Deco\
de error - map field "idontwant" had too many elements');a.idontwant.push(n.ControlIDontWant.codec().decode(s,s.uint32(),
{limits:o.limits?.idontwant$}));break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=
(s,i)=>oe(s,t.codec(),i)})(n.ControlMessage||(n.ControlMessage={})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),s.messageIDs!=null)for(const a of s.
messageIDs)i.uint32(18),i.bytes(a);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={messageIDs:[]},c=i==null?s.
len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.topicID=s.string();break}case 2:{if(o.limits?.messageIDs!=
null&&a.messageIDs.length===o.limits.messageIDs)throw new ae('Decode error - map field "messageIDs" had too many element\
s');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=
(s,i)=>oe(s,t.codec(),i)})(n.ControlIHave||(n.ControlIHave={})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.messageIDs!=null)for(const a of s.messageIDs)i.uint32(10),i.bytes(a);o.lengthDelimited!==
!1&&i.ldelim()},(s,i,o={})=>{const a={messageIDs:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>
3){case 1:{if(o.limits?.messageIDs!=null&&a.messageIDs.length===o.limits.messageIDs)throw new ae('Decode error - map fie\
ld "messageIDs" had too many elements');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),
r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.ControlIWant||(n.ControlIWant={})),(function(t){let r;
t.codec=()=>(r==null&&(r=se((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),
o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>
3){case 1:{a.topicID=s.string();break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=
(s,i)=>oe(s,t.codec(),i)})(n.ControlGraft||(n.ControlGraft={})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),s.peers!=null)for(const a of s.peers)
i.uint32(18),n.PeerInfo.codec().encode(a,i);s.backoff!=null&&(i.uint32(24),i.uint64Number(s.backoff)),o.lengthDelimited!==
!1&&i.ldelim()},(s,i,o={})=>{const a={peers:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{
a.topicID=s.string();break}case 2:{if(o.limits?.peers!=null&&a.peers.length===o.limits.peers)throw new ae('Decode error \
- map field "peers" had too many elements');a.peers.push(n.PeerInfo.codec().decode(s,s.uint32(),{limits:o.limits?.peers$}));
break}case 3:{a.backoff=s.uint64Number();break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),
t.decode=(s,i)=>oe(s,t.codec(),i)})(n.ControlPrune||(n.ControlPrune={})),(function(t){let r;t.codec=()=>(r==null&&(r=se(
(s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.peerID!=null&&(i.uint32(10),i.bytes(s.peerID)),s.signedPeerRecord!=null&&
(i.uint32(18),i.bytes(s.signedPeerRecord)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.
pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.peerID=s.bytes();break}case 2:{a.signedPeerRecord=s.bytes();
break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=(s,i)=>oe(s,t.codec(),i)})(n.
PeerInfo||(n.PeerInfo={})),(function(t){let r;t.codec=()=>(r==null&&(r=se((s,i,o={})=>{if(o.lengthDelimited!==!1&&i.fork(),
s.messageIDs!=null)for(const a of s.messageIDs)i.uint32(10),i.bytes(a);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{
const a={messageIDs:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{if(o.limits?.messageIDs!=
null&&a.messageIDs.length===o.limits.messageIDs)throw new ae('Decode error - map field "messageIDs" had too many element\
s');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>ie(s,t.codec()),t.decode=
(s,i)=>oe(s,t.codec(),i)})(n.ControlIDontWant||(n.ControlIDontWant={}));let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.
lengthDelimited!==!1&&r.fork(),t.subscriptions!=null)for(const i of t.subscriptions)r.uint32(10),n.SubOpts.codec().encode(
i,r);if(t.messages!=null)for(const i of t.messages)r.uint32(18),n.Message.codec().encode(i,r);t.control!=null&&(r.uint32(
26),n.ControlMessage.codec().encode(t.control,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={subscriptions:[],
messages:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.subscriptions!=
null&&i.subscriptions.length===s.limits.subscriptions)throw new ae('Decode error - map field "subscriptions" had too man\
y elements');i.subscriptions.push(n.SubOpts.codec().decode(t,t.uint32(),{limits:s.limits?.subscriptions$}));break}case 2:{
if(s.limits?.messages!=null&&i.messages.length===s.limits.messages)throw new ae('Decode error - map field "messages" had\
 too many elements');i.messages.push(n.Message.codec().decode(t,t.uint32(),{limits:s.limits?.messages$}));break}case 3:{
i.control=n.ControlMessage.codec().decode(t,t.uint32(),{limits:s.limits?.control});break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(yr||(yr={}));class lU{gossip;msgs=new Map;msgIdToStrFn;history=[];notValidatedCount=0;constructor(e,t,r){
this.gossip=e,this.msgIdToStrFn=r;for(let s=0;s<t;s++)this.history[s]=[]}get size(){return this.msgs.size}put(e,t,r=!1){
const{msgIdStr:s}=e;return this.msgs.has(s)?!1:(this.msgs.set(s,{message:t,validated:r,originatingPeers:new Set,iwantCounts:new Map}),
this.history[0].push({...e,topic:t.topic}),r||this.notValidatedCount++,!0)}observeDuplicate(e,t){const r=this.msgs.get(e);
r!=null&&!r.validated&&r.originatingPeers.add(t)}get(e){return this.msgs.get(this.msgIdToStrFn(e))?.message}getWithIWantCount(e,t){
const r=this.msgs.get(e);if(r==null)return null;const s=(r.iwantCounts.get(t)??0)+1;return r.iwantCounts.set(t,s),{msg:r.
message,count:s}}getGossipIDs(e){const t=new Map;for(let r=0;r<this.gossip;r++)this.history[r].forEach(s=>{if((this.msgs.
get(s.msgIdStr)?.validated??!1)&&e.has(s.topic)){let o=t.get(s.topic);o==null&&(o=[],t.set(s.topic,o)),o.push(s.msgId)}});
return t}validate(e){const t=this.msgs.get(e);if(t==null)return null;t.validated||this.notValidatedCount--;const{message:r,
originatingPeers:s}=t;return t.validated=!0,t.originatingPeers=new Set,{message:r,originatingPeers:s}}shift(){this.history[this.
history.length-1].forEach(t=>{const r=this.msgs.get(t.msgIdStr);r!=null&&(this.msgs.delete(t.msgIdStr),r.validated||this.
notValidatedCount--)}),this.history.pop(),this.history.unshift([])}remove(e){const t=this.msgs.get(e);return t==null?null:
(this.msgs.delete(e),t)}}var Vg;(function(n){n.StrictSign="StrictSign",n.StrictNoSign="StrictNoSign"})(Vg||(Vg={}));var Cs;
(function(n){n[n.Signing=0]="Signing",n[n.Anonymous=1]="Anonymous"})(Cs||(Cs={}));var $t;(function(n){n.Error="error",n.
Ignore="ignore",n.Reject="reject",n.Blacklisted="blacklisted"})($t||($t={}));var Ye;(function(n){n.InvalidSignature="inv\
alid_signature",n.InvalidSeqno="invalid_seqno",n.InvalidPeerId="invalid_peerid",n.SignaturePresent="signature_present",n.
SeqnoPresent="seqno_present",n.FromPresent="from_present",n.TransformFailed="transform_failed"})(Ye||(Ye={}));var et;(function(n){
n.duplicate="duplicate",n.invalid="invalid",n.valid="valid"})(et||(et={}));function qg(n){switch(n){case mt.Ignore:return $t.
Ignore;case mt.Reject:return $t.Reject;default:throw new Error("Unreachable")}}var Wg;(function(n){n.forward="forward",n.
publish="publish"})(Wg||(Wg={}));var rt;(function(n){n.Fanout="fanout",n.Random="random",n.Subscribed="subscribed",n.Outbound=
"outbound",n.NotEnough="not_enough",n.Opportunistic="opportunistic"})(rt||(rt={}));var Nt;(function(n){n.Dc="disconnecte\
d",n.BadScore="bad_score",n.Prune="prune",n.Excess="excess"})(Nt||(Nt={}));var bi;(function(n){n.GraftBackoff="graft_bac\
koff",n.BrokenPromise="broken_promise",n.MessageDeficit="message_deficit",n.IPColocation="IP_colocation"})(bi||(bi={}));
var yi;(function(n){n.LowScore="low_score",n.MaxIhave="max_ihave",n.MaxIasked="max_iasked"})(yi||(yi={}));var Zr;(function(n){
n.graylist="graylist",n.publish="publish",n.gossip="gossip",n.mesh="mesh"})(Zr||(Zr={}));function uU(n,e,t){return{protocolsEnabled:n.
gauge({name:"gossipsub_protocol",help:"Status of enabled protocols",labelNames:["protocol"]}),topicSubscriptionStatus:n.
gauge({name:"gossipsub_topic_subscription_status",help:"Status of our subscription to this topic",labelNames:["topicStr"]}),
topicPeersCount:n.gauge({name:"gossipsub_topic_peer_count",help:"Number of peers subscribed to each topic",labelNames:["\
topicStr"]}),meshPeerCounts:n.gauge({name:"gossipsub_mesh_peer_count",help:"Number of peers in our mesh",labelNames:["to\
picStr"]}),meshPeerInclusionEventsFanout:n.gauge({name:"gossipsub_mesh_peer_inclusion_events_fanout_total",help:"Number \
of times we include peers in a topic mesh for fanout reasons",labelNames:["topic"]}),meshPeerInclusionEventsRandom:n.gauge(
{name:"gossipsub_mesh_peer_inclusion_events_random_total",help:"Number of times we include peers in a topic mesh for ran\
dom reasons",labelNames:["topic"]}),meshPeerInclusionEventsSubscribed:n.gauge({name:"gossipsub_mesh_peer_inclusion_event\
s_subscribed_total",help:"Number of times we include peers in a topic mesh for subscribed reasons",labelNames:["topic"]}),
meshPeerInclusionEventsOutbound:n.gauge({name:"gossipsub_mesh_peer_inclusion_events_outbound_total",help:"Number of time\
s we include peers in a topic mesh for outbound reasons",labelNames:["topic"]}),meshPeerInclusionEventsNotEnough:n.gauge(
{name:"gossipsub_mesh_peer_inclusion_events_not_enough_total",help:"Number of times we include peers in a topic mesh for\
 not_enough reasons",labelNames:["topic"]}),meshPeerInclusionEventsOpportunistic:n.gauge({name:"gossipsub_mesh_peer_incl\
usion_events_opportunistic_total",help:"Number of times we include peers in a topic mesh for opportunistic reasons",labelNames:[
"topic"]}),meshPeerInclusionEventsUnknown:n.gauge({name:"gossipsub_mesh_peer_inclusion_events_unknown_total",help:"Numbe\
r of times we include peers in a topic mesh for unknown reasons",labelNames:["topic"]}),meshPeerChurnEventsDisconnected:n.
gauge({name:"gossipsub_peer_churn_events_disconnected_total",help:"Number of times we remove peers in a topic mesh for d\
isconnected reasons",labelNames:["topic"]}),meshPeerChurnEventsBadScore:n.gauge({name:"gossipsub_peer_churn_events_bad_s\
core_total",help:"Number of times we remove peers in a topic mesh for bad_score reasons",labelNames:["topic"]}),meshPeerChurnEventsPrune:n.
gauge({name:"gossipsub_peer_churn_events_prune_total",help:"Number of times we remove peers in a topic mesh for prune re\
asons",labelNames:["topic"]}),meshPeerChurnEventsExcess:n.gauge({name:"gossipsub_peer_churn_events_excess_total",help:"N\
umber of times we remove peers in a topic mesh for excess reasons",labelNames:["topic"]}),meshPeerChurnEventsUnknown:n.gauge(
{name:"gossipsub_peer_churn_events_unknown_total",help:"Number of times we remove peers in a topic mesh for unknown reas\
ons",labelNames:["topic"]}),peersPerProtocol:n.gauge({name:"gossipsub_peers_per_protocol_count",help:"Peers connected fo\
r each topic",labelNames:["protocol"]}),heartbeatDuration:n.histogram({name:"gossipsub_heartbeat_duration_seconds",help:"\
The time it takes to complete one iteration of the heartbeat",buckets:[.01,.1,1]}),heartbeatSkipped:n.gauge({name:"gossi\
psub_heartbeat_skipped",help:"Heartbeat run took longer than heartbeat interval so next is skipped"}),acceptedMessagesTotal:n.
gauge({name:"gossipsub_accepted_messages_total",help:"Total accepted messages for each topic",labelNames:["topic"]}),ignoredMessagesTotal:n.
gauge({name:"gossipsub_ignored_messages_total",help:"Total ignored messages for each topic",labelNames:["topic"]}),rejectedMessagesTotal:n.
gauge({name:"gossipsub_rejected_messages_total",help:"Total rejected messages for each topic",labelNames:["topic"]}),unknownValidationResultsTotal:n.
gauge({name:"gossipsub_unknown_validation_results_total",help:"Total unknown validation results for each topic",labelNames:[
"topic"]}),asyncValidationMcacheHit:n.gauge({name:"gossipsub_async_validation_mcache_hit_total",help:"Async validation r\
esult reported by the user layer",labelNames:["hit"]}),asyncValidationDelayFromFirstSeenSec:n.histogram({name:"gossipsub\
_async_validation_delay_from_first_seen",help:"Async validation report delay from first seen in second",buckets:[.01,.03,
.1,.3,1,3,10]}),asyncValidationUnknownFirstSeen:n.gauge({name:"gossipsub_async_validation_unknown_first_seen_count_total",
help:"Async validation report unknown first seen value for message"}),peerReadStreamError:n.gauge({name:"gossipsub_peer_\
read_stream_err_count_total",help:"Peer read stream error"}),rpcRecvBytes:n.gauge({name:"gossipsub_rpc_recv_bytes_total",
help:"RPC recv"}),rpcRecvCount:n.gauge({name:"gossipsub_rpc_recv_count_total",help:"RPC recv"}),rpcRecvSubscription:n.gauge(
{name:"gossipsub_rpc_recv_subscription_total",help:"RPC recv"}),rpcRecvMessage:n.gauge({name:"gossipsub_rpc_recv_message\
_total",help:"RPC recv"}),rpcRecvControl:n.gauge({name:"gossipsub_rpc_recv_control_total",help:"RPC recv"}),rpcRecvIHave:n.
gauge({name:"gossipsub_rpc_recv_ihave_total",help:"RPC recv"}),rpcRecvIWant:n.gauge({name:"gossipsub_rpc_recv_iwant_tota\
l",help:"RPC recv"}),rpcRecvGraft:n.gauge({name:"gossipsub_rpc_recv_graft_total",help:"RPC recv"}),rpcRecvPrune:n.gauge(
{name:"gossipsub_rpc_recv_prune_total",help:"RPC recv"}),rpcDataError:n.gauge({name:"gossipsub_rpc_data_err_count_total",
help:"RPC data error"}),rpcRecvError:n.gauge({name:"gossipsub_rpc_recv_err_count_total",help:"RPC recv error"}),rpcRecvNotAccepted:n.
gauge({name:"gossipsub_rpc_rcv_not_accepted_total",help:"Total count of RPC dropped because acceptFrom() == false"}),rpcSentBytes:n.
gauge({name:"gossipsub_rpc_sent_bytes_total",help:"RPC sent"}),rpcSentCount:n.gauge({name:"gossipsub_rpc_sent_count_tota\
l",help:"RPC sent"}),rpcSentSubscription:n.gauge({name:"gossipsub_rpc_sent_subscription_total",help:"RPC sent"}),rpcSentMessage:n.
gauge({name:"gossipsub_rpc_sent_message_total",help:"RPC sent"}),rpcSentControl:n.gauge({name:"gossipsub_rpc_sent_contro\
l_total",help:"RPC sent"}),rpcSentIHave:n.gauge({name:"gossipsub_rpc_sent_ihave_total",help:"RPC sent"}),rpcSentIWant:n.
gauge({name:"gossipsub_rpc_sent_iwant_total",help:"RPC sent"}),rpcSentGraft:n.gauge({name:"gossipsub_rpc_sent_graft_tota\
l",help:"RPC sent"}),rpcSentPrune:n.gauge({name:"gossipsub_rpc_sent_prune_total",help:"RPC sent"}),rpcSentIDontWant:n.gauge(
{name:"gossipsub_rpc_sent_idontwant_total",help:"RPC sent"}),msgPublishCount:n.gauge({name:"gossipsub_msg_publish_count_\
total",help:"Total count of msg published by topic",labelNames:["topic"]}),msgPublishPeersByTopic:n.gauge({name:"gossips\
ub_msg_publish_peers_total",help:"Total count of peers that we publish a msg to",labelNames:["topic"]}),directPeersPublishedTotal:n.
gauge({name:"gossipsub_direct_peers_published_total",help:"Total direct peers that we publish a msg to",labelNames:["top\
ic"]}),floodsubPeersPublishedTotal:n.gauge({name:"gossipsub_floodsub_peers_published_total",help:"Total floodsub peers t\
hat we publish a msg to",labelNames:["topic"]}),meshPeersPublishedTotal:n.gauge({name:"gossipsub_mesh_peers_published_to\
tal",help:"Total mesh peers that we publish a msg to",labelNames:["topic"]}),fanoutPeersPublishedTotal:n.gauge({name:"go\
ssipsub_fanout_peers_published_total",help:"Total fanout peers that we publish a msg to",labelNames:["topic"]}),msgPublishBytes:n.
gauge({name:"gossipsub_msg_publish_bytes_total",help:"Total count of msg publish data.length bytes",labelNames:["topic"]}),
msgPublishTime:n.histogram({name:"gossipsub_msg_publish_seconds",help:"Total time in seconds to publish a message",buckets:[
.001,.002,.005,.01,.1,.5,1],labelNames:["topic"]}),msgForwardCount:n.gauge({name:"gossipsub_msg_forward_count_total",help:"\
Total count of msg forwarded by topic",labelNames:["topic"]}),msgForwardPeers:n.gauge({name:"gossipsub_msg_forward_peers\
_total",help:"Total count of peers that we forward a msg to",labelNames:["topic"]}),msgReceivedPreValidation:n.gauge({name:"\
gossipsub_msg_received_prevalidation_total",help:"Total count of recv msgs before any validation",labelNames:["topic"]}),
msgReceivedError:n.gauge({name:"gossipsub_msg_received_error_total",help:"Total count of recv msgs error",labelNames:["t\
opic"]}),prevalidationInvalidTotal:n.gauge({name:"gossipsub_pre_validation_invalid_total",help:"Total count of invalid m\
essages received",labelNames:["topic"]}),prevalidationValidTotal:n.gauge({name:"gossipsub_pre_validation_valid_total",help:"\
Total count of valid messages received",labelNames:["topic"]}),prevalidationDuplicateTotal:n.gauge({name:"gossipsub_pre_\
validation_duplicate_total",help:"Total count of duplicate messages received",labelNames:["topic"]}),prevalidationUnknownTotal:n.
gauge({name:"gossipsub_pre_validation_unknown_status_total",help:"Total count of unknown_status messages received",labelNames:[
"topic"]}),msgReceivedInvalid:n.gauge({name:"gossipsub_msg_received_invalid_total",help:"Tracks specific reason of inval\
id",labelNames:["error"]}),msgReceivedInvalidByTopic:n.gauge({name:"gossipsub_msg_received_invalid_by_topic_total",help:"\
Tracks specific invalid message by topic",labelNames:["topic"]}),duplicateMsgDeliveryDelay:n.histogram({name:"gossisub_d\
uplicate_msg_delivery_delay_seconds",help:"Time since the 1st duplicated message validated",labelNames:["topic"],buckets:[
.25*t.maxMeshMessageDeliveriesWindowSec,.5*t.maxMeshMessageDeliveriesWindowSec,Number(t.maxMeshMessageDeliveriesWindowSec),
2*t.maxMeshMessageDeliveriesWindowSec,4*t.maxMeshMessageDeliveriesWindowSec]}),duplicateMsgLateDelivery:n.gauge({name:"g\
ossisub_duplicate_msg_late_delivery_total",help:"Total count of late duplicate message delivery by topic, which triggers\
 P3 penalty",labelNames:["topic"]}),duplicateMsgIgnored:n.gauge({name:"gossisub_ignored_published_duplicate_msgs_total",
help:"Total count of published duplicate message ignored by topic",labelNames:["topic"]}),scoreFnCalls:n.gauge({name:"go\
ssipsub_score_fn_calls_total",help:"Total times score() is called"}),scoreFnRuns:n.gauge({name:"gossipsub_score_fn_runs_\
total",help:"Total times score() call actually computed computeScore(), no cache"}),scoreCachedDelta:n.histogram({name:"\
gossipsub_score_cache_delta",help:"Delta of score between cached values that expired",buckets:[10,100,1e3]}),peersByScoreThreshold:n.
gauge({name:"gossipsub_peers_by_score_threshold_count",help:"Current count of peers by score threshold",labelNames:["thr\
eshold"]}),score:n.avgMinMax({name:"gossipsub_score",help:"Avg min max of gossip scores"}),scoreWeights:n.avgMinMax({name:"\
gossipsub_score_weights",help:"Separate score weights",labelNames:["topic","p"]}),scorePerMesh:n.avgMinMax({name:"gossip\
sub_score_per_mesh",help:"Histogram of the scores for each mesh topic",labelNames:["topic"]}),scoringPenalties:n.gauge({
name:"gossipsub_scoring_penalties_total",help:"A counter of the kind of penalties being applied to peers",labelNames:["p\
enalty"]}),behaviourPenalty:n.histogram({name:"gossipsub_peer_stat_behaviour_penalty",help:"Current peer stat behaviour_\
penalty at each scrape",buckets:[.25*t.behaviourPenaltyThreshold,.5*t.behaviourPenaltyThreshold,Number(t.behaviourPenaltyThreshold),
2*t.behaviourPenaltyThreshold,4*t.behaviourPenaltyThreshold]}),ihaveRcvIgnored:n.gauge({name:"gossipsub_ihave_rcv_ignore\
d_total",help:"Total received IHAVE messages that we ignore for some reason",labelNames:["reason"]}),ihaveRcvMsgids:n.gauge(
{name:"gossipsub_ihave_rcv_msgids_total",help:"Total received IHAVE messages by topic",labelNames:["topic"]}),ihaveRcvNotSeenMsgids:n.
gauge({name:"gossipsub_ihave_rcv_not_seen_msgids_total",help:"Total messages per topic we do not have, not actual reques\
ts",labelNames:["topic"]}),iwantRcvMsgids:n.gauge({name:"gossipsub_iwant_rcv_msgids_total",help:"Total received IWANT me\
ssages by topic",labelNames:["topic"]}),iwantRcvDonthaveMsgids:n.gauge({name:"gossipsub_iwant_rcv_dont_have_msgids_total",
help:"Total requested messageIDs that we do not have"}),idontwantRcvMsgids:n.gauge({name:"gossipsub_idontwant_rcv_msgids\
_total",help:"Total received IDONTWANT messages"}),idontwantRcvDonthaveMsgids:n.gauge({name:"gossipsub_idontwant_rcv_don\
t_have_msgids_total",help:"Total received IDONTWANT messageIDs that we do not have in mcache"}),iwantPromiseStarted:n.gauge(
{name:"gossipsub_iwant_promise_sent_total",help:"Total count of started IWANT promises"}),iwantPromiseResolved:n.gauge({
name:"gossipsub_iwant_promise_resolved_total",help:"Total count of resolved IWANT promises"}),iwantPromiseResolvedFromDuplicate:n.
gauge({name:"gossipsub_iwant_promise_resolved_from_duplicate_total",help:"Total count of resolved IWANT promises from du\
plicate messages"}),iwantPromiseResolvedPeers:n.gauge({name:"gossipsub_iwant_promise_resolved_peers",help:"Total count o\
f peers we have asked IWANT promises that are resolved"}),iwantPromiseBroken:n.gauge({name:"gossipsub_iwant_promise_brok\
en",help:"Total count of broken IWANT promises"}),iwantMessagePruned:n.gauge({name:"gossipsub_iwant_message_pruned",help:"\
Total count of pruned IWANT messages"}),iwantPromiseDeliveryTime:n.histogram({name:"gossipsub_iwant_promise_delivery_sec\
onds",help:"Histogram of delivery time of resolved IWANT promises",buckets:[.5*t.gossipPromiseExpireSec,Number(t.gossipPromiseExpireSec),
2*t.gossipPromiseExpireSec,4*t.gossipPromiseExpireSec]}),iwantPromiseUntracked:n.gauge({name:"gossip_iwant_promise_untra\
cked",help:"Total count of untracked IWANT promise"}),connectedPeersBackoffSec:n.histogram({name:"gossipsub_connected_pe\
ers_backoff_seconds",help:"Backoff time in seconds",buckets:[1,2,4,10,20,60,120]}),cacheSize:n.gauge({name:"gossipsub_ca\
che_size",help:"Unbounded cache sizes",labelNames:["cache"]}),mcacheSize:n.gauge({name:"gossipsub_mcache_size",help:"Cur\
rent mcache msg count"}),mcacheNotValidatedCount:n.gauge({name:"gossipsub_mcache_not_validated_count",help:"Current mcac\
he msg count not validated"}),fastMsgIdCacheCollision:n.gauge({name:"gossipsub_fastmsgid_cache_collision_total",help:"To\
tal count of key collisions on fastmsgid cache put"}),newConnectionCount:n.gauge({name:"gossipsub_new_connection_total",
help:"Total new connection by status",labelNames:["status"]}),topicStrToLabel:e,toTopic(r){return this.topicStrToLabel.get(
r)??r},onJoin(r){this.topicSubscriptionStatus.set({topicStr:r},1),this.meshPeerCounts.set({topicStr:r},0)},onLeave(r){this.
topicSubscriptionStatus.set({topicStr:r},0),this.meshPeerCounts.set({topicStr:r},0)},onAddToMesh(r,s,i){const o=this.toTopic(
r);switch(s){case rt.Fanout:this.meshPeerInclusionEventsFanout.inc({topic:o},i);break;case rt.Random:this.meshPeerInclusionEventsRandom.
inc({topic:o},i);break;case rt.Subscribed:this.meshPeerInclusionEventsSubscribed.inc({topic:o},i);break;case rt.Outbound:
this.meshPeerInclusionEventsOutbound.inc({topic:o},i);break;case rt.NotEnough:this.meshPeerInclusionEventsNotEnough.inc(
{topic:o},i);break;case rt.Opportunistic:this.meshPeerInclusionEventsOpportunistic.inc({topic:o},i);break;default:this.meshPeerInclusionEventsUnknown.
inc({topic:o},i);break}},onRemoveFromMesh(r,s,i){const o=this.toTopic(r);switch(s){case Nt.Dc:this.meshPeerChurnEventsDisconnected.
inc({topic:o},i);break;case Nt.BadScore:this.meshPeerChurnEventsBadScore.inc({topic:o},i);break;case Nt.Prune:this.meshPeerChurnEventsPrune.
inc({topic:o},i);break;case Nt.Excess:this.meshPeerChurnEventsExcess.inc({topic:o},i);break;default:this.meshPeerChurnEventsUnknown.
inc({topic:o},i);break}},onReportValidation(r,s,i){if(this.asyncValidationMcacheHit.inc({hit:r!=null?"hit":"miss"}),r!=null){
const o=this.toTopic(r.message.topic);switch(s){case mt.Accept:this.acceptedMessagesTotal.inc({topic:o});break;case mt.Ignore:
this.ignoredMessagesTotal.inc({topic:o});break;case mt.Reject:this.rejectedMessagesTotal.inc({topic:o});break;default:this.
unknownValidationResultsTotal.inc({topic:o});break}}i!=null?this.asyncValidationDelayFromFirstSeenSec.observe((Date.now()-
i)/1e3):this.asyncValidationUnknownFirstSeen.inc()},onScorePenalty(r){this.scoringPenalties.inc({penalty:r},1)},onIhaveRcv(r,s,i){
const o=this.toTopic(r);this.ihaveRcvMsgids.inc({topic:o},s),this.ihaveRcvNotSeenMsgids.inc({topic:o},i)},onIwantRcv(r,s){
for(const[i,o]of r){const a=this.toTopic(i);this.iwantRcvMsgids.inc({topic:a},o)}this.iwantRcvDonthaveMsgids.inc(s)},onIdontwantRcv(r,s){
this.idontwantRcvMsgids.inc(r),this.idontwantRcvDonthaveMsgids.inc(s)},onForwardMsg(r,s){const i=this.toTopic(r);this.msgForwardCount.
inc({topic:i},1),this.msgForwardPeers.inc({topic:i},s)},onPublishMsg(r,s,i,o,a){const c=this.toTopic(r);this.msgPublishCount.
inc({topic:c},1),this.msgPublishBytes.inc({topic:c},i*o),this.msgPublishPeersByTopic.inc({topic:c},i),this.directPeersPublishedTotal.
inc({topic:c},s.direct),this.floodsubPeersPublishedTotal.inc({topic:c},s.floodsub),this.meshPeersPublishedTotal.inc({topic:c},
s.mesh),this.fanoutPeersPublishedTotal.inc({topic:c},s.fanout),this.msgPublishTime.observe({topic:c},a/1e3)},onMsgRecvPreValidation(r){
const s=this.toTopic(r);this.msgReceivedPreValidation.inc({topic:s},1)},onMsgRecvError(r){const s=this.toTopic(r);this.msgReceivedError.
inc({topic:s},1)},onPrevalidationResult(r,s){const i=this.toTopic(r);switch(s){case et.duplicate:this.prevalidationDuplicateTotal.
inc({topic:i});break;case et.invalid:this.prevalidationInvalidTotal.inc({topic:i});break;case et.valid:this.prevalidationValidTotal.
inc({topic:i});break;default:this.prevalidationUnknownTotal.inc({topic:i});break}},onMsgRecvInvalid(r,s){const i=this.toTopic(
r),o=s.reason===$t.Error?s.error:s.reason;this.msgReceivedInvalid.inc({error:o},1),this.msgReceivedInvalidByTopic.inc({topic:i},
1)},onDuplicateMsgDelivery(r,s,i){const o=this.toTopic(r);this.duplicateMsgDeliveryDelay.observe({topic:o},s/1e3),i&&this.
duplicateMsgLateDelivery.inc({topic:o},1)},onPublishDuplicateMsg(r){const s=this.toTopic(r);this.duplicateMsgIgnored.inc(
{topic:s},1)},onPeerReadStreamError(){this.peerReadStreamError.inc(1)},onRpcRecvError(){this.rpcRecvError.inc(1)},onRpcDataError(){
this.rpcDataError.inc(1)},onRpcRecv(r,s){this.rpcRecvBytes.inc(s),this.rpcRecvCount.inc(1),r.subscriptions!=null&&this.rpcRecvSubscription.
inc(r.subscriptions.length),r.messages!=null&&this.rpcRecvMessage.inc(r.messages.length),r.control!=null&&(this.rpcRecvControl.
inc(1),r.control.ihave!=null&&this.rpcRecvIHave.inc(r.control.ihave.length),r.control.iwant!=null&&this.rpcRecvIWant.inc(
r.control.iwant.length),r.control.graft!=null&&this.rpcRecvGraft.inc(r.control.graft.length),r.control.prune!=null&&this.
rpcRecvPrune.inc(r.control.prune.length))},onRpcSent(r,s){if(this.rpcSentBytes.inc(s),this.rpcSentCount.inc(1),r.subscriptions!=
null&&this.rpcSentSubscription.inc(r.subscriptions.length),r.messages!=null&&this.rpcSentMessage.inc(r.messages.length),
r.control!=null){const i=r.control.ihave?.length??0,o=r.control.iwant?.length??0,a=r.control.graft?.length??0,c=r.control.
prune?.length??0,l=r.control.idontwant?.length??0;i>0&&this.rpcSentIHave.inc(i),o>0&&this.rpcSentIWant.inc(o),a>0&&this.
rpcSentGraft.inc(a),c>0&&this.rpcSentPrune.inc(c),l>0&&this.rpcSentIDontWant.inc(l),(i>0||o>0||a>0||c>0||l>0)&&this.rpcSentControl.
inc(1)}},registerScores(r,s){let i=0,o=0,a=0,c=0;for(const l of r)l>=s.graylistThreshold&&i++,l>=s.publishThreshold&&o++,
l>=s.gossipThreshold&&a++,l>=0&&c++;this.peersByScoreThreshold.set({threshold:Zr.graylist},i),this.peersByScoreThreshold.
set({threshold:Zr.publish},o),this.peersByScoreThreshold.set({threshold:Zr.gossip},a),this.peersByScoreThreshold.set({threshold:Zr.
mesh},c),this.score.set(r)},registerScoreWeights(r){for(const[s,i]of r.byTopic)this.scoreWeights.set({topic:s,p:"p1"},i.
p1w),this.scoreWeights.set({topic:s,p:"p2"},i.p2w),this.scoreWeights.set({topic:s,p:"p3"},i.p3w),this.scoreWeights.set({
topic:s,p:"p3b"},i.p3bw),this.scoreWeights.set({topic:s,p:"p4"},i.p4w);this.scoreWeights.set({p:"p5"},r.p5w),this.scoreWeights.
set({p:"p6"},r.p6w),this.scoreWeights.set({p:"p7"},r.p7w)},registerScorePerMesh(r,s){const i=new Map;r.forEach((o,a)=>{const c=this.
topicStrToLabel.get(a)??"unknown";let l=i.get(c);l==null&&(l=new Set,i.set(c,l)),o.forEach(u=>l?.add(u))});for(const[o,a]of i){
const c=[];a.forEach(l=>{c.push(s.get(l)??0)}),this.scorePerMesh.set({topic:o},c)}}}}class Q extends Error{static name="\
InvalidPeerScoreParamsError";constructor(e="Invalid peer score params"){super(e),this.name="InvalidPeerScoreParamsError"}}
const hU={topics:{},topicScoreCap:10,appSpecificScore:()=>0,appSpecificWeight:10,IPColocationFactorWeight:-5,IPColocationFactorThreshold:10,
IPColocationFactorWhitelist:new Set,behaviourPenaltyWeight:-10,behaviourPenaltyThreshold:0,behaviourPenaltyDecay:.2,decayInterval:1e3,
decayToZero:.1,retainScore:3600*1e3},dU={topicWeight:.5,timeInMeshWeight:1,timeInMeshQuantum:1,timeInMeshCap:3600,firstMessageDeliveriesWeight:1,
firstMessageDeliveriesDecay:.5,firstMessageDeliveriesCap:2e3,meshMessageDeliveriesWeight:-1,meshMessageDeliveriesDecay:.5,
meshMessageDeliveriesCap:100,meshMessageDeliveriesThreshold:20,meshMessageDeliveriesWindow:10,meshMessageDeliveriesActivation:5e3,
meshFailurePenaltyWeight:-1,meshFailurePenaltyDecay:.5,invalidMessageDeliveriesWeight:-1,invalidMessageDeliveriesDecay:.3};
function fU(n={}){return{...hU,...n,topics:n.topics!=null?Object.entries(n.topics).reduce((e,[t,r])=>(e[t]=pU(r),e),{}):
{}}}function pU(n={}){return{...dU,...n}}function gU(n){for(const[e,t]of Object.entries(n.topics))try{mU(t)}catch(r){throw new Q(
`invalid score parameters for topic ${e}: ${r.message}`)}if(n.topicScoreCap<0)throw new Q("invalid topic score cap; must\
 be positive (or 0 for no cap)");if(n.appSpecificScore===null||n.appSpecificScore===void 0)throw new Q("missing applicat\
ion specific score function");if(n.IPColocationFactorWeight>0)throw new Q("invalid IPColocationFactorWeight; must be neg\
ative (or 0 to disable)");if(n.IPColocationFactorWeight!==0&&n.IPColocationFactorThreshold<1)throw new Q("invalid IPColo\
cationFactorThreshold; must be at least 1");if(n.behaviourPenaltyWeight>0)throw new Q("invalid BehaviourPenaltyWeight; m\
ust be negative (or 0 to disable)");if(n.behaviourPenaltyWeight!==0&&(n.behaviourPenaltyDecay<=0||n.behaviourPenaltyDecay>=
1))throw new Q("invalid BehaviourPenaltyDecay; must be between 0 and 1");if(n.decayInterval<1e3)throw new Q("invalid Dec\
ayInterval; must be at least 1s");if(n.decayToZero<=0||n.decayToZero>=1)throw new Q("invalid DecayToZero; must be betwee\
n 0 and 1")}function mU(n){if(n.topicWeight<0)throw new Q("invalid topic weight; must be >= 0");if(n.timeInMeshQuantum===
0)throw new Q("invalid TimeInMeshQuantum; must be non zero");if(n.timeInMeshWeight<0)throw new Q("invalid TimeInMeshWeig\
ht; must be positive (or 0 to disable)");if(n.timeInMeshWeight!==0&&n.timeInMeshQuantum<=0)throw new Q("invalid TimeInMe\
shQuantum; must be positive");if(n.timeInMeshWeight!==0&&n.timeInMeshCap<=0)throw new Q("invalid TimeInMeshCap; must be \
positive");if(n.firstMessageDeliveriesWeight<0)throw new Q("invallid FirstMessageDeliveriesWeight; must be positive (or \
0 to disable)");if(n.firstMessageDeliveriesWeight!==0&&(n.firstMessageDeliveriesDecay<=0||n.firstMessageDeliveriesDecay>=
1))throw new Q("invalid FirstMessageDeliveriesDecay; must be between 0 and 1");if(n.firstMessageDeliveriesWeight!==0&&n.
firstMessageDeliveriesCap<=0)throw new Q("invalid FirstMessageDeliveriesCap; must be positive");if(n.meshMessageDeliveriesWeight>
0)throw new Q("invalid MeshMessageDeliveriesWeight; must be negative (or 0 to disable)");if(n.meshMessageDeliveriesWeight!==
0&&(n.meshMessageDeliveriesDecay<=0||n.meshMessageDeliveriesDecay>=1))throw new Q("invalid MeshMessageDeliveriesDecay; m\
ust be between 0 and 1");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesCap<=0)throw new Q("invalid MeshMe\
ssageDeliveriesCap; must be positive");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesThreshold<=0)throw new Q(
"invalid MeshMessageDeliveriesThreshold; must be positive");if(n.meshMessageDeliveriesWindow<0)throw new Q("invalid Mesh\
MessageDeliveriesWindow; must be non-negative");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesActivation<
1e3)throw new Q("invalid MeshMessageDeliveriesActivation; must be at least 1s");if(n.meshFailurePenaltyWeight>0)throw new Q(
"invalid MeshFailurePenaltyWeight; must be negative (or 0 to disable)");if(n.meshFailurePenaltyWeight!==0&&(n.meshFailurePenaltyDecay<=
0||n.meshFailurePenaltyDecay>=1))throw new Q("invalid MeshFailurePenaltyDecay; must be between 0 and 1");if(n.invalidMessageDeliveriesWeight>
0)throw new Q("invalid InvalidMessageDeliveriesWeight; must be negative (or 0 to disable)");if(n.invalidMessageDeliveriesDecay<=
0||n.invalidMessageDeliveriesDecay>=1)throw new Q("invalid InvalidMessageDeliveriesDecay; must be between 0 and 1")}const bU={
gossipThreshold:-10,publishThreshold:-50,graylistThreshold:-80,acceptPXThreshold:10,opportunisticGraftThreshold:20};function yU(n={}){
return{...bU,...n}}function yh(n,e,t=()=>!0){const r=new Set;if(e<=0)return r;for(const s of n){if(r.size>=e)break;t(s)&&
(r.add(s),n.delete(s))}return r}function wU(n,e){return yh(n,e,()=>!0)}class vU extends Map{getDefault;constructor(e){super(),
this.getDefault=e}getOrDefault(e){let t=super.get(e);return t===void 0&&(t=this.getDefault(),this.set(e,t)),t}}function SU(n,e,t,r){
let s=0;Object.entries(e.topics).forEach(([o,a])=>{const c=t.topics[o];if(c===void 0)return;let l=0;if(a.inMesh){let p=a.
meshTime/c.timeInMeshQuantum;p>c.timeInMeshCap&&(p=c.timeInMeshCap),l+=p*c.timeInMeshWeight}let u=a.firstMessageDeliveries;
if(u>c.firstMessageDeliveriesCap&&(u=c.firstMessageDeliveriesCap),l+=u*c.firstMessageDeliveriesWeight,a.meshMessageDeliveriesActive&&
a.meshMessageDeliveries<c.meshMessageDeliveriesThreshold){const p=c.meshMessageDeliveriesThreshold-a.meshMessageDeliveries,
v=p*p;l+=v*c.meshMessageDeliveriesWeight}const h=a.meshFailurePenalty;l+=h*c.meshFailurePenaltyWeight;const d=a.invalidMessageDeliveries*
a.invalidMessageDeliveries;l+=d*c.invalidMessageDeliveriesWeight,s+=l*c.topicWeight}),t.topicScoreCap>0&&s>t.topicScoreCap&&
(s=t.topicScoreCap);const i=t.appSpecificScore(n);if(s+=i*t.appSpecificWeight,e.knownIPs.forEach(o=>{if(t.IPColocationFactorWhitelist.
has(o))return;const a=r.get(o),c=a!=null?a.size:0;if(c>t.IPColocationFactorThreshold){const l=c-t.IPColocationFactorThreshold,
u=l*l;s+=u*t.IPColocationFactorWeight}}),e.behaviourPenalty>t.behaviourPenaltyThreshold){const o=e.behaviourPenalty-t.behaviourPenaltyThreshold,
a=o*o;s+=a*t.behaviourPenaltyWeight}return s}var Wl,Kg;function AU(){if(Kg)return Wl;Kg=1;function n(e,r){var r=r||{};this.
_capacity=r.capacity,this._head=0,this._tail=0,Array.isArray(e)?this._fromArray(e):(this._capacityMask=3,this._list=new Array(
4))}return n.prototype.peekAt=function(t){var r=t;if(r===(r|0)){var s=this.size();if(!(r>=s||r<-s))return r<0&&(r+=s),r=
this._head+r&this._capacityMask,this._list[r]}},n.prototype.get=function(t){return this.peekAt(t)},n.prototype.peek=function(){
if(this._head!==this._tail)return this._list[this._head]},n.prototype.peekFront=function(){return this.peek()},n.prototype.
peekBack=function(){return this.peekAt(-1)},Object.defineProperty(n.prototype,"length",{get:function(){return this.size()}}),
n.prototype.size=function(){return this._head===this._tail?0:this._head<this._tail?this._tail-this._head:this._capacityMask+
1-(this._head-this._tail)},n.prototype.unshift=function(t){if(arguments.length===0)return this.size();var r=this._list.length;
return this._head=this._head-1+r&this._capacityMask,this._list[this._head]=t,this._tail===this._head&&this._growArray(),
this._capacity&&this.size()>this._capacity&&this.pop(),this._head<this._tail?this._tail-this._head:this._capacityMask+1-
(this._head-this._tail)},n.prototype.shift=function(){var t=this._head;if(t!==this._tail){var r=this._list[t];return this.
_list[t]=void 0,this._head=t+1&this._capacityMask,t<2&&this._tail>1e4&&this._tail<=this._list.length>>>2&&this._shrinkArray(),
r}},n.prototype.push=function(t){if(arguments.length===0)return this.size();var r=this._tail;return this._list[r]=t,this.
_tail=r+1&this._capacityMask,this._tail===this._head&&this._growArray(),this._capacity&&this.size()>this._capacity&&this.
shift(),this._head<this._tail?this._tail-this._head:this._capacityMask+1-(this._head-this._tail)},n.prototype.pop=function(){
var t=this._tail;if(t!==this._head){var r=this._list.length;this._tail=t-1+r&this._capacityMask;var s=this._list[this._tail];
return this._list[this._tail]=void 0,this._head<2&&t>1e4&&t<=r>>>2&&this._shrinkArray(),s}},n.prototype.removeOne=function(t){
var r=t;if(r===(r|0)&&this._head!==this._tail){var s=this.size(),i=this._list.length;if(!(r>=s||r<-s)){r<0&&(r+=s),r=this.
_head+r&this._capacityMask;var o=this._list[r],a;if(t<s/2){for(a=t;a>0;a--)this._list[r]=this._list[r=r-1+i&this._capacityMask];
this._list[r]=void 0,this._head=this._head+1+i&this._capacityMask}else{for(a=s-1-t;a>0;a--)this._list[r]=this._list[r=r+
1+i&this._capacityMask];this._list[r]=void 0,this._tail=this._tail-1+i&this._capacityMask}return o}}},n.prototype.remove=
function(t,r){var s=t,i,o=r;if(s===(s|0)&&this._head!==this._tail){var a=this.size(),c=this._list.length;if(!(s>=a||s<-a||
r<1)){if(s<0&&(s+=a),r===1||!r)return i=new Array(1),i[0]=this.removeOne(s),i;if(s===0&&s+r>=a)return i=this.toArray(),this.
clear(),i;s+r>a&&(r=a-s);var l;for(i=new Array(r),l=0;l<r;l++)i[l]=this._list[this._head+s+l&this._capacityMask];if(s=this.
_head+s&this._capacityMask,t+r===a){for(this._tail=this._tail-r+c&this._capacityMask,l=r;l>0;l--)this._list[s=s+1+c&this.
_capacityMask]=void 0;return i}if(t===0){for(this._head=this._head+r+c&this._capacityMask,l=r-1;l>0;l--)this._list[s=s+1+
c&this._capacityMask]=void 0;return i}if(s<a/2){for(this._head=this._head+t+r+c&this._capacityMask,l=t;l>0;l--)this.unshift(
this._list[s=s-1+c&this._capacityMask]);for(s=this._head-1+c&this._capacityMask;o>0;)this._list[s=s-1+c&this._capacityMask]=
void 0,o--;t<0&&(this._tail=s)}else{for(this._tail=s,s=s+r+c&this._capacityMask,l=a-(r+t);l>0;l--)this.push(this._list[s++]);
for(s=this._tail;o>0;)this._list[s=s+1+c&this._capacityMask]=void 0,o--}return this._head<2&&this._tail>1e4&&this._tail<=
c>>>2&&this._shrinkArray(),i}}},n.prototype.splice=function(t,r){var s=t;if(s===(s|0)){var i=this.size();if(s<0&&(s+=i),
!(s>i))if(arguments.length>2){var o,a,c,l=arguments.length,u=this._list.length,h=2;if(!i||s<i/2){for(a=new Array(s),o=0;o<
s;o++)a[o]=this._list[this._head+o&this._capacityMask];for(r===0?(c=[],s>0&&(this._head=this._head+s+u&this._capacityMask)):
(c=this.remove(s,r),this._head=this._head+s+u&this._capacityMask);l>h;)this.unshift(arguments[--l]);for(o=s;o>0;o--)this.
unshift(a[o-1])}else{a=new Array(i-(s+r));var d=a.length;for(o=0;o<d;o++)a[o]=this._list[this._head+s+r+o&this._capacityMask];
for(r===0?(c=[],s!=i&&(this._tail=this._head+s+u&this._capacityMask)):(c=this.remove(s,r),this._tail=this._tail-d+u&this.
_capacityMask);h<l;)this.push(arguments[h++]);for(o=0;o<d;o++)this.push(a[o])}return c}else return this.remove(s,r)}},n.
prototype.clear=function(){this._list=new Array(this._list.length),this._head=0,this._tail=0},n.prototype.isEmpty=function(){
return this._head===this._tail},n.prototype.toArray=function(){return this._copyArray(!1)},n.prototype._fromArray=function(t){
var r=t.length,s=this._nextPowerOf2(r);this._list=new Array(s),this._capacityMask=s-1,this._tail=r;for(var i=0;i<r;i++)this.
_list[i]=t[i]},n.prototype._copyArray=function(t,r){var s=this._list,i=s.length,o=this.length;if(r=r|o,r==o&&this._head<
this._tail)return this._list.slice(this._head,this._tail);var a=new Array(r),c=0,l;if(t||this._head>this._tail){for(l=this.
_head;l<i;l++)a[c++]=s[l];for(l=0;l<this._tail;l++)a[c++]=s[l]}else for(l=this._head;l<this._tail;l++)a[c++]=s[l];return a},
n.prototype._growArray=function(){if(this._head!=0){var t=this._copyArray(!0,this._list.length<<1);this._tail=this._list.
length,this._head=0,this._list=t}else this._tail=this._list.length,this._list.length<<=1;this._capacityMask=this._capacityMask<<
1|1},n.prototype._shrinkArray=function(){this._list.length>>>=1,this._capacityMask>>>=1},n.prototype._nextPowerOf2=function(t){
var r=Math.log(t)/Math.log(2),s=1<<r+1;return Math.max(s,4)},Wl=n,Wl}var _U=AU();const EU=Xm(_U);var Je;(function(n){n[n.
unknown=0]="unknown",n[n.valid=1]="valid",n[n.invalid=2]="invalid",n[n.ignored=3]="ignored"})(Je||(Je={}));class CU{records;queue;constructor(){
this.records=new Map,this.queue=new EU}getRecord(e){return this.records.get(e)}ensureRecord(e){let t=this.records.get(e);
if(t!=null)return t;t={status:Je.unknown,firstSeenTsMs:Date.now(),validated:0,peers:new Set},this.records.set(e,t);const r={
msgId:e,expire:Date.now()+X5};return this.queue.push(r),t}gc(){const e=Date.now();let t=this.queue.peekFront();for(;t!=null&&
t.expire<e;)this.records.delete(t.msgId),this.queue.shift(),t=this.queue.peekFront()}clear(){this.records.clear(),this.queue.
clear()}}class xU{params;metrics;peerStats=new Map;peerIPs=new vU(()=>new Set);scoreCache=new Map;deliveryRecords=new CU;_backgroundInterval;scoreCacheValidityMs;computeScore;log;constructor(e,t,r,s){
this.params=e,this.metrics=t,gU(e),this.scoreCacheValidityMs=s.scoreCacheValidityMs,this.computeScore=s.computeScore??SU,
this.log=r.forComponent("libp2p:gossipsub:score")}get size(){return this.peerStats.size}start(){if(this._backgroundInterval!=
null){this.log("Peer score already running");return}this._backgroundInterval=setInterval(()=>{this.background()},this.params.
decayInterval),this.log("started")}stop(){if(this._backgroundInterval==null){this.log("Peer score already stopped");return}
clearInterval(this._backgroundInterval),delete this._backgroundInterval,this.peerIPs.clear(),this.peerStats.clear(),this.
deliveryRecords.clear(),this.log("stopped")}background(){this.refreshScores(),this.deliveryRecords.gc()}dumpPeerScoreStats(){
return Object.fromEntries(Array.from(this.peerStats.entries()).map(([e,t])=>[e,t]))}messageFirstSeenTimestampMs(e){const t=this.
deliveryRecords.getRecord(e);return t!=null?t.firstSeenTsMs:null}refreshScores(){const e=Date.now(),t=this.params.decayToZero;
this.peerStats.forEach((r,s)=>{if(!r.connected){e>r.expire&&(this.removeIPsForPeer(s,r.knownIPs),this.peerStats.delete(s),
this.scoreCache.delete(s));return}Object.entries(r.topics).forEach(([i,o])=>{const a=this.params.topics[i];a!==void 0&&(o.
firstMessageDeliveries*=a.firstMessageDeliveriesDecay,o.firstMessageDeliveries<t&&(o.firstMessageDeliveries=0),o.meshMessageDeliveries*=
a.meshMessageDeliveriesDecay,o.meshMessageDeliveries<t&&(o.meshMessageDeliveries=0),o.meshFailurePenalty*=a.meshFailurePenaltyDecay,
o.meshFailurePenalty<t&&(o.meshFailurePenalty=0),o.invalidMessageDeliveries*=a.invalidMessageDeliveriesDecay,o.invalidMessageDeliveries<
t&&(o.invalidMessageDeliveries=0),o.inMesh&&(o.meshTime=e-o.graftTime,o.meshTime>a.meshMessageDeliveriesActivation&&(o.meshMessageDeliveriesActive=
!0)))}),r.behaviourPenalty*=this.params.behaviourPenaltyDecay,r.behaviourPenalty<t&&(r.behaviourPenalty=0)})}score(e){this.
metrics?.scoreFnCalls.inc();const t=this.peerStats.get(e);if(t==null)return 0;const r=Date.now(),s=this.scoreCache.get(e);
if(s!=null&&s.cacheUntil>r)return s.score;this.metrics?.scoreFnRuns.inc();const i=this.computeScore(e,t,this.params,this.
peerIPs),o=r+this.scoreCacheValidityMs;return s!=null?(this.metrics?.scoreCachedDelta.observe(Math.abs(i-s.score)),s.score=
i,s.cacheUntil=o):this.scoreCache.set(e,{score:i,cacheUntil:o}),i}addPenalty(e,t,r){const s=this.peerStats.get(e);s!=null&&
(s.behaviourPenalty+=t,this.metrics?.onScorePenalty(r))}addPeer(e){const t={connected:!0,expire:0,topics:{},knownIPs:new Set,
behaviourPenalty:0};this.peerStats.set(e,t)}addIP(e,t){const r=this.peerStats.get(e);r?.knownIPs.add(t),this.peerIPs.getOrDefault(
t).add(e)}removeIP(e,t){const r=this.peerStats.get(e);r?.knownIPs.delete(t);const s=this.peerIPs.get(t);s!=null&&(s.delete(
e),s.size===0&&this.peerIPs.delete(t))}removePeer(e){const t=this.peerStats.get(e);if(t!=null){if(this.score(e)>0){this.
removeIPsForPeer(e,t.knownIPs),this.peerStats.delete(e);return}Object.entries(t.topics).forEach(([r,s])=>{s.firstMessageDeliveries=
0;const i=this.params.topics[r].meshMessageDeliveriesThreshold;if(s.inMesh&&s.meshMessageDeliveriesActive&&s.meshMessageDeliveries<
i){const o=i-s.meshMessageDeliveries;s.meshFailurePenalty+=o*o}s.inMesh=!1,s.meshMessageDeliveriesActive=!1}),t.connected=
!1,t.expire=Date.now()+this.params.retainScore}}graft(e,t){const r=this.peerStats.get(e);if(r!=null){const s=this.getPtopicStats(
r,t);s!=null&&(s.inMesh=!0,s.graftTime=Date.now(),s.meshTime=0,s.meshMessageDeliveriesActive=!1)}}prune(e,t){const r=this.
peerStats.get(e);if(r!=null){const s=this.getPtopicStats(r,t);if(s!=null){const i=this.params.topics[t].meshMessageDeliveriesThreshold;
if(s.meshMessageDeliveriesActive&&s.meshMessageDeliveries<i){const o=i-s.meshMessageDeliveries;s.meshFailurePenalty+=o*o}
s.meshMessageDeliveriesActive=!1,s.inMesh=!1}}}validateMessage(e){this.deliveryRecords.ensureRecord(e)}deliverMessage(e,t,r){
this.markFirstMessageDelivery(e,r);const s=this.deliveryRecords.ensureRecord(t),i=Date.now();if(s.status!==Je.unknown){this.
log("unexpected delivery: message from %s was first seen %s ago and has delivery status %s",e,i-s.firstSeenTsMs,Je[s.status]);
return}s.status=Je.valid,s.validated=i,s.peers.forEach(o=>{o!==e.toString()&&this.markDuplicateMessageDelivery(o,r)})}rejectInvalidMessage(e,t){
this.markInvalidMessageDelivery(e,t)}rejectMessage(e,t,r,s){switch(s){case $t.Error:this.markInvalidMessageDelivery(e,r);
return;case $t.Blacklisted:return}const i=this.deliveryRecords.ensureRecord(t);if(i.status!==Je.unknown){this.log("unexp\
ected rejection: message from %s was first seen %s ago and has delivery status %d",e,Date.now()-i.firstSeenTsMs,Je[i.status]);
return}if(s===$t.Ignore){i.status=Je.ignored,i.peers.clear();return}i.status=Je.invalid,this.markInvalidMessageDelivery(
e,r),i.peers.forEach(o=>{this.markInvalidMessageDelivery(o,r)}),i.peers.clear()}duplicateMessage(e,t,r){const s=this.deliveryRecords.
ensureRecord(t);if(!s.peers.has(e))switch(s.status){case Je.unknown:s.peers.add(e);break;case Je.valid:s.peers.add(e),this.
markDuplicateMessageDelivery(e,r,s.validated);break;case Je.invalid:this.markInvalidMessageDelivery(e,r);break;case Je.ignored:
break}}markInvalidMessageDelivery(e,t){const r=this.peerStats.get(e);if(r!=null){const s=this.getPtopicStats(r,t);s!=null&&
(s.invalidMessageDeliveries+=1)}}markFirstMessageDelivery(e,t){const r=this.peerStats.get(e);if(r!=null){const s=this.getPtopicStats(
r,t);if(s!=null){let i=this.params.topics[t].firstMessageDeliveriesCap;s.firstMessageDeliveries=Math.min(i,s.firstMessageDeliveries+
1),s.inMesh&&(i=this.params.topics[t].meshMessageDeliveriesCap,s.meshMessageDeliveries=Math.min(i,s.meshMessageDeliveries+
1))}}}markDuplicateMessageDelivery(e,t,r){const s=this.peerStats.get(e);if(s!=null){const i=r!==void 0?Date.now():0,o=this.
getPtopicStats(s,t);if(o!=null&&o.inMesh){const a=this.params.topics[t];if(r!==void 0){const l=i-r,u=l>a.meshMessageDeliveriesWindow;
if(this.metrics?.onDuplicateMsgDelivery(t,l,u),u)return}const c=a.meshMessageDeliveriesCap;o.meshMessageDeliveries=Math.
min(c,o.meshMessageDeliveries+1)}}}removeIPsForPeer(e,t){for(const r of t){const s=this.peerIPs.get(r);s!=null&&(s.delete(
e),s.size===0&&this.peerIPs.delete(r))}}getPtopicStats(e,t){let r=e.topics[t];return r!==void 0?r:this.params.topics[t]!==
void 0?(r={inMesh:!1,graftTime:0,meshTime:0,firstMessageDeliveries:0,meshMessageDeliveries:0,meshMessageDeliveriesActive:!1,
meshFailurePenalty:0,invalidMessageDeliveries:0},e.topics[t]=r,r):null}}function IU(n,e,t,r,s){let i=0;const o=new Map;if(Object.
entries(e.topics).forEach(([d,p])=>{const v=s.get(d)??"unknown",g=t.topics[d];if(g===void 0)return;let E=o.get(v);E==null&&
(E={p1w:0,p2w:0,p3w:0,p3bw:0,p4w:0},o.set(v,E));let f=0,b=0,_=0,m=0,y=0;if(p.inMesh){const x=Math.max(p.meshTime/g.timeInMeshQuantum,
g.timeInMeshCap);f+=x*g.timeInMeshWeight}let A=p.firstMessageDeliveries;if(A>g.firstMessageDeliveriesCap&&(A=g.firstMessageDeliveriesCap),
b+=A*g.firstMessageDeliveriesWeight,p.meshMessageDeliveriesActive&&p.meshMessageDeliveries<g.meshMessageDeliveriesThreshold){
const x=g.meshMessageDeliveriesThreshold-p.meshMessageDeliveries,C=x*x;_+=C*g.meshMessageDeliveriesWeight}const w=p.meshFailurePenalty;
m+=w*g.meshFailurePenaltyWeight;const S=p.invalidMessageDeliveries*p.invalidMessageDeliveries;y+=S*g.invalidMessageDeliveriesWeight,
i+=(f+b+_+m+y)*g.topicWeight,E.p1w+=f,E.p2w+=b,E.p3w+=_,E.p3bw+=m,E.p4w+=y}),t.topicScoreCap>0&&i>t.topicScoreCap){i=t.topicScoreCap;
const d=t.topicScoreCap/i;for(const p of o.values())p.p1w*=d,p.p2w*=d,p.p3w*=d,p.p3bw*=d,p.p4w*=d}let a=0,c=0,l=0;const u=t.
appSpecificScore(n);a+=u*t.appSpecificWeight,e.knownIPs.forEach(d=>{if(t.IPColocationFactorWhitelist.has(d))return;const p=r.
get(d),v=p!=null?p.size:0;if(v>t.IPColocationFactorThreshold){const g=v-t.IPColocationFactorThreshold,E=g*g;c+=E*t.IPColocationFactorWeight}});
const h=e.behaviourPenalty*e.behaviourPenalty;return l+=h*t.behaviourPenaltyWeight,i+=a+c+l,{byTopic:o,p5w:a,p6w:c,p7w:l,
score:i}}function MU(n,e,t,r,s){const i={byTopic:new Map,p5w:[],p6w:[],p7w:[],score:[]};for(const o of n){const a=e.get(
o);if(a!=null){const c=IU(o,a,t,r,s);for(const[l,u]of c.byTopic){let h=i.byTopic.get(l);h==null&&(h={p1w:[],p2w:[],p3w:[],
p3bw:[],p4w:[]},i.byTopic.set(l,h)),h.p1w.push(u.p1w),h.p2w.push(u.p2w),h.p3w.push(u.p3w),h.p3bw.push(u.p3bw),h.p4w.push(
u.p4w)}i.p5w.push(c.p5w),i.p6w.push(c.p6w),i.p7w.push(c.p7w),i.score.push(c.score)}else i.p5w.push(0),i.p6w.push(0),i.p7w.
push(0),i.score.push(0)}return i}class PU{rawStream;constructor(e,t,r){this.rawStream=e,r.maxBufferSize!=null&&(e.maxWriteBufferLength=
r.maxBufferSize),e.addEventListener("close",s=>{s.error!=null&&t(s.error)})}get protocol(){return this.rawStream.protocol}async push(e){
return this.pushPrefixed(Dd.single(e))}pushPrefixed(e){this.rawStream.send(e)}async close(e){await this.rawStream.close(
e).catch(t=>{this.rawStream.abort(t)})}}class TU{source;rawStream;closeController;constructor(e,t={}){this.rawStream=e,this.
closeController=new AbortController,this.closeController.signal.addEventListener("abort",()=>{e.close().catch(r=>{e.abort(
r)})}),this.source=$S(this.rawStream,r=>bh(r,t))}async close(){this.closeController.abort()}}class DU{gossipsubIWantFollowupMs;msgIdToStrFn;metrics;promises=new Map;requestMsByMsg=new Map;requestMsByMsgExpire;constructor(e,t,r){
this.gossipsubIWantFollowupMs=e,this.msgIdToStrFn=t,this.metrics=r,this.requestMsByMsgExpire=10*e}get size(){return this.
promises.size}get requestMsByMsgSize(){return this.requestMsByMsg.size}addPromise(e,t){const r=Math.floor(Math.random()*
t.length),s=t[r],i=this.msgIdToStrFn(s);let o=this.promises.get(i);o==null&&(o=new Map,this.promises.set(i,o));const a=Date.
now();o.has(e)||(o.set(e,a+this.gossipsubIWantFollowupMs),this.metrics!=null&&(this.metrics.iwantPromiseStarted.inc(1),this.
requestMsByMsg.has(i)||this.requestMsByMsg.set(i,a)))}getBrokenPromises(){const e=Date.now(),t=new Map;let r=0;return this.
promises.forEach((s,i)=>{s.forEach((o,a)=>{o<e&&(t.set(a,(t.get(a)??0)+1),s.delete(a),r++)}),s.size===0&&this.promises.delete(
i)}),this.metrics?.iwantPromiseBroken.inc(r),t}deliverMessage(e,t=!1){this.trackMessage(e);const r=this.promises.get(e);
r!=null&&(this.promises.delete(e),this.metrics!=null&&(this.metrics.iwantPromiseResolved.inc(1),t&&this.metrics.iwantPromiseResolvedFromDuplicate.
inc(1),this.metrics.iwantPromiseResolvedPeers.inc(r.size)))}rejectMessage(e,t){switch(this.trackMessage(e),t){case $t.Error:
return}this.promises.delete(e)}clear(){this.promises.clear()}prune(){const e=Date.now()-this.requestMsByMsgExpire;let t=0;
for(const[r,s]of this.requestMsByMsg.entries())if(s<e)this.requestMsByMsg.delete(r),t++;else break;this.metrics?.iwantMessagePruned.
inc(t)}trackMessage(e){if(this.metrics!=null){const t=this.requestMsByMsg.get(e);t!==void 0&&(this.metrics.iwantPromiseDeliveryTime.
observe((Date.now()-t)/1e3),this.requestMsByMsg.delete(e))}}}const lv=Dr("libp2p-pubsub:");async function $U(n,e,t,r){switch(n.
type){case Cs.Signing:{const s={from:n.author.toMultihash().bytes,data:r,seqno:lb(8),topic:e,signature:void 0,key:void 0},
i=ji([lv,yr.Message.encode(s)]);s.signature=await n.privateKey.sign(i),s.key=n.key;const o={type:"signed",from:n.author,
data:t,sequenceNumber:BigInt(`0x${je(s.seqno??new Uint8Array(0),"base16")}`),topic:e,signature:s.signature,key:Jt(s.key)};
return{raw:s,msg:o}}case Cs.Anonymous:return{raw:{from:void 0,data:r,seqno:void 0,topic:e,signature:void 0,key:void 0},msg:{
type:"unsigned",data:t,topic:e}};default:throw new Error("Unreachable")}}async function kU(n,e){switch(n){case kd:return e.
signature!=null?{valid:!1,error:Ye.SignaturePresent}:e.seqno!=null?{valid:!1,error:Ye.SeqnoPresent}:e.key!=null?{valid:!1,
error:Ye.FromPresent}:{valid:!0,message:{type:"unsigned",topic:e.topic,data:e.data??new Uint8Array(0)}};case ac:{if(e.seqno==
null)return{valid:!1,error:Ye.InvalidSeqno};if(e.seqno.length!==8)return{valid:!1,error:Ye.InvalidSeqno};if(e.signature==
null)return{valid:!1,error:Ye.InvalidSignature};if(e.from==null)return{valid:!1,error:Ye.InvalidPeerId};let t;try{t=Tr(mc(
e.from))}catch{return{valid:!1,error:Ye.InvalidPeerId}}let r;if(e.key!=null){if(r=Jt(e.key),t.publicKey!==void 0&&!r.equals(
t.publicKey))return{valid:!1,error:Ye.InvalidPeerId}}else{if(t.publicKey==null)return{valid:!1,error:Ye.InvalidPeerId};r=
t.publicKey}const s={from:e.from,data:e.data,seqno:e.seqno,topic:e.topic,signature:void 0,key:void 0},i=ji([lv,yr.Message.
encode(s)]);return await r.verify(i,e.signature)?{valid:!0,message:{type:"signed",from:t,data:e.data??new Uint8Array(0),
sequenceNumber:BigInt(`0x${je(e.seqno,"base16")}`),topic:e.topic,signature:e.signature,key:e.key!=null?Jt(e.key):r}}:{valid:!1,
error:Ye.InvalidSignature}}default:throw new Error("Unreachable")}}function Lt(n=[],e){return{subscriptions:[],messages:n,
control:e!==void 0?{graft:e.graft??[],prune:e.prune??[],ihave:e.ihave??[],iwant:e.iwant??[],idontwant:e.idontwant??[]}:void 0}}
function Gg(n){return n.control===void 0&&(n.control={graft:[],prune:[],ihave:[],iwant:[],idontwant:[]}),n}function Bt(n){
if(n.length<=1)return n;const e=()=>Math.floor(Math.random()*Math.floor(n.length));for(let t=0;t<n.length;t++){const r=e(),
s=n[t];n[t]=n[r],n[r]=s}return n}function LU(n){return je(n,"base64")}function RU(n,e,t){switch(n){case ac:return{type:Cs.
Signing,author:e,key:$r(t.publicKey),privateKey:t};case kd:return{type:Cs.Anonymous};default:throw new Error(`Unknown si\
gnature policy "${n}"`)}}const NU=(n,e)=>{const t=Dr(e.toString(16).padStart(16,"0"),"base16"),r=$r(n),s=new Uint8Array(
r.byteLength+t.length);return s.set(r,0),s.set(t,r.byteLength),s};function FU(n){if(n.type!=="signed")throw new Error("e\
xpected signed message type");if(n.sequenceNumber==null)throw Error("missing seqno field");return NU(n.from.publicKey??n.
key,n.sequenceNumber)}async function UU(n){return sb.encode(n.data)}function OU(n){if(yt(n)){const e=ne(n);switch(e.type){case"\
ip4":case"ip6":return e.host}}return null}class Kl{entries=new Map;validityMs;constructor(e){this.validityMs=e.validityMs}get size(){
return this.entries.size}put(e,t){return this.entries.has(e)?!0:(this.entries.set(e,{value:t,validUntilMs:Date.now()+this.
validityMs}),!1)}prune(){const e=Date.now();for(const[t,r]of this.entries.entries())if(r.validUntilMs<e)this.entries.delete(
t);else break}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);return t!=null&&t.validUntilMs>=Date.
now()?t.value:void 0}clear(){this.entries.clear()}}var it;(function(n){n[n.started=0]="started",n[n.stopped=1]="stopped"})(
it||(it={}));class BU extends he{globalSignaturePolicy;protocols=[ql,E5,Og];publishConfig;dataTransform;peers=new Map;streamsInbound=new Map;streamsOutbound=new Map;outboundInflightQueue=ls(
{objectMode:!0});direct=new Set;floodsubPeers=new Set;seenCache;acceptFromWhitelist=new Map;topics=new Map;subscriptions=new Set;mesh=new Map;fanout=new Map;fanoutLastpub=new Map;gossip=new Map;control=new Map;peerhave=new Map;iasked=new Map;backoff=new Map;outbound=new Map;msgIdFn;fastMsgIdFn;msgIdToStrFn;fastMsgIdCache;publishedMessageIds;mcache;score;topicValidators=new Map;log;heartbeatTicks=0;gossipTracer;idontwantCounts=new Map;idontwants=new Map;components;directPeerInitial=null;static multicodec=ql;opts;decodeRpcLimits;metrics;status={
code:it.stopped};maxInboundStreams;maxOutboundStreams;runOnLimitedConnection;allowedTopics;heartbeatTimer=null;constructor(e,t={}){
super();const r={fallbackToFloodsub:!0,floodPublish:!0,batchPublish:!1,tagMeshPeers:!0,doPX:!1,directPeers:[],D:C5,Dlo:x5,
Dhi:I5,Dscore:M5,Dout:P5,Dlazy:$5,heartbeatInterval:R5,fanoutTTL:N5,mcacheLength:T5,mcacheGossip:D5,seenTTL:j5,gossipsubIWantFollowupMs:H5,
prunePeers:F5,pruneBackoff:U5,unsubcribeBackoff:O5,graftFloodThreshold:K5,opportunisticGraftPeers:W5,opportunisticGraftTicks:q5,
directConnectTicks:z5,gossipFactor:k5,idontwantMinDataSize:rU,idontwantMaxMessages:sU,...t,scoreParams:fU(t.scoreParams),
scoreThresholds:yU(t.scoreThresholds)};if(this.components=e,this.decodeRpcLimits=r.decodeRpcLimits??cU,this.globalSignaturePolicy=
r.globalSignaturePolicy??ac,r.fallbackToFloodsub&&this.protocols.push(Ug),this.log=e.logger.forComponent(r.debugName??"l\
ibp2p:gossipsub"),this.opts=r,this.direct=new Set(r.directPeers.map(s=>s.id.toString())),this.seenCache=new Kl({validityMs:r.
seenTTL}),this.publishedMessageIds=new Kl({validityMs:r.seenTTL}),t.msgIdFn!=null)this.msgIdFn=t.msgIdFn;else switch(this.
globalSignaturePolicy){case ac:this.msgIdFn=FU;break;case kd:this.msgIdFn=UU;break;default:throw new Error(`Invalid glob\
alSignaturePolicy: ${this.globalSignaturePolicy}`)}if(t.fastMsgIdFn!=null&&(this.fastMsgIdFn=t.fastMsgIdFn,this.fastMsgIdCache=
new Kl({validityMs:r.seenTTL})),this.msgIdToStrFn=t.msgIdToStrFn??LU,this.mcache=t.messageCache??new lU(r.mcacheGossip,r.
mcacheLength,this.msgIdToStrFn),t.dataTransform!=null&&(this.dataTransform=t.dataTransform),t.metricsRegister!=null){if(t.
metricsTopicStrToLabel==null)throw Error("Must set metricsTopicStrToLabel with metrics");const s=Math.max(...Object.values(
r.scoreParams.topics).map(o=>o.meshMessageDeliveriesWindow),tU),i=uU(t.metricsRegister,t.metricsTopicStrToLabel,{gossipPromiseExpireSec:this.
opts.gossipsubIWantFollowupMs/1e3,behaviourPenaltyThreshold:r.scoreParams.behaviourPenaltyThreshold,maxMeshMessageDeliveriesWindowSec:s/
1e3});i.mcacheSize.addCollect(()=>{this.onScrapeMetrics(i)});for(const o of this.protocols)i.protocolsEnabled.set({protocol:o},
1);this.metrics=i}else this.metrics=null;this.gossipTracer=new DU(this.opts.gossipsubIWantFollowupMs,this.msgIdToStrFn,this.
metrics),this.score=new xU(this.opts.scoreParams,this.metrics,this.components.logger,{scoreCacheValidityMs:r.heartbeatInterval}),
this.maxInboundStreams=t.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams,this.runOnLimitedConnection=t.runOnLimitedConnection,
this.allowedTopics=r.allowedTopics!=null?new Set(r.allowedTopics):null}[Symbol.toStringTag]="@chainsafe/libp2p-gossipsub";[st]=[
"@libp2p/pubsub"];[us]=["@libp2p/identify"];getPeers(){return[...this.peers.values()]}isStarted(){return this.status.code===
it.started}async start(){if(this.isStarted())return;this.log("starting"),this.publishConfig=RU(this.globalSignaturePolicy,
this.components.peerId,this.components.privateKey),this.outboundInflightQueue=ls({objectMode:!0}),Qd(this.outboundInflightQueue,
async i=>{for await(const{peerId:o,connection:a}of i)await this.createOutboundStream(o,a)}).catch(i=>{this.log.error("ou\
tbound inflight queue error",i)}),await Promise.all(this.opts.directPeers.map(async i=>{await this.components.peerStore.
merge(i.id,{multiaddrs:i.addrs})}));const e=this.components.registrar;await Promise.all(this.protocols.map(async i=>e.handle(
i,this.onIncomingStream.bind(this),{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams,
runOnLimitedConnection:this.runOnLimitedConnection})));const t={onConnect:this.onPeerConnected.bind(this),onDisconnect:this.
onPeerDisconnected.bind(this),notifyOnLimitedConnection:this.runOnLimitedConnection},r=await Promise.all(this.protocols.
map(async i=>e.register(i,t))),s=setTimeout(this.runHeartbeat,Bg);this.status={code:it.started,registrarTopologyIds:r,heartbeatTimeout:s,
hearbeatStartMs:Date.now()+Bg},this.score.start(),this.directPeerInitial=setTimeout(()=>{Promise.resolve().then(async()=>{
await Promise.all(Array.from(this.direct).map(async i=>this.connect(i)))}).catch(i=>{this.log(i)})},V5),this.opts.tagMeshPeers&&
(this.addEventListener("gossipsub:graft",this.tagMeshPeer),this.addEventListener("gossipsub:prune",this.untagMeshPeer)),
this.log("started")}async stop(){if(this.log("stopping"),this.status.code!==it.started)return;const{registrarTopologyIds:e}=this.
status;this.status={code:it.stopped},this.opts.tagMeshPeers&&(this.removeEventListener("gossipsub:graft",this.tagMeshPeer),
this.removeEventListener("gossipsub:prune",this.untagMeshPeer));const t=this.components.registrar;await Promise.all(this.
protocols.map(async s=>t.unhandle(s))),e.forEach(s=>{t.unregister(s)}),this.outboundInflightQueue.end();const r=[];for(const s of this.
streamsOutbound.values())r.push(s.close());this.streamsOutbound.clear();for(const s of this.streamsInbound.values())r.push(
s.close());this.streamsInbound.clear(),await Promise.all(r),this.peers.clear(),this.subscriptions.clear(),this.heartbeatTimer!=
null&&(this.heartbeatTimer.cancel(),this.heartbeatTimer=null),this.score.stop(),this.mesh.clear(),this.fanout.clear(),this.
fanoutLastpub.clear(),this.gossip.clear(),this.control.clear(),this.peerhave.clear(),this.iasked.clear(),this.backoff.clear(),
this.outbound.clear(),this.gossipTracer.clear(),this.seenCache.clear(),this.fastMsgIdCache!=null&&this.fastMsgIdCache.clear(),
this.directPeerInitial!=null&&clearTimeout(this.directPeerInitial),this.idontwantCounts.clear(),this.idontwants.clear(),
this.log("stopped")}dumpPeerScoreStats(){return this.score.dumpPeerScoreStats()}onIncomingStream(e,t){if(!this.isStarted())
return;const r=t.remotePeer;this.addPeer(r,t.direction,t.remoteAddr),this.createInboundStream(r,e),this.outboundInflightQueue.
push({peerId:r,connection:t})}onPeerConnected(e,t){this.metrics?.newConnectionCount.inc({status:t.status}),!(!this.isStarted()||
t.status!=="open")&&(this.addPeer(e,t.direction,t.remoteAddr),this.outboundInflightQueue.push({peerId:e,connection:t}))}onPeerDisconnected(e){
this.log("connection ended %p",e),this.removePeer(e)}async createOutboundStream(e,t){if(!this.isStarted())return;const r=e.
toString();if(this.peers.has(r)&&!this.streamsOutbound.has(r))try{const s=new PU(await t.newStream(this.protocols,{runOnLimitedConnection:this.
runOnLimitedConnection}),o=>{this.log.error("outbound pipe error",o)},{maxBufferSize:this.opts.maxOutboundBufferSize});this.
log("create outbound stream %p",e),this.streamsOutbound.set(r,s);const i=s.protocol;i===Ug&&this.floodsubPeers.add(r),this.
metrics?.peersPerProtocol.inc({protocol:i},1),this.subscriptions.size>0&&(this.log("send subscriptions to",r),this.sendSubscriptions(
r,Array.from(this.subscriptions),!0))}catch(s){this.log.error("createOutboundStream error",s)}}createInboundStream(e,t){
if(!this.isStarted())return;const r=e.toString();if(!this.peers.has(r))return;const s=this.streamsInbound.get(r);s!==void 0&&
(this.log("replacing existing inbound steam %s",r),s.close().catch(o=>{this.log.error(o)})),this.log("create inbound str\
eam %s",r);const i=new TU(t,{maxDataLength:this.opts.maxInboundDataLength});this.streamsInbound.set(r,i),this.pipePeerReadStream(
e,i.source).catch(o=>{this.log(o)})}addPeer(e,t,r){const s=e.toString();if(!this.peers.has(s)){this.peers.set(s,e),this.
score.addPeer(s);const i=OU(r);i!==null?this.score.addIP(s,i):this.log("Added peer has no IP in current address %s %s",s,
r.toString()),this.outbound.has(s)||this.outbound.set(s,t==="outbound")}}removePeer(e){const t=e.toString();if(!this.peers.
has(t))return;this.log("delete peer %p",e),this.peers.delete(t);const r=this.streamsOutbound.get(t),s=this.streamsInbound.
get(t);r!=null&&this.metrics?.peersPerProtocol.inc({protocol:r.protocol},-1),r?.close().catch(i=>{this.log.error(i)}),s?.
close().catch(i=>{this.log.error(i)}),this.streamsOutbound.delete(t),this.streamsInbound.delete(t);for(const i of this.topics.
values())i.delete(t);for(const[i,o]of this.mesh)o.delete(t)&&this.metrics?.onRemoveFromMesh(i,Nt.Dc,1);for(const i of this.
fanout.values())i.delete(t);this.floodsubPeers.delete(t),this.gossip.delete(t),this.control.delete(t),this.outbound.delete(
t),this.idontwantCounts.delete(t),this.idontwants.delete(t),this.score.removePeer(t),this.acceptFromWhitelist.delete(t)}get started(){
return this.status.code===it.started}getMeshPeers(e){const t=this.mesh.get(e);return t!=null?Array.from(t):[]}getSubscribers(e){
const t=this.topics.get(e);return(t!=null?Array.from(t):[]).map(r=>this.peers.get(r)??te(r))}getTopics(){return Array.from(
this.subscriptions)}async pipePeerReadStream(e,t){try{await Qd(t,async r=>{for await(const s of r)try{const i=s.subarray(),
o=yr.decode(i,{limits:{subscriptions:this.decodeRpcLimits.maxSubscriptions,messages:this.decodeRpcLimits.maxMessages,control$:{
ihave:this.decodeRpcLimits.maxIhaveMessageIDs,iwant:this.decodeRpcLimits.maxIwantMessageIDs,graft:this.decodeRpcLimits.maxControlMessages,
prune:this.decodeRpcLimits.maxControlMessages,prune$:{peers:this.decodeRpcLimits.maxPeerInfos},idontwant:this.decodeRpcLimits.
maxControlMessages,idontwant$:{messageIDs:this.decodeRpcLimits.maxIdontwantMessageIDs}}}});if(this.metrics?.onRpcRecv(o,
i.length),this.opts.awaitRpcHandler)try{await this.handleReceivedRpc(e,o)}catch(a){this.metrics?.onRpcRecvError(),this.log(
a)}else this.handleReceivedRpc(e,o).catch(a=>{this.metrics?.onRpcRecvError(),this.log(a)})}catch(i){this.metrics?.onRpcDataError(),
this.log(i)}})}catch(r){this.metrics?.onPeerReadStreamError(),this.handlePeerReadStreamError(r,e)}}handlePeerReadStreamError(e,t){
this.log.error(e),this.onPeerDisconnected(t)}async handleReceivedRpc(e,t){if(!this.acceptFrom(e.toString())){this.log("r\
eceived message from unacceptable peer %p",e),this.metrics?.rpcRecvNotAccepted.inc();return}const r=t.subscriptions!=null?
t.subscriptions.length:0,s=t.messages!=null?t.messages.length:0;let i=0,o=0,a=0,c=0;if(t.control!=null&&(t.control.ihave!=
null&&(i=t.control.ihave.length),t.control.iwant!=null&&(o=t.control.iwant.length),t.control.graft!=null&&(a=t.control.graft.
length),t.control.prune!=null&&(c=t.control.prune.length)),this.log(`rpc.from ${e.toString()} subscriptions ${r} message\
s ${s} ihave ${i} iwant ${o} graft ${a} prune ${c}`),t.subscriptions!=null&&t.subscriptions.length>0){const l=[];t.subscriptions.
forEach(u=>{const h=u.topic,d=u.subscribe===!0;if(h!=null){if(this.allowedTopics!=null&&!this.allowedTopics.has(h))return;
this.handleReceivedSubscription(e,h,d),l.push({topic:h,subscribe:d})}}),this.safeDispatchEvent("subscription-change",{detail:{
peerId:e,subscriptions:l}})}for(const l of t.messages){if(this.allowedTopics!=null&&!this.allowedTopics.has(l.topic))continue;
const u=this.handleReceivedMessage(e,l).catch(h=>{this.metrics?.onMsgRecvError(l.topic),this.log(h)});this.opts.awaitRpcMessageHandler&&
await u}t.control!=null&&await this.handleControlMessage(e.toString(),t.control)}handleReceivedSubscription(e,t,r){this.
log("subscription update from %p topic %s",e,t);let s=this.topics.get(t);s==null&&(s=new Set,this.topics.set(t,s)),r?s.add(
e.toString()):s.delete(e.toString())}async handleReceivedMessage(e,t){this.metrics?.onMsgRecvPreValidation(t.topic);const r=await this.
validateReceivedMessage(e,t);this.metrics?.onPrevalidationResult(t.topic,r.code);const s=r.code;switch(s){case et.duplicate:
this.score.duplicateMessage(e.toString(),r.msgIdStr,t.topic),this.gossipTracer.deliverMessage(r.msgIdStr,!0),this.mcache.
observeDuplicate(r.msgIdStr,e.toString());return;case et.invalid:if(r.msgIdStr!=null){const i=r.msgIdStr;this.score.rejectMessage(
e.toString(),i,t.topic,r.reason),this.gossipTracer.rejectMessage(i,r.reason)}else this.score.rejectInvalidMessage(e.toString(),
t.topic);this.metrics?.onMsgRecvInvalid(t.topic,r);return;case et.valid:this.score.validateMessage(r.messageId.msgIdStr),
this.gossipTracer.deliverMessage(r.messageId.msgIdStr),this.mcache.put(r.messageId,t,!this.opts.asyncValidation),this.subscriptions.
has(t.topic)&&(!this.components.peerId.equals(e)||this.opts.emitSelf)&&(super.dispatchEvent(new CustomEvent("gossipsub:m\
essage",{detail:{propagationSource:e,msgId:r.messageId.msgIdStr,msg:r.msg}})),super.dispatchEvent(new CustomEvent("messa\
ge",{detail:r.msg}))),this.opts.asyncValidation||this.forwardMessage(r.messageId.msgIdStr,t,e.toString());break;default:
throw new Error(`Invalid validation result: ${s}`)}}async validateReceivedMessage(e,t){const r=this.fastMsgIdFn?.(t),s=r!==
void 0?this.fastMsgIdCache?.get(r):void 0;if(s!=null)return{code:et.duplicate,msgIdStr:s};const i=await kU(this.globalSignaturePolicy,
t);if(!i.valid)return{code:et.invalid,reason:$t.Error,error:i.error};const o=i.message;try{this.dataTransform!=null&&(o.
data=this.dataTransform.inboundTransform(t.topic,o.data))}catch(h){return this.log("Invalid message, transform failed",h),
{code:et.invalid,reason:$t.Error,error:Ye.TransformFailed}}const a=await this.msgIdFn(o),c=this.msgIdToStrFn(a),l={msgId:a,
msgIdStr:c};if(r!==void 0&&this.fastMsgIdCache!=null&&this.fastMsgIdCache.put(r,c)&&this.metrics?.fastMsgIdCacheCollision.
inc(),this.seenCache.has(c))return{code:et.duplicate,msgIdStr:c};this.seenCache.put(c),(t.data?.length??0)>=this.opts.idontwantMinDataSize&&
this.sendIDontWants(a,t.topic,e.toString());const u=this.topicValidators.get(t.topic);if(u!=null){let h;try{h=await u(e,
o)}catch(d){const p=d.code;p===Y5&&(h=mt.Ignore),p===Q5?h=mt.Reject:h=mt.Ignore}if(h!==mt.Accept)return{code:et.invalid,
reason:qg(h),msgIdStr:c}}return{code:et.valid,messageId:l,msg:o}}getScore(e){return this.score.score(e)}sendSubscriptions(e,t,r){
this.sendRpc(e,{subscriptions:t.map(s=>({topic:s,subscribe:r})),messages:[]})}async handleControlMessage(e,t){if(t===void 0)
return;const r=t.ihave?.length>0?this.handleIHave(e,t.ihave):[],s=t.iwant?.length>0?this.handleIWant(e,t.iwant):[],i=t.graft?.
length>0?await this.handleGraft(e,t.graft):[];if(t.prune?.length>0&&await this.handlePrune(e,t.prune),t.idontwant?.length>
0&&this.handleIdontwant(e,t.idontwant),r.length===0&&s.length===0&&i.length===0)return;const o=this.sendRpc(e,Lt(s,{iwant:r,
prune:i})),a=r[0]?.messageIDs;a!=null&&(o?this.gossipTracer.addPromise(e,a):this.metrics?.iwantPromiseUntracked.inc(1))}acceptFrom(e){
if(this.direct.has(e))return!0;const t=Date.now(),r=this.acceptFromWhitelist.get(e);if(r!=null&&r.messagesAccepted<Z5&&r.
acceptUntil>=t)return r.messagesAccepted+=1,!0;const s=this.score.score(e);return s>=J5?this.acceptFromWhitelist.set(e,{
messagesAccepted:0,acceptUntil:t+eU}):this.acceptFromWhitelist.delete(e),s>=this.opts.scoreThresholds.graylistThreshold}handleIHave(e,t){
if(t.length===0)return[];const r=this.score.score(e);if(r<this.opts.scoreThresholds.gossipThreshold)return this.log("IHA\
VE: ignoring peer %s with score below threshold [ score = %d ]",e,r),this.metrics?.ihaveRcvIgnored.inc({reason:yi.LowScore}),
[];const s=(this.peerhave.get(e)??0)+1;if(this.peerhave.set(e,s),s>G5)return this.log("IHAVE: peer %s has advertised too\
 many times (%d) within this heartbeat interval; ignoring",e,s),this.metrics?.ihaveRcvIgnored.inc({reason:yi.MaxIhave}),
[];const i=this.iasked.get(e)??0;if(i>=Xr)return this.log("IHAVE: peer %s has already advertised too many messages (%d);\
 ignoring",e,i),this.metrics?.ihaveRcvIgnored.inc({reason:yi.MaxIasked}),[];const o=new Map;if(t.forEach(({topicID:l,messageIDs:u})=>{
if(l==null||u==null||!this.mesh.has(l))return;let h=0;u.forEach(d=>{const p=this.msgIdToStrFn(d);this.seenCache.has(p)||
(o.set(p,d),h++)}),this.metrics?.onIhaveRcv(l,u.length,h)}),o.size===0)return[];let a=o.size;a+i>Xr&&(a=Xr-i),this.log("\
IHAVE: Asking for %d out of %d messages from %s",a,o.size,e);let c=Array.from(o.values());return Bt(c),c=c.slice(0,a),this.
iasked.set(e,i+a),[{messageIDs:c}]}handleIWant(e,t){if(t.length===0)return[];const r=this.score.score(e);if(r<this.opts.
scoreThresholds.gossipThreshold)return this.log("IWANT: ignoring peer %s with score below threshold [score = %d]",e,r),[];
const s=new Map,i=new Map;let o=0;return t.forEach(({messageIDs:a})=>{a?.forEach(c=>{const l=this.msgIdToStrFn(c),u=this.
mcache.getWithIWantCount(l,e);if(u==null){o++;return}if(i.set(u.msg.topic,1+(i.get(u.msg.topic)??0)),u.count>L5){this.log(
"IWANT: Peer %s has asked for message %s too many times: ignoring request",e,c);return}s.set(l,u.msg)})}),this.metrics?.
onIwantRcv(i,o),s.size===0?(this.log("IWANT: Could not provide any wanted messages to %s",e),[]):(this.log("IWANT: Sendi\
ng %d messages to %s",s.size,e),Array.from(s.values()))}async handleGraft(e,t){const r=[],s=this.score.score(e),i=Date.now();
let o=this.opts.doPX;if(t.forEach(({topicID:c})=>{if(c==null)return;const l=this.mesh.get(c);if(l==null){o=!1;return}if(l.
has(e))return;const u=this.backoff.get(c)?.get(e);if(this.direct.has(e))this.log("GRAFT: ignoring request from direct pe\
er %s",e),r.push(c),o=!1;else if(typeof u=="number"&&i<u){this.log("GRAFT: ignoring backed off peer %s",e),this.score.addPenalty(
e,1,bi.GraftBackoff),o=!1;const h=u+this.opts.graftFloodThreshold-this.opts.pruneBackoff;i<h&&this.score.addPenalty(e,1,
bi.GraftBackoff),this.addBackoff(e,c),r.push(c)}else s<0?(this.log("GRAFT: ignoring peer %s with negative score: score=%\
d, topic=%s",e,s,c),r.push(c),o=!1,this.addBackoff(e,c)):l.size>=this.opts.Dhi&&!(this.outbound.get(e)??!1)?(r.push(c),this.
addBackoff(e,c)):(this.log("GRAFT: Add mesh link from %s in %s",e,c),this.score.graft(e,c),l.add(e),this.metrics?.onAddToMesh(
c,rt.Subscribed,1));this.safeDispatchEvent("gossipsub:graft",{detail:{peerId:e,topic:c,direction:"inbound"}})}),r.length===
0)return[];const a=!1;return Promise.all(r.map(async c=>this.makePrune(e,c,o,a)))}async handlePrune(e,t){const r=this.score.
score(e);for(const{topicID:s,backoff:i,peers:o}of t){if(s==null)continue;const a=this.mesh.get(s);if(a==null)return;this.
log("PRUNE: Remove mesh link to %s in %s",e,s),this.score.prune(e,s),a.has(e)&&(a.delete(e),this.metrics?.onRemoveFromMesh(
s,Nt.Prune,1)),typeof i=="number"&&i>0?this.doAddBackoff(e,s,i*1e3):this.addBackoff(e,s),o!=null&&o.length>0&&(r<this.opts.
scoreThresholds.acceptPXThreshold?this.log("PRUNE: ignoring PX from peer %s with insufficient score [score = %d, topic =\
 %s]",e,r,s):await this.pxConnect(o)),this.safeDispatchEvent("gossipsub:prune",{detail:{peerId:e,topic:s,direction:"inbo\
und"}})}}handleIdontwant(e,t){let r=this.idontwantCounts.get(e)??0;if(r>=this.opts.idontwantMaxMessages)return;const s=r;
let i=this.idontwants.get(e);i==null&&(i=new Map,this.idontwants.set(e,i));let o=0;e:for(const{messageIDs:c}of t)for(const l of c){
if(r>=this.opts.idontwantMaxMessages)break e;r++;const u=this.msgIdToStrFn(l);i.set(u,this.heartbeatTicks),this.mcache.msgs.
has(u)||o++}this.idontwantCounts.set(e,r);const a=r-s;this.metrics?.onIdontwantRcv(a,o)}addBackoff(e,t){this.doAddBackoff(
e,t,this.opts.pruneBackoff)}doAddBackoff(e,t,r){let s=this.backoff.get(t);s==null&&(s=new Map,this.backoff.set(t,s));const i=Date.
now()+r;(s.get(e)??0)<i&&s.set(e,i)}applyIwantPenalties(){this.gossipTracer.getBrokenPromises().forEach((e,t)=>{this.log(
"peer %s didn't follow up in %d IWANT requests; adding penalty",t,e),this.score.addPenalty(t,e,bi.BrokenPromise)})}clearBackoff(){
if(this.heartbeatTicks%B5!==0)return;const e=Date.now();this.backoff.forEach((t,r)=>{t.forEach((s,i)=>{s+nU*this.opts.heartbeatInterval<
e&&t.delete(i)}),t.size===0&&this.backoff.delete(r)})}async directConnect(){const e=[];this.direct.forEach(t=>{this.streamsOutbound.
has(t)||e.push(t)}),await Promise.all(e.map(async t=>this.connect(t)))}async pxConnect(e){e.length>this.opts.prunePeers&&
(Bt(e),e=e.slice(0,this.opts.prunePeers));const t=[];await Promise.all(e.map(async r=>{if(r.peerID==null)return;const s=Tr(
mc(r.peerID)),i=s.toString();if(!this.peers.has(i)){if(r.signedPeerRecord==null){t.push(i);return}try{if(!await this.components.
peerStore.consumePeerRecord(r.signedPeerRecord,{expectedPeer:s})){this.log("bogus peer record obtained through px: could\
 not add peer record to address book");return}t.push(i)}catch{this.log("bogus peer record obtained through px: invalid s\
ignature or not a peer record")}}})),t.length!==0&&await Promise.all(t.map(async r=>this.connect(r)))}async connect(e){this.
log("Initiating connection with %s",e);const t=te(e),r=await this.components.connectionManager.openConnection(t);for(const s of this.
protocols)for(const i of this.components.registrar.getTopologies(s))i.onConnect?.(t,r)}subscribe(e){if(this.status.code!==
it.started)throw new Error("Pubsub has not started");if(!this.subscriptions.has(e)){this.subscriptions.add(e);for(const t of this.
peers.keys())this.sendSubscriptions(t,[e],!0)}this.join(e)}unsubscribe(e){if(this.status.code!==it.started)throw new Error(
"Pubsub is not started");const t=this.subscriptions.delete(e);if(this.log("unsubscribe from %s - am subscribed %s",e,t),
t)for(const r of this.peers.keys())this.sendSubscriptions(r,[e],!1);this.leave(e)}join(e){if(this.status.code!==it.started)
throw new Error("Gossipsub has not started");if(this.mesh.has(e))return;this.log("JOIN %s",e),this.metrics?.onJoin(e);const t=new Set,
r=this.backoff.get(e),s=this.fanout.get(e);if(s!=null&&(this.fanout.delete(e),this.fanoutLastpub.delete(e),s.forEach(i=>{
!this.direct.has(i)&&this.score.score(i)>=0&&r?.has(i)!==!0&&t.add(i)}),this.metrics?.onAddToMesh(e,rt.Fanout,t.size)),t.
size<this.opts.D){const i=t.size;this.getRandomGossipPeers(e,this.opts.D,a=>!t.has(a)&&!this.direct.has(a)&&this.score.score(
a)>=0&&r?.has(a)!==!0).forEach(a=>{t.add(a)}),this.metrics?.onAddToMesh(e,rt.Random,t.size-i)}this.mesh.set(e,t),t.forEach(
i=>{this.log("JOIN: Add mesh link to %s in %s",i,e),this.sendGraft(i,e)})}leave(e){if(this.status.code!==it.started)throw new Error(
"Gossipsub has not started");this.log("LEAVE %s",e),this.metrics?.onLeave(e);const t=this.mesh.get(e);t!=null&&(Promise.
all(Array.from(t).map(async r=>{this.log("LEAVE: Remove mesh link to %s in %s",r,e),await this.sendPrune(r,e)})).catch(r=>{
this.log("Error sending prunes to mesh peers",r)}),this.mesh.delete(e))}selectPeersToForward(e,t,r){const s=new Set,i=this.
topics.get(e);i!=null&&(this.direct.forEach(a=>{i.has(a)&&t!==a&&!(r?.has(a)??!1)&&s.add(a)}),this.floodsubPeers.forEach(
a=>{i.has(a)&&t!==a&&!(r?.has(a)??!1)&&this.score.score(a)>=this.opts.scoreThresholds.publishThreshold&&s.add(a)}));const o=this.
mesh.get(e);return o!=null&&o.size>0&&o.forEach(a=>{t!==a&&!(r?.has(a)??!1)&&s.add(a)}),s}selectPeersToPublish(e){const t=new Set,
r={direct:0,floodsub:0,mesh:0,fanout:0},s=this.topics.get(e);if(s!=null)if(this.opts.floodPublish)s.forEach(i=>{this.direct.
has(i)?(t.add(i),r.direct++):this.score.score(i)>=this.opts.scoreThresholds.publishThreshold&&(t.add(i),r.floodsub++)});else{
this.direct.forEach(o=>{s.has(o)&&(t.add(o),r.direct++)}),this.floodsubPeers.forEach(o=>{s.has(o)&&this.score.score(o)>=
this.opts.scoreThresholds.publishThreshold&&(t.add(o),r.floodsub++)});const i=this.mesh.get(e);if(i!=null&&i.size>0)i.forEach(
o=>{t.add(o),r.mesh++}),i.size<this.opts.D&&this.getRandomGossipPeers(e,this.opts.D-i.size,a=>!i.has(a)&&!this.direct.has(
a)&&!this.floodsubPeers.has(a)&&this.score.score(a)>=this.opts.scoreThresholds.publishThreshold).forEach(a=>{t.add(a),r.
mesh++});else{const o=this.fanout.get(e);if(o!=null&&o.size>0)o.forEach(a=>{t.add(a),r.fanout++});else{const a=this.getRandomGossipPeers(
e,this.opts.D,c=>this.score.score(c)>=this.opts.scoreThresholds.publishThreshold);a.size>0&&(this.fanout.set(e,a),a.forEach(
c=>{t.add(c),r.fanout++}))}this.fanoutLastpub.set(e,Date.now())}}return{tosend:t,tosendCount:r}}forwardMessage(e,t,r,s){
r!=null&&this.score.deliverMessage(r,e,t.topic);const i=this.selectPeersToForward(t.topic,r,s);i.forEach(o=>{this.sendRpc(
o,Lt([t]))}),this.metrics?.onForwardMsg(t.topic,i.size)}async publish(e,t,r){const s=Date.now(),i=this.dataTransform!=null?
this.dataTransform.outboundTransform(e,t):t;if(this.publishConfig==null)throw Error("PublishError.Uninitialized");const{
raw:o,msg:a}=await $U(this.publishConfig,e,t,i),c=await this.msgIdFn(a),l=this.msgIdToStrFn(c),u=r?.ignoreDuplicatePublishError??
this.opts.ignoreDuplicatePublishError;if(this.seenCache.has(l)){if(u)return this.metrics?.onPublishDuplicateMsg(e),{recipients:[]};
throw Error("PublishError.Duplicate")}const{tosend:h,tosendCount:d}=this.selectPeersToPublish(e),p=this.opts.emitSelf&&this.
subscriptions.has(e),v=r?.allowPublishToZeroTopicPeers??this.opts.allowPublishToZeroTopicPeers;if(h.size===0&&!v&&!p)throw Error(
"PublishError.NoPeersSubscribedToTopic");this.seenCache.put(l),this.mcache.put({msgId:c,msgIdStr:l},o,!0),this.gossipTracer.
deliverMessage(l),this.publishedMessageIds.put(l);const g=r?.batchPublish??this.opts.batchPublish,E=Lt([o]);if(g)this.sendRpcInBatch(
h,E);else for(const b of h)this.sendRpc(b,E)||h.delete(b);const f=Date.now()-s;return this.metrics?.onPublishMsg(e,d,h.size,
o.data!=null?o.data.length:0,f),p&&(h.add(this.components.peerId.toString()),super.dispatchEvent(new CustomEvent("gossip\
sub:message",{detail:{propagationSource:this.components.peerId,msgId:l,msg:a}})),super.dispatchEvent(new CustomEvent("me\
ssage",{detail:a}))),{recipients:Array.from(h.values()).map(b=>this.peers.get(b)??te(b))}}sendRpcInBatch(e,t){const r=yr.
encode(t),s=Dd.single(r);for(const i of e){const o=this.streamsOutbound.get(i);if(o==null){this.log(`Cannot send RPC to ${i}\
 as there is no open stream to it available`),e.delete(i);continue}try{o.pushPrefixed(s)}catch(a){e.delete(i),this.log.error(
`Cannot send rpc to ${i}`,a)}this.metrics?.onRpcSent(t,r.length)}}reportMessageValidationResult(e,t,r){let s;if(r===mt.Accept){
if(s=this.mcache.validate(e),s!=null){const{message:o,originatingPeers:a}=s;this.score.deliverMessage(t,e,o.topic),this.
forwardMessage(e,s.message,t,a)}}else if(s=this.mcache.remove(e),s!=null){const o=qg(r),{message:a,originatingPeers:c}=s;
this.score.rejectMessage(t,e,a.topic,o);for(const l of c)this.score.rejectMessage(l,e,a.topic,o)}const i=this.score.messageFirstSeenTimestampMs(
e);this.metrics?.onReportValidation(s,r,i)}sendGraft(e,t){const s=Lt([],{graft:[{topicID:t}]});this.sendRpc(e,s)}async sendPrune(e,t){
const s=[await this.makePrune(e,t,this.opts.doPX,!0)],i=Lt([],{prune:s});this.sendRpc(e,i)}sendIDontWants(e,t,r){const s=this.
mesh.get(t);if(s==null)return;const i=new Set(s);i.delete(r);for(const a of i)this.streamsOutbound.get(a)?.protocol!==ql&&
i.delete(a);const o=Lt([],{idontwant:[{messageIDs:[e]}]});this.sendRpcInBatch(i,o)}sendRpc(e,t){const r=this.streamsOutbound.
get(e);if(r==null)return this.log(`Cannot send RPC to ${e} as there is no open stream to it available`),!1;const s=this.
control.get(e);s!=null&&(this.piggybackControl(e,t,s),this.control.delete(e));const i=this.gossip.get(e);i!=null&&(this.
piggybackGossip(e,t,i),this.gossip.delete(e));const o=yr.encode(t);try{r.push(o)}catch(a){return this.log.error(`Cannot \
send rpc to ${e}`,a),s!=null&&this.control.set(e,s),i!=null&&this.gossip.set(e,i),!1}if(this.metrics?.onRpcSent(t,o.length),
t.control?.graft!=null)for(const a of t.control?.graft)a.topicID!=null&&this.safeDispatchEvent("gossipsub:graft",{detail:{
peerId:e,topic:a.topicID,direction:"outbound"}});if(t.control?.prune!=null)for(const a of t.control?.prune)a.topicID!=null&&
this.safeDispatchEvent("gossipsub:prune",{detail:{peerId:e,topic:a.topicID,direction:"outbound"}});return!0}piggybackControl(e,t,r){
const s=Gg(t);for(const i of r.graft)i.topicID!=null&&(this.mesh.get(i.topicID)?.has(e)??!1)&&s.control.graft.push(i);for(const i of r.
prune)i.topicID!=null&&!(this.mesh.get(i.topicID)?.has(e)??!1)&&s.control.prune.push(i)}piggybackGossip(e,t,r){const s=Gg(
t);s.control.ihave=r}async sendGraftPrune(e,t,r){const s=this.opts.doPX,i=!1;for(const[o,a]of e){const c=a.map(h=>({topicID:h}));
let l=[];const u=t.get(o);u!=null&&(l=await Promise.all(u.map(async h=>this.makePrune(o,h,s&&!(r.get(o)??!1),i))),t.delete(
o)),this.sendRpc(o,Lt([],{graft:c,prune:l}))}for(const[o,a]of t){const c=await Promise.all(a.map(async l=>this.makePrune(
o,l,s&&!(r.get(o)??!1),i)));this.sendRpc(o,Lt([],{prune:c}))}}emitGossip(e){const t=this.mcache.getGossipIDs(new Set(e.keys()));
for(const[r,s]of e)this.doEmitGossip(r,s,t.get(r)??[])}doEmitGossip(e,t,r){if(r.length===0||(Bt(r),r.length>Xr&&this.log(
"too many messages for gossip; will truncate IHAVE list (%d messages)",r.length),t.size===0))return;let s=this.opts.Dlazy;
const o=this.opts.gossipFactor*t.size;let a=t;o>s&&(s=o),s>a.size?s=a.size:a=Bt(Array.from(a)).slice(0,s),a.forEach(c=>{
let l=r;r.length>Xr&&(l=Bt(l.slice()).slice(0,Xr)),this.pushGossip(c,{topicID:e,messageIDs:l})})}flush(){for(const[e,t]of this.
gossip.entries())this.gossip.delete(e),this.sendRpc(e,Lt([],{ihave:t}));for(const[e,t]of this.control.entries()){this.control.
delete(e);const r=Lt([],{graft:t.graft,prune:t.prune});this.sendRpc(e,r)}}pushGossip(e,t){this.log("Add gossip to %s",e);
const r=this.gossip.get(e)??[];this.gossip.set(e,r.concat(t))}async makePrune(e,t,r,s){if(this.score.prune(e,t),this.streamsOutbound.
get(e)?.protocol===Og)return{topicID:t,peers:[]};const i=s?this.opts.unsubcribeBackoff:this.opts.pruneBackoff,o=i/1e3;if(this.
doAddBackoff(e,t,i),!r)return{topicID:t,peers:[],backoff:o};const a=this.getRandomGossipPeers(t,this.opts.prunePeers,l=>l!==
e&&this.score.score(l)>=0),c=await Promise.all(Array.from(a).map(async l=>{const u=this.peers.get(l)??te(l);let h;try{h=
await this.components.peerStore.get(u)}catch(d){if(d.name!=="NotFoundError")throw d}return{peerID:u.toMultihash().bytes,
signedPeerRecord:h?.peerRecordEnvelope}}));return{topicID:t,peers:c,backoff:o}}runHeartbeat=()=>{const e=this.metrics?.heartbeatDuration.
startTimer();this.heartbeat().catch(t=>{this.log("Error running heartbeat",t)}).finally(()=>{if(e?.(),this.status.code===
it.started){clearTimeout(this.status.heartbeatTimeout);let t=this.opts.heartbeatInterval-(Date.now()-this.status.hearbeatStartMs)%
this.opts.heartbeatInterval;t<this.opts.heartbeatInterval*.25&&(t+=this.opts.heartbeatInterval,this.metrics?.heartbeatSkipped.
inc()),this.status.heartbeatTimeout=setTimeout(this.runHeartbeat,t)}})};async heartbeat(){const{D:e,Dlo:t,Dhi:r,Dscore:s,
Dout:i,fanoutTTL:o}=this.opts;this.heartbeatTicks++;const a=new Map,c=v=>{let g=a.get(v);return g===void 0&&(g=this.score.
score(v),a.set(v,g)),g},l=new Map,u=new Map,h=new Map;this.clearBackoff(),this.peerhave.clear(),this.metrics?.cacheSize.
set({cache:"iasked"},this.iasked.size),this.iasked.clear(),this.applyIwantPenalties(),this.idontwantCounts.clear();for(const v of this.
idontwants.values())for(const[g,E]of v)this.heartbeatTicks-E>=this.opts.mcacheLength&&v.delete(g);this.heartbeatTicks%this.
opts.directConnectTicks===0&&await this.directConnect(),this.fastMsgIdCache?.prune(),this.seenCache.prune(),this.gossipTracer.
prune(),this.publishedMessageIds.prune();const d=new Map;this.mesh.forEach((v,g)=>{const E=this.topics.get(g),f=new Set,
b=new Set;if(d.set(g,b),E!=null){const y=Bt(Array.from(E)),A=this.backoff.get(g);for(const w of y){const S=this.streamsOutbound.
get(w);if(S!=null&&this.protocols.includes(S.protocol)&&!v.has(w)&&!this.direct.has(w)){const x=c(w);A?.has(w)!==!0&&x>=
0&&f.add(w),x>=this.opts.scoreThresholds.gossipThreshold&&b.add(w)}}}const _=(y,A)=>{this.log("HEARTBEAT: Remove mesh li\
nk to %s in %s",y,g),this.addBackoff(y,g),v.delete(y),c(y)>=this.opts.scoreThresholds.gossipThreshold&&b.add(y),this.metrics?.
onRemoveFromMesh(g,A,1);const w=u.get(y);w==null?u.set(y,[g]):w.push(g)},m=(y,A)=>{this.log("HEARTBEAT: Add mesh link to\
 %s in %s",y,g),this.score.graft(y,g),v.add(y),b.delete(y),this.metrics?.onAddToMesh(g,A,1);const w=l.get(y);w==null?l.set(
y,[g]):w.push(g)};if(v.forEach(y=>{const A=c(y);A<0&&(this.log("HEARTBEAT: Prune peer %s with negative score: score=%d, \
topic=%s",y,A,g),_(y,Nt.BadScore),h.set(y,!0))}),v.size<t){const y=e-v.size;wU(f,y).forEach(w=>{m(w,rt.NotEnough)})}if(v.
size>r){let y=Array.from(v);y.sort((w,S)=>c(S)-c(w)),y=y.slice(0,s).concat(Bt(y.slice(s)));let A=0;if(y.slice(0,e).forEach(
w=>{(this.outbound.get(w)??!1)&&A++}),A<i){const w=x=>{const C=y[x];for(let I=x;I>0;I--)y[I]=y[I-1];y[0]=C};if(A>0){let x=A;
for(let C=1;C<e&&x>0;C++)(this.outbound.get(y[C])??!1)&&(w(C),x--)}let S=e-A;for(let x=e;x<y.length&&S>0;x++)(this.outbound.
get(y[x])??!1)&&(w(x),S--)}y.slice(e).forEach(w=>{_(w,Nt.Excess)})}if(v.size>=t){let y=0;if(v.forEach(A=>{(this.outbound.
get(A)??!1)&&y++}),y<i){const A=i-y;yh(f,A,S=>this.outbound.get(S)===!0).forEach(S=>{m(S,rt.Outbound)})}}if(this.heartbeatTicks%
this.opts.opportunisticGraftTicks===0&&v.size>1){const y=Array.from(v).sort((S,x)=>c(S)-c(x)),A=Math.floor(v.size/2),w=c(
y[A]);if(w<this.opts.scoreThresholds.opportunisticGraftThreshold){const S=this.opts.opportunisticGraftPeers,x=yh(f,S,C=>c(
C)>w);for(const C of x)this.log("HEARTBEAT: Opportunistically graft peer %s on topic %s",C,g),m(C,rt.Opportunistic)}}});
const p=Date.now();this.fanoutLastpub.forEach((v,g)=>{v+o<p&&(this.fanout.delete(g),this.fanoutLastpub.delete(g))}),this.
fanout.forEach((v,g)=>{const E=this.topics.get(g);v.forEach(m=>{(!(E?.has(m)??!1)||c(m)<this.opts.scoreThresholds.publishThreshold)&&
v.delete(m)});const f=this.topics.get(g),b=[],_=new Set;if(d.set(g,_),f!=null){const m=Bt(Array.from(f));for(const y of m){
const A=this.streamsOutbound.get(y);if(A!=null&&this.protocols.includes(A.protocol)&&!v.has(y)&&!this.direct.has(y)){const w=c(
y);w>=this.opts.scoreThresholds.publishThreshold&&b.push(y),w>=this.opts.scoreThresholds.gossipThreshold&&_.add(y)}}}if(v.
size<e){const m=e-v.size;b.slice(0,m).forEach(y=>{v.add(y),_?.delete(y)})}}),this.emitGossip(d),await this.sendGraftPrune(
l,u,h),this.flush(),this.mcache.shift(),this.dispatchEvent(new CustomEvent("gossipsub:heartbeat"))}getRandomGossipPeers(e,t,r=()=>!0){
const s=this.topics.get(e);if(s==null)return new Set;let i=[];return s.forEach(o=>{const a=this.streamsOutbound.get(o);a!=
null&&this.protocols.includes(a.protocol)&&r(o)&&i.push(o)}),i=Bt(i),t>0&&i.length>t&&(i=i.slice(0,t)),new Set(i)}onScrapeMetrics(e){
e.mcacheSize.set(this.mcache.size),e.mcacheNotValidatedCount.set(this.mcache.notValidatedCount),e.cacheSize.set({cache:"\
direct"},this.direct.size),e.cacheSize.set({cache:"seenCache"},this.seenCache.size),e.cacheSize.set({cache:"fastMsgIdCac\
he"},this.fastMsgIdCache?.size??0),e.cacheSize.set({cache:"publishedMessageIds"},this.publishedMessageIds.size),e.cacheSize.
set({cache:"mcache"},this.mcache.size),e.cacheSize.set({cache:"score"},this.score.size),e.cacheSize.set({cache:"gossipTr\
acer.promises"},this.gossipTracer.size),e.cacheSize.set({cache:"gossipTracer.requests"},this.gossipTracer.requestMsByMsgSize),
e.cacheSize.set({cache:"topics"},this.topics.size),e.cacheSize.set({cache:"subscriptions"},this.subscriptions.size),e.cacheSize.
set({cache:"mesh"},this.mesh.size),e.cacheSize.set({cache:"fanout"},this.fanout.size),e.cacheSize.set({cache:"peers"},this.
peers.size),e.cacheSize.set({cache:"streamsOutbound"},this.streamsOutbound.size),e.cacheSize.set({cache:"streamsInbound"},
this.streamsInbound.size),e.cacheSize.set({cache:"acceptFromWhitelist"},this.acceptFromWhitelist.size),e.cacheSize.set({
cache:"gossip"},this.gossip.size),e.cacheSize.set({cache:"control"},this.control.size),e.cacheSize.set({cache:"peerhave"},
this.peerhave.size),e.cacheSize.set({cache:"outbound"},this.outbound.size);let t=0;const r=Date.now();e.connectedPeersBackoffSec.
reset();for(const c of this.backoff.values()){t+=c.size;for(const[l,u]of c.entries())this.peers.has(l)&&e.connectedPeersBackoffSec.
observe(Math.max(0,u-r)/1e3)}e.cacheSize.set({cache:"backoff"},t);let s=0;for(const c of this.idontwants.values())s+=c.size;
e.cacheSize.set({cache:"idontwants"},s);for(const[c,l]of this.topics)e.topicPeersCount.set({topicStr:c},l.size);for(const[
c,l]of this.mesh)e.meshPeerCounts.set({topicStr:c},l.size);const i=[],o=new Map;e.behaviourPenalty.reset();for(const c of this.
peers.keys()){const l=this.score.score(c);i.push(l),o.set(c,l),e.behaviourPenalty.observe(this.score.peerStats.get(c)?.behaviourPenalty??
0)}e.registerScores(i,this.opts.scoreThresholds),e.registerScorePerMesh(this.mesh,o);const a=MU(this.peers.keys(),this.score.
peerStats,this.score.params,this.score.peerIPs,e.topicStrToLabel);e.registerScoreWeights(a)}tagMeshPeer=e=>{const{peerId:t,
topic:r}=e.detail;this.components.peerStore.merge(this.peers.get(t)??te(t),{tags:{[r]:{value:100}}}).catch(s=>{this.log.
error("Error tagging peer %s with topic %s",t,r,s)})};untagMeshPeer=e=>{const{peerId:t,topic:r}=e.detail;this.components.
peerStore.merge(this.peers.get(t)??te(t),{tags:{[r]:void 0}}).catch(s=>{this.log.error("Error untagging peer %s with top\
ic %s",t,r,s)})}}const ac="StrictSign",kd="StrictNoSign";var mt;(function(n){n.Accept="accept",n.Ignore="ignore",n.Reject=
"reject"})(mt||(mt={}));function zU(n={}){return e=>new BU(e,n)}function VU(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)
return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function xs(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Wi(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Wi(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function qU(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Hg=4096;function WU(n){const e=n.
length;if(e<=Hg)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=Hg));return t}function KU(n){return n?.buffer instanceof ArrayBuffer}function Wi(n){return KU(n)?n:n.slice()}
function GU(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function v(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,_=0,m=0,y=f.length;m!==y&&f[m]===
0;)m++,b++;for(var A=(y-m)*p+1>>>0,w=new Uint8Array(A);m!==y;){for(var S=f[m],x=0,C=A-1;(S!==0||x<_)&&C!==-1;C--,x++)S+=
256*w[C]>>>0,w[C]=S%u>>>0,S=S/u>>>0;if(S!==0)throw new Error("Non-zero carry");_=x,m++}for(var I=A-_;I!==A&&w[I]===0;)I++;
for(var M=h.repeat(b);I<A;++I)M+=n.charAt(w[I]);return M}function g(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var _=0,m=0;f[b]===h;)_++,b++;for(var y=(f.
length-b)*d+1>>>0,A=new Uint8Array(y);f[b];){var w=r[f.charCodeAt(b)];if(w===255)return;for(var S=0,x=y-1;(w!==0||S<m)&&
x!==-1;x--,S++)w+=u*A[x]>>>0,A[x]=w%256>>>0,w=w/256>>>0;if(w!==0)throw new Error("Non-zero carry");m=S,b++}if(f[b]!==" "){
for(var C=y-m;C!==y&&A[C]===0;)C++;for(var I=new Uint8Array(_+(y-C)),M=_;C!==y;)I[M++]=A[C++];return I}}}function E(f){var b=g(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:v,decodeUnsafe:g,decode:E}}var HU=GU,jU=HU;class XU{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class QU{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return uv(this,e)}}class YU{decoders;constructor(e){
this.decoders=e}or(e){return uv(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=null)return r.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function uv(n,e){return new YU({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class JU{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){
this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=s,this.encoder=new XU(e,t,r),this.decoder=new QU(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Wc({name:n,prefix:e,encode:t,decode:r}){
return new JU(n,e,t,r)}function uo({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=jU(t,n,r);
return Wc({prefix:e,name:n,encode:s,decode:o=>xs(i(o))})}function ZU(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function eO(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function tO(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function _e({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=tO(r,s);return Wc(
{prefix:e,name:n,encode(o){return eO(o,r,t)},decode(o){return ZU(o,i,t,n)}})}const nO=uo({prefix:"9",name:"base10",alphabet:"\
0123456789"}),rO=Object.freeze(Object.defineProperty({__proto__:null,base10:nO},Symbol.toStringTag,{value:"Module"})),sO=_e(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),iO=_e({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),oO=Object.freeze(Object.defineProperty({__proto__:null,
base16:sO,base16upper:iO},Symbol.toStringTag,{value:"Module"})),aO=_e({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
cO=Object.freeze(Object.defineProperty({__proto__:null,base2:aO},Symbol.toStringTag,{value:"Module"})),hv=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),lO=hv.reduce((n,e,t)=>(n[t]=e,n),[]),uO=hv.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function hO(n){return n.reduce((e,t)=>(e+=lO[t],e),"")}function dO(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=uO[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const fO=Wc({prefix:"🚀",name:"\
base256emoji",encode:hO,decode:dO}),pO=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:fO},Symbol.toStringTag,
{value:"Module"})),wi=_e({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
gO=_e({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),mO=_e(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),bO=_e({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),yO=_e({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),wO=_e({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),vO=_e({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),SO=_e({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),AO=_e({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),_O=Object.freeze(Object.defineProperty({__proto__:null,
base32:wi,base32hex:yO,base32hexpad:vO,base32hexpadupper:SO,base32hexupper:wO,base32pad:mO,base32padupper:bO,base32upper:gO,
base32z:AO},Symbol.toStringTag,{value:"Module"})),ba=uo({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),EO=uo({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
CO=Object.freeze(Object.defineProperty({__proto__:null,base36:ba,base36upper:EO},Symbol.toStringTag,{value:"Module"})),dt=uo(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),xO=uo({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),IO=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:dt,base58flickr:xO},Symbol.toStringTag,{value:"Module"})),MO=_e({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),PO=_e({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),TO=_e({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),DO=_e({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),$O=Object.freeze(Object.defineProperty(
{__proto__:null,base64:MO,base64pad:PO,base64url:TO,base64urlpad:DO},Symbol.toStringTag,{value:"Module"})),kO=_e({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),LO=Object.freeze(Object.defineProperty({__proto__:null,base8:kO},Symbol.
toStringTag,{value:"Module"})),RO=Wc({prefix:"\0",name:"identity",encode:n=>WU(xs(n)),decode:n=>xs(qU(n))}),NO=Object.freeze(
Object.defineProperty({__proto__:null,identity:RO},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var FO=dv,jg=128,UO=-128,OO=Math.pow(2,31);function dv(n,e,t){e=e||[],t=t||0;for(var r=t;n>=OO;)e[t++]=n&255|jg,n/=128;for(;n&
UO;)e[t++]=n&255|jg,n>>>=7;return e[t]=n|0,dv.bytes=t-r+1,e}var BO=wh,zO=128,Xg=127;function wh(n,r){var t=0,r=r||0,s=0,
i=r,o,a=n.length;do{if(i>=a)throw wh.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<28?(o&Xg)<<s:(o&Xg)*
Math.pow(2,s),s+=7}while(o>=zO);return wh.bytes=i-r,t}var VO=Math.pow(2,7),qO=Math.pow(2,14),WO=Math.pow(2,21),KO=Math.pow(
2,28),GO=Math.pow(2,35),HO=Math.pow(2,42),jO=Math.pow(2,49),XO=Math.pow(2,56),QO=Math.pow(2,63),YO=function(n){return n<
VO?1:n<qO?2:n<WO?3:n<KO?4:n<GO?5:n<HO?6:n<jO?7:n<XO?8:n<QO?9:10},JO={encode:FO,decode:BO,encodingLength:YO},cc=JO;function vh(n,e=0){
const t=cc.decode(n,e),r=cc.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>1&&n[e+r-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[t,r]}function lc(n,e,t=0){return cc.encode(n,e,t),e}function uc(n){return cc.
encodingLength(n)}function Kc(n,e){const t=e.byteLength,r=uc(n),s=r+uc(t),i=new Uint8Array(s+t);return lc(n,i,0),lc(t,i,
r),i.set(e,s),new Ld(n,t,e,i)}function ZO(n){const e=xs(n),[t,r]=vh(e),[s,i]=vh(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new Ld(t,s,o,e)}function eB(n,e){if(n===e)return!0;{const t=e;return n.code===
t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&VU(n.bytes,t.bytes)}}class Ld{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Wi(r),this.bytes=Wi(s)}}const fv=0,tB="identity",pv=xs;function nB(n,e){if(e?.truncate!=
null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid truncate option, must\
 be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Kc(fv,pv(n))}const Rd={code:fv,name:tB,encode:pv,
digest:nB},rB=20;function sB({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new iB(n,e,t,r,s)}class iB{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??rB,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
Qg(r,this.code,t?.truncate):r.then(s=>Qg(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}
function Qg(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return Kc(e,n)}function oB(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const aB=sB({name:"sha2-256",code:18,encode:oB("SHA-256")});function Yg(n,e){const{bytes:t,version:r}=n;
switch(r){case 0:return lB(t,Sh(n),e??dt.encoder);default:return uB(t,Sh(n),e??wi.encoder)}}const Jg=new WeakMap;function Sh(n){
const e=Jg.get(n);if(e==null){const t=new Map;return Jg.set(n,t),t}return e}class le{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Wi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==Vs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==hB)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return le.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=Kc(e,t);return le.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return le.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&eB(e.multihash,r.multihash)}toString(e){return Yg(this,e)}toJSON(){return{
"/":Yg(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof le)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new le(r,s,i,o??Zg(r,s,i.bytes))}else if(t[dB]===!0){const{
version:r,multihash:s,code:i}=t,o=ZO(s);return le.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==Vs)throw new Error(`Version 0 CID must use dag-pb (code: ${Vs}) block encoding`);return new le(
e,t,r,r.bytes)}case 1:{const s=Zg(e,t,r.bytes);return new le(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return le.create(0,Vs,e)}static createV1(e,t){return le.create(1,e,t)}static decode(e){const[t,r]=le.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=le.inspectBytes(e),r=t.size-t.multihashSize,
s=xs(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Ld(t.multihashCode,t.digestSize,i,s);return[t.version===0?le.createV0(o):le.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,d]=vh(e.subarray(t));return t+=d,h};let s=r(),
i=Vs;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=cB(e,t),
i=le.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Sh(
i).set(r,e),i}}function cB(n,e){switch(n[0]){case"Q":{const t=e??dt;return[dt.prefix,t.decode(`${dt.prefix}${n}`)]}case dt.
prefix:{const t=e??dt;return[dt.prefix,t.decode(n)]}case wi.prefix:{const t=e??wi;return[wi.prefix,t.decode(n)]}case ba.
prefix:{const t=e??ba;return[ba.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function lB(n,e,t){const{prefix:r}=t;if(r!==
dt.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function uB(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Vs=112,hB=18;function Zg(n,e,t){const r=uc(n),s=r+uc(e),i=new Uint8Array(s+t.
byteLength);return lc(n,i,0),lc(e,i,r),i.set(t,s),i}const dB=Symbol.for("@ipld/js-cid/CID"),em={...NO,...cO,...LO,...rO,
...oO,..._O,...CO,...IO,...$O,...pO};function gn(n=0){return new Uint8Array(n)}function Mr(n=0){return new Uint8Array(n)}
function gv(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const tm=gv("utf8","u",
n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Gl=gv("ascii","a",n=>{let e="a";for(let t=0;t<
n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Mr(n.length);for(let t=0;t<n.length;t++)
e[t]=n.charCodeAt(t);return e}),mv={utf8:tm,"utf-8":tm,hex:em.base16,latin1:Gl,ascii:Gl,binary:Gl,...em};function rn(n,e="\
utf8"){const t=mv[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}
function An(n,e="utf8"){const t=mv[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(
n).substring(1)}const fB="0.1.0",pB="id",gB="1.0.0",mB=1024*8,nm=10,bB=Math.pow(2,7),yB=Math.pow(2,14),wB=Math.pow(2,21),
bv=Math.pow(2,28),yv=Math.pow(2,35),wv=Math.pow(2,42),vv=Math.pow(2,49),Ge=128,mn=127;function Nd(n){if(n<bB)return 1;if(n<
yB)return 2;if(n<wB)return 3;if(n<bv)return 4;if(n<yv)return 5;if(n<wv)return 6;if(n<vv)return 7;if(Number.MAX_SAFE_INTEGER!=
null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function vB(n,e,t=0){switch(Nd(
n)){case 8:e[t++]=n&255|Ge,n/=128;case 7:e[t++]=n&255|Ge,n/=128;case 6:e[t++]=n&255|Ge,n/=128;case 5:e[t++]=n&255|Ge,n/=
128;case 4:e[t++]=n&255|Ge,n>>>=7;case 3:e[t++]=n&255|Ge,n>>>=7;case 2:e[t++]=n&255|Ge,n>>>=7;case 1:{e[t++]=n&255,n>>>=
7;break}default:throw new Error("unreachable")}return e}function SB(n,e){let t=n[e],r=0;if(r+=t&mn,t<Ge||(t=n[e+1],r+=(t&
mn)<<7,t<Ge)||(t=n[e+2],r+=(t&mn)<<14,t<Ge)||(t=n[e+3],r+=(t&mn)<<21,t<Ge)||(t=n[e+4],r+=(t&mn)*bv,t<Ge)||(t=n[e+5],r+=(t&
mn)*yv,t<Ge)||(t=n[e+6],r+=(t&mn)*wv,t<Ge)||(t=n[e+7],r+=(t&mn)*vv,t<Ge))return r;throw new RangeError("Could not decode\
 varint")}function AB(n){return n.buffer instanceof ArrayBuffer}function Pr(n){return AB(n)?n:n.slice()}const Fd=new Float32Array(
[-0]),Dn=new Uint8Array(Fd.buffer);function _B(n,e,t){Fd[0]=n,e[t]=Dn[0],e[t+1]=Dn[1],e[t+2]=Dn[2],e[t+3]=Dn[3]}function EB(n,e){
return Dn[0]=n[e],Dn[1]=n[e+1],Dn[2]=n[e+2],Dn[3]=n[e+3],Fd[0]}const Ud=new Float64Array([-0]),ke=new Uint8Array(Ud.buffer);
function CB(n,e,t){Ud[0]=n,e[t]=ke[0],e[t+1]=ke[1],e[t+2]=ke[2],e[t+3]=ke[3],e[t+4]=ke[4],e[t+5]=ke[5],e[t+6]=ke[6],e[t+
7]=ke[7]}function xB(n,e){return ke[0]=n[e],ke[1]=n[e+1],ke[2]=n[e+2],ke[3]=n[e+3],ke[4]=n[e+4],ke[5]=n[e+5],ke[6]=n[e+6],
ke[7]=n[e+7],Ud[0]}const IB=BigInt(Number.MAX_SAFE_INTEGER),MB=BigInt(Number.MIN_SAFE_INTEGER);class Le{lo;hi;constructor(e,t){
this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=
r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:r<128?9:10}static fromBigInt(e){if(e===0n)return wr;if(e<IB&&e>MB)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>rm&&(s=0n,++r>rm&&(r=0n))),new Le(Number(s),Number(r))}static fromNumber(e){
if(e===0)return wr;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&
(r=0,++s>4294967295&&(s=0))),new Le(r,s)}static from(e){return typeof e=="number"?Le.fromNumber(e):typeof e=="bigint"?Le.
fromBigInt(e):typeof e=="string"?Le.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Le(e.low>>>0,e.high>>>0):wr}}const wr=new Le(
0,0);wr.toBigInt=function(){return 0n};wr.zzEncode=wr.zzDecode=function(){return this};wr.length=function(){return 1};const rm=4294967296n;
function PB(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function TB(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Sv(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function Ct(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function zo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class DB{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Pr(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Ct(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Ct(this,4);return zo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Ct(
this,4);return zo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Ct(this,4);const e=EB(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Ct(this,4);const e=xB(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw Ct(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return TB(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Ct(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Ct(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Le(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Ct(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Ct(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Ct(this,8);const e=zo(this.buf,this.pos+=4),t=zo(this.buf,this.pos+=4);return new Le(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=SB(this.buf,this.pos);
return this.pos+=Nd(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Av(n){return new DB(n instanceof Uint8Array?n:
n.subarray())}function Od(n,e,t){const r=Av(n);return e.decode(r,void 0,t)}function $B(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Mr(o);s+o>8192&&(r=Mr(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Zs{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}}function Hl(){}class kB{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const LB=$B();function RB(n){return globalThis.Buffer!=null?Mr(
n):LB(n)}class Ah{len;head;tail;states;constructor(){this.len=0,this.head=new Zs(Hl,0,0),this.tail=this.head,this.states=
null}_push(e,t,r){return this.tail=this.tail.next=new Zs(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new FB((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Vo,10,
Le.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Le.fromBigInt(e);return this.
_push(Vo,t.length(),t)}uint64Number(e){return this._push(vB,Nd(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Le.
fromBigInt(e).zzEncode();return this._push(Vo,t.length(),t)}sint64Number(e){const t=Le.fromNumber(e).zzEncode();return this.
_push(Vo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(jl,1,e?1:0)}fixed32(e){return this.
_push(qs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Le.fromBigInt(e);return this._push(qs,4,t.lo)._push(
qs,4,t.hi)}fixed64Number(e){const t=Le.fromNumber(e);return this._push(qs,4,t.lo)._push(qs,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(_B,4,e)}double(e){return this._push(CB,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(jl,1,0):this.uint32(t)._push(UB,t,e)}string(e){const t=PB(e);return t!==0?this.uint32(t)._push(Sv,t,e):this.
_push(jl,1,0)}fork(){return this.states=new kB(this),this.head=this.tail=new Zs(Hl,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Zs(Hl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.reset().
uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=RB(this.len);
let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}}function jl(n,e,t){e[t]=n&255}function NB(n,e,t){for(;n>
127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class FB extends Zs{next;constructor(e,t){super(NB,e,t),this.next=void 0}}function Vo(n,e,t){
for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>
7;e[t++]=n.lo}function qs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function UB(n,e,t){e.set(n,
t)}globalThis.Buffer!=null&&(Ah.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(OB,
e,n),this},Ah.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(
BB,e,n),this});function OB(n,e,t){e.set(n,t)}function BB(n,e,t){n.length<40?Sv(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):
e.set(rn(n),t)}function zB(){return new Ah}function Bd(n,e){const t=zB();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}
function*zd(n,e,t){const r=Av(n);yield*e.stream(r,void 0,".",t)}const _v={VARINT:0,LENGTH_DELIMITED:2};function Ev(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function VB(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Ev("enum",_v.VARINT,t,r,s)}function Vd(n,e,t){return Ev("message",_v.LENGTH_DELIMITED,n,e,
t)}class qo extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var hc;(function(n){let e;n.codec=()=>(e==null&&(e=
Vd((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.protocolVersion!=null&&(o.uint32(42),o.string(i.protocolVersion)),
i.agentVersion!=null&&(o.uint32(50),o.string(i.agentVersion)),i.publicKey!=null&&(o.uint32(10),o.bytes(i.publicKey)),i.listenAddrs!=
null&&i.listenAddrs.length>0)for(const c of i.listenAddrs)o.uint32(18),o.bytes(c);if(i.observedAddr!=null&&(o.uint32(34),
o.bytes(i.observedAddr)),i.protocols!=null&&i.protocols.length>0)for(const c of i.protocols)o.uint32(26),o.string(c);i.signedPeerRecord!=
null&&(o.uint32(66),o.bytes(i.signedPeerRecord)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={listenAddrs:[],
protocols:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 5:{c.protocolVersion=i.string();
break}case 6:{c.agentVersion=i.string();break}case 1:{c.publicKey=i.bytes();break}case 2:{if(a.limits?.listenAddrs!=null&&
c.listenAddrs.length===a.limits.listenAddrs)throw new qo('Decode error - repeated field "listenAddrs" had too many eleme\
nts');c.listenAddrs.push(i.bytes());break}case 4:{c.observedAddr=i.bytes();break}case 3:{if(a.limits?.protocols!=null&&c.
protocols.length===a.limits.protocols)throw new qo('Decode error - repeated field "protocols" had too many elements');c.
protocols.push(i.string());break}case 8:{c.signedPeerRecord=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l={listenAddrs:0,protocols:0},u=o==null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 5:{yield{
field:`${a}.protocolVersion`,value:i.string()};break}case 6:{yield{field:`${a}.agentVersion`,value:i.string()};break}case 1:{
yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{if(c.limits?.listenAddrs!=null&&l.listenAddrs===c.limits.listenAddrs)
throw new qo('Streaming decode error - repeated field "listenAddrs" had too many elements');yield{field:`${a}.listenAddr\
s[]`,index:l.listenAddrs,value:i.bytes()},l.listenAddrs++;break}case 4:{yield{field:`${a}.observedAddr`,value:i.bytes()};
break}case 3:{if(c.limits?.protocols!=null&&l.protocols===c.limits.protocols)throw new qo('Streaming decode error - repe\
ated field "protocols" had too many elements');yield{field:`${a}.protocols[]`,index:l.protocols,value:i.string()},l.protocols++;
break}case 8:{yield{field:`${a}.signedPeerRecord`,value:i.bytes()};break}default:{i.skipType(h&7);break}}}})),e);function t(i){
return Bd(i,n.codec())}n.encode=t;function r(i,o){return Od(i,n.codec(),o)}n.decode=r;function s(i,o){return zd(i,n.codec(),
o)}n.stream=s})(hc||(hc={}));function ho(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.
byteLength;t++)if(n[t]!==e[t])return!1;return!0}async function qB(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,
{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["verify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({
name:"ECDSA",hash:{name:"SHA-256"}},s,Pr(e),Pr(t.subarray()));return r?.signal?.throwIfAborted(),i}function WB(n){return n?.
buffer instanceof ArrayBuffer}function KB(n){if(WB(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}
function sm(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=Mr(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;
return KB(t)}const Cv=Symbol.for("@achingbrain/uint8arraylist");function im(n,e){if(e==null||e<0)throw new RangeError("i\
ndex is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError(
"index is out of bounds")}function Wo(n){return!!n?.[Cv]}let sn=class ya{bufs;length;[Cv]=!0;constructor(...e){this.bufs=
[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(Wo(
r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Wo(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=im(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=im(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Wo(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return sm(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:sm(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new ya;return i.
length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(
o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Wo(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=Mr(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=gn(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=gn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=gn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=Mr(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=gn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=gn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=gn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=gn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=gn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ya)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!ho(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new ya;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const GB=parseInt("11111",2),_h=parseInt("10000000",
2),HB=parseInt("01111111",2),om={0:Ws,1:Ws,2:jB,3:YB,4:JB,5:QB,6:XB,16:Ws,22:Ws,48:Ws};function Gc(n,e={offset:0}){const t=n[e.
offset]&GB;if(e.offset++,om[t]!=null)return om[t](n,e);throw new Error("No decoder for tag "+t)}function fo(n,e){let t=0;
if((n[e.offset]&_h)===_h){const r=n[e.offset]&HB;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)
throw new Error("invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],
e.offset++;if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}
function Ws(n,e){fo(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=Gc(n,e);if(r===null)break;t.push(r)}return t}
function jB(n,e){const t=fo(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.
offset+=t,Uint8Array.from(i)}function XB(n,e){const t=fo(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=
0,o=s):s<80?(i=1,o=s-40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(
l&127),l<128){c.reverse();let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function QB(n,e){return e.
offset++,null}function YB(n,e){const t=fo(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=
t,r!==0)throw new Error("Unused bits in bit string is unimplemented");return s}function JB(n,e){const t=fo(n,e),r=n.subarray(
e.offset,e.offset+t);return e.offset+=t,r}function ZB(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new sn;for(let r=0;r<
e.length;r+=2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function qd(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=ZB(n.byteLength);return new sn(Uint8Array.from([e.byteLength|_h]),e)}function Eh(n){const e=new sn,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new sn(Uint8Array.from([2]),qd(e),e)}function xv(n){
const e=Uint8Array.from([0]),t=new sn(e,n);return new sn(Uint8Array.from([3]),qd(t),t)}function vi(n,e=48){const t=new sn;
for(const r of n)t.append(r);return new sn(Uint8Array.from([e]),qd(t),t)}const ez=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),tz=Uint8Array.from([6,5,43,129,4,0,34]),nz=Uint8Array.from([6,5,43,129,4,0,35]),rz={ext:!0,kty:"EC",crv:"P-256"},
sz={ext:!0,kty:"EC",crv:"P-384"},iz={ext:!0,kty:"EC",crv:"P-521"},Xl=32,Ql=48,Yl=66;function oz(n){const e=Gc(n);return az(
e)}function az(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===Xl*2+1)return r=An(e.subarray(t,t+Xl),"base64url"),s=
An(e.subarray(t+Xl),"base64url"),new Jl({...rz,key_ops:["verify"],x:r,y:s});if(e.byteLength===Ql*2+1)return r=An(e.subarray(
t,t+Ql),"base64url"),s=An(e.subarray(t+Ql),"base64url"),new Jl({...sz,key_ops:["verify"],x:r,y:s});if(e.byteLength===Yl*
2+1)return r=An(e.subarray(t,t+Yl),"base64url"),s=An(e.subarray(t+Yl),"base64url"),new Jl({...iz,key_ops:["verify"],x:r,
y:s});throw new L(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function cz(n){return vi(
[Eh(Uint8Array.from([1])),vi([lz(n.crv)],160),vi([xv(new sn(Uint8Array.from([4]),rn(n.x??"","base64url"),rn(n.y??"","bas\
e64url")))],161)]).subarray()}function lz(n){if(n==="P-256")return ez;if(n==="P-384")return tz;if(n==="P-521")return nz;
throw new L(`Invalid curve ${n}`)}class Jl{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==null&&
(this._raw=cz(this.jwk)),this._raw}toMultihash(){return Rd.digest(Hc(this))}toCID(){return le.createV1(114,this.toMultihash())}toString(){
return dt.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ho(this.
raw,e.raw)}async verify(e,t,r){return qB(this.jwk,t,e,r)}}class am extends Error{constructor(e="An error occurred while \
verifying a message"){super(e),this.name="VerificationError"}}class uz extends Error{constructor(e="Missing Web Crypto A\
PI"){super(e),this.name="WebCryptoMissingError"}}const Ki={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new uz(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},Iv=32;let Zl;const hz=(async()=>{try{return await Ki.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function dz(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await Ki.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await Ki.get().subtle.verify(
{name:"Ed25519"},r,Pr(e),Pr(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function fz(n,e,t){return vr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function pz(n,e,t){
return Zl==null&&(Zl=await hz),Zl?dz(n,e,t):fz(n,e,t)}function Mv(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}class gz{type="Ed25519";raw;constructor(e){this.raw=Pv(e,Iv)}toMultihash(){
return Rd.digest(Hc(this))}toCID(){return le.createV1(114,this.toMultihash())}toString(){return dt.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ho(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=pz(this.raw,t,e);return Mv(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}}function mz(n){return n=
Pv(n,Iv),new gz(n)}function Pv(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new L(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}var Ue;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA=
"ECDSA"})(Ue||(Ue={}));var Ch;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=
3]="ECDSA"})(Ch||(Ch={}));(function(n){n.codec=()=>VB(Ch)})(Ue||(Ue={}));var Gi;(function(n){let e;n.codec=()=>(e==null&&
(e=Vd((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Ue.codec().encode(i.Type,o)),i.Data!=null&&
(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ue.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ue.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.
bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Bd(i,n.codec())}n.encode=t;function r(i,o){return Od(
i,n.codec(),o)}n.decode=r;function s(i,o){return zd(i,n.codec(),o)}n.stream=s})(Gi||(Gi={}));var cm;(function(n){let e;n.
codec=()=>(e==null&&(e=Vd((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Ue.codec().encode(i.Type,
o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ue.codec().decode(i);break}case 2:{c.Data=i.bytes();
break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.
uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ue.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,
value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Bd(i,n.codec())}n.encode=t;function r(i,o){
return Od(i,n.codec(),o)}n.decode=r;function s(i,o){return zd(i,n.codec(),o)}n.stream=s})(cm||(cm={}));class bz{type="RS\
A";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this._raw==null&&(this._raw=Az(this.
jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return le.createV1(114,this._multihash)}toString(){return dt.
encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ho(this.raw,e.
raw)}verify(e,t,r){return Cz(this.jwk,t,e,r)}}const yz=18,wz=1062,vz=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,1,
1,5,0]);function Sz(n){const e=Gc(n[1],{offset:0});return{kty:"RSA",n:An(e[0],"base64url"),e:An(e[1],"base64url")}}function Az(n){
if(n.n==null||n.e==null)throw new L("JWK was missing components");return vi([vz,xv(vi([Eh(rn(n.n,"base64url")),Eh(rn(n.e,
"base64url"))]))]).subarray()}function _z(n,e){if(n.byteLength>=wz)throw new Dt("Key size is too large");const t=Gc(n,{offset:0});
return Ez(t,n,e)}function Ez(n,e,t){const r=Sz(n);if(t==null){const s=or(Gi.encode({Type:Ue.RSA,Data:e}));t=Kc(yz,s)}return new bz(
r,t)}async function Cz(n,e,t,r){const s=await Ki.get().subtle.importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SH\
A-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await Ki.get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Pr(
e),Pr(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),i}function xz(n,e,t,r){const s=aB.digest(
t instanceof Uint8Array?t:t.subarray());if(Mv(s))return s.then(({digest:i})=>(r?.signal?.throwIfAborted(),Oe.verify(e,i,
n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new am(String(i))});try{return r?.signal?.throwIfAborted(),
Oe.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new am(String(i))}}class Iz{type="secp256k1";raw;_key;constructor(e){
this._key=Tz(e),this.raw=Pz(this._key)}toMultihash(){return Rd.digest(Hc(this))}toCID(){return le.createV1(114,this.toMultihash())}toString(){
return dt.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ho(this.
raw,e.raw)}verify(e,t,r){return xz(this._key,t,e,r)}}function Mz(n){return new Iz(n)}function Pz(n){return Oe.Point.fromBytes(
n).toBytes()}function Tz(n){try{return Oe.Point.fromBytes(n),n}catch(e){throw new Dt(String(e))}}function Tv(n,e){const{
Type:t,Data:r}=Gi.decode(n),s=r??new Uint8Array;switch(t){case Ue.RSA:return _z(s,e);case Ue.Ed25519:return mz(s);case Ue.
secp256k1:return Mz(s);case Ue.ECDSA:return oz(s);default:throw new pc}}function Hc(n){return Gi.encode({Type:Ue[n.type],
Data:n.raw})}const qt={protocolPrefix:"ipfs",timeout:5e3,maxInboundStreams:1,maxOutboundStreams:1,maxObservedAddresses:10,
maxMessageSize:mB,runOnConnectionOpen:!0,runOnLimitedConnection:!0};function Dv(n){return n.bytes.length===0}function $v(n){
if(n!=null&&n.length>0)try{const e=O(n);if(!Dv(e))return e}catch{}}async function Dz(n,e,t,r,s){if(t("received identify \
from %p",r.remotePeer),s==null)throw new Y("message was null or undefined");const i={},o=s.listenAddrs.map($v).filter(l=>l!=
null);if(s.listenAddrs.length>0&&(i.addresses=o.map(l=>({isCertified:!1,multiaddr:l}))),s.protocols.length>0&&(i.protocols=
s.protocols),s.publicKey!=null){const l=Tv(s.publicKey);if(!Ft(l).equals(r.remotePeer))throw new Y("public key did not m\
atch remote PeerId");i.publicKey=l}let a;if(s.signedPeerRecord!=null){t.trace("received signedPeerRecord from %p",r.remotePeer);
let l=s.signedPeerRecord;const u=await Qt.openAndCertify(l,bt.DOMAIN);let h=bt.createFromProtobuf(u.payload);const d=Ft(
u.publicKey);if(!h.peerId.equals(d))throw new Y("signing key does not match PeerId in the PeerRecord");if(!r.remotePeer.
equals(h.peerId))throw new Y("signing key does not match remote PeerId");let p;try{p=await n.get(h.peerId)}catch(g){if(g.
name!=="NotFoundError")throw g}if(p!=null&&(i.metadata=p.metadata,p.peerRecordEnvelope!=null)){const g=Qt.createFromProtobuf(
p.peerRecordEnvelope),E=bt.createFromProtobuf(g.payload);E.seqNumber>=h.seqNumber&&(t("sequence number was lower or equa\
l to existing sequence number - stored: %d received: %d",E.seqNumber,h.seqNumber),h=E,l=p.peerRecordEnvelope)}i.peerRecordEnvelope=
l;const v=h.multiaddrs.filter(g=>!Dv(g));i.addresses=v.map(g=>({isCertified:!0,multiaddr:g})),a={seq:h.seqNumber,addresses:v}}else
t("%p did not send a signed peer record",r.remotePeer);if(t.trace("patching %p with",r.remotePeer,i),await n.patch(r.remotePeer,
i),s.agentVersion!=null||s.protocolVersion!=null){const l={};s.agentVersion!=null&&(l.AgentVersion=rn(s.agentVersion)),s.
protocolVersion!=null&&(l.ProtocolVersion=rn(s.protocolVersion)),t.trace("merging %p metadata",r.remotePeer,l),await n.merge(
r.remotePeer,{metadata:l})}const c={peerId:r.remotePeer,protocolVersion:s.protocolVersion,agentVersion:s.agentVersion,publicKey:s.
publicKey,listenAddrs:o,observedAddr:s.observedAddr==null?void 0:O(s.observedAddr),protocols:s.protocols,signedPeerRecord:a,
connection:r};return e.safeDispatchEvent("peer:identify",{detail:c}),c}function $z(n){const e={...n[0]};for(const t of n.
slice(1))t.protocolVersion!=null&&(e.protocolVersion=t.protocolVersion),t.agentVersion!=null&&(e.agentVersion=t.agentVersion),
t.publicKey!=null&&(e.publicKey=t.publicKey),t.observedAddr!=null&&(e.observedAddr=t.observedAddr),t.signedPeerRecord!=null&&
(e.signedPeerRecord=t.signedPeerRecord),e.listenAddrs=[...e.listenAddrs,...t.listenAddrs],e.protocols=[...new Set([...e.
protocols,...t.protocols])];return e}async function kz(n,e,t,r){const s=Ut(n,{maxDataLength:e}).pb(hc),i=[];for(let o=0;o<
nm;o++)try{i.push(await s.read(t))}catch(a){if(i.length===0)throw a;r.trace("stopped reading identify - %e",a);break}i.length>=
nm&&r("reached MAX_IDENTIFY_MESSAGES, returning truncated identify");try{await n.close(t)}catch(o){r.trace("error closin\
g identify stream after read - %e",o),n.abort(o)}return i}class Lz{host;components;protocol;started;timeout;maxInboundStreams;maxOutboundStreams;maxMessageSize;maxObservedAddresses;runOnLimitedConnection;log;constructor(e,t){
this.protocol=t.protocol,this.started=!1,this.components=e,this.log=t.log,this.timeout=t.timeout??qt.timeout,this.maxInboundStreams=
t.maxInboundStreams??qt.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams??qt.maxOutboundStreams,this.maxMessageSize=
t.maxMessageSize??qt.maxMessageSize,this.maxObservedAddresses=t.maxObservedAddresses??qt.maxObservedAddresses,this.runOnLimitedConnection=
t.runOnLimitedConnection??qt.runOnLimitedConnection,this.host={protocolVersion:`${t.protocolPrefix??qt.protocolPrefix}/${fB}`,
agentVersion:e.nodeInfo.userAgent},this.handleProtocol=this.handleProtocol.bind(this)}isStarted(){return this.started}async start(){
this.started||(await this.components.peerStore.merge(this.components.peerId,{metadata:{AgentVersion:rn(this.host.agentVersion),
ProtocolVersion:rn(this.host.protocolVersion)}}),await this.components.registrar.handle(this.protocol,this.handleProtocol,
{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams,runOnLimitedConnection:this.runOnLimitedConnection}),
this.started=!0)}async stop(){await this.components.registrar.unhandle(this.protocol),this.started=!1}}class Rz extends Lz{constructor(e,t={}){
super(e,{...t,protocol:`/${t.protocolPrefix??qt.protocolPrefix}/${pB}/${gB}`,log:e.logger.forComponent("libp2p:identify")}),
(t.runOnConnectionOpen??qt.runOnConnectionOpen)&&e.events.addEventListener("connection:open",r=>{const s=r.detail;this.identify(
s).catch(()=>{})})}[st]=["@libp2p/identify"];async _identify(e,t={}){let r,s;if(t.signal==null){const i=AbortSignal.timeout(
this.timeout);t={...t,signal:i}}this.log("run identify on new connection %a",e.remoteAddr);try{r=await e.newStream(this.
protocol,{...t,runOnLimitedConnection:this.runOnLimitedConnection}),s=r.log.newScope("identify");const i=await kz(r,this.
maxMessageSize,t,s);return $z(i)}catch(i){throw s?.error("identify failed - %e",i),r?.abort(i),i}}async identify(e,t={}){
const r=await this._identify(e,t),{publicKey:s,protocols:i,observedAddr:o}=r;if(s==null)throw new Y("Public key was miss\
ing from identify message");const a=Tv(s),c=Ft(a);if(!e.remotePeer.equals(c))throw new Y("Identified peer does not match\
 the expected peer");if(this.components.peerId.equals(c))throw new Y("Identified peer is our own peer id?");return this.
maybeAddObservedAddress(o),this.log("completed for peer %p and protocols %o",c,i),Dz(this.components.peerStore,this.components.
events,this.log,e,r)}maybeAddObservedAddress(e){const t=$v(e);if(t==null||(this.log.trace("our observed address was %a",
t),hs(t)))return;const r=t.getComponents();if((r[0].code===as||r[0].code===Wm&&r[1].code===as)&&!s1(t)){this.log.trace("\
our observed address was IPv6 but not a global unicast address");return}Ca.exactMatch(t)||(this.log.trace("storing the o\
bserved address"),this.components.addressManager.addObservedAddr(t))}async handleProtocol(e,t){const r=e.log.newScope("i\
dentify");r("responding to identify");const s=AbortSignal.timeout(this.timeout),i=await this.components.peerStore.get(this.
components.peerId,{signal:s}),o=this.components.addressManager.getAddresses().map(u=>u.decapsulateCode(B));let a=i.peerRecordEnvelope;
if(o.length>0&&a==null){const u=new bt({peerId:this.components.peerId,multiaddrs:o});a=(await Qt.seal(u,this.components.
privateKey,{signal:s})).marshal().subarray()}let c=t.remoteAddr.bytes;w1.matches(t.remoteAddr)||(c=void 0);const l=Ut(e).
pb(hc);r("send response"),await l.write({protocolVersion:this.host.protocolVersion,agentVersion:this.host.agentVersion,publicKey:Hc(
this.components.privateKey.publicKey),listenAddrs:o.map(u=>u.bytes),signedPeerRecord:a,observedAddr:c,protocols:i.protocols},
{signal:s}),r("close write"),await l.unwrap().unwrap().close({signal:s})}}function Nz(n={}){return e=>new Rz(e,n)}class Wd extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,Wd)}}const Fz=n=>"reason"in n?n.reason:new DOMException(
"This operation was aborted.","AbortError"),Uz=2**31-1,Oz=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function Bz(n,e){
const{milliseconds:t,fallback:r,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
n.cancel?.()}catch{}},h=new Promise((d,p)=>{const v=()=>{p(Fz(o)),l()},g=Oz(t,i);try{g?p(g):o?.aborted?v():o&&(c=v,o.addEventListener(
"abort",c,{once:!0}))}finally{n.then(d,p)}if(g||o?.aborted||t>Uz)return;const E=r||s===!1||s instanceof Error?void 0:new Wd(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{d(r())}catch(f){p(f)}else s===!1?
d():p(s instanceof Error?s:E);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const kv=n=>typeof n=="function"?{filter:n}:
{...n},zz=n=>n===1/0||Number.isSafeInteger(n)&&n>=0,Vz=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],qz=n=>{for(const[e,t]of Vz){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="functi\
on")return{addListener:r.bind(n),removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},Wz=n=>{const e=new Map;
for(const[t,r]of n)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},Kz=({addListener:n,removeListener:e,
handlers:t,signal:r,abortHandler:s,isDone:i})=>{r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){
e(o,a);return}},Gz=({removeListener:n,handlers:e,signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener(
"abort",r)},Hz=(n,e,t)=>{let r=Promise.resolve();return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function jz(n,e,t){let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=kv(t);const{
filter:l}=t;if(!zz(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=qz(n);if(t.count===0){a([]);return}const d=[],p=m=>{
r(),c(m)},v=Hz(l,()=>s,p),g=m=>{d.push(m),t.count===d.length&&(r(),a(d))},E=(...m)=>{if(s)return;const y=t.multiArgs?m:m[0];
if(!l){g(y);return}v(y,A=>{A&&g(y)})},f=(...m)=>{p(t.rejectionMultiArgs?m:m[0])},b=()=>{p(t.signal.reason)},_={addListener:u,
removeListener:h,handlers:Wz([[e,E],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:b,isDone:()=>s};r=()=>{
s=!0,clearTimeout(i),Gz(_)},Kz(_),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
r,t.timeout)),a(d))});if(o.cancel=r,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=Bz(o,{milliseconds:t.
timeout});return a.cancel=()=>{r(),a.clear()},a}return o}function Xz(n,e,t){const r=jz(n,e,{...kv(t),count:1,resolveImmediately:!1}),
s=r.then(i=>i[0]);return s.cancel=r.cancel,s}function bn(n=0){return new Uint8Array(n)}function xh(n=0){return new Uint8Array(
n)}function Qz(n){return n?.buffer instanceof ArrayBuffer}function Yz(n){if(Qz(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function lm(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=xh(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return Yz(t)}function Lv(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<
n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const Rv=Symbol.for("@achingbrain/uint8arraylist");function um(n,e){if(e==
null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{
buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Ko(n){return!!n?.[Rv]}class Si{bufs;length;[Rv]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(Ko(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Ko(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=um(this.bufs,e);return t.buf[t.index]}set(e,t){const r=um(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Ko(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return lm(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:lm(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new Si;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Ko(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(r[d]!==p){u=Math.max(1,d-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=xh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=bn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=bn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=bn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=xh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=bn(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=bn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=bn(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=bn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=bn(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof Si)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!Lv(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new Si;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}}const hm=32,Jz="1.0.0",Zz="p\
ing",e7="ipfs",t7=1e4,n7=2,r7=1;class s7{protocol;components;started;timeout;maxInboundStreams;maxOutboundStreams;runOnLimitedConnection;constructor(e,t={}){
this.components=e,this.started=!1,this.protocol=`/${t.protocolPrefix??e7}/${Zz}/${Jz}`,this.timeout=t.timeout??t7,this.maxInboundStreams=
t.maxInboundStreams??n7,this.maxOutboundStreams=t.maxOutboundStreams??r7,this.runOnLimitedConnection=t.runOnLimitedConnection??
!0,this.handlePing=this.handlePing.bind(this)}[Symbol.toStringTag]="@libp2p/ping";[st]=["@libp2p/ping"];async start(){await this.
components.registrar.handle(this.protocol,this.handlePing,{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.
maxOutboundStreams,runOnLimitedConnection:this.runOnLimitedConnection}),this.started=!0}async stop(){await this.components.
registrar.unhandle(this.protocol),this.started=!1}isStarted(){return this.started}async handlePing(e,t){const r=e.log.newScope(
"ping");r.trace("ping from %p",t.remotePeer);const s=AbortSignal.timeout(this.timeout);s.addEventListener("abort",()=>{e.
abort(new Qm("Ping timed out"))});const i=Date.now();for await(const o of e){if(e.status!=="open"){r("stream status chan\
ged to %s",e.status);break}e.send(o)||(r("waiting for stream to drain"),await Xz(e,"drain",{rejectionEvents:["close"],signal:s}),
r("stream drained"))}r("ping from %p complete in %dms",t.remotePeer,Date.now()-i),await e.close({signal:s})}async ping(e,t={}){
const r=crypto.getRandomValues(new Uint8Array(hm)),s=await this.components.connectionManager.openStream(e,this.protocol,
{runOnLimitedConnection:this.runOnLimitedConnection,...t}),i=s.log.newScope("ping");try{const o=Date.now(),a=Promise.withResolvers(),
c=new Si,l=u=>{if(c.append(u.data),c.byteLength===hm){s.removeEventListener("message",l);const h=Date.now()-o;Promise.all(
[s.closeRead(t)]).then(()=>{if(Lv(r,c.subarray()))a.resolve(h);else throw new oa(`Received wrong ping ack after ${h}ms`)}).
catch(d=>{s.abort(d),a.reject(d)})}};return s.addEventListener("message",l),s.send(r),await s.close(t),await kt(a.promise,
t.signal)}catch(o){throw i.error("error while pinging %o - %e",e,o),s?.abort(o),o}finally{s?.close()}}}function i7(n={}){
return e=>new s7(e,n)}const o7="bootstrap",a7=50,c7=1e3;class l7 extends he{static tag="bootstrap";log;timer;list;timeout;components;_init;constructor(e,t={
list:[]}){if(t.list==null||t.list.length===0)throw new Error("Bootstrap requires a list of peer addresses");super(),this.
components=e,this.log=e.logger.forComponent("libp2p:bootstrap"),this.timeout=t.timeout??c7,this.list=t.list.map(r=>O(r)).
filter(r=>zh.matches(r)?r.getComponents().findLast(i=>i.code===B)?.value==null?(this.log.error("invalid bootstrap multia\
ddr without peer id"),!1):!0:(this.log.error("invalid multiaddr %a",r),!1)).map(r=>({id:te(r.getComponents().findLast(s=>s.
code===B)?.value??""),multiaddrs:[r]})),this._init=t}[_a]=this;[Symbol.toStringTag]="@libp2p/bootstrap";[st]=["@libp2p/p\
eer-discovery"];isStarted(){return!!this.timer}start(){this.isStarted()||(this.log("Starting bootstrap node discovery, d\
iscovering peers after %s ms",this.timeout),this.timer=setTimeout(()=>{this._discoverBootstrapPeers().catch(e=>{this.log.
error("failed to discover bootstrap peers - %e",e)})},this.timeout))}async _discoverBootstrapPeers(){if(this.timer!=null)
for(const e of this.list){if(await this.components.peerStore.merge(e.id,{tags:{[this._init.tagName??o7]:{value:this._init.
tagValue??a7,ttl:this._init.tagTTL}},multiaddrs:e.multiaddrs}),this.timer==null)return;this.safeDispatchEvent("peer",{detail:e}),
this.components.connectionManager.openConnection(e.id).catch(t=>{this.log.error("could not dial bootstrap peer %p - %e",
e.id,t)})}}stop(){this.timer!=null&&clearTimeout(this.timer),this.timer=void 0}}function u7(n){return e=>new l7(e,n)}var dc;
(function(n){let e;n.codec=()=>(e==null&&(e=se((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.publicKey!=null&&t.publicKey.
byteLength>0&&(r.uint32(10),r.bytes(t.publicKey)),t.addrs!=null)for(const i of t.addrs)r.uint32(18),r.bytes(i);s.lengthDelimited!==
!1&&r.ldelim()},(t,r,s={})=>{const i={publicKey:Nn(0),addrs:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();
switch(a>>>3){case 1:{i.publicKey=t.bytes();break}case 2:{if(s.limits?.addrs!=null&&i.addrs.length===s.limits.addrs)throw new ae(
'Decode error - map field "addrs" had too many elements');i.addrs.push(t.bytes());break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>ie(t,n.codec()),n.decode=(t,r)=>oe(t,n.codec(),r)})(dc||(dc={}));const h7="_peer-discovery._p\
2p._pubsub";class d7 extends he{[_a]=!0;[Symbol.toStringTag]="@libp2p/pubsub-peer-discovery";interval;listenOnly;topics;intervalId;components;log;constructor(e,t={}){
super();const{interval:r,topics:s,listenOnly:i}=t;this.components=e,this.interval=r??1e4,this.listenOnly=i??!1,this.log=
e.logger.forComponent("libp2p:discovery:pubsub"),Array.isArray(s)&&s.length>0?this.topics=s:this.topics=[h7],this._onMessage=
this._onMessage.bind(this)}isStarted(){return this.intervalId!=null}start(){}afterStart(){if(this.intervalId!=null)return;
const e=this.components.pubsub;if(e==null)throw new Error("PubSub not configured");for(const t of this.topics)e.subscribe(
t),e.addEventListener("message",this._onMessage);this.listenOnly||(this._broadcast(),this.intervalId=setInterval(()=>{this.
_broadcast()},this.interval))}beforeStop(){const e=this.components.pubsub;if(e==null)throw new Error("PubSub not configu\
red");for(const t of this.topics)e.unsubscribe(t),e.removeEventListener("message",this._onMessage)}stop(){this.intervalId!=
null&&(clearInterval(this.intervalId),this.intervalId=void 0)}_broadcast(){const e=this.components.peerId;if(e.publicKey==
null)throw new Error("PeerId was missing public key");const t={publicKey:$r(e.publicKey),addrs:this.components.addressManager.
getAddresses().map(i=>i.bytes)},r=dc.encode(t),s=this.components.pubsub;if(s==null)throw new Error("PubSub not configure\
d");for(const i of this.topics){if(s.getSubscribers(i).length===0){this.log("skipping broadcasting our peer data on topi\
c %s because there are no peers present",i);continue}this.log("broadcasting our peer data on topic %s",i),s.publish(i,r)}}_onMessage(e){
if(!this.isStarted())return;const t=e.detail;if(this.topics.includes(t.topic))try{const r=dc.decode(t.data),s=Jt(r.publicKey),
i=Ft(s);if(i.equals(this.components.peerId))return;this.log("discovered peer %p on %s",i,t.topic),this.safeDispatchEvent(
"peer",{detail:{id:i,multiaddrs:r.addrs.map(o=>O(o))}})}catch(r){this.log.error("error handling incoming message",r)}}}function f7(n={}){
return e=>new d7(e,n)}const dm=(n,e)=>typeof n!="number"||!Number.isFinite(n)?e:Math.max(1,Math.min(60,n)),Qn={snapshotHz:20,
commandHz:30,keepaliveMs:1e3,maxEventsPerTick:20,eventRetryMs:500,eventRetryMax:5,reliableEventTypes:[],reconnectStallMs:8e3,
reconnectBackoffMs:5e3,snapshotsRequireAuthority:!1,snapshotTopic:null,commandTopic:null,eventTopic:null};class p7{constructor(e,t={}){
this.adapter=e,this.stateProviders=new Map,this.commandProviders=new Map,this.eventQueue=[],this.pendingReliableEvents=new Map,
this.reliabilityStats={sent:0,acked:0,dropped:0},this.snapshotHandlers=[],this.commandHandlers=[],this.eventHandlers=[],
this.seq={snapshot:0,command:0,event:0},this.lastSnapshotAt=-1/0,this.lastCommandAt=-1/0,this.lastEventAt=-1/0,this.lastRxAt=
0,this.lastTxAt=0,this.lastReconnectAt=-1/0,this.stateDirty=!0,this.authorityId=null,this.configure(t)}configure(e={}){const t=Number.
isFinite(e.eventRetryMs)?e.eventRetryMs:Qn.eventRetryMs,r=Number.isFinite(e.eventRetryMax)?e.eventRetryMax:Qn.eventRetryMax;
this.profile={...Qn,...e,snapshotHz:dm(e.snapshotHz,Qn.snapshotHz),commandHz:dm(e.commandHz,Qn.commandHz),eventRetryMs:Math.
max(0,t),eventRetryMax:Math.max(1,r),reliableEventTypes:Array.isArray(e.reliableEventTypes)?e.reliableEventTypes:Qn.reliableEventTypes},
this.snapshotIntervalMs=Math.round(1e3/this.profile.snapshotHz),this.commandIntervalMs=Math.round(1e3/this.profile.commandHz);
const s=Math.max(this.profile.snapshotHz,this.profile.commandHz);this.tickIntervalMs=Math.max(10,Math.round(1e3/s))}getProfile(){
return{...this.profile}}getTickIntervalMs(){return this.tickIntervalMs}setAuthority(e){this.authorityId=e||null}getAuthority(){
return this.authorityId}registerStateProvider(e,t={}){const r=t.id||`state-${Math.random().toString(36).slice(2)}`;return this.
stateProviders.set(r,{fn:e,options:t}),r}registerCommandProvider(e,t={}){const r=t.id||`cmd-${Math.random().toString(36).
slice(2)}`;return this.commandProviders.set(r,{fn:e,options:t}),r}unregisterStateProvider(e){this.stateProviders.delete(
e)}unregisterCommandProvider(e){this.commandProviders.delete(e)}addSnapshotHandler(e){this.snapshotHandlers.push(e)}addCommandHandler(e){
this.commandHandlers.push(e)}addEventHandler(e){this.eventHandlers.push(e)}markStateDirty(){this.stateDirty=!0}queueEvent(e,t={}){
const r=Date.now(),s=t.reliable||t.critical,i=t.id||`evt-${r}-${Math.random().toString(36).slice(2,8)}`;return s?(this.pendingReliableEvents.
has(i)||this.pendingReliableEvents.set(i,{id:i,payload:e,options:t,createdAt:r,lastSentAt:0,attempts:0,nextSendAt:0}),i):
(this.eventQueue.push({id:i,payload:e,options:t,reliable:!1}),i)}recordRx(e=Date.now()){this.lastRxAt=e}recordTx(e=Date.
now()){this.lastTxAt=e}handleMessage(e,t){if(!e||typeof e.type!="string"||!e.type.startsWith("pc-"))return!1;if(this.adapter?.
isInScope&&!this.adapter.isInScope(e)||e.target&&this.adapter?.getPeerId&&e.target!==this.adapter.getPeerId())return!0;if(this.
recordRx(e.header?.ts||Date.now()),e.type==="pc-snapshot")return this.snapshotHandlers.forEach(r=>r(t,e)),!0;if(e.type===
"pc-command")return this.commandHandlers.forEach(r=>r(t,e)),!0;if(e.type==="pc-ack"){const r=e?.payload?.eventIds;if(Array.
isArray(r)){let s=0;r.forEach(i=>{this.pendingReliableEvents.delete(i)&&(s+=1)}),this.reliabilityStats.acked+=s}return!0}
return e.type==="pc-event"&&(this.eventHandlers.forEach(r=>r(t,e)),this._ackReliableEvents(e,t)),!0}tick(e=Date.now()){this.
_flushCommands(e),this._flushSnapshots(e),this._flushEvents(e),this._checkReconnect(e)}_buildHeader(e,t){return{type:e,seq:this.
seq[e]++,ts:t,peerId:this.adapter?.getPeerId?.()||null,authorityId:this.authorityId||this.adapter?.getAuthority?.()||null,
topologyId:this.adapter?.getTopologyId?.()||null,topologyType:this.adapter?.getTopologyType?.()||null}}_collectStatePayload(){
const e=[];for(const[t,r]of this.stateProviders.entries())try{const s=r.fn();if(s==null)continue;e.push({id:t,data:s})}catch{}
return e}_collectCommandPayload(){const e=[];for(const[t,r]of this.commandProviders.entries())try{const s=r.fn();if(s==null)
continue;Array.isArray(s)?s.forEach(i=>e.push({id:t,data:i})):e.push({id:t,data:s})}catch{}return e}_flushSnapshots(e){if(this.
stateProviders.size===0||e-this.lastSnapshotAt<this.snapshotIntervalMs)return;const t=e-this.lastSnapshotAt>=this.profile.
keepaliveMs;if(!this.stateDirty&&!t)return;const r=this._collectStatePayload();if(r.length===0&&!t)return;const s={type:"\
pc-snapshot",header:this._buildHeader("snapshot",e),gameId:this.adapter?.getGameId?.()||null,roomId:this.adapter?.getRoomId?.()||
null,topologyId:this.adapter?.getTopologyId?.()||null,payload:r,keepalive:t};this.lastSnapshotAt=e,this.stateDirty=!1,this.
adapter?.sendSnapshot?.(s),this.recordTx(e)}_flushCommands(e){if(this.commandProviders.size===0||e-this.lastCommandAt<this.
commandIntervalMs)return;const t=this._collectCommandPayload();if(t.length===0)return;const r={type:"pc-command",header:this.
_buildHeader("command",e),gameId:this.adapter?.getGameId?.()||null,roomId:this.adapter?.getRoomId?.()||null,topologyId:this.
adapter?.getTopologyId?.()||null,payload:t};this.lastCommandAt=e,this.adapter?.sendCommand?.(r),this.recordTx(e)}_flushEvents(e){
if(this.eventQueue.length===0&&this.pendingReliableEvents.size===0)return;const t=this.profile.maxEventsPerTick,r=[],s=[];
for(const a of this.pendingReliableEvents.values()){if(a.attempts>=this.profile.eventRetryMax){this.reliabilityStats.dropped+=
1,this.pendingReliableEvents.delete(a.id);continue}e>=a.nextSendAt&&s.push(a)}const i=a=>r.length>=t?!1:(r.push(a),!0);for(const a of s){
if(!i({id:a.id,payload:a.payload,reliable:!0,ts:e}))break;a.attempts+=1,a.lastSentAt=e,this.reliabilityStats.sent+=1;const l=(a.
options?.retryMs??this.profile.eventRetryMs)*Math.pow(2,Math.max(0,a.attempts-1));a.nextSendAt=e+l}for(;r.length<t&&this.
eventQueue.length>0;){const a=this.eventQueue.shift();if(!a)break;r.push({id:a.id,payload:a.payload,reliable:!1,ts:e})}if(r.
length===0)return;const o={type:"pc-event",header:this._buildHeader("event",e),gameId:this.adapter?.getGameId?.()||null,
roomId:this.adapter?.getRoomId?.()||null,topologyId:this.adapter?.getTopologyId?.()||null,payload:r};this.lastEventAt=e,
this.adapter?.sendEvent?.(o),this.recordTx(e)}getReliabilityStats(){return{sent:this.reliabilityStats.sent,acked:this.reliabilityStats.
acked,dropped:this.reliabilityStats.dropped,pending:this.pendingReliableEvents.size,retryMs:this.profile.eventRetryMs,retryMax:this.
profile.eventRetryMax}}_checkReconnect(e){if(!this.adapter?.reconnect||this.profile.reconnectStallMs<=0)return;const t=this.
lastRxAt||0;if(e-t<this.profile.reconnectStallMs||e-this.lastReconnectAt<this.profile.reconnectBackoffMs)return;this.lastReconnectAt=
e;const r=s=>{try{Promise.resolve(this.adapter.onReconnectError?.(s)).catch(()=>{})}catch{}};try{Promise.resolve(this.adapter.
reconnect()).catch(r)}catch(s){r(s)}}_ackReliableEvents(e,t){const s=(Array.isArray(e?.payload)?e.payload:[]).filter(a=>a?.
reliable&&a?.id).map(a=>a.id);if(s.length===0)return;const i=Date.now(),o={type:"pc-ack",header:this._buildHeader("event",
i),gameId:this.adapter?.getGameId?.()||null,roomId:this.adapter?.getRoomId?.()||null,topologyId:this.adapter?.getTopologyId?.()||
null,target:t||null,payload:{eventIds:s}};this.adapter?.sendEvent?.(o)}}const g7=4,m7=5,b7=6,fm=2,pm=15e3,eu=8,y7=1,gm=.15,
mm=1,xt=(n,e)=>Number.isFinite(n)?n:e,Qr=n=>{if(!n||typeof n!="object")return{x:0,y:0,z:0};const e=Number.isFinite(n.x)?
n.x:0,t=Number.isFinite(n.y)?n.y:0,r=Number.isFinite(n.z)?n.z:0;return{x:e,y:t,z:r}},bm=(n,e)=>{const t=(n?.x||0)-(e?.x||
0),r=(n?.y||0)-(e?.y||0),s=(n?.z||0)-(e?.z||0);return Math.sqrt(t*t+r*r+s*s)},w7=n=>{let e=0;const t=String(n||"");for(let r=0;r<
t.length;r+=1)e=(e<<5)-e+t.charCodeAt(r),e|=0;return Math.abs(e)},v7=(n,e,t)=>{if(e<=0)return[];const r=n.map(s=>({entry:s,
score:w7(`${t}:${s.peerId}`)}));return r.sort((s,i)=>s.score-i.score),r.slice(0,e).map(s=>s.entry)};class S7{constructor(e={}){
const t=xt(e.swapHysteresisRatio,gm),r=xt(e.maxZeroConnBoost,mm);this.config={topologyId:e.topologyId||"default-topology",
topologyType:e.topologyType||e.topology||"distributed",targetConnections:xt(e.targetConnections,g7),maxConnections:xt(e.
maxConnections,m7),connectionRadius:xt(e.connectionRadius,b7),isolationMinConnections:xt(e.isolationMinConnections,fm),longRangeCount:xt(
e.longRangeCount,1),longRangeRefreshMs:xt(e.longRangeRefreshMs,pm),shardSize:xt(e.shardSize,eu),shardRadius:xt(e.shardRadius,
y7),swapHysteresisRatio:Math.min(.9,Math.max(0,t)),maxZeroConnBoost:Math.max(0,Math.trunc(r)),enforceTopologyScope:e.enforceTopologyScope!==
!1,allowRelayWhenIsolated:e.allowRelayWhenIsolated!==!1},this.peerId=e.peerId||null,this.localMetric=Qr(e.metric),this.longRangePeers=
new Set,this.lastLongRangeAt=0,this.desiredPeers=new Set,this.referralPeers=new Set,this.priorityPeers=[]}setPeerId(e){this.
peerId=e||null}setLocalMetric(e){this.localMetric=Qr(e)}setConnectionLimits({targetConnections:e,maxConnections:t}={}){Number.
isFinite(e)&&(this.config.targetConnections=Math.max(1,e)),Number.isFinite(t)&&(this.config.maxConnections=Math.max(1,t))}setPriorityPeers(e=[]){
if(!Array.isArray(e)){this.priorityPeers=[];return}const t=[];e.forEach(r=>{r&&(t.includes(r)||t.push(r))}),this.priorityPeers=
t}addReferralPeers(e=[]){e.forEach(t=>{t&&this.referralPeers.add(t)})}clearReferral(e){e&&this.referralPeers.delete(e)}getShardId(e=this.
localMetric){const t=this.config.shardSize||eu,r=Qr(e),s=Math.floor(r.x/t),i=Math.floor(r.y/t),o=Math.floor(r.z/t);return`${s}\
:${i}:${o}`}getNeighborShardIds(e=this.localMetric){const t=Math.max(0,this.config.shardRadius||0),r=this.config.shardSize||
eu,s=Qr(e),i=Math.floor(s.x/r),o=Math.floor(s.y/r),a=Math.floor(s.z/r),c=[];for(let l=-t;l<=t;l+=1)for(let u=-t;u<=t;u+=
1)for(let h=-t;h<=t;h+=1)c.push(`${i+l}:${o+u}:${a+h}`);return c}_filterCandidates(e){return Array.isArray(e)?e.filter(t=>!t?.
peerId||t.peerId===this.peerId?!1:this.config.enforceTopologyScope?!(t.topologyId&&t.topologyId!==this.config.topologyId):
!0):[]}_pickLongRange(e,t,{exclude:r=null,minDistance:s=null}={}){if(this.config.longRangeCount<=0)return[];const i=new Set(
e.map(d=>d.peerId)),o=e.filter(d=>!r||!r.has(d.peerId));if(o.length===0)return[];const a=Number.isFinite(s)?o.filter(d=>Number.
isFinite(d.distance)&&d.distance>s):[],c=a.length>0?a:o,l=this.config.longRangeRefreshMs||pm,u=t-this.lastLongRangeAt>l,
h=Array.from(this.longRangePeers).filter(d=>i.has(d)&&(!r||!r.has(d)));return u||h.length===0?(this.longRangePeers.clear(),
v7(c,this.config.longRangeCount,this.peerId||t).forEach(p=>this.longRangePeers.add(p.peerId)),this.lastLongRangeAt=t):h.
length!==this.longRangePeers.size&&(this.longRangePeers=new Set(h)),Array.from(this.longRangePeers)}computeDesiredPeers({
peers:e=[],connections:t=[],now:r=Date.now()}={}){const s=new Set((Array.isArray(t)?t:[]).map(m=>typeof m=="string"?m:m?.
peerId).filter(Boolean)),i=Number.isFinite(this.config.swapHysteresisRatio)?Math.min(.9,Math.max(0,this.config.swapHysteresisRatio)):
gm,o=Number.isFinite(this.config.maxZeroConnBoost)?Math.max(0,Math.trunc(this.config.maxZeroConnBoost)):mm,a=this._filterCandidates(
e).map(m=>{const y=Qr(m.metric),A=bm(this.localMetric,y),w=s.has(m.peerId),S=w&&Number.isFinite(A)?A*(1-i):A,x=xt(m.targetConnections,
this.config.targetConnections),C=Number.isFinite(m.activeConnections)?m.activeConnections:null,I=C===null?!0:C<x;return{
...m,metric:y,distance:A,effectiveDistance:S,isConnected:w,underTarget:I,noConnections:C===0,targetConnections:x}}),c=Math.
max(1,this.config.maxConnections),l=Number.isFinite(this.config.connectionRadius)?this.config.connectionRadius:null,u=Number.
isFinite(l),h=Math.max(1,this.config.isolationMinConnections||fm),d=new Map(a.map(m=>[m.peerId,m])),p=a.filter(m=>Number.
isFinite(m.distance)).slice().sort((m,y)=>m.distance!==y.distance?m.distance-y.distance:String(m.peerId).localeCompare(String(
y.peerId))),g=this.config.topologyType==="distributed"?p[0]:null;let E=u?p.filter(m=>m.distance<=(m.isConnected?l*(1+i):
l)):p,f=!1;u&&E.length===0&&(f=!0,E=p.slice(0,Math.min(c,h))),f||E.sort((m,y)=>m.effectiveDistance!==y.effectiveDistance?
m.effectiveDistance-y.effectiveDistance:m.distance!==y.distance?m.distance-y.distance:String(m.peerId).localeCompare(String(
y.peerId)));const b=new Set,_=Array.isArray(this.priorityPeers)?this.priorityPeers:[];for(const m of _){if(b.size>=c)break;
d.has(m)&&b.add(m)}if(g?.peerId&&b.size<c&&b.add(g.peerId),!f&&o>0&&b.size<c){let m=0;for(const y of E){if(b.size>=c||m>=
o)break;!y.noConnections||b.has(y.peerId)||(b.add(y.peerId),m+=1)}}for(const m of E){if(b.size>=c)break;b.add(m.peerId)}
if(b.size<c){const m=[];for(const y of this.referralPeers){if(b.has(y))continue;const A=a.find(w=>w.peerId===y);A&&(u&&Number.
isFinite(A.distance)&&A.distance>l||m.push(y))}m.forEach(y=>{b.size<c&&b.add(y)})}return this.config.longRangeCount>0&&b.
size<c&&this._pickLongRange(a,r,{exclude:b,minDistance:u?l:null}).filter(y=>!b.has(y)).forEach(y=>{b.size<c&&b.add(y)}),
this.desiredPeers=b,b}shouldDialPeer(e){return e?this.desiredPeers.size===0?!0:this.desiredPeers.has(e):!1}getPeerDistance(e){
if(!e)return Number.POSITIVE_INFINITY;const t=e.metricInitialized===!0,r=Qr(e.metric),s=r.x===0&&r.y===0&&r.z===0;return!t&&
s?Number.POSITIVE_INFINITY:bm(this.localMetric,r)}}const A7=Object.freeze(["batch-throughput","low-latency","lan-first",
"capability-weighted"]),_7=new Set(["lan-host","direct-ws","direct-tcp"]),ym=new Set(["turn-relay","circuit-relay"]);function E7(n){
return typeof n!="string"||!n||n.includes("/p2p-circuit")?!1:/\/ip4\/(?:10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.
test(n)||/\/ip6\/(?:fe80:|fc|fd|::1\b)/i.test(n)||/\/dns[46]?\/[^/]+(?:\.local|\.lan|\.ts\.net)\b/i.test(n)}function wm(n){
if(!n||typeof n!="object")return 0;let e=0;const t=String(n.gpuTier||n.gpu?.tier||"").toLowerCase();t==="high"||t==="dis\
crete"?e+=1.2:t==="mid"||t==="medium"||t==="integrated"?e+=.7:t==="low"&&(e+=.3),(n.webgpu===!0||n.gpu?.available===!0)&&
(e+=.35);const r=Number(n.cores??n.cpu?.cores);Number.isFinite(r)&&r>0&&(e+=Math.min(.6,Math.log2(r+1)*.15));const s=Number(
n.bench?.gpuGflops??n.gpuGflops);return Number.isFinite(s)&&s>0&&(e+=Math.min(1,Math.log10(s+1)*.25)),Math.min(2.5,e)}function C7(n="\
batch-throughput",e=null,t={}){const r=String(n||"batch-throughput").trim().toLowerCase();if(r==="batch-throughput"||!A7.
includes(r))return{profile:"batch-throughput",scoreLink:null,scoreCandidate:null};const s=typeof e=="function"?e:()=>null,
i=Number.isFinite(t.rttScaleMs)&&t.rttScaleMs>0?t.rttScaleMs:50,o=Number.isFinite(t.lanWeight)&&t.lanWeight>0?t.lanWeight:
1.6,a=Number.isFinite(t.relayPenalty)&&t.relayPenalty>0?t.relayPenalty:.55,c=typeof t.localHostGroupId=="string"&&t.localHostGroupId?
t.localHostGroupId:null,l=h=>{const d=h?.candidatePairRttMs??h?.rttMs;return Number.isFinite(d)&&d>=0?d:null},u=h=>h?!!(_7.
has(h.icePath)||c&&h.hostGroupId&&h.hostGroupId===c||Array.isArray(h.multiaddrs)&&h.multiaddrs.some(E7)):!1;return r==="\
low-latency"?{profile:r,scoreLink:h=>{const d=Number.isFinite(h?.flow)?h.flow:0;if(d<=0)return 0;const p=l(s(h.peerId)),
v=p!==null?1/(1+p/i):.5;return d*v},scoreCandidate:h=>{const d=s(h),p=l(d);return(p!==null?1/(1+p/i):.25)+(u(d)?.2:0)}}:
r==="lan-first"?{profile:r,scoreLink:h=>{const d=Number.isFinite(h?.flow)?h.flow:0;if(d<=0)return 0;const p=s(h.peerId);
let v=1;u(p)?v=o:ym.has(p?.icePath)&&(v=a);const g=l(p),E=g!==null?1/(1+g/(i*4)):.9;return d*v*E},scoreCandidate:h=>{const d=s(
h);let p=0;u(d)?p+=2:ym.has(d?.icePath)&&(p-=.5);const v=l(d);return v!==null&&(p+=1/(1+v/i)),p}}:{profile:"capability-w\
eighted",scoreLink:h=>{const d=Number.isFinite(h?.flow)?h.flow:0;if(d<=0)return 0;const p=s(h.peerId),v=wm(p?.capabilities);
return d*(1+.15*v)},scoreCandidate:h=>{const d=s(h),p=wm(d?.capabilities),v=l(d),g=v!==null?.2/(1+v/i):0;return p+g}}}const x7=Object.
freeze({targetConnections:4,maxConnections:5,trialMs:6e3,exploreIntervalMs:3e3,maxExploreIntervalMs:3e5,maxRepairIntervalMs:15e3,
retryCooldownMs:2e4,maxCooldownMultiplier:1,referralShare:.5,replaceMargin:.1,minGainShare:.05,flowTauMs:4e3,debiasNewcomerFlow:!1,
candidateScoreBandRatio:.15,candidateExploreShare:.15,failFactor:2,successFactor:.5});function I7(){return{lastExploreAt:Number.
NEGATIVE_INFINITY,exploreDelayMs:null,trialPeerId:null,lastRepairAt:Number.NEGATIVE_INFINITY,repairDelayMs:0,established:new Set,
cooldown:new Map,failCounts:new Map,baselines:new Map,wasIdle:!1}}function tu(n,e){return n.length?n[Math.min(n.length-1,
Math.floor(e()*n.length))]:null}function Go(n,e,t,{bandRatio:r=.15,exploreShare:s=.15}={}){if(!n.length)return null;if(typeof t!=
"function"||n.length>=6&&s>0&&e()<s)return tu(n,e);const i=n.map(l=>{const u=Number(t(l));return{peerId:l,score:Number.isFinite(
u)?u:0}});let o=Number.NEGATIVE_INFINITY;for(const l of i)l.score>o&&(o=l.score);const a=Math.max(1e-9,Math.abs(o)*Math.
max(0,r)),c=i.filter(l=>l.score>=o-a).map(l=>l.peerId);return tu(c.length?c:n,e)}function M7({now:n,links:e=[],candidates:t=[],
referrals:r=[],available:s=[],state:i,random:o=Math.random,config:a={}}={}){if(!i)throw new TypeError("decideThroughputT\
opology requires a state object");const c={...x7,...a},l=Math.max(1,c.targetConnections),u=Math.max(l,c.maxConnections),
h=c.exploreIntervalMs,d=P=>Math.min(c.maxExploreIntervalMs,Math.max(h,P*(i.exploreDelayMs??h))),p=typeof c.scoreLink=="f\
unction"?c.scoreLink:null,v=typeof c.scoreCandidate=="function"?c.scoreCandidate:null,g=Number.isFinite(c.flowTauMs)&&c.
flowTauMs>0?c.flowTauMs:4e3,E=c.debiasNewcomerFlow===!0;i.failCounts||(i.failCounts=new Map);const f=P=>{let D=Number.isFinite(
P.flow)?P.flow:0;if(E&&D>0&&!i.established.has(P.peerId)&&Number.isFinite(P.since)){const T=Math.max(500,n-P.since);if(T<
3*g){const N=Math.max(.4,1-Math.exp(-T/g));D=D/N}}if(!p)return D;const U=Number(p({...P,flow:D}));return Number.isFinite(
U)?U:D},b=P=>{const D=(i.failCounts.get(P)||0)+1;i.failCounts.set(P,D);const U=Number.isFinite(c.maxCooldownMultiplier)?
Math.max(1,c.maxCooldownMultiplier):8,T=Math.min(U,2**Math.min(D-1,4));i.cooldown.set(P,n+c.retryCooldownMs*T)},_=new Set(
e.map(P=>P.peerId));for(const P of i.established)_.has(P)||i.established.delete(P);for(const[P,D]of i.cooldown)D<=n&&i.cooldown.
delete(P);const m=e.map(P=>({...P,effectiveFlow:f(P)})),y=m.reduce((P,D)=>P+D.effectiveFlow,0),A=e.reduce((P,D)=>P+(Number.
isFinite(D.flow)?D.flow:0),0),w=p?y:A;A>1e-9&&i.wasIdle?(i.wasIdle=!1,i.exploreDelayMs!==null&&i.exploreDelayMs>h&&(i.exploreDelayMs=
h,Number.isFinite(i.lastExploreAt)&&n-i.lastExploreAt<h&&(i.lastExploreAt=n-h))):e.length>0&&A<=1e-9&&(i.wasIdle=!0);for(const P of i.
baselines.keys())_.has(P)||i.baselines.delete(P);for(const P of m)if(!i.established.has(P.peerId)&&!i.baselines.has(P.peerId)){
const D=p?P.effectiveFlow:Number.isFinite(P.flow)?P.flow:0;i.baselines.set(P.peerId,w-D)}const S=[],x=m.some(P=>n-P.since<
c.trialMs);if(!x){if(m.length>l){const D=Math.min(w,...m.filter(N=>!i.established.has(N.peerId)).map(N=>i.baselines.get(
N.peerId))),U=w-D>Math.max(c.minGainShare*D,1e-9),T=m.map(N=>({...N,score:i.established.has(N.peerId)?N.effectiveFlow:U?
N.effectiveFlow/(1+c.replaceMargin):Number.NEGATIVE_INFINITY})).sort((N,G)=>G.score-N.score||N.since-G.since||String(N.peerId).
localeCompare(String(G.peerId)));for(const N of T.slice(l))S.push(N.peerId),b(N.peerId)}if(i.trialPeerId!==null){const D=_.
has(i.trialPeerId)&&!S.includes(i.trialPeerId);i.exploreDelayMs=d(D?c.successFactor:c.failFactor),D?i.failCounts.delete(
i.trialPeerId):b(i.trialPeerId),i.trialPeerId=null}const P=new Set(S);for(const D of m)P.has(D.peerId)||i.established.add(
D.peerId);i.baselines.clear()}const C=m.length-S.length;C>=l&&(i.repairDelayMs=0);const I=C<l,M=I&&n-i.lastRepairAt>=i.repairDelayMs,
k=c.skipIdleExplore===!0&&A<=1e-9,$=!I&&!x&&!k&&i.trialPeerId===null&&C<u&&n-i.lastExploreAt>=(i.exploreDelayMs??h);let F=null;
if(M||$){const P=N=>!_.has(N)&&(M||!i.cooldown.has(N)),D=r.filter(P),U=t.filter(P),T={bandRatio:c.candidateScoreBandRatio,
exploreShare:c.candidateExploreShare};F=(M?Go(s.filter(P),o,v,T):null)??(D.length&&o()<c.referralShare?Go(D,o,v,T):null)??
Go(U,o,v,T)??Go(D,o,v,T),F&&$&&(i.lastExploreAt=n,i.trialPeerId=F),F&&M&&(i.lastRepairAt=n,i.repairDelayMs=Math.min(c.maxRepairIntervalMs,
Math.max(h,2*i.repairDelayMs)))}return{connect:F,drop:S}}const Be=(n,e="ERR_INFERENCE_RECOVERY")=>Object.assign(new Error(
n),{code:e}),fc=n=>n.reason??new DOMException("Connection recovery cancelled","AbortError"),Ho=n=>n?.status==="open",Nv=n=>n?.
remoteAddr?.toString()??"",vm=n=>Nv(n).includes("/p2p-circuit"),qn=(n,e,t)=>{if(!Number.isSafeInteger(n)||n<e||n>t)throw new RangeError(
"Invalid connection recovery bound");return n};function jo(n,e){return e.aborted?(Promise.resolve(n).catch(()=>{}),Promise.
reject(fc(e))):new Promise((t,r)=>{const s=()=>r(fc(e));e.addEventListener("abort",s,{once:!0}),Promise.resolve(n).then(
t,r).finally(()=>e.removeEventListener("abort",s))})}class P7{constructor(e,{now:t=Date.now,dialTimeoutMs:r=5e3,cooldownMs:s=15e3,
freshGraceMs:i=1e4,directFreshGraceMs:o=null,idleGraceMs:a=15e3,maxConcurrent:c=2}={}){this.manager=e,this.now=t,this.dialTimeoutMs=
qn(r,10,15e3),this.cooldownMs=qn(s,1,6e4),this.freshGraceMs=qn(i,0,3e4);const l=Math.min(this.freshGraceMs,3e3);this.directFreshGraceMs=
qn(o===null?l:o,0,3e4),this.idleGraceMs=qn(a,0,3e4),this.maxConcurrent=qn(c,1,4),this.pending=new Map,this.cooldowns=new Map,
this.protections=new WeakMap,this.closed=!1}observe(e,{openedNow:t=!1}={}){if(!e||this.protections.has(e))return;const r=e.
timeline?.open??e.stat?.timeline?.open,s=r instanceof Date?r.getTime():Number(r?.timestamp??r),i=vm(e)?this.freshGraceMs:
this.directFreshGraceMs;this.protections.set(e,{freshUntil:Number.isFinite(s)?s+i:t?this.now()+i:0,idleUntil:0,leases:new Map})}protectionMs(e){
if(this.closed||!Ho(e))return 0;this.observe(e);const t=this.protections.get(e),r=this.now();for(const[s,i]of t.leases)i<=
r&&t.leases.delete(s);return Math.max(0,t.freshUntil-r,t.idleUntil-r,...[...t.leases.values()].map(s=>s-r))}retain(e,{timeoutMs:t=3e5}={}){
if(qn(t,1,301e3),this.closed||!Ho(e))throw Be("Inference connection is closed");if(!this.manager.libp2p?.getConnections().
includes(e))throw Be("Inference connection is not owned by this manager");this.observe(e);const r=this.protections.get(e),
s=Symbol("inference-stream");r.leases.set(s,this.now()+t);let i=!1;const o=()=>this.manager._scheduleRelayPrune?.(e.remotePeer.
toString(),Math.max(1,this.protectionMs(e)));return o(),()=>{i||(i=!0,r.leases.delete(s),r.idleUntil=this.now()+this.idleGraceMs,
this.closed||o())}}notifyRelayReady(e){this.pending.get(e)?.ready()}recover(e,{signal:t}={}){try{t?.throwIfAborted();const r=this.
manager,s=this.now(),i=r.peers?.get(e);if(this.closed||!r.isConnected||!r.libp2p)throw Be("Network is not connected");if(!i||
e===r.peerId||r.bootstrapPeerIds?.has(e)||["gameId","roomId","topologyId"].some(_=>i[_]!==r.config[_]))throw Be("Connect\
ion recovery requires a known peer in this application scope");const o=this.pending.get(e);if(o)return this._join(o,t);if(r.
pendingPeerDials?.has(e))throw Be("A normal peer dial is already in progress");const a=r.recentDialAttempts?.get(e);if(Number.
isFinite(a)&&s-a<5e3)throw Be("Peer connection recovery is limited by the normal dial throttle");for(const[_,m]of this.cooldowns)
m<=s&&this.cooldowns.delete(_);if(this.cooldowns.has(e))throw Be("Peer connection recovery is cooling down","ERR_INFEREN\
CE_RECOVERY_COOLDOWN");if(this.pending.size>=this.maxConcurrent||this.cooldowns.size>=64)throw Be("Connection recovery i\
s busy");if(!r._hasAvailableLogicalPeerSlot(e,s)||r._getDialBackoffEntry(e,s))throw Be("Peer connection recovery is limi\
ted by the normal dial policy");const c=r._buildCircuitAddr(e);if(!c)throw Be("No configured relay route for this peer");
const l=O(c.toString()),u=l.getComponents(),h=u.filter(_=>_.name==="p2p").map(_=>_.value);if(!r.config.bootstrapPeers?.some(
_=>`${String(_).replace(/\/p2p-circuit\/?$/,"")}/p2p-circuit/p2p/${e}`===l.toString())||h.length!==2||h[1]!==e||!r.bootstrapPeerIds.
has(h[0])||u.filter(_=>_.name==="p2p-circuit").length!==1||u.some(_=>_.name.startsWith("webrtc")))throw Be("Connection r\
ecovery requires an exact configured relay and peer identity");const p=(_=r.libp2p.getDialQueue?.()??[])=>{const m=r.libp2p.
getConnections().filter(Ho),y=m.some(S=>S.remotePeer.toString()===h[0])?1:2,A=_.filter(S=>["queued","active"].includes(S.
status)&&!this.pending.has(S.peerId?.toString())).length,w=[...this.pending.entries()].reduce((S,[x,C])=>S+(x===e?0:C.slots),
0);if(m.length+w+A+y>r._getTransportMaxConnections())throw Be("No physical connection headroom for recovery");return y},
v={controller:new AbortController,waiters:0,slots:p()};v.relayReady=new Promise(_=>{v.ready=_});const g=new Set(r.libp2p.
getConnections());this.pending.set(e,v),this.cooldowns.set(e,s+this.cooldownMs),r.recentDialAttempts?.set(e,s);const E=setTimeout(
()=>v.controller.abort(Be("Peer connection recovery deadline exceeded","ERR_INFERENCE_RECOVERY_DEADLINE")),this.dialTimeoutMs);
E.unref?.();const f=_=>{if(!(!_||g.has(_)))try{Promise.resolve(_.abort(fc(v.controller.signal))).catch(()=>{})}catch{}},
b=async()=>{v.controller.signal.throwIfAborted();const _=r.libp2p.getDialQueue?.()??[];if(_.some(A=>["queued","active"].
includes(A.status)&&A.peerId?.toString()===e))throw Be("A native peer dial is already in progress");v.slots=p(_);const m=Promise.
resolve(r.libp2p.dial(l,{force:!0,signal:v.controller.signal}));m.then(A=>{(v.controller.signal.aborted||this.closed)&&f(
A)},()=>{});const y=await jo(m,v.controller.signal);if(v.controller.signal.aborted||this.closed)throw f(y),fc(v.controller.
signal);if(g.has(y)||!Ho(y)||y.remotePeer.toString()!==e||!["/noise","/tls/1.0.0"].includes(y.encryption)||!vm(y)||Nv(y).
includes("/webrtc"))throw f(y),Be("Recovery did not establish a fresh authenticated relay connection");return this.observe(
y,{openedNow:!0}),r._clearDialFailureBackoff?.(e),y};return v.promise=(async()=>{try{return await b()}catch(_){if(v.controller.
signal.aborted||!r._isRelayReservationError?.(_)||!await jo(Promise.resolve(r._requestRelayAssist(e,"inference-stream-re\
covery")),v.controller.signal))throw _;return await jo(v.relayReady,v.controller.signal),b()}})().catch(_=>{throw v.controller.
signal.aborted||r._recordDialFailureBackoff?.(e,"relay",_),_}).finally(()=>{clearTimeout(E),this.pending.get(e)===v&&this.
pending.delete(e)}),this._join(v,t)}catch(r){return Promise.reject(r)}}_join(e,t){return e.waiters++,(t?jo(e.promise,t):
e.promise).finally(()=>{--e.waiters===0&&[...this.pending.values()].includes(e)&&e.controller.abort(new DOMException("Co\
nnection recovery has no remaining callers","AbortError"))})}async stop(){this.closed=!0;const e=[...this.pending.values()];
for(const t of e)t.controller.abort(new DOMException("Network manager stopped","AbortError"));await Promise.allSettled(e.
map(t=>t.promise)),this.cooldowns.clear(),this.protections=new WeakMap}}const es="peercompute-netviz-sessions",Sm="netvi\
z-telemetry-v1",Am="peercompute.network-telemetry.v1",Ve=Object.freeze({maximumBytes:24*1024,maximumPeers:32,maximumModels:16,
maximumReports:256,intervalMs:5e3,minimumReceiveIntervalMs:500,staleMs:15e3,expiryMs:6e4,orderExpiryMs:3e5,providerTimeoutMs:1e3}),
T7=new TextEncoder,D7=new TextDecoder("utf-8",{fatal:!0}),Xo=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},ze=(n,e=128)=>typeof n==
"string"?n.replace(/[\u0000-\u001f\u007f]/g,"").slice(0,e):"",fe=n=>Number.isFinite(n)&&n>=0?Math.min(Number.MAX_SAFE_INTEGER,
n):0,gt=(n,e,t=null)=>e.includes(n)?n:t,$7=["world","models","compute","observer"],k7=["webrtc","relay-webrtc","relay","\
direct","direct-websocket","websocket","presence","unknown"],L7=["lan-host","nat-srflx","nat-prflx","turn-relay","circui\
t-relay","direct-ws","direct-tcp"],R7=["udp","tcp"],N7=["inbound","outbound","both"],F7=["permanent","keeper","elected-k\
eeper","holding","off-relay"],U7=["drop-disabled","bootstrap-hold","no-direct","unhealthy-mesh","post-direct-hold","belo\
w-target","insufficient-candidates","retention-keeper","elected-keeper","none"],O7=["mobile","laptop","desktop","worksta\
tion","cluster","unknown"],nu=(n,e)=>Object.fromEntries(e.map(t=>[t,fe(n?.[t])])),_m=(n,e=1e9)=>Number.isFinite(n)&&n>=0?
Math.min(e,n):0;function Em(n){const e=Xo(n),t=Xo(e.compute),r=ze(e.peerId);if(!r)return null;const s=new Set,i=new Set,
o=(Array.isArray(e.peers)?e.peers:[]).slice(0,Ve.maximumPeers).flatMap(g=>{const E=Xo(g),f=ze(E.peerId);if(!f||f===r||s.
has(f))return[];s.add(f);const b=gt(E.icePath,L7),_=gt(E.iceProtocol,R7),m=gt(E.direction,N7),y=Number.isFinite(E.candidatePairRttMs)&&
E.candidatePairRttMs>=0?Math.min(E.candidatePairRttMs,6e5):null,A=E.workMesh&&typeof E.workMesh=="object"&&!Array.isArray(
E.workMesh)?E.workMesh:null,w=A?{tasksPerSec:_m(A.tasksPerSec),linkCost:_m(A.linkCost,6e5),inFlight:Math.min(1e4,fe(A.inFlight)),
streamResets:Math.min(1e6,fe(A.streamResets))}:null,S=Number.isFinite(E.workRate)&&E.workRate>=0?Math.min(1e9,E.workRate):
w?w.tasksPerSec:null;return[{peerId:f,via:gt(E.via,k7,"unknown"),signalingPath:gt(E.signalingPath,["direct","relay-scope\
d"]),mediaPath:gt(E.mediaPath,["direct","turn-relay","unknown"]),...b?{icePath:b}:{},..._?{iceProtocol:_}:{},...y!==null?
{candidatePairRttMs:y}:{},...m?{direction:m}:{},...Number.isFinite(E.connectionCount)&&E.connectionCount>0?{connectionCount:Math.
min(64,Math.trunc(E.connectionCount))}:{},...E.duplicateConnections===!0?{duplicateConnections:!0}:{},...S!==null?{workRate:S}:
{},...w?{workMesh:w}:{},rttMs:Number.isFinite(E.rttMs)&&E.rttMs>=0?Math.min(E.rttMs,6e5):null,...nu(E,["rxCount","txCoun\
t","rxBytes","txBytes","rxBps","txBps"])}]}),a=(Array.isArray(e.models)?e.models:[]).slice(0,Ve.maximumModels).flatMap(g=>{
const E=Xo(g),f=ze(E.manifestCid);return!f||i.has(f)?[]:(i.add(f),[{manifestCid:f,name:ze(E.name,160),task:ze(E.task,64),
runtime:ze(E.runtime,48),busy:E.busy===!0,modalities:[...new Set((Array.isArray(E.modalities)?E.modalities:[]).slice(0,8).
map(b=>ze(b,32)).filter(Boolean))]}])}),c=e.relayState&&typeof e.relayState=="object"&&!Array.isArray(e.relayState)?e.relayState:
null,l=c?{connected:c.connected===!0,role:gt(c.role,F7,c.connected===!0?"holding":"off-relay"),keepReason:gt(c.keepReason,
U7,"none"),relayPeerId:ze(c.relayPeerId)||null,gossipMeshCount:Math.min(256,fe(c.gossipMeshCount)),directMeshPeerCount:Math.
min(256,fe(c.directMeshPeerCount)),minDirectMeshPeers:Math.min(256,fe(c.minDirectMeshPeers))}:null,u=new Set,h=Array.isArray(
e.gossipMeshPeers)?e.gossipMeshPeers.slice(0,Ve.maximumPeers).map(g=>ze(g)).filter(g=>!g||g===r||u.has(g)?!1:(u.add(g),!0)):
null,d=e.capabilities&&typeof e.capabilities=="object"&&!Array.isArray(e.capabilities)?e.capabilities.compute&&typeof e.
capabilities.compute=="object"?e.capabilities.compute:e.capabilities:null,p=d?{resourceTier:gt(d.resourceTier||d.tier,O7,
"unknown"),gpuAvailable:d.gpuAvailable===!0||fe(d.gpuCount)>0,gpuHardwareVerified:d.gpuHardwareVerified===!0,cpuCores:Math.
min(1024,fe(d.cpuCores)),performanceClass:ze(d.performanceClass,32)||null}:null,v=ze(e.hostGroupId,64)||null;return{peerId:r,
ts:fe(e.ts),application:ze(e.application||e.gameId,80),role:gt(e.role,$7,a.length?"models":"compute"),gameId:ze(e.gameId),
roomId:ze(e.roomId),topologyId:ze(e.topologyId),topology:gt(e.topology,["distributed","hierarchical","emergent","through\
put","static"],"distributed"),isConnected:e.isConnected===!0,peerCount:fe(e.peerCount),...Number.isFinite(e.targetConnections)&&
e.targetConnections>=0?{targetConnections:Math.min(256,Math.trunc(e.targetConnections))}:{},...Number.isFinite(e.maxConnections)&&
e.maxConnections>=0?{maxConnections:Math.min(256,Math.trunc(e.maxConnections))}:{},...Number.isFinite(e.rewiresPerMin)&&
e.rewiresPerMin>=0?{rewiresPerMin:Math.min(1e4,fe(e.rewiresPerMin))}:{},...Number.isFinite(e.dialFailures)&&e.dialFailures>=
0?{dialFailures:Math.min(1e6,fe(e.dialFailures))}:{},...l?{relayState:l}:{},...h?{gossipMeshPeers:h}:{},...p?{capabilities:p}:
{},...v?{hostGroupId:v}:{},counts:nu(e.counts,["rx","tx","rxBytes","txBytes"]),rates:nu(e.rates,["rxBps","txBps"]),peers:o,
models:a,modelsStatus:gt(e.modelsStatus,["available","unavailable"],"available"),compute:e.compute&&typeof e.compute=="o\
bject"?{workerCount:fe(t.workerCount),activeTasks:fe(t.activeTasks??t.activeTaskCount),queuedTasks:fe(t.queuedTasks??t.queuedTaskCount),
totalTasksCompleted:fe(t.totalTasksCompleted),totalTasksFailed:fe(t.totalTasksFailed)}:null}}function ru(n,e,t){return new Promise(
(r,s)=>{const i=new AbortController;let o=!1;const a=(h,d)=>{o||(o=!0,clearTimeout(u),e.removeEventListener("abort",l),h(
d))},c=h=>{i.abort(h),a(s,h)},l=()=>c(e.reason??new DOMException("Telemetry stopped","AbortError")),u=setTimeout(()=>c(new Error(
"Telemetry provider deadline exceeded")),t);if(u.unref?.(),e.addEventListener("abort",l,{once:!0}),e.aborted){l();return}
Promise.resolve().then(()=>n(i.signal)).then(h=>a(r,h),h=>a(s,h))})}class B7{constructor(e,{now:t=Date.now}={}){this.manager=
e,this.now=t,this.providers=[],this.records=new Map,this.order=new Map,this.timer=null,this.controller=null,this.pending=
null,this.error=null,this.instanceId=globalThis.crypto.randomUUID(),this.sequence=0}get enabled(){return this.manager.config.
enableNetworkTelemetry!==!1}get publishing(){return this.enabled&&this.manager.config.networkTelemetryPublish!==!1}get provider(){
return this.providers.at(-1)?.provider??null}setProvider(e){if(e!==null&&typeof e!="function")throw new TypeError("Telem\
etry provider must be a function");if(e===null)return this.providers.length=0,()=>{};const t={provider:e};return this.providers.
push(t),()=>{const r=this.providers.indexOf(t);r!==-1&&this.providers.splice(r,1)}}start(){!this.enabled||this.controller||
(this.controller=new AbortController,this.publishing&&(this.publish(),this.timer=setInterval(()=>{this.publish()},Ve.intervalMs),
this.timer.unref?.()))}async stop(){clearInterval(this.timer),this.timer=null,this.controller?.abort(new DOMException("T\
elemetry stopped","AbortError")),await this.pending,this.controller=null,this.records.clear(),this.order.clear()}publish(){
if(this.pending)return this.pending;if(!this.publishing||!this.controller||this.controller.signal.aborted||!this.manager.
isConnected)return Promise.resolve();const e=this.controller.signal,t=(async()=>{try{const r=this.manager.libp2p?.services?.
pubsub;if(!r||r.globalSignaturePolicy==="StrictNoSign")throw new Error("Signed pubsub is required for network telemetry");
const s=this.provider,i=s?await ru(d=>s({signal:d}),e,Ve.providerTimeoutMs):{};let o=[],a=null;const c=this.manager.getPeerInferenceService?.();
if(c&&!c.closed)try{o=await ru(d=>c.getTelemetrySummary({signal:d}),e,Ve.providerTimeoutMs)}catch(d){if(e.aborted)throw d;
a="Hosted-model telemetry unavailable"}if(e.aborted||!this.manager.isConnected||s!==this.provider)return;const l=Em({...this.
manager.getTelemetrySnapshot(),application:i?.application||this.manager.config.gameId,role:i?.role,compute:i?.compute,...i?.
capabilities?{capabilities:i.capabilities}:{},...i?.hostGroupId?{hostGroupId:i.hostGroupId}:{},models:o,modelsStatus:a?"\
unavailable":"available",ts:this.now()});if(!l)return;const u={type:Sm,schema:Am,instanceId:this.instanceId,sequence:++this.
sequence,snapshot:l},h=T7.encode(JSON.stringify(u));if(h.byteLength>Ve.maximumBytes)throw new Error("Network telemetry e\
xceeds its byte limit");if(await ru(()=>r.publish(es,h),e,Ve.providerTimeoutMs),e.aborted||!this.manager.isConnected)return;
this._remember(l,this.now(),!0),this.error=a}catch(r){e.aborted||(this.error=String(r?.message??"Network telemetry unava\
ilable").slice(0,160))}})();return this.pending=t,t.finally(()=>{this.pending===t&&(this.pending=null)}),t}handlePubsubMessage(e){
if(e?.topic!==es)return!1;const t=e.data;if(!(t instanceof Uint8Array)||t.byteLength>Ve.maximumBytes)return!0;let r;try{
r=JSON.parse(D7.decode(t))}catch{return!0}if(r?.type!==Sm)return!1;if(!this.enabled||!this.controller||this.controller.signal.
aborted||e.type!=="signed")return!0;const s=e.from?.toString?.();if(!s||s===this.manager.peerId||s.length>128||r.schema!==
Am||r.snapshot?.peerId!==s||typeof r.instanceId!="string"||!/^[a-zA-Z0-9-]{1,64}$/.test(r.instanceId)||!Number.isSafeInteger(
r.sequence)||r.sequence<1)return!0;this.prune();const i=this.now(),o=this.order.get(s);if(o&&(i-o.receivedAt<Ve.minimumReceiveIntervalMs||
o.instanceId===r.instanceId&&r.sequence<=o.sequence||o.retired.includes(r.instanceId)))return!0;const a=Em(r.snapshot);if(!a)
return!0;const c=o?.retired??[];return o&&o.instanceId!==r.instanceId&&c.push(o.instanceId),this.order.set(s,{instanceId:r.
instanceId,sequence:r.sequence,receivedAt:i,retired:c.slice(-8)}),this.order.size>Ve.maximumReports&&this.order.delete(this.
order.keys().next().value),this._remember(a,i,!1),!0}_remember(e,t,r){for(this.records.delete(e.peerId),this.records.set(
e.peerId,{...e,receivedAt:t,local:r,authenticated:!0,provenance:"peer-reported"});this.records.size>Ve.maximumReports;)this.
records.delete(this.records.keys().next().value)}prune(){const e=this.now();for(const[t,r]of this.records)e-r.receivedAt>
Ve.expiryMs&&this.records.delete(t);for(const[t,r]of this.order)e-r.receivedAt>Ve.orderExpiryMs&&this.order.delete(t)}list(){
this.prune();const e=this.now();return[...this.records.values()].map(t=>({...structuredClone(t),stale:e-t.receivedAt>Ve.
staleMs}))}getStatus(){return this.prune(),{enabled:this.enabled,publishing:this.publishing&&!!this.controller,reportCount:this.
records.size,error:this.error}}}const z7=new Set(["1","true","yes","on"]);let zt=null;function V7(){if(typeof zt=="boole\
an")return zt;if(typeof globalThis<"u"&&typeof globalThis.__PC_DEBUG_OUTPUT__=="boolean")return zt=globalThis.__PC_DEBUG_OUTPUT__,
zt;if(typeof window>"u"||!window.location)return zt=!1,zt;try{const n=new URLSearchParams(window.location.search||""),e=String(
n.get("debugoutput")||"").trim().toLowerCase();zt=z7.has(e)}catch{zt=!1}return zt}const wa="/peercompute/direct/1.0.0",su=4*
1024*1024,q7=6e4,W7=3e4;function K7(n){const e=new Uint8Array(4+n.byteLength);return new DataView(e.buffer).setUint32(0,
n.byteLength,!1),e.set(n,4),e}async function G7(n,e){if(typeof n?.send=="function"){n.send(e)===!1&&typeof n.onDrain=="f\
unction"&&await n.onDrain();return}throw new Error("Direct unicast stream does not support send()")}const Cm="peercomput\
e-state-sync",xm="peercompute-direct",Im="peercompute-presence",H7="pc",iu=5e3,j7=8,Qo=1e4,Mm=600*1e3,Fv=1e4,Uv=15e3,X7=15e3,
Ih=1e4,Ov=3e4,Bv=15e3,zv=3e4,Vv=1500,qv=3e4,Wv=2500,ou=.15,au=5e3,Q7=1500,Y7=1e4,J7=Object.freeze(["/ipfs/id/1.0.0","/ip\
fs/id/push/1.0.0","/ipfs/ping/1.0.0","/peercompute/keepalive/1.0.0","/peercompute/direct/1.0.0","/meshsub/1.1.0","/meshs\
ub/1.0.0","/floodsub/1.0.0"]),Z7=16*1024,e9=["no_reservation","reservation","unexpected eof","remote closed connection d\
uring opening","stream has been reset","signal timed out","connection_failed","connection failed","user-initiated abort",
"cannot write to a stream that is closed","cannot write to a stream that is closing"],Pm=new TextEncoder,Tm=new TextDecoder;
async function Kv({privateKey:n,privateKeyProvider:e}={}){if(n!==void 0&&e!==void 0)throw new TypeError("Supply privateK\
ey or privateKeyProvider, not both");if(e!==void 0&&typeof e!="function")throw new TypeError("privateKeyProvider must be\
 a function");if(n===void 0&&e===void 0)return kS();const t=e===void 0?n:await e();if(!t)throw new TypeError("The config\
ured application identity is unavailable");return LS(t instanceof Uint8Array?t:ob(t))}const Kd=typeof __PC_DEBUG__<"u"&&
__PC_DEBUG__===!0,It=(...n)=>{Kd&&console.log(...n)},V=(...n)=>{Kd&&console.warn(...n)},Dm=n=>{if(!n||typeof n!="object"||
Array.isArray(n))return null;try{const e=JSON.stringify(n);if(!e||e.length>Z7)return null;const t=JSON.parse(e);return t&&
typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}},cu=n=>n?typeof n.byteLength=="number"?n.byteLength:typeof n.
length=="number"?n.length:0:0,ot=n=>n?typeof n=="string"?n:typeof n.toString=="function"?n.toString():String(n):"",Tt=n=>ot(
n).includes("/p2p-circuit"),Yt=n=>ot(n).includes("/webrtc"),ei=n=>Tt(n)&&!Yt(n),ti=n=>Tt(n)&&Yt(n),Yn=n=>!Tt(n),$m=n=>Yn(
n),Wn=n=>{const e=String(n||"").trim().toLowerCase();return e?e==="direct"?"direct":e==="relay-scoped"?"relay-scoped":null:
null},yn=n=>{const e=String(n||"").trim().toLowerCase();return e?e==="direct"?"direct":e==="turn-relay"||e==="relay"?"tu\
rn-relay":e==="unknown"?"unknown":null:null},Yo=n=>{const e=String(n||"").trim().toLowerCase();return e&&["lan-host","na\
t-srflx","nat-prflx","turn-relay","circuit-relay","direct-ws","direct-tcp"].includes(e)?e:null},t9=n=>{const e=n?.maConn?.
peerConnection||n?.peerConnection||null;return e&&typeof e.getStats=="function"?e:null},n9=(n,e)=>{const t=String(n||"").
trim().toLowerCase(),r=String(e||"").trim().toLowerCase();return!t&&!r?{icePath:null,mediaPath:null}:t==="relay"||r==="r\
elay"?{icePath:"turn-relay",mediaPath:"turn-relay"}:t==="host"&&r==="host"?{icePath:"lan-host",mediaPath:"direct"}:t==="\
prflx"||r==="prflx"?{icePath:"nat-prflx",mediaPath:"direct"}:t==="srflx"||r==="srflx"?{icePath:"nat-srflx",mediaPath:"di\
rect"}:t==="host"||r==="host"?{icePath:"lan-host",mediaPath:"direct"}:{icePath:null,mediaPath:null}},km=n=>{const e=ot(n);
if(!e)return null;if(ei(e))return"circuit-relay";if(!Tt(e)&&!Yt(e)){if(e.includes("/wss")||e.includes("/ws"))return"dire\
ct-ws";if(e.includes("/tcp/"))return"direct-tcp"}return null},Lm=n=>ti(n)?"relay-webrtc":Yt(n)?"webrtc":Tt(n)?"relay":"d\
irect",Gd=n=>String(n||"").trim().toLowerCase(),Rm=n=>{const e=Gd(n);return e==="direct"||e==="webrtc"||e==="webrtc-dire\
ct"},Jo=n=>{const e=Gd(n);return e==="relay"||e==="relay-webrtc"||e==="webrtc-relay"},Nm=n=>{const e=Gd(n);return e==="w\
ebrtc"||e==="webrtc-direct"||e==="direct"?{signalingPath:"direct",mediaPath:"direct"}:e==="relay"?{signalingPath:"relay-\
scoped",mediaPath:"turn-relay"}:e==="relay-webrtc"||e==="webrtc-relay"?{signalingPath:"relay-scoped",mediaPath:"unknown"}:
{signalingPath:null,mediaPath:null}},Gv=n=>Yt(n)&&Tt(n)?"webrtc-relay":Yt(n)?"webrtc-direct":Tt(n)?"relay":"direct",lu=n=>n.
map(e=>{const t=ot(e);return`${Gv(t)}:${t}`}),ee=n=>n?typeof n.status=="string"?n.status==="open":!(n?.stat?.timeline?.close||
n?.timeline?.close):!1,Zo=n=>{if(n instanceof Date)return n.getTime();if(Number.isFinite(n))return Number(n);if(n&&typeof n==
"object"){const e=n.timestamp??n.time??n.at??n.value;if(Number.isFinite(e))return Number(e);if(e instanceof Date)return e.
getTime()}return null},ea=n=>n?Zo(n?.stat?.timeline?.open)??Zo(n?.stat?.timeline?.open?.timestamp)??Zo(n?.timeline?.open)??
Zo(n?.timeline?.open?.timestamp)??null:null,r9=n=>{const e=String(n?.message||n||"").toLowerCase();return e?e9.some(t=>e.
includes(t)):!1},s9=n=>{if(!n)return"unknown";const e=typeof n=="string"?n:n?.message||n?.toString?.()||"";return e?e.toLowerCase().
includes("timeout")?`timeout (${e})`:e:"unknown"},i9=n=>{if(typeof n!="string")return null;const e=n.match(/candidate:\S+\s+\d+\s+(\w+)\s+\d+\s+([^\s]+)\s+(\d+)\s+typ\s+(\w+)/i);
return e?{protocol:e[1].toLowerCase(),address:`${e[2]}:${e[3]}`,type:e[4].toLowerCase()}:{type:"unknown",protocol:"",address:""}},
o9=(n,e)=>{const t=ot(n),r=t.includes("/p2p-circuit"),s=t.includes("/webrtc"),i=s&&!r?3:s?2:r?0:1,o=e&&t.includes("/ip6/")?
.1:0;return i+o},Fm=(n,e=!1)=>{const t=n.map((r,s)=>({addr:r,score:o9(r,e),index:s}));return t.sort((r,s)=>s.score-r.score||
r.index-s.index),t.map(r=>r.addr)},a9=(n,e)=>{if(!n||typeof n!="object")return n;const t=n.scoreParams;if(!t||typeof t!=
"object")return n;const r=t.topics;if(!r||typeof r!="object")return n;const s=r.__default;if(!s||typeof s!="object")return n;
const i={...r};return delete i.__default,e.filter(o=>typeof o=="string"&&o.length>0).forEach(o=>{i[o]||(i[o]={...s})}),{
...n,scoreParams:{...t,topics:i}}},c9=n=>{if(!n)return[];const e=Array.isArray(n)?n:[n],t=[];return e.forEach(r=>{if(!r)
return;if(typeof r=="string"){t.push({urls:r});return}if(typeof r!="object")return;const s=r.urls??r.url;if(!s)return;const i=Array.
isArray(s)?s.map(a=>String(a)).filter(Boolean):[String(s)];if(i.length===0)return;const o={...r,urls:Array.isArray(s)?i:
i[0]};t.push(o)}),t},l9=n=>{if(!n)return null;if(n===!0)return{mode:"logn",min:1,max:null,base:2};if(n===!1||typeof n!="\
object")return null;const e=n.mode??n.strategy??"logn",t=String(e).trim().toLowerCase();if(t==="none"||t==="off"||t==="d\
isabled"||t!=="logn"&&t!=="log(n)"&&t!=="sqrt")return null;const r=Number.isFinite(n.min)?Math.max(0,n.min):1,s=Number.isFinite(
n.max)?Math.max(r,n.max):null,i=Number.isFinite(n.base)?Math.max(2,n.base):2;return{mode:t==="log(n)"?"logn":t,min:r,max:s,
base:i}},u9=(n={})=>{const e=n&&typeof n.webrtc=="object"&&n.webrtc?n.webrtc:{},t=e.preferDirect??n.preferDirect??!0,r=e.
dropRelayOnDirect??n.dropRelayOnDirect??!0,s=e.dropRelayBootstrapOnDirect??n.dropRelayBootstrapOnDirect??!0,i=e.countRelayWebrtcAsDirectCapable??
n.countRelayWebrtcAsDirectCapable??!0,o=l9(e.relayRetention??n.relayRetention??!0),a=e.reconnectOnDialFailure??n.reconnectOnDialFailure??
!0,c=Number.isFinite(e.reconnectThrottleMs)?Math.max(5e3,e.reconnectThrottleMs):Number.isFinite(n.reconnectThrottleMs)?Math.
max(5e3,n.reconnectThrottleMs):3e4,l=Number.isFinite(e.autoDropRelayAfterDialMs)?Math.max(0,e.autoDropRelayAfterDialMs):
Number.isFinite(n.autoDropRelayAfterDialMs)?Math.max(0,n.autoDropRelayAfterDialMs):6e4,u=e.enableRelayAssist??n.enableRelayAssist??
!0,h=Number.isFinite(e.relayAssistRequestThrottleMs)?Math.max(1e3,e.relayAssistRequestThrottleMs):Number.isFinite(n.relayAssistRequestThrottleMs)?
Math.max(1e3,n.relayAssistRequestThrottleMs):Fv,d=Number.isFinite(e.relayAssistReadyTimeoutMs)?Math.max(1e3,e.relayAssistReadyTimeoutMs):
Number.isFinite(n.relayAssistReadyTimeoutMs)?Math.max(1e3,n.relayAssistReadyTimeoutMs):Uv,p=Number.isFinite(e.relayDropMinDirectMs)?
Math.max(0,e.relayDropMinDirectMs):Number.isFinite(n.relayDropMinDirectMs)?Math.max(0,n.relayDropMinDirectMs):X7,v=Number.
isFinite(e.directUpgradeGraceMs)?Math.max(0,e.directUpgradeGraceMs):Number.isFinite(n.directUpgradeGraceMs)?Math.max(0,n.
directUpgradeGraceMs):Ih,g=Number.isFinite(e.relayBootstrapMinHoldMs)?Math.max(0,e.relayBootstrapMinHoldMs):Number.isFinite(
n.relayBootstrapMinHoldMs)?Math.max(0,n.relayBootstrapMinHoldMs):Ov,E=Number.isFinite(e.relayPostDirectHoldMs)?Math.max(
0,e.relayPostDirectHoldMs):Number.isFinite(n.relayPostDirectHoldMs)?Math.max(0,n.relayPostDirectHoldMs):Bv,f=Number.isFinite(
e.relayElectionStickyMs)?Math.max(0,e.relayElectionStickyMs):Number.isFinite(n.relayElectionStickyMs)?Math.max(0,n.relayElectionStickyMs):
zv,b=Number.isFinite(e.dialFailureBackoffBaseMs)?Math.max(250,e.dialFailureBackoffBaseMs):Number.isFinite(n.dialFailureBackoffBaseMs)?
Math.max(250,n.dialFailureBackoffBaseMs):Vv,_=Number.isFinite(e.dialFailureBackoffMaxMs)?Math.max(b,e.dialFailureBackoffMaxMs):
Number.isFinite(n.dialFailureBackoffMaxMs)?Math.max(b,n.dialFailureBackoffMaxMs):qv,m=Number.isFinite(e.dialGlareTieBreakMs)?
Math.max(0,e.dialGlareTieBreakMs):Number.isFinite(n.dialGlareTieBreakMs)?Math.max(0,n.dialGlareTieBreakMs):Wv,y=c9(e.iceServers??
n.iceServers??n.webrtcIceServers),A=e.rtcConfiguration??n.rtcConfiguration??{},w=A&&typeof A=="object"?{...A}:{};return y.
length>0&&(w.iceServers=y),{...e,preferDirect:t,dropRelayOnDirect:r,dropRelayBootstrapOnDirect:s,countRelayWebrtcAsDirectCapable:i,
relayRetention:o,reconnectOnDialFailure:a,reconnectThrottleMs:c,autoDropRelayAfterDialMs:l,enableRelayAssist:u,relayAssistRequestThrottleMs:h,
relayAssistReadyTimeoutMs:d,relayDropMinDirectMs:p,directUpgradeGraceMs:v,relayBootstrapMinHoldMs:g,relayPostDirectHoldMs:E,
relayElectionStickyMs:f,dialFailureBackoffBaseMs:b,dialFailureBackoffMaxMs:_,dialGlareTieBreakMs:m,iceServers:y,rtcConfiguration:w}},
h9=n=>typeof n!="string"?!1:n.includes("/dns4/localhost")||n.includes("/dns/localhost")||n.includes("/ip6/::1")||n.includes(
"/ip4/127.")||n.includes("/ip4/10.")||n.includes("/ip4/192.168.")?!0:/\/ip4\/172\.(1[6-9]|2\d|3[01])\./.test(n),wn=n=>{if(typeof n!=
"string")return n;const e=n.split("/p2p/");if(e.length<=2)return n;const t=e[e.length-1];return`${e[0]}/p2p/${t}`},ta=n=>{
if(typeof n!="string")return null;const e=n.split("/p2p/");return e.length<2?null:e[e.length-1]||null},na=n=>{if(!n)return null;
if(typeof n.getComponents=="function")return n;if(typeof n!="string")return null;try{return O(n)}catch(e){return V("[Net\
workManager] Invalid peer multiaddr",n,e?.message||e),null}},d9=n=>{if(!n)return null;if(typeof n.getComponents=="functi\
on")return n;if(typeof n!="string")return null;const e=wn(n);try{return O(e)}catch(t){return V("[NetworkManager] Invalid\
 bootstrap multiaddr",e,t?.message||t),null}},uu=(n,e)=>{if(!e||typeof n!="string")return n;const t=`/p2p/${e}`;return n.
includes(t)?n:`${n}${t}`},Ks=(n,e,t,r)=>`${[n,e,t].filter(Boolean).join(".")}.${r}`,Um=n=>{if(!n)return[];const t=(Array.
isArray(n)?n:[n]).map(r=>String(r||"").trim()).filter(Boolean);return Array.from(new Set(t))},f9=n=>{if(n===En.FATAL_ALL||
n===En.NO_FATAL)return n;if(n==null)return;const e=String(n).trim().toLowerCase();if(e==="fatal_all"||e==="fatal-all"||e===
"fatalall")return En.FATAL_ALL;if(e==="no_fatal"||e==="no-fatal"||e==="nofatal")return En.NO_FATAL},p9=n=>{if(!n||typeof n!=
"object")return null;const e={...n},t=f9(e.faultTolerance);return t!==void 0?e.faultTolerance=t:"faultTolerance"in e&&delete e.
faultTolerance,Object.keys(e).length>0?e:null};class g9{constructor(e={}){const t=u9(e),r=e.roomId||"default-room",s=r===
"__rooms__",i=Number.isFinite(e.telemetrySampleMs)?Math.max(250,e.telemetrySampleMs):1e3,o=Number.isFinite(e.telemetryPingMs)?
Math.max(500,e.telemetryPingMs):5e3,a=Number.isFinite(e.presenceIntervalMs)?Math.max(1e3,e.presenceIntervalMs):3e3,c=Number.
isFinite(e.maxConnections)?Math.max(1,e.maxConnections):s?2:4,l=Number.isFinite(e.transportConnectionHeadroom)?Math.max(
0,Math.trunc(e.transportConnectionHeadroom)):3,u=Number.isFinite(e.transportMaxConnections)?Math.max(1,Math.trunc(e.transportMaxConnections)):
void 0,h=Number.isFinite(e.maxIncomingPendingConnections)?Math.max(1,e.maxIncomingPendingConnections):100,d=Number.isFinite(
e.maxParallelDials)?Math.max(1,e.maxParallelDials):void 0,p=Number.isFinite(e.maxDialQueueLength)?Math.max(1,e.maxDialQueueLength):
void 0,v=Number.isFinite(e.maxPeerAddrsToDial)?Math.max(1,e.maxPeerAddrsToDial):void 0,g=Number.isFinite(e.dialTimeoutMs)?
Math.max(1e3,e.dialTimeoutMs):Number.isFinite(e.dialTimeout)?Math.max(1e3,e.dialTimeout):void 0,E=(()=>{const re=e.maxDialPeers;
return re===null||re===1/0?null:Number.isFinite(re)?Math.max(0,re):s?4:j7})(),f=Number.isFinite(e.bootstrapDialThrottleMs)?
Math.max(0,e.bootstrapDialThrottleMs):iu,b=typeof e.pubsubType=="string"?e.pubsubType:typeof e.pubsub=="string"?e.pubsub:
"",_=String(b||"floodsub").trim().toLowerCase()==="gossipsub"?"gossipsub":"floodsub",m=e.gossipsub&&typeof e.gossipsub==
"object"?{...e.gossipsub}:null,y=e.pubsubPeerDiscovery??e.enablePubsubPeerDiscovery??void 0,A=e.topologyType||e.topology||
"distributed",w=e.topologyId||e.topologyKey||e.topologyName||e.gameId||"default-topology",S=e.topicPrefix||e.topicBase||
H7,x=e.useScopedTopics!==!1,C=Ks(S,w,r,"state"),I=Ks(S,w,r,"direct"),M=Ks(S,w,r,"presence"),k=e.discoveryTopic||"peercom\
pute._peer-discovery._p2p._pubsub",$=Um(e.additionalPubsubTopics);e.enableNetworkTelemetry!==!1&&!$.includes(es)&&$.push(
es);const F=a9(m,[e.pubsubTopic||(x?C:Cm),e.directTopic||(x?I:xm),e.presenceTopic||(x?M:Im),k,...$]),P={topology:A,topologyId:w,
topicPrefix:S,useScopedTopics:x,pubsubTopic:e.pubsubTopic||(x?C:Cm),directTopic:e.directTopic||(x?I:xm),presenceTopic:e.
presenceTopic||(x?M:Im),additionalPubsubTopics:$,discoveryTopic:k,bootstrapPeers:Array.isArray(e.bootstrapPeers)?e.bootstrapPeers:
[],gameId:e.gameId||"default-game",roomId:r,enforceRoomIsolation:e.enforceRoomIsolation!==!1,allowDiscoveryDialWhenIsolated:e.
allowDiscoveryDialWhenIsolated===!0,enforceTopologyScope:e.enforceTopologyScope!==!1,enableTelemetry:e.enableTelemetry!==
!1,enableNetworkTelemetry:e.enableNetworkTelemetry!==!1,networkTelemetryPublish:e.networkTelemetryPublish!==!1,enableTopologyController:e.
enableTopologyController!==!1,enableRelayDirectPeers:e.enableRelayDirectPeers===!0,topologyTickMs:Number.isFinite(e.topologyTickMs)?
Math.max(250,e.topologyTickMs):1500,throughputTopology:e.throughputTopology&&typeof e.throughputTopology=="object"?{...e.
throughputTopology}:{},throughputSignal:e.throughputSignal==="bytes"?"bytes":"work",targetConnections:Number.isFinite(e.
targetConnections)?Math.max(1,e.targetConnections):s?1:Math.min(c,3),connectionRadius:Number.isFinite(e.connectionRadius)?
Math.max(0,e.connectionRadius):s?0:1,isolationMinConnections:Number.isFinite(e.isolationMinConnections)?Math.max(1,e.isolationMinConnections):
s?1:2,longRangeCount:Number.isFinite(e.longRangeCount)?Math.max(0,e.longRangeCount):s?0:1,longRangeRefreshMs:Number.isFinite(
e.longRangeRefreshMs)?Math.max(1e3,e.longRangeRefreshMs):15e3,enableSharding:e.enableSharding===!0,shardSize:Number.isFinite(
e.shardSize)?Math.max(1,e.shardSize):8,shardRadius:Number.isFinite(e.shardRadius)?Math.max(0,e.shardRadius):1,webrtc:t,telemetrySampleMs:i,
telemetryPingMs:o,presenceIntervalMs:a,maxConnections:c,transportConnectionHeadroom:l,transportMaxConnections:u,maxIncomingPendingConnections:h,
maxParallelDials:d,maxDialQueueLength:p,maxPeerAddrsToDial:v,dialTimeoutMs:g,maxDialPeers:E,bootstrapDialThrottleMs:f,pubsubType:_,
gossipsub:F,pubsubPeerDiscovery:y,enablePeerDirectory:e.enablePeerDirectory!==!1,directoryTopic:e.directoryTopic||"peerc\
ompute-directory",directoryQueryTimeoutMs:Number.isFinite(e.directoryQueryTimeoutMs)?Math.max(250,e.directoryQueryTimeoutMs):
Q7,swapHysteresisRatio:Number.isFinite(e.swapHysteresisRatio)?Math.min(.9,Math.max(0,e.swapHysteresisRatio)):ou,maxZeroConnBoost:Number.
isFinite(e.maxZeroConnBoost)?Math.max(0,Math.trunc(e.maxZeroConnBoost)):1,iceStatsIntervalMs:Number.isFinite(e.iceStatsIntervalMs)?
Math.max(1e3,e.iceStatsIntervalMs):au,enableDirectUnicastStream:e.enableDirectUnicastStream!==!1,directStreamMaxBytes:Number.
isFinite(e.directStreamMaxBytes)?Math.max(65536,Math.trunc(e.directStreamMaxBytes)):su,preferLocalRelay:e.preferLocalRelay!==
!1,presenceCapabilitiesProvider:typeof e.presenceCapabilitiesProvider=="function"?e.presenceCapabilitiesProvider:null,onPublishError:typeof e.
onPublishError=="function"?e.onPublishError:null,onPublishSuccess:typeof e.onPublishSuccess=="function"?e.onPublishSuccess:
null},D=P.bootstrapPeers.map(re=>typeof re=="string"?wn(re):re),U=e.allowLocalDial??D.some(h9),T=p9(e.transportManager),
N=Object.fromEntries(Object.entries(e).filter(([,re])=>re!==void 0));this.config={...P,...N,additionalPubsubTopics:Um(N.
additionalPubsubTopics??P.additionalPubsubTopics),bootstrapPeers:D,allowLocalDial:U,webrtc:t,transportManager:T},this.debugOutput=
typeof this.config.debugOutput=="boolean"?this.config.debugOutput:V7(),this.config.enableNetworkTelemetry!==!1&&!this.config.
additionalPubsubTopics.includes(es)&&this.config.additionalPubsubTopics.push(es),this.networkTelemetryService=new B7(this),
this.bootstrapPeerIds=new Set(D.map(ta).filter(Boolean)),this.libp2p=null,this.artifactTransport=null,this.artifactDiscovery=
null,this.artifactStarting=null,this.artifactPendingStore=null,this.artifactStopping=null,this.peerInferenceService=null,
this.peerInferenceStarting=null,this.peerInferenceOwner=null,this.peerInferenceStopping=null,this._applicationPrivateKey=
null,this.peerId=null,this.isConnected=!1,this.connectionGeneration=0,this.schedulerReconnect=null,this.joinedAt=null,this.
presenceInterval=null,this.publishErrorAt=new Map,this.pubsubStreamErrorAt=new Map,this.lastBootstrapDialAt=0,this.isolationReconnectTimer=
null,this.lastWebrtcAnnounceWarnAt=0,this.relayBootstrapConnectedAt=null,this.relayKeeperUntil=0,this.firstDirectUpgradeAt=
null,this.relayTransport=null,this.relayReservationPeers=new Set,this.relayPruneTimers=new Map,this.peerDialAddrCache=new Map,
this.peerDialBackoff=new Map,this.connectionIceStats=new WeakMap,this.intentionalCloseUntil=new Map,this.topologyRewireTimestamps=
[],this.dialFailureCount=0,this.lastDialFailureAt=null,this.directUnicastStreams=new Map,this.directStreamUnsupportedPeers=
new Map,this.bootstrapRelayHealth=new Map,this.topicHandlers=new Map,this.peers=new Map,this.recentDialAttempts=new Map,
this.relayReconnectState={lastReconnectAt:0,pendingDialsNeedingRelay:new Set,autoDisconnectTimer:null},this.relayAssistState=
{lastRequestAt:new Map,pendingReadyTimeouts:new Map,inboundRequestAt:new Map},this.pendingDirectoryQueries=new Map,this.
telemetry={rxCount:0,txCount:0,rxBytes:0,txBytes:0,rxBps:0,txBps:0,pubsubRxCount:0,pubsubTxCount:0,pubsubRxBytes:0,pubsubTxBytes:0,
pubsubLastRxAt:0,pubsubLastTxAt:0},this.telemetrySample={rxBytes:0,txBytes:0,at:0},this.telemetryTimer=null,this.onMessage=
e.onMessage||(()=>{}),this.onPeerConnect=e.onPeerConnect||(()=>{}),this.onPeerDisconnect=e.onPeerDisconnect||(()=>{}),this.
onConnectionFailure=typeof e.onConnectionFailure=="function"?e.onConnectionFailure:null,this.messageHandlers=[],this.additionalPubsubTopics=
new Set(this.config.additionalPubsubTopics||[]),this.scheduler=null,this.schedulerTimer=null,this.schedulerEnabled=e.enableScheduler||
!1,this.schedulerClock=e.schedulerClock||"internal",this.schedulerProfile={...Qn,...e.schedulerProfile||{}},this.authorityId=
e.authorityId||null,this.lastRxAt=0,this.lastTxAt=0,this.allowedTopics=new Set([this.config.pubsubTopic,this.config.directTopic,
this.config.presenceTopic]),this.additionalPubsubTopics.forEach(re=>this.allowedTopics.add(re)),this.config.enablePeerDirectory&&
this.allowedTopics.add(this.config.directoryTopic),[this.schedulerProfile.snapshotTopic,this.schedulerProfile.commandTopic,
this.schedulerProfile.eventTopic].filter(Boolean).forEach(re=>this.allowedTopics.add(re));const G=e.topologyMetric!==void 0||
e.metric!==void 0,X=e.topologyMetric||e.metric||null;this.topologyMetric=X&&typeof X=="object"?{x:X.x||0,y:X.y||0,z:X.z||
0}:{x:0,y:0,z:0},this.metricInitialized=e.topologyMetricInitialized??e.metricInitialized??G,this.topologyShardId=null,this.
shardTopics=new Set,this.pendingTopologyRequests=new Map,this.pendingTopologyAccepts=new Map,this.pendingPeerDials=new Map,
this.publishBlockedUntil=new Map,this.peerWork=new Map,this.topologyLinkReleasers=new Set,this.throughputPendingLinks=new Map,
this.staticTopologyPeers=null,this.throughputTopologyState=I7(),this.topologyController=this.config.enableTopologyController?
new S7({topologyId:this.config.topologyId,topologyType:this.config.topology,targetConnections:this.config.targetConnections,
maxConnections:this.config.maxConnections,connectionRadius:this.config.connectionRadius,isolationMinConnections:this.config.
isolationMinConnections,longRangeCount:this.config.longRangeCount,longRangeRefreshMs:this.config.longRangeRefreshMs,shardSize:this.
config.shardSize,shardRadius:this.config.shardRadius,swapHysteresisRatio:this.config.swapHysteresisRatio,maxZeroConnBoost:this.
config.maxZeroConnBoost,enforceTopologyScope:this.config.enforceTopologyScope,metric:this.topologyMetric}):null,this.topologyTimer=
null}addMessageHandler(e){this.messageHandlers.push(e)}_infoLog(...e){this.debugOutput&&console.info(...e)}configureScheduler(e={}){
this.schedulerProfile={...this.schedulerProfile,...e},[this.schedulerProfile.snapshotTopic,this.schedulerProfile.commandTopic,
this.schedulerProfile.eventTopic].filter(Boolean).forEach(t=>this.allowedTopics.add(t)),this.schedulerEnabled=!0,this._ensureScheduler(),
this.scheduler.configure(this.schedulerProfile),this._startScheduler()}setSchedulerClock(e="internal"){const t=e==="exte\
rnal"?"external":"internal";if(this.schedulerClock!==t){if(this.schedulerClock=t,t==="external"){this._stopScheduler();return}
this.schedulerEnabled&&this.isConnected&&this._startScheduler()}}getSchedulerClock(){return this.schedulerClock}tickScheduler(e=Date.
now()){!this.scheduler||!this.schedulerEnabled||this.scheduler.tick(e)}getSchedulerProfile(){return this.scheduler?this.
scheduler.getProfile():{...this.schedulerProfile}}registerStateProvider(e,t={}){return this._ensureScheduler(),this.schedulerEnabled=
!0,this._startScheduler(),this.scheduler.registerStateProvider(e,t)}registerWarmDeltaProvider(e,t={}){const r=t.id||"war\
m-deltas";return this.registerStateProvider(()=>e(),{...t,id:r})}registerCommandProvider(e,t={}){return this._ensureScheduler(),
this.schedulerEnabled=!0,this._startScheduler(),this.scheduler.registerCommandProvider(e,t)}unregisterStateProvider(e){this.
scheduler?.unregisterStateProvider(e)}unregisterCommandProvider(e){this.scheduler?.unregisterCommandProvider(e)}markStateDirty(){
this.scheduler?.markStateDirty()}queueEvent(e,t={}){this._ensureScheduler(),this.schedulerEnabled=!0,this._startScheduler();
const r=Object.prototype.hasOwnProperty.call(t,"reliable")||Object.prototype.hasOwnProperty.call(t,"critical");let s=t;if(!r&&
e?.type){const i=this.scheduler?.getProfile?.()||this.schedulerProfile;Array.isArray(i.reliableEventTypes)&&i.reliableEventTypes.
includes(e.type)&&(s={...t,reliable:!0})}this.scheduler.queueEvent(e,s)}addSnapshotHandler(e){this._ensureScheduler(),this.
scheduler.addSnapshotHandler(e)}addCommandHandler(e){this._ensureScheduler(),this.scheduler.addCommandHandler(e)}addEventHandler(e){
this._ensureScheduler(),this.scheduler.addEventHandler(e)}setAuthority(e){this.authorityId=e||null,this.scheduler&&this.
scheduler.setAuthority(this.authorityId)}getAuthority(){return this.authorityId}getHealth(){const e=this.scheduler?.getReliabilityStats?.();
return{lastRxAt:this.lastRxAt,lastTxAt:this.lastTxAt,peerCount:this.getConnectedPeers().length,pubsubPeers:this.libp2p?.
services?.pubsub?.getPeers?.()||[],reliability:e}}async initialize(){const e=typeof window<"u";let t;if(e){const d=(this.
config.bootstrapPeers||[]).filter(p=>typeof p=="string"&&p.includes("/p2p/")).map(p=>`${wn(p)}/p2p-circuit`);t=d.length>
0?[...d,"/webrtc"]:["/p2p-circuit","/webrtc"]}else t=["/ip4/0.0.0.0/tcp/0"];const r=this.config.pubsubType==="gossipsub",
s=[];this.config.bootstrapPeers?.length&&s.push(u7({list:this.config.bootstrapPeers})),this.config.pubsubPeerDiscovery!==
!1&&s.push(f7({interval:1e3,topics:[this.config.discoveryTopic]}));const i=this.config.webrtc?.rtcConfiguration||{},o=Object.
keys(i).length>0?fg({rtcConfiguration:i}):fg(),a=EF();this.relayTransport=a;const c=await Kv(this.config);this._applicationPrivateKey=
c;const l={minConnections:0,maxConnections:this._getTransportMaxConnections(this.config.maxConnections??4),inboundConnectionThreshold:1/0,
maxIncomingPendingConnections:this.config.maxIncomingPendingConnections??100};Number.isFinite(this.config.maxParallelDials)&&
(l.maxParallelDials=Math.max(1,this.config.maxParallelDials)),Number.isFinite(this.config.maxDialQueueLength)&&(l.maxDialQueueLength=
Math.max(1,this.config.maxDialQueueLength)),Number.isFinite(this.config.maxPeerAddrsToDial)&&(l.maxPeerAddrsToDial=Math.
max(1,this.config.maxPeerAddrsToDial));const u=Number.isFinite(this.config.dialTimeoutMs)?Math.max(1e3,this.config.dialTimeoutMs):
Number.isFinite(this.config.dialTimeout)?Math.max(1e3,this.config.dialTimeout):null,h=this.config.transportManager&&typeof this.
config.transportManager=="object"?{...this.config.transportManager}:null;u&&(l.dialTimeout=u);try{this.libp2p=await bL({
...c?{privateKey:c}:{},transports:[q6(),o,a],connectionEncrypters:[zF(),WF()],streamMuxers:[a5()],peerDiscovery:s,services:{
identify:Nz(),ping:i7({interval:1e4}),pubsub:this._buildPubsubService()},connectionManager:l,connectionMonitor:{abortConnectionOnPingFailure:!1},
...h?{transportManager:h}:{},addresses:{listen:t},start:!1,...this.config.allowLocalDial?{connectionGater:{denyDialMultiaddr:()=>!1}}:
{}})}catch(d){throw this._emitConnectionFailure({source:"libp2p",stage:"init",error:d}),V("[NetworkManager] Libp2p init \
failed",d?.message||d),d}return r&&c&&this.libp2p?.peerId&&(this.libp2p.peerId.privateKey=ob(c),this.libp2p.peerId.publicKey=
$r(c.publicKey)),this._wireLibp2pEvents(),this._patchGossipsubOutboundStreams(),this._refreshRelayTransport(),this.libp2p}async connect(){
if(this.isConnected)return;if(this.peerConnectionRecovery?.closed&&(this.peerConnectionRecovery=null),!this.libp2p)throw new Error(
"NetworkManager not initialized");this.connectionGeneration++;try{await this.libp2p.start()}catch(t){throw this._emitConnectionFailure(
{source:"libp2p",stage:"start",error:t}),V("[NetworkManager] Libp2p start failed",t?.message||t),t}this._refreshRelayTransport(),
this.peerId=this.libp2p.peerId.toString(),this.joinedAt||(this.joinedAt=Date.now()),this.topologyController&&this.topologyController.
setPeerId(this.peerId),this._updateShardState(!0);const e=t=>{try{this.libp2p.services.pubsub.subscribe(t)}catch(r){this.
_emitConnectionFailure({source:"pubsub",stage:"subscribe",address:t,error:r}),V("[NetworkManager] Pubsub subscribe faile\
d",t,r?.message||r)}};e(this.config.pubsubTopic),e(this.config.directTopic),e(this.config.presenceTopic),this.config.enablePeerDirectory&&
this.config.directoryTopic&&e(this.config.directoryTopic),this.additionalPubsubTopics.forEach(t=>e(t)),this._syncShardSubscriptions(
this.topologyController?.getNeighborShardIds?.()||[]),this._recordPubsubTx(0),await this._registerDirectUnicastHandler(),
await this._dialBootstrapPeers(),await this._reserveBootstrapRelayAddrs(),await this._logLocalAnnounceAddrs("post-bootst\
rap"),setTimeout(()=>{this._logLocalAnnounceAddrs("post-bootstrap+2s").catch(()=>{})},2e3),this._startPresence(),this._logPubsubStatus(
"connected"),this.isConnected=!0,this._sampleTelemetry(Date.now()),this._startTelemetrySampler(),this.schedulerEnabled&&
(this._ensureScheduler(),this._startScheduler()),this._startTopologyController(),this.networkTelemetryService.start()}_refreshRelayTransport(){
const e=this.libp2p?.components?.transportManager;if(!e?.getTransports)return;const t=e.getTransports(),i=(Array.isArray(
t)?t:t?.values?Array.from(t.values()):[]).map(o=>o?.transport||o).filter(Boolean).find(o=>!!(o?.reservationStore||o?.[Symbol.
toStringTag]==="@libp2p/circuit-relay-v2-transport"));i&&(this.relayTransport=i)}async redialBootstrapPeers(){const e=this.
libp2p,t=this.connectionGeneration;if(!e)return;const r=()=>e===this.libp2p&&t===this.connectionGeneration;await this._dialBootstrapPeers(),
r()&&(await this._reserveBootstrapRelayAddrs(),r()&&await this._logLocalAnnounceAddrs("redial-bootstrap"))}_getPeerConnectionRecovery(){
return this.peerConnectionRecovery??=new P7(this)}recoverPeerInferenceConnection(e,t){return this._getPeerConnectionRecovery().
recover(e,t)}retainPeerInferenceConnection(e,t){return this._getPeerConnectionRecovery().retain(e,t)}async disconnect(){
if(this.connectionGeneration++,this.schedulerReconnect=null,this.isConnected=!1,this._stopScheduler(),this._clearPresenceTimer(),
await this.networkTelemetryService.stop(),await this._stopPeerInferenceService(),await this.peerConnectionRecovery?.stop(),
await this._stopArtifactTransport(),this.isolationReconnectTimer&&(clearTimeout(this.isolationReconnectTimer),this.isolationReconnectTimer=
null),this._stopTelemetrySampler(),this._stopTopologyController(),this.relayReconnectState?.autoDisconnectTimer&&(clearTimeout(
this.relayReconnectState.autoDisconnectTimer),this.relayReconnectState.autoDisconnectTimer=null),this.relayPruneTimers?.
size&&(this.relayPruneTimers.forEach(e=>clearTimeout(e)),this.relayPruneTimers.clear()),this.pendingDirectoryQueries?.size){
for(const e of this.pendingDirectoryQueries.values()){clearTimeout(e.timeout);try{e.resolve(null)}catch{}}this.pendingDirectoryQueries.
clear()}if(this.intentionalCloseUntil.clear(),this.topologyRewireTimestamps=[],this._closeAllDirectUnicastStreams(),this.
directStreamUnsupportedPeers.clear(),this.libp2p?.unhandle)try{await this.libp2p.unhandle(wa)}catch{}this.libp2p&&await this.
libp2p.stop(),this.peers.clear(),this.pendingTopologyRequests.clear(),this.pendingTopologyAccepts.clear(),this.pendingPeerDials.
clear(),this._clearRelayAssistState(),this.relayReservationPeers.clear(),this.firstDirectUpgradeAt=null,this.peerId=null}async createArtifactTransport(e,t={}){
if(this.artifactStopping&&await this.artifactStopping,this.artifactTransport){if(this.artifactTransport.store!==e)throw new Error(
"Artifact transport already owns a different store");if(this.artifactTransport.requiresCleanup)throw new Error("Artifact\
 transport cleanup must succeed before restarting");return this.artifactTransport}if(this.artifactStarting){if(this.artifactPendingStore!==
e)throw new Error("Artifact transport is starting with a different store");return this.artifactStarting}if(!this.libp2p||
!this._applicationPrivateKey)throw new Error("Initialize NetworkManager before enabling artifacts");this.artifactPendingStore=
e,this.artifactStarting=(async()=>{const[{IpfsArtifactTransport:r},{ArtifactProviderDiscovery:s}]=await Promise.all([jc(
()=>import("./IpfsArtifactTransport-D8IQLqOX.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),jc(()=>import("./ArtifactProviderRecord-BAxGrAux.js"),
__vite__mapDeps([4,1,2,3]),import.meta.url)]),i=new r({store:e,relayAddresses:this.config.bootstrapPeers||[],rtcConfiguration:{iceServers:[],
...this.config.webrtc?.rtcConfiguration},allowInsecureLocalConnections:this.config.allowLocalDial===!0,...t,store:e});i.
setPublicBlockCids([]);let o;try{return await i.start(),o=new s(this,i,e,t.discovery),await o.start(),this.artifactTransport=
i,this.artifactDiscovery=o,i}catch(a){await o?.stop().catch(()=>{});try{await i.stop()}catch(c){throw this.artifactTransport=
i,this.artifactDiscovery=o??null,new AggregateError([a,c],"Artifact transport startup cleanup failed")}throw a}})();try{
return await this.artifactStarting}finally{this.artifactStarting=null,this.artifactPendingStore=null}}getArtifactTransport(){
return this.artifactTransport}getNetworkTelemetryService(){return this.networkTelemetryService}setNetworkTelemetryProvider(e){
return this.networkTelemetryService.setProvider(e)}getPublishedArtifactCids(){return[...this.artifactDiscovery?.publicArtifacts??
[]].slice(0,128)}async createPeerInferenceService(e={}){this.peerInferenceStopping&&await this.peerInferenceStopping;const t=e.
owner??Symbol("peer-inference-owner");if(this.peerInferenceService||this.peerInferenceStarting){if(this.peerInferenceOwner!==
t)throw new Error("Peer inference service already belongs to another owner");if(this.peerInferenceService?.closed)throw new Error(
"Peer inference service cleanup must succeed before restarting");return this.peerInferenceService??this.peerInferenceStarting}
if(!this.libp2p||!this.isConnected)throw new Error("Connect NetworkManager before enabling peer inference");this.peerInferenceOwner=
t,this.peerInferenceStarting=(async()=>{const{PeerInferenceService:r}=await jc(async()=>{const{PeerInferenceService:i}=await import("./PeerInferenceService-BV7U6-l0.js");
return{PeerInferenceService:i}},__vite__mapDeps([5,1,2,3]),import.meta.url),s=new r(this,{...e,owner:t});try{return await s.start(),
this.peerInferenceService=s,s}catch(i){try{await s.stop()}catch(o){throw this.peerInferenceService=s,new AggregateError(
[i,o],"Peer inference startup cleanup failed")}throw this.peerInferenceOwner=null,i}})();try{return await this.peerInferenceStarting}finally{
this.peerInferenceStarting=null}}getPeerInferenceService(){return this.peerInferenceService}async releasePeerInferenceService(e){
return this.peerInferenceOwner!==e?!1:(await this._stopPeerInferenceService(),!0)}async _stopPeerInferenceService(){if(this.
peerInferenceStopping)return this.peerInferenceStopping;this.peerInferenceStopping=(async()=>{this.peerInferenceStarting&&
await this.peerInferenceStarting.catch(()=>{}),await this.peerInferenceService?.stop(),this.peerInferenceService=null,this.
peerInferenceOwner=null})();try{await this.peerInferenceStopping}finally{this.peerInferenceStopping=null}}async announceArtifact(e){
if(!this.artifactDiscovery)throw new Error("Artifact transport is not enabled");return this.artifactDiscovery.announce(e)}async findArtifactProviders(e,t){
if(!this.artifactDiscovery)throw new Error("Artifact transport is not enabled");return this.artifactDiscovery.find(e,t)}async withdrawArtifact(e){
if(!this.artifactDiscovery)throw new Error("Artifact transport is not enabled");return this.artifactDiscovery.withdraw(e)}async fetchArtifactBlock(e,t){
if(!this.artifactDiscovery)throw new Error("Artifact transport is not enabled");return this.artifactDiscovery.fetchBlock(
e,t)}async _stopArtifactTransport(){if(this.artifactStopping)return this.artifactStopping;this.artifactStopping=(async()=>{
this.artifactStarting&&await this.artifactStarting.catch(()=>{});try{await this.artifactDiscovery?.stop()}finally{this.artifactDiscovery=
null,await this.artifactTransport?.stop(),this.artifactTransport=null}})();try{await this.artifactStopping}finally{this.
artifactStopping=null}}async sendToPeer(e,t){const r=this._wrapPayload(t,{target:e});this.config.enableDirectUnicastStream&&
e&&e!==this.peerId&&this.libp2p&&await this._trySendDirectUnicast(e,r)||await this._publish(this.config.directTopic,r)}async broadcast(e,t={}){
const r=t.topic||this.config.pubsubTopic,s=this._wrapPayload(e);await this._publish(r,s)}subscribeTopic(e,t=null){if(typeof e!=
"string"||!e.trim())throw new TypeError("subscribeTopic requires a non-empty topic string");const r=e.trim();if(this.additionalPubsubTopics.
add(r),this.allowedTopics.add(r),typeof t=="function"){let s=this.topicHandlers.get(r);s||(s=new Set,this.topicHandlers.
set(r,s)),s.add(t)}if(this.libp2p?.services?.pubsub?.subscribe)try{this.libp2p.services.pubsub.subscribe(r)}catch(s){V("\
[NetworkManager] Dynamic topic subscribe failed",r,s?.message||s)}return()=>this.unsubscribeTopic(r,t)}unsubscribeTopic(e,t=null){
if(typeof e!="string"||!e.trim())return;const r=e.trim(),s=this.topicHandlers.get(r);s&&(typeof t=="function"?s.delete(t):
s.clear(),s.size===0&&this.topicHandlers.delete(r))}async publishTopic(e,t){if(typeof e!="string"||!e.trim())throw new TypeError(
"publishTopic requires a non-empty topic string");const r=e.trim();this.additionalPubsubTopics.add(r),this.allowedTopics.
add(r);const s=this._wrapPayload(t);await this._publish(r,s)}recordPeerBytes(e,{rxBytes:t=0,txBytes:r=0}={}){e&&(Number.
isFinite(t)&&t>0&&this._recordRx(e,t),Number.isFinite(r)&&r>0&&this._recordTx(e,r))}getBootstrapRelayHealth(){const e={};
for(const[t,r]of this.bootstrapRelayHealth.entries())e[t]={...r};return e}async _registerDirectUnicastHandler(){if(!(!this.
config.enableDirectUnicastStream||typeof this.libp2p?.handle!="function"))try{await this.libp2p.handle(wa,(e,t)=>{const r=e?.
stream??e,s=e?.connection??t;this._handleDirectUnicastStream(r,s).catch(()=>{})},{maxInboundStreams:64,maxOutboundStreams:64,
runOnLimitedConnection:!1})}catch(e){V("[NetworkManager] Failed to register direct unicast handler",e?.message||e)}}_findDirectUnicastConnection(e){
if(!e||!this.libp2p)return null;const t=Date.now();if((this.directStreamUnsupportedPeers.get(e)||0)>t)return null;const s=this.
_getConnectionsForPeer(e);let i=null;for(const o of s)if(!(!ee(o)||o.limits||typeof o.newStream!="function")&&this._isDirectCapableConnection(
o)){if(Yn(o.remoteAddr))return o;i||(i=o)}return i}_closeDirectUnicastStream(e,t=null){const r=this.directUnicastStreams.
get(e);if(r&&!(t!==null&&r.connId&&r.connId!==t)){this.directUnicastStreams.delete(e);try{r.stream?.abort?.(new Error("D\
irect unicast stream closed"))}catch{try{r.stream?.close?.()}catch{}}}}_closeAllDirectUnicastStreams(){for(const e of Array.
from(this.directUnicastStreams.keys()))this._closeDirectUnicastStream(e)}async _trySendDirectUnicast(e,t){const r=this._findDirectUnicastConnection(
e);if(!r)return!1;let s;try{s=Pm.encode(JSON.stringify(t))}catch{return!1}const i=this.config.directStreamMaxBytes||su;if(s.
byteLength>i)return!1;const o=r.id||null;let a=this.directUnicastStreams.get(e);if(a&&o&&a.connId!==o&&(this._closeDirectUnicastStream(
e),a=null),!a)try{const u=await r.newStream(wa);a={connId:o,stream:u,queue:Promise.resolve()},this.directUnicastStreams.
set(e,a)}catch(u){const h=String(u?.message||u||"");return/unsupported|protocol|select/i.test(h)&&this.directStreamUnsupportedPeers.
set(e,Date.now()+q7),!1}const c=K7(s),l=a.queue.then(async()=>{if(this.directUnicastStreams.get(e)!==a)throw new Error("\
Direct unicast stream replaced");await G7(a.stream,c),this.lastTxAt=Date.now(),this._recordTx(e,s.byteLength)});a.queue=
l.catch(()=>{});try{return await l,!0}catch(u){return this.directUnicastStreams.get(e)===a&&this._closeDirectUnicastStream(
e),V("[NetworkManager] Direct unicast write failed, falling back to pubsub",e,u?.message||u),!1}}async _handleDirectUnicastStream(e,t){
if(!e||typeof e[Symbol.asyncIterator]!="function")return;const r=t?.remotePeer?.toString?.()||null,s=this.config.directStreamMaxBytes||
su;let i=new Uint8Array(0);const o=a=>{const c=a instanceof Uint8Array?a:typeof a?.subarray=="function"?a.subarray():new Uint8Array(
a);if(!c.byteLength)return;if(i.byteLength+c.byteLength>s+64)throw new Error("Direct unicast receive buffer exceeded lim\
it");if(i.byteLength===0){i=c.slice();return}const l=new Uint8Array(i.byteLength+c.byteLength);l.set(i,0),l.set(c,i.byteLength),
i=l};try{for await(const a of e)for(o(a);i.byteLength>=4;){const c=new DataView(i.buffer,i.byteOffset,4).getUint32(0,!1);
if(c===0||c>s)throw new Error(`Invalid direct unicast frame length: ${c}`);if(i.byteLength<4+c)break;const l=i.subarray(
4,4+c);i=i.subarray(4+c);const u=l.byteLength;let h=null;try{h=JSON.parse(Tm.decode(l))}catch(E){V("[NetworkManager] Fai\
led to parse direct unicast payload",E?.message||E);continue}const d=Date.now();this.lastRxAt=d,this.scheduler?.recordRx(
d);const p=h?.header?.peerId||h?.from||r||null;if(p&&p!==this.peerId&&this._recordRx(p,u),this.scheduler?.handleMessage(
h,p)||h?.target&&h.target!==this.peerId||!this._matchesScope(h))continue;const v=h?.payload??h;if(this._handleRelayAssistMessage(
v,h)||this._handleTopologyMessage(v,h))continue;const g=h?.from||r;g&&g!==this.peerId&&this._touchPeer(g,{lastMessageTime:d}),
this._dispatchMessage(g||"unknown",v)}}catch{}finally{try{await e.close?.()}catch{}}}setTopologyMetric(e){if(!e||typeof e!=
"object")return;const t={x:Number.isFinite(e.x)?e.x:0,y:Number.isFinite(e.y)?e.y:0,z:Number.isFinite(e.z)?e.z:0};this.topologyMetric=
t,this.metricInitialized=!0,this.topologyController&&this.topologyController.setLocalMetric(t),this._updateShardState(!0),
this._publishPresenceNow().catch(()=>{})}setConnectionLimits({targetConnections:e,maxConnections:t}={}){const r=Number.isFinite(
e)?Math.max(1,e):this.config.targetConnections,s=Number.isFinite(t)?Math.max(1,t):this.config.maxConnections,i=r!==this.
config.targetConnections||s!==this.config.maxConnections;this.config.targetConnections=r,this.config.maxConnections=s;const o=this.
_getTransportMaxConnections(s),a=this.libp2p?.services?.connectionManager||this.libp2p?.connectionManager;if(a)try{typeof a.
setMaxConnections=="function"?a.setMaxConnections(o):typeof a.maxConnections=="number"&&(a.maxConnections=o)}catch(c){V(
"[NetworkManager] Failed to update connection manager limits",c?.message||c)}this.topologyController?.setConnectionLimits&&
this.topologyController.setConnectionLimits({targetConnections:r,maxConnections:s}),i&&this._publishPresenceNow().catch(
()=>{})}setPriorityPeers(e=[]){this.topologyController?.setPriorityPeers&&this.topologyController.setPriorityPeers(e)}setRelayBootstrapBehavior({
keepRelay:e}={}){if(typeof e!="boolean")return;(!this.config.webrtc||typeof this.config.webrtc!="object")&&(this.config.
webrtc={});const t=!e;this.config.webrtc.dropRelayBootstrapOnDirect=t,this._maybeUpdateBootstrapRelayConnections()}getTopologyStatus(){
return{topologyId:this.config.topologyId,topologyType:this.config.topology,shardId:this.topologyShardId,metric:{...this.
topologyMetric},targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections,transportMaxConnections:this.
_getTransportMaxConnections(this.config.maxConnections)}}getConnectedPeers(){const e=this._getConnectionPeers(),t=this._getScopedPeers(),
r=new Map;return t.forEach(s=>r.set(s.peerId,s)),e.forEach(s=>{const i=r.get(s.peerId)||{};r.set(s.peerId,{...i,...s})}),
Array.from(r.values())}_getConnectionManager(){return this.libp2p?.services?.connectionManager||this.libp2p?.components?.
connectionManager||this.libp2p?.connectionManager||null}_getConnectionManagerStats(){const e=this._getConnectionManager();
if(!e)return null;const t=e?.dialQueue?.queue||null,r=typeof e.getMaxConnections=="function"?e.getMaxConnections():Number.
isFinite(e.maxConnections)?e.maxConnections:null;return{logicalMaxConnections:Number.isFinite(this.config.maxConnections)?
this.config.maxConnections:null,configuredTransportMaxConnections:this._getTransportMaxConnections(this.config.maxConnections),
maxConnections:r,maxIncomingPendingConnections:Number.isFinite(e.maxIncomingPendingConnections)?e.maxIncomingPendingConnections:
null,incomingPendingConnections:Number.isFinite(e.incomingPendingConnections)?e.incomingPendingConnections:null,outboundPendingConnections:Number.
isFinite(e.outboundPendingConnections)?e.outboundPendingConnections:null,dialQueue:t?{size:Number.isFinite(t.size)?t.size:
null,running:Number.isFinite(t.running)?t.running:null,queued:Number.isFinite(t.queued)?t.queued:null,concurrency:Number.
isFinite(t.concurrency)?t.concurrency:null,maxSize:Number.isFinite(t.maxSize)?t.maxSize:null}:null}}getNetworkStats(){const e=this.
_getConnectionPeers(),t=this._getLogicalDialedPeerCount(),r=this._getActiveDialedPeerCount(),s=e.filter(a=>this.bootstrapPeerIds.
has(a.peerId)).length,i=this.libp2p?.getConnections?.()||[],o=Array.isArray(i)?i.length:typeof i.size=="number"?i.size:0;
return{peerId:this.peerId,peerCount:e.length,logicalPeerCount:t,activeDialedPeerCount:r,bootstrapPeerCount:s,reservedDialPeerCount:Math.
max(0,t-r),isConnected:this.isConnected,topology:this.config.topology,topologyId:this.config.topologyId,shardId:this.topologyShardId,
metric:{...this.topologyMetric},connections:o,targetConnections:this.config.targetConnections,maxConnections:this.config.
maxConnections,transportMaxConnections:this._getTransportMaxConnections(this.config.maxConnections),connectionManager:this.
_getConnectionManagerStats()}}getTelemetrySnapshot(){const e=Date.now(),t=this.getNetworkStats(),r=this.getHealth(),s=this.
getRelayRetentionDebug(),i=this._getGossipsubMeshPeerIds(),o=this.getConnectedPeers().map(a=>({peerId:a.peerId,connectedAt:a.
connectedAt||null,joinedAt:a.joinedAt||null,lastSeen:a.lastSeen||null,lastMessageTime:a.lastMessageTime||null,lastRxAt:a.
lastRxAt||null,lastTxAt:a.lastTxAt||null,lastRttAt:a.lastRttAt||null,rttMs:Number.isFinite(a.rttMs)?a.rttMs:null,...this.
config.topology==="throughput"?{workRate:this.peerWork.get(a.peerId)?.rate||0}:{},...typeof this.workMeshTelemetryProvider==
"function"?(()=>{const c=this.workMeshTelemetryProvider(a.peerId);return c?{workMesh:c}:{}})():{},via:a.via||null,signalingPath:Wn(
a.signalingPath)||null,mediaPath:yn(a.mediaPath)||null,icePath:Yo(a.icePath)||null,iceProtocol:a.iceProtocol||null,candidatePairRttMs:Number.
isFinite(a.candidatePairRttMs)?a.candidatePairRttMs:null,direction:a.direction||null,connectionCount:Number.isFinite(a.connectionCount)?
a.connectionCount:null,duplicateConnections:a.duplicateConnections===!0,topologyId:a.topologyId||null,shardId:a.shardId||
null,metric:a.metric||null,metricInitialized:a.metricInitialized??null,targetConnections:a.targetConnections||null,maxConnections:a.
maxConnections||null,activeConnections:a.activeConnections||null,rxCount:a.rxCount||0,txCount:a.txCount||0,rxBytes:a.rxBytes||
0,txBytes:a.txBytes||0,rxBps:a.rxBps||0,txBps:a.txBps||0}));return{ts:e,peerId:this.peerId,gameId:this.config.gameId,roomId:this.
config.roomId,topology:this.config.topology,topologyId:this.config.topologyId,shardId:this.topologyShardId,metric:{...this.
topologyMetric},metricInitialized:this.metricInitialized,isConnected:this.isConnected,peerCount:t.peerCount,targetConnections:this.
config.targetConnections,maxConnections:this.config.maxConnections,...this.config.hostGroupId?{hostGroupId:this.config.hostGroupId}:
{},connections:t.connections,lastRxAt:r.lastRxAt,lastTxAt:r.lastTxAt,counts:{rx:this.telemetry.rxCount,tx:this.telemetry.
txCount,rxBytes:this.telemetry.rxBytes,txBytes:this.telemetry.txBytes},rates:{rxBps:this.telemetry.rxBps,txBps:this.telemetry.
txBps},pubsub:{rxCount:this.telemetry.pubsubRxCount,txCount:this.telemetry.pubsubTxCount,rxBytes:this.telemetry.pubsubRxBytes,
txBytes:this.telemetry.pubsubTxBytes,lastRxAt:this.telemetry.pubsubLastRxAt||null,lastTxAt:this.telemetry.pubsubLastTxAt||
null},reliability:r.reliability,pubsubPeerCount:Array.isArray(r.pubsubPeers)?r.pubsubPeers.length:0,gossipMeshPeers:i,relayState:{
connected:s.hasBootstrapRelayConnections,role:s.role,keepReason:s.keepReason,relayPeerId:this._getConnectedBootstrapPeerId(),
gossipMeshCount:i.length,directMeshPeerCount:s.directMeshPeerCount,minDirectMeshPeers:s.effectiveMinDirectMeshPeers},rewiresPerMin:this.
_getRewiresPerMin(e),dialFailures:this.dialFailureCount||0,joinedAt:this.joinedAt,peers:o}}getLibp2pNode(){return this.libp2p}_dropPubsubPeer(e){
if(!e)return;const t=this.libp2p?.services?.pubsub;if(!t||typeof t.removePeer!="function")return;let r;try{r=te(e)}catch{
return}try{t.removePeer(r)}catch(s){V("[NetworkManager] Failed to remove pubsub peer",e,s?.message||s)}}_handlePubsubStreamError(e,t){
if(!e||!t)return;const r=t?.message||"";if(t?.name!=="StreamStateError"&&!String(r).includes("stream"))return;const s=Date.
now(),i=this.pubsubStreamErrorAt.get(e)||0;s-i>5e3&&(this.pubsubStreamErrorAt.set(e,s),V("[NetworkManager] Pubsub stream\
 error",e,r)),this._dropPubsubPeer(e)}_emitConnectionFailure(e={}){if(typeof this.onConnectionFailure!="function")return;
const t={peerId:e.peerId??null,address:e.address??null,source:e.source??null,stage:e.stage??null,error:e.error??null,at:e.
at??Date.now()};try{this.onConnectionFailure(t)}catch(r){V("[NetworkManager] onConnectionFailure failed",r?.message||r)}}_patchGossipsubOutboundStream(e,t){
if(!e||!t)return;const r=t.rawStream||t.stream||t._rawStream;if(!r||typeof r.send!="function"||r.__pcSendPatched)return;
const s=r.send.bind(r);r.send=i=>{try{const o=s(i);return o&&typeof o.catch=="function"&&o.catch(a=>this._handlePubsubStreamError(
e,a)),o}catch(o){this._handlePubsubStreamError(e,o);return}},r.__pcSendPatched=!0}_patchGossipsubOutboundStreams(){if(this.
config.pubsubType!=="gossipsub")return;const t=this.libp2p?.services?.pubsub?.streamsOutbound;if(!(!t||typeof t.forEach!=
"function")&&(t.forEach((r,s)=>{this._patchGossipsubOutboundStream(s,r)}),!t.__pcWrapped)){const r=t.set.bind(t);t.set=(s,i)=>{
const o=r(s,i);return this._patchGossipsubOutboundStream(s,i),o},t.__pcWrapped=!0}}_wireLibp2pEvents(){this.libp2p&&(this.
libp2p.addEventListener("error",e=>{const t=e?.detail?.error||e?.detail||e?.error||e;t&&(this._emitConnectionFailure({source:"\
libp2p",stage:"runtime",error:t}),V("[NetworkManager] Libp2p runtime error",t?.message||t))}),this.libp2p.addEventListener(
"connection:open",e=>{const t=e.detail;this._getPeerConnectionRecovery().observe(t,{openedNow:!0});const r=t?.remotePeer?.
toString?.();if(!r)return;const s=Date.now(),i=ot(t?.remoteAddr),o=Lm(i);this._rememberDialTargets(r,[i]),this._clearDialFailureBackoff(
r);const a=this.peers.get(r)?.via||null;a&&["relay","relay-webrtc","direct","webrtc"].includes(a)&&a!==o?this._infoLog("\
[NetworkManager] Connection upgraded",r,`${a} -> ${o}`,i):this._infoLog("[NetworkManager] Connection open",r,o,i),this.bootstrapPeerIds.
has(r)&&!Number.isFinite(this.relayBootstrapConnectedAt)&&(this.relayBootstrapConnectedAt=s);const c=this._getPreferredConnectionMeta(
r);if(c){const l={...c};if(this._isDirectCapableConnection(t)&&!this.bootstrapPeerIds.has(r)){const u=Number(this.peers.
get(r)?.directCandidateSince);l.directCandidateSince=Number.isFinite(u)?u:s,Number.isFinite(this.firstDirectUpgradeAt)||
(this.firstDirectUpgradeAt=s)}this._touchPeer(r,l)}this._sampleConnectionIceStats(t,r).catch(()=>{}),this._maybePruneRelayConnections(
r),this._maybePruneDuplicateConnections(r),this._maybeUpdateBootstrapRelayConnections(),this.bootstrapPeerIds.has(r)&&this.
isConnected&&this._publishPresenceNow().catch(()=>{})}),this.libp2p.addEventListener("connection:close",e=>{const t=e.detail,
r=t?.remotePeer?.toString?.();if(!r)return;const s=ot(t?.remoteAddr),i=Lm(s),o=this._getPreferredConnectionMeta(r);o?this.
_touchPeer(r,{...o,...this._hasDirectCapableConnectionForPeer(r)?{}:{directCandidateSince:null}}):this._hasDirectCapableConnectionForPeer(
r)||this._touchPeer(r,{directCandidateSince:null,icePath:null,iceProtocol:null,candidatePairRttMs:null});const a=t?.stat?.
timeline?.close?.error||t?.stat?.timeline?.close?.cause||t?.timeline?.close?.error||t?.timeline?.close?.cause||t?.error||
e?.detail?.error;a&&this._emitConnectionFailure({peerId:r,address:t?.remoteAddr?.toString?.(),source:"connection",stage:"\
close",error:a});const c=this._getConnectionsForPeer(r).filter(ee).length;if(this._infoLog("[NetworkManager] Connection \
closed",r,i,s,"reason:",s9(a),"remaining:",c),this._closeDirectUnicastStream(r,t?.id||null),this.bootstrapPeerIds.has(r))
for(const u of this.bootstrapRelayHealth.values())u.peerId===r&&c===0&&(u.ok=!1,u.lastFailAt=Date.now());const l=this._getConnectionsForPeer(
r).filter(u=>u?.status==="open");this.bootstrapPeerIds.has(r)&&l.length===0&&!this._hasBootstrapRelayConnections()&&(this.
relayBootstrapConnectedAt=null),l.length===0&&this._dropPubsubPeer(r),this.config.topology!=="throughput"&&!this.bootstrapPeerIds.
has(r)&&this._isDirectCapableConnection(t)&&!this._isIntentionallyClosed(r)&&!this._hasDirectCapableConnectionForPeer(r)&&
this._shouldDialDiscoveredPeer(r)&&(this.recentDialAttempts.delete(r),this._clearDialFailureBackoff(r),this._infoLog("[N\
etworkManager] Direct connection lost, scheduling recovery redial",r),this._maybeDialPeer(r,"direct-drop-recovery").catch(
()=>{})),this._scheduleIsolationRelayRedial(),this._maybeUpdateBootstrapRelayConnections()}),this.libp2p.addEventListener(
"peer:discovery",e=>{const t=e.detail?.id?.toString?.();!t||t===this.peerId||this._shouldDialDiscoveredPeer(t)&&this._maybeDialPeer(
t,"discovery").catch(()=>{})}),this.libp2p.addEventListener("peer:connect",e=>{const t=e.detail?.remotePeer?.toString?.()||
e.detail?.toString?.();if(!t)return;const r=!this.peers.has(t);this._clearPendingLogicalReservations(t);const s=this._getPreferredConnectionMeta(
t),i=s?.via||null,o=this.peers.get(t)?.via||null,a=this.peers.get(t)?.joinedAt;this.bootstrapPeerIds.has(t)&&this._reserveRelayForPeer(
t,"bootstrap-connect").catch(()=>{});const c={connectedAt:Date.now(),joinedAt:Number.isFinite(a)?a:Date.now(),via:i||o||
"connection"};s?.signalingPath&&(c.signalingPath=s.signalingPath),s?.mediaPath&&(c.mediaPath=s.mediaPath),this._touchPeer(
t,c),r&&this.onPeerConnect(t)}),this.libp2p.addEventListener("peer:disconnect",e=>{const t=e.detail?.remotePeer?.toString?.()||
e.detail?.toString?.();t&&(this._dropPubsubPeer(t),this.peers.delete(t),this.peerDialBackoff.delete(t),this._clearPendingLogicalReservations(
t),this._clearRelayPruneTimer(t),this.relayReservationPeers.delete(t),this.bootstrapPeerIds.has(t)&&!this._hasBootstrapRelayConnections()&&
(this.relayBootstrapConnectedAt=null),this.onPeerDisconnect(t),this._maybeUpdateBootstrapRelayConnections())}),this.libp2p.
services.pubsub.addEventListener("message",e=>{const{topic:t,data:r}=e.detail||{};if(!t||!r||!this.allowedTopics.has(t)||
this.networkTelemetryService.handlePubsubMessage(e.detail))return;let s=null;try{s=JSON.parse(Tm.decode(r))}catch(d){V("\
[NetworkManager] Failed to parse pubsub payload",d);return}const i=Date.now(),o=cu(r);this.lastRxAt=i,this.scheduler?.recordRx(
i),this._recordPubsubRx(o);const a=s?.header?.peerId||s?.from||null;if(a&&a!==this.peerId&&this._recordRx(a,o),this.scheduler?.
handleMessage(s,a))return;if(t===this.config.presenceTopic){this._handlePresence(s);return}if(t===this.config.directoryTopic){
this._handleDirectoryMessage(s);return}if(t===this.config.directTopic&&s?.target&&s.target!==this.peerId||!this.additionalPubsubTopics.
has(t)&&!this._matchesScope(s))return;const l=s?.payload??s,u=this.topicHandlers.get(t);if(u&&u.size>0){const d=s?.from||
a||"unknown";for(const p of u)try{p(d,l,s,t)}catch(v){V("[NetworkManager] Topic handler error",t,v?.message||v)}return}if(this.
_handleRelayAssistMessage(l,s)||this._handleTopologyMessage(l,s))return;const h=s?.from;h&&h!==this.peerId&&this._touchPeer(
h,{lastMessageTime:Date.now()}),this._dispatchMessage(h||"unknown",l)}))}_buildPubsubService(){if(this.config.pubsubType===
"gossipsub"){const e=this.config.gossipsub||{},t={emitSelf:!1,allowPublishToZeroTopicPeers:!0,fallbackToFloodsub:!0,...e,
scoreParams:{IPColocationFactorWeight:0,behaviourPenaltyWeight:0,...e.scoreParams||{}}};if(e.allowPublishToZeroPeers!==void 0&&
t.allowPublishToZeroTopicPeers===void 0&&(t.allowPublishToZeroTopicPeers=e.allowPublishToZeroPeers),this.config.enableRelayDirectPeers===
!0&&!this.config.webrtc?.dropRelayBootstrapOnDirect&&this.bootstrapPeerIds.size>0){const s=t.directPeers||[];for(const i of this.
bootstrapPeerIds)try{const o=te(i),a=this.config.bootstrapPeers.map(c=>{try{return typeof c=="string"?O(c):c}catch{return null}}).
filter(Boolean);a.length>0&&(s.push({id:o,addrs:a}),It("[NetworkManager] Added relay as gossipsub directPeer:",o.toString()))}catch(o){
V("[NetworkManager] Failed to add relay as directPeer:",i,o?.message||o)}s.length>0&&(t.directPeers=s)}else this.bootstrapPeerIds.
size>0&&It("[NetworkManager] Relay excluded from gossipsub directPeers (dropRelayBootstrapOnDirect enabled)");return zU(
t)}return _5()}_dispatchMessage(e,t){this.messageHandlers.forEach(r=>{try{r(e,t)}catch(s){console.error("[NetworkManager\
] Message handler failed",s)}}),this.onMessage(e,t)}_wrapPayload(e,t={}){return{type:"peercompute-message",from:this.peerId,
gameId:this.config.gameId,roomId:this.config.roomId,topologyId:this.config.topologyId,topologyType:this.config.topology,
shardId:this.topologyShardId,payload:e,...t}}_matchesScope(e){if(!e)return!0;if(e.gameId&&e.gameId!==this.config.gameId||
e.roomId&&e.roomId!==this.config.roomId)return!1;if(this.config.enforceTopologyScope){const t=e.topologyId||e.header?.topologyId||
null;if(!t||t!==this.config.topologyId)return!1}return!0}_handlePresence(e){if(!e||!this._matchesScope(e)||!e.from||e.from===
this.peerId)return;const t=Date.now(),r=!this.peers.has(e.from),s=Number(e.joinedAt),i=this.peers.get(e.from)||{};let o=i.
joinedAt??null;Number.isFinite(s)&&(o=Number.isFinite(o)?Math.min(o,s):s);const a=this._getPreferredConnectionMeta(e.from),
c=a?.via||(i.via&&i.via!=="presence"?i.via:null)||"presence";this._touchPeer(e.from,{gameId:e.gameId,roomId:e.roomId,topologyId:e.
topologyId,topologyType:e.topologyType,shardId:e.shardId,metric:e.metric||null,metricInitialized:e.metricInitialized??null,
targetConnections:e.targetConnections,maxConnections:e.maxConnections,activeConnections:e.activeConnections,relayConnected:e.
relayConnected??null,relayKeeper:e.relayKeeper??null,capabilities:Dm(e.capabilities),firstSeenAt:Number.isFinite(i.firstSeenAt)?
i.firstSeenAt:t,lastSeen:t,joinedAt:o,...a||{},via:c}),r&&this.onPeerConnect(e.from),Array.isArray(e.multiaddrs)&&e.multiaddrs.
length>0&&this._rememberPeerAddresses(e.from,e.multiaddrs),this._shouldDialDiscoveredPeer(e.from)&&(this._maybeDialPeer(
e.from,"presence",e.multiaddrs).catch(()=>{}),this._maybeUpdateBootstrapRelayConnections())}_getScopedPeers(){return Array.
from(this.peers.entries()).filter(([,e])=>e?.gameId===this.config.gameId&&e?.roomId===this.config.roomId).filter(([,e])=>this.
config.enforceTopologyScope?e?.topologyId?e.topologyId===this.config.topologyId:!1:!0).map(([e,t])=>({peerId:e,...t}))}_getConnections(){
if(!this.libp2p?.getConnections)return[];const e=this.libp2p.getConnections();return Array.isArray(e)?e:typeof e?.values==
"function"?Array.from(e.values()).reduce((t,r)=>t.concat(r),[]):[]}_getConnectionPeers(){const e=new Map,t=this._getConnections();
for(const s of t){if(!ee(s))continue;const i=s?.remotePeer?.toString?.();if(!i)continue;let o=e.get(i);o||(o=[],e.set(i,
o)),o.push(s)}const r=[];for(const[s,i]of e.entries()){const o=this.peers.get(s)||{},a=this._getPreferredConnectionMeta(
s,i),c=a?.via||(o.via&&o.via!=="presence"?o.via:null)||"connection",l=Nm(c),u=new Set(i.map(d=>String(d?.direction||d?.stat?.
direction||"").toLowerCase()).filter(d=>d==="inbound"||d==="outbound")),h=u.size>1?"both":u.size===1?Array.from(u)[0]:null;
r.push({peerId:s,...o,...a||{},via:c,signalingPath:Wn(a?.signalingPath)||Wn(o.signalingPath)||Wn(l.signalingPath),mediaPath:yn(
a?.mediaPath)||yn(o.mediaPath)||yn(l.mediaPath),icePath:Yo(a?.icePath)||Yo(o.icePath)||null,iceProtocol:a?.iceProtocol||
o.iceProtocol||null,candidatePairRttMs:Number.isFinite(a?.candidatePairRttMs)?a.candidatePairRttMs:Number.isFinite(o.candidatePairRttMs)?
o.candidatePairRttMs:null,direction:h,connectionCount:i.length,duplicateConnections:i.length>1})}return r}_getActiveConnectionCount(){
const e=this._getConnections();let t=0;for(const r of e)ee(r)&&(t+=1);return t}_getActiveDialedPeerIds(){const e=new Set,
t=this._getConnections();for(const r of t){if(!ee(r))continue;const s=r?.remotePeer?.toString?.();!s||this.bootstrapPeerIds.
has(s)||e.add(s)}return e}_countDialedPeers(){return this._getActiveDialedPeerIds().size}_isDirectCapableConnection(e){return e?
$m(e?.remoteAddr)?!0:this.config.webrtc?.countRelayWebrtcAsDirectCapable!==!1&&ti(e?.remoteAddr):!1}_getDirectStableSince(e,t){
const r=this.peers.get(e),s=Number(r?.directCandidateSince);if(Number.isFinite(s))return s;const i=ea(t);return Number.isFinite(
i)?i:null}_hasDirectCapableConnectionForPeer(e){return this._getConnectionsForPeer(e).some(r=>ee(r)&&this._isDirectCapableConnection(
r))}_hasDirectPeerConnections(){const e=Number.isFinite(this.config.webrtc?.relayDropMinDirectMs)?Math.max(0,this.config.
webrtc.relayDropMinDirectMs):0,t=Date.now();return this._getConnections().some(s=>{if(!ee(s))return!1;const i=s?.remotePeer?.
toString?.();if(!i||this.bootstrapPeerIds.has(i)||!this._isDirectCapableConnection(s))return!1;if(e<=0)return!0;const o=this.
_getDirectStableSince(i,s);return Number.isFinite(o)?t-o>=e:!0})}_getActiveDialedPeerCount(){return this._getActiveDialedPeerIds().
size}_getDirectCapableDialedPeerIds(){const e=new Set,t=this._getConnections();for(const r of t){if(!ee(r))continue;const s=r?.
remotePeer?.toString?.();!s||this.bootstrapPeerIds.has(s)||this._isDirectCapableConnection(r)&&e.add(s)}return e}_getDirectCapableDialedPeerCount(){
return this._getDirectCapableDialedPeerIds().size}_getLogicalReservationExpiry(e){if(!e||typeof e!="object")return null;
if(Number.isFinite(e.expiresAt))return e.expiresAt;const t=Number.isFinite(e.reservedAt)?e.reservedAt:Number.isFinite(e.
sentAt)?e.sentAt:null;return Number.isFinite(t)?t+Qo:null}_clearPendingLogicalReservations(e){e&&(this.pendingTopologyRequests.
delete(e),this.pendingTopologyAccepts.delete(e),this.pendingPeerDials.delete(e))}_prunePendingLogicalReservations(e=Date.
now()){const t=this._getActiveDialedPeerIds(),r=s=>{if(s instanceof Map)for(const[i,o]of Array.from(s.entries())){if(!i||
this.bootstrapPeerIds.has(i)||t.has(i)){s.delete(i);continue}const a=this._getLogicalReservationExpiry(o);Number.isFinite(
a)&&a<=e&&s.delete(i)}};r(this.pendingTopologyRequests),r(this.pendingTopologyAccepts),r(this.pendingPeerDials)}_getReservedDialedPeerIds(e=Date.
now()){this._prunePendingLogicalReservations(e);const t=new Set,r=s=>{if(s instanceof Map)for(const i of s.keys())!i||this.
bootstrapPeerIds.has(i)||t.add(i)};return r(this.pendingTopologyRequests),r(this.pendingTopologyAccepts),r(this.pendingPeerDials),
t}_getLogicalDialedPeerIds(e=Date.now()){const t=this._getReservedDialedPeerIds(e);return this._getActiveDialedPeerIds().
forEach(s=>t.add(s)),t}_getLogicalDialedPeerCount(e=Date.now()){return this._getLogicalDialedPeerIds(e).size}_hasLogicalPeerReservation(e,t=Date.
now()){return e?this._getLogicalDialedPeerIds(t).has(e):!1}_hasAvailableLogicalPeerSlot(e=null,t=Date.now()){const r=Number.
isFinite(this.config.maxConnections)?Math.max(1,this.config.maxConnections):0;if(r<=0)return!0;const s=this._getLogicalDialedPeerIds(
t);return e&&s.has(e)?!0:s.size<r}_getTransportMaxConnections(e=this.config.maxConnections){if(Number.isFinite(this.config.
transportMaxConnections))return Math.max(1,Math.trunc(this.config.transportMaxConnections));const t=Number.isFinite(e)?Math.
max(1,Math.trunc(e)):1,r=this.bootstrapPeerIds.size>0?1:0,s=Number.isFinite(this.config.transportConnectionHeadroom)?Math.
max(0,Math.trunc(this.config.transportConnectionHeadroom)):0,i=t;return t+r+s+i}_getDirectGossipsubMeshPeerCount(){const e=this.
libp2p?.services?.pubsub;if(!e||typeof e.getMeshPeers!="function"){const i=typeof e?.getPeers=="function"?e.getPeers():[];
let o=0;for(const a of i){const c=a?.toString?.();!c||this.bootstrapPeerIds.has(c)||this._hasDirectCapableConnectionForPeer(
c)&&(o+=1)}return o}const t=this.config.pubsubTopic,r=e.getMeshPeers(t);if(!Array.isArray(r)||r.length===0)return 0;let s=0;
for(const i of r){const o=i?.toString?.();!o||this.bootstrapPeerIds.has(o)||this._hasDirectCapableConnectionForPeer(o)&&
(s+=1)}return s}_getMinDirectMeshPeers(){return Number.isFinite(this.config.webrtc?.minDirectMeshPeers)?Math.max(1,this.
config.webrtc.minDirectMeshPeers):Math.min(this.config.targetConnections||3,3)}_getGossipsubMeshPeerIds(e=this.config.pubsubTopic){
const t=this.libp2p?.services?.pubsub;if(!t)return[];const r=typeof t.getMeshPeers=="function"?t.getMeshPeers(e):typeof t.
getPeers=="function"?t.getPeers():[];if(!Array.isArray(r))return[];const s=[],i=new Set;for(const o of r){const a=o?.toString?.();
!a||i.has(a)||(i.add(a),s.push(a))}return s}_getConnectedBootstrapPeerId(){if(!this.libp2p||this.bootstrapPeerIds.size===
0)return null;for(const e of this.bootstrapPeerIds)if(this._getConnectionsForPeer(e).some(ee))return e;return null}_getKnownDialablePeerCount(){
const e=this._getScopedPeers().filter(r=>r?.peerId&&r.peerId!==this.peerId&&!this.bootstrapPeerIds.has(r.peerId)).length,
t=Math.max(this._getActiveDialedPeerCount(),this._countDialedPeers());return Math.max(e,t)}_getEffectiveMinDirectMeshPeers(){
const e=this._getMinDirectMeshPeers(),t=this._getKnownDialablePeerCount();return t>0?Math.max(1,Math.min(e,t)):e}_hasHealthyGossipsubMesh(){
const e=this._getEffectiveMinDirectMeshPeers();return this._getDirectGossipsubMeshPeerCount()>=e?!0:this._getDirectCapableDialedPeerCount()>=
e}_isRelayKeeper(e=Date.now()){if(!this.config.webrtc?.dropRelayBootstrapOnDirect||e<this.relayKeeperUntil)return!0;const t=this.
_evaluateRelayBootstrapRetention(e);return t.keepReason==="retention-keeper"||t.keepReason==="drop-disabled"}_evaluateRelayBootstrapRetention(e=Date.
now()){const t=this._getMinDirectMeshPeers(),r=this._getEffectiveMinDirectMeshPeers(),s=this._getDirectGossipsubMeshPeerCount(),
i=this._getDirectCapableDialedPeerCount(),o=this._getActiveDialedPeerCount(),a=this._getKnownDialablePeerCount(),c=this.
_hasBootstrapRelayConnections(),l=this._hasDirectPeerConnections(),u=s>=r||i>=r,h=this._getRelayRetentionConfig(),d=this.
_getRetentionCandidates(),p=h?this._getRelayRetentionKeepCount(d.length,h):0,v=d.slice().sort((k,$)=>{const F=Number.isFinite(
k.joinedAt)?k.joinedAt:1/0,P=Number.isFinite($.joinedAt)?$.joinedAt:1/0;return F!==P?F-P:String(k.peerId).localeCompare(
String($.peerId))}),g=v.slice(0,p).map(k=>k.peerId),E=Number.isFinite(this.config.targetConnections)?this.config.targetConnections:
null,f=Number.isFinite(E)?a>0?Math.min(E,a):E:null,b=Number.isFinite(this.config.webrtc?.relayBootstrapMinHoldMs)?Math.max(
0,this.config.webrtc.relayBootstrapMinHoldMs):Ov,_=Number.isFinite(this.relayBootstrapConnectedAt)?Math.max(0,e-this.relayBootstrapConnectedAt):
null,m=Number.isFinite(_)&&b>0?Math.max(0,b-_):0,y=Number.isFinite(this.config.webrtc?.relayPostDirectHoldMs)?Math.max(0,
this.config.webrtc.relayPostDirectHoldMs):Bv,A=Number.isFinite(this.firstDirectUpgradeAt)?Math.max(0,e-this.firstDirectUpgradeAt):
null,w=Number.isFinite(A)&&y>0?Math.max(0,y-A):0;let S=!1,x="none";if(!this.config.webrtc?.dropRelayBootstrapOnDirect)S=
!0,x="drop-disabled";else if(c&&m>0)S=!0,x="bootstrap-hold";else if(!l)S=!0,x="no-direct";else if(!u)S=!0,x="unhealthy-m\
esh";else if(w>0)S=!0,x="post-direct-hold";else if(Number.isFinite(f)&&o<f)S=!0,x="below-target";else if(!h||h.mode!=="l\
ogn"&&h.mode!=="sqrt"||p<=0)S=!1,x="none";else{const k=h.minCandidates??Math.max(p+1,h.min??1);d.length<k?(S=!0,x="insuf\
ficient-candidates"):g.includes(this.peerId)&&(S=!0,x="retention-keeper")}const I=!S&&e<this.relayKeeperUntil?"elected-k\
eeper":x,M=c?I==="drop-disabled"?"permanent":I==="retention-keeper"?"keeper":I==="elected-keeper"?"elected-keeper":"hold\
ing":"off-relay";return{dropRelayBootstrapOnDirect:this.config.webrtc?.dropRelayBootstrapOnDirect,relayRetention:h,minDirectMeshPeers:t,
effectiveMinDirectMeshPeers:r,directMeshPeerCount:s,directCapablePeerCount:i,activeDialedPeerCount:o,knownDialablePeers:a,
desiredConnections:f,candidateCount:d.length,keepCount:p,keepPeerIds:g,selfRank:v.findIndex(k=>k.peerId===this.peerId),relayBootstrapHoldRemainingMs:m,
postDirectHoldRemainingMs:w,hasBootstrapRelayConnections:c,hasDirectPeerConnections:l,healthyMesh:u,shouldKeepRelay:S,keepReason:I,
role:M}}getRelayRetentionDebug(){return this._evaluateRelayBootstrapRetention(Date.now())}_hasBootstrapRelayConnections(){
if(!this.libp2p||this.bootstrapPeerIds.size===0)return!1;for(const e of this.bootstrapPeerIds)if(this._getConnectionsForPeer(
e).some(ee))return!0;return!1}_closeBootstrapRelayConnections(){if(!(!this.libp2p||this.bootstrapPeerIds.size===0))for(const e of this.
bootstrapPeerIds)this._getConnectionsForPeer(e).forEach(r=>{this._retireIdleConnection(r,"bootstrap-retention")})}_maybeRedialBootstrapPeers(){
const e=Date.now(),t=this.config.bootstrapDialThrottleMs??iu;t>0&&e-this.lastBootstrapDialAt<t||(this.lastBootstrapDialAt=
e,this._dialBootstrapPeers().catch(()=>{}))}_maybeUpdateBootstrapRelayConnections(){if(!this.libp2p)return;const e=Date.
now(),t=this._hasBootstrapRelayConnections();if(t?Number.isFinite(this.relayBootstrapConnectedAt)||(this.relayBootstrapConnectedAt=
e):this.relayBootstrapConnectedAt=null,this.config.bootstrapPeers?.length&&this._getActiveConnectionCount()===0&&!t){this.
_maybeRedialBootstrapPeers();return}if(!this.config.webrtc?.dropRelayBootstrapOnDirect){t||this._maybeRedialBootstrapPeers();
return}if(this._shouldKeepRelayBootstrapConnection()){t||this._maybeRedialBootstrapPeers();return}if(this._shouldElectRelayRedial(
e,{allowWithBootstrap:!0})){t||this._maybeRedialBootstrapPeers();return}t&&this._closeBootstrapRelayConnections()}_shouldReconnectRelayForDial(e){
if(this._hasBootstrapRelayConnections()||this.config.webrtc?.reconnectOnDialFailure===!1)return!1;const t=Date.now(),r=this.
config.webrtc?.reconnectThrottleMs??3e4;return!(t-this.relayReconnectState.lastReconnectAt<r||this.bootstrapPeerIds.has(
e)||!this.peers.has(e))}async _reconnectRelayForDial(e){if(!this._shouldReconnectRelayForDial(e))return!1;It("[NetworkMa\
nager] Reconnecting to relay for dial:",e),this.relayReconnectState.lastReconnectAt=Date.now(),this.relayReconnectState.
pendingDialsNeedingRelay.add(e);try{return await this._dialBootstrapPeers(),this._hasBootstrapRelayConnections()}catch(t){
return V("[NetworkManager] Relay reconnect failed:",t?.message||t),!1}}_isRelayReservationError(e){const t=String(e?.message||
e||"");return t?t.includes("NO_RESERVATION")||/reservation/i.test(t):!1}_clearRelayAssistState(){const e=this.relayAssistState?.
pendingReadyTimeouts;e&&typeof e.forEach=="function"&&(e.forEach(t=>clearTimeout(t)),e.clear()),this.relayAssistState?.lastRequestAt?.
clear?.(),this.relayAssistState?.inboundRequestAt?.clear?.()}async _requestRelayAssist(e,t="dial-failed"){if(!e||e===this.
peerId||this.config.webrtc?.enableRelayAssist===!1)return!1;const r=Date.now(),s=this.config.webrtc?.relayAssistRequestThrottleMs??
Fv,i=this.relayAssistState.lastRequestAt.get(e)||0;if(r-i<s)return!1;this.relayAssistState.lastRequestAt.set(e,r);const o=this.
relayAssistState.pendingReadyTimeouts.get(e);o&&(clearTimeout(o),this.relayAssistState.pendingReadyTimeouts.delete(e));const a=this.
config.webrtc?.relayAssistReadyTimeoutMs??Uv,c=setTimeout(()=>{this.relayAssistState.pendingReadyTimeouts.delete(e)},a);
this.relayAssistState.pendingReadyTimeouts.set(e,c);try{return await this.sendToPeer(e,{type:"relay-assist-request",reason:t,
requestedAt:r}),It("[NetworkManager] Relay assist requested",e,t),!0}catch(l){return clearTimeout(c),this.relayAssistState.
pendingReadyTimeouts.delete(e),V("[NetworkManager] Relay assist request failed",e,l?.message||l),!1}}_handleRelayAssistMessage(e,t){
if(!e||typeof e!="object")return!1;const r=String(e.type||"").trim().toLowerCase();if(r!=="relay-assist-request"&&r!=="r\
elay-assist-ready")return!1;const s=t?.from||e?.from||null;return!s||s===this.peerId?!0:r==="relay-assist-request"?(this.
_handleRelayAssistRequest(s,e).catch(()=>{}),!0):(r==="relay-assist-ready"&&this._handleRelayAssistReady(s,e).catch(()=>{}),
!0)}async _handleRelayAssistRequest(e,t={}){if(this.config.webrtc?.enableRelayAssist===!1||!this.config.bootstrapPeers?.
length)return;const r=Date.now(),s=2e3,i=this.relayAssistState.inboundRequestAt.get(e)||0;if(r-i<s)return;if(this.relayAssistState.
inboundRequestAt.set(e,r),!this._hasBootstrapRelayConnections())try{await this._dialBootstrapPeers(),await this._reserveBootstrapRelayAddrs()}catch{
return}if(!this._hasBootstrapRelayConnections())return;const o=this._getAnnounceAddrs().filter(a=>a.includes("/p2p-circu\
it"));await this.sendToPeer(e,{type:"relay-assist-ready",readyAt:Date.now(),multiaddrs:o}),this._publishPresenceNow().catch(
()=>{}),this._scheduleAutoRelayDrop()}async _handleRelayAssistReady(e,t={}){const r=this.relayAssistState.pendingReadyTimeouts.
get(e);r&&(clearTimeout(r),this.relayAssistState.pendingReadyTimeouts.delete(e)),Array.isArray(t.multiaddrs)&&t.multiaddrs.
length>0&&this._rememberPeerAddresses(e,t.multiaddrs),this.peerConnectionRecovery?.notifyRelayReady(e),await this._maybeDialPeer(
e,"relay-assist-ready",t.multiaddrs||null,{force:!0})}_isLocalOrLanMultiaddr(e){return typeof e!="string"||!e?!1:/\/ip4\/(?:10\.|127\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/.
test(e)||/\/ip6\/(?:fe80:|fc|fd|::1\b)/i.test(e)||/\/dns[46]?\/(?:localhost\b|[^/]+(?:\.local|\.lan|\.ts\.net)\b)/i.test(
e)}_isBootstrapRelayConnected(e){return!e||!this.libp2p?.getConnections?!1:this._getConnectionsForPeer(e).some(ee)}_getTargetAnnouncedRelayIds(e){
const t=new Set;if(!e)return t;const r=[],s=this.peers.get(e);Array.isArray(s?.multiaddrs)&&r.push(...s.multiaddrs);const i=this.
peerDialAddrCache?.get?.(e);i&&Array.isArray(i.addrs)&&r.push(...i.addrs);for(const o of r){const a=typeof o=="string"?o:
o?.toString?.();if(!a||!a.includes("/p2p-circuit"))continue;const c=a.split("/p2p-circuit")[0],l=ta(c);l&&t.add(l)}return t}_rankBootstrapAddrs(e=null){
const t=(this.config.bootstrapPeers||[]).filter(c=>typeof c=="string"&&c.includes("/p2p/")).map((c,l)=>({addr:wn(c),index:l}));
if(t.length<=1)return t.map(c=>c.addr);const r=Date.now(),s=this._hasLocalIpv6Addrs(),i=this.config.preferLocalRelay!==!1,
o=e?this._getTargetAnnouncedRelayIds(e):new Set,a=t.map(({addr:c,index:l})=>{const u=ta(c),h=this._isBootstrapRelayConnected(
u),d=this.bootstrapRelayHealth.get(c)||null,p=!!(d&&d.ok===!1&&Number.isFinite(d.lastFailAt)&&(!Number.isFinite(d.lastOkAt)||
d.lastFailAt>d.lastOkAt)&&r-d.lastFailAt<W7),v=this._isLocalOrLanMultiaddr(c),g=s?c.includes("/ip6/")||c.includes("/dns6\
/"):c.includes("/ip4/")||c.includes("/dns4/"),E=o.size>0&&u&&o.has(u),f=Number.isFinite(d?.rttMs)?d.rttMs:Number.POSITIVE_INFINITY;
return{addr:c,index:l,connected:h,recentlyFailed:p,isLan:v,matchesFamily:g,targetMatch:E,rttMs:f}});return a.sort((c,l)=>c.
targetMatch!==l.targetMatch?c.targetMatch?-1:1:c.connected!==l.connected?c.connected?-1:1:c.recentlyFailed!==l.recentlyFailed?
c.recentlyFailed?1:-1:i&&c.isLan!==l.isLan?c.isLan?-1:1:c.matchesFamily!==l.matchesFamily?c.matchesFamily?-1:1:c.rttMs!==
l.rttMs?c.rttMs-l.rttMs:c.index-l.index),a.map(c=>c.addr)}_buildCircuitAddr(e){if(!e||!this.config.bootstrapPeers?.length)
return null;try{const t=this._rankBootstrapAddrs(e);if(t.length===0)return null;const r=t[0],s=wn(r);return O(`${s}/p2p-\
circuit/p2p/${e}`)}catch(t){return V("[NetworkManager] Failed to build circuit addr:",t?.message||t),null}}_scheduleAutoRelayDrop(){
const e=this.config.webrtc?.autoDropRelayAfterDialMs??6e4;e<=0||(this.relayReconnectState.autoDisconnectTimer&&clearTimeout(
this.relayReconnectState.autoDisconnectTimer),this.relayReconnectState.autoDisconnectTimer=setTimeout(()=>{this.relayReconnectState.
autoDisconnectTimer=null,this.relayReconnectState.pendingDialsNeedingRelay.clear(),It("[NetworkManager] Auto-dropping re\
lay after dial timeout"),this._maybeUpdateBootstrapRelayConnections()},e))}_getDialBackoffEntry(e,t=Date.now()){const r=this.
peerDialBackoff.get(e);return r?r.until<=t?(this.peerDialBackoff.delete(e),null):r:null}_recordDialFailureBackoff(e,t,r){
if(!e)return;const s=Date.now();this.dialFailureCount=(this.dialFailureCount||0)+1,this.lastDialFailureAt=s;const i=this.
_getDialBackoffEntry(e,s),o=r9(r)||t==="webrtc-relay",a=Number.isFinite(this.config.webrtc?.dialFailureBackoffBaseMs)?this.
config.webrtc.dialFailureBackoffBaseMs:Vv,c=Number.isFinite(this.config.webrtc?.dialFailureBackoffMaxMs)?Math.max(a,this.
config.webrtc.dialFailureBackoffMaxMs):qv,l=o?Math.min((i?.attempts||0)+1,8):1,u=o?Math.min(c,a*2**(l-1)):Math.min(c,Math.
max(a,5e3));this.peerDialBackoff.set(e,{attempts:l,until:s+u,transient:o,reason:String(r?.message||r||"")})}_clearDialFailureBackoff(e){
e&&this.peerDialBackoff.delete(e)}_shouldElectRelayRedial(e=Date.now(),t={}){const r=t?.allowWithBootstrap===!0;if(e<this.
relayKeeperUntil)return!0;if(!this.peerId||!this.config.bootstrapPeers?.length||!r&&this._hasBootstrapRelayConnections())
return!1;const s=Number.isFinite(this.config.presenceIntervalMs)?this.config.presenceIntervalMs:3e3,i=Number.isFinite(this.
config.peerStaleMs)?this.config.peerStaleMs:Math.max(3e4,s*3),o=this._getScopedPeers().filter(l=>{const u=Number(l?.lastSeen??
0);return u?e-u<=i:!1});if(o.some(l=>l?.relayConnected===!0||l?.relayKeeper===!0))return!1;const a=o.map(l=>({peerId:l.peerId,
activeConnections:Number.isFinite(l.activeConnections)?l.activeConnections:1/0}));a.push({peerId:this.peerId,activeConnections:this.
_getActiveConnectionCount()}),a.sort((l,u)=>l.activeConnections!==u.activeConnections?l.activeConnections-u.activeConnections:
String(l.peerId).localeCompare(String(u.peerId)));const c=a[0]?.peerId===this.peerId;if(c){const l=Number.isFinite(this.
config.webrtc?.relayElectionStickyMs)?Math.max(0,this.config.webrtc.relayElectionStickyMs):zv;this.relayKeeperUntil=e+l,
this._publishPresenceNow().catch(()=>{})}return c}_scheduleIsolationRelayRedial(){this.libp2p&&this.config.bootstrapPeers?.
length&&(this.isolationReconnectTimer||(this.isolationReconnectTimer=setTimeout(()=>{this.isolationReconnectTimer=null,!(this.
_getActiveConnectionCount()>0)&&(this._hasBootstrapRelayConnections()||this._maybeRedialBootstrapPeers())},400)))}_shouldDialDiscoveredPeer(e){
if(!e)return!1;const t=this._getConnectionsForPeer(e),r=t.length>0&&t.some(h=>ei(h?.remoteAddr))&&!t.some(h=>Yn(h?.remoteAddr)),
s=this._countDialedPeers(),i=this.config.allowDiscoveryDialWhenIsolated&&s===0;if(!(!this.config.enforceRoomIsolation||this.
bootstrapPeerIds.has(e)||this.peers.has(e)||i))return!1;if(this.bootstrapPeerIds.has(e))return!(this.config.webrtc?.dropRelayBootstrapOnDirect&&
this._hasDirectPeerConnections());if((this.config.topology==="throughput"||this.config.topology==="static")&&this.topologyController&&
!this.topologyController.desiredPeers.has(e))return!1;if(r&&this.config.webrtc?.preferDirect!==!1)return!0;if(!this._hasAvailableLogicalPeerSlot(
e))return!1;const a=this.config.maxDialPeers;if(Number.isFinite(a)&&(a<=0||this._countDialedPeers()>=a))return!1;const c=Number.
isFinite(this.config.targetConnections)?this.config.targetConnections:null,l=this._getActiveDialedPeerCount(),u=Number.isFinite(
c)&&l<c;return!(this.topologyController&&!u&&!this.topologyController.shouldDialPeer(e))}_pruneStalePeers(e=Date.now()){
const t=this.config.peerStaleMs,r=Number.isFinite(this.config.presenceIntervalMs)?this.config.presenceIntervalMs:3e3,s=Number.
isFinite(t)?t:Math.max(3e4,r*3);if(!(s<=0))for(const[i,o]of this.peers.entries()){if(!i)continue;const a=Number(o?.lastSeen??
o?.lastMessageTime??o?.connectedAt??o?.joinedAt??0);if(!a||e-a<=s||this._getConnectionsForPeer(i).some(h=>h?.status!=="c\
losed"))continue;this.peers.delete(i),this._dropPubsubPeer(i),this.recentDialAttempts.delete(i),this.peerDialBackoff.delete(
i),this._clearPendingLogicalReservations(i),this._clearRelayPruneTimer(i),this.relayReservationPeers.delete(i),this.relayAssistState?.
lastRequestAt?.delete?.(i),this.relayAssistState?.inboundRequestAt?.delete?.(i);const u=this.relayAssistState?.pendingReadyTimeouts?.
get?.(i);u&&(clearTimeout(u),this.relayAssistState.pendingReadyTimeouts.delete(i))}}_touchPeer(e,t){const s={...this.peers.
get(e)||{},...t},i=Object.prototype.hasOwnProperty.call(t,"signalingPath"),o=Object.prototype.hasOwnProperty.call(t,"med\
iaPath"),a=Nm(s.via);if(i)s.signalingPath=Wn(s.signalingPath);else{const c=Wn(s.signalingPath)||Wn(a.signalingPath);c&&(s.
signalingPath=c)}if(o)s.mediaPath=yn(s.mediaPath);else{const c=yn(s.mediaPath)||yn(a.mediaPath);c&&(s.mediaPath=c)}this.
peers.set(e,s)}_recordRx(e,t){if(this.telemetry.rxCount+=1,this.telemetry.rxBytes+=t||0,!e)return;const r=this.peers.get(
e)||{};this.peers.set(e,{...r,rxCount:(r.rxCount||0)+1,rxBytes:(r.rxBytes||0)+(t||0),lastRxAt:Date.now()})}_recordPubsubRx(e){
this.telemetry.pubsubRxCount+=1,this.telemetry.pubsubRxBytes+=e||0,this.telemetry.pubsubLastRxAt=Date.now()}_recordTx(e,t){
if(this.telemetry.txCount+=1,this.telemetry.txBytes+=t||0,!e)return;const r=this.peers.get(e)||{};this.peers.set(e,{...r,
txCount:(r.txCount||0)+1,txBytes:(r.txBytes||0)+(t||0),lastTxAt:Date.now()})}_recordPubsubTx(e){this.telemetry.pubsubTxCount+=
1,this.telemetry.pubsubTxBytes+=e||0,this.telemetry.pubsubLastTxAt=Date.now()}_getRelayRetentionConfig(){return this.config.
webrtc?.relayRetention||null}_getRetentionCandidates(){const e=new Map;if(this._getScopedPeers().forEach(r=>{const s=r?.
peerId;if(!s)return;const i=Number(r.joinedAt??r.connectedAt??r.lastSeen),o=e.get(s);(!o||Number.isFinite(i)&&i<o)&&e.set(
s,Number.isFinite(i)?i:1/0)}),this.peerId){const r=Number(this.joinedAt??Date.now()),s=e.get(this.peerId);(!s||r<s)&&e.set(
this.peerId,r)}return Array.from(e.entries()).map(([r,s])=>({peerId:r,joinedAt:s}))}_getRelayRetentionKeepCount(e,t){if(!e||
e<=0)return 0;const r=t?.mode||"logn";let s=0;if(r==="sqrt")s=Math.ceil(Math.sqrt(e));else{const i=t?.base||2,o=Math.log(
e)/Math.log(i);s=Math.ceil(o)}return s=Math.max(t.min??1,s),Number.isFinite(t.max)&&(s=Math.min(s,t.max)),s}_shouldKeepRelayBootstrapConnection(){
return this._evaluateRelayBootstrapRetention(Date.now()).shouldKeepRelay}_startPresence(){this._clearPresenceTimer();const e=()=>this.
_publishPresenceNow(),t=()=>{this._maybeUpdateBootstrapRelayConnections(),this._ensureRelayReservation(),e().catch(()=>{})};
t(),this.presenceInterval=setInterval(()=>{t()},this.config.presenceIntervalMs||3e3)}_ensureRelayReservation(){if(!this.
libp2p||!this.peerId||!this._hasBootstrapRelayConnections())return;const e=this.libp2p.components?.addressManager;if(!e?.
confirmObservedAddr)return;const t=this.peerId;for(const r of this.config.bootstrapPeers||[]){if(typeof r!="string"||!r.
includes("/p2p/"))continue;const s=wn(r),i=`${s}/p2p-circuit/p2p/${t}`,o=`${s}/p2p-circuit/webrtc/p2p/${t}`;try{e.confirmObservedAddr(
O(i),{type:"transport"}),e.confirmObservedAddr(O(o),{type:"transport"})}catch{}}}_buildPresencePayload(){if(!this.peerId)
return null;const e=this._getActiveDialedPeerCount(),t=this._getPresenceCapabilities();return{type:"presence",from:this.
peerId,gameId:this.config.gameId,roomId:this.config.roomId,topologyId:this.config.topologyId,topologyType:this.config.topology,
shardId:this.topologyShardId,metric:{...this.topologyMetric},metricInitialized:this.metricInitialized,joinedAt:this.joinedAt,
targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections,transportMaxConnections:this._getTransportMaxConnections(
this.config.maxConnections),activeConnections:e,relayConnected:this._hasBootstrapRelayConnections(),relayKeeper:this._isRelayKeeper(
Date.now()),...t?{capabilities:t}:{},multiaddrs:this._getAnnounceAddrs()}}_getPresenceCapabilities(){if(typeof this.config.
presenceCapabilitiesProvider!="function")return null;try{return Dm(this.config.presenceCapabilitiesProvider({peerId:this.
peerId,networkManager:this}))}catch(e){return V("[NetworkManager] Presence capabilities provider failed",e),null}}async _publishPresenceNow(){
const e=this._buildPresencePayload();e&&await this._publish(this.config.presenceTopic,e)}_clearPresenceTimer(){this.presenceInterval&&
(clearInterval(this.presenceInterval),this.presenceInterval=null)}async queryPeerDirectory(e){if(!this.libp2p?.services?.
pubsub||!this.isConnected||!this.config.enablePeerDirectory)return null;const t=this.libp2p.services.pubsub;if(typeof t.
getSubscribers=="function"){const i=t.getSubscribers(this.config.directoryTopic);if(Array.isArray(i)&&i.length===0)return null}
const r=`${this.peerId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,s={type:"directory-query",requestId:r,targetPeerId:e,
from:this.peerId};return new Promise(i=>{const o=this.config.directoryQueryTimeoutMs,a=setTimeout(()=>{this.pendingDirectoryQueries.
delete(r),i(null)},o);this.pendingDirectoryQueries.set(r,{resolve:i,timeout:a}),this._publish(this.config.directoryTopic,
s).catch(()=>{clearTimeout(a),this.pendingDirectoryQueries.delete(r),i(null)})})}_handleDirectoryMessage(e){try{const t=typeof e==
"string"?JSON.parse(e):e;if(t.type!=="directory-response")return;const r=this.pendingDirectoryQueries.get(t.requestId);if(!r)
return;clearTimeout(r.timeout),this.pendingDirectoryQueries.delete(t.requestId),t.found&&Array.isArray(t.multiaddrs)?(this.
_rememberPeerAddresses(t.targetPeerId,t.multiaddrs),r.resolve({peerId:t.targetPeerId,multiaddrs:t.multiaddrs,lastSeen:t.
lastSeen,metadata:t.metadata})):r.resolve(null)}catch{}}async registerWithDirectory(){if(!this.libp2p?.services?.pubsub||
!this.isConnected||!this.config.enablePeerDirectory)return;const e={type:"directory-register",from:this.peerId,multiaddrs:this.
_getAnnounceAddrs(),roomId:this.config.roomId,topologyId:this.config.topologyId,shardId:this.topologyShardId};await this.
_publish(this.config.directoryTopic,e)}_updateShardState(e=!1){if(!this.topologyController||!this.config.enableSharding)
return;const t=this.topologyController.getShardId(this.topologyMetric);if(!e&&t===this.topologyShardId)return;this.topologyShardId=
t;const r=this.topologyController.getNeighborShardIds(this.topologyMetric);this._syncShardSubscriptions(r)}_getShardTopics(e=[]){
return this.config.useScopedTopics?e.map(t=>Ks(this.config.topicPrefix,this.config.topologyId,this.config.roomId,`shard.${t}`)):
[]}_getShardSnapshotTopic(){return!this.config.enableSharding||!this.config.useScopedTopics||!this.topologyShardId?null:
Ks(this.config.topicPrefix,this.config.topologyId,this.config.roomId,`shard.${this.topologyShardId}`)}_syncShardSubscriptions(e=[]){
if(!this.config.enableSharding||!this.libp2p?.services?.pubsub)return;const t=new Set(this._getShardTopics(e));for(const r of t)
this.shardTopics.has(r)||this.libp2p.services.pubsub.subscribe(r),this.allowedTopics.add(r);for(const r of Array.from(this.
shardTopics))t.has(r)||(this.libp2p.services.pubsub.unsubscribe?.(r),this.allowedTopics.delete(r));this.shardTopics=t}_startTopologyController(){
if(!this.topologyController||this.topologyTimer)return;const e=()=>{this._tickTopology(),this.topologyTimer=setTimeout(e,
this.config.topologyTickMs||1500)};this._tickTopology(!0),this.topologyTimer=setTimeout(e,this.config.topologyTickMs||1500)}_stopTopologyController(){
this.topologyTimer&&(clearTimeout(this.topologyTimer),this.topologyTimer=null)}_tickTopology(e=!1){if(!this.topologyController||
!this.isConnected)return;const t=Date.now();this._pruneStalePeers(t),this.config.enableSharding&&this._updateShardState(
e);const r=this._getScopedPeers(),s=this._getConnectionPeers();if(this.config.topology==="throughput"){this._tickThroughputTopology(
t,r,s);return}if(this.config.topology==="static"){this._tickStaticTopology(s);return}const i=this.topologyController.computeDesiredPeers(
{peers:r,connections:s,now:t});this._pruneExcessTopologyConnections(i,r,s),this._maybeSwapTopologyConnections(i,r,s),this.
_ensureTopologyConnections(i)}setStaticTopologyPeers(e=[]){this.staticTopologyPeers=new Set((Array.isArray(e)?e:[]).filter(
Boolean)),this.topologyController&&(this.topologyController.desiredPeers=new Set(this.staticTopologyPeers))}_tickStaticTopology(e){
const t=this.staticTopologyPeers;if(t){for(const r of Array.isArray(e)?e:[])r?.peerId&&!t.has(r.peerId)&&!this.bootstrapPeerIds.
has(r.peerId)&&this._closeConnectionsToPeer(r.peerId);this._ensureTopologyConnections(t)}}recordPeerWork(e,t=1){if(this.
config.topology!=="throughput"||!e||!Number.isFinite(t)||t<=0)return;const r=this.peerWork.get(e)||{total:0,sampledTotal:0,
sampledAt:null,rate:0};r.total+=t,this.peerWork.set(e,r)}_samplePeerWorkRates(e,t){const r=Number.isFinite(this.config.throughputTopology?.
flowTauMs)?Math.max(1,this.config.throughputTopology.flowTauMs):4e3;if(this.config.throughputSignal==="bytes")for(const s of t){
const i=this.peerWork.get(s.peerId)||{total:0,sampledTotal:0,sampledAt:null,rate:0};i.total=(s.rxBytes||0)+(s.txBytes||0),
i.sampledAt===null&&(i.sampledTotal=i.total),this.peerWork.set(s.peerId,i)}for(const[s,i]of this.peerWork){if(i.sampledAt===
null){i.sampledAt=e,i.sampledTotal=Math.min(i.sampledTotal,i.total);continue}const o=e-i.sampledAt;if(o<=0)continue;const a=Math.
max(0,i.total-i.sampledTotal)*1e3/o;i.rate+=(a-i.rate)*(1-Math.exp(-o/r)),i.sampledTotal=i.total,i.sampledAt=e,i.rate<1e-6&&
!this.peers.has(s)&&this.peerWork.delete(s)}}_tickThroughputTopology(e,t,r){const s=(Array.isArray(r)?r:[]).filter(g=>g?.
peerId&&!this.bootstrapPeerIds.has(g.peerId));this._samplePeerWorkRates(e,s);const i=g=>this.peerWork.get(g)?.rate||0,o=new Set(
s.map(g=>g.peerId)),a=s.map(g=>{const E=this.peers.get(g.peerId);return E&&!E.linkSince&&(E.linkSince=Number(E.connectedAt)||
e),{peerId:g.peerId,flow:i(g.peerId),since:E?.linkSince??e}});for(const[g,E]of this.peers)!o.has(g)&&E?.linkSince&&delete E.
linkSince;this._prunePendingLogicalReservations(e);for(const[g,E]of this.throughputPendingLinks){const f=typeof E=="numb\
er"?E:E?.until,b=typeof E=="number"?e:E?.startedAt??e;if(!Number.isFinite(f)||f<=e||o.has(g)){this.throughputPendingLinks.
delete(g);continue}a.push({peerId:g,flow:0,since:e,setupStartedAt:b}),o.add(g)}const c=(Array.isArray(t)?t:[]).filter(g=>g?.
peerId&&g.peerId!==this.peerId&&!o.has(g.peerId)&&!this.bootstrapPeerIds.has(g.peerId)),l=c.map(g=>g.peerId),u=c.filter(
g=>Number.isFinite(g.activeConnections)&&Number.isFinite(g.targetConnections)&&g.activeConnections<g.targetConnections).
map(g=>g.peerId),h=[...new Set([...l.filter(g=>i(g)>0).sort((g,E)=>i(E)-i(g)),...l.filter(g=>this.topologyController?.referralPeers?.
has(g))])],d={targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections,flowTauMs:Number.
isFinite(this.config.throughputTopology?.flowTauMs)?Math.max(1,this.config.throughputTopology.flowTauMs):4e3,...this.config.
throughputTopology},p=d.profile;if(p&&p!=="batch-throughput"&&typeof d.scoreLink!="function"&&typeof d.scoreCandidate!="\
function"){const g=new Map;for(const f of Array.isArray(t)?t:[])f?.peerId&&g.set(f.peerId,f);for(const f of s)f?.peerId&&
g.set(f.peerId,{...g.get(f.peerId)||{},...f});const E=C7(p,f=>{const b=this.peers.get(f)||{},_=g.get(f)||{},m=this._getPreferredConnectionMeta(
f);return{...b,..._,icePath:m?.icePath??_.icePath??b.icePath??null,candidatePairRttMs:m?.candidatePairRttMs??_.candidatePairRttMs??
b.candidatePairRttMs??null,rttMs:_.rttMs??b.rttMs??null,capabilities:_.capabilities??b.capabilities??null,hostGroupId:_.
hostGroupId??b.hostGroupId??null,multiaddrs:_.multiaddrs??b.multiaddrs??this.peerDialAddrCache?.get?.(f)?.addrs??[]}},{...d,
localHostGroupId:this.config.hostGroupId||null});E.scoreLink&&(d.scoreLink=E.scoreLink),E.scoreCandidate&&(d.scoreCandidate=
E.scoreCandidate)}const v=M7({now:e,links:a,candidates:l,referrals:h,available:u,state:this.throughputTopologyState,config:d});
for(const g of v.drop)o.delete(g),this._closeConnectionsToPeer(g);v.connect&&o.add(v.connect);for(const g of this.pendingTopologyAccepts.
keys())o.add(g);if(this.topologyController&&(this.topologyController.desiredPeers=o),v.connect){const g=Number.isFinite(
this.config.throughputTopology?.linkSetupMs)?this.config.throughputTopology.linkSetupMs:15e3;this.throughputPendingLinks.
set(v.connect,{startedAt:e,until:e+g}),this._ensureTopologyConnections(new Set([v.connect]))}}_pruneExcessTopologyConnections(e,t,r){
if(!this.topologyController||this.config.topology!=="distributed")return;const s=Number.isFinite(this.config.maxConnections)?
Math.max(1,this.config.maxConnections):0;if(s<=0)return;const i=(Array.isArray(r)?r:[]).filter(h=>h?.peerId&&!this.bootstrapPeerIds.
has(h.peerId)),o=i.length-s;if(o<=0)return;const a=e instanceof Set?e:new Set,c=new Map;t.forEach(h=>{h?.peerId&&c.set(h.
peerId,h)}),i.forEach(h=>{h?.peerId&&!c.has(h.peerId)&&c.set(h.peerId,h)});const l=new Set(this.bootstrapPeerIds);if(this.
topologyController.longRangePeers)for(const h of this.topologyController.longRangePeers)l.add(h);const u=i.filter(h=>!a.
has(h.peerId)).filter(h=>!l.has(h.peerId)).map(h=>{const d=c.get(h.peerId)||h,p=this.topologyController.getPeerDistance(
d),v=Number.isFinite(d?.activeConnections)?d.activeConnections:0,g=Number(d?.joinedAt??d?.connectedAt??0);return{peerId:h.
peerId,via:h?.via||d?.via||null,distance:Number.isFinite(p)?p:Number.POSITIVE_INFINITY,activeConnections:v,joinedAt:Number.
isFinite(g)?g:0}});u.length!==0&&(u.sort((h,d)=>{const p=Jo(h.via),v=Jo(d.via);return p!==v?p?-1:1:h.distance!==d.distance?
d.distance-h.distance:h.activeConnections!==d.activeConnections?d.activeConnections-h.activeConnections:h.joinedAt!==d.joinedAt?
d.joinedAt-h.joinedAt:String(h.peerId).localeCompare(String(d.peerId))}),u.slice(0,o).forEach(h=>{this._closeConnectionsToPeer(
h.peerId)}))}_maybeSwapTopologyConnections(e,t,r){if(!this.topologyController||this.config.topology!=="distributed")return;
const s=this.config.maxConnections;if(!Number.isFinite(s)||s<=0||this._getActiveDialedPeerCount()<s||!e||e.size===0)return;
const i=new Map;t.forEach(S=>{S?.peerId&&i.set(S.peerId,S)});const o=r.filter(S=>S?.peerId&&!this.bootstrapPeerIds.has(S.
peerId));if(o.length===0)return;const a=new Set(o.map(S=>S.peerId)),c=this.config.allowRelayWhenIsolated!==!1,l=o.some(S=>Rm(
S?.via));if(c&&!l)return;const u=(S,x)=>{const C=x?.activeConnections,I=this.topologyController.getPeerDistance(x||{peerId:S}),
M=Number.isFinite(I)?I:Number.POSITIVE_INFINITY;return{peerId:S,distance:M,noConnections:C===0}},h=(S,x)=>S.noConnections!==
x.noConnections?S.noConnections?-1:1:S.distance!==x.distance?S.distance-x.distance:String(S.peerId).localeCompare(String(
x.peerId)),d=S=>({x:Number.isFinite(S?.x)?S.x:0,y:Number.isFinite(S?.y)?S.y:0,z:Number.isFinite(S?.z)?S.z:0}),p=S=>{if(!S?.
metric||typeof S.metric!="object")return!1;const x=S.metricInitialized===!0,C=d(S.metric),I=C.x===0&&C.y===0&&C.z===0;return x||
!I},v=(S,x)=>{if(!p(S)||!p(x))return Number.POSITIVE_INFINITY;const C=d(S.metric),I=d(x.metric),M=C.x-I.x,k=C.y-I.y,$=C.
z-I.z;return Math.sqrt(M*M+k*k+$*$)},g=Array.from(e).filter(S=>!a.has(S)).map(S=>u(S,i.get(S))).filter(S=>Number.isFinite(
S.distance));if(g.length===0)return;g.sort(h);const E=g[0];if(!E)return;const f=new Set(this.bootstrapPeerIds);if(this.topologyController.
longRangePeers)for(const S of this.topologyController.longRangePeers)f.add(S);const b=o.filter(S=>S?.peerId).filter(S=>!e.
has(S.peerId)).filter(S=>!f.has(S.peerId)).filter(S=>!(c&&Jo(S?.via)&&!l)).map(S=>u(S.peerId,S));if(b.length===0)return;
b.sort(h);const _=b[b.length-1];if(!_||h(E,_)>=0)return;const m=Number.isFinite(this.config.swapHysteresisRatio)?Math.min(
.9,Math.max(0,this.config.swapHysteresisRatio)):ou;if(!E.noConnections&&Number.isFinite(_.distance)&&E.distance>=_.distance*
(1-m))return;const y=i.get(_.peerId),A=Number.isFinite(y?.activeConnections)?y.activeConnections-1:null;if(!Number.isFinite(
A)||A<2||!Number.isFinite(_.distance))return;let w=0;for(const S of t){if(!S?.peerId||S.peerId===_.peerId||S.peerId===this.
peerId)continue;const x=v(y,S);if(Number.isFinite(x)&&x<_.distance&&(w+=1,w>=2))break}w<2||this._closeConnectionsToPeer(
_.peerId)}_ensureTopologyConnections(e){if(!e||e.size===0)return;const t=Date.now();this._prunePendingLogicalReservations(
t);for(const r of e)r&&(this.peers.get(r)?.connectedAt||this.pendingTopologyRequests.has(r)||this._hasAvailableLogicalPeerSlot(
r,t)&&(this.pendingTopologyRequests.set(r,{sentAt:t,expiresAt:t+Qo}),this.sendToPeer(r,{type:"topology-connect-request",
metric:this.topologyMetric,targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections}).catch(
()=>{this.pendingTopologyRequests.delete(r)})))}_isIntentionallyClosed(e,t=Date.now()){if(!e)return!1;const r=this.intentionalCloseUntil.
get(e);return Number.isFinite(r)?r<=t?(this.intentionalCloseUntil.delete(e),!1):!0:!1}_recordTopologyRewire(e=Date.now()){
this.topologyRewireTimestamps.push(e);const t=e-6e4;for(;this.topologyRewireTimestamps.length>0&&this.topologyRewireTimestamps[0]<
t;)this.topologyRewireTimestamps.shift()}_getRewiresPerMin(e=Date.now()){const t=e-6e4;for(;this.topologyRewireTimestamps.
length>0&&this.topologyRewireTimestamps[0]<t;)this.topologyRewireTimestamps.shift();return this.topologyRewireTimestamps.
length}_closeConnectionsToPeer(e){if(!this.libp2p?.getConnections||!e)return!1;const t=Date.now(),r=this._getConnectionsForPeer(
e);if(this.topologyLinkReleasers.size>0&&r.some(i=>ee(i)&&this._getPeerConnectionRecovery().protectionMs(i)<=0))for(const i of this.
topologyLinkReleasers)try{i(e)}catch{}this._closeDirectUnicastStream(e);let s=0;return r.forEach(i=>{this._retireIdleConnection(
i,"topology")&&(s+=1)}),s>0&&(this.intentionalCloseUntil.set(e,t+Y7),this._recordTopologyRewire(t)),s>0}_hasActiveApplicationStreams(e){
const t=this.libp2p?.services??{},r=new Set([...J7,t.identify?.protocol,t.identifyPush?.protocol,t.ping?.protocol,t.pubsub?.
protocol,...t.pubsub?.protocols??[],...t.pubsub?.multicodecs??[]].filter(Boolean));return(e.streams??[]).some(s=>typeof s.
protocol=="string"&&s.protocol.length>0&&!["closed","aborted","reset"].includes(s.status)&&!r.has(s.protocol))}_retireIdleConnection(e,t){
return!ee(e)||this._getPeerConnectionRecovery().protectionMs(e)>0||this._hasActiveApplicationStreams(e)?!1:(this._infoLog(
"[NetworkManager] Retiring idle connection",e.remotePeer?.toString?.(),e.id,t,ot(e.remoteAddr)),e.close?.().catch?.(()=>{}),
!0)}_handleTopologyMessage(e,t){if(!e||typeof e.type!="string"||!e.type.startsWith("topology-"))return!1;const r=t?.from||
e.from;return!r||r===this.peerId?!0:e.type==="topology-connect-request"?(this._handleTopologyConnectRequest(r,e),!0):e.type===
"topology-connect-accept"?(this._handleTopologyConnectAccept(r),!0):(e.type==="topology-connect-referral"&&this._handleTopologyConnectReferral(
r,e),!0)}_handleTopologyConnectRequest(e,t={}){if(!e)return;const r=Date.now();this._prunePendingLogicalReservations(r);
const s=()=>{this.pendingTopologyAccepts.set(e,{reservedAt:r,expiresAt:r+Qo}),this.config.topology==="throughput"&&this.
topologyController?.desiredPeers?.add(e),this.sendToPeer(e,{type:"topology-connect-accept"}).catch(()=>{this.pendingTopologyAccepts.
delete(e)})};if(this.config.topology==="static"){this.staticTopologyPeers?.has(e)&&s();return}if(!this._hasAvailableLogicalPeerSlot(
e,r)){if(this.topologyController&&this.config.topology!=="throughput"){const o=t?.metric||this.peers.get(e)?.metric||null,
a=t?.metric?!0:this.peers.get(e)?.metricInitialized===!0,c=this.topologyController.getPeerDistance({peerId:e,metric:o,metricInitialized:a});
if(Number.isFinite(c)){const l=this._getConnectionPeers().filter(d=>d?.peerId&&!this.bootstrapPeerIds.has(d.peerId)),u=this.
config.allowRelayWhenIsolated!==!1,h=l.some(d=>Rm(d?.via));if(!(u&&!h)&&l.length>0){const d=new Set(this.bootstrapPeerIds);
if(this.topologyController.longRangePeers)for(const f of this.topologyController.longRangePeers)d.add(f);const p=f=>({x:Number.
isFinite(f?.x)?f.x:0,y:Number.isFinite(f?.y)?f.y:0,z:Number.isFinite(f?.z)?f.z:0}),v=f=>{if(!f?.metric||typeof f.metric!=
"object")return!1;const b=f.metricInitialized===!0,_=p(f.metric),m=_.x===0&&_.y===0&&_.z===0;return b||!m},g=(f,b)=>{if(!v(
f)||!v(b))return Number.POSITIVE_INFINITY;const _=p(f.metric),m=p(b.metric),y=_.x-m.x,A=_.y-m.y,w=_.z-m.z;return Math.sqrt(
y*y+A*A+w*w)},E=l.filter(f=>f?.peerId).filter(f=>!d.has(f.peerId)).filter(f=>!(u&&Jo(f?.via)&&!h)).map(f=>({peer:f,distance:this.
topologyController.getPeerDistance(f)})).filter(f=>Number.isFinite(f.distance));if(E.length>0){E.sort((_,m)=>m.distance-
_.distance);const f=E[0],b=Number.isFinite(this.config.swapHysteresisRatio)?Math.min(.9,Math.max(0,this.config.swapHysteresisRatio)):
ou;if(c<f.distance*(1-b)){const _=f.peer,m=Number.isFinite(_?.activeConnections)?_.activeConnections-1:null;if(Number.isFinite(
m)&&m>=2){let y=0;const A=this._getScopedPeers();for(const w of A){if(!w?.peerId||w.peerId===_.peerId||w.peerId===this.peerId)
continue;const S=g(_,w);if(Number.isFinite(S)&&S<f.distance&&(y+=1,y>=2))break}if(y>=2&&this._closeConnectionsToPeer(_.peerId)){
s();return}}}}}}}const i=this._getScopedPeers().filter(o=>o.peerId&&o.peerId!==this.peerId).filter(o=>!Number.isFinite(o.
targetConnections)||!Number.isFinite(o.activeConnections)?!0:o.activeConnections<o.targetConnections).slice(0,5).map(o=>o.
peerId);this.sendToPeer(e,{type:"topology-connect-referral",peers:i}).catch(()=>{});return}s()}_handleTopologyConnectAccept(e){
e&&(this._prunePendingLogicalReservations(),this._maybeDialPeer(e,"topology-accept").catch(()=>{}).finally(()=>{this._getConnectionsForPeer(
e).some(ee)||this.pendingTopologyRequests.delete(e)}))}_handleTopologyConnectReferral(e,t){this.pendingTopologyRequests.
delete(e),this.throughputPendingLinks.delete(e);const r=Array.isArray(t?.peers)?t.peers:[];this.topologyController&&this.
topologyController.addReferralPeers(r)}_startTelemetrySampler(){if(!this.config.enableTelemetry||this.telemetryTimer)return;
const e=this.config.telemetrySampleMs||1e3,t=()=>{this._sampleTelemetry(Date.now()),this.telemetryTimer=setTimeout(t,e)};
this.telemetryTimer=setTimeout(t,e)}_stopTelemetrySampler(){this.telemetryTimer&&(clearTimeout(this.telemetryTimer),this.
telemetryTimer=null)}_sampleTelemetry(e){const t=this.telemetrySample.at||e,r=e-t;if(r>0){const i=this.telemetry.rxBytes-
this.telemetrySample.rxBytes,o=this.telemetry.txBytes-this.telemetrySample.txBytes;this.telemetry.rxBps=Math.max(0,i*1e3/
r),this.telemetry.txBps=Math.max(0,o*1e3/r)}this.telemetrySample={rxBytes:this.telemetry.rxBytes,txBytes:this.telemetry.
txBytes,at:e};const s=this._getConnectionPeers();s.forEach(i=>{const o=i.peerId;if(!o)return;const a=this.peers.get(o)||
{},c=a.telemetrySample||{rxBytes:a.rxBytes||0,txBytes:a.txBytes||0,at:e},l=e-c.at;if(l>0){const u=(a.rxBytes||0)-c.rxBytes,
h=(a.txBytes||0)-c.txBytes;a.rxBps=Math.max(0,u*1e3/l),a.txBps=Math.max(0,h*1e3/l)}a.telemetrySample={rxBytes:a.rxBytes||
0,txBytes:a.txBytes||0,at:e},this.peers.set(o,a)}),this._sampleRtt(e,s),this._sampleAllConnectionIceStats(e)}async _sampleConnectionIceStats(e,t=null){
if(!e||!ee(e))return null;const r=t||e?.remotePeer?.toString?.()||null,s=ot(e?.remoteAddr),i=t9(e),o=Date.now();if(!i){const l=km(
s);if(l){const u={icePath:l,mediaPath:l==="circuit-relay"?"turn-relay":"direct",iceProtocol:s.includes("/udp/")?"udp":"t\
cp",candidatePairRttMs:null,sampledAt:o};return this.connectionIceStats.set(e,u),u}return null}const a=this.connectionIceStats.
get(e),c=this.config.iceStatsIntervalMs||au;if(a&&a.inFlight||a&&Number.isFinite(a.sampledAt)&&o-a.sampledAt<c&&a.icePath)
return a;this.connectionIceStats.set(e,{...a||{},inFlight:!0});try{const l=await i.getStats();if(!l||typeof l.forEach!="\
function")return null;const u=new Map;let h=null,d=null,p=null;l.forEach((w,S)=>{if(!w)return;const x=w.id||S;x&&u.set(x,
w),w.type==="transport"&&w.selectedCandidatePairId?h=w.selectedCandidatePairId:w.type==="candidate-pair"&&(w.selected||w.
nominated&&w.state==="succeeded"?d=w:!p&&w.state==="succeeded"&&(p=w))});const v=(h?u.get(h):null)||d||p;if(!v)return this.
connectionIceStats.set(e,{...a||{},inFlight:!1,sampledAt:Date.now()}),null;const g=v.localCandidateId?u.get(v.localCandidateId):
null,E=v.remoteCandidateId?u.get(v.remoteCandidateId):null,f=n9(g?.candidateType,E?.candidateType),b=g?.protocol||E?.protocol||
null,_=b?String(b).toLowerCase():null,m=Number(v.currentRoundTripTime),y=Number.isFinite(m)&&m>=0?Math.round(m*1e3):null,
A={icePath:f.icePath,mediaPath:f.mediaPath,iceProtocol:_,candidatePairRttMs:y,iceLocalType:g?.candidateType||null,iceRemoteType:E?.
candidateType||null,sampledAt:Date.now(),inFlight:!1};if(this.connectionIceStats.set(e,A),r&&ee(e)){const w={icePath:A.icePath,
iceProtocol:A.iceProtocol,candidatePairRttMs:A.candidatePairRttMs};A.mediaPath&&(w.mediaPath=A.mediaPath),Number.isFinite(
A.candidatePairRttMs)&&!Number.isFinite(this.peers.get(r)?.rttMs)&&(w.rttMs=A.candidatePairRttMs),this._touchPeer(r,w)}return A}catch{
return this.connectionIceStats.set(e,{...a||{},inFlight:!1,sampledAt:Date.now()}),null}}_sampleAllConnectionIceStats(e=Date.
now()){const t=this._getConnections(),r=this.config.iceStatsIntervalMs||au;for(const s of t){if(!ee(s))continue;const i=this.
connectionIceStats.get(s);i&&i.inFlight||i&&Number.isFinite(i.sampledAt)&&e-i.sampledAt<r||this._sampleConnectionIceStats(
s).catch(()=>{})}}_sampleRtt(e,t){const r=this.libp2p?.services?.ping?.ping;if(!r||!this.config.enableTelemetry)return;const s=this.
config.telemetryPingMs||5e3;t.forEach(i=>{const o=i.peerId;if(!o)return;const a=this.peers.get(o)||{};if(a.pingInFlight||
a.lastRttAt&&e-a.lastRttAt<s)return;let c=null;try{c=te(o)}catch{return}a.pingInFlight=!0,this.peers.set(o,a),r(c).then(
l=>{this._touchPeer(o,{rttMs:Math.round(l),lastRttAt:Date.now()})}).catch(()=>{this._touchPeer(o,{rttMs:null,lastRttAt:Date.
now()})}).finally(()=>{const l=this.peers.get(o)||{};l.pingInFlight=!1,this.peers.set(o,l)})})}_ensureScheduler(){this.scheduler||
(this.scheduler=new p7(this._buildSchedulerAdapter(),this.schedulerProfile),this.authorityId&&this.scheduler.setAuthority(
this.authorityId))}_startScheduler(){if(!this.schedulerEnabled||!this.isConnected||this.schedulerClock==="external"||!this.
scheduler||this.schedulerTimer)return;const e=()=>{this.scheduler&&(this.scheduler.tick(Date.now()),this.schedulerTimer=
setTimeout(e,this.scheduler.getTickIntervalMs()))};this.schedulerTimer=setTimeout(e,this.scheduler.getTickIntervalMs())}_stopScheduler(){
this.schedulerTimer&&(clearTimeout(this.schedulerTimer),this.schedulerTimer=null)}_buildSchedulerAdapter(){return{sendSnapshot:e=>this.
_sendScheduledSnapshot(e),sendCommand:e=>this._sendScheduledCommand(e),sendEvent:e=>this._sendScheduledEvent(e),reconnect:()=>this.
_schedulerReconnect(),getPeerId:()=>this.peerId,getAuthority:()=>this.authorityId,getGameId:()=>this.config.gameId,getRoomId:()=>this.
config.roomId,getTopologyId:()=>this.config.topologyId,getTopologyType:()=>this.config.topology,isInScope:e=>this._matchesScope(
e)}}async _sendScheduledSnapshot(e){if(!this.isConnected||this.schedulerProfile.snapshotsRequireAuthority&&this.authorityId&&
this.authorityId!==this.peerId)return;const t=this.scheduler?.getProfile()?.snapshotTopic||null,r=this._getShardSnapshotTopic(),
s=!t&&r,i=t||r||this.config.pubsubTopic,o=s?{...e,shardId:this.topologyShardId}:e;await this._publish(i,o)}async _sendScheduledCommand(e){
if(!this.isConnected)return;const t=this.scheduler?.getProfile()?.commandTopic||this.config.directTopic,r=this.authorityId&&
this.authorityId!==this.peerId?this.authorityId:null,s=r?{...e,target:r}:e;await this._publish(t,s)}async _sendScheduledEvent(e){
if(!this.isConnected)return;const t=this.scheduler?.getProfile()?.eventTopic||this.config.pubsubTopic;await this._publish(
t,e)}_schedulerReconnect(){const e=this.libp2p,t=this.connectionGeneration,r=()=>this.isConnected&&e===this.libp2p&&t===
this.connectionGeneration,s=()=>!!e?.services?.pubsub&&e.services.pubsub.isStarted?.()!==!1;if(!r()||!s())return Promise.
resolve();if(this.schedulerReconnect?.node===e&&this.schedulerReconnect.generation===t)return this.schedulerReconnect.task;
const i={node:e,generation:t,task:null};return this.schedulerReconnect=i,i.task=(async()=>{try{if(await this.redialBootstrapPeers(),
!r()||!s())return;this._resubscribeTopics(),r()&&s()&&this._startPresence()}catch(o){if(!r())return;throw this._emitConnectionFailure(
{source:"scheduler",stage:"reconnect",error:o}),V("[NetworkManager] Scheduler reconnect failed",o?.message||o),o}finally{
this.schedulerReconnect===i&&(this.schedulerReconnect=null)}})(),i.task}_resubscribeTopics(){this.libp2p?.services?.pubsub&&
(this.libp2p.services.pubsub.subscribe(this.config.pubsubTopic),this.libp2p.services.pubsub.subscribe(this.config.directTopic),
this.libp2p.services.pubsub.subscribe(this.config.presenceTopic),this.additionalPubsubTopics.forEach(e=>{this.libp2p.services.
pubsub.subscribe(e)}),this.config.enablePeerDirectory&&this.libp2p.services.pubsub.subscribe(this.config.directoryTopic),
this.config.enableSharding&&this.topologyController&&this._syncShardSubscriptions(this.topologyController.getNeighborShardIds(
this.topologyMetric)),this._recordPubsubTx(0))}async _publish(e,t){try{if(!this.libp2p?.services?.pubsub||!this.isConnected)
return;const r=Date.now(),s=this.publishBlockedUntil.get(e)||0;if(r<s)return;let i;try{i=Pm.encode(JSON.stringify(t))}catch(o){
V("[NetworkManager] Publish encode failed",e,o?.message||o);return}if(await this.libp2p.services.pubsub.publish(e,i),this.
config.onPublishSuccess)try{this.config.onPublishSuccess(e,t)}catch(o){V("[NetworkManager] onPublishSuccess failed",o?.message||
o)}this.lastTxAt=r,this.scheduler?.recordTx(r),this._recordTx(t?.target||null,cu(i)),this._recordPubsubTx(cu(i))}catch(r){
const s=Date.now();if(this.config.onPublishError)try{this.config.onPublishError(e,t,r)}catch(o){V("[NetworkManager] onPu\
blishError failed",o?.message||o)}(r?.name==="StreamStateError"||String(r?.message||"").includes("stream"))&&this.publishBlockedUntil.
set(e,s+2e3);const i=this.publishErrorAt.get(e)||0;s-i>5e3&&(this.publishErrorAt.set(e,s),V("[NetworkManager] Publish fa\
iled",e,r?.message||r))}}async _dialBootstrapPeers(){const e=this._rankBootstrapAddrs(),t=(e.length?e:this.config.bootstrapPeers||
[]).map(d9).filter(Boolean);await Promise.all(t.map(async r=>{const s=r.toString(),i=wn(s),o=ta(s),a=this._isLocalOrLanMultiaddr(
i),c=this.bootstrapRelayHealth.get(i)||{addr:i,peerId:o,ok:!1,rttMs:null,lastOkAt:null,lastFailAt:null,failures:0,isLan:a};
try{if(o)try{const h=te(o);if((this.libp2p?.getConnections?.(h)||[]).some(ee)){this.bootstrapRelayHealth.set(i,{...c,peerId:o,
ok:!0,lastOkAt:Date.now(),failures:0,isLan:a});return}}catch{}const l=Date.now();await this.libp2p.dial(r);const u=Math.
max(1,Date.now()-l);this.bootstrapRelayHealth.set(i,{...c,peerId:o,ok:!0,rttMs:u,lastOkAt:Date.now(),failures:0,isLan:a}),
It("[NetworkManager] Dialed bootstrap peer",s,`${u}ms`),await this._reserveRelayForPeer(o,"bootstrap-dial")}catch(l){this.
bootstrapRelayHealth.set(i,{...c,peerId:o,ok:!1,lastFailAt:Date.now(),failures:(c.failures||0)+1,isLan:a}),V("[NetworkMa\
nager] Failed to dial bootstrap peer",s,l?.message||l),this._emitConnectionFailure({peerId:o,address:s,source:"bootstrap",
stage:"dial",error:l})}}))}async _reserveRelayForPeer(e,t=""){if(!e)return!1;const r=this.relayTransport?.reservationStore;
if(!r)return console.warn("[NetworkManager] Relay reservation store unavailable",t),!1;typeof r.isStarted=="function"&&!r.
isStarted()&&console.warn("[NetworkManager] Relay reservation store not started",t);let s;try{s=te(e)}catch{return!1}if(r.
hasReservation(s))return this._confirmRelayReservationAddrs(),!0;try{return await r.addRelay(s,"configured"),this.relayReservationPeers.
add(e),this._confirmRelayReservationAddrs(),!0}catch(i){return console.warn("[NetworkManager] Relay reservation failed",
e,t,i?.message||i),!1}}_confirmRelayReservationAddrs(){this._ensureRelayReservation()}async _reserveBootstrapRelayAddrs(){
if(!this.config.bootstrapPeers?.length)return;const e=Array.from(this.bootstrapPeerIds);await Promise.all(e.map(t=>this.
_reserveRelayForPeer(t,"bootstrap")))}async _logLocalAnnounceAddrs(e="status"){if(!this.libp2p?.getMultiaddrs)return;const t=this.
libp2p.getMultiaddrs().map(a=>a.toString()),r=this._getAnnounceAddrs(),s=t.filter(a=>a.includes("/webrtc")),i=t.filter(a=>a.
includes("/p2p-circuit"));this._infoLog(`[NetworkManager] Local multiaddrs (${e})`,JSON.stringify(t)),this._infoLog(`[Ne\
tworkManager] Local webrtc addrs (${e})`,JSON.stringify(s)),this._infoLog(`[NetworkManager] Local relay addrs (${e})`,JSON.
stringify(i)),this._infoLog(`[NetworkManager] Announce addrs (${e})`,JSON.stringify(r));const o=this.relayTransport?.reservationStore;
if(o?.reservationCount&&this._infoLog(`[NetworkManager] Relay reservations (${e})`,{total:o.reservationCount(),configured:o.
reservationCount("configured"),discovered:o.reservationCount("discovered")}),!(!this.libp2p?.peerStore?.get||!this.peerId))
try{const a=te(this.peerId),l=((await this.libp2p.peerStore.get(a))?.addresses||[]).map(u=>u?.multiaddr?.toString?.()).filter(
Boolean);this._infoLog(`[NetworkManager] PeerStore addrs (${e})`,JSON.stringify(l))}catch(a){V("[NetworkManager] Failed \
to read peerStore addrs",a?.message||a)}}async _maybeDialPeer(e,t,r=null,s={}){if(!this.libp2p||!e||e===this.peerId||this.
bootstrapPeerIds.has(e)||this.peerConnectionRecovery?.pending.has(e))return;const i=this._getConnectionsForPeer(e).filter(
ee),o=i.some(v=>Yn(v?.remoteAddr)),a=i.some(v=>Tt(v?.remoteAddr)),c=i.some(v=>ti(v?.remoteAddr)),l=this.config.webrtc?.preferDirect!==
!1,u=s?.force===!0;if(o||!l&&i.length>0&&!u)return;const h=Date.now(),d=Number.isFinite(this.config.webrtc?.dialGlareTieBreakMs)?
this.config.webrtc.dialGlareTieBreakMs:Wv;if(!u&&d>0&&i.length===0&&(t==="presence"||t==="discovery")&&this.peerId&&String(
this.peerId)>String(e)){const v=this.peers.get(e),g=Number(v?.firstSeenAt);if(Number.isFinite(g)&&h-g<d)return;if(!Number.
isFinite(g)){this._touchPeer(e,{firstSeenAt:h});return}}if(this._prunePendingLogicalReservations(h),!this._hasAvailableLogicalPeerSlot(
e,h)){It("[NetworkManager] Skipping dial at logical capacity",e,t||"unknown");return}if(!u&&this._getDialBackoffEntry(e,
h))return;const p=this.recentDialAttempts.get(e)||0;if(!(!u&&h-p<iu)){this.recentDialAttempts.set(e,h),this.pendingPeerDials.
set(e,{reservedAt:h,expiresAt:h+Math.max(Qo,Number.isFinite(this.config.dialTimeoutMs)?this.config.dialTimeoutMs:0),source:t||
"unknown"});try{const v=C=>{if(!e)return C;const I=ot(C);return I?uu(I,e):C},g=C=>{if(!Array.isArray(C))return[];const I=new Set;
return C.map(M=>na(v(M))).filter(Boolean).filter(M=>{const k=ot(M);return!k||I.has(k)?!1:(I.add(k),!0)})},E=C=>{const I=[],
M=[],k=[];return C.forEach($=>{const F=$?.toString?.()||String($||"");Tt(F)&&Yt(F)?M.push($):ei(F)?k.push($):I.push($)}),
{directTargets:I,relayWebrtcTargets:M,relayTargets:k}};let f=g(r),{directTargets:b,relayWebrtcTargets:_,relayTargets:m}=E(
f),y=null;if(l){if(b.length===0&&this.libp2p?.peerStore?.get)try{const I=te(e),M=await this.libp2p.peerStore.get(I);y=M?.
addresses?.map(F=>F?.multiaddr?.toString?.()||String(F?.multiaddr||""))||[];const k=g(M?.addresses?.map(F=>F.multiaddr)),
$=E(k);b=$.directTargets,_=_.length>0?_:$.relayWebrtcTargets,m=m.length>0?m:$.relayTargets}catch{}if(b.length===0){const I=this.
_getRememberedDialTargets(e);if(I.length>0){const M=E(I);b=M.directTargets,_.length===0&&(_=M.relayWebrtcTargets),m.length===
0&&(m=M.relayTargets)}}if(!(b.length>0||_.length>0||m.length>0)&&!c&&this.config.enablePeerDirectory){const I=await this.
queryPeerDirectory(e);if(I?.multiaddrs?.length>0){const M=g(I.multiaddrs),k=E(M);b=k.directTargets,_=_.length>0?_:k.relayWebrtcTargets,
m=m.length>0?m:k.relayTargets,It("[NetworkManager] Got addresses from directory for:",e,M.length)}}}let A=[];const w=this.
_hasLocalIpv6Addrs();l?b.length>0?A=Fm(b,w):_.length>0&&!c?A=_:!a&&m.length>0&&(A=m):A=f.length>0?f:m;let S=!1;if(A.length>
0){l&&(b.length>0?this._infoLog("[NetworkManager] Direct dial targets",e,lu(A)):_.length>0?this._infoLog("[NetworkManage\
r] No direct targets, using relay-webrtc",e,lu(A)):m.length>0&&(this._infoLog("[NetworkManager] No direct targets, using\
 relay",e,lu(A)),y&&y.length>0&&this._infoLog("[NetworkManager] PeerStore addrs",e,y)));for(const C of A){const I=ot(C),
M=Gv(I),k=I.includes("/webrtc")?(()=>{const $=new Set,F=new Map;return P=>{const D=P?.type||"";if(D.startsWith("webrtc:")){
if(D==="webrtc:add-ice-candidate"){const U=i9(P?.detail);if(!U)return;const T=U.type||"unknown",N=F.get(T)||0;F.set(T,N+
1);const G=`ice:${T}`;$.has(G)||(this._infoLog("[NetworkManager] ICE candidate",e,T,U.protocol,U.address),$.add(G));return}
if(D==="webrtc:end-of-ice-candidates"){const U=Array.from(F.entries()).map(([T,N])=>`${T}=${N}`).join(", ")||"none";this.
_infoLog("[NetworkManager] ICE gathering done",e,U);return}$.has(D)||(this._infoLog("[NetworkManager] WebRTC progress",e,
D,I),$.add(D))}}})():null;M!=="relay"&&this._infoLog("[NetworkManager] Dial attempt",e,M,I);try{await this.libp2p.dial(C,
k?{onProgress:k}:void 0),this._clearDialFailureBackoff(e),It("[NetworkManager] Dialed discovered peer",e,t?`(${t})`:"",C.
toString());return}catch($){this._recordDialFailureBackoff(e,M,$),M==="webrtc-relay"&&this._isRelayReservationError($)&&
(S=!0),M!=="relay"?console.warn("[NetworkManager] Dial failed",e,M,I,$?.message||$):V("[NetworkManager] Failed to dial d\
iscovered peer",e,C.toString(),$?.message||$),this._emitConnectionFailure({peerId:e,address:C.toString(),source:t,stage:"\
dial",error:$})}}}if(S&&await this._requestRelayAssist(e,`no-reservation:${t||"dial"}`))return;if(A.length>0&&!this._hasBootstrapRelayConnections()&&
await this._reconnectRelayForDial(e)){const I=this._buildCircuitAddr(e);if(I)try{await this.libp2p.dial(I),this._clearDialFailureBackoff(
e),It("[NetworkManager] Dialed via relay circuit after reconnect:",e),this._scheduleAutoRelayDrop();return}catch(M){this.
_recordDialFailureBackoff(e,"relay",M),V("[NetworkManager] Circuit dial failed after reconnect:",e,M?.message||M),this._emitConnectionFailure(
{peerId:e,address:I.toString(),source:t,stage:"dial",error:M})}}if(l&&a)return;let x=e;try{x=te(e)}catch{this.throughputPendingLinks.
delete(e);return}try{await this.libp2p.dial(x),this._clearDialFailureBackoff(e),It("[NetworkManager] Dialed discovered p\
eer",e,t?`(${t})`:"")}catch(C){this._recordDialFailureBackoff(e,"peerId",C),this.throughputPendingLinks.delete(e),console.
warn("[NetworkManager] Dial failed",e,"peerId",C?.message||C),this._emitConnectionFailure({peerId:e,source:t,stage:"dial",
error:C})}}finally{this._getConnectionsForPeer(e).some(ee)||this.pendingPeerDials.delete(e)}}}_hasLocalIpv6Addrs(){return this.
libp2p?.getMultiaddrs?this.libp2p.getMultiaddrs().map(t=>t.toString()).some(t=>!(!t.includes("/ip6/")||t.includes("/ip6/\
::1")||t.includes("/ip6/::")||t.includes("/ip6/fe80:"))):!1}_getAnnounceAddrs(){if(!this.libp2p?.getMultiaddrs)return[];
const e=this.libp2p.getMultiaddrs().map(h=>h.toString()),t=e.filter(h=>h.includes("/p2p-circuit")||h.includes("/webrtc")),
r=t.length>0?t:e,s=this.config.webrtc?.preferDirect!==!1;if(s&&!e.some(h=>h.includes("/webrtc"))){const h=Date.now();(!this.
lastWebrtcAnnounceWarnAt||h-this.lastWebrtcAnnounceWarnAt>6e4)&&(this._infoLog("[NetworkManager] No local /webrtc addrs \
to announce; using relay-scoped WebRTC announce addrs."),this.lastWebrtcAnnounceWarnAt=h)}const i=this._hasLocalIpv6Addrs(),
o=s?Fm(r,i):r,a=this.peerId,c=[],l=[];a&&Array.isArray(this.config.bootstrapPeers)&&this.config.bootstrapPeers.filter(h=>typeof h==
"string"&&h.includes("/p2p/")).map(h=>wn(h)).forEach(h=>{c.push(`${h}/p2p-circuit/p2p/${a}`),l.push(`${h}/p2p-circuit/we\
brtc/p2p/${a}`)});const u=[...o,...c,...l].map(h=>uu(h,a));return Array.from(new Set(u))}getAnnounceAddrs(){return this.
_getAnnounceAddrs()}_getConnectionsForPeer(e){if(!this.libp2p?.getConnections)return[];const t=this.libp2p.getConnections(
e);return Array.isArray(t)?t:t&&typeof t.values=="function"?Array.from(t.values()).flat():[]}_getPreferredConnectionMeta(e,t=null){
const r=Array.isArray(t)?t:this._getConnectionsForPeer(e).filter(ee);if(r.length===0)return null;const s=(l,u)=>{const h=this.
connectionIceStats.get(l),d=km(l?.remoteAddr),p=Yo(h?.icePath)||d||null,v=yn(h?.mediaPath)||u.mediaPath;return{...u,mediaPath:v,
...p?{icePath:p}:{},...h?.iceProtocol?{iceProtocol:h.iceProtocol}:{},...Number.isFinite(h?.candidatePairRttMs)?{candidatePairRttMs:h.
candidatePairRttMs}:{}}},i=r.find(l=>Yt(l?.remoteAddr)&&!Tt(l?.remoteAddr));if(i)return s(i,{via:"webrtc",signalingPath:"\
direct",mediaPath:"direct"});const o=r.find(l=>$m(l?.remoteAddr)&&!Yt(l?.remoteAddr));if(o)return s(o,{via:"direct",signalingPath:"\
direct",mediaPath:"direct"});const a=r.find(l=>ti(l?.remoteAddr));if(a)return s(a,{via:"relay-webrtc",signalingPath:"rel\
ay-scoped",mediaPath:"unknown"});const c=r.find(l=>ei(l?.remoteAddr));return c?s(c,{via:"relay",signalingPath:"relay-sco\
ped",mediaPath:"turn-relay"}):null}_getPreferredConnectionType(e){return this._getPreferredConnectionMeta(e)?.via||null}_clearRelayPruneTimer(e){
if(!e)return;const t=this.relayPruneTimers?.get?.(e);t&&(clearTimeout(t),this.relayPruneTimers.delete(e))}_scheduleRelayPrune(e,t){
if(!e||!Number.isFinite(t)||t<=0)return;this._clearRelayPruneTimer(e);const r=setTimeout(()=>{this.relayPruneTimers.delete(
e),this._maybePruneRelayConnections(e),this._maybePruneDuplicateConnections(e)},t);this.relayPruneTimers.set(e,r)}_maybePruneRelayConnections(e){
if(!this.libp2p||this.bootstrapPeerIds.has(e)||this.config.webrtc?.dropRelayOnDirect===!1)return;const t=this._getConnectionsForPeer(
e);if(t.length===0){this._clearRelayPruneTimer(e);return}const r=t.filter(l=>ee(l)&&Yn(l?.remoteAddr)),i=this.config.webrtc?.
countRelayWebrtcAsDirectCapable!==!1?t.filter(l=>ee(l)&&ti(l?.remoteAddr)):[],o=r.length>0?r:i;if(o.length===0){this._clearRelayPruneTimer(
e);return}const a=r.length>0?t.filter(l=>ee(l)&&Tt(l?.remoteAddr)):t.filter(l=>ee(l)&&ei(l?.remoteAddr));if(a.length===0){
this._clearRelayPruneTimer(e);return}const c=Number.isFinite(this.config.webrtc?.directUpgradeGraceMs)?Math.max(0,this.config.
webrtc.directUpgradeGraceMs):Ih;if(c>0){const l=Date.now(),u=o.map(h=>this._getDirectStableSince(e,h)).filter(h=>Number.
isFinite(h));if(u.length>0){const h=l-Math.min(...u);if(h<c){this._scheduleRelayPrune(e,c-h);return}}}this._clearRelayPruneTimer(
e),a.forEach(l=>{if(l?.status&&l.status!=="open")return;const u=this._getPeerConnectionRecovery().protectionMs(l);if(u>0){
this._scheduleRelayPrune(e,u);return}this._retireIdleConnection(l,"direct-upgrade")||this._scheduleRelayPrune(e,1e3)})}_maybePruneDuplicateConnections(e){
if(!this.libp2p||!e||this.bootstrapPeerIds.has(e))return;const t=this._getConnectionsForPeer(e).filter(l=>ee(l)&&this._isDirectCapableConnection(
l));if(t.length<=1)return;const r=Number.isFinite(this.config.webrtc?.directUpgradeGraceMs)?Math.max(0,this.config.webrtc.
directUpgradeGraceMs):Ih,s=Date.now(),i=this.peerId&&String(this.peerId)<String(e)?"outbound":"inbound",o=t.slice().sort(
(l,u)=>{const h=this._hasActiveApplicationStreams(l)?1:0,d=this._hasActiveApplicationStreams(u)?1:0;if(h!==d)return d-h;
const p=Yn(l?.remoteAddr)?1:0,v=Yn(u?.remoteAddr)?1:0;if(p!==v)return v-p;const g=String(l?.direction||l?.stat?.direction||
"").toLowerCase()===i?1:0,E=String(u?.direction||u?.stat?.direction||"").toLowerCase()===i?1:0;if(g!==E)return E-g;const f=ea(
l)??Number.MAX_SAFE_INTEGER,b=ea(u)??Number.MAX_SAFE_INTEGER;return f-b}),a=o[0],c=ea(a);if(r>0&&Number.isFinite(c)&&s-c<
r){this._scheduleRelayPrune(e,r-(s-c));return}for(const l of o.slice(1)){const u=this._getPeerConnectionRecovery().protectionMs(
l);if(u>0){this._scheduleRelayPrune(e,u);continue}this._retireIdleConnection(l,"duplicate-direct")}}_logPubsubStatus(e){
if(!this.libp2p?.services?.pubsub||!Kd)return;const t=this.libp2p.services.pubsub,r=typeof t.getPeers=="function"?t.getPeers():
[],s=typeof t.getSubscribers=="function"?t.getSubscribers(this.config.presenceTopic):[];Array.isArray(r)&&r.length===0&&
V(`[NetworkManager] Pubsub has no peers (${e})`),Array.isArray(s)&&s.length===0&&V(`[NetworkManager] No subscribers on p\
resence topic (${e})`),this._getAnnounceAddrs().length===0&&V(`[NetworkManager] No announce addrs available (${e})`)}_rememberPeerAddresses(e,t){
if(!Array.isArray(t)||t.length===0||(this._rememberDialTargets(e,t),!this.libp2p?.peerStore?.merge))return;let r;try{r=te(
e)}catch{return}const s=t.map(na).filter(Boolean);s.length!==0&&this.libp2p.peerStore.merge(r,{multiaddrs:s}).catch(()=>{})}_rememberDialTargets(e,t){
if(!e||!Array.isArray(t)||t.length===0)return;const r=Date.now(),s=this.peerDialAddrCache.get(e)||{addrs:new Set,updatedAt:r};
let i=!1;t.forEach(o=>{const a=uu(ot(o),e);if(!a)return;const c=na(a);if(c){const l=c.toString();s.addrs.has(l)||(s.addrs.
add(l),i=!0)}}),!(!i&&!this.peerDialAddrCache.has(e))&&(s.updatedAt=r,this.peerDialAddrCache.set(e,s),this._pruneRememberedDialTargets(
r))}_getRememberedDialTargets(e,t=Date.now()){const r=this.peerDialAddrCache.get(e);return!r||!(r.addrs instanceof Set)?
[]:t-(r.updatedAt||0)>Mm?(this.peerDialAddrCache.delete(e),[]):Array.from(r.addrs).map(s=>na(s)).filter(Boolean)}_pruneRememberedDialTargets(e=Date.
now()){for(const[t,r]of this.peerDialAddrCache.entries())e-(r?.updatedAt||0)>Mm&&this.peerDialAddrCache.delete(t)}}const Sq=Object.
freeze(Object.defineProperty({__proto__:null,DIRECT_UNICAST_PROTOCOL:wa,NetworkManager:g9,resolveApplicationPrivateKey:Kv},
Symbol.toStringTag,{value:"Module"}));export{Vh as A,fg as B,Nz as C,a5 as D,K1 as L,l$ as M,Sq as N,Wh as P,xb as Q,he as T,ex as a,Zt as b,_i as c,yp as d,Fn as e,
Hr as f,ab as g,st as h,Lb as i,bL as j,qV as k,Pw as l,yk as m,Cu as n,Rb as o,tP as p,cb as q,pl as r,y9 as s,vp as t,
mL as u,hg as v,g4 as w,m4 as x,q6 as y,EF as z};
