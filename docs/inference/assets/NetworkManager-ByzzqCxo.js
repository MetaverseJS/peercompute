const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./IpfsArtifactTransport-ttF_qhmr.js","./main-GpxLetDh.js","./index-B92owSMB.js","./main-LVsr3z-5.css","./ArtifactProviderRecord-BJQUSXox.js","./PeerInferenceService-CSdF3y6U.js"])))=>i.map(i=>d[i]);
import{_ as qc}from"./index-B92owSMB.js";import{I as P,r as Pv,a as Mv,b as $v,e as kv,p as ru,c as Lv,d as Rv,i as ga,f as Nv,
C as Ki,g as _m,h as xm,j as Cm,k as Im,l as ts,m as Fv,n as Tm,o as su,q as as,s as Dm,t as L,u as Uv,v as Ov,w as Bv,x as wn,
y as ma,z as zv,A as Vv,B as Pm,D as iu,E as Jo,F as Mm,G as ei,H as Bd,J as qv,K as Wv,L as $m,N as cs,O as Dt,Q as Kv,
P as er,R as ls,U as Zo,S as Qr,T as km,V as zd,W as Gv,X as Gs,Y as jv,Z as Hv,_ as Xv,$ as Qv,a0 as Yv,a1 as gr,a2 as It,
a3 as tr,a4 as Ue,a5 as lc,a6 as xr,a7 as k,a8 as Lt,a9 as ti,aa as ou,ab as Sh,ac as au,ad as Jv,ae as Zv,af as eS,ag as Z,
ah as uc,ai as tS,aj as nS,ak as Ge,al as B,am as Lm,an as ea,ao as Rm,ap as vi,aq as Nm,ar as cu,as as rS,at as lu,au as sS,
av as Q,aw as ba,ax as iS,ay as Vd,az as Fm,aA as oS,aB as Ah,aC as Um,aD as Om,aE as Rt,aF as Bm,aG as zm,aH as aS,aI as cS,
aJ as lS,aK as uu,aL as ho,aM as Vm,aN as kn,aO as Tn,aP as Cr,aQ as ne,aR as re,aS as se,aT as Ir,aU as Xt,aV as Gi,aW as hu,
aX as uS,aY as ta,aZ as hS,a_ as dS,a$ as hc,b0 as qm,b1 as Wm,b2 as fS,b3 as pS,b4 as gS,b5 as qd,b6 as Km,b7 as mS,b8 as bS}from"./main-GpxLetDh.js";
const yS=Symbol.for("@libp2p/connection"),Wd=Symbol.for("@libp2p/content-routing");class wS extends Event{data;constructor(e,t){
super("message",t),this.data=e}}class dc extends Event{error;local;constructor(e,t,r){super("close",r),this.error=t,this.
local=e}}class vS extends dc{constructor(e,t){super(!0,e,t)}}class SS extends dc{constructor(e,t){super(!1,e,t)}}const ya=Symbol.
for("@libp2p/peer-discovery"),Kd=Symbol.for("@libp2p/peer-routing"),Eh="keep-alive";function _h(n){return n!=null&&typeof n.
start=="function"&&typeof n.stop=="function"}async function Gm(...n){const e=[];for(const t of n)_h(t)&&e.push(t);await Promise.
all(e.map(async t=>{t.beforeStart!=null&&await t.beforeStart()})),await Promise.all(e.map(async t=>{await t.start()})),await Promise.
all(e.map(async t=>{t.afterStart!=null&&await t.afterStart()}))}async function jm(...n){const e=[];for(const t of n)_h(t)&&
e.push(t);await Promise.all(e.map(async t=>{t.beforeStop!=null&&await t.beforeStop()})),await Promise.all(e.map(async t=>{
await t.stop()})),await Promise.all(e.map(async t=>{t.afterStop!=null&&await t.afterStop()}))}const xh=Symbol.for("@libp\
2p/transport");var vn;(function(n){n[n.FATAL_ALL=0]="FATAL_ALL",n[n.NO_FATAL=1]="NO_FATAL"})(vn||(vn={}));function B7(){}
function AS(n){return typeof n?.handleEvent=="function"}function ES(n){return n===!0||n===!1}function _S(n){return ES(n)?
n:n?.capture??!1}function du(n){const e={capture:_S(n),once:!!n?.once};return n?.passive!=null&&(e.passive=n?.passive),n?.
signal!=null&&(e.signal=n?.signal),e}function Gd(n,e){return du(n).capture===du(e).capture}class ue extends EventTarget{#e=new Map;constructor(){
super()}listenerCount(e){const t=this.#e.get(e);return t==null?0:t.length}addEventListener(e,t,r){const s=du(r);if(s?.signal?.
aborted===!0)return;const i=l=>{s.once&&this.removeEventListener(e,t,s),AS(t)?t.handleEvent(l):t(l)};let o=this.#e.get(e);
if(o==null&&(o=[],this.#e.set(e,o)),o.some(l=>l.callback!==t?!1:Gd(l.options,s)))return;super.addEventListener(e,i,s);const c=()=>{
this.removeEventListener(e,t,s)};s.signal?.addEventListener("abort",c),o.push({callback:t,wrapper:i,options:s,onAbort:c})}removeEventListener(e,t,r){
const s=this.#e.get(e);if(s==null){super.removeEventListener(e,t??null,r);return}this.#e.set(e,s.filter(i=>i.callback===
t&&Gd(i.options,r)?(super.removeEventListener(e,i.wrapper,r),i.options?.signal?.removeEventListener("abort",i.onAbort),!1):
!0))}safeDispatchEvent(e,t={}){return this.dispatchEvent(new CustomEvent(e,t))}}const rt=Symbol.for("@libp2p/service-cap\
abilities"),us=Symbol.for("@libp2p/service-dependencies");let oe=class extends Error{code="ERR_MAX_LENGTH";name="MaxLeng\
thError"};function Hm(n){if(isNaN(n)||n<=0)throw new P("random bytes length must be a Number bigger than 0");return Pv(n)}
function fu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return Hd(n);if(n instanceof ArrayBuffer)return new Uint8Array(
n);if(ArrayBuffer.isView(n))return Hd(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type,\
 must be binary type")}function xS(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}
const jd=4096;function CS(n){const e=n.length;if(e<=jd)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)
t+=String.fromCharCode.apply(String,n.subarray(r,r+=jd));return t}function IS(n){return n?.buffer instanceof ArrayBuffer}
function Hd(n){return IS(n)?n:n.slice()}function TS(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(
256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof
Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.
from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,
w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==
0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-
E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError(
"Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var DS=TS,PS=DS;let MS=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},$S=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Xm(this,e)}},
kS=class{decoders;constructor(e){this.decoders=e}or(e){return Xm(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Xm(n,e){return new kS({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let LS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new MS(e,t,r),this.decoder=new $S(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function fc({name:n,prefix:e,encode:t,decode:r}){return new LS(n,e,t,
r)}function ji({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=PS(t,n,r);return fc({prefix:e,
name:n,encode:s,decode:o=>fu(i(o))})}function RS(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function NS(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function FS(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function fe({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=FS(r,s);return fc(
{prefix:e,name:n,encode(o){return NS(o,r,t)},decode(o){return RS(o,i,t,n)}})}const US=ji({prefix:"9",name:"base10",alphabet:"\
0123456789"}),OS=Object.freeze(Object.defineProperty({__proto__:null,base10:US},Symbol.toStringTag,{value:"Module"})),BS=fe(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),zS=fe({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),VS=Object.freeze(Object.defineProperty({__proto__:null,
base16:BS,base16upper:zS},Symbol.toStringTag,{value:"Module"})),qS=fe({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
WS=Object.freeze(Object.defineProperty({__proto__:null,base2:qS},Symbol.toStringTag,{value:"Module"})),Qm=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),KS=Qm.reduce((n,e,t)=>(n[t]=e,n),[]),GS=Qm.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function jS(n){return n.reduce((e,t)=>(e+=KS[t],e),"")}function HS(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=GS[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const XS=fc({prefix:"🚀",name:"\
base256emoji",encode:jS,decode:HS}),QS=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:XS},Symbol.toStringTag,
{value:"Module"})),YS=fe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
JS=fe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),ZS=fe(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),e2=fe({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),t2=fe({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),n2=fe({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),r2=fe({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),s2=fe({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),i2=fe({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),o2=Object.freeze(Object.defineProperty({__proto__:null,
base32:YS,base32hex:t2,base32hexpad:r2,base32hexpadupper:s2,base32hexupper:n2,base32pad:ZS,base32padupper:e2,base32upper:JS,
base32z:i2},Symbol.toStringTag,{value:"Module"})),a2=ji({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),c2=ji({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
l2=Object.freeze(Object.defineProperty({__proto__:null,base36:a2,base36upper:c2},Symbol.toStringTag,{value:"Module"})),u2=ji(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),h2=ji({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),d2=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:u2,base58flickr:h2},Symbol.toStringTag,{value:"Module"})),f2=fe({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),p2=fe({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),g2=fe({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),m2=fe({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),b2=Object.freeze(Object.defineProperty(
{__proto__:null,base64:f2,base64pad:p2,base64url:g2,base64urlpad:m2},Symbol.toStringTag,{value:"Module"})),y2=fe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),w2=Object.freeze(Object.defineProperty({__proto__:null,base8:y2},Symbol.
toStringTag,{value:"Module"})),v2=fc({prefix:"\0",name:"identity",encode:n=>CS(fu(n)),decode:n=>fu(xS(n))}),S2=Object.freeze(
Object.defineProperty({__proto__:null,identity:v2},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Xd={...S2,...WS,...w2,...OS,...VS,...o2,...l2,...d2,...b2,...QS};function Ym(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const Qd=Ym("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Wc=Ym("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=Mv(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),A2={utf8:Qd,"utf-8":Qd,
hex:Xd.base16,latin1:Wc,ascii:Wc,binary:Wc,...Xd};function nr(n,e="utf8"){const t=A2[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}const Ch={32:16777619n,64:1099511628211n,128:309485009821345068724781371n,
256:374144419156711147060143317175368453031918731002211n,512:35835915874844867368919076489095108449946327955754392558399825615420669938882575126094039892345713852759n,
1024:5016456510113118655434598811035278955030765345404790744303017523831112055108147451509157692220295382716162651878526895249385292291816524375083746691371804094271873160484737966720260389217684476157468082573n},
Jm={32:2166136261n,64:14695981039346656037n,128:144066263297769815596495629667062367629n,256:100029257958052580907070968620625704837092796014241193945225284501741471925557n,
512:9659303129496669498009435400716310466090418745672637896108374329434462657994582932197716438449813051892206539805784495328239340083876191928701583869517785n,
1024:14197795064947621068722070641403218320880622795441933960878474914617582723252296732303717722150864096521202355549365628174669108571814760471015076148029755969804077320157692458563003215304957150157403644460363550505412711285966361610267868082893823963790439336411086884584107735010676915n},
Zm=new globalThis.TextEncoder;function E2(n,e){const t=Ch[e];let r=Jm[e];for(let s=0;s<n.length;s++)r^=BigInt(n[s]),r=BigInt.
asUintN(e,r*t);return r}function _2(n,e,t){if(t.length===0)throw new Error("The `utf8Buffer` option must have a length g\
reater than zero");const r=Ch[e];let s=Jm[e],i=n;for(;i.length>0;){const o=Zm.encodeInto(i,t);i=i.slice(o.read);for(let a=0;a<
o.written;a++)s^=BigInt(t[a]),s=BigInt.asUintN(e,s*r)}return s}function x2(n,{size:e=32,utf8Buffer:t}={}){if(!Ch[e])throw new Error(
"The `size` option must be one of 32, 64, 128, 256, 512, or 1024");if(typeof n=="string"){if(t)return _2(n,e,t);n=Zm.encode(
n)}return E2(n,e)}const Ih={hash:n=>Number(x2(n,{size:32})),hashV:(n,e)=>C2(Ih.hash(n,e))};function C2(n){let e=n.toString(
16);return e.length%2===1&&(e=`0${e}`),nr(e,"base16")}const eb=64;class Xn{fp;h;seed;constructor(e,t,r,s=2){if(s>eb)throw new TypeError(
"Invalid Fingerprint Size");const i=t.hashV(e,r),o=$v(s);for(let a=0;a<o.length;a++)o[a]=i[a];o.length===0&&(o[0]=7),this.
fp=o,this.h=t,this.seed=r}hash(){return this.h.hash(this.fp,this.seed)}equals(e){return e?.fp instanceof Uint8Array?kv(this.
fp,e.fp):!1}}function wa(n,e){return Math.floor(Math.random()*(e-n))+n}class fo{contents;constructor(e){this.contents=new Array(
e).fill(null)}has(e){if(!(e instanceof Xn))throw new TypeError("Invalid Fingerprint");return this.contents.some(t=>e.equals(
t))}add(e){if(!(e instanceof Xn))throw new TypeError("Invalid Fingerprint");for(let t=0;t<this.contents.length;t++)if(this.
contents[t]==null)return this.contents[t]=e,!0;return!0}swap(e){if(!(e instanceof Xn))throw new TypeError("Invalid Finge\
rprint");const t=wa(0,this.contents.length-1),r=this.contents[t];return this.contents[t]=e,r}remove(e){if(!(e instanceof
Xn))throw new TypeError("Invalid Fingerprint");const t=this.contents.findIndex(r=>e.equals(r));return t>-1?(this.contents[t]=
null,!0):!1}}const I2=500;class Yd{bucketSize;filterSize;fingerprintSize;buckets;count;hash;seed;constructor(e){this.filterSize=
e.filterSize,this.bucketSize=e.bucketSize??4,this.fingerprintSize=e.fingerprintSize??2,this.count=0,this.buckets=[],this.
hash=e.hash??Ih,this.seed=e.seed??wa(0,Math.pow(2,10))}add(e){typeof e=="string"&&(e=nr(e));const t=new Xn(e,this.hash,this.
seed,this.fingerprintSize),r=this.hash.hash(e,this.seed)%this.filterSize,s=(r^t.hash())%this.filterSize;if(this.buckets[r]==
null&&(this.buckets[r]=new fo(this.bucketSize)),this.buckets[s]==null&&(this.buckets[s]=new fo(this.bucketSize)),this.buckets[r].
add(t)||this.buckets[s].add(t))return this.count++,!0;const i=[r,s];let o=i[wa(0,i.length-1)];this.buckets[o]==null&&(this.
buckets[o]=new fo(this.bucketSize));for(let a=0;a<I2;a++){const c=this.buckets[o].swap(t);if(c!=null&&(o=(o^c.hash())%this.
filterSize,this.buckets[o]==null&&(this.buckets[o]=new fo(this.bucketSize)),this.buckets[o].add(c)))return this.count++,
!0}return!1}has(e){typeof e=="string"&&(e=nr(e));const t=new Xn(e,this.hash,this.seed,this.fingerprintSize),r=this.hash.
hash(e,this.seed)%this.filterSize,s=this.buckets[r]?.has(t)??!1;if(s)return s;const i=(r^t.hash())%this.filterSize;return this.
buckets[i]?.has(t)??!1}remove(e){typeof e=="string"&&(e=nr(e));const t=new Xn(e,this.hash,this.seed,this.fingerprintSize),
r=this.hash.hash(e,this.seed)%this.filterSize,s=this.buckets[r]?.remove(t)??!1;if(s)return this.count--,s;const i=(r^t.hash())%
this.filterSize,o=this.buckets[i]?.remove(t)??!1;return o&&this.count--,o}get reliable(){return Math.floor(100*(this.count/
this.filterSize))<=90}}const T2={1:.5,2:.84,4:.95,8:.98};function D2(n=.001){return n>.002?2:n>1e-5?4:8}function P2(n,e=.001){
const t=D2(e),r=T2[t],s=Math.round(n/r),i=Math.min(Math.ceil(Math.log2(1/e)+Math.log2(2*t)),eb);return{filterSize:s,bucketSize:t,
fingerprintSize:i}}class M2{filterSize;bucketSize;fingerprintSize;scale;filterSeries;hash;seed;constructor(e){this.bucketSize=
e.bucketSize??4,this.filterSize=e.filterSize??(1<<18)/this.bucketSize,this.fingerprintSize=e.fingerprintSize??2,this.scale=
e.scale??2,this.hash=e.hash??Ih,this.seed=e.seed??wa(0,Math.pow(2,10)),this.filterSeries=[new Yd({filterSize:this.filterSize,
bucketSize:this.bucketSize,fingerprintSize:this.fingerprintSize,hash:this.hash,seed:this.seed})]}add(e){if(typeof e=="st\
ring"&&(e=nr(e)),this.has(e))return!0;let t=this.filterSeries.find(r=>r.reliable);if(t==null){const r=this.filterSize*Math.
pow(this.scale,this.filterSeries.length);t=new Yd({filterSize:r,bucketSize:this.bucketSize,fingerprintSize:this.fingerprintSize,
hash:this.hash,seed:this.seed}),this.filterSeries.push(t)}return t.add(e)}has(e){typeof e=="string"&&(e=nr(e));for(let t=0;t<
this.filterSeries.length;t++)if(this.filterSeries[t].has(e))return!0;return!1}remove(e){typeof e=="string"&&(e=nr(e));for(let t=0;t<
this.filterSeries.length;t++)if(this.filterSeries[t].remove(e))return!0;return!1}get count(){return this.filterSeries.reduce(
(e,t)=>e+t.count,0)}}function Si(n,e=.001,t){return new M2({...P2(n,e)})}function tb(n){const e=n.getComponents(),t={};let r=0;
return e[r]?.name==="ip6zone"&&(t.zone=`${e[r].value}`,r++),e[r]?.name==="ip4"||e[r]?.name==="ip6"||e[r]?.name==="dns"||
e[r]?.name==="dns4"||e[r]?.name==="dns6"?(t.type=e[r].name,t.host=e[r].value,r++):e[r]?.name==="dnsaddr"&&(t.type=e[r].name,
t.host=`_dnsaddr.${e[r].value}`,r++),(e[r]?.name==="tcp"||e[r]?.name==="udp")&&(t.protocol=e[r].name==="tcp"?"tcp":"udp",
t.port=parseInt(`${e[r].value}`),r++),e[r]?.name==="ipcidr"&&(t.type==="ip4"?t.cidr=parseInt(`${e[r].value}`):t.type==="\
ip6"&&(t.cidr=`${e[r].value}`),r++),t.type==null||t.host==null?null:(e[r]?.name==="tls"&&e[r+1]?.name==="sni"&&(t.sni=e[r+
1].value,r+=2),t)}function ee(n){const e=tb(n);if(e==null)throw new P(`Multiaddr ${n} was not an IPv4, IPv6, DNS, DNS4, \
DNS6 or DNSADDR address`);return e}function $2(n,e,t){let r=0;for(const s of n)if(!(r<e)){if(r>t)break;if(s!==255)return!1;
r++}return!0}function k2(n,e,t,r){let s=0;for(const i of n)if(!(s<t)){if(s>r)break;if(i!==e[s])return!1;s++}return!0}function L2(n){
switch(n.length){case Ai:return n.join(".");case Ei:{const e=[];for(let t=0;t<n.length;t++)t%2===0&&e.push(n[t].toString(
16).padStart(2,"0")+n[t+1].toString(16).padStart(2,"0"));return e.join(":")}default:throw new Error("Invalid ip length")}}
function R2(n){let e=0;for(let[t,r]of n.entries()){if(r===255){e+=8;continue}for(;(r&128)!=0;)e++,r=r<<1;if((r&128)!=0)return-1;
for(let s=t+1;s<n.length;s++)if(n[s]!=0)return-1;break}return e}function N2(n){let e="0x";for(const t of n)e+=(t>>4).toString(
16)+(t&15).toString(16);return e}const Ai=4,Ei=16,F2=new Uint8Array([0,0,0,0,0,0,0,0,0,0,255,255]);function nb(n,e){e.length===
Ei&&n.length===Ai&&$2(e,0,11)&&(e=e.slice(12)),e.length===Ai&&n.length===Ei&&k2(n,F2,0,11)&&(n=n.slice(12));const t=n.length;
if(t!=e.length)throw new Error("Failed to mask ip");const r=new Uint8Array(t);for(let s=0;s<t;s++)r[s]=n[s]&e[s];return r}
function U2(n,e){if(typeof e=="string"&&(e=ru(e)),e==null)throw new Error("Invalid ip");if(e.length!==n.network.length)return!1;
for(let t=0;t<e.length;t++)if((n.network[t]&n.mask[t])!==(e[t]&n.mask[t]))return!1;return!0}function O2(n){const[e,t]=n.
split("/");if(!e||!t)throw new Error("Failed to parse given CIDR: "+n);let r=Ai,s=Lv(e);if(s==null&&(r=Ei,s=Rv(e),s==null))
throw new Error("Failed to parse given CIDR: "+n);const i=parseInt(t,10);if(Number.isNaN(i)||String(i).length!==t.length||
i<0||i>r*8)throw new Error("Failed to parse given CIDR: "+n);const o=rb(i,8*r);return{network:nb(s,o),mask:o}}function rb(n,e){
if(e!==8*Ai&&e!==8*Ei)throw new Error("Invalid CIDR mask");if(n<0||n>e)throw new Error("Invalid CIDR mask");const t=e/8,
r=new Uint8Array(t);for(let s=0;s<t;s++){if(n>=8){r[s]=255,n-=8;continue}r[s]=255-(255>>n),n=0}return r}class sb{constructor(e,t){
if(t==null)({network:this.network,mask:this.mask}=O2(e));else{const r=ru(e);if(r==null)throw new Error("Failed to parse \
network");t=String(t);const s=parseInt(t,10);if(Number.isNaN(s)||String(s).length!==t.length||s<0||s>r.length*8){const i=ru(
t);if(i==null)throw new Error("Failed to parse mask");this.mask=i}else this.mask=rb(s,8*r.length);this.network=nb(r,this.
mask)}}contains(e){return U2({network:this.network,mask:this.mask},e)}toString(){const e=R2(this.mask),t=e!==-1?String(e):
N2(this.mask);return L2(this.network)+"/"+t}}function B2(n,e){return new sb(n).contains(e)}function z2(n){try{const e=ee(
n);switch(e.type){case"ip6":return B2("2000::/3",e.host);default:return!1}}catch{return!1}}function V2(n){try{const e=ee(
n);switch(e.type){case"ip4":return e.host.startsWith("169.254.");case"ip6":return e.host.toLowerCase().startsWith("fe80");default:
return!1}}catch{return!1}}function q2(n){return/^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(n)||/^::1$/.test(
n)}function pu(n){try{const e=ee(n);switch(e.type){case"ip4":case"ip6":return q2(e.host);default:return!1}}catch{return!1}}
function gt(n){return tb(n)!==null}var Br={},Jd;function W2(){return Jd||(Jd=1,(function(){var n,e,t,r,s,i,o,a;a=function(c){
var l,u,h,f;return l=(c&255<<24)>>>24,u=(c&255<<16)>>>16,h=(c&65280)>>>8,f=c&255,[l,u,h,f].join(".")},o=function(c){var l,
u,h,f,p,A;for(l=[],h=f=0;f<=3&&c.length!==0;h=++f){if(h>0){if(c[0]!==".")throw new Error("Invalid IP");c=c.substring(1)}
A=e(c),p=A[0],u=A[1],c=c.substring(u),l.push(p)}if(c.length!==0)throw new Error("Invalid IP");switch(l.length){case 1:if(l[0]>
4294967295)throw new Error("Invalid IP");return l[0]>>>0;case 2:if(l[0]>255||l[1]>16777215)throw new Error("Invalid IP");
return(l[0]<<24|l[1])>>>0;case 3:if(l[0]>255||l[1]>255||l[2]>65535)throw new Error("Invalid IP");return(l[0]<<24|l[1]<<16|
l[2])>>>0;case 4:if(l[0]>255||l[1]>255||l[2]>255||l[3]>255)throw new Error("Invalid IP");return(l[0]<<24|l[1]<<16|l[2]<<
8|l[3])>>>0;default:throw new Error("Invalid IP")}},t=function(c){return c.charCodeAt(0)},r=t("0"),i=t("a"),s=t("A"),e=function(c){
var l,u,h,f,p;for(f=0,l=10,u="9",h=0,c.length>1&&c[h]==="0"&&(c[h+1]==="x"||c[h+1]==="X"?(h+=2,l=16):"0"<=c[h+1]&&c[h+1]<=
"9"&&(h++,l=8,u="7")),p=h;h<c.length;){if("0"<=c[h]&&c[h]<=u)f=f*l+(t(c[h])-r)>>>0;else if(l===16)if("a"<=c[h]&&c[h]<="f")
f=f*l+(10+t(c[h])-i)>>>0;else if("A"<=c[h]&&c[h]<="F")f=f*l+(10+t(c[h])-s)>>>0;else break;else break;if(f>4294967295)throw new Error(
"too large");h++}if(h===p)throw new Error("empty octet");return[f,h]},n=(function(){function c(l,u){var h,f,p;if(typeof l!=
"string")throw new Error("Missing `net' parameter");if(u||(p=l.split("/",2),l=p[0],u=p[1]),u||(u=32),typeof u=="string"&&
u.indexOf(".")>-1){try{this.maskLong=o(u)}catch{throw new Error("Invalid mask: "+u)}for(h=f=32;f>=0;h=--f)if(this.maskLong===
4294967295<<32-h>>>0){this.bitmask=h;break}}else if(u||u===0)this.bitmask=parseInt(u,10),this.maskLong=0,this.bitmask>0&&
(this.maskLong=4294967295<<32-this.bitmask>>>0);else throw new Error("Invalid mask: empty");try{this.netLong=(o(l)&this.
maskLong)>>>0}catch{throw new Error("Invalid net address: "+l)}if(!(this.bitmask<=32))throw new Error("Invalid mask for \
ip4: "+u);this.size=Math.pow(2,32-this.bitmask),this.base=a(this.netLong),this.mask=a(this.maskLong),this.hostmask=a(~this.
maskLong),this.first=this.bitmask<=30?a(this.netLong+1):this.base,this.last=this.bitmask<=30?a(this.netLong+this.size-2):
a(this.netLong+this.size-1),this.broadcast=this.bitmask<=30?a(this.netLong+this.size-1):void 0}return c.prototype.contains=
function(l){return typeof l=="string"&&(l.indexOf("/")>0||l.split(".").length!==4)&&(l=new c(l)),l instanceof c?this.contains(
l.base)&&this.contains(l.broadcast||l.last):(o(l)&this.maskLong)>>>0===(this.netLong&this.maskLong)>>>0},c.prototype.next=
function(l){return l==null&&(l=1),new c(a(this.netLong+this.size*l),this.mask)},c.prototype.forEach=function(l){var u,h,
f;for(f=o(this.first),h=o(this.last),u=0;f<=h;)l(a(f),f,u),u++,f++},c.prototype.toString=function(){return this.base+"/"+
this.bitmask},c})(),Br.ip2long=o,Br.long2ip=a,Br.Netmask=n}).call(Br)),Br}var K2=W2();const G2=["0.0.0.0/8","10.0.0.0/8",
"100.64.0.0/10","127.0.0.0/8","169.254.0.0/16","172.16.0.0/12","192.0.0.0/24","192.0.0.0/29","192.0.0.8/32","192.0.0.9/3\
2","192.0.0.10/32","192.0.0.170/32","192.0.0.171/32","192.0.2.0/24","192.31.196.0/24","192.52.193.0/24","192.88.99.0/24",
"192.168.0.0/16","192.175.48.0/24","198.18.0.0/15","198.51.100.0/24","203.0.113.0/24","240.0.0.0/4","255.255.255.255/32"],
j2=G2.map(n=>new K2.Netmask(n));function Th(n){for(const e of j2)if(e.contains(n))return!0;return!1}function H2(n){return/^::ffff:([0-9a-fA-F]{1,4}):([0-9a-fA-F]{1,4})$/.
test(n)}function X2(n){const e=n.split(":");if(e.length<2)return!1;const t=e[e.length-1].padStart(4,"0"),r=e[e.length-2].
padStart(4,"0"),s=`${parseInt(r.substring(0,2),16)}.${parseInt(r.substring(2),16)}.${parseInt(t.substring(0,2),16)}.${parseInt(
t.substring(2),16)}`;return Th(s)}function Q2(n){return/^::ffff:([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.
test(n)}function Y2(n){const e=n.split(":"),t=e[e.length-1];return Th(t)}function J2(n){return/^::$/.test(n)||/^::1$/.test(
n)||/^64:ff9b::([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(n)||/^100::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001::([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001:2[0-9a-fA-F]:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2001:db8:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^2002:([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4}):?([0-9a-fA-F]{0,4})$/.
test(n)||/^f[c-d]([0-9a-fA-F]{2,2}):/i.test(n)||/^fe[8-9a-bA-B][0-9a-fA-F]:/i.test(n)||/^ff([0-9a-fA-F]{2,2}):/i.test(n)}
function Dh(n){if(ga(n))return Th(n);if(H2(n))return X2(n);if(Q2(n))return Y2(n);if(Nv(n))return J2(n)}function hs(n){try{
const e=ee(n);switch(e.type){case"ip4":case"ip6":return Dh(e.host)??!1;default:return e.host==="localhost"}}catch{return!1}}
const Y=n=>({match:e=>{const t=e[0];return t==null||t.code!==n||t.value!=null?!1:e.slice(1)}}),$=(n,e)=>({match:t=>{const r=t[0];
return r?.code!==n||r.value==null||e!=null&&r.value!==e?!1:t.slice(1)}}),Z2=n=>({match:e=>n.match(e)===!1?e:!1}),U=n=>({
match:e=>{const t=n.match(e);return t===!1?e:t}}),je=(...n)=>({match:e=>{let t;for(const r of n){const s=r.match(e);s!==
!1&&(t==null||s.length<t.length)&&(t=s)}return t??!1}}),V=(...n)=>({match:e=>{for(const t of n){const r=t.match(e);if(r===
!1)return!1;e=r}return e}});function J(...n){function e(s){if(s==null)return!1;let i=s.getComponents();for(const o of n){
const a=o.match(i);if(a===!1)return!1;i=a}return i}function t(s){return e(s)!==!1}function r(s){const i=e(s);return i===
!1?!1:i.length===0}return{matchers:n,matches:t,exactMatch:r}}const e1=$(L),t1=J(e1),pc=$(xm),gc=$(Cm),mc=$(_m),Ph=$(Pm);
J(pc,U($(L)));J(gc,U($(L)));J(mc,U($(L)));J(je(Ph,mc,pc,gc),U($(L)));const ib=V($(su),U($(Tm))),ob=V(U($(Dm)),$(as),U($(
Tm))),Mh=je(ib,ob),Is=je(Mh,Ph,pc,gc,mc),n1=J(je(Mh,V(je(Ph,mc,pc,gc),U($(L))))),Zd=J(ib),ef=J(ob);J(Mh);const $h=V(Is,$(
wn)),Hi=V(Is,$(Ov)),va=J(V($h,U($(L))));J(Hi);const kh=V(Hi,Y(Bv),U($(L))),bc=V(Hi,Y(Uv),U($(L))),r1=je(kh,bc);J(kh);const s1=J(
bc),gu=je(Is,$h,Hi,kh,bc),ab=je(V(gu,Y(Im),U($(L)))),_i=J(ab),cb=je(V(gu,Y(Fv),U($(L))),V(gu,Y(ts),U($(iu)),Y(Im),U($(L)))),
Sa=J(cb),lb=V(Hi,Y(zv),U($(ma)),U($(ma)),U($(L))),tf=J(lb),ub=V(bc,Y(Vv),U($(ma)),U($(ma)),U($(L))),nf=J(ub),Aa=je(ab,cb,
V($h,U($(L))),V(r1,U($(L))),V(Is,U($(L))),lb,ub,$(L)),Lh=J(Aa),i1=V(U(Aa),Y(Ki),Z2(Y(Jo)),U($(L))),ds=J(i1),o1=je(V(Aa,Y(
Ki),Y(Jo),U($(L))),V(Aa,Y(Jo),U($(L))),V(Y(Jo),U($(L)))),mu=J(o1),a1=V(Is,je(V($(wn,"80")),V($(wn),Y(ei)),Y(ei)),U($(Mm)),
U($(L)));J(a1);const c1=V(Is,je(V($(wn,"443")),V($(wn,"443"),Y(ei)),V($(wn),Y(Bd)),V($(wn),Y(ts),Y(ei)),V(Y(ts),Y(ei)),Y(
ts),Y(Bd)),U($(Mm)),U($(L)));J(c1);const l1=je(V($(qv),U($(L))));J(l1);const u1=je(V($(Wv),U($(L))));J(u1);function h1(n,e){
const t=va.exactMatch(n),r=va.exactMatch(e);if(t&&!r)return-1;if(!t&&r)return 1;const s=Sa.exactMatch(n),i=Sa.exactMatch(
e);if(s&&!i)return-1;if(!s&&i)return 1;const o=_i.exactMatch(n),a=_i.exactMatch(e);if(o&&!a)return-1;if(!o&&a)return 1;const c=mu.
exactMatch(n),l=mu.exactMatch(e);if(c&&!l)return-1;if(!c&&l)return 1;const u=tf.exactMatch(n),h=tf.exactMatch(e);if(u&&!h)
return-1;if(!u&&h)return 1;const f=nf.exactMatch(n),p=nf.exactMatch(e);return f&&!p?-1:!f&&p?1:0}function d1(n,e){const t=pu(
n),r=pu(e);return t&&!r?1:!t&&r?-1:0}function f1(n,e){const t=hs(n),r=hs(e);return t&&!r?1:!t&&r?-1:0}function p1(n,e){const t=ds.
exactMatch(n),r=ds.exactMatch(e);return t&&!r?1:!t&&r?-1:0}function Ea(n,e){let t;const r=function(){const s=function(){
t=void 0,n()};clearTimeout(t),t=setTimeout(s,e)};return r.start=()=>{},r.stop=()=>{clearTimeout(t)},r}let g1=class{deferred;signal;onProgress;constructor(e){
this.signal=e?.signal,this.onProgress=e?.onProgress,this.deferred=$m(),this.onAbort=this.onAbort.bind(this),this.signal?.
addEventListener("abort",this.onAbort)}onAbort(){this.deferred.reject(this.signal?.reason??new cs)}cleanup(){this.signal?.
removeEventListener("abort",this.onAbort)}};function m1(){return`${parseInt(String(Math.random()*1e9),10).toString()}${Date.
now()}`}const rf=new WeakMap;let b1=class{id;fn;options;recipients;status;timeline;controller;dispatchingProgress;constructor(e,t){
this.id=m1(),this.status="queued",this.fn=e,this.options=t,this.recipients=[],this.timeline={created:Date.now()},this.controller=
new AbortController,this.controller.signal,this.dispatchingProgress=!1,this.onAbort=this.onAbort.bind(this)}abort(e){this.
controller.abort(e)}onAbort(){this.recipients.reduce((t,r)=>t&&r.signal?.aborted===!0,!0)&&(this.controller.abort(new cs),
this.cleanup())}async join(e){const t=new g1(e);return this.recipients.push(t),e?.signal?.addEventListener("abort",this.
onAbort),t.deferred.promise}async run(){this.status="running",this.timeline.started=Date.now();try{this.controller.signal.
throwIfAborted();const e=await Dt(this.fn({...this.options??{},signal:this.controller.signal,onProgress:t=>{if(this.recipients.
length!==0&&!this.dispatchingProgress){if(typeof t=="object"&&t!==null){let r=rf.get(t);if(r==null&&(r=new WeakSet,rf.set(
t,r)),r.has(this))return;r.add(this)}this.dispatchingProgress=!0;try{this.recipients.forEach(r=>{r.onProgress?.(t)})}finally{
this.dispatchingProgress=!1}}}}),this.controller.signal);this.recipients.forEach(t=>{t.deferred.resolve(e)}),this.status=
"complete"}catch(e){this.recipients.forEach(t=>{t.deferred.reject(e)}),this.status="errored"}finally{this.timeline.finished=
Date.now(),this.cleanup()}}cleanup(){this.recipients.forEach(e=>{e.deferred.reject(e.signal?.reason??new cs),e.cleanup(),
e.signal?.removeEventListener("abort",this.onAbort)}),this.recipients.splice(0,this.recipients.length)}},hb=class extends ue{concurrency;maxSize;queue;pending;sort;paused;constructor(e={}){
super(),this.concurrency=e.concurrency??Number.POSITIVE_INFINITY,this.maxSize=e.maxSize??Number.POSITIVE_INFINITY,this.pending=
0,this.paused=!1,e.metricName!=null&&e.metrics?.registerMetricGroup(e.metricName,{calculate:()=>({size:this.queue.length,
running:this.pending,queued:this.queue.length-this.pending})}),this.sort=e.sort,this.queue=[],this.emitEmpty=Ea(this.emitEmpty.
bind(this),1),this.emitIdle=Ea(this.emitIdle.bind(this),1)}emitEmpty(){this.size===0&&this.safeDispatchEvent("empty")}emitIdle(){
this.running===0&&this.safeDispatchEvent("idle")}pause(){this.paused=!0}resume(){this.paused&&(this.paused=!1,this.tryToStartAnother())}tryToStartAnother(){
if(this.paused)return!1;if(this.size===0)return this.emitEmpty(),this.running===0&&this.emitIdle(),!1;if(this.pending<this.
concurrency){let e;for(const t of this.queue)if(t.status==="queued"){e=t;break}return e==null?!1:(this.safeDispatchEvent(
"active"),this.pending++,e.run().finally(()=>{for(let t=0;t<this.queue.length;t++)if(this.queue[t]===e){this.queue.splice(
t,1);break}this.pending--,this.tryToStartAnother(),this.safeDispatchEvent("next")}),!0)}return!1}enqueue(e){this.queue.push(
e),this.sort!=null&&this.queue.sort(this.sort)}async add(e,t){if(t?.signal?.throwIfAborted(),this.size===this.maxSize)throw new Kv;
const r=new b1(e,t);this.enqueue(r),this.safeDispatchEvent("add");const s=r.join(t).then(i=>(this.safeDispatchEvent("com\
pleted",{detail:i}),this.safeDispatchEvent("success",{detail:{job:r,result:i}}),i)).catch(i=>{if(r.status==="queued"){for(let o=0;o<
this.queue.length;o++)if(this.queue[o]===r){this.queue.splice(o,1);break}}throw this.safeDispatchEvent("failure",{detail:{
job:r,error:i}}),i});return this.tryToStartAnother(),s}clear(){this.queue.splice(0,this.queue.length)}abort(){this.queue.
forEach(e=>{e.abort(new cs)}),this.clear()}async onEmpty(e){this.size!==0&&await er(this,"empty",e)}async onSizeLessThan(e,t){
this.size<e||await er(this,"next",{...t,filter:()=>this.size<e})}async onIdle(e){this.pending===0&&this.size===0||await er(
this,"idle",e)}get size(){return this.queue.length}get queued(){return this.queue.length-this.pending}get running(){return this.
pending}async*toGenerator(e){e?.signal?.throwIfAborted();const t=ls({objectMode:!0}),r=c=>{c!=null?this.abort():this.clear(),
t.end(c)},s=c=>{c.detail!=null&&t.push(c.detail)},i=c=>{r(c.detail.error)},o=()=>{r()},a=()=>{r(new cs("Queue aborted"))};
this.addEventListener("completed",s),this.addEventListener("failure",i),this.addEventListener("idle",o),e?.signal?.addEventListener(
"abort",a);try{yield*t}finally{this.removeEventListener("completed",s),this.removeEventListener("failure",i),this.removeEventListener(
"idle",o),e?.signal?.removeEventListener("abort",a),r()}}};const y1=Math.pow(2,20)*4;class Rh extends ue{status;timeline;inactivityTimeout;maxReadBufferLength;maxWriteBufferLength;log;direction;maxMessageSize;readStatus;writeStatus;remoteReadStatus;remoteWriteStatus;writableNeedsDrain;readBuffer;writeBuffer;sendingData;#e=!1;#t;#n=new Set;onDrainPromise;constructor(e){
super(),this.status="open",this.log=e.log,this.direction=e.direction??"outbound",this.inactivityTimeout=e.inactivityTimeout??
12e4,this.maxReadBufferLength=e.maxReadBufferLength??y1,this.maxWriteBufferLength=e.maxWriteBufferLength,this.maxMessageSize=
e.maxMessageSize,this.readBuffer=new Zo,this.writeBuffer=new Zo,this.readStatus="readable",this.remoteReadStatus="readab\
le",this.writeStatus="writable",this.remoteWriteStatus="writable",this.sendingData=!1,this.writableNeedsDrain=!1,this.timeline=
{open:Date.now()},this.processSendQueue=this.processSendQueue.bind(this);const t=()=>{this.writableNeedsDrain&&(this.log.
trace("drain event received, continue sending data"),this.writableNeedsDrain=!1,queueMicrotask(()=>{try{this.processSendQueue()}catch(s){
this.log.error("processSendQueue threw - %e",s)}})),this.onDrainPromise?.resolve()};this.addEventListener("drain",t);const r=s=>{
this.onDrainPromise?.reject(s.error??new Gv)};this.addEventListener("close",r)}get readBufferLength(){return this.readBuffer.
byteLength}get readableEnded(){return this.#e}get writeBufferLength(){return this.writeBuffer.byteLength}async onDrain(e){
return this.writableNeedsDrain!==!0?Promise.resolve():(this.onDrainPromise==null&&(this.onDrainPromise=Promise.withResolvers()),
Dt(this.onDrainPromise.promise,e?.signal))}async*[Symbol.asyncIterator](){const e=ls();let t;const r=i=>{e.push(i.data)};
this.addEventListener("message",r);const s=()=>{this.#n.delete(s),this.removeEventListener("message",r),t=this.#t,e.end()};
this.#n.add(s),this.readableDone()&&s();try{if(yield*e,t!=null)throw t}finally{this.removeEventListener("message",r),this.#n.
delete(s)}}readableDone(){return this.readBuffer.byteLength===0&&(this.remoteWriteStatus==="closed"||this.readStatus==="\
closing"||this.readStatus==="closed")}isReadable(){return this.status==="open"}send(e){if(this.writeStatus==="closed"||this.
writeStatus==="closing")throw new Qr(`Cannot write to a stream that is ${this.writeStatus}`);return this.log.trace("appe\
nd %d bytes to write buffer",e.byteLength),this.writeBuffer.append(e),this.processSendQueue()}abort(e){if(this.status===
"aborted"||this.status==="reset"||this.status==="closed"){this.readBuffer.byteLength>0&&(this.#t??=e,this.readBuffer.consume(
this.readBuffer.byteLength),this.readStatus="closed",this.maybeDispatchEnd());return}this.log.error("abort with error - \
%e",e),this.status="aborted",this.#t=e,this.readBuffer.byteLength>0&&this.readBuffer.consume(this.readBuffer.byteLength),
this.writeBuffer.byteLength>0&&(this.writeBuffer.consume(this.writeBuffer.byteLength),this.safeDispatchEvent("idle")),this.
writeStatus="closed",this.remoteWriteStatus="closed",this.readStatus="closed",this.remoteReadStatus="closed",this.timeline.
close=Date.now(),this.maybeDispatchEnd();try{this.sendReset(e)}catch(t){this.log.error("failed to send reset to remote -\
 %e",t)}this.dispatchEvent(new vS(e))}pause(){if(this.readStatus==="closed"||this.readStatus==="closing")throw new Qr("C\
annot pause a stream that is closing/closed");this.readStatus!=="paused"&&(this.readStatus="paused",this.sendPause())}resume(){
if(this.readStatus==="closed"||this.readStatus==="closing")throw new Qr("Cannot resume a stream that is closing/closed");
this.readStatus!=="readable"&&(this.readStatus="readable",this.dispatchReadBuffer(),this.sendResume())}push(e){if(this.readStatus===
"closed"||this.readStatus==="closing")throw new Qr(`Cannot push data onto a stream that is ${this.readStatus}`);if(e.byteLength!==
0){if(this.readBuffer.append(e),this.readStatus==="paused"||this.listenerCount("message")===0){this.checkReadBufferLength();
return}setTimeout(()=>{this.dispatchReadBuffer()},0)}}unshift(e){if(this.readStatus==="closed"||this.readStatus==="closi\
ng")throw new Qr(`Cannot push data onto a stream that is ${this.readStatus}`);if(e.byteLength!==0){if(this.readBuffer.prepend(
e),this.readStatus==="paused"||this.listenerCount("message")===0){this.checkReadBufferLength();return}setTimeout(()=>{this.
dispatchReadBuffer()},0)}}onData(e){if(e.byteLength!==0){if(this.readStatus==="closing"||this.readStatus==="closed"){this.
log("ignoring data - read status %s",this.readStatus);return}this.readBuffer.append(e),this.dispatchReadBuffer()}}addEventListener(...e){
super.addEventListener.apply(this,e),e[0]==="message"&&this.readBuffer.byteLength>0&&queueMicrotask(()=>{this.dispatchReadBuffer()})}onRemoteReset(){
if(this.status==="aborted"||this.status==="reset"||this.status==="closed")return;this.log("remote reset");const e=new km;
this.#t=e,this.status="reset",this.writeStatus="closed",this.remoteWriteStatus="closed",this.remoteReadStatus="closed",this.
timeline.close=Date.now(),this.readBuffer.byteLength===0&&(this.readStatus="closed",this.maybeDispatchEnd()),this.dispatchEvent(
new SS(e))}onTransportClosed(e){this.log("transport closed"),this.readStatus==="readable"&&this.readBuffer.byteLength===
0&&(this.log("close readable end after transport closed and read buffer is empty"),this.readStatus="closed"),this.remoteReadStatus!==
"closed"&&(this.remoteReadStatus="closed"),this.remoteWriteStatus!=="closed"&&(this.remoteWriteStatus="closed"),this.writeStatus!==
"closed"&&(this.writeStatus="closed"),e!=null?this.abort(e):(this.status==="open"||this.status==="closing")&&(this.timeline.
close=Date.now(),this.status="closed",this.maybeDispatchEnd(),this.dispatchEvent(new dc))}onRemoteCloseWrite(){this.remoteWriteStatus!==
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
if(s===0){e=!1;break}const i=this.writeBuffer.sublist(0,s),o=new Zo(i);this.writeBuffer.consume(i.byteLength);let a;try{
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
new wS(e))}finally{this.readBuffer.byteLength===0&&this.remoteWriteStatus==="closed"&&(this.log("close readable end afte\
r dispatching read buffer and remote writable end is closed"),this.readStatus="closed",this.maybeDispatchEnd()),this.checkReadBufferLength()}}checkReadBufferLength(){
this.readBuffer.byteLength>this.maxReadBufferLength&&this.abort(new zd(`Read buffer length of ${this.readBuffer.byteLength}\
 exceeded limit of ${this.maxReadBufferLength}, read status is ${this.readStatus}`))}checkWriteBufferLength(){this.maxWriteBufferLength!=
null&&this.writeBuffer.byteLength>this.maxWriteBufferLength&&this.abort(new zd(`Write buffer length of ${this.writeBuffer.
byteLength} exceeded limit of ${this.maxWriteBufferLength}, write status is ${this.writeStatus}`))}onMuxerNeedsDrain(){this.
writableNeedsDrain=!0}onMuxerDrain(){this.safeDispatchEvent("drain")}}class Nh extends Rh{remoteAddr;metricPrefix;metrics;constructor(e){
super(e),this.metricPrefix=e.metricPrefix??"",this.metrics=e.metrics,this.remoteAddr=e.remoteAddr,this.addEventListener(
"close",t=>{this.metrics?.increment({[`${this.metricPrefix}end`]:!0}),t.error!=null?t.local?this.metrics?.increment({[`${this.
metricPrefix}abort`]:!0}):this.metrics?.increment({[`${this.metricPrefix}reset`]:!0}):t.local?this.metrics?.increment({[`${this.
metricPrefix}_local_close`]:!0}):this.metrics?.increment({[`${this.metricPrefix}_remote_close`]:!0})})}async close(e){this.
status==="open"&&(this.status="closing",this.writeStatus="closing",this.remoteWriteStatus="closing",this.remoteReadStatus=
"closing",(this.sendingData||this.writeBuffer.byteLength>0)&&(this.log("waiting for write queue to become idle before cl\
osing writable end of stream, %d unsent bytes",this.writeBuffer.byteLength),await er(this,"idle",{...e,rejectionEvents:[
"close"]})),this.writableNeedsDrain&&(this.log("waiting for write queue to drain before closing writable end of stream, \
%d unsent bytes",this.writeBuffer.byteLength),await er(this,"drain",{...e,rejectionEvents:["close"]})),await this.sendClose(
e),this.onTransportClosed())}}function w1(n){return n==null?!1:typeof n.then=="function"&&typeof n.catch=="function"&&typeof n.
finally=="function"}class db extends ue{streams;protocol;status;log;maConn;streamOptions;earlyStreams;maxEarlyStreams;metrics;constructor(e,t){
super(),this.maConn=e,this.protocol=t.protocol,this.streams=[],this.earlyStreams=[],this.status="open",this.log=e.log.newScope(
t.name),this.streamOptions=t.streamOptions,this.maxEarlyStreams=t.maxEarlyStreams??10,this.metrics=t.metrics;const r=o=>{
try{this.onData(o.data)}catch(a){this.abort(a),this.maConn.abort(a)}};this.maConn.addEventListener("message",r);const s=()=>{
this.log("underlying stream drained, signal %d streams to continue writing",this.streams.length),this.streams.forEach(o=>{
o.onMuxerDrain()})};this.maConn.addEventListener("drain",s);const i=()=>{this.log("underlying stream closed with status \
%s and %d streams",this.status,this.streams.length),this.onTransportClosed()};this.maConn.addEventListener("close",i)}send(e){
const t=this.maConn.send(e);return t===!1&&(this.log("underlying stream saturated, signal %d streams to pause writing",this.
streams.length),this.streams.forEach(r=>{r.onMuxerNeedsDrain()})),t}async close(e){this.status==="closed"||this.status===
"closing"||(this.status="closing",await Dt(Promise.all([...this.streams].map(async t=>{await t.close(e)})),e?.signal),this.
status="closed")}abort(e){this.status!=="closed"&&(this.status="closing",[...this.streams].forEach(t=>{t.abort(e)}),this.
status="closed")}onTransportClosed(e){this.status="closing";try{[...this.streams].forEach(t=>{t.onTransportClosed(e)})}catch(t){
this.abort(t)}this.status="closed"}async createStream(e){if(this.status!=="open")throw new Gs;let t=this.onCreateStream(
{...this.streamOptions,...e});return w1(t)&&(t=await t),this.streams.push(t),this.cleanUpStream(t),t}onRemoteStream(e){if(this.
streams.push(e),this.cleanUpStream(e),this.listenerCount("stream")===0){this.earlyStreams.push(e),this.earlyStreams.length>
this.maxEarlyStreams&&this.abort(new jv(`Too many early streams were opened - ${this.earlyStreams.length}/${this.maxEarlyStreams}`));
return}this.safeDispatchEvent("stream",{detail:e})}cleanUpStream(e){const t=r=>{const s=this.streams.findIndex(i=>i===e);
s!==-1&&this.streams.splice(s,1),r.error!=null?r.local?this.metrics?.increment({[`${e.direction}_stream_reset`]:!0}):this.
metrics?.increment({[`${e.direction}_stream_abort`]:!0}):this.metrics?.increment({[`${e.direction}_stream_end`]:!0})};e.
addEventListener("close",t),this.metrics?.increment({[`${e.direction}_stream`]:!0})}addEventListener(...e){super.addEventListener.
apply(this,e),e[0]==="stream"&&this.earlyStreams.length>0&&queueMicrotask(()=>{this.earlyStreams.forEach(t=>{this.safeDispatchEvent(
"stream",{detail:t})}),this.earlyStreams=[]})}}class fb extends Rh{id;protocol;constructor(e){super(e),this.id=e.id,this.
protocol=e.protocol??""}async close(e){this.writeStatus==="closing"||this.writeStatus==="closed"||(this.writeStatus="clo\
sing",(this.sendingData||this.writeBuffer.byteLength>0)&&(this.log("waiting for write queue to become idle before closin\
g writable end of stream, %d unsent bytes",this.writeBuffer.byteLength),await er(this,"idle",{...e,rejectionEvents:["clo\
se"]})),this.writableNeedsDrain&&(this.log("waiting for write queue to drain before closing writable end of stream, %d u\
nsent bytes, sending %s",this.writeBuffer.byteLength,this.sendingData),await er(this,"drain",{...e,rejectionEvents:["clo\
se"]}),this.log("write queue drained, closing writable end of stream, %d unsent bytes, sending %s",this.writeBuffer.byteLength,
this.sendingData)),await this.sendCloseWrite(e),this.writeStatus="closed",this.log("closed writable end gracefully"),this.
remoteWriteStatus==="closed"&&this.onTransportClosed())}async closeRead(e){if(!(this.readStatus==="closing"||this.readStatus===
"closed")){this.readBuffer.byteLength>0&&this.readBuffer.consume(this.readBuffer.byteLength),this.readStatus="closing",this.
maybeDispatchEnd();try{await this.sendCloseRead(e)}catch(t){throw this.log.error("failed to close readable end - %e",t),
t}finally{this.readStatus="closed"}this.log("closed readable end gracefully")}}}function Ln(n){const e=new globalThis.AbortController;
function t(){const i=n.filter(o=>o?.aborted===!0).map(o=>o?.reason).pop();e.abort(i);for(const o of n)o?.removeEventListener!=
null&&o.removeEventListener("abort",t)}for(const i of n){if(i?.aborted===!0){t();break}i?.addEventListener!=null&&i.addEventListener(
"abort",t)}function r(){for(const i of n)i?.removeEventListener!=null&&i.removeEventListener("abort",t)}const s=e.signal;
return s.clear=r,s}class Kc{movingAverage;variance;deviation;forecast;timeSpan;previousTime;constructor(e){this.timeSpan=
e,this.movingAverage=0,this.variance=0,this.deviation=0,this.forecast=0}alpha(e,t){return 1-Math.exp(-(e-t)/this.timeSpan)}push(e,t=Date.
now()){if(this.previousTime!=null){const r=this.alpha(t,this.previousTime),s=e-this.movingAverage,i=r*s;this.movingAverage=
r*e+(1-r)*this.movingAverage,this.variance=(1-r)*(this.variance+s*i),this.deviation=Math.sqrt(this.variance),this.forecast=
this.movingAverage+r*s}else this.movingAverage=e;this.previousTime=t}}const v1=1.2,S1=2,A1=5e3,E1=6e4,_1=5e3;class x1{success;failure;next;metric;timeoutMultiplier;failureMultiplier;minTimeout;maxTimeout;constructor(e={}){
const t=e.interval??_1;this.success=new Kc(t),this.failure=new Kc(t),this.next=new Kc(t),this.failureMultiplier=e.failureMultiplier??
S1,this.timeoutMultiplier=e.timeoutMultiplier??v1,this.minTimeout=e.minTimeout??A1,this.maxTimeout=e.maxTimeout??E1,e.metricName!=
null&&(this.metric=e.metrics?.registerMetricGroup(e.metricName))}getTimeoutSignal(e={}){let t=Math.round(this.next.movingAverage*
(e.timeoutFactor??this.timeoutMultiplier));t<this.minTimeout&&(t=this.minTimeout),t>this.maxTimeout&&(t=this.maxTimeout);
const r=AbortSignal.timeout(t),s=Ln([e.signal,r]);return s.start=Date.now(),s.timeout=t,s}cleanUp(e){e.clear();const t=Date.
now()-e.start;e.aborted?(this.failure.push(t),this.next.push(t*this.failureMultiplier),this.metric?.update({failureMovingAverage:this.
failure.movingAverage,failureDeviation:this.failure.deviation,failureForecast:this.failure.forecast,failureVariance:this.
failure.variance,failure:t})):(this.success.push(t),this.next.push(t),this.metric?.update({successMovingAverage:this.success.
movingAverage,successDeviation:this.success.deviation,successForecast:this.success.forecast,successVariance:this.success.
variance,success:t}))}}const C1=1024*1024*4,I1=1024*1024*4;class T1{buffer;maxBufferSize;lengthDecoder;maxDataLength;encodingLength;constructor(e={}){
this.buffer=new Zo,this.maxBufferSize=e.maxBufferSize??C1,this.maxDataLength=e.maxDataLength??I1,this.lengthDecoder=e.lengthDecoder??
Hv,this.encodingLength=e.encodingLength??Xv}*decode(e){if(this.buffer.append(e),this.buffer.byteLength>this.maxBufferSize)
throw new P(`Buffer length limit exceeded - ${this.buffer.byteLength}/${this.maxBufferSize}`);for(;;){let t;try{t=this.lengthDecoder(
this.buffer)}catch(i){if(i instanceof RangeError)break;throw i}if(t<0||t>this.maxDataLength)throw new Qv("Invalid messag\
e length");const r=this.encodingLength(t),s=r+t;if(this.buffer.byteLength>=s){const i=this.buffer.sublist(r,s);this.buffer.
consume(s),i.byteLength>0&&(yield i)}else break}}}function D1(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8\
Array")return sf(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return sf(new Uint8Array(
n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function P1(n){return n?.buffer instanceof
ArrayBuffer}function sf(n){return P1(n)?n:n.slice()}function M1(n,e,t){if(n.length>=255)throw new TypeError("Alphabet to\
o long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(
0);if(r[a]!==255)throw new TypeError(o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().
charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/
Math.log(u);function A(d){if(d instanceof Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):
Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===
0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],
_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");
E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!=
"string")throw new TypeError("Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,
w=0;d[m]===h;)E++,m++;for(var b=(d.length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;
for(var x=0,_=b-1;(g!==0||x<w)&&_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-ze\
ro carry");w=x,m++}if(d[m]!==" "){for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=
v[S++];return C}}}function I(d){var m=y(d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,
decode:I}}var $1=M1,k1=$1;let L1=class{name;prefix;baseEncode;constructor(e,t,r){this.name=e,this.prefix=t,this.baseEncode=
r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be bi\
nary type")}},R1=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){this.name=e,this.prefix=t;const s=t.codePointAt(
0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.baseDecode=r}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return pb(this,e)}},N1=class{decoders;constructor(e){this.decoders=
e}or(e){return pb(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=null)return r.decode(e);throw RangeError(`Unab\
le to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supporte\
d`)}};function pb(n,e){return new N1({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let F1=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){
this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=s,this.encoder=new L1(e,t,r),this.decoder=new R1(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function gb({name:n,prefix:e,encode:t,decode:r}){
return new F1(n,e,t,r)}function mb({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=k1(t,n,r);
return gb({prefix:e,name:n,encode:s,decode:o=>D1(i(o))})}function U1(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function O1(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function B1(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function dt({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=B1(r,s);return gb(
{prefix:e,name:n,encode(o){return O1(o,r,t)},decode(o){return U1(o,i,t,n)}})}const z1=dt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});dt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});dt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});dt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const V1=mb(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});mb({name:"base58fli\
ckr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});const q1=dt({prefix:"m",name:"ba\
se64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});dt({prefix:"M",name:"b\
ase64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});dt({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});dt({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});const fs=1e3,
ps=fs*60,gs=ps*60,mr=gs*24,xi=mr*7,ms=mr*365.25,Ci=ms/12;function W1(n,e){if(typeof n=="string")return K1(n);if(typeof n==
"number")return H1(n,e);throw Error(`Value provided to ms() must be a string or number. value=${JSON.stringify(n)}`)}var bb=W1;
function K1(n){if(typeof n!="string"||n.length===0||n.length>100)throw Error(`Value provided to ms.parse() must be a str\
ing with length between 1 and 99. value=${JSON.stringify(n)}`);let e=/^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.
exec(n);if(!e?.groups)return NaN;let{value:t,unit:r="ms"}=e.groups,s=parseFloat(t),i=r.toLowerCase();switch(i){case"year\
s":case"year":case"yrs":case"yr":case"y":return s*ms;case"months":case"month":case"mo":return s*Ci;case"weeks":case"week":case"\
w":return s*xi;case"days":case"day":case"d":return s*mr;case"hours":case"hour":case"hrs":case"hr":case"h":return s*gs;case"\
minutes":case"minute":case"mins":case"min":case"m":return s*ps;case"seconds":case"second":case"secs":case"sec":case"s":return s*
fs;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s;default:throw Error(`Unknown unit "${i}\
" provided to ms.parse(). value=${JSON.stringify(n)}`)}}function G1(n){let e=Math.abs(n);return e>=ms?`${Math.round(n/ms)}\
y`:e>=Ci?`${Math.round(n/Ci)}mo`:e>=xi?`${Math.round(n/xi)}w`:e>=mr?`${Math.round(n/mr)}d`:e>=gs?`${Math.round(n/gs)}h`:
e>=ps?`${Math.round(n/ps)}m`:e>=fs?`${Math.round(n/fs)}s`:`${n}ms`}function j1(n){let e=Math.abs(n);return e>=ms?On(n,e,
ms,"year"):e>=Ci?On(n,e,Ci,"month"):e>=xi?On(n,e,xi,"week"):e>=mr?On(n,e,mr,"day"):e>=gs?On(n,e,gs,"hour"):e>=ps?On(n,e,
ps,"minute"):e>=fs?On(n,e,fs,"second"):`${n} ms`}function H1(n,e){if(typeof n!="number"||!Number.isFinite(n))throw Error(
"Value provided to ms.format() must be of type number.");return e?.long?j1(n):G1(n)}function On(n,e,t,r){let s=e>=t*1.5;
return`${Math.round(n/t)} ${r}${s?"s":""}`}function X1(n){t.debug=t,t.default=t,t.coerce=c,t.disable=i,t.enable=s,t.enabled=
o,t.humanize=bb,t.destroy=l,Object.keys(n).forEach(u=>{t[u]=n[u]}),t.names=[],t.skips=[],t.formatters={};function e(u){let h=0;
for(let f=0;f<u.length;f++)h=(h<<5)-h+u.charCodeAt(f),h|=0;return t.colors[Math.abs(h)%t.colors.length]}t.selectColor=e;
function t(u,h){let f,p=null,A,y;function I(...d){if(!I.enabled)return;const m=I,E=Number(new Date),w=E-(f||E);m.diff=w,
m.prev=f,m.curr=E,f=E,d[0]=t.coerce(d[0]),typeof d[0]!="string"&&d.unshift("%O");let b=0;d[0]=d[0].replace(/%([a-zA-Z%])/g,
(g,x)=>{if(g==="%%")return"%";b++;const _=t.formatters[x];if(typeof _=="function"){const S=d[b];g=_.call(m,S),d.splice(b,
1),b--}return g}),t.formatArgs.call(m,d),h?.onLog!=null&&h.onLog(...d),(m.log||t.log).apply(m,d)}return I.namespace=u,I.
useColors=t.useColors(),I.color=t.selectColor(u),I.extend=r,I.destroy=t.destroy,Object.defineProperty(I,"enabled",{enumerable:!0,
configurable:!1,get:()=>p!==null?p:(A!==t.namespaces&&(A=t.namespaces,y=t.enabled(u)),y),set:d=>{p=d}}),typeof t.init=="\
function"&&t.init(I),I}function r(u,h){const f=t(this.namespace+(typeof h>"u"?":":h)+u);return f.log=this.log,f}function s(u){
t.save(u),t.namespaces=u,t.names=[],t.skips=[];let h;const f=(typeof u=="string"?u:"").split(/[\s,]+/),p=f.length;for(h=
0;h<p;h++)f[h]&&(u=f[h].replace(/\*/g,".*?"),u[0]==="-"?t.skips.push(new RegExp("^"+u.substr(1)+"$")):t.names.push(new RegExp(
"^"+u+"$")))}function i(){const u=[...t.names.map(a),...t.skips.map(a).map(h=>"-"+h)].join(",");return t.enable(""),u}function o(u){
if(u[u.length-1]==="*")return!0;let h,f;for(h=0,f=t.skips.length;h<f;h++)if(t.skips[h].test(u))return!1;for(h=0,f=t.names.
length;h<f;h++)if(t.names[h].test(u))return!0;return!1}function a(u){return u.toString().substring(2,u.toString().length-
2).replace(/\.\*\?$/,"*")}function c(u){return u instanceof Error?u.stack??u.message:u}function l(){console.warn("Instan\
ce method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `\
debug`.")}return t.setupFormatters(t.formatters),t.enable(t.load()),t}var Q1={};const _a=rA(),Y1=["#0000CC","#0000FF","#\
0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#\
3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#\
33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#\
99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#\
CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#\
FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#\
FFCC00","#FFCC33"];function J1(){return typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.
__nwjs)?!0:typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/)!=null?!1:typeof document<
"u"&&document.documentElement?.style?.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.
console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/)!=
null&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/)}function Z1(n){
if(n[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+n[0]+(this.useColors?"%c ":" ")+"+"+bb(this.diff),
!this.useColors)return;const e="color: "+this.color;n.splice(1,0,e,"color: inherit");let t=0,r=0;n[0].replace(/%[a-zA-Z%]/g,
s=>{s!=="%%"&&(t++,s==="%c"&&(r=t))}),n.splice(r,0,e)}const eA=console.debug??console.log??(()=>{});function tA(n){try{n?
_a?.setItem("debug",n):_a?.removeItem("debug")}catch{}}function nA(){let n;try{n=_a?.getItem("debug")}catch{}return!n&&typeof globalThis.
process<"u"&&"env"in globalThis.process&&(n=Q1.DEBUG),n}function rA(){try{return localStorage}catch{}}function sA(n){n.j=
function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}}const ht=X1({formatArgs:Z1,
save:tA,load:nA,useColors:J1,setupFormatters:sA,colors:Y1,storage:_a,log:eA});ht.formatters.b=n=>n==null?"undefined":V1.
baseEncode(n);ht.formatters.t=n=>n==null?"undefined":z1.baseEncode(n);ht.formatters.m=n=>n==null?"undefined":q1.baseEncode(
n);ht.formatters.p=n=>n==null?"undefined":n.toString();ht.formatters.c=n=>n==null?"undefined":n.toString();ht.formatters.
k=n=>n==null?"undefined":n.toString();ht.formatters.a=n=>n==null?"undefined":n.toString();function of(n,e=""){const t=af(
n.message),r=af(n.stack);return t!=null&&r!=null?r.includes(t)?`${r.split(`
`).join(`
${e}`)}`:`${t}
${e}${r.split(`
`).join(`
${e}`)}`:r!=null?`${r.split(`
`).join(`
${e}`)}`:t!=null?`${t}`:`${n.toString()}`}function iA(n){return n instanceof AggregateError||n?.name==="AggregateError"&&
Array.isArray(n.errors)}function yb(n,e=""){if(iA(n)){let t=of(n,e);return n.errors.length>0?(e=`${e}    `,t+=`
${e}${n.errors.map(r=>`${yb(r,`${e}`)}`).join(`
${e}`)}`):t+=`
${e}[Error list was empty]`,t.trim()}return of(n,e)}ht.formatters.e=n=>n==null?"undefined":yb(n);function oA(n){const e=()=>{};
return e.enabled=!1,e.color="",e.diff=0,e.log=()=>{},e.namespace=n,e.destroy=()=>!0,e.extend=()=>e,e.useColors=()=>!1,e}
function wb(n){return{forComponent(e){return vb(e,n)}}}function vb(n,e){let t=oA(`${n}:trace`);return ht.enabled(`${n}:t\
race`)&&ht.names.map(r=>r.toString()).find(r=>r.includes(":trace"))!=null&&(t=ht(`${n}:trace`,e)),Object.assign(ht(n,e),
{error:ht(`${n}:error`,e),trace:t,newScope:r=>vb(`${n}:${r}`,e)})}function af(n){if(n!=null&&(n=n.trim(),n.length!==0))return n}
class Fh extends hb{has(e){return this.find(e)!=null}find(e){return this.queue.find(t=>e.equals(t.options.peerId))}}let aA=class extends hb{constructor(e={}){
super({...e,sort:(t,r)=>t.options.priority>r.options.priority?-1:t.options.priority<r.options.priority?1:0})}};class cA{memoryStorage;points;duration;blockDuration;keyPrefix;constructor(e={}){
this.points=e.points??4,this.duration=e.duration??1,this.blockDuration=e.blockDuration??0,this.keyPrefix=e.keyPrefix??"r\
lflx",this.memoryStorage=new lA}consume(e,t=1,r={}){const s=this.getKey(e),i=this._getKeySecDuration(r);let o=this.memoryStorage.
incrby(s,t,i);if(o.remainingPoints=Math.max(this.points-o.consumedPoints,0),o.consumedPoints>this.points)throw this.blockDuration>
0&&o.consumedPoints<=this.points+t&&(o=this.memoryStorage.set(s,o.consumedPoints,this.blockDuration)),new Yv("Rate limit\
 exceeded",o);return o}penalty(e,t=1,r={}){const s=this.getKey(e),i=this._getKeySecDuration(r),o=this.memoryStorage.incrby(
s,t,i);return o.remainingPoints=Math.max(this.points-o.consumedPoints,0),o}reward(e,t=1,r={}){const s=this.getKey(e),i=this.
_getKeySecDuration(r),o=this.memoryStorage.incrby(s,-t,i);return o.remainingPoints=Math.max(this.points-o.consumedPoints,
0),o}block(e,t){const r=t*1e3,s=this.points+1;return this.memoryStorage.set(this.getKey(e),s,t),{remainingPoints:0,msBeforeNext:r===
0?-1:r,consumedPoints:s,isFirstInDuration:!1}}set(e,t,r=0){const s=(r>=0?r:this.duration)*1e3;return this.memoryStorage.
set(this.getKey(e),t,r),{remainingPoints:0,msBeforeNext:s===0?-1:s,consumedPoints:t,isFirstInDuration:!1}}get(e){const t=this.
memoryStorage.get(this.getKey(e));return t!=null&&(t.remainingPoints=Math.max(this.points-t.consumedPoints,0)),t}delete(e){
this.memoryStorage.delete(this.getKey(e))}_getKeySecDuration(e){return e?.customDuration!=null&&e.customDuration>=0?e.customDuration:
this.duration}getKey(e){return this.keyPrefix.length>0?`${this.keyPrefix}:${e}`:e}parseKey(e){return e.substring(this.keyPrefix.
length)}}class lA{storage;constructor(){this.storage=new Map}incrby(e,t,r){const s=this.storage.get(e);if(s!=null){const i=s.
expiresAt!=null?s.expiresAt.getTime()-new Date().getTime():-1;return s.expiresAt==null||i>0?(s.value+=t,{remainingPoints:0,
msBeforeNext:i,consumedPoints:s.value,isFirstInDuration:!1}):this.set(e,t,r)}return this.set(e,t,r)}set(e,t,r){const s=r*
1e3,i=this.storage.get(e);i!=null&&clearTimeout(i.timeoutId);const o={value:t,expiresAt:s>0?new Date(Date.now()+s):void 0};
return this.storage.set(e,o),s>0&&(o.timeoutId=setTimeout(()=>{this.storage.delete(e)},s),o.timeoutId.unref!=null&&o.timeoutId.
unref()),{remainingPoints:0,msBeforeNext:s===0?-1:s,consumedPoints:o.value,isFirstInDuration:!0}}get(e){const t=this.storage.
get(e);if(t!=null)return{remainingPoints:0,msBeforeNext:t.expiresAt!=null?t.expiresAt.getTime()-new Date().getTime():-1,
consumedPoints:t.value,isFirstInDuration:!1}}delete(e){const t=this.storage.get(e);return t!=null?(t.timeoutId!=null&&clearTimeout(
t.timeoutId),this.storage.delete(e),!0):!1}}function Sb(n,e,t){let r,s,i=!1;function o(){const l={signal:s.signal};let u;
t?.timeout!=null&&(u=Ln([s.signal,AbortSignal.timeout(t.timeout)]),l.signal=u),i=!0,Promise.resolve().then(async()=>{await n(
l)}).catch(()=>{}).finally(()=>{u!=null&&(u.aborted?u.clear():u.addEventListener("abort",()=>{u.clear()},{once:!0})),i=!1,
!s.signal.aborted&&(r=setTimeout(o,e))})}const a=Ea(o,t?.debounce??100);let c=!1;return{setInterval:l=>{e!==l&&(e=l,r!=null&&
(clearTimeout(r),r=setTimeout(o,e)))},setTimeout:l=>{t??={},t.timeout=l},run:()=>{i||(clearTimeout(r),a())},start:()=>{c||
(c=!0,s=new AbortController,s.signal,t?.runImmediately===!0?queueMicrotask(()=>{o()}):r=setTimeout(o,e))},stop:()=>{clearTimeout(
r),s?.abort(),c=!1}}}class uA extends Map{metric;constructor(e){super();const{name:t,metrics:r}=e;this.metric=r.registerMetric(
t),this.updateComponentMetric()}set(e,t){return super.set(e,t),this.updateComponentMetric(),this}delete(e){const t=super.
delete(e);return this.updateComponentMetric(),t}clear(){super.clear(),this.updateComponentMetric()}updateComponentMetric(){
this.metric.update(this.size)}}function Qt(n){const{name:e,metrics:t}=n;let r;return t!=null?r=new uA({name:e,metrics:t}):
r=new Map,r}function hA(n){return n[Symbol.asyncIterator]!=null}function bu(n){if(hA(n))return(async()=>{const t=[];for await(const r of n)
t.push(r);return t})();const e=[];for(const t of n)e.push(t);return e}function Tr(n,e){if(n===e)return!0;if(n.byteLength!==
e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function dA(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function bs(n){if(n instanceof
Uint8Array&&n.constructor.name==="Uint8Array")return Ii(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.
isView(n))return Ii(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function fA(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const cf=4096;
function pA(n){const e=n.length;if(e<=cf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.
apply(String,n.subarray(r,r+=cf));return t}function gA(n){return n?.buffer instanceof ArrayBuffer}function Ii(n){return gA(
n)?n:n.slice()}function mA(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),
s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof
Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.
from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,
w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==
0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-
E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError(
"Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var bA=mA,yA=bA;let wA=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},vA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Ab(this,e)}},
SA=class{decoders;constructor(e){this.decoders=e}or(e){return Ab(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Ab(n,e){return new SA({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let AA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new wA(e,t,r),this.decoder=new vA(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function yc({name:n,prefix:e,encode:t,decode:r}){return new AA(n,e,t,
r)}function Xi({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=yA(t,n,r);return yc({prefix:e,
name:n,encode:s,decode:o=>bs(i(o))})}function EA(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function _A(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function xA(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function pe({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=xA(r,s);return yc(
{prefix:e,name:n,encode(o){return _A(o,r,t)},decode(o){return EA(o,i,t,n)}})}const ot=Xi({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),CA=Xi({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),IA=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ot,
base58flickr:CA},Symbol.toStringTag,{value:"Module"})),ni=pe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),TA=pe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),DA=pe({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),PA=pe({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),MA=pe({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),$A=pe({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
kA=pe({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),LA=pe(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),RA=pe(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),NA=Object.freeze(Object.defineProperty(
{__proto__:null,base32:ni,base32hex:MA,base32hexpad:kA,base32hexpadupper:LA,base32hexupper:$A,base32pad:DA,base32padupper:PA,
base32upper:TA,base32z:RA},Symbol.toStringTag,{value:"Module"})),na=Xi({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),FA=Xi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),UA=Object.freeze(Object.defineProperty({__proto__:null,base36:na,base36upper:FA},Symbol.
toStringTag,{value:"Module"}));var OA=Eb,lf=128,BA=-128,zA=Math.pow(2,31);function Eb(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
zA;)e[t++]=n&255|lf,n/=128;for(;n&BA;)e[t++]=n&255|lf,n>>>=7;return e[t]=n|0,Eb.bytes=t-r+1,e}var VA=yu,qA=128,uf=127;function yu(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw yu.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&uf)<<s:(o&uf)*Math.pow(2,s),s+=7}while(o>=qA);return yu.bytes=i-r,t}var WA=Math.pow(2,7),KA=Math.pow(2,14),GA=Math.
pow(2,21),jA=Math.pow(2,28),HA=Math.pow(2,35),XA=Math.pow(2,42),QA=Math.pow(2,49),YA=Math.pow(2,56),JA=Math.pow(2,63),ZA=function(n){
return n<WA?1:n<KA?2:n<GA?3:n<jA?4:n<HA?5:n<XA?6:n<QA?7:n<YA?8:n<JA?9:10},eE={encode:OA,decode:VA,encodingLength:ZA},xa=eE;
function wu(n,e=0){const t=xa.decode(n,e),r=xa.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function Ca(n,e,t=0){return xa.
encode(n,e,t),e}function Ia(n){return xa.encodingLength(n)}function wc(n,e){const t=e.byteLength,r=Ia(n),s=r+Ia(t),i=new Uint8Array(
s+t);return Ca(n,i,0),Ca(t,i,r),i.set(e,s),new Uh(n,t,e,i)}function tE(n){const e=bs(n),[t,r]=wu(e),[s,i]=wu(e.subarray(
r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new Uh(t,s,o,e)}function nE(n,e){if(n===
e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&dA(n.bytes,t.bytes)}}let Uh=class{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Ii(r),this.bytes=Ii(s)}};function hf(n,e){const{bytes:t,version:r}=n;switch(r){case 0:
return sE(t,vu(n),e??ot.encoder);default:return iE(t,vu(n),e??ni.encoder)}}const df=new WeakMap;function vu(n){const e=df.
get(n);if(e==null){const t=new Map;return df.set(n,t),t}return e}let vc=class Ee{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Ii(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==Ps)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==oE)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return Ee.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=wc(e,t);return Ee.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return Ee.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&nE(e.multihash,r.multihash)}toString(e){return hf(this,e)}toJSON(){return{
"/":hf(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ee)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new Ee(r,s,i,o??ff(r,s,i.bytes))}else if(t[aE]===!0){const{
version:r,multihash:s,code:i}=t,o=tE(s);return Ee.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==Ps)throw new Error(`Version 0 CID must use dag-pb (code: ${Ps}) block encoding`);return new Ee(
e,t,r,r.bytes)}case 1:{const s=ff(e,t,r.bytes);return new Ee(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return Ee.create(0,Ps,e)}static createV1(e,t){return Ee.create(1,e,t)}static decode(e){const[t,r]=Ee.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ee.inspectBytes(e),r=t.size-t.multihashSize,
s=bs(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Uh(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ee.createV0(o):Ee.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,f]=wu(e.subarray(t));return t+=f,h};let s=r(),
i=Ps;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=rE(e,t),
i=Ee.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return vu(
i).set(r,e),i}};function rE(n,e){switch(n[0]){case"Q":{const t=e??ot;return[ot.prefix,t.decode(`${ot.prefix}${n}`)]}case ot.
prefix:{const t=e??ot;return[ot.prefix,t.decode(n)]}case ni.prefix:{const t=e??ni;return[ni.prefix,t.decode(n)]}case na.
prefix:{const t=e??na;return[na.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function sE(n,e,t){const{prefix:r}=t;if(r!==
ot.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function iE(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Ps=112,oE=18;function ff(n,e,t){const r=Ia(n),s=r+Ia(e),i=new Uint8Array(s+t.
byteLength);return Ca(n,i,0),Ca(e,i,r),i.set(t,s),i}const aE=Symbol.for("@ipld/js-cid/CID"),_b=0,cE="identity",xb=bs;function lE(n,e){
if(e?.truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return wc(_b,xb(n))}const Oh={code:_b,
name:cE,encode:xb,digest:lE};function uE(n){return n.buffer instanceof ArrayBuffer}function Rn(n){return uE(n)?n:n.slice()}
async function hE(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,Rn(e),Rn(
t.subarray()));return r?.signal?.throwIfAborted(),i}function rn(n=0){return new Uint8Array(n)}function br(n=0){return new Uint8Array(
n)}function dE(n){return n?.buffer instanceof ArrayBuffer}function fE(n){if(dE(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Su(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=br(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return fE(t)}const Cb=Symbol.for("@achingbrain/uint8arraylist");function pf(n,e){if(e==null||e<0)
throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-
t};t=s}throw new RangeError("index is out of bounds")}function po(n){return!!n?.[Cb]}let Yt=class ra{bufs;length;[Cb]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(po(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(po(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=pf(this.bufs,e);return t.buf[t.index]}set(e,t){const r=pf(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(po(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Su(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:Su(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ra;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!po(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=br(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=rn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=rn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=rn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=br(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=rn(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=rn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=rn(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=rn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=rn(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ra)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!Tr(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ra;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const pE=Xi({prefix:"9",name:"\
base10",alphabet:"0123456789"}),gE=Object.freeze(Object.defineProperty({__proto__:null,base10:pE},Symbol.toStringTag,{value:"\
Module"})),mE=pe({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),bE=pe({prefix:"\
F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),yE=Object.freeze(Object.defineProperty(
{__proto__:null,base16:mE,base16upper:bE},Symbol.toStringTag,{value:"Module"})),wE=pe({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),vE=Object.freeze(Object.defineProperty({__proto__:null,base2:wE},Symbol.toStringTag,{value:"Module"})),
Ib=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),SE=Ib.reduce((n,e,t)=>(n[t]=e,n),[]),AE=Ib.reduce((n,e,t)=>{const r=e.codePointAt(
0);if(r==null)throw new Error(`Invalid character: ${e}`);return n[r]=t,n},[]);function EE(n){return n.reduce((e,t)=>(e+=
SE[t],e),"")}function _E(n){const e=[];for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=AE[r];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const xE=yc({prefix:"🚀",name:"base256emoji",encode:EE,decode:_E}),CE=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:xE},Symbol.toStringTag,{value:"Module"})),IE=pe({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),TE=pe({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOP\
QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),DE=pe({prefix:"u",name:"base64url",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),PE=pe({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),ME=Object.freeze(Object.defineProperty(
{__proto__:null,base64:IE,base64pad:TE,base64url:DE,base64urlpad:PE},Symbol.toStringTag,{value:"Module"})),$E=pe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),kE=Object.freeze(Object.defineProperty({__proto__:null,base8:$E},Symbol.
toStringTag,{value:"Module"})),LE=yc({prefix:"\0",name:"identity",encode:n=>pA(bs(n)),decode:n=>bs(fA(n))}),RE=Object.freeze(
Object.defineProperty({__proto__:null,identity:LE},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const NE=20;function FE({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new UE(n,e,t,r,s)}let UE=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??NE,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
gf(r,this.code,t?.truncate):r.then(s=>gf(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function gf(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return wc(e,n)}function OE(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const BE=FE({name:"sha2-256",code:18,encode:OE("SHA-256")}),mf={...RE,...vE,...kE,...gE,...yE,...NA,
...UA,...IA,...ME,...CE};function Tb(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const bf=Tb("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Gc=Tb("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=br(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Db={utf8:bf,"utf-8":bf,hex:mf.base16,latin1:Gc,ascii:Gc,
binary:Gc,...mf};function Nn(n,e="utf8"){const t=Db[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function at(n,e="utf8"){const t=Db[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const zE=parseInt("11111",2),Au=parseInt("10000000",2),VE=parseInt("01\
111111",2),yf={0:Ms,1:Ms,2:qE,3:GE,4:jE,5:KE,6:WE,16:Ms,22:Ms,48:Ms};function Sc(n,e={offset:0}){const t=n[e.offset]&zE;
if(e.offset++,yf[t]!=null)return yf[t](n,e);throw new Error("No decoder for tag "+t)}function Qi(n,e){let t=0;if((n[e.offset]&
Au)===Au){const r=n[e.offset]&VE;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)throw new Error(
"invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}function Ms(n,e){
Qi(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=Sc(n,e);if(r===null)break;t.push(r)}return t}function qE(n,e){
const t=Qi(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.offset+=t,Uint8Array.
from(i)}function WE(n,e){const t=Qi(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function KE(n,e){return e.offset++,null}function GE(n,e){
const t=Qi(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=t,r!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function jE(n,e){const t=Qi(n,e),r=n.subarray(e.offset,e.offset+t);
return e.offset+=t,r}function HE(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new Yt;for(let r=0;r<e.length;r+=
2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function Bh(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=HE(n.byteLength);return new Yt(Uint8Array.from([e.byteLength|Au]),e)}function Eu(n){const e=new Yt,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new Yt(Uint8Array.from([2]),Bh(e),e)}function Pb(n){
const e=Uint8Array.from([0]),t=new Yt(e,n);return new Yt(Uint8Array.from([3]),Bh(t),t)}function ri(n,e=48){const t=new Yt;
for(const r of n)t.append(r);return new Yt(Uint8Array.from([e]),Bh(t),t)}const XE=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),QE=Uint8Array.from([6,5,43,129,4,0,34]),YE=Uint8Array.from([6,5,43,129,4,0,35]),JE={ext:!0,kty:"EC",crv:"P-256"},
ZE={ext:!0,kty:"EC",crv:"P-384"},e_={ext:!0,kty:"EC",crv:"P-521"},jc=32,Hc=48,Xc=66;function t_(n){const e=Sc(n);return n_(
e)}function n_(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===jc*2+1)return r=at(e.subarray(t,t+jc),"base64url"),s=
at(e.subarray(t+jc),"base64url"),new Qc({...JE,key_ops:["verify"],x:r,y:s});if(e.byteLength===Hc*2+1)return r=at(e.subarray(
t,t+Hc),"base64url"),s=at(e.subarray(t+Hc),"base64url"),new Qc({...ZE,key_ops:["verify"],x:r,y:s});if(e.byteLength===Xc*
2+1)return r=at(e.subarray(t,t+Xc),"base64url"),s=at(e.subarray(t+Xc),"base64url"),new Qc({...e_,key_ops:["verify"],x:r,
y:s});throw new P(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function r_(n){return ri(
[Eu(Uint8Array.from([1])),ri([s_(n.crv)],160),ri([Pb(new Yt(Uint8Array.from([4]),Nn(n.x??"","base64url"),Nn(n.y??"","bas\
e64url")))],161)]).subarray()}function s_(n){if(n==="P-256")return XE;if(n==="P-384")return QE;if(n==="P-521")return YE;
throw new P(`Invalid curve ${n}`)}let Qc=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=r_(this.jwk)),this._raw}toMultihash(){return Oh.digest(jh(this))}toCID(){return vc.createV1(114,this.toMultihash())}toString(){
return ot.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Tr(this.
raw,e.raw)}async verify(e,t,r){return hE(this.jwk,t,e,r)}},wf=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},i_=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const yr={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new i_(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},Mb=32,zh=64,_u=32;let ns;const $b=(async()=>{try{return await yr.get().
subtle.generateKey({name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();function o_(){const n=gr.utils.randomSecretKey(),
e=gr.getPublicKey(n);return{privateKey:f_(n,e),publicKey:e}}async function a_(n,e){let t;n.length===zh?t=n.subarray(0,32):
t=n;const r={crv:"Ed25519",kty:"OKP",x:at(n.subarray(32),"base64url"),d:at(t,"base64url"),ext:!0,key_ops:["sign"]},s=await yr.
get().subtle.importKey("jwk",r,{name:"Ed25519"},!0,["sign"]),i=await yr.get().subtle.sign({name:"Ed25519"},s,Rn(e instanceof
Uint8Array?e:e.subarray()));return new Uint8Array(i,0,i.byteLength)}function c_(n,e){const t=n.subarray(0,_u);return gr.
sign(e instanceof Uint8Array?e:e.subarray(),t)}async function l_(n,e){return ns==null&&(ns=await $b),ns?a_(n,e):c_(n,e)}
async function u_(n,e,t){if(n.buffer instanceof ArrayBuffer){const r=await yr.get().subtle.importKey("raw",n.buffer,{name:"\
Ed25519"},!1,["verify"]);return await yr.get().subtle.verify({name:"Ed25519"},r,Rn(e),Rn(t instanceof Uint8Array?t:t.subarray()))}
throw new TypeError("WebCrypto does not support SharedArrayBuffer for Ed25519 keys")}function h_(n,e,t){return gr.verify(
e,t instanceof Uint8Array?t:t.subarray(),n)}async function d_(n,e,t){return ns==null&&(ns=await $b),ns?u_(n,e,t):h_(n,e,
t)}function f_(n,e){const t=new Uint8Array(zh);for(let r=0;r<_u;r++)t[r]=n[r],t[_u+r]=e[r];return t}function Vh(n){return n==
null?!1:typeof n.then=="function"&&typeof n.catch=="function"&&typeof n.finally=="function"}let kb=class{type="Ed25519";raw;constructor(e){
this.raw=qh(e,Mb)}toMultihash(){return Oh.digest(jh(this))}toCID(){return vc.createV1(114,this.toMultihash())}toString(){
return ot.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Tr(this.
raw,e.raw)}verify(e,t,r){r?.signal?.throwIfAborted();const s=d_(this.raw,t,e);return Vh(s)?s.then(i=>(r?.signal?.throwIfAborted(),
i)):s}};class p_{type="Ed25519";raw;publicKey;constructor(e,t){this.raw=qh(e,zh),this.publicKey=new kb(t)}equals(e){return e==
null||!(e.raw instanceof Uint8Array)?!1:Tr(this.raw,e.raw)}sign(e,t){t?.signal?.throwIfAborted();const r=l_(this.raw,e);
return Vh(r)?r.then(s=>(t?.signal?.throwIfAborted(),s)):(t?.signal?.throwIfAborted(),r)}}function g_(n){return n=qh(n,Mb),
new kb(n)}async function m_(){const{privateKey:n,publicKey:e}=o_();return new p_(n,e)}function qh(n,e){if(n=Uint8Array.from(
n??[]),n.length!==e)throw new P(`Key must be a Uint8Array of length ${e}, got ${n.length}`);return n}const b_=Math.pow(2,
7),y_=Math.pow(2,14),w_=Math.pow(2,21),Lb=Math.pow(2,28),Rb=Math.pow(2,35),Nb=Math.pow(2,42),Fb=Math.pow(2,49),ze=128,sn=127;
function Wh(n){if(n<b_)return 1;if(n<y_)return 2;if(n<w_)return 3;if(n<Lb)return 4;if(n<Rb)return 5;if(n<Nb)return 6;if(n<
Fb)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");
return 8}function v_(n,e,t=0){switch(Wh(n)){case 8:e[t++]=n&255|ze,n/=128;case 7:e[t++]=n&255|ze,n/=128;case 6:e[t++]=n&
255|ze,n/=128;case 5:e[t++]=n&255|ze,n/=128;case 4:e[t++]=n&255|ze,n>>>=7;case 3:e[t++]=n&255|ze,n>>>=7;case 2:e[t++]=n&
255|ze,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function S_(n,e){let t=n[e],
r=0;if(r+=t&sn,t<ze||(t=n[e+1],r+=(t&sn)<<7,t<ze)||(t=n[e+2],r+=(t&sn)<<14,t<ze)||(t=n[e+3],r+=(t&sn)<<21,t<ze)||(t=n[e+
4],r+=(t&sn)*Lb,t<ze)||(t=n[e+5],r+=(t&sn)*Rb,t<ze)||(t=n[e+6],r+=(t&sn)*Nb,t<ze)||(t=n[e+7],r+=(t&sn)*Fb,t<ze))return r;
throw new RangeError("Could not decode varint")}const Kh=new Float32Array([-0]),Sn=new Uint8Array(Kh.buffer);function A_(n,e,t){
Kh[0]=n,e[t]=Sn[0],e[t+1]=Sn[1],e[t+2]=Sn[2],e[t+3]=Sn[3]}function E_(n,e){return Sn[0]=n[e],Sn[1]=n[e+1],Sn[2]=n[e+2],Sn[3]=
n[e+3],Kh[0]}const Gh=new Float64Array([-0]),Ce=new Uint8Array(Gh.buffer);function __(n,e,t){Gh[0]=n,e[t]=Ce[0],e[t+1]=Ce[1],
e[t+2]=Ce[2],e[t+3]=Ce[3],e[t+4]=Ce[4],e[t+5]=Ce[5],e[t+6]=Ce[6],e[t+7]=Ce[7]}function x_(n,e){return Ce[0]=n[e],Ce[1]=n[e+
1],Ce[2]=n[e+2],Ce[3]=n[e+3],Ce[4]=n[e+4],Ce[5]=n[e+5],Ce[6]=n[e+6],Ce[7]=n[e+7],Gh[0]}const C_=BigInt(Number.MAX_SAFE_INTEGER),
I_=BigInt(Number.MIN_SAFE_INTEGER);let Vt=class Bn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&
this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.
hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+
1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;
return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===
0n)return rr;if(e<C_&&e>I_)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>vf&&(s=0n,++r>vf&&(r=0n))),new Bn(Number(s),Number(r))}static fromNumber(e){if(e===0)return rr;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new Bn(r,s)}static from(e){return typeof e=="number"?Bn.fromNumber(e):typeof e=="bigint"?Bn.fromBigInt(e):typeof e=="str\
ing"?Bn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Bn(e.low>>>0,e.high>>>0):rr}};const rr=new Vt(0,0);rr.toBigInt=
function(){return 0n};rr.zzEncode=rr.zzDecode=function(){return this};rr.length=function(){return 1};const vf=4294967296n;
function T_(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function D_(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Ub(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function mt(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function go(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let P_=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Rn(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,mt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw mt(this,4);return go(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw mt(
this,4);return go(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw mt(this,4);const e=E_(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw mt(this,4);const e=x_(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw mt(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return D_(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw mt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw mt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Vt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw mt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw mt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw mt(this,8);const e=go(this.buf,this.pos+=4),t=go(this.buf,this.pos+=4);return new Vt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=S_(this.buf,this.pos);
return this.pos+=Wh(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function Ob(n){return new P_(n instanceof Uint8Array?
n:n.subarray())}function Bb(n,e,t){const r=Ob(n);return e.decode(r,void 0,t)}function M_(n){let r,s=8192;return function(o){
if(o<1||o>4096)return br(o);s+o>8192&&(r=br(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let js=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function Yc(){}let $_=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const k_=M_();function L_(n){return globalThis.Buffer!=null?
br(n):k_(n)}let xu=class{len;head;tail;states;constructor(){this.len=0,this.head=new js(Yc,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new js(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new N_((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
mo,10,Vt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Vt.fromBigInt(e);
return this._push(mo,t.length(),t)}uint64Number(e){return this._push(v_,Wh(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Vt.fromBigInt(e).zzEncode();return this._push(mo,t.length(),t)}sint64Number(e){const t=Vt.fromNumber(e).zzEncode();
return this._push(mo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Jc,1,e?1:0)}fixed32(e){
return this._push($s,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Vt.fromBigInt(e);return this._push($s,
4,t.lo)._push($s,4,t.hi)}fixed64Number(e){const t=Vt.fromNumber(e);return this._push($s,4,t.lo)._push($s,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(A_,4,e)}double(e){return this._push(__,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Jc,1,0):this.uint32(t)._push(F_,t,e)}string(e){const t=T_(e);return t!==0?this.uint32(t)._push(
Ub,t,e):this._push(Jc,1,0)}fork(){return this.states=new $_(this),this.head=this.tail=new js(Yc,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new js(Yc,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=L_(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function Jc(n,e,t){e[t]=n&255}function R_(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let N_=class extends js{next;constructor(e,t){super(R_,e,t),this.next=void 0}};
function mo(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function $s(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function F_(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(xu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(U_,e,n),this},xu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(O_,e,n),this});function U_(n,e,t){e.set(n,t)}function O_(n,e,t){n.length<40?Ub(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(Nn(n),t)}function B_(){return new xu}function zb(n,e){const t=B_();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*Vb(n,e,t){const r=Ob(n);yield*e.stream(r,void 0,".",t)}const qb={VARINT:0,LENGTH_DELIMITED:2};function Wb(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function z_(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Wb("enum",qb.VARINT,t,r,s)}function Kb(n,e,t){return Wb("message",qb.LENGTH_DELIMITED,n,e,
t)}var Le;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Le||(Le={}));var Cu;(function(n){
n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(Cu||(Cu={}));(function(n){
n.codec=()=>z_(Cu)})(Le||(Le={}));var Ti;(function(n){let e;n.codec=()=>(e==null&&(e=Kb((i,o,a={})=>{a.lengthDelimited!==
!1&&o.fork(),i.Type!=null&&(o.uint32(8),Le.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Le.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Le.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return zb(i,n.codec())}n.encode=t;function r(i,o){return Bb(i,n.codec(),o)}n.decode=r;function s(i,o){return Vb(i,n.codec(),
o)}n.stream=s})(Ti||(Ti={}));var Sf;(function(n){let e;n.codec=()=>(e==null&&(e=Kb((i,o,a={})=>{a.lengthDelimited!==!1&&
o.fork(),i.Type!=null&&(o.uint32(8),Le.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Le.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Le.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return zb(i,n.codec())}n.encode=t;function r(i,o){return Bb(i,n.codec(),o)}n.decode=r;function s(i,o){return Vb(i,n.codec(),
o)}n.stream=s})(Sf||(Sf={}));let V_=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){
return this._raw==null&&(this._raw=j_(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return vc.createV1(
114,this._multihash)}toString(){return ot.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:Tr(this.raw,e.raw)}verify(e,t,r){return Q_(this.jwk,t,e,r)}};const q_=18,W_=1062,K_=Uint8Array.from([48,13,
6,9,42,134,72,134,247,13,1,1,1,5,0]);function G_(n){const e=Sc(n[1],{offset:0});return{kty:"RSA",n:at(e[0],"base64url"),
e:at(e[1],"base64url")}}function j_(n){if(n.n==null||n.e==null)throw new P("JWK was missing components");return ri([K_,Pb(
ri([Eu(Nn(n.n,"base64url")),Eu(Nn(n.e,"base64url"))]))]).subarray()}function H_(n,e){if(n.byteLength>=W_)throw new It("K\
ey size is too large");const t=Sc(n,{offset:0});return X_(t,n,e)}function X_(n,e,t){const r=G_(n);if(t==null){const s=tr(
Ti.encode({Type:Le.RSA,Data:e}));t=wc(q_,s)}return new V_(r,t)}async function Q_(n,e,t,r){const s=await yr.get().subtle.
importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await yr.
get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Rn(e),Rn(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),
i}function Y_(n,e,t,r){const s=BE.digest(t instanceof Uint8Array?t:t.subarray());if(Vh(s))return s.then(({digest:i})=>(r?.
signal?.throwIfAborted(),Ue.verify(e,i,n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new wf(String(
i))});try{return r?.signal?.throwIfAborted(),Ue.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new wf(String(
i))}}let J_=class{type="secp256k1";raw;_key;constructor(e){this._key=tx(e),this.raw=ex(this._key)}toMultihash(){return Oh.
digest(jh(this))}toCID(){return vc.createV1(114,this.toMultihash())}toString(){return ot.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Tr(this.raw,e.raw)}verify(e,t,r){return Y_(this.
_key,t,e,r)}};function Z_(n){return new J_(n)}function ex(n){return Ue.Point.fromBytes(n).toBytes()}function tx(n){try{return Ue.
Point.fromBytes(n),n}catch(e){throw new It(String(e))}}async function nx(n,e){return m_()}function rx(n,e){const{Type:t,
Data:r}=Ti.decode(n),s=r??new Uint8Array;switch(t){case Le.RSA:return H_(s,e);case Le.Ed25519:return g_(s);case Le.secp256k1:
return Z_(s);case Le.ECDSA:return t_(s);default:throw new lc}}function jh(n){return Ti.encode({Type:Le[n.type],Data:n.raw})}
async function sx(n,e,t){if(t?.signal?.throwIfAborted(),e!=null){let r;try{r=e instanceof Uint8Array?rx(e):e}catch(s){throw new It(
`Could not decode public key - ${s.message}`)}if(!Tr(r.toMultihash().bytes,n.toMultihash().bytes))throw new It("Public k\
ey does not match peer id");return r}if(n.publicKey==null)throw new It("No public key available for peer id");return n.publicKey}
async function ix(n){if(n.connectionProtector===null&&globalThis.process?.env?.LIBP2P_FORCE_PNET!=null)throw new P("Priv\
ate network is enforced, but no protector was provided");return n}function Gb(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Ta(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Ta(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function ox(n){
return n?.buffer instanceof ArrayBuffer}function Ta(n){return ox(n)?n:n.slice()}function ax(n,e,t){if(n.length>=255)throw new TypeError(
"Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(
i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(
256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,
d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>
0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>
0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=
n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError("Expected String");if(d.length===0)return new Uint8Array;
var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.
charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;
if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(
E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(d);if(m)return m;throw new Error(`Non-${e} character`)}
return{encode:A,decodeUnsafe:y,decode:I}}var cx=ax,lx=cx;let ux=class{name;prefix;baseEncode;constructor(e,t,r){this.name=
e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},hx=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return jb(this,e)}},
dx=class{decoders;constructor(e){this.decoders=e}or(e){return jb(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function jb(n,e){return new dx({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let fx=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new ux(e,t,r),this.decoder=new hx(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function px({name:n,prefix:e,encode:t,decode:r}){return new fx(n,e,t,
r)}function Hb({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=lx(t,n,r);return px({prefix:e,
name:n,encode:s,decode:o=>Gb(i(o))})}const gx=Hb({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXY\
Zabcdefghijkmnopqrstuvwxyz"});Hb({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKL\
MNPQRSTUVWXYZ"});var mx=Xb,Af=128,bx=-128,yx=Math.pow(2,31);function Xb(n,e,t){e=e||[],t=t||0;for(var r=t;n>=yx;)e[t++]=
n&255|Af,n/=128;for(;n&bx;)e[t++]=n&255|Af,n>>>=7;return e[t]=n|0,Xb.bytes=t-r+1,e}var wx=Iu,vx=128,Ef=127;function Iu(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw Iu.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&Ef)<<s:(o&Ef)*Math.pow(2,s),s+=7}while(o>=vx);return Iu.bytes=i-r,t}var Sx=Math.pow(2,7),Ax=Math.pow(2,14),Ex=Math.
pow(2,21),_x=Math.pow(2,28),xx=Math.pow(2,35),Cx=Math.pow(2,42),Ix=Math.pow(2,49),Tx=Math.pow(2,56),Dx=Math.pow(2,63),Px=function(n){
return n<Sx?1:n<Ax?2:n<Ex?3:n<_x?4:n<xx?5:n<Cx?6:n<Ix?7:n<Tx?8:n<Dx?9:10},Mx={encode:mx,decode:wx,encodingLength:Px},_f=Mx;
function xf(n,e=0){const t=_f.decode(n,e),r=_f.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function $x(n){const e=Gb(n),[
t,r]=xf(e),[s,i]=xf(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new kx(
t,s,o,e)}let kx=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=Ta(r),this.bytes=Ta(
s)}};function si(n,e){const t={[Symbol.iterator]:()=>t,next:()=>{const r=n.next(),s=r.value;return r.done===!0||s==null?
{done:!0,value:void 0}:{done:!1,value:e(s)}}};return t}function Zc(n){const e=$x(gx.decode(`z${n}`));return xr(e)}class Dr{map;constructor(e){
if(this.map=new Map,e!=null)for(const[t,r]of e.entries())this.map.set(t.toString(),{key:t,value:r})}[Symbol.iterator](){
return this.entries()}clear(){this.map.clear()}delete(e){return this.map.delete(e.toString())}entries(){return si(this.map.
entries(),e=>[e[1].key,e[1].value])}forEach(e){this.map.forEach((t,r)=>{e(t.value,t.key,this)})}get(e){return this.map.get(
e.toString())?.value}has(e){return this.map.has(e.toString())}set(e,t){this.map.set(e.toString(),{key:e,value:t})}keys(){
return si(this.map.values(),e=>e.key)}values(){return si(this.map.values(),e=>e.value)}get size(){return this.map.size}}
class sr{set;constructor(e){if(this.set=new Set,e!=null)for(const t of e)this.set.add(t.toString())}get size(){return this.
set.size}[Symbol.iterator](){return this.values()}add(e){this.set.add(e.toString())}clear(){this.set.clear()}delete(e){this.
set.delete(e.toString())}entries(){return si(this.set.entries(),e=>{const t=Zc(e[0]);return[t,t]})}forEach(e){this.set.forEach(
t=>{const r=Zc(t);e(r,r,this)})}has(e){return this.set.has(e.toString())}values(){return si(this.set.values(),e=>Zc(e))}intersection(e){
const t=new sr;for(const r of e)this.has(r)&&t.add(r);return t}difference(e){const t=new sr;for(const r of this)e.has(r)||
t.add(r);return t}union(e){const t=new sr;for(const r of e)t.add(r);for(const r of this)t.add(r);return t}}class Lx{filter;constructor(e,t){
this.filter=Si(e,t)}has(e){return this.filter.has(e.toMultihash().bytes)}add(e){this.filter.add(e.toMultihash().bytes)}remove(e){
this.filter.remove?.(e.toMultihash().bytes)}}function Rx(n,e=.001){return new Lx(n,e)}class Nx extends Dr{metric;constructor(e){
super();const{name:t,metrics:r}=e;this.metric=r.registerMetric(t),this.updateComponentMetric()}set(e,t){return super.set(
e,t),this.updateComponentMetric(),this}delete(e){const t=super.delete(e);return this.updateComponentMetric(),t}clear(){super.
clear(),this.updateComponentMetric()}updateComponentMetric(){this.metric.update(this.size)}}function Fx(n){const{name:e,
metrics:t}=n;let r;return t!=null?r=new Nx({name:e,metrics:t}):r=new Dr,r}function Ts(n,e){if(n===e)return!0;if(n.byteLength!==
e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Ux(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function ys(n){if(n instanceof
Uint8Array&&n.constructor.name==="Uint8Array")return Di(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.
isView(n))return Di(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function Ox(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Cf=4096;
function Bx(n){const e=n.length;if(e<=Cf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.
apply(String,n.subarray(r,r+=Cf));return t}function zx(n){return n?.buffer instanceof ArrayBuffer}function Di(n){return zx(
n)?n:n.slice()}function Vx(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),
s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof
Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.
from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,
w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==
0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-
E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError(
"Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var qx=Vx,Wx=qx;let Kx=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Gx=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Qb(this,e)}},
jx=class{decoders;constructor(e){this.decoders=e}or(e){return Qb(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Qb(n,e){return new jx({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let Hx=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new Kx(e,t,r),this.decoder=new Gx(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Ac({name:n,prefix:e,encode:t,decode:r}){return new Hx(n,e,t,
r)}function Yi({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=Wx(t,n,r);return Ac({prefix:e,
name:n,encode:s,decode:o=>ys(i(o))})}function Xx(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Qx(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function Yx(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ge({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=Yx(r,s);return Ac(
{prefix:e,name:n,encode(o){return Qx(o,r,t)},decode(o){return Xx(o,i,t,n)}})}const ct=Yi({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Jx=Yi({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Zx=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ct,
base58flickr:Jx},Symbol.toStringTag,{value:"Module"})),ii=ge({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),eC=ge({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),tC=ge({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),nC=ge({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),rC=ge({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),sC=ge({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
iC=ge({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),oC=ge(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),aC=ge(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),cC=Object.freeze(Object.defineProperty(
{__proto__:null,base32:ii,base32hex:rC,base32hexpad:iC,base32hexpadupper:oC,base32hexupper:sC,base32pad:tC,base32padupper:nC,
base32upper:eC,base32z:aC},Symbol.toStringTag,{value:"Module"})),sa=Yi({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),lC=Yi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),uC=Object.freeze(Object.defineProperty({__proto__:null,base36:sa,base36upper:lC},Symbol.
toStringTag,{value:"Module"}));var hC=Yb,If=128,dC=-128,fC=Math.pow(2,31);function Yb(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
fC;)e[t++]=n&255|If,n/=128;for(;n&dC;)e[t++]=n&255|If,n>>>=7;return e[t]=n|0,Yb.bytes=t-r+1,e}var pC=Tu,gC=128,Tf=127;function Tu(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw Tu.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&Tf)<<s:(o&Tf)*Math.pow(2,s),s+=7}while(o>=gC);return Tu.bytes=i-r,t}var mC=Math.pow(2,7),bC=Math.pow(2,14),yC=Math.
pow(2,21),wC=Math.pow(2,28),vC=Math.pow(2,35),SC=Math.pow(2,42),AC=Math.pow(2,49),EC=Math.pow(2,56),_C=Math.pow(2,63),xC=function(n){
return n<mC?1:n<bC?2:n<yC?3:n<wC?4:n<vC?5:n<SC?6:n<AC?7:n<EC?8:n<_C?9:10},CC={encode:hC,decode:pC,encodingLength:xC},Da=CC;
function Du(n,e=0){const t=Da.decode(n,e),r=Da.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function Pa(n,e,t=0){return Da.
encode(n,e,t),e}function Ma(n){return Da.encodingLength(n)}function Ec(n,e){const t=e.byteLength,r=Ma(n),s=r+Ma(t),i=new Uint8Array(
s+t);return Pa(n,i,0),Pa(t,i,r),i.set(e,s),new Hh(n,t,e,i)}function Jb(n){const e=ys(n),[t,r]=Du(e),[s,i]=Du(e.subarray(
r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new Hh(t,s,o,e)}function IC(n,e){if(n===
e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&Ux(n.bytes,t.bytes)}}let Hh=class{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Di(r),this.bytes=Di(s)}};function Df(n,e){const{bytes:t,version:r}=n;switch(r){case 0:
return DC(t,Pu(n),e??ct.encoder);default:return PC(t,Pu(n),e??ii.encoder)}}const Pf=new WeakMap;function Pu(n){const e=Pf.
get(n);if(e==null){const t=new Map;return Pf.set(n,t),t}return e}let _c=class _e{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Di(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==ks)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==MC)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return _e.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=Ec(e,t);return _e.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return _e.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&IC(e.multihash,r.multihash)}toString(e){return Df(this,e)}toJSON(){return{
"/":Df(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof _e)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new _e(r,s,i,o??Mf(r,s,i.bytes))}else if(t[$C]===!0){const{
version:r,multihash:s,code:i}=t,o=Jb(s);return _e.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==ks)throw new Error(`Version 0 CID must use dag-pb (code: ${ks}) block encoding`);return new _e(
e,t,r,r.bytes)}case 1:{const s=Mf(e,t,r.bytes);return new _e(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return _e.create(0,ks,e)}static createV1(e,t){return _e.create(1,e,t)}static decode(e){const[t,r]=_e.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=_e.inspectBytes(e),r=t.size-t.multihashSize,
s=ys(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Hh(t.multihashCode,t.digestSize,i,s);return[t.version===0?_e.createV0(o):_e.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,f]=Du(e.subarray(t));return t+=f,h};let s=r(),
i=ks;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=TC(e,t),
i=_e.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Pu(
i).set(r,e),i}};function TC(n,e){switch(n[0]){case"Q":{const t=e??ct;return[ct.prefix,t.decode(`${ct.prefix}${n}`)]}case ct.
prefix:{const t=e??ct;return[ct.prefix,t.decode(n)]}case ii.prefix:{const t=e??ii;return[ii.prefix,t.decode(n)]}case sa.
prefix:{const t=e??sa;return[sa.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function DC(n,e,t){const{prefix:r}=t;if(r!==
ct.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function PC(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const ks=112,MC=18;function Mf(n,e,t){const r=Ma(n),s=r+Ma(e),i=new Uint8Array(s+t.
byteLength);return Pa(n,i,0),Pa(e,i,r),i.set(t,s),i}const $C=Symbol.for("@ipld/js-cid/CID"),Zb=0,kC="identity",ey=ys;function LC(n,e){
if(e?.truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Ec(Zb,ey(n))}const Xh={code:Zb,
name:kC,encode:ey,digest:LC};function RC(n){return n.buffer instanceof ArrayBuffer}function wr(n){return RC(n)?n:n.slice()}
async function NC(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,wr(e),wr(
t.subarray()));return r?.signal?.throwIfAborted(),i}function et(n=0){return new Uint8Array(n)}function Fn(n=0){return new Uint8Array(
n)}function FC(n){return n?.buffer instanceof ArrayBuffer}function UC(n){if(FC(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function $f(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=Fn(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return UC(t)}const ty=Symbol.for("@achingbrain/uint8arraylist");function kf(n,e){if(e==null||e<0)
throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-
t};t=s}throw new RangeError("index is out of bounds")}function bo(n){return!!n?.[ty]}let Nt=class ia{bufs;length;[ty]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(bo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(bo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=kf(this.bufs,e);return t.buf[t.index]}set(e,t){const r=kf(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(bo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return $f(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:$f(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ia;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!bo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=Fn(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=et(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=et(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=et(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=Fn(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=et(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=et(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=et(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=et(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=et(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ia)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!Ts(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ia;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const OC=Yi({prefix:"9",name:"\
base10",alphabet:"0123456789"}),BC=Object.freeze(Object.defineProperty({__proto__:null,base10:OC},Symbol.toStringTag,{value:"\
Module"})),zC=ge({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),VC=ge({prefix:"\
F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),qC=Object.freeze(Object.defineProperty(
{__proto__:null,base16:zC,base16upper:VC},Symbol.toStringTag,{value:"Module"})),WC=ge({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),KC=Object.freeze(Object.defineProperty({__proto__:null,base2:WC},Symbol.toStringTag,{value:"Module"})),
ny=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),GC=ny.reduce((n,e,t)=>(n[t]=e,n),[]),jC=ny.reduce((n,e,t)=>{const r=e.codePointAt(
0);if(r==null)throw new Error(`Invalid character: ${e}`);return n[r]=t,n},[]);function HC(n){return n.reduce((e,t)=>(e+=
GC[t],e),"")}function XC(n){const e=[];for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=jC[r];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const QC=Ac({prefix:"🚀",name:"base256emoji",encode:HC,decode:XC}),YC=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:QC},Symbol.toStringTag,{value:"Module"})),JC=ge({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),ZC=ge({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOP\
QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),eI=ge({prefix:"u",name:"base64url",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),tI=ge({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),nI=Object.freeze(Object.defineProperty(
{__proto__:null,base64:JC,base64pad:ZC,base64url:eI,base64urlpad:tI},Symbol.toStringTag,{value:"Module"})),rI=ge({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),sI=Object.freeze(Object.defineProperty({__proto__:null,base8:rI},Symbol.
toStringTag,{value:"Module"})),iI=Ac({prefix:"\0",name:"identity",encode:n=>Bx(ys(n)),decode:n=>ys(Ox(n))}),oI=Object.freeze(
Object.defineProperty({__proto__:null,identity:iI},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const aI=20;function cI({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new lI(n,e,t,r,s)}let lI=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??aI,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
Lf(r,this.code,t?.truncate):r.then(s=>Lf(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Lf(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return Ec(e,n)}function uI(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const hI=cI({name:"sha2-256",code:18,encode:uI("SHA-256")}),Rf={...oI,...KC,...sI,...BC,...qC,...cC,
...uC,...Zx,...nI,...YC};function ry(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const Nf=ry("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),el=ry("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Fn(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),sy={utf8:Nf,"utf-8":Nf,hex:Rf.base16,latin1:el,ascii:el,
binary:el,...Rf};function ws(n,e="utf8"){const t=sy[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function mn(n,e="utf8"){const t=sy[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const dI=parseInt("11111",2),Mu=parseInt("10000000",2),fI=parseInt("01\
111111",2),Ff={0:Ls,1:Ls,2:pI,3:bI,4:yI,5:mI,6:gI,16:Ls,22:Ls,48:Ls};function xc(n,e={offset:0}){const t=n[e.offset]&dI;
if(e.offset++,Ff[t]!=null)return Ff[t](n,e);throw new Error("No decoder for tag "+t)}function Ji(n,e){let t=0;if((n[e.offset]&
Mu)===Mu){const r=n[e.offset]&fI;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)throw new Error(
"invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}function Ls(n,e){
Ji(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=xc(n,e);if(r===null)break;t.push(r)}return t}function pI(n,e){
const t=Ji(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.offset+=t,Uint8Array.
from(i)}function gI(n,e){const t=Ji(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function mI(n,e){return e.offset++,null}function bI(n,e){
const t=Ji(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=t,r!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function yI(n,e){const t=Ji(n,e),r=n.subarray(e.offset,e.offset+t);
return e.offset+=t,r}function wI(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new Nt;for(let r=0;r<e.length;r+=
2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function Qh(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=wI(n.byteLength);return new Nt(Uint8Array.from([e.byteLength|Mu]),e)}function $u(n){const e=new Nt,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new Nt(Uint8Array.from([2]),Qh(e),e)}function iy(n){
const e=Uint8Array.from([0]),t=new Nt(e,n);return new Nt(Uint8Array.from([3]),Qh(t),t)}function oi(n,e=48){const t=new Nt;
for(const r of n)t.append(r);return new Nt(Uint8Array.from([e]),Qh(t),t)}const vI=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),SI=Uint8Array.from([6,5,43,129,4,0,34]),AI=Uint8Array.from([6,5,43,129,4,0,35]),EI={ext:!0,kty:"EC",crv:"P-256"},
_I={ext:!0,kty:"EC",crv:"P-384"},xI={ext:!0,kty:"EC",crv:"P-521"},tl=32,nl=48,rl=66;function CI(n){const e=xc(n);return II(
e)}function II(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===tl*2+1)return r=mn(e.subarray(t,t+tl),"base64url"),s=
mn(e.subarray(t+tl),"base64url"),new sl({...EI,key_ops:["verify"],x:r,y:s});if(e.byteLength===nl*2+1)return r=mn(e.subarray(
t,t+nl),"base64url"),s=mn(e.subarray(t+nl),"base64url"),new sl({..._I,key_ops:["verify"],x:r,y:s});if(e.byteLength===rl*
2+1)return r=mn(e.subarray(t,t+rl),"base64url"),s=mn(e.subarray(t+rl),"base64url"),new sl({...xI,key_ops:["verify"],x:r,
y:s});throw new P(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function TI(n){return oi(
[$u(Uint8Array.from([1])),oi([DI(n.crv)],160),oi([iy(new Nt(Uint8Array.from([4]),ws(n.x??"","base64url"),ws(n.y??"","bas\
e64url")))],161)]).subarray()}function DI(n){if(n==="P-256")return vI;if(n==="P-384")return SI;if(n==="P-521")return AI;
throw new P(`Invalid curve ${n}`)}let sl=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=TI(this.jwk)),this._raw}toMultihash(){return Xh.digest(Cc(this))}toCID(){return _c.createV1(114,this.toMultihash())}toString(){
return ct.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ts(this.
raw,e.raw)}async verify(e,t,r){return NC(this.jwk,t,e,r)}},Uf=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},PI=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const Pi={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new PI(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},oy=32;let il;const MI=(async()=>{try{return await Pi.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function $I(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await Pi.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await Pi.get().subtle.verify(
{name:"Ed25519"},r,wr(e),wr(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function kI(n,e,t){return gr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function LI(n,e,t){
return il==null&&(il=await MI),il?$I(n,e,t):kI(n,e,t)}function ay(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}let RI=class{type="Ed25519";raw;constructor(e){this.raw=cy(e,oy)}toMultihash(){
return Xh.digest(Cc(this))}toCID(){return _c.createV1(114,this.toMultihash())}toString(){return ct.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ts(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=LI(this.raw,t,e);return ay(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}};function NI(n){return n=
cy(n,oy),new RI(n)}function cy(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new P(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}const FI=Math.pow(2,7),UI=Math.pow(2,14),OI=Math.pow(2,21),ly=Math.pow(2,28),uy=Math.
pow(2,35),hy=Math.pow(2,42),dy=Math.pow(2,49),ae=128,on=127;function Zi(n){if(n<FI)return 1;if(n<UI)return 2;if(n<OI)return 3;
if(n<ly)return 4;if(n<uy)return 5;if(n<hy)return 6;if(n<dy)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function fy(n,e,t=0){switch(Zi(n)){case 8:e[t++]=n&255|ae,n/=128;case 7:
e[t++]=n&255|ae,n/=128;case 6:e[t++]=n&255|ae,n/=128;case 5:e[t++]=n&255|ae,n/=128;case 4:e[t++]=n&255|ae,n>>>=7;case 3:
e[t++]=n&255|ae,n>>>=7;case 2:e[t++]=n&255|ae,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function BI(n,e,t=0){switch(Zi(n)){case 8:e.set(t++,n&255|ae),n/=128;case 7:e.set(t++,n&255|ae),n/=128;case 6:
e.set(t++,n&255|ae),n/=128;case 5:e.set(t++,n&255|ae),n/=128;case 4:e.set(t++,n&255|ae),n>>>=7;case 3:e.set(t++,n&255|ae),
n>>>=7;case 2:e.set(t++,n&255|ae),n>>>=7;case 1:{e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}
function zI(n,e){let t=n[e],r=0;if(r+=t&on,t<ae||(t=n[e+1],r+=(t&on)<<7,t<ae)||(t=n[e+2],r+=(t&on)<<14,t<ae)||(t=n[e+3],
r+=(t&on)<<21,t<ae)||(t=n[e+4],r+=(t&on)*ly,t<ae)||(t=n[e+5],r+=(t&on)*uy,t<ae)||(t=n[e+6],r+=(t&on)*hy,t<ae)||(t=n[e+7],
r+=(t&on)*dy,t<ae))return r;throw new RangeError("Could not decode varint")}function ol(n,e,t=0){return e==null&&(e=Fn(Zi(
n))),e instanceof Uint8Array?fy(n,e,t):BI(n,e,t)}const Yh=new Float32Array([-0]),An=new Uint8Array(Yh.buffer);function VI(n,e,t){
Yh[0]=n,e[t]=An[0],e[t+1]=An[1],e[t+2]=An[2],e[t+3]=An[3]}function qI(n,e){return An[0]=n[e],An[1]=n[e+1],An[2]=n[e+2],An[3]=
n[e+3],Yh[0]}const Jh=new Float64Array([-0]),Ie=new Uint8Array(Jh.buffer);function WI(n,e,t){Jh[0]=n,e[t]=Ie[0],e[t+1]=Ie[1],
e[t+2]=Ie[2],e[t+3]=Ie[3],e[t+4]=Ie[4],e[t+5]=Ie[5],e[t+6]=Ie[6],e[t+7]=Ie[7]}function KI(n,e){return Ie[0]=n[e],Ie[1]=n[e+
1],Ie[2]=n[e+2],Ie[3]=n[e+3],Ie[4]=n[e+4],Ie[5]=n[e+5],Ie[6]=n[e+6],Ie[7]=n[e+7],Jh[0]}const GI=BigInt(Number.MAX_SAFE_INTEGER),
jI=BigInt(Number.MIN_SAFE_INTEGER);let qt=class zn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&
this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.
hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+
1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;
return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===
0n)return ir;if(e<GI&&e>jI)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>Of&&(s=0n,++r>Of&&(r=0n))),new zn(Number(s),Number(r))}static fromNumber(e){if(e===0)return ir;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new zn(r,s)}static from(e){return typeof e=="number"?zn.fromNumber(e):typeof e=="bigint"?zn.fromBigInt(e):typeof e=="str\
ing"?zn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new zn(e.low>>>0,e.high>>>0):ir}};const ir=new qt(0,0);ir.toBigInt=
function(){return 0n};ir.zzEncode=ir.zzDecode=function(){return this};ir.length=function(){return 1};const Of=4294967296n;
function HI(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function XI(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function py(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function bt(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function yo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let QI=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=wr(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,bt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw bt(this,4);return yo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw bt(
this,4);return yo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw bt(this,4);const e=qI(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw bt(this,4);const e=KI(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw bt(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return XI(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw bt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw bt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new qt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw bt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw bt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw bt(this,8);const e=yo(this.buf,this.pos+=4),t=yo(this.buf,this.pos+=4);return new qt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=zI(this.buf,this.pos);
return this.pos+=Zi(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function gy(n){return new QI(n instanceof Uint8Array?
n:n.subarray())}function Mi(n,e,t){const r=gy(n);return e.decode(r,void 0,t)}function YI(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Fn(o);s+o>8192&&(r=Fn(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Hs=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function al(){}let JI=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const ZI=YI();function eT(n){return globalThis.Buffer!=null?
Fn(n):ZI(n)}let ku=class{len;head;tail;states;constructor(){this.len=0,this.head=new Hs(al,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Hs(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new nT((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
wo,10,qt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=qt.fromBigInt(e);
return this._push(wo,t.length(),t)}uint64Number(e){return this._push(fy,Zi(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=qt.fromBigInt(e).zzEncode();return this._push(wo,t.length(),t)}sint64Number(e){const t=qt.fromNumber(e).zzEncode();
return this._push(wo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(cl,1,e?1:0)}fixed32(e){
return this._push(Rs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=qt.fromBigInt(e);return this._push(Rs,
4,t.lo)._push(Rs,4,t.hi)}fixed64Number(e){const t=qt.fromNumber(e);return this._push(Rs,4,t.lo)._push(Rs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(VI,4,e)}double(e){return this._push(WI,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(cl,1,0):this.uint32(t)._push(rT,t,e)}string(e){const t=HI(e);return t!==0?this.uint32(t)._push(
py,t,e):this._push(cl,1,0)}fork(){return this.states=new JI(this),this.head=this.tail=new Hs(al,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Hs(al,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=eT(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function cl(n,e,t){e[t]=n&255}function tT(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let nT=class extends Hs{next;constructor(e,t){super(tT,e,t),this.next=void 0}};
function wo(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Rs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function rT(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(ku.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(sT,e,n),this},ku.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(iT,e,n),this});function sT(n,e,t){e.set(n,t)}function iT(n,e,t){n.length<40?py(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(ws(n),t)}function oT(){return new ku}function $i(n,e){const t=oT();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*ki(n,e,t){const r=gy(n);yield*e.stream(r,void 0,".",t)}const my={VARINT:0,LENGTH_DELIMITED:2};function by(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function aT(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return by("enum",my.VARINT,t,r,s)}function Li(n,e,t){return by("message",my.LENGTH_DELIMITED,n,e,
t)}let Bf=class extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"};var Re;(function(n){n.RSA="RSA",n.Ed25519="Ed\
25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Re||(Re={}));var Lu;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed255\
19",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(Lu||(Lu={}));(function(n){n.codec=()=>aT(Lu)})(Re||(Re={}));var Ri;
(function(n){let e;n.codec=()=>(e==null&&(e=Li((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),
Re.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{
const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Re.codec().decode(i);break}case 2:{
c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Re.codec().decode(i)};break}case 2:{yield{
field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return $i(i,n.codec())}n.
encode=t;function r(i,o){return Mi(i,n.codec(),o)}n.decode=r;function s(i,o){return ki(i,n.codec(),o)}n.stream=s})(Ri||(Ri=
{}));var zf;(function(n){let e;n.codec=()=>(e==null&&(e=Li((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.
uint32(8),Re.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Re.codec().
decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Re.codec().decode(
i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return $i(
i,n.codec())}n.encode=t;function r(i,o){return Mi(i,n.codec(),o)}n.decode=r;function s(i,o){return ki(i,n.codec(),o)}n.stream=
s})(zf||(zf={}));let cT=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this.
_raw==null&&(this._raw=fT(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return _c.createV1(114,this.
_multihash)}toString(){return ct.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:Ts(this.raw,e.raw)}verify(e,t,r){return mT(this.jwk,t,e,r)}};const lT=18,uT=1062,hT=Uint8Array.from([48,13,
6,9,42,134,72,134,247,13,1,1,1,5,0]);function dT(n){const e=xc(n[1],{offset:0});return{kty:"RSA",n:mn(e[0],"base64url"),
e:mn(e[1],"base64url")}}function fT(n){if(n.n==null||n.e==null)throw new P("JWK was missing components");return oi([hT,iy(
oi([$u(ws(n.n,"base64url")),$u(ws(n.e,"base64url"))]))]).subarray()}function pT(n,e){if(n.byteLength>=uT)throw new It("K\
ey size is too large");const t=xc(n,{offset:0});return gT(t,n,e)}function gT(n,e,t){const r=dT(n);if(t==null){const s=tr(
Ri.encode({Type:Re.RSA,Data:e}));t=Ec(lT,s)}return new cT(r,t)}async function mT(n,e,t,r){const s=await Pi.get().subtle.
importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await Pi.
get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,wr(e),wr(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),
i}function bT(n,e,t,r){const s=hI.digest(t instanceof Uint8Array?t:t.subarray());if(ay(s))return s.then(({digest:i})=>(r?.
signal?.throwIfAborted(),Ue.verify(e,i,n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new Uf(String(
i))});try{return r?.signal?.throwIfAborted(),Ue.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new Uf(String(
i))}}let yT=class{type="secp256k1";raw;_key;constructor(e){this._key=ST(e),this.raw=vT(this._key)}toMultihash(){return Xh.
digest(Cc(this))}toCID(){return _c.createV1(114,this.toMultihash())}toString(){return ct.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:Ts(this.raw,e.raw)}verify(e,t,r){return bT(this.
_key,t,e,r)}};function wT(n){return new yT(n)}function vT(n){return Ue.Point.fromBytes(n).toBytes()}function ST(n){try{return Ue.
Point.fromBytes(n),n}catch(e){throw new It(String(e))}}function AT(n,e){const{Type:t,Data:r}=Ri.decode(n),s=r??new Uint8Array;
switch(t){case Re.RSA:return pT(s,e);case Re.Ed25519:return NI(s);case Re.secp256k1:return wT(s);case Re.ECDSA:return CI(
s);default:throw new lc}}function Cc(n){return Ri.encode({Type:Re[n.type],Data:n.raw})}var $a;(function(n){let e;n.codec=
()=>(e==null&&(e=Li((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.publicKey!=null&&i.publicKey.byteLength>0&&(o.uint32(
10),o.bytes(i.publicKey)),i.payloadType!=null&&i.payloadType.byteLength>0&&(o.uint32(18),o.bytes(i.payloadType)),i.payload!=
null&&i.payload.byteLength>0&&(o.uint32(26),o.bytes(i.payload)),i.signature!=null&&i.signature.byteLength>0&&(o.uint32(42),
o.bytes(i.signature)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={publicKey:et(0),payloadType:et(0),payload:et(
0),signature:et(0)},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.publicKey=i.bytes();
break}case 2:{c.payloadType=i.bytes();break}case 3:{c.payload=i.bytes();break}case 5:{c.signature=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{yield{field:`${a}.payloadType`,value:i.
bytes()};break}case 3:{yield{field:`${a}.payload`,value:i.bytes()};break}case 5:{yield{field:`${a}.signature`,value:i.bytes()};
break}default:{i.skipType(u&7);break}}}})),e);function t(i){return $i(i,n.codec())}n.encode=t;function r(i,o){return Mi(
i,n.codec(),o)}n.decode=r;function s(i,o){return ki(i,n.codec(),o)}n.stream=s})($a||($a={}));class ET extends Error{constructor(e="\
Invalid signature"){super(e),this.name="InvalidSignatureError"}}class Ht{static createFromProtobuf=e=>{const t=$a.decode(
e),r=AT(t.publicKey);return new Ht({publicKey:r,payloadType:t.payloadType,payload:t.payload,signature:t.signature})};static seal=async(e,t,r)=>{
if(t==null)throw new Error("Missing private key");const s=e.domain,i=e.codec,o=e.marshal(),a=Vf(s,i,o),c=await t.sign(a.
subarray(),r);return new Ht({publicKey:t.publicKey,payloadType:i,payload:o,signature:c})};static openAndCertify=async(e,t,r)=>{
const s=Ht.createFromProtobuf(e);if(!await s.validate(t,r))throw new ET("Envelope signature is not valid for the given d\
omain");return s};publicKey;payloadType;payload;signature;marshaled;constructor(e){const{publicKey:t,payloadType:r,payload:s,
signature:i}=e;this.publicKey=t,this.payloadType=r,this.payload=s,this.signature=i}marshal(){return this.marshaled==null&&
(this.marshaled=$a.encode({publicKey:Cc(this.publicKey),payloadType:this.payloadType,payload:this.payload.subarray(),signature:this.
signature})),this.marshaled}equals(e){return e==null?!1:Ts(this.marshal(),e.marshal())}async validate(e,t){const r=Vf(e,
this.payloadType,this.payload);return this.publicKey.verify(r.subarray(),this.signature,t)}}const Vf=(n,e,t)=>{const r=ws(
n),s=ol(r.byteLength),i=ol(e.length),o=ol(t.length);return new Nt(s,r,i,e,o,t)},_T="libp2p-peer-record",xT=Uint8Array.from(
[3,1]);var ka;(function(n){(function(i){let o;i.codec=()=>(o==null&&(o=Li((u,h,f={})=>{f.lengthDelimited!==!1&&h.fork(),
u.multiaddr!=null&&u.multiaddr.byteLength>0&&(h.uint32(10),h.bytes(u.multiaddr)),f.lengthDelimited!==!1&&h.ldelim()},(u,h,f={})=>{
const p={multiaddr:et(0)},A=h==null?u.len:u.pos+h;for(;u.pos<A;){const y=u.uint32();switch(y>>>3){case 1:{p.multiaddr=u.
bytes();break}default:{u.skipType(y&7);break}}}return p},function*(u,h,f,p={}){const A=h==null?u.len:u.pos+h;for(;u.pos<
A;){const y=u.uint32();switch(y>>>3){case 1:{yield{field:`${f}.multiaddr`,value:u.bytes()};break}default:{u.skipType(y&7);
break}}}})),o);function a(u){return $i(u,i.codec())}i.encode=a;function c(u,h){return Mi(u,i.codec(),h)}i.decode=c;function l(u,h){
return ki(u,i.codec(),h)}i.stream=l})(n.AddressInfo||(n.AddressInfo={}));let e;n.codec=()=>(e==null&&(e=Li((i,o,a={})=>{
if(a.lengthDelimited!==!1&&o.fork(),i.peerId!=null&&i.peerId.byteLength>0&&(o.uint32(10),o.bytes(i.peerId)),i.seq!=null&&
i.seq!==0n&&(o.uint32(16),o.uint64(i.seq)),i.addresses!=null&&i.addresses.length>0)for(const c of i.addresses)o.uint32(26),
n.AddressInfo.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={peerId:et(0),seq:0n,addresses:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.peerId=i.bytes();break}case 2:{c.seq=i.
uint64();break}case 3:{if(a.limits?.addresses!=null&&c.addresses.length===a.limits.addresses)throw new Bf('Decode error \
- repeated field "addresses" had too many elements');c.addresses.push(n.AddressInfo.codec().decode(i,i.uint32(),{limits:a.
limits?.addresses$}));break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addresses:0},u=o==
null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.peerId`,value:i.bytes()};break}case 2:{
yield{field:`${a}.seq`,value:i.uint64()};break}case 3:{if(c.limits?.addresses!=null&&l.addresses===c.limits.addresses)throw new Bf(
'Streaming decode error - repeated field "addresses" had too many elements');for(const f of n.AddressInfo.codec().stream(
i,i.uint32(),`${a}.addresses[]`,{limits:c.limits?.addresses$}))yield{...f,index:l.addresses};l.addresses++;break}default:{
i.skipType(h&7);break}}}})),e);function t(i){return $i(i,n.codec())}n.encode=t;function r(i,o){return Mi(i,n.codec(),o)}
n.decode=r;function s(i,o){return ki(i,n.codec(),o)}n.stream=s})(ka||(ka={}));function CT(n,e){const t=(r,s)=>r.toString().
localeCompare(s.toString());return n.length!==e.length?!1:(e.sort(t),n.sort(t).every((r,s)=>e[s].equals(r)))}class pt{static createFromProtobuf=e=>{
const t=ka.decode(e),r=xr(Jb(t.peerId)),s=(t.addresses??[]).map(o=>k(o.multiaddr)),i=t.seq;return new pt({peerId:r,multiaddrs:s,
seqNumber:i})};static DOMAIN=_T;static CODEC=xT;peerId;multiaddrs;seqNumber;domain=pt.DOMAIN;codec=pt.CODEC;marshaled;constructor(e){
const{peerId:t,multiaddrs:r,seqNumber:s}=e;this.peerId=t,this.multiaddrs=r??[],this.seqNumber=s??BigInt(Date.now())}marshal(){
return this.marshaled==null&&(this.marshaled=ka.encode({peerId:this.peerId.toMultihash().bytes,seq:BigInt(this.seqNumber),
addresses:this.multiaddrs.map(e=>({multiaddr:e.bytes}))})),this.marshaled}equals(e){return!(!(e instanceof pt)||!this.peerId.
equals(e.peerId)||this.seqNumber!==e.seqNumber||!CT(this.multiaddrs,e.multiaddrs))}}let vs=class extends Error{static name="\
AbortError";name="AbortError";constructor(e="The operation was aborted",...t){super(e,...t)}};async function ll(n,e,t,r){
const s=new vs(r?.errorMessage);r?.errorCode!=null&&(s.code=r.errorCode);const i=r?.errorEvent??"error";return t?.aborted===
!0?Promise.reject(s):new Promise((o,a)=>{function c(){hl(t,"abort",h),hl(n,e,l),hl(n,i,u)}const l=f=>{try{if(r?.filter?.(
f)===!1)return}catch(p){c(),a(p);return}c(),o(f)},u=f=>{if(c(),f instanceof Error){a(f);return}a(f.detail??r?.error??new Error(
`The "${r?.errorEvent}" event was emitted but the event had no '.detail' field. Pass an 'error' option to race-event to \
change this message.`))},h=()=>{c(),a(s)};ul(t,"abort",h),ul(n,e,l),ul(n,i,u)})}function ul(n,e,t){n!=null&&(yy(n)?n.addEventListener(
e,t):n.addListener(e,t))}function hl(n,e,t){n!=null&&(yy(n)?n.removeEventListener(e,t):n.removeListener(e,t))}function yy(n){
return typeof n.addEventListener=="function"&&typeof n.removeEventListener=="function"}class IT extends Error{static name="\
QueueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class TT{deferred;signal;constructor(e){
this.signal=e,this.deferred=Promise.withResolvers(),this.onAbort=this.onAbort.bind(this),this.signal?.addEventListener("\
abort",this.onAbort)}onAbort(){this.deferred.reject(this.signal?.reason??new vs)}cleanup(){this.signal?.removeEventListener(
"abort",this.onAbort)}}function DT(){return`${parseInt(String(Math.random()*1e9),10).toString()}${Date.now()}`}class PT{id;fn;options;recipients;status;timeline;controller;constructor(e,t){
this.id=DT(),this.status="queued",this.fn=e,this.options=t,this.recipients=[],this.timeline={created:Date.now()},this.controller=
new AbortController,this.controller.signal,this.onAbort=this.onAbort.bind(this)}abort(e){this.controller.abort(e)}onAbort(){
this.recipients.reduce((t,r)=>t&&r.signal?.aborted===!0,!0)&&(this.controller.abort(new vs),this.cleanup())}async join(e={}){
const t=new TT(e.signal);return this.recipients.push(t),e.signal?.addEventListener("abort",this.onAbort),t.deferred.promise}async run(){
this.status="running",this.timeline.started=Date.now();try{this.controller.signal.throwIfAborted();const e=await Dt(this.
fn({...this.options??{},signal:this.controller.signal}),this.controller.signal);this.recipients.forEach(t=>{t.deferred.resolve(
e)}),this.status="complete"}catch(e){this.recipients.forEach(t=>{t.deferred.reject(e)}),this.status="errored"}finally{this.
timeline.finished=Date.now(),this.cleanup()}}cleanup(){this.recipients.forEach(e=>{e.cleanup(),e.signal?.removeEventListener(
"abort",this.onAbort)})}}function qf(n,e){let t;const r=function(){const s=function(){t=void 0,n()};clearTimeout(t),t=setTimeout(
s,e)};return r.start=()=>{},r.stop=()=>{clearTimeout(t)},r}class Wf extends ue{concurrency;maxSize;queue;pending;sort;autoStart;constructor(e={}){
super(),this.concurrency=e.concurrency??Number.POSITIVE_INFINITY,this.maxSize=e.maxSize??Number.POSITIVE_INFINITY,this.pending=
0,this.autoStart=e.autoStart??!0,this.sort=e.sort,this.queue=[],this.emitEmpty=qf(this.emitEmpty.bind(this),1),this.emitIdle=
qf(this.emitIdle.bind(this),1)}[Symbol.asyncIterator](){return this.toGenerator()}emitEmpty(){this.size===0&&this.safeDispatchEvent(
"empty")}emitIdle(){this.running===0&&this.safeDispatchEvent("idle")}tryToStartAnother(){if(this.size===0)return this.emitEmpty(),
this.running===0&&this.emitIdle(),!1;if(this.pending<this.concurrency){let e;for(const t of this.queue)if(t.status==="qu\
eued"){e=t;break}return e==null?!1:(this.safeDispatchEvent("active"),this.pending++,e.run().finally(()=>{for(let t=0;t<this.
queue.length;t++)if(this.queue[t]===e){this.queue.splice(t,1);break}this.pending--,this.safeDispatchEvent("next"),this.autoStart&&
this.tryToStartAnother()}),!0)}return!1}enqueue(e){this.queue.push(e),this.sort!=null&&this.queue.sort(this.sort)}start(){
this.autoStart===!1&&(this.autoStart=!0,this.tryToStartAnother())}pause(){this.autoStart=!1}async add(e,t){if(t?.signal?.
throwIfAborted(),this.size===this.maxSize)throw new IT;const r=new PT(e,t);return this.enqueue(r),this.safeDispatchEvent(
"add"),this.autoStart&&this.tryToStartAnother(),r.join(t).then(s=>(this.safeDispatchEvent("success",{detail:{job:r,result:s}}),
s)).catch(s=>{if(r.status==="queued"){for(let i=0;i<this.queue.length;i++)if(this.queue[i]===r){this.queue.splice(i,1);break}}
throw this.safeDispatchEvent("failure",{detail:{job:r,error:s}}),s})}clear(){this.queue.splice(0,this.queue.length)}abort(){
this.queue.forEach(e=>{e.abort(new vs)}),this.clear()}async onEmpty(e){this.size!==0&&await ll(this,"empty",e?.signal)}async onSizeLessThan(e,t){
this.size<e||await ll(this,"next",t?.signal,{filter:()=>this.size<e})}async onIdle(e){this.pending===0&&this.size===0||await ll(
this,"idle",e?.signal)}get size(){return this.queue.length}get queued(){return this.queue.length-this.pending}get running(){
return this.pending}async*toGenerator(e){e?.signal?.throwIfAborted();const t=ls({objectMode:!0}),r=c=>{c!=null?this.abort():
this.clear(),t.end(c)},s=c=>{c.detail!=null&&t.push(c.detail.result)},i=c=>{r(c.detail.error)},o=()=>{r()},a=()=>{r(new vs(
"Queue aborted"))};this.addEventListener("success",s),this.addEventListener("failure",i),this.addEventListener("idle",o),
e?.signal?.addEventListener("abort",a);try{yield*t}finally{this.removeEventListener("success",s),this.removeEventListener(
"failure",i),this.removeEventListener("idle",o),e?.signal?.removeEventListener("abort",a),r()}}}const wy="lock:worker:re\
quest-read",vy="lock:worker:abort-read-request",Sy="lock:worker:release-read",Ay="lock:master:grant-read",Ey="lock:maste\
r:error-read",_y="lock:worker:request-write",xy="lock:worker:abort-write-request",Cy="lock:worker:release-write",Iy="loc\
k:master:grant-write",Ty="lock:master:error-write",Dy="lock:worker:finalize",Py="mortice",MT={singleProcess:!1},Kf=(n,e,t,r,s,i,o,a,c)=>l=>{
if(l.data==null)return;const u={type:l.data.type,name:l.data.name,identifier:l.data.identifier};u.type===s&&n.safeDispatchEvent(
t,{detail:{name:u.name,identifier:u.identifier,handler:async()=>{e.postMessage({type:c,name:u.name,identifier:u.identifier}),
await new Promise(h=>{const f=p=>{if(p?.data==null)return;const A={type:p.data.type,name:p.data.name,identifier:p.data.identifier};
A.type===a&&A.identifier===u.identifier&&(e.removeEventListener("message",f),h())};e.addEventListener("message",f)})},onError:h=>{
e.postMessage({type:o,name:u.name,identifier:u.identifier,error:{message:h.message,name:h.name,stack:h.stack}})}}}),u.type===
i&&n.safeDispatchEvent(r,{detail:{name:u.name,identifier:u.identifier}}),u.type===Dy&&n.safeDispatchEvent("finalizeReque\
st",{detail:{name:u.name}})},$T=(n=10)=>Math.random().toString().substring(2,n+2);class kT{name;channel;constructor(e){this.
name=e,this.channel=new BroadcastChannel(Py)}readLock(e){return this.sendRequest(wy,vy,Ay,Ey,Sy,e)}writeLock(e){return this.
sendRequest(_y,xy,Iy,Ty,Cy,e)}finalize(){this.channel.postMessage({type:Dy,name:this.name}),this.channel.close()}async sendRequest(e,t,r,s,i,o){
o?.signal?.throwIfAborted();const a=$T();return this.channel.postMessage({type:e,identifier:a,name:this.name}),new Promise(
(c,l)=>{const u=()=>{this.channel.postMessage({type:t,identifier:a,name:this.name})};o?.signal?.addEventListener("abort",
u,{once:!0});const h=f=>{if(f.data?.identifier===a&&(f.data?.type===r&&(this.channel.removeEventListener("message",h),o?.
signal?.removeEventListener("abort",u),c(()=>{this.channel.postMessage({type:i,identifier:a,name:this.name})})),f.data.type===
s)){this.channel.removeEventListener("message",h),o?.signal?.removeEventListener("abort",u);const p=new Error;f.data.error!=
null&&(p.message=f.data.error.message,p.name=f.data.error.name,p.stack=f.data.error.stack),l(p)}};this.channel.addEventListener(
"message",h)})}}const LT=n=>{if(n=Object.assign({},MT,n),!!globalThis.document||n.singleProcess){const t=new BroadcastChannel(
Py),r=new ue;return t.addEventListener("message",Kf(r,t,"requestReadLock","abortReadLockRequest",wy,vy,Ey,Sy,Ay)),t.addEventListener(
"message",Kf(r,t,"requestWriteLock","abortWriteLockRequest",_y,xy,Ty,Cy,Iy)),r}return new kT(n.name)},Qn=new Map;let Ns;
function My(n){return typeof n?.readLock=="function"&&typeof n?.writeLock=="function"}function RT(n){if(Ns==null&&(Ns=LT(
n),!My(Ns))){const e=Ns;e.addEventListener("requestReadLock",t=>{const r=t.detail.name,s=t.detail.identifier,i=Qn.get(r);
if(i==null)return;const o=new AbortController,a=c=>{c.detail.name!==r||c.detail.identifier!==s||o.abort()};e.addEventListener(
"abortReadLockRequest",a),i.readLock({signal:o.signal}).then(async c=>{await t.detail.handler().finally(()=>{c()})}).catch(
c=>{t.detail.onError(c)}).finally(()=>{e.removeEventListener("abortReadLockRequest",a)})}),e.addEventListener("requestWr\
iteLock",t=>{const r=t.detail.name,s=t.detail.identifier,i=Qn.get(r);if(i==null)return;const o=new AbortController,a=c=>{
c.detail.name!==r||c.detail.identifier!==s||o.abort()};e.addEventListener("abortWriteLockRequest",a),i.writeLock({signal:o.
signal}).then(async c=>{await t.detail.handler().finally(()=>{c()})}).catch(c=>{t.detail.onError(c)}).finally(()=>{e.removeEventListener(
"abortWriteLockRequest",a)})}),e.addEventListener("finalizeRequest",t=>{const r=t.detail.name,s=Qn.get(r);s?.finalize()})}
return Ns}async function dl(n,e){let t,r;const s=new Promise((o,a)=>{t=o,r=a}),i=()=>{r(new vs)};return e?.signal?.addEventListener(
"abort",i,{once:!0}),n.add(async()=>{await new Promise(o=>{t(()=>{e?.signal?.removeEventListener("abort",i),o()})})},{signal:e?.
signal}).catch(o=>{r(o)}),s}const NT=(n,e)=>{let t=Qn.get(n);if(t!=null)return t;const r=RT(e);if(My(r))return t=r,Qn.set(
n,t),t;const s=new Wf({concurrency:1});let i;return t={async readLock(o){if(i!=null)return dl(i,o);i=new Wf({concurrency:e.
concurrency,autoStart:!1});const a=i,c=dl(i,o);return s.add(async()=>{a.start(),await a.onIdle().then(()=>{i===a&&(i=null)})}),
c},async writeLock(o){return i=null,dl(s,o)},finalize:()=>{Qn.delete(n)},queue:s},Qn.set(n,t),e.autoFinalize===!0&&s.addEventListener(
"idle",()=>{t.finalize()},{once:!0}),t},FT={name:"lock",concurrency:1/0,singleProcess:!1,autoFinalize:!1};function UT(n){
const e=Object.assign({},FT,n);return NT(e.name,e)}function OT(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;
for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Ss(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Ni(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Ni(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function BT(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Gf=4096;function zT(n){const e=n.
length;if(e<=Gf)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=Gf));return t}function VT(n){return n?.buffer instanceof ArrayBuffer}function Ni(n){return VT(n)?n:n.slice()}
function qT(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof Uint8Array||
(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===
0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=
256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;
for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError("Expect\
ed String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var WT=qT,KT=WT;let GT=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},jT=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return $y(this,e)}},
HT=class{decoders;constructor(e){this.decoders=e}or(e){return $y(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function $y(n,e){return new HT({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let XT=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new GT(e,t,r),this.decoder=new jT(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Ic({name:n,prefix:e,encode:t,decode:r}){return new XT(n,e,t,
r)}function eo({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=KT(t,n,r);return Ic({prefix:e,
name:n,encode:s,decode:o=>Ss(i(o))})}function QT(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function YT(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function JT(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function me({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=JT(r,s);return Ic(
{prefix:e,name:n,encode(o){return YT(o,r,t)},decode(o){return QT(o,i,t,n)}})}const rs=me({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),ZT=me({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),eD=me({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),tD=me({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),nD=me({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),rD=me({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),sD=me({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),iD=me({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),oD=me({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),aD=Object.freeze(Object.defineProperty({__proto__:null,base32:rs,base32hex:nD,base32hexpad:sD,
base32hexpadupper:iD,base32hexupper:rD,base32pad:eD,base32padupper:tD,base32upper:ZT,base32z:oD},Symbol.toStringTag,{value:"\
Module"})),oa=eo({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),cD=eo({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),lD=Object.freeze(Object.defineProperty(
{__proto__:null,base36:oa,base36upper:cD},Symbol.toStringTag,{value:"Module"})),lt=eo({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),uD=eo({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),hD=Object.freeze(Object.defineProperty({__proto__:null,base58btc:lt,
base58flickr:uD},Symbol.toStringTag,{value:"Module"}));var dD=ky,jf=128,fD=-128,pD=Math.pow(2,31);function ky(n,e,t){e=e||
[],t=t||0;for(var r=t;n>=pD;)e[t++]=n&255|jf,n/=128;for(;n&fD;)e[t++]=n&255|jf,n>>>=7;return e[t]=n|0,ky.bytes=t-r+1,e}var gD=Ru,
mD=128,Hf=127;function Ru(n,r){var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw Ru.bytes=0,new RangeError("Could not\
 decode varint");o=n[i++],t+=s<28?(o&Hf)<<s:(o&Hf)*Math.pow(2,s),s+=7}while(o>=mD);return Ru.bytes=i-r,t}var bD=Math.pow(
2,7),yD=Math.pow(2,14),wD=Math.pow(2,21),vD=Math.pow(2,28),SD=Math.pow(2,35),AD=Math.pow(2,42),ED=Math.pow(2,49),_D=Math.
pow(2,56),xD=Math.pow(2,63),CD=function(n){return n<bD?1:n<yD?2:n<wD?3:n<vD?4:n<SD?5:n<AD?6:n<ED?7:n<_D?8:n<xD?9:10},ID={
encode:dD,decode:gD,encodingLength:CD},La=ID;function Nu(n,e=0){const t=La.decode(n,e),r=La.decode.bytes;if(r>9)throw new RangeError(
"Invalid varint: too long");if(r>1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
r]}function Ra(n,e,t=0){return La.encode(n,e,t),e}function Na(n){return La.encodingLength(n)}function Tc(n,e){const t=e.
byteLength,r=Na(n),s=r+Na(t),i=new Uint8Array(s+t);return Ra(n,i,0),Ra(t,i,r),i.set(e,s),new Zh(n,t,e,i)}function TD(n){
const e=Ss(n),[t,r]=Nu(e),[s,i]=Nu(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Zh(t,s,o,e)}function DD(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof
Uint8Array&&OT(n.bytes,t.bytes)}}let Zh=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=
Ni(r),this.bytes=Ni(s)}};function Xf(n,e){const{bytes:t,version:r}=n;switch(r){case 0:return MD(t,Fu(n),e??lt.encoder);default:
return $D(t,Fu(n),e??rs.encoder)}}const Qf=new WeakMap;function Fu(n){const e=Qf.get(n);if(e==null){const t=new Map;return Qf.
set(n,t),t}return e}let to=class xe{code;version;multihash;bytes;"/";constructor(e,t,r,s){this.code=t,this.version=e,this.
multihash=r,this.bytes=Ni(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Fs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==kD)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return xe.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,r=Tc(e,
t);return xe.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return xe.equals(this,e)}static equals(e,t){const r=t;return r!=null&&
e.code===r.code&&e.version===r.version&&DD(e.multihash,r.multihash)}toString(e){return Xf(this,e)}toJSON(){return{"/":Xf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof xe)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:r,code:s,multihash:i,bytes:o}=t;return new xe(r,s,i,o??Yf(r,s,i.bytes))}else if(t[LD]===!0){const{version:r,
multihash:s,code:i}=t,o=TD(s);return xe.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Fs)throw new Error(`Version 0 CID must use dag-pb (code: ${Fs}) block encoding`);return new xe(e,t,r,r.bytes)}case 1:{
const s=Yf(e,t,r.bytes);return new xe(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){return xe.
create(0,Fs,e)}static createV1(e,t){return xe.create(1,e,t)}static decode(e){const[t,r]=xe.decodeFirst(e);if(r.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=xe.inspectBytes(e),r=t.size-t.multihashSize,
s=Ss(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Zh(t.multihashCode,t.digestSize,i,s);return[t.version===0?xe.createV0(o):xe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,f]=Nu(e.subarray(t));return t+=f,h};let s=r(),
i=Fs;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=PD(e,t),
i=xe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Fu(
i).set(r,e),i}};function PD(n,e){switch(n[0]){case"Q":{const t=e??lt;return[lt.prefix,t.decode(`${lt.prefix}${n}`)]}case lt.
prefix:{const t=e??lt;return[lt.prefix,t.decode(n)]}case rs.prefix:{const t=e??rs;return[rs.prefix,t.decode(n)]}case oa.
prefix:{const t=e??oa;return[oa.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function MD(n,e,t){const{prefix:r}=t;if(r!==
lt.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function $D(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Fs=112,kD=18;function Yf(n,e,t){const r=Na(n),s=r+Na(e),i=new Uint8Array(s+t.
byteLength);return Ra(n,i,0),Ra(e,i,r),i.set(t,s),i}const LD=Symbol.for("@ipld/js-cid/CID"),RD=36e5,ND=216e5;function Mt(n=0){
return new Uint8Array(n)}function vr(n=0){return new Uint8Array(n)}const FD=Math.pow(2,7),UD=Math.pow(2,14),OD=Math.pow(
2,21),Ly=Math.pow(2,28),Ry=Math.pow(2,35),Ny=Math.pow(2,42),Fy=Math.pow(2,49),Ve=128,an=127;function ed(n){if(n<FD)return 1;
if(n<UD)return 2;if(n<OD)return 3;if(n<Ly)return 4;if(n<Ry)return 5;if(n<Ny)return 6;if(n<Fy)return 7;if(Number.MAX_SAFE_INTEGER!=
null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function BD(n,e,t=0){switch(ed(
n)){case 8:e[t++]=n&255|Ve,n/=128;case 7:e[t++]=n&255|Ve,n/=128;case 6:e[t++]=n&255|Ve,n/=128;case 5:e[t++]=n&255|Ve,n/=
128;case 4:e[t++]=n&255|Ve,n>>>=7;case 3:e[t++]=n&255|Ve,n>>>=7;case 2:e[t++]=n&255|Ve,n>>>=7;case 1:{e[t++]=n&255,n>>>=
7;break}default:throw new Error("unreachable")}return e}function zD(n,e){let t=n[e],r=0;if(r+=t&an,t<Ve||(t=n[e+1],r+=(t&
an)<<7,t<Ve)||(t=n[e+2],r+=(t&an)<<14,t<Ve)||(t=n[e+3],r+=(t&an)<<21,t<Ve)||(t=n[e+4],r+=(t&an)*Ly,t<Ve)||(t=n[e+5],r+=(t&
an)*Ry,t<Ve)||(t=n[e+6],r+=(t&an)*Ny,t<Ve)||(t=n[e+7],r+=(t&an)*Fy,t<Ve))return r;throw new RangeError("Could not decode\
 varint")}function VD(n){return n.buffer instanceof ArrayBuffer}function Sr(n){return VD(n)?n:n.slice()}const td=new Float32Array(
[-0]),En=new Uint8Array(td.buffer);function qD(n,e,t){td[0]=n,e[t]=En[0],e[t+1]=En[1],e[t+2]=En[2],e[t+3]=En[3]}function WD(n,e){
return En[0]=n[e],En[1]=n[e+1],En[2]=n[e+2],En[3]=n[e+3],td[0]}const nd=new Float64Array([-0]),Te=new Uint8Array(nd.buffer);
function KD(n,e,t){nd[0]=n,e[t]=Te[0],e[t+1]=Te[1],e[t+2]=Te[2],e[t+3]=Te[3],e[t+4]=Te[4],e[t+5]=Te[5],e[t+6]=Te[6],e[t+
7]=Te[7]}function GD(n,e){return Te[0]=n[e],Te[1]=n[e+1],Te[2]=n[e+2],Te[3]=n[e+3],Te[4]=n[e+4],Te[5]=n[e+5],Te[6]=n[e+6],
Te[7]=n[e+7],nd[0]}const jD=BigInt(Number.MAX_SAFE_INTEGER),HD=BigInt(Number.MIN_SAFE_INTEGER);let Wt=class Vn{lo;hi;constructor(e,t){
this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=
r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:r<128?9:10}static fromBigInt(e){if(e===0n)return or;if(e<jD&&e>HD)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>Jf&&(s=0n,++r>Jf&&(r=0n))),new Vn(Number(s),Number(r))}static fromNumber(e){
if(e===0)return or;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&
(r=0,++s>4294967295&&(s=0))),new Vn(r,s)}static from(e){return typeof e=="number"?Vn.fromNumber(e):typeof e=="bigint"?Vn.
fromBigInt(e):typeof e=="string"?Vn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Vn(e.low>>>0,e.high>>>0):or}};const or=new Wt(
0,0);or.toBigInt=function(){return 0n};or.zzEncode=or.zzDecode=function(){return this};or.length=function(){return 1};const Jf=4294967296n;
function XD(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function QD(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Uy(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function yt(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function vo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let YD=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Sr(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,yt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw yt(this,4);return vo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw yt(
this,4);return vo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw yt(this,4);const e=WD(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw yt(this,4);const e=GD(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw yt(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return QD(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw yt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw yt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Wt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw yt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw yt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw yt(this,8);const e=vo(this.buf,this.pos+=4),t=vo(this.buf,this.pos+=4);return new Wt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=zD(this.buf,this.pos);
return this.pos+=ed(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function Oy(n){return new YD(n instanceof Uint8Array?
n:n.subarray())}function ar(n,e,t){const r=Oy(n);return e.decode(r,void 0,t)}const JD=eo({prefix:"9",name:"base10",alphabet:"\
0123456789"}),ZD=Object.freeze(Object.defineProperty({__proto__:null,base10:JD},Symbol.toStringTag,{value:"Module"})),eP=me(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),tP=me({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),nP=Object.freeze(Object.defineProperty({__proto__:null,
base16:eP,base16upper:tP},Symbol.toStringTag,{value:"Module"})),rP=me({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
sP=Object.freeze(Object.defineProperty({__proto__:null,base2:rP},Symbol.toStringTag,{value:"Module"})),By=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),iP=By.reduce((n,e,t)=>(n[t]=e,n),[]),oP=By.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function aP(n){return n.reduce((e,t)=>(e+=iP[t],e),"")}function cP(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=oP[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const lP=Ic({prefix:"🚀",name:"\
base256emoji",encode:aP,decode:cP}),uP=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:lP},Symbol.toStringTag,
{value:"Module"})),hP=me({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),dP=me({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),fP=me({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),pP=me({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),gP=Object.freeze(Object.defineProperty({__proto__:null,base64:hP,base64pad:dP,
base64url:fP,base64urlpad:pP},Symbol.toStringTag,{value:"Module"})),mP=me({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
bP=Object.freeze(Object.defineProperty({__proto__:null,base8:mP},Symbol.toStringTag,{value:"Module"})),yP=Ic({prefix:"\0",
name:"identity",encode:n=>zT(Ss(n)),decode:n=>Ss(BT(n))}),wP=Object.freeze(Object.defineProperty({__proto__:null,identity:yP},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const zy=0,vP="identity",Vy=Ss;function SP(n,e){if(e?.
truncate!=null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid truncate op\
tion, must be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Tc(zy,Vy(n))}const rd={code:zy,name:vP,
encode:Vy,digest:SP},AP=20;function EP({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new _P(n,e,t,
r,s)}let _P=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){this.name=e,this.code=t,this.encode=
r,this.minDigestLength=s??AP,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){if(t.truncate<this.minDigestLength)
throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.maxDigestLength!=
null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or equal to ${this.maxDigestLength}`)}
if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?Zf(r,this.code,t?.truncate):r.then(s=>Zf(
s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};function Zf(n,e,t){if(t!=null&&t!==n.byteLength){
if(t>n.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${n.byteLength}`);n=n.subarray(
0,t)}return Tc(e,n)}function xP(n){return async e=>new Uint8Array(await crypto.subtle.digest(n,e))}const CP=EP({name:"sh\
a2-256",code:18,encode:xP("SHA-256")}),ep={...wP,...sP,...bP,...ZD,...nP,...aD,...lD,...hD,...gP,...uP};function qy(n,e,t,r){
return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const tp=qy("utf8","u",n=>"u"+new TextDecoder(
"utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),fl=qy("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)
e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=vr(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(
t);return e}),Wy={utf8:tp,"utf-8":tp,hex:ep.base16,latin1:fl,ascii:fl,binary:fl,...ep};function Fi(n,e="utf8"){const t=Wy[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function IP(n){let r,
s=8192;return function(o){if(o<1||o>4096)return vr(o);s+o>8192&&(r=vr(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==
0&&(s=(s|7)+1),a}}let Xs=class{fn;len;next;val;constructor(e,t,r){this.fn=e,this.len=t,this.next=void 0,this.val=r}};function pl(){}
let TP=class{head;tail;len;next;constructor(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const DP=IP();
function PP(n){return globalThis.Buffer!=null?vr(n):DP(n)}let Uu=class{len;head;tail;states;constructor(){this.len=0,this.
head=new Xs(pl,0,0),this.tail=this.head,this.states=null}_push(e,t,r){return this.tail=this.tail.next=new Xs(e,t,r),this.
len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new $P((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?
4:5,e)).len,this}int32(e){return e<0?this._push(So,10,Wt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<
1^e>>31)>>>0)}uint64(e){const t=Wt.fromBigInt(e);return this._push(So,t.length(),t)}uint64Number(e){return this._push(BD,
ed(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(
e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Wt.fromBigInt(e).zzEncode();return this._push(So,t.length(),
t)}sint64Number(e){const t=Wt.fromNumber(e).zzEncode();return this._push(So,t.length(),t)}sint64String(e){return this.sint64(
BigInt(e))}bool(e){return this._push(gl,1,e?1:0)}fixed32(e){return this._push(Us,4,e>>>0)}sfixed32(e){return this.fixed32(
e)}fixed64(e){const t=Wt.fromBigInt(e);return this._push(Us,4,t.lo)._push(Us,4,t.hi)}fixed64Number(e){const t=Wt.fromNumber(
e);return this._push(Us,4,t.lo)._push(Us,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.
fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this.
_push(qD,4,e)}double(e){return this._push(KD,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(gl,1,0):this.uint32(
t)._push(kP,t,e)}string(e){const t=XD(e);return t!==0?this.uint32(t)._push(Uy,t,e):this._push(gl,1,0)}fork(){return this.
states=new TP(this),this.head=this.tail=new Xs(pl,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.
states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Xs(
pl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.reset().uint32(r),r!==0&&(this.tail.
next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=PP(this.len);let r=0;for(;e!=null;)e.fn(
e.val,t,r),r+=e.len,e=e.next;return t}};function gl(n,e,t){e[t]=n&255}function MP(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=
7;e[t]=n}let $P=class extends Xs{next;constructor(e,t){super(MP,e,t),this.next=void 0}};function So(n,e,t){for(;n.hi!==0;)
e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}
function Us(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function kP(n,e,t){e.set(n,t)}globalThis.
Buffer!=null&&(Uu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(LP,e,n),this},Uu.
prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(RP,e,n),this});
function LP(n,e,t){e.set(n,t)}function RP(n,e,t){n.length<40?Uy(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(Fi(n),t)}
function NP(){return new Uu}function cr(n,e){const t=NP();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}function*lr(n,e,t){
const r=Oy(n);yield*e.stream(r,void 0,".",t)}const Ky={VARINT:0,LENGTH_DELIMITED:2};function Gy(n,e,t,r,s){return{name:n,
type:e,encode:t,decode:r,stream:s}}function FP(n){function e(i){if(n[i.toString()]==null)throw new Error("Invalid enum v\
alue");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(a)},s=function*(o,a){};
return Gy("enum",Ky.VARINT,t,r,s)}function ur(n,e,t){return Gy("message",Ky.LENGTH_DELIMITED,n,e,t)}let zr=class extends Error{code="\
ERR_MAX_LENGTH";name="MaxLengthError"};class np extends Error{code="ERR_MAX_SIZE";name="MaxSizeError"}var Yn;(function(n){
(function(i){let o;i.codec=()=>(o==null&&(o=ur((u,h,f={})=>{f.lengthDelimited!==!1&&h.fork(),u.key!=null&&u.key!==""&&(h.
uint32(10),h.string(u.key)),u.value!=null&&u.value.byteLength>0&&(h.uint32(18),h.bytes(u.value)),f.lengthDelimited!==!1&&
h.ldelim()},(u,h,f={})=>{const p={key:"",value:Mt(0)},A=h==null?u.len:u.pos+h;for(;u.pos<A;){const y=u.uint32();switch(y>>>
3){case 1:{p.key=u.string();break}case 2:{p.value=u.bytes();break}default:{u.skipType(y&7);break}}}return p},function*(u,h,f,p={}){
const A=h==null?u.len:u.pos+h;for(;u.pos<A;){const y=u.uint32();switch(y>>>3){case 1:{yield{field:`${f}.key`,value:u.string()};
break}case 2:{yield{field:`${f}.value`,value:u.bytes()};break}default:{u.skipType(y&7);break}}}})),o);function a(u){return cr(
u,i.codec())}i.encode=a;function c(u,h){return ar(u,i.codec(),h)}i.decode=c;function l(u,h){return lr(u,i.codec(),h)}i.stream=
l})(n.Peer$metadataEntry||(n.Peer$metadataEntry={})),(function(i){let o;i.codec=()=>(o==null&&(o=ur((u,h,f={})=>{f.lengthDelimited!==
!1&&h.fork(),u.key!=null&&u.key!==""&&(h.uint32(10),h.string(u.key)),u.value!=null&&(h.uint32(18),ci.codec().encode(u.value,
h)),f.lengthDelimited!==!1&&h.ldelim()},(u,h,f={})=>{const p={key:""},A=h==null?u.len:u.pos+h;for(;u.pos<A;){const y=u.uint32();
switch(y>>>3){case 1:{p.key=u.string();break}case 2:{p.value=ci.codec().decode(u,u.uint32(),{limits:f.limits?.value});break}default:{
u.skipType(y&7);break}}}return p},function*(u,h,f,p={}){const A=h==null?u.len:u.pos+h;for(;u.pos<A;){const y=u.uint32();
switch(y>>>3){case 1:{yield{field:`${f}.key`,value:u.string()};break}case 2:{yield*ci.codec().stream(u,u.uint32(),`${f}.\
value`,{limits:p.limits?.value});break}default:{u.skipType(y&7);break}}}})),o);function a(u){return cr(u,i.codec())}i.encode=
a;function c(u,h){return ar(u,i.codec(),h)}i.decode=c;function l(u,h){return lr(u,i.codec(),h)}i.stream=l})(n.Peer$tagsEntry||
(n.Peer$tagsEntry={}));let e;n.codec=()=>(e==null&&(e=ur((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.addresses!=null&&
i.addresses.length>0)for(const c of i.addresses)o.uint32(10),ai.codec().encode(c,o);if(i.protocols!=null&&i.protocols.length>
0)for(const c of i.protocols)o.uint32(18),o.string(c);if(i.publicKey!=null&&(o.uint32(34),o.bytes(i.publicKey)),i.peerRecordEnvelope!=
null&&(o.uint32(42),o.bytes(i.peerRecordEnvelope)),i.metadata!=null&&i.metadata.size>0)for(const[c,l]of i.metadata.entries())
o.uint32(50),n.Peer$metadataEntry.codec().encode({key:c,value:l},o);if(i.tags!=null&&i.tags.size>0)for(const[c,l]of i.tags.
entries())o.uint32(58),n.Peer$tagsEntry.codec().encode({key:c,value:l},o);i.updated!=null&&(o.uint32(64),o.uint64Number(
i.updated)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={addresses:[],protocols:[],metadata:new Map,tags:new Map},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{if(a.limits?.addresses!=null&&c.addresses.
length===a.limits.addresses)throw new zr('Decode error - repeated field "addresses" had too many elements');c.addresses.
push(ai.codec().decode(i,i.uint32(),{limits:a.limits?.addresses$}));break}case 2:{if(a.limits?.protocols!=null&&c.protocols.
length===a.limits.protocols)throw new zr('Decode error - repeated field "protocols" had too many elements');c.protocols.
push(i.string());break}case 4:{c.publicKey=i.bytes();break}case 5:{c.peerRecordEnvelope=i.bytes();break}case 6:{if(a.limits?.
metadata!=null&&c.metadata.size===a.limits.metadata)throw new np('Decode error - map field "metadata" had too many eleme\
nts');const h=n.Peer$metadataEntry.codec().decode(i,i.uint32(),{limits:{value:a.limits?.metadata$value}});c.metadata.set(
h.key,h.value);break}case 7:{if(a.limits?.tags!=null&&c.tags.size===a.limits.tags)throw new np('Decode error - map field\
 "tags" had too many elements');const h=n.Peer$tagsEntry.codec().decode(i,i.uint32(),{limits:{value:a.limits?.tags$value}});
c.tags.set(h.key,h.value);break}case 8:{c.updated=i.uint64Number();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l={addresses:0,protocols:0,metadata:0,tags:0},u=o==null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>
3){case 1:{if(c.limits?.addresses!=null&&l.addresses===c.limits.addresses)throw new zr('Streaming decode error - repeate\
d field "addresses" had too many elements');for(const f of ai.codec().stream(i,i.uint32(),`${a}.addresses[]`,{limits:c.limits?.
addresses$}))yield{...f,index:l.addresses};l.addresses++;break}case 2:{if(c.limits?.protocols!=null&&l.protocols===c.limits.
protocols)throw new zr('Streaming decode error - repeated field "protocols" had too many elements');yield{field:`${a}.pr\
otocols[]`,index:l.protocols,value:i.string()},l.protocols++;break}case 4:{yield{field:`${a}.publicKey`,value:i.bytes()};
break}case 5:{yield{field:`${a}.peerRecordEnvelope`,value:i.bytes()};break}case 6:{if(c.limits?.metadata!=null&&l.metadata===
c.limits.metadata)throw new zr('Decode error - map field "metadata" had too many elements');yield*n.Peer$metadataEntry.codec().
stream(i,i.uint32(),`${a}.metadata{}`,{limits:{value:c.limits?.metadata$value}}),l.metadata++;break}case 7:{if(c.limits?.
tags!=null&&l.tags===c.limits.tags)throw new zr('Decode error - map field "tags" had too many elements');yield*n.Peer$tagsEntry.
codec().stream(i,i.uint32(),`${a}.tags{}`,{limits:{value:c.limits?.tags$value}}),l.tags++;break}case 8:{yield{field:`${a}\
.updated`,value:i.uint64Number()};break}default:{i.skipType(h&7);break}}}})),e);function t(i){return cr(i,n.codec())}n.encode=
t;function r(i,o){return ar(i,n.codec(),o)}n.decode=r;function s(i,o){return lr(i,n.codec(),o)}n.stream=s})(Yn||(Yn={}));
var ai;(function(n){let e;n.codec=()=>(e==null&&(e=ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.multiaddr!=null&&i.
multiaddr.byteLength>0&&(o.uint32(10),o.bytes(i.multiaddr)),i.isCertified!=null&&(o.uint32(16),o.bool(i.isCertified)),i.
observed!=null&&(o.uint32(24),o.uint64Number(i.observed)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={multiaddr:Mt(
0)},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.multiaddr=i.bytes();break}case 2:{
c.isCertified=i.bool();break}case 3:{c.observed=i.uint64Number();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.multiaddr`,value:i.
bytes()};break}case 2:{yield{field:`${a}.isCertified`,value:i.bool()};break}case 3:{yield{field:`${a}.observed`,value:i.
uint64Number()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return cr(i,n.codec())}n.encode=t;function r(i,o){
return ar(i,n.codec(),o)}n.decode=r;function s(i,o){return lr(i,n.codec(),o)}n.stream=s})(ai||(ai={}));var ci;(function(n){
let e;n.codec=()=>(e==null&&(e=ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.value!=null&&i.value!==0&&(o.uint32(8),
o.uint32(i.value)),i.expiry!=null&&(o.uint32(16),o.uint64(i.expiry)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={
value:0},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.value=i.uint32();break}case 2:{
c.expiry=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;
for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.value`,value:i.uint32()};break}case 2:{yield{field:`${a}\
.expiry`,value:i.uint64()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return cr(i,n.codec())}n.encode=t;
function r(i,o){return ar(i,n.codec(),o)}n.decode=r;function s(i,o){return lr(i,n.codec(),o)}n.stream=s})(ci||(ci={}));function nn(n,e){
if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}
async function UP(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["v\
erify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,Sr(e),Sr(
t.subarray()));return r?.signal?.throwIfAborted(),i}function OP(n){return n?.buffer instanceof ArrayBuffer}function BP(n){
if(OP(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function rp(n,e){e==null&&(e=n.reduce(
(s,i)=>s+i.length,0));const t=vr(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return BP(t)}const jy=Symbol.for("@a\
chingbrain/uint8arraylist");function sp(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){
const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Ao(n){
return!!n?.[jy]}let Jt=class aa{bufs;length;[jy]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.appendAll(
e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(Ao(r)){t+=r.byteLength;for(const s of r.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,
this.bufs.unshift(r);else if(Ao(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=sp(this.bufs,e);return t.buf[t.index]}set(e,t){
const r=sp(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,
e[r]);else if(Ao(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{
bufs:r,length:s}=this._subList(e,t);return rp(r,s)}subarray(e,t){const{bufs:r,length:s}=this._subList(e,t);return r.length===
1?r[0]:rp(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new aa;return i.length=s,i.bufs=r,i}_subList(e,t){
if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)throw new RangeError("index \
is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[...this.bufs],length:this.length};
const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===
0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.
push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Ao(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(
t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;
for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;
for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=vr(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=Mt(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=Mt(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=Mt(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=vr(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=Mt(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=Mt(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=Mt(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=Mt(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=Mt(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof aa)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!nn(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new aa;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};function bn(n,e="utf8"){const t=Wy[e];if(t==null)throw new Error(
`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}const zP=parseInt("11111",2),Ou=parseInt("1000000\
0",2),VP=parseInt("01111111",2),ip={0:Os,1:Os,2:qP,3:GP,4:jP,5:KP,6:WP,16:Os,22:Os,48:Os};function Dc(n,e={offset:0}){const t=n[e.
offset]&zP;if(e.offset++,ip[t]!=null)return ip[t](n,e);throw new Error("No decoder for tag "+t)}function no(n,e){let t=0;
if((n[e.offset]&Ou)===Ou){const r=n[e.offset]&VP;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)
throw new Error("invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],
e.offset++;if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}
function Os(n,e){no(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=Dc(n,e);if(r===null)break;t.push(r)}return t}
function qP(n,e){const t=no(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.
offset+=t,Uint8Array.from(i)}function WP(n,e){const t=no(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=
0,o=s):s<80?(i=1,o=s-40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(
l&127),l<128){c.reverse();let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function KP(n,e){return e.
offset++,null}function GP(n,e){const t=no(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=
t,r!==0)throw new Error("Unused bits in bit string is unimplemented");return s}function jP(n,e){const t=no(n,e),r=n.subarray(
e.offset,e.offset+t);return e.offset+=t,r}function HP(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new Jt;for(let r=0;r<
e.length;r+=2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function sd(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=HP(n.byteLength);return new Jt(Uint8Array.from([e.byteLength|Ou]),e)}function Bu(n){const e=new Jt,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new Jt(Uint8Array.from([2]),sd(e),e)}function Hy(n){
const e=Uint8Array.from([0]),t=new Jt(e,n);return new Jt(Uint8Array.from([3]),sd(t),t)}function li(n,e=48){const t=new Jt;
for(const r of n)t.append(r);return new Jt(Uint8Array.from([e]),sd(t),t)}const XP=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),QP=Uint8Array.from([6,5,43,129,4,0,34]),YP=Uint8Array.from([6,5,43,129,4,0,35]),JP={ext:!0,kty:"EC",crv:"P-256"},
ZP={ext:!0,kty:"EC",crv:"P-384"},eM={ext:!0,kty:"EC",crv:"P-521"},ml=32,bl=48,yl=66;function tM(n){const e=Dc(n);return nM(
e)}function nM(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===ml*2+1)return r=bn(e.subarray(t,t+ml),"base64url"),s=
bn(e.subarray(t+ml),"base64url"),new wl({...JP,key_ops:["verify"],x:r,y:s});if(e.byteLength===bl*2+1)return r=bn(e.subarray(
t,t+bl),"base64url"),s=bn(e.subarray(t+bl),"base64url"),new wl({...ZP,key_ops:["verify"],x:r,y:s});if(e.byteLength===yl*
2+1)return r=bn(e.subarray(t,t+yl),"base64url"),s=bn(e.subarray(t+yl),"base64url"),new wl({...eM,key_ops:["verify"],x:r,
y:s});throw new P(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function rM(n){return li(
[Bu(Uint8Array.from([1])),li([sM(n.crv)],160),li([Hy(new Jt(Uint8Array.from([4]),Fi(n.x??"","base64url"),Fi(n.y??"","bas\
e64url")))],161)]).subarray()}function sM(n){if(n==="P-256")return XP;if(n==="P-384")return QP;if(n==="P-521")return YP;
throw new P(`Invalid curve ${n}`)}let wl=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==
null&&(this._raw=rM(this.jwk)),this._raw}toMultihash(){return rd.digest(ss(this))}toCID(){return to.createV1(114,this.toMultihash())}toString(){
return lt.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:nn(this.
raw,e.raw)}async verify(e,t,r){return UP(this.jwk,t,e,r)}},op=class extends Error{constructor(e="An error occurred while\
 verifying a message"){super(e),this.name="VerificationError"}},iM=class extends Error{constructor(e="Missing Web Crypto\
 API"){super(e),this.name="WebCryptoMissingError"}};const Ui={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new iM(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},Xy=32;let vl;const oM=(async()=>{try{return await Ui.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function aM(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await Ui.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await Ui.get().subtle.verify(
{name:"Ed25519"},r,Sr(e),Sr(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function cM(n,e,t){return gr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function lM(n,e,t){
return vl==null&&(vl=await oM),vl?aM(n,e,t):cM(n,e,t)}function Qy(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}let uM=class{type="Ed25519";raw;constructor(e){this.raw=Yy(e,Xy)}toMultihash(){
return rd.digest(ss(this))}toCID(){return to.createV1(114,this.toMultihash())}toString(){return lt.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:nn(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=lM(this.raw,t,e);return Qy(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}};function hM(n){return n=
Yy(n,Xy),new uM(n)}function Yy(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new P(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}var Ne;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA=
"ECDSA"})(Ne||(Ne={}));var zu;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=
3]="ECDSA"})(zu||(zu={}));(function(n){n.codec=()=>FP(zu)})(Ne||(Ne={}));var Oi;(function(n){let e;n.codec=()=>(e==null&&
(e=ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Ne.codec().encode(i.Type,o)),i.Data!=null&&
(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ne.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ne.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.
bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return cr(i,n.codec())}n.encode=t;function r(i,o){return ar(
i,n.codec(),o)}n.decode=r;function s(i,o){return lr(i,n.codec(),o)}n.stream=s})(Oi||(Oi={}));var ap;(function(n){let e;n.
codec=()=>(e==null&&(e=ur((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Ne.codec().encode(i.Type,
o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Ne.codec().decode(i);break}case 2:{c.Data=i.bytes();
break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.
uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Ne.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,
value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return cr(i,n.codec())}n.encode=t;function r(i,o){
return ar(i,n.codec(),o)}n.decode=r;function s(i,o){return lr(i,n.codec(),o)}n.stream=s})(ap||(ap={}));let dM=class{type="\
RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this._raw==null&&(this._raw=bM(this.
jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return to.createV1(114,this._multihash)}toString(){return lt.
encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:nn(this.raw,e.
raw)}verify(e,t,r){return vM(this.jwk,t,e,r)}};const fM=18,pM=1062,gM=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,
1,1,5,0]);function mM(n){const e=Dc(n[1],{offset:0});return{kty:"RSA",n:bn(e[0],"base64url"),e:bn(e[1],"base64url")}}function bM(n){
if(n.n==null||n.e==null)throw new P("JWK was missing components");return li([gM,Hy(li([Bu(Fi(n.n,"base64url")),Bu(Fi(n.e,
"base64url"))]))]).subarray()}function yM(n,e){if(n.byteLength>=pM)throw new It("Key size is too large");const t=Dc(n,{offset:0});
return wM(t,n,e)}function wM(n,e,t){const r=mM(n);if(t==null){const s=tr(Oi.encode({Type:Ne.RSA,Data:e}));t=Tc(fM,s)}return new dM(
r,t)}async function vM(n,e,t,r){const s=await Ui.get().subtle.importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SH\
A-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await Ui.get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Sr(
e),Sr(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),i}function SM(n,e,t,r){const s=CP.digest(
t instanceof Uint8Array?t:t.subarray());if(Qy(s))return s.then(({digest:i})=>(r?.signal?.throwIfAborted(),Ue.verify(e,i,
n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new op(String(i))});try{return r?.signal?.throwIfAborted(),
Ue.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new op(String(i))}}let AM=class{type="secp256k1";raw;_key;constructor(e){
this._key=xM(e),this.raw=_M(this._key)}toMultihash(){return rd.digest(ss(this))}toCID(){return to.createV1(114,this.toMultihash())}toString(){
return lt.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:nn(this.
raw,e.raw)}verify(e,t,r){return SM(this._key,t,e,r)}};function EM(n){return new AM(n)}function _M(n){return Ue.Point.fromBytes(
n).toBytes()}function xM(n){try{return Ue.Point.fromBytes(n),n}catch(e){throw new It(String(e))}}function CM(n,e){const{
Type:t,Data:r}=Oi.decode(n),s=r??new Uint8Array;switch(t){case Ne.RSA:return yM(s,e);case Ne.Ed25519:return hM(s);case Ne.
secp256k1:return EM(s);case Ne.ECDSA:return tM(s);default:throw new lc}}function ss(n){return Oi.encode({Type:Ne[n.type],
Data:n.raw})}function IM(n,e){if(n.publicKey!=null||e.publicKey==null)return n;let t;n.type==="RSA"&&(t=n.toMultihash());
const r=CM(e.publicKey,t);return Lt(r)}function TM(n,e,t){const r=Yn.decode(e);return Qs(n,r,t)}function Qs(n,e,t){const r=new Map,
s=BigInt(Date.now());for(const[i,o]of e.tags.entries())o.expiry!=null&&o.expiry<s||r.set(i,o);return{...e,id:IM(n,e),addresses:e.
addresses.filter(({observed:i})=>i!=null&&i>Date.now()-t).map(({multiaddr:i,isCertified:o})=>({multiaddr:k(i),isCertified:o??
!1})),metadata:e.metadata,peerRecordEnvelope:e.peerRecordEnvelope??void 0,tags:r}}function DM(n,e){return PM(n.addresses,
e.addresses)&&MM(n.protocols,e.protocols)&&$M(n.publicKey,e.publicKey)&&kM(n.peerRecordEnvelope,e.peerRecordEnvelope)&&LM(
n.metadata,e.metadata)&&RM(n.tags,e.tags)}function PM(n,e){return Zy(n,e,(t,r)=>!(t.isCertified!==r.isCertified||!nn(t.multiaddr,
r.multiaddr)))}function MM(n,e){return Zy(n,e,(t,r)=>t===r)}function $M(n,e){return Jy(n,e)}function kM(n,e){return Jy(n,
e)}function LM(n,e){return ew(n,e,(t,r)=>nn(t,r))}function RM(n,e){return ew(n,e,(t,r)=>t.value===r.value&&t.expiry===r.
expiry)}function Jy(n,e){return n==null&&e==null?!0:n!=null&&e!=null?nn(n,e):!1}function Zy(n,e,t){if(n.length!==e.length)
return!1;for(let r=0;r<n.length;r++)if(!t(n[r],e[r]))return!1;return!0}function ew(n,e,t){if(n.size!==e.size)return!1;for(const[
r,s]of n.entries()){const i=e.get(r);if(i==null||!t(s,i))return!1}return!0}const tw="/peers/";function Eo(n){if(!ti(n)||
n.type==null)throw new P("Invalid PeerId");const e=n.toCID().toString();return new ou(`${tw}${e}`)}async function NM(n,e,t,r,s){
const i=new Map;for(const o of t){if(o==null)continue;if(o.multiaddr instanceof Uint8Array&&(o.multiaddr=k(o.multiaddr)),
!Sh(o.multiaddr))throw new P("Multiaddr was invalid");if(!await e(n,o.multiaddr,s))continue;const a=o.isCertified??!1,c=o.
multiaddr.toString(),l=i.get(c);l!=null?o.isCertified=l.isCertified||a:i.set(c,{multiaddr:o.multiaddr,isCertified:a})}return[
...i.values()].sort((o,a)=>o.multiaddr.toString().localeCompare(a.multiaddr.toString())).map(({isCertified:o,multiaddr:a})=>{
const c=a.getComponents().find(l=>l.code===L)?.value;return n.equals(c)&&(a=a.decapsulate(k(`/p2p/${n}`))),{isCertified:o,
multiaddr:a.bytes}})}async function Sl(n,e,t,r){if(e==null)throw new P("Invalid PeerData");if(e.publicKey!=null&&!n.equals(
e.publicKey.toMultihash().bytes))throw new P("publicKey does not match peer id");const s=r.existingPeer?.peer;if(s!=null&&
!n.equals(s.id))throw new P("peer id did not match existing peer id");let i=s?.addresses??[],o=new Set(s?.protocols??[]),
a=s?.metadata??new Map,c=s?.tags??new Map,l=s?.peerRecordEnvelope;if(t==="patch"){if((e.multiaddrs!=null||e.addresses!=null)&&
(i=[],e.multiaddrs!=null&&i.push(...e.multiaddrs.map(f=>({isCertified:!1,multiaddr:f}))),e.addresses!=null&&i.push(...e.
addresses)),e.protocols!=null&&(o=new Set(e.protocols)),e.metadata!=null){const f=e.metadata instanceof Map?[...e.metadata.
entries()]:Object.entries(e.metadata);a=_o(f,{validate:cp})}if(e.tags!=null){const f=e.tags instanceof Map?[...e.tags.entries()]:
Object.entries(e.tags);c=_o(f,{validate:lp,map:up})}e.peerRecordEnvelope!=null&&(l=e.peerRecordEnvelope)}if(t==="merge"){
if(e.multiaddrs!=null&&i.push(...e.multiaddrs.map(f=>({isCertified:!1,multiaddr:f}))),e.addresses!=null&&i.push(...e.addresses),
e.protocols!=null&&(o=new Set([...o,...e.protocols])),e.metadata!=null){const f=e.metadata instanceof Map?[...e.metadata.
entries()]:Object.entries(e.metadata);for(const[p,A]of f)A==null?a.delete(p):a.set(p,A);a=_o([...a.entries()],{validate:cp})}
if(e.tags!=null){const f=e.tags instanceof Map?[...e.tags.entries()]:Object.entries(e.tags),p=new Map(c);for(const[A,y]of f)
y==null?p.delete(A):p.set(A,y);c=_o([...p.entries()],{validate:lp,map:up})}e.peerRecordEnvelope!=null&&(l=e.peerRecordEnvelope)}
let u;s?.id.publicKey!=null?u=ss(s.id.publicKey):e.publicKey!=null?u=ss(e.publicKey):n.publicKey!=null&&(u=ss(n.publicKey));
const h={addresses:await NM(n,r.addressFilter??(async()=>!0),i,r.existingPeer?.peerPB.addresses,r),protocols:[...o.values()].
sort((f,p)=>f.localeCompare(p)),metadata:a,tags:c,publicKey:u,peerRecordEnvelope:l};return h.addresses.forEach(f=>{f.observed=
r.existingPeer?.peerPB.addresses?.find(p=>nn(p.multiaddr,f.multiaddr))?.observed??Date.now()}),n.type!=="RSA"&&delete h.
publicKey,h}function _o(n,e){const t=new Map;for(const[r,s]of n)s!=null&&e.validate(r,s);for(const[r,s]of n.sort(([i],[o])=>i.
localeCompare(o)))s!=null&&t.set(r,e.map?.(r,s)??s);return t}function cp(n,e){if(typeof n!="string")throw new P("Metadat\
a key must be a string");if(!(e instanceof Uint8Array))throw new P("Metadata value must be a Uint8Array")}function lp(n,e){
if(typeof n!="string")throw new P("Tag name must be a string");if(e.value!=null){if(parseInt(`${e.value}`,10)!==e.value)
throw new P("Tag value must be an integer");if(e.value<0||e.value>100)throw new P("Tag value must be between 0-100")}if(e.
ttl!=null){if(parseInt(`${e.ttl}`,10)!==e.ttl)throw new P("Tag ttl must be an integer");if(e.ttl<0)throw new P("Tag ttl \
must be between greater than 0")}}function up(n,e){let t;e.expiry!=null&&(t=e.expiry),e.ttl!=null&&(t=BigInt(Date.now()+
Number(e.ttl)));const r={value:e.value??0};return t!=null&&(r.expiry=t),r}function nw(n){const e=n.toString().split("/")[2],
t=to.parse(e,rs);return Jv(t)}function Al(n,e,t){const r=nw(n);return TM(r,e,t)}function FM(n,e){return{prefix:tw,filters:(n.
filters??[]).map(t=>({key:r,value:s})=>t(Al(r,s,e))),orders:(n.orders??[]).map(t=>(r,s)=>t(Al(r.key,r.value,e),Al(s.key,
s.value,e)))}}class UM{peerId;datastore;locks;addressFilter;log;maxAddressAge;maxPeerAge;constructor(e,t={}){this.log=e.
logger.forComponent("libp2p:peer-store"),this.peerId=e.peerId,this.datastore=e.datastore,this.addressFilter=t.addressFilter,
this.locks=Fx({name:"libp2p_peer_store_locks",metrics:e.metrics}),this.maxAddressAge=t.maxAddressAge??RD,this.maxPeerAge=
t.maxPeerAge??ND}getLock(e){let t=this.locks.get(e);return t==null&&(t={refs:0,lock:UT({name:e.toString(),singleProcess:!0})},
this.locks.set(e,t)),t.refs++,t}maybeRemoveLock(e,t){t.refs--,t.refs===0&&(t.lock.finalize(),this.locks.delete(e))}async getReadLock(e,t){
const r=this.getLock(e);try{const s=await r.lock.readLock(t);return()=>{s(),this.maybeRemoveLock(e,r)}}catch(s){throw this.
maybeRemoveLock(e,r),s}}async getWriteLock(e,t){const r=this.getLock(e);try{const s=await r.lock.writeLock(t);return()=>{
s(),this.maybeRemoveLock(e,r)}}catch(s){throw this.maybeRemoveLock(e,r),s}}async has(e,t){try{return await this.load(e,t),
!0}catch(r){if(r.name!=="NotFoundError")throw r}return!1}async delete(e,t){this.peerId.equals(e)||await this.datastore.delete(
Eo(e),t)}async load(e,t){const r=Eo(e),s=await this.datastore.get(r,t),i=Yn.decode(s);if(this.#n(e,i))throw await this.datastore.
delete(r,t),new au;return Qs(e,i,this.peerId.equals(e)?1/0:this.maxAddressAge)}async save(e,t,r){const s=await this.#e(e,
r),i=await Sl(e,t,"patch",{...r,addressFilter:this.addressFilter});return this.#t(e,i,s)}async patch(e,t,r){const s=await this.#e(
e,r),i=await Sl(e,t,"patch",{...r,addressFilter:this.addressFilter,existingPeer:s});return this.#t(e,i,s)}async merge(e,t,r){
const s=await this.#e(e,r),i=await Sl(e,t,"merge",{addressFilter:this.addressFilter,existingPeer:s});return this.#t(e,i,
s)}async*all(e){for await(const{key:t,value:r}of this.datastore.query(FM(e??{},this.maxAddressAge),e)){const s=nw(t);if(s.
equals(this.peerId))continue;const i=Yn.decode(r);if(this.#n(s,i)){await this.datastore.delete(t,e);continue}yield Qs(s,
i,this.peerId.equals(s)?1/0:this.maxAddressAge)}}async#e(e,t){try{const r=Eo(e),s=await this.datastore.get(r,t),i=Yn.decode(
s);if(this.#n(e,i))throw await this.datastore.delete(r,t),new au;return{peerPB:i,peer:Qs(e,i,this.maxAddressAge)}}catch(r){
r.name!=="NotFoundError"&&this.log.error("invalid peer data found in peer store - %e",r)}}async#t(e,t,r,s){t.updated=Date.
now();const i=Yn.encode(t);return await this.datastore.put(Eo(e),i,s),{peer:Qs(e,t,this.maxAddressAge),previous:r?.peer,
updated:r==null||!DM(t,r.peerPB)}}#n(e,t){if(t.updated==null)return!0;if(this.peerId.equals(e))return!1;const r=t.updated<
Date.now()-this.maxPeerAge,s=Date.now()-this.maxAddressAge,i=t.addresses.filter(o=>o.observed!=null&&o.observed>s);return r&&
i.length===0}}class OM{store;events;peerId;log;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:peer-store"),this.
events=e.events,this.peerId=e.peerId,this.store=new UM(e,t)}[Symbol.toStringTag]="@libp2p/peer-store";async forEach(e,t){
for await(const r of this.store.all(t))e(r)}async all(e){return bu(this.store.all(e))}async delete(e,t){const r=await this.
store.getReadLock(e,t);try{await this.store.delete(e,t)}finally{r()}}async has(e,t){const r=await this.store.getReadLock(
e,t);try{return await this.store.has(e,t)}finally{this.log.trace("has release read lock"),r?.()}}async get(e,t){const r=await this.
store.getReadLock(e,t);try{return await this.store.load(e,t)}finally{r?.()}}async getInfo(e,t){const r=await this.get(e,
t);return{id:r.id,multiaddrs:r.addresses.map(({multiaddr:s})=>s)}}async save(e,t,r){const s=await this.store.getWriteLock(
e,r);try{const i=await this.store.save(e,t,r);return this.#e(e,i),i.peer}finally{s?.()}}async patch(e,t,r){const s=await this.
store.getWriteLock(e,r);try{const i=await this.store.patch(e,t,r);return this.#e(e,i),i.peer}finally{s?.()}}async merge(e,t,r){
const s=await this.store.getWriteLock(e,r);try{const i=await this.store.merge(e,t,r);return this.#e(e,i),i.peer}finally{
s?.()}}async consumePeerRecord(e,t,r){const s=ti(t)?t:ti(t?.expectedPeer)?t.expectedPeer:void 0,i=ti(t)||t===void 0?r:t,
o=await Ht.openAndCertify(e,pt.DOMAIN,i),a=Lt(o.publicKey);if(s?.equals(a)===!1)return this.log("envelope peer id was no\
t the expected peer id - expected: %p received: %p",s,a),!1;const c=pt.createFromProtobuf(o.payload);if(!c.peerId.equals(
a))return this.log("signing key did not match peer id in the peer record - signer: %p record: %p",a,c.peerId),!1;let l;try{
l=await this.get(a,i)}catch(u){if(u.name!=="NotFoundError")throw u}if(l?.peerRecordEnvelope!=null){const u=Ht.createFromProtobuf(
l.peerRecordEnvelope),h=pt.createFromProtobuf(u.payload);if(h.seqNumber>=c.seqNumber)return this.log("sequence number wa\
s lower or equal to existing sequence number - stored: %d received: %d",h.seqNumber,c.seqNumber),!1}return await this.patch(
c.peerId,{peerRecordEnvelope:e,addresses:c.multiaddrs.map(u=>({isCertified:!0,multiaddr:u}))},i),!0}#e(e,t){t.updated&&(this.
peerId.equals(e)?this.events.safeDispatchEvent("self:peer:update",{detail:t}):this.events.safeDispatchEvent("peer:update",
{detail:t}))}}function BM(n,e={}){return new OM(n,e)}function zM(n){return n[Symbol.asyncIterator]!=null}function hp(n){
if(zM(n))return(async()=>{for await(const e of n);})();for(const e of n);}function VM(n){return n[Symbol.asyncIterator]!=
null}function Vr(n,e){let t=0;if(VM(n))return(async function*(){for await(const c of n)await e(c,t++)&&(yield c)})();const r=Zv(
n),{value:s,done:i}=r.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o.then=="function")return(async function*(){
await o&&(yield s);for(const c of r)await e(c,t++)&&(yield c)})();const a=e;return(function*(){o===!0&&(yield s);for(const c of r)
a(c,t++)&&(yield c)})()}function qM(n){return n[Symbol.asyncIterator]!=null}function dp(n,e){return qM(n)?(async function*(){
yield*(await bu(n)).sort(e)})():(function*(){yield*bu(n).sort(e)})()}function WM(n){return n[Symbol.asyncIterator]!=null}
function fp(n,e){return WM(n)?(async function*(){let t=0;if(!(e<1)){for await(const r of n)if(yield r,t++,t===e)return}})():
(function*(){let t=0;if(!(e<1)){for(const r of n)if(yield r,t++,t===e)return}})()}class KM{put(e,t,r){return Promise.reject(
new Error(".put is not implemented"))}get(e,t){return Promise.reject(new Error(".get is not implemented"))}has(e,t){return Promise.
reject(new Error(".has is not implemented"))}delete(e,t){return Promise.reject(new Error(".delete is not implemented"))}async*putMany(e,t={}){
for await(const{key:r,value:s}of e)await this.put(r,s,t),yield r}async*getMany(e,t={}){for await(const r of e)yield{key:r,
value:await this.get(r,t)}}async*deleteMany(e,t={}){for await(const r of e)await this.delete(r,t),yield r}batch(){let e=[],
t=[];return{put(r,s){e.push({key:r,value:s})},delete(r){t.push(r)},commit:async r=>{await hp(this.putMany(e,r)),e=[],await hp(
this.deleteMany(t,r)),t=[]}}}async*_all(e,t){throw new Error("._all is not implemented")}async*_allKeys(e,t){throw new Error(
"._allKeys is not implemented")}query(e,t){let r=this._all(e,t);if(e.prefix!=null){const s=e.prefix;r=Vr(r,i=>i.key.toString().
startsWith(s))}if(Array.isArray(e.filters)&&(r=e.filters.reduce((s,i)=>Vr(s,i),r)),Array.isArray(e.orders)&&(r=e.orders.
reduce((s,i)=>dp(s,i),r)),e.offset!=null){let s=0;const i=e.offset;r=Vr(r,()=>s++>=i)}return e.limit!=null&&(r=fp(r,e.limit)),
r}queryKeys(e,t){let r=this._allKeys(e,t);if(e.prefix!=null){const s=e.prefix;r=Vr(r,i=>i.toString().startsWith(s))}if(Array.
isArray(e.filters)&&(r=e.filters.reduce((s,i)=>Vr(s,i),r)),Array.isArray(e.orders)&&(r=e.orders.reduce((s,i)=>dp(s,i),r)),
e.offset!=null){const s=e.offset;let i=0;r=Vr(r,()=>i++>=s)}return e.limit!=null&&(r=fp(r,e.limit)),r}}class GM extends KM{data;constructor(){
super(),this.data=new Map}put(e,t,r){return r?.signal?.throwIfAborted(),this.data.set(e.toString(),t),e}get(e,t){t?.signal?.
throwIfAborted();const r=this.data.get(e.toString());if(r==null)throw new eS;return r}has(e,t){return t?.signal?.throwIfAborted(),
this.data.has(e.toString())}delete(e,t){t?.signal?.throwIfAborted(),this.data.delete(e.toString())}*_all(e,t){t?.signal?.
throwIfAborted();for(const[r,s]of this.data.entries())yield{key:new ou(r),value:s},t?.signal?.throwIfAborted()}*_allKeys(e,t){
t?.signal?.throwIfAborted();for(const r of this.data.keys())yield new ou(r),t?.signal?.throwIfAborted()}}const pp=864e13;
class jM{log;mappings;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:dns-mappings"),this.mappings=
Qt({name:"libp2p_address_manager_dns_mappings",metrics:e.metrics})}has(e){const t=ee(e);let r=t.host;(t.type==="ip4"||t.
type==="ip6")&&t.sni!=null&&(r=t.sni);for(const s of this.mappings.values())if(s.domain===r)return!0;return!1}add(e,t){t.
forEach(r=>{this.log("add DNS mapping %s to %s",r,e);const s=Dh(r)===!0;this.mappings.set(r,{domain:e,verified:s,expires:s?
pp-Date.now():0,lastVerified:s?pp-Date.now():void 0})})}remove(e){const t=ee(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;
let r=!1;for(const[s,i]of this.mappings.entries())i.domain===t.sni&&(this.log("removing %s to %s DNS mapping %e",s,i.domain),
this.mappings.delete(s),r=r||i.verified);return r}getAll(e){const t=[];for(let r=0;r<e.length;r++){const s=e[r].multiaddr;
if(!gt(s))continue;const i=ee(s);for(const[o,a]of this.mappings.entries()){if(i.host!==o)continue;const c=this.maybeAddSNIComponent(
s,a.domain);c!=null&&(e.splice(r,1),r--,t.push({multiaddr:c,verified:a.verified,type:"dns-mapping",expires:a.expires,lastVerified:a.
lastVerified}))}}return t}maybeAddSNIComponent(e,t){const r=e.getComponents();for(let s=0;s<r.length;s++)if(r[s].code===
ts&&r[s+1]?.code!==iu)return r.splice(s+1,0,{name:"sni",code:iu,value:t}),k(r)}confirm(e,t){const r=ee(e);let s=r.host;(r.
type==="ip4"||r.type==="ip6")&&r.sni!=null&&(s=r.sni);let i=!1;for(const[o,a]of this.mappings.entries())a.domain===s&&(this.
log("marking %s to %s DNS mapping as verified",o,a.domain),i=a.verified,a.verified=!0,a.expires=Date.now()+t,a.lastVerified=
Date.now());return i}unconfirm(e,t){const r=ee(e);if(r.type!=="ip4"&&r.type!=="ip6")return!1;const s=r.sni??r.host;let i=!1;
for(const[o,a]of this.mappings.entries())a.domain===s&&(this.log("removing verification of %s to %s DNS mapping",o,a.domain),
i=i||a.verified,a.verified=!1,a.expires=Date.now()+t);return i}}class HM{log;mappings;constructor(e,t={}){this.log=e.logger.
forComponent("libp2p:address-manager:ip-mappings"),this.mappings=Qt({name:"libp2p_address_manager_ip_mappings",metrics:e.
metrics})}has(e){const t=ee(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;for(const r of this.mappings.values())for(const s of r)
if(s.externalIp===t.host)return!0;return!1}add(e,t,r,s=t,i="tcp"){const o=`${e}-${t}-${i}`,a=this.mappings.get(o)??[],c={
internalIp:e,internalPort:t,externalIp:r,externalPort:s,externalFamily:ga(r)?4:6,protocol:i,verified:!1,expires:0};a.push(
c),this.mappings.set(o,a)}remove(e){const t=ee(e);if(t.type!=="ip4"&&t.type!=="ip6")return!1;let r=!1;for(const[s,i]of this.
mappings.entries()){for(let o=0;o<i.length;o++){const a=i[o];a.externalIp===t.host&&a.externalPort===t.port&&a.protocol===
t.protocol&&(this.log("removing %s:%s to %s:%s %s IP mapping",a.externalIp,a.externalPort,t.host,t.port,t.protocol),r=r||
a.verified,i.splice(o,1),o--)}i.length===0&&this.mappings.delete(s)}return r}getAll(e){const t=[];for(const{multiaddr:r}of e){
if(!gt(r))continue;const s=ee(r);if(s.type!=="ip4"&&s.type!=="ip6")continue;let i;if(s.protocol==="tcp"?i=`${s.host}-${s.
port}-tcp`:s.protocol==="udp"&&(i=`${s.host}-${s.port}-udp`),i==null)continue;const o=this.mappings.get(i);if(o!=null)for(const a of o)
t.push({multiaddr:this.maybeOverrideIp(r,a.externalIp,a.externalFamily,a.protocol,a.externalPort),verified:a.verified,type:"\
ip-mapping",expires:a.expires,lastVerified:a.lastVerified})}return t}maybeOverrideIp(e,t,r,s,i){const o=e.getComponents(),
a=o.findIndex(l=>l.code===su||l.code===as),c=o.findIndex(l=>l.name===s);return a>-1&&c>-1?(o[a].value=t,o[a].code=r===4?
su:as,o[c].value=`${i}`,k(o)):e}confirm(e,t){if(!gt(e))return!1;const r=ee(e);let s=!1;for(const i of this.mappings.values())
for(const o of i)o.externalIp===r.host&&(this.log("marking %s to %s IP mapping as verified",o.internalIp,o.externalIp),s=
o.verified,o.verified=!0,o.expires=Date.now()+t,o.lastVerified=Date.now());return s}unconfirm(e,t){if(!gt(e))return!1;const r=ee(
e);let s=!1;for(const i of this.mappings.values())for(let o=0;o<i.length;o++){const a=i[o];a.externalIp===r.host&&a.externalPort===
r.port&&a.protocol===r.protocol&&(this.log("removing verification of %s:%s to %s:%s %s IP mapping",a.externalIp,a.externalPort,
r.host,r.port,r.protocol),s=s||a.verified,a.verified=!1,a.expires=Date.now()+t)}return s}}const XM={maxObservedAddresses:10};
class QM{log;addresses;maxObservedAddresses;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:o\
bserved-addresses"),this.addresses=Qt({name:"libp2p_address_manager_observed_addresses",metrics:e.metrics}),this.maxObservedAddresses=
t.maxObservedAddresses??XM.maxObservedAddresses}has(e){return this.addresses.has(e.toString())}removePrefixed(e){for(const t of this.
addresses.keys())t.toString().startsWith(e)&&this.addresses.delete(t)}add(e){this.addresses.size!==this.maxObservedAddresses&&
(hs(e)||V2(e)||(this.log("adding observed address %a",e),this.addresses.set(e.toString(),{verified:!1,expires:0})))}getAll(){
return Array.from(this.addresses).map(([e,t])=>({multiaddr:k(e),verified:t.verified,type:"observed",expires:t.expires,lastVerified:t.
lastVerified}))}remove(e){const t=this.addresses.get(e.toString())?.verified??!1;return this.log("removing observed addr\
ess %a",e),this.addresses.delete(e.toString()),t}confirm(e,t){const r=e.toString(),s=this.addresses.get(r)??{verified:!1,
expires:Date.now()+t,lastVerified:Date.now()},i=s.verified;return s.verified=!0,s.expires=Date.now()+t,s.lastVerified=Date.
now(),this.log("marking observed address %a as verified",r),this.addresses.set(r,s),i}}const YM={maxObservedAddresses:10};
class JM{log;addresses;maxObservedAddresses;constructor(e,t={}){this.log=e.logger.forComponent("libp2p:address-manager:o\
bserved-addresses"),this.addresses=Qt({name:"libp2p_address_manager_transport_addresses",metrics:e.metrics}),this.maxObservedAddresses=
t.maxObservedAddresses??YM.maxObservedAddresses}get(e,t){if(hs(e))return{multiaddr:e,verified:!0,type:"transport",expires:Date.
now()+t,lastVerified:Date.now()};const r=this.toKey(e);let s=this.addresses.get(r);return s==null&&(s={verified:!gt(e),expires:0},
this.addresses.set(r,s)),{multiaddr:e,verified:s.verified,type:"transport",expires:s.expires,lastVerified:s.lastVerified}}has(e){
const t=this.toKey(e);return this.addresses.has(t)}remove(e){const t=this.toKey(e),r=this.addresses.get(t)?.verified??!1;
return this.log("removing observed address %a",e),this.addresses.delete(t),r}confirm(e,t){const r=this.toKey(e),s=this.addresses.
get(r)??{verified:!1,expires:0,lastVerified:0},i=s.verified;return s.verified=!0,s.expires=Date.now()+t,s.lastVerified=Date.
now(),this.addresses.set(r,s),i}unconfirm(e,t){const r=this.toKey(e),s=this.addresses.get(r)??{verified:!1,expires:0},i=s.
verified;return s.verified=!1,s.expires=Date.now()+t,this.addresses.set(r,s),i}toKey(e){if(!gt(e))return e.toString();const t=ee(
e);return`${t.host}-${t.port}-${t.protocol}`}}const gp=6e4,mp={addressVerificationTTL:gp*10,addressVerificationRetry:gp*
5},ZM=n=>n;function El(n,e){const t=n.getComponents().findLast(r=>r.code===L)?.value;return t!=null&&Z(t).equals(e)&&(n=
n.decapsulate(k(`/p2p/${e.toString()}`))),n}class e${log;components;listen;announce;appendAnnounce;announceFilter;observed;dnsMappings;ipMappings;transportAddresses;observedAddressFilter;addressVerificationTTL;addressVerificationRetry;constructor(e,t={}){
const{listen:r=[],announce:s=[],appendAnnounce:i=[]}=t;this.components=e,this.log=e.logger.forComponent("libp2p:address-\
manager"),this.listen=r.map(o=>o.toString()),this.announce=new Set(s.map(o=>o.toString())),this.appendAnnounce=new Set(i.
map(o=>o.toString())),this.observed=new QM(e,t),this.dnsMappings=new jM(e,t),this.ipMappings=new HM(e,t),this.transportAddresses=
new JM(e,t),this.announceFilter=t.announceFilter??ZM,this.observedAddressFilter=Si(1024),this.addressVerificationTTL=t.addressVerificationTTL??
mp.addressVerificationTTL,this.addressVerificationRetry=t.addressVerificationRetry??mp.addressVerificationRetry,this._updatePeerStoreAddresses=
Ea(this._updatePeerStoreAddresses.bind(this),1e3),e.events.addEventListener("transport:listening",()=>{this._updatePeerStoreAddresses()}),
e.events.addEventListener("transport:close",()=>{this._updatePeerStoreAddresses()})}[Symbol.toStringTag]="@libp2p/addres\
s-manager";_updatePeerStoreAddresses(){const e=this.getAddresses().map(t=>t.getComponents().findLast(r=>r.code===L)?.value===
this.components.peerId.toString()?t.decapsulate(`/p2p/${this.components.peerId.toString()}`):t);this.components.peerStore.
patch(this.components.peerId,{multiaddrs:e}).catch(t=>{this.log.error("error updating addresses - %e",t)})}getListenAddrs(){
return Array.from(this.listen).map(e=>k(e))}getAnnounceAddrs(){return Array.from(this.announce).map(e=>k(e))}getAppendAnnounceAddrs(){
return Array.from(this.appendAnnounce).map(e=>k(e))}getObservedAddrs(){return this.observed.getAll().map(e=>e.multiaddr)}addObservedAddr(e){
const t=ee(e);let r;switch(t.type){case"ip4":{r=`${t.host}:${t.port}`;break}case"ip6":{r=`[${t.host}]:${t.port}`;break}default:
return}this.observedAddressFilter.has(r)||(this.observedAddressFilter.add(r),e=El(e,this.components.peerId),!this.ipMappings.
has(e)&&(this.dnsMappings.has(e)||this.observed.add(e)))}confirmObservedAddr(e,t){e=El(e,this.components.peerId);let r=!0;
(t?.type==="transport"||this.transportAddresses.has(e))&&!this.transportAddresses.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="dns-mapping"||this.dnsMappings.has(e))&&!this.dnsMappings.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="ip-mapping"||this.ipMappings.has(e))&&!this.ipMappings.confirm(e,t?.ttl??this.addressVerificationTTL)&&
r&&(r=!1),(t?.type==="observed"||this.observed.has(e))&&(this.maybeUpgradeToIPMapping(e)?(this.ipMappings.confirm(e,t?.ttl??
this.addressVerificationTTL),r=!1):!this.observed.confirm(e,t?.ttl??this.addressVerificationTTL)&&r&&(r=!1)),r||this._updatePeerStoreAddresses()}removeObservedAddr(e,t){
e=El(e,this.components.peerId);let r=!0;this.observed.has(e)&&this.observed.remove(e)&&r&&(r=!1),this.transportAddresses.
has(e)&&this.transportAddresses.unconfirm(e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),this.dnsMappings.has(e)&&this.
dnsMappings.unconfirm(e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),this.ipMappings.has(e)&&this.ipMappings.unconfirm(
e,t?.ttl??this.addressVerificationRetry)&&r&&(r=!1),r||this._updatePeerStoreAddresses()}getAddresses(){const e=new Set,t=this.
getAddressesWithMetadata().filter(r=>{if(!r.verified)return!1;const s=r.multiaddr.toString();return e.has(s)?!1:(e.add(s),
!0)}).map(r=>r.multiaddr);return this.announceFilter(t.map(r=>{const s=k(r);return s.getComponents().pop()?.value===this.
components.peerId.toString()?s:s.encapsulate(`/p2p/${this.components.peerId.toString()}`)}))}getAddressesWithMetadata(){
const e=this.getAnnounceAddrs();if(e.length>0)return this.components.transportManager.getListeners().forEach(s=>{s.updateAnnounceAddrs(
e)}),e.map(s=>({multiaddr:s,verified:!0,type:"announce",expires:Date.now()+this.addressVerificationTTL,lastVerified:Date.
now()}));let t=[];t=t.concat(this.components.transportManager.getAddrs().map(s=>this.transportAddresses.get(s,this.addressVerificationTTL)));
const r=this.getAppendAnnounceAddrs();return r.length>0&&(this.components.transportManager.getListeners().forEach(s=>{s.
updateAnnounceAddrs(r)}),t=t.concat(r.map(s=>({multiaddr:s,verified:!0,type:"announce",expires:Date.now()+this.addressVerificationTTL,
lastVerified:Date.now()})))),t=t.concat(this.observed.getAll()),t=t.concat(this.ipMappings.getAll(t)),t=t.concat(this.dnsMappings.
getAll(t)),t}addDNSMapping(e,t){this.dnsMappings.add(e,t)}removeDNSMapping(e){this.dnsMappings.remove(k(`/dns/${e}`))&&this.
_updatePeerStoreAddresses()}addPublicAddressMapping(e,t,r,s=t,i="tcp"){this.ipMappings.add(e,t,r,s,i),this.observed.removePrefixed(
`/ip${ga(r)?4:6}/${r}/${i}/${s}`)}removePublicAddressMapping(e,t,r,s=t,i="tcp"){this.ipMappings.remove(k(`/ip${ga(r)?4:6}\
/${r}/${i}/${s}`))&&this._updatePeerStoreAddresses()}maybeUpgradeToIPMapping(e){if(this.ipMappings.has(e)||!gt(e))return!1;
const t=ee(e);if(t.type!=="ip4"||Dh(t.host)===!0)return!1;const r=this.components.transportManager.getListeners(),s=[i=>_i.
exactMatch(i)||Sa.exactMatch(i),i=>va.exactMatch(i),i=>s1.exactMatch(i)];for(const i of s){if(!i(e))continue;const o=r.filter(
l=>l.getAddrs().filter(u=>ee(u).type==="ip4"&&i(u)).length>0);if(o.length!==1)continue;const a=o[0].getAddrs().filter(l=>!pu(
l)).pop();if(a==null)continue;const c=ee(a);return c.port==null?!1:(this.observed.remove(e),this.ipMappings.add(c.host,c.
port,t.host,t.port,t.protocol),!0)}return!1}}var bp;(function(n){n.NOT_STARTED_YET="The libp2p node is not started yet",
n.NOT_FOUND="Not found"})(bp||(bp={}));class t$ extends Error{constructor(e="Missing service"){super(e),this.name="Missi\
ngServiceError"}}class n$ extends Error{constructor(e="Unmet service dependencies"){super(e),this.name="UnmetServiceDepe\
ndenciesError"}}class _l extends Error{constructor(e="No content routers available"){super(e),this.name="NoContentRouter\
sError"}}class yp extends Error{constructor(e="No peer routers available"){super(e),this.name="NoPeerRoutersError"}}class r$ extends Error{constructor(e="\
Should not try to find self"){super(e),this.name="QueriedForSelfError"}}class s$ extends Error{constructor(e="Unhandled \
protocol error"){super(e),this.name="UnhandledProtocolError"}}class i$ extends Error{constructor(e="Duplicate protocol h\
andler error"){super(e),this.name="DuplicateProtocolHandlerError"}}class wp extends Error{constructor(e="Dial denied err\
or"){super(e),this.name="DialDeniedError"}}class o$ extends Error{constructor(e="No transport was configured to listen o\
n this address"){super(e),this.name="UnsupportedListenAddressError"}}class a$ extends Error{constructor(e="Configured li\
sten addresses could not be listened on"){super(e),this.name="UnsupportedListenAddressesError"}}class c$ extends Error{constructor(e="\
No valid addresses"){super(e),this.name="NoValidAddressesError"}}class l$ extends Error{constructor(e="Connection interc\
epted"){super(e),this.name="ConnectionInterceptedError"}}class u$ extends Error{constructor(e="Connection denied"){super(
e),this.name="ConnectionDeniedError"}}class ca extends Error{constructor(e="Stream is not multiplexed"){super(e),this.name=
"MuxerUnavailableError"}}class xo extends Error{constructor(e="Encryption failed"){super(e),this.name="EncryptionFailedE\
rror"}}class h$ extends Error{constructor(e="Transport unavailable"){super(e),this.name="TransportUnavailableError"}}class d$ extends Error{constructor(e="\
Max recursive depth reached"){super(e),this.name="RecursionLimitError"}}class f${components={};_started=!1;constructor(e={}){
this.components={};for(const[t,r]of Object.entries(e))this.components[t]=r;this.components.logger==null&&(this.components.
logger=wb())}isStarted(){return this._started}async _invokeStartableMethod(e){await Promise.all(Object.values(this.components).
filter(t=>_h(t)).map(async t=>{await t[e]?.()}))}async beforeStart(){await this._invokeStartableMethod("beforeStart")}async start(){
await this._invokeStartableMethod("start"),this._started=!0}async afterStart(){await this._invokeStartableMethod("afterS\
tart")}async beforeStop(){await this._invokeStartableMethod("beforeStop")}async stop(){await this._invokeStartableMethod(
"stop"),this._started=!1}async afterStop(){await this._invokeStartableMethod("afterStop")}}const p$=["metrics","connecti\
onProtector","dns"],g$=["components","isStarted","beforeStart","start","afterStart","beforeStop","stop","afterStop","the\
n","_invokeStartableMethod"];function m$(n={}){const e=new f$(n);return new Proxy(e,{get(r,s,i){if(typeof s=="string"&&!g$.
includes(s)){const o=e.components[s];if(o==null&&!p$.includes(s))throw new t$(`${s} not set`);return o}return Reflect.get(
r,s,i)},set(r,s,i){return typeof s=="string"?e.components[s]=i:Reflect.set(r,s,i),!0}})}function b$(n){const e={};for(const t of Object.
values(n.components))for(const r of y$(t))e[r]=!0;for(const t of Object.values(n.components))for(const r of w$(t))if(e[r]!==
!0)throw new n$(`Service "${v$(t)}" required capability "${r}" but it was not provided by any component, you may need to\
 add additional configuration when creating your node.`)}function y$(n){return Array.isArray(n?.[rt])?n[rt]:[]}function w$(n){
return Array.isArray(n?.[us])?n[us]:[]}function v$(n){return n?.[Symbol.toStringTag]??n?.toString()??"unknown"}function S$(n={}){
return n.denyDialMultiaddr==null&&(n.denyDialMultiaddr=e=>_i.matches(e)?!0:hs(e)),n}let A$=class rw extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,rw)}};const E$=n=>"reason"in n?n.reason:new DOMException(
"This operation was aborted.","AbortError"),_$=2**31-1,x$=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function C$(n,e){
const{milliseconds:t,fallback:r,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
n.cancel?.()}catch{}},h=new Promise((f,p)=>{const A=()=>{p(E$(o)),l()},y=x$(t,i);try{y?p(y):o?.aborted?A():o&&(c=A,o.addEventListener(
"abort",c,{once:!0}))}finally{n.then(f,p)}if(y||o?.aborted||t>_$)return;const I=r||s===!1||s instanceof Error?void 0:new A$(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{f(r())}catch(d){p(d)}else s===!1?
f():p(s instanceof Error?s:I);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const sw=n=>typeof n=="function"?{filter:n}:
{...n},I$=n=>n===1/0||Number.isSafeInteger(n)&&n>=0,T$=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],D$=n=>{for(const[e,t]of T$){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="functi\
on")return{addListener:r.bind(n),removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},P$=n=>{const e=new Map;
for(const[t,r]of n)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},M$=({addListener:n,removeListener:e,
handlers:t,signal:r,abortHandler:s,isDone:i})=>{r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){
e(o,a);return}},$$=({removeListener:n,handlers:e,signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener(
"abort",r)},k$=(n,e,t)=>{let r=Promise.resolve();return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function L$(n,e,t){let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=sw(t);const{
filter:l}=t;if(!I$(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=D$(n);if(t.count===0){a([]);return}const f=[],p=w=>{
r(),c(w)},A=k$(l,()=>s,p),y=w=>{f.push(w),t.count===f.length&&(r(),a(f))},I=(...w)=>{if(s)return;const b=t.multiArgs?w:w[0];
if(!l){y(b);return}A(b,v=>{v&&y(b)})},d=(...w)=>{p(t.rejectionMultiArgs?w:w[0])},m=()=>{p(t.signal.reason)},E={addListener:u,
removeListener:h,handlers:P$([[e,I],[t.rejectionEvents??["error"],d]]),signal:t.signal,abortHandler:m,isDone:()=>s};r=()=>{
s=!0,clearTimeout(i),$$(E)},M$(E),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
r,t.timeout)),a(f))});if(o.cancel=r,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=C$(o,{milliseconds:t.
timeout});return a.cancel=()=>{r(),a.clear()},a}return o}function Vu(n,e,t){const r=L$(n,e,{...sw(t),count:1,resolveImmediately:!1}),
s=r.then(i=>i[0]);return s.cancel=r.cancel,s}function iw(n){if(ti(n))return{peerId:n,multiaddrs:[]};let e=Array.isArray(
n)?n:[n],t;if(e.length>0){const r=e[0].getComponents().findLast(s=>s.code===L)?.value;t=r==null?void 0:Z(r),e.forEach(s=>{
if(!Sh(s))throw new uc("Invalid multiaddr");const i=s.getComponents().findLast(o=>o.code===L)?.value;if(i==null){if(t!=null)
throw new P("Multiaddrs must all have the same peer id or have no peer id")}else{const o=Z(i);if(t?.equals(o)!==!0)throw new P(
"Multiaddrs must all have the same peer id or have no peer id")}})}return e=e.filter(r=>!t1.exactMatch(r)),{peerId:t,multiaddrs:e}}
const R$=["/ipfs/id/1.0.0","/ipfs/id/push/1.0.0","/libp2p/autonat/1.0.0","/libp2p/dcutr"];async function N$(n,e){const t=n?.
streams?.map(s=>s.protocol)??[],r=e?.closableProtocols??R$;if(!(t.filter(s=>s!=null&&!r.includes(s)).length>0))try{await n?.
close(e)}catch(s){n?.abort(s)}}function qu(n){const e=ee(n);let t=e.cidr;if(e.type!=="ip4"&&e.type!=="ip6")throw new P(`\
Multiaddr ${n} was not an IPv4 or IPv6 address`);if(t==null)switch(e.type){case"ip4":{t=32;break}case"ip6":{t=128;break}default:
throw new P(`Multiaddr ${n} was not an IPv4 or IPv6 address`)}return new sb(e.host,t)}function ow(n){return!ds.exactMatch(
n)}function aw(n,e,t){if(n==null||e==null)return;const r=e.filter(i=>i.status==="open").sort((i,o)=>i.direct?-1:o.direct?
1:0).find(i=>i.limits==null);if(r==null||r.direct||t==null)return r;if(!t.some(i=>ow(i)))return r}class F${connectionManager;peerStore;allow;events;log;constructor(e,t={}){
this.allow=(t.allow??[]).map(r=>qu(r)),this.connectionManager=e.connectionManager,this.peerStore=e.peerStore,this.events=
e.events,this.log=e.logger.forComponent("libp2p:connection-manager:connection-pruner"),this.maybePruneConnections=this.maybePruneConnections.
bind(this)}start(){this.events.addEventListener("connection:open",this.maybePruneConnections)}stop(){this.events.removeEventListener(
"connection:open",this.maybePruneConnections)}maybePruneConnections(){this._maybePruneConnections().catch(e=>{this.log.error(
"error while pruning connections - %e",e)})}async _maybePruneConnections(){const e=this.connectionManager.getConnections(),
t=e.length,r=this.connectionManager.getMaxConnections();if(this.log("checking max connections limit %d/%d",t,r),t<=r)return;
const s=new Dr;for(const c of e){const l=c.remotePeer;if(!s.has(l)){s.set(l,0);try{const u=await this.peerStore.get(l);s.
set(l,[...u.tags.values()].reduce((h,f)=>h+f.value,0))}catch(u){u.name!=="NotFoundError"&&this.log.error("error loading \
peer tags - %e",u)}}}const i=this.sortConnections(e,s),o=Math.max(t-r,0),a=[];for(const c of i)if(this.log("too many con\
nections open - closing a connection to %p",c.remotePeer),this.allow.some(u=>{if(gt(c.remoteAddr)){const h=ee(c.remoteAddr);
return u.contains(h.host)}return!0})||a.push(c),a.length===o)break;await Promise.all(a.map(async c=>{await N$(c,{signal:AbortSignal.
timeout(1e3)})})),this.events.safeDispatchEvent("connection:prune",{detail:a})}sortConnections(e,t){return e.sort((r,s)=>{
const i=r.timeline.open,o=s.timeline.open;return i<o?1:i>o?-1:0}).sort((r,s)=>r.direction==="outbound"&&s.direction==="i\
nbound"?1:r.direction==="inbound"&&s.direction==="outbound"?-1:0).sort((r,s)=>r.streams.length>s.streams.length?1:r.streams.
length<s.streams.length?-1:0).sort((r,s)=>{const i=t.get(r.remotePeer)??0,o=t.get(s.remotePeer)??0;return i>o?1:i<o?-1:0})}}
const cw=1e4,lw=6e3,uw=1e3,U$=1e4,Fa=1e4,hw=25,O$=5,B$=10,z$=5,V$="last-dial-failure",q$="last-dial-success",dw=500,W$=32,
K$=100,fw=50;function G$(n,e){return n.isCertified&&!e.isCertified?-1:!n.isCertified&&e.isCertified?1:0}function j$(n){return n.
sort((e,t)=>d1(e.multiaddr,t.multiaddr)||f1(e.multiaddr,t.multiaddr)||p1(e.multiaddr,t.multiaddr)||G$(e,t)||h1(e.multiaddr,
t.multiaddr))}class H$ extends AggregateError{static name="DNSQueryFailedError";name="DNSQueryFailedError"}function X$(n,e,t){
let r=0,s=n.length;for(;s>0;){const i=Math.trunc(s/2);let o=r+i;t(n[o],e)<=0?(r=++o,s-=i+1):s=i}return r}class Q${#e=[];enqueue(e,t){
const{priority:r=0,id:s}=t??{},i={priority:r,id:s,run:e};if(this.size===0||this.#e[this.size-1].priority>=r){this.#e.push(
i);return}const o=X$(this.#e,i,(a,c)=>c.priority-a.priority);this.#e.splice(o,0,i)}setPriority(e,t){const r=this.#e.findIndex(
i=>i.id===e);if(r===-1)throw new ReferenceError(`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.
splice(r,1);this.enqueue(s.run,{priority:t,id:e})}dequeue(){return this.#e.shift()?.run}filter(e){return this.#e.filter(
t=>t.priority===e.priority).map(t=>t.run)}get size(){return this.#e.length}}class pw extends tS{#e;#t;#n=0;#f;#p=!1;#g=!1;#l;#w=0;#m=0;#i;#o;#r;#v;#s=0;#u;#a;#C=1n;#h=new Map;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:Q$,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expected \`inte\
rvalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString()??""}\` (${typeof e.intervalCap})`);if(e.interval===
void 0||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a finite number >= \
0, got \`${e.interval?.toString()??""}\` (${typeof e.interval})`);if(this.#e=e.carryoverIntervalCount??e.carryoverConcurrencyCount??
!1,this.#t=e.intervalCap===Number.POSITIVE_INFINITY||e.interval===0,this.#f=e.intervalCap,this.#l=e.interval,this.#r=new e.
queueClass,this.#v=e.queueClass,this.concurrency=e.concurrency,e.timeout!==void 0&&!(Number.isFinite(e.timeout)&&e.timeout>
0))throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.timeout})`);
this.timeout=e.timeout,this.#a=e.autoStart===!1,this.#k()}get#I(){return this.#t||this.#n<this.#f}get#T(){return this.#s<
this.#u}#D(){this.#s--,this.#s===0&&this.emit("pendingZero"),this.#b(),this.emit("next")}#P(){this.#_(),this.#E(),this.#o=
void 0}get#M(){const e=Date.now();if(this.#i===void 0){const t=this.#w-e;if(t<0){if(this.#m>0){const r=e-this.#m;if(r<this.#l)
return this.#S(this.#l-r),!0}this.#n=this.#e?this.#s:0}else return this.#S(t),!0}return!1}#S(e){this.#o===void 0&&(this.#o=
setTimeout(()=>{this.#P()},e))}#A(){this.#i&&(clearInterval(this.#i),this.#i=void 0)}#$(){this.#o&&(clearTimeout(this.#o),
this.#o=void 0)}#b(){if(this.#r.size===0)return this.#A(),this.emit("empty"),this.#s===0&&(this.#$(),this.emit("idle")),
!1;let e=!1;if(!this.#a){const t=!this.#M;if(this.#I&&this.#T){const r=this.#r.dequeue();this.#t||(this.#n++,this.#d()),
this.emit("active"),this.#m=Date.now(),r(),t&&this.#E(),e=!0}}return e}#E(){this.#t||this.#i!==void 0||(this.#i=setInterval(
()=>{this.#_()},this.#l),this.#w=Date.now()+this.#l)}#_(){this.#n===0&&this.#s===0&&this.#i&&this.#A(),this.#n=this.#e?this.#s:
0,this.#y(),this.#d()}#y(){for(;this.#b(););}get concurrency(){return this.#u}set concurrency(e){if(!(typeof e=="number"&&
e>=1))throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this.#u=e,
this.#y()}setPriority(e,t){if(typeof t!="number"||!Number.isFinite(t))throw new TypeError(`Expected \`priority\` to be a f\
inite number, got \`${t}\` (${typeof t})`);this.#r.setPriority(e,t)}async add(e,t={}){return t.id??=(this.#C++).toString(),
t={timeout:this.timeout,...t},new Promise((r,s)=>{const i=Symbol(`task-${t.id}`);this.#r.enqueue(async()=>{this.#s++,this.#h.
set(i,{id:t.id,priority:t.priority??0,startTime:Date.now(),timeout:t.timeout});let o;try{try{t.signal?.throwIfAborted()}catch(l){
throw this.#t||this.#n--,this.#h.delete(i),l}let a=e({signal:t.signal});if(t.timeout&&(a=nS(Promise.resolve(a),{milliseconds:t.
timeout,message:`Task timed out after ${t.timeout}ms (queue has ${this.#s} running, ${this.#r.size} waiting)`})),t.signal){
const{signal:l}=t;a=Promise.race([a,new Promise((u,h)=>{o=()=>{h(l.reason)},l.addEventListener("abort",o,{once:!0})})])}
const c=await a;r(c),this.emit("completed",c)}catch(a){s(a),this.emit("error",a)}finally{o&&t.signal?.removeEventListener(
"abort",o),this.#h.delete(i),queueMicrotask(()=>{this.#D()})}},t),this.emit("add"),this.#b()})}async addAll(e,t){return Promise.
all(e.map(async r=>this.add(r,t)))}start(){return this.#a?(this.#a=!1,this.#y(),this):this}pause(){this.#a=!0}clear(){this.#r=
new this.#v,this.#x()}async onEmpty(){this.#r.size!==0&&await this.#c("empty")}async onSizeLessThan(e){this.#r.size<e||await this.#c(
"next",()=>this.#r.size<e)}async onIdle(){this.#s===0&&this.#r.size===0||await this.#c("idle")}async onPendingZero(){this.#s!==
0&&await this.#c("pendingZero")}async onRateLimit(){this.isRateLimited||await this.#c("rateLimit")}async onRateLimitCleared(){
this.isRateLimited&&await this.#c("rateLimitCleared")}async onError(){return new Promise((e,t)=>{const r=s=>{this.off("e\
rror",r),t(s)};this.on("error",r)})}async#c(e,t){return new Promise(r=>{const s=()=>{t&&!t()||(this.off(e,s),r())};this.
on(e,s)})}get size(){return this.#r.size}sizeBy(e){return this.#r.filter(e).length}get pending(){return this.#s}get isPaused(){
return this.#a}#k(){this.#t||(this.on("add",()=>{this.#r.size>0&&this.#d()}),this.on("next",()=>{this.#d()}))}#d(){this.#t||
this.#g||(this.#g=!0,queueMicrotask(()=>{this.#g=!1,this.#x()}))}#x(){const e=this.#p,t=!this.#t&&this.#n>=this.#f&&this.#r.
size>0;t!==e&&(this.#p=t,this.emit(t?"rateLimit":"rateLimitCleared"))}get isRateLimited(){return this.#p}get isSaturated(){
return this.#s===this.#u&&this.#r.size>0||this.isRateLimited&&this.#r.size>0}get runningTasks(){return[...this.#h.values()].
map(e=>({...e}))}}function gw(n){const e=[Un.A];return n==null?e:Array.isArray(n)?n.length===0?e:n:[n]}const mw=60;function bw(n){
return{Status:n.Status??0,TC:n.TC??n.flag_tc??!1,RD:n.RD??n.flag_rd??!1,RA:n.RA??n.flag_ra??!1,AD:n.AD??n.flag_ad??!1,CD:n.
CD??n.flag_cd??!1,Question:(n.Question??n.questions??[]).map(e=>({name:e.name,type:Un[e.type]})),Answer:(n.Answer??n.answers??
[]).map(e=>({name:e.name,type:Un[e.type],TTL:e.TTL??e.ttl??mw,data:e.data instanceof Uint8Array?Ge(e.data):e.data}))}}const Y$=4;
function vp(n,e={}){const t=new pw({concurrency:e.queryConcurrency??Y$});return async(r,s={})=>{const i=new URLSearchParams;
i.set("name",r),gw(s.types).forEach(a=>{i.append("type",Un[a])}),s.onProgress?.(new B("dns:query",r));const o=await t.add(
async()=>{const a=await fetch(`${n}?${i}`,{headers:{accept:"application/dns-json"},signal:s?.signal});if(a.status!==200)
throw new Error(`Unexpected HTTP status: ${a.status} - ${a.statusText}`);const c=bw(await a.json());return s.onProgress?.(
new B("dns:response",c)),c},{signal:s.signal});if(o==null)throw new Error("No DNS response received");return o}}function J$(){
return[vp("https://cloudflare-dns.com/dns-query"),vp("https://dns.google/resolve")]}var xl,Sp;function Z$(){return Sp||(Sp=
1,xl=function(n){if(!n)throw Error("hashlru must have a max value, of type number, greater than 0");var e=0,t=Object.create(
null),r=Object.create(null);function s(i,o){t[i]=o,e++,e>=n&&(e=0,r=t,t=Object.create(null))}return{has:function(i){return t[i]!==
void 0||r[i]!==void 0},remove:function(i){t[i]!==void 0&&(t[i]=void 0),r[i]!==void 0&&(r[i]=void 0)},get:function(i){var o=t[i];
if(o!==void 0)return o;if((o=r[i])!==void 0)return s(i,o),o},set:function(i,o){t[i]!==void 0?t[i]=o:s(i,o)},clear:function(){
t=Object.create(null),r=Object.create(null)}}}),xl}var e3=Z$();const t3=Lm(e3);class n3{lru;constructor(e){this.lru=t3(e)}get(e,t){
let r=!0;const s=[];for(const i of t){const o=this.getAnswers(e,i);if(o.length===0){r=!1;break}s.push(...o)}if(r)return bw(
{answers:s})}getAnswers(e,t){const r=`${e.toLowerCase()}-${t}`,s=this.lru.get(r);if(s!=null){const i=s.filter(o=>o.expires>
Date.now()).map(({expires:o,value:a})=>({...a,TTL:Math.round((o-Date.now())/1e3),type:Un[a.type]}));return i.length===0&&
this.lru.remove(r),i}return[]}add(e,t){const r=`${e.toLowerCase()}-${t.type}`,s=this.lru.get(r)??[];s.push({expires:Date.
now()+(t.TTL??mw)*1e3,value:t}),this.lru.set(r,s)}remove(e,t){const r=`${e.toLowerCase()}-${t}`;this.lru.remove(r)}clear(){
this.lru.clear()}}function r3(n){return new n3(n)}const s3=1e3;class i3{resolvers;cache;constructor(e){this.resolvers={},
this.cache=r3(e.cacheSize??s3),Object.entries(e.resolvers??{}).forEach(([t,r])=>{Array.isArray(r)||(r=[r]),t.endsWith(".")||
(t=`${t}.`),this.resolvers[t]=r}),this.resolvers["."]==null&&(this.resolvers["."]=J$())}async query(e,t={}){const r=gw(t.
types),s=t.cached!==!1?this.cache.get(e,r):void 0;if(s!=null)return t.onProgress?.(new B("dns:cache",s)),s;const i=`${e.
split(".").pop()}.`,o=(this.resolvers[i]??this.resolvers["."]).sort(()=>Math.random()>.5?-1:1),a=[];for(const c of o){if(t.
signal?.aborted===!0)break;try{const l=await c(e,{...t,types:r});for(const u of l.Answer)this.cache.add(e,u);return l}catch(l){
a.push(l),t.onProgress?.(new B("dns:error",l))}}throw new H$(a,`DNS lookup of ${e} ${r} failed`)}}var Un;(function(n){n[n.
A=1]="A",n[n.CNAME=5]="CNAME",n[n.TXT=16]="TXT",n[n.AAAA=28]="AAAA"})(Un||(Un={}));function o3(n={}){return new i3(n)}class a3{dns;canResolve(e){
return e.getComponents().some(({name:t})=>t==="dnsaddr")}async resolve(e,t){const r=e.getComponents().find(c=>c.name==="\
dnsaddr")?.value;if(r==null)return[e];const s=this.getDNS(t);let i;try{i=await s.query(`_dnsaddr.${r}`,{signal:t?.signal,
types:[Un.TXT]})}catch(c){if(c.name==="DNSQueryFailedError"&&Array.isArray(c.errors)&&c.errors.length>0&&c.errors.every(
u=>u.name==="EmptyDNSAnswerError"))return[];throw c}const o=e.getComponents().find(c=>c.name==="p2p")?.value,a=[];for(const c of i.
Answer){const l=c.data.replace(/["']/g,"").trim().split("=")[1];l!=null&&(o!=null&&!l.includes(o)||a.push(k(l)))}return a}getDNS(e){
return e.dns!=null?e.dns:(this.dns==null&&(this.dns=o3()),this.dns)}}const yw=new a3;async function ww(n,e,t){const r=t.
depth??0;if(r>(t.maxRecursiveDepth??W$))throw new d$("Max recursive depth reached");let s=!1;const i=[];for(const o of Object.
values(e))if(o.canResolve(n)){s=!0;const a=await o.resolve(n,t);for(const c of a)i.push(...await ww(c,e,{...t,depth:r+1}))}
return s===!1&&i.push(n),i}const qr={maxParallelDials:fw,maxDialQueueLength:dw,maxPeerAddrsToDial:hw,dialTimeout:cw,addressDialTimeout:lw,
resolvers:{dnsaddr:yw}};class c3{queue;components;addressSorter;maxPeerAddrsToDial;maxDialQueueLength;dialTimeout;addressDialTimeout;shutDownController;connections;log;resolvers;constructor(e,t={}){
this.addressSorter=t.addressSorter,this.maxPeerAddrsToDial=t.maxPeerAddrsToDial??qr.maxPeerAddrsToDial,this.maxDialQueueLength=
t.maxDialQueueLength??qr.maxDialQueueLength,this.dialTimeout=t.dialTimeout??qr.dialTimeout,this.addressDialTimeout=t.addressDialTimeout??
qr.addressDialTimeout,this.connections=t.connections??new Dr,this.log=e.logger.forComponent("libp2p:connection-manager:d\
ial-queue"),this.components=e,this.resolvers=t.resolvers??qr.resolvers,this.shutDownController=new AbortController,this.
shutDownController.signal,this.queue=new aA({concurrency:t.maxParallelDials??qr.maxParallelDials,metricName:"libp2p_dial\
_queue",metrics:e.metrics}),this.queue.addEventListener("failure",r=>{r.detail?.error.name!==cs.name&&this.log.error("er\
ror in dial queue - %e",r.detail.error)})}start(){this.shutDownController=new AbortController,this.shutDownController.signal}stop(){
this.shutDownController.abort(),this.queue.abort()}async dial(e,t={}){const{peerId:r,multiaddrs:s}=iw(e);if(r!=null&&t.force!==
!0){const o=aw(r,this.connections.get(r),s);if(o!=null)return this.log("already connected to %a",o.remoteAddr),t.onProgress?.(
new B("dial-queue:already-connected",o)),o}const i=this.queue.queue.find(o=>{if(r?.equals(o.options.peerId)===!0)return!0;
const a=o.options.multiaddrs;if(a==null)return!1;for(const c of s)if(a.has(c.toString()))return!0;return!1});if(i!=null){
this.log("joining existing dial target for %p",r);for(const o of s)i.options.multiaddrs.add(o.toString());return t.onProgress?.(
new B("dial-queue:already-in-dial-queue")),i.join(t)}if(this.queue.size>=this.maxDialQueueLength)throw new ea("Dial queu\
e is full");return this.log("creating dial target for %p",r,s.map(o=>o.toString())),t.onProgress?.(new B("dial-queue:add\
-to-dial-queue")),this.queue.add(async o=>{o.onProgress?.(new B("dial-queue:start-dial"));const a=Ln([this.shutDownController.
signal,o.signal]);try{return await this.dialPeer(o,a)}finally{a.clear()}},{peerId:r,priority:t.priority??vw,multiaddrs:new Set(
s.map(o=>o.toString())),signal:t.signal??AbortSignal.timeout(this.dialTimeout),onProgress:t.onProgress})}async dialPeer(e,t){
const r=e.peerId,s=e.multiaddrs,i=new Set;let o=e.multiaddrs.size===0,a=0,c=0;const l=[];for(this.log("starting dial to \
%p",r);o||s.size>0;){c++,o=!1;const u=[],h=new Set(e.multiaddrs);s.clear(),this.log("calculating addrs to dial %p from %\
s",r,[...h]);const f=await this.calculateMultiaddrs(r,h,{...e,signal:t});for(const p of f){if(i.has(p.multiaddr.toString())){
this.log.trace("skipping previously failed multiaddr %a while dialing %p",p.multiaddr,r);continue}u.push(p)}this.log("%s\
 dial to %p with %s",c===1?"starting":"continuing",r,u.map(p=>p.multiaddr.toString())),e?.onProgress?.(new B("dial-queue\
:calculated-addresses",u));for(const p of u){if(a===this.maxPeerAddrsToDial)throw this.log("dialed maxPeerAddrsToDial (%\
d) addresses for %p, not trying any others",a,e.peerId),new ea("Peer had more than maxPeerAddrsToDial");a++;const A=Ln([
t,AbortSignal.timeout(this.addressDialTimeout)]);try{const y=await this.components.transportManager.dial(p.multiaddr,{...e,
signal:A});this.log("dial to %a succeeded",p.multiaddr);try{await this.components.peerStore.merge(y.remotePeer,{multiaddrs:[
y.remoteAddr],metadata:{[q$]:Nn(Date.now().toString())}})}catch(I){this.log.error("could not update last dial failure ke\
y for %p - %e",r,I)}return y}catch(y){if(this.log.error("dial failed to %a - %e",p.multiaddr,y),i.add(p.multiaddr.toString()),
r!=null)try{await this.components.peerStore.merge(r,{metadata:{[V$]:Nn(Date.now().toString())}})}catch(I){this.log.error(
"could not update last dial failure key for %p - %e",r,I)}if(t.aborted)throw new Rm(y.message);l.push(y)}finally{A.clear()}}}
throw l.length===1?l[0]:new AggregateError(l,"All multiaddr dials failed")}async calculateMultiaddrs(e,t=new Set,r={}){const s=[
...t].map(h=>({multiaddr:k(h),isCertified:!1}));if(e!=null){if(this.components.peerId.equals(e))throw new ea("Tried to d\
ial self");if(await this.components.connectionGater.denyDialPeer?.(e)===!0)throw new wp("The dial request is blocked by \
gater.allowDialPeer");if(s.length===0){this.log("loading multiaddrs for %p",e);try{const h=await this.components.peerStore.
get(e);s.push(...h.addresses),this.log("loaded multiaddrs for %p",e,s.map(({multiaddr:f})=>f.toString()))}catch(h){if(h.
name!=="NotFoundError")throw h}}if(s.length===0){this.log("looking up multiaddrs for %p in the peer routing",e);try{const h=await this.
components.peerRouting.findPeer(e,r);this.log("found multiaddrs for %p in the peer routing",e,s.map(({multiaddr:f})=>f.toString())),
s.push(...h.multiaddrs.map(f=>({multiaddr:f,isCertified:!1})))}catch(h){h.name==="NoPeerRoutersError"?this.log("no peer \
routers configured",e):this.log.error("looking up multiaddrs for %p in the peer routing failed - %e",e,h)}}}let i=(await Promise.
all(s.map(async h=>{const f=await ww(h.multiaddr,this.resolvers,{dns:this.components.dns,log:this.log,...r});return f.length===
1&&f[0].equals(h.multiaddr)?h:f.map(p=>({multiaddr:p,isCertified:!1}))}))).flat();if(e!=null){const h=`/p2p/${e.toString()}`;
i=i.map(f=>f.multiaddr.getComponents().pop()?.name!=="p2p"?{multiaddr:f.multiaddr.encapsulate(h),isCertified:f.isCertified}:
f)}const o=i.filter(h=>{if(this.components.transportManager.dialTransportForMultiaddr(h.multiaddr)==null)return!1;const f=h.
multiaddr.getComponents().findLast(p=>p.code===L)?.value;return e!=null&&f!=null?e.equals(f):!0}),a=new Map;for(const h of o){
const f=h.multiaddr.toString(),p=a.get(f);if(p!=null){p.isCertified=p.isCertified||h.isCertified||!1;continue}a.set(f,h)}
const c=[...a.values()];if(c.length===0)throw new c$(`The dial request has no valid addresses for peer: ${e?.toString()??
"unknown peer"}`);const l=[];for(const h of c)this.components.connectionGater.denyDialMultiaddr!=null&&await this.components.
connectionGater.denyDialMultiaddr(h.multiaddr)||l.push(h);const u=this.addressSorter==null?j$(l):l.sort(this.addressSorter);
if(u.length===0)throw new wp(`The connection gater denied all addresses in the dial request for peer: ${e?.toString()??"\
unknown peer"}`);return this.log.trace("addresses for %p before filtering",e??"unknown peer",i.map(({multiaddr:h})=>h.toString())),
this.log.trace("addresses for %p after filtering",e??"unknown peer",u.map(({multiaddr:h})=>h.toString())),u}async isDialable(e,t={}){
Array.isArray(e)||(e=[e]);try{const r=await this.calculateMultiaddrs(void 0,new Set(e.map(s=>s.toString())),t);return t.
runOnLimitedConnection===!1?r.find(s=>!ds.matches(s.multiaddr))!=null:!0}catch{}return!1}}const l3=Object.prototype.toString,
u3=n=>l3.call(n)==="[object Error]",h3=new Set(["network error","Failed to fetch","NetworkError when attempting to fetch\
 resource.","The Internet connection appears to be offline.","Network request failed","fetch failed","terminated"," A ne\
twork error occurred.","Network connection lost"]);function d3(n){if(!(n&&u3(n)&&n.name==="TypeError"&&typeof n.message==
"string"))return!1;const{message:t,stack:r}=n;return t==="Load failed"?r===void 0||"__sentry_captured__"in n:t.startsWith(
"error sending request for url")?!0:h3.has(t)}function f3(n){if(typeof n=="number"){if(n<0)throw new TypeError("Expected\
 `retries` to be a non-negative number.");if(Number.isNaN(n))throw new TypeError("Expected `retries` to be a valid numbe\
r or Infinity, got NaN.");if(Number.isFinite(n)&&!Number.isInteger(n))throw new TypeError("Expected `retries` to be a no\
n-negative integer or Infinity.")}else if(n!==void 0)throw new TypeError("Expected `retries` to be a number or Infinity.")}
function Co(n,e,{min:t=0,allowInfinity:r=!1}={}){if(e!==void 0){if(typeof e!="number"||Number.isNaN(e))throw new TypeError(
`Expected \`${n}\` to be a number${r?" or Infinity":""}.`);if(!r&&!Number.isFinite(e))throw new TypeError(`Expected \`${n}\
\` to be a finite number.`);if(e<t)throw new TypeError(`Expected \`${n}\` to be ≥ ${t}.`)}}function Cl(n,e){if(e!==void 0&&
typeof e!="function")throw new TypeError(`Expected \`${n}\` to be a function.`)}let p3=class extends Error{constructor(e){
super(),e instanceof Error?(this.originalError=e,{message:e}=e):(this.originalError=new Error(e),this.originalError.stack=
this.stack),this.name="AbortError",this.message=e}};function g3(n,e){const t=Math.max(1,n+1),r=e.randomize?Math.random()+
1:1;let s=Math.round(r*e.minTimeout*e.factor**(t-1));return s=Math.min(s,e.maxTimeout),s}function Io(n,e){return Number.
isFinite(e)?e-(performance.now()-n):e}async function m3(n,e){n<=0||await new Promise((t,r)=>{const s=()=>{clearTimeout(i),
e.signal?.removeEventListener("abort",s),r(e.signal.reason)},i=setTimeout(()=>{e.signal?.removeEventListener("abort",s),
t()},n);e.unref&&i.unref?.(),e.signal?.addEventListener("abort",s,{once:!0})})}async function b3({error:n,attemptNumber:e,
retriesConsumed:t,startTime:r,options:s}){const i=n instanceof Error?n:new TypeError(`Non-error was thrown: "${n}". You \
should only throw errors.`);if(i instanceof p3)throw i.originalError;const o=Number.isFinite(s.retries)?Math.max(0,s.retries-
t):s.retries,a=s.maxRetryTime??Number.POSITIVE_INFINITY,c=g3(t,s);if(Io(r,a)<=0){const d=Object.freeze({error:i,attemptNumber:e,
retriesLeft:o,retriesConsumed:t,retryDelay:0});throw await s.onFailedAttempt(d),i}const u=Object.freeze({error:i,attemptNumber:e,
retriesLeft:o,retriesConsumed:t,retryDelay:o>0?c:0}),h=await s.shouldConsumeRetry(u),f=h&&o>0?c:0,p=Object.freeze({error:i,
attemptNumber:e,retriesLeft:o,retriesConsumed:t,retryDelay:f});if(await s.onFailedAttempt(p),Io(r,a)<=0||Io(r,a)<=0||o<=
0||i instanceof TypeError&&!d3(i)||!await s.shouldRetry(p))throw i;const y=Io(r,a);if(y<=0)throw i;if(!h)return s.signal?.
throwIfAborted(),!1;const I=Math.min(f,y);return s.signal?.throwIfAborted(),await m3(I,s),s.signal?.throwIfAborted(),!0}
async function y3(n,e={}){if(e={...e},f3(e.retries),Object.hasOwn(e,"forever"))throw new Error("The `forever` option is \
no longer supported. For many use-cases, you can set `retries: Infinity` instead.");e.retries??=10,e.factor??=2,e.minTimeout??=
1e3,e.maxTimeout??=Number.POSITIVE_INFINITY,e.maxRetryTime??=Number.POSITIVE_INFINITY,e.randomize??=!1,e.onFailedAttempt??=
()=>{},e.shouldRetry??=()=>!0,e.shouldConsumeRetry??=()=>!0,Cl("onFailedAttempt",e.onFailedAttempt),Cl("shouldRetry",e.shouldRetry),
Cl("shouldConsumeRetry",e.shouldConsumeRetry),Co("factor",e.factor,{min:0,allowInfinity:!1}),Co("minTimeout",e.minTimeout,
{min:0,allowInfinity:!1}),Co("maxTimeout",e.maxTimeout,{min:0,allowInfinity:!0}),Co("maxRetryTime",e.maxRetryTime,{min:0,
allowInfinity:!0}),e.factor>0||(e.factor=1),e.signal?.throwIfAborted();let t=0,r=0;const s=performance.now();for(;!Number.
isFinite(e.retries)||r<=e.retries;){t++;try{e.signal?.throwIfAborted();const i=await n(t);return e.signal?.throwIfAborted(),
i}catch(i){await b3({error:i,attemptNumber:t,retriesConsumed:r,startTime:s,options:e})&&r++}}throw new Error("Retry atte\
mpts exhausted without throwing an error.")}class w3{log;queue;started;peerStore;retries;retryInterval;backoffFactor;connectionManager;events;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:reconnect-queue"),this.peerStore=e.peerStore,this.connectionManager=e.connectionManager,
this.queue=new Fh({concurrency:t.maxParallelReconnects??z$,metricName:"libp2p_reconnect_queue",metrics:e.metrics}),this.
started=!1,this.retries=t.retries??5,this.backoffFactor=t.backoffFactor,this.retryInterval=t.retryInterval,this.events=e.
events,e.events.addEventListener("peer:disconnect",r=>{this.maybeReconnect(r.detail).catch(s=>{this.log.error("failed to\
 maybe reconnect to %p - %e",r.detail,s)})})}async maybeReconnect(e){if(!this.started)return;const t=await this.peerStore.
get(e);Ap(t)&&(this.queue.has(e)||this.queue.add(async r=>{await y3(async s=>{if(this.started)try{await this.connectionManager.
openConnection(e,{signal:r?.signal})}catch(i){throw this.log("reconnecting to %p attempt %d of %d failed - %e",e,s,this.
retries,i),i}},{signal:r?.signal,retries:this.retries,factor:this.backoffFactor,minTimeout:this.retryInterval})},{peerId:e}).
catch(async r=>{this.log.error("failed to reconnect to %p - %e",e,r);const s={};[...t.tags.keys()].forEach(i=>{i.startsWith(
Eh)&&(s[i]=void 0)}),await this.peerStore.merge(e,{tags:s}),this.events.safeDispatchEvent("peer:reconnect-failure",{detail:e})}).
catch(async r=>{this.log.error("failed to remove keep-alive tag from %p - %e",e,r)}))}start(){this.started=!0}async afterStart(){
Promise.resolve().then(async()=>{const e=await this.peerStore.all({filters:[t=>Ap(t)]});await Promise.all(e.map(async t=>{
await this.connectionManager.openConnection(t.id).catch(r=>{this.log.error("could not open connection to keepalive peer \
- %e",r)})}))}).catch(e=>{this.log.error("error reconnect to peers after start - %e",e)})}stop(){this.started=!1,this.queue.
abort()}}function Ap(n){for(const e of n.tags.keys())if(e.startsWith(Eh))return!0;return!1}const vw=50,Il={maxConnections:K$,
inboundConnectionThreshold:O$,maxIncomingPendingConnections:B$};class v3{started;connections;allow;deny;maxIncomingPendingConnections;incomingPendingConnections;outboundPendingConnections;maxConnections;dialQueue;reconnectQueue;connectionPruner;inboundConnectionRateLimiter;peerStore;metrics;events;log;peerId;constructor(e,t={}){
if(this.maxConnections=t.maxConnections??Il.maxConnections,this.maxConnections<1)throw new P("Connection Manager maxConn\
ections must be greater than 0");this.connections=new Dr,this.started=!1,this.peerId=e.peerId,this.peerStore=e.peerStore,
this.metrics=e.metrics,this.events=e.events,this.log=e.logger.forComponent("libp2p:connection-manager"),this.onConnect=this.
onConnect.bind(this),this.onDisconnect=this.onDisconnect.bind(this),this.allow=(t.allow??[]).map(r=>qu(k(r))),this.deny=
(t.deny??[]).map(r=>qu(k(r))),this.incomingPendingConnections=0,this.maxIncomingPendingConnections=t.maxIncomingPendingConnections??
Il.maxIncomingPendingConnections,this.outboundPendingConnections=0,this.inboundConnectionRateLimiter=new cA({points:t.inboundConnectionThreshold??
Il.inboundConnectionThreshold,duration:1}),this.connectionPruner=new F$({connectionManager:this,peerStore:e.peerStore,events:e.
events,logger:e.logger},{allow:t.allow?.map(r=>k(r))}),this.dialQueue=new c3(e,{addressSorter:t.addressSorter,maxParallelDials:t.
maxParallelDials??fw,maxDialQueueLength:t.maxDialQueueLength??dw,maxPeerAddrsToDial:t.maxPeerAddrsToDial??hw,dialTimeout:t.
dialTimeout??cw,addressDialTimeout:t.addressDialTimeout??lw,resolvers:t.resolvers??{dnsaddr:yw},connections:this.connections}),
this.reconnectQueue=new w3({events:e.events,peerStore:e.peerStore,logger:e.logger,connectionManager:this},{retries:t.reconnectRetries,
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
"connection:close",this.onDisconnect),await Gm(this.dialQueue,this.reconnectQueue,this.connectionPruner),this.started=!0,
this.log("started")}async stop(){this.events.removeEventListener("connection:open",this.onConnect),this.events.removeEventListener(
"connection:close",this.onDisconnect),await jm(this.reconnectQueue,this.dialQueue,this.connectionPruner);const e=[];for(const t of this.
connections.values())for(const r of t)e.push(Promise.all([Vu(r,"close",{signal:AbortSignal.timeout(500)}),r.close({signal:AbortSignal.
timeout(500)})]).catch(s=>{r.abort(s)}));this.log("closing %d connections",e.length),await Promise.all(e),this.connections.
clear(),this.log("stopped")}getMaxConnections(){return this.maxConnections}setMaxConnections(e){if(e<1)throw new P("Conn\
ection Manager maxConnections must be greater than 0");let t=!1;e<this.maxConnections&&(t=!0),this.maxConnections=e,t&&this.
connectionPruner.maybePruneConnections()}onConnect(e){this._onConnect(e).catch(t=>{this.log.error("could not connect - %\
e",t)})}async _onConnect(e){const{detail:t}=e;if(!this.started){await t.close();return}if(t.status!=="open")return;const r=t.
remotePeer,s=!this.connections.has(r),i=this.connections.get(r)??[];i.push(t),this.connections.set(r,i),r.publicKey!=null&&
r.type==="RSA"&&await this.peerStore.patch(r,{publicKey:r.publicKey}),s&&this.events.safeDispatchEvent("peer:connect",{detail:t.
remotePeer})}onDisconnect(e){const{detail:t}=e,r=t.remotePeer,i=(this.connections.get(r)??[]).filter(o=>o.id!==t.id);this.
connections.set(r,i),i.length===0&&(this.log.trace("peer %p disconnected, removing connection map entry",r),this.connections.
delete(r),this.events.safeDispatchEvent("peer:disconnect",{detail:r}))}getConnections(e){if(e!=null)return this.connections.
get(e)??[];let t=[];for(const r of this.connections.values())t=t.concat(r);return t}getConnectionsMap(){return this.connections}async openConnection(e,t={}){
if(!this.started)throw new vi("Not started");this.outboundPendingConnections++;try{t.signal?.throwIfAborted(),t?.onProgress?.(
new B("connection:open",e));const{peerId:r,multiaddrs:s}=iw(e);if(this.peerId.equals(r))throw new Nm("Can not dial self");
if(r!=null&&t.force!==!0){this.log("dial %p",r);const c=aw(r,this.getConnections(r),s);if(c!=null)return this.log("had a\
n existing connection to %p as %a",r,c.remoteAddr),t.onProgress?.(new B("dial-queue:already-connected")),t.onProgress?.(
new B("connection:opened",c)),c}const i=await this.dialQueue.dial(e,{...t,priority:t.priority??vw});if(i.status!=="open")
throw new cu("Remote closed connection during opening");let o=this.connections.get(i.remotePeer);o==null&&(o=[],this.connections.
set(i.remotePeer,o));let a=!1;for(const c of o)if(c.id===i.id&&(a=!0),t.force!==!0&&c.id!==i.id&&c.remoteAddr.equals(i.remoteAddr))
return i.abort(new uc("Duplicate multiaddr connection")),c;return a||o.push(i),t.onProgress?.(new B("connection:opened",
i)),i}finally{this.outboundPendingConnections--}}async openStream(e,t,r={}){return(await this.openConnection(e,r)).newStream(
t,r)}async closeConnections(e,t={}){const r=this.connections.get(e)??[];await Promise.all(r.map(async s=>{try{await Promise.
all([Vu(s,"close",t),s.close(t)])}catch(i){s.abort(i)}}))}acceptIncomingConnection(e){if(this.deny.some(s=>{if(gt(e.remoteAddr)){
const i=ee(e.remoteAddr);return s.contains(i.host)}return!1}))return this.log("connection from %a refused - connection r\
emote address was in deny list",e.remoteAddr),!1;if(this.allow.some(s=>{if(gt(e.remoteAddr)){const i=ee(e.remoteAddr);return s.
contains(i.host)}return!0}))return this.incomingPendingConnections++,!0;if(this.incomingPendingConnections===this.maxIncomingPendingConnections)
return this.log("connection from %a refused - incomingPendingConnections exceeded by host",e.remoteAddr),!1;if(gt(e.remoteAddr)){
const s=ee(e.remoteAddr);try{this.inboundConnectionRateLimiter.consume(s.host,1)}catch{return this.log("connection from \
%a refused - inboundConnectionThreshold exceeded by host %s",e.remoteAddr,s.host),!1}}return this.getConnections().length<
this.maxConnections?(this.incomingPendingConnections++,!0):(this.log("connection from %a refused - maxConnections exceed\
ed",e.remoteAddr),!1)}afterUpgradeInbound(){this.incomingPendingConnections--}getDialQueue(){const e={queued:"queued",running:"\
active",errored:"error",complete:"success"};return this.dialQueue.queue.queue.map(t=>({id:t.id,status:e[t.status],peerId:t.
options.peerId,multiaddrs:[...t.options.multiaddrs].map(r=>k(r))}))}async isDialable(e,t={}){return this.dialQueue.isDialable(
e,t)}}const S3=1e4,A3="1.0.0",E3="ping",_3="ipfs",Ep=32,x3=!0;class C3{protocol;components;log;heartbeatInterval;pingIntervalMs;abortController;timeout;abortConnectionOnPingFailure;constructor(e,t={}){
this.components=e,this.protocol=`/${t.protocolPrefix??_3}/${E3}/${A3}`,this.log=e.logger.forComponent("libp2p:connection\
-monitor"),this.pingIntervalMs=t.pingInterval??S3,this.abortConnectionOnPingFailure=t.abortConnectionOnPingFailure??x3,this.
timeout=new x1({...t.pingTimeout??{},metrics:e.metrics,metricName:"libp2p_connection_monitor_ping_time_milliseconds"})}[Symbol.
toStringTag]="@libp2p/connection-monitor";[rt]=["@libp2p/connection-monitor"];start(){this.abortController=new AbortController,
this.abortController.signal,this.heartbeatInterval=setInterval(()=>{this.components.connectionManager.getConnections().forEach(
e=>{Promise.resolve().then(async()=>{let t=Date.now();const r=this.timeout.getTimeoutSignal({signal:this.abortController?.
signal});let s;try{s=await e.newStream(this.protocol,{signal:r,runOnLimitedConnection:!0});const i=rS(s);t=Date.now(),await Promise.
all([i.write(crypto.getRandomValues(new Uint8Array(Ep)),{signal:r}),i.read({bytes:Ep,signal:r})]),e.rtt=Date.now()-t,await s.
close({signal:r})}catch(i){if(s?.abort(i),i.name!=="UnsupportedProtocolError")throw i;e.rtt=(Date.now()-t)/2}finally{this.
timeout.cleanUp(r)}}).catch(t=>{this.log.error("error during heartbeat - %e",t),this.abortConnectionOnPingFailure?(this.
log.error("aborting connection due to ping failure"),e.abort(t)):this.log("connection ping failed, but not aborting due \
to abortConnectionOnPingFailure flag")})})},this.pingIntervalMs)}stop(){this.abortController?.abort(),this.heartbeatInterval!=
null&&clearInterval(this.heartbeatInterval)}}class I3{routers;started;components;constructor(e,t){this.routers=t.routers??
[],this.started=!1,this.components=e,this.findProviders=e.metrics?.traceFunction("libp2p.contentRouting.findProviders",this.
findProviders.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,cid:r.toString()}),getAttributesFromYieldedValue:(r,s)=>({
...s,providers:[...Array.isArray(s.providers)?s.providers:[],r.id.toString()]})})??this.findProviders,this.provide=e.metrics?.
traceFunction("libp2p.contentRouting.provide",this.provide.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,
cid:r.toString()})})??this.provide,this.cancelReprovide=e.metrics?.traceFunction("libp2p.contentRouting.cancelReprovide",
this.cancelReprovide.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,cid:r.toString()})})??this.cancelReprovide,
this.put=e.metrics?.traceFunction("libp2p.contentRouting.put",this.put.bind(this),{optionsIndex:2,getAttributesFromArgs:([
r])=>({key:at(r,"base36")})})??this.put,this.get=e.metrics?.traceFunction("libp2p.contentRouting.get",this.get.bind(this),
{optionsIndex:1,getAttributesFromArgs:([r])=>({key:at(r,"base36")})})??this.get}[Symbol.toStringTag]="@libp2p/content-ro\
uting";isStarted(){return this.started}async start(){this.started=!0}async stop(){this.started=!1}async*findProviders(e,t={}){
if(this.routers.length===0)throw new _l("No content routers available");const r=this,s=new sr;for await(const i of lu(...r.
routers.filter(o=>o.findProviders instanceof Function).map(o=>o.findProviders(e,t))))i!=null&&(i.multiaddrs.length>0&&await this.
components.peerStore.merge(i.id,{multiaddrs:i.multiaddrs},t),!s.has(i.id)&&(s.add(i.id),yield i))}async provide(e,t={}){
if(this.routers.length===0)throw new _l("No content routers available");await Promise.all(this.routers.filter(r=>r.provide instanceof
Function).map(async r=>{await r.provide(e,t)}))}async cancelReprovide(e,t={}){if(this.routers.length===0)throw new _l("N\
o content routers available");await Promise.all(this.routers.filter(r=>r.cancelReprovide instanceof Function).map(async r=>{
await r.cancelReprovide(e,t)}))}async put(e,t,r){if(!this.isStarted())throw new vi;await Promise.all(this.routers.filter(
s=>s.put instanceof Function).map(async s=>{await s.put(e,t,r)}))}async get(e,t){if(!this.isStarted())throw new vi;return Promise.
any(this.routers.filter(r=>r.get instanceof Function).map(async r=>r.get(e,t)))}}class T3{log;peerId;peerStore;routers;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:peer-routing"),this.peerId=e.peerId,this.peerStore=e.peerStore,this.routers=t.routers??
[],this.findPeer=e.metrics?.traceFunction("libp2p.peerRouting.findPeer",this.findPeer.bind(this),{optionsIndex:1,getAttributesFromArgs:([
r],s)=>({...s,peer:r.toString()})})??this.findPeer,this.getClosestPeers=e.metrics?.traceFunction("libp2p.peerRouting.get\
ClosestPeers",this.getClosestPeers.bind(this),{optionsIndex:1,getAttributesFromArgs:([r],s)=>({...s,key:at(r,"base36")}),
getAttributesFromYieldedValue:(r,s)=>({...s,peers:[...Array.isArray(s.peers)?s.peers:[],r.id.toString()]})})??this.getClosestPeers}[Symbol.
toStringTag]="@libp2p/peer-routing";async findPeer(e,t){if(this.routers.length===0)throw new yp("No peer routers availab\
le");if(e.toString()===this.peerId.toString())throw new r$("Should not try to find self");const r=this,s=lu(...this.routers.
filter(i=>i.findPeer instanceof Function).map(i=>(async function*(){try{yield await i.findPeer(e,t)}catch(o){r.log.error(
"router failed to find peer - %e",o)}})()));for await(const i of s)if(i!=null)return i.multiaddrs.length>0&&await this.peerStore.
merge(i.id,{multiaddrs:i.multiaddrs},t),i;throw new au}async*getClosestPeers(e,t={}){if(this.routers.length===0)throw new yp(
"No peer routers available");const r=this,s=Si(1024);for await(const i of sS((async function*(){const o=lu(...r.routers.
filter(a=>a.getClosestPeers instanceof Function).map(a=>a.getClosestPeers(e,t)));for await(let a of o)yield async()=>{if(a.
multiaddrs.length===0)try{a=await r.findPeer(a.id,{...t,useCache:!1})}catch(c){r.log.error("could not find peer multiadd\
rs - %e",c);return}return a}})()))i!=null&&(i.multiaddrs.length>0&&await this.peerStore.merge(i.id,{multiaddrs:i.multiaddrs},
t),!s.has(i.id.toMultihash().bytes)&&(s.add(i.id.toMultihash().bytes),yield i))}}class D3 extends ue{peerRouting;log;walking;walkers;shutdownController;walkController;needNext;constructor(e){
super(),this.log=e.logger.forComponent("libp2p:random-walk"),this.peerRouting=e.peerRouting,this.walkers=0,this.walking=
!1,this.shutdownController=new AbortController,this.shutdownController.signal}[Symbol.toStringTag]="@libp2p/random-walk";start(){
this.shutdownController=new AbortController,this.shutdownController.signal}stop(){this.shutdownController.abort()}async*walk(e){
this.walking||this.startWalk(),this.walkers++;const t=Ln([this.shutdownController.signal,e?.signal]);try{for(;;)this.needNext?.
resolve(),this.needNext=$m(),yield(await Vu(this,"walk:peer",{signal:t,rejectionEvents:["walk:error"]})).detail}catch(r){
throw r.detail!=null?r.detail:r}finally{t.clear(),this.walkers--,this.walkers===0&&(this.walkController?.abort(),this.walkController=
void 0)}}startWalk(){this.walking=!0,this.walkController=new AbortController,this.walkController.signal;const e=Ln([this.
walkController.signal,this.shutdownController.signal]),t=Date.now();let r=0;Promise.resolve().then(async()=>{for(this.log(
"start walk");this.walkers>0;)try{const s=crypto.getRandomValues(new Uint8Array(32));let i=Date.now();for await(const o of this.
peerRouting.getClosestPeers(s,{signal:e}))e.aborted&&this.log("aborting walk"),e.throwIfAborted(),this.log("found peer %\
p after %dms for %d walkers",o.id,Date.now()-i,this.walkers),r++,this.safeDispatchEvent("walk:peer",{detail:o}),this.walkers===
1&&this.needNext!=null&&(this.log("wait for need next"),await Dt(this.needNext.promise,e)),i=Date.now();this.log("walk i\
teration for %b and %d walkers finished, found %d peers",s,this.walkers,r)}catch(s){this.log.error("random walk errored \
- %e",s),this.safeDispatchEvent("walk:error",{detail:s})}this.log("no walkers left, ended walk")}).catch(s=>{this.log.error(
"random walk errored - %e",s)}).finally(()=>{this.log("finished walk, found %d peers after %dms",r,Date.now()-t),this.walking=
!1})}}const Sw=32,Aw=64;class P3{log;topologies;handlers;components;middleware;globalMiddleware=[];constructor(e){this.components=
e,this.log=e.logger.forComponent("libp2p:registrar"),this.middleware=new Map,this.topologies=new Map,e.metrics?.registerMetricGroup(
"libp2p_registrar_topologies",{calculate:()=>{const t={};for(const[r,s]of this.topologies)t[r]=s.size;return t}}),this.handlers=
Qt({name:"libp2p_registrar_protocol_handlers",metrics:e.metrics}),this._onDisconnect=this._onDisconnect.bind(this),this.
_onPeerUpdate=this._onPeerUpdate.bind(this),this._onPeerIdentify=this._onPeerIdentify.bind(this),this.components.events.
addEventListener("peer:disconnect",this._onDisconnect),this.components.events.addEventListener("peer:update",this._onPeerUpdate),
this.components.events.addEventListener("peer:identify",this._onPeerIdentify)}[Symbol.toStringTag]="@libp2p/registrar";getProtocols(){
return Array.from(new Set([...this.handlers.keys()])).sort()}getHandler(e){const t=this.handlers.get(e);if(t==null)throw new s$(
`No handler registered for protocol ${e}`);return t}getTopologies(e){const t=this.topologies.get(e);return t==null?[]:[...t.
values()]}async handle(e,t,r){if(this.handlers.has(e)&&r?.force!==!0)throw new i$(`Handler already registered for protoc\
ol ${e}`);this.handlers.set(e,{handler:t,options:{maxInboundStreams:Sw,maxOutboundStreams:Aw,...r}}),await this.components.
peerStore.merge(this.components.peerId,{protocols:[e]},r)}async unhandle(e,t){(Array.isArray(e)?e:[e]).forEach(s=>{this.
handlers.delete(s)}),await this.components.peerStore.patch(this.components.peerId,{protocols:this.getProtocols()},t)}async register(e,t){
if(t==null)throw new P("invalid topology");const r=`${(Math.random()*1e9).toString(36)}${Date.now()}`;let s=this.topologies.
get(e);return s==null&&(s=new Map,this.topologies.set(e,s)),s.set(r,t),r}unregister(e){for(const[t,r]of this.topologies.
entries())r.has(e)&&(r.delete(e),r.size===0&&this.topologies.delete(t))}use(e,t){if(typeof e=="function"){this.globalMiddleware.
push(e);return}if(t==null)throw new P("Protocol middleware is required");this.middleware.set(e,t)}unuse(e){typeof e=="fu\
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
this.log.error("could not inform topologies of updated peer after identify %p - %e",s,i)}}}class M3{log;components;transports;listeners;faultTolerance;started;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:transports"),this.components=e,this.started=!1,this.transports=Qt({name:"libp2p_t\
ransport_manager_transports",metrics:this.components.metrics}),this.listeners=Qt({name:"libp2p_transport_manager_listene\
rs",metrics:this.components.metrics}),this.faultTolerance=t.faultTolerance??vn.FATAL_ALL}[Symbol.toStringTag]="@libp2p/t\
ransport-manager";add(e){const t=e[Symbol.toStringTag];if(t==null)throw new P("Transport must have a valid tag");if(this.
transports.has(t))throw new P(`There is already a transport with the tag ${t}`);this.log("adding transport %s",t),this.transports.
set(t,e),this.listeners.has(t)||this.listeners.set(t,[])}isStarted(){return this.started}start(){this.started=!0}async afterStart(){
const e=this.components.addressManager.getListenAddrs();await this.listen(e)}async stop(){const e=[];for(const[t,r]of this.
listeners)for(this.log("closing listeners for %s",t);r.length>0;){const s=r.pop();s!=null&&e.push(s.close())}await Promise.
all(e),this.log("all listeners closed");for(const t of this.listeners.keys())this.listeners.set(t,[]);this.started=!1}async dial(e,t){
const r=this.dialTransportForMultiaddr(e);if(r==null)throw new h$(`No transport available for address ${String(e)}`);return t?.
onProgress?.(new B("transport-manager:selected-transport",r[Symbol.toStringTag])),r.dial(e,{...t,upgrader:this.components.
upgrader})}getAddrs(){let e=[];for(const t of this.listeners.values())for(const r of t)e=[...e,...r.getAddrs()];return e}getTransports(){
return Array.of(...this.transports.values())}getListeners(){return Array.of(...this.listeners.values()).flat()}dialTransportForMultiaddr(e){
for(const t of this.transports.values())if(t.dialFilter([e]).length>0)return t}listenTransportForMultiaddr(e){for(const t of this.
transports.values())if(t.listenFilter([e]).length>0)return t}async listen(e){if(!this.isStarted())throw new vi("Not star\
ted");if(e==null||e.length===0){this.log("no addresses were provided for listening, this node is dial only");return}const t={
errors:new Map,ipv4:{success:0,attempts:0},ipv6:{success:0,attempts:0}};e.forEach(i=>{t.errors.set(i.toString(),new o$)});
const r=[];for(const[i,o]of this.transports.entries()){const a=o.listenFilter(e);for(const c of a){this.log("creating li\
stener for %s on %a",i,c);const l=o.createListener({upgrader:this.components.upgrader});let u=this.listeners.get(i)??[];
u==null&&(u=[],this.listeners.set(i,u)),u.push(l),l.addEventListener("listening",()=>{this.components.events.safeDispatchEvent(
"transport:listening",{detail:l})}),l.addEventListener("close",()=>{const h=u.findIndex(f=>f===l);u.splice(h,1),this.components.
events.safeDispatchEvent("transport:close",{detail:l})}),Zd.matches(c)?t.ipv4.attempts++:ef.matches(c)&&t.ipv6.attempts++,
r.push(l.listen(c).then(()=>{t.errors.delete(c.toString()),Zd.matches(c)&&t.ipv4.success++,ef.matches(c)&&t.ipv6.success++},
h=>{throw this.log.error("transport %s could not listen on address %a - %e",i,c,h),t.errors.set(c.toString(),h),h}))}}const s=await Promise.
allSettled(r);if(!(s.length>0&&s.every(i=>i.status==="fulfilled"))){if(this.ipv6Unsupported(t)){this.log("all IPv4 addre\
sses succeed but all IPv6 failed");return}if(this.faultTolerance===vn.NO_FATAL){this.log("failed to listen on any addres\
s but fault tolerance allows this");return}throw new a$(`Some configured addresses failed to be listened on, you may nee\
d to remove one or more listen addresses from your configuration or set \`transportManager.faultTolerance\` to NO_FATAL:
${[...t.errors.entries()].map(([i,o])=>`
  ${i}: ${`${$3(o)}`.split(`
`).join(`
  `)}
`).join("")}`)}}ipv6Unsupported(e){if(e.ipv4.attempts===0||e.ipv6.attempts===0)return!1;const t=e.ipv4.attempts===e.ipv4.
success,r=e.ipv6.success===0;return t&&r}async remove(e){const t=this.listeners.get(e)??[];this.log.trace("removing tran\
sport %s",e);const r=[];for(this.log.trace("closing listeners for %s",e);t.length>0;){const s=t.pop();s!=null&&r.push(s.
close())}await Promise.all(r),this.transports.delete(e),this.listeners.delete(e)}async removeAll(){const e=[];for(const t of this.
transports.keys())e.push(this.remove(t));await Promise.all(e)}}function $3(n){return n.stack!=null&&n.stack.trim()!==""?
n.stack:n.message!=null?n.message:n.toString()}const Jn="/multistream/1.0.0",Ew=1024;function Wu(n){if(n instanceof Uint8Array&&
n.constructor.name==="Uint8Array")return xp(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(
n))return xp(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function k3(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const _p=4096;function L3(n){const e=n.
length;if(e<=_p)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=_p));return t}function R3(n){return n?.buffer instanceof ArrayBuffer}function xp(n){return R3(n)?n:n.slice()}
function N3(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof Uint8Array||
(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===
0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=
256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;
for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError("Expect\
ed String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var F3=N3,U3=F3;let O3=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},B3=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return _w(this,e)}},
z3=class{decoders;constructor(e){this.decoders=e}or(e){return _w(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function _w(n,e){return new z3({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let V3=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new O3(e,t,r),this.decoder=new B3(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Pc({name:n,prefix:e,encode:t,decode:r}){return new V3(n,e,t,
r)}function ro({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=U3(t,n,r);return Pc({prefix:e,
name:n,encode:s,decode:o=>Wu(i(o))})}function q3(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function W3(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function K3(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function be({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=K3(r,s);return Pc(
{prefix:e,name:n,encode(o){return W3(o,r,t)},decode(o){return q3(o,i,t,n)}})}const G3=ro({prefix:"9",name:"base10",alphabet:"\
0123456789"}),j3=Object.freeze(Object.defineProperty({__proto__:null,base10:G3},Symbol.toStringTag,{value:"Module"})),H3=be(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),X3=be({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Q3=Object.freeze(Object.defineProperty({__proto__:null,
base16:H3,base16upper:X3},Symbol.toStringTag,{value:"Module"})),Y3=be({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
J3=Object.freeze(Object.defineProperty({__proto__:null,base2:Y3},Symbol.toStringTag,{value:"Module"})),xw=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),Z3=xw.reduce((n,e,t)=>(n[t]=e,n),[]),ek=xw.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function tk(n){return n.reduce((e,t)=>(e+=Z3[t],e),"")}function nk(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=ek[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const rk=Pc({prefix:"🚀",name:"\
base256emoji",encode:tk,decode:nk}),sk=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:rk},Symbol.toStringTag,
{value:"Module"})),ik=be({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
ok=be({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),ak=be(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),ck=be({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),lk=be({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),uk=be({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),hk=be({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),dk=be({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),fk=be({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),pk=Object.freeze(Object.defineProperty({__proto__:null,
base32:ik,base32hex:lk,base32hexpad:hk,base32hexpadupper:dk,base32hexupper:uk,base32pad:ak,base32padupper:ck,base32upper:ok,
base32z:fk},Symbol.toStringTag,{value:"Module"})),gk=ro({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),mk=ro({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
bk=Object.freeze(Object.defineProperty({__proto__:null,base36:gk,base36upper:mk},Symbol.toStringTag,{value:"Module"})),yk=ro(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),wk=ro({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),vk=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:yk,base58flickr:wk},Symbol.toStringTag,{value:"Module"})),Sk=be({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Ak=be({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Ek=be({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),_k=be({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),xk=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Sk,base64pad:Ak,base64url:Ek,base64urlpad:_k},Symbol.toStringTag,{value:"Module"})),Ck=be({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Ik=Object.freeze(Object.defineProperty({__proto__:null,base8:Ck},Symbol.
toStringTag,{value:"Module"})),Tk=Pc({prefix:"\0",name:"identity",encode:n=>L3(Wu(n)),decode:n=>Wu(k3(n))}),Dk=Object.freeze(
Object.defineProperty({__proto__:null,identity:Tk},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Cp={...Dk,...J3,...Ik,...j3,...Q3,...pk,...bk,...vk,...xk,...sk};function cn(n=0){return new Uint8Array(n)}function As(n=0){
return new Uint8Array(n)}function Cw(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}
const Ip=Cw("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Tl=Cw("asci\
i","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=As(n.
length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),Iw={utf8:Ip,"utf-8":Ip,hex:Cp.base16,latin1:Tl,ascii:Tl,
binary:Tl,...Cp};function jt(n,e="utf8"){const t=Iw[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${n}`)}function Pk(n,e="utf8"){const t=Iw[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(n).substring(1)}const Mk=jt(`
`);async function Ku(n,e){const r=(await n.read(e)).subarray();if(r.byteLength===0||r[r.length-1]!==Mk[0])throw new Q("M\
issing newline");return Pk(r).trimEnd()}async function Gu(n,e,t={}){if(e=Array.isArray(e)?[...e]:[e],e.length===0)throw new Error(
"At least one protocol must be specified");const r=n.log.newScope("mss:select"),s=ba(n,{...t,maxDataLength:Ew});for(let i=0;i<
e.length;i++){const o=e[i];let a;if(i===0){r.trace('write ["%s", "%s"]',Jn,o);const c=jt(`${Jn}
`),l=jt(`${o}
`);if(await s.writeV([c,l],t),r.trace("reading multistream-select header"),a=await Ku(s,t),r.trace('read "%s"',a),a!==Jn){
r.error("did not read multistream-select header from response");break}}else r.trace('write "%s"',o),await s.write(jt(`${o}\

`),t);if(r.trace("reading protocol response"),a=await Ku(s,t),r.trace('read "%s"',a),a===o)return r.trace('selected "%s"\
 after negotiation',a),s.unwrap(),o}throw new iS(`Protocol selection failed - could not negotiate ${e}`)}const $k=Math.pow(
2,7),kk=Math.pow(2,14),Lk=Math.pow(2,21),Rk=Math.pow(2,28),Nk=Math.pow(2,35),Fk=Math.pow(2,42),Uk=Math.pow(2,49),tt=128;
function Mc(n){if(n<$k)return 1;if(n<kk)return 2;if(n<Lk)return 3;if(n<Rk)return 4;if(n<Nk)return 5;if(n<Fk)return 6;if(n<
Uk)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");
return 8}function Ok(n,e,t=0){switch(Mc(n)){case 8:e[t++]=n&255|tt,n/=128;case 7:e[t++]=n&255|tt,n/=128;case 6:e[t++]=n&
255|tt,n/=128;case 5:e[t++]=n&255|tt,n/=128;case 4:e[t++]=n&255|tt,n>>>=7;case 3:e[t++]=n&255|tt,n>>>=7;case 2:e[t++]=n&
255|tt,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function Bk(n,e,t=0){switch(Mc(
n)){case 8:e.set(t++,n&255|tt),n/=128;case 7:e.set(t++,n&255|tt),n/=128;case 6:e.set(t++,n&255|tt),n/=128;case 5:e.set(t++,
n&255|tt),n/=128;case 4:e.set(t++,n&255|tt),n>>>=7;case 3:e.set(t++,n&255|tt),n>>>=7;case 2:e.set(t++,n&255|tt),n>>>=7;case 1:{
e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}function zk(n,e,t=0){return e==null&&(e=As(
Mc(n))),e instanceof Uint8Array?Ok(n,e,t):Bk(n,e,t)}function Vk(n){return n?.buffer instanceof ArrayBuffer}function qk(n){
if(Vk(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Tp(n,e){e==null&&(e=n.reduce(
(s,i)=>s+i.length,0));const t=As(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return qk(t)}function Wk(n,e){if(n===
e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const Tw=Symbol.
for("@achingbrain/uint8arraylist");function Dp(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function To(n){return!!n?.[Tw]}let Dw=class la{bufs;length;[Tw]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>
0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(
e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(To(r)){t+=
r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array\
 or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(To(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Dp(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=Dp(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(To(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Tp(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:Tp(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new la;return i.
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
c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=As(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=cn(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=cn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=cn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=As(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=cn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=cn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=cn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=cn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=cn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof la)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!Wk(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new la;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const Pw=1024*1024*4;let Kk=class extends Error{name="\
InvalidDataLengthError";code="ERR_MSG_DATA_TOO_LONG"};function Gk(n){return n[Symbol.asyncIterator]!=null}function Mw(n,e){
if(n.byteLength>e)throw new Kk("Message length too long")}const $c=n=>{const e=Mc(n),t=As(e);return zk(n,t),$c.bytes=e,t};
$c.bytes=0;function $w(n,e){e=e??{};const t=e.lengthEncoder??$c,r=e?.maxDataLength??Pw;function*s(i){Mw(i,r);const o=t(i.
byteLength);o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:yield*i}return Gk(n)?(async function*(){
for await(const i of n)yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}$w.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??
$c,r=e?.maxDataLength??Pw;return Mw(n,r),new Dw(t(n.byteLength),n)};var Pp;(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=
1]="DATA"})(Pp||(Pp={}));async function ju(n,e,t={}){e=Array.isArray(e)?e:[e];const r=n.log.newScope("mss:handle"),s=ba(
n,{...t,maxDataLength:Ew,maxLengthLength:2});for(;;){r.trace("reading incoming string");const i=await Ku(s,t);if(r.trace(
'read "%s"',i),i===Jn){r.trace('respond with "%s" for "%s"',Jn,i),await s.write(jt(`${Jn}
`),t),r.trace('responded with "%s" for "%s"',Jn,i);continue}if(e.includes(i))return r.trace('respond with "%s" for "%s"',
i,i),await s.write(jt(`${i}
`),t),r.trace('responded with "%s" for "%s"',i,i),s.unwrap(),i;if(i==="ls"){const o=new Dw(...e.map(a=>$w.single(jt(`${a}\

`))),jt(`
`));r.trace('respond with "%s" for %s',e,i),await s.write(o,t),r.trace('responded with "%s" for %s',e,i);continue}r.trace(
'respond with "na" for "%s"',i),await s.write(jt(`na
`),t),r('responded with "na" for "%s"',i)}}class jk extends ue{id;remoteAddr;remotePeer;direction;timeline;direct;multiplexer;encryption;limits;log;maConn;muxer;components;outboundStreamProtocolNegotiationTimeout;inboundStreamProtocolNegotiationTimeout;closeTimeout;constructor(e,t){
super(),this.components=e,this.id=t.id,this.remoteAddr=t.maConn.remoteAddr,this.remotePeer=t.remotePeer,this.direction=t.
direction??"outbound",this.timeline=t.maConn.timeline,this.encryption=t.cryptoProtocol,this.limits=t.limits,this.maConn=
t.maConn,this.log=t.maConn.log,this.outboundStreamProtocolNegotiationTimeout=t.outboundStreamProtocolNegotiationTimeout??
Fa,this.inboundStreamProtocolNegotiationTimeout=t.inboundStreamProtocolNegotiationTimeout??Fa,this.closeTimeout=t.closeTimeout??
uw,this.direct=ow(t.maConn.remoteAddr),this.onIncomingStream=this.onIncomingStream.bind(this),this.remoteAddr.getComponents().
find(r=>r.code===L)==null&&(this.remoteAddr=this.remoteAddr.encapsulate(`/p2p/${this.remotePeer}`)),t.muxer!=null&&(this.
multiplexer=t.muxer.protocol,this.muxer=t.muxer,this.muxer.addEventListener("stream",this.onIncomingStream)),this.maConn.
addEventListener("close",r=>{this.dispatchEvent(new dc(r.local,r.error))})}[Symbol.toStringTag]="Connection";[yS]=!0;get streams(){
return this.muxer?.streams??[]}get status(){return this.maConn.status}newStream=async(e,t={})=>{if(this.muxer==null)throw new ca(
"Connection is not multiplexed");if(this.muxer.status!=="open")throw new cu(`The connection muxer is "${this.muxer.status}\
" and not "open"`);if(this.maConn.status!=="open")throw new cu(`The connection is "${this.status}" and not "open"`);if(this.
limits!=null&&t?.runOnLimitedConnection!==!0)throw new Vd("Cannot open protocol stream on limited connection");Array.isArray(
e)||(e=[e]),t.onProgress?.(new B("connection:open-stream",{connection:this,protocols:e})),this.log.trace("starting new s\
tream for protocols %s",e);const r=await this.muxer.createStream({...t,protocol:e.length===1?e[0]:void 0});this.log.trace(
"started new stream %s for protocols %s",r.id,e);try{if(t.signal==null){r.log("no abort signal was passed while trying t\
o negotiate protocols %s falling back to default timeout",e);const c=AbortSignal.timeout(this.outboundStreamProtocolNegotiationTimeout);
t={...t,signal:c}}r.protocol===""?(r.log.trace("selecting protocol from protocols %s",e),r.protocol=await Gu(r,e,t),r.log(
"negotiated protocol %s",r.protocol)):r.log("pre-negotiated protocol %s",r.protocol);const s=Qk(r.protocol,this.components.
registrar,t),i=Mp(r.protocol,"outbound",this);if(i>s){const c=new Fm(`Too many outbound protocol streams for protocol "${r.
protocol}" - ${i}/${s}`);throw r.abort(c),c}await this.components.peerStore.merge(this.remotePeer,{protocols:[r.protocol]}),
this.components.metrics?.trackProtocolStream(r);const o=this.components.registrar.getMiddleware(r.protocol),a=await this.
runMiddlewareChain(r,this,o);return t.onProgress?.(new B("connection:opened-stream",{connection:this,stream:a})),a}catch(s){
throw r.status==="open"?r.abort(s):this.log.error("could not create new outbound stream on connection %s %a for protocol\
s %s - %e",this.direction==="inbound"?"from":"to",this.remoteAddr,e,s),s}};async onIncomingStream(e){const t=e.detail,r=AbortSignal.
timeout(this.inboundStreamProtocolNegotiationTimeout);t.log("start protocol negotiation, timing out after %dms",this.inboundStreamProtocolNegotiationTimeout);
try{if(t.protocol===""){const l=this.components.registrar.getProtocols();t.log.trace("selecting protocol from protocols \
%s",l),t.protocol=await ju(t,l,{signal:r}),t.log("negotiated protocol %s",t.protocol)}else t.log("pre-negotiated protoco\
l %s",t.protocol);const s=Xk(t.protocol,this.components.registrar);if(Mp(t.protocol,"inbound",this)>s)throw new oS(`Too \
many inbound protocol streams for protocol "${t.protocol}" - limit ${s}`);await this.components.peerStore.merge(this.remotePeer,
{protocols:[t.protocol]},{signal:r}),this.components.metrics?.trackProtocolStream(t);const{handler:o,options:a}=this.components.
registrar.getHandler(t.protocol);if(this.limits!=null&&a.runOnLimitedConnection!==!0)throw new Vd("Cannot open protocol \
stream on limited connection");const c=this.components.registrar.getMiddleware(t.protocol);c.push(async(l,u,h)=>{await o(
l,u),h(l,u)}),await this.runMiddlewareChain(t,this,c)}catch(s){t.abort(s)}}async runMiddlewareChain(e,t,r){for(let s=0;s<
r.length;s++){const i=r[s];e.log.trace("running middleware",s,i),await new Promise((o,a)=>{try{const c=i(e,t,(l,u)=>{e=l,
t=u,o()});c instanceof Promise&&c.catch(a)}catch(c){a(c)}}),e.log.trace("ran middleware",s,i)}return e}async close(e={}){
if(this.log("closing connection to %a",this.remoteAddr),e.signal==null){const t=AbortSignal.timeout(this.closeTimeout);e=
{...e,signal:t}}await this.muxer?.close(e),await this.maConn.close(e)}abort(e){this.muxer?.abort(e),this.maConn.abort(e)}}
function Hk(n,e){return new jk(n,e)}function Xk(n,e){try{const{options:t}=e.getHandler(n);if(t.maxInboundStreams!=null)return t.
maxInboundStreams}catch(t){if(t.name!=="UnhandledProtocolError")throw t}return Sw}function Qk(n,e,t={}){try{const{options:r}=e.
getHandler(n);if(r.maxOutboundStreams!=null)return r.maxOutboundStreams}catch(r){if(r.name!=="UnhandledProtocolError")throw r}
return t.maxOutboundStreams??Aw}function Mp(n,e,t){let r=0;return t.streams.forEach(s=>{s.direction===e&&s.protocol===n&&
r++}),r}class Yk{components;connectionEncrypters;streamMuxers;inboundUpgradeTimeout;inboundStreamProtocolNegotiationTimeout;outboundStreamProtocolNegotiationTimeout;events;metrics;connectionCloseTimeout;constructor(e,t){
this.components=e,this.connectionEncrypters=Qt({name:"libp2p_upgrader_connection_encrypters",metrics:this.components.metrics}),
t.connectionEncrypters.forEach(r=>{this.connectionEncrypters.set(r.protocol,r)}),this.streamMuxers=Qt({name:"libp2p_upgr\
ader_stream_multiplexers",metrics:this.components.metrics}),t.streamMuxers.forEach(r=>{this.streamMuxers.set(r.protocol,
r)}),this.inboundUpgradeTimeout=t.inboundUpgradeTimeout??U$,this.inboundStreamProtocolNegotiationTimeout=t.inboundStreamProtocolNegotiationTimeout??
Fa,this.outboundStreamProtocolNegotiationTimeout=t.outboundStreamProtocolNegotiationTimeout??Fa,this.connectionCloseTimeout=
t.connectionCloseTimeout??uw,this.events=e.events,this.metrics={dials:e.metrics?.registerCounterGroup("libp2p_connection\
_manager_dials_total"),errors:e.metrics?.registerCounterGroup("libp2p_connection_manager_dial_errors_total"),inboundErrors:e.
metrics?.registerCounterGroup("libp2p_connection_manager_dials_inbound_errors_total"),outboundErrors:e.metrics?.registerCounterGroup(
"libp2p_connection_manager_dials_outbound_errors_total")}}[Symbol.toStringTag]="@libp2p/upgrader";async shouldBlockConnection(e,...t){
const r=this.components.connectionGater[e];if(r==null)return;if(await r.apply(this.components.connectionGater,t)===!0)throw new l$(
`The multiaddr connection is blocked by gater.${e}`)}createInboundAbortSignal(e){return Ln([AbortSignal.timeout(this.inboundUpgradeTimeout),
e])}async upgradeInbound(e,t){let r=!1;const s=this.createInboundAbortSignal(t.signal);try{if(this.metrics.dials?.increment(
{inbound:!0}),r=this.components.connectionManager.acceptIncomingConnection(e),!r)throw new u$("Connection denied");await Dt(
this.shouldBlockConnection("denyInboundConnection",e),s),await this._performUpgrade(e,"inbound",{...t,signal:s})}catch(i){
throw this.metrics.errors?.increment({inbound:!0}),this.metrics.inboundErrors?.increment({[i.name??"Error"]:!0}),i}finally{
s.clear(),r&&this.components.connectionManager.afterUpgradeInbound()}}async upgradeOutbound(e,t){try{this.metrics.dials?.
increment({outbound:!0});const r=e.remoteAddr.getComponents().findLast(o=>o.code===L)?.value;let s;r!=null&&(s=Z(r),await Dt(
this.shouldBlockConnection("denyOutboundConnection",s,e),t.signal));let i="outbound";return t.initiator===!1&&(i="inboun\
d"),await this._performUpgrade(e,i,t)}catch(r){throw this.metrics.errors?.increment({outbound:!0}),this.metrics.outboundErrors?.
increment({[r.name??"Error"]:!0}),r}}async _performUpgrade(e,t,r){let s=e,i,o,a,c;const l=`${parseInt(String(Math.random()*
1e9)).toString(36)}${Date.now()}`;if(e.log=e.log.newScope(`${t}:${l}`),this.components.metrics?.trackMultiaddrConnection(
e),e.log.trace("starting the %s connection upgrade",t),r?.skipProtection!==!0){const h=this.components.connectionProtector;
h!=null&&(e.log("protecting the %s connection",t),s=await h.protect(s,r))}try{if(Jk(r)){if(r.remotePeer==null)throw new uc(
`${t} connection that skipped encryption must have a peer id`);c="native",i=r.remotePeer}else{const h=e.remoteAddr.getComponents().
findLast(p=>p.code===L)?.value;let f;if(h!=null&&(f=Z(h)),r?.onProgress?.(new B(`upgrader:encrypt-${t}-connection`)),{connection:s,
remotePeer:i,protocol:c,streamMuxer:o}=await(t==="inbound"?this._encryptInbound(s,{...r,remotePeer:f}):this._encryptOutbound(
s,{...r,remotePeer:f})),f!=null&&!f.equals(i)){const p=new Ah(`Expected remote peer ${f} but connected to ${i}`);throw e.
abort(p),p}}if(i.equals(this.components.peerId)){const h=new Nm("Can not dial self");throw e.abort(h),h}await this.shouldBlockConnection(
t==="inbound"?"denyInboundEncryptedConnection":"denyOutboundEncryptedConnection",i,e),r?.muxerFactory!=null?o=r.muxerFactory:
o==null&&this.streamMuxers.size>0&&(r?.onProgress?.(new B(`upgrader:multiplex-${t}-connection`)),o=await(t==="inbound"?this.
_multiplexInbound(s,this.streamMuxers,r):this._multiplexOutbound(s,this.streamMuxers,r)))}catch(h){throw e.log.error("fa\
iled to upgrade %s connection %s %a - %e",t,t==="inbound"?"from":"to",e.remoteAddr,h),h}o!=null&&(e.log("create muxer %s",
o.protocol),a=o.createStreamMuxer(s)),await this.shouldBlockConnection(t==="inbound"?"denyInboundUpgradedConnection":"de\
nyOutboundUpgradedConnection",i,e);const u=this._createConnection({id:l,cryptoProtocol:c,direction:t,maConn:e,stream:s,muxer:a,
remotePeer:i,limits:r?.limits,closeTimeout:this.connectionCloseTimeout});return u.log("successfully upgraded connection"),
u}_createConnection(e){const t=Hk(this.components,{...e,outboundStreamProtocolNegotiationTimeout:this.outboundStreamProtocolNegotiationTimeout,
inboundStreamProtocolNegotiationTimeout:this.inboundStreamProtocolNegotiationTimeout});return t.addEventListener("close",
()=>{this.events.safeDispatchEvent("connection:close",{detail:t})}),this.events.safeDispatchEvent("connection:open",{detail:t}),
t}async _encryptInbound(e,t){const r=Array.from(this.connectionEncrypters.keys());try{const s=await ju(e,r,t),i=this.connectionEncrypters.
get(s);if(i==null)throw new xo(`no crypto module found for ${s}`);return e.log("encrypting inbound connection using %s",
s),{...await i.secureInbound(e,t),protocol:s}}catch(s){throw new xo(s.message)}}async _encryptOutbound(e,t){const r=Array.
from(this.connectionEncrypters.keys());try{e.log.trace("selecting encrypter from %s",r);const s=await Gu(e,r,t),i=this.connectionEncrypters.
get(s);if(i==null)throw new xo(`no crypto module found for ${s}`);return e.log("encrypting outbound connection using %s",
s),{...await i.secureOutbound(e,t),protocol:s}}catch(s){throw new xo(s.message)}}async _multiplexOutbound(e,t,r){const s=Array.
from(t.keys());e.log("outbound selecting muxer %s",s);try{e.log.trace("selecting stream muxer from %s",s);const i=await Gu(
e,s,r),o=t.get(i);if(o==null)throw new ca(`No muxer configured for protocol "${i}"`);return e.log("selected %s as muxer \
protocol",i),o}catch(i){throw e.log.error("error multiplexing outbound connection - %e",i),new ca(String(i))}}async _multiplexInbound(e,t,r){
const s=Array.from(t.keys());e.log("inbound handling muxers %s",s);try{e.log.trace("selecting stream muxer from %s",s);const i=await ju(
e,s,r),o=t.get(i);if(o==null)throw new ca(`No muxer configured for protocol "${i}"`);return e.log("selected %s as muxer \
protocol",i),o}catch(i){throw e.log.error("error multiplexing inbound connection - %e",i),i}}getConnectionEncrypters(){return this.
connectionEncrypters}getStreamMuxers(){return this.streamMuxers}}function Jk(n){return n.skipEncryption===!0}const kw="3\
.5.1",Lw="js-libp2p";function Zk(n,e){return`${n??Lw}/${e??kw} browser/${globalThis.navigator.userAgent}`}class Rw extends ue{peerId;peerStore;contentRouting;peerRouting;metrics;services;logger;status;components;log;constructor(e){
super(),this.status="stopped";const t=new ue,r=t.dispatchEvent.bind(t);t.dispatchEvent=l=>{const u=r(l),h=this.dispatchEvent(
new CustomEvent(l.type,{detail:l.detail}));return u||h},this.peerId=e.peerId,this.logger=e.logger??wb(),this.log=this.logger.
forComponent("libp2p"),this.services={};const s=e.nodeInfo?.name??Lw,i=e.nodeInfo?.version??kw,o=this.components=m$({peerId:e.
peerId,privateKey:e.privateKey,nodeInfo:{name:s,version:i,userAgent:e.nodeInfo?.userAgent??Zk(s,i)},logger:this.logger,events:t,
datastore:e.datastore??new GM,connectionGater:S$(e.connectionGater),dns:e.dns});e.metrics!=null&&(this.metrics=this.configureComponent(
"metrics",e.metrics(this.components))),this.peerStore=this.configureComponent("peerStore",BM(o,{addressFilter:this.components.
connectionGater.filterMultiaddrForPeer,...e.peerStore})),o.events.addEventListener("peer:update",l=>{if(l.detail.previous==
null){const u={id:l.detail.peer.id,multiaddrs:l.detail.peer.addresses.map(h=>h.multiaddr)};o.events.safeDispatchEvent("p\
eer:discovery",{detail:u})}}),e.connectionProtector!=null&&this.configureComponent("connectionProtector",e.connectionProtector(
o)),this.components.upgrader=new Yk(this.components,{connectionEncrypters:(e.connectionEncrypters??[]).map((l,u)=>this.configureComponent(
`connection-encryption-${u}`,l(this.components))),streamMuxers:(e.streamMuxers??[]).map((l,u)=>this.configureComponent(`\
stream-muxers-${u}`,l(this.components))),inboundUpgradeTimeout:e.connectionManager?.inboundUpgradeTimeout,inboundStreamProtocolNegotiationTimeout:e.
connectionManager?.inboundStreamProtocolNegotiationTimeout,outboundStreamProtocolNegotiationTimeout:e.connectionManager?.
outboundStreamProtocolNegotiationTimeout,connectionCloseTimeout:e.connectionManager?.connectionCloseTimeout}),this.configureComponent(
"transportManager",new M3(this.components,e.transportManager)),this.configureComponent("connectionManager",new v3(this.components,
e.connectionManager)),e.connectionMonitor?.enabled!==!1&&this.configureComponent("connectionMonitor",new C3(this.components,
e.connectionMonitor)),this.configureComponent("registrar",new P3(this.components)),this.configureComponent("addressManag\
er",new e$(this.components,e.addresses));const a=(e.peerRouters??[]).map((l,u)=>this.configureComponent(`peer-router-${u}`,
l(this.components)));this.peerRouting=this.components.peerRouting=this.configureComponent("peerRouting",new T3(this.components,
{routers:a}));const c=(e.contentRouters??[]).map((l,u)=>this.configureComponent(`content-router-${u}`,l(this.components)));
if(this.contentRouting=this.components.contentRouting=this.configureComponent("contentRouting",new I3(this.components,{routers:c})),
this.configureComponent("randomWalk",new D3(this.components)),(e.peerDiscovery??[]).forEach((l,u)=>{this.configureComponent(
`peer-discovery-${u}`,l(this.components)).addEventListener("peer",f=>{this.#e(f)})}),e.transports?.forEach((l,u)=>{this.
components.transportManager.add(this.configureComponent(`transport-${u}`,l(this.components)))}),e.services!=null)for(const l of Object.
keys(e.services)){const u=e.services[l],h=u(this.components);if(h==null){this.log.error("service factory %s returned nul\
l or undefined instance",l);continue}this.services[l]=h,this.configureComponent(l,h),h[Wd]!=null&&(this.log("registering\
 service %s for content routing",l),c.push(h[Wd])),h[Kd]!=null&&(this.log("registering service %s for peer routing",l),a.
push(h[Kd])),h[ya]!=null&&(this.log("registering service %s for peer discovery",l),h[ya].addEventListener?.("peer",f=>{this.#e(
f)}))}b$(o)}configureComponent(e,t){return t==null&&this.log.error("component %s was null or undefined",e),this.components[e]=
t,t}async start(){if(this.status==="stopped"){this.status="starting",this.log("libp2p is starting");try{await this.components.
beforeStart?.(),await this.components.start(),await this.components.afterStart?.(),this.status="started",this.safeDispatchEvent(
"start",{detail:this}),this.log("libp2p has started with peer id %p",this.peerId)}catch(e){throw this.log.error("an erro\
r occurred starting libp2p - %e",e),this.status="started",await this.stop(),e}}}async stop(){this.status==="started"&&(this.
log("libp2p is stopping"),this.status="stopping",await this.components.beforeStop?.(),await this.components.stop(),await this.
components.afterStop?.(),this.status="stopped",this.safeDispatchEvent("stop",{detail:this}),this.log("libp2p has stopped"))}getConnections(e){
return this.components.connectionManager.getConnections(e)}getDialQueue(){return this.components.connectionManager.getDialQueue()}getPeers(){
const e=new sr;for(const t of this.components.connectionManager.getConnections())e.add(t.remotePeer);return Array.from(e)}async dial(e,t={}){
return this.components.connectionManager.openConnection(e,{priority:75,...t})}async dialProtocol(e,t,r={}){if(t==null)throw new P(
"no protocols were provided to open a stream");if(t=Array.isArray(t)?t:[t],t.length===0)throw new P("no protocols were p\
rovided to open a stream");return this.components.connectionManager.openStream(e,t,r)}getMultiaddrs(){return this.components.
addressManager.getAddresses()}getProtocols(){return this.components.registrar.getProtocols()}async hangUp(e,t={}){Sh(e)&&
(e=Z(e.getComponents().findLast(r=>r.code===L)?.value??"")),await this.components.connectionManager.closeConnections(e,t)}async getPublicKey(e,t={}){
if(this.log("getPublicKey %p",e),e.publicKey!=null)return e.publicKey;try{const o=await this.peerStore.get(e,t);if(o.id.
publicKey!=null)return o.id.publicKey}catch(o){if(o.name!=="NotFoundError")throw o}const r=Su([Nn("/pk/"),e.toMultihash().
bytes]),s=await this.contentRouting.get(r,t),i=await sx(e,s,t);return await this.peerStore.patch(e,{publicKey:i},t),i}async handle(e,t,r){
Array.isArray(e)||(e=[e]),await Promise.all(e.map(async s=>{await this.components.registrar.handle(s,t,r)}))}async unhandle(e,t){
Array.isArray(e)||(e=[e]),await Promise.all(e.map(async r=>{await this.components.registrar.unhandle(r,t)}))}async register(e,t,r){
return this.components.registrar.register(e,t,r)}unregister(e){this.components.registrar.unregister(e)}use(e,t){if(typeof e==
"function"){this.components.registrar.use(e);return}if(t==null)throw new P("Protocol middleware is required");this.components.
registrar.use(e,Array.isArray(t)?t:[t])}unuse(e){if(typeof e=="function"){this.components.registrar.unuse(e);return}this.
components.registrar.unuse(e)}async isDialable(e,t={}){return this.components.connectionManager.isDialable(e,t)}#e(e){const{
detail:t}=e;if(t.id.toString()===this.peerId.toString()){this.log.error("peer discovery mechanism discovered self");return}
this.components.peerStore.merge(t.id,{multiaddrs:t.multiaddrs}).catch(r=>{this.log.error("could not update multiaddrs of\
 discovered peer - %e",r)})}}async function e6(n={}){n.privateKey??=await nx();const e=new Rw({...await ix(n),peerId:Um(
n.privateKey)});return n.start!==!1&&await e.start(),e}const t6=["dial","dialProtocol","hangUp","handle","unhandle","get\
Multiaddrs","getProtocols"];function hV(n){return n==null?!1:n instanceof Rw?!0:t6.every(e=>typeof n[e]=="function")}const n6=[
wn,Pm,_m,xm,Cm];function $p(n){return Nw("sni",n)?.value}function kp(n){const e=Nw("tcp",n)?.value;return e==null?"":`:${e}`}
function Nw(n,e){return e.find(t=>t.name===n)}function Lp(n){return n.some(({code:e})=>e===ts)}function wt(n,e){const t=Fw[n.
name];if(t==null)throw new Error(`Can't interpret protocol ${n.name}`);const r=t(n,e);return n.code===as?`[${r}]`:r}const Fw={
ip4:(n,e)=>n.value,ip6:(n,e)=>e.length===0?n.value:`[${n.value}]`,tcp:(n,e)=>{const t=e.pop();if(t==null)throw new Error(
"Unexpected end of multiaddr");return`tcp://${wt(t,e)}:${n.value}`},udp:(n,e)=>{const t=e.pop();if(t==null)throw new Error(
"Unexpected end of multiaddr");return`udp://${wt(t,e)}:${n.value}`},dnsaddr:(n,e)=>n.value,dns4:(n,e)=>n.value,dns6:(n,e)=>n.
value,dns:(n,e)=>n.value,ipfs:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");return`${wt(
t,e)}`},p2p:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");return`${wt(t,e)}`},http:(n,e)=>{
const t=Lp(e),r=$p(e),s=kp(e);if(t&&r!=null)return`https://${r}${s}`;const i=t?"https://":"http://",o=e.pop();if(o==null)
throw new Error("Unexpected end of multiaddr");let a=wt(o,e);return a=a?.replace("tcp://",""),`${i}${a}`},"http-path":(n,e)=>{
const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");const r=wt(t,e),s=decodeURIComponent(n.value??
"");return`${r}${s}`},tls:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");return wt(t,
e)},sni:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");return wt(t,e)},https:(n,e)=>{
const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");let r=wt(t,e);return r=r?.replace("tcp://",""),
`https://${r}`},ws:(n,e)=>{const t=Lp(e),r=$p(e),s=kp(e);if(t&&r!=null)return`wss://${r}${s}`;const i=t?"wss://":"ws://",
o=e.pop();if(o==null)throw new Error("Unexpected end of multiaddr");let a=wt(o,e);return a=a?.replace("tcp://",""),`${i}${a}`},
wss:(n,e)=>{const t=e.pop();if(t==null)throw new Error("Unexpected end of multiaddr");let r=wt(t,e);return r=r?.replace(
"tcp://",""),`wss://${r}`}};function r6(n,e){const r=k(n).getComponents(),s=r.pop();if(s==null)throw new Error("Unexpect\
ed end of multiaddr");const i=Fw[s.name];if(i==null)throw new Error(`No interpreter found for ${s.name}`);let o=i(s,r)??
"";return n6.includes(s.code)&&(o=o.replace(/^.*:\/\//,""),s.value==="443"?o=`https://${o}`:o=`http://${o}`),(o.startsWith(
"http://")||o.startsWith("https://")||o.startsWith("ws://")||o.startsWith("wss://"))&&(o=new URL(o).toString(),o.endsWith(
"/")&&(o=o.substring(0,o.length-1))),o}let s6=class Uw extends Error{name="TimeoutError";constructor(e,t){super(e,t),Error.
captureStackTrace?.(this,Uw)}};const i6=n=>"reason"in n?n.reason:new DOMException("This operation was aborted.","AbortEr\
ror"),o6=2**31-1,a6=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(`Expected \`milliseconds\` to be \
a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!="function")return new TypeError(
"Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function c6(n,e){const{milliseconds:t,fallback:r,
message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{n.cancel?.()}catch{}},h=new Promise(
(f,p)=>{const A=()=>{p(i6(o)),l()},y=a6(t,i);try{y?p(y):o?.aborted?A():o&&(c=A,o.addEventListener("abort",c,{once:!0}))}finally{
n.then(f,p)}if(y||o?.aborted||t>o6)return;const I=r||s===!1||s instanceof Error?void 0:new s6(s??`Promise timed out afte\
r ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{f(r())}catch(d){p(d)}else s===!1?f():p(s instanceof Error?
s:I);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});return h.clear=()=>{a!==
void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const Ow=n=>typeof n=="function"?{filter:n}:{...n},l6=n=>n===1/0||Number.
isSafeInteger(n)&&n>=0,u6=[["addEventListener","removeEventListener"],["on","off"],["addListener","removeListener"]],h6=n=>{
for(const[e,t]of u6){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="function")return{addListener:r.bind(n),
removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},d6=n=>{const e=new Map;for(const[t,r]of n)for(const s of Array.
isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},f6=({addListener:n,removeListener:e,handlers:t,signal:r,abortHandler:s,isDone:i})=>{
r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){e(o,a);return}},p6=({removeListener:n,handlers:e,
signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener("abort",r)},g6=(n,e,t)=>{let r=Promise.resolve();
return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):!0}catch(a){e()||t(a);return}e()||i(o)})}};function m6(n,e,t){
let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=Ow(t);const{filter:l}=t;if(!l6(t.count))throw new TypeError("The `coun\
t` option should be at least 0 or more");if(typeof t.timeout=="number"&&!(t.timeout>0))throw new TypeError(`Expected the\
 \`timeout\` option to be a positive number, got \`${t.timeout}\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=h6(
n);if(t.count===0){a([]);return}const f=[],p=w=>{r(),c(w)},A=g6(l,()=>s,p),y=w=>{f.push(w),t.count===f.length&&(r(),a(f))},
I=(...w)=>{if(s)return;const b=t.multiArgs?w:w[0];if(!l){y(b);return}A(b,v=>{v&&y(b)})},d=(...w)=>{p(t.rejectionMultiArgs?
w:w[0])},m=()=>{p(t.signal.reason)},E={addListener:u,removeListener:h,handlers:d6([[e,I],[t.rejectionEvents??["error"],d]]),
signal:t.signal,abortHandler:m,isDone:()=>s};r=()=>{s=!0,clearTimeout(i),p6(E)},f6(E),!(s||!t.resolveImmediately)&&(Number.
isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(r,t.timeout)),a(f))});if(o.cancel=r,typeof t.timeout=="number"&&t.
timeout>0&&!t.resolveImmediately){const a=c6(o,{milliseconds:t.timeout});return a.cancel=()=>{r(),a.clear()},a}return o}
function b6(n,e,t){const r=m6(n,e,{...Ow(t),count:1,resolveImmediately:!1}),s=r.then(i=>i[0]);return s.cancel=r.cancel,s}
function y6(){throw new Error("WebSocket Servers can not be created in the browser!")}function w6(n=0){return new Uint8Array(
n)}function Hu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return Np(n);if(n instanceof ArrayBuffer)
return new Uint8Array(n);if(ArrayBuffer.isView(n))return Np(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error(
"Unknown type, must be binary type")}function v6(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(
t);return e}const Rp=4096;function S6(n){const e=n.length;if(e<=Rp)return String.fromCharCode.apply(String,n);let t="",r=0;
for(;r<e;)t+=String.fromCharCode.apply(String,n.subarray(r,r+=Rp));return t}function A6(n){return n?.buffer instanceof ArrayBuffer}
function Np(n){return A6(n)?n:n.slice()}function E6(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(
256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof
Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.
from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,
w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==
0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-
E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError(
"Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var _6=E6,x6=_6;let C6=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},I6=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Bw(this,e)}},
T6=class{decoders;constructor(e){this.decoders=e}or(e){return Bw(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Bw(n,e){return new T6({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let D6=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new C6(e,t,r),this.decoder=new I6(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function kc({name:n,prefix:e,encode:t,decode:r}){return new D6(n,e,t,
r)}function so({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=x6(t,n,r);return kc({prefix:e,
name:n,encode:s,decode:o=>Hu(i(o))})}function P6(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function M6(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function $6(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ye({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=$6(r,s);return kc(
{prefix:e,name:n,encode(o){return M6(o,r,t)},decode(o){return P6(o,i,t,n)}})}const k6=so({prefix:"9",name:"base10",alphabet:"\
0123456789"}),L6=Object.freeze(Object.defineProperty({__proto__:null,base10:k6},Symbol.toStringTag,{value:"Module"})),R6=ye(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),N6=ye({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),F6=Object.freeze(Object.defineProperty({__proto__:null,
base16:R6,base16upper:N6},Symbol.toStringTag,{value:"Module"})),U6=ye({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
O6=Object.freeze(Object.defineProperty({__proto__:null,base2:U6},Symbol.toStringTag,{value:"Module"})),zw=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),B6=zw.reduce((n,e,t)=>(n[t]=e,n),[]),z6=zw.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function V6(n){return n.reduce((e,t)=>(e+=B6[t],e),"")}function q6(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=z6[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const W6=kc({prefix:"🚀",name:"\
base256emoji",encode:V6,decode:q6}),K6=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:W6},Symbol.toStringTag,
{value:"Module"})),G6=ye({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
j6=ye({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),H6=ye(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),X6=ye({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Q6=ye({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Y6=ye({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),J6=ye({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Z6=ye({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),eL=ye({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),tL=Object.freeze(Object.defineProperty({__proto__:null,
base32:G6,base32hex:Q6,base32hexpad:J6,base32hexpadupper:Z6,base32hexupper:Y6,base32pad:H6,base32padupper:X6,base32upper:j6,
base32z:eL},Symbol.toStringTag,{value:"Module"})),nL=so({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),rL=so({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
sL=Object.freeze(Object.defineProperty({__proto__:null,base36:nL,base36upper:rL},Symbol.toStringTag,{value:"Module"})),iL=so(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),oL=so({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),aL=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:iL,base58flickr:oL},Symbol.toStringTag,{value:"Module"})),cL=ye({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),lL=ye({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),uL=ye({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),hL=ye({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),dL=Object.freeze(Object.defineProperty(
{__proto__:null,base64:cL,base64pad:lL,base64url:uL,base64urlpad:hL},Symbol.toStringTag,{value:"Module"})),fL=ye({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),pL=Object.freeze(Object.defineProperty({__proto__:null,base8:fL},Symbol.
toStringTag,{value:"Module"})),gL=kc({prefix:"\0",name:"identity",encode:n=>S6(Hu(n)),decode:n=>Hu(v6(n))}),mL=Object.freeze(
Object.defineProperty({__proto__:null,identity:gL},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Fp={...mL,...O6,...pL,...L6,...F6,...tL,...sL,...aL,...dL,...K6};function Vw(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const Up=Vw("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Dl=Vw("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=w6(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),bL={utf8:Up,"utf-8":Up,
hex:Fp.base16,latin1:Dl,ascii:Dl,binary:Dl,...Fp};function yL(n,e="utf8"){const t=bL[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function wL(n){return n.buffer instanceof ArrayBuffer}
function vL(n){return wL(n)?n:n.slice()}const SL=1024*1024*4,AL=10;class EL extends Nh{websocket;maxBufferedAmount;checkBufferedAmountTask;constructor(e){
super(e),this.websocket=e.websocket,this.maxBufferedAmount=e.maxBufferedAmount??SL,this.checkBufferedAmountTask=Sb(this.
checkBufferedAmount.bind(this),e.bufferedAmountPollInterval??AL),this.websocket.addEventListener("close",t=>{if(this.log(
'closed - code %d, reason "%s", wasClean %s',t.code,t.reason,t.wasClean),this.checkBufferedAmountTask.stop(),!t.wasClean){
this.onRemoteReset();return}this.onTransportClosed()},{once:!0}),this.websocket.addEventListener("message",t=>{try{let r;
if(typeof t.data=="string")r=yL(t.data);else if(t.data instanceof ArrayBuffer)r=new Uint8Array(t.data,0,t.data.byteLength);else{
this.abort(new Error("Incorrect binary type"));return}this.onData(r)}catch(r){this.log.error("error receiving data - %e",
r)}})}sendData(e){for(const r of e)this.websocket.send(vL(r));const t=this.websocket.bufferedAmount<this.maxBufferedAmount;
return t||this.checkBufferedAmountTask.start(),{sentBytes:e.byteLength,canSendMore:t}}sendReset(){this.websocket.close(1006)}async sendClose(e){
this.websocket.close(),e?.signal?.throwIfAborted()}sendPause(){}sendResume(){}checkBufferedAmount(){this.log("buffered a\
mount now %d",this.websocket.bufferedAmount),this.websocket.bufferedAmount===0&&(this.checkBufferedAmountTask.stop(),this.
safeDispatchEvent("drain"))}}function _L(n){return new EL(n)}class xL{log;init;logger;metrics;components;constructor(e,t={}){
this.log=e.logger.forComponent("libp2p:websockets"),this.logger=e.logger,this.components=e,this.init=t,e.metrics!=null&&
(this.metrics={dialerEvents:e.metrics.registerCounterGroup("libp2p_websockets_dialer_events_total",{label:"event",help:"\
Total count of WebSockets dialer events by type"})})}[xh]=!0;[Symbol.toStringTag]="@libp2p/websockets";[rt]=["@libp2p/tr\
ansport"];async dial(e,t){this.log("dialing %s",e),t=t??{};const r=_L({websocket:await this._connect(e,t),remoteAddr:e,metrics:this.
metrics?.dialerEvents,direction:"outbound",log:this.components.logger.forComponent("libp2p:websockets:connection"),maxBufferedAmount:this.
init.maxBufferedAmount,bufferedAmountPollInterval:this.init.bufferedAmountPollInterval});this.log("new outbound connecti\
on %s",r.remoteAddr);const s=await t.upgrader.upgradeOutbound(r,t);return this.log("outbound connection %s upgraded",r.remoteAddr),
s}async _connect(e,t){t?.signal?.throwIfAborted();const r=r6(e);this.log("create websocket connection to %s",r);const s=new WebSocket(
r);s.binaryType="arraybuffer";try{t.onProgress?.(new B("websockets:open-connection")),await b6(s,"open",t)}catch(i){if(t.
signal?.aborted)throw this.metrics?.dialerEvents.increment({abort:!0}),new Om(`Could not connect to ${r}`);this.metrics?.
dialerEvents.increment({error:!0});try{s.close()}catch{}throw i}return this.log("connected %s",e),this.metrics?.dialerEvents.
increment({connect:!0}),s}createListener(e){return y6({logger:this.logger,events:this.components.events,metrics:this.components.
metrics},{...this.init,...e})}listenFilter(e){return e.filter(t=>_i.exactMatch(t)||Sa.exactMatch(t))}dialFilter(e){return this.
listenFilter(e)}}function CL(n={}){return e=>new xL(e,n)}function ln(n=0){return new Uint8Array(n)}function Zt(n=0){return new Uint8Array(
n)}const IL=Math.pow(2,7),TL=Math.pow(2,14),DL=Math.pow(2,21),id=Math.pow(2,28),od=Math.pow(2,35),ad=Math.pow(2,42),cd=Math.
pow(2,49),W=128,De=127;function xt(n){if(n<IL)return 1;if(n<TL)return 2;if(n<DL)return 3;if(n<id)return 4;if(n<od)return 5;
if(n<ad)return 6;if(n<cd)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Coul\
d not encode varint");return 8}function qw(n,e,t=0){switch(xt(n)){case 8:e[t++]=n&255|W,n/=128;case 7:e[t++]=n&255|W,n/=
128;case 6:e[t++]=n&255|W,n/=128;case 5:e[t++]=n&255|W,n/=128;case 4:e[t++]=n&255|W,n>>>=7;case 3:e[t++]=n&255|W,n>>>=7;case 2:
e[t++]=n&255|W,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function PL(n,e,t=0){
switch(xt(n)){case 8:e.set(t++,n&255|W),n/=128;case 7:e.set(t++,n&255|W),n/=128;case 6:e.set(t++,n&255|W),n/=128;case 5:
e.set(t++,n&255|W),n/=128;case 4:e.set(t++,n&255|W),n>>>=7;case 3:e.set(t++,n&255|W),n>>>=7;case 2:e.set(t++,n&255|W),n>>>=
7;case 1:{e.set(t++,n&255),n>>>=7;break}default:throw new Error("unreachable")}return e}function Ww(n,e){let t=n[e],r=0;
if(r+=t&De,t<W||(t=n[e+1],r+=(t&De)<<7,t<W)||(t=n[e+2],r+=(t&De)<<14,t<W)||(t=n[e+3],r+=(t&De)<<21,t<W)||(t=n[e+4],r+=(t&
De)*id,t<W)||(t=n[e+5],r+=(t&De)*od,t<W)||(t=n[e+6],r+=(t&De)*ad,t<W)||(t=n[e+7],r+=(t&De)*cd,t<W))return r;throw new RangeError(
"Could not decode varint")}function ML(n,e){let t=n.get(e),r=0;if(r+=t&De,t<W||(t=n.get(e+1),r+=(t&De)<<7,t<W)||(t=n.get(
e+2),r+=(t&De)<<14,t<W)||(t=n.get(e+3),r+=(t&De)<<21,t<W)||(t=n.get(e+4),r+=(t&De)*id,t<W)||(t=n.get(e+5),r+=(t&De)*od,t<
W)||(t=n.get(e+6),r+=(t&De)*ad,t<W)||(t=n.get(e+7),r+=(t&De)*cd,t<W))return r;throw new RangeError("Could not decode var\
int")}function $L(n,e,t=0){return e==null&&(e=Zt(xt(n))),e instanceof Uint8Array?qw(n,e,t):PL(n,e,t)}function kL(n,e=0){
return n instanceof Uint8Array?Ww(n,e):ML(n,e)}function LL(n){return n.buffer instanceof ArrayBuffer}function Kw(n){return LL(
n)?n:n.slice()}const ld=new Float32Array([-0]),_n=new Uint8Array(ld.buffer);function RL(n,e,t){ld[0]=n,e[t]=_n[0],e[t+1]=
_n[1],e[t+2]=_n[2],e[t+3]=_n[3]}function NL(n,e){return _n[0]=n[e],_n[1]=n[e+1],_n[2]=n[e+2],_n[3]=n[e+3],ld[0]}const ud=new Float64Array(
[-0]),Pe=new Uint8Array(ud.buffer);function FL(n,e,t){ud[0]=n,e[t]=Pe[0],e[t+1]=Pe[1],e[t+2]=Pe[2],e[t+3]=Pe[3],e[t+4]=Pe[4],
e[t+5]=Pe[5],e[t+6]=Pe[6],e[t+7]=Pe[7]}function UL(n,e){return Pe[0]=n[e],Pe[1]=n[e+1],Pe[2]=n[e+2],Pe[3]=n[e+3],Pe[4]=n[e+
4],Pe[5]=n[e+5],Pe[6]=n[e+6],Pe[7]=n[e+7],ud[0]}const OL=BigInt(Number.MAX_SAFE_INTEGER),BL=BigInt(Number.MIN_SAFE_INTEGER);
let Kt=class qn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>
0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(
this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>
0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(
e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,
this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){
const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?
t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){if(e===0n)return hr;if(e<OL&&e>BL)return this.fromNumber(Number(
e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>Op&&(s=0n,++r>Op&&(r=0n))),new qn(Number(
s),Number(r))}static fromNumber(e){if(e===0)return hr;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&
(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),new qn(r,s)}static from(e){return typeof e=="number"?qn.
fromNumber(e):typeof e=="bigint"?qn.fromBigInt(e):typeof e=="string"?qn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?
new qn(e.low>>>0,e.high>>>0):hr}};const hr=new Kt(0,0);hr.toBigInt=function(){return 0n};hr.zzEncode=hr.zzDecode=function(){
return this};hr.length=function(){return 1};const Op=4294967296n;function zL(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=
n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function VL(n,e,t){
if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>
239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=
(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>
0&&s.push(String.fromCharCode.apply(String,i.slice(0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Gw(n,e,t){
const r=t;let s,i;for(let o=0;o<n.length;++o)s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&
64512)===55296&&((i=n.charCodeAt(o+1))&64512)===56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&
63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function vt(n,e){
return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function Do(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<
16|n[e-1]<<24)>>>0}let qL=class{buf;pos;len;_slice=Uint8Array.prototype.subarray;constructor(e){this.buf=Kw(e),this.pos=
0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.
pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))
return e;if((this.pos+=5)>this.len)throw this.pos=this.len,vt(this,10);return e}int32(){return this.uint32()|0}sint32(){
const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw vt(this,
4);return Do(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw vt(this,4);return Do(this.buf,this.pos+=4)|0}float(){
if(this.pos+4>this.len)throw vt(this,4);const e=NL(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)
throw vt(this,4);const e=UL(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,r=this.pos+
e;if(r>this.len)throw vt(this,e);return this.pos+=e,t===r?new Uint8Array(0):this.buf.subarray(t,r)}string(){const e=this.
bytes();return VL(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw vt(this,e);this.pos+=e}else do
if(this.pos>=this.len)throw vt(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.
skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(
e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){
const e=new Kt(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.
pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.
pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw vt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<
t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>
4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){
if(this.pos>=this.len)throw vt(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}
throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw vt(this,8);const e=Do(this.buf,this.pos+=
4),t=Do(this.buf,this.pos+=4);return new Kt(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.
readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().
toBigInt(!0)}uint64Number(){const e=Ww(this.buf,this.pos);return this.pos+=xt(e),e}uint64String(){return this.readLongVarint().
toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().
toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){
return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().
toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}};
function jw(n){return new qL(n instanceof Uint8Array?n:n.subarray())}function Hw(n,e,t){const r=jw(n);return e.decode(r,
void 0,t)}function Xu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return zp(n);if(n instanceof ArrayBuffer)
return new Uint8Array(n);if(ArrayBuffer.isView(n))return zp(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error(
"Unknown type, must be binary type")}function WL(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(
t);return e}const Bp=4096;function KL(n){const e=n.length;if(e<=Bp)return String.fromCharCode.apply(String,n);let t="",r=0;
for(;r<e;)t+=String.fromCharCode.apply(String,n.subarray(r,r+=Bp));return t}function GL(n){return n?.buffer instanceof ArrayBuffer}
function zp(n){return GL(n)?n:n.slice()}function jL(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(
256),s=0;s<r.length;s++)r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(
o+" is ambiguous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==
a&&(r[l]=i)}}var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof
Uint8Array||(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.
from(d))),!(d instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,
w=0,b=d.length;w!==b&&d[w]===0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==
0||_<E)&&S!==-1;S--,_++)x+=256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-
E;C!==v&&g[C]===0;)C++;for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError(
"Expected String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var HL=jL,XL=HL;let QL=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},YL=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Xw(this,e)}},
JL=class{decoders;constructor(e){this.decoders=e}or(e){return Xw(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Xw(n,e){return new JL({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let ZL=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new QL(e,t,r),this.decoder=new YL(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Lc({name:n,prefix:e,encode:t,decode:r}){return new ZL(n,e,t,
r)}function io({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=XL(t,n,r);return Lc({prefix:e,
name:n,encode:s,decode:o=>Xu(i(o))})}function e8(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function t8(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function n8(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function we({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=n8(r,s);return Lc(
{prefix:e,name:n,encode(o){return t8(o,r,t)},decode(o){return e8(o,i,t,n)}})}const r8=io({prefix:"9",name:"base10",alphabet:"\
0123456789"}),s8=Object.freeze(Object.defineProperty({__proto__:null,base10:r8},Symbol.toStringTag,{value:"Module"})),i8=we(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),o8=we({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),a8=Object.freeze(Object.defineProperty({__proto__:null,
base16:i8,base16upper:o8},Symbol.toStringTag,{value:"Module"})),c8=we({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
l8=Object.freeze(Object.defineProperty({__proto__:null,base2:c8},Symbol.toStringTag,{value:"Module"})),Qw=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),u8=Qw.reduce((n,e,t)=>(n[t]=e,n),[]),h8=Qw.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function d8(n){return n.reduce((e,t)=>(e+=u8[t],e),"")}function f8(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=h8[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const p8=Lc({prefix:"🚀",name:"\
base256emoji",encode:d8,decode:f8}),g8=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:p8},Symbol.toStringTag,
{value:"Module"})),m8=we({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
b8=we({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),y8=we(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),w8=we({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),v8=we({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),S8=we({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),A8=we({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),E8=we({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),_8=we({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),x8=Object.freeze(Object.defineProperty({__proto__:null,
base32:m8,base32hex:v8,base32hexpad:A8,base32hexpadupper:E8,base32hexupper:S8,base32pad:y8,base32padupper:w8,base32upper:b8,
base32z:_8},Symbol.toStringTag,{value:"Module"})),C8=io({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),I8=io({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
T8=Object.freeze(Object.defineProperty({__proto__:null,base36:C8,base36upper:I8},Symbol.toStringTag,{value:"Module"})),D8=io(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),P8=io({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),M8=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:D8,base58flickr:P8},Symbol.toStringTag,{value:"Module"})),$8=we({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),k8=we({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),L8=we({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),R8=we({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),N8=Object.freeze(Object.defineProperty(
{__proto__:null,base64:$8,base64pad:k8,base64url:L8,base64urlpad:R8},Symbol.toStringTag,{value:"Module"})),F8=we({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),U8=Object.freeze(Object.defineProperty({__proto__:null,base8:F8},Symbol.
toStringTag,{value:"Module"})),O8=Lc({prefix:"\0",name:"identity",encode:n=>KL(Xu(n)),decode:n=>Xu(WL(n))}),B8=Object.freeze(
Object.defineProperty({__proto__:null,identity:O8},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Vp={...B8,...l8,...U8,...s8,...a8,...x8,...T8,...M8,...N8,...g8};function Yw(n,e,t,r){return{name:n,prefix:e,encoder:{
name:n,prefix:e,encode:t},decoder:{decode:r}}}const qp=Yw("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().
encode(n.substring(1))),Pl=Yw("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},
n=>{n=n.substring(1);const e=Zt(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),z8={utf8:qp,"utf-8":qp,
hex:Vp.base16,latin1:Pl,ascii:Pl,binary:Pl,...Vp};function V8(n,e="utf8"){const t=z8[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function q8(n){let r,s=8192;return function(o){if(o<
1||o>4096)return Zt(o);s+o>8192&&(r=Zt(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Ys=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function Ml(){}let W8=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const K8=q8();function G8(n){return globalThis.Buffer!=null?
Zt(n):K8(n)}let Qu=class{len;head;tail;states;constructor(){this.len=0,this.head=new Ys(Ml,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Ys(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new H8((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
Po,10,Kt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Kt.fromBigInt(e);
return this._push(Po,t.length(),t)}uint64Number(e){return this._push(qw,xt(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Kt.fromBigInt(e).zzEncode();return this._push(Po,t.length(),t)}sint64Number(e){const t=Kt.fromNumber(e).zzEncode();
return this._push(Po,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push($l,1,e?1:0)}fixed32(e){
return this._push(Bs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Kt.fromBigInt(e);return this._push(Bs,
4,t.lo)._push(Bs,4,t.hi)}fixed64Number(e){const t=Kt.fromNumber(e);return this._push(Bs,4,t.lo)._push(Bs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(RL,4,e)}double(e){return this._push(FL,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push($l,1,0):this.uint32(t)._push(X8,t,e)}string(e){const t=zL(e);return t!==0?this.uint32(t)._push(
Gw,t,e):this._push($l,1,0)}fork(){return this.states=new W8(this),this.head=this.tail=new Ys(Ml,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Ys(Ml,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=G8(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function $l(n,e,t){e[t]=n&255}function j8(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let H8=class extends Ys{next;constructor(e,t){super(j8,e,t),this.next=void 0}};
function Po(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Bs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function X8(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(Qu.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(Q8,e,n),this},Qu.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(Y8,e,n),this});function Q8(n,e,t){e.set(n,t)}function Y8(n,e,t){n.length<40?Gw(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(V8(n),t)}function J8(){return new Qu}function Jw(n,e){const t=J8();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*Zw(n,e,t){const r=jw(n);yield*e.stream(r,void 0,".",t)}const e0={VARINT:0,LENGTH_DELIMITED:2};function t0(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function n0(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return t0("enum",e0.VARINT,t,r,s)}function r0(n,e,t){return t0("message",e0.LENGTH_DELIMITED,n,e,
t)}var Xe;(function(n){(function(o){o.FIN="FIN",o.STOP_SENDING="STOP_SENDING",o.RESET="RESET",o.FIN_ACK="FIN_ACK"})(n.Flag||
(n.Flag={}));let e;(function(o){o[o.FIN=0]="FIN",o[o.STOP_SENDING=1]="STOP_SENDING",o[o.RESET=2]="RESET",o[o.FIN_ACK=3]=
"FIN_ACK"})(e||(e={})),(function(o){o.codec=()=>n0(e)})(n.Flag||(n.Flag={}));let t;n.codec=()=>(t==null&&(t=r0((o,a,c={})=>{
c.lengthDelimited!==!1&&a.fork(),o.flag!=null&&(a.uint32(8),n.Flag.codec().encode(o.flag,a)),o.message!=null&&(a.uint32(
18),a.bytes(o.message)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){
const h=o.uint32();switch(h>>>3){case 1:{l.flag=n.Flag.codec().decode(o);break}case 2:{l.message=o.bytes();break}default:{
o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();
switch(h>>>3){case 1:{yield{field:`${c}.flag`,value:n.Flag.codec().decode(o)};break}case 2:{yield{field:`${c}.message`,value:o.
bytes()};break}default:{o.skipType(h&7);break}}}})),t);function r(o){return Jw(o,n.codec())}n.encode=r;function s(o,a){return Hw(
o,n.codec(),a)}n.decode=s;function i(o,a){return Zw(o,n.codec(),a)}n.stream=i})(Xe||(Xe={}));const Z8=["stun:stun.l.goog\
le.com:19302","stun:global.stun.twilio.com:3478","stun:stun.cloudflare.com:3478","stun:stun.services.mozilla.com:3478"];
Array.from("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");const e4=2*1024*1024,hd=16*1024,t4=hd,n4=10,
r4=8;function s4(n=hd){const e=xt(n-xt(n)),t=1+xt(Object.keys(Xe.Flag).length-1),r=1,s=n-e-t-r,i=xt(s);return e+t+r+i}const i4=s4(),
o4=1e4,s0="/webrtc",Yu="/webrtc-signaling/0.0.1";function a4(n){return n?.buffer instanceof ArrayBuffer}function c4(n){if(a4(
n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Wp(n,e){e==null&&(e=n.reduce((s,i)=>s+
i.length,0));const t=Zt(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;return c4(t)}function l4(n,e){if(n===e)return!0;
if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const i0=Symbol.
for("@achingbrain/uint8arraylist");function Kp(n,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function Mo(n){return!!n?.[i0]}let dd=class ua{bufs;length;[i0]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>
0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(
e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(Mo(r)){t+=
r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array\
 or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Mo(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Kp(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=Kp(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Mo(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Wp(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:Wp(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new ua;return i.
length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(
o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Mo(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=Zt(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=ln(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=ln(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=ln(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=Zt(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=ln(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=ln(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=ln(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=ln(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=ln(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ua)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!l4(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new ua;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const u4=8,fd=1024*1024*4;let h4=class extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"},o0=class extends Error{name="InvalidDataLengthError";code="ERR\
_MSG_DATA_TOO_LONG"},d4=class extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"},Gp=class extends Error{name="\
UnexpectedEOFError";code="ERR_UNEXPECTED_EOF"};function a0(n){return n[Symbol.asyncIterator]!=null}function c0(n,e){if(n.
byteLength>e)throw new o0("Message length too long")}const Rc=n=>{const e=xt(n),t=Zt(e);return $L(n,t),Rc.bytes=e,t};Rc.
bytes=0;function Ju(n,e){e=e??{};const t=e.lengthEncoder??Rc,r=e?.maxDataLength??fd;function*s(i){c0(i,r);const o=t(i.byteLength);
o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:yield*i}return a0(n)?(async function*(){for await(const i of n)
yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}Ju.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??Rc,r=e?.maxDataLength??
fd;return c0(n,r),new dd(t(n.byteLength),n)};var jn;(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=1]="DATA"})(jn||(jn={}));
const pd=n=>{const e=kL(n);return pd.bytes=xt(e),e};pd.bytes=0;function Zu(n,e){const t=new dd;let r=jn.LENGTH,s=-1;const i=e?.
lengthDecoder??pd,o=e?.maxLengthLength??u4,a=e?.maxDataLength??fd;function*c(){for(;t.byteLength>0;){if(r===jn.LENGTH)try{
if(s=i(t),s<0)throw new h4("Invalid message length");if(s>a)throw new o0("Message length too long");const l=i.bytes;t.consume(
l),e?.onLength!=null&&e.onLength(s),r=jn.DATA}catch(l){if(l instanceof RangeError){if(t.byteLength>o)throw new d4("Messa\
ge length length too long");break}throw l}if(r===jn.DATA){if(t.byteLength<s)break;const l=t.sublist(0,s);t.consume(s),e?.
onData!=null&&e.onData(l),yield l,r=jn.LENGTH}}}return a0(n)?(async function*(){for await(const l of n)t.append(l),yield*c();
if(t.byteLength>0)throw new Gp("Unexpected end of input")})():(function*(){for(const l of n)t.append(l),yield*c();if(t.byteLength>
0)throw new Gp("Unexpected end of input")})()}Zu.fromReader=(n,e)=>{let t=1;const r=(async function*(){for(;;)try{const{
done:i,value:o}=await n.next(t);if(i===!0)return;o!=null&&(yield o)}catch(i){if(i.code==="ERR_UNDER_READ")return{done:!0,
value:null};throw i}finally{t=1}})();return Zu(r,{...e??{},onLength:i=>{t=i}})};let f4=class extends Error{constructor(e){
super(e),this.name="TimeoutError"}};class p4 extends Error{constructor(e){super(),this.name="AbortError",this.message=e}}
const jp=n=>globalThis.DOMException===void 0?new p4(n):new DOMException(n),Hp=n=>{const e=n.reason===void 0?jp("This ope\
ration was aborted."):n.reason;return e instanceof Error?e:jp(e)};function g4(n,e){const{milliseconds:t,fallback:r,message:s,
customTimers:i={setTimeout,clearTimeout}}=e;let o,a;const l=new Promise((u,h)=>{if(typeof t!="number"||Math.sign(t)!==1)
throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(e.signal){const{signal:p}=e;p.
aborted&&h(Hp(p)),a=()=>{h(Hp(p))},p.addEventListener("abort",a,{once:!0})}if(t===Number.POSITIVE_INFINITY){n.then(u,h);
return}const f=new f4;o=i.setTimeout.call(void 0,()=>{if(r){try{u(r())}catch(p){h(p)}return}typeof n.cancel=="function"&&
n.cancel(),s===!1?u():s instanceof Error?h(s):(f.message=s??`Promise timed out after ${t} milliseconds`,h(f))},t),(async()=>{
try{u(await n)}catch(p){h(p)}})()}).finally(()=>{l.clear(),a&&e.signal&&e.signal.removeEventListener("abort",a)});return l.
clear=()=>{i.clearTimeout.call(void 0,o),o=void 0},l}const m4=n=>{const e=n.addEventListener||n.on||n.addListener,t=n.removeEventListener||
n.off||n.removeListener;if(!e||!t)throw new TypeError("Emitter is not compatible");return{addListener:e.bind(n),removeListener:t.
bind(n)}};function b4(n,e,t){let r;const s=new Promise((i,o)=>{if(t={rejectionEvents:["error"],multiArgs:!1,rejectionMultiArgs:!1,
resolveImmediately:!1,...t},!(t.count>=0&&(t.count===Number.POSITIVE_INFINITY||Number.isInteger(t.count))))throw new TypeError(
"The `count` option should be at least 0 or more");t.signal?.throwIfAborted();const a=[e].flat(),c=[],{addListener:l,removeListener:u}=m4(
n),h=async(...p)=>{const A=t.multiArgs?p:p[0];if(t.filter)try{if(!await t.filter(A))return}catch(y){r(),o(y);return}c.push(
A),t.count===c.length&&(r(),i(c))},f=(...p)=>{r(),o(t.rejectionMultiArgs?p:p[0])};r=()=>{for(const p of a)u(p,h);for(const p of t.
rejectionEvents)a.includes(p)||u(p,f)};for(const p of a)l(p,h);for(const p of t.rejectionEvents)a.includes(p)||l(p,f);t.
signal&&t.signal.addEventListener("abort",()=>{f(t.signal.reason)},{once:!0}),t.resolveImmediately&&i(c)});if(s.cancel=r,
typeof t.timeout=="number"){const i=g4(s,{milliseconds:t.timeout});return i.cancel=()=>{r(),i.clear()},i}return s}function ui(n,e,t){
typeof t=="function"&&(t={filter:t}),t={...t,count:1,resolveImmediately:!1};const r=b4(n,e,t),s=r.then(i=>i[0]);return s.
cancel=r.cancel,s}class y4 extends fb{channel;incomingData;maxBufferedAmount;receivedFinAck;finAckTimeout;constructor(e){
super({...e,maxMessageSize:(e.maxMessageSize??hd)-i4}),this.channel=e.channel,this.channel.binaryType="arraybuffer",this.
incomingData=ls(),this.maxBufferedAmount=e.maxBufferedAmount??e4,this.finAckTimeout=e.finAckTimeout??o4,this.channel.onclose=
()=>{this.log.trace("received datachannel close event"),this.onRemoteCloseWrite(),this.onTransportClosed()},this.channel.
onerror=r=>{const s=r.error;this.log.trace("received datachannel error event - %e",s),this.abort(s)},this.channel.onmessage=
async r=>{this.log("incoming message %d bytes",r.data.byteLength);const{data:s}=r;s===null||s.byteLength===0||this.incomingData.
push(new Uint8Array(s,0,s.byteLength))},this.channel.bufferedAmountLowThreshold=0,this.channel.onbufferedamountlow=()=>{
this.writableNeedsDrain&&this.safeDispatchEvent("drain")},Promise.resolve().then(async()=>{for await(const r of Zu(this.
incomingData))this.processIncomingProtobuf(r)}).catch(r=>{this.log.error("error processing incoming data channel message\
s - %e",r)});const t=()=>{this.channel.readyState==="open"&&(this.log.trace("stream closed, closing underlying datachann\
el"),this.channel.close())};this.addEventListener("close",t),this.channel.readyState!=="open"&&(this.log('channel ready \
state is "%s" and not "open", waiting for "open" event before sending data',this.channel.readyState),ui(this.channel,"op\
en",{rejectionEvents:["close","error"]}).then(()=>{this.log('channel ready state is now "%s", dispatching drain',this.channel.
readyState),this.safeDispatchEvent("drain")}).catch(r=>{this.abort(r.error??r)}))}sendNewStream(){}_sendMessage(e){if(this.
channel.readyState!=="open")throw new Qr(`Invalid datachannel state - ${this.channel.readyState}`);this.log.trace('sendi\
ng message, channel state "%s"',this.channel.readyState);try{for(const t of e)this.channel.send(Kw(t))}catch(t){this.log.
error("error sending datachannel message - %e",t),this.abort(t)}}sendData(e){return this.channel.readyState!=="open"?{sentBytes:0,
canSendMore:!1}:(this._sendMessage(Ju.single(Xe.encode({message:e.subarray()}))),{sentBytes:e.byteLength,canSendMore:this.
channel.bufferedAmount<this.maxBufferedAmount})}sendReset(e){try{this.log.error("sending reset - %e",e),this._sendFlag(Xe.
Flag.RESET),this.receivedFinAck?.reject(e)}catch(t){this.log.error("failed to send reset - %e",t)}}async sendCloseWrite(e){
this._sendFlag(Xe.Flag.FIN),e?.signal?.throwIfAborted(),this.receivedFinAck=Promise.withResolvers();const t=e?.signal??AbortSignal.
timeout(this.finAckTimeout),r=[ui(this.channel,"close",{signal:t}),ui(this.channel,"error",{signal:t})];await Promise.any(
[Dt(this.receivedFinAck.promise,t),...r]).finally(()=>{r.forEach(s=>s.cancel())})}async sendCloseRead(e){this._sendFlag(
Xe.Flag.STOP_SENDING),e?.signal?.throwIfAborted()}processIncomingProtobuf(e){const t=Xe.decode(e);t.message!=null&&(this.
readStatus==="readable"||this.readStatus==="paused")&&this.onData(new dd(t.message)),t.flag!==void 0&&(this.log.trace('i\
ncoming flag %s, write status "%s", read status "%s"',t.flag,this.writeStatus,this.readStatus),t.flag===Xe.Flag.FIN&&(this.
_sendFlag(Xe.Flag.FIN_ACK),this.onRemoteCloseWrite()),t.flag===Xe.Flag.RESET&&(this.receivedFinAck?.reject(new km("The s\
tream was reset")),this.onRemoteReset()),t.flag===Xe.Flag.STOP_SENDING&&this.onRemoteCloseRead(),t.flag===Xe.Flag.FIN_ACK&&
this.receivedFinAck?.resolve())}_sendFlag(e){if(this.channel.readyState!=="open")return this.log.trace('not sending flag\
 %s because channel is "%s" and not "open"',e.toString(),this.channel.readyState),!1;this.log.trace("sending flag %s",e.
toString());const t=Xe.encode({flag:e}),r=Ju.single(t);try{return this._sendMessage(r),!0}catch(s){this.log.error("could\
 not send flag %s - %e",e.toString(),s)}return!1}sendPause(){}sendResume(){}}function Xp(n){const{channel:e,direction:t,
isHandshake:r}=n;return new y4({...n,id:`${e.id}`,log:n.log.newScope(`${r===!0?"handshake":t}:${e.id}`),protocol:""})}function gd(n,e){
try{n.close()}catch(t){e?.trace("error closing early data channel - %e",t)}}function eh(n,e){n.channel.onmessage=null,n.
messages.length=0,gd(n.channel,e)}class l0{protocol;peerConnection;metrics;log;dataChannelOptions;maxEarlyStreams;earlyDataChannels;handedOff=!1;constructor(e){
this.onEarlyDataChannel=this.onEarlyDataChannel.bind(this),this.peerConnection=e.peerConnection,this.metrics=e.metrics,this.
log=e.log,this.protocol=e.protocol??s0,this.dataChannelOptions=e.dataChannelOptions??{},this.maxEarlyStreams=e.maxEarlyStreams??
n4,this.peerConnection.addEventListener("datachannel",this.onEarlyDataChannel),this.earlyDataChannels=[]}onEarlyDataChannel(e){
const t=e.channel;if(this.earlyDataChannels.length>=this.maxEarlyStreams){this.log?.("rejecting early data channel %d - \
too many early channels",t.id),this.metrics?.increment({early_data_channel_count_exceeded:!0}),gd(t,this.log);return}t.binaryType=
"arraybuffer";const r={channel:t,messages:[]};t.onmessage=s=>{const{data:i}=s;if(!(i instanceof ArrayBuffer)){this.closeEarlyDataChannel(
r,"invalid_message");return}if(r.messages.length>=r4){this.closeEarlyDataChannel(r,"message_count_exceeded");return}if(r.
messages.reduce((a,c)=>a+c.data.byteLength,0)+i.byteLength>t4){this.closeEarlyDataChannel(r,"byte_count_exceeded");return}
r.messages.push(s)},this.earlyDataChannels.push(r)}closeEarlyDataChannel(e,t){this.log?.("closing early data channel %d \
- %s",e.channel.id,t),this.metrics?.increment({[`early_data_channel_${t}`]:!0}),eh(e,this.log);const r=this.earlyDataChannels.
indexOf(e);r!==-1&&this.earlyDataChannels.splice(r,1)}createStreamMuxer(e){return this.handedOff=!0,this.peerConnection.
removeEventListener("datachannel",this.onEarlyDataChannel),new w4(e,{peerConnection:this.peerConnection,dataChannelOptions:this.
dataChannelOptions,metrics:this.metrics,protocol:this.protocol,maxEarlyStreams:this.maxEarlyStreams,earlyDataChannels:this.
earlyDataChannels})}close(){if(!this.handedOff){this.peerConnection.removeEventListener("datachannel",this.onEarlyDataChannel);
for(const e of this.earlyDataChannels)eh(e,this.log);this.earlyDataChannels.length=0}}}class w4 extends db{peerConnection;dataChannelOptions;constructor(e,t){
super(e,{...t,name:"muxer"}),this.peerConnection=t.peerConnection,this.protocol=t.protocol??s0,this.dataChannelOptions=t.
dataChannelOptions??{},this.peerConnection.ondatachannel=({channel:r})=>{this.onDataChannel(r)},queueMicrotask(()=>{if(this.
status!=="open"){t.earlyDataChannels.forEach(r=>{eh(r,this.log)});return}t.earlyDataChannels.forEach(({channel:r,messages:s})=>{
try{this.onDataChannel(r,s)}catch(i){this.log.error("error adopting early data channel %d - %e",r.id,i)}})})}onDataChannel(e,t){
if(this.log("incoming datachannel with channel id %d, protocol %s and status %s",e.id,e.protocol,e.readyState),e.label===
"init"){this.log.trace("closing init channel %d",e.id),gd(e,this.log);return}const r=Xp({...this.streamOptions,...this.dataChannelOptions,
channel:e,direction:"inbound",log:this.log});t?.forEach(s=>{e.onmessage?.(s)}),this.onRemoteStream(r)}async onCreateStream(e){
const t=this.peerConnection.createDataChannel("",{});return this.log("open channel %d for protocol %s",t.id,e?.protocol),
Xp({...e,...this.dataChannelOptions,channel:t,direction:"outbound",log:this.log})}onData(){}}class v4 extends Nh{peerConnection;constructor(e){
super(e),this.peerConnection=e.peerConnection;const t=e.peerConnection.connectionState;this.peerConnection.onconnectionstatechange=
()=>{this.log.trace("peer connection state change %s initial state %s",this.peerConnection.connectionState,t),(this.peerConnection.
connectionState==="failed"||this.peerConnection.connectionState==="closed")&&(this.onTransportClosed(),this.peerConnection.
close())}}sendData(e){return{sentBytes:e.byteLength,canSendMore:!0}}async sendClose(e){this.peerConnection.close(),e?.signal?.
throwIfAborted()}sendReset(){this.peerConnection.close()}sendPause(){}sendResume(){}}const Qp=n=>new v4(n);async function Yp(n){
return n=n??{},typeof n=="function"&&(n=await n()),n.iceServers=n.iceServers??Z8.map(e=>({urls:[e]})),n}const u0=globalThis.
RTCPeerConnection,h0=globalThis.RTCSessionDescription,S4=globalThis.RTCIceCandidate;class A4 extends Error{constructor(e){
super(`WebRTC transport error: ${e}`),this.name="WebRTCTransportError"}}class xn extends A4{constructor(e="SDP handshake\
 failed"){super(e),this.name="SDPHandshakeFailedError"}}var Ct;(function(n){(function(o){o.SDP_OFFER="SDP_OFFER",o.SDP_ANSWER=
"SDP_ANSWER",o.ICE_CANDIDATE="ICE_CANDIDATE"})(n.Type||(n.Type={}));let e;(function(o){o[o.SDP_OFFER=0]="SDP_OFFER",o[o.
SDP_ANSWER=1]="SDP_ANSWER",o[o.ICE_CANDIDATE=2]="ICE_CANDIDATE"})(e||(e={})),(function(o){o.codec=()=>n0(e)})(n.Type||(n.
Type={}));let t;n.codec=()=>(t==null&&(t=r0((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),n.Type.
codec().encode(o.type,a)),o.data!=null&&(a.uint32(18),a.string(o.data)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{
const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{l.type=n.Type.codec().decode(
o);break}case 2:{l.data=o.string();break}default:{o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?
o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(
o)};break}case 2:{yield{field:`${c}.data`,value:o.string()};break}default:{o.skipType(h&7);break}}}})),t);function r(o){
return Jw(o,n.codec())}n.encode=r;function s(o,a){return Hw(o,n.codec(),a)}n.decode=s;function i(o,a){return Zw(o,n.codec(),
a)}n.stream=i})(Ct||(Ct={}));const d0=async(n,e,t)=>{try{const r=Promise.withResolvers();for(E4(n,r);;){const s=await Promise.
race([r.promise,e.read({signal:t.signal})]);if(s==null){t.signal?.throwIfAborted();break}if(s.type!==Ct.Type.ICE_CANDIDATE)
throw new Q("ICE candidate message expected");const i=JSON.parse(s.data??"null");if(i===""||i===null){t.onProgress?.(new B(
"webrtc:end-of-ice-candidates")),t.log.trace("end-of-candidates received");continue}const o=new S4(i);t.log.trace("%s re\
ceived new ICE candidate %o",t.direction,i);try{t.onProgress?.(new B("webrtc:add-ice-candidate",o.candidate)),await n.addIceCandidate(
o)}catch(a){t.log.error("%s bad candidate received %o - %e",t.direction,i,a)}}}catch(r){if(t.log.error("%s error parsing\
 ICE candidate - %e",t.direction,r),t.signal?.aborted===!0&&n.connectionState!=="connected")throw r}};function E4(n,e){if(n.
connectionState==="connected"){e.resolve();return}n.onconnectionstatechange=t=>{switch(n.connectionState){case"connected":
e.resolve();break;case"failed":case"closed":e.reject(new Om(`RTCPeerConnection connection state became "${n.connectionState}\
"`));break}}}function f0(n){let e;for(const t of n.getComponents())t.name==="p2p"&&(e=Z(t.value??""));if(e==null)throw new uc(
"Remote peerId must be present in multiaddr");return e}async function _4({rtcConfiguration:n,dataChannel:e,maxEarlyStreams:t,
signal:r,metrics:s,multiaddr:i,connectionManager:o,transportManager:a,log:c,logger:l,onProgress:u}){const{circuitAddress:h,
targetPeer:f}=I4(i);s?.dialerEvents.increment({open:!0}),c.trace("dialing circuit address: %a",h);const p=o.getConnections(
f);let A;p.length===0?(u?.(new B("webrtc:dial-relay")),A=await a.dial(h,{signal:r,onProgress:u})):(u?.(new B("webrtc:reu\
se-relay-connection")),A=p[0]),u?.(new B("webrtc:open-signaling-stream"));const y=await A.newStream(Yu,{signal:r,runOnLimitedConnection:!0}),
I=Rt(y).pb(Ct),d=new u0(n);d.addEventListener("connectionstatechange",()=>{switch(d.connectionState){case"closed":d.close();
break}});const m=new l0({peerConnection:d,dataChannelOptions:e,maxEarlyStreams:t,metrics:s?.dialerEvents,log:c});try{const E=d.
createDataChannel("init");d.onicecandidate=({candidate:g})=>{if(d.connectionState==="connected"){c.trace("ignore new ice\
 candidate as peer connection is already connected");return}if(g==null||g?.candidate===""){c.trace("initiator detected e\
nd of ICE candidates");return}const x=JSON.stringify(g?.toJSON()??null);c.trace("initiator sending ICE candidate %o",g),
I.write({type:Ct.Type.ICE_CANDIDATE,data:x},{signal:r}).catch(_=>{c.error("error sending ICE candidate - %e",_)})},d.onicecandidateerror=
g=>{c.error("initiator ICE candidate error",g)};const w=await d.createOffer().catch(g=>{throw c.error("could not execute\
 createOffer - %e",g),new xn("Failed to set createOffer")});c.trace("initiator send SDP offer %s",w.sdp),u?.(new B("webr\
tc:send-sdp-offer")),await I.write({type:Ct.Type.SDP_OFFER,data:w.sdp},{signal:r}),await d.setLocalDescription(w).catch(
g=>{throw c.error("could not execute setLocalDescription - %e",g),new xn("Failed to set localDescription")}),u?.(new B("\
webrtc:read-sdp-answer")),c.trace("initiator read SDP answer");const b=await I.read({signal:r});if(b.type!==Ct.Type.SDP_ANSWER)
throw new xn("Remote should send an SDP answer");c.trace("initiator received SDP answer %s",b.data);const v=new h0({type:"\
answer",sdp:b.data});return await d.setRemoteDescription(v).catch(g=>{throw c.error("could not execute setRemoteDescript\
ion - %e",g),new xn("Failed to set remoteDescription")}),c.trace("initiator read candidates until connected"),u?.(new B(
"webrtc:read-ice-candidates")),await d0(d,I,{direction:"initiator",signal:r,log:c,onProgress:u}),c.trace("initiator conn\
ected"),E.readyState!=="open"&&(c.trace("wait for init channel to open"),await ui(E,"open",{signal:r})),c.trace("closing\
 init channel"),E.close(),c.trace("waiting for init channel to close"),await ui(E,"close",{signal:r}),u?.(new B("webrtc:\
close-signaling-stream")),c.trace("closing signaling channel"),await y.close({signal:r}),c.trace("initiator connected to\
 remote address %s",i),{remoteAddress:i,peerConnection:d,muxerFactory:m}}catch(E){throw c.error("outgoing signaling erro\
r - %e",E),m.close(),d.close(),y.abort(E),E}finally{d.onicecandidate=null,d.onicecandidateerror=null}}const Jp=J(Lh.matchers[0],
Y(Ki));class md extends ue{transportManager;shutdownController;events;constructor(e,t){super(),this.transportManager=e.transportManager,
this.events=e.events,this.shutdownController=t.shutdownController,this.onTransportListening=this.onTransportListening.bind(
this)}async listen(){this.events.addEventListener("transport:listening",this.onTransportListening)}onTransportListening(e){
e.detail.getAddrs().filter(r=>Jp.exactMatch(r)).map(r=>r.encapsulate("/webrtc")).length>0&&this.safeDispatchEvent("liste\
ning")}getAddrs(){return this.transportManager.getListeners().filter(e=>!(e instanceof md)).map(e=>e.getAddrs().filter(t=>Jp.
exactMatch(t)).map(t=>t.encapsulate("/webrtc"))).flat()}updateAnnounceAddrs(){}async close(){this.events.removeEventListener(
"transport:listening",this.onTransportListening),this.shutdownController.abort(),queueMicrotask(()=>{this.safeDispatchEvent(
"close")})}}async function x4(n,e,{peerConnection:t,signal:r,log:s}){s.trace("new inbound signaling stream");const i=Rt(
n).pb(Ct);try{t.onicecandidate=({candidate:h})=>{if(t.connectionState==="connected"){s.trace("ignore new ice candidate a\
s peer connection is already connected");return}if(h==null||h?.candidate===""){s.trace("recipient detected end of ICE ca\
ndidates");return}const f=JSON.stringify(h?.toJSON()??null);s.trace("recipient sending ICE candidate %s",f),i.write({type:Ct.
Type.ICE_CANDIDATE,data:f},{signal:r}).catch(p=>{s.error("error sending ICE candidate - %e",p)})},s.trace("recipient rea\
d SDP offer");const c=await i.read({signal:r});if(c.type!==Ct.Type.SDP_OFFER)throw new xn(`expected message type SDP_OFF\
ER, received: ${c.type??"undefined"} `);s.trace("recipient received SDP offer %s",c.data);const l=new h0({type:"offer",sdp:c.
data});await t.setRemoteDescription(l).catch(h=>{throw s.error("could not execute setRemoteDescription - %e",h),new xn("\
Failed to set remoteDescription")});const u=await t.createAnswer().catch(h=>{throw s.error("could not execute createAnsw\
er - %e",h),new xn("Failed to create answer")});s.trace("recipient send SDP answer %s",u.sdp),await i.write({type:Ct.Type.
SDP_ANSWER,data:u.sdp},{signal:r}),await t.setLocalDescription(u).catch(h=>{throw s.error("could not execute setLocalDes\
cription - %e",h),new xn("Failed to set localDescription")}),s.trace("recipient read candidates until connected"),await d0(
t,i,{direction:"recipient",signal:r,log:s})}catch(c){if(t.connectionState!=="connected")throw s.error("error while handl\
ing signaling stream from peer %a - %e",e.remoteAddr,c),t.close(),c;s("error while handling signaling stream from peer %\
a, ignoring as the RTCPeerConnection is already connected",e.remoteAddr,c)}const o=f0(e.remoteAddr),a=k(`/webrtc/p2p/${o}`);
return s.trace("recipient connected to remote address %s",a),{remoteAddress:a,remotePeer:o}}class C4{components;init;log;_started=!1;metrics;shutdownController;constructor(e,t={}){
this.components=e,this.init=t,this.log=e.logger.forComponent("libp2p:webrtc"),this.shutdownController=new AbortController,
this.shutdownController.signal,e.metrics!=null&&(this.metrics={dialerEvents:e.metrics.registerCounterGroup("libp2p_webrt\
c_dialer_events_total",{label:"event",help:"Total count of WebRTC dialer events by type"}),listenerEvents:e.metrics.registerCounterGroup(
"libp2p_webrtc_listener_events_total",{label:"event",help:"Total count of WebRTC listener events by type"})})}[xh]=!0;[Symbol.
toStringTag]="@libp2p/webrtc";[rt]=["@libp2p/transport"];[us]=["@libp2p/identify","@libp2p/circuit-relay-v2-transport"];isStarted(){
return this._started}async start(){await this.components.registrar.handle(Yu,(e,t)=>{const r=this.components.upgrader.createInboundAbortSignal(
this.shutdownController.signal);this._onProtocol(e,t,r).catch(s=>{this.log.error("failed to handle incoming connect from\
 %p - %e",t.remotePeer,s)}).finally(()=>{r.clear()})},{runOnLimitedConnection:!0}),this._started=!0}async stop(){await this.
components.registrar.unhandle(Yu),this._started=!1}createListener(e){return new md(this.components,{shutdownController:this.
shutdownController})}listenFilter(e){return e.filter(mu.exactMatch)}dialFilter(e){return this.listenFilter(e)}async dial(e,t){
this.log.trace("dialing address: %a",e);const{remoteAddress:r,peerConnection:s,muxerFactory:i}=await _4({rtcConfiguration:await Yp(
this.init.rtcConfiguration),dataChannel:this.init.dataChannel,maxEarlyStreams:this.init.maxEarlyStreams,multiaddr:e,dataChannelOptions:this.
init.dataChannel,signal:t.signal,connectionManager:this.components.connectionManager,transportManager:this.components.transportManager,
metrics:this.metrics,log:this.log,logger:this.components.logger,onProgress:t.onProgress}),o=Qp({peerConnection:s,remoteAddr:r,
metrics:this.metrics?.dialerEvents,direction:"outbound",log:this.components.logger.forComponent("libp2p:webrtc:connectio\
n")});let a;try{a=await t.upgrader.upgradeOutbound(o,{skipProtection:!0,skipEncryption:!0,remotePeer:f0(e),muxerFactory:i,
onProgress:t.onProgress,signal:t.signal})}catch(c){throw i.close(),s.close(),c}return this._closeOnShutdown(s,o),a}async _onProtocol(e,t,r){
const s=new u0(await Yp(this.init.rtcConfiguration));s.addEventListener("connectionstatechange",()=>{switch(s.connectionState){case"\
closed":s.close();break}});const i=new l0({peerConnection:s,dataChannelOptions:this.init.dataChannel,maxEarlyStreams:this.
init.maxEarlyStreams,metrics:this.metrics?.listenerEvents,log:this.log});try{const{remoteAddress:o,remotePeer:a}=await x4(
e,t,{peerConnection:s,signal:r,log:this.log});await e.close({signal:r});const c=Qp({peerConnection:s,remoteAddr:o,metrics:this.
metrics?.listenerEvents,direction:"inbound",log:this.components.logger.forComponent("libp2p:webrtc:connection")});await this.
components.upgrader.upgradeInbound(c,{skipEncryption:!0,skipProtection:!0,remotePeer:a,muxerFactory:i,signal:r}),this._closeOnShutdown(
s,c)}catch(o){throw this.log.error("incoming signaling error - %e",o),i.close(),s.close(),e.abort(o),o}}_closeOnShutdown(e,t){
const r=()=>{t.close().catch(s=>{this.log.error("could not close WebRTCMultiaddrConnection - %e",s)})};this.shutdownController.
signal.addEventListener("abort",r),e.addEventListener("close",()=>{this.shutdownController.signal.removeEventListener("a\
bort",r)})}}function I4(n){const e=n.getComponents().filter(({name:r})=>r==="p2p").map(({value:r})=>r).pop();if(e==null)
throw new P("Destination peer id was missing");return{circuitAddress:k(n.getComponents().filter(({name:r})=>r!=="webrtc")),
targetPeer:Z(e)}}/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */function T4(n){return n instanceof
Uint8Array||ArrayBuffer.isView(n)&&n.constructor.name==="Uint8Array"}function th(n){if(typeof n!="boolean")throw new Error(
`boolean expected, not ${n}`)}function kl(n){if(!Number.isSafeInteger(n)||n<0)throw new Error("positive integer expected\
, got "+n)}function Ke(n,e,t=""){const r=T4(n),s=n?.length,i=e!==void 0;if(!r||i&&s!==e){const o=t&&`"${t}" `,a=i?` of l\
ength ${e}`:"",c=r?`length=${s}`:`type=${typeof n}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return n}function Zp(n,e=!0){
if(n.destroyed)throw new Error("Hash instance has been destroyed");if(e&&n.finished)throw new Error("Hash#digest() has a\
lready been called")}function D4(n,e){Ke(n,void 0,"output");const t=e.outputLen;if(n.length<t)throw new Error("digestInt\
o() expects output buffer of length at least "+t)}function Dn(n){return new Uint32Array(n.buffer,n.byteOffset,Math.floor(
n.byteLength/4))}function Es(...n){for(let e=0;e<n.length;e++)n[e].fill(0)}function P4(n){return new DataView(n.buffer,n.
byteOffset,n.byteLength)}const M4=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function $4(n,e){if(e==null||
typeof e!="object")throw new Error("options must be defined");return Object.assign(n,e)}function k4(n,e){if(n.length!==e.
length)return!1;let t=0;for(let r=0;r<n.length;r++)t|=n[r]^e[r];return t===0}const L4=(n,e)=>{function t(r,...s){if(Ke(r,
void 0,"key"),!M4)throw new Error("Non little-endian hardware is not yet supported");if(n.nonceLength!==void 0){const u=s[0];
Ke(u,n.varSizeNonce?void 0:n.nonceLength,"nonce")}const i=n.tagLength;i&&s[1]!==void 0&&Ke(s[1],void 0,"AAD");const o=e(
r,...s),a=(u,h)=>{if(h!==void 0){if(u!==2)throw new Error("cipher output not supported");Ke(h,void 0,"output")}};let c=!1;
return{encrypt(u,h){if(c)throw new Error("cannot encrypt() twice with same key + nonce");return c=!0,Ke(u),a(o.encrypt.length,
h),o.encrypt(u,h)},decrypt(u,h){if(Ke(u),i&&u.length<i)throw new Error('"ciphertext" expected length bigger than tagLeng\
th='+i);return a(o.decrypt.length,h),o.decrypt(u,h)}}}return Object.assign(t,n),t};function eg(n,e,t=!0){if(e===void 0)return new Uint8Array(
n);if(e.length!==n)throw new Error('"output" expected Uint8Array of length '+n+", got: "+e.length);if(t&&!N4(e))throw new Error(
"invalid output, must be aligned");return e}function R4(n,e,t){th(t);const r=new Uint8Array(16),s=P4(r);return s.setBigUint64(
0,BigInt(e),t),s.setBigUint64(8,BigInt(n),t),r}function N4(n){return n.byteOffset%4===0}function Ua(n){return Uint8Array.
from(n)}const p0=n=>Uint8Array.from(n.split(""),e=>e.charCodeAt(0)),F4=p0("expand 16-byte k"),U4=p0("expand 32-byte k"),
O4=Dn(F4),B4=Dn(U4);function z(n,e){return n<<e|n>>>32-e}function nh(n){return n.byteOffset%4===0}const $o=64,z4=16,g0=2**
32-1,tg=Uint32Array.of();function V4(n,e,t,r,s,i,o,a){const c=s.length,l=new Uint8Array($o),u=Dn(l),h=nh(s)&&nh(i),f=h?Dn(
s):tg,p=h?Dn(i):tg;for(let A=0;A<c;o++){if(n(e,t,r,u,o,a),o>=g0)throw new Error("arx: counter overflow");const y=Math.min(
$o,c-A);if(h&&y===$o){const I=A/4;if(A%4!==0)throw new Error("arx: invalid block position");for(let d=0,m;d<z4;d++)m=I+d,
p[m]=f[m]^u[d];A+=$o;continue}for(let I=0,d;I<y;I++)d=A+I,i[d]=s[d]^l[I];A+=y}}function q4(n,e){const{allowShortKeys:t,extendNonceFn:r,
counterLength:s,counterRight:i,rounds:o}=$4({allowShortKeys:!1,counterLength:8,counterRight:!1,rounds:20},e);if(typeof n!=
"function")throw new Error("core must be a function");return kl(s),kl(o),th(i),th(t),(a,c,l,u,h=0)=>{Ke(a,void 0,"key"),
Ke(c,void 0,"nonce"),Ke(l,void 0,"data");const f=l.length;if(u===void 0&&(u=new Uint8Array(f)),Ke(u,void 0,"output"),kl(
h),h<0||h>=g0)throw new Error("arx: counter overflow");if(u.length<f)throw new Error(`arx: output (${u.length}) is short\
er than data (${f})`);const p=[];let A=a.length,y,I;if(A===32)p.push(y=Ua(a)),I=B4;else if(A===16&&t)y=new Uint8Array(32),
y.set(a),y.set(a,16),I=O4,p.push(y);else throw Ke(a,32,"arx key"),new Error("invalid key size");nh(c)||p.push(c=Ua(c));const d=Dn(
y);if(r){if(c.length!==24)throw new Error("arx: extended nonce must be 24 bytes");r(I,d,Dn(c.subarray(0,16)),d),c=c.subarray(
16)}const m=16-s;if(m!==c.length)throw new Error(`arx: nonce must be ${m} or 16 bytes`);if(m!==12){const w=new Uint8Array(
12);w.set(c,i?0:12-c.length),c=w,p.push(c)}const E=Dn(c);return V4(n,I,d,E,l,u,h,o),Es(...p),u}}function he(n,e){return n[e++]&
255|(n[e++]&255)<<8}class W4{blockLen=16;outputLen=16;buffer=new Uint8Array(16);r=new Uint16Array(10);h=new Uint16Array(
10);pad=new Uint16Array(8);pos=0;finished=!1;constructor(e){e=Ua(Ke(e,32,"key"));const t=he(e,0),r=he(e,2),s=he(e,4),i=he(
e,6),o=he(e,8),a=he(e,10),c=he(e,12),l=he(e,14);this.r[0]=t&8191,this.r[1]=(t>>>13|r<<3)&8191,this.r[2]=(r>>>10|s<<6)&7939,
this.r[3]=(s>>>7|i<<9)&8191,this.r[4]=(i>>>4|o<<12)&255,this.r[5]=o>>>1&8190,this.r[6]=(o>>>14|a<<2)&8191,this.r[7]=(a>>>
11|c<<5)&8065,this.r[8]=(c>>>8|l<<8)&8191,this.r[9]=l>>>5&127;for(let u=0;u<8;u++)this.pad[u]=he(e,16+2*u)}process(e,t,r=!1){
const s=r?0:2048,{h:i,r:o}=this,a=o[0],c=o[1],l=o[2],u=o[3],h=o[4],f=o[5],p=o[6],A=o[7],y=o[8],I=o[9],d=he(e,t+0),m=he(e,
t+2),E=he(e,t+4),w=he(e,t+6),b=he(e,t+8),v=he(e,t+10),g=he(e,t+12),x=he(e,t+14);let _=i[0]+(d&8191),S=i[1]+((d>>>13|m<<3)&
8191),C=i[2]+((m>>>10|E<<6)&8191),T=i[3]+((E>>>7|w<<9)&8191),M=i[4]+((w>>>4|b<<12)&8191),R=i[5]+(b>>>1&8191),K=i[6]+((b>>>
14|v<<2)&8191),N=i[7]+((v>>>11|g<<5)&8191),F=i[8]+((g>>>8|x<<8)&8191),O=i[9]+(x>>>5|s),D=0,j=D+_*a+S*(5*I)+C*(5*y)+T*(5*
A)+M*(5*p);D=j>>>13,j&=8191,j+=R*(5*f)+K*(5*h)+N*(5*u)+F*(5*l)+O*(5*c),D+=j>>>13,j&=8191;let ie=D+_*c+S*a+C*(5*I)+T*(5*y)+
M*(5*A);D=ie>>>13,ie&=8191,ie+=R*(5*p)+K*(5*f)+N*(5*h)+F*(5*u)+O*(5*l),D+=ie>>>13,ie&=8191;let G=D+_*l+S*c+C*a+T*(5*I)+M*
(5*y);D=G>>>13,G&=8191,G+=R*(5*A)+K*(5*p)+N*(5*f)+F*(5*h)+O*(5*u),D+=G>>>13,G&=8191;let te=D+_*u+S*l+C*c+T*a+M*(5*I);D=te>>>
13,te&=8191,te+=R*(5*y)+K*(5*A)+N*(5*p)+F*(5*f)+O*(5*h),D+=te>>>13,te&=8191;let Lr=D+_*h+S*u+C*l+T*c+M*a;D=Lr>>>13,Lr&=8191,
Lr+=R*(5*I)+K*(5*y)+N*(5*A)+F*(5*p)+O*(5*f),D+=Lr>>>13,Lr&=8191;let Rr=D+_*f+S*h+C*u+T*l+M*c;D=Rr>>>13,Rr&=8191,Rr+=R*a+
K*(5*I)+N*(5*y)+F*(5*A)+O*(5*p),D+=Rr>>>13,Rr&=8191;let Nr=D+_*p+S*f+C*h+T*u+M*l;D=Nr>>>13,Nr&=8191,Nr+=R*c+K*a+N*(5*I)+
F*(5*y)+O*(5*A),D+=Nr>>>13,Nr&=8191;let Fr=D+_*A+S*p+C*f+T*h+M*u;D=Fr>>>13,Fr&=8191,Fr+=R*l+K*c+N*a+F*(5*I)+O*(5*y),D+=Fr>>>
13,Fr&=8191;let Ur=D+_*y+S*A+C*p+T*f+M*h;D=Ur>>>13,Ur&=8191,Ur+=R*u+K*l+N*c+F*a+O*(5*I),D+=Ur>>>13,Ur&=8191;let Or=D+_*I+
S*y+C*A+T*p+M*f;D=Or>>>13,Or&=8191,Or+=R*h+K*u+N*l+F*c+O*a,D+=Or>>>13,Or&=8191,D=(D<<2)+D|0,D=D+j|0,j=D&8191,D=D>>>13,ie+=
D,i[0]=j,i[1]=ie,i[2]=G,i[3]=te,i[4]=Lr,i[5]=Rr,i[6]=Nr,i[7]=Fr,i[8]=Ur,i[9]=Or}finalize(){const{h:e,pad:t}=this,r=new Uint16Array(
10);let s=e[1]>>>13;e[1]&=8191;for(let a=2;a<10;a++)e[a]+=s,s=e[a]>>>13,e[a]&=8191;e[0]+=s*5,s=e[0]>>>13,e[0]&=8191,e[1]+=
s,s=e[1]>>>13,e[1]&=8191,e[2]+=s,r[0]=e[0]+5,s=r[0]>>>13,r[0]&=8191;for(let a=1;a<10;a++)r[a]=e[a]+s,s=r[a]>>>13,r[a]&=8191;
r[9]-=8192;let i=(s^1)-1;for(let a=0;a<10;a++)r[a]&=i;i=~i;for(let a=0;a<10;a++)e[a]=e[a]&i|r[a];e[0]=(e[0]|e[1]<<13)&65535,
e[1]=(e[1]>>>3|e[2]<<10)&65535,e[2]=(e[2]>>>6|e[3]<<7)&65535,e[3]=(e[3]>>>9|e[4]<<4)&65535,e[4]=(e[4]>>>12|e[5]<<1|e[6]<<
14)&65535,e[5]=(e[6]>>>2|e[7]<<11)&65535,e[6]=(e[7]>>>5|e[8]<<8)&65535,e[7]=(e[8]>>>8|e[9]<<5)&65535;let o=e[0]+t[0];e[0]=
o&65535;for(let a=1;a<8;a++)o=(e[a]+t[a]|0)+(o>>>16)|0,e[a]=o&65535;Es(r)}update(e){Zp(this),Ke(e),e=Ua(e);const{buffer:t,
blockLen:r}=this,s=e.length;for(let i=0;i<s;){const o=Math.min(r-this.pos,s-i);if(o===r){for(;r<=s-i;i+=r)this.process(e,
i);continue}t.set(e.subarray(i,i+o),this.pos),this.pos+=o,i+=o,this.pos===r&&(this.process(t,0,!1),this.pos=0)}return this}destroy(){
Es(this.h,this.r,this.buffer,this.pad)}digestInto(e){Zp(this),D4(e,this),this.finished=!0;const{buffer:t,h:r}=this;let{pos:s}=this;
if(s){for(t[s++]=1;s<16;s++)t[s]=0;this.process(t,0,!0)}this.finalize();let i=0;for(let o=0;o<8;o++)e[i++]=r[o]>>>0,e[i++]=
r[o]>>>8;return e}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const r=e.slice(0,t);return this.destroy(),
r}}function K4(n){const e=(r,s)=>n(s).update(r).digest(),t=n(new Uint8Array(32));return e.outputLen=t.outputLen,e.blockLen=
t.blockLen,e.create=r=>n(r),e}const G4=K4(n=>new W4(n));function j4(n,e,t,r,s,i=20){let o=n[0],a=n[1],c=n[2],l=n[3],u=e[0],
h=e[1],f=e[2],p=e[3],A=e[4],y=e[5],I=e[6],d=e[7],m=s,E=t[0],w=t[1],b=t[2],v=o,g=a,x=c,_=l,S=u,C=h,T=f,M=p,R=A,K=y,N=I,F=d,
O=m,D=E,j=w,ie=b;for(let te=0;te<i;te+=2)v=v+S|0,O=z(O^v,16),R=R+O|0,S=z(S^R,12),v=v+S|0,O=z(O^v,8),R=R+O|0,S=z(S^R,7),g=
g+C|0,D=z(D^g,16),K=K+D|0,C=z(C^K,12),g=g+C|0,D=z(D^g,8),K=K+D|0,C=z(C^K,7),x=x+T|0,j=z(j^x,16),N=N+j|0,T=z(T^N,12),x=x+
T|0,j=z(j^x,8),N=N+j|0,T=z(T^N,7),_=_+M|0,ie=z(ie^_,16),F=F+ie|0,M=z(M^F,12),_=_+M|0,ie=z(ie^_,8),F=F+ie|0,M=z(M^F,7),v=
v+C|0,ie=z(ie^v,16),N=N+ie|0,C=z(C^N,12),v=v+C|0,ie=z(ie^v,8),N=N+ie|0,C=z(C^N,7),g=g+T|0,O=z(O^g,16),F=F+O|0,T=z(T^F,12),
g=g+T|0,O=z(O^g,8),F=F+O|0,T=z(T^F,7),x=x+M|0,D=z(D^x,16),R=R+D|0,M=z(M^R,12),x=x+M|0,D=z(D^x,8),R=R+D|0,M=z(M^R,7),_=_+
S|0,j=z(j^_,16),K=K+j|0,S=z(S^K,12),_=_+S|0,j=z(j^_,8),K=K+j|0,S=z(S^K,7);let G=0;r[G++]=o+v|0,r[G++]=a+g|0,r[G++]=c+x|0,
r[G++]=l+_|0,r[G++]=u+S|0,r[G++]=h+C|0,r[G++]=f+T|0,r[G++]=p+M|0,r[G++]=A+R|0,r[G++]=y+K|0,r[G++]=I+N|0,r[G++]=d+F|0,r[G++]=
m+O|0,r[G++]=E+D|0,r[G++]=w+j|0,r[G++]=b+ie|0}const H4=q4(j4,{counterRight:!1,counterLength:4,allowShortKeys:!1}),X4=new Uint8Array(
16),ng=(n,e)=>{n.update(e);const t=e.length%16;t&&n.update(X4.subarray(t))},Q4=new Uint8Array(32);function rg(n,e,t,r,s){
s!==void 0&&Ke(s,void 0,"AAD");const i=n(e,t,Q4),o=R4(r.length,s?s.length:0,!0),a=G4.create(i);s&&ng(a,s),ng(a,r),a.update(
o);const c=a.digest();return Es(i,o),c}const Y4=n=>(e,t,r)=>({encrypt(i,o){const a=i.length;o=eg(a+16,o,!1),o.set(i);const c=o.
subarray(0,-16);n(e,t,c,c,1);const l=rg(n,e,t,c,r);return o.set(l,a),Es(l),o},decrypt(i,o){o=eg(i.length-16,o,!1);const a=i.
subarray(0,-16),c=i.subarray(-16),l=rg(n,e,t,a,r);if(!k4(c,l))throw new Error("invalid tag");return o.set(i.subarray(0,-16)),
n(e,t,o,o,1),Es(l),o}}),sg=L4({blockSize:64,nonceLength:12,tagLength:16},Y4(H4));function J4(n,e,t){return Bm(n),t===void 0&&
(t=new Uint8Array(n.outputLen)),zm(n,t,e)}const Ll=Uint8Array.of(0),ig=Uint8Array.of();function Z4(n,e,t,r=32){Bm(n),aS(
r,"length");const s=n.outputLen;if(r>255*s)throw new Error("Length must be <= 255*HashLen");const i=Math.ceil(r/s);t===void 0?
t=ig:lS(t,void 0,"info");const o=new Uint8Array(i*s),a=zm.create(n,e),c=a._cloneInto(),l=new Uint8Array(a.outputLen);for(let u=0;u<
i;u++)Ll[0]=u+1,c.update(u===0?ig:l).update(t).update(Ll).digestInto(l),o.set(l,s*u),a._cloneInto(c);return a.destroy(),
c.destroy(),cS(l,Ll),o.slice(0,r)}function og(n){return e=>new C4(e,n)}function Oa(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Ba(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Ba(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function eR(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const ag=4096;function tR(n){const e=n.
length;if(e<=ag)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=ag));return t}function nR(n){return n?.buffer instanceof ArrayBuffer}function Ba(n){return nR(n)?n:n.slice()}
function rR(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof Uint8Array||
(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===
0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=
256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;
for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError("Expect\
ed String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var sR=rR,iR=sR;let oR=class{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},aR=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return m0(this,e)}},
cR=class{decoders;constructor(e){this.decoders=e}or(e){return m0(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=
null)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function m0(n,e){return new cR({...n.decoders??{[n.prefix]:n},...e.decoders??
{[e.prefix]:e}})}let lR=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){this.name=e,this.prefix=
t,this.baseEncode=r,this.baseDecode=s,this.encoder=new oR(e,t,r),this.decoder=new aR(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Nc({name:n,prefix:e,encode:t,decode:r}){return new lR(n,e,t,
r)}function oo({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=iR(t,n,r);return Nc({prefix:e,
name:n,encode:s,decode:o=>Oa(i(o))})}function uR(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function hR(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function dR(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function ve({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=dR(r,s);return Nc(
{prefix:e,name:n,encode(o){return hR(o,r,t)},decode(o){return uR(o,i,t,n)}})}const fR=oo({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),pR=oo({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),gR=Object.freeze(Object.defineProperty({__proto__:null,base58btc:fR,
base58flickr:pR},Symbol.toStringTag,{value:"Module"})),mR=ve({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),bR=ve({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),yR=ve({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),wR=ve({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),vR=ve({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),SR=ve({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
AR=ve({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),ER=ve(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),_R=ve(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),xR=Object.freeze(Object.defineProperty(
{__proto__:null,base32:mR,base32hex:vR,base32hexpad:AR,base32hexpadupper:ER,base32hexupper:SR,base32pad:yR,base32padupper:wR,
base32upper:bR,base32z:_R},Symbol.toStringTag,{value:"Module"})),CR=oo({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),IR=oo({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),TR=Object.freeze(Object.defineProperty({__proto__:null,base36:CR,base36upper:IR},Symbol.
toStringTag,{value:"Module"}));var DR=b0,cg=128,PR=-128,MR=Math.pow(2,31);function b0(n,e,t){e=e||[],t=t||0;for(var r=t;n>=
MR;)e[t++]=n&255|cg,n/=128;for(;n&PR;)e[t++]=n&255|cg,n>>>=7;return e[t]=n|0,b0.bytes=t-r+1,e}var $R=rh,kR=128,lg=127;function rh(n,r){
var t=0,r=r||0,s=0,i=r,o,a=n.length;do{if(i>=a)throw rh.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<
28?(o&lg)<<s:(o&lg)*Math.pow(2,s),s+=7}while(o>=kR);return rh.bytes=i-r,t}var LR=Math.pow(2,7),RR=Math.pow(2,14),NR=Math.
pow(2,21),FR=Math.pow(2,28),UR=Math.pow(2,35),OR=Math.pow(2,42),BR=Math.pow(2,49),zR=Math.pow(2,56),VR=Math.pow(2,63),qR=function(n){
return n<LR?1:n<RR?2:n<NR?3:n<FR?4:n<UR?5:n<OR?6:n<BR?7:n<zR?8:n<VR?9:10},WR={encode:DR,decode:$R,encodingLength:qR},ug=WR;
function hg(n,e=0){const t=ug.decode(n,e),r=ug.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>
1&&n[e+r-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,r]}function KR(n){const e=Oa(n),[
t,r]=hg(e),[s,i]=hg(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new GR(
t,s,o,e)}let GR=class{code;size;digest;bytes;constructor(e,t,r,s){this.code=e,this.size=t,this.digest=Ba(r),this.bytes=Ba(
s)}};function jR(n){return n.buffer instanceof ArrayBuffer}function HR(n){return jR(n)?n:n.slice()}function is(n=0){return new Uint8Array(
n)}function za(n=0){return new Uint8Array(n)}const XR=oo({prefix:"9",name:"base10",alphabet:"0123456789"}),QR=Object.freeze(
Object.defineProperty({__proto__:null,base10:XR},Symbol.toStringTag,{value:"Module"})),YR=ve({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),JR=ve({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,
caseInsensitive:!0}),ZR=Object.freeze(Object.defineProperty({__proto__:null,base16:YR,base16upper:JR},Symbol.toStringTag,
{value:"Module"})),eN=ve({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),tN=Object.freeze(Object.defineProperty({
__proto__:null,base2:eN},Symbol.toStringTag,{value:"Module"})),y0=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿\
😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋\
👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫\
⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌\
🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
nN=y0.reduce((n,e,t)=>(n[t]=e,n),[]),rN=y0.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(`Invalid\
 character: ${e}`);return n[r]=t,n},[]);function sN(n){return n.reduce((e,t)=>(e+=nN[t],e),"")}function iN(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=rN[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const oN=Nc({prefix:"🚀",name:"\
base256emoji",encode:sN,decode:iN}),aN=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:oN},Symbol.toStringTag,
{value:"Module"})),cN=ve({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),lN=ve({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),uN=ve({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),hN=ve({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),dN=Object.freeze(Object.defineProperty({__proto__:null,base64:cN,base64pad:lN,
base64url:uN,base64urlpad:hN},Symbol.toStringTag,{value:"Module"})),fN=ve({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
pN=Object.freeze(Object.defineProperty({__proto__:null,base8:fN},Symbol.toStringTag,{value:"Module"})),gN=Nc({prefix:"\0",
name:"identity",encode:n=>tR(Oa(n)),decode:n=>Oa(eR(n))}),mN=Object.freeze(Object.defineProperty({__proto__:null,identity:gN},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const dg={...mN,...tN,...pN,...QR,...ZR,...xR,...TR,
...gR,...dN,...aN};function w0(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const fg=w0(
"utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),Rl=w0("ascii","a",n=>{let e="\
a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=za(n.length);for(let t=0;t<
n.length;t++)e[t]=n.charCodeAt(t);return e}),v0={utf8:fg,"utf-8":fg,hex:dg.base16,latin1:Rl,ascii:Rl,binary:Rl,...dg};function bN(n,e="\
utf8"){const t=v0[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}
function yN(n,e="utf8"){const t=v0[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(
n).substring(1)}const wN=Math.pow(2,7),vN=Math.pow(2,14),SN=Math.pow(2,21),S0=Math.pow(2,28),A0=Math.pow(2,35),E0=Math.pow(
2,42),_0=Math.pow(2,49),qe=128,un=127;function bd(n){if(n<wN)return 1;if(n<vN)return 2;if(n<SN)return 3;if(n<S0)return 4;
if(n<A0)return 5;if(n<E0)return 6;if(n<_0)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError(
"Could not encode varint");return 8}function AN(n,e,t=0){switch(bd(n)){case 8:e[t++]=n&255|qe,n/=128;case 7:e[t++]=n&255|
qe,n/=128;case 6:e[t++]=n&255|qe,n/=128;case 5:e[t++]=n&255|qe,n/=128;case 4:e[t++]=n&255|qe,n>>>=7;case 3:e[t++]=n&255|
qe,n>>>=7;case 2:e[t++]=n&255|qe,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}
function EN(n,e){let t=n[e],r=0;if(r+=t&un,t<qe||(t=n[e+1],r+=(t&un)<<7,t<qe)||(t=n[e+2],r+=(t&un)<<14,t<qe)||(t=n[e+3],
r+=(t&un)<<21,t<qe)||(t=n[e+4],r+=(t&un)*S0,t<qe)||(t=n[e+5],r+=(t&un)*A0,t<qe)||(t=n[e+6],r+=(t&un)*E0,t<qe)||(t=n[e+7],
r+=(t&un)*_0,t<qe))return r;throw new RangeError("Could not decode varint")}const yd=new Float32Array([-0]),Cn=new Uint8Array(
yd.buffer);function _N(n,e,t){yd[0]=n,e[t]=Cn[0],e[t+1]=Cn[1],e[t+2]=Cn[2],e[t+3]=Cn[3]}function xN(n,e){return Cn[0]=n[e],
Cn[1]=n[e+1],Cn[2]=n[e+2],Cn[3]=n[e+3],yd[0]}const wd=new Float64Array([-0]),Me=new Uint8Array(wd.buffer);function CN(n,e,t){
wd[0]=n,e[t]=Me[0],e[t+1]=Me[1],e[t+2]=Me[2],e[t+3]=Me[3],e[t+4]=Me[4],e[t+5]=Me[5],e[t+6]=Me[6],e[t+7]=Me[7]}function IN(n,e){
return Me[0]=n[e],Me[1]=n[e+1],Me[2]=n[e+2],Me[3]=n[e+3],Me[4]=n[e+4],Me[5]=n[e+5],Me[6]=n[e+6],Me[7]=n[e+7],wd[0]}const TN=BigInt(
Number.MAX_SAFE_INTEGER),DN=BigInt(Number.MIN_SAFE_INTEGER);let Gt=class Wn{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|
0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(t+r*4294967296)}
return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>
31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<32n))}return BigInt(this.
lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.
hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.
lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,r=this.
hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:r<128?9:10}static fromBigInt(e){
if(e===0n)return dr;if(e<TN&&e>DN)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let r=e>>32n,s=e-(r<<32n);return t&&
(r=~r|0n,s=~s|0n,++s>pg&&(s=0n,++r>pg&&(r=0n))),new Wn(Number(s),Number(r))}static fromNumber(e){if(e===0)return dr;const t=e<
0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&(r=0,++s>4294967295&&(s=0))),
new Wn(r,s)}static from(e){return typeof e=="number"?Wn.fromNumber(e):typeof e=="bigint"?Wn.fromBigInt(e):typeof e=="str\
ing"?Wn.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Wn(e.low>>>0,e.high>>>0):dr}};const dr=new Gt(0,0);dr.toBigInt=
function(){return 0n};dr.zzEncode=dr.zzDecode=function(){return this};dr.length=function(){return 1};const pg=4294967296n;
function PN(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function MN(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function x0(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function St(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function ko(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}let $N=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=HR(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,St(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw St(this,4);return ko(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw St(
this,4);return ko(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw St(this,4);const e=xN(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw St(this,4);const e=IN(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw St(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return MN(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
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
if(this.pos+8>this.len)throw St(this,8);const e=ko(this.buf,this.pos+=4),t=ko(this.buf,this.pos+=4);return new Gt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=EN(this.buf,this.pos);
return this.pos+=bd(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function C0(n){return new $N(n instanceof Uint8Array?
n:n.subarray())}function Pr(n,e,t){const r=C0(n);return e.decode(r,void 0,t)}function kN(n){let r,s=8192;return function(o){
if(o<1||o>4096)return za(o);s+o>8192&&(r=za(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let Js=class{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}};function Nl(){}let LN=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const RN=kN();function NN(n){return globalThis.Buffer!=null?
za(n):RN(n)}let sh=class{len;head;tail;states;constructor(){this.len=0,this.head=new Js(Nl,0,0),this.tail=this.head,this.
states=null}_push(e,t,r){return this.tail=this.tail.next=new Js(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new UN((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
Lo,10,Gt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Gt.fromBigInt(e);
return this._push(Lo,t.length(),t)}uint64Number(e){return this._push(AN,bd(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=Gt.fromBigInt(e).zzEncode();return this._push(Lo,t.length(),t)}sint64Number(e){const t=Gt.fromNumber(e).zzEncode();
return this._push(Lo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Fl,1,e?1:0)}fixed32(e){
return this._push(zs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Gt.fromBigInt(e);return this._push(zs,
4,t.lo)._push(zs,4,t.hi)}fixed64Number(e){const t=Gt.fromNumber(e);return this._push(zs,4,t.lo)._push(zs,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(_N,4,e)}double(e){return this._push(CN,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Fl,1,0):this.uint32(t)._push(ON,t,e)}string(e){const t=PN(e);return t!==0?this.uint32(t)._push(
x0,t,e):this._push(Fl,1,0)}fork(){return this.states=new LN(this),this.head=this.tail=new Js(Nl,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new Js(Nl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.
reset().uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=NN(this.
len);let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}};function Fl(n,e,t){e[t]=n&255}function FN(n,e,t){
for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}let UN=class extends Js{next;constructor(e,t){super(FN,e,t),this.next=void 0}};
function Lo(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&
127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function zs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function ON(n,e,t){
e.set(n,t)}globalThis.Buffer!=null&&(sh.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this.
_push(BN,e,n),this},sh.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this.
_push(zN,e,n),this});function BN(n,e,t){e.set(n,t)}function zN(n,e,t){n.length<40?x0(n,e,t):e.utf8Write!=null?e.utf8Write(
n,t):e.set(bN(n),t)}function VN(){return new sh}function Mr(n,e){const t=VN();return e.encode(n,t,{lengthDelimited:!1}),
t.finish()}function*$r(n,e,t){const r=C0(n);yield*e.stream(r,void 0,".",t)}const I0={VARINT:0,LENGTH_DELIMITED:2};function T0(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function vd(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return T0("enum",I0.VARINT,t,r,s)}function kr(n,e,t){return T0("message",I0.LENGTH_DELIMITED,n,e,
t)}let Va=class extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"};const qN=1,D0=5e3,WN=100,Ro=`${Eh}-circuit-re\
lay`;BigInt(1<<17);const qa="/libp2p/circuit/relay/0.2.0/hop",gg="/libp2p/circuit/relay/0.2.0/stop",mg=300,KN=4096,GN=.001;
var _s;(function(n){(function(o){o.RESERVE="RESERVE",o.CONNECT="CONNECT",o.STATUS="STATUS"})(n.Type||(n.Type={}));let e;
(function(o){o[o.RESERVE=0]="RESERVE",o[o.CONNECT=1]="CONNECT",o[o.STATUS=2]="STATUS"})(e||(e={})),(function(o){o.codec=
()=>vd(e)})(n.Type||(n.Type={}));let t;n.codec=()=>(t==null&&(t=kr((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=
null&&(a.uint32(8),n.Type.codec().encode(o.type,a)),o.peer!=null&&(a.uint32(18),Pn.codec().encode(o.peer,a)),o.reservation!=
null&&(a.uint32(26),hi.codec().encode(o.reservation,a)),o.limit!=null&&(a.uint32(34),Mn.codec().encode(o.limit,a)),o.status!=
null&&(a.uint32(40),de.codec().encode(o.status,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?
o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{l.type=n.Type.codec().decode(o);break}case 2:{l.peer=
Pn.codec().decode(o,o.uint32(),{limits:c.limits?.peer});break}case 3:{l.reservation=hi.codec().decode(o,o.uint32(),{limits:c.
limits?.reservation});break}case 4:{l.limit=Mn.codec().decode(o,o.uint32(),{limits:c.limits?.limit});break}case 5:{l.status=
de.codec().decode(o);break}default:{o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+
a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(o)};break}case 2:{
yield*Pn.codec().stream(o,o.uint32(),`${c}.peer`,{limits:l.limits?.peer});break}case 3:{yield*hi.codec().stream(o,o.uint32(),
`${c}.reservation`,{limits:l.limits?.reservation});break}case 4:{yield*Mn.codec().stream(o,o.uint32(),`${c}.limit`,{limits:l.
limits?.limit});break}case 5:{yield{field:`${c}.status`,value:de.codec().decode(o)};break}default:{o.skipType(h&7);break}}}})),
t);function r(o){return Mr(o,n.codec())}n.encode=r;function s(o,a){return Pr(o,n.codec(),a)}n.decode=s;function i(o,a){return $r(
o,n.codec(),a)}n.stream=i})(_s||(_s={}));var Bt;(function(n){(function(o){o.CONNECT="CONNECT",o.STATUS="STATUS"})(n.Type||
(n.Type={}));let e;(function(o){o[o.CONNECT=0]="CONNECT",o[o.STATUS=1]="STATUS"})(e||(e={})),(function(o){o.codec=()=>vd(
e)})(n.Type||(n.Type={}));let t;n.codec=()=>(t==null&&(t=kr((o,a,c={})=>{c.lengthDelimited!==!1&&a.fork(),o.type!=null&&
(a.uint32(8),n.Type.codec().encode(o.type,a)),o.peer!=null&&(a.uint32(18),Pn.codec().encode(o.peer,a)),o.limit!=null&&(a.
uint32(26),Mn.codec().encode(o.limit,a)),o.status!=null&&(a.uint32(32),de.codec().encode(o.status,a)),c.lengthDelimited!==
!1&&a.ldelim()},(o,a,c={})=>{const l={},u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{
l.type=n.Type.codec().decode(o);break}case 2:{l.peer=Pn.codec().decode(o,o.uint32(),{limits:c.limits?.peer});break}case 3:{
l.limit=Mn.codec().decode(o,o.uint32(),{limits:c.limits?.limit});break}case 4:{l.status=de.codec().decode(o);break}default:{
o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){const u=a==null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();
switch(h>>>3){case 1:{yield{field:`${c}.type`,value:n.Type.codec().decode(o)};break}case 2:{yield*Pn.codec().stream(o,o.
uint32(),`${c}.peer`,{limits:l.limits?.peer});break}case 3:{yield*Mn.codec().stream(o,o.uint32(),`${c}.limit`,{limits:l.
limits?.limit});break}case 4:{yield{field:`${c}.status`,value:de.codec().decode(o)};break}default:{o.skipType(h&7);break}}}})),
t);function r(o){return Mr(o,n.codec())}n.encode=r;function s(o,a){return Pr(o,n.codec(),a)}n.decode=s;function i(o,a){return $r(
o,n.codec(),a)}n.stream=i})(Bt||(Bt={}));var Pn;(function(n){let e;n.codec=()=>(e==null&&(e=kr((i,o,a={})=>{if(a.lengthDelimited!==
!1&&o.fork(),i.id!=null&&i.id.byteLength>0&&(o.uint32(10),o.bytes(i.id)),i.addrs!=null&&i.addrs.length>0)for(const c of i.
addrs)o.uint32(18),o.bytes(c);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={id:is(0),addrs:[]},l=o==null?i.len:
i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.id=i.bytes();break}case 2:{if(a.limits?.addrs!=null&&c.
addrs.length===a.limits.addrs)throw new Va('Decode error - repeated field "addrs" had too many elements');c.addrs.push(i.
bytes());break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addrs:0},u=o==null?i.len:i.pos+
o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.id`,value:i.bytes()};break}case 2:{if(c.limits?.
addrs!=null&&l.addrs===c.limits.addrs)throw new Va('Streaming decode error - repeated field "addrs" had too many element\
s');yield{field:`${a}.addrs[]`,index:l.addrs,value:i.bytes()},l.addrs++;break}default:{i.skipType(h&7);break}}}})),e);function t(i){
return Mr(i,n.codec())}n.encode=t;function r(i,o){return Pr(i,n.codec(),o)}n.decode=r;function s(i,o){return $r(i,n.codec(),
o)}n.stream=s})(Pn||(Pn={}));var hi;(function(n){let e;n.codec=()=>(e==null&&(e=kr((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.expire!=null&&i.expire!==0n&&(o.uint32(8),o.uint64(i.expire)),i.addrs!=null&&i.addrs.length>0)for(const c of i.
addrs)o.uint32(18),o.bytes(c);i.voucher!=null&&(o.uint32(26),fi.codec().encode(i.voucher,o)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={expire:0n,addrs:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.expire=i.uint64();break}case 2:{if(a.limits?.addrs!=null&&c.addrs.length===a.limits.addrs)throw new Va('Decode error -\
 repeated field "addrs" had too many elements');c.addrs.push(i.bytes());break}case 3:{c.voucher=fi.codec().decode(i,i.uint32(),
{limits:a.limits?.voucher});break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={addrs:0},u=o==
null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{yield{field:`${a}.expire`,value:i.uint64()};break}case 2:{
if(c.limits?.addrs!=null&&l.addrs===c.limits.addrs)throw new Va('Streaming decode error - repeated field "addrs" had too\
 many elements');yield{field:`${a}.addrs[]`,index:l.addrs,value:i.bytes()},l.addrs++;break}case 3:{yield*fi.codec().stream(
i,i.uint32(),`${a}.voucher`,{limits:c.limits?.voucher});break}default:{i.skipType(h&7);break}}}})),e);function t(i){return Mr(
i,n.codec())}n.encode=t;function r(i,o){return Pr(i,n.codec(),o)}n.decode=r;function s(i,o){return $r(i,n.codec(),o)}n.stream=
s})(hi||(hi={}));var Mn;(function(n){let e;n.codec=()=>(e==null&&(e=kr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.duration!=
null&&(o.uint32(8),o.uint32(i.duration)),i.data!=null&&(o.uint32(16),o.uint64(i.data)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.duration=i.uint32();
break}case 2:{c.data=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.duration`,value:i.uint32()};break}case 2:{
yield{field:`${a}.data`,value:i.uint64()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Mr(i,n.codec())}
n.encode=t;function r(i,o){return Pr(i,n.codec(),o)}n.decode=r;function s(i,o){return $r(i,n.codec(),o)}n.stream=s})(Mn||
(Mn={}));var de;(function(n){n.UNUSED="UNUSED",n.OK="OK",n.RESERVATION_REFUSED="RESERVATION_REFUSED",n.RESOURCE_LIMIT_EXCEEDED=
"RESOURCE_LIMIT_EXCEEDED",n.PERMISSION_DENIED="PERMISSION_DENIED",n.CONNECTION_FAILED="CONNECTION_FAILED",n.NO_RESERVATION=
"NO_RESERVATION",n.MALFORMED_MESSAGE="MALFORMED_MESSAGE",n.UNEXPECTED_MESSAGE="UNEXPECTED_MESSAGE"})(de||(de={}));var ih;
(function(n){n[n.UNUSED=0]="UNUSED",n[n.OK=100]="OK",n[n.RESERVATION_REFUSED=200]="RESERVATION_REFUSED",n[n.RESOURCE_LIMIT_EXCEEDED=
201]="RESOURCE_LIMIT_EXCEEDED",n[n.PERMISSION_DENIED=202]="PERMISSION_DENIED",n[n.CONNECTION_FAILED=203]="CONNECTION_FAI\
LED",n[n.NO_RESERVATION=204]="NO_RESERVATION",n[n.MALFORMED_MESSAGE=400]="MALFORMED_MESSAGE",n[n.UNEXPECTED_MESSAGE=401]=
"UNEXPECTED_MESSAGE"})(ih||(ih={}));(function(n){n.codec=()=>vd(ih)})(de||(de={}));var di;(function(n){let e;n.codec=()=>(e==
null&&(e=kr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.relay!=null&&i.relay.byteLength>0&&(o.uint32(10),o.bytes(i.relay)),
i.peer!=null&&i.peer.byteLength>0&&(o.uint32(18),o.bytes(i.peer)),i.expiration!=null&&i.expiration!==0n&&(o.uint32(24),o.
uint64(i.expiration)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={relay:is(0),peer:is(0),expiration:0n},l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.relay=i.bytes();break}case 2:{c.peer=i.bytes();
break}case 3:{c.expiration=i.uint64();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.relay`,value:i.bytes()};break}case 2:{
yield{field:`${a}.peer`,value:i.bytes()};break}case 3:{yield{field:`${a}.expiration`,value:i.uint64()};break}default:{i.
skipType(u&7);break}}}})),e);function t(i){return Mr(i,n.codec())}n.encode=t;function r(i,o){return Pr(i,n.codec(),o)}n.
decode=r;function s(i,o){return $r(i,n.codec(),o)}n.stream=s})(di||(di={}));var fi;(function(n){let e;n.codec=()=>(e==null&&
(e=kr((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.publicKey!=null&&i.publicKey.byteLength>0&&(o.uint32(10),o.bytes(i.
publicKey)),i.payloadType!=null&&i.payloadType.byteLength>0&&(o.uint32(18),o.bytes(i.payloadType)),i.payload!=null&&(o.uint32(
26),di.codec().encode(i.payload,o)),i.signature!=null&&i.signature.byteLength>0&&(o.uint32(42),o.bytes(i.signature)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={publicKey:is(0),payloadType:is(0),signature:is(0)},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.publicKey=i.bytes();break}case 2:{c.payloadType=i.bytes();break}case 3:{
c.payload=di.codec().decode(i,i.uint32(),{limits:a.limits?.payload});break}case 5:{c.signature=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{yield{field:`${a}.payloadType`,value:i.
bytes()};break}case 3:{yield*di.codec().stream(i,i.uint32(),`${a}.payload`,{limits:c.limits?.payload});break}case 5:{yield{
field:`${a}.signature`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Mr(i,n.codec())}
n.encode=t;function r(i,o){return Pr(i,n.codec(),o)}n.decode=r;function s(i,o){return $r(i,n.codec(),o)}n.stream=s})(fi||
(fi={}));class bg extends Error{static name="HadEnoughRelaysError";name="HadEnoughRelaysError"}class jN extends Error{static name="\
DoubleRelayError";name="DoubleRelayError"}class HN extends Error{static name="RelayQueueFullError";name="RelayQueueFullE\
rror"}function yg(n){const e=n*BigInt(1e3),t=new Date().getTime();return Number(e-BigInt(t))}class wg{expires;bytes;constructor(e){
e?.duration!=null&&e?.duration!==0&&(this.expires=Date.now()+e.duration*1e3),this.bytes=e?.data,this.bytes===0n&&(this.bytes=
void 0),this.onData=this.onData.bind(this)}onData(e){this.bytes!=null&&(this.bytes-=BigInt(e.byteLength),this.bytes<0n&&
(this.bytes=0n))}getLimits(){if(this.expires==null&&this.bytes==null)return;const e={};if(this.bytes!=null){const t=this;
Object.defineProperty(e,"bytes",{get(){return t.bytes}})}if(this.expires!=null){const t=this;Object.defineProperty(e,"se\
conds",{get(){return Math.round(((t.expires??0)-Date.now())/1e3)}})}return e}}const P0=J(V(Lh.matchers[0],Y(Ki))),M0=J(Y(
Ki));class XN extends ue{components;started;running;topologyId;log;discoveryController;filter;queue;constructor(e,t={}){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:discover-relays"),this.components=e,this.started=!1,this.running=
!1,this.filter=t.filter,this.discoveryController=new AbortController,this.discoveryController.signal,this.dialPeer=this.
dialPeer.bind(this),this.onPeer=this.onPeer.bind(this)}isStarted(){return this.started}async start(){this.topologyId=await this.
components.registrar.register(qa,{filter:this.filter,onConnect:e=>{this.log.trace("discovered relay %p queue (length: %d\
, active %d)",e,this.queue?.size,this.queue?.running),this.safeDispatchEvent("relay:discover",{detail:e})}}),this.started=
!0}stop(){this.topologyId!=null&&this.components.registrar.unregister(this.topologyId),this.running&&this.stopDiscovery(),
this.started=!1}startDiscovery(){this.running||(this.log("start discovery"),this.running=!0,this.discoveryController=new AbortController,
this.discoveryController.signal,this.components.events.addEventListener("peer:discovery",this.onPeer),Promise.resolve().
then(async()=>{this.log("searching peer store for relays");const e=await this.components.peerStore.all({filters:[r=>r.protocols.
includes(qa)],orders:[()=>Math.random()<.5?1:-1,(r,s)=>{const i=vg(r),o=vg(s);return i>o?-1:o>i?1:0}]});for(const r of e)
this.log.trace("found relay peer %p in peer store",r.id),this.safeDispatchEvent("relay:discover",{detail:r.id});this.log(
"found %d relay peers in peer store",e.length);const t=this.queue=new Fh({concurrency:5});this.log("start random walk");
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
peerId:e,signal:t}){const r=Ln([AbortSignal.timeout(5e3),t]);try{await this.components.connectionManager.openConnection(
e,{signal:r})}finally{r.clear()}}}function vg(n){const e=n.metadata.get("last-dial-success");return e==null?0:new Date(yN(
e)).getTime()}class QN extends ue{connectionManager;addressManager;reservationStore;listeningAddrs;log;listenTimeout;reservationId;relay;constructor(e,t={}){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:transport:listener"),this.connectionManager=e.connectionManager,
this.addressManager=e.addressManager,this.reservationStore=e.reservationStore,this.listeningAddrs=[],this.listenTimeout=
t.listenTimeout??D0,this.reservationStore.addEventListener("relay:removed",this._onRemoveRelayPeer),this.reservationStore.
addEventListener("relay:created-reservation",this._onAddRelayPeer)}_onRemoveRelayPeer=e=>{this.log("relay removed %p our\
 relay %p",e.detail.relay,this.relay,this.relay?.equals(e.detail.relay)),this.relay?.equals(e.detail.relay)===!0&&(this.
log("relay peer removed %p",e.detail.relay),this.listeningAddrs.forEach(t=>{this.addressManager.removeObservedAddr(t)}),
this.listeningAddrs=[],this.safeDispatchEvent("listening"))};_onAddRelayPeer=e=>{const{details:t}=e.detail;if(t.type==="\
configured"){this.relay?.equals(e.detail.relay)===!0&&this.addedRelay(e.detail);return}t.id===this.reservationId&&this.addedRelay(
e.detail)};async listen(e){if(M0.exactMatch(e))this.log("searching for circuit relay servers"),this.reservationId=this.reservationStore.
reserveRelay();else if(P0.exactMatch(e)){this.log("listen on specific relay server %a",e);const t=AbortSignal.timeout(this.
listenTimeout),r=e.decapsulate("/p2p-circuit"),s=await this.connectionManager.openConnection(r,{signal:t});if(!this.reservationStore.
hasReservation(s.remotePeer)){this.log("making reservation on peer %p",s.remotePeer);const i=await this.reservationStore.
addRelay(s.remotePeer,"configured");this.addedRelay(i)}}else throw new uu(`Could not listen on p2p-circuit address "${e}\
"`)}getAddrs(){return[...this.listeningAddrs.values()].flat()}updateAnnounceAddrs(){}async close(){this.reservationStore.
cancelReservations(),this.listeningAddrs=[],this.reservationStore.removeEventListener("relay:removed",this._onRemoveRelayPeer),
queueMicrotask(()=>{this.safeDispatchEvent("close")})}addedRelay(e){this.log("relay peer added %p",e.relay),this.relay=e.
relay;const t=this.listeningAddrs;this.listeningAddrs=e.details.reservation.addrs.map(r=>k(r).encapsulate("/p2p-circuit")),
this.listeningAddrs.forEach(r=>{this.addressManager.confirmObservedAddr(r,{type:"transport"})}),t.filter(r=>!this.listeningAddrs.
some(s=>s.equals(r))).forEach(r=>{this.addressManager.removeObservedAddr(r)}),queueMicrotask(()=>{this.safeDispatchEvent(
"listening")})}}function YN(n){return new QN(n)}let JN="57X6y3wQZNzYjJB2L_10pxbackgroundhimselfUTF-8DEMOGRAPHICSVqvt4KW9",
ZN=(n=21)=>{for(var e="",t=crypto.getRandomValues(new Uint8Array(n|=0));n--;)e+=JN[t[n]&63];return e};const eF=60*1e3*10,
tF=60*1e3*5,nF=30*1e3;class rF extends ue{peerId;connectionManager;peerStore;events;reserveQueue;reservations;pendingReservations;maxReservationQueueLength;reservationCompletionTimeout;started;log;relayFilter;constructor(e,t){
super(),this.log=e.logger.forComponent("libp2p:circuit-relay:transport:reservation-store"),this.peerId=e.peerId,this.connectionManager=
e.connectionManager,this.peerStore=e.peerStore,this.events=e.events,this.reservations=new Dr,this.pendingReservations=[],
this.maxReservationQueueLength=t?.maxReservationQueueLength??WN,this.reservationCompletionTimeout=t?.reservationCompletionTimeout??
D0,this.started=!1,this.relayFilter=Si(100),this.reserveQueue=new Fh({concurrency:t?.reservationConcurrency??qN,metricName:"\
libp2p_relay_reservation_queue",metrics:e.metrics}),this.events.addEventListener("connection:close",r=>{[...this.reservations.
values()].find(i=>i.connection===r.detail.id)!=null&&this.#t(r.detail.remotePeer).catch(i=>{this.log.error("could not re\
move relay %p - %e",r.detail.remotePeer,i)})})}isStarted(){return this.started}start(){this.started=!0}afterStart(){Promise.
resolve().then(async()=>{const e=await this.peerStore.all({filters:[t=>t.tags.has(Ro)]});this.log("removing tag from %d \
old relays",e.length),await Promise.all(e.map(async t=>{await this.peerStore.merge(t.id,{tags:{[Ro]:void 0}})})),this.log(
"redialing %d old relays",e.length),await Promise.all(e.map(async t=>this.addRelay(t.id,"discovered"))),this.#n()}).catch(
e=>{this.log.error("failed to clean up and redial old relays during afterStart - %e",e)})}stop(){this.reserveQueue.clear(),
this.reservations.forEach(({timeout:e})=>{clearTimeout(e)}),this.reservations.clear(),this.started=!1}reserveRelay(){const e=ZN();
return this.pendingReservations.push(e),this.#n(),e}async addRelay(e,t){if(this.peerId.equals(e))throw this.log.trace("n\
ot trying to use self as relay"),new uu("Cannot use self as relay");if(this.reserveQueue.size>this.maxReservationQueueLength)
throw new HN("The reservation queue is full");const r=this.reserveQueue.find(e);if(r!=null)return this.log.trace("potent\
ial relay peer %p is already in the reservation queue",e),r.join();if(this.relayFilter.has(e.toMultihash().bytes))throw new uu(
"The relay was previously invalid");return this.log.trace("try to reserve relay slot with %p",e),this.reserveQueue.add(async()=>{
const s=Date.now();try{const i=this.reservations.get(e);if(i!=null){const A=this.connectionManager.getConnections(e);let y=!1;
if(A.length===0&&this.log("already have relay reservation with %p but we are no longer connected",e),A.map(I=>I.id).includes(
i.connection)&&(this.log("already have relay reservation with %p and the original connection is still open",e),y=!0),y&&
yg(i.reservation.expire)>eF)return this.log("already have relay reservation with %p but we are still connected and it do\
es not expire soon",e),{relay:e,details:i};y||await this.#t(e)}if(t==="discovered"&&i==null&&this.pendingReservations.length===
0)throw new bg("Not making reservation on discovered relay because we do not need any more relays");const o=AbortSignal.
timeout(this.reservationCompletionTimeout);const a=await this.connectionManager.openConnection(e,{signal:o});if(ds.matches(
a.remoteAddr))throw new jN("not creating reservation over relayed connection");const c=await this.#e(a,{signal:o}),l=yg(
c.expire);this.log("created reservation on relay peer %p, expiry date is %s",e,new Date(Date.now()+l).toString());const u=Math.
min(Math.max(l-tF,nF),Math.pow(2,31)-1),h=setTimeout(()=>{this.log("refresh reservation to relay %p",e),this.addRelay(e,
t).catch(async A=>{this.log.error("could not refresh reservation to relay %p - %e",e,A),await this.#t(e)}).catch(A=>{this.
log.error("could not remove expired reservation to relay %p - %e",e,A)})},u);let f;if(t==="discovered"){const A=this.reservations.
get(e),y=A?.type==="discovered"?A.id:this.pendingReservations.pop();if(y==null)throw new bg("Made reservation on relay b\
ut did not need any more discovered relays");f={timeout:h,reservation:c,type:t,connection:a.id,id:y}}else f={timeout:h,reservation:c,
type:t,connection:a.id};i!=null&&clearTimeout(i.timeout),this.reservations.set(e,f),await this.peerStore.merge(e,{tags:{
[Ro]:{value:1,ttl:l}}}),this.#n();const p={relay:e,details:f};return this.safeDispatchEvent("relay:created-reservation",
{detail:p}),p}catch(i){throw t==="discovered"&&i.name==="HadEnoughRelaysError"||this.log.error("could not reserve slot o\
n %p after %dms - %e",e,Date.now()-s,i),(i.name==="DialError"||i.name==="UnsupportedProtocolError")&&this.relayFilter.add(
e.toMultihash().bytes),this.#t(e).catch(o=>{this.log.error("could not remove reservation on %p after reserving slot fail\
ed - %e",e,o)}),i}},{peerId:e})}hasReservation(e){return this.reservations.has(e)}getReservation(e){return this.reservations.
get(e)?.reservation}reservationCount(e){return e==null?this.reservations.size:[...this.reservations.values()].reduce((t,r)=>(r.
type===e&&t++,t),0)}cancelReservations(){[...this.reservations.values()].forEach(e=>{clearTimeout(e.timeout)}),this.reservations.
clear()}async#e(e,t){t.signal?.throwIfAborted(),this.log("requesting reservation from %p",e.remotePeer);const r=await e.
newStream(qa,t),i=Rt(r).pb(_s);this.log.trace("send RESERVE to %p",e.remotePeer),await i.write({type:_s.Type.RESERVE},t);
let o;try{this.log.trace("reading response from %p",e.remotePeer),o=await i.read(t)}catch(c){throw r.abort(c),c}finally{
r.status!=="closed"&&await r.close(t)}if(this.log.trace("read response %s",o.status),o.status===de.OK&&o.reservation!=null){
const c=new Set;c.add(e.remoteAddr.toString());for(const l of o.reservation.addrs){let u=k(l);u.getComponents().find(h=>h.
code===L)==null&&(u=u.encapsulate(`/p2p/${e.remotePeer}`)),u=k(u.toString().replace(`/p2p/${e.remotePeer}/p2p/${e.remotePeer}`,
`/p2p/${e.remotePeer}`)),c.add(u.toString())}return o.reservation.addrs=[...c].map(l=>k(l).bytes),o.reservation}const a=`\
reservation failed with status ${o.status??"undefined"}`;throw this.log.error(a),new Error(a)}async#t(e){const t=this.reservations.
get(e);t!=null&&(this.log("removing relay reservation with %p from local store",e),clearTimeout(t.timeout),this.reservations.
delete(e),t.type==="discovered"&&this.pendingReservations.push(t.id),this.safeDispatchEvent("relay:removed",{detail:{relay:e,
details:t}}),this.#n(),await this.peerStore.merge(e,{tags:{[Ro]:void 0}}))}#n(){if(this.pendingReservations.length===0){
this.log.trace("have discovered enough relays"),this.reserveQueue.clear(),this.safeDispatchEvent("relay:found-enough-rel\
ays");return}this.relayFilter=Si(100),this.log("not discovered enough relays %d/%d",this.reservations.size,this.pendingReservations.
length),this.safeDispatchEvent("relay:not-enough-relays")}}class sF extends Nh{stream;init;constructor(e){super({...e,direction:e.
stream.direction}),this.init=e,this.stream=e.stream,this.stream.addEventListener("close",t=>{this.onTransportClosed(t.error)}),
this.stream.addEventListener("remoteCloseWrite",t=>{this.onRemoteCloseWrite(),this.close().catch(r=>{this.abort(r)})}),this.
stream.addEventListener("message",t=>{e.onDataRead?.(t.data),this.onData(t.data)}),this.stream.addEventListener("drain",
()=>{this.safeDispatchEvent("drain")})}sendData(e){return this.init.onDataWrite?.(e),{sentBytes:e.byteLength,canSendMore:this.
stream.send(e)}}async sendClose(e){await this.stream.close(e)}sendReset(){this.stream.abort(new Error("An error occurred"))}sendPause(){
this.stream.pause()}sendResume(){this.stream.resume()}}function Sg(n){return new sF(n)}const iF=n=>{if(n.peer==null)return!1;
try{n.peer.addrs.forEach(k)}catch{return!1}return!0},Ag={maxInboundStopStreams:mg,maxOutboundStopStreams:mg};class oF{components;discovery;reservationStore;maxInboundStopStreams;maxOutboundStopStreams;started;log;shutdownController;constructor(e,t={}){
this.components=e,this.log=e.logger.forComponent("libp2p:circuit-relay:transport"),this.maxInboundStopStreams=t.maxInboundStopStreams??
Ag.maxInboundStopStreams,this.maxOutboundStopStreams=t.maxOutboundStopStreams??Ag.maxOutboundStopStreams,this.shutdownController=
new AbortController,this.discovery=new XN(e,{filter:t.discoveryFilter??Rx(KN,GN)}),this.discovery.addEventListener("rela\
y:discover",r=>{this.reservationStore.addRelay(r.detail,"discovered").catch(s=>{s.name!=="HadEnoughRelaysError"&&s.name!==
"RelayQueueFullError"&&this.log.error("could not add discovered relay %p - %e",r.detail,s)})}),this.reservationStore=new rF(
e,t),this.reservationStore.addEventListener("relay:not-enough-relays",()=>{this.discovery?.startDiscovery()}),this.reservationStore.
addEventListener("relay:found-enough-relays",()=>{this.discovery?.stopDiscovery()}),this.started=!1,this.onStop=this.onStop.
bind(this)}[Symbol.toStringTag]="@libp2p/circuit-relay-v2-transport";[rt]=["@libp2p/transport","@libp2p/circuit-relay-v2\
-transport"];get[us](){return this.discovery!=null?["@libp2p/identify"]:[]}[xh]=!0;isStarted(){return this.started}async start(){
this.shutdownController=new AbortController,this.shutdownController.signal,await this.components.registrar.handle(gg,this.
onStop,{maxInboundStreams:this.maxInboundStopStreams,maxOutboundStreams:this.maxOutboundStopStreams,runOnLimitedConnection:!0}),
await Gm(this.discovery,this.reservationStore),this.started=!0}async stop(){this.shutdownController.abort(),await jm(this.
discovery,this.reservationStore),await this.components.registrar.unhandle(gg),this.started=!1}async dial(e,t){const r=e.
toString().split("/p2p-circuit"),s=k(r[0]),i=k(r[r.length-1]),o=s.getComponents().find(p=>p.code===L)?.value,a=i.getComponents().
find(p=>p.code===L)?.value;if(o==null||a==null){const p=`ircuit relay dial to ${e.toString()} failed as address did not \
have both relay and destination PeerIDs`;throw this.log.error(`c${p}`),new ea(`C${p}`)}const c=Z(o),l=Z(a);let h=this.components.
connectionManager.getConnections(c)[0];h==null?(await this.components.peerStore.merge(c,{multiaddrs:[s]}),t.onProgress?.(
new B("circuit-relay:open-connection")),h=await this.components.connectionManager.openConnection(c,t)):t.onProgress?.(new B(
"circuit-relay:reuse-connection"));let f;try{t.onProgress?.(new B("circuit-relay:open-hop-stream")),f=await h.newStream(
qa,t);const p=Rt(f).pb(_s);t.onProgress?.(new B("circuit-relay:write-connect-message")),await p.write({type:_s.Type.CONNECT,
peer:{id:l.toMultihash().bytes,addrs:[k(i).bytes]}},t),t.onProgress?.(new B("circuit-relay:read-connect-response"));const A=await p.
read(t);if(A.status!==de.OK)throw new Q(`failed to connect via relay with status ${A?.status?.toString()??"undefined"}`);
const y=new wg(A.limit),I=Sg({stream:p.unwrap().unwrap(),remoteAddr:e,localAddr:s.encapsulate(`/p2p-circuit/p2p/${this.components.
peerId.toString()}`),onDataRead:y.onData,onDataWrite:y.onData,log:f.log.newScope("circuit-relay:connection")}),d=await this.
components.upgrader.upgradeOutbound(I,{...t,limits:y.getLimits()});return d.log("outbound relayed connection established\
 to %p with limits %o, over connection %s",d.remotePeer,A.limit??"none",h.id),d}catch(p){throw this.log.error("circuit r\
elay dial to destination %p via relay %p failed - %e",l,c,p),f?.abort(p),p}}createListener(e){return YN({peerId:this.components.
peerId,connectionManager:this.components.connectionManager,addressManager:this.components.addressManager,reservationStore:this.
reservationStore,logger:this.components.logger})}listenFilter(e){return e=Array.isArray(e)?e:[e],e.filter(t=>P0.exactMatch(
t)||M0.exactMatch(t))}dialFilter(e){return e=Array.isArray(e)?e:[e],e.filter(t=>ds.exactMatch(t))}async onStop(e,t){const r=this.
components.upgrader.createInboundAbortSignal(this.shutdownController.signal);try{if(!this.reservationStore.hasReservation(
t.remotePeer))try{this.log("dialed via relay we did not have a reservation on, start listening on that relay address"),await this.
components.transportManager.listen([t.remoteAddr.encapsulate("/p2p-circuit")])}catch(h){this.log.error("failed to listen\
 on a relay peer we were dialed via but did not have a reservation on - %e",h)}const s=Rt(e).pb(Bt),i=await s.read({signal:r});
if(this.log("new circuit relay v2 stop stream from %p with type %s",t.remotePeer,i.type),i?.type===void 0){this.log.error(
"type was missing from circuit v2 stop protocol request from %s",t.remotePeer),await s.write({type:Bt.Type.STATUS,status:de.
MALFORMED_MESSAGE},{signal:r}),await e.close({signal:r});return}if(i.type!==Bt.Type.CONNECT){this.log.error("invalid sto\
p connect request via peer %p",t.remotePeer),await s.write({type:Bt.Type.STATUS,status:de.UNEXPECTED_MESSAGE},{signal:r}),
await e.close({signal:r});return}if(!iF(i)){this.log.error("invalid stop connect request via peer %p",t.remotePeer),await s.
write({type:Bt.Type.STATUS,status:de.MALFORMED_MESSAGE},{signal:r}),await e.close({signal:r});return}const o=xr(KR(i.peer.
id));if(await this.components.connectionGater.denyInboundRelayedConnection?.(t.remotePeer,o)===!0){this.log.error("conne\
ction gater denied inbound relayed connection from %p",t.remotePeer),await s.write({type:Bt.Type.STATUS,status:de.PERMISSION_DENIED},
{signal:r}),await e.close({signal:r});return}this.log.trace("sending success response to %p",t.remotePeer),await s.write(
{type:Bt.Type.STATUS,status:de.OK},{signal:r});const a=new wg(i.limit),c=t.remoteAddr.encapsulate(`/p2p-circuit/p2p/${o.
toString()}`),l=this.components.addressManager.getAddresses()[0],u=Sg({stream:s.unwrap().unwrap(),remoteAddr:c,localAddr:l,
onDataRead:a.onData,onDataWrite:a.onData,log:e.log.newScope("circuit-relay:connection")});await this.components.upgrader.
upgradeInbound(u,{limits:a.getLimits(),signal:r}),u.log("inbound relayed connection established to %p with limits %o, ov\
er connection %s",o,i.limit??"none",t.id)}finally{r?.clear()}}}function aF(n={}){return e=>new oF(e,n)}const Bi=65535,Eg=Bi-
16,ao=!!globalThis.process?.env?.DUMP_SESSION_KEYS,_g=16,cF={hashSHA256(n){return tr(n.subarray())},getHKDF(n,e){const t=J4(
tr,e,n),s=Z4(tr,t,void 0,96),i=s.subarray(0,32),o=s.subarray(32,64),a=s.subarray(64,96);return[i,o,a]},generateX25519KeyPair(){
const n=ho.utils.randomSecretKey();return{publicKey:ho.getPublicKey(n),privateKey:n}},generateX25519KeyPairFromSeed(n){return{
publicKey:ho.getPublicKey(n),privateKey:n}},generateX25519SharedKey(n,e){return ho.getSharedSecret(n.subarray(),e.subarray())},
chaCha20Poly1305Encrypt(n,e,t,r){return sg(r,e,t).encrypt(n.subarray())},chaCha20Poly1305Decrypt(n,e,t,r,s){return sg(r,
e,t).decrypt(n.subarray(),s)}},lF=cF;function uF(n){return{generateKeypair:n.generateX25519KeyPair,dh:(e,t)=>n.generateX25519SharedKey(
e.privateKey,t).subarray(0,32),encrypt:n.chaCha20Poly1305Encrypt,decrypt:n.chaCha20Poly1305Decrypt,hash:n.hashSHA256,hkdf:n.
getHKDF}}const Wa=n=>{const e=Vm(2);return e[0]=n>>8,e[1]=n,e};Wa.bytes=2;const Ka=n=>{if(n.length<2)throw RangeError("C\
ould not decode int16BE");if(n instanceof Uint8Array){let e=0;return e+=n[0]<<8,e+=n[1],e}return n.getUint16(0)};Ka.bytes=
2;function hF(n){return{xxHandshakeSuccesses:n.registerCounter("libp2p_noise_xxhandshake_successes_total",{help:"Total c\
ount of noise xxHandshakes successes_"}),xxHandshakeErrors:n.registerCounter("libp2p_noise_xxhandshake_error_total",{help:"\
Total count of noise xxHandshakes errors"}),encryptedPackets:n.registerCounter("libp2p_noise_encrypted_packets_total",{help:"\
Total count of noise encrypted packets successfully"}),decryptedPackets:n.registerCounter("libp2p_noise_decrypted_packet\
s_total",{help:"Total count of noise decrypted packets"}),decryptErrors:n.registerCounter("libp2p_noise_decrypt_errors_t\
otal",{help:"Total count of noise decrypt errors"})}}function $0(n,e){!e.enabled||!ao||(n?(e(`LOCAL_STATIC_PUBLIC_KEY ${Ge(
n.publicKey,"hex")}`),e(`LOCAL_STATIC_PRIVATE_KEY ${Ge(n.privateKey,"hex")}`)):e("Missing local static keys."))}function k0(n,e){
!e.enabled||!ao||(n?(e(`LOCAL_PUBLIC_EPHEMERAL_KEY ${Ge(n.publicKey,"hex")}`),e(`LOCAL_PRIVATE_EPHEMERAL_KEY ${Ge(n.privateKey,
"hex")}`)):e("Missing local ephemeral keys."))}function dF(n,e){!e.enabled||!ao||e(n?`REMOTE_STATIC_PUBLIC_KEY ${Ge(n.subarray(),
"hex")}`:"Missing remote static public key.")}function L0(n,e){!e.enabled||!ao||e(n?`REMOTE_EPHEMERAL_PUBLIC_KEY ${Ge(n.
subarray(),"hex")}`:"Missing remote ephemeral keys.")}function R0(n,e,t){!t.enabled||!ao||(t(`CIPHER_STATE_1 ${n.n.getUint64()}\
 ${n.k&&Ge(n.k,"hex")}`),t(`CIPHER_STATE_2 ${e.n.getUint64()} ${e.k&&Ge(e.k,"hex")}`))}class pi extends Error{code;constructor(e="\
Invalid crypto exchange"){super(e),this.code=pi.code}static code="ERR_INVALID_CRYPTO_EXCHANGE"}const fF=0,pF=4294967295,
gF="Cipher state has reached maximum n, a new handshake must be performed";class mF{n;bytes;view;constructor(e=fF){this.
n=e,this.bytes=kn(12),this.view=new DataView(this.bytes.buffer,this.bytes.byteOffset,this.bytes.byteLength),this.view.setUint32(
4,e,!0)}increment(){this.n++,this.view.setUint32(4,this.n,!0)}getBytes(){return this.bytes}getUint64(){return this.n}assertValue(){
if(this.n>pF)throw new Error(gF)}}const os=kn(0);class No{k;n;crypto;constructor(e,t=void 0,r=0){this.crypto=e,this.k=t,
this.n=new mF(r)}hasKey(){return!!this.k}encryptWithAd(e,t){if(!this.hasKey())return t;this.n.assertValue();const r=this.
crypto.encrypt(t,this.n.getBytes(),e,this.k);return this.n.increment(),r}decryptWithAd(e,t,r){if(!this.hasKey())return t;
this.n.assertValue();const s=this.crypto.decrypt(t,this.n.getBytes(),e,this.k,r);return this.n.increment(),s}}class bF{cs;ck;h;crypto;constructor(e,t){
this.crypto=e;const r=Cr(t,"utf-8");this.h=wF(e,r),this.ck=this.h,this.cs=new No(e)}mixKey(e){const[t,r]=this.crypto.hkdf(
this.ck,e);this.ck=t,this.cs=new No(this.crypto,r)}mixHash(e){this.h=this.crypto.hash(new Tn(this.h,e))}encryptAndHash(e){
const t=this.cs.encryptWithAd(this.h,e);return this.mixHash(t),t}decryptAndHash(e){const t=this.cs.decryptWithAd(this.h,
e);return this.mixHash(e),t}split(){const[e,t]=this.crypto.hkdf(this.ck,os);return[new No(this.crypto,e),new No(this.crypto,
t)]}}class yF{ss;s;e;rs;re;initiator;crypto;constructor(e){const{crypto:t,protocolName:r,prologue:s,initiator:i,s:o,e:a,
rs:c,re:l}=e;this.crypto=t,this.ss=new bF(t,r),this.ss.mixHash(s),this.initiator=i,this.s=o,this.e=a,this.rs=c,this.re=l}writeE(){
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
writeSE()}}class N0 extends yF{writeMessageA(e){return new Tn(this.writeE(),this.ss.encryptAndHash(e))}writeMessageB(e){
const t=this.writeE();this.writeEE();const r=this.writeS();return this.writeES(),new Tn(t,r,this.ss.encryptAndHash(e))}writeMessageC(e){
const t=this.writeS();return this.writeSE(),new Tn(t,this.ss.encryptAndHash(e))}readMessageA(e){try{return this.readE(e),
this.ss.decryptAndHash(e.sublist(32))}catch(t){throw new pi(`handshake stage 0 validation fail: ${t.message}`)}}readMessageB(e){
try{this.readE(e),this.readEE();const t=this.readS(e,32);return this.readES(),this.ss.decryptAndHash(e.sublist(32+t))}catch(t){
throw new pi(`handshake stage 1 validation fail: ${t.message}`)}}readMessageC(e){try{const t=this.readS(e);return this.readSE(),
this.ss.decryptAndHash(e.sublist(t))}catch(t){throw new pi(`handshake stage 2 validation fail: ${t.message}`)}}}function wF(n,e){
if(e.length<=32){const t=kn(32);return t.set(e),t}else return n.hash(e)}var Ga;(function(n){let e;n.codec=()=>(e==null&&
(e=ne((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.webtransportCerthashes!=null)for(const i of t.webtransportCerthashes)
r.uint32(10),r.bytes(i);if(t.streamMuxers!=null)for(const i of t.streamMuxers)r.uint32(18),r.string(i);s.lengthDelimited!==
!1&&r.ldelim()},(t,r,s={})=>{const i={webtransportCerthashes:[],streamMuxers:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){
const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.webtransportCerthashes!=null&&i.webtransportCerthashes.length===s.
limits.webtransportCerthashes)throw new oe('Decode error - map field "webtransportCerthashes" had too many elements');i.
webtransportCerthashes.push(t.bytes());break}case 2:{if(s.limits?.streamMuxers!=null&&i.streamMuxers.length===s.limits.streamMuxers)
throw new oe('Decode error - map field "streamMuxers" had too many elements');i.streamMuxers.push(t.string());break}default:{
t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Ga||(Ga={}));var ja;
(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.identityKey!=null&&t.identityKey.
byteLength>0&&(r.uint32(10),r.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(r.uint32(18),r.bytes(
t.identitySig)),t.extensions!=null&&(r.uint32(34),Ga.codec().encode(t.extensions,r)),s.lengthDelimited!==!1&&r.ldelim()},
(t,r,s={})=>{const i={identityKey:kn(0),identitySig:kn(0)},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>
3){case 1:{i.identityKey=t.bytes();break}case 2:{i.identitySig=t.bytes();break}case 4:{i.extensions=Ga.codec().decode(t,
t.uint32(),{limits:s.limits?.extensions});break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.codec()),
n.decode=(t,r)=>se(t,n.codec(),r)})(ja||(ja={}));async function F0(n,e,t){const r=await n.sign(O0(e));return ja.encode({
identityKey:Ir(n.publicKey),identitySig:r,extensions:t})}async function U0(n,e,t){try{const r=ja.decode(n),s=Xt(r.identityKey);
if(t?.equals(s)===!1)throw new Error(`Payload identity key ${s} does not match expected remote identity key ${t}`);if(!e)
throw new Error("Remote static does not exist");const i=O0(e);if(!await s.verify(i,r.identitySig))throw new Error("Inval\
id payload signature");return r}catch(r){throw new Ah(r.message)}}function O0(n){const e=Cr("noise-libp2p-static-key:");
return n instanceof Uint8Array?Gi([e,n],e.length+n.length):(n.prepend(e),n)}class vF extends Rh{stream;handshake;metrics;decoder;constructor(e,t,r){
super({log:e.log,inactivityTimeout:e.inactivityTimeout,maxReadBufferLength:e.maxReadBufferLength,direction:e.direction}),
this.stream=e,this.handshake=t,this.metrics=r,this.decoder=new T1({lengthDecoder:Ka,maxBufferSize:16*1024*1024,encodingLength:()=>2});
const s=c=>{try{for(const l of this.decoder.decode(c.data))this.onData(this.decrypt(l))}catch(l){this.abort(l)}};this.stream.
addEventListener("message",s);const i=c=>{c.error!=null?c.local===!0?this.abort(c.error):this.onRemoteReset():this.onTransportClosed()};
this.stream.addEventListener("close",i);const o=()=>{this.safeDispatchEvent("drain")};this.stream.addEventListener("drai\
n",o);const a=()=>{this.onRemoteCloseWrite()};this.stream.addEventListener("remoteCloseWrite",a)}encrypt(e){const t=new Tn;
for(let r=0;r<e.byteLength;r+=Eg){let s=r+Eg;s>e.byteLength&&(s=e.byteLength);let i;e instanceof Uint8Array?i=this.handshake.
encrypt(e.subarray(r,s)):i=this.handshake.encrypt(e.sublist(r,s)),this.metrics?.encryptedPackets.increment(),t.append(Wa(
i.byteLength)),t.append(i)}return t}decrypt(e){const t=new Tn;for(let r=0;r<e.byteLength;r+=Bi){let s=r+Bi;if(s>e.byteLength&&
(s=e.byteLength),s-_g<r)throw new Error("Invalid chunk");let i;e instanceof Uint8Array?i=e.subarray(r,s):i=e.sublist(r,s);
const o=e.subarray(r,s-_g);try{const a=this.handshake.decrypt(i,o);this.metrics?.decryptedPackets.increment(),t.append(a)}catch(a){
throw this.metrics?.decryptErrors.increment(),a}}return t}close(e){return this.stream.close(e)}sendPause(){this.stream.pause()}sendResume(){
this.stream.resume()}sendReset(e){this.stream.abort(e)}sendData(e){return{sentBytes:e.byteLength,canSendMore:this.stream.
send(this.encrypt(e))}}}function xg(n,e,t){return new vF(n,e,t)}async function SF(n,e){const{log:t,connection:r,crypto:s,
privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=n,u=await F0(i,a.publicKey,l),h=new N0({crypto:s,protocolName:"\
Noise_XX_25519_ChaChaPoly_SHA256",initiator:!0,prologue:o,s:a});$0(h.s,t),t.trace("Stage 0 - Initiator starting to send \
first message."),await r.write(h.writeMessageA(os),e),t.trace("Stage 0 - Initiator finished sending first message."),k0(
h.e,t),t.trace("Stage 1 - Initiator waiting to receive first message from responder...");const f=h.readMessageB(await r.
read(e));t.trace("Stage 1 - Initiator received the message."),L0(h.re,t),dF(h.rs,t),t.trace("Initiator going to check re\
mote's signature...");const p=await U0(f,h.rs,c);t.trace("All good with the signature!"),t.trace("Stage 2 - Initiator se\
nding third handshake message."),await r.write(h.writeMessageC(u),e),t.trace("Stage 2 - Initiator sent message with sign\
ed payload.");const[A,y]=h.ss.split();return R0(A,y,t),{payload:p,encrypt:I=>A.encryptWithAd(os,I),decrypt:(I,d)=>y.decryptWithAd(
os,I,d)}}async function AF(n,e){const{log:t,connection:r,crypto:s,privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=n,
u=await F0(i,a.publicKey,l),h=new N0({crypto:s,protocolName:"Noise_XX_25519_ChaChaPoly_SHA256",initiator:!1,prologue:o,s:a});
$0(h.s,t),t.trace("Stage 0 - Responder waiting to receive first message."),h.readMessageA(await r.read(e)),t.trace("Stag\
e 0 - Responder received first message."),L0(h.re,t),t.trace("Stage 1 - Responder sending out first message with signed \
payload and static key."),await r.write(h.writeMessageB(u),e),t.trace("Stage 1 - Responder sent the second handshake mes\
sage with signed payload."),k0(h.e,t),t.trace("Stage 2 - Responder waiting for third handshake message...");const f=h.readMessageC(
await r.read(e));t.trace("Stage 2 - Responder received the message, finished handshake.");const p=await U0(f,h.rs,c),[A,
y]=h.ss.split();return R0(A,y,t),{payload:p,encrypt:I=>y.encryptWithAd(os,I),decrypt:(I,d)=>A.decryptWithAd(os,I,d)}}class EF{protocol="\
/noise";crypto;prologue;staticKey;extensions;metrics;components;log;constructor(e,t={}){const{staticNoiseKey:r,extensions:s,
crypto:i,prologueBytes:o}=t,{metrics:a}=e;this.components=e,this.log=e.logger.forComponent("libp2p:noise");const c=i??lF;
this.crypto=uF(c),this.extensions={webtransportCerthashes:[],...s},this.metrics=a?hF(a):void 0,r?this.staticKey=c.generateX25519KeyPairFromSeed(
r):this.staticKey=c.generateX25519KeyPair(),this.prologue=o??kn(0)}[Symbol.toStringTag]="@libp2p/noise";[rt]=["@libp2p/c\
onnection-encryption","@libp2p/noise"];async secureOutbound(e,t){const r=e.log?.newScope("noise")??this.log,s=ba(e,{lengthEncoder:Wa,
lengthDecoder:Ka,maxDataLength:Bi}),i=await this.performHandshakeInitiator(s,this.components.privateKey,r,t?.remotePeer?.
publicKey,t),o=Xt(i.payload.identityKey);return{connection:xg(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,
remotePeer:Lt(o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}getStreamMuxer(e){
if(e==null||e.length===0)return;const t=this.components.upgrader.getStreamMuxers();if(t!=null)for(const r of e){const s=t.
get(r);if(s!=null)return s}if(e.length)throw new hu("Early muxer negotiation was requested but the initiator and respond\
er had no common muxers")}async secureInbound(e,t){const r=e.log?.newScope("noise")??this.log,s=ba(e,{lengthEncoder:Wa,lengthDecoder:Ka,
maxDataLength:Bi}),i=await this.performHandshakeResponder(s,this.components.privateKey,r,t?.remotePeer?.publicKey,t),o=Xt(
i.payload.identityKey);return{connection:xg(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,remotePeer:Lt(
o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}async performHandshakeInitiator(e,t,r,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await SF(
{connection:e,privateKey:t,remoteIdentityKey:s,log:r.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}async performHandshakeResponder(e,t,r,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await AF(
{connection:e,privateKey:t,remoteIdentityKey:s,log:r.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}}function _F(n={}){return e=>new EF(e,
n)}var oh;(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.id!=null&&(r.uint32(
10),r.bytes(t.id)),t.pubkey!=null&&(r.uint32(18),Ha.codec().encode(t.pubkey,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.id=t.bytes();break}case 2:{
i.pubkey=Ha.codec().decode(t,t.uint32(),{limits:s.limits?.pubkey});break}default:{t.skipType(a&7);break}}}return i})),e),
n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(oh||(oh={}));var Ar;(function(n){n.RSA="RSA",n.Ed25519="\
Ed25519",n.secp256k1="secp256k1",n.ECDSA="ECDSA"})(Ar||(Ar={}));var ah;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed2\
5519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=3]="ECDSA"})(ah||(ah={}));(function(n){n.codec=()=>uS(ah)})(Ar||(Ar={}));var Ha;
(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.Type!=null&&(r.uint32(8),
Ar.codec().encode(t.Type,r)),t.Data!=null&&t.Data.byteLength>0&&(r.uint32(18),r.bytes(t.Data)),s.lengthDelimited!==!1&&r.
ldelim()},(t,r,s={})=>{const i={Data:kn(0)},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{
i.Type=Ar.codec().decode(t);break}case 2:{i.Data=t.bytes();break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=
t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Ha||(Ha={}));const xF="/plaintext/2.0.0";class CF{protocol=xF;privateKey;log;constructor(e){
this.privateKey=e.privateKey,this.log=e.logger.forComponent("libp2p:plaintext")}[Symbol.toStringTag]="@libp2p/plaintext";[rt]=[
"@libp2p/connection-encryption"];async secureInbound(e,t){return this._encrypt(e,t)}async secureOutbound(e,t){return this.
_encrypt(e,t)}async _encrypt(e,t){const r=e.log?.newScope("plaintext")??this.log,s=Rt(e).pb(oh);r("write pubkey exchange\
 to peer %p",t?.remotePeer);const i=this.privateKey.publicKey;await s.write({id:i.toMultihash().bytes,pubkey:{Type:Ar[i.
type],Data:i.raw}},t);const o=await s.read(t);let a;try{if(o.pubkey==null)throw new ta("Public key missing");if(o.pubkey.
Data.byteLength===0)throw new ta("Public key data too short");if(o.id==null)throw new ta("Remote id missing");const c=hS(
o.pubkey.Data);if(a=Lt(c),!dS(a.toMultihash().bytes,o.id))throw new hu("Public key did not match id")}catch(c){throw r.error(
"invalid public key - %e",c),new hu(`Invalid public key - ${c.message}`)}if(t?.remotePeer!=null&&!a.equals(t?.remotePeer))
throw new Ah;return r("plaintext key exchange completed successfully with peer %p",a),{connection:s.unwrap().unwrap(),remotePeer:a}}}
function IF(){return n=>new CF(n)}function hn(n=0){return new Uint8Array(n)}function ch(n=0){return new Uint8Array(n)}function TF(n){
return n?.buffer instanceof ArrayBuffer}function DF(n){if(TF(n))return n;const e=n.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function Cg(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=ch(e);let r=0;for(const s of n)t.set(
s,r),r+=s.length;return DF(t)}function PF(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.
byteLength;t++)if(n[t]!==e[t])return!1;return!0}const B0=Symbol.for("@achingbrain/uint8arraylist");function Ig(n,e){if(e==
null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{
buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Fo(n){return!!n?.[B0]}let z0=class ha{bufs;length;[B0]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(Fo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Fo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=Ig(this.bufs,e);return t.buf[t.index]}set(e,t){const r=Ig(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Fo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Cg(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:Cg(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new ha;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Fo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=ch(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=hn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=hn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=hn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=ch(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=hn(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=hn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=hn(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=hn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=hn(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof ha)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!PF(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new ha;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};var le;(function(n){n[n.Data=
0]="Data",n[n.WindowUpdate=1]="WindowUpdate",n[n.Ping=2]="Ping",n[n.GoAway=3]="GoAway"})(le||(le={}));var q;(function(n){
n[n.SYN=1]="SYN",n[n.ACK=2]="ACK",n[n.FIN=4]="FIN",n[n.RST=8]="RST"})(q||(q={}));Object.values(q).filter(n=>typeof n!="s\
tring");const MF=0;var it;(function(n){n[n.NormalTermination=0]="NormalTermination",n[n.ProtocolError=1]="ProtocolError",
n[n.InternalError=2]="InternalError"})(it||(it={}));const Zn=12;class Fc extends Error{static name="ProtocolError";reason;constructor(e,t){
super(e),this.name="ProtocolError",this.reason=t}}function $F(n){return n?.reason!==null}class Jr extends Fc{static name="\
InvalidFrameError";constructor(e="The frame was invalid"){super(e,it.ProtocolError),this.name="InvalidFrameError"}}class kF extends Fc{static name="\
UnRequestedPingError";constructor(e="Un-requested ping error"){super(e,it.ProtocolError),this.name="UnRequestedPingError"}}
class LF extends Fc{static name="NotMatchingPingError";constructor(e="Not matching ping error"){super(e,it.ProtocolError),
this.name="NotMatchingPingError"}}class RF extends Fc{static name="ReceiveWindowExceededError";constructor(e="Receive wi\
ndow exceeded"){super(e,it.ProtocolError),this.name="ReceiveWindowExceededError"}}const V0=256*1024,NF=16*1024*1024,Uo={
enableKeepAlive:!0,keepAliveInterval:3e4,maxInboundStreams:1e3,maxOutboundStreams:1e3};function FF(n){if(n.keepAliveInterval!=
null&&n.keepAliveInterval<=0)throw new P("keep-alive interval must be positive");if(n.maxInboundStreams!=null&&n.maxInboundStreams<
0)throw new P("max inbound streams must be larger or equal 0");if(n.maxOutboundStreams!=null&&n.maxOutboundStreams<0)throw new P(
"max outbound streams must be larger or equal 0");if(n.maxMessageSize!=null&&n.maxMessageSize<1024)throw new P("MaxMessa\
geSize must be greater than a kilobyte");if(n.streamOptions?.initialStreamWindowSize!=null&&n.streamOptions?.initialStreamWindowSize<
V0)throw new P("InitialStreamWindowSize must be larger or equal 256 kB");if(n.streamOptions?.maxStreamWindowSize!=null&&
n.streamOptions?.initialStreamWindowSize!=null&&n.streamOptions?.maxStreamWindowSize<n.streamOptions?.initialStreamWindowSize)
throw new P("MaxStreamWindowSize must be larger than the InitialStreamWindowSize");if(n.streamOptions?.maxStreamWindowSize!=
null&&n.streamOptions?.maxStreamWindowSize>2**32-1)throw new P("MaxStreamWindowSize must be less than equal MAX_UINT32")}
function UF(n){return n.header.type===le.Data&&n.data!==null}const Tg=2**24;function OF(n){if(n[0]!==MF)throw new Jr("In\
valid frame version");return{type:n[1],flag:(n[2]<<8)+n[3],streamID:n[4]*Tg+(n[5]<<16)+(n[6]<<8)+n[7],length:n[8]*Tg+(n[9]<<
16)+(n[10]<<8)+n[11]}}let BF=class{buffer;constructor(){this.buffer=new z0}*emitFrames(e){for(this.buffer.append(e);;){const t=this.
readFrame();if(t===void 0)break;yield t}}readFrame(){let e=Zn;if(this.buffer.byteLength<Zn)return;const t=OF(this.buffer.
subarray(0,Zn));if(t.type===le.Data){if(e+=t.length,this.buffer.byteLength<e)return;const r=this.buffer.sublist(Zn,e);return this.
buffer.consume(e),{header:t,data:r}}return this.buffer.consume(e),{header:t}}};function Dg(n){const e=new Uint8Array(Zn);
return e[1]=n.type,e[2]=n.flag>>>8,e[3]=n.flag,e[4]=n.streamID>>>24,e[5]=n.streamID>>>16,e[6]=n.streamID>>>8,e[7]=n.streamID,
e[8]=n.length>>>24,e[9]=n.length>>>16,e[10]=n.length>>>8,e[11]=n.length,e}var Je;(function(n){n[n.Init=0]="Init",n[n.SYNSent=
1]="SYNSent",n[n.SYNReceived=2]="SYNReceived",n[n.Established=3]="Established",n[n.Finished=4]="Finished",n[n.Paused=5]=
"Paused"})(Je||(Je={}));class zF extends fb{streamId;state;sendWindowCapacity;recvWindow;recvWindowCapacity;maxStreamWindowSize;epochStart;getRTT;sendFrame;constructor(e){
const t=e.initialStreamWindowSize??V0;super({...e,maxMessageSize:t-Zn}),this.streamId=e.streamId,this.state=e.state,this.
sendWindowCapacity=t,this.recvWindow=t,this.recvWindowCapacity=this.recvWindow,this.maxStreamWindowSize=e.maxStreamWindowSize??
NF,this.epochStart=Date.now(),this.getRTT=e.getRTT,this.sendFrame=e.sendFrame;const r=()=>{this.state=Je.Finished};this.
addEventListener("close",r)}sendData(e){const t=e.byteLength;let r=0,s=!0;for(this.log?.trace("send window capacity is %\
d bytes",this.sendWindowCapacity);e.byteLength>0;){if(this.sendWindowCapacity===0){s=!1,this.log?.trace("sent %d/%d byte\
s, exhausted send window, waiting for window update",r,t);break}const i=Math.min(this.sendWindowCapacity,e.byteLength),o=this.
getSendFlags(),a=e.sublist(0,i);e.consume(i);const c=this.sendFrame({type:le.Data,flag:o,streamID:this.streamId,length:i},
a);if(this.sendWindowCapacity-=i,r+=i,!c){s=c,this.log.trace("sent %d/%d bytes, wait for muxer to have more send capacit\
y",r,t);break}}return{sentBytes:r,canSendMore:s}}sendReset(){this.sendFrame({type:le.WindowUpdate,flag:q.RST,streamID:this.
streamId,length:0})}async sendCloseWrite(){const e=this.getSendFlags()|q.FIN;this.sendFrame({type:le.WindowUpdate,flag:e,
streamID:this.streamId,length:0})}async sendCloseRead(e){e?.signal?.throwIfAborted()}sendPause(){this.state=Je.Paused}sendResume(){
this.state=Je.Established,this.sendWindowUpdate()}handleWindowUpdate(e){this.processFlags(e.header.flag),this.sendWindowCapacity+=
e.header.length,this.maxMessageSize=this.sendWindowCapacity-Zn,this.maxMessageSize<0&&(this.maxMessageSize=0),this.maxMessageSize!==
0&&this.writeBuffer.byteLength>0&&(this.log?.trace("window update of %d bytes allows more data to be sent, have %d bytes\
 queued, sending data %s",e.header.length,this.writeBuffer.byteLength,this.sendingData),this.safeDispatchEvent("drain"))}handleData(e){
if(!UF(e))throw new Jr("Frame was not data frame");if(this.processFlags(e.header.flag),this.recvWindowCapacity<e.header.
length)throw new RF("Receive window exceeded");this.recvWindowCapacity-=e.header.length,this.onData(e.data),this.sendWindowUpdate()}processFlags(e){
(e&q.ACK)===q.ACK&&this.state===Je.SYNSent&&(this.state=Je.Established),(e&q.FIN)===q.FIN&&this.onRemoteCloseWrite(),(e&
q.RST)===q.RST&&this.onRemoteReset()}getSendFlags(){switch(this.state){case Je.Init:return this.state=Je.SYNSent,q.SYN;case Je.
SYNReceived:return this.state=Je.Established,q.ACK;default:return 0}}sendWindowUpdate(){if(this.state===Je.Paused){this.
epochStart=Date.now();return}const e=this.getSendFlags(),t=Date.now(),r=this.getRTT();if(e===0&&r>-1&&t-this.epochStart<=
r*4&&(this.recvWindow=Math.min(this.recvWindow*2,this.maxStreamWindowSize)),this.recvWindowCapacity>=this.recvWindow&&e===
0)return;const s=this.recvWindow-this.recvWindowCapacity;this.recvWindowCapacity=this.recvWindow,this.epochStart=t,this.
sendFrame({type:le.WindowUpdate,flag:e,streamID:this.streamId,length:s})}}function Pg(n){return{type:le[n.type],flags:[(n.
flag&q.SYN)===q.SYN?"SYN":void 0,(n.flag&q.ACK)===q.ACK?"ACK":void 0,(n.flag&q.FIN)===q.FIN?"FIN":void 0,(n.flag&q.RST)===
q.RST?"RST":void 0].filter(Boolean),streamID:n.streamID,length:n.length}}const q0="/yamux/1.0.0";class VF{protocol=q0;_init;constructor(e={}){
this._init=e}[Symbol.toStringTag]="@libp2p/yamux";[rt]=["@libp2p/stream-multiplexing"];createStreamMuxer(e){return new qF(
e,{...this._init})}}class qF extends db{nextStreamID;nextPingID;activePing;rtt;client;localGoAway;remoteGoAway;numInboundStreams;numOutboundStreams;decoder;keepAlive;enableKeepAlive;keepAliveInterval;maxInboundStreams;maxOutboundStreams;constructor(e,t={}){
super(e,{...t,protocol:q0,name:"yamux"}),this.client=e.direction==="outbound",FF(t),this.enableKeepAlive=t.enableKeepAlive??
Uo.enableKeepAlive,this.keepAliveInterval=t.keepAliveInterval??Uo.keepAliveInterval,this.maxInboundStreams=t.maxInboundStreams??
Uo.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams??Uo.maxOutboundStreams,this.decoder=new BF,this.numInboundStreams=
0,this.numOutboundStreams=0,this.nextStreamID=this.client?1:2,this.nextPingID=0,this.rtt=-1,this.log.trace("muxer create\
d"),this.enableKeepAlive&&(this.log.trace("muxer keepalive enabled interval=%s",this.keepAliveInterval),this.keepAlive=Sb(
async r=>{try{await this.ping(r)}catch(s){this.log.error("ping error: %s",s)}},this.keepAliveInterval,{runImmediately:!0}),
this.keepAlive.start())}onData(e){for(const t of this.decoder.emitFrames(e))this.handleFrame(t)}onCreateStream(){if(this.
remoteGoAway!==void 0)throw new Gs("Muxer closed remotely");if(this.localGoAway!==void 0)throw new Gs("Muxer closed loca\
lly");const e=this.nextStreamID;if(this.nextStreamID+=2,this.numOutboundStreams>=this.maxOutboundStreams)throw new Fm("m\
ax outbound streams exceeded");this.log.trace("new outgoing stream id=%s",e);const t=this._newStream(e,Je.Init,"outbound");
return this.numOutboundStreams++,queueMicrotask(()=>{t.sendWindowUpdate()}),t}async ping(e){if(this.remoteGoAway!==void 0)
throw new Gs("Muxer closed remotely");if(this.localGoAway!==void 0)throw new Gs("Muxer closed locally");if(this.activePing!=
null)return Dt(this.activePing.promise,e?.signal);this.activePing=Object.assign(Promise.withResolvers(),{id:this.nextPingID++,
start:Date.now()}),this.sendPing(this.activePing.id);try{this.rtt=await Dt(this.activePing.promise,e?.signal)}finally{this.
activePing=void 0}return this.rtt}getRTT(){return this.rtt}async close(e={}){if(this.status==="open")try{const t=e?.reason??
it.NormalTermination;this.log.trace("muxer close reason=%s",it[t]),await super.close(e),this.sendGoAway(t)}finally{this.
keepAlive?.stop()}}abort(e){if(this.status==="open")try{super.abort(e);let t=it.InternalError;$F(e)&&(t=e.reason),this.log.
error("muxer abort reason=%s error=%s",t,e),this.sendGoAway(t)}finally{this.keepAlive?.stop()}}onTransportClosed(){try{super.
onTransportClosed()}finally{this.keepAlive?.stop()}}_newStream(e,t,r){if(this.streams.find(i=>i.streamId===e)!=null)throw new P(
"Stream already exists with that id");const s=new zF({...this.streamOptions,id:`${e}`,streamId:e,state:t,direction:r,sendFrame:this.
sendFrame.bind(this),log:this.log.newScope(`${r}:${e}`),getRTT:this.getRTT.bind(this)});return s.addEventListener("close",
()=>{this.closeStream(e)},{once:!0}),s}closeStream(e){this.client===(e%2===0)?this.numInboundStreams--:this.numOutboundStreams--}handleFrame(e){
const{streamID:t,type:r,length:s}=e.header;if(this.log.trace("received frame %o",Pg(e.header)),t===0)switch(r){case le.Ping:{
this.handlePing(e.header);return}case le.GoAway:{this.handleGoAway(s);return}default:throw new Jr("Invalid frame type")}else
switch(e.header.type){case le.Data:case le.WindowUpdate:{this.handleStreamMessage(e);return}default:throw new Jr("Invali\
d frame type")}}handlePing(e){if(e.flag===q.SYN)this.log.trace("received ping request pingId=%s",e.length),this.sendPing(
e.length,q.ACK);else if(e.flag===q.ACK)this.log.trace("received ping response pingId=%s",e.length),this.handlePingResponse(
e.length);else throw new Jr("Invalid frame flag")}handlePingResponse(e){if(this.activePing===void 0)throw new kF("ping n\
ot requested");if(this.activePing.id!==e)throw new LF("ping doesn't match our id");this.activePing.resolve(Date.now()-this.
activePing.start)}handleGoAway(e){this.log.trace("received GoAway reason=%s",it[e]??"unknown"),this.remoteGoAway=e,e===it.
NormalTermination?this.onTransportClosed():this.abort(new Error("Remote sent GoAway"))}handleStreamMessage(e){const{streamID:t,
flag:r,type:s}=e.header;(r&q.SYN)===q.SYN&&this.incomingStream(t);const i=this.streams.find(o=>o.streamId===t);if(i===void 0){
this.log.trace("frame for missing stream id=%s",t);return}switch(s){case le.WindowUpdate:{i.handleWindowUpdate(e);return}case le.
Data:{i.handleData(e);return}default:throw new Error("unreachable")}}incomingStream(e){if(this.client!==(e%2===0))throw new P(
"Both endpoints are clients");if(this.streams.find(r=>r.streamId===e))return;if(this.log.trace("new incoming stream id=%\
s",e),this.localGoAway!==void 0){this.sendFrame({type:le.WindowUpdate,flag:q.RST,streamID:e,length:0});return}if(this.numInboundStreams>=
this.maxInboundStreams){this.log("maxIncomingStreams exceeded, forcing stream reset"),this.sendFrame({type:le.WindowUpdate,
flag:q.RST,streamID:e,length:0});return}const t=this._newStream(e,Je.SYNReceived,"inbound");this.numInboundStreams++,this.
onRemoteStream(t)}sendFrame(e,t){let r;if(e.type===le.Data){if(t==null)throw new Jr("Invalid frame");r=new z0(Dg(e),t)}else
r=Dg(e);return this.log.trace("sending frame %o",Pg(e)),this.send(r)}sendPing(e,t=q.SYN){t===q.SYN?this.log.trace("sendi\
ng ping request pingId=%s",e):this.log.trace("sending ping response pingId=%s",e),this.sendFrame({type:le.Ping,flag:t,streamID:0,
length:e})}sendGoAway(e=it.NormalTermination){this.log("sending GoAway reason=%s",it[e]),this.localGoAway=e,this.sendFrame(
{type:le.GoAway,flag:0,streamID:0,length:e})}}function WF(n={}){return()=>new VF(n)}const KF=Symbol.for("@libp2p/pubsub");
let GF=class{entries;validityMs;lastPruneTime=0;constructor(e){this.entries=new Map,this.validityMs=e.validityMs}put(e,t){
this.entries.set(e,{value:t,validUntilMs:Date.now()+this.validityMs}),this.prune()}prune(){const e=Date.now();if(!(e-this.
lastPruneTime<200)){this.lastPruneTime=e;for(const[t,r]of this.entries.entries())if(r.validUntilMs<e)this.entries.delete(
t);else break}}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);return t!=null&&t.validUntilMs>=Date.
now()?t.value:void 0}clear(){this.entries=new Map,this.lastPruneTime=0}};var zi;(function(n){(function(t){let r;t.codec=
()=>(r==null&&(r=ne((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.subscribe!=null&&(i.uint32(8),i.bool(s.subscribe)),s.
topic!=null&&(i.uint32(18),i.string(s.topic)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:
s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.subscribe=s.bool();break}case 2:{a.topic=s.string();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.SubOpts||(n.SubOpts=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.from!=null&&(i.uint32(
10),i.bytes(s.from)),s.data!=null&&(i.uint32(18),i.bytes(s.data)),s.sequenceNumber!=null&&(i.uint32(26),i.bytes(s.sequenceNumber)),
s.topic!=null&&(i.uint32(34),i.string(s.topic)),s.signature!=null&&(i.uint32(42),i.bytes(s.signature)),s.key!=null&&(i.uint32(
50),i.bytes(s.key)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.
uint32();switch(l>>>3){case 1:{a.from=s.bytes();break}case 2:{a.data=s.bytes();break}case 3:{a.sequenceNumber=s.bytes();
break}case 4:{a.topic=s.string();break}case 5:{a.signature=s.bytes();break}case 6:{a.key=s.bytes();break}default:{s.skipType(
l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.Message||(n.Message={}));let e;
n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.subscriptions!=null)for(const i of t.subscriptions)
r.uint32(10),n.SubOpts.codec().encode(i,r);if(t.messages!=null)for(const i of t.messages)r.uint32(18),n.Message.codec().
encode(i,r);t.control!=null&&(r.uint32(26),Xa.codec().encode(t.control,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={subscriptions:[],messages:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.
limits?.subscriptions!=null&&i.subscriptions.length===s.limits.subscriptions)throw new oe('Decode error - map field "sub\
scriptions" had too many elements');i.subscriptions.push(n.SubOpts.codec().decode(t,t.uint32(),{limits:s.limits?.subscriptions$}));
break}case 2:{if(s.limits?.messages!=null&&i.messages.length===s.limits.messages)throw new oe('Decode error - map field \
"messages" had too many elements');i.messages.push(n.Message.codec().decode(t,t.uint32(),{limits:s.limits?.messages$}));
break}case 3:{i.control=Xa.codec().decode(t,t.uint32(),{limits:s.limits?.control});break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(zi||(zi={}));var Xa;(function(n){let e;n.
codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.ihave!=null)for(const i of t.ihave)r.uint32(
10),Qa.codec().encode(i,r);if(t.iwant!=null)for(const i of t.iwant)r.uint32(18),Ya.codec().encode(i,r);if(t.graft!=null)
for(const i of t.graft)r.uint32(26),Ja.codec().encode(i,r);if(t.prune!=null)for(const i of t.prune)r.uint32(34),Za.codec().
encode(i,r);s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={ihave:[],iwant:[],graft:[],prune:[]},o=r==null?t.len:
t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.ihave!=null&&i.ihave.length===s.limits.ihave)
throw new oe('Decode error - map field "ihave" had too many elements');i.ihave.push(Qa.codec().decode(t,t.uint32(),{limits:s.
limits?.ihave$}));break}case 2:{if(s.limits?.iwant!=null&&i.iwant.length===s.limits.iwant)throw new oe('Decode error - m\
ap field "iwant" had too many elements');i.iwant.push(Ya.codec().decode(t,t.uint32(),{limits:s.limits?.iwant$}));break}case 3:{
if(s.limits?.graft!=null&&i.graft.length===s.limits.graft)throw new oe('Decode error - map field "graft" had too many el\
ements');i.graft.push(Ja.codec().decode(t,t.uint32(),{limits:s.limits?.graft$}));break}case 4:{if(s.limits?.prune!=null&&
i.prune.length===s.limits.prune)throw new oe('Decode error - map field "prune" had too many elements');i.prune.push(Za.codec().
decode(t,t.uint32(),{limits:s.limits?.prune$}));break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.
codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Xa||(Xa={}));var Qa;(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{
if(s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(10),r.string(t.topic)),t.messageIDs!=null)for(const i of t.
messageIDs)r.uint32(18),r.bytes(i);s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={messageIDs:[]},o=r==null?t.
len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}case 2:{if(s.limits?.messageIDs!=
null&&i.messageIDs.length===s.limits.messageIDs)throw new oe('Decode error - map field "messageIDs" had too many element\
s');i.messageIDs.push(t.bytes());break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.codec()),n.decode=
(t,r)=>se(t,n.codec(),r)})(Qa||(Qa={}));var Ya;(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.lengthDelimited!==
!1&&r.fork(),t.messageIDs!=null)for(const i of t.messageIDs)r.uint32(10),r.bytes(i);s.lengthDelimited!==!1&&r.ldelim()},
(t,r,s={})=>{const i={messageIDs:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.
limits?.messageIDs!=null&&i.messageIDs.length===s.limits.messageIDs)throw new oe('Decode error - map field "messageIDs" \
had too many elements');i.messageIDs.push(t.bytes());break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(
t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Ya||(Ya={}));var Ja;(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{
s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(10),r.string(t.topic)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{
const i={},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}default:{
t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Ja||(Ja={}));var Za;
(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.topic!=null&&(r.uint32(
10),r.string(t.topic)),t.peers!=null)for(const i of t.peers)r.uint32(18),ec.codec().encode(i,r);t.backoff!=null&&(r.uint32(
24),r.uint64(t.backoff)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={peers:[]},o=r==null?t.len:t.pos+r;for(;t.
pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.topic=t.string();break}case 2:{if(s.limits?.peers!=null&&i.peers.length===
s.limits.peers)throw new oe('Decode error - map field "peers" had too many elements');i.peers.push(ec.codec().decode(t,t.
uint32(),{limits:s.limits?.peers$}));break}case 3:{i.backoff=t.uint64();break}default:{t.skipType(a&7);break}}}return i})),
e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(Za||(Za={}));var ec;(function(n){let e;n.codec=()=>(e==
null&&(e=ne((t,r,s={})=>{s.lengthDelimited!==!1&&r.fork(),t.peerID!=null&&(r.uint32(10),r.bytes(t.peerID)),t.signedPeerRecord!=
null&&(r.uint32(18),r.bytes(t.signedPeerRecord)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={},o=r==null?t.
len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{i.peerID=t.bytes();break}case 2:{i.signedPeerRecord=
t.bytes();break}default:{t.skipType(a&7);break}}}return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),
r)})(ec||(ec={}));class jF extends ue{peerId;shutDownController;inboundPb;outboundPb;constructor(e){super(),this.peerId=
e,this.shutDownController=new AbortController}attachInboundStream(e,t){this.inboundPb=Rt(e,t).pb(zi),Promise.resolve().then(
async()=>{for(;;){if(this.inboundPb==null)return;const r=await this.inboundPb.read({signal:this.shutDownController.signal});
this.safeDispatchEvent("message",{detail:r})}}).catch(r=>{this.inboundPb?.unwrap().unwrap().abort(r)})}attachOutboundStream(e,t){
this.outboundPb=Rt(e,t).pb(zi)}write(e){this.outboundPb!=null&&this.outboundPb.write(e,{signal:this.shutDownController.signal}).
catch(t=>{this.outboundPb?.unwrap().unwrap().abort(t)})}close(){this.shutDownController.abort(),Promise.all([this.inboundPb?.
unwrap().unwrap().close().catch(e=>{this.inboundPb?.unwrap().unwrap().abort(e)}),this.outboundPb?.unwrap().unwrap().close().
catch(e=>{this.inboundPb?.unwrap().unwrap().abort(e)})]).finally(()=>{this.safeDispatchEvent("close")})}}function HF(){return BigInt(
`0x${Ge(Hm(8),"base16")}`)}const XF=(n,e)=>{const t=Cr(e.toString(16).padStart(16,"0"),"base16"),r=Ir(n),s=new Uint8Array(
r.byteLength+t.length);return s.set(r,0),s.set(t,r.byteLength),s},QF=n=>qm.encode(n),YF=async n=>{if(n.sequenceNumber==null||
n.from==null||n.signature==null)return!1;const e=xr(hc(n.from));if(e.publicKey!=null)return!0;if(n.key!=null){const t=n.
key;return Lt(Xt(t)).equals(e)}return!1},JF=async n=>{if(n.from==null)throw new Q("RPC message was missing from");if(!await YF(
n))return{type:"unsigned",topic:n.topic??"",data:n.data??new Uint8Array(0)};const e=xr(hc(n.from)),t=n.key??e.publicKey;
if(t==null)throw new Q("RPC message was missing public key");return{type:"signed",from:e,topic:n.topic??"",sequenceNumber:e5(
n.sequenceNumber??new Uint8Array(0)),data:n.data??new Uint8Array(0),signature:n.signature??new Uint8Array(0),key:t instanceof
Uint8Array?Xt(t):t}},Sd=n=>n.type==="signed"?{from:n.from.toMultihash().bytes,data:n.data,sequenceNumber:ZF(n.sequenceNumber),
topic:n.topic,signature:n.signature,key:n.key?Ir(n.key):void 0}:{data:n.data,topic:n.topic},ZF=n=>{let e=n.toString(16);
return e.length%2!==0&&(e=`0${e}`),Cr(e,"base16")},e5=n=>BigInt(`0x${Ge(n,"base16")}`),W0=Cr("libp2p-pubsub:");async function t5(n,e,t){
const r={type:"signed",topic:e.topic,data:e.data,sequenceNumber:e.sequenceNumber,from:Um(n)},s=Gi([W0,t(Sd(r)).subarray()]);
return r.signature=await n.sign(s),r.key=n.publicKey,r}async function n5(n,e){if(n.type!=="signed")throw new Error('Mess\
age type must be "signed" to be verified');if(n.signature==null)throw new Error("Message must contain a signature to be \
verified");if(n.from==null)throw new Error("Message must contain a from property to be verified");const t=Gi([W0,e({...Sd(
n),signature:void 0,key:void 0}).subarray()]);return r5(n).verify(t,n.signature)}function r5(n){if(n.type!=="signed")throw new Error(
'Message type must be "signed" to have a public key');if(n.from==null)throw new Error("Could not get the public key from\
 the originator id");if(n.key!=null)return n.key;if(n.from.publicKey!=null)return n.from.publicKey;throw new Error("Coul\
d not get the public key from the originator id")}class s5 extends ue{log;started;topics;subscriptions;peers;globalSignaturePolicy;canRelayMessage;emitSelf;topicValidators;queue;protocol;components;_registrarTopologyId;maxInboundStreams;maxOutboundStreams;seenCache;constructor(e,t){
super(),this.log=e.logger.forComponent("libp2p:floodsub"),this.components=e,this.protocol=t.protocol??i5,this.started=!1,
this.topics=new Map,this.subscriptions=new Set,this.peers=new Dr,this.globalSignaturePolicy=t.globalSignaturePolicy==="S\
trictNoSign"?"StrictNoSign":"StrictSign",this.canRelayMessage=t.canRelayMessage??!0,this.emitSelf=t.emitSelf??!1,this.topicValidators=
new Map,this.queue=new pw({concurrency:t.messageProcessingConcurrency??10}),this.maxInboundStreams=t.maxInboundStreams??
1,this.maxOutboundStreams=t.maxOutboundStreams??1,this.seenCache=new GF({validityMs:t?.seenTTL??3e4}),this._onIncomingStream=
this._onIncomingStream.bind(this),this._onPeerConnected=this._onPeerConnected.bind(this),this._onPeerDisconnected=this._onPeerDisconnected.
bind(this)}[KF]=!0;[Symbol.toStringTag]="@libp2p/floodsub";[rt]=["@libp2p/pubsub"];[us]=["@libp2p/identify"];async start(){
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
p",e);const s=new jF(e);return this.peers.set(e,s),s.addEventListener("message",i=>{const o=i.detail,a=[];for(const c of o.
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
 we didn't subscribe to. Dropping."),!1;try{const o=await JF(i);await this.processMessage(e.peerId,o)}catch(o){this.log.
error("failed to queue messages from %p - %e",e.peerId,o)}})).catch(i=>{this.log(i)})),!0}processRpcSubOpt(e,t){const r=t.
topic;if(r==null)return;let s=this.topics.get(r);s==null&&(s=new sr,this.topics.set(r,s)),t.subscribe===!0?s.add(e):s.delete(
e)}async processMessage(e,t){if(this.components.peerId.equals(e)&&!this.emitSelf)return;const r=await this.getMsgId(t),s=Ge(
r,"base64");if(!this.seenCache.has(s)){this.seenCache.put(s,!0);try{await this.validate(e,t)}catch(i){this.log("Message \
is invalid, dropping it. %O",i);return}this.subscriptions.has(t.topic)&&(!this.components.peerId.equals(e)||this.emitSelf)&&
super.dispatchEvent(new CustomEvent("message",{detail:t})),await this.publishMessage(e,t)}}getMsgId(e){switch(this.globalSignaturePolicy){case"\
StrictSign":if(e.type!=="signed")throw new Q('Message type should be "signed" when signature policy is StrictSign but it\
 was not');if(e.sequenceNumber==null)throw new Q("Need sequence number when signature policy is StrictSign but it was mi\
ssing");if(e.key==null)throw new Q("Need key when signature policy is StrictSign but it was missing");return XF(e.key,e.
sequenceNumber);case"StrictNoSign":return QF(e.data);default:throw new Q("Cannot get message id: unhandled signature pol\
icy")}}encodeMessage(e){return zi.Message.encode(e)}send(e,t){const{messages:r,subscriptions:s,subscribe:i}=t;this.sendRpc(
e,{subscriptions:(s??[]).map(o=>({topic:o,subscribe:!!i})),messages:(r??[]).map(Sd)})}sendRpc(e,t){const r=this.peers.get(
e);if(r==null){this.log.error("cannot send RPC to %p as there are no streams to it available",e);return}r.write(t)}async validate(e,t){
switch(this.globalSignaturePolicy){case"StrictNoSign":if(t.type!=="unsigned")throw new Q('Message type should be "unsign\
ed" when signature policy is StrictNoSign but it was not');if(t.signature!=null)throw new Q("StrictNoSigning: signature \
should not be present");if(t.key!=null)throw new Q("StrictNoSigning: key should not be present");if(t.sequenceNumber!=null)
throw new Q("StrictNoSigning: seqno should not be present");break;case"StrictSign":if(t.type!=="signed")throw new Q('Mes\
sage type should be "signed" when signature policy is StrictSign but it was not');if(t.signature==null)throw new Q("Stri\
ctSigning: Signing required and no signature was present");if(t.sequenceNumber==null)throw new Q("StrictSigning: Signing\
 required and no sequenceNumber was present");if(!await n5(t,this.encodeMessage.bind(this)))throw new Q("StrictSigning: \
Invalid message signature");break;default:throw new Q("Cannot validate message: unhandled signature policy")}const s=this.
topicValidators.get(t.topic);if(s!=null){const i=await s(e,t);if(i===tc.Reject||i===tc.Ignore)throw new Q("Message valid\
ation failed")}}async buildMessage(e){switch(this.globalSignaturePolicy){case"StrictSign":return t5(this.components.privateKey,
e,this.encodeMessage.bind(this));case"StrictNoSign":return Promise.resolve({type:"unsigned",...e});default:throw new Q("\
Cannot build message: unhandled signature policy")}}getSubscribers(e){if(!this.started)throw new vi("not started yet");if(e==
null)throw new P("Topic is required");const t=this.topics.get(e.toString());return t==null?[]:Array.from(t.values())}async publish(e,t){
if(!this.started)throw new Error("Pubsub has not started");const r={from:this.components.peerId,topic:e,data:t??new Uint8Array(
0),sequenceNumber:HF()};this.log("publish topic: %s from: %p data: %m",e,r.from,r.data);const s=await this.buildMessage(
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
throw new Error("Pubsub is not started");return Array.from(this.peers.keys())}}const i5="/floodsub/1.0.0";var tc;(function(n){
n.Accept="accept",n.Ignore="ignore",n.Reject="reject"})(tc||(tc={}));function o5(n={}){return e=>new s5(e,n)}const Ds=1e3,
Ad=60*Ds,Mg="/floodsub/1.0.0",$g="/meshsub/1.0.0",a5="/meshsub/1.1.0",Ul="/meshsub/1.2.0",c5=6,l5=4,u5=12,h5=4,d5=2,f5=5,
p5=3,g5=6,m5=.25,b5=3,kg=100,y5=Ds,w5=Ad,v5=16,S5=Ad,A5=10*Ds,E5=15,_5=300,x5=Ds,C5=60,I5=2,T5=10*Ds,Wr=5e3,D5=10,P5=3*Ds,
M5=2*Ad,$5=120*1e3,k5="ERR_TOPIC_VALIDATOR_REJECT",L5="ERR_TOPIC_VALIDATOR_IGNORE",R5=0,N5=128,F5=1e3,U5=1e3,O5=1,B5=512,
z5=512,V5=8,Ed=1024*1024*4;class q5 extends Error{name="InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class K0 extends Error{name="\
InvalidDataLengthError";code="ERR_MSG_DATA_TOO_LONG"}class W5 extends Error{name="InvalidDataLengthLengthError";code="ER\
R_MSG_LENGTH_TOO_LONG"}class Lg extends Error{name="UnexpectedEOFError";code="ERR_UNEXPECTED_EOF"}function G0(n){return n[Symbol.
asyncIterator]!=null}function j0(n,e){if(n.byteLength>e)throw new K0("Message length too long")}const Uc=n=>{const e=Wm(
n),t=Vm(e);return fS(n,t),Uc.bytes=e,t};Uc.bytes=0;function _d(n,e){e=e??{};const t=e.lengthEncoder??Uc,r=e?.maxDataLength??
Ed;function*s(i){j0(i,r);const o=t(i.byteLength);o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:
yield*i}return G0(n)?(async function*(){for await(const i of n)yield*s(i)})():(function*(){for(const i of n)yield*s(i)})()}
_d.single=(n,e)=>{e=e??{};const t=e.lengthEncoder??Uc,r=e?.maxDataLength??Ed;return j0(n,r),new Tn(t(n.byteLength),n)};var Hn;
(function(n){n[n.LENGTH=0]="LENGTH",n[n.DATA=1]="DATA"})(Hn||(Hn={}));const xd=n=>{const e=pS(n);return xd.bytes=Wm(e),e};
xd.bytes=0;function lh(n,e){const t=new Tn;let r=Hn.LENGTH,s=-1;const i=e?.lengthDecoder??xd,o=e?.maxLengthLength??V5,a=e?.
maxDataLength??Ed;function*c(){for(;t.byteLength>0;){if(r===Hn.LENGTH)try{if(s=i(t),s<0)throw new q5("Invalid message le\
ngth");if(s>a)throw new K0("Message length too long");const l=i.bytes;t.consume(l),e?.onLength!=null&&e.onLength(s),r=Hn.
DATA}catch(l){if(l instanceof RangeError){if(t.byteLength>o)throw new W5("Message length length too long");break}throw l}
if(r===Hn.DATA){if(t.byteLength<s)break;const l=t.sublist(0,s);t.consume(s),e?.onData!=null&&e.onData(l),yield l,r=Hn.LENGTH}}}
return G0(n)?(async function*(){for await(const l of n)t.append(l),yield*c();if(t.byteLength>0)throw new Lg("Unexpected \
end of input")})():(function*(){for(const l of n)t.append(l),yield*c();if(t.byteLength>0)throw new Lg("Unexpected end of\
 input")})()}lh.fromReader=(n,e)=>{let t=1;const r=(async function*(){for(;;)try{const{done:i,value:o}=await n.next(t);if(i===
!0)return;o!=null&&(yield o)}catch(i){if(i.code==="ERR_UNDER_READ")return{done:!0,value:null};throw i}finally{t=1}})();return lh(
r,{...e??{},onLength:i=>{t=i}})};const K5={maxSubscriptions:1/0,maxMessages:1/0,maxIhaveMessageIDs:1/0,maxIwantMessageIDs:1/0,
maxIdontwantMessageIDs:1/0,maxControlMessages:1/0,maxPeerInfos:1/0};var fr;(function(n){(function(t){let r;t.codec=()=>(r==
null&&(r=ne((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.subscribe!=null&&(i.uint32(8),i.bool(s.subscribe)),s.topic!=
null&&(i.uint32(18),i.string(s.topic)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+
i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.subscribe=s.bool();break}case 2:{a.topic=s.string();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.SubOpts||(n.SubOpts=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.from!=null&&(i.uint32(
10),i.bytes(s.from)),s.data!=null&&(i.uint32(18),i.bytes(s.data)),s.seqno!=null&&(i.uint32(26),i.bytes(s.seqno)),s.topic!=
null&&s.topic!==""&&(i.uint32(34),i.string(s.topic)),s.signature!=null&&(i.uint32(42),i.bytes(s.signature)),s.key!=null&&
(i.uint32(50),i.bytes(s.key)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={topic:""},c=i==null?s.len:s.pos+
i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.from=s.bytes();break}case 2:{a.data=s.bytes();break}case 3:{
a.seqno=s.bytes();break}case 4:{a.topic=s.string();break}case 5:{a.signature=s.bytes();break}case 6:{a.key=s.bytes();break}default:{
s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.Message||(n.Message=
{})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{if(o.lengthDelimited!==!1&&i.fork(),s.ihave!=null)for(const a of s.
ihave)i.uint32(10),n.ControlIHave.codec().encode(a,i);if(s.iwant!=null)for(const a of s.iwant)i.uint32(18),n.ControlIWant.
codec().encode(a,i);if(s.graft!=null)for(const a of s.graft)i.uint32(26),n.ControlGraft.codec().encode(a,i);if(s.prune!=
null)for(const a of s.prune)i.uint32(34),n.ControlPrune.codec().encode(a,i);if(s.idontwant!=null)for(const a of s.idontwant)
i.uint32(42),n.ControlIDontWant.codec().encode(a,i);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={ihave:[],iwant:[],
graft:[],prune:[],idontwant:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{if(o.limits?.
ihave!=null&&a.ihave.length===o.limits.ihave)throw new oe('Decode error - map field "ihave" had too many elements');a.ihave.
push(n.ControlIHave.codec().decode(s,s.uint32(),{limits:o.limits?.ihave$}));break}case 2:{if(o.limits?.iwant!=null&&a.iwant.
length===o.limits.iwant)throw new oe('Decode error - map field "iwant" had too many elements');a.iwant.push(n.ControlIWant.
codec().decode(s,s.uint32(),{limits:o.limits?.iwant$}));break}case 3:{if(o.limits?.graft!=null&&a.graft.length===o.limits.
graft)throw new oe('Decode error - map field "graft" had too many elements');a.graft.push(n.ControlGraft.codec().decode(
s,s.uint32(),{limits:o.limits?.graft$}));break}case 4:{if(o.limits?.prune!=null&&a.prune.length===o.limits.prune)throw new oe(
'Decode error - map field "prune" had too many elements');a.prune.push(n.ControlPrune.codec().decode(s,s.uint32(),{limits:o.
limits?.prune$}));break}case 5:{if(o.limits?.idontwant!=null&&a.idontwant.length===o.limits.idontwant)throw new oe('Deco\
de error - map field "idontwant" had too many elements');a.idontwant.push(n.ControlIDontWant.codec().decode(s,s.uint32(),
{limits:o.limits?.idontwant$}));break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=
(s,i)=>se(s,t.codec(),i)})(n.ControlMessage||(n.ControlMessage={})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),s.messageIDs!=null)for(const a of s.
messageIDs)i.uint32(18),i.bytes(a);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={messageIDs:[]},c=i==null?s.
len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.topicID=s.string();break}case 2:{if(o.limits?.messageIDs!=
null&&a.messageIDs.length===o.limits.messageIDs)throw new oe('Decode error - map field "messageIDs" had too many element\
s');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=
(s,i)=>se(s,t.codec(),i)})(n.ControlIHave||(n.ControlIHave={})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.messageIDs!=null)for(const a of s.messageIDs)i.uint32(10),i.bytes(a);o.lengthDelimited!==
!1&&i.ldelim()},(s,i,o={})=>{const a={messageIDs:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>
3){case 1:{if(o.limits?.messageIDs!=null&&a.messageIDs.length===o.limits.messageIDs)throw new oe('Decode error - map fie\
ld "messageIDs" had too many elements');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),
r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.ControlIWant||(n.ControlIWant={})),(function(t){let r;
t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),
o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>
3){case 1:{a.topicID=s.string();break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=
(s,i)=>se(s,t.codec(),i)})(n.ControlGraft||(n.ControlGraft={})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{
if(o.lengthDelimited!==!1&&i.fork(),s.topicID!=null&&(i.uint32(10),i.string(s.topicID)),s.peers!=null)for(const a of s.peers)
i.uint32(18),n.PeerInfo.codec().encode(a,i);s.backoff!=null&&(i.uint32(24),i.uint64Number(s.backoff)),o.lengthDelimited!==
!1&&i.ldelim()},(s,i,o={})=>{const a={peers:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{
a.topicID=s.string();break}case 2:{if(o.limits?.peers!=null&&a.peers.length===o.limits.peers)throw new oe('Decode error \
- map field "peers" had too many elements');a.peers.push(n.PeerInfo.codec().decode(s,s.uint32(),{limits:o.limits?.peers$}));
break}case 3:{a.backoff=s.uint64Number();break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),
t.decode=(s,i)=>se(s,t.codec(),i)})(n.ControlPrune||(n.ControlPrune={})),(function(t){let r;t.codec=()=>(r==null&&(r=ne(
(s,i,o={})=>{o.lengthDelimited!==!1&&i.fork(),s.peerID!=null&&(i.uint32(10),i.bytes(s.peerID)),s.signedPeerRecord!=null&&
(i.uint32(18),i.bytes(s.signedPeerRecord)),o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{const a={},c=i==null?s.len:s.
pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{a.peerID=s.bytes();break}case 2:{a.signedPeerRecord=s.bytes();
break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=(s,i)=>se(s,t.codec(),i)})(n.
PeerInfo||(n.PeerInfo={})),(function(t){let r;t.codec=()=>(r==null&&(r=ne((s,i,o={})=>{if(o.lengthDelimited!==!1&&i.fork(),
s.messageIDs!=null)for(const a of s.messageIDs)i.uint32(10),i.bytes(a);o.lengthDelimited!==!1&&i.ldelim()},(s,i,o={})=>{
const a={messageIDs:[]},c=i==null?s.len:s.pos+i;for(;s.pos<c;){const l=s.uint32();switch(l>>>3){case 1:{if(o.limits?.messageIDs!=
null&&a.messageIDs.length===o.limits.messageIDs)throw new oe('Decode error - map field "messageIDs" had too many element\
s');a.messageIDs.push(s.bytes());break}default:{s.skipType(l&7);break}}}return a})),r),t.encode=s=>re(s,t.codec()),t.decode=
(s,i)=>se(s,t.codec(),i)})(n.ControlIDontWant||(n.ControlIDontWant={}));let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.
lengthDelimited!==!1&&r.fork(),t.subscriptions!=null)for(const i of t.subscriptions)r.uint32(10),n.SubOpts.codec().encode(
i,r);if(t.messages!=null)for(const i of t.messages)r.uint32(18),n.Message.codec().encode(i,r);t.control!=null&&(r.uint32(
26),n.ControlMessage.codec().encode(t.control,r)),s.lengthDelimited!==!1&&r.ldelim()},(t,r,s={})=>{const i={subscriptions:[],
messages:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();switch(a>>>3){case 1:{if(s.limits?.subscriptions!=
null&&i.subscriptions.length===s.limits.subscriptions)throw new oe('Decode error - map field "subscriptions" had too man\
y elements');i.subscriptions.push(n.SubOpts.codec().decode(t,t.uint32(),{limits:s.limits?.subscriptions$}));break}case 2:{
if(s.limits?.messages!=null&&i.messages.length===s.limits.messages)throw new oe('Decode error - map field "messages" had\
 too many elements');i.messages.push(n.Message.codec().decode(t,t.uint32(),{limits:s.limits?.messages$}));break}case 3:{
i.control=n.ControlMessage.codec().decode(t,t.uint32(),{limits:s.limits?.control});break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(fr||(fr={}));class G5{gossip;msgs=new Map;msgIdToStrFn;history=[];notValidatedCount=0;constructor(e,t,r){
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
(this.msgs.delete(e),t)}}var Rg;(function(n){n.StrictSign="StrictSign",n.StrictNoSign="StrictNoSign"})(Rg||(Rg={}));var xs;
(function(n){n[n.Signing=0]="Signing",n[n.Anonymous=1]="Anonymous"})(xs||(xs={}));var Tt;(function(n){n.Error="error",n.
Ignore="ignore",n.Reject="reject",n.Blacklisted="blacklisted"})(Tt||(Tt={}));var Qe;(function(n){n.InvalidSignature="inv\
alid_signature",n.InvalidSeqno="invalid_seqno",n.InvalidPeerId="invalid_peerid",n.SignaturePresent="signature_present",n.
SeqnoPresent="seqno_present",n.FromPresent="from_present",n.TransformFailed="transform_failed"})(Qe||(Qe={}));var Ze;(function(n){
n.duplicate="duplicate",n.invalid="invalid",n.valid="valid"})(Ze||(Ze={}));function Ng(n){switch(n){case ft.Ignore:return Tt.
Ignore;case ft.Reject:return Tt.Reject;default:throw new Error("Unreachable")}}var Fg;(function(n){n.forward="forward",n.
publish="publish"})(Fg||(Fg={}));var nt;(function(n){n.Fanout="fanout",n.Random="random",n.Subscribed="subscribed",n.Outbound=
"outbound",n.NotEnough="not_enough",n.Opportunistic="opportunistic"})(nt||(nt={}));var $t;(function(n){n.Dc="disconnecte\
d",n.BadScore="bad_score",n.Prune="prune",n.Excess="excess"})($t||($t={}));var gi;(function(n){n.GraftBackoff="graft_bac\
koff",n.BrokenPromise="broken_promise",n.MessageDeficit="message_deficit",n.IPColocation="IP_colocation"})(gi||(gi={}));
var mi;(function(n){n.LowScore="low_score",n.MaxIhave="max_ihave",n.MaxIasked="max_iasked"})(mi||(mi={}));var Zr;(function(n){
n.graylist="graylist",n.publish="publish",n.gossip="gossip",n.mesh="mesh"})(Zr||(Zr={}));function j5(n,e,t){return{protocolsEnabled:n.
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
r);switch(s){case nt.Fanout:this.meshPeerInclusionEventsFanout.inc({topic:o},i);break;case nt.Random:this.meshPeerInclusionEventsRandom.
inc({topic:o},i);break;case nt.Subscribed:this.meshPeerInclusionEventsSubscribed.inc({topic:o},i);break;case nt.Outbound:
this.meshPeerInclusionEventsOutbound.inc({topic:o},i);break;case nt.NotEnough:this.meshPeerInclusionEventsNotEnough.inc(
{topic:o},i);break;case nt.Opportunistic:this.meshPeerInclusionEventsOpportunistic.inc({topic:o},i);break;default:this.meshPeerInclusionEventsUnknown.
inc({topic:o},i);break}},onRemoveFromMesh(r,s,i){const o=this.toTopic(r);switch(s){case $t.Dc:this.meshPeerChurnEventsDisconnected.
inc({topic:o},i);break;case $t.BadScore:this.meshPeerChurnEventsBadScore.inc({topic:o},i);break;case $t.Prune:this.meshPeerChurnEventsPrune.
inc({topic:o},i);break;case $t.Excess:this.meshPeerChurnEventsExcess.inc({topic:o},i);break;default:this.meshPeerChurnEventsUnknown.
inc({topic:o},i);break}},onReportValidation(r,s,i){if(this.asyncValidationMcacheHit.inc({hit:r!=null?"hit":"miss"}),r!=null){
const o=this.toTopic(r.message.topic);switch(s){case ft.Accept:this.acceptedMessagesTotal.inc({topic:o});break;case ft.Ignore:
this.ignoredMessagesTotal.inc({topic:o});break;case ft.Reject:this.rejectedMessagesTotal.inc({topic:o});break;default:this.
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
inc({topic:s},1)},onPrevalidationResult(r,s){const i=this.toTopic(r);switch(s){case Ze.duplicate:this.prevalidationDuplicateTotal.
inc({topic:i});break;case Ze.invalid:this.prevalidationInvalidTotal.inc({topic:i});break;case Ze.valid:this.prevalidationValidTotal.
inc({topic:i});break;default:this.prevalidationUnknownTotal.inc({topic:i});break}},onMsgRecvInvalid(r,s){const i=this.toTopic(
r),o=s.reason===Tt.Error?s.error:s.reason;this.msgReceivedInvalid.inc({error:o},1),this.msgReceivedInvalidByTopic.inc({topic:i},
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
const c=[];a.forEach(l=>{c.push(s.get(l)??0)}),this.scorePerMesh.set({topic:o},c)}}}}class X extends Error{static name="\
InvalidPeerScoreParamsError";constructor(e="Invalid peer score params"){super(e),this.name="InvalidPeerScoreParamsError"}}
const H5={topics:{},topicScoreCap:10,appSpecificScore:()=>0,appSpecificWeight:10,IPColocationFactorWeight:-5,IPColocationFactorThreshold:10,
IPColocationFactorWhitelist:new Set,behaviourPenaltyWeight:-10,behaviourPenaltyThreshold:0,behaviourPenaltyDecay:.2,decayInterval:1e3,
decayToZero:.1,retainScore:3600*1e3},X5={topicWeight:.5,timeInMeshWeight:1,timeInMeshQuantum:1,timeInMeshCap:3600,firstMessageDeliveriesWeight:1,
firstMessageDeliveriesDecay:.5,firstMessageDeliveriesCap:2e3,meshMessageDeliveriesWeight:-1,meshMessageDeliveriesDecay:.5,
meshMessageDeliveriesCap:100,meshMessageDeliveriesThreshold:20,meshMessageDeliveriesWindow:10,meshMessageDeliveriesActivation:5e3,
meshFailurePenaltyWeight:-1,meshFailurePenaltyDecay:.5,invalidMessageDeliveriesWeight:-1,invalidMessageDeliveriesDecay:.3};
function Q5(n={}){return{...H5,...n,topics:n.topics!=null?Object.entries(n.topics).reduce((e,[t,r])=>(e[t]=Y5(r),e),{}):
{}}}function Y5(n={}){return{...X5,...n}}function J5(n){for(const[e,t]of Object.entries(n.topics))try{Z5(t)}catch(r){throw new X(
`invalid score parameters for topic ${e}: ${r.message}`)}if(n.topicScoreCap<0)throw new X("invalid topic score cap; must\
 be positive (or 0 for no cap)");if(n.appSpecificScore===null||n.appSpecificScore===void 0)throw new X("missing applicat\
ion specific score function");if(n.IPColocationFactorWeight>0)throw new X("invalid IPColocationFactorWeight; must be neg\
ative (or 0 to disable)");if(n.IPColocationFactorWeight!==0&&n.IPColocationFactorThreshold<1)throw new X("invalid IPColo\
cationFactorThreshold; must be at least 1");if(n.behaviourPenaltyWeight>0)throw new X("invalid BehaviourPenaltyWeight; m\
ust be negative (or 0 to disable)");if(n.behaviourPenaltyWeight!==0&&(n.behaviourPenaltyDecay<=0||n.behaviourPenaltyDecay>=
1))throw new X("invalid BehaviourPenaltyDecay; must be between 0 and 1");if(n.decayInterval<1e3)throw new X("invalid Dec\
ayInterval; must be at least 1s");if(n.decayToZero<=0||n.decayToZero>=1)throw new X("invalid DecayToZero; must be betwee\
n 0 and 1")}function Z5(n){if(n.topicWeight<0)throw new X("invalid topic weight; must be >= 0");if(n.timeInMeshQuantum===
0)throw new X("invalid TimeInMeshQuantum; must be non zero");if(n.timeInMeshWeight<0)throw new X("invalid TimeInMeshWeig\
ht; must be positive (or 0 to disable)");if(n.timeInMeshWeight!==0&&n.timeInMeshQuantum<=0)throw new X("invalid TimeInMe\
shQuantum; must be positive");if(n.timeInMeshWeight!==0&&n.timeInMeshCap<=0)throw new X("invalid TimeInMeshCap; must be \
positive");if(n.firstMessageDeliveriesWeight<0)throw new X("invallid FirstMessageDeliveriesWeight; must be positive (or \
0 to disable)");if(n.firstMessageDeliveriesWeight!==0&&(n.firstMessageDeliveriesDecay<=0||n.firstMessageDeliveriesDecay>=
1))throw new X("invalid FirstMessageDeliveriesDecay; must be between 0 and 1");if(n.firstMessageDeliveriesWeight!==0&&n.
firstMessageDeliveriesCap<=0)throw new X("invalid FirstMessageDeliveriesCap; must be positive");if(n.meshMessageDeliveriesWeight>
0)throw new X("invalid MeshMessageDeliveriesWeight; must be negative (or 0 to disable)");if(n.meshMessageDeliveriesWeight!==
0&&(n.meshMessageDeliveriesDecay<=0||n.meshMessageDeliveriesDecay>=1))throw new X("invalid MeshMessageDeliveriesDecay; m\
ust be between 0 and 1");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesCap<=0)throw new X("invalid MeshMe\
ssageDeliveriesCap; must be positive");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesThreshold<=0)throw new X(
"invalid MeshMessageDeliveriesThreshold; must be positive");if(n.meshMessageDeliveriesWindow<0)throw new X("invalid Mesh\
MessageDeliveriesWindow; must be non-negative");if(n.meshMessageDeliveriesWeight!==0&&n.meshMessageDeliveriesActivation<
1e3)throw new X("invalid MeshMessageDeliveriesActivation; must be at least 1s");if(n.meshFailurePenaltyWeight>0)throw new X(
"invalid MeshFailurePenaltyWeight; must be negative (or 0 to disable)");if(n.meshFailurePenaltyWeight!==0&&(n.meshFailurePenaltyDecay<=
0||n.meshFailurePenaltyDecay>=1))throw new X("invalid MeshFailurePenaltyDecay; must be between 0 and 1");if(n.invalidMessageDeliveriesWeight>
0)throw new X("invalid InvalidMessageDeliveriesWeight; must be negative (or 0 to disable)");if(n.invalidMessageDeliveriesDecay<=
0||n.invalidMessageDeliveriesDecay>=1)throw new X("invalid InvalidMessageDeliveriesDecay; must be between 0 and 1")}const eU={
gossipThreshold:-10,publishThreshold:-50,graylistThreshold:-80,acceptPXThreshold:10,opportunisticGraftThreshold:20};function tU(n={}){
return{...eU,...n}}function uh(n,e,t=()=>!0){const r=new Set;if(e<=0)return r;for(const s of n){if(r.size>=e)break;t(s)&&
(r.add(s),n.delete(s))}return r}function nU(n,e){return uh(n,e,()=>!0)}class rU extends Map{getDefault;constructor(e){super(),
this.getDefault=e}getOrDefault(e){let t=super.get(e);return t===void 0&&(t=this.getDefault(),this.set(e,t)),t}}function sU(n,e,t,r){
let s=0;Object.entries(e.topics).forEach(([o,a])=>{const c=t.topics[o];if(c===void 0)return;let l=0;if(a.inMesh){let p=a.
meshTime/c.timeInMeshQuantum;p>c.timeInMeshCap&&(p=c.timeInMeshCap),l+=p*c.timeInMeshWeight}let u=a.firstMessageDeliveries;
if(u>c.firstMessageDeliveriesCap&&(u=c.firstMessageDeliveriesCap),l+=u*c.firstMessageDeliveriesWeight,a.meshMessageDeliveriesActive&&
a.meshMessageDeliveries<c.meshMessageDeliveriesThreshold){const p=c.meshMessageDeliveriesThreshold-a.meshMessageDeliveries,
A=p*p;l+=A*c.meshMessageDeliveriesWeight}const h=a.meshFailurePenalty;l+=h*c.meshFailurePenaltyWeight;const f=a.invalidMessageDeliveries*
a.invalidMessageDeliveries;l+=f*c.invalidMessageDeliveriesWeight,s+=l*c.topicWeight}),t.topicScoreCap>0&&s>t.topicScoreCap&&
(s=t.topicScoreCap);const i=t.appSpecificScore(n);if(s+=i*t.appSpecificWeight,e.knownIPs.forEach(o=>{if(t.IPColocationFactorWhitelist.
has(o))return;const a=r.get(o),c=a!=null?a.size:0;if(c>t.IPColocationFactorThreshold){const l=c-t.IPColocationFactorThreshold,
u=l*l;s+=u*t.IPColocationFactorWeight}}),e.behaviourPenalty>t.behaviourPenaltyThreshold){const o=e.behaviourPenalty-t.behaviourPenaltyThreshold,
a=o*o;s+=a*t.behaviourPenaltyWeight}return s}var Ol,Ug;function iU(){if(Ug)return Ol;Ug=1;function n(e,r){var r=r||{};this.
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
unshift(a[o-1])}else{a=new Array(i-(s+r));var f=a.length;for(o=0;o<f;o++)a[o]=this._list[this._head+s+r+o&this._capacityMask];
for(r===0?(c=[],s!=i&&(this._tail=this._head+s+u&this._capacityMask)):(c=this.remove(s,r),this._tail=this._tail-f+u&this.
_capacityMask);h<l;)this.push(arguments[h++]);for(o=0;o<f;o++)this.push(a[o])}return c}else return this.remove(s,r)}},n.
prototype.clear=function(){this._list=new Array(this._list.length),this._head=0,this._tail=0},n.prototype.isEmpty=function(){
return this._head===this._tail},n.prototype.toArray=function(){return this._copyArray(!1)},n.prototype._fromArray=function(t){
var r=t.length,s=this._nextPowerOf2(r);this._list=new Array(s),this._capacityMask=s-1,this._tail=r;for(var i=0;i<r;i++)this.
_list[i]=t[i]},n.prototype._copyArray=function(t,r){var s=this._list,i=s.length,o=this.length;if(r=r|o,r==o&&this._head<
this._tail)return this._list.slice(this._head,this._tail);var a=new Array(r),c=0,l;if(t||this._head>this._tail){for(l=this.
_head;l<i;l++)a[c++]=s[l];for(l=0;l<this._tail;l++)a[c++]=s[l]}else for(l=this._head;l<this._tail;l++)a[c++]=s[l];return a},
n.prototype._growArray=function(){if(this._head!=0){var t=this._copyArray(!0,this._list.length<<1);this._tail=this._list.
length,this._head=0,this._list=t}else this._tail=this._list.length,this._list.length<<=1;this._capacityMask=this._capacityMask<<
1|1},n.prototype._shrinkArray=function(){this._list.length>>>=1,this._capacityMask>>>=1},n.prototype._nextPowerOf2=function(t){
var r=Math.log(t)/Math.log(2),s=1<<r+1;return Math.max(s,4)},Ol=n,Ol}var oU=iU();const aU=Lm(oU);var Ye;(function(n){n[n.
unknown=0]="unknown",n[n.valid=1]="valid",n[n.invalid=2]="invalid",n[n.ignored=3]="ignored"})(Ye||(Ye={}));class cU{records;queue;constructor(){
this.records=new Map,this.queue=new aU}getRecord(e){return this.records.get(e)}ensureRecord(e){let t=this.records.get(e);
if(t!=null)return t;t={status:Ye.unknown,firstSeenTsMs:Date.now(),validated:0,peers:new Set},this.records.set(e,t);const r={
msgId:e,expire:Date.now()+$5};return this.queue.push(r),t}gc(){const e=Date.now();let t=this.queue.peekFront();for(;t!=null&&
t.expire<e;)this.records.delete(t.msgId),this.queue.shift(),t=this.queue.peekFront()}clear(){this.records.clear(),this.queue.
clear()}}class lU{params;metrics;peerStats=new Map;peerIPs=new rU(()=>new Set);scoreCache=new Map;deliveryRecords=new cU;_backgroundInterval;scoreCacheValidityMs;computeScore;log;constructor(e,t,r,s){
this.params=e,this.metrics=t,J5(e),this.scoreCacheValidityMs=s.scoreCacheValidityMs,this.computeScore=s.computeScore??sU,
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
this.markFirstMessageDelivery(e,r);const s=this.deliveryRecords.ensureRecord(t),i=Date.now();if(s.status!==Ye.unknown){this.
log("unexpected delivery: message from %s was first seen %s ago and has delivery status %s",e,i-s.firstSeenTsMs,Ye[s.status]);
return}s.status=Ye.valid,s.validated=i,s.peers.forEach(o=>{o!==e.toString()&&this.markDuplicateMessageDelivery(o,r)})}rejectInvalidMessage(e,t){
this.markInvalidMessageDelivery(e,t)}rejectMessage(e,t,r,s){switch(s){case Tt.Error:this.markInvalidMessageDelivery(e,r);
return;case Tt.Blacklisted:return}const i=this.deliveryRecords.ensureRecord(t);if(i.status!==Ye.unknown){this.log("unexp\
ected rejection: message from %s was first seen %s ago and has delivery status %d",e,Date.now()-i.firstSeenTsMs,Ye[i.status]);
return}if(s===Tt.Ignore){i.status=Ye.ignored,i.peers.clear();return}i.status=Ye.invalid,this.markInvalidMessageDelivery(
e,r),i.peers.forEach(o=>{this.markInvalidMessageDelivery(o,r)}),i.peers.clear()}duplicateMessage(e,t,r){const s=this.deliveryRecords.
ensureRecord(t);if(!s.peers.has(e))switch(s.status){case Ye.unknown:s.peers.add(e);break;case Ye.valid:s.peers.add(e),this.
markDuplicateMessageDelivery(e,r,s.validated);break;case Ye.invalid:this.markInvalidMessageDelivery(e,r);break;case Ye.ignored:
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
meshFailurePenalty:0,invalidMessageDeliveries:0},e.topics[t]=r,r):null}}function uU(n,e,t,r,s){let i=0;const o=new Map;if(Object.
entries(e.topics).forEach(([f,p])=>{const A=s.get(f)??"unknown",y=t.topics[f];if(y===void 0)return;let I=o.get(A);I==null&&
(I={p1w:0,p2w:0,p3w:0,p3bw:0,p4w:0},o.set(A,I));let d=0,m=0,E=0,w=0,b=0;if(p.inMesh){const _=Math.max(p.meshTime/y.timeInMeshQuantum,
y.timeInMeshCap);d+=_*y.timeInMeshWeight}let v=p.firstMessageDeliveries;if(v>y.firstMessageDeliveriesCap&&(v=y.firstMessageDeliveriesCap),
m+=v*y.firstMessageDeliveriesWeight,p.meshMessageDeliveriesActive&&p.meshMessageDeliveries<y.meshMessageDeliveriesThreshold){
const _=y.meshMessageDeliveriesThreshold-p.meshMessageDeliveries,S=_*_;E+=S*y.meshMessageDeliveriesWeight}const g=p.meshFailurePenalty;
w+=g*y.meshFailurePenaltyWeight;const x=p.invalidMessageDeliveries*p.invalidMessageDeliveries;b+=x*y.invalidMessageDeliveriesWeight,
i+=(d+m+E+w+b)*y.topicWeight,I.p1w+=d,I.p2w+=m,I.p3w+=E,I.p3bw+=w,I.p4w+=b}),t.topicScoreCap>0&&i>t.topicScoreCap){i=t.topicScoreCap;
const f=t.topicScoreCap/i;for(const p of o.values())p.p1w*=f,p.p2w*=f,p.p3w*=f,p.p3bw*=f,p.p4w*=f}let a=0,c=0,l=0;const u=t.
appSpecificScore(n);a+=u*t.appSpecificWeight,e.knownIPs.forEach(f=>{if(t.IPColocationFactorWhitelist.has(f))return;const p=r.
get(f),A=p!=null?p.size:0;if(A>t.IPColocationFactorThreshold){const y=A-t.IPColocationFactorThreshold,I=y*y;c+=I*t.IPColocationFactorWeight}});
const h=e.behaviourPenalty*e.behaviourPenalty;return l+=h*t.behaviourPenaltyWeight,i+=a+c+l,{byTopic:o,p5w:a,p6w:c,p7w:l,
score:i}}function hU(n,e,t,r,s){const i={byTopic:new Map,p5w:[],p6w:[],p7w:[],score:[]};for(const o of n){const a=e.get(
o);if(a!=null){const c=uU(o,a,t,r,s);for(const[l,u]of c.byTopic){let h=i.byTopic.get(l);h==null&&(h={p1w:[],p2w:[],p3w:[],
p3bw:[],p4w:[]},i.byTopic.set(l,h)),h.p1w.push(u.p1w),h.p2w.push(u.p2w),h.p3w.push(u.p3w),h.p3bw.push(u.p3bw),h.p4w.push(
u.p4w)}i.p5w.push(c.p5w),i.p6w.push(c.p6w),i.p7w.push(c.p7w),i.score.push(c.score)}else i.p5w.push(0),i.p6w.push(0),i.p7w.
push(0),i.score.push(0)}return i}class dU{rawStream;constructor(e,t,r){this.rawStream=e,r.maxBufferSize!=null&&(e.maxWriteBufferLength=
r.maxBufferSize),e.addEventListener("close",s=>{s.error!=null&&t(s.error)})}get protocol(){return this.rawStream.protocol}async push(e){
return this.pushPrefixed(_d.single(e))}pushPrefixed(e){this.rawStream.send(e)}async close(e){await this.rawStream.close(
e).catch(t=>{this.rawStream.abort(t)})}}class fU{source;rawStream;closeController;constructor(e,t={}){this.rawStream=e,this.
closeController=new AbortController,this.closeController.signal.addEventListener("abort",()=>{e.close().catch(r=>{e.abort(
r)})}),this.source=gS(this.rawStream,r=>lh(r,t))}async close(){this.closeController.abort()}}class pU{gossipsubIWantFollowupMs;msgIdToStrFn;metrics;promises=new Map;requestMsByMsg=new Map;requestMsByMsgExpire;constructor(e,t,r){
this.gossipsubIWantFollowupMs=e,this.msgIdToStrFn=t,this.metrics=r,this.requestMsByMsgExpire=10*e}get size(){return this.
promises.size}get requestMsByMsgSize(){return this.requestMsByMsg.size}addPromise(e,t){const r=Math.floor(Math.random()*
t.length),s=t[r],i=this.msgIdToStrFn(s);let o=this.promises.get(i);o==null&&(o=new Map,this.promises.set(i,o));const a=Date.
now();o.has(e)||(o.set(e,a+this.gossipsubIWantFollowupMs),this.metrics!=null&&(this.metrics.iwantPromiseStarted.inc(1),this.
requestMsByMsg.has(i)||this.requestMsByMsg.set(i,a)))}getBrokenPromises(){const e=Date.now(),t=new Map;let r=0;return this.
promises.forEach((s,i)=>{s.forEach((o,a)=>{o<e&&(t.set(a,(t.get(a)??0)+1),s.delete(a),r++)}),s.size===0&&this.promises.delete(
i)}),this.metrics?.iwantPromiseBroken.inc(r),t}deliverMessage(e,t=!1){this.trackMessage(e);const r=this.promises.get(e);
r!=null&&(this.promises.delete(e),this.metrics!=null&&(this.metrics.iwantPromiseResolved.inc(1),t&&this.metrics.iwantPromiseResolvedFromDuplicate.
inc(1),this.metrics.iwantPromiseResolvedPeers.inc(r.size)))}rejectMessage(e,t){switch(this.trackMessage(e),t){case Tt.Error:
return}this.promises.delete(e)}clear(){this.promises.clear()}prune(){const e=Date.now()-this.requestMsByMsgExpire;let t=0;
for(const[r,s]of this.requestMsByMsg.entries())if(s<e)this.requestMsByMsg.delete(r),t++;else break;this.metrics?.iwantMessagePruned.
inc(t)}trackMessage(e){if(this.metrics!=null){const t=this.requestMsByMsg.get(e);t!==void 0&&(this.metrics.iwantPromiseDeliveryTime.
observe((Date.now()-t)/1e3),this.requestMsByMsg.delete(e))}}}const H0=Cr("libp2p-pubsub:");async function gU(n,e,t,r){switch(n.
type){case xs.Signing:{const s={from:n.author.toMultihash().bytes,data:r,seqno:Hm(8),topic:e,signature:void 0,key:void 0},
i=Gi([H0,fr.Message.encode(s)]);s.signature=await n.privateKey.sign(i),s.key=n.key;const o={type:"signed",from:n.author,
data:t,sequenceNumber:BigInt(`0x${Ge(s.seqno??new Uint8Array(0),"base16")}`),topic:e,signature:s.signature,key:Xt(s.key)};
return{raw:s,msg:o}}case xs.Anonymous:return{raw:{from:void 0,data:r,seqno:void 0,topic:e,signature:void 0,key:void 0},msg:{
type:"unsigned",data:t,topic:e}};default:throw new Error("Unreachable")}}async function mU(n,e){switch(n){case Cd:return e.
signature!=null?{valid:!1,error:Qe.SignaturePresent}:e.seqno!=null?{valid:!1,error:Qe.SeqnoPresent}:e.key!=null?{valid:!1,
error:Qe.FromPresent}:{valid:!0,message:{type:"unsigned",topic:e.topic,data:e.data??new Uint8Array(0)}};case nc:{if(e.seqno==
null)return{valid:!1,error:Qe.InvalidSeqno};if(e.seqno.length!==8)return{valid:!1,error:Qe.InvalidSeqno};if(e.signature==
null)return{valid:!1,error:Qe.InvalidSignature};if(e.from==null)return{valid:!1,error:Qe.InvalidPeerId};let t;try{t=xr(hc(
e.from))}catch{return{valid:!1,error:Qe.InvalidPeerId}}let r;if(e.key!=null){if(r=Xt(e.key),t.publicKey!==void 0&&!r.equals(
t.publicKey))return{valid:!1,error:Qe.InvalidPeerId}}else{if(t.publicKey==null)return{valid:!1,error:Qe.InvalidPeerId};r=
t.publicKey}const s={from:e.from,data:e.data,seqno:e.seqno,topic:e.topic,signature:void 0,key:void 0},i=Gi([H0,fr.Message.
encode(s)]);return await r.verify(i,e.signature)?{valid:!0,message:{type:"signed",from:t,data:e.data??new Uint8Array(0),
sequenceNumber:BigInt(`0x${Ge(e.seqno,"base16")}`),topic:e.topic,signature:e.signature,key:e.key!=null?Xt(e.key):r}}:{valid:!1,
error:Qe.InvalidSignature}}default:throw new Error("Unreachable")}}function Pt(n=[],e){return{subscriptions:[],messages:n,
control:e!==void 0?{graft:e.graft??[],prune:e.prune??[],ihave:e.ihave??[],iwant:e.iwant??[],idontwant:e.idontwant??[]}:void 0}}
function Og(n){return n.control===void 0&&(n.control={graft:[],prune:[],ihave:[],iwant:[],idontwant:[]}),n}function Ft(n){
if(n.length<=1)return n;const e=()=>Math.floor(Math.random()*Math.floor(n.length));for(let t=0;t<n.length;t++){const r=e(),
s=n[t];n[t]=n[r],n[r]=s}return n}function bU(n){return Ge(n,"base64")}function yU(n,e,t){switch(n){case nc:return{type:xs.
Signing,author:e,key:Ir(t.publicKey),privateKey:t};case Cd:return{type:xs.Anonymous};default:throw new Error(`Unknown si\
gnature policy "${n}"`)}}const wU=(n,e)=>{const t=Cr(e.toString(16).padStart(16,"0"),"base16"),r=Ir(n),s=new Uint8Array(
r.byteLength+t.length);return s.set(r,0),s.set(t,r.byteLength),s};function vU(n){if(n.type!=="signed")throw new Error("e\
xpected signed message type");if(n.sequenceNumber==null)throw Error("missing seqno field");return wU(n.from.publicKey??n.
key,n.sequenceNumber)}async function SU(n){return qm.encode(n.data)}function AU(n){if(gt(n)){const e=ee(n);switch(e.type){case"\
ip4":case"ip6":return e.host}}return null}class Bl{entries=new Map;validityMs;constructor(e){this.validityMs=e.validityMs}get size(){
return this.entries.size}put(e,t){return this.entries.has(e)?!0:(this.entries.set(e,{value:t,validUntilMs:Date.now()+this.
validityMs}),!1)}prune(){const e=Date.now();for(const[t,r]of this.entries.entries())if(r.validUntilMs<e)this.entries.delete(
t);else break}has(e){return this.entries.has(e)}get(e){const t=this.entries.get(e);return t!=null&&t.validUntilMs>=Date.
now()?t.value:void 0}clear(){this.entries.clear()}}var st;(function(n){n[n.started=0]="started",n[n.stopped=1]="stopped"})(
st||(st={}));class EU extends ue{globalSignaturePolicy;protocols=[Ul,a5,$g];publishConfig;dataTransform;peers=new Map;streamsInbound=new Map;streamsOutbound=new Map;outboundInflightQueue=ls(
{objectMode:!0});direct=new Set;floodsubPeers=new Set;seenCache;acceptFromWhitelist=new Map;topics=new Map;subscriptions=new Set;mesh=new Map;fanout=new Map;fanoutLastpub=new Map;gossip=new Map;control=new Map;peerhave=new Map;iasked=new Map;backoff=new Map;outbound=new Map;msgIdFn;fastMsgIdFn;msgIdToStrFn;fastMsgIdCache;publishedMessageIds;mcache;score;topicValidators=new Map;log;heartbeatTicks=0;gossipTracer;idontwantCounts=new Map;idontwants=new Map;components;directPeerInitial=null;static multicodec=Ul;opts;decodeRpcLimits;metrics;status={
code:st.stopped};maxInboundStreams;maxOutboundStreams;runOnLimitedConnection;allowedTopics;heartbeatTimer=null;constructor(e,t={}){
super();const r={fallbackToFloodsub:!0,floodPublish:!0,batchPublish:!1,tagMeshPeers:!0,doPX:!1,directPeers:[],D:c5,Dlo:l5,
Dhi:u5,Dscore:h5,Dout:d5,Dlazy:g5,heartbeatInterval:y5,fanoutTTL:w5,mcacheLength:f5,mcacheGossip:p5,seenTTL:M5,gossipsubIWantFollowupMs:P5,
prunePeers:v5,pruneBackoff:S5,unsubcribeBackoff:A5,graftFloodThreshold:T5,opportunisticGraftPeers:I5,opportunisticGraftTicks:C5,
directConnectTicks:_5,gossipFactor:m5,idontwantMinDataSize:B5,idontwantMaxMessages:z5,...t,scoreParams:Q5(t.scoreParams),
scoreThresholds:tU(t.scoreThresholds)};if(this.components=e,this.decodeRpcLimits=r.decodeRpcLimits??K5,this.globalSignaturePolicy=
r.globalSignaturePolicy??nc,r.fallbackToFloodsub&&this.protocols.push(Mg),this.log=e.logger.forComponent(r.debugName??"l\
ibp2p:gossipsub"),this.opts=r,this.direct=new Set(r.directPeers.map(s=>s.id.toString())),this.seenCache=new Bl({validityMs:r.
seenTTL}),this.publishedMessageIds=new Bl({validityMs:r.seenTTL}),t.msgIdFn!=null)this.msgIdFn=t.msgIdFn;else switch(this.
globalSignaturePolicy){case nc:this.msgIdFn=vU;break;case Cd:this.msgIdFn=SU;break;default:throw new Error(`Invalid glob\
alSignaturePolicy: ${this.globalSignaturePolicy}`)}if(t.fastMsgIdFn!=null&&(this.fastMsgIdFn=t.fastMsgIdFn,this.fastMsgIdCache=
new Bl({validityMs:r.seenTTL})),this.msgIdToStrFn=t.msgIdToStrFn??bU,this.mcache=t.messageCache??new G5(r.mcacheGossip,r.
mcacheLength,this.msgIdToStrFn),t.dataTransform!=null&&(this.dataTransform=t.dataTransform),t.metricsRegister!=null){if(t.
metricsTopicStrToLabel==null)throw Error("Must set metricsTopicStrToLabel with metrics");const s=Math.max(...Object.values(
r.scoreParams.topics).map(o=>o.meshMessageDeliveriesWindow),U5),i=j5(t.metricsRegister,t.metricsTopicStrToLabel,{gossipPromiseExpireSec:this.
opts.gossipsubIWantFollowupMs/1e3,behaviourPenaltyThreshold:r.scoreParams.behaviourPenaltyThreshold,maxMeshMessageDeliveriesWindowSec:s/
1e3});i.mcacheSize.addCollect(()=>{this.onScrapeMetrics(i)});for(const o of this.protocols)i.protocolsEnabled.set({protocol:o},
1);this.metrics=i}else this.metrics=null;this.gossipTracer=new pU(this.opts.gossipsubIWantFollowupMs,this.msgIdToStrFn,this.
metrics),this.score=new lU(this.opts.scoreParams,this.metrics,this.components.logger,{scoreCacheValidityMs:r.heartbeatInterval}),
this.maxInboundStreams=t.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams,this.runOnLimitedConnection=t.runOnLimitedConnection,
this.allowedTopics=r.allowedTopics!=null?new Set(r.allowedTopics):null}[Symbol.toStringTag]="@chainsafe/libp2p-gossipsub";[rt]=[
"@libp2p/pubsub"];[us]=["@libp2p/identify"];getPeers(){return[...this.peers.values()]}isStarted(){return this.status.code===
st.started}async start(){if(this.isStarted())return;this.log("starting"),this.publishConfig=yU(this.globalSignaturePolicy,
this.components.peerId,this.components.privateKey),this.outboundInflightQueue=ls({objectMode:!0}),qd(this.outboundInflightQueue,
async i=>{for await(const{peerId:o,connection:a}of i)await this.createOutboundStream(o,a)}).catch(i=>{this.log.error("ou\
tbound inflight queue error",i)}),await Promise.all(this.opts.directPeers.map(async i=>{await this.components.peerStore.
merge(i.id,{multiaddrs:i.addrs})}));const e=this.components.registrar;await Promise.all(this.protocols.map(async i=>e.handle(
i,this.onIncomingStream.bind(this),{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams,
runOnLimitedConnection:this.runOnLimitedConnection})));const t={onConnect:this.onPeerConnected.bind(this),onDisconnect:this.
onPeerDisconnected.bind(this),notifyOnLimitedConnection:this.runOnLimitedConnection},r=await Promise.all(this.protocols.
map(async i=>e.register(i,t))),s=setTimeout(this.runHeartbeat,kg);this.status={code:st.started,registrarTopologyIds:r,heartbeatTimeout:s,
hearbeatStartMs:Date.now()+kg},this.score.start(),this.directPeerInitial=setTimeout(()=>{Promise.resolve().then(async()=>{
await Promise.all(Array.from(this.direct).map(async i=>this.connect(i)))}).catch(i=>{this.log(i)})},x5),this.opts.tagMeshPeers&&
(this.addEventListener("gossipsub:graft",this.tagMeshPeer),this.addEventListener("gossipsub:prune",this.untagMeshPeer)),
this.log("started")}async stop(){if(this.log("stopping"),this.status.code!==st.started)return;const{registrarTopologyIds:e}=this.
status;this.status={code:st.stopped},this.opts.tagMeshPeers&&(this.removeEventListener("gossipsub:graft",this.tagMeshPeer),
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
toString();if(this.peers.has(r)&&!this.streamsOutbound.has(r))try{const s=new dU(await t.newStream(this.protocols,{runOnLimitedConnection:this.
runOnLimitedConnection}),o=>{this.log.error("outbound pipe error",o)},{maxBufferSize:this.opts.maxOutboundBufferSize});this.
log("create outbound stream %p",e),this.streamsOutbound.set(r,s);const i=s.protocol;i===Mg&&this.floodsubPeers.add(r),this.
metrics?.peersPerProtocol.inc({protocol:i},1),this.subscriptions.size>0&&(this.log("send subscriptions to",r),this.sendSubscriptions(
r,Array.from(this.subscriptions),!0))}catch(s){this.log.error("createOutboundStream error",s)}}createInboundStream(e,t){
if(!this.isStarted())return;const r=e.toString();if(!this.peers.has(r))return;const s=this.streamsInbound.get(r);s!==void 0&&
(this.log("replacing existing inbound steam %s",r),s.close().catch(o=>{this.log.error(o)})),this.log("create inbound str\
eam %s",r);const i=new fU(t,{maxDataLength:this.opts.maxInboundDataLength});this.streamsInbound.set(r,i),this.pipePeerReadStream(
e,i.source).catch(o=>{this.log(o)})}addPeer(e,t,r){const s=e.toString();if(!this.peers.has(s)){this.peers.set(s,e),this.
score.addPeer(s);const i=AU(r);i!==null?this.score.addIP(s,i):this.log("Added peer has no IP in current address %s %s",s,
r.toString()),this.outbound.has(s)||this.outbound.set(s,t==="outbound")}}removePeer(e){const t=e.toString();if(!this.peers.
has(t))return;this.log("delete peer %p",e),this.peers.delete(t);const r=this.streamsOutbound.get(t),s=this.streamsInbound.
get(t);r!=null&&this.metrics?.peersPerProtocol.inc({protocol:r.protocol},-1),r?.close().catch(i=>{this.log.error(i)}),s?.
close().catch(i=>{this.log.error(i)}),this.streamsOutbound.delete(t),this.streamsInbound.delete(t);for(const i of this.topics.
values())i.delete(t);for(const[i,o]of this.mesh)o.delete(t)&&this.metrics?.onRemoveFromMesh(i,$t.Dc,1);for(const i of this.
fanout.values())i.delete(t);this.floodsubPeers.delete(t),this.gossip.delete(t),this.control.delete(t),this.outbound.delete(
t),this.idontwantCounts.delete(t),this.idontwants.delete(t),this.score.removePeer(t),this.acceptFromWhitelist.delete(t)}get started(){
return this.status.code===st.started}getMeshPeers(e){const t=this.mesh.get(e);return t!=null?Array.from(t):[]}getSubscribers(e){
const t=this.topics.get(e);return(t!=null?Array.from(t):[]).map(r=>this.peers.get(r)??Z(r))}getTopics(){return Array.from(
this.subscriptions)}async pipePeerReadStream(e,t){try{await qd(t,async r=>{for await(const s of r)try{const i=s.subarray(),
o=fr.decode(i,{limits:{subscriptions:this.decodeRpcLimits.maxSubscriptions,messages:this.decodeRpcLimits.maxMessages,control$:{
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
forEach(u=>{const h=u.topic,f=u.subscribe===!0;if(h!=null){if(this.allowedTopics!=null&&!this.allowedTopics.has(h))return;
this.handleReceivedSubscription(e,h,f),l.push({topic:h,subscribe:f})}}),this.safeDispatchEvent("subscription-change",{detail:{
peerId:e,subscriptions:l}})}for(const l of t.messages){if(this.allowedTopics!=null&&!this.allowedTopics.has(l.topic))continue;
const u=this.handleReceivedMessage(e,l).catch(h=>{this.metrics?.onMsgRecvError(l.topic),this.log(h)});this.opts.awaitRpcMessageHandler&&
await u}t.control!=null&&await this.handleControlMessage(e.toString(),t.control)}handleReceivedSubscription(e,t,r){this.
log("subscription update from %p topic %s",e,t);let s=this.topics.get(t);s==null&&(s=new Set,this.topics.set(t,s)),r?s.add(
e.toString()):s.delete(e.toString())}async handleReceivedMessage(e,t){this.metrics?.onMsgRecvPreValidation(t.topic);const r=await this.
validateReceivedMessage(e,t);this.metrics?.onPrevalidationResult(t.topic,r.code);const s=r.code;switch(s){case Ze.duplicate:
this.score.duplicateMessage(e.toString(),r.msgIdStr,t.topic),this.gossipTracer.deliverMessage(r.msgIdStr,!0),this.mcache.
observeDuplicate(r.msgIdStr,e.toString());return;case Ze.invalid:if(r.msgIdStr!=null){const i=r.msgIdStr;this.score.rejectMessage(
e.toString(),i,t.topic,r.reason),this.gossipTracer.rejectMessage(i,r.reason)}else this.score.rejectInvalidMessage(e.toString(),
t.topic);this.metrics?.onMsgRecvInvalid(t.topic,r);return;case Ze.valid:this.score.validateMessage(r.messageId.msgIdStr),
this.gossipTracer.deliverMessage(r.messageId.msgIdStr),this.mcache.put(r.messageId,t,!this.opts.asyncValidation),this.subscriptions.
has(t.topic)&&(!this.components.peerId.equals(e)||this.opts.emitSelf)&&(super.dispatchEvent(new CustomEvent("gossipsub:m\
essage",{detail:{propagationSource:e,msgId:r.messageId.msgIdStr,msg:r.msg}})),super.dispatchEvent(new CustomEvent("messa\
ge",{detail:r.msg}))),this.opts.asyncValidation||this.forwardMessage(r.messageId.msgIdStr,t,e.toString());break;default:
throw new Error(`Invalid validation result: ${s}`)}}async validateReceivedMessage(e,t){const r=this.fastMsgIdFn?.(t),s=r!==
void 0?this.fastMsgIdCache?.get(r):void 0;if(s!=null)return{code:Ze.duplicate,msgIdStr:s};const i=await mU(this.globalSignaturePolicy,
t);if(!i.valid)return{code:Ze.invalid,reason:Tt.Error,error:i.error};const o=i.message;try{this.dataTransform!=null&&(o.
data=this.dataTransform.inboundTransform(t.topic,o.data))}catch(h){return this.log("Invalid message, transform failed",h),
{code:Ze.invalid,reason:Tt.Error,error:Qe.TransformFailed}}const a=await this.msgIdFn(o),c=this.msgIdToStrFn(a),l={msgId:a,
msgIdStr:c};if(r!==void 0&&this.fastMsgIdCache!=null&&this.fastMsgIdCache.put(r,c)&&this.metrics?.fastMsgIdCacheCollision.
inc(),this.seenCache.has(c))return{code:Ze.duplicate,msgIdStr:c};this.seenCache.put(c),(t.data?.length??0)>=this.opts.idontwantMinDataSize&&
this.sendIDontWants(a,t.topic,e.toString());const u=this.topicValidators.get(t.topic);if(u!=null){let h;try{h=await u(e,
o)}catch(f){const p=f.code;p===L5&&(h=ft.Ignore),p===k5?h=ft.Reject:h=ft.Ignore}if(h!==ft.Accept)return{code:Ze.invalid,
reason:Ng(h),msgIdStr:c}}return{code:Ze.valid,messageId:l,msg:o}}getScore(e){return this.score.score(e)}sendSubscriptions(e,t,r){
this.sendRpc(e,{subscriptions:t.map(s=>({topic:s,subscribe:r})),messages:[]})}async handleControlMessage(e,t){if(t===void 0)
return;const r=t.ihave?.length>0?this.handleIHave(e,t.ihave):[],s=t.iwant?.length>0?this.handleIWant(e,t.iwant):[],i=t.graft?.
length>0?await this.handleGraft(e,t.graft):[];if(t.prune?.length>0&&await this.handlePrune(e,t.prune),t.idontwant?.length>
0&&this.handleIdontwant(e,t.idontwant),r.length===0&&s.length===0&&i.length===0)return;const o=this.sendRpc(e,Pt(s,{iwant:r,
prune:i})),a=r[0]?.messageIDs;a!=null&&(o?this.gossipTracer.addPromise(e,a):this.metrics?.iwantPromiseUntracked.inc(1))}acceptFrom(e){
if(this.direct.has(e))return!0;const t=Date.now(),r=this.acceptFromWhitelist.get(e);if(r!=null&&r.messagesAccepted<N5&&r.
acceptUntil>=t)return r.messagesAccepted+=1,!0;const s=this.score.score(e);return s>=R5?this.acceptFromWhitelist.set(e,{
messagesAccepted:0,acceptUntil:t+F5}):this.acceptFromWhitelist.delete(e),s>=this.opts.scoreThresholds.graylistThreshold}handleIHave(e,t){
if(t.length===0)return[];const r=this.score.score(e);if(r<this.opts.scoreThresholds.gossipThreshold)return this.log("IHA\
VE: ignoring peer %s with score below threshold [ score = %d ]",e,r),this.metrics?.ihaveRcvIgnored.inc({reason:mi.LowScore}),
[];const s=(this.peerhave.get(e)??0)+1;if(this.peerhave.set(e,s),s>D5)return this.log("IHAVE: peer %s has advertised too\
 many times (%d) within this heartbeat interval; ignoring",e,s),this.metrics?.ihaveRcvIgnored.inc({reason:mi.MaxIhave}),
[];const i=this.iasked.get(e)??0;if(i>=Wr)return this.log("IHAVE: peer %s has already advertised too many messages (%d);\
 ignoring",e,i),this.metrics?.ihaveRcvIgnored.inc({reason:mi.MaxIasked}),[];const o=new Map;if(t.forEach(({topicID:l,messageIDs:u})=>{
if(l==null||u==null||!this.mesh.has(l))return;let h=0;u.forEach(f=>{const p=this.msgIdToStrFn(f);this.seenCache.has(p)||
(o.set(p,f),h++)}),this.metrics?.onIhaveRcv(l,u.length,h)}),o.size===0)return[];let a=o.size;a+i>Wr&&(a=Wr-i),this.log("\
IHAVE: Asking for %d out of %d messages from %s",a,o.size,e);let c=Array.from(o.values());return Ft(c),c=c.slice(0,a),this.
iasked.set(e,i+a),[{messageIDs:c}]}handleIWant(e,t){if(t.length===0)return[];const r=this.score.score(e);if(r<this.opts.
scoreThresholds.gossipThreshold)return this.log("IWANT: ignoring peer %s with score below threshold [score = %d]",e,r),[];
const s=new Map,i=new Map;let o=0;return t.forEach(({messageIDs:a})=>{a?.forEach(c=>{const l=this.msgIdToStrFn(c),u=this.
mcache.getWithIWantCount(l,e);if(u==null){o++;return}if(i.set(u.msg.topic,1+(i.get(u.msg.topic)??0)),u.count>b5){this.log(
"IWANT: Peer %s has asked for message %s too many times: ignoring request",e,c);return}s.set(l,u.msg)})}),this.metrics?.
onIwantRcv(i,o),s.size===0?(this.log("IWANT: Could not provide any wanted messages to %s",e),[]):(this.log("IWANT: Sendi\
ng %d messages to %s",s.size,e),Array.from(s.values()))}async handleGraft(e,t){const r=[],s=this.score.score(e),i=Date.now();
let o=this.opts.doPX;if(t.forEach(({topicID:c})=>{if(c==null)return;const l=this.mesh.get(c);if(l==null){o=!1;return}if(l.
has(e))return;const u=this.backoff.get(c)?.get(e);if(this.direct.has(e))this.log("GRAFT: ignoring request from direct pe\
er %s",e),r.push(c),o=!1;else if(typeof u=="number"&&i<u){this.log("GRAFT: ignoring backed off peer %s",e),this.score.addPenalty(
e,1,gi.GraftBackoff),o=!1;const h=u+this.opts.graftFloodThreshold-this.opts.pruneBackoff;i<h&&this.score.addPenalty(e,1,
gi.GraftBackoff),this.addBackoff(e,c),r.push(c)}else s<0?(this.log("GRAFT: ignoring peer %s with negative score: score=%\
d, topic=%s",e,s,c),r.push(c),o=!1,this.addBackoff(e,c)):l.size>=this.opts.Dhi&&!(this.outbound.get(e)??!1)?(r.push(c),this.
addBackoff(e,c)):(this.log("GRAFT: Add mesh link from %s in %s",e,c),this.score.graft(e,c),l.add(e),this.metrics?.onAddToMesh(
c,nt.Subscribed,1));this.safeDispatchEvent("gossipsub:graft",{detail:{peerId:e,topic:c,direction:"inbound"}})}),r.length===
0)return[];const a=!1;return Promise.all(r.map(async c=>this.makePrune(e,c,o,a)))}async handlePrune(e,t){const r=this.score.
score(e);for(const{topicID:s,backoff:i,peers:o}of t){if(s==null)continue;const a=this.mesh.get(s);if(a==null)return;this.
log("PRUNE: Remove mesh link to %s in %s",e,s),this.score.prune(e,s),a.has(e)&&(a.delete(e),this.metrics?.onRemoveFromMesh(
s,$t.Prune,1)),typeof i=="number"&&i>0?this.doAddBackoff(e,s,i*1e3):this.addBackoff(e,s),o!=null&&o.length>0&&(r<this.opts.
scoreThresholds.acceptPXThreshold?this.log("PRUNE: ignoring PX from peer %s with insufficient score [score = %d, topic =\
 %s]",e,r,s):await this.pxConnect(o)),this.safeDispatchEvent("gossipsub:prune",{detail:{peerId:e,topic:s,direction:"inbo\
und"}})}}handleIdontwant(e,t){let r=this.idontwantCounts.get(e)??0;if(r>=this.opts.idontwantMaxMessages)return;const s=r;
let i=this.idontwants.get(e);i==null&&(i=new Map,this.idontwants.set(e,i));let o=0;e:for(const{messageIDs:c}of t)for(const l of c){
if(r>=this.opts.idontwantMaxMessages)break e;r++;const u=this.msgIdToStrFn(l);i.set(u,this.heartbeatTicks),this.mcache.msgs.
has(u)||o++}this.idontwantCounts.set(e,r);const a=r-s;this.metrics?.onIdontwantRcv(a,o)}addBackoff(e,t){this.doAddBackoff(
e,t,this.opts.pruneBackoff)}doAddBackoff(e,t,r){let s=this.backoff.get(t);s==null&&(s=new Map,this.backoff.set(t,s));const i=Date.
now()+r;(s.get(e)??0)<i&&s.set(e,i)}applyIwantPenalties(){this.gossipTracer.getBrokenPromises().forEach((e,t)=>{this.log(
"peer %s didn't follow up in %d IWANT requests; adding penalty",t,e),this.score.addPenalty(t,e,gi.BrokenPromise)})}clearBackoff(){
if(this.heartbeatTicks%E5!==0)return;const e=Date.now();this.backoff.forEach((t,r)=>{t.forEach((s,i)=>{s+O5*this.opts.heartbeatInterval<
e&&t.delete(i)}),t.size===0&&this.backoff.delete(r)})}async directConnect(){const e=[];this.direct.forEach(t=>{this.streamsOutbound.
has(t)||e.push(t)}),await Promise.all(e.map(async t=>this.connect(t)))}async pxConnect(e){e.length>this.opts.prunePeers&&
(Ft(e),e=e.slice(0,this.opts.prunePeers));const t=[];await Promise.all(e.map(async r=>{if(r.peerID==null)return;const s=xr(
hc(r.peerID)),i=s.toString();if(!this.peers.has(i)){if(r.signedPeerRecord==null){t.push(i);return}try{if(!await this.components.
peerStore.consumePeerRecord(r.signedPeerRecord,{expectedPeer:s})){this.log("bogus peer record obtained through px: could\
 not add peer record to address book");return}t.push(i)}catch{this.log("bogus peer record obtained through px: invalid s\
ignature or not a peer record")}}})),t.length!==0&&await Promise.all(t.map(async r=>this.connect(r)))}async connect(e){this.
log("Initiating connection with %s",e);const t=Z(e),r=await this.components.connectionManager.openConnection(t);for(const s of this.
protocols)for(const i of this.components.registrar.getTopologies(s))i.onConnect?.(t,r)}subscribe(e){if(this.status.code!==
st.started)throw new Error("Pubsub has not started");if(!this.subscriptions.has(e)){this.subscriptions.add(e);for(const t of this.
peers.keys())this.sendSubscriptions(t,[e],!0)}this.join(e)}unsubscribe(e){if(this.status.code!==st.started)throw new Error(
"Pubsub is not started");const t=this.subscriptions.delete(e);if(this.log("unsubscribe from %s - am subscribed %s",e,t),
t)for(const r of this.peers.keys())this.sendSubscriptions(r,[e],!1);this.leave(e)}join(e){if(this.status.code!==st.started)
throw new Error("Gossipsub has not started");if(this.mesh.has(e))return;this.log("JOIN %s",e),this.metrics?.onJoin(e);const t=new Set,
r=this.backoff.get(e),s=this.fanout.get(e);if(s!=null&&(this.fanout.delete(e),this.fanoutLastpub.delete(e),s.forEach(i=>{
!this.direct.has(i)&&this.score.score(i)>=0&&r?.has(i)!==!0&&t.add(i)}),this.metrics?.onAddToMesh(e,nt.Fanout,t.size)),t.
size<this.opts.D){const i=t.size;this.getRandomGossipPeers(e,this.opts.D,a=>!t.has(a)&&!this.direct.has(a)&&this.score.score(
a)>=0&&r?.has(a)!==!0).forEach(a=>{t.add(a)}),this.metrics?.onAddToMesh(e,nt.Random,t.size-i)}this.mesh.set(e,t),t.forEach(
i=>{this.log("JOIN: Add mesh link to %s in %s",i,e),this.sendGraft(i,e)})}leave(e){if(this.status.code!==st.started)throw new Error(
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
o,Pt([t]))}),this.metrics?.onForwardMsg(t.topic,i.size)}async publish(e,t,r){const s=Date.now(),i=this.dataTransform!=null?
this.dataTransform.outboundTransform(e,t):t;if(this.publishConfig==null)throw Error("PublishError.Uninitialized");const{
raw:o,msg:a}=await gU(this.publishConfig,e,t,i),c=await this.msgIdFn(a),l=this.msgIdToStrFn(c),u=r?.ignoreDuplicatePublishError??
this.opts.ignoreDuplicatePublishError;if(this.seenCache.has(l)){if(u)return this.metrics?.onPublishDuplicateMsg(e),{recipients:[]};
throw Error("PublishError.Duplicate")}const{tosend:h,tosendCount:f}=this.selectPeersToPublish(e),p=this.opts.emitSelf&&this.
subscriptions.has(e),A=r?.allowPublishToZeroTopicPeers??this.opts.allowPublishToZeroTopicPeers;if(h.size===0&&!A&&!p)throw Error(
"PublishError.NoPeersSubscribedToTopic");this.seenCache.put(l),this.mcache.put({msgId:c,msgIdStr:l},o,!0),this.gossipTracer.
deliverMessage(l),this.publishedMessageIds.put(l);const y=r?.batchPublish??this.opts.batchPublish,I=Pt([o]);if(y)this.sendRpcInBatch(
h,I);else for(const m of h)this.sendRpc(m,I)||h.delete(m);const d=Date.now()-s;return this.metrics?.onPublishMsg(e,f,h.size,
o.data!=null?o.data.length:0,d),p&&(h.add(this.components.peerId.toString()),super.dispatchEvent(new CustomEvent("gossip\
sub:message",{detail:{propagationSource:this.components.peerId,msgId:l,msg:a}})),super.dispatchEvent(new CustomEvent("me\
ssage",{detail:a}))),{recipients:Array.from(h.values()).map(m=>this.peers.get(m)??Z(m))}}sendRpcInBatch(e,t){const r=fr.
encode(t),s=_d.single(r);for(const i of e){const o=this.streamsOutbound.get(i);if(o==null){this.log(`Cannot send RPC to ${i}\
 as there is no open stream to it available`),e.delete(i);continue}try{o.pushPrefixed(s)}catch(a){e.delete(i),this.log.error(
`Cannot send rpc to ${i}`,a)}this.metrics?.onRpcSent(t,r.length)}}reportMessageValidationResult(e,t,r){let s;if(r===ft.Accept){
if(s=this.mcache.validate(e),s!=null){const{message:o,originatingPeers:a}=s;this.score.deliverMessage(t,e,o.topic),this.
forwardMessage(e,s.message,t,a)}}else if(s=this.mcache.remove(e),s!=null){const o=Ng(r),{message:a,originatingPeers:c}=s;
this.score.rejectMessage(t,e,a.topic,o);for(const l of c)this.score.rejectMessage(l,e,a.topic,o)}const i=this.score.messageFirstSeenTimestampMs(
e);this.metrics?.onReportValidation(s,r,i)}sendGraft(e,t){const s=Pt([],{graft:[{topicID:t}]});this.sendRpc(e,s)}async sendPrune(e,t){
const s=[await this.makePrune(e,t,this.opts.doPX,!0)],i=Pt([],{prune:s});this.sendRpc(e,i)}sendIDontWants(e,t,r){const s=this.
mesh.get(t);if(s==null)return;const i=new Set(s);i.delete(r);for(const a of i)this.streamsOutbound.get(a)?.protocol!==Ul&&
i.delete(a);const o=Pt([],{idontwant:[{messageIDs:[e]}]});this.sendRpcInBatch(i,o)}sendRpc(e,t){const r=this.streamsOutbound.
get(e);if(r==null)return this.log(`Cannot send RPC to ${e} as there is no open stream to it available`),!1;const s=this.
control.get(e);s!=null&&(this.piggybackControl(e,t,s),this.control.delete(e));const i=this.gossip.get(e);i!=null&&(this.
piggybackGossip(e,t,i),this.gossip.delete(e));const o=fr.encode(t);try{r.push(o)}catch(a){return this.log.error(`Cannot \
send rpc to ${e}`,a),s!=null&&this.control.set(e,s),i!=null&&this.gossip.set(e,i),!1}if(this.metrics?.onRpcSent(t,o.length),
t.control?.graft!=null)for(const a of t.control?.graft)a.topicID!=null&&this.safeDispatchEvent("gossipsub:graft",{detail:{
peerId:e,topic:a.topicID,direction:"outbound"}});if(t.control?.prune!=null)for(const a of t.control?.prune)a.topicID!=null&&
this.safeDispatchEvent("gossipsub:prune",{detail:{peerId:e,topic:a.topicID,direction:"outbound"}});return!0}piggybackControl(e,t,r){
const s=Og(t);for(const i of r.graft)i.topicID!=null&&(this.mesh.get(i.topicID)?.has(e)??!1)&&s.control.graft.push(i);for(const i of r.
prune)i.topicID!=null&&!(this.mesh.get(i.topicID)?.has(e)??!1)&&s.control.prune.push(i)}piggybackGossip(e,t,r){const s=Og(
t);s.control.ihave=r}async sendGraftPrune(e,t,r){const s=this.opts.doPX,i=!1;for(const[o,a]of e){const c=a.map(h=>({topicID:h}));
let l=[];const u=t.get(o);u!=null&&(l=await Promise.all(u.map(async h=>this.makePrune(o,h,s&&!(r.get(o)??!1),i))),t.delete(
o)),this.sendRpc(o,Pt([],{graft:c,prune:l}))}for(const[o,a]of t){const c=await Promise.all(a.map(async l=>this.makePrune(
o,l,s&&!(r.get(o)??!1),i)));this.sendRpc(o,Pt([],{prune:c}))}}emitGossip(e){const t=this.mcache.getGossipIDs(new Set(e.keys()));
for(const[r,s]of e)this.doEmitGossip(r,s,t.get(r)??[])}doEmitGossip(e,t,r){if(r.length===0||(Ft(r),r.length>Wr&&this.log(
"too many messages for gossip; will truncate IHAVE list (%d messages)",r.length),t.size===0))return;let s=this.opts.Dlazy;
const o=this.opts.gossipFactor*t.size;let a=t;o>s&&(s=o),s>a.size?s=a.size:a=Ft(Array.from(a)).slice(0,s),a.forEach(c=>{
let l=r;r.length>Wr&&(l=Ft(l.slice()).slice(0,Wr)),this.pushGossip(c,{topicID:e,messageIDs:l})})}flush(){for(const[e,t]of this.
gossip.entries())this.gossip.delete(e),this.sendRpc(e,Pt([],{ihave:t}));for(const[e,t]of this.control.entries()){this.control.
delete(e);const r=Pt([],{graft:t.graft,prune:t.prune});this.sendRpc(e,r)}}pushGossip(e,t){this.log("Add gossip to %s",e);
const r=this.gossip.get(e)??[];this.gossip.set(e,r.concat(t))}async makePrune(e,t,r,s){if(this.score.prune(e,t),this.streamsOutbound.
get(e)?.protocol===$g)return{topicID:t,peers:[]};const i=s?this.opts.unsubcribeBackoff:this.opts.pruneBackoff,o=i/1e3;if(this.
doAddBackoff(e,t,i),!r)return{topicID:t,peers:[],backoff:o};const a=this.getRandomGossipPeers(t,this.opts.prunePeers,l=>l!==
e&&this.score.score(l)>=0),c=await Promise.all(Array.from(a).map(async l=>{const u=this.peers.get(l)??Z(l);let h;try{h=await this.
components.peerStore.get(u)}catch(f){if(f.name!=="NotFoundError")throw f}return{peerID:u.toMultihash().bytes,signedPeerRecord:h?.
peerRecordEnvelope}}));return{topicID:t,peers:c,backoff:o}}runHeartbeat=()=>{const e=this.metrics?.heartbeatDuration.startTimer();
this.heartbeat().catch(t=>{this.log("Error running heartbeat",t)}).finally(()=>{if(e?.(),this.status.code===st.started){
clearTimeout(this.status.heartbeatTimeout);let t=this.opts.heartbeatInterval-(Date.now()-this.status.hearbeatStartMs)%this.
opts.heartbeatInterval;t<this.opts.heartbeatInterval*.25&&(t+=this.opts.heartbeatInterval,this.metrics?.heartbeatSkipped.
inc()),this.status.heartbeatTimeout=setTimeout(this.runHeartbeat,t)}})};async heartbeat(){const{D:e,Dlo:t,Dhi:r,Dscore:s,
Dout:i,fanoutTTL:o}=this.opts;this.heartbeatTicks++;const a=new Map,c=A=>{let y=a.get(A);return y===void 0&&(y=this.score.
score(A),a.set(A,y)),y},l=new Map,u=new Map,h=new Map;this.clearBackoff(),this.peerhave.clear(),this.metrics?.cacheSize.
set({cache:"iasked"},this.iasked.size),this.iasked.clear(),this.applyIwantPenalties(),this.idontwantCounts.clear();for(const A of this.
idontwants.values())for(const[y,I]of A)this.heartbeatTicks-I>=this.opts.mcacheLength&&A.delete(y);this.heartbeatTicks%this.
opts.directConnectTicks===0&&await this.directConnect(),this.fastMsgIdCache?.prune(),this.seenCache.prune(),this.gossipTracer.
prune(),this.publishedMessageIds.prune();const f=new Map;this.mesh.forEach((A,y)=>{const I=this.topics.get(y),d=new Set,
m=new Set;if(f.set(y,m),I!=null){const b=Ft(Array.from(I)),v=this.backoff.get(y);for(const g of b){const x=this.streamsOutbound.
get(g);if(x!=null&&this.protocols.includes(x.protocol)&&!A.has(g)&&!this.direct.has(g)){const _=c(g);v?.has(g)!==!0&&_>=
0&&d.add(g),_>=this.opts.scoreThresholds.gossipThreshold&&m.add(g)}}}const E=(b,v)=>{this.log("HEARTBEAT: Remove mesh li\
nk to %s in %s",b,y),this.addBackoff(b,y),A.delete(b),c(b)>=this.opts.scoreThresholds.gossipThreshold&&m.add(b),this.metrics?.
onRemoveFromMesh(y,v,1);const g=u.get(b);g==null?u.set(b,[y]):g.push(y)},w=(b,v)=>{this.log("HEARTBEAT: Add mesh link to\
 %s in %s",b,y),this.score.graft(b,y),A.add(b),m.delete(b),this.metrics?.onAddToMesh(y,v,1);const g=l.get(b);g==null?l.set(
b,[y]):g.push(y)};if(A.forEach(b=>{const v=c(b);v<0&&(this.log("HEARTBEAT: Prune peer %s with negative score: score=%d, \
topic=%s",b,v,y),E(b,$t.BadScore),h.set(b,!0))}),A.size<t){const b=e-A.size;nU(d,b).forEach(g=>{w(g,nt.NotEnough)})}if(A.
size>r){let b=Array.from(A);b.sort((g,x)=>c(x)-c(g)),b=b.slice(0,s).concat(Ft(b.slice(s)));let v=0;if(b.slice(0,e).forEach(
g=>{(this.outbound.get(g)??!1)&&v++}),v<i){const g=_=>{const S=b[_];for(let C=_;C>0;C--)b[C]=b[C-1];b[0]=S};if(v>0){let _=v;
for(let S=1;S<e&&_>0;S++)(this.outbound.get(b[S])??!1)&&(g(S),_--)}let x=e-v;for(let _=e;_<b.length&&x>0;_++)(this.outbound.
get(b[_])??!1)&&(g(_),x--)}b.slice(e).forEach(g=>{E(g,$t.Excess)})}if(A.size>=t){let b=0;if(A.forEach(v=>{(this.outbound.
get(v)??!1)&&b++}),b<i){const v=i-b;uh(d,v,x=>this.outbound.get(x)===!0).forEach(x=>{w(x,nt.Outbound)})}}if(this.heartbeatTicks%
this.opts.opportunisticGraftTicks===0&&A.size>1){const b=Array.from(A).sort((x,_)=>c(x)-c(_)),v=Math.floor(A.size/2),g=c(
b[v]);if(g<this.opts.scoreThresholds.opportunisticGraftThreshold){const x=this.opts.opportunisticGraftPeers,_=uh(d,x,S=>c(
S)>g);for(const S of _)this.log("HEARTBEAT: Opportunistically graft peer %s on topic %s",S,y),w(S,nt.Opportunistic)}}});
const p=Date.now();this.fanoutLastpub.forEach((A,y)=>{A+o<p&&(this.fanout.delete(y),this.fanoutLastpub.delete(y))}),this.
fanout.forEach((A,y)=>{const I=this.topics.get(y);A.forEach(w=>{(!(I?.has(w)??!1)||c(w)<this.opts.scoreThresholds.publishThreshold)&&
A.delete(w)});const d=this.topics.get(y),m=[],E=new Set;if(f.set(y,E),d!=null){const w=Ft(Array.from(d));for(const b of w){
const v=this.streamsOutbound.get(b);if(v!=null&&this.protocols.includes(v.protocol)&&!A.has(b)&&!this.direct.has(b)){const g=c(
b);g>=this.opts.scoreThresholds.publishThreshold&&m.push(b),g>=this.opts.scoreThresholds.gossipThreshold&&E.add(b)}}}if(A.
size<e){const w=e-A.size;m.slice(0,w).forEach(b=>{A.add(b),E?.delete(b)})}}),this.emitGossip(f),await this.sendGraftPrune(
l,u,h),this.flush(),this.mcache.shift(),this.dispatchEvent(new CustomEvent("gossipsub:heartbeat"))}getRandomGossipPeers(e,t,r=()=>!0){
const s=this.topics.get(e);if(s==null)return new Set;let i=[];return s.forEach(o=>{const a=this.streamsOutbound.get(o);a!=
null&&this.protocols.includes(a.protocol)&&r(o)&&i.push(o)}),i=Ft(i),t>0&&i.length>t&&(i=i.slice(0,t)),new Set(i)}onScrapeMetrics(e){
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
0)}e.registerScores(i,this.opts.scoreThresholds),e.registerScorePerMesh(this.mesh,o);const a=hU(this.peers.keys(),this.score.
peerStats,this.score.params,this.score.peerIPs,e.topicStrToLabel);e.registerScoreWeights(a)}tagMeshPeer=e=>{const{peerId:t,
topic:r}=e.detail;this.components.peerStore.merge(this.peers.get(t)??Z(t),{tags:{[r]:{value:100}}}).catch(s=>{this.log.error(
"Error tagging peer %s with topic %s",t,r,s)})};untagMeshPeer=e=>{const{peerId:t,topic:r}=e.detail;this.components.peerStore.
merge(this.peers.get(t)??Z(t),{tags:{[r]:void 0}}).catch(s=>{this.log.error("Error untagging peer %s with topic %s",t,r,
s)})}}const nc="StrictSign",Cd="StrictNoSign";var ft;(function(n){n.Accept="accept",n.Ignore="ignore",n.Reject="reject"})(
ft||(ft={}));function _U(n={}){return e=>new EU(e,n)}function xU(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;
for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function Cs(n){if(n instanceof Uint8Array&&n.constructor.
name==="Uint8Array")return Vi(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Vi(
new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function CU(n){
const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const Bg=4096;function IU(n){const e=n.
length;if(e<=Bg)return String.fromCharCode.apply(String,n);let t="",r=0;for(;r<e;)t+=String.fromCharCode.apply(String,n.
subarray(r,r+=Bg));return t}function TU(n){return n?.buffer instanceof ArrayBuffer}function Vi(n){return TU(n)?n:n.slice()}
function DU(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),s=0;s<r.length;s++)
r[s]=255;for(var i=0;i<n.length;i++){var o=n.charAt(i),a=o.charCodeAt(0);if(r[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(r[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(r[c]=i),l!==a&&(r[l]=i)}}
var u=n.length,h=n.charAt(0),f=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function A(d){if(d instanceof Uint8Array||
(ArrayBuffer.isView(d)?d=new Uint8Array(d.buffer,d.byteOffset,d.byteLength):Array.isArray(d)&&(d=Uint8Array.from(d))),!(d instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(d.length===0)return"";for(var m=0,E=0,w=0,b=d.length;w!==b&&d[w]===
0;)w++,m++;for(var v=(b-w)*p+1>>>0,g=new Uint8Array(v);w!==b;){for(var x=d[w],_=0,S=v-1;(x!==0||_<E)&&S!==-1;S--,_++)x+=
256*g[S]>>>0,g[S]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");E=_,w++}for(var C=v-E;C!==v&&g[C]===0;)C++;
for(var T=h.repeat(m);C<v;++C)T+=n.charAt(g[C]);return T}function y(d){if(typeof d!="string")throw new TypeError("Expect\
ed String");if(d.length===0)return new Uint8Array;var m=0;if(d[m]!==" "){for(var E=0,w=0;d[m]===h;)E++,m++;for(var b=(d.
length-m)*f+1>>>0,v=new Uint8Array(b);d[m];){var g=r[d.charCodeAt(m)];if(g===255)return;for(var x=0,_=b-1;(g!==0||x<w)&&
_!==-1;_--,x++)g+=u*v[_]>>>0,v[_]=g%256>>>0,g=g/256>>>0;if(g!==0)throw new Error("Non-zero carry");w=x,m++}if(d[m]!==" "){
for(var S=b-w;S!==b&&v[S]===0;)S++;for(var C=new Uint8Array(E+(b-S)),T=E;S!==b;)C[T++]=v[S++];return C}}}function I(d){var m=y(
d);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:A,decodeUnsafe:y,decode:I}}var PU=DU,MU=PU;class $U{name;prefix;baseEncode;constructor(e,t,r){
this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class kU{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,r){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=r}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return X0(this,e)}}class LU{decoders;constructor(e){
this.decoders=e}or(e){return X0(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r!=null)return r.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function X0(n,e){return new LU({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class RU{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,r,s){
this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=s,this.encoder=new $U(e,t,r),this.decoder=new kU(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Oc({name:n,prefix:e,encode:t,decode:r}){
return new RU(n,e,t,r)}function co({name:n,prefix:e,alphabet:t,caseInsensitive:r=!1}){const{encode:s,decode:i}=MU(t,n,r);
return Oc({prefix:e,name:n,encode:s,decode:o=>Cs(i(o))})}function NU(n,e,t,r){let s=n.length;for(;n[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[n[l]];if(u===void 0)throw new SyntaxError(`Non-${r} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function FU(n,e,t){const r=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<n.length;++c)for(a=a<<8|n[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),r)for(;(i.length*t&7)!==0;)i+="=";return i}function UU(n,e){const t={};
for(let r=0;r<n.length;++r)if(t[n[r]]=r,e){const s=n[r].toLowerCase(),i=n[r].toUpperCase();s!==n[r]&&(t[s]=r),i!==n[r]&&
(t[i]=r)}return t}function Se({name:n,prefix:e,bitsPerChar:t,alphabet:r,caseInsensitive:s=!1}){const i=UU(r,s);return Oc(
{prefix:e,name:n,encode(o){return FU(o,r,t)},decode(o){return NU(o,i,t,n)}})}const OU=co({prefix:"9",name:"base10",alphabet:"\
0123456789"}),BU=Object.freeze(Object.defineProperty({__proto__:null,base10:OU},Symbol.toStringTag,{value:"Module"})),zU=Se(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),VU=Se({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),qU=Object.freeze(Object.defineProperty({__proto__:null,
base16:zU,base16upper:VU},Symbol.toStringTag,{value:"Module"})),WU=Se({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
KU=Object.freeze(Object.defineProperty({__proto__:null,base2:WU},Symbol.toStringTag,{value:"Module"})),Q0=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),GU=Q0.reduce((n,e,t)=>(n[t]=e,n),[]),jU=Q0.reduce((n,e,t)=>{const r=e.codePointAt(0);if(r==null)throw new Error(
`Invalid character: ${e}`);return n[r]=t,n},[]);function HU(n){return n.reduce((e,t)=>(e+=GU[t],e),"")}function XU(n){const e=[];
for(const t of n){const r=t.codePointAt(0);if(r==null)throw new Error(`Invalid character: ${t}`);const s=jU[r];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const QU=Oc({prefix:"🚀",name:"\
base256emoji",encode:HU,decode:XU}),YU=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:QU},Symbol.toStringTag,
{value:"Module"})),bi=Se({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
JU=Se({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),ZU=Se(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),eO=Se({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),tO=Se({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),nO=Se({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),rO=Se({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),sO=Se({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),iO=Se({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),oO=Object.freeze(Object.defineProperty({__proto__:null,
base32:bi,base32hex:tO,base32hexpad:rO,base32hexpadupper:sO,base32hexupper:nO,base32pad:ZU,base32padupper:eO,base32upper:JU,
base32z:iO},Symbol.toStringTag,{value:"Module"})),da=co({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),aO=co({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
cO=Object.freeze(Object.defineProperty({__proto__:null,base36:da,base36upper:aO},Symbol.toStringTag,{value:"Module"})),ut=co(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),lO=co({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),uO=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:ut,base58flickr:lO},Symbol.toStringTag,{value:"Module"})),hO=Se({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),dO=Se({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),fO=Se({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),pO=Se({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),gO=Object.freeze(Object.defineProperty(
{__proto__:null,base64:hO,base64pad:dO,base64url:fO,base64urlpad:pO},Symbol.toStringTag,{value:"Module"})),mO=Se({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),bO=Object.freeze(Object.defineProperty({__proto__:null,base8:mO},Symbol.
toStringTag,{value:"Module"})),yO=Oc({prefix:"\0",name:"identity",encode:n=>IU(Cs(n)),decode:n=>Cs(CU(n))}),wO=Object.freeze(
Object.defineProperty({__proto__:null,identity:yO},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
var vO=Y0,zg=128,SO=-128,AO=Math.pow(2,31);function Y0(n,e,t){e=e||[],t=t||0;for(var r=t;n>=AO;)e[t++]=n&255|zg,n/=128;for(;n&
SO;)e[t++]=n&255|zg,n>>>=7;return e[t]=n|0,Y0.bytes=t-r+1,e}var EO=hh,_O=128,Vg=127;function hh(n,r){var t=0,r=r||0,s=0,
i=r,o,a=n.length;do{if(i>=a)throw hh.bytes=0,new RangeError("Could not decode varint");o=n[i++],t+=s<28?(o&Vg)<<s:(o&Vg)*
Math.pow(2,s),s+=7}while(o>=_O);return hh.bytes=i-r,t}var xO=Math.pow(2,7),CO=Math.pow(2,14),IO=Math.pow(2,21),TO=Math.pow(
2,28),DO=Math.pow(2,35),PO=Math.pow(2,42),MO=Math.pow(2,49),$O=Math.pow(2,56),kO=Math.pow(2,63),LO=function(n){return n<
xO?1:n<CO?2:n<IO?3:n<TO?4:n<DO?5:n<PO?6:n<MO?7:n<$O?8:n<kO?9:10},RO={encode:vO,decode:EO,encodingLength:LO},rc=RO;function dh(n,e=0){
const t=rc.decode(n,e),r=rc.decode.bytes;if(r>9)throw new RangeError("Invalid varint: too long");if(r>1&&n[e+r-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[t,r]}function sc(n,e,t=0){return rc.encode(n,e,t),e}function ic(n){return rc.
encodingLength(n)}function Bc(n,e){const t=e.byteLength,r=ic(n),s=r+ic(t),i=new Uint8Array(s+t);return sc(n,i,0),sc(t,i,
r),i.set(e,s),new Id(n,t,e,i)}function NO(n){const e=Cs(n),[t,r]=dh(e),[s,i]=dh(e.subarray(r)),o=e.subarray(r+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new Id(t,s,o,e)}function FO(n,e){if(n===e)return!0;{const t=e;return n.code===
t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&xU(n.bytes,t.bytes)}}class Id{code;size;digest;bytes;constructor(e,t,r,s){
this.code=e,this.size=t,this.digest=Vi(r),this.bytes=Vi(s)}}const J0=0,UO="identity",Z0=Cs;function OO(n,e){if(e?.truncate!=
null&&e.truncate!==n.byteLength){if(e.truncate<0||e.truncate>n.byteLength)throw new Error(`Invalid truncate option, must\
 be less than or equal to ${n.byteLength}`);n=n.subarray(0,e.truncate)}return Bc(J0,Z0(n))}const Td={code:J0,name:UO,encode:Z0,
digest:OO},BO=20;function zO({name:n,code:e,encode:t,minDigestLength:r,maxDigestLength:s}){return new VO(n,e,t,r,s)}class VO{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,r,s,i){
this.name=e,this.code=t,this.encode=r,this.minDigestLength=s??BO,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const r=this.encode(e);return r instanceof Uint8Array?
qg(r,this.code,t?.truncate):r.then(s=>qg(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}
function qg(n,e,t){if(t!=null&&t!==n.byteLength){if(t>n.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${n.byteLength}`);n=n.subarray(0,t)}return Bc(e,n)}function qO(n){return async e=>new Uint8Array(await crypto.
subtle.digest(n,e))}const WO=zO({name:"sha2-256",code:18,encode:qO("SHA-256")});function Wg(n,e){const{bytes:t,version:r}=n;
switch(r){case 0:return GO(t,fh(n),e??ut.encoder);default:return jO(t,fh(n),e??bi.encoder)}}const Kg=new WeakMap;function fh(n){
const e=Kg.get(n);if(e==null){const t=new Map;return Kg.set(n,t),t}return e}class ce{code;version;multihash;bytes;"/";constructor(e,t,r,s){
this.code=t,this.version=e,this.multihash=r,this.bytes=Vi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==Vs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==HO)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return ce.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,r=Bc(e,t);return ce.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return ce.equals(this,e)}static equals(e,t){const r=t;return r!=
null&&e.code===r.code&&e.version===r.version&&FO(e.multihash,r.multihash)}toString(e){return Wg(this,e)}toJSON(){return{
"/":Wg(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof ce)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:r,code:s,multihash:i,bytes:o}=t;return new ce(r,s,i,o??Gg(r,s,i.bytes))}else if(t[XO]===!0){const{
version:r,multihash:s,code:i}=t,o=NO(s);return ce.create(r,i,o)}else return null}static create(e,t,r){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(r.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==Vs)throw new Error(`Version 0 CID must use dag-pb (code: ${Vs}) block encoding`);return new ce(
e,t,r,r.bytes)}case 1:{const s=Gg(e,t,r.bytes);return new ce(e,t,r,s)}default:throw new Error("Invalid version")}}static createV0(e){
return ce.create(0,Vs,e)}static createV1(e,t){return ce.create(1,e,t)}static decode(e){const[t,r]=ce.decodeFirst(e);if(r.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=ce.inspectBytes(e),r=t.size-t.multihashSize,
s=Cs(e.subarray(r,r+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Id(t.multihashCode,t.digestSize,i,s);return[t.version===0?ce.createV0(o):ce.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const r=()=>{const[h,f]=dh(e.subarray(t));return t+=f,h};let s=r(),
i=Vs;if(s===18?(s=0,t=0):i=r(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=r(),c=r(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[r,s]=KO(e,t),
i=ce.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return fh(
i).set(r,e),i}}function KO(n,e){switch(n[0]){case"Q":{const t=e??ut;return[ut.prefix,t.decode(`${ut.prefix}${n}`)]}case ut.
prefix:{const t=e??ut;return[ut.prefix,t.decode(n)]}case bi.prefix:{const t=e??bi;return[bi.prefix,t.decode(n)]}case da.
prefix:{const t=e??da;return[da.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function GO(n,e,t){const{prefix:r}=t;if(r!==
ut.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(r);if(s==null){const i=t.encode(n).
slice(1);return e.set(r,i),i}else return s}function jO(n,e,t){const{prefix:r}=t,s=e.get(r);if(s==null){const i=t.encode(
n);return e.set(r,i),i}else return s}const Vs=112,HO=18;function Gg(n,e,t){const r=ic(n),s=r+ic(e),i=new Uint8Array(s+t.
byteLength);return sc(n,i,0),sc(e,i,r),i.set(t,s),i}const XO=Symbol.for("@ipld/js-cid/CID"),jg={...wO,...KU,...bO,...BU,
...qU,...oO,...cO,...uO,...gO,...YU};function dn(n=0){return new Uint8Array(n)}function Er(n=0){return new Uint8Array(n)}
function ev(n,e,t,r){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:r}}}const Hg=ev("utf8","u",
n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),zl=ev("ascii","a",n=>{let e="a";for(let t=0;t<
n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Er(n.length);for(let t=0;t<n.length;t++)
e[t]=n.charCodeAt(t);return e}),tv={utf8:Hg,"utf-8":Hg,hex:jg.base16,latin1:zl,ascii:zl,binary:zl,...jg};function en(n,e="\
utf8"){const t=tv[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}
function yn(n,e="utf8"){const t=tv[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(
n).substring(1)}const QO="0.1.0",YO="id",JO="1.0.0",ZO=1024*8,Xg=10,eB=Math.pow(2,7),tB=Math.pow(2,14),nB=Math.pow(2,21),
nv=Math.pow(2,28),rv=Math.pow(2,35),sv=Math.pow(2,42),iv=Math.pow(2,49),We=128,fn=127;function Dd(n){if(n<eB)return 1;if(n<
tB)return 2;if(n<nB)return 3;if(n<nv)return 4;if(n<rv)return 5;if(n<sv)return 6;if(n<iv)return 7;if(Number.MAX_SAFE_INTEGER!=
null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function rB(n,e,t=0){switch(Dd(
n)){case 8:e[t++]=n&255|We,n/=128;case 7:e[t++]=n&255|We,n/=128;case 6:e[t++]=n&255|We,n/=128;case 5:e[t++]=n&255|We,n/=
128;case 4:e[t++]=n&255|We,n>>>=7;case 3:e[t++]=n&255|We,n>>>=7;case 2:e[t++]=n&255|We,n>>>=7;case 1:{e[t++]=n&255,n>>>=
7;break}default:throw new Error("unreachable")}return e}function sB(n,e){let t=n[e],r=0;if(r+=t&fn,t<We||(t=n[e+1],r+=(t&
fn)<<7,t<We)||(t=n[e+2],r+=(t&fn)<<14,t<We)||(t=n[e+3],r+=(t&fn)<<21,t<We)||(t=n[e+4],r+=(t&fn)*nv,t<We)||(t=n[e+5],r+=(t&
fn)*rv,t<We)||(t=n[e+6],r+=(t&fn)*sv,t<We)||(t=n[e+7],r+=(t&fn)*iv,t<We))return r;throw new RangeError("Could not decode\
 varint")}function iB(n){return n.buffer instanceof ArrayBuffer}function _r(n){return iB(n)?n:n.slice()}const Pd=new Float32Array(
[-0]),In=new Uint8Array(Pd.buffer);function oB(n,e,t){Pd[0]=n,e[t]=In[0],e[t+1]=In[1],e[t+2]=In[2],e[t+3]=In[3]}function aB(n,e){
return In[0]=n[e],In[1]=n[e+1],In[2]=n[e+2],In[3]=n[e+3],Pd[0]}const Md=new Float64Array([-0]),$e=new Uint8Array(Md.buffer);
function cB(n,e,t){Md[0]=n,e[t]=$e[0],e[t+1]=$e[1],e[t+2]=$e[2],e[t+3]=$e[3],e[t+4]=$e[4],e[t+5]=$e[5],e[t+6]=$e[6],e[t+
7]=$e[7]}function lB(n,e){return $e[0]=n[e],$e[1]=n[e+1],$e[2]=n[e+2],$e[3]=n[e+3],$e[4]=n[e+4],$e[5]=n[e+5],$e[6]=n[e+6],
$e[7]=n[e+7],Md[0]}const uB=BigInt(Number.MAX_SAFE_INTEGER),hB=BigInt(Number.MIN_SAFE_INTEGER);class ke{lo;hi;constructor(e,t){
this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=
r+1>>>0),-(t+r*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let r=~this.hi>>>0;return t===0&&(r=r+1>>>0),-(BigInt(t)+(BigInt(r)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:r<128?9:10}static fromBigInt(e){if(e===0n)return pr;if(e<uB&&e>hB)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let r=e>>32n,s=e-(r<<32n);return t&&(r=~r|0n,s=~s|0n,++s>Qg&&(s=0n,++r>Qg&&(r=0n))),new ke(Number(s),Number(r))}static fromNumber(e){
if(e===0)return pr;const t=e<0;t&&(e=-e);let r=e>>>0,s=(e-r)/4294967296>>>0;return t&&(s=~s>>>0,r=~r>>>0,++r>4294967295&&
(r=0,++s>4294967295&&(s=0))),new ke(r,s)}static from(e){return typeof e=="number"?ke.fromNumber(e):typeof e=="bigint"?ke.
fromBigInt(e):typeof e=="string"?ke.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new ke(e.low>>>0,e.high>>>0):pr}}const pr=new ke(
0,0);pr.toBigInt=function(){return 0n};pr.zzEncode=pr.zzDecode=function(){return this};pr.length=function(){return 1};const Qg=4294967296n;
function dB(n){let e=0,t=0;for(let r=0;r<n.length;++r)t=n.charCodeAt(r),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(
r+1)&64512)===56320?(++r,e+=4):e+=3;return e}function fB(n,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
n[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|n[e++]&63:a>239&&a<365?(a=((a&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|
n[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(n[e++]&63)<<6|n[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function ov(n,e,t){const r=t;let s,i;for(let o=0;o<n.length;++o)
s=n.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=n.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-r}function At(n,e){return RangeError(`index out of range: ${n.pos}\
 + ${e??1} > ${n.len}`)}function Oo(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class pB{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=_r(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,At(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw At(this,4);return Oo(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw At(
this,4);return Oo(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw At(this,4);const e=aB(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw At(this,4);const e=lB(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,r=this.pos+e;if(r>this.len)throw At(this,e);return this.pos+=e,t===r?new Uint8Array(0):
this.buf.subarray(t,r)}string(){const e=this.bytes();return fB(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw At(this,e);this.pos+=e}else do if(this.pos>=this.len)throw At(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new ke(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw At(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw At(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw At(this,8);const e=Oo(this.buf,this.pos+=4),t=Oo(this.buf,this.pos+=4);return new ke(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=sB(this.buf,this.pos);
return this.pos+=Dd(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function av(n){return new pB(n instanceof Uint8Array?n:
n.subarray())}function $d(n,e,t){const r=av(n);return e.decode(r,void 0,t)}function gB(n){let r,s=8192;return function(o){
if(o<1||o>4096)return Er(o);s+o>8192&&(r=Er(8192),s=0);const a=r.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Zs{fn;len;next;val;constructor(e,t,r){
this.fn=e,this.len=t,this.next=void 0,this.val=r}}function Vl(){}class mB{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const bB=gB();function yB(n){return globalThis.Buffer!=null?Er(
n):bB(n)}class ph{len;head;tail;states;constructor(){this.len=0,this.head=new Zs(Vl,0,0),this.tail=this.head,this.states=
null}_push(e,t,r){return this.tail=this.tail.next=new Zs(e,t,r),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new vB((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Bo,10,
ke.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=ke.fromBigInt(e);return this.
_push(Bo,t.length(),t)}uint64Number(e){return this._push(rB,Dd(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=ke.
fromBigInt(e).zzEncode();return this._push(Bo,t.length(),t)}sint64Number(e){const t=ke.fromNumber(e).zzEncode();return this.
_push(Bo,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(ql,1,e?1:0)}fixed32(e){return this.
_push(qs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=ke.fromBigInt(e);return this._push(qs,4,t.lo)._push(
qs,4,t.hi)}fixed64Number(e){const t=ke.fromNumber(e);return this._push(qs,4,t.lo)._push(qs,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(oB,4,e)}double(e){return this._push(cB,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(ql,1,0):this.uint32(t)._push(SB,t,e)}string(e){const t=dB(e);return t!==0?this.uint32(t)._push(ov,t,e):this.
_push(ql,1,0)}fork(){return this.states=new mB(this),this.head=this.tail=new Zs(Vl,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Zs(Vl,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,r=this.len;return this.reset().
uint32(r),r!==0&&(this.tail.next=e.next,this.tail=t,this.len+=r),this}finish(){let e=this.head.next;const t=yB(this.len);
let r=0;for(;e!=null;)e.fn(e.val,t,r),r+=e.len,e=e.next;return t}}function ql(n,e,t){e[t]=n&255}function wB(n,e,t){for(;n>
127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class vB extends Zs{next;constructor(e,t){super(wB,e,t),this.next=void 0}}function Bo(n,e,t){
for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>
7;e[t++]=n.lo}function qs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function SB(n,e,t){e.set(n,
t)}globalThis.Buffer!=null&&(ph.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(AB,
e,n),this},ph.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(
EB,e,n),this});function AB(n,e,t){e.set(n,t)}function EB(n,e,t){n.length<40?ov(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):
e.set(en(n),t)}function _B(){return new ph}function kd(n,e){const t=_B();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}
function*Ld(n,e,t){const r=av(n);yield*e.stream(r,void 0,".",t)}const cv={VARINT:0,LENGTH_DELIMITED:2};function lv(n,e,t,r,s){
return{name:n,type:e,encode:t,decode:r,stream:s}}function xB(n){function e(i){if(n[i.toString()]==null)throw new Error("\
Invalid enum value");return n[i]}const t=function(o,a){const c=e(o);a.int32(c)},r=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return lv("enum",cv.VARINT,t,r,s)}function Rd(n,e,t){return lv("message",cv.LENGTH_DELIMITED,n,e,
t)}class zo extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var oc;(function(n){let e;n.codec=()=>(e==null&&(e=
Rd((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.protocolVersion!=null&&(o.uint32(42),o.string(i.protocolVersion)),
i.agentVersion!=null&&(o.uint32(50),o.string(i.agentVersion)),i.publicKey!=null&&(o.uint32(10),o.bytes(i.publicKey)),i.listenAddrs!=
null&&i.listenAddrs.length>0)for(const c of i.listenAddrs)o.uint32(18),o.bytes(c);if(i.observedAddr!=null&&(o.uint32(34),
o.bytes(i.observedAddr)),i.protocols!=null&&i.protocols.length>0)for(const c of i.protocols)o.uint32(26),o.string(c);i.signedPeerRecord!=
null&&(o.uint32(66),o.bytes(i.signedPeerRecord)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={listenAddrs:[],
protocols:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 5:{c.protocolVersion=i.string();
break}case 6:{c.agentVersion=i.string();break}case 1:{c.publicKey=i.bytes();break}case 2:{if(a.limits?.listenAddrs!=null&&
c.listenAddrs.length===a.limits.listenAddrs)throw new zo('Decode error - repeated field "listenAddrs" had too many eleme\
nts');c.listenAddrs.push(i.bytes());break}case 4:{c.observedAddr=i.bytes();break}case 3:{if(a.limits?.protocols!=null&&c.
protocols.length===a.limits.protocols)throw new zo('Decode error - repeated field "protocols" had too many elements');c.
protocols.push(i.string());break}case 8:{c.signedPeerRecord=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l={listenAddrs:0,protocols:0},u=o==null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 5:{yield{
field:`${a}.protocolVersion`,value:i.string()};break}case 6:{yield{field:`${a}.agentVersion`,value:i.string()};break}case 1:{
yield{field:`${a}.publicKey`,value:i.bytes()};break}case 2:{if(c.limits?.listenAddrs!=null&&l.listenAddrs===c.limits.listenAddrs)
throw new zo('Streaming decode error - repeated field "listenAddrs" had too many elements');yield{field:`${a}.listenAddr\
s[]`,index:l.listenAddrs,value:i.bytes()},l.listenAddrs++;break}case 4:{yield{field:`${a}.observedAddr`,value:i.bytes()};
break}case 3:{if(c.limits?.protocols!=null&&l.protocols===c.limits.protocols)throw new zo('Streaming decode error - repe\
ated field "protocols" had too many elements');yield{field:`${a}.protocols[]`,index:l.protocols,value:i.string()},l.protocols++;
break}case 8:{yield{field:`${a}.signedPeerRecord`,value:i.bytes()};break}default:{i.skipType(h&7);break}}}})),e);function t(i){
return kd(i,n.codec())}n.encode=t;function r(i,o){return $d(i,n.codec(),o)}n.decode=r;function s(i,o){return Ld(i,n.codec(),
o)}n.stream=s})(oc||(oc={}));function lo(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.
byteLength;t++)if(n[t]!==e[t])return!1;return!0}async function CB(n,e,t,r){const s=await crypto.subtle.importKey("jwk",n,
{name:"ECDSA",namedCurve:n.crv??"P-256"},!1,["verify"]);r?.signal?.throwIfAborted();const i=await crypto.subtle.verify({
name:"ECDSA",hash:{name:"SHA-256"}},s,_r(e),_r(t.subarray()));return r?.signal?.throwIfAborted(),i}function IB(n){return n?.
buffer instanceof ArrayBuffer}function TB(n){if(IB(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}
function Yg(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=Er(e);let r=0;for(const s of n)t.set(s,r),r+=s.length;
return TB(t)}const uv=Symbol.for("@achingbrain/uint8arraylist");function Jg(n,e){if(e==null||e<0)throw new RangeError("i\
ndex is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{buf:r,index:e-t};t=s}throw new RangeError(
"index is out of bounds")}function Vo(n){return!!n?.[uv]}let tn=class fa{bufs;length;[uv]=!0;constructor(...e){this.bufs=
[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.push(r);else if(Vo(
r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const r of e.reverse())
if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(Vo(r))t+=r.byteLength,this.bufs.unshift(...r.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Jg(this.
bufs,e);return t.buf[t.index]}set(e,t){const r=Jg(this.bufs,e);r.buf[r.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(Vo(e))for(let r=0;r<e.length;r++)this.set(t+r,e.get(r));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return Yg(r,s)}subarray(e,t){const{bufs:r,length:s}=this.
_subList(e,t);return r.length===1?r[0]:Yg(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(e,t),i=new fa;return i.
length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}const h=e-a;r.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){if(t===c){r.push(
o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!Vo(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=r.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const r=Er(
1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){const r=this.subarray(e,e+
2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=dn(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(e,e+4);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=dn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const r=Er(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(0,t),this.write(r,e)}getUint16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint16(0,t)}setUint16(e,t,r){const s=dn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(s,e)}getUint32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){const s=dn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,
r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=dn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,
r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=dn(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof fa)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!lo(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const r=new fa;return r.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}};const DB=parseInt("11111",2),gh=parseInt("10000000",
2),PB=parseInt("01111111",2),Zg={0:Ws,1:Ws,2:MB,3:LB,4:RB,5:kB,6:$B,16:Ws,22:Ws,48:Ws};function zc(n,e={offset:0}){const t=n[e.
offset]&DB;if(e.offset++,Zg[t]!=null)return Zg[t](n,e);throw new Error("No decoder for tag "+t)}function uo(n,e){let t=0;
if((n[e.offset]&gh)===gh){const r=n[e.offset]&PB;let s="0x";e.offset++;for(let i=0;i<r;i++,e.offset++){if(e.offset>=n.byteLength)
throw new Error("invalid DER element length");s+=n[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=n[e.offset],
e.offset++;if(!Number.isInteger(t)||t<0||t>n.byteLength-e.offset)throw new Error("invalid DER element length");return t}
function Ws(n,e){uo(n,e);const t=[];for(;!(e.offset>=n.byteLength);){const r=zc(n,e);if(r===null)break;t.push(r)}return t}
function MB(n,e){const t=uo(n,e),r=e.offset,s=e.offset+t,i=[];for(let o=r;o<s;o++)o===r&&n[o]===0||i.push(n[o]);return e.
offset+=t,Uint8Array.from(i)}function $B(n,e){const t=uo(n,e),r=e.offset+t,s=n[e.offset];e.offset++;let i=0,o=0;s<40?(i=
0,o=s):s<80?(i=1,o=s-40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<r;){const l=n[e.offset];if(e.offset++,c.push(
l&127),l<128){c.reverse();let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function kB(n,e){return e.
offset++,null}function LB(n,e){const t=uo(n,e),r=n[e.offset];e.offset++;const s=n.subarray(e.offset,e.offset+t-1);if(e.offset+=
t,r!==0)throw new Error("Unused bits in bit string is unimplemented");return s}function RB(n,e){const t=uo(n,e),r=n.subarray(
e.offset,e.offset+t);return e.offset+=t,r}function NB(n){let e=n.toString(16);e.length%2===1&&(e="0"+e);const t=new tn;for(let r=0;r<
e.length;r+=2)t.append(Uint8Array.from([parseInt(`${e[r]}${e[r+1]}`,16)]));return t}function Nd(n){if(n.byteLength<128)return Uint8Array.
from([n.byteLength]);const e=NB(n.byteLength);return new tn(Uint8Array.from([e.byteLength|gh]),e)}function mh(n){const e=new tn,
t=128;return(n.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(n),new tn(Uint8Array.from([2]),Nd(e),e)}function hv(n){
const e=Uint8Array.from([0]),t=new tn(e,n);return new tn(Uint8Array.from([3]),Nd(t),t)}function yi(n,e=48){const t=new tn;
for(const r of n)t.append(r);return new tn(Uint8Array.from([e]),Nd(t),t)}const FB=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),UB=Uint8Array.from([6,5,43,129,4,0,34]),OB=Uint8Array.from([6,5,43,129,4,0,35]),BB={ext:!0,kty:"EC",crv:"P-256"},
zB={ext:!0,kty:"EC",crv:"P-384"},VB={ext:!0,kty:"EC",crv:"P-521"},Wl=32,Kl=48,Gl=66;function qB(n){const e=zc(n);return WB(
e)}function WB(n){const e=n[1][1][0],t=1;let r,s;if(e.byteLength===Wl*2+1)return r=yn(e.subarray(t,t+Wl),"base64url"),s=
yn(e.subarray(t+Wl),"base64url"),new jl({...BB,key_ops:["verify"],x:r,y:s});if(e.byteLength===Kl*2+1)return r=yn(e.subarray(
t,t+Kl),"base64url"),s=yn(e.subarray(t+Kl),"base64url"),new jl({...zB,key_ops:["verify"],x:r,y:s});if(e.byteLength===Gl*
2+1)return r=yn(e.subarray(t,t+Gl),"base64url"),s=yn(e.subarray(t+Gl),"base64url"),new jl({...VB,key_ops:["verify"],x:r,
y:s});throw new P(`coordinates were wrong length, got ${e.byteLength}, expected 65, 97 or 133`)}function KB(n){return yi(
[mh(Uint8Array.from([1])),yi([GB(n.crv)],160),yi([hv(new tn(Uint8Array.from([4]),en(n.x??"","base64url"),en(n.y??"","bas\
e64url")))],161)]).subarray()}function GB(n){if(n==="P-256")return FB;if(n==="P-384")return UB;if(n==="P-521")return OB;
throw new P(`Invalid curve ${n}`)}class jl{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==null&&
(this._raw=KB(this.jwk)),this._raw}toMultihash(){return Td.digest(Vc(this))}toCID(){return ce.createV1(114,this.toMultihash())}toString(){
return ut.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:lo(this.
raw,e.raw)}async verify(e,t,r){return CB(this.jwk,t,e,r)}}class em extends Error{constructor(e="An error occurred while \
verifying a message"){super(e),this.name="VerificationError"}}class jB extends Error{constructor(e="Missing Web Crypto A\
PI"){super(e),this.name="WebCryptoMissingError"}}const qi={get(n=globalThis){const e=n.crypto;if(e?.subtle==null)throw new jB(
"Missing Web Crypto API. The most likely cause of this error is that this page is being accessed from an insecure contex\
t (i.e. not HTTPS). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/pack\
ages/crypto/README.md#web-crypto-api");return e}},dv=32;let Hl;const HB=(async()=>{try{return await qi.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function XB(n,e,t){if(n.buffer instanceof ArrayBuffer){
const r=await qi.get().subtle.importKey("raw",n.buffer,{name:"Ed25519"},!1,["verify"]);return await qi.get().subtle.verify(
{name:"Ed25519"},r,_r(e),_r(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support Sha\
redArrayBuffer for Ed25519 keys")}function QB(n,e,t){return gr.verify(e,t instanceof Uint8Array?t:t.subarray(),n)}async function YB(n,e,t){
return Hl==null&&(Hl=await HB),Hl?XB(n,e,t):QB(n,e,t)}function fv(n){return n==null?!1:typeof n.then=="function"&&typeof n.
catch=="function"&&typeof n.finally=="function"}class JB{type="Ed25519";raw;constructor(e){this.raw=pv(e,dv)}toMultihash(){
return Td.digest(Vc(this))}toCID(){return ce.createV1(114,this.toMultihash())}toString(){return ut.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:lo(this.raw,e.raw)}verify(e,t,r){r?.signal?.
throwIfAborted();const s=YB(this.raw,t,e);return fv(s)?s.then(i=>(r?.signal?.throwIfAborted(),i)):s}}function ZB(n){return n=
pv(n,dv),new JB(n)}function pv(n,e){if(n=Uint8Array.from(n??[]),n.length!==e)throw new P(`Key must be a Uint8Array of le\
ngth ${e}, got ${n.length}`);return n}var Fe;(function(n){n.RSA="RSA",n.Ed25519="Ed25519",n.secp256k1="secp256k1",n.ECDSA=
"ECDSA"})(Fe||(Fe={}));var bh;(function(n){n[n.RSA=0]="RSA",n[n.Ed25519=1]="Ed25519",n[n.secp256k1=2]="secp256k1",n[n.ECDSA=
3]="ECDSA"})(bh||(bh={}));(function(n){n.codec=()=>xB(bh)})(Fe||(Fe={}));var Wi;(function(n){let e;n.codec=()=>(e==null&&
(e=Rd((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Fe.codec().encode(i.Type,o)),i.Data!=null&&
(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Fe.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Fe.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.
bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return kd(i,n.codec())}n.encode=t;function r(i,o){return $d(
i,n.codec(),o)}n.decode=r;function s(i,o){return Ld(i,n.codec(),o)}n.stream=s})(Wi||(Wi={}));var tm;(function(n){let e;n.
codec=()=>(e==null&&(e=Rd((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),Fe.codec().encode(i.Type,
o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=Fe.codec().decode(i);break}case 2:{c.Data=i.bytes();
break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.
uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Fe.codec().decode(i)};break}case 2:{yield{field:`${a}.Data`,
value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return kd(i,n.codec())}n.encode=t;function r(i,o){
return $d(i,n.codec(),o)}n.decode=r;function s(i,o){return Ld(i,n.codec(),o)}n.stream=s})(tm||(tm={}));class ez{type="RS\
A";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this._raw==null&&(this._raw=iz(this.
jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return ce.createV1(114,this._multihash)}toString(){return ut.
encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:lo(this.raw,e.
raw)}verify(e,t,r){return cz(this.jwk,t,e,r)}}const tz=18,nz=1062,rz=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,1,
1,5,0]);function sz(n){const e=zc(n[1],{offset:0});return{kty:"RSA",n:yn(e[0],"base64url"),e:yn(e[1],"base64url")}}function iz(n){
if(n.n==null||n.e==null)throw new P("JWK was missing components");return yi([rz,hv(yi([mh(en(n.n,"base64url")),mh(en(n.e,
"base64url"))]))]).subarray()}function oz(n,e){if(n.byteLength>=nz)throw new It("Key size is too large");const t=zc(n,{offset:0});
return az(t,n,e)}function az(n,e,t){const r=sz(n);if(t==null){const s=tr(Wi.encode({Type:Fe.RSA,Data:e}));t=Bc(tz,s)}return new ez(
r,t)}async function cz(n,e,t,r){const s=await qi.get().subtle.importKey("jwk",n,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SH\
A-256"}},!1,["verify"]);r?.signal?.throwIfAborted();const i=await qi.get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,_r(
e),_r(t instanceof Uint8Array?t:t.subarray()));return r?.signal?.throwIfAborted(),i}function lz(n,e,t,r){const s=WO.digest(
t instanceof Uint8Array?t:t.subarray());if(fv(s))return s.then(({digest:i})=>(r?.signal?.throwIfAborted(),Ue.verify(e,i,
n,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new em(String(i))});try{return r?.signal?.throwIfAborted(),
Ue.verify(e,s.digest,n,{prehash:!1,format:"der"})}catch(i){throw new em(String(i))}}class uz{type="secp256k1";raw;_key;constructor(e){
this._key=fz(e),this.raw=dz(this._key)}toMultihash(){return Td.digest(Vc(this))}toCID(){return ce.createV1(114,this.toMultihash())}toString(){
return ut.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:lo(this.
raw,e.raw)}verify(e,t,r){return lz(this._key,t,e,r)}}function hz(n){return new uz(n)}function dz(n){return Ue.Point.fromBytes(
n).toBytes()}function fz(n){try{return Ue.Point.fromBytes(n),n}catch(e){throw new It(String(e))}}function gv(n,e){const{
Type:t,Data:r}=Wi.decode(n),s=r??new Uint8Array;switch(t){case Fe.RSA:return oz(s,e);case Fe.Ed25519:return ZB(s);case Fe.
secp256k1:return hz(s);case Fe.ECDSA:return qB(s);default:throw new lc}}function Vc(n){return Wi.encode({Type:Fe[n.type],
Data:n.raw})}const zt={protocolPrefix:"ipfs",timeout:5e3,maxInboundStreams:1,maxOutboundStreams:1,maxObservedAddresses:10,
maxMessageSize:ZO,runOnConnectionOpen:!0,runOnLimitedConnection:!0};function mv(n){return n.bytes.length===0}function bv(n){
if(n!=null&&n.length>0)try{const e=k(n);if(!mv(e))return e}catch{}}async function pz(n,e,t,r,s){if(t("received identify \
from %p",r.remotePeer),s==null)throw new Q("message was null or undefined");const i={},o=s.listenAddrs.map(bv).filter(l=>l!=
null);if(s.listenAddrs.length>0&&(i.addresses=o.map(l=>({isCertified:!1,multiaddr:l}))),s.protocols.length>0&&(i.protocols=
s.protocols),s.publicKey!=null){const l=gv(s.publicKey);if(!Lt(l).equals(r.remotePeer))throw new Q("public key did not m\
atch remote PeerId");i.publicKey=l}let a;if(s.signedPeerRecord!=null){t.trace("received signedPeerRecord from %p",r.remotePeer);
let l=s.signedPeerRecord;const u=await Ht.openAndCertify(l,pt.DOMAIN);let h=pt.createFromProtobuf(u.payload);const f=Lt(
u.publicKey);if(!h.peerId.equals(f))throw new Q("signing key does not match PeerId in the PeerRecord");if(!r.remotePeer.
equals(h.peerId))throw new Q("signing key does not match remote PeerId");let p;try{p=await n.get(h.peerId)}catch(y){if(y.
name!=="NotFoundError")throw y}if(p!=null&&(i.metadata=p.metadata,p.peerRecordEnvelope!=null)){const y=Ht.createFromProtobuf(
p.peerRecordEnvelope),I=pt.createFromProtobuf(y.payload);I.seqNumber>=h.seqNumber&&(t("sequence number was lower or equa\
l to existing sequence number - stored: %d received: %d",I.seqNumber,h.seqNumber),h=I,l=p.peerRecordEnvelope)}i.peerRecordEnvelope=
l;const A=h.multiaddrs.filter(y=>!mv(y));i.addresses=A.map(y=>({isCertified:!0,multiaddr:y})),a={seq:h.seqNumber,addresses:A}}else
t("%p did not send a signed peer record",r.remotePeer);if(t.trace("patching %p with",r.remotePeer,i),await n.patch(r.remotePeer,
i),s.agentVersion!=null||s.protocolVersion!=null){const l={};s.agentVersion!=null&&(l.AgentVersion=en(s.agentVersion)),s.
protocolVersion!=null&&(l.ProtocolVersion=en(s.protocolVersion)),t.trace("merging %p metadata",r.remotePeer,l),await n.merge(
r.remotePeer,{metadata:l})}const c={peerId:r.remotePeer,protocolVersion:s.protocolVersion,agentVersion:s.agentVersion,publicKey:s.
publicKey,listenAddrs:o,observedAddr:s.observedAddr==null?void 0:k(s.observedAddr),protocols:s.protocols,signedPeerRecord:a,
connection:r};return e.safeDispatchEvent("peer:identify",{detail:c}),c}function gz(n){const e={...n[0]};for(const t of n.
slice(1))t.protocolVersion!=null&&(e.protocolVersion=t.protocolVersion),t.agentVersion!=null&&(e.agentVersion=t.agentVersion),
t.publicKey!=null&&(e.publicKey=t.publicKey),t.observedAddr!=null&&(e.observedAddr=t.observedAddr),t.signedPeerRecord!=null&&
(e.signedPeerRecord=t.signedPeerRecord),e.listenAddrs=[...e.listenAddrs,...t.listenAddrs],e.protocols=[...new Set([...e.
protocols,...t.protocols])];return e}async function mz(n,e,t,r){const s=Rt(n,{maxDataLength:e}).pb(oc),i=[];for(let o=0;o<
Xg;o++)try{i.push(await s.read(t))}catch(a){if(i.length===0)throw a;r.trace("stopped reading identify - %e",a);break}i.length>=
Xg&&r("reached MAX_IDENTIFY_MESSAGES, returning truncated identify");try{await n.close(t)}catch(o){r.trace("error closin\
g identify stream after read - %e",o),n.abort(o)}return i}class bz{host;components;protocol;started;timeout;maxInboundStreams;maxOutboundStreams;maxMessageSize;maxObservedAddresses;runOnLimitedConnection;log;constructor(e,t){
this.protocol=t.protocol,this.started=!1,this.components=e,this.log=t.log,this.timeout=t.timeout??zt.timeout,this.maxInboundStreams=
t.maxInboundStreams??zt.maxInboundStreams,this.maxOutboundStreams=t.maxOutboundStreams??zt.maxOutboundStreams,this.maxMessageSize=
t.maxMessageSize??zt.maxMessageSize,this.maxObservedAddresses=t.maxObservedAddresses??zt.maxObservedAddresses,this.runOnLimitedConnection=
t.runOnLimitedConnection??zt.runOnLimitedConnection,this.host={protocolVersion:`${t.protocolPrefix??zt.protocolPrefix}/${QO}`,
agentVersion:e.nodeInfo.userAgent},this.handleProtocol=this.handleProtocol.bind(this)}isStarted(){return this.started}async start(){
this.started||(await this.components.peerStore.merge(this.components.peerId,{metadata:{AgentVersion:en(this.host.agentVersion),
ProtocolVersion:en(this.host.protocolVersion)}}),await this.components.registrar.handle(this.protocol,this.handleProtocol,
{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams,runOnLimitedConnection:this.runOnLimitedConnection}),
this.started=!0)}async stop(){await this.components.registrar.unhandle(this.protocol),this.started=!1}}class yz extends bz{constructor(e,t={}){
super(e,{...t,protocol:`/${t.protocolPrefix??zt.protocolPrefix}/${YO}/${JO}`,log:e.logger.forComponent("libp2p:identify")}),
(t.runOnConnectionOpen??zt.runOnConnectionOpen)&&e.events.addEventListener("connection:open",r=>{const s=r.detail;this.identify(
s).catch(()=>{})})}[rt]=["@libp2p/identify"];async _identify(e,t={}){let r,s;if(t.signal==null){const i=AbortSignal.timeout(
this.timeout);t={...t,signal:i}}this.log("run identify on new connection %a",e.remoteAddr);try{r=await e.newStream(this.
protocol,{...t,runOnLimitedConnection:this.runOnLimitedConnection}),s=r.log.newScope("identify");const i=await mz(r,this.
maxMessageSize,t,s);return gz(i)}catch(i){throw s?.error("identify failed - %e",i),r?.abort(i),i}}async identify(e,t={}){
const r=await this._identify(e,t),{publicKey:s,protocols:i,observedAddr:o}=r;if(s==null)throw new Q("Public key was miss\
ing from identify message");const a=gv(s),c=Lt(a);if(!e.remotePeer.equals(c))throw new Q("Identified peer does not match\
 the expected peer");if(this.components.peerId.equals(c))throw new Q("Identified peer is our own peer id?");return this.
maybeAddObservedAddress(o),this.log("completed for peer %p and protocols %o",c,i),pz(this.components.peerStore,this.components.
events,this.log,e,r)}maybeAddObservedAddress(e){const t=bv(e);if(t==null||(this.log.trace("our observed address was %a",
t),hs(t)))return;const r=t.getComponents();if((r[0].code===as||r[0].code===Dm&&r[1].code===as)&&!z2(t)){this.log.trace("\
our observed address was IPv6 but not a global unicast address");return}va.exactMatch(t)||(this.log.trace("storing the o\
bserved address"),this.components.addressManager.addObservedAddr(t))}async handleProtocol(e,t){const r=e.log.newScope("i\
dentify");r("responding to identify");const s=AbortSignal.timeout(this.timeout),i=await this.components.peerStore.get(this.
components.peerId,{signal:s}),o=this.components.addressManager.getAddresses().map(u=>u.decapsulateCode(L));let a=i.peerRecordEnvelope;
if(o.length>0&&a==null){const u=new pt({peerId:this.components.peerId,multiaddrs:o});a=(await Ht.seal(u,this.components.
privateKey,{signal:s})).marshal().subarray()}let c=t.remoteAddr.bytes;n1.matches(t.remoteAddr)||(c=void 0);const l=Rt(e).
pb(oc);r("send response"),await l.write({protocolVersion:this.host.protocolVersion,agentVersion:this.host.agentVersion,publicKey:Vc(
this.components.privateKey.publicKey),listenAddrs:o.map(u=>u.bytes),signedPeerRecord:a,observedAddr:c,protocols:i.protocols},
{signal:s}),r("close write"),await l.unwrap().unwrap().close({signal:s})}}function wz(n={}){return e=>new yz(e,n)}class Fd extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,Fd)}}const vz=n=>"reason"in n?n.reason:new DOMException(
"This operation was aborted.","AbortError"),Sz=2**31-1,Az=(n,e)=>{if(typeof n!="number"||Math.sign(n)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${n}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function Ez(n,e){
const{milliseconds:t,fallback:r,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
n.cancel?.()}catch{}},h=new Promise((f,p)=>{const A=()=>{p(vz(o)),l()},y=Az(t,i);try{y?p(y):o?.aborted?A():o&&(c=A,o.addEventListener(
"abort",c,{once:!0}))}finally{n.then(f,p)}if(y||o?.aborted||t>Sz)return;const I=r||s===!1||s instanceof Error?void 0:new Fd(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(r)try{f(r())}catch(d){p(d)}else s===!1?
f():p(s instanceof Error?s:I);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const yv=n=>typeof n=="function"?{filter:n}:
{...n},_z=n=>n===1/0||Number.isSafeInteger(n)&&n>=0,xz=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],Cz=n=>{for(const[e,t]of xz){const r=n?.[e],s=n?.[t];if(typeof r=="function"&&typeof s=="functi\
on")return{addListener:r.bind(n),removeListener:s.bind(n)}}throw new TypeError("Emitter is not compatible")},Iz=n=>{const e=new Map;
for(const[t,r]of n)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,r);return e},Tz=({addListener:n,removeListener:e,
handlers:t,signal:r,abortHandler:s,isDone:i})=>{r?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(n(o,a),i()){
e(o,a);return}},Dz=({removeListener:n,handlers:e,signal:t,abortHandler:r})=>{for(const[s,i]of e)n(s,i);t?.removeEventListener(
"abort",r)},Pz=(n,e,t)=>{let r=Promise.resolve();return(s,i)=>{r=r.then(async()=>{if(e())return;let o;try{o=n?await n(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function Mz(n,e,t){let r=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=yv(t);const{
filter:l}=t;if(!_z(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=Cz(n);if(t.count===0){a([]);return}const f=[],p=w=>{
r(),c(w)},A=Pz(l,()=>s,p),y=w=>{f.push(w),t.count===f.length&&(r(),a(f))},I=(...w)=>{if(s)return;const b=t.multiArgs?w:w[0];
if(!l){y(b);return}A(b,v=>{v&&y(b)})},d=(...w)=>{p(t.rejectionMultiArgs?w:w[0])},m=()=>{p(t.signal.reason)},E={addListener:u,
removeListener:h,handlers:Iz([[e,I],[t.rejectionEvents??["error"],d]]),signal:t.signal,abortHandler:m,isDone:()=>s};r=()=>{
s=!0,clearTimeout(i),Dz(E)},Tz(E),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
r,t.timeout)),a(f))});if(o.cancel=r,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=Ez(o,{milliseconds:t.
timeout});return a.cancel=()=>{r(),a.clear()},a}return o}function $z(n,e,t){const r=Mz(n,e,{...yv(t),count:1,resolveImmediately:!1}),
s=r.then(i=>i[0]);return s.cancel=r.cancel,s}function pn(n=0){return new Uint8Array(n)}function yh(n=0){return new Uint8Array(
n)}function kz(n){return n?.buffer instanceof ArrayBuffer}function Lz(n){if(kz(n))return n;const e=n.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function nm(n,e){e==null&&(e=n.reduce((s,i)=>s+i.length,0));const t=yh(e);let r=0;for(const s of n)
t.set(s,r),r+=s.length;return Lz(t)}function wv(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<
n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}const vv=Symbol.for("@achingbrain/uint8arraylist");function rm(n,e){if(e==
null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const r of n){const s=t+r.byteLength;if(e<s)return{
buf:r,index:e-t};t=s}throw new RangeError("index is out of bounds")}function qo(n){return!!n?.[vv]}class wi{bufs;length;[vv]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const r of e)if(r instanceof Uint8Array)t+=r.byteLength,this.
bufs.push(r);else if(qo(r)){t+=r.byteLength;for(const s of r.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const r of e.reverse())if(r instanceof Uint8Array)t+=r.byteLength,this.bufs.unshift(r);else if(qo(r))t+=r.byteLength,
this.bufs.unshift(...r.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=rm(this.bufs,e);return t.buf[t.index]}set(e,t){const r=rm(this.bufs,e);r.buf[r.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let r=0;r<e.length;r++)this.set(t+r,e[r]);else if(qo(e))for(let r=0;r<e.length;r++)this.set(
t+r,e.get(r));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:r,length:s}=this._subList(e,t);return nm(r,s)}subarray(e,t){
const{bufs:r,length:s}=this._subList(e,t);return r.length===1?r[0]:nm(r,s)}sublist(e,t){const{bufs:r,length:s}=this._subList(
e,t),i=new wi;return i.length=s,i.bufs=r,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const r=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){r.push(o);break}
const h=e-a;r.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){r.push(o);continue}r.push(o.subarray(e-a));continue}if(u){
if(t===c){r.push(o);break}r.push(o.subarray(0,t-a));break}r.push(o)}return{bufs:r,length:t-e}}indexOf(e,t=0){if(!qo(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const r=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=r.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[r[h]]=h;const a=o,c=this.byteLength-r.byteLength,l=r.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let f=l;f>=0;f--){const p=this.get(h+f);if(r[f]!==p){u=Math.max(1,f-a[p]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const r=yh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setInt8(0,t),this.write(r,e)}getInt16(e,t){
const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt16(0,t)}setInt16(e,t,r){const s=pn(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,r),this.write(s,e)}getInt32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt32(0,t)}setInt32(e,t,r){const s=pn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,r),this.write(s,e)}getBigInt64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getBigInt64(0,t)}setBigInt64(e,t,r){const s=pn(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,r),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const r=yh(1);new DataView(r.buffer,r.byteOffset,r.byteLength).setUint8(
0,t),this.write(r,e)}getUint16(e,t){const r=this.subarray(e,e+2);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint16(0,t)}setUint16(e,t,r){const s=pn(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,r),this.write(
s,e)}getUint32(e,t){const r=this.subarray(e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getUint32(0,t)}setUint32(e,t,r){
const s=pn(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,r),this.write(s,e)}getBigUint64(e,t){const r=this.
subarray(e,e+8);return new DataView(r.buffer,r.byteOffset,r.byteLength).getBigUint64(0,t)}setBigUint64(e,t,r){const s=pn(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,r),this.write(s,e)}getFloat32(e,t){const r=this.subarray(
e,e+4);return new DataView(r.buffer,r.byteOffset,r.byteLength).getFloat32(0,t)}setFloat32(e,t,r){const s=pn(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,r),this.write(s,e)}getFloat64(e,t){const r=this.subarray(e,e+8);return new DataView(
r.buffer,r.byteOffset,r.byteLength).getFloat64(0,t)}setFloat64(e,t,r){const s=pn(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,r),this.write(s,e)}equals(e){if(e==null||!(e instanceof wi)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!wv(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const r=new wi;return r.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),r.length=t,r}}const sm=32,Rz="1.0.0",Nz="p\
ing",Fz="ipfs",Uz=1e4,Oz=2,Bz=1;class zz{protocol;components;started;timeout;maxInboundStreams;maxOutboundStreams;runOnLimitedConnection;constructor(e,t={}){
this.components=e,this.started=!1,this.protocol=`/${t.protocolPrefix??Fz}/${Nz}/${Rz}`,this.timeout=t.timeout??Uz,this.maxInboundStreams=
t.maxInboundStreams??Oz,this.maxOutboundStreams=t.maxOutboundStreams??Bz,this.runOnLimitedConnection=t.runOnLimitedConnection??
!0,this.handlePing=this.handlePing.bind(this)}[Symbol.toStringTag]="@libp2p/ping";[rt]=["@libp2p/ping"];async start(){await this.
components.registrar.handle(this.protocol,this.handlePing,{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.
maxOutboundStreams,runOnLimitedConnection:this.runOnLimitedConnection}),this.started=!0}async stop(){await this.components.
registrar.unhandle(this.protocol),this.started=!1}isStarted(){return this.started}async handlePing(e,t){const r=e.log.newScope(
"ping");r.trace("ping from %p",t.remotePeer);const s=AbortSignal.timeout(this.timeout);s.addEventListener("abort",()=>{e.
abort(new Rm("Ping timed out"))});const i=Date.now();for await(const o of e){if(e.status!=="open"){r("stream status chan\
ged to %s",e.status);break}e.send(o)||(r("waiting for stream to drain"),await $z(e,"drain",{rejectionEvents:["close"],signal:s}),
r("stream drained"))}r("ping from %p complete in %dms",t.remotePeer,Date.now()-i),await e.close({signal:s})}async ping(e,t={}){
const r=crypto.getRandomValues(new Uint8Array(sm)),s=await this.components.connectionManager.openStream(e,this.protocol,
{runOnLimitedConnection:this.runOnLimitedConnection,...t}),i=s.log.newScope("ping");try{const o=Date.now(),a=Promise.withResolvers(),
c=new wi,l=u=>{if(c.append(u.data),c.byteLength===sm){s.removeEventListener("message",l);const h=Date.now()-o;Promise.all(
[s.closeRead(t)]).then(()=>{if(wv(r,c.subarray()))a.resolve(h);else throw new ta(`Received wrong ping ack after ${h}ms`)}).
catch(f=>{s.abort(f),a.reject(f)})}};return s.addEventListener("message",l),s.send(r),await s.close(t),await Dt(a.promise,
t.signal)}catch(o){throw i.error("error while pinging %o - %e",e,o),s?.abort(o),o}finally{s?.close()}}}function Vz(n={}){
return e=>new zz(e,n)}const qz="bootstrap",Wz=50,Kz=1e3;class Gz extends ue{static tag="bootstrap";log;timer;list;timeout;components;_init;constructor(e,t={
list:[]}){if(t.list==null||t.list.length===0)throw new Error("Bootstrap requires a list of peer addresses");super(),this.
components=e,this.log=e.logger.forComponent("libp2p:bootstrap"),this.timeout=t.timeout??Kz,this.list=t.list.map(r=>k(r)).
filter(r=>Lh.matches(r)?r.getComponents().findLast(i=>i.code===L)?.value==null?(this.log.error("invalid bootstrap multia\
ddr without peer id"),!1):!0:(this.log.error("invalid multiaddr %a",r),!1)).map(r=>({id:Z(r.getComponents().findLast(s=>s.
code===L)?.value??""),multiaddrs:[r]})),this._init=t}[ya]=this;[Symbol.toStringTag]="@libp2p/bootstrap";[rt]=["@libp2p/p\
eer-discovery"];isStarted(){return!!this.timer}start(){this.isStarted()||(this.log("Starting bootstrap node discovery, d\
iscovering peers after %s ms",this.timeout),this.timer=setTimeout(()=>{this._discoverBootstrapPeers().catch(e=>{this.log.
error("failed to discover bootstrap peers - %e",e)})},this.timeout))}async _discoverBootstrapPeers(){if(this.timer!=null)
for(const e of this.list){if(await this.components.peerStore.merge(e.id,{tags:{[this._init.tagName??qz]:{value:this._init.
tagValue??Wz,ttl:this._init.tagTTL}},multiaddrs:e.multiaddrs}),this.timer==null)return;this.safeDispatchEvent("peer",{detail:e}),
this.components.connectionManager.openConnection(e.id).catch(t=>{this.log.error("could not dial bootstrap peer %p - %e",
e.id,t)})}}stop(){this.timer!=null&&clearTimeout(this.timer),this.timer=void 0}}function jz(n){return e=>new Gz(e,n)}var ac;
(function(n){let e;n.codec=()=>(e==null&&(e=ne((t,r,s={})=>{if(s.lengthDelimited!==!1&&r.fork(),t.publicKey!=null&&t.publicKey.
byteLength>0&&(r.uint32(10),r.bytes(t.publicKey)),t.addrs!=null)for(const i of t.addrs)r.uint32(18),r.bytes(i);s.lengthDelimited!==
!1&&r.ldelim()},(t,r,s={})=>{const i={publicKey:kn(0),addrs:[]},o=r==null?t.len:t.pos+r;for(;t.pos<o;){const a=t.uint32();
switch(a>>>3){case 1:{i.publicKey=t.bytes();break}case 2:{if(s.limits?.addrs!=null&&i.addrs.length===s.limits.addrs)throw new oe(
'Decode error - map field "addrs" had too many elements');i.addrs.push(t.bytes());break}default:{t.skipType(a&7);break}}}
return i})),e),n.encode=t=>re(t,n.codec()),n.decode=(t,r)=>se(t,n.codec(),r)})(ac||(ac={}));const Hz="_peer-discovery._p\
2p._pubsub";class Xz extends ue{[ya]=!0;[Symbol.toStringTag]="@libp2p/pubsub-peer-discovery";interval;listenOnly;topics;intervalId;components;log;constructor(e,t={}){
super();const{interval:r,topics:s,listenOnly:i}=t;this.components=e,this.interval=r??1e4,this.listenOnly=i??!1,this.log=
e.logger.forComponent("libp2p:discovery:pubsub"),Array.isArray(s)&&s.length>0?this.topics=s:this.topics=[Hz],this._onMessage=
this._onMessage.bind(this)}isStarted(){return this.intervalId!=null}start(){}afterStart(){if(this.intervalId!=null)return;
const e=this.components.pubsub;if(e==null)throw new Error("PubSub not configured");for(const t of this.topics)e.subscribe(
t),e.addEventListener("message",this._onMessage);this.listenOnly||(this._broadcast(),this.intervalId=setInterval(()=>{this.
_broadcast()},this.interval))}beforeStop(){const e=this.components.pubsub;if(e==null)throw new Error("PubSub not configu\
red");for(const t of this.topics)e.unsubscribe(t),e.removeEventListener("message",this._onMessage)}stop(){this.intervalId!=
null&&(clearInterval(this.intervalId),this.intervalId=void 0)}_broadcast(){const e=this.components.peerId;if(e.publicKey==
null)throw new Error("PeerId was missing public key");const t={publicKey:Ir(e.publicKey),addrs:this.components.addressManager.
getAddresses().map(i=>i.bytes)},r=ac.encode(t),s=this.components.pubsub;if(s==null)throw new Error("PubSub not configure\
d");for(const i of this.topics){if(s.getSubscribers(i).length===0){this.log("skipping broadcasting our peer data on topi\
c %s because there are no peers present",i);continue}this.log("broadcasting our peer data on topic %s",i),s.publish(i,r)}}_onMessage(e){
if(!this.isStarted())return;const t=e.detail;if(this.topics.includes(t.topic))try{const r=ac.decode(t.data),s=Xt(r.publicKey),
i=Lt(s);if(i.equals(this.components.peerId))return;this.log("discovered peer %p on %s",i,t.topic),this.safeDispatchEvent(
"peer",{detail:{id:i,multiaddrs:r.addrs.map(o=>k(o))}})}catch(r){this.log.error("error handling incoming message",r)}}}function Qz(n={}){
return e=>new Xz(e,n)}const im=(n,e)=>typeof n!="number"||!Number.isFinite(n)?e:Math.max(1,Math.min(60,n)),Kn={snapshotHz:20,
commandHz:30,keepaliveMs:1e3,maxEventsPerTick:20,eventRetryMs:500,eventRetryMax:5,reliableEventTypes:[],reconnectStallMs:8e3,
reconnectBackoffMs:5e3,snapshotsRequireAuthority:!1,snapshotTopic:null,commandTopic:null,eventTopic:null};class Yz{constructor(e,t={}){
this.adapter=e,this.stateProviders=new Map,this.commandProviders=new Map,this.eventQueue=[],this.pendingReliableEvents=new Map,
this.reliabilityStats={sent:0,acked:0,dropped:0},this.snapshotHandlers=[],this.commandHandlers=[],this.eventHandlers=[],
this.seq={snapshot:0,command:0,event:0},this.lastSnapshotAt=-1/0,this.lastCommandAt=-1/0,this.lastEventAt=-1/0,this.lastRxAt=
0,this.lastTxAt=0,this.lastReconnectAt=-1/0,this.stateDirty=!0,this.authorityId=null,this.configure(t)}configure(e={}){const t=Number.
isFinite(e.eventRetryMs)?e.eventRetryMs:Kn.eventRetryMs,r=Number.isFinite(e.eventRetryMax)?e.eventRetryMax:Kn.eventRetryMax;
this.profile={...Kn,...e,snapshotHz:im(e.snapshotHz,Kn.snapshotHz),commandHz:im(e.commandHz,Kn.commandHz),eventRetryMs:Math.
max(0,t),eventRetryMax:Math.max(1,r),reliableEventTypes:Array.isArray(e.reliableEventTypes)?e.reliableEventTypes:Kn.reliableEventTypes},
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
null,target:t||null,payload:{eventIds:s}};this.adapter?.sendEvent?.(o)}}const Jz=4,Zz=5,e7=6,om=2,am=15e3,Xl=8,t7=1,Ut=(n,e)=>Number.
isFinite(n)?n:e,Kr=n=>{if(!n||typeof n!="object")return{x:0,y:0,z:0};const e=Number.isFinite(n.x)?n.x:0,t=Number.isFinite(
n.y)?n.y:0,r=Number.isFinite(n.z)?n.z:0;return{x:e,y:t,z:r}},cm=(n,e)=>{const t=(n?.x||0)-(e?.x||0),r=(n?.y||0)-(e?.y||0),
s=(n?.z||0)-(e?.z||0);return Math.sqrt(t*t+r*r+s*s)},n7=n=>{let e=0;const t=String(n||"");for(let r=0;r<t.length;r+=1)e=
(e<<5)-e+t.charCodeAt(r),e|=0;return Math.abs(e)},r7=(n,e,t)=>{if(e<=0)return[];const r=n.map(s=>({entry:s,score:n7(`${t}\
:${s.peerId}`)}));return r.sort((s,i)=>s.score-i.score),r.slice(0,e).map(s=>s.entry)};class s7{constructor(e={}){this.config=
{topologyId:e.topologyId||"default-topology",topologyType:e.topologyType||e.topology||"distributed",targetConnections:Ut(
e.targetConnections,Jz),maxConnections:Ut(e.maxConnections,Zz),connectionRadius:Ut(e.connectionRadius,e7),isolationMinConnections:Ut(
e.isolationMinConnections,om),longRangeCount:Ut(e.longRangeCount,1),longRangeRefreshMs:Ut(e.longRangeRefreshMs,am),shardSize:Ut(
e.shardSize,Xl),shardRadius:Ut(e.shardRadius,t7),enforceTopologyScope:e.enforceTopologyScope!==!1,allowRelayWhenIsolated:e.
allowRelayWhenIsolated!==!1},this.peerId=e.peerId||null,this.localMetric=Kr(e.metric),this.longRangePeers=new Set,this.lastLongRangeAt=
0,this.desiredPeers=new Set,this.referralPeers=new Set,this.priorityPeers=[]}setPeerId(e){this.peerId=e||null}setLocalMetric(e){
this.localMetric=Kr(e)}setConnectionLimits({targetConnections:e,maxConnections:t}={}){Number.isFinite(e)&&(this.config.targetConnections=
Math.max(1,e)),Number.isFinite(t)&&(this.config.maxConnections=Math.max(1,t))}setPriorityPeers(e=[]){if(!Array.isArray(e)){
this.priorityPeers=[];return}const t=[];e.forEach(r=>{r&&(t.includes(r)||t.push(r))}),this.priorityPeers=t}addReferralPeers(e=[]){
e.forEach(t=>{t&&this.referralPeers.add(t)})}clearReferral(e){e&&this.referralPeers.delete(e)}getShardId(e=this.localMetric){
const t=this.config.shardSize||Xl,r=Kr(e),s=Math.floor(r.x/t),i=Math.floor(r.y/t),o=Math.floor(r.z/t);return`${s}:${i}:${o}`}getNeighborShardIds(e=this.
localMetric){const t=Math.max(0,this.config.shardRadius||0),r=this.config.shardSize||Xl,s=Kr(e),i=Math.floor(s.x/r),o=Math.
floor(s.y/r),a=Math.floor(s.z/r),c=[];for(let l=-t;l<=t;l+=1)for(let u=-t;u<=t;u+=1)for(let h=-t;h<=t;h+=1)c.push(`${i+l}\
:${o+u}:${a+h}`);return c}_filterCandidates(e){return Array.isArray(e)?e.filter(t=>!t?.peerId||t.peerId===this.peerId?!1:
this.config.enforceTopologyScope?!(t.topologyId&&t.topologyId!==this.config.topologyId):!0):[]}_pickLongRange(e,t){if(this.
config.longRangeCount<=0)return[];const r=this.config.longRangeRefreshMs||am;return(t-this.lastLongRangeAt>r||this.longRangePeers.
size===0)&&(this.longRangePeers.clear(),r7(e,this.config.longRangeCount,this.peerId||t).forEach(o=>this.longRangePeers.add(
o.peerId)),this.lastLongRangeAt=t),Array.from(this.longRangePeers)}computeDesiredPeers({peers:e=[],connections:t=[],now:r=Date.
now()}={}){const s=this._filterCandidates(e).map(d=>{const m=Kr(d.metric),E=cm(this.localMetric,m),w=Ut(d.targetConnections,
this.config.targetConnections),b=Number.isFinite(d.activeConnections)?d.activeConnections:null,v=b===null?!0:b<w;return{
...d,metric:m,distance:E,underTarget:v,noConnections:b===0,targetConnections:w}}),i=Math.max(1,this.config.maxConnections),
o=Number.isFinite(this.config.connectionRadius)?this.config.connectionRadius:null,a=Number.isFinite(o),c=Math.max(1,this.
config.isolationMinConnections||om),l=new Map(s.map(d=>[d.peerId,d])),u=s.filter(d=>Number.isFinite(d.distance)).slice().
sort((d,m)=>d.distance!==m.distance?d.distance-m.distance:String(d.peerId).localeCompare(String(m.peerId))),f=this.config.
topologyType==="distributed"?u[0]:null;let p=a?u.filter(d=>d.distance<=o):u,A=!1;a&&p.length===0&&(A=!0,p=u.slice(0,Math.
min(i,c))),A||p.sort((d,m)=>d.noConnections!==m.noConnections?d.noConnections?-1:1:d.distance!==m.distance?d.distance-m.
distance:String(d.peerId).localeCompare(String(m.peerId)));const y=new Set,I=Array.isArray(this.priorityPeers)?this.priorityPeers:
[];for(const d of I){if(y.size>=i)break;l.has(d)&&y.add(d)}f?.peerId&&y.size<i&&y.add(f.peerId);for(const d of p){if(y.size>=
i)break;y.add(d.peerId)}if(y.size<i){const d=[];for(const m of this.referralPeers){if(y.has(m))continue;const E=s.find(w=>w.
peerId===m);E&&(a&&Number.isFinite(E.distance)&&E.distance>o||d.push(m))}d.forEach(m=>{y.size<i&&y.add(m)})}return!a&&y.
size<i&&this._pickLongRange(s,r).filter(m=>!y.has(m)).forEach(m=>{y.size<i&&y.add(m)}),this.desiredPeers=y,y}shouldDialPeer(e){
return e?this.desiredPeers.size===0?!0:this.desiredPeers.has(e):!1}getPeerDistance(e){if(!e)return Number.POSITIVE_INFINITY;
const t=e.metricInitialized===!0,r=Kr(e.metric),s=r.x===0&&r.y===0&&r.z===0;return!t&&s?Number.POSITIVE_INFINITY:cm(this.
localMetric,r)}}const i7=Object.freeze({targetConnections:4,maxConnections:5,trialMs:6e3,exploreIntervalMs:3e3,maxExploreIntervalMs:3e5,
maxRepairIntervalMs:15e3,retryCooldownMs:2e4,referralShare:.5,replaceMargin:.1,minGainShare:.05,failFactor:2,successFactor:.5});
function o7(){return{lastExploreAt:Number.NEGATIVE_INFINITY,exploreDelayMs:null,trialPeerId:null,lastRepairAt:Number.NEGATIVE_INFINITY,
repairDelayMs:0,established:new Set,cooldown:new Map,baselines:new Map}}function Wo(n,e){return n.length?n[Math.min(n.length-
1,Math.floor(e()*n.length))]:null}function a7({now:n,links:e=[],candidates:t=[],referrals:r=[],available:s=[],state:i,random:o=Math.
random,config:a={}}={}){if(!i)throw new TypeError("decideThroughputTopology requires a state object");const c={...i7,...a},
l=Math.max(1,c.targetConnections),u=Math.max(l,c.maxConnections),h=c.exploreIntervalMs,f=v=>Math.min(c.maxExploreIntervalMs,
Math.max(h,v*(i.exploreDelayMs??h))),p=new Set(e.map(v=>v.peerId));for(const v of i.established)p.has(v)||i.established.
delete(v);for(const[v,g]of i.cooldown)g<=n&&i.cooldown.delete(v);const A=e.reduce((v,g)=>v+g.flow,0);for(const v of i.baselines.
keys())p.has(v)||i.baselines.delete(v);for(const v of e)!i.established.has(v.peerId)&&!i.baselines.has(v.peerId)&&i.baselines.
set(v.peerId,A-v.flow);const y=[],I=e.some(v=>n-v.since<c.trialMs);if(!I){if(e.length>l){const g=Math.min(A,...e.filter(
S=>!i.established.has(S.peerId)).map(S=>i.baselines.get(S.peerId))),x=A-g>Math.max(c.minGainShare*g,1e-9),_=e.map(S=>({...S,
score:i.established.has(S.peerId)?S.flow:x?S.flow/(1+c.replaceMargin):Number.NEGATIVE_INFINITY})).sort((S,C)=>C.score-S.
score||S.since-C.since||String(S.peerId).localeCompare(String(C.peerId)));for(const S of _.slice(l))y.push(S.peerId),i.cooldown.
set(S.peerId,n+c.retryCooldownMs)}if(i.trialPeerId!==null){const g=p.has(i.trialPeerId)&&!y.includes(i.trialPeerId);i.exploreDelayMs=
f(g?c.successFactor:c.failFactor),g||i.cooldown.set(i.trialPeerId,n+c.retryCooldownMs),i.trialPeerId=null}const v=new Set(
y);for(const g of e)v.has(g.peerId)||i.established.add(g.peerId);i.baselines.clear()}const d=e.length-y.length;d>=l&&(i.
repairDelayMs=0);const m=d<l,E=m&&n-i.lastRepairAt>=i.repairDelayMs,w=!m&&!I&&i.trialPeerId===null&&d<u&&n-i.lastExploreAt>=
(i.exploreDelayMs??h);let b=null;if(E||w){const v=_=>!p.has(_)&&(E||!i.cooldown.has(_)),g=r.filter(v),x=t.filter(v);b=(E?
Wo(s.filter(v),o):null)??(g.length&&o()<c.referralShare?Wo(g,o):null)??Wo(x,o)??Wo(g,o),b&&w&&(i.lastExploreAt=n,i.trialPeerId=
b),b&&E&&(i.lastRepairAt=n,i.repairDelayMs=Math.min(c.maxRepairIntervalMs,Math.max(h,2*i.repairDelayMs)))}return{connect:b,
drop:y}}const Oe=(n,e="ERR_INFERENCE_RECOVERY")=>Object.assign(new Error(n),{code:e}),cc=n=>n.reason??new DOMException("\
Connection recovery cancelled","AbortError"),Ko=n=>n?.status==="open",Sv=n=>n?.remoteAddr?.toString()??"",c7=n=>Sv(n).includes(
"/p2p-circuit"),Gr=(n,e,t)=>{if(!Number.isSafeInteger(n)||n<e||n>t)throw new RangeError("Invalid connection recovery bou\
nd");return n};function Go(n,e){return e.aborted?(Promise.resolve(n).catch(()=>{}),Promise.reject(cc(e))):new Promise((t,r)=>{
const s=()=>r(cc(e));e.addEventListener("abort",s,{once:!0}),Promise.resolve(n).then(t,r).finally(()=>e.removeEventListener(
"abort",s))})}class l7{constructor(e,{now:t=Date.now,dialTimeoutMs:r=5e3,cooldownMs:s=15e3,freshGraceMs:i=1e4,idleGraceMs:o=15e3,
maxConcurrent:a=2}={}){this.manager=e,this.now=t,this.dialTimeoutMs=Gr(r,10,15e3),this.cooldownMs=Gr(s,1,6e4),this.freshGraceMs=
Gr(i,0,3e4),this.idleGraceMs=Gr(o,0,3e4),this.maxConcurrent=Gr(a,1,4),this.pending=new Map,this.cooldowns=new Map,this.protections=
new WeakMap,this.closed=!1}observe(e,{openedNow:t=!1}={}){if(!e||this.protections.has(e))return;const r=e.timeline?.open??
e.stat?.timeline?.open,s=r instanceof Date?r.getTime():Number(r?.timestamp??r);this.protections.set(e,{freshUntil:Number.
isFinite(s)?s+this.freshGraceMs:t?this.now()+this.freshGraceMs:0,idleUntil:0,leases:new Map})}protectionMs(e){if(this.closed||
!Ko(e))return 0;this.observe(e);const t=this.protections.get(e),r=this.now();for(const[s,i]of t.leases)i<=r&&t.leases.delete(
s);return Math.max(0,t.freshUntil-r,t.idleUntil-r,...[...t.leases.values()].map(s=>s-r))}retain(e,{timeoutMs:t=3e5}={}){
if(Gr(t,1,301e3),this.closed||!Ko(e))throw Oe("Inference connection is closed");if(!this.manager.libp2p?.getConnections().
includes(e))throw Oe("Inference connection is not owned by this manager");this.observe(e);const r=this.protections.get(e),
s=Symbol("inference-stream");r.leases.set(s,this.now()+t);let i=!1;const o=()=>this.manager._scheduleRelayPrune?.(e.remotePeer.
toString(),Math.max(1,this.protectionMs(e)));return o(),()=>{i||(i=!0,r.leases.delete(s),r.idleUntil=this.now()+this.idleGraceMs,
this.closed||o())}}notifyRelayReady(e){this.pending.get(e)?.ready()}recover(e,{signal:t}={}){try{t?.throwIfAborted();const r=this.
manager,s=this.now(),i=r.peers?.get(e);if(this.closed||!r.isConnected||!r.libp2p)throw Oe("Network is not connected");if(!i||
e===r.peerId||r.bootstrapPeerIds?.has(e)||["gameId","roomId","topologyId"].some(E=>i[E]!==r.config[E]))throw Oe("Connect\
ion recovery requires a known peer in this application scope");const o=this.pending.get(e);if(o)return this._join(o,t);if(r.
pendingPeerDials?.has(e))throw Oe("A normal peer dial is already in progress");const a=r.recentDialAttempts?.get(e);if(Number.
isFinite(a)&&s-a<5e3)throw Oe("Peer connection recovery is limited by the normal dial throttle");for(const[E,w]of this.cooldowns)
w<=s&&this.cooldowns.delete(E);if(this.cooldowns.has(e))throw Oe("Peer connection recovery is cooling down","ERR_INFEREN\
CE_RECOVERY_COOLDOWN");if(this.pending.size>=this.maxConcurrent||this.cooldowns.size>=64)throw Oe("Connection recovery i\
s busy");if(!r._hasAvailableLogicalPeerSlot(e,s)||r._getDialBackoffEntry(e,s))throw Oe("Peer connection recovery is limi\
ted by the normal dial policy");const c=r._buildCircuitAddr(e);if(!c)throw Oe("No configured relay route for this peer");
const l=k(c.toString()),u=l.getComponents(),h=u.filter(E=>E.name==="p2p").map(E=>E.value);if(!r.config.bootstrapPeers?.some(
E=>`${String(E).replace(/\/p2p-circuit\/?$/,"")}/p2p-circuit/p2p/${e}`===l.toString())||h.length!==2||h[1]!==e||!r.bootstrapPeerIds.
has(h[0])||u.filter(E=>E.name==="p2p-circuit").length!==1||u.some(E=>E.name.startsWith("webrtc")))throw Oe("Connection r\
ecovery requires an exact configured relay and peer identity");const p=(E=r.libp2p.getDialQueue?.()??[])=>{const w=r.libp2p.
getConnections().filter(Ko),b=w.some(x=>x.remotePeer.toString()===h[0])?1:2,v=E.filter(x=>["queued","active"].includes(x.
status)&&!this.pending.has(x.peerId?.toString())).length,g=[...this.pending.entries()].reduce((x,[_,S])=>x+(_===e?0:S.slots),
0);if(w.length+g+v+b>r._getTransportMaxConnections())throw Oe("No physical connection headroom for recovery");return b},
A={controller:new AbortController,waiters:0,slots:p()};A.relayReady=new Promise(E=>{A.ready=E});const y=new Set(r.libp2p.
getConnections());this.pending.set(e,A),this.cooldowns.set(e,s+this.cooldownMs),r.recentDialAttempts?.set(e,s);const I=setTimeout(
()=>A.controller.abort(Oe("Peer connection recovery deadline exceeded","ERR_INFERENCE_RECOVERY_DEADLINE")),this.dialTimeoutMs);
I.unref?.();const d=E=>{if(!(!E||y.has(E)))try{Promise.resolve(E.abort(cc(A.controller.signal))).catch(()=>{})}catch{}},
m=async()=>{A.controller.signal.throwIfAborted();const E=r.libp2p.getDialQueue?.()??[];if(E.some(v=>["queued","active"].
includes(v.status)&&v.peerId?.toString()===e))throw Oe("A native peer dial is already in progress");A.slots=p(E);const w=Promise.
resolve(r.libp2p.dial(l,{force:!0,signal:A.controller.signal}));w.then(v=>{(A.controller.signal.aborted||this.closed)&&d(
v)},()=>{});const b=await Go(w,A.controller.signal);if(A.controller.signal.aborted||this.closed)throw d(b),cc(A.controller.
signal);if(y.has(b)||!Ko(b)||b.remotePeer.toString()!==e||!["/noise","/tls/1.0.0"].includes(b.encryption)||!c7(b)||Sv(b).
includes("/webrtc"))throw d(b),Oe("Recovery did not establish a fresh authenticated relay connection");return this.observe(
b,{openedNow:!0}),r._clearDialFailureBackoff?.(e),b};return A.promise=(async()=>{try{return await m()}catch(E){if(A.controller.
signal.aborted||!r._isRelayReservationError?.(E)||!await Go(Promise.resolve(r._requestRelayAssist(e,"inference-stream-re\
covery")),A.controller.signal))throw E;return await Go(A.relayReady,A.controller.signal),m()}})().catch(E=>{throw A.controller.
signal.aborted||r._recordDialFailureBackoff?.(e,"relay",E),E}).finally(()=>{clearTimeout(I),this.pending.get(e)===A&&this.
pending.delete(e)}),this._join(A,t)}catch(r){return Promise.reject(r)}}_join(e,t){return e.waiters++,(t?Go(e.promise,t):
e.promise).finally(()=>{--e.waiters===0&&[...this.pending.values()].includes(e)&&e.controller.abort(new DOMException("Co\
nnection recovery has no remaining callers","AbortError"))})}async stop(){this.closed=!0;const e=[...this.pending.values()];
for(const t of e)t.controller.abort(new DOMException("Network manager stopped","AbortError"));await Promise.allSettled(e.
map(t=>t.promise)),this.cooldowns.clear(),this.protections=new WeakMap}}const es="peercompute-netviz-sessions",lm="netvi\
z-telemetry-v1",um="peercompute.network-telemetry.v1",He=Object.freeze({maximumBytes:24*1024,maximumPeers:32,maximumModels:16,
maximumReports:256,intervalMs:5e3,minimumReceiveIntervalMs:500,staleMs:15e3,expiryMs:6e4,orderExpiryMs:3e5,providerTimeoutMs:1e3}),
u7=new TextEncoder,h7=new TextDecoder("utf-8",{fatal:!0}),jo=n=>n&&typeof n=="object"&&!Array.isArray(n)?n:{},Et=(n,e=128)=>typeof n==
"string"?n.replace(/[\u0000-\u001f\u007f]/g,"").slice(0,e):"",gn=n=>Number.isFinite(n)&&n>=0?Math.min(Number.MAX_SAFE_INTEGER,
n):0,jr=(n,e,t=null)=>e.includes(n)?n:t,d7=["world","models","compute","observer"],f7=["webrtc","relay-webrtc","relay","\
direct","direct-websocket","websocket","presence","unknown"],Ql=(n,e)=>Object.fromEntries(e.map(t=>[t,gn(n?.[t])]));function hm(n){
const e=jo(n),t=jo(e.compute),r=Et(e.peerId);if(!r)return null;const s=new Set,i=new Set,o=(Array.isArray(e.peers)?e.peers:
[]).slice(0,He.maximumPeers).flatMap(c=>{const l=jo(c),u=Et(l.peerId);return!u||u===r||s.has(u)?[]:(s.add(u),[{peerId:u,
via:jr(l.via,f7,"unknown"),signalingPath:jr(l.signalingPath,["direct","relay-scoped"]),mediaPath:jr(l.mediaPath,["direct",
"turn-relay","unknown"]),rttMs:Number.isFinite(l.rttMs)&&l.rttMs>=0?Math.min(l.rttMs,6e5):null,...Ql(l,["rxCount","txCou\
nt","rxBytes","txBytes","rxBps","txBps"])}])}),a=(Array.isArray(e.models)?e.models:[]).slice(0,He.maximumModels).flatMap(
c=>{const l=jo(c),u=Et(l.manifestCid);return!u||i.has(u)?[]:(i.add(u),[{manifestCid:u,name:Et(l.name,160),task:Et(l.task,
64),runtime:Et(l.runtime,48),busy:l.busy===!0,modalities:[...new Set((Array.isArray(l.modalities)?l.modalities:[]).slice(
0,8).map(h=>Et(h,32)).filter(Boolean))]}])});return{peerId:r,ts:gn(e.ts),application:Et(e.application||e.gameId,80),role:jr(
e.role,d7,a.length?"models":"compute"),gameId:Et(e.gameId),roomId:Et(e.roomId),topologyId:Et(e.topologyId),topology:jr(e.
topology,["distributed","hierarchical","emergent","throughput","static"],"distributed"),isConnected:e.isConnected===!0,peerCount:gn(
e.peerCount),counts:Ql(e.counts,["rx","tx","rxBytes","txBytes"]),rates:Ql(e.rates,["rxBps","txBps"]),peers:o,models:a,modelsStatus:jr(
e.modelsStatus,["available","unavailable"],"available"),compute:e.compute&&typeof e.compute=="object"?{workerCount:gn(t.
workerCount),activeTasks:gn(t.activeTasks??t.activeTaskCount),queuedTasks:gn(t.queuedTasks??t.queuedTaskCount),totalTasksCompleted:gn(
t.totalTasksCompleted),totalTasksFailed:gn(t.totalTasksFailed)}:null}}function Yl(n,e,t){return new Promise((r,s)=>{const i=new AbortController;
let o=!1;const a=(h,f)=>{o||(o=!0,clearTimeout(u),e.removeEventListener("abort",l),h(f))},c=h=>{i.abort(h),a(s,h)},l=()=>c(
e.reason??new DOMException("Telemetry stopped","AbortError")),u=setTimeout(()=>c(new Error("Telemetry provider deadline \
exceeded")),t);if(u.unref?.(),e.addEventListener("abort",l,{once:!0}),e.aborted){l();return}Promise.resolve().then(()=>n(
i.signal)).then(h=>a(r,h),h=>a(s,h))})}class p7{constructor(e,{now:t=Date.now}={}){this.manager=e,this.now=t,this.providers=
[],this.records=new Map,this.order=new Map,this.timer=null,this.controller=null,this.pending=null,this.error=null,this.instanceId=
globalThis.crypto.randomUUID(),this.sequence=0}get enabled(){return this.manager.config.enableNetworkTelemetry!==!1}get publishing(){
return this.enabled&&this.manager.config.networkTelemetryPublish!==!1}get provider(){return this.providers.at(-1)?.provider??
null}setProvider(e){if(e!==null&&typeof e!="function")throw new TypeError("Telemetry provider must be a function");if(e===
null)return this.providers.length=0,()=>{};const t={provider:e};return this.providers.push(t),()=>{const r=this.providers.
indexOf(t);r!==-1&&this.providers.splice(r,1)}}start(){!this.enabled||this.controller||(this.controller=new AbortController,
this.publishing&&(this.publish(),this.timer=setInterval(()=>{this.publish()},He.intervalMs),this.timer.unref?.()))}async stop(){
clearInterval(this.timer),this.timer=null,this.controller?.abort(new DOMException("Telemetry stopped","AbortError")),await this.
pending,this.controller=null,this.records.clear(),this.order.clear()}publish(){if(this.pending)return this.pending;if(!this.
publishing||!this.controller||this.controller.signal.aborted||!this.manager.isConnected)return Promise.resolve();const e=this.
controller.signal,t=(async()=>{try{const r=this.manager.libp2p?.services?.pubsub;if(!r||r.globalSignaturePolicy==="Stric\
tNoSign")throw new Error("Signed pubsub is required for network telemetry");const s=this.provider,i=s?await Yl(f=>s({signal:f}),
e,He.providerTimeoutMs):{};let o=[],a=null;const c=this.manager.getPeerInferenceService?.();if(c&&!c.closed)try{o=await Yl(
f=>c.getTelemetrySummary({signal:f}),e,He.providerTimeoutMs)}catch(f){if(e.aborted)throw f;a="Hosted-model telemetry una\
vailable"}if(e.aborted||!this.manager.isConnected||s!==this.provider)return;const l=hm({...this.manager.getTelemetrySnapshot(),
application:i?.application||this.manager.config.gameId,role:i?.role,compute:i?.compute,models:o,modelsStatus:a?"unavaila\
ble":"available",ts:this.now()});if(!l)return;const u={type:lm,schema:um,instanceId:this.instanceId,sequence:++this.sequence,
snapshot:l},h=u7.encode(JSON.stringify(u));if(h.byteLength>He.maximumBytes)throw new Error("Network telemetry exceeds it\
s byte limit");if(await Yl(()=>r.publish(es,h),e,He.providerTimeoutMs),e.aborted||!this.manager.isConnected)return;this.
_remember(l,this.now(),!0),this.error=a}catch(r){e.aborted||(this.error=String(r?.message??"Network telemetry unavailabl\
e").slice(0,160))}})();return this.pending=t,t.finally(()=>{this.pending===t&&(this.pending=null)}),t}handlePubsubMessage(e){
if(e?.topic!==es)return!1;const t=e.data;if(!(t instanceof Uint8Array)||t.byteLength>He.maximumBytes)return!0;let r;try{
r=JSON.parse(h7.decode(t))}catch{return!0}if(r?.type!==lm)return!1;if(!this.enabled||!this.controller||this.controller.signal.
aborted||e.type!=="signed")return!0;const s=e.from?.toString?.();if(!s||s===this.manager.peerId||s.length>128||r.schema!==
um||r.snapshot?.peerId!==s||typeof r.instanceId!="string"||!/^[a-zA-Z0-9-]{1,64}$/.test(r.instanceId)||!Number.isSafeInteger(
r.sequence)||r.sequence<1)return!0;this.prune();const i=this.now(),o=this.order.get(s);if(o&&(i-o.receivedAt<He.minimumReceiveIntervalMs||
o.instanceId===r.instanceId&&r.sequence<=o.sequence||o.retired.includes(r.instanceId)))return!0;const a=hm(r.snapshot);if(!a)
return!0;const c=o?.retired??[];return o&&o.instanceId!==r.instanceId&&c.push(o.instanceId),this.order.set(s,{instanceId:r.
instanceId,sequence:r.sequence,receivedAt:i,retired:c.slice(-8)}),this.order.size>He.maximumReports&&this.order.delete(this.
order.keys().next().value),this._remember(a,i,!1),!0}_remember(e,t,r){for(this.records.delete(e.peerId),this.records.set(
e.peerId,{...e,receivedAt:t,local:r,authenticated:!0,provenance:"peer-reported"});this.records.size>He.maximumReports;)this.
records.delete(this.records.keys().next().value)}prune(){const e=this.now();for(const[t,r]of this.records)e-r.receivedAt>
He.expiryMs&&this.records.delete(t);for(const[t,r]of this.order)e-r.receivedAt>He.orderExpiryMs&&this.order.delete(t)}list(){
this.prune();const e=this.now();return[...this.records.values()].map(t=>({...structuredClone(t),stale:e-t.receivedAt>He.
staleMs}))}getStatus(){return this.prune(),{enabled:this.enabled,publishing:this.publishing&&!!this.controller,reportCount:this.
records.size,error:this.error}}}const g7=new Set(["1","true","yes","on"]);let Ot=null;function m7(){if(typeof Ot=="boole\
an")return Ot;if(typeof globalThis<"u"&&typeof globalThis.__PC_DEBUG_OUTPUT__=="boolean")return Ot=globalThis.__PC_DEBUG_OUTPUT__,
Ot;if(typeof window>"u"||!window.location)return Ot=!1,Ot;try{const n=new URLSearchParams(window.location.search||""),e=String(
n.get("debugoutput")||"").trim().toLowerCase();Ot=g7.has(e)}catch{Ot=!1}return Ot}const dm="peercompute-state-sync",fm="\
peercompute-direct",pm="peercompute-presence",b7="pc",Jl=5e3,y7=8,Ho=1e4,gm=600*1e3,Av=1e4,Ev=15e3,w7=15e3,_v=1e4,wh=3e4,
vh=15e3,xv=3e4,Cv=1500,Iv=3e4,v7=16*1024,S7=["no_reservation","reservation","unexpected eof","remote closed connection d\
uring opening","stream has been reset","signal timed out","connection_failed","connection failed","user-initiated abort",
"cannot write to a stream that is closed","cannot write to a stream that is closing"],A7=new TextEncoder,E7=new TextDecoder;
async function Tv({privateKey:n,privateKeyProvider:e}={}){if(n!==void 0&&e!==void 0)throw new TypeError("Supply privateK\
ey or privateKeyProvider, not both");if(e!==void 0&&typeof e!="function")throw new TypeError("privateKeyProvider must be\
 a function");if(n===void 0&&e===void 0)return mS();const t=e===void 0?n:await e();if(!t)throw new TypeError("The config\
ured application identity is unavailable");return bS(t instanceof Uint8Array?t:Km(t))}const Ud=typeof __PC_DEBUG__<"u"&&
__PC_DEBUG__===!0,Be=(...n)=>{Ud&&console.log(...n)},H=(...n)=>{Ud&&console.warn(...n)},mm=n=>{if(!n||typeof n!="object"||
Array.isArray(n))return null;try{const e=JSON.stringify(n);if(!e||e.length>v7)return null;const t=JSON.parse(e);return t&&
typeof t=="object"&&!Array.isArray(t)?t:null}catch{return null}},Zl=n=>n?typeof n.byteLength=="number"?n.byteLength:typeof n.
length=="number"?n.length:0:0,_t=n=>n?typeof n=="string"?n:typeof n.toString=="function"?n.toString():String(n):"",kt=n=>_t(
n).includes("/p2p-circuit"),$n=n=>_t(n).includes("/webrtc"),eu=n=>kt(n)&&!$n(n),pa=n=>kt(n)&&$n(n),Yr=n=>!kt(n),bm=n=>Yr(
n),Hr=n=>{const e=String(n||"").trim().toLowerCase();return e?e==="direct"?"direct":e==="relay-scoped"?"relay-scoped":null:
null},Xr=n=>{const e=String(n||"").trim().toLowerCase();return e?e==="direct"?"direct":e==="turn-relay"||e==="relay"?"tu\
rn-relay":e==="unknown"?"unknown":null:null},ym=n=>pa(n)?"relay-webrtc":$n(n)?"webrtc":kt(n)?"relay":"direct",Od=n=>String(
n||"").trim().toLowerCase(),wm=n=>{const e=Od(n);return e==="direct"||e==="webrtc"||e==="webrtc-direct"},Xo=n=>{const e=Od(
n);return e==="relay"||e==="relay-webrtc"||e==="webrtc-relay"},vm=n=>{const e=Od(n);return e==="webrtc"||e==="webrtc-dir\
ect"||e==="direct"?{signalingPath:"direct",mediaPath:"direct"}:e==="relay"?{signalingPath:"relay-scoped",mediaPath:"turn\
-relay"}:e==="relay-webrtc"||e==="webrtc-relay"?{signalingPath:"relay-scoped",mediaPath:"unknown"}:{signalingPath:null,mediaPath:null}},
Dv=n=>$n(n)&&kt(n)?"webrtc-relay":$n(n)?"webrtc-direct":kt(n)?"relay":"direct",tu=n=>n.map(e=>{const t=_t(e);return`${Dv(
t)}:${t}`}),Ae=n=>n?typeof n.status=="string"?n.status==="open":!(n?.stat?.timeline?.close||n?.timeline?.close):!1,Qo=n=>{
if(n instanceof Date)return n.getTime();if(Number.isFinite(n))return Number(n);if(n&&typeof n=="object"){const e=n.timestamp??
n.time??n.at??n.value;if(Number.isFinite(e))return Number(e);if(e instanceof Date)return e.getTime()}return null},_7=n=>n?
Qo(n?.stat?.timeline?.open)??Qo(n?.stat?.timeline?.open?.timestamp)??Qo(n?.timeline?.open)??Qo(n?.timeline?.open?.timestamp)??
null:null,x7=n=>{const e=String(n?.message||n||"").toLowerCase();return e?S7.some(t=>e.includes(t)):!1},C7=n=>{if(!n)return"\
unknown";const e=typeof n=="string"?n:n?.message||n?.toString?.()||"";return e?e.toLowerCase().includes("timeout")?`time\
out (${e})`:e:"unknown"},I7=n=>{if(typeof n!="string")return null;const e=n.match(/candidate:\S+\s+\d+\s+(\w+)\s+\d+\s+([^\s]+)\s+(\d+)\s+typ\s+(\w+)/i);
return e?{protocol:e[1].toLowerCase(),address:`${e[2]}:${e[3]}`,type:e[4].toLowerCase()}:{type:"unknown",protocol:"",address:""}},
T7=(n,e)=>{const t=_t(n),r=t.includes("/p2p-circuit"),s=t.includes("/webrtc"),i=s&&!r?3:s?2:r?0:1,o=e&&t.includes("/ip6/")?
.1:0;return i+o},Sm=(n,e=!1)=>{const t=n.map((r,s)=>({addr:r,score:T7(r,e),index:s}));return t.sort((r,s)=>s.score-r.score||
r.index-s.index),t.map(r=>r.addr)},D7=(n,e)=>{if(!n||typeof n!="object")return n;const t=n.scoreParams;if(!t||typeof t!=
"object")return n;const r=t.topics;if(!r||typeof r!="object")return n;const s=r.__default;if(!s||typeof s!="object")return n;
const i={...r};return delete i.__default,e.filter(o=>typeof o=="string"&&o.length>0).forEach(o=>{i[o]||(i[o]={...s})}),{
...n,scoreParams:{...t,topics:i}}},P7=n=>{if(!n)return[];const e=Array.isArray(n)?n:[n],t=[];return e.forEach(r=>{if(!r)
return;if(typeof r=="string"){t.push({urls:r});return}if(typeof r!="object")return;const s=r.urls??r.url;if(!s)return;const i=Array.
isArray(s)?s.map(a=>String(a)).filter(Boolean):[String(s)];if(i.length===0)return;const o={...r,urls:Array.isArray(s)?i:
i[0]};t.push(o)}),t},M7=n=>{if(!n)return null;if(n===!0)return{mode:"logn",min:1,max:null,base:2};if(n===!1||typeof n!="\
object")return null;const e=n.mode??n.strategy??"logn",t=String(e).trim().toLowerCase();if(t==="none"||t==="off"||t==="d\
isabled"||t!=="logn"&&t!=="log(n)"&&t!=="sqrt")return null;const r=Number.isFinite(n.min)?Math.max(0,n.min):1,s=Number.isFinite(
n.max)?Math.max(r,n.max):null,i=Number.isFinite(n.base)?Math.max(2,n.base):2;return{mode:t==="log(n)"?"logn":t,min:r,max:s,
base:i}},$7=(n={})=>{const e=n&&typeof n.webrtc=="object"&&n.webrtc?n.webrtc:{},t=e.preferDirect??n.preferDirect??!0,r=e.
dropRelayOnDirect??n.dropRelayOnDirect??!0,s=e.dropRelayBootstrapOnDirect??n.dropRelayBootstrapOnDirect??!0,i=e.countRelayWebrtcAsDirectCapable??
n.countRelayWebrtcAsDirectCapable??!0,o=M7(e.relayRetention??n.relayRetention??!0),a=e.reconnectOnDialFailure??n.reconnectOnDialFailure??
!0,c=Number.isFinite(e.reconnectThrottleMs)?Math.max(5e3,e.reconnectThrottleMs):Number.isFinite(n.reconnectThrottleMs)?Math.
max(5e3,n.reconnectThrottleMs):3e4,l=Number.isFinite(e.autoDropRelayAfterDialMs)?Math.max(0,e.autoDropRelayAfterDialMs):
Number.isFinite(n.autoDropRelayAfterDialMs)?Math.max(0,n.autoDropRelayAfterDialMs):6e4,u=e.enableRelayAssist??n.enableRelayAssist??
!0,h=Number.isFinite(e.relayAssistRequestThrottleMs)?Math.max(1e3,e.relayAssistRequestThrottleMs):Number.isFinite(n.relayAssistRequestThrottleMs)?
Math.max(1e3,n.relayAssistRequestThrottleMs):Av,f=Number.isFinite(e.relayAssistReadyTimeoutMs)?Math.max(1e3,e.relayAssistReadyTimeoutMs):
Number.isFinite(n.relayAssistReadyTimeoutMs)?Math.max(1e3,n.relayAssistReadyTimeoutMs):Ev,p=Number.isFinite(e.relayDropMinDirectMs)?
Math.max(0,e.relayDropMinDirectMs):Number.isFinite(n.relayDropMinDirectMs)?Math.max(0,n.relayDropMinDirectMs):w7,A=Number.
isFinite(e.directUpgradeGraceMs)?Math.max(0,e.directUpgradeGraceMs):Number.isFinite(n.directUpgradeGraceMs)?Math.max(0,n.
directUpgradeGraceMs):_v,y=Number.isFinite(e.relayBootstrapMinHoldMs)?Math.max(0,e.relayBootstrapMinHoldMs):Number.isFinite(
n.relayBootstrapMinHoldMs)?Math.max(0,n.relayBootstrapMinHoldMs):wh,I=Number.isFinite(e.relayPostDirectHoldMs)?Math.max(
0,e.relayPostDirectHoldMs):Number.isFinite(n.relayPostDirectHoldMs)?Math.max(0,n.relayPostDirectHoldMs):vh,d=Number.isFinite(
e.relayElectionStickyMs)?Math.max(0,e.relayElectionStickyMs):Number.isFinite(n.relayElectionStickyMs)?Math.max(0,n.relayElectionStickyMs):
xv,m=Number.isFinite(e.dialFailureBackoffBaseMs)?Math.max(250,e.dialFailureBackoffBaseMs):Number.isFinite(n.dialFailureBackoffBaseMs)?
Math.max(250,n.dialFailureBackoffBaseMs):Cv,E=Number.isFinite(e.dialFailureBackoffMaxMs)?Math.max(m,e.dialFailureBackoffMaxMs):
Number.isFinite(n.dialFailureBackoffMaxMs)?Math.max(m,n.dialFailureBackoffMaxMs):Iv,w=P7(e.iceServers??n.iceServers??n.webrtcIceServers),
b=e.rtcConfiguration??n.rtcConfiguration??{},v=b&&typeof b=="object"?{...b}:{};return w.length>0&&(v.iceServers=w),{...e,
preferDirect:t,dropRelayOnDirect:r,dropRelayBootstrapOnDirect:s,countRelayWebrtcAsDirectCapable:i,relayRetention:o,reconnectOnDialFailure:a,
reconnectThrottleMs:c,autoDropRelayAfterDialMs:l,enableRelayAssist:u,relayAssistRequestThrottleMs:h,relayAssistReadyTimeoutMs:f,
relayDropMinDirectMs:p,directUpgradeGraceMs:A,relayBootstrapMinHoldMs:y,relayPostDirectHoldMs:I,relayElectionStickyMs:d,
dialFailureBackoffBaseMs:m,dialFailureBackoffMaxMs:E,iceServers:w,rtcConfiguration:v}},k7=n=>typeof n!="string"?!1:n.includes(
"/dns4/localhost")||n.includes("/dns/localhost")||n.includes("/ip6/::1")||n.includes("/ip4/127.")||n.includes("/ip4/10.")||
n.includes("/ip4/192.168.")?!0:/\/ip4\/172\.(1[6-9]|2\d|3[01])\./.test(n),Gn=n=>{if(typeof n!="string")return n;const e=n.
split("/p2p/");if(e.length<=2)return n;const t=e[e.length-1];return`${e[0]}/p2p/${t}`},Am=n=>{if(typeof n!="string")return null;
const e=n.split("/p2p/");return e.length<2?null:e[e.length-1]||null},Yo=n=>{if(!n)return null;if(typeof n.getComponents==
"function")return n;if(typeof n!="string")return null;try{return k(n)}catch(e){return H("[NetworkManager] Invalid peer m\
ultiaddr",n,e?.message||e),null}},L7=n=>{if(!n)return null;if(typeof n.getComponents=="function")return n;if(typeof n!="\
string")return null;const e=Gn(n);try{return k(e)}catch(t){return H("[NetworkManager] Invalid bootstrap multiaddr",e,t?.
message||t),null}},nu=(n,e)=>{if(!e||typeof n!="string")return n;const t=`/p2p/${e}`;return n.includes(t)?n:`${n}${t}`},
Ks=(n,e,t,r)=>`${[n,e,t].filter(Boolean).join(".")}.${r}`,Em=n=>{if(!n)return[];const t=(Array.isArray(n)?n:[n]).map(r=>String(
r||"").trim()).filter(Boolean);return Array.from(new Set(t))},R7=n=>{if(n===vn.FATAL_ALL||n===vn.NO_FATAL)return n;if(n==
null)return;const e=String(n).trim().toLowerCase();if(e==="fatal_all"||e==="fatal-all"||e==="fatalall")return vn.FATAL_ALL;
if(e==="no_fatal"||e==="no-fatal"||e==="nofatal")return vn.NO_FATAL},N7=n=>{if(!n||typeof n!="object")return null;const e={
...n},t=R7(e.faultTolerance);return t!==void 0?e.faultTolerance=t:"faultTolerance"in e&&delete e.faultTolerance,Object.keys(
e).length>0?e:null};class F7{constructor(e={}){const t=$7(e),r=e.roomId||"default-room",s=r==="__rooms__",i=Number.isFinite(
e.telemetrySampleMs)?Math.max(250,e.telemetrySampleMs):1e3,o=Number.isFinite(e.telemetryPingMs)?Math.max(500,e.telemetryPingMs):
5e3,a=Number.isFinite(e.presenceIntervalMs)?Math.max(1e3,e.presenceIntervalMs):3e3,c=Number.isFinite(e.maxConnections)?Math.
max(1,e.maxConnections):s?2:4,l=Number.isFinite(e.transportConnectionHeadroom)?Math.max(0,Math.trunc(e.transportConnectionHeadroom)):
3,u=Number.isFinite(e.transportMaxConnections)?Math.max(1,Math.trunc(e.transportMaxConnections)):void 0,h=Number.isFinite(
e.maxIncomingPendingConnections)?Math.max(1,e.maxIncomingPendingConnections):100,f=Number.isFinite(e.maxParallelDials)?Math.
max(1,e.maxParallelDials):void 0,p=Number.isFinite(e.maxDialQueueLength)?Math.max(1,e.maxDialQueueLength):void 0,A=Number.
isFinite(e.maxPeerAddrsToDial)?Math.max(1,e.maxPeerAddrsToDial):void 0,y=Number.isFinite(e.dialTimeoutMs)?Math.max(1e3,e.
dialTimeoutMs):Number.isFinite(e.dialTimeout)?Math.max(1e3,e.dialTimeout):void 0,I=(()=>{const te=e.maxDialPeers;return te===
null||te===1/0?null:Number.isFinite(te)?Math.max(0,te):s?4:y7})(),d=Number.isFinite(e.bootstrapDialThrottleMs)?Math.max(
0,e.bootstrapDialThrottleMs):Jl,m=typeof e.pubsubType=="string"?e.pubsubType:typeof e.pubsub=="string"?e.pubsub:"",E=String(
m||"floodsub").trim().toLowerCase()==="gossipsub"?"gossipsub":"floodsub",w=e.gossipsub&&typeof e.gossipsub=="object"?{...e.
gossipsub}:null,b=e.pubsubPeerDiscovery??e.enablePubsubPeerDiscovery??void 0,v=e.topologyType||e.topology||"distributed",
g=e.topologyId||e.topologyKey||e.topologyName||e.gameId||"default-topology",x=e.topicPrefix||e.topicBase||b7,_=e.useScopedTopics!==
!1,S=Ks(x,g,r,"state"),C=Ks(x,g,r,"direct"),T=Ks(x,g,r,"presence"),M=e.discoveryTopic||"peercompute._peer-discovery._p2p\
._pubsub",R=Em(e.additionalPubsubTopics);e.enableNetworkTelemetry!==!1&&!R.includes(es)&&R.push(es);const K=D7(w,[e.pubsubTopic||
(_?S:dm),e.directTopic||(_?C:fm),e.presenceTopic||(_?T:pm),M,...R]),N={topology:v,topologyId:g,topicPrefix:x,useScopedTopics:_,
pubsubTopic:e.pubsubTopic||(_?S:dm),directTopic:e.directTopic||(_?C:fm),presenceTopic:e.presenceTopic||(_?T:pm),additionalPubsubTopics:R,
discoveryTopic:M,bootstrapPeers:Array.isArray(e.bootstrapPeers)?e.bootstrapPeers:[],gameId:e.gameId||"default-game",roomId:r,
enforceRoomIsolation:e.enforceRoomIsolation!==!1,allowDiscoveryDialWhenIsolated:e.allowDiscoveryDialWhenIsolated===!0,enforceTopologyScope:e.
enforceTopologyScope!==!1,enableTelemetry:e.enableTelemetry!==!1,enableNetworkTelemetry:e.enableNetworkTelemetry!==!1,networkTelemetryPublish:e.
networkTelemetryPublish!==!1,enableTopologyController:e.enableTopologyController!==!1,enableRelayDirectPeers:e.enableRelayDirectPeers!==
!1,topologyTickMs:Number.isFinite(e.topologyTickMs)?Math.max(250,e.topologyTickMs):1500,throughputTopology:e.throughputTopology&&
typeof e.throughputTopology=="object"?{...e.throughputTopology}:{},throughputSignal:e.throughputSignal==="bytes"?"bytes":
"work",targetConnections:Number.isFinite(e.targetConnections)?Math.max(1,e.targetConnections):s?1:Math.min(c,3),connectionRadius:Number.
isFinite(e.connectionRadius)?Math.max(0,e.connectionRadius):s?0:1,isolationMinConnections:Number.isFinite(e.isolationMinConnections)?
Math.max(1,e.isolationMinConnections):s?1:2,longRangeCount:Number.isFinite(e.longRangeCount)?Math.max(0,e.longRangeCount):
s?0:1,longRangeRefreshMs:Number.isFinite(e.longRangeRefreshMs)?Math.max(1e3,e.longRangeRefreshMs):15e3,enableSharding:e.
enableSharding===!0,shardSize:Number.isFinite(e.shardSize)?Math.max(1,e.shardSize):8,shardRadius:Number.isFinite(e.shardRadius)?
Math.max(0,e.shardRadius):1,webrtc:t,telemetrySampleMs:i,telemetryPingMs:o,presenceIntervalMs:a,maxConnections:c,transportConnectionHeadroom:l,
transportMaxConnections:u,maxIncomingPendingConnections:h,maxParallelDials:f,maxDialQueueLength:p,maxPeerAddrsToDial:A,dialTimeoutMs:y,
maxDialPeers:I,bootstrapDialThrottleMs:d,pubsubType:E,gossipsub:K,pubsubPeerDiscovery:b,enablePeerDirectory:e.enablePeerDirectory!==
!1,directoryTopic:e.directoryTopic||"peercompute-directory",directoryQueryTimeoutMs:Number.isFinite(e.directoryQueryTimeoutMs)?
Math.max(1e3,e.directoryQueryTimeoutMs):5e3,presenceCapabilitiesProvider:typeof e.presenceCapabilitiesProvider=="functio\
n"?e.presenceCapabilitiesProvider:null,onPublishError:typeof e.onPublishError=="function"?e.onPublishError:null,onPublishSuccess:typeof e.
onPublishSuccess=="function"?e.onPublishSuccess:null},F=N.bootstrapPeers.map(te=>typeof te=="string"?Gn(te):te),O=e.allowLocalDial??
F.some(k7),D=N7(e.transportManager),j=Object.fromEntries(Object.entries(e).filter(([,te])=>te!==void 0));this.config={...N,
...j,additionalPubsubTopics:Em(j.additionalPubsubTopics??N.additionalPubsubTopics),bootstrapPeers:F,allowLocalDial:O,webrtc:t,
transportManager:D},this.debugOutput=typeof this.config.debugOutput=="boolean"?this.config.debugOutput:m7(),this.config.
enableNetworkTelemetry!==!1&&!this.config.additionalPubsubTopics.includes(es)&&this.config.additionalPubsubTopics.push(es),
this.networkTelemetryService=new p7(this),this.bootstrapPeerIds=new Set(F.map(Am).filter(Boolean)),this.libp2p=null,this.
artifactTransport=null,this.artifactDiscovery=null,this.artifactStarting=null,this.artifactPendingStore=null,this.artifactStopping=
null,this.peerInferenceService=null,this.peerInferenceStarting=null,this.peerInferenceOwner=null,this.peerInferenceStopping=
null,this._applicationPrivateKey=null,this.peerId=null,this.isConnected=!1,this.connectionGeneration=0,this.schedulerReconnect=
null,this.joinedAt=null,this.presenceInterval=null,this.publishErrorAt=new Map,this.pubsubStreamErrorAt=new Map,this.lastBootstrapDialAt=
0,this.isolationReconnectTimer=null,this.lastWebrtcAnnounceWarnAt=0,this.relayBootstrapConnectedAt=null,this.relayKeeperUntil=
0,this.firstDirectUpgradeAt=null,this.relayTransport=null,this.relayReservationPeers=new Set,this.relayPruneTimers=new Map,
this.peerDialAddrCache=new Map,this.peerDialBackoff=new Map,this.peers=new Map,this.recentDialAttempts=new Map,this.relayReconnectState=
{lastReconnectAt:0,pendingDialsNeedingRelay:new Set,autoDisconnectTimer:null},this.relayAssistState={lastRequestAt:new Map,
pendingReadyTimeouts:new Map,inboundRequestAt:new Map},this.pendingDirectoryQueries=new Map,this.telemetry={rxCount:0,txCount:0,
rxBytes:0,txBytes:0,rxBps:0,txBps:0,pubsubRxCount:0,pubsubTxCount:0,pubsubRxBytes:0,pubsubTxBytes:0,pubsubLastRxAt:0,pubsubLastTxAt:0},
this.telemetrySample={rxBytes:0,txBytes:0,at:0},this.telemetryTimer=null,this.onMessage=e.onMessage||(()=>{}),this.onPeerConnect=
e.onPeerConnect||(()=>{}),this.onPeerDisconnect=e.onPeerDisconnect||(()=>{}),this.onConnectionFailure=typeof e.onConnectionFailure==
"function"?e.onConnectionFailure:null,this.messageHandlers=[],this.additionalPubsubTopics=new Set(this.config.additionalPubsubTopics||
[]),this.scheduler=null,this.schedulerTimer=null,this.schedulerEnabled=e.enableScheduler||!1,this.schedulerClock=e.schedulerClock||
"internal",this.schedulerProfile={...Kn,...e.schedulerProfile||{}},this.authorityId=e.authorityId||null,this.lastRxAt=0,
this.lastTxAt=0,this.allowedTopics=new Set([this.config.pubsubTopic,this.config.directTopic,this.config.presenceTopic]),
this.additionalPubsubTopics.forEach(te=>this.allowedTopics.add(te)),this.config.enablePeerDirectory&&this.allowedTopics.
add(this.config.directoryTopic),[this.schedulerProfile.snapshotTopic,this.schedulerProfile.commandTopic,this.schedulerProfile.
eventTopic].filter(Boolean).forEach(te=>this.allowedTopics.add(te));const ie=e.topologyMetric!==void 0||e.metric!==void 0,
G=e.topologyMetric||e.metric||null;this.topologyMetric=G&&typeof G=="object"?{x:G.x||0,y:G.y||0,z:G.z||0}:{x:0,y:0,z:0},
this.metricInitialized=e.topologyMetricInitialized??e.metricInitialized??ie,this.topologyShardId=null,this.shardTopics=new Set,
this.pendingTopologyRequests=new Map,this.pendingTopologyAccepts=new Map,this.pendingPeerDials=new Map,this.publishBlockedUntil=
new Map,this.peerWork=new Map,this.topologyLinkReleasers=new Set,this.throughputPendingLinks=new Map,this.staticTopologyPeers=
null,this.throughputTopologyState=o7(),this.topologyController=this.config.enableTopologyController?new s7({topologyId:this.
config.topologyId,topologyType:this.config.topology,targetConnections:this.config.targetConnections,maxConnections:this.
config.maxConnections,connectionRadius:this.config.connectionRadius,isolationMinConnections:this.config.isolationMinConnections,
longRangeCount:this.config.longRangeCount,longRangeRefreshMs:this.config.longRangeRefreshMs,shardSize:this.config.shardSize,
shardRadius:this.config.shardRadius,enforceTopologyScope:this.config.enforceTopologyScope,metric:this.topologyMetric}):null,
this.topologyTimer=null}addMessageHandler(e){this.messageHandlers.push(e)}_infoLog(...e){this.debugOutput&&console.info(
...e)}configureScheduler(e={}){this.schedulerProfile={...this.schedulerProfile,...e},[this.schedulerProfile.snapshotTopic,
this.schedulerProfile.commandTopic,this.schedulerProfile.eventTopic].filter(Boolean).forEach(t=>this.allowedTopics.add(t)),
this.schedulerEnabled=!0,this._ensureScheduler(),this.scheduler.configure(this.schedulerProfile),this._startScheduler()}setSchedulerClock(e="\
internal"){const t=e==="external"?"external":"internal";if(this.schedulerClock!==t){if(this.schedulerClock=t,t==="extern\
al"){this._stopScheduler();return}this.schedulerEnabled&&this.isConnected&&this._startScheduler()}}getSchedulerClock(){return this.
schedulerClock}tickScheduler(e=Date.now()){!this.scheduler||!this.schedulerEnabled||this.scheduler.tick(e)}getSchedulerProfile(){
return this.scheduler?this.scheduler.getProfile():{...this.schedulerProfile}}registerStateProvider(e,t={}){return this._ensureScheduler(),
this.schedulerEnabled=!0,this._startScheduler(),this.scheduler.registerStateProvider(e,t)}registerWarmDeltaProvider(e,t={}){
const r=t.id||"warm-deltas";return this.registerStateProvider(()=>e(),{...t,id:r})}registerCommandProvider(e,t={}){return this.
_ensureScheduler(),this.schedulerEnabled=!0,this._startScheduler(),this.scheduler.registerCommandProvider(e,t)}unregisterStateProvider(e){
this.scheduler?.unregisterStateProvider(e)}unregisterCommandProvider(e){this.scheduler?.unregisterCommandProvider(e)}markStateDirty(){
this.scheduler?.markStateDirty()}queueEvent(e,t={}){this._ensureScheduler(),this.schedulerEnabled=!0,this._startScheduler();
const r=Object.prototype.hasOwnProperty.call(t,"reliable")||Object.prototype.hasOwnProperty.call(t,"critical");let s=t;if(!r&&
e?.type){const i=this.scheduler?.getProfile?.()||this.schedulerProfile;Array.isArray(i.reliableEventTypes)&&i.reliableEventTypes.
includes(e.type)&&(s={...t,reliable:!0})}this.scheduler.queueEvent(e,s)}addSnapshotHandler(e){this._ensureScheduler(),this.
scheduler.addSnapshotHandler(e)}addCommandHandler(e){this._ensureScheduler(),this.scheduler.addCommandHandler(e)}addEventHandler(e){
this._ensureScheduler(),this.scheduler.addEventHandler(e)}setAuthority(e){this.authorityId=e||null,this.scheduler&&this.
scheduler.setAuthority(this.authorityId)}getAuthority(){return this.authorityId}getHealth(){const e=this.scheduler?.getReliabilityStats?.();
return{lastRxAt:this.lastRxAt,lastTxAt:this.lastTxAt,peerCount:this.getConnectedPeers().length,pubsubPeers:this.libp2p?.
services?.pubsub?.getPeers?.()||[],reliability:e}}async initialize(){const e=typeof window<"u";let t;if(e){const f=(this.
config.bootstrapPeers||[]).filter(p=>typeof p=="string"&&p.includes("/p2p/")).map(p=>`${Gn(p)}/p2p-circuit`);t=f.length>
0?[...f,"/webrtc"]:["/p2p-circuit","/webrtc"]}else t=["/ip4/0.0.0.0/tcp/0"];const r=this.config.pubsubType==="gossipsub",
s=[];this.config.bootstrapPeers?.length&&s.push(jz({list:this.config.bootstrapPeers})),this.config.pubsubPeerDiscovery!==
!1&&s.push(Qz({interval:1e3,topics:[this.config.discoveryTopic]}));const i=this.config.webrtc?.rtcConfiguration||{},o=Object.
keys(i).length>0?og({rtcConfiguration:i}):og(),a=aF();this.relayTransport=a;const c=await Tv(this.config);this._applicationPrivateKey=
c;const l={minConnections:0,maxConnections:this._getTransportMaxConnections(this.config.maxConnections??4),inboundConnectionThreshold:1/0,
maxIncomingPendingConnections:this.config.maxIncomingPendingConnections??100};Number.isFinite(this.config.maxParallelDials)&&
(l.maxParallelDials=Math.max(1,this.config.maxParallelDials)),Number.isFinite(this.config.maxDialQueueLength)&&(l.maxDialQueueLength=
Math.max(1,this.config.maxDialQueueLength)),Number.isFinite(this.config.maxPeerAddrsToDial)&&(l.maxPeerAddrsToDial=Math.
max(1,this.config.maxPeerAddrsToDial));const u=Number.isFinite(this.config.dialTimeoutMs)?Math.max(1e3,this.config.dialTimeoutMs):
Number.isFinite(this.config.dialTimeout)?Math.max(1e3,this.config.dialTimeout):null,h=this.config.transportManager&&typeof this.
config.transportManager=="object"?{...this.config.transportManager}:null;u&&(l.dialTimeout=u);try{this.libp2p=await e6({
...c?{privateKey:c}:{},transports:[CL(),o,a],connectionEncrypters:[_F(),IF()],streamMuxers:[WF()],peerDiscovery:s,services:{
identify:wz(),ping:Vz({interval:1e4}),pubsub:this._buildPubsubService()},connectionManager:l,connectionMonitor:{abortConnectionOnPingFailure:!1},
...h?{transportManager:h}:{},addresses:{listen:t},start:!1,...this.config.allowLocalDial?{connectionGater:{denyDialMultiaddr:()=>!1}}:
{}})}catch(f){throw this._emitConnectionFailure({source:"libp2p",stage:"init",error:f}),H("[NetworkManager] Libp2p init \
failed",f?.message||f),f}return r&&c&&this.libp2p?.peerId&&(this.libp2p.peerId.privateKey=Km(c),this.libp2p.peerId.publicKey=
Ir(c.publicKey)),this._wireLibp2pEvents(),this._patchGossipsubOutboundStreams(),this._refreshRelayTransport(),this.libp2p}async connect(){
if(this.isConnected)return;if(this.peerConnectionRecovery?.closed&&(this.peerConnectionRecovery=null),!this.libp2p)throw new Error(
"NetworkManager not initialized");this.connectionGeneration++;try{await this.libp2p.start()}catch(t){throw this._emitConnectionFailure(
{source:"libp2p",stage:"start",error:t}),H("[NetworkManager] Libp2p start failed",t?.message||t),t}this._refreshRelayTransport(),
this.peerId=this.libp2p.peerId.toString(),this.joinedAt||(this.joinedAt=Date.now()),this.topologyController&&this.topologyController.
setPeerId(this.peerId),this._updateShardState(!0);const e=t=>{try{this.libp2p.services.pubsub.subscribe(t)}catch(r){this.
_emitConnectionFailure({source:"pubsub",stage:"subscribe",address:t,error:r}),H("[NetworkManager] Pubsub subscribe faile\
d",t,r?.message||r)}};e(this.config.pubsubTopic),e(this.config.directTopic),e(this.config.presenceTopic),this.additionalPubsubTopics.
forEach(t=>e(t)),this._syncShardSubscriptions(this.topologyController?.getNeighborShardIds?.()||[]),this._recordPubsubTx(
0),await this._dialBootstrapPeers(),await this._reserveBootstrapRelayAddrs(),await this._logLocalAnnounceAddrs("post-boo\
tstrap"),setTimeout(()=>{this._logLocalAnnounceAddrs("post-bootstrap+2s").catch(()=>{})},2e3),this._startPresence(),this.
_logPubsubStatus("connected"),this.isConnected=!0,this._sampleTelemetry(Date.now()),this._startTelemetrySampler(),this.schedulerEnabled&&
(this._ensureScheduler(),this._startScheduler()),this._startTopologyController(),this.networkTelemetryService.start()}_refreshRelayTransport(){
const e=this.libp2p?.components?.transportManager;if(!e?.getTransports)return;const t=e.getTransports(),i=(Array.isArray(
t)?t:t?.values?Array.from(t.values()):[]).map(o=>o?.transport||o).filter(Boolean).find(o=>!!(o?.reservationStore||o?.[Symbol.
toStringTag]==="@libp2p/circuit-relay-v2-transport"));i&&(this.relayTransport=i)}async redialBootstrapPeers(){const e=this.
libp2p,t=this.connectionGeneration;if(!e)return;const r=()=>e===this.libp2p&&t===this.connectionGeneration;await this._dialBootstrapPeers(),
r()&&(await this._reserveBootstrapRelayAddrs(),r()&&await this._logLocalAnnounceAddrs("redial-bootstrap"))}_getPeerConnectionRecovery(){
return this.peerConnectionRecovery??=new l7(this)}recoverPeerInferenceConnection(e,t){return this._getPeerConnectionRecovery().
recover(e,t)}retainPeerInferenceConnection(e,t){return this._getPeerConnectionRecovery().retain(e,t)}async disconnect(){
this.connectionGeneration++,this.schedulerReconnect=null,this.isConnected=!1,this._stopScheduler(),this._clearPresenceTimer(),
await this.networkTelemetryService.stop(),await this._stopPeerInferenceService(),await this.peerConnectionRecovery?.stop(),
await this._stopArtifactTransport(),this.isolationReconnectTimer&&(clearTimeout(this.isolationReconnectTimer),this.isolationReconnectTimer=
null),this._stopTelemetrySampler(),this._stopTopologyController(),this.relayReconnectState?.autoDisconnectTimer&&(clearTimeout(
this.relayReconnectState.autoDisconnectTimer),this.relayReconnectState.autoDisconnectTimer=null),this.relayPruneTimers?.
size&&(this.relayPruneTimers.forEach(e=>clearTimeout(e)),this.relayPruneTimers.clear()),this.libp2p&&await this.libp2p.stop(),
this.peers.clear(),this.pendingTopologyRequests.clear(),this.pendingTopologyAccepts.clear(),this.pendingPeerDials.clear(),
this._clearRelayAssistState(),this.relayReservationPeers.clear(),this.firstDirectUpgradeAt=null,this.peerId=null}async createArtifactTransport(e,t={}){
if(this.artifactStopping&&await this.artifactStopping,this.artifactTransport){if(this.artifactTransport.store!==e)throw new Error(
"Artifact transport already owns a different store");if(this.artifactTransport.requiresCleanup)throw new Error("Artifact\
 transport cleanup must succeed before restarting");return this.artifactTransport}if(this.artifactStarting){if(this.artifactPendingStore!==
e)throw new Error("Artifact transport is starting with a different store");return this.artifactStarting}if(!this.libp2p||
!this._applicationPrivateKey)throw new Error("Initialize NetworkManager before enabling artifacts");this.artifactPendingStore=
e,this.artifactStarting=(async()=>{const[{IpfsArtifactTransport:r},{ArtifactProviderDiscovery:s}]=await Promise.all([qc(
()=>import("./IpfsArtifactTransport-ttF_qhmr.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),qc(()=>import("./ArtifactProviderRecord-BJQUSXox.js"),
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
t,this.peerInferenceStarting=(async()=>{const{PeerInferenceService:r}=await qc(async()=>{const{PeerInferenceService:i}=await import("./PeerInferenceService-CSdF3y6U.js");
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
artifactStopping=null}}async sendToPeer(e,t){const r=this._wrapPayload(t,{target:e});await this._publish(this.config.directTopic,
r)}async broadcast(e,t={}){const r=t.topic||this.config.pubsubTopic,s=this._wrapPayload(e);await this._publish(r,s)}setTopologyMetric(e){
if(!e||typeof e!="object")return;const t={x:Number.isFinite(e.x)?e.x:0,y:Number.isFinite(e.y)?e.y:0,z:Number.isFinite(e.
z)?e.z:0};this.topologyMetric=t,this.metricInitialized=!0,this.topologyController&&this.topologyController.setLocalMetric(
t),this._updateShardState(!0),this._publishPresenceNow().catch(()=>{})}setConnectionLimits({targetConnections:e,maxConnections:t}={}){
const r=Number.isFinite(e)?Math.max(1,e):this.config.targetConnections,s=Number.isFinite(t)?Math.max(1,t):this.config.maxConnections,
i=r!==this.config.targetConnections||s!==this.config.maxConnections;this.config.targetConnections=r,this.config.maxConnections=
s;const o=this._getTransportMaxConnections(s),a=this.libp2p?.services?.connectionManager||this.libp2p?.connectionManager;
if(a)try{typeof a.setMaxConnections=="function"?a.setMaxConnections(o):typeof a.maxConnections=="number"&&(a.maxConnections=
o)}catch(c){H("[NetworkManager] Failed to update connection manager limits",c?.message||c)}this.topologyController?.setConnectionLimits&&
this.topologyController.setConnectionLimits({targetConnections:r,maxConnections:s}),i&&this._publishPresenceNow().catch(
()=>{})}setPriorityPeers(e=[]){this.topologyController?.setPriorityPeers&&this.topologyController.setPriorityPeers(e)}setRelayBootstrapBehavior({
keepRelay:e}={}){if(typeof e!="boolean")return;(!this.config.webrtc||typeof this.config.webrtc!="object")&&(this.config.
webrtc={});const t=!e;this.config.webrtc.dropRelayBootstrapOnDirect=t,this._maybeUpdateBootstrapRelayConnections()}getTopologyStatus(){
return{topologyId:this.config.topologyId,topologyType:this.config.topology,shardId:this.topologyShardId,metric:{...this.
topologyMetric},targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections,transportMaxConnections:this.
_getTransportMaxConnections(this.config.maxConnections)}}getConnectedPeers(){const e=this._getConnectionPeers(),t=this._getScopedPeers(),
r=new Map;return e.forEach(s=>r.set(s.peerId,s)),t.forEach(s=>{const i=r.get(s.peerId)||{};r.set(s.peerId,{...i,...s})}),
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
getConnectedPeers().map(i=>({peerId:i.peerId,connectedAt:i.connectedAt||null,joinedAt:i.joinedAt||null,lastSeen:i.lastSeen||
null,lastMessageTime:i.lastMessageTime||null,lastRxAt:i.lastRxAt||null,lastTxAt:i.lastTxAt||null,lastRttAt:i.lastRttAt||
null,rttMs:Number.isFinite(i.rttMs)?i.rttMs:null,...this.config.topology==="throughput"?{workRate:this.peerWork.get(i.peerId)?.
rate||0}:{},via:i.via||null,signalingPath:Hr(i.signalingPath)||null,mediaPath:Xr(i.mediaPath)||null,topologyId:i.topologyId||
null,shardId:i.shardId||null,metric:i.metric||null,metricInitialized:i.metricInitialized??null,targetConnections:i.targetConnections||
null,maxConnections:i.maxConnections||null,activeConnections:i.activeConnections||null,rxCount:i.rxCount||0,txCount:i.txCount||
0,rxBytes:i.rxBytes||0,txBytes:i.txBytes||0,rxBps:i.rxBps||0,txBps:i.txBps||0}));return{ts:e,peerId:this.peerId,gameId:this.
config.gameId,roomId:this.config.roomId,topology:this.config.topology,topologyId:this.config.topologyId,shardId:this.topologyShardId,
metric:{...this.topologyMetric},metricInitialized:this.metricInitialized,isConnected:this.isConnected,peerCount:t.peerCount,
connections:t.connections,lastRxAt:r.lastRxAt,lastTxAt:r.lastTxAt,counts:{rx:this.telemetry.rxCount,tx:this.telemetry.txCount,
rxBytes:this.telemetry.rxBytes,txBytes:this.telemetry.txBytes},rates:{rxBps:this.telemetry.rxBps,txBps:this.telemetry.txBps},
pubsub:{rxCount:this.telemetry.pubsubRxCount,txCount:this.telemetry.pubsubTxCount,rxBytes:this.telemetry.pubsubRxBytes,txBytes:this.
telemetry.pubsubTxBytes,lastRxAt:this.telemetry.pubsubLastRxAt||null,lastTxAt:this.telemetry.pubsubLastTxAt||null},reliability:r.
reliability,pubsubPeerCount:Array.isArray(r.pubsubPeers)?r.pubsubPeers.length:0,joinedAt:this.joinedAt,peers:s}}getLibp2pNode(){
return this.libp2p}_dropPubsubPeer(e){if(!e)return;const t=this.libp2p?.services?.pubsub;if(!t||typeof t.removePeer!="fu\
nction")return;let r;try{r=Z(e)}catch{return}try{t.removePeer(r)}catch(s){H("[NetworkManager] Failed to remove pubsub pe\
er",e,s?.message||s)}}_handlePubsubStreamError(e,t){if(!e||!t)return;const r=t?.message||"";if(t?.name!=="StreamStateErr\
or"&&!String(r).includes("stream"))return;const s=Date.now(),i=this.pubsubStreamErrorAt.get(e)||0;s-i>5e3&&(this.pubsubStreamErrorAt.
set(e,s),H("[NetworkManager] Pubsub stream error",e,r)),this._dropPubsubPeer(e)}_emitConnectionFailure(e={}){if(typeof this.
onConnectionFailure!="function")return;const t={peerId:e.peerId??null,address:e.address??null,source:e.source??null,stage:e.
stage??null,error:e.error??null,at:e.at??Date.now()};try{this.onConnectionFailure(t)}catch(r){H("[NetworkManager] onConn\
ectionFailure failed",r?.message||r)}}_patchGossipsubOutboundStream(e,t){if(!e||!t)return;const r=t.rawStream||t.stream||
t._rawStream;if(!r||typeof r.send!="function"||r.__pcSendPatched)return;const s=r.send.bind(r);r.send=i=>{try{const o=s(
i);return o&&typeof o.catch=="function"&&o.catch(a=>this._handlePubsubStreamError(e,a)),o}catch(o){this._handlePubsubStreamError(
e,o);return}},r.__pcSendPatched=!0}_patchGossipsubOutboundStreams(){if(this.config.pubsubType!=="gossipsub")return;const t=this.
libp2p?.services?.pubsub?.streamsOutbound;if(!(!t||typeof t.forEach!="function")&&(t.forEach((r,s)=>{this._patchGossipsubOutboundStream(
s,r)}),!t.__pcWrapped)){const r=t.set.bind(t);t.set=(s,i)=>{const o=r(s,i);return this._patchGossipsubOutboundStream(s,i),
o},t.__pcWrapped=!0}}_wireLibp2pEvents(){this.libp2p&&(this.libp2p.addEventListener("error",e=>{const t=e?.detail?.error||
e?.detail||e?.error||e;t&&(this._emitConnectionFailure({source:"libp2p",stage:"runtime",error:t}),H("[NetworkManager] Li\
bp2p runtime error",t?.message||t))}),this.libp2p.addEventListener("connection:open",e=>{const t=e.detail;this._getPeerConnectionRecovery().
observe(t,{openedNow:!0});const r=t?.remotePeer?.toString?.();if(!r)return;const s=Date.now(),i=_t(t?.remoteAddr),o=ym(i);
this._rememberDialTargets(r,[i]),this._clearDialFailureBackoff(r);const a=this.peers.get(r)?.via||null;a&&["relay","rela\
y-webrtc","direct","webrtc"].includes(a)&&a!==o?this._infoLog("[NetworkManager] Connection upgraded",r,`${a} -> ${o}`,i):
this._infoLog("[NetworkManager] Connection open",r,o,i),this.bootstrapPeerIds.has(r)&&!Number.isFinite(this.relayBootstrapConnectedAt)&&
(this.relayBootstrapConnectedAt=s);const c=this._getPreferredConnectionMeta(r);if(c){const l={...c};if(this._isDirectCapableConnection(
t)&&!this.bootstrapPeerIds.has(r)){const u=Number(this.peers.get(r)?.directCandidateSince);l.directCandidateSince=Number.
isFinite(u)?u:s,Number.isFinite(this.firstDirectUpgradeAt)||(this.firstDirectUpgradeAt=s)}this._touchPeer(r,l)}this._maybePruneRelayConnections(
r),this._maybeUpdateBootstrapRelayConnections()}),this.libp2p.addEventListener("connection:close",e=>{const t=e.detail,r=t?.
remotePeer?.toString?.();if(!r)return;const s=_t(t?.remoteAddr),i=ym(s),o=this._getPreferredConnectionMeta(r);o?this._touchPeer(
r,{...o,...this._hasDirectCapableConnectionForPeer(r)?{}:{directCandidateSince:null}}):this._hasDirectCapableConnectionForPeer(
r)||this._touchPeer(r,{directCandidateSince:null});const a=t?.stat?.timeline?.close?.error||t?.stat?.timeline?.close?.cause||
t?.timeline?.close?.error||t?.timeline?.close?.cause||t?.error||e?.detail?.error;a&&this._emitConnectionFailure({peerId:r,
address:t?.remoteAddr?.toString?.(),source:"connection",stage:"close",error:a});const c=this._getConnectionsForPeer(r).filter(
Ae).length;this._infoLog("[NetworkManager] Connection closed",r,i,s,"reason:",C7(a),"remaining:",c);const l=this._getConnectionsForPeer(
r).filter(u=>u?.status==="open");this.bootstrapPeerIds.has(r)&&l.length===0&&!this._hasBootstrapRelayConnections()&&(this.
relayBootstrapConnectedAt=null),l.length===0&&this._dropPubsubPeer(r),!this.bootstrapPeerIds.has(r)&&Yr(s)&&(this._getConnectionsForPeer(
r).some(h=>Ae(h)&&Yr(h?.remoteAddr))||(this.recentDialAttempts.delete(r),this._clearDialFailureBackoff(r),this._infoLog(
"[NetworkManager] Direct connection lost, scheduling recovery redial",r),this._maybeDialPeer(r,"direct-drop-recovery").catch(
()=>{}))),this._scheduleIsolationRelayRedial(),this._maybeUpdateBootstrapRelayConnections()}),this.libp2p.addEventListener(
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
this.networkTelemetryService.handlePubsubMessage(e.detail))return;let s=null;try{s=JSON.parse(E7.decode(r))}catch(h){H("\
[NetworkManager] Failed to parse pubsub payload",h);return}const i=Date.now(),o=Zl(r);this.lastRxAt=i,this.scheduler?.recordRx(
i),this._recordPubsubRx(o);const a=s?.header?.peerId||s?.from||null;if(a&&a!==this.peerId&&this._recordRx(a,o),this.scheduler?.
handleMessage(s,a))return;if(t===this.config.presenceTopic){this._handlePresence(s);return}if(t===this.config.directoryTopic){
this._handleDirectoryMessage(s);return}if(t===this.config.directTopic&&s?.target&&s.target!==this.peerId||!this.additionalPubsubTopics.
has(t)&&!this._matchesScope(s))return;const l=s?.payload??s;if(this._handleRelayAssistMessage(l,s)||this._handleTopologyMessage(
l,s))return;const u=s?.from;u&&u!==this.peerId&&this._touchPeer(u,{lastMessageTime:Date.now()}),this._dispatchMessage(u||
"unknown",l)}))}_buildPubsubService(){if(this.config.pubsubType==="gossipsub"){const e=this.config.gossipsub||{},t={emitSelf:!1,
allowPublishToZeroTopicPeers:!0,...e};if(e.allowPublishToZeroPeers!==void 0&&t.allowPublishToZeroTopicPeers===void 0&&(t.
allowPublishToZeroTopicPeers=e.allowPublishToZeroPeers),this.config.enableRelayDirectPeers!==!1&&!this.config.webrtc?.dropRelayBootstrapOnDirect&&
this.bootstrapPeerIds.size>0){const s=t.directPeers||[];for(const i of this.bootstrapPeerIds)try{const o=Z(i),a=this.config.
bootstrapPeers.map(c=>{try{return typeof c=="string"?k(c):c}catch{return null}}).filter(Boolean);a.length>0&&(s.push({id:o,
addrs:a}),Be("[NetworkManager] Added relay as gossipsub directPeer:",o.toString()))}catch(o){H("[NetworkManager] Failed \
to add relay as directPeer:",i,o?.message||o)}s.length>0&&(t.directPeers=s)}else this.bootstrapPeerIds.size>0&&Be("[Netw\
orkManager] Relay excluded from gossipsub directPeers (dropRelayBootstrapOnDirect enabled)");return _U(t)}return o5()}_dispatchMessage(e,t){
this.messageHandlers.forEach(r=>{try{r(e,t)}catch(s){console.error("[NetworkManager] Message handler failed",s)}}),this.
onMessage(e,t)}_wrapPayload(e,t={}){return{type:"peercompute-message",from:this.peerId,gameId:this.config.gameId,roomId:this.
config.roomId,topologyId:this.config.topologyId,topologyType:this.config.topology,shardId:this.topologyShardId,payload:e,
...t}}_matchesScope(e){if(!e)return!0;if(e.gameId&&e.gameId!==this.config.gameId||e.roomId&&e.roomId!==this.config.roomId)
return!1;if(this.config.enforceTopologyScope){const t=e.topologyId||e.header?.topologyId||null;if(!t||t!==this.config.topologyId)
return!1}return!0}_handlePresence(e){if(!e||!this._matchesScope(e)||!e.from||e.from===this.peerId)return;const t=!this.peers.
has(e.from),r=Number(e.joinedAt);let i=(this.peers.get(e.from)||{}).joinedAt??null;Number.isFinite(r)&&(i=Number.isFinite(
i)?Math.min(i,r):r),this._touchPeer(e.from,{gameId:e.gameId,roomId:e.roomId,topologyId:e.topologyId,topologyType:e.topologyType,
shardId:e.shardId,metric:e.metric||null,metricInitialized:e.metricInitialized??null,targetConnections:e.targetConnections,
maxConnections:e.maxConnections,activeConnections:e.activeConnections,relayConnected:e.relayConnected??null,capabilities:mm(
e.capabilities),lastSeen:Date.now(),joinedAt:i,via:"presence"}),t&&this.onPeerConnect(e.from),Array.isArray(e.multiaddrs)&&
e.multiaddrs.length>0&&this._rememberPeerAddresses(e.from,e.multiaddrs),this._shouldDialDiscoveredPeer(e.from)&&(this._maybeDialPeer(
e.from,"presence",e.multiaddrs).catch(()=>{}),this._maybeUpdateBootstrapRelayConnections())}_getScopedPeers(){return Array.
from(this.peers.entries()).filter(([,e])=>e?.gameId===this.config.gameId&&e?.roomId===this.config.roomId).filter(([,e])=>this.
config.enforceTopologyScope?e?.topologyId?e.topologyId===this.config.topologyId:!1:!0).map(([e,t])=>({peerId:e,...t}))}_getConnections(){
if(!this.libp2p?.getConnections)return[];const e=this.libp2p.getConnections();return Array.isArray(e)?e:typeof e?.values==
"function"?Array.from(e.values()).reduce((t,r)=>t.concat(r),[]):[]}_getConnectionPeers(){const e=new Map,t=this._getConnections();
for(const r of t){if(!Ae(r))continue;const s=r?.remotePeer?.toString?.();if(!s)continue;const i=this.peers.get(s)||{},o=vm(
i.via);e.set(s,{peerId:s,...i,via:i.via||"connection",signalingPath:Hr(i.signalingPath)||Hr(o.signalingPath),mediaPath:Xr(
i.mediaPath)||Xr(o.mediaPath)})}return Array.from(e.values())}_getActiveConnectionCount(){const e=this._getConnections();
let t=0;for(const r of e)Ae(r)&&(t+=1);return t}_getActiveDialedPeerIds(){const e=new Set,t=this._getConnections();for(const r of t){
if(!Ae(r))continue;const s=r?.remotePeer?.toString?.();!s||this.bootstrapPeerIds.has(s)||e.add(s)}return e}_countDialedPeers(){
return this._getActiveDialedPeerIds().size}_isDirectCapableConnection(e){return e?bm(e?.remoteAddr)?!0:this.config.webrtc?.
countRelayWebrtcAsDirectCapable!==!1&&pa(e?.remoteAddr):!1}_getDirectStableSince(e,t){const r=this.peers.get(e),s=Number(
r?.directCandidateSince);if(Number.isFinite(s))return s;const i=_7(t);return Number.isFinite(i)?i:null}_hasDirectCapableConnectionForPeer(e){
return this._getConnectionsForPeer(e).some(r=>Ae(r)&&this._isDirectCapableConnection(r))}_hasDirectPeerConnections(){const e=Number.
isFinite(this.config.webrtc?.relayDropMinDirectMs)?Math.max(0,this.config.webrtc.relayDropMinDirectMs):0,t=Date.now();return this.
_getConnections().some(s=>{if(!Ae(s))return!1;const i=s?.remotePeer?.toString?.();if(!i||this.bootstrapPeerIds.has(i)||!this.
_isDirectCapableConnection(s))return!1;if(e<=0)return!0;const o=this._getDirectStableSince(i,s);return Number.isFinite(o)?
t-o>=e:!0})}_getActiveDialedPeerCount(){return this._getActiveDialedPeerIds().size}_getDirectCapableDialedPeerIds(){const e=new Set,
t=this._getConnections();for(const r of t){if(!Ae(r))continue;const s=r?.remotePeer?.toString?.();!s||this.bootstrapPeerIds.
has(s)||this._isDirectCapableConnection(r)&&e.add(s)}return e}_getDirectCapableDialedPeerCount(){return this._getDirectCapableDialedPeerIds().
size}_getLogicalReservationExpiry(e){if(!e||typeof e!="object")return null;if(Number.isFinite(e.expiresAt))return e.expiresAt;
const t=Number.isFinite(e.reservedAt)?e.reservedAt:Number.isFinite(e.sentAt)?e.sentAt:null;return Number.isFinite(t)?t+Ho:
null}_clearPendingLogicalReservations(e){e&&(this.pendingTopologyRequests.delete(e),this.pendingTopologyAccepts.delete(e),
this.pendingPeerDials.delete(e))}_prunePendingLogicalReservations(e=Date.now()){const t=this._getActiveDialedPeerIds(),r=s=>{
if(s instanceof Map)for(const[i,o]of Array.from(s.entries())){if(!i||this.bootstrapPeerIds.has(i)||t.has(i)){s.delete(i);
continue}const a=this._getLogicalReservationExpiry(o);Number.isFinite(a)&&a<=e&&s.delete(i)}};r(this.pendingTopologyRequests),
r(this.pendingTopologyAccepts),r(this.pendingPeerDials)}_getReservedDialedPeerIds(e=Date.now()){this._prunePendingLogicalReservations(
e);const t=new Set,r=s=>{if(s instanceof Map)for(const i of s.keys())!i||this.bootstrapPeerIds.has(i)||t.add(i)};return r(
this.pendingTopologyRequests),r(this.pendingTopologyAccepts),r(this.pendingPeerDials),t}_getLogicalDialedPeerIds(e=Date.
now()){const t=this._getReservedDialedPeerIds(e);return this._getActiveDialedPeerIds().forEach(s=>t.add(s)),t}_getLogicalDialedPeerCount(e=Date.
now()){return this._getLogicalDialedPeerIds(e).size}_hasLogicalPeerReservation(e,t=Date.now()){return e?this._getLogicalDialedPeerIds(
t).has(e):!1}_hasAvailableLogicalPeerSlot(e=null,t=Date.now()){const r=Number.isFinite(this.config.maxConnections)?Math.
max(1,this.config.maxConnections):0;if(r<=0)return!0;const s=this._getLogicalDialedPeerIds(t);return e&&s.has(e)?!0:s.size<
r}_getTransportMaxConnections(e=this.config.maxConnections){if(Number.isFinite(this.config.transportMaxConnections))return Math.
max(1,Math.trunc(this.config.transportMaxConnections));const t=Number.isFinite(e)?Math.max(1,Math.trunc(e)):1,r=this.bootstrapPeerIds.
size>0?1:0,s=Number.isFinite(this.config.transportConnectionHeadroom)?Math.max(0,Math.trunc(this.config.transportConnectionHeadroom)):
0,i=t;return t+r+s+i}_getDirectGossipsubMeshPeerCount(){const e=this.libp2p?.services?.pubsub;if(!e||typeof e.getMeshPeers!=
"function"){const i=typeof e?.getPeers=="function"?e.getPeers():[];let o=0;for(const a of i){const c=a?.toString?.();!c||
this.bootstrapPeerIds.has(c)||this._hasDirectCapableConnectionForPeer(c)&&(o+=1)}return o}const t=this.config.pubsubTopic,
r=e.getMeshPeers(t);if(!Array.isArray(r)||r.length===0)return 0;let s=0;for(const i of r){const o=i?.toString?.();!o||this.
bootstrapPeerIds.has(o)||this._hasDirectCapableConnectionForPeer(o)&&(s+=1)}return s}_getMinDirectMeshPeers(){return Number.
isFinite(this.config.webrtc?.minDirectMeshPeers)?Math.max(1,this.config.webrtc.minDirectMeshPeers):Math.min(this.config.
targetConnections||3,3)}_hasHealthyGossipsubMesh(){const e=this._getMinDirectMeshPeers();return this._getDirectGossipsubMeshPeerCount()>=
e?!0:this._getDirectCapableDialedPeerCount()>=e}getRelayRetentionDebug(){const e=Date.now(),t=this._getMinDirectMeshPeers(),
r=this._getDirectGossipsubMeshPeerCount(),s=this._getDirectCapableDialedPeerCount(),i=this._getRelayRetentionConfig(),o=this.
_getRetentionCandidates(),a=i?this._getRelayRetentionKeepCount(o.length,i):0,c=o.slice().sort((b,v)=>{const g=Number.isFinite(
b.joinedAt)?b.joinedAt:1/0,x=Number.isFinite(v.joinedAt)?v.joinedAt:1/0;return g!==x?g-x:String(b.peerId).localeCompare(
String(v.peerId))}),l=c.slice(0,a).map(b=>b.peerId),u=Number.isFinite(this.config.targetConnections)?this.config.targetConnections:
null,h=this._getScopedPeers().filter(b=>b?.peerId&&b.peerId!==this.peerId&&!this.bootstrapPeerIds.has(b.peerId)).length,
f=Math.max(this._getActiveDialedPeerCount(),this._countDialedPeers()),p=Math.max(h,f),A=Number.isFinite(u)?p>0?Math.min(
u,p):u:null,y=Number.isFinite(this.config.webrtc?.relayBootstrapMinHoldMs)?Math.max(0,this.config.webrtc.relayBootstrapMinHoldMs):
wh,I=Number.isFinite(this.relayBootstrapConnectedAt)?Math.max(0,e-this.relayBootstrapConnectedAt):null,d=Number.isFinite(
I)&&y>0?Math.max(0,y-I):0,m=Number.isFinite(this.config.webrtc?.relayPostDirectHoldMs)?Math.max(0,this.config.webrtc.relayPostDirectHoldMs):
vh,E=Number.isFinite(this.firstDirectUpgradeAt)?Math.max(0,e-this.firstDirectUpgradeAt):null,w=Number.isFinite(E)&&m>0?Math.
max(0,m-E):0;return{dropRelayBootstrapOnDirect:this.config.webrtc?.dropRelayBootstrapOnDirect,relayRetention:i,minDirectMeshPeers:t,
directMeshPeerCount:r,directCapablePeerCount:s,activeDialedPeerCount:this._getActiveDialedPeerCount(),desiredConnections:A,
candidateCount:o.length,keepCount:a,keepPeerIds:l,selfRank:c.findIndex(b=>b.peerId===this.peerId),relayBootstrapHoldRemainingMs:d,
postDirectHoldRemainingMs:w,hasBootstrapRelayConnections:this._hasBootstrapRelayConnections(),hasDirectPeerConnections:this.
_hasDirectPeerConnections(),healthyMesh:r>=t||s>=t,shouldKeepRelay:this._shouldKeepRelayBootstrapConnection()}}_hasBootstrapRelayConnections(){
if(!this.libp2p||this.bootstrapPeerIds.size===0)return!1;for(const e of this.bootstrapPeerIds)if(this._getConnectionsForPeer(
e).some(Ae))return!0;return!1}_closeBootstrapRelayConnections(){if(!(!this.libp2p||this.bootstrapPeerIds.size===0))for(const e of this.
bootstrapPeerIds)this._getConnectionsForPeer(e).forEach(r=>{this._retireIdleConnection(r,"bootstrap-retention")})}_maybeRedialBootstrapPeers(){
const e=Date.now(),t=this.config.bootstrapDialThrottleMs??Jl;t>0&&e-this.lastBootstrapDialAt<t||(this.lastBootstrapDialAt=
e,this._dialBootstrapPeers().catch(()=>{}))}_maybeUpdateBootstrapRelayConnections(){if(!this.libp2p)return;const e=Date.
now(),t=this._hasBootstrapRelayConnections();if(t?Number.isFinite(this.relayBootstrapConnectedAt)||(this.relayBootstrapConnectedAt=
e):this.relayBootstrapConnectedAt=null,this.config.bootstrapPeers?.length&&this._getActiveConnectionCount()===0&&!t){this.
_maybeRedialBootstrapPeers();return}if(!this.config.webrtc?.dropRelayBootstrapOnDirect){t||this._maybeRedialBootstrapPeers();
return}if(this._shouldKeepRelayBootstrapConnection()){t||this._maybeRedialBootstrapPeers();return}if(this._shouldElectRelayRedial(
e,{allowWithBootstrap:!0})){t||this._maybeRedialBootstrapPeers();return}t&&this._closeBootstrapRelayConnections()}_shouldReconnectRelayForDial(e){
if(this._hasBootstrapRelayConnections()||this.config.webrtc?.reconnectOnDialFailure===!1)return!1;const t=Date.now(),r=this.
config.webrtc?.reconnectThrottleMs??3e4;return!(t-this.relayReconnectState.lastReconnectAt<r||this.bootstrapPeerIds.has(
e)||!this.peers.has(e))}async _reconnectRelayForDial(e){if(!this._shouldReconnectRelayForDial(e))return!1;Be("[NetworkMa\
nager] Reconnecting to relay for dial:",e),this.relayReconnectState.lastReconnectAt=Date.now(),this.relayReconnectState.
pendingDialsNeedingRelay.add(e);try{return await this._dialBootstrapPeers(),this._hasBootstrapRelayConnections()}catch(t){
return H("[NetworkManager] Relay reconnect failed:",t?.message||t),!1}}_isRelayReservationError(e){const t=String(e?.message||
e||"");return t?t.includes("NO_RESERVATION")||/reservation/i.test(t):!1}_clearRelayAssistState(){const e=this.relayAssistState?.
pendingReadyTimeouts;e&&typeof e.forEach=="function"&&(e.forEach(t=>clearTimeout(t)),e.clear()),this.relayAssistState?.lastRequestAt?.
clear?.(),this.relayAssistState?.inboundRequestAt?.clear?.()}async _requestRelayAssist(e,t="dial-failed"){if(!e||e===this.
peerId||this.config.webrtc?.enableRelayAssist===!1)return!1;const r=Date.now(),s=this.config.webrtc?.relayAssistRequestThrottleMs??
Av,i=this.relayAssistState.lastRequestAt.get(e)||0;if(r-i<s)return!1;this.relayAssistState.lastRequestAt.set(e,r);const o=this.
relayAssistState.pendingReadyTimeouts.get(e);o&&(clearTimeout(o),this.relayAssistState.pendingReadyTimeouts.delete(e));const a=this.
config.webrtc?.relayAssistReadyTimeoutMs??Ev,c=setTimeout(()=>{this.relayAssistState.pendingReadyTimeouts.delete(e)},a);
this.relayAssistState.pendingReadyTimeouts.set(e,c);try{return await this.sendToPeer(e,{type:"relay-assist-request",reason:t,
requestedAt:r}),Be("[NetworkManager] Relay assist requested",e,t),!0}catch(l){return clearTimeout(c),this.relayAssistState.
pendingReadyTimeouts.delete(e),H("[NetworkManager] Relay assist request failed",e,l?.message||l),!1}}_handleRelayAssistMessage(e,t){
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
e,"relay-assist-ready",t.multiaddrs||null,{force:!0})}_buildCircuitAddr(e){if(!e||!this.config.bootstrapPeers?.length)return null;
try{const t=this.config.bootstrapPeers.filter(a=>typeof a=="string"&&a.includes("/p2p/")).map(a=>Gn(a));if(t.length===0)
return null;const r=this._hasLocalIpv6Addrs(),i=t.find(a=>r?a.includes("/ip6/")||a.includes("/dns6/"):a.includes("/ip4/")||
a.includes("/dns4/"))||t[0],o=Gn(i);return k(`${o}/p2p-circuit/p2p/${e}`)}catch(t){return H("[NetworkManager] Failed to \
build circuit addr:",t?.message||t),null}}_scheduleAutoRelayDrop(){const e=this.config.webrtc?.autoDropRelayAfterDialMs??
6e4;e<=0||(this.relayReconnectState.autoDisconnectTimer&&clearTimeout(this.relayReconnectState.autoDisconnectTimer),this.
relayReconnectState.autoDisconnectTimer=setTimeout(()=>{this.relayReconnectState.autoDisconnectTimer=null,this.relayReconnectState.
pendingDialsNeedingRelay.clear(),Be("[NetworkManager] Auto-dropping relay after dial timeout"),this._maybeUpdateBootstrapRelayConnections()},
e))}_getDialBackoffEntry(e,t=Date.now()){const r=this.peerDialBackoff.get(e);return r?r.until<=t?(this.peerDialBackoff.delete(
e),null):r:null}_recordDialFailureBackoff(e,t,r){if(!e)return;const s=Date.now(),i=this._getDialBackoffEntry(e,s),o=x7(r)||
t==="webrtc-relay",a=Number.isFinite(this.config.webrtc?.dialFailureBackoffBaseMs)?this.config.webrtc.dialFailureBackoffBaseMs:
Cv,c=Number.isFinite(this.config.webrtc?.dialFailureBackoffMaxMs)?Math.max(a,this.config.webrtc.dialFailureBackoffMaxMs):
Iv,l=o?Math.min((i?.attempts||0)+1,8):1,u=o?Math.min(c,a*2**(l-1)):Math.min(c,Math.max(a,5e3));this.peerDialBackoff.set(
e,{attempts:l,until:s+u,transient:o,reason:String(r?.message||r||"")})}_clearDialFailureBackoff(e){e&&this.peerDialBackoff.
delete(e)}_shouldElectRelayRedial(e=Date.now(),t={}){const r=t?.allowWithBootstrap===!0;if(e<this.relayKeeperUntil)return!0;
if(!this.peerId||!this.config.bootstrapPeers?.length||!r&&this._hasBootstrapRelayConnections())return!1;const s=Number.isFinite(
this.config.presenceIntervalMs)?this.config.presenceIntervalMs:3e3,i=Number.isFinite(this.config.peerStaleMs)?this.config.
peerStaleMs:Math.max(3e4,s*3),o=this._getScopedPeers().filter(l=>{const u=Number(l?.lastSeen??0);return u?e-u<=i:!1});if(o.
some(l=>l?.relayConnected===!0))return!1;const a=o.map(l=>({peerId:l.peerId,activeConnections:Number.isFinite(l.activeConnections)?
l.activeConnections:1/0}));a.push({peerId:this.peerId,activeConnections:this._getActiveConnectionCount()}),a.sort((l,u)=>l.
activeConnections!==u.activeConnections?l.activeConnections-u.activeConnections:String(l.peerId).localeCompare(String(u.
peerId)));const c=a[0]?.peerId===this.peerId;if(c){const l=Number.isFinite(this.config.webrtc?.relayElectionStickyMs)?Math.
max(0,this.config.webrtc.relayElectionStickyMs):xv;this.relayKeeperUntil=e+l,this._publishPresenceNow().catch(()=>{})}return c}_scheduleIsolationRelayRedial(){
this.libp2p&&this.config.bootstrapPeers?.length&&(this.isolationReconnectTimer||(this.isolationReconnectTimer=setTimeout(
()=>{this.isolationReconnectTimer=null,!(this._getActiveConnectionCount()>0)&&(this._hasBootstrapRelayConnections()||this.
_maybeRedialBootstrapPeers())},400)))}_shouldDialDiscoveredPeer(e){if(!e)return!1;const t=this._getConnectionsForPeer(e),
r=t.length>0&&t.some(h=>eu(h?.remoteAddr))&&!t.some(h=>Yr(h?.remoteAddr)),s=this._countDialedPeers(),i=this.config.allowDiscoveryDialWhenIsolated&&
s===0;if(!(!this.config.enforceRoomIsolation||this.bootstrapPeerIds.has(e)||this.peers.has(e)||i))return!1;if(this.bootstrapPeerIds.
has(e))return!(this.config.webrtc?.dropRelayBootstrapOnDirect&&this._hasDirectPeerConnections());if((this.config.topology===
"throughput"||this.config.topology==="static")&&this.topologyController&&!this.topologyController.desiredPeers.has(e))return!1;
if(r&&this.config.webrtc?.preferDirect!==!1)return!0;if(!this._hasAvailableLogicalPeerSlot(e))return!1;const a=this.config.
maxDialPeers;if(Number.isFinite(a)&&(a<=0||this._countDialedPeers()>=a))return!1;const c=Number.isFinite(this.config.targetConnections)?
this.config.targetConnections:null,l=this._getActiveDialedPeerCount(),u=Number.isFinite(c)&&l<c;return!(this.topologyController&&
!u&&!this.topologyController.shouldDialPeer(e))}_pruneStalePeers(e=Date.now()){const t=this.config.peerStaleMs,r=Number.
isFinite(this.config.presenceIntervalMs)?this.config.presenceIntervalMs:3e3,s=Number.isFinite(t)?t:Math.max(3e4,r*3);if(!(s<=
0))for(const[i,o]of this.peers.entries()){if(!i)continue;const a=Number(o?.lastSeen??o?.lastMessageTime??o?.connectedAt??
o?.joinedAt??0);if(!a||e-a<=s||this._getConnectionsForPeer(i).some(h=>h?.status!=="closed"))continue;this.peers.delete(i),
this._dropPubsubPeer(i),this.recentDialAttempts.delete(i),this.peerDialBackoff.delete(i),this._clearPendingLogicalReservations(
i),this._clearRelayPruneTimer(i),this.relayReservationPeers.delete(i),this.relayAssistState?.lastRequestAt?.delete?.(i),
this.relayAssistState?.inboundRequestAt?.delete?.(i);const u=this.relayAssistState?.pendingReadyTimeouts?.get?.(i);u&&(clearTimeout(
u),this.relayAssistState.pendingReadyTimeouts.delete(i))}}_touchPeer(e,t){const s={...this.peers.get(e)||{},...t},i=Object.
prototype.hasOwnProperty.call(t,"signalingPath"),o=Object.prototype.hasOwnProperty.call(t,"mediaPath"),a=vm(s.via);if(i)
s.signalingPath=Hr(s.signalingPath);else{const c=Hr(s.signalingPath)||Hr(a.signalingPath);c&&(s.signalingPath=c)}if(o)s.
mediaPath=Xr(s.mediaPath);else{const c=Xr(s.mediaPath)||Xr(a.mediaPath);c&&(s.mediaPath=c)}this.peers.set(e,s)}_recordRx(e,t){
if(this.telemetry.rxCount+=1,this.telemetry.rxBytes+=t||0,!e)return;const r=this.peers.get(e)||{};this.peers.set(e,{...r,
rxCount:(r.rxCount||0)+1,rxBytes:(r.rxBytes||0)+(t||0),lastRxAt:Date.now()})}_recordPubsubRx(e){this.telemetry.pubsubRxCount+=
1,this.telemetry.pubsubRxBytes+=e||0,this.telemetry.pubsubLastRxAt=Date.now()}_recordTx(e,t){if(this.telemetry.txCount+=
1,this.telemetry.txBytes+=t||0,!e)return;const r=this.peers.get(e)||{};this.peers.set(e,{...r,txCount:(r.txCount||0)+1,txBytes:(r.
txBytes||0)+(t||0),lastTxAt:Date.now()})}_recordPubsubTx(e){this.telemetry.pubsubTxCount+=1,this.telemetry.pubsubTxBytes+=
e||0,this.telemetry.pubsubLastTxAt=Date.now()}_getRelayRetentionConfig(){return this.config.webrtc?.relayRetention||null}_getRetentionCandidates(){
const e=new Map;if(this._getScopedPeers().forEach(r=>{const s=r?.peerId;if(!s)return;const i=Number(r.joinedAt??r.connectedAt??
r.lastSeen),o=e.get(s);(!o||Number.isFinite(i)&&i<o)&&e.set(s,Number.isFinite(i)?i:1/0)}),this.peerId){const r=Number(this.
joinedAt??Date.now()),s=e.get(this.peerId);(!s||r<s)&&e.set(this.peerId,r)}return Array.from(e.entries()).map(([r,s])=>({
peerId:r,joinedAt:s}))}_getRelayRetentionKeepCount(e,t){if(!e||e<=0)return 0;const r=t?.mode||"logn";let s=0;if(r==="sqr\
t")s=Math.ceil(Math.sqrt(e));else{const i=t?.base||2,o=Math.log(e)/Math.log(i);s=Math.ceil(o)}return s=Math.max(t.min??1,
s),Number.isFinite(t.max)&&(s=Math.min(s,t.max)),s}_shouldKeepRelayBootstrapConnection(){if(!this.config.webrtc?.dropRelayBootstrapOnDirect)
return!0;if(this._hasBootstrapRelayConnections()){const l=Number.isFinite(this.config.webrtc?.relayBootstrapMinHoldMs)?Math.
max(0,this.config.webrtc.relayBootstrapMinHoldMs):wh;if(l>0&&Number.isFinite(this.relayBootstrapConnectedAt)&&Date.now()-
this.relayBootstrapConnectedAt<l)return!0}if(!this._hasDirectPeerConnections()||!this._hasHealthyGossipsubMesh())return!0;
const e=Number.isFinite(this.config.webrtc?.relayPostDirectHoldMs)?Math.max(0,this.config.webrtc.relayPostDirectHoldMs):
vh;if(e>0&&Number.isFinite(this.firstDirectUpgradeAt)&&Date.now()-this.firstDirectUpgradeAt<e)return!0;const t=Number.isFinite(
this.config.targetConnections)?this.config.targetConnections:null;if(Number.isFinite(t)){const l=this._getScopedPeers().
filter(A=>A?.peerId&&A.peerId!==this.peerId&&!this.bootstrapPeerIds.has(A.peerId)).length,u=Math.max(this._getActiveDialedPeerCount(),
this._countDialedPeers()),h=Math.max(l,u),f=h>0?Math.min(t,h):t;if(this._getActiveDialedPeerCount()<f)return!0}const r=this.
_getRelayRetentionConfig();if(!r)return Be("[NetworkManager] No retention config, dropping relay"),!1;if(r.mode!=="logn"&&
r.mode!=="sqrt")return Be("[NetworkManager] Invalid retention mode:",r.mode),!1;const s=this._getRetentionCandidates(),i=this.
_getRelayRetentionKeepCount(s.length,r);if(i<=0)return Be("[NetworkManager] keepCount=0, dropping relay"),!1;const o=r.minCandidates??
Math.max(i+1,r.min??1);if(s.length<o)return Be("[NetworkManager] Not enough candidates:",s.length,"<",o),!0;const a=s.slice().
sort((l,u)=>{const h=Number.isFinite(l.joinedAt)?l.joinedAt:1/0,f=Number.isFinite(u.joinedAt)?u.joinedAt:1/0;return h!==
f?h-f:String(l.peerId).localeCompare(String(u.peerId))});return new Set(a.slice(0,i).map(l=>l.peerId)).has(this.peerId)}_startPresence(){
this._clearPresenceTimer();const e=()=>this._publishPresenceNow(),t=()=>{this._maybeUpdateBootstrapRelayConnections(),this.
_ensureRelayReservation(),e().catch(()=>{})};t(),this.presenceInterval=setInterval(()=>{t()},this.config.presenceIntervalMs||
3e3)}_ensureRelayReservation(){if(!this.libp2p||!this.peerId||!this._hasBootstrapRelayConnections())return;const e=this.
libp2p.components?.addressManager;if(!e?.confirmObservedAddr)return;const t=this.peerId;for(const r of this.config.bootstrapPeers||
[]){if(typeof r!="string"||!r.includes("/p2p/"))continue;const s=Gn(r),i=`${s}/p2p-circuit/p2p/${t}`,o=`${s}/p2p-circuit\
/webrtc/p2p/${t}`;try{e.confirmObservedAddr(k(i),{type:"transport"}),e.confirmObservedAddr(k(o),{type:"transport"})}catch{}}}_buildPresencePayload(){
if(!this.peerId)return null;const e=this._getActiveDialedPeerCount(),t=this._getPresenceCapabilities();return{type:"pres\
ence",from:this.peerId,gameId:this.config.gameId,roomId:this.config.roomId,topologyId:this.config.topologyId,topologyType:this.
config.topology,shardId:this.topologyShardId,metric:{...this.topologyMetric},metricInitialized:this.metricInitialized,joinedAt:this.
joinedAt,targetConnections:this.config.targetConnections,maxConnections:this.config.maxConnections,transportMaxConnections:this.
_getTransportMaxConnections(this.config.maxConnections),activeConnections:e,relayConnected:this._hasBootstrapRelayConnections(),
...t?{capabilities:t}:{},multiaddrs:this._getAnnounceAddrs()}}_getPresenceCapabilities(){if(typeof this.config.presenceCapabilitiesProvider!=
"function")return null;try{return mm(this.config.presenceCapabilitiesProvider({peerId:this.peerId,networkManager:this}))}catch(e){
return H("[NetworkManager] Presence capabilities provider failed",e),null}}async _publishPresenceNow(){const e=this._buildPresencePayload();
e&&await this._publish(this.config.presenceTopic,e)}_clearPresenceTimer(){this.presenceInterval&&(clearInterval(this.presenceInterval),
this.presenceInterval=null)}async queryPeerDirectory(e){if(!this.libp2p||!this.config.enablePeerDirectory)return null;const t=`${this.
peerId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,r={type:"directory-query",requestId:t,targetPeerId:e,from:this.
peerId};return new Promise(s=>{const i=this.config.directoryQueryTimeoutMs,o=setTimeout(()=>{this.pendingDirectoryQueries.
delete(t),s(null)},i);this.pendingDirectoryQueries.set(t,{resolve:s,timeout:o});const a=JSON.stringify(r);this._publish(
this.config.directoryTopic,a).catch(()=>{clearTimeout(o),this.pendingDirectoryQueries.delete(t),s(null)})})}_handleDirectoryMessage(e){
try{const t=typeof e=="string"?JSON.parse(e):e;if(t.type!=="directory-response")return;const r=this.pendingDirectoryQueries.
get(t.requestId);if(!r)return;clearTimeout(r.timeout),this.pendingDirectoryQueries.delete(t.requestId),t.found&&Array.isArray(
t.multiaddrs)?(this._rememberPeerAddresses(t.targetPeerId,t.multiaddrs),r.resolve({peerId:t.targetPeerId,multiaddrs:t.multiaddrs,
lastSeen:t.lastSeen,metadata:t.metadata})):r.resolve(null)}catch{}}async registerWithDirectory(){if(!this.libp2p||!this.
config.enablePeerDirectory)return;const e={type:"directory-register",from:this.peerId,multiaddrs:this._getAnnounceAddrs(),
roomId:this.config.roomId,topologyId:this.config.topologyId,shardId:this.topologyShardId};await this._publish(this.config.
directoryTopic,JSON.stringify(e))}_updateShardState(e=!1){if(!this.topologyController||!this.config.enableSharding)return;
const t=this.topologyController.getShardId(this.topologyMetric);if(!e&&t===this.topologyShardId)return;this.topologyShardId=
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
!this.peers.has(s)&&this.peerWork.delete(s)}}_tickThroughputTopology(e,t,r){const s=(Array.isArray(r)?r:[]).filter(p=>p?.
peerId&&!this.bootstrapPeerIds.has(p.peerId));this._samplePeerWorkRates(e,s);const i=p=>this.peerWork.get(p)?.rate||0,o=new Set(
s.map(p=>p.peerId)),a=s.map(p=>{const A=this.peers.get(p.peerId);return A&&!A.linkSince&&(A.linkSince=Number(A.connectedAt)||
e),{peerId:p.peerId,flow:i(p.peerId),since:A?.linkSince??e}});for(const[p,A]of this.peers)!o.has(p)&&A?.linkSince&&delete A.
linkSince;this._prunePendingLogicalReservations(e);for(const[p,A]of this.throughputPendingLinks){if(A<=e||o.has(p)){this.
throughputPendingLinks.delete(p);continue}a.push({peerId:p,flow:0,since:e}),o.add(p)}const c=(Array.isArray(t)?t:[]).filter(
p=>p?.peerId&&p.peerId!==this.peerId&&!o.has(p.peerId)&&!this.bootstrapPeerIds.has(p.peerId)),l=c.map(p=>p.peerId),u=c.filter(
p=>Number.isFinite(p.activeConnections)&&Number.isFinite(p.targetConnections)&&p.activeConnections<p.targetConnections).
map(p=>p.peerId),h=[...new Set([...l.filter(p=>i(p)>0).sort((p,A)=>i(A)-i(p)),...l.filter(p=>this.topologyController?.referralPeers?.
has(p))])],f=a7({now:e,links:a,candidates:l,referrals:h,available:u,state:this.throughputTopologyState,config:{targetConnections:this.
config.targetConnections,maxConnections:this.config.maxConnections,...this.config.throughputTopology}});for(const p of f.
drop)o.delete(p),this._closeConnectionsToPeer(p);f.connect&&o.add(f.connect);for(const p of this.pendingTopologyAccepts.
keys())o.add(p);if(this.topologyController&&(this.topologyController.desiredPeers=o),f.connect){const p=Number.isFinite(
this.config.throughputTopology?.linkSetupMs)?this.config.throughputTopology.linkSetupMs:25e3;this.throughputPendingLinks.
set(f.connect,e+p),this._ensureTopologyConnections(new Set([f.connect]))}}_pruneExcessTopologyConnections(e,t,r){if(!this.
topologyController||this.config.topology!=="distributed")return;const s=Number.isFinite(this.config.maxConnections)?Math.
max(1,this.config.maxConnections):0;if(s<=0)return;const i=(Array.isArray(r)?r:[]).filter(h=>h?.peerId&&!this.bootstrapPeerIds.
has(h.peerId)),o=i.length-s;if(o<=0)return;const a=e instanceof Set?e:new Set,c=new Map;t.forEach(h=>{h?.peerId&&c.set(h.
peerId,h)}),i.forEach(h=>{h?.peerId&&!c.has(h.peerId)&&c.set(h.peerId,h)});const l=new Set(this.bootstrapPeerIds);if(this.
topologyController.longRangePeers)for(const h of this.topologyController.longRangePeers)l.add(h);const u=i.filter(h=>!a.
has(h.peerId)).filter(h=>!l.has(h.peerId)).map(h=>{const f=c.get(h.peerId)||h,p=this.topologyController.getPeerDistance(
f),A=Number.isFinite(f?.activeConnections)?f.activeConnections:0,y=Number(f?.joinedAt??f?.connectedAt??0);return{peerId:h.
peerId,via:h?.via||f?.via||null,distance:Number.isFinite(p)?p:Number.POSITIVE_INFINITY,activeConnections:A,joinedAt:Number.
isFinite(y)?y:0}});u.length!==0&&(u.sort((h,f)=>{const p=Xo(h.via),A=Xo(f.via);return p!==A?p?-1:1:h.distance!==f.distance?
f.distance-h.distance:h.activeConnections!==f.activeConnections?f.activeConnections-h.activeConnections:h.joinedAt!==f.joinedAt?
f.joinedAt-h.joinedAt:String(h.peerId).localeCompare(String(f.peerId))}),u.slice(0,o).forEach(h=>{this._closeConnectionsToPeer(
h.peerId)}))}_maybeSwapTopologyConnections(e,t,r){if(!this.topologyController||this.config.topology!=="distributed")return;
const s=this.config.maxConnections;if(!Number.isFinite(s)||s<=0||this._getActiveDialedPeerCount()<s||!e||e.size===0)return;
const i=new Map;t.forEach(g=>{g?.peerId&&i.set(g.peerId,g)});const o=r.filter(g=>g?.peerId&&!this.bootstrapPeerIds.has(g.
peerId));if(o.length===0)return;const a=new Set(o.map(g=>g.peerId)),c=this.config.allowRelayWhenIsolated!==!1,l=o.some(g=>wm(
g?.via));if(c&&!l)return;const u=(g,x)=>{const _=x?.activeConnections,S=this.topologyController.getPeerDistance(x||{peerId:g}),
C=Number.isFinite(S)?S:Number.POSITIVE_INFINITY;return{peerId:g,distance:C,noConnections:_===0}},h=(g,x)=>g.noConnections!==
x.noConnections?g.noConnections?-1:1:g.distance!==x.distance?g.distance-x.distance:String(g.peerId).localeCompare(String(
x.peerId)),f=g=>({x:Number.isFinite(g?.x)?g.x:0,y:Number.isFinite(g?.y)?g.y:0,z:Number.isFinite(g?.z)?g.z:0}),p=g=>{if(!g?.
metric||typeof g.metric!="object")return!1;const x=g.metricInitialized===!0,_=f(g.metric),S=_.x===0&&_.y===0&&_.z===0;return x||
!S},A=(g,x)=>{if(!p(g)||!p(x))return Number.POSITIVE_INFINITY;const _=f(g.metric),S=f(x.metric),C=_.x-S.x,T=_.y-S.y,M=_.
z-S.z;return Math.sqrt(C*C+T*T+M*M)},y=Array.from(e).filter(g=>!a.has(g)).map(g=>u(g,i.get(g))).filter(g=>Number.isFinite(
g.distance));if(y.length===0)return;y.sort(h);const I=y[0];if(!I)return;const d=new Set(this.bootstrapPeerIds);if(this.topologyController.
longRangePeers)for(const g of this.topologyController.longRangePeers)d.add(g);const m=o.filter(g=>g?.peerId).filter(g=>!e.
has(g.peerId)).filter(g=>!d.has(g.peerId)).filter(g=>!(c&&Xo(g?.via)&&!l)).map(g=>u(g.peerId,g));if(m.length===0)return;
m.sort(h);const E=m[m.length-1];if(!E||h(I,E)>=0)return;const w=i.get(E.peerId),b=Number.isFinite(w?.activeConnections)?
w.activeConnections-1:null;if(!Number.isFinite(b)||b<2||!Number.isFinite(E.distance))return;let v=0;for(const g of t){if(!g?.
peerId||g.peerId===E.peerId||g.peerId===this.peerId)continue;const x=A(w,g);if(Number.isFinite(x)&&x<E.distance&&(v+=1,v>=
2))break}v<2||this._closeConnectionsToPeer(E.peerId)}_ensureTopologyConnections(e){if(!e||e.size===0)return;const t=Date.
now();this._prunePendingLogicalReservations(t);for(const r of e)r&&(this.peers.get(r)?.connectedAt||this.pendingTopologyRequests.
has(r)||this._hasAvailableLogicalPeerSlot(r,t)&&(this.pendingTopologyRequests.set(r,{sentAt:t,expiresAt:t+Ho}),this.sendToPeer(
r,{type:"topology-connect-request",metric:this.topologyMetric,targetConnections:this.config.targetConnections,maxConnections:this.
config.maxConnections}).catch(()=>{this.pendingTopologyRequests.delete(r)})))}_closeConnectionsToPeer(e){if(!this.libp2p?.
getConnections||!e)return;const t=this._getConnectionsForPeer(e);if(this.topologyLinkReleasers.size>0&&t.some(r=>Ae(r)&&
this._getPeerConnectionRecovery().protectionMs(r)<=0))for(const r of this.topologyLinkReleasers)try{r(e)}catch{}t.forEach(
r=>this._retireIdleConnection(r,"topology"))}_hasActiveApplicationStreams(e){const t=this.libp2p?.services??{},r=new Set(
[t.identify?.protocol,t.identifyPush?.protocol,t.ping?.protocol,t.pubsub?.protocol,...t.pubsub?.protocols??[],...t.pubsub?.
multicodecs??[]].filter(Boolean));return(e.streams??[]).some(s=>typeof s.protocol=="string"&&s.protocol.length>0&&!["clo\
sed","aborted","reset"].includes(s.status)&&!r.has(s.protocol))}_retireIdleConnection(e,t){return!Ae(e)||this._getPeerConnectionRecovery().
protectionMs(e)>0||this._hasActiveApplicationStreams(e)?!1:(this._infoLog("[NetworkManager] Retiring idle connection",e.
remotePeer?.toString?.(),e.id,t,_t(e.remoteAddr)),e.close?.().catch?.(()=>{}),!0)}_handleTopologyMessage(e,t){if(!e||typeof e.
type!="string"||!e.type.startsWith("topology-"))return!1;const r=t?.from||e.from;return!r||r===this.peerId?!0:e.type==="\
topology-connect-request"?(this._handleTopologyConnectRequest(r,e),!0):e.type==="topology-connect-accept"?(this._handleTopologyConnectAccept(
r),!0):(e.type==="topology-connect-referral"&&this._handleTopologyConnectReferral(r,e),!0)}_handleTopologyConnectRequest(e,t={}){
if(!e)return;const r=Date.now();this._prunePendingLogicalReservations(r);const s=()=>{this.pendingTopologyAccepts.set(e,
{reservedAt:r,expiresAt:r+Ho}),this.config.topology==="throughput"&&this.topologyController?.desiredPeers?.add(e),this.sendToPeer(
e,{type:"topology-connect-accept"}).catch(()=>{this.pendingTopologyAccepts.delete(e)})};if(this.config.topology==="stati\
c"){this.staticTopologyPeers?.has(e)&&s();return}if(!this._hasAvailableLogicalPeerSlot(e,r)){if(this.topologyController&&
this.config.topology!=="throughput"){const o=t?.metric||this.peers.get(e)?.metric||null,a=t?.metric?!0:this.peers.get(e)?.
metricInitialized===!0,c=this.topologyController.getPeerDistance({peerId:e,metric:o,metricInitialized:a});if(Number.isFinite(
c)){const l=this._getConnectionPeers().filter(f=>f?.peerId&&!this.bootstrapPeerIds.has(f.peerId)),u=this.config.allowRelayWhenIsolated!==
!1,h=l.some(f=>wm(f?.via));if(!(u&&!h)&&l.length>0){const f=new Set(this.bootstrapPeerIds);if(this.topologyController.longRangePeers)
for(const d of this.topologyController.longRangePeers)f.add(d);const p=d=>({x:Number.isFinite(d?.x)?d.x:0,y:Number.isFinite(
d?.y)?d.y:0,z:Number.isFinite(d?.z)?d.z:0}),A=d=>{if(!d?.metric||typeof d.metric!="object")return!1;const m=d.metricInitialized===
!0,E=p(d.metric),w=E.x===0&&E.y===0&&E.z===0;return m||!w},y=(d,m)=>{if(!A(d)||!A(m))return Number.POSITIVE_INFINITY;const E=p(
d.metric),w=p(m.metric),b=E.x-w.x,v=E.y-w.y,g=E.z-w.z;return Math.sqrt(b*b+v*v+g*g)},I=l.filter(d=>d?.peerId).filter(d=>!f.
has(d.peerId)).filter(d=>!(u&&Xo(d?.via)&&!h)).map(d=>({peer:d,distance:this.topologyController.getPeerDistance(d)})).filter(
d=>Number.isFinite(d.distance));if(I.length>0){I.sort((m,E)=>E.distance-m.distance);const d=I[0];if(c<d.distance){const m=d.
peer,E=Number.isFinite(m?.activeConnections)?m.activeConnections-1:null;if(Number.isFinite(E)&&E>=2){let w=0;const b=this.
_getScopedPeers();for(const v of b){if(!v?.peerId||v.peerId===m.peerId||v.peerId===this.peerId)continue;const g=y(m,v);if(Number.
isFinite(g)&&g<d.distance&&(w+=1,w>=2))break}if(w>=2){this._closeConnectionsToPeer(m.peerId),s();return}}}}}}}const i=this.
_getScopedPeers().filter(o=>o.peerId&&o.peerId!==this.peerId).filter(o=>!Number.isFinite(o.targetConnections)||!Number.isFinite(
o.activeConnections)?!0:o.activeConnections<o.targetConnections).slice(0,5).map(o=>o.peerId);this.sendToPeer(e,{type:"to\
pology-connect-referral",peers:i}).catch(()=>{});return}s()}_handleTopologyConnectAccept(e){e&&(this._prunePendingLogicalReservations(),
this._maybeDialPeer(e,"topology-accept").catch(()=>{}).finally(()=>{this._getConnectionsForPeer(e).some(Ae)||this.pendingTopologyRequests.
delete(e)}))}_handleTopologyConnectReferral(e,t){this.pendingTopologyRequests.delete(e),this.throughputPendingLinks.delete(
e);const r=Array.isArray(t?.peers)?t.peers:[];this.topologyController&&this.topologyController.addReferralPeers(r)}_startTelemetrySampler(){
if(!this.config.enableTelemetry||this.telemetryTimer)return;const e=this.config.telemetrySampleMs||1e3,t=()=>{this._sampleTelemetry(
Date.now()),this.telemetryTimer=setTimeout(t,e)};this.telemetryTimer=setTimeout(t,e)}_stopTelemetrySampler(){this.telemetryTimer&&
(clearTimeout(this.telemetryTimer),this.telemetryTimer=null)}_sampleTelemetry(e){const t=this.telemetrySample.at||e,r=e-
t;if(r>0){const i=this.telemetry.rxBytes-this.telemetrySample.rxBytes,o=this.telemetry.txBytes-this.telemetrySample.txBytes;
this.telemetry.rxBps=Math.max(0,i*1e3/r),this.telemetry.txBps=Math.max(0,o*1e3/r)}this.telemetrySample={rxBytes:this.telemetry.
rxBytes,txBytes:this.telemetry.txBytes,at:e};const s=this._getConnectionPeers();s.forEach(i=>{const o=i.peerId;if(!o)return;
const a=this.peers.get(o)||{},c=a.telemetrySample||{rxBytes:a.rxBytes||0,txBytes:a.txBytes||0,at:e},l=e-c.at;if(l>0){const u=(a.
rxBytes||0)-c.rxBytes,h=(a.txBytes||0)-c.txBytes;a.rxBps=Math.max(0,u*1e3/l),a.txBps=Math.max(0,h*1e3/l)}a.telemetrySample=
{rxBytes:a.rxBytes||0,txBytes:a.txBytes||0,at:e},this.peers.set(o,a)}),this._sampleRtt(e,s)}_sampleRtt(e,t){const r=this.
libp2p?.services?.ping?.ping;if(!r||!this.config.enableTelemetry)return;const s=this.config.telemetryPingMs||5e3;t.forEach(
i=>{const o=i.peerId;if(!o)return;const a=this.peers.get(o)||{};if(a.pingInFlight||a.lastRttAt&&e-a.lastRttAt<s)return;let c=null;
try{c=Z(o)}catch{return}a.pingInFlight=!0,this.peers.set(o,a),r(c).then(l=>{this._touchPeer(o,{rttMs:Math.round(l),lastRttAt:Date.
now()})}).catch(()=>{this._touchPeer(o,{rttMs:null,lastRttAt:Date.now()})}).finally(()=>{const l=this.peers.get(o)||{};l.
pingInFlight=!1,this.peers.set(o,l)})})}_ensureScheduler(){this.scheduler||(this.scheduler=new Yz(this._buildSchedulerAdapter(),
this.schedulerProfile),this.authorityId&&this.scheduler.setAuthority(this.authorityId))}_startScheduler(){if(!this.schedulerEnabled||
!this.isConnected||this.schedulerClock==="external"||!this.scheduler||this.schedulerTimer)return;const e=()=>{this.scheduler&&
(this.scheduler.tick(Date.now()),this.schedulerTimer=setTimeout(e,this.scheduler.getTickIntervalMs()))};this.schedulerTimer=
setTimeout(e,this.scheduler.getTickIntervalMs())}_stopScheduler(){this.schedulerTimer&&(clearTimeout(this.schedulerTimer),
this.schedulerTimer=null)}_buildSchedulerAdapter(){return{sendSnapshot:e=>this._sendScheduledSnapshot(e),sendCommand:e=>this.
_sendScheduledCommand(e),sendEvent:e=>this._sendScheduledEvent(e),reconnect:()=>this._schedulerReconnect(),getPeerId:()=>this.
peerId,getAuthority:()=>this.authorityId,getGameId:()=>this.config.gameId,getRoomId:()=>this.config.roomId,getTopologyId:()=>this.
config.topologyId,getTopologyType:()=>this.config.topology,isInScope:e=>this._matchesScope(e)}}async _sendScheduledSnapshot(e){
if(!this.isConnected||this.schedulerProfile.snapshotsRequireAuthority&&this.authorityId&&this.authorityId!==this.peerId)
return;const t=this.scheduler?.getProfile()?.snapshotTopic||null,r=this._getShardSnapshotTopic(),s=!t&&r,i=t||r||this.config.
pubsubTopic,o=s?{...e,shardId:this.topologyShardId}:e;await this._publish(i,o)}async _sendScheduledCommand(e){if(!this.isConnected)
return;const t=this.scheduler?.getProfile()?.commandTopic||this.config.directTopic,r=this.authorityId&&this.authorityId!==
this.peerId?this.authorityId:null,s=r?{...e,target:r}:e;await this._publish(t,s)}async _sendScheduledEvent(e){if(!this.isConnected)
return;const t=this.scheduler?.getProfile()?.eventTopic||this.config.pubsubTopic;await this._publish(t,e)}_schedulerReconnect(){
const e=this.libp2p,t=this.connectionGeneration,r=()=>this.isConnected&&e===this.libp2p&&t===this.connectionGeneration,s=()=>!!e?.
services?.pubsub&&e.services.pubsub.isStarted?.()!==!1;if(!r()||!s())return Promise.resolve();if(this.schedulerReconnect?.
node===e&&this.schedulerReconnect.generation===t)return this.schedulerReconnect.task;const i={node:e,generation:t,task:null};
return this.schedulerReconnect=i,i.task=(async()=>{try{if(await this.redialBootstrapPeers(),!r()||!s())return;this._resubscribeTopics(),
r()&&s()&&this._startPresence()}catch(o){if(!r())return;throw this._emitConnectionFailure({source:"scheduler",stage:"rec\
onnect",error:o}),H("[NetworkManager] Scheduler reconnect failed",o?.message||o),o}finally{this.schedulerReconnect===i&&
(this.schedulerReconnect=null)}})(),i.task}_resubscribeTopics(){this.libp2p?.services?.pubsub&&(this.libp2p.services.pubsub.
subscribe(this.config.pubsubTopic),this.libp2p.services.pubsub.subscribe(this.config.directTopic),this.libp2p.services.pubsub.
subscribe(this.config.presenceTopic),this.additionalPubsubTopics.forEach(e=>{this.libp2p.services.pubsub.subscribe(e)}),
this.config.enablePeerDirectory&&this.libp2p.services.pubsub.subscribe(this.config.directoryTopic),this.config.enableSharding&&
this.topologyController&&this._syncShardSubscriptions(this.topologyController.getNeighborShardIds(this.topologyMetric)),
this._recordPubsubTx(0))}async _publish(e,t){try{if(!this.libp2p?.services?.pubsub||!this.isConnected)return;const r=Date.
now(),s=this.publishBlockedUntil.get(e)||0;if(r<s)return;let i;try{i=A7.encode(JSON.stringify(t))}catch(o){H("[NetworkMa\
nager] Publish encode failed",e,o?.message||o);return}if(await this.libp2p.services.pubsub.publish(e,i),this.config.onPublishSuccess)
try{this.config.onPublishSuccess(e,t)}catch(o){H("[NetworkManager] onPublishSuccess failed",o?.message||o)}this.lastTxAt=
r,this.scheduler?.recordTx(r),this._recordTx(t?.target||null,Zl(i)),this._recordPubsubTx(Zl(i))}catch(r){const s=Date.now();
if(this.config.onPublishError)try{this.config.onPublishError(e,t,r)}catch(o){H("[NetworkManager] onPublishError failed",
o?.message||o)}(r?.name==="StreamStateError"||String(r?.message||"").includes("stream"))&&this.publishBlockedUntil.set(e,
s+2e3);const i=this.publishErrorAt.get(e)||0;s-i>5e3&&(this.publishErrorAt.set(e,s),H("[NetworkManager] Publish failed",
e,r?.message||r))}}async _dialBootstrapPeers(){const e=(this.config.bootstrapPeers||[]).map(L7).filter(Boolean);await Promise.
all(e.map(async t=>{const r=t.toString(),s=Am(r);try{if(s)try{const i=Z(s);if((this.libp2p?.getConnections?.(i)||[]).some(
Ae))return}catch{}await this.libp2p.dial(t),Be("[NetworkManager] Dialed bootstrap peer",r),await this._reserveRelayForPeer(
s,"bootstrap-dial")}catch(i){H("[NetworkManager] Failed to dial bootstrap peer",r,i?.message||i),this._emitConnectionFailure(
{peerId:s,address:r,source:"bootstrap",stage:"dial",error:i})}}))}async _reserveRelayForPeer(e,t=""){if(!e)return!1;const r=this.
relayTransport?.reservationStore;if(!r)return console.warn("[NetworkManager] Relay reservation store unavailable",t),!1;
typeof r.isStarted=="function"&&!r.isStarted()&&console.warn("[NetworkManager] Relay reservation store not started",t);let s;
try{s=Z(e)}catch{return!1}if(r.hasReservation(s))return this._confirmRelayReservationAddrs(),!0;try{return await r.addRelay(
s,"configured"),this.relayReservationPeers.add(e),this._confirmRelayReservationAddrs(),!0}catch(i){return console.warn("\
[NetworkManager] Relay reservation failed",e,t,i?.message||i),!1}}_confirmRelayReservationAddrs(){this._ensureRelayReservation()}async _reserveBootstrapRelayAddrs(){
if(!this.config.bootstrapPeers?.length)return;const e=Array.from(this.bootstrapPeerIds);await Promise.all(e.map(t=>this.
_reserveRelayForPeer(t,"bootstrap")))}async _logLocalAnnounceAddrs(e="status"){if(!this.libp2p?.getMultiaddrs)return;const t=this.
libp2p.getMultiaddrs().map(a=>a.toString()),r=this._getAnnounceAddrs(),s=t.filter(a=>a.includes("/webrtc")),i=t.filter(a=>a.
includes("/p2p-circuit"));this._infoLog(`[NetworkManager] Local multiaddrs (${e})`,JSON.stringify(t)),this._infoLog(`[Ne\
tworkManager] Local webrtc addrs (${e})`,JSON.stringify(s)),this._infoLog(`[NetworkManager] Local relay addrs (${e})`,JSON.
stringify(i)),this._infoLog(`[NetworkManager] Announce addrs (${e})`,JSON.stringify(r));const o=this.relayTransport?.reservationStore;
if(o?.reservationCount&&this._infoLog(`[NetworkManager] Relay reservations (${e})`,{total:o.reservationCount(),configured:o.
reservationCount("configured"),discovered:o.reservationCount("discovered")}),!(!this.libp2p?.peerStore?.get||!this.peerId))
try{const a=Z(this.peerId),l=((await this.libp2p.peerStore.get(a))?.addresses||[]).map(u=>u?.multiaddr?.toString?.()).filter(
Boolean);this._infoLog(`[NetworkManager] PeerStore addrs (${e})`,JSON.stringify(l))}catch(a){H("[NetworkManager] Failed \
to read peerStore addrs",a?.message||a)}}async _maybeDialPeer(e,t,r=null,s={}){if(!this.libp2p||!e||e===this.peerId||this.
bootstrapPeerIds.has(e)||this.peerConnectionRecovery?.pending.has(e))return;const i=this._getConnectionsForPeer(e),o=i.some(
p=>Yr(p?.remoteAddr)),a=i.some(p=>kt(p?.remoteAddr)),c=i.some(p=>pa(p?.remoteAddr)),l=this.config.webrtc?.preferDirect!==
!1,u=s?.force===!0;if(o||!l&&i.length>0&&!u)return;const h=Date.now();if(this._prunePendingLogicalReservations(h),!this.
_hasAvailableLogicalPeerSlot(e,h)){Be("[NetworkManager] Skipping dial at logical capacity",e,t||"unknown");return}if(!u&&
this._getDialBackoffEntry(e,h))return;const f=this.recentDialAttempts.get(e)||0;if(!(!u&&h-f<Jl)){this.recentDialAttempts.
set(e,h),this.pendingPeerDials.set(e,{reservedAt:h,expiresAt:h+Math.max(Ho,Number.isFinite(this.config.dialTimeoutMs)?this.
config.dialTimeoutMs:0),source:t||"unknown"});try{const p=_=>{if(!e)return _;const S=_t(_);return S?nu(S,e):_},A=_=>{if(!Array.
isArray(_))return[];const S=new Set;return _.map(C=>Yo(p(C))).filter(Boolean).filter(C=>{const T=_t(C);return!T||S.has(T)?
!1:(S.add(T),!0)})},y=_=>{const S=[],C=[],T=[];return _.forEach(M=>{const R=M?.toString?.()||String(M||"");kt(R)&&$n(R)?
C.push(M):eu(R)?T.push(M):S.push(M)}),{directTargets:S,relayWebrtcTargets:C,relayTargets:T}};let I=A(r),{directTargets:d,
relayWebrtcTargets:m,relayTargets:E}=y(I),w=null;if(l){if(d.length===0&&this.config.enablePeerDirectory){const _=await this.
queryPeerDirectory(e);if(_?.multiaddrs?.length>0){const S=A(_.multiaddrs),C=y(S);d=C.directTargets,m=m.length>0?m:C.relayWebrtcTargets,
E=E.length>0?E:C.relayTargets,Be("[NetworkManager] Got addresses from directory for:",e,S.length)}}if(d.length===0&&this.
libp2p?.peerStore?.get)try{const _=Z(e),S=await this.libp2p.peerStore.get(_);w=S?.addresses?.map(M=>M?.multiaddr?.toString?.()||
String(M?.multiaddr||""))||[];const C=A(S?.addresses?.map(M=>M.multiaddr)),T=y(C);d=T.directTargets,m=m.length>0?m:T.relayWebrtcTargets,
E=E.length>0?E:T.relayTargets}catch{}if(d.length===0){const _=this._getRememberedDialTargets(e);if(_.length>0){const S=y(
_);d=S.directTargets,m.length===0&&(m=S.relayWebrtcTargets),E.length===0&&(E=S.relayTargets)}}}let b=[];const v=this._hasLocalIpv6Addrs();
l?d.length>0?b=Sm(d,v):m.length>0&&!c?b=m:!a&&E.length>0&&(b=E):b=I.length>0?I:E;let g=!1;if(b.length>0){l&&(d.length>0?
this._infoLog("[NetworkManager] Direct dial targets",e,tu(b)):m.length>0?this._infoLog("[NetworkManager] No direct targe\
ts, using relay-webrtc",e,tu(b)):E.length>0&&(this._infoLog("[NetworkManager] No direct targets, using relay",e,tu(b)),w&&
w.length>0&&this._infoLog("[NetworkManager] PeerStore addrs",e,w)));for(const _ of b){const S=_t(_),C=Dv(S),T=S.includes(
"/webrtc")?(()=>{const M=new Set,R=new Map;return K=>{const N=K?.type||"";if(N.startsWith("webrtc:")){if(N==="webrtc:add\
-ice-candidate"){const F=I7(K?.detail);if(!F)return;const O=F.type||"unknown",D=R.get(O)||0;R.set(O,D+1);const j=`ice:${O}`;
M.has(j)||(this._infoLog("[NetworkManager] ICE candidate",e,O,F.protocol,F.address),M.add(j));return}if(N==="webrtc:end-\
of-ice-candidates"){const F=Array.from(R.entries()).map(([O,D])=>`${O}=${D}`).join(", ")||"none";this._infoLog("[Network\
Manager] ICE gathering done",e,F);return}M.has(N)||(this._infoLog("[NetworkManager] WebRTC progress",e,N,S),M.add(N))}}})():
null;C!=="relay"&&this._infoLog("[NetworkManager] Dial attempt",e,C,S);try{await this.libp2p.dial(_,T?{onProgress:T}:void 0),
this._clearDialFailureBackoff(e),Be("[NetworkManager] Dialed discovered peer",e,t?`(${t})`:"",_.toString());return}catch(M){
this._recordDialFailureBackoff(e,C,M),C==="webrtc-relay"&&this._isRelayReservationError(M)&&(g=!0),C!=="relay"?console.warn(
"[NetworkManager] Dial failed",e,C,S,M?.message||M):H("[NetworkManager] Failed to dial discovered peer",e,_.toString(),M?.
message||M),this._emitConnectionFailure({peerId:e,address:_.toString(),source:t,stage:"dial",error:M})}}}if(g&&await this.
_requestRelayAssist(e,`no-reservation:${t||"dial"}`))return;if(b.length>0&&!this._hasBootstrapRelayConnections()&&await this.
_reconnectRelayForDial(e)){const S=this._buildCircuitAddr(e);if(S)try{await this.libp2p.dial(S),this._clearDialFailureBackoff(
e),Be("[NetworkManager] Dialed via relay circuit after reconnect:",e),this._scheduleAutoRelayDrop();return}catch(C){this.
_recordDialFailureBackoff(e,"relay",C),H("[NetworkManager] Circuit dial failed after reconnect:",e,C?.message||C),this._emitConnectionFailure(
{peerId:e,address:S.toString(),source:t,stage:"dial",error:C})}}if(l&&a)return;let x=e;try{x=Z(e)}catch{return}try{await this.
libp2p.dial(x),this._clearDialFailureBackoff(e),Be("[NetworkManager] Dialed discovered peer",e,t?`(${t})`:"")}catch(_){this.
_recordDialFailureBackoff(e,"peerId",_),console.warn("[NetworkManager] Dial failed",e,"peerId",_?.message||_),this._emitConnectionFailure(
{peerId:e,source:t,stage:"dial",error:_})}}finally{this._getConnectionsForPeer(e).some(Ae)||this.pendingPeerDials.delete(
e)}}}_hasLocalIpv6Addrs(){return this.libp2p?.getMultiaddrs?this.libp2p.getMultiaddrs().map(t=>t.toString()).some(t=>!(!t.
includes("/ip6/")||t.includes("/ip6/::1")||t.includes("/ip6/::")||t.includes("/ip6/fe80:"))):!1}_getAnnounceAddrs(){if(!this.
libp2p?.getMultiaddrs)return[];const e=this.libp2p.getMultiaddrs().map(h=>h.toString()),t=e.filter(h=>h.includes("/p2p-c\
ircuit")||h.includes("/webrtc")),r=t.length>0?t:e,s=this.config.webrtc?.preferDirect!==!1;if(s&&!e.some(h=>h.includes("/\
webrtc"))){const h=Date.now();(!this.lastWebrtcAnnounceWarnAt||h-this.lastWebrtcAnnounceWarnAt>6e4)&&(this._infoLog("[Ne\
tworkManager] No local /webrtc addrs to announce; using relay-scoped WebRTC announce addrs."),this.lastWebrtcAnnounceWarnAt=
h)}const i=this._hasLocalIpv6Addrs(),o=s?Sm(r,i):r,a=this.peerId,c=[],l=[];a&&Array.isArray(this.config.bootstrapPeers)&&
this.config.bootstrapPeers.filter(h=>typeof h=="string"&&h.includes("/p2p/")).map(h=>Gn(h)).forEach(h=>{c.push(`${h}/p2p\
-circuit/p2p/${a}`),l.push(`${h}/p2p-circuit/webrtc/p2p/${a}`)});const u=[...o,...c,...l].map(h=>nu(h,a));return Array.from(
new Set(u))}getAnnounceAddrs(){return this._getAnnounceAddrs()}_getConnectionsForPeer(e){if(!this.libp2p?.getConnections)
return[];const t=this.libp2p.getConnections(e);return Array.isArray(t)?t:t&&typeof t.values=="function"?Array.from(t.values()).
flat():[]}_getPreferredConnectionMeta(e){const t=this._getConnectionsForPeer(e);return t.some(r=>$n(r?.remoteAddr)&&!kt(
r?.remoteAddr))?{via:"webrtc",signalingPath:"direct",mediaPath:"direct"}:t.some(r=>bm(r?.remoteAddr)&&!$n(r?.remoteAddr))?
{via:"direct",signalingPath:"direct",mediaPath:"direct"}:t.some(r=>pa(r?.remoteAddr))?{via:"relay-webrtc",signalingPath:"\
relay-scoped",mediaPath:"unknown"}:t.some(r=>eu(r?.remoteAddr))?{via:"relay",signalingPath:"relay-scoped",mediaPath:"tur\
n-relay"}:null}_getPreferredConnectionType(e){return this._getPreferredConnectionMeta(e)?.via||null}_clearRelayPruneTimer(e){
if(!e)return;const t=this.relayPruneTimers?.get?.(e);t&&(clearTimeout(t),this.relayPruneTimers.delete(e))}_scheduleRelayPrune(e,t){
if(!e||!Number.isFinite(t)||t<=0)return;this._clearRelayPruneTimer(e);const r=setTimeout(()=>{this.relayPruneTimers.delete(
e),this._maybePruneRelayConnections(e)},t);this.relayPruneTimers.set(e,r)}_maybePruneRelayConnections(e){if(!this.libp2p||
this.bootstrapPeerIds.has(e)||this.config.webrtc?.dropRelayOnDirect===!1)return;const t=this._getConnectionsForPeer(e);if(t.
length===0){this._clearRelayPruneTimer(e);return}const r=t.filter(a=>Ae(a)&&Yr(a?.remoteAddr));if(!(r.length>0)){this._clearRelayPruneTimer(
e);return}const i=t.filter(a=>Ae(a)&&kt(a?.remoteAddr));if(i.length===0){this._clearRelayPruneTimer(e);return}const o=Number.
isFinite(this.config.webrtc?.directUpgradeGraceMs)?Math.max(0,this.config.webrtc.directUpgradeGraceMs):_v;if(o>0){const a=Date.
now(),c=r.map(l=>this._getDirectStableSince(e,l)).filter(l=>Number.isFinite(l));if(c.length>0){const l=a-Math.min(...c);
if(l<o){this._scheduleRelayPrune(e,o-l);return}}}this._clearRelayPruneTimer(e),i.forEach(a=>{if(a?.status&&a.status!=="o\
pen")return;const c=this._getPeerConnectionRecovery().protectionMs(a);if(c>0){this._scheduleRelayPrune(e,c);return}this.
_retireIdleConnection(a,"direct-upgrade")||this._scheduleRelayPrune(e,1e3)})}_logPubsubStatus(e){if(!this.libp2p?.services?.
pubsub||!Ud)return;const t=this.libp2p.services.pubsub,r=typeof t.getPeers=="function"?t.getPeers():[],s=typeof t.getSubscribers==
"function"?t.getSubscribers(this.config.presenceTopic):[];Array.isArray(r)&&r.length===0&&H(`[NetworkManager] Pubsub has\
 no peers (${e})`),Array.isArray(s)&&s.length===0&&H(`[NetworkManager] No subscribers on presence topic (${e})`),this._getAnnounceAddrs().
length===0&&H(`[NetworkManager] No announce addrs available (${e})`)}_rememberPeerAddresses(e,t){if(!Array.isArray(t)||t.
length===0||(this._rememberDialTargets(e,t),!this.libp2p?.peerStore?.merge))return;let r;try{r=Z(e)}catch{return}const s=t.
map(Yo).filter(Boolean);s.length!==0&&this.libp2p.peerStore.merge(r,{multiaddrs:s}).catch(()=>{})}_rememberDialTargets(e,t){
if(!e||!Array.isArray(t)||t.length===0)return;const r=Date.now(),s=this.peerDialAddrCache.get(e)||{addrs:new Set,updatedAt:r};
let i=!1;t.forEach(o=>{const a=nu(_t(o),e);if(!a)return;const c=Yo(a);if(c){const l=c.toString();s.addrs.has(l)||(s.addrs.
add(l),i=!0)}}),!(!i&&!this.peerDialAddrCache.has(e))&&(s.updatedAt=r,this.peerDialAddrCache.set(e,s),this._pruneRememberedDialTargets(
r))}_getRememberedDialTargets(e,t=Date.now()){const r=this.peerDialAddrCache.get(e);return!r||!(r.addrs instanceof Set)?
[]:t-(r.updatedAt||0)>gm?(this.peerDialAddrCache.delete(e),[]):Array.from(r.addrs).map(s=>Yo(s)).filter(Boolean)}_pruneRememberedDialTargets(e=Date.
now()){for(const[t,r]of this.peerDialAddrCache.entries())e-(r?.updatedAt||0)>gm&&this.peerDialAddrCache.delete(t)}}const qV=Object.
freeze(Object.defineProperty({__proto__:null,NetworkManager:F7,resolveApplicationPrivateKey:Tv},Symbol.toStringTag,{value:"\
Module"}));export{Rh as A,og as B,wz as C,WF as D,T1 as L,GM as M,qV as N,Fh as P,hb as Q,ue as T,Fx as a,Qt as b,Si as c,hp as d,Ln as e,
Vr as f,Gm as g,rt as h,wb as i,e6 as j,hV as k,pw as l,t3 as m,bu as n,vb as o,UT as p,jm as q,ll as r,B7 as s,fp as t,
Zk as u,sg as v,J4 as w,Z4 as x,CL as y,aF as z};
