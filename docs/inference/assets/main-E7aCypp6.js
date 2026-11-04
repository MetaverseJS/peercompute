const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-DCHUNVb2.js","./GgufArtifactReader-BWI4Vm0C.js","./runtimeDefinition-B0QVSqJZ.js","./index-CK5Gf9HD.js","./modelTask-CAEnClWW.js","./runtimeDefinition-C9GfZLDf.js","./ModelInferenceService-Cy85NOYH.js","./NetworkManager-CDWa-HJw.js"])))=>i.map(i=>d[i]);
import{_ as kt}from"./index-CK5Gf9HD.js";const zt=()=>new Map,cl=r=>{const e=zt();return r.forEach((t,n)=>{e.set(n,t)}),
e},rn=(r,e,t)=>{let n=r.get(e);return n===void 0&&r.set(e,n=t()),n},jy=(r,e)=>{const t=[];for(const[n,s]of r)t.push(e(s,
n));return t},Gy=(r,e)=>{for(const[t,n]of r)if(e(n,t))return!0;return!1},Hn=()=>new Set,Za=r=>r[r.length-1],Wy=(r,e)=>{for(let t=0;t<
e.length;t++)r.push(e[t])},Xr=Array.from,fu=(r,e)=>{for(let t=0;t<r.length;t++)if(!e(r[t],t,r))return!1;return!0},Gp=(r,e)=>{
for(let t=0;t<r.length;t++)if(e(r[t],t,r))return!0;return!1},Vy=(r,e)=>{const t=new Array(r);for(let n=0;n<r;n++)t[n]=e(
n,t);return t},ga=Array.isArray;class pu{constructor(){this._observers=zt()}on(e,t){rn(this._observers,e,Hn).add(t)}once(e,t){
const n=(...s)=>{this.off(e,n),t(...s)};this.on(e,n)}off(e,t){const n=this._observers.get(e);n!==void 0&&(n.delete(t),n.
size===0&&this._observers.delete(e))}emit(e,t){return Xr((this._observers.get(e)||zt()).values()).forEach(n=>n(...t))}destroy(){
this._observers=zt()}}const Zt=Math.floor,no=Math.abs,Wp=(r,e)=>r<e?r:e,yn=(r,e)=>r>e?r:e,Vp=r=>r!==0?r<0:1/r<0,Dd=1,Pd=2,
ec=4,tc=8,Qs=32,br=64,Et=128,ba=31,ll=63,an=127,Hy=2147483647,So=Number.MAX_SAFE_INTEGER,$d=Number.MIN_SAFE_INTEGER,Ky=Number.
isInteger||(r=>typeof r=="number"&&isFinite(r)&&Zt(r)===r),Qy=String.fromCharCode,Jy=r=>r.toLowerCase(),Xy=/^\s*/g,Yy=r=>r.
replace(Xy,""),Zy=/([A-Z])/g,Nd=(r,e)=>Yy(r.replace(Zy,t=>`${e}${Jy(t)}`)),ew=r=>{const e=unescape(encodeURIComponent(r)),
t=e.length,n=new Uint8Array(t);for(let s=0;s<t;s++)n[s]=e.codePointAt(s);return n},Js=typeof TextEncoder<"u"?new TextEncoder:
null,tw=r=>Js.encode(r),rw=Js?tw:ew;let qs=typeof TextDecoder>"u"?null:new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});
qs&&qs.decode(new Uint8Array).length===1&&(qs=null);const nw=(r,e)=>Vy(e,()=>r).join("");let yi=class{constructor(){this.
cpos=0,this.cbuf=new Uint8Array(100),this.bufs=[]}};const ya=()=>new yi,sw=r=>{let e=r.cpos;for(let t=0;t<r.bufs.length;t++)
e+=r.bufs[t].length;return e},Yt=r=>{const e=new Uint8Array(sw(r));let t=0;for(let n=0;n<r.bufs.length;n++){const s=r.bufs[n];
e.set(s,t),t+=s.length}return e.set(new Uint8Array(r.cbuf.buffer,0,r.cpos),t),e},iw=(r,e)=>{const t=r.cbuf.length;t-r.cpos<
e&&(r.bufs.push(new Uint8Array(r.cbuf.buffer,0,r.cpos)),r.cbuf=new Uint8Array(yn(t,e)*2),r.cpos=0)},Me=(r,e)=>{const t=r.
cbuf.length;r.cpos===t&&(r.bufs.push(r.cbuf),r.cbuf=new Uint8Array(t*2),r.cpos=0),r.cbuf[r.cpos++]=e},ul=Me,re=(r,e)=>{for(;e>
an;)Me(r,Et|an&e),e=Zt(e/128);Me(r,an&e)},mu=(r,e)=>{const t=Vp(e);for(t&&(e=-e),Me(r,(e>ll?Et:0)|(t?br:0)|ll&e),e=Zt(e/
64);e>0;)Me(r,(e>an?Et:0)|an&e),e=Zt(e/128)},dl=new Uint8Array(3e4),ow=dl.length/3,aw=(r,e)=>{if(e.length<ow){const t=Js.
encodeInto(e,dl).written||0;re(r,t);for(let n=0;n<t;n++)Me(r,dl[n])}else mt(r,rw(e))},cw=(r,e)=>{const t=unescape(encodeURIComponent(
e)),n=t.length;re(r,n);for(let s=0;s<n;s++)Me(r,t.codePointAt(s))},$n=Js&&Js.encodeInto?aw:cw,wa=(r,e)=>{const t=r.cbuf.
length,n=r.cpos,s=Wp(t-n,e.length),i=e.length-s;r.cbuf.set(e.subarray(0,s),n),r.cpos+=s,i>0&&(r.bufs.push(r.cbuf),r.cbuf=
new Uint8Array(yn(t*2,i)),r.cbuf.set(e.subarray(s)),r.cpos=i)},mt=(r,e)=>{re(r,e.byteLength),wa(r,e)},gu=(r,e)=>{iw(r,e);
const t=new DataView(r.cbuf.buffer,r.cpos,e);return r.cpos+=e,t},lw=(r,e)=>gu(r,4).setFloat32(0,e,!1),uw=(r,e)=>gu(r,8).
setFloat64(0,e,!1),dw=(r,e)=>gu(r,8).setBigInt64(0,e,!1),Ud=new DataView(new ArrayBuffer(4)),hw=r=>(Ud.setFloat32(0,r),Ud.
getFloat32(0)===r),Xs=(r,e)=>{switch(typeof e){case"string":Me(r,119),$n(r,e);break;case"number":Ky(e)&&no(e)<=Hy?(Me(r,
125),mu(r,e)):hw(e)?(Me(r,124),lw(r,e)):(Me(r,123),uw(r,e));break;case"bigint":Me(r,122),dw(r,e);break;case"object":if(e===
null)Me(r,126);else if(ga(e)){Me(r,117),re(r,e.length);for(let t=0;t<e.length;t++)Xs(r,e[t])}else if(e instanceof Uint8Array)
Me(r,116),mt(r,e);else{Me(r,118);const t=Object.keys(e);re(r,t.length);for(let n=0;n<t.length;n++){const s=t[n];$n(r,s),
Xs(r,e[s])}}break;case"boolean":Me(r,e?120:121);break;default:Me(r,127)}};class Fd extends yi{constructor(e){super(),this.
w=e,this.s=null,this.count=0}write(e){this.s===e?this.count++:(this.count>0&&re(this,this.count-1),this.count=1,this.w(this,
e),this.s=e)}}const Od=r=>{r.count>0&&(mu(r.encoder,r.count===1?r.s:-r.s),r.count>1&&re(r.encoder,r.count-2))};class so{constructor(){
this.encoder=new yi,this.s=0,this.count=0}write(e){this.s===e?this.count++:(Od(this),this.count=1,this.s=e)}toUint8Array(){
return Od(this),Yt(this.encoder)}}const zd=r=>{if(r.count>0){const e=r.diff*2+(r.count===1?0:1);mu(r.encoder,e),r.count>
1&&re(r.encoder,r.count-2)}};class rc{constructor(){this.encoder=new yi,this.s=0,this.count=0,this.diff=0}write(e){this.
diff===e-this.s?(this.s=e,this.count++):(zd(this),this.count=1,this.diff=e-this.s,this.s=e)}toUint8Array(){return zd(this),
Yt(this.encoder)}}class fw{constructor(){this.sarr=[],this.s="",this.lensE=new so}write(e){this.s+=e,this.s.length>19&&(this.
sarr.push(this.s),this.s=""),this.lensE.write(e.length)}toUint8Array(){const e=new yi;return this.sarr.push(this.s),this.
s="",$n(e,this.sarr.join("")),wa(e,this.lensE.toUint8Array()),Yt(e)}}const kr=r=>new Error(r),qt=()=>{throw kr("Method u\
nimplemented")},Dt=()=>{throw kr("Unexpected case")},Hp=kr("Unexpected end of array"),Kp=kr("Integer out of Range");let ka=class{constructor(e){
this.arr=e,this.pos=0}};const rs=r=>new ka(r),pw=r=>r.pos!==r.arr.length,mw=(r,e)=>{const t=new Uint8Array(r.arr.buffer,
r.pos+r.arr.byteOffset,e);return r.pos+=e,t},gt=r=>mw(r,ee(r)),Kn=r=>r.arr[r.pos++],ee=r=>{let e=0,t=1;const n=r.arr.length;
for(;r.pos<n;){const s=r.arr[r.pos++];if(e=e+(s&an)*t,t*=128,s<Et)return e;if(e>So)throw Kp}throw Hp},bu=r=>{let e=r.arr[r.
pos++],t=e&ll,n=64;const s=(e&br)>0?-1:1;if((e&Et)===0)return s*t;const i=r.arr.length;for(;r.pos<i;){if(e=r.arr[r.pos++],
t=t+(e&an)*n,n*=128,e<Et)return s*t;if(t>So)throw Kp}throw Hp},gw=r=>{let e=ee(r);if(e===0)return"";{let t=String.fromCodePoint(
Kn(r));if(--e<100)for(;e--;)t+=String.fromCodePoint(Kn(r));else for(;e>0;){const n=e<1e4?e:1e4,s=r.arr.subarray(r.pos,r.
pos+n);r.pos+=n,t+=String.fromCodePoint.apply(null,s),e-=n}return decodeURIComponent(escape(t))}},bw=r=>qs.decode(gt(r)),
Nn=qs?bw:gw,yu=(r,e)=>{const t=new DataView(r.arr.buffer,r.arr.byteOffset+r.pos,e);return r.pos+=e,t},yw=r=>yu(r,4).getFloat32(
0,!1),ww=r=>yu(r,8).getFloat64(0,!1),kw=r=>yu(r,8).getBigInt64(0,!1),Ew=[r=>{},r=>null,bu,yw,ww,kw,r=>!1,r=>!0,Nn,r=>{const e=ee(
r),t={};for(let n=0;n<e;n++){const s=Nn(r);t[s]=Ys(r)}return t},r=>{const e=ee(r),t=[];for(let n=0;n<e;n++)t.push(Ys(r));
return t},gt],Ys=r=>Ew[127-Kn(r)](r);class qd extends ka{constructor(e,t){super(e),this.reader=t,this.s=null,this.count=
0}read(){return this.count===0&&(this.s=this.reader(this),pw(this)?this.count=ee(this)+1:this.count=-1),this.count--,this.
s}}class io extends ka{constructor(e){super(e),this.s=0,this.count=0}read(){if(this.count===0){this.s=bu(this);const e=Vp(
this.s);this.count=1,e&&(this.s=-this.s,this.count=ee(this)+2)}return this.count--,this.s}}class nc extends ka{constructor(e){
super(e),this.s=0,this.count=0,this.diff=0}read(){if(this.count===0){const e=bu(this),t=e&1;this.diff=Zt(e/2),this.count=
1,t&&(this.count=ee(this)+2)}return this.s+=this.diff,this.count--,this.s}}class xw{constructor(e){this.decoder=new io(e),
this.str=Nn(this.decoder),this.spos=0}read(){const e=this.spos+this.decoder.read(),t=this.str.slice(this.spos,e);return this.
spos=e,t}}const Sw=crypto.getRandomValues.bind(crypto),Qp=()=>Sw(new Uint32Array(1))[0],vw="10000000-1000-4000-8000"+-1e11,
Aw=()=>vw.replace(/[018]/g,r=>(r^Qp()&15>>r/4).toString(16)),Qn=r=>new Promise(r);Promise.all.bind(Promise);const jd=r=>r===
void 0?null:r;class _w{constructor(){this.map=new Map}setItem(e,t){this.map.set(e,t)}getItem(e){return this.map.get(e)}}
let Jp=new _w,Iw=!0;try{typeof localStorage<"u"&&localStorage&&(Jp=localStorage,Iw=!1)}catch{}const Cw=Jp,Zs=Symbol("Equ\
ality"),Xp=(r,e)=>r===e||!!r?.[Zs]?.(e)||!1,Tw=r=>typeof r=="object",Mw=Object.assign,Rw=Object.keys,vo=r=>Rw(r).length,
Bw=r=>{for(const e in r)return!1;return!0},wi=(r,e)=>{for(const t in r)if(!e(r[t],t))return!1;return!0},wu=(r,e)=>Object.
prototype.hasOwnProperty.call(r,e),Lw=(r,e)=>r===e||vo(r)===vo(e)&&wi(r,(t,n)=>(t!==void 0||wu(e,n))&&Xp(e[n],t)),ku=(r,e,t=0)=>{
try{for(;t<r.length;t++)r[t](...e)}finally{t<r.length&&ku(r,e,t+1)}},oo=(r,e)=>{if(r===e)return!0;if(r==null||e==null||r.
constructor!==e.constructor&&(r.constructor||Object)!==(e.constructor||Object))return!1;if(r[Zs]!=null)return r[Zs](e);switch(r.
constructor){case ArrayBuffer:r=new Uint8Array(r),e=new Uint8Array(e);case Uint8Array:{if(r.byteLength!==e.byteLength)return!1;
for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;break}case Set:{if(r.size!==e.size)return!1;for(const t of r)if(!e.has(
t))return!1;break}case Map:{if(r.size!==e.size)return!1;for(const t of r.keys())if(!e.has(t)||!oo(r.get(t),e.get(t)))return!1;
break}case void 0:case Object:if(vo(r)!==vo(e))return!1;for(const t in r)if(!wu(r,t)||!oo(r[t],e[t]))return!1;break;case Array:
if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(!oo(r[t],e[t]))return!1;break;default:return!1}return!0},Dw=(r,e)=>e.
includes(r);var Yp={};const ei=typeof process<"u"&&process.release&&/node|io\.js/.test(process.release.name)&&Object.prototype.
toString.call(typeof process<"u"?process:0)==="[object process]";let Ht;const Pw=()=>{if(Ht===void 0)if(ei){Ht=zt();const r=process.
argv;let e=null;for(let t=0;t<r.length;t++){const n=r[t];n[0]==="-"?(e!==null&&Ht.set(e,""),e=n):e!==null&&(Ht.set(e,n),
e=null)}e!==null&&Ht.set(e,"")}else typeof location=="object"?(Ht=zt(),(location.search||"?").slice(1).split("&").forEach(
r=>{if(r.length!==0){const[e,t]=r.split("=");Ht.set(`--${Nd(e,"-")}`,t),Ht.set(`-${Nd(e,"-")}`,t)}})):Ht=zt();return Ht},
hl=r=>Pw().has(r),fl=r=>jd(ei?Yp[r.toUpperCase().replaceAll("-","_")]:Cw.getItem(r)),Zp=r=>hl("--"+r)||fl(r)!==null,$w=Zp(
"production"),Nw=ei&&Dw(Yp.FORCE_COLOR,["true","1","2"]),Uw=Nw||!hl("--no-colors")&&!Zp("no-color")&&(!ei||process.stdout.
isTTY)&&(!ei||hl("--color")||fl("COLORTERM")!==null||(fl("TERM")||"").includes("color")),Fw=r=>new Uint8Array(r),Ow=r=>{
const e=Fw(r.byteLength);return e.set(r),e};class zw{constructor(e,t){this.left=e,this.right=t}}const lr=(r,e)=>new zw(r,
e),Gd=r=>r.next()>=.5,sc=(r,e,t)=>Zt(r.next()*(t+1-e)+e),em=(r,e,t)=>Zt(r.next()*(t+1-e)+e),Eu=(r,e,t)=>em(r,e,t),qw=r=>Qy(
Eu(r,97,122)),jw=(r,e=0,t=20)=>{const n=Eu(r,e,t);let s="";for(let i=0;i<n;i++)s+=qw(r);return s},ic=(r,e)=>e[Eu(r,0,e.length-
1)],Gw=Symbol("0schema");class Ww{constructor(){this._rerrs=[]}extend(e,t,n,s=null){this._rerrs.push({path:e,expected:t,
has:n,message:s})}toString(){const e=[];for(let t=this._rerrs.length-1;t>0;t--){const n=this._rerrs[t];e.push(nw(" ",(this.
_rerrs.length-t)*2)+`${n.path!=null?`[${n.path}] `:""}${n.has} doesn't match ${n.expected}. ${n.message}`)}return e.join(
`
`)}}const pl=(r,e)=>r===e?!0:r==null||e==null||r.constructor!==e.constructor?!1:r[Zs]?Xp(r,e):ga(r)?fu(r,t=>Gp(e,n=>pl(t,
n))):Tw(r)?wi(r,(t,n)=>pl(t,e[n])):!1;class st{static _dilutes=!1;extends(e){let[t,n]=[this.shape,e.shape];return this.constructor.
_dilutes&&([n,t]=[t,n]),pl(t,n)}equals(e){return this.constructor===e.constructor&&oo(this.shape,e.shape)}[Gw](){return!0}[Zs](e){
return this.equals(e)}validate(e){return this.check(e)}check(e,t){qt()}get nullable(){return ns(this,Aa)}get optional(){
return new nm(this)}cast(e){return Wd(e,this),e}expect(e){return Wd(e,this),e}}class xu extends st{constructor(e,t){super(),
this.shape=e,this._c=t}check(e,t=void 0){const n=e?.constructor===this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name,e?.constructor!==this.shape?"Constructor match failed":"Check failed"),n}}const ve=(r,e=null)=>new xu(
r,e);ve(xu);class Su extends st{constructor(e){super(),this.shape=e}check(e,t){const n=this.shape(e);return!n&&t?.extend(
null,"custom prop",e?.constructor.name,"failed to check custom prop"),n}}const Le=r=>new Su(r);ve(Su);class Ea extends st{constructor(e){
super(),this.shape=e}check(e,t){const n=this.shape.some(s=>s===e);return!n&&t?.extend(null,this.shape.join(" | "),e.toString()),
n}}const xa=(...r)=>new Ea(r),tm=ve(Ea),Vw=RegExp.escape||(r=>r.replace(/[().|&,$^[\]]/g,e=>"\\"+e)),rm=r=>{if(Jn.check(
r))return[Vw(r)];if(tm.check(r))return r.shape.map(e=>e+"");if(hm.check(r))return["[+-]?\\d+.?\\d*"];if(fm.check(r))return[
".*"];if(Ao.check(r))return r.shape.map(rm).flat(1);Dt()};class Hw extends st{constructor(e){super(),this.shape=e,this._r=
new RegExp("^"+e.map(rm).map(t=>`(${t.join("|")})`).join("")+"$")}check(e,t){const n=this._r.exec(e)!=null;return!n&&t?.
extend(null,this._r.toString(),e.toString(),"String doesn't match string template."),n}}ve(Hw);const Kw=Symbol("optional");
class nm extends st{constructor(e){super(),this.shape=e}check(e,t){const n=e===void 0||this.shape.check(e);return!n&&t?.
extend(null,"undefined (optional)","()"),n}get[Kw](){return!0}}const Qw=ve(nm);class Jw extends st{check(e,t){return t?.
extend(null,"never",typeof e),!1}}ve(Jw);class Sa extends st{constructor(e,t=!1){super(),this.shape=e,this._isPartial=t}static _dilutes=!0;get partial(){
return new Sa(this.shape,!0)}check(e,t){return e==null?(t?.extend(null,"object","null"),!1):wi(this.shape,(n,s)=>{const i=this.
_isPartial&&!wu(e,s)||n.check(e[s],t);return!i&&t?.extend(s.toString(),n.toString(),typeof e[s],"Object property does no\
t match"),i})}}const Xw=r=>new Sa(r),Yw=ve(Sa),Zw=Le(r=>r!=null&&(r.constructor===Object||r.constructor==null));class sm extends st{constructor(e,t){
super(),this.shape={keys:e,values:t}}check(e,t){return e!=null&&wi(e,(n,s)=>{const i=this.shape.keys.check(s,t);return!i&&
t?.extend(s+"","Record",typeof e,i?"Key doesn't match schema":"Value doesn't match value"),i&&this.shape.values.check(n,
t)})}}const im=(r,e)=>new sm(r,e),e0=ve(sm);class om extends st{constructor(e){super(),this.shape=e}check(e,t){return e!=
null&&wi(this.shape,(n,s)=>{const i=n.check(e[s],t);return!i&&t?.extend(s.toString(),"Tuple",typeof n),i})}}const t0=(...r)=>new om(
r);ve(om);class am extends st{constructor(e){super(),this.shape=e.length===1?e[0]:new vu(e)}check(e,t){const n=ga(e)&&fu(
e,s=>this.shape.check(s));return!n&&t?.extend(null,"Array",""),n}}const cm=(...r)=>new am(r),r0=ve(am),n0=Le(r=>ga(r));class lm extends st{constructor(e,t){
super(),this.shape=e,this._c=t}check(e,t){const n=e instanceof this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name),n}}const s0=(r,e=null)=>new lm(r,e);ve(lm);const i0=s0(st);class o0 extends st{constructor(e){
super(),this.len=e.length-1,this.args=t0(...e.slice(-1)),this.res=e[this.len]}check(e,t){const n=e.constructor===Function&&
e.length<=this.len;return!n&&t?.extend(null,"function",typeof e),n}}const a0=ve(o0),c0=Le(r=>typeof r=="function");class l0 extends st{constructor(e){
super(),this.shape=e}check(e,t){const n=fu(this.shape,s=>s.check(e,t));return!n&&t?.extend(null,"Intersectinon",typeof e),
n}}ve(l0,r=>r.shape.length>0);class vu extends st{static _dilutes=!0;constructor(e){super(),this.shape=e}check(e,t){const n=Gp(
this.shape,s=>s.check(e,t));return t?.extend(null,"Union",typeof e),n}}const ns=(...r)=>r.findIndex(e=>Ao.check(e))>=0?ns(
...r.map(e=>ti(e)).map(e=>Ao.check(e)?e.shape:[e]).flat(1)):r.length===1?r[0]:new vu(r),Ao=ve(vu),um=()=>!0,_o=Le(um),u0=ve(
Su,r=>r.shape===um),Au=Le(r=>typeof r=="bigint"),d0=Le(r=>r===Au),dm=Le(r=>typeof r=="symbol");Le(r=>r===dm);const Un=Le(
r=>typeof r=="number"),hm=Le(r=>r===Un),Jn=Le(r=>typeof r=="string"),fm=Le(r=>r===Jn),va=Le(r=>typeof r=="boolean"),h0=Le(
r=>r===va),pm=xa(void 0);ve(Ea,r=>r.shape.length===1&&r.shape[0]===void 0);xa(void 0);const Aa=xa(null),f0=ve(Ea,r=>r.shape.
length===1&&r.shape[0]===null);ve(Uint8Array);ve(xu,r=>r.shape===Uint8Array);const p0=ns(Un,Jn,Aa,pm,Au,va,dm);(()=>{const r=cm(
_o),e=im(Jn,_o),t=ns(Un,Jn,Aa,va,r,e);return r.shape=t,e.shape.values=t,t})();const ti=r=>{if(i0.check(r))return r;if(Zw.
check(r)){const e={};for(const t in r)e[t]=ti(r[t]);return Xw(e)}else{if(n0.check(r))return ns(...r.map(ti));if(p0.check(
r))return xa(r);if(c0.check(r))return ve(r)}Dt()},Wd=$w?()=>{}:(r,e)=>{const t=new Ww;if(!e.check(r,t))throw kr(`Expecte\
d value to be of type ${e.constructor.name}.
${t.toString()}`)};class m0{constructor(e){this.patterns=[],this.$state=e}if(e,t){return this.patterns.push({if:ti(e),h:t}),
this}else(e){return this.if(_o,e)}done(){return(e,t)=>{for(let n=0;n<this.patterns.length;n++){const s=this.patterns[n];
if(s.if.check(e))return s.h(e,t)}throw kr("Unhandled pattern")}}}const g0=r=>new m0(r),mm=g0(_o).if(hm,(r,e)=>sc(e,$d,So)).
if(fm,(r,e)=>jw(e)).if(h0,(r,e)=>Gd(e)).if(d0,(r,e)=>BigInt(sc(e,$d,So))).if(Ao,(r,e)=>Cn(e,ic(e,r.shape))).if(Yw,(r,e)=>{
const t={};for(const n in r.shape){let s=r.shape[n];if(Qw.check(s)){if(Gd(e))continue;s=s.shape}t[n]=mm(s,e)}return t}).
if(r0,(r,e)=>{const t=[],n=em(e,0,42);for(let s=0;s<n;s++)t.push(Cn(e,r.shape));return t}).if(tm,(r,e)=>ic(e,r.shape)).if(
f0,(r,e)=>null).if(a0,(r,e)=>{const t=Cn(e,r.res);return()=>t}).if(u0,(r,e)=>Cn(e,ic(e,[Un,Jn,Aa,pm,Au,va,cm(Un),im(ns("\
a","b","c"),Un)]))).if(e0,(r,e)=>{const t={},n=sc(e,0,3);for(let s=0;s<n;s++){const i=Cn(e,r.shape.keys),o=Cn(e,r.shape.
values);t[i]=o}return t}).done(),Cn=(r,e)=>mm(ti(e),r),_a=typeof document<"u"?document:{};Le(r=>r.nodeType===E0);typeof DOMParser<
"u"&&new DOMParser;Le(r=>r.nodeType===y0);Le(r=>r.nodeType===w0);const b0=r=>jy(r,(e,t)=>`${t}:${e};`).join(""),y0=_a.ELEMENT_NODE,
w0=_a.TEXT_NODE,k0=_a.DOCUMENT_NODE,E0=_a.DOCUMENT_FRAGMENT_NODE;Le(r=>r.nodeType===k0);const Er=Symbol,gm=Er(),bm=Er(),
x0=Er(),S0=Er(),v0=Er(),ym=Er(),A0=Er(),wm=Er(),_0=Er(),I0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],
t=[];let n=0;for(;n<r.length;n++){const s=r[n];if(s===void 0)break;if(s.constructor===String||s.constructor===Number)e.push(
s);else if(s.constructor===Object)break}for(n>0&&t.push(e.join(""));n<r.length;n++){const s=r[n];s instanceof Symbol||t.
push(s)}return t},C0={[gm]:lr("font-weight","bold"),[bm]:lr("font-weight","normal"),[x0]:lr("color","blue"),[v0]:lr("col\
or","green"),[S0]:lr("color","grey"),[ym]:lr("color","red"),[A0]:lr("color","purple"),[wm]:lr("color","orange"),[_0]:lr(
"color","black")},T0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],t=[],n=zt();let s=[],i=0;for(;i<
r.length;i++){const o=r[i],a=C0[o];if(a!==void 0)n.set(a.left,a.right);else{if(o===void 0)break;if(o.constructor===String||
o.constructor===Number){const c=b0(n);i>0||c.length>0?(e.push("%c"+o),t.push(c)):e.push(o)}else break}}for(i>0&&(s=t,s.unshift(
e.join("")));i<r.length;i++){const o=r[i];o instanceof Symbol||s.push(o)}return s},M0=Uw?T0:I0,R0=(...r)=>{console.log(...M0(
r)),B0.forEach(e=>e.print(r))},B0=Hn(),km=r=>({[Symbol.iterator](){return this},next:r}),L0=(r,e)=>km(()=>{let t;do t=r.
next();while(!t.done&&!e(t.value));return t}),oc=(r,e)=>km(()=>{const{done:t,value:n}=r.next();return{done:t,value:t?void 0:
e(n)}});class _u{constructor(e,t){this.clock=e,this.len=t}}class ki{constructor(){this.clients=new Map}}const ml=(r,e,t)=>e.
clients.forEach((n,s)=>{const i=r.doc.store.clients.get(s);for(let o=0;o<n.length;o++){const a=n[o];Lm(r,i,a.clock,a.len,
t)}}),D0=(r,e)=>{let t=0,n=r.length-1;for(;t<=n;){const s=Zt((t+n)/2),i=r[s],o=i.clock;if(o<=e){if(e<o+i.len)return s;t=
s+1}else n=s-1}return null},Em=(r,e)=>{const t=r.clients.get(e.client);return t!==void 0&&D0(t,e.clock)!==null},Iu=r=>{r.
clients.forEach(e=>{e.sort((s,i)=>s.clock-i.clock);let t,n;for(t=1,n=1;t<e.length;t++){const s=e[n-1],i=e[t];s.clock+s.len>=
i.clock?s.len=yn(s.len,i.clock+i.len-s.clock):(n<t&&(e[n]=i),n++)}e.length=n})},P0=r=>{const e=new ki;for(let t=0;t<r.length;t++)
r[t].clients.forEach((n,s)=>{if(!e.clients.has(s)){const i=n.slice();for(let o=t+1;o<r.length;o++)Wy(i,r[o].clients.get(
s)||[]);e.clients.set(s,i)}});return Iu(e),e},Io=(r,e,t,n)=>{rn(r.clients,e,()=>[]).push(new _u(t,n))},$0=()=>new ki,N0=r=>{
const e=$0();return r.clients.forEach((t,n)=>{const s=[];for(let i=0;i<t.length;i++){const o=t[i];if(o.deleted){const a=o.
id.clock;let c=o.length;if(i+1<t.length)for(let l=t[i+1];i+1<t.length&&l.deleted;l=t[++i+1])c+=l.length;s.push(new _u(a,
c))}}s.length>0&&e.clients.set(n,s)}),e},ss=(r,e)=>{re(r.restEncoder,e.clients.size),Xr(e.clients.entries()).sort((t,n)=>n[0]-
t[0]).forEach(([t,n])=>{r.resetDsCurVal(),re(r.restEncoder,t);const s=n.length;re(r.restEncoder,s);for(let i=0;i<s;i++){
const o=n[i];r.writeDsClock(o.clock),r.writeDsLen(o.len)}})},Cu=r=>{const e=new ki,t=ee(r.restDecoder);for(let n=0;n<t;n++){
r.resetDsCurVal();const s=ee(r.restDecoder),i=ee(r.restDecoder);if(i>0){const o=rn(e.clients,s,()=>[]);for(let a=0;a<i;a++)
o.push(new _u(r.readDsClock(),r.readDsLen()))}}return e},Vd=(r,e,t)=>{const n=new ki,s=ee(r.restDecoder);for(let i=0;i<s;i++){
r.resetDsCurVal();const o=ee(r.restDecoder),a=ee(r.restDecoder),c=t.clients.get(o)||[],l=Re(t,o);for(let u=0;u<a;u++){const d=r.
readDsClock(),h=d+r.readDsLen();if(d<l){l<h&&Io(n,o,l,h-l);let p=er(c,d),g=c[p];for(!g.deleted&&g.id.clock<d&&(c.splice(
p+1,0,Po(e,g,d-g.id.clock)),p++);p<c.length&&(g=c[p++],g.id.clock<h);)g.deleted||(h<g.id.clock+g.length&&c.splice(p,0,Po(
e,g,h-g.id.clock)),g.delete(e))}else Io(n,o,d,h-d)}}if(n.clients.size>0){const i=new dn;return re(i.restEncoder,0),ss(i,
n),i.toUint8Array()}return null},xm=Qp;class is extends pu{constructor({guid:e=Aw(),collectionid:t=null,gc:n=!0,gcFilter:s=()=>!0,
meta:i=null,autoLoad:o=!1,shouldLoad:a=!0}={}){super(),this.gc=n,this.gcFilter=s,this.clientID=xm(),this.guid=e,this.collectionid=
t,this.share=new Map,this.store=new Rm,this._transaction=null,this._transactionCleanups=[],this.subdocs=new Set,this._item=
null,this.shouldLoad=a,this.autoLoad=o,this.meta=i,this.isLoaded=!1,this.isSynced=!1,this.whenLoaded=Qn(l=>{this.on("loa\
d",()=>{this.isLoaded=!0,l(this)})});const c=()=>Qn(l=>{const u=d=>{(d===void 0||d===!0)&&(this.off("sync",u),l())};this.
on("sync",u)});this.on("sync",l=>{l===!1&&this.isSynced&&(this.whenSynced=c()),this.isSynced=l===void 0||l===!0,this.isLoaded||
this.emit("load",[])}),this.whenSynced=c()}load(){const e=this._item;e!==null&&!this.shouldLoad&&me(e.parent.doc,t=>{t.subdocsLoaded.
add(this)},null,!0),this.shouldLoad=!0}getSubdocs(){return this.subdocs}getSubdocGuids(){return new Set(Xr(this.subdocs).
map(e=>e.guid))}transact(e,t=null){return me(this,e,t)}get(e,t=Fe){const n=rn(this.share,e,()=>{const i=new t;return i._integrate(
this,null),i}),s=n.constructor;if(t!==Fe&&s!==t)if(s===Fe){const i=new t;i._map=n._map,n._map.forEach(o=>{for(;o!==null;o=
o.left)o.parent=i}),i._start=n._start;for(let o=i._start;o!==null;o=o.right)o.parent=i;return i._length=n._length,this.share.
set(e,i),i._integrate(this,null),i}else throw new Error(`Type with the name ${e} has already been defined with a differe\
nt constructor`);return n}getArray(e=""){return this.get(e,On)}getText(e=""){return this.get(e,Yn)}getMap(e=""){return this.
get(e,yr)}getXmlFragment(e=""){return this.get(e,hn)}toJSON(){const e={};return this.share.forEach((t,n)=>{e[n]=t.toJSON()}),
e}destroy(){Xr(this.subdocs).forEach(t=>t.destroy());const e=this._item;if(e!==null){this._item=null;const t=e.content;t.
doc=new is({guid:this.guid,...t.opts,shouldLoad:!1}),t.doc._item=e,me(e.parent.doc,n=>{const s=t.doc;e.deleted||n.subdocsAdded.
add(s),n.subdocsRemoved.add(this)},null,!0)}this.emit("destroyed",[!0]),this.emit("destroy",[this]),super.destroy()}on(e,t){
super.on(e,t)}off(e,t){super.off(e,t)}}class Sm{constructor(e){this.restDecoder=e}resetDsCurVal(){}readDsClock(){return ee(
this.restDecoder)}readDsLen(){return ee(this.restDecoder)}}class vm extends Sm{readLeftID(){return ne(ee(this.restDecoder),
ee(this.restDecoder))}readRightID(){return ne(ee(this.restDecoder),ee(this.restDecoder))}readClient(){return ee(this.restDecoder)}readInfo(){
return Kn(this.restDecoder)}readString(){return Nn(this.restDecoder)}readParentInfo(){return ee(this.restDecoder)===1}readTypeRef(){
return ee(this.restDecoder)}readLen(){return ee(this.restDecoder)}readAny(){return Ys(this.restDecoder)}readBuf(){return Ow(
gt(this.restDecoder))}readJSON(){return JSON.parse(Nn(this.restDecoder))}readKey(){return Nn(this.restDecoder)}}class U0{constructor(e){
this.dsCurrVal=0,this.restDecoder=e}resetDsCurVal(){this.dsCurrVal=0}readDsClock(){return this.dsCurrVal+=ee(this.restDecoder),
this.dsCurrVal}readDsLen(){const e=ee(this.restDecoder)+1;return this.dsCurrVal+=e,e}}class Xn extends U0{constructor(e){
super(e),this.keys=[],ee(e),this.keyClockDecoder=new nc(gt(e)),this.clientDecoder=new io(gt(e)),this.leftClockDecoder=new nc(
gt(e)),this.rightClockDecoder=new nc(gt(e)),this.infoDecoder=new qd(gt(e),Kn),this.stringDecoder=new xw(gt(e)),this.parentInfoDecoder=
new qd(gt(e),Kn),this.typeRefDecoder=new io(gt(e)),this.lenDecoder=new io(gt(e))}readLeftID(){return new Fn(this.clientDecoder.
read(),this.leftClockDecoder.read())}readRightID(){return new Fn(this.clientDecoder.read(),this.rightClockDecoder.read())}readClient(){
return this.clientDecoder.read()}readInfo(){return this.infoDecoder.read()}readString(){return this.stringDecoder.read()}readParentInfo(){
return this.parentInfoDecoder.read()===1}readTypeRef(){return this.typeRefDecoder.read()}readLen(){return this.lenDecoder.
read()}readAny(){return Ys(this.restDecoder)}readBuf(){return gt(this.restDecoder)}readJSON(){return Ys(this.restDecoder)}readKey(){
const e=this.keyClockDecoder.read();if(e<this.keys.length)return this.keys[e];{const t=this.stringDecoder.read();return this.
keys.push(t),t}}}class Am{constructor(){this.restEncoder=ya()}toUint8Array(){return Yt(this.restEncoder)}resetDsCurVal(){}writeDsClock(e){
re(this.restEncoder,e)}writeDsLen(e){re(this.restEncoder,e)}}class Ei extends Am{writeLeftID(e){re(this.restEncoder,e.client),
re(this.restEncoder,e.clock)}writeRightID(e){re(this.restEncoder,e.client),re(this.restEncoder,e.clock)}writeClient(e){re(
this.restEncoder,e)}writeInfo(e){ul(this.restEncoder,e)}writeString(e){$n(this.restEncoder,e)}writeParentInfo(e){re(this.
restEncoder,e?1:0)}writeTypeRef(e){re(this.restEncoder,e)}writeLen(e){re(this.restEncoder,e)}writeAny(e){Xs(this.restEncoder,
e)}writeBuf(e){mt(this.restEncoder,e)}writeJSON(e){$n(this.restEncoder,JSON.stringify(e))}writeKey(e){$n(this.restEncoder,
e)}}class _m{constructor(){this.restEncoder=ya(),this.dsCurrVal=0}toUint8Array(){return Yt(this.restEncoder)}resetDsCurVal(){
this.dsCurrVal=0}writeDsClock(e){const t=e-this.dsCurrVal;this.dsCurrVal=e,re(this.restEncoder,t)}writeDsLen(e){e===0&&Dt(),
re(this.restEncoder,e-1),this.dsCurrVal+=e}}class dn extends _m{constructor(){super(),this.keyMap=new Map,this.keyClock=
0,this.keyClockEncoder=new rc,this.clientEncoder=new so,this.leftClockEncoder=new rc,this.rightClockEncoder=new rc,this.
infoEncoder=new Fd(ul),this.stringEncoder=new fw,this.parentInfoEncoder=new Fd(ul),this.typeRefEncoder=new so,this.lenEncoder=
new so}toUint8Array(){const e=ya();return re(e,0),mt(e,this.keyClockEncoder.toUint8Array()),mt(e,this.clientEncoder.toUint8Array()),
mt(e,this.leftClockEncoder.toUint8Array()),mt(e,this.rightClockEncoder.toUint8Array()),mt(e,Yt(this.infoEncoder)),mt(e,this.
stringEncoder.toUint8Array()),mt(e,Yt(this.parentInfoEncoder)),mt(e,this.typeRefEncoder.toUint8Array()),mt(e,this.lenEncoder.
toUint8Array()),wa(e,Yt(this.restEncoder)),Yt(e)}writeLeftID(e){this.clientEncoder.write(e.client),this.leftClockEncoder.
write(e.clock)}writeRightID(e){this.clientEncoder.write(e.client),this.rightClockEncoder.write(e.clock)}writeClient(e){this.
clientEncoder.write(e)}writeInfo(e){this.infoEncoder.write(e)}writeString(e){this.stringEncoder.write(e)}writeParentInfo(e){
this.parentInfoEncoder.write(e?1:0)}writeTypeRef(e){this.typeRefEncoder.write(e)}writeLen(e){this.lenEncoder.write(e)}writeAny(e){
Xs(this.restEncoder,e)}writeBuf(e){mt(this.restEncoder,e)}writeJSON(e){Xs(this.restEncoder,e)}writeKey(e){const t=this.keyMap.
get(e);t===void 0?(this.keyClockEncoder.write(this.keyClock++),this.stringEncoder.write(e)):this.keyClockEncoder.write(t)}}
const F0=(r,e,t,n)=>{n=yn(n,e[0].id.clock);const s=er(e,n);re(r.restEncoder,e.length-s),r.writeClient(t),re(r.restEncoder,
n);const i=e[s];i.write(r,n-i.id.clock);for(let o=s+1;o<e.length;o++)e[o].write(r,0)},Tu=(r,e,t)=>{const n=new Map;t.forEach(
(s,i)=>{Re(e,i)>s&&n.set(i,s)}),Ia(e).forEach((s,i)=>{t.has(i)||n.set(i,0)}),re(r.restEncoder,n.size),Xr(n.entries()).sort(
(s,i)=>i[0]-s[0]).forEach(([s,i])=>{F0(r,e.clients.get(s),s,i)})},O0=(r,e)=>{const t=zt(),n=ee(r.restDecoder);for(let s=0;s<
n;s++){const i=ee(r.restDecoder),o=new Array(i),a=r.readClient();let c=ee(r.restDecoder);t.set(a,{i:0,refs:o});for(let l=0;l<
i;l++){const u=r.readInfo();switch(ba&u){case 0:{const d=r.readLen();o[l]=new Rt(ne(a,c),d),c+=d;break}case 10:{const d=ee(
r.restDecoder);o[l]=new Bt(ne(a,c),d),c+=d;break}default:{const d=(u&(br|Et))===0,h=new Ce(ne(a,c),null,(u&Et)===Et?r.readLeftID():
null,null,(u&br)===br?r.readRightID():null,d?r.readParentInfo()?e.get(r.readString()):r.readLeftID():null,d&&(u&Qs)===Qs?
r.readString():null,Ym(r,u));o[l]=h,c+=h.length}}}}return t},z0=(r,e,t)=>{const n=[];let s=Xr(t.keys()).sort((p,g)=>p-g);
if(s.length===0)return null;const i=()=>{if(s.length===0)return null;let p=t.get(s[s.length-1]);for(;p.refs.length===p.i;)
if(s.pop(),s.length>0)p=t.get(s[s.length-1]);else return null;return p};let o=i();if(o===null&&n.length===0)return null;
const a=new Rm,c=new Map,l=(p,g)=>{const y=c.get(p);(y==null||y>g)&&c.set(p,g)};let u=o.refs[o.i++];const d=new Map,h=()=>{
for(const p of n){const g=p.id.client,y=t.get(g);y?(y.i--,a.clients.set(g,y.refs.slice(y.i)),t.delete(g),y.i=0,y.refs=[]):
a.clients.set(g,[p]),s=s.filter(m=>m!==g)}n.length=0};for(;;){if(u.constructor!==Bt){const g=rn(d,u.id.client,()=>Re(e,u.
id.client))-u.id.clock;if(g<0)n.push(u),l(u.id.client,u.id.clock-1),h();else{const y=u.getMissing(r,e);if(y!==null){n.push(
u);const m=t.get(y)||{refs:[],i:0};if(m.refs.length===m.i)l(y,Re(e,y)),h();else{u=m.refs[m.i++];continue}}else(g===0||g<
u.length)&&(u.integrate(r,g),d.set(u.id.client,u.id.clock+u.length))}}if(n.length>0)u=n.pop();else if(o!==null&&o.i<o.refs.
length)u=o.refs[o.i++];else{if(o=i(),o===null)break;u=o.refs[o.i++]}}if(a.clients.size>0){const p=new dn;return Tu(p,a,new Map),
re(p.restEncoder,0),{missing:c,update:p.toUint8Array()}}return null},q0=(r,e)=>Tu(r,e.doc.store,e.beforeState),j0=(r,e,t,n=new Xn(
r))=>me(e,s=>{s.local=!1;let i=!1;const o=s.doc,a=o.store,c=O0(n,o),l=z0(s,a,c),u=a.pendingStructs;if(u){for(const[h,p]of u.
missing)if(p<Re(a,h)){i=!0;break}if(l){for(const[h,p]of l.missing){const g=u.missing.get(h);(g==null||g>p)&&u.missing.set(
h,p)}u.update=To([u.update,l.update])}}else a.pendingStructs=l;const d=Vd(n,s,a);if(a.pendingDs){const h=new Xn(rs(a.pendingDs));
ee(h.restDecoder);const p=Vd(h,s,a);d&&p?a.pendingDs=To([d,p]):a.pendingDs=d||p}else a.pendingDs=d;if(i){const h=a.pendingStructs.
update;a.pendingStructs=null,Im(s.doc,h)}},t,!1),Im=(r,e,t,n=Xn)=>{const s=rs(e);j0(s,r,t,new n(s))},Co=(r,e,t)=>Im(r,e,
t,vm),G0=(r,e,t=new Map)=>{Tu(r,e.store,t),ss(r,N0(e.store))},W0=(r,e=new Uint8Array([0]),t=new dn)=>{const n=Cm(e);G0(t,
r,n);const s=[t.toUint8Array()];if(r.store.pendingDs&&s.push(r.store.pendingDs),r.store.pendingStructs&&s.push(o1(r.store.
pendingStructs.update,e)),s.length>1){if(t.constructor===Ei)return s1(s.map((i,o)=>o===0?i:c1(i)));if(t.constructor===dn)
return To(s)}return s[0]},Mu=(r,e)=>W0(r,e,new Ei),V0=r=>{const e=new Map,t=ee(r.restDecoder);for(let n=0;n<t;n++){const s=ee(
r.restDecoder),i=ee(r.restDecoder);e.set(s,i)}return e},Cm=r=>V0(new Sm(rs(r))),Tm=(r,e)=>(re(r.restEncoder,e.size),Xr(e.
entries()).sort((t,n)=>n[0]-t[0]).forEach(([t,n])=>{re(r.restEncoder,t),re(r.restEncoder,n)}),r),H0=(r,e)=>Tm(r,Ia(e.store)),
K0=(r,e=new _m)=>(r instanceof Map?Tm(e,r):H0(e,r),e.toUint8Array()),Q0=r=>K0(r,new Am);class J0{constructor(){this.l=[]}}
const Hd=()=>new J0,Kd=(r,e)=>r.l.push(e),Qd=(r,e)=>{const t=r.l,n=t.length;r.l=t.filter(s=>e!==s),n===r.l.length&&console.
error("[yjs] Tried to remove event handler that doesn't exist.")},Mm=(r,e,t)=>ku(r.l,[e,t]);class Fn{constructor(e,t){this.
client=e,this.clock=t}}const Li=(r,e)=>r===e||r!==null&&e!==null&&r.client===e.client&&r.clock===e.clock,ne=(r,e)=>new Fn(
r,e),X0=r=>{for(const[e,t]of r.doc.share.entries())if(t===r)return e;throw Dt()},gs=(r,e)=>e===void 0?!r.deleted:e.sv.has(
r.id.client)&&(e.sv.get(r.id.client)||0)>r.id.clock&&!Em(e.ds,r.id),gl=(r,e)=>{const t=rn(r.meta,gl,Hn),n=r.doc.store;t.
has(e)||(e.sv.forEach((s,i)=>{s<Re(n,i)&&Yr(r,ne(i,s))}),ml(r,e.ds,s=>{}),t.add(e))};class Rm{constructor(){this.clients=
new Map,this.pendingStructs=null,this.pendingDs=null}}const Ia=r=>{const e=new Map;return r.clients.forEach((t,n)=>{const s=t[t.
length-1];e.set(n,s.id.clock+s.length)}),e},Re=(r,e)=>{const t=r.clients.get(e);if(t===void 0)return 0;const n=t[t.length-
1];return n.id.clock+n.length},Bm=(r,e)=>{let t=r.clients.get(e.id.client);if(t===void 0)t=[],r.clients.set(e.id.client,
t);else{const n=t[t.length-1];if(n.id.clock+n.length!==e.id.clock)throw Dt()}t.push(e)},er=(r,e)=>{let t=0,n=r.length-1,
s=r[n],i=s.id.clock;if(i===e)return n;let o=Zt(e/(i+s.length-1)*n);for(;t<=n;){if(s=r[o],i=s.id.clock,i<=e){if(e<i+s.length)
return o;t=o+1}else n=o-1;o=Zt((t+n)/2)}throw Dt()},Y0=(r,e)=>{const t=r.clients.get(e.client);return t[er(t,e.clock)]},
ac=Y0,bl=(r,e,t)=>{const n=er(e,t),s=e[n];return s.id.clock<t&&s instanceof Ce?(e.splice(n+1,0,Po(r,s,t-s.id.clock)),n+1):
n},Yr=(r,e)=>{const t=r.doc.store.clients.get(e.client);return t[bl(r,t,e.clock)]},Jd=(r,e,t)=>{const n=e.clients.get(t.
client),s=er(n,t.clock),i=n[s];return t.clock!==i.id.clock+i.length-1&&i.constructor!==Rt&&n.splice(s+1,0,Po(r,i,t.clock-
i.id.clock+1)),i},Z0=(r,e,t)=>{const n=r.clients.get(e.id.client);n[er(n,e.id.clock)]=t},Lm=(r,e,t,n,s)=>{if(n===0)return;
const i=t+n;let o=bl(r,e,t),a;do a=e[o++],i<a.id.clock+a.length&&bl(r,e,i),s(a);while(o<e.length&&e[o].id.clock<i)};class e1{constructor(e,t,n){
this.doc=e,this.deleteSet=new ki,this.beforeState=Ia(e.store),this.afterState=new Map,this.changed=new Map,this.changedParentTypes=
new Map,this._mergeStructs=[],this.origin=t,this.meta=new Map,this.local=n,this.subdocsAdded=new Set,this.subdocsRemoved=
new Set,this.subdocsLoaded=new Set}}const Xd=(r,e)=>e.deleteSet.clients.size===0&&!Gy(e.afterState,(t,n)=>e.beforeState.
get(n)!==t)?!1:(Iu(e.deleteSet),q0(r,e),ss(r,e.deleteSet),!0),Yd=(r,e,t)=>{const n=e._item;(n===null||n.id.clock<(r.beforeState.
get(n.id.client)||0)&&!n.deleted)&&rn(r.changed,e,Hn).add(t)},ao=(r,e)=>{const t=r[e-1],n=r[e];t.deleted===n.deleted&&t.
constructor===n.constructor&&t.mergeWith(n)&&(r.splice(e,1),n instanceof Ce&&n.parentSub!==null&&n.parent._map.get(n.parentSub)===
n&&n.parent._map.set(n.parentSub,t))},t1=(r,e,t)=>{for(const[n,s]of r.clients.entries()){const i=e.clients.get(n);for(let o=s.
length-1;o>=0;o--){const a=s[o],c=a.clock+a.len;for(let l=er(i,a.clock),u=i[l];l<i.length&&u.id.clock<c;u=i[++l]){const d=i[l];
if(a.clock+a.len<=d.id.clock)break;d instanceof Ce&&d.deleted&&!d.keep&&t(d)&&d.gc(e,!1)}}}},r1=(r,e)=>{r.clients.forEach(
(t,n)=>{const s=e.clients.get(n);for(let i=t.length-1;i>=0;i--){const o=t[i],a=Wp(s.length-1,1+er(s,o.clock+o.len-1));for(let c=a,
l=s[c];c>0&&l.id.clock>=o.clock;l=s[--c])ao(s,c)}})},Dm=(r,e)=>{if(e<r.length){const t=r[e],n=t.doc,s=n.store,i=t.deleteSet,
o=t._mergeStructs;try{Iu(i),t.afterState=Ia(t.doc.store),n.emit("beforeObserverCalls",[t,n]);const a=[];t.changed.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&l._callObserver(t,c)})),a.push(()=>{t.changedParentTypes.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&(c=c.filter(u=>u.target._item===null||!u.target._item.deleted),c.
forEach(u=>{u.currentTarget=l}),c.sort((u,d)=>u.path.length-d.path.length),Mm(l._dEH,c,t))})),a.push(()=>n.emit("afterTr\
ansaction",[t,n]))}),ku(a,[])}finally{n.gc&&t1(i,s,n.gcFilter),r1(i,s),t.afterState.forEach((u,d)=>{const h=t.beforeState.
get(d)||0;if(h!==u){const p=s.clients.get(d),g=yn(er(p,h),1);for(let y=p.length-1;y>=g;y--)ao(p,y)}});for(let u=0;u<o.length;u++){
const{client:d,clock:h}=o[u].id,p=s.clients.get(d),g=er(p,h);g+1<p.length&&ao(p,g+1),g>0&&ao(p,g)}if(!t.local&&t.afterState.
get(n.clientID)!==t.beforeState.get(n.clientID)&&(R0(wm,gm,"[yjs] ",bm,ym,"Changed the client-id because another client \
seems to be using it."),n.clientID=xm()),n.emit("afterTransactionCleanup",[t,n]),n._observers.has("update")){const u=new Ei;
Xd(u,t)&&n.emit("update",[u.toUint8Array(),t.origin,n,t])}if(n._observers.has("updateV2")){const u=new dn;Xd(u,t)&&n.emit(
"updateV2",[u.toUint8Array(),t.origin,n,t])}const{subdocsAdded:a,subdocsLoaded:c,subdocsRemoved:l}=t;(a.size>0||l.size>0||
c.size>0)&&(a.forEach(u=>{u.clientID=n.clientID,u.collectionid==null&&(u.collectionid=n.collectionid),n.subdocs.add(u)}),
l.forEach(u=>n.subdocs.delete(u)),n.emit("subdocs",[{loaded:c,added:a,removed:l},n,t]),l.forEach(u=>u.destroy())),r.length<=
e+1?(n._transactionCleanups=[],n.emit("afterAllTransactions",[n,r])):Dm(r,e+1)}}},me=(r,e,t=null,n=!0)=>{const s=r._transactionCleanups;
let i=!1,o=null;r._transaction===null&&(i=!0,r._transaction=new e1(r,t,n),s.push(r._transaction),s.length===1&&r.emit("b\
eforeAllTransactions",[r]),r.emit("beforeTransaction",[r._transaction,r]));try{o=e(r._transaction)}finally{if(i){const a=r.
_transaction===s[0];r._transaction=null,a&&Dm(s,0)}}return o};function*n1(r){const e=ee(r.restDecoder);for(let t=0;t<e;t++){
const n=ee(r.restDecoder),s=r.readClient();let i=ee(r.restDecoder);for(let o=0;o<n;o++){const a=r.readInfo();if(a===10){
const c=ee(r.restDecoder);yield new Bt(ne(s,i),c),i+=c}else if((ba&a)!==0){const c=(a&(br|Et))===0,l=new Ce(ne(s,i),null,
(a&Et)===Et?r.readLeftID():null,null,(a&br)===br?r.readRightID():null,c?r.readParentInfo()?r.readString():r.readLeftID():
null,c&&(a&Qs)===Qs?r.readString():null,Ym(r,a));yield l,i+=l.length}else{const c=r.readLen();yield new Rt(ne(s,i),c),i+=
c}}}}class Ru{constructor(e,t){this.gen=n1(e),this.curr=null,this.done=!1,this.filterSkips=t,this.next()}next(){do this.
curr=this.gen.next().value||null;while(this.filterSkips&&this.curr!==null&&this.curr.constructor===Bt);return this.curr}}
class Bu{constructor(e){this.currClient=0,this.startClock=0,this.written=0,this.encoder=e,this.clientStructs=[]}}const s1=r=>To(
r,vm,Ei),i1=(r,e)=>{if(r.constructor===Rt){const{client:t,clock:n}=r.id;return new Rt(ne(t,n+e),r.length-e)}else if(r.constructor===
Bt){const{client:t,clock:n}=r.id;return new Bt(ne(t,n+e),r.length-e)}else{const t=r,{client:n,clock:s}=t.id;return new Ce(
ne(n,s+e),null,ne(n,s+e-1),null,t.rightOrigin,t.parent,t.parentSub,t.content.splice(e))}},To=(r,e=Xn,t=dn)=>{if(r.length===
1)return r[0];const n=r.map(u=>new e(rs(u)));let s=n.map(u=>new Ru(u,!0)),i=null;const o=new t,a=new Bu(o);for(;s=s.filter(
h=>h.curr!==null),s.sort((h,p)=>{if(h.curr.id.client===p.curr.id.client){const g=h.curr.id.clock-p.curr.id.clock;return g===
0?h.curr.constructor===p.curr.constructor?0:h.curr.constructor===Bt?1:-1:g}else return p.curr.id.client-h.curr.id.client}),
s.length!==0;){const u=s[0],d=u.curr.id.client;if(i!==null){let h=u.curr,p=!1;for(;h!==null&&h.id.clock+h.length<=i.struct.
id.clock+i.struct.length&&h.id.client>=i.struct.id.client;)h=u.next(),p=!0;if(h===null||h.id.client!==d||p&&h.id.clock>i.
struct.id.clock+i.struct.length)continue;if(d!==i.struct.id.client)Wr(a,i.struct,i.offset),i={struct:h,offset:0},u.next();else if(i.
struct.id.clock+i.struct.length<h.id.clock)if(i.struct.constructor===Bt)i.struct.length=h.id.clock+h.length-i.struct.id.
clock;else{Wr(a,i.struct,i.offset);const g=h.id.clock-i.struct.id.clock-i.struct.length;i={struct:new Bt(ne(d,i.struct.id.
clock+i.struct.length),g),offset:0}}else{const g=i.struct.id.clock+i.struct.length-h.id.clock;g>0&&(i.struct.constructor===
Bt?i.struct.length-=g:h=i1(h,g)),i.struct.mergeWith(h)||(Wr(a,i.struct,i.offset),i={struct:h,offset:0},u.next())}}else i=
{struct:u.curr,offset:0},u.next();for(let h=u.curr;h!==null&&h.id.client===d&&h.id.clock===i.struct.id.clock+i.struct.length&&
h.constructor!==Bt;h=u.next())Wr(a,i.struct,i.offset),i={struct:h,offset:0}}i!==null&&(Wr(a,i.struct,i.offset),i=null),Lu(
a);const c=n.map(u=>Cu(u)),l=P0(c);return ss(o,l),o.toUint8Array()},o1=(r,e,t=Xn,n=dn)=>{const s=Cm(e),i=new n,o=new Bu(
i),a=new t(rs(r)),c=new Ru(a,!1);for(;c.curr;){const u=c.curr,d=u.id.client,h=s.get(d)||0;if(c.curr.constructor===Bt){c.
next();continue}if(u.id.clock+u.length>h)for(Wr(o,u,yn(h-u.id.clock,0)),c.next();c.curr&&c.curr.id.client===d;)Wr(o,c.curr,
0),c.next();else for(;c.curr&&c.curr.id.client===d&&c.curr.id.clock+c.curr.length<=h;)c.next()}Lu(o);const l=Cu(a);return ss(
i,l),i.toUint8Array()},Pm=r=>{r.written>0&&(r.clientStructs.push({written:r.written,restEncoder:Yt(r.encoder.restEncoder)}),
r.encoder.restEncoder=ya(),r.written=0)},Wr=(r,e,t)=>{r.written>0&&r.currClient!==e.id.client&&Pm(r),r.written===0&&(r.currClient=
e.id.client,r.encoder.writeClient(e.id.client),re(r.encoder.restEncoder,e.id.clock+t)),e.write(r.encoder,t),r.written++},
Lu=r=>{Pm(r);const e=r.encoder.restEncoder;re(e,r.clientStructs.length);for(let t=0;t<r.clientStructs.length;t++){const n=r.
clientStructs[t];re(e,n.written),wa(e,n.restEncoder)}},a1=(r,e,t)=>{const n=new e(rs(r)),s=new Ru(n,!1),i=new t,o=new Bu(
i);for(let c=s.curr;c!==null;c=s.next())Wr(o,c,0);Lu(o);const a=Cu(n);return ss(i,a),i.toUint8Array()},c1=r=>a1(r,Xn,Ei);
class Ca{constructor(e,t){this.target=e,this.currentTarget=e,this.transaction=t,this._changes=null,this._keys=null,this.
_delta=null}get path(){return l1(this.currentTarget,this.target)}deletes(e){return Em(this.transaction.deleteSet,e.id)}get keys(){
if(this._keys===null){const e=new Map,t=this.target;this.transaction.changed.get(t).forEach(s=>{if(s!==null){const i=t._map.
get(s);let o,a;if(this.adds(i)){let c=i.left;for(;c!==null&&this.adds(c);)c=c.left;if(this.deletes(i))if(c!==null&&this.
deletes(c))o="delete",a=Za(c.content.getContent());else return;else c!==null&&this.deletes(c)?(o="update",a=Za(c.content.
getContent())):(o="add",a=void 0)}else if(this.deletes(i))o="delete",a=Za(i.content.getContent());else return;e.set(s,{action:o,
oldValue:a})}}),this._keys=e}return this._keys}get delta(){return this.changes.delta}adds(e){return e.id.clock>=(this.transaction.
beforeState.get(e.id.client)||0)}get changes(){let e=this._changes;if(e===null){const t=this.target,n=Hn(),s=Hn(),i=[];if(e=
{added:n,deleted:s,delta:i,keys:this.keys},this.transaction.changed.get(t).has(null)){let a=null;const c=()=>{a&&i.push(
a)};for(let l=t._start;l!==null;l=l.right)l.deleted?this.deletes(l)&&!this.adds(l)&&((a===null||a.delete===void 0)&&(c(),
a={delete:0}),a.delete+=l.length,s.add(l)):this.adds(l)?((a===null||a.insert===void 0)&&(c(),a={insert:[]}),a.insert=a.insert.
concat(l.content.getContent()),n.add(l)):((a===null||a.retain===void 0)&&(c(),a={retain:0}),a.retain+=l.length);a!==null&&
a.retain===void 0&&c()}this._changes=e}return e}}const l1=(r,e)=>{const t=[];for(;e._item!==null&&e!==r;){if(e._item.parentSub!==
null)t.unshift(e._item.parentSub);else{let n=0,s=e._item.parent._start;for(;s!==e._item&&s!==null;)s.deleted||n++,s=s.right;
t.unshift(n)}e=e._item.parent}return t},$m=80;let Du=0;class u1{constructor(e,t){e.marker=!0,this.p=e,this.index=t,this.
timestamp=Du++}}const d1=r=>{r.timestamp=Du++},Nm=(r,e,t)=>{r.p.marker=!1,r.p=e,e.marker=!0,r.index=t,r.timestamp=Du++},
h1=(r,e,t)=>{if(r.length>=$m){const n=r.reduce((s,i)=>s.timestamp<i.timestamp?s:i);return Nm(n,e,t),n}else{const n=new u1(
e,t);return r.push(n),n}},Ta=(r,e)=>{if(r._start===null||e===0||r._searchMarker===null)return null;const t=r._searchMarker.
length===0?null:r._searchMarker.reduce((i,o)=>no(e-i.index)<no(e-o.index)?i:o);let n=r._start,s=0;for(t!==null&&(n=t.p,s=
t.index,d1(t));n.right!==null&&s<e;){if(!n.deleted&&n.countable){if(e<s+n.length)break;s+=n.length}n=n.right}for(;n.left!==
null&&s>e;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);for(;n.left!==null&&n.left.id.client===n.id.client&&n.left.id.
clock+n.left.length===n.id.clock;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);return t!==null&&no(t.index-s)<n.parent.
length/$m?(Nm(t,n,s),t):h1(r._searchMarker,n,s)},ri=(r,e,t)=>{for(let n=r.length-1;n>=0;n--){const s=r[n];if(t>0){let i=s.
p;for(i.marker=!1;i&&(i.deleted||!i.countable);)i=i.left,i&&!i.deleted&&i.countable&&(s.index-=i.length);if(i===null||i.
marker===!0){r.splice(n,1);continue}s.p=i,i.marker=!0}(e<s.index||t>0&&e===s.index)&&(s.index=yn(e,s.index+t))}},Ma=(r,e,t)=>{
const n=r,s=e.changedParentTypes;for(;rn(s,r,()=>[]).push(t),r._item!==null;)r=r._item.parent;Mm(n._eH,t,e)};class Fe{constructor(){
this._item=null,this._map=new Map,this._start=null,this.doc=null,this._length=0,this._eH=Hd(),this._dEH=Hd(),this._searchMarker=
null}get parent(){return this._item?this._item.parent:null}_integrate(e,t){this.doc=e,this._item=t}_copy(){throw qt()}clone(){
throw qt()}_write(e){}get _first(){let e=this._start;for(;e!==null&&e.deleted;)e=e.right;return e}_callObserver(e,t){!e.
local&&this._searchMarker&&(this._searchMarker.length=0)}observe(e){Kd(this._eH,e)}observeDeep(e){Kd(this._dEH,e)}unobserve(e){
Qd(this._eH,e)}unobserveDeep(e){Qd(this._dEH,e)}toJSON(){}}const Um=(r,e,t)=>{e<0&&(e=r._length+e),t<0&&(t=r._length+t);
let n=t-e;const s=[];let i=r._start;for(;i!==null&&n>0;){if(i.countable&&!i.deleted){const o=i.content.getContent();if(o.
length<=e)e-=o.length;else{for(let a=e;a<o.length&&n>0;a++)s.push(o[a]),n--;e=0}}i=i.right}return s},Fm=r=>{const e=[];let t=r.
_start;for(;t!==null;){if(t.countable&&!t.deleted){const n=t.content.getContent();for(let s=0;s<n.length;s++)e.push(n[s])}
t=t.right}return e},ni=(r,e)=>{let t=0,n=r._start;for(;n!==null;){if(n.countable&&!n.deleted){const s=n.content.getContent();
for(let i=0;i<s.length;i++)e(s[i],t++,r)}n=n.right}},Om=(r,e)=>{const t=[];return ni(r,(n,s)=>{t.push(e(n,s,r))}),t},f1=r=>{
let e=r._start,t=null,n=0;return{[Symbol.iterator](){return this},next:()=>{if(t===null){for(;e!==null&&e.deleted;)e=e.right;
if(e===null)return{done:!0,value:void 0};t=e.content.getContent(),n=0,e=e.right}const s=t[n++];return t.length<=n&&(t=null),
{done:!1,value:s}}}},zm=(r,e)=>{const t=Ta(r,e);let n=r._start;for(t!==null&&(n=t.p,e-=t.index);n!==null;n=n.right)if(!n.
deleted&&n.countable){if(e<n.length)return n.content.getContent()[e];e-=n.length}},Mo=(r,e,t,n)=>{let s=t;const i=r.doc,
o=i.clientID,a=i.store,c=t===null?e._start:t.right;let l=[];const u=()=>{l.length>0&&(s=new Ce(ne(o,Re(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new fn(l)),s.integrate(r,0),l=[])};n.forEach(d=>{if(d===null)l.push(d);else switch(d.constructor){case Number:case Object:case Boolean:case Array:case String:
l.push(d);break;default:switch(u(),d.constructor){case Uint8Array:case ArrayBuffer:s=new Ce(ne(o,Re(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new xi(new Uint8Array(d))),s.integrate(r,0);break;case is:s=new Ce(ne(o,Re(a,o)),s,s&&s.lastId,c,c&&c.id,
e,null,new Si(d)),s.integrate(r,0);break;default:if(d instanceof Fe)s=new Ce(ne(o,Re(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,
new xr(d)),s.integrate(r,0);else throw new Error("Unexpected content type in insert operation")}}}),u()},qm=kr("Length e\
xceeded!"),jm=(r,e,t,n)=>{if(t>e._length)throw qm;if(t===0)return e._searchMarker&&ri(e._searchMarker,t,n.length),Mo(r,e,
null,n);const s=t,i=Ta(e,t);let o=e._start;for(i!==null&&(o=i.p,t-=i.index,t===0&&(o=o.prev,t+=o&&o.countable&&!o.deleted?
o.length:0));o!==null;o=o.right)if(!o.deleted&&o.countable){if(t<=o.length){t<o.length&&Yr(r,ne(o.id.client,o.id.clock+t));
break}t-=o.length}return e._searchMarker&&ri(e._searchMarker,s,n.length),Mo(r,e,o,n)},p1=(r,e,t)=>{let s=(e._searchMarker||
[]).reduce((i,o)=>o.index>i.index?o:i,{index:0,p:e._start}).p;if(s)for(;s.right;)s=s.right;return Mo(r,e,s,t)},Gm=(r,e,t,n)=>{
if(n===0)return;const s=t,i=n,o=Ta(e,t);let a=e._start;for(o!==null&&(a=o.p,t-=o.index);a!==null&&t>0;a=a.right)!a.deleted&&
a.countable&&(t<a.length&&Yr(r,ne(a.id.client,a.id.clock+t)),t-=a.length);for(;n>0&&a!==null;)a.deleted||(n<a.length&&Yr(
r,ne(a.id.client,a.id.clock+n)),a.delete(r),n-=a.length),a=a.right;if(n>0)throw qm;e._searchMarker&&ri(e._searchMarker,s,
-i+n)},Ro=(r,e,t)=>{const n=e._map.get(t);n!==void 0&&n.delete(r)},Pu=(r,e,t,n)=>{const s=e._map.get(t)||null,i=r.doc,o=i.
clientID;let a;if(n==null)a=new fn([n]);else switch(n.constructor){case Number:case Object:case Boolean:case Array:case String:
a=new fn([n]);break;case Uint8Array:a=new xi(n);break;case is:a=new Si(n);break;default:if(n instanceof Fe)a=new xr(n);else
throw new Error("Unexpected content type")}new Ce(ne(o,Re(i.store,o)),s,s&&s.lastId,null,null,e,t,a).integrate(r,0)},$u=(r,e)=>{
const t=r._map.get(e);return t!==void 0&&!t.deleted?t.content.getContent()[t.length-1]:void 0},Wm=r=>{const e={};return r.
_map.forEach((t,n)=>{t.deleted||(e[n]=t.content.getContent()[t.length-1])}),e},Vm=(r,e)=>{const t=r._map.get(e);return t!==
void 0&&!t.deleted},Di=r=>L0(r.entries(),e=>!e[1].deleted);class m1 extends Ca{constructor(e,t){super(e,t),this._transaction=
t}}class On extends Fe{constructor(){super(),this._prelimContent=[],this._searchMarker=[]}static from(e){const t=new On;
return t.push(e),t}_integrate(e,t){super._integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){
return new On}clone(){const e=new On;return e.insert(0,this.toArray().map(t=>t instanceof Fe?t.clone():t)),e}get length(){
return this._prelimContent===null?this._length:this._prelimContent.length}_callObserver(e,t){super._callObserver(e,t),Ma(
this,e,new m1(this,e))}insert(e,t){this.doc!==null?me(this.doc,n=>{jm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}push(e){
this.doc!==null?me(this.doc,t=>{p1(t,this,e)}):this._prelimContent.push(...e)}unshift(e){this.insert(0,e)}delete(e,t=1){
this.doc!==null?me(this.doc,n=>{Gm(n,this,e,t)}):this._prelimContent.splice(e,t)}get(e){return zm(this,e)}toArray(){return Fm(
this)}slice(e=0,t=this.length){return Um(this,e,t)}toJSON(){return this.map(e=>e instanceof Fe?e.toJSON():e)}map(e){return Om(
this,e)}forEach(e){ni(this,e)}[Symbol.iterator](){return f1(this)}_write(e){e.writeTypeRef(U1)}}const g1=r=>new On;class b1 extends Ca{constructor(e,t,n){
super(e,t),this.keysChanged=n}}class yr extends Fe{constructor(e){super(),this._prelimContent=null,e===void 0?this._prelimContent=
new Map:this._prelimContent=new Map(e)}_integrate(e,t){super._integrate(e,t),this._prelimContent.forEach((n,s)=>{this.set(
s,n)}),this._prelimContent=null}_copy(){return new yr}clone(){const e=new yr;return this.forEach((t,n)=>{e.set(n,t instanceof
Fe?t.clone():t)}),e}_callObserver(e,t){Ma(this,e,new b1(this,e,t))}toJSON(){const e={};return this._map.forEach((t,n)=>{
if(!t.deleted){const s=t.content.getContent()[t.length-1];e[n]=s instanceof Fe?s.toJSON():s}}),e}get size(){return[...Di(
this._map)].length}keys(){return oc(Di(this._map),e=>e[0])}values(){return oc(Di(this._map),e=>e[1].content.getContent()[e[1].
length-1])}entries(){return oc(Di(this._map),e=>[e[0],e[1].content.getContent()[e[1].length-1]])}forEach(e){this._map.forEach(
(t,n)=>{t.deleted||e(t.content.getContent()[t.length-1],n,this)})}[Symbol.iterator](){return this.entries()}delete(e){this.
doc!==null?me(this.doc,t=>{Ro(t,this,e)}):this._prelimContent.delete(e)}set(e,t){return this.doc!==null?me(this.doc,n=>{
Pu(n,this,e,t)}):this._prelimContent.set(e,t),t}get(e){return $u(this,e)}has(e){return Vm(this,e)}clear(){this.doc!==null?
me(this.doc,e=>{this.forEach(function(t,n,s){Ro(e,s,n)})}):this._prelimContent.clear()}_write(e){e.writeTypeRef(F1)}}const y1=r=>new yr,
Vr=(r,e)=>r===e||typeof r=="object"&&typeof e=="object"&&r&&e&&Lw(r,e);class yl{constructor(e,t,n,s){this.left=e,this.right=
t,this.index=n,this.currentAttributes=s}forward(){switch(this.right===null&&Dt(),this.right.content.constructor){case Te:
this.right.deleted||os(this.currentAttributes,this.right.content);break;default:this.right.deleted||(this.index+=this.right.
length);break}this.left=this.right,this.right=this.right.right}}const Zd=(r,e,t)=>{for(;e.right!==null&&t>0;){switch(e.right.
content.constructor){case Te:e.right.deleted||os(e.currentAttributes,e.right.content);break;default:e.right.deleted||(t<
e.right.length&&Yr(r,ne(e.right.id.client,e.right.id.clock+t)),e.index+=e.right.length,t-=e.right.length);break}e.left=e.
right,e.right=e.right.right}return e},Pi=(r,e,t)=>{const n=new Map,s=Ta(e,t);if(s){const i=new yl(s.p.left,s.p,s.index,n);
return Zd(r,i,t-s.index)}else{const i=new yl(null,e._start,0,n);return Zd(r,i,t)}},Hm=(r,e,t,n)=>{for(;t.right!==null&&(t.
right.deleted===!0||t.right.content.constructor===Te&&Vr(n.get(t.right.content.key),t.right.content.value));)t.right.deleted||
n.delete(t.right.content.key),t.forward();const s=r.doc,i=s.clientID;n.forEach((o,a)=>{const c=t.left,l=t.right,u=new Ce(
ne(i,Re(s.store,i)),c,c&&c.lastId,l,l&&l.id,e,null,new Te(a,o));u.integrate(r,0),t.right=u,t.forward()})},os=(r,e)=>{const{
key:t,value:n}=e;n===null?r.delete(t):r.set(t,n)},Km=(r,e)=>{for(;r.right!==null;){if(!(r.right.deleted||r.right.content.
constructor===Te&&Vr(e[r.right.content.key]||null,r.right.content.value)))break;r.forward()}},Qm=(r,e,t,n)=>{const s=r.doc,
i=s.clientID,o=new Map;for(const a in n){const c=n[a],l=t.currentAttributes.get(a)||null;if(!Vr(l,c)){o.set(a,l);const{left:u,
right:d}=t;t.right=new Ce(ne(i,Re(s.store,i)),u,u&&u.lastId,d,d&&d.id,e,null,new Te(a,c)),t.right.integrate(r,0),t.forward()}}
return o},cc=(r,e,t,n,s)=>{t.currentAttributes.forEach((h,p)=>{s[p]===void 0&&(s[p]=null)});const i=r.doc,o=i.clientID;Km(
t,s);const a=Qm(r,e,t,s),c=n.constructor===String?new tr(n):n instanceof Fe?new xr(n):new wn(n);let{left:l,right:u,index:d}=t;
e._searchMarker&&ri(e._searchMarker,t.index,c.getLength()),u=new Ce(ne(o,Re(i.store,o)),l,l&&l.lastId,u,u&&u.id,e,null,c),
u.integrate(r,0),t.right=u,t.index=d,t.forward(),Hm(r,e,t,a)},eh=(r,e,t,n,s)=>{const i=r.doc,o=i.clientID;Km(t,s);const a=Qm(
r,e,t,s);e:for(;t.right!==null&&(n>0||a.size>0&&(t.right.deleted||t.right.content.constructor===Te));){if(!t.right.deleted)
switch(t.right.content.constructor){case Te:{const{key:c,value:l}=t.right.content,u=s[c];if(u!==void 0){if(Vr(u,l))a.delete(
c);else{if(n===0)break e;a.set(c,l)}t.right.delete(r)}else t.currentAttributes.set(c,l);break}default:n<t.right.length&&
Yr(r,ne(t.right.id.client,t.right.id.clock+n)),n-=t.right.length;break}t.forward()}if(n>0){let c="";for(;n>0;n--)c+=`
`;t.right=new Ce(ne(o,Re(i.store,o)),t.left,t.left&&t.left.lastId,t.right,t.right&&t.right.id,e,null,new tr(c)),t.right.
integrate(r,0),t.forward()}Hm(r,e,t,a)},Jm=(r,e,t,n,s)=>{let i=e;const o=zt();for(;i&&(!i.countable||i.deleted);){if(!i.
deleted&&i.content.constructor===Te){const l=i.content;o.set(l.key,l)}i=i.right}let a=0,c=!1;for(;e!==i;){if(t===e&&(c=!0),
!e.deleted){const l=e.content;switch(l.constructor){case Te:{const{key:u,value:d}=l,h=n.get(u)||null;(o.get(u)!==l||h===
d)&&(e.delete(r),a++,!c&&(s.get(u)||null)===d&&h!==d&&(h===null?s.delete(u):s.set(u,h))),!c&&!e.deleted&&os(s,l);break}}}
e=e.right}return a},w1=(r,e)=>{for(;e&&e.right&&(e.right.deleted||!e.right.countable);)e=e.right;const t=new Set;for(;e&&
(e.deleted||!e.countable);){if(!e.deleted&&e.content.constructor===Te){const n=e.content.key;t.has(n)?e.delete(r):t.add(
n)}e=e.left}},k1=r=>{let e=0;return me(r.doc,t=>{let n=r._start,s=r._start,i=zt();const o=cl(i);for(;s;){if(s.deleted===
!1)switch(s.content.constructor){case Te:os(o,s.content);break;default:e+=Jm(t,n,s,i,o),i=cl(o),n=s;break}s=s.right}}),e},
th=(r,e,t)=>{const n=t,s=cl(e.currentAttributes),i=e.right;for(;t>0&&e.right!==null;){if(e.right.deleted===!1)switch(e.right.
content.constructor){case xr:case wn:case tr:t<e.right.length&&Yr(r,ne(e.right.id.client,e.right.id.clock+t)),t-=e.right.
length,e.right.delete(r);break}e.forward()}i&&Jm(r,i,e.right,s,e.currentAttributes);const o=(e.left||e.right).parent;return o.
_searchMarker&&ri(o._searchMarker,e.index,-n+t),e};class E1 extends Ca{constructor(e,t,n){super(e,t),this.childListChanged=
!1,this.keysChanged=new Set,n.forEach(s=>{s===null?this.childListChanged=!0:this.keysChanged.add(s)})}get changes(){if(this.
_changes===null){const e={keys:this.keys,delta:this.delta,added:new Set,deleted:new Set};this._changes=e}return this._changes}get delta(){
if(this._delta===null){const e=this.target.doc,t=[];me(e,n=>{const s=new Map,i=new Map;let o=this.target._start,a=null;const c={};
let l="",u=0,d=0;const h=()=>{if(a!==null){let p=null;switch(a){case"delete":d>0&&(p={delete:d}),d=0;break;case"insert":
(typeof l=="object"||l.length>0)&&(p={insert:l},s.size>0&&(p.attributes={},s.forEach((g,y)=>{g!==null&&(p.attributes[y]=
g)}))),l="";break;case"retain":u>0&&(p={retain:u},Bw(c)||(p.attributes=Mw({},c))),u=0;break}p&&t.push(p),a=null}};for(;o!==
null;){switch(o.content.constructor){case xr:case wn:this.adds(o)?this.deletes(o)||(h(),a="insert",l=o.content.getContent()[0],
h()):this.deletes(o)?(a!=="delete"&&(h(),a="delete"),d+=1):o.deleted||(a!=="retain"&&(h(),a="retain"),u+=1);break;case tr:
this.adds(o)?this.deletes(o)||(a!=="insert"&&(h(),a="insert"),l+=o.content.str):this.deletes(o)?(a!=="delete"&&(h(),a="d\
elete"),d+=o.length):o.deleted||(a!=="retain"&&(h(),a="retain"),u+=o.length);break;case Te:{const{key:p,value:g}=o.content;
if(this.adds(o)){if(!this.deletes(o)){const y=s.get(p)||null;Vr(y,g)?g!==null&&o.delete(n):(a==="retain"&&h(),Vr(g,i.get(
p)||null)?delete c[p]:c[p]=g)}}else if(this.deletes(o)){i.set(p,g);const y=s.get(p)||null;Vr(y,g)||(a==="retain"&&h(),c[p]=
y)}else if(!o.deleted){i.set(p,g);const y=c[p];y!==void 0&&(Vr(y,g)?y!==null&&o.delete(n):(a==="retain"&&h(),g===null?delete c[p]:
c[p]=g))}o.deleted||(a==="insert"&&h(),os(s,o.content));break}}o=o.right}for(h();t.length>0;){const p=t[t.length-1];if(p.
retain!==void 0&&p.attributes===void 0)t.pop();else break}}),this._delta=t}return this._delta}}class Yn extends Fe{constructor(e){
super(),this._pending=e!==void 0?[()=>this.insert(0,e)]:[],this._searchMarker=[]}get length(){return this._length}_integrate(e,t){
super._integrate(e,t);try{this._pending.forEach(n=>n())}catch(n){console.error(n)}this._pending=null}_copy(){return new Yn}clone(){
const e=new Yn;return e.applyDelta(this.toDelta()),e}_callObserver(e,t){super._callObserver(e,t);const n=new E1(this,e,t),
s=e.doc;if(Ma(this,e,n),!e.local){let i=!1;for(const[o,a]of e.afterState.entries()){const c=e.beforeState.get(o)||0;if(a!==
c&&(Lm(e,s.store.clients.get(o),c,a,l=>{!l.deleted&&l.content.constructor===Te&&(i=!0)}),i))break}i||ml(e,e.deleteSet,o=>{
o instanceof Rt||i||o.parent===this&&o.content.constructor===Te&&(i=!0)}),me(s,o=>{i?k1(this):ml(o,o.deleteSet,a=>{a instanceof
Rt||a.parent===this&&w1(o,a)})})}}toString(){let e="",t=this._start;for(;t!==null;)!t.deleted&&t.countable&&t.content.constructor===
tr&&(e+=t.content.str),t=t.right;return e}toJSON(){return this.toString()}applyDelta(e,{sanitize:t=!0}={}){this.doc!==null?
me(this.doc,n=>{const s=new yl(null,this._start,0,new Map);for(let i=0;i<e.length;i++){const o=e[i];if(o.insert!==void 0){
const a=!t&&typeof o.insert=="string"&&i===e.length-1&&s.right===null&&o.insert.slice(-1)===`
`?o.insert.slice(0,-1):o.insert;(typeof a!="string"||a.length>0)&&cc(n,this,s,a,o.attributes||{})}else o.retain!==void 0?
eh(n,this,s,o.retain,o.attributes||{}):o.delete!==void 0&&th(n,s,o.delete)}}):this._pending.push(()=>this.applyDelta(e))}toDelta(e,t,n){
const s=[],i=new Map,o=this.doc;let a="",c=this._start;function l(){if(a.length>0){const d={};let h=!1;i.forEach((g,y)=>{
h=!0,d[y]=g});const p={insert:a};h&&(p.attributes=d),s.push(p),a=""}}const u=()=>{for(;c!==null;){if(gs(c,e)||t!==void 0&&
gs(c,t))switch(c.content.constructor){case tr:{const d=i.get("ychange");e!==void 0&&!gs(c,e)?(d===void 0||d.user!==c.id.
client||d.type!=="removed")&&(l(),i.set("ychange",n?n("removed",c.id):{type:"removed"})):t!==void 0&&!gs(c,t)?(d===void 0||
d.user!==c.id.client||d.type!=="added")&&(l(),i.set("ychange",n?n("added",c.id):{type:"added"})):d!==void 0&&(l(),i.delete(
"ychange")),a+=c.content.str;break}case xr:case wn:{l();const d={insert:c.content.getContent()[0]};if(i.size>0){const h={};
d.attributes=h,i.forEach((p,g)=>{h[g]=p})}s.push(d);break}case Te:gs(c,e)&&(l(),os(i,c.content));break}c=c.right}l()};return e||
t?me(o,d=>{e&&gl(d,e),t&&gl(d,t),u()},"cleanup"):u(),s}insert(e,t,n){if(t.length<=0)return;const s=this.doc;s!==null?me(
s,i=>{const o=Pi(i,this,e);n||(n={},o.currentAttributes.forEach((a,c)=>{n[c]=a})),cc(i,this,o,t,n)}):this._pending.push(
()=>this.insert(e,t,n))}insertEmbed(e,t,n={}){const s=this.doc;s!==null?me(s,i=>{const o=Pi(i,this,e);cc(i,this,o,t,n)}):
this._pending.push(()=>this.insertEmbed(e,t,n))}delete(e,t){if(t===0)return;const n=this.doc;n!==null?me(n,s=>{th(s,Pi(s,
this,e),t)}):this._pending.push(()=>this.delete(e,t))}format(e,t,n){if(t===0)return;const s=this.doc;s!==null?me(s,i=>{const o=Pi(
i,this,e);o.right!==null&&eh(i,this,o,t,n)}):this._pending.push(()=>this.format(e,t,n))}removeAttribute(e){this.doc!==null?
me(this.doc,t=>{Ro(t,this,e)}):this._pending.push(()=>this.removeAttribute(e))}setAttribute(e,t){this.doc!==null?me(this.
doc,n=>{Pu(n,this,e,t)}):this._pending.push(()=>this.setAttribute(e,t))}getAttribute(e){return $u(this,e)}getAttributes(){
return Wm(this)}_write(e){e.writeTypeRef(O1)}}const x1=r=>new Yn;class lc{constructor(e,t=()=>!0){this._filter=t,this._root=
e,this._currentNode=e._start,this._firstCall=!0}[Symbol.iterator](){return this}next(){let e=this._currentNode,t=e&&e.content&&
e.content.type;if(e!==null&&(!this._firstCall||e.deleted||!this._filter(t)))do if(t=e.content.type,!e.deleted&&(t.constructor===
si||t.constructor===hn)&&t._start!==null)e=t._start;else for(;e!==null;)if(e.right!==null){e=e.right;break}else e.parent===
this._root?e=null:e=e.parent._item;while(e!==null&&(e.deleted||!this._filter(e.content.type)));return this._firstCall=!1,
e===null?{value:void 0,done:!0}:(this._currentNode=e,{value:e.content.type,done:!1})}}class hn extends Fe{constructor(){
super(),this._prelimContent=[]}get firstChild(){const e=this._first;return e?e.content.getContent()[0]:null}_integrate(e,t){
super._integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new hn}clone(){const e=new hn;
return e.insert(0,this.toArray().map(t=>t instanceof Fe?t.clone():t)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}createTreeWalker(e){return new lc(this,e)}querySelector(e){e=e.toUpperCase();const n=new lc(
this,s=>s.nodeName&&s.nodeName.toUpperCase()===e).next();return n.done?null:n.value}querySelectorAll(e){return e=e.toUpperCase(),
Xr(new lc(this,t=>t.nodeName&&t.nodeName.toUpperCase()===e))}_callObserver(e,t){Ma(this,e,new A1(this,t,e))}toString(){return Om(
this,e=>e.toString()).join("")}toJSON(){return this.toString()}toDOM(e=document,t={},n){const s=e.createDocumentFragment();
return n!==void 0&&n._createAssociation(s,this),ni(this,i=>{s.insertBefore(i.toDOM(e,t,n),null)}),s}insert(e,t){this.doc!==
null?me(this.doc,n=>{jm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}insertAfter(e,t){if(this.doc!==null)me(this.doc,
n=>{const s=e&&e instanceof Fe?e._item:e;Mo(n,this,s,t)});else{const n=this._prelimContent,s=e===null?0:n.findIndex(i=>i===
e)+1;if(s===0&&e!==null)throw kr("Reference item not found");n.splice(s,0,...t)}}delete(e,t=1){this.doc!==null?me(this.doc,
n=>{Gm(n,this,e,t)}):this._prelimContent.splice(e,t)}toArray(){return Fm(this)}push(e){this.insert(this.length,e)}unshift(e){
this.insert(0,e)}get(e){return zm(this,e)}slice(e=0,t=this.length){return Um(this,e,t)}forEach(e){ni(this,e)}_write(e){e.
writeTypeRef(q1)}}const S1=r=>new hn;class si extends hn{constructor(e="UNDEFINED"){super(),this.nodeName=e,this._prelimAttrs=
new Map}get nextSibling(){const e=this._item?this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this.
_item?this._item.prev:null;return e?e.content.type:null}_integrate(e,t){super._integrate(e,t),this._prelimAttrs.forEach(
(n,s)=>{this.setAttribute(s,n)}),this._prelimAttrs=null}_copy(){return new si(this.nodeName)}clone(){const e=new si(this.
nodeName),t=this.getAttributes();for(const n in t)e.setAttribute(n,t[n]);return e.insert(0,this.toArray().map(n=>n instanceof
Fe?n.clone():n)),e}toString(){const e=this.getAttributes(),t=[],n=[];for(const a in e)n.push(a);n.sort();const s=n.length;
for(let a=0;a<s;a++){const c=n[a];t.push(c+'="'+e[c]+'"')}const i=this.nodeName.toLocaleLowerCase(),o=t.length>0?" "+t.join(
" "):"";return`<${i}${o}>${super.toString()}</${i}>`}removeAttribute(e){this.doc!==null?me(this.doc,t=>{Ro(t,this,e)}):this.
_prelimAttrs.delete(e)}setAttribute(e,t){this.doc!==null?me(this.doc,n=>{Pu(n,this,e,t)}):this._prelimAttrs.set(e,t)}getAttribute(e){
return $u(this,e)}hasAttribute(e){return Vm(this,e)}getAttributes(){return Wm(this)}toDOM(e=document,t={},n){const s=e.createElement(
this.nodeName),i=this.getAttributes();for(const o in i)s.setAttribute(o,i[o]);return ni(this,o=>{s.appendChild(o.toDOM(e,
t,n))}),n!==void 0&&n._createAssociation(s,this),s}_write(e){e.writeTypeRef(z1),e.writeKey(this.nodeName)}}const v1=r=>new si(
r.readKey());class A1 extends Ca{constructor(e,t,n){super(e,n),this.childListChanged=!1,this.attributesChanged=new Set,t.
forEach(s=>{s===null?this.childListChanged=!0:this.attributesChanged.add(s)})}}class Bo extends yr{constructor(e){super(),
this.hookName=e}_copy(){return new Bo(this.hookName)}clone(){const e=new Bo(this.hookName);return this.forEach((t,n)=>{e.
set(n,t)}),e}toDOM(e=document,t={},n){const s=t[this.hookName];let i;return s!==void 0?i=s.createDom(this):i=document.createElement(
this.hookName),i.setAttribute("data-yjs-hook",this.hookName),n!==void 0&&n._createAssociation(i,this),i}_write(e){e.writeTypeRef(
j1),e.writeKey(this.hookName)}}const _1=r=>new Bo(r.readKey());class Lo extends Yn{get nextSibling(){const e=this._item?
this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this._item?this._item.prev:null;return e?e.content.
type:null}_copy(){return new Lo}clone(){const e=new Lo;return e.applyDelta(this.toDelta()),e}toDOM(e=document,t,n){const s=e.
createTextNode(this.toString());return n!==void 0&&n._createAssociation(s,this),s}toString(){return this.toDelta().map(e=>{
const t=[];for(const s in e.attributes){const i=[];for(const o in e.attributes[s])i.push({key:o,value:e.attributes[s][o]});
i.sort((o,a)=>o.key<a.key?-1:1),t.push({nodeName:s,attrs:i})}t.sort((s,i)=>s.nodeName<i.nodeName?-1:1);let n="";for(let s=0;s<
t.length;s++){const i=t[s];n+=`<${i.nodeName}`;for(let o=0;o<i.attrs.length;o++){const a=i.attrs[o];n+=` ${a.key}="${a.value}\
"`}n+=">"}n+=e.insert;for(let s=t.length-1;s>=0;s--)n+=`</${t[s].nodeName}>`;return n}).join("")}toJSON(){return this.toString()}_write(e){
e.writeTypeRef(G1)}}const I1=r=>new Lo;class Nu{constructor(e,t){this.id=e,this.length=t}get deleted(){throw qt()}mergeWith(e){
return!1}write(e,t,n){throw qt()}integrate(e,t){throw qt()}}const C1=0;class Rt extends Nu{get deleted(){return!0}delete(){}mergeWith(e){
return this.constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){t>0&&(this.id.clock+=t,this.length-=
t),Bm(e.doc.store,this)}write(e,t){e.writeInfo(C1),e.writeLen(this.length-t)}getMissing(e,t){return null}}class xi{constructor(e){
this.content=e}getLength(){return 1}getContent(){return[this.content]}isCountable(){return!0}copy(){return new xi(this.content)}splice(e){
throw qt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeBuf(this.content)}getRef(){return 3}}
const T1=r=>new xi(r.readBuf());class ii{constructor(e){this.len=e}getLength(){return this.len}getContent(){return[]}isCountable(){
return!1}copy(){return new ii(this.len)}splice(e){const t=new ii(this.len-e);return this.len=e,t}mergeWith(e){return this.
len+=e.len,!0}integrate(e,t){Io(e.deleteSet,t.id.client,t.id.clock,this.len),t.markDeleted()}delete(e){}gc(e){}write(e,t){
e.writeLen(this.len-t)}getRef(){return 1}}const M1=r=>new ii(r.readLen()),Xm=(r,e)=>new is({guid:r,...e,shouldLoad:e.shouldLoad||
e.autoLoad||!1});class Si{constructor(e){e._item&&console.error("This document was already integrated as a sub-document.\
 You should create a second instance instead with the same guid."),this.doc=e;const t={};this.opts=t,e.gc||(t.gc=!1),e.autoLoad&&
(t.autoLoad=!0),e.meta!==null&&(t.meta=e.meta)}getLength(){return 1}getContent(){return[this.doc]}isCountable(){return!0}copy(){
return new Si(Xm(this.doc.guid,this.opts))}splice(e){throw qt()}mergeWith(e){return!1}integrate(e,t){this.doc._item=t,e.
subdocsAdded.add(this.doc),this.doc.shouldLoad&&e.subdocsLoaded.add(this.doc)}delete(e){e.subdocsAdded.has(this.doc)?e.subdocsAdded.
delete(this.doc):e.subdocsRemoved.add(this.doc)}gc(e){}write(e,t){e.writeString(this.doc.guid),e.writeAny(this.opts)}getRef(){
return 9}}const R1=r=>new Si(Xm(r.readString(),r.readAny()));class wn{constructor(e){this.embed=e}getLength(){return 1}getContent(){
return[this.embed]}isCountable(){return!0}copy(){return new wn(this.embed)}splice(e){throw qt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){
e.writeJSON(this.embed)}getRef(){return 5}}const B1=r=>new wn(r.readJSON());class Te{constructor(e,t){this.key=e,this.value=
t}getLength(){return 1}getContent(){return[]}isCountable(){return!1}copy(){return new Te(this.key,this.value)}splice(e){
throw qt()}mergeWith(e){return!1}integrate(e,t){t.parent._searchMarker=null}delete(e){}gc(e){}write(e,t){e.writeKey(this.
key),e.writeJSON(this.value)}getRef(){return 6}}const L1=r=>new Te(r.readKey(),r.readJSON());class Do{constructor(e){this.
arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new Do(this.arr)}splice(e){
const t=new Do(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.arr.concat(e.arr),
!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<n;s++){const i=this.
arr[s];e.writeString(i===void 0?"undefined":JSON.stringify(i))}}getRef(){return 2}}const D1=r=>{const e=r.readLen(),t=[];
for(let n=0;n<e;n++){const s=r.readString();s==="undefined"?t.push(void 0):t.push(JSON.parse(s))}return new Do(t)};class fn{constructor(e){
this.arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new fn(this.
arr)}splice(e){const t=new fn(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.
arr.concat(e.arr),!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<
n;s++){const i=this.arr[s];e.writeAny(i)}}getRef(){return 8}}const P1=r=>{const e=r.readLen(),t=[];for(let n=0;n<e;n++)t.
push(r.readAny());return new fn(t)};class tr{constructor(e){this.str=e}getLength(){return this.str.length}getContent(){return this.
str.split("")}isCountable(){return!0}copy(){return new tr(this.str)}splice(e){const t=new tr(this.str.slice(e));this.str=
this.str.slice(0,e);const n=this.str.charCodeAt(e-1);return n>=55296&&n<=56319&&(this.str=this.str.slice(0,e-1)+"�",t.
str="�"+t.str.slice(1)),t}mergeWith(e){return this.str+=e.str,!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeString(
t===0?this.str:this.str.slice(t))}getRef(){return 4}}const $1=r=>new tr(r.readString()),N1=[g1,y1,x1,v1,S1,_1,I1],U1=0,F1=1,
O1=2,z1=3,q1=4,j1=5,G1=6;class xr{constructor(e){this.type=e}getLength(){return 1}getContent(){return[this.type]}isCountable(){
return!0}copy(){return new xr(this.type._copy())}splice(e){throw qt()}mergeWith(e){return!1}integrate(e,t){this.type._integrate(
e.doc,t)}delete(e){let t=this.type._start;for(;t!==null;)t.deleted?e._mergeStructs.push(t):t.delete(e),t=t.right;this.type.
_map.forEach(n=>{n.deleted?e._mergeStructs.push(n):n.delete(e)}),e.changed.delete(this.type)}gc(e){let t=this.type._start;
for(;t!==null;)t.gc(e,!0),t=t.right;this.type._start=null,this.type._map.forEach(n=>{for(;n!==null;)n.gc(e,!0),n=n.left}),
this.type._map=new Map}write(e,t){this.type._write(e)}getRef(){return 7}}const W1=r=>new xr(N1[r.readTypeRef()](r)),Po=(r,e,t)=>{
const{client:n,clock:s}=e.id,i=new Ce(ne(n,s+t),e,ne(n,s+t-1),e.right,e.rightOrigin,e.parent,e.parentSub,e.content.splice(
t));return e.deleted&&i.markDeleted(),e.keep&&(i.keep=!0),e.redone!==null&&(i.redone=ne(e.redone.client,e.redone.clock+t)),
e.right=i,i.right!==null&&(i.right.left=i),r._mergeStructs.push(i),i.parentSub!==null&&i.right===null&&i.parent._map.set(
i.parentSub,i),e.length=t,i};class Ce extends Nu{constructor(e,t,n,s,i,o,a,c){super(e,c.getLength()),this.origin=n,this.
left=t,this.right=s,this.rightOrigin=i,this.parent=o,this.parentSub=a,this.redone=null,this.content=c,this.info=this.content.
isCountable()?Pd:0}set marker(e){(this.info&tc)>0!==e&&(this.info^=tc)}get marker(){return(this.info&tc)>0}get keep(){return(this.
info&Dd)>0}set keep(e){this.keep!==e&&(this.info^=Dd)}get countable(){return(this.info&Pd)>0}get deleted(){return(this.info&
ec)>0}set deleted(e){this.deleted!==e&&(this.info^=ec)}markDeleted(){this.info|=ec}getMissing(e,t){if(this.origin&&this.
origin.client!==this.id.client&&this.origin.clock>=Re(t,this.origin.client))return this.origin.client;if(this.rightOrigin&&
this.rightOrigin.client!==this.id.client&&this.rightOrigin.clock>=Re(t,this.rightOrigin.client))return this.rightOrigin.
client;if(this.parent&&this.parent.constructor===Fn&&this.id.client!==this.parent.client&&this.parent.clock>=Re(t,this.parent.
client))return this.parent.client;if(this.origin&&(this.left=Jd(e,t,this.origin),this.origin=this.left.lastId),this.rightOrigin&&
(this.right=Yr(e,this.rightOrigin),this.rightOrigin=this.right.id),(this.left&&this.left.constructor===Rt||this.right&&this.
right.constructor===Rt)&&(this.parent=null),!this.parent)this.left&&this.left.constructor===Ce&&(this.parent=this.left.parent,
this.parentSub=this.left.parentSub),this.right&&this.right.constructor===Ce&&(this.parent=this.right.parent,this.parentSub=
this.right.parentSub);else if(this.parent.constructor===Fn){const n=ac(t,this.parent);n.constructor===Rt?this.parent=null:
this.parent=n.content.type}return null}integrate(e,t){if(t>0&&(this.id.clock+=t,this.left=Jd(e,e.doc.store,ne(this.id.client,
this.id.clock-1)),this.origin=this.left.lastId,this.content=this.content.splice(t),this.length-=t),this.parent){if(!this.
left&&(!this.right||this.right.left!==null)||this.left&&this.left.right!==this.right){let n=this.left,s;if(n!==null)s=n.
right;else if(this.parentSub!==null)for(s=this.parent._map.get(this.parentSub)||null;s!==null&&s.left!==null;)s=s.left;else
s=this.parent._start;const i=new Set,o=new Set;for(;s!==null&&s!==this.right;){if(o.add(s),i.add(s),Li(this.origin,s.origin)){
if(s.id.client<this.id.client)n=s,i.clear();else if(Li(this.rightOrigin,s.rightOrigin))break}else if(s.origin!==null&&o.
has(ac(e.doc.store,s.origin)))i.has(ac(e.doc.store,s.origin))||(n=s,i.clear());else break;s=s.right}this.left=n}if(this.
left!==null){const n=this.left.right;this.right=n,this.left.right=this}else{let n;if(this.parentSub!==null)for(n=this.parent.
_map.get(this.parentSub)||null;n!==null&&n.left!==null;)n=n.left;else n=this.parent._start,this.parent._start=this;this.
right=n}this.right!==null?this.right.left=this:this.parentSub!==null&&(this.parent._map.set(this.parentSub,this),this.left!==
null&&this.left.delete(e)),this.parentSub===null&&this.countable&&!this.deleted&&(this.parent._length+=this.length),Bm(e.
doc.store,this),this.content.integrate(e,this),Yd(e,this.parent,this.parentSub),(this.parent._item!==null&&this.parent._item.
deleted||this.parentSub!==null&&this.right!==null)&&this.delete(e)}else new Rt(this.id,this.length).integrate(e,0)}get next(){
let e=this.right;for(;e!==null&&e.deleted;)e=e.right;return e}get prev(){let e=this.left;for(;e!==null&&e.deleted;)e=e.left;
return e}get lastId(){return this.length===1?this.id:ne(this.id.client,this.id.clock+this.length-1)}mergeWith(e){if(this.
constructor===e.constructor&&Li(e.origin,this.lastId)&&this.right===e&&Li(this.rightOrigin,e.rightOrigin)&&this.id.client===
e.id.client&&this.id.clock+this.length===e.id.clock&&this.deleted===e.deleted&&this.redone===null&&e.redone===null&&this.
content.constructor===e.content.constructor&&this.content.mergeWith(e.content)){const t=this.parent._searchMarker;return t&&
t.forEach(n=>{n.p===e&&(n.p=this,!this.deleted&&this.countable&&(n.index-=this.length))}),e.keep&&(this.keep=!0),this.right=
e.right,this.right!==null&&(this.right.left=this),this.length+=e.length,!0}return!1}delete(e){if(!this.deleted){const t=this.
parent;this.countable&&this.parentSub===null&&(t._length-=this.length),this.markDeleted(),Io(e.deleteSet,this.id.client,
this.id.clock,this.length),Yd(e,t,this.parentSub),this.content.delete(e)}}gc(e,t){if(!this.deleted)throw Dt();this.content.
gc(e),t?Z0(e,this,new Rt(this.id,this.length)):this.content=new ii(this.length)}write(e,t){const n=t>0?ne(this.id.client,
this.id.clock+t-1):this.origin,s=this.rightOrigin,i=this.parentSub,o=this.content.getRef()&ba|(n===null?0:Et)|(s===null?
0:br)|(i===null?0:Qs);if(e.writeInfo(o),n!==null&&e.writeLeftID(n),s!==null&&e.writeRightID(s),n===null&&s===null){const a=this.
parent;if(a._item!==void 0){const c=a._item;if(c===null){const l=X0(a);e.writeParentInfo(!0),e.writeString(l)}else e.writeParentInfo(
!1),e.writeLeftID(c.id)}else a.constructor===String?(e.writeParentInfo(!0),e.writeString(a)):a.constructor===Fn?(e.writeParentInfo(
!1),e.writeLeftID(a)):Dt();i!==null&&e.writeString(i)}this.content.write(e,t)}}const Ym=(r,e)=>V1[e&ba](r),V1=[()=>{Dt()},
M1,D1,T1,$1,B1,L1,W1,P1,R1,()=>{Dt()}],H1=10;class Bt extends Nu{get deleted(){return!0}delete(){}mergeWith(e){return this.
constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){Dt()}write(e,t){e.writeInfo(H1),re(e.restEncoder,
this.length-t)}getMissing(e,t){return null}}const Zm=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<
"u"?global:{},eg="__ $YJS$ __";Zm[eg]===!0&&console.error("Yjs was already imported. This breaks constructor checks and \
will lead to issues! - https://github.com/yjs/yjs/issues/438");Zm[eg]=!0;const kn=r=>Qn((e,t)=>{r.onerror=n=>t(new Error(
n.target.error)),r.onsuccess=n=>e(n.target.result)}),K1=(r,e)=>Qn((t,n)=>{const s=indexedDB.open(r);s.onupgradeneeded=i=>e(
i.target.result),s.onerror=i=>n(kr(i.target.error)),s.onsuccess=i=>{const o=i.target.result;o.onversionchange=()=>{o.close()},
t(o)}}),Q1=r=>kn(indexedDB.deleteDatabase(r)),J1=(r,e)=>e.forEach(t=>r.createObjectStore.apply(r,t)),Ps=(r,e,t="readwrit\
e")=>{const n=r.transaction(e,t);return e.map(s=>sk(n,s))},tg=(r,e)=>kn(r.count(e)),X1=(r,e)=>kn(r.get(e)),rg=(r,e)=>kn(
r.delete(e)),Y1=(r,e,t)=>kn(r.put(e,t)),wl=(r,e)=>kn(r.add(e)),Z1=(r,e,t)=>kn(r.getAll(e,t)),ek=(r,e,t)=>{let n=null;return nk(
r,e,s=>(n=s,!1),t).then(()=>n)},tk=(r,e=null)=>ek(r,e,"prev"),rk=(r,e)=>Qn((t,n)=>{r.onerror=n,r.onsuccess=async s=>{const i=s.
target.result;if(i===null||await e(i)===!1)return t();i.continue()}}),nk=(r,e,t,n="next")=>rk(r.openKeyCursor(e,n),s=>t(
s.key)),sk=(r,e)=>r.objectStore(e),ik=(r,e)=>IDBKeyRange.upperBound(r,e),ok=(r,e)=>IDBKeyRange.lowerBound(r,e),uc="custo\
m",ng="updates",sg=500,ig=(r,e=()=>{},t=()=>{})=>{const[n]=Ps(r.db,[ng]);return Z1(n,ok(r._dbref,!1)).then(s=>{r._destroyed||
(e(n),me(r.doc,()=>{s.forEach(i=>Co(r.doc,i))},r,!1),t(n))}).then(()=>tk(n).then(s=>{r._dbref=s+1})).then(()=>tg(n).then(
s=>{r._dbsize=s})).then(()=>n)},ak=(r,e=!0)=>ig(r).then(t=>{(e||r._dbsize>=sg)&&wl(t,Mu(r.doc)).then(()=>rg(t,ik(r._dbref,
!0))).then(()=>tg(t).then(n=>{r._dbsize=n}))});class ck extends pu{constructor(e,t){super(),this.doc=t,this.name=e,this.
_dbref=0,this._dbsize=0,this._destroyed=!1,this.db=null,this.synced=!1,this._db=K1(e,n=>J1(n,[["updates",{autoIncrement:!0}],
["custom"]])),this.whenSynced=Qn(n=>this.on("synced",()=>n(this))),this._db.then(n=>{this.db=n,ig(this,o=>wl(o,Mu(t)),()=>{
if(this._destroyed)return this;this.synced=!0,this.emit("synced",[this])})}),this._storeTimeout=1e3,this._storeTimeoutId=
null,this._storeUpdate=(n,s)=>{if(this.db&&s!==this){const[i]=Ps(this.db,[ng]);wl(i,n),++this._dbsize>=sg&&(this._storeTimeoutId!==
null&&clearTimeout(this._storeTimeoutId),this._storeTimeoutId=setTimeout(()=>{ak(this,!1),this._storeTimeoutId=null},this.
_storeTimeout))}},t.on("update",this._storeUpdate),this.destroy=this.destroy.bind(this),t.on("destroy",this.destroy)}destroy(){
return this._storeTimeoutId&&clearTimeout(this._storeTimeoutId),this.doc.off("update",this._storeUpdate),this.doc.off("d\
estroy",this.destroy),this._destroyed=!0,this._db.then(e=>{e.close()})}clearData(){return this.destroy().then(()=>{Q1(this.
name)})}get(e){return this._db.then(t=>{const[n]=Ps(t,[uc],"readonly");return X1(n,e)})}set(e,t){return this._db.then(n=>{
const[s]=Ps(n,[uc]);return Y1(s,t,e)})}del(e){return this._db.then(t=>{const[n]=Ps(t,[uc]);return rg(n,e)})}}const rh="y\
js-update",nh="yjs-sync-request",sh="yjs-sync-response";function dc(r){return r instanceof Uint8Array?r:Array.isArray(r)?
new Uint8Array(r):r&&typeof r=="object"?new Uint8Array(Object.values(r)):new Uint8Array(0)}class lk extends pu{constructor(e,t,n={}){
super(),this.networkManager=e,this.doc=t,this.topic=n.topic||"peercompute-state-sync",this.peerId=n.peerId||e?.peerId||null,
this.initialSync=n.initialSync!==!1,this.syncRequestCounter=0,this.initialSyncTimer=null,this.awareness=null,this._onDocumentUpdate=
this._onDocumentUpdate.bind(this),this._onNetworkMessage=this._onNetworkMessage.bind(this),this.doc.on("update",this._onDocumentUpdate),
this.networkManager?.addMessageHandler&&this.networkManager.addMessageHandler(this._onNetworkMessage),this.initialSync&&
(this.initialSyncTimer=setTimeout(()=>{this.initialSyncTimer=null,this.requestSync().catch(s=>{console.error("[PeerCompu\
teProvider] Initial sync request failed",s)})},0)),console.log("[PeerComputeProvider] Initialized")}_getLocalPeerId(){return this.
peerId||this.networkManager?.peerId||this.networkManager?.getPeerId?.()||null}async requestSync(){if(typeof this.networkManager?.
broadcast!="function")return;const e=`${this._getLocalPeerId()||"peer"}:${Date.now()}:${++this.syncRequestCounter}`,t=Q0(
this.doc);await this.networkManager.broadcast({type:nh,data:{requestId:e,sourcePeerId:this._getLocalPeerId(),stateVector:Array.
from(t)}},{topic:this.topic})}async _sendSyncResponse(e,t={}){const n=dc(t.stateVector),s=Mu(this.doc,n);if(s.byteLength===
0)return;const i={type:sh,data:{requestId:t.requestId||null,sourcePeerId:this._getLocalPeerId(),targetPeerId:e||t.sourcePeerId||
null,update:Array.from(s)}};if(e&&typeof this.networkManager?.sendToPeer=="function"){await this.networkManager.sendToPeer(
e,i);return}typeof this.networkManager?.broadcast=="function"&&await this.networkManager.broadcast(i,{topic:this.topic})}_onDocumentUpdate(e,t){
if(t!==this){if(typeof this.networkManager?.broadcast!="function")return;this.networkManager.broadcast({type:rh,data:Array.
from(e)},{topic:this.topic}).catch(n=>{console.error("[PeerComputeProvider] Broadcast failed",n)})}}_onNetworkMessage(e,t){
if(!(!t||e===this._getLocalPeerId())){if(t.type===rh){const n=dc(t.data);n.byteLength>0&&Co(this.doc,n,this);return}if(t.
type===nh){this._sendSyncResponse(e,t.data||{}).catch(n=>{console.error("[PeerComputeProvider] Sync response failed",n)});
return}if(t.type===sh){const n=t.data?.targetPeerId||null,s=this._getLocalPeerId();if(n&&s&&n!==s)return;const i=dc(t.data?.
update);i.byteLength>0&&Co(this.doc,i,this)}}}destroy(){this.initialSyncTimer&&(clearTimeout(this.initialSyncTimer),this.
initialSyncTimer=null),this.doc.off("update",this._onDocumentUpdate),this.networkManager=null}}class uk{constructor({ydoc:e,
stateMap:t,hotStore:n,deltaNamespace:s="deltas"}={}){if(!e||!t)throw new Error("[DataState] ydoc and stateMap are requir\
ed");this.ydoc=e,this.state=t,this.hotStore=n||new Map,this.deltaNamespace=s,this.localArtifactCaches=new Map,this.artifactStores=
new Map}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new yr,this.state.set(e,t)),t}commitDelta(e={}){const t=e.
taskId||e.key;if(!t)throw new Error("[DataState] commitDelta requires taskId");const n=e.scope||this.deltaNamespace,s={version:e.
version??null,payload:e.payload??null,ts:e.timestamp??Date.now()};this.ydoc.transact(()=>{(n?this._getNamespaceMap(n):this.
state).set(t,s)},"commit-delta")}readWarm(e,t){if(t){const n=this.state.get(t);return n?n.get(e):void 0}return this.state.
get(e)}writeWarm(e,t,n){this.ydoc.transact(()=>{n?this._getNamespaceMap(n).set(e,t):this.state.set(e,t)},"write-warm")}getWarmDeltas(e=this.
deltaNamespace){const t=this.state.get(e);return t?typeof t.entries=="function"?Object.fromEntries(t.entries()):{}:{}}setHotBuffer(e,t){
this.hotStore.set(e,t)}getHotBuffer(e){return this.hotStore.get(e)}deleteHotBuffer(e){this.hotStore.delete(e)}listHotBuffers(){
return Array.from(this.hotStore.keys())}registerLocalArtifactCache(e,t){const n=String(e??"").trim();if(!n||!t||typeof t!=
"object")throw new TypeError("[DataState] local artifact cache name and instance are required");if(this.localArtifactCaches.
has(n))throw new Error(`[DataState] local artifact cache ${n} is already registered`);return this.localArtifactCaches.set(
n,t),t}getLocalArtifactCache(e){return this.localArtifactCaches.get(String(e??"").trim())??null}unregisterLocalArtifactCache(e,t){
const n=String(e??"").trim();return t&&this.localArtifactCaches.get(n)!==t?!1:this.localArtifactCaches.delete(n)}getLocalArtifactCacheStats(){
let e=0,t=0,n=0;for(const s of this.localArtifactCaches.values()){const i=s?.getStats?.();e+=Number(i?.entries??0),t+=Number(
i?.residentBytes??0),n+=Number(i?.pending??0)}return Object.freeze({caches:this.localArtifactCaches.size,entries:e,residentBytes:t,
pending:n})}async destroyLocalArtifactCaches(){const e=[...this.localArtifactCaches.values()];this.localArtifactCaches.clear(),
await Promise.allSettled(e.map(t=>t?.destroy?.()))}registerArtifactStore(e){if(this.artifactStores.has(e.name))throw new Error(
`Artifact store ${e.name} is already registered`);return this.artifactStores.set(e.name,e),e}getArtifactStore(e="default"){
return this.artifactStores.get(e)||null}unregisterArtifactStore(e){this.artifactStores.get(e.name)===e&&this.artifactStores.
delete(e.name)}getArtifactStoreStats(){const e=[...this.artifactStores.values()].map(t=>t.getStats());return{stores:e.length,
storedBytes:e.reduce((t,n)=>t+n.storedBytes,0),pending:e.reduce((t,n)=>t+n.pending,0)}}async destroyArtifactStores(){const t=(await Promise.
allSettled([...this.artifactStores.values()].map(n=>n.destroy()))).filter(n=>n.status==="rejected").map(n=>n.reason);if(t.
length)throw new AggregateError(t,"Artifact storage cleanup failed");this.artifactStores.clear()}}const ih="peercompute.\
local-artifact.v1",dk="peercompute-local-artifacts-v1",Kt="artifacts",hk=64,fk=32*1024*1024,pk=8*1024*1024,oh=16*1024,ah=2048,
mk=96;function Ot(r,e,t){const n=new r(t);return n.code=e,n}function kl(){if(typeof DOMException=="function")return new DOMException(
"The operation was aborted.","AbortError");const r=new Error("The operation was aborted.");return r.name="AbortError",r}
function bs(r){if(r?.aborted)throw r.reason??kl()}function hc(r,e){if(!Number.isSafeInteger(r)||r<1)throw new RangeError(
`${e} must be a positive safe integer.`);return r}function $i(r,e){if(!Number.isFinite(r)||r<0)throw new RangeError(`${e}\
 must be a finite non-negative timestamp.`);return r}function gk(r){const e=String(r??"").trim();if(!e||e.length>mk||!/^[a-z0-9][a-z0-9._-]*$/iu.
test(e))throw new TypeError("Local artifact cache name must be a short identifier containing letters, numbers, dot, dash\
, or underscore.");return e}function fc(r){const e=String(r??"");if(!e||e.length>ah)throw new TypeError(`Local artifact \
cache keys must contain 1-${ah} characters.`);return e}function og(r,e){const t=String(r??"").trim();if(!t||t.length>256)
throw new TypeError(`${e} must be a non-empty string of at most 256 characters.`);return t}function bk(r){const e=og(r,"\
mediaType").split(";",1)[0].trim().toLowerCase();if(!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(e))throw new TypeError(
"mediaType must be a valid MIME type.");return e}function ch(r){if(r instanceof Uint8Array)return r.slice();if(r instanceof
ArrayBuffer)return new Uint8Array(r.slice(0));if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength).
slice();throw new TypeError("Local artifact cache values must contain ArrayBuffer or typed-array bytes.")}function $s(r={}){
if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError("Local artifact metadata must be an object.");let e;try{
e=JSON.stringify(r)}catch{throw new TypeError("Local artifact metadata must be JSON-serializable.")}e===void 0&&(e="{}");
const t=new TextEncoder().encode(e).byteLength;if(t>oh)throw Ot(RangeError,"ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE",`Loca\
l artifact metadata exceeds the ${oh}-byte cap.`);const n=JSON.parse(e);if(!n||typeof n!="object"||Array.isArray(n))throw new TypeError(
"Local artifact metadata must serialize to an object.");return{metadata:n,byteLength:t}}async function lh(r){if(!globalThis.
crypto?.subtle?.digest)throw Ot(Error,"ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE","SHA-256 is unavailable; local artifacts can\
not be admitted without integrity metadata.");const e=await globalThis.crypto.subtle.digest("SHA-256",r);return`sha256:${Array.
from(new Uint8Array(e),t=>t.toString(16).padStart(2,"0")).join("")}`}function El(r){return Object.freeze($s(r).metadata)}
function Ni(r,e,t={}){return Object.freeze({bytes:r.bytes.slice(),metadata:El(r.metadata),cacheStatus:e,...t})}function pc(r){
return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error??new Error("IndexedDB request failed."))})}
function Ui(r){return new Promise((e,t)=>{r.oncomplete=()=>e(),r.onerror=()=>t(r.error??new Error("IndexedDB transaction\
 failed.")),r.onabort=()=>t(r.error??new Error("IndexedDB transaction aborted."))})}function mc(r,e){return`${r}\0${e}`}
class yk{constructor({name:e,maximumEntries:t=hk,maximumBytes:n=fk,maximumEntryBytes:s=Math.min(pk,n),persistent:i=!0,clock:o=Date.
now,indexedDBImpl:a=globalThis.indexedDB,onDestroy:c=null}={}){if(this.name=gk(e),this.maximumEntries=hc(t,"maximumEntri\
es"),this.maximumBytes=hc(n,"maximumBytes"),this.maximumEntryBytes=hc(s,"maximumEntryBytes"),this.maximumEntryBytes>this.
maximumBytes)throw new RangeError("maximumEntryBytes must not exceed maximumBytes.");if(typeof o!="function")throw new TypeError(
"clock must be a function.");if(c!==null&&typeof c!="function")throw new TypeError("onDestroy must be a function or null\
.");this.clock=o,this.indexedDB=a,this.persistenceConfigured=i===!0,this.persistenceAvailable=this.persistenceConfigured&&
typeof a?.open=="function",this.onDestroy=c,this.entries=new Map,this.inflight=new Map,this.residentBytes=0,this.reservedBytes=
0,this.databasePromise=null,this.database=null,this.persistenceQueue=Promise.resolve(),this.destroyed=!1,this.generation=
0,this.counters={hits:0,misses:0,coalesced:0,stale:0,evictions:0,rejected:0,validationFailures:0,persistenceFailures:0}}#e(){
if(this.destroyed)throw Ot(Error,"ERR_LOCAL_ARTIFACT_CACHE_DESTROYED","Local artifact cache is destroyed.")}#r(e,t){t.metadata.
accessedAt=this.clock(),this.entries.delete(e),this.entries.set(e,t)}#n(e,{eviction:t=!1}={}){const n=this.entries.get(e);
return n?(this.entries.delete(e),this.residentBytes=Math.max(0,this.residentBytes-n.storageBytes),t&&(this.counters.evictions+=
1),!0):!1}#d({key:e,entryBytes:t=null,reservationBytes:n=0}={}){const s=this.entries.get(e),i=s?.storageBytes??0,o=()=>{
const a=t!==null,c=this.entries.size+(a&&!s?1:0),l=a?this.residentBytes-i+t+this.reservedBytes+n:this.residentBytes+this.
reservedBytes+n;return c>this.maximumEntries||l>this.maximumBytes};for(;o();){let a=!1;for(const c of this.entries.keys())
if(c!==e){this.#n(c,{eviction:!0}),a=!0;break}if(!a)return!1}return!0}#p(e,t){return t.storageBytes>this.maximumEntryBytes||
t.bytes.byteLength>this.maximumEntryBytes?(this.counters.rejected+=1,!1):this.#d({key:e,entryBytes:t.storageBytes})?(this.#n(
e),this.entries.set(e,t),this.residentBytes+=t.storageBytes,!0):(this.counters.rejected+=1,!1)}#b(e){const t=this.entries.
get(e)?.storageBytes??0,n=Math.max(0,this.maximumEntryBytes-Math.min(t,this.maximumEntryBytes));if(this.inflight.size>=this.
maximumEntries||!this.#d({key:e,reservationBytes:n}))throw this.counters.rejected+=1,Ot(Error,"ERR_LOCAL_ARTIFACT_CACHE_\
BUSY","Local artifact cache has no bounded capacity for another in-flight load.");return this.reservedBytes+=n,n}#u(e){this.
reservedBytes=Math.max(0,this.reservedBytes-e)}async#h(){return!this.persistenceAvailable||this.destroyed?null:this.database?
this.database:(this.databasePromise||(this.databasePromise=new Promise((e,t)=>{let n;try{n=this.indexedDB.open(dk,1)}catch(s){
t(s);return}n.onupgradeneeded=()=>{const s=n.result;s.objectStoreNames.contains(Kt)||s.createObjectStore(Kt,{keyPath:"id"})},
n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??new Error("Unable to open the local artifact database.")),n.onblocked=
()=>t(new Error("Opening the local artifact database was blocked."))}).then(e=>(this.database=e,e.onversionchange=()=>{e.
close(),this.database===e&&(this.database=null)},e)).catch(e=>(this.#a(e),null))),this.databasePromise)}#a(e){this.persistenceAvailable&&
(this.counters.persistenceFailures+=1),this.persistenceAvailable=!1;try{this.database?.close?.()}catch{}this.database=null}async#f(e){
const t=await this.#h();if(!t)return null;let n;try{const s=t.transaction(Kt,"readonly"),i=Ui(s);i.catch(()=>{});const o=s.
objectStore(Kt).get(mc(this.name,e));n=await pc(o),await i}catch(s){return this.#a(s),null}if(!n||n.cacheName!==this.name||
n.key!==e)return null;try{return{bytes:ch(n.bytes),metadata:$s(n.metadata).metadata,storageBytes:Number(n.storageBytes)}}catch{
return{bytes:null,metadata:null,storageBytes:Number.NaN}}}async#c(e,t){const n=await this.#h();if(n)try{const s=n.transaction(
Kt,"readwrite"),i=Ui(s);i.catch(()=>{});const o=s.objectStore(Kt);o.put({id:mc(this.name,e),cacheName:this.name,key:e,bytes:t.
bytes.slice(),metadata:$s(t.metadata).metadata,storageBytes:t.storageBytes});const c=(await pc(o.getAll())).filter(u=>u?.
cacheName===this.name).sort((u,d)=>Number(u.metadata?.accessedAt??0)-Number(d.metadata?.accessedAt??0)||String(u.id).localeCompare(
String(d.id)));let l=c.reduce((u,d)=>{const h=Number(d.storageBytes);return u+(Number.isSafeInteger(h)&&h>=0?h:this.maximumBytes+
1)},0);for(;c.length>this.maximumEntries||l>this.maximumBytes;){const u=c.shift();if(!u)break;const d=Number(u.storageBytes);
l-=Number.isSafeInteger(d)&&d>=0?d:this.maximumBytes+1,o.delete(u.id)}await i}catch(s){this.#a(s)}}async#i(e){const t=await this.#h();
if(t)try{const n=t.transaction(Kt,"readwrite"),s=Ui(n);s.catch(()=>{}),n.objectStore(Kt).delete(mc(this.name,e)),await s}catch(n){
this.#a(n)}}async#o(){const e=await this.#h();if(e)try{const t=e.transaction(Kt,"readwrite"),n=Ui(t);n.catch(()=>{});const s=t.
objectStore(Kt),i=await pc(s.getAll());for(const o of i)o?.cacheName===this.name&&s.delete(o.id);await n}catch(t){this.#a(
t)}}#t(e){if(!this.persistenceAvailable)return Promise.resolve();const t=this.persistenceQueue.then(e,e);return this.persistenceQueue=
t.catch(()=>{}),t}async#w(e,t){const n=e?.metadata;if(!e?.bytes||n?.schema!==ih||e.bytes.byteLength>this.maximumEntryBytes||
!Number.isSafeInteger(e.storageBytes)||e.storageBytes!==e.bytes.byteLength||e.storageBytes>this.maximumBytes||!Number.isFinite(
n.byteLength)||n.byteLength!==e.bytes.byteLength||typeof n.sha256!="string"||typeof n.sourceId!="string"||typeof n.mediaType!=
"string"||!Number.isFinite(n.freshUntil)||!Number.isFinite(n.staleUntil)||n.staleUntil<n.freshUntil)throw Ot(Error,"ERR_\
LOCAL_ARTIFACT_SCHEMA","Local artifact metadata is invalid.");if(await lh(e.bytes)!==n.sha256)throw Ot(Error,"ERR_LOCAL_\
ARTIFACT_INTEGRITY","Local artifact SHA-256 does not match its bytes.");if(t&&await t(e.bytes.slice(),El(n))===!1)throw Ot(
Error,"ERR_LOCAL_ARTIFACT_VALIDATION","Local artifact validator rejected the bytes.");return e}async#s(e,{allowStale:t=!1,
validate:n,sourceId:s,mediaType:i}={}){let o=this.entries.get(e)??null,a=!1;if(o||(o=await this.#f(e),a=!!o),!o)return null;
try{if(s&&o.metadata.sourceId!==s)throw Ot(Error,"ERR_LOCAL_ARTIFACT_SOURCE","Local artifact source identifier does not \
match.");if(i&&o.metadata.mediaType!==i)throw Ot(Error,"ERR_LOCAL_ARTIFACT_MEDIA_TYPE","Local artifact media type does n\
ot match.");a&&await this.#w(o,n)}catch{return this.counters.validationFailures+=1,this.#n(e),await this.#t(()=>this.#i(
e)),null}const c=this.clock();if(c>o.metadata.staleUntil)return this.#n(e),await this.#t(()=>this.#i(e)),null;const l=c<
o.metadata.freshUntil;return!l&&!t?null:(a&&this.#p(e,o),this.entries.has(e)&&this.#r(e,o),this.#t(()=>this.#c(e,o)),{entry:o,
fresh:l})}async read(e,{validate:t,allowStale:n=!1,signal:s}={}){this.#e();const i=fc(e);if(t!==void 0&&typeof t!="funct\
ion")throw new TypeError("validate must be a function.");bs(s);const o=await this.#s(i,{allowStale:n,validate:t});return bs(
s),o?(o.fresh?this.counters.hits+=1:this.counters.stale+=1,Ni(o.entry,o.fresh?"hit":"stale")):null}async#m({bytes:e,metadata:t={}},n){
const s=ch(e);if(s.byteLength>this.maximumEntryBytes)throw this.counters.rejected+=1,Ot(RangeError,"ERR_LOCAL_ARTIFACT_E\
NTRY_TOO_LARGE",`Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`);const{metadata:i}=$s(t),o=this.clock(),
a=$i(n.freshUntil,"freshUntil"),c=$i(n.staleUntil,"staleUntil");if(c<a)throw new RangeError("staleUntil must be greater \
than or equal to freshUntil.");const l=Number.isFinite(i.freshUntil)?i.freshUntil:a,u=Number.isFinite(i.staleUntil)?i.staleUntil:
c,d=Math.min(c,u),h=Math.min(a,l,d),p=await lh(s),g={...i,schema:ih,sourceId:n.sourceId,mediaType:n.mediaType,byteLength:s.
byteLength,sha256:p,createdAt:o,accessedAt:o,freshUntil:h,staleUntil:d},y=$s(g),m={bytes:s,metadata:y.metadata,storageBytes:s.
byteLength};if(n.validate)try{if(await n.validate(s.slice(),El(m.metadata))===!1)throw Ot(Error,"ERR_LOCAL_ARTIFACT_VALI\
DATION","Local artifact validator rejected the bytes.")}catch(f){throw this.counters.validationFailures+=1,f}return m}#l(e,t,n){
bs(t);const s={};return e.subscribers.add(s),n&&(this.counters.coalesced+=1),new Promise((i,o)=>{let a=!1;const c=()=>{a||
(a=!0,t?.removeEventListener?.("abort",l),e.subscribers.delete(s))},l=()=>{c(),!e.settled&&e.subscribers.size===0&&e.controller.
abort(),o(t.reason??kl())};t?.addEventListener?.("abort",l,{once:!0}),e.promise.then(u=>{c(),i(n?Object.freeze({...u,cacheStatus:"\
coalesced"}):u)},u=>{c(),o(u)})})}async getOrLoad({key:e,sourceId:t,mediaType:n,freshUntil:s,staleUntil:i,signal:o,loader:a,
validate:c}={}){this.#e();const l=fc(e),u=og(t,"sourceId"),d=bk(n);if(typeof a!="function")throw new TypeError("loader m\
ust be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("validate must be a function.");if($i(s,"fr\
eshUntil"),$i(i,"staleUntil"),i<s)throw new RangeError("staleUntil must be greater than or equal to freshUntil.");bs(o);
let h=this.inflight.get(l);if(h)return this.#l(h,o,!0);const p=await this.#s(l,{allowStale:!0,validate:c,sourceId:u,mediaType:d});
if(bs(o),p?.fresh)return this.counters.hits+=1,Ni(p.entry,"hit");if(h=this.inflight.get(l),h)return this.#l(h,o,!0);const g=this.#b(
l),y=this.generation,m=new AbortController,f={controller:m,subscribers:new Set,settled:!1,invalidated:!1,promise:null};let b=!1;
return f.promise=Promise.resolve().then(()=>a({signal:m.signal,maximumBytes:this.maximumEntryBytes})).then(w=>{if(m.signal.
aborted)throw m.signal.reason??kl();const k=w&&typeof w=="object"&&"bytes"in w?w:{bytes:w,metadata:{}};return this.#m(k,
{sourceId:u,mediaType:d,freshUntil:s,staleUntil:i,validate:c})}).then(async w=>(this.#u(g),b=!0,!m.signal.aborted&&!f.invalidated&&
!this.destroyed&&y===this.generation&&(this.#p(l,w),this.entries.get(l)===w&&await this.#t(()=>this.#c(l,w))),this.counters.
misses+=1,Ni(w,"miss"))).catch(w=>{if(p&&this.clock()<=p.entry.metadata.staleUntil)return this.counters.stale+=1,Ni(p.entry,
"stale",{refreshErrorCode:typeof w?.code=="string"?w.code:"UPSTREAM_REFRESH_FAILED"});throw w}).finally(()=>{f.settled=!0,
b||this.#u(g),this.inflight.get(l)===f&&this.inflight.delete(l)}),this.inflight.set(l,f),this.#l(f,o,!1)}async delete(e){
this.#e();const t=fc(e),n=this.inflight.get(t);n&&(n.invalidated=!0),n?.controller.abort(),this.#n(t),await this.#t(()=>this.#i(
t))}async clear(){this.#e(),this.generation+=1;for(const e of this.inflight.values())e.invalidated=!0,e.controller.abort();
this.entries.clear(),this.residentBytes=0,await this.#t(()=>this.#o())}getStats(){const e=this.clock();let t=0,n=0;for(const s of this.
entries.values())e<s.metadata.freshUntil?t+=1:e<=s.metadata.staleUntil&&(n+=1);return Object.freeze({schema:"peercompute\
.local-artifact-cache-stats.v1",entries:this.entries.size,freshEntries:t,staleEntries:n,residentBytes:this.residentBytes,
maximumEntries:this.maximumEntries,maximumBytes:this.maximumBytes,maximumEntryBytes:this.maximumEntryBytes,pending:this.
inflight.size,reservedBytes:this.reservedBytes,persistenceConfigured:this.persistenceConfigured,persistenceAvailable:this.
persistenceAvailable,...this.counters})}async destroy(){if(!this.destroyed){this.destroyed=!0,this.generation+=1;for(const e of this.
inflight.values())e.invalidated=!0,e.controller.abort();await Promise.allSettled([...this.inflight.values()].map(e=>e.promise)),
await this.persistenceQueue.catch(()=>{}),this.entries.clear(),this.inflight.clear(),this.residentBytes=0,this.reservedBytes=
0;try{this.database?.close?.()}catch{}this.database=null,this.onDestroy?.(this),this.onDestroy=null}}}function wk(r,e){if(r===
e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Uu(r){
if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return oi(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return oi(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function kk(r){return r?.buffer instanceof ArrayBuffer}function oi(r){return kk(r)?r:r.slice()}function Ek(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>
0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;for(var T=d.
repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.length-b)*h+
1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&_!==-1;_--,E++)
S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var xk=Ek,Sk=xk;let vk=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Ak=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ag(this,e)}},
_k=class{decoders;constructor(e){this.decoders=e}or(e){return ag(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function ag(r,e){return new _k({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let Ik=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new vk(e,t,n),this.decoder=new Ak(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function cg({name:r,prefix:e,encode:t,decode:n}){return new Ik(r,e,t,
n)}function Ra({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=Sk(t,r,n);return cg({prefix:e,
name:r,encode:s,decode:o=>Uu(i(o))})}function Ck(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Tk(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function Mk(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Sr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=Mk(n,s);return cg(
{prefix:e,name:r,encode(o){return Tk(o,n,t)},decode(o){return Ck(o,i,t,r)}})}const co=Sr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Sr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Sr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const gc=Ra(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ra({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Or=Ra({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ra({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Rk=lg,uh=128,Bk=-128,Lk=Math.pow(2,31);function lg(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=Lk;)e[t++]=r&255|uh,r/=128;for(;r&Bk;)e[t++]=r&255|uh,r>>>=7;return e[t]=r|0,lg.bytes=t-n+1,e}var Dk=xl,
Pk=128,dh=127;function xl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw xl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&dh)<<s:(o&dh)*Math.pow(2,s),s+=7}while(o>=Pk);return xl.bytes=i-n,t}var $k=Math.pow(
2,7),Nk=Math.pow(2,14),Uk=Math.pow(2,21),Fk=Math.pow(2,28),Ok=Math.pow(2,35),zk=Math.pow(2,42),qk=Math.pow(2,49),jk=Math.
pow(2,56),Gk=Math.pow(2,63),Wk=function(r){return r<$k?1:r<Nk?2:r<Uk?3:r<Fk?4:r<Ok?5:r<zk?6:r<qk?7:r<jk?8:r<Gk?9:10},Vk={
encode:Rk,decode:Dk,encodingLength:Wk},$o=Vk;function Sl(r,e=0){const t=$o.decode(r,e),n=$o.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function No(r,e,t=0){return $o.encode(r,e,t),e}function Uo(r){return $o.encodingLength(r)}function ug(r,e){const t=e.
byteLength,n=Uo(r),s=n+Uo(t),i=new Uint8Array(s+t);return No(r,i,0),No(t,i,n),i.set(e,s),new Fu(r,t,e,i)}function Hk(r){
const e=Uu(r),[t,n]=Sl(e),[s,i]=Sl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Fu(t,s,o,e)}function Kk(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&wk(r.bytes,t.bytes)}}let Fu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
oi(n),this.bytes=oi(s)}};function hh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return Jk(t,vl(r),e??Or.encoder);default:
return Xk(t,vl(r),e??co.encoder)}}const fh=new WeakMap;function vl(r){const e=fh.get(r);if(e==null){const t=new Map;return fh.
set(r,t),t}return e}let Zn=class Ve{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=oi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ys)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==Yk)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ve.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=ug(e,
t);return Ve.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ve.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&Kk(e.multihash,n.multihash)}toString(e){return hh(this,e)}toJSON(){return{"/":hh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ve)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ve(n,s,i,o??ph(n,s,i.bytes))}else if(t[Zk]===!0){const{version:n,
multihash:s,code:i}=t,o=Hk(s);return Ve.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ys)throw new Error(`Version 0 CID must use dag-pb (code: ${ys}) block encoding`);return new Ve(e,t,n,n.bytes)}case 1:{
const s=ph(e,t,n.bytes);return new Ve(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ve.
create(0,ys,e)}static createV1(e,t){return Ve.create(1,e,t)}static decode(e){const[t,n]=Ve.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ve.inspectBytes(e),n=t.size-t.multihashSize,
s=Uu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Fu(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ve.createV0(o):Ve.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Sl(e.subarray(t));return t+=h,d};let s=n(),
i=ys;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=Qk(e,t),
i=Ve.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return vl(
i).set(n,e),i}};function Qk(r,e){switch(r[0]){case"Q":{const t=e??Or;return[Or.prefix,t.decode(`${Or.prefix}${r}`)]}case Or.
prefix:{const t=e??Or;return[Or.prefix,t.decode(r)]}case co.prefix:{const t=e??co;return[co.prefix,t.decode(r)]}case gc.
prefix:{const t=e??gc;return[gc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function Jk(r,e,t){const{prefix:n}=t;if(n!==
Or.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function Xk(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ys=112,Yk=18;function ph(r,e,t){const n=Uo(r),s=n+Uo(e),i=new Uint8Array(s+t.
byteLength);return No(r,i,0),No(e,i,n),i.set(t,s),i}const Zk=Symbol.for("@ipld/js-cid/CID"),eE=20;function tE({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new rE(r,e,t,n,s)}let rE=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??eE,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
mh(n,this.code,t?.truncate):n.then(s=>mh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function mh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return ug(e,r)}function nE(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const gh=tE({name:"sha2-256",code:18,encode:nE("SHA-256")}),sE=r=>r/2**32|0,iE=r=>r>>>0;function oE(r,e,t,n){
const s=sE(t),i=iE(t);r.setUint32(e,n?i:s,n),r.setUint32(e+4,n?s:i,n)}function bh(r){return r instanceof Uint8Array||ArrayBuffer.
isView(r)&&r.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in r&&r.BYTES_PER_ELEMENT===1}const aE=r=>r?`"${r}" `:"";
function Ou(r,e,t=""){if(bh(r)&&e===void 0)return r;const n=bh(r),s="",i=n?`length=${r.length}`:`type=${typeof r}`,o=aE(
t)+"expected Uint8Array"+s+", got "+i;throw n?new RangeError(o):new TypeError(o)}const cE=(r,e)=>{if(r===null||typeof r!=
"object"||Array.isArray(r))throw new TypeError((e==="object"?"":`"${e}" `)+"expected object, got type="+typeof r)},yh=(r,e)=>{
cE(r,e);const t=Object.getPrototypeOf(r);if(t!==Object.prototype&&t!==null)throw new TypeError(`"${e}" expected plain ob\
ject`);if(Object.hasOwn(r,"__proto__"))throw new TypeError(`"${e}.__proto__" is not allowed`)};function wh(r,e=!0){if(r.
destroyed)throw new Error("hash was destroyed");if(e&&r.finished)throw new Error("digest() was already called")}function lE(r,e){
Ou(r,void 0,"output");const t=e.outputLen;if(!(r.length>=t))throw new RangeError('"output" expected length >= '+t)}function kh(...r){
for(let e=0;e<r.length;e++)r[e].fill(0)}function bc(r){return new DataView(r.buffer,r.byteOffset,r.byteLength)}function Qt(r,e){
return r<<32-e|r>>>e}const uE=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",dE=Array.
from({length:256},(r,e)=>e.toString(16).padStart(2,"0"));function qR(r){if(Ou(r),uE)return r.toHex();let e="";for(let t=0;t<
r.length;t++)e+=dE[r[t]];return e}function hE(r,e,t="opts"){return yh(r,"defaults"),e!==void 0&&yh(e,t),Object.assign(Object.
create(null),r,e)}function fE(r,e={}){if(typeof r!="function")throw new TypeError('"hashCons" expected function, got typ\
e='+typeof r);e=hE({},e,"info");const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=
n.blockLen,t.canXOF=n.canXOF,t.create=s=>r(s),Object.assign(t,e),Object.freeze(t)}const pE=r=>({oid:Uint8Array.from([6,9,
96,134,72,1,101,3,4,2,r])});function mE(r,e,t){return r&e^~r&t}function gE(r,e,t){return r&e^r&t^e&t}let bE=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=bc(this.buffer)}update(e){
wh(this),Ou(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;let o=!1;for(let a=0;a<i;){const c=Math.min(s-this.pos,
i-a);if(c===s){const l=bc(e);for(;s<=i-a;a+=s)this.process(l,a);o=!0;continue}n.set(a===0&&c===i?e:e.subarray(a,a+c),this.
pos),this.pos+=c,a+=c,this.pos===s&&(this.process(t,0),this.pos=0,o=!0)}return this.length+=e.length,o&&this.roundClean(),
this}digestInto(e){wh(this),lE(e,this),this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=
128,t.fill(0,o),this.padOffset>s-o&&(this.process(n,0),t.fill(0)),oE(n,s-8,this.length*8,i),this.process(n,0),this.roundClean();
const a=e===t?n:bc(e),c=this.outputLen,l=c/4,u=this.get();if(c%4||l>u.length)throw new Error("invalid outputLen");for(let d=0;d<
l;d++)a.setUint32(4*d,u[d],i)}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.
destroy(),n}_cloneIntoMeta(e){const{buffer:t,length:n,finished:s,destroyed:i,pos:o}=this;return e.destroyed=i,e.finished=
s,e.length=n,e.pos=o,o&&e.buffer.set(t),e}clone(){return this._cloneInto()}};const yE=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),wE=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Ir=new Uint32Array(64);let kE=class extends bE{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,
8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){
const{A:e,B:t,C:n,D:s,E:i,F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|
0,this.D=s|0,this.E=i|0,this.F=o|0,this.G=a|0,this.H=c|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),
this._cloneIntoMeta(e)}process(e,t){for(let d=0;d<16;d++,t+=4)Ir[d]=e.getUint32(t,!1);for(let d=16;d<64;d++){const h=Ir[d-
15],p=Ir[d-2],g=Qt(h,7)^Qt(h,18)^h>>>3,y=Qt(p,17)^Qt(p,19)^p>>>10;Ir[d]=y+Ir[d-7]+g+Ir[d-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let d=0;d<64;d++){const h=Qt(a,6)^Qt(a,11)^Qt(a,25),p=u+h+mE(a,c,l)+wE[d]+Ir[d]|0,y=(Qt(n,2)^Qt(n,13)^
Qt(n,22))+gE(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){kh(Ir)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),kh(this.buffer)}},EE=class extends kE{constructor(){super(32,yE)}};const Eh=fE(()=>new EE,pE(1));function xE(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
function zu(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return ai(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return ai(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function SE(r){return r?.buffer instanceof ArrayBuffer}function ai(r){return SE(r)?r:r.slice()}function vE(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>
0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;for(var T=d.
repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.length-b)*h+
1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&_!==-1;_--,E++)
S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var AE=vE,_E=AE;let IE=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},CE=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return dg(this,e)}},
TE=class{decoders;constructor(e){this.decoders=e}or(e){return dg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function dg(r,e){return new TE({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let ME=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new IE(e,t,n),this.decoder=new CE(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function hg({name:r,prefix:e,encode:t,decode:n}){return new ME(r,e,t,
n)}function Ba({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=_E(t,r,n);return hg({prefix:e,
name:r,encode:s,decode:o=>zu(i(o))})}function RE(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function BE(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function LE(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function vr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=LE(n,s);return hg(
{prefix:e,name:r,encode(o){return BE(o,n,t)},decode(o){return RE(o,i,t,r)}})}const lo=vr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});vr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});vr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const yc=Ba(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ba({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const zr=Ba({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ba({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var DE=fg,xh=128,PE=-128,$E=Math.pow(2,31);function fg(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=$E;)e[t++]=r&255|xh,r/=128;for(;r&PE;)e[t++]=r&255|xh,r>>>=7;return e[t]=r|0,fg.bytes=t-n+1,e}var NE=Al,
UE=128,Sh=127;function Al(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Al.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Sh)<<s:(o&Sh)*Math.pow(2,s),s+=7}while(o>=UE);return Al.bytes=i-n,t}var FE=Math.pow(
2,7),OE=Math.pow(2,14),zE=Math.pow(2,21),qE=Math.pow(2,28),jE=Math.pow(2,35),GE=Math.pow(2,42),WE=Math.pow(2,49),VE=Math.
pow(2,56),HE=Math.pow(2,63),KE=function(r){return r<FE?1:r<OE?2:r<zE?3:r<qE?4:r<jE?5:r<GE?6:r<WE?7:r<VE?8:r<HE?9:10},QE={
encode:DE,decode:NE,encodingLength:KE},Fo=QE;function _l(r,e=0){const t=Fo.decode(r,e),n=Fo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Oo(r,e,t=0){return Fo.encode(r,e,t),e}function zo(r){return Fo.encodingLength(r)}function JE(r,e){const t=e.
byteLength,n=zo(r),s=n+zo(t),i=new Uint8Array(s+t);return Oo(r,i,0),Oo(t,i,n),i.set(e,s),new qu(r,t,e,i)}function XE(r){
const e=zu(r),[t,n]=_l(e),[s,i]=_l(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new qu(t,s,o,e)}function YE(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&xE(r.bytes,t.bytes)}}let qu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
ai(n),this.bytes=ai(s)}};function vh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return ex(t,Il(r),e??zr.encoder);default:
return tx(t,Il(r),e??lo.encoder)}}const Ah=new WeakMap;function Il(r){const e=Ah.get(r);if(e==null){const t=new Map;return Ah.
set(r,t),t}return e}let Ns=class He{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=ai(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ws)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==rx)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return He.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=JE(e,
t);return He.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return He.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&YE(e.multihash,n.multihash)}toString(e){return vh(this,e)}toJSON(){return{"/":vh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof He)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new He(n,s,i,o??_h(n,s,i.bytes))}else if(t[nx]===!0){const{version:n,
multihash:s,code:i}=t,o=XE(s);return He.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ws)throw new Error(`Version 0 CID must use dag-pb (code: ${ws}) block encoding`);return new He(e,t,n,n.bytes)}case 1:{
const s=_h(e,t,n.bytes);return new He(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return He.
create(0,ws,e)}static createV1(e,t){return He.create(1,e,t)}static decode(e){const[t,n]=He.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=He.inspectBytes(e),n=t.size-t.multihashSize,
s=zu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new qu(t.multihashCode,t.digestSize,i,s);return[t.version===0?He.createV0(o):He.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=_l(e.subarray(t));return t+=h,d};let s=n(),
i=ws;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=ZE(e,t),
i=He.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Il(
i).set(n,e),i}};function ZE(r,e){switch(r[0]){case"Q":{const t=e??zr;return[zr.prefix,t.decode(`${zr.prefix}${r}`)]}case zr.
prefix:{const t=e??zr;return[zr.prefix,t.decode(r)]}case lo.prefix:{const t=e??lo;return[lo.prefix,t.decode(r)]}case yc.
prefix:{const t=e??yc;return[yc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function ex(r,e,t){const{prefix:n}=t;if(n!==
zr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function tx(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ws=112,rx=18;function _h(r,e,t){const n=zo(r),s=n+zo(e),i=new Uint8Array(s+t.
byteLength);return Oo(r,i,0),Oo(e,i,n),i.set(t,s),i}const nx=Symbol.for("@ipld/js-cid/CID"),sx=new TextDecoder;function ju(r,e){
let t=0;for(let n=0;;n+=7){if(n>=64)throw new Error("protobuf: varint overflow");if(e>=r.length)throw new Error("protobu\
f: unexpected end of data");const s=r[e++];if(t+=n<28?(s&127)<<n:(s&127)*2**n,s<128)break}return[t,e]}function qo(r,e){let t;
[t,e]=ju(r,e);const n=e+t;if(t<0||n<0)throw new Error("protobuf: invalid length");if(n>r.length)throw new Error("protobu\
f: unexpected end of data");return[r.subarray(e,n),n]}function pg(r,e){let t;return[t,e]=ju(r,e),[t&7,t>>3,e]}function ix(r){
const e={},t=r.length;let n=0;for(;n<t;){let s,i;if([s,i,n]=pg(r,n),i===1){if(e.Hash)throw new Error("protobuf: (PBLink)\
 duplicate Hash section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Hash`);if(e.Name!==void 0)
throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");if(e.Tsize!==void 0)throw new Error("protobu\
f: (PBLink) invalid order, found Tsize before Hash");[e.Hash,n]=qo(r,n)}else if(i===2){if(e.Name!==void 0)throw new Error(
"protobuf: (PBLink) duplicate Name section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Name`);
if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");let o;[o,n]=qo(r,n),e.Name=
sx.decode(o)}else if(i===3){if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) duplicate Tsize section");if(s!==0)throw new Error(
`protobuf: (PBLink) wrong wireType (${s}) for Tsize`);[e.Tsize,n]=ju(r,n)}else throw new Error(`protobuf: (PBLink) inval\
id fieldNumber, expected 1, 2 or 3, got ${i}`)}if(n>t)throw new Error("protobuf: (PBLink) unexpected end of data");return e}
function ox(r){const e=r.length;let t=0,n,s=!1,i;for(;t<e;){let a,c;if([a,c,t]=pg(r,t),a!==2)throw new Error(`protobuf: \
(PBNode) invalid wireType, expected 2, got ${a}`);if(c===1){if(i)throw new Error("protobuf: (PBNode) duplicate Data sect\
ion");[i,t]=qo(r,t),n&&(s=!0)}else if(c===2){if(s)throw new Error("protobuf: (PBNode) duplicate Links section");n||(n=[]);
let l;[l,t]=qo(r,t),n.push(ix(l))}else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${c}`)}
if(t>e)throw new Error("protobuf: (PBNode) unexpected end of data");const o={};return i&&(o.Data=i),o.Links=n||[],o}const mg=new TextEncoder,
Ih=2**32,ax=2**31;function cx(r,e){let t=e.length;if(typeof r.Tsize=="number"){if(r.Tsize<0)throw new Error("Tsize canno\
t be negative");if(!Number.isSafeInteger(r.Tsize))throw new Error("Tsize too large for encoding");t=js(e,t,r.Tsize)-1,e[t]=
24}if(typeof r.Name=="string"){const n=mg.encode(r.Name);t-=n.length,e.set(n,t),t=js(e,t,n.length)-1,e[t]=18}return r.Hash&&
(t-=r.Hash.length,e.set(r.Hash,t),t=js(e,t,r.Hash.length)-1,e[t]=10),e.length-t}function Ch(r,e,t){return r-=e.Data.length,
t.set(e.Data,r),r=js(t,r,e.Data.length)-1,t[r]=10,r}function lx(r,e){const t=dx(r),n=new Uint8Array(t);let s=t;const i=e?.
fieldOrder==="data-first"?e.fieldOrder:"links-first";if(r.Data&&i==="links-first"&&(s=Ch(s,r,n)),r.Links)for(let o=r.Links.
length-1;o>=0;o--){const a=cx(r.Links[o],n.subarray(0,s));s-=a,s=js(n,s,a)-1,n[s]=18}return r.Data&&i==="data-first"&&(s=
Ch(s,r,n)),n}function ux(r){let e=0;if(r.Hash){const t=r.Hash.length;e+=1+t+zn(t)}if(typeof r.Name=="string"){const t=mg.
encode(r.Name).length;e+=1+t+zn(t)}return typeof r.Tsize=="number"&&(e+=1+zn(r.Tsize)),e}function dx(r){let e=0;if(r.Data){
const t=r.Data.length;e+=1+t+zn(t)}if(r.Links)for(const t of r.Links){const n=ux(t);e+=1+n+zn(n)}return e}function js(r,e,t){
e-=zn(t);const n=e;for(;t>=ax;)r[e++]=t&127|128,t/=128;for(;t>=128;)r[e++]=t&127|128,t>>>=7;return r[e]=t,n}function zn(r){
return r%2===0&&r++,Math.floor((hx(r)+6)/7)}function hx(r){let e=0;return r>=Ih&&(r=Math.floor(r/Ih),e=32),r>=65536&&(r>>>=
16,e+=16),r>=256&&(r>>>=8,e+=8),e+fx[r]}const fx=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],px=["Data","Links"],mx=["Hash","Name",
"Tsize"],Cl=new TextEncoder;function gg(r,e){if(r===e)return 0;const t=r.Name?Cl.encode(r.Name):[],n=e.Name?Cl.encode(e.
Name):[];let s=t.length,i=n.length;for(let o=0,a=Math.min(s,i);o<a;++o)if(t[o]!==n[o]){s=t[o],i=n[o];break}return s<i?-1:
i<s?1:0}function Th(r,e){return!Object.keys(r).some(t=>!e.includes(t))}function bg(r){if(typeof r.asCID=="object"){const t=Ns.
asCID(r);if(!t)throw new TypeError("Invalid DAG-PB form");return{Hash:t}}if(typeof r!="object"||Array.isArray(r))throw new TypeError(
"Invalid DAG-PB form");const e={};if(r.Hash){let t=Ns.asCID(r.Hash);try{t||(typeof r.Hash=="string"?t=Ns.parse(r.Hash):r.
Hash instanceof Uint8Array&&(t=Ns.decode(r.Hash)))}catch(n){throw new TypeError(`Invalid DAG-PB form: ${n.message}`)}t&&
(e.Hash=t)}if(!e.Hash)throw new TypeError("Invalid DAG-PB form");return typeof r.Name=="string"&&(e.Name=r.Name),typeof r.
Tsize=="number"&&(e.Tsize=r.Tsize),e}function rr(r){if((r instanceof Uint8Array||typeof r=="string")&&(r={Data:r}),typeof r!=
"object"||Array.isArray(r))throw new TypeError("Invalid DAG-PB form");const e={};if(r.Data!==void 0)if(typeof r.Data=="s\
tring")e.Data=Cl.encode(r.Data);else if(r.Data instanceof Uint8Array)e.Data=r.Data;else throw new TypeError("Invalid DAG\
-PB form");if(r.Links!==void 0)if(Array.isArray(r.Links))e.Links=r.Links.map(bg),e.Links.sort(gg);else throw new TypeError(
"Invalid DAG-PB form");else e.Links=[];return e}function yg(r){if(!r||typeof r!="object"||Array.isArray(r)||r instanceof
Uint8Array||r["/"]&&r["/"]===r.bytes)throw new TypeError("Invalid DAG-PB form");if(!Th(r,px))throw new TypeError("Invali\
d DAG-PB form (extraneous properties)");if(r.Data!==void 0&&!(r.Data instanceof Uint8Array))throw new TypeError("Invalid\
 DAG-PB form (Data must be bytes)");if(!Array.isArray(r.Links))throw new TypeError("Invalid DAG-PB form (Links must be a\
 list)");for(let e=0;e<r.Links.length;e++){const t=r.Links[e];if(!t||typeof t!="object"||Array.isArray(t)||t instanceof Uint8Array||
t["/"]&&t["/"]===t.bytes)throw new TypeError("Invalid DAG-PB form (bad link)");if(!Th(t,mx))throw new TypeError("Invalid\
 DAG-PB form (extraneous properties on link)");if(t.Hash===void 0)throw new TypeError("Invalid DAG-PB form (link must ha\
ve a Hash)");if(t.Hash==null||!t.Hash["/"]||t.Hash["/"]!==t.Hash.bytes)throw new TypeError("Invalid DAG-PB form (link Ha\
sh must be a CID)");if(t.Name!==void 0&&typeof t.Name!="string")throw new TypeError("Invalid DAG-PB form (link Name must\
 be a string)");if(t.Tsize!==void 0){if(typeof t.Tsize!="number"||t.Tsize%1!==0)throw new TypeError("Invalid DAG-PB form\
 (link Tsize must be an integer)");if(t.Tsize<0)throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)")}
if(e>0&&gg(t,r.Links[e-1])===-1)throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")}}function gx(r,e=[]){
return rr({Data:r,Links:e})}function bx(r,e,t){return bg({Hash:t,Name:r,Tsize:e})}function yx(r){return r instanceof ArrayBuffer?
new Uint8Array(r,0,r.byteLength):r}const wx="dag-pb",vi=112;function nr(r,e){yg(r);const t={};return r.Links&&(t.Links=r.
Links.map(n=>{const s={};return n.Hash&&(s.Hash=n.Hash.bytes),n.Name!==void 0&&(s.Name=n.Name),n.Tsize!==void 0&&(s.Tsize=
n.Tsize),s})),r.Data&&(t.Data=r.Data),lx(t,e)}function ci(r){const e=yx(r),t=ox(e),n={};return t.Data&&(n.Data=t.Data),t.
Links&&(n.Links=t.Links.map(s=>{const i={};try{i.Hash=Ns.decode(s.Hash)}catch{}if(!i.Hash)throw new Error("Invalid Hash \
field found in link, expected CID");return s.Name!==void 0&&(i.Name=s.Name),s.Tsize!==void 0&&(i.Tsize=s.Tsize),i})),n}const wg=Object.
freeze(Object.defineProperty({__proto__:null,code:vi,createLink:bx,createNode:gx,decode:ci,encode:nr,name:wx,prepare:rr,
validate:yg},Symbol.toStringTag,{value:"Module"}));function kx(r){return r[Symbol.asyncIterator]!=null}function Ex(r){if(kx(
r))return(async()=>{for await(const e of r)return e})();for(const e of r)return e}function xx(r){return r[Symbol.asyncIterator]!=
null}function kg(r,e=1){return e=Number(e),xx(r)?(async function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error(
"Batch size must be an integer");for await(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.
length>0;)yield t.slice(0,e),t=t.slice(e)})():(function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error("Bat\
ch size must be an integer");for(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.length>0;)
yield t.slice(0,e),t=t.slice(e)})()}async function*Eg(r,e=1){for await(const t of kg(r,e)){const n=t.map(async s=>s().then(
i=>({ok:!0,value:i}),i=>({ok:!1,err:i})));for(let s=0;s<n.length;s++){const i=await n[s];if(i.ok)yield i.value;else throw i.
err}}}function Cr(r=0){return new Uint8Array(r)}function jo(r=0){return new Uint8Array(r)}function Sx(r){return r?.buffer instanceof
ArrayBuffer}function vx(r){if(Sx(r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Mh(r,e){
e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=jo(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return vx(t)}function Ax(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
const xg=Symbol.for("@achingbrain/uint8arraylist");function Rh(r,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("ind\
ex is out of bounds")}function Fi(r){return!!r?.[xg]}let wc=class uo{bufs;length;[xg]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(Fi(
n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())
if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Fi(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Rh(this.
bufs,e);return t.buf[t.index]}set(e,t){const n=Rh(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Fi(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return Mh(n,s)}subarray(e,t){const{bufs:n,length:s}=this.
_subList(e,t);return n.length===1?n[0]:Mh(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new uo;return i.
length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const d=e-a;n.push(
o.subarray(d,d+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(
o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Fi(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let d=0;d<
i;d++)o[d]=-1;for(let d=0;d<s;d++)o[n[d]]=d;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let d=t;d<=
c;d+=u){u=0;for(let h=l;h>=0;h--){const p=this.get(d+h);if(n[h]!==p){u=Math.max(1,h-a[p]);break}}if(u===0)return d}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=jo(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Cr(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Cr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Cr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=jo(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Cr(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Cr(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Cr(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Cr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Cr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof uo)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!Ax(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new uo;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const Sg=1,vg=BigInt(34),Ag=8,_g=262144,_x="links-b\
ytes",Ig=262144,Ix=1048576,Cx=50,Tx=10,Mx=!0,Rx=!0,Bx=!1,Lx="file",Dx="links-first",Cg=(r={})=>{const e=r.chunkSize??Ig;
return async function*(n){let s=new wc,i=0,o=!1;for await(const a of n)for(s.append(a),i+=a.length;i>=e;)if(yield s.subarray(
0,e),o=!0,e===s.length)s=new wc,i=0;else{const l=new wc;l.append(s.sublist(e)),s=l,i-=e}(!o||i>0)&&(yield s.subarray(0,i))}};
function Px(r){return r.buffer instanceof ArrayBuffer}function Tg(r){return Px(r)?r:r.slice()}class li extends Error{static name="\
InvalidTypeError";static code="ERR_INVALID_TYPE";name=li.name;code=li.code;constructor(e="Invalid type"){super(e)}}function Go(r=0){
return new Uint8Array(r)}const $x=Math.pow(2,7),Nx=Math.pow(2,14),Ux=Math.pow(2,21),Mg=Math.pow(2,28),Rg=Math.pow(2,35),
Bg=Math.pow(2,42),Lg=Math.pow(2,49),nt=128,Tr=127;function Gu(r){if(r<$x)return 1;if(r<Nx)return 2;if(r<Ux)return 3;if(r<
Mg)return 4;if(r<Rg)return 5;if(r<Bg)return 6;if(r<Lg)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Fx(r,e,t=0){switch(Gu(r)){case 8:e[t++]=r&255|nt,r/=128;case 7:
e[t++]=r&255|nt,r/=128;case 6:e[t++]=r&255|nt,r/=128;case 5:e[t++]=r&255|nt,r/=128;case 4:e[t++]=r&255|nt,r>>>=7;case 3:
e[t++]=r&255|nt,r>>>=7;case 2:e[t++]=r&255|nt,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function Ox(r,e){let t=r[e],n=0;if(n+=t&Tr,t<nt||(t=r[e+1],n+=(t&Tr)<<7,t<nt)||(t=r[e+2],n+=(t&Tr)<<14,t<
nt)||(t=r[e+3],n+=(t&Tr)<<21,t<nt)||(t=r[e+4],n+=(t&Tr)*Mg,t<nt)||(t=r[e+5],n+=(t&Tr)*Rg,t<nt)||(t=r[e+6],n+=(t&Tr)*Bg,t<
nt)||(t=r[e+7],n+=(t&Tr)*Lg,t<nt))return n;throw new RangeError("Could not decode varint")}const Wu=new Float32Array([-0]),
Hr=new Uint8Array(Wu.buffer);function zx(r,e,t){Wu[0]=r,e[t]=Hr[0],e[t+1]=Hr[1],e[t+2]=Hr[2],e[t+3]=Hr[3]}function qx(r,e){
return Hr[0]=r[e],Hr[1]=r[e+1],Hr[2]=r[e+2],Hr[3]=r[e+3],Wu[0]}const Vu=new Float64Array([-0]),Ye=new Uint8Array(Vu.buffer);
function jx(r,e,t){Vu[0]=r,e[t]=Ye[0],e[t+1]=Ye[1],e[t+2]=Ye[2],e[t+3]=Ye[3],e[t+4]=Ye[4],e[t+5]=Ye[5],e[t+6]=Ye[6],e[t+
7]=Ye[7]}function Gx(r,e){return Ye[0]=r[e],Ye[1]=r[e+1],Ye[2]=r[e+2],Ye[3]=r[e+3],Ye[4]=r[e+4],Ye[5]=r[e+5],Ye[6]=r[e+6],
Ye[7]=r[e+7],Vu[0]}const Wx=BigInt(Number.MAX_SAFE_INTEGER),Vx=BigInt(Number.MIN_SAFE_INTEGER);class tt{lo;hi;constructor(e,t){
this.lo=e>>>0,this.hi=t>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&
(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return cn;if(e<Wx&&e>Vx)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>Bh&&(s=0n,++n>Bh&&(n=0n))),new tt(Number(s),Number(n))}static fromNumber(e){
if(e===0)return cn;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new tt(n,s)}static from(e){return typeof e=="number"?tt.fromNumber(e):typeof e=="bigint"?tt.
fromBigInt(e):typeof e=="string"?tt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new tt(e.low>>>0,e.high>>>0):cn}}const cn=new tt(
0,0);cn.toBigInt=function(){return 0n};cn.zzEncode=cn.zzDecode=function(){return this};cn.length=function(){return 1};const Bh=4294967296n;
function Hx(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function Kx(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Dg(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Ft(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function Oi(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}class Qx{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Tg(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Ft(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Ft(this,4);return Oi(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Ft(
this,4);return Oi(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Ft(this,4);const e=qx(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Ft(this,4);const e=Gx(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Ft(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return Kx(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Ft(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Ft(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new tt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Ft(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Ft(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Ft(this,8);const e=Oi(this.buf,this.pos+=4),t=Oi(this.buf,this.pos+=4);return new tt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Ox(this.buf,this.pos);
return this.pos+=Gu(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Pg(r){return new Qx(r instanceof Uint8Array?r:
r.subarray())}function as(r,e,t){const n=Pg(r);return e.decode(n,void 0,t)}function Tl(r){if(r instanceof Uint8Array&&r.
constructor.name==="Uint8Array")return Dh(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return Dh(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function Jx(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const Lh=4096;function Xx(r){const e=r.
length;if(e<=Lh)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=Lh));return t}function Yx(r){return r?.buffer instanceof ArrayBuffer}function Dh(r){return Yx(r)?r:r.slice()}
function Zx(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=
256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;
for(var T=d.repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.
length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&
_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var eS=Zx,tS=eS;let rS=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},nS=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return $g(this,e)}},
sS=class{decoders;constructor(e){this.decoders=e}or(e){return $g(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function $g(r,e){return new sS({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let iS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new rS(e,t,n),this.decoder=new nS(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function La({name:r,prefix:e,encode:t,decode:n}){return new iS(r,e,t,
n)}function Ai({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=tS(t,r,n);return La({prefix:e,
name:r,encode:s,decode:o=>Tl(i(o))})}function oS(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function aS(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function cS(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Oe({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=cS(n,s);return La(
{prefix:e,name:r,encode(o){return aS(o,n,t)},decode(o){return oS(o,i,t,r)}})}const lS=Ai({prefix:"9",name:"base10",alphabet:"\
0123456789"}),uS=Object.freeze(Object.defineProperty({__proto__:null,base10:lS},Symbol.toStringTag,{value:"Module"})),dS=Oe(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),hS=Oe({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),fS=Object.freeze(Object.defineProperty({__proto__:null,
base16:dS,base16upper:hS},Symbol.toStringTag,{value:"Module"})),pS=Oe({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
mS=Object.freeze(Object.defineProperty({__proto__:null,base2:pS},Symbol.toStringTag,{value:"Module"})),Ng=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),gS=Ng.reduce((r,e,t)=>(r[t]=e,r),[]),bS=Ng.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function yS(r){return r.reduce((e,t)=>(e+=gS[t],e),"")}function wS(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=bS[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const kS=La({prefix:"🚀",name:"\
base256emoji",encode:yS,decode:wS}),ES=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:kS},Symbol.toStringTag,
{value:"Module"})),xS=Oe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
SS=Oe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),vS=Oe(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),AS=Oe({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),_S=Oe({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),IS=Oe({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),CS=Oe({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),TS=Oe({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),MS=Oe({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),RS=Object.freeze(Object.defineProperty({__proto__:null,
base32:xS,base32hex:_S,base32hexpad:CS,base32hexpadupper:TS,base32hexupper:IS,base32pad:vS,base32padupper:AS,base32upper:SS,
base32z:MS},Symbol.toStringTag,{value:"Module"})),BS=Ai({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),LS=Ai({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
DS=Object.freeze(Object.defineProperty({__proto__:null,base36:BS,base36upper:LS},Symbol.toStringTag,{value:"Module"})),PS=Ai(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),$S=Ai({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),NS=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:PS,base58flickr:$S},Symbol.toStringTag,{value:"Module"})),US=Oe({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),FS=Oe({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),OS=Oe({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),zS=Oe({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),qS=Object.freeze(Object.defineProperty(
{__proto__:null,base64:US,base64pad:FS,base64url:OS,base64urlpad:zS},Symbol.toStringTag,{value:"Module"})),jS=Oe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),GS=Object.freeze(Object.defineProperty({__proto__:null,base8:jS},Symbol.
toStringTag,{value:"Module"})),WS=La({prefix:"\0",name:"identity",encode:r=>Xx(Tl(r)),decode:r=>Tl(Jx(r))}),VS=Object.freeze(
Object.defineProperty({__proto__:null,identity:WS},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Ph={...VS,...mS,...GS,...uS,...fS,...RS,...DS,...NS,...qS,...ES};function Ug(r,e,t,n){return{name:r,prefix:e,encoder:{
name:r,prefix:e,encode:t},decoder:{decode:n}}}const $h=Ug("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().
encode(r.substring(1))),kc=Ug("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},
r=>{r=r.substring(1);const e=Go(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),HS={utf8:$h,"utf-8":$h,
hex:Ph.base16,latin1:kc,ascii:kc,binary:kc,...Ph};function KS(r,e="utf8"){const t=HS[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function QS(r){let n,s=8192;return function(o){if(o<
1||o>4096)return Go(o);s+o>8192&&(n=Go(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Us{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}}function Ec(){}class JS{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const XS=QS();function YS(r){return globalThis.Buffer!=null?Go(
r):XS(r)}class Ml{len;head;tail;states;constructor(){this.len=0,this.head=new Us(Ec,0,0),this.tail=this.head,this.states=
null}_push(e,t,n){return this.tail=this.tail.next=new Us(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new ev((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(zi,10,
tt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=tt.fromBigInt(e);return this.
_push(zi,t.length(),t)}uint64Number(e){return this._push(Fx,Gu(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=tt.
fromBigInt(e).zzEncode();return this._push(zi,t.length(),t)}sint64Number(e){const t=tt.fromNumber(e).zzEncode();return this.
_push(zi,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(xc,1,e?1:0)}fixed32(e){return this.
_push(ks,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=tt.fromBigInt(e);return this._push(ks,4,t.lo)._push(
ks,4,t.hi)}fixed64Number(e){const t=tt.fromNumber(e);return this._push(ks,4,t.lo)._push(ks,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(zx,4,e)}double(e){return this._push(jx,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(xc,1,0):this.uint32(t)._push(tv,t,e)}string(e){const t=Hx(e);return t!==0?this.uint32(t)._push(Dg,t,e):this.
_push(xc,1,0)}fork(){return this.states=new JS(this),this.head=this.tail=new Us(Ec,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Us(Ec,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=YS(this.len);
let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}}function xc(r,e,t){e[t]=r&255}function ZS(r,e,t){for(;r>
127;)e[t++]=r&127|128,r>>>=7;e[t]=r}class ev extends Us{next;constructor(e,t){super(ZS,e,t),this.next=void 0}}function zi(r,e,t){
for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>
7;e[t++]=r.lo}function ks(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function tv(r,e,t){e.set(r,
t)}globalThis.Buffer!=null&&(Ml.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(rv,
e,r),this},Ml.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(
nv,e,r),this});function rv(r,e,t){e.set(r,t)}function nv(r,e,t){r.length<40?Dg(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):
e.set(KS(r),t)}function sv(){return new Ml}function cs(r,e){const t=sv();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}
function*ls(r,e,t){const n=Pg(r);yield*e.stream(n,void 0,".",t)}const Fg={VARINT:0,LENGTH_DELIMITED:2};function Og(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function iv(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Og("enum",Fg.VARINT,t,n,s)}function us(r,e,t){return Og("message",Fg.LENGTH_DELIMITED,r,e,
t)}class es extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var Ze;(function(r){(function(o){o.RAW="RAW",o.DIRECTORY=
"DIRECTORY",o.FILE="FILE",o.METADATA="METADATA",o.SYMLINK="SYMLINK",o.HAMT_SHARD="HAMT_SHARD"})(r.Type||(r.Type={}));let e;
(function(o){o[o.RAW=0]="RAW",o[o.DIRECTORY=1]="DIRECTORY",o[o.FILE=2]="FILE",o[o.METADATA=3]="METADATA",o[o.SYMLINK=4]=
"SYMLINK",o[o.HAMT_SHARD=5]="HAMT_SHARD"})(e||(e={})),(function(o){o.codec=()=>iv(e)})(r.Type||(r.Type={}));let t;r.codec=
()=>(t==null&&(t=us((o,a,c={})=>{if(c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),r.Type.codec().encode(o.
type,a)),o.data!=null&&(a.uint32(18),a.bytes(o.data)),o.fileSize!=null&&(a.uint32(24),a.uint64(o.fileSize)),o.blockSizes!=
null&&o.blockSizes.length>0)for(const l of o.blockSizes)a.uint32(32),a.uint64(l);o.hashType!=null&&(a.uint32(40),a.uint64(
o.hashType)),o.fanOut!=null&&(a.uint32(48),a.uint64(o.fanOut)),o.mode!=null&&(a.uint32(56),a.uint32(o.mode)),o.mtime!=null&&
(a.uint32(66),Gs.codec().encode(o.mtime,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={blockSizes:[]},u=a==
null?o.len:o.pos+a;for(;o.pos<u;){const d=o.uint32();switch(d>>>3){case 1:{l.type=r.Type.codec().decode(o);break}case 2:{
l.data=o.bytes();break}case 3:{l.fileSize=o.uint64();break}case 4:{if(c.limits?.blockSizes!=null&&l.blockSizes.length===
c.limits.blockSizes)throw new es('Decode error - repeated field "blockSizes" had too many elements');l.blockSizes.push(o.
uint64());break}case 5:{l.hashType=o.uint64();break}case 6:{l.fanOut=o.uint64();break}case 7:{l.mode=o.uint32();break}case 8:{
l.mtime=Gs.codec().decode(o,o.uint32(),{limits:c.limits?.mtime});break}default:{o.skipType(d&7);break}}}return l},function*(o,a,c,l={}){
const u={blockSizes:0},d=a==null?o.len:o.pos+a;for(c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-1):c,type:"\
start",message:"UnixFS"});o.pos<d;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}type`,value:r.Type.codec().
decode(o)};break}case 2:{yield{field:`${c}data`,value:o.bytes()};break}case 3:{yield{field:`${c}fileSize`,value:o.uint64()};
break}case 4:{if(l.limits?.blockSizes!=null&&u.blockSizes===l.limits.blockSizes)throw new es('Streaming decode error - r\
epeated field "blockSizes" had too many elements');yield{field:`${c}blockSizes[]`,index:u.blockSizes,value:o.uint64()},u.
blockSizes++;break}case 5:{yield{field:`${c}hashType`,value:o.uint64()};break}case 6:{yield{field:`${c}fanOut`,value:o.uint64()};
break}case 7:{yield{field:`${c}mode`,value:o.uint32()};break}case 8:{yield*Gs.codec().stream(o,o.uint32(),`${c}mtime.`,{
limits:l.limits?.mtime});break}default:{o.skipType(h&7);break}}}c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-
1):c,type:"end",message:"UnixFS"})})),t);function n(o){return cs(o,r.codec())}r.encode=n;function s(o,a){return as(o,r.codec(),
a)}r.decode=s;function i(o,a){return ls(o,r.codec(),a)}r.stream=i})(Ze||(Ze={}));var Gs;(function(r){let e;r.codec=()=>(e==
null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.seconds!=null&&(o.uint32(8),o.int64(i.seconds)),i.fractionalNanoseconds!=
null&&(o.uint32(21),o.fixed32(i.fractionalNanoseconds)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?
i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.seconds=i.int64();break}case 2:{a.fractionalNanoseconds=
i.fixed32();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"UnixTime"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}seconds`,value:i.int64()};break}case 2:{yield{field:`${a}fractionalNanoseconds`,value:i.
fixed32()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"UnixTime"})})),e);function t(i){return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}
r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=s})(Gs||(Gs={}));var Nh;(function(r){let e;r.codec=()=>(e==
null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.mimeType!=null&&(o.uint32(10),o.string(i.mimeType)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.mimeType=
i.string();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Metadata"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}mimeType`,value:i.string()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Metadata"})})),e);function t(i){return cs(i,r.codec())}
r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=s})(Nh||
(Nh={}));var Qr;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.hash!=null&&
(o.uint32(10),o.bytes(i.hash)),i.name!=null&&(o.uint32(18),o.string(i.name)),i.tSize!=null&&(o.uint32(24),o.uint64(i.tSize)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{a.hash=i.bytes();break}case 2:{a.name=i.string();break}case 3:{a.tSize=i.uint64();break}default:{i.skipType(l&
7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"Link"});i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{yield{field:`${a}hash`,
value:i.bytes()};break}case 2:{yield{field:`${a}name`,value:i.string()};break}case 3:{yield{field:`${a}tSize`,value:i.uint64()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Link"})})),e);function t(i){return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){
return ls(i,r.codec(),o)}r.stream=s})(Qr||(Qr={}));var ui;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{if(a.
lengthDelimited!==!1&&o.fork(),i.data!=null&&(o.uint32(10),Ze.codec().encode(i.data,o)),i.links!=null&&i.links.length>0)
for(const c of i.links)o.uint32(18),Qr.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.data=Ze.codec().decode(i,i.uint32(),{limits:a.
limits?.data});break}case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new es('Decode error - repe\
ated field "links" had too many elements');c.links.push(Qr.codec().decode(i,i.uint32(),{limits:a.limits?.links$}));break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.
endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Node"});i.pos<u;){const d=i.uint32();switch(d>>>3){case 1:{
yield*Ze.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}case 2:{if(c.limits?.links!=null&&l.links===
c.limits.links)throw new es('Streaming decode error - repeated field "links" had too many elements');for(const h of Qr.codec().
stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}default:{i.skipType(
d&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Node"})})),e);function t(i){
return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),
o)}r.stream=s})(ui||(ui={}));var Uh;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.links!=null&&i.links.length>0)for(const c of i.links)o.uint32(18),Qr.codec().encode(c,o);i.data!=null&&(o.uint32(
10),Ze.codec().encode(i.data,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},l=o==null?i.len:i.pos+
o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new es(
'Decode error - repeated field "links" had too many elements');c.links.push(Qr.codec().decode(i,i.uint32(),{limits:a.limits?.
links$}));break}case 1:{c.data=Ze.codec().decode(i,i.uint32(),{limits:a.limits?.data});break}default:{i.skipType(u&7);break}}}
return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"LegacyNode"});i.pos<u;){const d=i.uint32();switch(d>>>3){case 2:{if(c.limits?.links!=
null&&l.links===c.limits.links)throw new es('Streaming decode error - repeated field "links" had too many elements');for(const h of Qr.
codec().stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}case 1:{
yield*Ze.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}default:{i.skipType(d&7);break}}}a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"LegacyNode"})})),e);function t(i){return cs(
i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=
s})(Uh||(Uh={}));const Fh={RAW:"raw",DIRECTORY:"directory",FILE:"file",METADATA:"metadata",SYMLINK:"symlink",HAMT_SHARD:"\
hamt-sharded-directory"},ov=["directory","hamt-sharded-directory"],Oh=parseInt("0644",8),zh=parseInt("0755",8);class lt{static unmarshal(e){
const t=Ze.decode(e),n=new lt({type:Fh[t.type!=null?t.type.toString():"FILE"],data:t.data,blockSizes:t.blockSizes,mode:t.
mode,mtime:t.mtime!=null?{secs:t.mtime.seconds??0n,nsecs:t.mtime.fractionalNanoseconds}:void 0,fanout:t.fanOut});return n.
_originalMode=t.mode??0,n}type;data;blockSizes;hashType;fanout;mtime;_mode;_originalMode;constructor(e={type:"file"}){const{
type:t,data:n,blockSizes:s,hashType:i,fanout:o,mtime:a,mode:c}=e;if(t!=null&&!Object.values(Fh).includes(t))throw new li(
"Type: "+t+" is not valid");this.type=t??"file",this.hashType=i,this.fanout=o,this.blockSizes=s??[],this._originalMode=0,
this.mode=c,this.mtime=a,n!=null&&(this.data=Tg(n))}set mode(e){e==null?this._mode=this.isDirectory()?zh:Oh:this._mode=e&
4095}get mode(){return this._mode}isDirectory(){return ov.includes(this.type)}addBlockSize(e){this.blockSizes.push(e)}removeBlockSize(e){
this.blockSizes.splice(e,1)}fileSize(){if(this.isDirectory())return 0n;let e=0n;return this.blockSizes.forEach(t=>{e+=t}),
this.data!=null&&(e+=BigInt(this.data.length)),e}marshal(){let e;switch(this.type){case"raw":e=Ze.Type.RAW;break;case"di\
rectory":e=Ze.Type.DIRECTORY;break;case"file":e=Ze.Type.FILE;break;case"metadata":e=Ze.Type.METADATA;break;case"symlink":
e=Ze.Type.SYMLINK;break;case"hamt-sharded-directory":e=Ze.Type.HAMT_SHARD;break;default:throw new li(`Type: ${e} is not \
valid`)}let t=this.data;(this.data==null||this.data.length===0)&&(t=void 0);let n;this.mode!=null&&(n=this._originalMode&
4294963200|(this.mode??0),n===Oh&&!this.isDirectory()&&(n=void 0),n===zh&&this.isDirectory()&&(n=void 0));let s;return this.
mtime!=null&&(s={seconds:this.mtime.secs,fractionalNanoseconds:this.mtime.nsecs}),Ze.encode({type:e,data:t,fileSize:this.
type==="file"||this.type==="raw"?this.fileSize():void 0,blockSizes:this.blockSizes,hashType:this.hashType,fanOut:this.fanout,
mode:n,mtime:s})}}function av(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function pn(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return di(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return di(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function cv(r){const e=new Uint8Array(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}const qh=4096;function lv(r){const e=r.length;if(e<=qh)return String.fromCharCode.
apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=qh));return t}function uv(r){
return r?.buffer instanceof ArrayBuffer}function di(r){return uv(r)?r:r.slice()}const dv="raw",Rl=85;function hv(r){return pn(
r)}function fv(r){return pn(r)}const pv=Object.freeze(Object.defineProperty({__proto__:null,code:Rl,decode:fv,encode:hv,
name:dv},Symbol.toStringTag,{value:"Module"}));class sr extends Event{type;detail;constructor(e,t){super(e),this.type=e,
this.detail=t}}function mv(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==
0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-
w;M!==A&&S[M]===0;)M++;for(var T=d.repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.
length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&
_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var gv=mv,bv=gv;let yv=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},wv=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return zg(this,e)}},
kv=class{decoders;constructor(e){this.decoders=e}or(e){return zg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function zg(r,e){return new kv({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let Ev=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new yv(e,t,n),this.decoder=new wv(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Da({name:r,prefix:e,encode:t,decode:n}){return new Ev(r,e,t,
n)}function _i({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=bv(t,r,n);return Da({prefix:e,
name:r,encode:s,decode:o=>pn(i(o))})}function xv(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Sv(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function vv(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function ze({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=vv(n,s);return Da(
{prefix:e,name:r,encode(o){return Sv(o,n,t)},decode(o){return xv(o,i,t,r)}})}const Ws=ze({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),Av=ze({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),_v=ze({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Iv=ze({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Cv=ze({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Tv=ze({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Mv=ze({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Rv=ze({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Bv=ze({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),Lv=Object.freeze(Object.defineProperty({__proto__:null,base32:Ws,base32hex:Cv,base32hexpad:Mv,
base32hexpadupper:Rv,base32hexupper:Tv,base32pad:_v,base32padupper:Iv,base32upper:Av,base32z:Bv},Symbol.toStringTag,{value:"\
Module"})),ho=_i({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),Dv=_i({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),Pv=Object.freeze(Object.defineProperty(
{__proto__:null,base36:ho,base36upper:Dv},Symbol.toStringTag,{value:"Module"})),mr=_i({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),$v=_i({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Nv=Object.freeze(Object.defineProperty({__proto__:null,base58btc:mr,
base58flickr:$v},Symbol.toStringTag,{value:"Module"}));var Uv=qg,jh=128,Fv=-128,Ov=Math.pow(2,31);function qg(r,e,t){e=e||
[],t=t||0;for(var n=t;r>=Ov;)e[t++]=r&255|jh,r/=128;for(;r&Fv;)e[t++]=r&255|jh,r>>>=7;return e[t]=r|0,qg.bytes=t-n+1,e}var zv=Bl,
qv=128,Gh=127;function Bl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Bl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Gh)<<s:(o&Gh)*Math.pow(2,s),s+=7}while(o>=qv);return Bl.bytes=i-n,t}var jv=Math.pow(
2,7),Gv=Math.pow(2,14),Wv=Math.pow(2,21),Vv=Math.pow(2,28),Hv=Math.pow(2,35),Kv=Math.pow(2,42),Qv=Math.pow(2,49),Jv=Math.
pow(2,56),Xv=Math.pow(2,63),Yv=function(r){return r<jv?1:r<Gv?2:r<Wv?3:r<Vv?4:r<Hv?5:r<Kv?6:r<Qv?7:r<Jv?8:r<Xv?9:10},Zv={
encode:Uv,decode:zv,encodingLength:Yv},Wo=Zv;function Ll(r,e=0){const t=Wo.decode(r,e),n=Wo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Vo(r,e,t=0){return Wo.encode(r,e,t),e}function Ho(r){return Wo.encodingLength(r)}function jg(r,e){const t=e.
byteLength,n=Ho(r),s=n+Ho(t),i=new Uint8Array(s+t);return Vo(r,i,0),Vo(t,i,n),i.set(e,s),new Hu(r,t,e,i)}function e2(r){
const e=pn(r),[t,n]=Ll(e),[s,i]=Ll(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Hu(t,s,o,e)}function t2(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&av(r.bytes,t.bytes)}}let Hu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
di(n),this.bytes=di(s)}};function Wh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return s2(t,Dl(r),e??mr.encoder);default:
return i2(t,Dl(r),e??Ws.encoder)}}const Vh=new WeakMap;function Dl(r){const e=Vh.get(r);if(e==null){const t=new Map;return Vh.
set(r,t),t}return e}let r2=class Ke{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=di(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Es)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==o2)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ke.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=jg(e,
t);return Ke.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ke.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&t2(e.multihash,n.multihash)}toString(e){return Wh(this,e)}toJSON(){return{"/":Wh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ke)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ke(n,s,i,o??Hh(n,s,i.bytes))}else if(t[a2]===!0){const{version:n,
multihash:s,code:i}=t,o=e2(s);return Ke.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Es)throw new Error(`Version 0 CID must use dag-pb (code: ${Es}) block encoding`);return new Ke(e,t,n,n.bytes)}case 1:{
const s=Hh(e,t,n.bytes);return new Ke(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ke.
create(0,Es,e)}static createV1(e,t){return Ke.create(1,e,t)}static decode(e){const[t,n]=Ke.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ke.inspectBytes(e),n=t.size-t.multihashSize,
s=pn(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Hu(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ke.createV0(o):Ke.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Ll(e.subarray(t));return t+=h,d};let s=n(),
i=Es;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=n2(e,t),
i=Ke.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Dl(
i).set(n,e),i}};function n2(r,e){switch(r[0]){case"Q":{const t=e??mr;return[mr.prefix,t.decode(`${mr.prefix}${r}`)]}case mr.
prefix:{const t=e??mr;return[mr.prefix,t.decode(r)]}case Ws.prefix:{const t=e??Ws;return[Ws.prefix,t.decode(r)]}case ho.
prefix:{const t=e??ho;return[ho.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function s2(r,e,t){const{prefix:n}=t;if(n!==
mr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function i2(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const Es=112,o2=18;function Hh(r,e,t){const n=Ho(r),s=n+Ho(e),i=new Uint8Array(s+t.
byteLength);return Vo(r,i,0),Vo(e,i,n),i.set(t,s),i}const a2=Symbol.for("@ipld/js-cid/CID"),c2=20;function l2({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new u2(r,e,t,n,s)}let u2=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??c2,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Kh(n,this.code,t?.truncate):n.then(s=>Kh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Kh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return jg(e,r)}function d2(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const h2=l2({name:"sha2-256",code:18,encode:d2("SHA-256")}),Zr=async(r,e,t)=>{t.codec==null&&(t.codec=
wg);const n=await h2.digest(r),s=r2.create(t.cidVersion??Sg,t.codec.code,n);return await e.put(s,r,t),s};function f2(r){
return async function*(t,n){let s=0n;for await(let i of t.content)yield async()=>{let o;const a={codec:wg,cidVersion:r.cidVersion,
onProgress:r.onProgress};r.rawLeaves?(a.codec=pv,a.cidVersion=1):(o=new lt({type:r.leafType,data:i}),i=nr({Data:o.marshal(),
Links:[]},r));const c=await Zr(i,n,a);return s+=BigInt(i.byteLength),r.onProgress?.(new sr("unixfs:importer:progress:fil\
e:write",{bytesWritten:s,cid:c,path:t.path})),{cid:c,unixfs:o,size:BigInt(i.length),block:i}}}}let p2=class Pl extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Pl.name;code=Pl.code;constructor(e="Invalid parameters"){super(
e)}};class wr extends Error{static name="InvalidContentError";static code="ERR_INVALID_CONTENT";name=wr.name;code=wr.code;constructor(e="\
Invalid content"){super(e)}}class Qh extends Error{static name="InvalidShardingStrategyError";static code="ERR_SHARDING_\
STRATEGY";name=wr.name;code=wr.code}const m2=async(r,e,t)=>{const n=new lt({type:"directory",mtime:r.mtime,mode:r.mode}),
s=nr(rr({Data:n.marshal()}),t),i=await Zr(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.
originalPath,block:s}};async function*g2(r,e,t){let n=-1,s;for await(const i of Eg(t.bufferImporter(r,e),t.blockWriteConcurrency)){
if(n++,n===0){s={...i,single:!0};continue}else n===1&&s!=null&&(yield{...s,block:void 0,single:void 0},s=void 0);yield{...i,
block:void 0}}s!=null&&(yield s)}function Jh(r){return r.single===!0}const b2=(r,e,t)=>async function(s){if(s.length===1&&
Jh(s[0])&&t.reduceSingleLeafToSelf){const u=s[0];let d=u.block;return Jh(u)&&(r.mtime!==void 0||r.mode!==void 0)&&(u.unixfs=
new lt({type:"file",mtime:r.mtime,mode:r.mode,data:u.block}),d={Data:u.unixfs.marshal(),Links:[]},u.block=nr(rr(d),t),u.
cid=await Zr(u.block,e,{...t,cidVersion:t.cidVersion}),u.size=BigInt(u.block.length)),t.onProgress?.(new sr("unixfs:impo\
rter:progress:file:layout",{cid:u.cid,path:r.originalPath})),{cid:u.cid,path:r.path,unixfs:u.unixfs,size:u.size,originalPath:r.
originalPath}}const i=new lt({type:"file",mtime:r.mtime,mode:r.mode}),o=s.filter(u=>u.cid.code===Rl&&u.size>0||u.unixfs!=
null&&u.unixfs.data==null&&u.unixfs.fileSize()>0n?!0:!!u.unixfs?.data?.length).map(u=>u.cid.code===Rl?(i.addBlockSize(u.
size),{Name:"",Tsize:Number(u.size),Hash:u.cid}):(u.unixfs?.data==null?i.addBlockSize(u.unixfs?.fileSize()??0n):i.addBlockSize(
BigInt(u.unixfs.data.length)),{Name:"",Tsize:Number(u.size),Hash:u.cid})),a={Data:i.marshal(),Links:o},c=nr(rr(a),t),l=await Zr(
c,e,t);return t.onProgress?.(new sr("unixfs:importer:progress:file:layout",{cid:l,path:r.originalPath})),{cid:l,path:r.path,
unixfs:i,size:BigInt(c.length+a.Links.reduce((u,d)=>u+(d.Tsize??0),0)),originalPath:r.originalPath,block:c}},y2=async(r,e,t)=>t.
layout(g2(r,e,t),b2(r,e,t)),w2=_i({prefix:"9",name:"base10",alphabet:"0123456789"}),k2=Object.freeze(Object.defineProperty(
{__proto__:null,base10:w2},Symbol.toStringTag,{value:"Module"})),E2=ze({prefix:"f",name:"base16",alphabet:"0123456789abc\
def",bitsPerChar:4,caseInsensitive:!0}),x2=ze({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
S2=Object.freeze(Object.defineProperty({__proto__:null,base16:E2,base16upper:x2},Symbol.toStringTag,{value:"Module"})),v2=ze(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),A2=Object.freeze(Object.defineProperty({__proto__:null,base2:v2},
Symbol.toStringTag,{value:"Module"})),Gg=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
_2=Gg.reduce((r,e,t)=>(r[t]=e,r),[]),I2=Gg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return r[n]=t,r},[]);function C2(r){return r.reduce((e,t)=>(e+=_2[t],e),"")}function T2(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=I2[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const M2=Da({prefix:"🚀",name:"\
base256emoji",encode:C2,decode:T2}),R2=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:M2},Symbol.toStringTag,
{value:"Module"})),B2=ze({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),L2=ze({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),D2=ze({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),P2=ze({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),$2=Object.freeze(Object.defineProperty({__proto__:null,base64:B2,base64pad:L2,
base64url:D2,base64urlpad:P2},Symbol.toStringTag,{value:"Module"})),N2=ze({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
U2=Object.freeze(Object.defineProperty({__proto__:null,base8:N2},Symbol.toStringTag,{value:"Module"})),F2=Da({prefix:"\0",
name:"identity",encode:r=>lv(pn(r)),decode:r=>pn(cv(r))}),O2=Object.freeze(Object.defineProperty({__proto__:null,identity:F2},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Xh={...O2,...A2,...U2,...k2,...S2,...Lv,...Pv,
...Nv,...$2,...R2};function Wg(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const Yh=Wg(
"utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Sc=Wg("ascii","a",r=>{let e="\
a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=jo(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}),z2={utf8:Yh,"utf-8":Yh,hex:Xh.base16,latin1:Sc,ascii:Sc,binary:Sc,...Xh};function Vg(r,e="\
utf8"){const t=z2[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}
const q2=async(r,e,t)=>{const n=new lt({type:"symlink",data:Vg(r.link),mtime:r.mtime,mode:r.mode}),s=nr(rr({Data:n.marshal()})),
i=await Zr(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.originalPath,block:s}};function j2(r){
return Symbol.iterator in r}function G2(r){return Symbol.asyncIterator in r}function W2(r){try{if(r instanceof Uint8Array)
return(async function*(){yield r})();if(j2(r))return(async function*(){yield*r})();if(G2(r))return r}catch{throw new wr(
"Content was invalid")}throw new wr("Content was invalid")}function V2(r){return typeof r.path=="string"}function H2(r){
return async function*(t,n){for await(const s of t){let i;if(V2(s)&&(i=s.path,s.path=s.path.split("/").filter(o=>o!=null&&
o!==".").join("/")),K2(s)){const o={path:s.path,mtime:s.mtime,mode:s.mode,content:(async function*(){let c=0n;for await(const l of r.
chunker(r.chunkValidator(W2(s.content)))){const u=BigInt(l.byteLength);c+=u,r.onProgress?.(new sr("unixfs:importer:progr\
ess:file:read",{bytesRead:c,chunkSize:u,path:s.path})),yield l}})(),originalPath:i},a=r.fileBuilder??y2;yield async()=>a(
o,n,r)}else if(Q2(s)){const o={path:s.path,link:s.link,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.symlinkBuilder??q2;
yield async()=>a(o,n,r)}else if(s.path!=null){const o={path:s.path,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.dirBuilder??
m2;yield async()=>a(o,n,r)}else throw new Error("Import candidate must have content or path or both")}}}function K2(r){return r.
content!=null}function Q2(r){return r.link!=null}const J2=()=>async function*(e){for await(const t of e){if(t.length===void 0)
throw new wr("Content was invalid");if(typeof t=="string"||t instanceof String)yield Vg(t.toString());else if(Array.isArray(
t))yield Uint8Array.from(t);else if(t instanceof Uint8Array)yield t;else throw new wr("Content was invalid")}},X2=174;function Hg(r){
const e=r?.maxChildrenPerNode??X2;return async function t(n,s){const i=[];for await(const o of kg(n,e))i.push(await s(o));
return i.length>1?t(i,s):i[0]}}class hi{options;root;dir;path;dirty;flat;parent;parentKey;unixfs;mode;mtime;cid;size;nodeSize;constructor(e,t){
this.options=t??{},this.root=e.root,this.dir=e.dir,this.path=e.path,this.dirty=e.dirty,this.flat=e.flat,this.parent=e.parent,
this.parentKey=e.parentKey,this.unixfs=e.unixfs,this.mode=e.mode,this.mtime=e.mtime}}const Zh=2**32,Y2=[0,1,2,2,3,3,3,3,
4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8];function Z2(r){let e=0;return r>=Zh&&(r=Math.floor(r/Zh),e=32),r>=65536&&(r>>>=16,e+=16),r>=256&&(r>>>=
8,e+=8),e+Y2[r]}function Kr(r){return r%2===0&&r++,Math.floor((Z2(r)+6)/7)}function vc(r){let e=0;for(let t=0;t<r.length;t++){
const n=r.charCodeAt(t);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319&&t+1<r.length?(t++,e+=4):e+=3}return e}function eA(r,e,t){
let n=1+Kr(e)+e;return n+=1+Kr(r)+r,n+=1+Kr(t),1+Kr(n)+n}const tA=493;function rA(r,e){let t=2;if(r!==void 0&&r!==tA&&(t+=
1+Kr(r)),e!=null){let n=0;const s=Number(e.secs);s<0?n+=11:n+=1+Kr(s),e.nsecs!=null&&(n+=5),t+=1+Kr(n)+n}return 1+Kr(t)+
t}function Ac(r,e){return e?.cid!=null&&e?.size!=null?r+e.cid.byteLength:0}function _c(r,e){return e?.cid!=null&&e?.size!=
null?eA(r,e.cid.byteLength,Number(e.size)):0}class Ku extends hi{_children;constructor(e,t){super(e,t),this._children=new Map}async put(e,t){
if(this.nodeSize!==void 0){const n=this._children.get(e),s=vc(e),i=this.options?.shardSplitStrategy;if(i==="links-bytes")
this.nodeSize-=Ac(s,n),this.nodeSize+=Ac(s,t);else if(i==="block-bytes")this.nodeSize-=_c(s,n),this.nodeSize+=_c(s,t);else
throw new Qh(`Invalid shardSplitStrategy: ${i}`);this.nodeSize<0&&(this.nodeSize=void 0)}this.cid=void 0,this.size=void 0,
this._children.set(e,t)}async get(e){return Promise.resolve(this._children.get(e))}childCount(){return this._children.size}directChildrenCount(){
return this.childCount()}onlyChild(){return this._children.values().next().value}*eachChildSeries(){for(const[e,t]of this.
_children.entries())yield{key:e,child:t}}marshal(){const e=new lt({type:"directory",mtime:this.mtime,mode:this.mode}),t=[];
for(const[s,i]of this._children.entries())if(!(i.size==null||i.cid==null)){if(i.cid==null)throw new Error("Directory con\
tents must be flushed before marshaling");t.push({Hash:i.cid,Name:s,Tsize:i.size==null?void 0:Number(i.size)})}const n={
Data:e.marshal(),Links:t};return nr(rr(n),this.options)}async estimateNodeSize(){if(this.nodeSize!==void 0)return this.nodeSize;
const e=this.options?.shardSplitStrategy;if(e==="links-bytes"){this.nodeSize=0;for(const[t,n]of this._children.entries())
this.nodeSize+=Ac(vc(t),n)}else if(e==="block-bytes"){this.nodeSize=rA(this.mode,this.mtime);for(const[t,n]of this._children.
entries())this.nodeSize+=_c(vc(t),n)}else throw new Qh(`Invalid shardSplitStrategy: ${e}`);return this.nodeSize}async*flush(e){
const t=[];for(const[c,l]of this._children.entries()){let u=l;if(l instanceof hi)for await(const d of l.flush(e))u=d,yield d;
u.size!=null&&u.cid!=null&&t.push({Name:c,Tsize:Number(u.size),Hash:u.cid})}const n=new lt({type:"directory",mtime:this.
mtime,mode:this.mode}),s={Data:n.marshal(),Links:t},i=nr(rr(s),this.options),o=await Zr(i,e,this.options),a=i.length+s.Links.
reduce((c,l)=>c+(l.Tsize??0),0);this.cid=o,this.size=a,yield{cid:o,unixfs:n,path:this.path,size:BigInt(a)}}}function nA(r){
return r?.buffer instanceof ArrayBuffer}function ef(r){return nA(r)?r:r.slice()}var sA=Kg,tf=128,iA=-128,oA=Math.pow(2,31);
function Kg(r,e,t){e=e||[],t=t||0;for(var n=t;r>=oA;)e[t++]=r&255|tf,r/=128;for(;r&iA;)e[t++]=r&255|tf,r>>>=7;return e[t]=
r|0,Kg.bytes=t-n+1,e}var aA=$l,cA=128,rf=127;function $l(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw $l.bytes=
0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&rf)<<s:(o&rf)*Math.pow(2,s),s+=7}while(o>=cA);return $l.
bytes=i-n,t}var lA=Math.pow(2,7),uA=Math.pow(2,14),dA=Math.pow(2,21),hA=Math.pow(2,28),fA=Math.pow(2,35),pA=Math.pow(2,42),
mA=Math.pow(2,49),gA=Math.pow(2,56),bA=Math.pow(2,63),yA=function(r){return r<lA?1:r<uA?2:r<dA?3:r<hA?4:r<fA?5:r<pA?6:r<
mA?7:r<gA?8:r<bA?9:10},wA={encode:sA,decode:aA,encodingLength:yA},Qg=wA;function nf(r,e,t=0){return Qg.encode(r,e,t),e}function sf(r){
return Qg.encodingLength(r)}function kA(r,e){const t=e.byteLength,n=sf(r),s=n+sf(t),i=new Uint8Array(s+t);return nf(r,i,
0),nf(t,i,n),i.set(e,s),new EA(r,t,e,i)}let EA=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,
this.digest=ef(n),this.bytes=ef(s)}};const xA=20;function SA({name:r,code:e,encode:t,minDigestLength:n,maxDigestLength:s}){
return new vA(r,e,t,n,s)}class vA{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){this.name=e,this.
code=t,this.encode=n,this.minDigestLength=s??xA,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){if(t.truncate<this.
minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.
maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?of(n,
this.code,t?.truncate):n.then(s=>of(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}function of(r,e,t){
if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${r.
byteLength}`);r=r.subarray(0,t)}return kA(e,r)}function Mr(r,e){const t=r.lo+e.lo>>>0,n=r.hi+e.hi+(t<r.lo?1:0)>>>0;return{
lo:t,hi:n}}function Tt(r,e){const t=r.lo&65535,n=r.lo>>>16,s=e.lo&65535,i=e.lo>>>16,o=t*s,a=t*i,c=n*s,l=n*i,u=(o>>>16)+(a&
65535)+(c&65535)>>>0,d=(u<<16|o&65535)>>>0,h=l+(a>>>16)+(c>>>16)+(u>>>16),p=Math.imul(r.lo,e.hi),g=Math.imul(r.hi,e.lo),
y=h+p+g>>>0;return{lo:d,hi:y}}function Tn(r,e){if(e===0)return r;if(e===32)return{lo:r.hi,hi:r.lo};if(e<32){const s=(r.lo<<
e|r.hi>>>32-e)>>>0,i=(r.hi<<e|r.lo>>>32-e)>>>0;return{lo:s,hi:i}}e-=32;const t=(r.hi<<e|r.lo>>>32-e)>>>0,n=(r.lo<<e|r.hi>>>
32-e)>>>0;return{lo:t,hi:n}}function be(r,e){return{lo:(r.lo^e.lo)>>>0,hi:(r.hi^e.hi)>>>0}}function Ic(r,e){return{lo:r.
hi>>>e-32,hi:0}}function fe(r,e){return{lo:r>>>0,hi:e>>>0}}function af(r,e){const t=e*8,n=r[t]|r[t+1]<<8|r[t+2]<<16|r[t+
3]<<24,s=r[t+4]|r[t+5]<<8|r[t+6]<<16|r[t+7]<<24;return{lo:n>>>0,hi:s>>>0}}function cf(r){return r=be(r,Ic(r,33)),r=Tt(r,
fe(3981806797,4283543511)),r=be(r,Ic(r,33)),r=Tt(r,fe(444984403,3301882366)),r=be(r,Ic(r,33)),r}function AA(r,e=0){let t=fe(
e,0),n=fe(e,0);const s=r.length,i=Math.floor(s/16),o=fe(289559509,2277735313),a=fe(658871167,1291169091);for(let h=0;h<i;h++){
let p=af(r,h*2),g=af(r,h*2+1);p=Tt(p,o),p=Tn(p,31),p=Tt(p,a),t=be(t,p),t=Tn(t,27),t=Mr(t,n),t=Mr(Tt(t,fe(5,0)),fe(1390208809,
0)),g=Tt(g,a),g=Tn(g,33),g=Tt(g,o),n=be(n,g),n=Tn(n,31),n=Mr(n,t),n=Mr(Tt(n,fe(5,0)),fe(944331445,0))}let c=fe(0,0),l=fe(
0,0);const u=r.slice(i*16);switch(u.length){case 15:l=be(l,fe(0,u[14]<<16));case 14:l=be(l,fe(0,u[13]<<8));case 13:l=be(
l,fe(0,u[12]));case 12:l=be(l,fe(u[11]<<24,0));case 11:l=be(l,fe(u[10]<<16,0));case 10:l=be(l,fe(u[9]<<8,0));case 9:l=be(
l,fe(u[8],0)),l=Tt(l,a),l=Tn(l,33),l=Tt(l,o),n=be(n,l);case 8:c=be(c,fe(0,u[7]<<24));case 7:c=be(c,fe(0,u[6]<<16));case 6:
c=be(c,fe(0,u[5]<<8));case 5:c=be(c,fe(0,u[4]));case 4:c=be(c,fe(u[3]<<24,0));case 3:c=be(c,fe(u[2]<<16,0));case 2:c=be(
c,fe(u[1]<<8,0));case 1:c=be(c,fe(u[0],0)),c=Tt(c,o),c=Tn(c,31),c=Tt(c,a),t=be(t,c)}const d=fe(s,0);return t=be(t,d),n=be(
n,d),t=Mr(t,n),n=Mr(n,t),t=cf(t),n=cf(n),t=Mr(t,n),n=Mr(n,t),new Uint8Array([t.hi>>>24&255,t.hi>>>16&255,t.hi>>>8&255,t.
hi&255,t.lo>>>24&255,t.lo>>>16&255,t.lo>>>8&255,t.lo&255,n.hi>>>24&255,n.hi>>>16&255,n.hi>>>8&255,n.hi&255,n.lo>>>24&255,
n.lo>>>16&255,n.lo>>>8&255,n.lo&255])}const Jg=SA({name:"murmur3-128",code:34,encode:r=>AA(r)});let _A=class Nl extends Error{static name="\
NotFoundError";name=Nl.name;static code="ERR_NOT_FOUND";code=Nl.code;constructor(e="Not Found"){super(e)}};class IA{has(e,t){
return Promise.reject(new Error(".has is not implemented"))}put(e,t,n){return Promise.reject(new Error(".put is not impl\
emented"))}async*putMany(e,t){for await(const{cid:n,bytes:s}of e)await this.put(n,s,t),yield n}get(e,t){throw new Error(
".get is not implemented")}async*getMany(e,t){for await(const n of e)yield{cid:n,bytes:this.get(n,t)}}delete(e,t){return Promise.
reject(new Error(".delete is not implemented"))}async*deleteMany(e,t){for await(const n of e)await this.delete(n,t),yield n}async*getAll(e){
throw new Error(".getAll is not implemented")}}class CA extends IA{put(e,t,n){return n?.signal?.throwIfAborted(),e}get(e,t){
throw t?.signal?.throwIfAborted(),new _A}has(e,t){return t?.signal?.throwIfAborted(),!1}async delete(e,t){t?.signal?.throwIfAborted()}async*getAll(e){
e?.signal?.throwIfAborted()}}function Xg(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.
default:r}var Cc,lf;function TA(){if(lf)return Cc;lf=1;const r=7;Cc=class{constructor(){this._bitArrays=[],this._data=[],
this._length=0,this._changedLength=!1,this._changedData=!1}set(o,a){let c=this._internalPositionFor(o,!1);if(a===void 0)
c!==-1&&(this._unsetInternalPos(c),this._unsetBit(o),this._changedLength=!0,this._changedData=!0);else{let l=!1;c===-1?(c=
this._data.length,this._setBit(o),this._changedData=!0):l=!0,this._setInternalPos(c,o,a,l),this._changedLength=!0}}unset(o){
this.set(o,void 0)}get(o){this._sortData();const a=this._internalPositionFor(o,!0);if(a!==-1)return this._data[a][1]}push(o){
return this.set(this.length,o),this.length}get length(){if(this._sortData(),this._changedLength){const o=this._data[this.
_data.length-1];this._length=o?o[0]+1:0,this._changedLength=!1}return this._length}forEach(o){let a=0;for(;a<this.length;)
o(this.get(a),a,this),a++}map(o){let a=0,c=new Array(this.length);for(;a<this.length;)c[a]=o(this.get(a),a,this),a++;return c}reduce(o,a){
let c=0,l=a;for(;c<this.length;){const u=this.get(c);l=o(l,u,c),c++}return l}find(o){let a=0,c,l;for(;a<this.length&&!c;)
l=this.get(a),c=o(l),a++;return c?l:void 0}_internalPositionFor(o,a){const c=this._bytePosFor(o,a);if(c>=this._bitArrays.
length)return-1;const l=this._bitArrays[c],u=o-c*r;if(!((l&1<<u)>0))return-1;const h=this._bitArrays.slice(0,c).reduce(e,
0),p=~(4294967295<<u+1),g=t(l&p);return h+g-1}_bytePosFor(o,a){const c=Math.floor(o/r),l=c+1;for(;!a&&this._bitArrays.length<
l;)this._bitArrays.push(0);return c}_setBit(o){const a=this._bytePosFor(o,!1);this._bitArrays[a]|=1<<o-a*r}_unsetBit(o){
const a=this._bytePosFor(o,!1);this._bitArrays[a]&=~(1<<o-a*r)}_setInternalPos(o,a,c,l){const u=this._data,d=[a,c];if(l)
this._sortData(),u[o]=d;else{if(u.length)if(u[u.length-1][0]>=a)u.push(d);else if(u[0][0]<=a)u.unshift(d);else{const h=Math.
round(u.length/2);this._data=u.slice(0,h).concat(d).concat(u.slice(h))}else this._data.push(d);this._changedData=!0,this.
_changedLength=!0}}_unsetInternalPos(o){this._data.splice(o,1)}_sortData(){this._changedData&&this._data.sort(n),this._changedData=
!1}bitField(){const o=[];let a=8,c=0,l=0,u;const d=this._bitArrays.slice();for(;d.length||c;){c===0&&(u=d.shift(),c=7);const p=Math.
min(c,a),g=~(255<<p),y=u&g;l|=y<<8-a,u=u>>>p,c-=p,a-=p,(!a||!c&&!d.length)&&(o.push(l),l=0,a=8)}for(var h=o.length-1;h>0&&
o[h]===0;h--)o.pop();return o}compactArray(){return this._sortData(),this._data.map(s)}};function e(i,o){return i+t(o)}function t(i){
let o=i;return o=o-(o>>1&1431655765),o=(o&858993459)+(o>>2&858993459),(o+(o>>4)&252645135)*16843009>>24}function n(i,o){
return i[0]-o[0]}function s(i){return i[1]}return Cc}var MA=TA();const RA=Xg(MA);function Ul(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return df(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return df(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function BA(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const uf=4096;function LA(r){const e=r.
length;if(e<=uf)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=uf));return t}function DA(r){return r?.buffer instanceof ArrayBuffer}function df(r){return DA(r)?r:r.slice()}
function PA(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=
256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;
for(var T=d.repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.
length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&
_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var $A=PA,NA=$A;let UA=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},FA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Yg(this,e)}},
OA=class{decoders;constructor(e){this.decoders=e}or(e){return Yg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Yg(r,e){return new OA({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let zA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new UA(e,t,n),this.decoder=new FA(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Pa({name:r,prefix:e,encode:t,decode:n}){return new zA(r,e,t,
n)}function Ii({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=NA(t,r,n);return Pa({prefix:e,
name:r,encode:s,decode:o=>Ul(i(o))})}function qA(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function jA(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function GA(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function qe({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=GA(n,s);return Pa(
{prefix:e,name:r,encode(o){return jA(o,n,t)},decode(o){return qA(o,i,t,r)}})}const WA=Ii({prefix:"9",name:"base10",alphabet:"\
0123456789"}),VA=Object.freeze(Object.defineProperty({__proto__:null,base10:WA},Symbol.toStringTag,{value:"Module"})),HA=qe(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),KA=qe({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),QA=Object.freeze(Object.defineProperty({__proto__:null,
base16:HA,base16upper:KA},Symbol.toStringTag,{value:"Module"})),JA=qe({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
XA=Object.freeze(Object.defineProperty({__proto__:null,base2:JA},Symbol.toStringTag,{value:"Module"})),Zg=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),YA=Zg.reduce((r,e,t)=>(r[t]=e,r),[]),ZA=Zg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function e8(r){return r.reduce((e,t)=>(e+=YA[t],e),"")}function t8(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=ZA[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const r8=Pa({prefix:"🚀",name:"\
base256emoji",encode:e8,decode:t8}),n8=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:r8},Symbol.toStringTag,
{value:"Module"})),s8=qe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
i8=qe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),o8=qe(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),a8=qe({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),c8=qe({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),l8=qe({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),u8=qe({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),d8=qe({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),h8=qe({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),f8=Object.freeze(Object.defineProperty({__proto__:null,
base32:s8,base32hex:c8,base32hexpad:u8,base32hexpadupper:d8,base32hexupper:l8,base32pad:o8,base32padupper:a8,base32upper:i8,
base32z:h8},Symbol.toStringTag,{value:"Module"})),p8=Ii({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),m8=Ii({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
g8=Object.freeze(Object.defineProperty({__proto__:null,base36:p8,base36upper:m8},Symbol.toStringTag,{value:"Module"})),b8=Ii(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),y8=Ii({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),w8=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:b8,base58flickr:y8},Symbol.toStringTag,{value:"Module"})),k8=qe({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),E8=qe({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),x8=qe({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),S8=qe({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),v8=Object.freeze(Object.defineProperty(
{__proto__:null,base64:k8,base64pad:E8,base64url:x8,base64urlpad:S8},Symbol.toStringTag,{value:"Module"})),A8=qe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),_8=Object.freeze(Object.defineProperty({__proto__:null,base8:A8},Symbol.
toStringTag,{value:"Module"})),I8=Pa({prefix:"\0",name:"identity",encode:r=>LA(Ul(r)),decode:r=>Ul(BA(r))}),C8=Object.freeze(
Object.defineProperty({__proto__:null,identity:I8},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const hf={...C8,...XA,..._8,...VA,...QA,...f8,...g8,...w8,...v8,...n8};function eb(r=0){return new Uint8Array(r)}function tb(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const ff=tb("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Tc=tb("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=eb(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),T8={utf8:ff,"utf-8":ff,hex:hf.base16,latin1:Tc,ascii:Tc,binary:Tc,...hf};function M8(r,e="utf8"){const t=T8[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}class yt{_options;_popCount;_parent;_posAtParent;_children;key;constructor(e,t,n=0){
this._options=e,this._popCount=0,this._parent=t,this._posAtParent=n,this._children=new RA,this.key=null}async put(e,t){const n=await this.
_findNewBucketAndPos(e);n.bucket._putAt(n,e,t)}async get(e){const t=await this._findChild(e);if(t!=null)return t.value}async del(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);n!=null&&n.key===e&&t.bucket._delAt(t.pos)}leafCount(){return this.
_children.compactArray().reduce((t,n)=>n instanceof yt?t+n.leafCount():t+1,0)}childrenCount(){return this._children.length}onlyChild(){
return this._children.get(0)}*eachLeafSeries(){const e=this._children.compactArray();for(const t of e)t instanceof yt?yield*t.
eachLeafSeries():yield t}serialize(e,t){const n=[];return t(this._children.reduce((s,i,o)=>(i!=null&&(i instanceof yt?s.
push(i.serialize(e,t)):s.push(e(i,o))),s),n))}async asyncTransform(e,t){return rb(this,e,t)}toJSON(){return this.serialize(
B8,L8)}prettyPrint(){return JSON.stringify(this.toJSON(),null,"  ")}tableSize(){return Math.pow(2,this._options.bits)}async _findChild(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);if(!(n instanceof yt)&&n!=null&&n.key===e)return n}async _findPlace(e){
const t=this._options.hash(typeof e=="string"?M8(e):e),n=await t.take(this._options.bits),s=this._children.get(n);return s instanceof
yt?s._findPlace(t):{bucket:this,pos:n,hash:t,existingChild:s}}async _findNewBucketAndPos(e){const t=await this._findPlace(
e);if(t.existingChild!=null&&t.existingChild.key!==e){const n=new yt(this._options,t.bucket,t.pos);t.bucket._putObjectAt(
t.pos,n);const s=await n._findPlace(t.existingChild.hash);return s.bucket._putAt(s,t.existingChild.key,t.existingChild.value),
n._findNewBucketAndPos(t.hash)}return t}_putAt(e,t,n){this._putObjectAt(e.pos,{key:t,value:n,hash:e.hash})}_putObjectAt(e,t){
this._children.get(e)==null&&this._popCount++,this._children.set(e,t)}_delAt(e){if(e===-1)throw new Error("Invalid posit\
ion");this._children.get(e)!=null&&this._popCount--,this._children.unset(e),this._level()}_level(){if(this._parent!=null&&
this._popCount<=1)if(this._popCount===1){const e=this._children.find(R8);if(e!=null&&!(e instanceof yt)){const t=e.hash;
t.untake(this._options.bits);const n={pos:this._posAtParent,hash:t,bucket:this._parent};this._parent._putAt(n,e.key,e.value)}}else
this._parent._delAt(this._posAtParent)}_at(e){return this._children.get(e)}}function R8(r){return!!r}function B8(r,e){return r.
key}function L8(r){return r}async function rb(r,e,t){const n=[];for(const s of r._children.compactArray())if(s instanceof
yt)await rb(s,e,t);else{const i=await e(s);n.push({bitField:r._children.bitField(),children:i})}return t(n)}function D8(r){
return r?.buffer instanceof ArrayBuffer}function P8(r){if(D8(r))return r;const e=r.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function $8(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=eb(e);let n=0;for(const s of r)t.set(
s,n),n+=s.length;return P8(t)}const N8=[255,254,252,248,240,224,192,128],U8=[1,3,7,15,31,63,127,255];class F8{_value;_currentBytePos;_currentBitPos;constructor(e){
this._value=e,this._currentBytePos=e.length-1,this._currentBitPos=7}availableBits(){return this._currentBitPos+1+this._currentBytePos*
8}totalBits(){return this._value.length*8}take(e){let t=e,n=0;for(;t>0&&this._haveBits();){const s=this._value[this._currentBytePos],
i=this._currentBitPos+1,o=Math.min(i,t),a=O8(s,i-o,o);n=(n<<o)+a,t-=o,this._currentBitPos-=o,this._currentBitPos<0&&(this.
_currentBitPos=7,this._currentBytePos--)}return n}untake(e){for(this._currentBitPos+=e;this._currentBitPos>7;)this._currentBitPos-=
8,this._currentBytePos+=1}_haveBits(){return this._currentBytePos>=0}}function O8(r,e,t){const n=z8(e,t);return(r&n)>>>e}
function z8(r,e){return N8[r]&U8[Math.min(e+r-1,7)]}function q8(r){function e(t){return t instanceof pf?t:new pf(t,r)}return e}
class pf{_value;_hashFn;_depth;_availableBits;_currentBufferIndex;_buffers;constructor(e,t){if(!(e instanceof Uint8Array))
throw new Error("can only hash Uint8Arrays");this._value=e,this._hashFn=t,this._depth=-1,this._availableBits=0,this._currentBufferIndex=
0,this._buffers=[]}async take(e){let t=e;for(;this._availableBits<t;)await this._produceMoreBits();let n=0;for(;t>0;){const s=this.
_buffers[this._currentBufferIndex],i=Math.min(s.availableBits(),t),o=s.take(i);n=(n<<i)+o,t-=i,this._availableBits-=i,s.
availableBits()===0&&this._currentBufferIndex++}return n}untake(e){let t=e;for(;t>0;){const n=this._buffers[this._currentBufferIndex],
s=Math.min(n.totalBits()-n.availableBits(),t);n.untake(s),t-=s,this._availableBits+=s,this._currentBufferIndex>0&&n.totalBits()===
n.availableBits()&&(this._depth--,this._currentBufferIndex--)}}async _produceMoreBits(){this._depth++;const e=this._depth>
0?$8([this._value,Uint8Array.from([this._depth])]):this._value,t=await this._hashFn(e),n=new F8(t);this._buffers.push(n),
this._availableBits+=n.availableBits()}}function nb(r){if(r==null||r.hashFn==null)throw new Error("please define an opti\
ons.hashFn");const e={bits:r.bits??8,hash:q8(r.hashFn)};return new yt(e)}async function j8(r){return(await Jg.encode(r)).
slice(0,8).reverse()}class G8 extends hi{bucket;constructor(e,t){super(e,t),this.bucket=nb({hashFn:j8,bits:t.shardFanoutBits??
Ag})}async put(e,t){this.cid=void 0,this.size=void 0,this.nodeSize=void 0,await this.bucket.put(e,t)}async get(e){return this.
bucket.get(e)}childCount(){return this.bucket.leafCount()}directChildrenCount(){return this.bucket.childrenCount()}onlyChild(){
return this.bucket.onlyChild()}*eachChildSeries(){for(const{key:e,value:t}of this.bucket.eachLeafSeries())yield{key:e,child:t}}async estimateNodeSize(){
if(this.nodeSize!==void 0)return this.nodeSize;const e=new CA,t=await ob(this.bucket,this,e,this.options);return this.nodeSize=
t.size,this.nodeSize}async*flush(e){for await(const t of sb(this.bucket,e,this,this.options))yield{...t,path:this.path}}}
async function*sb(r,e,t,n){const s=r._children,i=(r.tableSize()-1).toString(16).length,o=[];let a=0n;for(let g=0;g<s.length;g++){
const y=s.get(g);if(y==null)continue;const m=g.toString(16).toUpperCase().padStart(i,"0");if(y instanceof yt){let f;for await(const b of sb(
y,e,null,n))f=b;if(f==null)throw new Error("Could not flush sharded directory, no sub-shard found");o.push({Name:m,Tsize:Number(
f.size),Hash:f.cid}),a+=f.size}else if(ib(y.value)){const f=y.value;let b;for await(const k of f.flush(e))b=k,yield b;if(b==
null)throw new Error("Did not flush dir");const w=m+y.key;o.push({Name:w,Tsize:Number(b.size),Hash:b.cid}),a+=b.size}else{
const f=y.value;if(f.cid==null)continue;const b=m+y.key,w=f.size;o.push({Name:b,Tsize:Number(w),Hash:f.cid}),a+=BigInt(w??
0)}}const c=Uint8Array.from(s.bitField().reverse()),l=new lt({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),
hashType:vg,mtime:t?.mtime,mode:t?.mode}),u={Data:l.marshal(),Links:o},d=nr(rr(u),n),h=await Zr(d,e,n),p=BigInt(d.byteLength)+
a;yield{cid:h,unixfs:l,size:p}}function ib(r){return typeof r.flush=="function"}async function ob(r,e,t,n){const s=r._children,
i=(r.tableSize()-1).toString(16).length,o=[];let a=0;for(let h=0;h<s.length;h++){const p=s.get(h);if(p==null)continue;const g=h.
toString(16).toUpperCase().padStart(i,"0");if(p instanceof yt){const{size:y,cid:m}=await ob(p,null,t,n);o.push({Name:g,Tsize:Number(
y),Hash:m}),a+=g.length+m.byteLength}else if(ib(p.value)){const y=p.value,m=y.nodeSize;if(y.cid==null)throw new Error("C\
hild directory has not been persisted");o.push({Name:g+p.key,Tsize:Number(m),Hash:y.cid}),a+=g.length+y.cid.byteLength}else{
const y=p.value,m=g+p.key,f=y.size;o.push({Name:m,Tsize:Number(f),Hash:y.cid}),a+=g.length+y.cid.byteLength}}const c=Uint8Array.
from(s.bitField().reverse()),l=new lt({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),hashType:vg,mtime:e?.
mtime,mode:e?.mode}),u=nr(rr({Data:l.marshal(),Links:o}),n);return{cid:await Zr(u,t,n),size:n.shardSplitStrategy==="link\
s-bytes"?a:u.length}}async function ab(r,e){let t=e;const n=e.options.shardSplitThresholdBytes??_g;e instanceof Ku&&await e.
estimateNodeSize()>n&&(t=await W8(e));const s=t.parent;if(s!=null){if(t!==e){if(r!=null&&(r.parent=t),t.parentKey==null)
throw new Error("No parent key found");await s.put(t.parentKey,t)}return ab(t,s)}return t}async function W8(r){const e=new G8(
{root:r.root,dir:!0,parent:r.parent,parentKey:r.parentKey,path:r.path,dirty:r.dirty,flat:!1,mtime:r.mtime,mode:r.mode},r.
options);for(const{key:t,child:n}of r.eachChildSeries())await e.put(t,n);return e}const V8=(r="")=>r.split(/(?<!\\)\//).
filter(Boolean);async function H8(r,e,t){const n=V8(r.path??""),s=n.length-1;let i=e,o="";for(let a=0;a<n.length;a++){const c=n[a];
o+=`${o!==""?"/":""}${c}`;const l=a===s;if(i.dirty=!0,i.cid=void 0,i.size=void 0,l)await i.put(c,r),e=await ab(null,i);else{
let u=await i.get(c);(u==null||!(u instanceof hi))&&(u=new Ku({root:!1,dir:!0,parent:i,parentKey:c,path:o,dirty:!0,flat:!0,
mtime:u?.unixfs?.mtime,mode:u?.unixfs?.mode},t)),await i.put(c,u),i=u}}return e}async function*mf(r,e){if(!(r instanceof
hi)){r.unixfs?.isDirectory()===!0&&(yield r);return}yield*r.flush(e)}function K8(r){return async function*(t,n){let s=new Ku(
{root:!0,dir:!0,path:"",dirty:!0,flat:!0},r),i,o=!1;for await(const a of t){if(a==null)continue;const c=`${a.originalPath??
""}`.split("/")[0];c!=null&&c!==""&&(i==null?(i=c,o=!0):i!==c&&(o=!1)),s=await H8(a,s,r),a.unixfs?.isDirectory()!==!0&&(yield a)}
if(r.wrapWithDirectory||o&&s.childCount()>1)yield*mf(s,n);else for(const a of s.eachChildSeries())a!=null&&(yield*mf(a.child,
n))}}async function*Q8(r,e,t={}){let n;Symbol.asyncIterator in r||Symbol.iterator in r?n=r:n=[r];let s,i;t.profile==="un\
ixfs-v0-2015"?(t.shardSplitStrategy=t.shardSplitStrategy??"links-bytes",t.cidVersion=t.cidVersion??0,t.rawLeaves=t.rawLeaves??
!1,s=Ig,i=174,t.fieldOrder="links-first"):t.profile==="unixfs-v1-2025"&&(t.shardSplitStrategy=t.shardSplitStrategy??"blo\
ck-bytes",t.cidVersion=t.cidVersion??1,t.rawLeaves=t.rawLeaves??!0,s=Ix,i=1024,t.fieldOrder="links-first");const o=t.wrapWithDirectory??
Bx,a=t.shardSplitThresholdBytes??_g,c=t.shardSplitStrategy??_x,l=t.shardFanoutBits??Ag,u=t.cidVersion??Sg,d=t.rawLeaves??
Rx,h=t.leafType??Lx,p=t.fileImportConcurrency??Cx,g=t.blockWriteConcurrency??Tx,y=t.reduceSingleLeafToSelf??Mx,m=t.fieldOrder??
Dx,f=t.chunker??Cg({chunkSize:s}),b=t.chunkValidator??J2(),w=t.dagBuilder??H2({chunker:f,chunkValidator:b,wrapWithDirectory:o,
layout:t.layout??Hg({maxChildrenPerNode:i}),bufferImporter:t.bufferImporter??f2({cidVersion:u,rawLeaves:d,leafType:h,onProgress:t.
onProgress}),blockWriteConcurrency:g,reduceSingleLeafToSelf:y,cidVersion:u,onProgress:t.onProgress,dirBuilder:t.dirBuilder,
fileBuilder:t.fileBuilder,fieldOrder:m}),k=t.treeBuilder??K8({wrapWithDirectory:o,shardSplitThresholdBytes:a,shardSplitStrategy:c,
shardFanoutBits:l,cidVersion:u,onProgress:t.onProgress,fieldOrder:m});for await(const x of k(Eg(w(n,e),p),e))yield{cid:x.
cid,path:x.path,unixfs:x.unixfs,size:x.size}}async function J8(r,e,t={}){const n=await Ex(Q8([r],e,t));if(n==null)throw new p2(
"Nothing imported");return n}async function X8(r,e,t={}){return J8({content:r},e,t)}function Y8(r,e){if(r===e)return!0;if(r.
byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Qu(r){if(r instanceof
Uint8Array&&r.constructor.name==="Uint8Array")return fi(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.
isView(r))return fi(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function Z8(r){return r?.buffer instanceof ArrayBuffer}function fi(r){return Z8(r)?r:r.slice()}function e_(r,e,t){if(r.
length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>
0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;for(var T=d.
repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.length-b)*h+
1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&_!==-1;_--,E++)
S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var t_=e_,r_=t_;let n_=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},s_=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return cb(this,e)}},
i_=class{decoders;constructor(e){this.decoders=e}or(e){return cb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function cb(r,e){return new i_({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let o_=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new n_(e,t,n),this.decoder=new s_(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function lb({name:r,prefix:e,encode:t,decode:n}){return new o_(r,e,t,
n)}function $a({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=r_(t,r,n);return lb({prefix:e,
name:r,encode:s,decode:o=>Qu(i(o))})}function a_(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function c_(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function l_(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Ar({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=l_(n,s);return lb(
{prefix:e,name:r,encode(o){return c_(o,n,t)},decode(o){return a_(o,i,t,r)}})}const fo=Ar({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Ar({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Ar({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Ar({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Mc=$a(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});$a({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const qr=$a({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});$a({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var u_=ub,gf=128,d_=-128,h_=Math.pow(2,31);function ub(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=h_;)e[t++]=r&255|gf,r/=128;for(;r&d_;)e[t++]=r&255|gf,r>>>=7;return e[t]=r|0,ub.bytes=t-n+1,e}var f_=Fl,
p_=128,bf=127;function Fl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Fl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&bf)<<s:(o&bf)*Math.pow(2,s),s+=7}while(o>=p_);return Fl.bytes=i-n,t}var m_=Math.pow(
2,7),g_=Math.pow(2,14),b_=Math.pow(2,21),y_=Math.pow(2,28),w_=Math.pow(2,35),k_=Math.pow(2,42),E_=Math.pow(2,49),x_=Math.
pow(2,56),S_=Math.pow(2,63),v_=function(r){return r<m_?1:r<g_?2:r<b_?3:r<y_?4:r<w_?5:r<k_?6:r<E_?7:r<x_?8:r<S_?9:10},A_={
encode:u_,decode:f_,encodingLength:v_},Ko=A_;function Ol(r,e=0){const t=Ko.decode(r,e),n=Ko.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Qo(r,e,t=0){return Ko.encode(r,e,t),e}function Jo(r){return Ko.encodingLength(r)}function __(r,e){const t=e.
byteLength,n=Jo(r),s=n+Jo(t),i=new Uint8Array(s+t);return Qo(r,i,0),Qo(t,i,n),i.set(e,s),new Ju(r,t,e,i)}function db(r){
const e=Qu(r),[t,n]=Ol(e),[s,i]=Ol(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Ju(t,s,o,e)}function I_(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&Y8(r.bytes,t.bytes)}}let Ju=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
fi(n),this.bytes=fi(s)}};function yf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return T_(t,zl(r),e??qr.encoder);default:
return M_(t,zl(r),e??fo.encoder)}}const wf=new WeakMap;function zl(r){const e=wf.get(r);if(e==null){const t=new Map;return wf.
set(r,t),t}return e}let mn=class Qe{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=fi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
xs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==R_)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Qe.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=__(e,
t);return Qe.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Qe.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&I_(e.multihash,n.multihash)}toString(e){return yf(this,e)}toJSON(){return{"/":yf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Qe)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Qe(n,s,i,o??kf(n,s,i.bytes))}else if(t[B_]===!0){const{version:n,
multihash:s,code:i}=t,o=db(s);return Qe.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==xs)throw new Error(`Version 0 CID must use dag-pb (code: ${xs}) block encoding`);return new Qe(e,t,n,n.bytes)}case 1:{
const s=kf(e,t,n.bytes);return new Qe(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Qe.
create(0,xs,e)}static createV1(e,t){return Qe.create(1,e,t)}static decode(e){const[t,n]=Qe.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Qe.inspectBytes(e),n=t.size-t.multihashSize,
s=Qu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Ju(t.multihashCode,t.digestSize,i,s);return[t.version===0?Qe.createV0(o):Qe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Ol(e.subarray(t));return t+=h,d};let s=n(),
i=xs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=C_(e,t),
i=Qe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return zl(
i).set(n,e),i}};function C_(r,e){switch(r[0]){case"Q":{const t=e??qr;return[qr.prefix,t.decode(`${qr.prefix}${r}`)]}case qr.
prefix:{const t=e??qr;return[qr.prefix,t.decode(r)]}case fo.prefix:{const t=e??fo;return[fo.prefix,t.decode(r)]}case Mc.
prefix:{const t=e??Mc;return[Mc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function T_(r,e,t){const{prefix:n}=t;if(n!==
qr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function M_(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const xs=112,R_=18;function kf(r,e,t){const n=Jo(r),s=n+Jo(e),i=new Uint8Array(s+t.
byteLength);return Qo(r,i,0),Qo(e,i,n),i.set(t,s),i}const B_=Symbol.for("@ipld/js-cid/CID");class pi extends Error{static name="\
BadPathError";static code="ERR_BAD_PATH";name=pi.name;code=pi.code;constructor(e="Bad path"){super(e)}}let En=class ql extends Error{static name="\
NotFoundError";static code="ERR_NOT_FOUND";name=ql.name;code=ql.code;constructor(e="Not found"){super(e)}};class mi extends Error{static name="\
NoResolverError";static code="ERR_NO_RESOLVER";name=mi.name;code=mi.code;constructor(e="No resolver"){super(e)}}class Be extends Error{static name="\
NotUnixFSError";static code="ERR_NOT_UNIXFS";name=Be.name;code=Be.code;constructor(e="Not UnixFS"){super(e)}}class Xo extends Error{static name="\
OverReadError";static code="ERR_OVER_READ";name=Xo.name;code=Xo.code;constructor(e="Over read"){super(e)}}class Yo extends Error{static name="\
UnderReadError";static code="ERR_UNDER_READ";name=Yo.name;code=Yo.code;constructor(e="Under read"){super(e)}}let Fs=class jl extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=jl.name;code=jl.code;constructor(e="Invalid parameters"){super(
e)}};const L_=["Object","Uint8Array","RegExp","Date","Error","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayB\
uffer","DataView","Promise","URL","HTMLElement","Int8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array",
"Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Tagged"];function hb(r){if(r===null)return"\
null";if(r===void 0)return"undefined";if(r===!0||r===!1)return"boolean";const e=typeof r;if(e==="string"||e==="number"||
e==="bigint"||e==="symbol")return e;if(e==="function")return"Function";if(Array.isArray(r))return"Array";if(r instanceof
Uint8Array)return"Uint8Array";if(r.constructor===Object)return"Object";const t=D_(r);return t||"Object"}function D_(r){const e=Object.
prototype.toString.call(r).slice(8,-1);if(L_.includes(e))return e}class v{constructor(e,t,n){this.major=e,this.majorEncoded=
e<<5,this.name=t,this.terminal=n}toString(){return`Type[${this.major}].${this.name}`}compare(e){return this.major<e.major?
-1:this.major>e.major?1:0}static equals(e,t){return e===t||e.major===t.major&&e.name===t.name}}v.uint=new v(0,"uint",!0);
v.negint=new v(1,"negint",!0);v.bytes=new v(2,"bytes",!0);v.string=new v(3,"string",!0);v.array=new v(4,"array",!1);v.map=
new v(5,"map",!1);v.tag=new v(6,"tag",!1);v.float=new v(7,"float",!0);v.false=new v(7,"false",!0);v.true=new v(7,"true",
!0);v.null=new v(7,"null",!0);v.undefined=new v(7,"undefined",!0);v.break=new v(7,"break",!0);class z{constructor(e,t,n){
this.type=e,this.value=t,this.encodedLength=n,this.encodedBytes=void 0,this.byteValue=void 0}toString(){return`Token[${this.
type}].${this.value}`}}const Ci=globalThis.process&&!globalThis.process.browser&&globalThis.Buffer&&typeof globalThis.Buffer.
isBuffer=="function",P_=new TextEncoder;function Zo(r){return Ci&&globalThis.Buffer.isBuffer(r)}function Na(r){return r instanceof
Uint8Array?Zo(r)?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):r:Uint8Array.from(r)}const $_=24,N_=200,Xu=Ci?r=>r.length>=
$_?globalThis.Buffer.from(r):xf(r):r=>r.length>=N_?P_.encode(r):xf(r),ur=r=>Uint8Array.from(r),U_=Ci?(r,e,t)=>Zo(r)?new Uint8Array(
r.subarray(e,t)):r.slice(e,t):(r,e,t)=>r.slice(e,t),F_=Ci?(r,e)=>(r=r.map(t=>t instanceof Uint8Array?t:globalThis.Buffer.
from(t)),Na(globalThis.Buffer.concat(r,e))):(r,e)=>{const t=new Uint8Array(e);let n=0;for(let s of r)n+s.length>t.length&&
(s=s.subarray(0,t.length-n)),t.set(s,n),n+=s.length;return t},Ef=Ci?r=>globalThis.Buffer.allocUnsafe(r):r=>new Uint8Array(
r);function fb(r,e){if(Zo(r)&&Zo(e))return r.compare(e);for(let t=0;t<r.length;t++)if(r[t]!==e[t])return r[t]<e[t]?-1:1;
return 0}function xf(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=
s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.
charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(s>=55296&&s<=57343&&(s=65533),
e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e}const Sf=4096;function O_(r){const e=r.length;if(e<=Sf)return String.
fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.slice(n,n+=Sf));return t}const z_=256;
class ea{constructor(e=z_){this.chunkSize=e,this.cursor=0,this.maxCursor=-1,this.chunks=[],this._initReuseChunk=null}reset(){
this.cursor=0,this.maxCursor=-1,this.chunks.length&&(this.chunks=[]),this._initReuseChunk!==null&&(this.chunks.push(this.
_initReuseChunk),this.maxCursor=this._initReuseChunk.length-1)}pushByte(e){let t=this.chunks[this.chunks.length-1];this.
cursor>this.maxCursor&&(t=Ef(this.chunkSize),this.chunks.push(t),this.maxCursor+=t.length,this._initReuseChunk===null&&(this.
_initReuseChunk=t));const n=t.length-(this.maxCursor-this.cursor)-1;t[n]=e,this.cursor++}push(e){let t=this.chunks[this.
chunks.length-1];if(this.cursor+e.length<=this.maxCursor+1){const s=t.length-(this.maxCursor-this.cursor)-1;t.set(e,s)}else{
if(t){const s=t.length-(this.maxCursor-this.cursor)-1;s<t.length&&(this.chunks[this.chunks.length-1]=t.subarray(0,s),this.
maxCursor=this.cursor-1)}e.length<64&&e.length<this.chunkSize?(t=Ef(this.chunkSize),this.chunks.push(t),this.maxCursor+=
t.length,this._initReuseChunk===null&&(this._initReuseChunk=t),t.set(e,0)):(this.chunks.push(e),this.maxCursor+=e.length)}
this.cursor+=e.length}toBytes(e=!1){let t;if(this.chunks.length===1){const n=this.chunks[0];e&&this.cursor>n.length/2?(t=
this.cursor===n.length?n:n.subarray(0,this.cursor),this._initReuseChunk=null,this.chunks=[]):t=U_(n,0,this.cursor)}else t=
F_(this.chunks,this.cursor);return e&&this.reset(),t}}class q_{constructor(e){this.dest=e,this.cursor=0,this.chunks=[e]}reset(){
this.cursor=0}pushByte(e){if(this.cursor>=this.dest.length)throw new Error("write out of bounds, destination buffer is t\
oo small");this.dest[this.cursor++]=e}push(e){if(this.cursor+e.length>this.dest.length)throw new Error("write out of bou\
nds, destination buffer is too small");this.dest.set(e,this.cursor),this.cursor+=e.length}toBytes(e=!1){const t=this.dest.
subarray(0,this.cursor);return e&&this.reset(),t}}const G="CBOR decode error:",qn="CBOR encode error:";function ds(r,e,t){
if(r.length-e<t)throw new Error(`${G} not enough data for type`)}const Ue=[24,256,65536,4294967296,BigInt("1844674407370\
9551616")];function xn(r,e,t){ds(r,e,1);const n=r[e];if(t.strict===!0&&n<Ue[0])throw new Error(`${G} integer encoded in \
more bytes than necessary (strict decode)`);return n}function Sn(r,e,t){ds(r,e,2);const n=r[e]<<8|r[e+1];if(t.strict===!0&&
n<Ue[1])throw new Error(`${G} integer encoded in more bytes than necessary (strict decode)`);return n}function vn(r,e,t){
ds(r,e,4);const n=r[e]*16777216+(r[e+1]<<16)+(r[e+2]<<8)+r[e+3];if(t.strict===!0&&n<Ue[2])throw new Error(`${G} integer \
encoded in more bytes than necessary (strict decode)`);return n}function An(r,e,t){ds(r,e,8);const n=r[e]*16777216+(r[e+
1]<<16)+(r[e+2]<<8)+r[e+3],s=r[e+4]*16777216+(r[e+5]<<16)+(r[e+6]<<8)+r[e+7],i=(BigInt(n)<<BigInt(32))+BigInt(s);if(t.strict===
!0&&i<Ue[3])throw new Error(`${G} integer encoded in more bytes than necessary (strict decode)`);if(i<=Number.MAX_SAFE_INTEGER)
return Number(i);if(t.allowBigInt===!0)return i;throw new Error(`${G} integers outside of the safe integer range are not\
 supported`)}function j_(r,e,t,n){return new z(v.uint,xn(r,e+1,n),2)}function G_(r,e,t,n){return new z(v.uint,Sn(r,e+1,n),
3)}function W_(r,e,t,n){return new z(v.uint,vn(r,e+1,n),5)}function V_(r,e,t,n){return new z(v.uint,An(r,e+1,n),9)}function hs(r,e){
return xt(r,0,e.value)}function xt(r,e,t){if(t<Ue[0]){const n=Number(t);r.pushByte(e|n)}else if(t<Ue[1]){const n=Number(
t);r.push([e|24,n])}else if(t<Ue[2]){const n=Number(t);r.push([e|25,n>>>8,n&255])}else if(t<Ue[3]){const n=Number(t);r.push(
[e|26,n>>>24&255,n>>>16&255,n>>>8&255,n&255])}else{const n=BigInt(t);if(n<Ue[4]){const s=[e|27,0,0,0,0,0,0,0];let i=Number(
n&BigInt(4294967295)),o=Number(n>>BigInt(32)&BigInt(4294967295));s[8]=i&255,i=i>>8,s[7]=i&255,i=i>>8,s[6]=i&255,i=i>>8,s[5]=
i&255,s[4]=o&255,o=o>>8,s[3]=o&255,o=o>>8,s[2]=o&255,o=o>>8,s[1]=o&255,r.push(s)}else throw new Error(`${G} encountered \
BigInt larger than allowable range`)}}hs.encodedSize=function(e){return xt.encodedSize(e.value)};xt.encodedSize=function(e){
return e<Ue[0]?1:e<Ue[1]?2:e<Ue[2]?3:e<Ue[3]?5:9};hs.compareTokens=function(e,t){return e.value<t.value?-1:e.value>t.value?
1:0};function H_(r,e,t,n){return new z(v.negint,-1-xn(r,e+1,n),2)}function K_(r,e,t,n){return new z(v.negint,-1-Sn(r,e+1,
n),3)}function Q_(r,e,t,n){return new z(v.negint,-1-vn(r,e+1,n),5)}const Yu=BigInt(-1),pb=BigInt(1);function J_(r,e,t,n){
const s=An(r,e+1,n);if(typeof s!="bigint"){const i=-1-s;if(i>=Number.MIN_SAFE_INTEGER)return new z(v.negint,i,9)}if(n.allowBigInt!==
!0)throw new Error(`${G} integers outside of the safe integer range are not supported`);return new z(v.negint,Yu-BigInt(
s),9)}function Zu(r,e){const t=e.value,n=typeof t=="bigint"?t*Yu-pb:t*-1-1;xt(r,e.type.majorEncoded,n)}Zu.encodedSize=function(e){
const t=e.value,n=typeof t=="bigint"?t*Yu-pb:t*-1-1;return n<Ue[0]?1:n<Ue[1]?2:n<Ue[2]?3:n<Ue[3]?5:9};Zu.compareTokens=function(e,t){
return e.value<t.value?1:e.value>t.value?-1:0};function Ti(r,e,t,n){ds(r,e,t+n);const s=r.slice(e+t,e+t+n);return new z(
v.bytes,s,t+n)}function X_(r,e,t,n){return Ti(r,e,1,t)}function Y_(r,e,t,n){return Ti(r,e,2,xn(r,e+1,n))}function Z_(r,e,t,n){
return Ti(r,e,3,Sn(r,e+1,n))}function e6(r,e,t,n){return Ti(r,e,5,vn(r,e+1,n))}function t6(r,e,t,n){const s=An(r,e+1,n);
if(typeof s=="bigint")throw new Error(`${G} 64-bit integer bytes lengths not supported`);return Ti(r,e,9,s)}function ta(r){
return r.encodedBytes===void 0&&(r.encodedBytes=v.equals(r.type,v.string)?Xu(r.value):r.value),r.encodedBytes}function Ua(r,e){
const t=ta(e);xt(r,e.type.majorEncoded,t.length),r.push(t)}Ua.encodedSize=function(e){const t=ta(e);return xt.encodedSize(
t.length)+t.length};Ua.compareTokens=function(e,t){return r6(ta(e),ta(t))};function r6(r,e){return r.length<e.length?-1:
r.length>e.length?1:fb(r,e)}const vf=new TextDecoder("utf-8",{ignoreBOM:!0}),n6=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),
s6=32;function i6(r,e,t,n){if(t-e<s6){let i="";for(let o=e;o<t;o++){const a=r[o];if(a&128)return n.strictUtf8===!0?Af(r,
e,t):vf.decode(r.subarray(e,t));i+=String.fromCharCode(a)}return i}return n.strictUtf8===!0?Af(r,e,t):vf.decode(r.subarray(
e,t))}function Af(r,e,t){try{return n6.decode(r.subarray(e,t))}catch{throw new Error(`${G} invalid UTF-8 in text string`)}}
function Mi(r,e,t,n,s){const i=t+n;ds(r,e,i);const o=new z(v.string,i6(r,e+t,e+i,s),i);return s.retainStringBytes===!0&&
(o.byteValue=r.slice(e+t,e+i)),o}function o6(r,e,t,n){return Mi(r,e,1,t,n)}function a6(r,e,t,n){return Mi(r,e,2,xn(r,e+1,
n),n)}function c6(r,e,t,n){return Mi(r,e,3,Sn(r,e+1,n),n)}function l6(r,e,t,n){return Mi(r,e,5,vn(r,e+1,n),n)}function u6(r,e,t,n){
const s=An(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit integer string lengths not supported`);return Mi(
r,e,9,s,n)}const d6=Ua;function fs(r,e,t,n){return new z(v.array,n,t)}function h6(r,e,t,n){return fs(r,e,1,t)}function f6(r,e,t,n){
return fs(r,e,2,xn(r,e+1,n))}function p6(r,e,t,n){return fs(r,e,3,Sn(r,e+1,n))}function m6(r,e,t,n){return fs(r,e,5,vn(r,
e+1,n))}function g6(r,e,t,n){const s=An(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit integer array length\
s not supported`);return fs(r,e,9,s)}function b6(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${G} indefinite len\
gth items not allowed`);return fs(r,e,1,1/0)}function ed(r,e){xt(r,v.array.majorEncoded,e.value)}ed.compareTokens=hs.compareTokens;
ed.encodedSize=function(e){return xt.encodedSize(e.value)};function ps(r,e,t,n){return new z(v.map,n,t)}function y6(r,e,t,n){
return ps(r,e,1,t)}function w6(r,e,t,n){return ps(r,e,2,xn(r,e+1,n))}function k6(r,e,t,n){return ps(r,e,3,Sn(r,e+1,n))}function E6(r,e,t,n){
return ps(r,e,5,vn(r,e+1,n))}function x6(r,e,t,n){const s=An(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit\
 integer map lengths not supported`);return ps(r,e,9,s)}function S6(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${G}\
 indefinite length items not allowed`);return ps(r,e,1,1/0)}function td(r,e){xt(r,v.map.majorEncoded,e.value)}td.compareTokens=
hs.compareTokens;td.encodedSize=function(e){return xt.encodedSize(e.value)};function v6(r,e,t,n){return new z(v.tag,t,1)}
function A6(r,e,t,n){return new z(v.tag,xn(r,e+1,n),2)}function _6(r,e,t,n){return new z(v.tag,Sn(r,e+1,n),3)}function I6(r,e,t,n){
return new z(v.tag,vn(r,e+1,n),5)}function C6(r,e,t,n){return new z(v.tag,An(r,e+1,n),9)}function rd(r,e){xt(r,v.tag.majorEncoded,
e.value)}rd.compareTokens=hs.compareTokens;rd.encodedSize=function(e){return xt.encodedSize(e.value)};const nd=20,sd=21,
id=22,od=23;function T6(r,e,t,n){if(n.allowUndefined===!1)throw new Error(`${G} undefined values are not supported`);return n.
coerceUndefinedToNull===!0?new z(v.null,null,1):new z(v.undefined,void 0,1)}function M6(r,e,t,n){if(n.allowIndefinite===
!1)throw new Error(`${G} indefinite length items not allowed`);return new z(v.break,void 0,1)}function ad(r,e,t){if(t){if(t.
allowNaN===!1&&Number.isNaN(r))throw new Error(`${G} NaN values are not supported`);if(t.allowInfinity===!1&&(r===1/0||r===
-1/0))throw new Error(`${G} Infinity values are not supported`)}return new z(v.float,r,e)}function R6(r,e,t,n){return ad(
Oa(r,e+1),3,n)}function B6(r,e,t,n){return ad(za(r,e+1),5,n)}function L6(r,e,t,n){return ad(bb(r,e+1),9,n)}function Fa(r,e,t){
const n=e.value;if(n===!1)r.pushByte(v.float.majorEncoded|nd);else if(n===!0)r.pushByte(v.float.majorEncoded|sd);else if(n===
null)r.pushByte(v.float.majorEncoded|id);else if(n===void 0)r.pushByte(v.float.majorEncoded|od);else{let s,i=!1;(!t||t.float64!==
!0)&&(cd(n),s=Oa(_e,1),n===s||Number.isNaN(n)?(_e[0]=249,r.push(_e.slice(0,3)),i=!0):(ld(n),s=za(_e,1),n===s&&(_e[0]=250,
r.push(_e.slice(0,5)),i=!0))),i||(gb(n),s=bb(_e,1),_e[0]=251,r.push(_e.slice(0,9)))}}Fa.encodedSize=function(e,t){const n=e.
value;if(n===!1||n===!0||n===null||n===void 0)return 1;if(!t||t.float64!==!0){cd(n);let s=Oa(_e,1);if(n===s||Number.isNaN(
n))return 3;if(ld(n),s=za(_e,1),n===s)return 5}return 9};const mb=new ArrayBuffer(9),Mt=new DataView(mb,1),_e=new Uint8Array(
mb,0);function cd(r){if(r===1/0)Mt.setUint16(0,31744,!1);else if(r===-1/0)Mt.setUint16(0,64512,!1);else if(Number.isNaN(
r))Mt.setUint16(0,32256,!1);else{Mt.setFloat32(0,r);const e=Mt.getUint32(0),t=(e&2139095040)>>23,n=e&8388607;if(t===255)
Mt.setUint16(0,31744,!1);else if(t===0)Mt.setUint16(0,(e&2147483648)>>16|n>>13,!1);else{const s=t-127;s<-24?Mt.setUint16(
0,0):s<-14?Mt.setUint16(0,(e&2147483648)>>16|1<<24+s,!1):Mt.setUint16(0,(e&2147483648)>>16|s+15<<10|n>>13,!1)}}}function Oa(r,e){
if(r.length-e<2)throw new Error(`${G} not enough data for float16`);const t=(r[e]<<8)+r[e+1];if(t===31744)return 1/0;if(t===
64512)return-1/0;if(t===32256)return NaN;const n=t>>10&31,s=t&1023;let i;return n===0?i=s*2**-24:n!==31?i=(s+1024)*2**(n-
25):i=s===0?1/0:NaN,t&32768?-i:i}function ld(r){Mt.setFloat32(0,r,!1)}function za(r,e){if(r.length-e<4)throw new Error(`${G}\
 not enough data for float32`);const t=(r.byteOffset||0)+e;return new DataView(r.buffer,t,4).getFloat32(0,!1)}function gb(r){
Mt.setFloat64(0,r,!1)}function bb(r,e){if(r.length-e<8)throw new Error(`${G} not enough data for float64`);const t=(r.byteOffset||
0)+e;return new DataView(r.buffer,t,8).getFloat64(0,!1)}function D6(r,e){const t=r.value;if(t===!1)return Uint8Array.of(
v.float.majorEncoded|nd);if(t===!0)return Uint8Array.of(v.float.majorEncoded|sd);if(t===null)return Uint8Array.of(v.float.
majorEncoded|id);if(t===void 0)return Uint8Array.of(v.float.majorEncoded|od);if(!e){if(cd(t),t===Oa(_e,1)||Number.isNaN(
t))return _e[0]=249,_e.slice(0,3);if(ld(t),t===za(_e,1))return _e[0]=250,_e.slice(0,5)}return gb(t),_e[0]=251,_e.slice(0,
9)}function _f(r,e){const t=r,n=e?.float64===!0,s=n?t._keyBytesFloat64:t._keyBytes;if(s!==void 0)return s;const i=D6(r,n);
return n?t._keyBytesFloat64=i:t._keyBytes=i,i}Fa.compareTokens=function(e,t,n){const s=_f(e,n),i=_f(t,n);return s.length!==
i.length?s.length<i.length?-1:1:fb(s,i)};function ce(r,e,t){throw new Error(`${G} encountered invalid minor (${t}) for m\
ajor ${r[e]>>>5}`)}function qa(r){return()=>{throw new Error(`${G} ${r}`)}}const F=[];for(let r=0;r<=23;r++)F[r]=ce;F[24]=
j_;F[25]=G_;F[26]=W_;F[27]=V_;F[28]=ce;F[29]=ce;F[30]=ce;F[31]=ce;for(let r=32;r<=55;r++)F[r]=ce;F[56]=H_;F[57]=K_;F[58]=
Q_;F[59]=J_;F[60]=ce;F[61]=ce;F[62]=ce;F[63]=ce;for(let r=64;r<=87;r++)F[r]=X_;F[88]=Y_;F[89]=Z_;F[90]=e6;F[91]=t6;F[92]=
ce;F[93]=ce;F[94]=ce;F[95]=qa("indefinite length bytes/strings are not supported");for(let r=96;r<=119;r++)F[r]=o6;F[120]=
a6;F[121]=c6;F[122]=l6;F[123]=u6;F[124]=ce;F[125]=ce;F[126]=ce;F[127]=qa("indefinite length bytes/strings are not suppor\
ted");for(let r=128;r<=151;r++)F[r]=h6;F[152]=f6;F[153]=p6;F[154]=m6;F[155]=g6;F[156]=ce;F[157]=ce;F[158]=ce;F[159]=b6;for(let r=160;r<=
183;r++)F[r]=y6;F[184]=w6;F[185]=k6;F[186]=E6;F[187]=x6;F[188]=ce;F[189]=ce;F[190]=ce;F[191]=S6;for(let r=192;r<=215;r++)
F[r]=v6;F[216]=A6;F[217]=_6;F[218]=I6;F[219]=C6;F[220]=ce;F[221]=ce;F[222]=ce;F[223]=ce;for(let r=224;r<=243;r++)F[r]=qa(
"simple values are not supported");F[244]=ce;F[245]=ce;F[246]=ce;F[247]=T6;F[248]=qa("simple values are not supported");
F[249]=R6;F[250]=B6;F[251]=L6;F[252]=ce;F[253]=ce;F[254]=ce;F[255]=M6;const or=[];for(let r=0;r<24;r++)or[r]=new z(v.uint,
r,1);for(let r=-1;r>=-24;r--)or[31-r]=new z(v.negint,r,1);or[64]=new z(v.bytes,new Uint8Array(0),1);or[96]=new z(v.string,
"",1);or[128]=new z(v.array,0,1);or[160]=new z(v.map,0,1);or[244]=new z(v.false,!1,1);or[245]=new z(v.true,!0,1);or[246]=
new z(v.null,null,1);function P6(r){switch(r.type){case v.false:return ur([244]);case v.true:return ur([245]);case v.null:
return ur([246]);case v.bytes:return r.value.length?void 0:ur([64]);case v.string:return r.value===""?ur([96]):void 0;case v.
array:return r.value===0?ur([128]):void 0;case v.map:return r.value===0?ur([160]):void 0;case v.uint:return r.value<24?ur(
[Number(r.value)]):void 0;case v.negint:if(r.value>=-24)return ur([31-Number(r.value)])}}const $6={float64:!1,mapSorter:ud,
quickEncodeToken:P6};function N6(){const r=[];return r[v.uint.major]=hs,r[v.negint.major]=Zu,r[v.bytes.major]=Ua,r[v.string.
major]=d6,r[v.array.major]=ed,r[v.map.major]=td,r[v.tag.major]=rd,r[v.float.major]=Fa,r}const jn=N6(),po=new ea;let mo=!1;
class ts{constructor(e,t){this.obj=e,this.parent=t}includes(e){let t=this;do if(t.obj===e)return!0;while(t=t.parent);return!1}static createCheck(e,t){
if(e&&e.includes(t))throw new Error(`${qn} object contains circular references`);return new ts(t,e)}}const Rr={null:new z(
v.null,null),undefined:new z(v.undefined,void 0),true:new z(v.true,!0),false:new z(v.false,!1),emptyArray:new z(v.array,
0),emptyMap:new z(v.map,0)},ir={number(r,e,t,n){return!Number.isInteger(r)||!Number.isSafeInteger(r)?new z(v.float,r):r>=
0?new z(v.uint,r):new z(v.negint,r)},bigint(r,e,t,n){return r>=BigInt(0)?new z(v.uint,r):new z(v.negint,r)},Uint8Array(r,e,t,n){
return new z(v.bytes,r)},string(r,e,t,n){return new z(v.string,r)},boolean(r,e,t,n){return r?Rr.true:Rr.false},null(r,e,t,n){
return Rr.null},undefined(r,e,t,n){return Rr.undefined},ArrayBuffer(r,e,t,n){return new z(v.bytes,new Uint8Array(r))},DataView(r,e,t,n){
return new z(v.bytes,new Uint8Array(r.buffer,r.byteOffset,r.byteLength))},Array(r,e,t,n){if(!r.length)return t.addBreakTokens===
!0?[Rr.emptyArray,new z(v.break)]:Rr.emptyArray;n=ts.createCheck(n,r);const s=[];let i=0;for(const o of r)s[i++]=Pn(o,t,
n);return t.addBreakTokens?[new z(v.array,r.length),s,new z(v.break)]:[new z(v.array,r.length),s]},Object(r,e,t,n){const s=e!==
"Object",i=s?r.keys():Object.keys(r),o=s?r.size:i.length;let a;if(o){a=new Array(o),n=ts.createCheck(n,r);const c=!s&&t.
ignoreUndefinedProperties;let l=0;for(const u of i){const d=s?r.get(u):r[u];c&&d===void 0||(a[l++]=[Pn(u,t,n),Pn(d,t,n)])}
l<o&&(a.length=l)}return a?.length?(U6(a,t),t.addBreakTokens?[new z(v.map,a.length),a,new z(v.break)]:[new z(v.map,a.length),
a]):t.addBreakTokens===!0?[Rr.emptyMap,new z(v.break)]:Rr.emptyMap},Tagged(r,e,t,n){return[new z(v.tag,r.tag),Pn(r.value,
t,n)]}};ir.Map=ir.Object;ir.Buffer=ir.Uint8Array;for(const r of"Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 Bi\
gInt64 Float32 Float64".split(" "))ir[`${r}Array`]=ir.DataView;function Pn(r,e={},t){const n=hb(r),s=e&&e.typeEncoders&&
e.typeEncoders[n]||ir[n];if(typeof s=="function"){const o=s(r,n,e,t);if(o!=null)return o}const i=ir[n];if(!i)throw new Error(
`${qn} unsupported type: ${n}`);return i(r,n,e,t)}function U6(r,e){const t=e.mapSorter;t&&r.sort((n,s)=>t(n,s,e))}function ud(r,e,t){
const n=Array.isArray(r[0])?r[0][0]:r[0],s=Array.isArray(e[0])?e[0][0]:e[0];if(n.type.major!==s.type.major)return n.type.
compare(s.type);const i=n.type.major,o=jn[i].compareTokens(n,s,t);return o===0&&console.warn("WARNING: complex key types\
 used, CBOR key sorting guarantees are gone"),o}function Gn(r,e,t,n){if(Array.isArray(e))for(const s of e)Gn(r,s,t,n);else
t[e.type.major](r,e,n)}const If=v.uint.majorEncoded,Cf=v.negint.majorEncoded,F6=v.bytes.majorEncoded,O6=v.string.majorEncoded,
Tf=v.array.majorEncoded,Rc=v.map.majorEncoded,z6=v.float.majorEncoded|nd,q6=v.float.majorEncoded|sd,j6=v.float.majorEncoded|
id,G6=v.float.majorEncoded|od,W6=BigInt(-1),V6=BigInt(1);function Fr(r,e,t){t<24?r.pushByte(e|Number(t)):xt(r,e,t)}function H6(r){
return r.addBreakTokens!==!0}function K6(r,e,t,n,s){const i=t==="Map",o=i?e.keys():Object.keys(e),a=i?e.size:o.length;if(!a){
r.pushByte(Rc);return}s=ts.createCheck(s,e);const c=!i&&n.ignoreUndefinedProperties,l=new Array(a);let u=0;for(const d of o){
const h=i?e.get(d):e[d];c&&h===void 0||(l[u++]=[Pn(d,n,s),h])}if(u===0){r.pushByte(Rc);return}u<a&&(l.length=u),l.sort((d,h)=>ud(
d,h,n)),Fr(r,Rc,u);for(const[d,h]of l)Gn(r,d,jn,n),ra(r,h,n,s)}function ra(r,e,t,n){const s=hb(e),i=t.typeEncoders&&t.typeEncoders[s];
if(i){const o=i(e,s,t,n);if(o!=null){Gn(r,o,jn,t);return}}switch(s){case"null":r.pushByte(j6);return;case"undefined":r.pushByte(
G6);return;case"boolean":r.pushByte(e?q6:z6);return;case"number":!Number.isInteger(e)||!Number.isSafeInteger(e)?Fa(r,new z(
v.float,e),t):e>=0?Fr(r,If,e):Fr(r,Cf,e*-1-1);return;case"bigint":e>=BigInt(0)?Fr(r,If,e):Fr(r,Cf,e*W6-V6);return;case"s\
tring":{const o=Xu(e);Fr(r,O6,o.length),r.push(o);return}case"Uint8Array":Fr(r,F6,e.length),r.push(e);return;case"Array":
if(!e.length){r.pushByte(Tf);return}n=ts.createCheck(n,e),Fr(r,Tf,e.length);for(const o of e)ra(r,o,t,n);return;case"Obj\
ect":case"Map":if(t.mapSorter===ud)K6(r,e,s,t,n);else{const o=ir.Object(e,s,t,n);Gn(r,o,jn,t)}return;default:{const o=ir[s];
if(!o)throw new Error(`${qn} unsupported type: ${s}`);const a=o(e,s,t,n);Gn(r,a,jn,t)}}}function Q6(r,e,t,n){const s=n instanceof
Uint8Array;let i=s?new q_(n):mo?new ea:po;const o=Pn(r,t);if(!Array.isArray(o)&&t.quickEncodeToken){const a=t.quickEncodeToken(
o);if(a)return s?(i.push(a),i.toBytes()):a;const c=e[o.type.major];if(c.encodedSize){const l=c.encodedSize(o,t);if(s||(i=
new ea(l)),c(i,o,t),i.chunks.length!==1)throw new Error(`Unexpected error: pre-calculated length for ${o} was wrong`);return s?
i.toBytes():Na(i.chunks[0])}}return i.reset(),Gn(i,o,e,t),i.toBytes(!0)}function yB(r,e){if(e=Object.assign({},$6,e),H6(
e)){if(mo){const t=new ea;return ra(t,r,e,void 0),t.toBytes()}mo=!0;try{return po.reset(),ra(po,r,e,void 0),po.toBytes(!0)}finally{
mo=!1}}return Q6(r,jn,e)}const J6={strict:!1,allowIndefinite:!0,allowUndefined:!0,allowBigInt:!0};class X6{constructor(e,t={}){
this._pos=0,this.data=e,this.options=t}pos(){return this._pos}done(){return this._pos>=this.data.length}next(){const e=this.
data[this._pos];let t=or[e];if(t===void 0){const n=F[e];if(!n)throw e===void 0?new Error(`${G} not enough data`):new Error(
`${G} no decoder for major type ${e>>>5} (byte 0x${e.toString(16).padStart(2,"0")})`);const s=e&31;t=n(this.data,this._pos,
s,this.options)}return this._pos+=t.encodedLength,t}}const en=Symbol.for("DONE"),tn=Symbol.for("BREAK");function Y6(r,e,t){
const n=[];for(let s=0;s<r.value;s++){const i=gn(e,t);if(i===tn){if(r.value===1/0)break;throw new Error(`${G} got unexpe\
cted break to lengthed array`)}if(i===en)throw new Error(`${G} found array but not enough entries (got ${s}, expected ${r.
value})`);n[s]=i}return n}function Z6(r,e,t){const n=t.useMaps===!0,s=t.rejectDuplicateMapKeys===!0,i=n?void 0:{},o=n?new Map:
void 0;for(let a=0;a<r.value;a++){const c=gn(e,t);if(c===tn){if(r.value===1/0)break;throw new Error(`${G} got unexpected\
 break to lengthed map`)}if(c===en)throw new Error(`${G} found map but not enough entries (got ${a} [no key], expected ${r.
value})`);if(!n&&typeof c!="string")throw new Error(`${G} non-string keys not supported (got ${typeof c})`);if(s&&(n&&o.
has(c)||!n&&Object.hasOwn(i,c)))throw new Error(`${G} found repeat map key "${c}"`);const l=gn(e,t);if(l===en)throw new Error(
`${G} found map but not enough entries (got ${a} [no value], expected ${r.value})`);if(l===tn)throw new Error(`${G} got \
unexpected break to map value`);n?o.set(c,l):c==="__proto__"?Object.defineProperty(i,c,{value:l,configurable:!0,enumerable:!0,
writable:!0}):i[c]=l}return n?o:i}function*eI(r,e,t){for(let n=0;n<r.value;n++){const s=gn(e,t);if(s===tn){if(r.value===
1/0)break;throw new Error(`${G} got unexpected break to lengthed map`)}if(s===en)throw new Error(`${G} found map but not\
 enough entries (got ${n} [no key], expected ${r.value})`);const i=gn(e,t);if(i===en)throw new Error(`${G} found map but\
 not enough entries (got ${n} [no value], expected ${r.value})`);if(i===tn)throw new Error(`${G} got unexpected break to\
 map value`);yield[s,i]}}function tI(r,e){const t=function(){if(t._called)throw new Error(`${G} tag decode() may only be\
 called once`);t._called=!0;const n=gn(r,e);if(n===en)throw new Error(`${G} tag content missing`);if(n===tn)throw new Error(
`${G} got unexpected break in tag content`);return n};return t.entries=function(){if(t._called)throw new Error(`${G} tag\
 decode() may only be called once`);if(t._called=!0,r.done())throw new Error(`${G} tag content missing`);const n=r.next();
if(!v.equals(n.type,v.map))throw new Error(`${G} entries() requires map content, got ${n.type.name}`);const s=[];for(const i of eI(
n,r,e))s.push(i);return s},t._called=!1,t}function gn(r,e){if(r.done())return en;const t=r.next();if(v.equals(t.type,v.break))
return tn;if(t.type.terminal)return t.value;if(v.equals(t.type,v.array))return Y6(t,r,e);if(v.equals(t.type,v.map))return Z6(
t,r,e);if(v.equals(t.type,v.tag)){if(e.tags&&typeof e.tags[t.value]=="function"){const n=tI(r,e),s=e.tags[t.value](n);if(!n.
_called)throw new Error(`${G} tag decoder must call decode() or entries()`);return s}throw new Error(`${G} tag not suppo\
rted (${t.value})`)}throw new Error("unsupported")}function rI(r,e){if(!(r instanceof Uint8Array))throw new Error(`${G} \
data to decode must be a Uint8Array`);e=Object.assign({},J6,e);const t=Na(r),n=e.tokenizer||new X6(t,e),s=gn(n,e);if(s===
en)throw new Error(`${G} did not find any content to decode`);if(s===tn)throw new Error(`${G} got unexpected break`);return[
s,r.subarray(n.pos())]}function yb(r,e){const[t,n]=rI(r,e);if(n.length>0)throw new Error(`${G} too many terminals, data \
makes no sense`);return t}function nI(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function dd(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return gi(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return gi(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function sI(r){return r?.buffer instanceof ArrayBuffer}
function gi(r){return sI(r)?r:r.slice()}function iI(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==
0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-
w;M!==A&&S[M]===0;)M++;for(var T=d.repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.
length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&
_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var oI=iI,aI=oI;let cI=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},lI=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return wb(this,e)}},
uI=class{decoders;constructor(e){this.decoders=e}or(e){return wb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function wb(r,e){return new uI({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let dI=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new cI(e,t,n),this.decoder=new lI(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function kb({name:r,prefix:e,encode:t,decode:n}){return new dI(r,e,t,
n)}function ja({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=aI(t,r,n);return kb({prefix:e,
name:r,encode:s,decode:o=>dd(i(o))})}function hI(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function fI(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function pI(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function _r({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=pI(n,s);return kb(
{prefix:e,name:r,encode(o){return fI(o,n,t)},decode(o){return hI(o,i,t,r)}})}const go=_r({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});_r({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});_r({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});_r({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Bc=ja(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});ja({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const jr=ja({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});ja({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var mI=Eb,Mf=128,gI=-128,bI=Math.pow(2,31);function Eb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=bI;)e[t++]=r&255|Mf,r/=128;for(;r&gI;)e[t++]=r&255|Mf,r>>>=7;return e[t]=r|0,Eb.bytes=t-n+1,e}var yI=Gl,
wI=128,Rf=127;function Gl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Gl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Rf)<<s:(o&Rf)*Math.pow(2,s),s+=7}while(o>=wI);return Gl.bytes=i-n,t}var kI=Math.pow(
2,7),EI=Math.pow(2,14),xI=Math.pow(2,21),SI=Math.pow(2,28),vI=Math.pow(2,35),AI=Math.pow(2,42),_I=Math.pow(2,49),II=Math.
pow(2,56),CI=Math.pow(2,63),TI=function(r){return r<kI?1:r<EI?2:r<xI?3:r<SI?4:r<vI?5:r<AI?6:r<_I?7:r<II?8:r<CI?9:10},MI={
encode:mI,decode:yI,encodingLength:TI},na=MI;function Wl(r,e=0){const t=na.decode(r,e),n=na.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function sa(r,e,t=0){return na.encode(r,e,t),e}function ia(r){return na.encodingLength(r)}function RI(r,e){const t=e.
byteLength,n=ia(r),s=n+ia(t),i=new Uint8Array(s+t);return sa(r,i,0),sa(t,i,n),i.set(e,s),new hd(r,t,e,i)}function BI(r){
const e=dd(r),[t,n]=Wl(e),[s,i]=Wl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new hd(t,s,o,e)}function LI(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&nI(r.bytes,t.bytes)}}let hd=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
gi(n),this.bytes=gi(s)}};function Bf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return PI(t,Vl(r),e??jr.encoder);default:
return $I(t,Vl(r),e??go.encoder)}}const Lf=new WeakMap;function Vl(r){const e=Lf.get(r);if(e==null){const t=new Map;return Lf.
set(r,t),t}return e}let xb=class Je{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=gi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Ss)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==NI)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Je.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=RI(e,
t);return Je.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Je.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&LI(e.multihash,n.multihash)}toString(e){return Bf(this,e)}toJSON(){return{"/":Bf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Je)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Je(n,s,i,o??Df(n,s,i.bytes))}else if(t[UI]===!0){const{version:n,
multihash:s,code:i}=t,o=BI(s);return Je.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Ss)throw new Error(`Version 0 CID must use dag-pb (code: ${Ss}) block encoding`);return new Je(e,t,n,n.bytes)}case 1:{
const s=Df(e,t,n.bytes);return new Je(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Je.
create(0,Ss,e)}static createV1(e,t){return Je.create(1,e,t)}static decode(e){const[t,n]=Je.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Je.inspectBytes(e),n=t.size-t.multihashSize,
s=dd(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new hd(t.multihashCode,t.digestSize,i,s);return[t.version===0?Je.createV0(o):Je.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Wl(e.subarray(t));return t+=h,d};let s=n(),
i=Ss;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=DI(e,t),
i=Je.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Vl(
i).set(n,e),i}};function DI(r,e){switch(r[0]){case"Q":{const t=e??jr;return[jr.prefix,t.decode(`${jr.prefix}${r}`)]}case jr.
prefix:{const t=e??jr;return[jr.prefix,t.decode(r)]}case go.prefix:{const t=e??go;return[go.prefix,t.decode(r)]}case Bc.
prefix:{const t=e??Bc;return[Bc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function PI(r,e,t){const{prefix:n}=t;if(n!==
jr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function $I(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const Ss=112,NI=18;function Df(r,e,t){const n=ia(r),s=n+ia(e),i=new Uint8Array(s+t.
byteLength);return sa(r,i,0),sa(e,i,n),i.set(t,s),i}const UI=Symbol.for("@ipld/js-cid/CID"),Sb=42;function FI(r){return r instanceof
ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}function OI(r){if(r.asCID!==r&&r["/"]!==r.bytes)return null;const e=xb.asCID(
r);if(!e)return null;const t=new Uint8Array(e.bytes.byteLength+1);return t.set(e.bytes,1),[new z(v.tag,Sb),new z(v.bytes,
t)]}function zI(){throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")}function qI(r){
if(Number.isNaN(r))throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");if(r===1/0||r===
-1/0)throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");return null}
function jI(r){for(const e of r.keys())if(typeof e!="string"||e.length===0)throw new Error("Non-string Map keys are not \
supported by the IPLD Data Model and cannot be encoded");return null}const GI={typeEncoders:{Map:jI,Object:OI,undefined:zI,
number:qI}};({...GI.typeEncoders});function WI(r){const e=r();if(e[0]!==0)throw new Error("Invalid CID for CBOR tag 42; \
expected leading 0x00");return xb.decode(e.subarray(1))}const Hl={allowIndefinite:!1,coerceUndefinedToNull:!0,allowNaN:!1,
allowInfinity:!1,allowBigInt:!0,strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{[Sb]:WI}};({...Hl,tags:{...Hl.tags}});
const vb=113,Ab=r=>yb(FI(r),Hl);class vB extends Array{constructor(){super(),this.inRecursive=[]}prefix(e){const t=this.
inRecursive[this.inRecursive.length-1];t&&(v.equals(t.type,v.array)&&(t.elements++,t.elements!==1&&e.push([44])),v.equals(
t.type,v.map)&&(t.elements++,t.elements!==1&&(t.elements%2===1?e.push([44]):e.push([58]))))}[v.uint.major](e,t){this.prefix(
e);const n=String(t.value),s=[];for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);e.push(s)}[v.negint.major](e,t){this[v.uint.
major](e,t)}[v.bytes.major](e,t){throw new Error(`${qn} unsupported type: Uint8Array`)}[v.string.major](e,t){this.prefix(
e);const n=Xu(JSON.stringify(t.value));e.push(n.length>32?Na(n):n)}[v.array.major](e,t){this.prefix(e),this.inRecursive.
push({type:v.array,elements:0}),e.push([91])}[v.map.major](e,t){this.prefix(e),this.inRecursive.push({type:v.map,elements:0}),
e.push([123])}[v.tag.major](e,t){}[v.float.major](e,t){if(t.type.name==="break"){const o=this.inRecursive.pop();if(o){if(v.
equals(o.type,v.array))e.push([93]);else if(v.equals(o.type,v.map))e.push([125]);else throw new Error("Unexpected recurs\
ive type; this should not happen!");return}throw new Error("Unexpected break; this should not happen!")}if(t.value===void 0)
throw new Error(`${qn} unsupported type: undefined`);if(this.prefix(e),t.type.name==="true"){e.push([116,114,117,101]);return}else if(t.
type.name==="false"){e.push([102,97,108,115,101]);return}else if(t.type.name==="null"){e.push([110,117,108,108]);return}
if(typeof t.value=="number"&&!Number.isFinite(t.value))throw new Error(`${qn} unsupported type: ${t.value}`);const n=String(
t.value),s=[];let i=!1;for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o),!i&&(s[o]===46||s[o]===101||s[o]===69)&&(i=!0);i||
(s.push(46),s.push(48)),e.push(s)}}const Pf=1e3;class _b{constructor(e,t={}){this._pos=0,this.data=e,this.options=t,this.
modeStack=["value"],this.lastToken=""}pos(){return this._pos}done(){return this._pos>=this.data.length}ch(){return this.
data[this._pos]}currentMode(){return this.modeStack[this.modeStack.length-1]}skipWhitespace(){let e=this.ch();for(;e===32||
e===9||e===13||e===10;)e=this.data[++this._pos]}expect(e){if(this.data.length-this._pos<e.length)throw new Error(`${G} u\
nexpected end of input at position ${this._pos}`);for(let t=0;t<e.length;t++)if(this.data[this._pos++]!==e[t])throw new Error(
`${G} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`)}parseNumber(){const e=this.
_pos;let t=!1,n=!1;const s=a=>{for(;!this.done();){const c=this.ch();if(a.includes(c))this._pos++;else break}};if(this.ch()===
45&&(t=!0,this._pos++),this.ch()===48)if(this._pos++,this.ch()===46)this._pos++,n=!0;else return new z(v.uint,0,this._pos-
e);if(s([48,49,50,51,52,53,54,55,56,57]),t&&this._pos===e+1)throw new Error(`${G} unexpected token at position ${this._pos}`);
if(!this.done()&&this.ch()===46){if(n)throw new Error(`${G} unexpected token at position ${this._pos}`);n=!0,this._pos++,
s([48,49,50,51,52,53,54,55,56,57])}if(!this.done()&&(this.ch()===101||this.ch()===69)&&(n=!0,this._pos++,!this.done()&&(this.
ch()===43||this.ch()===45)&&this._pos++,s([48,49,50,51,52,53,54,55,56,57])),this._pos-e>Pf)throw new Error(`${G} number \
at position ${e} exceeds ${Pf} characters`);const i=String.fromCharCode.apply(null,this.data.subarray(e,this._pos)),o=parseFloat(
i);if(n){if(this.options.allowInfinity===!1&&!Number.isFinite(o))throw new Error(`${G} Infinity values are not supported`);
return new z(v.float,o,this._pos-e)}if(this.options.allowBigInt!==!0||Number.isSafeInteger(o)){if(!Number.isFinite(o))throw new Error(
`${G} integer at position ${e} is too large for a Number, use allowBigInt`);return new z(o>=0?v.uint:v.negint,o,this._pos-
e)}return new z(o>=0?v.uint:v.negint,BigInt(i),this._pos-e)}parseString(){if(this.ch()!==34)throw new Error(`${G} unexpe\
cted character at position ${this._pos}; this shouldn't happen`);this._pos++;for(let i=this._pos,o=0;i<this.data.length&&
o<65536;i++,o++){const a=this.data[i];if(a===92||a<32||a>=128)break;if(a===34){const c=String.fromCharCode.apply(null,this.
data.subarray(this._pos,i));return this._pos=i+1,new z(v.string,c,o)}}const e=this._pos,t=[],n=()=>{if(this._pos+4>=this.
data.length)throw new Error(`${G} unexpected end of unicode escape sequence at position ${this._pos}`);let i=0;for(let o=0;o<
4;o++){let a=this.ch();if(a>=48&&a<=57)a-=48;else if(a>=97&&a<=102)a=a-97+10;else if(a>=65&&a<=70)a=a-65+10;else throw new Error(
`${G} unexpected unicode escape character at position ${this._pos}`);i=i*16+a,this._pos++}return i},s=()=>{const i=this.
ch();let o=null,a=i>239?4:i>223?3:i>191?2:1;if(this._pos+a>this.data.length)throw new Error(`${G} unexpected unicode seq\
uence at position ${this._pos}`);let c,l,u,d;switch(a){case 1:i<128&&(o=i);break;case 2:c=this.data[this._pos+1],(c&192)===
128&&(d=(i&31)<<6|c&63,d>127&&(o=d));break;case 3:c=this.data[this._pos+1],l=this.data[this._pos+2],(c&192)===128&&(l&192)===
128&&(d=(i&15)<<12|(c&63)<<6|l&63,d>2047&&(d<55296||d>57343)&&(o=d));break;case 4:c=this.data[this._pos+1],l=this.data[this.
_pos+2],u=this.data[this._pos+3],(c&192)===128&&(l&192)===128&&(u&192)===128&&(d=(i&15)<<18|(c&63)<<12|(l&63)<<6|u&63,d>
65535&&d<1114112&&(o=d))}if(o===null){if(this.options.strictUtf8===!0)throw new Error(`${G} invalid UTF-8 in text string\
 at position ${this._pos}`);o=65533,a=1}else o>65535&&(o-=65536,t.push(o>>>10&1023|55296),o=56320|o&1023);t.push(o),this.
_pos+=a};for(;!this.done();){const i=this.ch();let o;switch(i){case 92:if(this._pos++,this.done())throw new Error(`${G} \
unexpected string termination at position ${this._pos}`);switch(o=this.ch(),this._pos++,o){case 34:case 39:case 92:case 47:
t.push(o);break;case 98:t.push(8);break;case 116:t.push(9);break;case 110:t.push(10);break;case 102:t.push(12);break;case 114:
t.push(13);break;case 117:t.push(n());break;default:throw new Error(`${G} unexpected string escape character at position\
 ${this._pos}`)}break;case 34:return this._pos++,new z(v.string,O_(t),this._pos-e);default:if(i<32)throw new Error(`${G}\
 invalid control character at position ${this._pos}`);i<128?(t.push(i),this._pos++):s()}}throw new Error(`${G} unexpecte\
d end of string at position ${this._pos}`)}parseValue(){switch(this.ch()){case 123:return this.modeStack.push("obj-start"),
this._pos++,new z(v.map,1/0,1);case 91:return this.modeStack.push("array-start"),this._pos++,new z(v.array,1/0,1);case 34:
return this.parseString();case 110:return this.expect([110,117,108,108]),new z(v.null,null,4);case 102:return this.expect(
[102,97,108,115,101]),new z(v.false,!1,5);case 116:return this.expect([116,114,117,101]),new z(v.true,!0,4);case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
return this.parseNumber();default:throw new Error(`${G} unexpected character at position ${this._pos}`)}}next(){switch(this.
skipWhitespace(),this.currentMode()){case"value":return this.modeStack.pop(),this.parseValue();case"array-value":{if(this.
modeStack.pop(),this.ch()===93)return this._pos++,this.skipWhitespace(),new z(v.break,void 0,1);if(this.ch()!==44)throw new Error(
`${G} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.
ch())}'`);return this._pos++,this.modeStack.push("array-value"),this.skipWhitespace(),this.parseValue()}case"array-start":
return this.modeStack.pop(),this.ch()===93?(this._pos++,this.skipWhitespace(),new z(v.break,void 0,1)):(this.modeStack.push(
"array-value"),this.skipWhitespace(),this.parseValue());case"obj-key":if(this.ch()===125)return this.modeStack.pop(),this.
_pos++,this.skipWhitespace(),new z(v.break,void 0,1);if(this.ch()!==44)throw new Error(`${G} unexpected character at pos\
ition ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);this._pos++,this.skipWhitespace();case"\
obj-start":{if(this.modeStack.pop(),this.ch()===125)return this._pos++,this.skipWhitespace(),new z(v.break,void 0,1);const e=this.
parseString();if(this.skipWhitespace(),this.ch()!==58)throw new Error(`${G} unexpected character at position ${this._pos}\
, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);return this._pos++,this.modeStack.
push("obj-value"),e}case"obj-value":return this.modeStack.pop(),this.modeStack.push("obj-key"),this.skipWhitespace(),this.
parseValue();default:throw new Error(`${G} unexpected parse state at position ${this._pos}; this shouldn't happen`)}}}function VI(r,e){
return e=Object.assign({tokenizer:new _b(r,e)},e),yb(r,e)}function HI(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)
return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function fd(r){if(r instanceof Uint8Array&&r.constructor.
name==="Uint8Array")return bi(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return bi(
new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function KI(r){
return r?.buffer instanceof ArrayBuffer}function bi(r){return KI(r)?r:r.slice()}function QI(r,e,t){if(r.length>=255)throw new TypeError(
"Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(
i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(
256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,
f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,b++;for(var A=(x-k)*p+1>>>
0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>
0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-w;M!==A&&S[M]===0;)M++;for(var T=d.repeat(b);M<A;++M)T+=
r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.
charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;
if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(
w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(f);if(b)return b;throw new Error(`Non-${e} character`)}
return{encode:g,decodeUnsafe:y,decode:m}}var JI=QI,XI=JI;let YI=class{name;prefix;baseEncode;constructor(e,t,n){this.name=
e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},ZI=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Ib(this,e)}},
eC=class{decoders;constructor(e){this.decoders=e}or(e){return Ib(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Ib(r,e){return new eC({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let tC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new YI(e,t,n),this.decoder=new ZI(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Cb({name:r,prefix:e,encode:t,decode:n}){return new tC(r,e,t,
n)}function Ga({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=XI(t,r,n);return Cb({prefix:e,
name:r,encode:s,decode:o=>fd(i(o))})}function rC(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function nC(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function sC(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function St({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=sC(n,s);return Cb(
{prefix:e,name:r,encode(o){return nC(o,n,t)},decode(o){return rC(o,i,t,r)}})}const bo=St({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});St({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});St({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});St({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});St({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});St({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});St({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});St({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});St({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Lc=Ga(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ga({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Gr=Ga({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ga({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var iC=Tb,$f=128,oC=-128,aC=Math.pow(2,31);function Tb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=aC;)e[t++]=r&255|$f,r/=128;for(;r&oC;)e[t++]=r&255|$f,r>>>=7;return e[t]=r|0,Tb.bytes=t-n+1,e}var cC=Kl,
lC=128,Nf=127;function Kl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Kl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Nf)<<s:(o&Nf)*Math.pow(2,s),s+=7}while(o>=lC);return Kl.bytes=i-n,t}var uC=Math.pow(
2,7),dC=Math.pow(2,14),hC=Math.pow(2,21),fC=Math.pow(2,28),pC=Math.pow(2,35),mC=Math.pow(2,42),gC=Math.pow(2,49),bC=Math.
pow(2,56),yC=Math.pow(2,63),wC=function(r){return r<uC?1:r<dC?2:r<hC?3:r<fC?4:r<pC?5:r<mC?6:r<gC?7:r<bC?8:r<yC?9:10},kC={
encode:iC,decode:cC,encodingLength:wC},oa=kC;function Ql(r,e=0){const t=oa.decode(r,e),n=oa.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function aa(r,e,t=0){return oa.encode(r,e,t),e}function ca(r){return oa.encodingLength(r)}function EC(r,e){const t=e.
byteLength,n=ca(r),s=n+ca(t),i=new Uint8Array(s+t);return aa(r,i,0),aa(t,i,n),i.set(e,s),new pd(r,t,e,i)}function xC(r){
const e=fd(r),[t,n]=Ql(e),[s,i]=Ql(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new pd(t,s,o,e)}function SC(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&HI(r.bytes,t.bytes)}}class pd{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
bi(n),this.bytes=bi(s)}}function Uf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return AC(t,Jl(r),e??Gr.encoder);default:
return _C(t,Jl(r),e??bo.encoder)}}const Ff=new WeakMap;function Jl(r){const e=Ff.get(r);if(e==null){const t=new Map;return Ff.
set(r,t),t}return e}class $e{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.multihash=
n,this.bytes=bi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
vs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==IC)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return $e.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=EC(e,
t);return $e.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return $e.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&SC(e.multihash,n.multihash)}toString(e){return Uf(this,e)}toJSON(){return{"/":Uf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof $e)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new $e(n,s,i,o??Of(n,s,i.bytes))}else if(t[CC]===!0){const{version:n,
multihash:s,code:i}=t,o=xC(s);return $e.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==vs)throw new Error(`Version 0 CID must use dag-pb (code: ${vs}) block encoding`);return new $e(e,t,n,n.bytes)}case 1:{
const s=Of(e,t,n.bytes);return new $e(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return $e.
create(0,vs,e)}static createV1(e,t){return $e.create(1,e,t)}static decode(e){const[t,n]=$e.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=$e.inspectBytes(e),n=t.size-t.multihashSize,
s=fd(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new pd(t.multihashCode,t.digestSize,i,s);return[t.version===0?$e.createV0(o):$e.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Ql(e.subarray(t));return t+=h,d};let s=n(),
i=vs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=vC(e,t),
i=$e.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Jl(
i).set(n,e),i}}function vC(r,e){switch(r[0]){case"Q":{const t=e??Gr;return[Gr.prefix,t.decode(`${Gr.prefix}${r}`)]}case Gr.
prefix:{const t=e??Gr;return[Gr.prefix,t.decode(r)]}case bo.prefix:{const t=e??bo;return[bo.prefix,t.decode(r)]}case Lc.
prefix:{const t=e??Lc;return[Lc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function AC(r,e,t){const{prefix:n}=t;if(n!==
Gr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function _C(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const vs=112,IC=18;function Of(r,e,t){const n=ca(r),s=n+ca(e),i=new Uint8Array(s+t.
byteLength);return aa(r,i,0),aa(e,i,n),i.set(t,s),i}const CC=Symbol.for("@ipld/js-cid/CID"),TC=St({prefix:"m",name:"base\
64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});St({prefix:"M",name:"bas\
e64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});St({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});St({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});function MC(r){
return r instanceof ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}class RC extends _b{constructor(e,t){super(e,t),this.
tokenBuffer=[]}done(){return this.tokenBuffer.length===0&&super.done()}_next(){return this.tokenBuffer.length>0?this.tokenBuffer.
pop():super.next()}next(){const e=this._next();if(v.equals(e.type,v.map)){const t=this._next();if(v.equals(t.type,v.string)&&
t.value==="/"){const n=this._next();if(v.equals(n.type,v.string)){const s=this._next();if(!v.equals(s.type,v.break))throw new Error(
"Invalid encoded CID form");return this.tokenBuffer.push(n),new z(v.tag,42,0)}if(v.equals(n.type,v.map)){const s=this._next();
if(v.equals(s.type,v.string)&&s.value==="bytes"){const i=this._next();if(v.equals(i.type,v.string)){for(let a=0;a<2;a++){
const c=this._next();if(!v.equals(c.type,v.break))throw new Error("Invalid encoded Bytes form")}const o=TC.decode(`m${i.
value}`);return new z(v.bytes,o,i.value.length)}this.tokenBuffer.push(i)}this.tokenBuffer.push(s)}this.tokenBuffer.push(
n)}this.tokenBuffer.push(t)}return e}}const zf={allowIndefinite:!1,allowUndefined:!1,allowNaN:!1,allowInfinity:!1,allowBigInt:!0,
strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{42:r=>$e.parse(r())}},Mb=297,Rb=r=>{const e=MC(r),t=Object.assign(zf,
{tokenizer:new RC(e,zf)});return VI(e,t)};new TextDecoder;new TextEncoder;new TextEncoder;const BC=new TextDecoder,Bb=512;
function Lb(r){return JSON.parse(BC.decode(r))}const md=85,LC=0,Db={code:LC},Pb=81,DC=10;function PC(r=0){return new Uint8Array(
r)}function $C(r){return r?.buffer instanceof ArrayBuffer}function NC(r){if($C(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function qf(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=PC(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return NC(t)}function UC(r){return r[Symbol.asyncIterator]!=null}function Pt(r){if(UC(r))return(async()=>{
let n=new Uint8Array(0);for await(const s of r)n=qf([n,s],n.length+s.length);return n})();const e=[];let t=0;for(const n of r)
e.push(n),t+=n.byteLength;return qf(e,t)}function gd(r){return r==null?!1:mn.asCID(r)===r}function bd(r,e){let t,n=0,s="";
for(;n<e.length;){const i=e[n];if(n++,!Object.hasOwnProperty.call(r,i))throw new pi(`Object did not have key "${i}"`);if(s+=
`/${i}`,t=r[i],r=t,gd(t))break}return{value:t,rest:e.slice(n),path:s.substring(1)}}async function*jf(r,e,t,n){const s=await Pt(
t.get(r,n)),i=Ab(s),o=bd(i,e);yield{cid:gd(o.value)?o.value:r,name:o.path,rest:o.rest}}async function*FC(r,e,t,n){const s=await Pt(
t.get(r,n)),i=Rb(s),o=bd(i,e);yield{cid:gd(o.value)?o.value:r,name:o.path,rest:o.rest}}function Xl(r){return r.type==="D\
IRECTORY"}function $b(r){return r.type==="FILE"}function Nb(r){return r.type==="RAW"}function Ub(r){return r.type==="SYM\
LINK"}function Wn(r){return r.type==="HAMT_SHARD"&&r.data instanceof Uint8Array&&typeof r.fanOut=="bigint"&&typeof r.hashType==
"bigint"}function ln(r){return typeof r.name=="string"&&mn.asCID(r.hash)===r.hash}function*Fb(r){let e={},t={};for(const n of ui.
stream(r))switch(n.field){case".data":{if(n.type==="start"&&(t={}),n.type==="end"){if(Xl(t)||Wn(t)||$b(t)||Nb(t)||Ub(t)){
yield t;return}throw new Be("PBNode Data was not a valid UnixFS type")}break}case".data.type":{t.type=n.value;break}case"\
.data.data":{t.data=n.value;break}case".data.fanOut":{t.fanOut=n.value;break}case".data.hashType":{t.hashType=n.value;break}case"\
.links[]":{n.type==="start"&&(e={type:"LINK"}),n.type==="end"&&ln(e)&&(yield e);break}case".links[].name":{e.name=n.value;
break}case".links[].hash":{e.hash=mn.decode(n.value);break}}}const Gf=(r,e)=>r.toString(16).toUpperCase().padStart(e,"0").
substring(0,e),OC=r=>{let e=r.bucket;const t=[];for(;e._parent!=null;)t.push(e),e=e._parent;return t.push(e),t.reverse()};
async function*Yl(r,e,t,n,s,i,o){const a=(i.lastBucket.tableSize()-1).toString(16).length;let c=[];for(const m of e){if(!ln(
m))throw new Be("Invalid link");if(c.push(m),m.name.length===a){const f=parseInt(m.name,16);i.lastBucket._putObjectAt(f,
new yt({hash:i.lastBucket._options.hash,bits:i.lastBucket._options.bits},i.lastBucket,f))}if(m.name.substring(a)===t){yield{
cid:m.hash,name:t,rest:n};return}await i.rootBucket.put(m.name.substring(a),!0)}const l=await i.rootBucket._findNewBucketAndPos(
t);let u=Gf(l.pos,a);const d=OC(l);d.length>i.hamtDepth&&(i.lastBucket=d[i.hamtDepth],u=Gf(i.lastBucket._posAtParent,a));
const h=c.find(m=>m.name==null?!1:m.name===u);if(h==null)return;i.hamtDepth++;const p=await Pt(s.get(h.hash,o));o?.yieldSubShards===
!0&&(yield{cid:h.hash,name:h.name,rest:[t,...n]});const g=Fb(p),{value:y}=g.next();if(c=[],y!=null){if(Wn(y)){yield*Yl(y,
g,t,n,s,i,o);return}if(!ln(y))throw new Be("Did not read Link or Data from dag-pb block");c.push(y);for(const m of g){if(Wn(
m)){yield*Yl(m,c,t,n,s,i,o);return}if(!ln(m))throw new Be("Did not read Link or Data from dag-pb block");c.push(m)}}}function*Wf(r,e,t){
for(const n of r){if(!ln(n))throw new Be("Invalid link");if(n.name===e[0]){yield{cid:n.hash,name:e[0],rest:e.slice(1)};return}}
throw new En(`No link "${e[0]}" found under ${t}`)}const zC=async function(r){return(await Jg.encode(r)).slice(0,8).reverse()};
async function*Vf(r,e,t,n,s,i){const o=nb({hashFn:zC,bits:Math.log2(Number(r.fanOut))}),a={rootBucket:o,hamtDepth:1,lastBucket:o};
for await(const c of Yl(r,e,t[0],t.slice(1),s,a,i))if(yield c,c.name===t[0])return;throw new En(`No link "${t[0]}" found\
 under ${n}`)}async function*qC(r,e,t,n){const s=await Pt(t.get(r,n)),i=[],o=Fb(s),{value:a}=o.next();let c=!1,l=!1;if(a!=
null){if(l=Xl(a),c=Wn(a),$b(a)||Nb(a)||Ub(a)){yield{cid:r,name:e[0],rest:e.slice(1)};return}if(l||c&&n?.translateHAMTPath===
!1){yield*Wf(o,e,r);return}if(c){yield*Vf(a,o,e,r,t,n);return}if(!ln(a))throw new Be("Did not read Link or Data from dag\
-pb block");i.push(a);for(const u of o){if(l=Xl(u),c=Wn(u),l||c&&n?.translateHAMTPath===!1){yield*Wf(i,e,r);return}if(Wn(
u)){yield*Vf(u,i,e,r,t,n);return}if(!ln(u))throw new Be("Did not read Link or Data from dag-pb block");i.push(u)}}throw new En(
`No link "${e[0]}" found under ${r}`)}async function*jC(r,e,t,n){if(e.length!==0)throw new pi(`Cannot load path /${e.join(
"/")} from identity block`)}async function*GC(r,e,t,n){const s=await Pt(t.get(r,n)),i=Lb(s),o=bd(i,e);yield{cid:r,name:o.
path,rest:o.rest}}async function*WC(r,e,t,n){if(e.length!==0)throw new En(`Cannot load path /${e.join("/")} from raw blo\
ck`)}const VC={[vi]:qC,[md]:WC,[vb]:jf,[Pb]:jf,[Mb]:FC,[Db.code]:jC,[Bb]:GC};async function*HC(r,e,t={}){for(r=r.toString(),
r.startsWith("/ipfs/")&&(r=r.substring(6));r.endsWith("/");)r=r.substring(0,r.length-1);let[n,...s]=r.split(/(?<!\\)\//g).
filter(Boolean),i=mn.parse(n),o=[i],a=`${i}`;for(yield{cid:i,name:a,path:a,roots:o,remainder:s};s.length>0;){const c=VC[i.
code];if(c==null)throw new mi(`No resolver for code ${i.code}`);let l=!1;for await(const u of c(i,s,e,t)){if(i=u.cid,l=!o[o.
length-1].equals(i),s=u.rest,!l)break;o=[...o,u.cid],a=`${a}/${u.name}`,yield{cid:u.cid,name:u.name,path:a,roots:o,remainder:u.
rest}}if(!l)break}if(t?.signal?.throwIfAborted(),s.length!==0)throw new En(`Could not resolve path /${s.join("/")} under\
 ${r}`)}function KC(r){return r[Symbol.asyncIterator]!=null}function QC(r){if(KC(r))return(async()=>{let t;for await(const n of r)
t=n;return t})();let e;for(const t of r)e=t;return e}async function Hf(r,e,t,n,s){const i=await Pt(n.get(r,s)),o=Ab(i);return{
type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}async function JC(r,e,t,n,s){const i=await Pt(
n.get(r,s)),o=Rb(i);return{type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}function Zl(r,e,t,n){
const s=BigInt(r.length),i=BigInt(e+s);return t>=i||n<e?new Uint8Array(0):(n>=e&&n<i&&(r=r.subarray(0,Number(n-e))),t>=e&&
t<i&&(r=r.subarray(Number(t-e))),r)}const Ob=(r,e=0,t=r)=>{const n=BigInt(r),s=BigInt(e??0);let i=BigInt(t);if(i!==n&&(i=
s+i),i>n&&(i=n),s<0n)throw new Fs("Offset must be greater than or equal to 0");if(s>n)throw new Fs("Offset must be less \
than the file size");if(i<0n)throw new Fs("Length must be greater than or equal to 0");if(i>n)throw new Fs("Length must \
be less than the file size");return{start:s,end:i}};function zb(r,e){async function*t(n={}){const{start:s,end:i}=Ob(r.length,
n.offset,n.length),o=Zl(r,0n,s,i);n.onProgress?.(new sr(e,{bytesRead:BigInt(o.byteLength),totalBytes:i-s,fileSize:BigInt(
r.byteLength)})),yield o}return t}async function XC(r,e,t,n,s){const i=db(r.multihash.bytes);return{type:"identity",cid:r,
name:e,path:t,content:zb(i.digest,"unixfs:exporter:progress:identity"),size:BigInt(i.bytes.byteLength),node:i.bytes}}async function YC(r,e,t,n,s){
const i=await Pt(n.get(r,s)),o=Lb(i);return{type:"object",cid:r,name:e,path:t,object:o,size:BigInt(i.byteLength),node:i}}
async function ZC(r,e,t,n,s){const i=await Pt(n.get(r,s));return{type:"raw",cid:r,name:e,path:t,content:zb(i,"unixfs:exp\
orter:progress:raw"),size:BigInt(i.length),node:i}}function e3(r,e,t,n){async function*s(i={}){const o=i.offset??0,a=i.length??
e.Links.length,c=e.Links.slice(o,o+a);i.onProgress?.(new sr("unixfs:exporter:walk:directory",{cid:r})),yield*c.map(l=>({
cid:l.Hash,name:l.Name??"",path:`${n}/${l.Name??""}`,size:BigInt(l.Tsize??0)}))}return s}function t3(r){const[e,t]=r[Symbol.
asyncIterator]!=null?[r[Symbol.asyncIterator](),Symbol.asyncIterator]:[r[Symbol.iterator](),Symbol.iterator],n=[];return{
peek:()=>e.next(),push:s=>{n.push(s)},next:()=>n.length>0?{done:!1,value:n.shift()}:e.next(),[t](){return this}}}function r3(r){
return r[Symbol.asyncIterator]!=null}function n3(r,e){let t=0;if(r3(r))return(async function*(){for await(const c of r)yield e(
c,t++)})();const n=t3(r),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o.then==
"function")return(async function*(){yield await o;for(const c of n)yield e(c,t++)})();const a=e;return(function*(){yield o;
for(const c of n)yield a(c,t++)})()}function Lt(){const r={};return r.promise=new Promise((e,t)=>{r.resolve=e,r.reject=t}),
r}const qi=globalThis.CustomEvent??Event;async function*s3(r,e={}){let t=e.concurrency??1/0;t<1&&(t=1/0);const n=e.ordered??
!1,s=new EventTarget,i=[];let o=Lt(),a=Lt(),c=!1,l,u=!1,d=!1;s.addEventListener("task-complete",()=>{a.resolve()}),Promise.
resolve().then(async()=>{try{for await(const y of r){if(i.length===t&&(o=Lt(),await o.promise),u||d)break;const m={done:!1};
i.push(m),y().then(f=>{m.done=!0,m.ok=!0,m.value=f,s.dispatchEvent(new qi("task-complete"))},f=>{m.done=!0,m.err=f,s.dispatchEvent(
new qi("task-complete"))})}c=!0,s.dispatchEvent(new qi("task-complete"))}catch(y){l=y,s.dispatchEvent(new qi("task-compl\
ete"))}});function h(){return n?i[0]?.done:!!i.find(y=>y.done)}function*p(){for(;i.length>0&&i[0].done;){const y=i[0];if(i.
shift(),y.ok)yield y.value;else throw u=!0,o.resolve(),y.err;o.resolve()}}function*g(){for(;h();)for(let y=0;y<i.length;y++)
if(i[y].done){const m=i[y];if(i.splice(y,1),y--,m.ok)yield m.value;else throw u=!0,o.resolve(),m.err;o.resolve()}}try{for(;;){
if(h()||(a=Lt(),await a.promise),l!=null||(n?yield*p():yield*g(),l!=null))throw l;if(c&&i.length===0)break}}finally{d=!0,
o.resolve()}}let Kf=class{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a\
 FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){
return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.top+1&this.mask,!0)}shift(){const e=this.
buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,e}isEmpty(){return this.
buffer[this.btm]===void 0}},Dc=class{size;hwm;head;tail;constructor(e={}){this.hwm=e.splitLimit??16,this.head=new Kf(this.
hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?e.byteLength:1}push(e){if(e?.value!=null&&
(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;this.head=t.next=new Kf(2*this.head.buffer.
length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.tail.next!=null){const t=this.tail.next;this.
tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.size-=this.calculateSize(e.value)),e}isEmpty(){
return this.head.isEmpty()}},i3=class extends Error{type;code;constructor(e,t){super(e??"The operation was aborted"),this.
type="aborted",this.code=t??"ABORT_ERR"}};function qb(r={}){return o3(t=>{const n=t.shift();if(n==null)return{done:!0};if(n.
error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function o3(r,e){e=e??{};let t=e.onEnd,n=new Dc,s,i,
o,a=Lt();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((m,f)=>{i=b=>{i=null,n.push(b);try{m(r(n))}catch(w){
f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=Lt()})}},l=m=>i!=null?i(m):(n.push(m),s),u=m=>(n=
new Dc,i!=null?i({error:m}):(n.push({error:m}),s)),d=m=>{if(o)return s;if(e?.objectMode!==!0&&m?.byteLength==null)throw new Error(
"objectMode was not true but tried to push non-Uint8Array value");return l({done:!1,value:m})},h=m=>o?s:(o=!0,m!=null?u(
m):l({done:!0})),p=()=>(n=new Dc,h(),{done:!0}),g=m=>(h(m),{done:!0});if(s={[Symbol.asyncIterator](){return this},next:c,
return:p,throw:g,push:d,end:h,get readableLength(){return n.size},onEmpty:async m=>{const f=m?.signal;if(f?.throwIfAborted(),
n.isEmpty())return;let b,w;f!=null&&(b=new Promise((k,x)=>{w=()=>{x(new i3)},f.addEventListener("abort",w)}));try{await Promise.
race([a.promise,b])}finally{w!=null&&f!=null&&f?.removeEventListener("abort",w)}}},t==null)return s;const y=s;return s={
[Symbol.asyncIterator](){return this},next(){return y.next()},throw(m){return y.throw(m),t!=null&&(t(m),t=void 0),{done:!0}},
return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:d,end(m){return y.end(m),t!=null&&(t(m),t=void 0),s},
get readableLength(){return y.readableLength},onEmpty:m=>y.onEmpty(m)},s}function a3(r){return r.reason}function jb(r,e,t){
if(e==null||r==null)return r;const n=t?.translateError??a3;if(e.aborted)return r.catch(()=>{}),Promise.reject(n(e));let s;
return Promise.race([r,new Promise((i,o)=>{s=()=>{o(n(e))},e.addEventListener("abort",s)})]).finally(()=>{s!=null&&e.removeEventListener(
"abort",s)})}class c3{readNext;haveNext;ended;nextResult;error;constructor(){this.ended=!1,this.readNext=Lt(),this.haveNext=
Lt()}[Symbol.asyncIterator](){return this}async next(){if(this.nextResult==null&&await this.haveNext.promise,this.nextResult==
null)throw new Error("HaveNext promise resolved but nextResult was undefined");const e=this.nextResult;return this.nextResult=
void 0,this.readNext.resolve(),this.readNext=Lt(),e}async throw(e){return this.ended=!0,this.error=e,e!=null&&(this.haveNext.
promise.catch(()=>{}),this.haveNext.reject(e)),{done:!0,value:void 0}}async return(){const e={done:!0,value:void 0};return this.
ended=!0,this.nextResult=e,this.haveNext.resolve(),e}async push(e,t){await this._push(e,t)}async end(e,t){e!=null?await this.
throw(e):await this._push(void 0,t)}async _push(e,t){if(e!=null&&this.ended)throw this.error??new Error("Cannot push val\
ue onto an ended pushable");for(;this.nextResult!=null;)await this.readNext.promise;e!=null?this.nextResult={done:!1,value:e}:
(this.ended=!0,this.nextResult={done:!0,value:void 0}),this.haveNext.resolve(),this.haveNext=Lt(),await jb(this.readNext.
promise,t?.signal,t)}}function l3(){return new c3}function u3(r){return r[Symbol.asyncIterator]!=null}async function d3(r,e,t){
try{await Promise.all(r.map(async n=>{for await(const s of n)await e.push(s,{signal:t}),t.throwIfAborted()})),await e.end(
void 0,{signal:t})}catch(n){await e.end(n,{signal:t}).catch(()=>{})}}async function*h3(r){const e=new AbortController,t=l3();
d3(r,t,e.signal).catch(()=>{});try{yield*t}finally{e.abort()}}function*f3(r){for(const e of r)yield*e}function p3(...r){
const e=[];for(const t of r)u3(t)||e.push(t);return e.length===r.length?f3(e):h3(r)}function Gb(r,...e){if(r==null)throw new Error(
"Empty pipeline");if(Pc(r)){const n=r;r=()=>n.source}else if(Vb(r)||Wb(r)){const n=r;r=()=>n}const t=[r,...e];if(t.length>
1&&Pc(t[t.length-1])&&(t[t.length-1]=t[t.length-1].sink),t.length>2)for(let n=1;n<t.length-1;n++)Pc(t[n])&&(t[n]=g3(t[n]));
return m3(...t)}const m3=(...r)=>{let e;for(;r.length>0;)e=r.shift()(e);return e},Wb=r=>r?.[Symbol.asyncIterator]!=null,
Vb=r=>r?.[Symbol.iterator]!=null,Pc=r=>r==null?!1:r.sink!=null&&r.source!=null,g3=r=>e=>{const t=r.sink(e);if(t?.then!=null){
const n=qb({objectMode:!0});t.then(()=>{n.end()},o=>{n.end(o)});let s;const i=r.source;if(Wb(i))s=async function*(){yield*i,
n.end()};else if(Vb(i))s=function*(){yield*i,n.end()};else throw new Error("Unknown duplex source type - must be Iterabl\
e or AsyncIterable");return p3(n,s())}return r.source};class Qf{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&
e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.
top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.
top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.
btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class $c{size;hwm;head;tail;constructor(e={}){this.hwm=
e.splitLimit??16,this.head=new Qf(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?
e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;
this.head=t.next=new Qf(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.
tail.next!=null){const t=this.tail.next;this.tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.
size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}let b3=class extends Error{type;code;constructor(e,t){
super(e??"The operation was aborted"),this.type="aborted",this.code=t??"ABORT_ERR"}};function y3(r={}){return w3(t=>{const n=t.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function w3(r,e){
e=e??{};let t=e.onEnd,n=new $c,s,i,o,a=Lt();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((m,f)=>{
i=b=>{i=null,n.push(b);try{m(r(n))}catch(w){f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
Lt()})}},l=m=>i!=null?i(m):(n.push(m),s),u=m=>(n=new $c,i!=null?i({error:m}):(n.push({error:m}),s)),d=m=>{if(o)return s;
if(e?.objectMode!==!0&&m?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:m})},h=m=>o?s:(o=!0,m!=null?u(m):l({done:!0})),p=()=>(n=new $c,h(),{done:!0}),g=m=>(h(m),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:p,throw:g,push:d,end:h,get readableLength(){return n.size},onEmpty:async m=>{
const f=m?.signal;if(f?.throwIfAborted(),n.isEmpty())return;let b,w;f!=null&&(b=new Promise((k,x)=>{w=()=>{x(new b3)},f.
addEventListener("abort",w)}));try{await Promise.race([a.promise,b])}finally{w!=null&&f!=null&&f?.removeEventListener("a\
bort",w)}}},t==null)return s;const y=s;return s={[Symbol.asyncIterator](){return this},next(){return y.next()},throw(m){
return y.throw(m),t!=null&&(t(m),t=void 0),{done:!0}},return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:d,
end(m){return y.end(m),t!=null&&(t(m),t=void 0),s},get readableLength(){return y.readableLength},onEmpty:m=>y.onEmpty(m)},
s}var Nc={exports:{}},Jf;function k3(){return Jf||(Jf=1,(function(r){var e=Object.prototype.hasOwnProperty,t="~";function n(){}
Object.create&&(n.prototype=Object.create(null),new n().__proto__||(t=!1));function s(c,l,u){this.fn=c,this.context=l,this.
once=u||!1}function i(c,l,u,d,h){if(typeof u!="function")throw new TypeError("The listener must be a function");var p=new s(
u,d||c,h),g=t?t+l:l;return c._events[g]?c._events[g].fn?c._events[g]=[c._events[g],p]:c._events[g].push(p):(c._events[g]=
p,c._eventsCount++),c}function o(c,l){--c._eventsCount===0?c._events=new n:delete c._events[l]}function a(){this._events=
new n,this._eventsCount=0}a.prototype.eventNames=function(){var l=[],u,d;if(this._eventsCount===0)return l;for(d in u=this.
_events)e.call(u,d)&&l.push(t?d.slice(1):d);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(u)):
l},a.prototype.listeners=function(l){var u=t?t+l:l,d=this._events[u];if(!d)return[];if(d.fn)return[d.fn];for(var h=0,p=d.
length,g=new Array(p);h<p;h++)g[h]=d[h].fn;return g},a.prototype.listenerCount=function(l){var u=t?t+l:l,d=this._events[u];
return d?d.fn?1:d.length:0},a.prototype.emit=function(l,u,d,h,p,g){var y=t?t+l:l;if(!this._events[y])return!1;var m=this.
_events[y],f=arguments.length,b,w;if(m.fn){switch(m.once&&this.removeListener(l,m.fn,void 0,!0),f){case 1:return m.fn.call(
m.context),!0;case 2:return m.fn.call(m.context,u),!0;case 3:return m.fn.call(m.context,u,d),!0;case 4:return m.fn.call(
m.context,u,d,h),!0;case 5:return m.fn.call(m.context,u,d,h,p),!0;case 6:return m.fn.call(m.context,u,d,h,p,g),!0}for(w=
1,b=new Array(f-1);w<f;w++)b[w-1]=arguments[w];m.fn.apply(m.context,b)}else{var k=m.length,x;for(w=0;w<k;w++)switch(m[w].
once&&this.removeListener(l,m[w].fn,void 0,!0),f){case 1:m[w].fn.call(m[w].context);break;case 2:m[w].fn.call(m[w].context,
u);break;case 3:m[w].fn.call(m[w].context,u,d);break;case 4:m[w].fn.call(m[w].context,u,d,h);break;default:if(!b)for(x=1,
b=new Array(f-1);x<f;x++)b[x-1]=arguments[x];m[w].fn.apply(m[w].context,b)}}return!0},a.prototype.on=function(l,u,d){return i(
this,l,u,d,!1)},a.prototype.once=function(l,u,d){return i(this,l,u,d,!0)},a.prototype.removeListener=function(l,u,d,h){var p=t?
t+l:l;if(!this._events[p])return this;if(!u)return o(this,p),this;var g=this._events[p];if(g.fn)g.fn===u&&(!h||g.once)&&
(!d||g.context===d)&&o(this,p);else{for(var y=0,m=[],f=g.length;y<f;y++)(g[y].fn!==u||h&&!g[y].once||d&&g[y].context!==d)&&
m.push(g[y]);m.length?this._events[p]=m.length===1?m[0]:m:o(this,p)}return this},a.prototype.removeAllListeners=function(l){
var u;return l?(u=t?t+l:l,this._events[u]&&o(this,u)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.
removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=t,a.EventEmitter=a,r.exports=a})(Nc)),Nc.exports}var E3=k3();
const x3=Xg(E3);let S3=class Hb extends Error{name="TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(
this,Hb)}};const Xf=r=>r.reason??new DOMException("This operation was aborted.","AbortError");function v3(r,e){const{milliseconds:t,
fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const u=new Promise((d,h)=>{if(typeof t!=
"number"||Math.sign(t)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(o?.
aborted){h(Xf(o));return}if(o&&(c=()=>{h(Xf(o))},o.addEventListener("abort",c,{once:!0})),r.then(d,h),t===Number.POSITIVE_INFINITY)
return;const p=new S3;a=i.setTimeout.call(void 0,()=>{if(n){try{d(n())}catch(g){h(g)}return}typeof r.cancel=="function"&&
r.cancel(),s===!1?d():s instanceof Error?h(s):(p.message=s??`Promise timed out after ${t} milliseconds`,h(p))},t)}).finally(
()=>{u.clear(),c&&o&&o.removeEventListener("abort",c)});return u.clear=()=>{i.clearTimeout.call(void 0,a),a=void 0},u}function A3(r,e,t){
let n=0,s=r.length;for(;s>0;){const i=Math.trunc(s/2);let o=n+i;t(r[o],e)<=0?(n=++o,s-=i+1):s=i}return n}const _3=100;class Yf{#e=[];#r=0;enqueue(e,t){
const{priority:n=0,id:s}=t??{},{size:i}=this,o={priority:n,id:s,run:e};if(i===0){this.#e.length=0,this.#r=0,this.#e.push(
o);return}if(this.#e.at(-1).priority>=n){this.#e.push(o);return}this.#n();const a=A3(this.#e,o,(c,l)=>l.priority-c.priority);
this.#e.splice(a,0,o)}setPriority(e,t){const n=this.#e.findIndex((i,o)=>o>=this.#r&&i.id===e);if(n===-1)throw new ReferenceError(
`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.splice(n,1);this.enqueue(s.run,{priority:t,
id:e})}remove(e){const t=this.#e.findIndex((n,s)=>s<this.#r?!1:typeof e=="string"?n.id===e:n.run===e);t!==-1&&this.#e.splice(
t,1)}dequeue(){if(this.#r===this.#e.length)return;const e=this.#e[this.#r];return this.#r++,this.#r===this.#e.length?(this.#e.
length=0,this.#r=0):this.#r>_3&&this.#r>this.#e.length/2&&this.#n(),e?.run}filter(e){const t=[];for(let n=this.#r;n<this.#e.
length;n++){const s=this.#e[n];s.priority===e.priority&&t.push(s.run)}return t}get size(){return this.#e.length-this.#r}#n(){
this.#r!==0&&(this.#e.splice(0,this.#r),this.#r=0)}}class I3 extends x3{#e;#r;#n=0;#d;#p=!1;#b=!1;#u;#h=0;#a;#f;#c;#i=[];#o=0;#t;#w;#s=0;#m;#l;#B=1n;#k=new Map;#x=new Set;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:Yf,strict:!1,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expe\
cted \`intervalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString()??""}\` (${typeof e.intervalCap})`);
if(e.interval===void 0||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a f\
inite number >= 0, got \`${e.interval?.toString()??""}\` (${typeof e.interval})`);if(e.strict&&e.interval===0)throw new TypeError(
"The `strict` option requires a non-zero `interval`");if(e.strict&&e.intervalCap===Number.POSITIVE_INFINITY)throw new TypeError(
"The `strict` option requires a finite `intervalCap`");if(this.#e=e.carryoverIntervalCount??e.carryoverConcurrencyCount??
!1,this.#r=e.intervalCap===Number.POSITIVE_INFINITY||e.interval===0,this.#d=e.intervalCap,this.#u=e.interval,this.#c=e.strict,
this.#t=new e.queueClass,this.#w=e.queueClass,this.concurrency=e.concurrency,e.timeout!==void 0&&!(Number.isFinite(e.timeout)&&
e.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.
timeout})`);this.timeout=e.timeout,this.#l=e.autoStart===!1,this.#O()}#S(e){for(;this.#o<this.#i.length;){const n=this.#i[this.#o];
if(n!==void 0&&e-n>=this.#u)this.#o++;else break}(this.#o>100&&this.#o>this.#i.length/2||this.#o===this.#i.length)&&(this.#i=
this.#i.slice(this.#o),this.#o=0)}#L(e){this.#c?this.#i.push(e):this.#n++}#D(){this.#c?this.#i.length>this.#o&&this.#i.pop():
this.#n>0&&this.#n--}#v(){return this.#i.length-this.#o}get#P(){return this.#r?!0:this.#c?this.#v()<this.#d:this.#n<this.#d}get#$(){
return this.#s<this.#m}#N(){this.#s--,this.#s===0&&this.emit("pendingZero"),this.#E(),this.emit("next")}#U(){this.#f=void 0,
this.#M(),this.#T()}#F(e){if(this.#c){if(this.#S(e),this.#v()>=this.#d){const n=this.#i[this.#o],s=this.#u-(e-n);return this.#I(
s),!0}return!1}if(this.#a===void 0){const t=this.#h-e;if(t<0)this.#n=this.#e?this.#s:0;else return this.#I(t),!0}return!1}#I(e){
this.#f===void 0&&(this.#f=setTimeout(()=>{this.#U()},e))}#A(){this.#a&&(clearInterval(this.#a),this.#a=void 0)}#C(){this.#f&&
(clearTimeout(this.#f),this.#f=void 0)}#E(){if(this.#t.size===0){if(this.#A(),this.emit("empty"),this.#s===0){if(this.#C(),
this.#c&&this.#o>0){const t=Date.now();this.#S(t)}this.emit("idle")}return!1}let e=!1;if(!this.#l){const t=Date.now(),n=!this.#F(
t);if(this.#P&&this.#$){const s=this.#t.dequeue();this.#r||(this.#L(t),this.#y()),n&&this.#T(),s(),this.emit("active"),e=
!0}}return e}#T(){this.#r||this.#a!==void 0||this.#c||(this.#a=setInterval(()=>{this.#M()},this.#u),this.#h=Date.now()+this.#u)}#M(){
this.#c||(this.#a!==void 0&&(this.#n===0&&this.#s===0?this.#A():this.#h=Date.now()+this.#u),this.#n=this.#e?this.#s:0),this.#_(),
this.#y()}#_(){for(;this.#E(););}get concurrency(){return this.#m}set concurrency(e){if(!(typeof e=="number"&&e>=1))throw new TypeError(
`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this.#m=e,this.#_()}setPriority(e,t){
if(typeof t!="number"||!Number.isFinite(t))throw new TypeError(`Expected \`priority\` to be a finite number, got \`${t}\`\
 (${typeof t})`);this.#t.setPriority(e,t)}async add(e,t={}){if(t={timeout:this.timeout,...t,id:t.id??(this.#B++).toString()},
t.timeout!==void 0&&!(Number.isFinite(t.timeout)&&t.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive \
finite number, got \`${t.timeout}\` (${typeof t.timeout})`);return new Promise((n,s)=>{const i=Symbol(`task-${t.id}`);let o=()=>{};
const a=async()=>{o(),this.#s++,this.#k.set(i,{id:t.id,priority:t.priority??0,startTime:Date.now(),timeout:t.timeout});let l;
try{try{t.signal?.throwIfAborted()}catch(h){throw this.#z(),this.#k.delete(i),h}let u=e({signal:t.signal});if(t.timeout!==
void 0&&(u=v3(Promise.resolve(u),{milliseconds:t.timeout,message:`Task timed out after ${t.timeout}ms (queue has ${this.#s}\
 running, ${this.#t.size} waiting)`})),t.signal){const{signal:h}=t;u=Promise.race([u,new Promise((p,g)=>{l=()=>{g(h.reason)},
h.addEventListener("abort",l,{once:!0}),h.aborted&&l()})])}const d=await u;n(d),this.emit("completed",d)}catch(u){s(u),this.
emit("error",u)}finally{l&&t.signal?.removeEventListener("abort",l),this.#k.delete(i),queueMicrotask(()=>{this.#N()})}};
this.#t.enqueue(a,t);const c=()=>{if(this.#t instanceof Yf){this.#t.remove(a);return}this.#t.remove?.(t.id)};if(t.signal){
const{signal:l}=t,u=()=>{o(),c(),s(l.reason),this.#E(),this.emit("next")};if(o=()=>{l.removeEventListener("abort",u),this.#x.
delete(o)},l.aborted){u();return}l.addEventListener("abort",u,{once:!0}),this.#x.add(o)}this.emit("add"),this.#E()})}async addAll(e,t){
return Promise.all(e.map(async n=>this.add(n,t)))}start(){return this.#l?(this.#l=!1,this.#_(),this):this}pause(){this.#l=
!0}clear(){for(const e of this.#x)e();this.#t=new this.#w,this.#A(),this.#R(),this.emit("empty"),this.#s===0&&(this.#C(),
this.emit("idle")),this.emit("next")}async onEmpty(){this.#t.size!==0&&await this.#g("empty")}async onSizeLessThan(e){this.#t.
size<e||await this.#g(["next","active"],()=>this.#t.size<e)}async onIdle(){this.#s===0&&this.#t.size===0||await this.#g(
"idle")}async onPendingZero(){this.#s!==0&&await this.#g("pendingZero")}async onRateLimit(){this.isRateLimited||await this.#g(
"rateLimit")}async onRateLimitCleared(){this.isRateLimited&&await this.#g("rateLimitCleared")}onError(){return new Promise(
(e,t)=>{const n=s=>{this.off("error",n),t(s)};this.on("error",n)})}async#g(e,t){const n=Array.isArray(e)?e:[e];return new Promise(
s=>{const i=()=>{if(!(t&&!t())){for(const o of n)this.off(o,i);s()}};for(const o of n)this.on(o,i)})}get size(){return this.#t.
size}sizeBy(e){return this.#t.filter(e).length}get pending(){return this.#s}get isPaused(){return this.#l}#O(){this.#r||
(this.on("add",()=>{this.#t.size>0&&this.#y()}),this.on("next",()=>{this.#y()}))}#y(){this.#r||this.#b||(this.#b=!0,queueMicrotask(
()=>{this.#b=!1,this.#R()}))}#z(){this.#r||(this.#D(),this.#y())}#R(){const e=this.#p;if(this.#r||this.#t.size===0){e&&(this.#p=
!1,this.emit("rateLimitCleared"));return}let t;if(this.#c){const s=Date.now();this.#S(s),t=this.#v()}else t=this.#n;const n=t>=
this.#d;n!==e&&(this.#p=n,this.emit(n?"rateLimit":"rateLimitCleared"))}get isRateLimited(){return this.#p}get isSaturated(){
return this.#s===this.#m&&this.#t.size>0||this.isRateLimited&&this.#t.size>0}get runningTasks(){return[...this.#k.values()].
map(e=>({...e,timeoutRemaining:e.timeout?Math.max(0,e.startTime+e.timeout-Date.now()):void 0}))}}async function Kb(r,e,t,n,s,i,o){
if(e instanceof Uint8Array){const l=Zl(e,n,s,i);t.push(l);return}if(e.Data==null)throw new Be("no data in PBNode");let a;
try{a=lt.unmarshal(e.Data)}catch(l){throw new Be(l.message)}if(a.data!=null){const l=a.data,u=Zl(l,n,s,i);t.push(u),n+=BigInt(
u.byteLength)}const c=[];if(e.Links.length!==a.blockSizes.length)throw new Be("Inconsistent block sizes and dag links");
for(let l=0;l<e.Links.length;l++){const u=e.Links[l],d=n,h=d+a.blockSizes[l];if((s>=d&&s<h||i>=d&&i<=h||s<d&&i>h)&&c.push(
{link:u,blockStart:n}),n=h,n>i)break}await Gb(c,l=>n3(l,u=>async()=>{const d=await Pt(r.get(u.link.Hash,o));return{...u,
block:d}}),l=>s3(l,{ordered:!0,concurrency:o.blockReadConcurrency??DC}),async l=>{for await(const{link:u,block:d,blockStart:h}of l){
let p;switch(u.Hash.code){case vi:p=ci(d);break;case md:p=d;break;default:t.end(new Be(`Unsupported codec: ${u.Hash.code}`));
return}const g=new I3({concurrency:1});g.on("error",y=>{t.end(y)}),g.add(async()=>{o.onProgress?.(new sr("unixfs:exporte\
r:walk:file",{cid:u.Hash})),await Kb(r,p,t,h,s,i,o)}),await g.onIdle()}}),n>=i&&t.end()}function Zf(r,e,t,n,s){async function*i(o={}){
const a=t.fileSize();if(a===void 0)throw new Error("File was a directory");const{start:c,end:l}=Ob(a,o.offset,o.length);
if(l===0n)return;let u=0n;const d=l-c,h=y3();o.onProgress?.(new sr("unixfs:exporter:walk:file",{cid:r})),Kb(s,e,h,0n,c,l,
o).catch(p=>{h.end(p)});for await(const p of h)if(p!=null){if(u+=BigInt(p.byteLength),u>d)throw h.end(),new Xo("Read too\
 many bytes - the file size reported by the UnixFS data in the root node may be incorrect");u===d&&h.end(),o.onProgress?.(
new sr("unixfs:exporter:progress:unixfs:file",{bytesRead:u,totalBytes:d,fileSize:a})),yield p}if(u<d)throw new Yo("Trave\
rsed entire DAG but did not read enough bytes")}return i}async function*C3(r,e,t,n){let s=-1,i=0;for await(const o of Qb(
r,e,t,n))if(s++,!(n.offset!=null&&n.offset<s)&&(yield o,i++,n.length!=null&&n.length===i))return}async function*Qb(r,e,t,n){
const s=await Pt(t.get(r,n)),i=ui.decode(s);if(i.data?.fanOut==null)throw new Be("missing fanout");const o=(i.data.fanOut-
1n).toString(16).length;for(const a of i.links){if(a.name==null||a.hash==null)continue;const c=mn.decode(a.hash);if(a.name.
length===o)yield*Qb(c,e,t,n);else{const l=a.name.substring(o);yield{cid:c,name:a.name.substring(o),path:`${e}/${l}`,size:BigInt(
a.tSize??0)}}}}function T3(r,e,t,n,s){function i(o={}){return o.onProgress?.(new sr("unixfs:exporter:walk:hamt-sharded-d\
irectory",{cid:r})),C3(r,n,s,o)}return i}const M3={raw:Zf,file:Zf,directory:e3,"hamt-sharded-directory":T3,metadata:(r,e,t,n)=>()=>[],
symlink:(r,e,t,n)=>()=>[]};async function R3(r,e,t,n,s){const i=await Pt(n.get(r,s));let o;try{o=ci(i)}catch(l){throw new Be(
l.message)}if(o.Data==null)throw new Be("no data in PBNode");let a;try{a=lt.unmarshal(o.Data)}catch(l){throw new Be(l.message)}
const c=M3[a.type](r,o,a,t,n);if(c==null)throw new En("could not find content exporter");return a.isDirectory()?{type:"d\
irectory",cid:r,name:e,path:t,entries:c,unixfs:a,node:o,size:BigInt(i.byteLength)}:{type:"file",cid:r,name:e,path:t,content:c,
unixfs:a,node:o,size:a.fileSize()}}const B3={[vi]:R3,[md]:ZC,[vb]:Hf,[Pb]:Hf,[Mb]:JC,[Db.code]:XC,[Bb]:YC};async function ep(r,e,t={}){
let n,s;if(r instanceof String||typeof r=="string"){const o=await QC(HC(r,e,t));if(o==null)throw new En(`Could not walk \
path to ${r}`);n=o.cid,s=o.name,r=o.path}else if(mn.asCID(r)===r||r instanceof mn)n=r,s=r=n.toString();else throw new Fs(
"Path must be string or CID");const i=B3[n.code];if(i==null)throw new mi(`No resolver for code ${n.code}`);return i(n,s,
r,e,t)}function eu(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return rp(r);if(r instanceof ArrayBuffer)
return new Uint8Array(r);if(ArrayBuffer.isView(r))return rp(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error(
"Unknown type, must be binary type")}function L3(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}const tp=4096;function D3(r){const e=r.length;if(e<=tp)return String.fromCharCode.apply(String,r);let t="",n=0;
for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=tp));return t}function P3(r){return r?.buffer instanceof ArrayBuffer}
function rp(r){return P3(r)?r:r.slice()}function $3(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function g(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,b++;for(var A=(x-k)*p+1>>>0,S=new Uint8Array(A);k!==x;){for(var E=f[k],_=0,I=A-1;(E!==
0||_<w)&&I!==-1;I--,_++)E+=256*S[I]>>>0,S[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=_,k++}for(var M=A-
w;M!==A&&S[M]===0;)M++;for(var T=d.repeat(b);M<A;++M)T+=r.charAt(S[M]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,k=0;f[b]===d;)w++,b++;for(var x=(f.
length-b)*h+1>>>0,A=new Uint8Array(x);f[b];){var S=n[f.charCodeAt(b)];if(S===255)return;for(var E=0,_=x-1;(S!==0||E<k)&&
_!==-1;_--,E++)S+=u*A[_]>>>0,A[_]=S%256>>>0,S=S/256>>>0;if(S!==0)throw new Error("Non-zero carry");k=E,b++}if(f[b]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),T=w;I!==x;)M[T++]=A[I++];return M}}}function m(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:y,decode:m}}var N3=$3,U3=N3;class F3{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class O3{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Jb(this,e)}}class z3{decoders;constructor(e){
this.decoders=e}or(e){return Jb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function Jb(r,e){return new z3({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}class q3{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){
this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new F3(e,t,n),this.decoder=new O3(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Wa({name:r,prefix:e,encode:t,decode:n}){
return new q3(r,e,t,n)}function Ri({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=U3(t,r,n);
return Wa({prefix:e,name:r,encode:s,decode:o=>eu(i(o))})}function j3(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function G3(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function W3(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function je({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=W3(n,s);return Wa(
{prefix:e,name:r,encode(o){return G3(o,n,t)},decode(o){return j3(o,i,t,r)}})}const V3=Ri({prefix:"9",name:"base10",alphabet:"\
0123456789"}),H3=Object.freeze(Object.defineProperty({__proto__:null,base10:V3},Symbol.toStringTag,{value:"Module"})),K3=je(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Q3=je({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),J3=Object.freeze(Object.defineProperty({__proto__:null,
base16:K3,base16upper:Q3},Symbol.toStringTag,{value:"Module"})),X3=je({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
Y3=Object.freeze(Object.defineProperty({__proto__:null,base2:X3},Symbol.toStringTag,{value:"Module"})),Xb=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),Z3=Xb.reduce((r,e,t)=>(r[t]=e,r),[]),e5=Xb.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function t5(r){return r.reduce((e,t)=>(e+=Z3[t],e),"")}function r5(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=e5[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const n5=Wa({prefix:"🚀",name:"\
base256emoji",encode:t5,decode:r5}),s5=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:n5},Symbol.toStringTag,
{value:"Module"})),i5=je({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
o5=je({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),a5=je(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),c5=je({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),l5=je({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),u5=je({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),d5=je({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),h5=je({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),f5=je({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),p5=Object.freeze(Object.defineProperty({__proto__:null,
base32:i5,base32hex:l5,base32hexpad:d5,base32hexpadupper:h5,base32hexupper:u5,base32pad:a5,base32padupper:c5,base32upper:o5,
base32z:f5},Symbol.toStringTag,{value:"Module"})),m5=Ri({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),g5=Ri({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
b5=Object.freeze(Object.defineProperty({__proto__:null,base36:m5,base36upper:g5},Symbol.toStringTag,{value:"Module"})),y5=Ri(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),w5=Ri({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),k5=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:y5,base58flickr:w5},Symbol.toStringTag,{value:"Module"})),E5=je({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),x5=je({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),S5=je({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),v5=je({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),A5=Object.freeze(Object.defineProperty(
{__proto__:null,base64:E5,base64pad:x5,base64url:S5,base64urlpad:v5},Symbol.toStringTag,{value:"Module"})),_5=je({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),I5=Object.freeze(Object.defineProperty({__proto__:null,base8:_5},Symbol.
toStringTag,{value:"Module"})),C5=Wa({prefix:"\0",name:"identity",encode:r=>D3(eu(r)),decode:r=>eu(L3(r))}),T5=Object.freeze(
Object.defineProperty({__proto__:null,identity:C5},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const np={...T5,...Y3,...I5,...H3,...J3,...p5,...b5,...k5,...A5,...s5};function M5(r=0){return new Uint8Array(r)}function Yb(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const sp=Yb("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Uc=Yb("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=M5(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),Zb={utf8:sp,"utf-8":sp,hex:np.base16,latin1:Uc,ascii:Uc,binary:Uc,...np};function R5(r,e="utf8"){const t=Zb[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function B5(r,e="ut\
f8"){const t=Zb[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}const fr="\
/",ey=new TextEncoder().encode(fr),ji=ey[0];class pt{_buf;constructor(e,t){if(typeof e=="string")this._buf=R5(e);else if(e instanceof
Uint8Array)this._buf=e;else throw new Error("Invalid key, should be String of Uint8Array");if(t==null&&(t=!0),t&&this.clean(),
this._buf.byteLength===0||this._buf[0]!==ji)throw new Error("Invalid key")}toString(e="utf8"){return B5(this._buf,e)}uint8Array(){
return this._buf}get[Symbol.toStringTag](){return`Key(${this.toString()})`}static withNamespaces(e){return new pt(e.join(
fr))}static random(){return new pt(Math.random().toString().substring(2))}static asKey(e){return e instanceof Uint8Array||
typeof e=="string"?new pt(e):typeof e.uint8Array=="function"?new pt(e.uint8Array()):null}clean(){if((this._buf==null||this.
_buf.byteLength===0)&&(this._buf=ey),this._buf[0]!==ji){const e=new Uint8Array(this._buf.byteLength+1);e.fill(ji,0,1),e.
set(this._buf,1),this._buf=e}for(;this._buf.byteLength>1&&this._buf[this._buf.byteLength-1]===ji;)this._buf=this._buf.subarray(
0,-1)}less(e){const t=this.list(),n=e.list();for(let s=0;s<t.length;s++){if(n.length<s+1)return!1;const i=t[s],o=n[s];if(i<
o)return!0;if(i>o)return!1}return t.length<n.length}reverse(){return pt.withNamespaces(this.list().slice().reverse())}namespaces(){
return this.list()}baseNamespace(){const e=this.namespaces();return e[e.length-1]}list(){return this.toString().split(fr).
slice(1)}type(){return L5(this.baseNamespace())}name(){return D5(this.baseNamespace())}instance(e){return new pt(this.toString()+
":"+e)}path(){let e=this.parent().toString();return e.endsWith(fr)||(e+=fr),e+=this.type(),new pt(e)}parent(){const e=this.
list();return e.length===1?new pt(fr):new pt(e.slice(0,-1).join(fr))}child(e){return this.toString()===fr?e:e.toString()===
fr?this:new pt(this.toString()+e.toString(),!1)}isAncestorOf(e){return e.toString()===this.toString()?!1:e.toString().startsWith(
this.toString())}isDecendantOf(e){return e.toString()===this.toString()?!1:this.toString().startsWith(e.toString())}isTopLevel(){
return this.list().length===1}concat(...e){return pt.withNamespaces([...this.namespaces(),...P5(e.map(t=>t.namespaces()))])}}
function L5(r){const e=r.split(":");return e.length<2?"":e.slice(0,-1).join(":")}function D5(r){const e=r.split(":");return e[e.
length-1]}function P5(r){return[].concat(...r)}const $5="peercompute-ipfs-artifacts-v1-",tu=["blocks","roots","routing"],
ty=r=>r instanceof Uint8Array?r.byteLength:new TextEncoder().encode(JSON.stringify(r)).byteLength,Fc=r=>r===void 0?void 0:
structuredClone(r),yo=()=>({bytes:0,entries:0,generation:0});function ry(r,e,t,{maximumBytes:n=Number.MAX_SAFE_INTEGER,maximumEntries:s=Number.
MAX_SAFE_INTEGER}={}){const i={bytes:r.bytes-(e?.size||0)+t,entries:r.entries+(e?0:1),generation:(r.generation||0)+1};if(Object.
values(i).some(o=>!Number.isSafeInteger(o)||o<0))throw new RangeError("Artifact storage accounting exceeds safe integer \
range.");if(i.bytes>n||i.entries>s)throw new DOMException("Artifact storage quota exceeded.","QuotaExceededError");return i}
class N5{constructor({name:e="memory"}={}){this.name=e,this.data=new Map(tu.map(t=>[t,new Map])),this.usage=new Map(tu.map(
t=>[t,yo()]))}async open(){}async close(){}async get(e,t){return Fc(this.data.get(e).get(t)?.value)}async getUsage(e){return{
...this.usage.get(e)}}async put(e,t,n,s){const i=this.data.get(e),o=i.get(t);if(e==="blocks"&&o)return!1;const a=ty(n),c=ry(
this.usage.get(e),o,a,s);return i.set(t,{value:Fc(n),size:a,generation:c.generation}),this.usage.set(e,c),!0}async delete(e,t){
const n=this.data.get(e),s=n.get(t);if(!s)return!1;const i=this.usage.get(e);return this.usage.set(e,{...i,bytes:i.bytes-
s.size,entries:i.entries-1}),n.delete(t),!0}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return[...this.data.get(
e).keys()].sort().filter(i=>t===void 0||i>t).slice(0,n).map(i=>({key:i,generation:this.data.get(e).get(i).generation,...s?
{}:{value:Fc(this.data.get(e).get(i).value)}}))}}function Jt(r){return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.
onerror=()=>t(r.error)})}class U5{constructor({name:e="default",indexedDBImpl:t=globalThis.indexedDB,keyRange:n=globalThis.
IDBKeyRange}={}){this.name=`${$5}${e}`,this.indexedDB=t,this.keyRange=n,this.database=null,this.opening=null}async open(){
if(!this.database){if(this.opening)return this.opening;if(!this.indexedDB?.open||!this.keyRange)throw new Error("Persist\
ent artifacts require IndexedDB and IDBKeyRange.");this.opening=new Promise((e,t)=>{const n=this.indexedDB.open(this.name,
1);let s=!1;n.onupgradeneeded=()=>{for(const i of[...tu,"usage"])n.result.createObjectStore(i)},n.onerror=()=>t(n.error),
n.onblocked=()=>{s=!0,t(new Error("Artifact database open blocked by another context."))},n.onsuccess=()=>{if(s){n.result.
close();return}this.database=n.result,this.database.onversionchange=()=>{this.database?.close(),this.database=null},e()}});
try{await this.opening}finally{this.opening=null}}}async close(){await this.opening,this.database?.close(),this.database=
null}async _transaction(e,t,n){if(!this.database)throw new Error("Artifact database is closed.");const s=this.database.transaction(
e,t),i=new Promise((o,a)=>{s.oncomplete=o,s.onabort=()=>a(s.error||new Error("Artifact transaction aborted.")),s.onerror=
()=>{}});try{const o=await n(s);return await i,o}catch(o){try{s.abort()}catch{}throw await i.catch(()=>{}),o}}async get(e,t){
return this._transaction([e],"readonly",async n=>(await Jt(n.objectStore(e).get(t)))?.value)}async getUsage(e){return this.
_transaction(["usage"],"readonly",async t=>await Jt(t.objectStore("usage").get(e))||yo())}async put(e,t,n,s){return this.
_transaction([e,"usage"],"readwrite",async i=>{const o=i.objectStore(e),a=i.objectStore("usage"),[c,l]=await Promise.all(
[Jt(o.get(t)),Jt(a.get(e))]);if(e==="blocks"&&c)return!1;const u=ty(n),d=ry(l||yo(),c,u,s);return await Promise.all([Jt(
o.put({value:n,size:u,generation:d.generation},t)),Jt(a.put(d,e))]),!0})}async delete(e,t){return this._transaction([e,"\
usage"],"readwrite",async n=>{const s=n.objectStore(e),i=n.objectStore("usage"),[o,a]=await Promise.all([Jt(s.get(t)),Jt(
i.get(e))]);if(!o)return!1;const c=a||yo();return await Promise.all([Jt(s.delete(t)),Jt(i.put({...c,bytes:c.bytes-o.size,
entries:c.entries-1},e))]),!0})}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return this._transaction([e],"readon\
ly",i=>new Promise((o,a)=>{const c=i.objectStore(e),l=t===void 0?void 0:this.keyRange.lowerBound(t,!0),u=c.openCursor(l),
d=[];u.onerror=()=>a(u.error),u.onsuccess=()=>{const h=u.result;if(!h||d.length>=n){o(d);return}d.push({key:h.key,generation:h.
value.generation,...s?{}:{value:h.value.value}}),d.length>=n?o(d):h.continue()}}))}}const Oc=new Map;function pe(r){if(r?.
aborted)throw r.reason||new DOMException("Aborted","AbortError")}async function Gi(r,e,t,n){if(pe(t),n)return new Promise(
(i,o)=>{n.request(r,{mode:e,...t?{signal:t}:{}},async()=>{await new Promise(a=>i(a))}).catch(o)});let s=Oc.get(r);return s||
(s={readers:0,writer:!1,queue:[]},Oc.set(r,s)),new Promise((i,o)=>{const a=()=>{for(;s.queue.length&&!s.writer;){const l=s.
queue[0];if(l.mode==="exclusive"&&s.readers)break;s.queue.shift(),l.signal?.removeEventListener("abort",l.abort),l.mode===
"exclusive"?s.writer=!0:s.readers++;let u=!1;if(l.resolve(()=>{u||(u=!0,l.mode==="exclusive"?s.writer=!1:s.readers--,a(),
!s.writer&&!s.readers&&!s.queue.length&&Oc.delete(r))}),l.mode==="exclusive")break}},c={mode:e,signal:t,resolve:i,abort:()=>{
const l=s.queue.indexOf(c);l>=0&&s.queue.splice(l,1),o(t.reason||new DOMException("Aborted","AbortError")),a()}};t?.addEventListener(
"abort",c.abort,{once:!0}),s.queue.push(c),a()})}const ny="peercompute.artifact.manifest.v1",un=256*1024,sy=16*1024**3,la=new TextEncoder;
function ye(r){const e=Zn.asCID(r)||Zn.parse(String(r));if(![85,112].includes(e.code)||e.multihash.code!==18||e.multihash.
digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return e.toV1()}function wo(r,e=0,t={
remaining:un}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((t.remaining-=2)<0)throw new RangeError(
"Manifest exceeds byte limit.");if(typeof r=="string"){if(r.length>t.remaining||(t.remaining-=la.encode(r).length)<0)throw new RangeError(
"Manifest exceeds byte limit.");return r}if(r===null||typeof r=="boolean"||typeof r=="number"&&Number.isFinite(r))return r;
if(Array.isArray(r)){if(r.length>4096)throw new RangeError("Manifest array exceeds item limit.");return r.map(s=>wo(s,e+
1,t))}if(!r||typeof r!="object"||Object.getPrototypeOf(r)!==Object.prototype)throw new TypeError("Manifest values must b\
e JSON values.");const n=Object.keys(r);if(n.length>1024)throw new RangeError("Manifest object exceeds key limit.");return Object.
fromEntries(n.sort().map(s=>(wo(s,e+1,t),[s,wo(r[s],e+1,t)])))}function Va(r,{maximumBytes:e=un,maximumFiles:t=1024,maximumFileBytes:n=sy}={}){
if(!r||r.schema!==ny||!Array.isArray(r.files)||r.files.length===0||r.files.length>t)throw new TypeError("Manifest requir\
es the supported schema and a bounded, nonempty files array.");const s=new Set(["schema","name","description","files","m\
odel","provenance"]);if(Object.keys(r).some(c=>!s.has(c)))throw new TypeError("Unsupported manifest field.");for(const c of[
"name","description"])if(r[c]!==void 0&&typeof r[c]!="string")throw new TypeError(`Manifest ${c} must be a string.`);if(r.
model!==void 0&&(!r.model||typeof r.model!="object"||Array.isArray(r.model)))throw new TypeError("Manifest model extensi\
on must be an object.");const i=new Set,o=r.files.map(c=>{if(!c||typeof c!="object")throw new TypeError("Invalid manifes\
t file.");if(Object.keys(c).some(d=>!["path","cid","size","sha256","mediaType"].includes(d)))throw new TypeError("Unsupp\
orted manifest file field.");const{path:l,size:u}=c;if(typeof l!="string"||!l||la.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(l)||l.split("/").some(d=>!d||d==="."||d==="..")||i.has(l))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(u)||u<0||u>n)throw new RangeError("Invalid \
file size.");if(c.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(c.sha256))throw new TypeError("Invalid SHA-256.");if(c.mediaType!==
void 0&&(typeof c.mediaType!="string"||c.mediaType.length>256))throw new TypeError("Invalid media type.");return i.add(l),
{...c,cid:ye(c.cid).toString()}}).sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),a=wo({...r,files:o},0,{remaining:e});if(la.
encode(JSON.stringify(a)).byteLength>e)throw new RangeError("Manifest exceeds byte limit.");return a}function F5(r,e){return la.
encode(JSON.stringify(Va(r,e)))}function ru(r,e={}){if(r.byteLength>(e.maximumBytes??un))throw new RangeError("Manifest \
exceeds byte limit.");return Va(JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(r)),e)}const As=Object.freeze({name:"\
peercompute.unixfs.v1",cidVersion:1,hash:"sha2-256",rawLeaves:!0,chunkSize:256*1024,maxChildrenPerNode:174,layout:"balan\
ced",reduceSingleLeafToSelf:!0}),zc=r=>Array.from(r,e=>e.toString(16).padStart(2,"0")).join(""),_s=Symbol("artifact-impo\
rt-retention");function rt(r,e,t=1){if(!Number.isSafeInteger(r)||r<t)throw new RangeError(`Invalid ${e}.`);return r}function qc(r){
const e=new Error(`Artifact block not found: ${r}`);return e.name="NotFoundError",e.code="ERR_NOT_FOUND",e}function ua(r,e){
return e?(e.aborted&&(Promise.resolve(r).catch(()=>{}),pe(e)),new Promise((t,n)=>{const s=()=>n(e.reason||new DOMException(
"Aborted","AbortError"));e.addEventListener("abort",s,{once:!0}),Promise.resolve(r).then(t,n).finally(()=>e.removeEventListener(
"abort",s))})):r}async function*ip(r,e){if(r instanceof Uint8Array){yield r;return}if(r?.getReader){const t=r.getReader();
let n=!1;try{for(;;){const s=await ua(t.read(),e);if(s.done){n=!0;return}yield s.value}}finally{n||t.cancel().catch(()=>{}),
t.releaseLock()}return}if(r?.[Symbol.asyncIterator]||r?.[Symbol.iterator]){const t=r[Symbol.asyncIterator]?.()||r[Symbol.
iterator]();let n=!1;try{for(;;){const s=await ua(t.next(),e);if(s.done){n=!0;return}yield s.value}}finally{n||Promise.resolve(
t.return?.()).catch(()=>{})}return}throw new TypeError("Artifact source must be bytes or a byte stream.")}class O5{constructor({
name:e="default",persistent:t=!0,backend:n,ownsBackend:s=n===void 0,capacity:i="bounded",maximumBytes:o=i==="browser"?Number.
MAX_SAFE_INTEGER:2*1024**3,maximumBlockBytes:a=2*1024**2,maximumFileBytes:c=sy,maximumTraversalBlocks:l=65536,maximumStoredBlocks:u=i===
"browser"?Number.MAX_SAFE_INTEGER:l,maximumRoots:d=i==="browser"?Number.MAX_SAFE_INTEGER:1024,maximumRoutingBytes:h=16*1024**
2,maximumConcurrentBlockWrites:p=4,maximumQueuedBlockWrites:g=16,lockManager:y=globalThis.navigator?.locks,onDestroy:m,indexedDBImpl:f,
keyRange:b}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/u.test(e))throw new TypeError("Invalid artifact store name.");if(![
"bounded","browser"].includes(i))throw new TypeError("Invalid artifact storage capacity policy.");this.capacity=i,this.name=
e,this.persistent=t,this.backend=n||(t?new U5({name:e,indexedDBImpl:f,keyRange:b}):new N5({name:e})),this.ownsBackend=s,
this.maximumBytes=rt(o,"maximumBytes"),this.maximumBlockBytes=rt(a,"maximumBlockBytes"),this.maximumFileBytes=rt(c,"maxi\
mumFileBytes"),this.maximumTraversalBlocks=rt(l,"maximumTraversalBlocks"),this.maximumStoredBlocks=rt(u,"maximumStoredBl\
ocks"),this.maximumRoots=rt(d,"maximumRoots"),this.maximumRoutingBytes=rt(h,"maximumRoutingBytes"),this.maximumConcurrentBlockWrites=
rt(p,"maximumConcurrentBlockWrites"),this.maximumQueuedBlockWrites=rt(g,"maximumQueuedBlockWrites",0),this.activeBlockWrites=
0,this.waitingBlockWrites=[],this.lockManager=y,this.lockName=`peercompute-artifacts:${this.backend.name||e}`,this.onDestroy=
m,this.controller=new AbortController,this.operations=new Set,this.isOpen=!1,this.destroyed=!1,this.usage={bytes:0,entries:0},
this.rootUsage={bytes:0,entries:0},this.blockstore=this._createBlockstore(),this.datastore=this._createDatastore()}async open(){
if(this.destroyed)throw new Error("Artifact store is destroyed.");if(this.opening)return this.opening;if(!this.isOpen){this.
opening=(async()=>{if(this.persistent&&!this.lockManager?.request&&!this.backend.supportsExclusiveAccess)throw new Error(
"Persistent artifact storage requires Web Locks for cross-context GC safety.");if(await this.backend.open(),this.persistent&&
!this.lockManager?.request&&!this.backend.hasExclusiveLock)throw new Error("Persistent artifact backend did not acquire \
its exclusive storage lock.");this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.backend.getUsage(
"roots"),this.isOpen=!0})();try{await this.opening}finally{this.opening=null}}}async _begin(e,t="shared"){if(this.destroyed)
throw new Error("Artifact store is destroyed.");const n=e?AbortSignal.any([e,this.controller.signal]):this.controller.signal;
pe(n),await this.open();const s=t==="none"?()=>{}:await Gi(`${this.lockName}:gc`,t,n,this.lockManager);try{pe(n)}catch(l){
throw s(),l}let i;const a={settled:new Promise(l=>{i=l}),paused:!1,finish:()=>{n.removeEventListener("abort",c),s(),this.
operations.delete(a),i()}},c=()=>{a.paused&&a.finish()};return n.addEventListener("abort",c,{once:!0}),this.operations.add(
a),{signal:n,finish:a.finish,pause:()=>{a.paused=!0,n.aborted&&a.finish()},resume:()=>{a.paused=!1,pe(n)}}}async _run(e,t,n,s){
if(s&&(s.store!==this||!s.held||n==="exclusive"))throw new Error("Artifact retention scope is no longer active.");const i=s?
AbortSignal.any([s.signal,...e?[e]:[]]):e,o=await this._begin(i,s?"none":n);try{const a=await t(o.signal);return pe(o.signal),
a}finally{o.finish()}}async _writeRoot(e,t,n){const s=await Gi(`${this.lockName}:roots`,"exclusive",n,this.lockManager);
try{pe(n);const i=await this.backend.get("roots",e),o=t(i);return pe(n),await this.backend.put("roots",e,o,{maximumEntries:this.
maximumRoots,maximumBytes:Math.min(Number.MAX_SAFE_INTEGER,this.maximumRoots*(un+2048))}),this.rootUsage=await this.backend.
getUsage("roots"),structuredClone(o)}finally{s()}}async _readBlock(e,t){pe(t);const n=ye(e),s=await this.backend.get("bl\
ocks",n.toString());if(!s)throw qc(n);return await this._verifyBlock(n,s),pe(t),s}async _verifyBlock(e,t){if(!(t instanceof
Uint8Array)||t.byteLength>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");const n=await gh.
digest(t);if(!Zn.createV1(e.code,n).equals(e))throw new Error("Artifact block CID verification failed.")}async _blockWritePermit(e){
if(pe(e),this.activeBlockWrites>=this.maximumConcurrentBlockWrites){if(this.waitingBlockWrites.length>=this.maximumQueuedBlockWrites)
throw new Error("Artifact block write queue is full.");await new Promise((t,n)=>{const s={resolve:t,signal:e,abort:()=>{
const i=this.waitingBlockWrites.indexOf(s);i>=0&&this.waitingBlockWrites.splice(i,1),n(e.reason||new DOMException("Abort\
ed","AbortError"))}};e?.addEventListener("abort",s.abort,{once:!0}),this.waitingBlockWrites.push(s)})}else this.activeBlockWrites++;
return()=>{const t=this.waitingBlockWrites.shift();t?(t.signal?.removeEventListener("abort",t.abort),t.resolve()):this.activeBlockWrites--}}async _putBlock(e,t,n){
const s=await this._blockWritePermit(n);try{return await this._persistBlock(e,t,n)}finally{s()}}async _persistBlock(e,t,n){
pe(n);const s=ye(e),i=t instanceof Uint8Array?null:new Uint8Array(this.maximumBlockBytes);let o=0,a;for await(const c of ip(
t,n)){if(pe(n),!(c instanceof Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(o+=c.byteLength,
o>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");i?i.set(c,o-c.byteLength):a=c.slice()}
return a=i?i.slice(0,o):a,await this._verifyBlock(s,a),pe(n),await this.backend.put("blocks",s.toString(),a,{maximumBytes:this.
maximumBytes,maximumEntries:this.maximumStoredBlocks}),this.usage=await this.backend.getUsage("blocks"),s}_localBlocks(e){
const t=this;return{async*get(n){yield await t._readBlock(n,e)},put:(n,s)=>t._putBlock(n,s,e)}}async importFile(e,{signal:t,
expectedSize:n,expectedSha256:s,pin:i=!0,[_s]:o}={}){if(n!==void 0&&rt(n,"expectedSize",0),n>this.maximumFileBytes)throw new RangeError(
"File exceeds byte limit.");if(s!==void 0&&!/^[a-f0-9]{64}$/u.test(s))throw new TypeError("Invalid expected SHA-256.");return this.
_run(t,async a=>{const c=Eh.create();let l=0;const u=this;async function*d(){for await(const y of ip(e,a)){if(pe(a),!(y instanceof
Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(l+=y.byteLength,l>u.maximumFileBytes||
n!==void 0&&l>n)throw new RangeError("File exceeds declared byte limit.");for(let m=0;m<y.byteLength;m+=As.chunkSize){const f=y.
subarray(m,m+As.chunkSize);c.update(f),yield f}}}const h=await X8(d(),this._localBlocks(a),{cidVersion:1,rawLeaves:!0,reduceSingleLeafToSelf:!0,
wrapWithDirectory:!1,chunker:Cg({chunkSize:As.chunkSize}),layout:Hg({maxChildrenPerNode:As.maxChildrenPerNode}),fileImportConcurrency:1,
blockWriteConcurrency:1}),p=zc(c.digest());if(n!==void 0&&n!==l)throw new Error("File size does not match expected size.");
if(s!==void 0&&s!==p)throw new Error("File SHA-256 does not match expected digest.");const g=h.cid.toV1().toString();return this.
_writeRoot(g,y=>({cid:g,kind:"file",size:l,sha256:p,status:"complete",pinned:!!(i||y?.pinned),retain:!1,profile:As.name}),
a)},void 0,o)}async importManifest(e,{signal:t,pin:n=!0,[_s]:s}={}){const i=Va(e,{maximumFileBytes:this.maximumFileBytes}),
o=F5(i);return this._run(t,async a=>{for(const l of i.files)await this._recordVerifiedFile(l,a);const c=Zn.createV1(85,await gh.
digest(o));return await this._putBlock(c,o,a),this._writeRoot(c.toString(),l=>({cid:c.toString(),kind:"manifest",size:o.
byteLength,manifest:i,status:"complete",pinned:!!(n||l?.pinned),retain:!1}),a)},void 0,s)}async _verifyFile(e,t={},n){const s=await ep(
ye(e).toString(),this._localBlocks(n));if(!["file","raw"].includes(s.type))throw new TypeError("Artifact root must ident\
ify a file.");const i=Number(s.type==="raw"?s.node.byteLength:s.unixfs.fileSize());if(!Number.isSafeInteger(i)||i>this.maximumFileBytes||
t.size!==void 0&&i!==t.size)throw new RangeError("Artifact file size differs from its manifest or limit.");const o=Eh.create();
let a=0;for await(const l of this._fileChunks(e,{size:i,signal:n})){if(pe(n),a+=l.byteLength,a>i)throw new RangeError("A\
rtifact content exceeds declared size.");o.update(l)}const c=zc(o.digest());if(a!==i||t.sha256!==void 0&&c!==t.sha256)throw new Error(
"Artifact file integrity differs from its manifest.");return{size:i,sha256:c}}async*_fileChunks(e,{size:t,offset:n=0,length:s=t-
n,signal:i}){const o=n+s,a=[{cid:ye(e),start:0,size:t,depth:0}];let c=0,l=0;for(;a.length;){pe(i);const u=a.pop();if(++c>
this.maximumTraversalBlocks||u.depth>64)throw new RangeError("Artifact file traversal exceeds its bounds.");const d=await this.
_readBlock(u.cid,i);if(u.cid.code===85){if(d.byteLength!==u.size)throw new Error("Raw file block size differs from its U\
nixFS link.");const b=d.subarray(Math.max(0,n-u.start),Math.min(d.length,o-u.start));b.length&&(l+=b.length,yield b);continue}
const h=ci(d);if(!h.Data)throw new Error("UnixFS file node has no metadata.");const p=lt.unmarshal(h.Data),g=ui.decode(d).
data?.fileSize;if(!["file","raw"].includes(p.type)||h.Links.length!==p.blockSizes.length||Number(p.fileSize())!==u.size||
g!==void 0&&g!==BigInt(u.size))throw new Error("UnixFS file metadata is inconsistent.");const y=p.data||new Uint8Array;let m=u.
start+y.length;const f=[];for(let b=0;b<h.Links.length;b++){const w=Number(p.blockSizes[b]);if(!Number.isSafeInteger(w)||
w<0)throw new RangeError("Invalid UnixFS child size.");const k=ye(h.Links[b].Hash),x=h.Links[b].Tsize;if(x!==void 0&&(!Number.
isSafeInteger(x)||x<w||k.code===85&&x!==w))throw new Error("Invalid UnixFS link DAG size.");if(m<o&&m+w>n&&f.push({cid:k,
start:m,size:w,depth:u.depth+1}),m+=w,!Number.isSafeInteger(m))throw new RangeError("Invalid UnixFS file extent.")}if(m!==
u.start+u.size)throw new Error("UnixFS child sizes differ from their parent.");if(a.length+f.length>this.maximumTraversalBlocks)
throw new RangeError("UnixFS pending traversal exceeds limit.");for(let b=f.length-1;b>=0;b--)a.push(f[b]);if(y.length&&
u.start<o&&u.start+y.length>n){const b=y.subarray(Math.max(0,n-u.start),Math.min(y.length,o-u.start));l+=b.length,yield b}}
if(l!==s)throw new Error("UnixFS read did not produce the requested number of bytes.")}async _recordVerifiedFile(e,t){const n=await this.
_verifyFile(e.cid,e,t);return this._writeRoot(e.cid,s=>({...s,cid:e.cid,kind:"file",...n,status:"complete",pinned:!!s?.pinned,
retain:!1}),t)}async*_walk(e,{signal:t,fetchBlock:n,allowMissing:s=!1}={}){const i=e.map(a=>ye(a)),o=new Set;for(;i.length;){
pe(t);const a=i.pop(),c=a.toString();if(o.has(c))continue;if(o.size>=this.maximumTraversalBlocks)throw new RangeError("A\
rtifact DAG traversal exceeds block limit.");o.add(c);let l;try{l=await this._readBlock(a,t)}catch(u){if(u.code!=="ERR_N\
OT_FOUND")throw u;if(n)await this._putBlock(a,await ua(n(a,{signal:t}),t),t),l=await this._readBlock(a,t);else{if(s)continue;
throw u}}if(yield c,a.code===vi){const u=ci(l).Links;if(i.length+u.length>this.maximumTraversalBlocks)throw new RangeError(
"Artifact DAG links exceed limit.");for(const d of u)i.push(ye(d.Hash))}}}async ensureLocal(e,{signal:t,fetchBlock:n,pin:s=!0,
kind:i}={}){const o=ye(e).toString();return this._run(t,async a=>{await this._writeRoot(o,d=>({...d,cid:o,kind:i||d?.kind||
"file",status:"partial",pinned:!!d?.pinned,retain:!0}),a);for await(const d of this._walk([o],{signal:a,fetchBlock:n}));
let c;const l=ye(o).code===85?await this._readBlock(o,a):null;if(l&&l.byteLength<=un){let d;try{d=JSON.parse(new TextDecoder().
decode(l))}catch{}(d?.schema===ny||i==="manifest")&&(c=ru(l,{maximumFileBytes:this.maximumFileBytes}))}if(i==="manifest"&&
!c)throw new TypeError("Manifest must be a bounded canonical JSON raw block.");if(c){await this._writeRoot(o,d=>({...d,kind:"\
manifest",manifest:c,retain:!0}),a);for(const d of c.files){for await(const h of this._walk([d.cid],{signal:a,fetchBlock:n}))
;await this._recordVerifiedFile(d,a)}}const u=c?{size:l.byteLength,manifest:c}:await this._verifyFile(o,{},a);return this.
_writeRoot(o,d=>({cid:o,kind:c?"manifest":"file",...u,status:"complete",pinned:!!(s||d?.pinned),retain:!1}),a)})}async stat(e,{
signal:t,[_s]:n}={}){const s=ye(e).toString();return this._run(t,()=>this.backend.get("roots",s),void 0,n)}async getManifest(e,{
signal:t,[_s]:n}={}){const s=ye(e).toString();return this._run(t,async i=>ru(await this._readBlock(s,i),{maximumFileBytes:this.
maximumFileBytes}),void 0,n)}async*openRead(e,{offset:t=0,length:n,signal:s}={}){rt(t,"offset",0),n!==void 0&&rt(n,"leng\
th",0);const i=await this._begin(s);try{const o=await ep(ye(e).toString(),this._localBlocks(i.signal));if(!["file","raw"].
includes(o.type))throw new TypeError("Artifact root must identify a file.");const a=Number(o.type==="raw"?o.node.byteLength:
o.unixfs.fileSize());if(a>this.maximumFileBytes||t>a||n!==void 0&&n>a-t)throw new RangeError("Artifact range exceeds fil\
e size.");if(n===0||t===a)return;for await(const c of this._fileChunks(e,{size:a,offset:t,length:n,signal:i.signal}))pe(
i.signal),i.pause(),yield c,i.resume()}finally{i.finish()}}async pin(e,{signal:t}={}){return this.ensureLocal(e,{signal:t,
pin:!0})}async unpin(e,{signal:t}={}){const n=ye(e).toString();return this._run(t,s=>this._writeRoot(n,i=>{if(!i)throw qc(
n);return{...i,pinned:!1,retain:!1}},s))}async withRetention(e,{signal:t}={}){if(typeof e!="function")throw new TypeError(
"Artifact retention requires a callback.");const n=await this._begin(t),s={store:this,signal:n.signal,held:!0,accepting:!0},
i=new Set,o={};for(const a of["stat","getManifest","importFile","importManifest"])o[a]=(c,l={})=>{if(!s.accepting)return Promise.
reject(new Error("Artifact retention scope is no longer active."));if(i.size>=32)return Promise.reject(new Error("Artifa\
ct retention operation queue is full."));const u=this[a](c,{...l,[_s]:s});return i.add(u),u.finally(()=>i.delete(u)).catch(
()=>{}),u};o.getStats=()=>this.getStats(),Object.freeze(o);try{const a=await ua(Promise.resolve().then(()=>(pe(n.signal),
e(o))),n.signal);return s.accepting=!1,await Promise.all([...i]),pe(n.signal),a}finally{s.accepting=!1,await Promise.allSettled(
[...i]),s.held=!1,n.finish()}}async acquireUse(e,{signal:t}={}){const n=ye(e).toString(),s=await this._begin(t,"none");let i;
try{i=await Gi(`${this.lockName}:use:${n}`,"shared",s.signal,this.lockManager);const o=await this.stat(n,{signal:s.signal});
if(o?.status!=="complete"||!o.pinned&&!o.retain)throw new Error("Artifact use requires a complete retained root.");pe(s.
signal);let a=!1;const c=()=>{a||(a=!0,this.controller.signal.removeEventListener("abort",c),i(),s.finish())};return this.
controller.signal.addEventListener("abort",c,{once:!0}),this.controller.signal.aborted&&(c(),pe(this.controller.signal)),
c}catch(o){throw i?.(),s.finish(),o}}async*_entries(e,t=!1){let n;for(;;){const s=await this.backend.scan(e,{after:n,limit:16,
keysOnly:t});if(!s.length)return;for(const i of s)yield i;n=s.at(-1).key}}async*list({signal:e}={}){const t=await this._begin(
e);try{for await(const n of this._entries("roots"))pe(t.signal),t.pause(),yield n.value,t.resume()}finally{t.finish()}}async*listBlockCids(e,{
signal:t}={}){const n=ye(e).toString(),s=await this._begin(t);try{const i=await this.backend.get("roots",n);if(i?.status!==
"complete")throw new Error("Artifact serving requires a complete local root.");const o=[n,...(i.manifest?.files||[]).map(
a=>a.cid)];for await(const a of this._walk(o,{signal:s.signal}))s.pause(),yield a,s.resume()}finally{s.finish()}}async _collectGarbage(e,t){
const n=await this.backend.getUsage("blocks"),s=n.generation||0,i=new Set;for await(const{value:l}of this._entries("root\
s")){if(l.cid===t||!l.pinned&&!l.retain)continue;const u=[l.cid,...(l.manifest?.files||[]).map(d=>d.cid)];for await(const d of this.
_walk(u,{signal:e,allowMissing:l.status!=="complete"}))if(i.add(d),i.size>n.entries)throw new RangeError("Artifact GC ex\
ceeds the stored block collection.")}const o=t?await this.backend.get("roots",t):null,a=!!(t&&i.has(t));if(o)if(a){const l=o.
kind==="manifest"?{cid:t,kind:"file",size:o.size,sha256:zc(ye(t).multihash.digest),status:o.status,pinned:!1,retain:!1}:
{...o,pinned:!1,retain:!1};await this._writeRoot(t,()=>l,e)}else{const l={...o,pinned:!1,status:"deleting"};delete l.retain,
delete l.profile,await this._writeRoot(t,()=>l,e)}let c=0;for await(const{key:l,generation:u}of this._entries("blocks",!0))
pe(e),u<=s&&!i.has(l)&&await this.backend.delete("blocks",l)&&c++;for await(const{key:l,value:u}of this._entries("roots"))
!u.pinned&&!u.retain&&!i.has(l)&&await this.backend.delete("roots",l);return this.usage=await this.backend.getUsage("blo\
cks"),this.rootUsage=await this.backend.getUsage("roots"),{deletedBlocks:c,freedBytes:n.bytes-this.usage.bytes,storedBytes:this.
usage.bytes,blockCount:this.usage.entries,...t?{cid:t,removed:!!o,retainedByOtherRoot:a}:{}}}async gc({signal:e}={}){return this.
_run(e,t=>this._collectGarbage(t),"exclusive")}async remove(e,{signal:t,useWaitMs:n=1e3}={}){const s=ye(e).toString();if(rt(
n,"useWaitMs"),n>3e4)throw new RangeError("Artifact use wait exceeds limit.");await this.open();const i=new AbortController,
o=setTimeout(()=>i.abort(Object.assign(new Error("This model is in use in another session. Unload it before deleting."),
{code:"ERR_ARTIFACT_IN_USE"})),n);o.unref?.();let a;try{a=await Gi(`${this.lockName}:use:${s}`,"exclusive",AbortSignal.any(
[i.signal,this.controller.signal,...t?[t]:[]]),this.lockManager)}finally{clearTimeout(o)}try{return await this._run(t,async c=>{
try{return await this._collectGarbage(c,s)}finally{this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.
backend.getUsage("roots")}},"exclusive")}finally{a()}}getStats(){return Object.freeze({name:this.name,isOpen:this.isOpen,
persistent:this.persistent,storedBytes:this.usage.bytes,blockCount:this.usage.entries,rootCount:this.rootUsage.entries,maximumBytes:this.
maximumBytes,maximumStoredBlocks:this.maximumStoredBlocks,capacity:this.capacity,pending:this.operations.size})}getBlockstore(){
return this.blockstore}getDatastore(){return this.datastore}_createBlockstore(){const e=this,t={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},async*get(n,{signal:s}={}){const i=await e._begin(s,"none");try{const o=await e._readBlock(
n,i.signal);i.pause(),yield o,i.resume()}finally{i.finish()}},put:(n,s,{signal:i}={})=>e._run(i,o=>e._putBlock(n,s,o),"n\
one"),has:(n,{signal:s}={})=>e._run(s,async()=>await e.backend.get("blocks",ye(n).toString())!==void 0,"none"),delete:async()=>{
throw new Error("Artifact blocks can only be removed through StateManager garbage collection.")},async*getAll({signal:n}={}){
const s=await e._begin(n);try{for await(const{key:i}of e._entries("blocks",!0))pe(s.signal),s.pause(),yield{cid:ye(i),bytes:t.
get(i,{signal:s.signal})},s.resume()}finally{s.finish()}}};return t.putMany=async function*(n,s){for await(const{cid:i,bytes:o}of n)
yield await t.put(i,o,s)},t.getMany=async function*(n,s){for await(const i of n)yield{cid:i,bytes:t.get(i,s)}},t.deleteMany=
async function*(){throw new Error("Use ArtifactStore.gc() to remove blocks.")},t}_createDatastore(){const e=this,t=s=>{const i=s.
toString();if(i.length>2048)throw new RangeError("Datastore key exceeds limit.");return i},n={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},get:(s,{signal:i}={})=>e._run(i,async()=>{const o=await e.backend.get("routing",t(s));
if(o===void 0)throw qc(s);return o},"none"),has:(s,{signal:i}={})=>e._run(i,async()=>await e.backend.get("routing",t(s))!==
void 0,"none"),put:(s,i,{signal:o}={})=>e._run(o,async a=>{if(pe(a),!(i instanceof Uint8Array)||i.byteLength>un)throw new RangeError(
"Datastore value exceeds limit.");return await e.backend.put("routing",t(s),i,{maximumBytes:e.maximumRoutingBytes,maximumEntries:4096}),
s},"none"),delete:(s,{signal:i}={})=>e._run(i,async()=>{await e.backend.delete("routing",t(s))},"none"),query:(s={},i={})=>e.
_queryDatastore(s,i,!1),queryKeys:(s={},i={})=>e._queryDatastore(s,i,!0),batch:()=>{const s=[];let i=0;const o=(a,c)=>{if(s.
length>=4096||(i+=c?.byteLength||0)>e.maximumRoutingBytes)throw new RangeError("Datastore batch exceeds limit.");s.push(
{key:a,value:c?.slice()})};return{put:(a,c)=>o(a,c),delete:a=>o(a),commit:async a=>{for(const{key:c,value:l}of s)l===void 0?
await n.delete(c,a):await n.put(c,l,a);s.length=0}}}};return n.putMany=async function*(s,i){for await(const o of s)await n.
put(o.key,o.value,i),yield o},n.getMany=async function*(s,i){for await(const o of s)yield{key:o,value:await n.get(o,i)}},
n.deleteMany=async function*(s,i){for await(const o of s)await n.delete(o,i),yield o},n}async*_queryDatastore(e,{signal:t}={},n){
const s=await this._begin(t,"none");try{const i=[];let o=0,a=0;const c=rt(e.offset??0,"query offset",0),l=rt(e.limit??4096,
"query limit",0);for await(const u of this._entries("routing",n)){if(pe(s.signal),e.prefix&&!u.key.startsWith(e.prefix))
continue;const d=new pt(u.key),h=n?d:{key:d,value:u.value};if(!e.filters?.some(p=>!p(h))&&(e.orders?.length?i.push(h):o++>=
c&&a<l&&(a++,s.pause(),yield h,s.resume()),!e.orders?.length&&a>=l))return}if(e.orders?.length){i.sort((u,d)=>{for(const h of e.
orders){const p=h(u,d);if(p)return p}return 0});for(const u of i.slice(c,c+l))s.pause(),yield u,s.resume()}}finally{s.finish()}}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.controller.abort(new DOMException("Artifact store destroy\
ed.","AbortError")),this.destroying=(async()=>{try{await this.opening?.catch(()=>{}),await Promise.allSettled([...this.operations].
map(e=>e.settled)),this.ownsBackend&&await this.backend.close()}finally{this.isOpen=!1,this.onDestroy?.(this)}})(),this.
destroying)}}const z5="peercompute.state.task-graph-cache-artifact-admission.v0",q5="peercompute.state.task-graph-cache-\
artifact-invalidation.v0",Mn="taskGraphCacheArtifactAdmissions",j5="taskGraphCacheArtifactInvalidations";function op(r,e=[]){
return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r=="string"?r.split(",").map(t=>t.trim()).
filter(Boolean):[...e]}function Is(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}class G5{constructor(e,t={}){this.networkManager=e,this.libp2pNode=e?e.getLibp2pNode():
null,this.config={docName:t.docName||"peercompute-state",topic:t.topic||"peercompute-state-sync",enablePersistence:t.enablePersistence!==
!1,disableNetworkProvider:t.disableNetworkProvider||!1,disableBroadcast:t.disableBroadcast||!1,broadcastNamespaces:Array.
isArray(t.broadcastNamespaces)?t.broadcastNamespaces:null,...t},this.ydoc=new is,this.state=this.ydoc.getMap("state"),this.
dataState=new uk({ydoc:this.ydoc,stateMap:this.state,hotStore:t.hotStore,deltaNamespace:t.deltaNamespace||"deltas"}),this.
indexeddbProvider=null,this.libp2pProvider=null,this.subscribers=new Map,this.globalSubscribers=new Set,this.isInitialized=
!1,this.persistenceFailed=!1}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new yr,this.state.set(e,t)),t}applyRemoteUpdate(e){
try{const t=(()=>{if(e instanceof Uint8Array)return e;if(Array.isArray(e))return new Uint8Array(e);if(e&&typeof e=="obje\
ct"){const s=Object.values(e);return new Uint8Array(s)}return new Uint8Array(0)})();if(t.byteLength===0){console.warn("[\
StateManager] Remote update was empty, skipping");return}const n=t;Co(this.ydoc,n,this)}catch(t){console.error("[StateMa\
nager] Failed to apply remote update:",t)}}applyStateSet(e,t,n){try{this.ydoc.transact(()=>{if(n){const s=this._getNamespaceMap(
n);t===void 0?s.delete(e):s.set(e,t)}else t===void 0?this.state.delete(e):this.state.set(e,t)},"remote-state-set")}catch(s){
console.error("[StateManager] Failed to apply state-set:",s)}}commitDelta(e){if(!this.isInitialized)throw new Error("Sta\
teManager not initialized");this.dataState.commitDelta(e)}getDataState(){return this.dataState}createLocalArtifactCache(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const t=new yk({...e,onDestroy:n=>{this.dataState.unregisterLocalArtifactCache(
n.name,n)}});try{return this.dataState.registerLocalArtifactCache(t.name,t)}catch(n){throw t.destroy(),n}}getLocalArtifactCache(e){
return this.dataState.getLocalArtifactCache(e)}createArtifactStore(e={}){if(this.destroyed)throw new Error("StateManager\
 is destroyed");const t=e.name||"default";if(this.getArtifactStore(t))throw new Error(`Artifact store ${t} is already re\
gistered`);const n=new O5({...e,name:t,onDestroy:s=>{this.dataState.unregisterArtifactStore(s),e.onDestroy?.(s)}});return this.
dataState.registerArtifactStore(n)}getArtifactStore(e="default"){return this.dataState.getArtifactStore(e)}async ensureArtifact(e,{
storeName:t="default",signal:n}={}){if(this.destroyed)throw new Error("StateManager is destroyed");const s=this.getArtifactStore(
t);if(!s)throw new Error(`Artifact store ${t} is not configured`);return s.ensureLocal(e,{signal:n,fetchBlock:(i,o={})=>{
if(!this.networkManager?.fetchArtifactBlock)throw new Error("Artifact networking is not configured");return this.networkManager.
fetchArtifactBlock(i,{...o,artifactCid:e})}})}async publishArtifact(e){if(this.destroyed)throw new Error("StateManager i\
s destroyed");if(!this.networkManager?.announceArtifact)throw new Error("Artifact networking is not configured");return this.
networkManager.announceArtifact(e)}async unpublishArtifact(e,{storeName:t="default",unpin:n=!1}={}){if(this.destroyed)throw new Error(
"StateManager is destroyed");if(!this.networkManager?.withdrawArtifact)throw new Error("Artifact networking is not confi\
gured");await this.networkManager.withdrawArtifact(e),n&&await this.getArtifactStore(t)?.unpin(e)}getWarmDeltas(e){return this.
dataState.getWarmDeltas(e)}setHotBuffer(e,t){this.dataState.setHotBuffer(e,t)}getHotBuffer(e){return this.dataState.getHotBuffer(
e)}admitTaskGraphCacheArtifact(e={},t={}){if(!this.isInitialized)throw new Error("StateManager not initialized");if(!e||
typeof e!="object")throw new Error("admitTaskGraphCacheArtifact requires an artifact object");const n=String(t.cacheKey||
e.cacheKey||"").trim();if(!n)throw new Error("admitTaskGraphCacheArtifact requires artifact.cacheKey");const s=Number.isFinite(
t.admittedAt)?t.admittedAt:Date.now(),i=op(t.invalidationRefs??e.invalidationRefs??e.admission?.invalidationRefs,[]),o={
schema:z5,admissionId:String(t.admissionId||e.admission?.admissionId||`task-graph-cache-admission:${n}:${s}`),cacheKey:n,
artifactId:e.artifactId||`${n}:artifact`,artifactSchema:e.schema||null,artifactStatus:e.status||null,cacheScope:e.cacheScope||
t.cacheScope||null,cacheKeySource:e.cacheKeySource||t.cacheKeySource||null,inputHash:e.inputHash||t.inputHash||null,resultHash:e.
resultHash||t.resultHash||null,status:t.status||"admitted",admitted:!0,authority:t.authority||"state-manager",validatorId:t.
validatorId||e.admission?.validatorId||null,reason:t.reason||"state-manager-cache-artifact-admission",invalidationRefs:i,
admittedAt:s,acceptedAt:s,expiresAt:t.expiresAt??e.expiresAt??null,sourceNodeId:t.sourceNodeId||this.state.get("nodeId")||
null,artifact:Is(e)};return this.writeScoped(Mn,n,o),Is(o)}invalidateTaskGraphCacheArtifact(e,t={}){if(!this.isInitialized)
throw new Error("StateManager not initialized");const n=e&&typeof e=="object"?e:null,s=String(t.cacheKey||n?.cacheKey||e||
"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires a cacheKey");const i=this.readScoped(Mn,s),o=Number.
isFinite(t.invalidatedAt)?t.invalidatedAt:Date.now(),a=op(t.invalidationRefs??n?.invalidationRefs??i?.invalidationRefs,[]),
c={schema:q5,invalidationId:String(t.invalidationId||`task-graph-cache-invalidation:${s}:${o}`),cacheKey:s,artifactId:n?.
artifactId||i?.artifactId||`${s}:artifact`,status:"invalidated",authority:t.authority||"state-manager",reason:t.reason||
"state-manager-cache-artifact-invalidated",invalidationRefs:a,previousAdmissionStatus:i?.status||null,invalidatedAt:o,sourceNodeId:t.
sourceNodeId||this.state.get("nodeId")||null};return this.writeScoped(j5,c.invalidationId,c),i&&this.writeScoped(Mn,s,{...i,
status:"invalidated",admitted:!1,invalidatedAt:o,invalidation:c}),Is(c)}getTaskGraphCacheArtifactAdmission(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");const t=String(e||"").trim();if(!t)return null;const n=this.readScoped(Mn,
t);return n?Is(n):null}listTaskGraphCacheArtifactAdmissions(e={}){if(!this.isInitialized)throw new Error("StateManager n\
ot initialized");const t=e.includeInvalidated!==!1;return this.listNamespaceKeys(Mn).map(n=>this.readScoped(Mn,n)).filter(
n=>n&&(t||n.admitted===!0)).map(n=>Is(n)).sort((n,s)=>String(n.cacheKey||"").localeCompare(String(s.cacheKey||"")))}async initialize(e={}){
if(this.isInitialized){console.warn("[StateManager] Already initialized");return}try{if(this.config.enablePersistence&&(this.
indexeddbProvider=new ck(this.config.docName,this.ydoc),await new Promise(t=>{this.indexeddbProvider.once("synced",t)}),
console.log("[StateManager] IndexedDB persistence loaded")),this.networkManager&&!this.config.disableNetworkProvider)try{
this.libp2pProvider=new lk(this.networkManager,this.ydoc,{topic:this.config.topic}),console.log("[StateManager] PeerComp\
ute P2P synchronization enabled")}catch(t){console.error("[StateManager] Failed to enable P2P sync:",t)}Object.keys(e).length>
0&&this.ydoc.transact(()=>{for(const[t,n]of Object.entries(e))this.state.set(t,n)}),this._setupObservers(),this.isInitialized=
!0,console.log("[StateManager] Initialized")}catch(t){throw console.error("[StateManager] Initialization failed:",t),t}}_setupObservers(){
this.state.observe(e=>{e.keysChanged.forEach(t=>{const n=this.state.get(t),s=this.subscribers.get(t);s&&s.forEach(i=>{try{
i(n,t)}catch(o){console.error("[StateManager] Subscriber error:",o)}}),this.globalSubscribers.forEach(i=>{try{i(n,t)}catch(o){
console.error("[StateManager] Global subscriber error:",o)}})})},{captureTransactions:!1})}_setupFallbackSync(){this.libp2pNode&&
console.log("[StateManager] Using fallback P2P sync via NetworkManager")}read(e){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return this.state.get(e)}write(e,t){if(!this.isInitialized)throw new Error("StateManager\
 not initialized");this._safeSetMap(this.state,e,t),this.networkManager?.broadcast&&!this.config.disableBroadcast&&this.
networkManager.broadcast({type:"state-set",data:{key:e,value:t}}).catch(()=>{})}writeScoped(e,t,n){const s=this._getNamespaceMap(
e);this._safeSetMap(s,t,n),this.networkManager?.broadcast&&!this.config.disableBroadcast&&(!this.config.broadcastNamespaces||
this.config.broadcastNamespaces.includes(e))&&this.networkManager.broadcast({type:"state-set",data:{namespace:e,key:t,value:n}}).
catch(()=>{})}readScoped(e,t){const n=this.state.get(e);if(n)return n.get(t)}hasScoped(e,t){const n=this.state.get(e);return n?
n.has(t):!1}listNamespaceKeys(e){const t=this.state.get(e);return t?Array.from(t.keys()):[]}clearNamespace(e){const t=this.
state.get(e);if(!t)return;const n=Array.from(t.keys());this.ydoc.transact(()=>{n.forEach(s=>t.delete(s))}),this.networkManager?.
broadcast&&!this.config.disableBroadcast&&n.forEach(s=>{this.networkManager.broadcast({type:"state-set",data:{namespace:e,
key:s,value:void 0}}).catch(()=>{})})}deleteScoped(e,t){const n=this.state.get(e);n&&(n.delete(t),this.networkManager?.broadcast&&
!this.config.disableBroadcast&&this.networkManager.broadcast({type:"state-set",data:{namespace:e,key:t,value:void 0}}).catch(
()=>{}))}delete(e){if(!this.isInitialized)throw new Error("StateManager not initialized");this.state.delete(e)}has(e){if(!this.
isInitialized)throw new Error("StateManager not initialized");return this.state.has(e)}_safeSetMap(e,t,n){if(this.persistenceFailed){
e.set(t,n);return}try{e.set(t,n)}catch(s){if(s?.name==="InvalidStateError")console.warn("[StateManager] Persistence unav\
ailable, disabling IndexedDB provider",s),this.indexeddbProvider?.destroy?.(),this.indexeddbProvider=null,this.persistenceFailed=
!0,e.set(t,n);else throw s}}batchWrite(e){if(!this.isInitialized)throw new Error("StateManager not initialized");this.ydoc.
transact(()=>{for(const[t,n]of Object.entries(e))this.state.set(t,n)})}subscribe(e,t){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return e==="*"?(this.globalSubscribers.add(t),()=>{this.globalSubscribers.delete(t)}):(this.
subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{const n=this.subscribers.get(e);
n&&(n.delete(t),n.size===0&&this.subscribers.delete(e))})}observeNamespace(e,t){let n=this._getNamespaceMap(e),s=new Set(
n.keys()),i=null,o=!0;const a=()=>{const d=this.state.get(e);return d instanceof yr?d:null};let c;const l=(d,h=null)=>{if(!o||
d===n)return;const p=s,g=d?Array.from(d.entries()):[],y=new Set(g.map(([m])=>m));n?.unobserve(c),n=d,s=y,i=h,n?.observe(
c);for(const m of p)if(!y.has(m)){if(!o||a()!==n)return;t(void 0,m)}for(const[m,f]of g){if(!o||a()!==n)return;t(f,m)}};c=
(d,h)=>{if(!o||d.target!==n)return;const p=a();if(p!==n){l(p,h);return}h!==i&&d.keysChanged.forEach(g=>{!o||d.target!==n||
a()!==n||(n.has(g)?s.add(g):s.delete(g),t(n.get(g),g))})};const u=(d,h)=>{!o||!d.keysChanged.has(e)||l(a(),h)};return n.
observe(c),this.state.observe(u),()=>{o&&(o=!1,n?.unobserve(c),this.state.unobserve(u))}}keys(){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return Array.from(this.state.keys())}values(){if(!this.isInitialized)throw new Error("St\
ateManager not initialized");return Array.from(this.state.values())}entries(){if(!this.isInitialized)throw new Error("St\
ateManager not initialized");return Array.from(this.state.entries())}async synchronize(e){console.log("[StateManager] Sy\
nchronization is automatic with Yjs CRDT")}snapshot(){if(!this.isInitialized)throw new Error("StateManager not initializ\
ed");return{data:Object.fromEntries(this.state.entries()),timestamp:Date.now(),version:this.ydoc.clientID,keyCount:this.
state.size}}getYDoc(){return this.ydoc}getYMap(){return this.state}getAwareness(){return this.libp2pProvider?.awareness||
null}async requestProviderSync(){return this.libp2pProvider?.requestSync?(await this.libp2pProvider.requestSync(),!0):!1}clear(){
if(!this.isInitialized)throw new Error("StateManager not initialized");this.ydoc.transact(()=>{this.state.clear()})}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.destroying=(async()=>{const e=[],t=async n=>{try{await n()}catch(s){
e.push(s)}};if(await t(()=>this.dataState.destroyArtifactStores()),await t(()=>this.dataState.destroyLocalArtifactCaches()),
this.libp2pProvider&&(await t(()=>this.libp2pProvider.destroy()),this.libp2pProvider=null),this.indexeddbProvider&&(await t(
()=>this.indexeddbProvider.destroy()),this.indexeddbProvider=null),this.subscribers.clear(),this.globalSubscribers.clear(),
await t(()=>this.ydoc.destroy()),this.isInitialized=!1,console.log("[StateManager] Destroyed"),e.length)throw new AggregateError(
e,"StateManager cleanup failed")})(),this.destroying)}async clearPersistence(){if(this.indexeddbProvider?.clearData)try{
await this.indexeddbProvider.clearData(),console.log("[StateManager] IndexedDB persistence cleared")}catch(e){console.error(
"[StateManager] Failed to clear IndexedDB persistence",e)}}async clearAllPersistenceByPrefix(e,t=[]){if(typeof indexedDB?.
databases=="function")try{const n=await indexedDB.databases();for(const s of n||[])s?.name&&s.name.startsWith(e)&&!t.includes(
s.name)&&await new Promise((i,o)=>{const a=indexedDB.deleteDatabase(s.name);a.onsuccess=()=>i(),a.onerror=()=>o(a.error),
a.onblocked=()=>i()});console.log(`[StateManager] Cleared IndexedDB databases with prefix ${e}`)}catch(n){console.warn("\
[StateManager] Failed to enumerate/delete IndexedDB databases",n)}}getDocName(){return this.config.docName}getStats(){const e=this.
dataState.getLocalArtifactCacheStats(),t=this.dataState.getArtifactStoreStats();return{isInitialized:this.isInitialized,
keyCount:this.state.size,subscriberCount:this.subscribers.size,globalSubscriberCount:this.globalSubscribers.size,hasPersistence:!!this.
indexeddbProvider,hasP2PSync:!!this.libp2pProvider,docName:this.config.docName,topic:this.config.topic,hotBufferCount:this.
dataState?.listHotBuffers?.().length||0,localArtifactCacheCount:e.caches,localArtifactCacheEntryCount:e.entries,localArtifactCacheResidentBytes:e.
residentBytes,localArtifactCachePendingCount:e.pending,artifactStoreCount:t.stores,artifactStoredBytes:t.storedBytes,artifactPendingCount:t.
pending}}}const jc=new Map,Gc=new Map,W5={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array};function iy(r="Uint8Array"){const e=W5[r];if(!e)throw new Error(
`Unsupported typed array view: ${r}`);return e}function V5(r){return new r.constructor(r)}function oy(r){return ArrayBuffer.
isView(r)&&!(r instanceof DataView)}function H5(r){return r instanceof ArrayBuffer?new Uint8Array(r):oy(r)?new Uint8Array(
r.buffer,r.byteOffset,r.byteLength):Array.isArray(r)?Uint8Array.from(r):null}async function yd(r){const e=String(r);return jc.
has(e)||jc.set(e,kt(()=>import(`${e}`),[],import.meta.url)),jc.get(e)}async function ap(r){const e=H5(r);if(e)
return e;if(typeof r=="string"||r instanceof URL){const t=await fetch(String(r));if(!t.ok)throw new Error(`Failed to fet\
ch wasm module: ${t.status} ${t.statusText}`);const n=await t.arrayBuffer();return new Uint8Array(n)}throw new Error("wa\
sm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function K5(r){if(typeof r=="string"||
r instanceof URL){const t=String(r);return Gc.has(t)||Gc.set(t,(async()=>{const n=await ap(r);return WebAssembly.compile(
n)})()),Gc.get(t)}const e=await ap(r);return WebAssembly.compile(e)}async function Q5(r,e){if(r.importsModule){const t=await yd(
r.importsModule),n=r.importsExport||"default",s=t[n];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="obje\
ct")return s;throw new Error(`WASM imports export "${n}" must be a function or object`)}return r.imports&&typeof r.imports==
"object"?r.imports:{}}function ay(r,e,t={}){const n=t.exportName||e.memoryExport||"memory",s=r.exports?.[n];if(!(s instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return s}function J5(r,e){if(Object.prototype.
hasOwnProperty.call(r,"values"))return r.values;const t=r.dataKey||r.name;if(t&&e&&Object.prototype.hasOwnProperty.call(
e,t))return e[t]}function X5(r,e){if(r==null)return null;if(r instanceof e)return r;if(oy(r))return new e(r.buffer,r.byteOffset,
Math.floor(r.byteLength/e.BYTES_PER_ELEMENT));if(r instanceof ArrayBuffer)return new e(r);if(Array.isArray(r))return e.from(
r);throw new Error(`Unsupported memory input for ${e.name}`)}function cp(r,e,t){(Array.isArray(e.inputViews)?e.inputViews:
[]).forEach(s=>{const i=iy(s.view),o=X5(J5(s,t),i);if(!o)return;const a=ay(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0;new i(a.buffer,c,o.length).set(o)})}function Y5(r,e){const t=Array.isArray(e.outputViews)?e.outputViews:[];if(t.length===
0)return null;const n={};return t.forEach((s,i)=>{const o=iy(s.view),a=ay(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0,l=Number.isFinite(s.length)?s.length:0;if(l<=0)throw new Error(`WASM output view "${s.name||i}" must provide a positiv\
e length`);const u=s.name||`output${i}`;n[u]=V5(new o(a.buffer,c,l))}),n}function cy(r,e){return Array.isArray(e.args)?e.
args:Array.isArray(r.args)?r.args:Array.isArray(r.data?.args)?r.data.args:[]}function Z5(r={}){const e=globalThis.navigator?.
gpu??null;if(r.webgpu?.required===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!e,gpu:e,async requestAdapter(n=r.webgpu?.adapterOptions){return e?e.requestAdapter(n):null},async requestDevice(n={}){
if(!e)return null;const s=n.adapter||await e.requestAdapter(n.adapterOptions||r.webgpu?.adapterOptions);return s?s.requestDevice(
n.deviceDescriptor||r.webgpu?.deviceDescriptor):null}}}async function ly(r){const e=r.wasm||{},t=e.source??r.wasmSource??
r.source;if(!t)throw new Error("wasm tasks require wasm.source");const n=await K5(t),s=await Q5(e,{task:r,data:r.data??null,
WebAssembly}),i=await WebAssembly.instantiate(n,s);return cp(i,e,r.data??null),{module:n,instance:i,exports:i.exports,imports:s,
task:r,data:r.data??null,callExport(o,a=[]){const c=i.exports?.[o];if(typeof c!="function")throw new Error(`WASM export \
"${o}" was not found`);return c(...a)},readOutputViews(){return Y5(i,e)},writeInputViews(o){cp(i,e,o)}}}async function e4(r,e,t){
const n=r.wasm||{};if(!n.resultModule)return t.value;const s=await yd(n.resultModule),i=n.resultExport||"default",o=s[i];
if(typeof o!="function")throw new Error(`WASM result export "${i}" must be a function`);const a=await o({...t,wasm:e,task:r,
data:r.data??null});return typeof a>"u"?t:a}async function t4(r){const e=await ly(r),t=r.wasm||{},n=cy(r,t),s=t.entry?await e.
callExport(t.entry,n):void 0,i=e.readOutputViews();return e4(r,e,{returnValue:s,outputs:i,value:i?typeof s>"u"?i:{returnValue:s,
outputs:i}:s})}async function r4(r){const e=await ly(r),t=r.hostModule||r.module;if(!t)throw new Error("wasm-webgpu task\
s require hostModule or module");r.wasm?.callEntryBeforeHost&&r.wasm.entry&&(e.entryResult=await e.callExport(r.wasm.entry,
cy(r,r.wasm)));const n=await yd(t),s=r.hostExport||r.exportName||"default",i=n[s];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return i({task:r,data:r.data??null,wasm:e,webgpu:Z5(r)})}async function n4(r){
if(typeof r!="string"||!r.trim())throw new Error("module path must be a non-empty string");return r==="peercompute:model\
-inference"?kt(()=>Promise.resolve().then(()=>sR),void 0,import.meta.url):r==="peercompute:gguf-inference"?kt(
()=>import("./modelTask-DCHUNVb2.js"),__vite__mapDeps([0,1,2,3]),import.meta.url):r==="peercompute:diffusion-inference"?kt(()=>import("./modelTask-CAEnClWW.js"),
__vite__mapDeps([4,3,1,5]),import.meta.url):kt(()=>import(`${r}`),[],import.meta.url)}function s4(r={}){return typeof r.
runtime=="string"&&r.runtime.trim()?r.runtime.trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"j\
s"}async function i4(r,e){let t;if(r.fn?t=new Function(`return (${r.fn});`)():r.module&&(t=(await n4(r.module))[r.exportName||
"default"]),typeof t!="function")throw new Error("Handler not found for task");return t(r.data,e)}async function o4(r,e={}){
const t=s4(r);switch(t){case"js":return i4(r,e);case"wasm":return t4(r);case"wasm-webgpu":return r4(r);default:throw new Error(
`Unsupported compute runtime: ${t}`)}}const a4="peercompute.compute.solver-descriptor.v0",c4="peercompute.compute.solver\
-task.v0";function da(r,e){const t=String(r||"").trim();if(!t)throw new Error(`${e} is required`);return t}function Vs(r){
return r==null?r:JSON.parse(JSON.stringify(r))}function l4(r){if(typeof r=="string")return{name:da(r,"field.name"),unit:null,
dimensions:null,location:null};if(!r||typeof r!="object")throw new Error("field must be a string or object");return{name:da(
r.name,"field.name"),unit:r.unit??null,dimensions:r.dimensions??null,location:r.location??null,role:r.role??null}}function Wc(r=[]){
if(!Array.isArray(r))throw new Error("fields must be an array");return r.map(l4)}function u4(r){return r.runtime?String(
r.runtime).trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"js"}function d4(r={}){if(!r||typeof r!=
"object")throw new Error("solver descriptor is required");const e=da(r.id,"solver.id"),t=da(r.kind||r.family,"solver.kin\
d"),n=u4(r),s=!!(r.module||r.fn||r.wasm||r.wasmSource||r.source);return{schema:a4,id:e,kind:t,version:r.version||"0.0.0",
label:r.label||e,description:r.description||"",runtime:n,module:r.module,exportName:r.exportName||"default",fn:r.fn,hostModule:r.
hostModule,hostExport:r.hostExport,wasm:r.wasm,wasmSource:r.wasmSource,source:r.source,webgpu:r.webgpu||null,inputFields:Wc(
r.inputFields||r.inputs||[]),outputFields:Wc(r.outputFields||r.outputs||[]),conservedFields:Wc(r.conservedFields||r.conserved||
[]),timestep:{mode:r.timestep?.mode||r.timestepMode||"explicit",maxDt:r.timestep?.maxDt??r.maxDt??null,subcycles:r.timestep?.
subcycles??r.subcycles??1},validity:Vs(r.validity||r.validityDomain||{}),affinity:{policy:r.affinity?.policy||r.affinityPolicy||
"state-key",keyFields:Array.isArray(r.affinity?.keyFields)?[...r.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{
scope:r.warmDelta?.scope||r.scope||"solver-deltas",schema:r.warmDelta?.schema||`peercompute.solver.${e}.delta.v0`},metadata:Vs(
r.metadata||{}),hasExecutor:s}}class h4{constructor(e=[]){this.solvers=new Map;for(const t of e)this.register(t)}register(e){
const t=d4(e);return this.solvers.set(t.id,t),t}unregister(e){return this.solvers.delete(e)}has(e){return this.solvers.has(
e)}get(e){const t=this.solvers.get(e);if(!t)throw new Error(`Solver not registered: ${e}`);return t}list(){return Array.
from(this.solvers.values()).map(e=>Vs(e))}createTask(e,{id:t,input:n={},stateKey:s=n.stateKey||n.taskId||e,affinityKey:i,
scope:o,version:a,timestamp:c,data:l={},placementHint:u,webgpu:d}={}){const h=this.get(e);if(!h.hasExecutor)throw new Error(
`Solver has no executable task target: ${e}`);const p=t||`${h.id}:${s}:${Date.now()}`,g=o||h.warmDelta.scope,y=u??l.placementHint??
null;return{id:p,solverId:h.id,taskFamily:h.id,runtime:h.runtime,module:h.module,exportName:h.exportName,fn:h.fn,hostModule:h.
hostModule,hostExport:h.hostExport,wasm:h.wasm,wasmSource:h.wasmSource,source:h.source,webgpu:d||h.webgpu||void 0,affinityKey:i||
`${h.id}:${s}`,placementHint:Vs(y),data:{schema:c4,solver:{id:h.id,kind:h.kind,version:h.version,inputFields:h.inputFields,
outputFields:h.outputFields,conservedFields:h.conservedFields,timestep:h.timestep,validity:h.validity,warmDelta:{scope:g,
schema:h.warmDelta.schema}},stateKey:s,scope:g,version:a??null,timestamp:c??Date.now(),input:n,...l,placementHint:Vs(y)}}}}
const f4="peercompute.compute.gpu-resident-lane-manager.v0",p4="peercompute.compute.gpu-resident-lane.v0",m4="peercomput\
e.compute.gpu-resident-lane-lease.v0",g4="peercompute.compute.gpu-resident-lane-lease-identity.v0",b4="peercompute.compu\
te.gpu-resident-lane-execution.v0",uy="peercompute.compute.gpu-resident-lane-copy-budget.v0",y4="peercompute.compute.gpu\
-fence-report.v0",w4="peercompute.compute.gpu-resident-lane-stage-plan.v0",k4="peercompute.compute.gpu-resident-lane-sta\
ge-execution.v0",E4="peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0",nu="queue.onSubmittedWorkDone-b\
efore-readback-map",dy="explicit-stage-dependencies",lp="sequential-stage-order",x4="defer-read-write-conflicting-ready-\
stages";function Wi(r,e=0){const t=Number(r);return Number.isFinite(t)?t:e}function oe(r,e=null){return String(r??"").trim()||
e}function Ie(r,e=[]){return Array.isArray(r)?r.map(t=>oe(t)).filter(Boolean):typeof r=="string"?r.split(",").map(t=>oe(
t)).filter(Boolean):[...e]}function he(r){return r==null?r:JSON.parse(JSON.stringify(r))}function up(r={}){const e=r?.residentSequenceLaneContract||
r?.residentLaneContract||r?.laneContract||r?.executionContract||null;return!e||typeof e!="object"?null:he(e)}function S4(r={},e=0){
const t=oe(r.id,`stage:${e}`);return{...he(r),id:t,index:e,lawNodeId:oe(r.lawNodeId,null),runtimeTarget:oe(r.runtimeTarget,
null),dependsOn:Ie(r.dependsOn??r.dependencies),inputFrom:oe(r.inputFrom??r.primaryInputFrom??r.inputStageId,null),reads:Ie(
r.reads??r.readFamilies),writes:Ie(r.writes??r.writeFamilies)}}function Vi(r=null,{laneId:e=null,stateKey:t=null,domainKey:n=null,
queueFencePolicy:s=null}={}){if(!r||typeof r!="object")return null;const i=Array.isArray(r.passDagStages)?r.passDagStages.
map((a,c)=>S4(a,c)):[],o=oe(r.stageDependencyMode??r.dependencyMode,i.some(a=>a.dependsOn.length>0)||r.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:w4,status:i.length>0?r.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:oe(r.laneId,e),stateKey:oe(r.stateKey,t),domainKey:oe(r.domainKey,n),queueFencePolicy:oe(r.
queueFencePolicy,s||nu),contractSchema:oe(r.schema,null),contractStatus:oe(r.status,null),sequenceMode:oe(r.sequenceMode,
null),sequenceRunnable:r.sequenceRunnable===!0,defaultEnabled:r.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o===
"explicit-stage-dependencies",stageCount:i.length,stages:i}}function v4(r={}){const e=r&&typeof r=="object"?r:{value:r};
return{value:Object.prototype.hasOwnProperty.call(e,"value")?e.value:r,retainedBufferRefs:Ie(e.retainedBufferRefs??e.gpuFence?.
retainedBufferRefs),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?he(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?he(e.summary):null}}function ha(r={}){const e=r.copyBudget&&typeof r.copyBudget=="object"?r.copyBudget:r;return{
schema:uy,uploadBytes:Math.max(0,Math.round(Wi(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
Wi(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(Wi(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(Wi(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:oe(e.fullReadbackReason??
e.readbackReason,null)}}function A4(r={},e={}){const t=ha(r),n=ha(e);return{schema:uy,uploadBytes:t.uploadBytes+n.uploadBytes,
readbackBytes:t.readbackBytes+n.readbackBytes,retainedBytes:Math.max(t.retainedBytes,n.retainedBytes),compactSummaryBytes:t.
compactSummaryBytes+n.compactSummaryBytes,fullReadbackReason:n.fullReadbackReason||t.fullReadbackReason||null}}function _4(r={}){
return r.parallelStageExecution===!0||r.dependencyMode===dy||(r.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function I4(r,{
baseInput:e=null,currentValue:t=null,stageValues:n={}}={}){if(r.inputFrom&&Object.prototype.hasOwnProperty.call(n,r.inputFrom))
return n[r.inputFrom];const s=Ie(r.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(n,s[0])?n[s[0]]:
s.length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(i=>[i,n[i]])),previousValue:t,
baseInput:e}:t}function Vc(r=[],e=[]){const t=new Set(Ie(e));return Ie(r).filter(n=>t.has(n))}function C4(r={},e={}){const t=Vc(
r.writes,e.writes);if(t.length>0)return{conflictType:"write-write",families:t};const n=Vc(r.writes,e.reads);if(n.length>
0)return{conflictType:"write-read",families:n};const s=Vc(r.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function T4(r=[]){const e=[],t=[];for(const n of r){const s=e.map(i=>({stage:i,conflict:C4(i,n)})).find(
i=>i.conflict);s?t.push({stageId:n.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(n)}return{batch:e,deferred:t}}function M4(r={}){const e=new Set((r.stages||[]).map(t=>t.id));for(const t of r.
stages||[])for(const n of t.dependsOn||[])if(!e.has(n)){const s=new Error(`GPU resident lane stage ${t.id} depends on un\
known stage ${n}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=he(t),s}}function dp(r={}){M4(r);
const e=_4(r),t=[],n=[];if(e){const s=new Map((r.stages||[]).map(o=>[o.id,o])),i=new Set;for(;s.size>0;){const o=(r.stages||
[]).filter(u=>s.has(u.id)).filter(u=>(u.dependsOn||[]).every(d=>i.has(d)));if(!o.length){const u=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw u.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",u}const{batch:a,deferred:c}=T4(o),l=t.length;n.push(...c.map(u=>({...u,batchIndex:l}))),
t.push(a.map(u=>u.id));for(const u of a)s.delete(u.id),i.add(u.id)}}else for(const s of r.stages||[])t.push([s.id]);return{
dependencyMode:e?dy:lp,parallelStageExecution:e,stateFamilyConflictPolicy:e?x4:lp,stateFamilyConflictDeferrals:n,stateFamilyConflictDeferralCount:n.
length,executionBatches:t,maxConcurrentStageCount:t.reduce((s,i)=>Math.max(s,i.length),0)}}function R4(r={},{batchIndex:e=-1,
executorSource:t=null,gpuHubExecutorDescriptor:n=null}={}){const s=he(n?.workerPolicy),i=oe(s?.mode,null),o=s?.status===
"worker-ready",a=i==="dedicated-worker";let c="missing-stage-executor";return t==="stage-plan-executor"?c="stage-plan-ex\
ecutor":t==="provided-stage-executor"?c="provided-stage-executor":t==="gpu-hub-resident-stage-executor"&&(o?c="gpu-hub-w\
orker-resident-stage":a?c="gpu-hub-inline-fallback-for-worker-stage":c="gpu-hub-inline-resident-stage"),{stageId:r.id,lawNodeId:r.
lawNodeId,runtimeTarget:r.runtimeTarget,batchIndex:e,dependsOn:Ie(r.dependsOn),inputFrom:oe(r.inputFrom,null),reads:Ie(r.
reads),writes:Ie(r.writes),executorSource:t,placementTarget:c,gpuHubExecutorDescriptor:he(n),workerPolicy:s,workerResidencyStatus:s?.
status||null,workerRequested:a,workerReady:o,sameDeviceRequired:s?.sameDeviceRequired===!0,bufferTransferPolicy:s?.bufferTransferPolicy||
null}}function B4(r){return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consum\
er-queue-completed"].includes(String(r||""))}class L4{constructor({gpuHub:e=null,deviceId:t="gpu-hub",now:n=()=>Date.now()}={}){
this.gpuHub=e,this.deviceId=t,this.now=n,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:f4,
laneCount:0,activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:t,domainKey:n,solverId:s}={}){return oe(e,`gpu-lane:${oe(
t||n||s,"default")}`)}getOrCreateLane(e={}){const t=this.resolveLaneId(e),n=oe(e.stateKey,null),s=oe(e.sourceFamily,null),
i=this.lanes.get(t);if(i){if(n&&i.stateKey&&i.stateKey!==n)throw new Error(`GPU resident lane ${t} already owns stateKey\
 ${i.stateKey}, not ${n}`);if(n&&!i.stateKey&&(i.stateKey=n),s&&i.sourceFamily&&i.sourceFamily!==s)throw new Error(`GPU \
resident lane ${t} already owns sourceFamily ${i.sourceFamily}, not ${s}`);return s&&!i.sourceFamily&&(i.sourceFamily=s),
e.domainKey&&!i.domainKey&&(i.domainKey=oe(e.domainKey,null)),e.solverId&&!i.solverId&&(i.solverId=oe(e.solverId,null)),
i}const o={schema:p4,laneId:t,stateKey:n,sourceFamily:s,domainKey:oe(e.domainKey,null),solverId:oe(e.solverId,null),deviceId:oe(
e.deviceId,this.deviceId),queueFencePolicy:oe(e.queueFencePolicy,nu),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
Ie(e.retainedBufferRefs)),copyBudget:ha(e.copyBudget||{}),residentSequenceLaneContract:up(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=Vi(o.residentSequenceLaneContract,o),this.lanes.set(t,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const t=this.getOrCreateLane(e),n=oe(e.leaseId,`${t.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(n))throw new Error(`GPU resident lane lease already exists: ${n}`);const s=ha(e.
copyBudget||{}),i=up(e)||he(t.residentSequenceLaneContract),o=Vi(i,{laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,
queueFencePolicy:t.queueFencePolicy});i&&(t.residentSequenceLaneContract=he(i),t.stagePlan=he(o));const a={schema:m4,leaseId:n,
laneId:t.laneId,stateKey:t.stateKey,sourceFamily:oe(e.sourceFamily,t.sourceFamily),domainKey:t.domainKey,solverId:oe(e.solverId,
t.solverId),taskId:oe(e.taskId,null),owner:oe(e.owner,"compute-manager"),readFamilies:Ie(e.readFamilies),writeFamilies:Ie(
e.writeFamilies),retainedBufferRefs:Ie(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:t.queueFencePolicy,residentSequenceLaneContract:i,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(n,a),t.activeLeases.set(n,a),t.copyBudget=A4(t.copyBudget,s);for(const c of a.retainedBufferRefs)t.retainedBufferRefs.
add(c);return t.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),he(a)}createFenceReport(e,{status:t="queue-work-completed",method:n="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=t,queueCompletionMethod:i=n,readbackCompletionStatus:o=null,readbackCompletionMethod:a=null,
retainedBufferRefs:c=null,completed:l=null,source:u="gpu-resident-lane-manager"}={}){const d=typeof e=="string"?this.leases.
get(e):e;if(!d)throw new Error(`Unknown GPU resident lane lease: ${e}`);const h=this.lanes.get(d.laneId),p=l==null?B4(t):
l===!0;return{schema:y4,status:t,method:n,fenceSatisfied:p,required:!0,laneId:d.laneId,stateKey:d.stateKey,queueFencePolicy:d.
queueFencePolicy||h?.queueFencePolicy||nu,queueCompletionStatus:s,queueCompletionMethod:i,readbackCompletionStatus:o,readbackCompletionMethod:a,
retainedBufferRefs:Ie(c,d.retainedBufferRefs),workerId:null,deviceId:h?.deviceId||this.deviceId,completedAt:p?this.now():
null,source:u}}completeLease(e,t={}){const n=this.leases.get(e);if(!n)throw new Error(`Unknown GPU resident lane lease: ${e}`);
const s=this.lanes.get(n.laneId),i=this.createFenceReport(n,t);if(n.status=i.fenceSatisfied?"completed":"completed-unsat\
isfied-fence",n.gpuFence=i,n.releasedAt=this.now(),n.releaseReason=t.releaseReason||n.status,Array.isArray(t.retainedBufferRefs)&&
(n.retainedBufferRefs=Ie(t.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=i,s.updatedAt=this.now();for(const o of n.
retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,
this.stats.completedLeaseCount+=1,this.stats.lastFence=he(i),{schema:b4,lease:he(n),gpuFence:i,lane:s?this.snapshotLane(
s.laneId):null,residentSequenceLaneContract:he(n.residentSequenceLaneContract),stagePlan:he(n.stagePlan),stageExecution:he(
n.stageExecution)}}async executeStagePlan(e,{input:t=null,context:n={},executor:s=null,stageExecutors:i={},allowMissingExecutors:o=!1}={}){
const a=typeof e=="string"?this.leases.get(e):e;if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const c=this.
lanes.get(a.laneId),l=a.stagePlan||Vi(a.residentSequenceLaneContract,{laneId:a.laneId,stateKey:a.stateKey,domainKey:a.domainKey,
queueFencePolicy:a.queueFencePolicy});if(!l||!Array.isArray(l.stages)||l.stages.length===0){const k=new Error(`GPU resid\
ent lane lease ${a.leaseId} has no executable stage plan`);throw k.code="ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING",k}const u=this.
now(),d=[],h={},p=dp(l),g=new Map(l.stages.map(k=>[k.id,k]));let y=t;const m=async(k,x)=>{let A=typeof s=="function"?s:i?.[k.
id]||i?.[k.lawNodeId],S=typeof s=="function"?"stage-plan-executor":A?"provided-stage-executor":null;typeof A!="function"&&
this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(k)&&typeof this.
gpuHub.executeResidentStage=="function"&&(A=$=>this.gpuHub.executeResidentStage($),S="gpu-hub-resident-stage-executor");
const E=S==="gpu-hub-resident-stage-executor"&&typeof this.gpuHub?.describeResidentStageExecutor=="function"?this.gpuHub.
describeResidentStageExecutor(k):null;if(typeof A!="function"){if(!o){const $=new Error(`Missing GPU resident lane stage\
 executor: ${k.id}`);throw $.code="ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING",$.stage=he(k),$}return{result:{stageId:k.
id,lawNodeId:k.lawNodeId,status:"blocked-missing-stage-executor",retainedBufferRefs:[],workerResidency:null},value:x}}const _=this.
now(),I=await A({stage:he(k),stageIndex:k.index,input:x,lease:he(a),lane:c?this.snapshotLane(c.laneId):null,context:n}),
M=v4(I),T=Ie(M.retainedBufferRefs);if(T.length>0&&(a.retainedBufferRefs=Ie([...a.retainedBufferRefs,...T]),c)){for(const $ of T)
c.retainedBufferRefs.add($);c.updatedAt=this.now()}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,runtimeTarget:k.runtimeTarget,
status:"completed",executorSource:S,startedAt:_,completedAt:this.now(),retainedBufferRefs:T,gpuFence:M.gpuFence,workerResidency:he(
E?.workerPolicy),summary:M.summary},value:M.value}};if(p.parallelStageExecution===!0)for(const k of p.executionBatches){
const x=k.map(S=>g.get(S)).filter(Boolean),A=await Promise.all(x.map(S=>m(S,I4(S,{baseInput:t,currentValue:y,stageValues:h}))));
for(let S=0;S<x.length;S+=1){const E=x[S],_=A[S];h[E.id]=_.value,y=_.value,d.push(_.result)}}else for(const k of p.executionBatches){
const x=g.get(k[0]),A=await m(x,y);y=A.value,h[x.id]=A.value,d.push(A.result)}const b=d.some(k=>k.status!=="completed"),
w={schema:k4,status:b?"blocked":"completed",leaseId:a.leaseId,laneId:a.laneId,stateKey:a.stateKey,stagePlan:he(l),stageCount:l.
stages.length,completedStageCount:d.filter(k=>k.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:d,retainedBufferRefs:Ie(a.retainedBufferRefs),output:y,startedAt:u,completedAt:this.
now()};return a.stageExecution=he(w),c&&(c.updatedAt=this.now()),w}preflightStagePlacement(e,{executor:t=null,stageExecutors:n={},
allowMissingExecutors:s=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(i.laneId),a=i.stagePlan||Vi(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!a||!Array.isArray(a.stages)||a.stages.
length===0){const m=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw m.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",m}const c=dp(a),l=new Map;c.executionBatches.forEach((m,f)=>{for(const b of m)l.set(b,
f)});const u=a.stages.map(m=>{let f=typeof t=="function"?t:n?.[m.id]||n?.[m.lawNodeId],b=typeof t=="function"?"stage-pla\
n-executor":f?"provided-stage-executor":null,w=null;return typeof f!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(m)&&typeof this.gpuHub.describeResidentStageExecutor=="function"&&(w=this.
gpuHub.describeResidentStageExecutor(m),b="gpu-hub-resident-stage-executor"),R4(m,{batchIndex:l.get(m.id)??-1,executorSource:b,
gpuHubExecutorDescriptor:w})}),d=u.filter(m=>!m.executorSource).map(m=>m.stageId),h=u.filter(m=>m.workerRequested).map(m=>m.
stageId),p=u.filter(m=>m.workerReady).map(m=>m.stageId),g=u.filter(m=>m.workerRequested&&!m.workerReady).map(m=>m.stageId),
y=s===!0||d.length===0;return{schema:E4,status:y?"placement-preflight-ready":"blocked-missing-stage-executors",authority:"\
compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,domainKey:i.
domainKey,deviceId:o?.deviceId||this.deviceId,stagePlan:he(a),stageCount:a.stages.length,dependencyMode:c.dependencyMode,
parallelStageExecution:c.parallelStageExecution,stateFamilyConflictPolicy:c.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:c.
stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:c.stateFamilyConflictDeferralCount,placementBatches:c.executionBatches,
maxConcurrentStageCount:c.maxConcurrentStageCount,stagePlacements:u,executorSources:Object.fromEntries(u.map(m=>[m.stageId,
m.executorSource])),workerResidencyStatuses:Object.fromEntries(u.map(m=>[m.stageId,m.workerResidencyStatus])),missingExecutorStageIds:d,
missingExecutorCount:d.length,workerRequestedStageIds:h,workerRequestedCount:h.length,workerReadyStageIds:p,workerReadyCount:p.
length,workerFallbackStageIds:g,workerFallbackCount:g.length,canExecute:y,createdAt:this.now()}}planStagePlacement(e,t={}){
return this.preflightStagePlacement(e,t)}rejectLease(e,t="lane-validation-rejected"){const n=this.leases.get(e);if(!n)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(n.laneId);return n.status="rejected",n.releasedAt=this.now(),
n.releaseReason=t,s&&(s.activeLeases.delete(e),s.updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=
this.leases.size,this.stats.rejectedLeaseCount+=1,he(n)}snapshotLane(e){const t=this.lanes.get(e);return t?{schema:t.schema,
laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,solverId:t.solverId,deviceId:t.deviceId,queueFencePolicy:t.queueFencePolicy,
status:t.status,activeLeaseCount:t.activeLeases.size,retainedBufferRefs:[...t.retainedBufferRefs].sort(),copyBudget:he(t.
copyBudget),residentSequenceLaneContract:he(t.residentSequenceLaneContract),stagePlan:he(t.stagePlan),createdAt:t.createdAt,
updatedAt:t.updatedAt,lastFence:he(t.lastFence)}:null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(
e))}getStats(){return{...he(this.stats),laneCount:this.lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}
function D4(){return new Worker(new URL(""+new URL("computeWorker-CVoC4HQV.js",import.meta.url).href,import.meta.url),{type:"\
module"})}const hp=128,fp=5e3,P4="peercompute.compute.worker-utilization.v0",pp="peercompute.compute.task-placement.v0",
$4="peercompute.compute.remote-placement-provenance.v0",Hc="peercompute.compute.remote-placement-verification.v0",mp="pe\
ercompute.compute.remote-placement-validation.v0",Cs="peercompute.compute.remote-placement-retry.v0",gp="peercompute.com\
pute.remote-task-envelope.v0",bp="peercompute.compute.task-packet.v0",N4="peercompute.compute.task-execution.v0",yp="pee\
rcompute.compute.task-graph-result.v0",U4="peercompute.compute.task-graph-context.v0",F4="peercompute.compute.task-graph\
-cache-policy.v0",O4="peercompute.compute.task-graph-cache-inputs.v0",z4="peercompute.compute.task-graph-cache-artifact.\
v0",su="peercompute.compute.task-graph-cache-admission.v0",wp="peercompute.compute.remote-task-graph-cache-import.v0",q4="\
peercompute.compute.remote-task-graph-state-seed-policy.v0",j4="peercompute.compute.task-graph-placement-policy.v0",Kc="\
peercompute.compute.task-graph-cancellation.v0",hy="peercompute.compute.task-graph-gpu-resident-lane.v0",G4="peercompute\
.compute.gpu-fence-report.v0",Rn=["timeout","executor-error"],Hi=["rejected","verification-failed","validation-failed"],
W4=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","\
maxComputeWorkgroupsPerDimension"];function J(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(r));return Number.
isFinite(s)?Math.min(n,Math.max(t,s)):e}function ct(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Number(r);return Number.isFinite(
s)?Math.min(n,Math.max(t,s)):e}function V4({cpuCores:r,deviceMemoryGB:e,gpuAvailable:t,declaredTier:n}){return n?String(
n):r>=32||e>=64?"cluster":t&&(r>=12||e>=16)?"workstation":r<=4||e&&e<=4?"mobile":"laptop"}function iu(r){return r==="clu\
ster"?8192:r==="workstation"?2048:r==="mobile"?384:1024}function fy(r){return r==="cluster"?4096:r==="workstation"?1024:
r==="mobile"?192:512}function H4({tier:r,deviceMemoryGB:e}){const t=iu(r);if(!e)return t;const n=e*1024*.25;return Math.
max(128,Math.min(t,n))}function py(r={}){if(!r)return null;const e=r.gpuLimits||r,t={};for(const n of W4){const s=J(e[n],
null,0,Number.MAX_SAFE_INTEGER);s!=null&&(t[n]=s)}return Object.keys(t).length>0?t:null}function Qc(r={},e={}){const t=typeof navigator<
"u"?navigator:null,n=J(r.cpuCores??r.hardwareConcurrency??t?.hardwareConcurrency,4,1,512),s=ct(r.deviceMemoryGB??r.deviceMemory??
t?.deviceMemory,null,0,2048),i=r.gpuAvailable??e.webgpu??!!t?.gpu,o=V4({cpuCores:n,deviceMemoryGB:s??0,gpuAvailable:i,declaredTier:r.
tier||r.deviceClass}),a=ct(r.memoryBudgetMB??r.ramBudgetMB,H4({tier:o,deviceMemoryGB:s}),0,1048576),c=ct(r.gpuMemoryBudgetMB??
r.gpuBudgetMB??r.vramBudgetMB,i?fy(o):0,0,1048576),l=ct(r.budgetScale??r.resourceBudgetScale??r.computeScale,1,.05,64),u=py(
r.gpuLimits||{maxBufferSize:r.gpuMaxBufferSize??r.maxBufferSize,maxStorageBufferBindingSize:r.gpuMaxStorageBufferBindingSize??
r.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:r.gpuMaxComputeWorkgroupStorageSize??r.maxComputeWorkgroupStorageSize,
maxComputeInvocationsPerWorkgroup:r.gpuMaxComputeInvocationsPerWorkgroup??r.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:r.
gpuMaxComputeWorkgroupsPerDimension??r.maxComputeWorkgroupsPerDimension});return{schema:"peercompute.compute.resource-pr\
ofile.v0",tier:o,cpuCores:n,deviceMemoryGB:s,memoryBudgetMB:a,gpuMemoryBudgetMB:c,budgetScale:l,gpuLimits:u,gpuLimitsSource:u?
r.gpuLimitsSource||"configured":null,gpuAvailable:!!i,wasmAvailable:!!e.wasm,source:r.source||(r.tier?"configured":"brow\
ser")}}function K4(r){const e=r.cpuCores||4;return r.tier==="cluster"?Math.min(64,Math.max(8,e)):r.tier==="workstation"?
Math.min(16,Math.max(4,e)):r.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.floor(e*.75)))}function Jc(r={},e){
const t=J(r.maxWorkers,null,1,hp),n=K4(e),s=t??Math.min(hp,Math.max(n,e.cpuCores||n)),i=J(r.minWorkers,Math.min(s,e.tier===
"mobile"?1:2),0,s),o=J(r.targetWorkers??r.initialWorkers,Math.min(s,Math.max(i,n)),i,s);return{schema:"peercompute.compu\
te.worker-policy.v0",autoScale:r.autoScaleWorkers!==!1,minWorkers:i,targetWorkers:o,maxWorkers:s,scaleUpQueueDepth:J(r.scaleUpQueueDepth,
1,1,1024),idleScaleDownMs:J(r.idleScaleDownMs,5e3,0,6e5)}}function Q4(r){return r==="cluster"?4:r==="workstation"?2:r===
"mobile"?.5:1}function J4(r){return r==="cluster"?4:r==="workstation"?2:1}function X4(r){return r==="cluster"?64:r==="wo\
rkstation"?16:r==="mobile"?2:8}function Ki(r,e=1){return ct(r,e,.25,8)}function Y4(r){const e=String(r||"");return e==="\
manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function Z4(r,e){const t=Math.max(1,e);return Math.
max(t,Math.round(r/t)*t)}function ft(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():
Date.now()}function eT(r){const e=Math.max(0,Number(r)||0);return e<=0?Promise.resolve():new Promise(t=>setTimeout(t,e))}
function Xc(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0}}
function tT(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,timedOut:0,rejected:0,verificationFailed:0,
validationFailed:0}}function ae(r,e=[]){return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r==
"string"?r.split(",").map(t=>t.trim()).filter(Boolean):[...e]}function Qi(...r){const e=new Set,t=[];for(const n of r)for(const s of ae(
n,[]))e.has(s)||(e.add(s),t.push(s));return t}function Y(...r){for(const e of r)if(e!=null)return e;return null}function rT(r={}){
const e=r.webgpu||r.data?.webgpu||{},t=r.gpuFence||r.gpuFenceRequirement||e.gpuFence||e.fence||e.fenceRequirement||{},n=t.
required===!0||t.fenceRequired===!0||e.fenceRequired===!0||e.requiresFence===!0||e.requiresQueueFence===!0,s=Y(t.laneId,
t.gpuLaneId,e.laneId,e.gpuLaneId),i=Y(t.stateKey,t.gpuStateKey,e.stateKey,e.gpuStateKey,r.stateKey,r.data?.stateKey,r.data?.
input?.stateKey),o=Y(t.queueFencePolicy,t.fencePolicy,e.queueFencePolicy,e.fencePolicy),a=ae(t.retainedBufferRefs??e.retainedBufferRefs,
[]);return!n&&!s&&!i&&!o&&a.length===0?null:{schema:"peercompute.compute.gpu-fence-requirement.v0",required:n,laneId:s?String(
s):null,stateKey:i?String(i):null,queueFencePolicy:o?String(o):null,retainedBufferRefs:a,source:t.source||(e&&Object.keys(
e).length>0?"task.webgpu":"task.gpuFence")}}function nT(r={},e=null){const t=r.webgpu||r.data?.webgpu||{},n=r.gpuResidentLane||
r.gpuResidentLaneLease||r.residentLane||t.gpuResidentLane||t.residentLane||{},s=Y(n.residency,t.residency,r.residency,r.
data?.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===!0||String(s||"").trim().toLowerCase()==="gpu-lane",
o=Y(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId,e?.laneId),a=Y(n.stateKey,n.gpuStateKey,t.stateKey,t.gpuStateKey,r.stateKey,
r.data?.stateKey,r.data?.input?.stateKey,e?.stateKey),c=Y(n.domainKey,n.domain,t.domainKey,r.domainKey,r.data?.domainKey),
l=Y(n.sourceFamily,t.sourceFamily,r.data?.sourceFamily,r.data?.input?.sourceFamily),u=Y(n.queueFencePolicy,n.fencePolicy,
t.queueFencePolicy,e?.queueFencePolicy),d=ae(n.retainedBufferRefs??t.retainedBufferRefs,e?.retainedBufferRefs||[]),h=n.copyBudget&&
typeof n.copyBudget=="object"?JSON.parse(JSON.stringify(n.copyBudget)):t.copyBudget&&typeof t.copyBudget=="object"?JSON.
parse(JSON.stringify(t.copyBudget)):{},p=Y(n.residentSequenceLaneContract,n.residentLaneContract,n.laneContract,t.residentSequenceLaneContract,
r.data?.residentSequenceLaneContract,r.data?.input?.residentSequenceLaneContract,r.lawGraphNode?.residentSequenceLaneContract,
null);return!i&&!o&&!a&&d.length===0&&Object.keys(h).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task\
.v0",enabled:!0,localExecution:String(Y(n.localExecution,n.executionMode,t.localExecution,"inline")||"inline").trim().toLowerCase()===
"worker"?"worker":"inline",laneId:o?String(o):null,stateKey:a?String(a):null,sourceFamily:l?String(l):null,domainKey:c?String(
c):null,solverId:Y(n.solverId,r.solverId,r.data?.solverId)||null,owner:Y(n.owner,r.owner,r.taskFamily,r.solverId,"comput\
e-manager-task"),readFamilies:ae(n.readFamilies??n.reads??t.readFamilies),writeFamilies:ae(n.writeFamilies??n.writes??t.
writeFamilies),retainedBufferRefs:d,queueFencePolicy:u?String(u):null,copyBudget:h,residentSequenceLaneContract:p&&typeof p==
"object"?se(p):null}}function se(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}function sT(r={},e=[]){const t=r.cacheInputs||r.cachePolicy?.inputs||r.cache?.
inputs||r.inputRefs||null,n=t&&typeof t=="object"?t:{},s=ae(n.stateRefs??n.states??r.stateRefs),i=ae(n.closureRefs??n.closures??
r.closureRefs),o=ae(n.invalidationRefs??n.invalidates??r.invalidationRefs),a=ae(n.retainedBufferRefs??r.retainedBufferRefs),
c=ae(n.inputHashes??n.hashes??r.inputHashes),l=ae(n.lawIds??n.laws??r.lawIds),u=ae(n.stateFamilies??r.stateFamilies),d=ae(
n.readFamilies??r.readFamilies),h=ae(n.writeFamilies??r.writeFamilies),p=Y(n.values,n.value,n.parameters,r.cacheInputValues,
null),g=e.map(b=>({id:b.id,dependsOn:[...b.dependsOn],taskFamily:b.taskFamily||b.task?.taskFamily||b.task?.solverId||null,
solverId:b.solverId||b.task?.solverId||null,cacheInput:Y(b.cacheInput,b.cacheInputs,b.task?.cacheInput,null)}));if(!(t!=
null||s.length>0||i.length>0||o.length>0||a.length>0||c.length>0||l.length>0||u.length>0||d.length>0||h.length>0||p!=null||
g.some(b=>b.cacheInput!=null||b.taskFamily||b.solverId)))return null;const m={graphFamily:String(Y(n.graphFamily,r.graphFamily,
r.taskFamily,"task-graph")||"task-graph"),graphVersion:String(Y(n.graphVersion,r.graphVersion,r.version,"v0")||"v0"),lawGraphId:Y(
n.lawGraphId,r.lawGraphId,null),stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,
stateFamilies:u,readFamilies:d,writeFamilies:h,scaleRegime:Y(n.scaleRegime,r.scaleRegime,null),units:Y(n.units,r.units,null),
values:p,nodes:g},f=Ks(Hs(m));return{schema:O4,status:"content-addressed-inputs-declared",inputHash:f,stateRefs:s,closureRefs:i,
invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,stateFamilies:u,readFamilies:d,writeFamilies:h,nodeCount:e.
length,source:t?"graph.cacheInputs":"graph-derived-input-refs"}}function iT(r={},e=[]){const t=r.cachePolicy||r.cache||{},
n=String(Y(r.cacheKey,t.cacheKey,t.key,"")||"").trim()||null,s=sT(r,e),i=String(Y(t.scope,r.cacheScope,"compute-manager-\
local")||"compute-manager-local"),o=s?`${i}:${s.inputHash}`:null,a=n||o,c=String(Y(r.cacheMode,t.mode,a?"read-through":"\
disabled")||"disabled").trim().toLowerCase(),l=t.enabled!==!1&&a!=null&&c!=="disabled"&&c!=="off";let u="disabled";return l&&
(c==="record-only"||c==="write-only"?u="record-only":c==="read-only"?u="read-only":u="read-through"),{schema:F4,cacheKey:a,
mode:u,readEnabled:u==="read-through"||u==="read-only",writeEnabled:u==="read-through"||u==="record-only",ttlMs:J(t.ttlMs??
r.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:i,requireAdmitted:t.requireAdmitted!==!1&&r.cacheRequireAdmitted!==!1,explicitCacheKey:n,
derivedCacheKey:o,keySource:n?"explicit":o?"content-addressed-inputs":null,inputHash:s?.inputHash||null,inputs:s,status:l?
"cache-policy-enabled":"cache-policy-disabled"}}function oT(r={}){const e=Y(r.stateSeedPayload,r.cachePolicy?.stateSeedPayload,
r.cache?.stateSeedPayload,r.remoteStateSeedPayload,null);return e==null?null:se(e)}function ou(r,e=new WeakSet){if(r==null)
return r;if(typeof r=="function"||typeof r=="symbol")return;if(typeof r!="object")return r;if(ArrayBuffer.isView(r))return new r.
constructor(r);if(r instanceof ArrayBuffer)return r.slice(0);if(e.has(r))return null;if(e.add(r),Array.isArray(r))return r.
map(n=>ou(n,e)).filter(n=>n!==void 0);const t={};for(const[n,s]of Object.entries(r)){const i=ou(s,e);i!==void 0&&(t[n]=i)}
return t}function aT(r={},e={},t={}){const n=e.resultInputs||e.resultInputMap||(r&&typeof r=="object"?r.resultInputs:null);
if(!n||typeof n!="object"||Array.isArray(n))return r;const s=r.data&&typeof r.data=="object"&&!Array.isArray(r.data)?{...r.
data}:{},i={};for(const[o,a]of Object.entries(n)){const c=typeof a=="string"?a:String(a?.nodeId||a?.resultId||a?.from||"").
trim();if(!(!o||!c)){if(!Object.prototype.hasOwnProperty.call(t,c))throw new Error(`Task graph node ${e.id} requested un\
available result input ${o} from ${c}`);s[o]=ou(t[c]),i[o]=c}}return Object.keys(i).length===0?r:{...r,data:s,taskGraphResultInputs:i}}
function cT(r={},e={}){const t=r.cacheAdmission||r.cachePolicy?.admission||r.cache?.admission||{},n=t.admitted===!0||t.accepted===
!0||t.status==="admitted"||t.status==="admission-accepted",s=e.mode==="record-only",i=t.status||(n?"admitted":s?"recorde\
d-not-admitted":"pending-admission");return{schema:su,status:i,admitted:n,authority:String(Y(t.authority,r.cacheAuthority,
"compute-manager-local")||"compute-manager-local"),admissionId:Y(t.admissionId,t.id,null),validatorId:Y(t.validatorId,t.
validator,null),reason:String(Y(t.reason,s?"record-only-cache-artifact-requires-state-manager-admission":"cache-artifact\
-admission-pending","")||""),invalidationRefs:ae(t.invalidationRefs??e.inputs?.invalidationRefs),acceptedAt:n?t.acceptedAt||
Date.now():null}}function lT({graphId:r,cachePolicy:e,result:t,storedAt:n,expiresAt:s,admission:i}={}){const o=Ks(Hs({schema:t?.
schema,graphId:t?.graphId,status:t?.status,nodeReports:t?.nodeReports,nodeResults:t?.nodeResults}));return{schema:z4,artifactId:`${e.
cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.inputHash,resultHash:o,
graphId:r,status:i?.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:i?.admitted===!0,admission:i,
inputs:e.inputs,invalidationRefs:ae(i?.invalidationRefs,e.inputs?.invalidationRefs||[]),stateSeedPayload:t?.stateSeedPayload!=
null?se(t.stateSeedPayload):null,storedAt:n,expiresAt:s,ttlMs:e.ttlMs,resultSchema:t?.schema||null,nodeCount:t?.nodeCount??
null,resultNodeSchemas:(t?.nodeReports||[]).map(a=>({nodeId:a.nodeId,resultSchema:a.resultSchema||null,taskFamily:a.taskFamily||
null}))}}function uT(r={}){const e=r.placementPolicy||r.placement||r.placementHint||{},t=String(Y(e.requestedPlacement,e.
placement,e.mode,r.requestedPlacement,r.placementMode,"local")||"local").trim().toLowerCase();return{schema:j4,requestedPlacement:t,
locality:String(Y(e.locality,r.locality,t==="local"?"local-inline":"distributed")||""),authority:String(Y(e.authority,r.
authority,"compute-manager")||"compute-manager"),targetPeerIds:ae(e.targetPeerIds??e.peers??r.targetPeerIds),targetClusterId:Y(
e.targetClusterId,e.clusterId,r.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||r.gpuResident===!0,
advisory:e.advisory!==!1}}function dT(r={},e=null){const t=r.webgpu||{},n=r.gpuResidentLane||r.gpuResidentLaneLease||r.residentLane||
t.gpuResidentLane||t.residentLane||{},s=Y(n.residency,t.residency,r.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=Y(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId),a=Y(n.stateKey,n.gpuStateKey,
t.stateKey,t.gpuStateKey,r.stateKey),c=Y(n.domainKey,n.domain,t.domainKey,r.domainKey),l=ae(n.retainedBufferRefs??t.retainedBufferRefs??
r.retainedBufferRefs),u=n.copyBudget&&typeof n.copyBudget=="object"?se(n.copyBudget):t.copyBudget&&typeof t.copyBudget==
"object"?se(t.copyBudget):{};return!i&&!o&&!a&&l.length===0&&Object.keys(u).length===0?null:{schema:hy,enabled:!0,laneId:o?
String(o):null,stateKey:a?String(a):null,domainKey:c?String(c):null,solverId:Y(n.solverId,r.solverId,null),taskId:e,owner:Y(
n.owner,r.owner,"compute-manager-task-graph"),readFamilies:ae(n.readFamilies??n.reads??t.readFamilies??r.readFamilies),writeFamilies:ae(
n.writeFamilies??n.writes??t.writeFamilies??r.writeFamilies),retainedBufferRefs:l,queueFencePolicy:Y(n.queueFencePolicy,
n.fencePolicy,t.queueFencePolicy,null),copyBudget:u}}function hT(r){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(r||""))}
function Ji(r=null,e=null){const t=r&&typeof r=="object"?r:{},n=t.status||t.queueCompletionStatus||t.fenceStatus||t.completionStatus||
(e?.required?"gpu-fence-report-missing":null);if(!n&&!e?.required)return null;const s=t.method||t.queueCompletionMethod||
t.fenceMethod||t.completionMethod||null,i=t.fenceSatisfied===!0||t.satisfied===!0||t.completed===!0||hT(n);return{schema:t.
schema||G4,status:n,method:s,fenceSatisfied:i,required:e?.required===!0||t.required===!0,laneId:Y(t.laneId,t.gpuLaneId,e?.
laneId),stateKey:Y(t.stateKey,t.gpuStateKey,e?.stateKey),queueFencePolicy:Y(t.queueFencePolicy,t.fencePolicy,e?.queueFencePolicy),
queueCompletionStatus:t.queueCompletionStatus||n||null,queueCompletionMethod:t.queueCompletionMethod||s||null,retainedBufferRefs:ae(
t.retainedBufferRefs,e?.retainedBufferRefs||[]),workerId:t.workerId||t.remoteWorkerId||null,deviceId:t.deviceId||t.gpuDeviceId||
null,completedAt:t.completedAt||null,source:t.source||null}}function Yc(r){return r?typeof r=="function"?r.placementExecutorId||
r.id||r.name||"placement-executor":r.id||r.name||r.constructor?.name||"placement-executor":null}function Zc(r){return r?
typeof r=="function"?r.placementAdmissionId||r.id||r.name||"placement-admission":r.id||r.name||r.constructor?.name||"pla\
cement-admission":null}function el(r){return r?typeof r=="function"?r.placementResultValidatorId||r.id||r.name||"placeme\
nt-result-validator":r.id||r.name||r.constructor?.name||"placement-result-validator":null}function tl(r){return r?typeof r==
"function"?r.placementTaskSignerId||r.id||r.name||"placement-task-signer":r.id||r.name||r.constructor?.name||"placement-\
task-signer":null}function fT(r){return(Array.isArray(r)?r:[]).slice(0,64).map((t,n)=>{const s=t&&typeof t=="object"?t:{};
return{schema:s.schema||null,role:s.role||null,index:n,peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||
s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.transportPeerId||null,responderNodeId:s.responderNodeId||
null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.
remoteExecution&&typeof s.remoteExecution=="object"?JSON.parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&
typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||
null,inputHash:s.inputHash||null,taskHash:s.taskHash||null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||
s.outputHash||null,commitDeltaHash:s.commitDeltaHash||s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.
validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===
!0,errorCode:s.errorCode||null,errorMessage:s.errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(
Number(s.durationMs).toFixed(3)):null}})}function au(r){if(r==null)return r;if(typeof r=="number")return Number.isFinite(
r)?r:String(r);if(typeof r=="string"||typeof r=="boolean")return r;if(typeof r=="bigint")return`${r.toString()}n`;if(typeof r==
"function")return`[Function:${r.name||"anonymous"}]`;if(ArrayBuffer.isView(r))return{typedArray:r.constructor?.name||"Ty\
pedArray",values:Array.from(r)};if(r instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(r))};if(Array.
isArray(r))return r.map(au);if(typeof r=="object"){const e={};for(const t of Object.keys(r).sort()){if(t==="taskPacket"||
t==="taskEnvelope")continue;const n=au(r[t]);n!==void 0&&(e[t]=n)}return e}return String(r)}function Hs(r){return JSON.stringify(
au(r))}function Ks(r){const e=String(r??"");let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(
t,16777619)>>>0;return`fnv1a32-${t.toString(16).padStart(8,"0")}`}function rl({executorId:r,kind:e="worker",ordinal:t=null,
status:n="active"}={}){return{executorId:r,kind:e,ordinal:t,status:n,activeTaskCount:0,submitted:0,completed:0,failed:0,
abandoned:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,
lastStartedAt:null,lastCompletedAt:null,byRuntime:{},byTaskFamily:{}}}class pT{constructor(e={}){const t=typeof navigator<
"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4,n=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<
"u";this.workerPolicyOverrides={minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.
maxWorkers,autoScaleWorkers:e.autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},
this.resourceProfile=Qc(e.resourceProfile||e,{wasm:s,webgpu:n}),this.workerPolicy=Jc(this.workerPolicyOverrides,this.resourceProfile),
this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:J(
e.workerBootstrapTimeoutMs,fp,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,
maxWorkers:this.workerPolicy.maxWorkers||t,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.
workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.
config.workerBootstrapTimeoutMs=J(e.workerBootstrapTimeoutMs,fp,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=
new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,this.taskGraphCacheArtifacts=new Map,this.workerAffinities=
new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=new Map,this.modelServices=new Set,this.resourceBroker=
e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=new WeakMap,this.workerRequirementError=null,this.
workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=new Map,this.nextWorkerOrdinal=1,
this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,rl({executorId:this.inlineExecutorId,kind:"\
inline",ordinal:0,status:"active"})),this.solverRegistry=new h4(e.solvers||[]),this.gpuResidentLaneManager=e.gpuResidentLaneManager||
new L4({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.targetWorkerCount=this.workerPolicy.
targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=0,this.workerResizeHistory=[],
this.placementExecutor=typeof e.placementExecutor=="function"||e.placementExecutor?.submitTask?e.placementExecutor:null,
this.placementExecutorId=e.placementExecutorId||Yc(this.placementExecutor),this.placementAdmission=typeof e.placementAdmission==
"function"||e.placementAdmission?.admitTask?e.placementAdmission:null,this.placementAdmissionId=e.placementAdmissionId||
Zc(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="function"||e.placementResultValidator?.
validateTaskResult||e.placementResultValidator?.validateResult?e.placementResultValidator:null,this.placementResultValidatorId=
e.placementResultValidatorId||el(this.placementResultValidator),this.placementTaskSigner=typeof e.placementTaskSigner=="\
function"||e.placementTaskSigner?.signTaskPacket||e.placementTaskSigner?.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||
e.remoteTaskSigner:null,this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||tl(this.placementTaskSigner),
this.placementTimeoutMs=J(e.placementTimeoutMs??e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.remoteResultVerification!==
!1&&e.placementResultVerification!==!1,this.placementRetryPolicy={schema:Cs,maxAttempts:J(e.placementMaxAttempts??e.remotePlacementMaxAttempts,
1,1,100),baseDelayMs:J(e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,50,0,6e5),maxDelayMs:J(e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,1e3,0,6e5),jitterFraction:ct(e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
0,0,1),retryableErrorKinds:ae(e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,Rn),terminalErrorKinds:[
...Hi]},this.manualWorkerAutoScaleCooldownMs=J(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,4e3,0,6e5),this.
workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=null,this.lastWorkerResize={schema:"peercompute.compute.worker\
-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.targetWorkerCount,targetWorkers:this.targetWorkerCount,
previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.stats={schema:"peercompute.compute.manager-stats.v0",
totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,workerTasksCompleted:0,remoteTasksCompleted:0,
remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,remoteTasksValidationFailed:0,
remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,taskGraphsCompleted:0,taskGraphsFailed:0,
taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,taskGraphCacheArtifactsAdmitted:0,
taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,taskGraphCacheReadBlocked:0,
totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{},taskPlacement:{schema:pp,totalSubmitted:0,totalCompleted:0,totalFailed:0,localSubmitted:0,remoteRequested:0,
remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,remoteValidationFailed:0,remoteAttempts:0,
remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,byRecommendedPlacement:{},byActualPlacement:{}}},
this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities={cpu:!0,wasm:s,webgpu:n,wasmWebgpu:s&&n},this.initialized=
!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const t=J(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
workerPolicy.maxWorkers);for(let n=0;n<t&&this._spawnWorker();n+=1);if(this.workers.length===0){if(this.config.requireWorkers)
throw this._failRequiredWorkerPool(this.workerRequirementError||this._createRequiredWorkerError("no browser worker could\
 be constructed during bootstrap"));console.warn("[ComputeManager] Worker bootstrap failed; falling back to inline execu\
tion");return}if(this.config.requireWorkers){const n=this._waitForRequiredWorkerBootstrap();this.workerInitializationPromise=
n;try{if(await n,this.workerLifecycleRevision!==e)throw Object.assign(new Error("ComputeManager was destroyed during wor\
ker bootstrap"),{name:"ComputeManagerDestroyedError",code:"ERR_COMPUTE_MANAGER_DESTROYED"});if(this.workerRequirementError)
throw this.workerRequirementError;const s=this._getWorkerRequirementReport();if(s.workerCount===0||s.readyWorkerCount!==
s.workerCount)throw this._createRequiredWorkerError("the required worker pool changed before admission completed")}catch(s){
throw this.workerLifecycleRevision!==e?s:this._failRequiredWorkerPool(s)}finally{this.workerInitializationPromise===n&&(this.
workerInitializationPromise=null)}}}async destroy(){if(this.destroyingPromise)return this.destroyingPromise;this.destroying=
!0,this.workerLifecycleRevision+=1,this.destroyingPromise=this._destroyManagedRuntime();try{return await this.destroyingPromise}finally{
this.destroyingPromise=null,this.destroying=!1}}async _destroyManagedRuntime(){clearTimeout(this.scaleDownTimer),this.scaleDownTimer=
null;const e=Object.assign(new Error("ComputeManager was destroyed before pending work completed"),{name:"ComputeManager\
DestroyedError",code:"ERR_COMPUTE_MANAGER_DESTROYED"});for(;this.taskQueue.length;){const s=this.taskQueue.shift();this.
_rejectTaskGpuResidentLaneLease(s,e.code),s.reject(e)}const t=[];for(const s of this.modelServices)try{await s.dispose()}catch{
t.push(s)}const n=[];for(const s of[...this.workers])this._markWorkerBootstrapFailed(s,e),this._removeWorker(s)||n.push(
this.workerTerminationFailures.get(s));for(const[s,i]of this.activeTasks)i.worker&&this.workers.includes(i.worker)||(this.
activeTasks.delete(s),this._rejectTaskGpuResidentLaneLease(i,e.code),i.reject?.(Object.assign(new Error(e.message),{name:e.
name,code:e.code,workerTerminated:!!i.worker})));for(const s of t)try{await s.dispose()}catch(i){n.push(i)}if(n.length)throw new AggregateError(
n,"ComputeManager cleanup is incomplete");this.workerAffinities.clear(),this.residentWorkerAffinities.clear(),this.activeTaskGraphs.
clear(),this.commitDeltaHandler=null,this.initialized=!1,this.workerRequirementError=null,this.workerInitializationPromise=
null,this.workerBootstrap=new WeakMap,this.workerIds=new WeakMap,this.modelServices.clear()}async createModelInferenceService({
artifactStore:e,resourceBroker:t,resourceBudgets:n,runtime:s="transformers.js",...i}={}){if(this.destroying)throw new Error(
"ComputeManager is shutting down");if(!["transformers.js","llama.cpp","onnx-diffusion"].includes(s))throw new Error("Uns\
upported model execution runtime");const o=this.workerLifecycleRevision,[{ModelInferenceService:a},{ResourceLeaseBroker:c},
{ResidentModelAdmission:l},u]=await Promise.all([kt(()=>import("./ModelInferenceService-Cy85NOYH.js"),__vite__mapDeps([6,3]),import.meta.
url),kt(()=>import("./ResourceLeaseBroker-CGg9Wxga.js"),[],import.meta.url),kt(()=>import("./ResidentModelAdmission-BZWCmJpI.js"),
[],import.meta.url),s==="llama.cpp"?kt(()=>import("./runtimeDefinition-B0QVSqJZ.js"),__vite__mapDeps([2,3]),import.meta.
url).then(p=>p.ggufRuntimeDefinition):s==="onnx-diffusion"?kt(()=>import("./runtimeDefinition-C9GfZLDf.js"),__vite__mapDeps([5,3]),
import.meta.url).then(p=>p.diffusionRuntimeDefinition):null]);if(this.destroying||o!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted service creation");if(t&&this.resourceBroker&&t!==this.resourceBroker)throw new Error(
"Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){if(!t&&!n)throw new Error("Conf\
igure inference CPU/GPU resource budgets");this.resourceBroker=t||new c({capacities:n})}const d=new a({...i,runtimeDefinition:u,
artifactStore:e,computeManager:this,admission:new l({broker:this.resourceBroker})});this.modelServices.add(d);const h=d.
dispose.bind(d);return d.dispose=async()=>{const p=await h();return this.modelServices.delete(d),p},d}async refreshGpuLimits(){
if(typeof navigator>"u"||!navigator.gpu?.requestAdapter)return this.getResourceProfile();let e=null;try{e=await navigator.
gpu.requestAdapter()}catch{return this.getResourceProfile()}const t=py(e?.limits);return t?(this.resourceProfile=Qc({...this.
resourceProfile,gpuAvailable:!0,gpuLimits:t,gpuLimitsSource:"adapter",source:this.resourceProfile.source||"browser"},this.
capabilities),this.workerPolicy=Jc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.
minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,
this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.getResourceProfile()):this.getResourceProfile()}async submitTask(e){
if(!e)throw new Error("Task is required");const t=e.module==="peercompute:model-inference"&&e.data?.command==="unload"&&
[...this.modelServices].some(g=>g.session?.affinityKey===e.affinityKey);if(this.destroying&&!t)throw new Error("ComputeM\
anager is shutting down");const n=this.workerLifecycleRevision;e.signal?.throwIfAborted();const s=typeof e.runtime=="str\
ing"?e.runtime.trim().toLowerCase():e.wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js";if(s==="js"&&!e.fn&&!e.module)
throw new Error("JavaScript tasks must provide fn or module");if((s==="wasm"||s==="wasm-webgpu")&&!(e.wasm?.source||e.wasmSource||
e.source))throw new Error(`${s} tasks must provide wasm.source`);if(s==="wasm-webgpu"&&!(e.hostModule||e.module))throw new Error(
"wasm-webgpu tasks must provide hostModule or module");if(this.workerRequirementError)throw this.workerRequirementError;
if((!this.initialized||this.config.requireWorkers&&this.workerInitializationPromise)&&await this.initialize(),this.workerRequirementError)
throw this.workerRequirementError;if(e.signal?.throwIfAborted(),this.destroying&&!t||n!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted task submission");if(e.requireWorker===!0&&!this._supportsWorkers())throw this._createRequiredWorkerError(
"this task requires worker execution");const i=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.
random()}`,o=e.id||i;if(this.activeTasks.has(o)||this.taskQueue.some(g=>g.id===o))throw new Error(`Compute task id is al\
ready active: ${o}`);const a=this._runtimeStats(s);a.submitted+=1,this.stats.totalTasksSubmitted+=1;const c=this._normalizeTaskFamily(
e,s),l=this._taskFamilyStats(c);l.submitted+=1;const u=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:c}),d=rT(e),
h=nT(e,d);this._recordPlacementSubmitted(u);const p={id:o,runtime:s,taskFamily:c,solverId:e.solverId,placement:u,gpuFence:d,
gpuResidentLane:h,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey};if(p.
requireWorker&&(h?.localExecution==="inline"||u.requestedPlacement!=="local"&&!u.advisory))throw this._createRequiredWorkerError(
"required local worker conflicts with requested placement");if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&
!this.workerAffinities.has(p.affinityKey))throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers({reason:"task-demand"}),this.workerRequirementError)
throw this.workerRequirementError;return new Promise((g,y)=>{const m={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};
let f;const b=new Promise(A=>{f=A}),w=()=>{this.cancelTask(o).catch(()=>{})},k=(A,S)=>{m.settled||(m.settled=!0,clearTimeout(
m.timer),clearTimeout(m.bootstrapTimer),e.signal?.removeEventListener("abort",w),A(S),f())},x={id:o,payload:p,control:m,
completion:b,resolve:A=>k(g,A),reject:A=>k(y,A),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.
isArray(e.transferables)?e.transferables:[],submittedAt:ft(),runtime:s,taskFamily:c,placement:u};if(p.requireWorker&&!this.
workers.some(A=>this.workerBootstrap.get(A)?.status==="ready")&&(m.bootstrapTimer=setTimeout(()=>{const A=this.taskQueue.
findIndex(S=>S.id===o);A<0||(this.taskQueue.splice(A,1),this._recordTaskCompletion(x,{ok:!1,mode:"queued"}),x.reject(this.
_createRequiredWorkerError("task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),e.signal?.addEventListener(
"abort",w,{once:!0}),e.signal?.aborted){x.reject(e.signal.reason||new DOMException("Compute task cancelled","AbortError"));
return}this._dispatchToPlacementExecutor(x)||this._dispatchToWorker(x)||(this.taskQueue.push(x),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Qc(e,this.capabilities),this.
workerPolicy=Jc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:t="manual"}={}){const n=this.targetWorkerCount,s=this.workers.length,i=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=J(e,this.targetWorkerCount,i,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,Y4(t)&&this._holdWorkerAutoScale(t),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:t,previousTargetWorkers:n,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(t),this._scheduleNext(),this._recordWorkerResize({reason:t,previousTargetWorkers:n,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:t=4096,minItems:n=1024,
maxItems:s=65536,itemStrideBytes:i=0,memoryFraction:o=.25,layerCount:a=1,maxShardsPerLayer:c=8}={}){const l=Math.max(1,this.
targetWorkerCount||this.workerPolicy.targetWorkers||1),u=J(a,1,1,1024),d=J4(this.resourceProfile.tier),h=Math.max(1,Math.
floor(l/u)),p=J(Math.min(d,h),1,1,Math.max(1,c)),g=Q4(this.resourceProfile.tier),y=Ki(l/X4(this.resourceProfile.tier)),m=ct(
this.resourceProfile.memoryBudgetMB,iu(this.resourceProfile.tier),0,1048576),f=ct(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),b=Ki(m/iu(this.resourceProfile.tier)),w=this.resourceProfile.gpuAvailable?Ki(f/Math.max(1,fy(this.resourceProfile.
tier))):.75,k=ct(this.resourceProfile.budgetScale,1,.05,64),x=Ki(Math.min(y,b,w)*k),A=J(i,0,0,1048576),S=ct(o,.25,.01,1),
E=A>0&&m>0?Math.max(n,Math.floor(m*1024*1024*S/A)):s,_=A>0&&this.resourceProfile.gpuLimits?Math.min(J(this.resourceProfile.
gpuLimits.maxBufferSize,Number.MAX_SAFE_INTEGER,0),J(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.MAX_SAFE_INTEGER,
0)):Number.MAX_SAFE_INTEGER,I=Number.isFinite(_)&&_>0&&A>0?Math.max(n,Math.floor(_*S/A)):s,M=Math.max(n,Math.min(s,E,I)),
T=J(Z4(t*g*x,256),t,n,M),D=Object.entries({workers:y,memory:b,gpu:w,explicit:k}).sort((U,Q)=>U[1]-Q[1])[0]?.[0]||"worker\
s";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:T,minItems:n,maxItems:s,effectiveMaxItems:M,
itemStrideBytes:A,workerCount:l,shardsPerLayer:p,layerCount:u,plannedWorkerTasks:u*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:x,limitingFactor:D,workerScale:y,memoryScale:b,gpuScale:w,explicitScale:k,memoryBudgetMB:m,
gpuMemoryBudgetMB:f,memoryFraction:S,memoryMaxItems:E,gpuMaxItems:I,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,t={}){const n=this.solverRegistry.createTask(e,
t);return this.submitTask(n)}async submitTaskGraph(e={}){const t=String(e.graphId||e.id||`task-graph:${Date.now()}`).trim(),
n=Array.isArray(e.nodes)?e.nodes:[];if(!n.length)throw new Error("submitTaskGraph requires at least one node");const s=[],
i=new Map;for(const D of n){const U=String(D?.id||D?.nodeId||D?.task?.id||"").trim();if(!U)throw new Error("submitTaskGr\
aph node id is required");if(i.has(U))throw new Error(`Duplicate task graph node id: ${U}`);const Q=ae(D.dependsOn||D.dependencies||
[]),H={...D,id:U,dependsOn:Q};s.push(H),i.set(U,H)}for(const D of s)for(const U of D.dependsOn)if(!i.has(U))throw new Error(
`Task graph node ${D.id} depends on unknown node ${U}`);this.stats.taskGraphsSubmitted+=1;const o=iT(e,s),a=oT(e),c=cT(e,
o),l=uT(e),u=dT(e,t),d=String(e.cancellation?.mode||e.cancellationMode||"cooperative").trim()||"cooperative",h=e.abortSignal||
e.cancelSignal||e.signal||e.cancellation?.signal||null,p={schema:Kc,mode:d,status:"not-cancelled",reason:null};let g=o.readEnabled?
this.taskGraphCache.get(o.cacheKey):null;const y=Date.now();g&&g.expiresAt&&g.expiresAt<=y&&(this.taskGraphCache.delete(
o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),g=null);let m=null;if(g&&o.requireAdmitted&&g.artifact?.admitted!==
!0&&(this.stats.taskGraphCacheReadBlocked+=1,m="blocked-unadmitted-cache-artifact",g=null),g){this.stats.taskGraphCacheHits+=
1,this.stats.taskGraphsCompleted+=1;const D=se(g.result),U=se(g.artifact||D.cacheArtifact||null);return{...D,cachePolicy:o,
cacheAdmission:U?.admission||D.cacheAdmission||c,cacheAdmissionStatus:U?.admission?.status||D.cacheAdmissionStatus||null,
cacheArtifact:U,cacheArtifactSchema:U?.schema||null,cacheArtifactStatus:U?.status||null,cacheStatus:"hit",cacheHit:!0,cachedAt:g.
storedAt,durationMs:0}}const f=new Map(s.map(D=>[D.id,D])),b={},w=[],k=[],x=[],A=ft(),S={graphId:t,startedAt:A,cancelled:h?.
aborted===!0,reason:h?.reason||null,cacheKey:o.cacheKey,stateSeedPayload:a,placementPolicy:l,graphLaneSpec:u},E=()=>{S.cancelled=
!0,S.reason=h?.reason||"abort-signal"};h?.addEventListener&&h.addEventListener("abort",E,{once:!0}),this.activeTaskGraphs.
set(t,S);const _=()=>{if(!S.cancelled)return;p.status="cancelled",p.reason=String(S.reason||"cancelled");const D=new Error(
`Task graph cancelled: ${t}`);throw D.code="TASK_GRAPH_CANCELLED",D.graphId=t,D.cancellation={...p},D};let I=null,M=null,
T=u?"required":"not-required",$=m||(o.readEnabled?"miss":o.writeEnabled?"record-only":"disabled");try{for(_(),u&&(I=this.
acquireGpuResidentLaneLease({...u,taskId:t,owner:u.owner||"compute-manager-task-graph"}),T="active");f.size>0;){_();const U=new Set(
Object.keys(b)),Q=Array.from(f.values()).filter(V=>V.dependsOn.every(te=>U.has(te)));if(!Q.length)throw new Error(`Task \
graph has a cycle or unsatisfied dependency: ${Array.from(f.keys()).join(", ")}`);x.push(Q.map(V=>V.id));const H=await Promise.
all(Q.map(async V=>{_();const te={schema:U4,graphId:t,nodeId:V.id,dependsOn:[...V.dependsOn],completedNodeIds:Object.keys(
b),nodeResults:b,results:b,cachePolicy:o,cacheKey:o.cacheKey,cacheInputs:o.inputs,stateSeedPayload:a,placementPolicy:l,cancellation:p,
graphLease:I,graphLeaseSpec:u,getResult(le){return b[le]}};let ie=typeof V.createTask=="function"?await V.createTask(te):
typeof V.task=="function"?await V.task(te):V.task;if(!ie||typeof ie!="object")throw new Error(`Task graph node ${V.id} d\
id not produce a task`);ie=aT(ie,V,b),_();const we=ft(),it=await this.submitTask(ie);return _(),{node:V,task:ie,result:it,
durationMs:Math.max(0,ft()-we)}}));for(const V of H)f.delete(V.node.id),b[V.node.id]=V.result,k.push(V.node.id),w.push({
nodeId:V.node.id,dependsOn:[...V.node.dependsOn],taskId:V.task.id||null,taskFamily:V.task.taskFamily||V.task.solverId||null,
solverId:V.task.solverId||null,status:"completed",durationMs:V.durationMs,resultSchema:V.result?.computeTaskResultSchema||
V.result?.schema||null})}I?.leaseId&&(M=this.completeGpuResidentLaneLease(I.leaseId,{status:"ordered-before-consumer-que\
ue-completed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-comple\
ted",queueCompletionMethod:"compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),T=M?.lease?.status||
"completed");const D={schema:yp,graphId:t,status:"completed",nodeCount:s.length,edgeCount:s.reduce((U,Q)=>U+Q.dependsOn.
length,0),executionOrder:k,executionBatches:x,nodeReports:w,nodeResults:b,cachePolicy:o,cacheKey:o.cacheKey,cacheKeySource:o.
keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:a,cacheAdmission:c,cacheAdmissionStatus:c.status,
cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:$,cacheHit:!1,placementPolicy:l,cancellation:p,
cancellationStatus:p.status,graphLeaseRequired:u!=null,graphLeaseStatus:T,graphLeaseSpec:u,graphLease:I,graphLeaseExecution:M,
durationMs:Math.max(0,ft()-A)};if(o.writeEnabled){const U=Date.now(),Q=o.ttlMs>0?U+o.ttlMs:null,H=lT({graphId:t,cachePolicy:o,
result:D,storedAt:U,expiresAt:Q,admission:c});this.taskGraphCache.set(o.cacheKey,{storedAt:U,expiresAt:Q,artifact:se(H),
result:se(D)}),this.taskGraphCacheArtifacts.set(o.cacheKey,se(H)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,$=o.readEnabled?"miss-stored":"recorded",D.cacheStatus=$,D.cachedAt=U,D.cacheArtifact=H,D.cacheArtifactSchema=H.schema,
D.cacheArtifactStatus=H.status}return this.stats.taskGraphsCompleted+=1,D}catch(D){const U=S.cancelled||D?.code==="TASK_\
GRAPH_CANCELLED";if(U?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,I?.leaseId&&!M)try{this.rejectGpuResidentLaneLease(
I.leaseId,U?"task-graph-cancelled":"task-graph-failed"),T=U?"rejected-cancelled":"rejected-failed"}catch{T="reject-faile\
d"}throw D.graphId=D.graphId||t,D.taskGraphStatus=U?"cancelled":"failed",D.graphLeaseStatus=T,D.cancellation=D.cancellation||
{...p},D}finally{h?.removeEventListener&&h.removeEventListener("abort",E),this.activeTaskGraphs.delete(t)}}getGpuResidentLaneManager(){
return this.gpuResidentLaneManager}getGpuResidentLaneStats(){return this.gpuResidentLaneManager?.getStats?.()||null}acquireGpuResidentLaneLease(e={}){
if(!this.gpuResidentLaneManager?.acquireLease)throw new Error("GPU resident lane manager is not available");return this.
gpuResidentLaneManager.acquireLease(e)}completeGpuResidentLaneLease(e,t={}){if(!this.gpuResidentLaneManager?.completeLease)
throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.completeLease(e,t)}rejectGpuResidentLaneLease(e,t="\
lane-validation-rejected"){if(!this.gpuResidentLaneManager?.rejectLease)throw new Error("GPU resident lane manager is no\
t available");return this.gpuResidentLaneManager.rejectLease(e,t)}executeGpuResidentLaneStagePlan(e,t={}){if(!this.gpuResidentLaneManager?.
executeStagePlan)throw new Error("GPU resident lane manager cannot execute stage plans");return this.gpuResidentLaneManager.
executeStagePlan(e,t)}preflightGpuResidentLaneStagePlacement(e,t={}){if(!this.gpuResidentLaneManager?.preflightStagePlacement)
throw new Error("GPU resident lane manager cannot preflight stage placement");return this.gpuResidentLaneManager.preflightStagePlacement(
e,t)}planGpuResidentLaneStagePlacement(e,t={}){return this.preflightGpuResidentLaneStagePlacement(e,t)}async distributeTask(e,t){}async cancelTask(e,t={}){
const n=this.taskQueue.findIndex(l=>l.id===e),s=n>=0?this.taskQueue[n]:this.activeTasks.get(e);if(!s)return{cancelled:!1,
status:"not-found"};if(!s.control)return{cancelled:!1,status:"unsupported-executor"};if(s.control.cancelRequested)return s.
control.cancellation;if(n<0&&!s.worker)return{cancelled:!1,status:"unsupported-executor"};s.control.cancelRequested=!0;const i=Object.
assign(new Error(String(t.reason||"Compute task cancelled")),{name:"AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"});let o;
const a=new Promise((l,u)=>{o=u});if(s.control.cancellation=Promise.race([s.completion,a]).then(()=>({cancelled:!0,status:"\
settled",workerTerminated:!!i.workerTerminated})),n>=0)return this.taskQueue.splice(n,1),this._recordTaskCompletion(s,{ok:!1,
mode:"queued"}),s.reject(i),this._scheduleNext(),{cancelled:!0,status:"cancelled-queued"};const c=()=>{if(!s.control.settled){
if(!this._removeWorker(s.worker)){clearTimeout(s.control.timer),s.control.cancelRequested=!1,o(this.workerTerminationFailures.
get(s.worker));return}this.activeTasks.delete(e),i.workerTerminated=!0,this._recordTaskCompletion(s,{ok:!1,mode:"worker"}),
s.reject(i),this._ensureTargetWorkers({reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(c,J(
t.timeoutMs,2e3,1,6e4));try{s.worker.postMessage({type:"cancel",id:e})}catch{c()}return s.control.cancellation}async reserveWorkerAffinity(e){
if(this.destroying)throw new Error("ComputeManager is shutting down");const t=this.workerLifecycleRevision,n=String(e||"").
trim();if(!n)throw new TypeError("Worker affinity key is required");if(this.initialized||await this.initialize(),this.destroying||
t!==this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted reservation");if(!this._supportsWorkers())
throw this._createRequiredWorkerError("resident sessions require workers");if(this.residentWorkerAffinities.has(n)){const c=this.
getWorkerAffinityState(n),l=this.workerTerminationFailures.get(this.workerAffinities.get(n));if(l)throw l;if(!c.workerId)
throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"});
return c}if(this.residentWorkerAffinities.size>=this.workerPolicy.maxWorkers)throw new Error("Resident worker capacity e\
xceeded");const s=new Set([...this.activeTasks.values()].map(c=>c.worker)),i=new Set(this.workerAffinities.values());let o=this.
workers.find(c=>!s.has(c)&&!i.has(c));if(!o&&this.workers.length<this.workerPolicy.maxWorkers&&(o=this._spawnWorker()),!o)
throw new Error("No unassigned worker available for resident session");this.workerAffinities.set(n,o),this.residentWorkerAffinities.
add(n);let a;try{if(await Promise.race([this.workerBootstrap.get(o)?.promise,new Promise((c,l)=>{a=setTimeout(()=>l(this.
_createRequiredWorkerError("resident worker readiness timed out")),this.config.workerBootstrapTimeoutMs)})]),!this.workers.
includes(o)||this.workerBootstrap.get(o)?.protocolVersion!==2)throw this._createRequiredWorkerError("resident worker nee\
ds managed task protocol version 2");return this.getWorkerAffinityState(n)}catch(c){if(c.workerTerminated=this._removeWorker(
o),c.workerTerminated)this.residentWorkerAffinities.delete(n),this.workerAffinities.delete(n);else throw this.workerTerminationFailures.
get(o);throw c}finally{clearTimeout(a)}}getWorkerAffinityState(e){const t=this.workerAffinities.get(e);return{affinityKey:e,
reserved:this.residentWorkerAffinities.has(e),workerId:t?this._workerId(t):null}}async terminateWorkerAffinity(e,{reason:t="\
Resident runtime terminated"}={}){if(!this.residentWorkerAffinities.has(e))throw new Error("Cannot terminate an unreserv\
ed worker affinity");const n=this.workerAffinities.get(e);if(n&&!this._removeWorker(n))throw this.workerTerminationFailures.
get(n);const s=Object.assign(new Error(String(t)),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0});for(const[
i,o]of this.activeTasks)o.payload?.affinityKey===e&&(this.activeTasks.delete(i),this._recordTaskCompletion(o,{ok:!1,mode:"\
worker"}),o.reject(s));return this.taskQueue=this.taskQueue.filter(i=>i.payload?.affinityKey!==e?!0:(this._recordTaskCompletion(
i,{ok:!1,mode:"queued"}),i.reject(s),!1)),this._ensureTargetWorkers({reason:"resident-runtime-terminated"}),this._scheduleNext(),
{affinityKey:e,workerTerminated:!0}}async releaseWorkerAffinity(e){const t=this.workerTerminationFailures.get(this.workerAffinities.
get(e));if(t)throw t;if([...this.activeTasks.values(),...this.taskQueue].some(n=>n.payload?.affinityKey===e))throw new Error(
"Cannot release a worker affinity while its task is active");this.residentWorkerAffinities.delete(e),this.workerAffinities.
delete(e),this._retireIdleWorkers(),this._scheduleNext()}cancelTaskGraph(e,t="cancelTaskGraph"){const n=String(e||"").trim(),
s=this.activeTaskGraphs.get(n);return s?(s.cancelled=!0,s.reason=String(t||"cancelTaskGraph"),{schema:Kc,graphId:n,status:"\
cancel-requested",cancelled:!0,reason:s.reason}):{schema:Kc,graphId:n||null,status:"not-found",cancelled:!1,reason:String(
t||"cancelTaskGraph")}}listActiveTaskGraphs(){return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:yp,graphId:e.
graphId,status:e.cancelled?"cancel-requested":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.
placementPolicy?JSON.parse(JSON.stringify(e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.
reason||null}))}getTaskGraphCacheArtifact(e){const t=String(e||"").trim(),n=this.taskGraphCacheArtifacts.get(t);return n?
se(n):null}listTaskGraphCacheArtifacts(){return Array.from(this.taskGraphCacheArtifacts.values()).map(e=>se(e)).sort((e,t)=>String(
e.cacheKey||"").localeCompare(String(t.cacheKey||"")))}importRemoteTaskGraphCacheResult(e={},t={},n={}){const s=e?.cacheArtifact&&
typeof e.cacheArtifact=="object"?e.cacheArtifact:null,i=String(s?.cacheKey||e?.cacheKey||t?.cacheKey||"").trim();if(!i)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires a cacheKey");if(!s)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires result.cacheArtifact");if(t?.
admitted!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const y=new Error(`Remote task graph cache artifact is no\
t admitted: ${i}`);throw y.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTED",y.cacheKey=i,y}const o=Date.now(),a=s.
storedAt||e.cachedAt||o,c=s.expiresAt||null,l=ae(e?.graphLeaseSpec?.retainedBufferRefs,e?.cacheInputs?.retainedBufferRefs,
s?.inputs?.retainedBufferRefs),u={schema:hy,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,status:l.length>
0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:l.length>0?"remote-gpu-resident-re\
fs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:e?.graphLeaseSpec?.laneId||e?.
graphLease?.laneId||null,stateKey:e?.graphLeaseSpec?.stateKey||e?.graphLease?.stateKey||null,retainedBufferRefs:l,graphLeaseStatus:e?.
graphLeaseStatus||null,graphLeaseRequired:e?.graphLeaseRequired===!0},d={schema:su,status:"admitted",admitted:!0,authority:t.
authority||"node-kernel-state-manager",admissionId:t.admissionId||null,validatorId:t.validatorId||null,reason:t.reason||
"remote-task-graph-cache-artifact-admitted",invalidationRefs:ae(t.invalidationRefs,s.invalidationRefs),acceptedAt:t.acceptedAt||
t.admittedAt||o},h={schema:wp,status:"imported-admitted-remote-cache-result",cacheKey:i,graphId:e?.graphId||s.graphId||null,
sourcePeerId:n.sourcePeerId||t.sourcePeerId||null,responderId:n.responderId||t.responderId||null,requestId:n.requestId||
t.requestId||null,admissionId:t.admissionId||null,importedAt:o,remoteArtifactStatus:s.status||null,remoteArtifactAdmitted:s.
admitted===!0,retainedGpuLaneRefs:u,retainedGpuLaneRefsStatus:u.status,resultHash:s.resultHash||null,inputHash:s.inputHash||
e?.cacheInputHash||null},p={...se(s),cacheKey:i,status:"admitted-remote-cache-artifact-recorded",admitted:!0,admission:d,
stateAdmission:se(t),remoteCacheImport:h,remoteGraphLeaseRefs:u},g={...se(e),cacheKey:i,cacheAdmission:d,cacheAdmissionStatus:d.
status,cacheArtifact:se(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.schema||null,cacheStatus:"remote-imported",
cacheHit:!1,remoteTaskGraphCacheImport:h,remoteGraphLeaseRefs:u};return this.taskGraphCacheArtifacts.set(i,se(p)),this.taskGraphCache.
set(i,{storedAt:a,expiresAt:c,artifact:se(p),result:se(g)}),this.stats.taskGraphRemoteCacheImports+=1,se(h)}evaluateRemoteTaskGraphStateSeedPolicy(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim(),i=Date.now(),o=s&&this.taskGraphCache.
get(s)||null,a=s&&(this.taskGraphCacheArtifacts.get(s)||o?.artifact)||null,c=o?.result||null,l=c?.remoteTaskGraphCacheImport||
a?.remoteCacheImport||null,u=Y(c?.stateSeedPayload,c?.stateSeed,c?.warmStateSeed,a?.stateSeedPayload,a?.stateSeed,a?.outputs?.
stateSeed,n?.stateSeedPayload,n?.stateSeed),d=c?.remoteGraphLeaseRefs||a?.remoteGraphLeaseRefs||l?.retainedGpuLaneRefs||
null,h=Qi(c?.cacheInputs?.stateFamilies,c?.cachePolicy?.inputs?.stateFamilies,a?.inputs?.stateFamilies,a?.cacheInputs?.stateFamilies,
n?.stateFamilies),p=Qi(c?.cacheInputs?.readFamilies,c?.cachePolicy?.inputs?.readFamilies,a?.inputs?.readFamilies,a?.cacheInputs?.
readFamilies,n?.readFamilies),g=Qi(c?.cacheInputs?.writeFamilies,c?.cachePolicy?.inputs?.writeFamilies,a?.inputs?.writeFamilies,
a?.cacheInputs?.writeFamilies,n?.writeFamilies),y=ae(n?.allowedStateFamilies??n?.allowedFamilies,[]),m=Qi(d?.retainedBufferRefs,
c?.graphLeaseSpec?.retainedBufferRefs,c?.cacheInputs?.retainedBufferRefs,a?.inputs?.retainedBufferRefs,n?.retainedBufferRefs),
f=d?.usableLocally===!0&&d?.remoteOnly!==!0,b=l?.schema===wp||c?.cacheStatus==="remote-imported"||a?.status==="admitted-\
remote-cache-artifact-recorded",w=a?.admitted===!0,k=n?.requireStateFamilies!==!1,x=y.length>0?h.filter(D=>!y.includes(D)):
[];let A="state-family-not-evaluated";h.length===0?A=k?"state-family-missing":"state-family-not-declared":y.length===0?A=
"state-family-policy-not-declared":x.length>0?A="state-family-blocked":A="state-family-allowed";let S="policy-ready",E="\
remote-cache-import-admitted-for-local-policy";s?!o&&!a?(S="blocked-cache-miss",E="cache-entry-not-found"):w?b?A==="stat\
e-family-missing"?(S="blocked-missing-state-families",E="remote-import-did-not-declare-state-families"):A==="state-famil\
y-policy-not-declared"?(S="blocked-missing-state-family-policy",E="allowed-state-family-policy-is-required"):A==="state-\
family-blocked"&&(S="blocked-state-family-policy",E="remote-import-declares-state-families-outside-policy"):(S="blocked-\
not-remote-import",E="cache-entry-did-not-originate-from-admitted-remote-task-graph-import"):(S="blocked-unadmitted-cach\
e-artifact",E="cache-artifact-is-not-admitted"):(S="blocked-no-cache-key",E="remote-state-seed-policy-requires-cache-key");
const _=S==="policy-ready",I=n?.allowWarmStateSeed===!0,M=n?.allowHotBufferRefresh===!0,T=I?_?"warm-state-seed-allowed":
"warm-state-seed-blocked":"warm-state-seed-not-requested";let $=M?"no-retained-buffer-refs":"hot-buffer-refresh-not-requ\
ested";return M&&!_?$="hot-buffer-refresh-blocked":M&&m.length>0&&f?$="local-buffer-refs-usable":M&&m.length>0&&($="loca\
l-refresh-required"),{schema:q4,status:S,reason:E,cacheKey:s||null,requestedAt:i,cacheEntryPresent:o!=null,artifactPresent:a!=
null,admitted:w,remoteImported:b,importStatus:l?.status||null,importSchema:l?.schema||null,importReport:l?se(l):null,stateFamilies:h,
readFamilies:p,writeFamilies:g,stateSeedPayloadAvailable:u!=null,stateSeedPayload:u!=null?se(u):null,allowedStateFamilies:y,
disallowedStateFamilies:x,stateFamilyStatus:A,warmStateSeedRequested:I,warmStateSeedStatus:T,hotBufferRefreshRequested:M,
hotBufferRefreshStatus:$,retainedBufferRefs:m,remoteRetainedRefsUsableLocally:f,remoteGraphLeaseRefs:d?se(d):null}}admitTaskGraphCacheArtifact(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("admitTask\
GraphCacheArtifact requires a cacheKey");const i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||i?.artifact||
null;if(!o)return null;const a=se(n||{}),c=a.admittedAt||a.acceptedAt||Date.now(),l={schema:su,status:"admitted",admitted:!0,
authority:a.authority||"state-manager",admissionId:a.admissionId||null,validatorId:a.validatorId||null,reason:a.reason||
"state-manager-cache-artifact-admitted",invalidationRefs:ae(a.invalidationRefs),acceptedAt:c},u=o.admitted===!0,d={...se(
o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:l,stateAdmission:a};if(this.taskGraphCacheArtifacts.set(
s,se(d)),i){const h=se(i.result||{});h.cacheAdmission=l,h.cacheAdmissionStatus=l.status,h.cacheArtifact=se(d),h.cacheArtifactStatus=
d.status,h.cacheArtifactSchema=d.schema||null,this.taskGraphCache.set(s,{...i,artifact:se(d),result:h})}return u||(this.
stats.taskGraphCacheArtifactsAdmitted+=1),se(d)}invalidateTaskGraphCacheArtifact(e,t={}){const n=e&&typeof e=="object"?e:
t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires\
 a cacheKey");const i=se(n||{}),o=this.taskGraphCache.get(s),a=this.taskGraphCacheArtifacts.get(s)||o?.artifact||null;if(this.
taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!a)return{cacheKey:s,status:"invalidated",admitted:!1,
invalidation:i};const c={...se(a),status:"invalidated",admitted:!1,invalidation:i,invalidatedAt:i.invalidatedAt||Date.now()};
return this.taskGraphCacheArtifacts.set(s,se(c)),se(c)}configurePlacementHooks(e={}){const t=d=>Object.prototype.hasOwnProperty.
call(e,d),n=(...d)=>{for(const h of d)if(t(h))return{found:!0,value:e[h]};return{found:!1,value:void 0}},s=n("placementE\
xecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=typeof s.value=="function"||s.value?.submitTask?
s.value:null,this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||Yc(this.placementExecutor)):
(t("placementExecutorId")||t("remotePlacementExecutorId")||t("executorId"))&&(this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||Yc(this.placementExecutor));const i=n("placementAdmission","remotePlacementAd\
mission","admission");i.found?(this.placementAdmission=typeof i.value=="function"||i.value?.admitTask?i.value:null,this.
placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||Zc(this.placementAdmission)):(t(
"placementAdmissionId")||t("remotePlacementAdmissionId")||t("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||Zc(this.placementAdmission));const o=n("placementResultValidator","remotePl\
acementResultValidator","resultValidator","validator");o.found?(this.placementResultValidator=typeof o.value=="function"||
o.value?.validateTaskResult||o.value?.validateResult?o.value:null,this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||el(this.placementResultValidator)):(t("placement\
ResultValidatorId")||t("remotePlacementResultValidatorId")||t("resultValidatorId")||t("validatorId"))&&(this.placementResultValidatorId=
e.placementResultValidatorId||e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||el(this.placementResultValidator));
const a=n("placementTaskSigner","remoteTaskSigner","taskSigner","signer");a.found?(this.placementTaskSigner=typeof a.value==
"function"||a.value?.signTaskPacket||a.value?.signEnvelope?a.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||tl(this.placementTaskSigner)):(t("placementTaskSignerId")||t("remoteTa\
skSignerId")||t("taskSignerId")||t("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||tl(this.placementTaskSigner)),(t("placementTimeoutMs")||t("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=J(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(t("remoteResultV\
erification")||t("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const c={...this.placementRetryPolicy},l=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},u=d=>Object.prototype.
hasOwnProperty.call(l,d)||Object.prototype.hasOwnProperty.call(e,d);return(u("maxAttempts")||u("placementMaxAttempts")||
u("remotePlacementMaxAttempts"))&&(c.maxAttempts=J(l.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,c.
maxAttempts,1,100)),(u("baseDelayMs")||u("placementRetryBaseDelayMs")||u("remotePlacementRetryBaseDelayMs"))&&(c.baseDelayMs=
J(l.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,c.baseDelayMs,0,6e5)),(u("maxDelayMs")||
u("placementRetryMaxDelayMs")||u("remotePlacementRetryMaxDelayMs"))&&(c.maxDelayMs=J(l.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,c.maxDelayMs,0,6e5)),(u("jitterFraction")||u("placementRetryJitterFraction")||u("remote\
PlacementRetryJitterFraction"))&&(c.jitterFraction=ct(l.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
c.jitterFraction,0,1)),(u("retryableErrorKinds")||u("placementRetryableErrorKinds")||u("remotePlacementRetryableErrorKin\
ds"))&&(c.retryableErrorKinds=ae(l.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
c.retryableErrorKinds||Rn)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(c),this.getCapabilities()}getCapabilities(){
return{...this.capabilities,resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy(),workers:this.workers.
length,targetWorkers:this.targetWorkerCount,minWorkers:this.workerPolicy.minWorkers,maxWorkers:this.workerPolicy.maxWorkers,
solverCount:this.solverRegistry.list().length,placementExecutor:!!this.placementExecutor,placementExecutorId:this.placementExecutorId,
placementAdmission:!!this.placementAdmission,placementAdmissionId:this.placementAdmissionId,placementResultValidator:!!this.
placementResultValidator,placementResultValidatorId:this.placementResultValidatorId,placementTaskSigner:!!this.placementTaskSigner,
placementTaskSignerId:this.placementTaskSignerId,placementTimeoutMs:this.placementTimeoutMs,placementRetryPolicy:this._getPlacementRetryPolicyReport(),
remoteResultVerification:this.remoteResultVerification,affinityCount:this.workerAffinities.size,activeTaskCount:this.activeTasks.
size,queuedTaskCount:this.taskQueue.length,workerSpawnFailures:this.workerSpawnFailures,workerRetirements:this.workerRetirements,
workerPoolRevision:this.workerPoolRevision,lastWorkerResize:JSON.parse(JSON.stringify(this.lastWorkerResize)),workerResizeHistory:JSON.
parse(JSON.stringify(this.workerResizeHistory)),workerAutoScaleHold:this._getWorkerAutoScaleHoldStatus(),workerRequirement:this.
_getWorkerRequirementReport(),gpuResidentLanes:this.getGpuResidentLaneStats(),stats:this.getStats()}}getStats(){const e=Math.
max(1,this.workers.length||this.targetWorkerCount||this.workerPolicy.targetWorkers||1),t=(this.activeTasks.size+this.taskQueue.
length)/e;return{schema:this.stats.schema,totalTasksSubmitted:this.stats.totalTasksSubmitted,totalTasksCompleted:this.stats.
totalTasksCompleted,totalTasksFailed:this.stats.totalTasksFailed,inlineTasksCompleted:this.stats.inlineTasksCompleted,workerTasksCompleted:this.
stats.workerTasksCompleted,remoteTasksCompleted:this.stats.remoteTasksCompleted,remoteTasksFailed:this.stats.remoteTasksFailed,
remoteTasksTimedOut:this.stats.remoteTasksTimedOut,remoteTasksRejected:this.stats.remoteTasksRejected,remoteTasksVerificationFailed:this.
stats.remoteTasksVerificationFailed,remoteTasksValidationFailed:this.stats.remoteTasksValidationFailed,remoteTaskAttempts:this.
stats.remoteTaskAttempts,remoteTasksRetried:this.stats.remoteTasksRetried,remoteTasksRetryExhausted:this.stats.remoteTasksRetryExhausted,
taskGraphsSubmitted:this.stats.taskGraphsSubmitted,taskGraphsCompleted:this.stats.taskGraphsCompleted,taskGraphsFailed:this.
stats.taskGraphsFailed,taskGraphsCancelled:this.stats.taskGraphsCancelled,taskGraphCacheHits:this.stats.taskGraphCacheHits,
taskGraphCacheWrites:this.stats.taskGraphCacheWrites,taskGraphCacheArtifactsWritten:this.stats.taskGraphCacheArtifactsWritten,
taskGraphCacheArtifactsAdmitted:this.stats.taskGraphCacheArtifactsAdmitted,taskGraphRemoteCacheImports:this.stats.taskGraphRemoteCacheImports,
taskGraphRemoteCacheImportBlocked:this.stats.taskGraphRemoteCacheImportBlocked,taskGraphCacheInvalidations:this.stats.taskGraphCacheInvalidations,
taskGraphCacheReadBlocked:this.stats.taskGraphCacheReadBlocked,averageTaskDuration:this.stats.averageTaskDurationMs,averageTaskDurationMs:this.
stats.averageTaskDurationMs,lastTaskDurationMs:this.stats.lastTaskDurationMs,minTaskDurationMs:this.stats.minTaskDurationMs,
maxTaskDurationMs:this.stats.maxTaskDurationMs,currentLoad:Number(t.toFixed(4)),activeTaskCount:this.activeTasks.size,activeTaskGraphCount:this.
activeTaskGraphs.size,queuedTaskCount:this.taskQueue.length,taskGraphCacheSize:this.taskGraphCache.size,taskGraphCacheArtifactCount:this.
taskGraphCacheArtifacts.size,workerCount:this.workers.length,targetWorkers:this.targetWorkerCount,workerPoolRevision:this.
workerPoolRevision,lastWorkerResize:JSON.parse(JSON.stringify(this.lastWorkerResize)),workerResizeHistory:JSON.parse(JSON.
stringify(this.workerResizeHistory)),workerAutoScaleHold:this._getWorkerAutoScaleHoldStatus(),workerRequirement:this._getWorkerRequirementReport(),
workerUtilization:this._getWorkerUtilizationReport(),activeTaskGraphs:this.listActiveTaskGraphs(),gpuResidentLanes:this.
getGpuResidentLaneStats(),taskPlacement:JSON.parse(JSON.stringify(this.stats.taskPlacement)),lastCompletedAt:this.stats.
lastCompletedAt,byRuntime:JSON.parse(JSON.stringify(this.stats.byRuntime)),byTaskFamily:JSON.parse(JSON.stringify(this.stats.
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:Cs,maxAttempts:J(e?.maxAttempts,
1,1,100),baseDelayMs:J(e?.baseDelayMs,0,0,6e5),maxDelayMs:J(e?.maxDelayMs,0,0,6e5),jitterFraction:ct(e?.jitterFraction,0,
0,1),retryableErrorKinds:ae(e?.retryableErrorKinds,Rn),terminalErrorKinds:[...Hi]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,t=null){const n=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return n.name="RequiredWorkerUnavailableError",n.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",n.reason=e,t!=null&&(n.cause=t),n}_failRequiredWorkerPool(e){const t=e?.code==="ERR_COMPUTE_RE\
QUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError(e?.message||String(e||"the required worker pool failed"),e);
this.workerRequirementError=t,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;for(const n of[
...this.workers])this._markWorkerBootstrapFailed(n,t),this._removeWorker(n);for(const[n,s]of this.activeTasks.entries())
this.workers.includes(s.worker)||this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(s,t.code),this._recordTaskCompletion(
s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:t.message}),s.reject(Object.
assign(new Error(t.message),{name:t.name,code:t.code,workerTerminated:!this.workers.includes(s.worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(
t),t}_createWorkerBootstrapRecord(e){let t=null,n=null;const s={status:"bootstrapping",startedAt:ft(),readyAt:null,reason:null,
promise:null,resolve:null,reject:null,timeout:null,messageErrorListener:null};if(s.promise=new Promise((i,o)=>{t=i,n=o}),
s.promise.catch(()=>{}),s.resolve=t,s.reject=n,this.workerBootstrap.set(e,s),this.config.requireWorkers){const i=this.config.
workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(
`worker bootstrap did not acknowledge readiness within ${i}ms`))},i)}return s}_markWorkerBootstrapped(e){const t=this.workerBootstrap.
get(e);!t||t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="ready",t.readyAt=ft(),t.resolve?.(
e))}_markWorkerBootstrapFailed(e,t){const n=this.workerBootstrap.get(e);!n||n.status!=="bootstrapping"||(clearTimeout(n.
timeout),n.timeout=null,n.status="failed",n.reason=t?.message||String(t||"worker bootstrap failed"),n.reject?.(t instanceof
Error?t:this._createRequiredWorkerError(n.reason)))}_markWorkerBootstrapRetired(e){const t=this.workerBootstrap.get(e);!t||
t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="retired",t.reason="worker retired before b\
ootstrap completed",t.resolve?.(e))}_getWorkerRequirementReport(){const e=this.workers.filter(s=>this.workerBootstrap.get(
s)?.status==="ready").length,t=this.workers.filter(s=>this.workerBootstrap.get(s)?.status==="bootstrapping").length,n=this.
config.requireWorkers===!0;return{required:n,status:this.workerRequirementError?"blocked":n?e>0&&e===this.workers.length?
"ready":"bootstrapping":"not-required",workerCount:this.workers.length,readyWorkerCount:e,bootstrappingWorkerCount:t,reason:this.
workerRequirementError?.message||null}}async _waitForRequiredWorkerBootstrap(){const e=this.workers.map(t=>this.workerBootstrap.
get(t)).filter(Boolean);if(e.length===0)throw this._createRequiredWorkerError("no browser worker was registered during b\
ootstrap");await Promise.all(e.map(t=>t.promise))}_rejectQueuedTasksForRequiredWorkerFailure(e){for(;this.taskQueue.length>
0;){const t=this.taskQueue.shift();this._rejectTaskGpuResidentLaneLease(t,e.code||"required-worker-unavailable"),this._recordTaskCompletion(
t,{ok:!1,mode:"worker",errorKind:"required-worker-unavailable",errorMessage:e.message}),t.reject(Object.assign(new Error(
e.message),{name:e.name,code:e.code,workerTerminated:!this.workerAffinities.has(t.payload?.affinityKey)}))}}_canDispatchRemotePlacement(e={}){
return!!this.placementExecutor&&e.advisoryOnly===!1&&(e.requestedPlacement==="peer"||e.requestedPlacement==="cluster")}_createTaskPacket(e={},t={}){
const n={runtime:e.runtime,module:e.module,hostModule:e.hostModule,exportName:e.exportName,hostExport:e.hostExport,fn:e.
fn,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source},s={data:e.data,args:e.args,webgpu:e.webgpu,gpuFence:e.gpuFence,gpuResidentLane:e.
gpuResidentLane,placement:t},i=Ks(Hs(n)),o=Ks(Hs(s)),a=Ks(Hs({codeHash:i,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:t?.requestedPlacement||null}));return{schema:bp,taskId:e.id||null,runtime:e.runtime||
null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:t?.requestedPlacement||null,gpuFenceRequired:e.
gpuFence?.required===!0,gpuFenceSchema:e.gpuFence?.schema||null,gpuLaneId:e.gpuFence?.laneId||null,gpuStateKey:e.gpuFence?.
stateKey||null,gpuQueueFencePolicy:e.gpuFence?.queueFencePolicy||null,gpuResidentLaneSchema:e.gpuResidentLane?.schema||null,
gpuResidentLaneLocalExecution:e.gpuResidentLane?.localExecution||null,codeHash:i,inputHash:o,taskHash:a,hashAlgorithm:"f\
nv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{signed:!1,reason:e===
!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"custom-signa\
ture"};if(typeof e=="object"){const t=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!t,signature:t,signatureAlgorithm:e.
signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(t?"signed":"no-signature")}}return{signed:!0,signature:String(
e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:t=null}={}){const n=e.payload?.
taskPacket||null,s=e.placement||e.payload?.placement||null,i={schema:gp,taskPacketSchema:n?.schema||null,taskPacket:n,mode:t,
signed:!1,signerId:null,signature:null,signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)
return i;const o={manager:this,task:e,placement:s,payload:e.payload,taskPacket:n,mode:t},a=this.placementTaskSigner,c=typeof a==
"function"?await a(n,o):a.signTaskPacket?await a.signTaskPacket(n,o):await a.signEnvelope(i,o),l=this._normalizePlacementTaskSignature(
c);return{...i,...l,schema:l.schema||gp,taskPacket:n,signerId:l.signerId||this.placementTaskSignerId||"placement-task-si\
gner",signedAt:l.signedAt||Date.now()}}_normalizePlacementAdmissionResult(e){return e===!1?{accepted:!1,reason:"admissio\
n-denied"}:e==null||e===!0?{accepted:!0,reason:"accepted"}:typeof e=="object"?{...e,accepted:e.accepted!==!1&&e.ok!==!1,
reason:e.reason||(e.accepted===!1||e.ok===!1?"admission-denied":"accepted")}:{accepted:!0,reason:String(e||"accepted")}}_normalizePlacementValidationResult(e){
return e===!1?{valid:!1,reason:"validation-denied"}:e==null||e===!0?{valid:!0,reason:"validated"}:typeof e=="object"?{...e,
valid:e.valid!==!1&&e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.valid===!1||e.accepted===!1||e.ok===!1?"validation-de\
nied":"validated")}:{valid:!0,reason:String(e||"validated")}}async _runPlacementAdmission(e,{mode:t=null}={}){if(!this.placementAdmission)
return{accepted:!0,reason:"no-admission-hook",admissionId:null};const n={manager:this,task:e,placement:e.placement||e.payload?.
placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||null,mode:t},
s=typeof this.placementAdmission=="function"?await this.placementAdmission(e.payload,n):await this.placementAdmission.admitTask(
e.payload,n),i=this._normalizePlacementAdmissionResult(s);return{...i,schema:i.schema||"peercompute.compute.placement-ad\
mission.v0",admissionId:i.admissionId||this.placementAdmissionId||"placement-admission",mode:t,decidedAt:Date.now()}}async _runPlacementResultValidator(e,{
mode:t=null,finalResult:n=null,commitDelta:s=null,provenance:i=null}={}){if(!this.placementResultValidator)return{schema:mp,
valid:!0,reason:"no-result-validator",validationId:null,mode:t,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.
placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||
null,mode:t,finalResult:n,commitDelta:s,provenance:i},a=this.placementResultValidator,c=typeof a=="function"?await a(n,o):
a.validateTaskResult?await a.validateTaskResult(n,o):await a.validateResult(n,o),l=this._normalizePlacementValidationResult(
c);return{...l,schema:l.schema||mp,validationId:l.validationId||this.placementResultValidatorId||"placement-result-valid\
ator",mode:t,decidedAt:Date.now()}}_placementRejectedError(e,{mode:t}){const n=new Error(`Remote placement rejected for ${t}\
: ${e?.reason||"admission-denied"}`);return n.name="PlacementAdmissionRejectedError",n.code="ERR_COMPUTE_PLACEMENT_REJEC\
TED",n.placementMode=t,n.reason=e?.reason||"admission-denied",n.admission=e||null,n}_placementValidationError(e,t,{mode:n}){
const s=new Error(`Remote placement result validation failed for ${n}: ${e?.reason||"validation-denied"}`);return s.name=
"PlacementResultValidationError",s.code="ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=n,s.reason=e?.reason||"valida\
tion-denied",s.validation=e||null,s.provenance=t||null,s}_placementTimeoutFor(e){return J(e.placement?.timeoutMs??e.payload?.
placement?.timeoutMs??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){const t=e.placement||
e.payload?.placement||{},n=this.placementRetryPolicy||{},s=J(t.maxAttempts??t.retryMaxAttempts??t.remoteMaxAttempts??t.remoteRetryMaxAttempts??
n.maxAttempts,1,1,100),i=J(t.retryBaseDelayMs??t.remoteRetryBaseDelayMs??n.baseDelayMs,0,0,6e5),o=J(t.retryMaxDelayMs??t.
remoteRetryMaxDelayMs??n.maxDelayMs,i,0,6e5),a=ct(t.retryJitterFraction??t.remoteRetryJitterFraction??n.jitterFraction,0,
0,1);return this._getPlacementRetryPolicyReport({...n,maxAttempts:s,baseDelayMs:i,maxDelayMs:o,jitterFraction:a,retryableErrorKinds:ae(
t.retryableErrorKinds??t.remoteRetryableErrorKinds??n.retryableErrorKinds,Rn)})}_placementErrorKind(e){return e?.code===
"ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":e?.code==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":e?.code==="ERR_COMPUTE_P\
LACEMENT_VERIFICATION"?"verification-failed":e?.code==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-failed":"executor-\
error"}_placementRetryDelayMs(e,t){const n=J(t?.baseDelayMs,0,0,6e5),s=J(t?.maxDelayMs,n,0,6e5),i=Math.max(0,J(e,1,1,100)-
1),o=Math.min(s,n*2**i),a=ct(t?.jitterFraction,0,0,1);if(a<=0||o<=0)return o;const c=o*a*Math.random();return Math.min(s,
Math.round(o+c))}_placementRetryDecision({attempt:e,errorKind:t,err:n,policy:s,mode:i}){const o=new Set(ae(s?.retryableErrorKinds,
Rn)),a=new Set(Hi),c=J(s?.maxAttempts,1,1,100),l=a.has(t),u=!l&&o.has(t),d=e<c,h=u&&d;return{schema:Cs,mode:i,attempt:e,
nextAttempt:h?e+1:null,maxAttempts:c,errorKind:t,errorCode:n?.code||null,errorMessage:n?.message||String(n||""),retryable:u,
terminal:l,retryScheduled:h,exhausted:u&&c>1&&!d,delayMs:h?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{
mode:t,ok:n=!0,errorKind:s=null}={}){const i=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||
this._placementRetryPolicyFor(e),a=i.filter(l=>l.retryScheduled).length,c=i[i.length-1]||null;return{schema:Cs,mode:t,maxAttempts:o.
maxAttempts,attemptCount:J(e.placementAttempt,a+1,0,100),retryCount:a,retried:a>0,retryableErrorKinds:ae(o.retryableErrorKinds,
Rn),terminalErrorKinds:[...Hi],exhausted:!n&&!!c?.exhausted,finalErrorKind:n?null:s||c?.errorKind||null,events:JSON.parse(
JSON.stringify(i))}}_runPlacementExecutor(e,{signal:t=null,timeoutMs:n=this.placementTimeoutMs,mode:s=null,attempt:i=1,retryPolicy:o=null}={}){
const a={manager:this,task:e,placement:e.placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||
null,taskEnvelope:e.payload?.taskEnvelope||null,signal:t,timeoutMs:n,mode:s,attempt:i,retryPolicy:o};return typeof this.
placementExecutor=="function"?this.placementExecutor(e.payload,a):this.placementExecutor.submitTask(e.payload,a)}_runPlacementExecutorWithTimeout(e,{
mode:t,attempt:n=1,retryPolicy:s=null}={}){const i=this._placementTimeoutFor(e),o=typeof AbortController<"u"?new AbortController:
null,a=Promise.resolve().then(()=>this._runPlacementExecutor(e,{signal:o?.signal||null,timeoutMs:i,mode:t,attempt:n,retryPolicy:s}));
if(i<=0)return a;let c=null;const l=new Promise((u,d)=>{c=setTimeout(()=>{const h=new Error(`Placement executor timed ou\
t after ${i}ms for ${t}`);h.name="PlacementExecutorTimeoutError",h.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",h.timeoutMs=i,h.
placementMode=t;try{o?.abort?.(h)}catch{}d(h)},i)});return Promise.race([a,l]).finally(()=>{c!=null&&clearTimeout(c)})}_normalizeRemotePlacementProvenance(e,{
task:t,mode:n,result:s,finalResult:i,startedAt:o=null,completedAtMs:a=null,completedAt:c=Date.now()}={}){const l=e&&typeof e==
"object"?e:{},u=t?.payload||{},d=t?.placement||u.placement||{},h=Number.isFinite(Number(l.durationMs))?Number(l.durationMs):
Number.isFinite(Number(l.roundTripMs))?Number(l.roundTripMs):Number.isFinite(Number(o))&&Number.isFinite(Number(a))?Math.
max(0,Number(a)-Number(o)):null,p=s&&typeof s=="object"?s:{},g=i&&typeof i=="object"?i:{},y=t?.placementAdmission||null,
m=u.taskPacket||null,f=u.taskEnvelope||null,b=fT(l.replicas||l.replicaResults||l.quorum?.replicas||p.replicas||p.replicaResults),
w=Ji(l.gpuFence||l.gpuFenceReport||p.gpuFence||p.gpuFenceReport||g.gpuFence||g.gpuFenceReport||l.remoteExecution?.gpuFence||
l.remoteExecution?.gpuFenceReport||l.remoteExecution?.computeExecution?.gpuFence,u.gpuFence||m?.gpuFence||null);return{schema:$4,
taskPacketSchema:m?.schema||null,taskEnvelopeSchema:f?.schema||null,taskSigned:f?.signed===!0,signerId:l.signerId||f?.signerId||
null,signatureAlgorithm:l.signatureAlgorithm||f?.signatureAlgorithm||null,mode:n,executorId:l.executorId||this.placementExecutorId||
"placement-executor",promotedReplicaExecutorId:l.promotedReplicaExecutorId||null,admissionId:y?.admissionId||null,admissionReason:y?.
reason||null,requestedPlacement:d.requestedPlacement||null,taskId:u.id||t?.id||null,taskFamily:u.taskFamily||t?.taskFamily||
null,solverId:u.solverId||d.solverId||null,solverKey:d.solverKey||null,peerId:l.peerId||l.remotePeerId||null,targetPeerId:l.
targetPeerId||null,transportPeerId:l.transportPeerId||null,responderNodeId:l.responderNodeId||null,responderPeerId:l.responderPeerId||
null,requesterId:l.requesterId||null,requestId:l.requestId||null,clusterId:l.clusterId||null,workerId:l.workerId||l.remoteWorkerId||
null,remoteExecution:l.remoteExecution&&typeof l.remoteExecution=="object"?JSON.parse(JSON.stringify(l.remoteExecution)):
null,gpuFence:w,gpuFenceStatus:w?.status??null,gpuFenceSatisfied:w?.fenceSatisfied??!1,codeHash:l.codeHash||p.codeHash||
m?.codeHash||null,inputHash:l.inputHash||p.inputHash||m?.inputHash||null,taskHash:l.taskHash||p.taskHash||m?.taskHash||null,
outputHash:l.outputHash||p.outputHash||null,resultHash:l.resultHash||p.resultHash||l.outputHash||p.outputHash||null,commitDeltaHash:l.
commitDeltaHash||p.commitDeltaHash||l.deltaHash||p.deltaHash||null,resultSchema:l.resultSchema||g.schema||p.schema||null,
role:l.role||null,trustLevel:l.trustLevel||"injected-executor",redundantPlacement:l.redundantPlacement&&typeof l.redundantPlacement==
"object"?JSON.parse(JSON.stringify(l.redundantPlacement)):null,primary:l.primary&&typeof l.primary=="object"?JSON.parse(
JSON.stringify(l.primary)):null,primaryFailure:l.primaryFailure&&typeof l.primaryFailure=="object"?JSON.parse(JSON.stringify(
l.primaryFailure)):null,promotedReplica:l.promotedReplica&&typeof l.promotedReplica=="object"?JSON.parse(JSON.stringify(
l.promotedReplica)):null,replicaSuccessCount:J(l.replicaSuccessCount,0,0,1e6),replicaFailureCount:J(l.replicaFailureCount,
0,0,1e6),redundantReplicaCount:J(l.redundantReplicaCount??b.length,b.length,0,1e6),replicaCount:b.length,quorumReplicaCount:J(
l.quorumReplicaCount??b.length,b.length,0,1e6),replicas:b,validated:l.validated===!0,durationMs:h==null?null:Number(h.toFixed(
3)),completedAt:c}}_verifyRemotePlacementProvenance(e={},t={}){const n=t?.payload?.taskPacket||null,s=Date.now();if(!this.
remoteResultVerification)return{schema:Hc,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!n||n.schema!==
bp)return{schema:Hc,verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:n?.schema||null,mismatchFields:[
"taskPacket"],checks:[],checkedAt:s};const i=["codeHash","inputHash","taskHash"].map(c=>{const l=n[c]||null,u=e?.[c]||null;
return{field:c,expected:l,actual:u,ok:!!l&&l===u}});n.gpuFenceRequired===!0&&i.push({field:"gpuFence",expected:"fence-sa\
tisfied",actual:e?.gpuFence?.status||null,ok:e?.gpuFence?.fenceSatisfied===!0});const o=i.filter(c=>!c.ok).map(c=>c.field),
a=o.length===0?"hashes-match":o.includes("gpuFence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:Hc,
verified:o.length===0,skipped:!1,reason:a,taskPacketSchema:n.schema,hashAlgorithm:n.hashAlgorithm||null,mismatchFields:o,
checks:i,checkedAt:s}}_placementVerificationError(e,t,{mode:n}){const s=new Error(`Remote placement verification failed \
for ${n}: ${e?.reason||"hash-mismatch"}`);return s.name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT\
_VERIFICATION",s.placementMode=n,s.reason=e?.reason||"hash-mismatch",s.verification=e||null,s.provenance=t||null,s}_unwrapPlacementExecutorResult(e,t,{
mode:n,startedAt:s}){let i=e,o=null,a=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&
(o=e.commitDelta),a=e.provenance||e.remoteProvenance||e.placementProvenance||null;const h=Object.prototype.hasOwnProperty.
call(e,"commitDelta")||a||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(
e,"placementProvenance");h&&Object.prototype.hasOwnProperty.call(e,"value")?i=e.value:h&&Object.prototype.hasOwnProperty.
call(e,"result")&&(i=e.result)}const c=Date.now(),l=ft(),u=this._normalizeRemotePlacementProvenance(a,{task:t,mode:n,result:e,
finalResult:i,startedAt:s,completedAtMs:l,completedAt:c}),d=this._verifyRemotePlacementProvenance(u,t);if(u.verification=
d,u.verified=d.verified,!d.verified)throw this._placementVerificationError(d,u,{mode:n});return{finalResult:i,commitDelta:o,
provenance:u}}async _runRemotePlacementWithRetries(e,{mode:t}){const n=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
n,e.placementRetryEvents=[];for(let i=1;i<=n.maxAttempts;i+=1){e.placementAttempt=i,this._recordPlacementAttempt(e,{mode:t,
attempt:i,retryPolicy:n});const o=ft();try{const a=await this._runPlacementExecutorWithTimeout(e,{mode:t,attempt:i,retryPolicy:n}),
{finalResult:c,commitDelta:l,provenance:u}=this._unwrapPlacementExecutorResult(a,e,{mode:t,startedAt:o}),d=await this._runPlacementResultValidator(
e,{mode:t,finalResult:c,commitDelta:l,provenance:u});if(u.validation=d,!d.valid)throw this._placementValidationError(d,u,
{mode:t});return u.retry=this._placementRetrySummary(e,{mode:t,ok:!0}),{finalResult:c,commitDelta:l,provenance:u}}catch(a){
const c=this._placementErrorKind(a),l=this._placementRetryDecision({attempt:i,errorKind:c,err:a,policy:n,mode:t});if(a.retry=
l,e.placementRetryEvents.push(l),!l.retryScheduled)throw a;this._recordPlacementRetry(e,{mode:t,retry:l}),await eT(l.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${t}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=t,s.retry=this._placementRetrySummary(e,{mode:t,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){const t=e.placement||e.payload?.placement||{};if(!this._canDispatchRemotePlacement(
t))return!1;const n=`remote-${t.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(e.payload,t);const s={...e,
startedAt:ft(),executionMode:n,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.placementAdmissionId,
placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(s,{mode:n})).
then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:n})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:n});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:n})).then(({finalResult:i,commitDelta:o,provenance:a})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:n,provenance:a,admission:s.placementAdmission,retry:a.retry||this._placementRetrySummary(s,{mode:n,ok:!0})}),s.resolve(
i)}).catch(i=>{const o=this._placementErrorKind(i),a=i?.retry?.schema===Cs?this._placementRetrySummary(s,{mode:n,ok:!1,errorKind:o}):
null;this._recordTaskCompletion(s,{ok:!1,mode:n,errorKind:o,errorMessage:i?.message||String(i),admission:s.placementAdmission||
i?.admission||null,provenance:i?.provenance||null,retry:a}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this.
_scheduleIdleScaleDown(),this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,
{type:"module"}):D4();this._createWorkerBootstrapRecord(e);const t=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const n=`\
worker-${t}`;if(this.workerIds.set(e,n),this.workerUtilization.set(n,rl({executorId:n,kind:"worker",ordinal:t,status:"ac\
tive"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),i=o=>this._handleWorkerFailure(e,o);s&&(s.messageErrorListener=i),e.addEventListener(
"messageerror",i)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:t="worker",ordinal:n=null,status:s="active"}={}){const i=String(e||this.inlineExecutorId);
return this.workerUtilization.has(i)||this.workerUtilization.set(i,rl({executorId:i,kind:t,ordinal:n,status:s})),this.workerUtilization.
get(i)}_executorBucket(e,t){const n=String(t||"unknown");return e[n]||(e[n]=Xc()),e[n]}_recordExecutorStart(e,t,{kind:n="\
worker"}={}){const s=this._executorStats(e,{kind:n}),i=t.runtime||t.payload?.runtime||"unknown",o=t.taskFamily||t.payload?.
taskFamily||"unknown";s.status=s.status==="retired"?"retired":"active",s.activeTaskCount+=1,s.submitted+=1,s.lastRuntime=
i,s.lastTaskFamily=o,s.lastStartedAt=Date.now(),this._executorBucket(s.byRuntime,i).submitted+=1,this._executorBucket(s.
byTaskFamily,o).submitted+=1,t.executorId=s.executorId,t.executorActive=!0}_recordExecutorCompletion(e,{ok:t=!0,durationMs:n=0}={}){
const s=e.executorId;if(!s)return;const i=this.workerUtilization.get(s);if(!i)return;e.executorActive&&(i.activeTaskCount=
Math.max(0,i.activeTaskCount-1),e.executorActive=!1);const o=e.runtime||e.payload?.runtime||"unknown",a=e.taskFamily||e.
payload?.taskFamily||"unknown",c=this._executorBucket(i.byRuntime,o),l=this._executorBucket(i.byTaskFamily,a);t?(i.completed+=
1,c.completed+=1,l.completed+=1):(i.failed+=1,c.failed+=1,l.failed+=1);const u=Number(Math.max(0,n).toFixed(3));i.totalDurationMs+=
n,i.lastDurationMs=u,i.maxDurationMs=Math.max(i.maxDurationMs,u);const d=i.completed+i.failed;i.averageDurationMs=d>0?Number(
(i.totalDurationMs/d).toFixed(3)):0,i.lastRuntime=o,i.lastTaskFamily=a,i.lastCompletedAt=Date.now();for(const h of[c,l]){
h.totalDurationMs+=n,h.lastDurationMs=u,h.maxDurationMs=Math.max(h.maxDurationMs,u);const p=h.completed+h.failed;h.averageDurationMs=
p>0?Number((h.totalDurationMs/p).toFixed(3)):0}}_recordExecutorAbandon(e){const t=e.executorId;if(!t||!e.executorActive)
return;const n=this.workerUtilization.get(t);n&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),n.abandoned+=1,e.executorActive=
!1)}_cloneExecutorStats(e){return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(d=>d.kind==="worker").sort((d,h)=>(d.ordinal??0)-(h.ordinal??
0)).map(d=>this._cloneExecutorStats(d)),t=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),n=e.filter(d=>d.status==="active"),s=e.filter(d=>d.status==="retired"),i=[t,...e],o=e.reduce((d,h)=>d+(h.
activeTaskCount||0),0),a=i.reduce((d,h)=>d+(h.submitted||0),0),c=i.reduce((d,h)=>d+(h.completed||0),0),l=i.reduce((d,h)=>d+
(h.failed||0),0),u=[...i].sort((d,h)=>(h.activeTaskCount||0)-(d.activeTaskCount||0)||(h.completed||0)-(d.completed||0)||
(h.submitted||0)-(d.submitted||0))[0]||t;return{schema:P4,generatedAt:Date.now(),inline:t,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:n.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:t.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(t.activeTaskCount||0),totalSubmitted:a,totalCompleted:c,totalFailed:l,
busiestExecutorId:u.executorId||null,busiestActiveTaskCount:u.activeTaskCount||0,busiestCompleted:u.completed||0}}}_placementBucket(e,t){
const n=String(t||"unknown");return e[n]||(e[n]=tT()),e[n]}_normalizeTaskPlacement(e={},{runtime:t="unknown",taskFamily:n="\
unknown"}={}){const s=e.placementHint||e.placement||e.data?.placementHint||e.data?.placement||e.data?.solver?.placementHint||
null,i=s?.recommendedPlacement||s?.requestedPlacement||s?.placement||"local",o=["local","peer","cluster"].includes(String(
i).trim().toLowerCase())?String(i).trim().toLowerCase():"local";return{schema:pp,source:s?"task-placement-hint-v0":"defa\
ult-local",advisoryOnly:s?.advisoryOnly!==!1,requestedPlacement:o,recommendedPlacement:o,actualPlacement:null,solverKey:s?.
solverKey||e.solverId||e.data?.solver?.id||null,solverId:s?.solverId||e.solverId||e.data?.solver?.id||null,taskFamily:n,
runtime:t,syncMode:s?.syncMode||null,timeoutMs:J(s?.timeoutMs,this.placementTimeoutMs,0,36e5),confidence:Number.isFinite(
Number(s?.confidence))?Number(s.confidence):null,targetReplicaCount:J(s?.targetReplicaCount,0,0,1e6),peerId:s?.peerId||s?.
remotePeerId||e.peerId||e.remotePeerId||null,clusterId:s?.clusterId||e.clusterId||null,reasons:Array.isArray(s?.reasons)?
[...s.reasons]:[],constraints:Array.isArray(s?.constraints)?[...s.constraints]:[]}}_recordPlacementSubmitted(e={}){const t=this.
stats.taskPlacement;if(!t)return;const n=e.requestedPlacement||"local";t.totalSubmitted+=1,n==="local"?t.localSubmitted+=
1:t.remoteRequested+=1,this._placementBucket(t.byRecommendedPlacement,n).submitted+=1,t.lastPlacement={...e,actualPlacement:e.
actualPlacement||null}}_recordPlacementAttempt(e,{mode:t="unknown",attempt:n=1}={}){const s=e.placement||e.payload?.placement,
i=this.stats.taskPlacement;if(!s||!i)return;const o=s.requestedPlacement||"local",a=String(t||"unknown"),c=a.startsWith(
"remote-")?a:`local-${a}`;this.stats.remoteTaskAttempts+=1,i.remoteAttempts+=1,this._placementBucket(i.byRecommendedPlacement,
o).attempted+=1,this._placementBucket(i.byActualPlacement,c).attempted+=1,i.lastPlacementAttempt={...s,actualPlacement:c,
attempt:n,attemptedAt:Date.now()}}_recordPlacementRetry(e,{mode:t="unknown",retry:n=null}={}){const s=e.placement||e.payload?.
placement,i=this.stats.taskPlacement;if(!s||!i)return;const o=s.requestedPlacement||"local",a=String(t||"unknown"),c=a.startsWith(
"remote-")?a:`local-${a}`;this.stats.remoteTasksRetried+=1,i.remoteRetried+=1,this._placementBucket(i.byRecommendedPlacement,
o).retried+=1,this._placementBucket(i.byActualPlacement,c).retried+=1,i.lastPlacementRetry={...s,actualPlacement:c,retry:n?
JSON.parse(JSON.stringify(n)):null,decidedAt:Date.now()}}_recordPlacementCompletion(e,{ok:t=!0,mode:n="unknown",errorKind:s=null,
errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.placement||e.payload?.placement,u=this.
stats.taskPlacement;if(!l||!u)return;const d=l.requestedPlacement||"local",h=String(n||"unknown"),p=h.startsWith("remote\
-")?h:h==="worker"?"local-worker":h==="inline"?"local-inline":`local-${h}`;t?u.totalCompleted+=1:u.totalFailed+=1,p.startsWith(
"remote-")&&(t?u.remoteExecuted+=1:(u.remoteFailed+=1,s==="timeout"&&(u.remoteTimedOut+=1),s==="rejected"&&(u.remoteRejected+=
1),s==="verification-failed"&&(u.remoteVerificationFailed+=1),s==="validation-failed"&&(u.remoteValidationFailed+=1),c?.
exhausted&&(u.remoteRetryExhausted+=1)));const g=this._placementBucket(u.byRecommendedPlacement,d),y=this._placementBucket(
u.byActualPlacement,p);t?(g.completed+=1,y.completed+=1):(g.failed+=1,y.failed+=1,s==="timeout"&&(g.timedOut+=1,y.timedOut+=
1),s==="rejected"&&(g.rejected+=1,y.rejected+=1),s==="verification-failed"&&(g.verificationFailed+=1,y.verificationFailed+=
1),s==="validation-failed"&&(g.validationFailed+=1,y.validationFailed+=1),c?.exhausted&&(g.retryExhausted+=1,y.retryExhausted+=
1)),y.submitted+=1,u.lastPlacement={...l,actualPlacement:p,completedAt:Date.now(),ok:t,errorKind:s,errorMessage:i,admission:a,
provenance:o,retry:c},p.startsWith("remote-")&&(u.lastRemotePlacement=JSON.parse(JSON.stringify(u.lastPlacement)))}_runtimeStats(e){
const t=String(e||"unknown");return this.stats.byRuntime[t]||(this.stats.byRuntime[t]=Xc()),this.stats.byRuntime[t]}_normalizeTaskFamily(e={},t="\
unknown"){const n=e.taskFamily||e.solverId||e.data?.solver?.id||e.data?.solverId||e.data?.taskFamily;if(n)return String(
n).trim()||"unknown";if(e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey){const s=String(e.affinityKey||
e.workerKey||e.data?.affinityKey||e.data?.stateKey),[i]=s.split(":");if(i)return i}return String(t||"unknown")}_taskFamilyStats(e){
const t=String(e||"unknown");return this.stats.byTaskFamily[t]||(this.stats.byTaskFamily[t]=Xc()),this.stats.byTaskFamily[t]}_recordTaskCompletion(e,{
ok:t=!0,mode:n="unknown",errorKind:s=null,errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.
runtime||e.payload?.runtime||"unknown",u=this._runtimeStats(l),d=e.taskFamily||e.payload?.taskFamily||"unknown",h=this._taskFamilyStats(
d),p=ft(),g=Math.max(0,p-(e.submittedAt||e.startedAt||p)),y=Math.max(0,p-(e.startedAt||e.submittedAt||p));t?(this.stats.
totalTasksCompleted+=1,u.completed+=1,h.completed+=1,n==="worker"?this.stats.workerTasksCompleted+=1:String(n||"").startsWith(
"remote-")?this.stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,u.failed+=
1,h.failed+=1,String(n||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),c?.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=g,this.stats.lastTaskDurationMs=Number(g.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),u.totalDurationMs+=g,u.lastDurationMs=
this.stats.lastTaskDurationMs,u.maxDurationMs=Math.max(u.maxDurationMs,u.lastDurationMs);const m=u.completed+u.failed;u.
averageDurationMs=m>0?Number((u.totalDurationMs/m).toFixed(3)):0,h.totalDurationMs+=g,h.lastDurationMs=this.stats.lastTaskDurationMs,
h.maxDurationMs=Math.max(h.maxDurationMs,h.lastDurationMs);const f=h.completed+h.failed;h.averageDurationMs=f>0?Number((h.
totalDurationMs/f).toFixed(3)):0,this._recordExecutorCompletion(e,{ok:t,durationMs:y}),this._recordPlacementCompletion(e,
{ok:t,mode:n,errorKind:s,errorMessage:i,admission:a,provenance:o,retry:c})}_removeWorker(e,{terminate:t=!0}={}){if(t)try{
e.terminate()}catch(i){return this.workerTerminationFailures.set(e,Object.assign(new Error("Owned worker termination fai\
led",{cause:i}),{code:"ERR_COMPUTE_WORKER_TERMINATION_FAILED",workerTerminated:!1})),!1}this.workerTerminationFailures.delete(
e),this._markWorkerBootstrapRetired(e);const n=this.workerBootstrap.get(e);if(e.onmessage=null,e.onerror=null,n?.messageErrorListener&&
typeof e.removeEventListener=="function"){try{e.removeEventListener("messageerror",n.messageErrorListener)}catch{}n.messageErrorListener=
null}const s=this._workerId(e)||"worker-unknown";if(this.workerUtilization.has(s)){const i=this.workerUtilization.get(s);
i.status="retired"}for(const i of this.activeTasks.values())i.worker===e&&this._recordExecutorAbandon(i);this.workers=this.
workers.filter(i=>i!==e);for(const[i,o]of this.workerAffinities.entries())o===e&&this.workerAffinities.delete(i);return!0}_recordWorkerResize({
reason:e="manual",previousTargetWorkers:t=this.targetWorkerCount,previousWorkerCount:n=this.workers.length}={}){const s=this.
workers.length,i=t!==this.targetWorkerCount||n!==s;i&&(this.workerPoolRevision+=1);const o={schema:"peercompute.compute.\
worker-resize.v0",revision:this.workerPoolRevision,reason:e,previousTargetWorkers:t,targetWorkers:this.targetWorkerCount,
previousWorkerCount:n,workerCount:s,changed:i,timestamp:Date.now()};return this.lastWorkerResize=o,i&&(this.workerResizeHistory.
push(o),this.workerResizeHistory=this.workerResizeHistory.slice(-16)),o}_holdWorkerAutoScale(e="manual",t=this.manualWorkerAutoScaleCooldownMs){
const n=J(t,0,0,6e5);if(n<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+n;return s>=this.workerAutoScaleHoldUntil&&
(this.workerAutoScaleHoldUntil=s,this.workerAutoScaleHoldReason=e),this._getWorkerAutoScaleHoldStatus()}_getWorkerAutoScaleHoldStatus(e=Date.
now()){const t=Math.max(0,this.workerAutoScaleHoldUntil-e);return{active:t>0,reason:t>0?this.workerAutoScaleHoldReason:null,
remainingMs:t,until:t>0?this.workerAutoScaleHoldUntil:null}}_retireIdleWorkers(){if(this.workers.length<=this.targetWorkerCount)
return;const e=new Set(Array.from(this.activeTasks.values()).map(t=>t.worker));for(const t of[...this.workers].reverse()){
if(this.workers.length<=this.targetWorkerCount)break;e.has(t)||[...this.residentWorkerAffinities].some(n=>this.workerAffinities.
get(n)===t)||(this._removeWorker(t),this.workerRetirements+=1)}}_maybeScaleForQueue(){if(!this.config.autoScaleWorkers||
!this.initialized||!this._supportsWorkers()||this._getWorkerAutoScaleHoldStatus().active||this.workers.length>=this.workerPolicy.
maxWorkers)return;const e=this.activeTasks.size+this.taskQueue.length;if(e<this.workers.length+this.workerPolicy.scaleUpQueueDepth)
return;const t=Math.min(this.workerPolicy.maxWorkers,Math.max(this.targetWorkerCount+1,e));this.resizeWorkers(t,{reason:"\
queue-pressure"})}_scheduleIdleScaleDown(){!this.config.autoScaleWorkers||this.workerPolicy.idleScaleDownMs<1||this._getWorkerAutoScaleHoldStatus().
active||this.activeTasks.size>0||this.taskQueue.length>0||this.workers.length<=this.workerPolicy.targetWorkers||(clearTimeout(
this.scaleDownTimer),this.scaleDownTimer=setTimeout(()=>{this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"idl\
e-scale-down"})},this.workerPolicy.idleScaleDownMs))}_requiresInlineExecution(e){return e.payload?.gpuResidentLane?.localExecution===
"inline"}_acquireTaskGpuResidentLaneLease(e){const t=e.payload?.gpuResidentLane;if(!t||e.gpuResidentLaneLease||e.gpuResidentLaneExecution)
return e.gpuResidentLaneLease||null;if(!this.gpuResidentLaneManager?.acquireLease)throw new Error("GPU resident lane man\
ager is not available for declared resident-lane task");const n=this.acquireGpuResidentLaneLease({...t,taskId:t.taskId||
e.id||e.payload?.id||null,solverId:t.solverId||e.payload?.solverId||e.payload?.taskFamily||null,owner:t.owner||e.payload?.
taskFamily||"compute-manager-task",queueFencePolicy:t.queueFencePolicy||e.payload?.gpuFence?.queueFencePolicy||null,retainedBufferRefs:t.
retainedBufferRefs?.length?t.retainedBufferRefs:e.payload?.gpuFence?.retainedBufferRefs||[],residentSequenceLaneContract:t.
residentSequenceLaneContract||null});return e.gpuResidentLaneLease=n,n}_taskPayloadWithGpuResidentLaneLeaseIdentity(e){const t=e.
payload,n=e.gpuResidentLaneLease;if(!n)return t;const s=Object.freeze({schema:g4,authoritative:!0,leaseId:n.leaseId,laneId:n.
laneId,stateKey:n.stateKey,sourceFamily:n.sourceFamily,domainKey:n.domainKey,solverId:n.solverId,taskId:n.taskId,owner:n.
owner}),i=t?.data;return!i||typeof i!="object"||Array.isArray(i)?{...t,gpuResidentLaneLeaseIdentity:s}:{...t,data:{...i,
gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,t,{mode:n=null}={}){
const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return t;const i=t&&typeof t=="object"?t:{},o=Ji(i.gpuFence||
i.gpuFenceReport,e.payload?.gpuFence||null),a=e.payload?.gpuFence?.required===!0,c=o?.retainedBufferRefs?.length?o.retainedBufferRefs:
e.payload?.gpuResidentLane?.retainedBufferRefs?.length?e.payload.gpuResidentLane.retainedBufferRefs:e.payload?.gpuFence?.
retainedBufferRefs||s.retainedBufferRefs||[],l=this.completeGpuResidentLaneLease(s.leaseId,{status:o?.status||(a?"gpu-fe\
nce-report-missing":"queue-work-completed"),method:o?.method||null,queueCompletionStatus:o?.queueCompletionStatus||o?.status||
null,queueCompletionMethod:o?.queueCompletionMethod||o?.method||null,retainedBufferRefs:c,completed:o?o.fenceSatisfied===
!0:a?!1:null,source:n?`compute-manager-${n}`:"compute-manager-local-task"});return e.gpuResidentLaneExecution=l,e.gpuResidentLaneLease=
null,t&&typeof t=="object"&&!Array.isArray(t)?{...t,gpuFence:t.gpuFence||l.gpuFence,gpuResidentLaneExecution:t.gpuResidentLaneExecution||
l,gpuResidentLaneLease:t.gpuResidentLaneLease||l.lease}:t}_rejectTaskGpuResidentLaneLease(e,t="task-failed"){const n=e.gpuResidentLaneLease;
if(!n||e.gpuResidentLaneExecution||e.gpuResidentLaneRejected)return null;const s=this.rejectGpuResidentLaneLease(n.leaseId,
t);return e.gpuResidentLaneRejected=s,e.gpuResidentLaneLease=null,s}_assertRequiredGpuFenceSatisfied(e,t){if(e.payload?.
gpuFence?.required!==!0)return;const n=t&&typeof t=="object"?t:{},s=e.gpuResidentLaneExecution?.gpuFence||Ji(n.gpuFence||
n.gpuFenceReport,e.payload.gpuFence);if(s?.fenceSatisfied===!0)return;const i=new Error(`GPU fence missing or unsatisfie\
d for task ${e.id||e.payload?.id||"unknown"}`);throw i.name="GpuFenceUnsatisfiedError",i.code="ERR_COMPUTE_GPU_FENCE_UNS\
ATISFIED",i.gpuFence=s||null,i.gpuFenceRequirement=e.payload.gpuFence,i}_dispatchToWorker(e){if(this._requiresInlineExecution(
e))return!1;const t=e.payload?.affinityKey;if(t&&this.residentWorkerAffinities.has(t)&&!this.workerAffinities.has(t))return this.
_recordTaskCompletion(e,{ok:!1,mode:"queued"}),e.reject(Object.assign(new Error("Resident worker was terminated"),{code:"\
ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0})),!0;const n=new Set(Array.from(this.activeTasks.values()).map(c=>c.
worker)),s=this.workers.filter(c=>!this.workerTerminationFailures.has(c)&&(!(this.config.requireWorkers||e.payload?.requireWorker)||
this.workerBootstrap.get(c)?.status==="ready"));let i=null;if(t&&this.workerAffinities.has(t)){const c=this.workerAffinities.
get(t);if(!this.workers.includes(c))this.workerAffinities.delete(t);else if(s.includes(c)){if(n.has(c))return!1;i=c}else
return!1}if(!i){const c=new Set(this.workerAffinities.values()),l=new Set([...this.residentWorkerAffinities].map(d=>this.
workerAffinities.get(d))),u=s.filter(d=>!n.has(d)&&!l.has(d));i=u.find(d=>!c.has(d))||u[0],i&&t&&this.workerAffinities.set(
t,i)}if(!i)return!1;clearTimeout(e.control?.bootstrapTimer);const o=this._workerId(i)||"worker-unknown",a={...e,worker:i,
workerId:o,startedAt:ft(),executionMode:"worker"};this._recordExecutorStart(o,a,{kind:"worker"}),this.activeTasks.set(e.
id,a);try{i.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(c){this._handleWorkerFailure(i,c)}
return!0}_buildTaskExecutionReport(e,{mode:t=null,result:n=null}={}){const s=t||e.executionMode||null,i=e.runtime||e.payload?.
runtime||null,o=e.taskFamily||e.payload?.taskFamily||null,a=e.id||e.payload?.id||null,c=n&&typeof n=="object"?n:{},l=Ji(
c.gpuFence||c.gpuFenceReport,e.payload?.gpuFence||null)||e.gpuResidentLaneExecution?.gpuFence||null,u=e.executorId||(s===
"inline"||s==="inline-fallback"?this.inlineExecutorId:null),d=s==="worker"&&(e.workerId||e.executorId)||null;return{schema:N4,
taskId:a,runtime:i,taskFamily:o,executionMode:s,executorId:u,workerId:d,gpuFenceRequirement:e.payload?.gpuFence||null,gpuFence:l,
gpuFenceStatus:l?.status??null,gpuFenceSatisfied:l?.fenceSatisfied??!1,gpuResidentLaneRequirement:e.payload?.gpuResidentLane||
null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,t,{
mode:n=null}={}){if(t.payload?.returnEnvelope!==!0)return e;const s=this._buildTaskExecutionReport(t,{mode:n,result:e});
if(e&&typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==
null&&s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
if(e.payload?.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohibited for this task"));return}
e.startedAt=ft(),e.executionMode||="inline",this._recordExecutorStart(this.inlineExecutorId,e,{kind:"inline"});try{this.
_acquireTaskGpuResidentLaneLease(e);const t=await o4(this._taskPayloadWithGpuResidentLaneLeaseIdentity(e)),n=this._completeTaskGpuResidentLaneLease(
e,t,{mode:e.executionMode||"inline"});if(this._assertRequiredGpuFenceSatisfied(e,n),n&&typeof n=="object"&&Object.prototype.
hasOwnProperty.call(n,"commitDelta")){e.payload?.suppressCommitDelta!==!0&&this.commitDelta(n.commitDelta);const s=Object.
prototype.hasOwnProperty.call(n,"value")?n.value:n.result;this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inl\
ine"}),e.resolve(e.payload?.returnEnvelope===!0?this._attachTaskExecutionReport(n,e,{mode:e.executionMode||"inline"}):s);
return}this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(e.payload?.returnEnvelope===!0?this.
_attachTaskExecutionReport(n,e,{mode:e.executionMode||"inline"}):n)}catch(t){this._rejectTaskGpuResidentLaneLease(e,t?.code||
"inline-task-error"),this._recordTaskCompletion(e,{ok:!1,mode:e.executionMode||"inline"}),e.reject(t)}}_handleWorkerMessage(e,t){
if(!this.workers.includes(e))return;const{id:n,type:s,result:i,error:o}=t||{};if(s==="ready"){const c=this.workerBootstrap.
get(e);c&&(c.protocolVersion=t.protocolVersion||1),this._markWorkerBootstrapped(e),this._scheduleNext();return}const a=this.
activeTasks.get(n);if(!(!a||a.worker!==e)){if(s==="progress"){if(!a.control?.cancelRequested)try{a.onProgress?.(t.value)}catch{
this.cancelTask(n,{reason:"Compute progress consumer failed"})}return}if(!(s!=="result"&&s!=="error")){if(a.control?.cancelRequested){
this._recordTaskCompletion(a,{ok:!1,mode:"worker"}),a.reject(Object.assign(new Error("Compute task cancelled"),{name:"Ab\
ortError",code:"ERR_COMPUTE_TASK_CANCELLED"})),this.activeTasks.delete(n),this._retireIdleWorkers(),this._scheduleNext();
return}if(s==="result"){let c=i;i&&typeof i=="object"&&Object.prototype.hasOwnProperty.call(i,"commitDelta")&&(a.payload?.
suppressCommitDelta!==!0&&this.commitDelta(i.commitDelta),c=Object.prototype.hasOwnProperty.call(i,"value")?i.value:i.result),
this._recordTaskCompletion(a,{ok:!0,mode:"worker"}),a.resolve(a.payload?.returnEnvelope===!0?this._attachTaskExecutionReport(
i,a,{mode:"worker"}):c)}else s==="error"&&(this._recordTaskCompletion(a,{ok:!1,mode:"worker"}),a.reject(Object.assign(new Error(
o||"Worker task failed"),{name:t.name||"Error",...t.code?{code:t.code}:{}})));this.activeTasks.delete(n),this._retireIdleWorkers(),
this._scheduleIdleScaleDown(),this._scheduleNext()}}}_handleWorkerFailure(e,t){if(!this.workers.includes(e))return;if(this.
_markWorkerBootstrapFailed(e,t),this.config.requireWorkers){this._failRequiredWorkerPool(this._createRequiredWorkerError(
"an active browser worker failed",t));return}const n=this._removeWorker(e),s=[];for(const[i,o]of this.activeTasks.entries())
o.worker===e&&(n&&this.activeTasks.delete(i),s.push(o));console.warn("[ComputeManager] Worker failed; recovering eligibl\
e tasks",t),s.forEach(i=>{if(!n||i.payload?.requireWorker||i.control?.cancelRequested){const o=n?Object.assign(new Error(
t?.message||"Managed worker terminated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"}):this.workerTerminationFailures.
get(e);this._recordTaskCompletion(i,{ok:!1,mode:"worker"}),i.reject(o);return}this.workers.length>0&&this._dispatchToWorker(
i)||(i.executionMode="inline-fallback",this._executeInline(i))}),this._scheduleNext()}_scheduleNext(){if(this.taskQueue.
length===0)return;if(this.workerRequirementError){this._rejectQueuedTasksForRequiredWorkerFailure(this.workerRequirementError);
return}if(this._ensureTargetWorkers({reason:"queue-dispatch"}),this.workerRequirementError){this._rejectQueuedTasksForRequiredWorkerFailure(
this.workerRequirementError);return}if(this.workers.length===0){if(this.config.requireWorkers){const t=this._createRequiredWorkerError(
"the required worker pool is empty while work is queued");this.workerRequirementError=t,this._rejectQueuedTasksForRequiredWorkerFailure(
t);return}for(;this.taskQueue.length>0;)this._executeInline(this.taskQueue.shift());return}const e=[];for(;this.taskQueue.
length>0;){const t=this.taskQueue.shift();if(this._requiresInlineExecution(t)){this._executeInline(t);continue}this._dispatchToWorker(
t)||e.push(t)}this.taskQueue=e}_ensureTargetWorkers({reason:e="task-demand"}={}){if(this.workerRequirementError)return this.
workers.length;if(this.destroying||!this.initialized||!this._supportsWorkers())return this.workers.length;const t=J(this.
targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);if(t<=this.workers.length)return this.
workers.length;const n=this.targetWorkerCount,s=this.workers.length;for(;this.workers.length<t&&this._spawnWorker(););return this.
workers.length!==s&&this._recordWorkerResize({reason:e,previousTargetWorkers:n,previousWorkerCount:s}),this.workers.length}}
function my(r){for(const e of Object.values(r))e&&typeof e=="object"&&my(e);return Object.freeze(r)}const mT=my({"qwen2.\
5-coder-0.5b-q4":{id:"qwen2.5-coder-0.5b-q4",name:"Qwen2.5 Coder 0.5B (q4)",description:"Coding and code explanation.",repository:"\
onnx-community/Qwen2.5-Coder-0.5B-Instruct",revision:"604bb1988ff789d5024d589c63cf9ae81c0c8ab5",status:"candidate",license:{
spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct/blob/ea3f2471cf1b1f0db85067f1ef9384\
8e38e88c25/README.md",notice:"Preserve the upstream license, notices and model-card provenance.",conversionLicenseReviewRequired:!0},
provenance:{repository:"onnx-community/Qwen2.5-Coder-0.5B-Instruct",revision:"604bb1988ff789d5024d589c63cf9ae81c0c8ab5",
format:"ONNX",metadataCheckedAt:"2026-11-04",modelCardUrl:"https://huggingface.co/onnx-community/Qwen2.5-Coder-0.5B-Inst\
ruct/blob/604bb1988ff789d5024d589c63cf9ae81c0c8ab5/README.md"},model:{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:"\
qwen2",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],repository:"onnx-community/Qwen2.5-Code\
r-0.5B-Instruct",revision:"604bb1988ff789d5024d589c63cf9ae81c0c8ab5"},weightBytes:862087110,totalBytes:877970632,files:[
{path:"README.md",size:2714,gitBlobSha1:"e3f268a58331e0cdd58a38de3e15008428cc8821"},{path:"added_tokens.json",size:605,gitBlobSha1:"\
482ced4679301bf287ebb310bdd1790eb4514232"},{path:"config.json",size:916,gitBlobSha1:"b0c966334ffb6f0a6e8122eb260129c3796\
308e7"},{path:"generation_config.json",size:243,gitBlobSha1:"a7538414a4813e768e4e9d22e8588e35db8e5fbd"},{path:"merges.tx\
t",size:1671853,gitBlobSha1:"31349551d90c7606f325fe0f11bbb8bd5fa0d7c7"},{path:"onnx/model_q4.onnx",size:862087110,sha256:"\
2df7ea9739c3c26bd9d2cad0815768a5a0a985d4b5548b7de80c5e85e9a97b47"},{path:"special_tokens_map.json",size:613,gitBlobSha1:"\
ac23c0aaa2434523c494330aeb79c58395378103"},{path:"tokenizer.json",size:11421896,sha256:"9c5ae00e602b8860cbd784ba82a8aa14\
e8feecec692e7076590d014d7b7fdafa"},{path:"tokenizer_config.json",size:7849,gitBlobSha1:"24afe3594154cfee05edda73aeadf3da\
ae0a53ba"},{path:"vocab.json",size:2776833,gitBlobSha1:"4783fe10ac3adce15ac8f358ef5462739852c569"}]},"smollm2-360m-instr\
uct-q4":{id:"smollm2-360m-instruct-q4",name:"SmolLM2 360M Instruct (q4)",description:"Lightweight English writing, rewri\
ting and summarization.",repository:"HuggingFaceTB/SmolLM2-360M-Instruct",revision:"a10cc1512eabd3dde888204e902eca88bddb\
4951",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruc\
t/blob/a10cc1512eabd3dde888204e902eca88bddb4951/README.md",notice:"Preserve the upstream license, notices and model-card\
 provenance.",conversionLicenseReviewRequired:!1},provenance:{repository:"HuggingFaceTB/SmolLM2-360M-Instruct",revision:"\
a10cc1512eabd3dde888204e902eca88bddb4951",format:"ONNX",metadataCheckedAt:"2026-11-04",modelCardUrl:"https://huggingface\
.co/HuggingFaceTB/SmolLM2-360M-Instruct/blob/a10cc1512eabd3dde888204e902eca88bddb4951/README.md"},model:{runtime:"transf\
ormers.js",runtimeVersion:"4.3.2",architecture:"llama",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],
repository:"HuggingFaceTB/SmolLM2-360M-Instruct",revision:"a10cc1512eabd3dde888204e902eca88bddb4951"},weightBytes:387943246,
totalBytes:391327556,files:[{path:"README.md",size:7304,gitBlobSha1:"5ed0ef7d7e4c1304d542a073ff5767990d410e2f"},{path:"c\
onfig.json",size:846,gitBlobSha1:"4f2ae86545bb5c1d4fcc55644deef86be50a7dee"},{path:"generation_config.json",size:132,gitBlobSha1:"\
da6c4d71a43aa7e6f785bdbb28ea5025438a73fa"},{path:"merges.txt",size:466391,gitBlobSha1:"69503b13f727ba3812b6803e97442a6de\
05ef5eb"},{path:"onnx/model_q4.onnx",size:387943246,sha256:"a4ffda96e65beafc6f6cef0cbcf9fdc1cbdd79c230906bf3897d190547c7\
a596"},{path:"special_tokens_map.json",size:655,gitBlobSha1:"44719d2e365acac0637fd25a3acf46494ca45940"},{path:"tokenizer\
.json",size:2104556,gitBlobSha1:"f922b1797f0c88e71addc8393787831f2477a4bd"},{path:"tokenizer_config.json",size:3764,gitBlobSha1:"\
8c7b22013909450429303ed10be4398bd63f5457"},{path:"vocab.json",size:800662,gitBlobSha1:"0ad5ecc2035b7031b88afb544ee95e2d4\
9baa484"}]}});function gy(r){for(const e of Object.values(r))e&&typeof e=="object"&&gy(e);return Object.freeze(r)}const Ha=gy(
{...mT,"qwen3-0.6b-q4":{id:"qwen3-0.6b-q4",name:"Qwen3 0.6B (q4)",repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"\
58ca03a5e7b354b480b1a82b34bde8dc7b854cc0",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.c\
o/Qwen/Qwen3-0.6B/blob/c1899de289a04d12100db370d81485cdf75e47ca/README.md",notice:"Preserve the upstream license, notice\
s and model-card provenance.",conversionLicenseReviewRequired:!0},provenance:{repository:"onnx-community/Qwen3-0.6B-ONNX",
revision:"58ca03a5e7b354b480b1a82b34bde8dc7b854cc0",format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://h\
uggingface.co/onnx-community/Qwen3-0.6B-ONNX/blob/58ca03a5e7b354b480b1a82b34bde8dc7b854cc0/README.md"},model:{runtime:"t\
ransformers.js",runtimeVersion:"4.3.2",architecture:"qwen3",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],
repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"58ca03a5e7b354b480b1a82b34bde8dc7b854cc0"},weightBytes:919096585,totalBytes:932680786,
files:[{path:"README.md",size:1539,gitBlobSha1:"bb4c96a7b31a2ba8660a48adca819d5047051dc5"},{path:"added_tokens.json",size:707,
gitBlobSha1:"b54f9135e44c1e81047e8d05cb027af8bc039eed"},{path:"chat_template.jinja",size:4116,gitBlobSha1:"699ff8df401fe\
4788525e9c1f9b86a99eadd6230"},{path:"config.json",size:912,gitBlobSha1:"5618bd85d36283349a0cb4a99ab15454691f355b"},{path:"\
generation_config.json",size:219,gitBlobSha1:"f0e014517edce509b5d5f07cfa4855d79fad3bcf"},{path:"merges.txt",size:1671853,
gitBlobSha1:"31349551d90c7606f325fe0f11bbb8bd5fa0d7c7"},{path:"onnx/model_q4.onnx",size:919096585,sha256:"d43d836fc5e240\
df9013733ccd214972c5d21bd9ec47e574e4f1e359cf90aed0"},{path:"special_tokens_map.json",size:613,gitBlobSha1:"ac23c0aaa2434\
523c494330aeb79c58395378103"},{path:"tokenizer.json",size:9117040,sha256:"e7a95fce95bf5b0946d0ddb3f9d7caa030b7e850bbe92b\
0edb26bcf563e9f3d5"},{path:"tokenizer_config.json",size:10369,gitBlobSha1:"f658735e1ad9b8feb5a3c5140e659e854889af61"},{path:"\
vocab.json",size:2776833,gitBlobSha1:"4783fe10ac3adce15ac8f358ef5462739852c569"}]},"smolvlm-256m-q4":{id:"smolvlm-256m-q\
4",name:"SmolVLM 256M Instruct (q4)",repository:"HuggingFaceTB/SmolVLM-256M-Instruct",revision:"7e3e67edbbed1bf9888184d9\
df282b700a323964",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/HuggingFaceTB/SmolVLM-\
256M-Instruct/blob/7e3e67edbbed1bf9888184d9df282b700a323964/README.md",notice:"Preserve the upstream license, notices an\
d model-card provenance."},provenance:{repository:"HuggingFaceTB/SmolVLM-256M-Instruct",revision:"7e3e67edbbed1bf9888184\
d9df282b700a323964",format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/HuggingFaceTB/Smol\
VLM-256M-Instruct/blob/7e3e67edbbed1bf9888184d9df282b700a323964/README.md"},model:{runtime:"transformers.js",runtimeVersion:"\
4.3.2",architecture:"idefics3",task:"image-text-to-text",dtype:{embed_tokens:"q4",vision_encoder:"q4",decoder_model_merged:"\
q4"},modalities:["text","image"],requiredFeatures:[],repository:"HuggingFaceTB/SmolVLM-256M-Instruct",revision:"7e3e67ed\
bbed1bf9888184d9df282b700a323964"},weightBytes:263889326,totalBytes:268763564,files:[{path:"README.md",size:16400,gitBlobSha1:"\
66dd9eda6724c2e696a44a05dba796bb707de9ff"},{path:"added_tokens.json",size:4739,gitBlobSha1:"71dc811700b6aa9274d3697ee7d4\
fb2d5375e766"},{path:"chat_template.json",size:429,gitBlobSha1:"214a30563adf9598b26cdd3ad3bbafca9d7af45d"},{path:"config\
.json",size:7353,gitBlobSha1:"1c09d62975f946e7e07f62ec4db3f16c9c701144"},{path:"generation_config.json",size:136,gitBlobSha1:"\
14051e31eab5938a09976bf8c3e4769491f53a80"},{path:"merges.txt",size:466391,gitBlobSha1:"69503b13f727ba3812b6803e97442a6de\
05ef5eb"},{path:"onnx/decoder_model_merged_q4.onnx",size:86562901,sha256:"e3fd81130e30715580cf148398e48e2925b6219bff75e1\
7d2a77add35a363f65"},{path:"onnx/embed_tokens_q4.onnx",size:113541438,sha256:"47ed7029703cff586fd719d70251324766a6591c8a\
58d315076b1781a65fc900"},{path:"onnx/vision_encoder_q4.onnx",size:63784987,sha256:"95814e6629ec465e7cf98a44edcee67abc06d\
41faa0d1acc410cf8a956cab488"},{path:"preprocessor_config.json",size:486,gitBlobSha1:"893236748032d4bf033823d6a4a0d62b78b\
6bc0e"},{path:"processor_config.json",size:68,gitBlobSha1:"b3b1deadd0e6e18c2070fdb0c29074892ea58ffe"},{path:"special_tok\
ens_map.json",size:1069,gitBlobSha1:"647565708c361dc42350b5c7b79c46a4ff153b18"},{path:"tokenizer.json",size:3548256,gitBlobSha1:"\
a4005d1cf3170a31600a5c96f95768166cbc2b28"},{path:"tokenizer_config.json",size:28249,gitBlobSha1:"c85c07d72e6ffca6b6ff138\
a8e8f09ae65740bfb"},{path:"vocab.json",size:800662,gitBlobSha1:"0ad5ecc2035b7031b88afb544ee95e2d49baa484"}]},"smolvlm-50\
0m-q4":{id:"smolvlm-500m-q4",name:"SmolVLM 500M Instruct (q4)",repository:"HuggingFaceTB/SmolVLM-500M-Instruct",revision:"\
a7da5b986cb59b408707209984f360a5f4ad7e47",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.c\
o/HuggingFaceTB/SmolVLM-500M-Instruct/blob/a7da5b986cb59b408707209984f360a5f4ad7e47/README.md",notice:"Preserve the upst\
ream license, notices and model-card provenance."},provenance:{repository:"HuggingFaceTB/SmolVLM-500M-Instruct",revision:"\
a7da5b986cb59b408707209984f360a5f4ad7e47",format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface\
.co/HuggingFaceTB/SmolVLM-500M-Instruct/blob/a7da5b986cb59b408707209984f360a5f4ad7e47/README.md"},model:{runtime:"transf\
ormers.js",runtimeVersion:"4.3.2",architecture:"idefics3",task:"image-text-to-text",dtype:{embed_tokens:"q4",vision_encoder:"\
q4",decoder_model_merged:"q4"},modalities:["text","image"],requiredFeatures:[],repository:"HuggingFaceTB/SmolVLM-500M-In\
struct",revision:"a7da5b986cb59b408707209984f360a5f4ad7e47"},weightBytes:485088765,totalBytes:489956507,files:[{path:"RE\
ADME.md",size:9918,gitBlobSha1:"add86ea016316649eff3ec3707f81e03c166abd1"},{path:"added_tokens.json",size:4739,gitBlobSha1:"\
71dc811700b6aa9274d3697ee7d4fb2d5375e766"},{path:"chat_template.json",size:429,gitBlobSha1:"214a30563adf9598b26cdd3ad3bb\
afca9d7af45d"},{path:"config.json",size:7339,gitBlobSha1:"d2a7bdf9e204095994fa15a3160a28e4c1fbd505"},{path:"generation_c\
onfig.json",size:136,gitBlobSha1:"14051e31eab5938a09976bf8c3e4769491f53a80"},{path:"merges.txt",size:466391,gitBlobSha1:"\
69503b13f727ba3812b6803e97442a6de05ef5eb"},{path:"onnx/decoder_model_merged_q4.onnx",size:229119140,sha256:"6d64c0fdce1c\
3515c40a08ff8e398bfbc0b2e961ae46d1b84b91e6a7b269b9d1"},{path:"onnx/embed_tokens_q4.onnx",size:189235518,sha256:"19f4fad7\
cb17c6dad11b4520d2abcba173fc91f755d71907d31d11a9e5761606"},{path:"onnx/vision_encoder_q4.onnx",size:66734107,sha256:"179\
812d5b1315edbe3e7164ea3d847c52723692e83ac9c770a5234962663fcad"},{path:"preprocessor_config.json",size:486,gitBlobSha1:"8\
93236748032d4bf033823d6a4a0d62b78b6bc0e"},{path:"processor_config.json",size:68,gitBlobSha1:"b3b1deadd0e6e18c2070fdb0c29\
074892ea58ffe"},{path:"special_tokens_map.json",size:1069,gitBlobSha1:"647565708c361dc42350b5c7b79c46a4ff153b18"},{path:"\
tokenizer.json",size:3548256,gitBlobSha1:"a4005d1cf3170a31600a5c96f95768166cbc2b28"},{path:"tokenizer_config.json",size:28249,
gitBlobSha1:"c85c07d72e6ffca6b6ff138a8e8f09ae65740bfb"},{path:"vocab.json",size:800662,gitBlobSha1:"0ad5ecc2035b7031b88a\
fb544ee95e2d49baa484"}]},"qwen3.5-2b-q4":{id:"qwen3.5-2b-q4",name:"Qwen3.5 2B Vision (q4)",repository:"onnx-community/Qw\
en3.5-2B-ONNX-OPT",revision:"ed446636739bf426e73c5a00714fd8e010d36c21",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"\
https://huggingface.co/Qwen/Qwen3.5-2B/blob/15852e8c16360a2fea060d615a32b45270f8a8fc/LICENSE",notice:"Preserve the upstr\
eam license, notices and model-card provenance.",conversionLicenseReviewRequired:!0},provenance:{repository:"onnx-commun\
ity/Qwen3.5-2B-ONNX-OPT",revision:"ed446636739bf426e73c5a00714fd8e010d36c21",format:"ONNX",metadataCheckedAt:"2026-11-03",
modelCardUrl:"https://huggingface.co/onnx-community/Qwen3.5-2B-ONNX-OPT/blob/ed446636739bf426e73c5a00714fd8e010d36c21/RE\
ADME.md",upstreamRepository:"Qwen/Qwen3.5-2B",upstreamRevision:"15852e8c16360a2fea060d615a32b45270f8a8fc"},model:{runtime:"\
transformers.js",runtimeVersion:"4.3.2",architecture:"qwen3_5",task:"image-text-to-text",dtype:{embed_tokens:"q4",vision_encoder:"\
q4",decoder_model_merged:"q4"},modalities:["text","image"],requiredFeatures:[],repository:"onnx-community/Qwen3.5-2B-ONN\
X-OPT",revision:"ed446636739bf426e73c5a00714fd8e010d36c21"},weightBytes:1752031835,totalBytes:1771280684,files:[{path:"R\
EADME.md",size:37,gitBlobSha1:"b206ddbaed14ba25a9cf960ac2e06e606e39f302"},{path:"chat_template.jinja",size:7755,gitBlobSha1:"\
0ef09f214eaa6d9bca297988afc1454b5827b2c7"},{path:"config.json",size:2993,gitBlobSha1:"1d7f2529ec1e68464cba2dd9ce66811f01\
3ccfa6"},{path:"generation_config.json",size:248,gitBlobSha1:"59ee4c198e909ccdc280d57660829658989582b2"},{path:"onnx/dec\
oder_model_merged_q4.onnx",size:586260,sha256:"8207fcf67d692e251eec7f24868be5b753f402fb84a259eb4578253692701405"},{path:"\
onnx/decoder_model_merged_q4.onnx_data",size:1207357440,sha256:"0c0f71175574f0060ed441acb1896825234ef27fcf008822c490dbfa\
6b0c90fe"},{path:"onnx/embed_tokens_q4.onnx",size:857,sha256:"0255dd844858758f452d9678f1e2c91db178f21b7da254d29b12e7fe3d\
23e305"},{path:"onnx/embed_tokens_q4.onnx_data",size:325795840,sha256:"9a6404d9b1c79ffc038d5c28deec04d419efb4594125453c9\
91be38b4522ecb6"},{path:"onnx/vision_encoder_q4.onnx",size:339182,sha256:"986f2792878369c6e0e28e27de0c14a41227a3fd24b9da\
8eae66d93bf223ae66"},{path:"onnx/vision_encoder_q4.onnx_data",size:217952256,sha256:"0ea0ab9559904e1e5150a0ca194136922c6\
b8f1dfaaa44cc5e174ca59b231bb3"},{path:"preprocessor_config.json",size:336,gitBlobSha1:"4ae180b49f91e11d4da327d44edd9d4a9\
09fe908"},{path:"processor_config.json",size:1300,gitBlobSha1:"7ad6acdf4203f22b7b990e36ccc3a1fe38563d5e"},{path:"tokeniz\
er.json",size:19226111,sha256:"89da80cc6689bef4d90cc1028249436975ffb0814618f1d93c65310e05801a9b"},{path:"tokenizer_confi\
g.json",size:10069,gitBlobSha1:"1a7a8b42ef296f48ac686bab602f518da32dd85c"}]}});function gT(r,e){const t=Ha[r];if(!t||!t.
files.some(s=>s.path===e))throw new Error("Unknown catalog model file");const n=e.split("/").map(encodeURIComponent).join(
"/");return`https://huggingface.co/${t.repository}/resolve/${t.revision}/${n}`}const Ts="Tsotchke-Corporation/Qwen3.8-27\
B-GeoRefine-D14-abl-GGUF",Ms="5ce3fd841676adf2c1a10d7193637d46007e88f7",kp=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],bT="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function by(r){
for(const e of Object.values(r))e&&typeof e=="object"&&by(e);return Object.freeze(r)}const wd=by({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ts,revision:Ms,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:bT},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ts}/blob/${Ms}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ts,revision:Ms,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ts}/blob/${Ms}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ts,revision:Ms},weightBytes:14199740480,
totalBytes:kp.reduce((r,e)=>r+e.size,0),files:kp}});function yT(r,e){const t=wd[r];if(!t||!t.files.some(s=>s.path===e))throw new Error(
"Unknown catalog artifact model file.");const n=e.split("/").map(encodeURIComponent).join("/");return`https://huggingfac\
e.co/${t.repository}/resolve/${t.revision}/${n}`}function yy(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.
values(r).forEach(yy),Object.freeze(r)),r}const wT=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],kT=yy(Object.fromEntries(wT.map(r=>{const{dtype:e,sourceModel:t,blockCount:n,nextnPredictLayers:s,...i}=r,
a=i.files.find(c=>c.path==="LICENSE").source;return[i.id,{...i,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+a.repository+"/blob/"+a.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:i.repository,revision:i.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+i.repository+"/blob/"+i.revision+"/README.md",sourceModel:{...t,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:n,
nextnPredictLayers:s,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:i.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:e,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:i.repository,revision:i.revision},weightBytes:i.files[0].size,totalBytes:i.
files.reduce((c,l)=>c+l.size,0)}]})));function kd(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.values(r).
forEach(kd),Object.freeze(r)),r}const gr="Tsotchke-Corporation",wy=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${gr}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
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
S GGUF, candidate text)",repository:`${gr}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
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
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${gr}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
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
06e0df3640f9ae04fff09706ef"}]}],ET=kd(Object.fromEntries(wy.map(r=>{const{architecture:e,quantizationTypes:t,sourceModel:n,
publisherLimitations:s,...i}=r;return[r.id,{...i,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${r.repository}\
/blob/${r.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:r.repository,revision:r.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${r.repository}/blob/${r.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:n,
publisherLimitations:s,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:t,modalities:["text"],requiredFeatures:["shader-f16"],repository:r.repository,
revision:r.revision},weightBytes:r.files.filter(o=>o.path.endsWith(".gguf")).reduce((o,a)=>o+a.size,0),totalBytes:r.files.
reduce((o,a)=>o+a.size,0)}]})));kd({organization:gr,sourceUrl:`https://huggingface.co/${gr}`,checkedAt:"2026-11-04",repositories:[
...wy.map(({id:r,repository:e,revision:t})=>({repository:e,revision:t,catalogId:r,format:"GGUF",codecRequired:!1})),{repository:`${gr}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${gr}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${gr}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${gr}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Rs="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Bs="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",nl=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],cu=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function ky(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.
values(r).forEach(ky),Object.freeze(r)),r}const xT=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:r,...e})=>[e.id,ky({...e,
status:"execution-candidate",format:"GGUF",capabilities:cu,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:r,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((t,n)=>t+n.size,0)})])),Ka=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Rs,revision:Bs,status:"ex\
ecution-candidate",format:"GGUF",capabilities:cu,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Rs}/blob\
/${Bs}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Rs,
revision:Bs,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Rs}/blob/${Bs}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Rs,revision:Bs},weightBytes:nl[0].size,totalBytes:nl.reduce((r,e)=>r+e.size,0),files:nl},
...xT,...kT,...ET,...Object.fromEntries(Object.entries(wd).map(([r,e])=>[r,{...e,status:"execution-candidate",capabilities:cu}]))});
function ST(r,e){const t=Ka[r],n=t?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog GGUF model file.");
const s=n.source??{repository:t.repository,revision:t.revision,path:e};return`https://huggingface.co/${s.repository}/res\
olve/${s.revision}/${s.path.split("/").map(encodeURIComponent).join("/")}`}function Ey(r){return r&&typeof r=="object"&&
!Object.isFrozen(r)&&(Object.values(r).forEach(Ey),Object.freeze(r)),r}const vT=[{id:"sd-turbo-onnx",name:"Stable Diffus\
ion Turbo (ONNX FP16)",repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",pipeline:"\
sd-turbo",architecture:"stable-diffusion-2",dtype:"fp16",steps:1,padTokenId:0,files:[{path:"text_encoder/model.onnx",size:681393168,
sha256:"5d1f5bd3286abf26313a9e87db6fd32e47d8b1b2a84ffdf470884c3fe89497c4",source:{repository:"schmuell/sd-turbo-ort-web",
revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"text_encoder/model.onnx"}},{path:"unet/model.onnx",size:1733430199,
sha256:"7468133d9f7babec9cf6636e160188fe25aad206792c0abdaa722edc676963c4",source:{repository:"schmuell/sd-turbo-ort-web",
revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"unet/model.onnx"}},{path:"vae_decoder/model.onnx",size:99094314,
sha256:"b37a85f91a982811957abd6cfb617499742309f7b8e253240da3132e533a7605",source:{repository:"schmuell/sd-turbo-ort-web",
revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"vae_decoder/model.onnx"}},{path:"tokenizer/tokenizer.json",size:2224081,
sha256:"72ed5c96db5729294468543e4bc75fce14ca63f58e37300290189ba1c1e52b85",gitBlobSha1:"f9d4455c06f24d31797f7cd3e480a83d7\
a84cb97",source:{repository:"Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tok\
enizer.json"}},{path:"tokenizer/tokenizer_config.json",size:775,sha256:"60ba2912bc6344c94bc16bbdec27fa1209409167b6f2fdf3\
cfe9e65462ea3967",gitBlobSha1:"c9b2a711cbdd039529fa5a66f1965e13eb14451d",source:{repository:"Xenova/clip-vit-base-patch1\
6",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tokenizer_config.json"}},{path:"README.md",size:195,sha256:"\
ca7ae65e0f226f01cbf95e8e6b4c8f5d98e81648bd2b66280945cbf41311c72e",gitBlobSha1:"5a4d6e3602769d994918631e6b849ef77a8a5d03",
source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1",path:"README.md"}},{path:"\
LICENSE",size:7300,sha256:"305bafee60b129e25bda0745e06ac3c06b496b50ad61bda6265f8d57003f8aca",gitBlobSha1:"ae44226e8f243c\
81374e8bc09ea207dbf601eb3d",source:{repository:"schmuell/sd-turbo-ort-web",revision:"ace89b7d2cd849f9a73914cdbb8a3ea60c8\
53dd1",path:"LICENSE"}}],license:{spdx:"LicenseRef-StabilityAI-NonCommercial-Research",sourceUrl:"https://huggingface.co\
/schmuell/sd-turbo-ort-web/blob/ace89b7d2cd849f9a73914cdbb8a3ea60c853dd1/LICENSE",notice:"This pinned converted artifact\
 includes the November 2023 Stability AI Non-Commercial Research Community license; do not relabel it as the newer upstr\
eam Community license."}},{id:"dreamshaper-8-lcm-int8-onnx",name:"DreamShaper 8 LCM (SD 1.5, INT8 weights)",repository:"\
skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a54854910ed06469192b",pipeline:"lcm",architecture:"\
stable-diffusion-1",dtype:{text_encoder:"fp16",unet:"fp16",vae_decoder:"fp32"},weightQuantization:"int8-per-channel",steps:4,
padTokenId:49407,files:[{path:"text_encoder/model.onnx",size:123612877,sha256:"ff9bd0225990f6827682cfe37cf95912135e4f849\
45ba7f3abfe70a19eeff8fb",source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a5\
4854910ed06469192b",path:"int8/text_encoder_int8.onnx"}},{path:"unet/model.onnx",size:861356871,sha256:"a6bab857c28d27ac\
914a2d8e731011c0d9b361da7553efc6117e04f722e9f4ca",source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"\
a310400909a293a7a937a54854910ed06469192b",path:"int8/unet_int8.onnx"}},{path:"vae_decoder/model.onnx",size:49791103,sha256:"\
7556dbb3d599dbad393dc598b8bf28874245b721aa581f321dfbd0f7211f37d2",source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx\
-webgpu",revision:"a310400909a293a7a937a54854910ed06469192b",path:"int8/vae_decoder_int8.onnx"}},{path:"tokenizer/tokeni\
zer.json",size:2224081,sha256:"72ed5c96db5729294468543e4bc75fce14ca63f58e37300290189ba1c1e52b85",gitBlobSha1:"f9d4455c06\
f24d31797f7cd3e480a83d7a84cb97",source:{repository:"Xenova/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745\
fb4a5d2bba5f",path:"tokenizer.json"}},{path:"tokenizer/tokenizer_config.json",size:775,sha256:"60ba2912bc6344c94bc16bbde\
c27fa1209409167b6f2fdf3cfe9e65462ea3967",gitBlobSha1:"c9b2a711cbdd039529fa5a66f1965e13eb14451d",source:{repository:"Xeno\
va/clip-vit-base-patch16",revision:"342fdf2f67aded64d138ff074745fb4a5d2bba5f",path:"tokenizer_config.json"}},{path:"READ\
ME.md",size:3075,sha256:"7494dee7114e1b1875c7a06f12a908b7ff9d00727785b956e815c066df14a8f6",gitBlobSha1:"97a713da99d2baeb\
8c6312b9238f860530f98eb5",source:{repository:"skillsafeai/dreamshaper-8-lcm-onnx-webgpu",revision:"a310400909a293a7a937a\
54854910ed06469192b",path:"README.md"}},{path:"LICENSE.md",size:14465,sha256:"84804f0a5d78ed48992f7a6640ee6165877ccf9e70\
4669713cababf65558cf4a",gitBlobSha1:"209d7dfbc3b54a404985665a3bf0721d6c53f4d6",source:{repository:"Heliosoph/dreamshaper\
-cfg-onnx",revision:"c07d9ea3c46471649e10b0900a6ec1f785420df4",path:"LICENSE.md"}}],license:{spdx:"CreativeML-OpenRAIL-M",
sourceUrl:"https://huggingface.co/skillsafeai/dreamshaper-8-lcm-onnx-webgpu/blob/a310400909a293a7a937a54854910ed06469192\
b/README.md",notice:"CreativeML Open RAIL-M retains use restrictions. The complete license text is included from a pinne\
d DreamShaper ONNX export. Local image generation is not a guarantee of unrestricted content."},provenance:{baseRepository:"\
Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"}}],Qa=Ey(Object.fromEntries(vT.map(r=>[
r.id,{...r,status:"execution-candidate",format:"ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires hardware WebGPU with shader-f16 and an \
admitted managed ONNX diffusion worker. Device execution must be verified."},provenance:{...r.provenance,repository:r.repository,
revision:r.revision,format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${r.repository}/bl\
ob/${r.revision}/README.md`,fileSources:Object.fromEntries(r.files.map(e=>[e.path,e.source]))},model:{runtime:"onnx-diff\
usion",runtimeVersion:"1.31.1",architecture:r.architecture,format:"ONNX",task:"text-to-image",pipeline:r.pipeline,dtype:r.
dtype,...r.weightQuantization?{weightQuantization:r.weightQuantization}:{},modalities:["text"],outputModalities:["image"],
requiredFeatures:["shader-f16"],width:512,height:512,steps:r.steps,padTokenId:r.padTokenId,repository:r.repository,revision:r.
revision},weightBytes:r.files.filter(e=>e.path.endsWith(".onnx")).reduce((e,t)=>e+t.size,0),totalBytes:r.files.reduce((e,t)=>e+
t.size,0)}])));function AT(r,e){const n=Qa[r]?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog diffusio\
n model file.");const s=n.source;return`https://huggingface.co/${s.repository}/resolve/${s.revision}/${s.path.split("/").
map(encodeURIComponent).join("/")}`}/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */function _T(r){
return r instanceof Uint8Array||ArrayBuffer.isView(r)&&r.constructor.name==="Uint8Array"}function Ep(r,e=""){if(!Number.
isSafeInteger(r)||r<0){const t=e&&`"${e}" `;throw new Error(`${t}expected integer >= 0, got ${r}`)}}function Bi(r,e,t=""){
const n=_T(r),s=r?.length,i=e!==void 0;if(!n||i&&s!==e){const o=t&&`"${t}" `,a=i?` of length ${e}`:"",c=n?`length=${s}`:
`type=${typeof r}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return r}function LB(r){if(typeof r!="function"||
typeof r.create!="function")throw new Error("Hash must wrapped by utils.createHasher");Ep(r.outputLen),Ep(r.blockLen)}function xp(r,e=!0){
if(r.destroyed)throw new Error("Hash instance has been destroyed");if(e&&r.finished)throw new Error("Hash#digest() has a\
lready been called")}function IT(r,e){Bi(r,void 0,"digestInto() output");const t=e.outputLen;if(r.length<t)throw new Error(
'"digestInto() output" expected to be of length >='+t)}function bn(...r){for(let e=0;e<r.length;e++)r[e].fill(0)}function sl(r){
return new DataView(r.buffer,r.byteOffset,r.byteLength)}function Xt(r,e){return r<<32-e|r>>>e}function il(r,e){return r<<
e|r>>>32-e>>>0}const xy=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",CT=Array.from(
{length:256},(r,e)=>e.toString(16).padStart(2,"0"));function TT(r){if(Bi(r),xy)return r.toHex();let e="";for(let t=0;t<r.
length;t++)e+=CT[r[t]];return e}const dr={_0:48,_9:57,A:65,F:70,a:97,f:102};function Sp(r){if(r>=dr._0&&r<=dr._9)return r-
dr._0;if(r>=dr.A&&r<=dr.F)return r-(dr.A-10);if(r>=dr.a&&r<=dr.f)return r-(dr.a-10)}function DB(r){if(typeof r!="string")
throw new Error("hex string expected, got "+typeof r);if(xy)return Uint8Array.fromHex(r);const e=r.length,t=e/2;if(e%2)throw new Error(
"hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(t);for(let s=0,i=0;s<t;s++,i+=2){const o=Sp(
r.charCodeAt(i)),a=Sp(r.charCodeAt(i+1));if(o===void 0||a===void 0){const c=r[i]+r[i+1];throw new Error('hex string expe\
cted, got non-hex character "'+c+'" at index '+i)}n[s]=o*16+a}return n}const MT=async()=>{};async function PB(r,e,t){let n=Date.
now();for(let s=0;s<r;s++){t(s);const i=Date.now()-n;i>=0&&i<e||(await MT(),n+=i)}}function RT(r){if(typeof r!="string")
throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(r))}function $B(r,e=""){return typeof r==
"string"?RT(r):Bi(r,void 0,e)}function NB(...r){let e=0;for(let n=0;n<r.length;n++){const s=r[n];Bi(s),e+=s.length}const t=new Uint8Array(
e);for(let n=0,s=0;n<r.length;n++){const i=r[n];t.set(i,s),s+=i.length}return t}function UB(r,e){if(e!==void 0&&{}.toString.
call(e)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(r,e)}function Ed(r,e={}){
const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=s=>r(s),
Object.assign(t,e),Object.freeze(t)}function FB(r=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.
getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(
r))}const Sy=r=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,r])});function vy(r,e,t){return r&e^~r&t}function Ay(r,e,t){
return r&e^r&t^e&t}class xd{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=sl(this.buffer)}update(e){
xp(this),Bi(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;for(let o=0;o<i;){const a=Math.min(s-this.pos,i-o);if(a===
s){const c=sl(e);for(;s<=i-o;o+=s)this.process(c,o);continue}n.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===
s&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){xp(this),IT(e,this),
this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=128,bn(this.buffer.subarray(o)),this.
padOffset>s-o&&(this.process(n,0),o=0);for(let d=o;d<s;d++)t[d]=0;n.setBigUint64(s-8,BigInt(this.length*8),i),this.process(
n,0);const a=sl(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,u=this.
get();if(l>u.length)throw new Error("_sha2: outputLen bigger than state");for(let d=0;d<l;d++)a.setUint32(4*d,u[d],i)}digest(){
const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.
constructor,e.set(...this.get());const{blockLen:t,buffer:n,length:s,finished:i,destroyed:o,pos:a}=this;return e.destroyed=
o,e.finished=i,e.length=s,e.pos=a,s%t&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const Br=Uint32Array.from([1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),We=Uint32Array.from([1779033703,4089235720,
3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,
1541459225,327033209]),Xi=BigInt(2**32-1),vp=BigInt(32);function BT(r,e=!1){return e?{h:Number(r&Xi),l:Number(r>>vp&Xi)}:
{h:Number(r>>vp&Xi)|0,l:Number(r&Xi)|0}}function LT(r,e=!1){const t=r.length;let n=new Uint32Array(t),s=new Uint32Array(
t);for(let i=0;i<t;i++){const{h:o,l:a}=BT(r[i],e);[n[i],s[i]]=[o,a]}return[n,s]}const Ap=(r,e,t)=>r>>>t,_p=(r,e,t)=>r<<32-
t|e>>>t,Bn=(r,e,t)=>r>>>t|e<<32-t,Ln=(r,e,t)=>r<<32-t|e>>>t,Yi=(r,e,t)=>r<<64-t|e>>>t-32,Zi=(r,e,t)=>r>>>t-32|e<<64-t;function hr(r,e,t,n){
const s=(e>>>0)+(n>>>0);return{h:r+t+(s/2**32|0)|0,l:s|0}}const DT=(r,e,t)=>(r>>>0)+(e>>>0)+(t>>>0),PT=(r,e,t,n)=>e+t+n+
(r/2**32|0)|0,$T=(r,e,t,n)=>(r>>>0)+(e>>>0)+(t>>>0)+(n>>>0),NT=(r,e,t,n,s)=>e+t+n+s+(r/2**32|0)|0,UT=(r,e,t,n,s)=>(r>>>0)+
(e>>>0)+(t>>>0)+(n>>>0)+(s>>>0),FT=(r,e,t,n,s,i)=>e+t+n+s+i+(r/2**32|0)|0,OT=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Lr=new Uint32Array(64);class zT extends xd{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:t,C:n,D:s,E:i,
F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0,this.
F=o|0,this.G=a|0,this.H=c|0}process(e,t){for(let d=0;d<16;d++,t+=4)Lr[d]=e.getUint32(t,!1);for(let d=16;d<64;d++){const h=Lr[d-
15],p=Lr[d-2],g=Xt(h,7)^Xt(h,18)^h>>>3,y=Xt(p,17)^Xt(p,19)^p>>>10;Lr[d]=y+Lr[d-7]+g+Lr[d-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let d=0;d<64;d++){const h=Xt(a,6)^Xt(a,11)^Xt(a,25),p=u+h+vy(a,c,l)+OT[d]+Lr[d]|0,y=(Xt(n,2)^Xt(n,13)^
Xt(n,22))+Ay(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){bn(Lr)}destroy(){this.set(0,0,0,0,0,0,
0,0),bn(this.buffer)}}class qT extends zT{A=Br[0]|0;B=Br[1]|0;C=Br[2]|0;D=Br[3]|0;E=Br[4]|0;F=Br[5]|0;G=Br[6]|0;H=Br[7]|
0;constructor(){super(32)}}const _y=LT(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189db\
bc","0x3956c25bf348b538","0x59f111f1b605d019","0x923f82a4af194f9b","0xab1c5ed5da6d8118","0xd807aa98a3030242","0x12835b01\
45706fbe","0x243185be4ee4b28c","0x550c7dc3d5ffb4e2","0x72be5d74f27b896f","0x80deb1fe3b1696b1","0x9bdc06a725c71235","0xc1\
9bf174cf692694","0xe49b69c19ef14ad2","0xefbe4786384f25e3","0x0fc19dc68b8cd5b5","0x240ca1cc77ac9c65","0x2de92c6f592b0275",
"0x4a7484aa6ea6e483","0x5cb0a9dcbd41fbd4","0x76f988da831153b5","0x983e5152ee66dfab","0xa831c66d2db43210","0xb00327c898fb\
213f","0xbf597fc7beef0ee4","0xc6e00bf33da88fc2","0xd5a79147930aa725","0x06ca6351e003826f","0x142929670a0e6e70","0x27b70a\
8546d22ffc","0x2e1b21385c26c926","0x4d2c6dfc5ac42aed","0x53380d139d95b3df","0x650a73548baf63de","0x766a0abb3c77b2a8","0x\
81c2c92e47edaee6","0x92722c851482353b","0xa2bfe8a14cf10364","0xa81a664bbc423001","0xc24b8b70d0f89791","0xc76c51a30654be3\
0","0xd192e819d6ef5218","0xd69906245565a910","0xf40e35855771202a","0x106aa07032bbd1b8","0x19a4c116b8d2d0c8","0x1e376c085\
141ab53","0x2748774cdf8eeb99","0x34b0bcb5e19b48a8","0x391c0cb3c5c95a63","0x4ed8aa4ae3418acb","0x5b9cca4f7763e373","0x682\
e6ff3d6b2b8a3","0x748f82ee5defb2fc","0x78a5636f43172f60","0x84c87814a1f0ab72","0x8cc702081a6439ec","0x90befffa23631e28",
"0xa4506cebde82bde9","0xbef9a3f7b2c67915","0xc67178f2e372532b","0xca273eceea26619c","0xd186b8c721c0c207","0xeada7dd6cde0\
eb1e","0xf57d4f7fee6ed178","0x06f067aa72176fba","0x0a637dc5a2c898a6","0x113f9804bef90dae","0x1b710b35131c471b","0x28db77\
f523047d84","0x32caab7b40c72493","0x3c9ebe0a15c9bebc","0x431d67c49c100d4c","0x4cc5d4becb3e42b6","0x597f299cfc657e2a","0x\
5fcb6fab3ad6faec","0x6c44198c4a475817"].map(r=>BigInt(r))),jT=_y[0],GT=_y[1],Dr=new Uint32Array(80),Pr=new Uint32Array(80);
class WT extends xd{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:t,Bh:n,Bl:s,Ch:i,Cl:o,Dh:a,Dl:c,Eh:l,El:u,Fh:d,
Fl:h,Gh:p,Gl:g,Hh:y,Hl:m}=this;return[e,t,n,s,i,o,a,c,l,u,d,h,p,g,y,m]}set(e,t,n,s,i,o,a,c,l,u,d,h,p,g,y,m){this.Ah=e|0,
this.Al=t|0,this.Bh=n|0,this.Bl=s|0,this.Ch=i|0,this.Cl=o|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=u|0,this.Fh=d|0,
this.Fl=h|0,this.Gh=p|0,this.Gl=g|0,this.Hh=y|0,this.Hl=m|0}process(e,t){for(let w=0;w<16;w++,t+=4)Dr[w]=e.getUint32(t),
Pr[w]=e.getUint32(t+=4);for(let w=16;w<80;w++){const k=Dr[w-15]|0,x=Pr[w-15]|0,A=Bn(k,x,1)^Bn(k,x,8)^Ap(k,x,7),S=Ln(k,x,
1)^Ln(k,x,8)^_p(k,x,7),E=Dr[w-2]|0,_=Pr[w-2]|0,I=Bn(E,_,19)^Yi(E,_,61)^Ap(E,_,6),M=Ln(E,_,19)^Zi(E,_,61)^_p(E,_,6),T=$T(
S,M,Pr[w-7],Pr[w-16]),$=NT(T,A,I,Dr[w-7],Dr[w-16]);Dr[w]=$|0,Pr[w]=T|0}let{Ah:n,Al:s,Bh:i,Bl:o,Ch:a,Cl:c,Dh:l,Dl:u,Eh:d,
El:h,Fh:p,Fl:g,Gh:y,Gl:m,Hh:f,Hl:b}=this;for(let w=0;w<80;w++){const k=Bn(d,h,14)^Bn(d,h,18)^Yi(d,h,41),x=Ln(d,h,14)^Ln(
d,h,18)^Zi(d,h,41),A=d&p^~d&y,S=h&g^~h&m,E=UT(b,x,S,GT[w],Pr[w]),_=FT(E,f,k,A,jT[w],Dr[w]),I=E|0,M=Bn(n,s,28)^Yi(n,s,34)^
Yi(n,s,39),T=Ln(n,s,28)^Zi(n,s,34)^Zi(n,s,39),$=n&i^n&a^i&a,D=s&o^s&c^o&c;f=y|0,b=m|0,y=p|0,m=g|0,p=d|0,g=h|0,{h:d,l:h}=
hr(l|0,u|0,_|0,I|0),l=a|0,u=c|0,a=i|0,c=o|0,i=n|0,o=s|0;const U=DT(I,T,D);n=PT(U,_,M,$),s=U|0}({h:n,l:s}=hr(this.Ah|0,this.
Al|0,n|0,s|0)),{h:i,l:o}=hr(this.Bh|0,this.Bl|0,i|0,o|0),{h:a,l:c}=hr(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:u}=hr(this.Dh|
0,this.Dl|0,l|0,u|0),{h:d,l:h}=hr(this.Eh|0,this.El|0,d|0,h|0),{h:p,l:g}=hr(this.Fh|0,this.Fl|0,p|0,g|0),{h:y,l:m}=hr(this.
Gh|0,this.Gl|0,y|0,m|0),{h:f,l:b}=hr(this.Hh|0,this.Hl|0,f|0,b|0),this.set(n,s,i,o,a,c,l,u,d,h,p,g,y,m,f,b)}roundClean(){
bn(Dr,Pr)}destroy(){bn(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class VT extends WT{Ah=We[0]|0;Al=We[1]|0;Bh=We[2]|
0;Bl=We[3]|0;Ch=We[4]|0;Cl=We[5]|0;Dh=We[6]|0;Dl=We[7]|0;Eh=We[8]|0;El=We[9]|0;Fh=We[10]|0;Fl=We[11]|0;Gh=We[12]|0;Gl=We[13]|
0;Hh=We[14]|0;Hl=We[15]|0;constructor(){super(64)}}const HT=Ed(()=>new qT,Sy(1)),OB=Ed(()=>new VT,Sy(3)),KT="transformer\
s.js",Sd="4.3.2",de=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),QT=Object.freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,
minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),JT=Object.freeze({maxModelBytes:de.maxModelBytes,minimumCpuBytes:0,
minimumGpuBytes:0,maxProcessedImagePixels:de.maxImagePixels}),ol=new Set(["qwen3","qwen2","llama"]);function Ja(r){return r?.
architecture==="qwen3_5"?QT:JT}function lu(r="Operation cancelled"){return r?.name==="AbortError"?r:new DOMException(typeof r==
"string"?r:"Operation cancelled","AbortError")}function Xe(r){if(r?.aborted)throw lu(r.reason)}function Os(r){if(typeof r!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(r))throw new Error("Invalid model session ID");return r}function fa(r){if(typeof r!=
"string"||!r||new TextEncoder().encode(r).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(r)||r.startsWith("/")||r.split(
"/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return r}function XT(r){let e;try{e=JSON.
stringify(r)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>de.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const t=JSON.parse(e);if(t.schema!=="peercompute.artifact.\
manifest.v1"||!Array.isArray(t.files)||!t.files.length||t.files.length>de.maxFiles)throw new Error("Invalid model manife\
st files");const n=new Set,s=Ja(t.model);let i=0;for(const u of t.files){if(fa(u.path),n.has(u.path))throw new Error("Du\
plicate model artifact path");n.add(u.path);const d=Zn.parse(u.cid);if(![85,112].includes(d.code)||d.multihash.code!==18||
d.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||!/^[a-f0-9]{64}$/i.
test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),i+=u.size,!Number.
isSafeInteger(i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=t.model;if(o?.runtime!==
KT||o.runtimeVersion!==Sd||![...ol,"idefics3","smolvlm","qwen3_5"].includes(o.architecture))throw new Error("Model runti\
me, architecture or dtype is not approved");if(o.task??=ol.has(o.architecture)?"text-generation":"image-text-to-text",![
"text-generation","image-text-to-text"].includes(o.task)||ol.has(o.architecture)!==(o.task==="text-generation"))throw new Error(
"Model task does not match its admitted architecture");const a=typeof o.dtype=="string"?[["model",o.dtype]]:o.dtype&&typeof o.
dtype=="object"&&!Array.isArray(o.dtype)?Object.entries(o.dtype):[];if(!a.length||a.length>16||a.some(([u,d])=>!/^[A-Za-z0-9_-]{1,100}$/.
test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(d)))throw new Error("Invalid model dtype configuration");if(o.architecture===
"qwen3_5"&&a.some(([,u])=>u!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const c=u=>u==="fp3\
2"?"":u==="q8"?"_quantized":`_${u}`,l=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof o.dtype!="stri\
ng"||o.task==="text-generation")&&l.push(...a.map(([u,d])=>`onnx/${u}${c(d)}.onnx`)),o.task==="image-text-to-text")for(const u of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const d=typeof o.dtype=="string"?o.dtype:o.dtype[u];if(!d)throw new Error(
"Multimodal dtype configuration is missing a module");l.push(`onnx/${u}${c(d)}.onnx`),o.architecture==="qwen3_5"&&l.push(
`onnx/${u}${c(d)}.onnx_data`)}if(l.some(u=>!n.has(u)))throw new Error("Incomplete model package");if(o.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(o.requiredFeatures!==void 0&&(!Array.isArray(o.requiredFeatures)||o.requiredFeatures.length>
32||o.requiredFeatures.some(u=>typeof u!="string"||u.length>80)))throw new Error("Invalid model GPU features");return{manifest:t,
totalBytes:i,resourcePolicy:s}}function YT(r,e){const t=new URL(e),n={};for(const s of["mjs","wasm"]){if(typeof r?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(r[s],t);if(i.origin!==t.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const wt=1024**3,ZT=[...Object.values(Ha),...Object.values(
Ka),...Object.values(Qa)],eM=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxCompute\
InvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWor\
kgroupsPerDimension"],tM=new Set(["transformers.js","llama.cpp","onnx-diffusion"]);function uu(r,e=ZT){const t=r?.model??
r??{},n=e.filter(s=>s.model.runtime===t.runtime&&(s.repository??s.model.repository)===(t.repository??r?.repository)&&(s.
revision??s.model.revision)===(t.revision??r?.revision)&&["architecture","task","format","dtype"].every(i=>!r?.model&&t[i]===
void 0||vd(t[i],s.model[i]))&&(!r?.model||!Array.isArray(r.files)||!Array.isArray(s.files)||rM(t.runtime,r.files,s.files)));
return n.length===1?n[0]:r?.model?void 0:n.find(s=>s.id===r?.modelId)}function rM(r,e,t){const n=o=>r!=="llama.cpp"||o.path?.
endsWith(".gguf"),s=e.filter(n),i=t.filter(n);return s.length===i.length&&s.every(o=>i.some(a=>a.path===o.path&&a.size===
o.size&&(a.sha256===void 0||a.sha256===o.sha256)))}function Iy(r){const e=r?.model??r??{},t=uu(r),n=r?.model?e:t?.model??
e,s=r?.files??t?.files;let i=null;if(s!==void 0){if(!Array.isArray(s)||!s.length||s.length>de.maxFiles)throw new Error("\
Invalid model file list");i=0;for(const o of s){if(!o||!Number.isSafeInteger(o.size)||o.size<0)throw new Error("Invalid \
model file size");if(i+=o.size,!Number.isSafeInteger(i))throw new Error("Invalid model package size")}}else Number.isSafeInteger(
r?.totalBytes)&&r.totalBytes>=0&&(i=r.totalBytes);return{model:n,files:s,trusted:t,totalBytes:i,descriptorOnly:!r?.model&&
!t&&s===void 0}}function ko(r){const{model:e,totalBytes:t}=Iy(r);if(e.runtime==="onnx-diffusion")return{cpuBytes:8*wt,gpuBytes:8*
wt};if(e.runtime==="llama.cpp"){if(t===null)return{cpuBytes:0,gpuBytes:0};const n=t>4*wt;return{cpuBytes:(n?8:2)*wt,gpuBytes:(n?
16:2)*wt}}if(e.runtime==="transformers.js"){const n=Ja(e);return{cpuBytes:Math.max(4*wt,n.minimumCpuBytes),gpuBytes:Math.
max(4*wt,n.minimumGpuBytes)}}throw new Error("Unsupported model runtime")}function du(r={}){if(r===null&&(r={}),typeof r!=
"object"||Array.isArray(r)||![Object.prototype,null].includes(Object.getPrototypeOf(r))||Object.keys(r).some(t=>!["cpuBy\
tes","gpuBytes"].includes(t)))throw new TypeError("Invalid model memory budgets");const e={};for(const t of["cpuBytes","\
gpuBytes"]){const n=r[t];if(n==null)e[t]=null;else{if(!Number.isSafeInteger(n)||n<=0||n>1024*wt)throw new RangeError(`In\
valid ${t} memory budget`);e[t]=n}}return e}async function nM({scope:r=globalThis,timeoutMs:e=3e3}={}){if(!Number.isSafeInteger(
e)||e<1||e>6e4)throw new RangeError("Invalid device probe timeout");const t=r.WebAssembly,n=r.navigator?.deviceMemory,s={
webgpu:null,features:[],limits:{},crossOriginIsolated:r.crossOriginIsolated===!0,sharedArrayBuffer:typeof r.SharedArrayBuffer==
"function",jspi:typeof t?.Suspending=="function"&&typeof t?.promising=="function",memory64:!1,deviceMemoryGiB:typeof n==
"number"&&Number.isFinite(n)&&n>0?n:null};if(s.sharedArrayBuffer&&typeof t?.Memory=="function")try{new t.Memory({initial:0n,
maximum:1n,shared:!0,address:"i64"}),s.memory64=!0}catch{}const i=r.navigator?.gpu;if(typeof i?.requestAdapter!="functio\
n")return{...s,webgpu:!1};const o=performance.now()+e,a=new Error("GPU capability check timed out");let c,l,u,d=!1;const h=()=>{
if(d||performance.now()>=o)throw a},p=async()=>{h();let g=await i.requestAdapter({powerPreference:"high-performance"});return h(),
g==null&&(await new Promise(y=>{u=y,l=setTimeout(y,100)}),l=u=void 0,h(),g=await i.requestAdapter({powerPreference:"high\
-performance"}),h()),g};try{const g=await Promise.race([p(),new Promise((y,m)=>{c=setTimeout(()=>m(a),e)})]);if(!g||g.isFallbackAdapter||
g.info?.isFallbackAdapter)return{...s,webgpu:!1};s.features=[...g.features].filter(y=>typeof y=="string"&&y.length<=80).
slice(0,64).sort();for(const y of eM){const m=g.limits?.[y];Number.isSafeInteger(m)&&m>0&&(s.limits[y]=m)}s.webgpu=!0}catch(g){
s.probeError=String(g?.message??g).slice(0,300)}finally{d=!0,clearTimeout(c),clearTimeout(l),u?.()}return s}function sM({
model:r,files:e,totalBytes:t,trusted:n,descriptorOnly:s}){if(!tM.has(r.runtime))return["runtime_unsupported","This model\
 runtime is not supported locally"];if(r.requiredFeatures!==void 0&&(!Array.isArray(r.requiredFeatures)||r.requiredFeatures.
length>32||r.requiredFeatures.some(o=>typeof o!="string"||!o||o.length>80)))return["model_invalid","Invalid model GPU fe\
ature requirements"];const i=r.runtime==="llama.cpp"?16*wt:r.runtime==="onnx-diffusion"?3*wt:Ja(r).maxModelBytes;if(!s&&
t!==null&&t>i)return["package_too_large",`Model package is ${(t/wt).toFixed(2)} GiB; this runtime supports up to ${Number(
(i/wt).toFixed(2))} GiB.`];if(r.runtime==="transformers.js"){if((!s||r.runtimeVersion!==void 0)&&r.runtimeVersion!==Sd||
(!s||r.architecture!==void 0)&&!["qwen2","qwen3","llama","qwen3_5","idefics3","smolvlm"].includes(r.architecture))return[
"runtime_unsupported","Model version or architecture is not supported locally"];const o=typeof r.dtype=="string"?[r.dtype]:
r.dtype&&typeof r.dtype=="object"&&!Array.isArray(r.dtype)?Object.values(r.dtype):[];if((!s||r.dtype!==void 0)&&(!o.length||
o.some(a=>!["fp32","fp16","q4","q4f16","q8"].includes(a))||r.architecture==="qwen3_5"&&o.some(a=>a!=="q4")))return["runt\
ime_unsupported","Model precision is not supported by this runtime"]}else{if(!n||r.runtimeVersion!==n.model.runtimeVersion&&
!(r.runtime==="llama.cpp"&&n.model.runtimeVersion===void 0&&r.runtimeVersion==="3.8.1"))return["catalog_unsupported","Th\
is package is not in the approved local runtime catalog"];for(const o of r.runtime==="onnx-diffusion"?["architecture","t\
ask","format","dtype","pipeline","width","height","steps","padTokenId","weightQuantization","modalities","outputModaliti\
es","requiredFeatures"]:["architecture","task","format","dtype"])if(!vd(r[o],n.model[o]))return["catalog_unsupported","M\
odel profile differs from the approved runtime catalog"];if(e){const o=r.runtime==="llama.cpp"?n.files.filter(c=>c.path.
endsWith(".gguf")):n.files,a=r.runtime==="llama.cpp"?e.filter(c=>c.path?.endsWith(".gguf")):e;if(a.length!==o.length||a.
some(c=>!o.some(l=>l.path===c.path&&l.size===c.size&&l.sha256===c.sha256)))return["catalog_unsupported","Model files dif\
fer from the approved runtime catalog"]}}return r.runtime==="onnx-diffusion"&&e?.some(o=>o.size<=0||o.size>=2*wt)?["file\
_too_large","A file exceeds the diffusion loader’s supported buffer size"]:null}function vd(r,e){return r===e?!0:!r||!e||
typeof r!="object"||typeof e!="object"||Array.isArray(r)!==Array.isArray(e)?!1:Object.keys(r).length===Object.keys(e).length&&
Object.keys(r).every(t=>vd(r[t],e[t]))}function iM(r,{device:e,budgets:t={}}={}){const n=du(t);let s,i,o;try{s=Iy(r),i=ko(
r)}catch(h){o=h,i={cpuBytes:0,gpuBytes:0}}const a=(h,p,g)=>({status:h,reason:g,code:p,...i});if(!e)return a("checking","\
device_checking","Checking device compatibility");if(o)return a("unavailable","model_invalid",o.message);const c=sM(s);if(c)
return a("unavailable",...c);if(n.cpuBytes!==null&&i.cpuBytes>n.cpuBytes)return a("unavailable","cpu_budget_exceeded","E\
xceeds configured RAM memory budget");if(n.gpuBytes!==null&&i.gpuBytes>n.gpuBytes)return a("unavailable","gpu_budget_exc\
eeded","Exceeds configured GPU memory budget");if(e.webgpu===!1)return a("unavailable","webgpu_unavailable","Hardware We\
bGPU is unavailable in this browser");if(s.model.runtime==="llama.cpp")for(const[h,p]of[["crossOriginIsolated","GGUF req\
uires cross-origin isolation"],["sharedArrayBuffer","GGUF requires SharedArrayBuffer"],["jspi","GGUF requires WebAssembl\
y JSPI"],["memory64","GGUF requires shared WebAssembly memory64"]]){if(e[h]===!1)return a("unavailable",`gguf_${h}_unava\
ilable`,p);if(e[h]!==!0)return a("unknown","device_probe_unknown","GGUF browser prerequisites have not been verified")}if(e.
webgpu!==!0)return a("unknown","device_probe_unknown","GPU capability check is incomplete; RAM/GPU memory fit is unverif\
ied");const l=new Set(e.features??[]),u=new Set(s.model.requiredFeatures??[]),d=s.model.dtype;(s.model.runtime!=="transf\
ormers.js"||(typeof d=="string"?[d]:Object.values(d??{})).some(h=>["fp16","q4f16"].includes(h)))&&u.add("shader-f16");for(const h of u)
if(!l.has(h))return a("unavailable","gpu_feature_unavailable",h==="shader-f16"?"Required FP16 GPU math (shader-f16) is u\
navailable in this browser":`Required GPU feature ${h} is unavailable in this browser`);return s.descriptorOnly?a("unkno\
wn","model_metadata_unverified","Model metadata and RAM/GPU memory fit require verification before loading"):a("unknown",
"memory_fit_unverified","Required features are supported; RAM/GPU memory fit is unverified")}const Ls=Uint32Array.from([
1732584193,4023233417,2562383102,271733878,3285377520]),$r=new Uint32Array(80);class oM extends xd{A=Ls[0]|0;B=Ls[1]|0;C=Ls[2]|
0;D=Ls[3]|0;E=Ls[4]|0;constructor(){super(64,20,8,!1)}get(){const{A:e,B:t,C:n,D:s,E:i}=this;return[e,t,n,s,i]}set(e,t,n,s,i){
this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0}process(e,t){for(let c=0;c<16;c++,t+=4)$r[c]=e.getUint32(t,!1);for(let c=16;c<
80;c++)$r[c]=il($r[c-3]^$r[c-8]^$r[c-14]^$r[c-16],1);let{A:n,B:s,C:i,D:o,E:a}=this;for(let c=0;c<80;c++){let l,u;c<20?(l=
vy(s,i,o),u=1518500249):c<40?(l=s^i^o,u=1859775393):c<60?(l=Ay(s,i,o),u=2400959708):(l=s^i^o,u=3395469782);const d=il(n,
5)+l+a+u+$r[c]|0;a=o,o=i,i=il(s,30),s=n,n=d}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.E|0,this.set(n,
s,i,o,a)}roundClean(){bn($r)}destroy(){this.set(0,0,0,0,0),bn(this.buffer)}}const aM=Ed(()=>new oM);function cM(){let r=Promise.
resolve();return{run(e,{signal:t}={}){const n=r.catch(()=>{}).then(()=>(t?.throwIfAborted(),e()));return r=n,n},settled:()=>r.
catch(()=>{})}}function Cy(r){if(r?.code==="ERR_MODEL_STORAGE_FULL"||r?.name!=="QuotaExceededError")return r;const e=new Error(
"The browser refused additional storage. Delete an unused stored model or free device storage, then retry the import.",{
cause:r});return e.name="QuotaExceededError",e.code="ERR_MODEL_STORAGE_FULL",e}async function Ip(r,e,t,{signal:n,onProgress:s,
fetchImpl:i=fetch}={}){try{return await r.withRetention(async o=>{const a=[];for(let c=0;c<e.files.length;c+=1){n?.throwIfAborted();
const l=e.files[c],u=()=>globalThis.performance?.now()??Date.now();let d=0,h=u();const p=()=>s?.({stage:"import",path:l.
path,index:c,total:e.files.length,loaded:d,totalBytes:l.size});p();let g=l.cid?await o.stat(l.cid,{signal:n}):null;if(!g||
g.status!=="complete"||g.size!==l.size||g.sha256!==l.sha256){const y=await i(t(l.path),{signal:n});if(!y.ok||!y.body)throw new Error(
`Artifact source failed: ${l.path} (${y.status})`);const m=l.gitBlobSha1?aM.create().update(new TextEncoder().encode(`bl\
ob ${l.size}\0`)):null;async function*f(){for await(const b of y.body){n?.throwIfAborted(),m?.update(b),d+=b.byteLength,
yield b;const w=u();d<l.size&&w-h>=100&&(h=w,p())}if(m&&TT(m.digest())!==l.gitBlobSha1)throw new Error(`Source Git blob \
SHA-1 mismatch: ${l.path}`)}g=await o.importFile(f(),{expectedSize:l.size,...l.sha256?{expectedSha256:l.sha256}:{},signal:n,
pin:!1})}if(l.cid&&g.cid!==l.cid)throw new Error(`Imported CID differs: ${l.path}`);n?.throwIfAborted(),d=l.size,p(),a.push(
{path:l.path,cid:g.cid,size:g.size,sha256:g.sha256})}return n?.throwIfAborted(),s?.({stage:"verify",total:e.files.length,
totalBytes:a.reduce((c,l)=>c+l.size,0)}),n?.throwIfAborted(),o.importManifest({...e,files:a},{pin:!0,signal:n})},{signal:n})}catch(o){
throw Cy(o)}}async function lM(r,{signal:e}={}){const t=[];for await(const n of r.list({signal:e}))e?.throwIfAborted(),n.
kind==="manifest"&&["complete","deleting"].includes(n.status)&&n.manifest?.model?.runtime&&t.push(n);return t}async function uM(r,e,{
signal:t}={}){const n=r.store,s=r.networkManager?.getArtifactTransport?.();if(!n.persistent||s?.store===n&&s.releaseOwnership)
return e();if(!n.lockManager?.request){if(n.backend?.hasExclusiveLock)return e();throw new Error("Stored model deletion \
requires exclusive network ownership for this store")}return n.lockManager.request(`${n.lockName}:network-owner`,{mode:"\
exclusive",ifAvailable:!0},async i=>{if(!i)throw new Error("Another tab owns file sharing for this library. Delete the m\
odel from that tab, or close that tab and retry.");return t?.throwIfAborted(),e()})}const dM="qwen3.5-0.8b-abliterated-q\
4-k-m-gguf";function Ty({storeName:r="inference-models",storage:e,locks:t=globalThis.navigator?.locks}={}){const n=`peer\
compute:model-console:last-loaded:v1:${encodeURIComponent(String(r))}`;if(e===void 0)try{e=globalThis.localStorage}catch{
e=null}function s(u){if(u?.version!==1||typeof u.manifestCid!="string"||u.manifestCid.length>128||typeof u.modelId!="str\
ing"||!u.modelId||u.modelId.length>256||u.selectionId!==void 0&&!/^[a-f0-9-]{36}$/.test(u.selectionId))return null;try{return{
version:1,manifestCid:ye(u.manifestCid).toString(),modelId:u.modelId,...u.selectionId?{selectionId:u.selectionId}:{}}}catch{
return null}}let i=null,o=!1;const a=()=>i?{...i}:null;function c(u=!1){if(o&&!u)return a();try{if(!e?.getItem)return a();
const d=e.getItem(n);try{i=typeof d=="string"&&d.length<=1024?s(JSON.parse(d)):null}catch{i=null}o=!1}catch{}return a()}
async function l(u,d){if(!t?.request)return u(!0);try{return await t.request(`${n}:write`,{mode:"exclusive",signal:d?AbortSignal.
any([d,AbortSignal.timeout(1e3)]):AbortSignal.timeout(1e3)},()=>u(!0))}catch{return u(!1)}}return c(),{readLastLoaded:c,
rememberLoaded(u,{signal:d}={}){const h=s({...u,version:1,selectionId:crypto.randomUUID()});if(!h)throw new TypeError("A\
 stored model preference requires a valid CID and model ID");return l(p=>{if(d?.aborted)return c();if(i=h,o=!p,p)try{e?.
setItem(n,JSON.stringify(h))}catch{o=!0}return a()},d)},clearLastLoaded(u=a()){const d=s(u);return l(h=>{const p=c(!0);if(!d||
!p||p.manifestCid!==d.manifestCid||p.modelId!==d.modelId||p.selectionId!==d.selectionId)return p;if(i=null,o=!h,h)try{e?.
removeItem(n)}catch{o=!0}return null})}}}const hM="https://secretworkshop.net/peercompute/config/relay-config.json";async function Cp(r,{
fetchImpl:e,signal:t,maximumBytes:n}){const s=await e(r,{cache:"no-store",signal:t});if(!s.ok||!s.body)throw new Error(`\
Relay configuration unavailable (${s.status})`);const i=[];let o=0;for await(const l of s.body){if(o+=l.byteLength,o>n)throw new Error(
"Relay configuration exceeds its byte limit");i.push(l)}const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=
l.byteLength;return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(a))}async function fM({fetchImpl:r=globalThis.
fetch,signal:e,baseUrl:t=globalThis.location?.href}={}){const n=AbortSignal.timeout(2e4),s=e?AbortSignal.any([e,n]):n;let i;
try{i=await Cp(new URL("./relay-config-source.json",t).href,{fetchImpl:r,signal:s,maximumBytes:16*1024})}catch(l){if(s.aborted)
throw l}const o=new URL(i?.relayConfigUrl??hM);if(o.protocol!=="https:"||o.hostname!=="secretworkshop.net"||o.username||
o.password)throw new Error("Relay configuration must use the approved Secret Workshop HTTPS backend");const a=await Cp(o.
href,{fetchImpl:r,signal:s,maximumBytes:64*1024}),c=[...new Set((Array.isArray(a.bootstrapPeers)?a.bootstrapPeers:[]).filter(
l=>typeof l=="string"&&l.length<=2048&&l.startsWith("/")&&l.includes("/wss/")&&l.includes("/p2p/")))].slice(0,16);if(!c.
length)throw new Error("Production relay configuration contains no secure bootstrap peers");return{bootstrapPeers:c,transportManager:{
faultTolerance:"no-fatal"},...a.webrtc&&typeof a.webrtc=="object"?{webrtc:a.webrtc}:{},pubsubType:a.pubsubType==="gossip\
sub"?"gossipsub":"floodsub",...a.gossipsub&&typeof a.gossipsub=="object"?{gossipsub:a.gossipsub}:{}}}function Nr(r=0){return new Uint8Array(
r)}function pa(r=0){return new Uint8Array(r)}function pM(r){return r?.buffer instanceof ArrayBuffer}function mM(r){if(pM(
r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Tp(r,e){e==null&&(e=r.reduce((s,i)=>s+
i.length,0));const t=pa(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return mM(t)}function gM(r,e){if(r===e)return!0;
if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}const My=Symbol.
for("@achingbrain/uint8arraylist");function Mp(r,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function eo(r){return!!r?.[My]}class Jr{bufs;length;[My]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.
appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(eo(n)){t+=n.byteLength;for(const s of n.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,
this.bufs.unshift(n);else if(eo(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Mp(this.bufs,e);return t.buf[t.index]}set(e,t){
const n=Mp(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,
e[n]);else if(eo(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{
bufs:n,length:s}=this._subList(e,t);return Tp(n,s)}subarray(e,t){const{bufs:n,length:s}=this._subList(e,t);return n.length===
1?n[0]:Tp(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new Jr;return i.length=s,i.bufs=n,i}_subList(e,t){
if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)throw new RangeError("index \
is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[...this.bufs],length:this.length};
const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const d=e-a;n.push(o.subarray(d,d+(t-e)));break}if(l){if(e===
0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.
push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!eo(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(
t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let d=0;d<i;d++)o[d]=-1;
for(let d=0;d<s;d++)o[n[d]]=d;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let d=t;d<=c;d+=u){u=0;
for(let h=l;h>=0;h--){const p=this.get(d+h);if(n[h]!==p){u=Math.max(1,h-a[p]);break}}if(u===0)return d}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=pa(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Nr(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Nr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Nr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=pa(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Nr(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Nr(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Nr(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Nr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Nr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Jr)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!gM(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new Jr;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}}class zB extends Error{static name="AbortError";constructor(e="\
The operation was aborted"){super(e),this.name="AbortError"}}class qB extends Error{static name="UnexpectedPeerError";constructor(e="\
Unexpected Peer"){super(e),this.name="UnexpectedPeerError"}}class jB extends Error{static name="InvalidCryptoExchangeErr\
or";constructor(e="Invalid crypto exchange"){super(e),this.name="InvalidCryptoExchangeError"}}class bM extends Error{static name="\
InvalidParametersError";constructor(e="Invalid parameters"){super(e),this.name="InvalidParametersError"}}class GB extends Error{static name="\
InvalidPublicKeyError";constructor(e="Invalid public key"){super(e),this.name="InvalidPublicKeyError"}}class WB extends Error{static name="\
InvalidPrivateKeyError";constructor(e="Invalid private key"){super(e),this.name="InvalidPrivateKeyError"}}class VB extends Error{static name="\
ConnectionClosedError";constructor(e="The connection is closed"){super(e),this.name="ConnectionClosedError"}}class HB extends Error{static name="\
ConnectionFailedError";constructor(e="Connection failed"){super(e),this.name="ConnectionFailedError"}}class KB extends Error{static name="\
MuxerClosedError";constructor(e="The muxer is closed"){super(e),this.name="MuxerClosedError"}}class QB extends Error{static name="\
StreamResetError";constructor(e="The stream has been reset"){super(e),this.name="StreamResetError"}}class JB extends Error{static name="\
StreamStateError";constructor(e="The stream is in an invalid state"){super(e),this.name="StreamStateError"}}class yM extends Error{static name="\
StreamBufferError";constructor(e="The stream buffer was full"){super(e),this.name="StreamBufferError"}}class XB extends Error{static name="\
NotFoundError";constructor(e="Not found"){super(e),this.name="NotFoundError"}}class YB extends Error{static name="Invali\
dPeerIdError";constructor(e="Invalid PeerID"){super(e),this.name="InvalidPeerIdError"}}class ZB extends Error{static name="\
InvalidMultiaddrError";constructor(e="Invalid multiaddr"){super(e),this.name="InvalidMultiaddrError"}}class e7 extends Error{static name="\
InvalidCIDError";constructor(e="Invalid CID"){super(e),this.name="InvalidCIDError"}}class t7 extends Error{static name="\
InvalidMultihashError";constructor(e="Invalid Multihash"){super(e),this.name="InvalidMultihashError"}}class r7 extends Error{static name="\
UnsupportedProtocolError";constructor(e="Unsupported protocol error"){super(e),this.name="UnsupportedProtocolError"}}class n7 extends Error{static name="\
InvalidMessageError";constructor(e="Invalid message"){super(e),this.name="InvalidMessageError"}}class s7 extends Error{static name="\
ProtocolError";constructor(e="Protocol error"){super(e),this.name="ProtocolError"}}let i7=class extends Error{static name="\
TimeoutError";constructor(e="Timed out"){super(e),this.name="TimeoutError"}};class a7 extends Error{static name="NotStar\
tedError";constructor(e="Not started"){super(e),this.name="NotStartedError"}}class c7 extends Error{static name="DialErr\
or";constructor(e="Dial error"){super(e),this.name="DialError"}}class l7 extends Error{static name="ListenError";constructor(e="\
Listen error"){super(e),this.name="ListenError"}}class u7 extends Error{static name="LimitedConnectionError";constructor(e="\
Limited connection"){super(e),this.name="LimitedConnectionError"}}class d7 extends Error{static name="TooManyInboundProt\
ocolStreamsError";constructor(e="Too many inbound protocol streams"){super(e),this.name="TooManyInboundProtocolStreamsEr\
ror"}}class h7 extends Error{static name="TooManyOutboundProtocolStreamsError";constructor(e="Too many outbound protocol\
 streams"){super(e),this.name="TooManyOutboundProtocolStreamsError"}}class f7 extends Error{static name="UnsupportedKeyT\
ypeError";constructor(e="Unsupported key type"){super(e),this.name="UnsupportedKeyTypeError"}}class Ad extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,Ad)}}const wM=r=>"reason"in r?r.reason:new DOMException(
"This operation was aborted.","AbortError"),kM=2**31-1,EM=(r,e)=>{if(typeof r!="number"||Math.sign(r)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${r}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function xM(r,e){
const{milliseconds:t,fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
r.cancel?.()}catch{}},d=new Promise((h,p)=>{const g=()=>{p(wM(o)),l()},y=EM(t,i);try{y?p(y):o?.aborted?g():o&&(c=g,o.addEventListener(
"abort",c,{once:!0}))}finally{r.then(h,p)}if(y||o?.aborted||t>kM)return;const m=n||s===!1||s instanceof Error?void 0:new Ad(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(n)try{h(n())}catch(f){p(f)}else s===!1?
h():p(s instanceof Error?s:m);l()},t)}).finally(()=>{try{d.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return d.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},d}const Ry=r=>typeof r=="function"?{filter:r}:
{...r},SM=r=>r===1/0||Number.isSafeInteger(r)&&r>=0,vM=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],AM=r=>{for(const[e,t]of vM){const n=r?.[e],s=r?.[t];if(typeof n=="function"&&typeof s=="functi\
on")return{addListener:n.bind(r),removeListener:s.bind(r)}}throw new TypeError("Emitter is not compatible")},_M=r=>{const e=new Map;
for(const[t,n]of r)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,n);return e},IM=({addListener:r,removeListener:e,
handlers:t,signal:n,abortHandler:s,isDone:i})=>{n?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(r(o,a),i()){
e(o,a);return}},CM=({removeListener:r,handlers:e,signal:t,abortHandler:n})=>{for(const[s,i]of e)r(s,i);t?.removeEventListener(
"abort",n)},TM=(r,e,t)=>{let n=Promise.resolve();return(s,i)=>{n=n.then(async()=>{if(e())return;let o;try{o=r?await r(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function MM(r,e,t){let n=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=Ry(t);const{
filter:l}=t;if(!SM(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:d}=AM(r);if(t.count===0){a([]);return}const h=[],p=k=>{
n(),c(k)},g=TM(l,()=>s,p),y=k=>{h.push(k),t.count===h.length&&(n(),a(h))},m=(...k)=>{if(s)return;const x=t.multiArgs?k:k[0];
if(!l){y(x);return}g(x,A=>{A&&y(x)})},f=(...k)=>{p(t.rejectionMultiArgs?k:k[0])},b=()=>{p(t.signal.reason)},w={addListener:u,
removeListener:d,handlers:_M([[e,m],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:b,isDone:()=>s};n=()=>{
s=!0,clearTimeout(i),CM(w)},IM(w),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
n,t.timeout)),a(h))});if(o.cancel=n,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=xM(o,{milliseconds:t.
timeout});return a.cancel=()=>{n(),a.clear()},a}return o}function By(r,e,t){const n=MM(r,e,{...Ry(t),count:1,resolveImmediately:!1}),
s=n.then(i=>i[0]);return s.cancel=n.cancel,s}class p7 extends Error{remainingPoints;msBeforeNext;consumedPoints;isFirstInDuration;constructor(e="\
Rate limit exceeded",t){super(e),this.name="RateLimitError",this.remainingPoints=t.remainingPoints,this.msBeforeNext=t.msBeforeNext,
this.consumedPoints=t.consumedPoints,this.isFirstInDuration=t.isFirstInDuration}}class m7 extends Error{static name="Que\
ueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class ma extends Error{static name="\
UnexpectedEOFError";name="UnexpectedEOFError"}class g7 extends Error{static name="MaxEarlyStreamsError";name="MaxEarlySt\
reamsError"}class b7 extends Error{static name="StreamClosedError";name="StreamClosedError"}const RM=Math.pow(2,7),BM=Math.
pow(2,14),LM=Math.pow(2,21),_d=Math.pow(2,28),Id=Math.pow(2,35),Cd=Math.pow(2,42),Td=Math.pow(2,49),ue=128,et=127;function Xa(r){
if(r<RM)return 1;if(r<BM)return 2;if(r<LM)return 3;if(r<_d)return 4;if(r<Id)return 5;if(r<Cd)return 6;if(r<Td)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function DM(r,e,t=0){
switch(Xa(r)){case 8:e[t++]=r&255|ue,r/=128;case 7:e[t++]=r&255|ue,r/=128;case 6:e[t++]=r&255|ue,r/=128;case 5:e[t++]=r&
255|ue,r/=128;case 4:e[t++]=r&255|ue,r>>>=7;case 3:e[t++]=r&255|ue,r>>>=7;case 2:e[t++]=r&255|ue,r>>>=7;case 1:{e[t++]=r&
255,r>>>=7;break}default:throw new Error("unreachable")}return e}function PM(r,e,t=0){switch(Xa(r)){case 8:e.set(t++,r&255|
ue),r/=128;case 7:e.set(t++,r&255|ue),r/=128;case 6:e.set(t++,r&255|ue),r/=128;case 5:e.set(t++,r&255|ue),r/=128;case 4:
e.set(t++,r&255|ue),r>>>=7;case 3:e.set(t++,r&255|ue),r>>>=7;case 2:e.set(t++,r&255|ue),r>>>=7;case 1:{e.set(t++,r&255),
r>>>=7;break}default:throw new Error("unreachable")}return e}function $M(r,e){let t=r[e],n=0;if(n+=t&et,t<ue||(t=r[e+1],
n+=(t&et)<<7,t<ue)||(t=r[e+2],n+=(t&et)<<14,t<ue)||(t=r[e+3],n+=(t&et)<<21,t<ue)||(t=r[e+4],n+=(t&et)*_d,t<ue)||(t=r[e+5],
n+=(t&et)*Id,t<ue)||(t=r[e+6],n+=(t&et)*Cd,t<ue)||(t=r[e+7],n+=(t&et)*Td,t<ue))return n;throw new RangeError("Could not \
decode varint")}function NM(r,e){let t=r.get(e),n=0;if(n+=t&et,t<ue||(t=r.get(e+1),n+=(t&et)<<7,t<ue)||(t=r.get(e+2),n+=
(t&et)<<14,t<ue)||(t=r.get(e+3),n+=(t&et)<<21,t<ue)||(t=r.get(e+4),n+=(t&et)*_d,t<ue)||(t=r.get(e+5),n+=(t&et)*Id,t<ue)||
(t=r.get(e+6),n+=(t&et)*Cd,t<ue)||(t=r.get(e+7),n+=(t&et)*Td,t<ue))return n;throw new RangeError("Could not decode varin\
t")}function UM(r,e,t=0){return e==null&&(e=pa(Xa(r))),e instanceof Uint8Array?DM(r,e,t):PM(r,e,t)}function FM(r,e=0){return r instanceof
Uint8Array?$M(r,e):NM(r,e)}const OM=4194304;class Rp extends Error{static name="UnwrappedError";name="UnwrappedError"}class zM extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class qM extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class jM extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}function GM(r){
return typeof r?.closeRead=="function"}function WM(r){return typeof r?.close=="function"}function al(r){return GM(r)?r.remoteWriteStatus!==
"writable"&&r.readBufferLength===0:WM(r)?r.status!=="open":!1}function VM(r){return r?.addEventListener!=null&&r?.removeEventListener!=
null&&r?.send!=null&&r?.push!=null&&r?.log!=null}function HM(r,e){const t=e?.maxBufferSize??OM,n=new Jr;let s,i=!1,o;if(!VM(
r))throw new bM("Argument should be a Stream or a Multiaddr");const a=d=>{if(!i&&o==null){if(n.append(d.data),n.byteLength>
t){const h=n.byteLength;n.consume(h);const p=new yM(`Read buffer overflow - ${h} > ${t}`);o=p,s?.reject(p),queueMicrotask(
()=>{r.abort(p)});return}s?.resolve()}};r.addEventListener("message",a);const c=d=>{d.error!=null?s?.reject(d.error):s?.
resolve()};r.addEventListener("close",c);const l=()=>{s?.resolve()};r.addEventListener("remoteCloseWrite",l);const u={readBuffer:n,
async read(d){if(i===!0)throw new Rp("Stream was unwrapped");if(o!=null)throw o;if(al(r)){if(n.byteLength===0&&d?.bytes==
null)return null;if(d?.bytes!=null&&n.byteLength<d.bytes)throw r.log.error("closed after reading %d/%d bytes",n.byteLength,
d.bytes),new ma(`Unexpected EOF - stream closed after reading ${n.byteLength}/${d.bytes} bytes`)}const h=d?.bytes??1;for(s=
Promise.withResolvers();;){if(n.byteLength>=h){s.resolve();break}if(await jb(s.promise,d?.signal),al(r)){if(n.byteLength===
0&&d?.bytes==null)return null;break}s=Promise.withResolvers()}const p=d?.bytes??n.byteLength;if(n.byteLength<p){if(al(r))
throw r.log.error("closed while reading %d/%d bytes",n.byteLength,p),new ma(`Unexpected EOF - stream closed while readin\
g ${n.byteLength}/${p} bytes`);return u.read(d)}const g=n.sublist(0,p);return n.consume(p),g},async write(d,h){if(i===!0)
throw new Rp("Stream was unwrapped");r.send(d)||await By(r,"drain",{signal:h?.signal,rejectionEvents:["close"]})},unwrap(){
return i||(i=!0,r.removeEventListener("message",a),r.removeEventListener("close",c),r.removeEventListener("remoteCloseWr\
ite",l),n.byteLength>0&&(r.log("stream unwrapped with %d unread bytes",n.byteLength),r.unshift(n),n.consume(n.byteLength))),
r}};return u}function Ly(r,e={}){const t=HM(r,e);e.maxDataLength!=null&&e.maxLengthLength==null&&(e.maxLengthLength=Xa(e.
maxDataLength));const n=e?.lengthDecoder??FM,s=e?.lengthEncoder??UM;return{async read(o){let a=-1;const c=new Jr;for(;;){
const u=await t.read({...o,bytes:1});if(u==null)break;c.append(u);try{a=n(c)}catch(d){if(d instanceof RangeError)continue;
throw d}if(a<0)throw new zM("Invalid message length");if(e?.maxLengthLength!=null&&c.byteLength>e.maxLengthLength)throw new jM(
`Message length length too long - ${c.byteLength} > ${e.maxLengthLength}`);if(a>-1)break}if(e?.maxDataLength!=null&&a>e.
maxDataLength)throw new qM(`Message length too long - ${a} > ${e.maxDataLength}`);const l=await t.read({...o,bytes:a});if(l==
null)throw r.log.error("tried to read %d bytes but the stream closed",a),new ma(`Unexpected EOF - tried to read ${a} byt\
es but the stream closed`);if(l.byteLength!==a)throw r.log.error("read %d/%d bytes before the stream closed",l.byteLength,
a),new ma(`Unexpected EOF - read ${l.byteLength}/${a} bytes before the stream closed`);return l},async write(o,a){await t.
write(new Jr(s(o.byteLength),o),a)},async writeV(o,a){const c=new Jr(...o.flatMap(l=>[s(l.byteLength),l]));await t.write(
c,a)},unwrap(){return t.unwrap()}}}function y7(r,e){const t=Ly(r,e),n={read:async(s,i)=>{const o=await t.read(i);return s.
decode(o,i)},write:async(s,i,o)=>{await t.write(i.encode(s),o)},writeV:async(s,i,o)=>{await t.writeV(s.map(a=>i.encode(a)),
o)},pb:s=>({read:async i=>n.read(s,i),write:async(i,o)=>n.write(i,s,o),writeV:async(i,o)=>n.writeV(i,s,o),unwrap:()=>n}),
unwrap:()=>t.unwrap()};return n}function KM(r){return r?.addEventListener!=null}function QM(r){const e=qb();let t;const n=o=>{
e.push(o.data)},s=()=>{e.end(),r.removeEventListener("message",n),r.removeEventListener("close",i),r.removeEventListener(
"remoteCloseWrite",s)},i=o=>{e.end(o.error),o.error!=null&&t?.reject(o.error),r.removeEventListener("message",n),r.removeEventListener(
"close",i),r.removeEventListener("remoteCloseWrite",s)};return r.addEventListener("message",n),r.addEventListener("close",
i,{once:!0}),r.addEventListener("remoteCloseWrite",s,{once:!0}),{source:e,async sink(o){async function*a(){yield*o}const c=a();
for(;;){t=Promise.withResolvers();const{done:l,value:u}=await Promise.race([c.next(),t.promise]);if(r.writeStatus==="clo\
sing"||r.writeStatus==="closed"||(u!=null&&(r.send(u)||await Promise.race([By(r,"drain",{rejectionEvents:["close"]})])),
l===!0))break}await r.close()}}}function w7(...r){const e=r.map(t=>KM(t)?QM(t):t);return Gb(...e)}const JM="peercompute.\
model-artifact-read.v1",Md=JM;function Dy(r,e){const t=n=>e(n.data);return r.addEventListener("message",t),r.start?.(),()=>r.
removeEventListener("message",t)}function bt(r,e,t=[]){r.postMessage({protocol:Md,...e},t)}function k7(r,{store:e,manifest:t,
chunkBytes:n=de.chunkBytes,maxReads:s=de.maxReads}={}){if(!e?.stat||!e?.openRead)throw new Error("A verified artifact st\
ore is required");if(!Number.isInteger(n)||n<1||n>de.chunkBytes||!Number.isInteger(s)||s<1||s>de.maxReads)throw new Error(
"Invalid artifact bridge bounds");const i=new Map(t.files.map(h=>[fa(h.path),h])),o=new Map;let a=!1,c=0;async function l(h,p){
const g=o.get(h);if(g){o.delete(h),g.controller.abort(p);try{await g.iterator?.return?.()}catch{}}}async function u(h){if(a||
h?.protocol!==Md||typeof h.id!="string"||h.id.length>128)return;const{id:p}=h;try{if(h.type==="cancel"){await l(p,"Reade\
r cancelled");return}if(h.type==="open"){if(o.has(p))throw new Error("Duplicate artifact reader");if(o.size>=s)throw new Error(
"Artifact reader limit reached");const b=i.get(h.path);if(!b)throw new Error("Artifact path is not in the manifest");const w=h.
offset??0,k=h.length??b.size-w;if(!Number.isSafeInteger(w)||!Number.isSafeInteger(k)||w<0||k<0||w>b.size||k>b.size-w)throw new Error(
"Invalid artifact byte range");const x={controller:new AbortController,remaining:k,pulling:!1};o.set(p,x);const A=await e.
stat(b.cid);if(Xe(x.controller.signal),a||o.get(p)!==x)return;if(!A||A.status!=="complete"||A.size!==b.size||A.sha256!==
b.sha256)throw new Error("Model artifact is incomplete or has a different size");const S=await e.openRead(b.cid,{offset:w,
length:k,signal:x.controller.signal});if(x.iterator=S[Symbol.asyncIterator](),a||x.controller.signal.aborted||o.get(p)!==
x){await x.iterator.return?.();return}bt(r,{type:"ready",id:p,size:k});return}if(h.type!=="pull")return;const g=o.get(p);
if(!g?.iterator||g.pulling)throw new Error("Invalid artifact pull credit");g.pulling=!0;const y=await g.iterator.next();
if(a||g.controller.signal.aborted||o.get(p)!==g)return;if(y.done){if(g.remaining!==0)throw new Error("Truncated model ar\
tifact");o.delete(p),bt(r,{type:"end",id:p});return}const m=y.value;if(!(m instanceof Uint8Array)||!m.byteLength||m.byteLength>
n||m.byteLength>g.remaining)throw new Error("Artifact chunk exceeds admitted bounds");g.remaining-=m.byteLength,g.pulling=
!1,c+=m.byteLength;const f=m.slice();bt(r,{type:"chunk",id:p,bytes:f},[f.buffer])}catch(g){await l(p,g),a||bt(r,{type:"e\
rror",id:p,message:g?.message||"Artifact read failed"})}}const d=Dy(r,h=>{u(h)});return{getStats:()=>({activeReads:o.size,
deliveredBytes:c}),async close(){if(!a){a=!0;try{bt(r,{type:"closed",message:"Artifact bridge closed"})}catch{}d(),await Promise.
all([...o.keys()].map(h=>l(h,"Artifact bridge closed"))),r.close()}}}}function XM(r,{manifest:e,baseUrl:t,signal:n,chunkBytes:s=de.
chunkBytes,maxReads:i=de.maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>de.maxReads||!Number.isInteger(
o)||o<0||o>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(t),c=new Map(e.files.map(f=>[fa(f.path),
f])),l=new Map,u=[];let d=0,h=!1;function p(){for(;!h&&l.size<i&&u.length;){const f=u.shift();l.set(f.id,f),f.active=!0,
bt(r,{type:"open",id:f.id,path:f.path})}}function g(f,b){l.delete(f.id);const w=u.indexOf(f);if(w>=0&&u.splice(w,1),n?.removeEventListener(
"abort",f.abort),f.requestSignal?.removeEventListener("abort",f.abort),b){f.reject?.(b);try{f.streamController?.error(b)}catch{}}
f.resolvePull?.(),p()}const y=Dy(r,f=>{if(f?.protocol!==Md)return;const b=l.get(f.id);if(b){if(f.type==="error"){g(b,new Error(
f.message));return}if(f.type==="ready"){if(b.ready||f.size!==b.file.size){g(b,new Error("Invalid artifact response size")),
bt(r,{type:"cancel",id:b.id});return}b.ready=!0,bt(r,{type:"pull",id:b.id})}else if(f.type==="chunk"){if(!b.ready||!b.resolvePull||
!(f.bytes instanceof Uint8Array)||!f.bytes.byteLength||f.bytes.byteLength>s||b.received+f.bytes.byteLength>b.file.size){
bt(r,{type:"cancel",id:b.id}),g(b,new Error("Invalid artifact chunk"));return}b.received+=f.bytes.byteLength,b.streamController.
enqueue(f.bytes);const w=b.resolvePull;b.resolvePull=null,w()}else f.type==="end"&&(!b.ready||b.received!==b.file.size?g(
b,new Error("Truncated artifact response")):(b.streamController.close(),g(b)))}});async function m(f,b={}){if(h)throw new Error(
"Artifact bridge is closed");if(Xe(n),Xe(b.signal),b.method&&b.method!=="GET")throw new Error("Model adapter supports GE\
T only");const w=String(f);if(/[\\]/.test(w)||/%(?:2e|2f|5c|00)/i.test(w)||/\/(?:\.|\.\.)(?:\/|$)/.test(w))throw new Error(
"Invalid artifact URL");const k=new URL(w,a);if(k.origin!==a.origin||k.username||k.password||k.search||k.hash||!k.pathname.
startsWith(a.pathname))throw new Error("Model path is outside its manifest");const x=fa(decodeURIComponent(k.pathname.slice(
a.pathname.length))),A=c.get(x);if(!A)return new Response("Artifact path is not in the manifest",{status:404});const S=`\
read-${++d}`,E={id:S,path:x,file:A,requestSignal:b.signal,received:0,ready:!1,active:!1,queued:!1};E.abort=()=>{E.active&&
bt(r,{type:"cancel",id:S}),g(E,lu(n?.reason??b.signal?.reason))};const _=new ReadableStream({start(I){E.streamController=
I},pull(){if(h)throw new Error("Artifact bridge is closed");if(Xe(n),Xe(b.signal),!E.active&&!E.queued&&l.size>=i&&u.length>=
o)throw new Error("Artifact reader limit reached");return new Promise(I=>{E.resolvePull=I,E.ready?bt(r,{type:"pull",id:S}):
E.queued||(E.queued=!0,n?.addEventListener("abort",E.abort,{once:!0}),b.signal?.addEventListener("abort",E.abort,{once:!0}),
u.push(E),p())})},cancel(){E.active&&bt(r,{type:"cancel",id:S}),g(E)}},{highWaterMark:0});return new Response(_,{headers:{
"Content-Length":String(A.size),"Content-Type":A.mediaType||"application/octet-stream"}})}return{fetch:m,close(f="Artifa\
ct bridge closed"){if(!h){h=!0;for(const b of[...l.values(),...u])b.active&&bt(r,{type:"cancel",id:b.id}),g(b,lu(f));y(),
r.close()}}}}const Eo=r=>new TextEncoder().encode(r).byteLength;function YM(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function Ya(r){if(r==null)return null;
if(!Number.isSafeInteger(r.width)||!Number.isSafeInteger(r.height)||r.width<1||r.height<1||r.width*r.height>de.maxImagePixels||
r.channels!==4||!(r.data instanceof Uint8Array||r.data instanceof Uint8ClampedArray)||r.data.byteLength!==r.width*r.height*
4||r.data.byteLength>de.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fi\
les are not accepted");return r}function Rd(r){const e=r.messages??(typeof r.prompt=="string"?[{role:"user",content:r.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>de.maxMessages)throw new Error("Invalid inference messages");let t=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(t+=Eo(n.content),t>de.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function hu(r){if(!r)return;let e;const t=new Set;for(const n of[r.model,r.processor,
r.tokenizer])if(!(!n||t.has(n))){t.add(n);try{await n.dispose?.()}catch(s){e??=s}}if(e)throw e}function xo(r,e=new Set){
if(!(!r||typeof r!="object"||e.has(r))){if(e.add(r),typeof r.dispose=="function"){r.dispose();return}for(const t of Object.
values(r))xo(t,e)}}function ZM(r){const e=r.findIndex(n=>n.role==="user");if(e<0)return null;const t=r.findIndex((n,s)=>s>
e&&n.role==="user");return t<0?null:r.filter((n,s)=>s<e||s>=t||n.role==="system")}function eR(r,e,t){const n={...r.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,r.generation_config);const s=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],i=e.at(-1),o=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return o(i)&&s.some(a=>o(a)&&BigInt(a)===BigInt(i))?"stop":e.length>=t?"length":"unknown"}async function tR({library:r,
modelPath:e,options:t,manifest:n}){const s={};try{const i=await r.AutoConfig.from_pretrained(e,t);if(i.model_type!==n.model.
architecture)throw new Error("Model config architecture does not match its admitted manifest");const o={...t,config:i};if(n.
model.architecture==="qwen3_5"&&(o.use_external_data_format=1),n.model.task==="image-text-to-text"){if(s.processor=await r.
AutoProcessor.from_pretrained(e,t),n.model.architecture==="qwen3_5"){const a=s.processor.image_processor;if(!a)throw new Error(
"Qwen3.5 image processor is unavailable");a.min_pixels=256*256,a.max_pixels=Ja(n.model).maxProcessedImagePixels,a.do_normalize??=
!0}s.tokenizer=s.processor.tokenizer,s.model=await r.AutoModelForImageTextToText.from_pretrained(e,o)}else s.tokenizer=await r.
AutoTokenizer.from_pretrained(e,t),s.model=await r.AutoModelForCausalLM.from_pretrained(e,o);return s}catch(i){throw await hu(
s),i}}function Bp(r){return{sessionId:r.sessionId,manifestCid:r.manifestCid,status:r.lost?"lost":r.status,task:r.manifest.
model.task,dtype:r.manifest.model.dtype,workerId:r.workerId,adapter:r.adapter,runtimeAdapter:r.runtimeAdapter??null,gpuDispatches:r.
gpuDispatches??0,gpuSubmissions:r.gpuSubmissions??0,gpuProfileSamples:r.gpuProfileSamples??0,collectGpuEvidence:r.collectGpuEvidence===
!0,runtimeFeatures:r.runtimeFeatures??[],generatedRequests:r.generatedRequests}}function Py({loadLibrary:r=()=>kt(()=>import("./transformers.web-DGNMtDcj.js"),
[],import.meta.url),loadModel:e=tR,gpu:t=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=YM}={}){
const i=new Map;let o;async function a(l,u){if(i.size)throw new Error("This inference worker already has a resident/load\
ing model");const d=Os(l.sessionId),{manifest:h}=XT(l.manifest),p=YT(l.runtimeAssets,n);if(!l.artifactPort?.postMessage)
throw new Error("An artifact reader port is required");Xe(u.signal);const g={sessionId:d,manifest:h,manifestCid:l.manifestCid,
status:"loading",workerId:u.workerId??null,generatedRequests:0,components:null};i.set(d,g);let y;try{const m=await t?.requestAdapter(
{powerPreference:"high-performance"});if(Xe(u.signal),!m||m.info?.isFallbackAdapter||m.isFallbackAdapter)throw new Error(
"A hardware WebGPU adapter is required; CPU/software fallback is disabled");const f=typeof h.model.dtype=="string"?[h.model.
dtype]:Object.values(h.model.dtype),b=new Set(h.model.requiredFeatures??[]);f.some(_=>["fp16","q4f16"].includes(_))&&b.add(
"shader-f16");for(const _ of b)if(!m.features.has(_))throw new Error(`Model requires unsupported GPU feature: ${_}`);g.adapter=
{vendor:m.info?.vendor??"",architecture:m.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...b]};const w=await(o??=
r());if(Xe(u.signal),w.env.version!==Sd)throw new Error("Unexpected Transformers runtime version");const k=new URL("/__p\
eercompute_models/",n);y=XM(l.artifactPort,{manifest:h,baseUrl:new URL(`${d}/`,k).href,signal:u.signal});const{env:x}=w;
x.logLevel=50,x.allowLocalModels=!0,x.allowRemoteModels=!1,x.localModelPath=k.pathname,x.useBrowserCache=!1,x.useFSCache=
!1,x.useWasmCache=!1,x.fetch=async(..._)=>{try{return await y.fetch(..._)}catch(I){throw u.emitProgress?.({type:"artifac\
t-read-error",sessionId:d,message:I.message}),I}},x.backends.onnx.wasm.proxy=!1,x.backends.onnx.wasm.numThreads=1,x.backends.
onnx.wasm.wasmPaths=p,g.gpuDispatches=0,g.gpuProfileSamples=0,g.gpuSubmissions=0,g.collectGpuEvidence=l.collectGpuEvidence===
!0,x.backends.onnx.webgpu&&(x.backends.onnx.webgpu.profiling={mode:l.collectGpuEvidence===!0?"default":"off",ondata:()=>{
g.gpuProfileSamples+=1}});const A={local_files_only:!0,device:"webgpu",dtype:h.model.dtype,session_options:{executionProviders:[
"webgpu"]},progress_callback:_=>{u.signal?.aborted||u.emitProgress?.({type:"model-load",sessionId:d,status:String(_.status??
"").slice(0,40),file:typeof _.file=="string"?_.file.slice(0,512):void 0,loaded:Number.isFinite(_.loaded)?_.loaded:void 0,
total:Number.isFinite(_.total)?_.total:void 0})}};g.library=w,g.components=await e({library:w,modelPath:d,options:A,manifest:h}),
Xe(u.signal);const S=await x.backends.onnx.webgpu?.device;if(g.runtimeDevice=S,g.runtimeFeatures=[...S?.features??[]],g.
collectGpuEvidence&&S){const _=S.createCommandEncoder.bind(S),I=S.queue.submit.bind(S.queue),M=Object.getOwnPropertyDescriptor(
S,"createCommandEncoder"),T=Object.getOwnPropertyDescriptor(S.queue,"submit");g.restoreGpuEvidence=()=>{M?Object.defineProperty(
S,"createCommandEncoder",M):delete S.createCommandEncoder,T?Object.defineProperty(S.queue,"submit",T):delete S.queue.submit,
g.restoreGpuEvidence=null},S.createCommandEncoder=(...$)=>{const D=_(...$),U=D.beginComputePass.bind(D);return D.beginComputePass=
(...Q)=>{const H=U(...Q);for(const V of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const te=H[V].bind(H);H[V]=(...ie)=>{
const we=te(...ie);return g.gpuDispatches+=1,we}}return H},D},S.queue.submit=(...$)=>{const D=I(...$);return g.gpuSubmissions+=
1,D}}const E=S?.adapterInfo??x.backends.onnx.webgpu?.adapter?.info;if(E){if(E.isFallbackAdapter)throw new Error("ORT sel\
ected a software GPU adapter");g.runtimeAdapter={vendor:E.vendor,architecture:E.architecture,isFallbackAdapter:E.isFallbackAdapter??
!1}}return S?.lost&&S.lost.then(()=>{i.get(d)===g&&(g.lost=!0,g.active?.abort("GPU device lost"))}),Xe(u.signal),g.status=
"ready",Bp(g)}catch(m){try{await hu(g.components),g.restoreGpuEvidence?.(),i.delete(d)}catch(f){g.status="ready",g.lost=
!0;const b=new Error(`MODEL_DISPOSE_FAILED: ${f.message}`);throw b.code="MODEL_DISPOSE_FAILED",b}throw m}finally{y?.close(),
y||l.artifactPort.close()}}async function c(l,u){const d=i.get(Os(l.sessionId));if(!d||d.lost)throw new Error("Model ses\
sion lost or not loaded");if(d.status!=="ready")throw new Error("Model session is busy");const h=Os(l.requestId),p=l.maxNewTokens??
de.maxNewTokens;if(!Number.isInteger(p)||p<1||p>de.maxNewTokens)throw new Error("Generation exceeds its output-token bud\
get");let g=Rd(l);const y=Ya(l.image);if(y&&d.manifest.model.task!=="image-text-to-text")throw new Error("This model doe\
s not admit image inputs");Xe(u.signal);const m=new AbortController,f=new d.library.InterruptableStoppingCriteria,b=()=>{
m.abort(u.signal?.reason),f.interrupt()};u.signal?.addEventListener("abort",b,{once:!0}),m.signal.addEventListener("abor\
t",()=>f.interrupt(),{once:!0}),d.active=m,d.requestId=h,d.status="generating";let w,k,x=0,A=0,S,E=!1;const _=d.gpuDispatches??
0,I=d.gpuSubmissions??0;try{Xe(u.signal);const{tokenizer:M,processor:T,model:$}=d.components;let D;for(;;){Xe(m.signal);
let te=g;if(T&&(te=g.map(le=>({role:le.role,content:[{type:"text",text:le.content}]})),y)){const le=te.findLast(ot=>ot.role===
"user");if(!le)throw new Error("An image requires a user message");le.content.unshift({type:"image"})}const ie=(T??M).apply_chat_template(
te,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof ie!="string"||Eo(ie)>de.maxPromptBytes)throw new Error(
"Templated prompt exceeds its byte budget");if(y){const le=new d.library.RawImage(y.data,y.width,y.height,y.channels);w=
await T(ie,le,{do_image_splitting:!1})}else w=await M(ie,{truncation:!1,padding:!1});if(Xe(m.signal),D=w.input_ids?.dims?.
at(-1),!Number.isSafeInteger(D)||D<1)throw new Error("Invalid model input token count");if(D+p<=de.maxContextTokens)break;
const we=ZM(g);if(!we)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten th\
e prompt or request fewer output tokens");const it=w;w=void 0,xo(it),g=we,E=!0}Xe(m.signal);const U=new d.library.TextStreamer(
M,{skip_prompt:!0,skip_special_tokens:!0,callback_function:te=>{if(!(m.signal.aborted||S)){if(A+=Eo(te),A>de.maxOutputBytes){
S=new Error("Generated text exceeded its byte budget"),m.abort(S);return}try{if(u.emitProgress?.({type:"token",sessionId:d.
sessionId,requestId:h,sequence:x++,text:te})===!1)throw new Error("Token consumer rejected output")}catch(ie){S=ie,m.abort(
ie)}}}});if(k=await $.generate({...w,max_new_tokens:p,do_sample:!1,streamer:U,stopping_criteria:[f]}),await d.runtimeDevice?.
queue.onSubmittedWorkDone(),S)throw S;if(d.lost)throw new Error("GPU device lost; model session is unavailable");Xe(m.signal);
const Q=k.tolist();if(Q.length!==1||Q[0].length<D||Q[0].length>D+p)throw new Error("Model returned an over-budget token \
sequence");const H=Q[0].slice(D),V=M.decode(H,{skip_special_tokens:!0});if(Eo(V)>de.maxOutputBytes)throw new Error("Gene\
rated text exceeds its byte budget");return d.generatedRequests+=1,{sessionId:d.sessionId,requestId:h,text:V,inputTokens:D,
outputTokens:H.length,finishReason:eR($,H,p),contextTruncated:E,workerId:d.workerId,gpuDispatches:(d.gpuDispatches??0)-_,
gpuSubmissions:(d.gpuSubmissions??0)-I,gpuProfileSamples:d.gpuProfileSamples??0}}finally{u.signal?.removeEventListener("\
abort",b);try{const M=new Set;xo(w,M),xo(k,M)}finally{d.active=null,d.requestId=null,d.status="ready"}}}return async function(u={},d={}){
if(s(),u.command==="load")return a(u,d);if(u.command==="generate")return c(u,d);const h=i.get(Os(u.sessionId));if(u.command===
"status")return h?Bp(h):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return h?.requestId===u.requestId&&
h.active?.abort("Generation cancelled"),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="unload"){if(!h)
return{sessionId:u.sessionId,status:"absent"};if(h.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");h.status="unloading";try{await hu(h.components),h.restoreGpuEvidence?.()}catch(p){h.status="ready",h.
lost=!0;const g=new Error(`MODEL_DISPOSE_FAILED: ${p.message}`);throw g.code="MODEL_DISPOSE_FAILED",g}return i.delete(u.
sessionId),{sessionId:u.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const rR=Py(),nR=(r,e)=>rR(
r,e),sR=Object.freeze(Object.defineProperty({__proto__:null,createModelTaskRuntime:Py,handleModelTask:nR,normalizeModelMessages:Rd,
validateImageInput:Ya},Symbol.toStringTag,{value:"Module"})),E7="/peercompute/inference/2.0.0",iR=256,Vn=Object.freeze({
frameBytes:128*1024,imageChunkBytes:64*1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,
queryTimeoutMs:5e3,requestTimeoutMs:12e4,recordTtlMs:15e3}),$y=new TextEncoder,oR=new TextDecoder("utf-8",{fatal:!0}),Ny=r=>$y.
encode(r).length,Uy=r=>Zn.parse(Dn(r,128)).toV1().toString();function Dn(r,e=256){if(typeof r!="string"||!r.length||Ny(r)>
e)throw new Error("Invalid inference text field");return r}function Ne(r,e,t=0){if(!Number.isSafeInteger(r)||r<t||r>e)throw new Error(
"Invalid inference numeric field");return r}function x7(r){return r?.status==="open"&&!!r.remotePeer&&(r.encryption==="/\
noise"||r.encryption==="/tls/1.0.0"||r.encryption==="native"&&r.remoteAddr?.getComponents?.().some(({name:e})=>e==="webr\
tc"||e==="webrtc-direct"))}function Lp(r){if(!r||typeof r!="object")throw new Error("Invalid model descriptor");if(!Array.
isArray(r.modalities)||r.modalities.length>4||r.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const e=r.task??(r.modalities.includes("image")?"image-text-to-text":"text-generation");if(![
"text-generation","image-text-to-text","text-to-image"].includes(e))throw new Error("Invalid model task");const t=e==="t\
ext-to-image"?["image"]:["text"];if(r.outputModalities!==void 0&&(!Array.isArray(r.outputModalities)||r.outputModalities.
length!==1||r.outputModalities[0]!==t[0]))throw new Error("Model output modalities do not match its task");if(e==="text-\
to-image"&&(r.modalities.length!==1||r.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");
return{manifestCid:Uy(r.manifestCid),modelId:Dn(r.modelId),name:Dn(r.name),task:e,outputModalities:t,modalities:[...new Set(
r.modalities)],runtime:Dn(r.runtime,128),repository:Dn(r.repository,256),revision:Dn(r.revision,128),totalBytes:Ne(r.totalBytes,
64*1024**3)}}function S7(r,e=!0,{defaultMaxNewTokens:t=iR}={}){if(!r||!Array.isArray(r.sharedModels)||r.sharedModels.length>
Vn.maximumModels)throw new Error("Invalid shared model catalog");const n=[...new Map(r.sharedModels.map(i=>{const o=Lp(i);
return[o.manifestCid,o]})).values()],s=e&&r.hostedModel?Lp(r.hostedModel):null;return s&&(s.maxNewTokens=Ne(r.hostedModel.
maxNewTokens===void 0?t:r.hostedModel.maxNewTokens,de.maxNewTokens,1)),{sharedModels:n,hostedModel:s,busy:!!r.busy,idleForMs:Ne(
r.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:Ne(r.queuedRequests??0,1024)}}function v7(r,{imageBytes:e=!1}={}){
Os(r.requestId);const t={requestId:r.requestId,manifestCid:Uy(r.manifestCid),messages:Rd(r),maxNewTokens:Ne(r.maxNewTokens??
de.maxNewTokens,de.maxNewTokens,1)};if(r.task!==void 0){if(!["text-generation","image-text-to-text","text-to-image"].includes(
r.task))throw new Error("Invalid inference task");t.task=r.task}r.seed!==void 0&&(t.seed=Ne(r.seed,4294967295)),r.steps!==
void 0&&(t.steps=Ne(r.steps,8,1));for(const n of["width","height"])r[n]!==void 0&&(t[n]=Ne(r[n],512,512));if(t.task==="t\
ext-to-image"&&(r.image!=null||t.messages.length!==1||t.messages[0].role!=="user"))throw new Error("Image generation nee\
ds one text prompt");if(r.image!=null){const{width:n,height:s,channels:i}=r.image;if(Ne(n,de.maxImagePixels,1),Ne(s,de.maxImagePixels,
1),i!==4||n*s>de.maxImagePixels)throw new Error("Invalid inference image dimensions");e&&Ya(r.image),t.image={width:n,height:s,
channels:4},e&&(t.image.data=new Uint8Array(r.image.data))}return t}function aR(r,{imageBytes:e=!1}={}){if(!r||typeof r!=
"object")throw new Error("Invalid result image");const t=Ne(r.width,1024,1),n=Ne(r.height,1024,1);if(r.channels!==4||t*n>
de.maxImagePixels||!/^[a-f0-9]{64}$/.test(r.sha256??""))throw new Error("Invalid result image dimensions or digest");return e&&
Ya(r),{width:t,height:n,channels:4,sha256:r.sha256,...e?{data:r.data}:{}}}function A7(r,e={}){if(typeof r?.text!="string"||
Ny(r.text)>de.maxOutputBytes)throw new Error("Invalid inference result text");const t=r.finishReason===void 0?"unknown":
r.finishReason;if(!["stop","length","unknown"].includes(t))throw new Error("Invalid inference finish reason");const n={text:r.
text,finishReason:t};if(r.contextTruncated!==void 0){if(typeof r.contextTruncated!="boolean")throw new Error("Invalid in\
ference context truncation flag");n.contextTruncated=r.contextTruncated}for(const s of["inputTokens","outputTokens","gpu\
Dispatches","gpuSubmissions"])r[s]!=null&&(n[s]=Ne(r[s],Number.MAX_SAFE_INTEGER));return r.image!=null&&(n.image=aR(r.image,
e)),r.seed!==void 0&&(n.seed=Ne(r.seed,4294967295)),r.steps!==void 0&&(n.steps=Ne(r.steps,8,1)),n}function _7(r){if(!["t\
ext-encoder","denoise","decode"].includes(r.stage))throw new Error("Invalid image generation stage");const e=Ne(r.steps,
8,1);return{type:"diffusion-progress",stage:r.stage,steps:e,step:Ne(r.step,e)}}function I7(r){const e=Ly(r,{maxDataLength:Vn.
frameBytes,maxBufferSize:Vn.frameBytes*2+32});return{rpc:e,async read(t){return JSON.parse(oR.decode((await e.read({signal:t})).
subarray()))},async write(t,n){const s=$y.encode(JSON.stringify(t));if(s.length>Vn.frameBytes)throw new Error("Inference\
 frame exceeds its byte limit");await e.write(s,{signal:n})}}}function Dp(r,e){const t=o=>Number.isSafeInteger(o)&&o>=0?
o:1/0,n=t(r.totalBytes),s=t(e.totalBytes);if(n!==s)return n<s?-1:1;const i=o=>`${o.name??""}\0${o.key??o.manifestCid??""}`;
return i(r)<i(e)?-1:i(r)>i(e)?1:0}function Ds(r={}){const e=[...r.modalities??["text"]],t=r.task??(e.includes("image")?"\
image-text-to-text":"text-generation");return{task:t,modalities:e,outputModalities:[...r.outputModalities??[t==="text-to\
-image"?"image":"text"]]}}function cR(r,{catalog:e,now:t=Date.now,preferences:n=Ty({storeName:r.store.lockName??r.store.
name})}={}){const s=Object.fromEntries(["importCatalog","importPackage","ensure","load","connect","connectBackend","disp\
ose"].map(C=>[C,r[C].bind(r)])),i={},o=new Map,a=new Map,c=new Set,l=new Map,u=new Map,d=new AbortController,h=cM(),p=new Set,
g=new Map,y=new Set,m=new Map;let f=!0,b=!0,w=!1,k,x,A,S,E,_=null,I=0,M=t(),T=Promise.resolve(),$=n.readLastLoaded(),D={
connected:!1,peerCount:0,sharedModelCount:0,hostedModelCount:0,errors:[],checkedAt:null};const U=()=>{if(w)throw new Error(
"Model console is closed")},Q=C=>C?AbortSignal.any([C,d.signal]):d.signal;function H(C){const B=!C.model&&uu(C,Object.values(
e));return r.getModelCompatibility?.(B||C)??{status:"unknown",reason:"Local memory fit is unverified."}}function V(C){const B=H(
C);if(["checking","unavailable"].includes(B.status))throw Object.assign(new Error(B.reason||"This model cannot load on t\
his device"),{code:"ERR_MODEL_LOCAL_UNAVAILABLE",availability:B});return B}if(r.setMemoryBudgets){const C=r.setMemoryBudgets.
bind(r);r.setMemoryBudgets=B=>{if(U(),S||r.service.getStatus().status==="loading")throw new Error("Wait for the model im\
port/load to finish before changing memory budgets");return C(B)}}function te(C,B){if(!B?.model?.runtime||!B.model.repository)
return null;const L=uu(B,Object.values(e));return{manifestCid:C,modelId:L?.id??C,name:L?.name??B.name??B.model.repository,
...Ds(B.model),runtime:B.model.runtime,repository:B.model.repository,revision:B.model.revision,totalBytes:B.files.reduce(
(W,j)=>W+j.size,0)}}async function ie(C){if(!C?.cid)throw new Error("Imported package has no content identity");const B=C.
manifest??await r.store.getManifest(C.cid),L=te(C.cid,B);return L&&(o.set(C.cid,L),a.set(C.cid,B)),L}async function we(C){
const B=await lM(r.store,{signal:C}),L=new Set;for(const W of B){if(W.status==="deleting"){p.add(W.cid);continue}(W.pinned||
W.retain)&&(L.add(W.cid),await ie(W))}for(const W of o.keys())L.has(W)||(o.delete(W),a.delete(W));return $&&!L.has($.manifestCid)&&
($=await n.clearLastLoaded($)),B}async function it(C,B){const L=le();B?.aborted||L?.manifestCid!==C||($=await n.rememberLoaded(
{manifestCid:C,modelId:L.modelId},{signal:B}))}function le(){const C=r.service.getStatus();return _&&!p.has(_.manifestCid)&&
C.status==="ready"&&C.manifestCid===_.manifestCid?_:null}const ot=()=>(k?.listModels()??[]).map(C=>({...C,...Ds(C),providers:C.
providers.filter(B=>!B.local)})).filter(C=>C.providers.length),vt=()=>(k?.listHosts()??[]).map(C=>({...C,...Ds(C),hosts:C.
hosts.filter(B=>!B.local)})).filter(C=>C.hosts.length);function jt(C=[]){const B=r.networkManager,L=!!B?.isConnected,W=new Set(
L?B.peers?.keys()??[]:[]);for(const j of L?B.libp2p?.getConnections?.()??[]:[])j.status==="open"&&W.add(j.remotePeer.toString());
W.delete(B?.libp2p?.peerId?.toString());for(const j of B?.bootstrapPeerIds??[])W.delete(j);D={connected:L,peerCount:W.size,
sharedModelCount:L?ot().length:0,hostedModelCount:L?vt().length:0,checkedAt:t(),errors:(Array.isArray(C)?C:[]).slice(0,Vn.
maximumPeers).map(j=>({peerId:String(j?.peerId??"").slice(0,128),code:String(j?.code??"ERR_PEER_DISCOVERY").slice(0,80),
message:String(j?.message??"Peer directory query failed").slice(0,256)}))}}function ar(C){w||E||(E=Z().catch(B=>{if(!w)for(const L of C?
[C]:o.keys())l.set(L,B)}).finally(()=>{E=null}))}async function Z({strict:C=!1}={}){const B=async()=>{if(w||!(r.artifactReady??
r.networkReady))return;await we(d.signal);const L=new Set(r.networkManager.getPublishedArtifactCids()),W=[];for(const j of c)
if(!o.has(j))try{await r.withdraw(j),L.delete(j),c.delete(j),l.delete(j)}catch(K){l.set(j,K),W.push(K)}for(const j of o.
keys()){try{f&&!p.has(j)&&!L.has(j)&&(await r.publish(j),L.add(j)),(!f||p.has(j))&&L.has(j)&&(await r.withdraw(j),L.delete(
j)),l.delete(j)}catch(K){l.set(j,K),W.push(K)}L.has(j)?c.add(j):c.delete(j)}if(C&&W.length)throw new AggregateError(W,"S\
ome models could not update their file sharing state")};return T=T.catch(()=>{}).then(B),T}async function Ee(C){const B=le();
if(!B)throw new Error("Import a model before using local inference");if(C.image&&!B.modalities.includes("image"))throw new Error(
"This model accepts text only");I++;const L=new AbortController,W=AbortSignal.any([Q(C.signal),L.signal]),j={manifestCid:B.
manifestCid,abort:L};y.add(j);try{return j.promise=Promise.resolve(r.service.generate({...C,task:B.task,signal:W})),await j.
promise}finally{y.delete(j),--I===0&&(M=t())}}async function Gt(){U();const C=r.networkManager;return C?.isConnected?(k?.
closed&&(await C.releasePeerInferenceService(i),k=null),k||(x||(x=C.createPeerInferenceService({owner:i,requestTimeoutMs:3e5,
getLocalState:()=>{const B=r.service.getStatus(),L=I>0||!!B.activeRequestId||B.queuedRequests>0,W=le(),j=[...o.values()].
filter(K=>c.has(K.manifestCid)&&!p.has(K.manifestCid));return W&&j.sort((K,ge)=>+(ge.manifestCid===W.manifestCid)-+(K.manifestCid===
W.manifestCid)),{sharedModels:f?j.slice(0,Vn.maximumModels):[],hostedModel:b&&!w?le():null,busy:L,queuedRequests:B.queuedRequests??
0,idleForMs:L?0:Math.max(0,t()-M)}},generate:async({manifestCid:B,...L})=>{if(!b||w||le()?.manifestCid!==B)throw new Error(
"Model is no longer hosted");return Ee(L)}}).then(async B=>{if(w)throw await C.releasePeerInferenceService(i),new Error(
"Model console is closed");return k=B,await B.setHostingEnabled(b),B}).finally(()=>{x=null})),x)):null}async function nn(){
await Gt(),ar()}function At(C,B){U();const L=Q(B);return h.run(()=>(U(),C(L)),{signal:L})}async function _t(C,B,{deferSharing:L=!1}={}){
let W;try{W=await s[C](...B)}catch(j){throw Cy(j)}return await ie(W),L||await Z(),W}function at(C){ar(C)}async function ut(C,B={}){
if(p.has(C))throw new Error("This model is being deleted; retry deletion before loading it");V(await r.store.getManifest(
C,{signal:B.signal})),m.has(C)||m.set(C,await r.store.acquireUse(C,{signal:B.signal}));let L;try{L=await s.load(C,B)}catch(W){
throw r.service.getStatus().manifestCid!==C&&await xe(C),W}return _=await ie({cid:C}),M=t(),await Gt(),await it(C,B.signal),
{...L,manifestCid:C}}async function $t(){await k?.setHostingEnabled(!1),await r.service.unloadModel();for(const C of m.keys())
await xe(C);_=null,await k?.setHostingEnabled(b)}async function xe(C){const B=m.get(C);B&&(await B(),m.delete(C))}async function dt(C,B,L){
if(L.throwIfAborted(),V(C.manifest??await r.store.getManifest(C.cid,{signal:L})),L.throwIfAborted(),le()?.manifestCid===
C.cid)return await it(C.cid,L),at(C.cid),{...r.service.getStatus().evidence,manifestCid:C.cid};B.onProgress?.({stage:"un\
load"}),L.throwIfAborted(),await $t(),L.throwIfAborted(),B.onProgress?.({stage:"load"}),L.throwIfAborted();const W=await ut(
C.cid,{...B,signal:L});return at(C.cid),W}async function It(C,B){if(U(),S)throw new Error("Another model import or load \
is already running");S=At(C,B);try{return await S}finally{S=null}}for(const C of["connect","connectBackend"])r[C]=async(...B)=>{
U();const L=await s[C](...B);return await nn(),L};for(const C of["importCatalog","importPackage"])r[C]=(...B)=>{const L=C===
"importPackage"?2:1;return At(W=>(B[L]={...B[L],signal:W},_t(C,B)),B[L]?.signal)};return r.ensure=(C,B={})=>At(L=>_t("en\
sure",[C,{...B,signal:L}]),B.signal),r.load=(C,B={})=>At(L=>ut(C,{...B,signal:L}),B.signal),Object.assign(r,{getPreferences:()=>({
sharing:f,hostInference:b}),getSharingErrors:()=>[...l].map(([C,B])=>({manifestCid:C,message:B.message})),getDiscoveryStatus:()=>structuredClone(
{...D,connected:!!r.networkManager?.isConnected}),getPreferredModelSourceKey(){const C=$&&!p.has($.manifestCid)&&o.get($.
manifestCid);return C?e[C.modelId]?`hf:${C.modelId}`:`stored:${C.manifestCid}`:`hf:${dM}`},listModelSources(){return[...Object.
values(e).map(C=>({key:`hf:${C.id}`,name:C.name,source:"hf",modelId:C.id,...Ds(C.model),runtime:C.model.runtime,totalBytes:C.
totalBytes,localAvailability:H(C)})),...ot().map(C=>({...C,key:`peer:${C.manifestCid}`,source:"peers",localAvailability:H(
C)})),...[...o.values()].filter(C=>!e[C.modelId]&&!p.has(C.manifestCid)).map(C=>({...C,key:`stored:${C.manifestCid}`,source:"\
stored",localAvailability:H(a.get(C.manifestCid)??C)}))].sort(Dp)},listInferenceTargets(){const C=le();return[{key:"loca\
l",name:C?.name??"No model loaded",local:!0,available:!!C,busy:I>0,...Ds(C??{}),providerCount:C?1:0},...vt().map(B=>({...B,
key:`peer:${B.manifestCid}`,local:!1,available:!0,busy:B.hosts.every(L=>L.busy),providerCount:B.hosts.length}))]},async refreshPeers({
signal:C}={}){return U(),A||(A=(async()=>{const B=Q(C);try{B.throwIfAborted();const L=await Gt();B.throwIfAborted(),ar();
const W=L?await L.refresh({signal:B}):null;return B.throwIfAborted(),jt(W?.errors),{models:r.listModelSources(),targets:r.
listInferenceTargets(),discovery:r.getDiscoveryStatus()}}catch(L){throw!w&&!B.aborted&&jt([L]),L}})().finally(()=>{A=null})),
A},async setSharing(C){U();const B=f;f=!!C;try{await Z({strict:!0})}catch(L){throw f=B,L}return r.getPreferences()},async setHostInference(C){
return U(),b=!!C,await(await Gt())?.setHostingEnabled(b),r.getPreferences()},async acquireModel(C,B={}){U();const L=r.listModelSources().
find(j=>j.key===C);if(!L)throw new Error("This model source is no longer available");if(L.source==="stored")return r.loadStoredModel(
L.manifestCid,B);const W=L.source==="hf"?e[L.modelId]:L;return V(W),It(async j=>{V(W);let K;if(L.source==="hf"){const ge=$&&
o.get($.manifestCid),ke=ge?.modelId===L.modelId?ge:[...o.values()].find(De=>De.modelId===L.modelId);K=ke&&await r.store.
stat(ke.manifestCid,{signal:j}),(!K||K.status!=="complete")&&(K=await _t("importCatalog",[L.modelId,{...B,signal:j}],{deferSharing:!0}))}else
r.inspectPeerPackage&&V(await r.inspectPeerPackage(L.manifestCid,{signal:j})),j.throwIfAborted(),B.onProgress?.({stage:"\
download-peers"}),j.throwIfAborted(),K=await _t("ensure",[L.manifestCid,{signal:j}],{deferSharing:!0});return dt(K,B,j)},
B.signal)},loadStoredModel(C,B={}){const L=ye(C).toString();return It(async W=>{if(p.has(L))throw new Error("This model \
is being deleted; retry deletion before loading it");const j=await r.store.stat(L,{signal:W});if(j?.kind!=="manifest"||j.
status!=="complete"||!(j.pinned||j.retain))throw new Error("This model is no longer completely stored and retained on th\
is device. Import it before loading.");return dt(j,B,W)},B.signal)},unload(){return At(()=>$t())},async listStoredModels({
signal:C}={}){U();const B=Q(C),L=await we(B),W=r.service.getStatus(),j=new Set(r.networkManager?.getPublishedArtifactCids?.()??
[]);return L.map(K=>({manifestCid:K.cid,name:te(K.cid,K.manifest)?.name??K.manifest.name??K.cid,modelId:te(K.cid,K.manifest)?.
modelId??K.cid,totalBytes:K.manifest.files.reduce((ge,ke)=>ge+ke.size,0),runtime:K.manifest.model.runtime,localAvailability:K.
status==="deleting"||p.has(K.cid)?{status:"unavailable",code:"model_deleting",reason:"Finish deleting this package befor\
e loading it."}:K.pinned||K.retain?H(K.manifest):{status:"unavailable",code:"model_not_retained",reason:"This package is\
 not retained for local use. Import it before loading."},loaded:W.status!=="idle"&&W.manifestCid===K.cid,shared:j.has(K.
cid),...K.status==="deleting"||p.has(K.cid)?{cleanupPending:!0}:{},...l.has(K.cid)?{shareError:l.get(K.cid).message}:{}})).
sort(Dp)},deleteStoredModel(C,{signal:B}={}){U();const L=ye(C).toString();if(g.has(L))return g.get(L);B?.throwIfAborted(),
p.add(L);const W=At(j=>uM(r,async()=>{let K=!1;const ge=await r.store.stat(L,{signal:j});if(ge&&(ge.kind!=="manifest"||!ge.
manifest?.model?.runtime))throw p.delete(L),new Error("Only stored model packages can be deleted here");try{await T.catch(
()=>{}),r.networkManager?.getPublishedArtifactCids?.().includes(L)&&await r.withdraw(L),c.delete(L);const ke=r.service.getStatus();
if(_?.manifestCid===L||ke.manifestCid===L){await k?.setHostingEnabled(!1);const sn=[...y].filter(Nt=>Nt.manifestCid===L);
for(const Nt of sn)Nt.abort.abort(new DOMException("Stored model is being deleted","AbortError"));await Promise.allSettled(
sn.map(Nt=>Nt.promise)),await r.service.unloadModel(),await xe(L),_=null,K=!0}j.throwIfAborted();const Ge=await r.store.
remove(L,{signal:j});return o.delete(L),a.delete(L),p.delete(L),l.delete(L),$?.manifestCid===L&&($=await n.clearLastLoaded(
$)),await k?.setHostingEnabled(b),{deleted:Ge.removed,freedBytes:Ge.freedBytes,unloaded:K}}catch(ke){throw await r.store.
stat(L).catch(()=>{})===void 0&&o.delete(L),await k?.setHostingEnabled(b).catch(()=>{}),ke}},{signal:j}),B).finally(()=>{
g.delete(L)});return g.set(L,W),W},async generate(C,B={}){U();const L=B.requestId??crypto.randomUUID();if(u.has(L))throw new Error(
"Duplicate inference request ID");const W=new AbortController,j=AbortSignal.any([Q(B.signal),W.signal]),K={abort:W,remote:C!==
"local"};u.set(L,K);try{const ge={...B,requestId:L,signal:j};if(C==="local")return await Ee(ge);const ke=vt().find(De=>`\
peer:${De.manifestCid}`===C);if(!ke)throw new Error("No peer is currently hosting that model");if(B.image&&!ke.modalities.
includes("image"))throw new Error("This model accepts text only");return await k.generate(ke.manifestCid,{...ge,task:ke.
task})}finally{u.delete(L)}},async cancel(C){const B=u.get(C);return B?(B.abort.abort("User cancelled"),B.remote?await k?.
cancel(C):await r.service.cancel(C),!0):!1}}),r.dispose=async()=>{w=!0,b=!1,_=null,d.abort("Model console closed");for(const C of u.
values())C.abort.abort("Model console closed");await x?.catch(()=>{}),await r.networkManager?.releasePeerInferenceService(
i),k=null,await Promise.allSettled([T,E,A,S,h.settled()].filter(Boolean)),await s.dispose();for(const C of m.keys())await xe(
C)},{async initialize(){await r.checkDeviceCapabilities?.(),await we(d.signal),r.networkManager?.isConnected&&await nn()}}}
function pr(r){r?.throwIfAborted()}function to(r,e){return pr(e),e?new Promise((t,n)=>{const s=()=>n(e.reason);e.addEventListener(
"abort",s,{once:!0}),r.then(t,n).finally(()=>e.removeEventListener("abort",s))}):r}function lR({store:r,manager:e=null,createManager:t,
stopArtifacts:n=s=>s._stopArtifactTransport()}={}){let s=e,i=null,o=null,a=null,c=null,l=null,u="offline",d=null,h=!1;const p=new Set,
g=new AbortController;function y(){if(h)throw new Error("Model network connection is disposed")}function m(){const E=s?.
getArtifactTransport?.();return E?.store===r&&!E.requiresCleanup?E:null}function f(){return!h&&!!s?.isConnected&&u==="re\
ady"&&!!m()}async function b(){const E=d;if(!E)return;const _=E.manager.getArtifactTransport?.();_&&_===E.transport&&await n(
E.manager),d===E&&(d=null)}function w(){if(y(),!s?.isConnected)return Promise.resolve(null);if(o)return o;if(m())return u=
"ready",l=null,Promise.resolve(m());const E=s;u="starting",l=null;const _=(async()=>{try{if(E.artifactStopping&&await E.
artifactStopping,h||!E.isConnected)return null;d?.manager===E&&E.getArtifactTransport?.()?.requiresCleanup&&await b();const M=E.
getArtifactTransport?.()||E.artifactStarting?null:{manager:E,transport:null};M&&(d=M);let T;try{T=await E.createArtifactTransport(
r)}finally{M&&(M.transport=E.getArtifactTransport?.()??null,!M.transport&&d===M&&(d=null))}if(T?.store!==r||T.requiresCleanup)
throw new Error("Artifact transport is not ready for this model library");return!h&&s===E&&E.isConnected&&(u="ready"),T}catch(I){
return h||(l=I,u="error"),null}finally{(h||!E.isConnected)&&(u="offline")}})();return o=_,_.then(()=>{o===_&&(o=null)}),
_}async function k(E){await E.disconnect(),p.delete(E),s===E&&(s=null),d?.manager===E&&(d=null)}function x(E,{signal:_}={}){
if(y(),pr(_),s?.isConnected)return w(),Promise.resolve(f()?m():null);if(i)return to(i,_);const I=_?AbortSignal.any([_,g.
signal]):g.signal;c=null;const M=(async()=>{let T=s;try{for(const $ of p)$!==s&&await k($);if(pr(I),!T){const $=typeof E==
"function"?await E({signal:I}):E;pr(I),T=await t($),p.add(T),pr(I)}return T.libp2p||await T.initialize(),pr(I),await T.connect(),
pr(I),s=T,c=null,w(),f()?m():null}catch($){if(T&&p.has(T))try{await k(T)}catch(D){$=new AggregateError([$,D],"Applicatio\
n connection failed and its cleanup must be retried",{cause:$})}throw h||(c=$),$}})();return i=M,M.then(()=>{i===M&&(i=null)},
()=>{i===M&&(i=null)}),to(M,_)}async function A({signal:E}={}){if(y(),pr(E),!s?.isConnected)throw new Error("Connect the\
 network before transferring model files");if(o?await to(o,E):u==="offline"&&await to(w(),E),pr(E),y(),!f())throw l??new Error(
"Model file sharing is unavailable; use Connect to retry");return m()}function S(){if(a)return a;h=!0,g.abort(new DOMException(
"Model network connection disposed","AbortError")),u="offline";const E=(async()=>{await i?.catch(()=>{}),await o;const _=[];
for(const I of p)try{await k(I)}catch(M){_.push(M)}if(d&&!p.has(d.manager))try{await b()}catch(I){_.push(I)}if(_.length)
throw new AggregateError(_,"Model network cleanup failed; retry closing the console")})();return a=E,E.then(()=>{a===E&&
(a=null)},()=>{a===E&&(a=null)}),E}return{connect:x,startArtifacts:w,requireArtifacts:A,dispose:S,get manager(){return s},
get networkReady(){return!h&&!!s?.isConnected},get artifactReady(){return f()},get error(){return c??l},getArtifactNetworkStatus(){
const E=h||!s?.isConnected?"offline":u;return{status:E,error:E==="error"?String(l?.message??l).slice(0,1024):null}}}}const uR=""+
new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.url).href,dR=""+new URL("ort-wasm-simd-threaded.asyn\
cify-DXIbolS2.mjs",import.meta.url).href,hR=""+new URL("wllama-DrYkKwf9.wasm",import.meta.url).href,fR=""+new URL("ort-w\
asm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,pR=""+new URL("ort-wasm-simd-threaded.jsep-CdNSU0KB.mjs",import.meta.
url).href,Pp=Object.freeze({...Ha,...wd,...Ka,...Qa});function mR(r){if(r){const e=new URL(r,location.href);return{mjs:new URL(
"ort-wasm-simd-threaded.asyncify.mjs",e).href,wasm:new URL("ort-wasm-simd-threaded.asyncify.wasm",e).href}}return{mjs:new URL(
dR,location.href).href,wasm:new URL(uR,location.href).href}}function gR(){return{wasm:new URL(hR,location.href).href}}function bR(){
return{mjs:new URL(pR,location.href).href,wasm:new URL(fR,location.href).href}}async function $p(){const{validateGgufCapabilities:r}=await kt(
async()=>{const{validateGgufCapabilities:e}=await import("./runtimeDefinition-B0QVSqJZ.js");return{validateGgufCapabilities:e}},
__vite__mapDeps([2,3]),import.meta.url);return r()}async function yR({stateManager:r,computeManager:e,networkManager:t,storeName:n="\
inference-models",runtimeBaseUrl:s,collectGpuEvidence:i=!1,memoryBudgets:o,preferenceStorage:a,probeDeviceCapabilities:c=nM,
ggufRuntimeOptions:l={n_ctx:2048,n_batch:64,n_gpu_layers:99999,n_threads:1}}={}){let u=du(o),d=null,h;const p=!r,g=!e,y=r??
new G5(t??null,{enablePersistence:!1,disableNetworkProvider:!0,disableBroadcast:!0}),m=e??new pT({requireWorkers:!0,enableWorkers:!0,
enableWebGPU:!0,minWorkers:1,targetWorkers:1,maxWorkers:1,autoScaleWorkers:!1,workerBootstrapTimeoutMs:6e4}),b=t?.getArtifactTransport?.()?.
store??y.getArtifactStore(n),w=b??y.createArtifactStore({name:n,capacity:"browser",maximumTraversalBlocks:131072});let k,
x,A,S;const E=lR({store:w,manager:t,async createManager(T){const{NetworkManager:$}=await kt(async()=>{const{NetworkManager:D}=await import("./NetworkManager-CDWa-HJw.js").
then(U=>U.U);return{NetworkManager:D}},__vite__mapDeps([7,3]),import.meta.url);return new $(T)}});try{await w.open();const T=12*
1024**3,$=16*1024**3;k=await m.createModelInferenceService({artifactStore:w,resourceBudgets:{cpu:{units:1,memoryBytes:T},
gpu:{units:1,memoryBytes:$}},resourceEstimate:ko,runtimeAssets:mR(s),collectGpuEvidence:i,generationTimeoutMs:3e5}),x=await _(
l),A=await m.createModelInferenceService({artifactStore:w,runtime:"onnx-diffusion",runtimeAssets:bR(),runtimeOptions:{},
collectGpuEvidence:i,resourceEstimate:ko,loadTimeoutMs:3e5,generationTimeoutMs:3e5}),S=k,E.networkReady&&E.startArtifacts()}catch(T){
throw await A?.dispose().catch(()=>{}),await x?.dispose().catch(()=>{}),await k?.dispose().catch(()=>{}),g&&await m.destroy().
catch(()=>{}),p?await y.destroy().catch(()=>{}):b||await w.destroy().catch(()=>{}),T}async function _(T){return m.createModelInferenceService(
{artifactStore:w,runtime:"llama.cpp",runtimeAssets:gR(),runtimeOptions:T,collectGpuEvidence:i,resourceEstimate:ko,loadTimeoutMs:30*
6e4,generationTimeoutMs:3e5})}const I={stateManager:y,computeManager:m,store:w,get service(){return S},get services(){return{
onnx:k,gguf:x,diffusion:A}},getDeviceCapabilities:()=>d,async checkDeviceCapabilities(){return h??=Promise.resolve().then(
()=>c()).then(T=>(d=T,T)),h},getMemoryBudgets:()=>({...u}),setMemoryBudgets(T){return u=du(T),{...u}},getModelCompatibility(T){
const $=m.resourceBroker?.reportPressure().pools,D={...u};for(const[U,Q]of[["cpuBytes","cpu"],["gpuBytes","gpu"]]){const H=$?.[Q]?.
memoryBytes;Number.isSafeInteger(H)&&H>0&&(D[U]=Math.min(D[U]??H,H))}return iM(T,{device:d,budgets:D})},async inspectPeerPackage(T,{
signal:$}={}){const D=ye(T);if(D.code!==85)throw new Error("Model packages require a manifest CID");try{return await w.getManifest(
D.toString(),{signal:$})}catch(H){if($?.throwIfAborted(),!E.networkReady)throw H}await E.requireArtifacts({signal:$});const U=await E.
manager.fetchArtifactBlock(D.toString(),{artifactCid:D.toString(),signal:$});if($?.throwIfAborted(),!(U instanceof Uint8Array)||
U.byteLength>un)throw new Error("Peer model manifest exceeds its metadata budget");if(!HT(U).every((H,V)=>H===D.multihash.
digest[V]))throw new Error("Peer model manifest CID mismatch");return ru(U)},checkGgufCapabilities:$p,get networkManager(){
return E.manager},get networkReady(){return E.networkReady},get artifactReady(){return E.artifactReady},get networkError(){
return E.error},getArtifactNetworkStatus:()=>E.getArtifactNetworkStatus(),async connectBackend(T={}){return E.connect(({
signal:$})=>fM({...T,signal:$}),T)},async connect(T,{signal:$}={}){return $?.throwIfAborted(),E.connect(()=>{if(typeof T!=
"string"||T.length>1024||!/^\/(?:dns4|dns6|ip4|ip6)\//.test(T)||!T.includes("/p2p/"))throw new Error("Enter a relay mult\
iaddress including its peer ID");return{bootstrapPeers:[T]}},{signal:$})},async importCatalog(T,$={}){const D=Pp[T];if(!D)
throw new Error("Unknown approved model");const U=Ha[T]?gT:Ka[T]?ST:Qa[T]?AT:yT;return Ip(w,{schema:"peercompute.artifac\
t.manifest.v1",name:D.name,files:D.files,model:D.model,provenance:{...D.provenance,license:D.license}},Q=>U(T,Q),$)},async importPackage(T,$,{
expectedCid:D,...U}={}){T=Va(T);const Q=new URL($,location.href);if(Q.origin!==location.origin)throw new Error("Fixture \
package source must be same-origin");const H=await Ip(w,T,V=>new URL(V.split("/").map(encodeURIComponent).join("/"),Q).href,
U);if(D&&H.cid!==D)throw new Error("Package manifest CID changed during import");return H},async load(T,{ggufGpuLayers:$,
...D}={}){const U=await w.getManifest(T,{signal:D.signal}),Q=U.model?.runtime==="llama.cpp",H=U.model?.runtime==="onnx-d\
iffusion";if(!Q&&!H&&U.model?.runtime!=="transformers.js")throw new Error("This package can be stored and hosted, but it\
s model runtime is unavailable in this browser demo");if([k,x,A].some(V=>V.getStatus().status!=="idle"))throw new Error(
"Unload the resident model before loading another package");if(Q&&(await $p(),$!==void 0)){if(!Number.isSafeInteger($)||
$<1||$>99999)throw new Error("GGUF GPU layers must be between 1 and 99999 (all layers)");const V=await _({...l,n_gpu_layers:$});
try{await x.dispose()}catch(te){throw await V.dispose(),te}x=V}return S=Q?x:H?A:k,S.loadModel({manifestCid:T,...D})},async ensure(T,$={}){
return await E.requireArtifacts($),w.ensureLocal(T,{...$,fetchBlock:(D,U)=>E.manager.fetchArtifactBlock(D,{...U,artifactCid:T})})},
async publish(T){return await E.requireArtifacts(),E.manager.announceArtifact(T)},async withdraw(T){return await E.requireArtifacts(),
E.manager.withdrawArtifact(T)},async dispose(){await A.dispose(),await x.dispose(),await k.dispose(),await E.dispose(),g&&
await m.destroy(),p&&await y.destroy()}},M=cR(I,{catalog:Pp,preferences:Ty({storeName:w.lockName??w.name??n,storage:a})});
try{await M.initialize()}catch(T){throw await I.dispose(),T}return I}function wR(r){const e=new URL(r),t=e.searchParams.
get("prod")==="1"?"prod":e.searchParams.get("dev")==="1"?"dev":null,n=["5189","5176","5187"].includes(e.port)&&/^\/(?:index\.html)?$/.
test(e.pathname);return n?(e.port="4173",e.pathname="/"):e.pathname=e.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/,
"/"),e.search=t?`?${t}=1`:n?"?dev=1":"",e.hash="",e.href}const O=(r,e,t)=>{const n=document.createElement(r);return e!==
void 0&&(n.textContent=e),t&&(n.className=t),n},Ae=(r,e)=>{const t=O("button",r);return t.type="button",e&&t.setAttribute(
"aria-label",e),t},Ur=(r,e)=>{const t=O("label",r);return t.append(e),t};function ro(r){const e=O("dialog",void 0,"pc-mo\
del-dialog"),t=O("h2",r);t.id=`model-dialog-${crypto.randomUUID()}`,e.setAttribute("aria-labelledby",t.id);const n=Ae("D\
one");n.autofocus=!0,n.onclick=()=>e.close();const s=O("div",void 0,"pc-dialog-header");s.append(t,n);const i=O("div",void 0,
"pc-dialog-body"),o=O("p","","pc-inference-status");return o.setAttribute("role","status"),e.append(s,i,o),e.addEventListener(
"keydown",a=>{if(a.key!=="Tab")return;const c=[...e.querySelectorAll("button,input,select,textarea,a[href],[tabindex]")].
filter(d=>!d.disabled&&d.tabIndex>=0&&d.getClientRects().length),l=c[0],u=c.at(-1);(a.shiftKey&&document.activeElement===
l||!a.shiftKey&&document.activeElement===u)&&(a.preventDefault(),(a.shiftKey?u:l)?.focus())}),{element:e,body:i,status:o}}
function zs(r){return!Number.isSafeInteger(r)||r<0?"Unknown size":r>=1024**3?`${(r/1024**3).toFixed(2)} GiB`:r>=1024**2?
`${(r/1024**2).toFixed(1)} MiB`:`${Math.ceil(r/1024)} KiB`}function Fy(r){const e=t=>Number.isSafeInteger(t.totalBytes)&&
t.totalBytes>=0?t.totalBytes:1/0;return[...r].sort((t,n)=>e(t)-e(n)||String(t.name).localeCompare(String(n.name))||String(
t.key??t.manifestCid).localeCompare(String(n.key??n.manifestCid)))}function kR(r){const e=O("section",void 0,"pc-inferen\
ce-panel");e.setAttribute("aria-label","Model chat");const t=O("nav",void 0,"pc-console-navigation");t.setAttribute("ari\
a-label","Console navigation");const n=O("a","←","pc-console-back");n.href=wR(location.href),n.setAttribute("aria-labe\
l","Back to demo overview"),n.title="Back to demo overview";const s=Ae("☰","About and links");s.title="About and links",
t.append(n,s),e.append(t);const i=O("input");i.type="search",i.placeholder="Filter models",i.setAttribute("aria-label","\
Filter models"),i.maxLength=256;const o=O("select");o.setAttribute("aria-label","Model and source");const a=Ae("Import M\
odel"),c=Ae("Stored Models"),l=Ae("Config","Configure model chat"),u=ro("Config"),d=ro("Stored Models"),h=ro("Model setu\
p"),p=ro("About PeerCompute"),g=p.element;p.body.append(O("p","PeerCompute runs models in your browser using WebGPU. You\
 can chat with a model on this device or use inference hosted by another peer.")),p.body.append(O("p","Model files are i\
dentified by their content and shared over IPFS. File sharing and hosted inference are available while the hosting brows\
er stays online."));const y=O("ul",void 0,"pc-about-links");for(const[Pe,Wt]of[["Tsotchke-Corporation on Hugging Face","\
https://huggingface.co/Tsotchke-Corporation"],["tsotchke.org","https://tsotchke.org"],["tsotchke.net","https://tsotchke.\
net"]]){const R=O("a",Pe);R.href=Wt,R.target="_blank",R.rel="noopener noreferrer";const P=O("li");P.append(R),y.append(P)}
p.body.append(y);const m=u.element,f=d.element,b=h.element,w=O("strong"),k=O("p","","pc-inference-note"),x=O("select"),A=O(
"select");x.setAttribute("aria-label","Browser"),A.setAttribute("aria-label","Operating system");for(const[Pe,Wt]of[["ch\
rome","Chrome"],["chromium","Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Firefox"],["safari","Safari"],["ot\
her","Other browser"]]){const R=O("option",Wt);R.value=Pe,x.append(R)}for(const[Pe,Wt]of[["linux","Linux"],["windows","W\
indows"],["macos","macOS"],["android","Android"],["ios","iOS / iPadOS"],["other","Other system"]]){const R=O("option",Wt);
R.value=Pe,A.append(R)}const S=O("div",void 0,"pc-config-grid");S.append(Ur("Browser",x),Ur("Operating system",A));const E=O(
"div",void 0,"pc-model-help-details"),_=O("textarea");_.readOnly=!0,_.rows=3,_.setAttribute("aria-label","Browser launch\
 command"),_.spellcheck=!1;const I=Ae("Copy command"),M=Ae("Open Config"),T=O("div",void 0,"pc-model-help-command");T.append(
_,I),h.body.append(w,k,S,O("p","Browser detection is approximate. Adjust these choices if needed.","pc-inference-note"),
E,T,M);for(const[Pe,Wt]of[[l,m],[c,f],[s,g]])Wt.id=`model-window-${crypto.randomUUID()}`,Pe.setAttribute("aria-controls",
Wt.id),Pe.setAttribute("aria-haspopup","dialog");const $=O("div",void 0,"pc-model-toolbar");$.append(i,o,a,c,l),e.append(
$);const D=O("p","","pc-model-availability");D.setAttribute("aria-live","polite"),D.id=`model-availability-${crypto.randomUUID()}`,
o.setAttribute("aria-describedby",D.id),e.append(D);const U=Ae("Setup help","Set up selected model");U.hidden=!0,U.className=
"pc-source-help",e.append(U);const Q=O("p","Connecting to peer network…","pc-network-summary");Q.setAttribute("aria-li\
ve","polite"),e.append(Q);const H=O("input");H.type="checkbox",H.checked=!0;const V=O("input");V.type="checkbox",V.checked=
!0;const te=O("div",void 0,"pc-model-preferences"),ie=Ur("Share with peers",H);ie.prepend(H),ie.title="Share imported mo\
del files with connected peers while this browser stays online.";const we=Ur("Host inference",V);we.prepend(V),we.title=
"Allow connected peers to send requests to the model loaded on this device.",te.append(ie,we),u.body.append(te);const it=O(
"p","Opening model chat…","pc-inference-status");it.setAttribute("role","status"),e.append(it);const le=O("input");le.
type="number",le.min="1",le.max="99999",le.value="99999",le.setAttribute("aria-label","GGUF GPU layer limit");const ot=O(
"div",void 0,"pc-config-grid"),vt=O("input"),jt=O("input");for(const Pe of[vt,jt])Pe.type="number",Pe.min="0",Pe.max="10\
24",Pe.step="any",Pe.placeholder="Auto";ot.append(Ur("Model RAM budget (GiB)",vt),Ur("Model GPU memory budget (GiB)",jt));
const ar=O("p","","pc-inference-note");u.body.append(ot,ar);const Z=O("div",void 0,"pc-config-grid");Z.append(Ur("GGUF G\
PU layers",le)),u.body.append(Z),u.body.append(O("p","99999 uses all GPU layers. The 27B model was tested with 56 layers\
 on an RTX 5060 Ti (16 GB), with a compatible browser.","pc-inference-note"));const Ee=O("input");Ee.placeholder="Option\
al relay multiaddress",Ee.setAttribute("aria-label","Artifact relay multiaddress");const Gt=Ae("Connect"),nn=O("div",void 0,
"pc-config-row");nn.append(Ee,Gt),u.body.append(nn);const At=O("p","","pc-inference-note");u.body.append(At);const _t=O(
"input");_t.type="file",_t.setAttribute("aria-label","Pin a file locally"),u.body.append(Ur("Pin a file locally",_t));const at=Ae(
"Unload local model");u.body.append(at);const ut=Ae("Clear conversation");u.body.append(ut),u.body.append(O("p","Clear c\
hat history to start a new conversation while keeping the loaded model and stored files.","pc-inference-note")),d.body.append(
O("p","Load uses the files already on this device and replaces the current local model. Delete removes a model and unloa\
ds it if needed. Files used by other stored models or pinned separately are kept.","pc-inference-note"));const $t=O("ul",
void 0,"pc-stored-models");$t.setAttribute("aria-label","Stored model packages");const xe=Ae("Refresh"),dt=Ae("Stop load\
ing");dt.hidden=!0,d.body.append($t,xe,dt);const It=O("div",void 0,"pc-inference-transcript");It.setAttribute("role","lo\
g"),It.setAttribute("aria-label","Conversation"),It.setAttribute("aria-live","polite");const C=O("p","Import a model or \
choose an available peer to start chatting.","pc-chat-empty");It.append(C),e.append(It);const B=O("div",void 0,"pc-infer\
ence-actions");e.append(B);const L=O("div",void 0,"pc-chat-attachment");L.hidden=!0;const W=O("img");W.alt="Selected ima\
ge";const j=O("span"),K=Ae("×","Remove attached image");L.append(W,j,K),e.append(L);const ge=O("textarea");ge.rows=2,ge.
maxLength=16e3,ge.placeholder="Message…",ge.setAttribute("aria-label","Message"),e.append(ge);const ke=O("select");ke.
setAttribute("aria-label","Chat target");const De=Ae("+","Attach image");De.title="Attach an image";const Ge=O("input");
Ge.type="file",Ge.accept="image/png,image/jpeg,image/webp,image/gif",Ge.hidden=!0,Ge.setAttribute("aria-label","Choose i\
mage attachment");const sn=Ae("Send"),Nt=Ae("Stop");Nt.hidden=!0;const ms=O("div",void 0,"pc-chat-controls");return ms.append(
ke,De,Ge,sn,Nt),e.append(ms),e.append(m,f,b,g),r.append(e),{panel:e,sourceFilter:i,source:o,sourceStatus:D,sourceHelp:U,
discoveryStatus:Q,acquire:a,stored:c,configure:l,sharing:H,hosting:V,status:it,configuration:m,configurationStatus:u.status,
storedModels:f,storedList:$t,storedRefresh:xe,storedCancel:dt,storedStatus:d.status,gpuLayers:le,back:n,menu:s,about:g,compatibility:b,
helpModel:w,helpReason:k,helpBrowser:x,helpOs:A,helpDetails:E,helpCommandGroup:T,helpCommand:_,helpCopy:I,helpConfig:M,helpStatus:h.
status,cpuBudget:vt,gpuBudget:jt,memoryNote:ar,relay:Ee,connect:Gt,networkStatus:At,file:_t,unload:at,clearChat:ut,transcript:It,
empty:C,proposed:B,attachment:L,attachmentImage:W,attachmentName:j,removeAttachment:K,prompt:ge,target:ke,attach:De,imageFile:Ge,
send:sn,cancel:Nt}}function ER(r,e){r.helpModel.textContent=e.name,r.helpReason.textContent=e.reason,r.helpDetails.replaceChildren();
for(const t of e.paragraphs)r.helpDetails.append(O("p",t,"pc-inference-note"));if(e.steps.length){const t=O("ol");for(const n of e.
steps)t.append(O("li",n));r.helpDetails.append(t)}for(const t of e.links){const n=O("a",t.label);n.href=t.url,n.target="\
_blank",n.rel="noopener noreferrer";const s=O("p",void 0,"pc-inference-note");s.append(n),r.helpDetails.append(s)}r.helpCommand.
value=e.command??"",r.helpCommandGroup.hidden=!e.command,r.helpConfig.hidden=!e.openConfig,r.helpStatus.textContent=""}function xR(r,e,t,n){
r.storedList.replaceChildren(),e.length||r.storedList.append(O("li","No models stored on this device.","pc-stored-empty"));
for(const s of Fy(e)){const i=O("li",void 0,"pc-stored-model"),o=O("div");o.append(O("strong",s.name));const a=[zs(s.totalBytes),
...s.loaded?["Loaded"]:[],...s.shared?["Shared"]:[],...s.cleanupPending?["Cleanup pending"]:[]];o.append(O("p",a.join(" \
· "),"pc-inference-note")),s.shareError&&o.append(O("p",`Sharing unavailable: ${String(s.shareError).slice(0,256)}`,"pc\
-inference-note"));const c=["checking","unavailable"].includes(s.localAvailability?.status);c&&o.append(O("p",String(s.localAvailability.
reason||"This model is unavailable on this device.").slice(0,512),"pc-inference-note"));const l=Ae(s.loaded?"Loaded":"Lo\
ad",`${s.loaded?"Loaded":"Load"} ${s.name}`);l.dataset.inactive=String(!!(s.loaded||s.cleanupPending||c||!n)),l.disabled=
l.dataset.inactive==="true",l.onclick=()=>n?.(s);const u=s.cleanupPending?"Retry delete":"Delete",d=Ae(u,`${u} ${s.name}`);
d.className="pc-delete-model";const h=O("div",void 0,"pc-stored-actions");h.append(l,d),d.onclick=()=>t(s),i.append(o,h),
r.storedList.append(i)}}function Np(r,e,t,{image:n,targetName:s}={}){r.empty.remove();const i=O("article",void 0,`pc-cha\
t-message pc-chat-message-${e}`);if(i.append(O("span",e==="user"?"YOU":s||"MODEL","pc-chat-speaker")),n){const a=O("img");
a.src=n,a.alt="Attached image",a.className="pc-chat-image",i.append(a)}const o=O("p",t);return i.append(o),r.transcript.
append(i),o}const Up=Object.freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"Microsoft Edge",brave:"Brave",firefox:"\
Firefox",safari:"Safari",other:"Other browser"}),Fp=Object.freeze({linux:"Linux",windows:"Windows",macos:"macOS",android:"\
Android",ios:"iOS / iPadOS",other:"Other operating system"}),Op=Object.freeze({chrome:"google-chrome --enable-dawn-featu\
res=vulkan_enable_f16_on_nvidia",chromium:"chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia",edge:"microsoft-\
edge --enable-dawn-features=vulkan_enable_f16_on_nvidia",brave:"brave-browser --enable-dawn-features=vulkan_enable_f16_o\
n_nvidia"}),SR="https://www.chromium.org/developers/how-tos/run-chromium-with-flags/",vR="https://github.com/google/dawn\
/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f";function on(r,e,t=""){return typeof r!="string"?t:r.slice(0,e).replace(
/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g," ").trim()||t}function zp(r,e){return typeof r=="string"&&Object.
hasOwn(e,r)?r:"other"}function Oy(r=globalThis.navigator){const e=r??{},t=on(e.userAgent,4096),n=on(e.userAgentData?.platform,
80)||on(e.platform,80),s=Array.isArray(e.userAgentData?.brands)?e.userAgentData.brands.slice(0,16).map(a=>on(a?.brand,80)).
join(" "):"";let i="other";/iPhone|iPad|iPod|\biOS\b/i.test(`${n} ${t}`)||/Mac/i.test(`${n} ${t}`)&&e.maxTouchPoints>1?i=
"ios":/Android/i.test(`${n} ${t}`)?i="android":/Windows|Win32|Win64/i.test(n)?i="windows":/macOS|Mac/i.test(n)?i="macos":
/Linux/i.test(n)?i="linux":/Windows/i.test(t)?i="windows":/Macintosh|Mac OS X/i.test(t)?i="macos":/Linux|X11/i.test(t)&&
(i="linux");let o="other";return/Brave/i.test(s)||/Brave\//i.test(t)||typeof e.brave?.isBrave=="function"?o="brave":/Microsoft Edge/i.
test(s)||/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(t)?o="edge":/Firefox/i.test(s)||/(?:Firefox|FxiOS)\//i.test(t)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.
test(t)?o="other":/Google Chrome/i.test(s)||/CriOS\//i.test(t)?o="chrome":/Chromium\//i.test(t)?o="chromium":/Chrome\//i.
test(t)?o="chrome":/Chromium/i.test(s)?o="chromium":/Safari\//i.test(t)&&/Version\//i.test(t)&&(o="safari"),{browser:o,os:i}}
function AR(r,{environment:e=Oy()}={}){const t=r?.localAvailability??{},n=on(t.code,100),s=zp(e?.browser,Up),i=zp(e?.os,
Fp),o={name:on(r?.name,180,"Selected model"),reason:on(t.reason,500,"Compatibility has not been fully verified."),environmentLabel:`${Up[s]}\
 on ${Fp[i]}`,paragraphs:[],steps:[],command:null,commandLabel:"",links:[],openConfig:!1};return t.status==="checking"||
n==="device_checking"?(o.paragraphs.push("The browser capability check is still running. This does not mean the model is\
 unsupported."),o.steps.push("Wait for the check to finish. If it remains pending, reload the page and check again.")):n===
"cpu_budget_exceeded"||n==="gpu_budget_exceeded"?(o.openConfig=!0,o.paragraphs.push("The model reservation exceeds a con\
figured memory budget. This budget is an admission limit, not a measurement of free RAM or GPU memory."),o.steps.push("O\
pen Config and review the RAM and GPU memory budgets. Raise or clear an optional limit only when appropriate for your de\
vice.","A shared compute pool may impose its own limit. Choose a smaller model or a peer-hosted model if that limit stil\
l applies.")):n==="gpu_feature_unavailable"&&/\bshader-f16\b/i.test(o.reason)?(o.paragraphs.push("This browser does not \
expose the shader-f16 feature required by this model runtime. GPU memory capacity alone does not establish FP16 support."),
i==="linux"&&Object.hasOwn(Op,s)?(o.command=Op[s],o.commandLabel="Optional Linux NVIDIA / Vulkan launch command",o.paragraphs.
push("If this Linux machine uses an NVIDIA GPU with the Chromium Vulkan backend, the optional command below may expose F\
P16. It is specific to that backend and driver combination.","This switch overrides a driver-related restriction. Older \
drivers may produce incorrect results or instability; exposing the feature does not guarantee correct execution."),o.steps.
push("Try the launch command below first. Save your work and fully exit this browser, including background processes, th\
en run the command using your usual browser profile; do not clear site data or create a temporary profile.",`Open ${s===
"edge"?"edge":"chrome"}://version and confirm the Command Line includes --enable-dawn-features=vulkan_enable_f16_on_nvid\
ia. Then return to the original PeerCompute site address so its stored models remain available.`,"If the feature is stil\
l missing, update the browser and supported graphics driver, then check this model again.","If results are unstable, ful\
ly exit and launch normally without the switch. Choose an available model or a peer-hosted model.")):(o.paragraphs.push(
"There is no verified launch command here for this browser and operating system. Browser and driver support can vary."),
o.steps.push("Update the browser and supported graphics driver, then check this model again.","Use a current compatible \
browser that exposes the required feature, or choose an available model or a peer-hosted model.")),o.links.push({label:"\
Chromium command-line instructions",url:SR},{label:"Dawn NVIDIA FP16 driver restriction",url:vR})):n==="gpu_feature_unav\
ailable"?(o.paragraphs.push("The browser lacks a GPU feature required by this model. Support depends on the browser, GPU\
 and driver."),o.steps.push("Update the browser and graphics driver, then recheck. Use an available model or a peer-host\
ed model if the feature remains unavailable.")):n==="webgpu_unavailable"?(o.paragraphs.push("The browser did not provide\
 a supported hardware WebGPU adapter. This check does not measure the GPU’s memory capacity."),o.steps.push("Use the H\
TTPS site in an up-to-date WebGPU-capable browser. Check hardware acceleration and supported graphics drivers.","Restart\
 the browser and retry, or use a peer-hosted model.")):n==="gguf_crossOriginIsolated_unavailable"||n==="gguf_sharedArray\
Buffer_unavailable"?(o.paragraphs.push("This GGUF runtime needs cross-origin isolation and SharedArrayBuffer. HTTPS alon\
e does not enable isolation."),o.steps.push("Use the deployed HTTPS site. The site owner must send Cross-Origin-Opener-P\
olicy: same-origin and Cross-Origin-Embedder-Policy: require-corp, with compatible headers on required resources.","Relo\
ad after the hosting configuration is corrected. Otherwise choose an available model or a peer-hosted model; do not disa\
ble browser security.")):n==="gguf_jspi_unavailable"||n==="gguf_memory64_unavailable"?(o.paragraphs.push("This GGUF runt\
ime needs WebAssembly JSPI and shared memory64 support. The required capability was not detected in this browser."),o.steps.
push("Update to a browser version that supports these runtime prerequisites and recheck.","If support is still missing, \
choose an available ONNX model or a peer-hosted model.")):["runtime_unsupported","catalog_unsupported","model_invalid","\
package_too_large","file_too_large"].includes(n)?(o.paragraphs.push("The package or its runtime does not meet this appli\
cation’s supported model layout or loader limits. A browser launch switch will not fix that mismatch."),o.steps.push("\
Choose an approved model package supported by the local runtime, or select a compatible peer-hosted model.")):n==="devic\
e_probe_unknown"?(o.paragraphs.push("The capability check did not finish or could not verify all prerequisites. This is \
not confirmation that the device is unsupported."),o.steps.push("Retry the check by reloading the page. Keep the browser\
 up to date, or choose a peer-hosted model.")):n==="model_metadata_unverified"?(o.paragraphs.push("The advertised model \
still needs its package metadata verified before local loading. Its name alone does not establish compatibility."),o.steps.
push("Inspect the model package and allow its manifest to be verified before downloading weights.")):(o.paragraphs.push(
n==="memory_fit_unverified"?"Required browser features are supported, but free physical RAM and GPU memory are not relia\
bly available to this check. A successful check does not guarantee that the model will fit.":"Compatibility depends on t\
he model runtime, browser features and available memory. This check cannot guarantee successful loading."),o.steps.push(
"Choose a smaller available model or a peer-hosted model if local loading fails.")),o}const _R=new Set(["image/png","ima\
ge/jpeg","image/webp","image/gif"]);async function IR(r,{signal:e}={}){if(!r||!_R.has(r.type))throw new Error("Choose a \
PNG, JPEG, WebP or GIF image");if(r.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");e?.throwIfAborted();
const t=await createImageBitmap(r);try{if(e?.throwIfAborted(),!t.width||!t.height||t.width*t.height>32*1024**2)throw new Error(
"Choose an image smaller than 32 megapixels");const n=Math.min(1,512/Math.max(t.width,t.height)),s=document.createElement(
"canvas");s.width=Math.max(1,Math.round(t.width*n)),s.height=Math.max(1,Math.round(t.height*n));const i=s.getContext("2d",
{willReadFrequently:!0});if(!i)throw new Error("Image decoding is unavailable");i.drawImage(t,0,0,s.width,s.height);const o=i.
getImageData(0,0,s.width,s.height),a=document.createElement("canvas"),c=Math.min(1,96/Math.max(s.width,s.height));return a.
width=Math.max(1,Math.round(s.width*c)),a.height=Math.max(1,Math.round(s.height*c)),a.getContext("2d").drawImage(s,0,0,a.
width,a.height),{name:r.name.slice(0,160),preview:a.toDataURL("image/webp",.8),image:{data:new Uint8Array(o.data),width:s.
width,height:s.height,channels:4}}}finally{t.close()}}const qp=1024*1024,CR=6,TR=24*1024*1024,jp=r=>{if(r?.aborted)throw new DOMException(
"Image generation cancelled","AbortError")};function MR(r){const e=new Map;let t=0,n=!1;function s(o,{expired:a=!1}={}){
const c=e.get(o);if(c)if(URL.revokeObjectURL(c.url),t-=c.bytes,e.delete(o),a&&r.contains(o)){const l=document.createElement(
"p");l.className="pc-inference-note",l.textContent="Earlier image preview released.",o.replaceWith(l)}else o.removeAttribute(
"src")}function i(){for(const o of e.keys())r.contains(o)||s(o);for(;e.size>CR||t>TR;)s(e.keys().next().value,{expired:!0})}
return{async append(o,a,{signal:c,prompt:l=""}={}){if(jp(c),n)throw new Error("Conversation image renderer is closed");const{
width:u,height:d,channels:h,data:p}=a??{};if(!Number.isSafeInteger(u)||!Number.isSafeInteger(d)||u<1||d<1||u*d>qp||h!==4||
!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||p.byteLength!==u*d*4)throw new Error("Generated image must c\
ontain bounded RGBA pixels");const g=new OffscreenCanvas(u,d),y=g.getContext("2d");if(!y)throw new Error("Image preview \
encoding is unavailable");y.putImageData(new ImageData(new Uint8ClampedArray(p),u,d),0,0);const m=await g.convertToBlob(
{type:"image/png"});if(jp(c),n||!r.contains(o))throw new DOMException("Conversation closed","AbortError");if(m.type!=="i\
mage/png"||m.size>qp*4+65536)throw new Error("Generated image preview exceeds its byte budget");const f=document.createElement(
"img");f.className="pc-generated-image",f.width=u,f.height=d,f.alt=l?`Generated image: ${l.slice(0,160)}`:"Generated ima\
ge";const b=URL.createObjectURL(m);return f.src=b,e.set(f,{url:b,bytes:m.size}),t+=m.size,o.after(f),i(),f},prune:i,dispose(){
n=!0;for(const o of e.keys())s(o)}}}async function RR({container:r=document.body,stateManager:e,computeManager:t,networkManager:n,
getContext:s,actions:i,runtimeBaseUrl:o,onClose:a,autoConnect:c=!1,runtimeFactory:l=yR,refreshIntervalMs:u=5e3}={}){const d=kR(
r),h=MR(d.transcript),p=new TextEncoder,g=new Map,y=new Set;let m,f,b,w,k,x,A=!1,S=!1,E=!1,_,I,M,T,$,D,U,Q,H=!1,V,te=[],
ie=[],we,it,le=0,ot,vt,jt,ar;const Z=()=>!S&&!E,Ee=R=>["checking","unavailable"].includes(R?.localAvailability?.status),
Gt=R=>R.source==="hf"?"Hugging Face":R.source==="stored"?"Stored on this device":"Peers",nn=R=>String(R?.localAvailability?.
reason||(R?.localAvailability?.status==="checking"?"Checking this device…":"Unavailable on this device.")).slice(0,512),
At=R=>{const P=q=>Number.isFinite(q)&&q>0&&q<=1099511627776?`${Number((q/1073741824).toFixed(1))} GiB`:"unknown";return`\
est. RAM ${P(R?.localAvailability?.cpuBytes)} / GPU ${P(R?.localAvailability?.gpuBytes)}`},_t=()=>ie.find(R=>R.key===d.target.
value),at=()=>{i?.invalidate?.(),d.proposed.replaceChildren()},ut=R=>{if(!Z())return;const P=(R.name==="AbortError"?"Can\
celled: ":"Error: ")+R.message+(/context budget/i.test(R.message)?". Use Config → Clear conversation to start again, or \
shorten the prompt.":"");d.status.textContent=P,d.configuration.open&&(d.configurationStatus.textContent=P),d.storedModels.
open&&(d.storedStatus.textContent=P)},$t=()=>{for(;d.transcript.children.length>24||p.encode(d.transcript.textContent).byteLength>
128*1024;)d.transcript.firstElementChild?.remove();h.prune(),d.transcript.scrollTop=d.transcript.scrollHeight};function xe(){
const R=_t(),P=te.find(q=>q.key===d.source.value);d.prompt.placeholder=R?.task==="text-to-image"?"Describe an image…":
"Message…",d.acquire.disabled=!!f||!P||Ee(P),d.source.disabled=!!f,d.sourceFilter.disabled=!!f,d.sourceHelp.disabled=!!f,
d.cpuBudget.disabled=d.gpuBudget.disabled=!!f||!m?.setMemoryBudgets,d.send.disabled=!!f||A||!R?.available||!d.prompt.value.
trim()&&!k,d.cancel.hidden=!f,d.target.disabled=!!f,d.attach.disabled=!!f||!R?.modalities?.includes("image"),d.unload.disabled=
!!f,d.clearChat.disabled=!!f,d.storedRefresh.disabled=!!f||!!Q;for(const q of d.storedList.querySelectorAll("button"))q.
disabled=!!f||!!Q||q.dataset.inactive==="true";d.storedCancel.hidden=!f||!H}function dt(){const R=d.source.value,P=d.sourceFilter.
value.trim().toLowerCase().split(/\s+/).filter(Boolean),q=Fy(te).filter(N=>{const X=[N.name,N.modelId,N.task,N.runtime,N.
source,Gt(N),N.source==="stored"?"local":"",N.task==="text-to-image"?"Image generation":""].join(" ").toLowerCase();return P.
every(ht=>X.includes(ht))});we||(we=m.getPreferredModelSourceKey?.()??te.find(N=>N.modelId==="smolvlm-256m-q4"&&N.source===
"hf")?.key??te.find(N=>!Ee(N))?.key??te[0]?.key),d.source.replaceChildren();for(const N of q){const X=document.createElement(
"option");X.value=N.key,X.textContent=String(N.name).slice(0,140)+(N.task==="text-to-image"?" · Image generation":"")+"\
 · "+Gt(N)+" · "+zs(N.totalBytes)+" package · "+At(N)+(Ee(N)?" · Setup required — select for help":""),X.dataset.unavailable=
String(Ee(N)),d.source.append(X)}if(q.length){const N=q.find(X=>X.key===we)??q.find(X=>X.key===R)??q.find(X=>!Ee(X))??q[0];
if(Ee(N)&&!(m.getPreferredModelSourceKey&&N.key===we)){const X=document.createElement("option");X.value="",X.disabled=!0,
X.textContent="Choose a model — select unavailable models for help",d.source.prepend(X),d.source.value=""}else d.source.
value=N.key}else{const N=document.createElement("option");N.value="",N.disabled=!0,N.textContent="No matching models",d.
source.append(N),d.source.value=""}B(q),xe()}function It(){it&&(le++,ER(d,AR(it,{environment:{browser:d.helpBrowser.value,
os:d.helpOs.value}})))}function C(R){if(!Z()||f)return;it=R;const P=Oy();d.helpBrowser.value=P.browser,d.helpOs.value=P.
os,It(),d.configuration.close(),d.storedModels.close(),d.about.close(),d.compatibility.open||d.compatibility.showModal()}
function B(R){const P=te.find(X=>X.key===d.source.value),q=R.filter(Ee),N=P?[At(P)+". Planning estimates; actual memory \
use varies."]:[];if(R.length?P?.localAvailability?.reason&&!Ee(P)&&N.push(String(P.localAvailability.reason).slice(0,512)):
N.push("No matching models. Clear or change the filter."),q.length){const X=new Map;for(const ht of q){const Ct=nn(ht),Vt=X.
get(Ct)??[];Vt.push(String(ht.name).slice(0,140)),X.set(Ct,Vt)}N.push([...X].map(([ht,Ct])=>`${Ct.join(", ")}: ${ht}`).join(
" "))}d.sourceStatus.textContent=N.join(" "),d.sourceStatus.hidden=!N.length,d.sourceHelp.hidden=!P||!Ee(P)}function L(){
const R=d.target.value||"local",P=ie.find(N=>N.key===R),q=d.target.selectedOptions[0]?.textContent;te=m.listModelSources(),
ie=m.listInferenceTargets(),dt(),d.target.replaceChildren();for(const N of ie){const X=document.createElement("option");
X.value=N.key,X.textContent=(N.local?"Local · ":"Peers · ")+String(N.name).slice(0,140)+(N.task==="text-to-image"?" · \
Image generation":"")+(N.busy?" (busy)":N.available?"":" (unavailable)"),d.target.append(X)}if(!ie.some(N=>N.key===R)&&R!==
"local"&&q){const N=document.createElement("option");N.value=R,N.disabled=!0,N.textContent=(P?.name??q.replace(/ \(unavailable\)$/,
""))+" (unavailable)",d.target.append(N)}d.target.value=R,!d.target.value&&ie.some(N=>N.key==="local")&&(d.target.value=
"local"),xe()}function W(R){if(!m)return;const P=m.getDiscoveryStatus?.(),q=P?.connected??m.networkReady;q&&(D=null);const X=[
q?`Peer network connected${Number.isSafeInteger(P?.peerCount)?` · ${P.peerCount} peers`:""} · ${P?.sharedModelCount??te.
filter(Vt=>Vt.source==="peers").length} shared models · ${P?.hostedModelCount??ie.filter(Vt=>!Vt.local&&Vt.available).length}\
 hosted models.`:T&&!T.signal.aborted?"Connecting to peer network…":"Peer network is offline."],ht=R?.message??D?.message??
P?.errors?.[0]?.message;ht?X.push("Discovery issue: "+String(ht).slice(0,256)):q&&P?.peerCount===0?X.push("Waiting for o\
ther peers."):q&&P?.hostedModelCount===0&&X.push("No peer is currently advertising a loaded model for inference.");const Ct=m.
getArtifactNetworkStatus?.();Ct?.status==="starting"&&X.push("File sharing is preparing stored models. Inference discove\
ry remains available."),Ct?.status==="error"&&X.push("File sharing unavailable: "+String(Ct.error??"Initialization faile\
d").slice(0,256)),d.discoveryStatus.textContent=d.networkStatus.textContent=X.join(" ")}function j(){const R=m.getMemoryBudgets?.()??
{};d.cpuBudget.value=R.cpuBytes==null?"":String(R.cpuBytes/1024**3),d.gpuBudget.value=R.gpuBytes==null?"":String(R.gpuBytes/
1024**3);const P=m.getDeviceCapabilities?.()?.deviceMemoryGiB;d.memoryNote.textContent=(Number.isFinite(P)&&P>0?`Browser\
-reported RAM: approximately ${P} GiB. `:"")+"Optional estimates for future model loads. Leave blank for automatic check\
s. Your browser cannot report free GPU memory. Storage and loaded models are unchanged."}function K(){if(!(!Z()||f||!m.setMemoryBudgets))
try{const R=[d.cpuBudget,d.gpuBudget].map(P=>{P.setCustomValidity(""),P.removeAttribute("aria-invalid");const q=P.value.
trim(),N=q?Math.round(Number(q)*1024**3):null;if(P.validity.badInput||q&&(!Number.isFinite(Number(q))||Number(q)<=0||Number(
q)>1024||!Number.isSafeInteger(N)||N<1)){const X="Enter a memory budget above 0 and at most 1024 GiB, or leave it blank.";
throw P.setCustomValidity(X),P.setAttribute("aria-invalid","true"),new Error(X)}return N});m.setMemoryBudgets({cpuBytes:R[0],
gpuBytes:R[1]}),j(),te=m.listModelSources(),dt(),d.configurationStatus.textContent="Memory budgets updated for future im\
ports."}catch(R){ut(R)}}async function ge(){if(!Z()||I)return I;const R=new AbortController;return M=R,I=(async()=>{try{
await m.refreshPeers({signal:R.signal}),Z()&&(CSS.supports("selector(:open)")&&(d.source.matches(":open")||d.target.matches(
":open"))||L(),W())}catch(P){Z()&&!R.signal.aborted&&W(P)}finally{I=null,M=null}})(),I}const ke=R=>{if(!Z())return;let P;
if(R.stage==="import"?(P="Downloading "+(R.index+1)+"/"+R.total+": "+R.path,Number.isSafeInteger(R.loaded)&&Number.isSafeInteger(
R.totalBytes)&&R.loaded>=0&&R.totalBytes>0&&(P+=` · ${zs(R.loaded)} / ${zs(R.totalBytes)}`)):R.type==="model-load"?P="L\
oading model: "+(R.stage||R.status||"initializing GPU")+(R.file?" · "+R.file:""):P={prepare:"Preparing model import…",
verify:"Verifying stored model files…","download-peers":"Fetching and verifying model files from peers…",unload:"Rel\
easing the previous model…",load:"Loading model into RAM and GPU memory…"}[R.stage],!P)return;const q=`${R.type??""}\
:${R.stage??R.status??""}:${R.path??R.file??""}`;q!==jt&&(jt=q,ar=performance.now()),vt=String(P).slice(0,512),d.status.
textContent=vt,H&&d.storedModels.open&&(d.storedStatus.textContent=vt),ot||(ot=setInterval(()=>{Z()&&f&&!f.signal.aborted&&
(d.status.textContent=`${vt} (${Math.floor((performance.now()-ar)/1e3)}s)`,H&&d.storedModels.open&&(d.storedStatus.textContent=
d.status.textContent))},1e3))};async function De(R){if(!Z()||f)return;const P=new AbortController;f=P,xe(),b=(async()=>{
try{await R(P.signal)}catch(q){ut(q)}finally{clearInterval(ot),ot=null,jt=null,f===P&&(f=null),Z()&&(L(),$t())}})(),await b}
async function Ge(){if(!Z()||U)return U;const R=new AbortController;return Q=R,d.storedStatus.textContent="Reading store\
d models…",xe(),U=(async()=>{try{const P=await m.listStoredModels({signal:R.signal});return Z()&&(xR(d,P,sn,m.loadStoredModel?
Nt:void 0),d.storedStatus.textContent=`${P.length} model${P.length===1?"":"s"} stored.`),!0}catch(P){return ut(P),!1}finally{
U=null,Q=null,Z()&&xe()}})(),U}function sn(R){return De(async P=>{d.storedStatus.textContent=`Deleting ${R.name}…`;let q;
try{q=await m.deleteStoredModel(R.manifestCid,{signal:P})}catch(N){throw await Ge(),N}if(q.unloaded&&(g.delete("local"),
at()),await Ge()){const N=q.deleted?`Deleted ${R.name}.`:"This model is no longer stored.";d.storedStatus.textContent=N+
(q.freedBytes>0?` Freed ${zs(q.freedBytes)}.`:""),d.status.textContent=N}})}async function Nt(R){if(!Z()||f||Q||R.loaded||
R.cleanupPending)return;if(Ee(R)){C(R);return}H=!0;let P=!1;try{await De(async q=>{at(),ke({stage:"verify"});try{await m.
loadStoredModel(R.manifestCid,{signal:q,onProgress:N=>{q.aborted||ke(N)},ggufGpuLayers:Number(d.gpuLayers.value)})}catch(N){
throw await Ge(),N}q.throwIfAborted(),g.delete("local"),we=m.getPreferredModelSourceKey?.()??we,L(),d.target.value="loca\
l",await Ge(),d.status.textContent=d.storedStatus.textContent=`Loaded ${R.name}. Send a message.`,P=!0})}finally{H=!1,Z()&&
(xe(),P&&(d.storedModels.close(),d.prompt.focus()))}}function ms(){k=null,d.attachment.hidden=!0,d.attachmentImage.removeAttribute(
"src"),d.imageFile.value="",xe()}try{m=await l({stateManager:e,computeManager:t,networkManager:n,runtimeBaseUrl:o});const R=m.
getPreferences();d.sharing.checked=R.sharing,d.hosting.checked=R.hostInference,j(),L(),d.status.textContent="Ready."}catch(R){
throw d.panel.remove(),R}d.configure.onclick=()=>{Z()&&(d.about.close(),d.compatibility.close(),d.storedModels.close(),d.
configurationStatus.textContent="",d.configuration.showModal())},d.stored.onclick=()=>{Z()&&(d.about.close(),d.compatibility.
close(),d.configuration.close(),d.storedModels.showModal(),Ge())},d.menu.onclick=()=>{Z()&&(d.compatibility.close(),d.configuration.
close(),d.storedModels.close(),d.about.showModal())},d.storedRefresh.onclick=()=>{Ge()},d.sourceFilter.oninput=dt,d.sourceHelp.
onclick=()=>{const R=te.find(P=>P.key===d.source.value);R&&Ee(R)&&C(R)},d.source.onchange=()=>{if(!Z()||f)return;const R=d.
source.value;te=m.listModelSources();const P=te.find(q=>q.key===R);P&&Ee(P)?(dt(),C(P)):(we=R,dt())},d.helpBrowser.onchange=
d.helpOs.onchange=It,d.helpConfig.onclick=()=>d.configure.click(),d.compatibility.addEventListener("close",()=>{le++,Z()&&
!d.configuration.open&&!d.storedModels.open&&!d.about.open&&d.source.focus()}),d.helpCopy.onclick=async()=>{const R=d.helpCommand.
value;if(!R||!Z())return;const P=++le,q=()=>Z()&&d.compatibility.open&&le===P;try{await navigator.clipboard.writeText(R),
q()&&(d.helpStatus.textContent="Command copied.")}catch{q()&&(d.helpCommand.focus(),d.helpCommand.select(),d.helpStatus.
textContent="Clipboard unavailable. Select and copy the command above.")}},d.cpuBudget.onchange=d.gpuBudget.onchange=K,d.
target.onchange=()=>{at(),xe()},d.prompt.oninput=xe;for(const[R,P]of[[d.sharing,"setSharing"],[d.hosting,"setHostInferen\
ce"]])R.onchange=()=>{if(!Z())return;const q=R.checked;R.disabled=!0;const N=(async()=>{try{await m[P](q),Z()&&(d.configurationStatus.
textContent="Preferences updated.")}catch(X){R.checked=!q,ut(X)}finally{Z()&&(R.disabled=!1)}})();y.add(N),N.finally(()=>y.
delete(N))};d.acquire.onclick=()=>{if(!Z()||f)return;const R=d.source.value;te=m.listModelSources();const P=te.find(q=>q.
key===R);if(!P||Ee(P)){dt(),P&&C(P);return}return De(async q=>{at(),ke({stage:"prepare"}),await m.acquireModel(R,{signal:q,
onProgress:N=>{q.aborted||ke(N)},ggufGpuLayers:Number(d.gpuLayers.value)}),g.delete("local"),L(),d.target.value="local",
xe(),d.status.textContent=m.getSharingErrors?.().length?"Model ready. Sharing is unavailable for some stored models; see\
 Stored Models.":"Model ready. Send a message."})},d.unload.onclick=()=>De(async()=>{at(),await m.unload(),g.delete("loc\
al"),d.status.textContent="Local model unloaded.",d.configurationStatus.textContent=d.status.textContent}),d.clearChat.onclick=
()=>{!Z()||f||(g.clear(),at(),d.transcript.replaceChildren(d.empty),h.prune(),d.status.textContent=d.configurationStatus.
textContent="Conversation cleared. Ready for a new message.")},d.connect.onclick=()=>De(async R=>{d.relay.value.trim()?await m.
connect(d.relay.value.trim(),{signal:R}):await m.connectBackend({signal:R}),await ge()}),d.file.onchange=()=>De(async R=>{
const P=d.file.files[0];P&&(await m.store.importFile(P.stream(),{expectedSize:P.size,pin:!0,signal:R}),d.status.textContent=
"Pinned "+P.name+" locally.",d.file.value="")}),d.attach.onclick=()=>d.imageFile.click(),d.imageFile.onchange=async()=>{
x?.abort();const R=new AbortController;x=R;const P=d.imageFile.files[0];if(P){A=!0,xe();try{const q=await IR(P,{signal:R.
signal});if(!Z()||R.signal.aborted)return;k=q,d.attachmentImage.src=q.preview,d.attachmentName.textContent=q.name,d.attachment.
hidden=!1,xe(),d.prompt.focus()}catch(q){R.signal.aborted||ut(q)}finally{x===R&&(A=!1,Z()&&xe())}}},d.removeAttachment.onclick=
()=>{x?.abort(),ms()},d.cancel.onclick=()=>{f?.abort("User cancelled"),w&&m.cancel(w).catch(ut)},d.storedCancel.onclick=
()=>d.cancel.click();async function Pe(){d.send.disabled||await De(async R=>{const P=_t(),q=P.key,N=P.task==="text-to-im\
age",X=d.prompt.value.trim(),ht=k;if(ht&&!P.modalities?.includes("image"))throw new Error("This model accepts text only.\
 Remove the image or choose an image model.");at();const Ct=N?null:await s?.({includeImage:!1}),Vt=(typeof Ct=="string"?
Ct:Ct?.text??"").slice(0,16e3),Bd=N?"":String(i?.instructions??"").slice(0,8e3),_n=g.get(q)??[],Ld=X||"Describe this ima\
ge.",zy=N?void 0:[...Vt||Bd?[{role:"system",content:Vt+`
`+Bd}]:[],..._n.slice(-6),{role:"user",content:Ld}];Np(d,"user",X,{image:ht?.preview});const In=Np(d,"assistant","",{targetName:P.
name});d.prompt.value="",ms(),$t(),w=crypto.randomUUID(),d.status.textContent=P.local?N?"Generating image…":"Generatin\
g…":"Waiting for peer…";try{const Ut=await m.generate(q,{requestId:w,signal:R,...N?{prompt:X}:{messages:zy,image:ht?.
image,maxNewTokens:1024},onProgress(Se){Z()&&N&&Number.isSafeInteger(Se.step)&&Number.isSafeInteger(Se.steps)&&Se.step>=
0&&Se.step<=Se.steps&&Se.steps<=100&&(d.status.textContent=`Generating image: ${Se.step}/${Se.steps} steps…`)},onToken(Se){
Z()&&!N&&(In.textContent+=Se,$t())}});if(R.aborted)throw new DOMException("Generation cancelled","AbortError");if(N){if(!P.
outputModalities?.includes("image"))throw new Error("This target did not advertise image output");await h.append(In,Ut.image,
{signal:R,prompt:X})}else{if(typeof Ut.text!="string")throw new Error("Model returned an invalid text response");for(In.
textContent=Ut.text,_n.push({role:"user",content:Ld},{role:"assistant",content:Ut.text});_n.length>6||p.encode(JSON.stringify(
_n)).byteLength>24*1024;)_n.splice(0,2);g.delete(q),g.set(q,_n),g.size>8&&g.delete(g.keys().next().value)}if(d.status.textContent=
"Ready.",!N){const Se=[];if(Ut.finishReason==="length"?Se.push("Response reached the model’s output or context limit and\
 may be incomplete."):Ut.finishReason!=="stop"&&Se.push("The model did not report whether this response is complete."),Ut.
contextTruncated&&Se.push("Older conversation turns were omitted to fit the model’s context."),Se.length){const cr=document.
createElement("p");cr.className="pc-inference-note",cr.textContent=Se.join(" "),In.after(cr),d.status.textContent=Se.join(
" ")}}try{for(const Se of(N?[]:i?.propose(Ut.text)??[]).slice(0,4)){const cr=document.createElement("button");cr.type="b\
utton",cr.textContent="Apply: "+Se.label,cr.onclick=async()=>{cr.disabled=!0;try{await Se.apply()}catch(qy){ut(qy)}},d.proposed.
append(cr)}}catch{}}catch(Ut){throw In.textContent||(In.textContent=Ut.name==="AbortError"?"Cancelled.":"Request failed."),
Ut}finally{w=null,$t()}})}if(d.send.onclick=()=>{Pe()},d.prompt.onkeydown=R=>{R.key==="Enter"&&!R.shiftKey&&!R.isComposing&&
(R.preventDefault(),Pe())},V=setInterval(()=>{ge()},Math.max(20,u)),c&&!m.networkReady){const R=new AbortController;T=R,
$=m.connectBackend({signal:R.signal}).then(()=>ge()).catch(P=>{Z()&&!R.signal.aborted&&(D=P)}).finally(()=>{T===R&&(T=null),
Z()&&W()})}else ge();async function Wt(){if(clearInterval(ot),ot=null,!S){if(_)return _;E=!0,h.dispose(),d.compatibility.
close(),d.storedModels.close(),d.configuration.close(),d.about.close(),d.panel.inert=!0,_=(async()=>{clearInterval(V),f?.
abort("Chat closed"),x?.abort(),M?.abort(),T?.abort(),Q?.abort(),at(),await b,await I,await $,await U,await Promise.allSettled(
[...y]),await m.dispose(),S=!0,g.clear(),k=null,d.panel.remove(),a?.()})();try{await _}finally{_=null}}}return{element:d.
panel,runtime:m,dispose:Wt,refreshPeers:ge}}async function BR(){try{window.inferencePanel=await RR({container:document.querySelector(
"#panel"),autoConnect:!0})}catch(r){const e=document.createElement("p");e.textContent=r.message,document.querySelector("\
#panel").append(e)}}BR();const C7=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));export{s3 as $,zB as A,xp as B,f7 as C,e7 as D,t7 as E,t3 as F,_A as G,ZB as H,bM as I,x3 as J,pt as K,v3 as L,KB as M,XB as N,
sr as O,Xg as P,m7 as Q,p7 as R,JB as S,c7 as T,Jr as U,i7 as V,a7 as W,YB as X,VB as Y,HM as Z,p3 as _,pa as a,n7 as a0,
Ly as a1,r7 as a2,u7 as a3,h7 as a4,d7 as a5,qB as a6,HB as a7,y7 as a8,l7 as a9,aM as aA,IA as aB,wg as aC,vi as aD,yB as aE,
yb as aF,l3 as aG,aR as aH,qR as aI,Vn as aJ,Eh as aK,Ne as aL,E7 as aM,x7 as aN,S7 as aO,I7 as aP,v7 as aQ,Ny as aR,_7 as aS,
A7 as aT,iR as aU,C7 as aV,jB as aa,s7 as ab,w7 as ac,Gb as ad,YT as ae,XT as af,Os as ag,Zn as ah,Xe as ai,de as aj,Ya as ak,
Rd as al,k7 as am,lu as an,Va as ao,Ka as ap,Qa as aq,fa as ar,JM as as,sl as at,UB as au,$B as av,PB as aw,Pt as ax,n3 as ay,
WB as az,Nr as b,By as c,qb as d,gM as e,QB as f,yM as g,b7 as h,g7 as i,FM as j,Xa as k,zM as l,TT as m,Bi as n,Ep as o,
Lt as p,DB as q,jb as r,NB as s,FB as t,_T as u,OB as v,GB as w,HT as x,LB as y,bn as z};
