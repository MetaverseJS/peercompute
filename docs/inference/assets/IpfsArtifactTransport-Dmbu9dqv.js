import{b3 as If,z as bp,b4 as yp,q as Po,b5 as Kl,B as pp,b6 as wp,p as Mn,r as mp,A as vp,b7 as Bf,a1 as L,b8 as Pa,I as B,
a5 as Lf,a4 as Ep,H as Oc,y as Zt,b9 as Gi,x as Wi,D as qi,w as Rc,ba as Ap,a2 as xp,N as Df,K as rt,G as Nf,bb as Uf,bc as Sp,
bd as kp,F as $p,be as To,bf as Xr,bg as Cp,ah as Ip,ac as zl,an as Bp,av as Mo}from"./main-BVBDmgKD.js";import{h as Lp,
T as Ji,c as Hl,Q as Xi,f as _f,P as Dp,s as Yi,d as Pf,t as Np,i as Tf,p as Qi,a as Up,b as Mf,e as _p,r as vs,g as Te,
j as ts,k as or,l as K,m as Of,n as Pp,u as Tp,o as Mp,q as Op,v as Rp,w as Fp,x as Vp,y as Rf,z as Kp,A as Zi,M as zp,B as jl,
C as Es,D as Hp,E as jp,F as Gp,L as Wp,G as Gl,H as Ff,I as qp,J as Jp,K as Xp,N as Yp,O as Qp,R as Zp}from"./NetworkManager-CpE6E1XL.js";
import"./index-L3PMMKML.js";function Vf(r,e,t,n){bp(r);const s=yp({dkLen:32,asyncTick:10},n),{c:i,dkLen:o,asyncTick:a}=s;
if(Po(i,"c"),Po(o,"dkLen"),Po(a,"asyncTick"),i<1)throw new Error("iterations (c) must be >= 1");const c=Kl(e,"password"),
l=Kl(t,"salt"),u=new Uint8Array(o),h=Lp.create(r,c),d=h._cloneInto().update(l);return{c:i,dkLen:o,asyncTick:a,DK:u,PRF:h,
PRFSalt:d}}function Kf(r,e,t,n,s){return r.destroy(),e.destroy(),n&&n.destroy(),pp(s),t}function ew(r,e,t,n){const{c:s,dkLen:i,
DK:o,PRF:a,PRFSalt:c}=Vf(r,e,t,n);let l;const u=new Uint8Array(4),h=If(u),d=new Uint8Array(a.outputLen);for(let b=1,k=0;k<
i;b++,k+=a.outputLen){const C=o.subarray(k,k+a.outputLen);h.setInt32(0,b,!1),(l=c._cloneInto(l)).update(u).digestInto(d),
C.set(d.subarray(0,C.length));for(let $=1;$<s;$++){a._cloneInto(l).update(d).digestInto(d);for(let f=0;f<C.length;f++)C[f]^=
d[f]}}return Kf(a,c,o,l,d)}async function zf(r,e,t,n){const{c:s,dkLen:i,asyncTick:o,DK:a,PRF:c,PRFSalt:l}=Vf(r,e,t,n);let u;
const h=new Uint8Array(4),d=If(h),b=new Uint8Array(c.outputLen);for(let k=1,C=0;C<i;k++,C+=c.outputLen){const $=a.subarray(
C,C+c.outputLen);d.setInt32(0,k,!1),(u=l._cloneInto(u)).update(h).digestInto(b),$.set(b.subarray(0,$.length)),await wp(s-
1,o,()=>{c._cloneInto(u).update(b).digestInto(b);for(let f=0;f<$.length;f++)$[f]^=b[f]})}return Kf(c,l,a,u,b)}function tw(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
function _r(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return On(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return On(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function rw(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}
const Wl=4096;function nw(r){const e=r.length;if(e<=Wl)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)
t+=String.fromCharCode.apply(String,r.subarray(n,n+=Wl));return t}function sw(r){return r?.buffer instanceof ArrayBuffer}
function On(r){return sw(r)?r:r.slice()}function iw(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,
p=0,m=f.length;p!==m&&f[p]===0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==
0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-
A;x!==E&&y[x]===0;)x++;for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.
length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&
S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){
for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var ow=iw,aw=ow;let cw=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},lw=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Hf(this,e)}},
uw=class{decoders;constructor(e){this.decoders=e}or(e){return Hf(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Hf(r,e){return new uw({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let hw=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new cw(e,t,n),this.decoder=new lw(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function eo({name:r,prefix:e,encode:t,decode:n}){return new hw(r,e,t,
n)}function rs({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=aw(t,r,n);return eo({prefix:e,
name:r,encode:s,decode:o=>_r(i(o))})}function fw(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function dw(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function gw(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function q({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=gw(n,s);return eo(
{prefix:e,name:r,encode(o){return dw(o,n,t)},decode(o){return fw(o,i,t,r)}})}const Sn=q({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),bw=q({prefix:"B",name:"base32upper",alphabet:"ABCDE\
FGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),yw=q({prefix:"c",name:"base32pad",alphabet:"abcdefghijkl\
mnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),pw=q({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLM\
NOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),ww=q({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghi\
jklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),mw=q({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJK\
LMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),vw=q({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmno\
pqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Ew=q({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLM\
NOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Aw=q({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h76\
9",bitsPerChar:5}),xw=Object.freeze(Object.defineProperty({__proto__:null,base32:Sn,base32hex:ww,base32hexpad:vw,base32hexpadupper:Ew,
base32hexupper:mw,base32pad:yw,base32padupper:pw,base32upper:bw,base32z:Aw},Symbol.toStringTag,{value:"Module"})),kn=rs(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),Sw=rs({prefix:"K",name:"b\
ase36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),kw=Object.freeze(Object.defineProperty(
{__proto__:null,base36:kn,base36upper:Sw},Symbol.toStringTag,{value:"Module"})),We=rs({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),$w=rs({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Cw=Object.freeze(Object.defineProperty({__proto__:null,base58btc:We,
base58flickr:$w},Symbol.toStringTag,{value:"Module"}));var Iw=jf,ql=128,Bw=-128,Lw=Math.pow(2,31);function jf(r,e,t){e=e||
[],t=t||0;for(var n=t;r>=Lw;)e[t++]=r&255|ql,r/=128;for(;r&Bw;)e[t++]=r&255|ql,r>>>=7;return e[t]=r|0,jf.bytes=t-n+1,e}var Dw=Ta,
Nw=128,Jl=127;function Ta(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Ta.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Jl)<<s:(o&Jl)*Math.pow(2,s),s+=7}while(o>=Nw);return Ta.bytes=i-n,t}var Uw=Math.pow(
2,7),_w=Math.pow(2,14),Pw=Math.pow(2,21),Tw=Math.pow(2,28),Mw=Math.pow(2,35),Ow=Math.pow(2,42),Rw=Math.pow(2,49),Fw=Math.
pow(2,56),Vw=Math.pow(2,63),Kw=function(r){return r<Uw?1:r<_w?2:r<Pw?3:r<Tw?4:r<Mw?5:r<Ow?6:r<Rw?7:r<Fw?8:r<Vw?9:10},zw={
encode:Iw,decode:Dw,encodingLength:Kw},oi=zw;function Ma(r,e=0){const t=oi.decode(r,e),n=oi.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function ai(r,e,t=0){return oi.encode(r,e,t),e}function ci(r){return oi.encodingLength(r)}function Fc(r,e){const t=e.
byteLength,n=ci(r),s=n+ci(t),i=new Uint8Array(s+t);return ai(r,i,0),ai(t,i,n),i.set(e,s),new Vc(r,t,e,i)}function Hw(r){
const e=_r(r),[t,n]=Ma(e),[s,i]=Ma(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Vc(t,s,o,e)}function jw(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&tw(r.bytes,t.bytes)}}let Vc=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
On(n),this.bytes=On(s)}};function Xl(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return Ww(t,Oa(r),e??We.encoder);default:
return qw(t,Oa(r),e??Sn.encoder)}}const Yl=new WeakMap;function Oa(r){const e=Yl.get(r);if(e==null){const t=new Map;return Yl.
set(r,t),t}return e}let Kc=class te{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=On(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Yr)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==Jw)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return te.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=Fc(e,
t);return te.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return te.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&jw(e.multihash,n.multihash)}toString(e){return Xl(this,e)}toJSON(){return{"/":Xl(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof te)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new te(n,s,i,o??Ql(n,s,i.bytes))}else if(t[Xw]===!0){const{version:n,
multihash:s,code:i}=t,o=Hw(s);return te.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Yr)throw new Error(`Version 0 CID must use dag-pb (code: ${Yr}) block encoding`);return new te(e,t,n,n.bytes)}case 1:{
const s=Ql(e,t,n.bytes);return new te(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return te.
create(0,Yr,e)}static createV1(e,t){return te.create(1,e,t)}static decode(e){const[t,n]=te.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=te.inspectBytes(e),n=t.size-t.multihashSize,
s=_r(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Vc(t.multihashCode,t.digestSize,i,s);return[t.version===0?te.createV0(o):te.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Ma(e.subarray(t));return t+=d,h};let s=n(),
i=Yr;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=Gw(e,t),
i=te.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Oa(
i).set(n,e),i}};function Gw(r,e){switch(r[0]){case"Q":{const t=e??We;return[We.prefix,t.decode(`${We.prefix}${r}`)]}case We.
prefix:{const t=e??We;return[We.prefix,t.decode(r)]}case Sn.prefix:{const t=e??Sn;return[Sn.prefix,t.decode(r)]}case kn.
prefix:{const t=e??kn;return[kn.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function Ww(r,e,t){const{prefix:n}=t;if(n!==
We.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function qw(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const Yr=112,Jw=18;function Ql(r,e,t){const n=ci(r),s=n+ci(e),i=new Uint8Array(s+t.
byteLength);return ai(r,i,0),ai(e,i,n),i.set(t,s),i}const Xw=Symbol.for("@ipld/js-cid/CID"),Yw=20;function Qw({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new Zw(r,e,t,n,s)}let Zw=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??Yw,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Zl(n,this.code,t?.truncate):n.then(s=>Zl(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Zl(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Fc(e,r)}const e0=q({prefix:"m",name:"base64",alphabet:"ABC\
DEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),t0=q({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),N=q({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),r0=q({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),n0=Object.freeze(Object.defineProperty(
{__proto__:null,base64:e0,base64pad:t0,base64url:N,base64urlpad:r0},Symbol.toStringTag,{value:"Module"})),Gf=0,s0="ident\
ity",Wf=_r;function i0(r,e){if(e?.truncate!=null&&e.truncate!==r.byteLength){if(e.truncate<0||e.truncate>r.byteLength)throw new Error(
`Invalid truncate option, must be less than or equal to ${r.byteLength}`);r=r.subarray(0,e.truncate)}return Fc(Gf,Wf(r))}
const qf={code:Gf,name:s0,encode:Wf,digest:i0};function St(r=0){return new Uint8Array(r)}function ar(r=0){return new Uint8Array(
r)}function o0(r){return r?.buffer instanceof ArrayBuffer}function a0(r){if(o0(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function li(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=ar(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return a0(t)}function c0(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<
r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}const Jf=Symbol.for("@achingbrain/uint8arraylist");function eu(r,e){if(e==
null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{
buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}function As(r){return!!r?.[Jf]}let Je=class qs{bufs;length;[Jf]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.
bufs.push(n);else if(As(n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(As(n))t+=n.byteLength,
this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=eu(this.bufs,e);return t.buf[t.index]}set(e,t){const n=eu(this.bufs,e);n.buf[n.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(As(e))for(let n=0;n<e.length;n++)this.set(
t+n,e.get(n));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return li(n,s)}subarray(e,t){
const{bufs:n,length:s}=this._subList(e,t);return n.length===1?n[0]:li(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(
e,t),i=new qs;return i.length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}
const h=e-a;n.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){
if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!As(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=n.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const b=this.get(h+d);if(n[d]!==b){u=Math.max(1,d-a[b]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const n=ar(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=St(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=St(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=St(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const n=ar(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(
0,t),this.write(n,e)}getUint16(e,t){const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).
getUint16(0,t)}setUint16(e,t,n){const s=St(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(
s,e)}getUint32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){
const s=St(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.
subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=St(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=St(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=St(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof qs)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!c0(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const n=new qs;return n.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};function l0(r){return r.buffer instanceof
ArrayBuffer}function Xe(r){return l0(r)?r:r.slice()}const u0=parseInt("11111",2),Ra=parseInt("10000000",2),h0=parseInt("\
01111111",2),tu={0:Qr,1:Qr,2:f0,3:b0,4:y0,5:g0,6:d0,16:Qr,22:Qr,48:Qr};function Rt(r,e={offset:0}){const t=r[e.offset]&u0;
if(e.offset++,tu[t]!=null)return tu[t](r,e);throw new Error("No decoder for tag 0x"+t.toString(16).padStart(2,"0"))}function ns(r,e){
let t=0;if((r[e.offset]&Ra)===Ra){const n=r[e.offset]&h0;let s="0x";e.offset++;for(let i=0;i<n;i++,e.offset++)s+=r[e.offset].
toString(16).padStart(2,"0");t=parseInt(s,16)}else t=r[e.offset],e.offset++;return t}function Qr(r,e){ns(r,e);const t=[];
for(;!(e.offset>=r.byteLength);){const n=Rt(r,e);if(n===null)break;t.push(n)}return t}function f0(r,e){const t=ns(r,e),n=e.
offset,s=e.offset+t,i=[];for(let o=n;o<s;o++)o===n&&r[o]===0||i.push(r[o]);return e.offset+=t,Uint8Array.from(i)}function d0(r,e){
const t=ns(r,e),n=e.offset+t,s=r[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-40):(i=2,o=s-80);let a=`${i}\
.${o}`,c=[];for(;e.offset<n;){const l=r[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();let u=0;for(let h=0;h<c.
length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function g0(r,e){return e.offset++,null}function b0(r,e){const t=ns(r,
e),n=r[e.offset];e.offset++;const s=r.subarray(e.offset,e.offset+t-1);if(e.offset+=t,n!==0)throw new Error("Unused bits \
in bit string is unimplemented");return s}function y0(r,e){const t=ns(r,e),n=r.subarray(e.offset,e.offset+t);return e.offset+=
t,n}function p0(r){let e=r.toString(16);e.length%2===1&&(e="0"+e);const t=new Je;for(let n=0;n<e.length;n+=2)t.append(Uint8Array.
from([parseInt(`${e[n]}${e[n+1]}`,16)]));return t}function to(r){if(r.byteLength<128)return Uint8Array.from([r.byteLength]);
const e=p0(r.byteLength);return new Je(Uint8Array.from([e.byteLength|Ra]),e)}function ke(r){const e=new Je,t=128;return(r.
subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(r),new Je(Uint8Array.from([2]),to(e),e)}function zc(r){const e=Uint8Array.
from([0]),t=new Je(e,r);return new Je(Uint8Array.from([3]),to(t),t)}function w0(r){return new Je(Uint8Array.from([4]),to(
r),r)}function bt(r,e=48){const t=new Je;for(const n of r)t.append(Xe(n.subarray()));return new Je(Uint8Array.from([e]),
to(t),t)}let V=class extends Error{static name="InvalidParametersError";name="InvalidParametersError"};const m0=Math.pow(
2,7),v0=Math.pow(2,14),E0=Math.pow(2,21),Xf=Math.pow(2,28),Yf=Math.pow(2,35),Qf=Math.pow(2,42),Zf=Math.pow(2,49),we=128,
kt=127;function Hc(r){if(r<m0)return 1;if(r<v0)return 2;if(r<E0)return 3;if(r<Xf)return 4;if(r<Yf)return 5;if(r<Qf)return 6;
if(r<Zf)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode vari\
nt");return 8}function A0(r,e,t=0){switch(Hc(r)){case 8:e[t++]=r&255|we,r/=128;case 7:e[t++]=r&255|we,r/=128;case 6:e[t++]=
r&255|we,r/=128;case 5:e[t++]=r&255|we,r/=128;case 4:e[t++]=r&255|we,r>>>=7;case 3:e[t++]=r&255|we,r>>>=7;case 2:e[t++]=
r&255|we,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreachable")}return e}function x0(r,e){let t=r[e],
n=0;if(n+=t&kt,t<we||(t=r[e+1],n+=(t&kt)<<7,t<we)||(t=r[e+2],n+=(t&kt)<<14,t<we)||(t=r[e+3],n+=(t&kt)<<21,t<we)||(t=r[e+
4],n+=(t&kt)*Xf,t<we)||(t=r[e+5],n+=(t&kt)*Yf,t<we)||(t=r[e+6],n+=(t&kt)*Qf,t<we)||(t=r[e+7],n+=(t&kt)*Zf,t<we))return n;
throw new RangeError("Could not decode varint")}const jc=new Float32Array([-0]),Ut=new Uint8Array(jc.buffer);function S0(r,e,t){
jc[0]=r,e[t]=Ut[0],e[t+1]=Ut[1],e[t+2]=Ut[2],e[t+3]=Ut[3]}function k0(r,e){return Ut[0]=r[e],Ut[1]=r[e+1],Ut[2]=r[e+2],Ut[3]=
r[e+3],jc[0]}const Gc=new Float64Array([-0]),ce=new Uint8Array(Gc.buffer);function $0(r,e,t){Gc[0]=r,e[t]=ce[0],e[t+1]=ce[1],
e[t+2]=ce[2],e[t+3]=ce[3],e[t+4]=ce[4],e[t+5]=ce[5],e[t+6]=ce[6],e[t+7]=ce[7]}function C0(r,e){return ce[0]=r[e],ce[1]=r[e+
1],ce[2]=r[e+2],ce[3]=r[e+3],ce[4]=r[e+4],ce[5]=r[e+5],ce[6]=r[e+6],ce[7]=r[e+7],Gc[0]}const I0=BigInt(Number.MAX_SAFE_INTEGER),
B0=BigInt(Number.MIN_SAFE_INTEGER);let at=class Gt{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&
this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.
hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+
1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===
0n)return er;if(e<I0&&e>B0)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let n=e>>32n,s=e-(n<<32n);return t&&
(n=~n|0n,s=~s|0n,++s>ru&&(s=0n,++n>ru&&(n=0n))),new Gt(Number(s),Number(n))}static fromNumber(e){if(e===0)return er;const t=e<
0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&(n=0,++s>4294967295&&(s=0))),
new Gt(n,s)}static from(e){return typeof e=="number"?Gt.fromNumber(e):typeof e=="bigint"?Gt.fromBigInt(e):typeof e=="str\
ing"?Gt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Gt(e.low>>>0,e.high>>>0):er}};const er=new at(0,0);er.toBigInt=
function(){return 0n};er.zzEncode=er.zzDecode=function(){return this};er.length=function(){return 1};const ru=4294967296n;
function L0(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function D0(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function ed(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Ke(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function xs(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}let N0=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Xe(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Ke(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Ke(this,4);return xs(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Ke(
this,4);return xs(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Ke(this,4);const e=k0(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Ke(this,4);const e=C0(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Ke(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return D0(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Ke(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Ke(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new at(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Ke(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Ke(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Ke(this,8);const e=xs(this.buf,this.pos+=4),t=xs(this.buf,this.pos+=4);return new at(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=x0(this.buf,this.pos);
return this.pos+=Hc(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function td(r){return new N0(r instanceof Uint8Array?
r:r.subarray())}function rd(r,e,t){const n=td(r);return e.decode(n,void 0,t)}const U0=rs({prefix:"9",name:"base10",alphabet:"\
0123456789"}),_0=Object.freeze(Object.defineProperty({__proto__:null,base10:U0},Symbol.toStringTag,{value:"Module"})),P0=q(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),T0=q({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),M0=Object.freeze(Object.defineProperty({__proto__:null,
base16:P0,base16upper:T0},Symbol.toStringTag,{value:"Module"})),O0=q({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
R0=Object.freeze(Object.defineProperty({__proto__:null,base2:O0},Symbol.toStringTag,{value:"Module"})),nd=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),F0=nd.reduce((r,e,t)=>(r[t]=e,r),[]),V0=nd.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function K0(r){return r.reduce((e,t)=>(e+=F0[t],e),"")}function z0(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=V0[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const H0=eo({prefix:"🚀",name:"\
base256emoji",encode:K0,decode:z0}),j0=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:H0},Symbol.toStringTag,
{value:"Module"})),G0=q({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),W0=Object.freeze(Object.defineProperty(
{__proto__:null,base8:G0},Symbol.toStringTag,{value:"Module"})),q0=eo({prefix:"\0",name:"identity",encode:r=>nw(_r(r)),decode:r=>_r(
rw(r))}),J0=Object.freeze(Object.defineProperty({__proto__:null,identity:q0},Symbol.toStringTag,{value:"Module"}));new TextEncoder;
new TextDecoder;function X0(r){return async e=>new Uint8Array(await crypto.subtle.digest(r,e))}const Y0=Qw({name:"sha2-2\
56",code:18,encode:X0("SHA-256")}),nu={...J0,...R0,...W0,..._0,...M0,...xw,...kw,...Cw,...n0,...j0};function sd(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const su=sd("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Oo=sd("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=ar(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),Q0={utf8:su,"utf-8":su,hex:nu.base16,latin1:Oo,ascii:Oo,binary:Oo,...nu};function Z0(r,e="utf8"){const t=Q0[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function em(r){let n,
s=8192;return function(o){if(o<1||o>4096)return ar(o);s+o>8192&&(n=ar(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==
0&&(s=(s|7)+1),a}}let pn=class{fn;len;next;val;constructor(e,t,n){this.fn=e,this.len=t,this.next=void 0,this.val=n}};function Ro(){}
let tm=class{head;tail;len;next;constructor(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const rm=em();
function nm(r){return globalThis.Buffer!=null?ar(r):rm(r)}let Fa=class{len;head;tail;states;constructor(){this.len=0,this.
head=new pn(Ro,0,0),this.tail=this.head,this.states=null}_push(e,t,n){return this.tail=this.tail.next=new pn(e,t,n),this.
len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new im((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?
4:5,e)).len,this}int32(e){return e<0?this._push(Ss,10,at.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<
1^e>>31)>>>0)}uint64(e){const t=at.fromBigInt(e);return this._push(Ss,t.length(),t)}uint64Number(e){return this._push(A0,
Hc(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(
e)}int64String(e){return this.uint64String(e)}sint64(e){const t=at.fromBigInt(e).zzEncode();return this._push(Ss,t.length(),
t)}sint64Number(e){const t=at.fromNumber(e).zzEncode();return this._push(Ss,t.length(),t)}sint64String(e){return this.sint64(
BigInt(e))}bool(e){return this._push(Fo,1,e?1:0)}fixed32(e){return this._push(Zr,4,e>>>0)}sfixed32(e){return this.fixed32(
e)}fixed64(e){const t=at.fromBigInt(e);return this._push(Zr,4,t.lo)._push(Zr,4,t.hi)}fixed64Number(e){const t=at.fromNumber(
e);return this._push(Zr,4,t.lo)._push(Zr,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.
fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this.
_push(S0,4,e)}double(e){return this._push($0,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(Fo,1,0):this.uint32(
t)._push(om,t,e)}string(e){const t=L0(e);return t!==0?this.uint32(t)._push(ed,t,e):this._push(Fo,1,0)}fork(){return this.
states=new tm(this),this.head=this.tail=new pn(Ro,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.
states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new pn(
Ro,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().uint32(n),n!==0&&(this.tail.
next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=nm(this.len);let n=0;for(;e!=null;)e.fn(
e.val,t,n),n+=e.len,e=e.next;return t}};function Fo(r,e,t){e[t]=r&255}function sm(r,e,t){for(;r>127;)e[t++]=r&127|128,r>>>=
7;e[t]=r}let im=class extends pn{next;constructor(e,t){super(sm,e,t),this.next=void 0}};function Ss(r,e,t){for(;r.hi!==0;)
e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>7;e[t++]=r.lo}
function Zr(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function om(r,e,t){e.set(r,t)}globalThis.
Buffer!=null&&(Fa.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(am,e,r),this},Fa.
prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(cm,e,r),this});
function am(r,e,t){e.set(r,t)}function cm(r,e,t){r.length<40?ed(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):e.set(Z0(r),t)}
function lm(){return new Fa}function id(r,e){const t=lm();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}function*od(r,e,t){
const n=td(r);yield*e.stream(n,void 0,".",t)}const ad={VARINT:0,LENGTH_DELIMITED:2};function cd(r,e,t,n,s){return{name:r,
type:e,encode:t,decode:n,stream:s}}function um(r){function e(i){if(r[i.toString()]==null)throw new Error("Invalid enum v\
alue");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(a)},s=function*(o,a){};
return cd("enum",ad.VARINT,t,n,s)}function ld(r,e,t){return cd("message",ad.LENGTH_DELIMITED,r,e,t)}var ui;(function(r){
r.RSA="RSA",r.Ed25519="Ed25519",r.secp256k1="secp256k1",r.ECDSA="ECDSA"})(ui||(ui={}));var Va;(function(r){r[r.RSA=0]="R\
SA",r[r.Ed25519=1]="Ed25519",r[r.secp256k1=2]="secp256k1",r[r.ECDSA=3]="ECDSA"})(Va||(Va={}));(function(r){r.codec=()=>um(
Va)})(ui||(ui={}));var nt;(function(r){let e;r.codec=()=>(e==null&&(e=ld((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.
Type!=null&&(o.uint32(8),o.int32(i.Type)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},
(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=i.int32();
break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.
len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:i.int32()};break}case 2:{
yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return id(i,r.codec())}
r.encode=t;function n(i,o){return rd(i,r.codec(),o)}r.decode=n;function s(i,o){return od(i,r.codec(),o)}r.stream=s})(nt||
(nt={}));var st;(function(r){let e;r.codec=()=>(e==null&&(e=ld((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&
(o.uint32(8),o.int32(i.Type)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{
const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=i.int32();break}case 2:{
c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.
pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:i.int32()};break}case 2:{yield{field:`${a}\
.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return id(i,r.codec())}r.encode=t;function n(i,o){
return rd(i,r.codec(),o)}r.decode=n;function s(i,o){return od(i,r.codec(),o)}r.stream=s})(st||(st={}));const hm=Uint8Array.
from([6,8,42,134,72,206,61,3,1,7]),fm=Uint8Array.from([6,5,43,129,4,0,34]),dm=Uint8Array.from([6,5,43,129,4,0,35]),ud={ext:!0,
kty:"EC",crv:"P-256"},hd={ext:!0,kty:"EC",crv:"P-384"},fd={ext:!0,kty:"EC",crv:"P-521"},Sr=32,kr=48,$r=66;let Vo=class{type="\
ECDSA";code=3;jwk;constructor(e){this.jwk=e}toMultihash(){return qf.digest(this.toProtobuf())}toCID(){return Kc.createV1(
114,this.toMultihash())}toString(){return We.encode(this.toMultihash().bytes).substring(1)}toJWK(){return JSON.parse(JSON.
stringify(this.jwk))}toProtobuf(){return nt.encode({Type:this.code,Data:mm(this.jwk)})}async verify(e,t,n){const s=await crypto.
subtle.importKey("jwk",this.jwk,{name:"ECDSA",namedCurve:this.jwk.crv??"P-256"},!1,["verify"]),i=await crypto.subtle.verify(
{name:"ECDSA",hash:{name:"SHA-256"}},s,Xe(t),Xe(e));return n?.signal?.throwIfAborted(),i}},iu=class{type="ECDSA";code=3;jwk;publicKey;constructor(e,t){
this.jwk=e,this.publicKey=t}toProtobuf(){return st.encode({Type:this.code,Data:vm(this.jwk)})}toJWK(){return JSON.parse(
JSON.stringify(this.jwk))}async sign(e,t){const n=await crypto.subtle.importKey("jwk",this.jwk,{name:"ECDSA",namedCurve:this.
jwk.crv??"P-256"},!0,["sign"]),s=await crypto.subtle.sign({name:"ECDSA",hash:{name:"SHA-256"}},n,Xe(e));return t?.signal?.
throwIfAborted(),new Uint8Array(s,0,s.byteLength)}};class gm{type="ECDSA";code=3;async generatePrivateKey(e){const t=e?.
curve??"P-256",n=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:t},!0,["sign","verify"]),s=await crypto.subtle.
exportKey("jwk",n.privateKey),i=await crypto.subtle.exportKey("jwk",n.publicKey);return e?.signal?.throwIfAborted(),new iu(
s,new Vo(i))}async publicKeyFromProtobuf(e,t){const n=nt.decode(e);if(n.Data==null)throw new V("Data field was missing f\
rom protobuf");if(n.Type!==this.code)throw new V("Incorrect Type field in protobuf");t?.signal?.throwIfAborted();const s=wm(
n.Data);return new Vo(s)}async privateKeyFromProtobuf(e,t){const n=st.decode(e);if(n.Data==null)throw new V("Data field \
was missing from protobuf");if(n.Type!==this.code)throw new V("Incorrect Type field in protobuf");const s=pm(n.Data),i=ym(
s);return t?.signal?.throwIfAborted(),new iu(s,new Vo(i))}}function bm(){return new gm}function ym(r){return{crv:r.crv,ext:!0,
key_ops:["verify"],kty:"EC",x:r.x,y:r.y}}function pm(r){const e=Rt(r),t=e[1],n=N.baseEncode(t),s=e[2][1][0],i=1;let o,a;
if(t.byteLength===Sr)return o=N.baseEncode(s.subarray(i,i+Sr)),a=N.baseEncode(s.subarray(i+Sr)),{...ud,key_ops:["sign"],
d:n,x:o,y:a};if(t.byteLength===kr)return o=N.baseEncode(s.subarray(i,i+kr)),a=N.baseEncode(s.subarray(i+kr)),{...hd,key_ops:[
"sign"],d:n,x:o,y:a};if(t.byteLength===$r)return o=N.baseEncode(s.subarray(i,i+$r)),a=N.baseEncode(s.subarray(i+$r)),{...fd,
key_ops:["sign"],d:n,x:o,y:a};throw new V(`Private key length was wrong length, got ${t.byteLength}, expected 32, 48 or \
66`)}function wm(r){const t=Rt(r)[1][1][0],n=1;let s,i;if(t.byteLength===Sr*2+1)return s=N.baseEncode(t.subarray(n,n+Sr)),
i=N.baseEncode(t.subarray(n+Sr)),{...ud,key_ops:["verify"],x:s,y:i};if(t.byteLength===kr*2+1)return s=N.baseEncode(t.subarray(
n,n+kr)),i=N.baseEncode(t.subarray(n+kr)),{...hd,key_ops:["verify"],x:s,y:i};if(t.byteLength===$r*2+1)return s=N.baseEncode(
t.subarray(n,n+$r)),i=N.baseEncode(t.subarray(n+$r)),{...fd,key_ops:["verify"],x:s,y:i};throw new V(`coordinates were wr\
ong length, got ${t.byteLength}, expected 65, 97 or 133`)}function mm(r){return bt([ke(Uint8Array.from([1])),bt([dd(r.crv)],
160),bt([zc(new Je(Uint8Array.from([4]),N.baseDecode(r.x??""),N.baseDecode(r.y??"")))],161)]).subarray()}function vm(r){
return bt([ke(Uint8Array.from([1])),w0(N.baseDecode(r.d??"")),bt([dd(r.crv)],160),bt([zc(new Je(Uint8Array.from([4]),N.baseDecode(
r.x??""),N.baseDecode(r.y??"")))],161)]).subarray()}function dd(r){if(r==="P-256")return hm;if(r==="P-384")return fm;if(r===
"P-521")return dm;throw new V(`Invalid curve ${r}`)}const Em=32;let Ko=class{type="Ed25519";code=1;jwk;constructor(e){this.
jwk=e}toMultihash(){return qf.digest(this.toProtobuf())}toCID(){return Kc.createV1(114,this.toMultihash())}toString(){return We.
encode(this.toMultihash().bytes).substring(1)}toJWK(){return JSON.parse(JSON.stringify(this.jwk))}toProtobuf(){return nt.
encode({Type:this.code,Data:N.baseDecode(this.jwk.x??"")})}async verify(e,t,n){const s=await crypto.subtle.importKey("jw\
k",this.jwk,{name:"Ed25519"},!1,["verify"]),i=await crypto.subtle.verify({name:"Ed25519"},s,Xe(t),Xe(e));return n?.signal?.
throwIfAborted(),i}},ou=class{type="Ed25519";code=1;jwk;publicKey;constructor(e,t){this.jwk=e,this.publicKey=t}toProtobuf(){
return st.encode({Type:this.code,Data:li([N.baseDecode(this.jwk.d??""),N.baseDecode(this.jwk.x??"")],64)})}toJWK(){return JSON.
parse(JSON.stringify(this.jwk))}async sign(e,t){const n=await crypto.subtle.importKey("jwk",this.jwk,{name:"Ed25519"},!0,
["sign"]),s=await crypto.subtle.sign({name:"Ed25519"},n,Xe(e));return t?.signal?.throwIfAborted(),new Uint8Array(s,0,s.byteLength)}};
class Am{type="Ed25519";code=1;async generatePrivateKey(e){const t=await crypto.subtle.generateKey("Ed25519",!0,["sign",
"verify"]),n=await crypto.subtle.exportKey("jwk",t.privateKey),s=await crypto.subtle.exportKey("jwk",t.publicKey);return e?.
signal?.throwIfAborted(),new ou(n,new Ko(s))}async publicKeyFromProtobuf(e,t){const n=nt.decode(e);if(n.Data==null)throw new V(
"Data field was missing from protobuf");if(n.Type!==this.code)throw new V("Incorrect Type field in protobuf");t?.signal?.
throwIfAborted();const s=Cm(n.Data);return new Ko(s)}async privateKeyFromProtobuf(e,t){const n=st.decode(e);if(n.Data==null)
throw new V("Data field was missing from protobuf");if(n.Type!==this.code)throw new V("Incorrect Type field in protobuf");
const s=await Sm(n.Data,t),i=$m(s);return new ou(s,new Ko(i))}}function xm(){return new Am}async function Sm(r,e){const t=r.
subarray(0,Em),n=km(t),s=await crypto.subtle.importKey("pkcs8",n,{name:"Ed25519"},!0,["sign"]),i=await crypto.subtle.exportKey(
"jwk",s);return e?.signal?.throwIfAborted(),i}const au=Uint8Array.from([48,46,2,1,0,48,5,6,3,43,101,112,4,34,4]);function km(r){
return li([au,Uint8Array.from([r.byteLength]),r],au.byteLength+1+r.byteLength)}function $m(r){return{alg:"Ed25519",crv:"\
Ed25519",ext:!0,key_ops:["verify"],kty:"OKP",x:r.x}}function Cm(r){return{alg:"Ed25519",crv:"Ed25519",ext:!0,key_ops:["v\
erify"],kty:"OKP",x:N.baseEncode(r)}}const Wc=8192;let zo=class{type="RSA";code=0;_raw;digest;jwk;constructor(e,t){if(yd(
e)>Wc)throw new V("Key size is too large");this.jwk=e,this.digest=t}toMultihash(){return this.digest}toCID(){return Kc.createV1(
114,this.toMultihash())}toString(){return this.toCID().toString(kn)}toProtobuf(){return _m(this.code,this.jwk)}toJWK(){return JSON.
parse(JSON.stringify(this.jwk))}async verify(e,t,n){const s=await crypto.subtle.importKey("jwk",this.jwk,{name:"RSASSA-P\
KCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]),i=await crypto.subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,Xe(t),Xe(e));
return n?.signal?.throwIfAborted(),i}},cu=class{type="RSA";code=0;publicKey;jwk;constructor(e,t){if(yd(e)>Wc)throw new V(
"Key size is too large");this.jwk=e,this.publicKey=t}toProtobuf(){return Pm(this.code,this.jwk)}toJWK(){return JSON.parse(
JSON.stringify(this.jwk))}async sign(e,t){const n=await crypto.subtle.importKey("jwk",this.jwk,{name:"RSASSA-PKCS1-v1_5",
hash:{name:"SHA-256"}},!1,["sign"]),s=await crypto.subtle.sign({name:"RSASSA-PKCS1-v1_5"},n,Xe(e));return t?.signal?.throwIfAborted(),
new Uint8Array(s,0,s.byteLength)}};class Im{type="RSA";code=0;async generatePrivateKey(e){const t=e?.bits??2048;if(t>Wc)
throw new V("Key size is too large");const n=await crypto.subtle.generateKey({name:"RSASSA-PKCS1-v1_5",modulusLength:t,publicExponent:new Uint8Array(
[1,0,1]),hash:{name:"SHA-256"}},!0,["sign","verify"]),s=await crypto.subtle.exportKey("jwk",n.privateKey),i=await crypto.
subtle.exportKey("jwk",n.publicKey),o=await Ho(s);return e?.signal?.throwIfAborted(),new cu(s,new zo(i,o))}async publicKeyFromProtobuf(e,t){
const n=nt.decode(e);if(n.Data==null)throw new V("Data field was missing from protobuf");if(n.Type!==this.code)throw new V(
"Incorrect Type field in protobuf");const s=Nm(n.Data),i=await Ho(s);return t?.signal?.throwIfAborted(),new zo(s,i)}async privateKeyFromProtobuf(e,t){
const n=st.decode(e);if(n.Data==null)throw new V("Data field was missing from protobuf");if(n.Type!==this.code)throw new V(
"Incorrect Type field in protobuf");const s=Rt(n.Data),i=Bm(s),o=Um(i),a=await Ho(o);return t?.signal?.throwIfAborted(),
new cu(i,new zo(o,a))}}function gd(){return new Im}function Bm(r){return{alg:"RS256",kty:"RSA",n:N.baseEncode(r[1]),e:N.
baseEncode(r[2]),ext:!0,key_ops:["sign"],d:N.baseEncode(r[3]),p:N.baseEncode(r[4]),q:N.baseEncode(r[5]),dp:N.baseEncode(
r[6]),dq:N.baseEncode(r[7]),qi:N.baseEncode(r[8])}}function Lm(r){if(r.n==null||r.e==null||r.d==null||r.p==null||r.q==null||
r.dp==null||r.dq==null||r.qi==null)throw new V("JWK was missing components");return bt([ke(Uint8Array.from([0])),ke(N.baseDecode(
r.n)),ke(N.baseDecode(r.e)),ke(N.baseDecode(r.d)),ke(N.baseDecode(r.p)),ke(N.baseDecode(r.q)),ke(N.baseDecode(r.dp)),ke(
N.baseDecode(r.dq)),ke(N.baseDecode(r.qi))]).subarray()}const Dm=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,1,1,5,
0]);function bd(r){if(r.n==null||r.e==null)throw new V("JWK public key was missing components");return bt([Dm,zc(bt([ke(
N.baseDecode(r.n)),ke(N.baseDecode(r.e))]))]).subarray()}function Nm(r){const e=Rt(r);if(e.length<2||e[0]?.[0]!=="1.2.84\
0.113549.1.1.1")throw new Error("PKIX certificate was invalid");const t=Rt(e[1]);return{kty:"RSA",n:N.baseEncode(t[0]),e:N.
baseEncode(t[1])}}function Um(r){return{key_ops:["verify"],ext:!0,alg:"RS256",kty:"RSA",n:r.n,e:"AQAB"}}function yd(r){if(r.
kty!=="RSA")throw new V("Invalid key type");if(r.n==null)throw new V("Invalid key modulus");return N.baseDecode(r.n).length*
8}async function Ho(r){const e=nt.encode({Type:0,Data:bd(r)});return Y0.digest(e)}function _m(r,e){return nt.encode({Type:r,
Data:bd(e)})}function Pm(r,e){return st.encode({Type:r,Data:Lm(e)})}const Tm=1,Mm=5,Om=100;class Rm extends Error{static name="\
InsufficientProvidersError";constructor(e="Insufficient providers found"){super(e),this.name="InsufficientProvidersError"}}
class ks extends Error{static name="NoRoutersAvailableError";constructor(e="No routers available"){super(e),this.name="N\
oRoutersAvailableError"}}class Fm extends Error{static name="UnknownHashAlgorithmError";constructor(e="Unknown hash algo\
rithm"){super(e),this.name="UnknownHashAlgorithmError"}}class Vm extends Error{static name="UnknownCodecError";constructor(e="\
Unknown codec"){super(e),this.name="UnknownCodecError"}}class Km extends Error{static name="UnknownCryptoError";name="Un\
knownCryptoError"}class zm extends Error{static name="NoEvictionError";name="NoEvictionError"}function Hm(r,e){if(r===e)
return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function qc(r){
if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Rn(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return Rn(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function jm(r){return r?.buffer instanceof ArrayBuffer}function Rn(r){return jm(r)?r:r.slice()}function Gm(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),
d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===0;)p++,
g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>
0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;for(var D=h.
repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.length-g)*d+
1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&S!==-1;S--,v++)
y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){for(var w=m-p;w!==
m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(f);if(g)return g;
throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var Wm=Gm,qm=Wm;let Jm=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Xm=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return pd(this,e)}},
Ym=class{decoders;constructor(e){this.decoders=e}or(e){return pd(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function pd(r,e){return new Ym({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let Qm=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new Jm(e,t,n),this.decoder=new Xm(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function wd({name:r,prefix:e,encode:t,decode:n}){return new Qm(r,e,t,
n)}function ro({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=qm(t,r,n);return wd({prefix:e,
name:r,encode:s,decode:o=>qc(i(o))})}function Zm(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function e2(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function t2(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Ne({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=t2(n,s);return wd(
{prefix:e,name:r,encode(o){return e2(o,n,t)},decode(o){return Zm(o,i,t,r)}})}const r2=Ne({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});Ne({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});Ne({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});Ne({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});class n2 extends Ji{initialPeerSearchComplete;requests;logName;log;logger;minProviders;maxProviders;providers;evictionFilter;initialProviders;cidPeerFilterSize;constructor(e,t){
super(),this.logName=t.name,this.logger=e.logger,this.log=e.logger.forComponent(this.logName),this.requests=new Map,this.
minProviders=t.minProviders??Tm,this.maxProviders=t.maxProviders??Mm,this.cidPeerFilterSize=t.cidPeerFilterSize??Om,this.
providers=[],this.evictionFilter=Hl(this.maxProviders),this.initialProviders=[...t.providers??[]]}async retrieve(e,t={}){
const n=r2.encode(e.multihash.bytes),s=this.requests.get(n);if(s!=null)return this.log("join existing request for %c",e),
s.observers++,s.promise;const i=Mn(),o={promise:i.promise,observers:1,queryFilter:Hl(this.cidPeerFilterSize)};this.requests.
set(n,o);let a=!1;this.initialPeerSearchComplete==null&&(a=!0,this.log=this.logger.forComponent(`${this.logName}:${e}`),
this.initialPeerSearchComplete=this.findProviders(e,this.minProviders,t));let c=!1;const l=new Xi({concurrency:this.maxProviders});
l.addEventListener("failure",d=>{if(d.detail.job.options.provider.fallback){this.log.error("error querying fallback prov\
ider %s - %e",d.detail.job.options.provider,d.detail.error);return}if(d.detail.error.name==="NoEvictionError"){this.log.
error("no-eviction error querying provider %s - %e",d.detail.job.options.provider,d.detail.error);return}this.log.error(
"error querying provider %s, evicting from session - %e",d.detail.job.options.provider,d.detail.error),this.evict(d.detail.
job.options.provider)}),l.addEventListener("success",d=>{c=!0,i.resolve(d.detail.result)}),l.addEventListener("idle",()=>{
if(c){this.log.trace("session idle, found block");return}if(t.signal?.aborted===!0){this.log.trace("session idle, signal\
 aborted");return}Promise.resolve().then(async()=>{this.log("no session peers had block for for %c, finding new provider\
s",e);for(let d=0;d<this.minProviders&&this.providers.length!==0;d++){const b=this.providers[Math.floor(Math.random()*this.
providers.length)];b.fallback||(this.log("evicting %s to make room for more providers",b),this.evict(b))}await this.findProviders(
e,this.minProviders,t),this.log("found new providers re-retrieving %c",e),this.requests.delete(n),i.resolve(await this.retrieve(
e,t))}).catch(d=>{this.log.error("could not find new providers for %c - %e",e,d),i.reject(d)})});const u=d=>{const b=this.
toFilterKey(d.detail);o.queryFilter.has(b)||(o.queryFilter.add(b),this.emitFoundProviderProgressEvent(e,d.detail,t),l.add(
async()=>this.queryProvider(e,d.detail,t),{provider:d.detail}).catch(k=>{t.signal?.aborted!==!0&&this.log.error("error r\
etrieving session block for %c - %e",e,k)}))};if(this.addEventListener("provider",u),a)try{await mp(this.initialPeerSearchComplete,
t.signal),a&&this.log("found initial session peers for %c",e)}catch(d){throw a&&this.log("failed to find initial session\
 peers for %c - %e",e,d),this.requests.delete(n),o.observers>1&&i.reject(d),d}Promise.all([...this.providers].filter(d=>{
const b=this.toFilterKey(d),k=o.queryFilter.has(b);return k||o.queryFilter.add(this.toFilterKey(d)),!k}).map(async d=>l.
add(async()=>this.queryProvider(e,d,t),{provider:d}))).catch(d=>{t.signal?.aborted!==!0&&this.log.error("error retrievin\
g session block for %c - %e",e,d)});const h=()=>{i.reject(new vp(t.signal?.reason??"Session aborted")),l.abort()};t.signal?.
addEventListener("abort",h);try{return await i.promise}finally{this.removeEventListener("provider",u),t.signal?.removeEventListener(
"abort",h),l.clear(),this.requests.delete(n)}}evict(e){this.evictionFilter.add(this.toFilterKey(e));const t=this.providers.
findIndex(n=>this.equals(n,e));t!==-1&&this.providers.splice(t,1)}isEvicted(e){return this.evictionFilter.has(this.toFilterKey(
e))}hasProvider(e){return!!(this.providers.find(t=>this.equals(t,e))!=null||this.isEvicted(e))}async addPeer(e,t){const n=await this.
convertToProvider(e,"manually-added",t);n==null||this.hasProvider(n)||(this.providers.push(n),this.safeDispatchEvent("pr\
ovider",{detail:n}))}async findProviders(e,t,n){const s=Mn();let i=0;return Promise.resolve().then(async()=>{this.log("f\
inding %d-%d new provider(s) for %c - %d initial providers",t,this.maxProviders,e,this.initialProviders.length);const o=this,
a=async function*(){for(;o.initialProviders.length>0;){const l=o.initialProviders.pop();if(l==null)continue;const u=await o.
convertToProvider(l,"manual",n);u!=null&&(yield u)}},c=async function*(){yield*a(),yield*o.findNewProviders(e,n)};for await(const l of c()){
if(this.providers.length===this.maxProviders||n.signal?.aborted===!0)break;if(!this.hasProvider(l)&&(this.log("found %d \
providers, %d in session",i,this.providers.length),this.providers.push(l),this.safeDispatchEvent("provider",{detail:l}),
i++,this.providers.length===t&&(this.log("session is ready with %d peer(s), new peers present",this.providers.length),s.
resolve()),this.providers.length===this.maxProviders)){this.log("found max session peers %d",this.providers.length);break}}
if(this.log("found %d new session peers while trying to find %d, %d in session",i,t,this.providers.length),this.providers.
length<t)throw new Rm(`Found ${i} of ${t} ${this.name} providers for ${e}, ${this.providers.length} in session after evi\
ctions`)}).catch(o=>{this.log.error("error searching routing for potential session peers for %c - %e",e,o),s.reject(o)}),
s.promise}}class s2 extends Error{static name="AlreadyPinnedError";name="AlreadyPinnedError"}class lu extends Error{static name="\
BlockPinnedError";name="BlockPinnedError"}class i2 extends Error{static name="InvalidDatastoreVersionError";name="Invali\
dDatastoreVersionError"}class hi extends Error{static name="InvalidConfigurationError";name="InvalidConfigurationError"}
class o2 extends AggregateError{static name="GetFailedError";name="GetFailedError"}class a2 extends AggregateError{static name="\
LoadBlockFailedError";name="LoadBlockFailedError"}class uu extends Error{static name="BlockNotFoundWhileOfflineError";name="\
BlockNotFoundWhileOfflineError"}const Js=Ne({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,
caseInsensitive:!0});Ne({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});
Ne({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"V",name:"bas\
e32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"t",name:"base32h\
expad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"T",name:"base32hexpad\
upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});Ne({prefix:"h",name:"base32z",alphabet:"\
ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const jo=ro({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijkl\
mnopqrstuvwxyz",caseInsensitive:!0});ro({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});
const Dt=ro({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ro({name:"\
base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var c2=md,hu=128,l2=-128,
u2=Math.pow(2,31);function md(r,e,t){e=e||[],t=t||0;for(var n=t;r>=u2;)e[t++]=r&255|hu,r/=128;for(;r&l2;)e[t++]=r&255|hu,
r>>>=7;return e[t]=r|0,md.bytes=t-n+1,e}var h2=Ka,f2=128,fu=127;function Ka(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{
if(i>=a)throw Ka.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&fu)<<s:(o&fu)*Math.pow(2,s),s+=7}while(o>=
f2);return Ka.bytes=i-n,t}var d2=Math.pow(2,7),g2=Math.pow(2,14),b2=Math.pow(2,21),y2=Math.pow(2,28),p2=Math.pow(2,35),w2=Math.
pow(2,42),m2=Math.pow(2,49),v2=Math.pow(2,56),E2=Math.pow(2,63),A2=function(r){return r<d2?1:r<g2?2:r<b2?3:r<y2?4:r<p2?5:
r<w2?6:r<m2?7:r<v2?8:r<E2?9:10},x2={encode:c2,decode:h2,encodingLength:A2},fi=x2;function za(r,e=0){const t=fi.decode(r,
e),n=fi.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("\
Invalid varint: not minimally encoded");return[t,n]}function di(r,e,t=0){return fi.encode(r,e,t),e}function gi(r){return fi.
encodingLength(r)}function S2(r,e){const t=e.byteLength,n=gi(r),s=n+gi(t),i=new Uint8Array(s+t);return di(r,i,0),di(t,i,
n),i.set(e,s),new Jc(r,t,e,i)}function k2(r){const e=qc(r),[t,n]=za(e),[s,i]=za(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new Jc(t,s,o,e)}function $2(r,e){if(r===e)return!0;{const t=e;return r.code===
t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&Hm(r.bytes,t.bytes)}}let Jc=class{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=Rn(n),this.bytes=Rn(s)}};function du(r,e){const{bytes:t,version:n}=r;switch(n){case 0:
return I2(t,Ha(r),e??Dt.encoder);default:return B2(t,Ha(r),e??Js.encoder)}}const gu=new WeakMap;function Ha(r){const e=gu.
get(r);if(e==null){const t=new Map;return gu.set(r,t),t}return e}let cr=class re{code;version;multihash;bytes;"/";constructor(e,t,n,s){
this.code=t,this.version=e,this.multihash=n,this.bytes=Rn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==en)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==L2)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return re.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,n=S2(e,t);return re.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return re.equals(this,e)}static equals(e,t){const n=t;return n!=
null&&e.code===n.code&&e.version===n.version&&$2(e.multihash,n.multihash)}toString(e){return du(this,e)}toJSON(){return{
"/":du(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof re)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:n,code:s,multihash:i,bytes:o}=t;return new re(n,s,i,o??bu(n,s,i.bytes))}else if(t[D2]===!0){const{
version:n,multihash:s,code:i}=t,o=k2(s);return re.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==en)throw new Error(`Version 0 CID must use dag-pb (code: ${en}) block encoding`);return new re(
e,t,n,n.bytes)}case 1:{const s=bu(e,t,n.bytes);return new re(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){
return re.create(0,en,e)}static createV1(e,t){return re.create(1,e,t)}static decode(e){const[t,n]=re.decodeFirst(e);if(n.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=re.inspectBytes(e),n=t.size-t.multihashSize,
s=qc(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Jc(t.multihashCode,t.digestSize,i,s);return[t.version===0?re.createV0(o):re.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=za(e.subarray(t));return t+=d,h};let s=n(),
i=en;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=C2(e,t),
i=re.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ha(
i).set(n,e),i}};function C2(r,e){switch(r[0]){case"Q":{const t=e??Dt;return[Dt.prefix,t.decode(`${Dt.prefix}${r}`)]}case Dt.
prefix:{const t=e??Dt;return[Dt.prefix,t.decode(r)]}case Js.prefix:{const t=e??Js;return[Js.prefix,t.decode(r)]}case jo.
prefix:{const t=e??jo;return[jo.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function I2(r,e,t){const{prefix:n}=t;if(n!==
Dt.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function B2(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const en=112,L2=18;function bu(r,e,t){const n=gi(r),s=n+gi(e),i=new Uint8Array(s+t.
byteLength);return di(r,i,0),di(e,i,n),i.set(t,s),i}const D2=Symbol.for("@ipld/js-cid/CID");function $s({enumerable:r=!0,
configurable:e=!1}={}){return{enumerable:r,configurable:e,writable:!1}}function*N2(r,e){if(e!=null&&typeof e=="object")if(Array.
isArray(e))for(const[t,n]of e.entries()){const s=[...r,t],i=cr.asCID(n);i!=null?yield[s.join("/"),i]:typeof n=="object"&&
(yield*ja(n,s))}else{const t=cr.asCID(e);t!=null?yield[r.join("/"),t]:yield*ja(e,r)}}function*ja(r,e){if(r==null||r instanceof
Uint8Array)return;const t=cr.asCID(r);t!=null&&(yield[e.join("/"),t]);for(const[n,s]of Object.entries(r)){const i=[...e,
n];yield*N2(i,s)}}function*U2(r,e){if(Array.isArray(e))for(const[t,n]of e.entries()){const s=[...r,t];yield s.join("/"),
typeof n=="object"&&cr.asCID(n)==null&&(yield*Ga(n,s))}else yield*Ga(e,r)}function*Ga(r,e){if(!(r==null||typeof r!="obje\
ct"))for(const[t,n]of Object.entries(r)){const s=[...e,t];yield s.join("/"),n!=null&&!(n instanceof Uint8Array)&&typeof n==
"object"&&cr.asCID(n)==null&&(yield*U2(s,n))}}function _2(r,e){let t=r;for(const[n,s]of e.entries()){if(t=t[s],t==null)throw new Error(
`Object has no property at ${e.slice(0,n+1).map(o=>`[${JSON.stringify(o)}]`).join("")}`);const i=cr.asCID(t);if(i!=null)
return{value:i,remaining:e.slice(n+1).join("/")}}return{value:t}}let P2=class{cid;bytes;value;asBlock;constructor({cid:e,
bytes:t,value:n}){if(e==null||t==null||typeof n>"u")throw new Error("Missing required argument");this.cid=e,this.bytes=t,
this.value=n,this.asBlock=this,Object.defineProperties(this,{cid:$s(),bytes:$s(),value:$s(),asBlock:$s()})}links(){return ja(
this.value,[])}tree(){return Ga(this.value,[])}get(e="/"){return _2(this.value,e.split("/").filter(Boolean))}};function T2({
bytes:r,cid:e,value:t,codec:n}){const s=t!==void 0?t:n?.decode(r);if(s===void 0)throw new Error('Missing required argume\
nt, must either provide "value" or "codec"');return new P2({cid:e,bytes:r,value:s})}function yu(r){return e=>new O2(e,r)}
class M2{components;constructor(e,t={}){this.components=e}async*walk(e,t){const n=this.getQueue(),s=_f(n.toGenerator(t),
c=>c!=null);let i=!1;const o=t?.depth??1/0,a=async c=>{const l=c.cid,u=await Bf(this.components.blockstore.get(l,c)),h=T2(
{cid:l,bytes:u,codec:await this.components.getCodec(l.code)});if(c.depth<o)for(const[,d]of h.links())t?.includeChild?.(d,
h)!==!1&&n.add(a,{...c,cid:d,depth:c.depth+1,path:[...c.path,d]}).catch(b=>{i||s.throw(b)});return{block:h,depth:c.depth,
path:c.path}};n.add(a,{...t,cid:e,depth:0,path:[e]}).catch(c=>{i||s.throw(c)});try{yield*s}finally{i=!0,n.abort()}}}class O2 extends M2{getQueue(){
return new Xi({concurrency:1,sort:(e,t)=>e.options.depth===t.options.depth?0:e.options.depth<t.options.depth?1:-1})}}function vd(r){
return r==null?!1:cr.asCID(r)!=null}function no(r){return r?.then!=null}function Me(r=0){return new Uint8Array(r)}function wt(r=0){
return new Uint8Array(r)}const R2=Math.pow(2,7),F2=Math.pow(2,14),V2=Math.pow(2,21),Xc=Math.pow(2,28),Yc=Math.pow(2,35),
Qc=Math.pow(2,42),Zc=Math.pow(2,49),U=128,le=127;function Re(r){if(r<R2)return 1;if(r<F2)return 2;if(r<V2)return 3;if(r<
Xc)return 4;if(r<Yc)return 5;if(r<Qc)return 6;if(r<Zc)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Ed(r,e,t=0){switch(Re(r)){case 8:e[t++]=r&255|U,r/=128;case 7:
e[t++]=r&255|U,r/=128;case 6:e[t++]=r&255|U,r/=128;case 5:e[t++]=r&255|U,r/=128;case 4:e[t++]=r&255|U,r>>>=7;case 3:e[t++]=
r&255|U,r>>>=7;case 2:e[t++]=r&255|U,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreachable")}return e}
function K2(r,e,t=0){switch(Re(r)){case 8:e.set(t++,r&255|U),r/=128;case 7:e.set(t++,r&255|U),r/=128;case 6:e.set(t++,r&
255|U),r/=128;case 5:e.set(t++,r&255|U),r/=128;case 4:e.set(t++,r&255|U),r>>>=7;case 3:e.set(t++,r&255|U),r>>>=7;case 2:
e.set(t++,r&255|U),r>>>=7;case 1:{e.set(t++,r&255),r>>>=7;break}default:throw new Error("unreachable")}return e}function Ad(r,e){
let t=r[e],n=0;if(n+=t&le,t<U||(t=r[e+1],n+=(t&le)<<7,t<U)||(t=r[e+2],n+=(t&le)<<14,t<U)||(t=r[e+3],n+=(t&le)<<21,t<U)||
(t=r[e+4],n+=(t&le)*Xc,t<U)||(t=r[e+5],n+=(t&le)*Yc,t<U)||(t=r[e+6],n+=(t&le)*Qc,t<U)||(t=r[e+7],n+=(t&le)*Zc,t<U))return n;
throw new RangeError("Could not decode varint")}function z2(r,e){let t=r.get(e),n=0;if(n+=t&le,t<U||(t=r.get(e+1),n+=(t&
le)<<7,t<U)||(t=r.get(e+2),n+=(t&le)<<14,t<U)||(t=r.get(e+3),n+=(t&le)<<21,t<U)||(t=r.get(e+4),n+=(t&le)*Xc,t<U)||(t=r.get(
e+5),n+=(t&le)*Yc,t<U)||(t=r.get(e+6),n+=(t&le)*Qc,t<U)||(t=r.get(e+7),n+=(t&le)*Zc,t<U))return n;throw new RangeError("\
Could not decode varint")}function xd(r,e,t=0){return e==null&&(e=wt(Re(r))),e instanceof Uint8Array?Ed(r,e,t):K2(r,e,t)}
function Sd(r,e=0){return r instanceof Uint8Array?Ad(r,e):z2(r,e)}function H2(r){return r?.buffer instanceof ArrayBuffer}
function j2(r){if(H2(r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function pu(r,e){e==null&&
(e=r.reduce((s,i)=>s+i.length,0));const t=wt(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return j2(t)}function wn(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
const kd=Symbol.for("@achingbrain/uint8arraylist");function wu(r,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("ind\
ex is out of bounds")}function Cs(r){return!!r?.[kd]}let $d=class Xs{bufs;length;[kd]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(Cs(
n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())
if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Cs(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=wu(this.
bufs,e);return t.buf[t.index]}set(e,t){const n=wu(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Cs(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return pu(n,s)}subarray(e,t){const{bufs:n,length:s}=this.
_subList(e,t);return n.length===1?n[0]:pu(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new Xs;return i.
length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const h=e-a;n.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(
o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Cs(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const b=this.get(h+d);if(n[d]!==b){u=Math.max(1,d-a[b]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=wt(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Me(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Me(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Me(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=wt(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Me(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Me(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Me(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Me(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Me(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Xs)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!wn(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new Xs;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const G2=8,el=1024*1024*4;class W2 extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class Cd extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class q2 extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}class mu extends Error{name="\
UnexpectedEOFError";code="ERR_UNEXPECTED_EOF"}function Id(r){return r[Symbol.asyncIterator]!=null}function Bd(r,e){if(r.
byteLength>e)throw new Cd("Message length too long")}const so=r=>{const e=Re(r),t=wt(e);return xd(r,t),so.bytes=e,t};so.
bytes=0;function Ld(r,e){e=e??{};const t=e.lengthEncoder??so,n=e?.maxDataLength??el;function*s(i){Bd(i,n);const o=t(i.byteLength);
o instanceof Uint8Array?yield o:yield*o,i instanceof Uint8Array?yield i:yield*i}return Id(r)?(async function*(){for await(const i of r)
yield*s(i)})():(function*(){for(const i of r)yield*s(i)})()}Ld.single=(r,e)=>{e=e??{};const t=e.lengthEncoder??so,n=e?.maxDataLength??
el;return Bd(r,n),new $d(t(r.byteLength),r)};var Xt;(function(r){r[r.LENGTH=0]="LENGTH",r[r.DATA=1]="DATA"})(Xt||(Xt={}));
const tl=r=>{const e=Sd(r);return tl.bytes=Re(e),e};tl.bytes=0;function Wa(r,e){const t=new $d;let n=Xt.LENGTH,s=-1;const i=e?.
lengthDecoder??tl,o=e?.maxLengthLength??G2,a=e?.maxDataLength??el;function*c(){for(;t.byteLength>0;){if(n===Xt.LENGTH)try{
if(s=i(t),s<0)throw new W2("Invalid message length");if(s>a)throw new Cd("Message length too long");const l=i.bytes;t.consume(
l),e?.onLength!=null&&e.onLength(s),n=Xt.DATA}catch(l){if(l instanceof RangeError){if(t.byteLength>o)throw new q2("Messa\
ge length length too long");break}throw l}if(n===Xt.DATA){if(t.byteLength<s)break;const l=t.sublist(0,s);t.consume(s),e?.
onData!=null&&e.onData(l),yield l,n=Xt.LENGTH}}}return Id(r)?(async function*(){for await(const l of r)t.append(l),yield*c();
if(t.byteLength>0)throw new mu("Unexpected end of input")})():(function*(){for(const l of r)t.append(l),yield*c();if(t.byteLength>
0)throw new mu("Unexpected end of input")})()}Wa.fromReader=(r,e)=>{let t=1;const n=(async function*(){for(;;)try{const{
done:i,value:o}=await r.next(t);if(i===!0)return;o!=null&&(yield o)}catch(i){if(i.code==="ERR_UNDER_READ")return{done:!0,
value:null};throw i}finally{t=1}})();return Wa(n,{...e??{},onLength:i=>{t=i}})};class vu{buffer;mask;top;btm;next;constructor(e){
if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.
mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,
this.top=this.top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,
this.btm=this.btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class Go{size;hwm;head;tail;constructor(e={}){
this.hwm=e.splitLimit??16,this.head=new vu(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=
null?e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.
head;this.head=t.next=new vu(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&
this.tail.next!=null){const t=this.tail.next;this.tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&
(this.size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}class J2 extends Error{type;code;constructor(e,t){
super(e??"The operation was aborted"),this.type="aborted",this.code=t??"ABORT_ERR"}}function X2(r={}){return Y2(t=>{const n=t.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function Y2(r,e){
e=e??{};let t=e.onEnd,n=new Go,s,i,o,a=Mn();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise(($,f)=>{
i=g=>{i=null,n.push(g);try{$(r(n))}catch(A){f(A)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
Mn()})}},l=$=>i!=null?i($):(n.push($),s),u=$=>(n=new Go,i!=null?i({error:$}):(n.push({error:$}),s)),h=$=>{if(o)return s;
if(e?.objectMode!==!0&&$?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:$})},d=$=>o?s:(o=!0,$!=null?u($):l({done:!0})),b=()=>(n=new Go,d(),{done:!0}),k=$=>(d($),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:b,throw:k,push:h,end:d,get readableLength(){return n.size},onEmpty:async $=>{
const f=$?.signal;if(f?.throwIfAborted(),n.isEmpty())return;let g,A;f!=null&&(g=new Promise((p,m)=>{A=()=>{m(new J2)},f.
addEventListener("abort",A)}));try{await Promise.race([a.promise,g])}finally{A!=null&&f!=null&&f?.removeEventListener("a\
bort",A)}}},t==null)return s;const C=s;return s={[Symbol.asyncIterator](){return this},next(){return C.next()},throw($){
return C.throw($),t!=null&&(t($),t=void 0),{done:!0}},return(){return C.return(),t!=null&&(t(),t=void 0),{done:!0}},push:h,
end($){return C.end($),t!=null&&(t($),t=void 0),s},get readableLength(){return C.readableLength},onEmpty:$=>C.onEmpty($)},
s}function Q2(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])
return!1;return!0}function Fn(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Vn(r);if(r instanceof
ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return Vn(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));
throw new Error("Unknown type, must be binary type")}function Z2(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)
e[t]=r.charCodeAt(t);return e}const Eu=4096;function e1(r){const e=r.length;if(e<=Eu)return String.fromCharCode.apply(String,
r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=Eu));return t}function t1(r){return r?.buffer instanceof
ArrayBuffer}function Vn(r){return t1(r)?r:r.slice()}function r1(r,e,t){if(r.length>=255)throw new TypeError("Alphabet to\
o long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(
0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().
charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/
Math.log(u);function k(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):
Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===
0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],
S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");
A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!=
"string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,
p=0;f[g]===h;)A++,g++;for(var m=(f.length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;
for(var v=0,S=m-1;(y!==0||v<p)&&S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-ze\
ro carry");p=v,g++}if(f[g]!==" "){for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=
E[w++];return x}}}function $(f){var g=C(f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,
decode:$}}var n1=r1,s1=n1;let i1=class{name;prefix;baseEncode;constructor(e,t,n){this.name=e,this.prefix=t,this.baseEncode=
n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be bi\
nary type")}},o1=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.prefix=t;const s=t.codePointAt(
0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.baseDecode=n}decode(e){if(typeof e==
"string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}\
, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else
throw Error("Can only multibase decode strings")}or(e){return Dd(this,e)}},a1=class{decoders;constructor(e){this.decoders=
e}or(e){return Dd(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(`Unab\
le to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supporte\
d`)}};function Dd(r,e){return new a1({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}let c1=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){
this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new i1(e,t,n),this.decoder=new o1(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function io({name:r,prefix:e,encode:t,decode:n}){
return new c1(r,e,t,n)}function ss({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=s1(t,r,n);
return io({prefix:e,name:r,encode:s,decode:o=>Fn(i(o))})}function l1(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function u1(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function h1(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function J({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=h1(n,s);return io(
{prefix:e,name:r,encode(o){return u1(o,n,t)},decode(o){return l1(o,i,t,r)}})}const $n=J({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),f1=J({prefix:"B",name:"base32upper",alphabet:"ABCDE\
FGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),d1=J({prefix:"c",name:"base32pad",alphabet:"abcdefghijkl\
mnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),g1=J({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLM\
NOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),b1=J({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghi\
jklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),y1=J({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJK\
LMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),p1=J({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmno\
pqrstuv=",bitsPerChar:5,caseInsensitive:!0}),w1=J({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLM\
NOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),m1=J({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h76\
9",bitsPerChar:5}),v1=Object.freeze(Object.defineProperty({__proto__:null,base32:$n,base32hex:b1,base32hexpad:p1,base32hexpadupper:w1,
base32hexupper:y1,base32pad:d1,base32padupper:g1,base32upper:f1,base32z:m1},Symbol.toStringTag,{value:"Module"})),Ys=ss(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),E1=ss({prefix:"K",name:"b\
ase36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),A1=Object.freeze(Object.defineProperty(
{__proto__:null,base36:Ys,base36upper:E1},Symbol.toStringTag,{value:"Module"})),ct=ss({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),x1=ss({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),S1=Object.freeze(Object.defineProperty({__proto__:null,base58btc:ct,
base58flickr:x1},Symbol.toStringTag,{value:"Module"}));var k1=Nd,Au=128,$1=-128,C1=Math.pow(2,31);function Nd(r,e,t){e=e||
[],t=t||0;for(var n=t;r>=C1;)e[t++]=r&255|Au,r/=128;for(;r&$1;)e[t++]=r&255|Au,r>>>=7;return e[t]=r|0,Nd.bytes=t-n+1,e}var I1=qa,
B1=128,xu=127;function qa(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw qa.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&xu)<<s:(o&xu)*Math.pow(2,s),s+=7}while(o>=B1);return qa.bytes=i-n,t}var L1=Math.pow(
2,7),D1=Math.pow(2,14),N1=Math.pow(2,21),U1=Math.pow(2,28),_1=Math.pow(2,35),P1=Math.pow(2,42),T1=Math.pow(2,49),M1=Math.
pow(2,56),O1=Math.pow(2,63),R1=function(r){return r<L1?1:r<D1?2:r<N1?3:r<U1?4:r<_1?5:r<P1?6:r<T1?7:r<M1?8:r<O1?9:10},F1={
encode:k1,decode:I1,encodingLength:R1},bi=F1;function Ja(r,e=0){const t=bi.decode(r,e),n=bi.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function yi(r,e,t=0){return bi.encode(r,e,t),e}function pi(r){return bi.encodingLength(r)}function Ud(r,e){const t=e.
byteLength,n=pi(r),s=n+pi(t),i=new Uint8Array(s+t);return yi(r,i,0),yi(t,i,n),i.set(e,s),new rl(r,t,e,i)}function V1(r){
const e=Fn(r),[t,n]=Ja(e),[s,i]=Ja(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new rl(t,s,o,e)}function K1(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&Q2(r.bytes,t.bytes)}}let rl=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
Vn(n),this.bytes=Vn(s)}};function Su(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return H1(t,Xa(r),e??ct.encoder);default:
return j1(t,Xa(r),e??$n.encoder)}}const ku=new WeakMap;function Xa(r){const e=ku.get(r);if(e==null){const t=new Map;return ku.
set(r,t),t}return e}let Ya=class ne{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=Vn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
tn)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==G1)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return ne.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=Ud(e,
t);return ne.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return ne.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&K1(e.multihash,n.multihash)}toString(e){return Su(this,e)}toJSON(){return{"/":Su(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof ne)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new ne(n,s,i,o??$u(n,s,i.bytes))}else if(t[W1]===!0){const{version:n,
multihash:s,code:i}=t,o=V1(s);return ne.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==tn)throw new Error(`Version 0 CID must use dag-pb (code: ${tn}) block encoding`);return new ne(e,t,n,n.bytes)}case 1:{
const s=$u(e,t,n.bytes);return new ne(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return ne.
create(0,tn,e)}static createV1(e,t){return ne.create(1,e,t)}static decode(e){const[t,n]=ne.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=ne.inspectBytes(e),n=t.size-t.multihashSize,
s=Fn(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new rl(t.multihashCode,t.digestSize,i,s);return[t.version===0?ne.createV0(o):ne.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Ja(e.subarray(t));return t+=d,h};let s=n(),
i=tn;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=z1(e,t),
i=ne.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Xa(
i).set(n,e),i}};function z1(r,e){switch(r[0]){case"Q":{const t=e??ct;return[ct.prefix,t.decode(`${ct.prefix}${r}`)]}case ct.
prefix:{const t=e??ct;return[ct.prefix,t.decode(r)]}case $n.prefix:{const t=e??$n;return[$n.prefix,t.decode(r)]}case Ys.
prefix:{const t=e??Ys;return[Ys.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function H1(r,e,t){const{prefix:n}=t;if(n!==
ct.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function j1(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const tn=112,G1=18;function $u(r,e,t){const n=pi(r),s=n+pi(e),i=new Uint8Array(s+t.
byteLength);return yi(r,i,0),yi(e,i,n),i.set(t,s),i}const W1=Symbol.for("@ipld/js-cid/CID"),Cu="/ipfs/bitswap/1.2.0",q1=1024,
J1=1024,X1=1024,Y1=1e4,Q1=10,Z1=1e4,ev=50,tv=!1,rv=3,_d=1024*1024*4,nv=_d,sv=1e3*5,iv=1024,ov=1,av=10;function cv(r){return r.
buffer instanceof ArrayBuffer}function lv(r){return cv(r)?r:r.slice()}const nl=new Float32Array([-0]),_t=new Uint8Array(
nl.buffer);function uv(r,e,t){nl[0]=r,e[t]=_t[0],e[t+1]=_t[1],e[t+2]=_t[2],e[t+3]=_t[3]}function hv(r,e){return _t[0]=r[e],
_t[1]=r[e+1],_t[2]=r[e+2],_t[3]=r[e+3],nl[0]}const sl=new Float64Array([-0]),ue=new Uint8Array(sl.buffer);function fv(r,e,t){
sl[0]=r,e[t]=ue[0],e[t+1]=ue[1],e[t+2]=ue[2],e[t+3]=ue[3],e[t+4]=ue[4],e[t+5]=ue[5],e[t+6]=ue[6],e[t+7]=ue[7]}function dv(r,e){
return ue[0]=r[e],ue[1]=r[e+1],ue[2]=r[e+2],ue[3]=r[e+3],ue[4]=r[e+4],ue[5]=r[e+5],ue[6]=r[e+6],ue[7]=r[e+7],sl[0]}const gv=BigInt(
Number.MAX_SAFE_INTEGER),bv=BigInt(Number.MIN_SAFE_INTEGER);let lt=class Wt{lo;hi;constructor(e,t){this.lo=e>>>0,this.hi=
t>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(t+n*4294967296)}
return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>
31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<32n))}return BigInt(this.
lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.
hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.
lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.
hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10}static fromBigInt(e){
if(e===0n)return tr;if(e<gv&&e>bv)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let n=e>>32n,s=e-(n<<32n);return t&&
(n=~n|0n,s=~s|0n,++s>Iu&&(s=0n,++n>Iu&&(n=0n))),new Wt(Number(s),Number(n))}static fromNumber(e){if(e===0)return tr;const t=e<
0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&(n=0,++s>4294967295&&(s=0))),
new Wt(n,s)}static from(e){return typeof e=="number"?Wt.fromNumber(e):typeof e=="bigint"?Wt.fromBigInt(e):typeof e=="str\
ing"?Wt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Wt(e.low>>>0,e.high>>>0):tr}};const tr=new lt(0,0);tr.toBigInt=
function(){return 0n};tr.zzEncode=tr.zzDecode=function(){return this};tr.length=function(){return 1};const Iu=4294967296n;
function yv(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function pv(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Pd(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function ze(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function Is(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}let wv=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=lv(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,ze(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw ze(this,4);return Is(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw ze(
this,4);return Is(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw ze(this,4);const e=hv(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw ze(this,4);const e=dv(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw ze(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return pv(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw ze(this,e);this.pos+=e}else do if(this.pos>=this.len)throw ze(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new lt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw ze(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw ze(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw ze(this,8);const e=Is(this.buf,this.pos+=4),t=Is(this.buf,this.pos+=4);return new lt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Ad(this.buf,this.pos);
return this.pos+=Re(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function Td(r){return new wv(r instanceof Uint8Array?
r:r.subarray())}function is(r,e,t){const n=Td(r);return e.decode(n,void 0,t)}const mv=ss({prefix:"9",name:"base10",alphabet:"\
0123456789"}),vv=Object.freeze(Object.defineProperty({__proto__:null,base10:mv},Symbol.toStringTag,{value:"Module"})),Ev=J(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Av=J({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),xv=Object.freeze(Object.defineProperty({__proto__:null,
base16:Ev,base16upper:Av},Symbol.toStringTag,{value:"Module"})),Sv=J({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
kv=Object.freeze(Object.defineProperty({__proto__:null,base2:Sv},Symbol.toStringTag,{value:"Module"})),Md=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),$v=Md.reduce((r,e,t)=>(r[t]=e,r),[]),Cv=Md.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function Iv(r){return r.reduce((e,t)=>(e+=$v[t],e),"")}function Bv(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=Cv[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const Lv=io({prefix:"🚀",name:"\
base256emoji",encode:Iv,decode:Bv}),Dv=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:Lv},Symbol.toStringTag,
{value:"Module"})),Qs=J({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567\
89+/",bitsPerChar:6}),Nv=J({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01\
23456789+/=",bitsPerChar:6}),Uv=J({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu\
vwxyz0123456789-_",bitsPerChar:6}),_v=J({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl\
mnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Pv=Object.freeze(Object.defineProperty({__proto__:null,base64:Qs,base64pad:Nv,
base64url:Uv,base64urlpad:_v},Symbol.toStringTag,{value:"Module"})),Tv=J({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
Mv=Object.freeze(Object.defineProperty({__proto__:null,base8:Tv},Symbol.toStringTag,{value:"Module"})),Ov=io({prefix:"\0",
name:"identity",encode:r=>e1(Fn(r)),decode:r=>Fn(Z2(r))}),Rv=Object.freeze(Object.defineProperty({__proto__:null,identity:Ov},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Fv=20;function Vv({name:r,code:e,encode:t,minDigestLength:n,
maxDigestLength:s}){return new Kv(r,e,t,n,s)}let Kv=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??Fv,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Bu(n,this.code,t?.truncate):n.then(s=>Bu(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Bu(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Ud(e,r)}function zv(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const Lu=Vv({name:"sha2-256",code:18,encode:zv("SHA-256")}),Du={...Rv,...kv,...Mv,...vv,...xv,...v1,
...A1,...S1,...Pv,...Dv};function Od(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}
const Nu=Od("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Wo=Od("asci\
i","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=wt(r.
length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Rd={utf8:Nu,"utf-8":Nu,hex:Du.base16,latin1:Wo,ascii:Wo,
binary:Wo,...Du};function Hv(r,e="utf8"){const t=Rd[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${r}`)}function jv(r){let n,s=8192;return function(o){if(o<1||o>4096)return wt(o);s+o>8192&&(n=
wt(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let mn=class{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}};function qo(){}let Gv=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const Wv=jv();function qv(r){return globalThis.Buffer!=null?
wt(r):Wv(r)}let Qa=class{len;head;tail;states;constructor(){this.len=0,this.head=new mn(qo,0,0),this.tail=this.head,this.
states=null}_push(e,t,n){return this.tail=this.tail.next=new mn(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new Xv((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
Bs,10,lt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=lt.fromBigInt(e);
return this._push(Bs,t.length(),t)}uint64Number(e){return this._push(Ed,Re(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=lt.fromBigInt(e).zzEncode();return this._push(Bs,t.length(),t)}sint64Number(e){const t=lt.fromNumber(e).zzEncode();
return this._push(Bs,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Jo,1,e?1:0)}fixed32(e){
return this._push(rn,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=lt.fromBigInt(e);return this._push(rn,
4,t.lo)._push(rn,4,t.hi)}fixed64Number(e){const t=lt.fromNumber(e);return this._push(rn,4,t.lo)._push(rn,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(uv,4,e)}double(e){return this._push(fv,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Jo,1,0):this.uint32(t)._push(Yv,t,e)}string(e){const t=yv(e);return t!==0?this.uint32(t)._push(
Pd,t,e):this._push(Jo,1,0)}fork(){return this.states=new Gv(this),this.head=this.tail=new mn(qo,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new mn(qo,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.
reset().uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=qv(this.
len);let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}};function Jo(r,e,t){e[t]=r&255}function Jv(r,e,t){
for(;r>127;)e[t++]=r&127|128,r>>>=7;e[t]=r}let Xv=class extends mn{next;constructor(e,t){super(Jv,e,t),this.next=void 0}};
function Bs(r,e,t){for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&
127|128,r.lo=r.lo>>>7;e[t++]=r.lo}function rn(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function Yv(r,e,t){
e.set(r,t)}globalThis.Buffer!=null&&(Qa.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this.
_push(Qv,e,r),this},Qa.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this.
_push(Zv,e,r),this});function Qv(r,e,t){e.set(r,t)}function Zv(r,e,t){r.length<40?Pd(r,e,t):e.utf8Write!=null?e.utf8Write(
r,t):e.set(Hv(r),t)}function eE(){return new Qa}function os(r,e){const t=eE();return e.encode(r,t,{lengthDelimited:!1}),
t.finish()}function*as(r,e,t){const n=Td(r);yield*e.stream(n,void 0,".",t)}const Fd={VARINT:0,LENGTH_DELIMITED:2};function Vd(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function Kd(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Vd("enum",Fd.VARINT,t,n,s)}function cs(r,e,t){return Vd("message",Fd.LENGTH_DELIMITED,r,e,
t)}let Ar=class extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"};var R;(function(r){r.WantBlock="WantBlock",r.
WantHave="WantHave"})(R||(R={}));var Za;(function(r){r[r.WantBlock=0]="WantBlock",r[r.WantHave=1]="WantHave"})(Za||(Za={}));
(function(r){r.codec=()=>Kd(Za)})(R||(R={}));var Cr;(function(r){let e;r.codec=()=>(e==null&&(e=cs((i,o,a={})=>{a.lengthDelimited!==
!1&&o.fork(),i.cid!=null&&i.cid.byteLength>0&&(o.uint32(10),o.bytes(i.cid)),i.priority!=null&&i.priority!==0&&(o.uint32(
16),o.int32(i.priority)),i.cancel!=null&&(o.uint32(24),o.bool(i.cancel)),i.wantType!=null&&(o.uint32(32),R.codec().encode(
i.wantType,o)),i.sendDontHave!=null&&(o.uint32(40),o.bool(i.sendDontHave)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={
cid:Me(0),priority:0},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.cid=i.bytes();break}case 2:{
a.priority=i.int32();break}case 3:{a.cancel=i.bool();break}case 4:{a.wantType=R.codec().decode(i);break}case 5:{a.sendDontHave=
i.bool();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"WantlistEntry"});i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{yield{field:`${a}cid`,value:i.bytes()};break}case 2:{yield{field:`${a}priority`,value:i.int32()};break}case 3:{
yield{field:`${a}cancel`,value:i.bool()};break}case 4:{yield{field:`${a}wantType`,value:R.codec().decode(i)};break}case 5:{
yield{field:`${a}sendDontHave`,value:i.bool()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith("\
.")?a.substring(0,a.length-1):a,type:"end",message:"WantlistEntry"})})),e);function t(i){return os(i,r.codec())}r.encode=
t;function n(i,o){return is(i,r.codec(),o)}r.decode=n;function s(i,o){return as(i,r.codec(),o)}r.stream=s})(Cr||(Cr={}));
var Cn;(function(r){let e;r.codec=()=>(e==null&&(e=cs((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.entries!=null&&
i.entries.length>0)for(const c of i.entries)o.uint32(10),Cr.codec().encode(c,o);i.full!=null&&(o.uint32(16),o.bool(i.full)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={entries:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();
switch(u>>>3){case 1:{if(a.limits?.entries!=null&&c.entries.length===a.limits.entries)throw new Ar('Decode error - repea\
ted field "entries" had too many elements');c.entries.push(Cr.codec().decode(i,i.uint32(),{limits:a.limits?.entries$}));
break}case 2:{c.full=i.bool();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={entries:0},
u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Want\
list"});i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{if(c.limits?.entries!=null&&l.entries===c.limits.entries)throw new Ar(
'Streaming decode error - repeated field "entries" had too many elements');for(const d of Cr.codec().stream(i,i.uint32(),
`${a}entries[].`,{limits:c.limits?.entries$}))yield{...d,index:l.entries};l.entries++;break}case 2:{yield{field:`${a}ful\
l`,value:i.bool()};break}default:{i.skipType(h&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):
a,type:"end",message:"Wantlist"})})),e);function t(i){return os(i,r.codec())}r.encode=t;function n(i,o){return is(i,r.codec(),
o)}r.decode=n;function s(i,o){return as(i,r.codec(),o)}r.stream=s})(Cn||(Cn={}));var Ir;(function(r){let e;r.codec=()=>(e==
null&&(e=cs((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.prefix!=null&&i.prefix.byteLength>0&&(o.uint32(10),o.bytes(i.
prefix)),i.data!=null&&i.data.byteLength>0&&(o.uint32(18),o.bytes(i.data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={
prefix:Me(0),data:Me(0)},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.prefix=i.bytes();
break}case 2:{a.data=i.bytes();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.
pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Block"});i.pos<c;){const l=i.
uint32();switch(l>>>3){case 1:{yield{field:`${a}prefix`,value:i.bytes()};break}case 2:{yield{field:`${a}data`,value:i.bytes()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Block"})})),e);function t(i){return os(i,r.codec())}r.encode=t;function n(i,o){return is(i,r.codec(),o)}r.decode=n;function s(i,o){
return as(i,r.codec(),o)}r.stream=s})(Ir||(Ir={}));var qe;(function(r){r.HaveBlock="HaveBlock",r.DoNotHaveBlock="DoNotHa\
veBlock"})(qe||(qe={}));var wi;(function(r){r[r.HaveBlock=0]="HaveBlock",r[r.DoNotHaveBlock=1]="DoNotHaveBlock"})(wi||(wi=
{}));(function(r){r.codec=()=>Kd(wi)})(qe||(qe={}));var Br;(function(r){let e;r.codec=()=>(e==null&&(e=cs((i,o,a={})=>{a.
lengthDelimited!==!1&&o.fork(),i.cid!=null&&i.cid.byteLength>0&&(o.uint32(10),o.bytes(i.cid)),i.type!=null&&wi[i.type]!==
0&&(o.uint32(16),qe.codec().encode(i.type,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={cid:Me(0),type:qe.HaveBlock},
c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.cid=i.bytes();break}case 2:{a.type=qe.
codec().decode(i);break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!==
"."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"BlockPresence"});i.pos<c;){const l=i.
uint32();switch(l>>>3){case 1:{yield{field:`${a}cid`,value:i.bytes()};break}case 2:{yield{field:`${a}type`,value:qe.codec().
decode(i)};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"BlockPresence"})})),e);function t(i){return os(i,r.codec())}r.encode=t;function n(i,o){return is(i,r.codec(),
o)}r.decode=n;function s(i,o){return as(i,r.codec(),o)}r.stream=s})(Br||(Br={}));var Kn;(function(r){let e;r.codec=()=>(e==
null&&(e=cs((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.wantlist!=null&&(o.uint32(10),Cn.codec().encode(i.wantlist,
o)),i.blocks!=null&&i.blocks.length>0)for(const c of i.blocks)o.uint32(26),Ir.codec().encode(c,o);if(i.blockPresences!=null&&
i.blockPresences.length>0)for(const c of i.blockPresences)o.uint32(34),Br.codec().encode(c,o);i.pendingBytes!=null&&i.pendingBytes!==
0&&(o.uint32(40),o.int32(i.pendingBytes)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={blocks:[],blockPresences:[],
pendingBytes:0},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.wantlist=Cn.codec().decode(
i,i.uint32(),{limits:a.limits?.wantlist});break}case 3:{if(a.limits?.blocks!=null&&c.blocks.length===a.limits.blocks)throw new Ar(
'Decode error - repeated field "blocks" had too many elements');c.blocks.push(Ir.codec().decode(i,i.uint32(),{limits:a.limits?.
blocks$}));break}case 4:{if(a.limits?.blockPresences!=null&&c.blockPresences.length===a.limits.blockPresences)throw new Ar(
'Decode error - repeated field "blockPresences" had too many elements');c.blockPresences.push(Br.codec().decode(i,i.uint32(),
{limits:a.limits?.blockPresences$}));break}case 5:{c.pendingBytes=i.int32();break}default:{i.skipType(u&7);break}}}return c},
function*(i,o,a,c={}){const l={blocks:0,blockPresences:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith("\
.")?a.substring(0,a.length-1):a,type:"start",message:"BitswapMessage"});i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{
yield*Cn.codec().stream(i,i.uint32(),`${a}wantlist.`,{limits:c.limits?.wantlist});break}case 3:{if(c.limits?.blocks!=null&&
l.blocks===c.limits.blocks)throw new Ar('Streaming decode error - repeated field "blocks" had too many elements');for(const d of Ir.
codec().stream(i,i.uint32(),`${a}blocks[].`,{limits:c.limits?.blocks$}))yield{...d,index:l.blocks};l.blocks++;break}case 4:{
if(c.limits?.blockPresences!=null&&l.blockPresences===c.limits.blockPresences)throw new Ar('Streaming decode error - rep\
eated field "blockPresences" had too many elements');for(const d of Br.codec().stream(i,i.uint32(),`${a}blockPresences[]\
.`,{limits:c.limits?.blockPresences$}))yield{...d,index:l.blockPresences};l.blockPresences++;break}case 5:{yield{field:`${a}\
pendingBytes`,value:i.int32()};break}default:{i.skipType(h&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"end",message:"BitswapMessage"})})),e);function t(i){return os(i,r.codec())}r.encode=t;function n(i,o){
return is(i,r.codec(),o)}r.decode=n;function s(i,o){return as(i,r.codec(),o)}r.stream=s})(Kn||(Kn={}));function tE(r,e){
for(const[t,n]of e.wantlist.entries()){const s=r.wantlist.get(t);s!=null&&(s.priority>n.priority&&(n.priority=s.priority),
n.cancel=n.cancel??s.cancel,n.wantType=n.wantType??s.wantType,n.sendDontHave=n.sendDontHave??s.sendDontHave),r.wantlist.
set(t,n)}for(const[t,n]of e.blockPresences.entries())r.blockPresences.set(t,n);for(const[t,n]of e.blocks.entries())r.blocks.
set(t,n);return e.full&&!r.full&&(r.full=!0),r}class rE extends Error{static name="BlockTooLargeError";constructor(e="Bl\
ock too large"){super(e),this.name="BlockTooLargeError"}}const nE=4193648,sE=nE+16;function*iE(r,e){const t=[...r.wantlist.
values()],n=[...r.blockPresences.values()],s=[...r.blocks.values()];let i=0,o=0,a=0,c=!1;for(;;){const l={wantlist:{full:r.
full??!1,entries:[]},blockPresences:[],blocks:[],pendingBytes:0};let u=Kn.encode(l).byteLength,{added:h,hasMore:d,newSize:b}=Xo(
s,l.blocks,a,e,u,oE);a+=h,u=b;const k=d;({added:h,hasMore:d,newSize:b}=Xo(n,l.blockPresences,o,e,u,aE)),o+=h,u=b;const C=d;
if({added:h,hasMore:d,newSize:b}=Xo(t,l.wantlist.entries,i,e,u,cE),i+=h,u=b,c=!k&&!C&&!d,c||(l.wantlist.full=!1),yield Kn.
encode(l),c)break}}function Xo(r,e,t,n,s,i){let o=0,a=!1;for(let c=t;c<r.length;c++){const l=r[c],u=i(l);if(u>sE)throw new rE(
"Cannot send block as after encoding it is over the max message size");const h=s+u;if(h>n){a=!0;break}e.push(l),o++,s=h}
return{hasMore:a,added:o,newSize:s}}function oE(r){return il(3,Ir.encode(r))}function aE(r){return il(4,Br.encode(r))}function cE(r){
return il(1,Cr.encode(r))}function il(r,e){const t=Re(r),n=Re(e.byteLength);return t+n+e.byteLength}function lE(r){if(Tf(
r))return r;if(vd(r))return Qi(r);if(Up(r)||Array.isArray(r))return r;throw new B(`Peer ${r} was not a CID, a Multiaddr \
or a Multiaddr[]`)}class uE extends Ji{log;libp2p;routing;protocols;running;maxInboundStreams;maxOutboundStreams;messageReceiveTimeout;messageSendTimeout;registrarIds;metrics;sendQueue;runOnLimitedConnections;maxOutgoingMessageSize;maxIncomingMessageSize;constructor(e,t={}){
super(),this.log=e.logger.forComponent("helia:bitswap:network"),this.libp2p=e.libp2p,this.routing=e.routing,this.protocols=
t.protocols??[Cu],this.registrarIds=[],this.running=!1,this._onStream=this._onStream.bind(this),this.maxInboundStreams=t.
maxInboundStreams??J1,this.maxOutboundStreams=t.maxOutboundStreams??X1,this.messageReceiveTimeout=t.messageReceiveTimeout??
Y1,this.messageSendTimeout=t.messageSendTimeout??Z1,this.runOnLimitedConnections=t.runOnLimitedConnections??tv,this.maxIncomingMessageSize=
t.maxIncomingMessageSize??_d,this.maxOutgoingMessageSize=t.maxOutgoingMessageSize??t.maxIncomingMessageSize??nv,this.metrics=
{blocksSent:e.metrics?.registerCounter("helia_bitswap_sent_blocks_total"),dataSent:e.metrics?.registerCounter("helia_bit\
swap_sent_data_bytes_total")},this.sendQueue=new Dp({concurrency:t.messageSendConcurrency??ev,metrics:e.metrics,metricName:"\
helia_bitswap_message_send_queue"})}async start(){if(this.running)return;this.running=!0,await this.libp2p.handle(this.protocols,
this._onStream,{maxInboundStreams:this.maxInboundStreams,maxOutboundStreams:this.maxOutboundStreams,runOnLimitedConnection:this.
runOnLimitedConnections});const e={notifyOnLimitedConnection:this.runOnLimitedConnections,onConnect:t=>{this.safeDispatchEvent(
"peer:connected",{detail:t})},onDisconnect:t=>{this.safeDispatchEvent("peer:disconnected",{detail:t})}};this.registrarIds=
[];for(const t of this.protocols)this.registrarIds.push(await this.libp2p.register(t,e));this.libp2p.getConnections().forEach(
t=>{this.safeDispatchEvent("peer:connected",{detail:t.remotePeer})})}async stop(){if(this.running=!1,await this.libp2p.unhandle(
this.protocols),this.registrarIds!=null){for(const e of this.registrarIds)this.libp2p.unregister(e);this.registrarIds=[]}}_onStream(e,t){
this.running&&Promise.resolve().then(async()=>{this.log("incoming new bitswap %s stream from %p",e.protocol,t.remotePeer);
const n=()=>{e.status==="open"?e.abort(new Ep(`Incoming Bitswap stream timed out after ${this.messageReceiveTimeout}ms`)):
this.log("stream aborted with status %s",e.status)};let s=AbortSignal.timeout(this.messageReceiveTimeout);s.addEventListener(
"abort",n),await e.close({signal:s});const i=X2();e.addEventListener("message",o=>{i.push(o.data)}),e.addEventListener("\
remoteCloseWrite",()=>{i.end()}),e.addEventListener("close",o=>{o.error!=null&&i.end(o.error)});for await(const o of Wa(
i,{maxDataLength:this.maxIncomingMessageSize}))try{const a=Kn.decode(o);this.log("incoming new bitswap %s message from %\
p on stream",e.protocol,t.remotePeer,e.id),this.safeDispatchEvent("bitswap:message",{detail:{peer:t.remotePeer,message:a,
connection:t}}),s.removeEventListener("abort",n),s=AbortSignal.timeout(this.messageReceiveTimeout),Yi(1/0,s),s.addEventListener(
"abort",n)}catch(a){this.log.error("error reading incoming bitswap message from %p on stream - %e",t.remotePeer,e.id,a),
e.abort(a);break}}).catch(n=>{this.log.error("error handling incoming stream from %p - %e",t.remotePeer,n),e.abort(n)})}async*findProviders(e,t){
t?.onProgress?.(new L("bitswap:find-providers",e));for await(const n of this.routing.findProviders(e,t)){if(!await this.
libp2p.isDialable(n.multiaddrs,{runOnLimitedConnection:this.runOnLimitedConnections})){this.log("skipping peer %p as the\
y are not dialable - %a",n.id,n.multiaddrs);continue}t?.onProgress?.(new L("bitswap:found-provider",{type:"bitswap",cid:e,
provider:n,router:n.router})),yield n}}async findAndConnect(e,t){t?.providers!=null&&await Promise.all(t.providers.map(async n=>this.
connectTo(n,t).catch(s=>{this.log.error("could not connect to supplied provider - %e",s)}))),await Pf(Pa(Np(this.findProviders(
e,t),t?.maxProviders??rv),async n=>this.connectTo(n.id,t))).catch(n=>{this.log.error(n)})}async sendMessage(e,t,n){if(!this.
running)throw new Error("network isn't running");const s=this.sendQueue.queue.find(i=>e.equals(i.options.peerId)&&i.status===
"queued");if(s!=null){s.options.message=tE(s.options.message,t),await s.join(n);return}await this.sendQueue.add(async i=>{
const o=i.message;if(o==null)throw new B("No message to send");this.log("sendMessage to %p",e),i.onProgress?.(new L("bit\
swap:send-wantlist",e));const a=await this.libp2p.dialProtocol(e,Cu,{...i,runOnLimitedConnection:this.runOnLimitedConnections});
await a.closeRead(i);try{for(const c of iE(o,this.maxOutgoingMessageSize))a.send(Ld.single(c))||await a.onDrain(i);await a.
close(i)}catch(c){this.log.error("error sending message to %p - %e",e,c),i?.onProgress?.(new L("bitswap:send-wantlist:er\
ror",{peer:e,error:c})),a.abort(c)}this._updateSentStats(o.blocks)},{onProgress:n?.onProgress,peerId:e,signal:n?.signal??
AbortSignal.timeout(this.messageSendTimeout),message:t})}async connectTo(e,t){if(!this.running)throw new Lf("Network isn\
't running");return e=lE(e),t?.onProgress?.(new L("bitswap:dial",e)),this.libp2p.dial(e,t)}_updateSentStats(e){let t=0;for(const n of e.
values())t+=n.data.byteLength;this.metrics.dataSent?.increment(t),this.metrics.blocksSent?.increment(e.size)}}function xr(r,e="\
utf8"){const t=Rd[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}class vn{full;pendingBytes;wantlist;blocks;blockPresences;constructor(e=!1,t=0){
this.full=e,this.wantlist=new Map,this.blocks=new Map,this.blockPresences=new Map,this.pendingBytes=0}addWantlistEntry(e,t){
const n=Qs.encode(e.multihash.bytes);this.wantlist.set(n,t)}addBlockPresence(e,t){const n=Qs.encode(e.multihash.bytes);this.
blockPresences.set(n,t)}addBlock(e,t){const n=Qs.encode(e.multihash.bytes);this.blocks.set(n,t)}}function hE(r){let e=new Uint8Array(
r.reduce((n,s)=>n+Re(s),0)),t=0;for(const n of r)e=xd(n,e,t),t+=Re(n);return e}function Uu(r){return hE([r.version,r.code,
r.multihash.code,r.multihash.digest.byteLength])}class fE{peerId;blockstore;network;wants;exchangeCount;bytesSent;bytesReceived;lastExchange;sendQueue;maxSizeReplaceHasWithBlock;log;doNotResendBlockWindow;maxWantListSize;constructor(e,t){
this.peerId=e.peerId,this.blockstore=e.blockstore,this.network=e.network,this.wants=new Map,this.log=e.logger.forComponent(
`helia:bitswap:ledger:${e.peerId}`),this.exchangeCount=0,this.bytesSent=0,this.bytesReceived=0,this.maxSizeReplaceHasWithBlock=
t.maxSizeReplaceHasWithBlock??q1,this.doNotResendBlockWindow=t.doNotResendBlockWindow??sv,this.maxWantListSize=t.maxWantListSize??
iv,this.sendQueue=new Xi({concurrency:t.sendBlocksConcurrency??ov,maxSize:t.sendBlocksMaxQueueLength??av})}stop(){this.sendQueue.
abort()}sentBytes(e){this.exchangeCount++,this.lastExchange=new Date().getTime(),this.bytesSent+=e}receivedBytes(e){this.
exchangeCount++,this.lastExchange=new Date().getTime(),this.bytesReceived+=e}debtRatio(){return this.bytesSent/(this.bytesReceived+
1)}removeExpiredWants(){this.wants.forEach((e,t)=>{e.expires!=null&&e.expires<Date.now()&&this.wants.delete(t)})}addWants(e){
if(e==null)return;e.full===!0&&this.wants.forEach((n,s)=>{n.status==="want"&&this.wants.delete(s)});for(const n of e.entries){
const s=Ya.decode(n.cid),i=xr(s.multihash.bytes,"base64");if(n.cancel===!0)this.log("peer %p cancelled want of block for\
 %c",this.peerId,s),this.wants.delete(i);else{n.wantType===R.WantHave?this.log("peer %p wanted block presence for %c",this.
peerId,s):this.log("peer %p wanted block for %c",this.peerId,s);const o=this.wants.get(i);if(o!=null){const a=o.status===
"sent"||o.status==="sending",c=o.wantType===R.WantHave&&(n.wantType==null||n.wantType===R.WantBlock);a&&c&&(o.status="wa\
nt"),o.priority=n.priority,o.wantType=n.wantType??R.WantBlock,o.sendDontHave=n.sendDontHave??!1;continue}this.wants.set(
i,{cid:s,priority:n.priority,wantType:n.wantType??R.WantBlock,sendDontHave:n.sendDontHave??!1,status:"want",created:Date.
now()})}}const t=[...this.wants.entries()].filter(([n,s])=>s.status==="want");t.length>this.maxWantListSize&&this.truncateWants(
t)}truncateWants(e){e=e.sort((n,s)=>n[1].created<s[1].created?-1:s[1].created<n[1].created?1:0).sort((n,s)=>n[1].haveBlock===
!1?-1:s[1].haveBlock===!1?1:0).sort((n,s)=>n[1].priority<s[1].priority?-1:s[1].priority<n[1].priority?1:0);const t=e.length-
this.maxWantListSize;for(let n=0;n<t;n++)this.wants.delete(e[n][0])}getWants(){return[...this.wants.values()]}hasWant(e){
const t=xr(e.multihash.bytes,"base64"),n=this.wants.get(t);return n==null?!1:(delete n.haveBlock,!0)}queueSendOperation(e,t){
e!=null&&(this.receivedBytes(e.blocks?.reduce((n,s)=>n+s.data.byteLength,0)??0),this.addWants(e.wantlist));try{this.sendQueue.
add(async n=>{this.log("send blocks to peer"),await this.sendBlocksToPeer(n)},t).catch(n=>{n.name==="QueueFullError"?this.
log.error("Dropping bitswap message as peer send queue is full"):this.log.error("Error when trying to add queue a send o\
peration")})}catch(n){if(n.name==="QueueFullError")this.log.error("Dropping bitswap message as peer send queue is full");else
throw n}}async sendBlocksToPeer(e){const t=new vn,n=new Set;this.removeExpiredWants();const s=[...this.wants.entries()].
filter(([i,o])=>o.haveBlock===!1?!1:o.status==="want");if(s.length!==0){s.forEach(([i,o])=>{o.status="sending"});for(const[
i,o]of s)try{if(!await this.blockstore.has(o.cid,e))throw new Oc;const c=await Bf(this.blockstore.get(o.cid,e));if(o.status!==
"sending")continue;o.wantType===R.WantHave?c.byteLength<this.maxSizeReplaceHasWithBlock?(this.log("sending have and bloc\
k for %c",o.cid),n.add(i),t.addBlock(o.cid,{data:c,prefix:Uu(o.cid)})):(this.log("sending have for %c",o.cid),t.addBlockPresence(
o.cid,{cid:o.cid.bytes,type:qe.HaveBlock})):(this.log("sending block for %c",o.cid),n.add(i),t.addBlock(o.cid,{data:c,prefix:Uu(
o.cid)})),o.status="sent",o.expires=Date.now()+this.doNotResendBlockWindow}catch(a){if(a.name!=="NotFoundError")throw a;
if(o.status="want",o.haveBlock=!1,this.log("do not have block for %c",o.cid),!o.sendDontHave||o.sentDoNotHave===!0)continue;
o.sentDoNotHave=!0,t.addBlockPresence(o.cid,{cid:o.cid.bytes,type:qe.DoNotHaveBlock})}(t.blocks.size>0||t.blockPresences.
size>0)&&(this.log("sending message"),await this.network.sendMessage(this.peerId,t,e),this.log("sent message"),this.sentBytes(
[...t.blocks.values()].reduce((i,o)=>i+o.data.byteLength,0)))}}}class dE{blockstore;network;ledgerMap;maxSizeReplaceHasWithBlock;doNotResendBlockWindow;maxWantListSize;sendBlocksConcurrency;sendBlocksMaxQueueLength;log;logger;constructor(e,t={}){
this.blockstore=e.blockstore,this.network=e.network,this.maxSizeReplaceHasWithBlock=t.maxSizeReplaceHasWithBlock,this.doNotResendBlockWindow=
t.doNotResendBlockWindow,this.maxWantListSize=t.maxWantListSize,this.sendBlocksConcurrency=t.sendBlocksConcurrency,this.
sendBlocksMaxQueueLength=t.sendBlocksMaxQueueLength,this.log=e.logger.forComponent("helia:bitswap:peer-want-lists"),this.
logger=e.logger,this.ledgerMap=Mf({name:"helia_bitswap_ledger_map",metrics:e.metrics}),this.network.addEventListener("bi\
tswap:message",n=>{try{this.receiveMessage(n.detail.connection.remotePeer,n.detail.message)}catch(s){this.log.error("err\
or receiving bitswap message from %p - %e",n.detail.connection.remotePeer,s)}}),this.network.addEventListener("peer:disc\
onnected",n=>{this.peerDisconnected(n.detail)})}start(){}stop(){this.ledgerMap.forEach(e=>{e.stop()})}ledgerForPeer(e){const t=this.
ledgerMap.get(e);if(t!=null)return{peer:t.peerId,value:t.debtRatio(),sent:t.bytesSent,received:t.bytesReceived,exchanged:t.
exchangeCount,sendQueue:t.sendQueue}}wantListForPeer(e){const t=this.ledgerMap.get(e);if(t!=null)return t.removeExpiredWants(),
t.getWants()}peers(){return Array.from(this.ledgerMap.values()).map(e=>e.peerId)}receiveMessage(e,t){let n=this.ledgerMap.
get(e);n==null&&(n=new fE({peerId:e,blockstore:this.blockstore,network:this.network,logger:this.logger},{maxSizeReplaceHasWithBlock:this.
maxSizeReplaceHasWithBlock,doNotResendBlockWindow:this.doNotResendBlockWindow,maxWantListSize:this.maxWantListSize,sendBlocksConcurrency:this.
sendBlocksConcurrency,sendBlocksMaxQueueLength:this.sendBlocksMaxQueueLength}),this.ledgerMap.set(e,n)),n.queueSendOperation(
t)}async receivedBlock(e,t){const n=[];for(const s of this.ledgerMap.values())s.hasWant(e)&&n.push(s);await Promise.all(
n.map(async s=>s.queueSendOperation(void 0,t)))}peerDisconnected(e){this.ledgerMap.delete(e)}}class gE extends n2{name="\
bitswap-session";wantList;network;libp2p;constructor(e,t){super(e,{...t,name:"helia:bitswap:session"}),this.wantList=e.wantList,
this.network=e.network,this.libp2p=e.libp2p}async queryProvider(e,t,n){if(n.signal?.aborted===!0)throw new zm(`Signal to\
 want session block for CID ${e} from peer ${t} was aborted prior to want`);const s=Qi(t.peerId);this.log("sending WANT-\
BLOCK for %c to %p",e,s);const i=await this.wantList.wantSessionBlock(e,s,n);if(this.log("%p %s %c",t,i.has?"has":"does \
not have",e),i.has){if(i.block!=null)return i.block;throw new Error("Provider has block but did not send it to us")}throw new Error(
"Provider did not have block")}async*findNewProviders(e,t={}){for await(const n of this.network.findProviders(e,t))yield{
peerId:n.id,router:n.router,toString:()=>`Bitswap(${n.id})`,fallback:n.fallback}}toFilterKey(e){return e.peerId.multihash.
bytes}equals(e,t){return e.peerId.equals(t.peerId)}async convertToProvider(e,t,n){if(vd(e))return{peerId:e,router:t,toString:()=>`\
Bitswap(${e})`,fallback:!1};if(await this.libp2p.isDialable(e)!==!1)try{const s=await this.libp2p.dial(e,n);return{peerId:s.
remotePeer.toCID(),router:t,toString:()=>`Bitswap(${s.remotePeer})`,fallback:!1}}catch{}}emitFoundProviderProgressEvent(e,t,n){
n?.onProgress?.(new L("bitswap:found-provider",{type:"bitswap",cid:e,provider:{id:t.peerId,multiaddrs:[],router:t.router,
fallback:t.fallback},router:t.router}))}}function bE(r,e){return new gE(r,e)}class yE{blocksReceived;duplicateBlocksReceived;dataReceived;duplicateDataReceived;constructor(e){
this.blocksReceived=e.metrics?.registerMetricGroup("helia_bitswap_received_blocks"),this.duplicateBlocksReceived=e.metrics?.
registerMetricGroup("helia_bitswap_duplicate_received_blocks"),this.dataReceived=e.metrics?.registerMetricGroup("helia_b\
itswap_data_received_bytes"),this.duplicateDataReceived=e.metrics?.registerMetricGroup("helia_bitswap_duplicate_data_rec\
eived_bytes")}updateBlocksReceived(e=1,t){const n={global:e};t!=null&&(n[t.toString()]=e),this.blocksReceived?.increment(
n)}updateDuplicateBlocksReceived(e=1,t){const n={global:e};t!=null&&(n[t.toString()]=e),this.duplicateBlocksReceived?.increment(
n)}updateDataReceived(e,t){const n={global:e};t!=null&&(n[t.toString()]=e),this.dataReceived?.increment(n)}updateDuplicateDataReceived(e,t){
const n={global:e};t!=null&&(n[t.toString()]=e),this.duplicateDataReceived?.increment(n)}}function pE(r){if(!(r instanceof
Uint8Array))throw new Error("arg needs to be a Uint8Array");const e=[];for(;r.length>0;){const t=Sd(r);e.push(t),r=r.slice(
Re(t))}return e}class wE extends Ji{peers;wants;network;log;sendWantlistDebounce;sendMessagesTimeout;getHasher;sendingMessages;constructor(e,t={}){
super(),this.peers=Mf({name:"helia_bitswap_peers",metrics:e.metrics}),this.wants=_p({name:"helia_bitswap_wantlist",metrics:e.
metrics}),this.network=e.network,this.sendWantlistDebounce=t.sendWantlistDebounce??Q1,this.log=e.logger.forComponent("he\
lia:bitswap:wantlist"),this.getHasher=e.getHasher,this.network.addEventListener("bitswap:message",n=>{this.receiveMessage(
n.detail.connection,n.detail.message).catch(s=>{this.log.error("error receiving bitswap message from %p - %e",n.detail.connection.
remotePeer,s)})}),this.network.addEventListener("peer:connected",n=>{this.peerConnected(n.detail).catch(s=>{this.log.error(
"error processing newly connected bitswap peer %p - %e",n.detail,s)})}),this.network.addEventListener("peer:disconnected",
n=>{this.peerDisconnected(n.detail)})}async addEntry(e,t){const n=xr(e.multihash.bytes,"base64");let s=this.wants.get(n);
s==null&&(s={cid:e,priority:t.priority??1,wantType:t.wantType??R.WantBlock,cancel:!1,sendDontHave:!0,onProgress:[]},this.
wants.set(n,s)),t.onProgress!=null&&s.onProgress.push({onProgress:t.onProgress,signal:t.signal}),s.wantType===R.WantHave&&
t.wantType===R.WantBlock&&(s.wantType=R.WantBlock),await this.sendMessagesDebounced();try{return t.wantType===R.WantBlock?
(await vs(this,"block",t?.signal,{filter:a=>wn(e.multihash.digest,a.detail.cid.multihash.digest),errorMessage:"Want was \
aborted"})).detail:(await vs(this,"presence",t?.signal,{filter:o=>wn(e.multihash.digest,o.detail.cid.multihash.digest),errorMessage:"\
Want was aborted"})).detail}finally{t.signal?.aborted===!0&&(this.log("want for %c was aborted, cancelling want",e),s.cancel=
!0,await this.sendMessagesDebounced())}}async sendMessagesDebounced(){await this.sendingMessages?.promise,clearTimeout(this.
sendMessagesTimeout),this.sendMessagesTimeout=setTimeout(()=>{this.sendMessages().catch(e=>{this.log("error sending mess\
ages to peers - %e",e)})},this.sendWantlistDebounce)}async sendMessages(){this.sendingMessages=Mn(),await Promise.all([...this.
peers.entries()].map(async([e,t])=>{const n=new Set,s=new vn;for(const[i,o]of this.wants.entries())t.has(i)||o.cancel||(n.
add(i),s.addWantlistEntry(o.cid,{cid:o.cid.bytes,priority:o.priority,wantType:o.wantType,cancel:o.cancel,sendDontHave:o.
sendDontHave}));if(s.wantlist.size!==0)try{await this.network.sendMessage(e,s,{onProgress:i=>{this.wants.forEach(({onProgress:o})=>{
o.forEach(({onProgress:a})=>{a(i)})})}});for(const i of n)t.add(i)}catch(i){this.log.error("error sending full wantlist \
to new peer - %e",i)}})).catch(e=>{this.log.error("error sending messages - %e",e)});for(const[e,t]of this.wants)if(t.cancel){
this.wants.delete(e);for(const n of this.peers.values())n.delete(e)}this.sendingMessages.resolve()}has(e){const t=xr(e.multihash.
bytes,"base64");return this.wants.has(t)}async wantSessionPresence(e,t,n={}){const s=new vn;return s.addWantlistEntry(e,
{cid:e.bytes,sendDontHave:!0,wantType:R.WantHave,priority:1}),await this.network.sendMessage(t,s,n),(await vs(this,"pres\
ence",n.signal,{filter:o=>t.equals(o.detail.sender)&&wn(e.multihash.digest,o.detail.cid.multihash.digest)})).detail}async wantBlock(e,t={}){
return this.addEntry(e,{...t,wantType:R.WantBlock})}async wantSessionBlock(e,t,n={}){const s=new vn;return s.addWantlistEntry(
e,{cid:e.bytes,sendDontHave:!0,wantType:R.WantBlock,priority:1}),await this.network.sendMessage(t,s,n),(await vs(this,"p\
resence",n.signal,{filter:o=>t.equals(o.detail.sender)&&wn(e.multihash.digest,o.detail.cid.multihash.digest)})).detail}async receivedBlock(e,t){
const n=xr(e.multihash.bytes,"base64"),s=this.wants.get(n);s!=null&&(s.cancel=!0,await this.sendMessagesDebounced())}async receiveMessage(e,t){
this.log("received message from %p with %d blocks",e.remotePeer,t.blocks.length);let n=!1;for(const s of t.blocks){if(s.
prefix==null||s.data==null)continue;const i=pE(s.prefix),o=i[0],a=i[1],c=i[2],l=i[3],u=c===Lu.code?Lu:await this.getHasher(
c);if(u==null){this.log.error("unknown hash algorithm",c);continue}let h=u.digest(s.data,{truncate:l});h.then!=null&&(h=
await h);const d=Ya.create(o===0?0:1,a,h);this.log("received block from %p for %c",e.remotePeer,d),this.safeDispatchEvent(
"block",{detail:{sender:e.remotePeer,cid:d,block:s.data,connection:e}}),this.safeDispatchEvent("presence",{detail:{sender:e.
remotePeer,cid:d,has:!0,block:s.data}});const b=xr(d.multihash.bytes,"base64"),k=this.wants.get(b);k!=null&&(k.cancel=!0,
n=!0)}for(const{cid:s,type:i}of t.blockPresences){const o=Ya.decode(s);this.log("received %s from %p for %c",i,e.remotePeer,
o),this.safeDispatchEvent("presence",{detail:{sender:e.remotePeer,cid:o,has:i===qe.HaveBlock}})}n&&await this.sendMessagesDebounced()}async peerConnected(e){
const t=new Set,n=new vn(!0);for(const[s,i]of this.wants.entries())i.cancel||(t.add(s),n.addWantlistEntry(i.cid,{cid:i.cid.
bytes,priority:1,wantType:R.WantBlock,cancel:!1,sendDontHave:!1}));if(n.wantlist.size===0){this.peers.set(e,t);return}try{
await this.network.sendMessage(e,n,{onProgress:s=>{this.wants.forEach(({onProgress:i})=>{i.forEach(({onProgress:o})=>{o(
s)})})}}),this.peers.set(e,t)}catch(s){this.log.error("error sending full wantlist to new peer %p - %e",e,s)}}peerDisconnected(e){
this.peers.delete(e)}start(){}stop(){this.peers.clear(),clearTimeout(this.sendMessagesTimeout)}}class mE{log;logger;stats;network;blockstore;peerWantLists;wantList;libp2p;constructor(e,t={}){
this.logger=e.logger,this.log=e.logger.forComponent("helia:bitswap"),this.blockstore=e.blockstore,this.libp2p=e.libp2p,this.
stats=new yE(e),this.network=new uE(e,t),this.peerWantLists=new dE({...e,network:this.network},t),this.wantList=new wE({
...e,network:this.network},t)}createSession(e={}){return bE({wantList:this.wantList,network:this.network,logger:this.logger,
libp2p:this.libp2p},e)}async want(e,t={}){const n=new AbortController,s=Te([n.signal,t.signal]);Yi(1/0,n.signal),this.network.
findAndConnect(e,{...t,signal:s}).catch(i=>{n.signal.aborted||this.log.error("error during finding and connect for cid %\
c - %e",e,i)});try{const i=await this.wantList.wantBlock(e,{...t,signal:s});return t.onProgress?.(new L("bitswap:block",
{cid:e,sender:i.connection.remotePeer})),i.block}finally{n.abort(),s.clear()}}async notify(e,t={}){await Promise.all([this.
peerWantLists.receivedBlock(e,t),this.wantList.receivedBlock(e,t)])}getWantlist(){return[...this.wantList.wants.values()].
filter(e=>!e.cancel).map(e=>({cid:e.cid,priority:e.priority,wantType:e.wantType}))}getPeerWantlist(e){return this.peerWantLists.
wantListForPeer(e)}async start(){this.wantList.start(),await this.network.start()}async stop(){this.wantList.stop(),this.
peerWantLists.stop(),await this.network.stop()}}class vE{name="bitswap";bitswap;started;constructor(e,t={}){this.bitswap=
new mE(e,t),this.started=!1}isStarted(){return this.started}async start(){await this.bitswap.start(),this.started=!0}async stop(){
await this.bitswap.stop(),this.started=!1}async announce(e,t){await this.bitswap.notify(e,t)}async retrieve(e,t={}){return this.
bitswap.want(e,{...t,onProgress:function(s){if(t?.onProgress!=null)if(t.onProgress(s),s.type==="connection:open"){if(!Tf(
s.detail))return;t.onProgress(new L("helia:block-broker:connect",{broker:"bitswap",type:"connect",provider:s.detail.toCID(),
cid:e}))}else s.type==="connection:opened"?t.onProgress(new L("helia:block-broker:connected",{broker:"bitswap",type:"con\
nected",provider:s.detail.remotePeer.toCID(),address:s.detail.remoteAddr,cid:e})):s.type==="bitswap:send-wantlist"?t.onProgress(
new L("helia:block-broker:request-block",{broker:"bitswap",type:"request-block",provider:s.detail.toCID(),cid:e})):s.type===
"bitswap:block"&&t.onProgress(new L("helia:block-broker:receive-block",{broker:"bitswap",type:"receive-block",provider:s.
detail.sender.toCID(),cid:e}))}})}createSession(e){const t=this.bitswap.createSession(e);return{name:"bitswap-session",addPeer:async(n,s)=>{
await t.addPeer(n,s)},announce:async(n,s)=>{await this.bitswap.notify(n,s)},retrieve:async(n,s)=>t.retrieve(n,s)}}}function EE(r,e={}){
const t={name:"bitswap",start:async n=>{if(n.status==="starting"&&!n.hasBlockBroker("bitswap")){const s=new vE(n,e);await ts(
s),n.addBlockBroker(s)}}};return r.addMixin(t),r}function mt(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;
for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function AE(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)
return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Pr(r){if(r instanceof Uint8Array&&r.constructor.
name==="Uint8Array")return zn(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return zn(
new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function xE(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const _u=4096;function SE(r){const e=r.
length;if(e<=_u)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=_u));return t}function kE(r){return r?.buffer instanceof ArrayBuffer}function zn(r){return kE(r)?r:r.slice()}
function $E(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===
0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=
256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;
for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.
length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&
S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){
for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var CE=$E,IE=CE;let BE=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},LE=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return zd(this,e)}},
DE=class{decoders;constructor(e){this.decoders=e}or(e){return zd(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function zd(r,e){return new DE({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let NE=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new BE(e,t,n),this.decoder=new LE(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function oo({name:r,prefix:e,encode:t,decode:n}){return new NE(r,e,t,
n)}function ls({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=IE(t,r,n);return oo({prefix:e,
name:r,encode:s,decode:o=>Pr(i(o))})}function UE(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function _E(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function PE(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function X({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=PE(n,s);return oo(
{prefix:e,name:r,encode(o){return _E(o,n,t)},decode(o){return UE(o,i,t,r)}})}const Le=ls({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),TE=ls({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),ME=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Le,
base58flickr:TE},Symbol.toStringTag,{value:"Module"})),In=X({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwx\
yz234567",bitsPerChar:5,caseInsensitive:!0}),OE=X({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234\
567",bitsPerChar:5,caseInsensitive:!0}),RE=X({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0}),FE=X({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),
VE=X({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),KE=X({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),zE=X({prefix:"t",
name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),HE=X({prefix:"T",name:"\
base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),jE=X({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),GE=Object.freeze(Object.defineProperty({__proto__:null,
base32:In,base32hex:VE,base32hexpad:zE,base32hexpadupper:HE,base32hexupper:KE,base32pad:RE,base32padupper:FE,base32upper:OE,
base32z:jE},Symbol.toStringTag,{value:"Module"})),Zs=ls({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),WE=ls({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
qE=Object.freeze(Object.defineProperty({__proto__:null,base36:Zs,base36upper:WE},Symbol.toStringTag,{value:"Module"}));var JE=Hd,
Pu=128,XE=-128,YE=Math.pow(2,31);function Hd(r,e,t){e=e||[],t=t||0;for(var n=t;r>=YE;)e[t++]=r&255|Pu,r/=128;for(;r&XE;)
e[t++]=r&255|Pu,r>>>=7;return e[t]=r|0,Hd.bytes=t-n+1,e}var QE=ec,ZE=128,Tu=127;function ec(r,n){var t=0,n=n||0,s=0,i=n,
o,a=r.length;do{if(i>=a)throw ec.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&Tu)<<s:(o&Tu)*Math.
pow(2,s),s+=7}while(o>=ZE);return ec.bytes=i-n,t}var eA=Math.pow(2,7),tA=Math.pow(2,14),rA=Math.pow(2,21),nA=Math.pow(2,
28),sA=Math.pow(2,35),iA=Math.pow(2,42),oA=Math.pow(2,49),aA=Math.pow(2,56),cA=Math.pow(2,63),lA=function(r){return r<eA?
1:r<tA?2:r<rA?3:r<nA?4:r<sA?5:r<iA?6:r<oA?7:r<aA?8:r<cA?9:10},uA={encode:JE,decode:QE,encodingLength:lA},mi=uA;function tc(r,e=0){
const t=mi.decode(r,e),n=mi.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[t,n]}function vi(r,e,t=0){return mi.encode(r,e,t),e}function Ei(r){return mi.
encodingLength(r)}function ao(r,e){const t=e.byteLength,n=Ei(r),s=n+Ei(t),i=new Uint8Array(s+t);return vi(r,i,0),vi(t,i,
n),i.set(e,s),new ol(r,t,e,i)}function hA(r){const e=Pr(r),[t,n]=tc(e),[s,i]=tc(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new ol(t,s,o,e)}function fA(r,e){if(r===e)return!0;{const t=e;return r.code===
t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&AE(r.bytes,t.bytes)}}let ol=class{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=zn(n),this.bytes=zn(s)}};function Mu(r,e){const{bytes:t,version:n}=r;switch(n){case 0:
return gA(t,rc(r),e??Le.encoder);default:return bA(t,rc(r),e??In.encoder)}}const Ou=new WeakMap;function rc(r){const e=Ou.
get(r);if(e==null){const t=new Map;return Ou.set(r,t),t}return e}let co=class se{code;version;multihash;bytes;"/";constructor(e,t,n,s){
this.code=t,this.version=e,this.multihash=n,this.bytes=zn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==nn)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==yA)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return se.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,n=ao(e,t);return se.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return se.equals(this,e)}static equals(e,t){const n=t;return n!=
null&&e.code===n.code&&e.version===n.version&&fA(e.multihash,n.multihash)}toString(e){return Mu(this,e)}toJSON(){return{
"/":Mu(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof se)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:n,code:s,multihash:i,bytes:o}=t;return new se(n,s,i,o??Ru(n,s,i.bytes))}else if(t[pA]===!0){const{
version:n,multihash:s,code:i}=t,o=hA(s);return se.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==nn)throw new Error(`Version 0 CID must use dag-pb (code: ${nn}) block encoding`);return new se(
e,t,n,n.bytes)}case 1:{const s=Ru(e,t,n.bytes);return new se(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){
return se.create(0,nn,e)}static createV1(e,t){return se.create(1,e,t)}static decode(e){const[t,n]=se.decodeFirst(e);if(n.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=se.inspectBytes(e),n=t.size-t.multihashSize,
s=Pr(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new ol(t.multihashCode,t.digestSize,i,s);return[t.version===0?se.createV0(o):se.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=tc(e.subarray(t));return t+=d,h};let s=n(),
i=nn;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=dA(e,t),
i=se.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return rc(
i).set(n,e),i}};function dA(r,e){switch(r[0]){case"Q":{const t=e??Le;return[Le.prefix,t.decode(`${Le.prefix}${r}`)]}case Le.
prefix:{const t=e??Le;return[Le.prefix,t.decode(r)]}case In.prefix:{const t=e??In;return[In.prefix,t.decode(r)]}case Zs.
prefix:{const t=e??Zs;return[Zs.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function gA(r,e,t){const{prefix:n}=t;if(n!==
Le.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function bA(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const nn=112,yA=18;function Ru(r,e,t){const n=Ei(r),s=n+Ei(e),i=new Uint8Array(s+t.
byteLength);return vi(r,i,0),vi(e,i,n),i.set(t,s),i}const pA=Symbol.for("@ipld/js-cid/CID"),jd=0,wA="identity",Gd=Pr;function mA(r,e){
if(e?.truncate!=null&&e.truncate!==r.byteLength){if(e.truncate<0||e.truncate>r.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${r.byteLength}`);r=r.subarray(0,e.truncate)}return ao(jd,Gd(r))}const al={code:jd,
name:wA,encode:Gd,digest:mA};function vA(r){return r.buffer instanceof ArrayBuffer}function it(r){return vA(r)?r:r.slice()}
async function EA(r="P-256"){const e=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:r},!0,["sign","verify"]);return{
publicKey:await crypto.subtle.exportKey("jwk",e.publicKey),privateKey:await crypto.subtle.exportKey("jwk",e.privateKey)}}
async function AA(r,e,t){const n=await crypto.subtle.importKey("jwk",r,{name:"ECDSA",namedCurve:r.crv??"P-256"},!1,["sig\
n"]);t?.signal?.throwIfAborted();const s=await crypto.subtle.sign({name:"ECDSA",hash:{name:"SHA-256"}},n,it(e.subarray()));
return t?.signal?.throwIfAborted(),new Uint8Array(s,0,s.byteLength)}async function xA(r,e,t,n){const s=await crypto.subtle.
importKey("jwk",r,{name:"ECDSA",namedCurve:r.crv??"P-256"},!1,["verify"]);n?.signal?.throwIfAborted();const i=await crypto.
subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,it(e),it(t.subarray()));return n?.signal?.throwIfAborted(),i}function $t(r=0){
return new Uint8Array(r)}function lr(r=0){return new Uint8Array(r)}function SA(r){return r?.buffer instanceof ArrayBuffer}
function kA(r){if(SA(r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Fu(r,e){e==null&&
(e=r.reduce((s,i)=>s+i.length,0));const t=lr(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return kA(t)}const Wd=Symbol.
for("@achingbrain/uint8arraylist");function Vu(r,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function Ls(r){return!!r?.[Wd]}let Ye=class ei{bufs;length;[Wd]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>
0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(
e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(Ls(n)){t+=
n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array\
 or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())
if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Ls(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Vu(this.
bufs,e);return t.buf[t.index]}set(e,t){const n=Vu(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Ls(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return Fu(n,s)}subarray(e,t){const{bufs:n,length:s}=this.
_subList(e,t);return n.length===1?n[0]:Fu(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new ei;return i.
length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const h=e-a;n.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(
o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Ls(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const b=this.get(h+d);if(n[d]!==b){u=Math.max(1,d-a[b]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=lr(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=$t(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=$t(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=$t(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=lr(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=$t(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=$t(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=$t(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=$t(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=$t(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof ei)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!mt(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new ei;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const $A=ls({prefix:"9",name:"base10",alphabet:"012\
3456789"}),CA=Object.freeze(Object.defineProperty({__proto__:null,base10:$A},Symbol.toStringTag,{value:"Module"})),IA=X(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),BA=X({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),LA=Object.freeze(Object.defineProperty({__proto__:null,
base16:IA,base16upper:BA},Symbol.toStringTag,{value:"Module"})),DA=X({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
NA=Object.freeze(Object.defineProperty({__proto__:null,base2:DA},Symbol.toStringTag,{value:"Module"})),qd=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),UA=qd.reduce((r,e,t)=>(r[t]=e,r),[]),_A=qd.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function PA(r){return r.reduce((e,t)=>(e+=UA[t],e),"")}function TA(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=_A[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const MA=oo({prefix:"🚀",name:"\
base256emoji",encode:PA,decode:TA}),OA=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:MA},Symbol.toStringTag,
{value:"Module"})),RA=X({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567\
89+/",bitsPerChar:6}),FA=X({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01\
23456789+/=",bitsPerChar:6}),VA=X({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu\
vwxyz0123456789-_",bitsPerChar:6}),KA=X({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl\
mnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),zA=Object.freeze(Object.defineProperty({__proto__:null,base64:RA,base64pad:FA,
base64url:VA,base64urlpad:KA},Symbol.toStringTag,{value:"Module"})),HA=X({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
jA=Object.freeze(Object.defineProperty({__proto__:null,base8:HA},Symbol.toStringTag,{value:"Module"})),GA=oo({prefix:"\0",
name:"identity",encode:r=>SE(Pr(r)),decode:r=>Pr(xE(r))}),WA=Object.freeze(Object.defineProperty({__proto__:null,identity:GA},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const qA=20;function JA({name:r,code:e,encode:t,minDigestLength:n,
maxDigestLength:s}){return new XA(r,e,t,n,s)}let XA=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??qA,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Ku(n,this.code,t?.truncate):n.then(s=>Ku(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Ku(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return ao(e,r)}function YA(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const Jd=JA({name:"sha2-256",code:18,encode:YA("SHA-256")}),zu={...WA,...NA,...jA,...CA,...LA,...GE,
...qE,...ME,...zA,...OA};function Xd(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}
const Hu=Xd("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Yo=Xd("asci\
i","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=lr(r.
length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Yd={utf8:Hu,"utf-8":Hu,hex:zu.base16,latin1:Yo,ascii:Yo,
binary:Yo,...zu};function he(r,e="utf8"){const t=Yd[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${r}`)}function ju(r,e="utf8"){const t=Yd[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(r).substring(1)}const QA=parseInt("10000000",2);function ZA(r){let e=r.toString(16);e.
length%2===1&&(e="0"+e);const t=new Ye;for(let n=0;n<e.length;n+=2)t.append(Uint8Array.from([parseInt(`${e[n]}${e[n+1]}`,
16)]));return t}function lo(r){if(r.byteLength<128)return Uint8Array.from([r.byteLength]);const e=ZA(r.byteLength);return new Ye(
Uint8Array.from([e.byteLength|QA]),e)}function $e(r){const e=new Ye,t=128;return(r.subarray()[0]&t)===t&&e.append(Uint8Array.
from([0])),e.append(r),new Ye(Uint8Array.from([2]),lo(e),e)}function cl(r){const e=Uint8Array.from([0]),t=new Ye(e,r);return new Ye(
Uint8Array.from([3]),lo(t),t)}function ex(r){return new Ye(Uint8Array.from([4]),lo(r),r)}function yt(r,e=48){const t=new Ye;
for(const n of r)t.append(n);return new Ye(Uint8Array.from([e]),lo(t),t)}const tx=Uint8Array.from([6,8,42,134,72,206,61,
3,1,7]),rx=Uint8Array.from([6,5,43,129,4,0,34]),nx=Uint8Array.from([6,5,43,129,4,0,35]);function sx(r){return yt([$e(Uint8Array.
from([1])),ex(he(r.d??"","base64url")),yt([Qd(r.crv)],160),yt([cl(new Ye(Uint8Array.from([4]),he(r.x??"","base64url"),he(
r.y??"","base64url")))],161)]).subarray()}function ix(r){return yt([$e(Uint8Array.from([1])),yt([Qd(r.crv)],160),yt([cl(
new Ye(Uint8Array.from([4]),he(r.x??"","base64url"),he(r.y??"","base64url")))],161)]).subarray()}function Qd(r){if(r==="\
P-256")return tx;if(r==="P-384")return rx;if(r==="P-521")return nx;throw new B(`Invalid curve ${r}`)}async function ox(r="\
P-256"){const e=await EA(r);return new cx(e.privateKey)}let ax=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){
return this._raw==null&&(this._raw=ix(this.jwk)),this._raw}toMultihash(){return al.digest(dl(this))}toCID(){return co.createV1(
114,this.toMultihash())}toString(){return Le.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.
raw instanceof Uint8Array)?!1:mt(this.raw,e.raw)}async verify(e,t,n){return xA(this.jwk,t,e,n)}},cx=class{type="ECDSA";jwk;publicKey;_raw;constructor(e){
this.jwk=e,this.publicKey=new ax({crv:e.crv,ext:e.ext,key_ops:["verify"],kty:"EC",x:e.x,y:e.y})}get raw(){return this._raw==
null&&(this._raw=sx(this.jwk)),this._raw}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:mt(this.raw,e.raw)}async sign(e,t){
return AA(this.jwk,e,t)}},Gu=class extends Error{constructor(e="An error occurred while signing a message"){super(e),this.
name="SigningError"}},Wu=class extends Error{constructor(e="An error occurred while verifying a message"){super(e),this.
name="VerificationError"}},lx=class extends Error{constructor(e="Missing Web Crypto API"){super(e),this.name="WebCryptoM\
issingError"}};const Fe={get(r=globalThis){const e=r.crypto;if(e?.subtle==null)throw new lx("Missing Web Crypto API. The\
 most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more\
 information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-cr\
ypto-api");return e}},ux=32,ll=64,nc=32;let Lr;const Zd=(async()=>{try{return await Fe.get().subtle.generateKey({name:"E\
d25519"},!0,["sign","verify"]),!0}catch{return!1}})();function hx(){const r=or.utils.randomSecretKey(),e=or.getPublicKey(
r);return{privateKey:wx(r,e),publicKey:e}}async function fx(r,e){let t;r.length===ll?t=r.subarray(0,32):t=r;const n={crv:"\
Ed25519",kty:"OKP",x:ju(r.subarray(32),"base64url"),d:ju(t,"base64url"),ext:!0,key_ops:["sign"]},s=await Fe.get().subtle.
importKey("jwk",n,{name:"Ed25519"},!0,["sign"]),i=await Fe.get().subtle.sign({name:"Ed25519"},s,it(e instanceof Uint8Array?
e:e.subarray()));return new Uint8Array(i,0,i.byteLength)}function dx(r,e){const t=r.subarray(0,nc);return or.sign(e instanceof
Uint8Array?e:e.subarray(),t)}async function gx(r,e){return Lr==null&&(Lr=await Zd),Lr?fx(r,e):dx(r,e)}async function bx(r,e,t){
if(r.buffer instanceof ArrayBuffer){const n=await Fe.get().subtle.importKey("raw",r.buffer,{name:"Ed25519"},!1,["verify"]);
return await Fe.get().subtle.verify({name:"Ed25519"},n,it(e),it(t instanceof Uint8Array?t:t.subarray()))}throw new TypeError(
"WebCrypto does not support SharedArrayBuffer for Ed25519 keys")}function yx(r,e,t){return or.verify(e,t instanceof Uint8Array?
t:t.subarray(),r)}async function px(r,e,t){return Lr==null&&(Lr=await Zd),Lr?bx(r,e,t):yx(r,e,t)}function wx(r,e){const t=new Uint8Array(
ll);for(let n=0;n<nc;n++)t[n]=r[n],t[nc+n]=e[n];return t}function uo(r){return r==null?!1:typeof r.then=="function"&&typeof r.
catch=="function"&&typeof r.finally=="function"}let mx=class{type="Ed25519";raw;constructor(e){this.raw=eg(e,ux)}toMultihash(){
return al.digest(dl(this))}toCID(){return co.createV1(114,this.toMultihash())}toString(){return Le.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:mt(this.raw,e.raw)}verify(e,t,n){n?.signal?.
throwIfAborted();const s=px(this.raw,t,e);return uo(s)?s.then(i=>(n?.signal?.throwIfAborted(),i)):s}},vx=class{type="Ed2\
5519";raw;publicKey;constructor(e,t){this.raw=eg(e,ll),this.publicKey=new mx(t)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:mt(this.raw,e.raw)}sign(e,t){t?.signal?.throwIfAborted();const n=gx(this.raw,e);return uo(n)?n.then(s=>(t?.
signal?.throwIfAborted(),s)):(t?.signal?.throwIfAborted(),n)}};async function Ex(){const{privateKey:r,publicKey:e}=hx();
return new vx(r,e)}function eg(r,e){if(r=Uint8Array.from(r??[]),r.length!==e)throw new B(`Key must be a Uint8Array of le\
ngth ${e}, got ${r.length}`);return r}const Ax=Math.pow(2,7),xx=Math.pow(2,14),Sx=Math.pow(2,21),tg=Math.pow(2,28),rg=Math.
pow(2,35),ng=Math.pow(2,42),sg=Math.pow(2,49),me=128,Ct=127;function ul(r){if(r<Ax)return 1;if(r<xx)return 2;if(r<Sx)return 3;
if(r<tg)return 4;if(r<rg)return 5;if(r<ng)return 6;if(r<sg)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function kx(r,e,t=0){switch(ul(r)){case 8:e[t++]=r&255|me,r/=128;case 7:
e[t++]=r&255|me,r/=128;case 6:e[t++]=r&255|me,r/=128;case 5:e[t++]=r&255|me,r/=128;case 4:e[t++]=r&255|me,r>>>=7;case 3:
e[t++]=r&255|me,r>>>=7;case 2:e[t++]=r&255|me,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function $x(r,e){let t=r[e],n=0;if(n+=t&Ct,t<me||(t=r[e+1],n+=(t&Ct)<<7,t<me)||(t=r[e+2],n+=(t&Ct)<<14,t<
me)||(t=r[e+3],n+=(t&Ct)<<21,t<me)||(t=r[e+4],n+=(t&Ct)*tg,t<me)||(t=r[e+5],n+=(t&Ct)*rg,t<me)||(t=r[e+6],n+=(t&Ct)*ng,t<
me)||(t=r[e+7],n+=(t&Ct)*sg,t<me))return n;throw new RangeError("Could not decode varint")}const hl=new Float32Array([-0]),
Pt=new Uint8Array(hl.buffer);function Cx(r,e,t){hl[0]=r,e[t]=Pt[0],e[t+1]=Pt[1],e[t+2]=Pt[2],e[t+3]=Pt[3]}function Ix(r,e){
return Pt[0]=r[e],Pt[1]=r[e+1],Pt[2]=r[e+2],Pt[3]=r[e+3],hl[0]}const fl=new Float64Array([-0]),fe=new Uint8Array(fl.buffer);
function Bx(r,e,t){fl[0]=r,e[t]=fe[0],e[t+1]=fe[1],e[t+2]=fe[2],e[t+3]=fe[3],e[t+4]=fe[4],e[t+5]=fe[5],e[t+6]=fe[6],e[t+
7]=fe[7]}function Lx(r,e){return fe[0]=r[e],fe[1]=r[e+1],fe[2]=r[e+2],fe[3]=r[e+3],fe[4]=r[e+4],fe[5]=r[e+5],fe[6]=r[e+6],
fe[7]=r[e+7],fl[0]}const Dx=BigInt(Number.MAX_SAFE_INTEGER),Nx=BigInt(Number.MIN_SAFE_INTEGER);let ut=class qt{lo;hi;constructor(e,t){
this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=
n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return rr;if(e<Dx&&e>Nx)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>qu&&(s=0n,++n>qu&&(n=0n))),new qt(Number(s),Number(n))}static fromNumber(e){
if(e===0)return rr;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new qt(n,s)}static from(e){return typeof e=="number"?qt.fromNumber(e):typeof e=="bigint"?qt.
fromBigInt(e):typeof e=="string"?qt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new qt(e.low>>>0,e.high>>>0):rr}};const rr=new ut(
0,0);rr.toBigInt=function(){return 0n};rr.zzEncode=rr.zzDecode=function(){return this};rr.length=function(){return 1};const qu=4294967296n;
function Ux(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function _x(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function ig(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function He(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function Ds(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}let Px=class{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=it(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,He(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw He(this,4);return Ds(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw He(
this,4);return Ds(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw He(this,4);const e=Ix(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw He(this,4);const e=Lx(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw He(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return _x(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw He(this,e);this.pos+=e}else do if(this.pos>=this.len)throw He(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new ut(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw He(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw He(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw He(this,8);const e=Ds(this.buf,this.pos+=4),t=Ds(this.buf,this.pos+=4);return new ut(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=$x(this.buf,this.pos);
return this.pos+=ul(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}};function og(r){return new Px(r instanceof Uint8Array?
r:r.subarray())}function ag(r,e,t){const n=og(r);return e.decode(n,void 0,t)}function Tx(r){let n,s=8192;return function(o){
if(o<1||o>4096)return lr(o);s+o>8192&&(n=lr(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let En=class{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}};function Qo(){}let Mx=class{head;tail;len;next;constructor(e){this.head=
e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}};const Ox=Tx();function Rx(r){return globalThis.Buffer!=null?
lr(r):Ox(r)}let sc=class{len;head;tail;states;constructor(){this.len=0,this.head=new En(Qo,0,0),this.tail=this.head,this.
states=null}_push(e,t,n){return this.tail=this.tail.next=new En(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.
tail=this.tail.next=new Vx((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(
Ns,10,ut.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=ut.fromBigInt(e);
return this._push(Ns,t.length(),t)}uint64Number(e){return this._push(kx,ul(e),e)}uint64String(e){return this.uint64(BigInt(
e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){
const t=ut.fromBigInt(e).zzEncode();return this._push(Ns,t.length(),t)}sint64Number(e){const t=ut.fromNumber(e).zzEncode();
return this._push(Ns,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Zo,1,e?1:0)}fixed32(e){
return this._push(sn,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=ut.fromBigInt(e);return this._push(sn,
4,t.lo)._push(sn,4,t.hi)}fixed64Number(e){const t=ut.fromNumber(e);return this._push(sn,4,t.lo)._push(sn,4,t.hi)}fixed64String(e){
return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){
return this.fixed64String(e)}float(e){return this._push(Cx,4,e)}double(e){return this._push(Bx,8,e)}bytes(e){const t=e.length>>>
0;return t===0?this._push(Zo,1,0):this.uint32(t)._push(Kx,t,e)}string(e){const t=Ux(e);return t!==0?this.uint32(t)._push(
ig,t,e):this._push(Zo,1,0)}fork(){return this.states=new Mx(this),this.head=this.tail=new En(Qo,0,0),this.len=0,this}reset(){
return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.
states.next):(this.head=this.tail=new En(Qo,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.
reset().uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=Rx(this.
len);let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}};function Zo(r,e,t){e[t]=r&255}function Fx(r,e,t){
for(;r>127;)e[t++]=r&127|128,r>>>=7;e[t]=r}let Vx=class extends En{next;constructor(e,t){super(Fx,e,t),this.next=void 0}};
function Ns(r,e,t){for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&
127|128,r.lo=r.lo>>>7;e[t++]=r.lo}function sn(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function Kx(r,e,t){
e.set(r,t)}globalThis.Buffer!=null&&(sc.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this.
_push(zx,e,r),this},sc.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this.
_push(Hx,e,r),this});function zx(r,e,t){e.set(r,t)}function Hx(r,e,t){r.length<40?ig(r,e,t):e.utf8Write!=null?e.utf8Write(
r,t):e.set(he(r),t)}function jx(){return new sc}function cg(r,e){const t=jx();return e.encode(r,t,{lengthDelimited:!1}),
t.finish()}function*lg(r,e,t){const n=og(r);yield*e.stream(n,void 0,".",t)}const ug={VARINT:0,LENGTH_DELIMITED:2};function hg(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function Gx(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return hg("enum",ug.VARINT,t,n,s)}function fg(r,e,t){return hg("message",ug.LENGTH_DELIMITED,r,e,
t)}var Oe;(function(r){r.RSA="RSA",r.Ed25519="Ed25519",r.secp256k1="secp256k1",r.ECDSA="ECDSA"})(Oe||(Oe={}));var ic;(function(r){
r[r.RSA=0]="RSA",r[r.Ed25519=1]="Ed25519",r[r.secp256k1=2]="secp256k1",r[r.ECDSA=3]="ECDSA"})(ic||(ic={}));(function(r){
r.codec=()=>Gx(ic)})(Oe||(Oe={}));var Ai;(function(r){let e;r.codec=()=>(e==null&&(e=fg((i,o,a={})=>{a.lengthDelimited!==
!1&&o.fork(),i.Type!=null&&(o.uint32(8),Oe.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Oe.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Oe.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return cg(i,r.codec())}r.encode=t;function n(i,o){return ag(i,r.codec(),o)}r.decode=n;function s(i,o){return lg(i,r.codec(),
o)}r.stream=s})(Ai||(Ai={}));var Ju;(function(r){let e;r.codec=()=>(e==null&&(e=fg((i,o,a={})=>{a.lengthDelimited!==!1&&
o.fork(),i.Type!=null&&(o.uint32(8),Oe.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=Oe.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:Oe.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return cg(i,r.codec())}r.encode=t;function n(i,o){return ag(i,r.codec(),o)}r.decode=n;function s(i,o){return lg(i,r.codec(),
o)}r.stream=s})(Ju||(Ju={}));let Wx=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){
return this._raw==null&&(this._raw=dg(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return co.createV1(
114,this._multihash)}toString(){return Le.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:mt(this.raw,e.raw)}verify(e,t,n){return rS(this.jwk,t,e,n)}},qx=class{type="RSA";jwk;_raw;publicKey;constructor(e,t){
this.jwk=e,this.publicKey=t}get raw(){return this._raw==null&&(this._raw=Qx(this.jwk)),this._raw}equals(e){return e==null||
!(e.raw instanceof Uint8Array)?!1:mt(this.raw,e.raw)}sign(e,t){return tS(this.jwk,e,t)}};const Jx=8192,Xx=18,Yx=Uint8Array.
from([48,13,6,9,42,134,72,134,247,13,1,1,1,5,0]);function Qx(r){if(r.n==null||r.e==null||r.d==null||r.p==null||r.q==null||
r.dp==null||r.dq==null||r.qi==null)throw new B("JWK was missing components");return yt([$e(Uint8Array.from([0])),$e(he(r.
n,"base64url")),$e(he(r.e,"base64url")),$e(he(r.d,"base64url")),$e(he(r.p,"base64url")),$e(he(r.q,"base64url")),$e(he(r.
dp,"base64url")),$e(he(r.dq,"base64url")),$e(he(r.qi,"base64url"))]).subarray()}function dg(r){if(r.n==null||r.e==null)throw new B(
"JWK was missing components");return yt([Yx,cl(yt([$e(he(r.n,"base64url")),$e(he(r.e,"base64url"))]))]).subarray()}async function Zx(r){
if(r>Jx)throw new B("Key size is too large");const e=await eS(r),t=Zt(Ai.encode({Type:Oe.RSA,Data:dg(e.publicKey)})),n=ao(
Xx,t);return new qx(e.privateKey,new Wx(e.publicKey,n))}async function eS(r,e){const t=await Fe.get().subtle.generateKey(
{name:"RSASSA-PKCS1-v1_5",modulusLength:r,publicExponent:new Uint8Array([1,0,1]),hash:{name:"SHA-256"}},!0,["sign","veri\
fy"]),n=await nS(t);return{privateKey:n[0],publicKey:n[1]}}async function tS(r,e,t){const n=await Fe.get().subtle.importKey(
"jwk",r,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["sign"]);t?.signal?.throwIfAborted();const s=await Fe.get().
subtle.sign({name:"RSASSA-PKCS1-v1_5"},n,it(e instanceof Uint8Array?e:e.subarray()));return t?.signal?.throwIfAborted(),
new Uint8Array(s,0,s.byteLength)}async function rS(r,e,t,n){const s=await Fe.get().subtle.importKey("jwk",r,{name:"RSASS\
A-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);n?.signal?.throwIfAborted();const i=await Fe.get().subtle.verify({name:"\
RSASSA-PKCS1-v1_5"},s,it(e),it(t instanceof Uint8Array?t:t.subarray()));return n?.signal?.throwIfAborted(),i}async function nS(r,e){
if(r.privateKey==null||r.publicKey==null)throw new B("Private and public key are required");return await Promise.all([Fe.
get().subtle.exportKey("jwk",r.privateKey),Fe.get().subtle.exportKey("jwk",r.publicKey)])}function sS(r,e,t){const n=Jd.
digest(e instanceof Uint8Array?e:e.subarray());if(uo(n))return n.then(({digest:s})=>(t?.signal?.throwIfAborted(),K.sign(
s,r,{prehash:!1,format:"der"}))).catch(s=>{throw s.name==="AbortError"?s:new Gu(String(s))});try{return K.sign(n.digest,
r,{prehash:!1,format:"der"})}catch(s){throw new Gu(String(s))}}function iS(r,e,t,n){const s=Jd.digest(t instanceof Uint8Array?
t:t.subarray());if(uo(s))return s.then(({digest:i})=>(n?.signal?.throwIfAborted(),K.verify(e,i,r,{prehash:!1,format:"der"}))).
catch(i=>{throw i.name==="AbortError"?i:new Wu(String(i))});try{return n?.signal?.throwIfAborted(),K.verify(e,s.digest,r,
{prehash:!1,format:"der"})}catch(i){throw new Wu(String(i))}}let oS=class{type="secp256k1";raw;_key;constructor(e){this.
_key=hS(e),this.raw=lS(this._key)}toMultihash(){return al.digest(dl(this))}toCID(){return co.createV1(114,this.toMultihash())}toString(){
return Le.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:mt(this.
raw,e.raw)}verify(e,t,n){return iS(this._key,t,e,n)}},aS=class{type="secp256k1";raw;publicKey;constructor(e,t){this.raw=
uS(e),this.publicKey=new oS(t??fS(e))}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:mt(this.raw,e.raw)}sign(e,t){
return sS(this.raw,e,t)}};async function cS(){const r=dS();return new aS(r)}function lS(r){return K.Point.fromBytes(r).toBytes()}
function uS(r){try{return K.getPublicKey(r,!0),r}catch(e){throw new Gi(String(e))}}function hS(r){try{return K.Point.fromBytes(
r),r}catch(e){throw new Wi(String(e))}}function fS(r){try{return K.getPublicKey(r,!0)}catch(e){throw new Gi(String(e))}}
function dS(){return K.utils.randomSecretKey()}async function gS(r,e){if(r==="Ed25519")return Ex();if(r==="secp256k1")return cS();
if(r==="RSA")return Zx(bS());if(r==="ECDSA")return ox(yS());throw new qi}function dl(r){return Ai.encode({Type:Oe[r.type],
Data:r.raw})}function bS(r){return 2048}function yS(r){return"P-256"}function pS(r){return r.buffer instanceof ArrayBuffer}
function F(r){return pS(r)?r:r.slice()}class Xu extends Error{constructor(e="An error occurred while signing a message"){
super(e),this.name="SigningError"}}let Yu=class extends Error{constructor(e="An error occurred while verifying a message"){
super(e),this.name="VerificationError"}},wS=class extends Error{constructor(e="Missing Web Crypto API"){super(e),this.name=
"WebCryptoMissingError"}};const Ve={get(r=globalThis){const e=r.crypto;if(e?.subtle==null)throw new wS("Missing Web Cryp\
to API. The most likely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS\
). For more information and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/READM\
E.md#web-crypto-api");return e}};function vt(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<
r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function mS(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;
for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Tr(r){if(r instanceof Uint8Array&&r.constructor.
name==="Uint8Array")return Hn(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return Hn(
new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function vS(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const Qu=4096;function ES(r){const e=r.
length;if(e<=Qu)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=Qu));return t}function AS(r){return r?.buffer instanceof ArrayBuffer}function Hn(r){return AS(r)?r:r.slice()}
function xS(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===
0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=
256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;
for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.
length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&
S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){
for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var SS=xS,kS=SS;let $S=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},CS=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return gg(this,e)}},
IS=class{decoders;constructor(e){this.decoders=e}or(e){return gg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function gg(r,e){return new IS({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let BS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new $S(e,t,n),this.decoder=new CS(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function ho({name:r,prefix:e,encode:t,decode:n}){return new BS(r,e,t,
n)}function us({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=kS(t,r,n);return ho({prefix:e,
name:r,encode:s,decode:o=>Tr(i(o))})}function LS(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function DS(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function NS(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Y({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=NS(n,s);return ho(
{prefix:e,name:r,encode(o){return DS(o,n,t)},decode(o){return LS(o,i,t,r)}})}const Se=us({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),US=us({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),_S=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Se,
base58flickr:US},Symbol.toStringTag,{value:"Module"})),Bn=Y({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwx\
yz234567",bitsPerChar:5,caseInsensitive:!0}),PS=Y({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234\
567",bitsPerChar:5,caseInsensitive:!0}),TS=Y({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,
caseInsensitive:!0}),MS=Y({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),
OS=Y({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),RS=Y({prefix:"\
V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),FS=Y({prefix:"t",
name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),VS=Y({prefix:"T",name:"\
base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),KS=Y({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),zS=Object.freeze(Object.defineProperty({__proto__:null,
base32:Bn,base32hex:OS,base32hexpad:FS,base32hexpadupper:VS,base32hexupper:RS,base32pad:TS,base32padupper:MS,base32upper:PS,
base32z:KS},Symbol.toStringTag,{value:"Module"})),ti=us({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),HS=us({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
jS=Object.freeze(Object.defineProperty({__proto__:null,base36:ti,base36upper:HS},Symbol.toStringTag,{value:"Module"}));var GS=bg,
Zu=128,WS=-128,qS=Math.pow(2,31);function bg(r,e,t){e=e||[],t=t||0;for(var n=t;r>=qS;)e[t++]=r&255|Zu,r/=128;for(;r&WS;)
e[t++]=r&255|Zu,r>>>=7;return e[t]=r|0,bg.bytes=t-n+1,e}var JS=oc,XS=128,eh=127;function oc(r,n){var t=0,n=n||0,s=0,i=n,
o,a=r.length;do{if(i>=a)throw oc.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&eh)<<s:(o&eh)*Math.
pow(2,s),s+=7}while(o>=XS);return oc.bytes=i-n,t}var YS=Math.pow(2,7),QS=Math.pow(2,14),ZS=Math.pow(2,21),ek=Math.pow(2,
28),tk=Math.pow(2,35),rk=Math.pow(2,42),nk=Math.pow(2,49),sk=Math.pow(2,56),ik=Math.pow(2,63),ok=function(r){return r<YS?
1:r<QS?2:r<ZS?3:r<ek?4:r<tk?5:r<rk?6:r<nk?7:r<sk?8:r<ik?9:10},ak={encode:GS,decode:JS,encodingLength:ok},xi=ak;function ac(r,e=0){
const t=xi.decode(r,e),n=xi.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[t,n]}function Si(r,e,t=0){return xi.encode(r,e,t),e}function ki(r){return xi.
encodingLength(r)}function fo(r,e){const t=e.byteLength,n=ki(r),s=n+ki(t),i=new Uint8Array(s+t);return Si(r,i,0),Si(t,i,
n),i.set(e,s),new gl(r,t,e,i)}function ck(r){const e=Tr(r),[t,n]=ac(e),[s,i]=ac(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new gl(t,s,o,e)}function lk(r,e){if(r===e)return!0;{const t=e;return r.code===
t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&mS(r.bytes,t.bytes)}}let gl=class{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=Hn(n),this.bytes=Hn(s)}};function th(r,e){const{bytes:t,version:n}=r;switch(n){case 0:
return hk(t,cc(r),e??Se.encoder);default:return fk(t,cc(r),e??Bn.encoder)}}const rh=new WeakMap;function cc(r){const e=rh.
get(r);if(e==null){const t=new Map;return rh.set(r,t),t}return e}let go=class ie{code;version;multihash;bytes;"/";constructor(e,t,n,s){
this.code=t,this.version=e,this.multihash=n,this.bytes=Hn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==on)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==dk)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return ie.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,n=fo(e,t);return ie.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return ie.equals(this,e)}static equals(e,t){const n=t;return n!=
null&&e.code===n.code&&e.version===n.version&&lk(e.multihash,n.multihash)}toString(e){return th(this,e)}toJSON(){return{
"/":th(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof ie)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:n,code:s,multihash:i,bytes:o}=t;return new ie(n,s,i,o??nh(n,s,i.bytes))}else if(t[gk]===!0){const{
version:n,multihash:s,code:i}=t,o=ck(s);return ie.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==on)throw new Error(`Version 0 CID must use dag-pb (code: ${on}) block encoding`);return new ie(
e,t,n,n.bytes)}case 1:{const s=nh(e,t,n.bytes);return new ie(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){
return ie.create(0,on,e)}static createV1(e,t){return ie.create(1,e,t)}static decode(e){const[t,n]=ie.decodeFirst(e);if(n.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=ie.inspectBytes(e),n=t.size-t.multihashSize,
s=Tr(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new gl(t.multihashCode,t.digestSize,i,s);return[t.version===0?ie.createV0(o):ie.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=ac(e.subarray(t));return t+=d,h};let s=n(),
i=on;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=uk(e,t),
i=ie.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return cc(
i).set(n,e),i}};function uk(r,e){switch(r[0]){case"Q":{const t=e??Se;return[Se.prefix,t.decode(`${Se.prefix}${r}`)]}case Se.
prefix:{const t=e??Se;return[Se.prefix,t.decode(r)]}case Bn.prefix:{const t=e??Bn;return[Bn.prefix,t.decode(r)]}case ti.
prefix:{const t=e??ti;return[ti.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function hk(r,e,t){const{prefix:n}=t;if(n!==
Se.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function fk(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const on=112,dk=18;function nh(r,e,t){const n=ki(r),s=n+ki(e),i=new Uint8Array(s+t.
byteLength);return Si(r,i,0),Si(e,i,n),i.set(t,s),i}const gk=Symbol.for("@ipld/js-cid/CID"),yg=0,bk="identity",pg=Tr;function yk(r,e){
if(e?.truncate!=null&&e.truncate!==r.byteLength){if(e.truncate<0||e.truncate>r.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${r.byteLength}`);r=r.subarray(0,e.truncate)}return fo(yg,pg(r))}const bl={code:yg,
name:bk,encode:pg,digest:yk},pk="1.2.840.10045.3.1.7",wk="1.3.132.0.34",mk="1.3.132.0.35";async function vk(r,e,t){const n=await crypto.
subtle.importKey("jwk",r,{name:"ECDSA",namedCurve:r.crv??"P-256"},!1,["sign"]);t?.signal?.throwIfAborted();const s=await crypto.
subtle.sign({name:"ECDSA",hash:{name:"SHA-256"}},n,F(e.subarray()));return t?.signal?.throwIfAborted(),new Uint8Array(s,
0,s.byteLength)}async function Ek(r,e,t,n){const s=await crypto.subtle.importKey("jwk",r,{name:"ECDSA",namedCurve:r.crv??
"P-256"},!1,["verify"]);n?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},
s,F(e),F(t.subarray()));return n?.signal?.throwIfAborted(),i}function It(r=0){return new Uint8Array(r)}function ur(r=0){
return new Uint8Array(r)}function Ak(r){return r?.buffer instanceof ArrayBuffer}function xk(r){if(Ak(r))return r;const e=r.
slice();return new Uint8Array(e.buffer,0,e.byteLength)}function lc(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=ur(
e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return xk(t)}const wg=Symbol.for("@achingbrain/uint8arraylist");function sh(r,e){
if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{
buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}function Us(r){return!!r?.[wg]}let Qe=class ri{bufs;length;[wg]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.
bufs.push(n);else if(Us(n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Us(n))t+=n.byteLength,
this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=sh(this.bufs,e);return t.buf[t.index]}set(e,t){const n=sh(this.bufs,e);n.buf[n.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Us(e))for(let n=0;n<e.length;n++)this.set(
t+n,e.get(n));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return lc(n,s)}subarray(e,t){
const{bufs:n,length:s}=this._subList(e,t);return n.length===1?n[0]:lc(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(
e,t),i=new ri;return i.length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.
length+t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&
t===this.length)return{bufs:[...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}
const h=e-a;n.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){
if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Us(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=n.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const b=this.get(h+d);if(n[d]!==b){u=Math.max(1,d-a[b]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const n=ur(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=It(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=It(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=It(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const n=ur(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(
0,t),this.write(n,e)}getUint16(e,t){const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).
getUint16(0,t)}setUint16(e,t,n){const s=It(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(
s,e)}getUint32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){
const s=It(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.
subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=It(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=It(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=It(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof ri)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!vt(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const n=new ri;return n.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const Sk=us({prefix:"9",name:"\
base10",alphabet:"0123456789"}),kk=Object.freeze(Object.defineProperty({__proto__:null,base10:Sk},Symbol.toStringTag,{value:"\
Module"})),$k=Y({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Ck=Y({prefix:"F",
name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Ik=Object.freeze(Object.defineProperty(
{__proto__:null,base16:$k,base16upper:Ck},Symbol.toStringTag,{value:"Module"})),Bk=Y({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),Lk=Object.freeze(Object.defineProperty({__proto__:null,base2:Bk},Symbol.toStringTag,{value:"Module"})),
mg=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Dk=mg.reduce((r,e,t)=>(r[t]=e,r),[]),Nk=mg.reduce((r,e,t)=>{const n=e.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${e}`);return r[n]=t,r},[]);function Uk(r){return r.reduce((e,t)=>(e+=
Dk[t],e),"")}function _k(r){const e=[];for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=Nk[n];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const Pk=ho({prefix:"🚀",name:"base256emoji",encode:Uk,decode:_k}),Tk=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:Pk},Symbol.toStringTag,{value:"Module"})),bo=Y({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWX\
YZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Mk=Y({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQR\
STUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Ok=Y({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Rk=Y({prefix:"U",name:"base64urlpad",alphabet:"AB\
CDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Fk=Object.freeze(Object.defineProperty(
{__proto__:null,base64:bo,base64pad:Mk,base64url:Ok,base64urlpad:Rk},Symbol.toStringTag,{value:"Module"})),Vk=Y({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Kk=Object.freeze(Object.defineProperty({__proto__:null,base8:Vk},Symbol.
toStringTag,{value:"Module"})),zk=ho({prefix:"\0",name:"identity",encode:r=>ES(Tr(r)),decode:r=>Tr(vS(r))}),Hk=Object.freeze(
Object.defineProperty({__proto__:null,identity:zk},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const jk=20;function Gk({name:r,code:e,encode:t,minDigestLength:n,maxDigestLength:s}){return new Wk(r,e,t,n,s)}let Wk=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??jk,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
ih(n,this.code,t?.truncate):n.then(s=>ih(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function ih(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return fo(e,r)}function qk(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const yl=Gk({name:"sha2-256",code:18,encode:qk("SHA-256")}),oh={...Hk,...Lk,...Kk,...kk,...Ik,...zS,
...jS,..._S,...Fk,...Tk};function vg(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}
const ah=vg("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),ea=vg("asci\
i","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=ur(r.
length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Eg={utf8:ah,"utf-8":ah,hex:oh.base16,latin1:ea,ascii:ea,
binary:ea,...oh};function P(r,e="utf8"){const t=Eg[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${r}`)}function T(r,e="utf8"){const t=Eg[e];if(t==null)throw new Error(`Unsupported encoding \
"${e}"`);return t.encoder.encode(r).substring(1)}const Jk=parseInt("11111",2),uc=parseInt("10000000",2),Xk=parseInt("011\
11111",2),ch={0:an,1:an,2:Yk,3:e$,4:t$,5:Zk,6:Qk,16:an,22:an,48:an};function yo(r,e={offset:0}){const t=r[e.offset]&Jk;if(e.
offset++,ch[t]!=null)return ch[t](r,e);throw new Error("No decoder for tag "+t)}function hs(r,e){let t=0;if((r[e.offset]&
uc)===uc){const n=r[e.offset]&Xk;let s="0x";e.offset++;for(let i=0;i<n;i++,e.offset++){if(e.offset>=r.byteLength)throw new Error(
"invalid DER element length");s+=r[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=r[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>r.byteLength-e.offset)throw new Error("invalid DER element length");return t}function an(r,e){
hs(r,e);const t=[];for(;!(e.offset>=r.byteLength);){const n=yo(r,e);if(n===null)break;t.push(n)}return t}function Yk(r,e){
const t=hs(r,e),n=e.offset,s=e.offset+t,i=[];for(let o=n;o<s;o++)o===n&&r[o]===0||i.push(r[o]);return e.offset+=t,Uint8Array.
from(i)}function Qk(r,e){const t=hs(r,e),n=e.offset+t,s=r[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<n;){const l=r[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function Zk(r,e){return e.offset++,null}function e$(r,e){
const t=hs(r,e),n=r[e.offset];e.offset++;const s=r.subarray(e.offset,e.offset+t-1);if(e.offset+=t,n!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function t$(r,e){const t=hs(r,e),n=r.subarray(e.offset,e.offset+t);
return e.offset+=t,n}function r$(r){let e=r.toString(16);e.length%2===1&&(e="0"+e);const t=new Qe;for(let n=0;n<e.length;n+=
2)t.append(Uint8Array.from([parseInt(`${e[n]}${e[n+1]}`,16)]));return t}function po(r){if(r.byteLength<128)return Uint8Array.
from([r.byteLength]);const e=r$(r.byteLength);return new Qe(Uint8Array.from([e.byteLength|uc]),e)}function Ce(r){const e=new Qe,
t=128;return(r.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(r),new Qe(Uint8Array.from([2]),po(e),e)}function pl(r){
const e=Uint8Array.from([0]),t=new Qe(e,r);return new Qe(Uint8Array.from([3]),po(t),t)}function n$(r){return new Qe(Uint8Array.
from([4]),po(r),r)}function pt(r,e=48){const t=new Qe;for(const n of r)t.append(n);return new Qe(Uint8Array.from([e]),po(
t),t)}const s$=Uint8Array.from([6,8,42,134,72,206,61,3,1,7]),i$=Uint8Array.from([6,5,43,129,4,0,34]),o$=Uint8Array.from(
[6,5,43,129,4,0,35]),a$={ext:!0,kty:"EC",crv:"P-256"},c$={ext:!0,kty:"EC",crv:"P-384"},l$={ext:!0,kty:"EC",crv:"P-521"},
ta=32,ra=48,na=66;function u$(r){const e=yo(r);return Ag(e)}function Ag(r){const e=r[1],t=T(e,"base64url"),n=r[2][1][0],
s=1;let i,o;if(e.byteLength===ta)return i=T(n.subarray(s,s+ta),"base64url"),o=T(n.subarray(s+ta),"base64url"),new sa({...a$,
key_ops:["sign"],d:t,x:i,y:o});if(e.byteLength===ra)return i=T(n.subarray(s,s+ra),"base64url"),o=T(n.subarray(s+ra),"bas\
e64url"),new sa({...c$,key_ops:["sign"],d:t,x:i,y:o});if(e.byteLength===na)return i=T(n.subarray(s,s+na),"base64url"),o=
T(n.subarray(s+na),"base64url"),new sa({...l$,key_ops:["sign"],d:t,x:i,y:o});throw new B(`Private key length was wrong l\
ength, got ${e.byteLength}, expected 32, 48 or 66`)}function h$(r){return pt([Ce(Uint8Array.from([1])),n$(P(r.d??"","bas\
e64url")),pt([xg(r.crv)],160),pt([pl(new Qe(Uint8Array.from([4]),P(r.x??"","base64url"),P(r.y??"","base64url")))],161)]).
subarray()}function f$(r){return pt([Ce(Uint8Array.from([1])),pt([xg(r.crv)],160),pt([pl(new Qe(Uint8Array.from([4]),P(r.
x??"","base64url"),P(r.y??"","base64url")))],161)]).subarray()}function xg(r){if(r==="P-256")return s$;if(r==="P-384")return i$;
if(r==="P-521")return o$;throw new B(`Invalid curve ${r}`)}let d$=class{type="ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){
return this._raw==null&&(this._raw=f$(this.jwk)),this._raw}toMultihash(){return bl.digest(El(this))}toCID(){return go.createV1(
114,this.toMultihash())}toString(){return Se.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.
raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}async verify(e,t,n){return Ek(this.jwk,t,e,n)}};class sa{type="ECDSA";jwk;publicKey;_raw;constructor(e){
this.jwk=e,this.publicKey=new d$({crv:e.crv,ext:e.ext,key_ops:["verify"],kty:"EC",x:e.x,y:e.y})}get raw(){return this._raw==
null&&(this._raw=h$(this.jwk)),this._raw}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}async sign(e,t){
return vk(this.jwk,e,t)}}const hc=32,ht=64,g$=32;let Dr;const Sg=(async()=>{try{return await Ve.get().subtle.generateKey(
{name:"Ed25519"},!0,["sign","verify"]),!0}catch{return!1}})();async function b$(r,e){let t;r.length===ht?t=r.subarray(0,
32):t=r;const n={crv:"Ed25519",kty:"OKP",x:T(r.subarray(32),"base64url"),d:T(t,"base64url"),ext:!0,key_ops:["sign"]},s=await Ve.
get().subtle.importKey("jwk",n,{name:"Ed25519"},!0,["sign"]),i=await Ve.get().subtle.sign({name:"Ed25519"},s,F(e instanceof
Uint8Array?e:e.subarray()));return new Uint8Array(i,0,i.byteLength)}function y$(r,e){const t=r.subarray(0,g$);return or.
sign(e instanceof Uint8Array?e:e.subarray(),t)}async function p$(r,e){return Dr==null&&(Dr=await Sg),Dr?b$(r,e):y$(r,e)}
async function w$(r,e,t){if(r.buffer instanceof ArrayBuffer){const n=await Ve.get().subtle.importKey("raw",r.buffer,{name:"\
Ed25519"},!1,["verify"]);return await Ve.get().subtle.verify({name:"Ed25519"},n,F(e),F(t instanceof Uint8Array?t:t.subarray()))}
throw new TypeError("WebCrypto does not support SharedArrayBuffer for Ed25519 keys")}function m$(r,e,t){return or.verify(
e,t instanceof Uint8Array?t:t.subarray(),r)}async function v$(r,e,t){return Dr==null&&(Dr=await Sg),Dr?w$(r,e,t):m$(r,e,
t)}function wo(r){return r==null?!1:typeof r.then=="function"&&typeof r.catch=="function"&&typeof r.finally=="function"}
let E$=class{type="Ed25519";raw;constructor(e){this.raw=$i(e,hc)}toMultihash(){return bl.digest(El(this))}toCID(){return go.
createV1(114,this.toMultihash())}toString(){return Se.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==
null||!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}verify(e,t,n){n?.signal?.throwIfAborted();const s=v$(this.raw,
t,e);return wo(s)?s.then(i=>(n?.signal?.throwIfAborted(),i)):s}};class lh{type="Ed25519";raw;publicKey;constructor(e,t){
this.raw=$i(e,ht),this.publicKey=new E$(t)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}sign(e,t){
t?.signal?.throwIfAborted();const n=p$(this.raw,e);return wo(n)?n.then(s=>(t?.signal?.throwIfAborted(),s)):(t?.signal?.throwIfAborted(),
n)}}function kg(r){if(r.length>ht){r=$i(r,ht+hc);const n=r.subarray(0,ht),s=r.subarray(ht,r.length);return new lh(n,s)}r=
$i(r,ht);const e=r.subarray(0,ht),t=r.subarray(hc);return new lh(e,t)}function $i(r,e){if(r=Uint8Array.from(r??[]),r.length!==
e)throw new B(`Key must be a Uint8Array of length ${e}, got ${r.length}`);return r}const A$=Math.pow(2,7),x$=Math.pow(2,
14),S$=Math.pow(2,21),$g=Math.pow(2,28),Cg=Math.pow(2,35),Ig=Math.pow(2,42),Bg=Math.pow(2,49),ve=128,Bt=127;function wl(r){
if(r<A$)return 1;if(r<x$)return 2;if(r<S$)return 3;if(r<$g)return 4;if(r<Cg)return 5;if(r<Ig)return 6;if(r<Bg)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function k$(r,e,t=0){
switch(wl(r)){case 8:e[t++]=r&255|ve,r/=128;case 7:e[t++]=r&255|ve,r/=128;case 6:e[t++]=r&255|ve,r/=128;case 5:e[t++]=r&
255|ve,r/=128;case 4:e[t++]=r&255|ve,r>>>=7;case 3:e[t++]=r&255|ve,r>>>=7;case 2:e[t++]=r&255|ve,r>>>=7;case 1:{e[t++]=r&
255,r>>>=7;break}default:throw new Error("unreachable")}return e}function $$(r,e){let t=r[e],n=0;if(n+=t&Bt,t<ve||(t=r[e+
1],n+=(t&Bt)<<7,t<ve)||(t=r[e+2],n+=(t&Bt)<<14,t<ve)||(t=r[e+3],n+=(t&Bt)<<21,t<ve)||(t=r[e+4],n+=(t&Bt)*$g,t<ve)||(t=r[e+
5],n+=(t&Bt)*Cg,t<ve)||(t=r[e+6],n+=(t&Bt)*Ig,t<ve)||(t=r[e+7],n+=(t&Bt)*Bg,t<ve))return n;throw new RangeError("Could n\
ot decode varint")}const ml=new Float32Array([-0]),Tt=new Uint8Array(ml.buffer);function C$(r,e,t){ml[0]=r,e[t]=Tt[0],e[t+
1]=Tt[1],e[t+2]=Tt[2],e[t+3]=Tt[3]}function I$(r,e){return Tt[0]=r[e],Tt[1]=r[e+1],Tt[2]=r[e+2],Tt[3]=r[e+3],ml[0]}const vl=new Float64Array(
[-0]),de=new Uint8Array(vl.buffer);function B$(r,e,t){vl[0]=r,e[t]=de[0],e[t+1]=de[1],e[t+2]=de[2],e[t+3]=de[3],e[t+4]=de[4],
e[t+5]=de[5],e[t+6]=de[6],e[t+7]=de[7]}function L$(r,e){return de[0]=r[e],de[1]=r[e+1],de[2]=r[e+2],de[3]=r[e+3],de[4]=r[e+
4],de[5]=r[e+5],de[6]=r[e+6],de[7]=r[e+7],vl[0]}const D$=BigInt(Number.MAX_SAFE_INTEGER),N$=BigInt(Number.MIN_SAFE_INTEGER);
let ft=class Jt{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>
0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(
this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>
0),-(BigInt(t)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(
e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,
this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){
const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?
t<128?5:6:t<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===0n)return nr;if(e<D$&&e>N$)return this.fromNumber(Number(
e));const t=e<0n;t&&(e=-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>uh&&(s=0n,++n>uh&&(n=0n))),new Jt(Number(
s),Number(n))}static fromNumber(e){if(e===0)return nr;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&
(s=~s>>>0,n=~n>>>0,++n>4294967295&&(n=0,++s>4294967295&&(s=0))),new Jt(n,s)}static from(e){return typeof e=="number"?Jt.
fromNumber(e):typeof e=="bigint"?Jt.fromBigInt(e):typeof e=="string"?Jt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?
new Jt(e.low>>>0,e.high>>>0):nr}};const nr=new ft(0,0);nr.toBigInt=function(){return 0n};nr.zzEncode=nr.zzDecode=function(){
return this};nr.length=function(){return 1};const uh=4294967296n;function U$(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=
r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function _$(r,e,t){
if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>
239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=
(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>
0&&s.push(String.fromCharCode.apply(String,i.slice(0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Lg(r,e,t){
const n=t;let s,i;for(let o=0;o<r.length;++o)s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&
64512)===55296&&((i=r.charCodeAt(o+1))&64512)===56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&
63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function je(r,e){
return RangeError(`index out of range: ${r.pos} + ${e??1} > ${r.len}`)}function _s(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<
16|r[e-1]<<24)>>>0}let P$=class{buf;pos;len;_slice=Uint8Array.prototype.subarray;constructor(e){this.buf=F(e),this.pos=0,
this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.
pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))
return e;if((this.pos+=5)>this.len)throw this.pos=this.len,je(this,10);return e}int32(){return this.uint32()|0}sint32(){
const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw je(this,
4);return _s(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw je(this,4);return _s(this.buf,this.pos+=4)|0}float(){
if(this.pos+4>this.len)throw je(this,4);const e=I$(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)
throw je(this,4);const e=L$(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,n=this.pos+
e;if(n>this.len)throw je(this,e);return this.pos+=e,t===n?new Uint8Array(0):this.buf.subarray(t,n)}string(){const e=this.
bytes();return _$(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw je(this,e);this.pos+=e}else do
if(this.pos>=this.len)throw je(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.
skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(
e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){
const e=new ft(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.
pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.
pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw je(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<
t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>
4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){
if(this.pos>=this.len)throw je(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}
throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw je(this,8);const e=_s(this.buf,this.pos+=
4),t=_s(this.buf,this.pos+=4);return new ft(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.
readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().
toBigInt(!0)}uint64Number(){const e=$$(this.buf,this.pos);return this.pos+=wl(e),e}uint64String(){return this.readLongVarint().
toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().
toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){
return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().
toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}};
function Dg(r){return new P$(r instanceof Uint8Array?r:r.subarray())}function Ng(r,e,t){const n=Dg(r);return e.decode(n,
void 0,t)}function T$(r){let n,s=8192;return function(o){if(o<1||o>4096)return ur(o);s+o>8192&&(n=ur(8192),s=0);const a=n.
subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}let An=class{fn;len;next;val;constructor(e,t,n){this.fn=e,this.len=t,this.
next=void 0,this.val=n}};function ia(){}let M$=class{head;tail;len;next;constructor(e){this.head=e.head,this.tail=e.tail,
this.len=e.len,this.next=e.states}};const O$=T$();function R$(r){return globalThis.Buffer!=null?ur(r):O$(r)}let fc=class{len;head;tail;states;constructor(){
this.len=0,this.head=new An(ia,0,0),this.tail=this.head,this.states=null}_push(e,t,n){return this.tail=this.tail.next=new An(
e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new V$((e=e>>>0)<128?1:e<16384?2:e<2097152?
3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Ps,10,ft.fromNumber(e)):this.uint32(e)}sint32(e){return this.
uint32((e<<1^e>>31)>>>0)}uint64(e){const t=ft.fromBigInt(e);return this._push(Ps,t.length(),t)}uint64Number(e){return this.
_push(k$,wl(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.
uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=ft.fromBigInt(e).zzEncode();return this._push(
Ps,t.length(),t)}sint64Number(e){const t=ft.fromNumber(e).zzEncode();return this._push(Ps,t.length(),t)}sint64String(e){
return this.sint64(BigInt(e))}bool(e){return this._push(oa,1,e?1:0)}fixed32(e){return this._push(cn,4,e>>>0)}sfixed32(e){
return this.fixed32(e)}fixed64(e){const t=ft.fromBigInt(e);return this._push(cn,4,t.lo)._push(cn,4,t.hi)}fixed64Number(e){
const t=ft.fromNumber(e);return this._push(cn,4,t.lo)._push(cn,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){
return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){
return this._push(C$,4,e)}double(e){return this._push(B$,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(oa,1,
0):this.uint32(t)._push(K$,t,e)}string(e){const t=U$(e);return t!==0?this.uint32(t)._push(Lg,t,e):this._push(oa,1,0)}fork(){
return this.states=new M$(this),this.head=this.tail=new An(ia,0,0),this.len=0,this}reset(){return this.states!=null?(this.
head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.
tail=new An(ia,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().uint32(n),n!==
0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=R$(this.len);let n=0;for(;e!=
null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}};function oa(r,e,t){e[t]=r&255}function F$(r,e,t){for(;r>127;)e[t++]=r&
127|128,r>>>=7;e[t]=r}let V$=class extends An{next;constructor(e,t){super(F$,e,t),this.next=void 0}};function Ps(r,e,t){
for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>
7;e[t++]=r.lo}function cn(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function K$(r,e,t){e.set(r,
t)}globalThis.Buffer!=null&&(fc.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(z$,
e,r),this},fc.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(
H$,e,r),this});function z$(r,e,t){e.set(r,t)}function H$(r,e,t){r.length<40?Lg(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):
e.set(P(r),t)}function j$(){return new fc}function Ug(r,e){const t=j$();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}
function*_g(r,e,t){const n=Dg(r);yield*e.stream(n,void 0,".",t)}const Pg={VARINT:0,LENGTH_DELIMITED:2};function Tg(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function G$(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Tg("enum",Pg.VARINT,t,n,s)}function Mg(r,e,t){return Tg("message",Pg.LENGTH_DELIMITED,r,e,
t)}var W;(function(r){r.RSA="RSA",r.Ed25519="Ed25519",r.secp256k1="secp256k1",r.ECDSA="ECDSA"})(W||(W={}));var dc;(function(r){
r[r.RSA=0]="RSA",r[r.Ed25519=1]="Ed25519",r[r.secp256k1=2]="secp256k1",r[r.ECDSA=3]="ECDSA"})(dc||(dc={}));(function(r){
r.codec=()=>G$(dc)})(W||(W={}));var Ci;(function(r){let e;r.codec=()=>(e==null&&(e=Mg((i,o,a={})=>{a.lengthDelimited!==!1&&
o.fork(),i.Type!=null&&(o.uint32(8),W.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=W.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:W.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return Ug(i,r.codec())}r.encode=t;function n(i,o){return Ng(i,r.codec(),o)}r.decode=n;function s(i,o){return _g(i,r.codec(),
o)}r.stream=s})(Ci||(Ci={}));var Ii;(function(r){let e;r.codec=()=>(e==null&&(e=Mg((i,o,a={})=>{a.lengthDelimited!==!1&&
o.fork(),i.Type!=null&&(o.uint32(8),W.codec().encode(i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{
c.Type=W.codec().decode(i);break}case 2:{c.Data=i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){
const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:W.codec().
decode(i)};break}case 2:{yield{field:`${a}.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){
return Ug(i,r.codec())}r.encode=t;function n(i,o){return Ng(i,r.codec(),o)}r.decode=n;function s(i,o){return _g(i,r.codec(),
o)}r.stream=s})(Ii||(Ii={}));let W$=class{type="RSA";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){
return this._raw==null&&(this._raw=Og(this.jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return go.createV1(
114,this._multihash)}toString(){return Se.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof
Uint8Array)?!1:vt(this.raw,e.raw)}verify(e,t,n){return s8(this.jwk,t,e,n)}};class q${type="RSA";jwk;_raw;publicKey;constructor(e,t){
this.jwk=e,this.publicKey=t}get raw(){return this._raw==null&&(this._raw=Z$(this.jwk)),this._raw}equals(e){return e==null||
!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}sign(e,t){return n8(this.jwk,e,t)}}const J$=8192,X$=18,Y$=Uint8Array.
from([48,13,6,9,42,134,72,134,247,13,1,1,1,5,0]);function Q$(r){return{n:T(r[1],"base64url"),e:T(r[2],"base64url"),d:T(r[3],
"base64url"),p:T(r[4],"base64url"),q:T(r[5],"base64url"),dp:T(r[6],"base64url"),dq:T(r[7],"base64url"),qi:T(r[8],"base64\
url"),kty:"RSA"}}function Z$(r){if(r.n==null||r.e==null||r.d==null||r.p==null||r.q==null||r.dp==null||r.dq==null||r.qi==
null)throw new B("JWK was missing components");return pt([Ce(Uint8Array.from([0])),Ce(P(r.n,"base64url")),Ce(P(r.e,"base\
64url")),Ce(P(r.d,"base64url")),Ce(P(r.p,"base64url")),Ce(P(r.q,"base64url")),Ce(P(r.dp,"base64url")),Ce(P(r.dq,"base64u\
rl")),Ce(P(r.qi,"base64url"))]).subarray()}function Og(r){if(r.n==null||r.e==null)throw new B("JWK was missing component\
s");return pt([Y$,pl(pt([Ce(P(r.n,"base64url")),Ce(P(r.e,"base64url"))]))]).subarray()}function e8(r){const e=yo(r);return Rg(
e)}function Rg(r){const e=Q$(r);return t8(e)}function t8(r){if(i8(r)>J$)throw new B("Key size is too large");const e=r8(
r),t=Zt(Ci.encode({Type:W.RSA,Data:Og(e.publicKey)})),n=fo(X$,t);return new q$(e.privateKey,new W$(e.publicKey,n))}function r8(r){
if(r==null)throw new B("Missing key parameter");return{privateKey:r,publicKey:{kty:r.kty,n:r.n,e:r.e}}}async function n8(r,e,t){
const n=await Ve.get().subtle.importKey("jwk",r,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["sign"]);t?.signal?.
throwIfAborted();const s=await Ve.get().subtle.sign({name:"RSASSA-PKCS1-v1_5"},n,F(e instanceof Uint8Array?e:e.subarray()));
return t?.signal?.throwIfAborted(),new Uint8Array(s,0,s.byteLength)}async function s8(r,e,t,n){const s=await Ve.get().subtle.
importKey("jwk",r,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},!1,["verify"]);n?.signal?.throwIfAborted();const i=await Ve.
get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,F(e),F(t instanceof Uint8Array?t:t.subarray()));return n?.signal?.throwIfAborted(),
i}function i8(r){if(r.kty!=="RSA")throw new B("invalid key type");if(r.n==null)throw new B("invalid key modulus");return P(
r.n,"base64url").length*8}const o8=32;function a8(r,e,t){const n=yl.digest(e instanceof Uint8Array?e:e.subarray());if(wo(
n))return n.then(({digest:s})=>(t?.signal?.throwIfAborted(),K.sign(s,r,{prehash:!1,format:"der"}))).catch(s=>{throw s.name===
"AbortError"?s:new Xu(String(s))});try{return K.sign(n.digest,r,{prehash:!1,format:"der"})}catch(s){throw new Xu(String(
s))}}function c8(r,e,t,n){const s=yl.digest(t instanceof Uint8Array?t:t.subarray());if(wo(s))return s.then(({digest:i})=>(n?.
signal?.throwIfAborted(),K.verify(e,i,r,{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new Yu(String(
i))});try{return n?.signal?.throwIfAborted(),K.verify(e,s.digest,r,{prehash:!1,format:"der"})}catch(i){throw new Yu(String(
i))}}let l8=class{type="secp256k1";raw;_key;constructor(e){this._key=d8(e),this.raw=h8(this._key)}toMultihash(){return bl.
digest(El(this))}toCID(){return go.createV1(114,this.toMultihash())}toString(){return Se.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}verify(e,t,n){return c8(this.
_key,t,e,n)}};class u8{type="secp256k1";raw;publicKey;constructor(e,t){this.raw=f8(e),this.publicKey=new l8(t??g8(e))}equals(e){
return e==null||!(e.raw instanceof Uint8Array)?!1:vt(this.raw,e.raw)}sign(e,t){return a8(this.raw,e,t)}}function Fg(r){return new u8(
r)}function h8(r){return K.Point.fromBytes(r).toBytes()}function f8(r){try{return K.getPublicKey(r,!0),r}catch(e){throw new Gi(
String(e))}}function d8(r){try{return K.Point.fromBytes(r),r}catch(e){throw new Wi(String(e))}}function g8(r){try{return K.
getPublicKey(r,!0)}catch(e){throw new Gi(String(e))}}function El(r){return Ci.encode({Type:W[r.type],Data:r.raw})}function b8(r){
const e=Ii.decode(r),t=e.Data??new Uint8Array;switch(e.Type){case W.RSA:return e8(t);case W.Ed25519:return kg(t);case W.
secp256k1:return Fg(t);case W.ECDSA:return u$(t);default:throw new qi}}function y8(r){if(r.byteLength===ht)return kg(r);
if(r.byteLength===o8)return Fg(r);const e=yo(r),t=e[2]?.[0];if(t===pk||t===wk||t===mk)return Ag(e);if(e.length>8)return Rg(
e);throw new B("Could not extract private key from raw bytes")}function fs(r){return Ii.encode({Type:W[r.type],Data:r.raw})}
const hh={sha1:Ap,"sha2-256":Zt,"sha2-512":Rc};function fh(r,e,t,n,s){if(s!=="sha1"&&s!=="sha2-256"&&s!=="sha2-512"){const a=Object.
keys(hh).join(" / ");throw new B(`Hash '${s}' is unknown or not supported. Must be ${a}`)}const i=hh[s],o=ew(i,r,e,{c:t,
dkLen:n});return bo.encode(o).substring(1)}var aa,dh;function p8(){if(dh)return aa;dh=1;function r(t){return t>=55296&&t<=
56319}function e(t){return t>=56320&&t<=57343}return aa=function(n,s,i){if(typeof s!="string")throw new Error("Input mus\
t be string");for(var o=s.length,a=0,c,l,u=0;u<o;u+=1){if(c=s.charCodeAt(u),l=s[u],r(c)&&e(s.charCodeAt(u+1))&&(u+=1,l+=
s[u]),a+=n(l),a===i)return s.slice(0,u+1);if(a>i)return s.slice(0,u-l.length+1)}return s},aa}var ca,gh;function w8(){if(gh)
return ca;gh=1;function r(t){return t>=55296&&t<=56319}function e(t){return t>=56320&&t<=57343}return ca=function(n){if(typeof n!=
"string")throw new Error("Input must be string");for(var s=n.length,i=0,o=null,a=null,c=0;c<s;c++)o=n.charCodeAt(c),e(o)?
a!=null&&r(a)?i+=1:i+=3:o<=127?i+=1:o>=128&&o<=2047?i+=2:o>=2048&&o<=65535&&(i+=3),a=o;return i},ca}var la,bh;function m8(){
if(bh)return la;bh=1;var r=p8(),e=w8();return la=r.bind(null,e),la}var ua,yh;function v8(){if(yh)return ua;yh=1;var r=m8(),
e=/[\/\?<>\\:\*\|"]/g,t=/[\x00-\x1f\x80-\x9f]/g,n=/^\.+$/,s=/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;function i(a,c){
for(var l=a.length;l>0&&(a[l-1]==="."||a[l-1]===" ");)l--;return l<a.length?a.slice(0,l)+c:a}function o(a,c){if(typeof a!=
"string")throw new Error("Input must be string");var l=a.replace(e,c).replace(t,c).replace(n,c).replace(s,c);return l=i(
l,c),r(l,255)}return ua=function(a,c){var l=c&&c.replacement||"",u=o(a,l);return l===""?u:o(u,"")},ua}var E8=v8();const Vg=xp(
E8),ph={keyLength:512/8,iterationCount:1e4,salt:"you should override this value with a crypto secure random number",hash:"\
sha2-512"},ha={alg:"A128GCM",ext:!0,k:"scm9jmO_4BJAgdwWGVulLg",key_ops:["encrypt","decrypt"],kty:"oct"};function Kg(r){const e="\
AES-GCM";let t=16;const n=12,s="SHA-256",i=16,o=32767,a=Ve.get();t*=8;async function c(h,d){const b=a.getRandomValues(new Uint8Array(
i)),k=a.getRandomValues(new Uint8Array(n)),C={name:e,iv:k};typeof d=="string"&&(d=P(d));let $;if(d.length===0){$=await a.
subtle.importKey("jwk",ha,{name:"AES-GCM"},!0,["encrypt"]);try{const g={name:"PBKDF2",salt:b,iterations:o,hash:{name:s}},
A=await a.subtle.importKey("raw",F(d),{name:"PBKDF2"},!1,["deriveKey"]);$=await a.subtle.deriveKey(g,A,{name:e,length:t},
!0,["encrypt"])}catch{$=await a.subtle.importKey("jwk",ha,{name:"AES-GCM"},!0,["encrypt"])}}else{const g={name:"PBKDF2",
salt:b,iterations:o,hash:{name:s}},A=await a.subtle.importKey("raw",F(d),{name:"PBKDF2"},!1,["deriveKey"]);$=await a.subtle.
deriveKey(g,A,{name:e,length:t},!0,["encrypt"])}const f=await a.subtle.encrypt(C,$,F(h));return lc([b,C.iv,new Uint8Array(
f)])}async function l(h,d){const b=h.subarray(0,i),k=h.subarray(i,i+n),C=h.subarray(i+n),$={name:e,iv:k};typeof d=="stri\
ng"&&(d=P(d));let f;if(d.length===0)try{const A={name:"PBKDF2",salt:b,iterations:o,hash:{name:s}},p=await a.subtle.importKey(
"raw",F(d),{name:"PBKDF2"},!1,["deriveKey"]);f=await a.subtle.deriveKey(A,p,{name:e,length:t},!0,["decrypt"])}catch{f=await a.
subtle.importKey("jwk",ha,{name:"AES-GCM"},!0,["decrypt"])}else{const A={name:"PBKDF2",salt:b,iterations:o,hash:{name:s}},
p=await a.subtle.importKey("raw",F(d),{name:"PBKDF2"},!1,["deriveKey"]);f=await a.subtle.deriveKey(A,p,{name:e,length:t},
!0,["decrypt"])}const g=await a.subtle.decrypt($,f,F(C));return new Uint8Array(g)}return{encrypt:c,decrypt:l}}/*!
 * MIT License
 * 
 * Copyright (c) 2017-2024 Peculiar Ventures, LLC
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const A8="[object ArrayBuffer]";class _{static isArrayBuffer(e){return Object.prototype.toString.call(e)===A8}static toArrayBuffer(e){
return this.isArrayBuffer(e)?e:e.byteLength===e.buffer.byteLength||e.byteOffset===0&&e.byteLength===e.buffer.byteLength?
e.buffer:this.toUint8Array(e.buffer).slice(e.byteOffset,e.byteOffset+e.byteLength).buffer}static toUint8Array(e){return this.
toView(e,Uint8Array)}static toView(e,t){if(e.constructor===t)return e;if(this.isArrayBuffer(e))return new t(e);if(this.isArrayBufferView(
e))return new t(e.buffer,e.byteOffset,e.byteLength);throw new TypeError("The provided value is not of type '(ArrayBuffer\
 or ArrayBufferView)'")}static isBufferSource(e){return this.isArrayBufferView(e)||this.isArrayBuffer(e)}static isArrayBufferView(e){
return ArrayBuffer.isView(e)||e&&this.isArrayBuffer(e.buffer)}static isEqual(e,t){const n=_.toUint8Array(e),s=_.toUint8Array(
t);if(n.length!==s.byteLength)return!1;for(let i=0;i<n.length;i++)if(n[i]!==s[i])return!1;return!0}static concat(...e){let t;
Array.isArray(e[0])&&!(e[1]instanceof Function)||Array.isArray(e[0])&&e[1]instanceof Function?t=e[0]:e[e.length-1]instanceof
Function?t=e.slice(0,e.length-1):t=e;let n=0;for(const o of t)n+=o.byteLength;const s=new Uint8Array(n);let i=0;for(const o of t){
const a=this.toUint8Array(o);s.set(a,i),i+=a.length}return e[e.length-1]instanceof Function?this.toView(s,e[e.length-1]):
s.buffer}}const fa="string",x8=/^[0-9a-f\s]+$/i,S8=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,k8=/^[a-zA-Z0-9-_]+$/;
class wh{static fromString(e){const t=unescape(encodeURIComponent(e)),n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)
n[s]=t.charCodeAt(s);return n.buffer}static toString(e){const t=_.toUint8Array(e);let n="";for(let i=0;i<t.length;i++)n+=
String.fromCharCode(t[i]);return decodeURIComponent(escape(n))}}class Ze{static toString(e,t=!1){const n=_.toArrayBuffer(
e),s=new DataView(n);let i="";for(let o=0;o<n.byteLength;o+=2){const a=s.getUint16(o,t);i+=String.fromCharCode(a)}return i}static fromString(e,t=!1){
const n=new ArrayBuffer(e.length*2),s=new DataView(n);for(let i=0;i<e.length;i++)s.setUint16(i*2,e.charCodeAt(i),t);return n}}
class M{static isHex(e){return typeof e===fa&&x8.test(e)}static isBase64(e){return typeof e===fa&&S8.test(e)}static isBase64Url(e){
return typeof e===fa&&k8.test(e)}static ToString(e,t="utf8"){const n=_.toUint8Array(e);switch(t.toLowerCase()){case"utf8":
return this.ToUtf8String(n);case"binary":return this.ToBinary(n);case"hex":return this.ToHex(n);case"base64":return this.
ToBase64(n);case"base64url":return this.ToBase64Url(n);case"utf16le":return Ze.toString(n,!0);case"utf16":case"utf16be":
return Ze.toString(n);default:throw new Error(`Unknown type of encoding '${t}'`)}}static FromString(e,t="utf8"){if(!e)return new ArrayBuffer(
0);switch(t.toLowerCase()){case"utf8":return this.FromUtf8String(e);case"binary":return this.FromBinary(e);case"hex":return this.
FromHex(e);case"base64":return this.FromBase64(e);case"base64url":return this.FromBase64Url(e);case"utf16le":return Ze.fromString(
e,!0);case"utf16":case"utf16be":return Ze.fromString(e);default:throw new Error(`Unknown type of encoding '${t}'`)}}static ToBase64(e){
const t=_.toUint8Array(e);if(typeof btoa<"u"){const n=this.ToString(t,"binary");return btoa(n)}else return Buffer.from(t).
toString("base64")}static FromBase64(e){const t=this.formatString(e);if(!t)return new ArrayBuffer(0);if(!M.isBase64(t))throw new TypeError(
"Argument 'base64Text' is not Base64 encoded");return typeof atob<"u"?this.FromBinary(atob(t)):new Uint8Array(Buffer.from(
t,"base64")).buffer}static FromBase64Url(e){const t=this.formatString(e);if(!t)return new ArrayBuffer(0);if(!M.isBase64Url(
t))throw new TypeError("Argument 'base64url' is not Base64Url encoded");return this.FromBase64(this.Base64Padding(t.replace(
/\-/g,"+").replace(/\_/g,"/")))}static ToBase64Url(e){return this.ToBase64(e).replace(/\+/g,"-").replace(/\//g,"_").replace(
/\=/g,"")}static FromUtf8String(e,t=M.DEFAULT_UTF8_ENCODING){switch(t){case"ascii":return this.FromBinary(e);case"utf8":
return wh.fromString(e);case"utf16":case"utf16be":return Ze.fromString(e);case"utf16le":case"usc2":return Ze.fromString(
e,!0);default:throw new Error(`Unknown type of encoding '${t}'`)}}static ToUtf8String(e,t=M.DEFAULT_UTF8_ENCODING){switch(t){case"\
ascii":return this.ToBinary(e);case"utf8":return wh.toString(e);case"utf16":case"utf16be":return Ze.toString(e);case"utf\
16le":case"usc2":return Ze.toString(e,!0);default:throw new Error(`Unknown type of encoding '${t}'`)}}static FromBinary(e){
const t=e.length,n=new Uint8Array(t);for(let s=0;s<t;s++)n[s]=e.charCodeAt(s);return n.buffer}static ToBinary(e){const t=_.
toUint8Array(e);let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n}static ToHex(e){const t=_.toUint8Array(
e);let n="";const s=t.length;for(let i=0;i<s;i++){const o=t[i];o<16&&(n+="0"),n+=o.toString(16)}return n}static FromHex(e){
let t=this.formatString(e);if(!t)return new ArrayBuffer(0);if(!M.isHex(t))throw new TypeError("Argument 'hexString' is n\
ot HEX encoded");t.length%2&&(t=`0${t}`);const n=new Uint8Array(t.length/2);for(let s=0;s<t.length;s=s+2){const i=t.slice(
s,s+2);n[s/2]=parseInt(i,16)}return n.buffer}static ToUtf16String(e,t=!1){return Ze.toString(e,t)}static FromUtf16String(e,t=!1){
return Ze.fromString(e,t)}static Base64Padding(e){const t=4-e.length%4;if(t<4)for(let n=0;n<t;n++)e+="=";return e}static formatString(e){
return e?.replace(/[\n\r\t ]/g,"")||""}}M.DEFAULT_UTF8_ENCODING="utf8";/*!
 Copyright (c) Peculiar Ventures, LLC
*/function Mr(r,e){let t=0;if(r.length===1)return r[0];for(let n=r.length-1;n>=0;n--)t+=r[r.length-1-n]*Math.pow(2,e*n);
return t}function hr(r,e,t=-1){const n=t;let s=r,i=0,o=Math.pow(2,e);for(let a=1;a<8;a++){if(r<o){let c;if(n<0)c=new ArrayBuffer(
a),i=a;else{if(n<a)return new ArrayBuffer(0);c=new ArrayBuffer(n),i=n}const l=new Uint8Array(c);for(let u=a-1;u>=0;u--){
const h=Math.pow(2,u*e);l[i-u-1]=Math.floor(s/h),s-=l[i-u-1]*h}return c}o*=Math.pow(2,e)}return new ArrayBuffer(0)}function zg(){
const r=new Uint8Array(this.valueHex);if(this.valueHex.byteLength>=2){const a=r[0]===255&&r[1]&128,c=r[0]===0&&(r[1]&128)===
0;(a||c)&&this.warnings.push("Needlessly long format")}const e=new ArrayBuffer(this.valueHex.byteLength),t=new Uint8Array(
e);for(let a=0;a<this.valueHex.byteLength;a++)t[a]=0;t[0]=r[0]&128;const n=Mr(t,8),s=new ArrayBuffer(this.valueHex.byteLength),
i=new Uint8Array(s);for(let a=0;a<this.valueHex.byteLength;a++)i[a]=r[a];return i[0]&=127,Mr(i,8)-n}function $8(r){const e=r<
0?r*-1:r;let t=128;for(let n=1;n<8;n++){if(e<=t){if(r<0){const o=t-e,a=hr(o,8,n),c=new Uint8Array(a);return c[0]|=128,a}
let s=hr(e,8,n),i=new Uint8Array(s);if(i[0]&128){const o=s.slice(0),a=new Uint8Array(o);s=new ArrayBuffer(s.byteLength+1),
i=new Uint8Array(s);for(let c=0;c<o.byteLength;c++)i[c+1]=a[c];i[0]=0}return s}t*=Math.pow(2,8)}return new ArrayBuffer(0)}
function C8(r,e){if(r.byteLength!==e.byteLength)return!1;const t=new Uint8Array(r),n=new Uint8Array(e);for(let s=0;s<t.length;s++)
if(t[s]!==n[s])return!1;return!0}function Be(r,e){const t=r.toString(10);if(e<t.length)return"";const n=e-t.length,s=Array.
from({length:n});for(let o=0;o<n;o++)s[o]="0";return s.join("").concat(t)}/*!
 * Copyright (c) 2014, GMO GlobalSign
 * Copyright (c) 2015-2022, Peculiar Ventures
 * All rights reserved.
 * 
 * Author 2014-2019, Yury Strozhevsky
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 * 
 * * Neither the name of the copyright holder nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */function Bi(){if(typeof BigInt>"u")throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.")}
function Li(r){let e=0,t=0;for(let s=0;s<r.length;s++){const i=r[s];e+=i.byteLength}const n=new Uint8Array(e);for(let s=0;s<
r.length;s++){const i=r[s];n.set(i instanceof Uint8Array?i:new Uint8Array(i),t),t+=i.byteLength}return n.buffer}function Et(r,e,t,n){
return e instanceof Uint8Array?e.byteLength?t<0?(r.error="Wrong parameter: inputOffset less than zero",!1):n<0?(r.error=
"Wrong parameter: inputLength less than zero",!1):e.byteLength-t-n<0?(r.error="End of input reached before message was f\
ully decoded (inconsistent offset and length values)",!1):!0:(r.error="Wrong parameter: inputBuffer has zero length",!1):
(r.error="Wrong parameter: inputBuffer must be 'Uint8Array'",!1)}class Hr{constructor(){this.items=[]}write(e){this.items.
push(e instanceof ArrayBuffer?e:Li([e]))}final(){return Li(this.items)}}const I8=Hr.prototype.write,B8=Hr.prototype.final,
jr="",ot=new ArrayBuffer(0),Al=new Uint8Array(0),jn="EndOfContent",Hg="OCTET STRING",jg="BIT STRING";function At(r){var e;
return e=class extends r{get valueHex(){return this.valueHexView.slice().buffer}set valueHex(n){this.valueHexView=new Uint8Array(
n)}constructor(...n){var s;super(...n);const i=n[0]||{};this.isHexOnly=(s=i.isHexOnly)!==null&&s!==void 0?s:!1,this.valueHexView=
i.valueHex?_.toUint8Array(i.valueHex):Al}fromBER(n,s,i,o){const a=n instanceof ArrayBuffer?new Uint8Array(n):n;if(!Et(this,
a,s,i))return-1;const c=s+i;return this.valueHexView=a.subarray(s,c),this.valueHexView.length?(this.blockLength=i,c):(this.
warnings.push("Zero buffer length"),s)}toBER(n=!1){return this.isHexOnly?n?new ArrayBuffer(this.valueHexView.byteLength):
this.valueHexView.buffer instanceof ArrayBuffer&&this.valueHexView.byteLength===this.valueHexView.buffer.byteLength?this.
valueHexView.buffer:_.toArrayBuffer(this.valueHexView):(this.error="Flag 'isHexOnly' is not set, abort",ot)}toJSON(){return{
...super.toJSON(),isHexOnly:this.isHexOnly,valueHex:M.ToHex(this.valueHexView)}}},e.NAME="hexBlock",e}class Gr{static blockName(){
return this.NAME}get valueBeforeDecode(){return this.valueBeforeDecodeView.slice().buffer}set valueBeforeDecode(e){this.
valueBeforeDecodeView=new Uint8Array(e)}constructor({blockLength:e=0,error:t=jr,warnings:n=[],valueBeforeDecode:s=Al}={}){
this.blockLength=e,this.error=t,this.warnings=n,this.valueBeforeDecodeView=_.toUint8Array(s)}toJSON(){return{blockName:this.
constructor.NAME,blockLength:this.blockLength,error:this.error,warnings:this.warnings,valueBeforeDecode:M.ToHex(this.valueBeforeDecodeView)}}}
Gr.NAME="baseBlock";class Ae extends Gr{fromBER(e,t,n,s){throw TypeError("User need to make a specific function in a cla\
ss which extends 'ValueBlock'")}toBER(e,t){throw TypeError("User need to make a specific function in a class which exten\
ds 'ValueBlock'")}}Ae.NAME="valueBlock";class Wr extends At(Gr){constructor({idBlock:e={}}={}){var t,n,s,i;super(),e?(this.
isHexOnly=(t=e.isHexOnly)!==null&&t!==void 0?t:!1,this.valueHexView=e.valueHex?_.toUint8Array(e.valueHex):Al,this.tagClass=
(n=e.tagClass)!==null&&n!==void 0?n:-1,this.tagNumber=(s=e.tagNumber)!==null&&s!==void 0?s:-1,this.isConstructed=(i=e.isConstructed)!==
null&&i!==void 0?i:!1):(this.tagClass=-1,this.tagNumber=-1,this.isConstructed=!1)}toBER(e=!1){let t=0;switch(this.tagClass){case 1:
t|=0;break;case 2:t|=64;break;case 3:t|=128;break;case 4:t|=192;break;default:return this.error="Unknown tag class",ot}if(this.
isConstructed&&(t|=32),this.tagNumber<31&&!this.isHexOnly){const s=new Uint8Array(1);if(!e){let i=this.tagNumber;i&=31,t|=
i,s[0]=t}return s.buffer}if(!this.isHexOnly){const s=hr(this.tagNumber,7),i=new Uint8Array(s),o=s.byteLength,a=new Uint8Array(
o+1);if(a[0]=t|31,!e){for(let c=0;c<o-1;c++)a[c+1]=i[c]|128;a[o]=i[o-1]}return a.buffer}const n=new Uint8Array(this.valueHexView.
byteLength+1);if(n[0]=t|31,!e){const s=this.valueHexView;for(let i=0;i<s.length-1;i++)n[i+1]=s[i]|128;n[this.valueHexView.
byteLength]=s[s.length-1]}return n.buffer}fromBER(e,t,n){const s=_.toUint8Array(e);if(!Et(this,s,t,n))return-1;const i=Number.
isInteger(t)&&Number.isInteger(n),o=i?s:s.subarray(t,t+n),a=i?t:0,c=i?n:o.length;if(c===0)return this.error="Zero buffer\
 length",-1;switch(o[a]&192){case 0:this.tagClass=1;break;case 64:this.tagClass=2;break;case 128:this.tagClass=3;break;case 192:
this.tagClass=4;break;default:return this.error="Unknown tag class",-1}this.isConstructed=(o[a]&32)===32,this.isHexOnly=
!1;const u=o[a]&31;if(u!==31)this.tagNumber=u,this.blockLength=1;else{let h=0;for(;;){const b=h+1;if(b>=c)return this.error=
"End of input reached before message was fully decoded",-1;if(h++,(o[a+b]&128)===0)break}this.blockLength=h+1;const d=this.
valueHexView=new Uint8Array(h);for(let b=0;b<h;b++)d[b]=o[a+b+1]&127;this.blockLength<=9?this.tagNumber=Mr(d,7):(this.isHexOnly=
!0,this.warnings.push("Tag too long, represented as hex-coded"))}if(this.tagClass===1&&this.isConstructed)switch(this.tagNumber){case 1:case 2:case 5:case 6:case 9:case 13:case 14:case 23:case 24:case 31:case 32:case 33:case 34:
return this.error="Constructed encoding used for primitive type",-1}return t+this.blockLength}toJSON(){return{...super.toJSON(),
tagClass:this.tagClass,tagNumber:this.tagNumber,isConstructed:this.isConstructed}}}Wr.NAME="identificationBlock";const L8=Wr.
prototype.toBER,D8=Wr.prototype.fromBER;class qr extends Gr{constructor({lenBlock:e={}}={}){var t,n,s;super(),this.isIndefiniteForm=
(t=e.isIndefiniteForm)!==null&&t!==void 0?t:!1,this.longFormUsed=(n=e.longFormUsed)!==null&&n!==void 0?n:!1,this.length=
(s=e.length)!==null&&s!==void 0?s:0}fromBER(e,t,n){const s=_.toUint8Array(e);if(!Et(this,s,t,n))return-1;const i=Number.
isInteger(t)&&Number.isInteger(n),o=i?s:s.subarray(t,t+n),a=i?t:0,c=i?n:o.length;if(c===0)return this.error="Zero buffer\
 length",-1;if(o[a]===255)return this.error="Length block 0xFF is reserved by standard",-1;if(this.isIndefiniteForm=o[a]===
128,this.isIndefiniteForm)return this.blockLength=1,t+this.blockLength;if(this.longFormUsed=!!(o[a]&128),this.longFormUsed===
!1)return this.length=o[a],this.blockLength=1,t+this.blockLength;const l=o[a]&127;if(l>8)return this.error="Too big inte\
ger",-1;if(l+1>c)return this.error="End of input reached before message was fully decoded",-1;const u=t+1,h=s.subarray(u,
u+l);return h[l-1]===0&&this.warnings.push("Needlessly long encoded length"),this.length=Mr(h,8),this.longFormUsed&&this.
length<=127&&this.warnings.push("Unnecessary usage of long length form"),this.blockLength=l+1,t+this.blockLength}toBER(e=!1){
let t,n;if(this.length>127&&(this.longFormUsed=!0),this.isIndefiniteForm)return t=new ArrayBuffer(1),e===!1&&(n=new Uint8Array(
t),n[0]=128),t;if(this.longFormUsed){const s=hr(this.length,8);if(s.byteLength>127)return this.error="Too big length",ot;
if(t=new ArrayBuffer(s.byteLength+1),e)return t;const i=new Uint8Array(s);n=new Uint8Array(t),n[0]=s.byteLength|128;for(let o=0;o<
s.byteLength;o++)n[o+1]=i[o];return t}return t=new ArrayBuffer(1),e===!1&&(n=new Uint8Array(t),n[0]=this.length),t}toJSON(){
return{...super.toJSON(),isIndefiniteForm:this.isIndefiniteForm,longFormUsed:this.longFormUsed,length:this.length}}}qr.NAME=
"lengthBlock";const N8=qr.prototype.toBER,U8=qr.prototype.fromBER,I={};var da,ga,ba;const _8=K8(Uint8Array.prototype,"sl\
ice"),P8=(da=Object.getOwnPropertyDescriptor(Uint8Array.prototype,"constructor"))===null||da===void 0?void 0:da.value,T8=(ga=
Object.getOwnPropertyDescriptor(Array.prototype,Symbol.iterator))===null||ga===void 0?void 0:ga.value,mh=(ba=Object.getOwnPropertyDescriptor(
Object.getPrototypeOf(Uint8Array.prototype),"byteLength"))===null||ba===void 0?void 0:ba.get,M8=16384,Gg=64;let ni;function O8(r,e){
const n=e||ni;if(!n){ni=void 0;return}ni={...n,...r}}function O(r,e){const t=Object.getOwnPropertyDescriptor(r,e);if(!(!t||
!("value"in t)))return t.value}function R8(r){if(!(!mh||!r||typeof r!="object"))try{const e=mh.call(r);return typeof e==
"number"?e:void 0}catch{return}}function Wg(r,e){if(e>Gg||!r||typeof r!="object")return!1;const t=Object.getOwnPropertyDescriptor(
r,"valueBlock");if(!t||!("value"in t))return!1;const n=t.value;if(!n||typeof n!="object")return!1;const s=Object.getOwnPropertyDescriptor(
n,"valueHexView");if(s){if(!("value"in s))return!1;const l=R8(s.value);return l!==void 0&&l>=M8}const i=Object.getOwnPropertyDescriptor(
n,"value");if(!i||!("value"in i)||!Array.isArray(i.value))return!1;const o=i.value,a=Object.getOwnPropertyDescriptor(o,"\
length");if(!a||!("value"in a)||a.value!==1)return!1;const c=Object.getOwnPropertyDescriptor(o,"0");return!c||!("value"in
c)?!1:Wg(c.value,e+1)}function F8(r){try{return Wg(r,0)}catch{return!1}}function vh(r,e){return!!r&&"value"in r&&r.value===
e&&r.writable===!0&&r.enumerable===!1&&r.configurable===!0}function V8(r){return vh(Object.getOwnPropertyDescriptor(r.ViewWriter.
prototype,"write"),r.originalWriterWrite)&&vh(Object.getOwnPropertyDescriptor(r.ViewWriter.prototype,"final"),r.originalWriterFinal)}
function K8(r,e){let t=r;for(;t;){const n=Object.getOwnPropertyDescriptor(t,e);if(n)return"value"in n&&typeof n.value=="\
function"?{declaringPrototype:t,method:n.value}:void 0;t=Object.getPrototypeOf(t)}}function z8(r,e,t){if(!t)return!1;let n=r;
for(;n;){const s=Object.getOwnPropertyDescriptor(n,e);if(n===t.declaringPrototype)return!!s&&"value"in s&&s.value===t.method;
if(s)return!1;n=Object.getPrototypeOf(n)}return!1}function Or(r,e,t,n){if(Object.prototype.hasOwnProperty.call(r,t)||Object.
getPrototypeOf(r)!==e)return!1;const s=Object.getOwnPropertyDescriptor(e,t);return!!s&&"value"in s&&s.value===n}function H8(r,e,t,n){
if(Object.prototype.hasOwnProperty.call(r,e))return!1;const s=Object.getPrototypeOf(r),i=Object.getPrototypeOf(n.prototype);
if(s!==n.prototype||Object.getPrototypeOf(s)!==i||s&&Object.getOwnPropertyDescriptor(s,e))return!1;const a=Object.getOwnPropertyDescriptor(
i,e);return!!a&&"value"in a&&a.value===t}function xl(r,e=!1){if(!(r instanceof Uint8Array)||Object.getPrototypeOf(r)!==Uint8Array.
prototype)return;for(const n of["buffer","byteOffset","byteLength","length","slice","constructor"])if(Object.prototype.hasOwnProperty.
call(r,n))return;const t=Object.getOwnPropertyDescriptor(Uint8Array.prototype,"constructor");if(!(!t||!("value"in t)||t.
value!==P8)&&z8(Uint8Array.prototype,"slice",_8)){try{const n=r.buffer;if(!(n instanceof ArrayBuffer)||Object.getPrototypeOf(
n)!==ArrayBuffer.prototype||Object.prototype.hasOwnProperty.call(n,"byteLength")||r.byteLength!==r.length||!e&&r.byteLength===
0||r.byteOffset<0||r.byteOffset+r.byteLength>n.byteLength)return}catch{return}return r}}function j8(r,e,t){if(Object.getPrototypeOf(
r)!==t.LocalIdentificationBlock.prototype||!Or(r,t.LocalIdentificationBlock.prototype,"toBER",t.originalIdentificationToBER))
return!1;const n=O(r,"tagClass"),s=O(r,"tagNumber"),i=O(r,"isConstructed"),o=O(r,"isHexOnly"),a=O(r,"valueHexView");return typeof n!=
"number"||!Number.isInteger(n)||n<1||n>4||typeof s!="number"||!Number.isInteger(s)||s<0||i!==e||typeof o!="boolean"?!1:o?
!!xl(a):Number.isSafeInteger(s)}function G8(r,e,t){if(Object.getPrototypeOf(r)!==t.LocalLengthBlock.prototype||!Or(r,t.LocalLengthBlock.
prototype,"toBER",t.originalLengthToBER))return!1;const n=O(r,"isIndefiniteForm"),s=O(r,"longFormUsed"),i=Object.getOwnPropertyDescriptor(
r,"length"),o=i&&"value"in i?i.value:void 0,a=Object.getOwnPropertyDescriptor(r,"longFormUsed");return typeof n=="boolea\
n"&&(n===!1||e)&&typeof s=="boolean"&&!!a&&"value"in a&&a.writable===!0&&!!i&&"value"in i&&i.writable===!0&&typeof o=="n\
umber"&&Number.isSafeInteger(o)&&o>=0}function W8(r,e,t){const n=O(r,"idBlock"),s=O(r,"lenBlock");return!!n&&!!s&&j8(n,e,
t)&&G8(s,e,t)}function q8(r,e){const t=O(r,"valueBlock");if(!t||Object.getPrototypeOf(t)!==e.LocalConstructedValueBlock.
prototype||!Or(t,e.LocalConstructedValueBlock.prototype,"toBER",e.originalConstructedToBER))return;const n=O(t,"value");
if(!Array.isArray(n)||Object.getPrototypeOf(n)!==Array.prototype)return;const s=Object.getOwnPropertyDescriptor(n,"lengt\
h");if(!s||!("value"in s)||s.value!==1||Object.prototype.hasOwnProperty.call(n,Symbol.iterator))return;const i=Object.getOwnPropertyDescriptor(
Array.prototype,Symbol.iterator);if(!i||!("value"in i)||i.value!==T8)return;const o=Object.getOwnPropertyDescriptor(n,"0");
if(!(!o||!("value"in o))&&Object.getOwnPropertyNames(n).length===2)return o.value}function J8(r,e){const t=O(r,"valueBlo\
ck");if(!t||Object.getPrototypeOf(t)!==e.LocalBitStringValueBlock.prototype||!Or(t,e.LocalBitStringValueBlock.prototype,
"toBER",e.originalBitStringToBER)||O(t,"isConstructed")!==!1)return;const n=O(t,"unusedBits");if(typeof n!="number"||!Number.
isInteger(n)||n<0||n>7)return;const s=xl(O(t,"valueHexView"),!0);if(s)return{payload:s,prefix:Uint8Array.of(s.byteLength?
n:0)}}function X8(r,e,t){const n=O(r,"valueBlock");if(n){if(e==="integer"){if(Object.getPrototypeOf(n)!==t.LocalIntegerValueBlock.
prototype||!Or(n,t.LocalIntegerValueBlock.prototype,"toBER",t.originalIntegerToBER))return}else if(e==="octet"){if(Object.
getPrototypeOf(n)!==t.LocalOctetStringValueBlock.prototype||!Or(n,t.LocalOctetStringValueBlock.prototype,"toBER",t.originalOctetStringToBER)||
O(n,"isConstructed")!==!1)return}else if(Object.getPrototypeOf(n)!==t.LocalPrimitiveValueBlock.prototype||!H8(n,"toBER",
t.originalPrimitiveToBER,t.LocalPrimitiveValueBlock))return;if(!(e==="primitive"&&O(n,"isHexOnly")!==!0)&&typeof O(n,"is\
HexOnly")=="boolean")return xl(O(n,"valueHexView"))}}function Y8(r,e){if(Object.prototype.hasOwnProperty.call(r,"toBER"))
return!1;let t=r;for(;t;){const n=Object.getOwnPropertyDescriptor(t,"toBER");if(n)return"value"in n&&n.value===e.originalBaseBlockToBER;
t=Object.getPrototypeOf(t)}return!1}function Ts(r,e,t){const n=t[e];return!!n&&Object.getPrototypeOf(r)===n.prototype}function Q8(r,e){
return Object.getPrototypeOf(r)===e.Sequence.prototype||Object.getPrototypeOf(r)===e.Set.prototype||Object.getPrototypeOf(
r)===e.Constructed.prototype}function qg(r,e,t){if(!(e>Gg||!r||typeof r!="object"))try{if(!Y8(r,t))return;const n=Ts(r,"\
BitString",t)?"bit":Ts(r,"Integer",t)?"integer":Ts(r,"OctetString",t)?"octet":Ts(r,"Primitive",t)?"primitive":void 0,s=n===
void 0&&Q8(r,t);if(!n&&!s||!W8(r,s,t))return;const i=O(r,"idBlock"),o=O(r,"lenBlock");if(!i||!o)return;if(n){const u=n===
"bit"?J8(r,t):void 0,h=n==="bit"?u?.payload:X8(r,n,t);return h?{block:r,kind:n,idBlock:i,lenBlock:o,indefinite:!1,payload:h,
prefix:u?.prefix}:void 0}const a=q8(r,t),c=a&&qg(a,e+1,t),l=O(o,"isIndefiniteForm");return c?{block:r,kind:"constructed",
idBlock:i,lenBlock:o,indefinite:l===!0,child:c}:void 0}catch{return}}function Jg(r,e,t){var n,s;const i=Reflect.apply(t.
originalIdentificationToBER,r.idBlock,[e]);if(!(i instanceof ArrayBuffer)||i.byteLength===0)throw TypeError("Built-in id\
entifier encoding failed");let o;r.kind==="constructed"?o=Jg(r.child,e,t):o=r.payload;const a=(o instanceof Uint8Array?o.
byteLength:o.total)+((s=(n=r.prefix)===null||n===void 0?void 0:n.byteLength)!==null&&s!==void 0?s:0);let c;if(r.indefinite)
c=Uint8Array.of(128).buffer;else if(r.lenBlock.length=a,c=Reflect.apply(t.originalLengthToBER,r.lenBlock,[e]),!(c instanceof
ArrayBuffer)||c.byteLength===0)throw TypeError("Built-in length encoding failed");const l=i.byteLength+c.byteLength+a+(r.
indefinite?2:0);if(!Number.isSafeInteger(l))throw RangeError("Built-in encoding is too large");return{id:i,len:c,payload:o,
length:a,total:l,indefinite:r.indefinite,prefix:r.prefix}}function Xg(r,e,t,n){return e.set(new Uint8Array(r.id),t),t+=r.
id.byteLength,e.set(new Uint8Array(r.len),t),t+=r.len.byteLength,r.prefix&&(n||e.set(r.prefix,t),t+=r.prefix.byteLength),
r.payload instanceof Uint8Array?(n||e.set(r.payload,t),t+=r.payload.byteLength):t=Xg(r.payload,e,t,n),r.indefinite&&(t+=
2),t}function Z8(r,e=!1){const t=ni;if(!t||!V8(t))return;const n=qg(r,0,t);if(!n)return;const s=Jg(n,e,t),i=new Uint8Array(
s.total);return Xg(s,i,0,e),i.buffer}class j extends Gr{constructor({name:e=jr,optional:t=!1,primitiveSchema:n,...s}={},i){
super(s),this.name=e,this.optional=t,n&&(this.primitiveSchema=n),this.idBlock=new Wr(s),this.lenBlock=new qr(s),this.valueBlock=
i?new i(s):new Ae(s)}fromBER(e,t,n,s){const i=this.valueBlock.fromBER(e,t,this.lenBlock.isIndefiniteForm?n:this.lenBlock.
length,s);return i===-1?(this.error=this.valueBlock.error,i):(this.idBlock.error.length||(this.blockLength+=this.idBlock.
blockLength),this.lenBlock.error.length||(this.blockLength+=this.lenBlock.blockLength),this.valueBlock.error.length||(this.
blockLength+=this.valueBlock.blockLength),i)}toBER(e,t){const n=t||new Hr;if(!t&&(Yg(this),(e===!0||e===!1||e===void 0)&&
F8(this))){const i=Z8(this,e===!0);if(i)return i}const s=this.idBlock.toBER(e);if(n.write(s),this.lenBlock.isIndefiniteForm)
n.write(new Uint8Array([128]).buffer),this.valueBlock.toBER(e,n),n.write(new ArrayBuffer(2));else{const i=this.valueBlock.
toBER(e);this.lenBlock.length=i.byteLength;const o=this.lenBlock.toBER(e);n.write(o),n.write(i)}return t?ot:n.final()}toJSON(){
const e={...super.toJSON(),idBlock:this.idBlock.toJSON(),lenBlock:this.lenBlock.toJSON(),valueBlock:this.valueBlock.toJSON(),
name:this.name,optional:this.optional};return this.primitiveSchema&&(e.primitiveSchema=this.primitiveSchema.toJSON()),e}toString(e="\
ascii"){return e==="ascii"?this.onAsciiEncoding():M.ToHex(this.toBER())}onAsciiEncoding(){const e=this.constructor.NAME,
t=M.ToHex(this.valueBlock.valueBeforeDecodeView);return`${e} : ${t}`}isEqual(e){if(this===e)return!0;if(!(e instanceof this.
constructor))return!1;const t=this.toBER(),n=e.toBER();return C8(t,n)}}j.NAME="BaseBlock";const e6=j.prototype.toBER;function Yg(r){
var e;if(r instanceof I.Constructed)for(const t of r.valueBlock.value)Yg(t)&&(r.lenBlock.isIndefiniteForm=!0);return!!(!((e=
r.lenBlock)===null||e===void 0)&&e.isIndefiniteForm)}class Qg extends j{getValue(){return this.valueBlock.value}setValue(e){
this.valueBlock.value=e}constructor({value:e=jr,...t}={},n){super(t,n),e&&this.fromString(e)}fromBER(e,t,n){const s=this.
valueBlock.fromBER(e,t,this.lenBlock.isIndefiniteForm?n:this.lenBlock.length);return s===-1?(this.error=this.valueBlock.
error,s):(this.fromBuffer(this.valueBlock.valueHexView),this.idBlock.error.length||(this.blockLength+=this.idBlock.blockLength),
this.lenBlock.error.length||(this.blockLength+=this.lenBlock.blockLength),this.valueBlock.error.length||(this.blockLength+=
this.valueBlock.blockLength),s)}onAsciiEncoding(){return`${this.constructor.NAME} : '${this.valueBlock.value}'`}}Qg.NAME=
"BaseStringBlock";var ya;class mo extends At(Ae){constructor({isHexOnly:e=!0,...t}={}){super(t),this.isHexOnly=e}}mo.NAME=
"PrimitiveValueBlock";const t6=(ya=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mo.prototype),"toBER"))===null||
ya===void 0?void 0:ya.value;var Zg;class Sl extends j{constructor(e={}){super(e,mo),this.idBlock.isConstructed=!1}}Zg=Sl;
I.Primitive=Zg;Sl.NAME="PRIMITIVE";let eb;function r6(r){eb={Integer:r.Integer,Null:r.Null,Sequence:r.Sequence}}function n6(r){
const e=Object.getOwnPropertyDescriptor(r,"nodesCount"),t=Object.getOwnPropertyDescriptor(r,"maxNodes"),n=Object.getOwnPropertyDescriptor(
r,"maxContentLength");return!e||!("value"in e)||e.writable!==!0||!t||!("value"in t)||!n||!("value"in n)?!1:typeof e.value==
"number"&&Number.isSafeInteger(e.value)&&e.value>=0&&typeof t.value=="number"&&Number.isSafeInteger(t.value)&&t.value>=0&&
typeof n.value=="number"&&Number.isSafeInteger(n.value)&&n.value>=0&&e.value<t.value}function s6(r,e,t){const n=Object.getOwnPropertyDescriptor(
r,e);return!!n&&"value"in n&&n.value===t}function i6(r,e,t,n){const s=eb;if(!s)return;let i,o=0;try{if(Object.getPrototypeOf(
r)!==Uint8Array.prototype||!Number.isSafeInteger(e)||e<0||!Number.isSafeInteger(t)||t<2||e>r.byteLength||t>r.byteLength-
e)return;const l=r[e];if(l!==2&&l!==5&&l!==48||(o=r[e+1],o>=128||o>t-2)||l===5&&o!==0||!n6(n)||o>Object.getOwnPropertyDescriptor(
n,"maxContentLength").value)return;const u=l===2?"Integer":l===5?"Null":"Sequence";if(i=s[u],!s6(I,u,i))return;const h=Object.
getOwnPropertyDescriptor(Wr.prototype,"fromBER"),d=Object.getOwnPropertyDescriptor(qr.prototype,"fromBER");if(!h||!("val\
ue"in h)||h.value!==D8||!d||!("value"in d)||d.value!==U8)return}catch{return}if(!i)return;const a=new i;a.idBlock.tagClass=
1,a.idBlock.tagNumber=r[e]&31,a.idBlock.isConstructed=r[e]===48,a.idBlock.isHexOnly=!1,a.idBlock.blockLength=1,a.lenBlock.
isIndefiniteForm=!1,a.lenBlock.longFormUsed=!1,a.lenBlock.length=o,a.lenBlock.blockLength=1,n.nodesCount+=1;const c=a.fromBER(
r,e+2,o,n);return a.valueBeforeDecodeView=r.subarray(e,e+a.blockLength),{offset:c,result:a}}const o6=100,a6=1e4,c6=16*1024*
1024,l6="Maximum ASN.1 nesting depth exceeded",u6="Maximum ASN.1 node count exceeded",h6="Maximum ASN.1 content length e\
xceeded";function ds(r={}){var e,t,n,s;return{depth:0,maxDepth:(e=r.maxDepth)!==null&&e!==void 0?e:o6,nodesCount:0,maxNodes:(t=
r.maxNodes)!==null&&t!==void 0?t:a6,maxContentLength:(n=r.maxContentLength)!==null&&n!==void 0?n:c6,parseEmbedded:(s=r.parseEmbedded)!==
null&&s!==void 0?s:!0}}function f6(r){const e=new j({},Ae);return e.error=r,{offset:-1,result:e}}function d6(r){if(r.nodesCount+=
1,r.nodesCount>r.maxNodes)return u6}function g6(r,e){if(r>e.maxContentLength)return h6}function kl(r,e,t,n){const s=n.depth+
1;if(s>n.maxDepth)return f6(l6);n.depth=s;try{return tb(r,e,t,n)}finally{n.depth-=1}}function b6(r,e){if(r instanceof e)
return r;const t=new e;return t.idBlock=r.idBlock,t.lenBlock=r.lenBlock,t.warnings=r.warnings,t.valueBeforeDecodeView=r.
valueBeforeDecodeView,t}function tb(r,e=0,t=r.length,n=ds()){const s=i6(r,e,t,n);if(s)return s;const i=e;let o=new j({},
Ae);if(!Et(o,r,e,t))return{offset:-1,result:o};if(Number.isInteger(e)&&Number.isInteger(t)?t===0:r.subarray(e,e+t).length===
0)return o.error="Zero buffer length",{offset:-1,result:o};const c=d6(n);if(c)return o.error=c,{offset:-1,result:o};let l=o.
idBlock.fromBER(r,e,t);if(o.idBlock.warnings.length&&o.warnings.concat(o.idBlock.warnings),l===-1)return o.error=o.idBlock.
error,{offset:-1,result:o};if(e=l,t-=o.idBlock.blockLength,l=o.lenBlock.fromBER(r,e,t),o.lenBlock.warnings.length&&o.warnings.
concat(o.lenBlock.warnings),l===-1)return o.error=o.lenBlock.error,{offset:-1,result:o};e=l,t-=o.lenBlock.blockLength;const u=o.
lenBlock.isIndefiniteForm?t:o.lenBlock.length,h=g6(u,n);if(h)return o.error=h,{offset:-1,result:o};if(!o.idBlock.isConstructed&&
o.lenBlock.isIndefiniteForm)return o.error="Indefinite length form used for primitive encoding form",{offset:-1,result:o};
let d=j;switch(o.idBlock.tagClass){case 1:if(o.idBlock.tagNumber>=37&&o.idBlock.isHexOnly===!1)return o.error="UNIVERSAL\
 37 and upper tags are reserved by ASN.1 standard",{offset:-1,result:o};switch(o.idBlock.tagNumber){case 0:if(o.idBlock.
isConstructed&&o.lenBlock.length>0)return o.error="Type [UNIVERSAL 0] is reserved",{offset:-1,result:o};d=I.EndOfContent;
break;case 1:d=I.Boolean;break;case 2:d=I.Integer;break;case 3:d=I.BitString;break;case 4:d=I.OctetString;break;case 5:d=
I.Null;break;case 6:d=I.ObjectIdentifier;break;case 10:d=I.Enumerated;break;case 12:d=I.Utf8String;break;case 13:d=I.RelativeObjectIdentifier;
break;case 14:d=I.TIME;break;case 15:return o.error="[UNIVERSAL 15] is reserved by ASN.1 standard",{offset:-1,result:o};case 16:
d=I.Sequence;break;case 17:d=I.Set;break;case 18:d=I.NumericString;break;case 19:d=I.PrintableString;break;case 20:d=I.TeletexString;
break;case 21:d=I.VideotexString;break;case 22:d=I.IA5String;break;case 23:d=I.UTCTime;break;case 24:d=I.GeneralizedTime;
break;case 25:d=I.GraphicString;break;case 26:d=I.VisibleString;break;case 27:d=I.GeneralString;break;case 28:d=I.UniversalString;
break;case 29:d=I.CharacterString;break;case 30:d=I.BmpString;break;case 31:d=I.DATE;break;case 32:d=I.TimeOfDay;break;case 33:
d=I.DateTime;break;case 34:d=I.Duration;break;default:{const b=o.idBlock.isConstructed?new I.Constructed:new I.Primitive;
b.idBlock=o.idBlock,b.lenBlock=o.lenBlock,b.warnings=o.warnings,o=b}}break;case 2:case 3:case 4:default:d=o.idBlock.isConstructed?
I.Constructed:I.Primitive}return o=b6(o,d),l=o.fromBER(r,e,u,n),o.valueBeforeDecodeView=r.subarray(i,i+o.blockLength),{offset:l,
result:o}}function pa(r,e={}){if(!r.byteLength){const s=new j({},Ae);return s.error="Input buffer has zero length",{offset:-1,
result:s}}const t=_.toUint8Array(r),n=e.copyInput===!1?t:t.slice();return tb(n,0,r.byteLength,ds(e))}function y6(r,e){return r?
1:e}class tt extends Ae{constructor({value:e=[],isIndefiniteForm:t=!1,...n}={}){super(n),this.value=e,this.isIndefiniteForm=
t}fromBER(e,t,n,s){const i=_.toUint8Array(e),o=s??ds();if(!Et(this,i,t,n))return-1;if(this.valueBeforeDecodeView=i.subarray(
t,t+n),this.valueBeforeDecodeView.length===0)return this.warnings.push("Zero buffer length"),t;let a=t;for(;y6(this.isIndefiniteForm,
n)>0;){const c=kl(i,a,n,o);if(c.offset===-1)return this.error=c.result.error,this.warnings.concat(c.result.warnings),-1;
if(a=c.offset,this.blockLength+=c.result.blockLength,n-=c.result.blockLength,this.value.push(c.result),this.isIndefiniteForm&&
c.result.constructor.NAME===jn)break}return this.isIndefiniteForm&&(this.value[this.value.length-1].constructor.NAME===jn?
this.value.pop():this.warnings.push("No EndOfContent block encoded")),a}toBER(e,t){const n=t||new Hr;for(let s=0;s<this.
value.length;s++)this.value[s].toBER(e,n);return t?ot:n.final()}toJSON(){const e={...super.toJSON(),isIndefiniteForm:this.
isIndefiniteForm,value:[]};for(const t of this.value)e.value.push(t.toJSON());return e}}tt.NAME="ConstructedValueBlock";
const p6=tt.prototype.toBER;var rb;class yr extends j{constructor(e={}){super(e,tt),this.idBlock.isConstructed=!0}fromBER(e,t,n,s){
this.valueBlock.isIndefiniteForm=this.lenBlock.isIndefiniteForm;const i=this.valueBlock.fromBER(e,t,this.lenBlock.isIndefiniteForm?
n:this.lenBlock.length,s);return i===-1?(this.error=this.valueBlock.error,i):(this.idBlock.error.length||(this.blockLength+=
this.idBlock.blockLength),this.lenBlock.error.length||(this.blockLength+=this.lenBlock.blockLength),this.valueBlock.error.
length||(this.blockLength+=this.valueBlock.blockLength),i)}onAsciiEncoding(){const e=[];for(const n of this.valueBlock.value)
e.push(n.toString("ascii").split(`
`).map(s=>`  ${s}`).join(`
`));const t=this.idBlock.tagClass===3?`[${this.idBlock.tagNumber}]`:this.constructor.NAME;return e.length?`${t} :
${e.join(`
`)}`:`${t} :`}}rb=yr;I.Constructed=rb;yr.NAME="CONSTRUCTED";class nb extends Ae{fromBER(e,t,n){return t}toBER(e){return ot}}
nb.override="EndOfContentValueBlock";var sb;class ib extends j{constructor(e={}){super(e,nb),this.idBlock.tagClass=1,this.
idBlock.tagNumber=0}}sb=ib;I.EndOfContent=sb;ib.NAME=jn;var ob;class Gn extends j{constructor(e={}){super(e,Ae),this.idBlock.
tagClass=1,this.idBlock.tagNumber=5}fromBER(e,t,n){return this.lenBlock.length>0&&this.warnings.push("Non-zero length of\
 value block for Null type"),this.idBlock.error.length||(this.blockLength+=this.idBlock.blockLength),this.lenBlock.error.
length||(this.blockLength+=this.lenBlock.blockLength),this.blockLength+=n,t+n>e.byteLength?(this.error="End of input rea\
ched before message was fully decoded (inconsistent offset and length values)",-1):t+n}toBER(e,t){const n=new ArrayBuffer(
2);if(!e){const s=new Uint8Array(n);s[0]=5,s[1]=0}return t&&t.write(n),n}onAsciiEncoding(){return`${this.constructor.NAME}`}}
ob=Gn;I.Null=ob;Gn.NAME="NULL";class ab extends At(Ae){get value(){for(const e of this.valueHexView)if(e>0)return!0;return!1}set value(e){
this.valueHexView[0]=e?255:0}constructor({value:e,...t}={}){super(t),t.valueHex?this.valueHexView=_.toUint8Array(t.valueHex):
this.valueHexView=new Uint8Array(1),e&&(this.value=e)}fromBER(e,t,n){const s=_.toUint8Array(e);return Et(this,s,t,n)?(this.
valueHexView=s.subarray(t,t+n),n>1&&this.warnings.push("Boolean value encoded in more then 1 octet"),this.isHexOnly=!0,zg.
call(this),this.blockLength=n,t+n):-1}toBER(){return this.valueHexView.slice().buffer}toJSON(){return{...super.toJSON(),
value:this.value}}}ab.NAME="BooleanValueBlock";var cb;let lb=class extends j{getValue(){return this.valueBlock.value}setValue(e){
this.valueBlock.value=e}constructor(e={}){super(e,ab),this.idBlock.tagClass=1,this.idBlock.tagNumber=1}onAsciiEncoding(){
return`${this.constructor.NAME} : ${this.getValue}`}};cb=lb;I.Boolean=cb;lb.NAME="BOOLEAN";class vo extends At(tt){constructor({
isConstructed:e=!1,...t}={}){super(t),this.isConstructed=e}fromBER(e,t,n,s){let i=0;if(this.isConstructed){if(this.isHexOnly=
!1,i=tt.prototype.fromBER.call(this,e,t,n,s),i===-1)return i;for(let o=0;o<this.value.length;o++){const a=this.value[o].
constructor.NAME;if(a===jn){if(this.isIndefiniteForm)break;return this.error="EndOfContent is unexpected, OCTET STRING m\
ay consists of OCTET STRINGs only",-1}if(a!==Hg)return this.error="OCTET STRING may consists of OCTET STRINGs only",-1}}else
this.isHexOnly=!0,i=super.fromBER(e,t,n),this.blockLength=n;return i}toBER(e,t){return this.isConstructed?tt.prototype.toBER.
call(this,e,t):e?new ArrayBuffer(this.valueHexView.byteLength):this.valueHexView.slice().buffer}toJSON(){return{...super.
toJSON(),isConstructed:this.isConstructed}}}vo.NAME="OctetStringValueBlock";const w6=vo.prototype.toBER;var $l;class Qt extends j{constructor({
idBlock:e={},lenBlock:t={},...n}={}){var s,i;(s=n.isConstructed)!==null&&s!==void 0||(n.isConstructed=!!(!((i=n.value)===
null||i===void 0)&&i.length)),super({idBlock:{isConstructed:n.isConstructed,...e},lenBlock:{...t,isIndefiniteForm:!!n.isIndefiniteForm},
...n},vo),this.idBlock.tagClass=1,this.idBlock.tagNumber=4}fromBER(e,t,n,s){if(this.valueBlock.isConstructed=this.idBlock.
isConstructed,this.valueBlock.isIndefiniteForm=this.lenBlock.isIndefiniteForm,n===0)return this.idBlock.error.length===0&&
(this.blockLength+=this.idBlock.blockLength),this.lenBlock.error.length===0&&(this.blockLength+=this.lenBlock.blockLength),
t;if(!this.valueBlock.isConstructed&&s?.parseEmbedded!==!1){const o=(e instanceof ArrayBuffer?new Uint8Array(e):e).subarray(
t,t+n);try{if(o.byteLength){const a=s??ds(),c=kl(o,0,o.byteLength,a);c.offset!==-1&&c.offset===n&&(this.valueBlock.value=
[c.result])}}catch{}}return super.fromBER(e,t,n,s)}onAsciiEncoding(){if(this.valueBlock.isConstructed||this.valueBlock.value&&
this.valueBlock.value.length)return yr.prototype.onAsciiEncoding.call(this);const e=this.constructor.NAME,t=M.ToHex(this.
valueBlock.valueHexView);return`${e} : ${t}`}getValue(){if(!this.idBlock.isConstructed)return this.valueBlock.valueHexView.
slice().buffer;const e=[];for(const t of this.valueBlock.value)t instanceof $l&&e.push(t.valueBlock.valueHexView);return _.
concat(e)}}$l=Qt;I.OctetString=$l;Qt.NAME=Hg;class Eo extends At(tt){constructor({unusedBits:e=0,isConstructed:t=!1,...n}={}){
super(n),this.unusedBits=e,this.isConstructed=t,this.blockLength=this.valueHexView.byteLength}fromBER(e,t,n,s){if(!n)return t;
let i=-1;if(this.isConstructed){if(i=tt.prototype.fromBER.call(this,e,t,n,s),i===-1)return i;for(const c of this.value){
const l=c.constructor.NAME;if(l===jn){if(this.isIndefiniteForm)break;return this.error="EndOfContent is unexpected, BIT \
STRING may consists of BIT STRINGs only",-1}if(l!==jg)return this.error="BIT STRING may consists of BIT STRINGs only",-1;
const u=c.valueBlock;if(this.unusedBits>0&&u.unusedBits>0)return this.error='Using of "unused bits" inside constructive \
BIT STRING allowed for least one only',-1;this.unusedBits=u.unusedBits}return i}const o=_.toUint8Array(e);if(!Et(this,o,
t,n))return-1;const a=o.subarray(t,t+n);if(this.unusedBits=a[0],this.unusedBits>7)return this.error="Unused bits for Bit\
String must be in range 0-7",-1;if(!this.unusedBits&&s?.parseEmbedded!==!1){const c=a.subarray(1);try{if(c.byteLength){const l=s??
ds(),u=kl(c,0,c.byteLength,l);u.offset!==-1&&u.offset===n-1&&(this.value=[u.result])}}catch{}}return this.valueHexView=a.
subarray(1),this.blockLength=a.length,t+n}toBER(e,t){if(this.isConstructed)return tt.prototype.toBER.call(this,e,t);if(e)
return new ArrayBuffer(this.valueHexView.byteLength+1);if(!this.valueHexView.byteLength){const s=new Uint8Array(1);return s[0]=
0,s.buffer}const n=new Uint8Array(this.valueHexView.length+1);return n[0]=this.unusedBits,n.set(this.valueHexView,1),n.buffer}toJSON(){
return{...super.toJSON(),unusedBits:this.unusedBits,isConstructed:this.isConstructed}}}Eo.NAME="BitStringValueBlock";const m6=Eo.
prototype.toBER;var ub;class Cl extends j{constructor({idBlock:e={},lenBlock:t={},...n}={}){var s,i;(s=n.isConstructed)!==
null&&s!==void 0||(n.isConstructed=!!(!((i=n.value)===null||i===void 0)&&i.length)),super({idBlock:{isConstructed:n.isConstructed,
...e},lenBlock:{...t,isIndefiniteForm:!!n.isIndefiniteForm},...n},Eo),this.idBlock.tagClass=1,this.idBlock.tagNumber=3}fromBER(e,t,n,s){
return this.valueBlock.isConstructed=this.idBlock.isConstructed,this.valueBlock.isIndefiniteForm=this.lenBlock.isIndefiniteForm,
super.fromBER(e,t,n,s)}onAsciiEncoding(){if(this.valueBlock.isConstructed||this.valueBlock.value&&this.valueBlock.value.
length)return yr.prototype.onAsciiEncoding.call(this);{const e=[],t=this.valueBlock.valueHexView;for(const o of t)e.push(
o.toString(2).padStart(8,"0"));const n=e.join(""),s=this.constructor.NAME,i=n.substring(0,n.length-this.valueBlock.unusedBits);
return`${s} : ${i}`}}}ub=Cl;I.BitString=ub;Cl.NAME=jg;function hb(r){if(!r.byteLength)return BigInt(0);const e=BigInt(`0\
x${M.ToHex(r)}`);return r[0]&128?e-(BigInt(1)<<BigInt(r.byteLength*8)):e}function v6(r){if(typeof BigInt<"u")return hb(r).
toString(10);const e=1e7,t=7;if(!r.byteLength)return"0";const n=!!(r[0]&128);let s=r;if(n){s=new Uint8Array(r.length);let c=1;
for(let l=r.length-1;l>=0;l--){const u=(r[l]^255)+c;s[l]=u&255,c=u>>8}}const i=[0];for(let c=0;c<s.length;c++){let l=s[c];
for(let u=0;u<i.length;u++){const h=i[u]*256+l;i[u]=h%e,l=Math.floor(h/e)}l&&i.push(l)}let o=i.length-1;for(;o>0&&i[o]===
0;)o--;let a=String(i[o]);for(let c=o-1;c>=0;c--)a+=String(i[c]).padStart(t,"0");return n&&a!=="0"?`-${a}`:a}var fb;class Jr extends At(
Ae){setValueHex(){this.valueHexView.length>=4?(this.warnings.push("Too big Integer for decoding, hex only"),this.isHexOnly=
!0,this._valueDec=0):(this.isHexOnly=!1,this.valueHexView.length>0&&(this._valueDec=zg.call(this)))}constructor({value:e,
...t}={}){super(t),this._valueDec=0,t.valueHex&&this.setValueHex(),e!==void 0&&(this.valueDec=e)}set valueDec(e){this._valueDec=
e,this.isHexOnly=!1,this.valueHexView=new Uint8Array($8(e))}get valueDec(){return this._valueDec}fromDER(e,t,n,s=0){const i=this.
fromBER(e,t,n);if(i===-1)return i;const o=this.valueHexView;return o[0]===0&&(o[1]&128)!==0?this.valueHexView=o.subarray(
1):s!==0&&o.length<s&&(s-o.length>1&&(s=o.length+1),this.valueHexView=o.subarray(s-o.length)),i}toDER(e=!1){const t=this.
valueHexView;switch(!0){case(t[0]&128)!==0:{const n=new Uint8Array(this.valueHexView.length+1);n[0]=0,n.set(t,1),this.valueHexView=
n}break;case(t[0]===0&&(t[1]&128)===0):this.valueHexView=this.valueHexView.subarray(1);break}return this.toBER(e)}fromBER(e,t,n){
const s=super.fromBER(e,t,n);return s===-1||this.setValueHex(),s}toBER(e){return e?new ArrayBuffer(this.valueHexView.length):
this.valueHexView.slice().buffer}toJSON(){return{...super.toJSON(),valueDec:this.valueDec}}toString(){return v6(this.valueHexView)}}
fb=Jr;Jr.NAME="IntegerValueBlock";Object.defineProperty(fb.prototype,"valueHex",{set:function(r){this.valueHexView=new Uint8Array(
r),this.setValueHex()},get:function(){return this.valueHexView.slice().buffer}});const E6=Jr.prototype.toBER,A6=Jr.prototype.
toString;var Ln;class Ot extends j{constructor(e={}){super(e,Jr),this.idBlock.tagClass=1,this.idBlock.tagNumber=2}toBigInt(){
Bi();const e=this.valueBlock,t=e.toString;return t===A6?hb(e.valueHexView):BigInt(Reflect.apply(t,e,[]))}static fromBigInt(e){
Bi();const t=BigInt(e),n=new Hr,s=t.toString(16).replace(/^-/,""),i=new Uint8Array(M.FromHex(s));if(t<0){const a=new Uint8Array(
i.length+(i[0]&128?1:0));a[0]|=128;const l=BigInt(`0x${M.ToHex(a)}`)+t,u=_.toUint8Array(M.FromHex(l.toString(16)));u[0]|=
128,n.write(u)}else i[0]&128&&n.write(new Uint8Array([0])),n.write(i);return new Ln({valueHex:n.final()})}convertToDER(){
const e=new Ln({valueHex:this.valueBlock.valueHexView});return e.valueBlock.toDER(),e}convertFromDER(){return new Ln({valueHex:this.
valueBlock.valueHexView[0]===0?this.valueBlock.valueHexView.subarray(1):this.valueBlock.valueHexView})}onAsciiEncoding(){
return`${this.constructor.NAME} : ${this.valueBlock.toString()}`}}Ln=Ot;I.Integer=Ln;Ot.NAME="INTEGER";var db;class gb extends Ot{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=10}}db=gb;I.Enumerated=db;gb.NAME="ENUMERATED";class gc extends At(
Ae){constructor({valueDec:e=-1,isFirstSid:t=!1,...n}={}){super(n),this.valueDec=e,this.isFirstSid=t}fromBER(e,t,n){if(!n)
return t;const s=_.toUint8Array(e);if(!Et(this,s,t,n))return-1;const i=s.subarray(t,t+n);if(this.blockLength===0&&Number.
isInteger(t)&&Number.isInteger(n)){let a=0;for(;a<n;){const c=i[a];if(a++,(c&128)===0)break}this.blockLength=a,this.valueHexView=
new Uint8Array(a);for(let c=0;c<a;c++)this.valueHexView[c]=i[c]&127}else{this.valueHexView=new Uint8Array(n);for(let c=0;c<
n&&(this.valueHexView[c]=i[c]&127,this.blockLength++,(i[c]&128)!==0);c++);const a=new Uint8Array(this.blockLength);for(let c=0;c<
this.blockLength;c++)a[c]=this.valueHexView[c];this.valueHexView=a}return(i[this.blockLength-1]&128)!==0?(this.error="En\
d of input reached before message was fully decoded",-1):(this.valueHexView[0]===0&&this.warnings.push("Needlessly long \
format of SID encoding"),this.blockLength<=8?this.valueDec=Mr(this.valueHexView,7):(this.isHexOnly=!0,this.warnings.push(
"Too big SID for decoding, hex only")),t+this.blockLength)}set valueBigInt(e){Bi();let t=BigInt(e).toString(2);for(;t.length%
7;)t="0"+t;const n=new Uint8Array(t.length/7);for(let s=0;s<n.length;s++)n[s]=parseInt(t.slice(s*7,s*7+7),2)+(s+1<n.length?
128:0);this.fromBER(n.buffer,0,n.length)}toBER(e){if(this.isHexOnly){if(e)return new ArrayBuffer(this.valueHexView.byteLength);
const s=this.valueHexView,i=new Uint8Array(this.blockLength);for(let o=0;o<this.blockLength-1;o++)i[o]=s[o]|128;return i[this.
blockLength-1]=s[this.blockLength-1],_.toArrayBuffer(i)}const t=hr(this.valueDec,7);if(t.byteLength===0)return this.error=
"Error during encoding SID value",ot;const n=new Uint8Array(t.byteLength);if(!e){const s=new Uint8Array(t),i=t.byteLength-
1;for(let o=0;o<i;o++)n[o]=s[o]|128;n[i]=s[i]}return _.toArrayBuffer(n)}toString(){let e="";if(this.isHexOnly)e=M.ToHex(
this.valueHexView);else if(this.isFirstSid){let t=this.valueDec;this.valueDec<=39?e="0.":this.valueDec<=79?(e="1.",t-=40):
(e="2.",t-=80),e+=t.toString()}else e=this.valueDec.toString();return e}toJSON(){return{...super.toJSON(),valueDec:this.
valueDec,isFirstSid:this.isFirstSid}}}gc.NAME="sidBlock";class bb extends Ae{constructor({value:e=jr,...t}={}){super(t),
this.value=[],e&&this.fromString(e)}fromBER(e,t,n){let s=t;for(;n>0;){const i=new gc;if(s=i.fromBER(e,s,n),s===-1)return this.
blockLength=0,this.error=i.error,s;this.value.length===0&&(i.isFirstSid=!0),this.blockLength+=i.blockLength,n-=i.blockLength,
this.value.push(i)}return s}toBER(e){const t=[];for(let n=0;n<this.value.length;n++){const s=this.value[n].toBER(e);if(s.
byteLength===0)return this.error=this.value[n].error,ot;t.push(s)}return Li(t)}fromString(e){this.value=[];let t=0,n=0,s="",
i=!1;do if(n=e.indexOf(".",t),n===-1?s=e.substring(t):s=e.substring(t,n),t=n+1,i){const o=this.value[0];let a=0;switch(o.
valueDec){case 0:break;case 1:a=40;break;case 2:a=80;break;default:this.value=[];return}const c=parseInt(s,10);if(isNaN(
c))return;o.valueDec=c+a,i=!1}else{const o=new gc;if(s>Number.MAX_SAFE_INTEGER){Bi();const a=BigInt(s);o.valueBigInt=a}else if(o.
valueDec=parseInt(s,10),isNaN(o.valueDec))return;this.value.length||(o.isFirstSid=!0,i=!0),this.value.push(o)}while(n!==
-1)}toString(){let e="",t=!1;for(let n=0;n<this.value.length;n++){t=this.value[n].isHexOnly;let s=this.value[n].toString();
n!==0&&(e=`${e}.`),t?(s=`{${s}}`,this.value[n].isFirstSid?e=`2.{${s} - 80}`:e+=s):e+=s}return e}toJSON(){const e={...super.
toJSON(),value:this.toString(),sidArray:[]};for(let t=0;t<this.value.length;t++)e.sidArray.push(this.value[t].toJSON());
return e}}bb.NAME="ObjectIdentifierValueBlock";var yb;class Yt extends j{getValue(){return this.valueBlock.toString()}setValue(e){
this.valueBlock.fromString(e)}constructor(e={}){super(e,bb),this.idBlock.tagClass=1,this.idBlock.tagNumber=6}onAsciiEncoding(){
return`${this.constructor.NAME} : ${this.valueBlock.toString()||"empty"}`}toJSON(){return{...super.toJSON(),value:this.getValue()}}}
yb=Yt;I.ObjectIdentifier=yb;Yt.NAME="OBJECT IDENTIFIER";class bc extends At(Gr){constructor({valueDec:e=0,...t}={}){super(
t),this.valueDec=e}fromBER(e,t,n){if(n===0)return t;const s=_.toUint8Array(e);if(!Et(this,s,t,n))return-1;const i=s.subarray(
t,t+n);if(this.blockLength===0&&Number.isInteger(t)&&Number.isInteger(n)){let a=0;for(;a<n;){const c=i[a];if(a++,(c&128)===
0)break}this.blockLength=a,this.valueHexView=new Uint8Array(a);for(let c=0;c<a;c++)this.valueHexView[c]=i[c]&127}else{this.
valueHexView=new Uint8Array(n);for(let c=0;c<n&&(this.valueHexView[c]=i[c]&127,this.blockLength++,(i[c]&128)!==0);c++);const a=new Uint8Array(
this.blockLength);for(let c=0;c<this.blockLength;c++)a[c]=this.valueHexView[c];this.valueHexView=a}return(i[this.blockLength-
1]&128)!==0?(this.error="End of input reached before message was fully decoded",-1):(this.valueHexView[0]===0&&this.warnings.
push("Needlessly long format of SID encoding"),this.blockLength<=8?this.valueDec=Mr(this.valueHexView,7):(this.isHexOnly=
!0,this.warnings.push("Too big SID for decoding, hex only")),t+this.blockLength)}toBER(e){if(this.isHexOnly){if(e)return new ArrayBuffer(
this.valueHexView.byteLength);const s=this.valueHexView,i=new Uint8Array(this.blockLength);for(let o=0;o<this.blockLength-
1;o++)i[o]=s[o]|128;return i[this.blockLength-1]=s[this.blockLength-1],i.buffer}const t=hr(this.valueDec,7);if(t.byteLength===
0)return this.error="Error during encoding SID value",ot;const n=new Uint8Array(t.byteLength);if(!e){const s=new Uint8Array(
t),i=t.byteLength-1;for(let o=0;o<i;o++)n[o]=s[o]|128;n[i]=s[i]}return n.buffer}toString(){let e="";return this.isHexOnly?
e=M.ToHex(this.valueHexView):e=this.valueDec.toString(),e}toJSON(){return{...super.toJSON(),valueDec:this.valueDec}}}bc.
NAME="relativeSidBlock";class pb extends Ae{constructor({value:e=jr,...t}={}){super(t),this.value=[],e&&this.fromString(
e)}fromBER(e,t,n){let s=t;for(;n>0;){const i=new bc;if(s=i.fromBER(e,s,n),s===-1)return this.blockLength=0,this.error=i.
error,s;this.blockLength+=i.blockLength,n-=i.blockLength,this.value.push(i)}return s}toBER(e,t){const n=[];for(let s=0;s<
this.value.length;s++){const i=this.value[s].toBER(e);if(i.byteLength===0)return this.error=this.value[s].error,ot;n.push(
i)}return Li(n)}fromString(e){this.value=[];let t=0,n=0,s="";do{n=e.indexOf(".",t),n===-1?s=e.substring(t):s=e.substring(
t,n),t=n+1;const i=new bc;if(i.valueDec=parseInt(s,10),isNaN(i.valueDec))return!0;this.value.push(i)}while(n!==-1);return!0}toString(){
let e="",t=!1;for(let n=0;n<this.value.length;n++){t=this.value[n].isHexOnly;let s=this.value[n].toString();n!==0&&(e=`${e}\
.`),t&&(s=`{${s}}`),e+=s}return e}toJSON(){const e={...super.toJSON(),value:this.toString(),sidArray:[]};for(let t=0;t<this.
value.length;t++)e.sidArray.push(this.value[t].toJSON());return e}}pb.NAME="RelativeObjectIdentifierValueBlock";var wb;class mb extends j{getValue(){
return this.valueBlock.toString()}setValue(e){this.valueBlock.fromString(e)}constructor(e={}){super(e,pb),this.idBlock.tagClass=
1,this.idBlock.tagNumber=13}onAsciiEncoding(){return`${this.constructor.NAME} : ${this.valueBlock.toString()||"empty"}`}toJSON(){
return{...super.toJSON(),value:this.getValue()}}}wb=mb;I.RelativeObjectIdentifier=wb;mb.NAME="RelativeObjectIdentifier";
var vb;class Ie extends yr{constructor(e={}){super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=16}}vb=Ie;I.Sequence=
vb;Ie.NAME="SEQUENCE";var Eb;let Il=class extends yr{constructor(e={}){super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=
17}};Eb=Il;I.Set=Eb;Il.NAME="SET";class Ab extends At(Ae){constructor({...e}={}){super(e),this.isHexOnly=!0,this.value=jr}toJSON(){
return{...super.toJSON(),value:this.value}}}Ab.NAME="StringValueBlock";class xb extends Ab{}xb.NAME="SimpleStringValueBl\
ock";class Ue extends Qg{constructor({...e}={}){super(e,xb)}fromBuffer(e){this.valueBlock.value=String.fromCharCode.apply(
null,_.toUint8Array(e))}fromString(e){const t=e.length,n=this.valueBlock.valueHexView=new Uint8Array(t);for(let s=0;s<t;s++)
n[s]=e.charCodeAt(s);this.valueBlock.value=e}}Ue.NAME="SIMPLE STRING";class Sb extends Ue{fromBuffer(e){this.valueBlock.
valueHexView=_.toUint8Array(e);try{this.valueBlock.value=M.ToUtf8String(e)}catch(t){this.warnings.push(`Error during "de\
codeURIComponent": ${t}, using raw string`),this.valueBlock.value=M.ToBinary(e)}}fromString(e){this.valueBlock.valueHexView=
new Uint8Array(M.FromUtf8String(e)),this.valueBlock.value=e}}Sb.NAME="Utf8StringValueBlock";var kb;class pr extends Sb{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=12}}kb=pr;I.Utf8String=kb;pr.NAME="UTF8String";class $b extends Ue{fromBuffer(e){
this.valueBlock.value=M.ToUtf16String(e),this.valueBlock.valueHexView=_.toUint8Array(e)}fromString(e){this.valueBlock.value=
e,this.valueBlock.valueHexView=new Uint8Array(M.FromUtf16String(e))}}$b.NAME="BmpStringValueBlock";var Cb;class Ib extends $b{constructor({
...e}={}){super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=30}}Cb=Ib;I.BmpString=Cb;Ib.NAME="BMPString";class Bb extends Ue{fromBuffer(e){
const t=ArrayBuffer.isView(e)?e.slice().buffer:e.slice(0),n=new Uint8Array(t);for(let s=0;s<n.length;s+=4)n[s]=n[s+3],n[s+
1]=n[s+2],n[s+2]=0,n[s+3]=0;this.valueBlock.value=String.fromCharCode.apply(null,new Uint32Array(t))}fromString(e){const t=e.
length,n=this.valueBlock.valueHexView=new Uint8Array(t*4);for(let s=0;s<t;s++){const i=hr(e.charCodeAt(s),8),o=new Uint8Array(
i);if(o.length>4)continue;const a=4-o.length;for(let c=o.length-1;c>=0;c--)n[s*4+c+a]=o[c]}this.valueBlock.value=e}}Bb.NAME=
"UniversalStringValueBlock";var Lb;class Db extends Bb{constructor({...e}={}){super(e),this.idBlock.tagClass=1,this.idBlock.
tagNumber=28}}Lb=Db;I.UniversalString=Lb;Db.NAME="UniversalString";var Nb;class Ub extends Ue{constructor(e={}){super(e),
this.idBlock.tagClass=1,this.idBlock.tagNumber=18}}Nb=Ub;I.NumericString=Nb;Ub.NAME="NumericString";var _b;class Pb extends Ue{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=19}}_b=Pb;I.PrintableString=_b;Pb.NAME="PrintableString";var Tb;
class Mb extends Ue{constructor(e={}){super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=20}}Tb=Mb;I.TeletexString=
Tb;Mb.NAME="TeletexString";var Ob;class Rb extends Ue{constructor(e={}){super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=
21}}Ob=Rb;I.VideotexString=Ob;Rb.NAME="VideotexString";var Fb;class Vb extends Ue{constructor(e={}){super(e),this.idBlock.
tagClass=1,this.idBlock.tagNumber=22}}Fb=Vb;I.IA5String=Fb;Vb.NAME="IA5String";var Kb;class zb extends Ue{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=25}}Kb=zb;I.GraphicString=Kb;zb.NAME="GraphicString";var Hb;class Bl extends Ue{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=26}}Hb=Bl;I.VisibleString=Hb;Bl.NAME="VisibleString";var jb;class Gb extends Ue{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=27}}jb=Gb;I.GeneralString=jb;Gb.NAME="GeneralString";var Wb;class qb extends Ue{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=29}}Wb=qb;I.CharacterString=Wb;qb.NAME="CharacterString";var Jb;
class Ll extends Bl{constructor({value:e,valueDate:t,...n}={}){if(super(n),this.year=0,this.month=0,this.day=0,this.hour=
0,this.minute=0,this.second=0,e){this.fromString(e),this.valueBlock.valueHexView=new Uint8Array(e.length);for(let s=0;s<
e.length;s++)this.valueBlock.valueHexView[s]=e.charCodeAt(s)}t&&(this.fromDate(t),this.valueBlock.valueHexView=new Uint8Array(
this.toBuffer())),this.idBlock.tagClass=1,this.idBlock.tagNumber=23}fromBuffer(e){this.fromString(String.fromCharCode.apply(
null,_.toUint8Array(e)))}toBuffer(){const e=this.toString(),t=new ArrayBuffer(e.length),n=new Uint8Array(t);for(let s=0;s<
e.length;s++)n[s]=e.charCodeAt(s);return t}fromDate(e){this.year=e.getUTCFullYear(),this.month=e.getUTCMonth()+1,this.day=
e.getUTCDate(),this.hour=e.getUTCHours(),this.minute=e.getUTCMinutes(),this.second=e.getUTCSeconds()}toDate(){return new Date(
Date.UTC(this.year,this.month-1,this.day,this.hour,this.minute,this.second))}fromString(e){const n=/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/gi.
exec(e);if(n===null){this.error="Wrong input string for conversion";return}const s=parseInt(n[1],10);s>=50?this.year=1900+
s:this.year=2e3+s,this.month=parseInt(n[2],10),this.day=parseInt(n[3],10),this.hour=parseInt(n[4],10),this.minute=parseInt(
n[5],10),this.second=parseInt(n[6],10)}toString(e="iso"){if(e==="iso"){const t=Array.from({length:7});return t[0]=Be(this.
year<2e3?this.year-1900:this.year-2e3,2),t[1]=Be(this.month,2),t[2]=Be(this.day,2),t[3]=Be(this.hour,2),t[4]=Be(this.minute,
2),t[5]=Be(this.second,2),t[6]="Z",t.join("")}return super.toString(e)}onAsciiEncoding(){return`${this.constructor.NAME}\
 : ${this.toDate().toISOString()}`}toJSON(){return{...super.toJSON(),year:this.year,month:this.month,day:this.day,hour:this.
hour,minute:this.minute,second:this.second}}}Jb=Ll;I.UTCTime=Jb;Ll.NAME="UTCTime";var Xb;class Yb extends Ll{constructor(e={}){
var t;super(e),(t=this.millisecond)!==null&&t!==void 0||(this.millisecond=0),this.idBlock.tagClass=1,this.idBlock.tagNumber=
24}fromDate(e){super.fromDate(e),this.millisecond=e.getUTCMilliseconds()}toDate(){const e=Date.UTC(this.year,this.month-
1,this.day,this.hour,this.minute,this.second,this.millisecond);return new Date(e)}fromString(e){let t=!1,n="",s="",i=0,o,
a=0,c=0;if(e[e.length-1]==="Z")n=e.substring(0,e.length-1),t=!0;else{const h=new Number(e[e.length-1]);if(isNaN(h.valueOf()))
throw new Error("Wrong input string for conversion");n=e}if(t){if(n.indexOf("+")!==-1)throw new Error("Wrong input strin\
g for conversion");if(n.indexOf("-")!==-1)throw new Error("Wrong input string for conversion")}else{let h=1,d=n.indexOf(
"+"),b="";if(d===-1&&(d=n.indexOf("-"),h=-1),d!==-1){if(b=n.substring(d+1),n=n.substring(0,d),b.length!==2&&b.length!==4)
throw new Error("Wrong input string for conversion");let k=parseInt(b.substring(0,2),10);if(isNaN(k.valueOf()))throw new Error(
"Wrong input string for conversion");if(a=h*k,b.length===4){if(k=parseInt(b.substring(2,4),10),isNaN(k.valueOf()))throw new Error(
"Wrong input string for conversion");c=h*k}}}let l=n.indexOf(".");if(l===-1&&(l=n.indexOf(",")),l!==-1){const h=new Number(
`0${n.substring(l)}`);if(isNaN(h.valueOf()))throw new Error("Wrong input string for conversion");i=h.valueOf(),s=n.substring(
0,l)}else s=n;switch(!0){case s.length===8:if(o=/(\d{4})(\d{2})(\d{2})/gi,l!==-1)throw new Error("Wrong input string for\
 conversion");break;case s.length===10:if(o=/(\d{4})(\d{2})(\d{2})(\d{2})/gi,l!==-1){let h=60*i;this.minute=Math.floor(h),
h=60*(h-this.minute),this.second=Math.floor(h),h=1e3*(h-this.second),this.millisecond=Math.floor(h)}break;case s.length===
12:if(o=/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/gi,l!==-1){let h=60*i;this.second=Math.floor(h),h=1e3*(h-this.second),this.
millisecond=Math.floor(h)}break;case s.length===14:if(o=/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/gi,l!==-1){const h=1e3*
i;this.millisecond=Math.floor(h)}break;default:throw new Error("Wrong input string for conversion")}const u=o.exec(s);if(u===
null)throw new Error("Wrong input string for conversion");for(let h=1;h<u.length;h++)switch(h){case 1:this.year=parseInt(
u[h],10);break;case 2:this.month=parseInt(u[h],10);break;case 3:this.day=parseInt(u[h],10);break;case 4:this.hour=parseInt(
u[h],10)+a;break;case 5:this.minute=parseInt(u[h],10)+c;break;case 6:this.second=parseInt(u[h],10);break;default:throw new Error(
"Wrong input string for conversion")}if(t===!1){const h=new Date(this.year,this.month,this.day,this.hour,this.minute,this.
second,this.millisecond);this.year=h.getUTCFullYear(),this.month=h.getUTCMonth(),this.day=h.getUTCDay(),this.hour=h.getUTCHours(),
this.minute=h.getUTCMinutes(),this.second=h.getUTCSeconds(),this.millisecond=h.getUTCMilliseconds()}}toString(e="iso"){if(e===
"iso"){const t=[];return t.push(Be(this.year,4)),t.push(Be(this.month,2)),t.push(Be(this.day,2)),t.push(Be(this.hour,2)),
t.push(Be(this.minute,2)),t.push(Be(this.second,2)),this.millisecond!==0&&(t.push("."),t.push(Be(this.millisecond,3).replace(
/0+$/,""))),t.push("Z"),t.join("")}return super.toString(e)}toJSON(){return{...super.toJSON(),millisecond:this.millisecond}}}
Xb=Yb;I.GeneralizedTime=Xb;Yb.NAME="GeneralizedTime";var Qb;class Zb extends pr{constructor(e={}){super(e),this.idBlock.
tagClass=1,this.idBlock.tagNumber=31}}Qb=Zb;I.DATE=Qb;Zb.NAME="DATE";var ey;class ty extends pr{constructor(e={}){super(
e),this.idBlock.tagClass=1,this.idBlock.tagNumber=32}}ey=ty;I.TimeOfDay=ey;ty.NAME="TimeOfDay";var ry;class ny extends pr{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=33}}ry=ny;I.DateTime=ry;ny.NAME="DateTime";var sy;class iy extends pr{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=34}}sy=iy;I.Duration=sy;iy.NAME="Duration";var oy;class ay extends pr{constructor(e={}){
super(e),this.idBlock.tagClass=1,this.idBlock.tagNumber=14}}oy=ay;I.TIME=oy;ay.NAME="TIME";O8({BitString:Cl,Integer:Ot,OctetString:Qt,
Primitive:Sl,Constructed:yr,Sequence:Ie,Set:Il},{BaseBlock:j,ViewWriter:Hr,LocalIdentificationBlock:Wr,LocalLengthBlock:qr,
LocalIntegerValueBlock:Jr,LocalOctetStringValueBlock:vo,LocalConstructedValueBlock:tt,LocalBitStringValueBlock:Eo,LocalPrimitiveValueBlock:mo,
originalBaseBlockToBER:e6,originalWriterWrite:I8,originalWriterFinal:B8,originalIdentificationToBER:L8,originalLengthToBER:N8,
originalIntegerToBER:E6,originalOctetStringToBER:w6,originalBitStringToBER:m6,originalConstructedToBER:p6,originalPrimitiveToBER:t6});
r6({Integer:Ot,Null:Gn,Sequence:Ie});const x6=16,yc=32,pc=1e4;async function Ao(r,e){const n=await Kg().encrypt(r,e);return bo.
encode(n)}async function Eh(r,e,t){if(r.type==="RSA")return C6(r,e,t);if(r.type==="Ed25519")return S6(r,e,t);if(r.type===
"secp256k1")return k6(r,e,t);if(r.type==="ECDSA")return $6(r,e,t);throw new qi}async function S6(r,e,t="libp2p-key"){if(t===
"libp2p-key")return Ao(fs(r),e);throw new B(`export format '${t}' is not supported`)}async function k6(r,e,t="libp2p-key"){
if(t==="libp2p-key")return Ao(fs(r),e);throw new B("Export format is not supported")}async function $6(r,e,t="libp2p-key"){
if(t==="libp2p-key")return Ao(fs(r),e);throw new B(`export format '${t}' is not supported`)}async function C6(r,e,t="pkc\
s-8"){if(t==="pkcs-8")return I6(r,e);if(t==="libp2p-key")return Ao(fs(r),e);throw new B("Export format is not supported")}
async function I6(r,e){const t=Ve.get(),s=new Ie({value:[new Ot({value:0}),new Ie({value:[new Yt({value:"1.2.840.113549.\
1.1.1"}),new Gn]}),new Qt({valueHex:r.raw})]}).toBER(),i=new Uint8Array(s,0,s.byteLength),o=t.getRandomValues(new Uint8Array(
x6)),a=await zf(Rc,e,o,{c:pc,dkLen:yc}),c=t.getRandomValues(new Uint8Array(16)),l=await t.subtle.importKey("raw",F(a),"A\
ES-CBC",!1,["encrypt"]),u=await t.subtle.encrypt({name:"AES-CBC",iv:F(c)},l,F(i)),h=new Ie({value:[new Qt({valueHex:o}),
new Ot({value:pc}),new Ot({value:yc}),new Ie({value:[new Yt({value:"1.2.840.113549.2.11"}),new Gn]})]}),d=new Ie({value:[
new Yt({value:"1.2.840.113549.1.5.13"}),new Ie({value:[new Ie({value:[new Yt({value:"1.2.840.113549.1.5.12"}),h]}),new Ie(
{value:[new Yt({value:"2.16.840.1.101.3.4.1.42"}),new Qt({valueHex:c})]})]})]}),k=new Ie({value:[d,new Qt({valueHex:u})]}).
toBER(),C=new Uint8Array(k,0,k.byteLength);return["-----BEGIN ENCRYPTED PRIVATE KEY-----",...T(C,"base64pad").split(/(.{64})/).
filter(Boolean),"-----END ENCRYPTED PRIVATE KEY-----"].join(`
`)}async function Ah(r,e){try{const t=await B6(r,e);return b8(t)}catch{}if(!r.includes("BEGIN"))throw new B("Encrypted k\
ey was not a libp2p-key or a PEM file");return L6(r,e)}async function B6(r,e){const t=bo.decode(r);return Kg().decrypt(t,
e)}async function L6(r,e){const t=Ve.get();let n;if(r.includes("-----BEGIN ENCRYPTED PRIVATE KEY-----")){const i=P(r.replace(
"-----BEGIN ENCRYPTED PRIVATE KEY-----","").replace("-----END ENCRYPTED PRIVATE KEY-----","").replace(/\n/g,"").trim(),"\
base64pad"),{result:o}=pa(i),{iv:a,salt:c,iterations:l,keySize:u,cipherText:h}=D6(o),d=await zf(Rc,e,c,{c:l,dkLen:u}),b=await t.
subtle.importKey("raw",F(d),"AES-CBC",!1,["decrypt"]),k=Dn(await t.subtle.decrypt({name:"AES-CBC",iv:F(a)},b,F(h))),{result:C}=pa(
k);n=xh(C)}else if(r.includes("-----BEGIN PRIVATE KEY-----")){const i=P(r.replace("-----BEGIN PRIVATE KEY-----","").replace(
"-----END PRIVATE KEY-----","").replace(/\n/g,"").trim(),"base64pad"),{result:o}=pa(i);n=xh(o)}else throw new B("Could n\
ot parse private key from PEM data");const s=y8(n);if(s.type!=="RSA")throw new B("Could not parse RSA private key from P\
EM data");return s}function D6(r){const e=r.valueBlock.value[0];if(e.valueBlock.value[0].toString()!=="OBJECT IDENTIFIER\
 : 1.2.840.113549.1.5.13")throw new B("Only pkcs5PBES2 encrypted private keys are supported");const n=e.valueBlock.value[1].
valueBlock.value[0];if(n.valueBlock.value[0].toString()!=="OBJECT IDENTIFIER : 1.2.840.113549.1.5.12")throw new B("Only \
pkcs5PBKDF2 key derivation functions are supported");const i=n.valueBlock.value[1],o=Dn(i.valueBlock.value[0].getValue());
let a=pc,c=yc;if(i.valueBlock.value.length===3)a=Number(i.valueBlock.value[1].toBigInt()),c=Number(i.valueBlock.value[2].
toBigInt());else if(i.valueBlock.value.length===2)throw new B("Could not derive key size and iterations from PEM file - \
please use @libp2p/rsa to re-import your key");const l=e.valueBlock.value[1].valueBlock.value[1],u=l.valueBlock.value[0].
toString();if(u!=="OBJECT IDENTIFIER : 1.2.840.113549.3.7"){if(u!=="OBJECT IDENTIFIER : 1.3.14.3.2.7"){if(u!=="OBJECT ID\
ENTIFIER : 2.16.840.1.101.3.4.1.2"){if(u!=="OBJECT IDENTIFIER : 2.16.840.1.101.3.4.1.22"){if(u!=="OBJECT IDENTIFIER : 2.\
16.840.1.101.3.4.1.42")throw new B("Only AES-CBC encryption schemes are supported")}}}}const h=Dn(l.valueBlock.value[1].
getValue());return{cipherText:Dn(r.valueBlock.value[1].getValue()),salt:o,iterations:a,keySize:c,iv:h}}function xh(r){return Dn(
r.valueBlock.value[2].getValue())}function Dn(r){return new Uint8Array(r,0,r.byteLength)}const N6="/pkcs8/",wc="/info/",
ln=new WeakMap,Kt={minKeyLength:112/8,minSaltLength:128/8,minIterationCount:1e3};function wr(r){return r==null||typeof r!=
"string"?!1:r===Vg(r.trim())&&r.length>0}async function G(){const t=Math.random()*800+200;await new Promise(n=>setTimeout(
n,t))}function zt(r){return new rt(N6+r)}function mr(r){return new rt(wc+r)}async function U6(r){const e=fs(r),t=await yl.
digest(e);return Se.encode(t.bytes).substring(1)}let _6=class{components;init;log;self;constructor(e,t){if(this.components=
e,this.log=e.logger.forComponent("libp2p:keychain"),this.init={...t,dek:{...ph,...t.dek}},this.self=t.selfKey??"self",this.
init.pass!=null&&this.init.pass?.length<20)throw new Error("pass must be least 20 characters");if(this.init.dek?.keyLength!=
null&&this.init.dek.keyLength<Kt.minKeyLength)throw new Error(`dek.keyLength must be least ${Kt.minKeyLength} bytes`);if(this.
init.dek?.salt?.length!=null&&this.init.dek.salt.length<Kt.minSaltLength)throw new Error(`dek.saltLength must be least ${Kt.
minSaltLength} bytes`);if(this.init.dek?.iterationCount!=null&&this.init.dek.iterationCount<Kt.minIterationCount)throw new Error(
`dek.iterationCount must be least ${Kt.minIterationCount}`);const n=this.init.pass!=null&&this.init.dek?.salt!=null?fh(this.
init.pass,this.init.dek?.salt,this.init.dek?.iterationCount,this.init.dek?.keyLength,this.init.dek?.hash):"";ln.set(this,
{dek:n})}[Symbol.toStringTag]="@libp2p/keychain";[Of]=["@libp2p/keychain"];static generateOptions(){const e=Object.assign(
{},this.options),t=Math.ceil(Kt.minSaltLength/3)*3;return e.dek!=null&&(e.dek.salt=T(crypto.getRandomValues(new Uint8Array(
t)),"base64")),e}static get options(){return{dek:{...ph}}}async findKeyByName(e){if(!wr(e))throw await G(),new B(`Invali\
d key name '${e}'`);const t=mr(e);try{const n=await this.components.datastore.get(t);return JSON.parse(T(n))}catch(n){throw await G(),
this.log.error("could not read key from datastore - %e",n),new Df(`Key '${e}' does not exist.`)}}async findKeyById(e){try{
const t={prefix:wc};for await(const n of this.components.datastore.query(t)){const s=JSON.parse(T(n.value));if(s.id===e)
return s}throw new B(`Key with id '${e}' does not exist.`)}catch(t){throw await G(),t}}async importKey(e,t){if(!wr(e))throw await G(),
new B(`Invalid key name '${e}'`);if(t==null)throw await G(),new B("Key is required");const n=zt(e);if(await this.components.
datastore.has(n))throw await G(),new B(`Key '${e}' already exists`);let i,o;try{i=await U6(t);const l=ln.get(this);if(l==
null)throw new B("dek missing");const u=l.dek;o=await Eh(t,u,t.type==="RSA"?"pkcs-8":"libp2p-key")}catch(l){throw await G(),
l}const a={name:e,id:i},c=this.components.datastore.batch();return c.put(n,P(o)),c.put(mr(e),P(JSON.stringify(a))),await c.
commit(),a}async exportKey(e){if(!wr(e))throw await G(),new B(`Invalid key name '${e}'`);const t=zt(e);try{const n=await this.
components.datastore.get(t),s=T(n),i=ln.get(this);if(i==null)throw new B("dek missing");const o=i.dek;return await Ah(s,
o)}catch(n){throw await G(),n}}async removeKey(e){if(!wr(e)||e===this.self)throw await G(),new B(`Invalid key name '${e}\
'`);const t=zt(e),n=await this.findKeyByName(e),s=this.components.datastore.batch();return s.delete(t),s.delete(mr(e)),await s.
commit(),n}async listKeys(){const e={prefix:wc},t=[];for await(const n of this.components.datastore.query(e))t.push(JSON.
parse(T(n.value)));return t}async renameKey(e,t){if(!wr(e)||e===this.self)throw await G(),new B(`Invalid old key name '${e}\
'`);if(!wr(t)||t===this.self)throw await G(),new B(`Invalid new key name '${t}'`);const n=zt(e),s=zt(t),i=mr(e),o=mr(t);
if(await this.components.datastore.has(s))throw await G(),new B(`Key '${t}' already exists`);try{const c=await this.components.
datastore.get(n),l=await this.components.datastore.get(i),u=JSON.parse(T(l));u.name=t;const h=this.components.datastore.
batch();return h.put(s,c),h.put(o,P(JSON.stringify(u))),h.delete(n),h.delete(i),await h.commit(),u}catch(c){throw await G(),
c}}async rotateKeychainPass(e,t){if(typeof e!="string")throw await G(),new B(`Invalid old pass type '${typeof e}'`);if(typeof t!=
"string")throw await G(),new B(`Invalid new pass type '${typeof t}'`);if(t.length<20)throw await G(),new B(`Invalid pass\
 length ${t.length}`);this.log("recreating keychain");const n=ln.get(this);if(n==null)throw new B("dek missing");const s=n.
dek;this.init.pass=t;const i=t!=null&&this.init.dek?.salt!=null?fh(t,this.init.dek.salt,this.init.dek?.iterationCount,this.
init.dek?.keyLength,this.init.dek?.hash):"";ln.set(this,{dek:i});const o=await this.listKeys();for(const a of o){const c=await this.
components.datastore.get(zt(a.name)),l=T(c),u=await Ah(l,s),h=i.toString(),d=await Eh(u,h,u.type==="RSA"?"pkcs-8":"libp2\
p-key"),b=this.components.datastore.batch(),k={name:a.name,id:a.id};b.put(zt(a.name),P(d)),b.put(mr(a.name),P(JSON.stringify(
k))),await b.commit()}this.log("keychain reconstructed")}};function P6(r={}){return e=>new _6(e,r)}async function cy(r,e={}){
const t=e.selfKey??"self",n=P6(e)({datastore:r,logger:Pp()});let s;return await r.has(new rt(`/pkcs8/${t}`))?s=await n.exportKey(
t):(s=await gS(e.keyType??"Ed25519"),await n.importKey(t,s)),s}function T6(r){return r[Symbol.asyncIterator]!=null}function Sh(r){
return r?.then!=null}function kh(r,e){let t=0;if(T6(r))return(async function*(){for await(const c of r){const l=e(c,t++);
Sh(l)&&await l,yield c}})();const n=Nf(r),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o?.
then=="function")return(async function*(){await o,yield s;for(const c of n){const l=e(c,t++);Sh(l)&&await l,yield c}})();
const a=e;return(function*(){yield s;for(const c of n)a(c,t++),yield c})()}function M6(r){return r.buffer instanceof ArrayBuffer}
function O6(r){return M6(r)?r:r.slice()}function $h(r){return{...r,id:r.id.toCID(),router:"libp2p-router"}}function R6(r){
return{...r,id:r.id.toCID(),router:"libp2p-router",fallback:!1}}class F6{name="libp2p-router";libp2p;constructor(e){this.
libp2p=e}async provide(e,t){await this.libp2p.contentRouting.provide(e,t)}async cancelReprovide(e,t){await this.libp2p.contentRouting.
cancelReprovide(e,t)}async*findProviders(e,t){yield*Pa(this.libp2p.contentRouting.findProviders(e,t),n=>({...R6(n)}))}async put(e,t,n){
await this.libp2p.contentRouting.put(e,t,n)}async get(e,t){return O6(await this.libp2p.contentRouting.get(e,t))}async findPeer(e,t){
return $h(await this.libp2p.peerRouting.findPeer(Qi(e),t))}async*getClosestPeers(e,t){yield*Pa(this.libp2p.peerRouting.getClosestPeers(
e,t),$h)}toString(){return"Libp2pRouter()"}}function V6(r){return new F6(r)}function K6(r,e){let t;Object.defineProperty(
r,"libp2p",{configurable:!0,enumerable:!0,get(){if(t!=null)return t;throw new Lf}});const n={name:"libp2p",start:async s=>{
if(t==null){e.privateKey==null&&(e.privateKey=await cy(s.datastore,e.keychain)),e.nodeInfo??={},e.nodeInfo.name??=s.info.
name,e.nodeInfo.version??=s.info.version,e.nodeInfo.userAgent??=`${s.info.name}/${s.info.version} ${Tp()}`,e.datastore??=
s.datastore,t=await Mp(e);const i=s.routing.findProviders.bind(s.routing);s.routing.findProviders=async function*(c,l){yield*kh(
i.call(s.routing,c,l),async u=>{if(u.router!=="libp2p-router"){const h=wa(u);await t.peerStore.merge(h.id,h)}})};const o=s.
routing.findPeer.bind(s.routing);s.routing.findPeer=async function(c,l){const u=await o(c,l);if(u.router!=="libp2p-route\
r"){const h=wa(u);await t.peerStore.merge(h.id,h)}return u};const a=s.routing.getClosestPeers.bind(s.routing);s.routing.
getClosestPeers=async function*(c,l){yield*kh(a.call(s.routing,c,l),async u=>{if(u.router!=="libp2p-router"){const h=wa(
u);await t.peerStore.merge(h.id,h)}})}}try{s.hasRouter("libp2p-router")||s.addRouter(V6(t)),Op(s.libp2p)&&await s.libp2p.
start()}catch(i){if(i.name!=="NotStartedError")throw i}},stop:async()=>{await t?.stop()}};return r.addMixin(n),r}function wa(r){
return{id:Qi(r.id),multiaddrs:r.multiaddrs}}new TextEncoder;new TextDecoder;function z6(r,e){if(r===e)return!0;if(r.byteLength!==
e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Ft(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return Wn(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return Wn(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function H6(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const Ch=4096;function j6(r){const e=r.
length;if(e<=Ch)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=Ch));return t}function G6(r){return r?.buffer instanceof ArrayBuffer}function Wn(r){return G6(r)?r:r.slice()}
var W6=ly,Ih=128,q6=-128,J6=Math.pow(2,31);function ly(r,e,t){e=e||[],t=t||0;for(var n=t;r>=J6;)e[t++]=r&255|Ih,r/=128;for(;r&
q6;)e[t++]=r&255|Ih,r>>>=7;return e[t]=r|0,ly.bytes=t-n+1,e}var X6=mc,Y6=128,Bh=127;function mc(r,n){var t=0,n=n||0,s=0,
i=n,o,a=r.length;do{if(i>=a)throw mc.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&Bh)<<s:(o&Bh)*
Math.pow(2,s),s+=7}while(o>=Y6);return mc.bytes=i-n,t}var Q6=Math.pow(2,7),Z6=Math.pow(2,14),eC=Math.pow(2,21),tC=Math.pow(
2,28),rC=Math.pow(2,35),nC=Math.pow(2,42),sC=Math.pow(2,49),iC=Math.pow(2,56),oC=Math.pow(2,63),aC=function(r){return r<
Q6?1:r<Z6?2:r<eC?3:r<tC?4:r<rC?5:r<nC?6:r<sC?7:r<iC?8:r<oC?9:10},cC={encode:W6,decode:X6,encodingLength:aC},Di=cC;function vc(r,e=0){
const t=Di.decode(r,e),n=Di.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError(
"Invalid varint: not minimally encoded");return[t,n]}function Ni(r,e,t=0){return Di.encode(r,e,t),e}function Ui(r){return Di.
encodingLength(r)}function Dl(r,e){const t=e.byteLength,n=Ui(r),s=n+Ui(t),i=new Uint8Array(s+t);return Ni(r,i,0),Ni(t,i,
n),i.set(e,s),new Nl(r,t,e,i)}function lC(r){const e=Ft(r),[t,n]=vc(e),[s,i]=vc(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==
s)throw new Error("Incorrect length");return new Nl(t,s,o,e)}function uC(r,e){if(r===e)return!0;{const t=e;return r.code===
t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&z6(r.bytes,t.bytes)}}let Nl=class{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=Wn(n),this.bytes=Wn(s)}};const hC=20;function fC({name:r,code:e,encode:t,minDigestLength:n,
maxDigestLength:s}){return new dC(r,e,t,n,s)}let dC=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??hC,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Lh(n,this.code,t?.truncate):n.then(s=>Lh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Lh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Dl(e,r)}function gC(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const Dh=fC({name:"sha2-256",code:18,encode:gC("SHA-256")});function Ec(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return _i(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return _i(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function bC(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const Nh=4096;function yC(r){const e=r.
length;if(e<=Nh)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=Nh));return t}function pC(r){return r?.buffer instanceof ArrayBuffer}function _i(r){return pC(r)?r:r.slice()}
function wC(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===
0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=
256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;
for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.
length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&
S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){
for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var mC=wC,vC=mC;let EC=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},AC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return uy(this,e)}},
xC=class{decoders;constructor(e){this.decoders=e}or(e){return uy(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function uy(r,e){return new xC({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let SC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new EC(e,t,n),this.decoder=new AC(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function xo({name:r,prefix:e,encode:t,decode:n}){return new SC(r,e,t,
n)}function gs({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=vC(t,r,n);return xo({prefix:e,
name:r,encode:s,decode:o=>Ec(i(o))})}function kC(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function $C(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function CC(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Q({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=CC(n,s);return xo(
{prefix:e,name:r,encode(o){return $C(o,n,t)},decode(o){return kC(o,i,t,r)}})}const hy=gs({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),IC=gs({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),BC=Object.freeze(Object.defineProperty({__proto__:null,base58btc:hy,
base58flickr:IC},Symbol.toStringTag,{value:"Module"})),Pi=Q({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWX\
YZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),LC=Q({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQR\
STUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),DC=Q({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJK\
LMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),NC=Q({prefix:"U",name:"base64urlpad",alphabet:"AB\
CDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),UC=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Pi,base64pad:LC,base64url:DC,base64urlpad:NC},Symbol.toStringTag,{value:"Module"}));var _C=fy,Uh=128,
PC=-128,TC=Math.pow(2,31);function fy(r,e,t){e=e||[],t=t||0;for(var n=t;r>=TC;)e[t++]=r&255|Uh,r/=128;for(;r&PC;)e[t++]=
r&255|Uh,r>>>=7;return e[t]=r|0,fy.bytes=t-n+1,e}var MC=Ac,OC=128,_h=127;function Ac(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;
do{if(i>=a)throw Ac.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&_h)<<s:(o&_h)*Math.pow(2,s),s+=
7}while(o>=OC);return Ac.bytes=i-n,t}var RC=Math.pow(2,7),FC=Math.pow(2,14),VC=Math.pow(2,21),KC=Math.pow(2,28),zC=Math.
pow(2,35),HC=Math.pow(2,42),jC=Math.pow(2,49),GC=Math.pow(2,56),WC=Math.pow(2,63),qC=function(r){return r<RC?1:r<FC?2:r<
VC?3:r<KC?4:r<zC?5:r<HC?6:r<jC?7:r<GC?8:r<WC?9:10},JC={encode:_C,decode:MC,encodingLength:qC},dy=JC;function Ph(r,e,t=0){
return dy.encode(r,e,t),e}function Th(r){return dy.encodingLength(r)}function XC(r,e){const t=e.byteLength,n=Th(r),s=n+Th(
t),i=new Uint8Array(s+t);return Ph(r,i,0),Ph(t,i,n),i.set(e,s),new YC(r,t,e,i)}let YC=class{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=_i(n),this.bytes=_i(s)}};const QC=20;function ZC({name:r,code:e,encode:t,minDigestLength:n,
maxDigestLength:s}){return new eI(r,e,t,n,s)}let eI=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??QC,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Mh(n,this.code,t?.truncate):n.then(s=>Mh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Mh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return XC(e,r)}function tI(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const rI=ZC({name:"sha2-256",code:18,encode:tI("SHA-256")});function gy(r=0){return new Uint8Array(r)}
function nI(r){return r?.buffer instanceof ArrayBuffer}function sI(r){if(nI(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function iI(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=gy(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return sI(t)}const oI=gs({prefix:"9",name:"base10",alphabet:"0123456789"}),aI=Object.freeze(Object.
defineProperty({__proto__:null,base10:oI},Symbol.toStringTag,{value:"Module"})),cI=Q({prefix:"f",name:"base16",alphabet:"\
0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),lI=Q({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,
caseInsensitive:!0}),uI=Object.freeze(Object.defineProperty({__proto__:null,base16:cI,base16upper:lI},Symbol.toStringTag,
{value:"Module"})),hI=Q({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),fI=Object.freeze(Object.defineProperty({__proto__:null,
base2:hI},Symbol.toStringTag,{value:"Module"})),by=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭\
😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩\
😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆\
🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊\
🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
dI=by.reduce((r,e,t)=>(r[t]=e,r),[]),gI=by.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return r[n]=t,r},[]);function bI(r){return r.reduce((e,t)=>(e+=dI[t],e),"")}function yI(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=gI[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const pI=xo({prefix:"🚀",name:"\
base256emoji",encode:bI,decode:yI}),wI=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:pI},Symbol.toStringTag,
{value:"Module"})),mI=Q({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
vI=Q({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),EI=Q(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),AI=Q({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),xI=Q({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),SI=Q({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),kI=Q({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),$I=Q({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),CI=Q({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),II=Object.freeze(Object.defineProperty({__proto__:null,
base32:mI,base32hex:xI,base32hexpad:kI,base32hexpadupper:$I,base32hexupper:SI,base32pad:EI,base32padupper:AI,base32upper:vI,
base32z:CI},Symbol.toStringTag,{value:"Module"})),BI=gs({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),LI=gs({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
DI=Object.freeze(Object.defineProperty({__proto__:null,base36:BI,base36upper:LI},Symbol.toStringTag,{value:"Module"})),NI=Q(
{prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),UI=Object.freeze(Object.defineProperty({__proto__:null,base8:NI},
Symbol.toStringTag,{value:"Module"})),_I=xo({prefix:"\0",name:"identity",encode:r=>yC(Ec(r)),decode:r=>Ec(bC(r))}),PI=Object.
freeze(Object.defineProperty({__proto__:null,identity:_I},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Oh={...PI,...fI,...UI,...aI,...uI,...II,...DI,...BC,...UC,...wI};function yy(r,e,t,n){return{name:r,prefix:e,encoder:{
name:r,prefix:e,encode:t},decoder:{decode:n}}}const Rh=yy("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().
encode(r.substring(1))),ma=yy("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},
r=>{r=r.substring(1);const e=gy(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),py={utf8:Rh,"utf-8":Rh,
hex:Oh.base16,latin1:ma,ascii:ma,binary:ma,...Oh};function Nr(r,e="utf8"){const t=py[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function va(r,e="utf8"){const t=py[e];if(t==null)throw new Error(
`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}function TI(r){return r.buffer instanceof ArrayBuffer}
function si(r){return TI(r)?r:r.slice()}class Pe extends Error{static name="InvalidParametersError";name="InvalidParamet\
ersError"}class Fh extends Error{static name="DecryptionFailedError";name="DecryptionFailedError"}async function MI(r,e,t){
r=r.replaceAll("-----BEGIN ENCRYPTED PRIVATE KEY-----",""),r=r.replaceAll("-----END ENCRYPTED PRIVATE KEY-----",""),r=r.
replaceAll("\r",""),r=r.replaceAll(`
`,"");const n=Pi.decode(`m${r}`),s=Rt(n),i=s[0][1][0][1][0],o=Vh(s[0][1][0][1][1]),a=Vh(s[0][1][0][1][2]),c=s[0][1][0][1][4][1],
l=s[0][1][0][1][4][2],u=await e.decrypt(i,c,l,{iterations:o,keyLength:a*8,hash:"SHA-512",algorithm:"AES-CBC",signal:t?.signal}),
d=Rt(u)[2],b=st.encode({Type:0,Data:d});return gd().privateKeyFromProtobuf(b)}function Vh(r){if(r.length===0)return 0;const e=[
...r].map(t=>t.toString(16).padStart(2,"0")).join("");return parseInt(e,16)}const OI="/pkcs8/",wy="/info/",RI=Symbol.for(
"@libp2p/service-capabilities"),un={iterations:1e4,salt:Nr("you should override this value with a crypto secure random n\
umber"),hash:"SHA-512",algorithm:"AES-GCM"},vr={iterations:32767,saltLength:16,ivLength:12,hash:"SHA-256",keyLength:128,
algorithm:"AES-GCM"},Ea=20,Ms={minSaltLength:128/8,minIterations:1e3},Kh={"SHA-256":128,"SHA-384":192,"SHA-512":256};function hn(r){
return r==null||typeof r!="string"?!1:r===Vg(r.trim())&&r.length>0}function Er(r){return new rt(OI+r)}function Os(r){return new rt(
wy+r)}async function FI(r,e){const t=r.toProtobuf(),n=await rI.digest(t);return e?.signal?.throwIfAborted(),hy.encode(n.
bytes).substring(1)}function VI(r){if(typeof r=="string")return Nr(r);if(r instanceof Uint8Array)return si(r)}class KI{components;self;cipher;salt;keychainDekOptions;privateKeyDekOptions;constructor(e,t={}){
if(this.components=e,this.self=t.selfKey??"self",this.salt=VI(t.salt)??un.salt,this.keychainDekOptions={iterations:t.iterations??
un.iterations,hash:t.hash??un.hash,keyLength:Kh[t.hash??un.hash],algorithm:un.algorithm},this.privateKeyDekOptions={iterations:vr.
iterations,hash:vr.hash,saltLength:vr.saltLength,ivLength:vr.ivLength,keyLength:vr.keyLength,algorithm:vr.algorithm},t.password!=
null&&t.password.length<Ea)throw new Error("password must be least 20 characters");if(this.salt.byteLength!=null&&this.salt.
byteLength<Ms.minSaltLength)throw new Error(`salt must be least ${Ms.minSaltLength} bytes`);if(t.iterations!=null&&t.iterations<
Ms.minIterations)throw new Error(`iterations must be least ${Ms.minIterations}`);if(Kh[this.keychainDekOptions.hash]==null)
throw new Pe("Unsupported hash");this.cipher=zh(t.password??"",this.salt,this.keychainDekOptions,this.privateKeyDekOptions)}[RI]=[
"@ipshipyard/keychain"];async generateKey(e,t){const s=await(await this.components.getCrypto(t?.type??"Ed25519",t)).generatePrivateKey(
t);return this.importKey(e,s,t)}async importKey(e,t,n){if(!hn(e))throw new Pe(`Invalid key name '${e}'`);if(t==null)throw new Pe(
"Key is required");if(await this.components.datastore.has(Er(e),n))throw new Pe(`Key '${e}' already exists`);const i=this.
components.datastore.batch();return await this._importKey(e,t,this.cipher,i,n),await i.commit(n),t}async _importKey(e,t,n,s,i){
const o=t.toProtobuf(),a=await n.encrypt(o),c=iI([a.salt,a.iv,a.cipherText],a.salt.byteLength+a.iv.byteLength+a.cipherText.
byteLength),l=Pi.encode(c),u={name:e,id:await FI(t,i)};s.put(Er(e),Nr(l)),s.put(Os(e),Nr(JSON.stringify(u)))}async exportKey(e,t){
if(!hn(e))throw new Pe(`Invalid key name '${e}'`);return this._exportKey(e,this.cipher,t)}async _exportKey(e,t,n){const s=await this.
components.datastore.get(Er(e),n),i=va(s);let o;if(i.includes("BEGIN ENCRYPTED PRIVATE KEY"))return MI(i,t,n);try{const a=Pi.
decode(i),c=a.subarray(0,16),l=a.subarray(16,28),u=a.subarray(28),h=await t.decrypt(c,l,u,n),d=st.decode(h);if(d.Type==null)
throw new Fh("Unknown key type");return o=await this.components.getCrypto(d.Type,n),await o.privateKeyFromProtobuf(h)}catch(a){
throw a.name==="OperationError"?new Fh(a.message):a}}async removeKey(e,t){if(!hn(e)||e===this.self)throw new Pe(`Invalid\
 key name '${e}'`);const n=this.components.datastore.batch();n.delete(Er(e)),n.delete(Os(e)),await n.commit(t)}async*listKeys(e){
const t={prefix:wy};for await(const n of this.components.datastore.query(t,e))yield JSON.parse(va(n.value))}async renameKey(e,t,n){
if(!hn(e)||e===this.self)throw new Pe(`Invalid old key name '${e}'`);if(!hn(t)||t===this.self)throw new Pe(`Invalid new \
key name '${t}'`);const s=Er(e),i=Er(t),o=Os(e),a=Os(t);if(await this.components.datastore.has(i,n))throw new Pe(`Key '${t}\
' already exists`);const l=await this.components.datastore.get(s,n),u=await this.components.datastore.get(o,n),h=JSON.parse(
va(u));h.name=t;const d=this.components.datastore.batch();d.put(i,l),d.put(a,Nr(JSON.stringify(h))),d.delete(s),d.delete(
o),await d.commit(n)}async rotateKeychainPass(e,t){if(typeof e!="string")throw new Pe(`Invalid new pass type '${typeof e}\
'`);if(e.length<Ea)throw new Pe(`Invalid pass length ${e.length}, must be at least ${Ea}`);const n=this.cipher,s=this.cipher=
zh(e,this.salt,this.keychainDekOptions,this.privateKeyDekOptions),i=this.components.datastore.batch();for await(const o of this.
listKeys(t)){const a=await this._exportKey(o.name,n);await this._importKey(o.name,a,s,i,t)}await i.commit(t)}async loadPublicKeyFromProtobuf(e,t){
const n=nt.decode(e);if(n.Type==null)throw new Pe("Protobuf was missing Type");return(await this.components.getCrypto(n.
Type,t)).publicKeyFromProtobuf(e,t)}}const zI={alg:"A128GCM",ext:!0,k:"scm9jmO_4BJAgdwWGVulLg",key_ops:["encrypt","decry\
pt"],kty:"oct"};function zh(r,e,t,n){let s;async function i(l,u,h,d){let b;const k=Nr(l),C=await crypto.subtle.importKey(
"raw",k,{name:"PBKDF2"},!1,["deriveKey"]);try{b=await crypto.subtle.deriveKey({name:"PBKDF2",salt:si(u),iterations:d.iterations,
hash:{name:d.hash}},C,{name:d.algorithm??"AES-GCM",length:d.keyLength},!0,h)}catch($){if(l==="")b=await crypto.subtle.importKey(
"jwk",zI,{name:d.algorithm??"AES-GCM"},!0,h);else throw $}return b}async function o(){if(r==="")return r;const l=await i(
r,e,["encrypt","decrypt"],t);return(await crypto.subtle.exportKey("jwk",l)).k??""}async function a(l,u){s==null&&(s=await o());
const h=crypto.getRandomValues(new Uint8Array(n.saltLength)),d=crypto.getRandomValues(new Uint8Array(n.ivLength)),b=await i(
s,h,["encrypt"],n),k=await crypto.subtle.encrypt({name:"AES-GCM",iv:d},b,l);return u?.signal?.throwIfAborted(),{salt:h,iv:d,
cipherText:new Uint8Array(k)}}async function c(l,u,h,d){s==null&&(s=await o());const b=await i(s,l,["decrypt"],{iterations:d?.
iterations??n.iterations,keyLength:d?.keyLength??n.keyLength,hash:d?.hash??n.hash,algorithm:d?.algorithm??"AES-GCM"}),k=await crypto.
subtle.decrypt({name:d?.algorithm??"AES-GCM",iv:si(u)},b,si(h));return d?.signal?.throwIfAborted(),new Uint8Array(k)}return{
encrypt:a,decrypt:c}}function HI(r){return e=>new KI(e,r)}class jI extends AggregateError{static name="DNSQueryFailedErr\
or";name="DNSQueryFailedError"}class GI extends AggregateError{static name="EmptyDNSAnswerError";name="EmptyDNSAnswerErr\
or"}function my(r){const e=[fr.A];return r==null?e:Array.isArray(r)?r.length===0?e:r:[r]}function WI(r,e,t){if(r.length>=
255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){
var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().
charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/
Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(
f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===0;)p++,g++;for(var E=(m-p)*
b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>0,y[w]=v%u>>>0,v=
v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;for(var D=h.repeat(g);x<E;++x)
D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.
charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;
if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(
A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(f);if(g)return g;throw new Error(`Non-${e} character`)}
return{encode:k,decodeUnsafe:C,decode:$}}var qI=WI,JI=qI;let XI=class{name;prefix;baseEncode;constructor(e,t,n){this.name=
e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},YI=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return vy(this,e)}},
QI=class{decoders;constructor(e){this.decoders=e}or(e){return vy(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function vy(r,e){return new QI({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let ZI=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new XI(e,t,n),this.decoder=new YI(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function So({name:r,prefix:e,encode:t,decode:n}){return new ZI(r,e,t,
n)}function bs({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=JI(t,r,n);return So({prefix:e,
name:r,encode:s,decode:o=>Ft(i(o))})}function e3(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function t3(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function r3(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Z({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=r3(n,s);return So(
{prefix:e,name:r,encode(o){return t3(o,n,t)},decode(o){return e3(o,i,t,r)}})}const n3=bs({prefix:"9",name:"base10",alphabet:"\
0123456789"}),s3=Object.freeze(Object.defineProperty({__proto__:null,base10:n3},Symbol.toStringTag,{value:"Module"})),i3=Z(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),o3=Z({prefix:"F",name:"base16up\
per",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),a3=Object.freeze(Object.defineProperty({__proto__:null,
base16:i3,base16upper:o3},Symbol.toStringTag,{value:"Module"})),c3=Z({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
l3=Object.freeze(Object.defineProperty({__proto__:null,base2:c3},Symbol.toStringTag,{value:"Module"})),Ey=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),u3=Ey.reduce((r,e,t)=>(r[t]=e,r),[]),h3=Ey.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function f3(r){return r.reduce((e,t)=>(e+=u3[t],e),"")}function d3(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=h3[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const g3=So({prefix:"🚀",name:"\
base256emoji",encode:f3,decode:d3}),b3=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:g3},Symbol.toStringTag,
{value:"Module"})),Nn=Z({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
y3=Z({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),p3=Z(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),w3=Z({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),m3=Z({prefix:"v",
name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),v3=Z({prefix:"V",name:"b\
ase32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),E3=Z({prefix:"t",name:"bas\
e32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),A3=Z({prefix:"T",name:"base32\
hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),x3=Z({prefix:"h",name:"base\
32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),S3=Object.freeze(Object.defineProperty({__proto__:null,
base32:Nn,base32hex:m3,base32hexpad:E3,base32hexpadupper:A3,base32hexupper:v3,base32pad:p3,base32padupper:w3,base32upper:y3,
base32z:x3},Symbol.toStringTag,{value:"Module"})),sr=bs({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),k3=bs({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
$3=Object.freeze(Object.defineProperty({__proto__:null,base36:sr,base36upper:k3},Symbol.toStringTag,{value:"Module"})),dt=bs(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),C3=bs({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),I3=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:dt,base58flickr:C3},Symbol.toStringTag,{value:"Module"})),B3=Z({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),L3=Z({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),D3=Z({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),N3=Z({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),U3=Object.freeze(Object.defineProperty(
{__proto__:null,base64:B3,base64pad:L3,base64url:D3,base64urlpad:N3},Symbol.toStringTag,{value:"Module"})),_3=Z({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),P3=Object.freeze(Object.defineProperty({__proto__:null,base8:_3},Symbol.
toStringTag,{value:"Module"})),T3=So({prefix:"\0",name:"identity",encode:r=>j6(Ft(r)),decode:r=>Ft(H6(r))}),M3=Object.freeze(
Object.defineProperty({__proto__:null,identity:T3},Symbol.toStringTag,{value:"Module"})),O3="raw",Ay=85;function R3(r){return Ft(
r)}function F3(r){return Ft(r)}const V3=Object.freeze(Object.defineProperty({__proto__:null,code:Ay,decode:F3,encode:R3,
name:O3},Symbol.toStringTag,{value:"Module"})),xy=0,K3="identity",Sy=Ft;function z3(r,e){if(e?.truncate!=null&&e.truncate!==
r.byteLength){if(e.truncate<0||e.truncate>r.byteLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${r.byteLength}`);r=r.subarray(0,e.truncate)}return Dl(xy,Sy(r))}const Hh={code:xy,name:K3,encode:Sy,digest:z3};function jh(r,e){
const{bytes:t,version:n}=r;switch(n){case 0:return G3(t,xc(r),e??dt.encoder);default:return W3(t,xc(r),e??Nn.encoder)}}const Gh=new WeakMap;
function xc(r){const e=Gh.get(r);if(e==null){const t=new Map;return Gh.set(r,t),t}return e}let H3=class oe{code;version;multihash;bytes;"\
/";constructor(e,t,n,s){this.code=t,this.version=e,this.multihash=n,this.bytes=Wn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==fn)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==q3)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return oe.createV0(t)}default:throw Error(`Can not convert CID ver\
sion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,n=Dl(e,t);return oe.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return oe.equals(this,e)}static equals(e,t){const n=t;return n!=
null&&e.code===n.code&&e.version===n.version&&uC(e.multihash,n.multihash)}toString(e){return jh(this,e)}toJSON(){return{
"/":jh(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof oe)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:n,code:s,multihash:i,bytes:o}=t;return new oe(n,s,i,o??Wh(n,s,i.bytes))}else if(t[J3]===!0){const{
version:n,multihash:s,code:i}=t,o=lC(s);return oe.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="numb\
er")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invali\
d digest");switch(e){case 0:{if(t!==fn)throw new Error(`Version 0 CID must use dag-pb (code: ${fn}) block encoding`);return new oe(
e,t,n,n.bytes)}case 1:{const s=Wh(e,t,n.bytes);return new oe(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){
return oe.create(0,fn,e)}static createV1(e,t){return oe.create(1,e,t)}static decode(e){const[t,n]=oe.decodeFirst(e);if(n.
length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=oe.inspectBytes(e),n=t.size-t.multihashSize,
s=Ft(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Nl(t.multihashCode,t.digestSize,i,s);return[t.version===0?oe.createV0(o):oe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=vc(e.subarray(t));return t+=d,h};let s=n(),
i=fn;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=j3(e,t),
i=oe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return xc(
i).set(n,e),i}};function j3(r,e){switch(r[0]){case"Q":{const t=e??dt;return[dt.prefix,t.decode(`${dt.prefix}${r}`)]}case dt.
prefix:{const t=e??dt;return[dt.prefix,t.decode(r)]}case Nn.prefix:{const t=e??Nn;return[Nn.prefix,t.decode(r)]}case sr.
prefix:{const t=e??sr;return[sr.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function G3(r,e,t){const{prefix:n}=t;if(n!==
dt.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function W3(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const fn=112,q3=18;function Wh(r,e,t){const n=Ui(r),s=n+Ui(e),i=new Uint8Array(s+t.
byteLength);return Ni(r,i,0),Ni(e,i,n),i.set(t,s),i}const J3=Symbol.for("@ipld/js-cid/CID"),qh={...M3,...l3,...P3,...s3,
...a3,...S3,...$3,...I3,...U3,...b3};function X3(r=0){return new Uint8Array(r)}function ky(r,e,t,n){return{name:r,prefix:e,
encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const Jh=ky("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().
encode(r.substring(1))),Aa=ky("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},
r=>{r=r.substring(1);const e=X3(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),$y={utf8:Jh,"utf-8":Jh,
hex:qh.base16,latin1:Aa,ascii:Aa,binary:Aa,...qh};function Ul(r,e="utf8"){const t=$y[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.encoder.encode(r).substring(1)}const Cy=60;function Iy(r){return{Status:r.Status??0,TC:r.
TC??r.flag_tc??!1,RD:r.RD??r.flag_rd??!1,RA:r.RA??r.flag_ra??!1,AD:r.AD??r.flag_ad??!1,CD:r.CD??r.flag_cd??!1,Question:(r.
Question??r.questions??[]).map(e=>({name:e.name,type:fr[e.type]})),Answer:(r.Answer??r.answers??[]).map(e=>({name:e.name,
type:fr[e.type],TTL:e.TTL??e.ttl??Cy,data:e.data instanceof Uint8Array?Ul(e.data):e.data}))}}const Y3=4;function Xh(r,e={}){
const t=new Rp({concurrency:e.queryConcurrency??Y3});return async(n,s={})=>{const i=s?.logger?.forComponent("dns:dns-jso\
n-over-https"),o=new URLSearchParams;o.set("name",n),my(s.types).forEach(c=>{o.append("type",fr[c])}),s.onProgress?.(new L(
"dns:query",n)),i?.("GET %s",`${r}?${o}`);const a=await t.add(async()=>{const c=await fetch(`${r}?${o}`,{headers:{accept:"\
application/dns-json"},signal:s?.signal});if(i?.("GET %s %d",c.url,c.status),c.status!==200)throw new Error(`Unexpected \
HTTP status: ${c.status} - ${c.statusText}`);const l=Iy(await c.json());return s.onProgress?.(new L("dns:response",l)),l},
{signal:s.signal});if(a==null)throw new Error("No DNS response received");return a}}function Q3(){return[Xh("https://clo\
udflare-dns.com/dns-query"),Xh("https://dns.google/resolve")]}class Z3{lru;constructor(e){this.lru=Fp(e)}get(e,t){let n=!0;
const s=[];for(const i of t){const o=this.getAnswers(e,i);if(o.length===0){n=!1;break}s.push(...o)}if(n)return Iy({answers:s})}getAnswers(e,t){
const n=`${e.toLowerCase()}-${t}`,s=this.lru.get(n);if(s!=null){const i=s.filter(o=>o.expires>Date.now()).map(({expires:o,
value:a})=>({...a,TTL:Math.round((o-Date.now())/1e3),type:fr[a.type]}));return i.length===0&&this.lru.remove(n),i}return[]}add(e,t){
const n=`${e.toLowerCase()}-${t.type}`,s=this.lru.get(n)??[];s.push({expires:Date.now()+(t.TTL??Cy)*1e3,value:t}),this.lru.
set(n,s)}remove(e,t){const n=`${e.toLowerCase()}-${t}`;this.lru.remove(n)}clear(){this.lru.clear()}}function eB(r){return new Z3(
r)}const tB=1e3,rB=()=>Math.random()>.5?-1:1;class nB{resolvers;cache;logger;sorter;constructor(e){this.resolvers={},this.
cache=eB(e.cacheSize??tB),this.logger=e.logger,this.sorter=e.sorter??rB,Object.entries(e.resolvers??{}).forEach(([t,n])=>{
Array.isArray(n)||(n=[n]),t.endsWith(".")||(t=`${t}.`),this.resolvers[t]=n}),this.resolvers["."]==null&&(this.resolvers["\
."]=Q3())}async query(e,t={}){const n=my(t.types),s=t.cached!==!1?this.cache.get(e,n):void 0;if(s!=null)return t.onProgress?.(
new L("dns:cache",s)),s;const i=`${e.split(".").pop()}.`,o=(this.resolvers[i]??this.resolvers["."]).sort(this.sorter),a=[];
for(const c of o){if(t.signal?.aborted===!0)break;try{const l=await c(e,{...t,logger:this.logger,types:n});if(l.Answer.length===
0)throw new GI("Query result had no answers");for(const u of l.Answer)this.cache.add(e,u);return l}catch(l){a.push(l),t.
onProgress?.(new L("dns:error",l))}}throw new jI(a,`DNS lookup of ${e} ${n} failed`)}}var fr;(function(r){r[r.A=1]="A",r[r.
CNAME=5]="CNAME",r[r.TXT=16]="TXT",r[r.AAAA=28]="AAAA"})(fr||(fr={}));function sB(r={}){return new nB(r)}function iB(r){
if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Yh(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return Yh(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function oB(r){return r?.buffer instanceof ArrayBuffer}function Yh(r){return oB(r)?r:r.slice()}function aB(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),
d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===0;)p++,
g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>
0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;for(var D=h.
repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.length-g)*d+
1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&S!==-1;S--,v++)
y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){for(var w=m-p;w!==
m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(f);if(g)return g;
throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var cB=aB,lB=cB;let uB=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},hB=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return By(this,e)}},
fB=class{decoders;constructor(e){this.decoders=e}or(e){return By(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function By(r,e){return new fB({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let dB=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new uB(e,t,n),this.decoder=new hB(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Ly({name:r,prefix:e,encode:t,decode:n}){return new dB(r,e,t,
n)}function ko({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=lB(t,r,n);return Ly({prefix:e,
name:r,encode:s,decode:o=>iB(i(o))})}function gB(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function bB(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function yB(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function _e({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=yB(n,s);return Ly(
{prefix:e,name:r,encode(o){return bB(o,n,t)},decode(o){return gB(o,i,t,r)}})}const pB=_e({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});_e({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});_e({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});_e({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const wB=ko(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});ko({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const mB=ko({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ko({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});const vB=_e({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});_e({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});_e({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMN\
OPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});_e({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});const Rr=1e3,Fr=Rr*60,Vr=Fr*60,dr=Vr*24,qn=dr*
7,Kr=dr*365.25,Jn=Kr/12;function Dy(r,e){if(typeof r=="string")return EB(r);if(typeof r=="number")return SB(r,e);throw new Error(
`Value provided to ms() must be a string or number. value=${JSON.stringify(r)}`)}function EB(r){if(typeof r!="string"||r.
length===0||r.length>100)throw new Error(`Value provided to ms.parse() must be a string with length between 1 and 99. va\
lue=${JSON.stringify(r)}`);const e=/^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.
exec(r);if(!e?.groups)return NaN;const{value:t,unit:n="ms"}=e.groups,s=parseFloat(t),i=n.toLowerCase();switch(i){case"ye\
ars":case"year":case"yrs":case"yr":case"y":return s*Kr;case"months":case"month":case"mo":return s*Jn;case"weeks":case"we\
ek":case"w":return s*qn;case"days":case"day":case"d":return s*dr;case"hours":case"hour":case"hrs":case"hr":case"h":return s*
Vr;case"minutes":case"minute":case"mins":case"min":case"m":return s*Fr;case"seconds":case"second":case"secs":case"sec":case"\
s":return s*Rr;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return s;default:throw new Error(`Un\
known unit "${i}" provided to ms.parse(). value=${JSON.stringify(r)}`)}}function AB(r){const e=Math.abs(r);return e>=Kr?
`${Math.round(r/Kr)}y`:e>=Jn?`${Math.round(r/Jn)}mo`:e>=qn?`${Math.round(r/qn)}w`:e>=dr?`${Math.round(r/dr)}d`:e>=Vr?`${Math.
round(r/Vr)}h`:e>=Fr?`${Math.round(r/Fr)}m`:e>=Rr?`${Math.round(r/Rr)}s`:`${r}ms`}function xB(r){const e=Math.abs(r);return e>=
Kr?Ht(r,e,Kr,"year"):e>=Jn?Ht(r,e,Jn,"month"):e>=qn?Ht(r,e,qn,"week"):e>=dr?Ht(r,e,dr,"day"):e>=Vr?Ht(r,e,Vr,"hour"):e>=
Fr?Ht(r,e,Fr,"minute"):e>=Rr?Ht(r,e,Rr,"second"):`${r} ms`}function SB(r,e){if(typeof r!="number"||!Number.isFinite(r))throw new Error(
"Value provided to ms.format() must be of type number.");return e?.long?xB(r):AB(r)}function Ht(r,e,t,n){const s=e>=t*1.5;
return`${Math.round(r/t)} ${n}${s?"s":""}`}function kB(r){t.debug=t,t.default=t,t.coerce=c,t.disable=i,t.enable=s,t.enabled=
o,t.humanize=Dy,t.destroy=l,Object.keys(r).forEach(u=>{t[u]=r[u]}),t.names=[],t.skips=[],t.formatters={};function e(u){let h=0;
for(let d=0;d<u.length;d++)h=(h<<5)-h+u.charCodeAt(d),h|=0;return t.colors[Math.abs(h)%t.colors.length]}t.selectColor=e;
function t(u,h){let d,b=null,k,C;function $(...f){if(!$.enabled)return;const g=$,A=Number(new Date),p=A-(d||A);g.diff=p,
g.prev=d,g.curr=A,d=A,f[0]=t.coerce(f[0]),typeof f[0]!="string"&&f.unshift("%O");let m=0;f[0]=f[0].replace(/%([a-zA-Z%])/g,
(y,v)=>{if(y==="%%")return"%";m++;const S=t.formatters[v];if(typeof S=="function"){const w=f[m];y=S.call(g,w),f.splice(m,
1),m--}return y}),t.formatArgs.call(g,f),h?.onLog!=null&&h.onLog(...f),(g.log||t.log).apply(g,f)}return $.namespace=u,$.
useColors=t.useColors(),$.color=t.selectColor(u),$.extend=n,$.destroy=t.destroy,Object.defineProperty($,"enabled",{enumerable:!0,
configurable:!1,get:()=>b!==null?b:(k!==t.namespaces&&(k=t.namespaces,C=t.enabled(u)),C),set:f=>{b=f}}),typeof t.init=="\
function"&&t.init($),$}function n(u,h){const d=t(this.namespace+(typeof h>"u"?":":h)+u);return d.log=this.log,d}function s(u){
t.save(u),t.namespaces=u,t.names=[],t.skips=[];let h;const d=(typeof u=="string"?u:"").split(/[\s,]+/),b=d.length;for(h=
0;h<b;h++)d[h]&&(u=d[h].replace(/\*/g,".*?"),u[0]==="-"?t.skips.push(new RegExp("^"+u.substr(1)+"$")):t.names.push(new RegExp(
"^"+u+"$")))}function i(){const u=[...t.names.map(a),...t.skips.map(a).map(h=>"-"+h)].join(",");return t.enable(""),u}function o(u){
if(u[u.length-1]==="*")return!0;let h,d;for(h=0,d=t.skips.length;h<d;h++)if(t.skips[h].test(u))return!1;for(h=0,d=t.names.
length;h<d;h++)if(t.names[h].test(u))return!0;return!1}function a(u){return u.toString().substring(2,u.toString().length-
2).replace(/\.\*\?$/,"*")}function c(u){return u instanceof Error?u.stack??u.message:u}function l(){console.warn("Instan\
ce method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `\
debug`.")}return t.setupFormatters(t.formatters),t.enable(t.load()),t}var $B={};const Ti=UB(),CB=["#0000CC","#0000FF","#\
0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#\
3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#\
33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#\
99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#\
CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#\
FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#\
FFCC00","#FFCC33"];function IB(){return typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.
__nwjs)?!0:typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/(edge|trident)\/(\d+)/)!=null?!1:typeof document<
"u"&&document.documentElement?.style?.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.
console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/firefox\/(\d+)/)!=
null&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent?.toLowerCase().match(/applewebkit\/(\d+)/)}function BB(r){
if(r[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+r[0]+(this.useColors?"%c ":" ")+"+"+Dy(this.diff),
!this.useColors)return;const e="color: "+this.color;r.splice(1,0,e,"color: inherit");let t=0,n=0;r[0].replace(/%[a-zA-Z%]/g,
s=>{s!=="%%"&&(t++,s==="%c"&&(n=t))}),r.splice(n,0,e)}const LB=console.debug??console.log??(()=>{});function DB(r){try{r?
Ti?.setItem("debug",r):Ti?.removeItem("debug")}catch{}}function NB(){let r;try{r=Ti?.getItem("debug")}catch{}return!r&&typeof globalThis.
process<"u"&&"env"in globalThis.process&&(r=$B.DEBUG),r}function UB(){try{return localStorage}catch{}}function _B(r){r.j=
function(e){try{return JSON.stringify(e)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}}}const et=kB({formatArgs:BB,
save:DB,load:NB,useColors:IB,setupFormatters:_B,colors:CB,storage:Ti,log:LB});et.formatters.z=r=>r==null?"undefined":mB.
baseEncode(r);et.formatters.b=r=>r==null?"undefined":pB.baseEncode(r);et.formatters.k=r=>r==null?"undefined":wB.baseEncode(
r);et.formatters.m=r=>r==null?"undefined":vB.baseEncode(r);et.formatters.e=r=>r==null?"undefined":Ny(r);function Qh(r,e=""){
const t=Zh(r.message),n=Zh(r.stack);return t!=null&&n!=null?n.includes(t)?`${n.split(`
`).join(`
${e}`)}`:`${t}
${e}${n.split(`
`).join(`
${e}`)}`:n!=null?`${n.split(`
`).join(`
${e}`)}`:t!=null?`${t}`:`${r.toString()}`}function PB(r){return r instanceof AggregateError||r?.name==="AggregateError"&&
Array.isArray(r.errors)}function Ny(r,e=""){if(PB(r)){let t=Qh(r,e);return r.errors.length>0?(e=`${e}    `,t+=`
${e}${r.errors.map(n=>`${Ny(n,`${e}`)}`).join(`
${e}`)}`):t+=`
${e}[Error list was empty]`,t.trim()}return Qh(r,e)}function TB(r){const e=()=>{};return e.enabled=!1,e.color="",e.diff=
0,e.log=()=>{},e.namespace=r,e.destroy=()=>!0,e.extend=()=>e,e.useColors=()=>!1,e}function MB(r){return{forComponent(e){
return Uy(e,r)}}}function Uy(r,e){let t=TB(`${r}:trace`);return et.enabled(`${r}:trace`)&&et.names.map(n=>n.toString()).
find(n=>n.includes(":trace"))!=null&&(t=et(`${r}:trace`,e)),Object.assign(et(r,e),{error:et(`${r}:error`,e),trace:t,newScope:n=>Uy(
`${r}:${n}`,e)})}function Zh(r){if(r!=null&&(r=r.trim(),r.length!==0))return r}function OB(r,e){if(r===e)return!0;if(r.byteLength!==
e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function _l(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return Xn(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return Xn(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function RB(r){
return r?.buffer instanceof ArrayBuffer}function Xn(r){return RB(r)?r:r.slice()}function FB(r,e,t){if(r.length>=255)throw new TypeError(
"Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(
i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(
256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,
f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,p=0,m=f.length;p!==m&&f[p]===0;)p++,g++;for(var E=(m-p)*b+1>>>
0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>
0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-A;x!==E&&y[x]===0;)x++;for(var D=h.repeat(g);x<E;++x)D+=
r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.
charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;
if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(
A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(f);if(g)return g;throw new Error(`Non-${e} character`)}
return{encode:k,decodeUnsafe:C,decode:$}}var VB=FB,KB=VB;let zB=class{name;prefix;baseEncode;constructor(e,t,n){this.name=
e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},HB=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return _y(this,e)}},
jB=class{decoders;constructor(e){this.decoders=e}or(e){return _y(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function _y(r,e){return new jB({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let GB=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new zB(e,t,n),this.decoder=new HB(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Py({name:r,prefix:e,encode:t,decode:n}){return new GB(r,e,t,
n)}function $o({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=KB(t,r,n);return Py({prefix:e,
name:r,encode:s,decode:o=>_l(i(o))})}function WB(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function qB(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function JB(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function xt({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=JB(n,s);return Py(
{prefix:e,name:r,encode(o){return qB(o,n,t)},decode(o){return WB(o,i,t,r)}})}const gt=xt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});xt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});xt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});xt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const xa=$o(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});$o({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Nt=$o({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});$o({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var XB=Ty,ef=128,YB=-128,QB=Math.pow(2,31);function Ty(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=QB;)e[t++]=r&255|ef,r/=128;for(;r&YB;)e[t++]=r&255|ef,r>>>=7;return e[t]=r|0,Ty.bytes=t-n+1,e}var ZB=Sc,
e4=128,tf=127;function Sc(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Sc.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&tf)<<s:(o&tf)*Math.pow(2,s),s+=7}while(o>=e4);return Sc.bytes=i-n,t}var t4=Math.pow(
2,7),r4=Math.pow(2,14),n4=Math.pow(2,21),s4=Math.pow(2,28),i4=Math.pow(2,35),o4=Math.pow(2,42),a4=Math.pow(2,49),c4=Math.
pow(2,56),l4=Math.pow(2,63),u4=function(r){return r<t4?1:r<r4?2:r<n4?3:r<s4?4:r<i4?5:r<o4?6:r<a4?7:r<c4?8:r<l4?9:10},h4={
encode:XB,decode:ZB,encodingLength:u4},Mi=h4;function kc(r,e=0){const t=Mi.decode(r,e),n=Mi.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Oi(r,e,t=0){return Mi.encode(r,e,t),e}function Ri(r){return Mi.encodingLength(r)}function f4(r,e){const t=e.
byteLength,n=Ri(r),s=n+Ri(t),i=new Uint8Array(s+t);return Oi(r,i,0),Oi(t,i,n),i.set(e,s),new Pl(r,t,e,i)}function My(r){
const e=_l(r),[t,n]=kc(e),[s,i]=kc(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Pl(t,s,o,e)}function d4(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&OB(r.bytes,t.bytes)}}let Pl=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
Xn(n),this.bytes=Xn(s)}};function rf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return y4(t,$c(r),e??Nt.encoder);default:
return p4(t,$c(r),e??gt.encoder)}}const nf=new WeakMap;function $c(r){const e=nf.get(r);if(e==null){const t=new Map;return nf.
set(r,t),t}return e}let g4=class ae{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=Xn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
dn)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==w4)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return ae.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=f4(e,
t);return ae.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return ae.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&d4(e.multihash,n.multihash)}toString(e){return rf(this,e)}toJSON(){return{"/":rf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof ae)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new ae(n,s,i,o??sf(n,s,i.bytes))}else if(t[m4]===!0){const{version:n,
multihash:s,code:i}=t,o=My(s);return ae.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==dn)throw new Error(`Version 0 CID must use dag-pb (code: ${dn}) block encoding`);return new ae(e,t,n,n.bytes)}case 1:{
const s=sf(e,t,n.bytes);return new ae(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return ae.
create(0,dn,e)}static createV1(e,t){return ae.create(1,e,t)}static decode(e){const[t,n]=ae.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=ae.inspectBytes(e),n=t.size-t.multihashSize,
s=_l(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Pl(t.multihashCode,t.digestSize,i,s);return[t.version===0?ae.createV0(o):ae.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=kc(e.subarray(t));return t+=d,h};let s=n(),
i=dn;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=b4(e,t),
i=ae.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return $c(
i).set(n,e),i}};function b4(r,e){switch(r[0]){case"Q":{const t=e??Nt;return[Nt.prefix,t.decode(`${Nt.prefix}${r}`)]}case Nt.
prefix:{const t=e??Nt;return[Nt.prefix,t.decode(r)]}case gt.prefix:{const t=e??gt;return[gt.prefix,t.decode(r)]}case xa.
prefix:{const t=e??xa;return[xa.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function y4(r,e,t){const{prefix:n}=t;if(n!==
Nt.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function p4(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const dn=112,w4=18;function sf(r,e,t){const n=Ri(r),s=n+Ri(e),i=new Uint8Array(s+t.
byteLength);return Oi(r,i,0),Oi(e,i,n),i.set(t,s),i}const m4=Symbol.for("@ipld/js-cid/CID"),v4=85;function E4(r){return typeof r?.
then=="function"}class A4 extends Uf{data;constructor(){super(),this.data=new Map}put(e,t,n){n?.signal?.throwIfAborted();
let s;if(t instanceof Uint8Array)s=[t];else{const i=Vp(t);if(E4(i))return i.then(o=>this._put(e,o,n));s=i}return this._put(
e,s,n)}_put(e,t,n){return n?.signal?.throwIfAborted(),this.data.set(gt.encode(e.multihash.bytes),t),e}*get(e,t){t?.signal?.
throwIfAborted();const n=this.data.get(gt.encode(e.multihash.bytes));if(n==null)throw new Oc;yield*n}has(e,t){return t?.
signal?.throwIfAborted(),this.data.has(gt.encode(e.multihash.bytes))}async delete(e,t){t?.signal?.throwIfAborted(),this.
data.delete(gt.encode(e.multihash.bytes))}*getAll(e){e?.signal?.throwIfAborted();for(const[t,n]of this.data.entries())yield{
cid:g4.createV1(v4,My(gt.decode(t))),bytes:(async function*(){yield*n})()},e?.signal?.throwIfAborted()}}Rf("blockstore:c\
ore:tiered");const x4="SHARDING";new rt(x4);Rf("datastore:core:tiered");class S4{lock;child;pins;routing;started;constructor(e,t,n,s={}){
this.child=e,this.pins=t,this.routing=n,this.lock=Kp({singleProcess:s.holdGcLock}),this.started=!1}isStarted(){return this.
started}async start(){await ts(this.child),this.started=!0}async stop(){await Zi(this.child),this.started=!1}unwrap(){return this.
child}async put(e,t,n={}){n?.signal?.throwIfAborted();const s=await this.lock.readLock();try{return await this.child.put(
e,t,n)}finally{s()}}async*putMany(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.readLock();try{yield*this.
child.putMany(e,t)}finally{n()}}async*get(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.readLock();try{yield*this.
child.get(e,t)}finally{n()}}async*getMany(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.readLock();try{yield*this.
child.getMany(e,t)}finally{n()}}async delete(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.writeLock();try{
if(await this.pins.isPinned(e))throw new lu("Block was pinned - please unpin and try again");await this.routing.cancelReprovide(
e,t),await this.child.delete(e,t)}finally{n()}}async*deleteMany(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.
writeLock();try{const s=this;yield*this.child.deleteMany((async function*(){for await(const i of e){if(await s.pins.isPinned(
i))throw new lu("Block was pinned - please unpin and try again");await s.routing.cancelReprovide(i,t),yield i}})(),t)}finally{
n()}}async has(e,t={}){t?.signal?.throwIfAborted();const n=await this.lock.readLock();try{return await this.child.has(e,
t)}finally{n()}}async*getAll(e={}){e?.signal?.throwIfAborted();const t=await this.lock.readLock();try{yield*this.child.getAll(
e)}finally{t()}}createSession(e,t){return t?.signal?.throwIfAborted(),this.child.createSession(e,t)}}function k4(r,e="ut\
f8"){const t=$y[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}
const Sa=new rt("/version"),of=1;async function $4(r){if(!await r.has(Sa)){await r.put(Sa,k4(`${of}`));return}const e=await r.
get(Sa),t=Ul(e);if(parseInt(t,10)!==of)throw new i2("Invalid datastore version, a datastore migration may be required")}
function C4(r=[],e){const t={[kp]:Sp,[Ay]:V3};return r.forEach(n=>{t[n.code]=n}),async n=>{let s=t[n];if(s==null&&e!=null){
const i=e(n);no(i)?s=await i:s=i,t[s.code]=s}if(s!=null)return s;throw new Vm(`Could not load codec for ${n}`)}}function I4(r=[],e){
const t={};return r=[bm(),xm(),gd(),...r],r.forEach(n=>{t[n.type]=n,t[n.code]=n}),async n=>{let s=t[n];if(s==null&&e!=null){
const i=e(n);no(i)?s=await i:s=i,t[s.type]=s,t[s.code]=s}if(s!=null)return s;throw new Km(`Could not load crypto for ${s}`)}}
function B4(r=[],e){const t={[Dh.code]:Dh,[Hh.code]:Hh};return r.forEach(n=>{t[n.code]=n}),async n=>{let s=t[n];if(s==null&&
e!=null){const i=e(n);no(i)?s=await i:s=i,t[s.code]=s}if(s!=null)return s;throw new Fm(`No hasher configured for multiha\
sh code 0x${n.toString(16)}, please configure one. You can look up which hash this is at https://github.com/multiformats\
/multicodec/blob/master/table.csv`)}}const Rs=0;class Fs extends Error{static name="IdentityHashDigestTooLongError";name="\
IdentityHashDigestTooLongError"}class L4 extends Uf{child;maxDigestLength;constructor(e,t){super(),this.child=e,this.maxDigestLength=
t?.maxDigestLength}put(e,t,n){if(e.multihash.code===Rs){if(this.maxDigestLength!=null&&e.multihash.digest.byteLength>this.
maxDigestLength)throw new Fs(`Identity digest too long - ${e.multihash.digest.byteLength} > this.maxDigestLength`);return n?.
signal?.throwIfAborted(),e}return this.child==null?(n?.signal?.throwIfAborted(),e):this.child.put(e,t,n)}async*get(e,t){
if(e.multihash.code===Rs){if(this.maxDigestLength!=null&&e.multihash.digest.byteLength>this.maxDigestLength)throw new Fs(
`Identity digest too long - ${e.multihash.digest.byteLength} > this.maxDigestLength`);t?.signal?.throwIfAborted(),yield e.
multihash.digest;return}if(this.child==null)throw t?.signal?.throwIfAborted(),new Oc;yield*this.child.get(e,t)}has(e,t){
if(e.multihash.code===Rs){if(this.maxDigestLength!=null&&e.multihash.digest.byteLength>this.maxDigestLength)throw new Fs(
`Identity digest too long - ${e.multihash.digest.byteLength} > this.maxDigestLength`);return t?.signal?.throwIfAborted(),
!0}return this.child==null?(t?.signal?.throwIfAborted(),!1):this.child.has(e,t)}delete(e,t){if(e.code===Rs){if(this.maxDigestLength!=
null&&e.multihash.digest.byteLength>this.maxDigestLength)throw new Fs(`Identity digest too long - ${e.multihash.digest.byteLength}\
 > this.maxDigestLength`);t?.signal?.throwIfAborted();return}if(this.child!=null)return this.child.delete(e,t)}async*getAll(e){
this.child!=null&&(yield*this.child.getAll(e)),e?.signal?.throwIfAborted()}}function D4(r){return r[Symbol.asyncIterator]!=
null}function af(r){return r?.then!=null}function N4(r,e){let t=0;if(D4(r))return(async function*(){for await(const c of r){
const l=e(c,t++);af(l)&&await l,yield c}})();const n=Nf(r),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(
s,t++);if(typeof o?.then=="function")return(async function*(){await o,yield s;for(const c of n){const l=e(c,t++);af(l)&&
await l,yield c}})();const a=e;return(function*(){yield s;for(const c of n)a(c,t++),yield c})()}function Cc(r,e){if(r===
e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}const U4=128;
class Oy{child;getHasher;log;logger;blockBrokers;constructor(e,t={}){this.log=e.logger.forComponent("helia:networked-sto\
rage"),this.logger=e.logger,this.blockBrokers=e.blockBrokers,this.child=new L4(e.blockstore,{maxDigestLength:t.maxIdentityHashDigestLength??
U4}),this.getHasher=e.getHasher}async put(e,t,n={}){return await this.child.has(e,n)?(n.onProgress?.(new L("blocks:put:d\
uplicate",e)),e):(n.onProgress?.(new L("blocks:put:blockstore:put",e)),await this.child.put(e,t,n),n.onProgress?.(new L(
"blocks:put:providers:notify",e)),await Promise.all(this.blockBrokers.map(async s=>s.announce?.(e,n))),e)}async*putMany(e,t={}){
const n=_f(e,async({cid:o})=>{const a=await this.child.has(o,t);return a&&t.onProgress?.(new L("blocks:put-many:duplicat\
e",o)),!a});t.onProgress?.(new L("blocks:put-many:blockstore:put-many"));const s=this,i=async function*(o){for await(const a of o)
t.onProgress?.(new L("blocks:put-many:blockstore:put",a.cid)),yield a,t.onProgress?.(new L("blocks:put-many:providers:no\
tify",a.cid)),await Promise.all(s.blockBrokers.map(async c=>c.announce?.(a.cid,t)))};yield*this.child.putMany(i(n),t)}async*get(e,t={}){
const n=await this.child.has(e,t),s=t.offline===!0;if(!n){if(s)throw new uu("The block was present in the blockstore and\
 the node is running offline so cannot fetch it");const i=await this.getHasher(e.multihash.code);t?.signal?.throwIfAborted(),
t.onProgress?.(new L("blocks:get:providers:get",e));const o=await cf(e,this.blockBrokers,i,{...t,log:this.log});t.onProgress?.(
new L("blocks:get:blockstore:put",e)),await this.child.put(e,o,t),t.onProgress?.(new L("blocks:get:providers:notify",e)),
await Promise.all(this.blockBrokers.map(async a=>a.announce?.(e,t))),yield o;return}t.onProgress?.(new L("blocks:get:blo\
ckstore:get",e)),yield*this.child.get(e,t)}async*getMany(e,t={}){t.onProgress?.(new L("blocks:get-many:blockstore:get-ma\
ny")),yield*this.child.getMany(N4(e,async n=>{const s=await this.child.has(n,t),i=t.offline===!0;if(!s){if(i)throw new uu(
"The block was present in the blockstore and the node is running offline so cannot fetch it");const o=await this.getHasher(
n.multihash.code);t?.signal?.throwIfAborted(),t.onProgress?.(new L("blocks:get-many:providers:get",n));const a=await cf(
n,this.blockBrokers,o,{...t,log:this.log});t.onProgress?.(new L("blocks:get-many:blockstore:put",n)),await this.child.put(
n,a,t),t.onProgress?.(new L("blocks:get-many:providers:notify",n)),await Promise.all(this.blockBrokers.map(async c=>c.announce?.(
n,t)))}}))}async delete(e,t={}){t.onProgress?.(new L("blocks:delete:blockstore:delete",e)),await this.child.delete(e,t)}async*deleteMany(e,t={}){
t.onProgress?.(new L("blocks:delete-many:blockstore:delete-many")),yield*this.child.deleteMany((async function*(){for await(const n of e)
yield n})(),t)}async has(e,t={}){return this.child.has(e,t)}async*getAll(e={}){e.onProgress?.(new L("blocks:get-all:bloc\
kstore:get-many")),yield*this.child.getAll(e)}}async function cf(r,e,t,n){const s=P4(r,t),i=new AbortController,o=Te([i.
signal,n.signal]);Yi(1/0,i.signal);const a=[];for(const c of e)_4(c)&&a.push(c);if(a.length===0)throw new hi(`No block b\
rokers capable of retrieving blocks are configured, the CID ${r} cannot be fetched from the network`);try{return await Promise.
any(a.map(async c=>{try{let l=!1;const u=await c.retrieve(r,{...n,signal:o,validateFn:async h=>{await s(h),n.signal?.throwIfAborted(),
l=!0}});return l||(await s(u),n.signal?.throwIfAborted()),u}catch(l){throw n.log.error("could not retrieve verified bloc\
k for %c from %s - %e",r,c.name,l),l}}))}catch(c){throw new a2(c.errors,`Failed to load block for ${r}`)}finally{i.abort(),
o.clear()}}function _4(r){return typeof r.retrieve=="function"}const P4=(r,e)=>{if(e==null)throw new B(`No hasher config\
ured for multihash code 0x${r.multihash.code.toString(16)}, please configure one. You can look up which hash this is at \
https://github.com/multiformats/multicodec/blob/master/table.csv`);return async t=>{let n;const s=e.digest(t,{truncate:r.
multihash.digest.byteLength});if(no(s)?n=await s:n=s,!Cc(n.digest,r.multihash.digest))throw new $p("Hash of downloaded b\
lock did not match multihash from passed CID")}};class T4 extends Oy{closeController;constructor(e,t){super(e),this.closeController=
new AbortController,Yi(1/0,this.closeController.signal),this.log=e.logger.forComponent(`helia:session-storage:${t.root}`)}close(){
this.closeController.abort()}async addPeer(e,t){await Promise.all(this.blockBrokers.map(n=>n.addPeer(e,t)))}async put(e,t,n={}){
const s=Te([this.closeController.signal,n.signal]);try{return await super.put(e,t,{...n,signal:s})}finally{s.clear()}}async*putMany(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{yield*super.putMany(e,{...t,signal:n})}finally{n.clear()}}async*get(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{yield*super.get(e,{...t,signal:n})}finally{n.clear()}}async*getMany(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{yield*super.getMany(e,{...t,signal:n})}finally{n.clear()}}async delete(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{await super.delete(e,{...t,signal:n})}finally{n.clear()}}async*deleteMany(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{yield*super.deleteMany(e,{...t,signal:n})}finally{n.clear()}}async has(e,t={}){
const n=Te([this.closeController.signal,t.signal]);try{return await super.has(e,{...t,signal:n})}finally{n.clear()}}async*getAll(e={}){
const t=Te([this.closeController.signal,e.signal]);try{yield*super.getAll({...e,signal:t})}finally{t.clear()}}}class M4 extends Oy{started;constructor(e,t={}){
super(e,t),this.started=!1}isStarted(){return this.started}async start(){await ts(this.child,...this.blockBrokers),this.
started=!0}async stop(){await Zi(this.child,...this.blockBrokers),this.started=!1}unwrap(){return this.child}createSession(e,t){
if(this.blockBrokers.length===0)throw new hi("No block brokers configured");const n=this.blockBrokers.map(s=>s.createSession?.(
t)).filter(s=>s!=null);if(n.length===0)throw new hi(`No configured block brokers support sessions - tried ${this.blockBrokers.
map(s=>s.name).join(", ")}`);return new T4({blockstore:this.child,blockBrokers:n,getHasher:this.getHasher,logger:this.logger},
{root:e})}}const Ry="/pin/",lf="/pinned-block/",Ic=sr;function Vs(r){return r.version===0&&(r=r.toV1()),new rt(`${Ry}${r.
toString(Ic)}`)}class O4{datastore;blockstore;getCodec;constructor(e,t,n){this.datastore=e,this.blockstore=t,this.getCodec=
n}async*add(e,t={}){const n=Vs(e);if(await this.datastore.has(n))throw new s2("Already pinned");const s=Math.round(t.depth??
1/0);if(s<0)throw new B("Depth must be greater than or equal to 0");const i=(t.walker??yu())({blockstore:this.blockstore,
getCodec:this.getCodec});for await(const a of i.walk(e,{...t,depth:s})){const c=a.block.cid;await this.#e(c,l=>l.pinnedBy.
find(u=>Cc(u,e.bytes))!=null?!1:(l.pinCount++,l.pinnedBy.push(e.bytes),!0),t),yield c}const o={depth:s,metadata:t.metadata??
{}};await this.datastore.put(n,To(o),t)}async#e(e,t,n){const s=new rt(`${lf}${Ic.encode(e.multihash.bytes)}`);let i={pinCount:0,
pinnedBy:[]};try{i=Xr(await this.datastore.get(s,n))}catch(a){if(a.name!=="NotFoundError")throw a}if(t(i)){if(i.pinCount===
0&&await this.datastore.has(s)){await this.datastore.delete(s);return}await this.datastore.put(s,To(i),n),n.onProgress?.(
new L("helia:pin:add",e))}}async*rm(e,t={}){const n=Vs(e),s=await this.datastore.get(n,t),i=Xr(s);await this.datastore.delete(
n,t);const o=(t.walker??yu())({blockstore:this.blockstore,getCodec:this.getCodec});for await(const a of o.walk(e,{...t,depth:i.
depth})){const c=a.block.cid;await this.#e(c,l=>(l.pinCount--,l.pinnedBy=l.pinnedBy.filter(u=>Cc(u,e.bytes)),!0),{...t,depth:i.
depth}),yield c}}async*ls(e={}){for await(const{key:t,value:n}of this.datastore.query({prefix:Ry+(e.cid!=null?`${e.cid.toString(
sr)}`:"")},e)){const s=H3.parse(t.toString().substring(5),sr),i=Xr(n);yield{cid:s,...i}}}async isPinned(e,t={}){const n=new rt(
`${lf}${Ic.encode(e.multihash.bytes)}`);return this.datastore.has(n,t)}async get(e,t){const n=Vs(e),s=await this.datastore.
get(n,t);return Xr(s)}async setMetadata(e,t,n){const s=Vs(e),i=await this.datastore.get(s,n),o=Xr(i);o.metadata=t??{},await this.
datastore.put(s,To(o),n)}}function Fy(r){return r[Symbol.asyncIterator]!=null}async function R4(r,e,t){try{await Promise.
all(r.map(async n=>{for(;;){const{value:s,done:i}=await n.next();if(i===!0)break;await e.push(s,{signal:t}),t.throwIfAborted()}})),
await e.end(void 0,{signal:t})}catch(n){await e.end(n,{signal:t}).catch(()=>{})}}async function*F4(r){const e=new AbortController,
t=Cp(),n=r.map(s=>Fy(s)?s[Symbol.asyncIterator]():s[Symbol.iterator]());R4(n,t,e.signal).catch(()=>{});try{yield*t}finally{
e.abort();for(const s of n)try{Promise.resolve(s.return?.()).catch(()=>{})}catch{}}}function*V4(r){for(const e of r)yield*e}
function ka(...r){const e=[];for(const t of r)Fy(t)||e.push(t);return e.length===r.length?V4(e):F4(r)}const K4=5;class z4{name;log;routers;providerLookupConcurrency;constructor(e,t){
this.name="helia",this.log=e.logger.forComponent("helia:routing"),this.routers=t.routers??[],this.providerLookupConcurrency=
t.providerLookupConcurrency??K4,this.findProviders=e.metrics?.traceFunction("helia.routing.findProviders",this.findProviders.
bind(this),{optionsIndex:1})??this.findProviders,this.provide=e.metrics?.traceFunction("helia.routing.provide",this.provide.
bind(this),{optionsIndex:1})??this.provide,this.cancelReprovide=e.metrics?.traceFunction("helia.routing.cancelReprovide",
this.cancelReprovide.bind(this),{optionsIndex:1})??this.cancelReprovide,this.put=e.metrics?.traceFunction("helia.routing\
.put",this.put.bind(this),{optionsIndex:2})??this.put,this.get=e.metrics?.traceFunction("helia.routing.get",this.get.bind(
this),{optionsIndex:1})??this.get,this.findPeer=e.metrics?.traceFunction("helia.routing.findPeer",this.findPeer.bind(this),
{optionsIndex:1})??this.findPeer,this.getClosestPeers=e.metrics?.traceFunction("helia.routing.getClosestPeers",this.getClosestPeers.
bind(this),{optionsIndex:1})??this.getClosestPeers}async start(){await ts(...this.routers)}async stop(){await Zi(...this.
routers)}hasRouter(e){return this.routers.findIndex(t=>t.name===e)!==-1}addRouter(e){this.routers.push(e)}async*findProviders(e,t={}){
if(this.routers.length===0)throw new ks("No content routers available");let n=0;const s=this;async function*i(l){let u=0;
const h=l.map(async function*(b){let k=0;t?.onProgress?.(new L("helia:routing:find-providers:start",{router:b.name,cid:e}));
try{for await(const C of b.findProviders(e,t))k++,t?.onProgress?.(new L("helia:routing:find-providers:provider",{router:b.
name,cid:e,provider:C})),yield C}catch{}finally{s.log("router %s found %d providers for %c",b.name,k,e),t?.onProgress?.(
new L("helia:routing:find-providers:end",{router:b.name,cid:e,found:k})),u++,u===l.length&&d.size===0&&d.emitIdle()}}),d=new Xi(
{concurrency:s.providerLookupConcurrency});for await(const b of ka(d.toGenerator(),...h))if(b!=null){if(b.multiaddrs.length===
0){if(d.queue.find(k=>k.options.peer.equals(b.id))!=null)continue;d.add(async()=>{try{const k=await s.findPeer(b.id,t);return k.
multiaddrs.length===0?null:{...k,protocols:b.protocols,router:b.router,fallback:b.fallback}}catch(k){return s.log.error(
"could not load multiaddrs for peer %p - %e",b.id,k),null}},{peer:b.id,signal:t.signal}).catch(k=>{s.log.error("could no\
t load multiaddrs for peer %p - %e",b.id,k)});continue}n++,yield b}}const o=jt(this.routers,"findProviders"),a=o.filter(
l=>l.capabilities==null||!l.capabilities().includes("fallback")),c=o.filter(l=>l.capabilities?.().includes("fallback")===
!0);this.log("findProviders for %c start using routers %s",e,a.map(l=>l.name).join(", ")),yield*i(a),c.length>0&&(this.log(
"findProviders for %c using fallback routers %s",e,c.map(l=>l.name).join(", ")),yield*i(c)),this.log("findProviders fini\
shed, found %d providers for %c",n,e)}async provide(e,t={}){if(this.routers.length===0)throw new ks("No content routers \
available");await Promise.all(jt(this.routers,"provide").map(async n=>{t?.onProgress?.(new L("helia:routing:provide:star\
t",{router:n.name,cid:e})),await n.provide(e,t),t?.onProgress?.(new L("helia:routing:provide:end",{router:n.name,cid:e}))}))}async cancelReprovide(e,t={}){
await Promise.all(jt(this.routers,"cancelReprovide").map(async n=>{t?.onProgress?.(new L("helia:routing:cancel-reprovide\
:start",{router:n.name,cid:e})),await n.cancelReprovide(e,t),t?.onProgress?.(new L("helia:routing:cancel-reprovide:end",
{router:n.name,cid:e}))}))}async put(e,t,n){await Promise.all(jt(this.routers,"put").map(async s=>{n?.onProgress?.(new L(
"helia:routing:put:start",{router:s.name,key:e,value:t})),await s.put(e,t,n),n?.onProgress?.(new L("helia:routing:put:en\
d",{router:s.name,key:e,value:t}))}))}async get(e,t){const n=[];let s;const i=new AbortController,o=Te([i.signal,t?.signal]);
try{s=await Promise.any(jt(this.routers,"get").map(async a=>{t?.onProgress?.(new L("helia:routing:get:start",{router:a.name,
key:e}));try{return await a.get(e,{...t,signal:o})}catch(c){throw this.log("router %s failed with %e",a.name,c),n.push(c),
c}finally{t?.onProgress?.(new L("helia:routing:get:end",{router:a.name,key:e}))}}))}catch{}finally{i.abort(),o.clear()}if(s==
null)throw new o2(n,`Failed to get value key ${Ul(e,"base58btc")}`);return s}async findPeer(e,t){if(this.routers.length===
0)throw new ks("No peer routers available");const n=new AbortController,s=Te([n.signal,t?.signal]),i=this,o=ka(...jt(this.
routers,"findPeer").map(a=>(async function*(){t?.onProgress?.(new L("helia:routing:find-peer:start",{router:a.name,peerId:e}));
try{yield await a.findPeer(e,{...t,signal:s})}catch(c){i.log.error(c)}finally{t?.onProgress?.(new L("helia:routing:find-\
peer:end",{router:a.name,peerId:e}))}})()));try{for await(const a of o)if(a!=null)return a}finally{n.abort(),s.clear()}throw new Df(
"Could not find peer in routing")}async*getClosestPeers(e,t={}){if(this.routers.length===0)throw new ks("No peer routers\
 available");for await(const n of ka(...jt(this.routers,"getClosestPeers").map(async function*(s){t?.onProgress?.(new L(
"helia:routing:get-closest-peers:start",{router:s.name,key:e}));try{yield*s.getClosestPeers(e,t)}finally{t?.onProgress?.(
new L("helia:routing:get-closest-peers:end",{router:s.name,key:e}))}})))n!=null&&(yield n)}}function jt(r,e){return r.filter(
t=>t[e]!=null)}class H4{info;blockstore;datastore;events;pins;logger;routing;getCodec;getHasher;getCrypto;dns;keychain;metrics;status;log;blockBrokers;mixins;components;constructor(e){
this.info={name:e.name,version:e.version},this.logger=e.logger??MB(),this.log=this.logger.forComponent("helia"),this.getHasher=
B4(e.hashers,e.loadHasher),this.getCodec=C4(e.codecs,e.loadCodec),this.getCrypto=I4(e.cryptos,e.loadCrypto),this.dns=e.dns??
sB(),this.metrics=e.metrics,this.events=new Ji,this.status="stopped",this.mixins=[],this.components={blockstore:e.blockstore??
new A4,datastore:e.datastore??new zp,logger:this.logger,blockBrokers:[],getHasher:this.getHasher,getCodec:this.getCodec,
getCrypto:this.getCrypto,dns:this.dns,metrics:this.metrics,...e.components??{}},this.keychain=this.components.keychain=HI()(
this.components),this.routing=this.components.routing=new z4(this.components,{routers:(e.routers??[]).flatMap(n=>(typeof n==
"function"&&(n=n(this.components)),[n])),providerLookupConcurrency:e.providerLookupConcurrency}),this.blockBrokers=this.
components.blockBrokers=(e.blockBrokers??[]).map(n=>(typeof n=="function"&&(n=n(this.components)),n));const t=new M4(this.
components,e);this.pins=new O4(this.components.datastore,t,this.getCodec),this.blockstore=new S4(t,this.pins,this.routing,
{holdGcLock:e.holdGcLock??!0}),this.datastore=this.components.datastore}hasRouter(e){return this.routing.hasRouter(e)}addRouter(e){
typeof e=="function"&&(e=e(this.components)),this.routing.addRouter(e)}hasBlockBroker(e){return this.blockBrokers.findIndex(
t=>t.name===e)!==-1}addBlockBroker(e){typeof e=="function"&&(e=e(this.components)),this.blockBrokers.push(e)}addMixin(e){
if(this.mixins.find(t=>t.name===e.name)!=null)throw new hi(`A mixin with the name "${e.name} is already present`);this.mixins.
push(e)}async start(){this.status="starting",await $4(this.datastore),await ts(this.blockstore,this.datastore,this.routing,
...this.blockBrokers);for(const e of this.mixins)await e.start?.(this);return this.status="started",this.events.dispatchEvent(
new CustomEvent("start",{detail:this})),this}async stop(){this.status="stopping";for(const e of this.mixins)await e.stop?.(
this);return await Zi(this.blockstore,this.datastore,this.routing,...this.blockBrokers),this.status="stopped",this.events.
dispatchEvent(new CustomEvent("stop",{detail:this})),this}async gc(e={}){const t=await this.blockstore.lock.writeLock();
try{const n=this,s=this.blockstore.unwrap();this.log("gc start"),await Pf(s.deleteMany((async function*(){for await(const{
cid:i}of s.getAll())try{if(await n.pins.isPinned(i,e))continue;yield i,e.onProgress?.(new L("helia:gc:deleted",i))}catch(o){
n.log.error("error during gc - %e",o),e.onProgress?.(new L("helia:gc:error",o))}})()))}finally{t()}this.log("gc finished")}}
const j4="7.1.16",G4="helia";function W4(r={}){return new H4({name:G4,version:j4,...r})}function ys(r,e){if(r===e)return!0;
if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function q4(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
function zr(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Yn(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return Yn(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function J4(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}
const uf=4096;function X4(r){const e=r.length;if(e<=uf)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)
t+=String.fromCharCode.apply(String,r.subarray(n,n+=uf));return t}function Y4(r){return r?.buffer instanceof ArrayBuffer}
function Yn(r){return Y4(r)?r:r.slice()}function Q4(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),b=Math.log(256)/Math.log(u);function k(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,A=0,
p=0,m=f.length;p!==m&&f[p]===0;)p++,g++;for(var E=(m-p)*b+1>>>0,y=new Uint8Array(E);p!==m;){for(var v=f[p],S=0,w=E-1;(v!==
0||S<A)&&w!==-1;w--,S++)v+=256*y[w]>>>0,y[w]=v%u>>>0,v=v/u>>>0;if(v!==0)throw new Error("Non-zero carry");A=S,p++}for(var x=E-
A;x!==E&&y[x]===0;)x++;for(var D=h.repeat(g);x<E;++x)D+=r.charAt(y[x]);return D}function C(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var A=0,p=0;f[g]===h;)A++,g++;for(var m=(f.
length-g)*d+1>>>0,E=new Uint8Array(m);f[g];){var y=n[f.charCodeAt(g)];if(y===255)return;for(var v=0,S=m-1;(y!==0||v<p)&&
S!==-1;S--,v++)y+=u*E[S]>>>0,E[S]=y%256>>>0,y=y/256>>>0;if(y!==0)throw new Error("Non-zero carry");p=v,g++}if(f[g]!==" "){
for(var w=m-p;w!==m&&E[w]===0;)w++;for(var x=new Uint8Array(A+(m-w)),D=A;w!==m;)x[D++]=E[w++];return x}}}function $(f){var g=C(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:k,decodeUnsafe:C,decode:$}}var Z4=Q4,eL=Z4;class tL{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class rL{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Vy(this,e)}}class nL{decoders;constructor(e){
this.decoders=e}or(e){return Vy(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function Vy(r,e){return new nL({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}class sL{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){
this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new tL(e,t,n),this.decoder=new rL(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Co({name:r,prefix:e,encode:t,decode:n}){
return new sL(r,e,t,n)}function ps({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=eL(t,r,n);
return Co({prefix:e,name:r,encode:s,decode:o=>zr(i(o))})}function iL(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function oL(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function aL(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function ee({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=aL(n,s);return Co(
{prefix:e,name:r,encode(o){return oL(o,n,t)},decode(o){return iL(o,i,t,r)}})}const De=ps({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),cL=ps({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),lL=Object.freeze(Object.defineProperty({__proto__:null,base58btc:De,
base58flickr:cL},Symbol.toStringTag,{value:"Module"})),Un=ee({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvw\
xyz234567",bitsPerChar:5,caseInsensitive:!0}),uL=ee({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ2\
34567",bitsPerChar:5,caseInsensitive:!0}),hL=ee({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",
bitsPerChar:5,caseInsensitive:!0}),fL=ee({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
bitsPerChar:5,caseInsensitive:!0}),dL=ee({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,
caseInsensitive:!0}),gL=ee({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),
bL=ee({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),yL=ee(
{prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),pL=ee(
{prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),wL=Object.freeze(Object.defineProperty(
{__proto__:null,base32:Un,base32hex:dL,base32hexpad:bL,base32hexpadupper:yL,base32hexupper:gL,base32pad:hL,base32padupper:fL,
base32upper:uL,base32z:pL},Symbol.toStringTag,{value:"Module"})),ii=ps({prefix:"k",name:"base36",alphabet:"0123456789abc\
defghijklmnopqrstuvwxyz",caseInsensitive:!0}),mL=ps({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQ\
RSTUVWXYZ",caseInsensitive:!0}),vL=Object.freeze(Object.defineProperty({__proto__:null,base36:ii,base36upper:mL},Symbol.
toStringTag,{value:"Module"}));var EL=Ky,hf=128,AL=-128,xL=Math.pow(2,31);function Ky(r,e,t){e=e||[],t=t||0;for(var n=t;r>=
xL;)e[t++]=r&255|hf,r/=128;for(;r&AL;)e[t++]=r&255|hf,r>>>=7;return e[t]=r|0,Ky.bytes=t-n+1,e}var SL=Bc,kL=128,ff=127;function Bc(r,n){
var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Bc.bytes=0,new RangeError("Could not decode varint");o=r[i++],t+=s<
28?(o&ff)<<s:(o&ff)*Math.pow(2,s),s+=7}while(o>=kL);return Bc.bytes=i-n,t}var $L=Math.pow(2,7),CL=Math.pow(2,14),IL=Math.
pow(2,21),BL=Math.pow(2,28),LL=Math.pow(2,35),DL=Math.pow(2,42),NL=Math.pow(2,49),UL=Math.pow(2,56),_L=Math.pow(2,63),PL=function(r){
return r<$L?1:r<CL?2:r<IL?3:r<BL?4:r<LL?5:r<DL?6:r<NL?7:r<UL?8:r<_L?9:10},TL={encode:EL,decode:SL,encodingLength:PL},Fi=TL;
function Lc(r,e=0){const t=Fi.decode(r,e),n=Fi.decode.bytes;if(n>9)throw new RangeError("Invalid varint: too long");if(n>
1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,n]}function Vi(r,e,t=0){return Fi.
encode(r,e,t),e}function Ki(r){return Fi.encodingLength(r)}function Io(r,e){const t=e.byteLength,n=Ki(r),s=n+Ki(t),i=new Uint8Array(
s+t);return Vi(r,i,0),Vi(t,i,n),i.set(e,s),new Tl(r,t,e,i)}function ML(r){const e=zr(r),[t,n]=Lc(e),[s,i]=Lc(e.subarray(
n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new Tl(t,s,o,e)}function OL(r,e){if(r===
e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof Uint8Array&&q4(r.bytes,t.bytes)}}class Tl{code;size;digest;bytes;constructor(e,t,n,s){
this.code=e,this.size=t,this.digest=Yn(n),this.bytes=Yn(s)}}function df(r,e){const{bytes:t,version:n}=r;switch(n){case 0:
return FL(t,Dc(r),e??De.encoder);default:return VL(t,Dc(r),e??Un.encoder)}}const gf=new WeakMap;function Dc(r){const e=gf.
get(r);if(e==null){const t=new Map;return gf.set(r,t),t}return e}class z{code;version;multihash;bytes;"/";constructor(e,t,n,s){
this.code=t,this.version=e,this.multihash=n,this.bytes=Yn(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){
return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{
const{code:e,multihash:t}=this;if(e!==gn)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==KL)throw new Error(
"Cannot convert non sha2-256 multihash CID to CIDv0");return z.createV0(t)}default:throw Error(`Can not convert CID vers\
ion ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.
multihash,n=Io(e,t);return z.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.
version} to version 1. This is a bug please report`)}}equals(e){return z.equals(this,e)}static equals(e,t){const n=t;return n!=
null&&e.code===n.code&&e.version===n.version&&OL(e.multihash,n.multihash)}toString(e){return df(this,e)}toJSON(){return{
"/":df(this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.
toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof z)return t;if(t["/"]!=null&&t["/"]===t.bytes||
t.asCID===t){const{version:n,code:s,multihash:i,bytes:o}=t;return new z(n,s,i,o??bf(n,s,i.bytes))}else if(t[zL]===!0){const{
version:n,multihash:s,code:i}=t,o=ML(s);return z.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="numbe\
r")throw new Error("String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid\
 digest");switch(e){case 0:{if(t!==gn)throw new Error(`Version 0 CID must use dag-pb (code: ${gn}) block encoding`);return new z(
e,t,n,n.bytes)}case 1:{const s=bf(e,t,n.bytes);return new z(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){
return z.create(0,gn,e)}static createV1(e,t){return z.create(1,e,t)}static decode(e){const[t,n]=z.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=z.inspectBytes(e),n=t.size-t.multihashSize,
s=zr(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Tl(t.multihashCode,t.digestSize,i,s);return[t.version===0?z.createV0(o):z.createV1(t.
codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Lc(e.subarray(t));return t+=d,h};let s=n(),
i=gn;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=RL(e,t),
i=z.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Dc(
i).set(n,e),i}}function RL(r,e){switch(r[0]){case"Q":{const t=e??De;return[De.prefix,t.decode(`${De.prefix}${r}`)]}case De.
prefix:{const t=e??De;return[De.prefix,t.decode(r)]}case Un.prefix:{const t=e??Un;return[Un.prefix,t.decode(r)]}case ii.
prefix:{const t=e??ii;return[ii.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function FL(r,e,t){const{prefix:n}=t;if(n!==
De.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function VL(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const gn=112,KL=18;function bf(r,e,t){const n=Ki(r),s=n+Ki(e),i=new Uint8Array(s+t.
byteLength);return Vi(r,i,0),Vi(e,i,n),i.set(t,s),i}const zL=Symbol.for("@ipld/js-cid/CID"),zy=0,HL="identity",Hy=zr;function jL(r,e){
if(e?.truncate!=null&&e.truncate!==r.byteLength){if(e.truncate<0||e.truncate>r.byteLength)throw new Error(`Invalid trunc\
ate option, must be less than or equal to ${r.byteLength}`);r=r.subarray(0,e.truncate)}return Io(zy,Hy(r))}const Ml={code:zy,
name:HL,encode:Hy,digest:jL};function GL(r){return r.buffer instanceof ArrayBuffer}function gr(r){return GL(r)?r:r.slice()}
async function WL(r,e,t,n){const s=await crypto.subtle.importKey("jwk",r,{name:"ECDSA",namedCurve:r.crv??"P-256"},!1,["v\
erify"]);n?.signal?.throwIfAborted();const i=await crypto.subtle.verify({name:"ECDSA",hash:{name:"SHA-256"}},s,gr(e),gr(
t.subarray()));return n?.signal?.throwIfAborted(),i}function xe(r=0){return new Uint8Array(r)}function Vt(r=0){return new Uint8Array(
r)}function qL(r){return r?.buffer instanceof ArrayBuffer}function JL(r){if(qL(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Nc(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=Vt(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return JL(t)}const jy=Symbol.for("@achingbrain/uint8arraylist");function yf(r,e){if(e==null||e<0)
throw new RangeError("index is out of bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-
t};t=s}throw new RangeError("index is out of bounds")}function Ks(r){return!!r?.[jy]}class H{bufs;length;[jy]=!0;constructor(...e){
this.bufs=[],this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.
length}append(...e){this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.
bufs.push(n);else if(Ks(n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not appe\
nd value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;
for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Ks(n))t+=n.byteLength,
this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");
this.length+=t}get(e){const t=yf(this.bufs,e);return t.buf[t.index]}set(e,t){const n=yf(this.bufs,e);n.buf[n.index]=t}write(e,t=0){
if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Ks(e))for(let n=0;n<e.length;n++)this.set(
t+n,e.get(n));else throw new Error("Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.
trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=
this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=
this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return Nc(n,s)}subarray(e,t){
const{bufs:n,length:s}=this._subList(e,t);return n.length===1?n[0]:Nc(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(
e,t),i=new H;return i.length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+
t),e<0||t>this.length)throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.
length)return{bufs:[...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.
bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}
const h=e-a;n.push(o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){
if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Ks(e)&&
!(e instanceof Uint8Array))throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof
Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.
length?this.length:t;const s=n.byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,
o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.
byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;for(let d=l;d>=0;d--){const b=this.get(h+d);if(n[d]!==b){u=Math.max(1,d-a[b]);
break}}if(u===0)return h}return-1}getInt8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getInt8(0)}setInt8(e,t){const n=Vt(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=xe(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=xe(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=xe(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigInt64(0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.
byteOffset,t.byteLength).getUint8(0)}setUint8(e,t){const n=Vt(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(
0,t),this.write(n,e)}getUint16(e,t){const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).
getUint16(0,t)}setUint16(e,t,n){const s=xe(2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(
s,e)}getUint32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){
const s=xe(4);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.
subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=xe(
8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=xe(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=xe(8);new DataView(s.buffer,s.byteOffset,s.
byteLength).setFloat64(0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof H)||e.bufs.length!==this.bufs.length)
return!1;for(let t=0;t<this.bufs.length;t++)if(!ys(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){
const n=new H;return n.bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}}const XL=ps({prefix:"9",name:"\
base10",alphabet:"0123456789"}),YL=Object.freeze(Object.defineProperty({__proto__:null,base10:XL},Symbol.toStringTag,{value:"\
Module"})),QL=ee({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),ZL=ee({prefix:"\
F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),eD=Object.freeze(Object.defineProperty(
{__proto__:null,base16:QL,base16upper:ZL},Symbol.toStringTag,{value:"Module"})),tD=ee({prefix:"0",name:"base2",alphabet:"\
01",bitsPerChar:1}),rD=Object.freeze(Object.defineProperty({__proto__:null,base2:tD},Symbol.toStringTag,{value:"Module"})),
Gy=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦\
🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘\
💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨\
🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐\
🤮🎼🥵🚩🍎🍊👼💍📣🥂"),nD=Gy.reduce((r,e,t)=>(r[t]=e,r),[]),sD=Gy.reduce((r,e,t)=>{const n=e.codePointAt(
0);if(n==null)throw new Error(`Invalid character: ${e}`);return r[n]=t,r},[]);function iD(r){return r.reduce((e,t)=>(e+=
nD[t],e),"")}function oD(r){const e=[];for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid ch\
aracter: ${t}`);const s=sD[n];if(s==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(
e)}const aD=Co({prefix:"🚀",name:"base256emoji",encode:iD,decode:oD}),cD=Object.freeze(Object.defineProperty({__proto__:null,
base256emoji:aD},Symbol.toStringTag,{value:"Module"})),lD=ee({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVW\
XYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),uD=ee({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOP\
QRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),hD=ee({prefix:"u",name:"base64url",alphabet:"ABCDEFGH\
IJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),fD=ee({prefix:"U",name:"base64urlpad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),dD=Object.freeze(Object.defineProperty(
{__proto__:null,base64:lD,base64pad:uD,base64url:hD,base64urlpad:fD},Symbol.toStringTag,{value:"Module"})),gD=ee({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),bD=Object.freeze(Object.defineProperty({__proto__:null,base8:gD},Symbol.
toStringTag,{value:"Module"})),yD=Co({prefix:"\0",name:"identity",encode:r=>X4(zr(r)),decode:r=>zr(J4(r))}),pD=Object.freeze(
Object.defineProperty({__proto__:null,identity:yD},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const wD=20;function mD({name:r,code:e,encode:t,minDigestLength:n,maxDigestLength:s}){return new vD(r,e,t,n,s)}class vD{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??wD,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
pf(n,this.code,t?.truncate):n.then(s=>pf(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}
function pf(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Io(e,r)}function ED(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const AD=mD({name:"sha2-256",code:18,encode:ED("SHA-256")}),wf={...pD,...rD,...bD,...YL,...eD,...wL,
...vL,...lL,...dD,...cD};function Wy(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}
const mf=Wy("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),$a=Wy("asci\
i","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Vt(r.
length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),qy={utf8:mf,"utf-8":mf,hex:wf.base16,latin1:$a,ascii:$a,
binary:$a,...wf};function br(r,e="utf8"){const t=qy[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.
decoder.decode(`${t.prefix}${r}`)}function be(r,e="utf8"){const t=qy[e];if(t==null)throw new Error(`Unsupported encoding\
 "${e}"`);return t.encoder.encode(r).substring(1)}const xD=parseInt("11111",2),Uc=parseInt("10000000",2),SD=parseInt("01\
111111",2),vf={0:bn,1:bn,2:kD,3:ID,4:BD,5:CD,6:$D,16:bn,22:bn,48:bn};function Bo(r,e={offset:0}){const t=r[e.offset]&xD;
if(e.offset++,vf[t]!=null)return vf[t](r,e);throw new Error("No decoder for tag "+t)}function ws(r,e){let t=0;if((r[e.offset]&
Uc)===Uc){const n=r[e.offset]&SD;let s="0x";e.offset++;for(let i=0;i<n;i++,e.offset++){if(e.offset>=r.byteLength)throw new Error(
"invalid DER element length");s+=r[e.offset].toString(16).padStart(2,"0")}t=parseInt(s,16)}else t=r[e.offset],e.offset++;
if(!Number.isInteger(t)||t<0||t>r.byteLength-e.offset)throw new Error("invalid DER element length");return t}function bn(r,e){
ws(r,e);const t=[];for(;!(e.offset>=r.byteLength);){const n=Bo(r,e);if(n===null)break;t.push(n)}return t}function kD(r,e){
const t=ws(r,e),n=e.offset,s=e.offset+t,i=[];for(let o=n;o<s;o++)o===n&&r[o]===0||i.push(r[o]);return e.offset+=t,Uint8Array.
from(i)}function $D(r,e){const t=ws(r,e),n=e.offset+t,s=r[e.offset];e.offset++;let i=0,o=0;s<40?(i=0,o=s):s<80?(i=1,o=s-
40):(i=2,o=s-80);let a=`${i}.${o}`,c=[];for(;e.offset<n;){const l=r[e.offset];if(e.offset++,c.push(l&127),l<128){c.reverse();
let u=0;for(let h=0;h<c.length;h++)u+=c[h]<<h*7;a+=`.${u}`,c=[]}}return a}function CD(r,e){return e.offset++,null}function ID(r,e){
const t=ws(r,e),n=r[e.offset];e.offset++;const s=r.subarray(e.offset,e.offset+t-1);if(e.offset+=t,n!==0)throw new Error(
"Unused bits in bit string is unimplemented");return s}function BD(r,e){const t=ws(r,e),n=r.subarray(e.offset,e.offset+t);
return e.offset+=t,n}function LD(r){let e=r.toString(16);e.length%2===1&&(e="0"+e);const t=new H;for(let n=0;n<e.length;n+=
2)t.append(Uint8Array.from([parseInt(`${e[n]}${e[n+1]}`,16)]));return t}function Ol(r){if(r.byteLength<128)return Uint8Array.
from([r.byteLength]);const e=LD(r.byteLength);return new H(Uint8Array.from([e.byteLength|Uc]),e)}function _c(r){const e=new H,
t=128;return(r.subarray()[0]&t)===t&&e.append(Uint8Array.from([0])),e.append(r),new H(Uint8Array.from([2]),Ol(e),e)}function Jy(r){
const e=Uint8Array.from([0]),t=new H(e,r);return new H(Uint8Array.from([3]),Ol(t),t)}function _n(r,e=48){const t=new H;for(const n of r)
t.append(n);return new H(Uint8Array.from([e]),Ol(t),t)}const DD=Uint8Array.from([6,8,42,134,72,206,61,3,1,7]),ND=Uint8Array.
from([6,5,43,129,4,0,34]),UD=Uint8Array.from([6,5,43,129,4,0,35]),_D={ext:!0,kty:"EC",crv:"P-256"},PD={ext:!0,kty:"EC",crv:"\
P-384"},TD={ext:!0,kty:"EC",crv:"P-521"},Ca=32,Ia=48,Ba=66;function MD(r){const e=Bo(r);return OD(e)}function OD(r){const e=r[1][1][0],
t=1;let n,s;if(e.byteLength===Ca*2+1)return n=be(e.subarray(t,t+Ca),"base64url"),s=be(e.subarray(t+Ca),"base64url"),new La(
{..._D,key_ops:["verify"],x:n,y:s});if(e.byteLength===Ia*2+1)return n=be(e.subarray(t,t+Ia),"base64url"),s=be(e.subarray(
t+Ia),"base64url"),new La({...PD,key_ops:["verify"],x:n,y:s});if(e.byteLength===Ba*2+1)return n=be(e.subarray(t,t+Ba),"b\
ase64url"),s=be(e.subarray(t+Ba),"base64url"),new La({...TD,key_ops:["verify"],x:n,y:s});throw new B(`coordinates were w\
rong length, got ${e.byteLength}, expected 65, 97 or 133`)}function RD(r){return _n([_c(Uint8Array.from([1])),_n([FD(r.crv)],
160),_n([Jy(new H(Uint8Array.from([4]),br(r.x??"","base64url"),br(r.y??"","base64url")))],161)]).subarray()}function FD(r){
if(r==="P-256")return DD;if(r==="P-384")return ND;if(r==="P-521")return UD;throw new B(`Invalid curve ${r}`)}class La{type="\
ECDSA";jwk;_raw;constructor(e){this.jwk=e}get raw(){return this._raw==null&&(this._raw=RD(this.jwk)),this._raw}toMultihash(){
return Ml.digest(_o(this))}toCID(){return z.createV1(114,this.toMultihash())}toString(){return De.encode(this.toMultihash().
bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ys(this.raw,e.raw)}async verify(e,t,n){return WL(
this.jwk,t,e,n)}}class Ef extends Error{constructor(e="An error occurred while verifying a message"){super(e),this.name=
"VerificationError"}}class VD extends Error{constructor(e="Missing Web Crypto API"){super(e),this.name="WebCryptoMissing\
Error"}}const Qn={get(r=globalThis){const e=r.crypto;if(e?.subtle==null)throw new VD("Missing Web Crypto API. The most l\
ikely cause of this error is that this page is being accessed from an insecure context (i.e. not HTTPS). For more inform\
ation and possible resolutions see https://github.com/libp2p/js-libp2p/blob/main/packages/crypto/README.md#web-crypto-ap\
i");return e}},Xy=32;let Da;const KD=(async()=>{try{return await Qn.get().subtle.generateKey({name:"Ed25519"},!0,["sign",
"verify"]),!0}catch{return!1}})();async function zD(r,e,t){if(r.buffer instanceof ArrayBuffer){const n=await Qn.get().subtle.
importKey("raw",r.buffer,{name:"Ed25519"},!1,["verify"]);return await Qn.get().subtle.verify({name:"Ed25519"},n,gr(e),gr(
t instanceof Uint8Array?t:t.subarray()))}throw new TypeError("WebCrypto does not support SharedArrayBuffer for Ed25519 k\
eys")}function HD(r,e,t){return or.verify(e,t instanceof Uint8Array?t:t.subarray(),r)}async function jD(r,e,t){return Da==
null&&(Da=await KD),Da?zD(r,e,t):HD(r,e,t)}function Yy(r){return r==null?!1:typeof r.then=="function"&&typeof r.catch=="\
function"&&typeof r.finally=="function"}class GD{type="Ed25519";raw;constructor(e){this.raw=Qy(e,Xy)}toMultihash(){return Ml.
digest(_o(this))}toCID(){return z.createV1(114,this.toMultihash())}toString(){return De.encode(this.toMultihash().bytes).
substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ys(this.raw,e.raw)}verify(e,t,n){n?.signal?.throwIfAborted();
const s=jD(this.raw,t,e);return Yy(s)?s.then(i=>(n?.signal?.throwIfAborted(),i)):s}}function WD(r){return r=Qy(r,Xy),new GD(
r)}function Qy(r,e){if(r=Uint8Array.from(r??[]),r.length!==e)throw new B(`Key must be a Uint8Array of length ${e}, got ${r.
length}`);return r}const qD=Math.pow(2,7),JD=Math.pow(2,14),XD=Math.pow(2,21),Zy=Math.pow(2,28),ep=Math.pow(2,35),tp=Math.
pow(2,42),rp=Math.pow(2,49),Ee=128,Lt=127;function Rl(r){if(r<qD)return 1;if(r<JD)return 2;if(r<XD)return 3;if(r<Zy)return 4;
if(r<ep)return 5;if(r<tp)return 6;if(r<rp)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError(
"Could not encode varint");return 8}function YD(r,e,t=0){switch(Rl(r)){case 8:e[t++]=r&255|Ee,r/=128;case 7:e[t++]=r&255|
Ee,r/=128;case 6:e[t++]=r&255|Ee,r/=128;case 5:e[t++]=r&255|Ee,r/=128;case 4:e[t++]=r&255|Ee,r>>>=7;case 3:e[t++]=r&255|
Ee,r>>>=7;case 2:e[t++]=r&255|Ee,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreachable")}return e}
function QD(r,e){let t=r[e],n=0;if(n+=t&Lt,t<Ee||(t=r[e+1],n+=(t&Lt)<<7,t<Ee)||(t=r[e+2],n+=(t&Lt)<<14,t<Ee)||(t=r[e+3],
n+=(t&Lt)<<21,t<Ee)||(t=r[e+4],n+=(t&Lt)*Zy,t<Ee)||(t=r[e+5],n+=(t&Lt)*ep,t<Ee)||(t=r[e+6],n+=(t&Lt)*tp,t<Ee)||(t=r[e+7],
n+=(t&Lt)*rp,t<Ee))return n;throw new RangeError("Could not decode varint")}const Fl=new Float32Array([-0]),Mt=new Uint8Array(
Fl.buffer);function ZD(r,e,t){Fl[0]=r,e[t]=Mt[0],e[t+1]=Mt[1],e[t+2]=Mt[2],e[t+3]=Mt[3]}function e5(r,e){return Mt[0]=r[e],
Mt[1]=r[e+1],Mt[2]=r[e+2],Mt[3]=r[e+3],Fl[0]}const Vl=new Float64Array([-0]),ge=new Uint8Array(Vl.buffer);function t5(r,e,t){
Vl[0]=r,e[t]=ge[0],e[t+1]=ge[1],e[t+2]=ge[2],e[t+3]=ge[3],e[t+4]=ge[4],e[t+5]=ge[5],e[t+6]=ge[6],e[t+7]=ge[7]}function r5(r,e){
return ge[0]=r[e],ge[1]=r[e+1],ge[2]=r[e+2],ge[3]=r[e+3],ge[4]=r[e+4],ge[5]=r[e+5],ge[6]=r[e+6],ge[7]=r[e+7],Vl[0]}const n5=BigInt(
Number.MAX_SAFE_INTEGER),s5=BigInt(Number.MIN_SAFE_INTEGER);class ye{lo;hi;constructor(e,t){this.lo=e|0,this.hi=t|0}toNumber(e=!1){
if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(t+n*4294967296)}return this.
lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.
lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<
1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.
hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;
return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10}static fromBigInt(e){if(e===
0n)return ir;if(e<n5&&e>s5)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let n=e>>32n,s=e-(n<<32n);return t&&
(n=~n|0n,s=~s|0n,++s>Af&&(s=0n,++n>Af&&(n=0n))),new ye(Number(s),Number(n))}static fromNumber(e){if(e===0)return ir;const t=e<
0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&(n=0,++s>4294967295&&(s=0))),
new ye(n,s)}static from(e){return typeof e=="number"?ye.fromNumber(e):typeof e=="bigint"?ye.fromBigInt(e):typeof e=="str\
ing"?ye.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new ye(e.low>>>0,e.high>>>0):ir}}const ir=new ye(0,0);ir.toBigInt=
function(){return 0n};ir.zzEncode=ir.zzDecode=function(){return this};ir.length=function(){return 1};const Af=4294967296n;
function i5(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function o5(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function np(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Ge(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function zs(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}class a5{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=gr(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Ge(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Ge(this,4);return zs(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Ge(
this,4);return zs(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Ge(this,4);const e=e5(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Ge(this,4);const e=r5(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Ge(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return o5(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Ge(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Ge(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new ye(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Ge(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Ge(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Ge(this,8);const e=zs(this.buf,this.pos+=4),t=zs(this.buf,this.pos+=4);return new ye(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=QD(this.buf,this.pos);
return this.pos+=Rl(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function sp(r){return new a5(r instanceof Uint8Array?r:
r.subarray())}function Lo(r,e,t){const n=sp(r);return e.decode(n,void 0,t)}function c5(r){let n,s=8192;return function(o){
if(o<1||o>4096)return Vt(o);s+o>8192&&(n=Vt(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class xn{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}}function Na(){}class l5{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const u5=c5();function h5(r){return globalThis.Buffer!=null?Vt(
r):u5(r)}class Pc{len;head;tail;states;constructor(){this.len=0,this.head=new xn(Na,0,0),this.tail=this.head,this.states=
null}_push(e,t,n){return this.tail=this.tail.next=new xn(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new d5((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Hs,10,
ye.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=ye.fromBigInt(e);return this.
_push(Hs,t.length(),t)}uint64Number(e){return this._push(YD,Rl(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=ye.
fromBigInt(e).zzEncode();return this._push(Hs,t.length(),t)}sint64Number(e){const t=ye.fromNumber(e).zzEncode();return this.
_push(Hs,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Ua,1,e?1:0)}fixed32(e){return this.
_push(yn,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=ye.fromBigInt(e);return this._push(yn,4,t.lo)._push(
yn,4,t.hi)}fixed64Number(e){const t=ye.fromNumber(e);return this._push(yn,4,t.lo)._push(yn,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(ZD,4,e)}double(e){return this._push(t5,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(Ua,1,0):this.uint32(t)._push(g5,t,e)}string(e){const t=i5(e);return t!==0?this.uint32(t)._push(np,t,e):this.
_push(Ua,1,0)}fork(){return this.states=new l5(this),this.head=this.tail=new xn(Na,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new xn(Na,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=h5(this.len);
let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}}function Ua(r,e,t){e[t]=r&255}function f5(r,e,t){for(;r>
127;)e[t++]=r&127|128,r>>>=7;e[t]=r}class d5 extends xn{next;constructor(e,t){super(f5,e,t),this.next=void 0}}function Hs(r,e,t){
for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>
7;e[t++]=r.lo}function yn(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function g5(r,e,t){e.set(r,
t)}globalThis.Buffer!=null&&(Pc.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(b5,
e,r),this},Pc.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(
y5,e,r),this});function b5(r,e,t){e.set(r,t)}function y5(r,e,t){r.length<40?np(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):
e.set(br(r),t)}function p5(){return new Pc}function Do(r,e){const t=p5();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}
function*No(r,e,t){const n=sp(r);yield*e.stream(n,void 0,".",t)}const ip={VARINT:0,LENGTH_DELIMITED:2};function op(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function w5(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return op("enum",ip.VARINT,t,n,s)}function Uo(r,e,t){return op("message",ip.LENGTH_DELIMITED,r,e,
t)}class js extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var pe;(function(r){r.RSA="RSA",r.Ed25519="Ed25519",
r.secp256k1="secp256k1",r.ECDSA="ECDSA"})(pe||(pe={}));var Tc;(function(r){r[r.RSA=0]="RSA",r[r.Ed25519=1]="Ed25519",r[r.
secp256k1=2]="secp256k1",r[r.ECDSA=3]="ECDSA"})(Tc||(Tc={}));(function(r){r.codec=()=>w5(Tc)})(pe||(pe={}));var Zn;(function(r){
let e;r.codec=()=>(e==null&&(e=Uo((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),pe.codec().encode(
i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=pe.codec().decode(i);break}case 2:{c.Data=
i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<
l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:pe.codec().decode(i)};break}case 2:{yield{field:`${a}\
.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Do(i,r.codec())}r.encode=t;function n(i,o){
return Lo(i,r.codec(),o)}r.decode=n;function s(i,o){return No(i,r.codec(),o)}r.stream=s})(Zn||(Zn={}));var xf;(function(r){
let e;r.codec=()=>(e==null&&(e=Uo((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.Type!=null&&(o.uint32(8),pe.codec().encode(
i.Type,o)),i.Data!=null&&(o.uint32(18),o.bytes(i.Data)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={},l=o==
null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.Type=pe.codec().decode(i);break}case 2:{c.Data=
i.bytes();break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<
l;){const u=i.uint32();switch(u>>>3){case 1:{yield{field:`${a}.Type`,value:pe.codec().decode(i)};break}case 2:{yield{field:`${a}\
.Data`,value:i.bytes()};break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Do(i,r.codec())}r.encode=t;function n(i,o){
return Lo(i,r.codec(),o)}r.decode=n;function s(i,o){return No(i,r.codec(),o)}r.stream=s})(xf||(xf={}));class m5{type="RS\
A";jwk;_raw;_multihash;constructor(e,t){this.jwk=e,this._multihash=t}get raw(){return this._raw==null&&(this._raw=S5(this.
jwk)),this._raw}toMultihash(){return this._multihash}toCID(){return z.createV1(114,this._multihash)}toString(){return De.
encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ys(this.raw,e.
raw)}verify(e,t,n){return C5(this.jwk,t,e,n)}}const v5=18,E5=1062,A5=Uint8Array.from([48,13,6,9,42,134,72,134,247,13,1,1,
1,5,0]);function x5(r){const e=Bo(r[1],{offset:0});return{kty:"RSA",n:be(e[0],"base64url"),e:be(e[1],"base64url")}}function S5(r){
if(r.n==null||r.e==null)throw new B("JWK was missing components");return _n([A5,Jy(_n([_c(br(r.n,"base64url")),_c(br(r.e,
"base64url"))]))]).subarray()}function k5(r,e){if(r.byteLength>=E5)throw new Wi("Key size is too large");const t=Bo(r,{offset:0});
return $5(t,r,e)}function $5(r,e,t){const n=x5(r);if(t==null){const s=Zt(Zn.encode({Type:pe.RSA,Data:e}));t=Io(v5,s)}return new m5(
n,t)}async function C5(r,e,t,n){const s=await Qn.get().subtle.importKey("jwk",r,{name:"RSASSA-PKCS1-v1_5",hash:{name:"SH\
A-256"}},!1,["verify"]);n?.signal?.throwIfAborted();const i=await Qn.get().subtle.verify({name:"RSASSA-PKCS1-v1_5"},s,gr(
e),gr(t instanceof Uint8Array?t:t.subarray()));return n?.signal?.throwIfAborted(),i}function I5(r,e,t,n){const s=AD.digest(
t instanceof Uint8Array?t:t.subarray());if(Yy(s))return s.then(({digest:i})=>(n?.signal?.throwIfAborted(),K.verify(e,i,r,
{prehash:!1,format:"der"}))).catch(i=>{throw i.name==="AbortError"?i:new Ef(String(i))});try{return n?.signal?.throwIfAborted(),
K.verify(e,s.digest,r,{prehash:!1,format:"der"})}catch(i){throw new Ef(String(i))}}class B5{type="secp256k1";raw;_key;constructor(e){
this._key=N5(e),this.raw=D5(this._key)}toMultihash(){return Ml.digest(_o(this))}toCID(){return z.createV1(114,this.toMultihash())}toString(){
return De.encode(this.toMultihash().bytes).substring(1)}equals(e){return e==null||!(e.raw instanceof Uint8Array)?!1:ys(this.
raw,e.raw)}verify(e,t,n){return I5(this._key,t,e,n)}}function L5(r){return new B5(r)}function D5(r){return K.Point.fromBytes(
r).toBytes()}function N5(r){try{return K.Point.fromBytes(r),r}catch(e){throw new Wi(String(e))}}function Mc(r,e){const{Type:t,
Data:n}=Zn.decode(r),s=n??new Uint8Array;switch(t){case pe.RSA:return k5(s,e);case pe.Ed25519:return WD(s);case pe.secp256k1:
return L5(s);case pe.ECDSA:return MD(s);default:throw new qi}}function _o(r){return Zn.encode({Type:pe[r.type],Data:r.raw})}
const es=65535,Sf=es-16,ms=!!globalThis.process?.env?.DUMP_SESSION_KEYS,kf=16,U5={hashSHA256(r){return Zt(r.subarray())},
getHKDF(r,e){const t=Hp(Zt,e,r),s=jp(Zt,t,void 0,96),i=s.subarray(0,32),o=s.subarray(32,64),a=s.subarray(64,96);return[i,
o,a]},generateX25519KeyPair(){const r=Es.utils.randomSecretKey();return{publicKey:Es.getPublicKey(r),privateKey:r}},generateX25519KeyPairFromSeed(r){
return{publicKey:Es.getPublicKey(r),privateKey:r}},generateX25519SharedKey(r,e){return Es.getSharedSecret(r.subarray(),e.
subarray())},chaCha20Poly1305Encrypt(r,e,t,n){return jl(n,e,t).encrypt(r.subarray())},chaCha20Poly1305Decrypt(r,e,t,n,s){
return jl(n,e,t).decrypt(r.subarray(),s)}},_5=U5;function P5(r){return{generateKeypair:r.generateX25519KeyPair,dh:(e,t)=>r.
generateX25519SharedKey(e.privateKey,t).subarray(0,32),encrypt:r.chaCha20Poly1305Encrypt,decrypt:r.chaCha20Poly1305Decrypt,
hash:r.hashSHA256,hkdf:r.getHKDF}}const zi=r=>{const e=Vt(2);return e[0]=r>>8,e[1]=r,e};zi.bytes=2;const Hi=r=>{if(r.length<
2)throw RangeError("Could not decode int16BE");if(r instanceof Uint8Array){let e=0;return e+=r[0]<<8,e+=r[1],e}return r.
getUint16(0)};Hi.bytes=2;function T5(r){return{xxHandshakeSuccesses:r.registerCounter("libp2p_noise_xxhandshake_successe\
s_total",{help:"Total count of noise xxHandshakes successes_"}),xxHandshakeErrors:r.registerCounter("libp2p_noise_xxhand\
shake_error_total",{help:"Total count of noise xxHandshakes errors"}),encryptedPackets:r.registerCounter("libp2p_noise_e\
ncrypted_packets_total",{help:"Total count of noise encrypted packets successfully"}),decryptedPackets:r.registerCounter(
"libp2p_noise_decrypted_packets_total",{help:"Total count of noise decrypted packets"}),decryptErrors:r.registerCounter(
"libp2p_noise_decrypt_errors_total",{help:"Total count of noise decrypt errors"})}}function ap(r,e){!e.enabled||!ms||(r?
(e(`LOCAL_STATIC_PUBLIC_KEY ${be(r.publicKey,"hex")}`),e(`LOCAL_STATIC_PRIVATE_KEY ${be(r.privateKey,"hex")}`)):e("Missi\
ng local static keys."))}function cp(r,e){!e.enabled||!ms||(r?(e(`LOCAL_PUBLIC_EPHEMERAL_KEY ${be(r.publicKey,"hex")}`),
e(`LOCAL_PRIVATE_EPHEMERAL_KEY ${be(r.privateKey,"hex")}`)):e("Missing local ephemeral keys."))}function M5(r,e){!e.enabled||
!ms||e(r?`REMOTE_STATIC_PUBLIC_KEY ${be(r.subarray(),"hex")}`:"Missing remote static public key.")}function lp(r,e){!e.enabled||
!ms||e(r?`REMOTE_EPHEMERAL_PUBLIC_KEY ${be(r.subarray(),"hex")}`:"Missing remote ephemeral keys.")}function up(r,e,t){!t.
enabled||!ms||(t(`CIPHER_STATE_1 ${r.n.getUint64()} ${r.k&&be(r.k,"hex")}`),t(`CIPHER_STATE_2 ${e.n.getUint64()} ${e.k&&
be(e.k,"hex")}`))}class Pn extends Error{code;constructor(e="Invalid crypto exchange"){super(e),this.code=Pn.code}static code="\
ERR_INVALID_CRYPTO_EXCHANGE"}const O5=0,R5=4294967295,F5="Cipherstate has reached maximum n, a new handshake must be per\
formed";class V5{n;bytes;view;constructor(e=O5){this.n=e,this.bytes=xe(12),this.view=new DataView(this.bytes.buffer,this.
bytes.byteOffset,this.bytes.byteLength),this.view.setUint32(4,e,!0)}increment(){this.n++,this.view.setUint32(4,this.n,!0)}getBytes(){
return this.bytes}getUint64(){return this.n}assertValue(){if(this.n>R5)throw new Error(F5)}}const Ur=xe(0);class Gs{k;n;crypto;constructor(e,t=void 0,n=0){
this.crypto=e,this.k=t,this.n=new V5(n)}hasKey(){return!!this.k}encryptWithAd(e,t){if(!this.hasKey())return t;this.n.assertValue();
const n=this.crypto.encrypt(t,this.n.getBytes(),e,this.k);return this.n.increment(),n}decryptWithAd(e,t,n){if(!this.hasKey())
return t;this.n.assertValue();const s=this.crypto.decrypt(t,this.n.getBytes(),e,this.k,n);return this.n.increment(),s}}class K5{cs;ck;h;crypto;constructor(e,t){
this.crypto=e;const n=br(t,"utf-8");this.h=H5(e,n),this.ck=this.h,this.cs=new Gs(e)}mixKey(e){const[t,n]=this.crypto.hkdf(
this.ck,e);this.ck=t,this.cs=new Gs(this.crypto,n)}mixHash(e){this.h=this.crypto.hash(new H(this.h,e))}encryptAndHash(e){
const t=this.cs.encryptWithAd(this.h,e);return this.mixHash(t),t}decryptAndHash(e){const t=this.cs.decryptWithAd(this.h,
e);return this.mixHash(e),t}split(){const[e,t]=this.crypto.hkdf(this.ck,Ur);return[new Gs(this.crypto,e),new Gs(this.crypto,
t)]}}class z5{ss;s;e;rs;re;initiator;crypto;constructor(e){const{crypto:t,protocolName:n,prologue:s,initiator:i,s:o,e:a,
rs:c,re:l}=e;this.crypto=t,this.ss=new K5(t,n),this.ss.mixHash(s),this.initiator=i,this.s=o,this.e=a,this.rs=c,this.re=l}writeE(){
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
set");const n=32+(this.ss.cs.hasKey()?16:0);if(e.byteLength<t+n)throw new Error("message is not long enough");const s=e.
sublist(t,t+n);return this.rs=this.ss.decryptAndHash(s),n}readEE(){this.writeEE()}readES(){this.writeES()}readSE(){this.
writeSE()}}class hp extends z5{writeMessageA(e){return new H(this.writeE(),this.ss.encryptAndHash(e))}writeMessageB(e){const t=this.
writeE();this.writeEE();const n=this.writeS();return this.writeES(),new H(t,n,this.ss.encryptAndHash(e))}writeMessageC(e){
const t=this.writeS();return this.writeSE(),new H(t,this.ss.encryptAndHash(e))}readMessageA(e){try{return this.readE(e),
this.ss.decryptAndHash(e.sublist(32))}catch(t){throw new Pn(`handshake stage 0 validation fail: ${t.message}`)}}readMessageB(e){
try{this.readE(e),this.readEE();const t=this.readS(e,32);return this.readES(),this.ss.decryptAndHash(e.sublist(32+t))}catch(t){
throw new Pn(`handshake stage 1 validation fail: ${t.message}`)}}readMessageC(e){try{const t=this.readS(e);return this.readSE(),
this.ss.decryptAndHash(e.sublist(t))}catch(t){throw new Pn(`handshake stage 2 validation fail: ${t.message}`)}}}function H5(r,e){
if(e.length<=32){const t=xe(32);return t.set(e),t}else return r.hash(e)}var Tn;(function(r){let e;r.codec=()=>(e==null&&
(e=Uo((i,o,a={})=>{if(a.lengthDelimited!==!1&&o.fork(),i.webtransportCerthashes!=null&&i.webtransportCerthashes.length>0)
for(const c of i.webtransportCerthashes)o.uint32(10),o.bytes(c);if(i.streamMuxers!=null&&i.streamMuxers.length>0)for(const c of i.
streamMuxers)o.uint32(18),o.string(c);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={webtransportCerthashes:[],
streamMuxers:[]},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{if(a.limits?.webtransportCerthashes!=
null&&c.webtransportCerthashes.length===a.limits.webtransportCerthashes)throw new js('Decode error - repeated field "web\
transportCerthashes" had too many elements');c.webtransportCerthashes.push(i.bytes());break}case 2:{if(a.limits?.streamMuxers!=
null&&c.streamMuxers.length===a.limits.streamMuxers)throw new js('Decode error - repeated field "streamMuxers" had too m\
any elements');c.streamMuxers.push(i.string());break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={
webtransportCerthashes:0,streamMuxers:0},u=o==null?i.len:i.pos+o;for(;i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{
if(c.limits?.webtransportCerthashes!=null&&l.webtransportCerthashes===c.limits.webtransportCerthashes)throw new js('Stre\
aming decode error - repeated field "webtransportCerthashes" had too many elements');yield{field:`${a}.webtransportCerth\
ashes[]`,index:l.webtransportCerthashes,value:i.bytes()},l.webtransportCerthashes++;break}case 2:{if(c.limits?.streamMuxers!=
null&&l.streamMuxers===c.limits.streamMuxers)throw new js('Streaming decode error - repeated field "streamMuxers" had to\
o many elements');yield{field:`${a}.streamMuxers[]`,index:l.streamMuxers,value:i.string()},l.streamMuxers++;break}default:{
i.skipType(h&7);break}}}})),e);function t(i){return Do(i,r.codec())}r.encode=t;function n(i,o){return Lo(i,r.codec(),o)}
r.decode=n;function s(i,o){return No(i,r.codec(),o)}r.stream=s})(Tn||(Tn={}));var ji;(function(r){let e;r.codec=()=>(e==
null&&(e=Uo((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.identityKey!=null&&i.identityKey.byteLength>0&&(o.uint32(10),
o.bytes(i.identityKey)),i.identitySig!=null&&i.identitySig.byteLength>0&&(o.uint32(18),o.bytes(i.identitySig)),i.extensions!=
null&&(o.uint32(34),Tn.codec().encode(i.extensions,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={identityKey:xe(
0),identitySig:xe(0)},l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.identityKey=i.bytes();
break}case 2:{c.identitySig=i.bytes();break}case 4:{c.extensions=Tn.codec().decode(i,i.uint32(),{limits:a.limits?.extensions});
break}default:{i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.
uint32();switch(u>>>3){case 1:{yield{field:`${a}.identityKey`,value:i.bytes()};break}case 2:{yield{field:`${a}.identityS\
ig`,value:i.bytes()};break}case 4:{yield*Tn.codec().stream(i,i.uint32(),`${a}.extensions`,{limits:c.limits?.extensions});
break}default:{i.skipType(u&7);break}}}})),e);function t(i){return Do(i,r.codec())}r.encode=t;function n(i,o){return Lo(
i,r.codec(),o)}r.decode=n;function s(i,o){return No(i,r.codec(),o)}r.stream=s})(ji||(ji={}));async function fp(r,e,t){const n=await r.
sign(gp(e));return ji.encode({identityKey:_o(r.publicKey),identitySig:n,extensions:t})}async function dp(r,e,t){try{const n=ji.
decode(r),s=Mc(n.identityKey);if(t?.equals(s)===!1)throw new Error(`Payload identity key ${s} does not match expected re\
mote identity key ${t}`);if(!e)throw new Error("Remote static does not exist");const i=gp(e);if(!await s.verify(i,n.identitySig))
throw new Error("Invalid payload signature");return n}catch(n){throw new Ip(n.message)}}function gp(r){const e=br("noise\
-libp2p-static-key:");return r instanceof Uint8Array?Nc([e,r],e.length+r.length):(r.prepend(e),r)}class j5 extends Gp{stream;handshake;metrics;decoder;constructor(e,t,n){
super({log:e.log,inactivityTimeout:e.inactivityTimeout,maxReadBufferLength:e.maxReadBufferLength,direction:e.direction}),
this.stream=e,this.handshake=t,this.metrics=n,this.decoder=new Wp({lengthDecoder:Hi,maxBufferSize:16*1024*1024,encodingLength:()=>2});
const s=c=>{try{for(const l of this.decoder.decode(c.data))this.onData(this.decrypt(l))}catch(l){this.abort(l)}};this.stream.
addEventListener("message",s);const i=c=>{c.error!=null?c.local===!0?this.abort(c.error):this.onRemoteReset():this.onTransportClosed()};
this.stream.addEventListener("close",i);const o=()=>{this.safeDispatchEvent("drain")};this.stream.addEventListener("drai\
n",o);const a=()=>{this.onRemoteCloseWrite()};this.stream.addEventListener("remoteCloseWrite",a)}encrypt(e){const t=new H;
for(let n=0;n<e.byteLength;n+=Sf){let s=n+Sf;s>e.byteLength&&(s=e.byteLength);let i;e instanceof Uint8Array?i=this.handshake.
encrypt(e.subarray(n,s)):i=this.handshake.encrypt(e.sublist(n,s)),this.metrics?.encryptedPackets.increment(),t.append(zi(
i.byteLength)),t.append(i)}return t}decrypt(e){const t=new H;for(let n=0;n<e.byteLength;n+=es){let s=n+es;if(s>e.byteLength&&
(s=e.byteLength),s-kf<n)throw new Error("Invalid chunk");let i;e instanceof Uint8Array?i=e.subarray(n,s):i=e.sublist(n,s);
const o=e.subarray(n,s-kf);try{const a=this.handshake.decrypt(i,o);this.metrics?.decryptedPackets.increment(),t.append(a)}catch(a){
throw this.metrics?.decryptErrors.increment(),a}}return t}close(e){return this.stream.close(e)}sendPause(){this.stream.pause()}sendResume(){
this.stream.resume()}sendReset(e){this.stream.abort(e)}sendData(e){return{sentBytes:e.byteLength,canSendMore:this.stream.
send(this.encrypt(e))}}}function $f(r,e,t){return new j5(r,e,t)}async function G5(r,e){const{log:t,connection:n,crypto:s,
privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=r,u=await fp(i,a.publicKey,l),h=new hp({crypto:s,protocolName:"\
Noise_XX_25519_ChaChaPoly_SHA256",initiator:!0,prologue:o,s:a});ap(h.s,t),t.trace("Stage 0 - Initiator starting to send \
first message."),await n.write(h.writeMessageA(Ur),e),t.trace("Stage 0 - Initiator finished sending first message."),cp(
h.e,t),t.trace("Stage 1 - Initiator waiting to receive first message from responder...");const d=h.readMessageB(await n.
read(e));t.trace("Stage 1 - Initiator received the message."),lp(h.re,t),M5(h.rs,t),t.trace("Initiator going to check re\
mote's signature...");const b=await dp(d,h.rs,c);t.trace("All good with the signature!"),t.trace("Stage 2 - Initiator se\
nding third handshake message."),await n.write(h.writeMessageC(u),e),t.trace("Stage 2 - Initiator sent message with sign\
ed payload.");const[k,C]=h.ss.split();return up(k,C,t),{payload:b,encrypt:$=>k.encryptWithAd(Ur,$),decrypt:($,f)=>C.decryptWithAd(
Ur,$,f)}}async function W5(r,e){const{log:t,connection:n,crypto:s,privateKey:i,prologue:o,s:a,remoteIdentityKey:c,extensions:l}=r,
u=await fp(i,a.publicKey,l),h=new hp({crypto:s,protocolName:"Noise_XX_25519_ChaChaPoly_SHA256",initiator:!1,prologue:o,s:a});
ap(h.s,t),t.trace("Stage 0 - Responder waiting to receive first message."),h.readMessageA(await n.read(e)),t.trace("Stag\
e 0 - Responder received first message."),lp(h.re,t),t.trace("Stage 1 - Responder sending out first message with signed \
payload and static key."),await n.write(h.writeMessageB(u),e),t.trace("Stage 1 - Responder sent the second handshake mes\
sage with signed payload."),cp(h.e,t),t.trace("Stage 2 - Responder waiting for third handshake message...");const d=h.readMessageC(
await n.read(e));t.trace("Stage 2 - Responder received the message, finished handshake.");const b=await dp(d,h.rs,c),[k,
C]=h.ss.split();return up(k,C,t),{payload:b,encrypt:$=>C.encryptWithAd(Ur,$),decrypt:($,f)=>k.decryptWithAd(Ur,$,f)}}class q5{protocol="\
/noise";crypto;prologue;staticKey;extensions;metrics;components;log;constructor(e,t={}){const{staticNoiseKey:n,extensions:s,
crypto:i,prologueBytes:o}=t,{metrics:a}=e;this.components=e,this.log=e.logger.forComponent("libp2p:noise");const c=i??_5;
this.crypto=P5(c),this.extensions={webtransportCerthashes:[],...s},this.metrics=a?T5(a):void 0,n?this.staticKey=c.generateX25519KeyPairFromSeed(
n):this.staticKey=c.generateX25519KeyPair(),this.prologue=o??xe(0)}[Symbol.toStringTag]="@libp2p/noise";[Of]=["@libp2p/c\
onnection-encryption","@libp2p/noise"];async secureOutbound(e,t){const n=e.log?.newScope("noise")??this.log,s=zl(e,{lengthEncoder:zi,
lengthDecoder:Hi,maxDataLength:es}),i=await this.performHandshakeInitiator(s,this.components.privateKey,n,t?.remotePeer?.
publicKey,t),o=Mc(i.payload.identityKey);return{connection:$f(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,
remotePeer:Gl(o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}getStreamMuxer(e){
if(e==null||e.length===0)return;const t=this.components.upgrader.getStreamMuxers();if(t!=null)for(const n of e){const s=t.
get(n);if(s!=null)return s}if(e.length)throw new Bp("Early muxer negotiation was requested but the initiator and respond\
er had no common muxers")}async secureInbound(e,t){const n=e.log?.newScope("noise")??this.log,s=zl(e,{lengthEncoder:zi,lengthDecoder:Hi,
maxDataLength:es}),i=await this.performHandshakeResponder(s,this.components.privateKey,n,t?.remotePeer?.publicKey,t),o=Mc(
i.payload.identityKey);return{connection:$f(s.unwrap(),i,this.metrics),remoteExtensions:i.payload.extensions,remotePeer:Gl(
o),streamMuxer:t?.skipStreamMuxerNegotiation===!0?void 0:this.getStreamMuxer(i.payload.extensions?.streamMuxers)}}async performHandshakeInitiator(e,t,n,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await G5(
{connection:e,privateKey:t,remoteIdentityKey:s,log:n.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}async performHandshakeResponder(e,t,n,s,i){
let o;const a=i?.skipStreamMuxerNegotiation===!0?[]:[...this.components.upgrader.getStreamMuxers().keys()];try{o=await W5(
{connection:e,privateKey:t,remoteIdentityKey:s,log:n.newScope("xxhandshake"),crypto:this.crypto,prologue:this.prologue,s:this.
staticKey,extensions:{streamMuxers:a,webtransportCerthashes:[],...this.extensions}},i),this.metrics?.xxHandshakeSuccesses.
increment()}catch(c){throw this.metrics?.xxHandshakeErrors.increment(),c}return o}}function J5(r={}){return e=>new q5(e,
r)}const Cf=2*1024*1024,Ws=new WeakMap,_a=r=>Ff(String(r)).getComponents().filter(e=>e.name==="p2p").map(e=>e.value),X5=r=>{
const e=t=>({increment(n=1){const s=typeof n=="number"?n:n.global??0;r[t]=(r[t]||0)+s},decrement(n=1){r[t]=(r[t]||0)-n},
update(n){typeof n=="number"&&(r[t]=n)},reset(){r[t]=0}});return{traceFunction:(t,n)=>n,registerCounter:e,registerMetric:e,
registerMetricGroup:e}};class GU{constructor({store:e,relayAddresses:t=[],peerAddresses:n=[],trustedPeerIds:s=[],listen:i=[],
enableWebRTC:o=typeof window<"u",rtcConfiguration:a={iceServers:[]},allowInsecureLocalConnections:c=!1,maximumBlockBytes:l=Cf,
requestTimeoutMs:u=3e4}={}){if(!e?.getBlockstore||!e?.getDatastore)throw new TypeError("An ArtifactStore with borrowed b\
lockstore/datastore accessors is required");if(!Number.isSafeInteger(l)||l<=0||l>Cf)throw new RangeError("maximumBlockBy\
tes must be between 1 and 2097152");if(!Number.isSafeInteger(u)||u<=0)throw new RangeError("requestTimeoutMs must be a p\
ositive integer");this.store=e,this.relayAddresses=t.map(String),this.peerAddresses=n.map(String),this.trustedPeerIds=new Set(
s.map(String));for(const h of[...this.relayAddresses,...this.peerAddresses]){const d=_a(h);if(!d.length)throw new TypeError(
"Artifact peer addresses must include /p2p/<peer-id>");for(const b of d)this.trustedPeerIds.add(b)}this.configuredPeerIds=
new Set(this.trustedPeerIds),this.publicBlockCids=null,this.options={listen:[...i],enableWebRTC:o,allowInsecureLocalConnections:c,
rtcConfiguration:{iceServers:[],...structuredClone(a)},maximumBlockBytes:l,requestTimeoutMs:u},this.node=null,this.identityKey=
null,this.starting=null,this.stopping=null,this.releaseOwnership=null,this.shutdown=null,this.pendingReads=new Set,this.
receipts=new Map,this.counters={},this.readFailures=0,this.lastError=null}authorizePeer(e){const t=String(e);return _a(`\
/p2p/${t}`),this.trustedPeerIds.add(t),this}async revokePeer(e){const t=String(e);this.configuredPeerIds.has(t)||(this.trustedPeerIds.
delete(t),this.node?.status==="started"&&await Promise.allSettled(this.node.libp2p.getConnections().filter(n=>n.remotePeer.
toString()===t).map(n=>n.close())))}setPublicBlockCids(e){this.publicBlockCids=new Set([...e].map(t=>Mo.parse(String(t)).
toV1().toString()))}async signProviderRecord(e){if(this.node?.status!=="started")throw new Error("Artifact transport is \
not started");const t=this.identityKey;return{publicKey:qp(t.publicKey),signature:await t.sign(e)}}_servingBlockstore(){
const e=this.store.getBlockstore(),t=n=>this.publicBlockCids===null||this.publicBlockCids.has(Mo.parse(String(n)).toV1().
toString());return new Proxy(e,{get(n,s){if(s==="has")return async(o,a)=>t(o)&&n.has(o,a);if(s==="get")return async function*(o,a){
if(!t(o)){const c=new Error("Artifact block is not public");throw c.name="NotFoundError",c}yield*n.get(o,a)};const i=n[s];
return typeof i=="function"?i.bind(n):i}})}_connectionGater(){const e=t=>!this.trustedPeerIds.has(t.toString());return{denyDialPeer:e,
denyInboundEncryptedConnection:e,denyOutboundEncryptedConnection:e,denyInboundRelayedConnection:(t,n)=>e(t)||e(n),denyDialMultiaddr:t=>{
const n=t.toString(),s=_a(n);if(!s.length||s.some(a=>!this.trustedPeerIds.has(a)))return!0;if(!(n.includes("/ws")&&!n.includes(
"/wss")&&!n.includes("/tls")))return!1;const o=n.startsWith("/ip4/127.0.0.1/")||n.startsWith("/ip6/::1/");return!this.options.
allowInsecureLocalConnections||!o}}}async start(){if(this.stopping&&await this.stopping,this.requiresCleanup)throw new Error(
"Artifact transport cleanup must succeed before restarting");if(this.node?.status==="started")return this;if(this.starting)
return this.starting;this.starting=this._start();try{return await this.starting}finally{this.starting=null}}async _start(){
await this.store.open(),await this._acquireOwnership();try{return await this._startNode()}catch(e){this.lastError=e.message,
this.shutdown?.abort(e);try{await this._stopOwnedNode()}catch(t){throw new AggregateError([e,t],"Artifact transport star\
tup cleanup failed")}throw e}}get requiresCleanup(){return!!(this.releaseOwnership&&this.shutdown?.signal.aborted)}async _acquireOwnership(){
const e=()=>new Error("Artifact network is already active for this store in another tab or transport; local storage and \
inference remain available");if(this.store.persistent&&this.store.lockManager?.request){let s,i,o;const a=new Promise((u,h)=>{
s=u,i=h}),c=new Promise(u=>{o=u}),l=this.store.lockManager.request(`${this.store.lockName}:network-owner`,{mode:"exclusi\
ve",ifAvailable:!0},async u=>{if(!u){i(e());return}s(),await c});l.catch(i),await a,this.releaseOwnership=async()=>{o(),
await l};return}if(this.store.persistent&&!this.store.backend?.hasExclusiveLock)throw new Error("Persistent artifact net\
working requires an exclusive store ownership mechanism");const t=this.store.backend??this.store;if(Ws.has(t))throw e();
const n={};Ws.set(t,n),this.releaseOwnership=async()=>{Ws.get(t)===n&&Ws.delete(t)}}async _startNode(){this.identityKey=
await cy(this.store.getDatastore()),this.shutdown=new AbortController;const e=[Jp()],t=[...this.options.listen];this.options.
enableWebRTC&&(e.push(Xp(),Yp({rtcConfiguration:structuredClone(this.options.rtcConfiguration)})),t.push(...this.relayAddresses.
map(s=>`${s}/p2p-circuit`),"/webrtc"));const n=EE(K6(W4({blockstore:this._servingBlockstore(),datastore:this.store.getDatastore(),
metrics:X5(this.counters)}),{privateKey:this.identityKey,addresses:{listen:t},transports:e,connectionEncrypters:[J5()],streamMuxers:[
Zp()],services:{identify:Qp()},peerDiscovery:[],connectionGater:this._connectionGater()}),{maxInboundStreams:16,maxOutboundStreams:16,
messageSendConcurrency:4,maxIncomingMessageSize:4*1024*1024,maxOutgoingMessageSize:4*1024*1024});this.node=n,await n.start();
for(const s of this.peerAddresses)await this.dial(s);return this}async _stopOwnedNode(){this.node&&await this.node.stop(),
this.node=null,this.identityKey=null,await this.releaseOwnership?.(),this.releaseOwnership=null}async stop(){if(this.stopping)
return this.stopping;this.stopping=(async()=>(this.starting&&await this.starting.catch(()=>{}),this.shutdown?.abort(new Error(
"Artifact transport stopped")),await Promise.allSettled([...this.pendingReads]),await this._stopOwnedNode(),this))();try{
return await this.stopping}finally{this.stopping=null}}async dial(e,{signal:t}={}){if(this.node?.status!=="started")throw new Error(
"Artifact transport is not started");const n=(Array.isArray(e)?e:[e]).map(i=>Ff(String(i)));for(const i of n)if(this._connectionGater().
denyDialMultiaddr(i))throw new Error(`Artifact address is not explicitly trusted: ${i}`);const s=await this.node.libp2p.
dial(n,{signal:AbortSignal.any([this.shutdown.signal,t||AbortSignal.timeout(this.options.requestTimeoutMs)])});return s.
remoteAddr.toString().includes("/webrtc/")&&await Promise.allSettled(this.node.libp2p.getConnections().filter(i=>i!==s&&
i.remotePeer.equals(s.remotePeer)&&i.remoteAddr.toString().includes("/p2p-circuit/p2p/")).map(i=>i.close())),s}async fetchBlock(e,{
signal:t}={}){if(this.node?.status!=="started")throw new Error("Artifact transport is not started");const n=Mo.parse(String(
e)),s=n.toV1().toString(),i=this.receipts.get(s)||{readers:0,counted:!1};i.readers++,this.receipts.set(s,i);const o=this.
_fetchBlock(n,t,i);this.pendingReads.add(o);try{return await o}finally{this.pendingReads.delete(o),--i.readers===0&&this.
receipts.delete(s)}}async _fetchBlock(e,t,n){const s=AbortSignal.any([this.shutdown.signal,AbortSignal.timeout(this.options.
requestTimeoutMs),...t?[t]:[]]);try{const i=[];let o=0,a=!1;const c=this.store.getBlockstore(),l=await c.has(e,{signal:s})?
c.get(e,{signal:s}):this.node.blockstore.get(e,{signal:s,onProgress:d=>{d.type==="helia:block-broker:receive-block"&&(a=
!0)}});for await(const d of l){if(o+=d.byteLength,o>this.options.maximumBlockBytes)throw new RangeError("Artifact block \
exceeds maximumBlockBytes");i.push(d)}const u=new Uint8Array(o);let h=0;for(const d of i)u.set(d,h),h+=d.byteLength;return a&&
!n.counted&&(n.counted=!0,this.counters.receivedBlockBytes=(this.counters.receivedBlockBytes||0)+o,this.counters.receivedBlocks=
(this.counters.receivedBlocks||0)+1),u}catch(i){throw this.readFailures++,this.lastError=i.message,i}}getPeerInfo(){return{
peerId:this.node?.status==="started"?this.node.libp2p.peerId.toString():null,addresses:this.node?.status==="started"?this.
node.libp2p.getMultiaddrs().map(String):[]}}getStats(){return{...this.getPeerInfo(),status:this.node?.status||"stopped",
connectedPeers:this.node?.status==="started"?[...new Set(this.node.libp2p.getConnections().map(e=>e.remotePeer.toString()))]:
[],receivedBlockBytes:this.counters.receivedBlockBytes||0,receivedBlocks:this.counters.receivedBlocks||0,sentBlockBytes:this.
counters.helia_bitswap_sent_data_bytes_total||0,sentBlocks:this.counters.helia_bitswap_sent_blocks_total||0,pendingReads:this.
pendingReads.size,readFailures:this.readFailures,lastError:this.lastError,routing:"explicit-peers",publicGateways:!1}}}export{GU as IpfsArtifactTransport};
