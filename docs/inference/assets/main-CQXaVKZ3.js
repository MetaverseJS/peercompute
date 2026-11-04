const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-Dji7F6gM.js","./GgufArtifactReader-CCiqtVnt.js","./runtimeDefinition-DM2y_sju.js","./index-DnjtRXOS.js","./modelTask-DYMYSz5j.js","./runtimeDefinition-JV4DRtJ7.js","./ModelInferenceService-w6hAVBk6.js","./NetworkManager-BzVEnr0X.js"])))=>i.map(i=>d[i]);
import{_ as mt}from"./index-DnjtRXOS.js";const $t=()=>new Map,el=r=>{const e=$t();return r.forEach((t,n)=>{e.set(n,t)}),
e},Xr=(r,e,t)=>{let n=r.get(e);return n===void 0&&r.set(e,n=t()),n},Dy=(r,e)=>{const t=[];for(const[n,s]of r)t.push(e(s,
n));return t},Py=(r,e)=>{for(const[t,n]of r)if(e(n,t))return!0;return!1},On=()=>new Set,Ga=r=>r[r.length-1],$y=(r,e)=>{for(let t=0;t<
e.length;t++)r.push(e[t])},Vr=Array.from,iu=(r,e)=>{for(let t=0;t<r.length;t++)if(!e(r[t],t,r))return!1;return!0},$p=(r,e)=>{
for(let t=0;t<r.length;t++)if(e(r[t],t,r))return!0;return!1},Ny=(r,e)=>{const t=new Array(r);for(let n=0;n<r;n++)t[n]=e(
n,t);return t},aa=Array.isArray;class ou{constructor(){this._observers=$t()}on(e,t){Xr(this._observers,e,On).add(t)}once(e,t){
const n=(...s)=>{this.off(e,n),t(...s)};this.on(e,n)}off(e,t){const n=this._observers.get(e);n!==void 0&&(n.delete(t),n.
size===0&&this._observers.delete(e))}emit(e,t){return Vr((this._observers.get(e)||$t()).values()).forEach(n=>n(...t))}destroy(){
this._observers=$t()}}const Ht=Math.floor,Hi=Math.abs,Np=(r,e)=>r<e?r:e,dn=(r,e)=>r>e?r:e,Up=r=>r!==0?r<0:1/r<0,Id=1,Cd=2,
Wa=4,Va=8,Os=32,ur=64,gt=128,ca=31,tl=63,Zr=127,Uy=2147483647,po=Number.MAX_SAFE_INTEGER,Td=Number.MIN_SAFE_INTEGER,Fy=Number.
isInteger||(r=>typeof r=="number"&&isFinite(r)&&Ht(r)===r),Oy=String.fromCharCode,zy=r=>r.toLowerCase(),qy=/^\s*/g,jy=r=>r.
replace(qy,""),Gy=/([A-Z])/g,Md=(r,e)=>jy(r.replace(Gy,t=>`${e}${zy(t)}`)),Wy=r=>{const e=unescape(encodeURIComponent(r)),
t=e.length,n=new Uint8Array(t);for(let s=0;s<t;s++)n[s]=e.codePointAt(s);return n},zs=typeof TextEncoder<"u"?new TextEncoder:
null,Vy=r=>zs.encode(r),Hy=zs?Vy:Wy;let Ls=typeof TextDecoder>"u"?null:new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});
Ls&&Ls.decode(new Uint8Array).length===1&&(Ls=null);const Ky=(r,e)=>Ny(e,()=>r).join("");let li=class{constructor(){this.
cpos=0,this.cbuf=new Uint8Array(100),this.bufs=[]}};const la=()=>new li,Qy=r=>{let e=r.cpos;for(let t=0;t<r.bufs.length;t++)
e+=r.bufs[t].length;return e},Vt=r=>{const e=new Uint8Array(Qy(r));let t=0;for(let n=0;n<r.bufs.length;n++){const s=r.bufs[n];
e.set(s,t),t+=s.length}return e.set(new Uint8Array(r.cbuf.buffer,0,r.cpos),t),e},Jy=(r,e)=>{const t=r.cbuf.length;t-r.cpos<
e&&(r.bufs.push(new Uint8Array(r.cbuf.buffer,0,r.cpos)),r.cbuf=new Uint8Array(dn(t,e)*2),r.cpos=0)},Ce=(r,e)=>{const t=r.
cbuf.length;r.cpos===t&&(r.bufs.push(r.cbuf),r.cbuf=new Uint8Array(t*2),r.cpos=0),r.cbuf[r.cpos++]=e},rl=Ce,te=(r,e)=>{for(;e>
Zr;)Ce(r,gt|Zr&e),e=Ht(e/128);Ce(r,Zr&e)},au=(r,e)=>{const t=Up(e);for(t&&(e=-e),Ce(r,(e>tl?gt:0)|(t?ur:0)|tl&e),e=Ht(e/
64);e>0;)Ce(r,(e>Zr?gt:0)|Zr&e),e=Ht(e/128)},nl=new Uint8Array(3e4),Xy=nl.length/3,Yy=(r,e)=>{if(e.length<Xy){const t=zs.
encodeInto(e,nl).written||0;te(r,t);for(let n=0;n<t;n++)Ce(r,nl[n])}else dt(r,Hy(e))},Zy=(r,e)=>{const t=unescape(encodeURIComponent(
e)),n=t.length;te(r,n);for(let s=0;s<n;s++)Ce(r,t.codePointAt(s))},Tn=zs&&zs.encodeInto?Yy:Zy,ua=(r,e)=>{const t=r.cbuf.
length,n=r.cpos,s=Np(t-n,e.length),i=e.length-s;r.cbuf.set(e.subarray(0,s),n),r.cpos+=s,i>0&&(r.bufs.push(r.cbuf),r.cbuf=
new Uint8Array(dn(t*2,i)),r.cbuf.set(e.subarray(s)),r.cpos=i)},dt=(r,e)=>{te(r,e.byteLength),ua(r,e)},cu=(r,e)=>{Jy(r,e);
const t=new DataView(r.cbuf.buffer,r.cpos,e);return r.cpos+=e,t},ew=(r,e)=>cu(r,4).setFloat32(0,e,!1),tw=(r,e)=>cu(r,8).
setFloat64(0,e,!1),rw=(r,e)=>cu(r,8).setBigInt64(0,e,!1),Rd=new DataView(new ArrayBuffer(4)),nw=r=>(Rd.setFloat32(0,r),Rd.
getFloat32(0)===r),qs=(r,e)=>{switch(typeof e){case"string":Ce(r,119),Tn(r,e);break;case"number":Fy(e)&&Hi(e)<=Uy?(Ce(r,
125),au(r,e)):nw(e)?(Ce(r,124),ew(r,e)):(Ce(r,123),tw(r,e));break;case"bigint":Ce(r,122),rw(r,e);break;case"object":if(e===
null)Ce(r,126);else if(aa(e)){Ce(r,117),te(r,e.length);for(let t=0;t<e.length;t++)qs(r,e[t])}else if(e instanceof Uint8Array)
Ce(r,116),dt(r,e);else{Ce(r,118);const t=Object.keys(e);te(r,t.length);for(let n=0;n<t.length;n++){const s=t[n];Tn(r,s),
qs(r,e[s])}}break;case"boolean":Ce(r,e?120:121);break;default:Ce(r,127)}};class Bd extends li{constructor(e){super(),this.
w=e,this.s=null,this.count=0}write(e){this.s===e?this.count++:(this.count>0&&te(this,this.count-1),this.count=1,this.w(this,
e),this.s=e)}}const Ld=r=>{r.count>0&&(au(r.encoder,r.count===1?r.s:-r.s),r.count>1&&te(r.encoder,r.count-2))};class Ki{constructor(){
this.encoder=new li,this.s=0,this.count=0}write(e){this.s===e?this.count++:(Ld(this),this.count=1,this.s=e)}toUint8Array(){
return Ld(this),Vt(this.encoder)}}const Dd=r=>{if(r.count>0){const e=r.diff*2+(r.count===1?0:1);au(r.encoder,e),r.count>
1&&te(r.encoder,r.count-2)}};class Ha{constructor(){this.encoder=new li,this.s=0,this.count=0,this.diff=0}write(e){this.
diff===e-this.s?(this.s=e,this.count++):(Dd(this),this.count=1,this.diff=e-this.s,this.s=e)}toUint8Array(){return Dd(this),
Vt(this.encoder)}}class sw{constructor(){this.sarr=[],this.s="",this.lensE=new Ki}write(e){this.s+=e,this.s.length>19&&(this.
sarr.push(this.s),this.s=""),this.lensE.write(e.length)}toUint8Array(){const e=new li;return this.sarr.push(this.s),this.
s="",Tn(e,this.sarr.join("")),ua(e,this.lensE.toUint8Array()),Vt(e)}}const fr=r=>new Error(r),Nt=()=>{throw fr("Method u\
nimplemented")},Ct=()=>{throw fr("Unexpected case")},Fp=fr("Unexpected end of array"),Op=fr("Integer out of Range");let da=class{constructor(e){
this.arr=e,this.pos=0}};const Qn=r=>new da(r),iw=r=>r.pos!==r.arr.length,ow=(r,e)=>{const t=new Uint8Array(r.arr.buffer,
r.pos+r.arr.byteOffset,e);return r.pos+=e,t},ht=r=>ow(r,Z(r)),zn=r=>r.arr[r.pos++],Z=r=>{let e=0,t=1;const n=r.arr.length;
for(;r.pos<n;){const s=r.arr[r.pos++];if(e=e+(s&Zr)*t,t*=128,s<gt)return e;if(e>po)throw Op}throw Fp},lu=r=>{let e=r.arr[r.
pos++],t=e&tl,n=64;const s=(e&ur)>0?-1:1;if((e&gt)===0)return s*t;const i=r.arr.length;for(;r.pos<i;){if(e=r.arr[r.pos++],
t=t+(e&Zr)*n,n*=128,e<gt)return s*t;if(t>po)throw Op}throw Fp},aw=r=>{let e=Z(r);if(e===0)return"";{let t=String.fromCodePoint(
zn(r));if(--e<100)for(;e--;)t+=String.fromCodePoint(zn(r));else for(;e>0;){const n=e<1e4?e:1e4,s=r.arr.subarray(r.pos,r.
pos+n);r.pos+=n,t+=String.fromCodePoint.apply(null,s),e-=n}return decodeURIComponent(escape(t))}},cw=r=>Ls.decode(ht(r)),
Mn=Ls?cw:aw,uu=(r,e)=>{const t=new DataView(r.arr.buffer,r.arr.byteOffset+r.pos,e);return r.pos+=e,t},lw=r=>uu(r,4).getFloat32(
0,!1),uw=r=>uu(r,8).getFloat64(0,!1),dw=r=>uu(r,8).getBigInt64(0,!1),hw=[r=>{},r=>null,lu,lw,uw,dw,r=>!1,r=>!0,Mn,r=>{const e=Z(
r),t={};for(let n=0;n<e;n++){const s=Mn(r);t[s]=js(r)}return t},r=>{const e=Z(r),t=[];for(let n=0;n<e;n++)t.push(js(r));
return t},ht],js=r=>hw[127-zn(r)](r);class Pd extends da{constructor(e,t){super(e),this.reader=t,this.s=null,this.count=
0}read(){return this.count===0&&(this.s=this.reader(this),iw(this)?this.count=Z(this)+1:this.count=-1),this.count--,this.
s}}class Qi extends da{constructor(e){super(e),this.s=0,this.count=0}read(){if(this.count===0){this.s=lu(this);const e=Up(
this.s);this.count=1,e&&(this.s=-this.s,this.count=Z(this)+2)}return this.count--,this.s}}class Ka extends da{constructor(e){
super(e),this.s=0,this.count=0,this.diff=0}read(){if(this.count===0){const e=lu(this),t=e&1;this.diff=Ht(e/2),this.count=
1,t&&(this.count=Z(this)+2)}return this.s+=this.diff,this.count--,this.s}}class fw{constructor(e){this.decoder=new Qi(e),
this.str=Mn(this.decoder),this.spos=0}read(){const e=this.spos+this.decoder.read(),t=this.str.slice(this.spos,e);return this.
spos=e,t}}const pw=crypto.getRandomValues.bind(crypto),zp=()=>pw(new Uint32Array(1))[0],mw="10000000-1000-4000-8000"+-1e11,
gw=()=>mw.replace(/[018]/g,r=>(r^zp()&15>>r/4).toString(16)),qn=r=>new Promise(r);Promise.all.bind(Promise);const $d=r=>r===
void 0?null:r;class bw{constructor(){this.map=new Map}setItem(e,t){this.map.set(e,t)}getItem(e){return this.map.get(e)}}
let qp=new bw,yw=!0;try{typeof localStorage<"u"&&localStorage&&(qp=localStorage,yw=!1)}catch{}const ww=qp,Gs=Symbol("Equ\
ality"),jp=(r,e)=>r===e||!!r?.[Gs]?.(e)||!1,kw=r=>typeof r=="object",Ew=Object.assign,xw=Object.keys,mo=r=>xw(r).length,
vw=r=>{for(const e in r)return!1;return!0},ui=(r,e)=>{for(const t in r)if(!e(r[t],t))return!1;return!0},du=(r,e)=>Object.
prototype.hasOwnProperty.call(r,e),Sw=(r,e)=>r===e||mo(r)===mo(e)&&ui(r,(t,n)=>(t!==void 0||du(e,n))&&jp(e[n],t)),hu=(r,e,t=0)=>{
try{for(;t<r.length;t++)r[t](...e)}finally{t<r.length&&hu(r,e,t+1)}},Ji=(r,e)=>{if(r===e)return!0;if(r==null||e==null||r.
constructor!==e.constructor&&(r.constructor||Object)!==(e.constructor||Object))return!1;if(r[Gs]!=null)return r[Gs](e);switch(r.
constructor){case ArrayBuffer:r=new Uint8Array(r),e=new Uint8Array(e);case Uint8Array:{if(r.byteLength!==e.byteLength)return!1;
for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;break}case Set:{if(r.size!==e.size)return!1;for(const t of r)if(!e.has(
t))return!1;break}case Map:{if(r.size!==e.size)return!1;for(const t of r.keys())if(!e.has(t)||!Ji(r.get(t),e.get(t)))return!1;
break}case void 0:case Object:if(mo(r)!==mo(e))return!1;for(const t in r)if(!du(r,t)||!Ji(r[t],e[t]))return!1;break;case Array:
if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(!Ji(r[t],e[t]))return!1;break;default:return!1}return!0},Aw=(r,e)=>e.
includes(r);var Gp={};const Ws=typeof process<"u"&&process.release&&/node|io\.js/.test(process.release.name)&&Object.prototype.
toString.call(typeof process<"u"?process:0)==="[object process]";let zt;const _w=()=>{if(zt===void 0)if(Ws){zt=$t();const r=process.
argv;let e=null;for(let t=0;t<r.length;t++){const n=r[t];n[0]==="-"?(e!==null&&zt.set(e,""),e=n):e!==null&&(zt.set(e,n),
e=null)}e!==null&&zt.set(e,"")}else typeof location=="object"?(zt=$t(),(location.search||"?").slice(1).split("&").forEach(
r=>{if(r.length!==0){const[e,t]=r.split("=");zt.set(`--${Md(e,"-")}`,t),zt.set(`-${Md(e,"-")}`,t)}})):zt=$t();return zt},
sl=r=>_w().has(r),il=r=>$d(Ws?Gp[r.toUpperCase().replaceAll("-","_")]:ww.getItem(r)),Wp=r=>sl("--"+r)||il(r)!==null,Iw=Wp(
"production"),Cw=Ws&&Aw(Gp.FORCE_COLOR,["true","1","2"]),Tw=Cw||!sl("--no-colors")&&!Wp("no-color")&&(!Ws||process.stdout.
isTTY)&&(!Ws||sl("--color")||il("COLORTERM")!==null||(il("TERM")||"").includes("color")),Mw=r=>new Uint8Array(r),Rw=r=>{
const e=Mw(r.byteLength);return e.set(r),e};class Bw{constructor(e,t){this.left=e,this.right=t}}const nr=(r,e)=>new Bw(r,
e),Nd=r=>r.next()>=.5,Qa=(r,e,t)=>Ht(r.next()*(t+1-e)+e),Vp=(r,e,t)=>Ht(r.next()*(t+1-e)+e),fu=(r,e,t)=>Vp(r,e,t),Lw=r=>Oy(
fu(r,97,122)),Dw=(r,e=0,t=20)=>{const n=fu(r,e,t);let s="";for(let i=0;i<n;i++)s+=Lw(r);return s},Ja=(r,e)=>e[fu(r,0,e.length-
1)],Pw=Symbol("0schema");class $w{constructor(){this._rerrs=[]}extend(e,t,n,s=null){this._rerrs.push({path:e,expected:t,
has:n,message:s})}toString(){const e=[];for(let t=this._rerrs.length-1;t>0;t--){const n=this._rerrs[t];e.push(Ky(" ",(this.
_rerrs.length-t)*2)+`${n.path!=null?`[${n.path}] `:""}${n.has} doesn't match ${n.expected}. ${n.message}`)}return e.join(
`
`)}}const ol=(r,e)=>r===e?!0:r==null||e==null||r.constructor!==e.constructor?!1:r[Gs]?jp(r,e):aa(r)?iu(r,t=>$p(e,n=>ol(t,
n))):kw(r)?ui(r,(t,n)=>ol(t,e[n])):!1;class nt{static _dilutes=!1;extends(e){let[t,n]=[this.shape,e.shape];return this.constructor.
_dilutes&&([n,t]=[t,n]),ol(t,n)}equals(e){return this.constructor===e.constructor&&Ji(this.shape,e.shape)}[Pw](){return!0}[Gs](e){
return this.equals(e)}validate(e){return this.check(e)}check(e,t){Nt()}get nullable(){return Jn(this,ga)}get optional(){
return new Qp(this)}cast(e){return Ud(e,this),e}expect(e){return Ud(e,this),e}}class pu extends nt{constructor(e,t){super(),
this.shape=e,this._c=t}check(e,t=void 0){const n=e?.constructor===this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name,e?.constructor!==this.shape?"Constructor match failed":"Check failed"),n}}const ve=(r,e=null)=>new pu(
r,e);ve(pu);class mu extends nt{constructor(e){super(),this.shape=e}check(e,t){const n=this.shape(e);return!n&&t?.extend(
null,"custom prop",e?.constructor.name,"failed to check custom prop"),n}}const Re=r=>new mu(r);ve(mu);class ha extends nt{constructor(e){
super(),this.shape=e}check(e,t){const n=this.shape.some(s=>s===e);return!n&&t?.extend(null,this.shape.join(" | "),e.toString()),
n}}const fa=(...r)=>new ha(r),Hp=ve(ha),Nw=RegExp.escape||(r=>r.replace(/[().|&,$^[\]]/g,e=>"\\"+e)),Kp=r=>{if(jn.check(
r))return[Nw(r)];if(Hp.check(r))return r.shape.map(e=>e+"");if(sm.check(r))return["[+-]?\\d+.?\\d*"];if(im.check(r))return[
".*"];if(go.check(r))return r.shape.map(Kp).flat(1);Ct()};class Uw extends nt{constructor(e){super(),this.shape=e,this._r=
new RegExp("^"+e.map(Kp).map(t=>`(${t.join("|")})`).join("")+"$")}check(e,t){const n=this._r.exec(e)!=null;return!n&&t?.
extend(null,this._r.toString(),e.toString(),"String doesn't match string template."),n}}ve(Uw);const Fw=Symbol("optional");
class Qp extends nt{constructor(e){super(),this.shape=e}check(e,t){const n=e===void 0||this.shape.check(e);return!n&&t?.
extend(null,"undefined (optional)","()"),n}get[Fw](){return!0}}const Ow=ve(Qp);class zw extends nt{check(e,t){return t?.
extend(null,"never",typeof e),!1}}ve(zw);class pa extends nt{constructor(e,t=!1){super(),this.shape=e,this._isPartial=t}static _dilutes=!0;get partial(){
return new pa(this.shape,!0)}check(e,t){return e==null?(t?.extend(null,"object","null"),!1):ui(this.shape,(n,s)=>{const i=this.
_isPartial&&!du(e,s)||n.check(e[s],t);return!i&&t?.extend(s.toString(),n.toString(),typeof e[s],"Object property does no\
t match"),i})}}const qw=r=>new pa(r),jw=ve(pa),Gw=Re(r=>r!=null&&(r.constructor===Object||r.constructor==null));class Jp extends nt{constructor(e,t){
super(),this.shape={keys:e,values:t}}check(e,t){return e!=null&&ui(e,(n,s)=>{const i=this.shape.keys.check(s,t);return!i&&
t?.extend(s+"","Record",typeof e,i?"Key doesn't match schema":"Value doesn't match value"),i&&this.shape.values.check(n,
t)})}}const Xp=(r,e)=>new Jp(r,e),Ww=ve(Jp);class Yp extends nt{constructor(e){super(),this.shape=e}check(e,t){return e!=
null&&ui(this.shape,(n,s)=>{const i=n.check(e[s],t);return!i&&t?.extend(s.toString(),"Tuple",typeof n),i})}}const Vw=(...r)=>new Yp(
r);ve(Yp);class Zp extends nt{constructor(e){super(),this.shape=e.length===1?e[0]:new gu(e)}check(e,t){const n=aa(e)&&iu(
e,s=>this.shape.check(s));return!n&&t?.extend(null,"Array",""),n}}const em=(...r)=>new Zp(r),Hw=ve(Zp),Kw=Re(r=>aa(r));class tm extends nt{constructor(e,t){
super(),this.shape=e,this._c=t}check(e,t){const n=e instanceof this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name),n}}const Qw=(r,e=null)=>new tm(r,e);ve(tm);const Jw=Qw(nt);class Xw extends nt{constructor(e){
super(),this.len=e.length-1,this.args=Vw(...e.slice(-1)),this.res=e[this.len]}check(e,t){const n=e.constructor===Function&&
e.length<=this.len;return!n&&t?.extend(null,"function",typeof e),n}}const Yw=ve(Xw),Zw=Re(r=>typeof r=="function");class e0 extends nt{constructor(e){
super(),this.shape=e}check(e,t){const n=iu(this.shape,s=>s.check(e,t));return!n&&t?.extend(null,"Intersectinon",typeof e),
n}}ve(e0,r=>r.shape.length>0);class gu extends nt{static _dilutes=!0;constructor(e){super(),this.shape=e}check(e,t){const n=$p(
this.shape,s=>s.check(e,t));return t?.extend(null,"Union",typeof e),n}}const Jn=(...r)=>r.findIndex(e=>go.check(e))>=0?Jn(
...r.map(e=>Vs(e)).map(e=>go.check(e)?e.shape:[e]).flat(1)):r.length===1?r[0]:new gu(r),go=ve(gu),rm=()=>!0,bo=Re(rm),t0=ve(
mu,r=>r.shape===rm),bu=Re(r=>typeof r=="bigint"),r0=Re(r=>r===bu),nm=Re(r=>typeof r=="symbol");Re(r=>r===nm);const Rn=Re(
r=>typeof r=="number"),sm=Re(r=>r===Rn),jn=Re(r=>typeof r=="string"),im=Re(r=>r===jn),ma=Re(r=>typeof r=="boolean"),n0=Re(
r=>r===ma),om=fa(void 0);ve(ha,r=>r.shape.length===1&&r.shape[0]===void 0);fa(void 0);const ga=fa(null),s0=ve(ha,r=>r.shape.
length===1&&r.shape[0]===null);ve(Uint8Array);ve(pu,r=>r.shape===Uint8Array);const i0=Jn(Rn,jn,ga,om,bu,ma,nm);(()=>{const r=em(
bo),e=Xp(jn,bo),t=Jn(Rn,jn,ga,ma,r,e);return r.shape=t,e.shape.values=t,t})();const Vs=r=>{if(Jw.check(r))return r;if(Gw.
check(r)){const e={};for(const t in r)e[t]=Vs(r[t]);return qw(e)}else{if(Kw.check(r))return Jn(...r.map(Vs));if(i0.check(
r))return fa(r);if(Zw.check(r))return ve(r)}Ct()},Ud=Iw?()=>{}:(r,e)=>{const t=new $w;if(!e.check(r,t))throw fr(`Expecte\
d value to be of type ${e.constructor.name}.
${t.toString()}`)};class o0{constructor(e){this.patterns=[],this.$state=e}if(e,t){return this.patterns.push({if:Vs(e),h:t}),
this}else(e){return this.if(bo,e)}done(){return(e,t)=>{for(let n=0;n<this.patterns.length;n++){const s=this.patterns[n];
if(s.if.check(e))return s.h(e,t)}throw fr("Unhandled pattern")}}}const a0=r=>new o0(r),am=a0(bo).if(sm,(r,e)=>Qa(e,Td,po)).
if(im,(r,e)=>Dw(e)).if(n0,(r,e)=>Nd(e)).if(r0,(r,e)=>BigInt(Qa(e,Td,po))).if(go,(r,e)=>En(e,Ja(e,r.shape))).if(jw,(r,e)=>{
const t={};for(const n in r.shape){let s=r.shape[n];if(Ow.check(s)){if(Nd(e))continue;s=s.shape}t[n]=am(s,e)}return t}).
if(Hw,(r,e)=>{const t=[],n=Vp(e,0,42);for(let s=0;s<n;s++)t.push(En(e,r.shape));return t}).if(Hp,(r,e)=>Ja(e,r.shape)).if(
s0,(r,e)=>null).if(Yw,(r,e)=>{const t=En(e,r.res);return()=>t}).if(t0,(r,e)=>En(e,Ja(e,[Rn,jn,ga,om,bu,ma,em(Rn),Xp(Jn("\
a","b","c"),Rn)]))).if(Ww,(r,e)=>{const t={},n=Qa(e,0,3);for(let s=0;s<n;s++){const i=En(e,r.shape.keys),o=En(e,r.shape.
values);t[i]=o}return t}).done(),En=(r,e)=>am(Vs(e),r),ba=typeof document<"u"?document:{};Re(r=>r.nodeType===h0);typeof DOMParser<
"u"&&new DOMParser;Re(r=>r.nodeType===l0);Re(r=>r.nodeType===u0);const c0=r=>Dy(r,(e,t)=>`${t}:${e};`).join(""),l0=ba.ELEMENT_NODE,
u0=ba.TEXT_NODE,d0=ba.DOCUMENT_NODE,h0=ba.DOCUMENT_FRAGMENT_NODE;Re(r=>r.nodeType===d0);const pr=Symbol,cm=pr(),lm=pr(),
f0=pr(),p0=pr(),m0=pr(),um=pr(),g0=pr(),dm=pr(),b0=pr(),y0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],
t=[];let n=0;for(;n<r.length;n++){const s=r[n];if(s===void 0)break;if(s.constructor===String||s.constructor===Number)e.push(
s);else if(s.constructor===Object)break}for(n>0&&t.push(e.join(""));n<r.length;n++){const s=r[n];s instanceof Symbol||t.
push(s)}return t},w0={[cm]:nr("font-weight","bold"),[lm]:nr("font-weight","normal"),[f0]:nr("color","blue"),[m0]:nr("col\
or","green"),[p0]:nr("color","grey"),[um]:nr("color","red"),[g0]:nr("color","purple"),[dm]:nr("color","orange"),[b0]:nr(
"color","black")},k0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],t=[],n=$t();let s=[],i=0;for(;i<
r.length;i++){const o=r[i],a=w0[o];if(a!==void 0)n.set(a.left,a.right);else{if(o===void 0)break;if(o.constructor===String||
o.constructor===Number){const c=c0(n);i>0||c.length>0?(e.push("%c"+o),t.push(c)):e.push(o)}else break}}for(i>0&&(s=t,s.unshift(
e.join("")));i<r.length;i++){const o=r[i];o instanceof Symbol||s.push(o)}return s},E0=Tw?k0:y0,x0=(...r)=>{console.log(...E0(
r)),v0.forEach(e=>e.print(r))},v0=On(),hm=r=>({[Symbol.iterator](){return this},next:r}),S0=(r,e)=>hm(()=>{let t;do t=r.
next();while(!t.done&&!e(t.value));return t}),Xa=(r,e)=>hm(()=>{const{done:t,value:n}=r.next();return{done:t,value:t?void 0:
e(n)}});class yu{constructor(e,t){this.clock=e,this.len=t}}class di{constructor(){this.clients=new Map}}const al=(r,e,t)=>e.
clients.forEach((n,s)=>{const i=r.doc.store.clients.get(s);for(let o=0;o<n.length;o++){const a=n[o];Am(r,i,a.clock,a.len,
t)}}),A0=(r,e)=>{let t=0,n=r.length-1;for(;t<=n;){const s=Ht((t+n)/2),i=r[s],o=i.clock;if(o<=e){if(e<o+i.len)return s;t=
s+1}else n=s-1}return null},fm=(r,e)=>{const t=r.clients.get(e.client);return t!==void 0&&A0(t,e.clock)!==null},wu=r=>{r.
clients.forEach(e=>{e.sort((s,i)=>s.clock-i.clock);let t,n;for(t=1,n=1;t<e.length;t++){const s=e[n-1],i=e[t];s.clock+s.len>=
i.clock?s.len=dn(s.len,i.clock+i.len-s.clock):(n<t&&(e[n]=i),n++)}e.length=n})},_0=r=>{const e=new di;for(let t=0;t<r.length;t++)
r[t].clients.forEach((n,s)=>{if(!e.clients.has(s)){const i=n.slice();for(let o=t+1;o<r.length;o++)$y(i,r[o].clients.get(
s)||[]);e.clients.set(s,i)}});return wu(e),e},yo=(r,e,t,n)=>{Xr(r.clients,e,()=>[]).push(new yu(t,n))},I0=()=>new di,C0=r=>{
const e=I0();return r.clients.forEach((t,n)=>{const s=[];for(let i=0;i<t.length;i++){const o=t[i];if(o.deleted){const a=o.
id.clock;let c=o.length;if(i+1<t.length)for(let l=t[i+1];i+1<t.length&&l.deleted;l=t[++i+1])c+=l.length;s.push(new yu(a,
c))}}s.length>0&&e.clients.set(n,s)}),e},Xn=(r,e)=>{te(r.restEncoder,e.clients.size),Vr(e.clients.entries()).sort((t,n)=>n[0]-
t[0]).forEach(([t,n])=>{r.resetDsCurVal(),te(r.restEncoder,t);const s=n.length;te(r.restEncoder,s);for(let i=0;i<s;i++){
const o=n[i];r.writeDsClock(o.clock),r.writeDsLen(o.len)}})},ku=r=>{const e=new di,t=Z(r.restDecoder);for(let n=0;n<t;n++){
r.resetDsCurVal();const s=Z(r.restDecoder),i=Z(r.restDecoder);if(i>0){const o=Xr(e.clients,s,()=>[]);for(let a=0;a<i;a++)
o.push(new yu(r.readDsClock(),r.readDsLen()))}}return e},Fd=(r,e,t)=>{const n=new di,s=Z(r.restDecoder);for(let i=0;i<s;i++){
r.resetDsCurVal();const o=Z(r.restDecoder),a=Z(r.restDecoder),c=t.clients.get(o)||[],l=Te(t,o);for(let u=0;u<a;u++){const d=r.
readDsClock(),h=d+r.readDsLen();if(d<l){l<h&&yo(n,o,l,h-l);let p=Kt(c,d),m=c[p];for(!m.deleted&&m.id.clock<d&&(c.splice(
p+1,0,_o(e,m,d-m.id.clock)),p++);p<c.length&&(m=c[p++],m.id.clock<h);)m.deleted||(h<m.id.clock+m.length&&c.splice(p,0,_o(
e,m,h-m.id.clock)),m.delete(e))}else yo(n,o,d,h-d)}}if(n.clients.size>0){const i=new nn;return te(i.restEncoder,0),Xn(i,
n),i.toUint8Array()}return null},pm=zp;class Yn extends ou{constructor({guid:e=gw(),collectionid:t=null,gc:n=!0,gcFilter:s=()=>!0,
meta:i=null,autoLoad:o=!1,shouldLoad:a=!0}={}){super(),this.gc=n,this.gcFilter=s,this.clientID=pm(),this.guid=e,this.collectionid=
t,this.share=new Map,this.store=new vm,this._transaction=null,this._transactionCleanups=[],this.subdocs=new Set,this._item=
null,this.shouldLoad=a,this.autoLoad=o,this.meta=i,this.isLoaded=!1,this.isSynced=!1,this.whenLoaded=qn(l=>{this.on("loa\
d",()=>{this.isLoaded=!0,l(this)})});const c=()=>qn(l=>{const u=d=>{(d===void 0||d===!0)&&(this.off("sync",u),l())};this.
on("sync",u)});this.on("sync",l=>{l===!1&&this.isSynced&&(this.whenSynced=c()),this.isSynced=l===void 0||l===!0,this.isLoaded||
this.emit("load",[])}),this.whenSynced=c()}load(){const e=this._item;e!==null&&!this.shouldLoad&&pe(e.parent.doc,t=>{t.subdocsLoaded.
add(this)},null,!0),this.shouldLoad=!0}getSubdocs(){return this.subdocs}getSubdocGuids(){return new Set(Vr(this.subdocs).
map(e=>e.guid))}transact(e,t=null){return pe(this,e,t)}get(e,t=$e){const n=Xr(this.share,e,()=>{const i=new t;return i._integrate(
this,null),i}),s=n.constructor;if(t!==$e&&s!==t)if(s===$e){const i=new t;i._map=n._map,n._map.forEach(o=>{for(;o!==null;o=
o.left)o.parent=i}),i._start=n._start;for(let o=i._start;o!==null;o=o.right)o.parent=i;return i._length=n._length,this.share.
set(e,i),i._integrate(this,null),i}else throw new Error(`Type with the name ${e} has already been defined with a differe\
nt constructor`);return n}getArray(e=""){return this.get(e,Ln)}getText(e=""){return this.get(e,Wn)}getMap(e=""){return this.
get(e,dr)}getXmlFragment(e=""){return this.get(e,sn)}toJSON(){const e={};return this.share.forEach((t,n)=>{e[n]=t.toJSON()}),
e}destroy(){Vr(this.subdocs).forEach(t=>t.destroy());const e=this._item;if(e!==null){this._item=null;const t=e.content;t.
doc=new Yn({guid:this.guid,...t.opts,shouldLoad:!1}),t.doc._item=e,pe(e.parent.doc,n=>{const s=t.doc;e.deleted||n.subdocsAdded.
add(s),n.subdocsRemoved.add(this)},null,!0)}this.emit("destroyed",[!0]),this.emit("destroy",[this]),super.destroy()}on(e,t){
super.on(e,t)}off(e,t){super.off(e,t)}}class mm{constructor(e){this.restDecoder=e}resetDsCurVal(){}readDsClock(){return Z(
this.restDecoder)}readDsLen(){return Z(this.restDecoder)}}class gm extends mm{readLeftID(){return re(Z(this.restDecoder),
Z(this.restDecoder))}readRightID(){return re(Z(this.restDecoder),Z(this.restDecoder))}readClient(){return Z(this.restDecoder)}readInfo(){
return zn(this.restDecoder)}readString(){return Mn(this.restDecoder)}readParentInfo(){return Z(this.restDecoder)===1}readTypeRef(){
return Z(this.restDecoder)}readLen(){return Z(this.restDecoder)}readAny(){return js(this.restDecoder)}readBuf(){return Rw(
ht(this.restDecoder))}readJSON(){return JSON.parse(Mn(this.restDecoder))}readKey(){return Mn(this.restDecoder)}}class T0{constructor(e){
this.dsCurrVal=0,this.restDecoder=e}resetDsCurVal(){this.dsCurrVal=0}readDsClock(){return this.dsCurrVal+=Z(this.restDecoder),
this.dsCurrVal}readDsLen(){const e=Z(this.restDecoder)+1;return this.dsCurrVal+=e,e}}class Gn extends T0{constructor(e){
super(e),this.keys=[],Z(e),this.keyClockDecoder=new Ka(ht(e)),this.clientDecoder=new Qi(ht(e)),this.leftClockDecoder=new Ka(
ht(e)),this.rightClockDecoder=new Ka(ht(e)),this.infoDecoder=new Pd(ht(e),zn),this.stringDecoder=new fw(ht(e)),this.parentInfoDecoder=
new Pd(ht(e),zn),this.typeRefDecoder=new Qi(ht(e)),this.lenDecoder=new Qi(ht(e))}readLeftID(){return new Bn(this.clientDecoder.
read(),this.leftClockDecoder.read())}readRightID(){return new Bn(this.clientDecoder.read(),this.rightClockDecoder.read())}readClient(){
return this.clientDecoder.read()}readInfo(){return this.infoDecoder.read()}readString(){return this.stringDecoder.read()}readParentInfo(){
return this.parentInfoDecoder.read()===1}readTypeRef(){return this.typeRefDecoder.read()}readLen(){return this.lenDecoder.
read()}readAny(){return js(this.restDecoder)}readBuf(){return ht(this.restDecoder)}readJSON(){return js(this.restDecoder)}readKey(){
const e=this.keyClockDecoder.read();if(e<this.keys.length)return this.keys[e];{const t=this.stringDecoder.read();return this.
keys.push(t),t}}}class bm{constructor(){this.restEncoder=la()}toUint8Array(){return Vt(this.restEncoder)}resetDsCurVal(){}writeDsClock(e){
te(this.restEncoder,e)}writeDsLen(e){te(this.restEncoder,e)}}class hi extends bm{writeLeftID(e){te(this.restEncoder,e.client),
te(this.restEncoder,e.clock)}writeRightID(e){te(this.restEncoder,e.client),te(this.restEncoder,e.clock)}writeClient(e){te(
this.restEncoder,e)}writeInfo(e){rl(this.restEncoder,e)}writeString(e){Tn(this.restEncoder,e)}writeParentInfo(e){te(this.
restEncoder,e?1:0)}writeTypeRef(e){te(this.restEncoder,e)}writeLen(e){te(this.restEncoder,e)}writeAny(e){qs(this.restEncoder,
e)}writeBuf(e){dt(this.restEncoder,e)}writeJSON(e){Tn(this.restEncoder,JSON.stringify(e))}writeKey(e){Tn(this.restEncoder,
e)}}class ym{constructor(){this.restEncoder=la(),this.dsCurrVal=0}toUint8Array(){return Vt(this.restEncoder)}resetDsCurVal(){
this.dsCurrVal=0}writeDsClock(e){const t=e-this.dsCurrVal;this.dsCurrVal=e,te(this.restEncoder,t)}writeDsLen(e){e===0&&Ct(),
te(this.restEncoder,e-1),this.dsCurrVal+=e}}class nn extends ym{constructor(){super(),this.keyMap=new Map,this.keyClock=
0,this.keyClockEncoder=new Ha,this.clientEncoder=new Ki,this.leftClockEncoder=new Ha,this.rightClockEncoder=new Ha,this.
infoEncoder=new Bd(rl),this.stringEncoder=new sw,this.parentInfoEncoder=new Bd(rl),this.typeRefEncoder=new Ki,this.lenEncoder=
new Ki}toUint8Array(){const e=la();return te(e,0),dt(e,this.keyClockEncoder.toUint8Array()),dt(e,this.clientEncoder.toUint8Array()),
dt(e,this.leftClockEncoder.toUint8Array()),dt(e,this.rightClockEncoder.toUint8Array()),dt(e,Vt(this.infoEncoder)),dt(e,this.
stringEncoder.toUint8Array()),dt(e,Vt(this.parentInfoEncoder)),dt(e,this.typeRefEncoder.toUint8Array()),dt(e,this.lenEncoder.
toUint8Array()),ua(e,Vt(this.restEncoder)),Vt(e)}writeLeftID(e){this.clientEncoder.write(e.client),this.leftClockEncoder.
write(e.clock)}writeRightID(e){this.clientEncoder.write(e.client),this.rightClockEncoder.write(e.clock)}writeClient(e){this.
clientEncoder.write(e)}writeInfo(e){this.infoEncoder.write(e)}writeString(e){this.stringEncoder.write(e)}writeParentInfo(e){
this.parentInfoEncoder.write(e?1:0)}writeTypeRef(e){this.typeRefEncoder.write(e)}writeLen(e){this.lenEncoder.write(e)}writeAny(e){
qs(this.restEncoder,e)}writeBuf(e){dt(this.restEncoder,e)}writeJSON(e){qs(this.restEncoder,e)}writeKey(e){const t=this.keyMap.
get(e);t===void 0?(this.keyClockEncoder.write(this.keyClock++),this.stringEncoder.write(e)):this.keyClockEncoder.write(t)}}
const M0=(r,e,t,n)=>{n=dn(n,e[0].id.clock);const s=Kt(e,n);te(r.restEncoder,e.length-s),r.writeClient(t),te(r.restEncoder,
n);const i=e[s];i.write(r,n-i.id.clock);for(let o=s+1;o<e.length;o++)e[o].write(r,0)},Eu=(r,e,t)=>{const n=new Map;t.forEach(
(s,i)=>{Te(e,i)>s&&n.set(i,s)}),ya(e).forEach((s,i)=>{t.has(i)||n.set(i,0)}),te(r.restEncoder,n.size),Vr(n.entries()).sort(
(s,i)=>i[0]-s[0]).forEach(([s,i])=>{M0(r,e.clients.get(s),s,i)})},R0=(r,e)=>{const t=$t(),n=Z(r.restDecoder);for(let s=0;s<
n;s++){const i=Z(r.restDecoder),o=new Array(i),a=r.readClient();let c=Z(r.restDecoder);t.set(a,{i:0,refs:o});for(let l=0;l<
i;l++){const u=r.readInfo();switch(ca&u){case 0:{const d=r.readLen();o[l]=new At(re(a,c),d),c+=d;break}case 10:{const d=Z(
r.restDecoder);o[l]=new _t(re(a,c),d),c+=d;break}default:{const d=(u&(ur|gt))===0,h=new _e(re(a,c),null,(u&gt)===gt?r.readLeftID():
null,null,(u&ur)===ur?r.readRightID():null,d?r.readParentInfo()?e.get(r.readString()):r.readLeftID():null,d&&(u&Os)===Os?
r.readString():null,Gm(r,u));o[l]=h,c+=h.length}}}}return t},B0=(r,e,t)=>{const n=[];let s=Vr(t.keys()).sort((p,m)=>p-m);
if(s.length===0)return null;const i=()=>{if(s.length===0)return null;let p=t.get(s[s.length-1]);for(;p.refs.length===p.i;)
if(s.pop(),s.length>0)p=t.get(s[s.length-1]);else return null;return p};let o=i();if(o===null&&n.length===0)return null;
const a=new vm,c=new Map,l=(p,m)=>{const y=c.get(p);(y==null||y>m)&&c.set(p,m)};let u=o.refs[o.i++];const d=new Map,h=()=>{
for(const p of n){const m=p.id.client,y=t.get(m);y?(y.i--,a.clients.set(m,y.refs.slice(y.i)),t.delete(m),y.i=0,y.refs=[]):
a.clients.set(m,[p]),s=s.filter(g=>g!==m)}n.length=0};for(;;){if(u.constructor!==_t){const m=Xr(d,u.id.client,()=>Te(e,u.
id.client))-u.id.clock;if(m<0)n.push(u),l(u.id.client,u.id.clock-1),h();else{const y=u.getMissing(r,e);if(y!==null){n.push(
u);const g=t.get(y)||{refs:[],i:0};if(g.refs.length===g.i)l(y,Te(e,y)),h();else{u=g.refs[g.i++];continue}}else(m===0||m<
u.length)&&(u.integrate(r,m),d.set(u.id.client,u.id.clock+u.length))}}if(n.length>0)u=n.pop();else if(o!==null&&o.i<o.refs.
length)u=o.refs[o.i++];else{if(o=i(),o===null)break;u=o.refs[o.i++]}}if(a.clients.size>0){const p=new nn;return Eu(p,a,new Map),
te(p.restEncoder,0),{missing:c,update:p.toUint8Array()}}return null},L0=(r,e)=>Eu(r,e.doc.store,e.beforeState),D0=(r,e,t,n=new Gn(
r))=>pe(e,s=>{s.local=!1;let i=!1;const o=s.doc,a=o.store,c=R0(n,o),l=B0(s,a,c),u=a.pendingStructs;if(u){for(const[h,p]of u.
missing)if(p<Te(a,h)){i=!0;break}if(l){for(const[h,p]of l.missing){const m=u.missing.get(h);(m==null||m>p)&&u.missing.set(
h,p)}u.update=ko([u.update,l.update])}}else a.pendingStructs=l;const d=Fd(n,s,a);if(a.pendingDs){const h=new Gn(Qn(a.pendingDs));
Z(h.restDecoder);const p=Fd(h,s,a);d&&p?a.pendingDs=ko([d,p]):a.pendingDs=d||p}else a.pendingDs=d;if(i){const h=a.pendingStructs.
update;a.pendingStructs=null,wm(s.doc,h)}},t,!1),wm=(r,e,t,n=Gn)=>{const s=Qn(e);D0(s,r,t,new n(s))},wo=(r,e,t)=>wm(r,e,
t,gm),P0=(r,e,t=new Map)=>{Eu(r,e.store,t),Xn(r,C0(e.store))},$0=(r,e=new Uint8Array([0]),t=new nn)=>{const n=km(e);P0(t,
r,n);const s=[t.toUint8Array()];if(r.store.pendingDs&&s.push(r.store.pendingDs),r.store.pendingStructs&&s.push(X0(r.store.
pendingStructs.update,e)),s.length>1){if(t.constructor===hi)return Q0(s.map((i,o)=>o===0?i:Z0(i)));if(t.constructor===nn)
return ko(s)}return s[0]},xu=(r,e)=>$0(r,e,new hi),N0=r=>{const e=new Map,t=Z(r.restDecoder);for(let n=0;n<t;n++){const s=Z(
r.restDecoder),i=Z(r.restDecoder);e.set(s,i)}return e},km=r=>N0(new mm(Qn(r))),Em=(r,e)=>(te(r.restEncoder,e.size),Vr(e.
entries()).sort((t,n)=>n[0]-t[0]).forEach(([t,n])=>{te(r.restEncoder,t),te(r.restEncoder,n)}),r),U0=(r,e)=>Em(r,ya(e.store)),
F0=(r,e=new ym)=>(r instanceof Map?Em(e,r):U0(e,r),e.toUint8Array()),O0=r=>F0(r,new bm);class z0{constructor(){this.l=[]}}
const Od=()=>new z0,zd=(r,e)=>r.l.push(e),qd=(r,e)=>{const t=r.l,n=t.length;r.l=t.filter(s=>e!==s),n===r.l.length&&console.
error("[yjs] Tried to remove event handler that doesn't exist.")},xm=(r,e,t)=>hu(r.l,[e,t]);class Bn{constructor(e,t){this.
client=e,this.clock=t}}const Si=(r,e)=>r===e||r!==null&&e!==null&&r.client===e.client&&r.clock===e.clock,re=(r,e)=>new Bn(
r,e),q0=r=>{for(const[e,t]of r.doc.share.entries())if(t===r)return e;throw Ct()},cs=(r,e)=>e===void 0?!r.deleted:e.sv.has(
r.id.client)&&(e.sv.get(r.id.client)||0)>r.id.clock&&!fm(e.ds,r.id),cl=(r,e)=>{const t=Xr(r.meta,cl,On),n=r.doc.store;t.
has(e)||(e.sv.forEach((s,i)=>{s<Te(n,i)&&Hr(r,re(i,s))}),al(r,e.ds,s=>{}),t.add(e))};class vm{constructor(){this.clients=
new Map,this.pendingStructs=null,this.pendingDs=null}}const ya=r=>{const e=new Map;return r.clients.forEach((t,n)=>{const s=t[t.
length-1];e.set(n,s.id.clock+s.length)}),e},Te=(r,e)=>{const t=r.clients.get(e);if(t===void 0)return 0;const n=t[t.length-
1];return n.id.clock+n.length},Sm=(r,e)=>{let t=r.clients.get(e.id.client);if(t===void 0)t=[],r.clients.set(e.id.client,
t);else{const n=t[t.length-1];if(n.id.clock+n.length!==e.id.clock)throw Ct()}t.push(e)},Kt=(r,e)=>{let t=0,n=r.length-1,
s=r[n],i=s.id.clock;if(i===e)return n;let o=Ht(e/(i+s.length-1)*n);for(;t<=n;){if(s=r[o],i=s.id.clock,i<=e){if(e<i+s.length)
return o;t=o+1}else n=o-1;o=Ht((t+n)/2)}throw Ct()},j0=(r,e)=>{const t=r.clients.get(e.client);return t[Kt(t,e.clock)]},
Ya=j0,ll=(r,e,t)=>{const n=Kt(e,t),s=e[n];return s.id.clock<t&&s instanceof _e?(e.splice(n+1,0,_o(r,s,t-s.id.clock)),n+1):
n},Hr=(r,e)=>{const t=r.doc.store.clients.get(e.client);return t[ll(r,t,e.clock)]},jd=(r,e,t)=>{const n=e.clients.get(t.
client),s=Kt(n,t.clock),i=n[s];return t.clock!==i.id.clock+i.length-1&&i.constructor!==At&&n.splice(s+1,0,_o(r,i,t.clock-
i.id.clock+1)),i},G0=(r,e,t)=>{const n=r.clients.get(e.id.client);n[Kt(n,e.id.clock)]=t},Am=(r,e,t,n,s)=>{if(n===0)return;
const i=t+n;let o=ll(r,e,t),a;do a=e[o++],i<a.id.clock+a.length&&ll(r,e,i),s(a);while(o<e.length&&e[o].id.clock<i)};class W0{constructor(e,t,n){
this.doc=e,this.deleteSet=new di,this.beforeState=ya(e.store),this.afterState=new Map,this.changed=new Map,this.changedParentTypes=
new Map,this._mergeStructs=[],this.origin=t,this.meta=new Map,this.local=n,this.subdocsAdded=new Set,this.subdocsRemoved=
new Set,this.subdocsLoaded=new Set}}const Gd=(r,e)=>e.deleteSet.clients.size===0&&!Py(e.afterState,(t,n)=>e.beforeState.
get(n)!==t)?!1:(wu(e.deleteSet),L0(r,e),Xn(r,e.deleteSet),!0),Wd=(r,e,t)=>{const n=e._item;(n===null||n.id.clock<(r.beforeState.
get(n.id.client)||0)&&!n.deleted)&&Xr(r.changed,e,On).add(t)},Xi=(r,e)=>{const t=r[e-1],n=r[e];t.deleted===n.deleted&&t.
constructor===n.constructor&&t.mergeWith(n)&&(r.splice(e,1),n instanceof _e&&n.parentSub!==null&&n.parent._map.get(n.parentSub)===
n&&n.parent._map.set(n.parentSub,t))},V0=(r,e,t)=>{for(const[n,s]of r.clients.entries()){const i=e.clients.get(n);for(let o=s.
length-1;o>=0;o--){const a=s[o],c=a.clock+a.len;for(let l=Kt(i,a.clock),u=i[l];l<i.length&&u.id.clock<c;u=i[++l]){const d=i[l];
if(a.clock+a.len<=d.id.clock)break;d instanceof _e&&d.deleted&&!d.keep&&t(d)&&d.gc(e,!1)}}}},H0=(r,e)=>{r.clients.forEach(
(t,n)=>{const s=e.clients.get(n);for(let i=t.length-1;i>=0;i--){const o=t[i],a=Np(s.length-1,1+Kt(s,o.clock+o.len-1));for(let c=a,
l=s[c];c>0&&l.id.clock>=o.clock;l=s[--c])Xi(s,c)}})},_m=(r,e)=>{if(e<r.length){const t=r[e],n=t.doc,s=n.store,i=t.deleteSet,
o=t._mergeStructs;try{wu(i),t.afterState=ya(t.doc.store),n.emit("beforeObserverCalls",[t,n]);const a=[];t.changed.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&l._callObserver(t,c)})),a.push(()=>{t.changedParentTypes.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&(c=c.filter(u=>u.target._item===null||!u.target._item.deleted),c.
forEach(u=>{u.currentTarget=l}),c.sort((u,d)=>u.path.length-d.path.length),xm(l._dEH,c,t))})),a.push(()=>n.emit("afterTr\
ansaction",[t,n]))}),hu(a,[])}finally{n.gc&&V0(i,s,n.gcFilter),H0(i,s),t.afterState.forEach((u,d)=>{const h=t.beforeState.
get(d)||0;if(h!==u){const p=s.clients.get(d),m=dn(Kt(p,h),1);for(let y=p.length-1;y>=m;y--)Xi(p,y)}});for(let u=0;u<o.length;u++){
const{client:d,clock:h}=o[u].id,p=s.clients.get(d),m=Kt(p,h);m+1<p.length&&Xi(p,m+1),m>0&&Xi(p,m)}if(!t.local&&t.afterState.
get(n.clientID)!==t.beforeState.get(n.clientID)&&(x0(dm,cm,"[yjs] ",lm,um,"Changed the client-id because another client \
seems to be using it."),n.clientID=pm()),n.emit("afterTransactionCleanup",[t,n]),n._observers.has("update")){const u=new hi;
Gd(u,t)&&n.emit("update",[u.toUint8Array(),t.origin,n,t])}if(n._observers.has("updateV2")){const u=new nn;Gd(u,t)&&n.emit(
"updateV2",[u.toUint8Array(),t.origin,n,t])}const{subdocsAdded:a,subdocsLoaded:c,subdocsRemoved:l}=t;(a.size>0||l.size>0||
c.size>0)&&(a.forEach(u=>{u.clientID=n.clientID,u.collectionid==null&&(u.collectionid=n.collectionid),n.subdocs.add(u)}),
l.forEach(u=>n.subdocs.delete(u)),n.emit("subdocs",[{loaded:c,added:a,removed:l},n,t]),l.forEach(u=>u.destroy())),r.length<=
e+1?(n._transactionCleanups=[],n.emit("afterAllTransactions",[n,r])):_m(r,e+1)}}},pe=(r,e,t=null,n=!0)=>{const s=r._transactionCleanups;
let i=!1,o=null;r._transaction===null&&(i=!0,r._transaction=new W0(r,t,n),s.push(r._transaction),s.length===1&&r.emit("b\
eforeAllTransactions",[r]),r.emit("beforeTransaction",[r._transaction,r]));try{o=e(r._transaction)}finally{if(i){const a=r.
_transaction===s[0];r._transaction=null,a&&_m(s,0)}}return o};function*K0(r){const e=Z(r.restDecoder);for(let t=0;t<e;t++){
const n=Z(r.restDecoder),s=r.readClient();let i=Z(r.restDecoder);for(let o=0;o<n;o++){const a=r.readInfo();if(a===10){const c=Z(
r.restDecoder);yield new _t(re(s,i),c),i+=c}else if((ca&a)!==0){const c=(a&(ur|gt))===0,l=new _e(re(s,i),null,(a&gt)===gt?
r.readLeftID():null,null,(a&ur)===ur?r.readRightID():null,c?r.readParentInfo()?r.readString():r.readLeftID():null,c&&(a&
Os)===Os?r.readString():null,Gm(r,a));yield l,i+=l.length}else{const c=r.readLen();yield new At(re(s,i),c),i+=c}}}}class vu{constructor(e,t){
this.gen=K0(e),this.curr=null,this.done=!1,this.filterSkips=t,this.next()}next(){do this.curr=this.gen.next().value||null;while(this.
filterSkips&&this.curr!==null&&this.curr.constructor===_t);return this.curr}}class Su{constructor(e){this.currClient=0,this.
startClock=0,this.written=0,this.encoder=e,this.clientStructs=[]}}const Q0=r=>ko(r,gm,hi),J0=(r,e)=>{if(r.constructor===
At){const{client:t,clock:n}=r.id;return new At(re(t,n+e),r.length-e)}else if(r.constructor===_t){const{client:t,clock:n}=r.
id;return new _t(re(t,n+e),r.length-e)}else{const t=r,{client:n,clock:s}=t.id;return new _e(re(n,s+e),null,re(n,s+e-1),null,
t.rightOrigin,t.parent,t.parentSub,t.content.splice(e))}},ko=(r,e=Gn,t=nn)=>{if(r.length===1)return r[0];const n=r.map(u=>new e(
Qn(u)));let s=n.map(u=>new vu(u,!0)),i=null;const o=new t,a=new Su(o);for(;s=s.filter(h=>h.curr!==null),s.sort((h,p)=>{if(h.
curr.id.client===p.curr.id.client){const m=h.curr.id.clock-p.curr.id.clock;return m===0?h.curr.constructor===p.curr.constructor?
0:h.curr.constructor===_t?1:-1:m}else return p.curr.id.client-h.curr.id.client}),s.length!==0;){const u=s[0],d=u.curr.id.
client;if(i!==null){let h=u.curr,p=!1;for(;h!==null&&h.id.clock+h.length<=i.struct.id.clock+i.struct.length&&h.id.client>=
i.struct.id.client;)h=u.next(),p=!0;if(h===null||h.id.client!==d||p&&h.id.clock>i.struct.id.clock+i.struct.length)continue;
if(d!==i.struct.id.client)Or(a,i.struct,i.offset),i={struct:h,offset:0},u.next();else if(i.struct.id.clock+i.struct.length<
h.id.clock)if(i.struct.constructor===_t)i.struct.length=h.id.clock+h.length-i.struct.id.clock;else{Or(a,i.struct,i.offset);
const m=h.id.clock-i.struct.id.clock-i.struct.length;i={struct:new _t(re(d,i.struct.id.clock+i.struct.length),m),offset:0}}else{
const m=i.struct.id.clock+i.struct.length-h.id.clock;m>0&&(i.struct.constructor===_t?i.struct.length-=m:h=J0(h,m)),i.struct.
mergeWith(h)||(Or(a,i.struct,i.offset),i={struct:h,offset:0},u.next())}}else i={struct:u.curr,offset:0},u.next();for(let h=u.
curr;h!==null&&h.id.client===d&&h.id.clock===i.struct.id.clock+i.struct.length&&h.constructor!==_t;h=u.next())Or(a,i.struct,
i.offset),i={struct:h,offset:0}}i!==null&&(Or(a,i.struct,i.offset),i=null),Au(a);const c=n.map(u=>ku(u)),l=_0(c);return Xn(
o,l),o.toUint8Array()},X0=(r,e,t=Gn,n=nn)=>{const s=km(e),i=new n,o=new Su(i),a=new t(Qn(r)),c=new vu(a,!1);for(;c.curr;){
const u=c.curr,d=u.id.client,h=s.get(d)||0;if(c.curr.constructor===_t){c.next();continue}if(u.id.clock+u.length>h)for(Or(
o,u,dn(h-u.id.clock,0)),c.next();c.curr&&c.curr.id.client===d;)Or(o,c.curr,0),c.next();else for(;c.curr&&c.curr.id.client===
d&&c.curr.id.clock+c.curr.length<=h;)c.next()}Au(o);const l=ku(a);return Xn(i,l),i.toUint8Array()},Im=r=>{r.written>0&&(r.
clientStructs.push({written:r.written,restEncoder:Vt(r.encoder.restEncoder)}),r.encoder.restEncoder=la(),r.written=0)},Or=(r,e,t)=>{
r.written>0&&r.currClient!==e.id.client&&Im(r),r.written===0&&(r.currClient=e.id.client,r.encoder.writeClient(e.id.client),
te(r.encoder.restEncoder,e.id.clock+t)),e.write(r.encoder,t),r.written++},Au=r=>{Im(r);const e=r.encoder.restEncoder;te(
e,r.clientStructs.length);for(let t=0;t<r.clientStructs.length;t++){const n=r.clientStructs[t];te(e,n.written),ua(e,n.restEncoder)}},
Y0=(r,e,t)=>{const n=new e(Qn(r)),s=new vu(n,!1),i=new t,o=new Su(i);for(let c=s.curr;c!==null;c=s.next())Or(o,c,0);Au(o);
const a=ku(n);return Xn(i,a),i.toUint8Array()},Z0=r=>Y0(r,Gn,hi);class wa{constructor(e,t){this.target=e,this.currentTarget=
e,this.transaction=t,this._changes=null,this._keys=null,this._delta=null}get path(){return e1(this.currentTarget,this.target)}deletes(e){
return fm(this.transaction.deleteSet,e.id)}get keys(){if(this._keys===null){const e=new Map,t=this.target;this.transaction.
changed.get(t).forEach(s=>{if(s!==null){const i=t._map.get(s);let o,a;if(this.adds(i)){let c=i.left;for(;c!==null&&this.
adds(c);)c=c.left;if(this.deletes(i))if(c!==null&&this.deletes(c))o="delete",a=Ga(c.content.getContent());else return;else
c!==null&&this.deletes(c)?(o="update",a=Ga(c.content.getContent())):(o="add",a=void 0)}else if(this.deletes(i))o="delete",
a=Ga(i.content.getContent());else return;e.set(s,{action:o,oldValue:a})}}),this._keys=e}return this._keys}get delta(){return this.
changes.delta}adds(e){return e.id.clock>=(this.transaction.beforeState.get(e.id.client)||0)}get changes(){let e=this._changes;
if(e===null){const t=this.target,n=On(),s=On(),i=[];if(e={added:n,deleted:s,delta:i,keys:this.keys},this.transaction.changed.
get(t).has(null)){let a=null;const c=()=>{a&&i.push(a)};for(let l=t._start;l!==null;l=l.right)l.deleted?this.deletes(l)&&
!this.adds(l)&&((a===null||a.delete===void 0)&&(c(),a={delete:0}),a.delete+=l.length,s.add(l)):this.adds(l)?((a===null||
a.insert===void 0)&&(c(),a={insert:[]}),a.insert=a.insert.concat(l.content.getContent()),n.add(l)):((a===null||a.retain===
void 0)&&(c(),a={retain:0}),a.retain+=l.length);a!==null&&a.retain===void 0&&c()}this._changes=e}return e}}const e1=(r,e)=>{
const t=[];for(;e._item!==null&&e!==r;){if(e._item.parentSub!==null)t.unshift(e._item.parentSub);else{let n=0,s=e._item.
parent._start;for(;s!==e._item&&s!==null;)s.deleted||n++,s=s.right;t.unshift(n)}e=e._item.parent}return t},Cm=80;let _u=0;
class t1{constructor(e,t){e.marker=!0,this.p=e,this.index=t,this.timestamp=_u++}}const r1=r=>{r.timestamp=_u++},Tm=(r,e,t)=>{
r.p.marker=!1,r.p=e,e.marker=!0,r.index=t,r.timestamp=_u++},n1=(r,e,t)=>{if(r.length>=Cm){const n=r.reduce((s,i)=>s.timestamp<
i.timestamp?s:i);return Tm(n,e,t),n}else{const n=new t1(e,t);return r.push(n),n}},ka=(r,e)=>{if(r._start===null||e===0||
r._searchMarker===null)return null;const t=r._searchMarker.length===0?null:r._searchMarker.reduce((i,o)=>Hi(e-i.index)<Hi(
e-o.index)?i:o);let n=r._start,s=0;for(t!==null&&(n=t.p,s=t.index,r1(t));n.right!==null&&s<e;){if(!n.deleted&&n.countable){
if(e<s+n.length)break;s+=n.length}n=n.right}for(;n.left!==null&&s>e;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);for(;n.
left!==null&&n.left.id.client===n.id.client&&n.left.id.clock+n.left.length===n.id.clock;)n=n.left,!n.deleted&&n.countable&&
(s-=n.length);return t!==null&&Hi(t.index-s)<n.parent.length/Cm?(Tm(t,n,s),t):n1(r._searchMarker,n,s)},Hs=(r,e,t)=>{for(let n=r.
length-1;n>=0;n--){const s=r[n];if(t>0){let i=s.p;for(i.marker=!1;i&&(i.deleted||!i.countable);)i=i.left,i&&!i.deleted&&
i.countable&&(s.index-=i.length);if(i===null||i.marker===!0){r.splice(n,1);continue}s.p=i,i.marker=!0}(e<s.index||t>0&&e===
s.index)&&(s.index=dn(e,s.index+t))}},Ea=(r,e,t)=>{const n=r,s=e.changedParentTypes;for(;Xr(s,r,()=>[]).push(t),r._item!==
null;)r=r._item.parent;xm(n._eH,t,e)};class $e{constructor(){this._item=null,this._map=new Map,this._start=null,this.doc=
null,this._length=0,this._eH=Od(),this._dEH=Od(),this._searchMarker=null}get parent(){return this._item?this._item.parent:
null}_integrate(e,t){this.doc=e,this._item=t}_copy(){throw Nt()}clone(){throw Nt()}_write(e){}get _first(){let e=this._start;
for(;e!==null&&e.deleted;)e=e.right;return e}_callObserver(e,t){!e.local&&this._searchMarker&&(this._searchMarker.length=
0)}observe(e){zd(this._eH,e)}observeDeep(e){zd(this._dEH,e)}unobserve(e){qd(this._eH,e)}unobserveDeep(e){qd(this._dEH,e)}toJSON(){}}
const Mm=(r,e,t)=>{e<0&&(e=r._length+e),t<0&&(t=r._length+t);let n=t-e;const s=[];let i=r._start;for(;i!==null&&n>0;){if(i.
countable&&!i.deleted){const o=i.content.getContent();if(o.length<=e)e-=o.length;else{for(let a=e;a<o.length&&n>0;a++)s.
push(o[a]),n--;e=0}}i=i.right}return s},Rm=r=>{const e=[];let t=r._start;for(;t!==null;){if(t.countable&&!t.deleted){const n=t.
content.getContent();for(let s=0;s<n.length;s++)e.push(n[s])}t=t.right}return e},Ks=(r,e)=>{let t=0,n=r._start;for(;n!==
null;){if(n.countable&&!n.deleted){const s=n.content.getContent();for(let i=0;i<s.length;i++)e(s[i],t++,r)}n=n.right}},Bm=(r,e)=>{
const t=[];return Ks(r,(n,s)=>{t.push(e(n,s,r))}),t},s1=r=>{let e=r._start,t=null,n=0;return{[Symbol.iterator](){return this},
next:()=>{if(t===null){for(;e!==null&&e.deleted;)e=e.right;if(e===null)return{done:!0,value:void 0};t=e.content.getContent(),
n=0,e=e.right}const s=t[n++];return t.length<=n&&(t=null),{done:!1,value:s}}}},Lm=(r,e)=>{const t=ka(r,e);let n=r._start;
for(t!==null&&(n=t.p,e-=t.index);n!==null;n=n.right)if(!n.deleted&&n.countable){if(e<n.length)return n.content.getContent()[e];
e-=n.length}},Eo=(r,e,t,n)=>{let s=t;const i=r.doc,o=i.clientID,a=i.store,c=t===null?e._start:t.right;let l=[];const u=()=>{
l.length>0&&(s=new _e(re(o,Te(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,new on(l)),s.integrate(r,0),l=[])};n.forEach(d=>{if(d===
null)l.push(d);else switch(d.constructor){case Number:case Object:case Boolean:case Array:case String:l.push(d);break;default:
switch(u(),d.constructor){case Uint8Array:case ArrayBuffer:s=new _e(re(o,Te(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,new fi(
new Uint8Array(d))),s.integrate(r,0);break;case Yn:s=new _e(re(o,Te(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,new pi(d)),s.integrate(
r,0);break;default:if(d instanceof $e)s=new _e(re(o,Te(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,new mr(d)),s.integrate(r,0);else
throw new Error("Unexpected content type in insert operation")}}}),u()},Dm=fr("Length exceeded!"),Pm=(r,e,t,n)=>{if(t>e.
_length)throw Dm;if(t===0)return e._searchMarker&&Hs(e._searchMarker,t,n.length),Eo(r,e,null,n);const s=t,i=ka(e,t);let o=e.
_start;for(i!==null&&(o=i.p,t-=i.index,t===0&&(o=o.prev,t+=o&&o.countable&&!o.deleted?o.length:0));o!==null;o=o.right)if(!o.
deleted&&o.countable){if(t<=o.length){t<o.length&&Hr(r,re(o.id.client,o.id.clock+t));break}t-=o.length}return e._searchMarker&&
Hs(e._searchMarker,s,n.length),Eo(r,e,o,n)},i1=(r,e,t)=>{let s=(e._searchMarker||[]).reduce((i,o)=>o.index>i.index?o:i,{
index:0,p:e._start}).p;if(s)for(;s.right;)s=s.right;return Eo(r,e,s,t)},$m=(r,e,t,n)=>{if(n===0)return;const s=t,i=n,o=ka(
e,t);let a=e._start;for(o!==null&&(a=o.p,t-=o.index);a!==null&&t>0;a=a.right)!a.deleted&&a.countable&&(t<a.length&&Hr(r,
re(a.id.client,a.id.clock+t)),t-=a.length);for(;n>0&&a!==null;)a.deleted||(n<a.length&&Hr(r,re(a.id.client,a.id.clock+n)),
a.delete(r),n-=a.length),a=a.right;if(n>0)throw Dm;e._searchMarker&&Hs(e._searchMarker,s,-i+n)},xo=(r,e,t)=>{const n=e._map.
get(t);n!==void 0&&n.delete(r)},Iu=(r,e,t,n)=>{const s=e._map.get(t)||null,i=r.doc,o=i.clientID;let a;if(n==null)a=new on(
[n]);else switch(n.constructor){case Number:case Object:case Boolean:case Array:case String:a=new on([n]);break;case Uint8Array:
a=new fi(n);break;case Yn:a=new pi(n);break;default:if(n instanceof $e)a=new mr(n);else throw new Error("Unexpected cont\
ent type")}new _e(re(o,Te(i.store,o)),s,s&&s.lastId,null,null,e,t,a).integrate(r,0)},Cu=(r,e)=>{const t=r._map.get(e);return t!==
void 0&&!t.deleted?t.content.getContent()[t.length-1]:void 0},Nm=r=>{const e={};return r._map.forEach((t,n)=>{t.deleted||
(e[n]=t.content.getContent()[t.length-1])}),e},Um=(r,e)=>{const t=r._map.get(e);return t!==void 0&&!t.deleted},Ai=r=>S0(
r.entries(),e=>!e[1].deleted);class o1 extends wa{constructor(e,t){super(e,t),this._transaction=t}}class Ln extends $e{constructor(){
super(),this._prelimContent=[],this._searchMarker=[]}static from(e){const t=new Ln;return t.push(e),t}_integrate(e,t){super.
_integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new Ln}clone(){const e=new Ln;
return e.insert(0,this.toArray().map(t=>t instanceof $e?t.clone():t)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}_callObserver(e,t){super._callObserver(e,t),Ea(this,e,new o1(this,e))}insert(e,t){this.
doc!==null?pe(this.doc,n=>{Pm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}push(e){this.doc!==null?pe(this.doc,t=>{
i1(t,this,e)}):this._prelimContent.push(...e)}unshift(e){this.insert(0,e)}delete(e,t=1){this.doc!==null?pe(this.doc,n=>{
$m(n,this,e,t)}):this._prelimContent.splice(e,t)}get(e){return Lm(this,e)}toArray(){return Rm(this)}slice(e=0,t=this.length){
return Mm(this,e,t)}toJSON(){return this.map(e=>e instanceof $e?e.toJSON():e)}map(e){return Bm(this,e)}forEach(e){Ks(this,
e)}[Symbol.iterator](){return s1(this)}_write(e){e.writeTypeRef(T1)}}const a1=r=>new Ln;class c1 extends wa{constructor(e,t,n){
super(e,t),this.keysChanged=n}}class dr extends $e{constructor(e){super(),this._prelimContent=null,e===void 0?this._prelimContent=
new Map:this._prelimContent=new Map(e)}_integrate(e,t){super._integrate(e,t),this._prelimContent.forEach((n,s)=>{this.set(
s,n)}),this._prelimContent=null}_copy(){return new dr}clone(){const e=new dr;return this.forEach((t,n)=>{e.set(n,t instanceof
$e?t.clone():t)}),e}_callObserver(e,t){Ea(this,e,new c1(this,e,t))}toJSON(){const e={};return this._map.forEach((t,n)=>{
if(!t.deleted){const s=t.content.getContent()[t.length-1];e[n]=s instanceof $e?s.toJSON():s}}),e}get size(){return[...Ai(
this._map)].length}keys(){return Xa(Ai(this._map),e=>e[0])}values(){return Xa(Ai(this._map),e=>e[1].content.getContent()[e[1].
length-1])}entries(){return Xa(Ai(this._map),e=>[e[0],e[1].content.getContent()[e[1].length-1]])}forEach(e){this._map.forEach(
(t,n)=>{t.deleted||e(t.content.getContent()[t.length-1],n,this)})}[Symbol.iterator](){return this.entries()}delete(e){this.
doc!==null?pe(this.doc,t=>{xo(t,this,e)}):this._prelimContent.delete(e)}set(e,t){return this.doc!==null?pe(this.doc,n=>{
Iu(n,this,e,t)}):this._prelimContent.set(e,t),t}get(e){return Cu(this,e)}has(e){return Um(this,e)}clear(){this.doc!==null?
pe(this.doc,e=>{this.forEach(function(t,n,s){xo(e,s,n)})}):this._prelimContent.clear()}_write(e){e.writeTypeRef(M1)}}const l1=r=>new dr,
zr=(r,e)=>r===e||typeof r=="object"&&typeof e=="object"&&r&&e&&Sw(r,e);class ul{constructor(e,t,n,s){this.left=e,this.right=
t,this.index=n,this.currentAttributes=s}forward(){switch(this.right===null&&Ct(),this.right.content.constructor){case Ie:
this.right.deleted||Zn(this.currentAttributes,this.right.content);break;default:this.right.deleted||(this.index+=this.right.
length);break}this.left=this.right,this.right=this.right.right}}const Vd=(r,e,t)=>{for(;e.right!==null&&t>0;){switch(e.right.
content.constructor){case Ie:e.right.deleted||Zn(e.currentAttributes,e.right.content);break;default:e.right.deleted||(t<
e.right.length&&Hr(r,re(e.right.id.client,e.right.id.clock+t)),e.index+=e.right.length,t-=e.right.length);break}e.left=e.
right,e.right=e.right.right}return e},_i=(r,e,t)=>{const n=new Map,s=ka(e,t);if(s){const i=new ul(s.p.left,s.p,s.index,n);
return Vd(r,i,t-s.index)}else{const i=new ul(null,e._start,0,n);return Vd(r,i,t)}},Fm=(r,e,t,n)=>{for(;t.right!==null&&(t.
right.deleted===!0||t.right.content.constructor===Ie&&zr(n.get(t.right.content.key),t.right.content.value));)t.right.deleted||
n.delete(t.right.content.key),t.forward();const s=r.doc,i=s.clientID;n.forEach((o,a)=>{const c=t.left,l=t.right,u=new _e(
re(i,Te(s.store,i)),c,c&&c.lastId,l,l&&l.id,e,null,new Ie(a,o));u.integrate(r,0),t.right=u,t.forward()})},Zn=(r,e)=>{const{
key:t,value:n}=e;n===null?r.delete(t):r.set(t,n)},Om=(r,e)=>{for(;r.right!==null;){if(!(r.right.deleted||r.right.content.
constructor===Ie&&zr(e[r.right.content.key]||null,r.right.content.value)))break;r.forward()}},zm=(r,e,t,n)=>{const s=r.doc,
i=s.clientID,o=new Map;for(const a in n){const c=n[a],l=t.currentAttributes.get(a)||null;if(!zr(l,c)){o.set(a,l);const{left:u,
right:d}=t;t.right=new _e(re(i,Te(s.store,i)),u,u&&u.lastId,d,d&&d.id,e,null,new Ie(a,c)),t.right.integrate(r,0),t.forward()}}
return o},Za=(r,e,t,n,s)=>{t.currentAttributes.forEach((h,p)=>{s[p]===void 0&&(s[p]=null)});const i=r.doc,o=i.clientID;Om(
t,s);const a=zm(r,e,t,s),c=n.constructor===String?new Qt(n):n instanceof $e?new mr(n):new hn(n);let{left:l,right:u,index:d}=t;
e._searchMarker&&Hs(e._searchMarker,t.index,c.getLength()),u=new _e(re(o,Te(i.store,o)),l,l&&l.lastId,u,u&&u.id,e,null,c),
u.integrate(r,0),t.right=u,t.index=d,t.forward(),Fm(r,e,t,a)},Hd=(r,e,t,n,s)=>{const i=r.doc,o=i.clientID;Om(t,s);const a=zm(
r,e,t,s);e:for(;t.right!==null&&(n>0||a.size>0&&(t.right.deleted||t.right.content.constructor===Ie));){if(!t.right.deleted)
switch(t.right.content.constructor){case Ie:{const{key:c,value:l}=t.right.content,u=s[c];if(u!==void 0){if(zr(u,l))a.delete(
c);else{if(n===0)break e;a.set(c,l)}t.right.delete(r)}else t.currentAttributes.set(c,l);break}default:n<t.right.length&&
Hr(r,re(t.right.id.client,t.right.id.clock+n)),n-=t.right.length;break}t.forward()}if(n>0){let c="";for(;n>0;n--)c+=`
`;t.right=new _e(re(o,Te(i.store,o)),t.left,t.left&&t.left.lastId,t.right,t.right&&t.right.id,e,null,new Qt(c)),t.right.
integrate(r,0),t.forward()}Fm(r,e,t,a)},qm=(r,e,t,n,s)=>{let i=e;const o=$t();for(;i&&(!i.countable||i.deleted);){if(!i.
deleted&&i.content.constructor===Ie){const l=i.content;o.set(l.key,l)}i=i.right}let a=0,c=!1;for(;e!==i;){if(t===e&&(c=!0),
!e.deleted){const l=e.content;switch(l.constructor){case Ie:{const{key:u,value:d}=l,h=n.get(u)||null;(o.get(u)!==l||h===
d)&&(e.delete(r),a++,!c&&(s.get(u)||null)===d&&h!==d&&(h===null?s.delete(u):s.set(u,h))),!c&&!e.deleted&&Zn(s,l);break}}}
e=e.right}return a},u1=(r,e)=>{for(;e&&e.right&&(e.right.deleted||!e.right.countable);)e=e.right;const t=new Set;for(;e&&
(e.deleted||!e.countable);){if(!e.deleted&&e.content.constructor===Ie){const n=e.content.key;t.has(n)?e.delete(r):t.add(
n)}e=e.left}},d1=r=>{let e=0;return pe(r.doc,t=>{let n=r._start,s=r._start,i=$t();const o=el(i);for(;s;){if(s.deleted===
!1)switch(s.content.constructor){case Ie:Zn(o,s.content);break;default:e+=qm(t,n,s,i,o),i=el(o),n=s;break}s=s.right}}),e},
Kd=(r,e,t)=>{const n=t,s=el(e.currentAttributes),i=e.right;for(;t>0&&e.right!==null;){if(e.right.deleted===!1)switch(e.right.
content.constructor){case mr:case hn:case Qt:t<e.right.length&&Hr(r,re(e.right.id.client,e.right.id.clock+t)),t-=e.right.
length,e.right.delete(r);break}e.forward()}i&&qm(r,i,e.right,s,e.currentAttributes);const o=(e.left||e.right).parent;return o.
_searchMarker&&Hs(o._searchMarker,e.index,-n+t),e};class h1 extends wa{constructor(e,t,n){super(e,t),this.childListChanged=
!1,this.keysChanged=new Set,n.forEach(s=>{s===null?this.childListChanged=!0:this.keysChanged.add(s)})}get changes(){if(this.
_changes===null){const e={keys:this.keys,delta:this.delta,added:new Set,deleted:new Set};this._changes=e}return this._changes}get delta(){
if(this._delta===null){const e=this.target.doc,t=[];pe(e,n=>{const s=new Map,i=new Map;let o=this.target._start,a=null;const c={};
let l="",u=0,d=0;const h=()=>{if(a!==null){let p=null;switch(a){case"delete":d>0&&(p={delete:d}),d=0;break;case"insert":
(typeof l=="object"||l.length>0)&&(p={insert:l},s.size>0&&(p.attributes={},s.forEach((m,y)=>{m!==null&&(p.attributes[y]=
m)}))),l="";break;case"retain":u>0&&(p={retain:u},vw(c)||(p.attributes=Ew({},c))),u=0;break}p&&t.push(p),a=null}};for(;o!==
null;){switch(o.content.constructor){case mr:case hn:this.adds(o)?this.deletes(o)||(h(),a="insert",l=o.content.getContent()[0],
h()):this.deletes(o)?(a!=="delete"&&(h(),a="delete"),d+=1):o.deleted||(a!=="retain"&&(h(),a="retain"),u+=1);break;case Qt:
this.adds(o)?this.deletes(o)||(a!=="insert"&&(h(),a="insert"),l+=o.content.str):this.deletes(o)?(a!=="delete"&&(h(),a="d\
elete"),d+=o.length):o.deleted||(a!=="retain"&&(h(),a="retain"),u+=o.length);break;case Ie:{const{key:p,value:m}=o.content;
if(this.adds(o)){if(!this.deletes(o)){const y=s.get(p)||null;zr(y,m)?m!==null&&o.delete(n):(a==="retain"&&h(),zr(m,i.get(
p)||null)?delete c[p]:c[p]=m)}}else if(this.deletes(o)){i.set(p,m);const y=s.get(p)||null;zr(y,m)||(a==="retain"&&h(),c[p]=
y)}else if(!o.deleted){i.set(p,m);const y=c[p];y!==void 0&&(zr(y,m)?y!==null&&o.delete(n):(a==="retain"&&h(),m===null?delete c[p]:
c[p]=m))}o.deleted||(a==="insert"&&h(),Zn(s,o.content));break}}o=o.right}for(h();t.length>0;){const p=t[t.length-1];if(p.
retain!==void 0&&p.attributes===void 0)t.pop();else break}}),this._delta=t}return this._delta}}class Wn extends $e{constructor(e){
super(),this._pending=e!==void 0?[()=>this.insert(0,e)]:[],this._searchMarker=[]}get length(){return this._length}_integrate(e,t){
super._integrate(e,t);try{this._pending.forEach(n=>n())}catch(n){console.error(n)}this._pending=null}_copy(){return new Wn}clone(){
const e=new Wn;return e.applyDelta(this.toDelta()),e}_callObserver(e,t){super._callObserver(e,t);const n=new h1(this,e,t),
s=e.doc;if(Ea(this,e,n),!e.local){let i=!1;for(const[o,a]of e.afterState.entries()){const c=e.beforeState.get(o)||0;if(a!==
c&&(Am(e,s.store.clients.get(o),c,a,l=>{!l.deleted&&l.content.constructor===Ie&&(i=!0)}),i))break}i||al(e,e.deleteSet,o=>{
o instanceof At||i||o.parent===this&&o.content.constructor===Ie&&(i=!0)}),pe(s,o=>{i?d1(this):al(o,o.deleteSet,a=>{a instanceof
At||a.parent===this&&u1(o,a)})})}}toString(){let e="",t=this._start;for(;t!==null;)!t.deleted&&t.countable&&t.content.constructor===
Qt&&(e+=t.content.str),t=t.right;return e}toJSON(){return this.toString()}applyDelta(e,{sanitize:t=!0}={}){this.doc!==null?
pe(this.doc,n=>{const s=new ul(null,this._start,0,new Map);for(let i=0;i<e.length;i++){const o=e[i];if(o.insert!==void 0){
const a=!t&&typeof o.insert=="string"&&i===e.length-1&&s.right===null&&o.insert.slice(-1)===`
`?o.insert.slice(0,-1):o.insert;(typeof a!="string"||a.length>0)&&Za(n,this,s,a,o.attributes||{})}else o.retain!==void 0?
Hd(n,this,s,o.retain,o.attributes||{}):o.delete!==void 0&&Kd(n,s,o.delete)}}):this._pending.push(()=>this.applyDelta(e))}toDelta(e,t,n){
const s=[],i=new Map,o=this.doc;let a="",c=this._start;function l(){if(a.length>0){const d={};let h=!1;i.forEach((m,y)=>{
h=!0,d[y]=m});const p={insert:a};h&&(p.attributes=d),s.push(p),a=""}}const u=()=>{for(;c!==null;){if(cs(c,e)||t!==void 0&&
cs(c,t))switch(c.content.constructor){case Qt:{const d=i.get("ychange");e!==void 0&&!cs(c,e)?(d===void 0||d.user!==c.id.
client||d.type!=="removed")&&(l(),i.set("ychange",n?n("removed",c.id):{type:"removed"})):t!==void 0&&!cs(c,t)?(d===void 0||
d.user!==c.id.client||d.type!=="added")&&(l(),i.set("ychange",n?n("added",c.id):{type:"added"})):d!==void 0&&(l(),i.delete(
"ychange")),a+=c.content.str;break}case mr:case hn:{l();const d={insert:c.content.getContent()[0]};if(i.size>0){const h={};
d.attributes=h,i.forEach((p,m)=>{h[m]=p})}s.push(d);break}case Ie:cs(c,e)&&(l(),Zn(i,c.content));break}c=c.right}l()};return e||
t?pe(o,d=>{e&&cl(d,e),t&&cl(d,t),u()},"cleanup"):u(),s}insert(e,t,n){if(t.length<=0)return;const s=this.doc;s!==null?pe(
s,i=>{const o=_i(i,this,e);n||(n={},o.currentAttributes.forEach((a,c)=>{n[c]=a})),Za(i,this,o,t,n)}):this._pending.push(
()=>this.insert(e,t,n))}insertEmbed(e,t,n={}){const s=this.doc;s!==null?pe(s,i=>{const o=_i(i,this,e);Za(i,this,o,t,n)}):
this._pending.push(()=>this.insertEmbed(e,t,n))}delete(e,t){if(t===0)return;const n=this.doc;n!==null?pe(n,s=>{Kd(s,_i(s,
this,e),t)}):this._pending.push(()=>this.delete(e,t))}format(e,t,n){if(t===0)return;const s=this.doc;s!==null?pe(s,i=>{const o=_i(
i,this,e);o.right!==null&&Hd(i,this,o,t,n)}):this._pending.push(()=>this.format(e,t,n))}removeAttribute(e){this.doc!==null?
pe(this.doc,t=>{xo(t,this,e)}):this._pending.push(()=>this.removeAttribute(e))}setAttribute(e,t){this.doc!==null?pe(this.
doc,n=>{Iu(n,this,e,t)}):this._pending.push(()=>this.setAttribute(e,t))}getAttribute(e){return Cu(this,e)}getAttributes(){
return Nm(this)}_write(e){e.writeTypeRef(R1)}}const f1=r=>new Wn;class ec{constructor(e,t=()=>!0){this._filter=t,this._root=
e,this._currentNode=e._start,this._firstCall=!0}[Symbol.iterator](){return this}next(){let e=this._currentNode,t=e&&e.content&&
e.content.type;if(e!==null&&(!this._firstCall||e.deleted||!this._filter(t)))do if(t=e.content.type,!e.deleted&&(t.constructor===
Qs||t.constructor===sn)&&t._start!==null)e=t._start;else for(;e!==null;)if(e.right!==null){e=e.right;break}else e.parent===
this._root?e=null:e=e.parent._item;while(e!==null&&(e.deleted||!this._filter(e.content.type)));return this._firstCall=!1,
e===null?{value:void 0,done:!0}:(this._currentNode=e,{value:e.content.type,done:!1})}}class sn extends $e{constructor(){
super(),this._prelimContent=[]}get firstChild(){const e=this._first;return e?e.content.getContent()[0]:null}_integrate(e,t){
super._integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new sn}clone(){const e=new sn;
return e.insert(0,this.toArray().map(t=>t instanceof $e?t.clone():t)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}createTreeWalker(e){return new ec(this,e)}querySelector(e){e=e.toUpperCase();const n=new ec(
this,s=>s.nodeName&&s.nodeName.toUpperCase()===e).next();return n.done?null:n.value}querySelectorAll(e){return e=e.toUpperCase(),
Vr(new ec(this,t=>t.nodeName&&t.nodeName.toUpperCase()===e))}_callObserver(e,t){Ea(this,e,new g1(this,t,e))}toString(){return Bm(
this,e=>e.toString()).join("")}toJSON(){return this.toString()}toDOM(e=document,t={},n){const s=e.createDocumentFragment();
return n!==void 0&&n._createAssociation(s,this),Ks(this,i=>{s.insertBefore(i.toDOM(e,t,n),null)}),s}insert(e,t){this.doc!==
null?pe(this.doc,n=>{Pm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}insertAfter(e,t){if(this.doc!==null)pe(this.doc,
n=>{const s=e&&e instanceof $e?e._item:e;Eo(n,this,s,t)});else{const n=this._prelimContent,s=e===null?0:n.findIndex(i=>i===
e)+1;if(s===0&&e!==null)throw fr("Reference item not found");n.splice(s,0,...t)}}delete(e,t=1){this.doc!==null?pe(this.doc,
n=>{$m(n,this,e,t)}):this._prelimContent.splice(e,t)}toArray(){return Rm(this)}push(e){this.insert(this.length,e)}unshift(e){
this.insert(0,e)}get(e){return Lm(this,e)}slice(e=0,t=this.length){return Mm(this,e,t)}forEach(e){Ks(this,e)}_write(e){e.
writeTypeRef(L1)}}const p1=r=>new sn;class Qs extends sn{constructor(e="UNDEFINED"){super(),this.nodeName=e,this._prelimAttrs=
new Map}get nextSibling(){const e=this._item?this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this.
_item?this._item.prev:null;return e?e.content.type:null}_integrate(e,t){super._integrate(e,t),this._prelimAttrs.forEach(
(n,s)=>{this.setAttribute(s,n)}),this._prelimAttrs=null}_copy(){return new Qs(this.nodeName)}clone(){const e=new Qs(this.
nodeName),t=this.getAttributes();for(const n in t)e.setAttribute(n,t[n]);return e.insert(0,this.toArray().map(n=>n instanceof
$e?n.clone():n)),e}toString(){const e=this.getAttributes(),t=[],n=[];for(const a in e)n.push(a);n.sort();const s=n.length;
for(let a=0;a<s;a++){const c=n[a];t.push(c+'="'+e[c]+'"')}const i=this.nodeName.toLocaleLowerCase(),o=t.length>0?" "+t.join(
" "):"";return`<${i}${o}>${super.toString()}</${i}>`}removeAttribute(e){this.doc!==null?pe(this.doc,t=>{xo(t,this,e)}):this.
_prelimAttrs.delete(e)}setAttribute(e,t){this.doc!==null?pe(this.doc,n=>{Iu(n,this,e,t)}):this._prelimAttrs.set(e,t)}getAttribute(e){
return Cu(this,e)}hasAttribute(e){return Um(this,e)}getAttributes(){return Nm(this)}toDOM(e=document,t={},n){const s=e.createElement(
this.nodeName),i=this.getAttributes();for(const o in i)s.setAttribute(o,i[o]);return Ks(this,o=>{s.appendChild(o.toDOM(e,
t,n))}),n!==void 0&&n._createAssociation(s,this),s}_write(e){e.writeTypeRef(B1),e.writeKey(this.nodeName)}}const m1=r=>new Qs(
r.readKey());class g1 extends wa{constructor(e,t,n){super(e,n),this.childListChanged=!1,this.attributesChanged=new Set,t.
forEach(s=>{s===null?this.childListChanged=!0:this.attributesChanged.add(s)})}}class vo extends dr{constructor(e){super(),
this.hookName=e}_copy(){return new vo(this.hookName)}clone(){const e=new vo(this.hookName);return this.forEach((t,n)=>{e.
set(n,t)}),e}toDOM(e=document,t={},n){const s=t[this.hookName];let i;return s!==void 0?i=s.createDom(this):i=document.createElement(
this.hookName),i.setAttribute("data-yjs-hook",this.hookName),n!==void 0&&n._createAssociation(i,this),i}_write(e){e.writeTypeRef(
D1),e.writeKey(this.hookName)}}const b1=r=>new vo(r.readKey());class So extends Wn{get nextSibling(){const e=this._item?
this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this._item?this._item.prev:null;return e?e.content.
type:null}_copy(){return new So}clone(){const e=new So;return e.applyDelta(this.toDelta()),e}toDOM(e=document,t,n){const s=e.
createTextNode(this.toString());return n!==void 0&&n._createAssociation(s,this),s}toString(){return this.toDelta().map(e=>{
const t=[];for(const s in e.attributes){const i=[];for(const o in e.attributes[s])i.push({key:o,value:e.attributes[s][o]});
i.sort((o,a)=>o.key<a.key?-1:1),t.push({nodeName:s,attrs:i})}t.sort((s,i)=>s.nodeName<i.nodeName?-1:1);let n="";for(let s=0;s<
t.length;s++){const i=t[s];n+=`<${i.nodeName}`;for(let o=0;o<i.attrs.length;o++){const a=i.attrs[o];n+=` ${a.key}="${a.value}\
"`}n+=">"}n+=e.insert;for(let s=t.length-1;s>=0;s--)n+=`</${t[s].nodeName}>`;return n}).join("")}toJSON(){return this.toString()}_write(e){
e.writeTypeRef(P1)}}const y1=r=>new So;class Tu{constructor(e,t){this.id=e,this.length=t}get deleted(){throw Nt()}mergeWith(e){
return!1}write(e,t,n){throw Nt()}integrate(e,t){throw Nt()}}const w1=0;class At extends Tu{get deleted(){return!0}delete(){}mergeWith(e){
return this.constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){t>0&&(this.id.clock+=t,this.length-=
t),Sm(e.doc.store,this)}write(e,t){e.writeInfo(w1),e.writeLen(this.length-t)}getMissing(e,t){return null}}class fi{constructor(e){
this.content=e}getLength(){return 1}getContent(){return[this.content]}isCountable(){return!0}copy(){return new fi(this.content)}splice(e){
throw Nt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeBuf(this.content)}getRef(){return 3}}
const k1=r=>new fi(r.readBuf());class Js{constructor(e){this.len=e}getLength(){return this.len}getContent(){return[]}isCountable(){
return!1}copy(){return new Js(this.len)}splice(e){const t=new Js(this.len-e);return this.len=e,t}mergeWith(e){return this.
len+=e.len,!0}integrate(e,t){yo(e.deleteSet,t.id.client,t.id.clock,this.len),t.markDeleted()}delete(e){}gc(e){}write(e,t){
e.writeLen(this.len-t)}getRef(){return 1}}const E1=r=>new Js(r.readLen()),jm=(r,e)=>new Yn({guid:r,...e,shouldLoad:e.shouldLoad||
e.autoLoad||!1});class pi{constructor(e){e._item&&console.error("This document was already integrated as a sub-document.\
 You should create a second instance instead with the same guid."),this.doc=e;const t={};this.opts=t,e.gc||(t.gc=!1),e.autoLoad&&
(t.autoLoad=!0),e.meta!==null&&(t.meta=e.meta)}getLength(){return 1}getContent(){return[this.doc]}isCountable(){return!0}copy(){
return new pi(jm(this.doc.guid,this.opts))}splice(e){throw Nt()}mergeWith(e){return!1}integrate(e,t){this.doc._item=t,e.
subdocsAdded.add(this.doc),this.doc.shouldLoad&&e.subdocsLoaded.add(this.doc)}delete(e){e.subdocsAdded.has(this.doc)?e.subdocsAdded.
delete(this.doc):e.subdocsRemoved.add(this.doc)}gc(e){}write(e,t){e.writeString(this.doc.guid),e.writeAny(this.opts)}getRef(){
return 9}}const x1=r=>new pi(jm(r.readString(),r.readAny()));class hn{constructor(e){this.embed=e}getLength(){return 1}getContent(){
return[this.embed]}isCountable(){return!0}copy(){return new hn(this.embed)}splice(e){throw Nt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){
e.writeJSON(this.embed)}getRef(){return 5}}const v1=r=>new hn(r.readJSON());class Ie{constructor(e,t){this.key=e,this.value=
t}getLength(){return 1}getContent(){return[]}isCountable(){return!1}copy(){return new Ie(this.key,this.value)}splice(e){
throw Nt()}mergeWith(e){return!1}integrate(e,t){t.parent._searchMarker=null}delete(e){}gc(e){}write(e,t){e.writeKey(this.
key),e.writeJSON(this.value)}getRef(){return 6}}const S1=r=>new Ie(r.readKey(),r.readJSON());class Ao{constructor(e){this.
arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new Ao(this.arr)}splice(e){
const t=new Ao(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.arr.concat(e.arr),
!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<n;s++){const i=this.
arr[s];e.writeString(i===void 0?"undefined":JSON.stringify(i))}}getRef(){return 2}}const A1=r=>{const e=r.readLen(),t=[];
for(let n=0;n<e;n++){const s=r.readString();s==="undefined"?t.push(void 0):t.push(JSON.parse(s))}return new Ao(t)};class on{constructor(e){
this.arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new on(this.
arr)}splice(e){const t=new on(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.
arr.concat(e.arr),!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<
n;s++){const i=this.arr[s];e.writeAny(i)}}getRef(){return 8}}const _1=r=>{const e=r.readLen(),t=[];for(let n=0;n<e;n++)t.
push(r.readAny());return new on(t)};class Qt{constructor(e){this.str=e}getLength(){return this.str.length}getContent(){return this.
str.split("")}isCountable(){return!0}copy(){return new Qt(this.str)}splice(e){const t=new Qt(this.str.slice(e));this.str=
this.str.slice(0,e);const n=this.str.charCodeAt(e-1);return n>=55296&&n<=56319&&(this.str=this.str.slice(0,e-1)+"�",t.
str="�"+t.str.slice(1)),t}mergeWith(e){return this.str+=e.str,!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeString(
t===0?this.str:this.str.slice(t))}getRef(){return 4}}const I1=r=>new Qt(r.readString()),C1=[a1,l1,f1,m1,p1,b1,y1],T1=0,M1=1,
R1=2,B1=3,L1=4,D1=5,P1=6;class mr{constructor(e){this.type=e}getLength(){return 1}getContent(){return[this.type]}isCountable(){
return!0}copy(){return new mr(this.type._copy())}splice(e){throw Nt()}mergeWith(e){return!1}integrate(e,t){this.type._integrate(
e.doc,t)}delete(e){let t=this.type._start;for(;t!==null;)t.deleted?e._mergeStructs.push(t):t.delete(e),t=t.right;this.type.
_map.forEach(n=>{n.deleted?e._mergeStructs.push(n):n.delete(e)}),e.changed.delete(this.type)}gc(e){let t=this.type._start;
for(;t!==null;)t.gc(e,!0),t=t.right;this.type._start=null,this.type._map.forEach(n=>{for(;n!==null;)n.gc(e,!0),n=n.left}),
this.type._map=new Map}write(e,t){this.type._write(e)}getRef(){return 7}}const $1=r=>new mr(C1[r.readTypeRef()](r)),_o=(r,e,t)=>{
const{client:n,clock:s}=e.id,i=new _e(re(n,s+t),e,re(n,s+t-1),e.right,e.rightOrigin,e.parent,e.parentSub,e.content.splice(
t));return e.deleted&&i.markDeleted(),e.keep&&(i.keep=!0),e.redone!==null&&(i.redone=re(e.redone.client,e.redone.clock+t)),
e.right=i,i.right!==null&&(i.right.left=i),r._mergeStructs.push(i),i.parentSub!==null&&i.right===null&&i.parent._map.set(
i.parentSub,i),e.length=t,i};class _e extends Tu{constructor(e,t,n,s,i,o,a,c){super(e,c.getLength()),this.origin=n,this.
left=t,this.right=s,this.rightOrigin=i,this.parent=o,this.parentSub=a,this.redone=null,this.content=c,this.info=this.content.
isCountable()?Cd:0}set marker(e){(this.info&Va)>0!==e&&(this.info^=Va)}get marker(){return(this.info&Va)>0}get keep(){return(this.
info&Id)>0}set keep(e){this.keep!==e&&(this.info^=Id)}get countable(){return(this.info&Cd)>0}get deleted(){return(this.info&
Wa)>0}set deleted(e){this.deleted!==e&&(this.info^=Wa)}markDeleted(){this.info|=Wa}getMissing(e,t){if(this.origin&&this.
origin.client!==this.id.client&&this.origin.clock>=Te(t,this.origin.client))return this.origin.client;if(this.rightOrigin&&
this.rightOrigin.client!==this.id.client&&this.rightOrigin.clock>=Te(t,this.rightOrigin.client))return this.rightOrigin.
client;if(this.parent&&this.parent.constructor===Bn&&this.id.client!==this.parent.client&&this.parent.clock>=Te(t,this.parent.
client))return this.parent.client;if(this.origin&&(this.left=jd(e,t,this.origin),this.origin=this.left.lastId),this.rightOrigin&&
(this.right=Hr(e,this.rightOrigin),this.rightOrigin=this.right.id),(this.left&&this.left.constructor===At||this.right&&this.
right.constructor===At)&&(this.parent=null),!this.parent)this.left&&this.left.constructor===_e&&(this.parent=this.left.parent,
this.parentSub=this.left.parentSub),this.right&&this.right.constructor===_e&&(this.parent=this.right.parent,this.parentSub=
this.right.parentSub);else if(this.parent.constructor===Bn){const n=Ya(t,this.parent);n.constructor===At?this.parent=null:
this.parent=n.content.type}return null}integrate(e,t){if(t>0&&(this.id.clock+=t,this.left=jd(e,e.doc.store,re(this.id.client,
this.id.clock-1)),this.origin=this.left.lastId,this.content=this.content.splice(t),this.length-=t),this.parent){if(!this.
left&&(!this.right||this.right.left!==null)||this.left&&this.left.right!==this.right){let n=this.left,s;if(n!==null)s=n.
right;else if(this.parentSub!==null)for(s=this.parent._map.get(this.parentSub)||null;s!==null&&s.left!==null;)s=s.left;else
s=this.parent._start;const i=new Set,o=new Set;for(;s!==null&&s!==this.right;){if(o.add(s),i.add(s),Si(this.origin,s.origin)){
if(s.id.client<this.id.client)n=s,i.clear();else if(Si(this.rightOrigin,s.rightOrigin))break}else if(s.origin!==null&&o.
has(Ya(e.doc.store,s.origin)))i.has(Ya(e.doc.store,s.origin))||(n=s,i.clear());else break;s=s.right}this.left=n}if(this.
left!==null){const n=this.left.right;this.right=n,this.left.right=this}else{let n;if(this.parentSub!==null)for(n=this.parent.
_map.get(this.parentSub)||null;n!==null&&n.left!==null;)n=n.left;else n=this.parent._start,this.parent._start=this;this.
right=n}this.right!==null?this.right.left=this:this.parentSub!==null&&(this.parent._map.set(this.parentSub,this),this.left!==
null&&this.left.delete(e)),this.parentSub===null&&this.countable&&!this.deleted&&(this.parent._length+=this.length),Sm(e.
doc.store,this),this.content.integrate(e,this),Wd(e,this.parent,this.parentSub),(this.parent._item!==null&&this.parent._item.
deleted||this.parentSub!==null&&this.right!==null)&&this.delete(e)}else new At(this.id,this.length).integrate(e,0)}get next(){
let e=this.right;for(;e!==null&&e.deleted;)e=e.right;return e}get prev(){let e=this.left;for(;e!==null&&e.deleted;)e=e.left;
return e}get lastId(){return this.length===1?this.id:re(this.id.client,this.id.clock+this.length-1)}mergeWith(e){if(this.
constructor===e.constructor&&Si(e.origin,this.lastId)&&this.right===e&&Si(this.rightOrigin,e.rightOrigin)&&this.id.client===
e.id.client&&this.id.clock+this.length===e.id.clock&&this.deleted===e.deleted&&this.redone===null&&e.redone===null&&this.
content.constructor===e.content.constructor&&this.content.mergeWith(e.content)){const t=this.parent._searchMarker;return t&&
t.forEach(n=>{n.p===e&&(n.p=this,!this.deleted&&this.countable&&(n.index-=this.length))}),e.keep&&(this.keep=!0),this.right=
e.right,this.right!==null&&(this.right.left=this),this.length+=e.length,!0}return!1}delete(e){if(!this.deleted){const t=this.
parent;this.countable&&this.parentSub===null&&(t._length-=this.length),this.markDeleted(),yo(e.deleteSet,this.id.client,
this.id.clock,this.length),Wd(e,t,this.parentSub),this.content.delete(e)}}gc(e,t){if(!this.deleted)throw Ct();this.content.
gc(e),t?G0(e,this,new At(this.id,this.length)):this.content=new Js(this.length)}write(e,t){const n=t>0?re(this.id.client,
this.id.clock+t-1):this.origin,s=this.rightOrigin,i=this.parentSub,o=this.content.getRef()&ca|(n===null?0:gt)|(s===null?
0:ur)|(i===null?0:Os);if(e.writeInfo(o),n!==null&&e.writeLeftID(n),s!==null&&e.writeRightID(s),n===null&&s===null){const a=this.
parent;if(a._item!==void 0){const c=a._item;if(c===null){const l=q0(a);e.writeParentInfo(!0),e.writeString(l)}else e.writeParentInfo(
!1),e.writeLeftID(c.id)}else a.constructor===String?(e.writeParentInfo(!0),e.writeString(a)):a.constructor===Bn?(e.writeParentInfo(
!1),e.writeLeftID(a)):Ct();i!==null&&e.writeString(i)}this.content.write(e,t)}}const Gm=(r,e)=>N1[e&ca](r),N1=[()=>{Ct()},
E1,A1,k1,I1,v1,S1,$1,_1,x1,()=>{Ct()}],U1=10;class _t extends Tu{get deleted(){return!0}delete(){}mergeWith(e){return this.
constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){Ct()}write(e,t){e.writeInfo(U1),te(e.restEncoder,
this.length-t)}getMissing(e,t){return null}}const Wm=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<
"u"?global:{},Vm="__ $YJS$ __";Wm[Vm]===!0&&console.error("Yjs was already imported. This breaks constructor checks and \
will lead to issues! - https://github.com/yjs/yjs/issues/438");Wm[Vm]=!0;const fn=r=>qn((e,t)=>{r.onerror=n=>t(new Error(
n.target.error)),r.onsuccess=n=>e(n.target.result)}),F1=(r,e)=>qn((t,n)=>{const s=indexedDB.open(r);s.onupgradeneeded=i=>e(
i.target.result),s.onerror=i=>n(fr(i.target.error)),s.onsuccess=i=>{const o=i.target.result;o.onversionchange=()=>{o.close()},
t(o)}}),O1=r=>fn(indexedDB.deleteDatabase(r)),z1=(r,e)=>e.forEach(t=>r.createObjectStore.apply(r,t)),Is=(r,e,t="readwrit\
e")=>{const n=r.transaction(e,t);return e.map(s=>Q1(n,s))},Hm=(r,e)=>fn(r.count(e)),q1=(r,e)=>fn(r.get(e)),Km=(r,e)=>fn(
r.delete(e)),j1=(r,e,t)=>fn(r.put(e,t)),dl=(r,e)=>fn(r.add(e)),G1=(r,e,t)=>fn(r.getAll(e,t)),W1=(r,e,t)=>{let n=null;return K1(
r,e,s=>(n=s,!1),t).then(()=>n)},V1=(r,e=null)=>W1(r,e,"prev"),H1=(r,e)=>qn((t,n)=>{r.onerror=n,r.onsuccess=async s=>{const i=s.
target.result;if(i===null||await e(i)===!1)return t();i.continue()}}),K1=(r,e,t,n="next")=>H1(r.openKeyCursor(e,n),s=>t(
s.key)),Q1=(r,e)=>r.objectStore(e),J1=(r,e)=>IDBKeyRange.upperBound(r,e),X1=(r,e)=>IDBKeyRange.lowerBound(r,e),tc="custo\
m",Qm="updates",Jm=500,Xm=(r,e=()=>{},t=()=>{})=>{const[n]=Is(r.db,[Qm]);return G1(n,X1(r._dbref,!1)).then(s=>{r._destroyed||
(e(n),pe(r.doc,()=>{s.forEach(i=>wo(r.doc,i))},r,!1),t(n))}).then(()=>V1(n).then(s=>{r._dbref=s+1})).then(()=>Hm(n).then(
s=>{r._dbsize=s})).then(()=>n)},Y1=(r,e=!0)=>Xm(r).then(t=>{(e||r._dbsize>=Jm)&&dl(t,xu(r.doc)).then(()=>Km(t,J1(r._dbref,
!0))).then(()=>Hm(t).then(n=>{r._dbsize=n}))});class Z1 extends ou{constructor(e,t){super(),this.doc=t,this.name=e,this.
_dbref=0,this._dbsize=0,this._destroyed=!1,this.db=null,this.synced=!1,this._db=F1(e,n=>z1(n,[["updates",{autoIncrement:!0}],
["custom"]])),this.whenSynced=qn(n=>this.on("synced",()=>n(this))),this._db.then(n=>{this.db=n,Xm(this,o=>dl(o,xu(t)),()=>{
if(this._destroyed)return this;this.synced=!0,this.emit("synced",[this])})}),this._storeTimeout=1e3,this._storeTimeoutId=
null,this._storeUpdate=(n,s)=>{if(this.db&&s!==this){const[i]=Is(this.db,[Qm]);dl(i,n),++this._dbsize>=Jm&&(this._storeTimeoutId!==
null&&clearTimeout(this._storeTimeoutId),this._storeTimeoutId=setTimeout(()=>{Y1(this,!1),this._storeTimeoutId=null},this.
_storeTimeout))}},t.on("update",this._storeUpdate),this.destroy=this.destroy.bind(this),t.on("destroy",this.destroy)}destroy(){
return this._storeTimeoutId&&clearTimeout(this._storeTimeoutId),this.doc.off("update",this._storeUpdate),this.doc.off("d\
estroy",this.destroy),this._destroyed=!0,this._db.then(e=>{e.close()})}clearData(){return this.destroy().then(()=>{O1(this.
name)})}get(e){return this._db.then(t=>{const[n]=Is(t,[tc],"readonly");return q1(n,e)})}set(e,t){return this._db.then(n=>{
const[s]=Is(n,[tc]);return j1(s,t,e)})}del(e){return this._db.then(t=>{const[n]=Is(t,[tc]);return Km(n,e)})}}const Qd="y\
js-update",Jd="yjs-sync-request",Xd="yjs-sync-response";function rc(r){return r instanceof Uint8Array?r:Array.isArray(r)?
new Uint8Array(r):r&&typeof r=="object"?new Uint8Array(Object.values(r)):new Uint8Array(0)}class ek extends ou{constructor(e,t,n={}){
super(),this.networkManager=e,this.doc=t,this.topic=n.topic||"peercompute-state-sync",this.peerId=n.peerId||e?.peerId||null,
this.initialSync=n.initialSync!==!1,this.syncRequestCounter=0,this.initialSyncTimer=null,this.awareness=null,this._onDocumentUpdate=
this._onDocumentUpdate.bind(this),this._onNetworkMessage=this._onNetworkMessage.bind(this),this.doc.on("update",this._onDocumentUpdate),
this.networkManager?.addMessageHandler&&this.networkManager.addMessageHandler(this._onNetworkMessage),this.initialSync&&
(this.initialSyncTimer=setTimeout(()=>{this.initialSyncTimer=null,this.requestSync().catch(s=>{console.error("[PeerCompu\
teProvider] Initial sync request failed",s)})},0)),console.log("[PeerComputeProvider] Initialized")}_getLocalPeerId(){return this.
peerId||this.networkManager?.peerId||this.networkManager?.getPeerId?.()||null}async requestSync(){if(typeof this.networkManager?.
broadcast!="function")return;const e=`${this._getLocalPeerId()||"peer"}:${Date.now()}:${++this.syncRequestCounter}`,t=O0(
this.doc);await this.networkManager.broadcast({type:Jd,data:{requestId:e,sourcePeerId:this._getLocalPeerId(),stateVector:Array.
from(t)}},{topic:this.topic})}async _sendSyncResponse(e,t={}){const n=rc(t.stateVector),s=xu(this.doc,n);if(s.byteLength===
0)return;const i={type:Xd,data:{requestId:t.requestId||null,sourcePeerId:this._getLocalPeerId(),targetPeerId:e||t.sourcePeerId||
null,update:Array.from(s)}};if(e&&typeof this.networkManager?.sendToPeer=="function"){await this.networkManager.sendToPeer(
e,i);return}typeof this.networkManager?.broadcast=="function"&&await this.networkManager.broadcast(i,{topic:this.topic})}_onDocumentUpdate(e,t){
if(t!==this){if(typeof this.networkManager?.broadcast!="function")return;this.networkManager.broadcast({type:Qd,data:Array.
from(e)},{topic:this.topic}).catch(n=>{console.error("[PeerComputeProvider] Broadcast failed",n)})}}_onNetworkMessage(e,t){
if(!(!t||e===this._getLocalPeerId())){if(t.type===Qd){const n=rc(t.data);n.byteLength>0&&wo(this.doc,n,this);return}if(t.
type===Jd){this._sendSyncResponse(e,t.data||{}).catch(n=>{console.error("[PeerComputeProvider] Sync response failed",n)});
return}if(t.type===Xd){const n=t.data?.targetPeerId||null,s=this._getLocalPeerId();if(n&&s&&n!==s)return;const i=rc(t.data?.
update);i.byteLength>0&&wo(this.doc,i,this)}}}destroy(){this.initialSyncTimer&&(clearTimeout(this.initialSyncTimer),this.
initialSyncTimer=null),this.doc.off("update",this._onDocumentUpdate),this.networkManager=null}}class tk{constructor({ydoc:e,
stateMap:t,hotStore:n,deltaNamespace:s="deltas"}={}){if(!e||!t)throw new Error("[DataState] ydoc and stateMap are requir\
ed");this.ydoc=e,this.state=t,this.hotStore=n||new Map,this.deltaNamespace=s,this.localArtifactCaches=new Map,this.artifactStores=
new Map}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new dr,this.state.set(e,t)),t}commitDelta(e={}){const t=e.
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
length)throw new AggregateError(t,"Artifact storage cleanup failed");this.artifactStores.clear()}}const Yd="peercompute.\
local-artifact.v1",rk="peercompute-local-artifacts-v1",qt="artifacts",nk=64,sk=32*1024*1024,ik=8*1024*1024,Zd=16*1024,eh=2048,
ok=96;function Dt(r,e,t){const n=new r(t);return n.code=e,n}function hl(){if(typeof DOMException=="function")return new DOMException(
"The operation was aborted.","AbortError");const r=new Error("The operation was aborted.");return r.name="AbortError",r}
function ls(r){if(r?.aborted)throw r.reason??hl()}function nc(r,e){if(!Number.isSafeInteger(r)||r<1)throw new RangeError(
`${e} must be a positive safe integer.`);return r}function Ii(r,e){if(!Number.isFinite(r)||r<0)throw new RangeError(`${e}\
 must be a finite non-negative timestamp.`);return r}function ak(r){const e=String(r??"").trim();if(!e||e.length>ok||!/^[a-z0-9][a-z0-9._-]*$/iu.
test(e))throw new TypeError("Local artifact cache name must be a short identifier containing letters, numbers, dot, dash\
, or underscore.");return e}function sc(r){const e=String(r??"");if(!e||e.length>eh)throw new TypeError(`Local artifact \
cache keys must contain 1-${eh} characters.`);return e}function Ym(r,e){const t=String(r??"").trim();if(!t||t.length>256)
throw new TypeError(`${e} must be a non-empty string of at most 256 characters.`);return t}function ck(r){const e=Ym(r,"\
mediaType").split(";",1)[0].trim().toLowerCase();if(!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(e))throw new TypeError(
"mediaType must be a valid MIME type.");return e}function th(r){if(r instanceof Uint8Array)return r.slice();if(r instanceof
ArrayBuffer)return new Uint8Array(r.slice(0));if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength).
slice();throw new TypeError("Local artifact cache values must contain ArrayBuffer or typed-array bytes.")}function Cs(r={}){
if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError("Local artifact metadata must be an object.");let e;try{
e=JSON.stringify(r)}catch{throw new TypeError("Local artifact metadata must be JSON-serializable.")}e===void 0&&(e="{}");
const t=new TextEncoder().encode(e).byteLength;if(t>Zd)throw Dt(RangeError,"ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE",`Loca\
l artifact metadata exceeds the ${Zd}-byte cap.`);const n=JSON.parse(e);if(!n||typeof n!="object"||Array.isArray(n))throw new TypeError(
"Local artifact metadata must serialize to an object.");return{metadata:n,byteLength:t}}async function rh(r){if(!globalThis.
crypto?.subtle?.digest)throw Dt(Error,"ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE","SHA-256 is unavailable; local artifacts can\
not be admitted without integrity metadata.");const e=await globalThis.crypto.subtle.digest("SHA-256",r);return`sha256:${Array.
from(new Uint8Array(e),t=>t.toString(16).padStart(2,"0")).join("")}`}function fl(r){return Object.freeze(Cs(r).metadata)}
function Ci(r,e,t={}){return Object.freeze({bytes:r.bytes.slice(),metadata:fl(r.metadata),cacheStatus:e,...t})}function ic(r){
return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error??new Error("IndexedDB request failed."))})}
function Ti(r){return new Promise((e,t)=>{r.oncomplete=()=>e(),r.onerror=()=>t(r.error??new Error("IndexedDB transaction\
 failed.")),r.onabort=()=>t(r.error??new Error("IndexedDB transaction aborted."))})}function oc(r,e){return`${r}\0${e}`}
class lk{constructor({name:e,maximumEntries:t=nk,maximumBytes:n=sk,maximumEntryBytes:s=Math.min(ik,n),persistent:i=!0,clock:o=Date.
now,indexedDBImpl:a=globalThis.indexedDB,onDestroy:c=null}={}){if(this.name=ak(e),this.maximumEntries=nc(t,"maximumEntri\
es"),this.maximumBytes=nc(n,"maximumBytes"),this.maximumEntryBytes=nc(s,"maximumEntryBytes"),this.maximumEntryBytes>this.
maximumBytes)throw new RangeError("maximumEntryBytes must not exceed maximumBytes.");if(typeof o!="function")throw new TypeError(
"clock must be a function.");if(c!==null&&typeof c!="function")throw new TypeError("onDestroy must be a function or null\
.");this.clock=o,this.indexedDB=a,this.persistenceConfigured=i===!0,this.persistenceAvailable=this.persistenceConfigured&&
typeof a?.open=="function",this.onDestroy=c,this.entries=new Map,this.inflight=new Map,this.residentBytes=0,this.reservedBytes=
0,this.databasePromise=null,this.database=null,this.persistenceQueue=Promise.resolve(),this.destroyed=!1,this.generation=
0,this.counters={hits:0,misses:0,coalesced:0,stale:0,evictions:0,rejected:0,validationFailures:0,persistenceFailures:0}}#e(){
if(this.destroyed)throw Dt(Error,"ERR_LOCAL_ARTIFACT_CACHE_DESTROYED","Local artifact cache is destroyed.")}#r(e,t){t.metadata.
accessedAt=this.clock(),this.entries.delete(e),this.entries.set(e,t)}#n(e,{eviction:t=!1}={}){const n=this.entries.get(e);
return n?(this.entries.delete(e),this.residentBytes=Math.max(0,this.residentBytes-n.storageBytes),t&&(this.counters.evictions+=
1),!0):!1}#d({key:e,entryBytes:t=null,reservationBytes:n=0}={}){const s=this.entries.get(e),i=s?.storageBytes??0,o=()=>{
const a=t!==null,c=this.entries.size+(a&&!s?1:0),l=a?this.residentBytes-i+t+this.reservedBytes+n:this.residentBytes+this.
reservedBytes+n;return c>this.maximumEntries||l>this.maximumBytes};for(;o();){let a=!1;for(const c of this.entries.keys())
if(c!==e){this.#n(c,{eviction:!0}),a=!0;break}if(!a)return!1}return!0}#p(e,t){return t.storageBytes>this.maximumEntryBytes||
t.bytes.byteLength>this.maximumEntryBytes?(this.counters.rejected+=1,!1):this.#d({key:e,entryBytes:t.storageBytes})?(this.#n(
e),this.entries.set(e,t),this.residentBytes+=t.storageBytes,!0):(this.counters.rejected+=1,!1)}#b(e){const t=this.entries.
get(e)?.storageBytes??0,n=Math.max(0,this.maximumEntryBytes-Math.min(t,this.maximumEntryBytes));if(this.inflight.size>=this.
maximumEntries||!this.#d({key:e,reservationBytes:n}))throw this.counters.rejected+=1,Dt(Error,"ERR_LOCAL_ARTIFACT_CACHE_\
BUSY","Local artifact cache has no bounded capacity for another in-flight load.");return this.reservedBytes+=n,n}#u(e){this.
reservedBytes=Math.max(0,this.reservedBytes-e)}async#h(){return!this.persistenceAvailable||this.destroyed?null:this.database?
this.database:(this.databasePromise||(this.databasePromise=new Promise((e,t)=>{let n;try{n=this.indexedDB.open(rk,1)}catch(s){
t(s);return}n.onupgradeneeded=()=>{const s=n.result;s.objectStoreNames.contains(qt)||s.createObjectStore(qt,{keyPath:"id"})},
n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??new Error("Unable to open the local artifact database.")),n.onblocked=
()=>t(new Error("Opening the local artifact database was blocked."))}).then(e=>(this.database=e,e.onversionchange=()=>{e.
close(),this.database===e&&(this.database=null)},e)).catch(e=>(this.#a(e),null))),this.databasePromise)}#a(e){this.persistenceAvailable&&
(this.counters.persistenceFailures+=1),this.persistenceAvailable=!1;try{this.database?.close?.()}catch{}this.database=null}async#f(e){
const t=await this.#h();if(!t)return null;let n;try{const s=t.transaction(qt,"readonly"),i=Ti(s);i.catch(()=>{});const o=s.
objectStore(qt).get(oc(this.name,e));n=await ic(o),await i}catch(s){return this.#a(s),null}if(!n||n.cacheName!==this.name||
n.key!==e)return null;try{return{bytes:th(n.bytes),metadata:Cs(n.metadata).metadata,storageBytes:Number(n.storageBytes)}}catch{
return{bytes:null,metadata:null,storageBytes:Number.NaN}}}async#c(e,t){const n=await this.#h();if(n)try{const s=n.transaction(
qt,"readwrite"),i=Ti(s);i.catch(()=>{});const o=s.objectStore(qt);o.put({id:oc(this.name,e),cacheName:this.name,key:e,bytes:t.
bytes.slice(),metadata:Cs(t.metadata).metadata,storageBytes:t.storageBytes});const c=(await ic(o.getAll())).filter(u=>u?.
cacheName===this.name).sort((u,d)=>Number(u.metadata?.accessedAt??0)-Number(d.metadata?.accessedAt??0)||String(u.id).localeCompare(
String(d.id)));let l=c.reduce((u,d)=>{const h=Number(d.storageBytes);return u+(Number.isSafeInteger(h)&&h>=0?h:this.maximumBytes+
1)},0);for(;c.length>this.maximumEntries||l>this.maximumBytes;){const u=c.shift();if(!u)break;const d=Number(u.storageBytes);
l-=Number.isSafeInteger(d)&&d>=0?d:this.maximumBytes+1,o.delete(u.id)}await i}catch(s){this.#a(s)}}async#i(e){const t=await this.#h();
if(t)try{const n=t.transaction(qt,"readwrite"),s=Ti(n);s.catch(()=>{}),n.objectStore(qt).delete(oc(this.name,e)),await s}catch(n){
this.#a(n)}}async#o(){const e=await this.#h();if(e)try{const t=e.transaction(qt,"readwrite"),n=Ti(t);n.catch(()=>{});const s=t.
objectStore(qt),i=await ic(s.getAll());for(const o of i)o?.cacheName===this.name&&s.delete(o.id);await n}catch(t){this.#a(
t)}}#t(e){if(!this.persistenceAvailable)return Promise.resolve();const t=this.persistenceQueue.then(e,e);return this.persistenceQueue=
t.catch(()=>{}),t}async#w(e,t){const n=e?.metadata;if(!e?.bytes||n?.schema!==Yd||e.bytes.byteLength>this.maximumEntryBytes||
!Number.isSafeInteger(e.storageBytes)||e.storageBytes!==e.bytes.byteLength||e.storageBytes>this.maximumBytes||!Number.isFinite(
n.byteLength)||n.byteLength!==e.bytes.byteLength||typeof n.sha256!="string"||typeof n.sourceId!="string"||typeof n.mediaType!=
"string"||!Number.isFinite(n.freshUntil)||!Number.isFinite(n.staleUntil)||n.staleUntil<n.freshUntil)throw Dt(Error,"ERR_\
LOCAL_ARTIFACT_SCHEMA","Local artifact metadata is invalid.");if(await rh(e.bytes)!==n.sha256)throw Dt(Error,"ERR_LOCAL_\
ARTIFACT_INTEGRITY","Local artifact SHA-256 does not match its bytes.");if(t&&await t(e.bytes.slice(),fl(n))===!1)throw Dt(
Error,"ERR_LOCAL_ARTIFACT_VALIDATION","Local artifact validator rejected the bytes.");return e}async#s(e,{allowStale:t=!1,
validate:n,sourceId:s,mediaType:i}={}){let o=this.entries.get(e)??null,a=!1;if(o||(o=await this.#f(e),a=!!o),!o)return null;
try{if(s&&o.metadata.sourceId!==s)throw Dt(Error,"ERR_LOCAL_ARTIFACT_SOURCE","Local artifact source identifier does not \
match.");if(i&&o.metadata.mediaType!==i)throw Dt(Error,"ERR_LOCAL_ARTIFACT_MEDIA_TYPE","Local artifact media type does n\
ot match.");a&&await this.#w(o,n)}catch{return this.counters.validationFailures+=1,this.#n(e),await this.#t(()=>this.#i(
e)),null}const c=this.clock();if(c>o.metadata.staleUntil)return this.#n(e),await this.#t(()=>this.#i(e)),null;const l=c<
o.metadata.freshUntil;return!l&&!t?null:(a&&this.#p(e,o),this.entries.has(e)&&this.#r(e,o),this.#t(()=>this.#c(e,o)),{entry:o,
fresh:l})}async read(e,{validate:t,allowStale:n=!1,signal:s}={}){this.#e();const i=sc(e);if(t!==void 0&&typeof t!="funct\
ion")throw new TypeError("validate must be a function.");ls(s);const o=await this.#s(i,{allowStale:n,validate:t});return ls(
s),o?(o.fresh?this.counters.hits+=1:this.counters.stale+=1,Ci(o.entry,o.fresh?"hit":"stale")):null}async#m({bytes:e,metadata:t={}},n){
const s=th(e);if(s.byteLength>this.maximumEntryBytes)throw this.counters.rejected+=1,Dt(RangeError,"ERR_LOCAL_ARTIFACT_E\
NTRY_TOO_LARGE",`Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`);const{metadata:i}=Cs(t),o=this.clock(),
a=Ii(n.freshUntil,"freshUntil"),c=Ii(n.staleUntil,"staleUntil");if(c<a)throw new RangeError("staleUntil must be greater \
than or equal to freshUntil.");const l=Number.isFinite(i.freshUntil)?i.freshUntil:a,u=Number.isFinite(i.staleUntil)?i.staleUntil:
c,d=Math.min(c,u),h=Math.min(a,l,d),p=await rh(s),m={...i,schema:Yd,sourceId:n.sourceId,mediaType:n.mediaType,byteLength:s.
byteLength,sha256:p,createdAt:o,accessedAt:o,freshUntil:h,staleUntil:d},y=Cs(m),g={bytes:s,metadata:y.metadata,storageBytes:s.
byteLength};if(n.validate)try{if(await n.validate(s.slice(),fl(g.metadata))===!1)throw Dt(Error,"ERR_LOCAL_ARTIFACT_VALI\
DATION","Local artifact validator rejected the bytes.")}catch(f){throw this.counters.validationFailures+=1,f}return g}#l(e,t,n){
ls(t);const s={};return e.subscribers.add(s),n&&(this.counters.coalesced+=1),new Promise((i,o)=>{let a=!1;const c=()=>{a||
(a=!0,t?.removeEventListener?.("abort",l),e.subscribers.delete(s))},l=()=>{c(),!e.settled&&e.subscribers.size===0&&e.controller.
abort(),o(t.reason??hl())};t?.addEventListener?.("abort",l,{once:!0}),e.promise.then(u=>{c(),i(n?Object.freeze({...u,cacheStatus:"\
coalesced"}):u)},u=>{c(),o(u)})})}async getOrLoad({key:e,sourceId:t,mediaType:n,freshUntil:s,staleUntil:i,signal:o,loader:a,
validate:c}={}){this.#e();const l=sc(e),u=Ym(t,"sourceId"),d=ck(n);if(typeof a!="function")throw new TypeError("loader m\
ust be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("validate must be a function.");if(Ii(s,"fr\
eshUntil"),Ii(i,"staleUntil"),i<s)throw new RangeError("staleUntil must be greater than or equal to freshUntil.");ls(o);
let h=this.inflight.get(l);if(h)return this.#l(h,o,!0);const p=await this.#s(l,{allowStale:!0,validate:c,sourceId:u,mediaType:d});
if(ls(o),p?.fresh)return this.counters.hits+=1,Ci(p.entry,"hit");if(h=this.inflight.get(l),h)return this.#l(h,o,!0);const m=this.#b(
l),y=this.generation,g=new AbortController,f={controller:g,subscribers:new Set,settled:!1,invalidated:!1,promise:null};let b=!1;
return f.promise=Promise.resolve().then(()=>a({signal:g.signal,maximumBytes:this.maximumEntryBytes})).then(w=>{if(g.signal.
aborted)throw g.signal.reason??hl();const E=w&&typeof w=="object"&&"bytes"in w?w:{bytes:w,metadata:{}};return this.#m(E,
{sourceId:u,mediaType:d,freshUntil:s,staleUntil:i,validate:c})}).then(async w=>(this.#u(m),b=!0,!g.signal.aborted&&!f.invalidated&&
!this.destroyed&&y===this.generation&&(this.#p(l,w),this.entries.get(l)===w&&await this.#t(()=>this.#c(l,w))),this.counters.
misses+=1,Ci(w,"miss"))).catch(w=>{if(p&&this.clock()<=p.entry.metadata.staleUntil)return this.counters.stale+=1,Ci(p.entry,
"stale",{refreshErrorCode:typeof w?.code=="string"?w.code:"UPSTREAM_REFRESH_FAILED"});throw w}).finally(()=>{f.settled=!0,
b||this.#u(m),this.inflight.get(l)===f&&this.inflight.delete(l)}),this.inflight.set(l,f),this.#l(f,o,!1)}async delete(e){
this.#e();const t=sc(e),n=this.inflight.get(t);n&&(n.invalidated=!0),n?.controller.abort(),this.#n(t),await this.#t(()=>this.#i(
t))}async clear(){this.#e(),this.generation+=1;for(const e of this.inflight.values())e.invalidated=!0,e.controller.abort();
this.entries.clear(),this.residentBytes=0,await this.#t(()=>this.#o())}getStats(){const e=this.clock();let t=0,n=0;for(const s of this.
entries.values())e<s.metadata.freshUntil?t+=1:e<=s.metadata.staleUntil&&(n+=1);return Object.freeze({schema:"peercompute\
.local-artifact-cache-stats.v1",entries:this.entries.size,freshEntries:t,staleEntries:n,residentBytes:this.residentBytes,
maximumEntries:this.maximumEntries,maximumBytes:this.maximumBytes,maximumEntryBytes:this.maximumEntryBytes,pending:this.
inflight.size,reservedBytes:this.reservedBytes,persistenceConfigured:this.persistenceConfigured,persistenceAvailable:this.
persistenceAvailable,...this.counters})}async destroy(){if(!this.destroyed){this.destroyed=!0,this.generation+=1;for(const e of this.
inflight.values())e.invalidated=!0,e.controller.abort();await Promise.allSettled([...this.inflight.values()].map(e=>e.promise)),
await this.persistenceQueue.catch(()=>{}),this.entries.clear(),this.inflight.clear(),this.residentBytes=0,this.reservedBytes=
0;try{this.database?.close?.()}catch{}this.database=null,this.onDestroy?.(this),this.onDestroy=null}}}function uk(r,e){if(r===
e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Mu(r){
if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Xs(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return Xs(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function dk(r){return r?.buffer instanceof ArrayBuffer}function Xs(r){return dk(r)?r:r.slice()}function hk(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===0;)E++,
b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>
0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;for(var T=d.
repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.length-b)*h+
1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&C!==-1;C--,x++)
k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){for(var I=v-E;I!==
v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var fk=hk,pk=fk;let mk=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},gk=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Zm(this,e)}},
bk=class{decoders;constructor(e){this.decoders=e}or(e){return Zm(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Zm(r,e){return new bk({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let yk=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new mk(e,t,n),this.decoder=new gk(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function eg({name:r,prefix:e,encode:t,decode:n}){return new yk(r,e,t,
n)}function xa({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=pk(t,r,n);return eg({prefix:e,
name:r,encode:s,decode:o=>Mu(i(o))})}function wk(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function kk(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function Ek(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function gr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=Ek(n,s);return eg(
{prefix:e,name:r,encode(o){return kk(o,n,t)},decode(o){return wk(o,i,t,r)}})}const Yi=gr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});gr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});gr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});gr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const ac=xa(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});xa({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Pr=xa({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});xa({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var xk=tg,nh=128,vk=-128,Sk=Math.pow(2,31);function tg(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=Sk;)e[t++]=r&255|nh,r/=128;for(;r&vk;)e[t++]=r&255|nh,r>>>=7;return e[t]=r|0,tg.bytes=t-n+1,e}var Ak=pl,
_k=128,sh=127;function pl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw pl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&sh)<<s:(o&sh)*Math.pow(2,s),s+=7}while(o>=_k);return pl.bytes=i-n,t}var Ik=Math.pow(
2,7),Ck=Math.pow(2,14),Tk=Math.pow(2,21),Mk=Math.pow(2,28),Rk=Math.pow(2,35),Bk=Math.pow(2,42),Lk=Math.pow(2,49),Dk=Math.
pow(2,56),Pk=Math.pow(2,63),$k=function(r){return r<Ik?1:r<Ck?2:r<Tk?3:r<Mk?4:r<Rk?5:r<Bk?6:r<Lk?7:r<Dk?8:r<Pk?9:10},Nk={
encode:xk,decode:Ak,encodingLength:$k},Io=Nk;function ml(r,e=0){const t=Io.decode(r,e),n=Io.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Co(r,e,t=0){return Io.encode(r,e,t),e}function To(r){return Io.encodingLength(r)}function rg(r,e){const t=e.
byteLength,n=To(r),s=n+To(t),i=new Uint8Array(s+t);return Co(r,i,0),Co(t,i,n),i.set(e,s),new Ru(r,t,e,i)}function Uk(r){
const e=Mu(r),[t,n]=ml(e),[s,i]=ml(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Ru(t,s,o,e)}function Fk(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&uk(r.bytes,t.bytes)}}let Ru=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
Xs(n),this.bytes=Xs(s)}};function ih(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return zk(t,gl(r),e??Pr.encoder);default:
return qk(t,gl(r),e??Yi.encoder)}}const oh=new WeakMap;function gl(r){const e=oh.get(r);if(e==null){const t=new Map;return oh.
set(r,t),t}return e}let Vn=class je{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=Xs(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
us)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==jk)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return je.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=rg(e,
t);return je.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return je.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&Fk(e.multihash,n.multihash)}toString(e){return ih(this,e)}toJSON(){return{"/":ih(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof je)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new je(n,s,i,o??ah(n,s,i.bytes))}else if(t[Gk]===!0){const{version:n,
multihash:s,code:i}=t,o=Uk(s);return je.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==us)throw new Error(`Version 0 CID must use dag-pb (code: ${us}) block encoding`);return new je(e,t,n,n.bytes)}case 1:{
const s=ah(e,t,n.bytes);return new je(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return je.
create(0,us,e)}static createV1(e,t){return je.create(1,e,t)}static decode(e){const[t,n]=je.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=je.inspectBytes(e),n=t.size-t.multihashSize,
s=Mu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Ru(t.multihashCode,t.digestSize,i,s);return[t.version===0?je.createV0(o):je.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=ml(e.subarray(t));return t+=h,d};let s=n(),
i=us;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=Ok(e,t),
i=je.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return gl(
i).set(n,e),i}};function Ok(r,e){switch(r[0]){case"Q":{const t=e??Pr;return[Pr.prefix,t.decode(`${Pr.prefix}${r}`)]}case Pr.
prefix:{const t=e??Pr;return[Pr.prefix,t.decode(r)]}case Yi.prefix:{const t=e??Yi;return[Yi.prefix,t.decode(r)]}case ac.
prefix:{const t=e??ac;return[ac.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function zk(r,e,t){const{prefix:n}=t;if(n!==
Pr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function qk(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const us=112,jk=18;function ah(r,e,t){const n=To(r),s=n+To(e),i=new Uint8Array(s+t.
byteLength);return Co(r,i,0),Co(e,i,n),i.set(t,s),i}const Gk=Symbol.for("@ipld/js-cid/CID"),Wk=20;function Vk({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new Hk(r,e,t,n,s)}let Hk=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??Wk,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
ch(n,this.code,t?.truncate):n.then(s=>ch(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function ch(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return rg(e,r)}function Kk(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const lh=Vk({name:"sha2-256",code:18,encode:Kk("SHA-256")}),Qk=r=>r/2**32|0,Jk=r=>r>>>0;function Xk(r,e,t,n){
const s=Qk(t),i=Jk(t);r.setUint32(e,n?i:s,n),r.setUint32(e+4,n?s:i,n)}function uh(r){return r instanceof Uint8Array||ArrayBuffer.
isView(r)&&r.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in r&&r.BYTES_PER_ELEMENT===1}const Yk=r=>r?`"${r}" `:"";
function Bu(r,e,t=""){if(uh(r)&&e===void 0)return r;const n=uh(r),s="",i=n?`length=${r.length}`:`type=${typeof r}`,o=Yk(
t)+"expected Uint8Array"+s+", got "+i;throw n?new RangeError(o):new TypeError(o)}const Zk=(r,e)=>{if(r===null||typeof r!=
"object"||Array.isArray(r))throw new TypeError((e==="object"?"":`"${e}" `)+"expected object, got type="+typeof r)},dh=(r,e)=>{
Zk(r,e);const t=Object.getPrototypeOf(r);if(t!==Object.prototype&&t!==null)throw new TypeError(`"${e}" expected plain ob\
ject`);if(Object.hasOwn(r,"__proto__"))throw new TypeError(`"${e}.__proto__" is not allowed`)};function hh(r,e=!0){if(r.
destroyed)throw new Error("hash was destroyed");if(e&&r.finished)throw new Error("digest() was already called")}function eE(r,e){
Bu(r,void 0,"output");const t=e.outputLen;if(!(r.length>=t))throw new RangeError('"output" expected length >= '+t)}function fh(...r){
for(let e=0;e<r.length;e++)r[e].fill(0)}function cc(r){return new DataView(r.buffer,r.byteOffset,r.byteLength)}function jt(r,e){
return r<<32-e|r>>>e}const tE=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",rE=Array.
from({length:256},(r,e)=>e.toString(16).padStart(2,"0"));function MR(r){if(Bu(r),tE)return r.toHex();let e="";for(let t=0;t<
r.length;t++)e+=rE[r[t]];return e}function nE(r,e,t="opts"){return dh(r,"defaults"),e!==void 0&&dh(e,t),Object.assign(Object.
create(null),r,e)}function sE(r,e={}){if(typeof r!="function")throw new TypeError('"hashCons" expected function, got typ\
e='+typeof r);e=nE({},e,"info");const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=
n.blockLen,t.canXOF=n.canXOF,t.create=s=>r(s),Object.assign(t,e),Object.freeze(t)}const iE=r=>({oid:Uint8Array.from([6,9,
96,134,72,1,101,3,4,2,r])});function oE(r,e,t){return r&e^~r&t}function aE(r,e,t){return r&e^r&t^e&t}let cE=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=cc(this.buffer)}update(e){
hh(this),Bu(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;let o=!1;for(let a=0;a<i;){const c=Math.min(s-this.pos,
i-a);if(c===s){const l=cc(e);for(;s<=i-a;a+=s)this.process(l,a);o=!0;continue}n.set(a===0&&c===i?e:e.subarray(a,a+c),this.
pos),this.pos+=c,a+=c,this.pos===s&&(this.process(t,0),this.pos=0,o=!0)}return this.length+=e.length,o&&this.roundClean(),
this}digestInto(e){hh(this),eE(e,this),this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=
128,t.fill(0,o),this.padOffset>s-o&&(this.process(n,0),t.fill(0)),Xk(n,s-8,this.length*8,i),this.process(n,0),this.roundClean();
const a=e===t?n:cc(e),c=this.outputLen,l=c/4,u=this.get();if(c%4||l>u.length)throw new Error("invalid outputLen");for(let d=0;d<
l;d++)a.setUint32(4*d,u[d],i)}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.
destroy(),n}_cloneIntoMeta(e){const{buffer:t,length:n,finished:s,destroyed:i,pos:o}=this;return e.destroyed=i,e.finished=
s,e.length=n,e.pos=o,o&&e.buffer.set(t),e}clone(){return this._cloneInto()}};const lE=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),uE=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),xr=new Uint32Array(64);let dE=class extends cE{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,
8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){
const{A:e,B:t,C:n,D:s,E:i,F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|
0,this.D=s|0,this.E=i|0,this.F=o|0,this.G=a|0,this.H=c|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),
this._cloneIntoMeta(e)}process(e,t){for(let d=0;d<16;d++,t+=4)xr[d]=e.getUint32(t,!1);for(let d=16;d<64;d++){const h=xr[d-
15],p=xr[d-2],m=jt(h,7)^jt(h,18)^h>>>3,y=jt(p,17)^jt(p,19)^p>>>10;xr[d]=y+xr[d-7]+m+xr[d-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let d=0;d<64;d++){const h=jt(a,6)^jt(a,11)^jt(a,25),p=u+h+oE(a,c,l)+uE[d]+xr[d]|0,y=(jt(n,2)^jt(n,13)^
jt(n,22))+aE(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){fh(xr)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),fh(this.buffer)}},hE=class extends dE{constructor(){super(32,lE)}};const ph=sE(()=>new hE,iE(1));function fE(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
function Lu(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Ys(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return Ys(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function pE(r){return r?.buffer instanceof ArrayBuffer}function Ys(r){return pE(r)?r:r.slice()}function mE(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===0;)E++,
b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>
0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;for(var T=d.
repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.length-b)*h+
1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&C!==-1;C--,x++)
k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){for(var I=v-E;I!==
v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var gE=mE,bE=gE;let yE=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},wE=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ng(this,e)}},
kE=class{decoders;constructor(e){this.decoders=e}or(e){return ng(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function ng(r,e){return new kE({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let EE=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new yE(e,t,n),this.decoder=new wE(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function sg({name:r,prefix:e,encode:t,decode:n}){return new EE(r,e,t,
n)}function va({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=bE(t,r,n);return sg({prefix:e,
name:r,encode:s,decode:o=>Lu(i(o))})}function xE(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function vE(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function SE(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function br({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=SE(n,s);return sg(
{prefix:e,name:r,encode(o){return vE(o,n,t)},decode(o){return xE(o,i,t,r)}})}const Zi=br({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});br({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});br({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});br({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});br({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});br({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});br({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});br({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});br({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const lc=va(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});va({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const $r=va({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});va({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var AE=ig,mh=128,_E=-128,IE=Math.pow(2,31);function ig(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=IE;)e[t++]=r&255|mh,r/=128;for(;r&_E;)e[t++]=r&255|mh,r>>>=7;return e[t]=r|0,ig.bytes=t-n+1,e}var CE=bl,
TE=128,gh=127;function bl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw bl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&gh)<<s:(o&gh)*Math.pow(2,s),s+=7}while(o>=TE);return bl.bytes=i-n,t}var ME=Math.pow(
2,7),RE=Math.pow(2,14),BE=Math.pow(2,21),LE=Math.pow(2,28),DE=Math.pow(2,35),PE=Math.pow(2,42),$E=Math.pow(2,49),NE=Math.
pow(2,56),UE=Math.pow(2,63),FE=function(r){return r<ME?1:r<RE?2:r<BE?3:r<LE?4:r<DE?5:r<PE?6:r<$E?7:r<NE?8:r<UE?9:10},OE={
encode:AE,decode:CE,encodingLength:FE},Mo=OE;function yl(r,e=0){const t=Mo.decode(r,e),n=Mo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Ro(r,e,t=0){return Mo.encode(r,e,t),e}function Bo(r){return Mo.encodingLength(r)}function zE(r,e){const t=e.
byteLength,n=Bo(r),s=n+Bo(t),i=new Uint8Array(s+t);return Ro(r,i,0),Ro(t,i,n),i.set(e,s),new Du(r,t,e,i)}function qE(r){
const e=Lu(r),[t,n]=yl(e),[s,i]=yl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Du(t,s,o,e)}function jE(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&fE(r.bytes,t.bytes)}}let Du=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
Ys(n),this.bytes=Ys(s)}};function bh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return WE(t,wl(r),e??$r.encoder);default:
return VE(t,wl(r),e??Zi.encoder)}}const yh=new WeakMap;function wl(r){const e=yh.get(r);if(e==null){const t=new Map;return yh.
set(r,t),t}return e}let Ts=class Ge{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=Ys(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ds)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==HE)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ge.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=zE(e,
t);return Ge.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ge.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&jE(e.multihash,n.multihash)}toString(e){return bh(this,e)}toJSON(){return{"/":bh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ge)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ge(n,s,i,o??wh(n,s,i.bytes))}else if(t[KE]===!0){const{version:n,
multihash:s,code:i}=t,o=qE(s);return Ge.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ds)throw new Error(`Version 0 CID must use dag-pb (code: ${ds}) block encoding`);return new Ge(e,t,n,n.bytes)}case 1:{
const s=wh(e,t,n.bytes);return new Ge(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ge.
create(0,ds,e)}static createV1(e,t){return Ge.create(1,e,t)}static decode(e){const[t,n]=Ge.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ge.inspectBytes(e),n=t.size-t.multihashSize,
s=Lu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Du(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ge.createV0(o):Ge.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=yl(e.subarray(t));return t+=h,d};let s=n(),
i=ds;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=GE(e,t),
i=Ge.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return wl(
i).set(n,e),i}};function GE(r,e){switch(r[0]){case"Q":{const t=e??$r;return[$r.prefix,t.decode(`${$r.prefix}${r}`)]}case $r.
prefix:{const t=e??$r;return[$r.prefix,t.decode(r)]}case Zi.prefix:{const t=e??Zi;return[Zi.prefix,t.decode(r)]}case lc.
prefix:{const t=e??lc;return[lc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function WE(r,e,t){const{prefix:n}=t;if(n!==
$r.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function VE(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ds=112,HE=18;function wh(r,e,t){const n=Bo(r),s=n+Bo(e),i=new Uint8Array(s+t.
byteLength);return Ro(r,i,0),Ro(e,i,n),i.set(t,s),i}const KE=Symbol.for("@ipld/js-cid/CID"),QE=new TextDecoder;function Pu(r,e){
let t=0;for(let n=0;;n+=7){if(n>=64)throw new Error("protobuf: varint overflow");if(e>=r.length)throw new Error("protobu\
f: unexpected end of data");const s=r[e++];if(t+=n<28?(s&127)<<n:(s&127)*2**n,s<128)break}return[t,e]}function Lo(r,e){let t;
[t,e]=Pu(r,e);const n=e+t;if(t<0||n<0)throw new Error("protobuf: invalid length");if(n>r.length)throw new Error("protobu\
f: unexpected end of data");return[r.subarray(e,n),n]}function og(r,e){let t;return[t,e]=Pu(r,e),[t&7,t>>3,e]}function JE(r){
const e={},t=r.length;let n=0;for(;n<t;){let s,i;if([s,i,n]=og(r,n),i===1){if(e.Hash)throw new Error("protobuf: (PBLink)\
 duplicate Hash section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Hash`);if(e.Name!==void 0)
throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");if(e.Tsize!==void 0)throw new Error("protobu\
f: (PBLink) invalid order, found Tsize before Hash");[e.Hash,n]=Lo(r,n)}else if(i===2){if(e.Name!==void 0)throw new Error(
"protobuf: (PBLink) duplicate Name section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Name`);
if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");let o;[o,n]=Lo(r,n),e.Name=
QE.decode(o)}else if(i===3){if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) duplicate Tsize section");if(s!==0)throw new Error(
`protobuf: (PBLink) wrong wireType (${s}) for Tsize`);[e.Tsize,n]=Pu(r,n)}else throw new Error(`protobuf: (PBLink) inval\
id fieldNumber, expected 1, 2 or 3, got ${i}`)}if(n>t)throw new Error("protobuf: (PBLink) unexpected end of data");return e}
function XE(r){const e=r.length;let t=0,n,s=!1,i;for(;t<e;){let a,c;if([a,c,t]=og(r,t),a!==2)throw new Error(`protobuf: \
(PBNode) invalid wireType, expected 2, got ${a}`);if(c===1){if(i)throw new Error("protobuf: (PBNode) duplicate Data sect\
ion");[i,t]=Lo(r,t),n&&(s=!0)}else if(c===2){if(s)throw new Error("protobuf: (PBNode) duplicate Links section");n||(n=[]);
let l;[l,t]=Lo(r,t),n.push(JE(l))}else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${c}`)}
if(t>e)throw new Error("protobuf: (PBNode) unexpected end of data");const o={};return i&&(o.Data=i),o.Links=n||[],o}const ag=new TextEncoder,
kh=2**32,YE=2**31;function ZE(r,e){let t=e.length;if(typeof r.Tsize=="number"){if(r.Tsize<0)throw new Error("Tsize canno\
t be negative");if(!Number.isSafeInteger(r.Tsize))throw new Error("Tsize too large for encoding");t=Ds(e,t,r.Tsize)-1,e[t]=
24}if(typeof r.Name=="string"){const n=ag.encode(r.Name);t-=n.length,e.set(n,t),t=Ds(e,t,n.length)-1,e[t]=18}return r.Hash&&
(t-=r.Hash.length,e.set(r.Hash,t),t=Ds(e,t,r.Hash.length)-1,e[t]=10),e.length-t}function Eh(r,e,t){return r-=e.Data.length,
t.set(e.Data,r),r=Ds(t,r,e.Data.length)-1,t[r]=10,r}function ex(r,e){const t=rx(r),n=new Uint8Array(t);let s=t;const i=e?.
fieldOrder==="data-first"?e.fieldOrder:"links-first";if(r.Data&&i==="links-first"&&(s=Eh(s,r,n)),r.Links)for(let o=r.Links.
length-1;o>=0;o--){const a=ZE(r.Links[o],n.subarray(0,s));s-=a,s=Ds(n,s,a)-1,n[s]=18}return r.Data&&i==="data-first"&&(s=
Eh(s,r,n)),n}function tx(r){let e=0;if(r.Hash){const t=r.Hash.length;e+=1+t+Dn(t)}if(typeof r.Name=="string"){const t=ag.
encode(r.Name).length;e+=1+t+Dn(t)}return typeof r.Tsize=="number"&&(e+=1+Dn(r.Tsize)),e}function rx(r){let e=0;if(r.Data){
const t=r.Data.length;e+=1+t+Dn(t)}if(r.Links)for(const t of r.Links){const n=tx(t);e+=1+n+Dn(n)}return e}function Ds(r,e,t){
e-=Dn(t);const n=e;for(;t>=YE;)r[e++]=t&127|128,t/=128;for(;t>=128;)r[e++]=t&127|128,t>>>=7;return r[e]=t,n}function Dn(r){
return r%2===0&&r++,Math.floor((nx(r)+6)/7)}function nx(r){let e=0;return r>=kh&&(r=Math.floor(r/kh),e=32),r>=65536&&(r>>>=
16,e+=16),r>=256&&(r>>>=8,e+=8),e+sx[r]}const sx=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],ix=["Data","Links"],ox=["Hash","Name",
"Tsize"],kl=new TextEncoder;function cg(r,e){if(r===e)return 0;const t=r.Name?kl.encode(r.Name):[],n=e.Name?kl.encode(e.
Name):[];let s=t.length,i=n.length;for(let o=0,a=Math.min(s,i);o<a;++o)if(t[o]!==n[o]){s=t[o],i=n[o];break}return s<i?-1:
i<s?1:0}function xh(r,e){return!Object.keys(r).some(t=>!e.includes(t))}function lg(r){if(typeof r.asCID=="object"){const t=Ts.
asCID(r);if(!t)throw new TypeError("Invalid DAG-PB form");return{Hash:t}}if(typeof r!="object"||Array.isArray(r))throw new TypeError(
"Invalid DAG-PB form");const e={};if(r.Hash){let t=Ts.asCID(r.Hash);try{t||(typeof r.Hash=="string"?t=Ts.parse(r.Hash):r.
Hash instanceof Uint8Array&&(t=Ts.decode(r.Hash)))}catch(n){throw new TypeError(`Invalid DAG-PB form: ${n.message}`)}t&&
(e.Hash=t)}if(!e.Hash)throw new TypeError("Invalid DAG-PB form");return typeof r.Name=="string"&&(e.Name=r.Name),typeof r.
Tsize=="number"&&(e.Tsize=r.Tsize),e}function Jt(r){if((r instanceof Uint8Array||typeof r=="string")&&(r={Data:r}),typeof r!=
"object"||Array.isArray(r))throw new TypeError("Invalid DAG-PB form");const e={};if(r.Data!==void 0)if(typeof r.Data=="s\
tring")e.Data=kl.encode(r.Data);else if(r.Data instanceof Uint8Array)e.Data=r.Data;else throw new TypeError("Invalid DAG\
-PB form");if(r.Links!==void 0)if(Array.isArray(r.Links))e.Links=r.Links.map(lg),e.Links.sort(cg);else throw new TypeError(
"Invalid DAG-PB form");else e.Links=[];return e}function ug(r){if(!r||typeof r!="object"||Array.isArray(r)||r instanceof
Uint8Array||r["/"]&&r["/"]===r.bytes)throw new TypeError("Invalid DAG-PB form");if(!xh(r,ix))throw new TypeError("Invali\
d DAG-PB form (extraneous properties)");if(r.Data!==void 0&&!(r.Data instanceof Uint8Array))throw new TypeError("Invalid\
 DAG-PB form (Data must be bytes)");if(!Array.isArray(r.Links))throw new TypeError("Invalid DAG-PB form (Links must be a\
 list)");for(let e=0;e<r.Links.length;e++){const t=r.Links[e];if(!t||typeof t!="object"||Array.isArray(t)||t instanceof Uint8Array||
t["/"]&&t["/"]===t.bytes)throw new TypeError("Invalid DAG-PB form (bad link)");if(!xh(t,ox))throw new TypeError("Invalid\
 DAG-PB form (extraneous properties on link)");if(t.Hash===void 0)throw new TypeError("Invalid DAG-PB form (link must ha\
ve a Hash)");if(t.Hash==null||!t.Hash["/"]||t.Hash["/"]!==t.Hash.bytes)throw new TypeError("Invalid DAG-PB form (link Ha\
sh must be a CID)");if(t.Name!==void 0&&typeof t.Name!="string")throw new TypeError("Invalid DAG-PB form (link Name must\
 be a string)");if(t.Tsize!==void 0){if(typeof t.Tsize!="number"||t.Tsize%1!==0)throw new TypeError("Invalid DAG-PB form\
 (link Tsize must be an integer)");if(t.Tsize<0)throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)")}
if(e>0&&cg(t,r.Links[e-1])===-1)throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")}}function ax(r,e=[]){
return Jt({Data:r,Links:e})}function cx(r,e,t){return lg({Hash:t,Name:r,Tsize:e})}function lx(r){return r instanceof ArrayBuffer?
new Uint8Array(r,0,r.byteLength):r}const ux="dag-pb",mi=112;function Xt(r,e){ug(r);const t={};return r.Links&&(t.Links=r.
Links.map(n=>{const s={};return n.Hash&&(s.Hash=n.Hash.bytes),n.Name!==void 0&&(s.Name=n.Name),n.Tsize!==void 0&&(s.Tsize=
n.Tsize),s})),r.Data&&(t.Data=r.Data),ex(t,e)}function Zs(r){const e=lx(r),t=XE(e),n={};return t.Data&&(n.Data=t.Data),t.
Links&&(n.Links=t.Links.map(s=>{const i={};try{i.Hash=Ts.decode(s.Hash)}catch{}if(!i.Hash)throw new Error("Invalid Hash \
field found in link, expected CID");return s.Name!==void 0&&(i.Name=s.Name),s.Tsize!==void 0&&(i.Tsize=s.Tsize),i})),n}const dg=Object.
freeze(Object.defineProperty({__proto__:null,code:mi,createLink:cx,createNode:ax,decode:Zs,encode:Xt,name:ux,prepare:Jt,
validate:ug},Symbol.toStringTag,{value:"Module"}));function dx(r){return r[Symbol.asyncIterator]!=null}function hx(r){if(dx(
r))return(async()=>{for await(const e of r)return e})();for(const e of r)return e}function fx(r){return r[Symbol.asyncIterator]!=
null}function hg(r,e=1){return e=Number(e),fx(r)?(async function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error(
"Batch size must be an integer");for await(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.
length>0;)yield t.slice(0,e),t=t.slice(e)})():(function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error("Bat\
ch size must be an integer");for(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.length>0;)
yield t.slice(0,e),t=t.slice(e)})()}async function*fg(r,e=1){for await(const t of hg(r,e)){const n=t.map(async s=>s().then(
i=>({ok:!0,value:i}),i=>({ok:!1,err:i})));for(let s=0;s<n.length;s++){const i=await n[s];if(i.ok)yield i.value;else throw i.
err}}}function vr(r=0){return new Uint8Array(r)}function Do(r=0){return new Uint8Array(r)}function px(r){return r?.buffer instanceof
ArrayBuffer}function mx(r){if(px(r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function vh(r,e){
e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=Do(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return mx(t)}function gx(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
const pg=Symbol.for("@achingbrain/uint8arraylist");function Sh(r,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("ind\
ex is out of bounds")}function Mi(r){return!!r?.[pg]}let uc=class eo{bufs;length;[pg]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(Mi(
n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())
if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(Mi(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Sh(this.
bufs,e);return t.buf[t.index]}set(e,t){const n=Sh(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(Mi(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return vh(n,s)}subarray(e,t){const{bufs:n,length:s}=this.
_subList(e,t);return n.length===1?n[0]:vh(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new eo;return i.
length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const d=e-a;n.push(
o.subarray(d,d+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(
o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Mi(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let d=0;d<
i;d++)o[d]=-1;for(let d=0;d<s;d++)o[n[d]]=d;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let d=t;d<=
c;d+=u){u=0;for(let h=l;h>=0;h--){const p=this.get(d+h);if(n[h]!==p){u=Math.max(1,h-a[p]);break}}if(u===0)return d}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=Do(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=vr(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=vr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=vr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=Do(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=vr(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=vr(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=vr(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=vr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=vr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof eo)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!gx(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new eo;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const mg=1,gg=BigInt(34),bg=8,yg=262144,bx="links-b\
ytes",wg=262144,yx=1048576,wx=50,kx=10,Ex=!0,xx=!0,vx=!1,Sx="file",Ax="links-first",kg=(r={})=>{const e=r.chunkSize??wg;
return async function*(n){let s=new uc,i=0,o=!1;for await(const a of n)for(s.append(a),i+=a.length;i>=e;)if(yield s.subarray(
0,e),o=!0,e===s.length)s=new uc,i=0;else{const l=new uc;l.append(s.sublist(e)),s=l,i-=e}(!o||i>0)&&(yield s.subarray(0,i))}};
function _x(r){return r.buffer instanceof ArrayBuffer}function Eg(r){return _x(r)?r:r.slice()}class ei extends Error{static name="\
InvalidTypeError";static code="ERR_INVALID_TYPE";name=ei.name;code=ei.code;constructor(e="Invalid type"){super(e)}}function Po(r=0){
return new Uint8Array(r)}const Ix=Math.pow(2,7),Cx=Math.pow(2,14),Tx=Math.pow(2,21),xg=Math.pow(2,28),vg=Math.pow(2,35),
Sg=Math.pow(2,42),Ag=Math.pow(2,49),rt=128,Sr=127;function $u(r){if(r<Ix)return 1;if(r<Cx)return 2;if(r<Tx)return 3;if(r<
xg)return 4;if(r<vg)return 5;if(r<Sg)return 6;if(r<Ag)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function Mx(r,e,t=0){switch($u(r)){case 8:e[t++]=r&255|rt,r/=128;case 7:
e[t++]=r&255|rt,r/=128;case 6:e[t++]=r&255|rt,r/=128;case 5:e[t++]=r&255|rt,r/=128;case 4:e[t++]=r&255|rt,r>>>=7;case 3:
e[t++]=r&255|rt,r>>>=7;case 2:e[t++]=r&255|rt,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function Rx(r,e){let t=r[e],n=0;if(n+=t&Sr,t<rt||(t=r[e+1],n+=(t&Sr)<<7,t<rt)||(t=r[e+2],n+=(t&Sr)<<14,t<
rt)||(t=r[e+3],n+=(t&Sr)<<21,t<rt)||(t=r[e+4],n+=(t&Sr)*xg,t<rt)||(t=r[e+5],n+=(t&Sr)*vg,t<rt)||(t=r[e+6],n+=(t&Sr)*Sg,t<
rt)||(t=r[e+7],n+=(t&Sr)*Ag,t<rt))return n;throw new RangeError("Could not decode varint")}const Nu=new Float32Array([-0]),
qr=new Uint8Array(Nu.buffer);function Bx(r,e,t){Nu[0]=r,e[t]=qr[0],e[t+1]=qr[1],e[t+2]=qr[2],e[t+3]=qr[3]}function Lx(r,e){
return qr[0]=r[e],qr[1]=r[e+1],qr[2]=r[e+2],qr[3]=r[e+3],Nu[0]}const Uu=new Float64Array([-0]),Qe=new Uint8Array(Uu.buffer);
function Dx(r,e,t){Uu[0]=r,e[t]=Qe[0],e[t+1]=Qe[1],e[t+2]=Qe[2],e[t+3]=Qe[3],e[t+4]=Qe[4],e[t+5]=Qe[5],e[t+6]=Qe[6],e[t+
7]=Qe[7]}function Px(r,e){return Qe[0]=r[e],Qe[1]=r[e+1],Qe[2]=r[e+2],Qe[3]=r[e+3],Qe[4]=r[e+4],Qe[5]=r[e+5],Qe[6]=r[e+6],
Qe[7]=r[e+7],Uu[0]}const $x=BigInt(Number.MAX_SAFE_INTEGER),Nx=BigInt(Number.MIN_SAFE_INTEGER);class Ye{lo;hi;constructor(e,t){
this.lo=e>>>0,this.hi=t>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&
(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return en;if(e<$x&&e>Nx)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>Ah&&(s=0n,++n>Ah&&(n=0n))),new Ye(Number(s),Number(n))}static fromNumber(e){
if(e===0)return en;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new Ye(n,s)}static from(e){return typeof e=="number"?Ye.fromNumber(e):typeof e=="bigint"?Ye.
fromBigInt(e):typeof e=="string"?Ye.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Ye(e.low>>>0,e.high>>>0):en}}const en=new Ye(
0,0);en.toBigInt=function(){return 0n};en.zzEncode=en.zzDecode=function(){return this};en.length=function(){return 1};const Ah=4294967296n;
function Ux(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function Fx(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function _g(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Lt(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function Ri(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}class Ox{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Eg(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Lt(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Lt(this,4);return Ri(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Lt(
this,4);return Ri(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Lt(this,4);const e=Lx(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Lt(this,4);const e=Px(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Lt(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return Fx(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Lt(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Lt(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Ye(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Lt(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Lt(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Lt(this,8);const e=Ri(this.buf,this.pos+=4),t=Ri(this.buf,this.pos+=4);return new Ye(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Rx(this.buf,this.pos);
return this.pos+=$u(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Ig(r){return new Ox(r instanceof Uint8Array?r:
r.subarray())}function es(r,e,t){const n=Ig(r);return e.decode(n,void 0,t)}function El(r){if(r instanceof Uint8Array&&r.
constructor.name==="Uint8Array")return Ih(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return Ih(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function zx(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const _h=4096;function qx(r){const e=r.
length;if(e<=_h)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=_h));return t}function jx(r){return r?.buffer instanceof ArrayBuffer}function Ih(r){return jx(r)?r:r.slice()}
function Gx(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===
0;)E++,b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=
256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;
for(var T=d.repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.
length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&
C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){
for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var Wx=Gx,Vx=Wx;let Hx=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Kx=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Cg(this,e)}},
Qx=class{decoders;constructor(e){this.decoders=e}or(e){return Cg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Cg(r,e){return new Qx({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let Jx=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new Hx(e,t,n),this.decoder=new Kx(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Sa({name:r,prefix:e,encode:t,decode:n}){return new Jx(r,e,t,
n)}function gi({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=Vx(t,r,n);return Sa({prefix:e,
name:r,encode:s,decode:o=>El(i(o))})}function Xx(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Yx(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function Zx(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Ne({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=Zx(n,s);return Sa(
{prefix:e,name:r,encode(o){return Yx(o,n,t)},decode(o){return Xx(o,i,t,r)}})}const ev=gi({prefix:"9",name:"base10",alphabet:"\
0123456789"}),tv=Object.freeze(Object.defineProperty({__proto__:null,base10:ev},Symbol.toStringTag,{value:"Module"})),rv=Ne(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),nv=Ne({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),sv=Object.freeze(Object.defineProperty({__proto__:null,
base16:rv,base16upper:nv},Symbol.toStringTag,{value:"Module"})),iv=Ne({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
ov=Object.freeze(Object.defineProperty({__proto__:null,base2:iv},Symbol.toStringTag,{value:"Module"})),Tg=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),av=Tg.reduce((r,e,t)=>(r[t]=e,r),[]),cv=Tg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function lv(r){return r.reduce((e,t)=>(e+=av[t],e),"")}function uv(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=cv[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const dv=Sa({prefix:"🚀",name:"\
base256emoji",encode:lv,decode:uv}),hv=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:dv},Symbol.toStringTag,
{value:"Module"})),fv=Ne({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
pv=Ne({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),mv=Ne(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),gv=Ne({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),bv=Ne({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),yv=Ne({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),wv=Ne({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),kv=Ne({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Ev=Ne({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),xv=Object.freeze(Object.defineProperty({__proto__:null,
base32:fv,base32hex:bv,base32hexpad:wv,base32hexpadupper:kv,base32hexupper:yv,base32pad:mv,base32padupper:gv,base32upper:pv,
base32z:Ev},Symbol.toStringTag,{value:"Module"})),vv=gi({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),Sv=gi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
Av=Object.freeze(Object.defineProperty({__proto__:null,base36:vv,base36upper:Sv},Symbol.toStringTag,{value:"Module"})),_v=gi(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Iv=gi({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Cv=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:_v,base58flickr:Iv},Symbol.toStringTag,{value:"Module"})),Tv=Ne({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Mv=Ne({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Rv=Ne({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Bv=Ne({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Lv=Object.freeze(Object.defineProperty(
{__proto__:null,base64:Tv,base64pad:Mv,base64url:Rv,base64urlpad:Bv},Symbol.toStringTag,{value:"Module"})),Dv=Ne({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Pv=Object.freeze(Object.defineProperty({__proto__:null,base8:Dv},Symbol.
toStringTag,{value:"Module"})),$v=Sa({prefix:"\0",name:"identity",encode:r=>qx(El(r)),decode:r=>El(zx(r))}),Nv=Object.freeze(
Object.defineProperty({__proto__:null,identity:$v},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Ch={...Nv,...ov,...Pv,...tv,...sv,...xv,...Av,...Cv,...Lv,...hv};function Mg(r,e,t,n){return{name:r,prefix:e,encoder:{
name:r,prefix:e,encode:t},decoder:{decode:n}}}const Th=Mg("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().
encode(r.substring(1))),dc=Mg("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},
r=>{r=r.substring(1);const e=Po(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Uv={utf8:Th,"utf-8":Th,
hex:Ch.base16,latin1:dc,ascii:dc,binary:dc,...Ch};function Fv(r,e="utf8"){const t=Uv[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function Ov(r){let n,s=8192;return function(o){if(o<
1||o>4096)return Po(o);s+o>8192&&(n=Po(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Ms{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}}function hc(){}class zv{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const qv=Ov();function jv(r){return globalThis.Buffer!=null?Po(
r):qv(r)}class xl{len;head;tail;states;constructor(){this.len=0,this.head=new Ms(hc,0,0),this.tail=this.head,this.states=
null}_push(e,t,n){return this.tail=this.tail.next=new Ms(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new Wv((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Bi,10,
Ye.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Ye.fromBigInt(e);return this.
_push(Bi,t.length(),t)}uint64Number(e){return this._push(Mx,$u(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Ye.
fromBigInt(e).zzEncode();return this._push(Bi,t.length(),t)}sint64Number(e){const t=Ye.fromNumber(e).zzEncode();return this.
_push(Bi,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(fc,1,e?1:0)}fixed32(e){return this.
_push(hs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Ye.fromBigInt(e);return this._push(hs,4,t.lo)._push(
hs,4,t.hi)}fixed64Number(e){const t=Ye.fromNumber(e);return this._push(hs,4,t.lo)._push(hs,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(Bx,4,e)}double(e){return this._push(Dx,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(fc,1,0):this.uint32(t)._push(Vv,t,e)}string(e){const t=Ux(e);return t!==0?this.uint32(t)._push(_g,t,e):this.
_push(fc,1,0)}fork(){return this.states=new zv(this),this.head=this.tail=new Ms(hc,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Ms(hc,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=jv(this.len);
let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}}function fc(r,e,t){e[t]=r&255}function Gv(r,e,t){for(;r>
127;)e[t++]=r&127|128,r>>>=7;e[t]=r}class Wv extends Ms{next;constructor(e,t){super(Gv,e,t),this.next=void 0}}function Bi(r,e,t){
for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>
7;e[t++]=r.lo}function hs(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function Vv(r,e,t){e.set(r,
t)}globalThis.Buffer!=null&&(xl.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(Hv,
e,r),this},xl.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(
Kv,e,r),this});function Hv(r,e,t){e.set(r,t)}function Kv(r,e,t){r.length<40?_g(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):
e.set(Fv(r),t)}function Qv(){return new xl}function ts(r,e){const t=Qv();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}
function*rs(r,e,t){const n=Ig(r);yield*e.stream(n,void 0,".",t)}const Rg={VARINT:0,LENGTH_DELIMITED:2};function Bg(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function Jv(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Bg("enum",Rg.VARINT,t,n,s)}function ns(r,e,t){return Bg("message",Rg.LENGTH_DELIMITED,r,e,
t)}class Hn extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var Je;(function(r){(function(o){o.RAW="RAW",o.DIRECTORY=
"DIRECTORY",o.FILE="FILE",o.METADATA="METADATA",o.SYMLINK="SYMLINK",o.HAMT_SHARD="HAMT_SHARD"})(r.Type||(r.Type={}));let e;
(function(o){o[o.RAW=0]="RAW",o[o.DIRECTORY=1]="DIRECTORY",o[o.FILE=2]="FILE",o[o.METADATA=3]="METADATA",o[o.SYMLINK=4]=
"SYMLINK",o[o.HAMT_SHARD=5]="HAMT_SHARD"})(e||(e={})),(function(o){o.codec=()=>Jv(e)})(r.Type||(r.Type={}));let t;r.codec=
()=>(t==null&&(t=ns((o,a,c={})=>{if(c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),r.Type.codec().encode(o.
type,a)),o.data!=null&&(a.uint32(18),a.bytes(o.data)),o.fileSize!=null&&(a.uint32(24),a.uint64(o.fileSize)),o.blockSizes!=
null&&o.blockSizes.length>0)for(const l of o.blockSizes)a.uint32(32),a.uint64(l);o.hashType!=null&&(a.uint32(40),a.uint64(
o.hashType)),o.fanOut!=null&&(a.uint32(48),a.uint64(o.fanOut)),o.mode!=null&&(a.uint32(56),a.uint32(o.mode)),o.mtime!=null&&
(a.uint32(66),Ps.codec().encode(o.mtime,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={blockSizes:[]},u=a==
null?o.len:o.pos+a;for(;o.pos<u;){const d=o.uint32();switch(d>>>3){case 1:{l.type=r.Type.codec().decode(o);break}case 2:{
l.data=o.bytes();break}case 3:{l.fileSize=o.uint64();break}case 4:{if(c.limits?.blockSizes!=null&&l.blockSizes.length===
c.limits.blockSizes)throw new Hn('Decode error - repeated field "blockSizes" had too many elements');l.blockSizes.push(o.
uint64());break}case 5:{l.hashType=o.uint64();break}case 6:{l.fanOut=o.uint64();break}case 7:{l.mode=o.uint32();break}case 8:{
l.mtime=Ps.codec().decode(o,o.uint32(),{limits:c.limits?.mtime});break}default:{o.skipType(d&7);break}}}return l},function*(o,a,c,l={}){
const u={blockSizes:0},d=a==null?o.len:o.pos+a;for(c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-1):c,type:"\
start",message:"UnixFS"});o.pos<d;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}type`,value:r.Type.codec().
decode(o)};break}case 2:{yield{field:`${c}data`,value:o.bytes()};break}case 3:{yield{field:`${c}fileSize`,value:o.uint64()};
break}case 4:{if(l.limits?.blockSizes!=null&&u.blockSizes===l.limits.blockSizes)throw new Hn('Streaming decode error - r\
epeated field "blockSizes" had too many elements');yield{field:`${c}blockSizes[]`,index:u.blockSizes,value:o.uint64()},u.
blockSizes++;break}case 5:{yield{field:`${c}hashType`,value:o.uint64()};break}case 6:{yield{field:`${c}fanOut`,value:o.uint64()};
break}case 7:{yield{field:`${c}mode`,value:o.uint32()};break}case 8:{yield*Ps.codec().stream(o,o.uint32(),`${c}mtime.`,{
limits:l.limits?.mtime});break}default:{o.skipType(h&7);break}}}c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-
1):c,type:"end",message:"UnixFS"})})),t);function n(o){return ts(o,r.codec())}r.encode=n;function s(o,a){return es(o,r.codec(),
a)}r.decode=s;function i(o,a){return rs(o,r.codec(),a)}r.stream=i})(Je||(Je={}));var Ps;(function(r){let e;r.codec=()=>(e==
null&&(e=ns((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.seconds!=null&&(o.uint32(8),o.int64(i.seconds)),i.fractionalNanoseconds!=
null&&(o.uint32(21),o.fixed32(i.fractionalNanoseconds)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?
i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.seconds=i.int64();break}case 2:{a.fractionalNanoseconds=
i.fixed32();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"UnixTime"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}seconds`,value:i.int64()};break}case 2:{yield{field:`${a}fractionalNanoseconds`,value:i.
fixed32()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"UnixTime"})})),e);function t(i){return ts(i,r.codec())}r.encode=t;function n(i,o){return es(i,r.codec(),o)}
r.decode=n;function s(i,o){return rs(i,r.codec(),o)}r.stream=s})(Ps||(Ps={}));var Mh;(function(r){let e;r.codec=()=>(e==
null&&(e=ns((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.mimeType!=null&&(o.uint32(10),o.string(i.mimeType)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.mimeType=
i.string();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Metadata"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}mimeType`,value:i.string()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Metadata"})})),e);function t(i){return ts(i,r.codec())}
r.encode=t;function n(i,o){return es(i,r.codec(),o)}r.decode=n;function s(i,o){return rs(i,r.codec(),o)}r.stream=s})(Mh||
(Mh={}));var Gr;(function(r){let e;r.codec=()=>(e==null&&(e=ns((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.hash!=null&&
(o.uint32(10),o.bytes(i.hash)),i.name!=null&&(o.uint32(18),o.string(i.name)),i.tSize!=null&&(o.uint32(24),o.uint64(i.tSize)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{a.hash=i.bytes();break}case 2:{a.name=i.string();break}case 3:{a.tSize=i.uint64();break}default:{i.skipType(l&
7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"Link"});i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{yield{field:`${a}hash`,
value:i.bytes()};break}case 2:{yield{field:`${a}name`,value:i.string()};break}case 3:{yield{field:`${a}tSize`,value:i.uint64()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Link"})})),e);function t(i){return ts(i,r.codec())}r.encode=t;function n(i,o){return es(i,r.codec(),o)}r.decode=n;function s(i,o){
return rs(i,r.codec(),o)}r.stream=s})(Gr||(Gr={}));var ti;(function(r){let e;r.codec=()=>(e==null&&(e=ns((i,o,a={})=>{if(a.
lengthDelimited!==!1&&o.fork(),i.data!=null&&(o.uint32(10),Je.codec().encode(i.data,o)),i.links!=null&&i.links.length>0)
for(const c of i.links)o.uint32(18),Gr.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.data=Je.codec().decode(i,i.uint32(),{limits:a.
limits?.data});break}case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Hn('Decode error - repe\
ated field "links" had too many elements');c.links.push(Gr.codec().decode(i,i.uint32(),{limits:a.limits?.links$}));break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.
endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Node"});i.pos<u;){const d=i.uint32();switch(d>>>3){case 1:{
yield*Je.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}case 2:{if(c.limits?.links!=null&&l.links===
c.limits.links)throw new Hn('Streaming decode error - repeated field "links" had too many elements');for(const h of Gr.codec().
stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}default:{i.skipType(
d&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Node"})})),e);function t(i){
return ts(i,r.codec())}r.encode=t;function n(i,o){return es(i,r.codec(),o)}r.decode=n;function s(i,o){return rs(i,r.codec(),
o)}r.stream=s})(ti||(ti={}));var Rh;(function(r){let e;r.codec=()=>(e==null&&(e=ns((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.links!=null&&i.links.length>0)for(const c of i.links)o.uint32(18),Gr.codec().encode(c,o);i.data!=null&&(o.uint32(
10),Je.codec().encode(i.data,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},l=o==null?i.len:i.pos+
o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Hn(
'Decode error - repeated field "links" had too many elements');c.links.push(Gr.codec().decode(i,i.uint32(),{limits:a.limits?.
links$}));break}case 1:{c.data=Je.codec().decode(i,i.uint32(),{limits:a.limits?.data});break}default:{i.skipType(u&7);break}}}
return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"LegacyNode"});i.pos<u;){const d=i.uint32();switch(d>>>3){case 2:{if(c.limits?.links!=
null&&l.links===c.limits.links)throw new Hn('Streaming decode error - repeated field "links" had too many elements');for(const h of Gr.
codec().stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}case 1:{
yield*Je.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}default:{i.skipType(d&7);break}}}a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"LegacyNode"})})),e);function t(i){return ts(
i,r.codec())}r.encode=t;function n(i,o){return es(i,r.codec(),o)}r.decode=n;function s(i,o){return rs(i,r.codec(),o)}r.stream=
s})(Rh||(Rh={}));const Bh={RAW:"raw",DIRECTORY:"directory",FILE:"file",METADATA:"metadata",SYMLINK:"symlink",HAMT_SHARD:"\
hamt-sharded-directory"},Xv=["directory","hamt-sharded-directory"],Lh=parseInt("0644",8),Dh=parseInt("0755",8);class it{static unmarshal(e){
const t=Je.decode(e),n=new it({type:Bh[t.type!=null?t.type.toString():"FILE"],data:t.data,blockSizes:t.blockSizes,mode:t.
mode,mtime:t.mtime!=null?{secs:t.mtime.seconds??0n,nsecs:t.mtime.fractionalNanoseconds}:void 0,fanout:t.fanOut});return n.
_originalMode=t.mode??0,n}type;data;blockSizes;hashType;fanout;mtime;_mode;_originalMode;constructor(e={type:"file"}){const{
type:t,data:n,blockSizes:s,hashType:i,fanout:o,mtime:a,mode:c}=e;if(t!=null&&!Object.values(Bh).includes(t))throw new ei(
"Type: "+t+" is not valid");this.type=t??"file",this.hashType=i,this.fanout=o,this.blockSizes=s??[],this._originalMode=0,
this.mode=c,this.mtime=a,n!=null&&(this.data=Eg(n))}set mode(e){e==null?this._mode=this.isDirectory()?Dh:Lh:this._mode=e&
4095}get mode(){return this._mode}isDirectory(){return Xv.includes(this.type)}addBlockSize(e){this.blockSizes.push(e)}removeBlockSize(e){
this.blockSizes.splice(e,1)}fileSize(){if(this.isDirectory())return 0n;let e=0n;return this.blockSizes.forEach(t=>{e+=t}),
this.data!=null&&(e+=BigInt(this.data.length)),e}marshal(){let e;switch(this.type){case"raw":e=Je.Type.RAW;break;case"di\
rectory":e=Je.Type.DIRECTORY;break;case"file":e=Je.Type.FILE;break;case"metadata":e=Je.Type.METADATA;break;case"symlink":
e=Je.Type.SYMLINK;break;case"hamt-sharded-directory":e=Je.Type.HAMT_SHARD;break;default:throw new ei(`Type: ${e} is not \
valid`)}let t=this.data;(this.data==null||this.data.length===0)&&(t=void 0);let n;this.mode!=null&&(n=this._originalMode&
4294963200|(this.mode??0),n===Lh&&!this.isDirectory()&&(n=void 0),n===Dh&&this.isDirectory()&&(n=void 0));let s;return this.
mtime!=null&&(s={seconds:this.mtime.secs,fractionalNanoseconds:this.mtime.nsecs}),Je.encode({type:e,data:t,fileSize:this.
type==="file"||this.type==="raw"?this.fileSize():void 0,blockSizes:this.blockSizes,hashType:this.hashType,fanOut:this.fanout,
mode:n,mtime:s})}}function Yv(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function an(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return ri(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return ri(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function Zv(r){const e=new Uint8Array(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}const Ph=4096;function eS(r){const e=r.length;if(e<=Ph)return String.fromCharCode.
apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=Ph));return t}function tS(r){
return r?.buffer instanceof ArrayBuffer}function ri(r){return tS(r)?r:r.slice()}const rS="raw",vl=85;function nS(r){return an(
r)}function sS(r){return an(r)}const iS=Object.freeze(Object.defineProperty({__proto__:null,code:vl,decode:sS,encode:nS,
name:rS},Symbol.toStringTag,{value:"Module"}));class Yt extends Event{type;detail;constructor(e,t){super(e),this.type=e,
this.detail=t}}function oS(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
E=0,v=f.length;E!==v&&f[E]===0;)E++,b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==
0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-
w;S!==_&&k[S]===0;)S++;for(var T=d.repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.
length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&
C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){
for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var aS=oS,cS=aS;let lS=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},uS=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Lg(this,e)}},
dS=class{decoders;constructor(e){this.decoders=e}or(e){return Lg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Lg(r,e){return new dS({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let hS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new lS(e,t,n),this.decoder=new uS(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Aa({name:r,prefix:e,encode:t,decode:n}){return new hS(r,e,t,
n)}function bi({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=cS(t,r,n);return Aa({prefix:e,
name:r,encode:s,decode:o=>an(i(o))})}function fS(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function pS(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function mS(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Ue({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=mS(n,s);return Aa(
{prefix:e,name:r,encode(o){return pS(o,n,t)},decode(o){return fS(o,i,t,r)}})}const $s=Ue({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),gS=Ue({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),bS=Ue({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),yS=Ue({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),wS=Ue({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),kS=Ue({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),ES=Ue({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),xS=Ue({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),vS=Ue({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),SS=Object.freeze(Object.defineProperty({__proto__:null,base32:$s,base32hex:wS,base32hexpad:ES,
base32hexpadupper:xS,base32hexupper:kS,base32pad:bS,base32padupper:yS,base32upper:gS,base32z:vS},Symbol.toStringTag,{value:"\
Module"})),to=bi({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),AS=bi({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),_S=Object.freeze(Object.defineProperty(
{__proto__:null,base36:to,base36upper:AS},Symbol.toStringTag,{value:"Module"})),lr=bi({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),IS=bi({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),CS=Object.freeze(Object.defineProperty({__proto__:null,base58btc:lr,
base58flickr:IS},Symbol.toStringTag,{value:"Module"}));var TS=Dg,$h=128,MS=-128,RS=Math.pow(2,31);function Dg(r,e,t){e=e||
[],t=t||0;for(var n=t;r>=RS;)e[t++]=r&255|$h,r/=128;for(;r&MS;)e[t++]=r&255|$h,r>>>=7;return e[t]=r|0,Dg.bytes=t-n+1,e}var BS=Sl,
LS=128,Nh=127;function Sl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Sl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Nh)<<s:(o&Nh)*Math.pow(2,s),s+=7}while(o>=LS);return Sl.bytes=i-n,t}var DS=Math.pow(
2,7),PS=Math.pow(2,14),$S=Math.pow(2,21),NS=Math.pow(2,28),US=Math.pow(2,35),FS=Math.pow(2,42),OS=Math.pow(2,49),zS=Math.
pow(2,56),qS=Math.pow(2,63),jS=function(r){return r<DS?1:r<PS?2:r<$S?3:r<NS?4:r<US?5:r<FS?6:r<OS?7:r<zS?8:r<qS?9:10},GS={
encode:TS,decode:BS,encodingLength:jS},$o=GS;function Al(r,e=0){const t=$o.decode(r,e),n=$o.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function No(r,e,t=0){return $o.encode(r,e,t),e}function Uo(r){return $o.encodingLength(r)}function Pg(r,e){const t=e.
byteLength,n=Uo(r),s=n+Uo(t),i=new Uint8Array(s+t);return No(r,i,0),No(t,i,n),i.set(e,s),new Fu(r,t,e,i)}function WS(r){
const e=an(r),[t,n]=Al(e),[s,i]=Al(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Fu(t,s,o,e)}function VS(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&Yv(r.bytes,t.bytes)}}let Fu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
ri(n),this.bytes=ri(s)}};function Uh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return QS(t,_l(r),e??lr.encoder);default:
return JS(t,_l(r),e??$s.encoder)}}const Fh=new WeakMap;function _l(r){const e=Fh.get(r);if(e==null){const t=new Map;return Fh.
set(r,t),t}return e}let HS=class We{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=ri(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
fs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==XS)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return We.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=Pg(e,
t);return We.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return We.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&VS(e.multihash,n.multihash)}toString(e){return Uh(this,e)}toJSON(){return{"/":Uh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof We)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new We(n,s,i,o??Oh(n,s,i.bytes))}else if(t[YS]===!0){const{version:n,
multihash:s,code:i}=t,o=WS(s);return We.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==fs)throw new Error(`Version 0 CID must use dag-pb (code: ${fs}) block encoding`);return new We(e,t,n,n.bytes)}case 1:{
const s=Oh(e,t,n.bytes);return new We(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return We.
create(0,fs,e)}static createV1(e,t){return We.create(1,e,t)}static decode(e){const[t,n]=We.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=We.inspectBytes(e),n=t.size-t.multihashSize,
s=an(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Fu(t.multihashCode,t.digestSize,i,s);return[t.version===0?We.createV0(o):We.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Al(e.subarray(t));return t+=h,d};let s=n(),
i=fs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=KS(e,t),
i=We.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return _l(
i).set(n,e),i}};function KS(r,e){switch(r[0]){case"Q":{const t=e??lr;return[lr.prefix,t.decode(`${lr.prefix}${r}`)]}case lr.
prefix:{const t=e??lr;return[lr.prefix,t.decode(r)]}case $s.prefix:{const t=e??$s;return[$s.prefix,t.decode(r)]}case to.
prefix:{const t=e??to;return[to.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function QS(r,e,t){const{prefix:n}=t;if(n!==
lr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function JS(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const fs=112,XS=18;function Oh(r,e,t){const n=Uo(r),s=n+Uo(e),i=new Uint8Array(s+t.
byteLength);return No(r,i,0),No(e,i,n),i.set(t,s),i}const YS=Symbol.for("@ipld/js-cid/CID"),ZS=20;function eA({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new tA(r,e,t,n,s)}let tA=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??ZS,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
zh(n,this.code,t?.truncate):n.then(s=>zh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function zh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Pg(e,r)}function rA(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const nA=eA({name:"sha2-256",code:18,encode:rA("SHA-256")}),Kr=async(r,e,t)=>{t.codec==null&&(t.codec=
dg);const n=await nA.digest(r),s=HS.create(t.cidVersion??mg,t.codec.code,n);return await e.put(s,r,t),s};function sA(r){
return async function*(t,n){let s=0n;for await(let i of t.content)yield async()=>{let o;const a={codec:dg,cidVersion:r.cidVersion,
onProgress:r.onProgress};r.rawLeaves?(a.codec=iS,a.cidVersion=1):(o=new it({type:r.leafType,data:i}),i=Xt({Data:o.marshal(),
Links:[]},r));const c=await Kr(i,n,a);return s+=BigInt(i.byteLength),r.onProgress?.(new Yt("unixfs:importer:progress:fil\
e:write",{bytesWritten:s,cid:c,path:t.path})),{cid:c,unixfs:o,size:BigInt(i.length),block:i}}}}let iA=class Il extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Il.name;code=Il.code;constructor(e="Invalid parameters"){super(
e)}};class hr extends Error{static name="InvalidContentError";static code="ERR_INVALID_CONTENT";name=hr.name;code=hr.code;constructor(e="\
Invalid content"){super(e)}}class qh extends Error{static name="InvalidShardingStrategyError";static code="ERR_SHARDING_\
STRATEGY";name=hr.name;code=hr.code}const oA=async(r,e,t)=>{const n=new it({type:"directory",mtime:r.mtime,mode:r.mode}),
s=Xt(Jt({Data:n.marshal()}),t),i=await Kr(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.
originalPath,block:s}};async function*aA(r,e,t){let n=-1,s;for await(const i of fg(t.bufferImporter(r,e),t.blockWriteConcurrency)){
if(n++,n===0){s={...i,single:!0};continue}else n===1&&s!=null&&(yield{...s,block:void 0,single:void 0},s=void 0);yield{...i,
block:void 0}}s!=null&&(yield s)}function jh(r){return r.single===!0}const cA=(r,e,t)=>async function(s){if(s.length===1&&
jh(s[0])&&t.reduceSingleLeafToSelf){const u=s[0];let d=u.block;return jh(u)&&(r.mtime!==void 0||r.mode!==void 0)&&(u.unixfs=
new it({type:"file",mtime:r.mtime,mode:r.mode,data:u.block}),d={Data:u.unixfs.marshal(),Links:[]},u.block=Xt(Jt(d),t),u.
cid=await Kr(u.block,e,{...t,cidVersion:t.cidVersion}),u.size=BigInt(u.block.length)),t.onProgress?.(new Yt("unixfs:impo\
rter:progress:file:layout",{cid:u.cid,path:r.originalPath})),{cid:u.cid,path:r.path,unixfs:u.unixfs,size:u.size,originalPath:r.
originalPath}}const i=new it({type:"file",mtime:r.mtime,mode:r.mode}),o=s.filter(u=>u.cid.code===vl&&u.size>0||u.unixfs!=
null&&u.unixfs.data==null&&u.unixfs.fileSize()>0n?!0:!!u.unixfs?.data?.length).map(u=>u.cid.code===vl?(i.addBlockSize(u.
size),{Name:"",Tsize:Number(u.size),Hash:u.cid}):(u.unixfs?.data==null?i.addBlockSize(u.unixfs?.fileSize()??0n):i.addBlockSize(
BigInt(u.unixfs.data.length)),{Name:"",Tsize:Number(u.size),Hash:u.cid})),a={Data:i.marshal(),Links:o},c=Xt(Jt(a),t),l=await Kr(
c,e,t);return t.onProgress?.(new Yt("unixfs:importer:progress:file:layout",{cid:l,path:r.originalPath})),{cid:l,path:r.path,
unixfs:i,size:BigInt(c.length+a.Links.reduce((u,d)=>u+(d.Tsize??0),0)),originalPath:r.originalPath,block:c}},lA=async(r,e,t)=>t.
layout(aA(r,e,t),cA(r,e,t)),uA=bi({prefix:"9",name:"base10",alphabet:"0123456789"}),dA=Object.freeze(Object.defineProperty(
{__proto__:null,base10:uA},Symbol.toStringTag,{value:"Module"})),hA=Ue({prefix:"f",name:"base16",alphabet:"0123456789abc\
def",bitsPerChar:4,caseInsensitive:!0}),fA=Ue({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
pA=Object.freeze(Object.defineProperty({__proto__:null,base16:hA,base16upper:fA},Symbol.toStringTag,{value:"Module"})),mA=Ue(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),gA=Object.freeze(Object.defineProperty({__proto__:null,base2:mA},
Symbol.toStringTag,{value:"Module"})),$g=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
bA=$g.reduce((r,e,t)=>(r[t]=e,r),[]),yA=$g.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return r[n]=t,r},[]);function wA(r){return r.reduce((e,t)=>(e+=bA[t],e),"")}function kA(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=yA[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const EA=Aa({prefix:"🚀",name:"\
base256emoji",encode:wA,decode:kA}),xA=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:EA},Symbol.toStringTag,
{value:"Module"})),vA=Ue({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),SA=Ue({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),AA=Ue({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),_A=Ue({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),IA=Object.freeze(Object.defineProperty({__proto__:null,base64:vA,base64pad:SA,
base64url:AA,base64urlpad:_A},Symbol.toStringTag,{value:"Module"})),CA=Ue({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
TA=Object.freeze(Object.defineProperty({__proto__:null,base8:CA},Symbol.toStringTag,{value:"Module"})),MA=Aa({prefix:"\0",
name:"identity",encode:r=>eS(an(r)),decode:r=>an(Zv(r))}),RA=Object.freeze(Object.defineProperty({__proto__:null,identity:MA},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Gh={...RA,...gA,...TA,...dA,...pA,...SS,..._S,
...CS,...IA,...xA};function Ng(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const Wh=Ng(
"utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),pc=Ng("ascii","a",r=>{let e="\
a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Do(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}),BA={utf8:Wh,"utf-8":Wh,hex:Gh.base16,latin1:pc,ascii:pc,binary:pc,...Gh};function Ug(r,e="\
utf8"){const t=BA[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}
const LA=async(r,e,t)=>{const n=new it({type:"symlink",data:Ug(r.link),mtime:r.mtime,mode:r.mode}),s=Xt(Jt({Data:n.marshal()})),
i=await Kr(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.originalPath,block:s}};function DA(r){
return Symbol.iterator in r}function PA(r){return Symbol.asyncIterator in r}function $A(r){try{if(r instanceof Uint8Array)
return(async function*(){yield r})();if(DA(r))return(async function*(){yield*r})();if(PA(r))return r}catch{throw new hr(
"Content was invalid")}throw new hr("Content was invalid")}function NA(r){return typeof r.path=="string"}function UA(r){
return async function*(t,n){for await(const s of t){let i;if(NA(s)&&(i=s.path,s.path=s.path.split("/").filter(o=>o!=null&&
o!==".").join("/")),FA(s)){const o={path:s.path,mtime:s.mtime,mode:s.mode,content:(async function*(){let c=0n;for await(const l of r.
chunker(r.chunkValidator($A(s.content)))){const u=BigInt(l.byteLength);c+=u,r.onProgress?.(new Yt("unixfs:importer:progr\
ess:file:read",{bytesRead:c,chunkSize:u,path:s.path})),yield l}})(),originalPath:i},a=r.fileBuilder??lA;yield async()=>a(
o,n,r)}else if(OA(s)){const o={path:s.path,link:s.link,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.symlinkBuilder??LA;
yield async()=>a(o,n,r)}else if(s.path!=null){const o={path:s.path,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.dirBuilder??
oA;yield async()=>a(o,n,r)}else throw new Error("Import candidate must have content or path or both")}}}function FA(r){return r.
content!=null}function OA(r){return r.link!=null}const zA=()=>async function*(e){for await(const t of e){if(t.length===void 0)
throw new hr("Content was invalid");if(typeof t=="string"||t instanceof String)yield Ug(t.toString());else if(Array.isArray(
t))yield Uint8Array.from(t);else if(t instanceof Uint8Array)yield t;else throw new hr("Content was invalid")}},qA=174;function Fg(r){
const e=r?.maxChildrenPerNode??qA;return async function t(n,s){const i=[];for await(const o of hg(n,e))i.push(await s(o));
return i.length>1?t(i,s):i[0]}}class ni{options;root;dir;path;dirty;flat;parent;parentKey;unixfs;mode;mtime;cid;size;nodeSize;constructor(e,t){
this.options=t??{},this.root=e.root,this.dir=e.dir,this.path=e.path,this.dirty=e.dirty,this.flat=e.flat,this.parent=e.parent,
this.parentKey=e.parentKey,this.unixfs=e.unixfs,this.mode=e.mode,this.mtime=e.mtime}}const Vh=2**32,jA=[0,1,2,2,3,3,3,3,
4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8];function GA(r){let e=0;return r>=Vh&&(r=Math.floor(r/Vh),e=32),r>=65536&&(r>>>=16,e+=16),r>=256&&(r>>>=
8,e+=8),e+jA[r]}function jr(r){return r%2===0&&r++,Math.floor((GA(r)+6)/7)}function mc(r){let e=0;for(let t=0;t<r.length;t++){
const n=r.charCodeAt(t);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319&&t+1<r.length?(t++,e+=4):e+=3}return e}function WA(r,e,t){
let n=1+jr(e)+e;return n+=1+jr(r)+r,n+=1+jr(t),1+jr(n)+n}const VA=493;function HA(r,e){let t=2;if(r!==void 0&&r!==VA&&(t+=
1+jr(r)),e!=null){let n=0;const s=Number(e.secs);s<0?n+=11:n+=1+jr(s),e.nsecs!=null&&(n+=5),t+=1+jr(n)+n}return 1+jr(t)+
t}function gc(r,e){return e?.cid!=null&&e?.size!=null?r+e.cid.byteLength:0}function bc(r,e){return e?.cid!=null&&e?.size!=
null?WA(r,e.cid.byteLength,Number(e.size)):0}class Ou extends ni{_children;constructor(e,t){super(e,t),this._children=new Map}async put(e,t){
if(this.nodeSize!==void 0){const n=this._children.get(e),s=mc(e),i=this.options?.shardSplitStrategy;if(i==="links-bytes")
this.nodeSize-=gc(s,n),this.nodeSize+=gc(s,t);else if(i==="block-bytes")this.nodeSize-=bc(s,n),this.nodeSize+=bc(s,t);else
throw new qh(`Invalid shardSplitStrategy: ${i}`);this.nodeSize<0&&(this.nodeSize=void 0)}this.cid=void 0,this.size=void 0,
this._children.set(e,t)}async get(e){return Promise.resolve(this._children.get(e))}childCount(){return this._children.size}directChildrenCount(){
return this.childCount()}onlyChild(){return this._children.values().next().value}*eachChildSeries(){for(const[e,t]of this.
_children.entries())yield{key:e,child:t}}marshal(){const e=new it({type:"directory",mtime:this.mtime,mode:this.mode}),t=[];
for(const[s,i]of this._children.entries())if(!(i.size==null||i.cid==null)){if(i.cid==null)throw new Error("Directory con\
tents must be flushed before marshaling");t.push({Hash:i.cid,Name:s,Tsize:i.size==null?void 0:Number(i.size)})}const n={
Data:e.marshal(),Links:t};return Xt(Jt(n),this.options)}async estimateNodeSize(){if(this.nodeSize!==void 0)return this.nodeSize;
const e=this.options?.shardSplitStrategy;if(e==="links-bytes"){this.nodeSize=0;for(const[t,n]of this._children.entries())
this.nodeSize+=gc(mc(t),n)}else if(e==="block-bytes"){this.nodeSize=HA(this.mode,this.mtime);for(const[t,n]of this._children.
entries())this.nodeSize+=bc(mc(t),n)}else throw new qh(`Invalid shardSplitStrategy: ${e}`);return this.nodeSize}async*flush(e){
const t=[];for(const[c,l]of this._children.entries()){let u=l;if(l instanceof ni)for await(const d of l.flush(e))u=d,yield d;
u.size!=null&&u.cid!=null&&t.push({Name:c,Tsize:Number(u.size),Hash:u.cid})}const n=new it({type:"directory",mtime:this.
mtime,mode:this.mode}),s={Data:n.marshal(),Links:t},i=Xt(Jt(s),this.options),o=await Kr(i,e,this.options),a=i.length+s.Links.
reduce((c,l)=>c+(l.Tsize??0),0);this.cid=o,this.size=a,yield{cid:o,unixfs:n,path:this.path,size:BigInt(a)}}}function KA(r){
return r?.buffer instanceof ArrayBuffer}function Hh(r){return KA(r)?r:r.slice()}var QA=Og,Kh=128,JA=-128,XA=Math.pow(2,31);
function Og(r,e,t){e=e||[],t=t||0;for(var n=t;r>=XA;)e[t++]=r&255|Kh,r/=128;for(;r&JA;)e[t++]=r&255|Kh,r>>>=7;return e[t]=
r|0,Og.bytes=t-n+1,e}var YA=Cl,ZA=128,Qh=127;function Cl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Cl.bytes=
0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&Qh)<<s:(o&Qh)*Math.pow(2,s),s+=7}while(o>=ZA);return Cl.
bytes=i-n,t}var e2=Math.pow(2,7),t2=Math.pow(2,14),r2=Math.pow(2,21),n2=Math.pow(2,28),s2=Math.pow(2,35),i2=Math.pow(2,42),
o2=Math.pow(2,49),a2=Math.pow(2,56),c2=Math.pow(2,63),l2=function(r){return r<e2?1:r<t2?2:r<r2?3:r<n2?4:r<s2?5:r<i2?6:r<
o2?7:r<a2?8:r<c2?9:10},u2={encode:QA,decode:YA,encodingLength:l2},zg=u2;function Jh(r,e,t=0){return zg.encode(r,e,t),e}function Xh(r){
return zg.encodingLength(r)}function d2(r,e){const t=e.byteLength,n=Xh(r),s=n+Xh(t),i=new Uint8Array(s+t);return Jh(r,i,
0),Jh(t,i,n),i.set(e,s),new h2(r,t,e,i)}let h2=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,
this.digest=Hh(n),this.bytes=Hh(s)}};const f2=20;function p2({name:r,code:e,encode:t,minDigestLength:n,maxDigestLength:s}){
return new m2(r,e,t,n,s)}class m2{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){this.name=e,this.
code=t,this.encode=n,this.minDigestLength=s??f2,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){if(t.truncate<this.
minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.
maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?Yh(n,
this.code,t?.truncate):n.then(s=>Yh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}function Yh(r,e,t){
if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${r.
byteLength}`);r=r.subarray(0,t)}return d2(e,r)}function Ar(r,e){const t=r.lo+e.lo>>>0,n=r.hi+e.hi+(t<r.lo?1:0)>>>0;return{
lo:t,hi:n}}function vt(r,e){const t=r.lo&65535,n=r.lo>>>16,s=e.lo&65535,i=e.lo>>>16,o=t*s,a=t*i,c=n*s,l=n*i,u=(o>>>16)+(a&
65535)+(c&65535)>>>0,d=(u<<16|o&65535)>>>0,h=l+(a>>>16)+(c>>>16)+(u>>>16),p=Math.imul(r.lo,e.hi),m=Math.imul(r.hi,e.lo),
y=h+p+m>>>0;return{lo:d,hi:y}}function xn(r,e){if(e===0)return r;if(e===32)return{lo:r.hi,hi:r.lo};if(e<32){const s=(r.lo<<
e|r.hi>>>32-e)>>>0,i=(r.hi<<e|r.lo>>>32-e)>>>0;return{lo:s,hi:i}}e-=32;const t=(r.hi<<e|r.lo>>>32-e)>>>0,n=(r.lo<<e|r.hi>>>
32-e)>>>0;return{lo:t,hi:n}}function ge(r,e){return{lo:(r.lo^e.lo)>>>0,hi:(r.hi^e.hi)>>>0}}function yc(r,e){return{lo:r.
hi>>>e-32,hi:0}}function he(r,e){return{lo:r>>>0,hi:e>>>0}}function Zh(r,e){const t=e*8,n=r[t]|r[t+1]<<8|r[t+2]<<16|r[t+
3]<<24,s=r[t+4]|r[t+5]<<8|r[t+6]<<16|r[t+7]<<24;return{lo:n>>>0,hi:s>>>0}}function ef(r){return r=ge(r,yc(r,33)),r=vt(r,
he(3981806797,4283543511)),r=ge(r,yc(r,33)),r=vt(r,he(444984403,3301882366)),r=ge(r,yc(r,33)),r}function g2(r,e=0){let t=he(
e,0),n=he(e,0);const s=r.length,i=Math.floor(s/16),o=he(289559509,2277735313),a=he(658871167,1291169091);for(let h=0;h<i;h++){
let p=Zh(r,h*2),m=Zh(r,h*2+1);p=vt(p,o),p=xn(p,31),p=vt(p,a),t=ge(t,p),t=xn(t,27),t=Ar(t,n),t=Ar(vt(t,he(5,0)),he(1390208809,
0)),m=vt(m,a),m=xn(m,33),m=vt(m,o),n=ge(n,m),n=xn(n,31),n=Ar(n,t),n=Ar(vt(n,he(5,0)),he(944331445,0))}let c=he(0,0),l=he(
0,0);const u=r.slice(i*16);switch(u.length){case 15:l=ge(l,he(0,u[14]<<16));case 14:l=ge(l,he(0,u[13]<<8));case 13:l=ge(
l,he(0,u[12]));case 12:l=ge(l,he(u[11]<<24,0));case 11:l=ge(l,he(u[10]<<16,0));case 10:l=ge(l,he(u[9]<<8,0));case 9:l=ge(
l,he(u[8],0)),l=vt(l,a),l=xn(l,33),l=vt(l,o),n=ge(n,l);case 8:c=ge(c,he(0,u[7]<<24));case 7:c=ge(c,he(0,u[6]<<16));case 6:
c=ge(c,he(0,u[5]<<8));case 5:c=ge(c,he(0,u[4]));case 4:c=ge(c,he(u[3]<<24,0));case 3:c=ge(c,he(u[2]<<16,0));case 2:c=ge(
c,he(u[1]<<8,0));case 1:c=ge(c,he(u[0],0)),c=vt(c,o),c=xn(c,31),c=vt(c,a),t=ge(t,c)}const d=he(s,0);return t=ge(t,d),n=ge(
n,d),t=Ar(t,n),n=Ar(n,t),t=ef(t),n=ef(n),t=Ar(t,n),n=Ar(n,t),new Uint8Array([t.hi>>>24&255,t.hi>>>16&255,t.hi>>>8&255,t.
hi&255,t.lo>>>24&255,t.lo>>>16&255,t.lo>>>8&255,t.lo&255,n.hi>>>24&255,n.hi>>>16&255,n.hi>>>8&255,n.hi&255,n.lo>>>24&255,
n.lo>>>16&255,n.lo>>>8&255,n.lo&255])}const qg=p2({name:"murmur3-128",code:34,encode:r=>g2(r)});let b2=class Tl extends Error{static name="\
NotFoundError";name=Tl.name;static code="ERR_NOT_FOUND";code=Tl.code;constructor(e="Not Found"){super(e)}};class y2{has(e,t){
return Promise.reject(new Error(".has is not implemented"))}put(e,t,n){return Promise.reject(new Error(".put is not impl\
emented"))}async*putMany(e,t){for await(const{cid:n,bytes:s}of e)await this.put(n,s,t),yield n}get(e,t){throw new Error(
".get is not implemented")}async*getMany(e,t){for await(const n of e)yield{cid:n,bytes:this.get(n,t)}}delete(e,t){return Promise.
reject(new Error(".delete is not implemented"))}async*deleteMany(e,t){for await(const n of e)await this.delete(n,t),yield n}async*getAll(e){
throw new Error(".getAll is not implemented")}}class w2 extends y2{put(e,t,n){return n?.signal?.throwIfAborted(),e}get(e,t){
throw t?.signal?.throwIfAborted(),new b2}has(e,t){return t?.signal?.throwIfAborted(),!1}async delete(e,t){t?.signal?.throwIfAborted()}async*getAll(e){
e?.signal?.throwIfAborted()}}function jg(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.
default:r}var wc,tf;function k2(){if(tf)return wc;tf=1;const r=7;wc=class{constructor(){this._bitArrays=[],this._data=[],
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
0),p=~(4294967295<<u+1),m=t(l&p);return h+m-1}_bytePosFor(o,a){const c=Math.floor(o/r),l=c+1;for(;!a&&this._bitArrays.length<
l;)this._bitArrays.push(0);return c}_setBit(o){const a=this._bytePosFor(o,!1);this._bitArrays[a]|=1<<o-a*r}_unsetBit(o){
const a=this._bytePosFor(o,!1);this._bitArrays[a]&=~(1<<o-a*r)}_setInternalPos(o,a,c,l){const u=this._data,d=[a,c];if(l)
this._sortData(),u[o]=d;else{if(u.length)if(u[u.length-1][0]>=a)u.push(d);else if(u[0][0]<=a)u.unshift(d);else{const h=Math.
round(u.length/2);this._data=u.slice(0,h).concat(d).concat(u.slice(h))}else this._data.push(d);this._changedData=!0,this.
_changedLength=!0}}_unsetInternalPos(o){this._data.splice(o,1)}_sortData(){this._changedData&&this._data.sort(n),this._changedData=
!1}bitField(){const o=[];let a=8,c=0,l=0,u;const d=this._bitArrays.slice();for(;d.length||c;){c===0&&(u=d.shift(),c=7);const p=Math.
min(c,a),m=~(255<<p),y=u&m;l|=y<<8-a,u=u>>>p,c-=p,a-=p,(!a||!c&&!d.length)&&(o.push(l),l=0,a=8)}for(var h=o.length-1;h>0&&
o[h]===0;h--)o.pop();return o}compactArray(){return this._sortData(),this._data.map(s)}};function e(i,o){return i+t(o)}function t(i){
let o=i;return o=o-(o>>1&1431655765),o=(o&858993459)+(o>>2&858993459),(o+(o>>4)&252645135)*16843009>>24}function n(i,o){
return i[0]-o[0]}function s(i){return i[1]}return wc}var E2=k2();const x2=jg(E2);function Ml(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return nf(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return nf(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function v2(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const rf=4096;function S2(r){const e=r.
length;if(e<=rf)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=rf));return t}function A2(r){return r?.buffer instanceof ArrayBuffer}function nf(r){return A2(r)?r:r.slice()}
function _2(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===
0;)E++,b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=
256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;
for(var T=d.repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.
length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&
C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){
for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var I2=_2,C2=I2;let T2=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},M2=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Gg(this,e)}},
R2=class{decoders;constructor(e){this.decoders=e}or(e){return Gg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Gg(r,e){return new R2({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let B2=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new T2(e,t,n),this.decoder=new M2(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function _a({name:r,prefix:e,encode:t,decode:n}){return new B2(r,e,t,
n)}function yi({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=C2(t,r,n);return _a({prefix:e,
name:r,encode:s,decode:o=>Ml(i(o))})}function L2(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function D2(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function P2(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Fe({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=P2(n,s);return _a(
{prefix:e,name:r,encode(o){return D2(o,n,t)},decode(o){return L2(o,i,t,r)}})}const $2=yi({prefix:"9",name:"base10",alphabet:"\
0123456789"}),N2=Object.freeze(Object.defineProperty({__proto__:null,base10:$2},Symbol.toStringTag,{value:"Module"})),U2=Fe(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),F2=Fe({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),O2=Object.freeze(Object.defineProperty({__proto__:null,
base16:U2,base16upper:F2},Symbol.toStringTag,{value:"Module"})),z2=Fe({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
q2=Object.freeze(Object.defineProperty({__proto__:null,base2:z2},Symbol.toStringTag,{value:"Module"})),Wg=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),j2=Wg.reduce((r,e,t)=>(r[t]=e,r),[]),G2=Wg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function W2(r){return r.reduce((e,t)=>(e+=j2[t],e),"")}function V2(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=G2[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const H2=_a({prefix:"🚀",name:"\
base256emoji",encode:W2,decode:V2}),K2=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:H2},Symbol.toStringTag,
{value:"Module"})),Q2=Fe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
J2=Fe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),X2=Fe(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Y2=Fe({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Z2=Fe({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),e_=Fe({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),t_=Fe({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),r_=Fe({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),n_=Fe({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),s_=Object.freeze(Object.defineProperty({__proto__:null,
base32:Q2,base32hex:Z2,base32hexpad:t_,base32hexpadupper:r_,base32hexupper:e_,base32pad:X2,base32padupper:Y2,base32upper:J2,
base32z:n_},Symbol.toStringTag,{value:"Module"})),i_=yi({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),o_=yi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
a_=Object.freeze(Object.defineProperty({__proto__:null,base36:i_,base36upper:o_},Symbol.toStringTag,{value:"Module"})),c_=yi(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),l_=yi({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),u_=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:c_,base58flickr:l_},Symbol.toStringTag,{value:"Module"})),d_=Fe({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),h_=Fe({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),f_=Fe({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),p_=Fe({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),m_=Object.freeze(Object.defineProperty(
{__proto__:null,base64:d_,base64pad:h_,base64url:f_,base64urlpad:p_},Symbol.toStringTag,{value:"Module"})),g_=Fe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),b_=Object.freeze(Object.defineProperty({__proto__:null,base8:g_},Symbol.
toStringTag,{value:"Module"})),y_=_a({prefix:"\0",name:"identity",encode:r=>S2(Ml(r)),decode:r=>Ml(v2(r))}),w_=Object.freeze(
Object.defineProperty({__proto__:null,identity:y_},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const sf={...w_,...q2,...b_,...N2,...O2,...s_,...a_,...u_,...m_,...K2};function Vg(r=0){return new Uint8Array(r)}function Hg(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const of=Hg("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),kc=Hg("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Vg(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),k_={utf8:of,"utf-8":of,hex:sf.base16,latin1:kc,ascii:kc,binary:kc,...sf};function E_(r,e="utf8"){const t=k_[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}class pt{_options;_popCount;_parent;_posAtParent;_children;key;constructor(e,t,n=0){
this._options=e,this._popCount=0,this._parent=t,this._posAtParent=n,this._children=new x2,this.key=null}async put(e,t){const n=await this.
_findNewBucketAndPos(e);n.bucket._putAt(n,e,t)}async get(e){const t=await this._findChild(e);if(t!=null)return t.value}async del(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);n!=null&&n.key===e&&t.bucket._delAt(t.pos)}leafCount(){return this.
_children.compactArray().reduce((t,n)=>n instanceof pt?t+n.leafCount():t+1,0)}childrenCount(){return this._children.length}onlyChild(){
return this._children.get(0)}*eachLeafSeries(){const e=this._children.compactArray();for(const t of e)t instanceof pt?yield*t.
eachLeafSeries():yield t}serialize(e,t){const n=[];return t(this._children.reduce((s,i,o)=>(i!=null&&(i instanceof pt?s.
push(i.serialize(e,t)):s.push(e(i,o))),s),n))}async asyncTransform(e,t){return Kg(this,e,t)}toJSON(){return this.serialize(
v_,S_)}prettyPrint(){return JSON.stringify(this.toJSON(),null,"  ")}tableSize(){return Math.pow(2,this._options.bits)}async _findChild(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);if(!(n instanceof pt)&&n!=null&&n.key===e)return n}async _findPlace(e){
const t=this._options.hash(typeof e=="string"?E_(e):e),n=await t.take(this._options.bits),s=this._children.get(n);return s instanceof
pt?s._findPlace(t):{bucket:this,pos:n,hash:t,existingChild:s}}async _findNewBucketAndPos(e){const t=await this._findPlace(
e);if(t.existingChild!=null&&t.existingChild.key!==e){const n=new pt(this._options,t.bucket,t.pos);t.bucket._putObjectAt(
t.pos,n);const s=await n._findPlace(t.existingChild.hash);return s.bucket._putAt(s,t.existingChild.key,t.existingChild.value),
n._findNewBucketAndPos(t.hash)}return t}_putAt(e,t,n){this._putObjectAt(e.pos,{key:t,value:n,hash:e.hash})}_putObjectAt(e,t){
this._children.get(e)==null&&this._popCount++,this._children.set(e,t)}_delAt(e){if(e===-1)throw new Error("Invalid posit\
ion");this._children.get(e)!=null&&this._popCount--,this._children.unset(e),this._level()}_level(){if(this._parent!=null&&
this._popCount<=1)if(this._popCount===1){const e=this._children.find(x_);if(e!=null&&!(e instanceof pt)){const t=e.hash;
t.untake(this._options.bits);const n={pos:this._posAtParent,hash:t,bucket:this._parent};this._parent._putAt(n,e.key,e.value)}}else
this._parent._delAt(this._posAtParent)}_at(e){return this._children.get(e)}}function x_(r){return!!r}function v_(r,e){return r.
key}function S_(r){return r}async function Kg(r,e,t){const n=[];for(const s of r._children.compactArray())if(s instanceof
pt)await Kg(s,e,t);else{const i=await e(s);n.push({bitField:r._children.bitField(),children:i})}return t(n)}function A_(r){
return r?.buffer instanceof ArrayBuffer}function __(r){if(A_(r))return r;const e=r.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function I_(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=Vg(e);let n=0;for(const s of r)t.set(
s,n),n+=s.length;return __(t)}const C_=[255,254,252,248,240,224,192,128],T_=[1,3,7,15,31,63,127,255];class M_{_value;_currentBytePos;_currentBitPos;constructor(e){
this._value=e,this._currentBytePos=e.length-1,this._currentBitPos=7}availableBits(){return this._currentBitPos+1+this._currentBytePos*
8}totalBits(){return this._value.length*8}take(e){let t=e,n=0;for(;t>0&&this._haveBits();){const s=this._value[this._currentBytePos],
i=this._currentBitPos+1,o=Math.min(i,t),a=R_(s,i-o,o);n=(n<<o)+a,t-=o,this._currentBitPos-=o,this._currentBitPos<0&&(this.
_currentBitPos=7,this._currentBytePos--)}return n}untake(e){for(this._currentBitPos+=e;this._currentBitPos>7;)this._currentBitPos-=
8,this._currentBytePos+=1}_haveBits(){return this._currentBytePos>=0}}function R_(r,e,t){const n=B_(e,t);return(r&n)>>>e}
function B_(r,e){return C_[r]&T_[Math.min(e+r-1,7)]}function L_(r){function e(t){return t instanceof af?t:new af(t,r)}return e}
class af{_value;_hashFn;_depth;_availableBits;_currentBufferIndex;_buffers;constructor(e,t){if(!(e instanceof Uint8Array))
throw new Error("can only hash Uint8Arrays");this._value=e,this._hashFn=t,this._depth=-1,this._availableBits=0,this._currentBufferIndex=
0,this._buffers=[]}async take(e){let t=e;for(;this._availableBits<t;)await this._produceMoreBits();let n=0;for(;t>0;){const s=this.
_buffers[this._currentBufferIndex],i=Math.min(s.availableBits(),t),o=s.take(i);n=(n<<i)+o,t-=i,this._availableBits-=i,s.
availableBits()===0&&this._currentBufferIndex++}return n}untake(e){let t=e;for(;t>0;){const n=this._buffers[this._currentBufferIndex],
s=Math.min(n.totalBits()-n.availableBits(),t);n.untake(s),t-=s,this._availableBits+=s,this._currentBufferIndex>0&&n.totalBits()===
n.availableBits()&&(this._depth--,this._currentBufferIndex--)}}async _produceMoreBits(){this._depth++;const e=this._depth>
0?I_([this._value,Uint8Array.from([this._depth])]):this._value,t=await this._hashFn(e),n=new M_(t);this._buffers.push(n),
this._availableBits+=n.availableBits()}}function Qg(r){if(r==null||r.hashFn==null)throw new Error("please define an opti\
ons.hashFn");const e={bits:r.bits??8,hash:L_(r.hashFn)};return new pt(e)}async function D_(r){return(await qg.encode(r)).
slice(0,8).reverse()}class P_ extends ni{bucket;constructor(e,t){super(e,t),this.bucket=Qg({hashFn:D_,bits:t.shardFanoutBits??
bg})}async put(e,t){this.cid=void 0,this.size=void 0,this.nodeSize=void 0,await this.bucket.put(e,t)}async get(e){return this.
bucket.get(e)}childCount(){return this.bucket.leafCount()}directChildrenCount(){return this.bucket.childrenCount()}onlyChild(){
return this.bucket.onlyChild()}*eachChildSeries(){for(const{key:e,value:t}of this.bucket.eachLeafSeries())yield{key:e,child:t}}async estimateNodeSize(){
if(this.nodeSize!==void 0)return this.nodeSize;const e=new w2,t=await Yg(this.bucket,this,e,this.options);return this.nodeSize=
t.size,this.nodeSize}async*flush(e){for await(const t of Jg(this.bucket,e,this,this.options))yield{...t,path:this.path}}}
async function*Jg(r,e,t,n){const s=r._children,i=(r.tableSize()-1).toString(16).length,o=[];let a=0n;for(let m=0;m<s.length;m++){
const y=s.get(m);if(y==null)continue;const g=m.toString(16).toUpperCase().padStart(i,"0");if(y instanceof pt){let f;for await(const b of Jg(
y,e,null,n))f=b;if(f==null)throw new Error("Could not flush sharded directory, no sub-shard found");o.push({Name:g,Tsize:Number(
f.size),Hash:f.cid}),a+=f.size}else if(Xg(y.value)){const f=y.value;let b;for await(const E of f.flush(e))b=E,yield b;if(b==
null)throw new Error("Did not flush dir");const w=g+y.key;o.push({Name:w,Tsize:Number(b.size),Hash:b.cid}),a+=b.size}else{
const f=y.value;if(f.cid==null)continue;const b=g+y.key,w=f.size;o.push({Name:b,Tsize:Number(w),Hash:f.cid}),a+=BigInt(w??
0)}}const c=Uint8Array.from(s.bitField().reverse()),l=new it({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),
hashType:gg,mtime:t?.mtime,mode:t?.mode}),u={Data:l.marshal(),Links:o},d=Xt(Jt(u),n),h=await Kr(d,e,n),p=BigInt(d.byteLength)+
a;yield{cid:h,unixfs:l,size:p}}function Xg(r){return typeof r.flush=="function"}async function Yg(r,e,t,n){const s=r._children,
i=(r.tableSize()-1).toString(16).length,o=[];let a=0;for(let h=0;h<s.length;h++){const p=s.get(h);if(p==null)continue;const m=h.
toString(16).toUpperCase().padStart(i,"0");if(p instanceof pt){const{size:y,cid:g}=await Yg(p,null,t,n);o.push({Name:m,Tsize:Number(
y),Hash:g}),a+=m.length+g.byteLength}else if(Xg(p.value)){const y=p.value,g=y.nodeSize;if(y.cid==null)throw new Error("C\
hild directory has not been persisted");o.push({Name:m+p.key,Tsize:Number(g),Hash:y.cid}),a+=m.length+y.cid.byteLength}else{
const y=p.value,g=m+p.key,f=y.size;o.push({Name:g,Tsize:Number(f),Hash:y.cid}),a+=m.length+y.cid.byteLength}}const c=Uint8Array.
from(s.bitField().reverse()),l=new it({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),hashType:gg,mtime:e?.
mtime,mode:e?.mode}),u=Xt(Jt({Data:l.marshal(),Links:o}),n);return{cid:await Kr(u,t,n),size:n.shardSplitStrategy==="link\
s-bytes"?a:u.length}}async function Zg(r,e){let t=e;const n=e.options.shardSplitThresholdBytes??yg;e instanceof Ou&&await e.
estimateNodeSize()>n&&(t=await $_(e));const s=t.parent;if(s!=null){if(t!==e){if(r!=null&&(r.parent=t),t.parentKey==null)
throw new Error("No parent key found");await s.put(t.parentKey,t)}return Zg(t,s)}return t}async function $_(r){const e=new P_(
{root:r.root,dir:!0,parent:r.parent,parentKey:r.parentKey,path:r.path,dirty:r.dirty,flat:!1,mtime:r.mtime,mode:r.mode},r.
options);for(const{key:t,child:n}of r.eachChildSeries())await e.put(t,n);return e}const N_=(r="")=>r.split(/(?<!\\)\//).
filter(Boolean);async function U_(r,e,t){const n=N_(r.path??""),s=n.length-1;let i=e,o="";for(let a=0;a<n.length;a++){const c=n[a];
o+=`${o!==""?"/":""}${c}`;const l=a===s;if(i.dirty=!0,i.cid=void 0,i.size=void 0,l)await i.put(c,r),e=await Zg(null,i);else{
let u=await i.get(c);(u==null||!(u instanceof ni))&&(u=new Ou({root:!1,dir:!0,parent:i,parentKey:c,path:o,dirty:!0,flat:!0,
mtime:u?.unixfs?.mtime,mode:u?.unixfs?.mode},t)),await i.put(c,u),i=u}}return e}async function*cf(r,e){if(!(r instanceof
ni)){r.unixfs?.isDirectory()===!0&&(yield r);return}yield*r.flush(e)}function F_(r){return async function*(t,n){let s=new Ou(
{root:!0,dir:!0,path:"",dirty:!0,flat:!0},r),i,o=!1;for await(const a of t){if(a==null)continue;const c=`${a.originalPath??
""}`.split("/")[0];c!=null&&c!==""&&(i==null?(i=c,o=!0):i!==c&&(o=!1)),s=await U_(a,s,r),a.unixfs?.isDirectory()!==!0&&(yield a)}
if(r.wrapWithDirectory||o&&s.childCount()>1)yield*cf(s,n);else for(const a of s.eachChildSeries())a!=null&&(yield*cf(a.child,
n))}}async function*O_(r,e,t={}){let n;Symbol.asyncIterator in r||Symbol.iterator in r?n=r:n=[r];let s,i;t.profile==="un\
ixfs-v0-2015"?(t.shardSplitStrategy=t.shardSplitStrategy??"links-bytes",t.cidVersion=t.cidVersion??0,t.rawLeaves=t.rawLeaves??
!1,s=wg,i=174,t.fieldOrder="links-first"):t.profile==="unixfs-v1-2025"&&(t.shardSplitStrategy=t.shardSplitStrategy??"blo\
ck-bytes",t.cidVersion=t.cidVersion??1,t.rawLeaves=t.rawLeaves??!0,s=yx,i=1024,t.fieldOrder="links-first");const o=t.wrapWithDirectory??
vx,a=t.shardSplitThresholdBytes??yg,c=t.shardSplitStrategy??bx,l=t.shardFanoutBits??bg,u=t.cidVersion??mg,d=t.rawLeaves??
xx,h=t.leafType??Sx,p=t.fileImportConcurrency??wx,m=t.blockWriteConcurrency??kx,y=t.reduceSingleLeafToSelf??Ex,g=t.fieldOrder??
Ax,f=t.chunker??kg({chunkSize:s}),b=t.chunkValidator??zA(),w=t.dagBuilder??UA({chunker:f,chunkValidator:b,wrapWithDirectory:o,
layout:t.layout??Fg({maxChildrenPerNode:i}),bufferImporter:t.bufferImporter??sA({cidVersion:u,rawLeaves:d,leafType:h,onProgress:t.
onProgress}),blockWriteConcurrency:m,reduceSingleLeafToSelf:y,cidVersion:u,onProgress:t.onProgress,dirBuilder:t.dirBuilder,
fileBuilder:t.fileBuilder,fieldOrder:g}),E=t.treeBuilder??F_({wrapWithDirectory:o,shardSplitThresholdBytes:a,shardSplitStrategy:c,
shardFanoutBits:l,cidVersion:u,onProgress:t.onProgress,fieldOrder:g});for await(const v of E(fg(w(n,e),p),e))yield{cid:v.
cid,path:v.path,unixfs:v.unixfs,size:v.size}}async function z_(r,e,t={}){const n=await hx(O_([r],e,t));if(n==null)throw new iA(
"Nothing imported");return n}async function q_(r,e,t={}){return z_({content:r},e,t)}function j_(r,e){if(r===e)return!0;if(r.
byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function zu(r){if(r instanceof
Uint8Array&&r.constructor.name==="Uint8Array")return si(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.
isView(r))return si(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function G_(r){return r?.buffer instanceof ArrayBuffer}function si(r){return G_(r)?r:r.slice()}function W_(r,e,t){if(r.
length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),
h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===0;)E++,
b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>
0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;for(var T=d.
repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.length-b)*h+
1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&C!==-1;C--,x++)
k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){for(var I=v-E;I!==
v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(f);if(b)return b;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var V_=W_,H_=V_;let K_=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Q_=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return eb(this,e)}},
J_=class{decoders;constructor(e){this.decoders=e}or(e){return eb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function eb(r,e){return new J_({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let X_=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new K_(e,t,n),this.decoder=new Q_(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function tb({name:r,prefix:e,encode:t,decode:n}){return new X_(r,e,t,
n)}function Ia({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=H_(t,r,n);return tb({prefix:e,
name:r,encode:s,decode:o=>zu(i(o))})}function Y_(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Z_(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function e8(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function yr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=e8(n,s);return tb(
{prefix:e,name:r,encode(o){return Z_(o,n,t)},decode(o){return Y_(o,i,t,r)}})}const ro=yr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});yr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});yr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});yr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Ec=Ia(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ia({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Nr=Ia({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ia({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var t8=rb,lf=128,r8=-128,n8=Math.pow(2,31);function rb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=n8;)e[t++]=r&255|lf,r/=128;for(;r&r8;)e[t++]=r&255|lf,r>>>=7;return e[t]=r|0,rb.bytes=t-n+1,e}var s8=Rl,
i8=128,uf=127;function Rl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Rl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&uf)<<s:(o&uf)*Math.pow(2,s),s+=7}while(o>=i8);return Rl.bytes=i-n,t}var o8=Math.pow(
2,7),a8=Math.pow(2,14),c8=Math.pow(2,21),l8=Math.pow(2,28),u8=Math.pow(2,35),d8=Math.pow(2,42),h8=Math.pow(2,49),f8=Math.
pow(2,56),p8=Math.pow(2,63),m8=function(r){return r<o8?1:r<a8?2:r<c8?3:r<l8?4:r<u8?5:r<d8?6:r<h8?7:r<f8?8:r<p8?9:10},g8={
encode:t8,decode:s8,encodingLength:m8},Fo=g8;function Bl(r,e=0){const t=Fo.decode(r,e),n=Fo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Oo(r,e,t=0){return Fo.encode(r,e,t),e}function zo(r){return Fo.encodingLength(r)}function b8(r,e){const t=e.
byteLength,n=zo(r),s=n+zo(t),i=new Uint8Array(s+t);return Oo(r,i,0),Oo(t,i,n),i.set(e,s),new qu(r,t,e,i)}function nb(r){
const e=zu(r),[t,n]=Bl(e),[s,i]=Bl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new qu(t,s,o,e)}function y8(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&j_(r.bytes,t.bytes)}}let qu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
si(n),this.bytes=si(s)}};function df(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return k8(t,Ll(r),e??Nr.encoder);default:
return E8(t,Ll(r),e??ro.encoder)}}const hf=new WeakMap;function Ll(r){const e=hf.get(r);if(e==null){const t=new Map;return hf.
set(r,t),t}return e}let cn=class Ve{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=si(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ps)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==x8)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ve.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=b8(e,
t);return Ve.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ve.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&y8(e.multihash,n.multihash)}toString(e){return df(this,e)}toJSON(){return{"/":df(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ve)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ve(n,s,i,o??ff(n,s,i.bytes))}else if(t[v8]===!0){const{version:n,
multihash:s,code:i}=t,o=nb(s);return Ve.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ps)throw new Error(`Version 0 CID must use dag-pb (code: ${ps}) block encoding`);return new Ve(e,t,n,n.bytes)}case 1:{
const s=ff(e,t,n.bytes);return new Ve(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ve.
create(0,ps,e)}static createV1(e,t){return Ve.create(1,e,t)}static decode(e){const[t,n]=Ve.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ve.inspectBytes(e),n=t.size-t.multihashSize,
s=zu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new qu(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ve.createV0(o):Ve.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Bl(e.subarray(t));return t+=h,d};let s=n(),
i=ps;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=w8(e,t),
i=Ve.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ll(
i).set(n,e),i}};function w8(r,e){switch(r[0]){case"Q":{const t=e??Nr;return[Nr.prefix,t.decode(`${Nr.prefix}${r}`)]}case Nr.
prefix:{const t=e??Nr;return[Nr.prefix,t.decode(r)]}case ro.prefix:{const t=e??ro;return[ro.prefix,t.decode(r)]}case Ec.
prefix:{const t=e??Ec;return[Ec.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function k8(r,e,t){const{prefix:n}=t;if(n!==
Nr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function E8(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ps=112,x8=18;function ff(r,e,t){const n=zo(r),s=n+zo(e),i=new Uint8Array(s+t.
byteLength);return Oo(r,i,0),Oo(e,i,n),i.set(t,s),i}const v8=Symbol.for("@ipld/js-cid/CID");class ii extends Error{static name="\
BadPathError";static code="ERR_BAD_PATH";name=ii.name;code=ii.code;constructor(e="Bad path"){super(e)}}let pn=class Dl extends Error{static name="\
NotFoundError";static code="ERR_NOT_FOUND";name=Dl.name;code=Dl.code;constructor(e="Not found"){super(e)}};class oi extends Error{static name="\
NoResolverError";static code="ERR_NO_RESOLVER";name=oi.name;code=oi.code;constructor(e="No resolver"){super(e)}}class Me extends Error{static name="\
NotUnixFSError";static code="ERR_NOT_UNIXFS";name=Me.name;code=Me.code;constructor(e="Not UnixFS"){super(e)}}class qo extends Error{static name="\
OverReadError";static code="ERR_OVER_READ";name=qo.name;code=qo.code;constructor(e="Over read"){super(e)}}class jo extends Error{static name="\
UnderReadError";static code="ERR_UNDER_READ";name=jo.name;code=jo.code;constructor(e="Under read"){super(e)}}let Rs=class Pl extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Pl.name;code=Pl.code;constructor(e="Invalid parameters"){super(
e)}};const S8=["Object","Uint8Array","RegExp","Date","Error","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayB\
uffer","DataView","Promise","URL","HTMLElement","Int8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array",
"Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Tagged"];function sb(r){if(r===null)return"\
null";if(r===void 0)return"undefined";if(r===!0||r===!1)return"boolean";const e=typeof r;if(e==="string"||e==="number"||
e==="bigint"||e==="symbol")return e;if(e==="function")return"Function";if(Array.isArray(r))return"Array";if(r instanceof
Uint8Array)return"Uint8Array";if(r.constructor===Object)return"Object";const t=A8(r);return t||"Object"}function A8(r){const e=Object.
prototype.toString.call(r).slice(8,-1);if(S8.includes(e))return e}class A{constructor(e,t,n){this.major=e,this.majorEncoded=
e<<5,this.name=t,this.terminal=n}toString(){return`Type[${this.major}].${this.name}`}compare(e){return this.major<e.major?
-1:this.major>e.major?1:0}static equals(e,t){return e===t||e.major===t.major&&e.name===t.name}}A.uint=new A(0,"uint",!0);
A.negint=new A(1,"negint",!0);A.bytes=new A(2,"bytes",!0);A.string=new A(3,"string",!0);A.array=new A(4,"array",!1);A.map=
new A(5,"map",!1);A.tag=new A(6,"tag",!1);A.float=new A(7,"float",!0);A.false=new A(7,"false",!0);A.true=new A(7,"true",
!0);A.null=new A(7,"null",!0);A.undefined=new A(7,"undefined",!0);A.break=new A(7,"break",!0);class O{constructor(e,t,n){
this.type=e,this.value=t,this.encodedLength=n,this.encodedBytes=void 0,this.byteValue=void 0}toString(){return`Token[${this.
type}].${this.value}`}}const wi=globalThis.process&&!globalThis.process.browser&&globalThis.Buffer&&typeof globalThis.Buffer.
isBuffer=="function",_8=new TextEncoder;function Go(r){return wi&&globalThis.Buffer.isBuffer(r)}function Ca(r){return r instanceof
Uint8Array?Go(r)?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):r:Uint8Array.from(r)}const I8=24,C8=200,ju=wi?r=>r.length>=
I8?globalThis.Buffer.from(r):mf(r):r=>r.length>=C8?_8.encode(r):mf(r),sr=r=>Uint8Array.from(r),T8=wi?(r,e,t)=>Go(r)?new Uint8Array(
r.subarray(e,t)):r.slice(e,t):(r,e,t)=>r.slice(e,t),M8=wi?(r,e)=>(r=r.map(t=>t instanceof Uint8Array?t:globalThis.Buffer.
from(t)),Ca(globalThis.Buffer.concat(r,e))):(r,e)=>{const t=new Uint8Array(e);let n=0;for(let s of r)n+s.length>t.length&&
(s=s.subarray(0,t.length-n)),t.set(s,n),n+=s.length;return t},pf=wi?r=>globalThis.Buffer.allocUnsafe(r):r=>new Uint8Array(
r);function ib(r,e){if(Go(r)&&Go(e))return r.compare(e);for(let t=0;t<r.length;t++)if(r[t]!==e[t])return r[t]<e[t]?-1:1;
return 0}function mf(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=
s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.
charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(s>=55296&&s<=57343&&(s=65533),
e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e}const gf=4096;function R8(r){const e=r.length;if(e<=gf)return String.
fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.slice(n,n+=gf));return t}const B8=256;
class Wo{constructor(e=B8){this.chunkSize=e,this.cursor=0,this.maxCursor=-1,this.chunks=[],this._initReuseChunk=null}reset(){
this.cursor=0,this.maxCursor=-1,this.chunks.length&&(this.chunks=[]),this._initReuseChunk!==null&&(this.chunks.push(this.
_initReuseChunk),this.maxCursor=this._initReuseChunk.length-1)}pushByte(e){let t=this.chunks[this.chunks.length-1];this.
cursor>this.maxCursor&&(t=pf(this.chunkSize),this.chunks.push(t),this.maxCursor+=t.length,this._initReuseChunk===null&&(this.
_initReuseChunk=t));const n=t.length-(this.maxCursor-this.cursor)-1;t[n]=e,this.cursor++}push(e){let t=this.chunks[this.
chunks.length-1];if(this.cursor+e.length<=this.maxCursor+1){const s=t.length-(this.maxCursor-this.cursor)-1;t.set(e,s)}else{
if(t){const s=t.length-(this.maxCursor-this.cursor)-1;s<t.length&&(this.chunks[this.chunks.length-1]=t.subarray(0,s),this.
maxCursor=this.cursor-1)}e.length<64&&e.length<this.chunkSize?(t=pf(this.chunkSize),this.chunks.push(t),this.maxCursor+=
t.length,this._initReuseChunk===null&&(this._initReuseChunk=t),t.set(e,0)):(this.chunks.push(e),this.maxCursor+=e.length)}
this.cursor+=e.length}toBytes(e=!1){let t;if(this.chunks.length===1){const n=this.chunks[0];e&&this.cursor>n.length/2?(t=
this.cursor===n.length?n:n.subarray(0,this.cursor),this._initReuseChunk=null,this.chunks=[]):t=T8(n,0,this.cursor)}else t=
M8(this.chunks,this.cursor);return e&&this.reset(),t}}class L8{constructor(e){this.dest=e,this.cursor=0,this.chunks=[e]}reset(){
this.cursor=0}pushByte(e){if(this.cursor>=this.dest.length)throw new Error("write out of bounds, destination buffer is t\
oo small");this.dest[this.cursor++]=e}push(e){if(this.cursor+e.length>this.dest.length)throw new Error("write out of bou\
nds, destination buffer is too small");this.dest.set(e,this.cursor),this.cursor+=e.length}toBytes(e=!1){const t=this.dest.
subarray(0,this.cursor);return e&&this.reset(),t}}const z="CBOR decode error:",Pn="CBOR encode error:";function ss(r,e,t){
if(r.length-e<t)throw new Error(`${z} not enough data for type`)}const Pe=[24,256,65536,4294967296,BigInt("1844674407370\
9551616")];function mn(r,e,t){ss(r,e,1);const n=r[e];if(t.strict===!0&&n<Pe[0])throw new Error(`${z} integer encoded in \
more bytes than necessary (strict decode)`);return n}function gn(r,e,t){ss(r,e,2);const n=r[e]<<8|r[e+1];if(t.strict===!0&&
n<Pe[1])throw new Error(`${z} integer encoded in more bytes than necessary (strict decode)`);return n}function bn(r,e,t){
ss(r,e,4);const n=r[e]*16777216+(r[e+1]<<16)+(r[e+2]<<8)+r[e+3];if(t.strict===!0&&n<Pe[2])throw new Error(`${z} integer \
encoded in more bytes than necessary (strict decode)`);return n}function yn(r,e,t){ss(r,e,8);const n=r[e]*16777216+(r[e+
1]<<16)+(r[e+2]<<8)+r[e+3],s=r[e+4]*16777216+(r[e+5]<<16)+(r[e+6]<<8)+r[e+7],i=(BigInt(n)<<BigInt(32))+BigInt(s);if(t.strict===
!0&&i<Pe[3])throw new Error(`${z} integer encoded in more bytes than necessary (strict decode)`);if(i<=Number.MAX_SAFE_INTEGER)
return Number(i);if(t.allowBigInt===!0)return i;throw new Error(`${z} integers outside of the safe integer range are not\
 supported`)}function D8(r,e,t,n){return new O(A.uint,mn(r,e+1,n),2)}function P8(r,e,t,n){return new O(A.uint,gn(r,e+1,n),
3)}function $8(r,e,t,n){return new O(A.uint,bn(r,e+1,n),5)}function N8(r,e,t,n){return new O(A.uint,yn(r,e+1,n),9)}function is(r,e){
return bt(r,0,e.value)}function bt(r,e,t){if(t<Pe[0]){const n=Number(t);r.pushByte(e|n)}else if(t<Pe[1]){const n=Number(
t);r.push([e|24,n])}else if(t<Pe[2]){const n=Number(t);r.push([e|25,n>>>8,n&255])}else if(t<Pe[3]){const n=Number(t);r.push(
[e|26,n>>>24&255,n>>>16&255,n>>>8&255,n&255])}else{const n=BigInt(t);if(n<Pe[4]){const s=[e|27,0,0,0,0,0,0,0];let i=Number(
n&BigInt(4294967295)),o=Number(n>>BigInt(32)&BigInt(4294967295));s[8]=i&255,i=i>>8,s[7]=i&255,i=i>>8,s[6]=i&255,i=i>>8,s[5]=
i&255,s[4]=o&255,o=o>>8,s[3]=o&255,o=o>>8,s[2]=o&255,o=o>>8,s[1]=o&255,r.push(s)}else throw new Error(`${z} encountered \
BigInt larger than allowable range`)}}is.encodedSize=function(e){return bt.encodedSize(e.value)};bt.encodedSize=function(e){
return e<Pe[0]?1:e<Pe[1]?2:e<Pe[2]?3:e<Pe[3]?5:9};is.compareTokens=function(e,t){return e.value<t.value?-1:e.value>t.value?
1:0};function U8(r,e,t,n){return new O(A.negint,-1-mn(r,e+1,n),2)}function F8(r,e,t,n){return new O(A.negint,-1-gn(r,e+1,
n),3)}function O8(r,e,t,n){return new O(A.negint,-1-bn(r,e+1,n),5)}const Gu=BigInt(-1),ob=BigInt(1);function z8(r,e,t,n){
const s=yn(r,e+1,n);if(typeof s!="bigint"){const i=-1-s;if(i>=Number.MIN_SAFE_INTEGER)return new O(A.negint,i,9)}if(n.allowBigInt!==
!0)throw new Error(`${z} integers outside of the safe integer range are not supported`);return new O(A.negint,Gu-BigInt(
s),9)}function Wu(r,e){const t=e.value,n=typeof t=="bigint"?t*Gu-ob:t*-1-1;bt(r,e.type.majorEncoded,n)}Wu.encodedSize=function(e){
const t=e.value,n=typeof t=="bigint"?t*Gu-ob:t*-1-1;return n<Pe[0]?1:n<Pe[1]?2:n<Pe[2]?3:n<Pe[3]?5:9};Wu.compareTokens=function(e,t){
return e.value<t.value?1:e.value>t.value?-1:0};function ki(r,e,t,n){ss(r,e,t+n);const s=r.slice(e+t,e+t+n);return new O(
A.bytes,s,t+n)}function q8(r,e,t,n){return ki(r,e,1,t)}function j8(r,e,t,n){return ki(r,e,2,mn(r,e+1,n))}function G8(r,e,t,n){
return ki(r,e,3,gn(r,e+1,n))}function W8(r,e,t,n){return ki(r,e,5,bn(r,e+1,n))}function V8(r,e,t,n){const s=yn(r,e+1,n);
if(typeof s=="bigint")throw new Error(`${z} 64-bit integer bytes lengths not supported`);return ki(r,e,9,s)}function Vo(r){
return r.encodedBytes===void 0&&(r.encodedBytes=A.equals(r.type,A.string)?ju(r.value):r.value),r.encodedBytes}function Ta(r,e){
const t=Vo(e);bt(r,e.type.majorEncoded,t.length),r.push(t)}Ta.encodedSize=function(e){const t=Vo(e);return bt.encodedSize(
t.length)+t.length};Ta.compareTokens=function(e,t){return H8(Vo(e),Vo(t))};function H8(r,e){return r.length<e.length?-1:
r.length>e.length?1:ib(r,e)}const bf=new TextDecoder("utf-8",{ignoreBOM:!0}),K8=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),
Q8=32;function J8(r,e,t,n){if(t-e<Q8){let i="";for(let o=e;o<t;o++){const a=r[o];if(a&128)return n.strictUtf8===!0?yf(r,
e,t):bf.decode(r.subarray(e,t));i+=String.fromCharCode(a)}return i}return n.strictUtf8===!0?yf(r,e,t):bf.decode(r.subarray(
e,t))}function yf(r,e,t){try{return K8.decode(r.subarray(e,t))}catch{throw new Error(`${z} invalid UTF-8 in text string`)}}
function Ei(r,e,t,n,s){const i=t+n;ss(r,e,i);const o=new O(A.string,J8(r,e+t,e+i,s),i);return s.retainStringBytes===!0&&
(o.byteValue=r.slice(e+t,e+i)),o}function X8(r,e,t,n){return Ei(r,e,1,t,n)}function Y8(r,e,t,n){return Ei(r,e,2,mn(r,e+1,
n),n)}function Z8(r,e,t,n){return Ei(r,e,3,gn(r,e+1,n),n)}function eI(r,e,t,n){return Ei(r,e,5,bn(r,e+1,n),n)}function tI(r,e,t,n){
const s=yn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${z} 64-bit integer string lengths not supported`);return Ei(
r,e,9,s,n)}const rI=Ta;function os(r,e,t,n){return new O(A.array,n,t)}function nI(r,e,t,n){return os(r,e,1,t)}function sI(r,e,t,n){
return os(r,e,2,mn(r,e+1,n))}function iI(r,e,t,n){return os(r,e,3,gn(r,e+1,n))}function oI(r,e,t,n){return os(r,e,5,bn(r,
e+1,n))}function aI(r,e,t,n){const s=yn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${z} 64-bit integer array length\
s not supported`);return os(r,e,9,s)}function cI(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${z} indefinite len\
gth items not allowed`);return os(r,e,1,1/0)}function Vu(r,e){bt(r,A.array.majorEncoded,e.value)}Vu.compareTokens=is.compareTokens;
Vu.encodedSize=function(e){return bt.encodedSize(e.value)};function as(r,e,t,n){return new O(A.map,n,t)}function lI(r,e,t,n){
return as(r,e,1,t)}function uI(r,e,t,n){return as(r,e,2,mn(r,e+1,n))}function dI(r,e,t,n){return as(r,e,3,gn(r,e+1,n))}function hI(r,e,t,n){
return as(r,e,5,bn(r,e+1,n))}function fI(r,e,t,n){const s=yn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${z} 64-bit\
 integer map lengths not supported`);return as(r,e,9,s)}function pI(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${z}\
 indefinite length items not allowed`);return as(r,e,1,1/0)}function Hu(r,e){bt(r,A.map.majorEncoded,e.value)}Hu.compareTokens=
is.compareTokens;Hu.encodedSize=function(e){return bt.encodedSize(e.value)};function mI(r,e,t,n){return new O(A.tag,t,1)}
function gI(r,e,t,n){return new O(A.tag,mn(r,e+1,n),2)}function bI(r,e,t,n){return new O(A.tag,gn(r,e+1,n),3)}function yI(r,e,t,n){
return new O(A.tag,bn(r,e+1,n),5)}function wI(r,e,t,n){return new O(A.tag,yn(r,e+1,n),9)}function Ku(r,e){bt(r,A.tag.majorEncoded,
e.value)}Ku.compareTokens=is.compareTokens;Ku.encodedSize=function(e){return bt.encodedSize(e.value)};const Qu=20,Ju=21,
Xu=22,Yu=23;function kI(r,e,t,n){if(n.allowUndefined===!1)throw new Error(`${z} undefined values are not supported`);return n.
coerceUndefinedToNull===!0?new O(A.null,null,1):new O(A.undefined,void 0,1)}function EI(r,e,t,n){if(n.allowIndefinite===
!1)throw new Error(`${z} indefinite length items not allowed`);return new O(A.break,void 0,1)}function Zu(r,e,t){if(t){if(t.
allowNaN===!1&&Number.isNaN(r))throw new Error(`${z} NaN values are not supported`);if(t.allowInfinity===!1&&(r===1/0||r===
-1/0))throw new Error(`${z} Infinity values are not supported`)}return new O(A.float,r,e)}function xI(r,e,t,n){return Zu(
Ra(r,e+1),3,n)}function vI(r,e,t,n){return Zu(Ba(r,e+1),5,n)}function SI(r,e,t,n){return Zu(lb(r,e+1),9,n)}function Ma(r,e,t){
const n=e.value;if(n===!1)r.pushByte(A.float.majorEncoded|Qu);else if(n===!0)r.pushByte(A.float.majorEncoded|Ju);else if(n===
null)r.pushByte(A.float.majorEncoded|Xu);else if(n===void 0)r.pushByte(A.float.majorEncoded|Yu);else{let s,i=!1;(!t||t.float64!==
!0)&&(ed(n),s=Ra(Se,1),n===s||Number.isNaN(n)?(Se[0]=249,r.push(Se.slice(0,3)),i=!0):(td(n),s=Ba(Se,1),n===s&&(Se[0]=250,
r.push(Se.slice(0,5)),i=!0))),i||(cb(n),s=lb(Se,1),Se[0]=251,r.push(Se.slice(0,9)))}}Ma.encodedSize=function(e,t){const n=e.
value;if(n===!1||n===!0||n===null||n===void 0)return 1;if(!t||t.float64!==!0){ed(n);let s=Ra(Se,1);if(n===s||Number.isNaN(
n))return 3;if(td(n),s=Ba(Se,1),n===s)return 5}return 9};const ab=new ArrayBuffer(9),St=new DataView(ab,1),Se=new Uint8Array(
ab,0);function ed(r){if(r===1/0)St.setUint16(0,31744,!1);else if(r===-1/0)St.setUint16(0,64512,!1);else if(Number.isNaN(
r))St.setUint16(0,32256,!1);else{St.setFloat32(0,r);const e=St.getUint32(0),t=(e&2139095040)>>23,n=e&8388607;if(t===255)
St.setUint16(0,31744,!1);else if(t===0)St.setUint16(0,(e&2147483648)>>16|n>>13,!1);else{const s=t-127;s<-24?St.setUint16(
0,0):s<-14?St.setUint16(0,(e&2147483648)>>16|1<<24+s,!1):St.setUint16(0,(e&2147483648)>>16|s+15<<10|n>>13,!1)}}}function Ra(r,e){
if(r.length-e<2)throw new Error(`${z} not enough data for float16`);const t=(r[e]<<8)+r[e+1];if(t===31744)return 1/0;if(t===
64512)return-1/0;if(t===32256)return NaN;const n=t>>10&31,s=t&1023;let i;return n===0?i=s*2**-24:n!==31?i=(s+1024)*2**(n-
25):i=s===0?1/0:NaN,t&32768?-i:i}function td(r){St.setFloat32(0,r,!1)}function Ba(r,e){if(r.length-e<4)throw new Error(`${z}\
 not enough data for float32`);const t=(r.byteOffset||0)+e;return new DataView(r.buffer,t,4).getFloat32(0,!1)}function cb(r){
St.setFloat64(0,r,!1)}function lb(r,e){if(r.length-e<8)throw new Error(`${z} not enough data for float64`);const t=(r.byteOffset||
0)+e;return new DataView(r.buffer,t,8).getFloat64(0,!1)}function AI(r,e){const t=r.value;if(t===!1)return Uint8Array.of(
A.float.majorEncoded|Qu);if(t===!0)return Uint8Array.of(A.float.majorEncoded|Ju);if(t===null)return Uint8Array.of(A.float.
majorEncoded|Xu);if(t===void 0)return Uint8Array.of(A.float.majorEncoded|Yu);if(!e){if(ed(t),t===Ra(Se,1)||Number.isNaN(
t))return Se[0]=249,Se.slice(0,3);if(td(t),t===Ba(Se,1))return Se[0]=250,Se.slice(0,5)}return cb(t),Se[0]=251,Se.slice(0,
9)}function wf(r,e){const t=r,n=e?.float64===!0,s=n?t._keyBytesFloat64:t._keyBytes;if(s!==void 0)return s;const i=AI(r,n);
return n?t._keyBytesFloat64=i:t._keyBytes=i,i}Ma.compareTokens=function(e,t,n){const s=wf(e,n),i=wf(t,n);return s.length!==
i.length?s.length<i.length?-1:1:ib(s,i)};function ae(r,e,t){throw new Error(`${z} encountered invalid minor (${t}) for m\
ajor ${r[e]>>>5}`)}function La(r){return()=>{throw new Error(`${z} ${r}`)}}const U=[];for(let r=0;r<=23;r++)U[r]=ae;U[24]=
D8;U[25]=P8;U[26]=$8;U[27]=N8;U[28]=ae;U[29]=ae;U[30]=ae;U[31]=ae;for(let r=32;r<=55;r++)U[r]=ae;U[56]=U8;U[57]=F8;U[58]=
O8;U[59]=z8;U[60]=ae;U[61]=ae;U[62]=ae;U[63]=ae;for(let r=64;r<=87;r++)U[r]=q8;U[88]=j8;U[89]=G8;U[90]=W8;U[91]=V8;U[92]=
ae;U[93]=ae;U[94]=ae;U[95]=La("indefinite length bytes/strings are not supported");for(let r=96;r<=119;r++)U[r]=X8;U[120]=
Y8;U[121]=Z8;U[122]=eI;U[123]=tI;U[124]=ae;U[125]=ae;U[126]=ae;U[127]=La("indefinite length bytes/strings are not suppor\
ted");for(let r=128;r<=151;r++)U[r]=nI;U[152]=sI;U[153]=iI;U[154]=oI;U[155]=aI;U[156]=ae;U[157]=ae;U[158]=ae;U[159]=cI;for(let r=160;r<=
183;r++)U[r]=lI;U[184]=uI;U[185]=dI;U[186]=hI;U[187]=fI;U[188]=ae;U[189]=ae;U[190]=ae;U[191]=pI;for(let r=192;r<=215;r++)
U[r]=mI;U[216]=gI;U[217]=bI;U[218]=yI;U[219]=wI;U[220]=ae;U[221]=ae;U[222]=ae;U[223]=ae;for(let r=224;r<=243;r++)U[r]=La(
"simple values are not supported");U[244]=ae;U[245]=ae;U[246]=ae;U[247]=kI;U[248]=La("simple values are not supported");
U[249]=xI;U[250]=vI;U[251]=SI;U[252]=ae;U[253]=ae;U[254]=ae;U[255]=EI;const er=[];for(let r=0;r<24;r++)er[r]=new O(A.uint,
r,1);for(let r=-1;r>=-24;r--)er[31-r]=new O(A.negint,r,1);er[64]=new O(A.bytes,new Uint8Array(0),1);er[96]=new O(A.string,
"",1);er[128]=new O(A.array,0,1);er[160]=new O(A.map,0,1);er[244]=new O(A.false,!1,1);er[245]=new O(A.true,!0,1);er[246]=
new O(A.null,null,1);function _I(r){switch(r.type){case A.false:return sr([244]);case A.true:return sr([245]);case A.null:
return sr([246]);case A.bytes:return r.value.length?void 0:sr([64]);case A.string:return r.value===""?sr([96]):void 0;case A.
array:return r.value===0?sr([128]):void 0;case A.map:return r.value===0?sr([160]):void 0;case A.uint:return r.value<24?sr(
[Number(r.value)]):void 0;case A.negint:if(r.value>=-24)return sr([31-Number(r.value)])}}const II={float64:!1,mapSorter:rd,
quickEncodeToken:_I};function CI(){const r=[];return r[A.uint.major]=is,r[A.negint.major]=Wu,r[A.bytes.major]=Ta,r[A.string.
major]=rI,r[A.array.major]=Vu,r[A.map.major]=Hu,r[A.tag.major]=Ku,r[A.float.major]=Ma,r}const $n=CI(),no=new Wo;let so=!1;
class Kn{constructor(e,t){this.obj=e,this.parent=t}includes(e){let t=this;do if(t.obj===e)return!0;while(t=t.parent);return!1}static createCheck(e,t){
if(e&&e.includes(t))throw new Error(`${Pn} object contains circular references`);return new Kn(t,e)}}const _r={null:new O(
A.null,null),undefined:new O(A.undefined,void 0),true:new O(A.true,!0),false:new O(A.false,!1),emptyArray:new O(A.array,
0),emptyMap:new O(A.map,0)},Zt={number(r,e,t,n){return!Number.isInteger(r)||!Number.isSafeInteger(r)?new O(A.float,r):r>=
0?new O(A.uint,r):new O(A.negint,r)},bigint(r,e,t,n){return r>=BigInt(0)?new O(A.uint,r):new O(A.negint,r)},Uint8Array(r,e,t,n){
return new O(A.bytes,r)},string(r,e,t,n){return new O(A.string,r)},boolean(r,e,t,n){return r?_r.true:_r.false},null(r,e,t,n){
return _r.null},undefined(r,e,t,n){return _r.undefined},ArrayBuffer(r,e,t,n){return new O(A.bytes,new Uint8Array(r))},DataView(r,e,t,n){
return new O(A.bytes,new Uint8Array(r.buffer,r.byteOffset,r.byteLength))},Array(r,e,t,n){if(!r.length)return t.addBreakTokens===
!0?[_r.emptyArray,new O(A.break)]:_r.emptyArray;n=Kn.createCheck(n,r);const s=[];let i=0;for(const o of r)s[i++]=Cn(o,t,
n);return t.addBreakTokens?[new O(A.array,r.length),s,new O(A.break)]:[new O(A.array,r.length),s]},Object(r,e,t,n){const s=e!==
"Object",i=s?r.keys():Object.keys(r),o=s?r.size:i.length;let a;if(o){a=new Array(o),n=Kn.createCheck(n,r);const c=!s&&t.
ignoreUndefinedProperties;let l=0;for(const u of i){const d=s?r.get(u):r[u];c&&d===void 0||(a[l++]=[Cn(u,t,n),Cn(d,t,n)])}
l<o&&(a.length=l)}return a?.length?(TI(a,t),t.addBreakTokens?[new O(A.map,a.length),a,new O(A.break)]:[new O(A.map,a.length),
a]):t.addBreakTokens===!0?[_r.emptyMap,new O(A.break)]:_r.emptyMap},Tagged(r,e,t,n){return[new O(A.tag,r.tag),Cn(r.value,
t,n)]}};Zt.Map=Zt.Object;Zt.Buffer=Zt.Uint8Array;for(const r of"Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 Bi\
gInt64 Float32 Float64".split(" "))Zt[`${r}Array`]=Zt.DataView;function Cn(r,e={},t){const n=sb(r),s=e&&e.typeEncoders&&
e.typeEncoders[n]||Zt[n];if(typeof s=="function"){const o=s(r,n,e,t);if(o!=null)return o}const i=Zt[n];if(!i)throw new Error(
`${Pn} unsupported type: ${n}`);return i(r,n,e,t)}function TI(r,e){const t=e.mapSorter;t&&r.sort((n,s)=>t(n,s,e))}function rd(r,e,t){
const n=Array.isArray(r[0])?r[0][0]:r[0],s=Array.isArray(e[0])?e[0][0]:e[0];if(n.type.major!==s.type.major)return n.type.
compare(s.type);const i=n.type.major,o=$n[i].compareTokens(n,s,t);return o===0&&console.warn("WARNING: complex key types\
 used, CBOR key sorting guarantees are gone"),o}function Nn(r,e,t,n){if(Array.isArray(e))for(const s of e)Nn(r,s,t,n);else
t[e.type.major](r,e,n)}const kf=A.uint.majorEncoded,Ef=A.negint.majorEncoded,MI=A.bytes.majorEncoded,RI=A.string.majorEncoded,
xf=A.array.majorEncoded,xc=A.map.majorEncoded,BI=A.float.majorEncoded|Qu,LI=A.float.majorEncoded|Ju,DI=A.float.majorEncoded|
Xu,PI=A.float.majorEncoded|Yu,$I=BigInt(-1),NI=BigInt(1);function Dr(r,e,t){t<24?r.pushByte(e|Number(t)):bt(r,e,t)}function UI(r){
return r.addBreakTokens!==!0}function FI(r,e,t,n,s){const i=t==="Map",o=i?e.keys():Object.keys(e),a=i?e.size:o.length;if(!a){
r.pushByte(xc);return}s=Kn.createCheck(s,e);const c=!i&&n.ignoreUndefinedProperties,l=new Array(a);let u=0;for(const d of o){
const h=i?e.get(d):e[d];c&&h===void 0||(l[u++]=[Cn(d,n,s),h])}if(u===0){r.pushByte(xc);return}u<a&&(l.length=u),l.sort((d,h)=>rd(
d,h,n)),Dr(r,xc,u);for(const[d,h]of l)Nn(r,d,$n,n),Ho(r,h,n,s)}function Ho(r,e,t,n){const s=sb(e),i=t.typeEncoders&&t.typeEncoders[s];
if(i){const o=i(e,s,t,n);if(o!=null){Nn(r,o,$n,t);return}}switch(s){case"null":r.pushByte(DI);return;case"undefined":r.pushByte(
PI);return;case"boolean":r.pushByte(e?LI:BI);return;case"number":!Number.isInteger(e)||!Number.isSafeInteger(e)?Ma(r,new O(
A.float,e),t):e>=0?Dr(r,kf,e):Dr(r,Ef,e*-1-1);return;case"bigint":e>=BigInt(0)?Dr(r,kf,e):Dr(r,Ef,e*$I-NI);return;case"s\
tring":{const o=ju(e);Dr(r,RI,o.length),r.push(o);return}case"Uint8Array":Dr(r,MI,e.length),r.push(e);return;case"Array":
if(!e.length){r.pushByte(xf);return}n=Kn.createCheck(n,e),Dr(r,xf,e.length);for(const o of e)Ho(r,o,t,n);return;case"Obj\
ect":case"Map":if(t.mapSorter===rd)FI(r,e,s,t,n);else{const o=Zt.Object(e,s,t,n);Nn(r,o,$n,t)}return;default:{const o=Zt[s];
if(!o)throw new Error(`${Pn} unsupported type: ${s}`);const a=o(e,s,t,n);Nn(r,a,$n,t)}}}function OI(r,e,t,n){const s=n instanceof
Uint8Array;let i=s?new L8(n):so?new Wo:no;const o=Cn(r,t);if(!Array.isArray(o)&&t.quickEncodeToken){const a=t.quickEncodeToken(
o);if(a)return s?(i.push(a),i.toBytes()):a;const c=e[o.type.major];if(c.encodedSize){const l=c.encodedSize(o,t);if(s||(i=
new Wo(l)),c(i,o,t),i.chunks.length!==1)throw new Error(`Unexpected error: pre-calculated length for ${o} was wrong`);return s?
i.toBytes():Ca(i.chunks[0])}}return i.reset(),Nn(i,o,e,t),i.toBytes(!0)}function oB(r,e){if(e=Object.assign({},II,e),UI(
e)){if(so){const t=new Wo;return Ho(t,r,e,void 0),t.toBytes()}so=!0;try{return no.reset(),Ho(no,r,e,void 0),no.toBytes(!0)}finally{
so=!1}}return OI(r,$n,e)}const zI={strict:!1,allowIndefinite:!0,allowUndefined:!0,allowBigInt:!0};class qI{constructor(e,t={}){
this._pos=0,this.data=e,this.options=t}pos(){return this._pos}done(){return this._pos>=this.data.length}next(){const e=this.
data[this._pos];let t=er[e];if(t===void 0){const n=U[e];if(!n)throw e===void 0?new Error(`${z} not enough data`):new Error(
`${z} no decoder for major type ${e>>>5} (byte 0x${e.toString(16).padStart(2,"0")})`);const s=e&31;t=n(this.data,this._pos,
s,this.options)}return this._pos+=t.encodedLength,t}}const Qr=Symbol.for("DONE"),Jr=Symbol.for("BREAK");function jI(r,e,t){
const n=[];for(let s=0;s<r.value;s++){const i=ln(e,t);if(i===Jr){if(r.value===1/0)break;throw new Error(`${z} got unexpe\
cted break to lengthed array`)}if(i===Qr)throw new Error(`${z} found array but not enough entries (got ${s}, expected ${r.
value})`);n[s]=i}return n}function GI(r,e,t){const n=t.useMaps===!0,s=t.rejectDuplicateMapKeys===!0,i=n?void 0:{},o=n?new Map:
void 0;for(let a=0;a<r.value;a++){const c=ln(e,t);if(c===Jr){if(r.value===1/0)break;throw new Error(`${z} got unexpected\
 break to lengthed map`)}if(c===Qr)throw new Error(`${z} found map but not enough entries (got ${a} [no key], expected ${r.
value})`);if(!n&&typeof c!="string")throw new Error(`${z} non-string keys not supported (got ${typeof c})`);if(s&&(n&&o.
has(c)||!n&&Object.hasOwn(i,c)))throw new Error(`${z} found repeat map key "${c}"`);const l=ln(e,t);if(l===Qr)throw new Error(
`${z} found map but not enough entries (got ${a} [no value], expected ${r.value})`);if(l===Jr)throw new Error(`${z} got \
unexpected break to map value`);n?o.set(c,l):c==="__proto__"?Object.defineProperty(i,c,{value:l,configurable:!0,enumerable:!0,
writable:!0}):i[c]=l}return n?o:i}function*WI(r,e,t){for(let n=0;n<r.value;n++){const s=ln(e,t);if(s===Jr){if(r.value===
1/0)break;throw new Error(`${z} got unexpected break to lengthed map`)}if(s===Qr)throw new Error(`${z} found map but not\
 enough entries (got ${n} [no key], expected ${r.value})`);const i=ln(e,t);if(i===Qr)throw new Error(`${z} found map but\
 not enough entries (got ${n} [no value], expected ${r.value})`);if(i===Jr)throw new Error(`${z} got unexpected break to\
 map value`);yield[s,i]}}function VI(r,e){const t=function(){if(t._called)throw new Error(`${z} tag decode() may only be\
 called once`);t._called=!0;const n=ln(r,e);if(n===Qr)throw new Error(`${z} tag content missing`);if(n===Jr)throw new Error(
`${z} got unexpected break in tag content`);return n};return t.entries=function(){if(t._called)throw new Error(`${z} tag\
 decode() may only be called once`);if(t._called=!0,r.done())throw new Error(`${z} tag content missing`);const n=r.next();
if(!A.equals(n.type,A.map))throw new Error(`${z} entries() requires map content, got ${n.type.name}`);const s=[];for(const i of WI(
n,r,e))s.push(i);return s},t._called=!1,t}function ln(r,e){if(r.done())return Qr;const t=r.next();if(A.equals(t.type,A.break))
return Jr;if(t.type.terminal)return t.value;if(A.equals(t.type,A.array))return jI(t,r,e);if(A.equals(t.type,A.map))return GI(
t,r,e);if(A.equals(t.type,A.tag)){if(e.tags&&typeof e.tags[t.value]=="function"){const n=VI(r,e),s=e.tags[t.value](n);if(!n.
_called)throw new Error(`${z} tag decoder must call decode() or entries()`);return s}throw new Error(`${z} tag not suppo\
rted (${t.value})`)}throw new Error("unsupported")}function HI(r,e){if(!(r instanceof Uint8Array))throw new Error(`${z} \
data to decode must be a Uint8Array`);e=Object.assign({},zI,e);const t=Ca(r),n=e.tokenizer||new qI(t,e),s=ln(n,e);if(s===
Qr)throw new Error(`${z} did not find any content to decode`);if(s===Jr)throw new Error(`${z} got unexpected break`);return[
s,r.subarray(n.pos())]}function ub(r,e){const[t,n]=HI(r,e);if(n.length>0)throw new Error(`${z} too many terminals, data \
makes no sense`);return t}function KI(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function nd(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return ai(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return ai(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function QI(r){return r?.buffer instanceof ArrayBuffer}
function ai(r){return QI(r)?r:r.slice()}function JI(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
E=0,v=f.length;E!==v&&f[E]===0;)E++,b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==
0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-
w;S!==_&&k[S]===0;)S++;for(var T=d.repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.
length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&
C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){
for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var XI=JI,YI=XI;let ZI=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},eC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return db(this,e)}},
tC=class{decoders;constructor(e){this.decoders=e}or(e){return db(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function db(r,e){return new tC({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let rC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new ZI(e,t,n),this.decoder=new eC(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function hb({name:r,prefix:e,encode:t,decode:n}){return new rC(r,e,t,
n)}function Da({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=YI(t,r,n);return hb({prefix:e,
name:r,encode:s,decode:o=>nd(i(o))})}function nC(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function sC(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function iC(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function wr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=iC(n,s);return hb(
{prefix:e,name:r,encode(o){return sC(o,n,t)},decode(o){return nC(o,i,t,r)}})}const io=wr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});wr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});wr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});wr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const vc=Da(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Da({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Ur=Da({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Da({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var oC=fb,vf=128,aC=-128,cC=Math.pow(2,31);function fb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=cC;)e[t++]=r&255|vf,r/=128;for(;r&aC;)e[t++]=r&255|vf,r>>>=7;return e[t]=r|0,fb.bytes=t-n+1,e}var lC=$l,
uC=128,Sf=127;function $l(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw $l.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Sf)<<s:(o&Sf)*Math.pow(2,s),s+=7}while(o>=uC);return $l.bytes=i-n,t}var dC=Math.pow(
2,7),hC=Math.pow(2,14),fC=Math.pow(2,21),pC=Math.pow(2,28),mC=Math.pow(2,35),gC=Math.pow(2,42),bC=Math.pow(2,49),yC=Math.
pow(2,56),wC=Math.pow(2,63),kC=function(r){return r<dC?1:r<hC?2:r<fC?3:r<pC?4:r<mC?5:r<gC?6:r<bC?7:r<yC?8:r<wC?9:10},EC={
encode:oC,decode:lC,encodingLength:kC},Ko=EC;function Nl(r,e=0){const t=Ko.decode(r,e),n=Ko.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Qo(r,e,t=0){return Ko.encode(r,e,t),e}function Jo(r){return Ko.encodingLength(r)}function xC(r,e){const t=e.
byteLength,n=Jo(r),s=n+Jo(t),i=new Uint8Array(s+t);return Qo(r,i,0),Qo(t,i,n),i.set(e,s),new sd(r,t,e,i)}function vC(r){
const e=nd(r),[t,n]=Nl(e),[s,i]=Nl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new sd(t,s,o,e)}function SC(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&KI(r.bytes,t.bytes)}}let sd=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
ai(n),this.bytes=ai(s)}};function Af(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return _C(t,Ul(r),e??Ur.encoder);default:
return IC(t,Ul(r),e??io.encoder)}}const _f=new WeakMap;function Ul(r){const e=_f.get(r);if(e==null){const t=new Map;return _f.
set(r,t),t}return e}let pb=class He{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=ai(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ms)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==CC)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return He.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=xC(e,
t);return He.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return He.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&SC(e.multihash,n.multihash)}toString(e){return Af(this,e)}toJSON(){return{"/":Af(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof He)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new He(n,s,i,o??If(n,s,i.bytes))}else if(t[TC]===!0){const{version:n,
multihash:s,code:i}=t,o=vC(s);return He.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ms)throw new Error(`Version 0 CID must use dag-pb (code: ${ms}) block encoding`);return new He(e,t,n,n.bytes)}case 1:{
const s=If(e,t,n.bytes);return new He(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return He.
create(0,ms,e)}static createV1(e,t){return He.create(1,e,t)}static decode(e){const[t,n]=He.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=He.inspectBytes(e),n=t.size-t.multihashSize,
s=nd(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new sd(t.multihashCode,t.digestSize,i,s);return[t.version===0?He.createV0(o):He.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=Nl(e.subarray(t));return t+=h,d};let s=n(),
i=ms;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=AC(e,t),
i=He.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ul(
i).set(n,e),i}};function AC(r,e){switch(r[0]){case"Q":{const t=e??Ur;return[Ur.prefix,t.decode(`${Ur.prefix}${r}`)]}case Ur.
prefix:{const t=e??Ur;return[Ur.prefix,t.decode(r)]}case io.prefix:{const t=e??io;return[io.prefix,t.decode(r)]}case vc.
prefix:{const t=e??vc;return[vc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function _C(r,e,t){const{prefix:n}=t;if(n!==
Ur.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function IC(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ms=112,CC=18;function If(r,e,t){const n=Jo(r),s=n+Jo(e),i=new Uint8Array(s+t.
byteLength);return Qo(r,i,0),Qo(e,i,n),i.set(t,s),i}const TC=Symbol.for("@ipld/js-cid/CID"),mb=42;function MC(r){return r instanceof
ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}function RC(r){if(r.asCID!==r&&r["/"]!==r.bytes)return null;const e=pb.asCID(
r);if(!e)return null;const t=new Uint8Array(e.bytes.byteLength+1);return t.set(e.bytes,1),[new O(A.tag,mb),new O(A.bytes,
t)]}function BC(){throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")}function LC(r){
if(Number.isNaN(r))throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");if(r===1/0||r===
-1/0)throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");return null}
function DC(r){for(const e of r.keys())if(typeof e!="string"||e.length===0)throw new Error("Non-string Map keys are not \
supported by the IPLD Data Model and cannot be encoded");return null}const PC={typeEncoders:{Map:DC,Object:RC,undefined:BC,
number:LC}};({...PC.typeEncoders});function $C(r){const e=r();if(e[0]!==0)throw new Error("Invalid CID for CBOR tag 42; \
expected leading 0x00");return pb.decode(e.subarray(1))}const Fl={allowIndefinite:!1,coerceUndefinedToNull:!0,allowNaN:!1,
allowInfinity:!1,allowBigInt:!0,strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{[mb]:$C}};({...Fl,tags:{...Fl.tags}});
const gb=113,bb=r=>ub(MC(r),Fl);class hB extends Array{constructor(){super(),this.inRecursive=[]}prefix(e){const t=this.
inRecursive[this.inRecursive.length-1];t&&(A.equals(t.type,A.array)&&(t.elements++,t.elements!==1&&e.push([44])),A.equals(
t.type,A.map)&&(t.elements++,t.elements!==1&&(t.elements%2===1?e.push([44]):e.push([58]))))}[A.uint.major](e,t){this.prefix(
e);const n=String(t.value),s=[];for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);e.push(s)}[A.negint.major](e,t){this[A.uint.
major](e,t)}[A.bytes.major](e,t){throw new Error(`${Pn} unsupported type: Uint8Array`)}[A.string.major](e,t){this.prefix(
e);const n=ju(JSON.stringify(t.value));e.push(n.length>32?Ca(n):n)}[A.array.major](e,t){this.prefix(e),this.inRecursive.
push({type:A.array,elements:0}),e.push([91])}[A.map.major](e,t){this.prefix(e),this.inRecursive.push({type:A.map,elements:0}),
e.push([123])}[A.tag.major](e,t){}[A.float.major](e,t){if(t.type.name==="break"){const o=this.inRecursive.pop();if(o){if(A.
equals(o.type,A.array))e.push([93]);else if(A.equals(o.type,A.map))e.push([125]);else throw new Error("Unexpected recurs\
ive type; this should not happen!");return}throw new Error("Unexpected break; this should not happen!")}if(t.value===void 0)
throw new Error(`${Pn} unsupported type: undefined`);if(this.prefix(e),t.type.name==="true"){e.push([116,114,117,101]);return}else if(t.
type.name==="false"){e.push([102,97,108,115,101]);return}else if(t.type.name==="null"){e.push([110,117,108,108]);return}
if(typeof t.value=="number"&&!Number.isFinite(t.value))throw new Error(`${Pn} unsupported type: ${t.value}`);const n=String(
t.value),s=[];let i=!1;for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o),!i&&(s[o]===46||s[o]===101||s[o]===69)&&(i=!0);i||
(s.push(46),s.push(48)),e.push(s)}}const Cf=1e3;class yb{constructor(e,t={}){this._pos=0,this.data=e,this.options=t,this.
modeStack=["value"],this.lastToken=""}pos(){return this._pos}done(){return this._pos>=this.data.length}ch(){return this.
data[this._pos]}currentMode(){return this.modeStack[this.modeStack.length-1]}skipWhitespace(){let e=this.ch();for(;e===32||
e===9||e===13||e===10;)e=this.data[++this._pos]}expect(e){if(this.data.length-this._pos<e.length)throw new Error(`${z} u\
nexpected end of input at position ${this._pos}`);for(let t=0;t<e.length;t++)if(this.data[this._pos++]!==e[t])throw new Error(
`${z} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`)}parseNumber(){const e=this.
_pos;let t=!1,n=!1;const s=a=>{for(;!this.done();){const c=this.ch();if(a.includes(c))this._pos++;else break}};if(this.ch()===
45&&(t=!0,this._pos++),this.ch()===48)if(this._pos++,this.ch()===46)this._pos++,n=!0;else return new O(A.uint,0,this._pos-
e);if(s([48,49,50,51,52,53,54,55,56,57]),t&&this._pos===e+1)throw new Error(`${z} unexpected token at position ${this._pos}`);
if(!this.done()&&this.ch()===46){if(n)throw new Error(`${z} unexpected token at position ${this._pos}`);n=!0,this._pos++,
s([48,49,50,51,52,53,54,55,56,57])}if(!this.done()&&(this.ch()===101||this.ch()===69)&&(n=!0,this._pos++,!this.done()&&(this.
ch()===43||this.ch()===45)&&this._pos++,s([48,49,50,51,52,53,54,55,56,57])),this._pos-e>Cf)throw new Error(`${z} number \
at position ${e} exceeds ${Cf} characters`);const i=String.fromCharCode.apply(null,this.data.subarray(e,this._pos)),o=parseFloat(
i);if(n){if(this.options.allowInfinity===!1&&!Number.isFinite(o))throw new Error(`${z} Infinity values are not supported`);
return new O(A.float,o,this._pos-e)}if(this.options.allowBigInt!==!0||Number.isSafeInteger(o)){if(!Number.isFinite(o))throw new Error(
`${z} integer at position ${e} is too large for a Number, use allowBigInt`);return new O(o>=0?A.uint:A.negint,o,this._pos-
e)}return new O(o>=0?A.uint:A.negint,BigInt(i),this._pos-e)}parseString(){if(this.ch()!==34)throw new Error(`${z} unexpe\
cted character at position ${this._pos}; this shouldn't happen`);this._pos++;for(let i=this._pos,o=0;i<this.data.length&&
o<65536;i++,o++){const a=this.data[i];if(a===92||a<32||a>=128)break;if(a===34){const c=String.fromCharCode.apply(null,this.
data.subarray(this._pos,i));return this._pos=i+1,new O(A.string,c,o)}}const e=this._pos,t=[],n=()=>{if(this._pos+4>=this.
data.length)throw new Error(`${z} unexpected end of unicode escape sequence at position ${this._pos}`);let i=0;for(let o=0;o<
4;o++){let a=this.ch();if(a>=48&&a<=57)a-=48;else if(a>=97&&a<=102)a=a-97+10;else if(a>=65&&a<=70)a=a-65+10;else throw new Error(
`${z} unexpected unicode escape character at position ${this._pos}`);i=i*16+a,this._pos++}return i},s=()=>{const i=this.
ch();let o=null,a=i>239?4:i>223?3:i>191?2:1;if(this._pos+a>this.data.length)throw new Error(`${z} unexpected unicode seq\
uence at position ${this._pos}`);let c,l,u,d;switch(a){case 1:i<128&&(o=i);break;case 2:c=this.data[this._pos+1],(c&192)===
128&&(d=(i&31)<<6|c&63,d>127&&(o=d));break;case 3:c=this.data[this._pos+1],l=this.data[this._pos+2],(c&192)===128&&(l&192)===
128&&(d=(i&15)<<12|(c&63)<<6|l&63,d>2047&&(d<55296||d>57343)&&(o=d));break;case 4:c=this.data[this._pos+1],l=this.data[this.
_pos+2],u=this.data[this._pos+3],(c&192)===128&&(l&192)===128&&(u&192)===128&&(d=(i&15)<<18|(c&63)<<12|(l&63)<<6|u&63,d>
65535&&d<1114112&&(o=d))}if(o===null){if(this.options.strictUtf8===!0)throw new Error(`${z} invalid UTF-8 in text string\
 at position ${this._pos}`);o=65533,a=1}else o>65535&&(o-=65536,t.push(o>>>10&1023|55296),o=56320|o&1023);t.push(o),this.
_pos+=a};for(;!this.done();){const i=this.ch();let o;switch(i){case 92:if(this._pos++,this.done())throw new Error(`${z} \
unexpected string termination at position ${this._pos}`);switch(o=this.ch(),this._pos++,o){case 34:case 39:case 92:case 47:
t.push(o);break;case 98:t.push(8);break;case 116:t.push(9);break;case 110:t.push(10);break;case 102:t.push(12);break;case 114:
t.push(13);break;case 117:t.push(n());break;default:throw new Error(`${z} unexpected string escape character at position\
 ${this._pos}`)}break;case 34:return this._pos++,new O(A.string,R8(t),this._pos-e);default:if(i<32)throw new Error(`${z}\
 invalid control character at position ${this._pos}`);i<128?(t.push(i),this._pos++):s()}}throw new Error(`${z} unexpecte\
d end of string at position ${this._pos}`)}parseValue(){switch(this.ch()){case 123:return this.modeStack.push("obj-start"),
this._pos++,new O(A.map,1/0,1);case 91:return this.modeStack.push("array-start"),this._pos++,new O(A.array,1/0,1);case 34:
return this.parseString();case 110:return this.expect([110,117,108,108]),new O(A.null,null,4);case 102:return this.expect(
[102,97,108,115,101]),new O(A.false,!1,5);case 116:return this.expect([116,114,117,101]),new O(A.true,!0,4);case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
return this.parseNumber();default:throw new Error(`${z} unexpected character at position ${this._pos}`)}}next(){switch(this.
skipWhitespace(),this.currentMode()){case"value":return this.modeStack.pop(),this.parseValue();case"array-value":{if(this.
modeStack.pop(),this.ch()===93)return this._pos++,this.skipWhitespace(),new O(A.break,void 0,1);if(this.ch()!==44)throw new Error(
`${z} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.
ch())}'`);return this._pos++,this.modeStack.push("array-value"),this.skipWhitespace(),this.parseValue()}case"array-start":
return this.modeStack.pop(),this.ch()===93?(this._pos++,this.skipWhitespace(),new O(A.break,void 0,1)):(this.modeStack.push(
"array-value"),this.skipWhitespace(),this.parseValue());case"obj-key":if(this.ch()===125)return this.modeStack.pop(),this.
_pos++,this.skipWhitespace(),new O(A.break,void 0,1);if(this.ch()!==44)throw new Error(`${z} unexpected character at pos\
ition ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);this._pos++,this.skipWhitespace();case"\
obj-start":{if(this.modeStack.pop(),this.ch()===125)return this._pos++,this.skipWhitespace(),new O(A.break,void 0,1);const e=this.
parseString();if(this.skipWhitespace(),this.ch()!==58)throw new Error(`${z} unexpected character at position ${this._pos}\
, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);return this._pos++,this.modeStack.
push("obj-value"),e}case"obj-value":return this.modeStack.pop(),this.modeStack.push("obj-key"),this.skipWhitespace(),this.
parseValue();default:throw new Error(`${z} unexpected parse state at position ${this._pos}; this shouldn't happen`)}}}function NC(r,e){
return e=Object.assign({tokenizer:new yb(r,e)},e),ub(r,e)}function UC(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)
return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function id(r){if(r instanceof Uint8Array&&r.constructor.
name==="Uint8Array")return ci(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return ci(
new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function FC(r){
return r?.buffer instanceof ArrayBuffer}function ci(r){return FC(r)?r:r.slice()}function OC(r,e,t){if(r.length>=255)throw new TypeError(
"Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(
i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(
256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,
f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,E=0,v=f.length;E!==v&&f[E]===0;)E++,b++;for(var _=(v-E)*p+1>>>
0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>
0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-w;S!==_&&k[S]===0;)S++;for(var T=d.repeat(b);S<_;++S)T+=
r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.
charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;
if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(
w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(f);if(b)return b;throw new Error(`Non-${e} character`)}
return{encode:m,decodeUnsafe:y,decode:g}}var zC=OC,qC=zC;let jC=class{name;prefix;baseEncode;constructor(e,t,n){this.name=
e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},GC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return wb(this,e)}},
WC=class{decoders;constructor(e){this.decoders=e}or(e){return wb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function wb(r,e){return new WC({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let VC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new jC(e,t,n),this.decoder=new GC(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function kb({name:r,prefix:e,encode:t,decode:n}){return new VC(r,e,t,
n)}function Pa({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=qC(t,r,n);return kb({prefix:e,
name:r,encode:s,decode:o=>id(i(o))})}function HC(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function KC(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function QC(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function yt({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=QC(n,s);return kb(
{prefix:e,name:r,encode(o){return KC(o,n,t)},decode(o){return HC(o,i,t,r)}})}const oo=yt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});yt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});yt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});yt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Sc=Pa(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Pa({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Fr=Pa({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Pa({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var JC=Eb,Tf=128,XC=-128,YC=Math.pow(2,31);function Eb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=YC;)e[t++]=r&255|Tf,r/=128;for(;r&XC;)e[t++]=r&255|Tf,r>>>=7;return e[t]=r|0,Eb.bytes=t-n+1,e}var ZC=Ol,
e6=128,Mf=127;function Ol(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Ol.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Mf)<<s:(o&Mf)*Math.pow(2,s),s+=7}while(o>=e6);return Ol.bytes=i-n,t}var t6=Math.pow(
2,7),r6=Math.pow(2,14),n6=Math.pow(2,21),s6=Math.pow(2,28),i6=Math.pow(2,35),o6=Math.pow(2,42),a6=Math.pow(2,49),c6=Math.
pow(2,56),l6=Math.pow(2,63),u6=function(r){return r<t6?1:r<r6?2:r<n6?3:r<s6?4:r<i6?5:r<o6?6:r<a6?7:r<c6?8:r<l6?9:10},d6={
encode:JC,decode:ZC,encodingLength:u6},Xo=d6;function zl(r,e=0){const t=Xo.decode(r,e),n=Xo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Yo(r,e,t=0){return Xo.encode(r,e,t),e}function Zo(r){return Xo.encodingLength(r)}function h6(r,e){const t=e.
byteLength,n=Zo(r),s=n+Zo(t),i=new Uint8Array(s+t);return Yo(r,i,0),Yo(t,i,n),i.set(e,s),new od(r,t,e,i)}function f6(r){
const e=id(r),[t,n]=zl(e),[s,i]=zl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new od(t,s,o,e)}function p6(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&UC(r.bytes,t.bytes)}}class od{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
ci(n),this.bytes=ci(s)}}function Rf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return g6(t,ql(r),e??Fr.encoder);default:
return b6(t,ql(r),e??oo.encoder)}}const Bf=new WeakMap;function ql(r){const e=Bf.get(r);if(e==null){const t=new Map;return Bf.
set(r,t),t}return e}class Le{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.multihash=
n,this.bytes=ci(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
gs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==y6)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Le.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=h6(e,
t);return Le.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Le.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&p6(e.multihash,n.multihash)}toString(e){return Rf(this,e)}toJSON(){return{"/":Rf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Le)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Le(n,s,i,o??Lf(n,s,i.bytes))}else if(t[w6]===!0){const{version:n,
multihash:s,code:i}=t,o=f6(s);return Le.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==gs)throw new Error(`Version 0 CID must use dag-pb (code: ${gs}) block encoding`);return new Le(e,t,n,n.bytes)}case 1:{
const s=Lf(e,t,n.bytes);return new Le(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Le.
create(0,gs,e)}static createV1(e,t){return Le.create(1,e,t)}static decode(e){const[t,n]=Le.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Le.inspectBytes(e),n=t.size-t.multihashSize,
s=id(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new od(t.multihashCode,t.digestSize,i,s);return[t.version===0?Le.createV0(o):Le.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[d,h]=zl(e.subarray(t));return t+=h,d};let s=n(),
i=gs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=m6(e,t),
i=Le.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return ql(
i).set(n,e),i}}function m6(r,e){switch(r[0]){case"Q":{const t=e??Fr;return[Fr.prefix,t.decode(`${Fr.prefix}${r}`)]}case Fr.
prefix:{const t=e??Fr;return[Fr.prefix,t.decode(r)]}case oo.prefix:{const t=e??oo;return[oo.prefix,t.decode(r)]}case Sc.
prefix:{const t=e??Sc;return[Sc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function g6(r,e,t){const{prefix:n}=t;if(n!==
Fr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function b6(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const gs=112,y6=18;function Lf(r,e,t){const n=Zo(r),s=n+Zo(e),i=new Uint8Array(s+t.
byteLength);return Yo(r,i,0),Yo(e,i,n),i.set(t,s),i}const w6=Symbol.for("@ipld/js-cid/CID"),k6=yt({prefix:"m",name:"base\
64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});yt({prefix:"M",name:"bas\
e64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});yt({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});yt({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});function E6(r){
return r instanceof ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}class x6 extends yb{constructor(e,t){super(e,t),this.
tokenBuffer=[]}done(){return this.tokenBuffer.length===0&&super.done()}_next(){return this.tokenBuffer.length>0?this.tokenBuffer.
pop():super.next()}next(){const e=this._next();if(A.equals(e.type,A.map)){const t=this._next();if(A.equals(t.type,A.string)&&
t.value==="/"){const n=this._next();if(A.equals(n.type,A.string)){const s=this._next();if(!A.equals(s.type,A.break))throw new Error(
"Invalid encoded CID form");return this.tokenBuffer.push(n),new O(A.tag,42,0)}if(A.equals(n.type,A.map)){const s=this._next();
if(A.equals(s.type,A.string)&&s.value==="bytes"){const i=this._next();if(A.equals(i.type,A.string)){for(let a=0;a<2;a++){
const c=this._next();if(!A.equals(c.type,A.break))throw new Error("Invalid encoded Bytes form")}const o=k6.decode(`m${i.
value}`);return new O(A.bytes,o,i.value.length)}this.tokenBuffer.push(i)}this.tokenBuffer.push(s)}this.tokenBuffer.push(
n)}this.tokenBuffer.push(t)}return e}}const Df={allowIndefinite:!1,allowUndefined:!1,allowNaN:!1,allowInfinity:!1,allowBigInt:!0,
strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{42:r=>Le.parse(r())}},xb=297,vb=r=>{const e=E6(r),t=Object.assign(Df,
{tokenizer:new x6(e,Df)});return NC(e,t)};new TextDecoder;new TextEncoder;new TextEncoder;const v6=new TextDecoder,Sb=512;
function Ab(r){return JSON.parse(v6.decode(r))}const ad=85,S6=0,_b={code:S6},Ib=81,A6=10;function _6(r=0){return new Uint8Array(
r)}function I6(r){return r?.buffer instanceof ArrayBuffer}function C6(r){if(I6(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Pf(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=_6(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return C6(t)}function T6(r){return r[Symbol.asyncIterator]!=null}function Tt(r){if(T6(r))return(async()=>{
let n=new Uint8Array(0);for await(const s of r)n=Pf([n,s],n.length+s.length);return n})();const e=[];let t=0;for(const n of r)
e.push(n),t+=n.byteLength;return Pf(e,t)}function cd(r){return r==null?!1:cn.asCID(r)===r}function ld(r,e){let t,n=0,s="";
for(;n<e.length;){const i=e[n];if(n++,!Object.hasOwnProperty.call(r,i))throw new ii(`Object did not have key "${i}"`);if(s+=
`/${i}`,t=r[i],r=t,cd(t))break}return{value:t,rest:e.slice(n),path:s.substring(1)}}async function*$f(r,e,t,n){const s=await Tt(
t.get(r,n)),i=bb(s),o=ld(i,e);yield{cid:cd(o.value)?o.value:r,name:o.path,rest:o.rest}}async function*M6(r,e,t,n){const s=await Tt(
t.get(r,n)),i=vb(s),o=ld(i,e);yield{cid:cd(o.value)?o.value:r,name:o.path,rest:o.rest}}function jl(r){return r.type==="D\
IRECTORY"}function Cb(r){return r.type==="FILE"}function Tb(r){return r.type==="RAW"}function Mb(r){return r.type==="SYM\
LINK"}function Un(r){return r.type==="HAMT_SHARD"&&r.data instanceof Uint8Array&&typeof r.fanOut=="bigint"&&typeof r.hashType==
"bigint"}function tn(r){return typeof r.name=="string"&&cn.asCID(r.hash)===r.hash}function*Rb(r){let e={},t={};for(const n of ti.
stream(r))switch(n.field){case".data":{if(n.type==="start"&&(t={}),n.type==="end"){if(jl(t)||Un(t)||Cb(t)||Tb(t)||Mb(t)){
yield t;return}throw new Me("PBNode Data was not a valid UnixFS type")}break}case".data.type":{t.type=n.value;break}case"\
.data.data":{t.data=n.value;break}case".data.fanOut":{t.fanOut=n.value;break}case".data.hashType":{t.hashType=n.value;break}case"\
.links[]":{n.type==="start"&&(e={type:"LINK"}),n.type==="end"&&tn(e)&&(yield e);break}case".links[].name":{e.name=n.value;
break}case".links[].hash":{e.hash=cn.decode(n.value);break}}}const Nf=(r,e)=>r.toString(16).toUpperCase().padStart(e,"0").
substring(0,e),R6=r=>{let e=r.bucket;const t=[];for(;e._parent!=null;)t.push(e),e=e._parent;return t.push(e),t.reverse()};
async function*Gl(r,e,t,n,s,i,o){const a=(i.lastBucket.tableSize()-1).toString(16).length;let c=[];for(const g of e){if(!tn(
g))throw new Me("Invalid link");if(c.push(g),g.name.length===a){const f=parseInt(g.name,16);i.lastBucket._putObjectAt(f,
new pt({hash:i.lastBucket._options.hash,bits:i.lastBucket._options.bits},i.lastBucket,f))}if(g.name.substring(a)===t){yield{
cid:g.hash,name:t,rest:n};return}await i.rootBucket.put(g.name.substring(a),!0)}const l=await i.rootBucket._findNewBucketAndPos(
t);let u=Nf(l.pos,a);const d=R6(l);d.length>i.hamtDepth&&(i.lastBucket=d[i.hamtDepth],u=Nf(i.lastBucket._posAtParent,a));
const h=c.find(g=>g.name==null?!1:g.name===u);if(h==null)return;i.hamtDepth++;const p=await Tt(s.get(h.hash,o));o?.yieldSubShards===
!0&&(yield{cid:h.hash,name:h.name,rest:[t,...n]});const m=Rb(p),{value:y}=m.next();if(c=[],y!=null){if(Un(y)){yield*Gl(y,
m,t,n,s,i,o);return}if(!tn(y))throw new Me("Did not read Link or Data from dag-pb block");c.push(y);for(const g of m){if(Un(
g)){yield*Gl(g,c,t,n,s,i,o);return}if(!tn(g))throw new Me("Did not read Link or Data from dag-pb block");c.push(g)}}}function*Uf(r,e,t){
for(const n of r){if(!tn(n))throw new Me("Invalid link");if(n.name===e[0]){yield{cid:n.hash,name:e[0],rest:e.slice(1)};return}}
throw new pn(`No link "${e[0]}" found under ${t}`)}const B6=async function(r){return(await qg.encode(r)).slice(0,8).reverse()};
async function*Ff(r,e,t,n,s,i){const o=Qg({hashFn:B6,bits:Math.log2(Number(r.fanOut))}),a={rootBucket:o,hamtDepth:1,lastBucket:o};
for await(const c of Gl(r,e,t[0],t.slice(1),s,a,i))if(yield c,c.name===t[0])return;throw new pn(`No link "${t[0]}" found\
 under ${n}`)}async function*L6(r,e,t,n){const s=await Tt(t.get(r,n)),i=[],o=Rb(s),{value:a}=o.next();let c=!1,l=!1;if(a!=
null){if(l=jl(a),c=Un(a),Cb(a)||Tb(a)||Mb(a)){yield{cid:r,name:e[0],rest:e.slice(1)};return}if(l||c&&n?.translateHAMTPath===
!1){yield*Uf(o,e,r);return}if(c){yield*Ff(a,o,e,r,t,n);return}if(!tn(a))throw new Me("Did not read Link or Data from dag\
-pb block");i.push(a);for(const u of o){if(l=jl(u),c=Un(u),l||c&&n?.translateHAMTPath===!1){yield*Uf(i,e,r);return}if(Un(
u)){yield*Ff(u,i,e,r,t,n);return}if(!tn(u))throw new Me("Did not read Link or Data from dag-pb block");i.push(u)}}throw new pn(
`No link "${e[0]}" found under ${r}`)}async function*D6(r,e,t,n){if(e.length!==0)throw new ii(`Cannot load path /${e.join(
"/")} from identity block`)}async function*P6(r,e,t,n){const s=await Tt(t.get(r,n)),i=Ab(s),o=ld(i,e);yield{cid:r,name:o.
path,rest:o.rest}}async function*$6(r,e,t,n){if(e.length!==0)throw new pn(`Cannot load path /${e.join("/")} from raw blo\
ck`)}const N6={[mi]:L6,[ad]:$6,[gb]:$f,[Ib]:$f,[xb]:M6,[_b.code]:D6,[Sb]:P6};async function*U6(r,e,t={}){for(r=r.toString(),
r.startsWith("/ipfs/")&&(r=r.substring(6));r.endsWith("/");)r=r.substring(0,r.length-1);let[n,...s]=r.split(/(?<!\\)\//g).
filter(Boolean),i=cn.parse(n),o=[i],a=`${i}`;for(yield{cid:i,name:a,path:a,roots:o,remainder:s};s.length>0;){const c=N6[i.
code];if(c==null)throw new oi(`No resolver for code ${i.code}`);let l=!1;for await(const u of c(i,s,e,t)){if(i=u.cid,l=!o[o.
length-1].equals(i),s=u.rest,!l)break;o=[...o,u.cid],a=`${a}/${u.name}`,yield{cid:u.cid,name:u.name,path:a,roots:o,remainder:u.
rest}}if(!l)break}if(t?.signal?.throwIfAborted(),s.length!==0)throw new pn(`Could not resolve path /${s.join("/")} under\
 ${r}`)}function F6(r){return r[Symbol.asyncIterator]!=null}function O6(r){if(F6(r))return(async()=>{let t;for await(const n of r)
t=n;return t})();let e;for(const t of r)e=t;return e}async function Of(r,e,t,n,s){const i=await Tt(n.get(r,s)),o=bb(i);return{
type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}async function z6(r,e,t,n,s){const i=await Tt(
n.get(r,s)),o=vb(i);return{type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}function Wl(r,e,t,n){
const s=BigInt(r.length),i=BigInt(e+s);return t>=i||n<e?new Uint8Array(0):(n>=e&&n<i&&(r=r.subarray(0,Number(n-e))),t>=e&&
t<i&&(r=r.subarray(Number(t-e))),r)}const Bb=(r,e=0,t=r)=>{const n=BigInt(r),s=BigInt(e??0);let i=BigInt(t);if(i!==n&&(i=
s+i),i>n&&(i=n),s<0n)throw new Rs("Offset must be greater than or equal to 0");if(s>n)throw new Rs("Offset must be less \
than the file size");if(i<0n)throw new Rs("Length must be greater than or equal to 0");if(i>n)throw new Rs("Length must \
be less than the file size");return{start:s,end:i}};function Lb(r,e){async function*t(n={}){const{start:s,end:i}=Bb(r.length,
n.offset,n.length),o=Wl(r,0n,s,i);n.onProgress?.(new Yt(e,{bytesRead:BigInt(o.byteLength),totalBytes:i-s,fileSize:BigInt(
r.byteLength)})),yield o}return t}async function q6(r,e,t,n,s){const i=nb(r.multihash.bytes);return{type:"identity",cid:r,
name:e,path:t,content:Lb(i.digest,"unixfs:exporter:progress:identity"),size:BigInt(i.bytes.byteLength),node:i.bytes}}async function j6(r,e,t,n,s){
const i=await Tt(n.get(r,s)),o=Ab(i);return{type:"object",cid:r,name:e,path:t,object:o,size:BigInt(i.byteLength),node:i}}
async function G6(r,e,t,n,s){const i=await Tt(n.get(r,s));return{type:"raw",cid:r,name:e,path:t,content:Lb(i,"unixfs:exp\
orter:progress:raw"),size:BigInt(i.length),node:i}}function W6(r,e,t,n){async function*s(i={}){const o=i.offset??0,a=i.length??
e.Links.length,c=e.Links.slice(o,o+a);i.onProgress?.(new Yt("unixfs:exporter:walk:directory",{cid:r})),yield*c.map(l=>({
cid:l.Hash,name:l.Name??"",path:`${n}/${l.Name??""}`,size:BigInt(l.Tsize??0)}))}return s}function V6(r){const[e,t]=r[Symbol.
asyncIterator]!=null?[r[Symbol.asyncIterator](),Symbol.asyncIterator]:[r[Symbol.iterator](),Symbol.iterator],n=[];return{
peek:()=>e.next(),push:s=>{n.push(s)},next:()=>n.length>0?{done:!1,value:n.shift()}:e.next(),[t](){return this}}}function H6(r){
return r[Symbol.asyncIterator]!=null}function K6(r,e){let t=0;if(H6(r))return(async function*(){for await(const c of r)yield e(
c,t++)})();const n=V6(r),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o.then==
"function")return(async function*(){yield await o;for(const c of n)yield e(c,t++)})();const a=e;return(function*(){yield o;
for(const c of n)yield a(c,t++)})()}function It(){const r={};return r.promise=new Promise((e,t)=>{r.resolve=e,r.reject=t}),
r}const Li=globalThis.CustomEvent??Event;async function*Q6(r,e={}){let t=e.concurrency??1/0;t<1&&(t=1/0);const n=e.ordered??
!1,s=new EventTarget,i=[];let o=It(),a=It(),c=!1,l,u=!1,d=!1;s.addEventListener("task-complete",()=>{a.resolve()}),Promise.
resolve().then(async()=>{try{for await(const y of r){if(i.length===t&&(o=It(),await o.promise),u||d)break;const g={done:!1};
i.push(g),y().then(f=>{g.done=!0,g.ok=!0,g.value=f,s.dispatchEvent(new Li("task-complete"))},f=>{g.done=!0,g.err=f,s.dispatchEvent(
new Li("task-complete"))})}c=!0,s.dispatchEvent(new Li("task-complete"))}catch(y){l=y,s.dispatchEvent(new Li("task-compl\
ete"))}});function h(){return n?i[0]?.done:!!i.find(y=>y.done)}function*p(){for(;i.length>0&&i[0].done;){const y=i[0];if(i.
shift(),y.ok)yield y.value;else throw u=!0,o.resolve(),y.err;o.resolve()}}function*m(){for(;h();)for(let y=0;y<i.length;y++)
if(i[y].done){const g=i[y];if(i.splice(y,1),y--,g.ok)yield g.value;else throw u=!0,o.resolve(),g.err;o.resolve()}}try{for(;;){
if(h()||(a=It(),await a.promise),l!=null||(n?yield*p():yield*m(),l!=null))throw l;if(c&&i.length===0)break}}finally{d=!0,
o.resolve()}}let zf=class{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a\
 FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){
return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.top+1&this.mask,!0)}shift(){const e=this.
buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,e}isEmpty(){return this.
buffer[this.btm]===void 0}},Ac=class{size;hwm;head;tail;constructor(e={}){this.hwm=e.splitLimit??16,this.head=new zf(this.
hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?e.byteLength:1}push(e){if(e?.value!=null&&
(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;this.head=t.next=new zf(2*this.head.buffer.
length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.tail.next!=null){const t=this.tail.next;this.
tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.size-=this.calculateSize(e.value)),e}isEmpty(){
return this.head.isEmpty()}},J6=class extends Error{type;code;constructor(e,t){super(e??"The operation was aborted"),this.
type="aborted",this.code=t??"ABORT_ERR"}};function Db(r={}){return X6(t=>{const n=t.shift();if(n==null)return{done:!0};if(n.
error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function X6(r,e){e=e??{};let t=e.onEnd,n=new Ac,s,i,
o,a=It();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,f)=>{i=b=>{i=null,n.push(b);try{g(r(n))}catch(w){
f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=It()})}},l=g=>i!=null?i(g):(n.push(g),s),u=g=>(n=
new Ac,i!=null?i({error:g}):(n.push({error:g}),s)),d=g=>{if(o)return s;if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error(
"objectMode was not true but tried to push non-Uint8Array value");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?u(
g):l({done:!0})),p=()=>(n=new Ac,h(),{done:!0}),m=g=>(h(g),{done:!0});if(s={[Symbol.asyncIterator](){return this},next:c,
return:p,throw:m,push:d,end:h,get readableLength(){return n.size},onEmpty:async g=>{const f=g?.signal;if(f?.throwIfAborted(),
n.isEmpty())return;let b,w;f!=null&&(b=new Promise((E,v)=>{w=()=>{v(new J6)},f.addEventListener("abort",w)}));try{await Promise.
race([a.promise,b])}finally{w!=null&&f!=null&&f?.removeEventListener("abort",w)}}},t==null)return s;const y=s;return s={
[Symbol.asyncIterator](){return this},next(){return y.next()},throw(g){return y.throw(g),t!=null&&(t(g),t=void 0),{done:!0}},
return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:d,end(g){return y.end(g),t!=null&&(t(g),t=void 0),s},
get readableLength(){return y.readableLength},onEmpty:g=>y.onEmpty(g)},s}function Y6(r){return r.reason}function Pb(r,e,t){
if(e==null||r==null)return r;const n=t?.translateError??Y6;if(e.aborted)return r.catch(()=>{}),Promise.reject(n(e));let s;
return Promise.race([r,new Promise((i,o)=>{s=()=>{o(n(e))},e.addEventListener("abort",s)})]).finally(()=>{s!=null&&e.removeEventListener(
"abort",s)})}class Z6{readNext;haveNext;ended;nextResult;error;constructor(){this.ended=!1,this.readNext=It(),this.haveNext=
It()}[Symbol.asyncIterator](){return this}async next(){if(this.nextResult==null&&await this.haveNext.promise,this.nextResult==
null)throw new Error("HaveNext promise resolved but nextResult was undefined");const e=this.nextResult;return this.nextResult=
void 0,this.readNext.resolve(),this.readNext=It(),e}async throw(e){return this.ended=!0,this.error=e,e!=null&&(this.haveNext.
promise.catch(()=>{}),this.haveNext.reject(e)),{done:!0,value:void 0}}async return(){const e={done:!0,value:void 0};return this.
ended=!0,this.nextResult=e,this.haveNext.resolve(),e}async push(e,t){await this._push(e,t)}async end(e,t){e!=null?await this.
throw(e):await this._push(void 0,t)}async _push(e,t){if(e!=null&&this.ended)throw this.error??new Error("Cannot push val\
ue onto an ended pushable");for(;this.nextResult!=null;)await this.readNext.promise;e!=null?this.nextResult={done:!1,value:e}:
(this.ended=!0,this.nextResult={done:!0,value:void 0}),this.haveNext.resolve(),this.haveNext=It(),await Pb(this.readNext.
promise,t?.signal,t)}}function e3(){return new Z6}function t3(r){return r[Symbol.asyncIterator]!=null}async function r3(r,e,t){
try{await Promise.all(r.map(async n=>{for await(const s of n)await e.push(s,{signal:t}),t.throwIfAborted()})),await e.end(
void 0,{signal:t})}catch(n){await e.end(n,{signal:t}).catch(()=>{})}}async function*n3(r){const e=new AbortController,t=e3();
r3(r,t,e.signal).catch(()=>{});try{yield*t}finally{e.abort()}}function*s3(r){for(const e of r)yield*e}function i3(...r){
const e=[];for(const t of r)t3(t)||e.push(t);return e.length===r.length?s3(e):n3(r)}function $b(r,...e){if(r==null)throw new Error(
"Empty pipeline");if(_c(r)){const n=r;r=()=>n.source}else if(Ub(r)||Nb(r)){const n=r;r=()=>n}const t=[r,...e];if(t.length>
1&&_c(t[t.length-1])&&(t[t.length-1]=t[t.length-1].sink),t.length>2)for(let n=1;n<t.length-1;n++)_c(t[n])&&(t[n]=a3(t[n]));
return o3(...t)}const o3=(...r)=>{let e;for(;r.length>0;)e=r.shift()(e);return e},Nb=r=>r?.[Symbol.asyncIterator]!=null,
Ub=r=>r?.[Symbol.iterator]!=null,_c=r=>r==null?!1:r.sink!=null&&r.source!=null,a3=r=>e=>{const t=r.sink(e);if(t?.then!=null){
const n=Db({objectMode:!0});t.then(()=>{n.end()},o=>{n.end(o)});let s;const i=r.source;if(Nb(i))s=async function*(){yield*i,
n.end()};else if(Ub(i))s=function*(){yield*i,n.end()};else throw new Error("Unknown duplex source type - must be Iterabl\
e or AsyncIterable");return i3(n,s())}return r.source};class qf{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&
e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.
top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.
top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.
btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class Ic{size;hwm;head;tail;constructor(e={}){this.hwm=
e.splitLimit??16,this.head=new qf(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?
e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;
this.head=t.next=new qf(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.
tail.next!=null){const t=this.tail.next;this.tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.
size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}let c3=class extends Error{type;code;constructor(e,t){
super(e??"The operation was aborted"),this.type="aborted",this.code=t??"ABORT_ERR"}};function l3(r={}){return u3(t=>{const n=t.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function u3(r,e){
e=e??{};let t=e.onEnd,n=new Ic,s,i,o,a=It();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,f)=>{
i=b=>{i=null,n.push(b);try{g(r(n))}catch(w){f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
It()})}},l=g=>i!=null?i(g):(n.push(g),s),u=g=>(n=new Ic,i!=null?i({error:g}):(n.push({error:g}),s)),d=g=>{if(o)return s;
if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?u(g):l({done:!0})),p=()=>(n=new Ic,h(),{done:!0}),m=g=>(h(g),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:p,throw:m,push:d,end:h,get readableLength(){return n.size},onEmpty:async g=>{
const f=g?.signal;if(f?.throwIfAborted(),n.isEmpty())return;let b,w;f!=null&&(b=new Promise((E,v)=>{w=()=>{v(new c3)},f.
addEventListener("abort",w)}));try{await Promise.race([a.promise,b])}finally{w!=null&&f!=null&&f?.removeEventListener("a\
bort",w)}}},t==null)return s;const y=s;return s={[Symbol.asyncIterator](){return this},next(){return y.next()},throw(g){
return y.throw(g),t!=null&&(t(g),t=void 0),{done:!0}},return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:d,
end(g){return y.end(g),t!=null&&(t(g),t=void 0),s},get readableLength(){return y.readableLength},onEmpty:g=>y.onEmpty(g)},
s}var Cc={exports:{}},jf;function d3(){return jf||(jf=1,(function(r){var e=Object.prototype.hasOwnProperty,t="~";function n(){}
Object.create&&(n.prototype=Object.create(null),new n().__proto__||(t=!1));function s(c,l,u){this.fn=c,this.context=l,this.
once=u||!1}function i(c,l,u,d,h){if(typeof u!="function")throw new TypeError("The listener must be a function");var p=new s(
u,d||c,h),m=t?t+l:l;return c._events[m]?c._events[m].fn?c._events[m]=[c._events[m],p]:c._events[m].push(p):(c._events[m]=
p,c._eventsCount++),c}function o(c,l){--c._eventsCount===0?c._events=new n:delete c._events[l]}function a(){this._events=
new n,this._eventsCount=0}a.prototype.eventNames=function(){var l=[],u,d;if(this._eventsCount===0)return l;for(d in u=this.
_events)e.call(u,d)&&l.push(t?d.slice(1):d);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(u)):
l},a.prototype.listeners=function(l){var u=t?t+l:l,d=this._events[u];if(!d)return[];if(d.fn)return[d.fn];for(var h=0,p=d.
length,m=new Array(p);h<p;h++)m[h]=d[h].fn;return m},a.prototype.listenerCount=function(l){var u=t?t+l:l,d=this._events[u];
return d?d.fn?1:d.length:0},a.prototype.emit=function(l,u,d,h,p,m){var y=t?t+l:l;if(!this._events[y])return!1;var g=this.
_events[y],f=arguments.length,b,w;if(g.fn){switch(g.once&&this.removeListener(l,g.fn,void 0,!0),f){case 1:return g.fn.call(
g.context),!0;case 2:return g.fn.call(g.context,u),!0;case 3:return g.fn.call(g.context,u,d),!0;case 4:return g.fn.call(
g.context,u,d,h),!0;case 5:return g.fn.call(g.context,u,d,h,p),!0;case 6:return g.fn.call(g.context,u,d,h,p,m),!0}for(w=
1,b=new Array(f-1);w<f;w++)b[w-1]=arguments[w];g.fn.apply(g.context,b)}else{var E=g.length,v;for(w=0;w<E;w++)switch(g[w].
once&&this.removeListener(l,g[w].fn,void 0,!0),f){case 1:g[w].fn.call(g[w].context);break;case 2:g[w].fn.call(g[w].context,
u);break;case 3:g[w].fn.call(g[w].context,u,d);break;case 4:g[w].fn.call(g[w].context,u,d,h);break;default:if(!b)for(v=1,
b=new Array(f-1);v<f;v++)b[v-1]=arguments[v];g[w].fn.apply(g[w].context,b)}}return!0},a.prototype.on=function(l,u,d){return i(
this,l,u,d,!1)},a.prototype.once=function(l,u,d){return i(this,l,u,d,!0)},a.prototype.removeListener=function(l,u,d,h){var p=t?
t+l:l;if(!this._events[p])return this;if(!u)return o(this,p),this;var m=this._events[p];if(m.fn)m.fn===u&&(!h||m.once)&&
(!d||m.context===d)&&o(this,p);else{for(var y=0,g=[],f=m.length;y<f;y++)(m[y].fn!==u||h&&!m[y].once||d&&m[y].context!==d)&&
g.push(m[y]);g.length?this._events[p]=g.length===1?g[0]:g:o(this,p)}return this},a.prototype.removeAllListeners=function(l){
var u;return l?(u=t?t+l:l,this._events[u]&&o(this,u)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.
removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=t,a.EventEmitter=a,r.exports=a})(Cc)),Cc.exports}var h3=d3();
const f3=jg(h3);let p3=class Fb extends Error{name="TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(
this,Fb)}};const Gf=r=>r.reason??new DOMException("This operation was aborted.","AbortError");function m3(r,e){const{milliseconds:t,
fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const u=new Promise((d,h)=>{if(typeof t!=
"number"||Math.sign(t)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(o?.
aborted){h(Gf(o));return}if(o&&(c=()=>{h(Gf(o))},o.addEventListener("abort",c,{once:!0})),r.then(d,h),t===Number.POSITIVE_INFINITY)
return;const p=new p3;a=i.setTimeout.call(void 0,()=>{if(n){try{d(n())}catch(m){h(m)}return}typeof r.cancel=="function"&&
r.cancel(),s===!1?d():s instanceof Error?h(s):(p.message=s??`Promise timed out after ${t} milliseconds`,h(p))},t)}).finally(
()=>{u.clear(),c&&o&&o.removeEventListener("abort",c)});return u.clear=()=>{i.clearTimeout.call(void 0,a),a=void 0},u}function g3(r,e,t){
let n=0,s=r.length;for(;s>0;){const i=Math.trunc(s/2);let o=n+i;t(r[o],e)<=0?(n=++o,s-=i+1):s=i}return n}const b3=100;class Wf{#e=[];#r=0;enqueue(e,t){
const{priority:n=0,id:s}=t??{},{size:i}=this,o={priority:n,id:s,run:e};if(i===0){this.#e.length=0,this.#r=0,this.#e.push(
o);return}if(this.#e.at(-1).priority>=n){this.#e.push(o);return}this.#n();const a=g3(this.#e,o,(c,l)=>l.priority-c.priority);
this.#e.splice(a,0,o)}setPriority(e,t){const n=this.#e.findIndex((i,o)=>o>=this.#r&&i.id===e);if(n===-1)throw new ReferenceError(
`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.splice(n,1);this.enqueue(s.run,{priority:t,
id:e})}remove(e){const t=this.#e.findIndex((n,s)=>s<this.#r?!1:typeof e=="string"?n.id===e:n.run===e);t!==-1&&this.#e.splice(
t,1)}dequeue(){if(this.#r===this.#e.length)return;const e=this.#e[this.#r];return this.#r++,this.#r===this.#e.length?(this.#e.
length=0,this.#r=0):this.#r>b3&&this.#r>this.#e.length/2&&this.#n(),e?.run}filter(e){const t=[];for(let n=this.#r;n<this.#e.
length;n++){const s=this.#e[n];s.priority===e.priority&&t.push(s.run)}return t}get size(){return this.#e.length-this.#r}#n(){
this.#r!==0&&(this.#e.splice(0,this.#r),this.#r=0)}}class y3 extends f3{#e;#r;#n=0;#d;#p=!1;#b=!1;#u;#h=0;#a;#f;#c;#i=[];#o=0;#t;#w;#s=0;#m;#l;#B=1n;#k=new Map;#x=new Set;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:Wf,strict:!1,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expe\
cted \`intervalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString()??""}\` (${typeof e.intervalCap})`);
if(e.interval===void 0||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a f\
inite number >= 0, got \`${e.interval?.toString()??""}\` (${typeof e.interval})`);if(e.strict&&e.interval===0)throw new TypeError(
"The `strict` option requires a non-zero `interval`");if(e.strict&&e.intervalCap===Number.POSITIVE_INFINITY)throw new TypeError(
"The `strict` option requires a finite `intervalCap`");if(this.#e=e.carryoverIntervalCount??e.carryoverConcurrencyCount??
!1,this.#r=e.intervalCap===Number.POSITIVE_INFINITY||e.interval===0,this.#d=e.intervalCap,this.#u=e.interval,this.#c=e.strict,
this.#t=new e.queueClass,this.#w=e.queueClass,this.concurrency=e.concurrency,e.timeout!==void 0&&!(Number.isFinite(e.timeout)&&
e.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.
timeout})`);this.timeout=e.timeout,this.#l=e.autoStart===!1,this.#O()}#v(e){for(;this.#o<this.#i.length;){const n=this.#i[this.#o];
if(n!==void 0&&e-n>=this.#u)this.#o++;else break}(this.#o>100&&this.#o>this.#i.length/2||this.#o===this.#i.length)&&(this.#i=
this.#i.slice(this.#o),this.#o=0)}#L(e){this.#c?this.#i.push(e):this.#n++}#D(){this.#c?this.#i.length>this.#o&&this.#i.pop():
this.#n>0&&this.#n--}#S(){return this.#i.length-this.#o}get#P(){return this.#r?!0:this.#c?this.#S()<this.#d:this.#n<this.#d}get#$(){
return this.#s<this.#m}#N(){this.#s--,this.#s===0&&this.emit("pendingZero"),this.#E(),this.emit("next")}#U(){this.#f=void 0,
this.#M(),this.#T()}#F(e){if(this.#c){if(this.#v(e),this.#S()>=this.#d){const n=this.#i[this.#o],s=this.#u-(e-n);return this.#I(
s),!0}return!1}if(this.#a===void 0){const t=this.#h-e;if(t<0)this.#n=this.#e?this.#s:0;else return this.#I(t),!0}return!1}#I(e){
this.#f===void 0&&(this.#f=setTimeout(()=>{this.#U()},e))}#A(){this.#a&&(clearInterval(this.#a),this.#a=void 0)}#C(){this.#f&&
(clearTimeout(this.#f),this.#f=void 0)}#E(){if(this.#t.size===0){if(this.#A(),this.emit("empty"),this.#s===0){if(this.#C(),
this.#c&&this.#o>0){const t=Date.now();this.#v(t)}this.emit("idle")}return!1}let e=!1;if(!this.#l){const t=Date.now(),n=!this.#F(
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
void 0&&(u=m3(Promise.resolve(u),{milliseconds:t.timeout,message:`Task timed out after ${t.timeout}ms (queue has ${this.#s}\
 running, ${this.#t.size} waiting)`})),t.signal){const{signal:h}=t;u=Promise.race([u,new Promise((p,m)=>{l=()=>{m(h.reason)},
h.addEventListener("abort",l,{once:!0}),h.aborted&&l()})])}const d=await u;n(d),this.emit("completed",d)}catch(u){s(u),this.
emit("error",u)}finally{l&&t.signal?.removeEventListener("abort",l),this.#k.delete(i),queueMicrotask(()=>{this.#N()})}};
this.#t.enqueue(a,t);const c=()=>{if(this.#t instanceof Wf){this.#t.remove(a);return}this.#t.remove?.(t.id)};if(t.signal){
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
!1,this.emit("rateLimitCleared"));return}let t;if(this.#c){const s=Date.now();this.#v(s),t=this.#S()}else t=this.#n;const n=t>=
this.#d;n!==e&&(this.#p=n,this.emit(n?"rateLimit":"rateLimitCleared"))}get isRateLimited(){return this.#p}get isSaturated(){
return this.#s===this.#m&&this.#t.size>0||this.isRateLimited&&this.#t.size>0}get runningTasks(){return[...this.#k.values()].
map(e=>({...e,timeoutRemaining:e.timeout?Math.max(0,e.startTime+e.timeout-Date.now()):void 0}))}}async function Ob(r,e,t,n,s,i,o){
if(e instanceof Uint8Array){const l=Wl(e,n,s,i);t.push(l);return}if(e.Data==null)throw new Me("no data in PBNode");let a;
try{a=it.unmarshal(e.Data)}catch(l){throw new Me(l.message)}if(a.data!=null){const l=a.data,u=Wl(l,n,s,i);t.push(u),n+=BigInt(
u.byteLength)}const c=[];if(e.Links.length!==a.blockSizes.length)throw new Me("Inconsistent block sizes and dag links");
for(let l=0;l<e.Links.length;l++){const u=e.Links[l],d=n,h=d+a.blockSizes[l];if((s>=d&&s<h||i>=d&&i<=h||s<d&&i>h)&&c.push(
{link:u,blockStart:n}),n=h,n>i)break}await $b(c,l=>K6(l,u=>async()=>{const d=await Tt(r.get(u.link.Hash,o));return{...u,
block:d}}),l=>Q6(l,{ordered:!0,concurrency:o.blockReadConcurrency??A6}),async l=>{for await(const{link:u,block:d,blockStart:h}of l){
let p;switch(u.Hash.code){case mi:p=Zs(d);break;case ad:p=d;break;default:t.end(new Me(`Unsupported codec: ${u.Hash.code}`));
return}const m=new y3({concurrency:1});m.on("error",y=>{t.end(y)}),m.add(async()=>{o.onProgress?.(new Yt("unixfs:exporte\
r:walk:file",{cid:u.Hash})),await Ob(r,p,t,h,s,i,o)}),await m.onIdle()}}),n>=i&&t.end()}function Vf(r,e,t,n,s){async function*i(o={}){
const a=t.fileSize();if(a===void 0)throw new Error("File was a directory");const{start:c,end:l}=Bb(a,o.offset,o.length);
if(l===0n)return;let u=0n;const d=l-c,h=l3();o.onProgress?.(new Yt("unixfs:exporter:walk:file",{cid:r})),Ob(s,e,h,0n,c,l,
o).catch(p=>{h.end(p)});for await(const p of h)if(p!=null){if(u+=BigInt(p.byteLength),u>d)throw h.end(),new qo("Read too\
 many bytes - the file size reported by the UnixFS data in the root node may be incorrect");u===d&&h.end(),o.onProgress?.(
new Yt("unixfs:exporter:progress:unixfs:file",{bytesRead:u,totalBytes:d,fileSize:a})),yield p}if(u<d)throw new jo("Trave\
rsed entire DAG but did not read enough bytes")}return i}async function*w3(r,e,t,n){let s=-1,i=0;for await(const o of zb(
r,e,t,n))if(s++,!(n.offset!=null&&n.offset<s)&&(yield o,i++,n.length!=null&&n.length===i))return}async function*zb(r,e,t,n){
const s=await Tt(t.get(r,n)),i=ti.decode(s);if(i.data?.fanOut==null)throw new Me("missing fanout");const o=(i.data.fanOut-
1n).toString(16).length;for(const a of i.links){if(a.name==null||a.hash==null)continue;const c=cn.decode(a.hash);if(a.name.
length===o)yield*zb(c,e,t,n);else{const l=a.name.substring(o);yield{cid:c,name:a.name.substring(o),path:`${e}/${l}`,size:BigInt(
a.tSize??0)}}}}function k3(r,e,t,n,s){function i(o={}){return o.onProgress?.(new Yt("unixfs:exporter:walk:hamt-sharded-d\
irectory",{cid:r})),w3(r,n,s,o)}return i}const E3={raw:Vf,file:Vf,directory:W6,"hamt-sharded-directory":k3,metadata:(r,e,t,n)=>()=>[],
symlink:(r,e,t,n)=>()=>[]};async function x3(r,e,t,n,s){const i=await Tt(n.get(r,s));let o;try{o=Zs(i)}catch(l){throw new Me(
l.message)}if(o.Data==null)throw new Me("no data in PBNode");let a;try{a=it.unmarshal(o.Data)}catch(l){throw new Me(l.message)}
const c=E3[a.type](r,o,a,t,n);if(c==null)throw new pn("could not find content exporter");return a.isDirectory()?{type:"d\
irectory",cid:r,name:e,path:t,entries:c,unixfs:a,node:o,size:BigInt(i.byteLength)}:{type:"file",cid:r,name:e,path:t,content:c,
unixfs:a,node:o,size:a.fileSize()}}const v3={[mi]:x3,[ad]:G6,[gb]:Of,[Ib]:Of,[xb]:z6,[_b.code]:q6,[Sb]:j6};async function Hf(r,e,t={}){
let n,s;if(r instanceof String||typeof r=="string"){const o=await O6(U6(r,e,t));if(o==null)throw new pn(`Could not walk \
path to ${r}`);n=o.cid,s=o.name,r=o.path}else if(cn.asCID(r)===r||r instanceof cn)n=r,s=r=n.toString();else throw new Rs(
"Path must be string or CID");const i=v3[n.code];if(i==null)throw new oi(`No resolver for code ${n.code}`);return i(n,s,
r,e,t)}function Vl(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return Qf(r);if(r instanceof ArrayBuffer)
return new Uint8Array(r);if(ArrayBuffer.isView(r))return Qf(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error(
"Unknown type, must be binary type")}function S3(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}const Kf=4096;function A3(r){const e=r.length;if(e<=Kf)return String.fromCharCode.apply(String,r);let t="",n=0;
for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=Kf));return t}function _3(r){return r?.buffer instanceof ArrayBuffer}
function Qf(r){return _3(r)?r:r.slice()}function I3(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,d=r.charAt(0),h=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var b=0,w=0,
E=0,v=f.length;E!==v&&f[E]===0;)E++,b++;for(var _=(v-E)*p+1>>>0,k=new Uint8Array(_);E!==v;){for(var x=f[E],C=0,I=_-1;(x!==
0||C<w)&&I!==-1;I--,C++)x+=256*k[I]>>>0,k[I]=x%u>>>0,x=x/u>>>0;if(x!==0)throw new Error("Non-zero carry");w=C,E++}for(var S=_-
w;S!==_&&k[S]===0;)S++;for(var T=d.repeat(b);S<_;++S)T+=r.charAt(k[S]);return T}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var b=0;if(f[b]!==" "){for(var w=0,E=0;f[b]===d;)w++,b++;for(var v=(f.
length-b)*h+1>>>0,_=new Uint8Array(v);f[b];){var k=n[f.charCodeAt(b)];if(k===255)return;for(var x=0,C=v-1;(k!==0||x<E)&&
C!==-1;C--,x++)k+=u*_[C]>>>0,_[C]=k%256>>>0,k=k/256>>>0;if(k!==0)throw new Error("Non-zero carry");E=x,b++}if(f[b]!==" "){
for(var I=v-E;I!==v&&_[I]===0;)I++;for(var S=new Uint8Array(w+(v-I)),T=w;I!==v;)S[T++]=_[I++];return S}}}function g(f){var b=y(
f);if(b)return b;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:g}}var C3=I3,T3=C3;class M3{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class R3{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return qb(this,e)}}class B3{decoders;constructor(e){
this.decoders=e}or(e){return qb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function qb(r,e){return new B3({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}class L3{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){
this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new M3(e,t,n),this.decoder=new R3(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function $a({name:r,prefix:e,encode:t,decode:n}){
return new L3(r,e,t,n)}function xi({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=T3(t,r,n);
return $a({prefix:e,name:r,encode:s,decode:o=>Vl(i(o))})}function D3(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function P3(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function $3(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Oe({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=$3(n,s);return $a(
{prefix:e,name:r,encode(o){return P3(o,n,t)},decode(o){return D3(o,i,t,r)}})}const N3=xi({prefix:"9",name:"base10",alphabet:"\
0123456789"}),U3=Object.freeze(Object.defineProperty({__proto__:null,base10:N3},Symbol.toStringTag,{value:"Module"})),F3=Oe(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),O3=Oe({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),z3=Object.freeze(Object.defineProperty({__proto__:null,
base16:F3,base16upper:O3},Symbol.toStringTag,{value:"Module"})),q3=Oe({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
j3=Object.freeze(Object.defineProperty({__proto__:null,base2:q3},Symbol.toStringTag,{value:"Module"})),jb=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),G3=jb.reduce((r,e,t)=>(r[t]=e,r),[]),W3=jb.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function V3(r){return r.reduce((e,t)=>(e+=G3[t],e),"")}function H3(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=W3[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const K3=$a({prefix:"🚀",name:"\
base256emoji",encode:V3,decode:H3}),Q3=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:K3},Symbol.toStringTag,
{value:"Module"})),J3=Oe({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
X3=Oe({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Y3=Oe(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Z3=Oe({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),e5=Oe({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),t5=Oe({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),r5=Oe({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),n5=Oe({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),s5=Oe({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),i5=Object.freeze(Object.defineProperty({__proto__:null,
base32:J3,base32hex:e5,base32hexpad:r5,base32hexpadupper:n5,base32hexupper:t5,base32pad:Y3,base32padupper:Z3,base32upper:X3,
base32z:s5},Symbol.toStringTag,{value:"Module"})),o5=xi({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),a5=xi({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
c5=Object.freeze(Object.defineProperty({__proto__:null,base36:o5,base36upper:a5},Symbol.toStringTag,{value:"Module"})),l5=xi(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),u5=xi({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),d5=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:l5,base58flickr:u5},Symbol.toStringTag,{value:"Module"})),h5=Oe({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),f5=Oe({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),p5=Oe({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),m5=Oe({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),g5=Object.freeze(Object.defineProperty(
{__proto__:null,base64:h5,base64pad:f5,base64url:p5,base64urlpad:m5},Symbol.toStringTag,{value:"Module"})),b5=Oe({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),y5=Object.freeze(Object.defineProperty({__proto__:null,base8:b5},Symbol.
toStringTag,{value:"Module"})),w5=$a({prefix:"\0",name:"identity",encode:r=>A3(Vl(r)),decode:r=>Vl(S3(r))}),k5=Object.freeze(
Object.defineProperty({__proto__:null,identity:w5},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Jf={...k5,...j3,...y5,...U3,...z3,...i5,...c5,...d5,...g5,...Q3};function E5(r=0){return new Uint8Array(r)}function Gb(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const Xf=Gb("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Tc=Gb("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=E5(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),Wb={utf8:Xf,"utf-8":Xf,hex:Jf.base16,latin1:Tc,ascii:Tc,binary:Tc,...Jf};function x5(r,e="utf8"){const t=Wb[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function v5(r,e="ut\
f8"){const t=Wb[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}const ar="\
/",Vb=new TextEncoder().encode(ar),Di=Vb[0];class ut{_buf;constructor(e,t){if(typeof e=="string")this._buf=x5(e);else if(e instanceof
Uint8Array)this._buf=e;else throw new Error("Invalid key, should be String of Uint8Array");if(t==null&&(t=!0),t&&this.clean(),
this._buf.byteLength===0||this._buf[0]!==Di)throw new Error("Invalid key")}toString(e="utf8"){return v5(this._buf,e)}uint8Array(){
return this._buf}get[Symbol.toStringTag](){return`Key(${this.toString()})`}static withNamespaces(e){return new ut(e.join(
ar))}static random(){return new ut(Math.random().toString().substring(2))}static asKey(e){return e instanceof Uint8Array||
typeof e=="string"?new ut(e):typeof e.uint8Array=="function"?new ut(e.uint8Array()):null}clean(){if((this._buf==null||this.
_buf.byteLength===0)&&(this._buf=Vb),this._buf[0]!==Di){const e=new Uint8Array(this._buf.byteLength+1);e.fill(Di,0,1),e.
set(this._buf,1),this._buf=e}for(;this._buf.byteLength>1&&this._buf[this._buf.byteLength-1]===Di;)this._buf=this._buf.subarray(
0,-1)}less(e){const t=this.list(),n=e.list();for(let s=0;s<t.length;s++){if(n.length<s+1)return!1;const i=t[s],o=n[s];if(i<
o)return!0;if(i>o)return!1}return t.length<n.length}reverse(){return ut.withNamespaces(this.list().slice().reverse())}namespaces(){
return this.list()}baseNamespace(){const e=this.namespaces();return e[e.length-1]}list(){return this.toString().split(ar).
slice(1)}type(){return S5(this.baseNamespace())}name(){return A5(this.baseNamespace())}instance(e){return new ut(this.toString()+
":"+e)}path(){let e=this.parent().toString();return e.endsWith(ar)||(e+=ar),e+=this.type(),new ut(e)}parent(){const e=this.
list();return e.length===1?new ut(ar):new ut(e.slice(0,-1).join(ar))}child(e){return this.toString()===ar?e:e.toString()===
ar?this:new ut(this.toString()+e.toString(),!1)}isAncestorOf(e){return e.toString()===this.toString()?!1:e.toString().startsWith(
this.toString())}isDecendantOf(e){return e.toString()===this.toString()?!1:this.toString().startsWith(e.toString())}isTopLevel(){
return this.list().length===1}concat(...e){return ut.withNamespaces([...this.namespaces(),..._5(e.map(t=>t.namespaces()))])}}
function S5(r){const e=r.split(":");return e.length<2?"":e.slice(0,-1).join(":")}function A5(r){const e=r.split(":");return e[e.
length-1]}function _5(r){return[].concat(...r)}const I5="peercompute-ipfs-artifacts-v1-",Hl=["blocks","roots","routing"],
Hb=r=>r instanceof Uint8Array?r.byteLength:new TextEncoder().encode(JSON.stringify(r)).byteLength,Mc=r=>r===void 0?void 0:
structuredClone(r),ao=()=>({bytes:0,entries:0,generation:0});function Kb(r,e,t,{maximumBytes:n=Number.MAX_SAFE_INTEGER,maximumEntries:s=Number.
MAX_SAFE_INTEGER}={}){const i={bytes:r.bytes-(e?.size||0)+t,entries:r.entries+(e?0:1),generation:(r.generation||0)+1};if(Object.
values(i).some(o=>!Number.isSafeInteger(o)||o<0))throw new RangeError("Artifact storage accounting exceeds safe integer \
range.");if(i.bytes>n||i.entries>s)throw new DOMException("Artifact storage quota exceeded.","QuotaExceededError");return i}
class C5{constructor({name:e="memory"}={}){this.name=e,this.data=new Map(Hl.map(t=>[t,new Map])),this.usage=new Map(Hl.map(
t=>[t,ao()]))}async open(){}async close(){}async get(e,t){return Mc(this.data.get(e).get(t)?.value)}async getUsage(e){return{
...this.usage.get(e)}}async put(e,t,n,s){const i=this.data.get(e),o=i.get(t);if(e==="blocks"&&o)return!1;const a=Hb(n),c=Kb(
this.usage.get(e),o,a,s);return i.set(t,{value:Mc(n),size:a,generation:c.generation}),this.usage.set(e,c),!0}async delete(e,t){
const n=this.data.get(e),s=n.get(t);if(!s)return!1;const i=this.usage.get(e);return this.usage.set(e,{...i,bytes:i.bytes-
s.size,entries:i.entries-1}),n.delete(t),!0}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return[...this.data.get(
e).keys()].sort().filter(i=>t===void 0||i>t).slice(0,n).map(i=>({key:i,generation:this.data.get(e).get(i).generation,...s?
{}:{value:Mc(this.data.get(e).get(i).value)}}))}}function Gt(r){return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.
onerror=()=>t(r.error)})}class T5{constructor({name:e="default",indexedDBImpl:t=globalThis.indexedDB,keyRange:n=globalThis.
IDBKeyRange}={}){this.name=`${I5}${e}`,this.indexedDB=t,this.keyRange=n,this.database=null,this.opening=null}async open(){
if(!this.database){if(this.opening)return this.opening;if(!this.indexedDB?.open||!this.keyRange)throw new Error("Persist\
ent artifacts require IndexedDB and IDBKeyRange.");this.opening=new Promise((e,t)=>{const n=this.indexedDB.open(this.name,
1);let s=!1;n.onupgradeneeded=()=>{for(const i of[...Hl,"usage"])n.result.createObjectStore(i)},n.onerror=()=>t(n.error),
n.onblocked=()=>{s=!0,t(new Error("Artifact database open blocked by another context."))},n.onsuccess=()=>{if(s){n.result.
close();return}this.database=n.result,this.database.onversionchange=()=>{this.database?.close(),this.database=null},e()}});
try{await this.opening}finally{this.opening=null}}}async close(){await this.opening,this.database?.close(),this.database=
null}async _transaction(e,t,n){if(!this.database)throw new Error("Artifact database is closed.");const s=this.database.transaction(
e,t),i=new Promise((o,a)=>{s.oncomplete=o,s.onabort=()=>a(s.error||new Error("Artifact transaction aborted.")),s.onerror=
()=>{}});try{const o=await n(s);return await i,o}catch(o){try{s.abort()}catch{}throw await i.catch(()=>{}),o}}async get(e,t){
return this._transaction([e],"readonly",async n=>(await Gt(n.objectStore(e).get(t)))?.value)}async getUsage(e){return this.
_transaction(["usage"],"readonly",async t=>await Gt(t.objectStore("usage").get(e))||ao())}async put(e,t,n,s){return this.
_transaction([e,"usage"],"readwrite",async i=>{const o=i.objectStore(e),a=i.objectStore("usage"),[c,l]=await Promise.all(
[Gt(o.get(t)),Gt(a.get(e))]);if(e==="blocks"&&c)return!1;const u=Hb(n),d=Kb(l||ao(),c,u,s);return await Promise.all([Gt(
o.put({value:n,size:u,generation:d.generation},t)),Gt(a.put(d,e))]),!0})}async delete(e,t){return this._transaction([e,"\
usage"],"readwrite",async n=>{const s=n.objectStore(e),i=n.objectStore("usage"),[o,a]=await Promise.all([Gt(s.get(t)),Gt(
i.get(e))]);if(!o)return!1;const c=a||ao();return await Promise.all([Gt(s.delete(t)),Gt(i.put({...c,bytes:c.bytes-o.size,
entries:c.entries-1},e))]),!0})}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return this._transaction([e],"readon\
ly",i=>new Promise((o,a)=>{const c=i.objectStore(e),l=t===void 0?void 0:this.keyRange.lowerBound(t,!0),u=c.openCursor(l),
d=[];u.onerror=()=>a(u.error),u.onsuccess=()=>{const h=u.result;if(!h||d.length>=n){o(d);return}d.push({key:h.key,generation:h.
value.generation,...s?{}:{value:h.value.value}}),d.length>=n?o(d):h.continue()}}))}}const Rc=new Map;function fe(r){if(r?.
aborted)throw r.reason||new DOMException("Aborted","AbortError")}async function Pi(r,e,t,n){if(fe(t),n)return new Promise(
(i,o)=>{n.request(r,{mode:e,...t?{signal:t}:{}},async()=>{await new Promise(a=>i(a))}).catch(o)});let s=Rc.get(r);return s||
(s={readers:0,writer:!1,queue:[]},Rc.set(r,s)),new Promise((i,o)=>{const a=()=>{for(;s.queue.length&&!s.writer;){const l=s.
queue[0];if(l.mode==="exclusive"&&s.readers)break;s.queue.shift(),l.signal?.removeEventListener("abort",l.abort),l.mode===
"exclusive"?s.writer=!0:s.readers++;let u=!1;if(l.resolve(()=>{u||(u=!0,l.mode==="exclusive"?s.writer=!1:s.readers--,a(),
!s.writer&&!s.readers&&!s.queue.length&&Rc.delete(r))}),l.mode==="exclusive")break}},c={mode:e,signal:t,resolve:i,abort:()=>{
const l=s.queue.indexOf(c);l>=0&&s.queue.splice(l,1),o(t.reason||new DOMException("Aborted","AbortError")),a()}};t?.addEventListener(
"abort",c.abort,{once:!0}),s.queue.push(c),a()})}const Qb="peercompute.artifact.manifest.v1",rn=256*1024,Jb=16*1024**3,ea=new TextEncoder;
function ye(r){const e=Vn.asCID(r)||Vn.parse(String(r));if(![85,112].includes(e.code)||e.multihash.code!==18||e.multihash.
digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return e.toV1()}function co(r,e=0,t={
remaining:rn}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((t.remaining-=2)<0)throw new RangeError(
"Manifest exceeds byte limit.");if(typeof r=="string"){if(r.length>t.remaining||(t.remaining-=ea.encode(r).length)<0)throw new RangeError(
"Manifest exceeds byte limit.");return r}if(r===null||typeof r=="boolean"||typeof r=="number"&&Number.isFinite(r))return r;
if(Array.isArray(r)){if(r.length>4096)throw new RangeError("Manifest array exceeds item limit.");return r.map(s=>co(s,e+
1,t))}if(!r||typeof r!="object"||Object.getPrototypeOf(r)!==Object.prototype)throw new TypeError("Manifest values must b\
e JSON values.");const n=Object.keys(r);if(n.length>1024)throw new RangeError("Manifest object exceeds key limit.");return Object.
fromEntries(n.sort().map(s=>(co(s,e+1,t),[s,co(r[s],e+1,t)])))}function Na(r,{maximumBytes:e=rn,maximumFiles:t=1024,maximumFileBytes:n=Jb}={}){
if(!r||r.schema!==Qb||!Array.isArray(r.files)||r.files.length===0||r.files.length>t)throw new TypeError("Manifest requir\
es the supported schema and a bounded, nonempty files array.");const s=new Set(["schema","name","description","files","m\
odel","provenance"]);if(Object.keys(r).some(c=>!s.has(c)))throw new TypeError("Unsupported manifest field.");for(const c of[
"name","description"])if(r[c]!==void 0&&typeof r[c]!="string")throw new TypeError(`Manifest ${c} must be a string.`);if(r.
model!==void 0&&(!r.model||typeof r.model!="object"||Array.isArray(r.model)))throw new TypeError("Manifest model extensi\
on must be an object.");const i=new Set,o=r.files.map(c=>{if(!c||typeof c!="object")throw new TypeError("Invalid manifes\
t file.");if(Object.keys(c).some(d=>!["path","cid","size","sha256","mediaType"].includes(d)))throw new TypeError("Unsupp\
orted manifest file field.");const{path:l,size:u}=c;if(typeof l!="string"||!l||ea.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(l)||l.split("/").some(d=>!d||d==="."||d==="..")||i.has(l))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(u)||u<0||u>n)throw new RangeError("Invalid \
file size.");if(c.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(c.sha256))throw new TypeError("Invalid SHA-256.");if(c.mediaType!==
void 0&&(typeof c.mediaType!="string"||c.mediaType.length>256))throw new TypeError("Invalid media type.");return i.add(l),
{...c,cid:ye(c.cid).toString()}}).sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),a=co({...r,files:o},0,{remaining:e});if(ea.
encode(JSON.stringify(a)).byteLength>e)throw new RangeError("Manifest exceeds byte limit.");return a}function M5(r,e){return ea.
encode(JSON.stringify(Na(r,e)))}function Kl(r,e={}){if(r.byteLength>(e.maximumBytes??rn))throw new RangeError("Manifest \
exceeds byte limit.");return Na(JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(r)),e)}const bs=Object.freeze({name:"\
peercompute.unixfs.v1",cidVersion:1,hash:"sha2-256",rawLeaves:!0,chunkSize:256*1024,maxChildrenPerNode:174,layout:"balan\
ced",reduceSingleLeafToSelf:!0}),Bc=r=>Array.from(r,e=>e.toString(16).padStart(2,"0")).join(""),ys=Symbol("artifact-impo\
rt-retention");function et(r,e,t=1){if(!Number.isSafeInteger(r)||r<t)throw new RangeError(`Invalid ${e}.`);return r}function Lc(r){
const e=new Error(`Artifact block not found: ${r}`);return e.name="NotFoundError",e.code="ERR_NOT_FOUND",e}function ta(r,e){
return e?(e.aborted&&(Promise.resolve(r).catch(()=>{}),fe(e)),new Promise((t,n)=>{const s=()=>n(e.reason||new DOMException(
"Aborted","AbortError"));e.addEventListener("abort",s,{once:!0}),Promise.resolve(r).then(t,n).finally(()=>e.removeEventListener(
"abort",s))})):r}async function*Yf(r,e){if(r instanceof Uint8Array){yield r;return}if(r?.getReader){const t=r.getReader();
let n=!1;try{for(;;){const s=await ta(t.read(),e);if(s.done){n=!0;return}yield s.value}}finally{n||t.cancel().catch(()=>{}),
t.releaseLock()}return}if(r?.[Symbol.asyncIterator]||r?.[Symbol.iterator]){const t=r[Symbol.asyncIterator]?.()||r[Symbol.
iterator]();let n=!1;try{for(;;){const s=await ta(t.next(),e);if(s.done){n=!0;return}yield s.value}}finally{n||Promise.resolve(
t.return?.()).catch(()=>{})}return}throw new TypeError("Artifact source must be bytes or a byte stream.")}class R5{constructor({
name:e="default",persistent:t=!0,backend:n,ownsBackend:s=n===void 0,capacity:i="bounded",maximumBytes:o=i==="browser"?Number.
MAX_SAFE_INTEGER:2*1024**3,maximumBlockBytes:a=2*1024**2,maximumFileBytes:c=Jb,maximumTraversalBlocks:l=65536,maximumStoredBlocks:u=i===
"browser"?Number.MAX_SAFE_INTEGER:l,maximumRoots:d=i==="browser"?Number.MAX_SAFE_INTEGER:1024,maximumRoutingBytes:h=16*1024**
2,maximumConcurrentBlockWrites:p=4,maximumQueuedBlockWrites:m=16,lockManager:y=globalThis.navigator?.locks,onDestroy:g,indexedDBImpl:f,
keyRange:b}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/u.test(e))throw new TypeError("Invalid artifact store name.");if(![
"bounded","browser"].includes(i))throw new TypeError("Invalid artifact storage capacity policy.");this.capacity=i,this.name=
e,this.persistent=t,this.backend=n||(t?new T5({name:e,indexedDBImpl:f,keyRange:b}):new C5({name:e})),this.ownsBackend=s,
this.maximumBytes=et(o,"maximumBytes"),this.maximumBlockBytes=et(a,"maximumBlockBytes"),this.maximumFileBytes=et(c,"maxi\
mumFileBytes"),this.maximumTraversalBlocks=et(l,"maximumTraversalBlocks"),this.maximumStoredBlocks=et(u,"maximumStoredBl\
ocks"),this.maximumRoots=et(d,"maximumRoots"),this.maximumRoutingBytes=et(h,"maximumRoutingBytes"),this.maximumConcurrentBlockWrites=
et(p,"maximumConcurrentBlockWrites"),this.maximumQueuedBlockWrites=et(m,"maximumQueuedBlockWrites",0),this.activeBlockWrites=
0,this.waitingBlockWrites=[],this.lockManager=y,this.lockName=`peercompute-artifacts:${this.backend.name||e}`,this.onDestroy=
g,this.controller=new AbortController,this.operations=new Set,this.isOpen=!1,this.destroyed=!1,this.usage={bytes:0,entries:0},
this.rootUsage={bytes:0,entries:0},this.blockstore=this._createBlockstore(),this.datastore=this._createDatastore()}async open(){
if(this.destroyed)throw new Error("Artifact store is destroyed.");if(this.opening)return this.opening;if(!this.isOpen){this.
opening=(async()=>{if(this.persistent&&!this.lockManager?.request&&!this.backend.supportsExclusiveAccess)throw new Error(
"Persistent artifact storage requires Web Locks for cross-context GC safety.");if(await this.backend.open(),this.persistent&&
!this.lockManager?.request&&!this.backend.hasExclusiveLock)throw new Error("Persistent artifact backend did not acquire \
its exclusive storage lock.");this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.backend.getUsage(
"roots"),this.isOpen=!0})();try{await this.opening}finally{this.opening=null}}}async _begin(e,t="shared"){if(this.destroyed)
throw new Error("Artifact store is destroyed.");const n=e?AbortSignal.any([e,this.controller.signal]):this.controller.signal;
fe(n),await this.open();const s=t==="none"?()=>{}:await Pi(`${this.lockName}:gc`,t,n,this.lockManager);try{fe(n)}catch(l){
throw s(),l}let i;const a={settled:new Promise(l=>{i=l}),paused:!1,finish:()=>{n.removeEventListener("abort",c),s(),this.
operations.delete(a),i()}},c=()=>{a.paused&&a.finish()};return n.addEventListener("abort",c,{once:!0}),this.operations.add(
a),{signal:n,finish:a.finish,pause:()=>{a.paused=!0,n.aborted&&a.finish()},resume:()=>{a.paused=!1,fe(n)}}}async _run(e,t,n,s){
if(s&&(s.store!==this||!s.held||n==="exclusive"))throw new Error("Artifact retention scope is no longer active.");const i=s?
AbortSignal.any([s.signal,...e?[e]:[]]):e,o=await this._begin(i,s?"none":n);try{const a=await t(o.signal);return fe(o.signal),
a}finally{o.finish()}}async _writeRoot(e,t,n){const s=await Pi(`${this.lockName}:roots`,"exclusive",n,this.lockManager);
try{fe(n);const i=await this.backend.get("roots",e),o=t(i);return fe(n),await this.backend.put("roots",e,o,{maximumEntries:this.
maximumRoots,maximumBytes:Math.min(Number.MAX_SAFE_INTEGER,this.maximumRoots*(rn+2048))}),this.rootUsage=await this.backend.
getUsage("roots"),structuredClone(o)}finally{s()}}async _readBlock(e,t){fe(t);const n=ye(e),s=await this.backend.get("bl\
ocks",n.toString());if(!s)throw Lc(n);return await this._verifyBlock(n,s),fe(t),s}async _verifyBlock(e,t){if(!(t instanceof
Uint8Array)||t.byteLength>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");const n=await lh.
digest(t);if(!Vn.createV1(e.code,n).equals(e))throw new Error("Artifact block CID verification failed.")}async _blockWritePermit(e){
if(fe(e),this.activeBlockWrites>=this.maximumConcurrentBlockWrites){if(this.waitingBlockWrites.length>=this.maximumQueuedBlockWrites)
throw new Error("Artifact block write queue is full.");await new Promise((t,n)=>{const s={resolve:t,signal:e,abort:()=>{
const i=this.waitingBlockWrites.indexOf(s);i>=0&&this.waitingBlockWrites.splice(i,1),n(e.reason||new DOMException("Abort\
ed","AbortError"))}};e?.addEventListener("abort",s.abort,{once:!0}),this.waitingBlockWrites.push(s)})}else this.activeBlockWrites++;
return()=>{const t=this.waitingBlockWrites.shift();t?(t.signal?.removeEventListener("abort",t.abort),t.resolve()):this.activeBlockWrites--}}async _putBlock(e,t,n){
const s=await this._blockWritePermit(n);try{return await this._persistBlock(e,t,n)}finally{s()}}async _persistBlock(e,t,n){
fe(n);const s=ye(e),i=t instanceof Uint8Array?null:new Uint8Array(this.maximumBlockBytes);let o=0,a;for await(const c of Yf(
t,n)){if(fe(n),!(c instanceof Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(o+=c.byteLength,
o>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");i?i.set(c,o-c.byteLength):a=c.slice()}
return a=i?i.slice(0,o):a,await this._verifyBlock(s,a),fe(n),await this.backend.put("blocks",s.toString(),a,{maximumBytes:this.
maximumBytes,maximumEntries:this.maximumStoredBlocks}),this.usage=await this.backend.getUsage("blocks"),s}_localBlocks(e){
const t=this;return{async*get(n){yield await t._readBlock(n,e)},put:(n,s)=>t._putBlock(n,s,e)}}async importFile(e,{signal:t,
expectedSize:n,expectedSha256:s,pin:i=!0,[ys]:o}={}){if(n!==void 0&&et(n,"expectedSize",0),n>this.maximumFileBytes)throw new RangeError(
"File exceeds byte limit.");if(s!==void 0&&!/^[a-f0-9]{64}$/u.test(s))throw new TypeError("Invalid expected SHA-256.");return this.
_run(t,async a=>{const c=ph.create();let l=0;const u=this;async function*d(){for await(const y of Yf(e,a)){if(fe(a),!(y instanceof
Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(l+=y.byteLength,l>u.maximumFileBytes||
n!==void 0&&l>n)throw new RangeError("File exceeds declared byte limit.");for(let g=0;g<y.byteLength;g+=bs.chunkSize){const f=y.
subarray(g,g+bs.chunkSize);c.update(f),yield f}}}const h=await q_(d(),this._localBlocks(a),{cidVersion:1,rawLeaves:!0,reduceSingleLeafToSelf:!0,
wrapWithDirectory:!1,chunker:kg({chunkSize:bs.chunkSize}),layout:Fg({maxChildrenPerNode:bs.maxChildrenPerNode}),fileImportConcurrency:1,
blockWriteConcurrency:1}),p=Bc(c.digest());if(n!==void 0&&n!==l)throw new Error("File size does not match expected size.");
if(s!==void 0&&s!==p)throw new Error("File SHA-256 does not match expected digest.");const m=h.cid.toV1().toString();return this.
_writeRoot(m,y=>({cid:m,kind:"file",size:l,sha256:p,status:"complete",pinned:!!(i||y?.pinned),retain:!1,profile:bs.name}),
a)},void 0,o)}async importManifest(e,{signal:t,pin:n=!0,[ys]:s}={}){const i=Na(e,{maximumFileBytes:this.maximumFileBytes}),
o=M5(i);return this._run(t,async a=>{for(const l of i.files)await this._recordVerifiedFile(l,a);const c=Vn.createV1(85,await lh.
digest(o));return await this._putBlock(c,o,a),this._writeRoot(c.toString(),l=>({cid:c.toString(),kind:"manifest",size:o.
byteLength,manifest:i,status:"complete",pinned:!!(n||l?.pinned),retain:!1}),a)},void 0,s)}async _verifyFile(e,t={},n){const s=await Hf(
ye(e).toString(),this._localBlocks(n));if(!["file","raw"].includes(s.type))throw new TypeError("Artifact root must ident\
ify a file.");const i=Number(s.type==="raw"?s.node.byteLength:s.unixfs.fileSize());if(!Number.isSafeInteger(i)||i>this.maximumFileBytes||
t.size!==void 0&&i!==t.size)throw new RangeError("Artifact file size differs from its manifest or limit.");const o=ph.create();
let a=0;for await(const l of this._fileChunks(e,{size:i,signal:n})){if(fe(n),a+=l.byteLength,a>i)throw new RangeError("A\
rtifact content exceeds declared size.");o.update(l)}const c=Bc(o.digest());if(a!==i||t.sha256!==void 0&&c!==t.sha256)throw new Error(
"Artifact file integrity differs from its manifest.");return{size:i,sha256:c}}async*_fileChunks(e,{size:t,offset:n=0,length:s=t-
n,signal:i}){const o=n+s,a=[{cid:ye(e),start:0,size:t,depth:0}];let c=0,l=0;for(;a.length;){fe(i);const u=a.pop();if(++c>
this.maximumTraversalBlocks||u.depth>64)throw new RangeError("Artifact file traversal exceeds its bounds.");const d=await this.
_readBlock(u.cid,i);if(u.cid.code===85){if(d.byteLength!==u.size)throw new Error("Raw file block size differs from its U\
nixFS link.");const b=d.subarray(Math.max(0,n-u.start),Math.min(d.length,o-u.start));b.length&&(l+=b.length,yield b);continue}
const h=Zs(d);if(!h.Data)throw new Error("UnixFS file node has no metadata.");const p=it.unmarshal(h.Data),m=ti.decode(d).
data?.fileSize;if(!["file","raw"].includes(p.type)||h.Links.length!==p.blockSizes.length||Number(p.fileSize())!==u.size||
m!==void 0&&m!==BigInt(u.size))throw new Error("UnixFS file metadata is inconsistent.");const y=p.data||new Uint8Array;let g=u.
start+y.length;const f=[];for(let b=0;b<h.Links.length;b++){const w=Number(p.blockSizes[b]);if(!Number.isSafeInteger(w)||
w<0)throw new RangeError("Invalid UnixFS child size.");const E=ye(h.Links[b].Hash),v=h.Links[b].Tsize;if(v!==void 0&&(!Number.
isSafeInteger(v)||v<w||E.code===85&&v!==w))throw new Error("Invalid UnixFS link DAG size.");if(g<o&&g+w>n&&f.push({cid:E,
start:g,size:w,depth:u.depth+1}),g+=w,!Number.isSafeInteger(g))throw new RangeError("Invalid UnixFS file extent.")}if(g!==
u.start+u.size)throw new Error("UnixFS child sizes differ from their parent.");if(a.length+f.length>this.maximumTraversalBlocks)
throw new RangeError("UnixFS pending traversal exceeds limit.");for(let b=f.length-1;b>=0;b--)a.push(f[b]);if(y.length&&
u.start<o&&u.start+y.length>n){const b=y.subarray(Math.max(0,n-u.start),Math.min(y.length,o-u.start));l+=b.length,yield b}}
if(l!==s)throw new Error("UnixFS read did not produce the requested number of bytes.")}async _recordVerifiedFile(e,t){const n=await this.
_verifyFile(e.cid,e,t);return this._writeRoot(e.cid,s=>({...s,cid:e.cid,kind:"file",...n,status:"complete",pinned:!!s?.pinned,
retain:!1}),t)}async*_walk(e,{signal:t,fetchBlock:n,allowMissing:s=!1}={}){const i=e.map(a=>ye(a)),o=new Set;for(;i.length;){
fe(t);const a=i.pop(),c=a.toString();if(o.has(c))continue;if(o.size>=this.maximumTraversalBlocks)throw new RangeError("A\
rtifact DAG traversal exceeds block limit.");o.add(c);let l;try{l=await this._readBlock(a,t)}catch(u){if(u.code!=="ERR_N\
OT_FOUND")throw u;if(n)await this._putBlock(a,await ta(n(a,{signal:t}),t),t),l=await this._readBlock(a,t);else{if(s)continue;
throw u}}if(yield c,a.code===mi){const u=Zs(l).Links;if(i.length+u.length>this.maximumTraversalBlocks)throw new RangeError(
"Artifact DAG links exceed limit.");for(const d of u)i.push(ye(d.Hash))}}}async ensureLocal(e,{signal:t,fetchBlock:n,pin:s=!0,
kind:i}={}){const o=ye(e).toString();return this._run(t,async a=>{await this._writeRoot(o,d=>({...d,cid:o,kind:i||d?.kind||
"file",status:"partial",pinned:!!d?.pinned,retain:!0}),a);for await(const d of this._walk([o],{signal:a,fetchBlock:n}));
let c;const l=ye(o).code===85?await this._readBlock(o,a):null;if(l&&l.byteLength<=rn){let d;try{d=JSON.parse(new TextDecoder().
decode(l))}catch{}(d?.schema===Qb||i==="manifest")&&(c=Kl(l,{maximumFileBytes:this.maximumFileBytes}))}if(i==="manifest"&&
!c)throw new TypeError("Manifest must be a bounded canonical JSON raw block.");if(c){await this._writeRoot(o,d=>({...d,kind:"\
manifest",manifest:c,retain:!0}),a);for(const d of c.files){for await(const h of this._walk([d.cid],{signal:a,fetchBlock:n}))
;await this._recordVerifiedFile(d,a)}}const u=c?{size:l.byteLength,manifest:c}:await this._verifyFile(o,{},a);return this.
_writeRoot(o,d=>({cid:o,kind:c?"manifest":"file",...u,status:"complete",pinned:!!(s||d?.pinned),retain:!1}),a)})}async stat(e,{
signal:t,[ys]:n}={}){const s=ye(e).toString();return this._run(t,()=>this.backend.get("roots",s),void 0,n)}async getManifest(e,{
signal:t,[ys]:n}={}){const s=ye(e).toString();return this._run(t,async i=>Kl(await this._readBlock(s,i),{maximumFileBytes:this.
maximumFileBytes}),void 0,n)}async*openRead(e,{offset:t=0,length:n,signal:s}={}){et(t,"offset",0),n!==void 0&&et(n,"leng\
th",0);const i=await this._begin(s);try{const o=await Hf(ye(e).toString(),this._localBlocks(i.signal));if(!["file","raw"].
includes(o.type))throw new TypeError("Artifact root must identify a file.");const a=Number(o.type==="raw"?o.node.byteLength:
o.unixfs.fileSize());if(a>this.maximumFileBytes||t>a||n!==void 0&&n>a-t)throw new RangeError("Artifact range exceeds fil\
e size.");if(n===0||t===a)return;for await(const c of this._fileChunks(e,{size:a,offset:t,length:n,signal:i.signal}))fe(
i.signal),i.pause(),yield c,i.resume()}finally{i.finish()}}async pin(e,{signal:t}={}){return this.ensureLocal(e,{signal:t,
pin:!0})}async unpin(e,{signal:t}={}){const n=ye(e).toString();return this._run(t,s=>this._writeRoot(n,i=>{if(!i)throw Lc(
n);return{...i,pinned:!1,retain:!1}},s))}async withRetention(e,{signal:t}={}){if(typeof e!="function")throw new TypeError(
"Artifact retention requires a callback.");const n=await this._begin(t),s={store:this,signal:n.signal,held:!0,accepting:!0},
i=new Set,o={};for(const a of["stat","getManifest","importFile","importManifest"])o[a]=(c,l={})=>{if(!s.accepting)return Promise.
reject(new Error("Artifact retention scope is no longer active."));if(i.size>=32)return Promise.reject(new Error("Artifa\
ct retention operation queue is full."));const u=this[a](c,{...l,[ys]:s});return i.add(u),u.finally(()=>i.delete(u)).catch(
()=>{}),u};o.getStats=()=>this.getStats(),Object.freeze(o);try{const a=await ta(Promise.resolve().then(()=>(fe(n.signal),
e(o))),n.signal);return s.accepting=!1,await Promise.all([...i]),fe(n.signal),a}finally{s.accepting=!1,await Promise.allSettled(
[...i]),s.held=!1,n.finish()}}async acquireUse(e,{signal:t}={}){const n=ye(e).toString(),s=await this._begin(t,"none");let i;
try{i=await Pi(`${this.lockName}:use:${n}`,"shared",s.signal,this.lockManager);const o=await this.stat(n,{signal:s.signal});
if(o?.status!=="complete"||!o.pinned&&!o.retain)throw new Error("Artifact use requires a complete retained root.");fe(s.
signal);let a=!1;const c=()=>{a||(a=!0,this.controller.signal.removeEventListener("abort",c),i(),s.finish())};return this.
controller.signal.addEventListener("abort",c,{once:!0}),this.controller.signal.aborted&&(c(),fe(this.controller.signal)),
c}catch(o){throw i?.(),s.finish(),o}}async*_entries(e,t=!1){let n;for(;;){const s=await this.backend.scan(e,{after:n,limit:16,
keysOnly:t});if(!s.length)return;for(const i of s)yield i;n=s.at(-1).key}}async*list({signal:e}={}){const t=await this._begin(
e);try{for await(const n of this._entries("roots"))fe(t.signal),t.pause(),yield n.value,t.resume()}finally{t.finish()}}async*listBlockCids(e,{
signal:t}={}){const n=ye(e).toString(),s=await this._begin(t);try{const i=await this.backend.get("roots",n);if(i?.status!==
"complete")throw new Error("Artifact serving requires a complete local root.");const o=[n,...(i.manifest?.files||[]).map(
a=>a.cid)];for await(const a of this._walk(o,{signal:s.signal}))s.pause(),yield a,s.resume()}finally{s.finish()}}async _collectGarbage(e,t){
const n=await this.backend.getUsage("blocks"),s=n.generation||0,i=new Set;for await(const{value:l}of this._entries("root\
s")){if(l.cid===t||!l.pinned&&!l.retain)continue;const u=[l.cid,...(l.manifest?.files||[]).map(d=>d.cid)];for await(const d of this.
_walk(u,{signal:e,allowMissing:l.status!=="complete"}))if(i.add(d),i.size>n.entries)throw new RangeError("Artifact GC ex\
ceeds the stored block collection.")}const o=t?await this.backend.get("roots",t):null,a=!!(t&&i.has(t));if(o)if(a){const l=o.
kind==="manifest"?{cid:t,kind:"file",size:o.size,sha256:Bc(ye(t).multihash.digest),status:o.status,pinned:!1,retain:!1}:
{...o,pinned:!1,retain:!1};await this._writeRoot(t,()=>l,e)}else{const l={...o,pinned:!1,status:"deleting"};delete l.retain,
delete l.profile,await this._writeRoot(t,()=>l,e)}let c=0;for await(const{key:l,generation:u}of this._entries("blocks",!0))
fe(e),u<=s&&!i.has(l)&&await this.backend.delete("blocks",l)&&c++;for await(const{key:l,value:u}of this._entries("roots"))
!u.pinned&&!u.retain&&!i.has(l)&&await this.backend.delete("roots",l);return this.usage=await this.backend.getUsage("blo\
cks"),this.rootUsage=await this.backend.getUsage("roots"),{deletedBlocks:c,freedBytes:n.bytes-this.usage.bytes,storedBytes:this.
usage.bytes,blockCount:this.usage.entries,...t?{cid:t,removed:!!o,retainedByOtherRoot:a}:{}}}async gc({signal:e}={}){return this.
_run(e,t=>this._collectGarbage(t),"exclusive")}async remove(e,{signal:t,useWaitMs:n=1e3}={}){const s=ye(e).toString();if(et(
n,"useWaitMs"),n>3e4)throw new RangeError("Artifact use wait exceeds limit.");await this.open();const i=new AbortController,
o=setTimeout(()=>i.abort(Object.assign(new Error("This model is in use in another session. Unload it before deleting."),
{code:"ERR_ARTIFACT_IN_USE"})),n);o.unref?.();let a;try{a=await Pi(`${this.lockName}:use:${s}`,"exclusive",AbortSignal.any(
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
const s=await e._begin(n);try{for await(const{key:i}of e._entries("blocks",!0))fe(s.signal),s.pause(),yield{cid:ye(i),bytes:t.
get(i,{signal:s.signal})},s.resume()}finally{s.finish()}}};return t.putMany=async function*(n,s){for await(const{cid:i,bytes:o}of n)
yield await t.put(i,o,s)},t.getMany=async function*(n,s){for await(const i of n)yield{cid:i,bytes:t.get(i,s)}},t.deleteMany=
async function*(){throw new Error("Use ArtifactStore.gc() to remove blocks.")},t}_createDatastore(){const e=this,t=s=>{const i=s.
toString();if(i.length>2048)throw new RangeError("Datastore key exceeds limit.");return i},n={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},get:(s,{signal:i}={})=>e._run(i,async()=>{const o=await e.backend.get("routing",t(s));
if(o===void 0)throw Lc(s);return o},"none"),has:(s,{signal:i}={})=>e._run(i,async()=>await e.backend.get("routing",t(s))!==
void 0,"none"),put:(s,i,{signal:o}={})=>e._run(o,async a=>{if(fe(a),!(i instanceof Uint8Array)||i.byteLength>rn)throw new RangeError(
"Datastore value exceeds limit.");return await e.backend.put("routing",t(s),i,{maximumBytes:e.maximumRoutingBytes,maximumEntries:4096}),
s},"none"),delete:(s,{signal:i}={})=>e._run(i,async()=>{await e.backend.delete("routing",t(s))},"none"),query:(s={},i={})=>e.
_queryDatastore(s,i,!1),queryKeys:(s={},i={})=>e._queryDatastore(s,i,!0),batch:()=>{const s=[];let i=0;const o=(a,c)=>{if(s.
length>=4096||(i+=c?.byteLength||0)>e.maximumRoutingBytes)throw new RangeError("Datastore batch exceeds limit.");s.push(
{key:a,value:c?.slice()})};return{put:(a,c)=>o(a,c),delete:a=>o(a),commit:async a=>{for(const{key:c,value:l}of s)l===void 0?
await n.delete(c,a):await n.put(c,l,a);s.length=0}}}};return n.putMany=async function*(s,i){for await(const o of s)await n.
put(o.key,o.value,i),yield o},n.getMany=async function*(s,i){for await(const o of s)yield{key:o,value:await n.get(o,i)}},
n.deleteMany=async function*(s,i){for await(const o of s)await n.delete(o,i),yield o},n}async*_queryDatastore(e,{signal:t}={},n){
const s=await this._begin(t,"none");try{const i=[];let o=0,a=0;const c=et(e.offset??0,"query offset",0),l=et(e.limit??4096,
"query limit",0);for await(const u of this._entries("routing",n)){if(fe(s.signal),e.prefix&&!u.key.startsWith(e.prefix))
continue;const d=new ut(u.key),h=n?d:{key:d,value:u.value};if(!e.filters?.some(p=>!p(h))&&(e.orders?.length?i.push(h):o++>=
c&&a<l&&(a++,s.pause(),yield h,s.resume()),!e.orders?.length&&a>=l))return}if(e.orders?.length){i.sort((u,d)=>{for(const h of e.
orders){const p=h(u,d);if(p)return p}return 0});for(const u of i.slice(c,c+l))s.pause(),yield u,s.resume()}}finally{s.finish()}}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.controller.abort(new DOMException("Artifact store destroy\
ed.","AbortError")),this.destroying=(async()=>{try{await this.opening?.catch(()=>{}),await Promise.allSettled([...this.operations].
map(e=>e.settled)),this.ownsBackend&&await this.backend.close()}finally{this.isOpen=!1,this.onDestroy?.(this)}})(),this.
destroying)}}const B5="peercompute.state.task-graph-cache-artifact-admission.v0",L5="peercompute.state.task-graph-cache-\
artifact-invalidation.v0",vn="taskGraphCacheArtifactAdmissions",D5="taskGraphCacheArtifactInvalidations";function Zf(r,e=[]){
return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r=="string"?r.split(",").map(t=>t.trim()).
filter(Boolean):[...e]}function ws(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}class P5{constructor(e,t={}){this.networkManager=e,this.libp2pNode=e?e.getLibp2pNode():
null,this.config={docName:t.docName||"peercompute-state",topic:t.topic||"peercompute-state-sync",enablePersistence:t.enablePersistence!==
!1,disableNetworkProvider:t.disableNetworkProvider||!1,disableBroadcast:t.disableBroadcast||!1,broadcastNamespaces:Array.
isArray(t.broadcastNamespaces)?t.broadcastNamespaces:null,...t},this.ydoc=new Yn,this.state=this.ydoc.getMap("state"),this.
dataState=new tk({ydoc:this.ydoc,stateMap:this.state,hotStore:t.hotStore,deltaNamespace:t.deltaNamespace||"deltas"}),this.
indexeddbProvider=null,this.libp2pProvider=null,this.subscribers=new Map,this.globalSubscribers=new Set,this.isInitialized=
!1,this.persistenceFailed=!1}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new dr,this.state.set(e,t)),t}applyRemoteUpdate(e){
try{const t=(()=>{if(e instanceof Uint8Array)return e;if(Array.isArray(e))return new Uint8Array(e);if(e&&typeof e=="obje\
ct"){const s=Object.values(e);return new Uint8Array(s)}return new Uint8Array(0)})();if(t.byteLength===0){console.warn("[\
StateManager] Remote update was empty, skipping");return}const n=t;wo(this.ydoc,n,this)}catch(t){console.error("[StateMa\
nager] Failed to apply remote update:",t)}}applyStateSet(e,t,n){try{this.ydoc.transact(()=>{if(n){const s=this._getNamespaceMap(
n);t===void 0?s.delete(e):s.set(e,t)}else t===void 0?this.state.delete(e):this.state.set(e,t)},"remote-state-set")}catch(s){
console.error("[StateManager] Failed to apply state-set:",s)}}commitDelta(e){if(!this.isInitialized)throw new Error("Sta\
teManager not initialized");this.dataState.commitDelta(e)}getDataState(){return this.dataState}createLocalArtifactCache(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const t=new lk({...e,onDestroy:n=>{this.dataState.unregisterLocalArtifactCache(
n.name,n)}});try{return this.dataState.registerLocalArtifactCache(t.name,t)}catch(n){throw t.destroy(),n}}getLocalArtifactCache(e){
return this.dataState.getLocalArtifactCache(e)}createArtifactStore(e={}){if(this.destroyed)throw new Error("StateManager\
 is destroyed");const t=e.name||"default";if(this.getArtifactStore(t))throw new Error(`Artifact store ${t} is already re\
gistered`);const n=new R5({...e,name:t,onDestroy:s=>{this.dataState.unregisterArtifactStore(s),e.onDestroy?.(s)}});return this.
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
t.admittedAt)?t.admittedAt:Date.now(),i=Zf(t.invalidationRefs??e.invalidationRefs??e.admission?.invalidationRefs,[]),o={
schema:B5,admissionId:String(t.admissionId||e.admission?.admissionId||`task-graph-cache-admission:${n}:${s}`),cacheKey:n,
artifactId:e.artifactId||`${n}:artifact`,artifactSchema:e.schema||null,artifactStatus:e.status||null,cacheScope:e.cacheScope||
t.cacheScope||null,cacheKeySource:e.cacheKeySource||t.cacheKeySource||null,inputHash:e.inputHash||t.inputHash||null,resultHash:e.
resultHash||t.resultHash||null,status:t.status||"admitted",admitted:!0,authority:t.authority||"state-manager",validatorId:t.
validatorId||e.admission?.validatorId||null,reason:t.reason||"state-manager-cache-artifact-admission",invalidationRefs:i,
admittedAt:s,acceptedAt:s,expiresAt:t.expiresAt??e.expiresAt??null,sourceNodeId:t.sourceNodeId||this.state.get("nodeId")||
null,artifact:ws(e)};return this.writeScoped(vn,n,o),ws(o)}invalidateTaskGraphCacheArtifact(e,t={}){if(!this.isInitialized)
throw new Error("StateManager not initialized");const n=e&&typeof e=="object"?e:null,s=String(t.cacheKey||n?.cacheKey||e||
"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires a cacheKey");const i=this.readScoped(vn,s),o=Number.
isFinite(t.invalidatedAt)?t.invalidatedAt:Date.now(),a=Zf(t.invalidationRefs??n?.invalidationRefs??i?.invalidationRefs,[]),
c={schema:L5,invalidationId:String(t.invalidationId||`task-graph-cache-invalidation:${s}:${o}`),cacheKey:s,artifactId:n?.
artifactId||i?.artifactId||`${s}:artifact`,status:"invalidated",authority:t.authority||"state-manager",reason:t.reason||
"state-manager-cache-artifact-invalidated",invalidationRefs:a,previousAdmissionStatus:i?.status||null,invalidatedAt:o,sourceNodeId:t.
sourceNodeId||this.state.get("nodeId")||null};return this.writeScoped(D5,c.invalidationId,c),i&&this.writeScoped(vn,s,{...i,
status:"invalidated",admitted:!1,invalidatedAt:o,invalidation:c}),ws(c)}getTaskGraphCacheArtifactAdmission(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");const t=String(e||"").trim();if(!t)return null;const n=this.readScoped(vn,
t);return n?ws(n):null}listTaskGraphCacheArtifactAdmissions(e={}){if(!this.isInitialized)throw new Error("StateManager n\
ot initialized");const t=e.includeInvalidated!==!1;return this.listNamespaceKeys(vn).map(n=>this.readScoped(vn,n)).filter(
n=>n&&(t||n.admitted===!0)).map(n=>ws(n)).sort((n,s)=>String(n.cacheKey||"").localeCompare(String(s.cacheKey||"")))}async initialize(e={}){
if(this.isInitialized){console.warn("[StateManager] Already initialized");return}try{if(this.config.enablePersistence&&(this.
indexeddbProvider=new Z1(this.config.docName,this.ydoc),await new Promise(t=>{this.indexeddbProvider.once("synced",t)}),
console.log("[StateManager] IndexedDB persistence loaded")),this.networkManager&&!this.config.disableNetworkProvider)try{
this.libp2pProvider=new ek(this.networkManager,this.ydoc,{topic:this.config.topic}),console.log("[StateManager] PeerComp\
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
n.keys()),i=null,o=!0;const a=()=>{const d=this.state.get(e);return d instanceof dr?d:null};let c;const l=(d,h=null)=>{if(!o||
d===n)return;const p=s,m=d?Array.from(d.entries()):[],y=new Set(m.map(([g])=>g));n?.unobserve(c),n=d,s=y,i=h,n?.observe(
c);for(const g of p)if(!y.has(g)){if(!o||a()!==n)return;t(void 0,g)}for(const[g,f]of m){if(!o||a()!==n)return;t(f,g)}};c=
(d,h)=>{if(!o||d.target!==n)return;const p=a();if(p!==n){l(p,h);return}h!==i&&d.keysChanged.forEach(m=>{!o||d.target!==n||
a()!==n||(n.has(m)?s.add(m):s.delete(m),t(n.get(m),m))})};const u=(d,h)=>{!o||!d.keysChanged.has(e)||l(a(),h)};return n.
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
pending}}}const Dc=new Map,Pc=new Map,$5={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array};function Xb(r="Uint8Array"){const e=$5[r];if(!e)throw new Error(
`Unsupported typed array view: ${r}`);return e}function N5(r){return new r.constructor(r)}function Yb(r){return ArrayBuffer.
isView(r)&&!(r instanceof DataView)}function U5(r){return r instanceof ArrayBuffer?new Uint8Array(r):Yb(r)?new Uint8Array(
r.buffer,r.byteOffset,r.byteLength):Array.isArray(r)?Uint8Array.from(r):null}async function ud(r){const e=String(r);return Dc.
has(e)||Dc.set(e,mt(()=>import(`${e}`),[],import.meta.url)),Dc.get(e)}async function ep(r){const e=U5(r);if(e)
return e;if(typeof r=="string"||r instanceof URL){const t=await fetch(String(r));if(!t.ok)throw new Error(`Failed to fet\
ch wasm module: ${t.status} ${t.statusText}`);const n=await t.arrayBuffer();return new Uint8Array(n)}throw new Error("wa\
sm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function F5(r){if(typeof r=="string"||
r instanceof URL){const t=String(r);return Pc.has(t)||Pc.set(t,(async()=>{const n=await ep(r);return WebAssembly.compile(
n)})()),Pc.get(t)}const e=await ep(r);return WebAssembly.compile(e)}async function O5(r,e){if(r.importsModule){const t=await ud(
r.importsModule),n=r.importsExport||"default",s=t[n];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="obje\
ct")return s;throw new Error(`WASM imports export "${n}" must be a function or object`)}return r.imports&&typeof r.imports==
"object"?r.imports:{}}function Zb(r,e,t={}){const n=t.exportName||e.memoryExport||"memory",s=r.exports?.[n];if(!(s instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return s}function z5(r,e){if(Object.prototype.
hasOwnProperty.call(r,"values"))return r.values;const t=r.dataKey||r.name;if(t&&e&&Object.prototype.hasOwnProperty.call(
e,t))return e[t]}function q5(r,e){if(r==null)return null;if(r instanceof e)return r;if(Yb(r))return new e(r.buffer,r.byteOffset,
Math.floor(r.byteLength/e.BYTES_PER_ELEMENT));if(r instanceof ArrayBuffer)return new e(r);if(Array.isArray(r))return e.from(
r);throw new Error(`Unsupported memory input for ${e.name}`)}function tp(r,e,t){(Array.isArray(e.inputViews)?e.inputViews:
[]).forEach(s=>{const i=Xb(s.view),o=q5(z5(s,t),i);if(!o)return;const a=Zb(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0;new i(a.buffer,c,o.length).set(o)})}function j5(r,e){const t=Array.isArray(e.outputViews)?e.outputViews:[];if(t.length===
0)return null;const n={};return t.forEach((s,i)=>{const o=Xb(s.view),a=Zb(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0,l=Number.isFinite(s.length)?s.length:0;if(l<=0)throw new Error(`WASM output view "${s.name||i}" must provide a positiv\
e length`);const u=s.name||`output${i}`;n[u]=N5(new o(a.buffer,c,l))}),n}function ey(r,e){return Array.isArray(e.args)?e.
args:Array.isArray(r.args)?r.args:Array.isArray(r.data?.args)?r.data.args:[]}function G5(r={}){const e=globalThis.navigator?.
gpu??null;if(r.webgpu?.required===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!e,gpu:e,async requestAdapter(n=r.webgpu?.adapterOptions){return e?e.requestAdapter(n):null},async requestDevice(n={}){
if(!e)return null;const s=n.adapter||await e.requestAdapter(n.adapterOptions||r.webgpu?.adapterOptions);return s?s.requestDevice(
n.deviceDescriptor||r.webgpu?.deviceDescriptor):null}}}async function ty(r){const e=r.wasm||{},t=e.source??r.wasmSource??
r.source;if(!t)throw new Error("wasm tasks require wasm.source");const n=await F5(t),s=await O5(e,{task:r,data:r.data??null,
WebAssembly}),i=await WebAssembly.instantiate(n,s);return tp(i,e,r.data??null),{module:n,instance:i,exports:i.exports,imports:s,
task:r,data:r.data??null,callExport(o,a=[]){const c=i.exports?.[o];if(typeof c!="function")throw new Error(`WASM export \
"${o}" was not found`);return c(...a)},readOutputViews(){return j5(i,e)},writeInputViews(o){tp(i,e,o)}}}async function W5(r,e,t){
const n=r.wasm||{};if(!n.resultModule)return t.value;const s=await ud(n.resultModule),i=n.resultExport||"default",o=s[i];
if(typeof o!="function")throw new Error(`WASM result export "${i}" must be a function`);const a=await o({...t,wasm:e,task:r,
data:r.data??null});return typeof a>"u"?t:a}async function V5(r){const e=await ty(r),t=r.wasm||{},n=ey(r,t),s=t.entry?await e.
callExport(t.entry,n):void 0,i=e.readOutputViews();return W5(r,e,{returnValue:s,outputs:i,value:i?typeof s>"u"?i:{returnValue:s,
outputs:i}:s})}async function H5(r){const e=await ty(r),t=r.hostModule||r.module;if(!t)throw new Error("wasm-webgpu task\
s require hostModule or module");r.wasm?.callEntryBeforeHost&&r.wasm.entry&&(e.entryResult=await e.callExport(r.wasm.entry,
ey(r,r.wasm)));const n=await ud(t),s=r.hostExport||r.exportName||"default",i=n[s];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return i({task:r,data:r.data??null,wasm:e,webgpu:G5(r)})}async function K5(r){
if(typeof r!="string"||!r.trim())throw new Error("module path must be a non-empty string");return r==="peercompute:model\
-inference"?mt(()=>Promise.resolve().then(()=>HM),void 0,import.meta.url):r==="peercompute:gguf-inference"?mt(
()=>import("./modelTask-Dji7F6gM.js"),__vite__mapDeps([0,1,2,3]),import.meta.url):r==="peercompute:diffusion-inference"?mt(()=>import("./modelTask-DYMYSz5j.js"),
__vite__mapDeps([4,3,1,5]),import.meta.url):mt(()=>import(`${r}`),[],import.meta.url)}function Q5(r={}){return typeof r.
runtime=="string"&&r.runtime.trim()?r.runtime.trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"j\
s"}async function J5(r,e){let t;if(r.fn?t=new Function(`return (${r.fn});`)():r.module&&(t=(await K5(r.module))[r.exportName||
"default"]),typeof t!="function")throw new Error("Handler not found for task");return t(r.data,e)}async function X5(r,e={}){
const t=Q5(r);switch(t){case"js":return J5(r,e);case"wasm":return V5(r);case"wasm-webgpu":return H5(r);default:throw new Error(
`Unsupported compute runtime: ${t}`)}}const Y5="peercompute.compute.solver-descriptor.v0",Z5="peercompute.compute.solver\
-task.v0";function ra(r,e){const t=String(r||"").trim();if(!t)throw new Error(`${e} is required`);return t}function Ns(r){
return r==null?r:JSON.parse(JSON.stringify(r))}function e4(r){if(typeof r=="string")return{name:ra(r,"field.name"),unit:null,
dimensions:null,location:null};if(!r||typeof r!="object")throw new Error("field must be a string or object");return{name:ra(
r.name,"field.name"),unit:r.unit??null,dimensions:r.dimensions??null,location:r.location??null,role:r.role??null}}function $c(r=[]){
if(!Array.isArray(r))throw new Error("fields must be an array");return r.map(e4)}function t4(r){return r.runtime?String(
r.runtime).trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"js"}function r4(r={}){if(!r||typeof r!=
"object")throw new Error("solver descriptor is required");const e=ra(r.id,"solver.id"),t=ra(r.kind||r.family,"solver.kin\
d"),n=t4(r),s=!!(r.module||r.fn||r.wasm||r.wasmSource||r.source);return{schema:Y5,id:e,kind:t,version:r.version||"0.0.0",
label:r.label||e,description:r.description||"",runtime:n,module:r.module,exportName:r.exportName||"default",fn:r.fn,hostModule:r.
hostModule,hostExport:r.hostExport,wasm:r.wasm,wasmSource:r.wasmSource,source:r.source,webgpu:r.webgpu||null,inputFields:$c(
r.inputFields||r.inputs||[]),outputFields:$c(r.outputFields||r.outputs||[]),conservedFields:$c(r.conservedFields||r.conserved||
[]),timestep:{mode:r.timestep?.mode||r.timestepMode||"explicit",maxDt:r.timestep?.maxDt??r.maxDt??null,subcycles:r.timestep?.
subcycles??r.subcycles??1},validity:Ns(r.validity||r.validityDomain||{}),affinity:{policy:r.affinity?.policy||r.affinityPolicy||
"state-key",keyFields:Array.isArray(r.affinity?.keyFields)?[...r.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{
scope:r.warmDelta?.scope||r.scope||"solver-deltas",schema:r.warmDelta?.schema||`peercompute.solver.${e}.delta.v0`},metadata:Ns(
r.metadata||{}),hasExecutor:s}}class n4{constructor(e=[]){this.solvers=new Map;for(const t of e)this.register(t)}register(e){
const t=r4(e);return this.solvers.set(t.id,t),t}unregister(e){return this.solvers.delete(e)}has(e){return this.solvers.has(
e)}get(e){const t=this.solvers.get(e);if(!t)throw new Error(`Solver not registered: ${e}`);return t}list(){return Array.
from(this.solvers.values()).map(e=>Ns(e))}createTask(e,{id:t,input:n={},stateKey:s=n.stateKey||n.taskId||e,affinityKey:i,
scope:o,version:a,timestamp:c,data:l={},placementHint:u,webgpu:d}={}){const h=this.get(e);if(!h.hasExecutor)throw new Error(
`Solver has no executable task target: ${e}`);const p=t||`${h.id}:${s}:${Date.now()}`,m=o||h.warmDelta.scope,y=u??l.placementHint??
null;return{id:p,solverId:h.id,taskFamily:h.id,runtime:h.runtime,module:h.module,exportName:h.exportName,fn:h.fn,hostModule:h.
hostModule,hostExport:h.hostExport,wasm:h.wasm,wasmSource:h.wasmSource,source:h.source,webgpu:d||h.webgpu||void 0,affinityKey:i||
`${h.id}:${s}`,placementHint:Ns(y),data:{schema:Z5,solver:{id:h.id,kind:h.kind,version:h.version,inputFields:h.inputFields,
outputFields:h.outputFields,conservedFields:h.conservedFields,timestep:h.timestep,validity:h.validity,warmDelta:{scope:m,
schema:h.warmDelta.schema}},stateKey:s,scope:m,version:a??null,timestamp:c??Date.now(),input:n,...l,placementHint:Ns(y)}}}}
const s4="peercompute.compute.gpu-resident-lane-manager.v0",i4="peercompute.compute.gpu-resident-lane.v0",o4="peercomput\
e.compute.gpu-resident-lane-lease.v0",a4="peercompute.compute.gpu-resident-lane-lease-identity.v0",c4="peercompute.compu\
te.gpu-resident-lane-execution.v0",ry="peercompute.compute.gpu-resident-lane-copy-budget.v0",l4="peercompute.compute.gpu\
-fence-report.v0",u4="peercompute.compute.gpu-resident-lane-stage-plan.v0",d4="peercompute.compute.gpu-resident-lane-sta\
ge-execution.v0",h4="peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0",Ql="queue.onSubmittedWorkDone-b\
efore-readback-map",ny="explicit-stage-dependencies",rp="sequential-stage-order",f4="defer-read-write-conflicting-ready-\
stages";function $i(r,e=0){const t=Number(r);return Number.isFinite(t)?t:e}function ie(r,e=null){return String(r??"").trim()||
e}function Ae(r,e=[]){return Array.isArray(r)?r.map(t=>ie(t)).filter(Boolean):typeof r=="string"?r.split(",").map(t=>ie(
t)).filter(Boolean):[...e]}function ue(r){return r==null?r:JSON.parse(JSON.stringify(r))}function np(r={}){const e=r?.residentSequenceLaneContract||
r?.residentLaneContract||r?.laneContract||r?.executionContract||null;return!e||typeof e!="object"?null:ue(e)}function p4(r={},e=0){
const t=ie(r.id,`stage:${e}`);return{...ue(r),id:t,index:e,lawNodeId:ie(r.lawNodeId,null),runtimeTarget:ie(r.runtimeTarget,
null),dependsOn:Ae(r.dependsOn??r.dependencies),inputFrom:ie(r.inputFrom??r.primaryInputFrom??r.inputStageId,null),reads:Ae(
r.reads??r.readFamilies),writes:Ae(r.writes??r.writeFamilies)}}function Ni(r=null,{laneId:e=null,stateKey:t=null,domainKey:n=null,
queueFencePolicy:s=null}={}){if(!r||typeof r!="object")return null;const i=Array.isArray(r.passDagStages)?r.passDagStages.
map((a,c)=>p4(a,c)):[],o=ie(r.stageDependencyMode??r.dependencyMode,i.some(a=>a.dependsOn.length>0)||r.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:u4,status:i.length>0?r.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:ie(r.laneId,e),stateKey:ie(r.stateKey,t),domainKey:ie(r.domainKey,n),queueFencePolicy:ie(r.
queueFencePolicy,s||Ql),contractSchema:ie(r.schema,null),contractStatus:ie(r.status,null),sequenceMode:ie(r.sequenceMode,
null),sequenceRunnable:r.sequenceRunnable===!0,defaultEnabled:r.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o===
"explicit-stage-dependencies",stageCount:i.length,stages:i}}function m4(r={}){const e=r&&typeof r=="object"?r:{value:r};
return{value:Object.prototype.hasOwnProperty.call(e,"value")?e.value:r,retainedBufferRefs:Ae(e.retainedBufferRefs??e.gpuFence?.
retainedBufferRefs),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?ue(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?ue(e.summary):null}}function na(r={}){const e=r.copyBudget&&typeof r.copyBudget=="object"?r.copyBudget:r;return{
schema:ry,uploadBytes:Math.max(0,Math.round($i(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
$i(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round($i(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round($i(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:ie(e.fullReadbackReason??
e.readbackReason,null)}}function g4(r={},e={}){const t=na(r),n=na(e);return{schema:ry,uploadBytes:t.uploadBytes+n.uploadBytes,
readbackBytes:t.readbackBytes+n.readbackBytes,retainedBytes:Math.max(t.retainedBytes,n.retainedBytes),compactSummaryBytes:t.
compactSummaryBytes+n.compactSummaryBytes,fullReadbackReason:n.fullReadbackReason||t.fullReadbackReason||null}}function b4(r={}){
return r.parallelStageExecution===!0||r.dependencyMode===ny||(r.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function y4(r,{
baseInput:e=null,currentValue:t=null,stageValues:n={}}={}){if(r.inputFrom&&Object.prototype.hasOwnProperty.call(n,r.inputFrom))
return n[r.inputFrom];const s=Ae(r.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(n,s[0])?n[s[0]]:
s.length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(i=>[i,n[i]])),previousValue:t,
baseInput:e}:t}function Nc(r=[],e=[]){const t=new Set(Ae(e));return Ae(r).filter(n=>t.has(n))}function w4(r={},e={}){const t=Nc(
r.writes,e.writes);if(t.length>0)return{conflictType:"write-write",families:t};const n=Nc(r.writes,e.reads);if(n.length>
0)return{conflictType:"write-read",families:n};const s=Nc(r.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function k4(r=[]){const e=[],t=[];for(const n of r){const s=e.map(i=>({stage:i,conflict:w4(i,n)})).find(
i=>i.conflict);s?t.push({stageId:n.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(n)}return{batch:e,deferred:t}}function E4(r={}){const e=new Set((r.stages||[]).map(t=>t.id));for(const t of r.
stages||[])for(const n of t.dependsOn||[])if(!e.has(n)){const s=new Error(`GPU resident lane stage ${t.id} depends on un\
known stage ${n}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=ue(t),s}}function sp(r={}){E4(r);
const e=b4(r),t=[],n=[];if(e){const s=new Map((r.stages||[]).map(o=>[o.id,o])),i=new Set;for(;s.size>0;){const o=(r.stages||
[]).filter(u=>s.has(u.id)).filter(u=>(u.dependsOn||[]).every(d=>i.has(d)));if(!o.length){const u=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw u.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",u}const{batch:a,deferred:c}=k4(o),l=t.length;n.push(...c.map(u=>({...u,batchIndex:l}))),
t.push(a.map(u=>u.id));for(const u of a)s.delete(u.id),i.add(u.id)}}else for(const s of r.stages||[])t.push([s.id]);return{
dependencyMode:e?ny:rp,parallelStageExecution:e,stateFamilyConflictPolicy:e?f4:rp,stateFamilyConflictDeferrals:n,stateFamilyConflictDeferralCount:n.
length,executionBatches:t,maxConcurrentStageCount:t.reduce((s,i)=>Math.max(s,i.length),0)}}function x4(r={},{batchIndex:e=-1,
executorSource:t=null,gpuHubExecutorDescriptor:n=null}={}){const s=ue(n?.workerPolicy),i=ie(s?.mode,null),o=s?.status===
"worker-ready",a=i==="dedicated-worker";let c="missing-stage-executor";return t==="stage-plan-executor"?c="stage-plan-ex\
ecutor":t==="provided-stage-executor"?c="provided-stage-executor":t==="gpu-hub-resident-stage-executor"&&(o?c="gpu-hub-w\
orker-resident-stage":a?c="gpu-hub-inline-fallback-for-worker-stage":c="gpu-hub-inline-resident-stage"),{stageId:r.id,lawNodeId:r.
lawNodeId,runtimeTarget:r.runtimeTarget,batchIndex:e,dependsOn:Ae(r.dependsOn),inputFrom:ie(r.inputFrom,null),reads:Ae(r.
reads),writes:Ae(r.writes),executorSource:t,placementTarget:c,gpuHubExecutorDescriptor:ue(n),workerPolicy:s,workerResidencyStatus:s?.
status||null,workerRequested:a,workerReady:o,sameDeviceRequired:s?.sameDeviceRequired===!0,bufferTransferPolicy:s?.bufferTransferPolicy||
null}}function v4(r){return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consum\
er-queue-completed"].includes(String(r||""))}class S4{constructor({gpuHub:e=null,deviceId:t="gpu-hub",now:n=()=>Date.now()}={}){
this.gpuHub=e,this.deviceId=t,this.now=n,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:s4,
laneCount:0,activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:t,domainKey:n,solverId:s}={}){return ie(e,`gpu-lane:${ie(
t||n||s,"default")}`)}getOrCreateLane(e={}){const t=this.resolveLaneId(e),n=ie(e.stateKey,null),s=ie(e.sourceFamily,null),
i=this.lanes.get(t);if(i){if(n&&i.stateKey&&i.stateKey!==n)throw new Error(`GPU resident lane ${t} already owns stateKey\
 ${i.stateKey}, not ${n}`);if(n&&!i.stateKey&&(i.stateKey=n),s&&i.sourceFamily&&i.sourceFamily!==s)throw new Error(`GPU \
resident lane ${t} already owns sourceFamily ${i.sourceFamily}, not ${s}`);return s&&!i.sourceFamily&&(i.sourceFamily=s),
e.domainKey&&!i.domainKey&&(i.domainKey=ie(e.domainKey,null)),e.solverId&&!i.solverId&&(i.solverId=ie(e.solverId,null)),
i}const o={schema:i4,laneId:t,stateKey:n,sourceFamily:s,domainKey:ie(e.domainKey,null),solverId:ie(e.solverId,null),deviceId:ie(
e.deviceId,this.deviceId),queueFencePolicy:ie(e.queueFencePolicy,Ql),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
Ae(e.retainedBufferRefs)),copyBudget:na(e.copyBudget||{}),residentSequenceLaneContract:np(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=Ni(o.residentSequenceLaneContract,o),this.lanes.set(t,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const t=this.getOrCreateLane(e),n=ie(e.leaseId,`${t.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(n))throw new Error(`GPU resident lane lease already exists: ${n}`);const s=na(e.
copyBudget||{}),i=np(e)||ue(t.residentSequenceLaneContract),o=Ni(i,{laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,
queueFencePolicy:t.queueFencePolicy});i&&(t.residentSequenceLaneContract=ue(i),t.stagePlan=ue(o));const a={schema:o4,leaseId:n,
laneId:t.laneId,stateKey:t.stateKey,sourceFamily:ie(e.sourceFamily,t.sourceFamily),domainKey:t.domainKey,solverId:ie(e.solverId,
t.solverId),taskId:ie(e.taskId,null),owner:ie(e.owner,"compute-manager"),readFamilies:Ae(e.readFamilies),writeFamilies:Ae(
e.writeFamilies),retainedBufferRefs:Ae(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:t.queueFencePolicy,residentSequenceLaneContract:i,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(n,a),t.activeLeases.set(n,a),t.copyBudget=g4(t.copyBudget,s);for(const c of a.retainedBufferRefs)t.retainedBufferRefs.
add(c);return t.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),ue(a)}createFenceReport(e,{status:t="queue-work-completed",method:n="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=t,queueCompletionMethod:i=n,readbackCompletionStatus:o=null,readbackCompletionMethod:a=null,
retainedBufferRefs:c=null,completed:l=null,source:u="gpu-resident-lane-manager"}={}){const d=typeof e=="string"?this.leases.
get(e):e;if(!d)throw new Error(`Unknown GPU resident lane lease: ${e}`);const h=this.lanes.get(d.laneId),p=l==null?v4(t):
l===!0;return{schema:l4,status:t,method:n,fenceSatisfied:p,required:!0,laneId:d.laneId,stateKey:d.stateKey,queueFencePolicy:d.
queueFencePolicy||h?.queueFencePolicy||Ql,queueCompletionStatus:s,queueCompletionMethod:i,readbackCompletionStatus:o,readbackCompletionMethod:a,
retainedBufferRefs:Ae(c,d.retainedBufferRefs),workerId:null,deviceId:h?.deviceId||this.deviceId,completedAt:p?this.now():
null,source:u}}completeLease(e,t={}){const n=this.leases.get(e);if(!n)throw new Error(`Unknown GPU resident lane lease: ${e}`);
const s=this.lanes.get(n.laneId),i=this.createFenceReport(n,t);if(n.status=i.fenceSatisfied?"completed":"completed-unsat\
isfied-fence",n.gpuFence=i,n.releasedAt=this.now(),n.releaseReason=t.releaseReason||n.status,Array.isArray(t.retainedBufferRefs)&&
(n.retainedBufferRefs=Ae(t.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=i,s.updatedAt=this.now();for(const o of n.
retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,
this.stats.completedLeaseCount+=1,this.stats.lastFence=ue(i),{schema:c4,lease:ue(n),gpuFence:i,lane:s?this.snapshotLane(
s.laneId):null,residentSequenceLaneContract:ue(n.residentSequenceLaneContract),stagePlan:ue(n.stagePlan),stageExecution:ue(
n.stageExecution)}}async executeStagePlan(e,{input:t=null,context:n={},executor:s=null,stageExecutors:i={},allowMissingExecutors:o=!1}={}){
const a=typeof e=="string"?this.leases.get(e):e;if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const c=this.
lanes.get(a.laneId),l=a.stagePlan||Ni(a.residentSequenceLaneContract,{laneId:a.laneId,stateKey:a.stateKey,domainKey:a.domainKey,
queueFencePolicy:a.queueFencePolicy});if(!l||!Array.isArray(l.stages)||l.stages.length===0){const E=new Error(`GPU resid\
ent lane lease ${a.leaseId} has no executable stage plan`);throw E.code="ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING",E}const u=this.
now(),d=[],h={},p=sp(l),m=new Map(l.stages.map(E=>[E.id,E]));let y=t;const g=async(E,v)=>{let _=typeof s=="function"?s:i?.[E.
id]||i?.[E.lawNodeId],k=typeof s=="function"?"stage-plan-executor":_?"provided-stage-executor":null;typeof _!="function"&&
this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(E)&&typeof this.
gpuHub.executeResidentStage=="function"&&(_=$=>this.gpuHub.executeResidentStage($),k="gpu-hub-resident-stage-executor");
const x=k==="gpu-hub-resident-stage-executor"&&typeof this.gpuHub?.describeResidentStageExecutor=="function"?this.gpuHub.
describeResidentStageExecutor(E):null;if(typeof _!="function"){if(!o){const $=new Error(`Missing GPU resident lane stage\
 executor: ${E.id}`);throw $.code="ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING",$.stage=ue(E),$}return{result:{stageId:E.
id,lawNodeId:E.lawNodeId,status:"blocked-missing-stage-executor",retainedBufferRefs:[],workerResidency:null},value:v}}const C=this.
now(),I=await _({stage:ue(E),stageIndex:E.index,input:v,lease:ue(a),lane:c?this.snapshotLane(c.laneId):null,context:n}),
S=m4(I),T=Ae(S.retainedBufferRefs);if(T.length>0&&(a.retainedBufferRefs=Ae([...a.retainedBufferRefs,...T]),c)){for(const $ of T)
c.retainedBufferRefs.add($);c.updatedAt=this.now()}return{result:{stageId:E.id,lawNodeId:E.lawNodeId,runtimeTarget:E.runtimeTarget,
status:"completed",executorSource:k,startedAt:C,completedAt:this.now(),retainedBufferRefs:T,gpuFence:S.gpuFence,workerResidency:ue(
x?.workerPolicy),summary:S.summary},value:S.value}};if(p.parallelStageExecution===!0)for(const E of p.executionBatches){
const v=E.map(k=>m.get(k)).filter(Boolean),_=await Promise.all(v.map(k=>g(k,y4(k,{baseInput:t,currentValue:y,stageValues:h}))));
for(let k=0;k<v.length;k+=1){const x=v[k],C=_[k];h[x.id]=C.value,y=C.value,d.push(C.result)}}else for(const E of p.executionBatches){
const v=m.get(E[0]),_=await g(v,y);y=_.value,h[v.id]=_.value,d.push(_.result)}const b=d.some(E=>E.status!=="completed"),
w={schema:d4,status:b?"blocked":"completed",leaseId:a.leaseId,laneId:a.laneId,stateKey:a.stateKey,stagePlan:ue(l),stageCount:l.
stages.length,completedStageCount:d.filter(E=>E.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:d,retainedBufferRefs:Ae(a.retainedBufferRefs),output:y,startedAt:u,completedAt:this.
now()};return a.stageExecution=ue(w),c&&(c.updatedAt=this.now()),w}preflightStagePlacement(e,{executor:t=null,stageExecutors:n={},
allowMissingExecutors:s=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(i.laneId),a=i.stagePlan||Ni(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!a||!Array.isArray(a.stages)||a.stages.
length===0){const g=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw g.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",g}const c=sp(a),l=new Map;c.executionBatches.forEach((g,f)=>{for(const b of g)l.set(b,
f)});const u=a.stages.map(g=>{let f=typeof t=="function"?t:n?.[g.id]||n?.[g.lawNodeId],b=typeof t=="function"?"stage-pla\
n-executor":f?"provided-stage-executor":null,w=null;return typeof f!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(g)&&typeof this.gpuHub.describeResidentStageExecutor=="function"&&(w=this.
gpuHub.describeResidentStageExecutor(g),b="gpu-hub-resident-stage-executor"),x4(g,{batchIndex:l.get(g.id)??-1,executorSource:b,
gpuHubExecutorDescriptor:w})}),d=u.filter(g=>!g.executorSource).map(g=>g.stageId),h=u.filter(g=>g.workerRequested).map(g=>g.
stageId),p=u.filter(g=>g.workerReady).map(g=>g.stageId),m=u.filter(g=>g.workerRequested&&!g.workerReady).map(g=>g.stageId),
y=s===!0||d.length===0;return{schema:h4,status:y?"placement-preflight-ready":"blocked-missing-stage-executors",authority:"\
compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,domainKey:i.
domainKey,deviceId:o?.deviceId||this.deviceId,stagePlan:ue(a),stageCount:a.stages.length,dependencyMode:c.dependencyMode,
parallelStageExecution:c.parallelStageExecution,stateFamilyConflictPolicy:c.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:c.
stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:c.stateFamilyConflictDeferralCount,placementBatches:c.executionBatches,
maxConcurrentStageCount:c.maxConcurrentStageCount,stagePlacements:u,executorSources:Object.fromEntries(u.map(g=>[g.stageId,
g.executorSource])),workerResidencyStatuses:Object.fromEntries(u.map(g=>[g.stageId,g.workerResidencyStatus])),missingExecutorStageIds:d,
missingExecutorCount:d.length,workerRequestedStageIds:h,workerRequestedCount:h.length,workerReadyStageIds:p,workerReadyCount:p.
length,workerFallbackStageIds:m,workerFallbackCount:m.length,canExecute:y,createdAt:this.now()}}planStagePlacement(e,t={}){
return this.preflightStagePlacement(e,t)}rejectLease(e,t="lane-validation-rejected"){const n=this.leases.get(e);if(!n)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(n.laneId);return n.status="rejected",n.releasedAt=this.now(),
n.releaseReason=t,s&&(s.activeLeases.delete(e),s.updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=
this.leases.size,this.stats.rejectedLeaseCount+=1,ue(n)}snapshotLane(e){const t=this.lanes.get(e);return t?{schema:t.schema,
laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,solverId:t.solverId,deviceId:t.deviceId,queueFencePolicy:t.queueFencePolicy,
status:t.status,activeLeaseCount:t.activeLeases.size,retainedBufferRefs:[...t.retainedBufferRefs].sort(),copyBudget:ue(t.
copyBudget),residentSequenceLaneContract:ue(t.residentSequenceLaneContract),stagePlan:ue(t.stagePlan),createdAt:t.createdAt,
updatedAt:t.updatedAt,lastFence:ue(t.lastFence)}:null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(
e))}getStats(){return{...ue(this.stats),laneCount:this.lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}
function A4(){return new Worker(new URL(""+new URL("computeWorker-IyvZTsnr.js",import.meta.url).href,import.meta.url),{type:"\
module"})}const ip=128,op=5e3,_4="peercompute.compute.worker-utilization.v0",ap="peercompute.compute.task-placement.v0",
I4="peercompute.compute.remote-placement-provenance.v0",Uc="peercompute.compute.remote-placement-verification.v0",cp="pe\
ercompute.compute.remote-placement-validation.v0",ks="peercompute.compute.remote-placement-retry.v0",lp="peercompute.com\
pute.remote-task-envelope.v0",up="peercompute.compute.task-packet.v0",C4="peercompute.compute.task-execution.v0",dp="pee\
rcompute.compute.task-graph-result.v0",T4="peercompute.compute.task-graph-context.v0",M4="peercompute.compute.task-graph\
-cache-policy.v0",R4="peercompute.compute.task-graph-cache-inputs.v0",B4="peercompute.compute.task-graph-cache-artifact.\
v0",Jl="peercompute.compute.task-graph-cache-admission.v0",hp="peercompute.compute.remote-task-graph-cache-import.v0",L4="\
peercompute.compute.remote-task-graph-state-seed-policy.v0",D4="peercompute.compute.task-graph-placement-policy.v0",Fc="\
peercompute.compute.task-graph-cancellation.v0",sy="peercompute.compute.task-graph-gpu-resident-lane.v0",P4="peercompute\
.compute.gpu-fence-report.v0",Sn=["timeout","executor-error"],Ui=["rejected","verification-failed","validation-failed"],
$4=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","\
maxComputeWorkgroupsPerDimension"];function Q(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(r));return Number.
isFinite(s)?Math.min(n,Math.max(t,s)):e}function st(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Number(r);return Number.isFinite(
s)?Math.min(n,Math.max(t,s)):e}function N4({cpuCores:r,deviceMemoryGB:e,gpuAvailable:t,declaredTier:n}){return n?String(
n):r>=32||e>=64?"cluster":t&&(r>=12||e>=16)?"workstation":r<=4||e&&e<=4?"mobile":"laptop"}function Xl(r){return r==="clu\
ster"?8192:r==="workstation"?2048:r==="mobile"?384:1024}function iy(r){return r==="cluster"?4096:r==="workstation"?1024:
r==="mobile"?192:512}function U4({tier:r,deviceMemoryGB:e}){const t=Xl(r);if(!e)return t;const n=e*1024*.25;return Math.
max(128,Math.min(t,n))}function oy(r={}){if(!r)return null;const e=r.gpuLimits||r,t={};for(const n of $4){const s=Q(e[n],
null,0,Number.MAX_SAFE_INTEGER);s!=null&&(t[n]=s)}return Object.keys(t).length>0?t:null}function Oc(r={},e={}){const t=typeof navigator<
"u"?navigator:null,n=Q(r.cpuCores??r.hardwareConcurrency??t?.hardwareConcurrency,4,1,512),s=st(r.deviceMemoryGB??r.deviceMemory??
t?.deviceMemory,null,0,2048),i=r.gpuAvailable??e.webgpu??!!t?.gpu,o=N4({cpuCores:n,deviceMemoryGB:s??0,gpuAvailable:i,declaredTier:r.
tier||r.deviceClass}),a=st(r.memoryBudgetMB??r.ramBudgetMB,U4({tier:o,deviceMemoryGB:s}),0,1048576),c=st(r.gpuMemoryBudgetMB??
r.gpuBudgetMB??r.vramBudgetMB,i?iy(o):0,0,1048576),l=st(r.budgetScale??r.resourceBudgetScale??r.computeScale,1,.05,64),u=oy(
r.gpuLimits||{maxBufferSize:r.gpuMaxBufferSize??r.maxBufferSize,maxStorageBufferBindingSize:r.gpuMaxStorageBufferBindingSize??
r.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:r.gpuMaxComputeWorkgroupStorageSize??r.maxComputeWorkgroupStorageSize,
maxComputeInvocationsPerWorkgroup:r.gpuMaxComputeInvocationsPerWorkgroup??r.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:r.
gpuMaxComputeWorkgroupsPerDimension??r.maxComputeWorkgroupsPerDimension});return{schema:"peercompute.compute.resource-pr\
ofile.v0",tier:o,cpuCores:n,deviceMemoryGB:s,memoryBudgetMB:a,gpuMemoryBudgetMB:c,budgetScale:l,gpuLimits:u,gpuLimitsSource:u?
r.gpuLimitsSource||"configured":null,gpuAvailable:!!i,wasmAvailable:!!e.wasm,source:r.source||(r.tier?"configured":"brow\
ser")}}function F4(r){const e=r.cpuCores||4;return r.tier==="cluster"?Math.min(64,Math.max(8,e)):r.tier==="workstation"?
Math.min(16,Math.max(4,e)):r.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.floor(e*.75)))}function zc(r={},e){
const t=Q(r.maxWorkers,null,1,ip),n=F4(e),s=t??Math.min(ip,Math.max(n,e.cpuCores||n)),i=Q(r.minWorkers,Math.min(s,e.tier===
"mobile"?1:2),0,s),o=Q(r.targetWorkers??r.initialWorkers,Math.min(s,Math.max(i,n)),i,s);return{schema:"peercompute.compu\
te.worker-policy.v0",autoScale:r.autoScaleWorkers!==!1,minWorkers:i,targetWorkers:o,maxWorkers:s,scaleUpQueueDepth:Q(r.scaleUpQueueDepth,
1,1,1024),idleScaleDownMs:Q(r.idleScaleDownMs,5e3,0,6e5)}}function O4(r){return r==="cluster"?4:r==="workstation"?2:r===
"mobile"?.5:1}function z4(r){return r==="cluster"?4:r==="workstation"?2:1}function q4(r){return r==="cluster"?64:r==="wo\
rkstation"?16:r==="mobile"?2:8}function Fi(r,e=1){return st(r,e,.25,8)}function j4(r){const e=String(r||"");return e==="\
manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function G4(r,e){const t=Math.max(1,e);return Math.
max(t,Math.round(r/t)*t)}function lt(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():
Date.now()}function W4(r){const e=Math.max(0,Number(r)||0);return e<=0?Promise.resolve():new Promise(t=>setTimeout(t,e))}
function qc(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0}}
function V4(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,timedOut:0,rejected:0,verificationFailed:0,
validationFailed:0}}function oe(r,e=[]){return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r==
"string"?r.split(",").map(t=>t.trim()).filter(Boolean):[...e]}function Oi(...r){const e=new Set,t=[];for(const n of r)for(const s of oe(
n,[]))e.has(s)||(e.add(s),t.push(s));return t}function X(...r){for(const e of r)if(e!=null)return e;return null}function H4(r={}){
const e=r.webgpu||r.data?.webgpu||{},t=r.gpuFence||r.gpuFenceRequirement||e.gpuFence||e.fence||e.fenceRequirement||{},n=t.
required===!0||t.fenceRequired===!0||e.fenceRequired===!0||e.requiresFence===!0||e.requiresQueueFence===!0,s=X(t.laneId,
t.gpuLaneId,e.laneId,e.gpuLaneId),i=X(t.stateKey,t.gpuStateKey,e.stateKey,e.gpuStateKey,r.stateKey,r.data?.stateKey,r.data?.
input?.stateKey),o=X(t.queueFencePolicy,t.fencePolicy,e.queueFencePolicy,e.fencePolicy),a=oe(t.retainedBufferRefs??e.retainedBufferRefs,
[]);return!n&&!s&&!i&&!o&&a.length===0?null:{schema:"peercompute.compute.gpu-fence-requirement.v0",required:n,laneId:s?String(
s):null,stateKey:i?String(i):null,queueFencePolicy:o?String(o):null,retainedBufferRefs:a,source:t.source||(e&&Object.keys(
e).length>0?"task.webgpu":"task.gpuFence")}}function K4(r={},e=null){const t=r.webgpu||r.data?.webgpu||{},n=r.gpuResidentLane||
r.gpuResidentLaneLease||r.residentLane||t.gpuResidentLane||t.residentLane||{},s=X(n.residency,t.residency,r.residency,r.
data?.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===!0||String(s||"").trim().toLowerCase()==="gpu-lane",
o=X(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId,e?.laneId),a=X(n.stateKey,n.gpuStateKey,t.stateKey,t.gpuStateKey,r.stateKey,
r.data?.stateKey,r.data?.input?.stateKey,e?.stateKey),c=X(n.domainKey,n.domain,t.domainKey,r.domainKey,r.data?.domainKey),
l=X(n.sourceFamily,t.sourceFamily,r.data?.sourceFamily,r.data?.input?.sourceFamily),u=X(n.queueFencePolicy,n.fencePolicy,
t.queueFencePolicy,e?.queueFencePolicy),d=oe(n.retainedBufferRefs??t.retainedBufferRefs,e?.retainedBufferRefs||[]),h=n.copyBudget&&
typeof n.copyBudget=="object"?JSON.parse(JSON.stringify(n.copyBudget)):t.copyBudget&&typeof t.copyBudget=="object"?JSON.
parse(JSON.stringify(t.copyBudget)):{},p=X(n.residentSequenceLaneContract,n.residentLaneContract,n.laneContract,t.residentSequenceLaneContract,
r.data?.residentSequenceLaneContract,r.data?.input?.residentSequenceLaneContract,r.lawGraphNode?.residentSequenceLaneContract,
null);return!i&&!o&&!a&&d.length===0&&Object.keys(h).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task\
.v0",enabled:!0,localExecution:String(X(n.localExecution,n.executionMode,t.localExecution,"inline")||"inline").trim().toLowerCase()===
"worker"?"worker":"inline",laneId:o?String(o):null,stateKey:a?String(a):null,sourceFamily:l?String(l):null,domainKey:c?String(
c):null,solverId:X(n.solverId,r.solverId,r.data?.solverId)||null,owner:X(n.owner,r.owner,r.taskFamily,r.solverId,"comput\
e-manager-task"),readFamilies:oe(n.readFamilies??n.reads??t.readFamilies),writeFamilies:oe(n.writeFamilies??n.writes??t.
writeFamilies),retainedBufferRefs:d,queueFencePolicy:u?String(u):null,copyBudget:h,residentSequenceLaneContract:p&&typeof p==
"object"?ne(p):null}}function ne(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}function Q4(r={},e=[]){const t=r.cacheInputs||r.cachePolicy?.inputs||r.cache?.
inputs||r.inputRefs||null,n=t&&typeof t=="object"?t:{},s=oe(n.stateRefs??n.states??r.stateRefs),i=oe(n.closureRefs??n.closures??
r.closureRefs),o=oe(n.invalidationRefs??n.invalidates??r.invalidationRefs),a=oe(n.retainedBufferRefs??r.retainedBufferRefs),
c=oe(n.inputHashes??n.hashes??r.inputHashes),l=oe(n.lawIds??n.laws??r.lawIds),u=oe(n.stateFamilies??r.stateFamilies),d=oe(
n.readFamilies??r.readFamilies),h=oe(n.writeFamilies??r.writeFamilies),p=X(n.values,n.value,n.parameters,r.cacheInputValues,
null),m=e.map(b=>({id:b.id,dependsOn:[...b.dependsOn],taskFamily:b.taskFamily||b.task?.taskFamily||b.task?.solverId||null,
solverId:b.solverId||b.task?.solverId||null,cacheInput:X(b.cacheInput,b.cacheInputs,b.task?.cacheInput,null)}));if(!(t!=
null||s.length>0||i.length>0||o.length>0||a.length>0||c.length>0||l.length>0||u.length>0||d.length>0||h.length>0||p!=null||
m.some(b=>b.cacheInput!=null||b.taskFamily||b.solverId)))return null;const g={graphFamily:String(X(n.graphFamily,r.graphFamily,
r.taskFamily,"task-graph")||"task-graph"),graphVersion:String(X(n.graphVersion,r.graphVersion,r.version,"v0")||"v0"),lawGraphId:X(
n.lawGraphId,r.lawGraphId,null),stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,
stateFamilies:u,readFamilies:d,writeFamilies:h,scaleRegime:X(n.scaleRegime,r.scaleRegime,null),units:X(n.units,r.units,null),
values:p,nodes:m},f=Fs(Us(g));return{schema:R4,status:"content-addressed-inputs-declared",inputHash:f,stateRefs:s,closureRefs:i,
invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,stateFamilies:u,readFamilies:d,writeFamilies:h,nodeCount:e.
length,source:t?"graph.cacheInputs":"graph-derived-input-refs"}}function J4(r={},e=[]){const t=r.cachePolicy||r.cache||{},
n=String(X(r.cacheKey,t.cacheKey,t.key,"")||"").trim()||null,s=Q4(r,e),i=String(X(t.scope,r.cacheScope,"compute-manager-\
local")||"compute-manager-local"),o=s?`${i}:${s.inputHash}`:null,a=n||o,c=String(X(r.cacheMode,t.mode,a?"read-through":"\
disabled")||"disabled").trim().toLowerCase(),l=t.enabled!==!1&&a!=null&&c!=="disabled"&&c!=="off";let u="disabled";return l&&
(c==="record-only"||c==="write-only"?u="record-only":c==="read-only"?u="read-only":u="read-through"),{schema:M4,cacheKey:a,
mode:u,readEnabled:u==="read-through"||u==="read-only",writeEnabled:u==="read-through"||u==="record-only",ttlMs:Q(t.ttlMs??
r.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:i,requireAdmitted:t.requireAdmitted!==!1&&r.cacheRequireAdmitted!==!1,explicitCacheKey:n,
derivedCacheKey:o,keySource:n?"explicit":o?"content-addressed-inputs":null,inputHash:s?.inputHash||null,inputs:s,status:l?
"cache-policy-enabled":"cache-policy-disabled"}}function X4(r={}){const e=X(r.stateSeedPayload,r.cachePolicy?.stateSeedPayload,
r.cache?.stateSeedPayload,r.remoteStateSeedPayload,null);return e==null?null:ne(e)}function Yl(r,e=new WeakSet){if(r==null)
return r;if(typeof r=="function"||typeof r=="symbol")return;if(typeof r!="object")return r;if(ArrayBuffer.isView(r))return new r.
constructor(r);if(r instanceof ArrayBuffer)return r.slice(0);if(e.has(r))return null;if(e.add(r),Array.isArray(r))return r.
map(n=>Yl(n,e)).filter(n=>n!==void 0);const t={};for(const[n,s]of Object.entries(r)){const i=Yl(s,e);i!==void 0&&(t[n]=i)}
return t}function Y4(r={},e={},t={}){const n=e.resultInputs||e.resultInputMap||(r&&typeof r=="object"?r.resultInputs:null);
if(!n||typeof n!="object"||Array.isArray(n))return r;const s=r.data&&typeof r.data=="object"&&!Array.isArray(r.data)?{...r.
data}:{},i={};for(const[o,a]of Object.entries(n)){const c=typeof a=="string"?a:String(a?.nodeId||a?.resultId||a?.from||"").
trim();if(!(!o||!c)){if(!Object.prototype.hasOwnProperty.call(t,c))throw new Error(`Task graph node ${e.id} requested un\
available result input ${o} from ${c}`);s[o]=Yl(t[c]),i[o]=c}}return Object.keys(i).length===0?r:{...r,data:s,taskGraphResultInputs:i}}
function Z4(r={},e={}){const t=r.cacheAdmission||r.cachePolicy?.admission||r.cache?.admission||{},n=t.admitted===!0||t.accepted===
!0||t.status==="admitted"||t.status==="admission-accepted",s=e.mode==="record-only",i=t.status||(n?"admitted":s?"recorde\
d-not-admitted":"pending-admission");return{schema:Jl,status:i,admitted:n,authority:String(X(t.authority,r.cacheAuthority,
"compute-manager-local")||"compute-manager-local"),admissionId:X(t.admissionId,t.id,null),validatorId:X(t.validatorId,t.
validator,null),reason:String(X(t.reason,s?"record-only-cache-artifact-requires-state-manager-admission":"cache-artifact\
-admission-pending","")||""),invalidationRefs:oe(t.invalidationRefs??e.inputs?.invalidationRefs),acceptedAt:n?t.acceptedAt||
Date.now():null}}function eT({graphId:r,cachePolicy:e,result:t,storedAt:n,expiresAt:s,admission:i}={}){const o=Fs(Us({schema:t?.
schema,graphId:t?.graphId,status:t?.status,nodeReports:t?.nodeReports,nodeResults:t?.nodeResults}));return{schema:B4,artifactId:`${e.
cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.inputHash,resultHash:o,
graphId:r,status:i?.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:i?.admitted===!0,admission:i,
inputs:e.inputs,invalidationRefs:oe(i?.invalidationRefs,e.inputs?.invalidationRefs||[]),stateSeedPayload:t?.stateSeedPayload!=
null?ne(t.stateSeedPayload):null,storedAt:n,expiresAt:s,ttlMs:e.ttlMs,resultSchema:t?.schema||null,nodeCount:t?.nodeCount??
null,resultNodeSchemas:(t?.nodeReports||[]).map(a=>({nodeId:a.nodeId,resultSchema:a.resultSchema||null,taskFamily:a.taskFamily||
null}))}}function tT(r={}){const e=r.placementPolicy||r.placement||r.placementHint||{},t=String(X(e.requestedPlacement,e.
placement,e.mode,r.requestedPlacement,r.placementMode,"local")||"local").trim().toLowerCase();return{schema:D4,requestedPlacement:t,
locality:String(X(e.locality,r.locality,t==="local"?"local-inline":"distributed")||""),authority:String(X(e.authority,r.
authority,"compute-manager")||"compute-manager"),targetPeerIds:oe(e.targetPeerIds??e.peers??r.targetPeerIds),targetClusterId:X(
e.targetClusterId,e.clusterId,r.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||r.gpuResident===!0,
advisory:e.advisory!==!1}}function rT(r={},e=null){const t=r.webgpu||{},n=r.gpuResidentLane||r.gpuResidentLaneLease||r.residentLane||
t.gpuResidentLane||t.residentLane||{},s=X(n.residency,t.residency,r.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=X(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId),a=X(n.stateKey,n.gpuStateKey,
t.stateKey,t.gpuStateKey,r.stateKey),c=X(n.domainKey,n.domain,t.domainKey,r.domainKey),l=oe(n.retainedBufferRefs??t.retainedBufferRefs??
r.retainedBufferRefs),u=n.copyBudget&&typeof n.copyBudget=="object"?ne(n.copyBudget):t.copyBudget&&typeof t.copyBudget==
"object"?ne(t.copyBudget):{};return!i&&!o&&!a&&l.length===0&&Object.keys(u).length===0?null:{schema:sy,enabled:!0,laneId:o?
String(o):null,stateKey:a?String(a):null,domainKey:c?String(c):null,solverId:X(n.solverId,r.solverId,null),taskId:e,owner:X(
n.owner,r.owner,"compute-manager-task-graph"),readFamilies:oe(n.readFamilies??n.reads??t.readFamilies??r.readFamilies),writeFamilies:oe(
n.writeFamilies??n.writes??t.writeFamilies??r.writeFamilies),retainedBufferRefs:l,queueFencePolicy:X(n.queueFencePolicy,
n.fencePolicy,t.queueFencePolicy,null),copyBudget:u}}function nT(r){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(r||""))}
function zi(r=null,e=null){const t=r&&typeof r=="object"?r:{},n=t.status||t.queueCompletionStatus||t.fenceStatus||t.completionStatus||
(e?.required?"gpu-fence-report-missing":null);if(!n&&!e?.required)return null;const s=t.method||t.queueCompletionMethod||
t.fenceMethod||t.completionMethod||null,i=t.fenceSatisfied===!0||t.satisfied===!0||t.completed===!0||nT(n);return{schema:t.
schema||P4,status:n,method:s,fenceSatisfied:i,required:e?.required===!0||t.required===!0,laneId:X(t.laneId,t.gpuLaneId,e?.
laneId),stateKey:X(t.stateKey,t.gpuStateKey,e?.stateKey),queueFencePolicy:X(t.queueFencePolicy,t.fencePolicy,e?.queueFencePolicy),
queueCompletionStatus:t.queueCompletionStatus||n||null,queueCompletionMethod:t.queueCompletionMethod||s||null,retainedBufferRefs:oe(
t.retainedBufferRefs,e?.retainedBufferRefs||[]),workerId:t.workerId||t.remoteWorkerId||null,deviceId:t.deviceId||t.gpuDeviceId||
null,completedAt:t.completedAt||null,source:t.source||null}}function jc(r){return r?typeof r=="function"?r.placementExecutorId||
r.id||r.name||"placement-executor":r.id||r.name||r.constructor?.name||"placement-executor":null}function Gc(r){return r?
typeof r=="function"?r.placementAdmissionId||r.id||r.name||"placement-admission":r.id||r.name||r.constructor?.name||"pla\
cement-admission":null}function Wc(r){return r?typeof r=="function"?r.placementResultValidatorId||r.id||r.name||"placeme\
nt-result-validator":r.id||r.name||r.constructor?.name||"placement-result-validator":null}function Vc(r){return r?typeof r==
"function"?r.placementTaskSignerId||r.id||r.name||"placement-task-signer":r.id||r.name||r.constructor?.name||"placement-\
task-signer":null}function sT(r){return(Array.isArray(r)?r:[]).slice(0,64).map((t,n)=>{const s=t&&typeof t=="object"?t:{};
return{schema:s.schema||null,role:s.role||null,index:n,peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||
s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.transportPeerId||null,responderNodeId:s.responderNodeId||
null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.
remoteExecution&&typeof s.remoteExecution=="object"?JSON.parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&
typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||
null,inputHash:s.inputHash||null,taskHash:s.taskHash||null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||
s.outputHash||null,commitDeltaHash:s.commitDeltaHash||s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.
validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===
!0,errorCode:s.errorCode||null,errorMessage:s.errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(
Number(s.durationMs).toFixed(3)):null}})}function Zl(r){if(r==null)return r;if(typeof r=="number")return Number.isFinite(
r)?r:String(r);if(typeof r=="string"||typeof r=="boolean")return r;if(typeof r=="bigint")return`${r.toString()}n`;if(typeof r==
"function")return`[Function:${r.name||"anonymous"}]`;if(ArrayBuffer.isView(r))return{typedArray:r.constructor?.name||"Ty\
pedArray",values:Array.from(r)};if(r instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(r))};if(Array.
isArray(r))return r.map(Zl);if(typeof r=="object"){const e={};for(const t of Object.keys(r).sort()){if(t==="taskPacket"||
t==="taskEnvelope")continue;const n=Zl(r[t]);n!==void 0&&(e[t]=n)}return e}return String(r)}function Us(r){return JSON.stringify(
Zl(r))}function Fs(r){const e=String(r??"");let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(
t,16777619)>>>0;return`fnv1a32-${t.toString(16).padStart(8,"0")}`}function Hc({executorId:r,kind:e="worker",ordinal:t=null,
status:n="active"}={}){return{executorId:r,kind:e,ordinal:t,status:n,activeTaskCount:0,submitted:0,completed:0,failed:0,
abandoned:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,
lastStartedAt:null,lastCompletedAt:null,byRuntime:{},byTaskFamily:{}}}class iT{constructor(e={}){const t=typeof navigator<
"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4,n=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<
"u";this.workerPolicyOverrides={minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.
maxWorkers,autoScaleWorkers:e.autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},
this.resourceProfile=Oc(e.resourceProfile||e,{wasm:s,webgpu:n}),this.workerPolicy=zc(this.workerPolicyOverrides,this.resourceProfile),
this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:Q(
e.workerBootstrapTimeoutMs,op,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,
maxWorkers:this.workerPolicy.maxWorkers||t,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.
workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.
config.workerBootstrapTimeoutMs=Q(e.workerBootstrapTimeoutMs,op,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=
new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,this.taskGraphCacheArtifacts=new Map,this.workerAffinities=
new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=new Map,this.modelServices=new Set,this.resourceBroker=
e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=new WeakMap,this.workerRequirementError=null,this.
workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=new Map,this.nextWorkerOrdinal=1,
this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,Hc({executorId:this.inlineExecutorId,kind:"\
inline",ordinal:0,status:"active"})),this.solverRegistry=new n4(e.solvers||[]),this.gpuResidentLaneManager=e.gpuResidentLaneManager||
new S4({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.targetWorkerCount=this.workerPolicy.
targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=0,this.workerResizeHistory=[],
this.placementExecutor=typeof e.placementExecutor=="function"||e.placementExecutor?.submitTask?e.placementExecutor:null,
this.placementExecutorId=e.placementExecutorId||jc(this.placementExecutor),this.placementAdmission=typeof e.placementAdmission==
"function"||e.placementAdmission?.admitTask?e.placementAdmission:null,this.placementAdmissionId=e.placementAdmissionId||
Gc(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="function"||e.placementResultValidator?.
validateTaskResult||e.placementResultValidator?.validateResult?e.placementResultValidator:null,this.placementResultValidatorId=
e.placementResultValidatorId||Wc(this.placementResultValidator),this.placementTaskSigner=typeof e.placementTaskSigner=="\
function"||e.placementTaskSigner?.signTaskPacket||e.placementTaskSigner?.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||
e.remoteTaskSigner:null,this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||Vc(this.placementTaskSigner),
this.placementTimeoutMs=Q(e.placementTimeoutMs??e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.remoteResultVerification!==
!1&&e.placementResultVerification!==!1,this.placementRetryPolicy={schema:ks,maxAttempts:Q(e.placementMaxAttempts??e.remotePlacementMaxAttempts,
1,1,100),baseDelayMs:Q(e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,50,0,6e5),maxDelayMs:Q(e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,1e3,0,6e5),jitterFraction:st(e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
0,0,1),retryableErrorKinds:oe(e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,Sn),terminalErrorKinds:[
...Ui]},this.manualWorkerAutoScaleCooldownMs=Q(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,4e3,0,6e5),this.
workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=null,this.lastWorkerResize={schema:"peercompute.compute.worker\
-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.targetWorkerCount,targetWorkers:this.targetWorkerCount,
previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.stats={schema:"peercompute.compute.manager-stats.v0",
totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,workerTasksCompleted:0,remoteTasksCompleted:0,
remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,remoteTasksValidationFailed:0,
remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,taskGraphsCompleted:0,taskGraphsFailed:0,
taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,taskGraphCacheArtifactsAdmitted:0,
taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,taskGraphCacheReadBlocked:0,
totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{},taskPlacement:{schema:ap,totalSubmitted:0,totalCompleted:0,totalFailed:0,localSubmitted:0,remoteRequested:0,
remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,remoteValidationFailed:0,remoteAttempts:0,
remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,byRecommendedPlacement:{},byActualPlacement:{}}},
this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities={cpu:!0,wasm:s,webgpu:n,wasmWebgpu:s&&n},this.initialized=
!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const t=Q(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
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
{ResidentModelAdmission:l},u]=await Promise.all([mt(()=>import("./ModelInferenceService-w6hAVBk6.js"),__vite__mapDeps([6,3]),import.meta.
url),mt(()=>import("./ResourceLeaseBroker-CGg9Wxga.js"),[],import.meta.url),mt(()=>import("./ResidentModelAdmission-BZWCmJpI.js"),
[],import.meta.url),s==="llama.cpp"?mt(()=>import("./runtimeDefinition-DM2y_sju.js"),__vite__mapDeps([2,3]),import.meta.
url).then(p=>p.ggufRuntimeDefinition):s==="onnx-diffusion"?mt(()=>import("./runtimeDefinition-JV4DRtJ7.js"),__vite__mapDeps([5,3]),
import.meta.url).then(p=>p.diffusionRuntimeDefinition):null]);if(this.destroying||o!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted service creation");if(t&&this.resourceBroker&&t!==this.resourceBroker)throw new Error(
"Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){if(!t&&!n)throw new Error("Conf\
igure inference CPU/GPU resource budgets");this.resourceBroker=t||new c({capacities:n})}const d=new a({...i,runtimeDefinition:u,
artifactStore:e,computeManager:this,admission:new l({broker:this.resourceBroker})});this.modelServices.add(d);const h=d.
dispose.bind(d);return d.dispose=async()=>{const p=await h();return this.modelServices.delete(d),p},d}async refreshGpuLimits(){
if(typeof navigator>"u"||!navigator.gpu?.requestAdapter)return this.getResourceProfile();let e=null;try{e=await navigator.
gpu.requestAdapter()}catch{return this.getResourceProfile()}const t=oy(e?.limits);return t?(this.resourceProfile=Oc({...this.
resourceProfile,gpuAvailable:!0,gpuLimits:t,gpuLimitsSource:"adapter",source:this.resourceProfile.source||"browser"},this.
capabilities),this.workerPolicy=zc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.
minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,
this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.getResourceProfile()):this.getResourceProfile()}async submitTask(e){
if(!e)throw new Error("Task is required");const t=e.module==="peercompute:model-inference"&&e.data?.command==="unload"&&
[...this.modelServices].some(m=>m.session?.affinityKey===e.affinityKey);if(this.destroying&&!t)throw new Error("ComputeM\
anager is shutting down");const n=this.workerLifecycleRevision;e.signal?.throwIfAborted();const s=typeof e.runtime=="str\
ing"?e.runtime.trim().toLowerCase():e.wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js";if(s==="js"&&!e.fn&&!e.module)
throw new Error("JavaScript tasks must provide fn or module");if((s==="wasm"||s==="wasm-webgpu")&&!(e.wasm?.source||e.wasmSource||
e.source))throw new Error(`${s} tasks must provide wasm.source`);if(s==="wasm-webgpu"&&!(e.hostModule||e.module))throw new Error(
"wasm-webgpu tasks must provide hostModule or module");if(this.workerRequirementError)throw this.workerRequirementError;
if((!this.initialized||this.config.requireWorkers&&this.workerInitializationPromise)&&await this.initialize(),this.workerRequirementError)
throw this.workerRequirementError;if(e.signal?.throwIfAborted(),this.destroying&&!t||n!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted task submission");if(e.requireWorker===!0&&!this._supportsWorkers())throw this._createRequiredWorkerError(
"this task requires worker execution");const i=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.
random()}`,o=e.id||i;if(this.activeTasks.has(o)||this.taskQueue.some(m=>m.id===o))throw new Error(`Compute task id is al\
ready active: ${o}`);const a=this._runtimeStats(s);a.submitted+=1,this.stats.totalTasksSubmitted+=1;const c=this._normalizeTaskFamily(
e,s),l=this._taskFamilyStats(c);l.submitted+=1;const u=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:c}),d=H4(e),
h=K4(e,d);this._recordPlacementSubmitted(u);const p={id:o,runtime:s,taskFamily:c,solverId:e.solverId,placement:u,gpuFence:d,
gpuResidentLane:h,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey};if(p.
requireWorker&&(h?.localExecution==="inline"||u.requestedPlacement!=="local"&&!u.advisory))throw this._createRequiredWorkerError(
"required local worker conflicts with requested placement");if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&
!this.workerAffinities.has(p.affinityKey))throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers({reason:"task-demand"}),this.workerRequirementError)
throw this.workerRequirementError;return new Promise((m,y)=>{const g={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};
let f;const b=new Promise(_=>{f=_}),w=()=>{this.cancelTask(o).catch(()=>{})},E=(_,k)=>{g.settled||(g.settled=!0,clearTimeout(
g.timer),clearTimeout(g.bootstrapTimer),e.signal?.removeEventListener("abort",w),_(k),f())},v={id:o,payload:p,control:g,
completion:b,resolve:_=>E(m,_),reject:_=>E(y,_),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.
isArray(e.transferables)?e.transferables:[],submittedAt:lt(),runtime:s,taskFamily:c,placement:u};if(p.requireWorker&&!this.
workers.some(_=>this.workerBootstrap.get(_)?.status==="ready")&&(g.bootstrapTimer=setTimeout(()=>{const _=this.taskQueue.
findIndex(k=>k.id===o);_<0||(this.taskQueue.splice(_,1),this._recordTaskCompletion(v,{ok:!1,mode:"queued"}),v.reject(this.
_createRequiredWorkerError("task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),e.signal?.addEventListener(
"abort",w,{once:!0}),e.signal?.aborted){v.reject(e.signal.reason||new DOMException("Compute task cancelled","AbortError"));
return}this._dispatchToPlacementExecutor(v)||this._dispatchToWorker(v)||(this.taskQueue.push(v),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Oc(e,this.capabilities),this.
workerPolicy=zc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:t="manual"}={}){const n=this.targetWorkerCount,s=this.workers.length,i=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=Q(e,this.targetWorkerCount,i,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,j4(t)&&this._holdWorkerAutoScale(t),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:t,previousTargetWorkers:n,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(t),this._scheduleNext(),this._recordWorkerResize({reason:t,previousTargetWorkers:n,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:t=4096,minItems:n=1024,
maxItems:s=65536,itemStrideBytes:i=0,memoryFraction:o=.25,layerCount:a=1,maxShardsPerLayer:c=8}={}){const l=Math.max(1,this.
targetWorkerCount||this.workerPolicy.targetWorkers||1),u=Q(a,1,1,1024),d=z4(this.resourceProfile.tier),h=Math.max(1,Math.
floor(l/u)),p=Q(Math.min(d,h),1,1,Math.max(1,c)),m=O4(this.resourceProfile.tier),y=Fi(l/q4(this.resourceProfile.tier)),g=st(
this.resourceProfile.memoryBudgetMB,Xl(this.resourceProfile.tier),0,1048576),f=st(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),b=Fi(g/Xl(this.resourceProfile.tier)),w=this.resourceProfile.gpuAvailable?Fi(f/Math.max(1,iy(this.resourceProfile.
tier))):.75,E=st(this.resourceProfile.budgetScale,1,.05,64),v=Fi(Math.min(y,b,w)*E),_=Q(i,0,0,1048576),k=st(o,.25,.01,1),
x=_>0&&g>0?Math.max(n,Math.floor(g*1024*1024*k/_)):s,C=_>0&&this.resourceProfile.gpuLimits?Math.min(Q(this.resourceProfile.
gpuLimits.maxBufferSize,Number.MAX_SAFE_INTEGER,0),Q(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.MAX_SAFE_INTEGER,
0)):Number.MAX_SAFE_INTEGER,I=Number.isFinite(C)&&C>0&&_>0?Math.max(n,Math.floor(C*k/_)):s,S=Math.max(n,Math.min(s,x,I)),
T=Q(G4(t*m*v,256),t,n,S),D=Object.entries({workers:y,memory:b,gpu:w,explicit:E}).sort((G,H)=>G[1]-H[1])[0]?.[0]||"worker\
s";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:T,minItems:n,maxItems:s,effectiveMaxItems:S,
itemStrideBytes:_,workerCount:l,shardsPerLayer:p,layerCount:u,plannedWorkerTasks:u*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:v,limitingFactor:D,workerScale:y,memoryScale:b,gpuScale:w,explicitScale:E,memoryBudgetMB:g,
gpuMemoryBudgetMB:f,memoryFraction:k,memoryMaxItems:x,gpuMaxItems:I,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,t={}){const n=this.solverRegistry.createTask(e,
t);return this.submitTask(n)}async submitTaskGraph(e={}){const t=String(e.graphId||e.id||`task-graph:${Date.now()}`).trim(),
n=Array.isArray(e.nodes)?e.nodes:[];if(!n.length)throw new Error("submitTaskGraph requires at least one node");const s=[],
i=new Map;for(const D of n){const G=String(D?.id||D?.nodeId||D?.task?.id||"").trim();if(!G)throw new Error("submitTaskGr\
aph node id is required");if(i.has(G))throw new Error(`Duplicate task graph node id: ${G}`);const H=oe(D.dependsOn||D.dependencies||
[]),Y={...D,id:G,dependsOn:H};s.push(Y),i.set(G,Y)}for(const D of s)for(const G of D.dependsOn)if(!i.has(G))throw new Error(
`Task graph node ${D.id} depends on unknown node ${G}`);this.stats.taskGraphsSubmitted+=1;const o=J4(e,s),a=X4(e),c=Z4(e,
o),l=tT(e),u=rT(e,t),d=String(e.cancellation?.mode||e.cancellationMode||"cooperative").trim()||"cooperative",h=e.abortSignal||
e.cancelSignal||e.signal||e.cancellation?.signal||null,p={schema:Fc,mode:d,status:"not-cancelled",reason:null};let m=o.readEnabled?
this.taskGraphCache.get(o.cacheKey):null;const y=Date.now();m&&m.expiresAt&&m.expiresAt<=y&&(this.taskGraphCache.delete(
o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),m=null);let g=null;if(m&&o.requireAdmitted&&m.artifact?.admitted!==
!0&&(this.stats.taskGraphCacheReadBlocked+=1,g="blocked-unadmitted-cache-artifact",m=null),m){this.stats.taskGraphCacheHits+=
1,this.stats.taskGraphsCompleted+=1;const D=ne(m.result),G=ne(m.artifact||D.cacheArtifact||null);return{...D,cachePolicy:o,
cacheAdmission:G?.admission||D.cacheAdmission||c,cacheAdmissionStatus:G?.admission?.status||D.cacheAdmissionStatus||null,
cacheArtifact:G,cacheArtifactSchema:G?.schema||null,cacheArtifactStatus:G?.status||null,cacheStatus:"hit",cacheHit:!0,cachedAt:m.
storedAt,durationMs:0}}const f=new Map(s.map(D=>[D.id,D])),b={},w=[],E=[],v=[],_=lt(),k={graphId:t,startedAt:_,cancelled:h?.
aborted===!0,reason:h?.reason||null,cacheKey:o.cacheKey,stateSeedPayload:a,placementPolicy:l,graphLaneSpec:u},x=()=>{k.cancelled=
!0,k.reason=h?.reason||"abort-signal"};h?.addEventListener&&h.addEventListener("abort",x,{once:!0}),this.activeTaskGraphs.
set(t,k);const C=()=>{if(!k.cancelled)return;p.status="cancelled",p.reason=String(k.reason||"cancelled");const D=new Error(
`Task graph cancelled: ${t}`);throw D.code="TASK_GRAPH_CANCELLED",D.graphId=t,D.cancellation={...p},D};let I=null,S=null,
T=u?"required":"not-required",$=g||(o.readEnabled?"miss":o.writeEnabled?"record-only":"disabled");try{for(C(),u&&(I=this.
acquireGpuResidentLaneLease({...u,taskId:t,owner:u.owner||"compute-manager-task-graph"}),T="active");f.size>0;){C();const G=new Set(
Object.keys(b)),H=Array.from(f.values()).filter(W=>W.dependsOn.every(se=>G.has(se)));if(!H.length)throw new Error(`Task \
graph has a cycle or unsatisfied dependency: ${Array.from(f.keys()).join(", ")}`);v.push(H.map(W=>W.id));const Y=await Promise.
all(H.map(async W=>{C();const se={schema:T4,graphId:t,nodeId:W.id,dependsOn:[...W.dependsOn],completedNodeIds:Object.keys(
b),nodeResults:b,results:b,cachePolicy:o,cacheKey:o.cacheKey,cacheInputs:o.inputs,stateSeedPayload:a,placementPolicy:l,cancellation:p,
graphLease:I,graphLeaseSpec:u,getResult(be){return b[be]}};let de=typeof W.createTask=="function"?await W.createTask(se):
typeof W.task=="function"?await W.task(se):W.task;if(!de||typeof de!="object")throw new Error(`Task graph node ${W.id} d\
id not produce a task`);de=Y4(de,W,b),C();const Be=lt(),ze=await this.submitTask(de);return C(),{node:W,task:de,result:ze,
durationMs:Math.max(0,lt()-Be)}}));for(const W of Y)f.delete(W.node.id),b[W.node.id]=W.result,E.push(W.node.id),w.push({
nodeId:W.node.id,dependsOn:[...W.node.dependsOn],taskId:W.task.id||null,taskFamily:W.task.taskFamily||W.task.solverId||null,
solverId:W.task.solverId||null,status:"completed",durationMs:W.durationMs,resultSchema:W.result?.computeTaskResultSchema||
W.result?.schema||null})}I?.leaseId&&(S=this.completeGpuResidentLaneLease(I.leaseId,{status:"ordered-before-consumer-que\
ue-completed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-comple\
ted",queueCompletionMethod:"compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),T=S?.lease?.status||
"completed");const D={schema:dp,graphId:t,status:"completed",nodeCount:s.length,edgeCount:s.reduce((G,H)=>G+H.dependsOn.
length,0),executionOrder:E,executionBatches:v,nodeReports:w,nodeResults:b,cachePolicy:o,cacheKey:o.cacheKey,cacheKeySource:o.
keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:a,cacheAdmission:c,cacheAdmissionStatus:c.status,
cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:$,cacheHit:!1,placementPolicy:l,cancellation:p,
cancellationStatus:p.status,graphLeaseRequired:u!=null,graphLeaseStatus:T,graphLeaseSpec:u,graphLease:I,graphLeaseExecution:S,
durationMs:Math.max(0,lt()-_)};if(o.writeEnabled){const G=Date.now(),H=o.ttlMs>0?G+o.ttlMs:null,Y=eT({graphId:t,cachePolicy:o,
result:D,storedAt:G,expiresAt:H,admission:c});this.taskGraphCache.set(o.cacheKey,{storedAt:G,expiresAt:H,artifact:ne(Y),
result:ne(D)}),this.taskGraphCacheArtifacts.set(o.cacheKey,ne(Y)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,$=o.readEnabled?"miss-stored":"recorded",D.cacheStatus=$,D.cachedAt=G,D.cacheArtifact=Y,D.cacheArtifactSchema=Y.schema,
D.cacheArtifactStatus=Y.status}return this.stats.taskGraphsCompleted+=1,D}catch(D){const G=k.cancelled||D?.code==="TASK_\
GRAPH_CANCELLED";if(G?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,I?.leaseId&&!S)try{this.rejectGpuResidentLaneLease(
I.leaseId,G?"task-graph-cancelled":"task-graph-failed"),T=G?"rejected-cancelled":"rejected-failed"}catch{T="reject-faile\
d"}throw D.graphId=D.graphId||t,D.taskGraphStatus=G?"cancelled":"failed",D.graphLeaseStatus=T,D.cancellation=D.cancellation||
{...p},D}finally{h?.removeEventListener&&h.removeEventListener("abort",x),this.activeTaskGraphs.delete(t)}}getGpuResidentLaneManager(){
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
s.reject(i),this._ensureTargetWorkers({reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(c,Q(
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
s=this.activeTaskGraphs.get(n);return s?(s.cancelled=!0,s.reason=String(t||"cancelTaskGraph"),{schema:Fc,graphId:n,status:"\
cancel-requested",cancelled:!0,reason:s.reason}):{schema:Fc,graphId:n||null,status:"not-found",cancelled:!1,reason:String(
t||"cancelTaskGraph")}}listActiveTaskGraphs(){return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:dp,graphId:e.
graphId,status:e.cancelled?"cancel-requested":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.
placementPolicy?JSON.parse(JSON.stringify(e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.
reason||null}))}getTaskGraphCacheArtifact(e){const t=String(e||"").trim(),n=this.taskGraphCacheArtifacts.get(t);return n?
ne(n):null}listTaskGraphCacheArtifacts(){return Array.from(this.taskGraphCacheArtifacts.values()).map(e=>ne(e)).sort((e,t)=>String(
e.cacheKey||"").localeCompare(String(t.cacheKey||"")))}importRemoteTaskGraphCacheResult(e={},t={},n={}){const s=e?.cacheArtifact&&
typeof e.cacheArtifact=="object"?e.cacheArtifact:null,i=String(s?.cacheKey||e?.cacheKey||t?.cacheKey||"").trim();if(!i)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires a cacheKey");if(!s)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires result.cacheArtifact");if(t?.
admitted!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const y=new Error(`Remote task graph cache artifact is no\
t admitted: ${i}`);throw y.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTED",y.cacheKey=i,y}const o=Date.now(),a=s.
storedAt||e.cachedAt||o,c=s.expiresAt||null,l=oe(e?.graphLeaseSpec?.retainedBufferRefs,e?.cacheInputs?.retainedBufferRefs,
s?.inputs?.retainedBufferRefs),u={schema:sy,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,status:l.length>
0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:l.length>0?"remote-gpu-resident-re\
fs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:e?.graphLeaseSpec?.laneId||e?.
graphLease?.laneId||null,stateKey:e?.graphLeaseSpec?.stateKey||e?.graphLease?.stateKey||null,retainedBufferRefs:l,graphLeaseStatus:e?.
graphLeaseStatus||null,graphLeaseRequired:e?.graphLeaseRequired===!0},d={schema:Jl,status:"admitted",admitted:!0,authority:t.
authority||"node-kernel-state-manager",admissionId:t.admissionId||null,validatorId:t.validatorId||null,reason:t.reason||
"remote-task-graph-cache-artifact-admitted",invalidationRefs:oe(t.invalidationRefs,s.invalidationRefs),acceptedAt:t.acceptedAt||
t.admittedAt||o},h={schema:hp,status:"imported-admitted-remote-cache-result",cacheKey:i,graphId:e?.graphId||s.graphId||null,
sourcePeerId:n.sourcePeerId||t.sourcePeerId||null,responderId:n.responderId||t.responderId||null,requestId:n.requestId||
t.requestId||null,admissionId:t.admissionId||null,importedAt:o,remoteArtifactStatus:s.status||null,remoteArtifactAdmitted:s.
admitted===!0,retainedGpuLaneRefs:u,retainedGpuLaneRefsStatus:u.status,resultHash:s.resultHash||null,inputHash:s.inputHash||
e?.cacheInputHash||null},p={...ne(s),cacheKey:i,status:"admitted-remote-cache-artifact-recorded",admitted:!0,admission:d,
stateAdmission:ne(t),remoteCacheImport:h,remoteGraphLeaseRefs:u},m={...ne(e),cacheKey:i,cacheAdmission:d,cacheAdmissionStatus:d.
status,cacheArtifact:ne(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.schema||null,cacheStatus:"remote-imported",
cacheHit:!1,remoteTaskGraphCacheImport:h,remoteGraphLeaseRefs:u};return this.taskGraphCacheArtifacts.set(i,ne(p)),this.taskGraphCache.
set(i,{storedAt:a,expiresAt:c,artifact:ne(p),result:ne(m)}),this.stats.taskGraphRemoteCacheImports+=1,ne(h)}evaluateRemoteTaskGraphStateSeedPolicy(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim(),i=Date.now(),o=s&&this.taskGraphCache.
get(s)||null,a=s&&(this.taskGraphCacheArtifacts.get(s)||o?.artifact)||null,c=o?.result||null,l=c?.remoteTaskGraphCacheImport||
a?.remoteCacheImport||null,u=X(c?.stateSeedPayload,c?.stateSeed,c?.warmStateSeed,a?.stateSeedPayload,a?.stateSeed,a?.outputs?.
stateSeed,n?.stateSeedPayload,n?.stateSeed),d=c?.remoteGraphLeaseRefs||a?.remoteGraphLeaseRefs||l?.retainedGpuLaneRefs||
null,h=Oi(c?.cacheInputs?.stateFamilies,c?.cachePolicy?.inputs?.stateFamilies,a?.inputs?.stateFamilies,a?.cacheInputs?.stateFamilies,
n?.stateFamilies),p=Oi(c?.cacheInputs?.readFamilies,c?.cachePolicy?.inputs?.readFamilies,a?.inputs?.readFamilies,a?.cacheInputs?.
readFamilies,n?.readFamilies),m=Oi(c?.cacheInputs?.writeFamilies,c?.cachePolicy?.inputs?.writeFamilies,a?.inputs?.writeFamilies,
a?.cacheInputs?.writeFamilies,n?.writeFamilies),y=oe(n?.allowedStateFamilies??n?.allowedFamilies,[]),g=Oi(d?.retainedBufferRefs,
c?.graphLeaseSpec?.retainedBufferRefs,c?.cacheInputs?.retainedBufferRefs,a?.inputs?.retainedBufferRefs,n?.retainedBufferRefs),
f=d?.usableLocally===!0&&d?.remoteOnly!==!0,b=l?.schema===hp||c?.cacheStatus==="remote-imported"||a?.status==="admitted-\
remote-cache-artifact-recorded",w=a?.admitted===!0,E=n?.requireStateFamilies!==!1,v=y.length>0?h.filter(D=>!y.includes(D)):
[];let _="state-family-not-evaluated";h.length===0?_=E?"state-family-missing":"state-family-not-declared":y.length===0?_=
"state-family-policy-not-declared":v.length>0?_="state-family-blocked":_="state-family-allowed";let k="policy-ready",x="\
remote-cache-import-admitted-for-local-policy";s?!o&&!a?(k="blocked-cache-miss",x="cache-entry-not-found"):w?b?_==="stat\
e-family-missing"?(k="blocked-missing-state-families",x="remote-import-did-not-declare-state-families"):_==="state-famil\
y-policy-not-declared"?(k="blocked-missing-state-family-policy",x="allowed-state-family-policy-is-required"):_==="state-\
family-blocked"&&(k="blocked-state-family-policy",x="remote-import-declares-state-families-outside-policy"):(k="blocked-\
not-remote-import",x="cache-entry-did-not-originate-from-admitted-remote-task-graph-import"):(k="blocked-unadmitted-cach\
e-artifact",x="cache-artifact-is-not-admitted"):(k="blocked-no-cache-key",x="remote-state-seed-policy-requires-cache-key");
const C=k==="policy-ready",I=n?.allowWarmStateSeed===!0,S=n?.allowHotBufferRefresh===!0,T=I?C?"warm-state-seed-allowed":
"warm-state-seed-blocked":"warm-state-seed-not-requested";let $=S?"no-retained-buffer-refs":"hot-buffer-refresh-not-requ\
ested";return S&&!C?$="hot-buffer-refresh-blocked":S&&g.length>0&&f?$="local-buffer-refs-usable":S&&g.length>0&&($="loca\
l-refresh-required"),{schema:L4,status:k,reason:x,cacheKey:s||null,requestedAt:i,cacheEntryPresent:o!=null,artifactPresent:a!=
null,admitted:w,remoteImported:b,importStatus:l?.status||null,importSchema:l?.schema||null,importReport:l?ne(l):null,stateFamilies:h,
readFamilies:p,writeFamilies:m,stateSeedPayloadAvailable:u!=null,stateSeedPayload:u!=null?ne(u):null,allowedStateFamilies:y,
disallowedStateFamilies:v,stateFamilyStatus:_,warmStateSeedRequested:I,warmStateSeedStatus:T,hotBufferRefreshRequested:S,
hotBufferRefreshStatus:$,retainedBufferRefs:g,remoteRetainedRefsUsableLocally:f,remoteGraphLeaseRefs:d?ne(d):null}}admitTaskGraphCacheArtifact(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("admitTask\
GraphCacheArtifact requires a cacheKey");const i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||i?.artifact||
null;if(!o)return null;const a=ne(n||{}),c=a.admittedAt||a.acceptedAt||Date.now(),l={schema:Jl,status:"admitted",admitted:!0,
authority:a.authority||"state-manager",admissionId:a.admissionId||null,validatorId:a.validatorId||null,reason:a.reason||
"state-manager-cache-artifact-admitted",invalidationRefs:oe(a.invalidationRefs),acceptedAt:c},u=o.admitted===!0,d={...ne(
o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:l,stateAdmission:a};if(this.taskGraphCacheArtifacts.set(
s,ne(d)),i){const h=ne(i.result||{});h.cacheAdmission=l,h.cacheAdmissionStatus=l.status,h.cacheArtifact=ne(d),h.cacheArtifactStatus=
d.status,h.cacheArtifactSchema=d.schema||null,this.taskGraphCache.set(s,{...i,artifact:ne(d),result:h})}return u||(this.
stats.taskGraphCacheArtifactsAdmitted+=1),ne(d)}invalidateTaskGraphCacheArtifact(e,t={}){const n=e&&typeof e=="object"?e:
t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires\
 a cacheKey");const i=ne(n||{}),o=this.taskGraphCache.get(s),a=this.taskGraphCacheArtifacts.get(s)||o?.artifact||null;if(this.
taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!a)return{cacheKey:s,status:"invalidated",admitted:!1,
invalidation:i};const c={...ne(a),status:"invalidated",admitted:!1,invalidation:i,invalidatedAt:i.invalidatedAt||Date.now()};
return this.taskGraphCacheArtifacts.set(s,ne(c)),ne(c)}configurePlacementHooks(e={}){const t=d=>Object.prototype.hasOwnProperty.
call(e,d),n=(...d)=>{for(const h of d)if(t(h))return{found:!0,value:e[h]};return{found:!1,value:void 0}},s=n("placementE\
xecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=typeof s.value=="function"||s.value?.submitTask?
s.value:null,this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||jc(this.placementExecutor)):
(t("placementExecutorId")||t("remotePlacementExecutorId")||t("executorId"))&&(this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||jc(this.placementExecutor));const i=n("placementAdmission","remotePlacementAd\
mission","admission");i.found?(this.placementAdmission=typeof i.value=="function"||i.value?.admitTask?i.value:null,this.
placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||Gc(this.placementAdmission)):(t(
"placementAdmissionId")||t("remotePlacementAdmissionId")||t("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||Gc(this.placementAdmission));const o=n("placementResultValidator","remotePl\
acementResultValidator","resultValidator","validator");o.found?(this.placementResultValidator=typeof o.value=="function"||
o.value?.validateTaskResult||o.value?.validateResult?o.value:null,this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||Wc(this.placementResultValidator)):(t("placement\
ResultValidatorId")||t("remotePlacementResultValidatorId")||t("resultValidatorId")||t("validatorId"))&&(this.placementResultValidatorId=
e.placementResultValidatorId||e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||Wc(this.placementResultValidator));
const a=n("placementTaskSigner","remoteTaskSigner","taskSigner","signer");a.found?(this.placementTaskSigner=typeof a.value==
"function"||a.value?.signTaskPacket||a.value?.signEnvelope?a.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||Vc(this.placementTaskSigner)):(t("placementTaskSignerId")||t("remoteTa\
skSignerId")||t("taskSignerId")||t("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||Vc(this.placementTaskSigner)),(t("placementTimeoutMs")||t("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=Q(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(t("remoteResultV\
erification")||t("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const c={...this.placementRetryPolicy},l=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},u=d=>Object.prototype.
hasOwnProperty.call(l,d)||Object.prototype.hasOwnProperty.call(e,d);return(u("maxAttempts")||u("placementMaxAttempts")||
u("remotePlacementMaxAttempts"))&&(c.maxAttempts=Q(l.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,c.
maxAttempts,1,100)),(u("baseDelayMs")||u("placementRetryBaseDelayMs")||u("remotePlacementRetryBaseDelayMs"))&&(c.baseDelayMs=
Q(l.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,c.baseDelayMs,0,6e5)),(u("maxDelayMs")||
u("placementRetryMaxDelayMs")||u("remotePlacementRetryMaxDelayMs"))&&(c.maxDelayMs=Q(l.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,c.maxDelayMs,0,6e5)),(u("jitterFraction")||u("placementRetryJitterFraction")||u("remote\
PlacementRetryJitterFraction"))&&(c.jitterFraction=st(l.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
c.jitterFraction,0,1)),(u("retryableErrorKinds")||u("placementRetryableErrorKinds")||u("remotePlacementRetryableErrorKin\
ds"))&&(c.retryableErrorKinds=oe(l.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
c.retryableErrorKinds||Sn)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(c),this.getCapabilities()}getCapabilities(){
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
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:ks,maxAttempts:Q(e?.maxAttempts,
1,1,100),baseDelayMs:Q(e?.baseDelayMs,0,0,6e5),maxDelayMs:Q(e?.maxDelayMs,0,0,6e5),jitterFraction:st(e?.jitterFraction,0,
0,1),retryableErrorKinds:oe(e?.retryableErrorKinds,Sn),terminalErrorKinds:[...Ui]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,t=null){const n=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return n.name="RequiredWorkerUnavailableError",n.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",n.reason=e,t!=null&&(n.cause=t),n}_failRequiredWorkerPool(e){const t=e?.code==="ERR_COMPUTE_RE\
QUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError(e?.message||String(e||"the required worker pool failed"),e);
this.workerRequirementError=t,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;for(const n of[
...this.workers])this._markWorkerBootstrapFailed(n,t),this._removeWorker(n);for(const[n,s]of this.activeTasks.entries())
this.workers.includes(s.worker)||this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(s,t.code),this._recordTaskCompletion(
s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:t.message}),s.reject(Object.
assign(new Error(t.message),{name:t.name,code:t.code,workerTerminated:!this.workers.includes(s.worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(
t),t}_createWorkerBootstrapRecord(e){let t=null,n=null;const s={status:"bootstrapping",startedAt:lt(),readyAt:null,reason:null,
promise:null,resolve:null,reject:null,timeout:null,messageErrorListener:null};if(s.promise=new Promise((i,o)=>{t=i,n=o}),
s.promise.catch(()=>{}),s.resolve=t,s.reject=n,this.workerBootstrap.set(e,s),this.config.requireWorkers){const i=this.config.
workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(
`worker bootstrap did not acknowledge readiness within ${i}ms`))},i)}return s}_markWorkerBootstrapped(e){const t=this.workerBootstrap.
get(e);!t||t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="ready",t.readyAt=lt(),t.resolve?.(
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
gpuResidentLane,placement:t},i=Fs(Us(n)),o=Fs(Us(s)),a=Fs(Us({codeHash:i,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:t?.requestedPlacement||null}));return{schema:up,taskId:e.id||null,runtime:e.runtime||
null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:t?.requestedPlacement||null,gpuFenceRequired:e.
gpuFence?.required===!0,gpuFenceSchema:e.gpuFence?.schema||null,gpuLaneId:e.gpuFence?.laneId||null,gpuStateKey:e.gpuFence?.
stateKey||null,gpuQueueFencePolicy:e.gpuFence?.queueFencePolicy||null,gpuResidentLaneSchema:e.gpuResidentLane?.schema||null,
gpuResidentLaneLocalExecution:e.gpuResidentLane?.localExecution||null,codeHash:i,inputHash:o,taskHash:a,hashAlgorithm:"f\
nv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{signed:!1,reason:e===
!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"custom-signa\
ture"};if(typeof e=="object"){const t=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!t,signature:t,signatureAlgorithm:e.
signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(t?"signed":"no-signature")}}return{signed:!0,signature:String(
e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:t=null}={}){const n=e.payload?.
taskPacket||null,s=e.placement||e.payload?.placement||null,i={schema:lp,taskPacketSchema:n?.schema||null,taskPacket:n,mode:t,
signed:!1,signerId:null,signature:null,signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)
return i;const o={manager:this,task:e,placement:s,payload:e.payload,taskPacket:n,mode:t},a=this.placementTaskSigner,c=typeof a==
"function"?await a(n,o):a.signTaskPacket?await a.signTaskPacket(n,o):await a.signEnvelope(i,o),l=this._normalizePlacementTaskSignature(
c);return{...i,...l,schema:l.schema||lp,taskPacket:n,signerId:l.signerId||this.placementTaskSignerId||"placement-task-si\
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
mode:t=null,finalResult:n=null,commitDelta:s=null,provenance:i=null}={}){if(!this.placementResultValidator)return{schema:cp,
valid:!0,reason:"no-result-validator",validationId:null,mode:t,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.
placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||
null,mode:t,finalResult:n,commitDelta:s,provenance:i},a=this.placementResultValidator,c=typeof a=="function"?await a(n,o):
a.validateTaskResult?await a.validateTaskResult(n,o):await a.validateResult(n,o),l=this._normalizePlacementValidationResult(
c);return{...l,schema:l.schema||cp,validationId:l.validationId||this.placementResultValidatorId||"placement-result-valid\
ator",mode:t,decidedAt:Date.now()}}_placementRejectedError(e,{mode:t}){const n=new Error(`Remote placement rejected for ${t}\
: ${e?.reason||"admission-denied"}`);return n.name="PlacementAdmissionRejectedError",n.code="ERR_COMPUTE_PLACEMENT_REJEC\
TED",n.placementMode=t,n.reason=e?.reason||"admission-denied",n.admission=e||null,n}_placementValidationError(e,t,{mode:n}){
const s=new Error(`Remote placement result validation failed for ${n}: ${e?.reason||"validation-denied"}`);return s.name=
"PlacementResultValidationError",s.code="ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=n,s.reason=e?.reason||"valida\
tion-denied",s.validation=e||null,s.provenance=t||null,s}_placementTimeoutFor(e){return Q(e.placement?.timeoutMs??e.payload?.
placement?.timeoutMs??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){const t=e.placement||
e.payload?.placement||{},n=this.placementRetryPolicy||{},s=Q(t.maxAttempts??t.retryMaxAttempts??t.remoteMaxAttempts??t.remoteRetryMaxAttempts??
n.maxAttempts,1,1,100),i=Q(t.retryBaseDelayMs??t.remoteRetryBaseDelayMs??n.baseDelayMs,0,0,6e5),o=Q(t.retryMaxDelayMs??t.
remoteRetryMaxDelayMs??n.maxDelayMs,i,0,6e5),a=st(t.retryJitterFraction??t.remoteRetryJitterFraction??n.jitterFraction,0,
0,1);return this._getPlacementRetryPolicyReport({...n,maxAttempts:s,baseDelayMs:i,maxDelayMs:o,jitterFraction:a,retryableErrorKinds:oe(
t.retryableErrorKinds??t.remoteRetryableErrorKinds??n.retryableErrorKinds,Sn)})}_placementErrorKind(e){return e?.code===
"ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":e?.code==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":e?.code==="ERR_COMPUTE_P\
LACEMENT_VERIFICATION"?"verification-failed":e?.code==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-failed":"executor-\
error"}_placementRetryDelayMs(e,t){const n=Q(t?.baseDelayMs,0,0,6e5),s=Q(t?.maxDelayMs,n,0,6e5),i=Math.max(0,Q(e,1,1,100)-
1),o=Math.min(s,n*2**i),a=st(t?.jitterFraction,0,0,1);if(a<=0||o<=0)return o;const c=o*a*Math.random();return Math.min(s,
Math.round(o+c))}_placementRetryDecision({attempt:e,errorKind:t,err:n,policy:s,mode:i}){const o=new Set(oe(s?.retryableErrorKinds,
Sn)),a=new Set(Ui),c=Q(s?.maxAttempts,1,1,100),l=a.has(t),u=!l&&o.has(t),d=e<c,h=u&&d;return{schema:ks,mode:i,attempt:e,
nextAttempt:h?e+1:null,maxAttempts:c,errorKind:t,errorCode:n?.code||null,errorMessage:n?.message||String(n||""),retryable:u,
terminal:l,retryScheduled:h,exhausted:u&&c>1&&!d,delayMs:h?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{
mode:t,ok:n=!0,errorKind:s=null}={}){const i=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||
this._placementRetryPolicyFor(e),a=i.filter(l=>l.retryScheduled).length,c=i[i.length-1]||null;return{schema:ks,mode:t,maxAttempts:o.
maxAttempts,attemptCount:Q(e.placementAttempt,a+1,0,100),retryCount:a,retried:a>0,retryableErrorKinds:oe(o.retryableErrorKinds,
Sn),terminalErrorKinds:[...Ui],exhausted:!n&&!!c?.exhausted,finalErrorKind:n?null:s||c?.errorKind||null,events:JSON.parse(
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
max(0,Number(a)-Number(o)):null,p=s&&typeof s=="object"?s:{},m=i&&typeof i=="object"?i:{},y=t?.placementAdmission||null,
g=u.taskPacket||null,f=u.taskEnvelope||null,b=sT(l.replicas||l.replicaResults||l.quorum?.replicas||p.replicas||p.replicaResults),
w=zi(l.gpuFence||l.gpuFenceReport||p.gpuFence||p.gpuFenceReport||m.gpuFence||m.gpuFenceReport||l.remoteExecution?.gpuFence||
l.remoteExecution?.gpuFenceReport||l.remoteExecution?.computeExecution?.gpuFence,u.gpuFence||g?.gpuFence||null);return{schema:I4,
taskPacketSchema:g?.schema||null,taskEnvelopeSchema:f?.schema||null,taskSigned:f?.signed===!0,signerId:l.signerId||f?.signerId||
null,signatureAlgorithm:l.signatureAlgorithm||f?.signatureAlgorithm||null,mode:n,executorId:l.executorId||this.placementExecutorId||
"placement-executor",promotedReplicaExecutorId:l.promotedReplicaExecutorId||null,admissionId:y?.admissionId||null,admissionReason:y?.
reason||null,requestedPlacement:d.requestedPlacement||null,taskId:u.id||t?.id||null,taskFamily:u.taskFamily||t?.taskFamily||
null,solverId:u.solverId||d.solverId||null,solverKey:d.solverKey||null,peerId:l.peerId||l.remotePeerId||null,targetPeerId:l.
targetPeerId||null,transportPeerId:l.transportPeerId||null,responderNodeId:l.responderNodeId||null,responderPeerId:l.responderPeerId||
null,requesterId:l.requesterId||null,requestId:l.requestId||null,clusterId:l.clusterId||null,workerId:l.workerId||l.remoteWorkerId||
null,remoteExecution:l.remoteExecution&&typeof l.remoteExecution=="object"?JSON.parse(JSON.stringify(l.remoteExecution)):
null,gpuFence:w,gpuFenceStatus:w?.status??null,gpuFenceSatisfied:w?.fenceSatisfied??!1,codeHash:l.codeHash||p.codeHash||
g?.codeHash||null,inputHash:l.inputHash||p.inputHash||g?.inputHash||null,taskHash:l.taskHash||p.taskHash||g?.taskHash||null,
outputHash:l.outputHash||p.outputHash||null,resultHash:l.resultHash||p.resultHash||l.outputHash||p.outputHash||null,commitDeltaHash:l.
commitDeltaHash||p.commitDeltaHash||l.deltaHash||p.deltaHash||null,resultSchema:l.resultSchema||m.schema||p.schema||null,
role:l.role||null,trustLevel:l.trustLevel||"injected-executor",redundantPlacement:l.redundantPlacement&&typeof l.redundantPlacement==
"object"?JSON.parse(JSON.stringify(l.redundantPlacement)):null,primary:l.primary&&typeof l.primary=="object"?JSON.parse(
JSON.stringify(l.primary)):null,primaryFailure:l.primaryFailure&&typeof l.primaryFailure=="object"?JSON.parse(JSON.stringify(
l.primaryFailure)):null,promotedReplica:l.promotedReplica&&typeof l.promotedReplica=="object"?JSON.parse(JSON.stringify(
l.promotedReplica)):null,replicaSuccessCount:Q(l.replicaSuccessCount,0,0,1e6),replicaFailureCount:Q(l.replicaFailureCount,
0,0,1e6),redundantReplicaCount:Q(l.redundantReplicaCount??b.length,b.length,0,1e6),replicaCount:b.length,quorumReplicaCount:Q(
l.quorumReplicaCount??b.length,b.length,0,1e6),replicas:b,validated:l.validated===!0,durationMs:h==null?null:Number(h.toFixed(
3)),completedAt:c}}_verifyRemotePlacementProvenance(e={},t={}){const n=t?.payload?.taskPacket||null,s=Date.now();if(!this.
remoteResultVerification)return{schema:Uc,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!n||n.schema!==
up)return{schema:Uc,verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:n?.schema||null,mismatchFields:[
"taskPacket"],checks:[],checkedAt:s};const i=["codeHash","inputHash","taskHash"].map(c=>{const l=n[c]||null,u=e?.[c]||null;
return{field:c,expected:l,actual:u,ok:!!l&&l===u}});n.gpuFenceRequired===!0&&i.push({field:"gpuFence",expected:"fence-sa\
tisfied",actual:e?.gpuFence?.status||null,ok:e?.gpuFence?.fenceSatisfied===!0});const o=i.filter(c=>!c.ok).map(c=>c.field),
a=o.length===0?"hashes-match":o.includes("gpuFence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:Uc,
verified:o.length===0,skipped:!1,reason:a,taskPacketSchema:n.schema,hashAlgorithm:n.hashAlgorithm||null,mismatchFields:o,
checks:i,checkedAt:s}}_placementVerificationError(e,t,{mode:n}){const s=new Error(`Remote placement verification failed \
for ${n}: ${e?.reason||"hash-mismatch"}`);return s.name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT\
_VERIFICATION",s.placementMode=n,s.reason=e?.reason||"hash-mismatch",s.verification=e||null,s.provenance=t||null,s}_unwrapPlacementExecutorResult(e,t,{
mode:n,startedAt:s}){let i=e,o=null,a=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&
(o=e.commitDelta),a=e.provenance||e.remoteProvenance||e.placementProvenance||null;const h=Object.prototype.hasOwnProperty.
call(e,"commitDelta")||a||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(
e,"placementProvenance");h&&Object.prototype.hasOwnProperty.call(e,"value")?i=e.value:h&&Object.prototype.hasOwnProperty.
call(e,"result")&&(i=e.result)}const c=Date.now(),l=lt(),u=this._normalizeRemotePlacementProvenance(a,{task:t,mode:n,result:e,
finalResult:i,startedAt:s,completedAtMs:l,completedAt:c}),d=this._verifyRemotePlacementProvenance(u,t);if(u.verification=
d,u.verified=d.verified,!d.verified)throw this._placementVerificationError(d,u,{mode:n});return{finalResult:i,commitDelta:o,
provenance:u}}async _runRemotePlacementWithRetries(e,{mode:t}){const n=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
n,e.placementRetryEvents=[];for(let i=1;i<=n.maxAttempts;i+=1){e.placementAttempt=i,this._recordPlacementAttempt(e,{mode:t,
attempt:i,retryPolicy:n});const o=lt();try{const a=await this._runPlacementExecutorWithTimeout(e,{mode:t,attempt:i,retryPolicy:n}),
{finalResult:c,commitDelta:l,provenance:u}=this._unwrapPlacementExecutorResult(a,e,{mode:t,startedAt:o}),d=await this._runPlacementResultValidator(
e,{mode:t,finalResult:c,commitDelta:l,provenance:u});if(u.validation=d,!d.valid)throw this._placementValidationError(d,u,
{mode:t});return u.retry=this._placementRetrySummary(e,{mode:t,ok:!0}),{finalResult:c,commitDelta:l,provenance:u}}catch(a){
const c=this._placementErrorKind(a),l=this._placementRetryDecision({attempt:i,errorKind:c,err:a,policy:n,mode:t});if(a.retry=
l,e.placementRetryEvents.push(l),!l.retryScheduled)throw a;this._recordPlacementRetry(e,{mode:t,retry:l}),await W4(l.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${t}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=t,s.retry=this._placementRetrySummary(e,{mode:t,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){const t=e.placement||e.payload?.placement||{};if(!this._canDispatchRemotePlacement(
t))return!1;const n=`remote-${t.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(e.payload,t);const s={...e,
startedAt:lt(),executionMode:n,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.placementAdmissionId,
placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(s,{mode:n})).
then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:n})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:n});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:n})).then(({finalResult:i,commitDelta:o,provenance:a})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:n,provenance:a,admission:s.placementAdmission,retry:a.retry||this._placementRetrySummary(s,{mode:n,ok:!0})}),s.resolve(
i)}).catch(i=>{const o=this._placementErrorKind(i),a=i?.retry?.schema===ks?this._placementRetrySummary(s,{mode:n,ok:!1,errorKind:o}):
null;this._recordTaskCompletion(s,{ok:!1,mode:n,errorKind:o,errorMessage:i?.message||String(i),admission:s.placementAdmission||
i?.admission||null,provenance:i?.provenance||null,retry:a}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this.
_scheduleIdleScaleDown(),this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,
{type:"module"}):A4();this._createWorkerBootstrapRecord(e);const t=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const n=`\
worker-${t}`;if(this.workerIds.set(e,n),this.workerUtilization.set(n,Hc({executorId:n,kind:"worker",ordinal:t,status:"ac\
tive"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),i=o=>this._handleWorkerFailure(e,o);s&&(s.messageErrorListener=i),e.addEventListener(
"messageerror",i)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:t="worker",ordinal:n=null,status:s="active"}={}){const i=String(e||this.inlineExecutorId);
return this.workerUtilization.has(i)||this.workerUtilization.set(i,Hc({executorId:i,kind:t,ordinal:n,status:s})),this.workerUtilization.
get(i)}_executorBucket(e,t){const n=String(t||"unknown");return e[n]||(e[n]=qc()),e[n]}_recordExecutorStart(e,t,{kind:n="\
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
(h.submitted||0)-(d.submitted||0))[0]||t;return{schema:_4,generatedAt:Date.now(),inline:t,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:n.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:t.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(t.activeTaskCount||0),totalSubmitted:a,totalCompleted:c,totalFailed:l,
busiestExecutorId:u.executorId||null,busiestActiveTaskCount:u.activeTaskCount||0,busiestCompleted:u.completed||0}}}_placementBucket(e,t){
const n=String(t||"unknown");return e[n]||(e[n]=V4()),e[n]}_normalizeTaskPlacement(e={},{runtime:t="unknown",taskFamily:n="\
unknown"}={}){const s=e.placementHint||e.placement||e.data?.placementHint||e.data?.placement||e.data?.solver?.placementHint||
null,i=s?.recommendedPlacement||s?.requestedPlacement||s?.placement||"local",o=["local","peer","cluster"].includes(String(
i).trim().toLowerCase())?String(i).trim().toLowerCase():"local";return{schema:ap,source:s?"task-placement-hint-v0":"defa\
ult-local",advisoryOnly:s?.advisoryOnly!==!1,requestedPlacement:o,recommendedPlacement:o,actualPlacement:null,solverKey:s?.
solverKey||e.solverId||e.data?.solver?.id||null,solverId:s?.solverId||e.solverId||e.data?.solver?.id||null,taskFamily:n,
runtime:t,syncMode:s?.syncMode||null,timeoutMs:Q(s?.timeoutMs,this.placementTimeoutMs,0,36e5),confidence:Number.isFinite(
Number(s?.confidence))?Number(s.confidence):null,targetReplicaCount:Q(s?.targetReplicaCount,0,0,1e6),peerId:s?.peerId||s?.
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
exhausted&&(u.remoteRetryExhausted+=1)));const m=this._placementBucket(u.byRecommendedPlacement,d),y=this._placementBucket(
u.byActualPlacement,p);t?(m.completed+=1,y.completed+=1):(m.failed+=1,y.failed+=1,s==="timeout"&&(m.timedOut+=1,y.timedOut+=
1),s==="rejected"&&(m.rejected+=1,y.rejected+=1),s==="verification-failed"&&(m.verificationFailed+=1,y.verificationFailed+=
1),s==="validation-failed"&&(m.validationFailed+=1,y.validationFailed+=1),c?.exhausted&&(m.retryExhausted+=1,y.retryExhausted+=
1)),y.submitted+=1,u.lastPlacement={...l,actualPlacement:p,completedAt:Date.now(),ok:t,errorKind:s,errorMessage:i,admission:a,
provenance:o,retry:c},p.startsWith("remote-")&&(u.lastRemotePlacement=JSON.parse(JSON.stringify(u.lastPlacement)))}_runtimeStats(e){
const t=String(e||"unknown");return this.stats.byRuntime[t]||(this.stats.byRuntime[t]=qc()),this.stats.byRuntime[t]}_normalizeTaskFamily(e={},t="\
unknown"){const n=e.taskFamily||e.solverId||e.data?.solver?.id||e.data?.solverId||e.data?.taskFamily;if(n)return String(
n).trim()||"unknown";if(e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey){const s=String(e.affinityKey||
e.workerKey||e.data?.affinityKey||e.data?.stateKey),[i]=s.split(":");if(i)return i}return String(t||"unknown")}_taskFamilyStats(e){
const t=String(e||"unknown");return this.stats.byTaskFamily[t]||(this.stats.byTaskFamily[t]=qc()),this.stats.byTaskFamily[t]}_recordTaskCompletion(e,{
ok:t=!0,mode:n="unknown",errorKind:s=null,errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.
runtime||e.payload?.runtime||"unknown",u=this._runtimeStats(l),d=e.taskFamily||e.payload?.taskFamily||"unknown",h=this._taskFamilyStats(
d),p=lt(),m=Math.max(0,p-(e.submittedAt||e.startedAt||p)),y=Math.max(0,p-(e.startedAt||e.submittedAt||p));t?(this.stats.
totalTasksCompleted+=1,u.completed+=1,h.completed+=1,n==="worker"?this.stats.workerTasksCompleted+=1:String(n||"").startsWith(
"remote-")?this.stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,u.failed+=
1,h.failed+=1,String(n||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),c?.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=m,this.stats.lastTaskDurationMs=Number(m.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),u.totalDurationMs+=m,u.lastDurationMs=
this.stats.lastTaskDurationMs,u.maxDurationMs=Math.max(u.maxDurationMs,u.lastDurationMs);const g=u.completed+u.failed;u.
averageDurationMs=g>0?Number((u.totalDurationMs/g).toFixed(3)):0,h.totalDurationMs+=m,h.lastDurationMs=this.stats.lastTaskDurationMs,
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
const n=Q(t,0,0,6e5);if(n<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+n;return s>=this.workerAutoScaleHoldUntil&&
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
payload,n=e.gpuResidentLaneLease;if(!n)return t;const s=Object.freeze({schema:a4,authoritative:!0,leaseId:n.leaseId,laneId:n.
laneId,stateKey:n.stateKey,sourceFamily:n.sourceFamily,domainKey:n.domainKey,solverId:n.solverId,taskId:n.taskId,owner:n.
owner}),i=t?.data;return!i||typeof i!="object"||Array.isArray(i)?{...t,gpuResidentLaneLeaseIdentity:s}:{...t,data:{...i,
gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,t,{mode:n=null}={}){
const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return t;const i=t&&typeof t=="object"?t:{},o=zi(i.gpuFence||
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
gpuFence?.required!==!0)return;const n=t&&typeof t=="object"?t:{},s=e.gpuResidentLaneExecution?.gpuFence||zi(n.gpuFence||
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
workerId:o,startedAt:lt(),executionMode:"worker"};this._recordExecutorStart(o,a,{kind:"worker"}),this.activeTasks.set(e.
id,a);try{i.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(c){this._handleWorkerFailure(i,c)}
return!0}_buildTaskExecutionReport(e,{mode:t=null,result:n=null}={}){const s=t||e.executionMode||null,i=e.runtime||e.payload?.
runtime||null,o=e.taskFamily||e.payload?.taskFamily||null,a=e.id||e.payload?.id||null,c=n&&typeof n=="object"?n:{},l=zi(
c.gpuFence||c.gpuFenceReport,e.payload?.gpuFence||null)||e.gpuResidentLaneExecution?.gpuFence||null,u=e.executorId||(s===
"inline"||s==="inline-fallback"?this.inlineExecutorId:null),d=s==="worker"&&(e.workerId||e.executorId)||null;return{schema:C4,
taskId:a,runtime:i,taskFamily:o,executionMode:s,executorId:u,workerId:d,gpuFenceRequirement:e.payload?.gpuFence||null,gpuFence:l,
gpuFenceStatus:l?.status??null,gpuFenceSatisfied:l?.fenceSatisfied??!1,gpuResidentLaneRequirement:e.payload?.gpuResidentLane||
null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,t,{
mode:n=null}={}){if(t.payload?.returnEnvelope!==!0)return e;const s=this._buildTaskExecutionReport(t,{mode:n,result:e});
if(e&&typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==
null&&s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
if(e.payload?.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohibited for this task"));return}
e.startedAt=lt(),e.executionMode||="inline",this._recordExecutorStart(this.inlineExecutorId,e,{kind:"inline"});try{this.
_acquireTaskGpuResidentLaneLease(e);const t=await X5(this._taskPayloadWithGpuResidentLaneLeaseIdentity(e)),n=this._completeTaskGpuResidentLaneLease(
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
workers.length;if(this.destroying||!this.initialized||!this._supportsWorkers())return this.workers.length;const t=Q(this.
targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);if(t<=this.workers.length)return this.
workers.length;const n=this.targetWorkerCount,s=this.workers.length;for(;this.workers.length<t&&this._spawnWorker(););return this.
workers.length!==s&&this._recordWorkerResize({reason:e,previousTargetWorkers:n,previousWorkerCount:s}),this.workers.length}}
function ay(r){for(const e of Object.values(r))e&&typeof e=="object"&&ay(e);return Object.freeze(r)}const oT=ay({"qwen2.\
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
9baa484"}]}});function cy(r){for(const e of Object.values(r))e&&typeof e=="object"&&cy(e);return Object.freeze(r)}const Ua=cy(
{...oT,"qwen3-0.6b-q4":{id:"qwen3-0.6b-q4",name:"Qwen3 0.6B (q4)",repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"\
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
g.json",size:10069,gitBlobSha1:"1a7a8b42ef296f48ac686bab602f518da32dd85c"}]}});function aT(r,e){const t=Ua[r];if(!t||!t.
files.some(s=>s.path===e))throw new Error("Unknown catalog model file");const n=e.split("/").map(encodeURIComponent).join(
"/");return`https://huggingface.co/${t.repository}/resolve/${t.revision}/${n}`}const Es="Tsotchke-Corporation/Qwen3.8-27\
B-GeoRefine-D14-abl-GGUF",xs="5ce3fd841676adf2c1a10d7193637d46007e88f7",fp=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],cT="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function ly(r){
for(const e of Object.values(r))e&&typeof e=="object"&&ly(e);return Object.freeze(r)}const dd=ly({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Es,revision:xs,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:cT},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Es}/blob/${xs}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Es,revision:xs,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Es}/blob/${xs}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Es,revision:xs},weightBytes:14199740480,
totalBytes:fp.reduce((r,e)=>r+e.size,0),files:fp}});function lT(r,e){const t=dd[r];if(!t||!t.files.some(s=>s.path===e))throw new Error(
"Unknown catalog artifact model file.");const n=e.split("/").map(encodeURIComponent).join("/");return`https://huggingfac\
e.co/${t.repository}/resolve/${t.revision}/${n}`}function uy(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.
values(r).forEach(uy),Object.freeze(r)),r}const uT=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],dT=uy(Object.fromEntries(uT.map(r=>{const{dtype:e,sourceModel:t,blockCount:n,nextnPredictLayers:s,...i}=r,
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
files.reduce((c,l)=>c+l.size,0)}]}))),vs="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ss="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",
Kc=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd\
4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],eu=Object.freeze({import:!0,
pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requir\
es the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual mode\
l execution must be verified on the selected device."});function dy(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&
(Object.values(r).forEach(dy),Object.freeze(r)),r}const hT=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",
name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431c\
fdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"\
a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f2\
1fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:r,...e})=>[e.id,dy({...e,
status:"execution-candidate",format:"GGUF",capabilities:eu,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:r,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((t,n)=>t+n.size,0)})])),Fa=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:vs,revision:Ss,status:"ex\
ecution-candidate",format:"GGUF",capabilities:eu,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${vs}/blob\
/${Ss}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:vs,
revision:Ss,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${vs}/blob/${Ss}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:vs,revision:Ss},weightBytes:Kc[0].size,totalBytes:Kc.reduce((r,e)=>r+e.size,0),files:Kc},
...hT,...dT,...Object.fromEntries(Object.entries(dd).map(([r,e])=>[r,{...e,status:"execution-candidate",capabilities:eu}]))});
function fT(r,e){const t=Fa[r],n=t?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog GGUF model file.");
const s=n.source??{repository:t.repository,revision:t.revision,path:e};return`https://huggingface.co/${s.repository}/res\
olve/${s.revision}/${s.path.split("/").map(encodeURIComponent).join("/")}`}function hy(r){return r&&typeof r=="object"&&
!Object.isFrozen(r)&&(Object.values(r).forEach(hy),Object.freeze(r)),r}const pT=[{id:"sd-turbo-onnx",name:"Stable Diffus\
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
Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"}}],Oa=hy(Object.fromEntries(pT.map(r=>[
r.id,{...r,status:"execution-candidate",format:"ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires hardware WebGPU with shader-f16 and an \
admitted managed ONNX diffusion worker. Device execution must be verified."},provenance:{...r.provenance,repository:r.repository,
revision:r.revision,format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${r.repository}/bl\
ob/${r.revision}/README.md`,fileSources:Object.fromEntries(r.files.map(e=>[e.path,e.source]))},model:{runtime:"onnx-diff\
usion",runtimeVersion:"1.31.1",architecture:r.architecture,format:"ONNX",task:"text-to-image",pipeline:r.pipeline,dtype:r.
dtype,...r.weightQuantization?{weightQuantization:r.weightQuantization}:{},modalities:["text"],outputModalities:["image"],
requiredFeatures:["shader-f16"],width:512,height:512,steps:r.steps,padTokenId:r.padTokenId,repository:r.repository,revision:r.
revision},weightBytes:r.files.filter(e=>e.path.endsWith(".onnx")).reduce((e,t)=>e+t.size,0),totalBytes:r.files.reduce((e,t)=>e+
t.size,0)}])));function mT(r,e){const n=Oa[r]?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog diffusio\
n model file.");const s=n.source;return`https://huggingface.co/${s.repository}/resolve/${s.revision}/${s.path.split("/").
map(encodeURIComponent).join("/")}`}/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */function gT(r){
return r instanceof Uint8Array||ArrayBuffer.isView(r)&&r.constructor.name==="Uint8Array"}function pp(r,e=""){if(!Number.
isSafeInteger(r)||r<0){const t=e&&`"${e}" `;throw new Error(`${t}expected integer >= 0, got ${r}`)}}function vi(r,e,t=""){
const n=gT(r),s=r?.length,i=e!==void 0;if(!n||i&&s!==e){const o=t&&`"${t}" `,a=i?` of length ${e}`:"",c=n?`length=${s}`:
`type=${typeof r}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return r}function EB(r){if(typeof r!="function"||
typeof r.create!="function")throw new Error("Hash must wrapped by utils.createHasher");pp(r.outputLen),pp(r.blockLen)}function mp(r,e=!0){
if(r.destroyed)throw new Error("Hash instance has been destroyed");if(e&&r.finished)throw new Error("Hash#digest() has a\
lready been called")}function bT(r,e){vi(r,void 0,"digestInto() output");const t=e.outputLen;if(r.length<t)throw new Error(
'"digestInto() output" expected to be of length >='+t)}function un(...r){for(let e=0;e<r.length;e++)r[e].fill(0)}function Qc(r){
return new DataView(r.buffer,r.byteOffset,r.byteLength)}function Wt(r,e){return r<<32-e|r>>>e}function Jc(r,e){return r<<
e|r>>>32-e>>>0}const fy=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",yT=Array.from(
{length:256},(r,e)=>e.toString(16).padStart(2,"0"));function wT(r){if(vi(r),fy)return r.toHex();let e="";for(let t=0;t<r.
length;t++)e+=yT[r[t]];return e}const ir={_0:48,_9:57,A:65,F:70,a:97,f:102};function gp(r){if(r>=ir._0&&r<=ir._9)return r-
ir._0;if(r>=ir.A&&r<=ir.F)return r-(ir.A-10);if(r>=ir.a&&r<=ir.f)return r-(ir.a-10)}function xB(r){if(typeof r!="string")
throw new Error("hex string expected, got "+typeof r);if(fy)return Uint8Array.fromHex(r);const e=r.length,t=e/2;if(e%2)throw new Error(
"hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(t);for(let s=0,i=0;s<t;s++,i+=2){const o=gp(
r.charCodeAt(i)),a=gp(r.charCodeAt(i+1));if(o===void 0||a===void 0){const c=r[i]+r[i+1];throw new Error('hex string expe\
cted, got non-hex character "'+c+'" at index '+i)}n[s]=o*16+a}return n}const kT=async()=>{};async function vB(r,e,t){let n=Date.
now();for(let s=0;s<r;s++){t(s);const i=Date.now()-n;i>=0&&i<e||(await kT(),n+=i)}}function ET(r){if(typeof r!="string")
throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(r))}function SB(r,e=""){return typeof r==
"string"?ET(r):vi(r,void 0,e)}function AB(...r){let e=0;for(let n=0;n<r.length;n++){const s=r[n];vi(s),e+=s.length}const t=new Uint8Array(
e);for(let n=0,s=0;n<r.length;n++){const i=r[n];t.set(i,s),s+=i.length}return t}function _B(r,e){if(e!==void 0&&{}.toString.
call(e)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(r,e)}function hd(r,e={}){
const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=s=>r(s),
Object.assign(t,e),Object.freeze(t)}function IB(r=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.
getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(
r))}const py=r=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,r])});function my(r,e,t){return r&e^~r&t}function gy(r,e,t){
return r&e^r&t^e&t}class fd{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=Qc(this.buffer)}update(e){
mp(this),vi(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;for(let o=0;o<i;){const a=Math.min(s-this.pos,i-o);if(a===
s){const c=Qc(e);for(;s<=i-o;o+=s)this.process(c,o);continue}n.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===
s&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){mp(this),bT(e,this),
this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=128,un(this.buffer.subarray(o)),this.
padOffset>s-o&&(this.process(n,0),o=0);for(let d=o;d<s;d++)t[d]=0;n.setBigUint64(s-8,BigInt(this.length*8),i),this.process(
n,0);const a=Qc(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,u=this.
get();if(l>u.length)throw new Error("_sha2: outputLen bigger than state");for(let d=0;d<l;d++)a.setUint32(4*d,u[d],i)}digest(){
const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.
constructor,e.set(...this.get());const{blockLen:t,buffer:n,length:s,finished:i,destroyed:o,pos:a}=this;return e.destroyed=
o,e.finished=i,e.length=s,e.pos=a,s%t&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const Ir=Uint32Array.from([1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),qe=Uint32Array.from([1779033703,4089235720,
3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,
1541459225,327033209]),qi=BigInt(2**32-1),bp=BigInt(32);function xT(r,e=!1){return e?{h:Number(r&qi),l:Number(r>>bp&qi)}:
{h:Number(r>>bp&qi)|0,l:Number(r&qi)|0}}function vT(r,e=!1){const t=r.length;let n=new Uint32Array(t),s=new Uint32Array(
t);for(let i=0;i<t;i++){const{h:o,l:a}=xT(r[i],e);[n[i],s[i]]=[o,a]}return[n,s]}const yp=(r,e,t)=>r>>>t,wp=(r,e,t)=>r<<32-
t|e>>>t,An=(r,e,t)=>r>>>t|e<<32-t,_n=(r,e,t)=>r<<32-t|e>>>t,ji=(r,e,t)=>r<<64-t|e>>>t-32,Gi=(r,e,t)=>r>>>t-32|e<<64-t;function or(r,e,t,n){
const s=(e>>>0)+(n>>>0);return{h:r+t+(s/2**32|0)|0,l:s|0}}const ST=(r,e,t)=>(r>>>0)+(e>>>0)+(t>>>0),AT=(r,e,t,n)=>e+t+n+
(r/2**32|0)|0,_T=(r,e,t,n)=>(r>>>0)+(e>>>0)+(t>>>0)+(n>>>0),IT=(r,e,t,n,s)=>e+t+n+s+(r/2**32|0)|0,CT=(r,e,t,n,s)=>(r>>>0)+
(e>>>0)+(t>>>0)+(n>>>0)+(s>>>0),TT=(r,e,t,n,s,i)=>e+t+n+s+i+(r/2**32|0)|0,MT=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Cr=new Uint32Array(64);class RT extends fd{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:t,C:n,D:s,E:i,
F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0,this.
F=o|0,this.G=a|0,this.H=c|0}process(e,t){for(let d=0;d<16;d++,t+=4)Cr[d]=e.getUint32(t,!1);for(let d=16;d<64;d++){const h=Cr[d-
15],p=Cr[d-2],m=Wt(h,7)^Wt(h,18)^h>>>3,y=Wt(p,17)^Wt(p,19)^p>>>10;Cr[d]=y+Cr[d-7]+m+Cr[d-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let d=0;d<64;d++){const h=Wt(a,6)^Wt(a,11)^Wt(a,25),p=u+h+my(a,c,l)+MT[d]+Cr[d]|0,y=(Wt(n,2)^Wt(n,13)^
Wt(n,22))+gy(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){un(Cr)}destroy(){this.set(0,0,0,0,0,0,
0,0),un(this.buffer)}}class BT extends RT{A=Ir[0]|0;B=Ir[1]|0;C=Ir[2]|0;D=Ir[3]|0;E=Ir[4]|0;F=Ir[5]|0;G=Ir[6]|0;H=Ir[7]|
0;constructor(){super(32)}}const by=vT(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189db\
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
5fcb6fab3ad6faec","0x6c44198c4a475817"].map(r=>BigInt(r))),LT=by[0],DT=by[1],Tr=new Uint32Array(80),Mr=new Uint32Array(80);
class PT extends fd{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:t,Bh:n,Bl:s,Ch:i,Cl:o,Dh:a,Dl:c,Eh:l,El:u,Fh:d,
Fl:h,Gh:p,Gl:m,Hh:y,Hl:g}=this;return[e,t,n,s,i,o,a,c,l,u,d,h,p,m,y,g]}set(e,t,n,s,i,o,a,c,l,u,d,h,p,m,y,g){this.Ah=e|0,
this.Al=t|0,this.Bh=n|0,this.Bl=s|0,this.Ch=i|0,this.Cl=o|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=u|0,this.Fh=d|0,
this.Fl=h|0,this.Gh=p|0,this.Gl=m|0,this.Hh=y|0,this.Hl=g|0}process(e,t){for(let w=0;w<16;w++,t+=4)Tr[w]=e.getUint32(t),
Mr[w]=e.getUint32(t+=4);for(let w=16;w<80;w++){const E=Tr[w-15]|0,v=Mr[w-15]|0,_=An(E,v,1)^An(E,v,8)^yp(E,v,7),k=_n(E,v,
1)^_n(E,v,8)^wp(E,v,7),x=Tr[w-2]|0,C=Mr[w-2]|0,I=An(x,C,19)^ji(x,C,61)^yp(x,C,6),S=_n(x,C,19)^Gi(x,C,61)^wp(x,C,6),T=_T(
k,S,Mr[w-7],Mr[w-16]),$=IT(T,_,I,Tr[w-7],Tr[w-16]);Tr[w]=$|0,Mr[w]=T|0}let{Ah:n,Al:s,Bh:i,Bl:o,Ch:a,Cl:c,Dh:l,Dl:u,Eh:d,
El:h,Fh:p,Fl:m,Gh:y,Gl:g,Hh:f,Hl:b}=this;for(let w=0;w<80;w++){const E=An(d,h,14)^An(d,h,18)^ji(d,h,41),v=_n(d,h,14)^_n(
d,h,18)^Gi(d,h,41),_=d&p^~d&y,k=h&m^~h&g,x=CT(b,v,k,DT[w],Mr[w]),C=TT(x,f,E,_,LT[w],Tr[w]),I=x|0,S=An(n,s,28)^ji(n,s,34)^
ji(n,s,39),T=_n(n,s,28)^Gi(n,s,34)^Gi(n,s,39),$=n&i^n&a^i&a,D=s&o^s&c^o&c;f=y|0,b=g|0,y=p|0,g=m|0,p=d|0,m=h|0,{h:d,l:h}=
or(l|0,u|0,C|0,I|0),l=a|0,u=c|0,a=i|0,c=o|0,i=n|0,o=s|0;const G=ST(I,T,D);n=AT(G,C,S,$),s=G|0}({h:n,l:s}=or(this.Ah|0,this.
Al|0,n|0,s|0)),{h:i,l:o}=or(this.Bh|0,this.Bl|0,i|0,o|0),{h:a,l:c}=or(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:u}=or(this.Dh|
0,this.Dl|0,l|0,u|0),{h:d,l:h}=or(this.Eh|0,this.El|0,d|0,h|0),{h:p,l:m}=or(this.Fh|0,this.Fl|0,p|0,m|0),{h:y,l:g}=or(this.
Gh|0,this.Gl|0,y|0,g|0),{h:f,l:b}=or(this.Hh|0,this.Hl|0,f|0,b|0),this.set(n,s,i,o,a,c,l,u,d,h,p,m,y,g,f,b)}roundClean(){
un(Tr,Mr)}destroy(){un(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class $T extends PT{Ah=qe[0]|0;Al=qe[1]|0;Bh=qe[2]|
0;Bl=qe[3]|0;Ch=qe[4]|0;Cl=qe[5]|0;Dh=qe[6]|0;Dl=qe[7]|0;Eh=qe[8]|0;El=qe[9]|0;Fh=qe[10]|0;Fl=qe[11]|0;Gh=qe[12]|0;Gl=qe[13]|
0;Hh=qe[14]|0;Hl=qe[15]|0;constructor(){super(64)}}const NT=hd(()=>new BT,py(1)),CB=hd(()=>new $T,py(3)),UT="transformer\
s.js",pd="4.3.2",le=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),FT=Object.freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,
minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),OT=Object.freeze({maxModelBytes:le.maxModelBytes,minimumCpuBytes:0,
minimumGpuBytes:0,maxProcessedImagePixels:le.maxImagePixels}),Xc=new Set(["qwen3","qwen2","llama"]);function za(r){return r?.
architecture==="qwen3_5"?FT:OT}function tu(r="Operation cancelled"){return r?.name==="AbortError"?r:new DOMException(typeof r==
"string"?r:"Operation cancelled","AbortError")}function Ke(r){if(r?.aborted)throw tu(r.reason)}function Bs(r){if(typeof r!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(r))throw new Error("Invalid model session ID");return r}function sa(r){if(typeof r!=
"string"||!r||new TextEncoder().encode(r).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(r)||r.startsWith("/")||r.split(
"/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return r}function zT(r){let e;try{e=JSON.
stringify(r)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>le.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const t=JSON.parse(e);if(t.schema!=="peercompute.artifact.\
manifest.v1"||!Array.isArray(t.files)||!t.files.length||t.files.length>le.maxFiles)throw new Error("Invalid model manife\
st files");const n=new Set,s=za(t.model);let i=0;for(const u of t.files){if(sa(u.path),n.has(u.path))throw new Error("Du\
plicate model artifact path");n.add(u.path);const d=Vn.parse(u.cid);if(![85,112].includes(d.code)||d.multihash.code!==18||
d.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||!/^[a-f0-9]{64}$/i.
test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),i+=u.size,!Number.
isSafeInteger(i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=t.model;if(o?.runtime!==
UT||o.runtimeVersion!==pd||![...Xc,"idefics3","smolvlm","qwen3_5"].includes(o.architecture))throw new Error("Model runti\
me, architecture or dtype is not approved");if(o.task??=Xc.has(o.architecture)?"text-generation":"image-text-to-text",![
"text-generation","image-text-to-text"].includes(o.task)||Xc.has(o.architecture)!==(o.task==="text-generation"))throw new Error(
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
totalBytes:i,resourcePolicy:s}}function qT(r,e){const t=new URL(e),n={};for(const s of["mjs","wasm"]){if(typeof r?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(r[s],t);if(i.origin!==t.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const Pt=1024**3,jT=[...Object.values(Ua),...Object.values(
Fa),...Object.values(Oa)],GT=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxCompute\
InvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWor\
kgroupsPerDimension"],WT=new Set(["transformers.js","llama.cpp","onnx-diffusion"]);function ru(r,e=jT){const t=r?.model??
r??{},n=e.filter(s=>s.model.runtime===t.runtime&&(s.repository??s.model.repository)===(t.repository??r?.repository)&&(s.
revision??s.model.revision)===(t.revision??r?.revision)&&["architecture","task","format","dtype"].every(i=>!r?.model&&t[i]===
void 0||md(t[i],s.model[i]))&&(!r?.model||!Array.isArray(r.files)||!Array.isArray(s.files)||VT(t.runtime,r.files,s.files)));
return n.length===1?n[0]:r?.model?void 0:n.find(s=>s.id===r?.modelId)}function VT(r,e,t){const n=o=>r!=="llama.cpp"||o.path?.
endsWith(".gguf"),s=e.filter(n),i=t.filter(n);return s.length===i.length&&s.every(o=>i.some(a=>a.path===o.path&&a.size===
o.size&&(a.sha256===void 0||a.sha256===o.sha256)))}function yy(r){const e=r?.model??r??{},t=ru(r),n=r?.model?e:t?.model??
e,s=r?.files??t?.files;let i=null;if(s!==void 0){if(!Array.isArray(s)||!s.length||s.length>le.maxFiles)throw new Error("\
Invalid model file list");i=0;for(const o of s){if(!o||!Number.isSafeInteger(o.size)||o.size<0)throw new Error("Invalid \
model file size");if(i+=o.size,!Number.isSafeInteger(i))throw new Error("Invalid model package size")}}else Number.isSafeInteger(
r?.totalBytes)&&r.totalBytes>=0&&(i=r.totalBytes);return{model:n,files:s,trusted:t,totalBytes:i,descriptorOnly:!r?.model&&
!t&&s===void 0}}function lo(r){const{model:e,totalBytes:t}=yy(r);if(e.runtime==="onnx-diffusion")return{cpuBytes:8*Pt,gpuBytes:8*
Pt};if(e.runtime==="llama.cpp"){if(t===null)return{cpuBytes:0,gpuBytes:0};const n=t>4*Pt;return{cpuBytes:(n?8:2)*Pt,gpuBytes:(n?
16:2)*Pt}}if(e.runtime==="transformers.js"){const n=za(e);return{cpuBytes:Math.max(4*Pt,n.minimumCpuBytes),gpuBytes:Math.
max(4*Pt,n.minimumGpuBytes)}}throw new Error("Unsupported model runtime")}function nu(r={}){if(r===null&&(r={}),typeof r!=
"object"||Array.isArray(r)||![Object.prototype,null].includes(Object.getPrototypeOf(r))||Object.keys(r).some(t=>!["cpuBy\
tes","gpuBytes"].includes(t)))throw new TypeError("Invalid model memory budgets");const e={};for(const t of["cpuBytes","\
gpuBytes"]){const n=r[t];if(n==null)e[t]=null;else{if(!Number.isSafeInteger(n)||n<=0||n>1024*Pt)throw new RangeError(`In\
valid ${t} memory budget`);e[t]=n}}return e}async function HT({scope:r=globalThis,timeoutMs:e=3e3}={}){if(!Number.isSafeInteger(
e)||e<1||e>6e4)throw new RangeError("Invalid device probe timeout");const t=r.WebAssembly,n=r.navigator?.deviceMemory,s={
webgpu:null,features:[],limits:{},crossOriginIsolated:r.crossOriginIsolated===!0,sharedArrayBuffer:typeof r.SharedArrayBuffer==
"function",jspi:typeof t?.Suspending=="function"&&typeof t?.promising=="function",memory64:!1,deviceMemoryGiB:typeof n==
"number"&&Number.isFinite(n)&&n>0?n:null};if(s.sharedArrayBuffer&&typeof t?.Memory=="function")try{new t.Memory({initial:0n,
maximum:1n,shared:!0,address:"i64"}),s.memory64=!0}catch{}const i=r.navigator?.gpu;if(typeof i?.requestAdapter!="functio\
n")return{...s,webgpu:!1};const o=performance.now()+e,a=new Error("GPU capability check timed out");let c,l,u,d=!1;const h=()=>{
if(d||performance.now()>=o)throw a},p=async()=>{h();let m=await i.requestAdapter({powerPreference:"high-performance"});return h(),
m==null&&(await new Promise(y=>{u=y,l=setTimeout(y,100)}),l=u=void 0,h(),m=await i.requestAdapter({powerPreference:"high\
-performance"}),h()),m};try{const m=await Promise.race([p(),new Promise((y,g)=>{c=setTimeout(()=>g(a),e)})]);if(!m||m.isFallbackAdapter||
m.info?.isFallbackAdapter)return{...s,webgpu:!1};s.features=[...m.features].filter(y=>typeof y=="string"&&y.length<=80).
slice(0,64).sort();for(const y of GT){const g=m.limits?.[y];Number.isSafeInteger(g)&&g>0&&(s.limits[y]=g)}s.webgpu=!0}catch(m){
s.probeError=String(m?.message??m).slice(0,300)}finally{d=!0,clearTimeout(c),clearTimeout(l),u?.()}return s}function KT({
model:r,files:e,totalBytes:t,trusted:n,descriptorOnly:s}){if(!WT.has(r.runtime))return["runtime_unsupported","This model\
 runtime is not supported locally"];if(r.requiredFeatures!==void 0&&(!Array.isArray(r.requiredFeatures)||r.requiredFeatures.
length>32||r.requiredFeatures.some(o=>typeof o!="string"||!o||o.length>80)))return["model_invalid","Invalid model GPU fe\
ature requirements"];const i=r.runtime==="llama.cpp"?16*Pt:r.runtime==="onnx-diffusion"?3*Pt:za(r).maxModelBytes;if(!s&&
t!==null&&t>i)return["package_too_large","Package exceeds this runtime’s supported file budget"];if(r.runtime==="trans\
formers.js"){if((!s||r.runtimeVersion!==void 0)&&r.runtimeVersion!==pd||(!s||r.architecture!==void 0)&&!["qwen2","qwen3",
"llama","qwen3_5","idefics3","smolvlm"].includes(r.architecture))return["runtime_unsupported","Model version or architec\
ture is not supported locally"];const o=typeof r.dtype=="string"?[r.dtype]:r.dtype&&typeof r.dtype=="object"&&!Array.isArray(
r.dtype)?Object.values(r.dtype):[];if((!s||r.dtype!==void 0)&&(!o.length||o.some(a=>!["fp32","fp16","q4","q4f16","q8"].includes(
a))||r.architecture==="qwen3_5"&&o.some(a=>a!=="q4")))return["runtime_unsupported","Model precision is not supported by \
this runtime"]}else{if(!n||r.runtimeVersion!==n.model.runtimeVersion&&!(r.runtime==="llama.cpp"&&n.model.runtimeVersion===
void 0&&r.runtimeVersion==="3.8.1"))return["catalog_unsupported","This package is not in the approved local runtime cata\
log"];for(const o of r.runtime==="onnx-diffusion"?["architecture","task","format","dtype","pipeline","width","height","s\
teps","padTokenId","weightQuantization","modalities","outputModalities","requiredFeatures"]:["architecture","task","form\
at","dtype"])if(!md(r[o],n.model[o]))return["catalog_unsupported","Model profile differs from the approved runtime catal\
og"];if(e){const o=r.runtime==="llama.cpp"?n.files.filter(c=>c.path.endsWith(".gguf")):n.files,a=r.runtime==="llama.cpp"?
e.filter(c=>c.path?.endsWith(".gguf")):e;if(a.length!==o.length||a.some(c=>!o.some(l=>l.path===c.path&&l.size===c.size&&
l.sha256===c.sha256)))return["catalog_unsupported","Model files differ from the approved runtime catalog"]}}return r.runtime===
"onnx-diffusion"&&e?.some(o=>o.size<=0||o.size>=2*Pt)?["file_too_large","A file exceeds the diffusion loader’s supported\
 buffer size"]:null}function md(r,e){return r===e?!0:!r||!e||typeof r!="object"||typeof e!="object"||Array.isArray(r)!==
Array.isArray(e)?!1:Object.keys(r).length===Object.keys(e).length&&Object.keys(r).every(t=>md(r[t],e[t]))}function QT(r,{
device:e,budgets:t={}}={}){const n=nu(t);let s,i,o;try{s=yy(r),i=lo(r)}catch(h){o=h,i={cpuBytes:0,gpuBytes:0}}const a=(h,p,m)=>({
status:h,reason:m,code:p,...i});if(!e)return a("checking","device_checking","Checking device compatibility");if(o)return a(
"unavailable","model_invalid",o.message);const c=KT(s);if(c)return a("unavailable",...c);if(n.cpuBytes!==null&&i.cpuBytes>
n.cpuBytes)return a("unavailable","cpu_budget_exceeded","Exceeds configured RAM memory budget");if(n.gpuBytes!==null&&i.
gpuBytes>n.gpuBytes)return a("unavailable","gpu_budget_exceeded","Exceeds configured GPU memory budget");if(e.webgpu===!1)
return a("unavailable","webgpu_unavailable","Hardware WebGPU is unavailable in this browser");if(s.model.runtime==="llam\
a.cpp")for(const[h,p]of[["crossOriginIsolated","GGUF requires cross-origin isolation"],["sharedArrayBuffer","GGUF requir\
es SharedArrayBuffer"],["jspi","GGUF requires WebAssembly JSPI"],["memory64","GGUF requires shared WebAssembly memory64"]]){
if(e[h]===!1)return a("unavailable",`gguf_${h}_unavailable`,p);if(e[h]!==!0)return a("unknown","device_probe_unknown","G\
GUF browser prerequisites have not been verified")}if(e.webgpu!==!0)return a("unknown","device_probe_unknown","GPU capab\
ility check is incomplete; RAM/GPU memory fit is unverified");const l=new Set(e.features??[]),u=new Set(s.model.requiredFeatures??
[]),d=s.model.dtype;(s.model.runtime!=="transformers.js"||(typeof d=="string"?[d]:Object.values(d??{})).some(h=>["fp16",
"q4f16"].includes(h)))&&u.add("shader-f16");for(const h of u)if(!l.has(h))return a("unavailable","gpu_feature_unavailabl\
e",h==="shader-f16"?"Required FP16 GPU math (shader-f16) is unavailable in this browser":`Required GPU feature ${h} is u\
navailable in this browser`);return s.descriptorOnly?a("unknown","model_metadata_unverified","Model metadata and RAM/GPU\
 memory fit require verification before loading"):a("unknown","memory_fit_unverified","Required features are supported; \
RAM/GPU memory fit is unverified")}const As=Uint32Array.from([1732584193,4023233417,2562383102,271733878,3285377520]),Rr=new Uint32Array(
80);class JT extends fd{A=As[0]|0;B=As[1]|0;C=As[2]|0;D=As[3]|0;E=As[4]|0;constructor(){super(64,20,8,!1)}get(){const{A:e,
B:t,C:n,D:s,E:i}=this;return[e,t,n,s,i]}set(e,t,n,s,i){this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0}process(e,t){
for(let c=0;c<16;c++,t+=4)Rr[c]=e.getUint32(t,!1);for(let c=16;c<80;c++)Rr[c]=Jc(Rr[c-3]^Rr[c-8]^Rr[c-14]^Rr[c-16],1);let{
A:n,B:s,C:i,D:o,E:a}=this;for(let c=0;c<80;c++){let l,u;c<20?(l=my(s,i,o),u=1518500249):c<40?(l=s^i^o,u=1859775393):c<60?
(l=gy(s,i,o),u=2400959708):(l=s^i^o,u=3395469782);const d=Jc(n,5)+l+a+u+Rr[c]|0;a=o,o=i,i=Jc(s,30),s=n,n=d}n=n+this.A|0,
s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.E|0,this.set(n,s,i,o,a)}roundClean(){un(Rr)}destroy(){this.set(0,0,0,0,0),
un(this.buffer)}}const XT=hd(()=>new JT);function YT(){let r=Promise.resolve();return{run(e,{signal:t}={}){const n=r.catch(
()=>{}).then(()=>(t?.throwIfAborted(),e()));return r=n,n},settled:()=>r.catch(()=>{})}}function wy(r){if(r?.code==="ERR_\
MODEL_STORAGE_FULL"||r?.name!=="QuotaExceededError")return r;const e=new Error("The browser refused additional storage. \
Delete an unused stored model or free device storage, then retry the import.",{cause:r});return e.name="QuotaExceededErr\
or",e.code="ERR_MODEL_STORAGE_FULL",e}async function kp(r,e,t,{signal:n,onProgress:s,fetchImpl:i=fetch}={}){try{return await r.
withRetention(async o=>{const a=[];for(let c=0;c<e.files.length;c+=1){n?.throwIfAborted();const l=e.files[c],u=()=>globalThis.
performance?.now()??Date.now();let d=0,h=u();const p=()=>s?.({stage:"import",path:l.path,index:c,total:e.files.length,loaded:d,
totalBytes:l.size});p();let m=l.cid?await o.stat(l.cid,{signal:n}):null;if(!m||m.status!=="complete"||m.size!==l.size||m.
sha256!==l.sha256){const y=await i(t(l.path),{signal:n});if(!y.ok||!y.body)throw new Error(`Artifact source failed: ${l.
path} (${y.status})`);const g=l.gitBlobSha1?XT.create().update(new TextEncoder().encode(`blob ${l.size}\0`)):null;async function*f(){
for await(const b of y.body){n?.throwIfAborted(),g?.update(b),d+=b.byteLength,yield b;const w=u();d<l.size&&w-h>=100&&(h=
w,p())}if(g&&wT(g.digest())!==l.gitBlobSha1)throw new Error(`Source Git blob SHA-1 mismatch: ${l.path}`)}m=await o.importFile(
f(),{expectedSize:l.size,...l.sha256?{expectedSha256:l.sha256}:{},signal:n,pin:!1})}if(l.cid&&m.cid!==l.cid)throw new Error(
`Imported CID differs: ${l.path}`);n?.throwIfAborted(),d=l.size,p(),a.push({path:l.path,cid:m.cid,size:m.size,sha256:m.sha256})}
return n?.throwIfAborted(),s?.({stage:"verify",total:e.files.length,totalBytes:a.reduce((c,l)=>c+l.size,0)}),n?.throwIfAborted(),
o.importManifest({...e,files:a},{pin:!0,signal:n})},{signal:n})}catch(o){throw wy(o)}}async function ZT(r,{signal:e}={}){
const t=[];for await(const n of r.list({signal:e}))e?.throwIfAborted(),n.kind==="manifest"&&["complete","deleting"].includes(
n.status)&&n.manifest?.model?.runtime&&t.push(n);return t}async function eM(r,e,{signal:t}={}){const n=r.store,s=r.networkManager?.
getArtifactTransport?.();if(!n.persistent||s?.store===n&&s.releaseOwnership)return e();if(!n.lockManager?.request){if(n.
backend?.hasExclusiveLock)return e();throw new Error("Stored model deletion requires exclusive network ownership for thi\
s store")}return n.lockManager.request(`${n.lockName}:network-owner`,{mode:"exclusive",ifAvailable:!0},async i=>{if(!i)throw new Error(
"Another tab owns file sharing for this library. Delete the model from that tab, or close that tab and retry.");return t?.
throwIfAborted(),e()})}const tM="https://secretworkshop.net/peercompute/config/relay-config.json";async function Ep(r,{fetchImpl:e,
signal:t,maximumBytes:n}){const s=await e(r,{cache:"no-store",signal:t});if(!s.ok||!s.body)throw new Error(`Relay config\
uration unavailable (${s.status})`);const i=[];let o=0;for await(const l of s.body){if(o+=l.byteLength,o>n)throw new Error(
"Relay configuration exceeds its byte limit");i.push(l)}const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=
l.byteLength;return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(a))}async function rM({fetchImpl:r=globalThis.
fetch,signal:e,baseUrl:t=globalThis.location?.href}={}){const n=AbortSignal.timeout(2e4),s=e?AbortSignal.any([e,n]):n;let i;
try{i=await Ep(new URL("./relay-config-source.json",t).href,{fetchImpl:r,signal:s,maximumBytes:16*1024})}catch(l){if(s.aborted)
throw l}const o=new URL(i?.relayConfigUrl??tM);if(o.protocol!=="https:"||o.hostname!=="secretworkshop.net"||o.username||
o.password)throw new Error("Relay configuration must use the approved Secret Workshop HTTPS backend");const a=await Ep(o.
href,{fetchImpl:r,signal:s,maximumBytes:64*1024}),c=[...new Set((Array.isArray(a.bootstrapPeers)?a.bootstrapPeers:[]).filter(
l=>typeof l=="string"&&l.length<=2048&&l.startsWith("/")&&l.includes("/wss/")&&l.includes("/p2p/")))].slice(0,16);if(!c.
length)throw new Error("Production relay configuration contains no secure bootstrap peers");return{bootstrapPeers:c,transportManager:{
faultTolerance:"no-fatal"},...a.webrtc&&typeof a.webrtc=="object"?{webrtc:a.webrtc}:{},pubsubType:a.pubsubType==="gossip\
sub"?"gossipsub":"floodsub",...a.gossipsub&&typeof a.gossipsub=="object"?{gossipsub:a.gossipsub}:{}}}function Br(r=0){return new Uint8Array(
r)}function ia(r=0){return new Uint8Array(r)}function nM(r){return r?.buffer instanceof ArrayBuffer}function sM(r){if(nM(
r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function xp(r,e){e==null&&(e=r.reduce((s,i)=>s+
i.length,0));const t=ia(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return sM(t)}function iM(r,e){if(r===e)return!0;
if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}const ky=Symbol.
for("@achingbrain/uint8arraylist");function vp(r,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function Wi(r){return!!r?.[ky]}class Wr{bufs;length;[ky]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.
appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(Wi(n)){t+=n.byteLength;for(const s of n.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,
this.bufs.unshift(n);else if(Wi(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=vp(this.bufs,e);return t.buf[t.index]}set(e,t){
const n=vp(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,
e[n]);else if(Wi(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{
bufs:n,length:s}=this._subList(e,t);return xp(n,s)}subarray(e,t){const{bufs:n,length:s}=this._subList(e,t);return n.length===
1?n[0]:xp(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new Wr;return i.length=s,i.bufs=n,i}_subList(e,t){
if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)throw new RangeError("index \
is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[...this.bufs],length:this.length};
const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const d=e-a;n.push(o.subarray(d,d+(t-e)));break}if(l){if(e===
0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.
push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!Wi(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(
t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let d=0;d<i;d++)o[d]=-1;
for(let d=0;d<s;d++)o[n[d]]=d;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let d=t;d<=c;d+=u){u=0;
for(let h=l;h>=0;h--){const p=this.get(d+h);if(n[h]!==p){u=Math.max(1,h-a[p]);break}}if(u===0)return d}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=ia(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Br(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Br(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Br(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=ia(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Br(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Br(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Br(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Br(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Br(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Wr)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!iM(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new Wr;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}}class TB extends Error{static name="AbortError";constructor(e="\
The operation was aborted"){super(e),this.name="AbortError"}}class MB extends Error{static name="UnexpectedPeerError";constructor(e="\
Unexpected Peer"){super(e),this.name="UnexpectedPeerError"}}class RB extends Error{static name="InvalidCryptoExchangeErr\
or";constructor(e="Invalid crypto exchange"){super(e),this.name="InvalidCryptoExchangeError"}}class oM extends Error{static name="\
InvalidParametersError";constructor(e="Invalid parameters"){super(e),this.name="InvalidParametersError"}}class BB extends Error{static name="\
InvalidPublicKeyError";constructor(e="Invalid public key"){super(e),this.name="InvalidPublicKeyError"}}class LB extends Error{static name="\
InvalidPrivateKeyError";constructor(e="Invalid private key"){super(e),this.name="InvalidPrivateKeyError"}}class DB extends Error{static name="\
ConnectionClosedError";constructor(e="The connection is closed"){super(e),this.name="ConnectionClosedError"}}class PB extends Error{static name="\
ConnectionFailedError";constructor(e="Connection failed"){super(e),this.name="ConnectionFailedError"}}class $B extends Error{static name="\
MuxerClosedError";constructor(e="The muxer is closed"){super(e),this.name="MuxerClosedError"}}class NB extends Error{static name="\
StreamResetError";constructor(e="The stream has been reset"){super(e),this.name="StreamResetError"}}class UB extends Error{static name="\
StreamStateError";constructor(e="The stream is in an invalid state"){super(e),this.name="StreamStateError"}}class aM extends Error{static name="\
StreamBufferError";constructor(e="The stream buffer was full"){super(e),this.name="StreamBufferError"}}class FB extends Error{static name="\
NotFoundError";constructor(e="Not found"){super(e),this.name="NotFoundError"}}class OB extends Error{static name="Invali\
dPeerIdError";constructor(e="Invalid PeerID"){super(e),this.name="InvalidPeerIdError"}}class zB extends Error{static name="\
InvalidMultiaddrError";constructor(e="Invalid multiaddr"){super(e),this.name="InvalidMultiaddrError"}}class qB extends Error{static name="\
InvalidCIDError";constructor(e="Invalid CID"){super(e),this.name="InvalidCIDError"}}class jB extends Error{static name="\
InvalidMultihashError";constructor(e="Invalid Multihash"){super(e),this.name="InvalidMultihashError"}}class GB extends Error{static name="\
UnsupportedProtocolError";constructor(e="Unsupported protocol error"){super(e),this.name="UnsupportedProtocolError"}}class WB extends Error{static name="\
InvalidMessageError";constructor(e="Invalid message"){super(e),this.name="InvalidMessageError"}}class VB extends Error{static name="\
ProtocolError";constructor(e="Protocol error"){super(e),this.name="ProtocolError"}}let HB=class extends Error{static name="\
TimeoutError";constructor(e="Timed out"){super(e),this.name="TimeoutError"}};class QB extends Error{static name="NotStar\
tedError";constructor(e="Not started"){super(e),this.name="NotStartedError"}}class JB extends Error{static name="DialErr\
or";constructor(e="Dial error"){super(e),this.name="DialError"}}class XB extends Error{static name="ListenError";constructor(e="\
Listen error"){super(e),this.name="ListenError"}}class YB extends Error{static name="LimitedConnectionError";constructor(e="\
Limited connection"){super(e),this.name="LimitedConnectionError"}}class ZB extends Error{static name="TooManyInboundProt\
ocolStreamsError";constructor(e="Too many inbound protocol streams"){super(e),this.name="TooManyInboundProtocolStreamsEr\
ror"}}class eL extends Error{static name="TooManyOutboundProtocolStreamsError";constructor(e="Too many outbound protocol\
 streams"){super(e),this.name="TooManyOutboundProtocolStreamsError"}}class tL extends Error{static name="UnsupportedKeyT\
ypeError";constructor(e="Unsupported key type"){super(e),this.name="UnsupportedKeyTypeError"}}class gd extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,gd)}}const cM=r=>"reason"in r?r.reason:new DOMException(
"This operation was aborted.","AbortError"),lM=2**31-1,uM=(r,e)=>{if(typeof r!="number"||Math.sign(r)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${r}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function dM(r,e){
const{milliseconds:t,fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
r.cancel?.()}catch{}},d=new Promise((h,p)=>{const m=()=>{p(cM(o)),l()},y=uM(t,i);try{y?p(y):o?.aborted?m():o&&(c=m,o.addEventListener(
"abort",c,{once:!0}))}finally{r.then(h,p)}if(y||o?.aborted||t>lM)return;const g=n||s===!1||s instanceof Error?void 0:new gd(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(n)try{h(n())}catch(f){p(f)}else s===!1?
h():p(s instanceof Error?s:g);l()},t)}).finally(()=>{try{d.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return d.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},d}const Ey=r=>typeof r=="function"?{filter:r}:
{...r},hM=r=>r===1/0||Number.isSafeInteger(r)&&r>=0,fM=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],pM=r=>{for(const[e,t]of fM){const n=r?.[e],s=r?.[t];if(typeof n=="function"&&typeof s=="functi\
on")return{addListener:n.bind(r),removeListener:s.bind(r)}}throw new TypeError("Emitter is not compatible")},mM=r=>{const e=new Map;
for(const[t,n]of r)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,n);return e},gM=({addListener:r,removeListener:e,
handlers:t,signal:n,abortHandler:s,isDone:i})=>{n?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(r(o,a),i()){
e(o,a);return}},bM=({removeListener:r,handlers:e,signal:t,abortHandler:n})=>{for(const[s,i]of e)r(s,i);t?.removeEventListener(
"abort",n)},yM=(r,e,t)=>{let n=Promise.resolve();return(s,i)=>{n=n.then(async()=>{if(e())return;let o;try{o=r?await r(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function wM(r,e,t){let n=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=Ey(t);const{
filter:l}=t;if(!hM(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:d}=pM(r);if(t.count===0){a([]);return}const h=[],p=E=>{
n(),c(E)},m=yM(l,()=>s,p),y=E=>{h.push(E),t.count===h.length&&(n(),a(h))},g=(...E)=>{if(s)return;const v=t.multiArgs?E:E[0];
if(!l){y(v);return}m(v,_=>{_&&y(v)})},f=(...E)=>{p(t.rejectionMultiArgs?E:E[0])},b=()=>{p(t.signal.reason)},w={addListener:u,
removeListener:d,handlers:mM([[e,g],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:b,isDone:()=>s};n=()=>{
s=!0,clearTimeout(i),bM(w)},gM(w),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
n,t.timeout)),a(h))});if(o.cancel=n,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=dM(o,{milliseconds:t.
timeout});return a.cancel=()=>{n(),a.clear()},a}return o}function xy(r,e,t){const n=wM(r,e,{...Ey(t),count:1,resolveImmediately:!1}),
s=n.then(i=>i[0]);return s.cancel=n.cancel,s}class rL extends Error{remainingPoints;msBeforeNext;consumedPoints;isFirstInDuration;constructor(e="\
Rate limit exceeded",t){super(e),this.name="RateLimitError",this.remainingPoints=t.remainingPoints,this.msBeforeNext=t.msBeforeNext,
this.consumedPoints=t.consumedPoints,this.isFirstInDuration=t.isFirstInDuration}}class nL extends Error{static name="Que\
ueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class oa extends Error{static name="\
UnexpectedEOFError";name="UnexpectedEOFError"}class sL extends Error{static name="MaxEarlyStreamsError";name="MaxEarlySt\
reamsError"}class iL extends Error{static name="StreamClosedError";name="StreamClosedError"}const kM=Math.pow(2,7),EM=Math.
pow(2,14),xM=Math.pow(2,21),bd=Math.pow(2,28),yd=Math.pow(2,35),wd=Math.pow(2,42),kd=Math.pow(2,49),ce=128,Xe=127;function qa(r){
if(r<kM)return 1;if(r<EM)return 2;if(r<xM)return 3;if(r<bd)return 4;if(r<yd)return 5;if(r<wd)return 6;if(r<kd)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function vM(r,e,t=0){
switch(qa(r)){case 8:e[t++]=r&255|ce,r/=128;case 7:e[t++]=r&255|ce,r/=128;case 6:e[t++]=r&255|ce,r/=128;case 5:e[t++]=r&
255|ce,r/=128;case 4:e[t++]=r&255|ce,r>>>=7;case 3:e[t++]=r&255|ce,r>>>=7;case 2:e[t++]=r&255|ce,r>>>=7;case 1:{e[t++]=r&
255,r>>>=7;break}default:throw new Error("unreachable")}return e}function SM(r,e,t=0){switch(qa(r)){case 8:e.set(t++,r&255|
ce),r/=128;case 7:e.set(t++,r&255|ce),r/=128;case 6:e.set(t++,r&255|ce),r/=128;case 5:e.set(t++,r&255|ce),r/=128;case 4:
e.set(t++,r&255|ce),r>>>=7;case 3:e.set(t++,r&255|ce),r>>>=7;case 2:e.set(t++,r&255|ce),r>>>=7;case 1:{e.set(t++,r&255),
r>>>=7;break}default:throw new Error("unreachable")}return e}function AM(r,e){let t=r[e],n=0;if(n+=t&Xe,t<ce||(t=r[e+1],
n+=(t&Xe)<<7,t<ce)||(t=r[e+2],n+=(t&Xe)<<14,t<ce)||(t=r[e+3],n+=(t&Xe)<<21,t<ce)||(t=r[e+4],n+=(t&Xe)*bd,t<ce)||(t=r[e+5],
n+=(t&Xe)*yd,t<ce)||(t=r[e+6],n+=(t&Xe)*wd,t<ce)||(t=r[e+7],n+=(t&Xe)*kd,t<ce))return n;throw new RangeError("Could not \
decode varint")}function _M(r,e){let t=r.get(e),n=0;if(n+=t&Xe,t<ce||(t=r.get(e+1),n+=(t&Xe)<<7,t<ce)||(t=r.get(e+2),n+=
(t&Xe)<<14,t<ce)||(t=r.get(e+3),n+=(t&Xe)<<21,t<ce)||(t=r.get(e+4),n+=(t&Xe)*bd,t<ce)||(t=r.get(e+5),n+=(t&Xe)*yd,t<ce)||
(t=r.get(e+6),n+=(t&Xe)*wd,t<ce)||(t=r.get(e+7),n+=(t&Xe)*kd,t<ce))return n;throw new RangeError("Could not decode varin\
t")}function IM(r,e,t=0){return e==null&&(e=ia(qa(r))),e instanceof Uint8Array?vM(r,e,t):SM(r,e,t)}function CM(r,e=0){return r instanceof
Uint8Array?AM(r,e):_M(r,e)}const TM=4194304;class Sp extends Error{static name="UnwrappedError";name="UnwrappedError"}class MM extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class RM extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class BM extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}function LM(r){
return typeof r?.closeRead=="function"}function DM(r){return typeof r?.close=="function"}function Yc(r){return LM(r)?r.remoteWriteStatus!==
"writable"&&r.readBufferLength===0:DM(r)?r.status!=="open":!1}function PM(r){return r?.addEventListener!=null&&r?.removeEventListener!=
null&&r?.send!=null&&r?.push!=null&&r?.log!=null}function $M(r,e){const t=e?.maxBufferSize??TM,n=new Wr;let s,i=!1,o;if(!PM(
r))throw new oM("Argument should be a Stream or a Multiaddr");const a=d=>{if(!i&&o==null){if(n.append(d.data),n.byteLength>
t){const h=n.byteLength;n.consume(h);const p=new aM(`Read buffer overflow - ${h} > ${t}`);o=p,s?.reject(p),queueMicrotask(
()=>{r.abort(p)});return}s?.resolve()}};r.addEventListener("message",a);const c=d=>{d.error!=null?s?.reject(d.error):s?.
resolve()};r.addEventListener("close",c);const l=()=>{s?.resolve()};r.addEventListener("remoteCloseWrite",l);const u={readBuffer:n,
async read(d){if(i===!0)throw new Sp("Stream was unwrapped");if(o!=null)throw o;if(Yc(r)){if(n.byteLength===0&&d?.bytes==
null)return null;if(d?.bytes!=null&&n.byteLength<d.bytes)throw r.log.error("closed after reading %d/%d bytes",n.byteLength,
d.bytes),new oa(`Unexpected EOF - stream closed after reading ${n.byteLength}/${d.bytes} bytes`)}const h=d?.bytes??1;for(s=
Promise.withResolvers();;){if(n.byteLength>=h){s.resolve();break}if(await Pb(s.promise,d?.signal),Yc(r)){if(n.byteLength===
0&&d?.bytes==null)return null;break}s=Promise.withResolvers()}const p=d?.bytes??n.byteLength;if(n.byteLength<p){if(Yc(r))
throw r.log.error("closed while reading %d/%d bytes",n.byteLength,p),new oa(`Unexpected EOF - stream closed while readin\
g ${n.byteLength}/${p} bytes`);return u.read(d)}const m=n.sublist(0,p);return n.consume(p),m},async write(d,h){if(i===!0)
throw new Sp("Stream was unwrapped");r.send(d)||await xy(r,"drain",{signal:h?.signal,rejectionEvents:["close"]})},unwrap(){
return i||(i=!0,r.removeEventListener("message",a),r.removeEventListener("close",c),r.removeEventListener("remoteCloseWr\
ite",l),n.byteLength>0&&(r.log("stream unwrapped with %d unread bytes",n.byteLength),r.unshift(n),n.consume(n.byteLength))),
r}};return u}function vy(r,e={}){const t=$M(r,e);e.maxDataLength!=null&&e.maxLengthLength==null&&(e.maxLengthLength=qa(e.
maxDataLength));const n=e?.lengthDecoder??CM,s=e?.lengthEncoder??IM;return{async read(o){let a=-1;const c=new Wr;for(;;){
const u=await t.read({...o,bytes:1});if(u==null)break;c.append(u);try{a=n(c)}catch(d){if(d instanceof RangeError)continue;
throw d}if(a<0)throw new MM("Invalid message length");if(e?.maxLengthLength!=null&&c.byteLength>e.maxLengthLength)throw new BM(
`Message length length too long - ${c.byteLength} > ${e.maxLengthLength}`);if(a>-1)break}if(e?.maxDataLength!=null&&a>e.
maxDataLength)throw new RM(`Message length too long - ${a} > ${e.maxDataLength}`);const l=await t.read({...o,bytes:a});if(l==
null)throw r.log.error("tried to read %d bytes but the stream closed",a),new oa(`Unexpected EOF - tried to read ${a} byt\
es but the stream closed`);if(l.byteLength!==a)throw r.log.error("read %d/%d bytes before the stream closed",l.byteLength,
a),new oa(`Unexpected EOF - read ${l.byteLength}/${a} bytes before the stream closed`);return l},async write(o,a){await t.
write(new Wr(s(o.byteLength),o),a)},async writeV(o,a){const c=new Wr(...o.flatMap(l=>[s(l.byteLength),l]));await t.write(
c,a)},unwrap(){return t.unwrap()}}}function oL(r,e){const t=vy(r,e),n={read:async(s,i)=>{const o=await t.read(i);return s.
decode(o,i)},write:async(s,i,o)=>{await t.write(i.encode(s),o)},writeV:async(s,i,o)=>{await t.writeV(s.map(a=>i.encode(a)),
o)},pb:s=>({read:async i=>n.read(s,i),write:async(i,o)=>n.write(i,s,o),writeV:async(i,o)=>n.writeV(i,s,o),unwrap:()=>n}),
unwrap:()=>t.unwrap()};return n}function NM(r){return r?.addEventListener!=null}function UM(r){const e=Db();let t;const n=o=>{
e.push(o.data)},s=()=>{e.end(),r.removeEventListener("message",n),r.removeEventListener("close",i),r.removeEventListener(
"remoteCloseWrite",s)},i=o=>{e.end(o.error),o.error!=null&&t?.reject(o.error),r.removeEventListener("message",n),r.removeEventListener(
"close",i),r.removeEventListener("remoteCloseWrite",s)};return r.addEventListener("message",n),r.addEventListener("close",
i,{once:!0}),r.addEventListener("remoteCloseWrite",s,{once:!0}),{source:e,async sink(o){async function*a(){yield*o}const c=a();
for(;;){t=Promise.withResolvers();const{done:l,value:u}=await Promise.race([c.next(),t.promise]);if(r.writeStatus==="clo\
sing"||r.writeStatus==="closed"||(u!=null&&(r.send(u)||await Promise.race([xy(r,"drain",{rejectionEvents:["close"]})])),
l===!0))break}await r.close()}}}function aL(...r){const e=r.map(t=>NM(t)?UM(t):t);return $b(...e)}const FM="peercompute.\
model-artifact-read.v1",Ed=FM;function Sy(r,e){const t=n=>e(n.data);return r.addEventListener("message",t),r.start?.(),()=>r.
removeEventListener("message",t)}function ft(r,e,t=[]){r.postMessage({protocol:Ed,...e},t)}function cL(r,{store:e,manifest:t,
chunkBytes:n=le.chunkBytes,maxReads:s=le.maxReads}={}){if(!e?.stat||!e?.openRead)throw new Error("A verified artifact st\
ore is required");if(!Number.isInteger(n)||n<1||n>le.chunkBytes||!Number.isInteger(s)||s<1||s>le.maxReads)throw new Error(
"Invalid artifact bridge bounds");const i=new Map(t.files.map(h=>[sa(h.path),h])),o=new Map;let a=!1,c=0;async function l(h,p){
const m=o.get(h);if(m){o.delete(h),m.controller.abort(p);try{await m.iterator?.return?.()}catch{}}}async function u(h){if(a||
h?.protocol!==Ed||typeof h.id!="string"||h.id.length>128)return;const{id:p}=h;try{if(h.type==="cancel"){await l(p,"Reade\
r cancelled");return}if(h.type==="open"){if(o.has(p))throw new Error("Duplicate artifact reader");if(o.size>=s)throw new Error(
"Artifact reader limit reached");const b=i.get(h.path);if(!b)throw new Error("Artifact path is not in the manifest");const w=h.
offset??0,E=h.length??b.size-w;if(!Number.isSafeInteger(w)||!Number.isSafeInteger(E)||w<0||E<0||w>b.size||E>b.size-w)throw new Error(
"Invalid artifact byte range");const v={controller:new AbortController,remaining:E,pulling:!1};o.set(p,v);const _=await e.
stat(b.cid);if(Ke(v.controller.signal),a||o.get(p)!==v)return;if(!_||_.status!=="complete"||_.size!==b.size||_.sha256!==
b.sha256)throw new Error("Model artifact is incomplete or has a different size");const k=await e.openRead(b.cid,{offset:w,
length:E,signal:v.controller.signal});if(v.iterator=k[Symbol.asyncIterator](),a||v.controller.signal.aborted||o.get(p)!==
v){await v.iterator.return?.();return}ft(r,{type:"ready",id:p,size:E});return}if(h.type!=="pull")return;const m=o.get(p);
if(!m?.iterator||m.pulling)throw new Error("Invalid artifact pull credit");m.pulling=!0;const y=await m.iterator.next();
if(a||m.controller.signal.aborted||o.get(p)!==m)return;if(y.done){if(m.remaining!==0)throw new Error("Truncated model ar\
tifact");o.delete(p),ft(r,{type:"end",id:p});return}const g=y.value;if(!(g instanceof Uint8Array)||!g.byteLength||g.byteLength>
n||g.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bounds");m.remaining-=g.byteLength,m.pulling=
!1,c+=g.byteLength;const f=g.slice();ft(r,{type:"chunk",id:p,bytes:f},[f.buffer])}catch(m){await l(p,m),a||ft(r,{type:"e\
rror",id:p,message:m?.message||"Artifact read failed"})}}const d=Sy(r,h=>{u(h)});return{getStats:()=>({activeReads:o.size,
deliveredBytes:c}),async close(){if(!a){a=!0;try{ft(r,{type:"closed",message:"Artifact bridge closed"})}catch{}d(),await Promise.
all([...o.keys()].map(h=>l(h,"Artifact bridge closed"))),r.close()}}}}function OM(r,{manifest:e,baseUrl:t,signal:n,chunkBytes:s=le.
chunkBytes,maxReads:i=le.maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>le.maxReads||!Number.isInteger(
o)||o<0||o>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(t),c=new Map(e.files.map(f=>[sa(f.path),
f])),l=new Map,u=[];let d=0,h=!1;function p(){for(;!h&&l.size<i&&u.length;){const f=u.shift();l.set(f.id,f),f.active=!0,
ft(r,{type:"open",id:f.id,path:f.path})}}function m(f,b){l.delete(f.id);const w=u.indexOf(f);if(w>=0&&u.splice(w,1),n?.removeEventListener(
"abort",f.abort),f.requestSignal?.removeEventListener("abort",f.abort),b){f.reject?.(b);try{f.streamController?.error(b)}catch{}}
f.resolvePull?.(),p()}const y=Sy(r,f=>{if(f?.protocol!==Ed)return;const b=l.get(f.id);if(b){if(f.type==="error"){m(b,new Error(
f.message));return}if(f.type==="ready"){if(b.ready||f.size!==b.file.size){m(b,new Error("Invalid artifact response size")),
ft(r,{type:"cancel",id:b.id});return}b.ready=!0,ft(r,{type:"pull",id:b.id})}else if(f.type==="chunk"){if(!b.ready||!b.resolvePull||
!(f.bytes instanceof Uint8Array)||!f.bytes.byteLength||f.bytes.byteLength>s||b.received+f.bytes.byteLength>b.file.size){
ft(r,{type:"cancel",id:b.id}),m(b,new Error("Invalid artifact chunk"));return}b.received+=f.bytes.byteLength,b.streamController.
enqueue(f.bytes);const w=b.resolvePull;b.resolvePull=null,w()}else f.type==="end"&&(!b.ready||b.received!==b.file.size?m(
b,new Error("Truncated artifact response")):(b.streamController.close(),m(b)))}});async function g(f,b={}){if(h)throw new Error(
"Artifact bridge is closed");if(Ke(n),Ke(b.signal),b.method&&b.method!=="GET")throw new Error("Model adapter supports GE\
T only");const w=String(f);if(/[\\]/.test(w)||/%(?:2e|2f|5c|00)/i.test(w)||/\/(?:\.|\.\.)(?:\/|$)/.test(w))throw new Error(
"Invalid artifact URL");const E=new URL(w,a);if(E.origin!==a.origin||E.username||E.password||E.search||E.hash||!E.pathname.
startsWith(a.pathname))throw new Error("Model path is outside its manifest");const v=sa(decodeURIComponent(E.pathname.slice(
a.pathname.length))),_=c.get(v);if(!_)return new Response("Artifact path is not in the manifest",{status:404});const k=`\
read-${++d}`,x={id:k,path:v,file:_,requestSignal:b.signal,received:0,ready:!1,active:!1,queued:!1};x.abort=()=>{x.active&&
ft(r,{type:"cancel",id:k}),m(x,tu(n?.reason??b.signal?.reason))};const C=new ReadableStream({start(I){x.streamController=
I},pull(){if(h)throw new Error("Artifact bridge is closed");if(Ke(n),Ke(b.signal),!x.active&&!x.queued&&l.size>=i&&u.length>=
o)throw new Error("Artifact reader limit reached");return new Promise(I=>{x.resolvePull=I,x.ready?ft(r,{type:"pull",id:k}):
x.queued||(x.queued=!0,n?.addEventListener("abort",x.abort,{once:!0}),b.signal?.addEventListener("abort",x.abort,{once:!0}),
u.push(x),p())})},cancel(){x.active&&ft(r,{type:"cancel",id:k}),m(x)}},{highWaterMark:0});return new Response(C,{headers:{
"Content-Length":String(_.size),"Content-Type":_.mediaType||"application/octet-stream"}})}return{fetch:g,close(f="Artifa\
ct bridge closed"){if(!h){h=!0;for(const b of[...l.values(),...u])b.active&&ft(r,{type:"cancel",id:b.id}),m(b,tu(f));y(),
r.close()}}}}const uo=r=>new TextEncoder().encode(r).byteLength;function zM(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function ja(r){if(r==null)return null;
if(!Number.isSafeInteger(r.width)||!Number.isSafeInteger(r.height)||r.width<1||r.height<1||r.width*r.height>le.maxImagePixels||
r.channels!==4||!(r.data instanceof Uint8Array||r.data instanceof Uint8ClampedArray)||r.data.byteLength!==r.width*r.height*
4||r.data.byteLength>le.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fi\
les are not accepted");return r}function xd(r){const e=r.messages??(typeof r.prompt=="string"?[{role:"user",content:r.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>le.maxMessages)throw new Error("Invalid inference messages");let t=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(t+=uo(n.content),t>le.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function su(r){if(!r)return;let e;const t=new Set;for(const n of[r.model,r.processor,
r.tokenizer])if(!(!n||t.has(n))){t.add(n);try{await n.dispose?.()}catch(s){e??=s}}if(e)throw e}function ho(r,e=new Set){
if(!(!r||typeof r!="object"||e.has(r))){if(e.add(r),typeof r.dispose=="function"){r.dispose();return}for(const t of Object.
values(r))ho(t,e)}}function qM(r){const e=r.findIndex(n=>n.role==="user");if(e<0)return null;const t=r.findIndex((n,s)=>s>
e&&n.role==="user");return t<0?null:r.filter((n,s)=>s<e||s>=t||n.role==="system")}function jM(r,e,t){const n={...r.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,r.generation_config);const s=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],i=e.at(-1),o=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return o(i)&&s.some(a=>o(a)&&BigInt(a)===BigInt(i))?"stop":e.length>=t?"length":"unknown"}async function GM({library:r,
modelPath:e,options:t,manifest:n}){const s={};try{const i=await r.AutoConfig.from_pretrained(e,t);if(i.model_type!==n.model.
architecture)throw new Error("Model config architecture does not match its admitted manifest");const o={...t,config:i};if(n.
model.architecture==="qwen3_5"&&(o.use_external_data_format=1),n.model.task==="image-text-to-text"){if(s.processor=await r.
AutoProcessor.from_pretrained(e,t),n.model.architecture==="qwen3_5"){const a=s.processor.image_processor;if(!a)throw new Error(
"Qwen3.5 image processor is unavailable");a.min_pixels=256*256,a.max_pixels=za(n.model).maxProcessedImagePixels,a.do_normalize??=
!0}s.tokenizer=s.processor.tokenizer,s.model=await r.AutoModelForImageTextToText.from_pretrained(e,o)}else s.tokenizer=await r.
AutoTokenizer.from_pretrained(e,t),s.model=await r.AutoModelForCausalLM.from_pretrained(e,o);return s}catch(i){throw await su(
s),i}}function Ap(r){return{sessionId:r.sessionId,manifestCid:r.manifestCid,status:r.lost?"lost":r.status,task:r.manifest.
model.task,dtype:r.manifest.model.dtype,workerId:r.workerId,adapter:r.adapter,runtimeAdapter:r.runtimeAdapter??null,gpuDispatches:r.
gpuDispatches??0,gpuSubmissions:r.gpuSubmissions??0,gpuProfileSamples:r.gpuProfileSamples??0,collectGpuEvidence:r.collectGpuEvidence===
!0,runtimeFeatures:r.runtimeFeatures??[],generatedRequests:r.generatedRequests}}function Ay({loadLibrary:r=()=>mt(()=>import("./transformers.web-DGNMtDcj.js"),
[],import.meta.url),loadModel:e=GM,gpu:t=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=zM}={}){
const i=new Map;let o;async function a(l,u){if(i.size)throw new Error("This inference worker already has a resident/load\
ing model");const d=Bs(l.sessionId),{manifest:h}=zT(l.manifest),p=qT(l.runtimeAssets,n);if(!l.artifactPort?.postMessage)
throw new Error("An artifact reader port is required");Ke(u.signal);const m={sessionId:d,manifest:h,manifestCid:l.manifestCid,
status:"loading",workerId:u.workerId??null,generatedRequests:0,components:null};i.set(d,m);let y;try{const g=await t?.requestAdapter(
{powerPreference:"high-performance"});if(Ke(u.signal),!g||g.info?.isFallbackAdapter||g.isFallbackAdapter)throw new Error(
"A hardware WebGPU adapter is required; CPU/software fallback is disabled");const f=typeof h.model.dtype=="string"?[h.model.
dtype]:Object.values(h.model.dtype),b=new Set(h.model.requiredFeatures??[]);f.some(C=>["fp16","q4f16"].includes(C))&&b.add(
"shader-f16");for(const C of b)if(!g.features.has(C))throw new Error(`Model requires unsupported GPU feature: ${C}`);m.adapter=
{vendor:g.info?.vendor??"",architecture:g.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...b]};const w=await(o??=
r());if(Ke(u.signal),w.env.version!==pd)throw new Error("Unexpected Transformers runtime version");const E=new URL("/__p\
eercompute_models/",n);y=OM(l.artifactPort,{manifest:h,baseUrl:new URL(`${d}/`,E).href,signal:u.signal});const{env:v}=w;
v.logLevel=50,v.allowLocalModels=!0,v.allowRemoteModels=!1,v.localModelPath=E.pathname,v.useBrowserCache=!1,v.useFSCache=
!1,v.useWasmCache=!1,v.fetch=async(...C)=>{try{return await y.fetch(...C)}catch(I){throw u.emitProgress?.({type:"artifac\
t-read-error",sessionId:d,message:I.message}),I}},v.backends.onnx.wasm.proxy=!1,v.backends.onnx.wasm.numThreads=1,v.backends.
onnx.wasm.wasmPaths=p,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=l.collectGpuEvidence===
!0,v.backends.onnx.webgpu&&(v.backends.onnx.webgpu.profiling={mode:l.collectGpuEvidence===!0?"default":"off",ondata:()=>{
m.gpuProfileSamples+=1}});const _={local_files_only:!0,device:"webgpu",dtype:h.model.dtype,session_options:{executionProviders:[
"webgpu"]},progress_callback:C=>{u.signal?.aborted||u.emitProgress?.({type:"model-load",sessionId:d,status:String(C.status??
"").slice(0,40),file:typeof C.file=="string"?C.file.slice(0,512):void 0,loaded:Number.isFinite(C.loaded)?C.loaded:void 0,
total:Number.isFinite(C.total)?C.total:void 0})}};m.library=w,m.components=await e({library:w,modelPath:d,options:_,manifest:h}),
Ke(u.signal);const k=await v.backends.onnx.webgpu?.device;if(m.runtimeDevice=k,m.runtimeFeatures=[...k?.features??[]],m.
collectGpuEvidence&&k){const C=k.createCommandEncoder.bind(k),I=k.queue.submit.bind(k.queue),S=Object.getOwnPropertyDescriptor(
k,"createCommandEncoder"),T=Object.getOwnPropertyDescriptor(k.queue,"submit");m.restoreGpuEvidence=()=>{S?Object.defineProperty(
k,"createCommandEncoder",S):delete k.createCommandEncoder,T?Object.defineProperty(k.queue,"submit",T):delete k.queue.submit,
m.restoreGpuEvidence=null},k.createCommandEncoder=(...$)=>{const D=C(...$),G=D.beginComputePass.bind(D);return D.beginComputePass=
(...H)=>{const Y=G(...H);for(const W of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const se=Y[W].bind(Y);Y[W]=(...de)=>{
const Be=se(...de);return m.gpuDispatches+=1,Be}}return Y},D},k.queue.submit=(...$)=>{const D=I(...$);return m.gpuSubmissions+=
1,D}}const x=k?.adapterInfo??v.backends.onnx.webgpu?.adapter?.info;if(x){if(x.isFallbackAdapter)throw new Error("ORT sel\
ected a software GPU adapter");m.runtimeAdapter={vendor:x.vendor,architecture:x.architecture,isFallbackAdapter:x.isFallbackAdapter??
!1}}return k?.lost&&k.lost.then(()=>{i.get(d)===m&&(m.lost=!0,m.active?.abort("GPU device lost"))}),Ke(u.signal),m.status=
"ready",Ap(m)}catch(g){try{await su(m.components),m.restoreGpuEvidence?.(),i.delete(d)}catch(f){m.status="ready",m.lost=
!0;const b=new Error(`MODEL_DISPOSE_FAILED: ${f.message}`);throw b.code="MODEL_DISPOSE_FAILED",b}throw g}finally{y?.close(),
y||l.artifactPort.close()}}async function c(l,u){const d=i.get(Bs(l.sessionId));if(!d||d.lost)throw new Error("Model ses\
sion lost or not loaded");if(d.status!=="ready")throw new Error("Model session is busy");const h=Bs(l.requestId),p=l.maxNewTokens??
le.maxNewTokens;if(!Number.isInteger(p)||p<1||p>le.maxNewTokens)throw new Error("Generation exceeds its output-token bud\
get");let m=xd(l);const y=ja(l.image);if(y&&d.manifest.model.task!=="image-text-to-text")throw new Error("This model doe\
s not admit image inputs");Ke(u.signal);const g=new AbortController,f=new d.library.InterruptableStoppingCriteria,b=()=>{
g.abort(u.signal?.reason),f.interrupt()};u.signal?.addEventListener("abort",b,{once:!0}),g.signal.addEventListener("abor\
t",()=>f.interrupt(),{once:!0}),d.active=g,d.requestId=h,d.status="generating";let w,E,v=0,_=0,k,x=!1;const C=d.gpuDispatches??
0,I=d.gpuSubmissions??0;try{Ke(u.signal);const{tokenizer:S,processor:T,model:$}=d.components;let D;for(;;){Ke(g.signal);
let se=m;if(T&&(se=m.map(be=>({role:be.role,content:[{type:"text",text:be.content}]})),y)){const be=se.findLast(wt=>wt.role===
"user");if(!be)throw new Error("An image requires a user message");be.content.unshift({type:"image"})}const de=(T??S).apply_chat_template(
se,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof de!="string"||uo(de)>le.maxPromptBytes)throw new Error(
"Templated prompt exceeds its byte budget");if(y){const be=new d.library.RawImage(y.data,y.width,y.height,y.channels);w=
await T(de,be,{do_image_splitting:!1})}else w=await S(de,{truncation:!1,padding:!1});if(Ke(g.signal),D=w.input_ids?.dims?.
at(-1),!Number.isSafeInteger(D)||D<1)throw new Error("Invalid model input token count");if(D+p<=le.maxContextTokens)break;
const Be=qM(m);if(!Be)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten th\
e prompt or request fewer output tokens");const ze=w;w=void 0,ho(ze),m=Be,x=!0}Ke(g.signal);const G=new d.library.TextStreamer(
S,{skip_prompt:!0,skip_special_tokens:!0,callback_function:se=>{if(!(g.signal.aborted||k)){if(_+=uo(se),_>le.maxOutputBytes){
k=new Error("Generated text exceeded its byte budget"),g.abort(k);return}try{if(u.emitProgress?.({type:"token",sessionId:d.
sessionId,requestId:h,sequence:v++,text:se})===!1)throw new Error("Token consumer rejected output")}catch(de){k=de,g.abort(
de)}}}});if(E=await $.generate({...w,max_new_tokens:p,do_sample:!1,streamer:G,stopping_criteria:[f]}),await d.runtimeDevice?.
queue.onSubmittedWorkDone(),k)throw k;if(d.lost)throw new Error("GPU device lost; model session is unavailable");Ke(g.signal);
const H=E.tolist();if(H.length!==1||H[0].length<D||H[0].length>D+p)throw new Error("Model returned an over-budget token \
sequence");const Y=H[0].slice(D),W=S.decode(Y,{skip_special_tokens:!0});if(uo(W)>le.maxOutputBytes)throw new Error("Gene\
rated text exceeds its byte budget");return d.generatedRequests+=1,{sessionId:d.sessionId,requestId:h,text:W,inputTokens:D,
outputTokens:Y.length,finishReason:jM($,Y,p),contextTruncated:x,workerId:d.workerId,gpuDispatches:(d.gpuDispatches??0)-C,
gpuSubmissions:(d.gpuSubmissions??0)-I,gpuProfileSamples:d.gpuProfileSamples??0}}finally{u.signal?.removeEventListener("\
abort",b);try{const S=new Set;ho(w,S),ho(E,S)}finally{d.active=null,d.requestId=null,d.status="ready"}}}return async function(u={},d={}){
if(s(),u.command==="load")return a(u,d);if(u.command==="generate")return c(u,d);const h=i.get(Bs(u.sessionId));if(u.command===
"status")return h?Ap(h):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return h?.requestId===u.requestId&&
h.active?.abort("Generation cancelled"),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="unload"){if(!h)
return{sessionId:u.sessionId,status:"absent"};if(h.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");h.status="unloading";try{await su(h.components),h.restoreGpuEvidence?.()}catch(p){h.status="ready",h.
lost=!0;const m=new Error(`MODEL_DISPOSE_FAILED: ${p.message}`);throw m.code="MODEL_DISPOSE_FAILED",m}return i.delete(u.
sessionId),{sessionId:u.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const WM=Ay(),VM=(r,e)=>WM(
r,e),HM=Object.freeze(Object.defineProperty({__proto__:null,createModelTaskRuntime:Ay,handleModelTask:VM,normalizeModelMessages:xd,
validateImageInput:ja},Symbol.toStringTag,{value:"Module"})),lL="/peercompute/inference/2.0.0",KM=256,Fn=Object.freeze({
frameBytes:128*1024,imageChunkBytes:64*1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,
queryTimeoutMs:5e3,requestTimeoutMs:12e4,recordTtlMs:15e3}),_y=new TextEncoder,QM=new TextDecoder("utf-8",{fatal:!0}),Iy=r=>_y.
encode(r).length,Cy=r=>Vn.parse(In(r,128)).toV1().toString();function In(r,e=256){if(typeof r!="string"||!r.length||Iy(r)>
e)throw new Error("Invalid inference text field");return r}function De(r,e,t=0){if(!Number.isSafeInteger(r)||r<t||r>e)throw new Error(
"Invalid inference numeric field");return r}function uL(r){return r?.status==="open"&&!!r.remotePeer&&(r.encryption==="/\
noise"||r.encryption==="/tls/1.0.0"||r.encryption==="native"&&r.remoteAddr?.getComponents?.().some(({name:e})=>e==="webr\
tc"||e==="webrtc-direct"))}function _p(r){if(!r||typeof r!="object")throw new Error("Invalid model descriptor");if(!Array.
isArray(r.modalities)||r.modalities.length>4||r.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const e=r.task??(r.modalities.includes("image")?"image-text-to-text":"text-generation");if(![
"text-generation","image-text-to-text","text-to-image"].includes(e))throw new Error("Invalid model task");const t=e==="t\
ext-to-image"?["image"]:["text"];if(r.outputModalities!==void 0&&(!Array.isArray(r.outputModalities)||r.outputModalities.
length!==1||r.outputModalities[0]!==t[0]))throw new Error("Model output modalities do not match its task");if(e==="text-\
to-image"&&(r.modalities.length!==1||r.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");
return{manifestCid:Cy(r.manifestCid),modelId:In(r.modelId),name:In(r.name),task:e,outputModalities:t,modalities:[...new Set(
r.modalities)],runtime:In(r.runtime,128),repository:In(r.repository,256),revision:In(r.revision,128),totalBytes:De(r.totalBytes,
64*1024**3)}}function dL(r,e=!0,{defaultMaxNewTokens:t=KM}={}){if(!r||!Array.isArray(r.sharedModels)||r.sharedModels.length>
Fn.maximumModels)throw new Error("Invalid shared model catalog");const n=[...new Map(r.sharedModels.map(i=>{const o=_p(i);
return[o.manifestCid,o]})).values()],s=e&&r.hostedModel?_p(r.hostedModel):null;return s&&(s.maxNewTokens=De(r.hostedModel.
maxNewTokens===void 0?t:r.hostedModel.maxNewTokens,le.maxNewTokens,1)),{sharedModels:n,hostedModel:s,busy:!!r.busy,idleForMs:De(
r.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:De(r.queuedRequests??0,1024)}}function hL(r,{imageBytes:e=!1}={}){
Bs(r.requestId);const t={requestId:r.requestId,manifestCid:Cy(r.manifestCid),messages:xd(r),maxNewTokens:De(r.maxNewTokens??
le.maxNewTokens,le.maxNewTokens,1)};if(r.task!==void 0){if(!["text-generation","image-text-to-text","text-to-image"].includes(
r.task))throw new Error("Invalid inference task");t.task=r.task}r.seed!==void 0&&(t.seed=De(r.seed,4294967295)),r.steps!==
void 0&&(t.steps=De(r.steps,8,1));for(const n of["width","height"])r[n]!==void 0&&(t[n]=De(r[n],512,512));if(t.task==="t\
ext-to-image"&&(r.image!=null||t.messages.length!==1||t.messages[0].role!=="user"))throw new Error("Image generation nee\
ds one text prompt");if(r.image!=null){const{width:n,height:s,channels:i}=r.image;if(De(n,le.maxImagePixels,1),De(s,le.maxImagePixels,
1),i!==4||n*s>le.maxImagePixels)throw new Error("Invalid inference image dimensions");e&&ja(r.image),t.image={width:n,height:s,
channels:4},e&&(t.image.data=new Uint8Array(r.image.data))}return t}function JM(r,{imageBytes:e=!1}={}){if(!r||typeof r!=
"object")throw new Error("Invalid result image");const t=De(r.width,1024,1),n=De(r.height,1024,1);if(r.channels!==4||t*n>
le.maxImagePixels||!/^[a-f0-9]{64}$/.test(r.sha256??""))throw new Error("Invalid result image dimensions or digest");return e&&
ja(r),{width:t,height:n,channels:4,sha256:r.sha256,...e?{data:r.data}:{}}}function fL(r,e={}){if(typeof r?.text!="string"||
Iy(r.text)>le.maxOutputBytes)throw new Error("Invalid inference result text");const t=r.finishReason===void 0?"unknown":
r.finishReason;if(!["stop","length","unknown"].includes(t))throw new Error("Invalid inference finish reason");const n={text:r.
text,finishReason:t};if(r.contextTruncated!==void 0){if(typeof r.contextTruncated!="boolean")throw new Error("Invalid in\
ference context truncation flag");n.contextTruncated=r.contextTruncated}for(const s of["inputTokens","outputTokens","gpu\
Dispatches","gpuSubmissions"])r[s]!=null&&(n[s]=De(r[s],Number.MAX_SAFE_INTEGER));return r.image!=null&&(n.image=JM(r.image,
e)),r.seed!==void 0&&(n.seed=De(r.seed,4294967295)),r.steps!==void 0&&(n.steps=De(r.steps,8,1)),n}function pL(r){if(!["t\
ext-encoder","denoise","decode"].includes(r.stage))throw new Error("Invalid image generation stage");const e=De(r.steps,
8,1);return{type:"diffusion-progress",stage:r.stage,steps:e,step:De(r.step,e)}}function mL(r){const e=vy(r,{maxDataLength:Fn.
frameBytes,maxBufferSize:Fn.frameBytes*2+32});return{rpc:e,async read(t){return JSON.parse(QM.decode((await e.read({signal:t})).
subarray()))},async write(t,n){const s=_y.encode(JSON.stringify(t));if(s.length>Fn.frameBytes)throw new Error("Inference\
 frame exceeds its byte limit");await e.write(s,{signal:n})}}}function _s(r={}){const e=[...r.modalities??["text"]],t=r.
task??(e.includes("image")?"image-text-to-text":"text-generation");return{task:t,modalities:e,outputModalities:[...r.outputModalities??
[t==="text-to-image"?"image":"text"]]}}function XM(r,{catalog:e,now:t=Date.now}={}){const n=Object.fromEntries(["importC\
atalog","importPackage","ensure","load","connect","connectBackend","dispose"].map(M=>[M,r[M].bind(r)])),s={},i=new Map,o=new Set,
a=new Map,c=new Map,l=new AbortController,u=YT(),d=new Set,h=new Map,p=new Set,m=new Map;let y=!0,g=!0,f=!1,b,w,E,v,_,k=null,
x=0,C=t(),I=Promise.resolve(),S={connected:!1,peerCount:0,sharedModelCount:0,hostedModelCount:0,errors:[],checkedAt:null};
const T=()=>{if(f)throw new Error("Model console is closed")},$=M=>M?AbortSignal.any([M,l.signal]):l.signal;function D(M){
const R=!M.model&&ru(M,Object.values(e));return r.getModelCompatibility?.(R||M)??{status:"unknown",reason:"Local memory \
fit is unverified."}}function G(M){const R=D(M);if(["checking","unavailable"].includes(R.status))throw Object.assign(new Error(
R.reason||"This model cannot load on this device"),{code:"ERR_MODEL_LOCAL_UNAVAILABLE",availability:R});return R}if(r.setMemoryBudgets){
const M=r.setMemoryBudgets.bind(r);r.setMemoryBudgets=R=>{if(T(),v||r.service.getStatus().status==="loading")throw new Error(
"Wait for the model import/load to finish before changing memory budgets");return M(R)}}function H(M,R){if(!R?.model?.runtime||
!R.model.repository)return null;const L=ru(R,Object.values(e));return{manifestCid:M,modelId:L?.id??M,name:L?.name??R.name??
R.model.repository,..._s(R.model),runtime:R.model.runtime,repository:R.model.repository,revision:R.model.revision,totalBytes:R.
files.reduce((V,F)=>V+F.size,0)}}async function Y(M){if(!M?.cid)throw new Error("Imported package has no content identit\
y");const R=H(M.cid,M.manifest??await r.store.getManifest(M.cid));return R&&i.set(M.cid,R),R}async function W(M){const R=await ZT(
r.store,{signal:M}),L=new Set;for(const V of R){if(V.status==="deleting"){d.add(V.cid);continue}V.pinned&&(L.add(V.cid),
await Y(V))}for(const V of i.keys())L.has(V)||i.delete(V);return R}function se(){const M=r.service.getStatus();return k&&
!d.has(k.manifestCid)&&M.status==="ready"&&M.manifestCid===k.manifestCid?k:null}const de=()=>(b?.listModels()??[]).map(M=>({
...M,..._s(M),providers:M.providers.filter(R=>!R.local)})).filter(M=>M.providers.length),Be=()=>(b?.listHosts()??[]).map(
M=>({...M,..._s(M),hosts:M.hosts.filter(R=>!R.local)})).filter(M=>M.hosts.length);function ze(M=[]){const R=r.networkManager,
L=!!R?.isConnected,V=new Set(L?R.peers?.keys()??[]:[]);for(const F of L?R.libp2p?.getConnections?.()??[]:[])F.status==="\
open"&&V.add(F.remotePeer.toString());V.delete(R?.libp2p?.peerId?.toString());for(const F of R?.bootstrapPeerIds??[])V.delete(
F);S={connected:L,peerCount:V.size,sharedModelCount:L?de().length:0,hostedModelCount:L?Be().length:0,checkedAt:t(),errors:(Array.
isArray(M)?M:[]).slice(0,Fn.maximumPeers).map(F=>({peerId:String(F?.peerId??"").slice(0,128),code:String(F?.code??"ERR_P\
EER_DISCOVERY").slice(0,80),message:String(F?.message??"Peer directory query failed").slice(0,256)}))}}function be(M){f||
_||(_=wt().catch(R=>{if(!f)for(const L of M?[M]:i.keys())a.set(L,R)}).finally(()=>{_=null}))}async function wt({strict:M=!1}={}){
const R=async()=>{if(f||!(r.artifactReady??r.networkReady))return;await W(l.signal);const L=new Set(r.networkManager.getPublishedArtifactCids()),
V=[];for(const F of o)if(!i.has(F))try{await r.withdraw(F),L.delete(F),o.delete(F),a.delete(F)}catch(K){a.set(F,K),V.push(
K)}for(const F of i.keys()){try{y&&!d.has(F)&&!L.has(F)&&(await r.publish(F),L.add(F)),(!y||d.has(F))&&L.has(F)&&(await r.
withdraw(F),L.delete(F)),a.delete(F)}catch(K){a.set(F,K),V.push(K)}L.has(F)?o.add(F):o.delete(F)}if(M&&V.length)throw new AggregateError(
V,"Some models could not update their file sharing state")};return I=I.catch(()=>{}).then(R),I}async function tr(M){const R=se();
if(!R)throw new Error("Import a model before using local inference");if(M.image&&!R.modalities.includes("image"))throw new Error(
"This model accepts text only");x++;const L=new AbortController,V=AbortSignal.any([$(M.signal),L.signal]),F={manifestCid:R.
manifestCid,abort:L};p.add(F);try{return F.promise=Promise.resolve(r.service.generate({...M,task:R.task,signal:V})),await F.
promise}finally{p.delete(F),--x===0&&(C=t())}}async function kt(){T();const M=r.networkManager;return M?.isConnected?(b?.
closed&&(await M.releasePeerInferenceService(s),b=null),b||(w||(w=M.createPeerInferenceService({owner:s,requestTimeoutMs:3e5,
getLocalState:()=>{const R=r.service.getStatus(),L=x>0||!!R.activeRequestId||R.queuedRequests>0,V=se(),F=[...i.values()].
filter(K=>o.has(K.manifestCid)&&!d.has(K.manifestCid));return V&&F.sort((K,we)=>+(we.manifestCid===V.manifestCid)-+(K.manifestCid===
V.manifestCid)),{sharedModels:y?F.slice(0,Fn.maximumModels):[],hostedModel:g&&!f?se():null,busy:L,queuedRequests:R.queuedRequests??
0,idleForMs:L?0:Math.max(0,t()-C)}},generate:async({manifestCid:R,...L})=>{if(!g||f||se()?.manifestCid!==R)throw new Error(
"Model is no longer hosted");return tr(L)}}).then(async R=>{if(f)throw await M.releasePeerInferenceService(s),new Error(
"Model console is closed");return b=R,await R.setHostingEnabled(g),R}).finally(()=>{w=null})),w)):null}async function ee(){
await kt(),be()}function Ee(M,R){T();const L=$(R);return u.run(()=>(T(),M(L)),{signal:L})}async function Ut(M,R,{deferSharing:L=!1}={}){
let V;try{V=await n[M](...R)}catch(F){throw wy(F)}return await Y(V),L||await wt(),V}function kr(M){be(M)}async function Et(M,R={}){
if(d.has(M))throw new Error("This model is being deleted; retry deletion before loading it");G(await r.store.getManifest(
M,{signal:R.signal})),m.has(M)||m.set(M,await r.store.acquireUse(M,{signal:R.signal}));let L;try{L=await n.load(M,R)}catch(V){
throw r.service.getStatus().manifestCid!==M&&await Ze(M),V}return k=await Y({cid:M}),C=t(),await kt(),L}async function ot(){
await b?.setHostingEnabled(!1),await r.service.unloadModel();for(const M of m.keys())await Ze(M);k=null,await b?.setHostingEnabled(
g)}async function Ze(M){const R=m.get(M);R&&(await R(),m.delete(M))}for(const M of["connect","connectBackend"])r[M]=async(...R)=>{
T();const L=await n[M](...R);return await ee(),L};for(const M of["importCatalog","importPackage"])r[M]=(...R)=>{const L=M===
"importPackage"?2:1;return Ee(V=>(R[L]={...R[L],signal:V},Ut(M,R)),R[L]?.signal)};return r.ensure=(M,R={})=>Ee(L=>Ut("en\
sure",[M,{...R,signal:L}]),R.signal),r.load=(M,R={})=>Ee(L=>Et(M,{...R,signal:L}),R.signal),Object.assign(r,{getPreferences:()=>({
sharing:y,hostInference:g}),getSharingErrors:()=>[...a].map(([M,R])=>({manifestCid:M,message:R.message})),getDiscoveryStatus:()=>structuredClone(
{...S,connected:!!r.networkManager?.isConnected}),listModelSources(){return[...Object.values(e).map(M=>({key:`hf:${M.id}`,
name:M.name,source:"hf",modelId:M.id,..._s(M.model),runtime:M.model.runtime,totalBytes:M.totalBytes,localAvailability:D(
M)})),...de().map(M=>({...M,key:`peer:${M.manifestCid}`,source:"peers",localAvailability:D(M)}))]},listInferenceTargets(){
const M=se();return[{key:"local",name:M?.name??"No model loaded",local:!0,available:!!M,busy:x>0,..._s(M??{}),providerCount:M?
1:0},...Be().map(R=>({...R,key:`peer:${R.manifestCid}`,local:!1,available:!0,busy:R.hosts.every(L=>L.busy),providerCount:R.
hosts.length}))]},async refreshPeers({signal:M}={}){return T(),E||(E=(async()=>{const R=$(M);try{R.throwIfAborted();const L=await kt();
R.throwIfAborted(),be();const V=L?await L.refresh({signal:R}):null;return R.throwIfAborted(),ze(V?.errors),{models:r.listModelSources(),
targets:r.listInferenceTargets(),discovery:r.getDiscoveryStatus()}}catch(L){throw!f&&!R.aborted&&ze([L]),L}})().finally(
()=>{E=null})),E},async setSharing(M){T();const R=y;y=!!M;try{await wt({strict:!0})}catch(L){throw y=R,L}return r.getPreferences()},
async setHostInference(M){return T(),g=!!M,await(await kt())?.setHostingEnabled(g),r.getPreferences()},async acquireModel(M,R={}){
if(T(),v)throw new Error("Another model import is already running");const L=r.listModelSources().find(F=>F.key===M);if(!L)
throw new Error("This model source is no longer available");const V=L.source==="hf"?e[L.modelId]:L;G(V),v=Ee(async F=>{G(
V);let K;if(L.source==="hf"){const me=[...i.values()].find(Mt=>Mt.modelId===L.modelId);K=me&&await r.store.stat(me.manifestCid,
{signal:F}),(!K||K.status!=="complete")&&(K=await Ut("importCatalog",[L.modelId,{...R,signal:F}],{deferSharing:!0}))}else
r.inspectPeerPackage&&G(await r.inspectPeerPackage(L.manifestCid,{signal:F})),F.throwIfAborted(),R.onProgress?.({stage:"\
download-peers"}),F.throwIfAborted(),K=await Ut("ensure",[L.manifestCid,{signal:F}],{deferSharing:!0});if(F.throwIfAborted(),
G(K.manifest??await r.store.getManifest(K.cid,{signal:F})),F.throwIfAborted(),se()?.manifestCid===K.cid)return kr(K.cid),
{...r.service.getStatus().evidence,manifestCid:K.cid};R.onProgress?.({stage:"unload"}),F.throwIfAborted(),await ot(),F.throwIfAborted(),
R.onProgress?.({stage:"load"}),F.throwIfAborted();const we=await Et(K.cid,{...R,signal:F});return kr(K.cid),we},R.signal);
try{return await v}finally{v=null}},unload(){return Ee(()=>ot())},async listStoredModels({signal:M}={}){T();const R=$(M),
L=await W(R),V=r.service.getStatus(),F=new Set(r.networkManager?.getPublishedArtifactCids?.()??[]);return L.map(K=>({manifestCid:K.
cid,name:H(K.cid,K.manifest)?.name??K.manifest.name??K.cid,totalBytes:K.manifest.files.reduce((we,me)=>we+me.size,0),runtime:K.
manifest.model.runtime,loaded:V.status!=="idle"&&V.manifestCid===K.cid,shared:F.has(K.cid),...K.status==="deleting"||d.has(
K.cid)?{cleanupPending:!0}:{},...a.has(K.cid)?{shareError:a.get(K.cid).message}:{}}))},deleteStoredModel(M,{signal:R}={}){
T();const L=ye(M).toString();if(h.has(L))return h.get(L);R?.throwIfAborted(),d.add(L);const V=Ee(F=>eM(r,async()=>{let K=!1;
const we=await r.store.stat(L,{signal:F});if(we&&(we.kind!=="manifest"||!we.manifest?.model?.runtime))throw d.delete(L),
new Error("Only stored model packages can be deleted here");try{await I.catch(()=>{}),r.networkManager?.getPublishedArtifactCids?.().
includes(L)&&await r.withdraw(L),o.delete(L);const me=r.service.getStatus();if(k?.manifestCid===L||me.manifestCid===L){await b?.
setHostingEnabled(!1);const Rt=[...p].filter(ke=>ke.manifestCid===L);for(const ke of Rt)ke.abort.abort(new DOMException(
"Stored model is being deleted","AbortError"));await Promise.allSettled(Rt.map(ke=>ke.promise)),await r.service.unloadModel(),
await Ze(L),k=null,K=!0}F.throwIfAborted();const Er=await r.store.remove(L,{signal:F});return i.delete(L),d.delete(L),a.
delete(L),await b?.setHostingEnabled(g),{deleted:Er.removed,freedBytes:Er.freedBytes,unloaded:K}}catch(me){throw await r.
store.stat(L).catch(()=>{})===void 0&&i.delete(L),await b?.setHostingEnabled(g).catch(()=>{}),me}},{signal:F}),R).finally(
()=>{h.delete(L)});return h.set(L,V),V},async generate(M,R={}){T();const L=R.requestId??crypto.randomUUID();if(c.has(L))
throw new Error("Duplicate inference request ID");const V=new AbortController,F=AbortSignal.any([$(R.signal),V.signal]),
K={abort:V,remote:M!=="local"};c.set(L,K);try{const we={...R,requestId:L,signal:F};if(M==="local")return await tr(we);const me=Be().
find(Mt=>`peer:${Mt.manifestCid}`===M);if(!me)throw new Error("No peer is currently hosting that model");if(R.image&&!me.
modalities.includes("image"))throw new Error("This model accepts text only");return await b.generate(me.manifestCid,{...we,
task:me.task})}finally{c.delete(L)}},async cancel(M){const R=c.get(M);return R?(R.abort.abort("User cancelled"),R.remote?
await b?.cancel(M):await r.service.cancel(M),!0):!1}}),r.dispose=async()=>{f=!0,g=!1,k=null,l.abort("Model console close\
d");for(const M of c.values())M.abort.abort("Model console closed");await w?.catch(()=>{}),await r.networkManager?.releasePeerInferenceService(
s),b=null,await Promise.allSettled([I,_,E,v,u.settled()].filter(Boolean)),await n.dispose();for(const M of m.keys())await Ze(
M)},{async initialize(){await r.checkDeviceCapabilities?.(),await W(l.signal),r.networkManager?.isConnected&&await ee()}}}
function cr(r){r?.throwIfAborted()}function Vi(r,e){return cr(e),e?new Promise((t,n)=>{const s=()=>n(e.reason);e.addEventListener(
"abort",s,{once:!0}),r.then(t,n).finally(()=>e.removeEventListener("abort",s))}):r}function YM({store:r,manager:e=null,createManager:t,
stopArtifacts:n=s=>s._stopArtifactTransport()}={}){let s=e,i=null,o=null,a=null,c=null,l=null,u="offline",d=null,h=!1;const p=new Set,
m=new AbortController;function y(){if(h)throw new Error("Model network connection is disposed")}function g(){const x=s?.
getArtifactTransport?.();return x?.store===r&&!x.requiresCleanup?x:null}function f(){return!h&&!!s?.isConnected&&u==="re\
ady"&&!!g()}async function b(){const x=d;if(!x)return;const C=x.manager.getArtifactTransport?.();C&&C===x.transport&&await n(
x.manager),d===x&&(d=null)}function w(){if(y(),!s?.isConnected)return Promise.resolve(null);if(o)return o;if(g())return u=
"ready",l=null,Promise.resolve(g());const x=s;u="starting",l=null;const C=(async()=>{try{if(x.artifactStopping&&await x.
artifactStopping,h||!x.isConnected)return null;d?.manager===x&&x.getArtifactTransport?.()?.requiresCleanup&&await b();const S=x.
getArtifactTransport?.()||x.artifactStarting?null:{manager:x,transport:null};S&&(d=S);let T;try{T=await x.createArtifactTransport(
r)}finally{S&&(S.transport=x.getArtifactTransport?.()??null,!S.transport&&d===S&&(d=null))}if(T?.store!==r||T.requiresCleanup)
throw new Error("Artifact transport is not ready for this model library");return!h&&s===x&&x.isConnected&&(u="ready"),T}catch(I){
return h||(l=I,u="error"),null}finally{(h||!x.isConnected)&&(u="offline")}})();return o=C,C.then(()=>{o===C&&(o=null)}),
C}async function E(x){await x.disconnect(),p.delete(x),s===x&&(s=null),d?.manager===x&&(d=null)}function v(x,{signal:C}={}){
if(y(),cr(C),s?.isConnected)return w(),Promise.resolve(f()?g():null);if(i)return Vi(i,C);const I=C?AbortSignal.any([C,m.
signal]):m.signal;c=null;const S=(async()=>{let T=s;try{for(const $ of p)$!==s&&await E($);if(cr(I),!T){const $=typeof x==
"function"?await x({signal:I}):x;cr(I),T=await t($),p.add(T),cr(I)}return T.libp2p||await T.initialize(),cr(I),await T.connect(),
cr(I),s=T,c=null,w(),f()?g():null}catch($){if(T&&p.has(T))try{await E(T)}catch(D){$=new AggregateError([$,D],"Applicatio\
n connection failed and its cleanup must be retried",{cause:$})}throw h||(c=$),$}})();return i=S,S.then(()=>{i===S&&(i=null)},
()=>{i===S&&(i=null)}),Vi(S,C)}async function _({signal:x}={}){if(y(),cr(x),!s?.isConnected)throw new Error("Connect the\
 network before transferring model files");if(o?await Vi(o,x):u==="offline"&&await Vi(w(),x),cr(x),y(),!f())throw l??new Error(
"Model file sharing is unavailable; use Connect to retry");return g()}function k(){if(a)return a;h=!0,m.abort(new DOMException(
"Model network connection disposed","AbortError")),u="offline";const x=(async()=>{await i?.catch(()=>{}),await o;const C=[];
for(const I of p)try{await E(I)}catch(S){C.push(S)}if(d&&!p.has(d.manager))try{await b()}catch(I){C.push(I)}if(C.length)
throw new AggregateError(C,"Model network cleanup failed; retry closing the console")})();return a=x,x.then(()=>{a===x&&
(a=null)},()=>{a===x&&(a=null)}),x}return{connect:v,startArtifacts:w,requireArtifacts:_,dispose:k,get manager(){return s},
get networkReady(){return!h&&!!s?.isConnected},get artifactReady(){return f()},get error(){return c??l},getArtifactNetworkStatus(){
const x=h||!s?.isConnected?"offline":u;return{status:x,error:x==="error"?String(l?.message??l).slice(0,1024):null}}}}const ZM=""+
new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.url).href,eR=""+new URL("ort-wasm-simd-threaded.asyn\
cify-DXIbolS2.mjs",import.meta.url).href,tR=""+new URL("wllama-DrYkKwf9.wasm",import.meta.url).href,rR=""+new URL("ort-w\
asm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,nR=""+new URL("ort-wasm-simd-threaded.jsep-CdNSU0KB.mjs",import.meta.
url).href,Ip=Object.freeze({...Ua,...dd,...Fa,...Oa});function sR(r){if(r){const e=new URL(r,location.href);return{mjs:new URL(
"ort-wasm-simd-threaded.asyncify.mjs",e).href,wasm:new URL("ort-wasm-simd-threaded.asyncify.wasm",e).href}}return{mjs:new URL(
eR,location.href).href,wasm:new URL(ZM,location.href).href}}function iR(){return{wasm:new URL(tR,location.href).href}}function oR(){
return{mjs:new URL(nR,location.href).href,wasm:new URL(rR,location.href).href}}async function Cp(){const{validateGgufCapabilities:r}=await mt(
async()=>{const{validateGgufCapabilities:e}=await import("./runtimeDefinition-DM2y_sju.js");return{validateGgufCapabilities:e}},
__vite__mapDeps([2,3]),import.meta.url);return r()}async function aR({stateManager:r,computeManager:e,networkManager:t,storeName:n="\
inference-models",runtimeBaseUrl:s,collectGpuEvidence:i=!1,memoryBudgets:o,probeDeviceCapabilities:a=HT,ggufRuntimeOptions:c={
n_ctx:2048,n_batch:64,n_gpu_layers:99999,n_threads:1}}={}){let l=nu(o),u=null,d;const h=!r,p=!e,m=r??new P5(t??null,{enablePersistence:!1,
disableNetworkProvider:!0,disableBroadcast:!0}),y=e??new iT({requireWorkers:!0,enableWorkers:!0,enableWebGPU:!0,minWorkers:1,
targetWorkers:1,maxWorkers:1,autoScaleWorkers:!1,workerBootstrapTimeoutMs:6e4}),f=t?.getArtifactTransport?.()?.store??m.
getArtifactStore(n),b=f??m.createArtifactStore({name:n,capacity:"browser",maximumTraversalBlocks:131072});let w,E,v,_;const k=YM(
{store:b,manager:t,async createManager(S){const{NetworkManager:T}=await mt(async()=>{const{NetworkManager:$}=await import("./NetworkManager-BzVEnr0X.js").
then(D=>D.U);return{NetworkManager:$}},__vite__mapDeps([7,3]),import.meta.url);return new T(S)}});try{await b.open();const S=12*
1024**3,T=16*1024**3;w=await y.createModelInferenceService({artifactStore:b,resourceBudgets:{cpu:{units:1,memoryBytes:S},
gpu:{units:1,memoryBytes:T}},resourceEstimate:lo,runtimeAssets:sR(s),collectGpuEvidence:i,generationTimeoutMs:3e5}),E=await x(
c),v=await y.createModelInferenceService({artifactStore:b,runtime:"onnx-diffusion",runtimeAssets:oR(),runtimeOptions:{},
collectGpuEvidence:i,resourceEstimate:lo,loadTimeoutMs:3e5,generationTimeoutMs:3e5}),_=w,k.networkReady&&k.startArtifacts()}catch(S){
throw await v?.dispose().catch(()=>{}),await E?.dispose().catch(()=>{}),await w?.dispose().catch(()=>{}),p&&await y.destroy().
catch(()=>{}),h?await m.destroy().catch(()=>{}):f||await b.destroy().catch(()=>{}),S}async function x(S){return y.createModelInferenceService(
{artifactStore:b,runtime:"llama.cpp",runtimeAssets:iR(),runtimeOptions:S,collectGpuEvidence:i,resourceEstimate:lo,loadTimeoutMs:30*
6e4,generationTimeoutMs:3e5})}const C={stateManager:m,computeManager:y,store:b,get service(){return _},get services(){return{
onnx:w,gguf:E,diffusion:v}},getDeviceCapabilities:()=>u,async checkDeviceCapabilities(){return d??=Promise.resolve().then(
()=>a()).then(S=>(u=S,S)),d},getMemoryBudgets:()=>({...l}),setMemoryBudgets(S){return l=nu(S),{...l}},getModelCompatibility(S){
const T=y.resourceBroker?.reportPressure().pools,$={...l};for(const[D,G]of[["cpuBytes","cpu"],["gpuBytes","gpu"]]){const H=T?.[G]?.
memoryBytes;Number.isSafeInteger(H)&&H>0&&($[D]=Math.min($[D]??H,H))}return QT(S,{device:u,budgets:$})},async inspectPeerPackage(S,{
signal:T}={}){const $=ye(S);if($.code!==85)throw new Error("Model packages require a manifest CID");try{return await b.getManifest(
$.toString(),{signal:T})}catch(H){if(T?.throwIfAborted(),!k.networkReady)throw H}await k.requireArtifacts({signal:T});const D=await k.
manager.fetchArtifactBlock($.toString(),{artifactCid:$.toString(),signal:T});if(T?.throwIfAborted(),!(D instanceof Uint8Array)||
D.byteLength>rn)throw new Error("Peer model manifest exceeds its metadata budget");if(!NT(D).every((H,Y)=>H===$.multihash.
digest[Y]))throw new Error("Peer model manifest CID mismatch");return Kl(D)},checkGgufCapabilities:Cp,get networkManager(){
return k.manager},get networkReady(){return k.networkReady},get artifactReady(){return k.artifactReady},get networkError(){
return k.error},getArtifactNetworkStatus:()=>k.getArtifactNetworkStatus(),async connectBackend(S={}){return k.connect(({
signal:T})=>rM({...S,signal:T}),S)},async connect(S,{signal:T}={}){return T?.throwIfAborted(),k.connect(()=>{if(typeof S!=
"string"||S.length>1024||!/^\/(?:dns4|dns6|ip4|ip6)\//.test(S)||!S.includes("/p2p/"))throw new Error("Enter a relay mult\
iaddress including its peer ID");return{bootstrapPeers:[S]}},{signal:T})},async importCatalog(S,T={}){const $=Ip[S];if(!$)
throw new Error("Unknown approved model");const D=Ua[S]?aT:Fa[S]?fT:Oa[S]?mT:lT;return kp(b,{schema:"peercompute.artifac\
t.manifest.v1",name:$.name,files:$.files,model:$.model,provenance:{...$.provenance,license:$.license}},G=>D(S,G),T)},async importPackage(S,T,{
expectedCid:$,...D}={}){S=Na(S);const G=new URL(T,location.href);if(G.origin!==location.origin)throw new Error("Fixture \
package source must be same-origin");const H=await kp(b,S,Y=>new URL(Y.split("/").map(encodeURIComponent).join("/"),G).href,
D);if($&&H.cid!==$)throw new Error("Package manifest CID changed during import");return H},async load(S,{ggufGpuLayers:T,
...$}={}){const D=await b.getManifest(S,{signal:$.signal}),G=D.model?.runtime==="llama.cpp",H=D.model?.runtime==="onnx-d\
iffusion";if(!G&&!H&&D.model?.runtime!=="transformers.js")throw new Error("This package can be stored and hosted, but it\
s model runtime is unavailable in this browser demo");if([w,E,v].some(Y=>Y.getStatus().status!=="idle"))throw new Error(
"Unload the resident model before loading another package");if(G&&(await Cp(),T!==void 0)){if(!Number.isSafeInteger(T)||
T<1||T>99999)throw new Error("GGUF GPU layers must be between 1 and 99999 (all layers)");const Y=await x({...c,n_gpu_layers:T});
try{await E.dispose()}catch(W){throw await Y.dispose(),W}E=Y}return _=G?E:H?v:w,_.loadModel({manifestCid:S,...$})},async ensure(S,T={}){
return await k.requireArtifacts(T),b.ensureLocal(S,{...T,fetchBlock:($,D)=>k.manager.fetchArtifactBlock($,{...D,artifactCid:S})})},
async publish(S){return await k.requireArtifacts(),k.manager.announceArtifact(S)},async withdraw(S){return await k.requireArtifacts(),
k.manager.withdrawArtifact(S)},async dispose(){await v.dispose(),await E.dispose(),await w.dispose(),await k.dispose(),p&&
await y.destroy(),h&&await m.destroy()}},I=XM(C,{catalog:Ip});try{await I.initialize()}catch(S){throw await C.dispose(),
S}return C}const j=(r,e,t)=>{const n=document.createElement(r);return e!==void 0&&(n.textContent=e),t&&(n.className=t),n},
tt=(r,e)=>{const t=j("button",r);return t.type="button",e&&t.setAttribute("aria-label",e),t},Lr=(r,e)=>{const t=j("label",
r);return t.append(e),t};function Zc(r){const e=j("dialog",void 0,"pc-model-dialog"),t=j("h2",r);t.id=`model-dialog-${crypto.
randomUUID()}`,e.setAttribute("aria-labelledby",t.id);const n=tt("Done");n.autofocus=!0,n.onclick=()=>e.close();const s=j(
"div",void 0,"pc-dialog-header");s.append(t,n);const i=j("div",void 0,"pc-dialog-body"),o=j("p","","pc-inference-status");
return o.setAttribute("role","status"),e.append(s,i,o),e.addEventListener("keydown",a=>{if(a.key!=="Tab")return;const c=[
...e.querySelectorAll("button,input,select,textarea,a[href],[tabindex]")].filter(d=>!d.disabled&&d.tabIndex>=0&&d.getClientRects().
length),l=c[0],u=c.at(-1);(a.shiftKey&&document.activeElement===l||!a.shiftKey&&document.activeElement===u)&&(a.preventDefault(),
(a.shiftKey?u:l)?.focus())}),{element:e,body:i,status:o}}function fo(r){return r>=1024**3?`${(r/1024**3).toFixed(2)} GiB`:
r>=1024**2?`${(r/1024**2).toFixed(1)} MiB`:`${Math.ceil(r/1024)} KiB`}function cR(r){const e=j("section",void 0,"pc-infe\
rence-panel");e.setAttribute("aria-label","Model chat");const t=j("input");t.type="search",t.placeholder="Filter models",
t.setAttribute("aria-label","Filter models"),t.maxLength=256;const n=j("select");n.setAttribute("aria-label","Model and \
source");const s=tt("Import Model"),i=tt("Stored Models"),o=tt("Config","Configure model chat"),a=Zc("Config"),c=Zc("Sto\
red Models"),l=Zc("Model setup"),u=a.element,d=c.element,h=l.element,p=j("strong"),m=j("p","","pc-inference-note"),y=j("\
select"),g=j("select");y.setAttribute("aria-label","Browser"),g.setAttribute("aria-label","Operating system");for(const[
ke,at]of[["chrome","Chrome"],["chromium","Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Firefox"],["safari","\
Safari"],["other","Other browser"]]){const Ft=j("option",at);Ft.value=ke,y.append(Ft)}for(const[ke,at]of[["linux","Linux"],
["windows","Windows"],["macos","macOS"],["android","Android"],["ios","iOS / iPadOS"],["other","Other system"]]){const Ft=j(
"option",at);Ft.value=ke,g.append(Ft)}const f=j("div",void 0,"pc-config-grid");f.append(Lr("Browser",y),Lr("Operating sy\
stem",g));const b=j("div",void 0,"pc-model-help-details"),w=j("textarea");w.readOnly=!0,w.rows=3,w.setAttribute("aria-la\
bel","Browser launch command"),w.spellcheck=!1;const E=tt("Copy command"),v=tt("Open Config"),_=j("div",void 0,"pc-model\
-help-command");_.append(w,E),l.body.append(p,m,f,j("p","Browser detection is approximate. Adjust these choices if neede\
d.","pc-inference-note"),b,_,v);for(const[ke,at]of[[o,u],[i,d]])at.id=`model-window-${crypto.randomUUID()}`,ke.setAttribute(
"aria-controls",at.id),ke.setAttribute("aria-haspopup","dialog");const k=j("div",void 0,"pc-model-toolbar");k.append(t,n,
s,i,o),e.append(k);const x=j("p","","pc-model-availability");x.setAttribute("aria-live","polite"),x.id=`model-availabili\
ty-${crypto.randomUUID()}`,n.setAttribute("aria-describedby",x.id),e.append(x);const C=j("p","Connecting to peer network\
…","pc-network-summary");C.setAttribute("aria-live","polite"),e.append(C);const I=j("input");I.type="checkbox",I.checked=
!0;const S=j("input");S.type="checkbox",S.checked=!0;const T=j("div",void 0,"pc-model-preferences"),$=Lr("Share with pee\
rs",I);$.prepend(I),$.title="Share imported model files with connected peers while this browser stays online.";const D=Lr(
"Host inference",S);D.prepend(S),D.title="Allow connected peers to send requests to the model loaded on this device.",T.
append($,D),a.body.append(T);const G=j("p","Opening model chat…","pc-inference-status");G.setAttribute("role","status"),
e.append(G);const H=j("input");H.type="number",H.min="1",H.max="99999",H.value="99999",H.setAttribute("aria-label","GGUF\
 GPU layer limit");const Y=j("div",void 0,"pc-config-grid"),W=j("input"),se=j("input");for(const ke of[W,se])ke.type="nu\
mber",ke.min="0",ke.max="1024",ke.step="any",ke.placeholder="Auto";Y.append(Lr("Model RAM budget (GiB)",W),Lr("Model GPU\
 memory budget (GiB)",se));const de=j("p","","pc-inference-note");a.body.append(Y,de);const Be=j("div",void 0,"pc-config\
-grid");Be.append(Lr("GGUF GPU layers",H)),a.body.append(Be),a.body.append(j("p","99999 uses all GPU layers. The 27B mod\
el was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.","pc-inference-note"));const ze=j("in\
put");ze.placeholder="Optional relay multiaddress",ze.setAttribute("aria-label","Artifact relay multiaddress");const be=tt(
"Connect"),wt=j("div",void 0,"pc-config-row");wt.append(ze,be),a.body.append(wt);const tr=j("p","","pc-inference-note");
a.body.append(tr);const kt=j("input");kt.type="file",kt.setAttribute("aria-label","Pin a file locally"),a.body.append(Lr(
"Pin a file locally",kt));const ee=tt("Unload local model");a.body.append(ee);const Ee=tt("Clear conversation");a.body.append(
Ee),a.body.append(j("p","Clear chat history to start a new conversation while keeping the loaded model and stored files.",
"pc-inference-note")),c.body.append(j("p","Delete removes a model from this device and unloads it if needed. Files used \
by other stored models or pinned separately are kept.","pc-inference-note"));const Ut=j("ul",void 0,"pc-stored-models");
Ut.setAttribute("aria-label","Stored model packages");const kr=tt("Refresh");c.body.append(Ut,kr);const Et=j("div",void 0,
"pc-inference-transcript");Et.setAttribute("role","log"),Et.setAttribute("aria-label","Conversation"),Et.setAttribute("a\
ria-live","polite");const ot=j("p","Import a model or choose an available peer to start chatting.","pc-chat-empty");Et.append(
ot),e.append(Et);const Ze=j("div",void 0,"pc-inference-actions");e.append(Ze);const M=j("div",void 0,"pc-chat-attachment");
M.hidden=!0;const R=j("img");R.alt="Selected image";const L=j("span"),V=tt("×","Remove attached image");M.append(R,L,V),
e.append(M);const F=j("textarea");F.rows=2,F.maxLength=16e3,F.placeholder="Message…",F.setAttribute("aria-label","Mess\
age"),e.append(F);const K=j("select");K.setAttribute("aria-label","Chat target");const we=tt("+","Attach image");we.title=
"Attach an image";const me=j("input");me.type="file",me.accept="image/png,image/jpeg,image/webp,image/gif",me.hidden=!0,
me.setAttribute("aria-label","Choose image attachment");const Mt=tt("Send"),Er=tt("Stop");Er.hidden=!0;const Rt=j("div",
void 0,"pc-chat-controls");return Rt.append(K,we,me,Mt,Er),e.append(Rt),e.append(u,d,h),r.append(e),{panel:e,sourceFilter:t,
source:n,sourceStatus:x,discoveryStatus:C,acquire:s,stored:i,configure:o,sharing:I,hosting:S,status:G,configuration:u,configurationStatus:a.
status,storedModels:d,storedList:Ut,storedRefresh:kr,storedStatus:c.status,gpuLayers:H,compatibility:h,helpModel:p,helpReason:m,
helpBrowser:y,helpOs:g,helpDetails:b,helpCommandGroup:_,helpCommand:w,helpCopy:E,helpConfig:v,helpStatus:l.status,cpuBudget:W,
gpuBudget:se,memoryNote:de,relay:ze,connect:be,networkStatus:tr,file:kt,unload:ee,clearChat:Ee,transcript:Et,empty:ot,proposed:Ze,
attachment:M,attachmentImage:R,attachmentName:L,removeAttachment:V,prompt:F,target:K,attach:we,imageFile:me,send:Mt,cancel:Er}}
function lR(r,e){r.helpModel.textContent=e.name,r.helpReason.textContent=e.reason,r.helpDetails.replaceChildren();for(const t of e.
paragraphs)r.helpDetails.append(j("p",t,"pc-inference-note"));if(e.steps.length){const t=j("ol");for(const n of e.steps)
t.append(j("li",n));r.helpDetails.append(t)}for(const t of e.links){const n=j("a",t.label);n.href=t.url,n.target="_blank",
n.rel="noopener noreferrer";const s=j("p",void 0,"pc-inference-note");s.append(n),r.helpDetails.append(s)}r.helpCommand.
value=e.command??"",r.helpCommandGroup.hidden=!e.command,r.helpConfig.hidden=!e.openConfig,r.helpStatus.textContent=""}function uR(r,e,t){
r.storedList.replaceChildren(),e.length||r.storedList.append(j("li","No models stored on this device.","pc-stored-empty"));
for(const n of e){const s=j("li",void 0,"pc-stored-model"),i=j("div");i.append(j("strong",n.name));const o=[fo(n.totalBytes),
...n.loaded?["Loaded"]:[],...n.shared?["Shared"]:[],...n.cleanupPending?["Cleanup pending"]:[]];i.append(j("p",o.join(" \
· "),"pc-inference-note")),n.shareError&&i.append(j("p",`Sharing unavailable: ${String(n.shareError).slice(0,256)}`,"pc\
-inference-note"));const a=n.cleanupPending?"Retry delete":"Delete",c=tt(a,`${a} ${n.name}`);c.className="pc-delete-mode\
l",c.onclick=()=>t(n),s.append(i,c),r.storedList.append(s)}}function Tp(r,e,t,{image:n,targetName:s}={}){r.empty.remove();
const i=j("article",void 0,`pc-chat-message pc-chat-message-${e}`);if(i.append(j("span",e==="user"?"YOU":s||"MODEL","pc-\
chat-speaker")),n){const a=j("img");a.src=n,a.alt="Attached image",a.className="pc-chat-image",i.append(a)}const o=j("p",
t);return i.append(o),r.transcript.append(i),o}const Mp=Object.freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"\
Microsoft Edge",brave:"Brave",firefox:"Firefox",safari:"Safari",other:"Other browser"}),Rp=Object.freeze({linux:"Linux",
windows:"Windows",macos:"macOS",android:"Android",ios:"iOS / iPadOS",other:"Other operating system"}),Bp=Object.freeze({
chrome:"google-chrome --enable-dawn-features=vulkan_enable_f16_on_nvidia",chromium:"chromium --enable-dawn-features=vulk\
an_enable_f16_on_nvidia",edge:"microsoft-edge --enable-dawn-features=vulkan_enable_f16_on_nvidia",brave:"brave-browser -\
-enable-dawn-features=vulkan_enable_f16_on_nvidia"}),dR="https://www.chromium.org/developers/how-tos/run-chromium-with-f\
lags/",hR="https://github.com/google/dawn/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f";function Yr(r,e,t=""){return typeof r!=
"string"?t:r.slice(0,e).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g," ").trim()||t}function Lp(r,e){
return typeof r=="string"&&Object.hasOwn(e,r)?r:"other"}function Ty(r=globalThis.navigator){const e=r??{},t=Yr(e.userAgent,
4096),n=Yr(e.userAgentData?.platform,80)||Yr(e.platform,80),s=Array.isArray(e.userAgentData?.brands)?e.userAgentData.brands.
slice(0,16).map(a=>Yr(a?.brand,80)).join(" "):"";let i="other";/iPhone|iPad|iPod|\biOS\b/i.test(`${n} ${t}`)||/Mac/i.test(
`${n} ${t}`)&&e.maxTouchPoints>1?i="ios":/Android/i.test(`${n} ${t}`)?i="android":/Windows|Win32|Win64/i.test(n)?i="wind\
ows":/macOS|Mac/i.test(n)?i="macos":/Linux/i.test(n)?i="linux":/Windows/i.test(t)?i="windows":/Macintosh|Mac OS X/i.test(
t)?i="macos":/Linux|X11/i.test(t)&&(i="linux");let o="other";return/Brave/i.test(s)||/Brave\//i.test(t)||typeof e.brave?.
isBrave=="function"?o="brave":/Microsoft Edge/i.test(s)||/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(t)?o="edge":/Firefox/i.test(
s)||/(?:Firefox|FxiOS)\//i.test(t)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.test(t)?o="other":/Google Chrome/i.
test(s)||/CriOS\//i.test(t)?o="chrome":/Chromium\//i.test(t)?o="chromium":/Chrome\//i.test(t)?o="chrome":/Chromium/i.test(
s)?o="chromium":/Safari\//i.test(t)&&/Version\//i.test(t)&&(o="safari"),{browser:o,os:i}}function fR(r,{environment:e=Ty()}={}){
const t=r?.localAvailability??{},n=Yr(t.code,100),s=Lp(e?.browser,Mp),i=Lp(e?.os,Rp),o={name:Yr(r?.name,180,"Selected mo\
del"),reason:Yr(t.reason,500,"Compatibility has not been fully verified."),environmentLabel:`${Mp[s]} on ${Rp[i]}`,paragraphs:[],
steps:[],command:null,commandLabel:"",links:[],openConfig:!1};return t.status==="checking"||n==="device_checking"?(o.paragraphs.
push("The browser capability check is still running. This does not mean the model is unsupported."),o.steps.push("Wait f\
or the check to finish. If it remains pending, reload the page and check again.")):n==="cpu_budget_exceeded"||n==="gpu_b\
udget_exceeded"?(o.openConfig=!0,o.paragraphs.push("The model reservation exceeds a configured memory budget. This budge\
t is an admission limit, not a measurement of free RAM or GPU memory."),o.steps.push("Open Config and review the RAM and\
 GPU memory budgets. Raise or clear an optional limit only when appropriate for your device.","A shared compute pool may\
 impose its own limit. Choose a smaller model or a peer-hosted model if that limit still applies.")):n==="gpu_feature_un\
available"&&/\bshader-f16\b/i.test(o.reason)?(o.paragraphs.push("This browser does not expose the shader-f16 feature req\
uired by this model runtime. GPU memory capacity alone does not establish FP16 support."),i==="linux"&&Object.hasOwn(Bp,
s)?(o.command=Bp[s],o.commandLabel="Optional Linux NVIDIA / Vulkan launch command",o.paragraphs.push("If this Linux mach\
ine uses an NVIDIA GPU with the Chromium Vulkan backend, the optional command below may expose FP16. It is specific to t\
hat backend and driver combination.","This switch overrides a driver-related restriction. Older drivers may produce inco\
rrect results or instability; exposing the feature does not guarantee correct execution."),o.steps.push("Try the launch \
command below first. Save your work and fully exit this browser, including background processes, then run the command us\
ing your usual browser profile; do not clear site data or create a temporary profile.",`Open ${s==="edge"?"edge":"chrome"}\
://version and confirm the Command Line includes --enable-dawn-features=vulkan_enable_f16_on_nvidia. Then return to the \
original PeerCompute site address so its stored models remain available.`,"If the feature is still missing, update the b\
rowser and supported graphics driver, then check this model again.","If results are unstable, fully exit and launch norm\
ally without the switch. Choose an available model or a peer-hosted model.")):(o.paragraphs.push("There is no verified l\
aunch command here for this browser and operating system. Browser and driver support can vary."),o.steps.push("Update th\
e browser and supported graphics driver, then check this model again.","Use a current compatible browser that exposes th\
e required feature, or choose an available model or a peer-hosted model.")),o.links.push({label:"Chromium command-line i\
nstructions",url:dR},{label:"Dawn NVIDIA FP16 driver restriction",url:hR})):n==="gpu_feature_unavailable"?(o.paragraphs.
push("The browser lacks a GPU feature required by this model. Support depends on the browser, GPU and driver."),o.steps.
push("Update the browser and graphics driver, then recheck. Use an available model or a peer-hosted model if the feature\
 remains unavailable.")):n==="webgpu_unavailable"?(o.paragraphs.push("The browser did not provide a supported hardware W\
ebGPU adapter. This check does not measure the GPU’s memory capacity."),o.steps.push("Use the HTTPS site in an up-to-d\
ate WebGPU-capable browser. Check hardware acceleration and supported graphics drivers.","Restart the browser and retry,\
 or use a peer-hosted model.")):n==="gguf_crossOriginIsolated_unavailable"||n==="gguf_sharedArrayBuffer_unavailable"?(o.
paragraphs.push("This GGUF runtime needs cross-origin isolation and SharedArrayBuffer. HTTPS alone does not enable isola\
tion."),o.steps.push("Use the deployed HTTPS site. The site owner must send Cross-Origin-Opener-Policy: same-origin and \
Cross-Origin-Embedder-Policy: require-corp, with compatible headers on required resources.","Reload after the hosting co\
nfiguration is corrected. Otherwise choose an available model or a peer-hosted model; do not disable browser security.")):
n==="gguf_jspi_unavailable"||n==="gguf_memory64_unavailable"?(o.paragraphs.push("This GGUF runtime needs WebAssembly JSP\
I and shared memory64 support. The required capability was not detected in this browser."),o.steps.push("Update to a bro\
wser version that supports these runtime prerequisites and recheck.","If support is still missing, choose an available O\
NNX model or a peer-hosted model.")):["runtime_unsupported","catalog_unsupported","model_invalid","package_too_large","f\
ile_too_large"].includes(n)?(o.paragraphs.push("The package or its runtime does not meet this application’s supported mo\
del layout or loader limits. A browser launch switch will not fix that mismatch."),o.steps.push("Choose an approved mode\
l package supported by the local runtime, or select a compatible peer-hosted model.")):n==="device_probe_unknown"?(o.paragraphs.
push("The capability check did not finish or could not verify all prerequisites. This is not confirmation that the devic\
e is unsupported."),o.steps.push("Retry the check by reloading the page. Keep the browser up to date, or choose a peer-h\
osted model.")):n==="model_metadata_unverified"?(o.paragraphs.push("The advertised model still needs its package metadat\
a verified before local loading. Its name alone does not establish compatibility."),o.steps.push("Inspect the model pack\
age and allow its manifest to be verified before downloading weights.")):(o.paragraphs.push(n==="memory_fit_unverified"?
"Required browser features are supported, but free physical RAM and GPU memory are not reliably available to this check.\
 A successful check does not guarantee that the model will fit.":"Compatibility depends on the model runtime, browser fe\
atures and available memory. This check cannot guarantee successful loading."),o.steps.push("Choose a smaller available \
model or a peer-hosted model if local loading fails.")),o}const pR=new Set(["image/png","image/jpeg","image/webp","image\
/gif"]);async function mR(r,{signal:e}={}){if(!r||!pR.has(r.type))throw new Error("Choose a PNG, JPEG, WebP or GIF image");
if(r.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");e?.throwIfAborted();const t=await createImageBitmap(
r);try{if(e?.throwIfAborted(),!t.width||!t.height||t.width*t.height>32*1024**2)throw new Error("Choose an image smaller \
than 32 megapixels");const n=Math.min(1,512/Math.max(t.width,t.height)),s=document.createElement("canvas");s.width=Math.
max(1,Math.round(t.width*n)),s.height=Math.max(1,Math.round(t.height*n));const i=s.getContext("2d",{willReadFrequently:!0});
if(!i)throw new Error("Image decoding is unavailable");i.drawImage(t,0,0,s.width,s.height);const o=i.getImageData(0,0,s.
width,s.height),a=document.createElement("canvas"),c=Math.min(1,96/Math.max(s.width,s.height));return a.width=Math.max(1,
Math.round(s.width*c)),a.height=Math.max(1,Math.round(s.height*c)),a.getContext("2d").drawImage(s,0,0,a.width,a.height),
{name:r.name.slice(0,160),preview:a.toDataURL("image/webp",.8),image:{data:new Uint8Array(o.data),width:s.width,height:s.
height,channels:4}}}finally{t.close()}}const Dp=1024*1024,gR=6,bR=24*1024*1024,Pp=r=>{if(r?.aborted)throw new DOMException(
"Image generation cancelled","AbortError")};function yR(r){const e=new Map;let t=0,n=!1;function s(o,{expired:a=!1}={}){
const c=e.get(o);if(c)if(URL.revokeObjectURL(c.url),t-=c.bytes,e.delete(o),a&&r.contains(o)){const l=document.createElement(
"p");l.className="pc-inference-note",l.textContent="Earlier image preview released.",o.replaceWith(l)}else o.removeAttribute(
"src")}function i(){for(const o of e.keys())r.contains(o)||s(o);for(;e.size>gR||t>bR;)s(e.keys().next().value,{expired:!0})}
return{async append(o,a,{signal:c,prompt:l=""}={}){if(Pp(c),n)throw new Error("Conversation image renderer is closed");const{
width:u,height:d,channels:h,data:p}=a??{};if(!Number.isSafeInteger(u)||!Number.isSafeInteger(d)||u<1||d<1||u*d>Dp||h!==4||
!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||p.byteLength!==u*d*4)throw new Error("Generated image must c\
ontain bounded RGBA pixels");const m=new OffscreenCanvas(u,d),y=m.getContext("2d");if(!y)throw new Error("Image preview \
encoding is unavailable");y.putImageData(new ImageData(new Uint8ClampedArray(p),u,d),0,0);const g=await m.convertToBlob(
{type:"image/png"});if(Pp(c),n||!r.contains(o))throw new DOMException("Conversation closed","AbortError");if(g.type!=="i\
mage/png"||g.size>Dp*4+65536)throw new Error("Generated image preview exceeds its byte budget");const f=document.createElement(
"img");f.className="pc-generated-image",f.width=u,f.height=d,f.alt=l?`Generated image: ${l.slice(0,160)}`:"Generated ima\
ge";const b=URL.createObjectURL(g);return f.src=b,e.set(f,{url:b,bytes:g.size}),t+=g.size,o.after(f),i(),f},prune:i,dispose(){
n=!0;for(const o of e.keys())s(o)}}}async function wR({container:r=document.body,stateManager:e,computeManager:t,networkManager:n,
getContext:s,actions:i,runtimeBaseUrl:o,onClose:a,autoConnect:c=!1,runtimeFactory:l=aR,refreshIntervalMs:u=5e3}={}){const d=cR(
r),h=yR(d.transcript),p=new TextEncoder,m=new Map,y=new Set;let g,f,b,w,E,v,_=!1,k=!1,x=!1,C,I,S,T,$,D,G,H,Y,W=[],se=[],
de,Be,ze=0,be,wt,tr,kt;const ee=()=>!k&&!x,Ee=B=>["checking","unavailable"].includes(B?.localAvailability?.status),Ut=B=>String(
B?.localAvailability?.reason||(B?.localAvailability?.status==="checking"?"Checking this device…":"Unavailable on this \
device.")).slice(0,512),kr=B=>{const P=q=>Number.isFinite(q)&&q>0&&q<=1099511627776?`${Number((q/1073741824).toFixed(1))}\
 GiB`:"unknown";return`est. RAM ${P(B?.localAvailability?.cpuBytes)} / GPU ${P(B?.localAvailability?.gpuBytes)}`},Et=()=>se.
find(B=>B.key===d.target.value),ot=()=>{i?.invalidate?.(),d.proposed.replaceChildren()},Ze=B=>{if(!ee())return;const P=(B.
name==="AbortError"?"Cancelled: ":"Error: ")+B.message+(/context budget/i.test(B.message)?". Use Config → Clear conversa\
tion to start again, or shorten the prompt.":"");d.status.textContent=P,d.configuration.open&&(d.configurationStatus.textContent=
P),d.storedModels.open&&(d.storedStatus.textContent=P)},M=()=>{for(;d.transcript.children.length>24||p.encode(d.transcript.
textContent).byteLength>128*1024;)d.transcript.firstElementChild?.remove();h.prune(),d.transcript.scrollTop=d.transcript.
scrollHeight};function R(){const B=Et(),P=W.find(q=>q.key===d.source.value);d.prompt.placeholder=B?.task==="text-to-imag\
e"?"Describe an image…":"Message…",d.acquire.disabled=!!f||!P||Ee(P),d.source.disabled=!!f,d.sourceFilter.disabled=!!f,
d.cpuBudget.disabled=d.gpuBudget.disabled=!!f||!g?.setMemoryBudgets,d.send.disabled=!!f||_||!B?.available||!d.prompt.value.
trim()&&!E,d.cancel.hidden=!f,d.target.disabled=!!f,d.attach.disabled=!!f||!B?.modalities?.includes("image"),d.unload.disabled=
!!f,d.clearChat.disabled=!!f,d.storedRefresh.disabled=!!f||!!H;for(const q of d.storedList.querySelectorAll("button"))q.
disabled=!!f||!!H}function L(){const B=d.source.value,P=d.sourceFilter.value.trim().toLowerCase().split(/\s+/).filter(Boolean),
q=W.filter(N=>{const J=[N.name,N.modelId,N.task,N.runtime,N.source,N.source==="hf"?"Hugging Face":"Peers",N.task==="text\
-to-image"?"Image generation":""].join(" ").toLowerCase();return P.every(ct=>J.includes(ct))});de||(de=W.find(N=>N.modelId===
"smolvlm-256m-q4"&&N.source==="hf")?.key??W.find(N=>!Ee(N))?.key??W[0]?.key),d.source.replaceChildren();for(const N of q){
const J=document.createElement("option");J.value=N.key,J.textContent=String(N.name).slice(0,140)+(N.task==="text-to-imag\
e"?" · Image generation":"")+" · "+(N.source==="hf"?"Hugging Face":"Peers")+" · "+kr(N)+(Ee(N)?" · Setup required — s\
elect for help":""),J.dataset.unavailable=String(Ee(N)),d.source.append(J)}if(q.length){const N=q.find(J=>J.key===de)??q.
find(J=>J.key===B)??q.find(J=>!Ee(J))??q[0];if(Ee(N)){const J=document.createElement("option");J.value="",J.disabled=!0,
J.textContent="Choose a model — select unavailable models for help",d.source.prepend(J),d.source.value=""}else d.source.
value=N.key}else{const N=document.createElement("option");N.value="",N.disabled=!0,N.textContent="No matching models",d.
source.append(N),d.source.value=""}K(q),R()}function V(){Be&&(ze++,lR(d,fR(Be,{environment:{browser:d.helpBrowser.value,
os:d.helpOs.value}})))}function F(B){if(!ee()||f)return;Be=B;const P=Ty();d.helpBrowser.value=P.browser,d.helpOs.value=P.
os,V(),d.configuration.close(),d.storedModels.close(),d.compatibility.open||d.compatibility.showModal()}function K(B){const P=W.
find(J=>J.key===d.source.value),q=B.filter(Ee),N=P?[kr(P)+". Planning estimates; actual memory use varies."]:[];if(B.length?
P?.localAvailability?.reason&&!Ee(P)&&N.push(String(P.localAvailability.reason).slice(0,512)):N.push("No matching models\
. Clear or change the filter."),q.length){const J=new Map;for(const ct of q){const xt=Ut(ct),Ot=J.get(xt)??[];Ot.push(String(
ct.name).slice(0,140)),J.set(xt,Ot)}N.push([...J].map(([ct,xt])=>`${xt.join(", ")}: ${ct}`).join(" "))}d.sourceStatus.textContent=
N.join(" "),d.sourceStatus.hidden=!N.length}function we(){const B=d.target.value||"local",P=se.find(N=>N.key===B),q=d.target.
selectedOptions[0]?.textContent;W=g.listModelSources(),se=g.listInferenceTargets(),L(),d.target.replaceChildren();for(const N of se){
const J=document.createElement("option");J.value=N.key,J.textContent=(N.local?"Local · ":"Peers · ")+String(N.name).slice(
0,140)+(N.task==="text-to-image"?" · Image generation":"")+(N.busy?" (busy)":N.available?"":" (unavailable)"),d.target.
append(J)}if(!se.some(N=>N.key===B)&&B!=="local"&&q){const N=document.createElement("option");N.value=B,N.disabled=!0,N.
textContent=(P?.name??q.replace(/ \(unavailable\)$/,""))+" (unavailable)",d.target.append(N)}d.target.value=B,!d.target.
value&&se.some(N=>N.key==="local")&&(d.target.value="local"),R()}function me(B){if(!g)return;const P=g.getDiscoveryStatus?.(),
q=P?.connected??g.networkReady;q&&(D=null);const J=[q?`Peer network connected${Number.isSafeInteger(P?.peerCount)?` · ${P.
peerCount} peers`:""} · ${P?.sharedModelCount??W.filter(Ot=>Ot.source==="peers").length} shared models · ${P?.hostedModelCount??
se.filter(Ot=>!Ot.local&&Ot.available).length} hosted models.`:T&&!T.signal.aborted?"Connecting to peer network…":"Pee\
r network is offline."],ct=B?.message??D?.message??P?.errors?.[0]?.message;ct?J.push("Discovery issue: "+String(ct).slice(
0,256)):q&&P?.peerCount===0?J.push("Waiting for other peers."):q&&P?.hostedModelCount===0&&J.push("No peer is currently \
advertising a loaded model for inference.");const xt=g.getArtifactNetworkStatus?.();xt?.status==="starting"&&J.push("Fil\
e sharing is preparing stored models. Inference discovery remains available."),xt?.status==="error"&&J.push("File sharin\
g unavailable: "+String(xt.error??"Initialization failed").slice(0,256)),d.discoveryStatus.textContent=d.networkStatus.textContent=
J.join(" ")}function Mt(){const B=g.getMemoryBudgets?.()??{};d.cpuBudget.value=B.cpuBytes==null?"":String(B.cpuBytes/1024**
3),d.gpuBudget.value=B.gpuBytes==null?"":String(B.gpuBytes/1024**3);const P=g.getDeviceCapabilities?.()?.deviceMemoryGiB;
d.memoryNote.textContent=(Number.isFinite(P)&&P>0?`Browser-reported RAM: approximately ${P} GiB. `:"")+"Optional estimat\
es for future model loads. Leave blank for automatic checks. Your browser cannot report free GPU memory. Storage and loa\
ded models are unchanged."}function Er(){if(!(!ee()||f||!g.setMemoryBudgets))try{const B=[d.cpuBudget,d.gpuBudget].map(P=>{
P.setCustomValidity(""),P.removeAttribute("aria-invalid");const q=P.value.trim(),N=q?Math.round(Number(q)*1024**3):null;
if(P.validity.badInput||q&&(!Number.isFinite(Number(q))||Number(q)<=0||Number(q)>1024||!Number.isSafeInteger(N)||N<1)){const J="\
Enter a memory budget above 0 and at most 1024 GiB, or leave it blank.";throw P.setCustomValidity(J),P.setAttribute("ari\
a-invalid","true"),new Error(J)}return N});g.setMemoryBudgets({cpuBytes:B[0],gpuBytes:B[1]}),Mt(),W=g.listModelSources(),
L(),d.configurationStatus.textContent="Memory budgets updated for future imports."}catch(B){Ze(B)}}async function Rt(){if(!ee()||
I)return I;const B=new AbortController;return S=B,I=(async()=>{try{await g.refreshPeers({signal:B.signal}),ee()&&(CSS.supports(
"selector(:open)")&&(d.source.matches(":open")||d.target.matches(":open"))||we(),me())}catch(P){ee()&&!B.signal.aborted&&
me(P)}finally{I=null,S=null}})(),I}const ke=B=>{if(!ee())return;let P;if(B.stage==="import"?(P="Downloading "+(B.index+1)+
"/"+B.total+": "+B.path,Number.isSafeInteger(B.loaded)&&Number.isSafeInteger(B.totalBytes)&&B.loaded>=0&&B.totalBytes>0&&
(P+=` · ${fo(B.loaded)} / ${fo(B.totalBytes)}`)):B.type==="model-load"?P="Loading model: "+(B.stage||B.status||"initial\
izing GPU")+(B.file?" · "+B.file:""):P={prepare:"Preparing model import…",verify:"Verifying stored model files…","d\
ownload-peers":"Fetching and verifying model files from peers…",unload:"Releasing the previous model…",load:"Loading\
 model into RAM and GPU memory…"}[B.stage],!P)return;const q=`${B.type??""}:${B.stage??B.status??""}:${B.path??B.file??
""}`;q!==tr&&(tr=q,kt=performance.now()),wt=String(P).slice(0,512),d.status.textContent=wt,be||(be=setInterval(()=>{ee()&&
f&&!f.signal.aborted&&(d.status.textContent=`${wt} (${Math.floor((performance.now()-kt)/1e3)}s)`)},1e3))};async function at(B){
if(!ee()||f)return;const P=new AbortController;f=P,R(),b=(async()=>{try{await B(P.signal)}catch(q){Ze(q)}finally{clearInterval(
be),be=null,tr=null,f===P&&(f=null),ee()&&(we(),M())}})(),await b}async function Ft(){if(!ee()||G)return G;const B=new AbortController;
return H=B,d.storedStatus.textContent="Reading stored models…",R(),G=(async()=>{try{const P=await g.listStoredModels({
signal:B.signal});return ee()&&(uR(d,P,My),d.storedStatus.textContent=`${P.length} model${P.length===1?"":"s"} stored.`),
!0}catch(P){return Ze(P),!1}finally{G=null,H=null,ee()&&R()}})(),G}function My(B){return at(async P=>{d.storedStatus.textContent=
`Deleting ${B.name}…`;let q;try{q=await g.deleteStoredModel(B.manifestCid,{signal:P})}catch(N){throw await Ft(),N}if(q.
unloaded&&(m.delete("local"),ot()),await Ft()){const N=q.deleted?`Deleted ${B.name}.`:"This model is no longer stored.";
d.storedStatus.textContent=N+(q.freedBytes>0?` Freed ${fo(q.freedBytes)}.`:""),d.status.textContent=N}})}function vd(){E=
null,d.attachment.hidden=!0,d.attachmentImage.removeAttribute("src"),d.imageFile.value="",R()}try{g=await l({stateManager:e,
computeManager:t,networkManager:n,runtimeBaseUrl:o});const B=g.getPreferences();d.sharing.checked=B.sharing,d.hosting.checked=
B.hostInference,Mt(),we(),d.status.textContent="Ready."}catch(B){throw d.panel.remove(),B}d.configure.onclick=()=>{ee()&&
(d.compatibility.close(),d.storedModels.close(),d.configurationStatus.textContent="",d.configuration.showModal())},d.stored.
onclick=()=>{ee()&&(d.compatibility.close(),d.configuration.close(),d.storedModels.showModal(),Ft())},d.storedRefresh.onclick=
()=>{Ft()},d.sourceFilter.oninput=L,d.source.onchange=()=>{if(!ee()||f)return;const B=d.source.value;W=g.listModelSources();
const P=W.find(q=>q.key===B);P&&Ee(P)?(L(),F(P)):(de=B,L())},d.helpBrowser.onchange=d.helpOs.onchange=V,d.helpConfig.onclick=
()=>d.configure.click(),d.compatibility.addEventListener("close",()=>{ze++,ee()&&!d.configuration.open&&!d.storedModels.
open&&d.source.focus()}),d.helpCopy.onclick=async()=>{const B=d.helpCommand.value;if(!B||!ee())return;const P=++ze,q=()=>ee()&&
d.compatibility.open&&ze===P;try{await navigator.clipboard.writeText(B),q()&&(d.helpStatus.textContent="Command copied.")}catch{
q()&&(d.helpCommand.focus(),d.helpCommand.select(),d.helpStatus.textContent="Clipboard unavailable. Select and copy the \
command above.")}},d.cpuBudget.onchange=d.gpuBudget.onchange=Er,d.target.onchange=()=>{ot(),R()},d.prompt.oninput=R;for(const[
B,P]of[[d.sharing,"setSharing"],[d.hosting,"setHostInference"]])B.onchange=()=>{if(!ee())return;const q=B.checked;B.disabled=
!0;const N=(async()=>{try{await g[P](q),ee()&&(d.configurationStatus.textContent="Preferences updated.")}catch(J){B.checked=
!q,Ze(J)}finally{ee()&&(B.disabled=!1)}})();y.add(N),N.finally(()=>y.delete(N))};d.acquire.onclick=()=>{if(!ee()||f)return;
const B=d.source.value;W=g.listModelSources();const P=W.find(q=>q.key===B);if(!P||Ee(P)){L(),P&&F(P);return}return at(async q=>{
ot(),ke({stage:"prepare"}),await g.acquireModel(B,{signal:q,onProgress:N=>{q.aborted||ke(N)},ggufGpuLayers:Number(d.gpuLayers.
value)}),m.delete("local"),we(),d.target.value="local",R(),d.status.textContent=g.getSharingErrors?.().length?"Model rea\
dy. Sharing is unavailable for some stored models; see Stored Models.":"Model ready. Send a message."})},d.unload.onclick=
()=>at(async()=>{ot(),await g.unload(),m.delete("local"),d.status.textContent="Local model unloaded.",d.configurationStatus.
textContent=d.status.textContent}),d.clearChat.onclick=()=>{!ee()||f||(m.clear(),ot(),d.transcript.replaceChildren(d.empty),
h.prune(),d.status.textContent=d.configurationStatus.textContent="Conversation cleared. Ready for a new message.")},d.connect.
onclick=()=>at(async B=>{d.relay.value.trim()?await g.connect(d.relay.value.trim(),{signal:B}):await g.connectBackend({signal:B}),
await Rt()}),d.file.onchange=()=>at(async B=>{const P=d.file.files[0];P&&(await g.store.importFile(P.stream(),{expectedSize:P.
size,pin:!0,signal:B}),d.status.textContent="Pinned "+P.name+" locally.",d.file.value="")}),d.attach.onclick=()=>d.imageFile.
click(),d.imageFile.onchange=async()=>{v?.abort();const B=new AbortController;v=B;const P=d.imageFile.files[0];if(P){_=!0,
R();try{const q=await mR(P,{signal:B.signal});if(!ee()||B.signal.aborted)return;E=q,d.attachmentImage.src=q.preview,d.attachmentName.
textContent=q.name,d.attachment.hidden=!1,R(),d.prompt.focus()}catch(q){B.signal.aborted||Ze(q)}finally{v===B&&(_=!1,ee()&&
R())}}},d.removeAttachment.onclick=()=>{v?.abort(),vd()},d.cancel.onclick=()=>{f?.abort("User cancelled"),w&&g.cancel(w).
catch(Ze)};async function Sd(){d.send.disabled||await at(async B=>{const P=Et(),q=P.key,N=P.task==="text-to-image",J=d.prompt.
value.trim(),ct=E;if(ct&&!P.modalities?.includes("image"))throw new Error("This model accepts text only. Remove the imag\
e or choose an image model.");ot();const xt=N?null:await s?.({includeImage:!1}),Ot=(typeof xt=="string"?xt:xt?.text??"").
slice(0,16e3),Ad=N?"":String(i?.instructions??"").slice(0,8e3),wn=m.get(q)??[],_d=J||"Describe this image.",By=N?void 0:
[...Ot||Ad?[{role:"system",content:Ot+`
`+Ad}]:[],...wn.slice(-6),{role:"user",content:_d}];Tp(d,"user",J,{image:ct?.preview});const kn=Tp(d,"assistant","",{targetName:P.
name});d.prompt.value="",vd(),M(),w=crypto.randomUUID(),d.status.textContent=P.local?N?"Generating image…":"Generating\
…":"Waiting for peer…";try{const Bt=await g.generate(q,{requestId:w,signal:B,...N?{prompt:J}:{messages:By,image:ct?.
image,maxNewTokens:1024},onProgress(xe){ee()&&N&&Number.isSafeInteger(xe.step)&&Number.isSafeInteger(xe.steps)&&xe.step>=
0&&xe.step<=xe.steps&&xe.steps<=100&&(d.status.textContent=`Generating image: ${xe.step}/${xe.steps} steps…`)},onToken(xe){
ee()&&!N&&(kn.textContent+=xe,M())}});if(B.aborted)throw new DOMException("Generation cancelled","AbortError");if(N){if(!P.
outputModalities?.includes("image"))throw new Error("This target did not advertise image output");await h.append(kn,Bt.image,
{signal:B,prompt:J})}else{if(typeof Bt.text!="string")throw new Error("Model returned an invalid text response");for(kn.
textContent=Bt.text,wn.push({role:"user",content:_d},{role:"assistant",content:Bt.text});wn.length>6||p.encode(JSON.stringify(
wn)).byteLength>24*1024;)wn.splice(0,2);m.delete(q),m.set(q,wn),m.size>8&&m.delete(m.keys().next().value)}if(d.status.textContent=
"Ready.",!N){const xe=[];if(Bt.finishReason==="length"?xe.push("Response reached the model’s output or context limit and\
 may be incomplete."):Bt.finishReason!=="stop"&&xe.push("The model did not report whether this response is complete."),Bt.
contextTruncated&&xe.push("Older conversation turns were omitted to fit the model’s context."),xe.length){const rr=document.
createElement("p");rr.className="pc-inference-note",rr.textContent=xe.join(" "),kn.after(rr),d.status.textContent=xe.join(
" ")}}try{for(const xe of(N?[]:i?.propose(Bt.text)??[]).slice(0,4)){const rr=document.createElement("button");rr.type="b\
utton",rr.textContent="Apply: "+xe.label,rr.onclick=async()=>{rr.disabled=!0;try{await xe.apply()}catch(Ly){Ze(Ly)}},d.proposed.
append(rr)}}catch{}}catch(Bt){throw kn.textContent||(kn.textContent=Bt.name==="AbortError"?"Cancelled.":"Request failed."),
Bt}finally{w=null,M()}})}if(d.send.onclick=()=>{Sd()},d.prompt.onkeydown=B=>{B.key==="Enter"&&!B.shiftKey&&!B.isComposing&&
(B.preventDefault(),Sd())},Y=setInterval(()=>{Rt()},Math.max(20,u)),c&&!g.networkReady){const B=new AbortController;T=B,
$=g.connectBackend({signal:B.signal}).then(()=>Rt()).catch(P=>{ee()&&!B.signal.aborted&&(D=P)}).finally(()=>{T===B&&(T=null),
ee()&&me()})}else Rt();async function Ry(){if(clearInterval(be),be=null,!k){if(C)return C;x=!0,h.dispose(),d.compatibility.
close(),d.storedModels.close(),d.configuration.close(),d.panel.inert=!0,C=(async()=>{clearInterval(Y),f?.abort("Chat clo\
sed"),v?.abort(),S?.abort(),T?.abort(),H?.abort(),ot(),await b,await I,await $,await G,await Promise.allSettled([...y]),
await g.dispose(),k=!0,m.clear(),E=null,d.panel.remove(),a?.()})();try{await C}finally{C=null}}}return{element:d.panel,runtime:g,
dispose:Ry,refreshPeers:Rt}}async function kR(){try{window.inferencePanel=await wR({container:document.querySelector("#p\
anel"),autoConnect:!0})}catch(r){const e=document.createElement("p");e.textContent=r.message,document.querySelector("#pa\
nel").append(e)}}kR();const gL=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));export{Q6 as $,TB as A,mp as B,tL as C,qB as D,jB as E,V6 as F,b2 as G,zB as H,oM as I,f3 as J,ut as K,m3 as L,$B as M,FB as N,
Yt as O,jg as P,nL as Q,rL as R,UB as S,JB as T,Wr as U,HB as V,QB as W,OB as X,DB as Y,$M as Z,i3 as _,ia as a,WB as a0,
vy as a1,GB as a2,YB as a3,eL as a4,ZB as a5,MB as a6,PB as a7,oL as a8,XB as a9,XT as aA,y2 as aB,dg as aC,mi as aD,oB as aE,
ub as aF,e3 as aG,JM as aH,MR as aI,Fn as aJ,ph as aK,De as aL,lL as aM,uL as aN,dL as aO,mL as aP,hL as aQ,Iy as aR,pL as aS,
fL as aT,KM as aU,gL as aV,RB as aa,VB as ab,aL as ac,$b as ad,qT as ae,zT as af,Bs as ag,Vn as ah,Ke as ai,le as aj,ja as ak,
xd as al,cL as am,tu as an,Na as ao,Fa as ap,Oa as aq,sa as ar,FM as as,Qc as at,_B as au,SB as av,vB as aw,Tt as ax,K6 as ay,
LB as az,Br as b,xy as c,Db as d,iM as e,NB as f,aM as g,iL as h,sL as i,CM as j,qa as k,MM as l,wT as m,vi as n,pp as o,
It as p,xB as q,Pb as r,AB as s,IB as t,gT as u,CB as v,BB as w,NT as x,EB as y,un as z};
