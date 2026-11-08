const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-CmafPIxd.js","./GgufArtifactReader-C8vNO22w.js","./index-BjYfy4rE.js","./modelTask-Dcv1etEJ.js","./modelTask-sUw3Wgcr.js","./ModelInferenceService-BhSE50vO.js","./NetworkManager-DVeZM72H.js","./VoiceSession-BoKzGcNV.js"])))=>i.map(i=>d[i]);
import{_ as qt}from"./index-BjYfy4rE.js";const pn=()=>new Map,mf=t=>{const e=pn();return t.forEach((r,n)=>{e.set(n,r)}),
e},Gs=(t,e,r)=>{let n=t.get(e);return n===void 0&&t.set(e,n=r()),n},qE=(t,e)=>{const r=[];for(const[n,s]of t)r.push(e(s,
n));return r},jE=(t,e)=>{for(const[r,n]of t)if(e(n,r))return!0;return!1},ji=()=>new Set,qd=t=>t[t.length-1],GE=(t,e)=>{for(let r=0;r<
e.length;r++)t.push(e[r])},Us=Array.from,jh=(t,e)=>{for(let r=0;r<t.length;r++)if(!e(t[r],r,t))return!1;return!0},cw=(t,e)=>{
for(let r=0;r<t.length;r++)if(e(t[r],r,t))return!0;return!1},WE=(t,e)=>{const r=new Array(t);for(let n=0;n<t;n++)r[n]=e(
n,r);return r},td=Array.isArray;class Gh{constructor(){this._observers=pn()}on(e,r){Gs(this._observers,e,ji).add(r)}once(e,r){
const n=(...s)=>{this.off(e,n),r(...s)};this.on(e,n)}off(e,r){const n=this._observers.get(e);n!==void 0&&(n.delete(r),n.
size===0&&this._observers.delete(e))}emit(e,r){return Us((this._observers.get(e)||pn()).values()).forEach(n=>n(...r))}destroy(){
this._observers=pn()}}const Mn=Math.floor,Tc=Math.abs,lw=(t,e)=>t<e?t:e,ui=(t,e)=>t>e?t:e,dw=t=>t!==0?t<0:1/t<0,Im=1,_m=2,
jd=4,Gd=8,da=32,Kn=64,Wr=128,rd=31,gf=63,Xs=127,HE=2147483647,Yc=Number.MAX_SAFE_INTEGER,Cm=Number.MIN_SAFE_INTEGER,VE=Number.
isInteger||(t=>typeof t=="number"&&isFinite(t)&&Mn(t)===t),KE=String.fromCharCode,QE=t=>t.toLowerCase(),JE=/^\s*/g,YE=t=>t.
replace(JE,""),XE=/([A-Z])/g,Tm=(t,e)=>YE(t.replace(XE,r=>`${e}${QE(r)}`)),ZE=t=>{const e=unescape(encodeURIComponent(t)),
r=e.length,n=new Uint8Array(r);for(let s=0;s<r;s++)n[s]=e.codePointAt(s);return n},ua=typeof TextEncoder<"u"?new TextEncoder:
null,ek=t=>ua.encode(t),tk=ua?ek:ZE;let Yo=typeof TextDecoder>"u"?null:new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});
Yo&&Yo.decode(new Uint8Array).length===1&&(Yo=null);const rk=(t,e)=>WE(e,()=>t).join("");let Pa=class{constructor(){this.
cpos=0,this.cbuf=new Uint8Array(100),this.bufs=[]}};const nd=()=>new Pa,nk=t=>{let e=t.cpos;for(let r=0;r<t.bufs.length;r++)
e+=t.bufs[r].length;return e},Rn=t=>{const e=new Uint8Array(nk(t));let r=0;for(let n=0;n<t.bufs.length;n++){const s=t.bufs[n];
e.set(s,r),r+=s.length}return e.set(new Uint8Array(t.cbuf.buffer,0,t.cpos),r),e},sk=(t,e)=>{const r=t.cbuf.length;r-t.cpos<
e&&(t.bufs.push(new Uint8Array(t.cbuf.buffer,0,t.cpos)),t.cbuf=new Uint8Array(ui(r,e)*2),t.cpos=0)},Ft=(t,e)=>{const r=t.
cbuf.length;t.cpos===r&&(t.bufs.push(t.cbuf),t.cbuf=new Uint8Array(r*2),t.cpos=0),t.cbuf[t.cpos++]=e},bf=Ft,Pe=(t,e)=>{for(;e>
Xs;)Ft(t,Wr|Xs&e),e=Mn(e/128);Ft(t,Xs&e)},Wh=(t,e)=>{const r=dw(e);for(r&&(e=-e),Ft(t,(e>gf?Wr:0)|(r?Kn:0)|gf&e),e=Mn(e/
64);e>0;)Ft(t,(e>Xs?Wr:0)|Xs&e),e=Mn(e/128)},yf=new Uint8Array(3e4),ik=yf.length/3,ok=(t,e)=>{if(e.length<ik){const r=ua.
encodeInto(e,yf).written||0;Pe(t,r);for(let n=0;n<r;n++)Ft(t,yf[n])}else zr(t,tk(e))},ak=(t,e)=>{const r=unescape(encodeURIComponent(
e)),n=r.length;Pe(t,n);for(let s=0;s<n;s++)Ft(t,r.codePointAt(s))},Li=ua&&ua.encodeInto?ok:ak,sd=(t,e)=>{const r=t.cbuf.
length,n=t.cpos,s=lw(r-n,e.length),i=e.length-s;t.cbuf.set(e.subarray(0,s),n),t.cpos+=s,i>0&&(t.bufs.push(t.cbuf),t.cbuf=
new Uint8Array(ui(r*2,i)),t.cbuf.set(e.subarray(s)),t.cpos=i)},zr=(t,e)=>{Pe(t,e.byteLength),sd(t,e)},Hh=(t,e)=>{sk(t,e);
const r=new DataView(t.cbuf.buffer,t.cpos,e);return t.cpos+=e,r},ck=(t,e)=>Hh(t,4).setFloat32(0,e,!1),lk=(t,e)=>Hh(t,8).
setFloat64(0,e,!1),dk=(t,e)=>Hh(t,8).setBigInt64(0,e,!1),Rm=new DataView(new ArrayBuffer(4)),uk=t=>(Rm.setFloat32(0,t),Rm.
getFloat32(0)===t),fa=(t,e)=>{switch(typeof e){case"string":Ft(t,119),Li(t,e);break;case"number":VE(e)&&Tc(e)<=HE?(Ft(t,
125),Wh(t,e)):uk(e)?(Ft(t,124),ck(t,e)):(Ft(t,123),lk(t,e));break;case"bigint":Ft(t,122),dk(t,e);break;case"object":if(e===
null)Ft(t,126);else if(td(e)){Ft(t,117),Pe(t,e.length);for(let r=0;r<e.length;r++)fa(t,e[r])}else if(e instanceof Uint8Array)
Ft(t,116),zr(t,e);else{Ft(t,118);const r=Object.keys(e);Pe(t,r.length);for(let n=0;n<r.length;n++){const s=r[n];Li(t,s),
fa(t,e[s])}}break;case"boolean":Ft(t,e?120:121);break;default:Ft(t,127)}};class Mm extends Pa{constructor(e){super(),this.
w=e,this.s=null,this.count=0}write(e){this.s===e?this.count++:(this.count>0&&Pe(this,this.count-1),this.count=1,this.w(this,
e),this.s=e)}}const Bm=t=>{t.count>0&&(Wh(t.encoder,t.count===1?t.s:-t.s),t.count>1&&Pe(t.encoder,t.count-2))};class Rc{constructor(){
this.encoder=new Pa,this.s=0,this.count=0}write(e){this.s===e?this.count++:(Bm(this),this.count=1,this.s=e)}toUint8Array(){
return Bm(this),Rn(this.encoder)}}const Lm=t=>{if(t.count>0){const e=t.diff*2+(t.count===1?0:1);Wh(t.encoder,e),t.count>
1&&Pe(t.encoder,t.count-2)}};class Wd{constructor(){this.encoder=new Pa,this.s=0,this.count=0,this.diff=0}write(e){this.
diff===e-this.s?(this.s=e,this.count++):(Lm(this),this.count=1,this.diff=e-this.s,this.s=e)}toUint8Array(){return Lm(this),
Rn(this.encoder)}}class fk{constructor(){this.sarr=[],this.s="",this.lensE=new Rc}write(e){this.s+=e,this.s.length>19&&(this.
sarr.push(this.s),this.s=""),this.lensE.write(e.length)}toUint8Array(){const e=new Pa;return this.sarr.push(this.s),this.
s="",Li(e,this.sarr.join("")),sd(e,this.lensE.toUint8Array()),Rn(e)}}const es=t=>new Error(t),mn=()=>{throw es("Method u\
nimplemented")},on=()=>{throw es("Unexpected case")},uw=es("Unexpected end of array"),fw=es("Integer out of Range");let id=class{constructor(e){
this.arr=e,this.pos=0}};const Zi=t=>new id(t),hk=t=>t.pos!==t.arr.length,pk=(t,e)=>{const r=new Uint8Array(t.arr.buffer,
t.pos+t.arr.byteOffset,e);return t.pos+=e,r},qr=t=>pk(t,$e(t)),Gi=t=>t.arr[t.pos++],$e=t=>{let e=0,r=1;const n=t.arr.length;
for(;t.pos<n;){const s=t.arr[t.pos++];if(e=e+(s&Xs)*r,r*=128,s<Wr)return e;if(e>Yc)throw fw}throw uw},Vh=t=>{let e=t.arr[t.
pos++],r=e&gf,n=64;const s=(e&Kn)>0?-1:1;if((e&Wr)===0)return s*r;const i=t.arr.length;for(;t.pos<i;){if(e=t.arr[t.pos++],
r=r+(e&Xs)*n,n*=128,e<Wr)return s*r;if(r>Yc)throw fw}throw uw},mk=t=>{let e=$e(t);if(e===0)return"";{let r=String.fromCodePoint(
Gi(t));if(--e<100)for(;e--;)r+=String.fromCodePoint(Gi(t));else for(;e>0;){const n=e<1e4?e:1e4,s=t.arr.subarray(t.pos,t.
pos+n);t.pos+=n,r+=String.fromCodePoint.apply(null,s),e-=n}return decodeURIComponent(escape(r))}},gk=t=>Yo.decode(qr(t)),
Di=Yo?gk:mk,Kh=(t,e)=>{const r=new DataView(t.arr.buffer,t.arr.byteOffset+t.pos,e);return t.pos+=e,r},bk=t=>Kh(t,4).getFloat32(
0,!1),yk=t=>Kh(t,8).getFloat64(0,!1),wk=t=>Kh(t,8).getBigInt64(0,!1),vk=[t=>{},t=>null,Vh,bk,yk,wk,t=>!1,t=>!0,Di,t=>{const e=$e(
t),r={};for(let n=0;n<e;n++){const s=Di(t);r[s]=ha(t)}return r},t=>{const e=$e(t),r=[];for(let n=0;n<e;n++)r.push(ha(t));
return r},qr],ha=t=>vk[127-Gi(t)](t);class Dm extends id{constructor(e,r){super(e),this.reader=r,this.s=null,this.count=
0}read(){return this.count===0&&(this.s=this.reader(this),hk(this)?this.count=$e(this)+1:this.count=-1),this.count--,this.
s}}class Mc extends id{constructor(e){super(e),this.s=0,this.count=0}read(){if(this.count===0){this.s=Vh(this);const e=dw(
this.s);this.count=1,e&&(this.s=-this.s,this.count=$e(this)+2)}return this.count--,this.s}}class Hd extends id{constructor(e){
super(e),this.s=0,this.count=0,this.diff=0}read(){if(this.count===0){const e=Vh(this),r=e&1;this.diff=Mn(e/2),this.count=
1,r&&(this.count=$e(this)+2)}return this.s+=this.diff,this.count--,this.s}}class Ek{constructor(e){this.decoder=new Mc(e),
this.str=Di(this.decoder),this.spos=0}read(){const e=this.spos+this.decoder.read(),r=this.str.slice(this.spos,e);return this.
spos=e,r}}const kk=crypto.getRandomValues.bind(crypto),hw=()=>kk(new Uint32Array(1))[0],xk="10000000-1000-4000-8000"+-1e11,
Sk=()=>xk.replace(/[018]/g,t=>(t^hw()&15>>t/4).toString(16)),Wi=t=>new Promise(t);Promise.all.bind(Promise);const $m=t=>t===
void 0?null:t;class Ak{constructor(){this.map=new Map}setItem(e,r){this.map.set(e,r)}getItem(e){return this.map.get(e)}}
let pw=new Ak,Ik=!0;try{typeof localStorage<"u"&&localStorage&&(pw=localStorage,Ik=!1)}catch{}const _k=pw,pa=Symbol("Equ\
ality"),mw=(t,e)=>t===e||!!t?.[pa]?.(e)||!1,Ck=t=>typeof t=="object",Tk=Object.assign,Rk=Object.keys,Xc=t=>Rk(t).length,
Mk=t=>{for(const e in t)return!1;return!0},Oa=(t,e)=>{for(const r in t)if(!e(t[r],r))return!1;return!0},Qh=(t,e)=>Object.
prototype.hasOwnProperty.call(t,e),Bk=(t,e)=>t===e||Xc(t)===Xc(e)&&Oa(t,(r,n)=>(r!==void 0||Qh(e,n))&&mw(e[n],r)),Jh=(t,e,r=0)=>{
try{for(;r<t.length;r++)t[r](...e)}finally{r<t.length&&Jh(t,e,r+1)}},Bc=(t,e)=>{if(t===e)return!0;if(t==null||e==null||t.
constructor!==e.constructor&&(t.constructor||Object)!==(e.constructor||Object))return!1;if(t[pa]!=null)return t[pa](e);switch(t.
constructor){case ArrayBuffer:t=new Uint8Array(t),e=new Uint8Array(e);case Uint8Array:{if(t.byteLength!==e.byteLength)return!1;
for(let r=0;r<t.length;r++)if(t[r]!==e[r])return!1;break}case Set:{if(t.size!==e.size)return!1;for(const r of t)if(!e.has(
r))return!1;break}case Map:{if(t.size!==e.size)return!1;for(const r of t.keys())if(!e.has(r)||!Bc(t.get(r),e.get(r)))return!1;
break}case void 0:case Object:if(Xc(t)!==Xc(e))return!1;for(const r in t)if(!Qh(t,r)||!Bc(t[r],e[r]))return!1;break;case Array:
if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++)if(!Bc(t[r],e[r]))return!1;break;default:return!1}return!0},Lk=(t,e)=>e.
includes(t);var gw={};const ma=typeof process<"u"&&process.release&&/node|io\.js/.test(process.release.name)&&Object.prototype.
toString.call(typeof process<"u"?process:0)==="[object process]";let kn;const Dk=()=>{if(kn===void 0)if(ma){kn=pn();const t=process.
argv;let e=null;for(let r=0;r<t.length;r++){const n=t[r];n[0]==="-"?(e!==null&&kn.set(e,""),e=n):e!==null&&(kn.set(e,n),
e=null)}e!==null&&kn.set(e,"")}else typeof location=="object"?(kn=pn(),(location.search||"?").slice(1).split("&").forEach(
t=>{if(t.length!==0){const[e,r]=t.split("=");kn.set(`--${Tm(e,"-")}`,r),kn.set(`-${Tm(e,"-")}`,r)}})):kn=pn();return kn},
wf=t=>Dk().has(t),vf=t=>$m(ma?gw[t.toUpperCase().replaceAll("-","_")]:_k.getItem(t)),bw=t=>wf("--"+t)||vf(t)!==null,$k=bw(
"production"),Nk=ma&&Lk(gw.FORCE_COLOR,["true","1","2"]),Pk=Nk||!wf("--no-colors")&&!bw("no-color")&&(!ma||process.stdout.
isTTY)&&(!ma||wf("--color")||vf("COLORTERM")!==null||(vf("TERM")||"").includes("color")),Ok=t=>new Uint8Array(t),Uk=t=>{
const e=Ok(t.byteLength);return e.set(t),e};class Fk{constructor(e,r){this.left=e,this.right=r}}const Un=(t,e)=>new Fk(t,
e),Nm=t=>t.next()>=.5,Vd=(t,e,r)=>Mn(t.next()*(r+1-e)+e),yw=(t,e,r)=>Mn(t.next()*(r+1-e)+e),Yh=(t,e,r)=>yw(t,e,r),zk=t=>KE(
Yh(t,97,122)),qk=(t,e=0,r=20)=>{const n=Yh(t,e,r);let s="";for(let i=0;i<n;i++)s+=zk(t);return s},Kd=(t,e)=>e[Yh(t,0,e.length-
1)],jk=Symbol("0schema");class Gk{constructor(){this._rerrs=[]}extend(e,r,n,s=null){this._rerrs.push({path:e,expected:r,
has:n,message:s})}toString(){const e=[];for(let r=this._rerrs.length-1;r>0;r--){const n=this._rerrs[r];e.push(rk(" ",(this.
_rerrs.length-r)*2)+`${n.path!=null?`[${n.path}] `:""}${n.has} doesn't match ${n.expected}. ${n.message}`)}return e.join(
`
`)}}const Ef=(t,e)=>t===e?!0:t==null||e==null||t.constructor!==e.constructor?!1:t[pa]?mw(t,e):td(t)?jh(t,r=>cw(e,n=>Ef(r,
n))):Ck(t)?Oa(t,(r,n)=>Ef(r,e[n])):!1;class Ir{static _dilutes=!1;extends(e){let[r,n]=[this.shape,e.shape];return this.constructor.
_dilutes&&([n,r]=[r,n]),Ef(r,n)}equals(e){return this.constructor===e.constructor&&Bc(this.shape,e.shape)}[jk](){return!0}[pa](e){
return this.equals(e)}validate(e){return this.check(e)}check(e,r){mn()}get nullable(){return eo(this,dd)}get optional(){
return new Ew(this)}cast(e){return Pm(e,this),e}expect(e){return Pm(e,this),e}}class Xh extends Ir{constructor(e,r){super(),
this.shape=e,this._c=r}check(e,r=void 0){const n=e?.constructor===this.shape&&(this._c==null||this._c(e));return!n&&r?.extend(
null,this.shape.name,e?.constructor.name,e?.constructor!==this.shape?"Constructor match failed":"Check failed"),n}}const Tt=(t,e=null)=>new Xh(
t,e);Tt(Xh);class Zh extends Ir{constructor(e){super(),this.shape=e}check(e,r){const n=this.shape(e);return!n&&r?.extend(
null,"custom prop",e?.constructor.name,"failed to check custom prop"),n}}const Wt=t=>new Zh(t);Tt(Zh);class od extends Ir{constructor(e){
super(),this.shape=e}check(e,r){const n=this.shape.some(s=>s===e);return!n&&r?.extend(null,this.shape.join(" | "),e.toString()),
n}}const ad=(...t)=>new od(t),ww=Tt(od),Wk=RegExp.escape||(t=>t.replace(/[().|&,$^[\]]/g,e=>"\\"+e)),vw=t=>{if(Hi.check(
t))return[Wk(t)];if(ww.check(t))return t.shape.map(e=>e+"");if(Rw.check(t))return["[+-]?\\d+.?\\d*"];if(Mw.check(t))return[
".*"];if(Zc.check(t))return t.shape.map(vw).flat(1);on()};class Hk extends Ir{constructor(e){super(),this.shape=e,this._r=
new RegExp("^"+e.map(vw).map(r=>`(${r.join("|")})`).join("")+"$")}check(e,r){const n=this._r.exec(e)!=null;return!n&&r?.
extend(null,this._r.toString(),e.toString(),"String doesn't match string template."),n}}Tt(Hk);const Vk=Symbol("optional");
class Ew extends Ir{constructor(e){super(),this.shape=e}check(e,r){const n=e===void 0||this.shape.check(e);return!n&&r?.
extend(null,"undefined (optional)","()"),n}get[Vk](){return!0}}const Kk=Tt(Ew);class Qk extends Ir{check(e,r){return r?.
extend(null,"never",typeof e),!1}}Tt(Qk);class cd extends Ir{constructor(e,r=!1){super(),this.shape=e,this._isPartial=r}static _dilutes=!0;get partial(){
return new cd(this.shape,!0)}check(e,r){return e==null?(r?.extend(null,"object","null"),!1):Oa(this.shape,(n,s)=>{const i=this.
_isPartial&&!Qh(e,s)||n.check(e[s],r);return!i&&r?.extend(s.toString(),n.toString(),typeof e[s],"Object property does no\
t match"),i})}}const Jk=t=>new cd(t),Yk=Tt(cd),Xk=Wt(t=>t!=null&&(t.constructor===Object||t.constructor==null));class kw extends Ir{constructor(e,r){
super(),this.shape={keys:e,values:r}}check(e,r){return e!=null&&Oa(e,(n,s)=>{const i=this.shape.keys.check(s,r);return!i&&
r?.extend(s+"","Record",typeof e,i?"Key doesn't match schema":"Value doesn't match value"),i&&this.shape.values.check(n,
r)})}}const xw=(t,e)=>new kw(t,e),Zk=Tt(kw);class Sw extends Ir{constructor(e){super(),this.shape=e}check(e,r){return e!=
null&&Oa(this.shape,(n,s)=>{const i=n.check(e[s],r);return!i&&r?.extend(s.toString(),"Tuple",typeof n),i})}}const ex=(...t)=>new Sw(
t);Tt(Sw);class Aw extends Ir{constructor(e){super(),this.shape=e.length===1?e[0]:new ep(e)}check(e,r){const n=td(e)&&jh(
e,s=>this.shape.check(s));return!n&&r?.extend(null,"Array",""),n}}const Iw=(...t)=>new Aw(t),tx=Tt(Aw),rx=Wt(t=>td(t));class _w extends Ir{constructor(e,r){
super(),this.shape=e,this._c=r}check(e,r){const n=e instanceof this.shape&&(this._c==null||this._c(e));return!n&&r?.extend(
null,this.shape.name,e?.constructor.name),n}}const nx=(t,e=null)=>new _w(t,e);Tt(_w);const sx=nx(Ir);class ix extends Ir{constructor(e){
super(),this.len=e.length-1,this.args=ex(...e.slice(-1)),this.res=e[this.len]}check(e,r){const n=e.constructor===Function&&
e.length<=this.len;return!n&&r?.extend(null,"function",typeof e),n}}const ox=Tt(ix),ax=Wt(t=>typeof t=="function");class cx extends Ir{constructor(e){
super(),this.shape=e}check(e,r){const n=jh(this.shape,s=>s.check(e,r));return!n&&r?.extend(null,"Intersectinon",typeof e),
n}}Tt(cx,t=>t.shape.length>0);class ep extends Ir{static _dilutes=!0;constructor(e){super(),this.shape=e}check(e,r){const n=cw(
this.shape,s=>s.check(e,r));return r?.extend(null,"Union",typeof e),n}}const eo=(...t)=>t.findIndex(e=>Zc.check(e))>=0?eo(
...t.map(e=>ga(e)).map(e=>Zc.check(e)?e.shape:[e]).flat(1)):t.length===1?t[0]:new ep(t),Zc=Tt(ep),Cw=()=>!0,el=Wt(Cw),lx=Tt(
Zh,t=>t.shape===Cw),tp=Wt(t=>typeof t=="bigint"),dx=Wt(t=>t===tp),Tw=Wt(t=>typeof t=="symbol");Wt(t=>t===Tw);const $i=Wt(
t=>typeof t=="number"),Rw=Wt(t=>t===$i),Hi=Wt(t=>typeof t=="string"),Mw=Wt(t=>t===Hi),ld=Wt(t=>typeof t=="boolean"),ux=Wt(
t=>t===ld),Bw=ad(void 0);Tt(od,t=>t.shape.length===1&&t.shape[0]===void 0);ad(void 0);const dd=ad(null),fx=Tt(od,t=>t.shape.
length===1&&t.shape[0]===null);Tt(Uint8Array);Tt(Xh,t=>t.shape===Uint8Array);const hx=eo($i,Hi,dd,Bw,tp,ld,Tw);(()=>{const t=Iw(
el),e=xw(Hi,el),r=eo($i,Hi,dd,ld,t,e);return t.shape=r,e.shape.values=r,r})();const ga=t=>{if(sx.check(t))return t;if(Xk.
check(t)){const e={};for(const r in t)e[r]=ga(t[r]);return Jk(e)}else{if(rx.check(t))return eo(...t.map(ga));if(hx.check(
t))return ad(t);if(ax.check(t))return Tt(t)}on()},Pm=$k?()=>{}:(t,e)=>{const r=new Gk;if(!e.check(t,r))throw es(`Expecte\
d value to be of type ${e.constructor.name}.
${r.toString()}`)};class px{constructor(e){this.patterns=[],this.$state=e}if(e,r){return this.patterns.push({if:ga(e),h:r}),
this}else(e){return this.if(el,e)}done(){return(e,r)=>{for(let n=0;n<this.patterns.length;n++){const s=this.patterns[n];
if(s.if.check(e))return s.h(e,r)}throw es("Unhandled pattern")}}}const mx=t=>new px(t),Lw=mx(el).if(Rw,(t,e)=>Vd(e,Cm,Yc)).
if(Mw,(t,e)=>qk(e)).if(ux,(t,e)=>Nm(e)).if(dx,(t,e)=>BigInt(Vd(e,Cm,Yc))).if(Zc,(t,e)=>ki(e,Kd(e,t.shape))).if(Yk,(t,e)=>{
const r={};for(const n in t.shape){let s=t.shape[n];if(Kk.check(s)){if(Nm(e))continue;s=s.shape}r[n]=Lw(s,e)}return r}).
if(tx,(t,e)=>{const r=[],n=yw(e,0,42);for(let s=0;s<n;s++)r.push(ki(e,t.shape));return r}).if(ww,(t,e)=>Kd(e,t.shape)).if(
fx,(t,e)=>null).if(ox,(t,e)=>{const r=ki(e,t.res);return()=>r}).if(lx,(t,e)=>ki(e,Kd(e,[$i,Hi,dd,Bw,tp,ld,Iw($i),xw(eo("\
a","b","c"),$i)]))).if(Zk,(t,e)=>{const r={},n=Vd(e,0,3);for(let s=0;s<n;s++){const i=ki(e,t.shape.keys),o=ki(e,t.shape.
values);r[i]=o}return r}).done(),ki=(t,e)=>Lw(ga(e),t),ud=typeof document<"u"?document:{};Wt(t=>t.nodeType===vx);typeof DOMParser<
"u"&&new DOMParser;Wt(t=>t.nodeType===bx);Wt(t=>t.nodeType===yx);const gx=t=>qE(t,(e,r)=>`${r}:${e};`).join(""),bx=ud.ELEMENT_NODE,
yx=ud.TEXT_NODE,wx=ud.DOCUMENT_NODE,vx=ud.DOCUMENT_FRAGMENT_NODE;Wt(t=>t.nodeType===wx);const ts=Symbol,Dw=ts(),$w=ts(),
Ex=ts(),kx=ts(),xx=ts(),Nw=ts(),Sx=ts(),Pw=ts(),Ax=ts(),Ix=t=>{t.length===1&&t[0]?.constructor===Function&&(t=t[0]());const e=[],
r=[];let n=0;for(;n<t.length;n++){const s=t[n];if(s===void 0)break;if(s.constructor===String||s.constructor===Number)e.push(
s);else if(s.constructor===Object)break}for(n>0&&r.push(e.join(""));n<t.length;n++){const s=t[n];s instanceof Symbol||r.
push(s)}return r},_x={[Dw]:Un("font-weight","bold"),[$w]:Un("font-weight","normal"),[Ex]:Un("color","blue"),[xx]:Un("col\
or","green"),[kx]:Un("color","grey"),[Nw]:Un("color","red"),[Sx]:Un("color","purple"),[Pw]:Un("color","orange"),[Ax]:Un(
"color","black")},Cx=t=>{t.length===1&&t[0]?.constructor===Function&&(t=t[0]());const e=[],r=[],n=pn();let s=[],i=0;for(;i<
t.length;i++){const o=t[i],a=_x[o];if(a!==void 0)n.set(a.left,a.right);else{if(o===void 0)break;if(o.constructor===String||
o.constructor===Number){const c=gx(n);i>0||c.length>0?(e.push("%c"+o),r.push(c)):e.push(o)}else break}}for(i>0&&(s=r,s.unshift(
e.join("")));i<t.length;i++){const o=t[i];o instanceof Symbol||s.push(o)}return s},Tx=Pk?Cx:Ix,Rx=(...t)=>{console.log(...Tx(
t)),Mx.forEach(e=>e.print(t))},Mx=ji(),Ow=t=>({[Symbol.iterator](){return this},next:t}),Bx=(t,e)=>Ow(()=>{let r;do r=t.
next();while(!r.done&&!e(r.value));return r}),Qd=(t,e)=>Ow(()=>{const{done:r,value:n}=t.next();return{done:r,value:r?void 0:
e(n)}});class rp{constructor(e,r){this.clock=e,this.len=r}}class Ua{constructor(){this.clients=new Map}}const kf=(t,e,r)=>e.
clients.forEach((n,s)=>{const i=t.doc.store.clients.get(s);for(let o=0;o<n.length;o++){const a=n[o];Yw(t,i,a.clock,a.len,
r)}}),Lx=(t,e)=>{let r=0,n=t.length-1;for(;r<=n;){const s=Mn((r+n)/2),i=t[s],o=i.clock;if(o<=e){if(e<o+i.len)return s;r=
s+1}else n=s-1}return null},Uw=(t,e)=>{const r=t.clients.get(e.client);return r!==void 0&&Lx(r,e.clock)!==null},np=t=>{t.
clients.forEach(e=>{e.sort((s,i)=>s.clock-i.clock);let r,n;for(r=1,n=1;r<e.length;r++){const s=e[n-1],i=e[r];s.clock+s.len>=
i.clock?s.len=ui(s.len,i.clock+i.len-s.clock):(n<r&&(e[n]=i),n++)}e.length=n})},Dx=t=>{const e=new Ua;for(let r=0;r<t.length;r++)
t[r].clients.forEach((n,s)=>{if(!e.clients.has(s)){const i=n.slice();for(let o=r+1;o<t.length;o++)GE(i,t[o].clients.get(
s)||[]);e.clients.set(s,i)}});return np(e),e},tl=(t,e,r,n)=>{Gs(t.clients,e,()=>[]).push(new rp(r,n))},$x=()=>new Ua,Nx=t=>{
const e=$x();return t.clients.forEach((r,n)=>{const s=[];for(let i=0;i<r.length;i++){const o=r[i];if(o.deleted){const a=o.
id.clock;let c=o.length;if(i+1<r.length)for(let l=r[i+1];i+1<r.length&&l.deleted;l=r[++i+1])c+=l.length;s.push(new rp(a,
c))}}s.length>0&&e.clients.set(n,s)}),e},to=(t,e)=>{Pe(t.restEncoder,e.clients.size),Us(e.clients.entries()).sort((r,n)=>n[0]-
r[0]).forEach(([r,n])=>{t.resetDsCurVal(),Pe(t.restEncoder,r);const s=n.length;Pe(t.restEncoder,s);for(let i=0;i<s;i++){
const o=n[i];t.writeDsClock(o.clock),t.writeDsLen(o.len)}})},sp=t=>{const e=new Ua,r=$e(t.restDecoder);for(let n=0;n<r;n++){
t.resetDsCurVal();const s=$e(t.restDecoder),i=$e(t.restDecoder);if(i>0){const o=Gs(e.clients,s,()=>[]);for(let a=0;a<i;a++)
o.push(new rp(t.readDsClock(),t.readDsLen()))}}return e},Om=(t,e,r)=>{const n=new Ua,s=$e(t.restDecoder);for(let i=0;i<s;i++){
t.resetDsCurVal();const o=$e(t.restDecoder),a=$e(t.restDecoder),c=r.clients.get(o)||[],l=jt(r,o);for(let d=0;d<a;d++){const f=t.
readDsClock(),h=f+t.readDsLen();if(f<l){l<h&&tl(n,o,l,h-l);let p=Bn(c,f),m=c[p];for(!m.deleted&&m.id.clock<f&&(c.splice(
p+1,0,ll(e,m,f-m.id.clock)),p++);p<c.length&&(m=c[p++],m.id.clock<h);)m.deleted||(h<m.id.clock+m.length&&c.splice(p,0,ll(
e,m,h-m.id.clock)),m.delete(e))}else tl(n,o,f,h-f)}}if(n.clients.size>0){const i=new si;return Pe(i.restEncoder,0),to(i,
n),i.toUint8Array()}return null},Fw=hw;class ro extends Gh{constructor({guid:e=Sk(),collectionid:r=null,gc:n=!0,gcFilter:s=()=>!0,
meta:i=null,autoLoad:o=!1,shouldLoad:a=!0}={}){super(),this.gc=n,this.gcFilter=s,this.clientID=Fw(),this.guid=e,this.collectionid=
r,this.share=new Map,this.store=new Qw,this._transaction=null,this._transactionCleanups=[],this.subdocs=new Set,this._item=
null,this.shouldLoad=a,this.autoLoad=o,this.meta=i,this.isLoaded=!1,this.isSynced=!1,this.whenLoaded=Wi(l=>{this.on("loa\
d",()=>{this.isLoaded=!0,l(this)})});const c=()=>Wi(l=>{const d=f=>{(f===void 0||f===!0)&&(this.off("sync",d),l())};this.
on("sync",d)});this.on("sync",l=>{l===!1&&this.isSynced&&(this.whenSynced=c()),this.isSynced=l===void 0||l===!0,this.isLoaded||
this.emit("load",[])}),this.whenSynced=c()}load(){const e=this._item;e!==null&&!this.shouldLoad&&ct(e.parent.doc,r=>{r.subdocsLoaded.
add(this)},null,!0),this.shouldLoad=!0}getSubdocs(){return this.subdocs}getSubdocGuids(){return new Set(Us(this.subdocs).
map(e=>e.guid))}transact(e,r=null){return ct(this,e,r)}get(e,r=Yt){const n=Gs(this.share,e,()=>{const i=new r;return i._integrate(
this,null),i}),s=n.constructor;if(r!==Yt&&s!==r)if(s===Yt){const i=new r;i._map=n._map,n._map.forEach(o=>{for(;o!==null;o=
o.left)o.parent=i}),i._start=n._start;for(let o=i._start;o!==null;o=o.right)o.parent=i;return i._length=n._length,this.share.
set(e,i),i._integrate(this,null),i}else throw new Error(`Type with the name ${e} has already been defined with a differe\
nt constructor`);return n}getArray(e=""){return this.get(e,Pi)}getText(e=""){return this.get(e,Ki)}getMap(e=""){return this.
get(e,Yn)}getXmlFragment(e=""){return this.get(e,ii)}toJSON(){const e={};return this.share.forEach((r,n)=>{e[n]=r.toJSON()}),
e}destroy(){Us(this.subdocs).forEach(r=>r.destroy());const e=this._item;if(e!==null){this._item=null;const r=e.content;r.
doc=new ro({guid:this.guid,...r.opts,shouldLoad:!1}),r.doc._item=e,ct(e.parent.doc,n=>{const s=r.doc;e.deleted||n.subdocsAdded.
add(s),n.subdocsRemoved.add(this)},null,!0)}this.emit("destroyed",[!0]),this.emit("destroy",[this]),super.destroy()}on(e,r){
super.on(e,r)}off(e,r){super.off(e,r)}}class zw{constructor(e){this.restDecoder=e}resetDsCurVal(){}readDsClock(){return $e(
this.restDecoder)}readDsLen(){return $e(this.restDecoder)}}class qw extends zw{readLeftID(){return Oe($e(this.restDecoder),
$e(this.restDecoder))}readRightID(){return Oe($e(this.restDecoder),$e(this.restDecoder))}readClient(){return $e(this.restDecoder)}readInfo(){
return Gi(this.restDecoder)}readString(){return Di(this.restDecoder)}readParentInfo(){return $e(this.restDecoder)===1}readTypeRef(){
return $e(this.restDecoder)}readLen(){return $e(this.restDecoder)}readAny(){return ha(this.restDecoder)}readBuf(){return Uk(
qr(this.restDecoder))}readJSON(){return JSON.parse(Di(this.restDecoder))}readKey(){return Di(this.restDecoder)}}class Px{constructor(e){
this.dsCurrVal=0,this.restDecoder=e}resetDsCurVal(){this.dsCurrVal=0}readDsClock(){return this.dsCurrVal+=$e(this.restDecoder),
this.dsCurrVal}readDsLen(){const e=$e(this.restDecoder)+1;return this.dsCurrVal+=e,e}}class Vi extends Px{constructor(e){
super(e),this.keys=[],$e(e),this.keyClockDecoder=new Hd(qr(e)),this.clientDecoder=new Mc(qr(e)),this.leftClockDecoder=new Hd(
qr(e)),this.rightClockDecoder=new Hd(qr(e)),this.infoDecoder=new Dm(qr(e),Gi),this.stringDecoder=new Ek(qr(e)),this.parentInfoDecoder=
new Dm(qr(e),Gi),this.typeRefDecoder=new Mc(qr(e)),this.lenDecoder=new Mc(qr(e))}readLeftID(){return new Ni(this.clientDecoder.
read(),this.leftClockDecoder.read())}readRightID(){return new Ni(this.clientDecoder.read(),this.rightClockDecoder.read())}readClient(){
return this.clientDecoder.read()}readInfo(){return this.infoDecoder.read()}readString(){return this.stringDecoder.read()}readParentInfo(){
return this.parentInfoDecoder.read()===1}readTypeRef(){return this.typeRefDecoder.read()}readLen(){return this.lenDecoder.
read()}readAny(){return ha(this.restDecoder)}readBuf(){return qr(this.restDecoder)}readJSON(){return ha(this.restDecoder)}readKey(){
const e=this.keyClockDecoder.read();if(e<this.keys.length)return this.keys[e];{const r=this.stringDecoder.read();return this.
keys.push(r),r}}}class jw{constructor(){this.restEncoder=nd()}toUint8Array(){return Rn(this.restEncoder)}resetDsCurVal(){}writeDsClock(e){
Pe(this.restEncoder,e)}writeDsLen(e){Pe(this.restEncoder,e)}}class Fa extends jw{writeLeftID(e){Pe(this.restEncoder,e.client),
Pe(this.restEncoder,e.clock)}writeRightID(e){Pe(this.restEncoder,e.client),Pe(this.restEncoder,e.clock)}writeClient(e){Pe(
this.restEncoder,e)}writeInfo(e){bf(this.restEncoder,e)}writeString(e){Li(this.restEncoder,e)}writeParentInfo(e){Pe(this.
restEncoder,e?1:0)}writeTypeRef(e){Pe(this.restEncoder,e)}writeLen(e){Pe(this.restEncoder,e)}writeAny(e){fa(this.restEncoder,
e)}writeBuf(e){zr(this.restEncoder,e)}writeJSON(e){Li(this.restEncoder,JSON.stringify(e))}writeKey(e){Li(this.restEncoder,
e)}}class Gw{constructor(){this.restEncoder=nd(),this.dsCurrVal=0}toUint8Array(){return Rn(this.restEncoder)}resetDsCurVal(){
this.dsCurrVal=0}writeDsClock(e){const r=e-this.dsCurrVal;this.dsCurrVal=e,Pe(this.restEncoder,r)}writeDsLen(e){e===0&&on(),
Pe(this.restEncoder,e-1),this.dsCurrVal+=e}}class si extends Gw{constructor(){super(),this.keyMap=new Map,this.keyClock=
0,this.keyClockEncoder=new Wd,this.clientEncoder=new Rc,this.leftClockEncoder=new Wd,this.rightClockEncoder=new Wd,this.
infoEncoder=new Mm(bf),this.stringEncoder=new fk,this.parentInfoEncoder=new Mm(bf),this.typeRefEncoder=new Rc,this.lenEncoder=
new Rc}toUint8Array(){const e=nd();return Pe(e,0),zr(e,this.keyClockEncoder.toUint8Array()),zr(e,this.clientEncoder.toUint8Array()),
zr(e,this.leftClockEncoder.toUint8Array()),zr(e,this.rightClockEncoder.toUint8Array()),zr(e,Rn(this.infoEncoder)),zr(e,this.
stringEncoder.toUint8Array()),zr(e,Rn(this.parentInfoEncoder)),zr(e,this.typeRefEncoder.toUint8Array()),zr(e,this.lenEncoder.
toUint8Array()),sd(e,Rn(this.restEncoder)),Rn(e)}writeLeftID(e){this.clientEncoder.write(e.client),this.leftClockEncoder.
write(e.clock)}writeRightID(e){this.clientEncoder.write(e.client),this.rightClockEncoder.write(e.clock)}writeClient(e){this.
clientEncoder.write(e)}writeInfo(e){this.infoEncoder.write(e)}writeString(e){this.stringEncoder.write(e)}writeParentInfo(e){
this.parentInfoEncoder.write(e?1:0)}writeTypeRef(e){this.typeRefEncoder.write(e)}writeLen(e){this.lenEncoder.write(e)}writeAny(e){
fa(this.restEncoder,e)}writeBuf(e){zr(this.restEncoder,e)}writeJSON(e){fa(this.restEncoder,e)}writeKey(e){const r=this.keyMap.
get(e);r===void 0?(this.keyClockEncoder.write(this.keyClock++),this.stringEncoder.write(e)):this.keyClockEncoder.write(r)}}
const Ox=(t,e,r,n)=>{n=ui(n,e[0].id.clock);const s=Bn(e,n);Pe(t.restEncoder,e.length-s),t.writeClient(r),Pe(t.restEncoder,
n);const i=e[s];i.write(t,n-i.id.clock);for(let o=s+1;o<e.length;o++)e[o].write(t,0)},ip=(t,e,r)=>{const n=new Map;r.forEach(
(s,i)=>{jt(e,i)>s&&n.set(i,s)}),fd(e).forEach((s,i)=>{r.has(i)||n.set(i,0)}),Pe(t.restEncoder,n.size),Us(n.entries()).sort(
(s,i)=>i[0]-s[0]).forEach(([s,i])=>{Ox(t,e.clients.get(s),s,i)})},Ux=(t,e)=>{const r=pn(),n=$e(t.restDecoder);for(let s=0;s<
n;s++){const i=$e(t.restDecoder),o=new Array(i),a=t.readClient();let c=$e(t.restDecoder);r.set(a,{i:0,refs:o});for(let l=0;l<
i;l++){const d=t.readInfo();switch(rd&d){case 0:{const f=t.readLen();o[l]=new rn(Oe(a,c),f),c+=f;break}case 10:{const f=$e(
t.restDecoder);o[l]=new nn(Oe(a,c),f),c+=f;break}default:{const f=(d&(Kn|Wr))===0,h=new $t(Oe(a,c),null,(d&Wr)===Wr?t.readLeftID():
null,null,(d&Kn)===Kn?t.readRightID():null,f?t.readParentInfo()?e.get(t.readString()):t.readLeftID():null,f&&(d&da)===da?
t.readString():null,g0(t,d));o[l]=h,c+=h.length}}}}return r},Fx=(t,e,r)=>{const n=[];let s=Us(r.keys()).sort((p,m)=>p-m);
if(s.length===0)return null;const i=()=>{if(s.length===0)return null;let p=r.get(s[s.length-1]);for(;p.refs.length===p.i;)
if(s.pop(),s.length>0)p=r.get(s[s.length-1]);else return null;return p};let o=i();if(o===null&&n.length===0)return null;
const a=new Qw,c=new Map,l=(p,m)=>{const b=c.get(p);(b==null||b>m)&&c.set(p,m)};let d=o.refs[o.i++];const f=new Map,h=()=>{
for(const p of n){const m=p.id.client,b=r.get(m);b?(b.i--,a.clients.set(m,b.refs.slice(b.i)),r.delete(m),b.i=0,b.refs=[]):
a.clients.set(m,[p]),s=s.filter(g=>g!==m)}n.length=0};for(;;){if(d.constructor!==nn){const m=Gs(f,d.id.client,()=>jt(e,d.
id.client))-d.id.clock;if(m<0)n.push(d),l(d.id.client,d.id.clock-1),h();else{const b=d.getMissing(t,e);if(b!==null){n.push(
d);const g=r.get(b)||{refs:[],i:0};if(g.refs.length===g.i)l(b,jt(e,b)),h();else{d=g.refs[g.i++];continue}}else(m===0||m<
d.length)&&(d.integrate(t,m),f.set(d.id.client,d.id.clock+d.length))}}if(n.length>0)d=n.pop();else if(o!==null&&o.i<o.refs.
length)d=o.refs[o.i++];else{if(o=i(),o===null)break;d=o.refs[o.i++]}}if(a.clients.size>0){const p=new si;return ip(p,a,new Map),
Pe(p.restEncoder,0),{missing:c,update:p.toUint8Array()}}return null},zx=(t,e)=>ip(t,e.doc.store,e.beforeState),qx=(t,e,r,n=new Vi(
t))=>ct(e,s=>{s.local=!1;let i=!1;const o=s.doc,a=o.store,c=Ux(n,o),l=Fx(s,a,c),d=a.pendingStructs;if(d){for(const[h,p]of d.
missing)if(p<jt(a,h)){i=!0;break}if(l){for(const[h,p]of l.missing){const m=d.missing.get(h);(m==null||m>p)&&d.missing.set(
h,p)}d.update=nl([d.update,l.update])}}else a.pendingStructs=l;const f=Om(n,s,a);if(a.pendingDs){const h=new Vi(Zi(a.pendingDs));
$e(h.restDecoder);const p=Om(h,s,a);f&&p?a.pendingDs=nl([f,p]):a.pendingDs=f||p}else a.pendingDs=f;if(i){const h=a.pendingStructs.
update;a.pendingStructs=null,Ww(s.doc,h)}},r,!1),Ww=(t,e,r,n=Vi)=>{const s=Zi(e);qx(s,t,r,new n(s))},rl=(t,e,r)=>Ww(t,e,
r,qw),jx=(t,e,r=new Map)=>{ip(t,e.store,r),to(t,Nx(e.store))},Gx=(t,e=new Uint8Array([0]),r=new si)=>{const n=Hw(e);jx(r,
t,n);const s=[r.toUint8Array()];if(t.store.pendingDs&&s.push(t.store.pendingDs),t.store.pendingStructs&&s.push(iS(t.store.
pendingStructs.update,e)),s.length>1){if(r.constructor===Fa)return nS(s.map((i,o)=>o===0?i:aS(i)));if(r.constructor===si)
return nl(s)}return s[0]},op=(t,e)=>Gx(t,e,new Fa),Wx=t=>{const e=new Map,r=$e(t.restDecoder);for(let n=0;n<r;n++){const s=$e(
t.restDecoder),i=$e(t.restDecoder);e.set(s,i)}return e},Hw=t=>Wx(new zw(Zi(t))),Vw=(t,e)=>(Pe(t.restEncoder,e.size),Us(e.
entries()).sort((r,n)=>n[0]-r[0]).forEach(([r,n])=>{Pe(t.restEncoder,r),Pe(t.restEncoder,n)}),t),Hx=(t,e)=>Vw(t,fd(e.store)),
Vx=(t,e=new Gw)=>(t instanceof Map?Vw(e,t):Hx(e,t),e.toUint8Array()),Kx=t=>Vx(t,new jw);class Qx{constructor(){this.l=[]}}
const Um=()=>new Qx,Fm=(t,e)=>t.l.push(e),zm=(t,e)=>{const r=t.l,n=r.length;t.l=r.filter(s=>e!==s),n===t.l.length&&console.
error("[yjs] Tried to remove event handler that doesn't exist.")},Kw=(t,e,r)=>Jh(t.l,[e,r]);class Ni{constructor(e,r){this.
client=e,this.clock=r}}const sc=(t,e)=>t===e||t!==null&&e!==null&&t.client===e.client&&t.clock===e.clock,Oe=(t,e)=>new Ni(
t,e),Jx=t=>{for(const[e,r]of t.doc.share.entries())if(r===t)return e;throw on()},go=(t,e)=>e===void 0?!t.deleted:e.sv.has(
t.id.client)&&(e.sv.get(t.id.client)||0)>t.id.clock&&!Uw(e.ds,t.id),xf=(t,e)=>{const r=Gs(t.meta,xf,ji),n=t.doc.store;r.
has(e)||(e.sv.forEach((s,i)=>{s<jt(n,i)&&Fs(t,Oe(i,s))}),kf(t,e.ds,s=>{}),r.add(e))};class Qw{constructor(){this.clients=
new Map,this.pendingStructs=null,this.pendingDs=null}}const fd=t=>{const e=new Map;return t.clients.forEach((r,n)=>{const s=r[r.
length-1];e.set(n,s.id.clock+s.length)}),e},jt=(t,e)=>{const r=t.clients.get(e);if(r===void 0)return 0;const n=r[r.length-
1];return n.id.clock+n.length},Jw=(t,e)=>{let r=t.clients.get(e.id.client);if(r===void 0)r=[],t.clients.set(e.id.client,
r);else{const n=r[r.length-1];if(n.id.clock+n.length!==e.id.clock)throw on()}r.push(e)},Bn=(t,e)=>{let r=0,n=t.length-1,
s=t[n],i=s.id.clock;if(i===e)return n;let o=Mn(e/(i+s.length-1)*n);for(;r<=n;){if(s=t[o],i=s.id.clock,i<=e){if(e<i+s.length)
return o;r=o+1}else n=o-1;o=Mn((r+n)/2)}throw on()},Yx=(t,e)=>{const r=t.clients.get(e.client);return r[Bn(r,e.clock)]},
Jd=Yx,Sf=(t,e,r)=>{const n=Bn(e,r),s=e[n];return s.id.clock<r&&s instanceof $t?(e.splice(n+1,0,ll(t,s,r-s.id.clock)),n+1):
n},Fs=(t,e)=>{const r=t.doc.store.clients.get(e.client);return r[Sf(t,r,e.clock)]},qm=(t,e,r)=>{const n=e.clients.get(r.
client),s=Bn(n,r.clock),i=n[s];return r.clock!==i.id.clock+i.length-1&&i.constructor!==rn&&n.splice(s+1,0,ll(t,i,r.clock-
i.id.clock+1)),i},Xx=(t,e,r)=>{const n=t.clients.get(e.id.client);n[Bn(n,e.id.clock)]=r},Yw=(t,e,r,n,s)=>{if(n===0)return;
const i=r+n;let o=Sf(t,e,r),a;do a=e[o++],i<a.id.clock+a.length&&Sf(t,e,i),s(a);while(o<e.length&&e[o].id.clock<i)};class Zx{constructor(e,r,n){
this.doc=e,this.deleteSet=new Ua,this.beforeState=fd(e.store),this.afterState=new Map,this.changed=new Map,this.changedParentTypes=
new Map,this._mergeStructs=[],this.origin=r,this.meta=new Map,this.local=n,this.subdocsAdded=new Set,this.subdocsRemoved=
new Set,this.subdocsLoaded=new Set}}const jm=(t,e)=>e.deleteSet.clients.size===0&&!jE(e.afterState,(r,n)=>e.beforeState.
get(n)!==r)?!1:(np(e.deleteSet),zx(t,e),to(t,e.deleteSet),!0),Gm=(t,e,r)=>{const n=e._item;(n===null||n.id.clock<(t.beforeState.
get(n.id.client)||0)&&!n.deleted)&&Gs(t.changed,e,ji).add(r)},Lc=(t,e)=>{const r=t[e-1],n=t[e];r.deleted===n.deleted&&r.
constructor===n.constructor&&r.mergeWith(n)&&(t.splice(e,1),n instanceof $t&&n.parentSub!==null&&n.parent._map.get(n.parentSub)===
n&&n.parent._map.set(n.parentSub,r))},eS=(t,e,r)=>{for(const[n,s]of t.clients.entries()){const i=e.clients.get(n);for(let o=s.
length-1;o>=0;o--){const a=s[o],c=a.clock+a.len;for(let l=Bn(i,a.clock),d=i[l];l<i.length&&d.id.clock<c;d=i[++l]){const f=i[l];
if(a.clock+a.len<=f.id.clock)break;f instanceof $t&&f.deleted&&!f.keep&&r(f)&&f.gc(e,!1)}}}},tS=(t,e)=>{t.clients.forEach(
(r,n)=>{const s=e.clients.get(n);for(let i=r.length-1;i>=0;i--){const o=r[i],a=lw(s.length-1,1+Bn(s,o.clock+o.len-1));for(let c=a,
l=s[c];c>0&&l.id.clock>=o.clock;l=s[--c])Lc(s,c)}})},Xw=(t,e)=>{if(e<t.length){const r=t[e],n=r.doc,s=n.store,i=r.deleteSet,
o=r._mergeStructs;try{np(i),r.afterState=fd(r.doc.store),n.emit("beforeObserverCalls",[r,n]);const a=[];r.changed.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&l._callObserver(r,c)})),a.push(()=>{r.changedParentTypes.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&(c=c.filter(d=>d.target._item===null||!d.target._item.deleted),c.
forEach(d=>{d.currentTarget=l}),c.sort((d,f)=>d.path.length-f.path.length),Kw(l._dEH,c,r))})),a.push(()=>n.emit("afterTr\
ansaction",[r,n]))}),Jh(a,[])}finally{n.gc&&eS(i,s,n.gcFilter),tS(i,s),r.afterState.forEach((d,f)=>{const h=r.beforeState.
get(f)||0;if(h!==d){const p=s.clients.get(f),m=ui(Bn(p,h),1);for(let b=p.length-1;b>=m;b--)Lc(p,b)}});for(let d=0;d<o.length;d++){
const{client:f,clock:h}=o[d].id,p=s.clients.get(f),m=Bn(p,h);m+1<p.length&&Lc(p,m+1),m>0&&Lc(p,m)}if(!r.local&&r.afterState.
get(n.clientID)!==r.beforeState.get(n.clientID)&&(Rx(Pw,Dw,"[yjs] ",$w,Nw,"Changed the client-id because another client \
seems to be using it."),n.clientID=Fw()),n.emit("afterTransactionCleanup",[r,n]),n._observers.has("update")){const d=new Fa;
jm(d,r)&&n.emit("update",[d.toUint8Array(),r.origin,n,r])}if(n._observers.has("updateV2")){const d=new si;jm(d,r)&&n.emit(
"updateV2",[d.toUint8Array(),r.origin,n,r])}const{subdocsAdded:a,subdocsLoaded:c,subdocsRemoved:l}=r;(a.size>0||l.size>0||
c.size>0)&&(a.forEach(d=>{d.clientID=n.clientID,d.collectionid==null&&(d.collectionid=n.collectionid),n.subdocs.add(d)}),
l.forEach(d=>n.subdocs.delete(d)),n.emit("subdocs",[{loaded:c,added:a,removed:l},n,r]),l.forEach(d=>d.destroy())),t.length<=
e+1?(n._transactionCleanups=[],n.emit("afterAllTransactions",[n,t])):Xw(t,e+1)}}},ct=(t,e,r=null,n=!0)=>{const s=t._transactionCleanups;
let i=!1,o=null;t._transaction===null&&(i=!0,t._transaction=new Zx(t,r,n),s.push(t._transaction),s.length===1&&t.emit("b\
eforeAllTransactions",[t]),t.emit("beforeTransaction",[t._transaction,t]));try{o=e(t._transaction)}finally{if(i){const a=t.
_transaction===s[0];t._transaction=null,a&&Xw(s,0)}}return o};function*rS(t){const e=$e(t.restDecoder);for(let r=0;r<e;r++){
const n=$e(t.restDecoder),s=t.readClient();let i=$e(t.restDecoder);for(let o=0;o<n;o++){const a=t.readInfo();if(a===10){
const c=$e(t.restDecoder);yield new nn(Oe(s,i),c),i+=c}else if((rd&a)!==0){const c=(a&(Kn|Wr))===0,l=new $t(Oe(s,i),null,
(a&Wr)===Wr?t.readLeftID():null,null,(a&Kn)===Kn?t.readRightID():null,c?t.readParentInfo()?t.readString():t.readLeftID():
null,c&&(a&da)===da?t.readString():null,g0(t,a));yield l,i+=l.length}else{const c=t.readLen();yield new rn(Oe(s,i),c),i+=
c}}}}class ap{constructor(e,r){this.gen=rS(e),this.curr=null,this.done=!1,this.filterSkips=r,this.next()}next(){do this.
curr=this.gen.next().value||null;while(this.filterSkips&&this.curr!==null&&this.curr.constructor===nn);return this.curr}}
class cp{constructor(e){this.currClient=0,this.startClock=0,this.written=0,this.encoder=e,this.clientStructs=[]}}const nS=t=>nl(
t,qw,Fa),sS=(t,e)=>{if(t.constructor===rn){const{client:r,clock:n}=t.id;return new rn(Oe(r,n+e),t.length-e)}else if(t.constructor===
nn){const{client:r,clock:n}=t.id;return new nn(Oe(r,n+e),t.length-e)}else{const r=t,{client:n,clock:s}=r.id;return new $t(
Oe(n,s+e),null,Oe(n,s+e-1),null,r.rightOrigin,r.parent,r.parentSub,r.content.splice(e))}},nl=(t,e=Vi,r=si)=>{if(t.length===
1)return t[0];const n=t.map(d=>new e(Zi(d)));let s=n.map(d=>new ap(d,!0)),i=null;const o=new r,a=new cp(o);for(;s=s.filter(
h=>h.curr!==null),s.sort((h,p)=>{if(h.curr.id.client===p.curr.id.client){const m=h.curr.id.clock-p.curr.id.clock;return m===
0?h.curr.constructor===p.curr.constructor?0:h.curr.constructor===nn?1:-1:m}else return p.curr.id.client-h.curr.id.client}),
s.length!==0;){const d=s[0],f=d.curr.id.client;if(i!==null){let h=d.curr,p=!1;for(;h!==null&&h.id.clock+h.length<=i.struct.
id.clock+i.struct.length&&h.id.client>=i.struct.id.client;)h=d.next(),p=!0;if(h===null||h.id.client!==f||p&&h.id.clock>i.
struct.id.clock+i.struct.length)continue;if(f!==i.struct.id.client)Rs(a,i.struct,i.offset),i={struct:h,offset:0},d.next();else if(i.
struct.id.clock+i.struct.length<h.id.clock)if(i.struct.constructor===nn)i.struct.length=h.id.clock+h.length-i.struct.id.
clock;else{Rs(a,i.struct,i.offset);const m=h.id.clock-i.struct.id.clock-i.struct.length;i={struct:new nn(Oe(f,i.struct.id.
clock+i.struct.length),m),offset:0}}else{const m=i.struct.id.clock+i.struct.length-h.id.clock;m>0&&(i.struct.constructor===
nn?i.struct.length-=m:h=sS(h,m)),i.struct.mergeWith(h)||(Rs(a,i.struct,i.offset),i={struct:h,offset:0},d.next())}}else i=
{struct:d.curr,offset:0},d.next();for(let h=d.curr;h!==null&&h.id.client===f&&h.id.clock===i.struct.id.clock+i.struct.length&&
h.constructor!==nn;h=d.next())Rs(a,i.struct,i.offset),i={struct:h,offset:0}}i!==null&&(Rs(a,i.struct,i.offset),i=null),lp(
a);const c=n.map(d=>sp(d)),l=Dx(c);return to(o,l),o.toUint8Array()},iS=(t,e,r=Vi,n=si)=>{const s=Hw(e),i=new n,o=new cp(
i),a=new r(Zi(t)),c=new ap(a,!1);for(;c.curr;){const d=c.curr,f=d.id.client,h=s.get(f)||0;if(c.curr.constructor===nn){c.
next();continue}if(d.id.clock+d.length>h)for(Rs(o,d,ui(h-d.id.clock,0)),c.next();c.curr&&c.curr.id.client===f;)Rs(o,c.curr,
0),c.next();else for(;c.curr&&c.curr.id.client===f&&c.curr.id.clock+c.curr.length<=h;)c.next()}lp(o);const l=sp(a);return to(
i,l),i.toUint8Array()},Zw=t=>{t.written>0&&(t.clientStructs.push({written:t.written,restEncoder:Rn(t.encoder.restEncoder)}),
t.encoder.restEncoder=nd(),t.written=0)},Rs=(t,e,r)=>{t.written>0&&t.currClient!==e.id.client&&Zw(t),t.written===0&&(t.currClient=
e.id.client,t.encoder.writeClient(e.id.client),Pe(t.encoder.restEncoder,e.id.clock+r)),e.write(t.encoder,r),t.written++},
lp=t=>{Zw(t);const e=t.encoder.restEncoder;Pe(e,t.clientStructs.length);for(let r=0;r<t.clientStructs.length;r++){const n=t.
clientStructs[r];Pe(e,n.written),sd(e,n.restEncoder)}},oS=(t,e,r)=>{const n=new e(Zi(t)),s=new ap(n,!1),i=new r,o=new cp(
i);for(let c=s.curr;c!==null;c=s.next())Rs(o,c,0);lp(o);const a=sp(n);return to(i,a),i.toUint8Array()},aS=t=>oS(t,Vi,Fa);
class hd{constructor(e,r){this.target=e,this.currentTarget=e,this.transaction=r,this._changes=null,this._keys=null,this.
_delta=null}get path(){return cS(this.currentTarget,this.target)}deletes(e){return Uw(this.transaction.deleteSet,e.id)}get keys(){
if(this._keys===null){const e=new Map,r=this.target;this.transaction.changed.get(r).forEach(s=>{if(s!==null){const i=r._map.
get(s);let o,a;if(this.adds(i)){let c=i.left;for(;c!==null&&this.adds(c);)c=c.left;if(this.deletes(i))if(c!==null&&this.
deletes(c))o="delete",a=qd(c.content.getContent());else return;else c!==null&&this.deletes(c)?(o="update",a=qd(c.content.
getContent())):(o="add",a=void 0)}else if(this.deletes(i))o="delete",a=qd(i.content.getContent());else return;e.set(s,{action:o,
oldValue:a})}}),this._keys=e}return this._keys}get delta(){return this.changes.delta}adds(e){return e.id.clock>=(this.transaction.
beforeState.get(e.id.client)||0)}get changes(){let e=this._changes;if(e===null){const r=this.target,n=ji(),s=ji(),i=[];if(e=
{added:n,deleted:s,delta:i,keys:this.keys},this.transaction.changed.get(r).has(null)){let a=null;const c=()=>{a&&i.push(
a)};for(let l=r._start;l!==null;l=l.right)l.deleted?this.deletes(l)&&!this.adds(l)&&((a===null||a.delete===void 0)&&(c(),
a={delete:0}),a.delete+=l.length,s.add(l)):this.adds(l)?((a===null||a.insert===void 0)&&(c(),a={insert:[]}),a.insert=a.insert.
concat(l.content.getContent()),n.add(l)):((a===null||a.retain===void 0)&&(c(),a={retain:0}),a.retain+=l.length);a!==null&&
a.retain===void 0&&c()}this._changes=e}return e}}const cS=(t,e)=>{const r=[];for(;e._item!==null&&e!==t;){if(e._item.parentSub!==
null)r.unshift(e._item.parentSub);else{let n=0,s=e._item.parent._start;for(;s!==e._item&&s!==null;)s.deleted||n++,s=s.right;
r.unshift(n)}e=e._item.parent}return r},e0=80;let dp=0;class lS{constructor(e,r){e.marker=!0,this.p=e,this.index=r,this.
timestamp=dp++}}const dS=t=>{t.timestamp=dp++},t0=(t,e,r)=>{t.p.marker=!1,t.p=e,e.marker=!0,t.index=r,t.timestamp=dp++},
uS=(t,e,r)=>{if(t.length>=e0){const n=t.reduce((s,i)=>s.timestamp<i.timestamp?s:i);return t0(n,e,r),n}else{const n=new lS(
e,r);return t.push(n),n}},pd=(t,e)=>{if(t._start===null||e===0||t._searchMarker===null)return null;const r=t._searchMarker.
length===0?null:t._searchMarker.reduce((i,o)=>Tc(e-i.index)<Tc(e-o.index)?i:o);let n=t._start,s=0;for(r!==null&&(n=r.p,s=
r.index,dS(r));n.right!==null&&s<e;){if(!n.deleted&&n.countable){if(e<s+n.length)break;s+=n.length}n=n.right}for(;n.left!==
null&&s>e;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);for(;n.left!==null&&n.left.id.client===n.id.client&&n.left.id.
clock+n.left.length===n.id.clock;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);return r!==null&&Tc(r.index-s)<n.parent.
length/e0?(t0(r,n,s),r):uS(t._searchMarker,n,s)},ba=(t,e,r)=>{for(let n=t.length-1;n>=0;n--){const s=t[n];if(r>0){let i=s.
p;for(i.marker=!1;i&&(i.deleted||!i.countable);)i=i.left,i&&!i.deleted&&i.countable&&(s.index-=i.length);if(i===null||i.
marker===!0){t.splice(n,1);continue}s.p=i,i.marker=!0}(e<s.index||r>0&&e===s.index)&&(s.index=ui(e,s.index+r))}},md=(t,e,r)=>{
const n=t,s=e.changedParentTypes;for(;Gs(s,t,()=>[]).push(r),t._item!==null;)t=t._item.parent;Kw(n._eH,r,e)};class Yt{constructor(){
this._item=null,this._map=new Map,this._start=null,this.doc=null,this._length=0,this._eH=Um(),this._dEH=Um(),this._searchMarker=
null}get parent(){return this._item?this._item.parent:null}_integrate(e,r){this.doc=e,this._item=r}_copy(){throw mn()}clone(){
throw mn()}_write(e){}get _first(){let e=this._start;for(;e!==null&&e.deleted;)e=e.right;return e}_callObserver(e,r){!e.
local&&this._searchMarker&&(this._searchMarker.length=0)}observe(e){Fm(this._eH,e)}observeDeep(e){Fm(this._dEH,e)}unobserve(e){
zm(this._eH,e)}unobserveDeep(e){zm(this._dEH,e)}toJSON(){}}const r0=(t,e,r)=>{e<0&&(e=t._length+e),r<0&&(r=t._length+r);
let n=r-e;const s=[];let i=t._start;for(;i!==null&&n>0;){if(i.countable&&!i.deleted){const o=i.content.getContent();if(o.
length<=e)e-=o.length;else{for(let a=e;a<o.length&&n>0;a++)s.push(o[a]),n--;e=0}}i=i.right}return s},n0=t=>{const e=[];let r=t.
_start;for(;r!==null;){if(r.countable&&!r.deleted){const n=r.content.getContent();for(let s=0;s<n.length;s++)e.push(n[s])}
r=r.right}return e},ya=(t,e)=>{let r=0,n=t._start;for(;n!==null;){if(n.countable&&!n.deleted){const s=n.content.getContent();
for(let i=0;i<s.length;i++)e(s[i],r++,t)}n=n.right}},s0=(t,e)=>{const r=[];return ya(t,(n,s)=>{r.push(e(n,s,t))}),r},fS=t=>{
let e=t._start,r=null,n=0;return{[Symbol.iterator](){return this},next:()=>{if(r===null){for(;e!==null&&e.deleted;)e=e.right;
if(e===null)return{done:!0,value:void 0};r=e.content.getContent(),n=0,e=e.right}const s=r[n++];return r.length<=n&&(r=null),
{done:!1,value:s}}}},i0=(t,e)=>{const r=pd(t,e);let n=t._start;for(r!==null&&(n=r.p,e-=r.index);n!==null;n=n.right)if(!n.
deleted&&n.countable){if(e<n.length)return n.content.getContent()[e];e-=n.length}},sl=(t,e,r,n)=>{let s=r;const i=t.doc,
o=i.clientID,a=i.store,c=r===null?e._start:r.right;let l=[];const d=()=>{l.length>0&&(s=new $t(Oe(o,jt(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new oi(l)),s.integrate(t,0),l=[])};n.forEach(f=>{if(f===null)l.push(f);else switch(f.constructor){case Number:case Object:case Boolean:case Array:case String:
l.push(f);break;default:switch(d(),f.constructor){case Uint8Array:case ArrayBuffer:s=new $t(Oe(o,jt(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new za(new Uint8Array(f))),s.integrate(t,0);break;case ro:s=new $t(Oe(o,jt(a,o)),s,s&&s.lastId,c,c&&c.id,
e,null,new qa(f)),s.integrate(t,0);break;default:if(f instanceof Yt)s=new $t(Oe(o,jt(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,
new rs(f)),s.integrate(t,0);else throw new Error("Unexpected content type in insert operation")}}}),d()},o0=es("Length e\
xceeded!"),a0=(t,e,r,n)=>{if(r>e._length)throw o0;if(r===0)return e._searchMarker&&ba(e._searchMarker,r,n.length),sl(t,e,
null,n);const s=r,i=pd(e,r);let o=e._start;for(i!==null&&(o=i.p,r-=i.index,r===0&&(o=o.prev,r+=o&&o.countable&&!o.deleted?
o.length:0));o!==null;o=o.right)if(!o.deleted&&o.countable){if(r<=o.length){r<o.length&&Fs(t,Oe(o.id.client,o.id.clock+r));
break}r-=o.length}return e._searchMarker&&ba(e._searchMarker,s,n.length),sl(t,e,o,n)},hS=(t,e,r)=>{let s=(e._searchMarker||
[]).reduce((i,o)=>o.index>i.index?o:i,{index:0,p:e._start}).p;if(s)for(;s.right;)s=s.right;return sl(t,e,s,r)},c0=(t,e,r,n)=>{
if(n===0)return;const s=r,i=n,o=pd(e,r);let a=e._start;for(o!==null&&(a=o.p,r-=o.index);a!==null&&r>0;a=a.right)!a.deleted&&
a.countable&&(r<a.length&&Fs(t,Oe(a.id.client,a.id.clock+r)),r-=a.length);for(;n>0&&a!==null;)a.deleted||(n<a.length&&Fs(
t,Oe(a.id.client,a.id.clock+n)),a.delete(t),n-=a.length),a=a.right;if(n>0)throw o0;e._searchMarker&&ba(e._searchMarker,s,
-i+n)},il=(t,e,r)=>{const n=e._map.get(r);n!==void 0&&n.delete(t)},up=(t,e,r,n)=>{const s=e._map.get(r)||null,i=t.doc,o=i.
clientID;let a;if(n==null)a=new oi([n]);else switch(n.constructor){case Number:case Object:case Boolean:case Array:case String:
a=new oi([n]);break;case Uint8Array:a=new za(n);break;case ro:a=new qa(n);break;default:if(n instanceof Yt)a=new rs(n);else
throw new Error("Unexpected content type")}new $t(Oe(o,jt(i.store,o)),s,s&&s.lastId,null,null,e,r,a).integrate(t,0)},fp=(t,e)=>{
const r=t._map.get(e);return r!==void 0&&!r.deleted?r.content.getContent()[r.length-1]:void 0},l0=t=>{const e={};return t.
_map.forEach((r,n)=>{r.deleted||(e[n]=r.content.getContent()[r.length-1])}),e},d0=(t,e)=>{const r=t._map.get(e);return r!==
void 0&&!r.deleted},ic=t=>Bx(t.entries(),e=>!e[1].deleted);class pS extends hd{constructor(e,r){super(e,r),this._transaction=
r}}class Pi extends Yt{constructor(){super(),this._prelimContent=[],this._searchMarker=[]}static from(e){const r=new Pi;
return r.push(e),r}_integrate(e,r){super._integrate(e,r),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){
return new Pi}clone(){const e=new Pi;return e.insert(0,this.toArray().map(r=>r instanceof Yt?r.clone():r)),e}get length(){
return this._prelimContent===null?this._length:this._prelimContent.length}_callObserver(e,r){super._callObserver(e,r),md(
this,e,new pS(this,e))}insert(e,r){this.doc!==null?ct(this.doc,n=>{a0(n,this,e,r)}):this._prelimContent.splice(e,0,...r)}push(e){
this.doc!==null?ct(this.doc,r=>{hS(r,this,e)}):this._prelimContent.push(...e)}unshift(e){this.insert(0,e)}delete(e,r=1){
this.doc!==null?ct(this.doc,n=>{c0(n,this,e,r)}):this._prelimContent.splice(e,r)}get(e){return i0(this,e)}toArray(){return n0(
this)}slice(e=0,r=this.length){return r0(this,e,r)}toJSON(){return this.map(e=>e instanceof Yt?e.toJSON():e)}map(e){return s0(
this,e)}forEach(e){ya(this,e)}[Symbol.iterator](){return fS(this)}_write(e){e.writeTypeRef(PS)}}const mS=t=>new Pi;class gS extends hd{constructor(e,r,n){
super(e,r),this.keysChanged=n}}class Yn extends Yt{constructor(e){super(),this._prelimContent=null,e===void 0?this._prelimContent=
new Map:this._prelimContent=new Map(e)}_integrate(e,r){super._integrate(e,r),this._prelimContent.forEach((n,s)=>{this.set(
s,n)}),this._prelimContent=null}_copy(){return new Yn}clone(){const e=new Yn;return this.forEach((r,n)=>{e.set(n,r instanceof
Yt?r.clone():r)}),e}_callObserver(e,r){md(this,e,new gS(this,e,r))}toJSON(){const e={};return this._map.forEach((r,n)=>{
if(!r.deleted){const s=r.content.getContent()[r.length-1];e[n]=s instanceof Yt?s.toJSON():s}}),e}get size(){return[...ic(
this._map)].length}keys(){return Qd(ic(this._map),e=>e[0])}values(){return Qd(ic(this._map),e=>e[1].content.getContent()[e[1].
length-1])}entries(){return Qd(ic(this._map),e=>[e[0],e[1].content.getContent()[e[1].length-1]])}forEach(e){this._map.forEach(
(r,n)=>{r.deleted||e(r.content.getContent()[r.length-1],n,this)})}[Symbol.iterator](){return this.entries()}delete(e){this.
doc!==null?ct(this.doc,r=>{il(r,this,e)}):this._prelimContent.delete(e)}set(e,r){return this.doc!==null?ct(this.doc,n=>{
up(n,this,e,r)}):this._prelimContent.set(e,r),r}get(e){return fp(this,e)}has(e){return d0(this,e)}clear(){this.doc!==null?
ct(this.doc,e=>{this.forEach(function(r,n,s){il(e,s,n)})}):this._prelimContent.clear()}_write(e){e.writeTypeRef(OS)}}const bS=t=>new Yn,
Ms=(t,e)=>t===e||typeof t=="object"&&typeof e=="object"&&t&&e&&Bk(t,e);class Af{constructor(e,r,n,s){this.left=e,this.right=
r,this.index=n,this.currentAttributes=s}forward(){switch(this.right===null&&on(),this.right.content.constructor){case Nt:
this.right.deleted||no(this.currentAttributes,this.right.content);break;default:this.right.deleted||(this.index+=this.right.
length);break}this.left=this.right,this.right=this.right.right}}const Wm=(t,e,r)=>{for(;e.right!==null&&r>0;){switch(e.right.
content.constructor){case Nt:e.right.deleted||no(e.currentAttributes,e.right.content);break;default:e.right.deleted||(r<
e.right.length&&Fs(t,Oe(e.right.id.client,e.right.id.clock+r)),e.index+=e.right.length,r-=e.right.length);break}e.left=e.
right,e.right=e.right.right}return e},oc=(t,e,r)=>{const n=new Map,s=pd(e,r);if(s){const i=new Af(s.p.left,s.p,s.index,n);
return Wm(t,i,r-s.index)}else{const i=new Af(null,e._start,0,n);return Wm(t,i,r)}},u0=(t,e,r,n)=>{for(;r.right!==null&&(r.
right.deleted===!0||r.right.content.constructor===Nt&&Ms(n.get(r.right.content.key),r.right.content.value));)r.right.deleted||
n.delete(r.right.content.key),r.forward();const s=t.doc,i=s.clientID;n.forEach((o,a)=>{const c=r.left,l=r.right,d=new $t(
Oe(i,jt(s.store,i)),c,c&&c.lastId,l,l&&l.id,e,null,new Nt(a,o));d.integrate(t,0),r.right=d,r.forward()})},no=(t,e)=>{const{
key:r,value:n}=e;n===null?t.delete(r):t.set(r,n)},f0=(t,e)=>{for(;t.right!==null;){if(!(t.right.deleted||t.right.content.
constructor===Nt&&Ms(e[t.right.content.key]||null,t.right.content.value)))break;t.forward()}},h0=(t,e,r,n)=>{const s=t.doc,
i=s.clientID,o=new Map;for(const a in n){const c=n[a],l=r.currentAttributes.get(a)||null;if(!Ms(l,c)){o.set(a,l);const{left:d,
right:f}=r;r.right=new $t(Oe(i,jt(s.store,i)),d,d&&d.lastId,f,f&&f.id,e,null,new Nt(a,c)),r.right.integrate(t,0),r.forward()}}
return o},Yd=(t,e,r,n,s)=>{r.currentAttributes.forEach((h,p)=>{s[p]===void 0&&(s[p]=null)});const i=t.doc,o=i.clientID;f0(
r,s);const a=h0(t,e,r,s),c=n.constructor===String?new Ln(n):n instanceof Yt?new rs(n):new fi(n);let{left:l,right:d,index:f}=r;
e._searchMarker&&ba(e._searchMarker,r.index,c.getLength()),d=new $t(Oe(o,jt(i.store,o)),l,l&&l.lastId,d,d&&d.id,e,null,c),
d.integrate(t,0),r.right=d,r.index=f,r.forward(),u0(t,e,r,a)},Hm=(t,e,r,n,s)=>{const i=t.doc,o=i.clientID;f0(r,s);const a=h0(
t,e,r,s);e:for(;r.right!==null&&(n>0||a.size>0&&(r.right.deleted||r.right.content.constructor===Nt));){if(!r.right.deleted)
switch(r.right.content.constructor){case Nt:{const{key:c,value:l}=r.right.content,d=s[c];if(d!==void 0){if(Ms(d,l))a.delete(
c);else{if(n===0)break e;a.set(c,l)}r.right.delete(t)}else r.currentAttributes.set(c,l);break}default:n<r.right.length&&
Fs(t,Oe(r.right.id.client,r.right.id.clock+n)),n-=r.right.length;break}r.forward()}if(n>0){let c="";for(;n>0;n--)c+=`
`;r.right=new $t(Oe(o,jt(i.store,o)),r.left,r.left&&r.left.lastId,r.right,r.right&&r.right.id,e,null,new Ln(c)),r.right.
integrate(t,0),r.forward()}u0(t,e,r,a)},p0=(t,e,r,n,s)=>{let i=e;const o=pn();for(;i&&(!i.countable||i.deleted);){if(!i.
deleted&&i.content.constructor===Nt){const l=i.content;o.set(l.key,l)}i=i.right}let a=0,c=!1;for(;e!==i;){if(r===e&&(c=!0),
!e.deleted){const l=e.content;switch(l.constructor){case Nt:{const{key:d,value:f}=l,h=n.get(d)||null;(o.get(d)!==l||h===
f)&&(e.delete(t),a++,!c&&(s.get(d)||null)===f&&h!==f&&(h===null?s.delete(d):s.set(d,h))),!c&&!e.deleted&&no(s,l);break}}}
e=e.right}return a},yS=(t,e)=>{for(;e&&e.right&&(e.right.deleted||!e.right.countable);)e=e.right;const r=new Set;for(;e&&
(e.deleted||!e.countable);){if(!e.deleted&&e.content.constructor===Nt){const n=e.content.key;r.has(n)?e.delete(t):r.add(
n)}e=e.left}},wS=t=>{let e=0;return ct(t.doc,r=>{let n=t._start,s=t._start,i=pn();const o=mf(i);for(;s;){if(s.deleted===
!1)switch(s.content.constructor){case Nt:no(o,s.content);break;default:e+=p0(r,n,s,i,o),i=mf(o),n=s;break}s=s.right}}),e},
Vm=(t,e,r)=>{const n=r,s=mf(e.currentAttributes),i=e.right;for(;r>0&&e.right!==null;){if(e.right.deleted===!1)switch(e.right.
content.constructor){case rs:case fi:case Ln:r<e.right.length&&Fs(t,Oe(e.right.id.client,e.right.id.clock+r)),r-=e.right.
length,e.right.delete(t);break}e.forward()}i&&p0(t,i,e.right,s,e.currentAttributes);const o=(e.left||e.right).parent;return o.
_searchMarker&&ba(o._searchMarker,e.index,-n+r),e};class vS extends hd{constructor(e,r,n){super(e,r),this.childListChanged=
!1,this.keysChanged=new Set,n.forEach(s=>{s===null?this.childListChanged=!0:this.keysChanged.add(s)})}get changes(){if(this.
_changes===null){const e={keys:this.keys,delta:this.delta,added:new Set,deleted:new Set};this._changes=e}return this._changes}get delta(){
if(this._delta===null){const e=this.target.doc,r=[];ct(e,n=>{const s=new Map,i=new Map;let o=this.target._start,a=null;const c={};
let l="",d=0,f=0;const h=()=>{if(a!==null){let p=null;switch(a){case"delete":f>0&&(p={delete:f}),f=0;break;case"insert":
(typeof l=="object"||l.length>0)&&(p={insert:l},s.size>0&&(p.attributes={},s.forEach((m,b)=>{m!==null&&(p.attributes[b]=
m)}))),l="";break;case"retain":d>0&&(p={retain:d},Mk(c)||(p.attributes=Tk({},c))),d=0;break}p&&r.push(p),a=null}};for(;o!==
null;){switch(o.content.constructor){case rs:case fi:this.adds(o)?this.deletes(o)||(h(),a="insert",l=o.content.getContent()[0],
h()):this.deletes(o)?(a!=="delete"&&(h(),a="delete"),f+=1):o.deleted||(a!=="retain"&&(h(),a="retain"),d+=1);break;case Ln:
this.adds(o)?this.deletes(o)||(a!=="insert"&&(h(),a="insert"),l+=o.content.str):this.deletes(o)?(a!=="delete"&&(h(),a="d\
elete"),f+=o.length):o.deleted||(a!=="retain"&&(h(),a="retain"),d+=o.length);break;case Nt:{const{key:p,value:m}=o.content;
if(this.adds(o)){if(!this.deletes(o)){const b=s.get(p)||null;Ms(b,m)?m!==null&&o.delete(n):(a==="retain"&&h(),Ms(m,i.get(
p)||null)?delete c[p]:c[p]=m)}}else if(this.deletes(o)){i.set(p,m);const b=s.get(p)||null;Ms(b,m)||(a==="retain"&&h(),c[p]=
b)}else if(!o.deleted){i.set(p,m);const b=c[p];b!==void 0&&(Ms(b,m)?b!==null&&o.delete(n):(a==="retain"&&h(),m===null?delete c[p]:
c[p]=m))}o.deleted||(a==="insert"&&h(),no(s,o.content));break}}o=o.right}for(h();r.length>0;){const p=r[r.length-1];if(p.
retain!==void 0&&p.attributes===void 0)r.pop();else break}}),this._delta=r}return this._delta}}class Ki extends Yt{constructor(e){
super(),this._pending=e!==void 0?[()=>this.insert(0,e)]:[],this._searchMarker=[]}get length(){return this._length}_integrate(e,r){
super._integrate(e,r);try{this._pending.forEach(n=>n())}catch(n){console.error(n)}this._pending=null}_copy(){return new Ki}clone(){
const e=new Ki;return e.applyDelta(this.toDelta()),e}_callObserver(e,r){super._callObserver(e,r);const n=new vS(this,e,r),
s=e.doc;if(md(this,e,n),!e.local){let i=!1;for(const[o,a]of e.afterState.entries()){const c=e.beforeState.get(o)||0;if(a!==
c&&(Yw(e,s.store.clients.get(o),c,a,l=>{!l.deleted&&l.content.constructor===Nt&&(i=!0)}),i))break}i||kf(e,e.deleteSet,o=>{
o instanceof rn||i||o.parent===this&&o.content.constructor===Nt&&(i=!0)}),ct(s,o=>{i?wS(this):kf(o,o.deleteSet,a=>{a instanceof
rn||a.parent===this&&yS(o,a)})})}}toString(){let e="",r=this._start;for(;r!==null;)!r.deleted&&r.countable&&r.content.constructor===
Ln&&(e+=r.content.str),r=r.right;return e}toJSON(){return this.toString()}applyDelta(e,{sanitize:r=!0}={}){this.doc!==null?
ct(this.doc,n=>{const s=new Af(null,this._start,0,new Map);for(let i=0;i<e.length;i++){const o=e[i];if(o.insert!==void 0){
const a=!r&&typeof o.insert=="string"&&i===e.length-1&&s.right===null&&o.insert.slice(-1)===`
`?o.insert.slice(0,-1):o.insert;(typeof a!="string"||a.length>0)&&Yd(n,this,s,a,o.attributes||{})}else o.retain!==void 0?
Hm(n,this,s,o.retain,o.attributes||{}):o.delete!==void 0&&Vm(n,s,o.delete)}}):this._pending.push(()=>this.applyDelta(e))}toDelta(e,r,n){
const s=[],i=new Map,o=this.doc;let a="",c=this._start;function l(){if(a.length>0){const f={};let h=!1;i.forEach((m,b)=>{
h=!0,f[b]=m});const p={insert:a};h&&(p.attributes=f),s.push(p),a=""}}const d=()=>{for(;c!==null;){if(go(c,e)||r!==void 0&&
go(c,r))switch(c.content.constructor){case Ln:{const f=i.get("ychange");e!==void 0&&!go(c,e)?(f===void 0||f.user!==c.id.
client||f.type!=="removed")&&(l(),i.set("ychange",n?n("removed",c.id):{type:"removed"})):r!==void 0&&!go(c,r)?(f===void 0||
f.user!==c.id.client||f.type!=="added")&&(l(),i.set("ychange",n?n("added",c.id):{type:"added"})):f!==void 0&&(l(),i.delete(
"ychange")),a+=c.content.str;break}case rs:case fi:{l();const f={insert:c.content.getContent()[0]};if(i.size>0){const h={};
f.attributes=h,i.forEach((p,m)=>{h[m]=p})}s.push(f);break}case Nt:go(c,e)&&(l(),no(i,c.content));break}c=c.right}l()};return e||
r?ct(o,f=>{e&&xf(f,e),r&&xf(f,r),d()},"cleanup"):d(),s}insert(e,r,n){if(r.length<=0)return;const s=this.doc;s!==null?ct(
s,i=>{const o=oc(i,this,e);n||(n={},o.currentAttributes.forEach((a,c)=>{n[c]=a})),Yd(i,this,o,r,n)}):this._pending.push(
()=>this.insert(e,r,n))}insertEmbed(e,r,n={}){const s=this.doc;s!==null?ct(s,i=>{const o=oc(i,this,e);Yd(i,this,o,r,n)}):
this._pending.push(()=>this.insertEmbed(e,r,n))}delete(e,r){if(r===0)return;const n=this.doc;n!==null?ct(n,s=>{Vm(s,oc(s,
this,e),r)}):this._pending.push(()=>this.delete(e,r))}format(e,r,n){if(r===0)return;const s=this.doc;s!==null?ct(s,i=>{const o=oc(
i,this,e);o.right!==null&&Hm(i,this,o,r,n)}):this._pending.push(()=>this.format(e,r,n))}removeAttribute(e){this.doc!==null?
ct(this.doc,r=>{il(r,this,e)}):this._pending.push(()=>this.removeAttribute(e))}setAttribute(e,r){this.doc!==null?ct(this.
doc,n=>{up(n,this,e,r)}):this._pending.push(()=>this.setAttribute(e,r))}getAttribute(e){return fp(this,e)}getAttributes(){
return l0(this)}_write(e){e.writeTypeRef(US)}}const ES=t=>new Ki;class Xd{constructor(e,r=()=>!0){this._filter=r,this._root=
e,this._currentNode=e._start,this._firstCall=!0}[Symbol.iterator](){return this}next(){let e=this._currentNode,r=e&&e.content&&
e.content.type;if(e!==null&&(!this._firstCall||e.deleted||!this._filter(r)))do if(r=e.content.type,!e.deleted&&(r.constructor===
wa||r.constructor===ii)&&r._start!==null)e=r._start;else for(;e!==null;)if(e.right!==null){e=e.right;break}else e.parent===
this._root?e=null:e=e.parent._item;while(e!==null&&(e.deleted||!this._filter(e.content.type)));return this._firstCall=!1,
e===null?{value:void 0,done:!0}:(this._currentNode=e,{value:e.content.type,done:!1})}}class ii extends Yt{constructor(){
super(),this._prelimContent=[]}get firstChild(){const e=this._first;return e?e.content.getContent()[0]:null}_integrate(e,r){
super._integrate(e,r),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new ii}clone(){const e=new ii;
return e.insert(0,this.toArray().map(r=>r instanceof Yt?r.clone():r)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}createTreeWalker(e){return new Xd(this,e)}querySelector(e){e=e.toUpperCase();const n=new Xd(
this,s=>s.nodeName&&s.nodeName.toUpperCase()===e).next();return n.done?null:n.value}querySelectorAll(e){return e=e.toUpperCase(),
Us(new Xd(this,r=>r.nodeName&&r.nodeName.toUpperCase()===e))}_callObserver(e,r){md(this,e,new SS(this,r,e))}toString(){return s0(
this,e=>e.toString()).join("")}toJSON(){return this.toString()}toDOM(e=document,r={},n){const s=e.createDocumentFragment();
return n!==void 0&&n._createAssociation(s,this),ya(this,i=>{s.insertBefore(i.toDOM(e,r,n),null)}),s}insert(e,r){this.doc!==
null?ct(this.doc,n=>{a0(n,this,e,r)}):this._prelimContent.splice(e,0,...r)}insertAfter(e,r){if(this.doc!==null)ct(this.doc,
n=>{const s=e&&e instanceof Yt?e._item:e;sl(n,this,s,r)});else{const n=this._prelimContent,s=e===null?0:n.findIndex(i=>i===
e)+1;if(s===0&&e!==null)throw es("Reference item not found");n.splice(s,0,...r)}}delete(e,r=1){this.doc!==null?ct(this.doc,
n=>{c0(n,this,e,r)}):this._prelimContent.splice(e,r)}toArray(){return n0(this)}push(e){this.insert(this.length,e)}unshift(e){
this.insert(0,e)}get(e){return i0(this,e)}slice(e=0,r=this.length){return r0(this,e,r)}forEach(e){ya(this,e)}_write(e){e.
writeTypeRef(zS)}}const kS=t=>new ii;class wa extends ii{constructor(e="UNDEFINED"){super(),this.nodeName=e,this._prelimAttrs=
new Map}get nextSibling(){const e=this._item?this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this.
_item?this._item.prev:null;return e?e.content.type:null}_integrate(e,r){super._integrate(e,r),this._prelimAttrs.forEach(
(n,s)=>{this.setAttribute(s,n)}),this._prelimAttrs=null}_copy(){return new wa(this.nodeName)}clone(){const e=new wa(this.
nodeName),r=this.getAttributes();for(const n in r)e.setAttribute(n,r[n]);return e.insert(0,this.toArray().map(n=>n instanceof
Yt?n.clone():n)),e}toString(){const e=this.getAttributes(),r=[],n=[];for(const a in e)n.push(a);n.sort();const s=n.length;
for(let a=0;a<s;a++){const c=n[a];r.push(c+'="'+e[c]+'"')}const i=this.nodeName.toLocaleLowerCase(),o=r.length>0?" "+r.join(
" "):"";return`<${i}${o}>${super.toString()}</${i}>`}removeAttribute(e){this.doc!==null?ct(this.doc,r=>{il(r,this,e)}):this.
_prelimAttrs.delete(e)}setAttribute(e,r){this.doc!==null?ct(this.doc,n=>{up(n,this,e,r)}):this._prelimAttrs.set(e,r)}getAttribute(e){
return fp(this,e)}hasAttribute(e){return d0(this,e)}getAttributes(){return l0(this)}toDOM(e=document,r={},n){const s=e.createElement(
this.nodeName),i=this.getAttributes();for(const o in i)s.setAttribute(o,i[o]);return ya(this,o=>{s.appendChild(o.toDOM(e,
r,n))}),n!==void 0&&n._createAssociation(s,this),s}_write(e){e.writeTypeRef(FS),e.writeKey(this.nodeName)}}const xS=t=>new wa(
t.readKey());class SS extends hd{constructor(e,r,n){super(e,n),this.childListChanged=!1,this.attributesChanged=new Set,r.
forEach(s=>{s===null?this.childListChanged=!0:this.attributesChanged.add(s)})}}class ol extends Yn{constructor(e){super(),
this.hookName=e}_copy(){return new ol(this.hookName)}clone(){const e=new ol(this.hookName);return this.forEach((r,n)=>{e.
set(n,r)}),e}toDOM(e=document,r={},n){const s=r[this.hookName];let i;return s!==void 0?i=s.createDom(this):i=document.createElement(
this.hookName),i.setAttribute("data-yjs-hook",this.hookName),n!==void 0&&n._createAssociation(i,this),i}_write(e){e.writeTypeRef(
qS),e.writeKey(this.hookName)}}const AS=t=>new ol(t.readKey());class al extends Ki{get nextSibling(){const e=this._item?
this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this._item?this._item.prev:null;return e?e.content.
type:null}_copy(){return new al}clone(){const e=new al;return e.applyDelta(this.toDelta()),e}toDOM(e=document,r,n){const s=e.
createTextNode(this.toString());return n!==void 0&&n._createAssociation(s,this),s}toString(){return this.toDelta().map(e=>{
const r=[];for(const s in e.attributes){const i=[];for(const o in e.attributes[s])i.push({key:o,value:e.attributes[s][o]});
i.sort((o,a)=>o.key<a.key?-1:1),r.push({nodeName:s,attrs:i})}r.sort((s,i)=>s.nodeName<i.nodeName?-1:1);let n="";for(let s=0;s<
r.length;s++){const i=r[s];n+=`<${i.nodeName}`;for(let o=0;o<i.attrs.length;o++){const a=i.attrs[o];n+=` ${a.key}="${a.value}\
"`}n+=">"}n+=e.insert;for(let s=r.length-1;s>=0;s--)n+=`</${r[s].nodeName}>`;return n}).join("")}toJSON(){return this.toString()}_write(e){
e.writeTypeRef(jS)}}const IS=t=>new al;class hp{constructor(e,r){this.id=e,this.length=r}get deleted(){throw mn()}mergeWith(e){
return!1}write(e,r,n){throw mn()}integrate(e,r){throw mn()}}const _S=0;class rn extends hp{get deleted(){return!0}delete(){}mergeWith(e){
return this.constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,r){r>0&&(this.id.clock+=r,this.length-=
r),Jw(e.doc.store,this)}write(e,r){e.writeInfo(_S),e.writeLen(this.length-r)}getMissing(e,r){return null}}class za{constructor(e){
this.content=e}getLength(){return 1}getContent(){return[this.content]}isCountable(){return!0}copy(){return new za(this.content)}splice(e){
throw mn()}mergeWith(e){return!1}integrate(e,r){}delete(e){}gc(e){}write(e,r){e.writeBuf(this.content)}getRef(){return 3}}
const CS=t=>new za(t.readBuf());class va{constructor(e){this.len=e}getLength(){return this.len}getContent(){return[]}isCountable(){
return!1}copy(){return new va(this.len)}splice(e){const r=new va(this.len-e);return this.len=e,r}mergeWith(e){return this.
len+=e.len,!0}integrate(e,r){tl(e.deleteSet,r.id.client,r.id.clock,this.len),r.markDeleted()}delete(e){}gc(e){}write(e,r){
e.writeLen(this.len-r)}getRef(){return 1}}const TS=t=>new va(t.readLen()),m0=(t,e)=>new ro({guid:t,...e,shouldLoad:e.shouldLoad||
e.autoLoad||!1});class qa{constructor(e){e._item&&console.error("This document was already integrated as a sub-document.\
 You should create a second instance instead with the same guid."),this.doc=e;const r={};this.opts=r,e.gc||(r.gc=!1),e.autoLoad&&
(r.autoLoad=!0),e.meta!==null&&(r.meta=e.meta)}getLength(){return 1}getContent(){return[this.doc]}isCountable(){return!0}copy(){
return new qa(m0(this.doc.guid,this.opts))}splice(e){throw mn()}mergeWith(e){return!1}integrate(e,r){this.doc._item=r,e.
subdocsAdded.add(this.doc),this.doc.shouldLoad&&e.subdocsLoaded.add(this.doc)}delete(e){e.subdocsAdded.has(this.doc)?e.subdocsAdded.
delete(this.doc):e.subdocsRemoved.add(this.doc)}gc(e){}write(e,r){e.writeString(this.doc.guid),e.writeAny(this.opts)}getRef(){
return 9}}const RS=t=>new qa(m0(t.readString(),t.readAny()));class fi{constructor(e){this.embed=e}getLength(){return 1}getContent(){
return[this.embed]}isCountable(){return!0}copy(){return new fi(this.embed)}splice(e){throw mn()}mergeWith(e){return!1}integrate(e,r){}delete(e){}gc(e){}write(e,r){
e.writeJSON(this.embed)}getRef(){return 5}}const MS=t=>new fi(t.readJSON());class Nt{constructor(e,r){this.key=e,this.value=
r}getLength(){return 1}getContent(){return[]}isCountable(){return!1}copy(){return new Nt(this.key,this.value)}splice(e){
throw mn()}mergeWith(e){return!1}integrate(e,r){r.parent._searchMarker=null}delete(e){}gc(e){}write(e,r){e.writeKey(this.
key),e.writeJSON(this.value)}getRef(){return 6}}const BS=t=>new Nt(t.readKey(),t.readJSON());class cl{constructor(e){this.
arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new cl(this.arr)}splice(e){
const r=new cl(this.arr.slice(e));return this.arr=this.arr.slice(0,e),r}mergeWith(e){return this.arr=this.arr.concat(e.arr),
!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){const n=this.arr.length;e.writeLen(n-r);for(let s=r;s<n;s++){const i=this.
arr[s];e.writeString(i===void 0?"undefined":JSON.stringify(i))}}getRef(){return 2}}const LS=t=>{const e=t.readLen(),r=[];
for(let n=0;n<e;n++){const s=t.readString();s==="undefined"?r.push(void 0):r.push(JSON.parse(s))}return new cl(r)};class oi{constructor(e){
this.arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new oi(this.
arr)}splice(e){const r=new oi(this.arr.slice(e));return this.arr=this.arr.slice(0,e),r}mergeWith(e){return this.arr=this.
arr.concat(e.arr),!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){const n=this.arr.length;e.writeLen(n-r);for(let s=r;s<
n;s++){const i=this.arr[s];e.writeAny(i)}}getRef(){return 8}}const DS=t=>{const e=t.readLen(),r=[];for(let n=0;n<e;n++)r.
push(t.readAny());return new oi(r)};class Ln{constructor(e){this.str=e}getLength(){return this.str.length}getContent(){return this.
str.split("")}isCountable(){return!0}copy(){return new Ln(this.str)}splice(e){const r=new Ln(this.str.slice(e));this.str=
this.str.slice(0,e);const n=this.str.charCodeAt(e-1);return n>=55296&&n<=56319&&(this.str=this.str.slice(0,e-1)+"�",r.
str="�"+r.str.slice(1)),r}mergeWith(e){return this.str+=e.str,!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){e.writeString(
r===0?this.str:this.str.slice(r))}getRef(){return 4}}const $S=t=>new Ln(t.readString()),NS=[mS,bS,ES,xS,kS,AS,IS],PS=0,OS=1,
US=2,FS=3,zS=4,qS=5,jS=6;class rs{constructor(e){this.type=e}getLength(){return 1}getContent(){return[this.type]}isCountable(){
return!0}copy(){return new rs(this.type._copy())}splice(e){throw mn()}mergeWith(e){return!1}integrate(e,r){this.type._integrate(
e.doc,r)}delete(e){let r=this.type._start;for(;r!==null;)r.deleted?e._mergeStructs.push(r):r.delete(e),r=r.right;this.type.
_map.forEach(n=>{n.deleted?e._mergeStructs.push(n):n.delete(e)}),e.changed.delete(this.type)}gc(e){let r=this.type._start;
for(;r!==null;)r.gc(e,!0),r=r.right;this.type._start=null,this.type._map.forEach(n=>{for(;n!==null;)n.gc(e,!0),n=n.left}),
this.type._map=new Map}write(e,r){this.type._write(e)}getRef(){return 7}}const GS=t=>new rs(NS[t.readTypeRef()](t)),ll=(t,e,r)=>{
const{client:n,clock:s}=e.id,i=new $t(Oe(n,s+r),e,Oe(n,s+r-1),e.right,e.rightOrigin,e.parent,e.parentSub,e.content.splice(
r));return e.deleted&&i.markDeleted(),e.keep&&(i.keep=!0),e.redone!==null&&(i.redone=Oe(e.redone.client,e.redone.clock+r)),
e.right=i,i.right!==null&&(i.right.left=i),t._mergeStructs.push(i),i.parentSub!==null&&i.right===null&&i.parent._map.set(
i.parentSub,i),e.length=r,i};class $t extends hp{constructor(e,r,n,s,i,o,a,c){super(e,c.getLength()),this.origin=n,this.
left=r,this.right=s,this.rightOrigin=i,this.parent=o,this.parentSub=a,this.redone=null,this.content=c,this.info=this.content.
isCountable()?_m:0}set marker(e){(this.info&Gd)>0!==e&&(this.info^=Gd)}get marker(){return(this.info&Gd)>0}get keep(){return(this.
info&Im)>0}set keep(e){this.keep!==e&&(this.info^=Im)}get countable(){return(this.info&_m)>0}get deleted(){return(this.info&
jd)>0}set deleted(e){this.deleted!==e&&(this.info^=jd)}markDeleted(){this.info|=jd}getMissing(e,r){if(this.origin&&this.
origin.client!==this.id.client&&this.origin.clock>=jt(r,this.origin.client))return this.origin.client;if(this.rightOrigin&&
this.rightOrigin.client!==this.id.client&&this.rightOrigin.clock>=jt(r,this.rightOrigin.client))return this.rightOrigin.
client;if(this.parent&&this.parent.constructor===Ni&&this.id.client!==this.parent.client&&this.parent.clock>=jt(r,this.parent.
client))return this.parent.client;if(this.origin&&(this.left=qm(e,r,this.origin),this.origin=this.left.lastId),this.rightOrigin&&
(this.right=Fs(e,this.rightOrigin),this.rightOrigin=this.right.id),(this.left&&this.left.constructor===rn||this.right&&this.
right.constructor===rn)&&(this.parent=null),!this.parent)this.left&&this.left.constructor===$t&&(this.parent=this.left.parent,
this.parentSub=this.left.parentSub),this.right&&this.right.constructor===$t&&(this.parent=this.right.parent,this.parentSub=
this.right.parentSub);else if(this.parent.constructor===Ni){const n=Jd(r,this.parent);n.constructor===rn?this.parent=null:
this.parent=n.content.type}return null}integrate(e,r){if(r>0&&(this.id.clock+=r,this.left=qm(e,e.doc.store,Oe(this.id.client,
this.id.clock-1)),this.origin=this.left.lastId,this.content=this.content.splice(r),this.length-=r),this.parent){if(!this.
left&&(!this.right||this.right.left!==null)||this.left&&this.left.right!==this.right){let n=this.left,s;if(n!==null)s=n.
right;else if(this.parentSub!==null)for(s=this.parent._map.get(this.parentSub)||null;s!==null&&s.left!==null;)s=s.left;else
s=this.parent._start;const i=new Set,o=new Set;for(;s!==null&&s!==this.right;){if(o.add(s),i.add(s),sc(this.origin,s.origin)){
if(s.id.client<this.id.client)n=s,i.clear();else if(sc(this.rightOrigin,s.rightOrigin))break}else if(s.origin!==null&&o.
has(Jd(e.doc.store,s.origin)))i.has(Jd(e.doc.store,s.origin))||(n=s,i.clear());else break;s=s.right}this.left=n}if(this.
left!==null){const n=this.left.right;this.right=n,this.left.right=this}else{let n;if(this.parentSub!==null)for(n=this.parent.
_map.get(this.parentSub)||null;n!==null&&n.left!==null;)n=n.left;else n=this.parent._start,this.parent._start=this;this.
right=n}this.right!==null?this.right.left=this:this.parentSub!==null&&(this.parent._map.set(this.parentSub,this),this.left!==
null&&this.left.delete(e)),this.parentSub===null&&this.countable&&!this.deleted&&(this.parent._length+=this.length),Jw(e.
doc.store,this),this.content.integrate(e,this),Gm(e,this.parent,this.parentSub),(this.parent._item!==null&&this.parent._item.
deleted||this.parentSub!==null&&this.right!==null)&&this.delete(e)}else new rn(this.id,this.length).integrate(e,0)}get next(){
let e=this.right;for(;e!==null&&e.deleted;)e=e.right;return e}get prev(){let e=this.left;for(;e!==null&&e.deleted;)e=e.left;
return e}get lastId(){return this.length===1?this.id:Oe(this.id.client,this.id.clock+this.length-1)}mergeWith(e){if(this.
constructor===e.constructor&&sc(e.origin,this.lastId)&&this.right===e&&sc(this.rightOrigin,e.rightOrigin)&&this.id.client===
e.id.client&&this.id.clock+this.length===e.id.clock&&this.deleted===e.deleted&&this.redone===null&&e.redone===null&&this.
content.constructor===e.content.constructor&&this.content.mergeWith(e.content)){const r=this.parent._searchMarker;return r&&
r.forEach(n=>{n.p===e&&(n.p=this,!this.deleted&&this.countable&&(n.index-=this.length))}),e.keep&&(this.keep=!0),this.right=
e.right,this.right!==null&&(this.right.left=this),this.length+=e.length,!0}return!1}delete(e){if(!this.deleted){const r=this.
parent;this.countable&&this.parentSub===null&&(r._length-=this.length),this.markDeleted(),tl(e.deleteSet,this.id.client,
this.id.clock,this.length),Gm(e,r,this.parentSub),this.content.delete(e)}}gc(e,r){if(!this.deleted)throw on();this.content.
gc(e),r?Xx(e,this,new rn(this.id,this.length)):this.content=new va(this.length)}write(e,r){const n=r>0?Oe(this.id.client,
this.id.clock+r-1):this.origin,s=this.rightOrigin,i=this.parentSub,o=this.content.getRef()&rd|(n===null?0:Wr)|(s===null?
0:Kn)|(i===null?0:da);if(e.writeInfo(o),n!==null&&e.writeLeftID(n),s!==null&&e.writeRightID(s),n===null&&s===null){const a=this.
parent;if(a._item!==void 0){const c=a._item;if(c===null){const l=Jx(a);e.writeParentInfo(!0),e.writeString(l)}else e.writeParentInfo(
!1),e.writeLeftID(c.id)}else a.constructor===String?(e.writeParentInfo(!0),e.writeString(a)):a.constructor===Ni?(e.writeParentInfo(
!1),e.writeLeftID(a)):on();i!==null&&e.writeString(i)}this.content.write(e,r)}}const g0=(t,e)=>WS[e&rd](t),WS=[()=>{on()},
TS,LS,CS,$S,MS,BS,GS,DS,RS,()=>{on()}],HS=10;class nn extends hp{get deleted(){return!0}delete(){}mergeWith(e){return this.
constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,r){on()}write(e,r){e.writeInfo(HS),Pe(e.restEncoder,
this.length-r)}getMissing(e,r){return null}}const b0=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<
"u"?global:{},y0="__ $YJS$ __";b0[y0]===!0&&console.error("Yjs was already imported. This breaks constructor checks and \
will lead to issues! - https://github.com/yjs/yjs/issues/438");b0[y0]=!0;const hi=t=>Wi((e,r)=>{t.onerror=n=>r(new Error(
n.target.error)),t.onsuccess=n=>e(n.target.result)}),VS=(t,e)=>Wi((r,n)=>{const s=indexedDB.open(t);s.onupgradeneeded=i=>e(
i.target.result),s.onerror=i=>n(es(i.target.error)),s.onsuccess=i=>{const o=i.target.result;o.onversionchange=()=>{o.close()},
r(o)}}),KS=t=>hi(indexedDB.deleteDatabase(t)),QS=(t,e)=>e.forEach(r=>t.createObjectStore.apply(t,r)),qo=(t,e,r="readwrit\
e")=>{const n=t.transaction(e,r);return e.map(s=>nA(n,s))},w0=(t,e)=>hi(t.count(e)),JS=(t,e)=>hi(t.get(e)),v0=(t,e)=>hi(
t.delete(e)),YS=(t,e,r)=>hi(t.put(e,r)),If=(t,e)=>hi(t.add(e)),XS=(t,e,r)=>hi(t.getAll(e,r)),ZS=(t,e,r)=>{let n=null;return rA(
t,e,s=>(n=s,!1),r).then(()=>n)},eA=(t,e=null)=>ZS(t,e,"prev"),tA=(t,e)=>Wi((r,n)=>{t.onerror=n,t.onsuccess=async s=>{const i=s.
target.result;if(i===null||await e(i)===!1)return r();i.continue()}}),rA=(t,e,r,n="next")=>tA(t.openKeyCursor(e,n),s=>r(
s.key)),nA=(t,e)=>t.objectStore(e),sA=(t,e)=>IDBKeyRange.upperBound(t,e),iA=(t,e)=>IDBKeyRange.lowerBound(t,e),Zd="custo\
m",E0="updates",k0=500,x0=(t,e=()=>{},r=()=>{})=>{const[n]=qo(t.db,[E0]);return XS(n,iA(t._dbref,!1)).then(s=>{t._destroyed||
(e(n),ct(t.doc,()=>{s.forEach(i=>rl(t.doc,i))},t,!1),r(n))}).then(()=>eA(n).then(s=>{t._dbref=s+1})).then(()=>w0(n).then(
s=>{t._dbsize=s})).then(()=>n)},oA=(t,e=!0)=>x0(t).then(r=>{(e||t._dbsize>=k0)&&If(r,op(t.doc)).then(()=>v0(r,sA(t._dbref,
!0))).then(()=>w0(r).then(n=>{t._dbsize=n}))});class aA extends Gh{constructor(e,r){super(),this.doc=r,this.name=e,this.
_dbref=0,this._dbsize=0,this._destroyed=!1,this.db=null,this.synced=!1,this._db=VS(e,n=>QS(n,[["updates",{autoIncrement:!0}],
["custom"]])),this.whenSynced=Wi(n=>this.on("synced",()=>n(this))),this._db.then(n=>{this.db=n,x0(this,o=>If(o,op(r)),()=>{
if(this._destroyed)return this;this.synced=!0,this.emit("synced",[this])})}),this._storeTimeout=1e3,this._storeTimeoutId=
null,this._storeUpdate=(n,s)=>{if(this.db&&s!==this){const[i]=qo(this.db,[E0]);If(i,n),++this._dbsize>=k0&&(this._storeTimeoutId!==
null&&clearTimeout(this._storeTimeoutId),this._storeTimeoutId=setTimeout(()=>{oA(this,!1),this._storeTimeoutId=null},this.
_storeTimeout))}},r.on("update",this._storeUpdate),this.destroy=this.destroy.bind(this),r.on("destroy",this.destroy)}destroy(){
return this._storeTimeoutId&&clearTimeout(this._storeTimeoutId),this.doc.off("update",this._storeUpdate),this.doc.off("d\
estroy",this.destroy),this._destroyed=!0,this._db.then(e=>{e.close()})}clearData(){return this.destroy().then(()=>{KS(this.
name)})}get(e){return this._db.then(r=>{const[n]=qo(r,[Zd],"readonly");return JS(n,e)})}set(e,r){return this._db.then(n=>{
const[s]=qo(n,[Zd]);return YS(s,r,e)})}del(e){return this._db.then(r=>{const[n]=qo(r,[Zd]);return v0(n,e)})}}const Km="y\
js-update",Qm="yjs-sync-request",Jm="yjs-sync-response";function eu(t){return t instanceof Uint8Array?t:Array.isArray(t)?
new Uint8Array(t):t&&typeof t=="object"?new Uint8Array(Object.values(t)):new Uint8Array(0)}class cA extends Gh{constructor(e,r,n={}){
super(),this.networkManager=e,this.doc=r,this.topic=n.topic||"peercompute-state-sync",this.peerId=n.peerId||e?.peerId||null,
this.initialSync=n.initialSync!==!1,this.syncRequestCounter=0,this.initialSyncTimer=null,this.awareness=null,this._onDocumentUpdate=
this._onDocumentUpdate.bind(this),this._onNetworkMessage=this._onNetworkMessage.bind(this),this.doc.on("update",this._onDocumentUpdate),
this.networkManager?.addMessageHandler&&this.networkManager.addMessageHandler(this._onNetworkMessage),this.initialSync&&
(this.initialSyncTimer=setTimeout(()=>{this.initialSyncTimer=null,this.requestSync().catch(s=>{console.error("[PeerCompu\
teProvider] Initial sync request failed",s)})},0)),console.log("[PeerComputeProvider] Initialized")}_getLocalPeerId(){return this.
peerId||this.networkManager?.peerId||this.networkManager?.getPeerId?.()||null}async requestSync(){if(typeof this.networkManager?.
broadcast!="function")return;const e=`${this._getLocalPeerId()||"peer"}:${Date.now()}:${++this.syncRequestCounter}`,r=Kx(
this.doc);await this.networkManager.broadcast({type:Qm,data:{requestId:e,sourcePeerId:this._getLocalPeerId(),stateVector:Array.
from(r)}},{topic:this.topic})}async _sendSyncResponse(e,r={}){const n=eu(r.stateVector),s=op(this.doc,n);if(s.byteLength===
0)return;const i={type:Jm,data:{requestId:r.requestId||null,sourcePeerId:this._getLocalPeerId(),targetPeerId:e||r.sourcePeerId||
null,update:Array.from(s)}};if(e&&typeof this.networkManager?.sendToPeer=="function"){await this.networkManager.sendToPeer(
e,i);return}typeof this.networkManager?.broadcast=="function"&&await this.networkManager.broadcast(i,{topic:this.topic})}_onDocumentUpdate(e,r){
if(r!==this){if(typeof this.networkManager?.broadcast!="function")return;this.networkManager.broadcast({type:Km,data:Array.
from(e)},{topic:this.topic}).catch(n=>{console.error("[PeerComputeProvider] Broadcast failed",n)})}}_onNetworkMessage(e,r){
if(!(!r||e===this._getLocalPeerId())){if(r.type===Km){const n=eu(r.data);n.byteLength>0&&rl(this.doc,n,this);return}if(r.
type===Qm){this._sendSyncResponse(e,r.data||{}).catch(n=>{console.error("[PeerComputeProvider] Sync response failed",n)});
return}if(r.type===Jm){const n=r.data?.targetPeerId||null,s=this._getLocalPeerId();if(n&&s&&n!==s)return;const i=eu(r.data?.
update);i.byteLength>0&&rl(this.doc,i,this)}}}destroy(){this.initialSyncTimer&&(clearTimeout(this.initialSyncTimer),this.
initialSyncTimer=null),this.doc.off("update",this._onDocumentUpdate),this.networkManager=null}}class lA{constructor({ydoc:e,
stateMap:r,hotStore:n,deltaNamespace:s="deltas"}={}){if(!e||!r)throw new Error("[DataState] ydoc and stateMap are requir\
ed");this.ydoc=e,this.state=r,this.hotStore=n||new Map,this.deltaNamespace=s,this.localArtifactCaches=new Map,this.artifactStores=
new Map}_getNamespaceMap(e){let r=this.state.get(e);return r||(r=new Yn,this.state.set(e,r)),r}commitDelta(e={}){const r=e.
taskId||e.key;if(!r)throw new Error("[DataState] commitDelta requires taskId");const n=e.scope||this.deltaNamespace,s={version:e.
version??null,payload:e.payload??null,ts:e.timestamp??Date.now()};this.ydoc.transact(()=>{(n?this._getNamespaceMap(n):this.
state).set(r,s)},"commit-delta")}readWarm(e,r){if(r){const n=this.state.get(r);return n?n.get(e):void 0}return this.state.
get(e)}writeWarm(e,r,n){this.ydoc.transact(()=>{n?this._getNamespaceMap(n).set(e,r):this.state.set(e,r)},"write-warm")}getWarmDeltas(e=this.
deltaNamespace){const r=this.state.get(e);return r?typeof r.entries=="function"?Object.fromEntries(r.entries()):{}:{}}setHotBuffer(e,r){
this.hotStore.set(e,r)}getHotBuffer(e){return this.hotStore.get(e)}deleteHotBuffer(e){this.hotStore.delete(e)}listHotBuffers(){
return Array.from(this.hotStore.keys())}registerLocalArtifactCache(e,r){const n=String(e??"").trim();if(!n||!r||typeof r!=
"object")throw new TypeError("[DataState] local artifact cache name and instance are required");if(this.localArtifactCaches.
has(n))throw new Error(`[DataState] local artifact cache ${n} is already registered`);return this.localArtifactCaches.set(
n,r),r}getLocalArtifactCache(e){return this.localArtifactCaches.get(String(e??"").trim())??null}unregisterLocalArtifactCache(e,r){
const n=String(e??"").trim();return r&&this.localArtifactCaches.get(n)!==r?!1:this.localArtifactCaches.delete(n)}getLocalArtifactCacheStats(){
let e=0,r=0,n=0;for(const s of this.localArtifactCaches.values()){const i=s?.getStats?.();e+=Number(i?.entries??0),r+=Number(
i?.residentBytes??0),n+=Number(i?.pending??0)}return Object.freeze({caches:this.localArtifactCaches.size,entries:e,residentBytes:r,
pending:n})}async destroyLocalArtifactCaches(){const e=[...this.localArtifactCaches.values()];this.localArtifactCaches.clear(),
await Promise.allSettled(e.map(r=>r?.destroy?.()))}registerArtifactStore(e){if(this.artifactStores.has(e.name))throw new Error(
`Artifact store ${e.name} is already registered`);return this.artifactStores.set(e.name,e),e}getArtifactStore(e="default"){
return this.artifactStores.get(e)||null}unregisterArtifactStore(e){this.artifactStores.get(e.name)===e&&this.artifactStores.
delete(e.name)}getArtifactStoreStats(){const e=[...this.artifactStores.values()].map(r=>r.getStats());return{stores:e.length,
storedBytes:e.reduce((r,n)=>r+n.storedBytes,0),pending:e.reduce((r,n)=>r+n.pending,0)}}async destroyArtifactStores(){const r=(await Promise.
allSettled([...this.artifactStores.values()].map(n=>n.destroy()))).filter(n=>n.status==="rejected").map(n=>n.reason);if(r.
length)throw new AggregateError(r,"Artifact storage cleanup failed");this.artifactStores.clear()}}const Ym="peercompute.\
local-artifact.v1",dA="peercompute-local-artifacts-v1",xn="artifacts",uA=64,fA=32*1024*1024,hA=8*1024*1024,Xm=16*1024,Zm=2048,
pA=96;function hn(t,e,r){const n=new t(r);return n.code=e,n}function _f(){if(typeof DOMException=="function")return new DOMException(
"The operation was aborted.","AbortError");const t=new Error("The operation was aborted.");return t.name="AbortError",t}
function bo(t){if(t?.aborted)throw t.reason??_f()}function tu(t,e){if(!Number.isSafeInteger(t)||t<1)throw new RangeError(
`${e} must be a positive safe integer.`);return t}function ac(t,e){if(!Number.isFinite(t)||t<0)throw new RangeError(`${e}\
 must be a finite non-negative timestamp.`);return t}function mA(t){const e=String(t??"").trim();if(!e||e.length>pA||!/^[a-z0-9][a-z0-9._-]*$/iu.
test(e))throw new TypeError("Local artifact cache name must be a short identifier containing letters, numbers, dot, dash\
, or underscore.");return e}function ru(t){const e=String(t??"");if(!e||e.length>Zm)throw new TypeError(`Local artifact \
cache keys must contain 1-${Zm} characters.`);return e}function S0(t,e){const r=String(t??"").trim();if(!r||r.length>256)
throw new TypeError(`${e} must be a non-empty string of at most 256 characters.`);return r}function gA(t){const e=S0(t,"\
mediaType").split(";",1)[0].trim().toLowerCase();if(!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(e))throw new TypeError(
"mediaType must be a valid MIME type.");return e}function eg(t){if(t instanceof Uint8Array)return t.slice();if(t instanceof
ArrayBuffer)return new Uint8Array(t.slice(0));if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength).
slice();throw new TypeError("Local artifact cache values must contain ArrayBuffer or typed-array bytes.")}function jo(t={}){
if(!t||typeof t!="object"||Array.isArray(t))throw new TypeError("Local artifact metadata must be an object.");let e;try{
e=JSON.stringify(t)}catch{throw new TypeError("Local artifact metadata must be JSON-serializable.")}e===void 0&&(e="{}");
const r=new TextEncoder().encode(e).byteLength;if(r>Xm)throw hn(RangeError,"ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE",`Loca\
l artifact metadata exceeds the ${Xm}-byte cap.`);const n=JSON.parse(e);if(!n||typeof n!="object"||Array.isArray(n))throw new TypeError(
"Local artifact metadata must serialize to an object.");return{metadata:n,byteLength:r}}async function tg(t){if(!globalThis.
crypto?.subtle?.digest)throw hn(Error,"ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE","SHA-256 is unavailable; local artifacts can\
not be admitted without integrity metadata.");const e=await globalThis.crypto.subtle.digest("SHA-256",t);return`sha256:${Array.
from(new Uint8Array(e),r=>r.toString(16).padStart(2,"0")).join("")}`}function Cf(t){return Object.freeze(jo(t).metadata)}
function cc(t,e,r={}){return Object.freeze({bytes:t.bytes.slice(),metadata:Cf(t.metadata),cacheStatus:e,...r})}function nu(t){
return new Promise((e,r)=>{t.onsuccess=()=>e(t.result),t.onerror=()=>r(t.error??new Error("IndexedDB request failed."))})}
function lc(t){return new Promise((e,r)=>{t.oncomplete=()=>e(),t.onerror=()=>r(t.error??new Error("IndexedDB transaction\
 failed.")),t.onabort=()=>r(t.error??new Error("IndexedDB transaction aborted."))})}function su(t,e){return`${t}\0${e}`}
class bA{constructor({name:e,maximumEntries:r=uA,maximumBytes:n=fA,maximumEntryBytes:s=Math.min(hA,n),persistent:i=!0,clock:o=Date.
now,indexedDBImpl:a=globalThis.indexedDB,onDestroy:c=null}={}){if(this.name=mA(e),this.maximumEntries=tu(r,"maximumEntri\
es"),this.maximumBytes=tu(n,"maximumBytes"),this.maximumEntryBytes=tu(s,"maximumEntryBytes"),this.maximumEntryBytes>this.
maximumBytes)throw new RangeError("maximumEntryBytes must not exceed maximumBytes.");if(typeof o!="function")throw new TypeError(
"clock must be a function.");if(c!==null&&typeof c!="function")throw new TypeError("onDestroy must be a function or null\
.");this.clock=o,this.indexedDB=a,this.persistenceConfigured=i===!0,this.persistenceAvailable=this.persistenceConfigured&&
typeof a?.open=="function",this.onDestroy=c,this.entries=new Map,this.inflight=new Map,this.residentBytes=0,this.reservedBytes=
0,this.databasePromise=null,this.database=null,this.persistenceQueue=Promise.resolve(),this.destroyed=!1,this.generation=
0,this.counters={hits:0,misses:0,coalesced:0,stale:0,evictions:0,rejected:0,validationFailures:0,persistenceFailures:0}}#e(){
if(this.destroyed)throw hn(Error,"ERR_LOCAL_ARTIFACT_CACHE_DESTROYED","Local artifact cache is destroyed.")}#t(e,r){r.metadata.
accessedAt=this.clock(),this.entries.delete(e),this.entries.set(e,r)}#r(e,{eviction:r=!1}={}){const n=this.entries.get(e);
return n?(this.entries.delete(e),this.residentBytes=Math.max(0,this.residentBytes-n.storageBytes),r&&(this.counters.evictions+=
1),!0):!1}#u({key:e,entryBytes:r=null,reservationBytes:n=0}={}){const s=this.entries.get(e),i=s?.storageBytes??0,o=()=>{
const a=r!==null,c=this.entries.size+(a&&!s?1:0),l=a?this.residentBytes-i+r+this.reservedBytes+n:this.residentBytes+this.
reservedBytes+n;return c>this.maximumEntries||l>this.maximumBytes};for(;o();){let a=!1;for(const c of this.entries.keys())
if(c!==e){this.#r(c,{eviction:!0}),a=!0;break}if(!a)return!1}return!0}#f(e,r){return r.storageBytes>this.maximumEntryBytes||
r.bytes.byteLength>this.maximumEntryBytes?(this.counters.rejected+=1,!1):this.#u({key:e,entryBytes:r.storageBytes})?(this.#r(
e),this.entries.set(e,r),this.residentBytes+=r.storageBytes,!0):(this.counters.rejected+=1,!1)}#a(e){const r=this.entries.
get(e)?.storageBytes??0,n=Math.max(0,this.maximumEntryBytes-Math.min(r,this.maximumEntryBytes));if(this.inflight.size>=this.
maximumEntries||!this.#u({key:e,reservationBytes:n}))throw this.counters.rejected+=1,hn(Error,"ERR_LOCAL_ARTIFACT_CACHE_\
BUSY","Local artifact cache has no bounded capacity for another in-flight load.");return this.reservedBytes+=n,n}#l(e){this.
reservedBytes=Math.max(0,this.reservedBytes-e)}async#h(){return!this.persistenceAvailable||this.destroyed?null:this.database?
this.database:(this.databasePromise||(this.databasePromise=new Promise((e,r)=>{let n;try{n=this.indexedDB.open(dA,1)}catch(s){
r(s);return}n.onupgradeneeded=()=>{const s=n.result;s.objectStoreNames.contains(xn)||s.createObjectStore(xn,{keyPath:"id"})},
n.onsuccess=()=>e(n.result),n.onerror=()=>r(n.error??new Error("Unable to open the local artifact database.")),n.onblocked=
()=>r(new Error("Opening the local artifact database was blocked."))}).then(e=>(this.database=e,e.onversionchange=()=>{e.
close(),this.database===e&&(this.database=null)},e)).catch(e=>(this.#c(e),null))),this.databasePromise)}#c(e){this.persistenceAvailable&&
(this.counters.persistenceFailures+=1),this.persistenceAvailable=!1;try{this.database?.close?.()}catch{}this.database=null}async#m(e){
const r=await this.#h();if(!r)return null;let n;try{const s=r.transaction(xn,"readonly"),i=lc(s);i.catch(()=>{});const o=s.
objectStore(xn).get(su(this.name,e));n=await nu(o),await i}catch(s){return this.#c(s),null}if(!n||n.cacheName!==this.name||
n.key!==e)return null;try{return{bytes:eg(n.bytes),metadata:jo(n.metadata).metadata,storageBytes:Number(n.storageBytes)}}catch{
return{bytes:null,metadata:null,storageBytes:Number.NaN}}}async#d(e,r){const n=await this.#h();if(n)try{const s=n.transaction(
xn,"readwrite"),i=lc(s);i.catch(()=>{});const o=s.objectStore(xn);o.put({id:su(this.name,e),cacheName:this.name,key:e,bytes:r.
bytes.slice(),metadata:jo(r.metadata).metadata,storageBytes:r.storageBytes});const c=(await nu(o.getAll())).filter(d=>d?.
cacheName===this.name).sort((d,f)=>Number(d.metadata?.accessedAt??0)-Number(f.metadata?.accessedAt??0)||String(d.id).localeCompare(
String(f.id)));let l=c.reduce((d,f)=>{const h=Number(f.storageBytes);return d+(Number.isSafeInteger(h)&&h>=0?h:this.maximumBytes+
1)},0);for(;c.length>this.maximumEntries||l>this.maximumBytes;){const d=c.shift();if(!d)break;const f=Number(d.storageBytes);
l-=Number.isSafeInteger(f)&&f>=0?f:this.maximumBytes+1,o.delete(d.id)}await i}catch(s){this.#c(s)}}async#i(e){const r=await this.#h();
if(r)try{const n=r.transaction(xn,"readwrite"),s=lc(n);s.catch(()=>{}),n.objectStore(xn).delete(su(this.name,e)),await s}catch(n){
this.#c(n)}}async#o(){const e=await this.#h();if(e)try{const r=e.transaction(xn,"readwrite"),n=lc(r);n.catch(()=>{});const s=r.
objectStore(xn),i=await nu(s.getAll());for(const o of i)o?.cacheName===this.name&&s.delete(o.id);await n}catch(r){this.#c(
r)}}#n(e){if(!this.persistenceAvailable)return Promise.resolve();const r=this.persistenceQueue.then(e,e);return this.persistenceQueue=
r.catch(()=>{}),r}async#w(e,r){const n=e?.metadata;if(!e?.bytes||n?.schema!==Ym||e.bytes.byteLength>this.maximumEntryBytes||
!Number.isSafeInteger(e.storageBytes)||e.storageBytes!==e.bytes.byteLength||e.storageBytes>this.maximumBytes||!Number.isFinite(
n.byteLength)||n.byteLength!==e.bytes.byteLength||typeof n.sha256!="string"||typeof n.sourceId!="string"||typeof n.mediaType!=
"string"||!Number.isFinite(n.freshUntil)||!Number.isFinite(n.staleUntil)||n.staleUntil<n.freshUntil)throw hn(Error,"ERR_\
LOCAL_ARTIFACT_SCHEMA","Local artifact metadata is invalid.");if(await tg(e.bytes)!==n.sha256)throw hn(Error,"ERR_LOCAL_\
ARTIFACT_INTEGRITY","Local artifact SHA-256 does not match its bytes.");if(r&&await r(e.bytes.slice(),Cf(n))===!1)throw hn(
Error,"ERR_LOCAL_ARTIFACT_VALIDATION","Local artifact validator rejected the bytes.");return e}async#s(e,{allowStale:r=!1,
validate:n,sourceId:s,mediaType:i}={}){let o=this.entries.get(e)??null,a=!1;if(o||(o=await this.#m(e),a=!!o),!o)return null;
try{if(s&&o.metadata.sourceId!==s)throw hn(Error,"ERR_LOCAL_ARTIFACT_SOURCE","Local artifact source identifier does not \
match.");if(i&&o.metadata.mediaType!==i)throw hn(Error,"ERR_LOCAL_ARTIFACT_MEDIA_TYPE","Local artifact media type does n\
ot match.");a&&await this.#w(o,n)}catch{return this.counters.validationFailures+=1,this.#r(e),await this.#n(()=>this.#i(
e)),null}const c=this.clock();if(c>o.metadata.staleUntil)return this.#r(e),await this.#n(()=>this.#i(e)),null;const l=c<
o.metadata.freshUntil;return!l&&!r?null:(a&&this.#f(e,o),this.entries.has(e)&&this.#t(e,o),this.#n(()=>this.#d(e,o)),{entry:o,
fresh:l})}async read(e,{validate:r,allowStale:n=!1,signal:s}={}){this.#e();const i=ru(e);if(r!==void 0&&typeof r!="funct\
ion")throw new TypeError("validate must be a function.");bo(s);const o=await this.#s(i,{allowStale:n,validate:r});return bo(
s),o?(o.fresh?this.counters.hits+=1:this.counters.stale+=1,cc(o.entry,o.fresh?"hit":"stale")):null}async#g({bytes:e,metadata:r={}},n){
const s=eg(e);if(s.byteLength>this.maximumEntryBytes)throw this.counters.rejected+=1,hn(RangeError,"ERR_LOCAL_ARTIFACT_E\
NTRY_TOO_LARGE",`Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`);const{metadata:i}=jo(r),o=this.clock(),
a=ac(n.freshUntil,"freshUntil"),c=ac(n.staleUntil,"staleUntil");if(c<a)throw new RangeError("staleUntil must be greater \
than or equal to freshUntil.");const l=Number.isFinite(i.freshUntil)?i.freshUntil:a,d=Number.isFinite(i.staleUntil)?i.staleUntil:
c,f=Math.min(c,d),h=Math.min(a,l,f),p=await tg(s),m={...i,schema:Ym,sourceId:n.sourceId,mediaType:n.mediaType,byteLength:s.
byteLength,sha256:p,createdAt:o,accessedAt:o,freshUntil:h,staleUntil:f},b=jo(m),g={bytes:s,metadata:b.metadata,storageBytes:s.
byteLength};if(n.validate)try{if(await n.validate(s.slice(),Cf(g.metadata))===!1)throw hn(Error,"ERR_LOCAL_ARTIFACT_VALI\
DATION","Local artifact validator rejected the bytes.")}catch(u){throw this.counters.validationFailures+=1,u}return g}#p(e,r,n){
bo(r);const s={};return e.subscribers.add(s),n&&(this.counters.coalesced+=1),new Promise((i,o)=>{let a=!1;const c=()=>{a||
(a=!0,r?.removeEventListener?.("abort",l),e.subscribers.delete(s))},l=()=>{c(),!e.settled&&e.subscribers.size===0&&e.controller.
abort(),o(r.reason??_f())};r?.addEventListener?.("abort",l,{once:!0}),e.promise.then(d=>{c(),i(n?Object.freeze({...d,cacheStatus:"\
coalesced"}):d)},d=>{c(),o(d)})})}async getOrLoad({key:e,sourceId:r,mediaType:n,freshUntil:s,staleUntil:i,signal:o,loader:a,
validate:c}={}){this.#e();const l=ru(e),d=S0(r,"sourceId"),f=gA(n);if(typeof a!="function")throw new TypeError("loader m\
ust be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("validate must be a function.");if(ac(s,"fr\
eshUntil"),ac(i,"staleUntil"),i<s)throw new RangeError("staleUntil must be greater than or equal to freshUntil.");bo(o);
let h=this.inflight.get(l);if(h)return this.#p(h,o,!0);const p=await this.#s(l,{allowStale:!0,validate:c,sourceId:d,mediaType:f});
if(bo(o),p?.fresh)return this.counters.hits+=1,cc(p.entry,"hit");if(h=this.inflight.get(l),h)return this.#p(h,o,!0);const m=this.#a(
l),b=this.generation,g=new AbortController,u={controller:g,subscribers:new Set,settled:!1,invalidated:!1,promise:null};let y=!1;
return u.promise=Promise.resolve().then(()=>a({signal:g.signal,maximumBytes:this.maximumEntryBytes})).then(E=>{if(g.signal.
aborted)throw g.signal.reason??_f();const k=E&&typeof E=="object"&&"bytes"in E?E:{bytes:E,metadata:{}};return this.#g(k,
{sourceId:d,mediaType:f,freshUntil:s,staleUntil:i,validate:c})}).then(async E=>(this.#l(m),y=!0,!g.signal.aborted&&!u.invalidated&&
!this.destroyed&&b===this.generation&&(this.#f(l,E),this.entries.get(l)===E&&await this.#n(()=>this.#d(l,E))),this.counters.
misses+=1,cc(E,"miss"))).catch(E=>{if(p&&this.clock()<=p.entry.metadata.staleUntil)return this.counters.stale+=1,cc(p.entry,
"stale",{refreshErrorCode:typeof E?.code=="string"?E.code:"UPSTREAM_REFRESH_FAILED"});throw E}).finally(()=>{u.settled=!0,
y||this.#l(m),this.inflight.get(l)===u&&this.inflight.delete(l)}),this.inflight.set(l,u),this.#p(u,o,!1)}async delete(e){
this.#e();const r=ru(e),n=this.inflight.get(r);n&&(n.invalidated=!0),n?.controller.abort(),this.#r(r),await this.#n(()=>this.#i(
r))}async clear(){this.#e(),this.generation+=1;for(const e of this.inflight.values())e.invalidated=!0,e.controller.abort();
this.entries.clear(),this.residentBytes=0,await this.#n(()=>this.#o())}getStats(){const e=this.clock();let r=0,n=0;for(const s of this.
entries.values())e<s.metadata.freshUntil?r+=1:e<=s.metadata.staleUntil&&(n+=1);return Object.freeze({schema:"peercompute\
.local-artifact-cache-stats.v1",entries:this.entries.size,freshEntries:r,staleEntries:n,residentBytes:this.residentBytes,
maximumEntries:this.maximumEntries,maximumBytes:this.maximumBytes,maximumEntryBytes:this.maximumEntryBytes,pending:this.
inflight.size,reservedBytes:this.reservedBytes,persistenceConfigured:this.persistenceConfigured,persistenceAvailable:this.
persistenceAvailable,...this.counters})}async destroy(){if(!this.destroyed){this.destroyed=!0,this.generation+=1;for(const e of this.
inflight.values())e.invalidated=!0,e.controller.abort();await Promise.allSettled([...this.inflight.values()].map(e=>e.promise)),
await this.persistenceQueue.catch(()=>{}),this.entries.clear(),this.inflight.clear(),this.residentBytes=0,this.reservedBytes=
0;try{this.database?.close?.()}catch{}this.database=null,this.onDestroy?.(this),this.onDestroy=null}}}function yA(t,e){if(t===
e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function pp(t){
if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Ea(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return Ea(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function wA(t){return t?.buffer instanceof ArrayBuffer}function Ea(t){return wA(t)?t:t.slice()}function vA(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?
u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===0;)k++,
y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;for(var P=f.
repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expected String");
if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.length-y)*h+
1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){for(var C=A-k;C!==
A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(u);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var EA=vA,kA=EA;let xA=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},SA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return A0(this,e)}},
AA=class{decoders;constructor(e){this.decoders=e}or(e){return A0(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function A0(t,e){return new AA({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let IA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new xA(e,r,n),this.decoder=new SA(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function I0({name:t,prefix:e,encode:r,decode:n}){return new IA(t,e,r,
n)}function gd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=kA(r,t,n);return I0({prefix:e,
name:t,encode:s,decode:o=>pp(i(o))})}function _A(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function CA(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function TA(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function ns({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=TA(n,s);return I0(
{prefix:e,name:t,encode(o){return CA(o,n,r)},decode(o){return _A(o,i,r,t)}})}const Dc=ns({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ns({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ns({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const iu=gd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});gd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const As=gd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});gd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var RA=_0,rg=128,MA=-128,BA=Math.pow(2,31);function _0(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=BA;)e[r++]=t&255|rg,t/=128;for(;t&MA;)e[r++]=t&255|rg,t>>>=7;return e[r]=t|0,_0.bytes=r-n+1,e}var LA=Tf,
DA=128,ng=127;function Tf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Tf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&ng)<<s:(o&ng)*Math.pow(2,s),s+=7}while(o>=DA);return Tf.bytes=i-n,r}var $A=Math.pow(
2,7),NA=Math.pow(2,14),PA=Math.pow(2,21),OA=Math.pow(2,28),UA=Math.pow(2,35),FA=Math.pow(2,42),zA=Math.pow(2,49),qA=Math.
pow(2,56),jA=Math.pow(2,63),GA=function(t){return t<$A?1:t<NA?2:t<PA?3:t<OA?4:t<UA?5:t<FA?6:t<zA?7:t<qA?8:t<jA?9:10},WA={
encode:RA,decode:LA,encodingLength:GA},dl=WA;function Rf(t,e=0){const r=dl.decode(t,e),n=dl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function ul(t,e,r=0){return dl.encode(t,e,r),e}function fl(t){return dl.encodingLength(t)}function C0(t,e){const r=e.
byteLength,n=fl(t),s=n+fl(r),i=new Uint8Array(s+r);return ul(t,i,0),ul(r,i,n),i.set(e,s),new mp(t,r,e,i)}function HA(t){
const e=pp(t),[r,n]=Rf(e),[s,i]=Rf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new mp(r,s,o,e)}function VA(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&yA(t.bytes,r.bytes)}}let mp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ea(n),this.bytes=Ea(s)}};function sg(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return QA(r,Mf(t),e??As.encoder);default:
return JA(r,Mf(t),e??Dc.encoder)}}const ig=new WeakMap;function Mf(t){const e=ig.get(t);if(e==null){const r=new Map;return ig.
set(t,r),r}return e}let Qi=class lr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ea(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
yo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==YA)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return lr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=C0(e,
r);return lr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return lr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&VA(e.multihash,n.multihash)}toString(e){return sg(this,e)}toJSON(){return{"/":sg(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof lr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new lr(n,s,i,o??og(n,s,i.bytes))}else if(r[XA]===!0){const{version:n,
multihash:s,code:i}=r,o=HA(s);return lr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==yo)throw new Error(`Version 0 CID must use dag-pb (code: ${yo}) block encoding`);return new lr(e,r,n,n.bytes)}case 1:{
const s=og(e,r,n.bytes);return new lr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return lr.
create(0,yo,e)}static createV1(e,r){return lr.create(1,e,r)}static decode(e){const[r,n]=lr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=lr.inspectBytes(e),n=r.size-r.multihashSize,
s=pp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new mp(r.multihashCode,r.digestSize,i,s);return[r.version===0?lr.createV0(o):lr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Rf(e.subarray(r));return r+=h,f};let s=n(),
i=yo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=KA(e,r),
i=lr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Mf(
i).set(n,e),i}};function KA(t,e){switch(t[0]){case"Q":{const r=e??As;return[As.prefix,r.decode(`${As.prefix}${t}`)]}case As.
prefix:{const r=e??As;return[As.prefix,r.decode(t)]}case Dc.prefix:{const r=e??Dc;return[Dc.prefix,r.decode(t)]}case iu.
prefix:{const r=e??iu;return[iu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function QA(t,e,r){const{prefix:n}=r;if(n!==
As.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function JA(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const yo=112,YA=18;function og(t,e,r){const n=fl(t),s=n+fl(e),i=new Uint8Array(s+r.
byteLength);return ul(t,i,0),ul(e,i,n),i.set(r,s),i}const XA=Symbol.for("@ipld/js-cid/CID"),ZA=20;function e2({name:t,code:e,
encode:r,minDigestLength:n,maxDigestLength:s}){return new t2(t,e,r,n,s)}let t2=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){
this.name=e,this.code=r,this.encode=n,this.minDigestLength=s??ZA,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){
if(r.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
ag(n,this.code,r?.truncate):n.then(s=>ag(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}};
function ag(t,e,r){if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${t.byteLength}`);t=t.subarray(0,r)}return C0(e,t)}function r2(t){return async e=>new Uint8Array(await crypto.
subtle.digest(t,e))}const cg=e2({name:"sha2-256",code:18,encode:r2("SHA-256")}),n2=t=>t/2**32|0,s2=t=>t>>>0;function i2(t,e,r,n){
const s=n2(r),i=s2(r);t.setUint32(e,n?i:s,n),t.setUint32(e+4,n?s:i,n)}function lg(t){return t instanceof Uint8Array||ArrayBuffer.
isView(t)&&t.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in t&&t.BYTES_PER_ELEMENT===1}const o2=t=>t?`"${t}" `:"";
function gp(t,e,r=""){if(lg(t)&&e===void 0)return t;const n=lg(t),s="",i=n?`length=${t.length}`:`type=${typeof t}`,o=o2(
r)+"expected Uint8Array"+s+", got "+i;throw n?new RangeError(o):new TypeError(o)}const a2=(t,e)=>{if(t===null||typeof t!=
"object"||Array.isArray(t))throw new TypeError((e==="object"?"":`"${e}" `)+"expected object, got type="+typeof t)},dg=(t,e)=>{
a2(t,e);const r=Object.getPrototypeOf(t);if(r!==Object.prototype&&r!==null)throw new TypeError(`"${e}" expected plain ob\
ject`);if(Object.hasOwn(t,"__proto__"))throw new TypeError(`"${e}.__proto__" is not allowed`)};function ug(t,e=!0){if(t.
destroyed)throw new Error("hash was destroyed");if(e&&t.finished)throw new Error("digest() was already called")}function c2(t,e){
gp(t,void 0,"output");const r=e.outputLen;if(!(t.length>=r))throw new RangeError('"output" expected length >= '+r)}function fg(...t){
for(let e=0;e<t.length;e++)t[e].fill(0)}function ou(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function Sn(t,e){
return t<<32-e|t>>>e}const l2=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",d2=Array.
from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function T0(t){if(gp(t),l2)return t.toHex();let e="";for(let r=0;r<
t.length;r++)e+=d2[t[r]];return e}function u2(t,e,r="opts"){return dg(t,"defaults"),e!==void 0&&dg(e,r),Object.assign(Object.
create(null),t,e)}function f2(t,e={}){if(typeof t!="function")throw new TypeError('"hashCons" expected function, got typ\
e='+typeof t);e=u2({},e,"info");const r=(s,i)=>t(i).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=
n.blockLen,r.canXOF=n.canXOF,r.create=s=>t(s),Object.assign(r,e),Object.freeze(r)}const h2=t=>({oid:Uint8Array.from([6,9,
96,134,72,1,101,3,4,2,t])});function p2(t,e,r){return t&e^~t&r}function m2(t,e,r){return t&e^t&r^e&r}let g2=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){
this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=ou(this.buffer)}update(e){
ug(this),gp(e);const{view:r,buffer:n,blockLen:s}=this,i=e.length;let o=!1;for(let a=0;a<i;){const c=Math.min(s-this.pos,
i-a);if(c===s){const l=ou(e);for(;s<=i-a;a+=s)this.process(l,a);o=!0;continue}n.set(a===0&&c===i?e:e.subarray(a,a+c),this.
pos),this.pos+=c,a+=c,this.pos===s&&(this.process(r,0),this.pos=0,o=!0)}return this.length+=e.length,o&&this.roundClean(),
this}digestInto(e){ug(this),c2(e,this),this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;r[o++]=
128,r.fill(0,o),this.padOffset>s-o&&(this.process(n,0),r.fill(0)),i2(n,s-8,this.length*8,i),this.process(n,0),this.roundClean();
const a=e===r?n:ou(e),c=this.outputLen,l=c/4,d=this.get();if(c%4||l>d.length)throw new Error("invalid outputLen");for(let f=0;f<
l;f++)a.setUint32(4*f,d[f],i)}digest(){const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.
destroy(),n}_cloneIntoMeta(e){const{buffer:r,length:n,finished:s,destroyed:i,pos:o}=this;return e.destroyed=i,e.finished=
s,e.length=n,e.pos=o,o&&e.buffer.set(r),e}clone(){return this._cloneInto()}};const b2=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),y2=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),ds=new Uint32Array(64);let w2=class extends g2{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,r){super(64,e,
8,!1),this.A=r[0]|0,this.B=r[1]|0,this.C=r[2]|0,this.D=r[3]|0,this.E=r[4]|0,this.F=r[5]|0,this.G=r[6]|0,this.H=r[7]|0}get(){
const{A:e,B:r,C:n,D:s,E:i,F:o,G:a,H:c}=this;return[e,r,n,s,i,o,a,c]}set(e,r,n,s,i,o,a,c){this.A=e|0,this.B=r|0,this.C=n|
0,this.D=s|0,this.E=i|0,this.F=o|0,this.G=a|0,this.H=c|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),
this._cloneIntoMeta(e)}process(e,r){for(let f=0;f<16;f++,r+=4)ds[f]=e.getUint32(r,!1);for(let f=16;f<64;f++){const h=ds[f-
15],p=ds[f-2],m=Sn(h,7)^Sn(h,18)^h>>>3,b=Sn(p,17)^Sn(p,19)^p>>>10;ds[f]=b+ds[f-7]+m+ds[f-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:d}=this;for(let f=0;f<64;f++){const h=Sn(a,6)^Sn(a,11)^Sn(a,25),p=d+h+p2(a,c,l)+y2[f]+ds[f]|0,b=(Sn(n,2)^Sn(n,13)^
Sn(n,22))+m2(n,s,i)|0;d=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+b|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(n,s,i,o,a,c,l,d)}roundClean(){fg(ds)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),fg(this.buffer)}},v2=class extends w2{constructor(){super(32,b2)}};const ka=f2(()=>new v2,h2(1));function E2(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
function bp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return xa(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return xa(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function k2(t){return t?.buffer instanceof ArrayBuffer}function xa(t){return k2(t)?t:t.slice()}function x2(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?
u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===0;)k++,
y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;for(var P=f.
repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expected String");
if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.length-y)*h+
1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){for(var C=A-k;C!==
A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(u);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var S2=x2,A2=S2;let I2=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},_2=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return R0(this,e)}},
C2=class{decoders;constructor(e){this.decoders=e}or(e){return R0(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function R0(t,e){return new C2({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let T2=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new I2(e,r,n),this.decoder=new _2(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function M0({name:t,prefix:e,encode:r,decode:n}){return new T2(t,e,r,
n)}function bd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=A2(r,t,n);return M0({prefix:e,
name:t,encode:s,decode:o=>bp(i(o))})}function R2(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function M2(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function B2(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function ss({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=B2(n,s);return M0(
{prefix:e,name:t,encode(o){return M2(o,n,r)},decode(o){return R2(o,i,r,t)}})}const $c=ss({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ss({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ss({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const au=bd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});bd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Is=bd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});bd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var L2=B0,hg=128,D2=-128,$2=Math.pow(2,31);function B0(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=$2;)e[r++]=t&255|hg,t/=128;for(;t&D2;)e[r++]=t&255|hg,t>>>=7;return e[r]=t|0,B0.bytes=r-n+1,e}var N2=Bf,
P2=128,pg=127;function Bf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Bf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&pg)<<s:(o&pg)*Math.pow(2,s),s+=7}while(o>=P2);return Bf.bytes=i-n,r}var O2=Math.pow(
2,7),U2=Math.pow(2,14),F2=Math.pow(2,21),z2=Math.pow(2,28),q2=Math.pow(2,35),j2=Math.pow(2,42),G2=Math.pow(2,49),W2=Math.
pow(2,56),H2=Math.pow(2,63),V2=function(t){return t<O2?1:t<U2?2:t<F2?3:t<z2?4:t<q2?5:t<j2?6:t<G2?7:t<W2?8:t<H2?9:10},K2={
encode:L2,decode:N2,encodingLength:V2},hl=K2;function Lf(t,e=0){const r=hl.decode(t,e),n=hl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function pl(t,e,r=0){return hl.encode(t,e,r),e}function ml(t){return hl.encodingLength(t)}function Q2(t,e){const r=e.
byteLength,n=ml(t),s=n+ml(r),i=new Uint8Array(s+r);return pl(t,i,0),pl(r,i,n),i.set(e,s),new yp(t,r,e,i)}function J2(t){
const e=bp(t),[r,n]=Lf(e),[s,i]=Lf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new yp(r,s,o,e)}function Y2(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&E2(t.bytes,r.bytes)}}let yp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
xa(n),this.bytes=xa(s)}};function mg(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return Z2(r,Df(t),e??Is.encoder);default:
return eI(r,Df(t),e??$c.encoder)}}const gg=new WeakMap;function Df(t){const e=gg.get(t);if(e==null){const r=new Map;return gg.
set(t,r),r}return e}let Go=class dr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=xa(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
wo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==tI)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return dr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=Q2(e,
r);return dr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return dr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&Y2(e.multihash,n.multihash)}toString(e){return mg(this,e)}toJSON(){return{"/":mg(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof dr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new dr(n,s,i,o??bg(n,s,i.bytes))}else if(r[rI]===!0){const{version:n,
multihash:s,code:i}=r,o=J2(s);return dr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==wo)throw new Error(`Version 0 CID must use dag-pb (code: ${wo}) block encoding`);return new dr(e,r,n,n.bytes)}case 1:{
const s=bg(e,r,n.bytes);return new dr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return dr.
create(0,wo,e)}static createV1(e,r){return dr.create(1,e,r)}static decode(e){const[r,n]=dr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=dr.inspectBytes(e),n=r.size-r.multihashSize,
s=bp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new yp(r.multihashCode,r.digestSize,i,s);return[r.version===0?dr.createV0(o):dr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Lf(e.subarray(r));return r+=h,f};let s=n(),
i=wo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=X2(e,r),
i=dr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Df(
i).set(n,e),i}};function X2(t,e){switch(t[0]){case"Q":{const r=e??Is;return[Is.prefix,r.decode(`${Is.prefix}${t}`)]}case Is.
prefix:{const r=e??Is;return[Is.prefix,r.decode(t)]}case $c.prefix:{const r=e??$c;return[$c.prefix,r.decode(t)]}case au.
prefix:{const r=e??au;return[au.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function Z2(t,e,r){const{prefix:n}=r;if(n!==
Is.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function eI(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const wo=112,tI=18;function bg(t,e,r){const n=ml(t),s=n+ml(e),i=new Uint8Array(s+r.
byteLength);return pl(t,i,0),pl(e,i,n),i.set(r,s),i}const rI=Symbol.for("@ipld/js-cid/CID"),nI=new TextDecoder;function wp(t,e){
let r=0;for(let n=0;;n+=7){if(n>=64)throw new Error("protobuf: varint overflow");if(e>=t.length)throw new Error("protobu\
f: unexpected end of data");const s=t[e++];if(r+=n<28?(s&127)<<n:(s&127)*2**n,s<128)break}return[r,e]}function gl(t,e){let r;
[r,e]=wp(t,e);const n=e+r;if(r<0||n<0)throw new Error("protobuf: invalid length");if(n>t.length)throw new Error("protobu\
f: unexpected end of data");return[t.subarray(e,n),n]}function L0(t,e){let r;return[r,e]=wp(t,e),[r&7,r>>3,e]}function sI(t){
const e={},r=t.length;let n=0;for(;n<r;){let s,i;if([s,i,n]=L0(t,n),i===1){if(e.Hash)throw new Error("protobuf: (PBLink)\
 duplicate Hash section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Hash`);if(e.Name!==void 0)
throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");if(e.Tsize!==void 0)throw new Error("protobu\
f: (PBLink) invalid order, found Tsize before Hash");[e.Hash,n]=gl(t,n)}else if(i===2){if(e.Name!==void 0)throw new Error(
"protobuf: (PBLink) duplicate Name section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Name`);
if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");let o;[o,n]=gl(t,n),e.Name=
nI.decode(o)}else if(i===3){if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) duplicate Tsize section");if(s!==0)throw new Error(
`protobuf: (PBLink) wrong wireType (${s}) for Tsize`);[e.Tsize,n]=wp(t,n)}else throw new Error(`protobuf: (PBLink) inval\
id fieldNumber, expected 1, 2 or 3, got ${i}`)}if(n>r)throw new Error("protobuf: (PBLink) unexpected end of data");return e}
function iI(t){const e=t.length;let r=0,n,s=!1,i;for(;r<e;){let a,c;if([a,c,r]=L0(t,r),a!==2)throw new Error(`protobuf: \
(PBNode) invalid wireType, expected 2, got ${a}`);if(c===1){if(i)throw new Error("protobuf: (PBNode) duplicate Data sect\
ion");[i,r]=gl(t,r),n&&(s=!0)}else if(c===2){if(s)throw new Error("protobuf: (PBNode) duplicate Links section");n||(n=[]);
let l;[l,r]=gl(t,r),n.push(sI(l))}else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${c}`)}
if(r>e)throw new Error("protobuf: (PBNode) unexpected end of data");const o={};return i&&(o.Data=i),o.Links=n||[],o}const D0=new TextEncoder,
yg=2**32,oI=2**31;function aI(t,e){let r=e.length;if(typeof t.Tsize=="number"){if(t.Tsize<0)throw new Error("Tsize canno\
t be negative");if(!Number.isSafeInteger(t.Tsize))throw new Error("Tsize too large for encoding");r=Xo(e,r,t.Tsize)-1,e[r]=
24}if(typeof t.Name=="string"){const n=D0.encode(t.Name);r-=n.length,e.set(n,r),r=Xo(e,r,n.length)-1,e[r]=18}return t.Hash&&
(r-=t.Hash.length,e.set(t.Hash,r),r=Xo(e,r,t.Hash.length)-1,e[r]=10),e.length-r}function wg(t,e,r){return t-=e.Data.length,
r.set(e.Data,t),t=Xo(r,t,e.Data.length)-1,r[t]=10,t}function cI(t,e){const r=dI(t),n=new Uint8Array(r);let s=r;const i=e?.
fieldOrder==="data-first"?e.fieldOrder:"links-first";if(t.Data&&i==="links-first"&&(s=wg(s,t,n)),t.Links)for(let o=t.Links.
length-1;o>=0;o--){const a=aI(t.Links[o],n.subarray(0,s));s-=a,s=Xo(n,s,a)-1,n[s]=18}return t.Data&&i==="data-first"&&(s=
wg(s,t,n)),n}function lI(t){let e=0;if(t.Hash){const r=t.Hash.length;e+=1+r+Oi(r)}if(typeof t.Name=="string"){const r=D0.
encode(t.Name).length;e+=1+r+Oi(r)}return typeof t.Tsize=="number"&&(e+=1+Oi(t.Tsize)),e}function dI(t){let e=0;if(t.Data){
const r=t.Data.length;e+=1+r+Oi(r)}if(t.Links)for(const r of t.Links){const n=lI(r);e+=1+n+Oi(n)}return e}function Xo(t,e,r){
e-=Oi(r);const n=e;for(;r>=oI;)t[e++]=r&127|128,r/=128;for(;r>=128;)t[e++]=r&127|128,r>>>=7;return t[e]=r,n}function Oi(t){
return t%2===0&&t++,Math.floor((uI(t)+6)/7)}function uI(t){let e=0;return t>=yg&&(t=Math.floor(t/yg),e=32),t>=65536&&(t>>>=
16,e+=16),t>=256&&(t>>>=8,e+=8),e+fI[t]}const fI=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],hI=["Data","Links"],pI=["Hash","Name",
"Tsize"],$f=new TextEncoder;function $0(t,e){if(t===e)return 0;const r=t.Name?$f.encode(t.Name):[],n=e.Name?$f.encode(e.
Name):[];let s=r.length,i=n.length;for(let o=0,a=Math.min(s,i);o<a;++o)if(r[o]!==n[o]){s=r[o],i=n[o];break}return s<i?-1:
i<s?1:0}function vg(t,e){return!Object.keys(t).some(r=>!e.includes(r))}function N0(t){if(typeof t.asCID=="object"){const r=Go.
asCID(t);if(!r)throw new TypeError("Invalid DAG-PB form");return{Hash:r}}if(typeof t!="object"||Array.isArray(t))throw new TypeError(
"Invalid DAG-PB form");const e={};if(t.Hash){let r=Go.asCID(t.Hash);try{r||(typeof t.Hash=="string"?r=Go.parse(t.Hash):t.
Hash instanceof Uint8Array&&(r=Go.decode(t.Hash)))}catch(n){throw new TypeError(`Invalid DAG-PB form: ${n.message}`)}r&&
(e.Hash=r)}if(!e.Hash)throw new TypeError("Invalid DAG-PB form");return typeof t.Name=="string"&&(e.Name=t.Name),typeof t.
Tsize=="number"&&(e.Tsize=t.Tsize),e}function Dn(t){if((t instanceof Uint8Array||typeof t=="string")&&(t={Data:t}),typeof t!=
"object"||Array.isArray(t))throw new TypeError("Invalid DAG-PB form");const e={};if(t.Data!==void 0)if(typeof t.Data=="s\
tring")e.Data=$f.encode(t.Data);else if(t.Data instanceof Uint8Array)e.Data=t.Data;else throw new TypeError("Invalid DAG\
-PB form");if(t.Links!==void 0)if(Array.isArray(t.Links))e.Links=t.Links.map(N0),e.Links.sort($0);else throw new TypeError(
"Invalid DAG-PB form");else e.Links=[];return e}function P0(t){if(!t||typeof t!="object"||Array.isArray(t)||t instanceof
Uint8Array||t["/"]&&t["/"]===t.bytes)throw new TypeError("Invalid DAG-PB form");if(!vg(t,hI))throw new TypeError("Invali\
d DAG-PB form (extraneous properties)");if(t.Data!==void 0&&!(t.Data instanceof Uint8Array))throw new TypeError("Invalid\
 DAG-PB form (Data must be bytes)");if(!Array.isArray(t.Links))throw new TypeError("Invalid DAG-PB form (Links must be a\
 list)");for(let e=0;e<t.Links.length;e++){const r=t.Links[e];if(!r||typeof r!="object"||Array.isArray(r)||r instanceof Uint8Array||
r["/"]&&r["/"]===r.bytes)throw new TypeError("Invalid DAG-PB form (bad link)");if(!vg(r,pI))throw new TypeError("Invalid\
 DAG-PB form (extraneous properties on link)");if(r.Hash===void 0)throw new TypeError("Invalid DAG-PB form (link must ha\
ve a Hash)");if(r.Hash==null||!r.Hash["/"]||r.Hash["/"]!==r.Hash.bytes)throw new TypeError("Invalid DAG-PB form (link Ha\
sh must be a CID)");if(r.Name!==void 0&&typeof r.Name!="string")throw new TypeError("Invalid DAG-PB form (link Name must\
 be a string)");if(r.Tsize!==void 0){if(typeof r.Tsize!="number"||r.Tsize%1!==0)throw new TypeError("Invalid DAG-PB form\
 (link Tsize must be an integer)");if(r.Tsize<0)throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)")}
if(e>0&&$0(r,t.Links[e-1])===-1)throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")}}function mI(t,e=[]){
return Dn({Data:t,Links:e})}function gI(t,e,r){return N0({Hash:r,Name:t,Tsize:e})}function bI(t){return t instanceof ArrayBuffer?
new Uint8Array(t,0,t.byteLength):t}const yI="dag-pb",ja=112;function $n(t,e){P0(t);const r={};return t.Links&&(r.Links=t.
Links.map(n=>{const s={};return n.Hash&&(s.Hash=n.Hash.bytes),n.Name!==void 0&&(s.Name=n.Name),n.Tsize!==void 0&&(s.Tsize=
n.Tsize),s})),t.Data&&(r.Data=t.Data),cI(r,e)}function Sa(t){const e=bI(t),r=iI(e),n={};return r.Data&&(n.Data=r.Data),r.
Links&&(n.Links=r.Links.map(s=>{const i={};try{i.Hash=Go.decode(s.Hash)}catch{}if(!i.Hash)throw new Error("Invalid Hash \
field found in link, expected CID");return s.Name!==void 0&&(i.Name=s.Name),s.Tsize!==void 0&&(i.Tsize=s.Tsize),i})),n}const O0=Object.
freeze(Object.defineProperty({__proto__:null,code:ja,createLink:gI,createNode:mI,decode:Sa,encode:$n,name:yI,prepare:Dn,
validate:P0},Symbol.toStringTag,{value:"Module"}));function wI(t){return t[Symbol.asyncIterator]!=null}function vI(t){if(wI(
t))return(async()=>{for await(const e of t)return e})();for(const e of t)return e}function EI(t){return t[Symbol.asyncIterator]!=
null}function U0(t,e=1){return e=Number(e),EI(t)?(async function*(){let r=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error(
"Batch size must be an integer");for await(const n of t)for(r.push(n);r.length>=e;)yield r.slice(0,e),r=r.slice(e);for(;r.
length>0;)yield r.slice(0,e),r=r.slice(e)})():(function*(){let r=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error("Bat\
ch size must be an integer");for(const n of t)for(r.push(n);r.length>=e;)yield r.slice(0,e),r=r.slice(e);for(;r.length>0;)
yield r.slice(0,e),r=r.slice(e)})()}async function*F0(t,e=1){for await(const r of U0(t,e)){const n=r.map(async s=>s().then(
i=>({ok:!0,value:i}),i=>({ok:!1,err:i})));for(let s=0;s<n.length;s++){const i=await n[s];if(i.ok)yield i.value;else throw i.
err}}}function us(t=0){return new Uint8Array(t)}function bl(t=0){return new Uint8Array(t)}function kI(t){return t?.buffer instanceof
ArrayBuffer}function xI(t){if(kI(t))return t;const e=t.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Eg(t,e){
e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=bl(e);let n=0;for(const s of t)r.set(s,n),n+=s.length;return xI(r)}function SI(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
const z0=Symbol.for("@achingbrain/uint8arraylist");function kg(t,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let r=0;for(const n of t){const s=r+n.byteLength;if(e<s)return{buf:n,index:e-r};r=s}throw new RangeError("ind\
ex is out of bounds")}function dc(t){return!!t?.[z0]}let cu=class Nc{bufs;length;[z0]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let r=0;for(const n of e)if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.push(n);else if(dc(
n)){r+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=r}prepend(...e){this.prependAll(e)}prependAll(e){let r=0;for(const n of e.reverse())
if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.unshift(n);else if(dc(n))r+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=r}get(e){const r=kg(this.
bufs,e);return r.buf[r.index]}set(e,r){const n=kg(this.bufs,e);n.buf[n.index]=r}write(e,r=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(r+n,e[n]);else if(dc(e))for(let n=0;n<e.length;n++)this.set(r+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,r){const{bufs:n,length:s}=this._subList(e,r);return Eg(n,s)}subarray(e,r){const{bufs:n,length:s}=this.
_subList(e,r);return n.length===1?n[0]:Eg(n,s)}sublist(e,r){const{bufs:n,length:s}=this._subList(e,r),i=new Nc;return i.
length=s,i.bufs=n,i}_subList(e,r){if(e=e??0,r=r??this.length,e<0&&(e=this.length+e),r<0&&(r=this.length+r),e<0||r>this.length)
throw new RangeError("index is out of bounds");if(e===r)return{bufs:[],length:0};if(e===0&&r===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,d=r>a&&r<=c;if(l&&d){if(e===a&&r===c){n.push(o);break}const f=e-a;n.push(
o.subarray(f,f+(r-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(d){if(r===c){n.push(
o);break}n.push(o.subarray(0,r-a));break}n.push(o)}return{bufs:n,length:r-e}}indexOf(e,r=0){if(!dc(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(r=Number(r??0),isNaN(r)&&(r=0),r<0&&(r=this.length+r),r<0&&(r=0),e.length===0)return r>this.length?this.length:r;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let f=0;f<
i;f++)o[f]=-1;for(let f=0;f<s;f++)o[n[f]]=f;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let d;for(let f=r;f<=
c;f+=d){d=0;for(let h=l;h>=0;h--){const p=this.get(f+h);if(n[h]!==p){d=Math.max(1,h-a[p]);break}}if(d===0)return f}return-1}getInt8(e){
const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt8(0)}setInt8(e,r){const n=bl(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,r),this.write(n,e)}getInt16(e,r){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,r)}setInt16(e,r,n){const s=us(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,r,n),this.write(s,e)}getInt32(e,r){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,r)}setInt32(e,r,n){const s=us(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,r,n),this.write(s,e)}getBigInt64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,r)}setBigInt64(e,r,n){const s=us(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,r,n),this.write(s,e)}getUint8(e){const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint8(0)}setUint8(e,r){const n=bl(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,r),this.write(n,e)}getUint16(e,r){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,r)}setUint16(e,r,n){const s=us(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,r,n),this.write(s,e)}getUint32(e,r){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,r)}setUint32(e,r,n){const s=us(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,r,n),this.write(s,e)}getBigUint64(e,r){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,r)}setBigUint64(e,r,n){const s=us(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,r,n),this.write(s,e)}getFloat32(e,r){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,r)}setFloat32(e,r,n){const s=us(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,r,n),this.write(s,e)}getFloat64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,r)}setFloat64(e,r,n){const s=us(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,r,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Nc)||e.bufs.length!==this.bufs.length)return!1;for(let r=0;r<
this.bufs.length;r++)if(!SI(this.bufs[r],e.bufs[r]))return!1;return!0}static fromUint8Arrays(e,r){const n=new Nc;return n.
bufs=e,r==null&&(r=e.reduce((s,i)=>s+i.byteLength,0)),n.length=r,n}};const q0=1,j0=BigInt(34),G0=8,W0=262144,AI="links-b\
ytes",H0=262144,II=1048576,_I=50,CI=10,TI=!0,RI=!0,MI=!1,BI="file",LI="links-first",V0=(t={})=>{const e=t.chunkSize??H0;
return async function*(n){let s=new cu,i=0,o=!1;for await(const a of n)for(s.append(a),i+=a.length;i>=e;)if(yield s.subarray(
0,e),o=!0,e===s.length)s=new cu,i=0;else{const l=new cu;l.append(s.sublist(e)),s=l,i-=e}(!o||i>0)&&(yield s.subarray(0,i))}};
function DI(t){return t.buffer instanceof ArrayBuffer}function K0(t){return DI(t)?t:t.slice()}class Aa extends Error{static name="\
InvalidTypeError";static code="ERR_INVALID_TYPE";name=Aa.name;code=Aa.code;constructor(e="Invalid type"){super(e)}}function yl(t=0){
return new Uint8Array(t)}const $I=Math.pow(2,7),NI=Math.pow(2,14),PI=Math.pow(2,21),Q0=Math.pow(2,28),J0=Math.pow(2,35),
Y0=Math.pow(2,42),X0=Math.pow(2,49),Ar=128,fs=127;function vp(t){if(t<$I)return 1;if(t<NI)return 2;if(t<PI)return 3;if(t<
Q0)return 4;if(t<J0)return 5;if(t<Y0)return 6;if(t<X0)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function OI(t,e,r=0){switch(vp(t)){case 8:e[r++]=t&255|Ar,t/=128;case 7:
e[r++]=t&255|Ar,t/=128;case 6:e[r++]=t&255|Ar,t/=128;case 5:e[r++]=t&255|Ar,t/=128;case 4:e[r++]=t&255|Ar,t>>>=7;case 3:
e[r++]=t&255|Ar,t>>>=7;case 2:e[r++]=t&255|Ar,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function UI(t,e){let r=t[e],n=0;if(n+=r&fs,r<Ar||(r=t[e+1],n+=(r&fs)<<7,r<Ar)||(r=t[e+2],n+=(r&fs)<<14,r<
Ar)||(r=t[e+3],n+=(r&fs)<<21,r<Ar)||(r=t[e+4],n+=(r&fs)*Q0,r<Ar)||(r=t[e+5],n+=(r&fs)*J0,r<Ar)||(r=t[e+6],n+=(r&fs)*Y0,r<
Ar)||(r=t[e+7],n+=(r&fs)*X0,r<Ar))return n;throw new RangeError("Could not decode varint")}const Ep=new Float32Array([-0]),
Bs=new Uint8Array(Ep.buffer);function FI(t,e,r){Ep[0]=t,e[r]=Bs[0],e[r+1]=Bs[1],e[r+2]=Bs[2],e[r+3]=Bs[3]}function zI(t,e){
return Bs[0]=t[e],Bs[1]=t[e+1],Bs[2]=t[e+2],Bs[3]=t[e+3],Ep[0]}const kp=new Float64Array([-0]),gr=new Uint8Array(kp.buffer);
function qI(t,e,r){kp[0]=t,e[r]=gr[0],e[r+1]=gr[1],e[r+2]=gr[2],e[r+3]=gr[3],e[r+4]=gr[4],e[r+5]=gr[5],e[r+6]=gr[6],e[r+
7]=gr[7]}function jI(t,e){return gr[0]=t[e],gr[1]=t[e+1],gr[2]=t[e+2],gr[3]=t[e+3],gr[4]=t[e+4],gr[5]=t[e+5],gr[6]=t[e+6],
gr[7]=t[e+7],kp[0]}const GI=BigInt(Number.MAX_SAFE_INTEGER),WI=BigInt(Number.MIN_SAFE_INTEGER);class wr{lo;hi;constructor(e,r){
this.lo=e>>>0,this.hi=r>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&
(n=n+1>>>0),-(r+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return Zs;if(e<GI&&e>WI)return this.fromNumber(Number(e));const r=e<0n;r&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return r&&(n=~n|0n,s=~s|0n,++s>xg&&(s=0n,++n>xg&&(n=0n))),new wr(Number(s),Number(n))}static fromNumber(e){
if(e===0)return Zs;const r=e<0;r&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return r&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new wr(n,s)}static from(e){return typeof e=="number"?wr.fromNumber(e):typeof e=="bigint"?wr.
fromBigInt(e):typeof e=="string"?wr.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new wr(e.low>>>0,e.high>>>0):Zs}}const Zs=new wr(
0,0);Zs.toBigInt=function(){return 0n};Zs.zzEncode=Zs.zzDecode=function(){return this};Zs.length=function(){return 1};const xg=4294967296n;
function HI(t){let e=0,r=0;for(let n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function VI(t,e,r){if(r-e<1)return"";let s;const i=[];let o=0,a;for(;e<r;)a=
t[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|
t[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Z0(t,e,r){const n=r;let s,i;for(let o=0;o<t.length;++o)
s=t.charCodeAt(o),s<128?e[r++]=s:s<2048?(e[r++]=s>>6|192,e[r++]=s&63|128):(s&64512)===55296&&((i=t.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[r++]=s>>18|240,e[r++]=s>>12&63|128,e[r++]=s>>6&63|128,e[r++]=s&63|128):(e[r++]=
s>>12|224,e[r++]=s>>6&63|128,e[r++]=s&63|128);return r-n}function dn(t,e){return RangeError(`index out of range: ${t.pos}\
 + ${e??1} > ${t.len}`)}function uc(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class KI{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=K0(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,dn(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw dn(this,4);return uc(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw dn(
this,4);return uc(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw dn(this,4);const e=zI(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw dn(this,4);const e=jI(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),r=this.pos,n=this.pos+e;if(n>this.len)throw dn(this,e);return this.pos+=e,r===n?new Uint8Array(0):
this.buf.subarray(r,n)}string(){const e=this.bytes();return VI(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw dn(this,e);this.pos+=e}else do if(this.pos>=this.len)throw dn(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new wr(0,0);let r=0;if(this.len-this.pos>4){
for(;r<4;++r)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;r=0}else{for(;r<3;++r){
if(this.pos>=this.len)throw dn(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<r*7)>>>0,e}if(this.len-this.pos>4){for(;r<5;++r)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;r<5;++r){if(this.pos>=this.len)throw dn(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw dn(this,8);const e=uc(this.buf,this.pos+=4),r=uc(this.buf,this.pos+=4);return new wr(e,r)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=UI(this.buf,this.pos);
return this.pos+=vp(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function ev(t){return new KI(t instanceof Uint8Array?t:
t.subarray())}function so(t,e,r){const n=ev(t);return e.decode(n,void 0,r)}function Nf(t){if(t instanceof Uint8Array&&t.
constructor.name==="Uint8Array")return Ag(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(
t))return Ag(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function QI(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const Sg=4096;function JI(t){const e=t.
length;if(e<=Sg)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=Sg));return r}function YI(t){return t?.buffer instanceof ArrayBuffer}function Ag(t){return YI(t)?t:t.slice()}
function XI(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var d=t.length,f=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||
(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===
0;)k++,y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=
256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;
for(var P=f.repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expect\
ed String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.
length-y)*h+1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){
for(var C=A-k;C!==A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(
u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var ZI=XI,e_=ZI;let t_=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},r_=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return tv(this,e)}},
n_=class{decoders;constructor(e){this.decoders=e}or(e){return tv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function tv(t,e){return new n_({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let s_=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new t_(e,r,n),this.decoder=new r_(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function yd({name:t,prefix:e,encode:r,decode:n}){return new s_(t,e,r,
n)}function Ga({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=e_(r,t,n);return yd({prefix:e,
name:t,encode:s,decode:o=>Nf(i(o))})}function i_(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function o_(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function a_(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Xt({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=a_(n,s);return yd(
{prefix:e,name:t,encode(o){return o_(o,n,r)},decode(o){return i_(o,i,r,t)}})}const c_=Ga({prefix:"9",name:"base10",alphabet:"\
0123456789"}),l_=Object.freeze(Object.defineProperty({__proto__:null,base10:c_},Symbol.toStringTag,{value:"Module"})),d_=Xt(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),u_=Xt({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),f_=Object.freeze(Object.defineProperty({__proto__:null,
base16:d_,base16upper:u_},Symbol.toStringTag,{value:"Module"})),h_=Xt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
p_=Object.freeze(Object.defineProperty({__proto__:null,base2:h_},Symbol.toStringTag,{value:"Module"})),rv=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),m_=rv.reduce((t,e,r)=>(t[r]=e,t),[]),g_=rv.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function b_(t){return t.reduce((e,r)=>(e+=m_[r],e),"")}function y_(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=g_[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const w_=yd({prefix:"🚀",name:"\
base256emoji",encode:b_,decode:y_}),v_=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:w_},Symbol.toStringTag,
{value:"Module"})),E_=Xt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
k_=Xt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),x_=Xt(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),S_=Xt({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),A_=Xt({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),I_=Xt({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),__=Xt({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),C_=Xt({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),T_=Xt({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),R_=Object.freeze(Object.defineProperty({__proto__:null,
base32:E_,base32hex:A_,base32hexpad:__,base32hexpadupper:C_,base32hexupper:I_,base32pad:x_,base32padupper:S_,base32upper:k_,
base32z:T_},Symbol.toStringTag,{value:"Module"})),M_=Ga({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),B_=Ga({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
L_=Object.freeze(Object.defineProperty({__proto__:null,base36:M_,base36upper:B_},Symbol.toStringTag,{value:"Module"})),D_=Ga(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),$_=Ga({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),N_=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:D_,base58flickr:$_},Symbol.toStringTag,{value:"Module"})),P_=Xt({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),O_=Xt({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),U_=Xt({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),F_=Xt({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),z_=Object.freeze(Object.defineProperty(
{__proto__:null,base64:P_,base64pad:O_,base64url:U_,base64urlpad:F_},Symbol.toStringTag,{value:"Module"})),q_=Xt({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),j_=Object.freeze(Object.defineProperty({__proto__:null,base8:q_},Symbol.
toStringTag,{value:"Module"})),G_=yd({prefix:"\0",name:"identity",encode:t=>JI(Nf(t)),decode:t=>Nf(QI(t))}),W_=Object.freeze(
Object.defineProperty({__proto__:null,identity:G_},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Ig={...W_,...p_,...j_,...l_,...f_,...R_,...L_,...N_,...z_,...v_};function nv(t,e,r,n){return{name:t,prefix:e,encoder:{
name:t,prefix:e,encode:r},decoder:{decode:n}}}const _g=nv("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().
encode(t.substring(1))),lu=nv("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},
t=>{t=t.substring(1);const e=yl(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),H_={utf8:_g,"utf-8":_g,
hex:Ig.base16,latin1:lu,ascii:lu,binary:lu,...Ig};function V_(t,e="utf8"){const r=H_[e];if(r==null)throw new Error(`Unsu\
pported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}function K_(t){let n,s=8192;return function(o){if(o<
1||o>4096)return yl(o);s+o>8192&&(n=yl(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Wo{fn;len;next;val;constructor(e,r,n){
this.fn=e,this.len=r,this.next=void 0,this.val=n}}function du(){}class Q_{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const J_=K_();function Y_(t){return globalThis.Buffer!=null?yl(
t):J_(t)}class Pf{len;head;tail;states;constructor(){this.len=0,this.head=new Wo(du,0,0),this.tail=this.head,this.states=
null}_push(e,r,n){return this.tail=this.tail.next=new Wo(e,r,n),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new Z_((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(fc,10,
wr.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=wr.fromBigInt(e);return this.
_push(fc,r.length(),r)}uint64Number(e){return this._push(OI,vp(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=wr.
fromBigInt(e).zzEncode();return this._push(fc,r.length(),r)}sint64Number(e){const r=wr.fromNumber(e).zzEncode();return this.
_push(fc,r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(uu,1,e?1:0)}fixed32(e){return this.
_push(vo,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=wr.fromBigInt(e);return this._push(vo,4,r.lo)._push(
vo,4,r.hi)}fixed64Number(e){const r=wr.fromNumber(e);return this._push(vo,4,r.lo)._push(vo,4,r.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(FI,4,e)}double(e){return this._push(qI,8,e)}bytes(e){const r=e.length>>>0;return r===
0?this._push(uu,1,0):this.uint32(r)._push(eC,r,e)}string(e){const r=HI(e);return r!==0?this.uint32(r)._push(Z0,r,e):this.
_push(uu,1,0)}fork(){return this.states=new Q_(this),this.head=this.tail=new Wo(du,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Wo(du,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=r,this.len+=n),this}finish(){let e=this.head.next;const r=Y_(this.len);
let n=0;for(;e!=null;)e.fn(e.val,r,n),n+=e.len,e=e.next;return r}}function uu(t,e,r){e[r]=t&255}function X_(t,e,r){for(;t>
127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class Z_ extends Wo{next;constructor(e,r){super(X_,e,r),this.next=void 0}}function fc(t,e,r){
for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&127|128,t.lo=t.lo>>>
7;e[r++]=t.lo}function vo(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function eC(t,e,r){e.set(t,
r)}globalThis.Buffer!=null&&(Pf.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this._push(tC,
e,t),this},Pf.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this._push(
rC,e,t),this});function tC(t,e,r){e.set(t,r)}function rC(t,e,r){t.length<40?Z0(t,e,r):e.utf8Write!=null?e.utf8Write(t,r):
e.set(V_(t),r)}function nC(){return new Pf}function io(t,e){const r=nC();return e.encode(t,r,{lengthDelimited:!1}),r.finish()}
function*oo(t,e,r){const n=ev(t);yield*e.stream(n,void 0,".",r)}const sv={VARINT:0,LENGTH_DELIMITED:2};function iv(t,e,r,n,s){
return{name:t,type:e,encode:r,decode:n,stream:s}}function sC(t){function e(i){if(t[i.toString()]==null)throw new Error("\
Invalid enum value");return t[i]}const r=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return iv("enum",sv.VARINT,r,n,s)}function ao(t,e,r){return iv("message",sv.LENGTH_DELIMITED,t,e,
r)}class Ji extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var br;(function(t){(function(o){o.RAW="RAW",o.DIRECTORY=
"DIRECTORY",o.FILE="FILE",o.METADATA="METADATA",o.SYMLINK="SYMLINK",o.HAMT_SHARD="HAMT_SHARD"})(t.Type||(t.Type={}));let e;
(function(o){o[o.RAW=0]="RAW",o[o.DIRECTORY=1]="DIRECTORY",o[o.FILE=2]="FILE",o[o.METADATA=3]="METADATA",o[o.SYMLINK=4]=
"SYMLINK",o[o.HAMT_SHARD=5]="HAMT_SHARD"})(e||(e={})),(function(o){o.codec=()=>sC(e)})(t.Type||(t.Type={}));let r;t.codec=
()=>(r==null&&(r=ao((o,a,c={})=>{if(c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),t.Type.codec().encode(o.
type,a)),o.data!=null&&(a.uint32(18),a.bytes(o.data)),o.fileSize!=null&&(a.uint32(24),a.uint64(o.fileSize)),o.blockSizes!=
null&&o.blockSizes.length>0)for(const l of o.blockSizes)a.uint32(32),a.uint64(l);o.hashType!=null&&(a.uint32(40),a.uint64(
o.hashType)),o.fanOut!=null&&(a.uint32(48),a.uint64(o.fanOut)),o.mode!=null&&(a.uint32(56),a.uint32(o.mode)),o.mtime!=null&&
(a.uint32(66),Zo.codec().encode(o.mtime,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={blockSizes:[]},d=a==
null?o.len:o.pos+a;for(;o.pos<d;){const f=o.uint32();switch(f>>>3){case 1:{l.type=t.Type.codec().decode(o);break}case 2:{
l.data=o.bytes();break}case 3:{l.fileSize=o.uint64();break}case 4:{if(c.limits?.blockSizes!=null&&l.blockSizes.length===
c.limits.blockSizes)throw new Ji('Decode error - repeated field "blockSizes" had too many elements');l.blockSizes.push(o.
uint64());break}case 5:{l.hashType=o.uint64();break}case 6:{l.fanOut=o.uint64();break}case 7:{l.mode=o.uint32();break}case 8:{
l.mtime=Zo.codec().decode(o,o.uint32(),{limits:c.limits?.mtime});break}default:{o.skipType(f&7);break}}}return l},function*(o,a,c,l={}){
const d={blockSizes:0},f=a==null?o.len:o.pos+a;for(c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-1):c,type:"\
start",message:"UnixFS"});o.pos<f;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}type`,value:t.Type.codec().
decode(o)};break}case 2:{yield{field:`${c}data`,value:o.bytes()};break}case 3:{yield{field:`${c}fileSize`,value:o.uint64()};
break}case 4:{if(l.limits?.blockSizes!=null&&d.blockSizes===l.limits.blockSizes)throw new Ji('Streaming decode error - r\
epeated field "blockSizes" had too many elements');yield{field:`${c}blockSizes[]`,index:d.blockSizes,value:o.uint64()},d.
blockSizes++;break}case 5:{yield{field:`${c}hashType`,value:o.uint64()};break}case 6:{yield{field:`${c}fanOut`,value:o.uint64()};
break}case 7:{yield{field:`${c}mode`,value:o.uint32()};break}case 8:{yield*Zo.codec().stream(o,o.uint32(),`${c}mtime.`,{
limits:l.limits?.mtime});break}default:{o.skipType(h&7);break}}}c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-
1):c,type:"end",message:"UnixFS"})})),r);function n(o){return io(o,t.codec())}t.encode=n;function s(o,a){return so(o,t.codec(),
a)}t.decode=s;function i(o,a){return oo(o,t.codec(),a)}t.stream=i})(br||(br={}));var Zo;(function(t){let e;t.codec=()=>(e==
null&&(e=ao((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.seconds!=null&&(o.uint32(8),o.int64(i.seconds)),i.fractionalNanoseconds!=
null&&(o.uint32(21),o.fixed32(i.fractionalNanoseconds)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?
i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.seconds=i.int64();break}case 2:{a.fractionalNanoseconds=
i.fixed32();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"UnixTime"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}seconds`,value:i.int64()};break}case 2:{yield{field:`${a}fractionalNanoseconds`,value:i.
fixed32()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"UnixTime"})})),e);function r(i){return io(i,t.codec())}t.encode=r;function n(i,o){return so(i,t.codec(),o)}
t.decode=n;function s(i,o){return oo(i,t.codec(),o)}t.stream=s})(Zo||(Zo={}));var Cg;(function(t){let e;t.codec=()=>(e==
null&&(e=ao((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.mimeType!=null&&(o.uint32(10),o.string(i.mimeType)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.mimeType=
i.string();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Metadata"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}mimeType`,value:i.string()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Metadata"})})),e);function r(i){return io(i,t.codec())}
t.encode=r;function n(i,o){return so(i,t.codec(),o)}t.decode=n;function s(i,o){return oo(i,t.codec(),o)}t.stream=s})(Cg||
(Cg={}));var Ds;(function(t){let e;t.codec=()=>(e==null&&(e=ao((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.hash!=null&&
(o.uint32(10),o.bytes(i.hash)),i.name!=null&&(o.uint32(18),o.string(i.name)),i.tSize!=null&&(o.uint32(24),o.uint64(i.tSize)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{a.hash=i.bytes();break}case 2:{a.name=i.string();break}case 3:{a.tSize=i.uint64();break}default:{i.skipType(l&
7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"Link"});i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{yield{field:`${a}hash`,
value:i.bytes()};break}case 2:{yield{field:`${a}name`,value:i.string()};break}case 3:{yield{field:`${a}tSize`,value:i.uint64()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Link"})})),e);function r(i){return io(i,t.codec())}t.encode=r;function n(i,o){return so(i,t.codec(),o)}t.decode=n;function s(i,o){
return oo(i,t.codec(),o)}t.stream=s})(Ds||(Ds={}));var Ia;(function(t){let e;t.codec=()=>(e==null&&(e=ao((i,o,a={})=>{if(a.
lengthDelimited!==!1&&o.fork(),i.data!=null&&(o.uint32(10),br.codec().encode(i.data,o)),i.links!=null&&i.links.length>0)
for(const c of i.links)o.uint32(18),Ds.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const d=i.uint32();switch(d>>>3){case 1:{c.data=br.codec().decode(i,i.uint32(),{limits:a.
limits?.data});break}case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Ji('Decode error - repe\
ated field "links" had too many elements');c.links.push(Ds.codec().decode(i,i.uint32(),{limits:a.limits?.links$}));break}default:{
i.skipType(d&7);break}}}return c},function*(i,o,a,c={}){const l={links:0},d=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.
endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Node"});i.pos<d;){const f=i.uint32();switch(f>>>3){case 1:{
yield*br.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}case 2:{if(c.limits?.links!=null&&l.links===
c.limits.links)throw new Ji('Streaming decode error - repeated field "links" had too many elements');for(const h of Ds.codec().
stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}default:{i.skipType(
f&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Node"})})),e);function r(i){
return io(i,t.codec())}t.encode=r;function n(i,o){return so(i,t.codec(),o)}t.decode=n;function s(i,o){return oo(i,t.codec(),
o)}t.stream=s})(Ia||(Ia={}));var Tg;(function(t){let e;t.codec=()=>(e==null&&(e=ao((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.links!=null&&i.links.length>0)for(const c of i.links)o.uint32(18),Ds.codec().encode(c,o);i.data!=null&&(o.uint32(
10),br.codec().encode(i.data,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},l=o==null?i.len:i.pos+
o;for(;i.pos<l;){const d=i.uint32();switch(d>>>3){case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Ji(
'Decode error - repeated field "links" had too many elements');c.links.push(Ds.codec().decode(i,i.uint32(),{limits:a.limits?.
links$}));break}case 1:{c.data=br.codec().decode(i,i.uint32(),{limits:a.limits?.data});break}default:{i.skipType(d&7);break}}}
return c},function*(i,o,a,c={}){const l={links:0},d=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"LegacyNode"});i.pos<d;){const f=i.uint32();switch(f>>>3){case 2:{if(c.limits?.links!=
null&&l.links===c.limits.links)throw new Ji('Streaming decode error - repeated field "links" had too many elements');for(const h of Ds.
codec().stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}case 1:{
yield*br.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}default:{i.skipType(f&7);break}}}a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"LegacyNode"})})),e);function r(i){return io(
i,t.codec())}t.encode=r;function n(i,o){return so(i,t.codec(),o)}t.decode=n;function s(i,o){return oo(i,t.codec(),o)}t.stream=
s})(Tg||(Tg={}));const Rg={RAW:"raw",DIRECTORY:"directory",FILE:"file",METADATA:"metadata",SYMLINK:"symlink",HAMT_SHARD:"\
hamt-sharded-directory"},iC=["directory","hamt-sharded-directory"],Mg=parseInt("0644",8),Bg=parseInt("0755",8);class Lr{static unmarshal(e){
const r=br.decode(e),n=new Lr({type:Rg[r.type!=null?r.type.toString():"FILE"],data:r.data,blockSizes:r.blockSizes,mode:r.
mode,mtime:r.mtime!=null?{secs:r.mtime.seconds??0n,nsecs:r.mtime.fractionalNanoseconds}:void 0,fanout:r.fanOut});return n.
_originalMode=r.mode??0,n}type;data;blockSizes;hashType;fanout;mtime;_mode;_originalMode;constructor(e={type:"file"}){const{
type:r,data:n,blockSizes:s,hashType:i,fanout:o,mtime:a,mode:c}=e;if(r!=null&&!Object.values(Rg).includes(r))throw new Aa(
"Type: "+r+" is not valid");this.type=r??"file",this.hashType=i,this.fanout=o,this.blockSizes=s??[],this._originalMode=0,
this.mode=c,this.mtime=a,n!=null&&(this.data=K0(n))}set mode(e){e==null?this._mode=this.isDirectory()?Bg:Mg:this._mode=e&
4095}get mode(){return this._mode}isDirectory(){return iC.includes(this.type)}addBlockSize(e){this.blockSizes.push(e)}removeBlockSize(e){
this.blockSizes.splice(e,1)}fileSize(){if(this.isDirectory())return 0n;let e=0n;return this.blockSizes.forEach(r=>{e+=r}),
this.data!=null&&(e+=BigInt(this.data.length)),e}marshal(){let e;switch(this.type){case"raw":e=br.Type.RAW;break;case"di\
rectory":e=br.Type.DIRECTORY;break;case"file":e=br.Type.FILE;break;case"metadata":e=br.Type.METADATA;break;case"symlink":
e=br.Type.SYMLINK;break;case"hamt-sharded-directory":e=br.Type.HAMT_SHARD;break;default:throw new Aa(`Type: ${e} is not \
valid`)}let r=this.data;(this.data==null||this.data.length===0)&&(r=void 0);let n;this.mode!=null&&(n=this._originalMode&
4294963200|(this.mode??0),n===Mg&&!this.isDirectory()&&(n=void 0),n===Bg&&this.isDirectory()&&(n=void 0));let s;return this.
mtime!=null&&(s={seconds:this.mtime.secs,fractionalNanoseconds:this.mtime.nsecs}),br.encode({type:e,data:r,fileSize:this.
type==="file"||this.type==="raw"?this.fileSize():void 0,blockSizes:this.blockSizes,hashType:this.hashType,fanOut:this.fanout,
mode:n,mtime:s})}}function oC(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)
if(t[r]!==e[r])return!1;return!0}function ai(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return _a(
t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return _a(new Uint8Array(t.buffer,t.byteOffset,
t.byteLength));throw new Error("Unknown type, must be binary type")}function aC(t){const e=new Uint8Array(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}const Lg=4096;function cC(t){const e=t.length;if(e<=Lg)return String.fromCharCode.
apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Lg));return r}function lC(t){
return t?.buffer instanceof ArrayBuffer}function _a(t){return lC(t)?t:t.slice()}const dC="raw",Of=85;function uC(t){return ai(
t)}function fC(t){return ai(t)}const hC=Object.freeze(Object.defineProperty({__proto__:null,code:Of,decode:fC,encode:uC,
name:dC},Symbol.toStringTag,{value:"Module"}));class Nn extends Event{type;detail;constructor(e,r){super(e),this.type=e,
this.detail=r}}function pC(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof
Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.
from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,
k=0,A=u.length;k!==A&&u[k]===0;)k++,y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-
E;T!==S&&v[T]===0;)T++;for(var P=f.repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError(
"Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.
length-y)*h+1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){
for(var C=A-k;C!==A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(
u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var mC=pC,gC=mC;let bC=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},yC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ov(this,e)}},
wC=class{decoders;constructor(e){this.decoders=e}or(e){return ov(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function ov(t,e){return new wC({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let vC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new bC(e,r,n),this.decoder=new yC(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function wd({name:t,prefix:e,encode:r,decode:n}){return new vC(t,e,r,
n)}function Wa({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=gC(r,t,n);return wd({prefix:e,
name:t,encode:s,decode:o=>ai(i(o))})}function EC(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function kC(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function xC(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Zt({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=xC(n,s);return wd(
{prefix:e,name:t,encode(o){return kC(o,n,r)},decode(o){return EC(o,i,r,t)}})}const ea=Zt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),SC=Zt({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),AC=Zt({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),IC=Zt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),_C=Zt({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),CC=Zt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),TC=Zt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),RC=Zt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),MC=Zt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),BC=Object.freeze(Object.defineProperty({__proto__:null,base32:ea,base32hex:_C,base32hexpad:TC,
base32hexpadupper:RC,base32hexupper:CC,base32pad:AC,base32padupper:IC,base32upper:SC,base32z:MC},Symbol.toStringTag,{value:"\
Module"})),Pc=Wa({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),LC=Wa({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),DC=Object.freeze(Object.defineProperty(
{__proto__:null,base36:Pc,base36upper:LC},Symbol.toStringTag,{value:"Module"})),Wn=Wa({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),$C=Wa({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),NC=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Wn,
base58flickr:$C},Symbol.toStringTag,{value:"Module"}));var PC=av,Dg=128,OC=-128,UC=Math.pow(2,31);function av(t,e,r){e=e||
[],r=r||0;for(var n=r;t>=UC;)e[r++]=t&255|Dg,t/=128;for(;t&OC;)e[r++]=t&255|Dg,t>>>=7;return e[r]=t|0,av.bytes=r-n+1,e}var FC=Uf,
zC=128,$g=127;function Uf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Uf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&$g)<<s:(o&$g)*Math.pow(2,s),s+=7}while(o>=zC);return Uf.bytes=i-n,r}var qC=Math.pow(
2,7),jC=Math.pow(2,14),GC=Math.pow(2,21),WC=Math.pow(2,28),HC=Math.pow(2,35),VC=Math.pow(2,42),KC=Math.pow(2,49),QC=Math.
pow(2,56),JC=Math.pow(2,63),YC=function(t){return t<qC?1:t<jC?2:t<GC?3:t<WC?4:t<HC?5:t<VC?6:t<KC?7:t<QC?8:t<JC?9:10},XC={
encode:PC,decode:FC,encodingLength:YC},wl=XC;function Ff(t,e=0){const r=wl.decode(t,e),n=wl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function vl(t,e,r=0){return wl.encode(t,e,r),e}function El(t){return wl.encodingLength(t)}function cv(t,e){const r=e.
byteLength,n=El(t),s=n+El(r),i=new Uint8Array(s+r);return vl(t,i,0),vl(r,i,n),i.set(e,s),new xp(t,r,e,i)}function ZC(t){
const e=ai(t),[r,n]=Ff(e),[s,i]=Ff(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new xp(r,s,o,e)}function e8(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&oC(t.bytes,r.bytes)}}let xp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
_a(n),this.bytes=_a(s)}};function Ng(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return n8(r,zf(t),e??Wn.encoder);default:
return s8(r,zf(t),e??ea.encoder)}}const Pg=new WeakMap;function zf(t){const e=Pg.get(t);if(e==null){const r=new Map;return Pg.
set(t,r),r}return e}let t8=class ur{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=_a(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
Eo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==i8)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return ur.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=cv(e,
r);return ur.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return ur.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&e8(e.multihash,n.multihash)}toString(e){return Ng(this,e)}toJSON(){return{"/":Ng(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof ur)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new ur(n,s,i,o??Og(n,s,i.bytes))}else if(r[o8]===!0){const{version:n,
multihash:s,code:i}=r,o=ZC(s);return ur.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==Eo)throw new Error(`Version 0 CID must use dag-pb (code: ${Eo}) block encoding`);return new ur(e,r,n,n.bytes)}case 1:{
const s=Og(e,r,n.bytes);return new ur(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return ur.
create(0,Eo,e)}static createV1(e,r){return ur.create(1,e,r)}static decode(e){const[r,n]=ur.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=ur.inspectBytes(e),n=r.size-r.multihashSize,
s=ai(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new xp(r.multihashCode,r.digestSize,i,s);return[r.version===0?ur.createV0(o):ur.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Ff(e.subarray(r));return r+=h,f};let s=n(),
i=Eo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=r8(e,r),
i=ur.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return zf(
i).set(n,e),i}};function r8(t,e){switch(t[0]){case"Q":{const r=e??Wn;return[Wn.prefix,r.decode(`${Wn.prefix}${t}`)]}case Wn.
prefix:{const r=e??Wn;return[Wn.prefix,r.decode(t)]}case ea.prefix:{const r=e??ea;return[ea.prefix,r.decode(t)]}case Pc.
prefix:{const r=e??Pc;return[Pc.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function n8(t,e,r){const{prefix:n}=r;if(n!==
Wn.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function s8(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const Eo=112,i8=18;function Og(t,e,r){const n=El(t),s=n+El(e),i=new Uint8Array(s+r.
byteLength);return vl(t,i,0),vl(e,i,n),i.set(r,s),i}const o8=Symbol.for("@ipld/js-cid/CID"),a8=20;function c8({name:t,code:e,
encode:r,minDigestLength:n,maxDigestLength:s}){return new l8(t,e,r,n,s)}let l8=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){
this.name=e,this.code=r,this.encode=n,this.minDigestLength=s??a8,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){
if(r.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Ug(n,this.code,r?.truncate):n.then(s=>Ug(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Ug(t,e,r){if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${t.byteLength}`);t=t.subarray(0,r)}return cv(e,t)}function d8(t){return async e=>new Uint8Array(await crypto.
subtle.digest(t,e))}const u8=c8({name:"sha2-256",code:18,encode:d8("SHA-256")}),zs=async(t,e,r)=>{r.codec==null&&(r.codec=
O0);const n=await u8.digest(t),s=t8.create(r.cidVersion??q0,r.codec.code,n);return await e.put(s,t,r),s};function f8(t){
return async function*(r,n){let s=0n;for await(let i of r.content)yield async()=>{let o;const a={codec:O0,cidVersion:t.cidVersion,
onProgress:t.onProgress};t.rawLeaves?(a.codec=hC,a.cidVersion=1):(o=new Lr({type:t.leafType,data:i}),i=$n({Data:o.marshal(),
Links:[]},t));const c=await zs(i,n,a);return s+=BigInt(i.byteLength),t.onProgress?.(new Nn("unixfs:importer:progress:fil\
e:write",{bytesWritten:s,cid:c,path:r.path})),{cid:c,unixfs:o,size:BigInt(i.length),block:i}}}}let h8=class qf extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=qf.name;code=qf.code;constructor(e="Invalid parameters"){super(
e)}};class Xn extends Error{static name="InvalidContentError";static code="ERR_INVALID_CONTENT";name=Xn.name;code=Xn.code;constructor(e="\
Invalid content"){super(e)}}class Fg extends Error{static name="InvalidShardingStrategyError";static code="ERR_SHARDING_\
STRATEGY";name=Xn.name;code=Xn.code}const p8=async(t,e,r)=>{const n=new Lr({type:"directory",mtime:t.mtime,mode:t.mode}),
s=$n(Dn({Data:n.marshal()}),r),i=await zs(s,e,r),o=t.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:t.
originalPath,block:s}};async function*m8(t,e,r){let n=-1,s;for await(const i of F0(r.bufferImporter(t,e),r.blockWriteConcurrency)){
if(n++,n===0){s={...i,single:!0};continue}else n===1&&s!=null&&(yield{...s,block:void 0,single:void 0},s=void 0);yield{...i,
block:void 0}}s!=null&&(yield s)}function zg(t){return t.single===!0}const g8=(t,e,r)=>async function(s){if(s.length===1&&
zg(s[0])&&r.reduceSingleLeafToSelf){const d=s[0];let f=d.block;return zg(d)&&(t.mtime!==void 0||t.mode!==void 0)&&(d.unixfs=
new Lr({type:"file",mtime:t.mtime,mode:t.mode,data:d.block}),f={Data:d.unixfs.marshal(),Links:[]},d.block=$n(Dn(f),r),d.
cid=await zs(d.block,e,{...r,cidVersion:r.cidVersion}),d.size=BigInt(d.block.length)),r.onProgress?.(new Nn("unixfs:impo\
rter:progress:file:layout",{cid:d.cid,path:t.originalPath})),{cid:d.cid,path:t.path,unixfs:d.unixfs,size:d.size,originalPath:t.
originalPath}}const i=new Lr({type:"file",mtime:t.mtime,mode:t.mode}),o=s.filter(d=>d.cid.code===Of&&d.size>0||d.unixfs!=
null&&d.unixfs.data==null&&d.unixfs.fileSize()>0n?!0:!!d.unixfs?.data?.length).map(d=>d.cid.code===Of?(i.addBlockSize(d.
size),{Name:"",Tsize:Number(d.size),Hash:d.cid}):(d.unixfs?.data==null?i.addBlockSize(d.unixfs?.fileSize()??0n):i.addBlockSize(
BigInt(d.unixfs.data.length)),{Name:"",Tsize:Number(d.size),Hash:d.cid})),a={Data:i.marshal(),Links:o},c=$n(Dn(a),r),l=await zs(
c,e,r);return r.onProgress?.(new Nn("unixfs:importer:progress:file:layout",{cid:l,path:t.originalPath})),{cid:l,path:t.path,
unixfs:i,size:BigInt(c.length+a.Links.reduce((d,f)=>d+(f.Tsize??0),0)),originalPath:t.originalPath,block:c}},b8=async(t,e,r)=>r.
layout(m8(t,e,r),g8(t,e,r)),y8=Wa({prefix:"9",name:"base10",alphabet:"0123456789"}),w8=Object.freeze(Object.defineProperty(
{__proto__:null,base10:y8},Symbol.toStringTag,{value:"Module"})),v8=Zt({prefix:"f",name:"base16",alphabet:"0123456789abc\
def",bitsPerChar:4,caseInsensitive:!0}),E8=Zt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
k8=Object.freeze(Object.defineProperty({__proto__:null,base16:v8,base16upper:E8},Symbol.toStringTag,{value:"Module"})),x8=Zt(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),S8=Object.freeze(Object.defineProperty({__proto__:null,base2:x8},
Symbol.toStringTag,{value:"Module"})),lv=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
A8=lv.reduce((t,e,r)=>(t[r]=e,t),[]),I8=lv.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return t[n]=r,t},[]);function _8(t){return t.reduce((e,r)=>(e+=A8[r],e),"")}function C8(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=I8[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const T8=wd({prefix:"🚀",name:"\
base256emoji",encode:_8,decode:C8}),R8=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:T8},Symbol.toStringTag,
{value:"Module"})),M8=Zt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),B8=Zt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),L8=Zt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),D8=Zt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),$8=Object.freeze(Object.defineProperty({__proto__:null,base64:M8,base64pad:B8,
base64url:L8,base64urlpad:D8},Symbol.toStringTag,{value:"Module"})),N8=Zt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
P8=Object.freeze(Object.defineProperty({__proto__:null,base8:N8},Symbol.toStringTag,{value:"Module"})),O8=wd({prefix:"\0",
name:"identity",encode:t=>cC(ai(t)),decode:t=>ai(aC(t))}),U8=Object.freeze(Object.defineProperty({__proto__:null,identity:O8},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const qg={...U8,...S8,...P8,...w8,...k8,...BC,...DC,
...NC,...$8,...R8};function dv(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const jg=dv(
"utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),fu=dv("ascii","a",t=>{let e="\
a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=bl(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}),F8={utf8:jg,"utf-8":jg,hex:qg.base16,latin1:fu,ascii:fu,binary:fu,...qg};function uv(t,e="\
utf8"){const r=F8[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}
const z8=async(t,e,r)=>{const n=new Lr({type:"symlink",data:uv(t.link),mtime:t.mtime,mode:t.mode}),s=$n(Dn({Data:n.marshal()})),
i=await zs(s,e,r),o=t.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:t.originalPath,block:s}};function q8(t){
return Symbol.iterator in t}function j8(t){return Symbol.asyncIterator in t}function G8(t){try{if(t instanceof Uint8Array)
return(async function*(){yield t})();if(q8(t))return(async function*(){yield*t})();if(j8(t))return t}catch{throw new Xn(
"Content was invalid")}throw new Xn("Content was invalid")}function W8(t){return typeof t.path=="string"}function H8(t){
return async function*(r,n){for await(const s of r){let i;if(W8(s)&&(i=s.path,s.path=s.path.split("/").filter(o=>o!=null&&
o!==".").join("/")),V8(s)){const o={path:s.path,mtime:s.mtime,mode:s.mode,content:(async function*(){let c=0n;for await(const l of t.
chunker(t.chunkValidator(G8(s.content)))){const d=BigInt(l.byteLength);c+=d,t.onProgress?.(new Nn("unixfs:importer:progr\
ess:file:read",{bytesRead:c,chunkSize:d,path:s.path})),yield l}})(),originalPath:i},a=t.fileBuilder??b8;yield async()=>a(
o,n,t)}else if(K8(s)){const o={path:s.path,link:s.link,mtime:s.mtime,mode:s.mode,originalPath:i},a=t.symlinkBuilder??z8;
yield async()=>a(o,n,t)}else if(s.path!=null){const o={path:s.path,mtime:s.mtime,mode:s.mode,originalPath:i},a=t.dirBuilder??
p8;yield async()=>a(o,n,t)}else throw new Error("Import candidate must have content or path or both")}}}function V8(t){return t.
content!=null}function K8(t){return t.link!=null}const Q8=()=>async function*(e){for await(const r of e){if(r.length===void 0)
throw new Xn("Content was invalid");if(typeof r=="string"||r instanceof String)yield uv(r.toString());else if(Array.isArray(
r))yield Uint8Array.from(r);else if(r instanceof Uint8Array)yield r;else throw new Xn("Content was invalid")}},J8=174;function fv(t){
const e=t?.maxChildrenPerNode??J8;return async function r(n,s){const i=[];for await(const o of U0(n,e))i.push(await s(o));
return i.length>1?r(i,s):i[0]}}class Ca{options;root;dir;path;dirty;flat;parent;parentKey;unixfs;mode;mtime;cid;size;nodeSize;constructor(e,r){
this.options=r??{},this.root=e.root,this.dir=e.dir,this.path=e.path,this.dirty=e.dirty,this.flat=e.flat,this.parent=e.parent,
this.parentKey=e.parentKey,this.unixfs=e.unixfs,this.mode=e.mode,this.mtime=e.mtime}}const Gg=2**32,Y8=[0,1,2,2,3,3,3,3,
4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8];function X8(t){let e=0;return t>=Gg&&(t=Math.floor(t/Gg),e=32),t>=65536&&(t>>>=16,e+=16),t>=256&&(t>>>=
8,e+=8),e+Y8[t]}function Ls(t){return t%2===0&&t++,Math.floor((X8(t)+6)/7)}function hu(t){let e=0;for(let r=0;r<t.length;r++){
const n=t.charCodeAt(r);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319&&r+1<t.length?(r++,e+=4):e+=3}return e}function Z8(t,e,r){
let n=1+Ls(e)+e;return n+=1+Ls(t)+t,n+=1+Ls(r),1+Ls(n)+n}const e6=493;function t6(t,e){let r=2;if(t!==void 0&&t!==e6&&(r+=
1+Ls(t)),e!=null){let n=0;const s=Number(e.secs);s<0?n+=11:n+=1+Ls(s),e.nsecs!=null&&(n+=5),r+=1+Ls(n)+n}return 1+Ls(r)+
r}function pu(t,e){return e?.cid!=null&&e?.size!=null?t+e.cid.byteLength:0}function mu(t,e){return e?.cid!=null&&e?.size!=
null?Z8(t,e.cid.byteLength,Number(e.size)):0}class Sp extends Ca{_children;constructor(e,r){super(e,r),this._children=new Map}async put(e,r){
if(this.nodeSize!==void 0){const n=this._children.get(e),s=hu(e),i=this.options?.shardSplitStrategy;if(i==="links-bytes")
this.nodeSize-=pu(s,n),this.nodeSize+=pu(s,r);else if(i==="block-bytes")this.nodeSize-=mu(s,n),this.nodeSize+=mu(s,r);else
throw new Fg(`Invalid shardSplitStrategy: ${i}`);this.nodeSize<0&&(this.nodeSize=void 0)}this.cid=void 0,this.size=void 0,
this._children.set(e,r)}async get(e){return Promise.resolve(this._children.get(e))}childCount(){return this._children.size}directChildrenCount(){
return this.childCount()}onlyChild(){return this._children.values().next().value}*eachChildSeries(){for(const[e,r]of this.
_children.entries())yield{key:e,child:r}}marshal(){const e=new Lr({type:"directory",mtime:this.mtime,mode:this.mode}),r=[];
for(const[s,i]of this._children.entries())if(!(i.size==null||i.cid==null)){if(i.cid==null)throw new Error("Directory con\
tents must be flushed before marshaling");r.push({Hash:i.cid,Name:s,Tsize:i.size==null?void 0:Number(i.size)})}const n={
Data:e.marshal(),Links:r};return $n(Dn(n),this.options)}async estimateNodeSize(){if(this.nodeSize!==void 0)return this.nodeSize;
const e=this.options?.shardSplitStrategy;if(e==="links-bytes"){this.nodeSize=0;for(const[r,n]of this._children.entries())
this.nodeSize+=pu(hu(r),n)}else if(e==="block-bytes"){this.nodeSize=t6(this.mode,this.mtime);for(const[r,n]of this._children.
entries())this.nodeSize+=mu(hu(r),n)}else throw new Fg(`Invalid shardSplitStrategy: ${e}`);return this.nodeSize}async*flush(e){
const r=[];for(const[c,l]of this._children.entries()){let d=l;if(l instanceof Ca)for await(const f of l.flush(e))d=f,yield f;
d.size!=null&&d.cid!=null&&r.push({Name:c,Tsize:Number(d.size),Hash:d.cid})}const n=new Lr({type:"directory",mtime:this.
mtime,mode:this.mode}),s={Data:n.marshal(),Links:r},i=$n(Dn(s),this.options),o=await zs(i,e,this.options),a=i.length+s.Links.
reduce((c,l)=>c+(l.Tsize??0),0);this.cid=o,this.size=a,yield{cid:o,unixfs:n,path:this.path,size:BigInt(a)}}}function r6(t){
return t?.buffer instanceof ArrayBuffer}function Wg(t){return r6(t)?t:t.slice()}var n6=hv,Hg=128,s6=-128,i6=Math.pow(2,31);
function hv(t,e,r){e=e||[],r=r||0;for(var n=r;t>=i6;)e[r++]=t&255|Hg,t/=128;for(;t&s6;)e[r++]=t&255|Hg,t>>>=7;return e[r]=
t|0,hv.bytes=r-n+1,e}var o6=jf,a6=128,Vg=127;function jf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw jf.bytes=
0,new RangeError("Could not decode varint");o=t[i++],r+=s<28?(o&Vg)<<s:(o&Vg)*Math.pow(2,s),s+=7}while(o>=a6);return jf.
bytes=i-n,r}var c6=Math.pow(2,7),l6=Math.pow(2,14),d6=Math.pow(2,21),u6=Math.pow(2,28),f6=Math.pow(2,35),h6=Math.pow(2,42),
p6=Math.pow(2,49),m6=Math.pow(2,56),g6=Math.pow(2,63),b6=function(t){return t<c6?1:t<l6?2:t<d6?3:t<u6?4:t<f6?5:t<h6?6:t<
p6?7:t<m6?8:t<g6?9:10},y6={encode:n6,decode:o6,encodingLength:b6},pv=y6;function Kg(t,e,r=0){return pv.encode(t,e,r),e}function Qg(t){
return pv.encodingLength(t)}function w6(t,e){const r=e.byteLength,n=Qg(t),s=n+Qg(r),i=new Uint8Array(s+r);return Kg(t,i,
0),Kg(r,i,n),i.set(e,s),new v6(t,r,e,i)}let v6=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,
this.digest=Wg(n),this.bytes=Wg(s)}};const E6=20;function k6({name:t,code:e,encode:r,minDigestLength:n,maxDigestLength:s}){
return new x6(t,e,r,n,s)}class x6{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){this.name=e,this.
code=r,this.encode=n,this.minDigestLength=s??E6,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){if(r.truncate<this.
minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.
maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?Jg(n,
this.code,r?.truncate):n.then(s=>Jg(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}}function Jg(t,e,r){
if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${t.
byteLength}`);t=t.subarray(0,r)}return w6(e,t)}function hs(t,e){const r=t.lo+e.lo>>>0,n=t.hi+e.hi+(r<t.lo?1:0)>>>0;return{
lo:r,hi:n}}function Zr(t,e){const r=t.lo&65535,n=t.lo>>>16,s=e.lo&65535,i=e.lo>>>16,o=r*s,a=r*i,c=n*s,l=n*i,d=(o>>>16)+(a&
65535)+(c&65535)>>>0,f=(d<<16|o&65535)>>>0,h=l+(a>>>16)+(c>>>16)+(d>>>16),p=Math.imul(t.lo,e.hi),m=Math.imul(t.hi,e.lo),
b=h+p+m>>>0;return{lo:f,hi:b}}function xi(t,e){if(e===0)return t;if(e===32)return{lo:t.hi,hi:t.lo};if(e<32){const s=(t.lo<<
e|t.hi>>>32-e)>>>0,i=(t.hi<<e|t.lo>>>32-e)>>>0;return{lo:s,hi:i}}e-=32;const r=(t.hi<<e|t.lo>>>32-e)>>>0,n=(t.lo<<e|t.hi>>>
32-e)>>>0;return{lo:r,hi:n}}function vt(t,e){return{lo:(t.lo^e.lo)>>>0,hi:(t.hi^e.hi)>>>0}}function gu(t,e){return{lo:t.
hi>>>e-32,hi:0}}function ot(t,e){return{lo:t>>>0,hi:e>>>0}}function Yg(t,e){const r=e*8,n=t[r]|t[r+1]<<8|t[r+2]<<16|t[r+
3]<<24,s=t[r+4]|t[r+5]<<8|t[r+6]<<16|t[r+7]<<24;return{lo:n>>>0,hi:s>>>0}}function Xg(t){return t=vt(t,gu(t,33)),t=Zr(t,
ot(3981806797,4283543511)),t=vt(t,gu(t,33)),t=Zr(t,ot(444984403,3301882366)),t=vt(t,gu(t,33)),t}function S6(t,e=0){let r=ot(
e,0),n=ot(e,0);const s=t.length,i=Math.floor(s/16),o=ot(289559509,2277735313),a=ot(658871167,1291169091);for(let h=0;h<i;h++){
let p=Yg(t,h*2),m=Yg(t,h*2+1);p=Zr(p,o),p=xi(p,31),p=Zr(p,a),r=vt(r,p),r=xi(r,27),r=hs(r,n),r=hs(Zr(r,ot(5,0)),ot(1390208809,
0)),m=Zr(m,a),m=xi(m,33),m=Zr(m,o),n=vt(n,m),n=xi(n,31),n=hs(n,r),n=hs(Zr(n,ot(5,0)),ot(944331445,0))}let c=ot(0,0),l=ot(
0,0);const d=t.slice(i*16);switch(d.length){case 15:l=vt(l,ot(0,d[14]<<16));case 14:l=vt(l,ot(0,d[13]<<8));case 13:l=vt(
l,ot(0,d[12]));case 12:l=vt(l,ot(d[11]<<24,0));case 11:l=vt(l,ot(d[10]<<16,0));case 10:l=vt(l,ot(d[9]<<8,0));case 9:l=vt(
l,ot(d[8],0)),l=Zr(l,a),l=xi(l,33),l=Zr(l,o),n=vt(n,l);case 8:c=vt(c,ot(0,d[7]<<24));case 7:c=vt(c,ot(0,d[6]<<16));case 6:
c=vt(c,ot(0,d[5]<<8));case 5:c=vt(c,ot(0,d[4]));case 4:c=vt(c,ot(d[3]<<24,0));case 3:c=vt(c,ot(d[2]<<16,0));case 2:c=vt(
c,ot(d[1]<<8,0));case 1:c=vt(c,ot(d[0],0)),c=Zr(c,o),c=xi(c,31),c=Zr(c,a),r=vt(r,c)}const f=ot(s,0);return r=vt(r,f),n=vt(
n,f),r=hs(r,n),n=hs(n,r),r=Xg(r),n=Xg(n),r=hs(r,n),n=hs(n,r),new Uint8Array([r.hi>>>24&255,r.hi>>>16&255,r.hi>>>8&255,r.
hi&255,r.lo>>>24&255,r.lo>>>16&255,r.lo>>>8&255,r.lo&255,n.hi>>>24&255,n.hi>>>16&255,n.hi>>>8&255,n.hi&255,n.lo>>>24&255,
n.lo>>>16&255,n.lo>>>8&255,n.lo&255])}const mv=k6({name:"murmur3-128",code:34,encode:t=>S6(t)});let A6=class Gf extends Error{static name="\
NotFoundError";name=Gf.name;static code="ERR_NOT_FOUND";code=Gf.code;constructor(e="Not Found"){super(e)}};class I6{has(e,r){
return Promise.reject(new Error(".has is not implemented"))}put(e,r,n){return Promise.reject(new Error(".put is not impl\
emented"))}async*putMany(e,r){for await(const{cid:n,bytes:s}of e)await this.put(n,s,r),yield n}get(e,r){throw new Error(
".get is not implemented")}async*getMany(e,r){for await(const n of e)yield{cid:n,bytes:this.get(n,r)}}delete(e,r){return Promise.
reject(new Error(".delete is not implemented"))}async*deleteMany(e,r){for await(const n of e)await this.delete(n,r),yield n}async*getAll(e){
throw new Error(".getAll is not implemented")}}class _6 extends I6{put(e,r,n){return n?.signal?.throwIfAborted(),e}get(e,r){
throw r?.signal?.throwIfAborted(),new A6}has(e,r){return r?.signal?.throwIfAborted(),!1}async delete(e,r){r?.signal?.throwIfAborted()}async*getAll(e){
e?.signal?.throwIfAborted()}}function gv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.
default:t}var bu,Zg;function C6(){if(Zg)return bu;Zg=1;const t=7;bu=class{constructor(){this._bitArrays=[],this._data=[],
this._length=0,this._changedLength=!1,this._changedData=!1}set(o,a){let c=this._internalPositionFor(o,!1);if(a===void 0)
c!==-1&&(this._unsetInternalPos(c),this._unsetBit(o),this._changedLength=!0,this._changedData=!0);else{let l=!1;c===-1?(c=
this._data.length,this._setBit(o),this._changedData=!0):l=!0,this._setInternalPos(c,o,a,l),this._changedLength=!0}}unset(o){
this.set(o,void 0)}get(o){this._sortData();const a=this._internalPositionFor(o,!0);if(a!==-1)return this._data[a][1]}push(o){
return this.set(this.length,o),this.length}get length(){if(this._sortData(),this._changedLength){const o=this._data[this.
_data.length-1];this._length=o?o[0]+1:0,this._changedLength=!1}return this._length}forEach(o){let a=0;for(;a<this.length;)
o(this.get(a),a,this),a++}map(o){let a=0,c=new Array(this.length);for(;a<this.length;)c[a]=o(this.get(a),a,this),a++;return c}reduce(o,a){
let c=0,l=a;for(;c<this.length;){const d=this.get(c);l=o(l,d,c),c++}return l}find(o){let a=0,c,l;for(;a<this.length&&!c;)
l=this.get(a),c=o(l),a++;return c?l:void 0}_internalPositionFor(o,a){const c=this._bytePosFor(o,a);if(c>=this._bitArrays.
length)return-1;const l=this._bitArrays[c],d=o-c*t;if(!((l&1<<d)>0))return-1;const h=this._bitArrays.slice(0,c).reduce(e,
0),p=~(4294967295<<d+1),m=r(l&p);return h+m-1}_bytePosFor(o,a){const c=Math.floor(o/t),l=c+1;for(;!a&&this._bitArrays.length<
l;)this._bitArrays.push(0);return c}_setBit(o){const a=this._bytePosFor(o,!1);this._bitArrays[a]|=1<<o-a*t}_unsetBit(o){
const a=this._bytePosFor(o,!1);this._bitArrays[a]&=~(1<<o-a*t)}_setInternalPos(o,a,c,l){const d=this._data,f=[a,c];if(l)
this._sortData(),d[o]=f;else{if(d.length)if(d[d.length-1][0]>=a)d.push(f);else if(d[0][0]<=a)d.unshift(f);else{const h=Math.
round(d.length/2);this._data=d.slice(0,h).concat(f).concat(d.slice(h))}else this._data.push(f);this._changedData=!0,this.
_changedLength=!0}}_unsetInternalPos(o){this._data.splice(o,1)}_sortData(){this._changedData&&this._data.sort(n),this._changedData=
!1}bitField(){const o=[];let a=8,c=0,l=0,d;const f=this._bitArrays.slice();for(;f.length||c;){c===0&&(d=f.shift(),c=7);const p=Math.
min(c,a),m=~(255<<p),b=d&m;l|=b<<8-a,d=d>>>p,c-=p,a-=p,(!a||!c&&!f.length)&&(o.push(l),l=0,a=8)}for(var h=o.length-1;h>0&&
o[h]===0;h--)o.pop();return o}compactArray(){return this._sortData(),this._data.map(s)}};function e(i,o){return i+r(o)}function r(i){
let o=i;return o=o-(o>>1&1431655765),o=(o&858993459)+(o>>2&858993459),(o+(o>>4)&252645135)*16843009>>24}function n(i,o){
return i[0]-o[0]}function s(i){return i[1]}return bu}var T6=C6();const R6=gv(T6);function Wf(t){if(t instanceof Uint8Array&&
t.constructor.name==="Uint8Array")return tb(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(
t))return tb(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function M6(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const eb=4096;function B6(t){const e=t.
length;if(e<=eb)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=eb));return r}function L6(t){return t?.buffer instanceof ArrayBuffer}function tb(t){return L6(t)?t:t.slice()}
function D6(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var d=t.length,f=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||
(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===
0;)k++,y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=
256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;
for(var P=f.repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expect\
ed String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.
length-y)*h+1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){
for(var C=A-k;C!==A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(
u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var $6=D6,N6=$6;let P6=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},O6=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return bv(this,e)}},
U6=class{decoders;constructor(e){this.decoders=e}or(e){return bv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function bv(t,e){return new U6({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let F6=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new P6(e,r,n),this.decoder=new O6(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function vd({name:t,prefix:e,encode:r,decode:n}){return new F6(t,e,r,
n)}function Ha({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=N6(r,t,n);return vd({prefix:e,
name:t,encode:s,decode:o=>Wf(i(o))})}function z6(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function q6(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function j6(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function er({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=j6(n,s);return vd(
{prefix:e,name:t,encode(o){return q6(o,n,r)},decode(o){return z6(o,i,r,t)}})}const G6=Ha({prefix:"9",name:"base10",alphabet:"\
0123456789"}),W6=Object.freeze(Object.defineProperty({__proto__:null,base10:G6},Symbol.toStringTag,{value:"Module"})),H6=er(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),V6=er({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),K6=Object.freeze(Object.defineProperty({__proto__:null,
base16:H6,base16upper:V6},Symbol.toStringTag,{value:"Module"})),Q6=er({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
J6=Object.freeze(Object.defineProperty({__proto__:null,base2:Q6},Symbol.toStringTag,{value:"Module"})),yv=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),Y6=yv.reduce((t,e,r)=>(t[r]=e,t),[]),X6=yv.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function Z6(t){return t.reduce((e,r)=>(e+=Y6[r],e),"")}function e3(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=X6[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const t3=vd({prefix:"🚀",name:"\
base256emoji",encode:Z6,decode:e3}),r3=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:t3},Symbol.toStringTag,
{value:"Module"})),n3=er({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
s3=er({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),i3=er(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),o3=er({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),a3=er({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),c3=er({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),l3=er({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),d3=er({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),u3=er({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),f3=Object.freeze(Object.defineProperty({__proto__:null,
base32:n3,base32hex:a3,base32hexpad:l3,base32hexpadupper:d3,base32hexupper:c3,base32pad:i3,base32padupper:o3,base32upper:s3,
base32z:u3},Symbol.toStringTag,{value:"Module"})),h3=Ha({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),p3=Ha({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
m3=Object.freeze(Object.defineProperty({__proto__:null,base36:h3,base36upper:p3},Symbol.toStringTag,{value:"Module"})),g3=Ha(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),b3=Ha({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),y3=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:g3,base58flickr:b3},Symbol.toStringTag,{value:"Module"})),w3=er({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),v3=er({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),E3=er({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),k3=er({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),x3=Object.freeze(Object.defineProperty(
{__proto__:null,base64:w3,base64pad:v3,base64url:E3,base64urlpad:k3},Symbol.toStringTag,{value:"Module"})),S3=er({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),A3=Object.freeze(Object.defineProperty({__proto__:null,base8:S3},Symbol.
toStringTag,{value:"Module"})),I3=vd({prefix:"\0",name:"identity",encode:t=>B6(Wf(t)),decode:t=>Wf(M6(t))}),_3=Object.freeze(
Object.defineProperty({__proto__:null,identity:I3},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const rb={..._3,...J6,...A3,...W6,...K6,...f3,...m3,...y3,...x3,...r3};function wv(t=0){return new Uint8Array(t)}function vv(t,e,r,n){
return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const nb=vv("utf8","u",t=>"u"+new TextDecoder(
"utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),yu=vv("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)
e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=wv(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}),C3={utf8:nb,"utf-8":nb,hex:rb.base16,latin1:yu,ascii:yu,binary:yu,...rb};function T3(t,e="utf8"){const r=C3[e];
if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}class Gr{_options;_popCount;_parent;_posAtParent;_children;key;constructor(e,r,n=0){
this._options=e,this._popCount=0,this._parent=r,this._posAtParent=n,this._children=new R6,this.key=null}async put(e,r){const n=await this.
_findNewBucketAndPos(e);n.bucket._putAt(n,e,r)}async get(e){const r=await this._findChild(e);if(r!=null)return r.value}async del(e){
const r=await this._findPlace(e),n=r.bucket._at(r.pos);n!=null&&n.key===e&&r.bucket._delAt(r.pos)}leafCount(){return this.
_children.compactArray().reduce((r,n)=>n instanceof Gr?r+n.leafCount():r+1,0)}childrenCount(){return this._children.length}onlyChild(){
return this._children.get(0)}*eachLeafSeries(){const e=this._children.compactArray();for(const r of e)r instanceof Gr?yield*r.
eachLeafSeries():yield r}serialize(e,r){const n=[];return r(this._children.reduce((s,i,o)=>(i!=null&&(i instanceof Gr?s.
push(i.serialize(e,r)):s.push(e(i,o))),s),n))}async asyncTransform(e,r){return Ev(this,e,r)}toJSON(){return this.serialize(
M3,B3)}prettyPrint(){return JSON.stringify(this.toJSON(),null,"  ")}tableSize(){return Math.pow(2,this._options.bits)}async _findChild(e){
const r=await this._findPlace(e),n=r.bucket._at(r.pos);if(!(n instanceof Gr)&&n!=null&&n.key===e)return n}async _findPlace(e){
const r=this._options.hash(typeof e=="string"?T3(e):e),n=await r.take(this._options.bits),s=this._children.get(n);return s instanceof
Gr?s._findPlace(r):{bucket:this,pos:n,hash:r,existingChild:s}}async _findNewBucketAndPos(e){const r=await this._findPlace(
e);if(r.existingChild!=null&&r.existingChild.key!==e){const n=new Gr(this._options,r.bucket,r.pos);r.bucket._putObjectAt(
r.pos,n);const s=await n._findPlace(r.existingChild.hash);return s.bucket._putAt(s,r.existingChild.key,r.existingChild.value),
n._findNewBucketAndPos(r.hash)}return r}_putAt(e,r,n){this._putObjectAt(e.pos,{key:r,value:n,hash:e.hash})}_putObjectAt(e,r){
this._children.get(e)==null&&this._popCount++,this._children.set(e,r)}_delAt(e){if(e===-1)throw new Error("Invalid posit\
ion");this._children.get(e)!=null&&this._popCount--,this._children.unset(e),this._level()}_level(){if(this._parent!=null&&
this._popCount<=1)if(this._popCount===1){const e=this._children.find(R3);if(e!=null&&!(e instanceof Gr)){const r=e.hash;
r.untake(this._options.bits);const n={pos:this._posAtParent,hash:r,bucket:this._parent};this._parent._putAt(n,e.key,e.value)}}else
this._parent._delAt(this._posAtParent)}_at(e){return this._children.get(e)}}function R3(t){return!!t}function M3(t,e){return t.
key}function B3(t){return t}async function Ev(t,e,r){const n=[];for(const s of t._children.compactArray())if(s instanceof
Gr)await Ev(s,e,r);else{const i=await e(s);n.push({bitField:t._children.bitField(),children:i})}return r(n)}function L3(t){
return t?.buffer instanceof ArrayBuffer}function D3(t){if(L3(t))return t;const e=t.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function $3(t,e){e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=wv(e);let n=0;for(const s of t)r.set(
s,n),n+=s.length;return D3(r)}const N3=[255,254,252,248,240,224,192,128],P3=[1,3,7,15,31,63,127,255];class O3{_value;_currentBytePos;_currentBitPos;constructor(e){
this._value=e,this._currentBytePos=e.length-1,this._currentBitPos=7}availableBits(){return this._currentBitPos+1+this._currentBytePos*
8}totalBits(){return this._value.length*8}take(e){let r=e,n=0;for(;r>0&&this._haveBits();){const s=this._value[this._currentBytePos],
i=this._currentBitPos+1,o=Math.min(i,r),a=U3(s,i-o,o);n=(n<<o)+a,r-=o,this._currentBitPos-=o,this._currentBitPos<0&&(this.
_currentBitPos=7,this._currentBytePos--)}return n}untake(e){for(this._currentBitPos+=e;this._currentBitPos>7;)this._currentBitPos-=
8,this._currentBytePos+=1}_haveBits(){return this._currentBytePos>=0}}function U3(t,e,r){const n=F3(e,r);return(t&n)>>>e}
function F3(t,e){return N3[t]&P3[Math.min(e+t-1,7)]}function z3(t){function e(r){return r instanceof sb?r:new sb(r,t)}return e}
class sb{_value;_hashFn;_depth;_availableBits;_currentBufferIndex;_buffers;constructor(e,r){if(!(e instanceof Uint8Array))
throw new Error("can only hash Uint8Arrays");this._value=e,this._hashFn=r,this._depth=-1,this._availableBits=0,this._currentBufferIndex=
0,this._buffers=[]}async take(e){let r=e;for(;this._availableBits<r;)await this._produceMoreBits();let n=0;for(;r>0;){const s=this.
_buffers[this._currentBufferIndex],i=Math.min(s.availableBits(),r),o=s.take(i);n=(n<<i)+o,r-=i,this._availableBits-=i,s.
availableBits()===0&&this._currentBufferIndex++}return n}untake(e){let r=e;for(;r>0;){const n=this._buffers[this._currentBufferIndex],
s=Math.min(n.totalBits()-n.availableBits(),r);n.untake(s),r-=s,this._availableBits+=s,this._currentBufferIndex>0&&n.totalBits()===
n.availableBits()&&(this._depth--,this._currentBufferIndex--)}}async _produceMoreBits(){this._depth++;const e=this._depth>
0?$3([this._value,Uint8Array.from([this._depth])]):this._value,r=await this._hashFn(e),n=new O3(r);this._buffers.push(n),
this._availableBits+=n.availableBits()}}function kv(t){if(t==null||t.hashFn==null)throw new Error("please define an opti\
ons.hashFn");const e={bits:t.bits??8,hash:z3(t.hashFn)};return new Gr(e)}async function q3(t){return(await mv.encode(t)).
slice(0,8).reverse()}class j3 extends Ca{bucket;constructor(e,r){super(e,r),this.bucket=kv({hashFn:q3,bits:r.shardFanoutBits??
G0})}async put(e,r){this.cid=void 0,this.size=void 0,this.nodeSize=void 0,await this.bucket.put(e,r)}async get(e){return this.
bucket.get(e)}childCount(){return this.bucket.leafCount()}directChildrenCount(){return this.bucket.childrenCount()}onlyChild(){
return this.bucket.onlyChild()}*eachChildSeries(){for(const{key:e,value:r}of this.bucket.eachLeafSeries())yield{key:e,child:r}}async estimateNodeSize(){
if(this.nodeSize!==void 0)return this.nodeSize;const e=new _6,r=await Av(this.bucket,this,e,this.options);return this.nodeSize=
r.size,this.nodeSize}async*flush(e){for await(const r of xv(this.bucket,e,this,this.options))yield{...r,path:this.path}}}
async function*xv(t,e,r,n){const s=t._children,i=(t.tableSize()-1).toString(16).length,o=[];let a=0n;for(let m=0;m<s.length;m++){
const b=s.get(m);if(b==null)continue;const g=m.toString(16).toUpperCase().padStart(i,"0");if(b instanceof Gr){let u;for await(const y of xv(
b,e,null,n))u=y;if(u==null)throw new Error("Could not flush sharded directory, no sub-shard found");o.push({Name:g,Tsize:Number(
u.size),Hash:u.cid}),a+=u.size}else if(Sv(b.value)){const u=b.value;let y;for await(const k of u.flush(e))y=k,yield y;if(y==
null)throw new Error("Did not flush dir");const E=g+b.key;o.push({Name:E,Tsize:Number(y.size),Hash:y.cid}),a+=y.size}else{
const u=b.value;if(u.cid==null)continue;const y=g+b.key,E=u.size;o.push({Name:y,Tsize:Number(E),Hash:u.cid}),a+=BigInt(E??
0)}}const c=Uint8Array.from(s.bitField().reverse()),l=new Lr({type:"hamt-sharded-directory",data:c,fanout:BigInt(t.tableSize()),
hashType:j0,mtime:r?.mtime,mode:r?.mode}),d={Data:l.marshal(),Links:o},f=$n(Dn(d),n),h=await zs(f,e,n),p=BigInt(f.byteLength)+
a;yield{cid:h,unixfs:l,size:p}}function Sv(t){return typeof t.flush=="function"}async function Av(t,e,r,n){const s=t._children,
i=(t.tableSize()-1).toString(16).length,o=[];let a=0;for(let h=0;h<s.length;h++){const p=s.get(h);if(p==null)continue;const m=h.
toString(16).toUpperCase().padStart(i,"0");if(p instanceof Gr){const{size:b,cid:g}=await Av(p,null,r,n);o.push({Name:m,Tsize:Number(
b),Hash:g}),a+=m.length+g.byteLength}else if(Sv(p.value)){const b=p.value,g=b.nodeSize;if(b.cid==null)throw new Error("C\
hild directory has not been persisted");o.push({Name:m+p.key,Tsize:Number(g),Hash:b.cid}),a+=m.length+b.cid.byteLength}else{
const b=p.value,g=m+p.key,u=b.size;o.push({Name:g,Tsize:Number(u),Hash:b.cid}),a+=m.length+b.cid.byteLength}}const c=Uint8Array.
from(s.bitField().reverse()),l=new Lr({type:"hamt-sharded-directory",data:c,fanout:BigInt(t.tableSize()),hashType:j0,mtime:e?.
mtime,mode:e?.mode}),d=$n(Dn({Data:l.marshal(),Links:o}),n);return{cid:await zs(d,r,n),size:n.shardSplitStrategy==="link\
s-bytes"?a:d.length}}async function Iv(t,e){let r=e;const n=e.options.shardSplitThresholdBytes??W0;e instanceof Sp&&await e.
estimateNodeSize()>n&&(r=await G3(e));const s=r.parent;if(s!=null){if(r!==e){if(t!=null&&(t.parent=r),r.parentKey==null)
throw new Error("No parent key found");await s.put(r.parentKey,r)}return Iv(r,s)}return r}async function G3(t){const e=new j3(
{root:t.root,dir:!0,parent:t.parent,parentKey:t.parentKey,path:t.path,dirty:t.dirty,flat:!1,mtime:t.mtime,mode:t.mode},t.
options);for(const{key:r,child:n}of t.eachChildSeries())await e.put(r,n);return e}const W3=(t="")=>t.split(/(?<!\\)\//).
filter(Boolean);async function H3(t,e,r){const n=W3(t.path??""),s=n.length-1;let i=e,o="";for(let a=0;a<n.length;a++){const c=n[a];
o+=`${o!==""?"/":""}${c}`;const l=a===s;if(i.dirty=!0,i.cid=void 0,i.size=void 0,l)await i.put(c,t),e=await Iv(null,i);else{
let d=await i.get(c);(d==null||!(d instanceof Ca))&&(d=new Sp({root:!1,dir:!0,parent:i,parentKey:c,path:o,dirty:!0,flat:!0,
mtime:d?.unixfs?.mtime,mode:d?.unixfs?.mode},r)),await i.put(c,d),i=d}}return e}async function*ib(t,e){if(!(t instanceof
Ca)){t.unixfs?.isDirectory()===!0&&(yield t);return}yield*t.flush(e)}function V3(t){return async function*(r,n){let s=new Sp(
{root:!0,dir:!0,path:"",dirty:!0,flat:!0},t),i,o=!1;for await(const a of r){if(a==null)continue;const c=`${a.originalPath??
""}`.split("/")[0];c!=null&&c!==""&&(i==null?(i=c,o=!0):i!==c&&(o=!1)),s=await H3(a,s,t),a.unixfs?.isDirectory()!==!0&&(yield a)}
if(t.wrapWithDirectory||o&&s.childCount()>1)yield*ib(s,n);else for(const a of s.eachChildSeries())a!=null&&(yield*ib(a.child,
n))}}async function*K3(t,e,r={}){let n;Symbol.asyncIterator in t||Symbol.iterator in t?n=t:n=[t];let s,i;r.profile==="un\
ixfs-v0-2015"?(r.shardSplitStrategy=r.shardSplitStrategy??"links-bytes",r.cidVersion=r.cidVersion??0,r.rawLeaves=r.rawLeaves??
!1,s=H0,i=174,r.fieldOrder="links-first"):r.profile==="unixfs-v1-2025"&&(r.shardSplitStrategy=r.shardSplitStrategy??"blo\
ck-bytes",r.cidVersion=r.cidVersion??1,r.rawLeaves=r.rawLeaves??!0,s=II,i=1024,r.fieldOrder="links-first");const o=r.wrapWithDirectory??
MI,a=r.shardSplitThresholdBytes??W0,c=r.shardSplitStrategy??AI,l=r.shardFanoutBits??G0,d=r.cidVersion??q0,f=r.rawLeaves??
RI,h=r.leafType??BI,p=r.fileImportConcurrency??_I,m=r.blockWriteConcurrency??CI,b=r.reduceSingleLeafToSelf??TI,g=r.fieldOrder??
LI,u=r.chunker??V0({chunkSize:s}),y=r.chunkValidator??Q8(),E=r.dagBuilder??H8({chunker:u,chunkValidator:y,wrapWithDirectory:o,
layout:r.layout??fv({maxChildrenPerNode:i}),bufferImporter:r.bufferImporter??f8({cidVersion:d,rawLeaves:f,leafType:h,onProgress:r.
onProgress}),blockWriteConcurrency:m,reduceSingleLeafToSelf:b,cidVersion:d,onProgress:r.onProgress,dirBuilder:r.dirBuilder,
fileBuilder:r.fileBuilder,fieldOrder:g}),k=r.treeBuilder??V3({wrapWithDirectory:o,shardSplitThresholdBytes:a,shardSplitStrategy:c,
shardFanoutBits:l,cidVersion:d,onProgress:r.onProgress,fieldOrder:g});for await(const A of k(F0(E(n,e),p),e))yield{cid:A.
cid,path:A.path,unixfs:A.unixfs,size:A.size}}async function Q3(t,e,r={}){const n=await vI(K3([t],e,r));if(n==null)throw new h8(
"Nothing imported");return n}async function J3(t,e,r={}){return Q3({content:t},e,r)}function Y3(t,e){if(t===e)return!0;if(t.
byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function Ap(t){if(t instanceof
Uint8Array&&t.constructor.name==="Uint8Array")return Ta(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.
isView(t))return Ta(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function X3(t){return t?.buffer instanceof ArrayBuffer}function Ta(t){return X3(t)?t:t.slice()}function Z3(t,e,r){if(t.
length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?
u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===0;)k++,
y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;for(var P=f.
repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expected String");
if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.length-y)*h+
1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){for(var C=A-k;C!==
A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(u);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var e4=Z3,t4=e4;let r4=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},n4=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return _v(this,e)}},
s4=class{decoders;constructor(e){this.decoders=e}or(e){return _v(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function _v(t,e){return new s4({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let i4=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new r4(e,r,n),this.decoder=new n4(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Cv({name:t,prefix:e,encode:r,decode:n}){return new i4(t,e,r,
n)}function Ed({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=t4(r,t,n);return Cv({prefix:e,
name:t,encode:s,decode:o=>Ap(i(o))})}function o4(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function a4(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function c4(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function is({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=c4(n,s);return Cv(
{prefix:e,name:t,encode(o){return a4(o,n,r)},decode(o){return o4(o,i,r,t)}})}const Oc=is({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});is({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});is({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});is({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});is({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});is({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});is({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});is({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});is({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const wu=Ed(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ed({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const _s=Ed({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ed({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var l4=Tv,ob=128,d4=-128,u4=Math.pow(2,31);function Tv(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=u4;)e[r++]=t&255|ob,t/=128;for(;t&d4;)e[r++]=t&255|ob,t>>>=7;return e[r]=t|0,Tv.bytes=r-n+1,e}var f4=Hf,
h4=128,ab=127;function Hf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Hf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&ab)<<s:(o&ab)*Math.pow(2,s),s+=7}while(o>=h4);return Hf.bytes=i-n,r}var p4=Math.pow(
2,7),m4=Math.pow(2,14),g4=Math.pow(2,21),b4=Math.pow(2,28),y4=Math.pow(2,35),w4=Math.pow(2,42),v4=Math.pow(2,49),E4=Math.
pow(2,56),k4=Math.pow(2,63),x4=function(t){return t<p4?1:t<m4?2:t<g4?3:t<b4?4:t<y4?5:t<w4?6:t<v4?7:t<E4?8:t<k4?9:10},S4={
encode:l4,decode:f4,encodingLength:x4},kl=S4;function Vf(t,e=0){const r=kl.decode(t,e),n=kl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function xl(t,e,r=0){return kl.encode(t,e,r),e}function Sl(t){return kl.encodingLength(t)}function A4(t,e){const r=e.
byteLength,n=Sl(t),s=n+Sl(r),i=new Uint8Array(s+r);return xl(t,i,0),xl(r,i,n),i.set(e,s),new Ip(t,r,e,i)}function Rv(t){
const e=Ap(t),[r,n]=Vf(e),[s,i]=Vf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Ip(r,s,o,e)}function I4(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&Y3(t.bytes,r.bytes)}}let Ip=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ta(n),this.bytes=Ta(s)}};function cb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return C4(r,Kf(t),e??_s.encoder);default:
return T4(r,Kf(t),e??Oc.encoder)}}const lb=new WeakMap;function Kf(t){const e=lb.get(t);if(e==null){const r=new Map;return lb.
set(t,r),r}return e}let ci=class fr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ta(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
ko)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==R4)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return fr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=A4(e,
r);return fr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return fr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&I4(e.multihash,n.multihash)}toString(e){return cb(this,e)}toJSON(){return{"/":cb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof fr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new fr(n,s,i,o??db(n,s,i.bytes))}else if(r[M4]===!0){const{version:n,
multihash:s,code:i}=r,o=Rv(s);return fr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==ko)throw new Error(`Version 0 CID must use dag-pb (code: ${ko}) block encoding`);return new fr(e,r,n,n.bytes)}case 1:{
const s=db(e,r,n.bytes);return new fr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return fr.
create(0,ko,e)}static createV1(e,r){return fr.create(1,e,r)}static decode(e){const[r,n]=fr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=fr.inspectBytes(e),n=r.size-r.multihashSize,
s=Ap(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new Ip(r.multihashCode,r.digestSize,i,s);return[r.version===0?fr.createV0(o):fr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Vf(e.subarray(r));return r+=h,f};let s=n(),
i=ko;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=_4(e,r),
i=fr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Kf(
i).set(n,e),i}};function _4(t,e){switch(t[0]){case"Q":{const r=e??_s;return[_s.prefix,r.decode(`${_s.prefix}${t}`)]}case _s.
prefix:{const r=e??_s;return[_s.prefix,r.decode(t)]}case Oc.prefix:{const r=e??Oc;return[Oc.prefix,r.decode(t)]}case wu.
prefix:{const r=e??wu;return[wu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function C4(t,e,r){const{prefix:n}=r;if(n!==
_s.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function T4(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const ko=112,R4=18;function db(t,e,r){const n=Sl(t),s=n+Sl(e),i=new Uint8Array(s+r.
byteLength);return xl(t,i,0),xl(e,i,n),i.set(r,s),i}const M4=Symbol.for("@ipld/js-cid/CID");class Ra extends Error{static name="\
BadPathError";static code="ERR_BAD_PATH";name=Ra.name;code=Ra.code;constructor(e="Bad path"){super(e)}}let pi=class Qf extends Error{static name="\
NotFoundError";static code="ERR_NOT_FOUND";name=Qf.name;code=Qf.code;constructor(e="Not found"){super(e)}};class Ma extends Error{static name="\
NoResolverError";static code="ERR_NO_RESOLVER";name=Ma.name;code=Ma.code;constructor(e="No resolver"){super(e)}}class Gt extends Error{static name="\
NotUnixFSError";static code="ERR_NOT_UNIXFS";name=Gt.name;code=Gt.code;constructor(e="Not UnixFS"){super(e)}}class Al extends Error{static name="\
OverReadError";static code="ERR_OVER_READ";name=Al.name;code=Al.code;constructor(e="Over read"){super(e)}}class Il extends Error{static name="\
UnderReadError";static code="ERR_UNDER_READ";name=Il.name;code=Il.code;constructor(e="Under read"){super(e)}}let Ho=class Jf extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Jf.name;code=Jf.code;constructor(e="Invalid parameters"){super(
e)}};const B4=["Object","Uint8Array","RegExp","Date","Error","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayB\
uffer","DataView","Promise","URL","HTMLElement","Int8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array",
"Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Tagged"];function Mv(t){if(t===null)return"\
null";if(t===void 0)return"undefined";if(t===!0||t===!1)return"boolean";const e=typeof t;if(e==="string"||e==="number"||
e==="bigint"||e==="symbol")return e;if(e==="function")return"Function";if(Array.isArray(t))return"Array";if(t instanceof
Uint8Array)return"Uint8Array";if(t.constructor===Object)return"Object";const r=L4(t);return r||"Object"}function L4(t){const e=Object.
prototype.toString.call(t).slice(8,-1);if(B4.includes(e))return e}class ${constructor(e,r,n){this.major=e,this.majorEncoded=
e<<5,this.name=r,this.terminal=n}toString(){return`Type[${this.major}].${this.name}`}compare(e){return this.major<e.major?
-1:this.major>e.major?1:0}static equals(e,r){return e===r||e.major===r.major&&e.name===r.name}}$.uint=new $(0,"uint",!0);
$.negint=new $(1,"negint",!0);$.bytes=new $(2,"bytes",!0);$.string=new $(3,"string",!0);$.array=new $(4,"array",!1);$.map=
new $(5,"map",!1);$.tag=new $(6,"tag",!1);$.float=new $(7,"float",!0);$.false=new $(7,"false",!0);$.true=new $(7,"true",
!0);$.null=new $(7,"null",!0);$.undefined=new $(7,"undefined",!0);$.break=new $(7,"break",!0);class oe{constructor(e,r,n){
this.type=e,this.value=r,this.encodedLength=n,this.encodedBytes=void 0,this.byteValue=void 0}toString(){return`Token[${this.
type}].${this.value}`}}const Va=globalThis.process&&!globalThis.process.browser&&globalThis.Buffer&&typeof globalThis.Buffer.
isBuffer=="function",D4=new TextEncoder;function _l(t){return Va&&globalThis.Buffer.isBuffer(t)}function kd(t){return t instanceof
Uint8Array?_l(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t:Uint8Array.from(t)}const $4=24,N4=200,_p=Va?t=>t.length>=
$4?globalThis.Buffer.from(t):fb(t):t=>t.length>=N4?D4.encode(t):fb(t),Fn=t=>Uint8Array.from(t),P4=Va?(t,e,r)=>_l(t)?new Uint8Array(
t.subarray(e,r)):t.slice(e,r):(t,e,r)=>t.slice(e,r),O4=Va?(t,e)=>(t=t.map(r=>r instanceof Uint8Array?r:globalThis.Buffer.
from(r)),kd(globalThis.Buffer.concat(t,e))):(t,e)=>{const r=new Uint8Array(e);let n=0;for(let s of t)n+s.length>r.length&&
(s=s.subarray(0,r.length-n)),r.set(s,n),n+=s.length;return r},ub=Va?t=>globalThis.Buffer.allocUnsafe(t):t=>new Uint8Array(
t);function Bv(t,e){if(_l(t)&&_l(e))return t.compare(e);for(let r=0;r<t.length;r++)if(t[r]!==e[r])return t[r]<e[r]?-1:1;
return 0}function fb(t){const e=[];let r=0;for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);s<128?e[r++]=s:s<2048?(e[r++]=
s>>6|192,e[r++]=s&63|128):(s&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.
charCodeAt(++n)&1023),e[r++]=s>>18|240,e[r++]=s>>12&63|128,e[r++]=s>>6&63|128,e[r++]=s&63|128):(s>=55296&&s<=57343&&(s=65533),
e[r++]=s>>12|224,e[r++]=s>>6&63|128,e[r++]=s&63|128)}return e}const hb=4096;function U4(t){const e=t.length;if(e<=hb)return String.
fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=hb));return r}const F4=256;
class Cl{constructor(e=F4){this.chunkSize=e,this.cursor=0,this.maxCursor=-1,this.chunks=[],this._initReuseChunk=null}reset(){
this.cursor=0,this.maxCursor=-1,this.chunks.length&&(this.chunks=[]),this._initReuseChunk!==null&&(this.chunks.push(this.
_initReuseChunk),this.maxCursor=this._initReuseChunk.length-1)}pushByte(e){let r=this.chunks[this.chunks.length-1];this.
cursor>this.maxCursor&&(r=ub(this.chunkSize),this.chunks.push(r),this.maxCursor+=r.length,this._initReuseChunk===null&&(this.
_initReuseChunk=r));const n=r.length-(this.maxCursor-this.cursor)-1;r[n]=e,this.cursor++}push(e){let r=this.chunks[this.
chunks.length-1];if(this.cursor+e.length<=this.maxCursor+1){const s=r.length-(this.maxCursor-this.cursor)-1;r.set(e,s)}else{
if(r){const s=r.length-(this.maxCursor-this.cursor)-1;s<r.length&&(this.chunks[this.chunks.length-1]=r.subarray(0,s),this.
maxCursor=this.cursor-1)}e.length<64&&e.length<this.chunkSize?(r=ub(this.chunkSize),this.chunks.push(r),this.maxCursor+=
r.length,this._initReuseChunk===null&&(this._initReuseChunk=r),r.set(e,0)):(this.chunks.push(e),this.maxCursor+=e.length)}
this.cursor+=e.length}toBytes(e=!1){let r;if(this.chunks.length===1){const n=this.chunks[0];e&&this.cursor>n.length/2?(r=
this.cursor===n.length?n:n.subarray(0,this.cursor),this._initReuseChunk=null,this.chunks=[]):r=P4(n,0,this.cursor)}else r=
O4(this.chunks,this.cursor);return e&&this.reset(),r}}class z4{constructor(e){this.dest=e,this.cursor=0,this.chunks=[e]}reset(){
this.cursor=0}pushByte(e){if(this.cursor>=this.dest.length)throw new Error("write out of bounds, destination buffer is t\
oo small");this.dest[this.cursor++]=e}push(e){if(this.cursor+e.length>this.dest.length)throw new Error("write out of bou\
nds, destination buffer is too small");this.dest.set(e,this.cursor),this.cursor+=e.length}toBytes(e=!1){const r=this.dest.
subarray(0,this.cursor);return e&&this.reset(),r}}const le="CBOR decode error:",Ui="CBOR encode error:";function co(t,e,r){
if(t.length-e<r)throw new Error(`${le} not enough data for type`)}const Jt=[24,256,65536,4294967296,BigInt("184467440737\
09551616")];function mi(t,e,r){co(t,e,1);const n=t[e];if(r.strict===!0&&n<Jt[0])throw new Error(`${le} integer encoded i\
n more bytes than necessary (strict decode)`);return n}function gi(t,e,r){co(t,e,2);const n=t[e]<<8|t[e+1];if(r.strict===
!0&&n<Jt[1])throw new Error(`${le} integer encoded in more bytes than necessary (strict decode)`);return n}function bi(t,e,r){
co(t,e,4);const n=t[e]*16777216+(t[e+1]<<16)+(t[e+2]<<8)+t[e+3];if(r.strict===!0&&n<Jt[2])throw new Error(`${le} integer\
 encoded in more bytes than necessary (strict decode)`);return n}function yi(t,e,r){co(t,e,8);const n=t[e]*16777216+(t[e+
1]<<16)+(t[e+2]<<8)+t[e+3],s=t[e+4]*16777216+(t[e+5]<<16)+(t[e+6]<<8)+t[e+7],i=(BigInt(n)<<BigInt(32))+BigInt(s);if(r.strict===
!0&&i<Jt[3])throw new Error(`${le} integer encoded in more bytes than necessary (strict decode)`);if(i<=Number.MAX_SAFE_INTEGER)
return Number(i);if(r.allowBigInt===!0)return i;throw new Error(`${le} integers outside of the safe integer range are no\
t supported`)}function q4(t,e,r,n){return new oe($.uint,mi(t,e+1,n),2)}function j4(t,e,r,n){return new oe($.uint,gi(t,e+
1,n),3)}function G4(t,e,r,n){return new oe($.uint,bi(t,e+1,n),5)}function W4(t,e,r,n){return new oe($.uint,yi(t,e+1,n),9)}
function lo(t,e){return Hr(t,0,e.value)}function Hr(t,e,r){if(r<Jt[0]){const n=Number(r);t.pushByte(e|n)}else if(r<Jt[1]){
const n=Number(r);t.push([e|24,n])}else if(r<Jt[2]){const n=Number(r);t.push([e|25,n>>>8,n&255])}else if(r<Jt[3]){const n=Number(
r);t.push([e|26,n>>>24&255,n>>>16&255,n>>>8&255,n&255])}else{const n=BigInt(r);if(n<Jt[4]){const s=[e|27,0,0,0,0,0,0,0];
let i=Number(n&BigInt(4294967295)),o=Number(n>>BigInt(32)&BigInt(4294967295));s[8]=i&255,i=i>>8,s[7]=i&255,i=i>>8,s[6]=i&
255,i=i>>8,s[5]=i&255,s[4]=o&255,o=o>>8,s[3]=o&255,o=o>>8,s[2]=o&255,o=o>>8,s[1]=o&255,t.push(s)}else throw new Error(`${le}\
 encountered BigInt larger than allowable range`)}}lo.encodedSize=function(e){return Hr.encodedSize(e.value)};Hr.encodedSize=
function(e){return e<Jt[0]?1:e<Jt[1]?2:e<Jt[2]?3:e<Jt[3]?5:9};lo.compareTokens=function(e,r){return e.value<r.value?-1:e.
value>r.value?1:0};function H4(t,e,r,n){return new oe($.negint,-1-mi(t,e+1,n),2)}function V4(t,e,r,n){return new oe($.negint,
-1-gi(t,e+1,n),3)}function K4(t,e,r,n){return new oe($.negint,-1-bi(t,e+1,n),5)}const Cp=BigInt(-1),Lv=BigInt(1);function Q4(t,e,r,n){
const s=yi(t,e+1,n);if(typeof s!="bigint"){const i=-1-s;if(i>=Number.MIN_SAFE_INTEGER)return new oe($.negint,i,9)}if(n.allowBigInt!==
!0)throw new Error(`${le} integers outside of the safe integer range are not supported`);return new oe($.negint,Cp-BigInt(
s),9)}function Tp(t,e){const r=e.value,n=typeof r=="bigint"?r*Cp-Lv:r*-1-1;Hr(t,e.type.majorEncoded,n)}Tp.encodedSize=function(e){
const r=e.value,n=typeof r=="bigint"?r*Cp-Lv:r*-1-1;return n<Jt[0]?1:n<Jt[1]?2:n<Jt[2]?3:n<Jt[3]?5:9};Tp.compareTokens=function(e,r){
return e.value<r.value?1:e.value>r.value?-1:0};function Ka(t,e,r,n){co(t,e,r+n);const s=t.slice(e+r,e+r+n);return new oe(
$.bytes,s,r+n)}function J4(t,e,r,n){return Ka(t,e,1,r)}function Y4(t,e,r,n){return Ka(t,e,2,mi(t,e+1,n))}function X4(t,e,r,n){
return Ka(t,e,3,gi(t,e+1,n))}function Z4(t,e,r,n){return Ka(t,e,5,bi(t,e+1,n))}function e5(t,e,r,n){const s=yi(t,e+1,n);
if(typeof s=="bigint")throw new Error(`${le} 64-bit integer bytes lengths not supported`);return Ka(t,e,9,s)}function Tl(t){
return t.encodedBytes===void 0&&(t.encodedBytes=$.equals(t.type,$.string)?_p(t.value):t.value),t.encodedBytes}function xd(t,e){
const r=Tl(e);Hr(t,e.type.majorEncoded,r.length),t.push(r)}xd.encodedSize=function(e){const r=Tl(e);return Hr.encodedSize(
r.length)+r.length};xd.compareTokens=function(e,r){return t5(Tl(e),Tl(r))};function t5(t,e){return t.length<e.length?-1:
t.length>e.length?1:Bv(t,e)}const pb=new TextDecoder("utf-8",{ignoreBOM:!0}),r5=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),
n5=32;function s5(t,e,r,n){if(r-e<n5){let i="";for(let o=e;o<r;o++){const a=t[o];if(a&128)return n.strictUtf8===!0?mb(t,
e,r):pb.decode(t.subarray(e,r));i+=String.fromCharCode(a)}return i}return n.strictUtf8===!0?mb(t,e,r):pb.decode(t.subarray(
e,r))}function mb(t,e,r){try{return r5.decode(t.subarray(e,r))}catch{throw new Error(`${le} invalid UTF-8 in text string`)}}
function Qa(t,e,r,n,s){const i=r+n;co(t,e,i);const o=new oe($.string,s5(t,e+r,e+i,s),i);return s.retainStringBytes===!0&&
(o.byteValue=t.slice(e+r,e+i)),o}function i5(t,e,r,n){return Qa(t,e,1,r,n)}function o5(t,e,r,n){return Qa(t,e,2,mi(t,e+1,
n),n)}function a5(t,e,r,n){return Qa(t,e,3,gi(t,e+1,n),n)}function c5(t,e,r,n){return Qa(t,e,5,bi(t,e+1,n),n)}function l5(t,e,r,n){
const s=yi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${le} 64-bit integer string lengths not supported`);return Qa(
t,e,9,s,n)}const d5=xd;function uo(t,e,r,n){return new oe($.array,n,r)}function u5(t,e,r,n){return uo(t,e,1,r)}function f5(t,e,r,n){
return uo(t,e,2,mi(t,e+1,n))}function h5(t,e,r,n){return uo(t,e,3,gi(t,e+1,n))}function p5(t,e,r,n){return uo(t,e,5,bi(t,
e+1,n))}function m5(t,e,r,n){const s=yi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${le} 64-bit integer array lengt\
hs not supported`);return uo(t,e,9,s)}function g5(t,e,r,n){if(n.allowIndefinite===!1)throw new Error(`${le} indefinite l\
ength items not allowed`);return uo(t,e,1,1/0)}function Rp(t,e){Hr(t,$.array.majorEncoded,e.value)}Rp.compareTokens=lo.compareTokens;
Rp.encodedSize=function(e){return Hr.encodedSize(e.value)};function fo(t,e,r,n){return new oe($.map,n,r)}function b5(t,e,r,n){
return fo(t,e,1,r)}function y5(t,e,r,n){return fo(t,e,2,mi(t,e+1,n))}function w5(t,e,r,n){return fo(t,e,3,gi(t,e+1,n))}function v5(t,e,r,n){
return fo(t,e,5,bi(t,e+1,n))}function E5(t,e,r,n){const s=yi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${le} 64-bi\
t integer map lengths not supported`);return fo(t,e,9,s)}function k5(t,e,r,n){if(n.allowIndefinite===!1)throw new Error(
`${le} indefinite length items not allowed`);return fo(t,e,1,1/0)}function Mp(t,e){Hr(t,$.map.majorEncoded,e.value)}Mp.compareTokens=
lo.compareTokens;Mp.encodedSize=function(e){return Hr.encodedSize(e.value)};function x5(t,e,r,n){return new oe($.tag,r,1)}
function S5(t,e,r,n){return new oe($.tag,mi(t,e+1,n),2)}function A5(t,e,r,n){return new oe($.tag,gi(t,e+1,n),3)}function I5(t,e,r,n){
return new oe($.tag,bi(t,e+1,n),5)}function _5(t,e,r,n){return new oe($.tag,yi(t,e+1,n),9)}function Bp(t,e){Hr(t,$.tag.majorEncoded,
e.value)}Bp.compareTokens=lo.compareTokens;Bp.encodedSize=function(e){return Hr.encodedSize(e.value)};const Lp=20,Dp=21,
$p=22,Np=23;function C5(t,e,r,n){if(n.allowUndefined===!1)throw new Error(`${le} undefined values are not supported`);return n.
coerceUndefinedToNull===!0?new oe($.null,null,1):new oe($.undefined,void 0,1)}function T5(t,e,r,n){if(n.allowIndefinite===
!1)throw new Error(`${le} indefinite length items not allowed`);return new oe($.break,void 0,1)}function Pp(t,e,r){if(r){
if(r.allowNaN===!1&&Number.isNaN(t))throw new Error(`${le} NaN values are not supported`);if(r.allowInfinity===!1&&(t===
1/0||t===-1/0))throw new Error(`${le} Infinity values are not supported`)}return new oe($.float,t,e)}function R5(t,e,r,n){
return Pp(Ad(t,e+1),3,n)}function M5(t,e,r,n){return Pp(Id(t,e+1),5,n)}function B5(t,e,r,n){return Pp(Nv(t,e+1),9,n)}function Sd(t,e,r){
const n=e.value;if(n===!1)t.pushByte($.float.majorEncoded|Lp);else if(n===!0)t.pushByte($.float.majorEncoded|Dp);else if(n===
null)t.pushByte($.float.majorEncoded|$p);else if(n===void 0)t.pushByte($.float.majorEncoded|Np);else{let s,i=!1;(!r||r.float64!==
!0)&&(Op(n),s=Ad(Lt,1),n===s||Number.isNaN(n)?(Lt[0]=249,t.push(Lt.slice(0,3)),i=!0):(Up(n),s=Id(Lt,1),n===s&&(Lt[0]=250,
t.push(Lt.slice(0,5)),i=!0))),i||($v(n),s=Nv(Lt,1),Lt[0]=251,t.push(Lt.slice(0,9)))}}Sd.encodedSize=function(e,r){const n=e.
value;if(n===!1||n===!0||n===null||n===void 0)return 1;if(!r||r.float64!==!0){Op(n);let s=Ad(Lt,1);if(n===s||Number.isNaN(
n))return 3;if(Up(n),s=Id(Lt,1),n===s)return 5}return 9};const Dv=new ArrayBuffer(9),en=new DataView(Dv,1),Lt=new Uint8Array(
Dv,0);function Op(t){if(t===1/0)en.setUint16(0,31744,!1);else if(t===-1/0)en.setUint16(0,64512,!1);else if(Number.isNaN(
t))en.setUint16(0,32256,!1);else{en.setFloat32(0,t);const e=en.getUint32(0),r=(e&2139095040)>>23,n=e&8388607;if(r===255)
en.setUint16(0,31744,!1);else if(r===0)en.setUint16(0,(e&2147483648)>>16|n>>13,!1);else{const s=r-127;s<-24?en.setUint16(
0,0):s<-14?en.setUint16(0,(e&2147483648)>>16|1<<24+s,!1):en.setUint16(0,(e&2147483648)>>16|s+15<<10|n>>13,!1)}}}function Ad(t,e){
if(t.length-e<2)throw new Error(`${le} not enough data for float16`);const r=(t[e]<<8)+t[e+1];if(r===31744)return 1/0;if(r===
64512)return-1/0;if(r===32256)return NaN;const n=r>>10&31,s=r&1023;let i;return n===0?i=s*2**-24:n!==31?i=(s+1024)*2**(n-
25):i=s===0?1/0:NaN,r&32768?-i:i}function Up(t){en.setFloat32(0,t,!1)}function Id(t,e){if(t.length-e<4)throw new Error(`${le}\
 not enough data for float32`);const r=(t.byteOffset||0)+e;return new DataView(t.buffer,r,4).getFloat32(0,!1)}function $v(t){
en.setFloat64(0,t,!1)}function Nv(t,e){if(t.length-e<8)throw new Error(`${le} not enough data for float64`);const r=(t.byteOffset||
0)+e;return new DataView(t.buffer,r,8).getFloat64(0,!1)}function L5(t,e){const r=t.value;if(r===!1)return Uint8Array.of(
$.float.majorEncoded|Lp);if(r===!0)return Uint8Array.of($.float.majorEncoded|Dp);if(r===null)return Uint8Array.of($.float.
majorEncoded|$p);if(r===void 0)return Uint8Array.of($.float.majorEncoded|Np);if(!e){if(Op(r),r===Ad(Lt,1)||Number.isNaN(
r))return Lt[0]=249,Lt.slice(0,3);if(Up(r),r===Id(Lt,1))return Lt[0]=250,Lt.slice(0,5)}return $v(r),Lt[0]=251,Lt.slice(0,
9)}function gb(t,e){const r=t,n=e?.float64===!0,s=n?r._keyBytesFloat64:r._keyBytes;if(s!==void 0)return s;const i=L5(t,n);
return n?r._keyBytesFloat64=i:r._keyBytes=i,i}Sd.compareTokens=function(e,r,n){const s=gb(e,n),i=gb(r,n);return s.length!==
i.length?s.length<i.length?-1:1:Bv(s,i)};function Ve(t,e,r){throw new Error(`${le} encountered invalid minor (${r}) for \
major ${t[e]>>>5}`)}function _d(t){return()=>{throw new Error(`${le} ${t}`)}}const ne=[];for(let t=0;t<=23;t++)ne[t]=Ve;
ne[24]=q4;ne[25]=j4;ne[26]=G4;ne[27]=W4;ne[28]=Ve;ne[29]=Ve;ne[30]=Ve;ne[31]=Ve;for(let t=32;t<=55;t++)ne[t]=Ve;ne[56]=H4;
ne[57]=V4;ne[58]=K4;ne[59]=Q4;ne[60]=Ve;ne[61]=Ve;ne[62]=Ve;ne[63]=Ve;for(let t=64;t<=87;t++)ne[t]=J4;ne[88]=Y4;ne[89]=X4;
ne[90]=Z4;ne[91]=e5;ne[92]=Ve;ne[93]=Ve;ne[94]=Ve;ne[95]=_d("indefinite length bytes/strings are not supported");for(let t=96;t<=
119;t++)ne[t]=i5;ne[120]=o5;ne[121]=a5;ne[122]=c5;ne[123]=l5;ne[124]=Ve;ne[125]=Ve;ne[126]=Ve;ne[127]=_d("indefinite len\
gth bytes/strings are not supported");for(let t=128;t<=151;t++)ne[t]=u5;ne[152]=f5;ne[153]=h5;ne[154]=p5;ne[155]=m5;ne[156]=
Ve;ne[157]=Ve;ne[158]=Ve;ne[159]=g5;for(let t=160;t<=183;t++)ne[t]=b5;ne[184]=y5;ne[185]=w5;ne[186]=v5;ne[187]=E5;ne[188]=
Ve;ne[189]=Ve;ne[190]=Ve;ne[191]=k5;for(let t=192;t<=215;t++)ne[t]=x5;ne[216]=S5;ne[217]=A5;ne[218]=I5;ne[219]=_5;ne[220]=
Ve;ne[221]=Ve;ne[222]=Ve;ne[223]=Ve;for(let t=224;t<=243;t++)ne[t]=_d("simple values are not supported");ne[244]=Ve;ne[245]=
Ve;ne[246]=Ve;ne[247]=C5;ne[248]=_d("simple values are not supported");ne[249]=R5;ne[250]=M5;ne[251]=B5;ne[252]=Ve;ne[253]=
Ve;ne[254]=Ve;ne[255]=T5;const On=[];for(let t=0;t<24;t++)On[t]=new oe($.uint,t,1);for(let t=-1;t>=-24;t--)On[31-t]=new oe(
$.negint,t,1);On[64]=new oe($.bytes,new Uint8Array(0),1);On[96]=new oe($.string,"",1);On[128]=new oe($.array,0,1);On[160]=
new oe($.map,0,1);On[244]=new oe($.false,!1,1);On[245]=new oe($.true,!0,1);On[246]=new oe($.null,null,1);function D5(t){
switch(t.type){case $.false:return Fn([244]);case $.true:return Fn([245]);case $.null:return Fn([246]);case $.bytes:return t.
value.length?void 0:Fn([64]);case $.string:return t.value===""?Fn([96]):void 0;case $.array:return t.value===0?Fn([128]):
void 0;case $.map:return t.value===0?Fn([160]):void 0;case $.uint:return t.value<24?Fn([Number(t.value)]):void 0;case $.
negint:if(t.value>=-24)return Fn([31-Number(t.value)])}}const $5={float64:!1,mapSorter:Fp,quickEncodeToken:D5};function N5(){
const t=[];return t[$.uint.major]=lo,t[$.negint.major]=Tp,t[$.bytes.major]=xd,t[$.string.major]=d5,t[$.array.major]=Rp,t[$.
map.major]=Mp,t[$.tag.major]=Bp,t[$.float.major]=Sd,t}const Fi=N5(),Uc=new Cl;let Fc=!1;class Yi{constructor(e,r){this.obj=
e,this.parent=r}includes(e){let r=this;do if(r.obj===e)return!0;while(r=r.parent);return!1}static createCheck(e,r){if(e&&
e.includes(r))throw new Error(`${Ui} object contains circular references`);return new Yi(r,e)}}const ps={null:new oe($.null,
null),undefined:new oe($.undefined,void 0),true:new oe($.true,!0),false:new oe($.false,!1),emptyArray:new oe($.array,0),
emptyMap:new oe($.map,0)},Pn={number(t,e,r,n){return!Number.isInteger(t)||!Number.isSafeInteger(t)?new oe($.float,t):t>=
0?new oe($.uint,t):new oe($.negint,t)},bigint(t,e,r,n){return t>=BigInt(0)?new oe($.uint,t):new oe($.negint,t)},Uint8Array(t,e,r,n){
return new oe($.bytes,t)},string(t,e,r,n){return new oe($.string,t)},boolean(t,e,r,n){return t?ps.true:ps.false},null(t,e,r,n){
return ps.null},undefined(t,e,r,n){return ps.undefined},ArrayBuffer(t,e,r,n){return new oe($.bytes,new Uint8Array(t))},DataView(t,e,r,n){
return new oe($.bytes,new Uint8Array(t.buffer,t.byteOffset,t.byteLength))},Array(t,e,r,n){if(!t.length)return r.addBreakTokens===
!0?[ps.emptyArray,new oe($.break)]:ps.emptyArray;n=Yi.createCheck(n,t);const s=[];let i=0;for(const o of t)s[i++]=Mi(o,r,
n);return r.addBreakTokens?[new oe($.array,t.length),s,new oe($.break)]:[new oe($.array,t.length),s]},Object(t,e,r,n){const s=e!==
"Object",i=s?t.keys():Object.keys(t),o=s?t.size:i.length;let a;if(o){a=new Array(o),n=Yi.createCheck(n,t);const c=!s&&r.
ignoreUndefinedProperties;let l=0;for(const d of i){const f=s?t.get(d):t[d];c&&f===void 0||(a[l++]=[Mi(d,r,n),Mi(f,r,n)])}
l<o&&(a.length=l)}return a?.length?(P5(a,r),r.addBreakTokens?[new oe($.map,a.length),a,new oe($.break)]:[new oe($.map,a.
length),a]):r.addBreakTokens===!0?[ps.emptyMap,new oe($.break)]:ps.emptyMap},Tagged(t,e,r,n){return[new oe($.tag,t.tag),
Mi(t.value,r,n)]}};Pn.Map=Pn.Object;Pn.Buffer=Pn.Uint8Array;for(const t of"Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 B\
igUint64 BigInt64 Float32 Float64".split(" "))Pn[`${t}Array`]=Pn.DataView;function Mi(t,e={},r){const n=Mv(t),s=e&&e.typeEncoders&&
e.typeEncoders[n]||Pn[n];if(typeof s=="function"){const o=s(t,n,e,r);if(o!=null)return o}const i=Pn[n];if(!i)throw new Error(
`${Ui} unsupported type: ${n}`);return i(t,n,e,r)}function P5(t,e){const r=e.mapSorter;r&&t.sort((n,s)=>r(n,s,e))}function Fp(t,e,r){
const n=Array.isArray(t[0])?t[0][0]:t[0],s=Array.isArray(e[0])?e[0][0]:e[0];if(n.type.major!==s.type.major)return n.type.
compare(s.type);const i=n.type.major,o=Fi[i].compareTokens(n,s,r);return o===0&&console.warn("WARNING: complex key types\
 used, CBOR key sorting guarantees are gone"),o}function zi(t,e,r,n){if(Array.isArray(e))for(const s of e)zi(t,s,r,n);else
r[e.type.major](t,e,n)}const bb=$.uint.majorEncoded,yb=$.negint.majorEncoded,O5=$.bytes.majorEncoded,U5=$.string.majorEncoded,
wb=$.array.majorEncoded,vu=$.map.majorEncoded,F5=$.float.majorEncoded|Lp,z5=$.float.majorEncoded|Dp,q5=$.float.majorEncoded|
$p,j5=$.float.majorEncoded|Np,G5=BigInt(-1),W5=BigInt(1);function xs(t,e,r){r<24?t.pushByte(e|Number(r)):Hr(t,e,r)}function H5(t){
return t.addBreakTokens!==!0}function V5(t,e,r,n,s){const i=r==="Map",o=i?e.keys():Object.keys(e),a=i?e.size:o.length;if(!a){
t.pushByte(vu);return}s=Yi.createCheck(s,e);const c=!i&&n.ignoreUndefinedProperties,l=new Array(a);let d=0;for(const f of o){
const h=i?e.get(f):e[f];c&&h===void 0||(l[d++]=[Mi(f,n,s),h])}if(d===0){t.pushByte(vu);return}d<a&&(l.length=d),l.sort((f,h)=>Fp(
f,h,n)),xs(t,vu,d);for(const[f,h]of l)zi(t,f,Fi,n),Rl(t,h,n,s)}function Rl(t,e,r,n){const s=Mv(e),i=r.typeEncoders&&r.typeEncoders[s];
if(i){const o=i(e,s,r,n);if(o!=null){zi(t,o,Fi,r);return}}switch(s){case"null":t.pushByte(q5);return;case"undefined":t.pushByte(
j5);return;case"boolean":t.pushByte(e?z5:F5);return;case"number":!Number.isInteger(e)||!Number.isSafeInteger(e)?Sd(t,new oe(
$.float,e),r):e>=0?xs(t,bb,e):xs(t,yb,e*-1-1);return;case"bigint":e>=BigInt(0)?xs(t,bb,e):xs(t,yb,e*G5-W5);return;case"s\
tring":{const o=_p(e);xs(t,U5,o.length),t.push(o);return}case"Uint8Array":xs(t,O5,e.length),t.push(e);return;case"Array":
if(!e.length){t.pushByte(wb);return}n=Yi.createCheck(n,e),xs(t,wb,e.length);for(const o of e)Rl(t,o,r,n);return;case"Obj\
ect":case"Map":if(r.mapSorter===Fp)V5(t,e,s,r,n);else{const o=Pn.Object(e,s,r,n);zi(t,o,Fi,r)}return;default:{const o=Pn[s];
if(!o)throw new Error(`${Ui} unsupported type: ${s}`);const a=o(e,s,r,n);zi(t,a,Fi,r)}}}function K5(t,e,r,n){const s=n instanceof
Uint8Array;let i=s?new z4(n):Fc?new Cl:Uc;const o=Mi(t,r);if(!Array.isArray(o)&&r.quickEncodeToken){const a=r.quickEncodeToken(
o);if(a)return s?(i.push(a),i.toBytes()):a;const c=e[o.type.major];if(c.encodedSize){const l=c.encodedSize(o,r);if(s||(i=
new Cl(l)),c(i,o,r),i.chunks.length!==1)throw new Error(`Unexpected error: pre-calculated length for ${o} was wrong`);return s?
i.toBytes():kd(i.chunks[0])}}return i.reset(),zi(i,o,e,r),i.toBytes(!0)}function BO(t,e){if(e=Object.assign({},$5,e),H5(
e)){if(Fc){const r=new Cl;return Rl(r,t,e,void 0),r.toBytes()}Fc=!0;try{return Uc.reset(),Rl(Uc,t,e,void 0),Uc.toBytes(!0)}finally{
Fc=!1}}return K5(t,Fi,e)}const Q5={strict:!1,allowIndefinite:!0,allowUndefined:!0,allowBigInt:!0};class J5{constructor(e,r={}){
this._pos=0,this.data=e,this.options=r}pos(){return this._pos}done(){return this._pos>=this.data.length}next(){const e=this.
data[this._pos];let r=On[e];if(r===void 0){const n=ne[e];if(!n)throw e===void 0?new Error(`${le} not enough data`):new Error(
`${le} no decoder for major type ${e>>>5} (byte 0x${e.toString(16).padStart(2,"0")})`);const s=e&31;r=n(this.data,this._pos,
s,this.options)}return this._pos+=r.encodedLength,r}}const qs=Symbol.for("DONE"),js=Symbol.for("BREAK");function Y5(t,e,r){
const n=[];for(let s=0;s<t.value;s++){const i=li(e,r);if(i===js){if(t.value===1/0)break;throw new Error(`${le} got unexp\
ected break to lengthed array`)}if(i===qs)throw new Error(`${le} found array but not enough entries (got ${s}, expected ${t.
value})`);n[s]=i}return n}function X5(t,e,r){const n=r.useMaps===!0,s=r.rejectDuplicateMapKeys===!0,i=n?void 0:{},o=n?new Map:
void 0;for(let a=0;a<t.value;a++){const c=li(e,r);if(c===js){if(t.value===1/0)break;throw new Error(`${le} got unexpecte\
d break to lengthed map`)}if(c===qs)throw new Error(`${le} found map but not enough entries (got ${a} [no key], expected\
 ${t.value})`);if(!n&&typeof c!="string")throw new Error(`${le} non-string keys not supported (got ${typeof c})`);if(s&&
(n&&o.has(c)||!n&&Object.hasOwn(i,c)))throw new Error(`${le} found repeat map key "${c}"`);const l=li(e,r);if(l===qs)throw new Error(
`${le} found map but not enough entries (got ${a} [no value], expected ${t.value})`);if(l===js)throw new Error(`${le} go\
t unexpected break to map value`);n?o.set(c,l):c==="__proto__"?Object.defineProperty(i,c,{value:l,configurable:!0,enumerable:!0,
writable:!0}):i[c]=l}return n?o:i}function*Z5(t,e,r){for(let n=0;n<t.value;n++){const s=li(e,r);if(s===js){if(t.value===
1/0)break;throw new Error(`${le} got unexpected break to lengthed map`)}if(s===qs)throw new Error(`${le} found map but n\
ot enough entries (got ${n} [no key], expected ${t.value})`);const i=li(e,r);if(i===qs)throw new Error(`${le} found map \
but not enough entries (got ${n} [no value], expected ${t.value})`);if(i===js)throw new Error(`${le} got unexpected brea\
k to map value`);yield[s,i]}}function eT(t,e){const r=function(){if(r._called)throw new Error(`${le} tag decode() may on\
ly be called once`);r._called=!0;const n=li(t,e);if(n===qs)throw new Error(`${le} tag content missing`);if(n===js)throw new Error(
`${le} got unexpected break in tag content`);return n};return r.entries=function(){if(r._called)throw new Error(`${le} t\
ag decode() may only be called once`);if(r._called=!0,t.done())throw new Error(`${le} tag content missing`);const n=t.next();
if(!$.equals(n.type,$.map))throw new Error(`${le} entries() requires map content, got ${n.type.name}`);const s=[];for(const i of Z5(
n,t,e))s.push(i);return s},r._called=!1,r}function li(t,e){if(t.done())return qs;const r=t.next();if($.equals(r.type,$.break))
return js;if(r.type.terminal)return r.value;if($.equals(r.type,$.array))return Y5(r,t,e);if($.equals(r.type,$.map))return X5(
r,t,e);if($.equals(r.type,$.tag)){if(e.tags&&typeof e.tags[r.value]=="function"){const n=eT(t,e),s=e.tags[r.value](n);if(!n.
_called)throw new Error(`${le} tag decoder must call decode() or entries()`);return s}throw new Error(`${le} tag not sup\
ported (${r.value})`)}throw new Error("unsupported")}function tT(t,e){if(!(t instanceof Uint8Array))throw new Error(`${le}\
 data to decode must be a Uint8Array`);e=Object.assign({},Q5,e);const r=kd(t),n=e.tokenizer||new J5(r,e),s=li(n,e);if(s===
qs)throw new Error(`${le} did not find any content to decode`);if(s===js)throw new Error(`${le} got unexpected break`);return[
s,t.subarray(n.pos())]}function Pv(t,e){const[r,n]=tT(t,e);if(n.length>0)throw new Error(`${le} too many terminals, data\
 makes no sense`);return r}function rT(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)
if(t[r]!==e[r])return!1;return!0}function zp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Ba(
t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Ba(new Uint8Array(t.buffer,t.byteOffset,
t.byteLength));throw new Error("Unknown type, must be binary type")}function nT(t){return t?.buffer instanceof ArrayBuffer}
function Ba(t){return nT(t)?t:t.slice()}function sT(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof
Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.
from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,
k=0,A=u.length;k!==A&&u[k]===0;)k++,y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-
E;T!==S&&v[T]===0;)T++;for(var P=f.repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError(
"Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.
length-y)*h+1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){
for(var C=A-k;C!==A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(
u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var iT=sT,oT=iT;let aT=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},cT=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Ov(this,e)}},
lT=class{decoders;constructor(e){this.decoders=e}or(e){return Ov(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Ov(t,e){return new lT({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let dT=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new aT(e,r,n),this.decoder=new cT(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Uv({name:t,prefix:e,encode:r,decode:n}){return new dT(t,e,r,
n)}function Cd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=oT(r,t,n);return Uv({prefix:e,
name:t,encode:s,decode:o=>zp(i(o))})}function uT(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function fT(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function hT(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function os({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=hT(n,s);return Uv(
{prefix:e,name:t,encode(o){return fT(o,n,r)},decode(o){return uT(o,i,r,t)}})}const zc=os({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});os({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});os({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});os({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});os({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});os({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});os({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});os({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});os({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Eu=Cd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Cd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Cs=Cd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Cd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var pT=Fv,vb=128,mT=-128,gT=Math.pow(2,31);function Fv(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=gT;)e[r++]=t&255|vb,t/=128;for(;t&mT;)e[r++]=t&255|vb,t>>>=7;return e[r]=t|0,Fv.bytes=r-n+1,e}var bT=Yf,
yT=128,Eb=127;function Yf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Yf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&Eb)<<s:(o&Eb)*Math.pow(2,s),s+=7}while(o>=yT);return Yf.bytes=i-n,r}var wT=Math.pow(
2,7),vT=Math.pow(2,14),ET=Math.pow(2,21),kT=Math.pow(2,28),xT=Math.pow(2,35),ST=Math.pow(2,42),AT=Math.pow(2,49),IT=Math.
pow(2,56),_T=Math.pow(2,63),CT=function(t){return t<wT?1:t<vT?2:t<ET?3:t<kT?4:t<xT?5:t<ST?6:t<AT?7:t<IT?8:t<_T?9:10},TT={
encode:pT,decode:bT,encodingLength:CT},Ml=TT;function Xf(t,e=0){const r=Ml.decode(t,e),n=Ml.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function Bl(t,e,r=0){return Ml.encode(t,e,r),e}function Ll(t){return Ml.encodingLength(t)}function RT(t,e){const r=e.
byteLength,n=Ll(t),s=n+Ll(r),i=new Uint8Array(s+r);return Bl(t,i,0),Bl(r,i,n),i.set(e,s),new qp(t,r,e,i)}function MT(t){
const e=zp(t),[r,n]=Xf(e),[s,i]=Xf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new qp(r,s,o,e)}function BT(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&rT(t.bytes,r.bytes)}}let qp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ba(n),this.bytes=Ba(s)}};function kb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return DT(r,Zf(t),e??Cs.encoder);default:
return $T(r,Zf(t),e??zc.encoder)}}const xb=new WeakMap;function Zf(t){const e=xb.get(t);if(e==null){const r=new Map;return xb.
set(t,r),r}return e}let zv=class hr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ba(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
xo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==NT)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return hr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=RT(e,
r);return hr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return hr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&BT(e.multihash,n.multihash)}toString(e){return kb(this,e)}toJSON(){return{"/":kb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof hr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new hr(n,s,i,o??Sb(n,s,i.bytes))}else if(r[PT]===!0){const{version:n,
multihash:s,code:i}=r,o=MT(s);return hr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==xo)throw new Error(`Version 0 CID must use dag-pb (code: ${xo}) block encoding`);return new hr(e,r,n,n.bytes)}case 1:{
const s=Sb(e,r,n.bytes);return new hr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return hr.
create(0,xo,e)}static createV1(e,r){return hr.create(1,e,r)}static decode(e){const[r,n]=hr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=hr.inspectBytes(e),n=r.size-r.multihashSize,
s=zp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new qp(r.multihashCode,r.digestSize,i,s);return[r.version===0?hr.createV0(o):hr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Xf(e.subarray(r));return r+=h,f};let s=n(),
i=xo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=LT(e,r),
i=hr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Zf(
i).set(n,e),i}};function LT(t,e){switch(t[0]){case"Q":{const r=e??Cs;return[Cs.prefix,r.decode(`${Cs.prefix}${t}`)]}case Cs.
prefix:{const r=e??Cs;return[Cs.prefix,r.decode(t)]}case zc.prefix:{const r=e??zc;return[zc.prefix,r.decode(t)]}case Eu.
prefix:{const r=e??Eu;return[Eu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function DT(t,e,r){const{prefix:n}=r;if(n!==
Cs.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function $T(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const xo=112,NT=18;function Sb(t,e,r){const n=Ll(t),s=n+Ll(e),i=new Uint8Array(s+r.
byteLength);return Bl(t,i,0),Bl(e,i,n),i.set(r,s),i}const PT=Symbol.for("@ipld/js-cid/CID"),qv=42;function OT(t){return t instanceof
ArrayBuffer?new Uint8Array(t,0,t.byteLength):t}function UT(t){if(t.asCID!==t&&t["/"]!==t.bytes)return null;const e=zv.asCID(
t);if(!e)return null;const r=new Uint8Array(e.bytes.byteLength+1);return r.set(e.bytes,1),[new oe($.tag,qv),new oe($.bytes,
r)]}function FT(){throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")}function zT(t){
if(Number.isNaN(t))throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");if(t===1/0||t===
-1/0)throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");return null}
function qT(t){for(const e of t.keys())if(typeof e!="string"||e.length===0)throw new Error("Non-string Map keys are not \
supported by the IPLD Data Model and cannot be encoded");return null}const jT={typeEncoders:{Map:qT,Object:UT,undefined:FT,
number:zT}};({...jT.typeEncoders});function GT(t){const e=t();if(e[0]!==0)throw new Error("Invalid CID for CBOR tag 42; \
expected leading 0x00");return zv.decode(e.subarray(1))}const eh={allowIndefinite:!1,coerceUndefinedToNull:!0,allowNaN:!1,
allowInfinity:!1,allowBigInt:!0,strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{[qv]:GT}};({...eh,tags:{...eh.tags}});
const jv=113,Gv=t=>Pv(OT(t),eh);class OO extends Array{constructor(){super(),this.inRecursive=[]}prefix(e){const r=this.
inRecursive[this.inRecursive.length-1];r&&($.equals(r.type,$.array)&&(r.elements++,r.elements!==1&&e.push([44])),$.equals(
r.type,$.map)&&(r.elements++,r.elements!==1&&(r.elements%2===1?e.push([44]):e.push([58]))))}[$.uint.major](e,r){this.prefix(
e);const n=String(r.value),s=[];for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);e.push(s)}[$.negint.major](e,r){this[$.uint.
major](e,r)}[$.bytes.major](e,r){throw new Error(`${Ui} unsupported type: Uint8Array`)}[$.string.major](e,r){this.prefix(
e);const n=_p(JSON.stringify(r.value));e.push(n.length>32?kd(n):n)}[$.array.major](e,r){this.prefix(e),this.inRecursive.
push({type:$.array,elements:0}),e.push([91])}[$.map.major](e,r){this.prefix(e),this.inRecursive.push({type:$.map,elements:0}),
e.push([123])}[$.tag.major](e,r){}[$.float.major](e,r){if(r.type.name==="break"){const o=this.inRecursive.pop();if(o){if($.
equals(o.type,$.array))e.push([93]);else if($.equals(o.type,$.map))e.push([125]);else throw new Error("Unexpected recurs\
ive type; this should not happen!");return}throw new Error("Unexpected break; this should not happen!")}if(r.value===void 0)
throw new Error(`${Ui} unsupported type: undefined`);if(this.prefix(e),r.type.name==="true"){e.push([116,114,117,101]);return}else if(r.
type.name==="false"){e.push([102,97,108,115,101]);return}else if(r.type.name==="null"){e.push([110,117,108,108]);return}
if(typeof r.value=="number"&&!Number.isFinite(r.value))throw new Error(`${Ui} unsupported type: ${r.value}`);const n=String(
r.value),s=[];let i=!1;for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o),!i&&(s[o]===46||s[o]===101||s[o]===69)&&(i=!0);i||
(s.push(46),s.push(48)),e.push(s)}}const Ab=1e3;class Wv{constructor(e,r={}){this._pos=0,this.data=e,this.options=r,this.
modeStack=["value"],this.lastToken=""}pos(){return this._pos}done(){return this._pos>=this.data.length}ch(){return this.
data[this._pos]}currentMode(){return this.modeStack[this.modeStack.length-1]}skipWhitespace(){let e=this.ch();for(;e===32||
e===9||e===13||e===10;)e=this.data[++this._pos]}expect(e){if(this.data.length-this._pos<e.length)throw new Error(`${le} \
unexpected end of input at position ${this._pos}`);for(let r=0;r<e.length;r++)if(this.data[this._pos++]!==e[r])throw new Error(
`${le} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`)}parseNumber(){const e=this.
_pos;let r=!1,n=!1;const s=a=>{for(;!this.done();){const c=this.ch();if(a.includes(c))this._pos++;else break}};if(this.ch()===
45&&(r=!0,this._pos++),this.ch()===48)if(this._pos++,this.ch()===46)this._pos++,n=!0;else return new oe($.uint,0,this._pos-
e);if(s([48,49,50,51,52,53,54,55,56,57]),r&&this._pos===e+1)throw new Error(`${le} unexpected token at position ${this._pos}`);
if(!this.done()&&this.ch()===46){if(n)throw new Error(`${le} unexpected token at position ${this._pos}`);n=!0,this._pos++,
s([48,49,50,51,52,53,54,55,56,57])}if(!this.done()&&(this.ch()===101||this.ch()===69)&&(n=!0,this._pos++,!this.done()&&(this.
ch()===43||this.ch()===45)&&this._pos++,s([48,49,50,51,52,53,54,55,56,57])),this._pos-e>Ab)throw new Error(`${le} number\
 at position ${e} exceeds ${Ab} characters`);const i=String.fromCharCode.apply(null,this.data.subarray(e,this._pos)),o=parseFloat(
i);if(n){if(this.options.allowInfinity===!1&&!Number.isFinite(o))throw new Error(`${le} Infinity values are not supporte\
d`);return new oe($.float,o,this._pos-e)}if(this.options.allowBigInt!==!0||Number.isSafeInteger(o)){if(!Number.isFinite(
o))throw new Error(`${le} integer at position ${e} is too large for a Number, use allowBigInt`);return new oe(o>=0?$.uint:
$.negint,o,this._pos-e)}return new oe(o>=0?$.uint:$.negint,BigInt(i),this._pos-e)}parseString(){if(this.ch()!==34)throw new Error(
`${le} unexpected character at position ${this._pos}; this shouldn't happen`);this._pos++;for(let i=this._pos,o=0;i<this.
data.length&&o<65536;i++,o++){const a=this.data[i];if(a===92||a<32||a>=128)break;if(a===34){const c=String.fromCharCode.
apply(null,this.data.subarray(this._pos,i));return this._pos=i+1,new oe($.string,c,o)}}const e=this._pos,r=[],n=()=>{if(this.
_pos+4>=this.data.length)throw new Error(`${le} unexpected end of unicode escape sequence at position ${this._pos}`);let i=0;
for(let o=0;o<4;o++){let a=this.ch();if(a>=48&&a<=57)a-=48;else if(a>=97&&a<=102)a=a-97+10;else if(a>=65&&a<=70)a=a-65+10;else
throw new Error(`${le} unexpected unicode escape character at position ${this._pos}`);i=i*16+a,this._pos++}return i},s=()=>{
const i=this.ch();let o=null,a=i>239?4:i>223?3:i>191?2:1;if(this._pos+a>this.data.length)throw new Error(`${le} unexpect\
ed unicode sequence at position ${this._pos}`);let c,l,d,f;switch(a){case 1:i<128&&(o=i);break;case 2:c=this.data[this._pos+
1],(c&192)===128&&(f=(i&31)<<6|c&63,f>127&&(o=f));break;case 3:c=this.data[this._pos+1],l=this.data[this._pos+2],(c&192)===
128&&(l&192)===128&&(f=(i&15)<<12|(c&63)<<6|l&63,f>2047&&(f<55296||f>57343)&&(o=f));break;case 4:c=this.data[this._pos+1],
l=this.data[this._pos+2],d=this.data[this._pos+3],(c&192)===128&&(l&192)===128&&(d&192)===128&&(f=(i&15)<<18|(c&63)<<12|
(l&63)<<6|d&63,f>65535&&f<1114112&&(o=f))}if(o===null){if(this.options.strictUtf8===!0)throw new Error(`${le} invalid UT\
F-8 in text string at position ${this._pos}`);o=65533,a=1}else o>65535&&(o-=65536,r.push(o>>>10&1023|55296),o=56320|o&1023);
r.push(o),this._pos+=a};for(;!this.done();){const i=this.ch();let o;switch(i){case 92:if(this._pos++,this.done())throw new Error(
`${le} unexpected string termination at position ${this._pos}`);switch(o=this.ch(),this._pos++,o){case 34:case 39:case 92:case 47:
r.push(o);break;case 98:r.push(8);break;case 116:r.push(9);break;case 110:r.push(10);break;case 102:r.push(12);break;case 114:
r.push(13);break;case 117:r.push(n());break;default:throw new Error(`${le} unexpected string escape character at positio\
n ${this._pos}`)}break;case 34:return this._pos++,new oe($.string,U4(r),this._pos-e);default:if(i<32)throw new Error(`${le}\
 invalid control character at position ${this._pos}`);i<128?(r.push(i),this._pos++):s()}}throw new Error(`${le} unexpect\
ed end of string at position ${this._pos}`)}parseValue(){switch(this.ch()){case 123:return this.modeStack.push("obj-star\
t"),this._pos++,new oe($.map,1/0,1);case 91:return this.modeStack.push("array-start"),this._pos++,new oe($.array,1/0,1);case 34:
return this.parseString();case 110:return this.expect([110,117,108,108]),new oe($.null,null,4);case 102:return this.expect(
[102,97,108,115,101]),new oe($.false,!1,5);case 116:return this.expect([116,114,117,101]),new oe($.true,!0,4);case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
return this.parseNumber();default:throw new Error(`${le} unexpected character at position ${this._pos}`)}}next(){switch(this.
skipWhitespace(),this.currentMode()){case"value":return this.modeStack.pop(),this.parseValue();case"array-value":{if(this.
modeStack.pop(),this.ch()===93)return this._pos++,this.skipWhitespace(),new oe($.break,void 0,1);if(this.ch()!==44)throw new Error(
`${le} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.
ch())}'`);return this._pos++,this.modeStack.push("array-value"),this.skipWhitespace(),this.parseValue()}case"array-start":
return this.modeStack.pop(),this.ch()===93?(this._pos++,this.skipWhitespace(),new oe($.break,void 0,1)):(this.modeStack.
push("array-value"),this.skipWhitespace(),this.parseValue());case"obj-key":if(this.ch()===125)return this.modeStack.pop(),
this._pos++,this.skipWhitespace(),new oe($.break,void 0,1);if(this.ch()!==44)throw new Error(`${le} unexpected character\
 at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);this._pos++,this.
skipWhitespace();case"obj-start":{if(this.modeStack.pop(),this.ch()===125)return this._pos++,this.skipWhitespace(),new oe(
$.break,void 0,1);const e=this.parseString();if(this.skipWhitespace(),this.ch()!==58)throw new Error(`${le} unexpected c\
haracter at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
return this._pos++,this.modeStack.push("obj-value"),e}case"obj-value":return this.modeStack.pop(),this.modeStack.push("o\
bj-key"),this.skipWhitespace(),this.parseValue();default:throw new Error(`${le} unexpected parse state at position ${this.
_pos}; this shouldn't happen`)}}}function WT(t,e){return e=Object.assign({tokenizer:new Wv(t,e)},e),Pv(t,e)}function HT(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
function jp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return La(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return La(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function VT(t){return t?.buffer instanceof ArrayBuffer}function La(t){return VT(t)?t:t.slice()}function KT(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?
u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,k=0,A=u.length;k!==A&&u[k]===0;)k++,
y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-E;T!==S&&v[T]===0;)T++;for(var P=f.
repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError("Expected String");
if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.length-y)*h+
1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){for(var C=A-k;C!==
A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(u);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var QT=KT,JT=QT;let YT=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},XT=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Hv(this,e)}},
ZT=class{decoders;constructor(e){this.decoders=e}or(e){return Hv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Hv(t,e){return new ZT({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let eR=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new YT(e,r,n),this.decoder=new XT(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Vv({name:t,prefix:e,encode:r,decode:n}){return new eR(t,e,r,
n)}function Td({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=JT(r,t,n);return Vv({prefix:e,
name:t,encode:s,decode:o=>jp(i(o))})}function tR(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function rR(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function nR(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Vr({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=nR(n,s);return Vv(
{prefix:e,name:t,encode(o){return rR(o,n,r)},decode(o){return tR(o,i,r,t)}})}const qc=Vr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Vr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Vr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Vr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const ku=Td(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Td({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Ts=Td({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Td({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var sR=Kv,Ib=128,iR=-128,oR=Math.pow(2,31);function Kv(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=oR;)e[r++]=t&255|Ib,t/=128;for(;t&iR;)e[r++]=t&255|Ib,t>>>=7;return e[r]=t|0,Kv.bytes=r-n+1,e}var aR=th,
cR=128,_b=127;function th(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw th.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&_b)<<s:(o&_b)*Math.pow(2,s),s+=7}while(o>=cR);return th.bytes=i-n,r}var lR=Math.pow(
2,7),dR=Math.pow(2,14),uR=Math.pow(2,21),fR=Math.pow(2,28),hR=Math.pow(2,35),pR=Math.pow(2,42),mR=Math.pow(2,49),gR=Math.
pow(2,56),bR=Math.pow(2,63),yR=function(t){return t<lR?1:t<dR?2:t<uR?3:t<fR?4:t<hR?5:t<pR?6:t<mR?7:t<gR?8:t<bR?9:10},wR={
encode:sR,decode:aR,encodingLength:yR},Dl=wR;function rh(t,e=0){const r=Dl.decode(t,e),n=Dl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function $l(t,e,r=0){return Dl.encode(t,e,r),e}function Nl(t){return Dl.encodingLength(t)}function vR(t,e){const r=e.
byteLength,n=Nl(t),s=n+Nl(r),i=new Uint8Array(s+r);return $l(t,i,0),$l(r,i,n),i.set(e,s),new Gp(t,r,e,i)}function ER(t){
const e=jp(t),[r,n]=rh(e),[s,i]=rh(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Gp(r,s,o,e)}function kR(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&HT(t.bytes,r.bytes)}}let Gp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
La(n),this.bytes=La(s)}};function Cb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return AR(r,nh(t),e??Ts.encoder);default:
return IR(r,nh(t),e??qc.encoder)}}const Tb=new WeakMap;function nh(t){const e=Tb.get(t);if(e==null){const r=new Map;return Tb.
set(t,r),r}return e}let xR=class pr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=La(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
So)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==_R)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return pr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=vR(e,
r);return pr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return pr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&kR(e.multihash,n.multihash)}toString(e){return Cb(this,e)}toJSON(){return{"/":Cb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof pr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new pr(n,s,i,o??Rb(n,s,i.bytes))}else if(r[CR]===!0){const{version:n,
multihash:s,code:i}=r,o=ER(s);return pr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==So)throw new Error(`Version 0 CID must use dag-pb (code: ${So}) block encoding`);return new pr(e,r,n,n.bytes)}case 1:{
const s=Rb(e,r,n.bytes);return new pr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return pr.
create(0,So,e)}static createV1(e,r){return pr.create(1,e,r)}static decode(e){const[r,n]=pr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=pr.inspectBytes(e),n=r.size-r.multihashSize,
s=jp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new Gp(r.multihashCode,r.digestSize,i,s);return[r.version===0?pr.createV0(o):pr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=rh(e.subarray(r));return r+=h,f};let s=n(),
i=So;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=SR(e,r),
i=pr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return nh(
i).set(n,e),i}};function SR(t,e){switch(t[0]){case"Q":{const r=e??Ts;return[Ts.prefix,r.decode(`${Ts.prefix}${t}`)]}case Ts.
prefix:{const r=e??Ts;return[Ts.prefix,r.decode(t)]}case qc.prefix:{const r=e??qc;return[qc.prefix,r.decode(t)]}case ku.
prefix:{const r=e??ku;return[ku.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function AR(t,e,r){const{prefix:n}=r;if(n!==
Ts.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function IR(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const So=112,_R=18;function Rb(t,e,r){const n=Nl(t),s=n+Nl(e),i=new Uint8Array(s+r.
byteLength);return $l(t,i,0),$l(e,i,n),i.set(r,s),i}const CR=Symbol.for("@ipld/js-cid/CID"),TR=Vr({prefix:"m",name:"base\
64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});Vr({prefix:"M",name:"bas\
e64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});Vr({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});Vr({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});function RR(t){
return t instanceof ArrayBuffer?new Uint8Array(t,0,t.byteLength):t}class MR extends Wv{constructor(e,r){super(e,r),this.
tokenBuffer=[]}done(){return this.tokenBuffer.length===0&&super.done()}_next(){return this.tokenBuffer.length>0?this.tokenBuffer.
pop():super.next()}next(){const e=this._next();if($.equals(e.type,$.map)){const r=this._next();if($.equals(r.type,$.string)&&
r.value==="/"){const n=this._next();if($.equals(n.type,$.string)){const s=this._next();if(!$.equals(s.type,$.break))throw new Error(
"Invalid encoded CID form");return this.tokenBuffer.push(n),new oe($.tag,42,0)}if($.equals(n.type,$.map)){const s=this._next();
if($.equals(s.type,$.string)&&s.value==="bytes"){const i=this._next();if($.equals(i.type,$.string)){for(let a=0;a<2;a++){
const c=this._next();if(!$.equals(c.type,$.break))throw new Error("Invalid encoded Bytes form")}const o=TR.decode(`m${i.
value}`);return new oe($.bytes,o,i.value.length)}this.tokenBuffer.push(i)}this.tokenBuffer.push(s)}this.tokenBuffer.push(
n)}this.tokenBuffer.push(r)}return e}}const Mb={allowIndefinite:!1,allowUndefined:!1,allowNaN:!1,allowInfinity:!1,allowBigInt:!0,
strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{42:t=>xR.parse(t())}},Qv=297,Jv=t=>{const e=RR(t),r=Object.assign(Mb,
{tokenizer:new MR(e,Mb)});return WT(e,r)};new TextDecoder;new TextEncoder;new TextEncoder;const BR=new TextDecoder,Yv=512;
function Xv(t){return JSON.parse(BR.decode(t))}const Wp=85,LR=0,Zv={code:LR},e1=81,DR=10;function $R(t=0){return new Uint8Array(
t)}function NR(t){return t?.buffer instanceof ArrayBuffer}function PR(t){if(NR(t))return t;const e=t.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Bb(t,e){e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=$R(e);let n=0;for(const s of t)
r.set(s,n),n+=s.length;return PR(r)}function OR(t){return t[Symbol.asyncIterator]!=null}function an(t){if(OR(t))return(async()=>{
let n=new Uint8Array(0);for await(const s of t)n=Bb([n,s],n.length+s.length);return n})();const e=[];let r=0;for(const n of t)
e.push(n),r+=n.byteLength;return Bb(e,r)}function Hp(t){return t==null?!1:ci.asCID(t)===t}function Vp(t,e){let r,n=0,s="";
for(;n<e.length;){const i=e[n];if(n++,!Object.hasOwnProperty.call(t,i))throw new Ra(`Object did not have key "${i}"`);if(s+=
`/${i}`,r=t[i],t=r,Hp(r))break}return{value:r,rest:e.slice(n),path:s.substring(1)}}async function*Lb(t,e,r,n){const s=await an(
r.get(t,n)),i=Gv(s),o=Vp(i,e);yield{cid:Hp(o.value)?o.value:t,name:o.path,rest:o.rest}}async function*UR(t,e,r,n){const s=await an(
r.get(t,n)),i=Jv(s),o=Vp(i,e);yield{cid:Hp(o.value)?o.value:t,name:o.path,rest:o.rest}}function sh(t){return t.type==="D\
IRECTORY"}function t1(t){return t.type==="FILE"}function r1(t){return t.type==="RAW"}function n1(t){return t.type==="SYM\
LINK"}function qi(t){return t.type==="HAMT_SHARD"&&t.data instanceof Uint8Array&&typeof t.fanOut=="bigint"&&typeof t.hashType==
"bigint"}function ei(t){return typeof t.name=="string"&&ci.asCID(t.hash)===t.hash}function*s1(t){let e={},r={};for(const n of Ia.
stream(t))switch(n.field){case".data":{if(n.type==="start"&&(r={}),n.type==="end"){if(sh(r)||qi(r)||t1(r)||r1(r)||n1(r)){
yield r;return}throw new Gt("PBNode Data was not a valid UnixFS type")}break}case".data.type":{r.type=n.value;break}case"\
.data.data":{r.data=n.value;break}case".data.fanOut":{r.fanOut=n.value;break}case".data.hashType":{r.hashType=n.value;break}case"\
.links[]":{n.type==="start"&&(e={type:"LINK"}),n.type==="end"&&ei(e)&&(yield e);break}case".links[].name":{e.name=n.value;
break}case".links[].hash":{e.hash=ci.decode(n.value);break}}}const Db=(t,e)=>t.toString(16).toUpperCase().padStart(e,"0").
substring(0,e),FR=t=>{let e=t.bucket;const r=[];for(;e._parent!=null;)r.push(e),e=e._parent;return r.push(e),r.reverse()};
async function*ih(t,e,r,n,s,i,o){const a=(i.lastBucket.tableSize()-1).toString(16).length;let c=[];for(const g of e){if(!ei(
g))throw new Gt("Invalid link");if(c.push(g),g.name.length===a){const u=parseInt(g.name,16);i.lastBucket._putObjectAt(u,
new Gr({hash:i.lastBucket._options.hash,bits:i.lastBucket._options.bits},i.lastBucket,u))}if(g.name.substring(a)===r){yield{
cid:g.hash,name:r,rest:n};return}await i.rootBucket.put(g.name.substring(a),!0)}const l=await i.rootBucket._findNewBucketAndPos(
r);let d=Db(l.pos,a);const f=FR(l);f.length>i.hamtDepth&&(i.lastBucket=f[i.hamtDepth],d=Db(i.lastBucket._posAtParent,a));
const h=c.find(g=>g.name==null?!1:g.name===d);if(h==null)return;i.hamtDepth++;const p=await an(s.get(h.hash,o));o?.yieldSubShards===
!0&&(yield{cid:h.hash,name:h.name,rest:[r,...n]});const m=s1(p),{value:b}=m.next();if(c=[],b!=null){if(qi(b)){yield*ih(b,
m,r,n,s,i,o);return}if(!ei(b))throw new Gt("Did not read Link or Data from dag-pb block");c.push(b);for(const g of m){if(qi(
g)){yield*ih(g,c,r,n,s,i,o);return}if(!ei(g))throw new Gt("Did not read Link or Data from dag-pb block");c.push(g)}}}function*$b(t,e,r){
for(const n of t){if(!ei(n))throw new Gt("Invalid link");if(n.name===e[0]){yield{cid:n.hash,name:e[0],rest:e.slice(1)};return}}
throw new pi(`No link "${e[0]}" found under ${r}`)}const zR=async function(t){return(await mv.encode(t)).slice(0,8).reverse()};
async function*Nb(t,e,r,n,s,i){const o=kv({hashFn:zR,bits:Math.log2(Number(t.fanOut))}),a={rootBucket:o,hamtDepth:1,lastBucket:o};
for await(const c of ih(t,e,r[0],r.slice(1),s,a,i))if(yield c,c.name===r[0])return;throw new pi(`No link "${r[0]}" found\
 under ${n}`)}async function*qR(t,e,r,n){const s=await an(r.get(t,n)),i=[],o=s1(s),{value:a}=o.next();let c=!1,l=!1;if(a!=
null){if(l=sh(a),c=qi(a),t1(a)||r1(a)||n1(a)){yield{cid:t,name:e[0],rest:e.slice(1)};return}if(l||c&&n?.translateHAMTPath===
!1){yield*$b(o,e,t);return}if(c){yield*Nb(a,o,e,t,r,n);return}if(!ei(a))throw new Gt("Did not read Link or Data from dag\
-pb block");i.push(a);for(const d of o){if(l=sh(d),c=qi(d),l||c&&n?.translateHAMTPath===!1){yield*$b(i,e,t);return}if(qi(
d)){yield*Nb(d,i,e,t,r,n);return}if(!ei(d))throw new Gt("Did not read Link or Data from dag-pb block");i.push(d)}}throw new pi(
`No link "${e[0]}" found under ${t}`)}async function*jR(t,e,r,n){if(e.length!==0)throw new Ra(`Cannot load path /${e.join(
"/")} from identity block`)}async function*GR(t,e,r,n){const s=await an(r.get(t,n)),i=Xv(s),o=Vp(i,e);yield{cid:t,name:o.
path,rest:o.rest}}async function*WR(t,e,r,n){if(e.length!==0)throw new pi(`Cannot load path /${e.join("/")} from raw blo\
ck`)}const HR={[ja]:qR,[Wp]:WR,[jv]:Lb,[e1]:Lb,[Qv]:UR,[Zv.code]:jR,[Yv]:GR};async function*VR(t,e,r={}){for(t=t.toString(),
t.startsWith("/ipfs/")&&(t=t.substring(6));t.endsWith("/");)t=t.substring(0,t.length-1);let[n,...s]=t.split(/(?<!\\)\//g).
filter(Boolean),i=ci.parse(n),o=[i],a=`${i}`;for(yield{cid:i,name:a,path:a,roots:o,remainder:s};s.length>0;){const c=HR[i.
code];if(c==null)throw new Ma(`No resolver for code ${i.code}`);let l=!1;for await(const d of c(i,s,e,r)){if(i=d.cid,l=!o[o.
length-1].equals(i),s=d.rest,!l)break;o=[...o,d.cid],a=`${a}/${d.name}`,yield{cid:d.cid,name:d.name,path:a,roots:o,remainder:d.
rest}}if(!l)break}if(r?.signal?.throwIfAborted(),s.length!==0)throw new pi(`Could not resolve path /${s.join("/")} under\
 ${t}`)}function KR(t){return t[Symbol.asyncIterator]!=null}function QR(t){if(KR(t))return(async()=>{let r;for await(const n of t)
r=n;return r})();let e;for(const r of t)e=r;return e}async function Pb(t,e,r,n,s){const i=await an(n.get(t,s)),o=Gv(i);return{
type:"object",cid:t,name:e,path:r,object:o,node:i,size:BigInt(i.byteLength)}}async function JR(t,e,r,n,s){const i=await an(
n.get(t,s)),o=Jv(i);return{type:"object",cid:t,name:e,path:r,object:o,node:i,size:BigInt(i.byteLength)}}function oh(t,e,r,n){
const s=BigInt(t.length),i=BigInt(e+s);return r>=i||n<e?new Uint8Array(0):(n>=e&&n<i&&(t=t.subarray(0,Number(n-e))),r>=e&&
r<i&&(t=t.subarray(Number(r-e))),t)}const i1=(t,e=0,r=t)=>{const n=BigInt(t),s=BigInt(e??0);let i=BigInt(r);if(i!==n&&(i=
s+i),i>n&&(i=n),s<0n)throw new Ho("Offset must be greater than or equal to 0");if(s>n)throw new Ho("Offset must be less \
than the file size");if(i<0n)throw new Ho("Length must be greater than or equal to 0");if(i>n)throw new Ho("Length must \
be less than the file size");return{start:s,end:i}};function o1(t,e){async function*r(n={}){const{start:s,end:i}=i1(t.length,
n.offset,n.length),o=oh(t,0n,s,i);n.onProgress?.(new Nn(e,{bytesRead:BigInt(o.byteLength),totalBytes:i-s,fileSize:BigInt(
t.byteLength)})),yield o}return r}async function YR(t,e,r,n,s){const i=Rv(t.multihash.bytes);return{type:"identity",cid:t,
name:e,path:r,content:o1(i.digest,"unixfs:exporter:progress:identity"),size:BigInt(i.bytes.byteLength),node:i.bytes}}async function XR(t,e,r,n,s){
const i=await an(n.get(t,s)),o=Xv(i);return{type:"object",cid:t,name:e,path:r,object:o,size:BigInt(i.byteLength),node:i}}
async function ZR(t,e,r,n,s){const i=await an(n.get(t,s));return{type:"raw",cid:t,name:e,path:r,content:o1(i,"unixfs:exp\
orter:progress:raw"),size:BigInt(i.length),node:i}}function eM(t,e,r,n){async function*s(i={}){const o=i.offset??0,a=i.length??
e.Links.length,c=e.Links.slice(o,o+a);i.onProgress?.(new Nn("unixfs:exporter:walk:directory",{cid:t})),yield*c.map(l=>({
cid:l.Hash,name:l.Name??"",path:`${n}/${l.Name??""}`,size:BigInt(l.Tsize??0)}))}return s}function tM(t){const[e,r]=t[Symbol.
asyncIterator]!=null?[t[Symbol.asyncIterator](),Symbol.asyncIterator]:[t[Symbol.iterator](),Symbol.iterator],n=[];return{
peek:()=>e.next(),push:s=>{n.push(s)},next:()=>n.length>0?{done:!1,value:n.shift()}:e.next(),[r](){return this}}}function rM(t){
return t[Symbol.asyncIterator]!=null}function nM(t,e){let r=0;if(rM(t))return(async function*(){for await(const c of t)yield e(
c,r++)})();const n=tM(t),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,r++);if(typeof o.then==
"function")return(async function*(){yield await o;for(const c of n)yield e(c,r++)})();const a=e;return(function*(){yield o;
for(const c of n)yield a(c,r++)})()}function sn(){const t={};return t.promise=new Promise((e,r)=>{t.resolve=e,t.reject=r}),
t}const hc=globalThis.CustomEvent??Event;async function*sM(t,e={}){let r=e.concurrency??1/0;r<1&&(r=1/0);const n=e.ordered??
!1,s=new EventTarget,i=[];let o=sn(),a=sn(),c=!1,l,d=!1,f=!1;s.addEventListener("task-complete",()=>{a.resolve()}),Promise.
resolve().then(async()=>{try{for await(const b of t){if(i.length===r&&(o=sn(),await o.promise),d||f)break;const g={done:!1};
i.push(g),b().then(u=>{g.done=!0,g.ok=!0,g.value=u,s.dispatchEvent(new hc("task-complete"))},u=>{g.done=!0,g.err=u,s.dispatchEvent(
new hc("task-complete"))})}c=!0,s.dispatchEvent(new hc("task-complete"))}catch(b){l=b,s.dispatchEvent(new hc("task-compl\
ete"))}});function h(){return n?i[0]?.done:!!i.find(b=>b.done)}function*p(){for(;i.length>0&&i[0].done;){const b=i[0];if(i.
shift(),b.ok)yield b.value;else throw d=!0,o.resolve(),b.err;o.resolve()}}function*m(){for(;h();)for(let b=0;b<i.length;b++)
if(i[b].done){const g=i[b];if(i.splice(b,1),b--,g.ok)yield g.value;else throw d=!0,o.resolve(),g.err;o.resolve()}}try{for(;;){
if(h()||(a=sn(),await a.promise),l!=null||(n?yield*p():yield*m(),l!=null))throw l;if(c&&i.length===0)break}}finally{f=!0,
o.resolve()}}let Ob=class{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a\
 FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){
return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.top+1&this.mask,!0)}shift(){const e=this.
buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,e}isEmpty(){return this.
buffer[this.btm]===void 0}},xu=class{size;hwm;head;tail;constructor(e={}){this.hwm=e.splitLimit??16,this.head=new Ob(this.
hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?e.byteLength:1}push(e){if(e?.value!=null&&
(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const r=this.head;this.head=r.next=new Ob(2*this.head.buffer.
length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.tail.next!=null){const r=this.tail.next;this.
tail.next=null,this.tail=r,e=this.tail.shift()}return e?.value!=null&&(this.size-=this.calculateSize(e.value)),e}isEmpty(){
return this.head.isEmpty()}},iM=class extends Error{type;code;constructor(e,r){super(e??"The operation was aborted"),this.
type="aborted",this.code=r??"ABORT_ERR"}};function a1(t={}){return oM(r=>{const n=r.shift();if(n==null)return{done:!0};if(n.
error!=null)throw n.error;return{done:n.done===!0,value:n.value}},t)}function oM(t,e){e=e??{};let r=e.onEnd,n=new xu,s,i,
o,a=sn();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,u)=>{i=y=>{i=null,n.push(y);try{g(t(n))}catch(E){
u(E)}return s}}):t(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=sn()})}},l=g=>i!=null?i(g):(n.push(g),s),d=g=>(n=
new xu,i!=null?i({error:g}):(n.push({error:g}),s)),f=g=>{if(o)return s;if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error(
"objectMode was not true but tried to push non-Uint8Array value");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?d(
g):l({done:!0})),p=()=>(n=new xu,h(),{done:!0}),m=g=>(h(g),{done:!0});if(s={[Symbol.asyncIterator](){return this},next:c,
return:p,throw:m,push:f,end:h,get readableLength(){return n.size},onEmpty:async g=>{const u=g?.signal;if(u?.throwIfAborted(),
n.isEmpty())return;let y,E;u!=null&&(y=new Promise((k,A)=>{E=()=>{A(new iM)},u.addEventListener("abort",E)}));try{await Promise.
race([a.promise,y])}finally{E!=null&&u!=null&&u?.removeEventListener("abort",E)}}},r==null)return s;const b=s;return s={
[Symbol.asyncIterator](){return this},next(){return b.next()},throw(g){return b.throw(g),r!=null&&(r(g),r=void 0),{done:!0}},
return(){return b.return(),r!=null&&(r(),r=void 0),{done:!0}},push:f,end(g){return b.end(g),r!=null&&(r(g),r=void 0),s},
get readableLength(){return b.readableLength},onEmpty:g=>b.onEmpty(g)},s}function aM(t){return t.reason}function c1(t,e,r){
if(e==null||t==null)return t;const n=r?.translateError??aM;if(e.aborted)return t.catch(()=>{}),Promise.reject(n(e));let s;
return Promise.race([t,new Promise((i,o)=>{s=()=>{o(n(e))},e.addEventListener("abort",s)})]).finally(()=>{s!=null&&e.removeEventListener(
"abort",s)})}class cM{readNext;haveNext;ended;nextResult;error;constructor(){this.ended=!1,this.readNext=sn(),this.haveNext=
sn()}[Symbol.asyncIterator](){return this}async next(){if(this.nextResult==null&&await this.haveNext.promise,this.nextResult==
null)throw new Error("HaveNext promise resolved but nextResult was undefined");const e=this.nextResult;return this.nextResult=
void 0,this.readNext.resolve(),this.readNext=sn(),e}async throw(e){return this.ended=!0,this.error=e,e!=null&&(this.haveNext.
promise.catch(()=>{}),this.haveNext.reject(e)),{done:!0,value:void 0}}async return(){const e={done:!0,value:void 0};return this.
ended=!0,this.nextResult=e,this.haveNext.resolve(),e}async push(e,r){await this._push(e,r)}async end(e,r){e!=null?await this.
throw(e):await this._push(void 0,r)}async _push(e,r){if(e!=null&&this.ended)throw this.error??new Error("Cannot push val\
ue onto an ended pushable");for(;this.nextResult!=null;)await this.readNext.promise;e!=null?this.nextResult={done:!1,value:e}:
(this.ended=!0,this.nextResult={done:!0,value:void 0}),this.haveNext.resolve(),this.haveNext=sn(),await c1(this.readNext.
promise,r?.signal,r)}}function lM(){return new cM}function dM(t){return t[Symbol.asyncIterator]!=null}async function uM(t,e,r){
try{await Promise.all(t.map(async n=>{for await(const s of n)await e.push(s,{signal:r}),r.throwIfAborted()})),await e.end(
void 0,{signal:r})}catch(n){await e.end(n,{signal:r}).catch(()=>{})}}async function*fM(t){const e=new AbortController,r=lM();
uM(t,r,e.signal).catch(()=>{});try{yield*r}finally{e.abort()}}function*hM(t){for(const e of t)yield*e}function pM(...t){
const e=[];for(const r of t)dM(r)||e.push(r);return e.length===t.length?hM(e):fM(t)}function l1(t,...e){if(t==null)throw new Error(
"Empty pipeline");if(Su(t)){const n=t;t=()=>n.source}else if(u1(t)||d1(t)){const n=t;t=()=>n}const r=[t,...e];if(r.length>
1&&Su(r[r.length-1])&&(r[r.length-1]=r[r.length-1].sink),r.length>2)for(let n=1;n<r.length-1;n++)Su(r[n])&&(r[n]=gM(r[n]));
return mM(...r)}const mM=(...t)=>{let e;for(;t.length>0;)e=t.shift()(e);return e},d1=t=>t?.[Symbol.asyncIterator]!=null,
u1=t=>t?.[Symbol.iterator]!=null,Su=t=>t==null?!1:t.sink!=null&&t.source!=null,gM=t=>e=>{const r=t.sink(e);if(r?.then!=null){
const n=a1({objectMode:!0});r.then(()=>{n.end()},o=>{n.end(o)});let s;const i=t.source;if(d1(i))s=async function*(){yield*i,
n.end()};else if(u1(i))s=function*(){yield*i,n.end()};else throw new Error("Unknown duplex source type - must be Iterabl\
e or AsyncIterable");return pM(n,s())}return t.source};class Ub{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&
e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.
top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.
top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.
btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class Au{size;hwm;head;tail;constructor(e={}){this.hwm=
e.splitLimit??16,this.head=new Ub(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?
e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const r=this.head;
this.head=r.next=new Ub(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.
tail.next!=null){const r=this.tail.next;this.tail.next=null,this.tail=r,e=this.tail.shift()}return e?.value!=null&&(this.
size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}let bM=class extends Error{type;code;constructor(e,r){
super(e??"The operation was aborted"),this.type="aborted",this.code=r??"ABORT_ERR"}};function yM(t={}){return wM(r=>{const n=r.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},t)}function wM(t,e){
e=e??{};let r=e.onEnd,n=new Au,s,i,o,a=sn();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,u)=>{
i=y=>{i=null,n.push(y);try{g(t(n))}catch(E){u(E)}return s}}):t(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
sn()})}},l=g=>i!=null?i(g):(n.push(g),s),d=g=>(n=new Au,i!=null?i({error:g}):(n.push({error:g}),s)),f=g=>{if(o)return s;
if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?d(g):l({done:!0})),p=()=>(n=new Au,h(),{done:!0}),m=g=>(h(g),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:p,throw:m,push:f,end:h,get readableLength(){return n.size},onEmpty:async g=>{
const u=g?.signal;if(u?.throwIfAborted(),n.isEmpty())return;let y,E;u!=null&&(y=new Promise((k,A)=>{E=()=>{A(new bM)},u.
addEventListener("abort",E)}));try{await Promise.race([a.promise,y])}finally{E!=null&&u!=null&&u?.removeEventListener("a\
bort",E)}}},r==null)return s;const b=s;return s={[Symbol.asyncIterator](){return this},next(){return b.next()},throw(g){
return b.throw(g),r!=null&&(r(g),r=void 0),{done:!0}},return(){return b.return(),r!=null&&(r(),r=void 0),{done:!0}},push:f,
end(g){return b.end(g),r!=null&&(r(g),r=void 0),s},get readableLength(){return b.readableLength},onEmpty:g=>b.onEmpty(g)},
s}var Iu={exports:{}},Fb;function vM(){return Fb||(Fb=1,(function(t){var e=Object.prototype.hasOwnProperty,r="~";function n(){}
Object.create&&(n.prototype=Object.create(null),new n().__proto__||(r=!1));function s(c,l,d){this.fn=c,this.context=l,this.
once=d||!1}function i(c,l,d,f,h){if(typeof d!="function")throw new TypeError("The listener must be a function");var p=new s(
d,f||c,h),m=r?r+l:l;return c._events[m]?c._events[m].fn?c._events[m]=[c._events[m],p]:c._events[m].push(p):(c._events[m]=
p,c._eventsCount++),c}function o(c,l){--c._eventsCount===0?c._events=new n:delete c._events[l]}function a(){this._events=
new n,this._eventsCount=0}a.prototype.eventNames=function(){var l=[],d,f;if(this._eventsCount===0)return l;for(f in d=this.
_events)e.call(d,f)&&l.push(r?f.slice(1):f);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(d)):
l},a.prototype.listeners=function(l){var d=r?r+l:l,f=this._events[d];if(!f)return[];if(f.fn)return[f.fn];for(var h=0,p=f.
length,m=new Array(p);h<p;h++)m[h]=f[h].fn;return m},a.prototype.listenerCount=function(l){var d=r?r+l:l,f=this._events[d];
return f?f.fn?1:f.length:0},a.prototype.emit=function(l,d,f,h,p,m){var b=r?r+l:l;if(!this._events[b])return!1;var g=this.
_events[b],u=arguments.length,y,E;if(g.fn){switch(g.once&&this.removeListener(l,g.fn,void 0,!0),u){case 1:return g.fn.call(
g.context),!0;case 2:return g.fn.call(g.context,d),!0;case 3:return g.fn.call(g.context,d,f),!0;case 4:return g.fn.call(
g.context,d,f,h),!0;case 5:return g.fn.call(g.context,d,f,h,p),!0;case 6:return g.fn.call(g.context,d,f,h,p,m),!0}for(E=
1,y=new Array(u-1);E<u;E++)y[E-1]=arguments[E];g.fn.apply(g.context,y)}else{var k=g.length,A;for(E=0;E<k;E++)switch(g[E].
once&&this.removeListener(l,g[E].fn,void 0,!0),u){case 1:g[E].fn.call(g[E].context);break;case 2:g[E].fn.call(g[E].context,
d);break;case 3:g[E].fn.call(g[E].context,d,f);break;case 4:g[E].fn.call(g[E].context,d,f,h);break;default:if(!y)for(A=1,
y=new Array(u-1);A<u;A++)y[A-1]=arguments[A];g[E].fn.apply(g[E].context,y)}}return!0},a.prototype.on=function(l,d,f){return i(
this,l,d,f,!1)},a.prototype.once=function(l,d,f){return i(this,l,d,f,!0)},a.prototype.removeListener=function(l,d,f,h){var p=r?
r+l:l;if(!this._events[p])return this;if(!d)return o(this,p),this;var m=this._events[p];if(m.fn)m.fn===d&&(!h||m.once)&&
(!f||m.context===f)&&o(this,p);else{for(var b=0,g=[],u=m.length;b<u;b++)(m[b].fn!==d||h&&!m[b].once||f&&m[b].context!==f)&&
g.push(m[b]);g.length?this._events[p]=g.length===1?g[0]:g:o(this,p)}return this},a.prototype.removeAllListeners=function(l){
var d;return l?(d=r?r+l:l,this._events[d]&&o(this,d)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.
removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=r,a.EventEmitter=a,t.exports=a})(Iu)),Iu.exports}var EM=vM();
const kM=gv(EM);let xM=class f1 extends Error{name="TimeoutError";constructor(e,r){super(e,r),Error.captureStackTrace?.(
this,f1)}};const zb=t=>t.reason??new DOMException("This operation was aborted.","AbortError");function SM(t,e){const{milliseconds:r,
fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const d=new Promise((f,h)=>{if(typeof r!=
"number"||Math.sign(r)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${r}\``);if(o?.
aborted){h(zb(o));return}if(o&&(c=()=>{h(zb(o))},o.addEventListener("abort",c,{once:!0})),t.then(f,h),r===Number.POSITIVE_INFINITY)
return;const p=new xM;a=i.setTimeout.call(void 0,()=>{if(n){try{f(n())}catch(m){h(m)}return}typeof t.cancel=="function"&&
t.cancel(),s===!1?f():s instanceof Error?h(s):(p.message=s??`Promise timed out after ${r} milliseconds`,h(p))},r)}).finally(
()=>{d.clear(),c&&o&&o.removeEventListener("abort",c)});return d.clear=()=>{i.clearTimeout.call(void 0,a),a=void 0},d}function AM(t,e,r){
let n=0,s=t.length;for(;s>0;){const i=Math.trunc(s/2);let o=n+i;r(t[o],e)<=0?(n=++o,s-=i+1):s=i}return n}const IM=100;class qb{#e=[];#t=0;enqueue(e,r){
const{priority:n=0,id:s}=r??{},{size:i}=this,o={priority:n,id:s,run:e};if(i===0){this.#e.length=0,this.#t=0,this.#e.push(
o);return}if(this.#e.at(-1).priority>=n){this.#e.push(o);return}this.#r();const a=AM(this.#e,o,(c,l)=>l.priority-c.priority);
this.#e.splice(a,0,o)}setPriority(e,r){const n=this.#e.findIndex((i,o)=>o>=this.#t&&i.id===e);if(n===-1)throw new ReferenceError(
`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.splice(n,1);this.enqueue(s.run,{priority:r,
id:e})}remove(e){const r=this.#e.findIndex((n,s)=>s<this.#t?!1:typeof e=="string"?n.id===e:n.run===e);r!==-1&&this.#e.splice(
r,1)}dequeue(){if(this.#t===this.#e.length)return;const e=this.#e[this.#t];return this.#t++,this.#t===this.#e.length?(this.#e.
length=0,this.#t=0):this.#t>IM&&this.#t>this.#e.length/2&&this.#r(),e?.run}filter(e){const r=[];for(let n=this.#t;n<this.#e.
length;n++){const s=this.#e[n];s.priority===e.priority&&r.push(s.run)}return r}get size(){return this.#e.length-this.#t}#r(){
this.#t!==0&&(this.#e.splice(0,this.#t),this.#t=0)}}class _M extends kM{#e;#t;#r=0;#u;#f=!1;#a=!1;#l;#h=0;#c;#m;#d;#i=[];#o=0;#n;#w;#s=0;#g;#p;#B=1n;#v=new Map;#k=new Set;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:qb,strict:!1,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expe\
cted \`intervalCap\` to be a number from 1 and up, got \`${e.intervalCap?.toString()??""}\` (${typeof e.intervalCap})`);
if(e.interval===void 0||!(Number.isFinite(e.interval)&&e.interval>=0))throw new TypeError(`Expected \`interval\` to be a f\
inite number >= 0, got \`${e.interval?.toString()??""}\` (${typeof e.interval})`);if(e.strict&&e.interval===0)throw new TypeError(
"The `strict` option requires a non-zero `interval`");if(e.strict&&e.intervalCap===Number.POSITIVE_INFINITY)throw new TypeError(
"The `strict` option requires a finite `intervalCap`");if(this.#e=e.carryoverIntervalCount??e.carryoverConcurrencyCount??
!1,this.#t=e.intervalCap===Number.POSITIVE_INFINITY||e.interval===0,this.#u=e.intervalCap,this.#l=e.interval,this.#d=e.strict,
this.#n=new e.queueClass,this.#w=e.queueClass,this.concurrency=e.concurrency,e.timeout!==void 0&&!(Number.isFinite(e.timeout)&&
e.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${e.timeout}\` (${typeof e.
timeout})`);this.timeout=e.timeout,this.#p=e.autoStart===!1,this.#F()}#x(e){for(;this.#o<this.#i.length;){const n=this.#i[this.#o];
if(n!==void 0&&e-n>=this.#l)this.#o++;else break}(this.#o>100&&this.#o>this.#i.length/2||this.#o===this.#i.length)&&(this.#i=
this.#i.slice(this.#o),this.#o=0)}#L(e){this.#d?this.#i.push(e):this.#r++}#D(){this.#d?this.#i.length>this.#o&&this.#i.pop():
this.#r>0&&this.#r--}#S(){return this.#i.length-this.#o}get#$(){return this.#t?!0:this.#d?this.#S()<this.#u:this.#r<this.#u}get#N(){
return this.#s<this.#g}#P(){this.#s--,this.#s===0&&this.emit("pendingZero"),this.#E(),this.emit("next")}#O(){this.#m=void 0,
this.#R(),this.#T()}#U(e){if(this.#d){if(this.#x(e),this.#S()>=this.#u){const n=this.#i[this.#o],s=this.#l-(e-n);return this.#_(
s),!0}return!1}if(this.#c===void 0){const r=this.#h-e;if(r<0)this.#r=this.#e?this.#s:0;else return this.#_(r),!0}return!1}#_(e){
this.#m===void 0&&(this.#m=setTimeout(()=>{this.#O()},e))}#A(){this.#c&&(clearInterval(this.#c),this.#c=void 0)}#C(){this.#m&&
(clearTimeout(this.#m),this.#m=void 0)}#E(){if(this.#n.size===0){if(this.#A(),this.emit("empty"),this.#s===0){if(this.#C(),
this.#d&&this.#o>0){const r=Date.now();this.#x(r)}this.emit("idle")}return!1}let e=!1;if(!this.#p){const r=Date.now(),n=!this.#U(
r);if(this.#$&&this.#N){const s=this.#n.dequeue();this.#t||(this.#L(r),this.#y()),n&&this.#T(),s(),this.emit("active"),e=
!0}}return e}#T(){this.#t||this.#c!==void 0||this.#d||(this.#c=setInterval(()=>{this.#R()},this.#l),this.#h=Date.now()+this.#l)}#R(){
this.#d||(this.#c!==void 0&&(this.#r===0&&this.#s===0?this.#A():this.#h=Date.now()+this.#l),this.#r=this.#e?this.#s:0),this.#I(),
this.#y()}#I(){for(;this.#E(););}get concurrency(){return this.#g}set concurrency(e){if(!(typeof e=="number"&&e>=1))throw new TypeError(
`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this.#g=e,this.#I()}setPriority(e,r){
if(typeof r!="number"||!Number.isFinite(r))throw new TypeError(`Expected \`priority\` to be a finite number, got \`${r}\`\
 (${typeof r})`);this.#n.setPriority(e,r)}async add(e,r={}){if(r={timeout:this.timeout,...r,id:r.id??(this.#B++).toString()},
r.timeout!==void 0&&!(Number.isFinite(r.timeout)&&r.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive \
finite number, got \`${r.timeout}\` (${typeof r.timeout})`);return new Promise((n,s)=>{const i=Symbol(`task-${r.id}`);let o=()=>{};
const a=async()=>{o(),this.#s++,this.#v.set(i,{id:r.id,priority:r.priority??0,startTime:Date.now(),timeout:r.timeout});let l;
try{try{r.signal?.throwIfAborted()}catch(h){throw this.#z(),this.#v.delete(i),h}let d=e({signal:r.signal});if(r.timeout!==
void 0&&(d=SM(Promise.resolve(d),{milliseconds:r.timeout,message:`Task timed out after ${r.timeout}ms (queue has ${this.#s}\
 running, ${this.#n.size} waiting)`})),r.signal){const{signal:h}=r;d=Promise.race([d,new Promise((p,m)=>{l=()=>{m(h.reason)},
h.addEventListener("abort",l,{once:!0}),h.aborted&&l()})])}const f=await d;n(f),this.emit("completed",f)}catch(d){s(d),this.
emit("error",d)}finally{l&&r.signal?.removeEventListener("abort",l),this.#v.delete(i),queueMicrotask(()=>{this.#P()})}};
this.#n.enqueue(a,r);const c=()=>{if(this.#n instanceof qb){this.#n.remove(a);return}this.#n.remove?.(r.id)};if(r.signal){
const{signal:l}=r,d=()=>{o(),c(),s(l.reason),this.#E(),this.emit("next")};if(o=()=>{l.removeEventListener("abort",d),this.#k.
delete(o)},l.aborted){d();return}l.addEventListener("abort",d,{once:!0}),this.#k.add(o)}this.emit("add"),this.#E()})}async addAll(e,r){
return Promise.all(e.map(async n=>this.add(n,r)))}start(){return this.#p?(this.#p=!1,this.#I(),this):this}pause(){this.#p=
!0}clear(){for(const e of this.#k)e();this.#n=new this.#w,this.#A(),this.#M(),this.emit("empty"),this.#s===0&&(this.#C(),
this.emit("idle")),this.emit("next")}async onEmpty(){this.#n.size!==0&&await this.#b("empty")}async onSizeLessThan(e){this.#n.
size<e||await this.#b(["next","active"],()=>this.#n.size<e)}async onIdle(){this.#s===0&&this.#n.size===0||await this.#b(
"idle")}async onPendingZero(){this.#s!==0&&await this.#b("pendingZero")}async onRateLimit(){this.isRateLimited||await this.#b(
"rateLimit")}async onRateLimitCleared(){this.isRateLimited&&await this.#b("rateLimitCleared")}onError(){return new Promise(
(e,r)=>{const n=s=>{this.off("error",n),r(s)};this.on("error",n)})}async#b(e,r){const n=Array.isArray(e)?e:[e];return new Promise(
s=>{const i=()=>{if(!(r&&!r())){for(const o of n)this.off(o,i);s()}};for(const o of n)this.on(o,i)})}get size(){return this.#n.
size}sizeBy(e){return this.#n.filter(e).length}get pending(){return this.#s}get isPaused(){return this.#p}#F(){this.#t||
(this.on("add",()=>{this.#n.size>0&&this.#y()}),this.on("next",()=>{this.#y()}))}#y(){this.#t||this.#a||(this.#a=!0,queueMicrotask(
()=>{this.#a=!1,this.#M()}))}#z(){this.#t||(this.#D(),this.#y())}#M(){const e=this.#f;if(this.#t||this.#n.size===0){e&&(this.#f=
!1,this.emit("rateLimitCleared"));return}let r;if(this.#d){const s=Date.now();this.#x(s),r=this.#S()}else r=this.#r;const n=r>=
this.#u;n!==e&&(this.#f=n,this.emit(n?"rateLimit":"rateLimitCleared"))}get isRateLimited(){return this.#f}get isSaturated(){
return this.#s===this.#g&&this.#n.size>0||this.isRateLimited&&this.#n.size>0}get runningTasks(){return[...this.#v.values()].
map(e=>({...e,timeoutRemaining:e.timeout?Math.max(0,e.startTime+e.timeout-Date.now()):void 0}))}}async function h1(t,e,r,n,s,i,o){
if(e instanceof Uint8Array){const l=oh(e,n,s,i);r.push(l);return}if(e.Data==null)throw new Gt("no data in PBNode");let a;
try{a=Lr.unmarshal(e.Data)}catch(l){throw new Gt(l.message)}if(a.data!=null){const l=a.data,d=oh(l,n,s,i);r.push(d),n+=BigInt(
d.byteLength)}const c=[];if(e.Links.length!==a.blockSizes.length)throw new Gt("Inconsistent block sizes and dag links");
for(let l=0;l<e.Links.length;l++){const d=e.Links[l],f=n,h=f+a.blockSizes[l];if((s>=f&&s<h||i>=f&&i<=h||s<f&&i>h)&&c.push(
{link:d,blockStart:n}),n=h,n>i)break}await l1(c,l=>nM(l,d=>async()=>{const f=await an(t.get(d.link.Hash,o));return{...d,
block:f}}),l=>sM(l,{ordered:!0,concurrency:o.blockReadConcurrency??DR}),async l=>{for await(const{link:d,block:f,blockStart:h}of l){
let p;switch(d.Hash.code){case ja:p=Sa(f);break;case Wp:p=f;break;default:r.end(new Gt(`Unsupported codec: ${d.Hash.code}`));
return}const m=new _M({concurrency:1});m.on("error",b=>{r.end(b)}),m.add(async()=>{o.onProgress?.(new Nn("unixfs:exporte\
r:walk:file",{cid:d.Hash})),await h1(t,p,r,h,s,i,o)}),await m.onIdle()}}),n>=i&&r.end()}function jb(t,e,r,n,s){async function*i(o={}){
const a=r.fileSize();if(a===void 0)throw new Error("File was a directory");const{start:c,end:l}=i1(a,o.offset,o.length);
if(l===0n)return;let d=0n;const f=l-c,h=yM();o.onProgress?.(new Nn("unixfs:exporter:walk:file",{cid:t})),h1(s,e,h,0n,c,l,
o).catch(p=>{h.end(p)});for await(const p of h)if(p!=null){if(d+=BigInt(p.byteLength),d>f)throw h.end(),new Al("Read too\
 many bytes - the file size reported by the UnixFS data in the root node may be incorrect");d===f&&h.end(),o.onProgress?.(
new Nn("unixfs:exporter:progress:unixfs:file",{bytesRead:d,totalBytes:f,fileSize:a})),yield p}if(d<f)throw new Il("Trave\
rsed entire DAG but did not read enough bytes")}return i}async function*CM(t,e,r,n){let s=-1,i=0;for await(const o of p1(
t,e,r,n))if(s++,!(n.offset!=null&&n.offset<s)&&(yield o,i++,n.length!=null&&n.length===i))return}async function*p1(t,e,r,n){
const s=await an(r.get(t,n)),i=Ia.decode(s);if(i.data?.fanOut==null)throw new Gt("missing fanout");const o=(i.data.fanOut-
1n).toString(16).length;for(const a of i.links){if(a.name==null||a.hash==null)continue;const c=ci.decode(a.hash);if(a.name.
length===o)yield*p1(c,e,r,n);else{const l=a.name.substring(o);yield{cid:c,name:a.name.substring(o),path:`${e}/${l}`,size:BigInt(
a.tSize??0)}}}}function TM(t,e,r,n,s){function i(o={}){return o.onProgress?.(new Nn("unixfs:exporter:walk:hamt-sharded-d\
irectory",{cid:t})),CM(t,n,s,o)}return i}const RM={raw:jb,file:jb,directory:eM,"hamt-sharded-directory":TM,metadata:(t,e,r,n)=>()=>[],
symlink:(t,e,r,n)=>()=>[]};async function MM(t,e,r,n,s){const i=await an(n.get(t,s));let o;try{o=Sa(i)}catch(l){throw new Gt(
l.message)}if(o.Data==null)throw new Gt("no data in PBNode");let a;try{a=Lr.unmarshal(o.Data)}catch(l){throw new Gt(l.message)}
const c=RM[a.type](t,o,a,r,n);if(c==null)throw new pi("could not find content exporter");return a.isDirectory()?{type:"d\
irectory",cid:t,name:e,path:r,entries:c,unixfs:a,node:o,size:BigInt(i.byteLength)}:{type:"file",cid:t,name:e,path:r,content:c,
unixfs:a,node:o,size:a.fileSize()}}const BM={[ja]:MM,[Wp]:ZR,[jv]:Pb,[e1]:Pb,[Qv]:JR,[Zv.code]:YR,[Yv]:XR};async function Gb(t,e,r={}){
let n,s;if(t instanceof String||typeof t=="string"){const o=await QR(VR(t,e,r));if(o==null)throw new pi(`Could not walk \
path to ${t}`);n=o.cid,s=o.name,t=o.path}else if(ci.asCID(t)===t||t instanceof ci)n=t,s=t=n.toString();else throw new Ho(
"Path must be string or CID");const i=BM[n.code];if(i==null)throw new Ma(`No resolver for code ${n.code}`);return i(n,s,
t,e,r)}function ah(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Hb(t);if(t instanceof ArrayBuffer)
return new Uint8Array(t);if(ArrayBuffer.isView(t))return Hb(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error(
"Unknown type, must be binary type")}function LM(t){const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}const Wb=4096;function DM(t){const e=t.length;if(e<=Wb)return String.fromCharCode.apply(String,t);let r="",n=0;
for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Wb));return r}function $M(t){return t?.buffer instanceof ArrayBuffer}
function Hb(t){return $M(t)?t:t.slice()}function NM(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,f=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(u){if(u instanceof
Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.
from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,E=0,
k=0,A=u.length;k!==A&&u[k]===0;)k++,y++;for(var S=(A-k)*p+1>>>0,v=new Uint8Array(S);k!==A;){for(var w=u[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var T=S-
E;T!==S&&v[T]===0;)T++;for(var P=f.repeat(y);T<S;++T)P+=t.charAt(v[T]);return P}function b(u){if(typeof u!="string")throw new TypeError(
"Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var E=0,k=0;u[y]===f;)E++,y++;for(var A=(u.
length-y)*h+1>>>0,S=new Uint8Array(A);u[y];){var v=n[u.charCodeAt(y)];if(v===255)return;for(var w=0,I=A-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(u[y]!==" "){
for(var C=A-k;C!==A&&S[C]===0;)C++;for(var T=new Uint8Array(E+(A-C)),P=E;C!==A;)T[P++]=S[C++];return T}}}function g(u){var y=b(
u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var PM=NM,OM=PM;let UM=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},FM=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return m1(this,e)}},
zM=class{decoders;constructor(e){this.decoders=e}or(e){return m1(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function m1(t,e){return new zM({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let qM=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new UM(e,r,n),this.decoder=new FM(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Rd({name:t,prefix:e,encode:r,decode:n}){return new qM(t,e,r,
n)}function Ja({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=OM(r,t,n);return Rd({prefix:e,
name:t,encode:s,decode:o=>ah(i(o))})}function jM(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function GM(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function WM(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function tr({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=WM(n,s);return Rd(
{prefix:e,name:t,encode(o){return GM(o,n,r)},decode(o){return jM(o,i,r,t)}})}const HM=Ja({prefix:"9",name:"base10",alphabet:"\
0123456789"}),VM=Object.freeze(Object.defineProperty({__proto__:null,base10:HM},Symbol.toStringTag,{value:"Module"})),KM=tr(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),QM=tr({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),JM=Object.freeze(Object.defineProperty({__proto__:null,
base16:KM,base16upper:QM},Symbol.toStringTag,{value:"Module"})),YM=tr({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
XM=Object.freeze(Object.defineProperty({__proto__:null,base2:YM},Symbol.toStringTag,{value:"Module"})),g1=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),ZM=g1.reduce((t,e,r)=>(t[r]=e,t),[]),eB=g1.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function tB(t){return t.reduce((e,r)=>(e+=ZM[r],e),"")}function rB(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=eB[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const nB=Rd({prefix:"🚀",name:"\
base256emoji",encode:tB,decode:rB}),sB=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:nB},Symbol.toStringTag,
{value:"Module"})),iB=tr({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
oB=tr({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),aB=tr(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),cB=tr({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),lB=tr({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),dB=tr({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),uB=tr({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),fB=tr({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),hB=tr({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),pB=Object.freeze(Object.defineProperty({__proto__:null,
base32:iB,base32hex:lB,base32hexpad:uB,base32hexpadupper:fB,base32hexupper:dB,base32pad:aB,base32padupper:cB,base32upper:oB,
base32z:hB},Symbol.toStringTag,{value:"Module"})),mB=Ja({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),gB=Ja({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
bB=Object.freeze(Object.defineProperty({__proto__:null,base36:mB,base36upper:gB},Symbol.toStringTag,{value:"Module"})),yB=Ja(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),wB=Ja({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),vB=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:yB,base58flickr:wB},Symbol.toStringTag,{value:"Module"})),EB=tr({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),kB=tr({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),xB=tr({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),SB=tr({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),AB=Object.freeze(Object.defineProperty(
{__proto__:null,base64:EB,base64pad:kB,base64url:xB,base64urlpad:SB},Symbol.toStringTag,{value:"Module"})),IB=tr({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),_B=Object.freeze(Object.defineProperty({__proto__:null,base8:IB},Symbol.
toStringTag,{value:"Module"})),CB=Rd({prefix:"\0",name:"identity",encode:t=>DM(ah(t)),decode:t=>ah(LM(t))}),TB=Object.freeze(
Object.defineProperty({__proto__:null,identity:CB},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Vb={...TB,...XM,..._B,...VM,...JM,...pB,...bB,...vB,...AB,...sB};function RB(t=0){return new Uint8Array(t)}function b1(t,e,r,n){
return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const Kb=b1("utf8","u",t=>"u"+new TextDecoder(
"utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),_u=b1("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)
e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=RB(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}),y1={utf8:Kb,"utf-8":Kb,hex:Vb.base16,latin1:_u,ascii:_u,binary:_u,...Vb};function MB(t,e="utf8"){const r=y1[e];
if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}function BB(t,e="ut\
f8"){const r=y1[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(t).substring(1)}const jn="\
/",w1=new TextEncoder().encode(jn),pc=w1[0];class Fr{_buf;constructor(e,r){if(typeof e=="string")this._buf=MB(e);else if(e instanceof
Uint8Array)this._buf=e;else throw new Error("Invalid key, should be String of Uint8Array");if(r==null&&(r=!0),r&&this.clean(),
this._buf.byteLength===0||this._buf[0]!==pc)throw new Error("Invalid key")}toString(e="utf8"){return BB(this._buf,e)}uint8Array(){
return this._buf}get[Symbol.toStringTag](){return`Key(${this.toString()})`}static withNamespaces(e){return new Fr(e.join(
jn))}static random(){return new Fr(Math.random().toString().substring(2))}static asKey(e){return e instanceof Uint8Array||
typeof e=="string"?new Fr(e):typeof e.uint8Array=="function"?new Fr(e.uint8Array()):null}clean(){if((this._buf==null||this.
_buf.byteLength===0)&&(this._buf=w1),this._buf[0]!==pc){const e=new Uint8Array(this._buf.byteLength+1);e.fill(pc,0,1),e.
set(this._buf,1),this._buf=e}for(;this._buf.byteLength>1&&this._buf[this._buf.byteLength-1]===pc;)this._buf=this._buf.subarray(
0,-1)}less(e){const r=this.list(),n=e.list();for(let s=0;s<r.length;s++){if(n.length<s+1)return!1;const i=r[s],o=n[s];if(i<
o)return!0;if(i>o)return!1}return r.length<n.length}reverse(){return Fr.withNamespaces(this.list().slice().reverse())}namespaces(){
return this.list()}baseNamespace(){const e=this.namespaces();return e[e.length-1]}list(){return this.toString().split(jn).
slice(1)}type(){return LB(this.baseNamespace())}name(){return DB(this.baseNamespace())}instance(e){return new Fr(this.toString()+
":"+e)}path(){let e=this.parent().toString();return e.endsWith(jn)||(e+=jn),e+=this.type(),new Fr(e)}parent(){const e=this.
list();return e.length===1?new Fr(jn):new Fr(e.slice(0,-1).join(jn))}child(e){return this.toString()===jn?e:e.toString()===
jn?this:new Fr(this.toString()+e.toString(),!1)}isAncestorOf(e){return e.toString()===this.toString()?!1:e.toString().startsWith(
this.toString())}isDecendantOf(e){return e.toString()===this.toString()?!1:this.toString().startsWith(e.toString())}isTopLevel(){
return this.list().length===1}concat(...e){return Fr.withNamespaces([...this.namespaces(),...$B(e.map(r=>r.namespaces()))])}}
function LB(t){const e=t.split(":");return e.length<2?"":e.slice(0,-1).join(":")}function DB(t){const e=t.split(":");return e[e.
length-1]}function $B(t){return[].concat(...t)}const NB="peercompute-ipfs-artifacts-v1-",ch=["blocks","roots","routing"],
v1=t=>t instanceof Uint8Array?t.byteLength:new TextEncoder().encode(JSON.stringify(t)).byteLength,Cu=t=>t===void 0?void 0:
structuredClone(t),jc=()=>({bytes:0,entries:0,generation:0});function E1(t,e,r,{maximumBytes:n=Number.MAX_SAFE_INTEGER,maximumEntries:s=Number.
MAX_SAFE_INTEGER}={}){const i={bytes:t.bytes-(e?.size||0)+r,entries:t.entries+(e?0:1),generation:(t.generation||0)+1};if(Object.
values(i).some(o=>!Number.isSafeInteger(o)||o<0))throw new RangeError("Artifact storage accounting exceeds safe integer \
range.");if(i.bytes>n||i.entries>s)throw new DOMException("Artifact storage quota exceeded.","QuotaExceededError");return i}
class PB{constructor({name:e="memory"}={}){this.name=e,this.data=new Map(ch.map(r=>[r,new Map])),this.usage=new Map(ch.map(
r=>[r,jc()]))}async open(){}async close(){}async get(e,r){return Cu(this.data.get(e).get(r)?.value)}async getUsage(e){return{
...this.usage.get(e)}}async put(e,r,n,s){const i=this.data.get(e),o=i.get(r);if(e==="blocks"&&o)return!1;const a=v1(n),c=E1(
this.usage.get(e),o,a,s);return i.set(r,{value:Cu(n),size:a,generation:c.generation}),this.usage.set(e,c),!0}async delete(e,r){
const n=this.data.get(e),s=n.get(r);if(!s)return!1;const i=this.usage.get(e);return this.usage.set(e,{...i,bytes:i.bytes-
s.size,entries:i.entries-1}),n.delete(r),!0}async scan(e,{after:r,limit:n=16,keysOnly:s=!1}={}){return[...this.data.get(
e).keys()].sort().filter(i=>r===void 0||i>r).slice(0,n).map(i=>({key:i,generation:this.data.get(e).get(i).generation,...s?
{}:{value:Cu(this.data.get(e).get(i).value)}}))}}function An(t){return new Promise((e,r)=>{t.onsuccess=()=>e(t.result),t.
onerror=()=>r(t.error)})}class OB{constructor({name:e="default",indexedDBImpl:r=globalThis.indexedDB,keyRange:n=globalThis.
IDBKeyRange}={}){this.name=`${NB}${e}`,this.indexedDB=r,this.keyRange=n,this.database=null,this.opening=null}async open(){
if(!this.database){if(this.opening)return this.opening;if(!this.indexedDB?.open||!this.keyRange)throw new Error("Persist\
ent artifacts require IndexedDB and IDBKeyRange.");this.opening=new Promise((e,r)=>{const n=this.indexedDB.open(this.name,
1);let s=!1;n.onupgradeneeded=()=>{for(const i of[...ch,"usage"])n.result.createObjectStore(i)},n.onerror=()=>r(n.error),
n.onblocked=()=>{s=!0,r(new Error("Artifact database open blocked by another context."))},n.onsuccess=()=>{if(s){n.result.
close();return}this.database=n.result,this.database.onversionchange=()=>{this.database?.close(),this.database=null},e()}});
try{await this.opening}finally{this.opening=null}}}async close(){await this.opening,this.database?.close(),this.database=
null}async _transaction(e,r,n){if(!this.database)throw new Error("Artifact database is closed.");const s=this.database.transaction(
e,r),i=new Promise((o,a)=>{s.oncomplete=o,s.onabort=()=>a(s.error||new Error("Artifact transaction aborted.")),s.onerror=
()=>{}});try{const o=await n(s);return await i,o}catch(o){try{s.abort()}catch{}throw await i.catch(()=>{}),o}}async get(e,r){
return this._transaction([e],"readonly",async n=>(await An(n.objectStore(e).get(r)))?.value)}async getUsage(e){return this.
_transaction(["usage"],"readonly",async r=>await An(r.objectStore("usage").get(e))||jc())}async put(e,r,n,s){return this.
_transaction([e,"usage"],"readwrite",async i=>{const o=i.objectStore(e),a=i.objectStore("usage"),[c,l]=await Promise.all(
[An(o.get(r)),An(a.get(e))]);if(e==="blocks"&&c)return!1;const d=v1(n),f=E1(l||jc(),c,d,s);return await Promise.all([An(
o.put({value:n,size:d,generation:f.generation},r)),An(a.put(f,e))]),!0})}async delete(e,r){return this._transaction([e,"\
usage"],"readwrite",async n=>{const s=n.objectStore(e),i=n.objectStore("usage"),[o,a]=await Promise.all([An(s.get(r)),An(
i.get(e))]);if(!o)return!1;const c=a||jc();return await Promise.all([An(s.delete(r)),An(i.put({...c,bytes:c.bytes-o.size,
entries:c.entries-1},e))]),!0})}async scan(e,{after:r,limit:n=16,keysOnly:s=!1}={}){return this._transaction([e],"readon\
ly",i=>new Promise((o,a)=>{const c=i.objectStore(e),l=r===void 0?void 0:this.keyRange.lowerBound(r,!0),d=c.openCursor(l),
f=[];d.onerror=()=>a(d.error),d.onsuccess=()=>{const h=d.result;if(!h||f.length>=n){o(f);return}f.push({key:h.key,generation:h.
value.generation,...s?{}:{value:h.value.value}}),f.length>=n?o(f):h.continue()}}))}}const Tu=new Map;function rt(t){if(t?.
aborted)throw t.reason||new DOMException("Aborted","AbortError")}async function Ao(t,e,r,n){if(rt(r),n)return new Promise(
(i,o)=>{n.request(t,{mode:e,...r?{signal:r}:{}},async()=>{await new Promise(a=>i(a))}).catch(o)});let s=Tu.get(t);return s||
(s={readers:0,writer:!1,queue:[]},Tu.set(t,s)),new Promise((i,o)=>{const a=()=>{for(;s.queue.length&&!s.writer;){const l=s.
queue[0];if(l.mode==="exclusive"&&s.readers)break;s.queue.shift(),l.signal?.removeEventListener("abort",l.abort),l.mode===
"exclusive"?s.writer=!0:s.readers++;let d=!1;if(l.resolve(()=>{d||(d=!0,l.mode==="exclusive"?s.writer=!1:s.readers--,a(),
!s.writer&&!s.readers&&!s.queue.length&&Tu.delete(t))}),l.mode==="exclusive")break}},c={mode:e,signal:r,resolve:i,abort:()=>{
const l=s.queue.indexOf(c);l>=0&&s.queue.splice(l,1),o(r.reason||new DOMException("Aborted","AbortError")),a()}};r?.addEventListener(
"abort",c.abort,{once:!0}),s.queue.push(c),a()})}const k1="peercompute.artifact.manifest.v1",ti=256*1024,x1=16*1024**3,Pl=new TextEncoder;
function Ze(t){const e=Qi.asCID(t)||Qi.parse(String(t));if(![85,112].includes(e.code)||e.multihash.code!==18||e.multihash.
digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return e.toV1()}function Gc(t,e=0,r={
remaining:ti}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((r.remaining-=2)<0)throw new RangeError(
"Manifest exceeds byte limit.");if(typeof t=="string"){if(t.length>r.remaining||(r.remaining-=Pl.encode(t).length)<0)throw new RangeError(
"Manifest exceeds byte limit.");return t}if(t===null||typeof t=="boolean"||typeof t=="number"&&Number.isFinite(t))return t;
if(Array.isArray(t)){if(t.length>4096)throw new RangeError("Manifest array exceeds item limit.");return t.map(s=>Gc(s,e+
1,r))}if(!t||typeof t!="object"||Object.getPrototypeOf(t)!==Object.prototype)throw new TypeError("Manifest values must b\
e JSON values.");const n=Object.keys(t);if(n.length>1024)throw new RangeError("Manifest object exceeds key limit.");return Object.
fromEntries(n.sort().map(s=>(Gc(s,e+1,r),[s,Gc(t[s],e+1,r)])))}function as(t,{maximumBytes:e=ti,maximumFiles:r=1024,maximumFileBytes:n=x1}={}){
if(!t||t.schema!==k1||!Array.isArray(t.files)||t.files.length===0||t.files.length>r)throw new TypeError("Manifest requir\
es the supported schema and a bounded, nonempty files array.");const s=new Set(["schema","name","description","files","m\
odel","provenance"]);if(Object.keys(t).some(c=>!s.has(c)))throw new TypeError("Unsupported manifest field.");for(const c of[
"name","description"])if(t[c]!==void 0&&typeof t[c]!="string")throw new TypeError(`Manifest ${c} must be a string.`);if(t.
model!==void 0&&(!t.model||typeof t.model!="object"||Array.isArray(t.model)))throw new TypeError("Manifest model extensi\
on must be an object.");const i=new Set,o=t.files.map(c=>{if(!c||typeof c!="object")throw new TypeError("Invalid manifes\
t file.");if(Object.keys(c).some(f=>!["path","cid","size","sha256","mediaType"].includes(f)))throw new TypeError("Unsupp\
orted manifest file field.");const{path:l,size:d}=c;if(typeof l!="string"||!l||Pl.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(l)||l.split("/").some(f=>!f||f==="."||f==="..")||i.has(l))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(d)||d<0||d>n)throw new RangeError("Invalid \
file size.");if(c.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(c.sha256))throw new TypeError("Invalid SHA-256.");if(c.mediaType!==
void 0&&(typeof c.mediaType!="string"||c.mediaType.length>256))throw new TypeError("Invalid media type.");return i.add(l),
{...c,cid:Ze(c.cid).toString()}}).sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),a=Gc({...t,files:o},0,{remaining:e});if(Pl.
encode(JSON.stringify(a)).byteLength>e)throw new RangeError("Manifest exceeds byte limit.");return a}function Qb(t,e){return Pl.
encode(JSON.stringify(as(t,e)))}function lh(t,e={}){if(t.byteLength>(e.maximumBytes??ti))throw new RangeError("Manifest \
exceeds byte limit.");return as(JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(t)),e)}const Io=Object.freeze({name:"\
peercompute.unixfs.v1",cidVersion:1,hash:"sha2-256",rawLeaves:!0,chunkSize:256*1024,maxChildrenPerNode:174,layout:"balan\
ced",reduceSingleLeafToSelf:!0}),Ru=t=>Array.from(t,e=>e.toString(16).padStart(2,"0")).join(""),_o=Symbol("artifact-impo\
rt-retention"),Kp=Symbol("verified-artifact-damage");function Er(t,e,r=1){if(!Number.isSafeInteger(t)||t<r)throw new RangeError(
`Invalid ${e}.`);return t}function Mu(t){const e=new Error(`Artifact block not found: ${t}`);return e.name="NotFoundErro\
r",e.code="ERR_NOT_FOUND",e[Kp]=!0,e}const kr=t=>Object.assign(new Error(t),{code:"ERR_ARTIFACT_INTEGRITY",[Kp]:!0}),Jb=t=>t?.[Kp]===
!0;function Ol(t,e){return e?(e.aborted&&(Promise.resolve(t).catch(()=>{}),rt(e)),new Promise((r,n)=>{const s=()=>n(e.reason||
new DOMException("Aborted","AbortError"));e.addEventListener("abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.
removeEventListener("abort",s))})):t}async function*Yb(t,e){if(t instanceof Uint8Array){yield t;return}if(t?.getReader){
const r=t.getReader();let n=!1;try{for(;;){const s=await Ol(r.read(),e);if(s.done){n=!0;return}yield s.value}}finally{n||
r.cancel().catch(()=>{}),r.releaseLock()}return}if(t?.[Symbol.asyncIterator]||t?.[Symbol.iterator]){const r=t[Symbol.asyncIterator]?.()||
t[Symbol.iterator]();let n=!1;try{for(;;){const s=await Ol(r.next(),e);if(s.done){n=!0;return}yield s.value}}finally{n||
Promise.resolve(r.return?.()).catch(()=>{})}return}throw new TypeError("Artifact source must be bytes or a byte stream.")}
class UB{constructor({name:e="default",persistent:r=!0,backend:n,ownsBackend:s=n===void 0,capacity:i="bounded",maximumBytes:o=i===
"browser"?Number.MAX_SAFE_INTEGER:2*1024**3,maximumBlockBytes:a=2*1024**2,maximumFileBytes:c=x1,maximumTraversalBlocks:l=65536,
maximumStoredBlocks:d=i==="browser"?Number.MAX_SAFE_INTEGER:l,maximumRoots:f=i==="browser"?Number.MAX_SAFE_INTEGER:1024,
maximumRoutingBytes:h=16*1024**2,maximumConcurrentBlockWrites:p=4,maximumQueuedBlockWrites:m=16,lockManager:b=globalThis.
navigator?.locks,onDestroy:g,indexedDBImpl:u,keyRange:y}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/u.test(e))throw new TypeError(
"Invalid artifact store name.");if(!["bounded","browser"].includes(i))throw new TypeError("Invalid artifact storage capa\
city policy.");this.capacity=i,this.name=e,this.persistent=r,this.backend=n||(r?new OB({name:e,indexedDBImpl:u,keyRange:y}):
new PB({name:e})),this.ownsBackend=s,this.maximumBytes=Er(o,"maximumBytes"),this.maximumBlockBytes=Er(a,"maximumBlockByt\
es"),this.maximumFileBytes=Er(c,"maximumFileBytes"),this.maximumTraversalBlocks=Er(l,"maximumTraversalBlocks"),this.maximumStoredBlocks=
Er(d,"maximumStoredBlocks"),this.maximumRoots=Er(f,"maximumRoots"),this.maximumRoutingBytes=Er(h,"maximumRoutingBytes"),
this.maximumConcurrentBlockWrites=Er(p,"maximumConcurrentBlockWrites"),this.maximumQueuedBlockWrites=Er(m,"maximumQueued\
BlockWrites",0),this.activeBlockWrites=0,this.waitingBlockWrites=[],this.lockManager=b,this.lockName=`peercompute-artifa\
cts:${this.backend.name||e}`,this.onDestroy=g,this.controller=new AbortController,this.operations=new Set,this.isOpen=!1,
this.destroyed=!1,this.usage={bytes:0,entries:0},this.rootUsage={bytes:0,entries:0},this.blockstore=this._createBlockstore(),
this.datastore=this._createDatastore()}async open(){if(this.destroyed)throw new Error("Artifact store is destroyed.");if(this.
opening)return this.opening;if(!this.isOpen){this.opening=(async()=>{if(this.persistent&&!this.lockManager?.request&&!this.
backend.supportsExclusiveAccess)throw new Error("Persistent artifact storage requires Web Locks for cross-context GC saf\
ety.");if(await this.backend.open(),this.persistent&&!this.lockManager?.request&&!this.backend.hasExclusiveLock)throw new Error(
"Persistent artifact backend did not acquire its exclusive storage lock.");this.usage=await this.backend.getUsage("block\
s"),this.rootUsage=await this.backend.getUsage("roots"),this.isOpen=!0})();try{await this.opening}finally{this.opening=null}}}async _begin(e,r="\
shared"){if(this.destroyed)throw new Error("Artifact store is destroyed.");const n=e?AbortSignal.any([e,this.controller.
signal]):this.controller.signal;rt(n),await this.open();const s=r==="none"?()=>{}:await Ao(`${this.lockName}:gc`,r,n,this.
lockManager);try{rt(n)}catch(l){throw s(),l}let i;const a={settled:new Promise(l=>{i=l}),paused:!1,finish:()=>{n.removeEventListener(
"abort",c),s(),this.operations.delete(a),i()}},c=()=>{a.paused&&a.finish()};return n.addEventListener("abort",c,{once:!0}),
this.operations.add(a),{signal:n,finish:a.finish,pause:()=>{a.paused=!0,n.aborted&&a.finish()},resume:()=>{a.paused=!1,rt(
n)}}}async _run(e,r,n,s){if(s&&(s.store!==this||!s.held||n==="exclusive"))throw new Error("Artifact retention scope is n\
o longer active.");const i=s?AbortSignal.any([s.signal,...e?[e]:[]]):e,o=await this._begin(i,s?"none":n);try{const a=await r(
o.signal);return rt(o.signal),a}finally{o.finish()}}async _writeRoot(e,r,n){const s=await Ao(`${this.lockName}:roots`,"e\
xclusive",n,this.lockManager);try{rt(n);const i=await this.backend.get("roots",e),o=r(i);return rt(n),o===void 0?void 0:
(await this.backend.put("roots",e,o,{maximumEntries:this.maximumRoots,maximumBytes:Math.min(Number.MAX_SAFE_INTEGER,this.
maximumRoots*(ti+2048))}),this.rootUsage=await this.backend.getUsage("roots"),structuredClone(o))}finally{s()}}async _readBlock(e,r){
rt(r);const n=Ze(e),s=await this.backend.get("blocks",n.toString());if(!s)throw Mu(n);return await this._verifyBlock(n,s),
rt(r),s}async _verifyBlock(e,r){if(!(r instanceof Uint8Array)||r.byteLength>this.maximumBlockBytes)throw new RangeError(
"Artifact block exceeds byte limit.");const n=await cg.digest(r);if(!Qi.createV1(e.code,n).equals(e))throw kr("Artifact \
block CID verification failed.")}async _blockWritePermit(e){if(rt(e),this.activeBlockWrites>=this.maximumConcurrentBlockWrites){
if(this.waitingBlockWrites.length>=this.maximumQueuedBlockWrites)throw new Error("Artifact block write queue is full.");
await new Promise((r,n)=>{const s={resolve:r,signal:e,abort:()=>{const i=this.waitingBlockWrites.indexOf(s);i>=0&&this.waitingBlockWrites.
splice(i,1),n(e.reason||new DOMException("Aborted","AbortError"))}};e?.addEventListener("abort",s.abort,{once:!0}),this.
waitingBlockWrites.push(s)})}else this.activeBlockWrites++;return()=>{const r=this.waitingBlockWrites.shift();r?(r.signal?.
removeEventListener("abort",r.abort),r.resolve()):this.activeBlockWrites--}}async _putBlock(e,r,n){const s=await this._blockWritePermit(
n);try{return await this._persistBlock(e,r,n)}finally{s()}}async _persistBlock(e,r,n){rt(n);const s=Ze(e),i=r instanceof
Uint8Array?null:new Uint8Array(this.maximumBlockBytes);let o=0,a;for await(const c of Yb(r,n)){if(rt(n),!(c instanceof Uint8Array))
throw new TypeError("Artifact streams require Uint8Array chunks.");if(o+=c.byteLength,o>this.maximumBlockBytes)throw new RangeError(
"Artifact block exceeds byte limit.");i?i.set(c,o-c.byteLength):a=c.slice()}return a=i?i.slice(0,o):a,await this._verifyBlock(
s,a),rt(n),await this.backend.put("blocks",s.toString(),a,{maximumBytes:this.maximumBytes,maximumEntries:this.maximumStoredBlocks}),
this.usage=await this.backend.getUsage("blocks"),s}_localBlocks(e){const r=this;return{async*get(n){yield await r._readBlock(
n,e)},put:(n,s)=>r._putBlock(n,s,e)}}async importFile(e,{signal:r,expectedSize:n,expectedSha256:s,pin:i=!0,[_o]:o}={}){if(n!==
void 0&&Er(n,"expectedSize",0),n>this.maximumFileBytes)throw new RangeError("File exceeds byte limit.");if(s!==void 0&&!/^[a-f0-9]{64}$/u.
test(s))throw new TypeError("Invalid expected SHA-256.");return this._run(r,async a=>{const c=ka.create();let l=0;const d=this;
async function*f(){for await(const b of Yb(e,a)){if(rt(a),!(b instanceof Uint8Array))throw new TypeError("Artifact strea\
ms require Uint8Array chunks.");if(l+=b.byteLength,l>d.maximumFileBytes||n!==void 0&&l>n)throw new RangeError("File exce\
eds declared byte limit.");for(let g=0;g<b.byteLength;g+=Io.chunkSize){const u=b.subarray(g,g+Io.chunkSize);c.update(u),
yield u}}}const h=await J3(f(),this._localBlocks(a),{cidVersion:1,rawLeaves:!0,reduceSingleLeafToSelf:!0,wrapWithDirectory:!1,
chunker:V0({chunkSize:Io.chunkSize}),layout:fv({maxChildrenPerNode:Io.maxChildrenPerNode}),fileImportConcurrency:1,blockWriteConcurrency:1}),
p=Ru(c.digest());if(n!==void 0&&n!==l)throw new Error("File size does not match expected size.");if(s!==void 0&&s!==p)throw new Error(
"File SHA-256 does not match expected digest.");const m=h.cid.toV1().toString();return this._writeRoot(m,b=>({cid:m,kind:"\
file",size:l,sha256:p,status:"complete",pinned:!!(i||b?.pinned),retain:!1,profile:Io.name}),a)},void 0,o)}async importManifest(e,{
signal:r,pin:n=!0,[_o]:s}={}){const i=as(e,{maximumFileBytes:this.maximumFileBytes}),o=Qb(i);return this._run(r,async a=>{
for(const l of i.files)await this._recordVerifiedFile(l,a);const c=Qi.createV1(85,await cg.digest(o));return await this.
_putBlock(c,o,a),this._writeRoot(c.toString(),l=>({cid:c.toString(),kind:"manifest",size:o.byteLength,manifest:i,status:"\
complete",pinned:!!(n||l?.pinned),retain:!1}),a)},void 0,s)}async _verifyFile(e,r={},n,s){const i=await Gb(Ze(e).toString(),
this._localBlocks(n));if(!["file","raw"].includes(i.type))throw kr("Artifact root must identify a file.");const o=Number(
i.type==="raw"?i.node.byteLength:i.unixfs.fileSize());if(!Number.isSafeInteger(o)||o>this.maximumFileBytes)throw new RangeError(
"Artifact file exceeds its size limit.");if(r.size!==void 0&&o!==r.size)throw kr("Artifact file size differs from its ma\
nifest.");const a=ka.create();let c=0;for await(const d of this._fileChunks(e,{size:o,signal:n})){if(rt(n),c+=d.byteLength,
c>o)throw kr("Artifact content exceeds declared size.");a.update(d),s?.(d.byteLength)}const l=Ru(a.digest());if(c!==o||r.
sha256!==void 0&&l!==r.sha256)throw kr("Artifact file integrity differs from its manifest.");return{size:o,sha256:l}}async*_fileChunks(e,{
size:r,offset:n=0,length:s=r-n,signal:i}){const o=n+s,a=[{cid:Ze(e),start:0,size:r,depth:0}];let c=0,l=0;for(;a.length;){
rt(i);const d=a.pop();if(++c>this.maximumTraversalBlocks||d.depth>64)throw new RangeError("Artifact file traversal excee\
ds its bounds.");const f=await this._readBlock(d.cid,i);if(d.cid.code===85){if(f.byteLength!==d.size)throw kr("Raw file \
block size differs from its UnixFS link.");const y=f.subarray(Math.max(0,n-d.start),Math.min(f.length,o-d.start));y.length&&
(l+=y.length,yield y);continue}const h=Sa(f);if(!h.Data)throw kr("UnixFS file node has no metadata.");const p=Lr.unmarshal(
h.Data),m=Ia.decode(f).data?.fileSize;if(!["file","raw"].includes(p.type)||h.Links.length!==p.blockSizes.length||Number(
p.fileSize())!==d.size||m!==void 0&&m!==BigInt(d.size))throw kr("UnixFS file metadata is inconsistent.");const b=p.data||
new Uint8Array;let g=d.start+b.length;const u=[];for(let y=0;y<h.Links.length;y++){const E=Number(p.blockSizes[y]);if(!Number.
isSafeInteger(E)||E<0)throw kr("Invalid UnixFS child size.");const k=Ze(h.Links[y].Hash),A=h.Links[y].Tsize;if(A!==void 0&&
(!Number.isSafeInteger(A)||A<E||k.code===85&&A!==E))throw kr("Invalid UnixFS link DAG size.");if(g<o&&g+E>n&&u.push({cid:k,
start:g,size:E,depth:d.depth+1}),g+=E,!Number.isSafeInteger(g))throw kr("Invalid UnixFS file extent.")}if(g!==d.start+d.
size)throw kr("UnixFS child sizes differ from their parent.");if(a.length+u.length>this.maximumTraversalBlocks)throw new RangeError(
"UnixFS pending traversal exceeds limit.");for(let y=u.length-1;y>=0;y--)a.push(u[y]);if(b.length&&d.start<o&&d.start+b.
length>n){const y=b.subarray(Math.max(0,n-d.start),Math.min(b.length,o-d.start));l+=y.length,yield y}}if(l!==s)throw kr(
"UnixFS read did not produce the requested number of bytes.")}async _recordVerifiedFile(e,r,n){const s=await this._verifyFile(
e.cid,e,r,n);return this._writeRoot(e.cid,i=>({...i,cid:e.cid,kind:"file",...s,status:"complete",pinned:!!i?.pinned,retain:!1}),
r)}async*_walk(e,{signal:r,fetchBlock:n,allowMissing:s=!1,onMissing:i}={}){const o=e.map(c=>Ze(c)),a=new Set;for(;o.length;){
rt(r);const c=o.pop(),l=c.toString();if(a.has(l))continue;if(a.size>=this.maximumTraversalBlocks)throw new RangeError("A\
rtifact DAG traversal exceeds block limit.");a.add(l);let d;try{d=await this._readBlock(c,r)}catch(f){if(f.code!=="ERR_N\
OT_FOUND")throw f;if(i?.(f),n)await this._putBlock(c,await Ol(n(c,{signal:r}),r),r),d=await this._readBlock(c,r);else{if(s)
continue;throw f}}if(yield l,c.code===ja){const f=Sa(d).Links;if(o.length+f.length>this.maximumTraversalBlocks)throw new RangeError(
"Artifact DAG links exceed limit.");for(const h of f)o.push(Ze(h.Hash))}}}async _invalidateRoot(e,r){Jb(r)&&await this._writeRoot(
e,n=>!n||n.status==="deleting"?void 0:{...n,cid:e,kind:n.kind||"file",status:"partial",pinned:!!n.pinned,retain:!0})}async _checkRootIdentity(e,r,n){
const s=await this._readBlock(e,n);if(r.kind==="manifest"){let i;try{i=Qb(r.manifest)}catch{throw kr("Artifact manifest \
metadata is invalid.")}if(i.length!==s.length||i.some((o,a)=>o!==s[a]))throw kr("Artifact manifest metadata differs from\
 its verified root.")}return s}async _withRootVerification(e,r,n){return this._run(r,async s=>{const i=await Ao(`${this.
lockName}:verify:${e}`,"exclusive",s,this.lockManager);try{return await n(s)}finally{i()}})}async ensureLocal(e,{signal:r,
fetchBlock:n,pin:s=!0,kind:i,onProgress:o}={}){const a=Ze(e).toString();if(o!==void 0&&typeof o!="function")throw new TypeError(
"Artifact progress must be a function.");return this._withRootVerification(a,r,c=>this._ensureLocal(a,{signal:c,fetchBlock:n,
pin:s,kind:i,onProgress:o}))}async _ensureLocal(e,{signal:r,fetchBlock:n,pin:s,kind:i,onProgress:o}){const a=await this.
backend.get("roots",e);if(a?.status==="deleting")throw new Error("Artifact deletion is pending; finish deletion before i\
mporting this root.");let c=0,l=a?.size||0,d=0,f=1,h=null,p=-1/0;const m=(y=!1)=>{const E=performance.now();if(o&&(y||E-
p>=100)){p=E;try{Promise.resolve(o({stage:"verify",path:h,loaded:c,totalBytes:l,completedFiles:d,totalFiles:f})).catch(()=>{})}catch{}}
rt(r)},b=y=>{c+=y,m()};let g;const u=y=>{Jb(y)&&(g=y)};try{if(a?.status!=="complete"&&await this._writeRoot(e,S=>({...S,
cid:e,kind:i||S?.kind||"file",status:"partial",pinned:!!S?.pinned,retain:!0}),r),n)for await(const S of this._walk([e],{
signal:r,fetchBlock:n,onMissing:u}));let y;const E=Ze(e).code===85?await this._readBlock(e,r):null;if(E&&E.byteLength<=ti){
let S;try{S=JSON.parse(new TextDecoder().decode(E))}catch{}(S?.schema===k1||i==="manifest")&&(y=lh(E,{maximumFileBytes:this.
maximumFileBytes}))}if(i==="manifest"&&!y)throw new TypeError("Manifest must be a bounded canonical JSON raw block.");if(y){
if(a?.status!=="complete"&&await this._writeRoot(e,S=>({...S,kind:"manifest",manifest:y,retain:!0}),r),l=y.files.reduce(
(S,v)=>S+v.size,0),f=y.files.length,!Number.isSafeInteger(l))throw new RangeError("Artifact verification byte count exce\
eds safe bounds.");m(!0);for(const S of y.files){if(h=S.path,n)for await(const v of this._walk([S.cid],{signal:r,fetchBlock:n,
onMissing:u}));await this._recordVerifiedFile(S,r,b),d++,m(!0)}}const k=y?{size:E.byteLength,manifest:y}:await this._verifyFile(
e,{},r,b),A=await this._writeRoot(e,S=>({cid:e,kind:y?"manifest":"file",...k,status:"complete",pinned:!!(s||S?.pinned),retain:!1}),
r);return g=void 0,l=c,d=f,h=null,m(!0),A}catch(y){throw await this._invalidateRoot(e,g||y),y}}async stat(e,{signal:r,[_o]:n}={}){
const s=Ze(e).toString();return this._run(r,()=>this.backend.get("roots",s),void 0,n)}async getManifest(e,{signal:r,[_o]:n}={}){
const s=Ze(e).toString();return this._run(r,async i=>lh(await this._readBlock(s,i),{maximumFileBytes:this.maximumFileBytes}),
void 0,n)}async*openRead(e,{offset:r=0,length:n,signal:s}={}){Er(r,"offset",0),n!==void 0&&Er(n,"length",0);const i=await this.
_begin(s);try{const o=await Gb(Ze(e).toString(),this._localBlocks(i.signal));if(!["file","raw"].includes(o.type))throw new TypeError(
"Artifact root must identify a file.");const a=Number(o.type==="raw"?o.node.byteLength:o.unixfs.fileSize());if(a>this.maximumFileBytes||
r>a||n!==void 0&&n>a-r)throw new RangeError("Artifact range exceeds file size.");if(n===0||r===a)return;for await(const c of this.
_fileChunks(e,{size:a,offset:r,length:n,signal:i.signal}))rt(i.signal),i.pause(),yield c,i.resume()}finally{i.finish()}}async pin(e,{
signal:r}={}){const n=Ze(e).toString();return this._withRootVerification(n,r,async s=>{const i=await this.backend.get("r\
oots",n);if(i?.status!=="complete"||!i.pinned&&!i.retain)return this._ensureLocal(n,{signal:s,pin:!0});try{return await this.
_checkRootIdentity(n,i,s),i.pinned?structuredClone(i):this._writeRoot(n,o=>({...o,pinned:!0}),s)}catch(o){throw await this.
_invalidateRoot(n,o),o}})}async unpin(e,{signal:r}={}){const n=Ze(e).toString();return this._run(r,s=>this._writeRoot(n,
i=>{if(!i)throw Mu(n);return{...i,pinned:!1,retain:!1}},s))}async withRetention(e,{signal:r}={}){if(typeof e!="function")
throw new TypeError("Artifact retention requires a callback.");const n=await this._begin(r),s={store:this,signal:n.signal,
held:!0,accepting:!0},i=new Set,o={};for(const a of["stat","getManifest","importFile","importManifest"])o[a]=(c,l={})=>{
if(!s.accepting)return Promise.reject(new Error("Artifact retention scope is no longer active."));if(i.size>=32)return Promise.
reject(new Error("Artifact retention operation queue is full."));const d=this[a](c,{...l,[_o]:s});return i.add(d),d.finally(
()=>i.delete(d)).catch(()=>{}),d};o.getStats=()=>this.getStats(),Object.freeze(o);try{const a=await Ol(Promise.resolve().
then(()=>(rt(n.signal),e(o))),n.signal);return s.accepting=!1,await Promise.all([...i]),rt(n.signal),a}finally{s.accepting=
!1,await Promise.allSettled([...i]),s.held=!1,n.finish()}}async acquireUse(e,{signal:r}={}){const n=Ze(e).toString(),s=await this.
_begin(r,"none");let i;try{i=await Ao(`${this.lockName}:use:${n}`,"shared",s.signal,this.lockManager);const o=await this.
stat(n,{signal:s.signal});if(o?.status!=="complete"||!o.pinned&&!o.retain)throw new Error("Artifact use requires a compl\
ete retained root.");rt(s.signal);let a=!1;const c=()=>{a||(a=!0,this.controller.signal.removeEventListener("abort",c),i(),
s.finish())};return this.controller.signal.addEventListener("abort",c,{once:!0}),this.controller.signal.aborted&&(c(),rt(
this.controller.signal)),c}catch(o){throw i?.(),s.finish(),o}}async*_entries(e,r=!1){let n;for(;;){const s=await this.backend.
scan(e,{after:n,limit:16,keysOnly:r});if(!s.length)return;for(const i of s)yield i;n=s.at(-1).key}}async*list({signal:e}={}){
const r=await this._begin(e);try{for await(const n of this._entries("roots"))rt(r.signal),r.pause(),yield n.value,r.resume()}finally{
r.finish()}}async*listBlockCids(e,{signal:r}={}){const n=Ze(e).toString(),s=await this._begin(r);try{const i=await this.
backend.get("roots",n);if(i?.status!=="complete")throw new Error("Artifact serving requires a complete local root.");await this.
_checkRootIdentity(n,i,s.signal);const o=[n,...(i.manifest?.files||[]).map(a=>a.cid)];for await(const a of this._walk(o,
{signal:s.signal}))s.pause(),yield a,s.resume()}catch(i){throw await this._invalidateRoot(n,i),i}finally{s.finish()}}async _collectGarbage(e,r){
const n=await this.backend.getUsage("blocks"),s=n.generation||0,i=new Set;for await(const{value:l}of this._entries("root\
s")){if(l.cid===r||!l.pinned&&!l.retain)continue;const d=[l.cid,...(l.manifest?.files||[]).map(f=>f.cid)];for await(const f of this.
_walk(d,{signal:e,allowMissing:l.status!=="complete"}))if(i.add(f),i.size>n.entries)throw new RangeError("Artifact GC ex\
ceeds the stored block collection.")}const o=r?await this.backend.get("roots",r):null,a=!!(r&&i.has(r));if(o)if(a){const l=o.
kind==="manifest"?{cid:r,kind:"file",size:o.size,sha256:Ru(Ze(r).multihash.digest),status:o.status,pinned:!1,retain:!1}:
{...o,pinned:!1,retain:!1};await this._writeRoot(r,()=>l,e)}else{const l={...o,pinned:!1,status:"deleting"};delete l.retain,
delete l.profile,await this._writeRoot(r,()=>l,e)}let c=0;for await(const{key:l,generation:d}of this._entries("blocks",!0))
rt(e),d<=s&&!i.has(l)&&await this.backend.delete("blocks",l)&&c++;for await(const{key:l,value:d}of this._entries("roots"))
!d.pinned&&!d.retain&&!i.has(l)&&await this.backend.delete("roots",l);return this.usage=await this.backend.getUsage("blo\
cks"),this.rootUsage=await this.backend.getUsage("roots"),{deletedBlocks:c,freedBytes:n.bytes-this.usage.bytes,storedBytes:this.
usage.bytes,blockCount:this.usage.entries,...r?{cid:r,removed:!!o,retainedByOtherRoot:a}:{}}}async gc({signal:e}={}){return this.
_run(e,r=>this._collectGarbage(r),"exclusive")}async remove(e,{signal:r,useWaitMs:n=1e3}={}){const s=Ze(e).toString();if(Er(
n,"useWaitMs"),n>3e4)throw new RangeError("Artifact use wait exceeds limit.");await this.open();const i=new AbortController,
o=setTimeout(()=>i.abort(Object.assign(new Error("This model is in use in another session. Unload it before deleting."),
{code:"ERR_ARTIFACT_IN_USE"})),n);o.unref?.();let a;try{a=await Ao(`${this.lockName}:use:${s}`,"exclusive",AbortSignal.any(
[i.signal,this.controller.signal,...r?[r]:[]]),this.lockManager)}finally{clearTimeout(o)}try{return await this._run(r,async c=>{
try{return await this._collectGarbage(c,s)}finally{this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.
backend.getUsage("roots")}},"exclusive")}finally{a()}}getStats(){return Object.freeze({name:this.name,isOpen:this.isOpen,
persistent:this.persistent,storedBytes:this.usage.bytes,blockCount:this.usage.entries,rootCount:this.rootUsage.entries,maximumBytes:this.
maximumBytes,maximumStoredBlocks:this.maximumStoredBlocks,capacity:this.capacity,pending:this.operations.size})}getBlockstore(){
return this.blockstore}getDatastore(){return this.datastore}_createBlockstore(){const e=this,r={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},async*get(n,{signal:s}={}){const i=await e._begin(s,"none");try{const o=await e._readBlock(
n,i.signal);i.pause(),yield o,i.resume()}finally{i.finish()}},put:(n,s,{signal:i}={})=>e._run(i,o=>e._putBlock(n,s,o),"n\
one"),has:(n,{signal:s}={})=>e._run(s,async()=>await e.backend.get("blocks",Ze(n).toString())!==void 0,"none"),delete:async()=>{
throw new Error("Artifact blocks can only be removed through StateManager garbage collection.")},async*getAll({signal:n}={}){
const s=await e._begin(n);try{for await(const{key:i}of e._entries("blocks",!0))rt(s.signal),s.pause(),yield{cid:Ze(i),bytes:r.
get(i,{signal:s.signal})},s.resume()}finally{s.finish()}}};return r.putMany=async function*(n,s){for await(const{cid:i,bytes:o}of n)
yield await r.put(i,o,s)},r.getMany=async function*(n,s){for await(const i of n)yield{cid:i,bytes:r.get(i,s)}},r.deleteMany=
async function*(){throw new Error("Use ArtifactStore.gc() to remove blocks.")},r}_createDatastore(){const e=this,r=s=>{const i=s.
toString();if(i.length>2048)throw new RangeError("Datastore key exceeds limit.");return i},n={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},get:(s,{signal:i}={})=>e._run(i,async()=>{const o=await e.backend.get("routing",r(s));
if(o===void 0)throw Mu(s);return o},"none"),has:(s,{signal:i}={})=>e._run(i,async()=>await e.backend.get("routing",r(s))!==
void 0,"none"),put:(s,i,{signal:o}={})=>e._run(o,async a=>{if(rt(a),!(i instanceof Uint8Array)||i.byteLength>ti)throw new RangeError(
"Datastore value exceeds limit.");return await e.backend.put("routing",r(s),i,{maximumBytes:e.maximumRoutingBytes,maximumEntries:4096}),
s},"none"),delete:(s,{signal:i}={})=>e._run(i,async()=>{await e.backend.delete("routing",r(s))},"none"),query:(s={},i={})=>e.
_queryDatastore(s,i,!1),queryKeys:(s={},i={})=>e._queryDatastore(s,i,!0),batch:()=>{const s=[];let i=0;const o=(a,c)=>{if(s.
length>=4096||(i+=c?.byteLength||0)>e.maximumRoutingBytes)throw new RangeError("Datastore batch exceeds limit.");s.push(
{key:a,value:c?.slice()})};return{put:(a,c)=>o(a,c),delete:a=>o(a),commit:async a=>{for(const{key:c,value:l}of s)l===void 0?
await n.delete(c,a):await n.put(c,l,a);s.length=0}}}};return n.putMany=async function*(s,i){for await(const o of s)await n.
put(o.key,o.value,i),yield o},n.getMany=async function*(s,i){for await(const o of s)yield{key:o,value:await n.get(o,i)}},
n.deleteMany=async function*(s,i){for await(const o of s)await n.delete(o,i),yield o},n}async*_queryDatastore(e,{signal:r}={},n){
const s=await this._begin(r,"none");try{const i=[];let o=0,a=0;const c=Er(e.offset??0,"query offset",0),l=Er(e.limit??4096,
"query limit",0);for await(const d of this._entries("routing",n)){if(rt(s.signal),e.prefix&&!d.key.startsWith(e.prefix))
continue;const f=new Fr(d.key),h=n?f:{key:f,value:d.value};if(!e.filters?.some(p=>!p(h))&&(e.orders?.length?i.push(h):o++>=
c&&a<l&&(a++,s.pause(),yield h,s.resume()),!e.orders?.length&&a>=l))return}if(e.orders?.length){i.sort((d,f)=>{for(const h of e.
orders){const p=h(d,f);if(p)return p}return 0});for(const d of i.slice(c,c+l))s.pause(),yield d,s.resume()}}finally{s.finish()}}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.controller.abort(new DOMException("Artifact store destroy\
ed.","AbortError")),this.destroying=(async()=>{try{await this.opening?.catch(()=>{}),await Promise.allSettled([...this.operations].
map(e=>e.settled)),this.ownsBackend&&await this.backend.close()}finally{this.isOpen=!1,this.onDestroy?.(this)}})(),this.
destroying)}}const S1=new TextEncoder,FB=Object.freeze({bindings:8,agents:16,promptBytes:16*1024,replyBytes:64*1024});function zB(t){
if(!t||!/^[a-f0-9]{64}$/.test(t.sha256??"")||!Number.isInteger(t.width)||!Number.isInteger(t.height)||t.width<1||t.height<
1||t.width>256||t.height>256||t.channels!==4)throw new Error("Invalid agent face");return{sha256:t.sha256,width:t.width,
height:t.height,channels:4}}function Bu(t,e,r){if(typeof t!="string"||!t.trim()||/[\u0000-\u001f]/.test(t)||S1.encode(t).
length>e)throw new Error(`Invalid world agent ${r}`);return t}function qB(t){if(!Array.isArray(t)||t.length!==3||t.some(
e=>!Number.isFinite(e)||Math.abs(e)>1e8))throw new Error("World position must contain three bounded coordinates");return[
...t]}function jB(t){if(!Array.isArray(t)||t.length>FB.bindings)throw new Error("Too many agent world bindings");const e=new Set;
return t.map(r=>{const n=Bu(r?.worldId,240,"world");if(e.has(n))throw new Error("Duplicate agent world binding");if(e.add(
n),!/^#[a-f0-9]{6}$/i.test(r.color??"")||typeof r.shared!="boolean")throw new Error("Invalid agent body settings");if(r.
respondToWorldChat!==void 0&&typeof r.respondToWorldChat!="boolean")throw new Error("Invalid world chat preference");const s={
worldId:n,position:qB(r.position),color:r.color,shared:r.shared,respondToWorldChat:r.respondToWorldChat??!1};if(r.appearancePrompt!==
void 0){if(typeof r.appearancePrompt!="string"||r.appearancePrompt.includes("\0")||S1.encode(r.appearancePrompt).length>
2048)throw new Error("Invalid appearance prompt");s.appearancePrompt=r.appearancePrompt.trim()}if(r.appearanceRequestId!==
void 0&&(s.appearanceRequestId=Bu(r.appearanceRequestId,128,"appearance request")),r.face!==void 0){const i=Bu(r.face?.attachmentId,
128,"face attachment");if(!/^[A-Za-z0-9._:-]+$/.test(i))throw new Error("Invalid face attachment");s.face={...zB(r.face),
attachmentId:i}}return s})}const Ul="peercompute.agent.v1",Xb="peercompute.agent.export.v1",Qt=Object.freeze({headBytes:64*
1024,eventBytes:128*1024,operationBytes:16*1024,events:256,historyBytes:8*1024*1024,operations:256,attachmentBytes:4*1024*
1024,attachmentCount:64,attachmentTotalBytes:64*1024*1024,exportBytes:12*1024*1024}),GB=new Set(["paused","running","wai\
ting","completed","error"]),WB=Object.freeze(["prepared","dispatched","completed","failed","cancelled","outcome-unknown"]),
dh=t=>["prepared","dispatched"].includes(t?.status),A1=new TextEncoder;function ar(t,e){return Object.assign(new Error(e),
{code:t})}function mt(t,e="identifier"){if(typeof t!="string"||!/^[A-Za-z0-9._:-]{1,128}$/.test(t))throw new TypeError(`\
Invalid agent ${e}`);return t}function Js(t,e,r="data"){let n=0;function s(a,c){if(++n>2e4||c>16)throw new RangeError(`A\
gent ${r} is too complex`);if(!(a===null||typeof a=="string"||typeof a=="boolean")&&!(typeof a=="number"&&Number.isFinite(
a))){if(!a||typeof a!="object"||!Array.isArray(a)&&![Object.prototype,null].includes(Object.getPrototypeOf(a)))throw new TypeError(
`Invalid agent ${r}`);for(const[l,d]of Object.entries(a)){if(["__proto__","prototype","constructor"].includes(l))throw new TypeError(
`Invalid agent ${r} key`);s(d,c+1)}}}s(t,0);const i=JSON.stringify(t),o=A1.encode(i).byteLength;if(o>e)throw new RangeError(
`Agent ${r} exceeds its byte budget`);return{value:JSON.parse(i),bytes:o}}function mc(t,e,r){if(typeof t!="string"||t.includes(
"\0")||A1.encode(t).byteLength>e)throw new TypeError(`Invalid agent ${r}`);return t}function uh(t={}){if(!t||typeof t!="\
object"||Array.isArray(t))throw new TypeError("Invalid agent input");const e=mc(t.name??"",240,"name").trim();if(!e)throw new TypeError(
"Agent name is required");const r=t.goals??[];if(!Array.isArray(r)||r.length>16)throw new TypeError("Invalid agent goals");
const n=t.inferenceMode??"local-only";if(!["local-only","network-assisted"].includes(n))throw new TypeError("Invalid age\
nt inference mode");return{identity:{name:e,instructions:mc(t.instructions??"",16*1024,"instructions")},goals:r.map(s=>mc(
s,4096,"goal").trim()).filter(Boolean),context:{summary:mc(t.summary??"",24*1024,"summary")},policy:{inferenceMode:n},...t.
embodiments!==void 0?{embodiments:jB(t.embodiments)}:{}}}function fh(t){const{value:e}=Js(t,Qt.operationBytes,"operation");
if(!e||Array.isArray(e))throw new TypeError("Invalid agent operation");if(mt(e.id,"operation ID"),!WB.includes(e.status))
throw new TypeError("Invalid agent operation status");return e}function Qs(t){if(!t||t.schema!==Ul||t.agentKind!=="gener\
al")throw new TypeError("Unsupported agent schema or kind");const e=uh({name:t.identity?.name,instructions:t.identity?.instructions,
goals:t.goals,summary:t.context?.summary,inferenceMode:t.policy?.inferenceMode,embodiments:t.embodiments});if(mt(t.agentId,
"ID"),t.authority?.kind!=="local"||t.authority.epoch!==0)throw new TypeError("Portable agent authority is not supported");
if(mt(t.authority.hostId,"local host ID"),!Number.isSafeInteger(t.revision)||t.revision<1||!GB.has(t.status))throw new TypeError(
"Invalid agent revision or status");for(const s of["createdAt","updatedAt"])if(!Number.isSafeInteger(t[s])||t[s]<0)throw new TypeError(
"Invalid agent timestamp");const r=t.pendingOperation==null?null:fh(t.pendingOperation);if(r&&!dh(r))throw new TypeError(
"Only active operations may be pending");const n={schema:Ul,agentId:t.agentId,agentKind:"general",...e,authority:{kind:"\
local",hostId:t.authority.hostId,epoch:0},revision:t.revision,status:t.status,createdAt:t.createdAt,updatedAt:t.updatedAt,
pendingOperation:r};return Js(n,Qt.headBytes,"head").value}function Zb(t){const e=Js(t,Qt.eventBytes,"event");if(!e.value||
Array.isArray(e.value))throw new TypeError("Invalid agent event");const r=e.value.attachmentIds;if(r!==void 0&&(!Array.isArray(
r)||r.length>4||new Set(r).size!==r.length))throw new TypeError("Invalid agent attachment references");return r?.forEach(
n=>mt(n,"attachment ID")),e.value}function I1(t){if(mt(t?.id,"attachment ID"),!Number.isSafeInteger(t.width)||!Number.isSafeInteger(
t.height)||t.width<1||t.height<1||t.width>1024||t.height>1024||t.channels!==4||!(t.data instanceof Uint8Array)||t.data.byteLength!==
t.width*t.height*4||t.data.byteLength>Qt.attachmentBytes)throw new TypeError("Invalid bounded RGBA agent attachment");return{
id:t.id,width:t.width,height:t.height,channels:4,data:t.data.slice()}}const It=t=>new Promise((e,r)=>{t.onsuccess=()=>e(
t.result),t.onerror=()=>r(t.error)}),HB=t=>t===void 0?void 0:structuredClone(t),Lu=["heads","events","operations","attac\
hments"];class VB{constructor({name:e="default",indexedDBImpl:r=globalThis.indexedDB,keyRange:n=globalThis.IDBKeyRange,lockManager:s=globalThis.
navigator?.locks,now:i=Date.now,onDestroy:o}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/.test(e))throw new TypeError("I\
nvalid agent store name");this.name=e,this.databaseName=`peercompute-agents-v1-${e}`,this.lockName=this.databaseName,this.
persistent=!0,this.indexedDB=r,this.keyRange=n,this.lockManager=s,this.now=i,this.onDestroy=o,this.database=null,this.hostId=
null,this.runs=new Set,this.transactions=new Set,this.lifetime=new AbortController}async open(){if(this.closing||this.destroyed)
throw new Error("Agent store is closed");if(this.database)return this;if(this.opening)return this.opening;if(!this.indexedDB?.
open||!this.keyRange)throw ar("ERR_AGENT_STORAGE_UNAVAILABLE","Private agent persistence requires IndexedDB");this.opening=
(async()=>(this.database=await new Promise((e,r)=>{const n=this.indexedDB.open(this.databaseName,1);let s=!1;n.onupgradeneeded=
()=>{const i=n.result;i.createObjectStore("heads",{keyPath:"id"}),i.createObjectStore("events",{keyPath:["agentId","sequ\
ence"]}),i.createObjectStore("operations",{keyPath:["agentId","id"]}),i.createObjectStore("attachments",{keyPath:["agent\
Id","id"]}),i.createObjectStore("metadata")},n.onerror=()=>{s=!0,r(n.error)},n.onblocked=()=>{s=!0,r(ar("ERR_AGENT_STORA\
GE_BLOCKED","Another tab is blocking the agent database upgrade"))},n.onsuccess=()=>{s?n.result.close():e(n.result)}}),this.
database.onversionchange=()=>{this.database?.close(),this.database=null,this.lifetime.abort(ar("ERR_AGENT_STORAGE_CHANGE\
D","Agent storage changed; pause and reload this tab"))},this.hostId=await this._transaction(["metadata"],"readwrite",async e=>{
const r=e.objectStore("metadata");let n=await It(r.get("hostId"));return n||(n=crypto.randomUUID(),await It(r.put(n,"hos\
tId"))),mt(n,"local host ID")}),this))();try{return await this.opening}catch(e){throw this.database?.close(),this.database=
null,e}finally{this.opening=null}}_time(){const e=this.now();if(!Number.isSafeInteger(e)||e<0)throw new Error("Invalid a\
gent clock");return e}_newWork(){if(this.closing||this.destroyed)throw new Error("Agent store is closing")}async _transaction(e,r,n,s){
if(s?.throwIfAborted(),!this.database||this.destroyed)throw ar("ERR_AGENT_STORAGE_UNAVAILABLE","Agent database is unavai\
lable");const i=this.database.transaction(e,r),o=new Promise((c,l)=>{i.oncomplete=c,i.onabort=()=>l(i.error||s?.reason||
new Error("Agent transaction aborted")),i.onerror=()=>{}});this.transactions.add(o),o.catch(()=>{});const a=()=>{try{i.abort()}catch{}};
s?.addEventListener("abort",a,{once:!0});try{const c=await n(i);return await o,HB(c)}catch(c){throw a(),await o.catch(()=>{}),
c}finally{this.transactions.delete(o),s?.removeEventListener("abort",a)}}_range(e,r,n=!1){return this.keyRange.bound([e,
r??(n?0:"")],[e,n?Number.MAX_SAFE_INTEGER:"￿"],r!==void 0,!1)}_scan(e,r,n,s,i=o=>o){return new Promise((o,a)=>{const c=[],
l=e.objectStore(r).openCursor(n);l.onerror=()=>a(l.error),l.onsuccess=()=>{const d=l.result;if(!d||c.length>=s)return o(
c);c.push(i(d.value)),c.length>=s?o(c):d.continue()}})}_limit(e){if(!Number.isSafeInteger(e)||e<1||e>100)throw new RangeError(
"Agent page limit must be 1–100");return e}async create(e,{signal:r}={}){this._newWork();const n=uh(e),s=this._time(),
i=Qs({schema:Ul,agentId:crypto.randomUUID(),agentKind:"general",...n,authority:{kind:"local",hostId:this.hostId,epoch:0},
revision:1,status:"paused",createdAt:s,updatedAt:s,pendingOperation:null});return this._transaction(["heads"],"readwrite",
async o=>(await It(o.objectStore("heads").add({id:i.agentId,record:i,eventCount:0,eventBytes:0,nextSequence:1,operationCount:0,
attachmentCount:0,attachmentBytes:0})),i),r)}get(e,{signal:r}={}){return mt(e),this._transaction(["heads"],"readonly",async n=>(await It(
n.objectStore("heads").get(e)))?.record,r)}list({after:e,limit:r=50,signal:n}={}){return e!==void 0&&mt(e),this._transaction(
["heads"],"readonly",s=>this._scan(s,"heads",e===void 0?null:this.keyRange.lowerBound(e,!0),this._limit(r),i=>i.record),
n)}events(e,{after:r,limit:n=50,signal:s}={}){if(mt(e),r!==void 0&&(!Number.isSafeInteger(r)||r<0))throw new TypeError("\
Invalid event cursor");return this._transaction(["events"],"readonly",i=>this._scan(i,"events",this._range(e,r,!0),this.
_limit(n)),s)}operations(e,{after:r,limit:n=50,signal:s}={}){return mt(e),r!==void 0&&mt(r),this._transaction(["operatio\
ns"],"readonly",i=>this._scan(i,"operations",this._range(e,r),this._limit(n)),s)}getOperation(e,r,{signal:n}={}){return mt(
e),mt(r),this._transaction(["operations"],"readonly",s=>It(s.objectStore("operations").get([e,r])),n)}getAttachment(e,r,{
signal:n}={}){return mt(e),mt(r),this._transaction(["attachments"],"readonly",s=>It(s.objectStore("attachments").get([e,
r])),n)}async commit(e,{expectedRevision:r,head:n,event:s,operation:i,attachments:o=[]},{signal:a}={}){if(mt(e),!Number.
isSafeInteger(r)||r<1)throw new TypeError("Expected agent revision is required");const c=n===void 0?null:Qs(n),l=s===void 0?
null:Zb(s),d=i===void 0?null:fh(i);if(!Array.isArray(o)||o.length>4)throw new TypeError("Too many agent attachments");const f=o.
map(I1);if(new Set(f.map(p=>p.id)).size!==f.length)throw new TypeError("Duplicate agent attachment");if(f.some(p=>!l?.attachmentIds?.
includes(p.id)))throw new Error("Agent attachments require event references");const h=this._time();return this._transaction(
Lu,"readwrite",async p=>{const m=p.objectStore("heads"),b=await It(m.get(e));if(!b)throw ar("ERR_AGENT_NOT_FOUND","Agent\
 no longer exists");const g=b.record;if(g.revision!==r)throw ar("ERR_AGENT_CONFLICT","Agent changed in another operation\
; reload before saving");const u=c??g;if(u.agentId!==e||u.authority.hostId!==g.authority.hostId||u.createdAt!==g.createdAt||
u.authority.hostId!==this.hostId)throw new Error("Agent identity and local authority cannot be changed");let y=g.pendingOperation;
if(d){const E=p.objectStore("operations"),k=await It(E.get([e,d.id]));if(d.status==="prepared"){if(k||y)throw ar("ERR_AG\
ENT_OPERATION_CONFLICT","An agent operation already exists or awaits reconciliation");b.operationCount++}else if(!k||!dh(
k)||y?.id!==d.id)throw ar("ERR_AGENT_OPERATION_CONFLICT","Agent operation is no longer active");if(b.operationCount>Qt.operations)
throw ar("ERR_AGENT_HISTORY_FULL","Agent operation history is full; export before continuing");const A=fh({...k,...d,agentId:e,
updatedAt:h});await It(E.put(A)),y=dh(A)?A:null}for(const E of f){const k=p.objectStore("attachments");if(await It(k.get(
[e,E.id])))throw new Error("Agent attachments are immutable");if(b.attachmentCount++,b.attachmentBytes+=E.data.byteLength,
b.attachmentCount>Qt.attachmentCount||b.attachmentBytes>Qt.attachmentTotalBytes)throw ar("ERR_AGENT_HISTORY_FULL","Priva\
te image history is full");await It(k.add({...E,agentId:e}))}if(l){for(const A of l.attachmentIds??[])if(!await It(p.objectStore(
"attachments").get([e,A])))throw new Error("Agent attachment is missing");const E={...l,agentId:e,sequence:b.nextSequence++,
at:h},{bytes:k}=Js(E,Qt.eventBytes,"event");if(b.eventCount++,b.eventBytes+=k,b.eventCount>Qt.events||b.eventBytes>Qt.historyBytes)
throw ar("ERR_AGENT_HISTORY_FULL","Agent history is full; export before continuing");await It(p.objectStore("events").add(
E))}return b.record=Qs({...u,revision:g.revision+1,updatedAt:h,pendingOperation:y}),await It(m.put(b)),b.record},a)}async withRun(e,r,{
signal:n}={}){if(this._newWork(),mt(e),n?.throwIfAborted(),typeof r!="function")throw new TypeError("Agent run callback \
is required");if(!this.lockManager?.request)throw ar("ERR_AGENT_LOCK_UNAVAILABLE","This browser cannot safely coordinate\
 agent execution between tabs");const s=n?AbortSignal.any([n,this.lifetime.signal]):this.lifetime.signal,i=this.lockManager.
request(`${this.lockName}:run:${e}`,{mode:"exclusive",ifAvailable:!0},async o=>{if(!o)throw ar("ERR_AGENT_BUSY","This ag\
ent is running or being edited in another tab");s.throwIfAborted();const a=await this.get(e,{signal:s});if(!a)throw ar("\
ERR_AGENT_NOT_FOUND","Agent no longer exists");if(a.authority.hostId!==this.hostId)throw new Error("This installation do\
es not own the agent");return r({signal:s,runId:crypto.randomUUID(),head:a})});this.runs.add(i);try{return await i}finally{
this.runs.delete(i)}}async delete(e,{expectedRevision:r,signal:n}={}){if(!Number.isSafeInteger(r)||r<1)throw new TypeError(
"Expected agent revision is required");return this.withRun(e,()=>this._transaction(Lu,"readwrite",async s=>{if((await It(
s.objectStore("heads").get(e))).record.revision!==r)throw ar("ERR_AGENT_CONFLICT","Agent changed before deletion");return await Promise.
all([It(s.objectStore("heads").delete(e)),It(s.objectStore("events").delete(this._range(e,void 0,!0))),It(s.objectStore(
"operations").delete(this._range(e))),It(s.objectStore("attachments").delete(this._range(e)))]),{deleted:!0,agentId:e}},
n),{signal:n})}export(e,{signal:r}={}){return mt(e),this._transaction(Lu,"readonly",async n=>{const s=await It(n.objectStore(
"heads").get(e));if(!s)throw ar("ERR_AGENT_NOT_FOUND","Agent no longer exists");const[i,o]=await Promise.all([this._scan(
n,"events",this._range(e,void 0,!0),Qt.events),this._scan(n,"attachments",this._range(e),Qt.attachmentCount,({id:a,width:c,
height:l,channels:d})=>({id:a,width:c,height:l,channels:d,omitted:!0}))]);return Js({schema:Xb,exportedAt:this._time(),agent:{
...s.record,status:"paused",pendingOperation:null},events:i,attachments:o,attachmentsOmitted:!0},Qt.exportBytes,"export").
value},r)}async restoreAsNew(e,{name:r,signal:n}={}){this._newWork();const s=Js(e,Qt.exportBytes,"export").value;if(s.schema!==
Xb||!Array.isArray(s.events)||s.events.length>Qt.events)throw new TypeError("Unsupported agent export");const i=Qs(s.agent),
o=uh({name:r??i.identity.name,instructions:i.identity.instructions,goals:i.goals,summary:i.context.summary,inferenceMode:"\
local-only"}),a=this._time(),c=crypto.randomUUID(),l=Qs({schema:Ul,agentId:c,agentKind:"general",...o,authority:{kind:"l\
ocal",hostId:this.hostId,epoch:0},revision:1,status:"paused",createdAt:a,updatedAt:a,pendingOperation:null});let d=0;const f=s.
events.map((h,p)=>{const{agentId:m,sequence:b,at:g,attachmentIds:u,...y}=Zb(h),E={...y,agentId:c,sequence:p+1,at:a,restoredFrom:i.
agentId,...u?.length?{attachmentsOmitted:!0}:{}};return d+=Js(E,Qt.eventBytes,"event").bytes,E});if(d>Qt.historyBytes)throw new RangeError(
"Restored agent history exceeds its byte budget");return this._transaction(["heads","events"],"readwrite",async h=>{await It(
h.objectStore("heads").add({id:c,record:l,eventCount:f.length,eventBytes:d,nextSequence:f.length+1,operationCount:0,attachmentCount:0,
attachmentBytes:0}));for(const p of f)await It(h.objectStore("events").add(p));return l},n)}getStatus(){return{persistent:!0,
available:!!this.database,executionAvailable:!!this.lockManager?.request,activeRuns:this.runs.size}}async destroy(){return this.
destroying?this.destroying:(this.closing=!0,this.destroying=(async()=>{this.lifetime.abort(new DOMException("Agent store\
 closed","AbortError")),await this.opening?.catch(()=>{}),await Promise.allSettled([...this.runs]),await Promise.allSettled(
[...this.transactions]),this.database?.close(),this.database=null,this.destroyed=!0,this.onDestroy?.(this)})(),this.destroying)}}
const KB="peercompute.state.task-graph-cache-artifact-admission.v0",QB="peercompute.state.task-graph-cache-artifact-inva\
lidation.v0",Si="taskGraphCacheArtifactAdmissions",JB="taskGraphCacheArtifactInvalidations";function ey(t,e=[]){return Array.
isArray(t)?t.map(r=>String(r||"").trim()).filter(Boolean):typeof t=="string"?t.split(",").map(r=>r.trim()).filter(Boolean):
[...e]}function Co(t){if(t==null)return t;if(typeof structuredClone=="function")try{return structuredClone(t)}catch{}return JSON.
parse(JSON.stringify(t))}class YB{constructor(e,r={}){this.networkManager=e,this.libp2pNode=e?e.getLibp2pNode():null,this.
config={docName:r.docName||"peercompute-state",topic:r.topic||"peercompute-state-sync",enablePersistence:r.enablePersistence!==
!1,disableNetworkProvider:r.disableNetworkProvider||!1,disableBroadcast:r.disableBroadcast||!1,broadcastNamespaces:Array.
isArray(r.broadcastNamespaces)?r.broadcastNamespaces:null,...r},this.ydoc=new ro,this.state=this.ydoc.getMap("state"),this.
dataState=new lA({ydoc:this.ydoc,stateMap:this.state,hotStore:r.hotStore,deltaNamespace:r.deltaNamespace||"deltas"}),this.
indexeddbProvider=null,this.libp2pProvider=null,this.subscribers=new Map,this.globalSubscribers=new Set,this.isInitialized=
!1,this.persistenceFailed=!1,this.agentRecordStores=new Map}_getNamespaceMap(e){let r=this.state.get(e);return r||(r=new Yn,
this.state.set(e,r)),r}applyRemoteUpdate(e){try{const r=(()=>{if(e instanceof Uint8Array)return e;if(Array.isArray(e))return new Uint8Array(
e);if(e&&typeof e=="object"){const s=Object.values(e);return new Uint8Array(s)}return new Uint8Array(0)})();if(r.byteLength===
0){console.warn("[StateManager] Remote update was empty, skipping");return}const n=r;rl(this.ydoc,n,this)}catch(r){console.
error("[StateManager] Failed to apply remote update:",r)}}applyStateSet(e,r,n){try{this.ydoc.transact(()=>{if(n){const s=this.
_getNamespaceMap(n);r===void 0?s.delete(e):s.set(e,r)}else r===void 0?this.state.delete(e):this.state.set(e,r)},"remote-\
state-set")}catch(s){console.error("[StateManager] Failed to apply state-set:",s)}}commitDelta(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");this.dataState.commitDelta(e)}getDataState(){return this.dataState}createLocalArtifactCache(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const r=new bA({...e,onDestroy:n=>{this.dataState.unregisterLocalArtifactCache(
n.name,n)}});try{return this.dataState.registerLocalArtifactCache(r.name,r)}catch(n){throw r.destroy(),n}}getLocalArtifactCache(e){
return this.dataState.getLocalArtifactCache(e)}createArtifactStore(e={}){if(this.destroyed)throw new Error("StateManager\
 is destroyed");const r=e.name||"default";if(this.getArtifactStore(r))throw new Error(`Artifact store ${r} is already re\
gistered`);const n=new UB({...e,name:r,onDestroy:s=>{this.dataState.unregisterArtifactStore(s),e.onDestroy?.(s)}});return this.
dataState.registerArtifactStore(n)}getArtifactStore(e="default"){return this.dataState.getArtifactStore(e)}createAgentRecordStore(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const r=e.name||"default";if(this.agentRecordStores.has(r))
throw new Error(`Agent store ${r} is already registered`);const n=new VB({...e,name:r,onDestroy:s=>{this.agentRecordStores.
get(r)===s&&this.agentRecordStores.delete(r),e.onDestroy?.(s)}});return this.agentRecordStores.set(r,n),n}getAgentRecordStore(e="\
default"){return this.agentRecordStores.get(e)||null}async ensureArtifact(e,{storeName:r="default",signal:n}={}){if(this.
destroyed)throw new Error("StateManager is destroyed");const s=this.getArtifactStore(r);if(!s)throw new Error(`Artifact \
store ${r} is not configured`);return s.ensureLocal(e,{signal:n,fetchBlock:(i,o={})=>{if(!this.networkManager?.fetchArtifactBlock)
throw new Error("Artifact networking is not configured");return this.networkManager.fetchArtifactBlock(i,{...o,artifactCid:e})}})}async publishArtifact(e){
if(this.destroyed)throw new Error("StateManager is destroyed");if(!this.networkManager?.announceArtifact)throw new Error(
"Artifact networking is not configured");return this.networkManager.announceArtifact(e)}async unpublishArtifact(e,{storeName:r="\
default",unpin:n=!1}={}){if(this.destroyed)throw new Error("StateManager is destroyed");if(!this.networkManager?.withdrawArtifact)
throw new Error("Artifact networking is not configured");await this.networkManager.withdrawArtifact(e),n&&await this.getArtifactStore(
r)?.unpin(e)}getWarmDeltas(e){return this.dataState.getWarmDeltas(e)}setHotBuffer(e,r){this.dataState.setHotBuffer(e,r)}getHotBuffer(e){
return this.dataState.getHotBuffer(e)}admitTaskGraphCacheArtifact(e={},r={}){if(!this.isInitialized)throw new Error("Sta\
teManager not initialized");if(!e||typeof e!="object")throw new Error("admitTaskGraphCacheArtifact requires an artifact \
object");const n=String(r.cacheKey||e.cacheKey||"").trim();if(!n)throw new Error("admitTaskGraphCacheArtifact requires a\
rtifact.cacheKey");const s=Number.isFinite(r.admittedAt)?r.admittedAt:Date.now(),i=ey(r.invalidationRefs??e.invalidationRefs??
e.admission?.invalidationRefs,[]),o={schema:KB,admissionId:String(r.admissionId||e.admission?.admissionId||`task-graph-c\
ache-admission:${n}:${s}`),cacheKey:n,artifactId:e.artifactId||`${n}:artifact`,artifactSchema:e.schema||null,artifactStatus:e.
status||null,cacheScope:e.cacheScope||r.cacheScope||null,cacheKeySource:e.cacheKeySource||r.cacheKeySource||null,inputHash:e.
inputHash||r.inputHash||null,resultHash:e.resultHash||r.resultHash||null,status:r.status||"admitted",admitted:!0,authority:r.
authority||"state-manager",validatorId:r.validatorId||e.admission?.validatorId||null,reason:r.reason||"state-manager-cac\
he-artifact-admission",invalidationRefs:i,admittedAt:s,acceptedAt:s,expiresAt:r.expiresAt??e.expiresAt??null,sourceNodeId:r.
sourceNodeId||this.state.get("nodeId")||null,artifact:Co(e)};return this.writeScoped(Si,n,o),Co(o)}invalidateTaskGraphCacheArtifact(e,r={}){
if(!this.isInitialized)throw new Error("StateManager not initialized");const n=e&&typeof e=="object"?e:null,s=String(r.cacheKey||
n?.cacheKey||e||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires a cacheKey");const i=this.readScoped(
Si,s),o=Number.isFinite(r.invalidatedAt)?r.invalidatedAt:Date.now(),a=ey(r.invalidationRefs??n?.invalidationRefs??i?.invalidationRefs,
[]),c={schema:QB,invalidationId:String(r.invalidationId||`task-graph-cache-invalidation:${s}:${o}`),cacheKey:s,artifactId:n?.
artifactId||i?.artifactId||`${s}:artifact`,status:"invalidated",authority:r.authority||"state-manager",reason:r.reason||
"state-manager-cache-artifact-invalidated",invalidationRefs:a,previousAdmissionStatus:i?.status||null,invalidatedAt:o,sourceNodeId:r.
sourceNodeId||this.state.get("nodeId")||null};return this.writeScoped(JB,c.invalidationId,c),i&&this.writeScoped(Si,s,{...i,
status:"invalidated",admitted:!1,invalidatedAt:o,invalidation:c}),Co(c)}getTaskGraphCacheArtifactAdmission(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");const r=String(e||"").trim();if(!r)return null;const n=this.readScoped(Si,
r);return n?Co(n):null}listTaskGraphCacheArtifactAdmissions(e={}){if(!this.isInitialized)throw new Error("StateManager n\
ot initialized");const r=e.includeInvalidated!==!1;return this.listNamespaceKeys(Si).map(n=>this.readScoped(Si,n)).filter(
n=>n&&(r||n.admitted===!0)).map(n=>Co(n)).sort((n,s)=>String(n.cacheKey||"").localeCompare(String(s.cacheKey||"")))}async initialize(e={}){
if(this.isInitialized){console.warn("[StateManager] Already initialized");return}try{if(this.config.enablePersistence&&(this.
indexeddbProvider=new aA(this.config.docName,this.ydoc),await new Promise(r=>{this.indexeddbProvider.once("synced",r)}),
console.log("[StateManager] IndexedDB persistence loaded")),this.networkManager&&!this.config.disableNetworkProvider)try{
this.libp2pProvider=new cA(this.networkManager,this.ydoc,{topic:this.config.topic}),console.log("[StateManager] PeerComp\
ute P2P synchronization enabled")}catch(r){console.error("[StateManager] Failed to enable P2P sync:",r)}Object.keys(e).length>
0&&this.ydoc.transact(()=>{for(const[r,n]of Object.entries(e))this.state.set(r,n)}),this._setupObservers(),this.isInitialized=
!0,console.log("[StateManager] Initialized")}catch(r){throw console.error("[StateManager] Initialization failed:",r),r}}_setupObservers(){
this.state.observe(e=>{e.keysChanged.forEach(r=>{const n=this.state.get(r),s=this.subscribers.get(r);s&&s.forEach(i=>{try{
i(n,r)}catch(o){console.error("[StateManager] Subscriber error:",o)}}),this.globalSubscribers.forEach(i=>{try{i(n,r)}catch(o){
console.error("[StateManager] Global subscriber error:",o)}})})},{captureTransactions:!1})}_setupFallbackSync(){this.libp2pNode&&
console.log("[StateManager] Using fallback P2P sync via NetworkManager")}read(e){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return this.state.get(e)}write(e,r){if(!this.isInitialized)throw new Error("StateManager\
 not initialized");this._safeSetMap(this.state,e,r),this.networkManager?.broadcast&&!this.config.disableBroadcast&&this.
networkManager.broadcast({type:"state-set",data:{key:e,value:r}}).catch(()=>{})}writeScoped(e,r,n){const s=this._getNamespaceMap(
e);this._safeSetMap(s,r,n),this.networkManager?.broadcast&&!this.config.disableBroadcast&&(!this.config.broadcastNamespaces||
this.config.broadcastNamespaces.includes(e))&&this.networkManager.broadcast({type:"state-set",data:{namespace:e,key:r,value:n}}).
catch(()=>{})}readScoped(e,r){const n=this.state.get(e);if(n)return n.get(r)}hasScoped(e,r){const n=this.state.get(e);return n?
n.has(r):!1}listNamespaceKeys(e){const r=this.state.get(e);return r?Array.from(r.keys()):[]}clearNamespace(e){const r=this.
state.get(e);if(!r)return;const n=Array.from(r.keys());this.ydoc.transact(()=>{n.forEach(s=>r.delete(s))}),this.networkManager?.
broadcast&&!this.config.disableBroadcast&&n.forEach(s=>{this.networkManager.broadcast({type:"state-set",data:{namespace:e,
key:s,value:void 0}}).catch(()=>{})})}deleteScoped(e,r){const n=this.state.get(e);n&&(n.delete(r),this.networkManager?.broadcast&&
!this.config.disableBroadcast&&this.networkManager.broadcast({type:"state-set",data:{namespace:e,key:r,value:void 0}}).catch(
()=>{}))}delete(e){if(!this.isInitialized)throw new Error("StateManager not initialized");this.state.delete(e)}has(e){if(!this.
isInitialized)throw new Error("StateManager not initialized");return this.state.has(e)}_safeSetMap(e,r,n){if(this.persistenceFailed){
e.set(r,n);return}try{e.set(r,n)}catch(s){if(s?.name==="InvalidStateError")console.warn("[StateManager] Persistence unav\
ailable, disabling IndexedDB provider",s),this.indexeddbProvider?.destroy?.(),this.indexeddbProvider=null,this.persistenceFailed=
!0,e.set(r,n);else throw s}}batchWrite(e){if(!this.isInitialized)throw new Error("StateManager not initialized");this.ydoc.
transact(()=>{for(const[r,n]of Object.entries(e))this.state.set(r,n)})}subscribe(e,r){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return e==="*"?(this.globalSubscribers.add(r),()=>{this.globalSubscribers.delete(r)}):(this.
subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(r),()=>{const n=this.subscribers.get(e);
n&&(n.delete(r),n.size===0&&this.subscribers.delete(e))})}observeNamespace(e,r){let n=this._getNamespaceMap(e),s=new Set(
n.keys()),i=null,o=!0;const a=()=>{const f=this.state.get(e);return f instanceof Yn?f:null};let c;const l=(f,h=null)=>{if(!o||
f===n)return;const p=s,m=f?Array.from(f.entries()):[],b=new Set(m.map(([g])=>g));n?.unobserve(c),n=f,s=b,i=h,n?.observe(
c);for(const g of p)if(!b.has(g)){if(!o||a()!==n)return;r(void 0,g)}for(const[g,u]of m){if(!o||a()!==n)return;r(u,g)}};c=
(f,h)=>{if(!o||f.target!==n)return;const p=a();if(p!==n){l(p,h);return}h!==i&&f.keysChanged.forEach(m=>{!o||f.target!==n||
a()!==n||(n.has(m)?s.add(m):s.delete(m),r(n.get(m),m))})};const d=(f,h)=>{!o||!f.keysChanged.has(e)||l(a(),h)};return n.
observe(c),this.state.observe(d),()=>{o&&(o=!1,n?.unobserve(c),this.state.unobserve(d))}}keys(){if(!this.isInitialized)throw new Error(
"StateManager not initialized");return Array.from(this.state.keys())}values(){if(!this.isInitialized)throw new Error("St\
ateManager not initialized");return Array.from(this.state.values())}entries(){if(!this.isInitialized)throw new Error("St\
ateManager not initialized");return Array.from(this.state.entries())}async synchronize(e){console.log("[StateManager] Sy\
nchronization is automatic with Yjs CRDT")}snapshot(){if(!this.isInitialized)throw new Error("StateManager not initializ\
ed");return{data:Object.fromEntries(this.state.entries()),timestamp:Date.now(),version:this.ydoc.clientID,keyCount:this.
state.size}}getYDoc(){return this.ydoc}getYMap(){return this.state}getAwareness(){return this.libp2pProvider?.awareness||
null}async requestProviderSync(){return this.libp2pProvider?.requestSync?(await this.libp2pProvider.requestSync(),!0):!1}clear(){
if(!this.isInitialized)throw new Error("StateManager not initialized");this.ydoc.transact(()=>{this.state.clear()})}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.destroying=(async()=>{const e=[],r=async n=>{try{await n()}catch(s){
e.push(s)}};for(const n of[...this.agentRecordStores.values()])await r(()=>n.destroy());if(await r(()=>this.dataState.destroyArtifactStores()),
await r(()=>this.dataState.destroyLocalArtifactCaches()),this.libp2pProvider&&(await r(()=>this.libp2pProvider.destroy()),
this.libp2pProvider=null),this.indexeddbProvider&&(await r(()=>this.indexeddbProvider.destroy()),this.indexeddbProvider=
null),this.subscribers.clear(),this.globalSubscribers.clear(),await r(()=>this.ydoc.destroy()),this.isInitialized=!1,console.
log("[StateManager] Destroyed"),e.length)throw new AggregateError(e,"StateManager cleanup failed")})(),this.destroying)}async clearPersistence(){
if(this.indexeddbProvider?.clearData)try{await this.indexeddbProvider.clearData(),console.log("[StateManager] IndexedDB \
persistence cleared")}catch(e){console.error("[StateManager] Failed to clear IndexedDB persistence",e)}}async clearAllPersistenceByPrefix(e,r=[]){
if(typeof indexedDB?.databases=="function")try{const n=await indexedDB.databases();for(const s of n||[])s?.name&&s.name.
startsWith(e)&&!r.includes(s.name)&&await new Promise((i,o)=>{const a=indexedDB.deleteDatabase(s.name);a.onsuccess=()=>i(),
a.onerror=()=>o(a.error),a.onblocked=()=>i()});console.log(`[StateManager] Cleared IndexedDB databases with prefix ${e}`)}catch(n){
console.warn("[StateManager] Failed to enumerate/delete IndexedDB databases",n)}}getDocName(){return this.config.docName}getStats(){
const e=this.dataState.getLocalArtifactCacheStats(),r=this.dataState.getArtifactStoreStats();return{isInitialized:this.isInitialized,
keyCount:this.state.size,subscriberCount:this.subscribers.size,globalSubscriberCount:this.globalSubscribers.size,hasPersistence:!!this.
indexeddbProvider,hasP2PSync:!!this.libp2pProvider,docName:this.config.docName,topic:this.config.topic,hotBufferCount:this.
dataState?.listHotBuffers?.().length||0,localArtifactCacheCount:e.caches,localArtifactCacheEntryCount:e.entries,localArtifactCacheResidentBytes:e.
residentBytes,localArtifactCachePendingCount:e.pending,artifactStoreCount:r.stores,artifactStoredBytes:r.storedBytes,artifactPendingCount:r.
pending}}}const Du=new Map,$u=new Map,XB={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array};function _1(t="Uint8Array"){const e=XB[t];if(!e)throw new Error(
`Unsupported typed array view: ${t}`);return e}function ZB(t){return new t.constructor(t)}function C1(t){return ArrayBuffer.
isView(t)&&!(t instanceof DataView)}function eL(t){return t instanceof ArrayBuffer?new Uint8Array(t):C1(t)?new Uint8Array(
t.buffer,t.byteOffset,t.byteLength):Array.isArray(t)?Uint8Array.from(t):null}async function Qp(t){const e=String(t);return Du.
has(e)||Du.set(e,qt(()=>import(`${e}`),[],import.meta.url)),Du.get(e)}async function ty(t){const e=eL(t);if(e)
return e;if(typeof t=="string"||t instanceof URL){const r=await fetch(String(t));if(!r.ok)throw new Error(`Failed to fet\
ch wasm module: ${r.status} ${r.statusText}`);const n=await r.arrayBuffer();return new Uint8Array(n)}throw new Error("wa\
sm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function tL(t){if(typeof t=="string"||
t instanceof URL){const r=String(t);return $u.has(r)||$u.set(r,(async()=>{const n=await ty(t);return WebAssembly.compile(
n)})()),$u.get(r)}const e=await ty(t);return WebAssembly.compile(e)}async function rL(t,e){if(t.importsModule){const r=await Qp(
t.importsModule),n=t.importsExport||"default",s=r[n];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="obje\
ct")return s;throw new Error(`WASM imports export "${n}" must be a function or object`)}return t.imports&&typeof t.imports==
"object"?t.imports:{}}function T1(t,e,r={}){const n=r.exportName||e.memoryExport||"memory",s=t.exports?.[n];if(!(s instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return s}function nL(t,e){if(Object.prototype.
hasOwnProperty.call(t,"values"))return t.values;const r=t.dataKey||t.name;if(r&&e&&Object.prototype.hasOwnProperty.call(
e,r))return e[r]}function sL(t,e){if(t==null)return null;if(t instanceof e)return t;if(C1(t))return new e(t.buffer,t.byteOffset,
Math.floor(t.byteLength/e.BYTES_PER_ELEMENT));if(t instanceof ArrayBuffer)return new e(t);if(Array.isArray(t))return e.from(
t);throw new Error(`Unsupported memory input for ${e.name}`)}function ry(t,e,r){(Array.isArray(e.inputViews)?e.inputViews:
[]).forEach(s=>{const i=_1(s.view),o=sL(nL(s,r),i);if(!o)return;const a=T1(t,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0;new i(a.buffer,c,o.length).set(o)})}function iL(t,e){const r=Array.isArray(e.outputViews)?e.outputViews:[];if(r.length===
0)return null;const n={};return r.forEach((s,i)=>{const o=_1(s.view),a=T1(t,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0,l=Number.isFinite(s.length)?s.length:0;if(l<=0)throw new Error(`WASM output view "${s.name||i}" must provide a positiv\
e length`);const d=s.name||`output${i}`;n[d]=ZB(new o(a.buffer,c,l))}),n}function R1(t,e){return Array.isArray(e.args)?e.
args:Array.isArray(t.args)?t.args:Array.isArray(t.data?.args)?t.data.args:[]}function oL(t={}){const e=globalThis.navigator?.
gpu??null;if(t.webgpu?.required===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!e,gpu:e,async requestAdapter(n=t.webgpu?.adapterOptions){return e?e.requestAdapter(n):null},async requestDevice(n={}){
if(!e)return null;const s=n.adapter||await e.requestAdapter(n.adapterOptions||t.webgpu?.adapterOptions);return s?s.requestDevice(
n.deviceDescriptor||t.webgpu?.deviceDescriptor):null}}}async function M1(t){const e=t.wasm||{},r=e.source??t.wasmSource??
t.source;if(!r)throw new Error("wasm tasks require wasm.source");const n=await tL(r),s=await rL(e,{task:t,data:t.data??null,
WebAssembly}),i=await WebAssembly.instantiate(n,s);return ry(i,e,t.data??null),{module:n,instance:i,exports:i.exports,imports:s,
task:t,data:t.data??null,callExport(o,a=[]){const c=i.exports?.[o];if(typeof c!="function")throw new Error(`WASM export \
"${o}" was not found`);return c(...a)},readOutputViews(){return iL(i,e)},writeInputViews(o){ry(i,e,o)}}}async function aL(t,e,r){
const n=t.wasm||{};if(!n.resultModule)return r.value;const s=await Qp(n.resultModule),i=n.resultExport||"default",o=s[i];
if(typeof o!="function")throw new Error(`WASM result export "${i}" must be a function`);const a=await o({...r,wasm:e,task:t,
data:t.data??null});return typeof a>"u"?r:a}async function cL(t){const e=await M1(t),r=t.wasm||{},n=R1(t,r),s=r.entry?await e.
callExport(r.entry,n):void 0,i=e.readOutputViews();return aL(t,e,{returnValue:s,outputs:i,value:i?typeof s>"u"?i:{returnValue:s,
outputs:i}:s})}async function lL(t){const e=await M1(t),r=t.hostModule||t.module;if(!r)throw new Error("wasm-webgpu task\
s require hostModule or module");t.wasm?.callEntryBeforeHost&&t.wasm.entry&&(e.entryResult=await e.callExport(t.wasm.entry,
R1(t,t.wasm)));const n=await Qp(r),s=t.hostExport||t.exportName||"default",i=n[s];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return i({task:t,data:t.data??null,wasm:e,webgpu:oL(t)})}async function dL(t){
if(typeof t!="string"||!t.trim())throw new Error("module path must be a non-empty string");return t==="peercompute:model\
-inference"?qt(()=>Promise.resolve().then(()=>sN),void 0,import.meta.url):t==="peercompute:gguf-inference"?qt(
()=>import("./modelTask-CmafPIxd.js"),__vite__mapDeps([0,1,2]),import.meta.url):t==="peercompute:diffusion-inference"?qt(()=>import("./modelTask-Dcv1etEJ.js"),
__vite__mapDeps([3,2,1]),import.meta.url):t==="peercompute:speech-inference"?qt(()=>import("./modelTask-sUw3Wgcr.js"),__vite__mapDeps([4,2]),
import.meta.url):qt(()=>import(`${t}`),[],import.meta.url)}function uL(t={}){return typeof t.runtime=="str\
ing"&&t.runtime.trim()?t.runtime.trim().toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"js"}async function fL(t,e){
let r;if(t.fn?r=new Function(`return (${t.fn});`)():t.module&&(r=(await dL(t.module))[t.exportName||"default"]),typeof r!=
"function")throw new Error("Handler not found for task");return r(t.data,e)}async function hL(t,e={}){const r=uL(t);switch(r){case"\
js":return fL(t,e);case"wasm":return cL(t);case"wasm-webgpu":return lL(t);default:throw new Error(`Unsupported compute r\
untime: ${r}`)}}const pL="peercompute.compute.solver-descriptor.v0",mL="peercompute.compute.solver-task.v0";function Fl(t,e){
const r=String(t||"").trim();if(!r)throw new Error(`${e} is required`);return r}function ta(t){return t==null?t:JSON.parse(
JSON.stringify(t))}function gL(t){if(typeof t=="string")return{name:Fl(t,"field.name"),unit:null,dimensions:null,location:null};
if(!t||typeof t!="object")throw new Error("field must be a string or object");return{name:Fl(t.name,"field.name"),unit:t.
unit??null,dimensions:t.dimensions??null,location:t.location??null,role:t.role??null}}function Nu(t=[]){if(!Array.isArray(
t))throw new Error("fields must be an array");return t.map(gL)}function bL(t){return t.runtime?String(t.runtime).trim().
toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"js"}function yL(t={}){if(!t||typeof t!="object")throw new Error(
"solver descriptor is required");const e=Fl(t.id,"solver.id"),r=Fl(t.kind||t.family,"solver.kind"),n=bL(t),s=!!(t.module||
t.fn||t.wasm||t.wasmSource||t.source);return{schema:pL,id:e,kind:r,version:t.version||"0.0.0",label:t.label||e,description:t.
description||"",runtime:n,module:t.module,exportName:t.exportName||"default",fn:t.fn,hostModule:t.hostModule,hostExport:t.
hostExport,wasm:t.wasm,wasmSource:t.wasmSource,source:t.source,webgpu:t.webgpu||null,inputFields:Nu(t.inputFields||t.inputs||
[]),outputFields:Nu(t.outputFields||t.outputs||[]),conservedFields:Nu(t.conservedFields||t.conserved||[]),timestep:{mode:t.
timestep?.mode||t.timestepMode||"explicit",maxDt:t.timestep?.maxDt??t.maxDt??null,subcycles:t.timestep?.subcycles??t.subcycles??
1},validity:ta(t.validity||t.validityDomain||{}),affinity:{policy:t.affinity?.policy||t.affinityPolicy||"state-key",keyFields:Array.
isArray(t.affinity?.keyFields)?[...t.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{scope:t.warmDelta?.scope||t.
scope||"solver-deltas",schema:t.warmDelta?.schema||`peercompute.solver.${e}.delta.v0`},metadata:ta(t.metadata||{}),hasExecutor:s}}
class wL{constructor(e=[]){this.solvers=new Map;for(const r of e)this.register(r)}register(e){const r=yL(e);return this.
solvers.set(r.id,r),r}unregister(e){return this.solvers.delete(e)}has(e){return this.solvers.has(e)}get(e){const r=this.
solvers.get(e);if(!r)throw new Error(`Solver not registered: ${e}`);return r}list(){return Array.from(this.solvers.values()).
map(e=>ta(e))}createTask(e,{id:r,input:n={},stateKey:s=n.stateKey||n.taskId||e,affinityKey:i,scope:o,version:a,timestamp:c,
data:l={},placementHint:d,webgpu:f}={}){const h=this.get(e);if(!h.hasExecutor)throw new Error(`Solver has no executable \
task target: ${e}`);const p=r||`${h.id}:${s}:${Date.now()}`,m=o||h.warmDelta.scope,b=d??l.placementHint??null;return{id:p,
solverId:h.id,taskFamily:h.id,runtime:h.runtime,module:h.module,exportName:h.exportName,fn:h.fn,hostModule:h.hostModule,
hostExport:h.hostExport,wasm:h.wasm,wasmSource:h.wasmSource,source:h.source,webgpu:f||h.webgpu||void 0,affinityKey:i||`${h.
id}:${s}`,placementHint:ta(b),data:{schema:mL,solver:{id:h.id,kind:h.kind,version:h.version,inputFields:h.inputFields,outputFields:h.
outputFields,conservedFields:h.conservedFields,timestep:h.timestep,validity:h.validity,warmDelta:{scope:m,schema:h.warmDelta.
schema}},stateKey:s,scope:m,version:a??null,timestamp:c??Date.now(),input:n,...l,placementHint:ta(b)}}}}const vL="peerco\
mpute.compute.gpu-resident-lane-manager.v0",EL="peercompute.compute.gpu-resident-lane.v0",kL="peercompute.compute.gpu-re\
sident-lane-lease.v0",xL="peercompute.compute.gpu-resident-lane-lease-identity.v0",SL="peercompute.compute.gpu-resident-\
lane-execution.v0",B1="peercompute.compute.gpu-resident-lane-copy-budget.v0",AL="peercompute.compute.gpu-fence-report.v0",
IL="peercompute.compute.gpu-resident-lane-stage-plan.v0",_L="peercompute.compute.gpu-resident-lane-stage-execution.v0",CL="\
peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0",hh="queue.onSubmittedWorkDone-before-readback-map",L1="\
explicit-stage-dependencies",ny="sequential-stage-order",TL="defer-read-write-conflicting-ready-stages";function gc(t,e=0){
const r=Number(t);return Number.isFinite(r)?r:e}function We(t,e=null){return String(t??"").trim()||e}function Dt(t,e=[]){
return Array.isArray(t)?t.map(r=>We(r)).filter(Boolean):typeof t=="string"?t.split(",").map(r=>We(r)).filter(Boolean):[...e]}
function st(t){return t==null?t:JSON.parse(JSON.stringify(t))}function sy(t={}){const e=t?.residentSequenceLaneContract||
t?.residentLaneContract||t?.laneContract||t?.executionContract||null;return!e||typeof e!="object"?null:st(e)}function RL(t={},e=0){
const r=We(t.id,`stage:${e}`);return{...st(t),id:r,index:e,lawNodeId:We(t.lawNodeId,null),runtimeTarget:We(t.runtimeTarget,
null),dependsOn:Dt(t.dependsOn??t.dependencies),inputFrom:We(t.inputFrom??t.primaryInputFrom??t.inputStageId,null),reads:Dt(
t.reads??t.readFamilies),writes:Dt(t.writes??t.writeFamilies)}}function bc(t=null,{laneId:e=null,stateKey:r=null,domainKey:n=null,
queueFencePolicy:s=null}={}){if(!t||typeof t!="object")return null;const i=Array.isArray(t.passDagStages)?t.passDagStages.
map((a,c)=>RL(a,c)):[],o=We(t.stageDependencyMode??t.dependencyMode,i.some(a=>a.dependsOn.length>0)||t.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:IL,status:i.length>0?t.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:We(t.laneId,e),stateKey:We(t.stateKey,r),domainKey:We(t.domainKey,n),queueFencePolicy:We(t.
queueFencePolicy,s||hh),contractSchema:We(t.schema,null),contractStatus:We(t.status,null),sequenceMode:We(t.sequenceMode,
null),sequenceRunnable:t.sequenceRunnable===!0,defaultEnabled:t.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o===
"explicit-stage-dependencies",stageCount:i.length,stages:i}}function ML(t={}){const e=t&&typeof t=="object"?t:{value:t};
return{value:Object.prototype.hasOwnProperty.call(e,"value")?e.value:t,retainedBufferRefs:Dt(e.retainedBufferRefs??e.gpuFence?.
retainedBufferRefs),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?st(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?st(e.summary):null}}function zl(t={}){const e=t.copyBudget&&typeof t.copyBudget=="object"?t.copyBudget:t;return{
schema:B1,uploadBytes:Math.max(0,Math.round(gc(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
gc(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(gc(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(gc(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:We(e.fullReadbackReason??
e.readbackReason,null)}}function BL(t={},e={}){const r=zl(t),n=zl(e);return{schema:B1,uploadBytes:r.uploadBytes+n.uploadBytes,
readbackBytes:r.readbackBytes+n.readbackBytes,retainedBytes:Math.max(r.retainedBytes,n.retainedBytes),compactSummaryBytes:r.
compactSummaryBytes+n.compactSummaryBytes,fullReadbackReason:n.fullReadbackReason||r.fullReadbackReason||null}}function LL(t={}){
return t.parallelStageExecution===!0||t.dependencyMode===L1||(t.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function DL(t,{
baseInput:e=null,currentValue:r=null,stageValues:n={}}={}){if(t.inputFrom&&Object.prototype.hasOwnProperty.call(n,t.inputFrom))
return n[t.inputFrom];const s=Dt(t.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(n,s[0])?n[s[0]]:
s.length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(i=>[i,n[i]])),previousValue:r,
baseInput:e}:r}function Pu(t=[],e=[]){const r=new Set(Dt(e));return Dt(t).filter(n=>r.has(n))}function $L(t={},e={}){const r=Pu(
t.writes,e.writes);if(r.length>0)return{conflictType:"write-write",families:r};const n=Pu(t.writes,e.reads);if(n.length>
0)return{conflictType:"write-read",families:n};const s=Pu(t.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function NL(t=[]){const e=[],r=[];for(const n of t){const s=e.map(i=>({stage:i,conflict:$L(i,n)})).find(
i=>i.conflict);s?r.push({stageId:n.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(n)}return{batch:e,deferred:r}}function PL(t={}){const e=new Set((t.stages||[]).map(r=>r.id));for(const r of t.
stages||[])for(const n of r.dependsOn||[])if(!e.has(n)){const s=new Error(`GPU resident lane stage ${r.id} depends on un\
known stage ${n}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=st(r),s}}function iy(t={}){PL(t);
const e=LL(t),r=[],n=[];if(e){const s=new Map((t.stages||[]).map(o=>[o.id,o])),i=new Set;for(;s.size>0;){const o=(t.stages||
[]).filter(d=>s.has(d.id)).filter(d=>(d.dependsOn||[]).every(f=>i.has(f)));if(!o.length){const d=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw d.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",d}const{batch:a,deferred:c}=NL(o),l=r.length;n.push(...c.map(d=>({...d,batchIndex:l}))),
r.push(a.map(d=>d.id));for(const d of a)s.delete(d.id),i.add(d.id)}}else for(const s of t.stages||[])r.push([s.id]);return{
dependencyMode:e?L1:ny,parallelStageExecution:e,stateFamilyConflictPolicy:e?TL:ny,stateFamilyConflictDeferrals:n,stateFamilyConflictDeferralCount:n.
length,executionBatches:r,maxConcurrentStageCount:r.reduce((s,i)=>Math.max(s,i.length),0)}}function OL(t={},{batchIndex:e=-1,
executorSource:r=null,gpuHubExecutorDescriptor:n=null}={}){const s=st(n?.workerPolicy),i=We(s?.mode,null),o=s?.status===
"worker-ready",a=i==="dedicated-worker";let c="missing-stage-executor";return r==="stage-plan-executor"?c="stage-plan-ex\
ecutor":r==="provided-stage-executor"?c="provided-stage-executor":r==="gpu-hub-resident-stage-executor"&&(o?c="gpu-hub-w\
orker-resident-stage":a?c="gpu-hub-inline-fallback-for-worker-stage":c="gpu-hub-inline-resident-stage"),{stageId:t.id,lawNodeId:t.
lawNodeId,runtimeTarget:t.runtimeTarget,batchIndex:e,dependsOn:Dt(t.dependsOn),inputFrom:We(t.inputFrom,null),reads:Dt(t.
reads),writes:Dt(t.writes),executorSource:r,placementTarget:c,gpuHubExecutorDescriptor:st(n),workerPolicy:s,workerResidencyStatus:s?.
status||null,workerRequested:a,workerReady:o,sameDeviceRequired:s?.sameDeviceRequired===!0,bufferTransferPolicy:s?.bufferTransferPolicy||
null}}function UL(t){return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consum\
er-queue-completed"].includes(String(t||""))}class FL{constructor({gpuHub:e=null,deviceId:r="gpu-hub",now:n=()=>Date.now()}={}){
this.gpuHub=e,this.deviceId=r,this.now=n,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:vL,
laneCount:0,activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:r,domainKey:n,solverId:s}={}){return We(e,`gpu-lane:${We(
r||n||s,"default")}`)}getOrCreateLane(e={}){const r=this.resolveLaneId(e),n=We(e.stateKey,null),s=We(e.sourceFamily,null),
i=this.lanes.get(r);if(i){if(n&&i.stateKey&&i.stateKey!==n)throw new Error(`GPU resident lane ${r} already owns stateKey\
 ${i.stateKey}, not ${n}`);if(n&&!i.stateKey&&(i.stateKey=n),s&&i.sourceFamily&&i.sourceFamily!==s)throw new Error(`GPU \
resident lane ${r} already owns sourceFamily ${i.sourceFamily}, not ${s}`);return s&&!i.sourceFamily&&(i.sourceFamily=s),
e.domainKey&&!i.domainKey&&(i.domainKey=We(e.domainKey,null)),e.solverId&&!i.solverId&&(i.solverId=We(e.solverId,null)),
i}const o={schema:EL,laneId:r,stateKey:n,sourceFamily:s,domainKey:We(e.domainKey,null),solverId:We(e.solverId,null),deviceId:We(
e.deviceId,this.deviceId),queueFencePolicy:We(e.queueFencePolicy,hh),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
Dt(e.retainedBufferRefs)),copyBudget:zl(e.copyBudget||{}),residentSequenceLaneContract:sy(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=bc(o.residentSequenceLaneContract,o),this.lanes.set(r,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const r=this.getOrCreateLane(e),n=We(e.leaseId,`${r.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(n))throw new Error(`GPU resident lane lease already exists: ${n}`);const s=zl(e.
copyBudget||{}),i=sy(e)||st(r.residentSequenceLaneContract),o=bc(i,{laneId:r.laneId,stateKey:r.stateKey,domainKey:r.domainKey,
queueFencePolicy:r.queueFencePolicy});i&&(r.residentSequenceLaneContract=st(i),r.stagePlan=st(o));const a={schema:kL,leaseId:n,
laneId:r.laneId,stateKey:r.stateKey,sourceFamily:We(e.sourceFamily,r.sourceFamily),domainKey:r.domainKey,solverId:We(e.solverId,
r.solverId),taskId:We(e.taskId,null),owner:We(e.owner,"compute-manager"),readFamilies:Dt(e.readFamilies),writeFamilies:Dt(
e.writeFamilies),retainedBufferRefs:Dt(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:r.queueFencePolicy,residentSequenceLaneContract:i,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(n,a),r.activeLeases.set(n,a),r.copyBudget=BL(r.copyBudget,s);for(const c of a.retainedBufferRefs)r.retainedBufferRefs.
add(c);return r.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),st(a)}createFenceReport(e,{status:r="queue-work-completed",method:n="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=r,queueCompletionMethod:i=n,readbackCompletionStatus:o=null,readbackCompletionMethod:a=null,
retainedBufferRefs:c=null,completed:l=null,source:d="gpu-resident-lane-manager"}={}){const f=typeof e=="string"?this.leases.
get(e):e;if(!f)throw new Error(`Unknown GPU resident lane lease: ${e}`);const h=this.lanes.get(f.laneId),p=l==null?UL(r):
l===!0;return{schema:AL,status:r,method:n,fenceSatisfied:p,required:!0,laneId:f.laneId,stateKey:f.stateKey,queueFencePolicy:f.
queueFencePolicy||h?.queueFencePolicy||hh,queueCompletionStatus:s,queueCompletionMethod:i,readbackCompletionStatus:o,readbackCompletionMethod:a,
retainedBufferRefs:Dt(c,f.retainedBufferRefs),workerId:null,deviceId:h?.deviceId||this.deviceId,completedAt:p?this.now():
null,source:d}}completeLease(e,r={}){const n=this.leases.get(e);if(!n)throw new Error(`Unknown GPU resident lane lease: ${e}`);
const s=this.lanes.get(n.laneId),i=this.createFenceReport(n,r);if(n.status=i.fenceSatisfied?"completed":"completed-unsat\
isfied-fence",n.gpuFence=i,n.releasedAt=this.now(),n.releaseReason=r.releaseReason||n.status,Array.isArray(r.retainedBufferRefs)&&
(n.retainedBufferRefs=Dt(r.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=i,s.updatedAt=this.now();for(const o of n.
retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,
this.stats.completedLeaseCount+=1,this.stats.lastFence=st(i),{schema:SL,lease:st(n),gpuFence:i,lane:s?this.snapshotLane(
s.laneId):null,residentSequenceLaneContract:st(n.residentSequenceLaneContract),stagePlan:st(n.stagePlan),stageExecution:st(
n.stageExecution)}}async executeStagePlan(e,{input:r=null,context:n={},executor:s=null,stageExecutors:i={},allowMissingExecutors:o=!1}={}){
const a=typeof e=="string"?this.leases.get(e):e;if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const c=this.
lanes.get(a.laneId),l=a.stagePlan||bc(a.residentSequenceLaneContract,{laneId:a.laneId,stateKey:a.stateKey,domainKey:a.domainKey,
queueFencePolicy:a.queueFencePolicy});if(!l||!Array.isArray(l.stages)||l.stages.length===0){const k=new Error(`GPU resid\
ent lane lease ${a.leaseId} has no executable stage plan`);throw k.code="ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING",k}const d=this.
now(),f=[],h={},p=iy(l),m=new Map(l.stages.map(k=>[k.id,k]));let b=r;const g=async(k,A)=>{let S=typeof s=="function"?s:i?.[k.
id]||i?.[k.lawNodeId],v=typeof s=="function"?"stage-plan-executor":S?"provided-stage-executor":null;typeof S!="function"&&
this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(k)&&typeof this.
gpuHub.executeResidentStage=="function"&&(S=L=>this.gpuHub.executeResidentStage(L),v="gpu-hub-resident-stage-executor");
const w=v==="gpu-hub-resident-stage-executor"&&typeof this.gpuHub?.describeResidentStageExecutor=="function"?this.gpuHub.
describeResidentStageExecutor(k):null;if(typeof S!="function"){if(!o){const L=new Error(`Missing GPU resident lane stage\
 executor: ${k.id}`);throw L.code="ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING",L.stage=st(k),L}return{result:{stageId:k.
id,lawNodeId:k.lawNodeId,status:"blocked-missing-stage-executor",retainedBufferRefs:[],workerResidency:null},value:A}}const I=this.
now(),C=await S({stage:st(k),stageIndex:k.index,input:A,lease:st(a),lane:c?this.snapshotLane(c.laneId):null,context:n}),
T=ML(C),P=Dt(T.retainedBufferRefs);if(P.length>0&&(a.retainedBufferRefs=Dt([...a.retainedBufferRefs,...P]),c)){for(const L of P)
c.retainedBufferRefs.add(L);c.updatedAt=this.now()}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,runtimeTarget:k.runtimeTarget,
status:"completed",executorSource:v,startedAt:I,completedAt:this.now(),retainedBufferRefs:P,gpuFence:T.gpuFence,workerResidency:st(
w?.workerPolicy),summary:T.summary},value:T.value}};if(p.parallelStageExecution===!0)for(const k of p.executionBatches){
const A=k.map(v=>m.get(v)).filter(Boolean),S=await Promise.all(A.map(v=>g(v,DL(v,{baseInput:r,currentValue:b,stageValues:h}))));
for(let v=0;v<A.length;v+=1){const w=A[v],I=S[v];h[w.id]=I.value,b=I.value,f.push(I.result)}}else for(const k of p.executionBatches){
const A=m.get(k[0]),S=await g(A,b);b=S.value,h[A.id]=S.value,f.push(S.result)}const y=f.some(k=>k.status!=="completed"),
E={schema:_L,status:y?"blocked":"completed",leaseId:a.leaseId,laneId:a.laneId,stateKey:a.stateKey,stagePlan:st(l),stageCount:l.
stages.length,completedStageCount:f.filter(k=>k.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:f,retainedBufferRefs:Dt(a.retainedBufferRefs),output:b,startedAt:d,completedAt:this.
now()};return a.stageExecution=st(E),c&&(c.updatedAt=this.now()),E}preflightStagePlacement(e,{executor:r=null,stageExecutors:n={},
allowMissingExecutors:s=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(i.laneId),a=i.stagePlan||bc(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!a||!Array.isArray(a.stages)||a.stages.
length===0){const g=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw g.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",g}const c=iy(a),l=new Map;c.executionBatches.forEach((g,u)=>{for(const y of g)l.set(y,
u)});const d=a.stages.map(g=>{let u=typeof r=="function"?r:n?.[g.id]||n?.[g.lawNodeId],y=typeof r=="function"?"stage-pla\
n-executor":u?"provided-stage-executor":null,E=null;return typeof u!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(g)&&typeof this.gpuHub.describeResidentStageExecutor=="function"&&(E=this.
gpuHub.describeResidentStageExecutor(g),y="gpu-hub-resident-stage-executor"),OL(g,{batchIndex:l.get(g.id)??-1,executorSource:y,
gpuHubExecutorDescriptor:E})}),f=d.filter(g=>!g.executorSource).map(g=>g.stageId),h=d.filter(g=>g.workerRequested).map(g=>g.
stageId),p=d.filter(g=>g.workerReady).map(g=>g.stageId),m=d.filter(g=>g.workerRequested&&!g.workerReady).map(g=>g.stageId),
b=s===!0||f.length===0;return{schema:CL,status:b?"placement-preflight-ready":"blocked-missing-stage-executors",authority:"\
compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,domainKey:i.
domainKey,deviceId:o?.deviceId||this.deviceId,stagePlan:st(a),stageCount:a.stages.length,dependencyMode:c.dependencyMode,
parallelStageExecution:c.parallelStageExecution,stateFamilyConflictPolicy:c.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:c.
stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:c.stateFamilyConflictDeferralCount,placementBatches:c.executionBatches,
maxConcurrentStageCount:c.maxConcurrentStageCount,stagePlacements:d,executorSources:Object.fromEntries(d.map(g=>[g.stageId,
g.executorSource])),workerResidencyStatuses:Object.fromEntries(d.map(g=>[g.stageId,g.workerResidencyStatus])),missingExecutorStageIds:f,
missingExecutorCount:f.length,workerRequestedStageIds:h,workerRequestedCount:h.length,workerReadyStageIds:p,workerReadyCount:p.
length,workerFallbackStageIds:m,workerFallbackCount:m.length,canExecute:b,createdAt:this.now()}}planStagePlacement(e,r={}){
return this.preflightStagePlacement(e,r)}rejectLease(e,r="lane-validation-rejected"){const n=this.leases.get(e);if(!n)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(n.laneId);return n.status="rejected",n.releasedAt=this.now(),
n.releaseReason=r,s&&(s.activeLeases.delete(e),s.updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=
this.leases.size,this.stats.rejectedLeaseCount+=1,st(n)}snapshotLane(e){const r=this.lanes.get(e);return r?{schema:r.schema,
laneId:r.laneId,stateKey:r.stateKey,domainKey:r.domainKey,solverId:r.solverId,deviceId:r.deviceId,queueFencePolicy:r.queueFencePolicy,
status:r.status,activeLeaseCount:r.activeLeases.size,retainedBufferRefs:[...r.retainedBufferRefs].sort(),copyBudget:st(r.
copyBudget),residentSequenceLaneContract:st(r.residentSequenceLaneContract),stagePlan:st(r.stagePlan),createdAt:r.createdAt,
updatedAt:r.updatedAt,lastFence:st(r.lastFence)}:null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(
e))}getStats(){return{...st(this.stats),laneCount:this.lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}
function zL(){return new Worker(new URL(""+new URL("computeWorker-D83yf32r.js",import.meta.url).href,import.meta.url),{type:"\
module"})}const oy=128,ay=5e3,qL="peercompute.compute.worker-utilization.v0",cy="peercompute.compute.task-placement.v0",
jL="peercompute.compute.remote-placement-provenance.v0",Ou="peercompute.compute.remote-placement-verification.v0",ly="pe\
ercompute.compute.remote-placement-validation.v0",To="peercompute.compute.remote-placement-retry.v0",dy="peercompute.com\
pute.remote-task-envelope.v0",uy="peercompute.compute.task-packet.v0",GL="peercompute.compute.task-execution.v0",fy="pee\
rcompute.compute.task-graph-result.v0",WL="peercompute.compute.task-graph-context.v0",HL="peercompute.compute.task-graph\
-cache-policy.v0",VL="peercompute.compute.task-graph-cache-inputs.v0",KL="peercompute.compute.task-graph-cache-artifact.\
v0",ph="peercompute.compute.task-graph-cache-admission.v0",hy="peercompute.compute.remote-task-graph-cache-import.v0",QL="\
peercompute.compute.remote-task-graph-state-seed-policy.v0",JL="peercompute.compute.task-graph-placement-policy.v0",Uu="\
peercompute.compute.task-graph-cancellation.v0",D1="peercompute.compute.task-graph-gpu-resident-lane.v0",YL="peercompute\
.compute.gpu-fence-report.v0",Ai=["timeout","executor-error"],yc=["rejected","verification-failed","validation-failed"],
XL=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","\
maxComputeWorkgroupsPerDimension"];function Se(t,e,r=0,n=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(t));return Number.
isFinite(s)?Math.min(n,Math.max(r,s)):e}function Br(t,e,r=0,n=Number.MAX_SAFE_INTEGER){const s=Number(t);return Number.isFinite(
s)?Math.min(n,Math.max(r,s)):e}function ZL({cpuCores:t,deviceMemoryGB:e,gpuAvailable:r,declaredTier:n}){return n?String(
n):t>=32||e>=64?"cluster":r&&(t>=12||e>=16)?"workstation":t<=4||e&&e<=4?"mobile":"laptop"}function mh(t){return t==="clu\
ster"?8192:t==="workstation"?2048:t==="mobile"?384:1024}function $1(t){return t==="cluster"?4096:t==="workstation"?1024:
t==="mobile"?192:512}function eD({tier:t,deviceMemoryGB:e}){const r=mh(t);if(!e)return r;const n=e*1024*.25;return Math.
max(128,Math.min(r,n))}function N1(t={}){if(!t)return null;const e=t.gpuLimits||t,r={};for(const n of XL){const s=Se(e[n],
null,0,Number.MAX_SAFE_INTEGER);s!=null&&(r[n]=s)}return Object.keys(r).length>0?r:null}function Fu(t={},e={}){const r=typeof navigator<
"u"?navigator:null,n=Se(t.cpuCores??t.hardwareConcurrency??r?.hardwareConcurrency,4,1,512),s=Br(t.deviceMemoryGB??t.deviceMemory??
r?.deviceMemory,null,0,2048),i=t.gpuAvailable??e.webgpu??!!r?.gpu,o=ZL({cpuCores:n,deviceMemoryGB:s??0,gpuAvailable:i,declaredTier:t.
tier||t.deviceClass}),a=Br(t.memoryBudgetMB??t.ramBudgetMB,eD({tier:o,deviceMemoryGB:s}),0,1048576),c=Br(t.gpuMemoryBudgetMB??
t.gpuBudgetMB??t.vramBudgetMB,i?$1(o):0,0,1048576),l=Br(t.budgetScale??t.resourceBudgetScale??t.computeScale,1,.05,64),d=N1(
t.gpuLimits||{maxBufferSize:t.gpuMaxBufferSize??t.maxBufferSize,maxStorageBufferBindingSize:t.gpuMaxStorageBufferBindingSize??
t.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:t.gpuMaxComputeWorkgroupStorageSize??t.maxComputeWorkgroupStorageSize,
maxComputeInvocationsPerWorkgroup:t.gpuMaxComputeInvocationsPerWorkgroup??t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.
gpuMaxComputeWorkgroupsPerDimension??t.maxComputeWorkgroupsPerDimension});return{schema:"peercompute.compute.resource-pr\
ofile.v0",tier:o,cpuCores:n,deviceMemoryGB:s,memoryBudgetMB:a,gpuMemoryBudgetMB:c,budgetScale:l,gpuLimits:d,gpuLimitsSource:d?
t.gpuLimitsSource||"configured":null,gpuAvailable:!!i,wasmAvailable:!!e.wasm,source:t.source||(t.tier?"configured":"brow\
ser")}}function tD(t){const e=t.cpuCores||4;return t.tier==="cluster"?Math.min(64,Math.max(8,e)):t.tier==="workstation"?
Math.min(16,Math.max(4,e)):t.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.floor(e*.75)))}function zu(t={},e){
const r=Se(t.maxWorkers,null,1,oy),n=tD(e),s=r??Math.min(oy,Math.max(n,e.cpuCores||n)),i=Se(t.minWorkers,Math.min(s,e.tier===
"mobile"?1:2),0,s),o=Se(t.targetWorkers??t.initialWorkers,Math.min(s,Math.max(i,n)),i,s);return{schema:"peercompute.comp\
ute.worker-policy.v0",autoScale:t.autoScaleWorkers!==!1,minWorkers:i,targetWorkers:o,maxWorkers:s,scaleUpQueueDepth:Se(t.
scaleUpQueueDepth,1,1,1024),idleScaleDownMs:Se(t.idleScaleDownMs,5e3,0,6e5)}}function rD(t){return t==="cluster"?4:t==="\
workstation"?2:t==="mobile"?.5:1}function nD(t){return t==="cluster"?4:t==="workstation"?2:1}function sD(t){return t==="\
cluster"?64:t==="workstation"?16:t==="mobile"?2:8}function wc(t,e=1){return Br(t,e,.25,8)}function iD(t){const e=String(
t||"");return e==="manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function oD(t,e){const r=Math.
max(1,e);return Math.max(r,Math.round(t/r)*r)}function Nr(){return typeof performance<"u"&&typeof performance.now=="func\
tion"?performance.now():Date.now()}function aD(t){const e=Math.max(0,Number(t)||0);return e<=0?Promise.resolve():new Promise(
r=>setTimeout(r,e))}function qu(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,
totalDurationMs:0}}function cD(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,timedOut:0,
rejected:0,verificationFailed:0,validationFailed:0}}function He(t,e=[]){return Array.isArray(t)?t.map(r=>String(r||"").trim()).
filter(Boolean):typeof t=="string"?t.split(",").map(r=>r.trim()).filter(Boolean):[...e]}function vc(...t){const e=new Set,
r=[];for(const n of t)for(const s of He(n,[]))e.has(s)||(e.add(s),r.push(s));return r}function Ce(...t){for(const e of t)
if(e!=null)return e;return null}function lD(t={}){const e=t.webgpu||t.data?.webgpu||{},r=t.gpuFence||t.gpuFenceRequirement||
e.gpuFence||e.fence||e.fenceRequirement||{},n=r.required===!0||r.fenceRequired===!0||e.fenceRequired===!0||e.requiresFence===
!0||e.requiresQueueFence===!0,s=Ce(r.laneId,r.gpuLaneId,e.laneId,e.gpuLaneId),i=Ce(r.stateKey,r.gpuStateKey,e.stateKey,e.
gpuStateKey,t.stateKey,t.data?.stateKey,t.data?.input?.stateKey),o=Ce(r.queueFencePolicy,r.fencePolicy,e.queueFencePolicy,
e.fencePolicy),a=He(r.retainedBufferRefs??e.retainedBufferRefs,[]);return!n&&!s&&!i&&!o&&a.length===0?null:{schema:"peer\
compute.compute.gpu-fence-requirement.v0",required:n,laneId:s?String(s):null,stateKey:i?String(i):null,queueFencePolicy:o?
String(o):null,retainedBufferRefs:a,source:r.source||(e&&Object.keys(e).length>0?"task.webgpu":"task.gpuFence")}}function dD(t={},e=null){
const r=t.webgpu||t.data?.webgpu||{},n=t.gpuResidentLane||t.gpuResidentLaneLease||t.residentLane||r.gpuResidentLane||r.residentLane||
{},s=Ce(n.residency,r.residency,t.residency,t.data?.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===!0||
String(s||"").trim().toLowerCase()==="gpu-lane",o=Ce(n.laneId,n.gpuLaneId,r.laneId,r.gpuLaneId,e?.laneId),a=Ce(n.stateKey,
n.gpuStateKey,r.stateKey,r.gpuStateKey,t.stateKey,t.data?.stateKey,t.data?.input?.stateKey,e?.stateKey),c=Ce(n.domainKey,
n.domain,r.domainKey,t.domainKey,t.data?.domainKey),l=Ce(n.sourceFamily,r.sourceFamily,t.data?.sourceFamily,t.data?.input?.
sourceFamily),d=Ce(n.queueFencePolicy,n.fencePolicy,r.queueFencePolicy,e?.queueFencePolicy),f=He(n.retainedBufferRefs??r.
retainedBufferRefs,e?.retainedBufferRefs||[]),h=n.copyBudget&&typeof n.copyBudget=="object"?JSON.parse(JSON.stringify(n.
copyBudget)):r.copyBudget&&typeof r.copyBudget=="object"?JSON.parse(JSON.stringify(r.copyBudget)):{},p=Ce(n.residentSequenceLaneContract,
n.residentLaneContract,n.laneContract,r.residentSequenceLaneContract,t.data?.residentSequenceLaneContract,t.data?.input?.
residentSequenceLaneContract,t.lawGraphNode?.residentSequenceLaneContract,null);return!i&&!o&&!a&&f.length===0&&Object.keys(
h).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task.v0",enabled:!0,localExecution:String(Ce(n.localExecution,
n.executionMode,r.localExecution,"inline")||"inline").trim().toLowerCase()==="worker"?"worker":"inline",laneId:o?String(
o):null,stateKey:a?String(a):null,sourceFamily:l?String(l):null,domainKey:c?String(c):null,solverId:Ce(n.solverId,t.solverId,
t.data?.solverId)||null,owner:Ce(n.owner,t.owner,t.taskFamily,t.solverId,"compute-manager-task"),readFamilies:He(n.readFamilies??
n.reads??r.readFamilies),writeFamilies:He(n.writeFamilies??n.writes??r.writeFamilies),retainedBufferRefs:f,queueFencePolicy:d?
String(d):null,copyBudget:h,residentSequenceLaneContract:p&&typeof p=="object"?Ue(p):null}}function Ue(t){if(t==null)return t;
if(typeof structuredClone=="function")try{return structuredClone(t)}catch{}return JSON.parse(JSON.stringify(t))}function uD(t={},e=[]){
const r=t.cacheInputs||t.cachePolicy?.inputs||t.cache?.inputs||t.inputRefs||null,n=r&&typeof r=="object"?r:{},s=He(n.stateRefs??
n.states??t.stateRefs),i=He(n.closureRefs??n.closures??t.closureRefs),o=He(n.invalidationRefs??n.invalidates??t.invalidationRefs),
a=He(n.retainedBufferRefs??t.retainedBufferRefs),c=He(n.inputHashes??n.hashes??t.inputHashes),l=He(n.lawIds??n.laws??t.lawIds),
d=He(n.stateFamilies??t.stateFamilies),f=He(n.readFamilies??t.readFamilies),h=He(n.writeFamilies??t.writeFamilies),p=Ce(
n.values,n.value,n.parameters,t.cacheInputValues,null),m=e.map(y=>({id:y.id,dependsOn:[...y.dependsOn],taskFamily:y.taskFamily||
y.task?.taskFamily||y.task?.solverId||null,solverId:y.solverId||y.task?.solverId||null,cacheInput:Ce(y.cacheInput,y.cacheInputs,
y.task?.cacheInput,null)}));if(!(r!=null||s.length>0||i.length>0||o.length>0||a.length>0||c.length>0||l.length>0||d.length>
0||f.length>0||h.length>0||p!=null||m.some(y=>y.cacheInput!=null||y.taskFamily||y.solverId)))return null;const g={graphFamily:String(
Ce(n.graphFamily,t.graphFamily,t.taskFamily,"task-graph")||"task-graph"),graphVersion:String(Ce(n.graphVersion,t.graphVersion,
t.version,"v0")||"v0"),lawGraphId:Ce(n.lawGraphId,t.lawGraphId,null),stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,
inputHashes:c,lawIds:l,stateFamilies:d,readFamilies:f,writeFamilies:h,scaleRegime:Ce(n.scaleRegime,t.scaleRegime,null),units:Ce(
n.units,t.units,null),values:p,nodes:m},u=na(ra(g));return{schema:VL,status:"content-addressed-inputs-declared",inputHash:u,
stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,stateFamilies:d,readFamilies:f,
writeFamilies:h,nodeCount:e.length,source:r?"graph.cacheInputs":"graph-derived-input-refs"}}function fD(t={},e=[]){const r=t.
cachePolicy||t.cache||{},n=String(Ce(t.cacheKey,r.cacheKey,r.key,"")||"").trim()||null,s=uD(t,e),i=String(Ce(r.scope,t.cacheScope,
"compute-manager-local")||"compute-manager-local"),o=s?`${i}:${s.inputHash}`:null,a=n||o,c=String(Ce(t.cacheMode,r.mode,
a?"read-through":"disabled")||"disabled").trim().toLowerCase(),l=r.enabled!==!1&&a!=null&&c!=="disabled"&&c!=="off";let d="\
disabled";return l&&(c==="record-only"||c==="write-only"?d="record-only":c==="read-only"?d="read-only":d="read-through"),
{schema:HL,cacheKey:a,mode:d,readEnabled:d==="read-through"||d==="read-only",writeEnabled:d==="read-through"||d==="recor\
d-only",ttlMs:Se(r.ttlMs??t.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:i,requireAdmitted:r.requireAdmitted!==!1&&t.cacheRequireAdmitted!==
!1,explicitCacheKey:n,derivedCacheKey:o,keySource:n?"explicit":o?"content-addressed-inputs":null,inputHash:s?.inputHash||
null,inputs:s,status:l?"cache-policy-enabled":"cache-policy-disabled"}}function hD(t={}){const e=Ce(t.stateSeedPayload,t.
cachePolicy?.stateSeedPayload,t.cache?.stateSeedPayload,t.remoteStateSeedPayload,null);return e==null?null:Ue(e)}function gh(t,e=new WeakSet){
if(t==null)return t;if(typeof t=="function"||typeof t=="symbol")return;if(typeof t!="object")return t;if(ArrayBuffer.isView(
t))return new t.constructor(t);if(t instanceof ArrayBuffer)return t.slice(0);if(e.has(t))return null;if(e.add(t),Array.isArray(
t))return t.map(n=>gh(n,e)).filter(n=>n!==void 0);const r={};for(const[n,s]of Object.entries(t)){const i=gh(s,e);i!==void 0&&
(r[n]=i)}return r}function pD(t={},e={},r={}){const n=e.resultInputs||e.resultInputMap||(t&&typeof t=="object"?t.resultInputs:
null);if(!n||typeof n!="object"||Array.isArray(n))return t;const s=t.data&&typeof t.data=="object"&&!Array.isArray(t.data)?
{...t.data}:{},i={};for(const[o,a]of Object.entries(n)){const c=typeof a=="string"?a:String(a?.nodeId||a?.resultId||a?.from||
"").trim();if(!(!o||!c)){if(!Object.prototype.hasOwnProperty.call(r,c))throw new Error(`Task graph node ${e.id} requeste\
d unavailable result input ${o} from ${c}`);s[o]=gh(r[c]),i[o]=c}}return Object.keys(i).length===0?t:{...t,data:s,taskGraphResultInputs:i}}
function mD(t={},e={}){const r=t.cacheAdmission||t.cachePolicy?.admission||t.cache?.admission||{},n=r.admitted===!0||r.accepted===
!0||r.status==="admitted"||r.status==="admission-accepted",s=e.mode==="record-only",i=r.status||(n?"admitted":s?"recorde\
d-not-admitted":"pending-admission");return{schema:ph,status:i,admitted:n,authority:String(Ce(r.authority,t.cacheAuthority,
"compute-manager-local")||"compute-manager-local"),admissionId:Ce(r.admissionId,r.id,null),validatorId:Ce(r.validatorId,
r.validator,null),reason:String(Ce(r.reason,s?"record-only-cache-artifact-requires-state-manager-admission":"cache-artif\
act-admission-pending","")||""),invalidationRefs:He(r.invalidationRefs??e.inputs?.invalidationRefs),acceptedAt:n?r.acceptedAt||
Date.now():null}}function gD({graphId:t,cachePolicy:e,result:r,storedAt:n,expiresAt:s,admission:i}={}){const o=na(ra({schema:r?.
schema,graphId:r?.graphId,status:r?.status,nodeReports:r?.nodeReports,nodeResults:r?.nodeResults}));return{schema:KL,artifactId:`${e.
cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.inputHash,resultHash:o,
graphId:t,status:i?.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:i?.admitted===!0,admission:i,
inputs:e.inputs,invalidationRefs:He(i?.invalidationRefs,e.inputs?.invalidationRefs||[]),stateSeedPayload:r?.stateSeedPayload!=
null?Ue(r.stateSeedPayload):null,storedAt:n,expiresAt:s,ttlMs:e.ttlMs,resultSchema:r?.schema||null,nodeCount:r?.nodeCount??
null,resultNodeSchemas:(r?.nodeReports||[]).map(a=>({nodeId:a.nodeId,resultSchema:a.resultSchema||null,taskFamily:a.taskFamily||
null}))}}function bD(t={}){const e=t.placementPolicy||t.placement||t.placementHint||{},r=String(Ce(e.requestedPlacement,
e.placement,e.mode,t.requestedPlacement,t.placementMode,"local")||"local").trim().toLowerCase();return{schema:JL,requestedPlacement:r,
locality:String(Ce(e.locality,t.locality,r==="local"?"local-inline":"distributed")||""),authority:String(Ce(e.authority,
t.authority,"compute-manager")||"compute-manager"),targetPeerIds:He(e.targetPeerIds??e.peers??t.targetPeerIds),targetClusterId:Ce(
e.targetClusterId,e.clusterId,t.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||t.gpuResident===!0,
advisory:e.advisory!==!1}}function yD(t={},e=null){const r=t.webgpu||{},n=t.gpuResidentLane||t.gpuResidentLaneLease||t.residentLane||
r.gpuResidentLane||r.residentLane||{},s=Ce(n.residency,r.residency,t.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=Ce(n.laneId,n.gpuLaneId,r.laneId,r.gpuLaneId),a=Ce(n.stateKey,n.gpuStateKey,
r.stateKey,r.gpuStateKey,t.stateKey),c=Ce(n.domainKey,n.domain,r.domainKey,t.domainKey),l=He(n.retainedBufferRefs??r.retainedBufferRefs??
t.retainedBufferRefs),d=n.copyBudget&&typeof n.copyBudget=="object"?Ue(n.copyBudget):r.copyBudget&&typeof r.copyBudget==
"object"?Ue(r.copyBudget):{};return!i&&!o&&!a&&l.length===0&&Object.keys(d).length===0?null:{schema:D1,enabled:!0,laneId:o?
String(o):null,stateKey:a?String(a):null,domainKey:c?String(c):null,solverId:Ce(n.solverId,t.solverId,null),taskId:e,owner:Ce(
n.owner,t.owner,"compute-manager-task-graph"),readFamilies:He(n.readFamilies??n.reads??r.readFamilies??t.readFamilies),writeFamilies:He(
n.writeFamilies??n.writes??r.writeFamilies??t.writeFamilies),retainedBufferRefs:l,queueFencePolicy:Ce(n.queueFencePolicy,
n.fencePolicy,r.queueFencePolicy,null),copyBudget:d}}function wD(t){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(t||""))}
function Ec(t=null,e=null){const r=t&&typeof t=="object"?t:{},n=r.status||r.queueCompletionStatus||r.fenceStatus||r.completionStatus||
(e?.required?"gpu-fence-report-missing":null);if(!n&&!e?.required)return null;const s=r.method||r.queueCompletionMethod||
r.fenceMethod||r.completionMethod||null,i=r.fenceSatisfied===!0||r.satisfied===!0||r.completed===!0||wD(n);return{schema:r.
schema||YL,status:n,method:s,fenceSatisfied:i,required:e?.required===!0||r.required===!0,laneId:Ce(r.laneId,r.gpuLaneId,
e?.laneId),stateKey:Ce(r.stateKey,r.gpuStateKey,e?.stateKey),queueFencePolicy:Ce(r.queueFencePolicy,r.fencePolicy,e?.queueFencePolicy),
queueCompletionStatus:r.queueCompletionStatus||n||null,queueCompletionMethod:r.queueCompletionMethod||s||null,retainedBufferRefs:He(
r.retainedBufferRefs,e?.retainedBufferRefs||[]),workerId:r.workerId||r.remoteWorkerId||null,deviceId:r.deviceId||r.gpuDeviceId||
null,completedAt:r.completedAt||null,source:r.source||null}}function ju(t){return t?typeof t=="function"?t.placementExecutorId||
t.id||t.name||"placement-executor":t.id||t.name||t.constructor?.name||"placement-executor":null}function Gu(t){return t?
typeof t=="function"?t.placementAdmissionId||t.id||t.name||"placement-admission":t.id||t.name||t.constructor?.name||"pla\
cement-admission":null}function Wu(t){return t?typeof t=="function"?t.placementResultValidatorId||t.id||t.name||"placeme\
nt-result-validator":t.id||t.name||t.constructor?.name||"placement-result-validator":null}function Hu(t){return t?typeof t==
"function"?t.placementTaskSignerId||t.id||t.name||"placement-task-signer":t.id||t.name||t.constructor?.name||"placement-\
task-signer":null}function vD(t){return(Array.isArray(t)?t:[]).slice(0,64).map((r,n)=>{const s=r&&typeof r=="object"?r:{};
return{schema:s.schema||null,role:s.role||null,index:n,peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||
s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.transportPeerId||null,responderNodeId:s.responderNodeId||
null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.
remoteExecution&&typeof s.remoteExecution=="object"?JSON.parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&
typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||
null,inputHash:s.inputHash||null,taskHash:s.taskHash||null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||
s.outputHash||null,commitDeltaHash:s.commitDeltaHash||s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.
validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===
!0,errorCode:s.errorCode||null,errorMessage:s.errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(
Number(s.durationMs).toFixed(3)):null}})}function bh(t){if(t==null)return t;if(typeof t=="number")return Number.isFinite(
t)?t:String(t);if(typeof t=="string"||typeof t=="boolean")return t;if(typeof t=="bigint")return`${t.toString()}n`;if(typeof t==
"function")return`[Function:${t.name||"anonymous"}]`;if(ArrayBuffer.isView(t))return{typedArray:t.constructor?.name||"Ty\
pedArray",values:Array.from(t)};if(t instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(t))};if(Array.
isArray(t))return t.map(bh);if(typeof t=="object"){const e={};for(const r of Object.keys(t).sort()){if(r==="taskPacket"||
r==="taskEnvelope")continue;const n=bh(t[r]);n!==void 0&&(e[r]=n)}return e}return String(t)}function ra(t){return JSON.stringify(
bh(t))}function na(t){const e=String(t??"");let r=2166136261;for(let n=0;n<e.length;n+=1)r^=e.charCodeAt(n),r=Math.imul(
r,16777619)>>>0;return`fnv1a32-${r.toString(16).padStart(8,"0")}`}function Vu({executorId:t,kind:e="worker",ordinal:r=null,
status:n="active"}={}){return{executorId:t,kind:e,ordinal:r,status:n,activeTaskCount:0,submitted:0,completed:0,failed:0,
abandoned:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,
lastStartedAt:null,lastCompletedAt:null,byRuntime:{},byTaskFamily:{}}}class ED{constructor(e={}){const r=typeof navigator<
"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4,n=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<
"u";this.workerPolicyOverrides={minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.
maxWorkers,autoScaleWorkers:e.autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},
this.resourceProfile=Fu(e.resourceProfile||e,{wasm:s,webgpu:n}),this.workerPolicy=zu(this.workerPolicyOverrides,this.resourceProfile),
this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:Se(
e.workerBootstrapTimeoutMs,ay,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,
maxWorkers:this.workerPolicy.maxWorkers||r,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.
workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.
config.workerBootstrapTimeoutMs=Se(e.workerBootstrapTimeoutMs,ay,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=
new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,this.taskGraphCacheArtifacts=new Map,this.workerAffinities=
new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=new Map,this.modelServices=new Set,this.resourceBroker=
e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=new WeakMap,this.workerRequirementError=null,this.
workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=new Map,this.nextWorkerOrdinal=1,
this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,Vu({executorId:this.inlineExecutorId,kind:"\
inline",ordinal:0,status:"active"})),this.solverRegistry=new wL(e.solvers||[]),this.gpuResidentLaneManager=e.gpuResidentLaneManager||
new FL({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.targetWorkerCount=this.workerPolicy.
targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=0,this.workerResizeHistory=[],
this.placementExecutor=typeof e.placementExecutor=="function"||e.placementExecutor?.submitTask?e.placementExecutor:null,
this.placementExecutorId=e.placementExecutorId||ju(this.placementExecutor),this.placementAdmission=typeof e.placementAdmission==
"function"||e.placementAdmission?.admitTask?e.placementAdmission:null,this.placementAdmissionId=e.placementAdmissionId||
Gu(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="function"||e.placementResultValidator?.
validateTaskResult||e.placementResultValidator?.validateResult?e.placementResultValidator:null,this.placementResultValidatorId=
e.placementResultValidatorId||Wu(this.placementResultValidator),this.placementTaskSigner=typeof e.placementTaskSigner=="\
function"||e.placementTaskSigner?.signTaskPacket||e.placementTaskSigner?.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||
e.remoteTaskSigner:null,this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||Hu(this.placementTaskSigner),
this.placementTimeoutMs=Se(e.placementTimeoutMs??e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.
remoteResultVerification!==!1&&e.placementResultVerification!==!1,this.placementRetryPolicy={schema:To,maxAttempts:Se(e.
placementMaxAttempts??e.remotePlacementMaxAttempts,1,1,100),baseDelayMs:Se(e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,
50,0,6e5),maxDelayMs:Se(e.placementRetryMaxDelayMs??e.remotePlacementRetryMaxDelayMs,1e3,0,6e5),jitterFraction:Br(e.placementRetryJitterFraction??
e.remotePlacementRetryJitterFraction,0,0,1),retryableErrorKinds:He(e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
Ai),terminalErrorKinds:[...yc]},this.manualWorkerAutoScaleCooldownMs=Se(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,
4e3,0,6e5),this.workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=null,this.lastWorkerResize={schema:"peercomput\
e.compute.worker-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.targetWorkerCount,targetWorkers:this.
targetWorkerCount,previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.stats={schema:"peercompute.compute\
.manager-stats.v0",totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,workerTasksCompleted:0,
remoteTasksCompleted:0,remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,remoteTasksValidationFailed:0,
remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,taskGraphsCompleted:0,taskGraphsFailed:0,
taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,taskGraphCacheArtifactsAdmitted:0,
taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,taskGraphCacheReadBlocked:0,
totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{},taskPlacement:{schema:cy,totalSubmitted:0,totalCompleted:0,totalFailed:0,localSubmitted:0,remoteRequested:0,
remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,remoteValidationFailed:0,remoteAttempts:0,
remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,byRecommendedPlacement:{},byActualPlacement:{}}},
this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities={cpu:!0,wasm:s,webgpu:n,wasmWebgpu:s&&n},this.initialized=
!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const r=Se(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,
this.workerPolicy.maxWorkers);for(let n=0;n<r&&this._spawnWorker();n+=1);if(this.workers.length===0){if(this.config.requireWorkers)
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
_rejectTaskGpuResidentLaneLease(s,e.code),s.reject(e)}const r=[];for(const s of this.modelServices)try{await s.dispose()}catch{
r.push(s)}const n=[];for(const s of[...this.workers])this._markWorkerBootstrapFailed(s,e),this._removeWorker(s)||n.push(
this.workerTerminationFailures.get(s));for(const[s,i]of this.activeTasks)i.worker&&this.workers.includes(i.worker)||(this.
activeTasks.delete(s),this._rejectTaskGpuResidentLaneLease(i,e.code),i.reject?.(Object.assign(new Error(e.message),{name:e.
name,code:e.code,workerTerminated:!!i.worker})));for(const s of r)try{await s.dispose()}catch(i){n.push(i)}if(n.length)throw new AggregateError(
n,"ComputeManager cleanup is incomplete");this.workerAffinities.clear(),this.residentWorkerAffinities.clear(),this.activeTaskGraphs.
clear(),this.commitDeltaHandler=null,this.initialized=!1,this.workerRequirementError=null,this.workerInitializationPromise=
null,this.workerBootstrap=new WeakMap,this.workerIds=new WeakMap,this.modelServices.clear()}async createModelInferenceService({
artifactStore:e,resourceBroker:r,resourceBudgets:n,runtime:s="transformers.js",admissionOptions:i={},...o}={}){if(this.destroying)
throw new Error("ComputeManager is shutting down");if(!["transformers.js","llama.cpp","onnx-diffusion","transformers-spe\
ech"].includes(s))throw new Error("Unsupported model execution runtime");const a=this.workerLifecycleRevision,[{ModelInferenceService:c},
{ResourceLeaseBroker:l},{ResidentModelAdmission:d},f]=await Promise.all([qt(()=>import("./ModelInferenceService-BhSE50vO.js"),
__vite__mapDeps([5,2]),import.meta.url),qt(()=>import("./ResourceLeaseBroker-CdfzqIEP.js"),[],import.meta.url),qt(
()=>import("./ResidentModelAdmission-ns7tB3GD.js"),[],import.meta.url),s==="llama.cpp"?qt(()=>Promise.resolve().
then(()=>xE),void 0,import.meta.url).then(m=>m.ggufRuntimeDefinition):s==="onnx-diffusion"?qt(()=>Promise.resolve().
then(()=>aN),void 0,import.meta.url).then(m=>m.diffusionRuntimeDefinition):s==="transformers-speech"?qt(()=>Promise.
resolve().then(()=>b$),void 0,import.meta.url).then(m=>m.speechRuntimeDefinition):null]);if(this.destroying||a!==
this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted service creation");if(r&&this.resourceBroker&&
r!==this.resourceBroker)throw new Error("Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){
if(!r&&!n)throw new Error("Configure inference CPU/GPU resource budgets");this.resourceBroker=r||new l({capacities:n})}const h=new c(
{...o,runtimeDefinition:f,artifactStore:e,computeManager:this,admission:new d({...i,broker:this.resourceBroker})});this.
modelServices.add(h);const p=h.dispose.bind(h);return h.dispose=async()=>{const m=await p();return this.modelServices.delete(
h),m},h}async refreshGpuLimits(){if(typeof navigator>"u"||!navigator.gpu?.requestAdapter)return this.getResourceProfile();
let e=null;try{e=await navigator.gpu.requestAdapter()}catch{return this.getResourceProfile()}const r=N1(e?.limits);return r?
(this.resourceProfile=Fu({...this.resourceProfile,gpuAvailable:!0,gpuLimits:r,gpuLimitsSource:"adapter",source:this.resourceProfile.
source||"browser"},this.capabilities),this.workerPolicy=zu(this.workerPolicyOverrides,this.resourceProfile),this.config.
minWorkers=this.workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=
this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.getResourceProfile()):this.getResourceProfile()}async submitTask(e){
if(!e)throw new Error("Task is required");const r=["peercompute:model-inference","peercompute:gguf-inference","peercompu\
te:diffusion-inference","peercompute:speech-inference"].includes(e.module)&&e.data?.command==="unload"&&[...this.modelServices].
some(m=>m.session?.affinityKey===e.affinityKey);if(this.destroying&&!r)throw new Error("ComputeManager is shutting down");
const n=this.workerLifecycleRevision;e.signal?.throwIfAborted();const s=typeof e.runtime=="string"?e.runtime.trim().toLowerCase():
e.wasm?e.hostModule||e.module?"wasm-webgpu":"wasm":"js";if(s==="js"&&!e.fn&&!e.module)throw new Error("JavaScript tasks \
must provide fn or module");if((s==="wasm"||s==="wasm-webgpu")&&!(e.wasm?.source||e.wasmSource||e.source))throw new Error(
`${s} tasks must provide wasm.source`);if(s==="wasm-webgpu"&&!(e.hostModule||e.module))throw new Error("wasm-webgpu task\
s must provide hostModule or module");if(this.workerRequirementError)throw this.workerRequirementError;if((!this.initialized||
this.config.requireWorkers&&this.workerInitializationPromise)&&await this.initialize(),this.workerRequirementError)throw this.
workerRequirementError;if(e.signal?.throwIfAborted(),this.destroying&&!r||n!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted task submission");if(e.requireWorker===!0&&!this._supportsWorkers())throw this._createRequiredWorkerError(
"this task requires worker execution");const i=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.
random()}`,o=e.id||i;if(this.activeTasks.has(o)||this.taskQueue.some(m=>m.id===o))throw new Error(`Compute task id is al\
ready active: ${o}`);const a=this._runtimeStats(s);a.submitted+=1,this.stats.totalTasksSubmitted+=1;const c=this._normalizeTaskFamily(
e,s),l=this._taskFamilyStats(c);l.submitted+=1;const d=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:c}),f=lD(e),
h=dD(e,f);this._recordPlacementSubmitted(d);const p={id:o,runtime:s,taskFamily:c,solverId:e.solverId,placement:d,gpuFence:f,
gpuResidentLane:h,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey};if(p.
requireWorker&&(h?.localExecution==="inline"||d.requestedPlacement!=="local"&&!d.advisory))throw this._createRequiredWorkerError(
"required local worker conflicts with requested placement");if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&
!this.workerAffinities.has(p.affinityKey))throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers({reason:"task-demand"}),this.workerRequirementError)
throw this.workerRequirementError;return new Promise((m,b)=>{const g={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};
let u;const y=new Promise(S=>{u=S}),E=()=>{this.cancelTask(o).catch(()=>{})},k=(S,v)=>{g.settled||(g.settled=!0,clearTimeout(
g.timer),clearTimeout(g.bootstrapTimer),e.signal?.removeEventListener("abort",E),S(v),u())},A={id:o,payload:p,control:g,
completion:y,resolve:S=>k(m,S),reject:S=>k(b,S),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.
isArray(e.transferables)?e.transferables:[],submittedAt:Nr(),runtime:s,taskFamily:c,placement:d};if(p.requireWorker&&!this.
workers.some(S=>this.workerBootstrap.get(S)?.status==="ready")&&(g.bootstrapTimer=setTimeout(()=>{const S=this.taskQueue.
findIndex(v=>v.id===o);S<0||(this.taskQueue.splice(S,1),this._recordTaskCompletion(A,{ok:!1,mode:"queued"}),A.reject(this.
_createRequiredWorkerError("task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),e.signal?.addEventListener(
"abort",E,{once:!0}),e.signal?.aborted){A.reject(e.signal.reason||new DOMException("Compute task cancelled","AbortError"));
return}this._dispatchToPlacementExecutor(A)||this._dispatchToWorker(A)||(this.taskQueue.push(A),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Fu(e,this.capabilities),this.
workerPolicy=zu(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:r="manual"}={}){const n=this.targetWorkerCount,s=this.workers.length,i=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=Se(e,this.targetWorkerCount,i,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,iD(r)&&this._holdWorkerAutoScale(r),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:r,previousTargetWorkers:n,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(r),this._scheduleNext(),this._recordWorkerResize({reason:r,previousTargetWorkers:n,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:r=4096,minItems:n=1024,
maxItems:s=65536,itemStrideBytes:i=0,memoryFraction:o=.25,layerCount:a=1,maxShardsPerLayer:c=8}={}){const l=Math.max(1,this.
targetWorkerCount||this.workerPolicy.targetWorkers||1),d=Se(a,1,1,1024),f=nD(this.resourceProfile.tier),h=Math.max(1,Math.
floor(l/d)),p=Se(Math.min(f,h),1,1,Math.max(1,c)),m=rD(this.resourceProfile.tier),b=wc(l/sD(this.resourceProfile.tier)),
g=Br(this.resourceProfile.memoryBudgetMB,mh(this.resourceProfile.tier),0,1048576),u=Br(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),y=wc(g/mh(this.resourceProfile.tier)),E=this.resourceProfile.gpuAvailable?wc(u/Math.max(1,$1(this.resourceProfile.
tier))):.75,k=Br(this.resourceProfile.budgetScale,1,.05,64),A=wc(Math.min(b,y,E)*k),S=Se(i,0,0,1048576),v=Br(o,.25,.01,1),
w=S>0&&g>0?Math.max(n,Math.floor(g*1024*1024*v/S)):s,I=S>0&&this.resourceProfile.gpuLimits?Math.min(Se(this.resourceProfile.
gpuLimits.maxBufferSize,Number.MAX_SAFE_INTEGER,0),Se(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.
MAX_SAFE_INTEGER,0)):Number.MAX_SAFE_INTEGER,C=Number.isFinite(I)&&I>0&&S>0?Math.max(n,Math.floor(I*v/S)):s,T=Math.max(n,
Math.min(s,w,C)),P=Se(oD(r*m*A,256),r,n,T),N=Object.entries({workers:b,memory:y,gpu:E,explicit:k}).sort((H,te)=>H[1]-te[1])[0]?.[0]||
"workers";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:P,minItems:n,maxItems:s,effectiveMaxItems:T,
itemStrideBytes:S,workerCount:l,shardsPerLayer:p,layerCount:d,plannedWorkerTasks:d*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:A,limitingFactor:N,workerScale:b,memoryScale:y,gpuScale:E,explicitScale:k,memoryBudgetMB:g,
gpuMemoryBudgetMB:u,memoryFraction:v,memoryMaxItems:w,gpuMaxItems:C,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,r={}){const n=this.solverRegistry.createTask(e,
r);return this.submitTask(n)}async submitTaskGraph(e={}){const r=String(e.graphId||e.id||`task-graph:${Date.now()}`).trim(),
n=Array.isArray(e.nodes)?e.nodes:[];if(!n.length)throw new Error("submitTaskGraph requires at least one node");const s=[],
i=new Map;for(const N of n){const H=String(N?.id||N?.nodeId||N?.task?.id||"").trim();if(!H)throw new Error("submitTaskGr\
aph node id is required");if(i.has(H))throw new Error(`Duplicate task graph node id: ${H}`);const te=He(N.dependsOn||N.dependencies||
[]),X={...N,id:H,dependsOn:te};s.push(X),i.set(H,X)}for(const N of s)for(const H of N.dependsOn)if(!i.has(H))throw new Error(
`Task graph node ${N.id} depends on unknown node ${H}`);this.stats.taskGraphsSubmitted+=1;const o=fD(e,s),a=hD(e),c=mD(e,
o),l=bD(e),d=yD(e,r),f=String(e.cancellation?.mode||e.cancellationMode||"cooperative").trim()||"cooperative",h=e.abortSignal||
e.cancelSignal||e.signal||e.cancellation?.signal||null,p={schema:Uu,mode:f,status:"not-cancelled",reason:null};let m=o.readEnabled?
this.taskGraphCache.get(o.cacheKey):null;const b=Date.now();m&&m.expiresAt&&m.expiresAt<=b&&(this.taskGraphCache.delete(
o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),m=null);let g=null;if(m&&o.requireAdmitted&&m.artifact?.admitted!==
!0&&(this.stats.taskGraphCacheReadBlocked+=1,g="blocked-unadmitted-cache-artifact",m=null),m){this.stats.taskGraphCacheHits+=
1,this.stats.taskGraphsCompleted+=1;const N=Ue(m.result),H=Ue(m.artifact||N.cacheArtifact||null);return{...N,cachePolicy:o,
cacheAdmission:H?.admission||N.cacheAdmission||c,cacheAdmissionStatus:H?.admission?.status||N.cacheAdmissionStatus||null,
cacheArtifact:H,cacheArtifactSchema:H?.schema||null,cacheArtifactStatus:H?.status||null,cacheStatus:"hit",cacheHit:!0,cachedAt:m.
storedAt,durationMs:0}}const u=new Map(s.map(N=>[N.id,N])),y={},E=[],k=[],A=[],S=Nr(),v={graphId:r,startedAt:S,cancelled:h?.
aborted===!0,reason:h?.reason||null,cacheKey:o.cacheKey,stateSeedPayload:a,placementPolicy:l,graphLaneSpec:d},w=()=>{v.cancelled=
!0,v.reason=h?.reason||"abort-signal"};h?.addEventListener&&h.addEventListener("abort",w,{once:!0}),this.activeTaskGraphs.
set(r,v);const I=()=>{if(!v.cancelled)return;p.status="cancelled",p.reason=String(v.reason||"cancelled");const N=new Error(
`Task graph cancelled: ${r}`);throw N.code="TASK_GRAPH_CANCELLED",N.graphId=r,N.cancellation={...p},N};let C=null,T=null,
P=d?"required":"not-required",L=g||(o.readEnabled?"miss":o.writeEnabled?"record-only":"disabled");try{for(I(),d&&(C=this.
acquireGpuResidentLaneLease({...d,taskId:r,owner:d.owner||"compute-manager-task-graph"}),P="active");u.size>0;){I();const H=new Set(
Object.keys(y)),te=Array.from(u.values()).filter(j=>j.dependsOn.every(ae=>H.has(ae)));if(!te.length)throw new Error(`Tas\
k graph has a cycle or unsatisfied dependency: ${Array.from(u.keys()).join(", ")}`);A.push(te.map(j=>j.id));const X=await Promise.
all(te.map(async j=>{I();const ae={schema:WL,graphId:r,nodeId:j.id,dependsOn:[...j.dependsOn],completedNodeIds:Object.keys(
y),nodeResults:y,results:y,cachePolicy:o,cacheKey:o.cacheKey,cacheInputs:o.inputs,stateSeedPayload:a,placementPolicy:l,cancellation:p,
graphLease:C,graphLeaseSpec:d,getResult(ye){return y[ye]}};let fe=typeof j.createTask=="function"?await j.createTask(ae):
typeof j.task=="function"?await j.task(ae):j.task;if(!fe||typeof fe!="object")throw new Error(`Task graph node ${j.id} d\
id not produce a task`);fe=pD(fe,j,y),I();const Te=Nr(),he=await this.submitTask(fe);return I(),{node:j,task:fe,result:he,
durationMs:Math.max(0,Nr()-Te)}}));for(const j of X)u.delete(j.node.id),y[j.node.id]=j.result,k.push(j.node.id),E.push({
nodeId:j.node.id,dependsOn:[...j.node.dependsOn],taskId:j.task.id||null,taskFamily:j.task.taskFamily||j.task.solverId||null,
solverId:j.task.solverId||null,status:"completed",durationMs:j.durationMs,resultSchema:j.result?.computeTaskResultSchema||
j.result?.schema||null})}C?.leaseId&&(T=this.completeGpuResidentLaneLease(C.leaseId,{status:"ordered-before-consumer-que\
ue-completed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-comple\
ted",queueCompletionMethod:"compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),P=T?.lease?.status||
"completed");const N={schema:fy,graphId:r,status:"completed",nodeCount:s.length,edgeCount:s.reduce((H,te)=>H+te.dependsOn.
length,0),executionOrder:k,executionBatches:A,nodeReports:E,nodeResults:y,cachePolicy:o,cacheKey:o.cacheKey,cacheKeySource:o.
keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:a,cacheAdmission:c,cacheAdmissionStatus:c.status,
cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:L,cacheHit:!1,placementPolicy:l,cancellation:p,
cancellationStatus:p.status,graphLeaseRequired:d!=null,graphLeaseStatus:P,graphLeaseSpec:d,graphLease:C,graphLeaseExecution:T,
durationMs:Math.max(0,Nr()-S)};if(o.writeEnabled){const H=Date.now(),te=o.ttlMs>0?H+o.ttlMs:null,X=gD({graphId:r,cachePolicy:o,
result:N,storedAt:H,expiresAt:te,admission:c});this.taskGraphCache.set(o.cacheKey,{storedAt:H,expiresAt:te,artifact:Ue(X),
result:Ue(N)}),this.taskGraphCacheArtifacts.set(o.cacheKey,Ue(X)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,L=o.readEnabled?"miss-stored":"recorded",N.cacheStatus=L,N.cachedAt=H,N.cacheArtifact=X,N.cacheArtifactSchema=X.schema,
N.cacheArtifactStatus=X.status}return this.stats.taskGraphsCompleted+=1,N}catch(N){const H=v.cancelled||N?.code==="TASK_\
GRAPH_CANCELLED";if(H?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,C?.leaseId&&!T)try{this.rejectGpuResidentLaneLease(
C.leaseId,H?"task-graph-cancelled":"task-graph-failed"),P=H?"rejected-cancelled":"rejected-failed"}catch{P="reject-faile\
d"}throw N.graphId=N.graphId||r,N.taskGraphStatus=H?"cancelled":"failed",N.graphLeaseStatus=P,N.cancellation=N.cancellation||
{...p},N}finally{h?.removeEventListener&&h.removeEventListener("abort",w),this.activeTaskGraphs.delete(r)}}getGpuResidentLaneManager(){
return this.gpuResidentLaneManager}getGpuResidentLaneStats(){return this.gpuResidentLaneManager?.getStats?.()||null}acquireGpuResidentLaneLease(e={}){
if(!this.gpuResidentLaneManager?.acquireLease)throw new Error("GPU resident lane manager is not available");return this.
gpuResidentLaneManager.acquireLease(e)}completeGpuResidentLaneLease(e,r={}){if(!this.gpuResidentLaneManager?.completeLease)
throw new Error("GPU resident lane manager is not available");return this.gpuResidentLaneManager.completeLease(e,r)}rejectGpuResidentLaneLease(e,r="\
lane-validation-rejected"){if(!this.gpuResidentLaneManager?.rejectLease)throw new Error("GPU resident lane manager is no\
t available");return this.gpuResidentLaneManager.rejectLease(e,r)}executeGpuResidentLaneStagePlan(e,r={}){if(!this.gpuResidentLaneManager?.
executeStagePlan)throw new Error("GPU resident lane manager cannot execute stage plans");return this.gpuResidentLaneManager.
executeStagePlan(e,r)}preflightGpuResidentLaneStagePlacement(e,r={}){if(!this.gpuResidentLaneManager?.preflightStagePlacement)
throw new Error("GPU resident lane manager cannot preflight stage placement");return this.gpuResidentLaneManager.preflightStagePlacement(
e,r)}planGpuResidentLaneStagePlacement(e,r={}){return this.preflightGpuResidentLaneStagePlacement(e,r)}async distributeTask(e,r){}async cancelTask(e,r={}){
const n=this.taskQueue.findIndex(l=>l.id===e),s=n>=0?this.taskQueue[n]:this.activeTasks.get(e);if(!s)return{cancelled:!1,
status:"not-found"};if(!s.control)return{cancelled:!1,status:"unsupported-executor"};if(s.control.cancelRequested)return s.
control.cancellation;if(n<0&&!s.worker)return{cancelled:!1,status:"unsupported-executor"};s.control.cancelRequested=!0;const i=Object.
assign(new Error(String(r.reason||"Compute task cancelled")),{name:"AbortError",code:"ERR_COMPUTE_TASK_CANCELLED"});let o;
const a=new Promise((l,d)=>{o=d});if(s.control.cancellation=Promise.race([s.completion,a]).then(()=>({cancelled:!0,status:"\
settled",workerTerminated:!!i.workerTerminated})),n>=0)return this.taskQueue.splice(n,1),this._recordTaskCompletion(s,{ok:!1,
mode:"queued"}),s.reject(i),this._scheduleNext(),{cancelled:!0,status:"cancelled-queued"};const c=()=>{if(!s.control.settled){
if(!this._removeWorker(s.worker)){clearTimeout(s.control.timer),s.control.cancelRequested=!1,o(this.workerTerminationFailures.
get(s.worker));return}this.activeTasks.delete(e),i.workerTerminated=!0,this._recordTaskCompletion(s,{ok:!1,mode:"worker"}),
s.reject(i),this._ensureTargetWorkers({reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(c,Se(
r.timeoutMs,2e3,1,6e4));try{s.worker.postMessage({type:"cancel",id:e})}catch{c()}return s.control.cancellation}async reserveWorkerAffinity(e){
if(this.destroying)throw new Error("ComputeManager is shutting down");const r=this.workerLifecycleRevision,n=String(e||"").
trim();if(!n)throw new TypeError("Worker affinity key is required");if(this.initialized||await this.initialize(),this.destroying||
r!==this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted reservation");if(!this._supportsWorkers())
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
get(o);throw c}finally{clearTimeout(a)}}getWorkerAffinityState(e){const r=this.workerAffinities.get(e);return{affinityKey:e,
reserved:this.residentWorkerAffinities.has(e),workerId:r?this._workerId(r):null}}async terminateWorkerAffinity(e,{reason:r="\
Resident runtime terminated"}={}){if(!this.residentWorkerAffinities.has(e))throw new Error("Cannot terminate an unreserv\
ed worker affinity");const n=this.workerAffinities.get(e);if(n&&!this._removeWorker(n))throw this.workerTerminationFailures.
get(n);const s=Object.assign(new Error(String(r)),{code:"ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0});for(const[
i,o]of this.activeTasks)o.payload?.affinityKey===e&&(this.activeTasks.delete(i),this._recordTaskCompletion(o,{ok:!1,mode:"\
worker"}),o.reject(s));return this.taskQueue=this.taskQueue.filter(i=>i.payload?.affinityKey!==e?!0:(this._recordTaskCompletion(
i,{ok:!1,mode:"queued"}),i.reject(s),!1)),this._ensureTargetWorkers({reason:"resident-runtime-terminated"}),this._scheduleNext(),
{affinityKey:e,workerTerminated:!0}}async releaseWorkerAffinity(e){const r=this.workerTerminationFailures.get(this.workerAffinities.
get(e));if(r)throw r;if([...this.activeTasks.values(),...this.taskQueue].some(n=>n.payload?.affinityKey===e))throw new Error(
"Cannot release a worker affinity while its task is active");this.residentWorkerAffinities.delete(e),this.workerAffinities.
delete(e),this._retireIdleWorkers(),this._scheduleNext()}cancelTaskGraph(e,r="cancelTaskGraph"){const n=String(e||"").trim(),
s=this.activeTaskGraphs.get(n);return s?(s.cancelled=!0,s.reason=String(r||"cancelTaskGraph"),{schema:Uu,graphId:n,status:"\
cancel-requested",cancelled:!0,reason:s.reason}):{schema:Uu,graphId:n||null,status:"not-found",cancelled:!1,reason:String(
r||"cancelTaskGraph")}}listActiveTaskGraphs(){return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:fy,graphId:e.
graphId,status:e.cancelled?"cancel-requested":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.
placementPolicy?JSON.parse(JSON.stringify(e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.
reason||null}))}getTaskGraphCacheArtifact(e){const r=String(e||"").trim(),n=this.taskGraphCacheArtifacts.get(r);return n?
Ue(n):null}listTaskGraphCacheArtifacts(){return Array.from(this.taskGraphCacheArtifacts.values()).map(e=>Ue(e)).sort((e,r)=>String(
e.cacheKey||"").localeCompare(String(r.cacheKey||"")))}importRemoteTaskGraphCacheResult(e={},r={},n={}){const s=e?.cacheArtifact&&
typeof e.cacheArtifact=="object"?e.cacheArtifact:null,i=String(s?.cacheKey||e?.cacheKey||r?.cacheKey||"").trim();if(!i)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires a cacheKey");if(!s)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires result.cacheArtifact");if(r?.
admitted!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const b=new Error(`Remote task graph cache artifact is no\
t admitted: ${i}`);throw b.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTED",b.cacheKey=i,b}const o=Date.now(),a=s.
storedAt||e.cachedAt||o,c=s.expiresAt||null,l=He(e?.graphLeaseSpec?.retainedBufferRefs,e?.cacheInputs?.retainedBufferRefs,
s?.inputs?.retainedBufferRefs),d={schema:D1,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,status:l.length>
0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:l.length>0?"remote-gpu-resident-re\
fs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:e?.graphLeaseSpec?.laneId||e?.
graphLease?.laneId||null,stateKey:e?.graphLeaseSpec?.stateKey||e?.graphLease?.stateKey||null,retainedBufferRefs:l,graphLeaseStatus:e?.
graphLeaseStatus||null,graphLeaseRequired:e?.graphLeaseRequired===!0},f={schema:ph,status:"admitted",admitted:!0,authority:r.
authority||"node-kernel-state-manager",admissionId:r.admissionId||null,validatorId:r.validatorId||null,reason:r.reason||
"remote-task-graph-cache-artifact-admitted",invalidationRefs:He(r.invalidationRefs,s.invalidationRefs),acceptedAt:r.acceptedAt||
r.admittedAt||o},h={schema:hy,status:"imported-admitted-remote-cache-result",cacheKey:i,graphId:e?.graphId||s.graphId||null,
sourcePeerId:n.sourcePeerId||r.sourcePeerId||null,responderId:n.responderId||r.responderId||null,requestId:n.requestId||
r.requestId||null,admissionId:r.admissionId||null,importedAt:o,remoteArtifactStatus:s.status||null,remoteArtifactAdmitted:s.
admitted===!0,retainedGpuLaneRefs:d,retainedGpuLaneRefsStatus:d.status,resultHash:s.resultHash||null,inputHash:s.inputHash||
e?.cacheInputHash||null},p={...Ue(s),cacheKey:i,status:"admitted-remote-cache-artifact-recorded",admitted:!0,admission:f,
stateAdmission:Ue(r),remoteCacheImport:h,remoteGraphLeaseRefs:d},m={...Ue(e),cacheKey:i,cacheAdmission:f,cacheAdmissionStatus:f.
status,cacheArtifact:Ue(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.schema||null,cacheStatus:"remote-imported",
cacheHit:!1,remoteTaskGraphCacheImport:h,remoteGraphLeaseRefs:d};return this.taskGraphCacheArtifacts.set(i,Ue(p)),this.taskGraphCache.
set(i,{storedAt:a,expiresAt:c,artifact:Ue(p),result:Ue(m)}),this.stats.taskGraphRemoteCacheImports+=1,Ue(h)}evaluateRemoteTaskGraphStateSeedPolicy(e,r={}){
const n=e&&typeof e=="object"?e:r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim(),i=Date.now(),o=s&&this.taskGraphCache.
get(s)||null,a=s&&(this.taskGraphCacheArtifacts.get(s)||o?.artifact)||null,c=o?.result||null,l=c?.remoteTaskGraphCacheImport||
a?.remoteCacheImport||null,d=Ce(c?.stateSeedPayload,c?.stateSeed,c?.warmStateSeed,a?.stateSeedPayload,a?.stateSeed,a?.outputs?.
stateSeed,n?.stateSeedPayload,n?.stateSeed),f=c?.remoteGraphLeaseRefs||a?.remoteGraphLeaseRefs||l?.retainedGpuLaneRefs||
null,h=vc(c?.cacheInputs?.stateFamilies,c?.cachePolicy?.inputs?.stateFamilies,a?.inputs?.stateFamilies,a?.cacheInputs?.stateFamilies,
n?.stateFamilies),p=vc(c?.cacheInputs?.readFamilies,c?.cachePolicy?.inputs?.readFamilies,a?.inputs?.readFamilies,a?.cacheInputs?.
readFamilies,n?.readFamilies),m=vc(c?.cacheInputs?.writeFamilies,c?.cachePolicy?.inputs?.writeFamilies,a?.inputs?.writeFamilies,
a?.cacheInputs?.writeFamilies,n?.writeFamilies),b=He(n?.allowedStateFamilies??n?.allowedFamilies,[]),g=vc(f?.retainedBufferRefs,
c?.graphLeaseSpec?.retainedBufferRefs,c?.cacheInputs?.retainedBufferRefs,a?.inputs?.retainedBufferRefs,n?.retainedBufferRefs),
u=f?.usableLocally===!0&&f?.remoteOnly!==!0,y=l?.schema===hy||c?.cacheStatus==="remote-imported"||a?.status==="admitted-\
remote-cache-artifact-recorded",E=a?.admitted===!0,k=n?.requireStateFamilies!==!1,A=b.length>0?h.filter(N=>!b.includes(N)):
[];let S="state-family-not-evaluated";h.length===0?S=k?"state-family-missing":"state-family-not-declared":b.length===0?S=
"state-family-policy-not-declared":A.length>0?S="state-family-blocked":S="state-family-allowed";let v="policy-ready",w="\
remote-cache-import-admitted-for-local-policy";s?!o&&!a?(v="blocked-cache-miss",w="cache-entry-not-found"):E?y?S==="stat\
e-family-missing"?(v="blocked-missing-state-families",w="remote-import-did-not-declare-state-families"):S==="state-famil\
y-policy-not-declared"?(v="blocked-missing-state-family-policy",w="allowed-state-family-policy-is-required"):S==="state-\
family-blocked"&&(v="blocked-state-family-policy",w="remote-import-declares-state-families-outside-policy"):(v="blocked-\
not-remote-import",w="cache-entry-did-not-originate-from-admitted-remote-task-graph-import"):(v="blocked-unadmitted-cach\
e-artifact",w="cache-artifact-is-not-admitted"):(v="blocked-no-cache-key",w="remote-state-seed-policy-requires-cache-key");
const I=v==="policy-ready",C=n?.allowWarmStateSeed===!0,T=n?.allowHotBufferRefresh===!0,P=C?I?"warm-state-seed-allowed":
"warm-state-seed-blocked":"warm-state-seed-not-requested";let L=T?"no-retained-buffer-refs":"hot-buffer-refresh-not-requ\
ested";return T&&!I?L="hot-buffer-refresh-blocked":T&&g.length>0&&u?L="local-buffer-refs-usable":T&&g.length>0&&(L="loca\
l-refresh-required"),{schema:QL,status:v,reason:w,cacheKey:s||null,requestedAt:i,cacheEntryPresent:o!=null,artifactPresent:a!=
null,admitted:E,remoteImported:y,importStatus:l?.status||null,importSchema:l?.schema||null,importReport:l?Ue(l):null,stateFamilies:h,
readFamilies:p,writeFamilies:m,stateSeedPayloadAvailable:d!=null,stateSeedPayload:d!=null?Ue(d):null,allowedStateFamilies:b,
disallowedStateFamilies:A,stateFamilyStatus:S,warmStateSeedRequested:C,warmStateSeedStatus:P,hotBufferRefreshRequested:T,
hotBufferRefreshStatus:L,retainedBufferRefs:g,remoteRetainedRefsUsableLocally:u,remoteGraphLeaseRefs:f?Ue(f):null}}admitTaskGraphCacheArtifact(e,r={}){
const n=e&&typeof e=="object"?e:r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("admitTask\
GraphCacheArtifact requires a cacheKey");const i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||i?.artifact||
null;if(!o)return null;const a=Ue(n||{}),c=a.admittedAt||a.acceptedAt||Date.now(),l={schema:ph,status:"admitted",admitted:!0,
authority:a.authority||"state-manager",admissionId:a.admissionId||null,validatorId:a.validatorId||null,reason:a.reason||
"state-manager-cache-artifact-admitted",invalidationRefs:He(a.invalidationRefs),acceptedAt:c},d=o.admitted===!0,f={...Ue(
o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:l,stateAdmission:a};if(this.taskGraphCacheArtifacts.set(
s,Ue(f)),i){const h=Ue(i.result||{});h.cacheAdmission=l,h.cacheAdmissionStatus=l.status,h.cacheArtifact=Ue(f),h.cacheArtifactStatus=
f.status,h.cacheArtifactSchema=f.schema||null,this.taskGraphCache.set(s,{...i,artifact:Ue(f),result:h})}return d||(this.
stats.taskGraphCacheArtifactsAdmitted+=1),Ue(f)}invalidateTaskGraphCacheArtifact(e,r={}){const n=e&&typeof e=="object"?e:
r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires\
 a cacheKey");const i=Ue(n||{}),o=this.taskGraphCache.get(s),a=this.taskGraphCacheArtifacts.get(s)||o?.artifact||null;if(this.
taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!a)return{cacheKey:s,status:"invalidated",admitted:!1,
invalidation:i};const c={...Ue(a),status:"invalidated",admitted:!1,invalidation:i,invalidatedAt:i.invalidatedAt||Date.now()};
return this.taskGraphCacheArtifacts.set(s,Ue(c)),Ue(c)}configurePlacementHooks(e={}){const r=f=>Object.prototype.hasOwnProperty.
call(e,f),n=(...f)=>{for(const h of f)if(r(h))return{found:!0,value:e[h]};return{found:!1,value:void 0}},s=n("placementE\
xecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=typeof s.value=="function"||s.value?.submitTask?
s.value:null,this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||ju(this.placementExecutor)):
(r("placementExecutorId")||r("remotePlacementExecutorId")||r("executorId"))&&(this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||ju(this.placementExecutor));const i=n("placementAdmission","remotePlacementAd\
mission","admission");i.found?(this.placementAdmission=typeof i.value=="function"||i.value?.admitTask?i.value:null,this.
placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||Gu(this.placementAdmission)):(r(
"placementAdmissionId")||r("remotePlacementAdmissionId")||r("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||Gu(this.placementAdmission));const o=n("placementResultValidator","remotePl\
acementResultValidator","resultValidator","validator");o.found?(this.placementResultValidator=typeof o.value=="function"||
o.value?.validateTaskResult||o.value?.validateResult?o.value:null,this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||Wu(this.placementResultValidator)):(r("placement\
ResultValidatorId")||r("remotePlacementResultValidatorId")||r("resultValidatorId")||r("validatorId"))&&(this.placementResultValidatorId=
e.placementResultValidatorId||e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||Wu(this.placementResultValidator));
const a=n("placementTaskSigner","remoteTaskSigner","taskSigner","signer");a.found?(this.placementTaskSigner=typeof a.value==
"function"||a.value?.signTaskPacket||a.value?.signEnvelope?a.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||Hu(this.placementTaskSigner)):(r("placementTaskSignerId")||r("remoteTa\
skSignerId")||r("taskSignerId")||r("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||Hu(this.placementTaskSigner)),(r("placementTimeoutMs")||r("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=Se(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(r("remoteResult\
Verification")||r("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const c={...this.placementRetryPolicy},l=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},d=f=>Object.prototype.
hasOwnProperty.call(l,f)||Object.prototype.hasOwnProperty.call(e,f);return(d("maxAttempts")||d("placementMaxAttempts")||
d("remotePlacementMaxAttempts"))&&(c.maxAttempts=Se(l.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,
c.maxAttempts,1,100)),(d("baseDelayMs")||d("placementRetryBaseDelayMs")||d("remotePlacementRetryBaseDelayMs"))&&(c.baseDelayMs=
Se(l.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,c.baseDelayMs,0,6e5)),(d("maxDelayMs")||
d("placementRetryMaxDelayMs")||d("remotePlacementRetryMaxDelayMs"))&&(c.maxDelayMs=Se(l.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,c.maxDelayMs,0,6e5)),(d("jitterFraction")||d("placementRetryJitterFraction")||d("remote\
PlacementRetryJitterFraction"))&&(c.jitterFraction=Br(l.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
c.jitterFraction,0,1)),(d("retryableErrorKinds")||d("placementRetryableErrorKinds")||d("remotePlacementRetryableErrorKin\
ds"))&&(c.retryableErrorKinds=He(l.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
c.retryableErrorKinds||Ai)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(c),this.getCapabilities()}getCapabilities(){
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
max(1,this.workers.length||this.targetWorkerCount||this.workerPolicy.targetWorkers||1),r=(this.activeTasks.size+this.taskQueue.
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
maxTaskDurationMs:this.stats.maxTaskDurationMs,currentLoad:Number(r.toFixed(4)),activeTaskCount:this.activeTasks.size,activeTaskGraphCount:this.
activeTaskGraphs.size,queuedTaskCount:this.taskQueue.length,taskGraphCacheSize:this.taskGraphCache.size,taskGraphCacheArtifactCount:this.
taskGraphCacheArtifacts.size,workerCount:this.workers.length,targetWorkers:this.targetWorkerCount,workerPoolRevision:this.
workerPoolRevision,lastWorkerResize:JSON.parse(JSON.stringify(this.lastWorkerResize)),workerResizeHistory:JSON.parse(JSON.
stringify(this.workerResizeHistory)),workerAutoScaleHold:this._getWorkerAutoScaleHoldStatus(),workerRequirement:this._getWorkerRequirementReport(),
workerUtilization:this._getWorkerUtilizationReport(),activeTaskGraphs:this.listActiveTaskGraphs(),gpuResidentLanes:this.
getGpuResidentLaneStats(),taskPlacement:JSON.parse(JSON.stringify(this.stats.taskPlacement)),lastCompletedAt:this.stats.
lastCompletedAt,byRuntime:JSON.parse(JSON.stringify(this.stats.byRuntime)),byTaskFamily:JSON.parse(JSON.stringify(this.stats.
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:To,maxAttempts:Se(e?.maxAttempts,
1,1,100),baseDelayMs:Se(e?.baseDelayMs,0,0,6e5),maxDelayMs:Se(e?.maxDelayMs,0,0,6e5),jitterFraction:Br(e?.jitterFraction,
0,0,1),retryableErrorKinds:He(e?.retryableErrorKinds,Ai),terminalErrorKinds:[...yc]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,r){}_handleTaskError(e,r){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,r=null){const n=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return n.name="RequiredWorkerUnavailableError",n.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",n.reason=e,r!=null&&(n.cause=r),n}_failRequiredWorkerPool(e){const r=e?.code==="ERR_COMPUTE_RE\
QUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError(e?.message||String(e||"the required worker pool failed"),e);
this.workerRequirementError=r,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;for(const n of[
...this.workers])this._markWorkerBootstrapFailed(n,r),this._removeWorker(n);for(const[n,s]of this.activeTasks.entries())
this.workers.includes(s.worker)||this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(s,r.code),this._recordTaskCompletion(
s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:r.message}),s.reject(Object.
assign(new Error(r.message),{name:r.name,code:r.code,workerTerminated:!this.workers.includes(s.worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(
r),r}_createWorkerBootstrapRecord(e){let r=null,n=null;const s={status:"bootstrapping",startedAt:Nr(),readyAt:null,reason:null,
promise:null,resolve:null,reject:null,timeout:null,messageErrorListener:null};if(s.promise=new Promise((i,o)=>{r=i,n=o}),
s.promise.catch(()=>{}),s.resolve=r,s.reject=n,this.workerBootstrap.set(e,s),this.config.requireWorkers){const i=this.config.
workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(
`worker bootstrap did not acknowledge readiness within ${i}ms`))},i)}return s}_markWorkerBootstrapped(e){const r=this.workerBootstrap.
get(e);!r||r.status!=="bootstrapping"||(clearTimeout(r.timeout),r.timeout=null,r.status="ready",r.readyAt=Nr(),r.resolve?.(
e))}_markWorkerBootstrapFailed(e,r){const n=this.workerBootstrap.get(e);!n||n.status!=="bootstrapping"||(clearTimeout(n.
timeout),n.timeout=null,n.status="failed",n.reason=r?.message||String(r||"worker bootstrap failed"),n.reject?.(r instanceof
Error?r:this._createRequiredWorkerError(n.reason)))}_markWorkerBootstrapRetired(e){const r=this.workerBootstrap.get(e);!r||
r.status!=="bootstrapping"||(clearTimeout(r.timeout),r.timeout=null,r.status="retired",r.reason="worker retired before b\
ootstrap completed",r.resolve?.(e))}_getWorkerRequirementReport(){const e=this.workers.filter(s=>this.workerBootstrap.get(
s)?.status==="ready").length,r=this.workers.filter(s=>this.workerBootstrap.get(s)?.status==="bootstrapping").length,n=this.
config.requireWorkers===!0;return{required:n,status:this.workerRequirementError?"blocked":n?e>0&&e===this.workers.length?
"ready":"bootstrapping":"not-required",workerCount:this.workers.length,readyWorkerCount:e,bootstrappingWorkerCount:r,reason:this.
workerRequirementError?.message||null}}async _waitForRequiredWorkerBootstrap(){const e=this.workers.map(r=>this.workerBootstrap.
get(r)).filter(Boolean);if(e.length===0)throw this._createRequiredWorkerError("no browser worker was registered during b\
ootstrap");await Promise.all(e.map(r=>r.promise))}_rejectQueuedTasksForRequiredWorkerFailure(e){for(;this.taskQueue.length>
0;){const r=this.taskQueue.shift();this._rejectTaskGpuResidentLaneLease(r,e.code||"required-worker-unavailable"),this._recordTaskCompletion(
r,{ok:!1,mode:"worker",errorKind:"required-worker-unavailable",errorMessage:e.message}),r.reject(Object.assign(new Error(
e.message),{name:e.name,code:e.code,workerTerminated:!this.workerAffinities.has(r.payload?.affinityKey)}))}}_canDispatchRemotePlacement(e={}){
return!!this.placementExecutor&&e.advisoryOnly===!1&&(e.requestedPlacement==="peer"||e.requestedPlacement==="cluster")}_createTaskPacket(e={},r={}){
const n={runtime:e.runtime,module:e.module,hostModule:e.hostModule,exportName:e.exportName,hostExport:e.hostExport,fn:e.
fn,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source},s={data:e.data,args:e.args,webgpu:e.webgpu,gpuFence:e.gpuFence,gpuResidentLane:e.
gpuResidentLane,placement:r},i=na(ra(n)),o=na(ra(s)),a=na(ra({codeHash:i,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:r?.requestedPlacement||null}));return{schema:uy,taskId:e.id||null,runtime:e.runtime||
null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:r?.requestedPlacement||null,gpuFenceRequired:e.
gpuFence?.required===!0,gpuFenceSchema:e.gpuFence?.schema||null,gpuLaneId:e.gpuFence?.laneId||null,gpuStateKey:e.gpuFence?.
stateKey||null,gpuQueueFencePolicy:e.gpuFence?.queueFencePolicy||null,gpuResidentLaneSchema:e.gpuResidentLane?.schema||null,
gpuResidentLaneLocalExecution:e.gpuResidentLane?.localExecution||null,codeHash:i,inputHash:o,taskHash:a,hashAlgorithm:"f\
nv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{signed:!1,reason:e===
!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"custom-signa\
ture"};if(typeof e=="object"){const r=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!r,signature:r,signatureAlgorithm:e.
signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(r?"signed":"no-signature")}}return{signed:!0,signature:String(
e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:r=null}={}){const n=e.payload?.
taskPacket||null,s=e.placement||e.payload?.placement||null,i={schema:dy,taskPacketSchema:n?.schema||null,taskPacket:n,mode:r,
signed:!1,signerId:null,signature:null,signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)
return i;const o={manager:this,task:e,placement:s,payload:e.payload,taskPacket:n,mode:r},a=this.placementTaskSigner,c=typeof a==
"function"?await a(n,o):a.signTaskPacket?await a.signTaskPacket(n,o):await a.signEnvelope(i,o),l=this._normalizePlacementTaskSignature(
c);return{...i,...l,schema:l.schema||dy,taskPacket:n,signerId:l.signerId||this.placementTaskSignerId||"placement-task-si\
gner",signedAt:l.signedAt||Date.now()}}_normalizePlacementAdmissionResult(e){return e===!1?{accepted:!1,reason:"admissio\
n-denied"}:e==null||e===!0?{accepted:!0,reason:"accepted"}:typeof e=="object"?{...e,accepted:e.accepted!==!1&&e.ok!==!1,
reason:e.reason||(e.accepted===!1||e.ok===!1?"admission-denied":"accepted")}:{accepted:!0,reason:String(e||"accepted")}}_normalizePlacementValidationResult(e){
return e===!1?{valid:!1,reason:"validation-denied"}:e==null||e===!0?{valid:!0,reason:"validated"}:typeof e=="object"?{...e,
valid:e.valid!==!1&&e.accepted!==!1&&e.ok!==!1,reason:e.reason||(e.valid===!1||e.accepted===!1||e.ok===!1?"validation-de\
nied":"validated")}:{valid:!0,reason:String(e||"validated")}}async _runPlacementAdmission(e,{mode:r=null}={}){if(!this.placementAdmission)
return{accepted:!0,reason:"no-admission-hook",admissionId:null};const n={manager:this,task:e,placement:e.placement||e.payload?.
placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||null,mode:r},
s=typeof this.placementAdmission=="function"?await this.placementAdmission(e.payload,n):await this.placementAdmission.admitTask(
e.payload,n),i=this._normalizePlacementAdmissionResult(s);return{...i,schema:i.schema||"peercompute.compute.placement-ad\
mission.v0",admissionId:i.admissionId||this.placementAdmissionId||"placement-admission",mode:r,decidedAt:Date.now()}}async _runPlacementResultValidator(e,{
mode:r=null,finalResult:n=null,commitDelta:s=null,provenance:i=null}={}){if(!this.placementResultValidator)return{schema:ly,
valid:!0,reason:"no-result-validator",validationId:null,mode:r,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.
placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||
null,mode:r,finalResult:n,commitDelta:s,provenance:i},a=this.placementResultValidator,c=typeof a=="function"?await a(n,o):
a.validateTaskResult?await a.validateTaskResult(n,o):await a.validateResult(n,o),l=this._normalizePlacementValidationResult(
c);return{...l,schema:l.schema||ly,validationId:l.validationId||this.placementResultValidatorId||"placement-result-valid\
ator",mode:r,decidedAt:Date.now()}}_placementRejectedError(e,{mode:r}){const n=new Error(`Remote placement rejected for ${r}\
: ${e?.reason||"admission-denied"}`);return n.name="PlacementAdmissionRejectedError",n.code="ERR_COMPUTE_PLACEMENT_REJEC\
TED",n.placementMode=r,n.reason=e?.reason||"admission-denied",n.admission=e||null,n}_placementValidationError(e,r,{mode:n}){
const s=new Error(`Remote placement result validation failed for ${n}: ${e?.reason||"validation-denied"}`);return s.name=
"PlacementResultValidationError",s.code="ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=n,s.reason=e?.reason||"valida\
tion-denied",s.validation=e||null,s.provenance=r||null,s}_placementTimeoutFor(e){return Se(e.placement?.timeoutMs??e.payload?.
placement?.timeoutMs??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){const r=e.placement||
e.payload?.placement||{},n=this.placementRetryPolicy||{},s=Se(r.maxAttempts??r.retryMaxAttempts??r.remoteMaxAttempts??r.
remoteRetryMaxAttempts??n.maxAttempts,1,1,100),i=Se(r.retryBaseDelayMs??r.remoteRetryBaseDelayMs??n.baseDelayMs,0,0,6e5),
o=Se(r.retryMaxDelayMs??r.remoteRetryMaxDelayMs??n.maxDelayMs,i,0,6e5),a=Br(r.retryJitterFraction??r.remoteRetryJitterFraction??
n.jitterFraction,0,0,1);return this._getPlacementRetryPolicyReport({...n,maxAttempts:s,baseDelayMs:i,maxDelayMs:o,jitterFraction:a,
retryableErrorKinds:He(r.retryableErrorKinds??r.remoteRetryableErrorKinds??n.retryableErrorKinds,Ai)})}_placementErrorKind(e){
return e?.code==="ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":e?.code==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":e?.code===
"ERR_COMPUTE_PLACEMENT_VERIFICATION"?"verification-failed":e?.code==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-fail\
ed":"executor-error"}_placementRetryDelayMs(e,r){const n=Se(r?.baseDelayMs,0,0,6e5),s=Se(r?.maxDelayMs,n,0,6e5),i=Math.max(
0,Se(e,1,1,100)-1),o=Math.min(s,n*2**i),a=Br(r?.jitterFraction,0,0,1);if(a<=0||o<=0)return o;const c=o*a*Math.random();return Math.
min(s,Math.round(o+c))}_placementRetryDecision({attempt:e,errorKind:r,err:n,policy:s,mode:i}){const o=new Set(He(s?.retryableErrorKinds,
Ai)),a=new Set(yc),c=Se(s?.maxAttempts,1,1,100),l=a.has(r),d=!l&&o.has(r),f=e<c,h=d&&f;return{schema:To,mode:i,attempt:e,
nextAttempt:h?e+1:null,maxAttempts:c,errorKind:r,errorCode:n?.code||null,errorMessage:n?.message||String(n||""),retryable:d,
terminal:l,retryScheduled:h,exhausted:d&&c>1&&!f,delayMs:h?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{
mode:r,ok:n=!0,errorKind:s=null}={}){const i=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||
this._placementRetryPolicyFor(e),a=i.filter(l=>l.retryScheduled).length,c=i[i.length-1]||null;return{schema:To,mode:r,maxAttempts:o.
maxAttempts,attemptCount:Se(e.placementAttempt,a+1,0,100),retryCount:a,retried:a>0,retryableErrorKinds:He(o.retryableErrorKinds,
Ai),terminalErrorKinds:[...yc],exhausted:!n&&!!c?.exhausted,finalErrorKind:n?null:s||c?.errorKind||null,events:JSON.parse(
JSON.stringify(i))}}_runPlacementExecutor(e,{signal:r=null,timeoutMs:n=this.placementTimeoutMs,mode:s=null,attempt:i=1,retryPolicy:o=null}={}){
const a={manager:this,task:e,placement:e.placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||
null,taskEnvelope:e.payload?.taskEnvelope||null,signal:r,timeoutMs:n,mode:s,attempt:i,retryPolicy:o};return typeof this.
placementExecutor=="function"?this.placementExecutor(e.payload,a):this.placementExecutor.submitTask(e.payload,a)}_runPlacementExecutorWithTimeout(e,{
mode:r,attempt:n=1,retryPolicy:s=null}={}){const i=this._placementTimeoutFor(e),o=typeof AbortController<"u"?new AbortController:
null,a=Promise.resolve().then(()=>this._runPlacementExecutor(e,{signal:o?.signal||null,timeoutMs:i,mode:r,attempt:n,retryPolicy:s}));
if(i<=0)return a;let c=null;const l=new Promise((d,f)=>{c=setTimeout(()=>{const h=new Error(`Placement executor timed ou\
t after ${i}ms for ${r}`);h.name="PlacementExecutorTimeoutError",h.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",h.timeoutMs=i,h.
placementMode=r;try{o?.abort?.(h)}catch{}f(h)},i)});return Promise.race([a,l]).finally(()=>{c!=null&&clearTimeout(c)})}_normalizeRemotePlacementProvenance(e,{
task:r,mode:n,result:s,finalResult:i,startedAt:o=null,completedAtMs:a=null,completedAt:c=Date.now()}={}){const l=e&&typeof e==
"object"?e:{},d=r?.payload||{},f=r?.placement||d.placement||{},h=Number.isFinite(Number(l.durationMs))?Number(l.durationMs):
Number.isFinite(Number(l.roundTripMs))?Number(l.roundTripMs):Number.isFinite(Number(o))&&Number.isFinite(Number(a))?Math.
max(0,Number(a)-Number(o)):null,p=s&&typeof s=="object"?s:{},m=i&&typeof i=="object"?i:{},b=r?.placementAdmission||null,
g=d.taskPacket||null,u=d.taskEnvelope||null,y=vD(l.replicas||l.replicaResults||l.quorum?.replicas||p.replicas||p.replicaResults),
E=Ec(l.gpuFence||l.gpuFenceReport||p.gpuFence||p.gpuFenceReport||m.gpuFence||m.gpuFenceReport||l.remoteExecution?.gpuFence||
l.remoteExecution?.gpuFenceReport||l.remoteExecution?.computeExecution?.gpuFence,d.gpuFence||g?.gpuFence||null);return{schema:jL,
taskPacketSchema:g?.schema||null,taskEnvelopeSchema:u?.schema||null,taskSigned:u?.signed===!0,signerId:l.signerId||u?.signerId||
null,signatureAlgorithm:l.signatureAlgorithm||u?.signatureAlgorithm||null,mode:n,executorId:l.executorId||this.placementExecutorId||
"placement-executor",promotedReplicaExecutorId:l.promotedReplicaExecutorId||null,admissionId:b?.admissionId||null,admissionReason:b?.
reason||null,requestedPlacement:f.requestedPlacement||null,taskId:d.id||r?.id||null,taskFamily:d.taskFamily||r?.taskFamily||
null,solverId:d.solverId||f.solverId||null,solverKey:f.solverKey||null,peerId:l.peerId||l.remotePeerId||null,targetPeerId:l.
targetPeerId||null,transportPeerId:l.transportPeerId||null,responderNodeId:l.responderNodeId||null,responderPeerId:l.responderPeerId||
null,requesterId:l.requesterId||null,requestId:l.requestId||null,clusterId:l.clusterId||null,workerId:l.workerId||l.remoteWorkerId||
null,remoteExecution:l.remoteExecution&&typeof l.remoteExecution=="object"?JSON.parse(JSON.stringify(l.remoteExecution)):
null,gpuFence:E,gpuFenceStatus:E?.status??null,gpuFenceSatisfied:E?.fenceSatisfied??!1,codeHash:l.codeHash||p.codeHash||
g?.codeHash||null,inputHash:l.inputHash||p.inputHash||g?.inputHash||null,taskHash:l.taskHash||p.taskHash||g?.taskHash||null,
outputHash:l.outputHash||p.outputHash||null,resultHash:l.resultHash||p.resultHash||l.outputHash||p.outputHash||null,commitDeltaHash:l.
commitDeltaHash||p.commitDeltaHash||l.deltaHash||p.deltaHash||null,resultSchema:l.resultSchema||m.schema||p.schema||null,
role:l.role||null,trustLevel:l.trustLevel||"injected-executor",redundantPlacement:l.redundantPlacement&&typeof l.redundantPlacement==
"object"?JSON.parse(JSON.stringify(l.redundantPlacement)):null,primary:l.primary&&typeof l.primary=="object"?JSON.parse(
JSON.stringify(l.primary)):null,primaryFailure:l.primaryFailure&&typeof l.primaryFailure=="object"?JSON.parse(JSON.stringify(
l.primaryFailure)):null,promotedReplica:l.promotedReplica&&typeof l.promotedReplica=="object"?JSON.parse(JSON.stringify(
l.promotedReplica)):null,replicaSuccessCount:Se(l.replicaSuccessCount,0,0,1e6),replicaFailureCount:Se(l.replicaFailureCount,
0,0,1e6),redundantReplicaCount:Se(l.redundantReplicaCount??y.length,y.length,0,1e6),replicaCount:y.length,quorumReplicaCount:Se(
l.quorumReplicaCount??y.length,y.length,0,1e6),replicas:y,validated:l.validated===!0,durationMs:h==null?null:Number(h.toFixed(
3)),completedAt:c}}_verifyRemotePlacementProvenance(e={},r={}){const n=r?.payload?.taskPacket||null,s=Date.now();if(!this.
remoteResultVerification)return{schema:Ou,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!n||n.schema!==
uy)return{schema:Ou,verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:n?.schema||null,mismatchFields:[
"taskPacket"],checks:[],checkedAt:s};const i=["codeHash","inputHash","taskHash"].map(c=>{const l=n[c]||null,d=e?.[c]||null;
return{field:c,expected:l,actual:d,ok:!!l&&l===d}});n.gpuFenceRequired===!0&&i.push({field:"gpuFence",expected:"fence-sa\
tisfied",actual:e?.gpuFence?.status||null,ok:e?.gpuFence?.fenceSatisfied===!0});const o=i.filter(c=>!c.ok).map(c=>c.field),
a=o.length===0?"hashes-match":o.includes("gpuFence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:Ou,
verified:o.length===0,skipped:!1,reason:a,taskPacketSchema:n.schema,hashAlgorithm:n.hashAlgorithm||null,mismatchFields:o,
checks:i,checkedAt:s}}_placementVerificationError(e,r,{mode:n}){const s=new Error(`Remote placement verification failed \
for ${n}: ${e?.reason||"hash-mismatch"}`);return s.name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT\
_VERIFICATION",s.placementMode=n,s.reason=e?.reason||"hash-mismatch",s.verification=e||null,s.provenance=r||null,s}_unwrapPlacementExecutorResult(e,r,{
mode:n,startedAt:s}){let i=e,o=null,a=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&
(o=e.commitDelta),a=e.provenance||e.remoteProvenance||e.placementProvenance||null;const h=Object.prototype.hasOwnProperty.
call(e,"commitDelta")||a||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(
e,"placementProvenance");h&&Object.prototype.hasOwnProperty.call(e,"value")?i=e.value:h&&Object.prototype.hasOwnProperty.
call(e,"result")&&(i=e.result)}const c=Date.now(),l=Nr(),d=this._normalizeRemotePlacementProvenance(a,{task:r,mode:n,result:e,
finalResult:i,startedAt:s,completedAtMs:l,completedAt:c}),f=this._verifyRemotePlacementProvenance(d,r);if(d.verification=
f,d.verified=f.verified,!f.verified)throw this._placementVerificationError(f,d,{mode:n});return{finalResult:i,commitDelta:o,
provenance:d}}async _runRemotePlacementWithRetries(e,{mode:r}){const n=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
n,e.placementRetryEvents=[];for(let i=1;i<=n.maxAttempts;i+=1){e.placementAttempt=i,this._recordPlacementAttempt(e,{mode:r,
attempt:i,retryPolicy:n});const o=Nr();try{const a=await this._runPlacementExecutorWithTimeout(e,{mode:r,attempt:i,retryPolicy:n}),
{finalResult:c,commitDelta:l,provenance:d}=this._unwrapPlacementExecutorResult(a,e,{mode:r,startedAt:o}),f=await this._runPlacementResultValidator(
e,{mode:r,finalResult:c,commitDelta:l,provenance:d});if(d.validation=f,!f.valid)throw this._placementValidationError(f,d,
{mode:r});return d.retry=this._placementRetrySummary(e,{mode:r,ok:!0}),{finalResult:c,commitDelta:l,provenance:d}}catch(a){
const c=this._placementErrorKind(a),l=this._placementRetryDecision({attempt:i,errorKind:c,err:a,policy:n,mode:r});if(a.retry=
l,e.placementRetryEvents.push(l),!l.retryScheduled)throw a;this._recordPlacementRetry(e,{mode:r,retry:l}),await aD(l.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${r}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=r,s.retry=this._placementRetrySummary(e,{mode:r,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){const r=e.placement||e.payload?.placement||{};if(!this._canDispatchRemotePlacement(
r))return!1;const n=`remote-${r.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(e.payload,r);const s={...e,
startedAt:Nr(),executionMode:n,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.placementAdmissionId,
placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(s,{mode:n})).
then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:n})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:n});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:n})).then(({finalResult:i,commitDelta:o,provenance:a})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:n,provenance:a,admission:s.placementAdmission,retry:a.retry||this._placementRetrySummary(s,{mode:n,ok:!0})}),s.resolve(
i)}).catch(i=>{const o=this._placementErrorKind(i),a=i?.retry?.schema===To?this._placementRetrySummary(s,{mode:n,ok:!1,errorKind:o}):
null;this._recordTaskCompletion(s,{ok:!1,mode:n,errorKind:o,errorMessage:i?.message||String(i),admission:s.placementAdmission||
i?.admission||null,provenance:i?.provenance||null,retry:a}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this.
_scheduleIdleScaleDown(),this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,
{type:"module"}):zL();this._createWorkerBootstrapRecord(e);const r=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const n=`\
worker-${r}`;if(this.workerIds.set(e,n),this.workerUtilization.set(n,Vu({executorId:n,kind:"worker",ordinal:r,status:"ac\
tive"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),i=o=>this._handleWorkerFailure(e,o);s&&(s.messageErrorListener=i),e.addEventListener(
"messageerror",i)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:r="worker",ordinal:n=null,status:s="active"}={}){const i=String(e||this.inlineExecutorId);
return this.workerUtilization.has(i)||this.workerUtilization.set(i,Vu({executorId:i,kind:r,ordinal:n,status:s})),this.workerUtilization.
get(i)}_executorBucket(e,r){const n=String(r||"unknown");return e[n]||(e[n]=qu()),e[n]}_recordExecutorStart(e,r,{kind:n="\
worker"}={}){const s=this._executorStats(e,{kind:n}),i=r.runtime||r.payload?.runtime||"unknown",o=r.taskFamily||r.payload?.
taskFamily||"unknown";s.status=s.status==="retired"?"retired":"active",s.activeTaskCount+=1,s.submitted+=1,s.lastRuntime=
i,s.lastTaskFamily=o,s.lastStartedAt=Date.now(),this._executorBucket(s.byRuntime,i).submitted+=1,this._executorBucket(s.
byTaskFamily,o).submitted+=1,r.executorId=s.executorId,r.executorActive=!0}_recordExecutorCompletion(e,{ok:r=!0,durationMs:n=0}={}){
const s=e.executorId;if(!s)return;const i=this.workerUtilization.get(s);if(!i)return;e.executorActive&&(i.activeTaskCount=
Math.max(0,i.activeTaskCount-1),e.executorActive=!1);const o=e.runtime||e.payload?.runtime||"unknown",a=e.taskFamily||e.
payload?.taskFamily||"unknown",c=this._executorBucket(i.byRuntime,o),l=this._executorBucket(i.byTaskFamily,a);r?(i.completed+=
1,c.completed+=1,l.completed+=1):(i.failed+=1,c.failed+=1,l.failed+=1);const d=Number(Math.max(0,n).toFixed(3));i.totalDurationMs+=
n,i.lastDurationMs=d,i.maxDurationMs=Math.max(i.maxDurationMs,d);const f=i.completed+i.failed;i.averageDurationMs=f>0?Number(
(i.totalDurationMs/f).toFixed(3)):0,i.lastRuntime=o,i.lastTaskFamily=a,i.lastCompletedAt=Date.now();for(const h of[c,l]){
h.totalDurationMs+=n,h.lastDurationMs=d,h.maxDurationMs=Math.max(h.maxDurationMs,d);const p=h.completed+h.failed;h.averageDurationMs=
p>0?Number((h.totalDurationMs/p).toFixed(3)):0}}_recordExecutorAbandon(e){const r=e.executorId;if(!r||!e.executorActive)
return;const n=this.workerUtilization.get(r);n&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),n.abandoned+=1,e.executorActive=
!1)}_cloneExecutorStats(e){return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(f=>f.kind==="worker").sort((f,h)=>(f.ordinal??0)-(h.ordinal??
0)).map(f=>this._cloneExecutorStats(f)),r=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),n=e.filter(f=>f.status==="active"),s=e.filter(f=>f.status==="retired"),i=[r,...e],o=e.reduce((f,h)=>f+(h.
activeTaskCount||0),0),a=i.reduce((f,h)=>f+(h.submitted||0),0),c=i.reduce((f,h)=>f+(h.completed||0),0),l=i.reduce((f,h)=>f+
(h.failed||0),0),d=[...i].sort((f,h)=>(h.activeTaskCount||0)-(f.activeTaskCount||0)||(h.completed||0)-(f.completed||0)||
(h.submitted||0)-(f.submitted||0))[0]||r;return{schema:qL,generatedAt:Date.now(),inline:r,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:n.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:r.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(r.activeTaskCount||0),totalSubmitted:a,totalCompleted:c,totalFailed:l,
busiestExecutorId:d.executorId||null,busiestActiveTaskCount:d.activeTaskCount||0,busiestCompleted:d.completed||0}}}_placementBucket(e,r){
const n=String(r||"unknown");return e[n]||(e[n]=cD()),e[n]}_normalizeTaskPlacement(e={},{runtime:r="unknown",taskFamily:n="\
unknown"}={}){const s=e.placementHint||e.placement||e.data?.placementHint||e.data?.placement||e.data?.solver?.placementHint||
null,i=s?.recommendedPlacement||s?.requestedPlacement||s?.placement||"local",o=["local","peer","cluster"].includes(String(
i).trim().toLowerCase())?String(i).trim().toLowerCase():"local";return{schema:cy,source:s?"task-placement-hint-v0":"defa\
ult-local",advisoryOnly:s?.advisoryOnly!==!1,requestedPlacement:o,recommendedPlacement:o,actualPlacement:null,solverKey:s?.
solverKey||e.solverId||e.data?.solver?.id||null,solverId:s?.solverId||e.solverId||e.data?.solver?.id||null,taskFamily:n,
runtime:r,syncMode:s?.syncMode||null,timeoutMs:Se(s?.timeoutMs,this.placementTimeoutMs,0,36e5),confidence:Number.isFinite(
Number(s?.confidence))?Number(s.confidence):null,targetReplicaCount:Se(s?.targetReplicaCount,0,0,1e6),peerId:s?.peerId||
s?.remotePeerId||e.peerId||e.remotePeerId||null,clusterId:s?.clusterId||e.clusterId||null,reasons:Array.isArray(s?.reasons)?
[...s.reasons]:[],constraints:Array.isArray(s?.constraints)?[...s.constraints]:[]}}_recordPlacementSubmitted(e={}){const r=this.
stats.taskPlacement;if(!r)return;const n=e.requestedPlacement||"local";r.totalSubmitted+=1,n==="local"?r.localSubmitted+=
1:r.remoteRequested+=1,this._placementBucket(r.byRecommendedPlacement,n).submitted+=1,r.lastPlacement={...e,actualPlacement:e.
actualPlacement||null}}_recordPlacementAttempt(e,{mode:r="unknown",attempt:n=1}={}){const s=e.placement||e.payload?.placement,
i=this.stats.taskPlacement;if(!s||!i)return;const o=s.requestedPlacement||"local",a=String(r||"unknown"),c=a.startsWith(
"remote-")?a:`local-${a}`;this.stats.remoteTaskAttempts+=1,i.remoteAttempts+=1,this._placementBucket(i.byRecommendedPlacement,
o).attempted+=1,this._placementBucket(i.byActualPlacement,c).attempted+=1,i.lastPlacementAttempt={...s,actualPlacement:c,
attempt:n,attemptedAt:Date.now()}}_recordPlacementRetry(e,{mode:r="unknown",retry:n=null}={}){const s=e.placement||e.payload?.
placement,i=this.stats.taskPlacement;if(!s||!i)return;const o=s.requestedPlacement||"local",a=String(r||"unknown"),c=a.startsWith(
"remote-")?a:`local-${a}`;this.stats.remoteTasksRetried+=1,i.remoteRetried+=1,this._placementBucket(i.byRecommendedPlacement,
o).retried+=1,this._placementBucket(i.byActualPlacement,c).retried+=1,i.lastPlacementRetry={...s,actualPlacement:c,retry:n?
JSON.parse(JSON.stringify(n)):null,decidedAt:Date.now()}}_recordPlacementCompletion(e,{ok:r=!0,mode:n="unknown",errorKind:s=null,
errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.placement||e.payload?.placement,d=this.
stats.taskPlacement;if(!l||!d)return;const f=l.requestedPlacement||"local",h=String(n||"unknown"),p=h.startsWith("remote\
-")?h:h==="worker"?"local-worker":h==="inline"?"local-inline":`local-${h}`;r?d.totalCompleted+=1:d.totalFailed+=1,p.startsWith(
"remote-")&&(r?d.remoteExecuted+=1:(d.remoteFailed+=1,s==="timeout"&&(d.remoteTimedOut+=1),s==="rejected"&&(d.remoteRejected+=
1),s==="verification-failed"&&(d.remoteVerificationFailed+=1),s==="validation-failed"&&(d.remoteValidationFailed+=1),c?.
exhausted&&(d.remoteRetryExhausted+=1)));const m=this._placementBucket(d.byRecommendedPlacement,f),b=this._placementBucket(
d.byActualPlacement,p);r?(m.completed+=1,b.completed+=1):(m.failed+=1,b.failed+=1,s==="timeout"&&(m.timedOut+=1,b.timedOut+=
1),s==="rejected"&&(m.rejected+=1,b.rejected+=1),s==="verification-failed"&&(m.verificationFailed+=1,b.verificationFailed+=
1),s==="validation-failed"&&(m.validationFailed+=1,b.validationFailed+=1),c?.exhausted&&(m.retryExhausted+=1,b.retryExhausted+=
1)),b.submitted+=1,d.lastPlacement={...l,actualPlacement:p,completedAt:Date.now(),ok:r,errorKind:s,errorMessage:i,admission:a,
provenance:o,retry:c},p.startsWith("remote-")&&(d.lastRemotePlacement=JSON.parse(JSON.stringify(d.lastPlacement)))}_runtimeStats(e){
const r=String(e||"unknown");return this.stats.byRuntime[r]||(this.stats.byRuntime[r]=qu()),this.stats.byRuntime[r]}_normalizeTaskFamily(e={},r="\
unknown"){const n=e.taskFamily||e.solverId||e.data?.solver?.id||e.data?.solverId||e.data?.taskFamily;if(n)return String(
n).trim()||"unknown";if(e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey){const s=String(e.affinityKey||
e.workerKey||e.data?.affinityKey||e.data?.stateKey),[i]=s.split(":");if(i)return i}return String(r||"unknown")}_taskFamilyStats(e){
const r=String(e||"unknown");return this.stats.byTaskFamily[r]||(this.stats.byTaskFamily[r]=qu()),this.stats.byTaskFamily[r]}_recordTaskCompletion(e,{
ok:r=!0,mode:n="unknown",errorKind:s=null,errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.
runtime||e.payload?.runtime||"unknown",d=this._runtimeStats(l),f=e.taskFamily||e.payload?.taskFamily||"unknown",h=this._taskFamilyStats(
f),p=Nr(),m=Math.max(0,p-(e.submittedAt||e.startedAt||p)),b=Math.max(0,p-(e.startedAt||e.submittedAt||p));r?(this.stats.
totalTasksCompleted+=1,d.completed+=1,h.completed+=1,n==="worker"?this.stats.workerTasksCompleted+=1:String(n||"").startsWith(
"remote-")?this.stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,d.failed+=
1,h.failed+=1,String(n||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),c?.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=m,this.stats.lastTaskDurationMs=Number(m.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),d.totalDurationMs+=m,d.lastDurationMs=
this.stats.lastTaskDurationMs,d.maxDurationMs=Math.max(d.maxDurationMs,d.lastDurationMs);const g=d.completed+d.failed;d.
averageDurationMs=g>0?Number((d.totalDurationMs/g).toFixed(3)):0,h.totalDurationMs+=m,h.lastDurationMs=this.stats.lastTaskDurationMs,
h.maxDurationMs=Math.max(h.maxDurationMs,h.lastDurationMs);const u=h.completed+h.failed;h.averageDurationMs=u>0?Number((h.
totalDurationMs/u).toFixed(3)):0,this._recordExecutorCompletion(e,{ok:r,durationMs:b}),this._recordPlacementCompletion(e,
{ok:r,mode:n,errorKind:s,errorMessage:i,admission:a,provenance:o,retry:c})}_removeWorker(e,{terminate:r=!0}={}){if(r)try{
e.terminate()}catch(i){return this.workerTerminationFailures.set(e,Object.assign(new Error("Owned worker termination fai\
led",{cause:i}),{code:"ERR_COMPUTE_WORKER_TERMINATION_FAILED",workerTerminated:!1})),!1}this.workerTerminationFailures.delete(
e),this._markWorkerBootstrapRetired(e);const n=this.workerBootstrap.get(e);if(e.onmessage=null,e.onerror=null,n?.messageErrorListener&&
typeof e.removeEventListener=="function"){try{e.removeEventListener("messageerror",n.messageErrorListener)}catch{}n.messageErrorListener=
null}const s=this._workerId(e)||"worker-unknown";if(this.workerUtilization.has(s)){const i=this.workerUtilization.get(s);
i.status="retired"}for(const i of this.activeTasks.values())i.worker===e&&this._recordExecutorAbandon(i);this.workers=this.
workers.filter(i=>i!==e);for(const[i,o]of this.workerAffinities.entries())o===e&&this.workerAffinities.delete(i);return!0}_recordWorkerResize({
reason:e="manual",previousTargetWorkers:r=this.targetWorkerCount,previousWorkerCount:n=this.workers.length}={}){const s=this.
workers.length,i=r!==this.targetWorkerCount||n!==s;i&&(this.workerPoolRevision+=1);const o={schema:"peercompute.compute.\
worker-resize.v0",revision:this.workerPoolRevision,reason:e,previousTargetWorkers:r,targetWorkers:this.targetWorkerCount,
previousWorkerCount:n,workerCount:s,changed:i,timestamp:Date.now()};return this.lastWorkerResize=o,i&&(this.workerResizeHistory.
push(o),this.workerResizeHistory=this.workerResizeHistory.slice(-16)),o}_holdWorkerAutoScale(e="manual",r=this.manualWorkerAutoScaleCooldownMs){
const n=Se(r,0,0,6e5);if(n<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+n;return s>=this.workerAutoScaleHoldUntil&&
(this.workerAutoScaleHoldUntil=s,this.workerAutoScaleHoldReason=e),this._getWorkerAutoScaleHoldStatus()}_getWorkerAutoScaleHoldStatus(e=Date.
now()){const r=Math.max(0,this.workerAutoScaleHoldUntil-e);return{active:r>0,reason:r>0?this.workerAutoScaleHoldReason:null,
remainingMs:r,until:r>0?this.workerAutoScaleHoldUntil:null}}_retireIdleWorkers(){if(this.workers.length<=this.targetWorkerCount)
return;const e=new Set(Array.from(this.activeTasks.values()).map(r=>r.worker));for(const r of[...this.workers].reverse()){
if(this.workers.length<=this.targetWorkerCount)break;e.has(r)||[...this.residentWorkerAffinities].some(n=>this.workerAffinities.
get(n)===r)||(this._removeWorker(r),this.workerRetirements+=1)}}_maybeScaleForQueue(){if(!this.config.autoScaleWorkers||
!this.initialized||!this._supportsWorkers()||this._getWorkerAutoScaleHoldStatus().active||this.workers.length>=this.workerPolicy.
maxWorkers)return;const e=this.activeTasks.size+this.taskQueue.length;if(e<this.workers.length+this.workerPolicy.scaleUpQueueDepth)
return;const r=Math.min(this.workerPolicy.maxWorkers,Math.max(this.targetWorkerCount+1,e));this.resizeWorkers(r,{reason:"\
queue-pressure"})}_scheduleIdleScaleDown(){!this.config.autoScaleWorkers||this.workerPolicy.idleScaleDownMs<1||this._getWorkerAutoScaleHoldStatus().
active||this.activeTasks.size>0||this.taskQueue.length>0||this.workers.length<=this.workerPolicy.targetWorkers||(clearTimeout(
this.scaleDownTimer),this.scaleDownTimer=setTimeout(()=>{this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"idl\
e-scale-down"})},this.workerPolicy.idleScaleDownMs))}_requiresInlineExecution(e){return e.payload?.gpuResidentLane?.localExecution===
"inline"}_acquireTaskGpuResidentLaneLease(e){const r=e.payload?.gpuResidentLane;if(!r||e.gpuResidentLaneLease||e.gpuResidentLaneExecution)
return e.gpuResidentLaneLease||null;if(!this.gpuResidentLaneManager?.acquireLease)throw new Error("GPU resident lane man\
ager is not available for declared resident-lane task");const n=this.acquireGpuResidentLaneLease({...r,taskId:r.taskId||
e.id||e.payload?.id||null,solverId:r.solverId||e.payload?.solverId||e.payload?.taskFamily||null,owner:r.owner||e.payload?.
taskFamily||"compute-manager-task",queueFencePolicy:r.queueFencePolicy||e.payload?.gpuFence?.queueFencePolicy||null,retainedBufferRefs:r.
retainedBufferRefs?.length?r.retainedBufferRefs:e.payload?.gpuFence?.retainedBufferRefs||[],residentSequenceLaneContract:r.
residentSequenceLaneContract||null});return e.gpuResidentLaneLease=n,n}_taskPayloadWithGpuResidentLaneLeaseIdentity(e){const r=e.
payload,n=e.gpuResidentLaneLease;if(!n)return r;const s=Object.freeze({schema:xL,authoritative:!0,leaseId:n.leaseId,laneId:n.
laneId,stateKey:n.stateKey,sourceFamily:n.sourceFamily,domainKey:n.domainKey,solverId:n.solverId,taskId:n.taskId,owner:n.
owner}),i=r?.data;return!i||typeof i!="object"||Array.isArray(i)?{...r,gpuResidentLaneLeaseIdentity:s}:{...r,data:{...i,
gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,r,{mode:n=null}={}){
const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return r;const i=r&&typeof r=="object"?r:{},o=Ec(i.gpuFence||
i.gpuFenceReport,e.payload?.gpuFence||null),a=e.payload?.gpuFence?.required===!0,c=o?.retainedBufferRefs?.length?o.retainedBufferRefs:
e.payload?.gpuResidentLane?.retainedBufferRefs?.length?e.payload.gpuResidentLane.retainedBufferRefs:e.payload?.gpuFence?.
retainedBufferRefs||s.retainedBufferRefs||[],l=this.completeGpuResidentLaneLease(s.leaseId,{status:o?.status||(a?"gpu-fe\
nce-report-missing":"queue-work-completed"),method:o?.method||null,queueCompletionStatus:o?.queueCompletionStatus||o?.status||
null,queueCompletionMethod:o?.queueCompletionMethod||o?.method||null,retainedBufferRefs:c,completed:o?o.fenceSatisfied===
!0:a?!1:null,source:n?`compute-manager-${n}`:"compute-manager-local-task"});return e.gpuResidentLaneExecution=l,e.gpuResidentLaneLease=
null,r&&typeof r=="object"&&!Array.isArray(r)?{...r,gpuFence:r.gpuFence||l.gpuFence,gpuResidentLaneExecution:r.gpuResidentLaneExecution||
l,gpuResidentLaneLease:r.gpuResidentLaneLease||l.lease}:r}_rejectTaskGpuResidentLaneLease(e,r="task-failed"){const n=e.gpuResidentLaneLease;
if(!n||e.gpuResidentLaneExecution||e.gpuResidentLaneRejected)return null;const s=this.rejectGpuResidentLaneLease(n.leaseId,
r);return e.gpuResidentLaneRejected=s,e.gpuResidentLaneLease=null,s}_assertRequiredGpuFenceSatisfied(e,r){if(e.payload?.
gpuFence?.required!==!0)return;const n=r&&typeof r=="object"?r:{},s=e.gpuResidentLaneExecution?.gpuFence||Ec(n.gpuFence||
n.gpuFenceReport,e.payload.gpuFence);if(s?.fenceSatisfied===!0)return;const i=new Error(`GPU fence missing or unsatisfie\
d for task ${e.id||e.payload?.id||"unknown"}`);throw i.name="GpuFenceUnsatisfiedError",i.code="ERR_COMPUTE_GPU_FENCE_UNS\
ATISFIED",i.gpuFence=s||null,i.gpuFenceRequirement=e.payload.gpuFence,i}_dispatchToWorker(e){if(this._requiresInlineExecution(
e))return!1;const r=e.payload?.affinityKey;if(r&&this.residentWorkerAffinities.has(r)&&!this.workerAffinities.has(r))return this.
_recordTaskCompletion(e,{ok:!1,mode:"queued"}),e.reject(Object.assign(new Error("Resident worker was terminated"),{code:"\
ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0})),!0;const n=new Set(Array.from(this.activeTasks.values()).map(c=>c.
worker)),s=this.workers.filter(c=>!this.workerTerminationFailures.has(c)&&(!(this.config.requireWorkers||e.payload?.requireWorker)||
this.workerBootstrap.get(c)?.status==="ready"));let i=null;if(r&&this.workerAffinities.has(r)){const c=this.workerAffinities.
get(r);if(!this.workers.includes(c))this.workerAffinities.delete(r);else if(s.includes(c)){if(n.has(c))return!1;i=c}else
return!1}if(!i){const c=new Set(this.workerAffinities.values()),l=new Set([...this.residentWorkerAffinities].map(f=>this.
workerAffinities.get(f))),d=s.filter(f=>!n.has(f)&&!l.has(f));i=d.find(f=>!c.has(f))||d[0],i&&r&&this.workerAffinities.set(
r,i)}if(!i)return!1;clearTimeout(e.control?.bootstrapTimer);const o=this._workerId(i)||"worker-unknown",a={...e,worker:i,
workerId:o,startedAt:Nr(),executionMode:"worker"};this._recordExecutorStart(o,a,{kind:"worker"}),this.activeTasks.set(e.
id,a);try{i.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(c){this._handleWorkerFailure(i,c)}
return!0}_buildTaskExecutionReport(e,{mode:r=null,result:n=null}={}){const s=r||e.executionMode||null,i=e.runtime||e.payload?.
runtime||null,o=e.taskFamily||e.payload?.taskFamily||null,a=e.id||e.payload?.id||null,c=n&&typeof n=="object"?n:{},l=Ec(
c.gpuFence||c.gpuFenceReport,e.payload?.gpuFence||null)||e.gpuResidentLaneExecution?.gpuFence||null,d=e.executorId||(s===
"inline"||s==="inline-fallback"?this.inlineExecutorId:null),f=s==="worker"&&(e.workerId||e.executorId)||null;return{schema:GL,
taskId:a,runtime:i,taskFamily:o,executionMode:s,executorId:d,workerId:f,gpuFenceRequirement:e.payload?.gpuFence||null,gpuFence:l,
gpuFenceStatus:l?.status??null,gpuFenceSatisfied:l?.fenceSatisfied??!1,gpuResidentLaneRequirement:e.payload?.gpuResidentLane||
null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,r,{
mode:n=null}={}){if(r.payload?.returnEnvelope!==!0)return e;const s=this._buildTaskExecutionReport(r,{mode:n,result:e});
if(e&&typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==
null&&s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
if(e.payload?.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohibited for this task"));return}
e.startedAt=Nr(),e.executionMode||="inline",this._recordExecutorStart(this.inlineExecutorId,e,{kind:"inline"});try{this.
_acquireTaskGpuResidentLaneLease(e);const r=await hL(this._taskPayloadWithGpuResidentLaneLeaseIdentity(e)),n=this._completeTaskGpuResidentLaneLease(
e,r,{mode:e.executionMode||"inline"});if(this._assertRequiredGpuFenceSatisfied(e,n),n&&typeof n=="object"&&Object.prototype.
hasOwnProperty.call(n,"commitDelta")){e.payload?.suppressCommitDelta!==!0&&this.commitDelta(n.commitDelta);const s=Object.
prototype.hasOwnProperty.call(n,"value")?n.value:n.result;this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inl\
ine"}),e.resolve(e.payload?.returnEnvelope===!0?this._attachTaskExecutionReport(n,e,{mode:e.executionMode||"inline"}):s);
return}this._recordTaskCompletion(e,{ok:!0,mode:e.executionMode||"inline"}),e.resolve(e.payload?.returnEnvelope===!0?this.
_attachTaskExecutionReport(n,e,{mode:e.executionMode||"inline"}):n)}catch(r){this._rejectTaskGpuResidentLaneLease(e,r?.code||
"inline-task-error"),this._recordTaskCompletion(e,{ok:!1,mode:e.executionMode||"inline"}),e.reject(r)}}_handleWorkerMessage(e,r){
if(!this.workers.includes(e))return;const{id:n,type:s,result:i,error:o}=r||{};if(s==="ready"){const l=this.workerBootstrap.
get(e);l&&(l.protocolVersion=r.protocolVersion||1),this._markWorkerBootstrapped(e),this._scheduleNext();return}const a=this.
activeTasks.get(n);if(!a||a.worker!==e)return;if(s==="progress"){if(!a.control?.cancelRequested)try{a.onProgress?.(r.value)}catch{
this.cancelTask(n,{reason:"Compute progress consumer failed"})}return}if(s!=="result"&&s!=="error")return;const c=s==="e\
rror"&&this.residentWorkerAffinities.has(a.payload?.affinityKey)&&["ERR_MODEL_GPU","ERR_MODEL_GPU_OUT_OF_MEMORY","ERR_MO\
DEL_RUNTIME","MODEL_DISPOSE_FAILED"].includes(r.code);if(a.control?.cancelRequested&&!c){this._recordTaskCompletion(a,{ok:!1,
mode:"worker"}),a.reject(Object.assign(new Error("Compute task cancelled"),{name:"AbortError",code:"ERR_COMPUTE_TASK_CAN\
CELLED"})),this.activeTasks.delete(n),this._retireIdleWorkers(),this._scheduleNext();return}if(s==="result"){let l=i;i&&
typeof i=="object"&&Object.prototype.hasOwnProperty.call(i,"commitDelta")&&(a.payload?.suppressCommitDelta!==!0&&this.commitDelta(
i.commitDelta),l=Object.prototype.hasOwnProperty.call(i,"value")?i.value:i.result),this._recordTaskCompletion(a,{ok:!0,mode:"\
worker"}),a.resolve(a.payload?.returnEnvelope===!0?this._attachTaskExecutionReport(i,a,{mode:"worker"}):l)}else s==="err\
or"&&(this._recordTaskCompletion(a,{ok:!1,mode:"worker"}),a.reject(Object.assign(new Error(o||"Worker task failed"),{name:r.
name||"Error",...r.code?{code:r.code}:{}})));this.activeTasks.delete(n),this._retireIdleWorkers(),this._scheduleIdleScaleDown(),
this._scheduleNext()}_handleWorkerFailure(e,r){if(!this.workers.includes(e))return;if(this._markWorkerBootstrapFailed(e,
r),this.config.requireWorkers){this._failRequiredWorkerPool(this._createRequiredWorkerError("an active browser worker fa\
iled",r));return}const n=this._removeWorker(e),s=[];for(const[i,o]of this.activeTasks.entries())o.worker===e&&(n&&this.activeTasks.
delete(i),s.push(o));console.warn("[ComputeManager] Worker failed; recovering eligible tasks",r),s.forEach(i=>{if(!n||i.
payload?.requireWorker||i.control?.cancelRequested){const o=n?Object.assign(new Error(r?.message||"Managed worker termin\
ated"),{workerTerminated:!0,code:"ERR_COMPUTE_WORKER_TERMINATED"}):this.workerTerminationFailures.get(e);this._recordTaskCompletion(
i,{ok:!1,mode:"worker"}),i.reject(o);return}this.workers.length>0&&this._dispatchToWorker(i)||(i.executionMode="inline-f\
allback",this._executeInline(i))}),this._scheduleNext()}_scheduleNext(){if(this.taskQueue.length===0)return;if(this.workerRequirementError){
this._rejectQueuedTasksForRequiredWorkerFailure(this.workerRequirementError);return}if(this._ensureTargetWorkers({reason:"\
queue-dispatch"}),this.workerRequirementError){this._rejectQueuedTasksForRequiredWorkerFailure(this.workerRequirementError);
return}if(this.workers.length===0){if(this.config.requireWorkers){const r=this._createRequiredWorkerError("the required \
worker pool is empty while work is queued");this.workerRequirementError=r,this._rejectQueuedTasksForRequiredWorkerFailure(
r);return}for(;this.taskQueue.length>0;)this._executeInline(this.taskQueue.shift());return}const e=[];for(;this.taskQueue.
length>0;){const r=this.taskQueue.shift();if(this._requiresInlineExecution(r)){this._executeInline(r);continue}this._dispatchToWorker(
r)||e.push(r)}this.taskQueue=e}_ensureTargetWorkers({reason:e="task-demand"}={}){if(this.workerRequirementError)return this.
workers.length;if(this.destroying||!this.initialized||!this._supportsWorkers())return this.workers.length;const r=Se(this.
targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);if(r<=this.workers.length)return this.
workers.length;const n=this.targetWorkerCount,s=this.workers.length;for(;this.workers.length<r&&this._spawnWorker(););return this.
workers.length!==s&&this._recordWorkerResize({reason:e,previousTargetWorkers:n,previousWorkerCount:s}),this.workers.length}}
function Ci(t){t?.throwIfAborted()}function py(t,e){return e?(Ci(e),new Promise((r,n)=>{const s=()=>n(e.reason);e.addEventListener(
"abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.removeEventListener("abort",s))})):t}class kD{constructor({
artifactStore:e,createService:r,maximumResidents:n=8}={}){if(!e?.acquireUse||!e.getManifest||typeof r!="function")throw new TypeError(
"Resident models require artifact use leases and a managed service factory");if(!Number.isInteger(n)||n<1||n>8)throw new RangeError(
"Invalid resident model limit");this.store=e,this.createService=r,this.maximumResidents=n,this.entries=new Map,this.closed=
!1,this.controller=new AbortController}getService(e){return this.entries.get(e)?.service??null}list(){return[...this.entries.
values()].map(e=>({manifest:e.manifest,runtimeOptions:structuredClone(e.options),...e.service?.getStatus(),manifestCid:e.
cid,status:e.unloading?"unloading":e.loading?"loading":e.service?.getStatus().status??"loading"}))}load(e,{signal:r,onProgress:n,
runtimeOptions:s={}}={}){if(this.closed)return Promise.reject(new Error("Resident model registry is closed"));const i=Ze(
e).toString(),o=this.entries.get(i);if(o)return JSON.stringify(o.options)!==JSON.stringify(s)?Promise.reject(new Error("\
Unload this model before changing its runtime options")):o.unloading?Promise.reject(new Error("This model is unloading")):
o.loading?py(o.loading,r):o.service.getStatus().status==="ready"?py(Promise.resolve(o.result),r):Promise.reject(new Error(
"This resident model needs acknowledged cleanup before reloading"));if(this.entries.size>=this.maximumResidents)return Promise.
reject(new Error("Resident model capacity exceeded; unload a model first"));Ci(r);const a=new AbortController,c=AbortSignal.
any([a.signal,this.controller.signal,...r?[r]:[]]),l={cid:i,options:structuredClone(s),controller:a,service:null,releaseUse:null,
loading:null};this.entries.set(i,l);const d=async()=>{try{return l.releaseUse=await this.store.acquireUse(i,{signal:c}),
Ci(c),l.manifest=await this.store.getManifest(i,{signal:c}),Ci(c),l.service=await this.createService({manifestCid:i,manifest:l.
manifest,runtimeOptions:l.options}),Ci(c),l.result=await l.service.loadModel({manifestCid:i,signal:c,onProgress:n}),Ci(c),
l.result}catch(f){try{await this._release(l)}catch(h){throw new AggregateError([f,h],"Model load failed and cleanup is i\
ncomplete")}throw f}finally{l.loading=null}};return l.loading=d(),l.loading}async _release(e){await e.service?.dispose(),
await e.releaseUse?.(),e.releaseUse=null,this.entries.get(e.cid)===e&&this.entries.delete(e.cid)}async unload(e){if(e===
void 0){const i=(await Promise.allSettled([...this.entries.keys()].map(o=>this.unload(o)))).filter(o=>o.status==="reject\
ed").map(o=>o.reason);if(i.length)throw new AggregateError(i,"Some resident models could not finish cleanup");return{status:"\
unloaded"}}const r=this.entries.get(Ze(e).toString());if(!r)return{status:"absent"};if(r.unloading)return r.unloading;const n=(async()=>(r.
controller.abort(new DOMException("Model is unloading","AbortError")),await r.loading?.catch(()=>{}),this.entries.get(r.
cid)===r&&await this._release(r),{manifestCid:r.cid,status:"unloaded"}))();r.unloading=n;try{return await n}finally{r.unloading=
null}}async dispose(){return this.closed=!0,this.controller.abort(new DOMException("Resident registry closed","AbortErro\
r")),this.unload()}}const P1=t=>(t&&typeof t=="object"&&(Object.values(t).forEach(P1),Object.freeze(t)),t),ri=P1({"moons\
hine-tiny-fp32":{id:"moonshine-tiny-fp32",name:"Moonshine Tiny · local speech recognition",description:"Pinned local ma\
naged WebGPU speech candidate.",license:"mit",repository:"onnx-community/moonshine-tiny-ONNX",revision:"a6da1241cd305dcd\
64eab1edbd615f2bb9aabb95",model:{runtime:"transformers-speech",runtimeVersion:"4.3.2",repository:"onnx-community/moonshi\
ne-tiny-ONNX",revision:"a6da1241cd305dcd64eab1edbd615f2bb9aabb95",architecture:"moonshine",task:"automatic-speech-recogn\
ition",dtype:"fp32",format:"ONNX",modalities:["audio"],outputModalities:["text"],sampleRate:16e3,requiredFeatures:[]},files:[
{path:"onnx/encoder_model.onnx",size:30882331,sha256:"cbbf580f703b2af2137e0f6d14cd87f31cc67bd858bfd8715403a9489982d1a5"},
{path:"onnx/decoder_model_merged.onnx",size:78227550,sha256:"4131cef00b62942e9cdef691101f2cc7dbbcd828d71eee8c6c46c28fd05\
1d6cb"},{path:"README.md",size:904,sha256:"a335c967aac0a7933b210011590b89e5040b30a53e1930e1d801224df78cf153"},{path:"con\
fig.json",size:921,sha256:"558e1e02069137c796ace1e50c48d8fe451f04a295929138e6bea885517f0edb"},{path:"generation_config.j\
son",size:147,sha256:"f9b3f711b57be7def2e50a8942f64f36ee0a55fad5b84ff93a687b6c5bcc1d44"},{path:"preprocessor_config.json",
size:128,sha256:"fa43a7017ef85cd1d0fba0d9aae77c8adb16990ae6f11115631f41ec5d8aa679"},{path:"special_tokens_map.json",size:3,
sha256:"ca3d163bab055381827226140568f3bef7eaac187cebd76878e0b63e9e442356"},{path:"tokenizer.json",size:3761754,sha256:"7\
b913404bdd039af4756783218af4440bc07fb7d6d8258d677e34f95b3ec416f"},{path:"tokenizer_config.json",size:135735,sha256:"edae\
e394565d428ea98a663ae7209cdcfeefc5585c42d7a570ff7c986df2cd15"}],totalBytes:113009473},"supertonic-fp32":{id:"supertonic-\
fp32",name:"Supertonic · local speech synthesis",description:"Pinned local managed WebGPU speech candidate.",license:"o\
penrail",repository:"onnx-community/Supertonic-TTS-ONNX",revision:"cff123c84b0655d9d647641f1b532c3cbb8f7faa",model:{runtime:"\
transformers-speech",runtimeVersion:"4.3.2",repository:"onnx-community/Supertonic-TTS-ONNX",revision:"cff123c84b0655d9d6\
47641f1b532c3cbb8f7faa",architecture:"supertonic",task:"text-to-speech",dtype:"fp32",format:"ONNX",modalities:["text"],outputModalities:[
"audio"],sampleRate:44100,requiredFeatures:[],voice:"voices/F1.bin",steps:5},files:[{path:"README.md",size:5276,sha256:"\
161ac71ef6c190bc03a62e8d235d633f9b9ff1d619cd49290e3ca6bf09781c32"},{path:"config.json",size:247,sha256:"37cdafab327b4360\
e0d6911956bfb3ca3d7254b53749e06ca41ab422d7686259"},{path:"tokenizer.json",size:2038,sha256:"da6954f045585fc12c8ea9831b3c\
3eb1c5bffc8ef7ff6b6db7de781cd472ee01"},{path:"tokenizer_config.json",size:119,sha256:"87dad35dfef4b41ef8bb92723e2fc040b9\
1d3fdf770ee5f4716fa5d4896f7a68"},{path:"voices/F1.bin",size:51712,sha256:"5ef84e3421e4f80994a5a40a18ba39ba9fc48175c41ae6\
cf3e56418820872dbf"},{path:"onnx/latent_denoiser.onnx",size:398102,sha256:"9a639a8c05c9be111848562c5cf10ea2697a589c63418\
30aac479d0ce7b75aa9"},{path:"onnx/latent_denoiser.onnx_data",size:132098880,sha256:"cde4abf1136defce235bc446eaab4954a577\
21ae8d5a4754cdd337bf191b612f"},{path:"onnx/text_encoder.onnx",size:433169,sha256:"50a03d29d5dc95918eeff578f542b814f3cf5a\
741f927116f5a8462a76ff6898"},{path:"onnx/text_encoder.onnx_data",size:28426752,sha256:"6415854f135a318909dc716e90f83a391\
d9a91bd9da09bdb6d6763d6b0a6c102"},{path:"onnx/voice_decoder.onnx",size:59921,sha256:"83c104006dabcd6b568c0d5acb6fec18f65\
609d2391dd2c459e4440e85027669"},{path:"onnx/voice_decoder.onnx_data",size:101353472,sha256:"ea52402c9ba5131ee2b3901a86db\
2f0b435b322169cd75157e053493d967d17f"}],totalBytes:262829688}});function xD(t,e){const r=ri[t?.id];if(!r||r.repository!==
t.repository||r.revision!==t.revision||!r.files.some(n=>n.path===e.path&&n.size===e.size&&n.sha256===e.sha256))throw new Error(
"Untrusted speech source file");return`https://huggingface.co/${r.repository}/resolve/${r.revision}/${e.path}`}function O1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&O1(e);return Object.freeze(t)}const SD=O1({"nemotron-3-nano-4b-q4":{
id:"nemotron-3-nano-4b-q4",name:"Nemotron 3 Nano 4B (q4)",description:"General text chat and reasoning. The tested q4 pa\
ckage runs without shader-f16.",repository:"onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",revision:"e7b8ae592fe955\
07bf8c5ffec6c8f2da8caae778",status:"candidate",license:{spdx:"LicenseRef-NVIDIA-Nemotron-Open-Model-License",name:"NVIDI\
A Nemotron Open Model License",sourceUrl:"https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-op\
en-model-license/",notice:"Preserve the NVIDIA license and applicable upstream notices. The complete upstream license is\
 retained below in package metadata.",text:`NVIDIA Nemotron Open Model License
Last Modified: December 15, 2025
TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
NVIDIA Works released under this License are intended to be used permissively and enable the further development of AI t\
echnologies. Subject to the terms of this License, NVIDIA confirms that:
Works are commercially usable.
You are free to create and distribute Derivative Works.
NVIDIA does not claim ownership to any outputs generated using the Works or Derivative Works.
By using, reproducing, modifying, distributing, performing or displaying any portion or element of the Works or Derivati\
ve Works, or otherwise accepting the terms of this License, you agree to be bound by this License.
1. Definitions
.
“
License
” shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 10 of thi\
s document.
“
Legal Entity
” shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common \
control with that entity. For the purposes of this definition, "
control
" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or o\
therwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of s\
uch entity.
“
You
” (or “
Your
”) shall mean an individual or Legal Entity exercising permissions granted by this License.
“
Work
” shall mean the work of authorship, including machine learning model, software, checkpoints, learnt weights, algorithms\
, parameters, configuration files and documentation, made available under the License, as indicated by a copyright notic\
e that is included in or attached to the work (an example is provided in the Appendix below).
“
Derivative Works
” shall mean any work, whether in source or object form, that is based on (or derived from) the Work and for which the e\
ditorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authors\
hip. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely li\
nk (or bind by name) to the interfaces of, the Work and Derivative Works thereof.
2. Grant of License
. Subject to the terms and conditions of this License, NVIDIA hereby grants to You a perpetual, worldwide, non-exclusive\
, no-charge, royalty-free, irrevocable license to reproduce, prepare Derivative Works of, publicly display, publicly per\
form, sublicense, and distribute the Work and such Derivative Works in source or object form.
If You institute patent or copyright litigation against any entity (including a cross-claim or counterclaim in a lawsuit\
) alleging that the Work or an output from the Work constitutes direct or contributory patent or copyright infringement,\
 then any licenses granted to You under this License for that Work shall terminate as of the date such litigation is fil\
ed.
3. Redistribution
. You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modific\
ations, and in source or object form, provided that You meet the following conditions:
a. You must give any other recipients of the Work a copy of this License; and
b. You must retain, in the source form of any Derivative Works that You distribute, all copyright, patent, trademark, an\
d attribution notices from the source form of the Work, excluding those notices that do not pertain to any part of the D\
erivative Works; and
c. If the Work includes a "
NOTICE
" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of t\
he following attribution notice within a “Notice” text file with such copies and the following statement: “Licensed by N\
VIDIA Corporation under the NVIDIA Nemotron Model License.”
You may add Your own copyright statement to Your modifications and may provide additional or different license terms and\
 conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, p\
rovided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this Licen\
se.
4. Trademarks
. This License does not grant permission to use the trade names, trademarks, service marks, or product names of NVIDIA, \
except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of \
the NOTICE file.
5. Disclaimer of Warranty. Unless required by applicable law or agreed to in writing, NVIDIA provides the Work on an “AS\
 IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any \
warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solel\
y responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated wi\
th Your exercise of permissions under this License.
6. Limitation of Liability. In no event and under no legal theory, whether in tort (including negligence), contract, or \
otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, sh\
all NVIDIA be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages o\
f any character arising as a result of this License or out of the use or inability to use the Work, a Derivative Work or\
 an output from the Work or Derivative Work (including but not limited to damages for loss of goodwill, work stoppage, c\
omputer failure or malfunction, or any and all other commercial damages or losses), even if NVIDIA has been advised of t\
he possibility of such damages.
7.
Accepting Warranty or Additional Liability
. While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance o\
f support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in a\
ccepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of NVIDIA,\
 and only if You agree to indemnify, defend, and hold NVIDIA harmless for any liability incurred by, or claims asserted \
against, NVIDIA by reason of your accepting any such warranty or additional liability. You will indemnify and hold harml\
ess NVIDIA from and against any claim by any third party arising out of or related to your use or distribution of the Wo\
rks, Derivative Works thereof, or output from the Works or Derivative Works.
8. Feedback
. NVIDIA appreciates your feedback, and You agree that NVIDIA may use it without restriction or compensation to You.
9. Governing Law
. This Agreement will be governed in all respects by the laws of the United States and the laws of the State of Delaware\
, without regard to conflict of laws principles or the United Nations Convention on Contracts for the International Sale\
 of Goods. The state and federal courts residing in Santa Clara County, California will have exclusive jurisdiction over\
 any dispute or claim arising out of or related to this Agreement, and the parties irrevocably consent to personal juris\
diction and venue in those courts; except that, either party may apply for injunctive remedies or an equivalent type of \
urgent legal relief in any jurisdiction.
10. Trade and Compliance
. You agree to comply with all applicable export, import, trade and economic sanctions laws and regulations, as amended,\
 including without limitation U.S. Export Administration Regulations and Office of Foreign Assets Control regulations. T\
hese laws include restrictions on destinations, end-users and end-use.
(v. December 15, 2025)
END OF TERMS AND CONDITIONS
`,conversionLicenseReviewRequired:!0},files:[{path:"README.md",size:59,gitBlobSha1:"0fe812a8be3efed9aebeedbebf7d5cfbeb59\
6187",sha256:"95a8cadf9e7f520c19f125b60af384122668d574944f05729da77f5dd5cd7d61"},{path:"chat_template.jinja",size:10504,
gitBlobSha1:"67ca3ce54a7118ed74d6fd793b7cc9fd6b2a9f03"},{path:"config.json",size:2548,gitBlobSha1:"8e22283a8b127ed4e640c\
d7f53d9c7df6d72d9ff",sha256:"531f07c24e8fa95c98021bd15b1234bffef932f522ee7f884dbc1208164d2778"},{path:"generation_config\
.json",size:225,gitBlobSha1:"120ef7aa776e001bb08fd741a34c44409bcaca33"},{path:"onnx/model_q4.onnx",size:1375895,sha256:"\
a36fa995d2c2480a327b83fadb1c671ae3413f325a1818a08cd2581636dfce32"},{path:"onnx/model_q4.onnx_data",size:2089224480,sha256:"\
5a821bd8f141b598da0484922a89fa2d50b21194ad445183646a8b7b70e05378"},{path:"onnx/model_q4.onnx_data_1",size:465316544,sha256:"\
121ad945313f542c114fe7f6b61c13be5a087f7d406dc0192286e95b326efde4"},{path:"tokenizer.json",size:12602824,sha256:"878898e2\
0236838546cc0793228b0e8c2c9b3f64d35bfebb0b8dadaf97205e6e"},{path:"tokenizer_config.json",size:11204,gitBlobSha1:"382b269\
bdec975d3584df6c21c1c2d8b306a64d1"}],totalBytes:2568544283,weightBytes:2555916919,model:{runtime:"transformers.js",runtimeVersion:"\
4.3.2",architecture:"nemotron_h",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],repository:"o\
nnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",revision:"e7b8ae592fe95507bf8c5ffec6c8f2da8caae778",memoryProfile:{schema:"\
peercompute.onnx.memory.v1",architecture:"nemotron_h",layers:42,hiddenSize:3136,heads:40,kvHeads:8,headDim:128,vocabulary:131072,
attentionLayers:4,recurrentLayers:21,convChannels:9728,convKernel:4,ssmHeads:96,ssmHeadDim:80,stateSize:128}},provenance:{
repository:"onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-ONNX",revision:"e7b8ae592fe95507bf8c5ffec6c8f2da8caae778",format:"\
ONNX",metadataCheckedAt:"2026-11-05",modelCardUrl:"https://huggingface.co/onnx-community/NVIDIA-Nemotron-3-Nano-4B-BF16-\
ONNX/blob/e7b8ae592fe95507bf8c5ffec6c8f2da8caae778/README.md",sourceRepository:"nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16",sourceRevision:"\
dfaf35de3e30f1867dd8dbc38a7fc9fb52d3914f",sourceModelCardUrl:"https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-BF\
16/blob/dfaf35de3e30f1867dd8dbc38a7fc9fb52d3914f/README.md"}},"qwen2.5-coder-0.5b-q4":{id:"qwen2.5-coder-0.5b-q4",name:"\
Qwen2.5 Coder 0.5B (q4)",description:"Coding and code explanation.",repository:"onnx-community/Qwen2.5-Coder-0.5B-Instru\
ct",revision:"604bb1988ff789d5024d589c63cf9ae81c0c8ab5",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https:/\
/huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct/blob/ea3f2471cf1b1f0db85067f1ef93848e38e88c25/README.md",notice:"Preser\
ve the upstream license, notices and model-card provenance.",conversionLicenseReviewRequired:!0},provenance:{repository:"\
onnx-community/Qwen2.5-Coder-0.5B-Instruct",revision:"604bb1988ff789d5024d589c63cf9ae81c0c8ab5",format:"ONNX",metadataCheckedAt:"\
2026-11-04",modelCardUrl:"https://huggingface.co/onnx-community/Qwen2.5-Coder-0.5B-Instruct/blob/604bb1988ff789d5024d589\
c63cf9ae81c0c8ab5/README.md"},model:{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:"qwen2",task:"text-ge\
neration",dtype:"q4",modalities:["text"],requiredFeatures:[],repository:"onnx-community/Qwen2.5-Coder-0.5B-Instruct",revision:"\
604bb1988ff789d5024d589c63cf9ae81c0c8ab5"},weightBytes:862087110,totalBytes:877970632,files:[{path:"README.md",size:2714,
gitBlobSha1:"e3f268a58331e0cdd58a38de3e15008428cc8821"},{path:"added_tokens.json",size:605,gitBlobSha1:"482ced4679301bf2\
87ebb310bdd1790eb4514232"},{path:"config.json",size:916,gitBlobSha1:"b0c966334ffb6f0a6e8122eb260129c3796308e7"},{path:"g\
eneration_config.json",size:243,gitBlobSha1:"a7538414a4813e768e4e9d22e8588e35db8e5fbd"},{path:"merges.txt",size:1671853,
gitBlobSha1:"31349551d90c7606f325fe0f11bbb8bd5fa0d7c7"},{path:"onnx/model_q4.onnx",size:862087110,sha256:"2df7ea9739c3c2\
6bd9d2cad0815768a5a0a985d4b5548b7de80c5e85e9a97b47"},{path:"special_tokens_map.json",size:613,gitBlobSha1:"ac23c0aaa2434\
523c494330aeb79c58395378103"},{path:"tokenizer.json",size:11421896,sha256:"9c5ae00e602b8860cbd784ba82a8aa14e8feecec692e7\
076590d014d7b7fdafa"},{path:"tokenizer_config.json",size:7849,gitBlobSha1:"24afe3594154cfee05edda73aeadf3daae0a53ba"},{path:"\
vocab.json",size:2776833,gitBlobSha1:"4783fe10ac3adce15ac8f358ef5462739852c569"}]},"smollm2-360m-instruct-q4":{id:"smoll\
m2-360m-instruct-q4",name:"SmolLM2 360M Instruct (q4)",description:"Lightweight English writing, rewriting and summariza\
tion.",repository:"HuggingFaceTB/SmolLM2-360M-Instruct",revision:"a10cc1512eabd3dde888204e902eca88bddb4951",status:"cand\
idate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct/blob/a10cc1512ea\
bd3dde888204e902eca88bddb4951/README.md",notice:"Preserve the upstream license, notices and model-card provenance.",conversionLicenseReviewRequired:!1},
provenance:{repository:"HuggingFaceTB/SmolLM2-360M-Instruct",revision:"a10cc1512eabd3dde888204e902eca88bddb4951",format:"\
ONNX",metadataCheckedAt:"2026-11-04",modelCardUrl:"https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct/blob/a10cc\
1512eabd3dde888204e902eca88bddb4951/README.md"},model:{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:"ll\
ama",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],repository:"HuggingFaceTB/SmolLM2-360M-In\
struct",revision:"a10cc1512eabd3dde888204e902eca88bddb4951"},weightBytes:387943246,totalBytes:391327556,files:[{path:"RE\
ADME.md",size:7304,gitBlobSha1:"5ed0ef7d7e4c1304d542a073ff5767990d410e2f"},{path:"config.json",size:846,gitBlobSha1:"4f2\
ae86545bb5c1d4fcc55644deef86be50a7dee"},{path:"generation_config.json",size:132,gitBlobSha1:"da6c4d71a43aa7e6f785bdbb28e\
a5025438a73fa"},{path:"merges.txt",size:466391,gitBlobSha1:"69503b13f727ba3812b6803e97442a6de05ef5eb"},{path:"onnx/model\
_q4.onnx",size:387943246,sha256:"a4ffda96e65beafc6f6cef0cbcf9fdc1cbdd79c230906bf3897d190547c7a596"},{path:"special_token\
s_map.json",size:655,gitBlobSha1:"44719d2e365acac0637fd25a3acf46494ca45940"},{path:"tokenizer.json",size:2104556,gitBlobSha1:"\
f922b1797f0c88e71addc8393787831f2477a4bd"},{path:"tokenizer_config.json",size:3764,gitBlobSha1:"8c7b22013909450429303ed1\
0be4398bd63f5457"},{path:"vocab.json",size:800662,gitBlobSha1:"0ad5ecc2035b7031b88afb544ee95e2d49baa484"}]}});function U1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&U1(e);return Object.freeze(t)}const Md=U1({...SD,"qwen3-0.6b-q4":{
id:"qwen3-0.6b-q4",name:"Qwen3 0.6B (q4)",repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"58ca03a5e7b354b480b1a82b\
34bde8dc7b854cc0",status:"candidate",license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/Qwen/Qwen3-0.6B/blob/c\
1899de289a04d12100db370d81485cdf75e47ca/README.md",notice:"Preserve the upstream license, notices and model-card provena\
nce.",conversionLicenseReviewRequired:!0},provenance:{repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"58ca03a5e7b3\
54b480b1a82b34bde8dc7b854cc0",format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/onnx-com\
munity/Qwen3-0.6B-ONNX/blob/58ca03a5e7b354b480b1a82b34bde8dc7b854cc0/README.md"},model:{runtime:"transformers.js",runtimeVersion:"\
4.3.2",architecture:"qwen3",task:"text-generation",dtype:"q4",modalities:["text"],requiredFeatures:[],repository:"onnx-c\
ommunity/Qwen3-0.6B-ONNX",revision:"58ca03a5e7b354b480b1a82b34bde8dc7b854cc0"},weightBytes:919096585,totalBytes:932680786,
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
g.json",size:10069,gitBlobSha1:"1a7a8b42ef296f48ac686bab602f518da32dd85c"}]}});function AD(t,e){const r=Md[t];if(!r||!r.
files.some(s=>s.path===e))throw new Error("Unknown catalog model file");const n=e.split("/").map(encodeURIComponent).join(
"/");return`https://huggingface.co/${r.repository}/resolve/${r.revision}/${n}`}const Ro="Tsotchke-Corporation/Qwen3.8-27\
B-GeoRefine-D14-abl-GGUF",Mo="5ce3fd841676adf2c1a10d7193637d46007e88f7",my=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],ID="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function F1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&F1(e);return Object.freeze(t)}const Jp=F1({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ro,revision:Mo,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:ID},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ro}/blob/${Mo}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ro,revision:Mo,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ro}/blob/${Mo}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ro,revision:Mo},weightBytes:14199740480,
totalBytes:my.reduce((t,e)=>t+e.size,0),files:my}});function _D(t,e){const r=Jp[t];if(!r||!r.files.some(s=>s.path===e))throw new Error(
"Unknown catalog artifact model file.");const n=e.split("/").map(encodeURIComponent).join("/");return`https://huggingfac\
e.co/${r.repository}/resolve/${r.revision}/${n}`}function z1(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(z1),Object.freeze(t)),t}const CD=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],TD=z1(Object.fromEntries(CD.map(t=>{const{dtype:e,sourceModel:r,blockCount:n,nextnPredictLayers:s,...i}=t,
a=i.files.find(c=>c.path==="LICENSE").source;return[i.id,{...i,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+a.repository+"/blob/"+a.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:i.repository,revision:i.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+i.repository+"/blob/"+i.revision+"/README.md",sourceModel:{...r,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:n,
nextnPredictLayers:s,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:i.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:e,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:i.repository,revision:i.revision},weightBytes:i.files[0].size,totalBytes:i.
files.reduce((c,l)=>c+l.size,0)}]})));function Yp(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).
forEach(Yp),Object.freeze(t)),t}const Hn="Tsotchke-Corporation",q1=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${Hn}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
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
S GGUF, candidate text)",repository:`${Hn}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
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
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${Hn}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
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
06e0df3640f9ae04fff09706ef"}]}],RD=Yp(Object.fromEntries(q1.map(t=>{const{architecture:e,quantizationTypes:r,sourceModel:n,
publisherLimitations:s,...i}=t;return[t.id,{...i,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${t.repository}\
/blob/${t.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:t.repository,revision:t.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${t.repository}/blob/${t.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:n,
publisherLimitations:s,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:r,modalities:["text"],requiredFeatures:["shader-f16"],repository:t.repository,
revision:t.revision},weightBytes:t.files.filter(o=>o.path.endsWith(".gguf")).reduce((o,a)=>o+a.size,0),totalBytes:t.files.
reduce((o,a)=>o+a.size,0)}]})));Yp({organization:Hn,sourceUrl:`https://huggingface.co/${Hn}`,checkedAt:"2026-11-04",repositories:[
...q1.map(({id:t,repository:e,revision:r})=>({repository:e,revision:r,catalogId:t,format:"GGUF",codecRequired:!1})),{repository:`${Hn}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Hn}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Hn}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${Hn}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Bo="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Lo="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Ku=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],yh=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function j1(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(j1),Object.freeze(t)),t}const MD=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:t,...e})=>[e.id,j1({...e,
status:"execution-candidate",format:"GGUF",capabilities:yh,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:t,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((r,n)=>r+n.size,0)})])),Xi=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Bo,revision:Lo,status:"ex\
ecution-candidate",format:"GGUF",capabilities:yh,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Bo}/blob\
/${Lo}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Bo,
revision:Lo,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Bo}/blob/${Lo}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Bo,revision:Lo},weightBytes:Ku[0].size,totalBytes:Ku.reduce((t,e)=>t+e.size,0),files:Ku},
...MD,...TD,...RD,...Object.fromEntries(Object.entries(Jp).map(([t,e])=>[t,{...e,status:"execution-candidate",capabilities:yh}]))});
function BD(t,e){const r=Xi[t],n=r?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog GGUF model file.");
const s=n.source??{repository:r.repository,revision:r.revision,path:e};return`https://huggingface.co/${s.repository}/res\
olve/${s.revision}/${s.path.split("/").map(encodeURIComponent).join("/")}`}function G1(t){return t&&typeof t=="object"&&
!Object.isFrozen(t)&&(Object.values(t).forEach(G1),Object.freeze(t)),t}const LD=[{id:"sd-turbo-onnx",name:"Stable Diffus\
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
Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"}}],Ya=G1(Object.fromEntries(LD.map(t=>[
t.id,{...t,status:"execution-candidate",format:"ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires hardware WebGPU with shader-f16 and an \
admitted managed ONNX diffusion worker. Device execution must be verified."},provenance:{...t.provenance,repository:t.repository,
revision:t.revision,format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${t.repository}/bl\
ob/${t.revision}/README.md`,fileSources:Object.fromEntries(t.files.map(e=>[e.path,e.source]))},model:{runtime:"onnx-diff\
usion",runtimeVersion:"1.31.1",architecture:t.architecture,format:"ONNX",task:"text-to-image",pipeline:t.pipeline,dtype:t.
dtype,...t.weightQuantization?{weightQuantization:t.weightQuantization}:{},modalities:["text"],outputModalities:["image"],
requiredFeatures:["shader-f16"],width:512,height:512,steps:t.steps,padTokenId:t.padTokenId,repository:t.repository,revision:t.
revision},weightBytes:t.files.filter(e=>e.path.endsWith(".onnx")).reduce((e,r)=>e+r.size,0),totalBytes:t.files.reduce((e,r)=>e+
r.size,0)}])));function DD(t,e){const n=Ya[t]?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog diffusio\
n model file.");const s=n.source;return`https://huggingface.co/${s.repository}/resolve/${s.revision}/${s.path.split("/").
map(encodeURIComponent).join("/")}`}/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */function $D(t){
return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function gy(t,e=""){if(!Number.
isSafeInteger(t)||t<0){const r=e&&`"${e}" `;throw new Error(`${r}expected integer >= 0, got ${t}`)}}function Xa(t,e,r=""){
const n=$D(t),s=t?.length,i=e!==void 0;if(!n||i&&s!==e){const o=r&&`"${r}" `,a=i?` of length ${e}`:"",c=n?`length=${s}`:
`type=${typeof t}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return t}function XO(t){if(typeof t!="function"||
typeof t.create!="function")throw new Error("Hash must wrapped by utils.createHasher");gy(t.outputLen),gy(t.blockLen)}function by(t,e=!0){
if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has a\
lready been called")}function ND(t,e){Xa(t,void 0,"digestInto() output");const r=e.outputLen;if(t.length<r)throw new Error(
'"digestInto() output" expected to be of length >='+r)}function di(...t){for(let e=0;e<t.length;e++)t[e].fill(0)}function Qu(t){
return new DataView(t.buffer,t.byteOffset,t.byteLength)}function In(t,e){return t<<32-e|t>>>e}function Ju(t,e){return t<<
e|t>>>32-e>>>0}const W1=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",PD=Array.from(
{length:256},(t,e)=>e.toString(16).padStart(2,"0"));function Da(t){if(Xa(t),W1)return t.toHex();let e="";for(let r=0;r<t.
length;r++)e+=PD[t[r]];return e}const zn={_0:48,_9:57,A:65,F:70,a:97,f:102};function yy(t){if(t>=zn._0&&t<=zn._9)return t-
zn._0;if(t>=zn.A&&t<=zn.F)return t-(zn.A-10);if(t>=zn.a&&t<=zn.f)return t-(zn.a-10)}function ZO(t){if(typeof t!="string")
throw new Error("hex string expected, got "+typeof t);if(W1)return Uint8Array.fromHex(t);const e=t.length,r=e/2;if(e%2)throw new Error(
"hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(r);for(let s=0,i=0;s<r;s++,i+=2){const o=yy(
t.charCodeAt(i)),a=yy(t.charCodeAt(i+1));if(o===void 0||a===void 0){const c=t[i]+t[i+1];throw new Error('hex string expe\
cted, got non-hex character "'+c+'" at index '+i)}n[s]=o*16+a}return n}const OD=async()=>{};async function e9(t,e,r){let n=Date.
now();for(let s=0;s<t;s++){r(s);const i=Date.now()-n;i>=0&&i<e||(await OD(),n+=i)}}function UD(t){if(typeof t!="string")
throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}function t9(t,e=""){return typeof t==
"string"?UD(t):Xa(t,void 0,e)}function r9(...t){let e=0;for(let n=0;n<t.length;n++){const s=t[n];Xa(s),e+=s.length}const r=new Uint8Array(
e);for(let n=0,s=0;n<t.length;n++){const i=t[n];r.set(i,s),s+=i.length}return r}function n9(t,e){if(e!==void 0&&{}.toString.
call(e)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(t,e)}function Xp(t,e={}){
const r=(s,i)=>t(i).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.create=s=>t(s),
Object.assign(r,e),Object.freeze(r)}function s9(t=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.
getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(
t))}const H1=t=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,t])});function V1(t,e,r){return t&e^~t&r}function K1(t,e,r){
return t&e^t&r^e&r}class Zp{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){
this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=Qu(this.buffer)}update(e){
by(this),Xa(e);const{view:r,buffer:n,blockLen:s}=this,i=e.length;for(let o=0;o<i;){const a=Math.min(s-this.pos,i-o);if(a===
s){const c=Qu(e);for(;s<=i-o;o+=s)this.process(c,o);continue}n.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===
s&&(this.process(r,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){by(this),ND(e,this),
this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;r[o++]=128,di(this.buffer.subarray(o)),this.
padOffset>s-o&&(this.process(n,0),o=0);for(let f=o;f<s;f++)r[f]=0;n.setBigUint64(s-8,BigInt(this.length*8),i),this.process(
n,0);const a=Qu(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,d=this.
get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let f=0;f<l;f++)a.setUint32(4*f,d[f],i)}digest(){
const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.destroy(),n}_cloneInto(e){e||=new this.
constructor,e.set(...this.get());const{blockLen:r,buffer:n,length:s,finished:i,destroyed:o,pos:a}=this;return e.destroyed=
o,e.finished=i,e.length=s,e.pos=a,s%r&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const ms=Uint32Array.from([1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),cr=Uint32Array.from([1779033703,4089235720,
3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,
1541459225,327033209]),kc=BigInt(2**32-1),wy=BigInt(32);function FD(t,e=!1){return e?{h:Number(t&kc),l:Number(t>>wy&kc)}:
{h:Number(t>>wy&kc)|0,l:Number(t&kc)|0}}function zD(t,e=!1){const r=t.length;let n=new Uint32Array(r),s=new Uint32Array(
r);for(let i=0;i<r;i++){const{h:o,l:a}=FD(t[i],e);[n[i],s[i]]=[o,a]}return[n,s]}const vy=(t,e,r)=>t>>>r,Ey=(t,e,r)=>t<<32-
r|e>>>r,Ii=(t,e,r)=>t>>>r|e<<32-r,_i=(t,e,r)=>t<<32-r|e>>>r,xc=(t,e,r)=>t<<64-r|e>>>r-32,Sc=(t,e,r)=>t>>>r-32|e<<64-r;function qn(t,e,r,n){
const s=(e>>>0)+(n>>>0);return{h:t+r+(s/2**32|0)|0,l:s|0}}const qD=(t,e,r)=>(t>>>0)+(e>>>0)+(r>>>0),jD=(t,e,r,n)=>e+r+n+
(t/2**32|0)|0,GD=(t,e,r,n)=>(t>>>0)+(e>>>0)+(r>>>0)+(n>>>0),WD=(t,e,r,n,s)=>e+r+n+s+(t/2**32|0)|0,HD=(t,e,r,n,s)=>(t>>>0)+
(e>>>0)+(r>>>0)+(n>>>0)+(s>>>0),VD=(t,e,r,n,s,i)=>e+r+n+s+i+(t/2**32|0)|0,KD=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),gs=new Uint32Array(64);class QD extends Zp{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:r,C:n,D:s,E:i,
F:o,G:a,H:c}=this;return[e,r,n,s,i,o,a,c]}set(e,r,n,s,i,o,a,c){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=i|0,this.
F=o|0,this.G=a|0,this.H=c|0}process(e,r){for(let f=0;f<16;f++,r+=4)gs[f]=e.getUint32(r,!1);for(let f=16;f<64;f++){const h=gs[f-
15],p=gs[f-2],m=In(h,7)^In(h,18)^h>>>3,b=In(p,17)^In(p,19)^p>>>10;gs[f]=b+gs[f-7]+m+gs[f-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:d}=this;for(let f=0;f<64;f++){const h=In(a,6)^In(a,11)^In(a,25),p=d+h+V1(a,c,l)+KD[f]+gs[f]|0,b=(In(n,2)^In(n,13)^
In(n,22))+K1(n,s,i)|0;d=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+b|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(n,s,i,o,a,c,l,d)}roundClean(){di(gs)}destroy(){this.set(0,0,0,0,0,0,
0,0),di(this.buffer)}}class JD extends QD{A=ms[0]|0;B=ms[1]|0;C=ms[2]|0;D=ms[3]|0;E=ms[4]|0;F=ms[5]|0;G=ms[6]|0;H=ms[7]|
0;constructor(){super(32)}}const Q1=zD(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189db\
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
5fcb6fab3ad6faec","0x6c44198c4a475817"].map(t=>BigInt(t))),YD=Q1[0],XD=Q1[1],bs=new Uint32Array(80),ys=new Uint32Array(80);
class ZD extends Zp{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:r,Bh:n,Bl:s,Ch:i,Cl:o,Dh:a,Dl:c,Eh:l,El:d,Fh:f,
Fl:h,Gh:p,Gl:m,Hh:b,Hl:g}=this;return[e,r,n,s,i,o,a,c,l,d,f,h,p,m,b,g]}set(e,r,n,s,i,o,a,c,l,d,f,h,p,m,b,g){this.Ah=e|0,
this.Al=r|0,this.Bh=n|0,this.Bl=s|0,this.Ch=i|0,this.Cl=o|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=d|0,this.Fh=f|0,
this.Fl=h|0,this.Gh=p|0,this.Gl=m|0,this.Hh=b|0,this.Hl=g|0}process(e,r){for(let E=0;E<16;E++,r+=4)bs[E]=e.getUint32(r),
ys[E]=e.getUint32(r+=4);for(let E=16;E<80;E++){const k=bs[E-15]|0,A=ys[E-15]|0,S=Ii(k,A,1)^Ii(k,A,8)^vy(k,A,7),v=_i(k,A,
1)^_i(k,A,8)^Ey(k,A,7),w=bs[E-2]|0,I=ys[E-2]|0,C=Ii(w,I,19)^xc(w,I,61)^vy(w,I,6),T=_i(w,I,19)^Sc(w,I,61)^Ey(w,I,6),P=GD(
v,T,ys[E-7],ys[E-16]),L=WD(P,S,C,bs[E-7],bs[E-16]);bs[E]=L|0,ys[E]=P|0}let{Ah:n,Al:s,Bh:i,Bl:o,Ch:a,Cl:c,Dh:l,Dl:d,Eh:f,
El:h,Fh:p,Fl:m,Gh:b,Gl:g,Hh:u,Hl:y}=this;for(let E=0;E<80;E++){const k=Ii(f,h,14)^Ii(f,h,18)^xc(f,h,41),A=_i(f,h,14)^_i(
f,h,18)^Sc(f,h,41),S=f&p^~f&b,v=h&m^~h&g,w=HD(y,A,v,XD[E],ys[E]),I=VD(w,u,k,S,YD[E],bs[E]),C=w|0,T=Ii(n,s,28)^xc(n,s,34)^
xc(n,s,39),P=_i(n,s,28)^Sc(n,s,34)^Sc(n,s,39),L=n&i^n&a^i&a,N=s&o^s&c^o&c;u=b|0,y=g|0,b=p|0,g=m|0,p=f|0,m=h|0,{h:f,l:h}=
qn(l|0,d|0,I|0,C|0),l=a|0,d=c|0,a=i|0,c=o|0,i=n|0,o=s|0;const H=qD(C,P,N);n=jD(H,I,T,L),s=H|0}({h:n,l:s}=qn(this.Ah|0,this.
Al|0,n|0,s|0)),{h:i,l:o}=qn(this.Bh|0,this.Bl|0,i|0,o|0),{h:a,l:c}=qn(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:d}=qn(this.Dh|
0,this.Dl|0,l|0,d|0),{h:f,l:h}=qn(this.Eh|0,this.El|0,f|0,h|0),{h:p,l:m}=qn(this.Fh|0,this.Fl|0,p|0,m|0),{h:b,l:g}=qn(this.
Gh|0,this.Gl|0,b|0,g|0),{h:u,l:y}=qn(this.Hh|0,this.Hl|0,u|0,y|0),this.set(n,s,i,o,a,c,l,d,f,h,p,m,b,g,u,y)}roundClean(){
di(bs,ys)}destroy(){di(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class e$ extends ZD{Ah=cr[0]|0;Al=cr[1]|0;Bh=cr[2]|
0;Bl=cr[3]|0;Ch=cr[4]|0;Cl=cr[5]|0;Dh=cr[6]|0;Dl=cr[7]|0;Eh=cr[8]|0;El=cr[9]|0;Fh=cr[10]|0;Fl=cr[11]|0;Gh=cr[12]|0;Gl=cr[13]|
0;Hh=cr[14]|0;Hl=cr[15]|0;constructor(){super(64)}}const em=Xp(()=>new JD,H1(1)),i9=Xp(()=>new e$,H1(3)),ql=1024**3,Qn=Object.
freeze({maximumBytes:8*ql,maximumFileBytes:2*ql-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*
1024**2}),J1=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),t$=["qwen2","qwen3","llama"],ky=["phi","phi3","gemma","gem\
ma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2","nemotron_h"],xy=["idefics3","smolvlm","qwe\
n3_5"],r$=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","phi3","phi2","granite","starcoder2","olmo","olmo2",
"stablelm","nemotron","smollm3"],Y1=Object.freeze([...[...t$,...ky,...xy].map(t=>{const e=xy.includes(t);return Object.freeze(
{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:t,task:e?"image-text-to-text":"text-generation",qualification:"\
candidate",modalities:Object.freeze(e?["text","image"]:["text"]),modules:Object.freeze(e?["embed_tokens","vision_encoder",
"decoder_model_merged"]:["model"]),dtypes:t==="qwen3_5"?Object.freeze(["q4"]):J1,requiresMemoryProfile:ky.includes(t),contextTokens:2048,
maximumBytes:e?t==="qwen3_5"?2*ql:Qn.legacyMaximumBytes:Qn.maximumBytes,maximumFileBytes:Qn.maximumFileBytes})}),...r$.map(
t=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,modelArchitecture:t==="qwen35"?"qwen3_5":t,task:"\
text-generation",modalities:Object.freeze(["text"]),qualification:"candidate"}))]);function Za(t,e){return Y1.find(r=>r.
runtime===t&&r.architecture===e)??null}function n$(t){return Y1.filter(e=>e.runtime===t)}const s$=t=>t==="fp32"?"":t==="\
q8"?"_quantized":`_${t}`;function X1(t){const e=typeof t=="string"?[t]:t&&typeof t=="object"&&!Array.isArray(t)?Object.values(
t):[];if(!e.length||e.length>16||e.some(r=>!J1.includes(r)))throw new Error("Unsupported ONNX precision");return e}function tm(t){
const e=t?.["transformers.js_config"]??{},r=e.device_config??{};return Object.hasOwn(r,"webgpu")?{...e,...r.webgpu}:{...e}}
function Z1(t,e={}){const r=X1(t),n=tm(e).kv_cache_dtype;return r.some(i=>["fp16","q4f16"].includes(i)||(typeof n=="stri\
ng"?n:n?.[i])==="float16")?["shader-f16"]:[]}function i$(t,e,r,n){if(X1(n),typeof n!="string"||!/^[A-Za-z0-9_-]{1,100}$/.
test(r))throw new Error("Invalid ONNX module");const s=e==="qwen3_5"&&n==="q4"?1:tm(t).use_external_data_format,i=`${r}${s$(
n)}.onnx`,o=s&&typeof s=="object"?s[i]??s[r]??0:s??0;if(!(typeof o=="boolean"||Number.isSafeInteger(o)&&o>=0&&o<=32))throw new Error(
"Unsupported external-data chunk configuration");return Array.from({length:Number(o)},(a,c)=>`onnx/${i}_data${c?`_${c}`:
""}`)}function Ur(t,e,r=1048576,n=1){if(!Number.isSafeInteger(t)||t<n||t>r)throw new Error(`Invalid model memory dimensi\
on: ${e}`);return t}function eE(t){const e=tm(t).free_dimension_overrides;if(e&&(typeof e!="object"||Array.isArray(e)||Object.
keys(e).length))throw new Error("Dynamic ONNX free_dimension_overrides are not admitted by this memory profile");const r=t?.
model_type,n=Za("transformers.js",r);if(!n)throw new Error("Unsupported model memory architecture");const s=n.task==="im\
age-text-to-text"?t.text_config??t:t,i=s.layer_types??s.layers_block_type,o=Ur(s.num_hidden_layers??i?.length,"layers",512),
a=Ur(s.hidden_size,"hidden size",65536),c=Ur(s.num_attention_heads,"attention heads",1024),l=Ur(s.num_key_value_heads??c,
"KV heads",1024),d=Ur(s.head_dim??a/c,"head dimension",4096),f=Ur(s.vocab_size??t.vocab_size,"vocabulary");if(i!==void 0&&
(!Array.isArray(i)||i.length!==o||i.some(E=>!["attention","mamba","mlp","moe","full_attention","sliding_attention","line\
ar_attention"].includes(E))))throw new Error("Invalid model memory layer types");let h=o,p=0,m=0,b=0,g=0,u=0,y=0;if(r===
"nemotron_h"){if(!i)throw new Error("Nemotron requires explicit recurrent layer types");if(h=i.filter(k=>k==="attention").
length,p=i.filter(k=>k==="mamba").length,i.some(k=>!["attention","mamba","mlp","moe"].includes(k)))throw new Error("Unsu\
pported Nemotron layer type");g=Ur(s.mamba_num_heads,"SSM heads",1024),u=Ur(s.mamba_head_dim,"SSM head dimension",4096),
y=Ur(s.ssm_state_size,"SSM state size",4096);const E=Ur(s.n_groups,"SSM groups",1024);b=Ur(s.conv_kernel,"convolution ke\
rnel",256),m=Ur(g*u+2*E*y,"convolution channels")}return Bd({schema:"peercompute.onnx.memory.v1",architecture:r,layers:o,
hiddenSize:a,heads:c,kvHeads:l,headDim:d,vocabulary:f,attentionLayers:h,recurrentLayers:p,convChannels:m,convKernel:b,ssmHeads:g,
ssmHeadDim:u,stateSize:y})}function Bd(t){const e=["schema","architecture","layers","hiddenSize","heads","kvHeads","head\
Dim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"];if(!t||
t.schema!=="peercompute.onnx.memory.v1"||!Za("transformers.js",t.architecture)||Object.keys(t).some(n=>!e.includes(n)))throw new Error(
"Invalid model memory profile");for(const n of e.slice(2))Ur(t[n],n,1048576,["attentionLayers","recurrentLayers","convCh\
annels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(t.layers>512||t.attentionLayers+t.recurrentLayers>
t.layers||t.kvHeads>t.heads||t.architecture!=="nemotron_h"&&t.recurrentLayers)throw new Error("Invalid model memory laye\
r geometry");const r=2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*t.ssmHeadDim*t.stateSize+
t.convChannels*t.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*ql)throw new Error("Model cache/state exceeds its boun\
ded memory envelope");return Object.fromEntries(e.map(n=>[n,t[n]]))}function o$(t){const e=Bd(t);return 2*(2*e.attentionLayers*
e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4)}function tE(t,e){
if(e?.model_type!==t.architecture)throw new Error("Model config architecture does not match its admitted manifest");if(e.
auto_map&&Object.keys(e.auto_map).length)throw new Error("Custom model code is not admitted");if(t.memoryProfile&&JSON.stringify(
Bd(t.memoryProfile))!==JSON.stringify(eE(e)))throw new Error("Model memory profile differs from its verified config");return Z1(
t.dtype,e)}const Sy="transformers.js",Ld="4.3.2",Ae=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:Qn.
maximumBytes,maxFileBytes:Qn.maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*
1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),a$=Object.
freeze({maxModelBytes:2*1024**3,maxFileBytes:Ae.maxFileBytes,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*
512}),rE=Object.freeze({maxModelBytes:Ae.maxModelBytes,maxFileBytes:Ae.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,
maxProcessedImagePixels:Ae.maxImagePixels}),c$=Object.freeze({...rE,maxModelBytes:Qn.legacyMaximumBytes});function ec(t,{
files:e,totalBytes:r,config:n}={}){const s=t?.architecture==="qwen3_5"?a$:["idefics3","smolvlm"].includes(t?.architecture)?
c$:rE;if(n&&tE(t,n),e){r=0;for(const l of e){if(!Number.isSafeInteger(l.size)||l.size<0)throw new Error("Invalid model f\
ile size");if(l.size>Ae.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONN\
X file must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=l.size}}if(r!==void 0&&(!Number.isSafeInteger(
r)||r<0||r>s.maxModelBytes))throw Object.assign(new Error(`Model exceeds its admitted file budget of ${s.maxModelBytes/1024**
3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const i=t?.memoryProfile&&Bd(t.memoryProfile);if(i&&i.architecture!==t.architecture)
throw new Error("Model memory architecture mismatch");if(!i&&!(r>Qn.legacyMaximumBytes))return s;const o=r??0,a=i?o$(i):
0,c=1024**3;return{...s,minimumCpuBytes:Math.max(s.minimumCpuBytes,2*o+2*c+a),minimumGpuBytes:Math.max(s.minimumGpuBytes,
2*o+c+a),cacheBytes:a}}function wh(t="Operation cancelled"){return t?.name==="AbortError"?t:new DOMException(typeof t=="\
string"?t:"Operation cancelled","AbortError")}function zt(t){if(t?.aborted)throw wh(t.reason)}function Vo(t){if(typeof t!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(t))throw new Error("Invalid model session ID");return t}function $a(t){if(typeof t!=
"string"||!t||new TextEncoder().encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("/")||t.split(
"/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return t}function nE(t){let e;try{e=JSON.
stringify(t)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>Ae.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(e);if(r.schema!=="peercompute.artifact.\
manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>Ae.maxFiles)throw new Error("Invalid model manife\
st files");const n=new Set,s=ec(r.model,{files:r.files});let i=0;for(const f of r.files){if($a(f.path),n.has(f.path))throw new Error(
"Duplicate model artifact path");n.add(f.path);const h=Qi.parse(f.cid);if(![85,112].includes(h.code)||h.multihash.code!==
18||h.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(f.size)||f.size<0||
!/^[a-f0-9]{64}$/i.test(f.sha256??""))throw new Error("Invalid model file size/digest");if(f.sha256=f.sha256.toLowerCase(),
i+=f.size,!Number.isSafeInteger(i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=r.
model,a=Za(Sy,o?.architecture);if(o?.runtime!==Sy||o.runtimeVersion!==Ld||!a)throw new Error("Model runtime, architectur\
e or dtype is not approved");if(o.task??=a.task,o.task!==a.task)throw new Error("Model task does not match its admitted \
architecture");if((a.requiresMemoryProfile||a.task==="text-generation"&&i>Qn.legacyMaximumBytes)&&!o.memoryProfile)throw new Error(
"This model requires a verified config memory profile");const c=typeof o.dtype=="string"?[["model",o.dtype]]:o.dtype&&typeof o.
dtype=="object"&&!Array.isArray(o.dtype)?Object.entries(o.dtype):[];if(!c.length||c.length>16||c.some(([f,h])=>!/^[A-Za-z0-9_-]{1,100}$/.
test(f)||!["fp32","fp16","q4","q4f16","q8"].includes(h)))throw new Error("Invalid model dtype configuration");if(o.architecture===
"qwen3_5"&&c.some(([,f])=>f!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=f=>f==="fp3\
2"?"":f==="q8"?"_quantized":`_${f}`,d=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof o.dtype!="stri\
ng"||o.task==="text-generation")&&d.push(...c.map(([f,h])=>`onnx/${f}${l(h)}.onnx`)),o.task==="image-text-to-text")for(const f of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const h=typeof o.dtype=="string"?o.dtype:o.dtype[f];if(!h)throw new Error(
"Multimodal dtype configuration is missing a module");d.push(`onnx/${f}${l(h)}.onnx`),o.architecture==="qwen3_5"&&d.push(
`onnx/${f}${l(h)}.onnx_data`)}if(d.some(f=>!n.has(f)))throw new Error("Incomplete model package");if(o.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(o.requiredFeatures!==void 0&&(!Array.isArray(o.requiredFeatures)||o.requiredFeatures.length>
32||o.requiredFeatures.some(f=>typeof f!="string"||f.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,
totalBytes:i,resourcePolicy:s}}function sE(t,e){const r=new URL(e),n={};for(const s of["mjs","wasm"]){if(typeof t?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(t[s],r);if(i.origin!==r.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const Et=Object.freeze({maximumBytes:16*1024**3,headerBytes:16*
1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,stringBytes:1024**2}),rm=Object.freeze(n$("lla\
ma.cpp").map(t=>t.architecture)),iE="peercompute.gguf.header.v1",l$="3.8.1",vh=new Map([[0,["F32",1,4]],[1,["F16",1,2]],
[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,
["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",
256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],
[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),jl=new Map([[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_\
0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k\
_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,
"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),d$=new TextDecoder("utf-8",{fatal:!0}),u$=t=>Array.
from(t,e=>e.toString(16).padStart(2,"0")).join(""),Me=t=>new Error(`Unsupported GGUF Hub package: ${t}`);function xr(t,e,r,n=0){
if(!Number.isSafeInteger(t)||t<n||t>e)throw Me(`invalid ${r}`);return t}class f$ extends Error{constructor(){super("Trun\
cated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function oE(t,{size:e}={}){if(!(t instanceof Uint8Array))throw Me(
"header bytes required");if(xr(e,Et.maximumBytes,"file size",24),t.length>Et.headerBytes||t.length>e)throw Me("header by\
te budget exceeded");const r=new DataView(t.buffer,t.byteOffset,t.byteLength);let n=0;function s(v){if(xr(v,Et.headerBytes,
"header field length"),n+v>Et.headerBytes)throw Me("header byte budget exceeded");if(n+v>t.length)throw new f$;const w=n;
return n+=v,w}const i=()=>r.getUint32(s(4),!0),o=()=>{const v=r.getBigUint64(s(8),!0);if(v>BigInt(Number.MAX_SAFE_INTEGER))
throw Me("unsafe 64-bit value");return Number(v)};function a(v=Et.stringBytes,w=!0){const I=xr(o(),v,"string length"),C=s(
I);return w?d$.decode(t.subarray(C,C+I)):void 0}function c(v,w=!0,I=!1){if(v===8)return a(Et.stringBytes,w);if(v===9){if(I)
throw Me("nested metadata arrays");const L=i(),N=xr(o(),Et.arrayItems,"array count");if(L===9||L>12)throw Me("metadata a\
rray type");if(L===8)for(let H=0;H<N;H++)a(Et.stringBytes,!1);else s(N*[1,1,2,2,4,4,4,1,0,0,8,8,8][L]);return{array:!0,element:L,
count:N}}const C=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!C[v])throw Me("metadata value type");const T=s(C[v]);if(!w)return;if(v===
0)return r.getUint8(T);if(v===1)return r.getInt8(T);if(v===2)return r.getUint16(T,!0);if(v===3)return r.getInt16(T,!0);if(v===
4)return r.getUint32(T,!0);if(v===5)return r.getInt32(T,!0);if(v===6)return r.getFloat32(T,!0);if(v===7){const L=r.getUint8(
T);if(L>1)throw Me("boolean value");return!!L}if(v===12)return r.getFloat64(T,!0);const P=v===10?r.getBigUint64(T,!0):r.
getBigInt64(T,!0);if(P>BigInt(Number.MAX_SAFE_INTEGER)||P<BigInt(Number.MIN_SAFE_INTEGER))throw Me("unsafe metadata inte\
ger");return Number(P)}if(i()!==1179993927)throw Me("magic or byte order");const l=i();if(![2,3].includes(l))throw Me("v\
ersion");const d=xr(o(),Et.tensors,"tensor count",1),f=xr(o(),Et.metadata,"metadata count",1),h=new Map;for(let v=0;v<f;v++){
const w=a(512);if(!w||h.has(w)||/[\u0000-\u001f\u007f]/u.test(w))throw Me("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.
test(w))throw Me("custom tensor layout requires catalog review");const I=i(),C=["general.architecture","general.type","g\
eneral.file_type","general.alignment","general.name","general.quantization_version","split.count","split.no","split.tens\
ors.count","tokenizer.ggml.model","tokenizer.ggml.tokens"].includes(w);h.set(w,c(I,C))}const p=h.get("general.architectu\
re");if(!rm.includes(p))throw Me("architecture");if(h.has("general.type")&&h.get("general.type")!=="model")throw Me("ada\
pter or non-model GGUF");if(/georefine/i.test(h.get("general.name")??""))throw Me("custom GeoRefine model requires catal\
og review");if((h.get("split.count")??1)!==1||(h.get("split.no")??0)!==0||(h.get("split.tensors.count")??d)!==d)throw Me(
"split GGUF requires complete shard admission");if(![void 0,2].includes(h.get("general.quantization_version")))throw Me(
"quantization version");const m=h.get("general.file_type");if(!jl.has(m))throw Me("file quantization type");if(!["llama",
"gpt2"].includes(h.get("tokenizer.ggml.model"))||h.get("tokenizer.ggml.tokens")?.element!==8||!h.get("tokenizer.ggml.tok\
ens")?.count)throw Me("self-contained supported tokenizer required");const b=xr(h.get("general.alignment")??32,4096,"ali\
gnment",1);if(b&b-1)throw Me("alignment must be a power of two");const g=new Set,u=new Set,y=[];let E=0;for(let v=0;v<d;v++){
const w=a(512);if(!w||g.has(w)||/georefine|[\u0000-\u001f\u007f]/iu.test(w))throw Me("duplicate or custom tensor name");
g.add(w);const I=xr(i(),4,"tensor dimensions",1);let C=1,T=0;for(let te=0;te<I;te++){const X=xr(o(),Et.maximumBytes,"ten\
sor dimension",1);te===0&&(T=X),C*=X,xr(C,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const P=i(),L=vh.get(P);if(!L||
T%L[1])throw Me("unsupported tensor codec or quantized row shape");const N=xr(C/L[1]*L[2],e,"tensor bytes",1),H=o();if(H%
b||H+N>e)throw Me("tensor offset exceeds file or alignment");y.push({start:H,end:H+N}),u.add(P),E=Math.max(E,N)}if(!g.has(
"token_embd.weight")||!g.has("output_norm.weight"))throw Me("text model tensor layout");const k=n,A=Math.ceil(n/b)*b;y.sort(
(v,w)=>v.start-w.start);let S=0;for(const v of y){if(v.start<S||A+v.end>e)throw Me("overlapping or truncated tensor data");
S=v.end}return{schema:iE,version:l,architecture:p,fileType:m,dtype:jl.get(m),tensorCount:d,metadataCount:f,headerBytes:k,
dataOffset:A,maximumTensorBytes:E,tensorTypes:[...u].sort((v,w)=>v-w),headerSha256:u$(ka(t.subarray(0,k)))}}async function aE({
readRange:t,size:e,signal:r}={}){if(typeof t!="function")throw Me("range reader required");xr(e,Et.maximumBytes,"file si\
ze",24);let n=new Uint8Array(0),s=Math.min(64*1024,e);for(;;){zt(r);const i=new Uint8Array(s);i.set(n);for(let o=n.length;o<
s;){const a=Math.min(Et.rangeBytes,s-o),c=await t(o,a,{signal:r});if(zt(r),!(c instanceof Uint8Array)||c.length!==a)throw Me(
"truncated range response");i.set(c,o),o+=a}n=i;try{return oE(n,{size:e})}catch(o){if(o.code!=="ERR_GGUF_HEADER_TRUNCATE\
D"||s===e)throw o;if(s===Et.headerBytes)throw Me("header exceeds bounded probe");s=Math.min(s*2,e,Et.headerBytes)}}}function h$(t){
if(!t||t.schema!==iE||![2,3].includes(t.version)||!rm.includes(t.architecture)||!jl.has(t.fileType)||jl.get(t.fileType)!==
t.dtype||!/^[a-f0-9]{64}$/.test(t.headerSha256??""))throw Me("header profile");for(const[r,n]of[["tensorCount",Et.tensors],
["metadataCount",Et.metadata],["headerBytes",Et.headerBytes],["dataOffset",Et.headerBytes+4096],["maximumTensorBytes",Et.
maximumBytes]])xr(t[r],n,r,1);if(t.dataOffset<t.headerBytes||!Array.isArray(t.tensorTypes)||!t.tensorTypes.length||t.tensorTypes.
length>vh.size||t.tensorTypes.some((r,n)=>!vh.has(r)||n>0&&r<=t.tensorTypes[n-1]))throw Me("tensor profile");const e=["s\
chema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerBytes","dataOffset","maximumTens\
orBytes","tensorTypes","headerSha256"];if(Object.keys(t).some(r=>!e.includes(r)))throw Me("unexpected header profile fie\
ld");return Object.fromEntries(e.map(r=>[r,t[r]]))}function cE({repository:t,revision:e,file:r,header:n}={}){if(typeof t!=
"string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(t)||!/^[a-f0-9]{40}$/.test(e??""))throw Me(
"immutable Hugging Face repository/revision required");if($a(r?.path),!r.path.endsWith(".gguf")||!/^[a-f0-9]{64}$/.test(
r.sha256??""))throw Me("pinned GGUF SHA-256 required");xr(r.size,Et.maximumBytes,"weight size",24);const s=h$(n);if(s.dataOffset+
s.maximumTensorBytes>r.size)throw Me("header/file size mismatch");const i=r.size>4*1024**3;return{model:{runtime:"llama.\
cpp",runtimeVersion:l$,architecture:s.architecture==="qwen35"?"qwen3_5":s.architecture,format:"GGUF",task:"text-generati\
on",dtype:s.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:t,revision:e,gguf:{...s,path:r.path,size:r.
size,sha256:r.sha256}},weights:[r],totalBytes:r.size,resourcePolicy:{maxModelBytes:Et.maximumBytes,minimumCpuBytes:(i?8:
2)*1024**3,minimumGpuBytes:(i?16:2)*1024**3}}}function Dd(t,{files:e,totalBytes:r}={}){if(!t?.gguf)throw Me("bounded hea\
der profile required");const{path:n,size:s,sha256:i,...o}=t.gguf,a=cE({repository:t.repository,revision:t.revision,file:{
path:n,size:s,sha256:i},header:o});for(const c of["runtime","runtimeVersion","architecture","format","task","dtype"])if(t[c]!==
a.model[c])throw Me(`model ${c} disagrees with header`);if(JSON.stringify(t.modalities)!=='["text"]'||JSON.stringify(t.requiredFeatures)!==
'["shader-f16"]')throw Me("text-only/f16 capability profile required");if(e){const c=e.filter(l=>l.path.endsWith(".gguf"));
if(c.length!==1||c[0].path!==n||c[0].size!==s||c[0].sha256!==i||e.some(l=>!/^[a-f0-9]{64}$/.test(l.sha256??"")))throw Me(
"file closure/digest mismatch");a.weights=c,r=e.reduce((l,d)=>l+d.size,0)}return a.totalBytes=xr(r??s,Et.maximumBytes,"p\
ackage bytes",s),a}async function p$(t,e,r,{signal:n}={}){if(!t.gguf)return;const s=Dd(t,{files:e}).model.gguf,i=await aE(
{size:e[0].size,signal:n,readRange:(d,f,h)=>r.read(e[0].path,d,f,h)}),{path:o,size:a,sha256:c,...l}=s;if(JSON.stringify(
i)!==JSON.stringify(l))throw Me("stored header does not match inspected package")}const m$=Object.freeze(Object.defineProperty(
{__proto__:null,GGUF_HUB_ARCHITECTURES:rm,GGUF_HUB_LIMITS:Et,inspectGgufHeader:aE,parseGgufHeader:oE,resolveGgufHubProfile:cE,
validateGgufHubModel:Dd,verifyGgufHubWeights:p$},Symbol.toStringTag,{value:"Module"})),Zn=Object.freeze({sampleRate:16e3,
maxInputSeconds:20,maxOutputSeconds:30,maxTextBytes:1024,maxTextCharacters:256,maxTranscriptBytes:8192,residentBytes:1024**
3}),lE=(t,e)=>t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(t).length===Object.keys(e).length&&Object.keys(t).
every(r=>lE(t[r],e[r])):t===e;function nm(t){const e=as(t),r=Object.values(ri).find(n=>lE(n.model,e.model));if(!r||e.files.
length!==r.files.length)throw new Error("Speech package is outside the pinned catalog");for(const n of r.files){const s=e.
files.find(i=>i.path===n.path);if(!s||s.size!==n.size||s.sha256!==n.sha256)throw new Error("Speech file differs from its\
 pinned digest")}return{manifest:e,trusted:r,totalBytes:r.totalBytes,resourcePolicy:{minimumCpuBytes:Zn.residentBytes,minimumGpuBytes:Zn.
residentBytes,maxModelBytes:512*1024**2}}}function dE(t,e,r=Zn.maxInputSeconds){if(!(t instanceof Float32Array)||e!==Zn.
sampleRate||t.length<1600||t.length>e*r)throw new Error("Speech input requires 0.1–20 seconds of mono Float32 PCM at 160\
00 Hz");for(const n of t)if(!Number.isFinite(n)||Math.abs(n)>1.01)throw new Error("Invalid PCM sample");return{samples:t,
sampleRate:e}}function uE(t,e){const{trusted:r}=nm(e);if(t.image)throw new Error("Speech does not accept image inputs");
if(r.model.task==="automatic-speech-recognition"){if(t.prompt!=null||t.messages!=null)throw new Error("ASR accepts audio\
 only");return{task:r.model.task,audio:dE(t.audio?.samples,t.audio?.sampleRate)}}if(t.audio!=null||t.messages!=null||typeof t.
prompt!="string")throw new Error("TTS accepts one text prompt");const n=t.prompt.trim();if(!n||[...n].length>Zn.maxTextCharacters||
new TextEncoder().encode(n).length>Zn.maxTextBytes)throw new Error("Speak one short sentence at a time (maximum 256 char\
acters)");return{task:r.model.task,prompt:n}}const g$=Object.freeze({id:"transformers-speech",moduleUrl:"peercompute:spe\
ech-inference",acceptsAudio:!0,validateManifest:nm,validateRuntimeAssets:sE,normalizeGenerationInput:uE,terminateOnUnload:!0}),
b$=Object.freeze(Object.defineProperty({__proto__:null,SPEECH_LIMITS:Zn,normalizeSpeechInput:uE,speechRuntimeDefinition:g$,
validatePcm:dE,validateSpeechManifest:nm},Symbol.toStringTag,{value:"Module"})),Sr=1024**3,y$=[...Object.values(Md),...Object.
values(Xi),...Object.values(Ya),...Object.values(ri)],w$=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkg\
roupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWo\
rkgroupSizeZ","maxComputeWorkgroupsPerDimension"],v$=new Set(["transformers.js","llama.cpp","onnx-diffusion","transforme\
rs-speech"]),Eh="Load this speech model from Browse models, or use Enable voice in a world-agent window.";function kh(t,e=y$){
const r=t?.model??t??{},n=e.filter(s=>s.model.runtime===r.runtime&&(s.repository??s.model.repository)===(r.repository??t?.
repository)&&(s.revision??s.model.revision)===(r.revision??t?.revision)&&["architecture","task","format","dtype"].every(
i=>!t?.model&&r[i]===void 0||Gl(r[i],s.model[i]))&&(r.runtime!=="transformers-speech"||t?.model&&Gl(r,s.model)&&Array.isArray(
t.files)&&t.files.length===s.files.length&&s.files.every(i=>t.files.some(o=>o.path===i.path&&o.size===i.size&&o.sha256===
i.sha256)))&&(!t?.model||!Array.isArray(t.files)||!Array.isArray(s.files)||E$(r.runtime,t.files,s.files)));return n.length===
1?n[0]:t?.model?void 0:n.find(s=>s.id===t?.modelId)}function E$(t,e,r){const n=o=>t!=="llama.cpp"||o.path?.endsWith(".gg\
uf"),s=e.filter(n),i=r.filter(n);return s.length===i.length&&s.every(o=>i.some(a=>a.path===o.path&&a.size===o.size&&(a.sha256===
void 0||a.sha256===o.sha256)))}function fE(t){const e=t?.model??t??{},r=kh(t),n=t?.model?e:r?.model??e,s=t?.files??r?.files;
let i=null;if(s!==void 0){if(!Array.isArray(s)||!s.length||s.length>Ae.maxFiles)throw new Error("Invalid model file list");
i=0;for(const o of s){if(!o||!Number.isSafeInteger(o.size)||o.size<0)throw new Error("Invalid model file size");if(i+=o.
size,!Number.isSafeInteger(i))throw new Error("Invalid model package size")}}else Number.isSafeInteger(t?.totalBytes)&&t.
totalBytes>=0&&(i=t.totalBytes);return{model:n,files:s,trusted:r,totalBytes:i,descriptorOnly:!t?.model&&!r&&s===void 0}}
function Ko(t){const{model:e,totalBytes:r,files:n,trusted:s,descriptorOnly:i}=fE(t);if(e.runtime==="transformers-speech"){
if(!s)throw Object.assign(new Error("Speech package differs from the pinned voice catalog"),{code:"ERR_MODEL_SPEECH_UNVE\
RIFIED"});return{cpuBytes:Zn.residentBytes,gpuBytes:Zn.residentBytes}}if(e.runtime==="onnx-diffusion")return{cpuBytes:8*
Sr,gpuBytes:8*Sr};if(e.runtime==="llama.cpp"){if(r===null)return{cpuBytes:0,gpuBytes:0};const o=r>4*Sr;return{cpuBytes:(o?
8:2)*Sr,gpuBytes:(o?16:2)*Sr}}if(e.runtime==="transformers.js"){if(i)return{cpuBytes:4*Sr,gpuBytes:4*Sr};const o=ec(e,{...n?
{files:n}:{},...r!==null?{totalBytes:r}:{}});return{cpuBytes:Math.max(4*Sr,o.minimumCpuBytes),gpuBytes:Math.max(4*Sr,o.minimumGpuBytes)}}
throw new Error("Unsupported model runtime")}function xh(t={}){if(t===null&&(t={}),typeof t!="object"||Array.isArray(t)||
![Object.prototype,null].includes(Object.getPrototypeOf(t))||Object.keys(t).some(r=>!["cpuBytes","gpuBytes"].includes(r)))
throw new TypeError("Invalid model memory budgets");const e={};for(const r of["cpuBytes","gpuBytes"]){const n=t[r];if(n==
null)e[r]=null;else{if(!Number.isSafeInteger(n)||n<=0||n>1024*Sr)throw new RangeError(`Invalid ${r} memory budget`);e[r]=
n}}return e}async function k$({scope:t=globalThis,timeoutMs:e=3e3}={}){if(!Number.isSafeInteger(e)||e<1||e>6e4)throw new RangeError(
"Invalid device probe timeout");const r=t.WebAssembly,n=t.navigator?.deviceMemory,s={webgpu:null,features:[],limits:{},crossOriginIsolated:t.
crossOriginIsolated===!0,sharedArrayBuffer:typeof t.SharedArrayBuffer=="function",jspi:typeof r?.Suspending=="function"&&
typeof r?.promising=="function",memory64:!1,deviceMemoryGiB:typeof n=="number"&&Number.isFinite(n)&&n>0?n:null};if(s.sharedArrayBuffer&&
typeof r?.Memory=="function")try{new r.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"}),s.memory64=!0}catch{}const i=t.
navigator?.gpu;if(typeof i?.requestAdapter!="function")return{...s,webgpu:!1};const o=performance.now()+e,a=new Error("G\
PU capability check timed out");let c,l,d,f=!1;const h=()=>{if(f||performance.now()>=o)throw a},p=async()=>{h();let m=await i.
requestAdapter({powerPreference:"high-performance"});return h(),m==null&&(await new Promise(b=>{d=b,l=setTimeout(b,100)}),
l=d=void 0,h(),m=await i.requestAdapter({powerPreference:"high-performance"}),h()),m};try{const m=await Promise.race([p(),
new Promise((b,g)=>{c=setTimeout(()=>g(a),e)})]);if(!m||m.isFallbackAdapter||m.info?.isFallbackAdapter)return{...s,webgpu:!1};
s.features=[...m.features].filter(b=>typeof b=="string"&&b.length<=80).slice(0,64).sort();for(const b of w$){const g=m.limits?.[b];
Number.isSafeInteger(g)&&g>0&&(s.limits[b]=g)}s.webgpu=!0}catch(m){s.probeError=String(m?.message??m).slice(0,300)}finally{
f=!0,clearTimeout(c),clearTimeout(l),d?.()}return s}function x$({model:t,files:e,totalBytes:r,trusted:n,descriptorOnly:s}){
if(!v$.has(t.runtime))return["runtime_unsupported","This model runtime is not supported locally"];if(t.requiredFeatures!==
void 0&&(!Array.isArray(t.requiredFeatures)||t.requiredFeatures.length>32||t.requiredFeatures.some(o=>typeof o!="string"||
!o||o.length>80)))return["model_invalid","Invalid model GPU feature requirements"];if(t.runtime==="transformers-speech")
return null;const i=t.runtime==="llama.cpp"?16*Sr:t.runtime==="onnx-diffusion"?3*Sr:ec(t).maxModelBytes;if(!s&&r!==null&&
r>i)return["package_too_large",`Model package is ${(r/Sr).toFixed(2)} GiB; this runtime supports up to ${Number((i/Sr).toFixed(
2))} GiB.`];if(t.runtime==="transformers.js"){const o=Za("transformers.js",t.architecture);if((!s||t.runtimeVersion!==void 0)&&
t.runtimeVersion!==Ld||(!s||t.architecture!==void 0)&&!o)return["runtime_unsupported","Model version or architecture is \
not supported locally"];if(!s&&t.task!==void 0&&t.task!==o.task)return["runtime_unsupported","Model task does not match \
its supported architecture"];if(!s&&(o.requiresMemoryProfile||o.task==="text-generation"&&r>Qn.legacyMaximumBytes)&&!t.memoryProfile)
return["model_invalid","Inspect the model config to verify its memory profile before loading"];const a=typeof t.dtype=="\
string"?[t.dtype]:t.dtype&&typeof t.dtype=="object"&&!Array.isArray(t.dtype)?Object.values(t.dtype):[];if((!s||t.dtype!==
void 0)&&(!a.length||a.some(c=>!["fp32","fp16","q4","q4f16","q8"].includes(c))||t.architecture==="qwen3_5"&&a.some(c=>c!==
"q4")))return["runtime_unsupported","Model precision is not supported by this runtime"]}else if(t.runtime==="llama.cpp"&&
s){if(t.runtimeVersion!==void 0&&t.runtimeVersion!=="3.8.1"||t.task!==void 0&&t.task!=="text-generation")return["runtime\
_unsupported","Model version or task is not supported locally"]}else if(t.runtime==="llama.cpp"&&!n&&t.gguf)try{Dd(t,{totalBytes:r,
...e?.every(o=>o.sha256)?{files:e}:{}})}catch(o){return["catalog_unsupported",o.message]}else{if(!n||t.runtimeVersion!==
n.model.runtimeVersion&&!(t.runtime==="llama.cpp"&&n.model.runtimeVersion===void 0&&t.runtimeVersion==="3.8.1"))return["\
catalog_unsupported","This package is not in the approved local runtime catalog"];for(const o of t.runtime==="onnx-diffu\
sion"?["architecture","task","format","dtype","pipeline","width","height","steps","padTokenId","weightQuantization","mod\
alities","outputModalities","requiredFeatures"]:["architecture","task","format","dtype"])if(!Gl(t[o],n.model[o]))return[
"catalog_unsupported","Model profile differs from the approved runtime catalog"];if(e){const o=t.runtime==="llama.cpp"?n.
files.filter(c=>c.path.endsWith(".gguf")):n.files,a=t.runtime==="llama.cpp"?e.filter(c=>c.path?.endsWith(".gguf")):e;if(a.
length!==o.length||a.some(c=>!o.some(l=>l.path===c.path&&l.size===c.size&&l.sha256===c.sha256)))return["catalog_unsuppor\
ted","Model files differ from the approved runtime catalog"]}}return t.runtime==="onnx-diffusion"&&e?.some(o=>o.size<=0||
o.size>=2*Sr)?["file_too_large","A file exceeds the diffusion loader’s supported buffer size"]:null}function Gl(t,e){return t===
e?!0:!t||!e||typeof t!="object"||typeof e!="object"||Array.isArray(t)!==Array.isArray(e)?!1:Object.keys(t).length===Object.
keys(e).length&&Object.keys(t).every(r=>Gl(t[r],e[r]))}function S$(t,{device:e,budgets:r={}}={}){const n=xh(r);let s,i,o;
try{s=fE(t),i=Ko(t)}catch(h){o=h,i={cpuBytes:0,gpuBytes:0}}const a=(h,p,m)=>({status:h,reason:m,code:p,...i});if(!e)return a(
"checking","device_checking","Checking device compatibility");if(o)return a("unavailable",o.code==="ERR_MODEL_FILE_TOO_L\
ARGE"?"file_too_large":o.code==="ERR_MODEL_PACKAGE_TOO_LARGE"?"package_too_large":o.code==="ERR_MODEL_SPEECH_UNVERIFIED"?
"catalog_unsupported":"model_invalid",o.message);const c=x$(s);if(c)return a("unavailable",...c);if(n.cpuBytes!==null&&i.
cpuBytes>n.cpuBytes)return a("unavailable","cpu_budget_exceeded","Exceeds configured RAM memory budget");if(n.gpuBytes!==
null&&i.gpuBytes>n.gpuBytes)return a("unavailable","gpu_budget_exceeded","Exceeds configured GPU memory budget");if(e.webgpu===
!1)return a("unavailable","webgpu_unavailable","Hardware WebGPU is unavailable in this browser");if(s.model.runtime==="l\
lama.cpp")for(const[h,p]of[["crossOriginIsolated","GGUF requires cross-origin isolation"],["sharedArrayBuffer","GGUF req\
uires SharedArrayBuffer"],["jspi","GGUF requires WebAssembly JSPI"],["memory64","GGUF requires shared WebAssembly memory\
64"]]){if(e[h]===!1)return a("unavailable",`gguf_${h}_unavailable`,p);if(e[h]!==!0)return a("unknown","device_probe_unkn\
own","GGUF browser prerequisites have not been verified")}if(e.webgpu!==!0)return a("unknown","device_probe_unknown","GP\
U capability check is incomplete; RAM/GPU memory fit is unverified");const l=new Set(e.features??[]),d=new Set(s.model.requiredFeatures??
[]),f=s.model.dtype;(["llama.cpp","onnx-diffusion"].includes(s.model.runtime)||(typeof f=="string"?[f]:Object.values(f??
{})).some(h=>["fp16","q4f16"].includes(h)))&&d.add("shader-f16");for(const h of d)if(!l.has(h)){const p=h==="shader-f16"&&
s.model.runtime==="llama.cpp"?"This GGUF engine requires FP16 GPU math (shader-f16), even with quantized weights. This b\
rowser does not expose it; see Setup help.":h==="shader-f16"?"Required FP16 GPU math (shader-f16) is unavailable in this\
 browser":`Required GPU feature ${h} is unavailable in this browser`;return a("unavailable","gpu_feature_unavailable",p)}
return s.descriptorOnly?a("unknown","model_metadata_unverified","Model metadata and RAM/GPU memory fit require verificat\
ion before loading"):s.model.runtime==="transformers-speech"?a("unknown","voice_managed",`${Eh} RAM/GPU memory fit is un\
verified.`):a("unknown","memory_fit_unverified","Required features are supported; RAM/GPU memory fit is unverified")}const Ay=1024**
3,A$=t=>Number.isSafeInteger(t)&&t>0?t:null,I$=(t,e)=>t===null?e:e===null?t:Math.min(t,e);function _$({computeManager:t,
owned:e=!1,initial:r}={}){if(!t||typeof e!="boolean")throw new TypeError("Model budgets require a manager and explicit o\
wnership");let n=xh(r);const s=()=>({...n}),i={allowUnboundedMemory:e,getMemoryBudgets:s};function o(l){if(!Number.isInteger(
l)||l<1||l>8)throw new RangeError("Invalid resident capacity");return{cpu:{units:l,memoryBytes:e?n.cpuBytes??0:12*Ay},gpu:{
units:l,memoryBytes:e?n.gpuBytes??0:16*Ay}}}function a(l){const d=xh(l);if(e){const f=t.resourceBroker;if(!f?.setMemoryBudgets)
throw new Error("The owned model resource broker is not initialized");f.setMemoryBudgets({cpu:d.cpuBytes,gpu:d.gpuBytes})}
return n=d,s()}function c(){const l=t.resourceBroker?.reportPressure().pools??{},d={owned:e};for(const f of["cpu","gpu"]){
const h=A$(l[f]?.memoryBytes),p=n[`${f}Bytes`],m=I$(p,h),b=l[f]?.activeMemoryBytes??0;d[f]={reservedBytes:b,budgetBytes:m,
configuredBytes:p,brokerBytes:h,overBudget:m!==null&&b>m}}return d}return{get:s,set:a,status:c,initialResourceBudgets:o,
admissionOptions:i}}const Do=Uint32Array.from([1732584193,4023233417,2562383102,271733878,3285377520]),ws=new Uint32Array(
80);class C$ extends Zp{A=Do[0]|0;B=Do[1]|0;C=Do[2]|0;D=Do[3]|0;E=Do[4]|0;constructor(){super(64,20,8,!1)}get(){const{A:e,
B:r,C:n,D:s,E:i}=this;return[e,r,n,s,i]}set(e,r,n,s,i){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=i|0}process(e,r){
for(let c=0;c<16;c++,r+=4)ws[c]=e.getUint32(r,!1);for(let c=16;c<80;c++)ws[c]=Ju(ws[c-3]^ws[c-8]^ws[c-14]^ws[c-16],1);let{
A:n,B:s,C:i,D:o,E:a}=this;for(let c=0;c<80;c++){let l,d;c<20?(l=V1(s,i,o),d=1518500249):c<40?(l=s^i^o,d=1859775393):c<60?
(l=K1(s,i,o),d=2400959708):(l=s^i^o,d=3395469782);const f=Ju(n,5)+l+a+d+ws[c]|0;a=o,o=i,i=Ju(s,30),s=n,n=f}n=n+this.A|0,
s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.E|0,this.set(n,s,i,o,a)}roundClean(){di(ws)}destroy(){this.set(0,0,0,0,0),
di(this.buffer)}}const sm=Xp(()=>new C$),T$=new Set([408,429,500,502,503,504]);function R$(t,e){return e?.throwIfAborted(),
new Promise((r,n)=>{const s=()=>{clearTimeout(i),n(e.reason)},i=setTimeout(()=>{e?.removeEventListener("abort",s),r()},t);
e?.addEventListener("abort",s,{once:!0})})}function Iy(t){return["TypeError","NetworkError","TimeoutError"].includes(t?.
name)}function Yu(t){try{Promise.resolve(t()).catch(()=>{})}catch{}}async function*M$(t,e,{signal:r,fetchImpl:n=fetch,onRetry:s,
maxRetries:i=5,baseRetryMs:o=1e3,inactivityTimeoutMs:a=3e4}={}){let c=0,l=0,d,f=!1;const h=!!(t.sha256||t.gitBlobSha1);for(;;){
r?.throwIfAborted();const p=new AbortController,m=r?AbortSignal.any([r,p.signal]):p.signal;let b,g,u;const y=async k=>{let A,
S;m.throwIfAborted();const v=new Promise((I,C)=>{S=()=>C(m.reason),m.addEventListener("abort",S,{once:!0})}),w=new Promise(
(I,C)=>{A=setTimeout(()=>{const T=new DOMException("Model download stopped receiving data","TimeoutError");p.abort(T),C(
T)},a)});try{return await Promise.race([k(),w,v])}finally{clearTimeout(A),m.removeEventListener("abort",S)}};try{try{b=await y(
async()=>{const k=await n(e(t.path),{signal:m,credentials:"omit",cache:"no-store",...c?{headers:{Range:`bytes=${c}-${t.size-
1}`}}:{}});if(m.aborted)throw Yu(()=>k.body?.cancel?.()),m.reason;return k})}catch(k){if(r?.throwIfAborted(),!Iy(k))throw k;
u=k}if(b)if(b.ok){if(!b.body)throw new Error(`Artifact source has no body: ${t.path}`);const k=b.headers?.get("content-e\
ncoding");if(c&&(f||k&&k!=="identity"))throw new Error(`Cannot resume an encoded model download: ${t.path}`);if(c||b.status===
206){const S=b.headers?.get("content-range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/u);if(b.status!==206||!S||Number(S[1])!==
c||Number(S[2])!==t.size-1||Number(S[3])!==t.size)throw new Error(`Model download cannot resume: invalid or ignored byte\
 range for ${t.path}. Retry Load.`)}const A=b.headers?.get("etag");if(c&&d&&A&&A!==d)throw new Error(`Model source chang\
ed during download: ${t.path}`);if(c||(d=A,f=!!(k&&k!=="identity")),b.body.getReader){const S=b.body.getReader();g={next:()=>S.
read(),return:async()=>{try{await S.cancel()}finally{S.releaseLock()}}}}else g=b.body[Symbol.asyncIterator]();for(;;){let S;
try{S=await y(()=>g.next())}catch(v){if(r?.throwIfAborted(),!Iy(v))throw v;u=v;break}if(r?.throwIfAborted(),S.done){if(c===
t.size)return;u=new Error(`Model download ended before all bytes arrived: ${t.path}`);break}if(!(S.value instanceof Uint8Array)||
c+S.value.byteLength>t.size)throw new Error(`Model download exceeds its declared size or has invalid bytes: ${t.path}`);
c+=S.value.byteLength,yield S.value}}else{const k=new Error(`Artifact source failed: ${t.path} (${b.status})`);if(!T$.has(
b.status))throw k;u=k}}finally{p.abort(),Yu(g?()=>g.return?.():()=>b?.body?.cancel?.())}if(r?.throwIfAborted(),c>0&&c===
t.size&&h)return;if(c&&!h||l>=i){const k=new Error(`Download interrupted for ${t.path} after ${c} of ${t.size} bytes. `+
(c&&!h?"This file cannot be safely resumed. ":`Recovery failed after ${l} retries. `)+"Check your connection and retry L\
oad.",{cause:u});throw k.code="ERR_MODEL_DOWNLOAD_INTERRUPTED",k}l+=1;const E=Math.min(o*2**(l-1),8e3);s?.({loaded:c,retryAttempt:l,
maxRetries:i,retryDelayMs:E}),await R$(E,r)}}function B$(){let t=Promise.resolve();return{run(e,{signal:r}={}){const n=t.
catch(()=>{}).then(()=>(r?.throwIfAborted(),e()));return t=n,n},settled:()=>t.catch(()=>{})}}function hE(t){if(t?.code===
"ERR_MODEL_STORAGE_FULL"||t?.name!=="QuotaExceededError")return t;const e=new Error("The browser refused additional stor\
age. Delete an unused stored model or free device storage, then retry the import.",{cause:t});return e.name="QuotaExceed\
edError",e.code="ERR_MODEL_STORAGE_FULL",e}async function L$(t,e,r){const n=o=>`${o.sha256}:${o.size}`,s=new Set(e.filter(
o=>!o.cid&&!o.gitBlobSha1&&/^[a-f0-9]{64}$/.test(o.sha256)&&Number.isSafeInteger(o.size)&&o.size>=0).map(n)),i=new Map;if(r?.
throwIfAborted(),!s.size)return i;for await(const o of t.list({signal:r})){if(r?.throwIfAborted(),o.kind!=="file"||o.status!==
"complete")continue;const a=n(o);if(s.delete(a)&&(i.set(a,o.cid),!s.size))break}return i}async function Xu(t,e,r,{signal:n,
onProgress:s,fetchImpl:i=fetch}={}){try{const o=await L$(t,e.files,n);return await t.withRetention(async a=>{const c=[];
for(let l=0;l<e.files.length;l+=1){n?.throwIfAborted();const d=e.files[l],f=()=>globalThis.performance?.now()??Date.now();
let h=0,p=f();const m=(y={})=>s?.({stage:"import",path:d.path,index:l,total:e.files.length,loaded:h,totalBytes:d.size,...y});
m();const b=d.cid||!d.gitBlobSha1&&o.get(`${d.sha256}:${d.size}`);let g=b?await a.stat(b,{signal:n}):null;const u=g?.kind===
"file"&&g.status==="complete"&&g.size===d.size&&g.sha256===d.sha256;if(!u){const y=d.gitBlobSha1?sm.create().update(new TextEncoder().
encode(`blob ${d.size}\0`)):null;async function*E(){for await(const k of M$(d,r,{signal:n,fetchImpl:i,onRetry:m})){n?.throwIfAborted(),
y?.update(k),h+=k.byteLength,yield k;const A=f();h<d.size&&A-p>=100&&(p=A,m())}if(y&&Da(y.digest())!==d.gitBlobSha1)throw new Error(
`Source Git blob SHA-1 mismatch: ${d.path}`)}g=await a.importFile(E(),{expectedSize:d.size,...d.sha256?{expectedSha256:d.
sha256}:{},signal:n,pin:!1})}if(d.cid&&g.cid!==d.cid)throw new Error(`Imported CID differs: ${d.path}`);n?.throwIfAborted(),
h=d.size,m(u?{reused:!0}:{}),c.push({path:d.path,cid:g.cid,size:g.size,sha256:g.sha256})}return n?.throwIfAborted(),s?.(
{stage:"verify",total:e.files.length,totalBytes:c.reduce((l,d)=>l+d.size,0)}),n?.throwIfAborted(),a.importManifest({...e,
files:c},{pin:!0,signal:n})},{signal:n})}catch(o){throw hE(o)}}async function D$(t,{signal:e}={}){const r=[];for await(const n of t.
list({signal:e})){if(e?.throwIfAborted(),n.kind==="manifest"&&n.status==="partial"&&(n.pinned||n.retain)){try{const s=as(
n.manifest);if(s.model?.runtime!==void 0){if(typeof s.model.runtime!="string"||!s.model.runtime.trim())throw new Error("\
Invalid model runtime");r.push(n)}}catch(s){throw new Error(`Stored package ${n.cid} has invalid recovery metadata: ${s.
message}`,{cause:s})}continue}n.kind==="manifest"&&["complete","deleting"].includes(n.status)&&n.manifest?.model?.runtime&&
r.push(n)}return r}async function $$(t,e,{signal:r}={}){const n=t.store,s=t.networkManager?.getArtifactTransport?.();if(!n.
persistent||s?.store===n&&s.releaseOwnership)return e();if(!n.lockManager?.request){if(n.backend?.hasExclusiveLock)return e();
throw new Error("Stored model deletion requires exclusive network ownership for this store")}return n.lockManager.request(
`${n.lockName}:network-owner`,{mode:"exclusive",ifAvailable:!0},async i=>{if(!i)throw new Error("Another tab owns file s\
haring for this library. Delete the model from that tab, or close that tab and retry.");return r?.throwIfAborted(),e()})}
const _y="qwen3.5-0.8b-abliterated-q4-k-m-gguf";function pE({storeName:t="inference-models",storage:e,locks:r=globalThis.
navigator?.locks}={}){const n=`peercompute:model-console:last-loaded:v1:${encodeURIComponent(String(t))}`;if(e===void 0)
try{e=globalThis.localStorage}catch{e=null}function s(h){if(h?.version!==1||typeof h.manifestCid!="string"||h.manifestCid.
length>128||typeof h.modelId!="string"||!h.modelId||h.modelId.length>256||h.selectionId!==void 0&&!/^[a-f0-9-]{36}$/.test(
h.selectionId))return null;try{return{version:1,manifestCid:Ze(h.manifestCid).toString(),modelId:h.modelId,...h.selectionId?
{selectionId:h.selectionId}:{}}}catch{return null}}let i=null,o=!1;const a=()=>i?{...i}:null;function c(h=!1){if(o&&!h)return a();
try{if(!e?.getItem)return a();const p=e.getItem(n);try{i=typeof p=="string"&&p.length<=1024?s(JSON.parse(p)):null}catch{
i=null}o=!1}catch{}return a()}async function l(h,p){if(!r?.request)return h(!0);let m=!1;try{return await r.request(`${n}\
:write`,{mode:"exclusive",signal:p?AbortSignal.any([p,AbortSignal.timeout(1e3)]):AbortSignal.timeout(1e3)},()=>(m=!0,h(!0)))}catch(b){
if(m)throw b;return h(!1)}}function d(h,{signal:p}={}){const m=s({...h,version:1,selectionId:crypto.randomUUID()});if(!m)
throw new TypeError("A stored model preference requires a valid CID and model ID");return l(b=>{if(p?.aborted)return{record:c(),
committed:!1};const g=c(b);if(i=m,o=!b,b)try{e?.setItem(n,JSON.stringify(m))}catch{o=!0}return{record:a(),previous:g,committed:!0,
persisted:!o&&!!e?.setItem}},p)}const f=(h,p)=>h&&p&&h.manifestCid===p.manifestCid&&h.modelId===p.modelId&&h.selectionId===
p.selectionId;return c(),{readLastLoaded:c,rememberLoaded:(h,p)=>d(h,p).then(m=>m.record),rememberLoadedWithReceipt:d,restoreLastLoaded(h){
const p=s(h?.record),m=s(h?.previous);return!h?.committed||!p?Promise.resolve(c()):l(b=>{const g=c(h.persisted);if(!f(g,
p))return g;if(h.persisted&&!b)throw new Error("The cancelled load was cleaned up, but its saved selection could not be \
restored");if(h.persisted)try{m?e.setItem(n,JSON.stringify(m)):e.removeItem(n)}catch(u){throw new Error("The cancelled l\
oad was cleaned up, but its saved selection could not be restored",{cause:u})}return i=m,o=!h.persisted||!b,a()})},clearLastLoaded(h=a()){
const p=s(h);return l(m=>{const b=c(!0);if(!p||!b||b.manifestCid!==p.manifestCid||b.modelId!==p.modelId||b.selectionId!==
p.selectionId)return b;if(i=null,o=!m,m)try{e?.removeItem(n)}catch{o=!0}return null})}}}const N$="https://secretworkshop\
.net/peercompute/config/relay-config.json";async function Cy(t,{fetchImpl:e,signal:r,maximumBytes:n}){const s=await e(t,
{cache:"no-store",signal:r});if(!s.ok||!s.body)throw new Error(`Relay configuration unavailable (${s.status})`);const i=[];
let o=0;for await(const l of s.body){if(o+=l.byteLength,o>n)throw new Error("Relay configuration exceeds its byte limit");
i.push(l)}const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=l.byteLength;return JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(a))}async function P$({fetchImpl:t=globalThis.fetch,signal:e,baseUrl:r=globalThis.location?.href}={}){
const n=AbortSignal.timeout(2e4),s=e?AbortSignal.any([e,n]):n;let i;try{i=await Cy(new URL("./relay-config-source.json",
r).href,{fetchImpl:t,signal:s,maximumBytes:16*1024})}catch(l){if(s.aborted)throw l}const o=new URL(i?.relayConfigUrl??N$);
if(o.protocol!=="https:"||o.hostname!=="secretworkshop.net"||o.username||o.password)throw new Error("Relay configuration\
 must use the approved Secret Workshop HTTPS backend");const a=await Cy(o.href,{fetchImpl:t,signal:s,maximumBytes:64*1024}),
c=[...new Set((Array.isArray(a.bootstrapPeers)?a.bootstrapPeers:[]).filter(l=>typeof l=="string"&&l.length<=2048&&l.startsWith(
"/")&&l.includes("/wss/")&&l.includes("/p2p/")))].slice(0,16);if(!c.length)throw new Error("Production relay configurati\
on contains no secure bootstrap peers");return{bootstrapPeers:c,transportManager:{faultTolerance:"no-fatal"},...a.webrtc&&
typeof a.webrtc=="object"?{webrtc:a.webrtc}:{},pubsubType:a.pubsubType==="gossipsub"?"gossipsub":"floodsub",...a.gossipsub&&
typeof a.gossipsub=="object"?{gossipsub:a.gossipsub}:{}}}const tn="https://huggingface.co",Zu="peercompute.huggingface-m\
etadata.v1",O$=2*1024*1024,Ty=2*1024*1024,ef=20,Wc=new TextEncoder,U$=t=>JSON.parse(JSON.stringify(t)),Bi=(t,e=1600)=>typeof t==
"string"?t.slice(0,e):"";function Jn(t){if(typeof t!="string"||t.length>1024)throw new Error("Enter a Hugging Face owner\
/model repository");let e=t.trim(),r,n;if(e.startsWith("https://")){const i=new URL(e);if(i.origin!==tn||i.username||i.password||
i.search||i.hash)throw new Error("Use a public huggingface.co repository URL without credentials or query parameters");const o=i.
pathname.replace(/\/$/,"").slice(1).split("/");if(e=o.slice(0,2).join("/"),o.length>2){if(!["tree","blob","resolve"].includes(
o[2])||!o[3])throw new Error("Unsupported Hugging Face repository URL");o[3]!=="main"&&(r=$s(o[3])),o.length>4&&(n=tc(o.
slice(4).join("/")))}}const s=e.split("/");if(s.length!==2||s.some(i=>!/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(i)||i.includes(
"..")||i.includes("--"))||["datasets","spaces","api"].includes(s[0]))throw new Error("Enter a Hugging Face owner/model r\
epository");return{repository:e,...r?{revision:r}:{},...n?{path:n}:{}}}function $s(t){if(typeof t!="string"||!/^[a-f0-9]{40}$/i.
test(t))throw new Error("An immutable 40-character model revision is required");return t.toLowerCase()}function tc(t){if(typeof t!=
"string"||!t||Wc.encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("/")||t.split("/").some(e=>!e||
e==="."||e===".."))throw new Error("Invalid Hugging Face file path");return t}function Na(t,e,r){return t=Jn(t).repository,
`${tn}/${t}/resolve/${$s(e)}/${tc(r).split("/").map(encodeURIComponent).join("/")}`}class mr extends Error{constructor(e,{
status:r,retryAfterMs:n,cause:s,code:i}={}){super(e,{cause:s}),this.name="HuggingFaceError",this.status=r,this.retryAfterMs=
n,this.code=i}}function Wl(t){t?.throwIfAborted()}function sa(t){return t?.reason??new DOMException("Operation cancelled",
"AbortError")}function mE(t,e,r){return e?.aborted?(Promise.resolve(t).then(r,()=>{}),Promise.reject(sa(e))):new Promise(
(n,s)=>{let i=!1;const o=()=>{i=!0,s(sa(e))};e?.addEventListener("abort",o,{once:!0}),Promise.resolve(t).then(a=>{if(e?.
removeEventListener("abort",o),i){r?.(a);return}n(a)},a=>{e?.removeEventListener("abort",o),s(a)})})}function F$(t,e){if(!t)
return 1e3;const r=Number(t);return Math.max(0,Math.min(36e5,Number.isFinite(r)?r*1e3:Date.parse(t)-e||1e3))}async function Ry(t,e,r){
const n=t.headers.get("content-length");if(n&&Number(n)>e)throw t.body?.cancel().catch(()=>{}),new mr("Hub metadata exce\
eds the response budget");if(!t.body)throw new mr("Hub returned an empty metadata response");const s=t.body.getReader(),
i=[];let o=0;try{for(;;){Wl(r);const{done:l,value:d}=await mE(s.read(),r);if(l)break;if(o+=d.byteLength,o>e)throw new mr(
"Hub metadata exceeds the response budget");i.push(d)}Wl(r)}catch(l){throw s.cancel().catch(()=>{}),l}finally{s.releaseLock()}
const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=l.byteLength;return a}function ia(t){return Bi(t,12e3).
replace(/^---[\s\S]*?---\s*/,"").replace(/<[^>]*>/g," ").replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/\[([^\]]*)\]\([^)]*\)/g,
"$1").replace(/[`#*_]/g,"").replace(/\s+/g," ").trim().slice(0,1600)}function z$(t,e){let r;try{r=Jn(t.id??t.name??t.modelId).
repository}catch{return null}if(t.private||t.isPrivate||t.type&&t.type!=="model")return null;const n=(Array.isArray(t.tags)?
t.tags:typeof t.tags=="string"?t.tags.split(",").map(o=>o.trim()):[]).filter(o=>typeof o=="string").slice(0,80).map(o=>Bi(
o,150)),s=Array.isArray(t.formatted?.fileContent)?t.formatted.fileContent.slice(0,500).map(o=>Bi(o.text,12e3)).join(""):
"",i=Bi(t.pipeline_tag??t.cardData?.pipeline_tag??n.find(o=>["text-generation","image-text-to-text","text-to-image","aut\
omatic-speech-recognition","text-to-speech","feature-extraction"].includes(o)),100);return{repository:r,name:r.split("/")[1],
description:ia(s||t.description||t.cardData?.model_description||""),task:i||null,tags:n,license:Bi(t.cardData?.license??
n.find(o=>o.startsWith("license:"))?.slice(8),100)||null,url:`${tn}/${r}`,gated:!!t.gated,source:e,downloads:Number.isSafeInteger(
t.downloads)?t.downloads:null,likes:Number.isSafeInteger(t.likes)?t.likes:null,revision:/^[a-f0-9]{40}$/i.test(t.sha??"")?
t.sha.toLowerCase():null}}function tf(t,e,r){const n=t.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/);if(!n)return null;
const s=new URL(n[1],e);if(s.origin!==tn||s.pathname!==r||s.username||s.password||s.hash)throw new mr("Hub supplied an i\
nvalid pagination URL");return s.href}function q$({fetchImpl:t=globalThis.fetch,storage:e,timeoutMs:r=15e3,now:n=()=>Date.
now(),sleep:s=(i,o)=>new Promise((a,c)=>{const l=()=>{clearTimeout(d),c(sa(o))},d=setTimeout(()=>{o?.removeEventListener(
"abort",l),a()},i);o?.addEventListener("abort",l,{once:!0}),o?.aborted&&l()})}={}){if(typeof t!="function")throw new Error(
"A fetch implementation is required");if(!Number.isFinite(r)||r<1||r>6e4)throw new Error("Invalid metadata timeout");if(e===
void 0)try{e=globalThis.localStorage}catch{e=null}const i=new Map;let o=0;try{const f=e?.getItem(Zu);if(typeof f=="strin\
g"&&Wc.encode(f).length<=Ty){const h=JSON.parse(f);if(Array.isArray(h))for(const p of h.slice(-40))Array.isArray(p)&&typeof p[0]==
"string"&&Number.isFinite(p[1]?.at)&&p[1].at<=n()&&p[1].at>n()-7*864e5&&typeof p[1].value?.text=="string"&&i.set(p[0],p[1])}}catch{}
function a(f,h){if(Wc.encode(JSON.stringify(h)).length>512*1024)return;i.delete(f),i.set(f,{at:n(),value:h});let p=JSON.
stringify([...i]);for(;i.size>40||Wc.encode(p).length>Ty;)i.delete(i.keys().next().value),p=JSON.stringify([...i]);try{e?.
setItem(Zu,p)}catch{}}async function c(f,{signal:h,maximum:p=O$,headers:m,raw:b=!1,cacheable:g=!0,validateResponse:u}={}){
Wl(h);const y=new URL(f);if(y.origin!==tn||y.username||y.password)throw new Error("Only public Hugging Face metadata is \
allowed");const E=f,k=i.get(E),A=new AbortController,S=()=>A.abort(sa(h));h?.addEventListener("abort",S,{once:!0});const v=setTimeout(
()=>A.abort(new DOMException("Hugging Face metadata request timed out","TimeoutError")),r);try{for(let w=0;w<2;w+=1){if(o>
n())throw new mr("Hugging Face is rate limiting requests. Retry shortly.",{status:429,retryAfterMs:o-n(),code:"ERR_HF_RA\
TE_LIMIT"});const I=await mE(t(f,{signal:A.signal,credentials:"omit",referrerPolicy:"no-referrer",headers:m}),A.signal,P=>{
P.body?.cancel().catch(()=>{})});if(I.status===429||I.status===503){const P=F$(I.headers.get("retry-after"),n());if(I.body?.
cancel().catch(()=>{}),w===0&&P<=2e3){await s(P,A.signal);continue}throw I.status===429&&(o=n()+P),new mr("Hugging Face \
is temporarily unavailable or rate limiting requests. Retry shortly.",{status:I.status,retryAfterMs:P,code:"ERR_HF_RATE_\
LIMIT"})}if(!I.ok)throw I.body?.cancel().catch(()=>{}),new mr(I.status===401||I.status===403?"This model requires Huggin\
g Face access approval or authentication; anonymous import is unavailable.":`Hugging Face metadata request failed (${I.status}\
)`,{status:I.status});if(u)try{u(I)}catch(P){throw I.body?.cancel().catch(()=>{}),P}if(b)return{response:I,bytes:await Ry(
I,p,A.signal)};const T={text:new TextDecoder().decode(await Ry(I,p,A.signal)),link:I.headers.get("link")};return g&&a(E,
T),{...T,cached:!1}}}catch(w){if(h?.aborted)throw sa(h);if(g&&k&&k.at>n()-7*864e5&&(!w.status||w.status===429||w.status>=
500))return{...U$(k.value),cached:!0,warning:"Showing cached metadata; Hugging Face could not be refreshed."};throw A.signal.
aborted?A.signal.reason:w}finally{clearTimeout(v),h?.removeEventListener("abort",S)}}async function l(f,h){const p=await c(
f,h);try{return{...p,data:JSON.parse(p.text)}}catch{throw new mr("Hugging Face returned malformed metadata")}}return{async listDerivedModels(f,{
signal:h}={}){f=Jn(f).repository;const p=new URL("/api/models",tn);p.searchParams.set("filter",`base_model:${f}`),p.searchParams.
set("full","true"),p.searchParams.set("cardData","true"),p.searchParams.set("limit","40");const m=await l(p.href,{signal:h});
if(!Array.isArray(m.data)||m.data.length>40)throw new mr("Invalid related-model metadata");const b=tf({headers:new Headers(
{link:m.link??""})},p.href,"/api/models");return{items:m.data,truncated:!!b,...m.cached?{cached:!0}:{},...m.warning?{warning:m.
warning}:{}}},async search({query:f="",task:h,cursor:p,signal:m}={}){if(typeof f!="string"||f.length>250||/[\u0000-\u001f]/.
test(f))throw new Error("Model search must be at most 250 characters");if(f=f.trim(),h&&!/^[a-z][a-z-]{0,79}$/.test(h))throw new Error(
"Invalid model task filter");let b={query:f,task:h||null,nameCursor:null,namesDone:!1,skip:0,cardsDone:!f};if(p){if(typeof p!=
"string"||p.length>16e3)throw new Error("Invalid search cursor");try{const w=JSON.parse(decodeURIComponent(p));if(w.query!==
f||w.task!==(h||null)||!Number.isSafeInteger(w.skip)||w.skip<0||w.skip>1e4||typeof w.namesDone!="boolean"||typeof w.cardsDone!=
"boolean"||w.nameCursor!==null&&(typeof w.nameCursor!="string"||w.nameCursor.length>12e3))throw new Error;b=w}catch{throw new Error(
"Invalid search cursor")}}const g=new URL("/api/models",tn);g.searchParams.set("search",f),g.searchParams.set("limit",ef),
g.searchParams.set("full","true"),g.searchParams.set("cardData","true"),h&&g.searchParams.set("filter",h),b.nameCursor&&
g.searchParams.set("cursor",b.nameCursor);const u=new URL("/api/search/full-text",tn);u.searchParams.set("q",f),u.searchParams.
set("type","model"),u.searchParams.set("limit",ef),u.searchParams.set("skip",b.skip);const y=await Promise.allSettled([b.
namesDone?Promise.resolve(null):l(g.href,{signal:m}),b.cardsDone?Promise.resolve(null):l(u.href,{signal:m})]);Wl(m);const E=new Map,
k=[];let A=!1,S=0,v;for(let w=0;w<y.length;w+=1){const I=y[w];if(I.status==="rejected"){v=I.reason,k.push(`${w?"Full-car\
d":"Name"} search unavailable: ${Bi(I.reason.message,220)}`),w?b.cardsDone=!0:b.namesDone=!0;continue}const C=I.value;if(!C)
continue;S+=1,A||=C.cached,C.warning&&k.push(C.warning);const T=w?C.data?.hits:C.data;if(!Array.isArray(T)||T.length>100)
throw new mr("Invalid Hub search result");for(const P of T){const L=z$(P,w?"card":"name");if(!L||h&&L.task!==h&&!L.tags.
includes(h))continue;const N=E.get(L.repository);E.set(L.repository,N?{...N,description:L.description||N.description,source:"\
name+card"}:L)}if(w)b.skip+=T.length,b.cardsDone=T.length<ef||b.skip>=(C.data.estimatedTotalHits??1/0)||b.skip>=1e4;else{
const P=tf({headers:new Headers({link:C.link??""})},g.href,"/api/models");b.nameCursor=P?new URL(P).searchParams.get("cu\
rsor"):null,b.namesDone=!b.nameCursor}}if(!S&&v)throw v;return{items:[...E.values()],nextCursor:b.namesDone&&b.cardsDone?
null:encodeURIComponent(JSON.stringify(b)),...k.length?{warning:[...new Set(k)].join(" ")}:{},...A?{cached:!0}:{}}},async getModel(f,{
revision:h,signal:p}={}){f=Jn(f).repository;const m=`${tn}/api/models/${f}${h?`/revision/${$s(h)}`:""}?blobs=true`,b=await l(
m,{signal:p});if(!b.data||typeof b.data!="object"||Array.isArray(b.data))throw new mr("Invalid model metadata");return{...b.
data,...b.cached?{cached:!0,warning:b.warning}:{}}},async listFiles(f,h,{signal:p}={}){f=Jn(f).repository,h=$s(h);const m=`\
/api/models/${f}/tree/${h}`;let b=`${tn}${m}?recursive=true&limit=1000`;const g=[],u=new Set;for(;b;){if(u.has(b)||u.size>=
16)throw new mr("Repository file listing exceeds its page budget");u.add(b);const y=await l(b,{signal:p});if(y.cached&&(g.
cached=!0,g.warning=y.warning),!Array.isArray(y.data)||y.data.length>1e3)throw new mr("Invalid repository file listing");
if(g.push(...y.data.filter(E=>E.type==="file")),g.length>8192)throw new mr("Repository contains too many files to inspec\
t safely");b=tf({headers:new Headers({link:y.link??""})},b,m)}return g},async readText(f,h,p,{signal:m,maxBytes:b=256*1024}={}){
if(!Number.isSafeInteger(b)||b<1||b>512*1024)throw new Error("Invalid metadata file budget");if(!/\.(json|md|txt|jinja)$/i.
test(tc(p))&&!/^(LICENSE|NOTICE)(\.[A-Za-z]+)?$/i.test(p))throw new Error("Only text metadata may be inspected");return(await c(
Na(f,h,p),{signal:m,maximum:b})).text},async readRange(f,h,p,m,b,{signal:g}={}){if(!Number.isSafeInteger(m)||m<0||!Number.
isSafeInteger(b)||b<1||b>1024*1024||!Number.isSafeInteger(m+b))throw new Error("Invalid bounded metadata range");const{response:u,
bytes:y}=await c(Na(f,h,p),{signal:g,maximum:b,raw:!0,cacheable:!1,headers:{Range:`bytes=${m}-${m+b-1}`},validateResponse(k){
const A=k.headers.get("content-range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);if(k.status!==206||!A||Number(A[1])!==m||Number(
A[2])!==m+b-1)throw new mr("The model server did not honor the bounded metadata range")}}),E=u.headers.get("content-rang\
e")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);if(u.status!==206||!E||Number(E[1])!==m||Number(E[2])!==m+b-1||y.length!==b)throw new mr(
"The model server did not honor the bounded metadata range");return y},clearCache(){i.clear();try{e?.removeItem(Zu)}catch{}}}}
const rf=32,j$=["q4","q4f16","q8","fp16","fp32"],G$=new Set(["config.json","tokenizer.json","tokenizer_config.json","add\
ed_tokens.json","special_tokens_map.json","vocab.json","merges.txt","tokenizer.model","sentencepiece.bpe.model","generat\
ion_config.json","preprocessor_config.json","processor_config.json","chat_template.json","chat_template.jinja"]),W$=t=>t===
"fp32"?"":t==="q8"?"_quantized":`_${t}`,Sh=new TextEncoder;function H$(t){const e=tc(t.path??t.rfilename),r=t.size;if(!Number.
isSafeInteger(r)||r<0)throw new Error(`Missing exact file size: ${e}`);if(t.lfs){const s=t.lfs.oid??t.lfs.sha256;if(!/^[a-f0-9]{64}$/i.
test(s??"")||t.lfs.size!==r)throw new Error(`Invalid LFS digest or size: ${e}`);return{path:e,size:r,sha256:s.toLowerCase()}}
const n=t.oid??t.blobId;if(!/^[a-f0-9]{40}$/i.test(n??""))throw new Error(`Missing immutable Git file digest: ${e}`);return{
path:e,size:r,gitBlobSha1:n.toLowerCase()}}function V$(t){const e=t.reduce((r,n)=>r+n.size,0);if(!Number.isSafeInteger(e))
throw new Error("Selected package size exceeds integer bounds");return e}function K$(t){return G$.has(t)||/^(README(?:\.[A-Za-z]+)?|LICENSE(?:\.[A-Za-z0-9_-]+)?|NOTICE(?:\.[A-Za-z0-9_-]+)?)$/i.
test(t)}function My(t){return t.map(e=>`${e.path}:${e.sha256??e.gitBlobSha1}:${e.size}`).sort().join("|")}function Qo(t,e,r){
return`hf-${Da(em(Sh.encode(`${t}@${e}:${r}`))).slice(0,24)}`}function Ah(t,{reason:e=null,dtype:r=t.model?.dtype,key:n=t.
id}={}){const s=t.capabilities?.browserInference===!1;return{key:n,id:t.id,name:t.name,repository:t.repository,revision:t.
revision,dtype:r,task:t.model?.task??"text-generation",totalBytes:t.totalBytes,model:t.model,files:t.files,license:t.license,
format:t.provenance?.format??t.format,loadable:!e&&!s,reason:e??(s?t.capabilities.executionReason??"No browser runtime i\
s available for this package":null),package:t,status:t.status??"candidate"}}function Q$(t,e,r){return{spdx:typeof t.cardData?.
license=="string"?t.cardData.license.slice(0,100):(t.tags??[]).find(s=>typeof s=="string"&&s.startsWith("license:"))?.slice(
8,108)??"Unknown",sourceUrl:`${new URL(Na(e,r,"README.md")).origin}/${e}/blob/${r}/README.md`,notice:"Publisher-reported\
 license. Review the model card and license files; preserve applicable notices.",reviewRequired:!0}}function Ih(t,e,r,n,s,i,o){
return{id:Qo(t,e,o),name:`${t.split("/")[1]} (${o})`,description:r,repository:t,revision:e,status:"candidate",license:n,
files:s,totalBytes:V$(s),weightBytes:s.filter(a=>/\.onnx(?:_data(?:_\d+)?)?$|\.gguf$/i.test(a.path)).reduce((a,c)=>a+c.size,
0),model:i,provenance:{repository:t,revision:e,format:i.runtime==="llama.cpp"?"GGUF":"ONNX",modelCardUrl:`${_h}/${t}/blo\
b/${e}/README.md`,source:"huggingface-discovery"}}}const _h="https://huggingface.co";function J$({repository:t,revision:e,
description:r="",license:n,files:s,config:i,gated:o=!1}){const a=new Map(s.map(g=>[g.path,g])),c=i?.model_type,l=Za("tra\
nsformers.js",c),d=l?.task==="image-text-to-text",f=l?.modules??["model"];let h,p;if(l)try{h=eE(i)}catch(g){p=g.message}
const m=s.filter(g=>K$(g.path)),b=[];for(const g of j$){const u=f.map(w=>`onnx/${w}${W$(g)}.onnx`);if(!u.some(w=>a.has(w)))
continue;let y=null;l||(y=`Architecture ${c||"unknown"} has no admitted browser adapter`),i?.auto_map&&Object.keys(i.auto_map).
length&&(y="This configuration declares custom model code; no custom code is executed"),o&&(y="This repository requires \
Hugging Face access approval; anonymous import is unavailable"),l&&!l.dtypes.includes(g)&&(y=c==="qwen3_5"?"The Qwen3.5 \
browser adapter currently admits only all-q4 modules":`Precision ${g} has no admitted browser adapter for ${c}`),p&&(y??=
`Model memory profile unavailable: ${p}`);const E=[];try{for(const w of f)E.push(...i$(i??{},c,w,g))}catch(w){y??=w.message}
const k=[...u,...E,"config.json","tokenizer.json","tokenizer_config.json"].filter(w=>!a.has(w));d&&!a.has("preprocessor_\
config.json")&&!a.has("processor_config.json")&&k.push("preprocessor_config.json or processor_config.json"),k.length&&(y??=
`Incomplete package: missing ${k.join(", ")}`);for(const w of u)s.some(I=>I.path.startsWith(`${w}_data`)&&!E.includes(I.
path))&&(y??="External ONNX data is present but not fully declared for this variant in the runtime configuration");const A=[
...new Set([...m.map(w=>w.path),...u,...E])].filter(w=>a.has(w)).sort().map(w=>a.get(w)),S={runtime:"transformers.js",runtimeVersion:Ld,
architecture:c,task:d?"image-text-to-text":"text-generation",dtype:d?Object.fromEntries(f.map(w=>[w,g])):g,modalities:l?.
modalities??["text"],requiredFeatures:Z1(g,i??{}),repository:t,revision:e,...h?{memoryProfile:h}:{}},v=Ih(t,e,r,n,A,S,g);
try{ec(S,{files:A,totalBytes:v.totalBytes,config:i})}catch(w){y??=w.message}A.length>1024&&(y??="Selected package has to\
o many files for the browser adapter"),b.push(Ah(v,{reason:y,dtype:g}))}return b}async function By(t,e,r,n,s,i=256*1024){
if(n.size>i)throw new Error(`Metadata file is too large to inspect: ${n.path}`);const o=await t.readText(e,r,n.path,{signal:s,
maxBytes:i}),a=Sh.encode(o);if(a.length!==n.size)throw new Error(`Metadata size changed: ${n.path}`);if(n.gitBlobSha1){const l=sm.
create().update(Sh.encode(`blob ${n.size}\0`)).update(a).digest();if(Da(l)!==n.gitBlobSha1)throw new Error(`Metadata Git\
 digest changed: ${n.path}`)}const c=Da(em(a));if(n.sha256&&c!==n.sha256)throw new Error(`Metadata SHA-256 changed: ${n.
path}`);return n.sha256=c,o}async function Y$(t,{client:e,catalog:r={},signal:n,selectedVariant:s}={}){if(!e?.getModel||
!e?.listFiles||!e?.readText)throw new Error("A Hugging Face metadata client is required");n?.throwIfAborted();const i=Jn(
t),o=i.repository,a=await e.getModel(o,{revision:i.revision,signal:n}),c=$s(a.sha);if(i.revision&&c!==i.revision)throw new Error(
"Hugging Face returned a different model revision");const l=Q$(a,o,c),d=[];a.warning&&d.push(a.warning);let f;try{f=await e.
listFiles(o,c,{signal:n})}catch(w){if(n?.throwIfAborted(),![401,403].includes(w.status)&&!a.gated&&!a.private&&!a.disabled)
throw w;return{repository:o,revision:c,description:ia(a.description??""),license:l,url:`${_h}/${o}/tree/${c}`,gated:!0,variants:[
{key:Qo(o,c,"access-required"),id:Qo(o,c,"access-required"),name:o.split("/")[1],task:a.pipeline_tag??null,totalBytes:null,
dtype:null,loadable:!1,reason:"This model requires access approval or authentication on Hugging Face; anonymous import i\
s unavailable",package:null}]}}f.warning&&d.push(f.warning);const h=f.map(H$),p=new Set;for(const w of h){if(p.has(w.path))
throw new Error("Duplicate repository file path");p.add(w.path)}let m=ia(a.description??a.cardData?.model_description??""),
b=null,g;const u=h.find(w=>w.path==="README.md");if(u&&u.size<=128*1024)try{m=ia(await By(e,o,c,u,n,128*1024))||m}catch(w){
n?.throwIfAborted(),d.push(`Model card unavailable: ${w.message}`)}const y=h.find(w=>w.path==="config.json");if(y)try{if(b=
JSON.parse(await By(e,o,c,y,n)),!b||typeof b!="object"||Array.isArray(b))throw new Error("Invalid model configuration")}catch(w){
n?.throwIfAborted(),g=w.message}const E=Object.values(r).filter(w=>w.repository===o&&w.revision===c),k=!!(a.gated||a.private||
a.disabled),A=E.map(w=>Ah(w,{reason:k?"This repository requires Hugging Face access approval; anonymous import is unavai\
lable":null})),S=new Set(E.map(w=>My(w.files)));if(h.some(w=>w.path.endsWith(".onnx"))){const w=J$({repository:o,revision:c,
description:m,license:l,files:h,config:b,gated:!!(a.gated||a.private||a.disabled)});for(const I of w)E.find(T=>T.model.runtime===
"transformers.js"&&JSON.stringify(T.model.dtype)===JSON.stringify(I.model.dtype)&&T.files.every(P=>I.files.some(L=>L.path===
P.path&&L.size===P.size&&(P.sha256?P.sha256===L.sha256:P.gitBlobSha1===L.gitBlobSha1)))&&T.files.length===I.files.length)||
S.has(My(I.files))||(g&&(I.loadable=!1,I.reason=`Model configuration unavailable: ${g}`),A.push(I))}const v=h.filter(w=>/\.gguf$/i.
test(w.path));if(v.length){const{inspectGgufHeader:w,resolveGgufHubProfile:I,GGUF_HUB_LIMITS:C}=await qt(async()=>{const{
inspectGgufHeader:T,resolveGgufHubProfile:P,GGUF_HUB_LIMITS:L}=await Promise.resolve().then(()=>m$);return{inspectGgufHeader:T,
resolveGgufHubProfile:P,GGUF_HUB_LIMITS:L}},void 0,import.meta.url);for(const T of v.slice(0,rf)){if(n?.throwIfAborted(),
E.some(X=>X.files.some(j=>j.path===T.path&&j.sha256===T.sha256)))continue;const P=[T,...h.filter(X=>/^(README|LICENSE|NOTICE)(\.[A-Za-z0-9_-]+)?$/i.
test(X.path))].sort((X,j)=>X.path.localeCompare(j.path));let L=Ih(o,c,m,l,P,{runtime:"llama.cpp",task:"text-generation",
format:"GGUF",dtype:"unknown",modalities:["text"],repository:o,revision:c},T.path),N,H=!1;try{if(a.gated||a.private||a.disabled)
throw new Error("This repository requires Hugging Face access approval; anonymous import is unavailable");if(/mmproj|vision|projector/i.
test(T.path))throw new Error("A vision projector is not a standalone text model");if(!T.sha256)throw new Error("GGUF req\
uires an upstream whole-file SHA-256 digest");if(L.totalBytes>C.maximumBytes)throw new Error("Selected package exceeds t\
he browser GGUF adapter’s 16 GiB file budget");if(/-\d{5}-of-\d{5}\.gguf$/i.test(T.path))throw new Error("Split GGUF p\
ackages require complete shard admission and are not supported by this adapter");if(![L.id,T.path].includes(s??i.path))H=
!0,N="Select this variant to inspect its bounded GGUF header";else{const X=await w({size:T.size,signal:n,readRange:(ae,fe,Te)=>e.
readRange(o,c,T.path,ae,fe,Te)}),j=I({repository:o,revision:c,file:T,header:X});L=Ih(o,c,m,l,P,j.model,T.path)}}catch(X){
n?.throwIfAborted(),N=X.message}const te=Ah(L,{reason:N});te.filePath=T.path,H&&(te.requiresInspection=!0,te.dtype=T.path.
match(/(?:^|[._-])(Q\d(?:_[A-Z0-9]+)*|IQ\d(?:_[A-Z0-9]+)*|F16|F32|BF16)(?=\.|$)/i)?.[1]?.toLowerCase()??"unknown",te.precisionSource=
"filename"),A.push(te)}v.length>rf&&d.push(`Showing the first ${rf} GGUF files; this repository contains ${v.length}.`)}
return A.length||A.push({key:Qo(o,c,"unsupported"),id:Qo(o,c,"unsupported"),name:o.split("/")[1],dtype:null,task:a.pipeline_tag??
null,totalBytes:null,model:null,files:[],loadable:!1,reason:a.gated?"This model requires access approval on Hugging Face":
"No complete package for an admitted ONNX, standard GGUF, or catalog diffusion adapter was found",package:null}),{repository:o,
revision:c,description:m,license:l,url:`${_h}/${o}/tree/${c}`,variants:A,gated:k,...d.length?{warning:d.join(" ")}:{},...a.
cached||f.cached?{cached:!0}:{}}}const nf=12,X$=3,Z$="These are publisher-declared base-model relationships, not proof o\
f identical weights or conversion from the selected source revision. Inspect a candidate before importing.",Mr=t=>t.toLowerCase();
function Jo(t){try{return Jn(t).repository}catch{return null}}function Ly(t){const e=t?.cardData?.base_model;return(Array.
isArray(e)?e:[e]).slice(0,32).map(Jo).filter(Boolean)}function Ac(t){const e=new Set;for(const r of(Array.isArray(t?.siblings)?
t.siblings:[]).slice(0,8192)){let n;try{n=tc(r.rfilename??r.path)}catch{continue}/\.onnx$/i.test(n)&&e.add("ONNX"),/\.gguf$/i.
test(n)&&!/mmproj|projector/i.test(n)&&e.add("GGUF")}return[...e].sort()}function e7(t,e){const r=t.cardData?.base_model_relation;
if(["quantized","converted","finetune","merge","adapter"].includes(r))return r;const n=Array.isArray(t.tags)?t.tags:[];for(const s of[
"merge","adapter","finetune","quantized"])if(n.some(i=>typeof i=="string"&&Mr(i)===`base_model:${s}:${Mr(e)}`))return s;
return"derived"}async function t7(t,{client:e,signal:r}={}){if(!e?.getModel||!e?.listDerivedModels)throw new Error("A Hu\
gging Face lineage metadata client is required");r?.throwIfAborted();const n=Jn(t),s=await e.getModel(n.repository,{revision:n.
revision,signal:r});r?.throwIfAborted();const i=Jo(s.id??s.modelId)??n.repository;if(Mr(i)!==Mr(n.repository))throw new Error(
"Hugging Face returned a different source repository");const o=$s(s.sha);if(n.revision&&o!==n.revision)throw new Error("\
Hugging Face returned a different source revision");const a=await e.listDerivedModels(i,{signal:r});if(r?.throwIfAborted(),
!Array.isArray(a.items)||a.items.length>40)throw new Error("Related-model listing exceeds its metadata budget");const c=[
s.warning,a.warning].filter(Boolean);let l=!!(s.cached||a.cached);const d=new Set,f=a.items.filter(g=>{const u=Jo(g?.id??
g?.modelId);return!u||d.has(Mr(u))||Mr(u)===Mr(i)||g.private||g.disabled||!Ac(g).length||!Ly(g).some(y=>Mr(y)===Mr(i))?!1:
(d.add(Mr(u)),!0)}).sort((g,u)=>Number(Ac(u).includes("ONNX"))-Number(Ac(g).includes("ONNX")));(a.truncated||f.length>nf)&&
c.push(`Discovery is bounded to 40 related repositories and ${nf} pinned candidate inspections; more exports may exist.`);
const h=f.slice(0,nf),p=new Array(h.length);let m=0,b=0;return await Promise.all(Array.from({length:Math.min(X$,h.length)},
async()=>{for(;m<h.length;){r?.throwIfAborted();const g=m++,u=h[g],y=Jo(u.id??u.modelId);try{const E=$s(u.sha),k=await e.
getModel(y,{revision:E,signal:r});if(r?.throwIfAborted(),$s(k.sha)!==E||Mr(Jo(k.id??k.modelId)??y)!==Mr(y))throw new Error(
"Candidate identity changed during pinned inspection");const A=Ly(k),S=Ac(k);if(!A.some(w=>Mr(w)===Mr(i))||!S.length||k.
private||k.disabled)throw new Error("Candidate has no matching pinned source lineage and export files");l||=!!k.cached,k.
warning&&c.push(k.warning);const v=e7(k,i);p[g]={repository:y,revision:E,name:y.split("/")[1],task:typeof k.pipeline_tag==
"string"?k.pipeline_tag.slice(0,100):null,formats:S,sourceRepository:i,sourceRevision:o,relationship:v,evidence:{kind:"p\
ublisher-base-model",revision:E,url:`${tn}/${y}/blob/${E}/README.md`,sourceRevisionVerified:!1},description:ia(k.description??
k.cardData?.model_description??""),license:typeof k.cardData?.license=="string"?k.cardData.license.slice(0,100):null,url:`${tn}\
/${y}/tree/${E}`,status:"candidate",requiresInspection:!0,gated:!!k.gated}}catch(E){r?.throwIfAborted(),b+=1,b<=3&&c.push(
`${y}: ${String(E.message).slice(0,180)}`)}}})),r?.throwIfAborted(),b>3&&c.push(`${b-3} further candidate metadata reque\
sts failed.`),{sourceRepository:i,sourceRevision:o,items:p.filter(Boolean),lineageNotice:Z$,...c.length?{warning:[...new Set(
c)].join(" ")}:{},...l?{cached:!0}:{}}}function r7(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<
t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function im(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8\
Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,
t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function o9(t){return new TextEncoder().
encode(t)}function a9(t){return new TextDecoder().decode(t)}function n7(t,e){if(t.length>=255)throw new TypeError("Alpha\
bet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var s=0;s<t.length;s++){var i=t.charAt(s),o=i.
charCodeAt(0);if(r[o]!==255)throw new TypeError(i+" is ambiguous");r[o]=s}var a=t.length,c=t.charAt(0),l=Math.log(a)/Math.
log(256),d=Math.log(256)/Math.log(a);function f(m){if(m instanceof Uint8Array||(ArrayBuffer.isView(m)?m=new Uint8Array(m.
buffer,m.byteOffset,m.byteLength):Array.isArray(m)&&(m=Uint8Array.from(m))),!(m instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(m.length===0)return"";for(var b=0,g=0,u=0,y=m.length;u!==y&&m[u]===0;)u++,b++;for(var E=(y-u)*
d+1>>>0,k=new Uint8Array(E);u!==y;){for(var A=m[u],S=0,v=E-1;(A!==0||S<g)&&v!==-1;v--,S++)A+=256*k[v]>>>0,k[v]=A%a>>>0,A=
A/a>>>0;if(A!==0)throw new Error("Non-zero carry");g=S,u++}for(var w=E-g;w!==E&&k[w]===0;)w++;for(var I=c.repeat(b);w<E;++w)
I+=t.charAt(k[w]);return I}function h(m){if(typeof m!="string")throw new TypeError("Expected String");if(m.length===0)return new Uint8Array;
var b=0;if(m[b]!==" "){for(var g=0,u=0;m[b]===c;)g++,b++;for(var y=(m.length-b)*l+1>>>0,E=new Uint8Array(y);m[b];){var k=r[m.
charCodeAt(b)];if(k===255)return;for(var A=0,S=y-1;(k!==0||A<u)&&S!==-1;S--,A++)k+=a*E[S]>>>0,E[S]=k%256>>>0,k=k/256>>>0;
if(k!==0)throw new Error("Non-zero carry");u=A,b++}if(m[b]!==" "){for(var v=y-u;v!==y&&E[v]===0;)v++;for(var w=new Uint8Array(
g+(y-v)),I=g;v!==y;)w[I++]=E[v++];return w}}}function p(m){var b=h(m);if(b)return b;throw new Error(`Non-${e} character`)}
return{encode:f,decodeUnsafe:h,decode:p}}var s7=n7,i7=s7;class o7{name;prefix;baseEncode;constructor(e,r,n){this.name=e,
this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}}class a7{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){this.name=e,this.
prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return gE(this,e)}}class c7{decoders;constructor(e){
this.decoders=e}or(e){return gE(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function gE(t,e){return new c7({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class l7{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){
this.name=e,this.prefix=r,this.baseEncode=n,this.baseDecode=s,this.encoder=new o7(e,r,n),this.decoder=new a7(e,r,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function bE({name:t,prefix:e,encode:r,decode:n}){
return new l7(t,e,r,n)}function $d({name:t,prefix:e,alphabet:r}){const{encode:n,decode:s}=i7(r,t);return bE({prefix:e,name:t,
encode:n,decode:i=>im(s(i))})}function d7(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*r/8|0);
let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|d,
o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}function u7(t,e,r){
const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=8;o>r;)o-=r,i+=e[s&
a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function f7(t){const e={};for(let r=0;r<t.length;++r)
e[t[r]]=r;return e}function cs({name:t,prefix:e,bitsPerChar:r,alphabet:n}){const s=f7(n);return bE({prefix:e,name:t,encode(i){
return u7(i,n,r)},decode(i){return d7(i,s,r,t)}})}const oa=cs({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuv\
wxyz234567",bitsPerChar:5}),h7=cs({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),
p7=cs({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),m7=cs({prefix:"C",name:"\
base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),g7=cs({prefix:"v",name:"base32hex",alphabet:"\
0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),b7=cs({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJ\
KLMNOPQRSTUV",bitsPerChar:5}),y7=cs({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),
w7=cs({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),v7=cs({prefix:"h",
name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),c9=Object.freeze(Object.defineProperty({__proto__:null,
base32:oa,base32hex:g7,base32hexpad:y7,base32hexpadupper:w7,base32hexupper:b7,base32pad:p7,base32padupper:m7,base32upper:h7,
base32z:v7},Symbol.toStringTag,{value:"Module"})),Hc=$d({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz"}),E7=$d({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),l9=Object.freeze(Object.
defineProperty({__proto__:null,base36:Hc,base36upper:E7},Symbol.toStringTag,{value:"Module"})),Vn=$d({name:"base58btc",prefix:"\
z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),k7=$d({name:"base58flickr",prefix:"Z",alphabet:"\
123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),d9=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Vn,
base58flickr:k7},Symbol.toStringTag,{value:"Module"}));var x7=yE,Dy=128,S7=-128,A7=Math.pow(2,31);function yE(t,e,r){e=e||
[],r=r||0;for(var n=r;t>=A7;)e[r++]=t&255|Dy,t/=128;for(;t&S7;)e[r++]=t&255|Dy,t>>>=7;return e[r]=t|0,yE.bytes=r-n+1,e}var I7=Ch,
_7=128,$y=127;function Ch(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Ch.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&$y)<<s:(o&$y)*Math.pow(2,s),s+=7}while(o>=_7);return Ch.bytes=i-n,r}var C7=Math.pow(
2,7),T7=Math.pow(2,14),R7=Math.pow(2,21),M7=Math.pow(2,28),B7=Math.pow(2,35),L7=Math.pow(2,42),D7=Math.pow(2,49),$7=Math.
pow(2,56),N7=Math.pow(2,63),P7=function(t){return t<C7?1:t<T7?2:t<R7?3:t<M7?4:t<B7?5:t<L7?6:t<D7?7:t<$7?8:t<N7?9:10},O7={
encode:x7,decode:I7,encodingLength:P7},Hl=O7;function Th(t,e=0){return[Hl.decode(t,e),Hl.decode.bytes]}function Vl(t,e,r=0){
return Hl.encode(t,e,r),e}function Kl(t){return Hl.encodingLength(t)}function wE(t,e){const r=e.byteLength,n=Kl(t),s=n+Kl(
r),i=new Uint8Array(s+r);return Vl(t,i,0),Vl(r,i,n),i.set(e,s),new om(t,r,e,i)}function U7(t){const e=im(t),[r,n]=Th(e),
[s,i]=Th(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new om(r,s,o,e)}
function F7(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&r7(
t.bytes,r.bytes)}}class om{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=n,this.bytes=
s}}function Ny(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return q7(r,Rh(t),e??Vn.encoder);default:return j7(r,Rh(
t),e??oa.encoder)}}const Py=new WeakMap;function Rh(t){const e=Py.get(t);if(e==null){const r=new Map;return Py.set(t,r),
r}return e}class Kt{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.multihash=n,this.
bytes=s,this["/"]=s}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.
byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==$o)throw new Error(
"Cannot convert a non dag-pb CID to CIDv0");if(r.code!==G7)throw new Error("Cannot convert non sha2-256 multihash CID to\
 CIDv0");return Kt.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a \
bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=wE(e,r);return Kt.createV1(
this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a\
 bug please report`)}}equals(e){return Kt.equals(this,e)}static equals(e,r){const n=r;return n!=null&&e.code===n.code&&e.
version===n.version&&F7(e.multihash,n.multihash)}toString(e){return Ny(this,e)}toJSON(){return{"/":Ny(this)}}link(){return this}[Symbol.
toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()})`}static asCID(e){if(e==null)
return null;const r=e;if(r instanceof Kt)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===r){const{version:n,code:s,
multihash:i,bytes:o}=r;return new Kt(n,s,i,o??Oy(n,s,i.bytes))}else if(r[W7]===!0){const{version:n,multihash:s,code:i}=r,
o=U7(s);return Kt.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error("String code\
cs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(r!==
$o)throw new Error(`Version 0 CID must use dag-pb (code: ${$o}) block encoding`);return new Kt(e,r,n,n.bytes)}case 1:{const s=Oy(
e,r,n.bytes);return new Kt(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Kt.create(0,$o,
e)}static createV1(e,r){return Kt.create(1,e,r)}static decode(e){const[r,n]=Kt.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=Kt.inspectBytes(e),n=r.size-r.multihashSize,s=im(e.subarray(n,
n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(r.multihashSize-
r.digestSize),o=new om(r.multihashCode,r.digestSize,i,s);return[r.version===0?Kt.createV0(o):Kt.createV1(r.codec,o),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[f,h]=Th(e.subarray(r));return r+=h,f};let s=n(),i=$o;if(s===18?
(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,d=l-o;return{version:s,
codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=z7(e,r),i=Kt.decode(s);if(i.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Rh(i).set(n,e),i}}function z7(t,e){
switch(t[0]){case"Q":{const r=e??Vn;return[Vn.prefix,r.decode(`${Vn.prefix}${t}`)]}case Vn.prefix:{const r=e??Vn;return[
Vn.prefix,r.decode(t)]}case oa.prefix:{const r=e??oa;return[oa.prefix,r.decode(t)]}case Hc.prefix:{const r=e??Hc;return[
Hc.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function q7(t,e,r){const{prefix:n}=r;if(n!==Vn.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).slice(1);return e.set(n,
i),i}else return s}function j7(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(t);return e.set(n,i),i}else
return s}const $o=112,G7=18;function Oy(t,e,r){const n=Kl(t),s=n+Kl(e),i=new Uint8Array(s+r.byteLength);return Vl(t,i,0),
Vl(e,i,n),i.set(r,s),i}const W7=Symbol.for("@ipld/js-cid/CID"),vE="3.8.1",Mh=2048,Vs=1024**3;function am(t){const e=as(t),
r=e.model,n=Object.values(Xi).filter(l=>l.model.runtime==="llama.cpp"&&l.repository===r?.repository&&l.revision===r?.revision&&
l.model.architecture===r?.architecture&&l.model.task===r?.task&&l.model.dtype===r?.dtype),s=n.length===1?n[0]:void 0;if(!s&&
r?.gguf){const l=Dd(r,{files:e.files});for(const d of Object.values(Xi))if(!(d.repository!==r.repository||d.revision!==r.
revision))for(const f of d.files.filter(h=>h.path.endsWith(".gguf"))){const h=l.weights.find(p=>p.path===f.path);if(h&&(h.
size!==f.size||h.sha256!==f.sha256))throw new Error("GGUF weights do not match the pinned catalog digests")}return{...l,
manifest:e}}if(!s||r.runtime!=="llama.cpp"||r.runtimeVersion!==void 0&&r.runtimeVersion!==vE||s.model.runtimeVersion!==void 0&&
r.runtimeVersion!==s.model.runtimeVersion||r.dtype!==s.model.dtype||r.format!=="GGUF"||r.task!=="text-generation")throw new Error(
"GGUF model revision is not in the trusted runtime catalog");const i=e.files.filter(l=>l.path.endsWith(".gguf")),o=s.files.
filter(l=>l.path.endsWith(".gguf"));if(!i.length||i.length!==o.length||i.some(l=>!o.some(d=>d.path===l.path&&d.size===l.
size&&d.sha256===l.sha256)))throw new Error("GGUF weights do not match the pinned catalog digests");const a=e.files.reduce(
(l,d)=>l+d.size,0);if(!Number.isSafeInteger(a)||a>16*Vs)throw new Error("GGUF package exceeds its byte budget");const c=i.
reduce((l,d)=>l+d.size,0)>4*Vs;return{manifest:e,weights:i,totalBytes:a,resourcePolicy:{maxModelBytes:16*Vs,minimumCpuBytes:c?
8*Vs:2*Vs,minimumGpuBytes:c?16*Vs:2*Vs}}}function EE(t,e=globalThis.location?.href){const r=new URL(e);if(!t||Object.keys(
t).some(s=>s!=="wasm")||typeof t.wasm!="string")throw new Error("GGUF runtime needs one trusted WASM asset");const n=new URL(
t.wasm,r);if(n.origin!==r.origin||!["http:","https:"].includes(n.protocol)||n.username||n.password||n.search||n.hash||!n.
pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fixed same-origin asset");return{wasm:n.href}}function kE(t={}){
if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).some(r=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(
r)))throw new Error("Unknown GGUF runtime option");const e={n_ctx:Mh,n_batch:64,n_gpu_layers:99999,n_threads:1,...t};if(!Number.
isInteger(e.n_ctx)||e.n_ctx<64||e.n_ctx>Mh||!Number.isInteger(e.n_batch)||e.n_batch<1||e.n_batch>128||!Number.isInteger(
e.n_gpu_layers)||e.n_gpu_layers<1||e.n_gpu_layers>99999||e.n_threads!==1)throw new Error("GGUF options exceed the manage\
d GPU runtime bounds");return Object.freeze(e)}async function H7({scope:t=globalThis,gpu:e=t.navigator?.gpu}={}){if(!t.crossOriginIsolated||
!t.SharedArrayBuffer)throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const r=t.WebAssembly;
if(typeof r?.Suspending!="function"||typeof r?.promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{
new r.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly me\
mory64")}const n=await e?.requestAdapter({powerPreference:"high-performance"});if(!n||n.isFallbackAdapter||n.info?.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!n.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:n.info?.vendor??"",architecture:n.info?.architecture??
"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const V7=Object.freeze({id:"\
llama.cpp",moduleUrl:"peercompute:gguf-inference",validateManifest:am,validateRuntimeAssets:EE,validateRuntimeOptions:kE,
retainArtifactBridge:!0,terminateOnUnload:!0,validateGenerationInput({image:t,maxNewTokens:e}){if(t)throw new Error("Thi\
s GGUF adapter currently accepts text only");if(!Number.isInteger(e)||e<1||e>Ae.maxNewTokens)throw new Error("GGUF outpu\
t exceeds its token budget")}}),xE=Object.freeze(Object.defineProperty({__proto__:null,GGUF_CONTEXT_LIMIT:Mh,GGUF_RUNTIME_VERSION:vE,
ggufRuntimeDefinition:V7,validateGgufCapabilities:H7,validateGgufManifest:am,validateGgufRuntimeAssets:EE,validateGgufRuntimeOptions:kE},
Symbol.toStringTag,{value:"Module"})),K7="peercompute.model-artifact-read.v1",cm=K7;function SE(t,e){const r=n=>e(n.data);
return t.addEventListener("message",r),t.start?.(),()=>t.removeEventListener("message",r)}function jr(t,e,r=[]){t.postMessage(
{protocol:cm,...e},r)}function u9(t,{store:e,manifest:r,chunkBytes:n=Ae.chunkBytes,maxReads:s=Ae.maxReads}={}){if(!e?.stat||
!e?.openRead)throw new Error("A verified artifact store is required");if(!Number.isInteger(n)||n<1||n>Ae.chunkBytes||!Number.
isInteger(s)||s<1||s>Ae.maxReads)throw new Error("Invalid artifact bridge bounds");const i=new Map(r.files.map(h=>[$a(h.
path),h])),o=new Map;let a=!1,c=0;async function l(h,p){const m=o.get(h);if(m){o.delete(h),m.controller.abort(p);try{await m.
iterator?.return?.()}catch{}}}async function d(h){if(a||h?.protocol!==cm||typeof h.id!="string"||h.id.length>128)return;
const{id:p}=h;try{if(h.type==="cancel"){await l(p,"Reader cancelled");return}if(h.type==="open"){if(o.has(p))throw new Error(
"Duplicate artifact reader");if(o.size>=s)throw new Error("Artifact reader limit reached");const y=i.get(h.path);if(!y)throw new Error(
"Artifact path is not in the manifest");const E=h.offset??0,k=h.length??y.size-E;if(!Number.isSafeInteger(E)||!Number.isSafeInteger(
k)||E<0||k<0||E>y.size||k>y.size-E)throw new Error("Invalid artifact byte range");const A={controller:new AbortController,
remaining:k,pulling:!1};o.set(p,A);const S=await e.stat(y.cid);if(zt(A.controller.signal),a||o.get(p)!==A)return;if(!S||
S.status!=="complete"||S.size!==y.size||S.sha256!==y.sha256)throw new Error("Model artifact is incomplete or has a diffe\
rent size");const v=await e.openRead(y.cid,{offset:E,length:k,signal:A.controller.signal});if(A.iterator=v[Symbol.asyncIterator](),
a||A.controller.signal.aborted||o.get(p)!==A){await A.iterator.return?.();return}jr(t,{type:"ready",id:p,size:k});return}
if(h.type!=="pull")return;const m=o.get(p);if(!m?.iterator||m.pulling)throw new Error("Invalid artifact pull credit");m.
pulling=!0;const b=await m.iterator.next();if(a||m.controller.signal.aborted||o.get(p)!==m)return;if(b.done){if(m.remaining!==
0)throw new Error("Truncated model artifact");o.delete(p),jr(t,{type:"end",id:p});return}const g=b.value;if(!(g instanceof
Uint8Array)||!g.byteLength||g.byteLength>n||g.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bo\
unds");m.remaining-=g.byteLength,m.pulling=!1,c+=g.byteLength;const u=g.slice();jr(t,{type:"chunk",id:p,bytes:u},[u.buffer])}catch(m){
await l(p,m),a||jr(t,{type:"error",id:p,message:m?.message||"Artifact read failed"})}}const f=SE(t,h=>{d(h)});return{getStats:()=>({
activeReads:o.size,deliveredBytes:c}),async close(){if(!a){a=!0;try{jr(t,{type:"closed",message:"Artifact bridge closed"})}catch{}
f(),await Promise.all([...o.keys()].map(h=>l(h,"Artifact bridge closed"))),t.close()}}}}function Q7(t,{manifest:e,baseUrl:r,
signal:n,chunkBytes:s=Ae.chunkBytes,maxReads:i=Ae.maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>Ae.maxReads||
!Number.isInteger(o)||o<0||o>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),c=new Map(e.files.
map(u=>[$a(u.path),u])),l=new Map,d=[];let f=0,h=!1;function p(){for(;!h&&l.size<i&&d.length;){const u=d.shift();l.set(u.
id,u),u.active=!0,jr(t,{type:"open",id:u.id,path:u.path})}}function m(u,y){l.delete(u.id);const E=d.indexOf(u);if(E>=0&&
d.splice(E,1),n?.removeEventListener("abort",u.abort),u.requestSignal?.removeEventListener("abort",u.abort),y){u.reject?.(
y);try{u.streamController?.error(y)}catch{}}u.resolvePull?.(),p()}const b=SE(t,u=>{if(u?.protocol!==cm)return;const y=l.
get(u.id);if(y){if(u.type==="error"){m(y,new Error(u.message));return}if(u.type==="ready"){if(y.ready||u.size!==y.file.size){
m(y,new Error("Invalid artifact response size")),jr(t,{type:"cancel",id:y.id});return}y.ready=!0,jr(t,{type:"pull",id:y.
id})}else if(u.type==="chunk"){if(!y.ready||!y.resolvePull||!(u.bytes instanceof Uint8Array)||!u.bytes.byteLength||u.bytes.
byteLength>s||y.received+u.bytes.byteLength>y.file.size){jr(t,{type:"cancel",id:y.id}),m(y,new Error("Invalid artifact c\
hunk"));return}y.received+=u.bytes.byteLength,y.streamController.enqueue(u.bytes);const E=y.resolvePull;y.resolvePull=null,
E()}else u.type==="end"&&(!y.ready||y.received!==y.file.size?m(y,new Error("Truncated artifact response")):(y.streamController.
close(),m(y)))}});async function g(u,y={}){if(h)throw new Error("Artifact bridge is closed");if(zt(n),zt(y.signal),y.method&&
y.method!=="GET")throw new Error("Model adapter supports GET only");const E=String(u);if(/[\\]/.test(E)||/%(?:2e|2f|5c|00)/i.
test(E)||/\/(?:\.|\.\.)(?:\/|$)/.test(E))throw new Error("Invalid artifact URL");const k=new URL(E,a);if(k.origin!==a.origin||
k.username||k.password||k.search||k.hash||!k.pathname.startsWith(a.pathname))throw new Error("Model path is outside its \
manifest");const A=$a(decodeURIComponent(k.pathname.slice(a.pathname.length))),S=c.get(A);if(!S)return new Response("Art\
ifact path is not in the manifest",{status:404});const v=`read-${++f}`,w={id:v,path:A,file:S,requestSignal:y.signal,received:0,
ready:!1,active:!1,queued:!1};w.abort=()=>{w.active&&jr(t,{type:"cancel",id:v}),m(w,wh(n?.reason??y.signal?.reason))};const I=new ReadableStream(
{start(C){w.streamController=C},pull(){if(h)throw new Error("Artifact bridge is closed");if(zt(n),zt(y.signal),!w.active&&
!w.queued&&l.size>=i&&d.length>=o)throw new Error("Artifact reader limit reached");return new Promise(C=>{w.resolvePull=
C,w.ready?jr(t,{type:"pull",id:v}):w.queued||(w.queued=!0,n?.addEventListener("abort",w.abort,{once:!0}),y.signal?.addEventListener(
"abort",w.abort,{once:!0}),d.push(w),p())})},cancel(){w.active&&jr(t,{type:"cancel",id:v}),m(w)}},{highWaterMark:0});return new Response(
I,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"application/octet-stream"}})}return{fetch:g,close(u="\
Artifact bridge closed"){if(!h){h=!0;for(const y of[...l.values(),...d])y.active&&jr(t,{type:"cancel",id:y.id}),m(y,wh(u));
b(),t.close()}}}}const Vc=t=>new TextEncoder().encode(t).byteLength;function J7(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function Nd(t){if(t==null)return null;
if(!Number.isSafeInteger(t.width)||!Number.isSafeInteger(t.height)||t.width<1||t.height<1||t.width*t.height>Ae.maxImagePixels||
t.channels!==4||!(t.data instanceof Uint8Array||t.data instanceof Uint8ClampedArray)||t.data.byteLength!==t.width*t.height*
4||t.data.byteLength>Ae.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fi\
les are not accepted");return t}function Pd(t){const e=t.messages??(typeof t.prompt=="string"?[{role:"user",content:t.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>Ae.maxMessages)throw new Error("Invalid inference messages");let r=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=Vc(n.content),r>Ae.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function AE(t){if(!t)return;let e;const r=new Set;for(const n of[t.model,t.processor,
t.tokenizer])if(!(!n||r.has(n))){r.add(n);try{await n.dispose?.()}catch(s){e??=s}}if(e)throw e}function Bh(t,e=new Set){
if(!(!t||typeof t!="object"||e.has(t))){if(e.add(t),typeof t.dispose=="function"){t.dispose();return}for(const r of Object.
values(t))Bh(r,e)}}function Y7(t){const e=t.findIndex(n=>n.role==="user");if(e<0)return null;const r=t.findIndex((n,s)=>s>
e&&n.role==="user");return r<0?null:t.filter((n,s)=>s<e||s>=r||n.role==="system")}function X7(t,e,r){const n={...t.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,t.generation_config);const s=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],i=e.at(-1),o=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return o(i)&&s.some(a=>o(a)&&BigInt(a)===BigInt(i))?"stop":e.length>=r?"length":"unknown"}function un(t,e,r){const n=t===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${t}: ${String(
e?.message??e??"operation failed").slice(0,240)}`,s=new Error(`Model session lost: ${r} ${n}`,{cause:e});return s.code=t===
"out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",s}function Z7(t){let e,r,n=!1;const s=a=>{n||(t.lost=!0,(!t.
gpuFailure||a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(t.gpuFailure=a),t.active?.abort(a))},i=({error:a})=>s(un(a?.constructor?.
name==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",a,r?.stage??"resident model")),o=()=>{if(!(!r||r.device)){
r.device=e;for(const a of["validation","out-of-memory","internal"])e.pushErrorScope(a),r.filters.push(a)}};return{attach(a){
if(e&&e!==a)throw un("device changed",null,"load");if(!e){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!=
"function"||typeof a.queue?.onSubmittedWorkDone!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!=
"function"||typeof a.destroy!="function"||typeof a.lost?.then!="function")throw un("device unavailable",null,"load");e=a,
t.runtimeDevice=e,e.addEventListener("uncapturederror",i),e.lost.then(c=>s(un("device lost",c,r?.stage??"resident model")),
c=>s(un("device lost",c,r?.stage??"resident model")))}try{o()}catch(c){const l=un("error scope failure",c,r?.stage??"loa\
d");throw s(l),l}},async run(a,c){if(t.lost)throw t.gpuFailure??un("device lost",null,a);if(r)throw new Error("Overlappi\
ng model GPU operations are not allowed");const l={stage:a,filters:[],device:null};r=l;let d,f;try{if(e&&this.attach(e),
d=await c(),!e)throw un("device unavailable",null,a)}catch(m){f=m}if(e)try{await e.queue.onSubmittedWorkDone()}catch(m){
s(un("queue failure",m,a))}const h=await Promise.all(l.filters.reverse().map(async m=>{try{return{filter:m,error:await l.
device.popErrorScope()}}catch(b){return{filter:m,error:b,scopeFailed:!0}}}));r=null;for(const m of h)m.scopeFailed&&s(un(
"error scope failure",m.error,a));const p=["out-of-memory","internal","validation"].map(m=>h.find(b=>b.filter===m&&b.error&&
!b.scopeFailed)).find(Boolean);if(p&&s(un(p.filter,p.error,a)),f instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.
test(f?.message??"")){const m=new Error("Model session lost: native inference runtime failed",{cause:f});m.code="ERR_MOD\
EL_RUNTIME",s(m)}if(typeof f?.code=="string"&&f.code.startsWith("ERR_MODEL_GPU")&&s(f),t.gpuFailure)throw t.gpuFailure;if(f)
throw f;return d},dispose(){n=!0,e?.removeEventListener("uncapturederror",i)}}}function eN(t){const e=["maxBindGroups","\
maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBi\
ndingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","ma\
xComputeWorkgroupSizeZ"],r={};for(const s of e){const i=t.limits?.[s];if(!Number.isSafeInteger(i)||i<=0)throw new Error(
`WebGPU adapter has an invalid ${s} limit`);r[s]=i}const n=["chromium-experimental-subgroup-matrix","timestamp-query","s\
hader-f16","subgroups","subgroup-size-control"].filter(s=>t.features.has(s));return{requiredLimits:r,requiredFeatures:n}}
async function Uy(t){await AE(t.components),t.restoreGpuEvidence?.(),t.gpuGuard?.dispose(),t.ownedDevice?.destroy(),t.ownedDevice=
null}async function tN({library:t,modelPath:e,options:r,manifest:n,adapterFeatures:s=[]}){const i={};try{const o=await t.
AutoConfig.from_pretrained(e,r),a=tE(n.model,o);for(const l of a)if(!s.includes(l))throw new Error(`Model config require\
s unsupported GPU feature: ${l}`);const c={...r,config:o};if(n.model.architecture==="qwen3_5"&&(c.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(i.processor=await t.AutoProcessor.from_pretrained(e,r),n.model.architecture===
"qwen3_5"){const l=i.processor.image_processor;if(!l)throw new Error("Qwen3.5 image processor is unavailable");l.min_pixels=
256*256,l.max_pixels=ec(n.model).maxProcessedImagePixels,l.do_normalize??=!0}i.tokenizer=i.processor.tokenizer,i.model=await t.
AutoModelForImageTextToText.from_pretrained(e,c)}else i.tokenizer=await t.AutoTokenizer.from_pretrained(e,r),i.model=await t.
AutoModelForCausalLM.from_pretrained(e,c);return i}catch(o){throw await AE(i),o}}function Fy(t){return{sessionId:t.sessionId,
manifestCid:t.manifestCid,status:t.lost?"lost":t.status,task:t.manifest.model.task,dtype:t.manifest.model.dtype,workerId:t.
workerId,adapter:t.adapter,runtimeAdapter:t.runtimeAdapter??null,gpuDispatches:t.gpuDispatches??0,gpuSubmissions:t.gpuSubmissions??
0,gpuProfileSamples:t.gpuProfileSamples??0,collectGpuEvidence:t.collectGpuEvidence===!0,runtimeFeatures:t.runtimeFeatures??
[],generatedRequests:t.generatedRequests}}function IE({loadLibrary:t=()=>qt(()=>import("./transformers.web-DGNMtDcj.js"),
[],import.meta.url),loadModel:e=tN,gpu:r=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=J7}={}){
const i=new Map;let o;async function a(l,d){if(i.size)throw new Error("This inference worker already has a resident/load\
ing model");const f=Vo(l.sessionId),{manifest:h}=nE(l.manifest),p=sE(l.runtimeAssets,n);if(!l.artifactPort?.postMessage)
throw new Error("An artifact reader port is required");zt(d.signal);const m={sessionId:f,manifest:h,manifestCid:l.manifestCid,
status:"loading",workerId:d.workerId??null,generatedRequests:0,components:null};i.set(f,m);let b;try{const g=await r?.requestAdapter(
{powerPreference:"high-performance"});if(zt(d.signal),!g||g.info?.isFallbackAdapter||g.isFallbackAdapter)throw new Error(
"A hardware WebGPU adapter is required; CPU/software fallback is disabled");const u=typeof h.model.dtype=="string"?[h.model.
dtype]:Object.values(h.model.dtype),y=new Set(h.model.requiredFeatures??[]);u.some(I=>["fp16","q4f16"].includes(I))&&y.add(
"shader-f16");for(const I of y)if(!g.features.has(I))throw new Error(`Model requires unsupported GPU feature: ${I}`);m.adapter=
{vendor:g.info?.vendor??"",architecture:g.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...y]};const E=await(o??=
t());if(zt(d.signal),E.env.version!==Ld)throw new Error("Unexpected Transformers runtime version");const k=new URL("/__p\
eercompute_models/",n);b=Q7(l.artifactPort,{manifest:h,baseUrl:new URL(`${f}/`,k).href,signal:d.signal});const{env:A}=E;
A.logLevel=50,A.allowLocalModels=!0,A.allowRemoteModels=!1,A.localModelPath=k.pathname,A.useBrowserCache=!1,A.useFSCache=
!1,A.useWasmCache=!1,A.fetch=async(...I)=>{try{return await b.fetch(...I)}catch(C){throw d.emitProgress?.({type:"artifac\
t-read-error",sessionId:f,message:C.message}),C}},A.backends.onnx.wasm.proxy=!1,A.backends.onnx.wasm.numThreads=1,A.backends.
onnx.wasm.wasmPaths=p,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=l.collectGpuEvidence===
!0,A.backends.onnx.webgpu&&(A.backends.onnx.webgpu.profiling={mode:l.collectGpuEvidence===!0?"default":"off",ondata:()=>{
m.gpuProfileSamples+=1}});const S={local_files_only:!0,device:"webgpu",dtype:h.model.dtype,session_options:{executionProviders:[
"webgpu"]},progress_callback:I=>{d.signal?.aborted||d.emitProgress?.({type:"model-load",sessionId:f,status:String(I.status??
"").slice(0,40),file:typeof I.file=="string"?I.file.slice(0,512):void 0,loaded:Number.isFinite(I.loaded)?I.loaded:void 0,
total:Number.isFinite(I.total)?I.total:void 0})}};m.library=E,m.gpuGuard=Z7(m),await m.gpuGuard.run("load",async()=>{const I=A.
backends.onnx.webgpu;if(!I)throw new Error("The WebGPU runtime is unavailable");I.adapter=g,m.ownedDevice=await g.requestDevice(
eN(g)),m.gpuGuard.attach(m.ownedDevice),S.session_options.executionProviders=[{name:"webgpu",device:m.ownedDevice}],m.components=
await e({library:E,modelPath:f,options:S,manifest:h,adapterFeatures:[...g.features]});for(const C of y)if(!m.runtimeDevice.
features.has(C))throw new Error(`ORT device is missing required GPU feature: ${C}`);zt(d.signal)});const v=m.runtimeDevice;
if(m.runtimeFeatures=[...v?.features??[]],m.collectGpuEvidence&&v){const I=v.createCommandEncoder.bind(v),C=v.queue.submit.
bind(v.queue),T=Object.getOwnPropertyDescriptor(v,"createCommandEncoder"),P=Object.getOwnPropertyDescriptor(v.queue,"sub\
mit");m.restoreGpuEvidence=()=>{T?Object.defineProperty(v,"createCommandEncoder",T):delete v.createCommandEncoder,P?Object.
defineProperty(v.queue,"submit",P):delete v.queue.submit,m.restoreGpuEvidence=null},v.createCommandEncoder=(...L)=>{const N=I(
...L),H=N.beginComputePass.bind(N);return N.beginComputePass=(...te)=>{const X=H(...te);for(const j of["dispatchWorkgrou\
ps","dispatchWorkgroupsIndirect"]){const ae=X[j].bind(X);X[j]=(...fe)=>{const Te=ae(...fe);return m.gpuDispatches+=1,Te}}
return X},N},v.queue.submit=(...L)=>{const N=C(...L);return m.gpuSubmissions+=1,N}}const w=v?.adapterInfo??A.backends.onnx.
webgpu?.adapter?.info;if(w){if(w.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");m.runtimeAdapter=
{vendor:w.vendor,architecture:w.architecture,isFallbackAdapter:w.isFallbackAdapter??!1}}if(zt(d.signal),m.lost)throw m.gpuFailure;
return m.status="ready",Fy(m)}catch(g){try{await Uy(m),i.delete(f)}catch(u){m.status="ready",m.lost=!0;const y=new Error(
`MODEL_DISPOSE_FAILED: ${u.message}`);throw y.code="MODEL_DISPOSE_FAILED",y}throw g}finally{b?.close(),b||l.artifactPort.
close()}}async function c(l,d){const f=i.get(Vo(l.sessionId));if(!f||f.lost)throw new Error("Model session lost or not l\
oaded");if(f.status!=="ready")throw new Error("Model session is busy");const h=Vo(l.requestId),p=l.maxNewTokens??Ae.maxNewTokens;
if(!Number.isInteger(p)||p<1||p>Ae.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let m=Pd(l);
const b=Nd(l.image);if(b&&f.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image \
inputs");zt(d.signal);const g=new AbortController,u=new f.library.InterruptableStoppingCriteria,y=()=>{g.abort(d.signal?.
reason),u.interrupt()};d.signal?.addEventListener("abort",y,{once:!0}),g.signal.addEventListener("abort",()=>u.interrupt(),
{once:!0}),f.active=g,f.requestId=h,f.status="generating";let E,k,A=0,S=0,v,w=!1;const I=f.gpuDispatches??0,C=f.gpuSubmissions??
0;try{zt(d.signal);const{tokenizer:T,processor:P,model:L}=f.components;let N;for(;;){zt(g.signal);let ae=m;if(P&&(ae=m.map(
ye=>({role:ye.role,content:[{type:"text",text:ye.content}]})),b)){const ye=ae.findLast(F=>F.role==="user");if(!ye)throw new Error(
"An image requires a user message");ye.content.unshift({type:"image"})}const fe=(P??T).apply_chat_template(ae,{tokenize:!1,
add_generation_prompt:!0,enable_thinking:!1});if(typeof fe!="string"||Vc(fe)>Ae.maxPromptBytes)throw new Error("Template\
d prompt exceeds its byte budget");if(b){const ye=new f.library.RawImage(b.data,b.width,b.height,b.channels);E=await P(fe,
ye,{do_image_splitting:!1})}else E=await T(fe,{truncation:!1,padding:!1});if(zt(g.signal),N=E.input_ids?.dims?.at(-1),!Number.
isSafeInteger(N)||N<1)throw new Error("Invalid model input token count");if(N+p<=Ae.maxContextTokens)break;const Te=Y7(m);
if(!Te)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or req\
uest fewer output tokens");const he=E;E=void 0,Bh(he),m=Te,w=!0}zt(g.signal);const H=new f.library.TextStreamer(T,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:ae=>{if(!(g.signal.aborted||v)){if(S+=Vc(ae),S>Ae.maxOutputBytes){v=new Error("\
Generated text exceeded its byte budget"),g.abort(v);return}try{if(d.emitProgress?.({type:"token",sessionId:f.sessionId,
requestId:h,sequence:A++,text:ae})===!1)throw new Error("Token consumer rejected output")}catch(fe){v=fe,g.abort(fe)}}}});
if(await f.gpuGuard.run("generation",async()=>{k=await L.generate({...E,max_new_tokens:p,do_sample:!1,streamer:H,stopping_criteria:[
u]})}),v)throw v;if(f.lost)throw f.gpuFailure;zt(g.signal);const te=k.tolist();if(te.length!==1||te[0].length<N||te[0].length>
N+p)throw new Error("Model returned an over-budget token sequence");const X=te[0].slice(N),j=T.decode(X,{skip_special_tokens:!0});
if(Vc(j)>Ae.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");return f.generatedRequests+=1,{sessionId:f.
sessionId,requestId:h,text:j,inputTokens:N,outputTokens:X.length,finishReason:X7(L,X,p),contextTruncated:w,workerId:f.workerId,
gpuDispatches:(f.gpuDispatches??0)-I,gpuSubmissions:(f.gpuSubmissions??0)-C,gpuProfileSamples:f.gpuProfileSamples??0}}catch(T){
throw f.gpuFailure??T}finally{d.signal?.removeEventListener("abort",y);try{const T=new Set;let P;for(const L of[E,k])try{
Bh(L,T)}catch(N){P??=N}if(P){f.lost=!0;const L=f.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:P});
throw L.code??="MODEL_DISPOSE_FAILED",f.gpuFailure=L,L}}finally{f.active=null,f.requestId=null,f.status="ready"}}}return async function(d={},f={}){
if(s(),d.command==="load")return a(d,f);if(d.command==="generate")return c(d,f);const h=i.get(Vo(d.sessionId));if(d.command===
"status")return h?Fy(h):{sessionId:d.sessionId,status:"absent"};if(d.command==="cancel")return h?.requestId===d.requestId&&
h.active?.abort("Generation cancelled"),{sessionId:d.sessionId,cancellationRequested:!0};if(d.command==="unload"){if(!h)
return{sessionId:d.sessionId,status:"absent"};if(h.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");h.status="unloading";try{await Uy(h)}catch(p){h.status="ready",h.lost=!0;const m=new Error(`MODEL_DIS\
POSE_FAILED: ${p.message}`);throw m.code="MODEL_DISPOSE_FAILED",m}return i.delete(d.sessionId),{sessionId:d.sessionId,status:"\
unloaded"}}throw new Error("Unknown model task command")}}const rN=IE(),nN=(t,e)=>rN(t,e),sN=Object.freeze(Object.defineProperty(
{__proto__:null,createModelTaskRuntime:IE,handleModelTask:nN,normalizeModelMessages:Pd,validateImageInput:Nd},Symbol.toStringTag,
{value:"Module"})),_E="1.31.1",iN=512*512*4,Ic=1024**3;function Od(t){const e=as(t),r=e.model,n=Object.values(Ya).find(i=>i.
model.repository===r?.repository&&i.model.revision===r?.revision&&i.model.pipeline===r?.pipeline);if(!n||r.runtime!=="on\
nx-diffusion"||r.runtimeVersion!==_E||r.task!=="text-to-image"||r.architecture!==n.model.architecture||JSON.stringify(r.
modalities)!=='["text"]'||JSON.stringify(r.outputModalities)!=='["image"]'||e.files.length!==n.files.length)throw new Error(
"Diffusion package is not in the trusted runtime catalog");for(const i of["format","dtype","steps","width","height","pad\
TokenId","weightQuantization","requiredFeatures"]){const o=(a,c)=>a&&c&&typeof a=="object"&&typeof c=="object"?Object.keys(
a).length===Object.keys(c).length&&Object.keys(a).every(l=>o(a[l],c[l])):a===c;if(!o(r[i],n.model[i]))throw new Error(`D\
iffusion ${i} differs from the trusted profile`)}for(const i of n.files){const o=e.files.find(a=>a.path===i.path);if(!o||
o.size!==i.size||o.sha256!==i.sha256)throw new Error("Diffusion files differ from pinned catalog digests")}const s=e.files.
reduce((i,o)=>i+o.size,0);if(!Number.isSafeInteger(s)||s>3*Ic)throw new Error("Diffusion package exceeds its admitted by\
te budget");return{manifest:e,trusted:n,totalBytes:s,resourcePolicy:{maxModelBytes:3*Ic,minimumCpuBytes:8*Ic,minimumGpuBytes:8*
Ic}}}function CE(t,e){const{trusted:r}=Od(e);if(t.image)throw new Error("This diffusion runtime accepts text only");const n=Pd(
t);if(n.length!==1||n[0].role!=="user")throw new Error("Diffusion requires exactly one user prompt");const s=n[0].content.
trim();if(!s||new TextEncoder().encode(s).length>4096)throw new Error("Diffusion needs a text prompt of at most 4096 byt\
es");const i=t.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.isSafeInteger(i)||i<0||i>4294967295)throw new Error(
"Diffusion seed must be uint32");const o=t.steps??r.steps;if(o!==r.steps||(t.width??512)!==512||(t.height??512)!==512)throw new Error(
`This diffusion profile requires 512×512 and ${r.steps} steps`);return{task:"text-to-image",prompt:s,messages:[{role:"u\
ser",content:s}],seed:i,steps:o,width:512,height:512}}function TE(t,e=globalThis.location?.href){if(!t||Object.keys(t).some(
s=>!["mjs","wasm"].includes(s)))throw new Error("Unexpected diffusion runtime assets");const r=new URL(e),n={};for(const s of[
"mjs","wasm"]){if(typeof t[s]!="string")throw new Error("Trusted diffusion runtime assets are required");const i=new URL(
t[s],r);if(i.origin!==r.origin||i.username||i.password||i.hash||!["http:","https:"].includes(i.protocol)||!new RegExp(`(\
?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${s}$`).test(i.pathname))throw new Error("Diffusion assets mus\
t be same-origin ORT JSEP files");n[s]=i.href}return n}const oN=Object.freeze({id:"onnx-diffusion",moduleUrl:"peercomput\
e:diffusion-inference",validateManifest:Od,validateRuntimeAssets:TE,normalizeGenerationInput:CE,validateRuntimeOptions(t){
if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).length)throw new Error("Diffusion runtime options are fixed \
by the trusted model profile");return{}},terminateOnUnload:!0}),aN=Object.freeze(Object.defineProperty({__proto__:null,DIFFUSION_IMAGE_BYTES:iN,
DIFFUSION_RUNTIME_VERSION:_E,diffusionRuntimeDefinition:oN,normalizeDiffusionInput:CE,validateDiffusionManifest:Od,validateDiffusionRuntimeAssets:TE},
Symbol.toStringTag,{value:"Module"}));function RE(t){if(!t||JSON.stringify(t).length>256*1024)throw new Error("Invalid H\
ub package metadata");const e=structuredClone(t),r=e.model;if(!r||e.repository!==r.repository||e.revision!==r.revision||
!/^[a-f0-9]{40}$/.test(e.revision??""))throw new Error("Hub packages require a pinned immutable revision");if(!Array.isArray(
e.files)||!e.files.length||e.files.length>1024)throw new Error("Invalid Hub package files");let n=0;const s=e.files.map(
a=>{if(Na(e.repository,e.revision,a.path),!Number.isSafeInteger(a.size)||a.size<0)throw new Error("Invalid Hub file size");
if(a.sha256!==void 0&&!/^[a-f0-9]{64}$/.test(a.sha256))throw new Error("Invalid Hub SHA256");if(a.gitBlobSha1!==void 0&&
!/^[a-f0-9]{40}$/.test(a.gitBlobSha1))throw new Error("Invalid Hub Git digest");if(!a.sha256&&!a.gitBlobSha1)throw new Error(
"Hub file has no verifiable digest");if(/\.(onnx(?:_data(?:_\d+)?)?|gguf|bin)$/i.test(a.path)&&!a.sha256)throw new Error(
"Model weight files require SHA256");n+=a.size;const c=a.sha256??"0".repeat(64),l=Uint8Array.from(c.match(/../g),d=>Number.
parseInt(d,16));return{path:a.path,size:a.size,sha256:c,cid:Kt.createV1(85,wE(18,l)).toString()}});if(!Number.isSafeInteger(
n)||e.totalBytes!==n)throw new Error("Hub package size does not match selected files");const i={schema:"peercompute.arti\
fact.manifest.v1",name:String(e.name??e.repository).slice(0,256),...e.description?{description:String(e.description).slice(
0,4e3)}:{},model:r,files:s,provenance:{...e.provenance,source:"huggingface",repository:e.repository,revision:e.revision,
...e.license?{license:e.license}:{}}},o=as(i);if(r.runtime==="transformers.js")nE(o);else if(r.runtime==="llama.cpp")am(
o);else if(r.runtime==="onnx-diffusion")Od(o);else throw new Error("This Hub package has no supported runtime");return{...i,
files:e.files.map(({path:a,size:c,sha256:l,gitBlobSha1:d})=>({path:a,size:c,...l?{sha256:l}:{},...d?{gitBlobSha1:d}:{}}))}}
const Lh=t=>Array.isArray(t)?t.map(Lh):t&&typeof t=="object"?Object.fromEntries(Object.keys(t).sort().map(e=>[e,Lh(t[e])])):
t,zy=t=>JSON.stringify(Lh(t));function Dh(t,e){return!t||!e||t.model?.repository!==e.model?.repository||t.model?.revision!==
e.model?.revision||t.model?.runtime!==e.model?.runtime||zy(t.model)!==zy(e.model)?!1:t.files?.length===e.files?.length&&
e.files.every(r=>t.files.some(n=>n.path===r.path&&n.size===r.size&&(!r.sha256||n.sha256===r.sha256)))}async function cN(t,e,r,{
signal:n}={}){if(!Dh(e,r))return!1;for(const s of r.files.filter(i=>i.gitBlobSha1&&!i.sha256)){n?.throwIfAborted();const i=e.
files.find(c=>c.path===s.path),o=sm.create().update(new TextEncoder().encode(`blob ${s.size}\0`));let a=0;try{for await(const c of t.
openRead(i.cid,{signal:n})){if(n?.throwIfAborted(),a+=c.byteLength,a>s.size)return!1;o.update(c)}}catch{return n?.throwIfAborted(),
!1}if(a!==s.size||Da(o.digest())!==s.gitBlobSha1)return!1}return n?.throwIfAborted(),!0}function lN(t,e){return e?.files?
{...t,files:t.files.map(r=>{if(!r.sha256)return r;const n=e.files.find(s=>s.path===r.path&&s.size===r.size&&s.sha256===r.
sha256);if(!n?.cid)return r;try{return{...r,cid:Ze(n.cid).toString()}}catch{return r}})}:t}function vs(t=0){return new Uint8Array(
t)}function Ql(t=0){return new Uint8Array(t)}function dN(t){return t?.buffer instanceof ArrayBuffer}function uN(t){if(dN(
t))return t;const e=t.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function qy(t,e){e==null&&(e=t.reduce((s,i)=>s+
i.length,0));const r=Ql(e);let n=0;for(const s of t)r.set(s,n),n+=s.length;return uN(r)}function fN(t,e){if(t===e)return!0;
if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}const ME=Symbol.
for("@achingbrain/uint8arraylist");function jy(t,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let r=0;
for(const n of t){const s=r+n.byteLength;if(e<s)return{buf:n,index:e-r};r=s}throw new RangeError("index is out of bounds")}
function _c(t){return!!t?.[ME]}class Ns{bufs;length;[ME]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.
appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let r=0;for(const n of e)if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.push(n);else if(_c(n)){r+=n.byteLength;for(const s of n.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
r}prepend(...e){this.prependAll(e)}prependAll(e){let r=0;for(const n of e.reverse())if(n instanceof Uint8Array)r+=n.byteLength,
this.bufs.unshift(n);else if(_c(n))r+=n.byteLength,this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=r}get(e){const r=jy(this.bufs,e);return r.buf[r.index]}set(e,r){
const n=jy(this.bufs,e);n.buf[n.index]=r}write(e,r=0){if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(r+n,
e[n]);else if(_c(e))for(let n=0;n<e.length;n++)this.set(r+n,e.get(n));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,r){const{
bufs:n,length:s}=this._subList(e,r);return qy(n,s)}subarray(e,r){const{bufs:n,length:s}=this._subList(e,r);return n.length===
1?n[0]:qy(n,s)}sublist(e,r){const{bufs:n,length:s}=this._subList(e,r),i=new Ns;return i.length=s,i.bufs=n,i}_subList(e,r){
if(e=e??0,r=r??this.length,e<0&&(e=this.length+e),r<0&&(r=this.length+r),e<0||r>this.length)throw new RangeError("index \
is out of bounds");if(e===r)return{bufs:[],length:0};if(e===0&&r===this.length)return{bufs:[...this.bufs],length:this.length};
const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,d=r>a&&r<=c;if(l&&d){if(e===a&&r===c){n.push(o);break}const f=e-a;n.push(o.subarray(f,f+(r-e)));break}if(l){if(e===
0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(d){if(r===c){n.push(o);break}n.push(o.subarray(0,r-a));break}n.
push(o)}return{bufs:n,length:r-e}}indexOf(e,r=0){if(!_c(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();if(r=Number(r??0),isNaN(
r)&&(r=0),r<0&&(r=this.length+r),r<0&&(r=0),e.length===0)return r>this.length?this.length:r;const s=n.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let f=0;f<i;f++)o[f]=-1;
for(let f=0;f<s;f++)o[n[f]]=f;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let d;for(let f=r;f<=c;f+=d){d=0;
for(let h=l;h>=0;h--){const p=this.get(f+h);if(n[h]!==p){d=Math.max(1,h-a[p]);break}}if(d===0)return f}return-1}getInt8(e){
const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt8(0)}setInt8(e,r){const n=Ql(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,r),this.write(n,e)}getInt16(e,r){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,r)}setInt16(e,r,n){const s=vs(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,r,n),this.write(s,e)}getInt32(e,r){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,r)}setInt32(e,r,n){const s=vs(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,r,n),this.write(s,e)}getBigInt64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,r)}setBigInt64(e,r,n){const s=vs(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,r,n),this.write(s,e)}getUint8(e){const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint8(0)}setUint8(e,r){const n=Ql(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,r),this.write(n,e)}getUint16(e,r){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,r)}setUint16(e,r,n){const s=vs(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,r,n),this.write(s,e)}getUint32(e,r){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,r)}setUint32(e,r,n){const s=vs(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,r,n),this.write(s,e)}getBigUint64(e,r){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,r)}setBigUint64(e,r,n){const s=vs(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,r,n),this.write(s,e)}getFloat32(e,r){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,r)}setFloat32(e,r,n){const s=vs(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,r,n),this.write(s,e)}getFloat64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,r)}setFloat64(e,r,n){const s=vs(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,r,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Ns)||e.bufs.length!==this.bufs.length)return!1;for(let r=0;r<
this.bufs.length;r++)if(!fN(this.bufs[r],e.bufs[r]))return!1;return!0}static fromUint8Arrays(e,r){const n=new Ns;return n.
bufs=e,r==null&&(r=e.reduce((s,i)=>s+i.byteLength,0)),n.length=r,n}}class f9 extends Error{static name="AbortError";constructor(e="\
The operation was aborted"){super(e),this.name="AbortError"}}class h9 extends Error{static name="UnexpectedPeerError";constructor(e="\
Unexpected Peer"){super(e),this.name="UnexpectedPeerError"}}class p9 extends Error{static name="InvalidCryptoExchangeErr\
or";constructor(e="Invalid crypto exchange"){super(e),this.name="InvalidCryptoExchangeError"}}class hN extends Error{static name="\
InvalidParametersError";constructor(e="Invalid parameters"){super(e),this.name="InvalidParametersError"}}class m9 extends Error{static name="\
InvalidPublicKeyError";constructor(e="Invalid public key"){super(e),this.name="InvalidPublicKeyError"}}class g9 extends Error{static name="\
InvalidPrivateKeyError";constructor(e="Invalid private key"){super(e),this.name="InvalidPrivateKeyError"}}class b9 extends Error{static name="\
ConnectionClosedError";constructor(e="The connection is closed"){super(e),this.name="ConnectionClosedError"}}class y9 extends Error{static name="\
ConnectionFailedError";constructor(e="Connection failed"){super(e),this.name="ConnectionFailedError"}}class w9 extends Error{static name="\
MuxerClosedError";constructor(e="The muxer is closed"){super(e),this.name="MuxerClosedError"}}class v9 extends Error{static name="\
StreamResetError";constructor(e="The stream has been reset"){super(e),this.name="StreamResetError"}}class E9 extends Error{static name="\
StreamStateError";constructor(e="The stream is in an invalid state"){super(e),this.name="StreamStateError"}}class pN extends Error{static name="\
StreamBufferError";constructor(e="The stream buffer was full"){super(e),this.name="StreamBufferError"}}class k9 extends Error{static name="\
NotFoundError";constructor(e="Not found"){super(e),this.name="NotFoundError"}}class x9 extends Error{static name="Invali\
dPeerIdError";constructor(e="Invalid PeerID"){super(e),this.name="InvalidPeerIdError"}}class S9 extends Error{static name="\
InvalidMultiaddrError";constructor(e="Invalid multiaddr"){super(e),this.name="InvalidMultiaddrError"}}class A9 extends Error{static name="\
InvalidCIDError";constructor(e="Invalid CID"){super(e),this.name="InvalidCIDError"}}class I9 extends Error{static name="\
InvalidMultihashError";constructor(e="Invalid Multihash"){super(e),this.name="InvalidMultihashError"}}class _9 extends Error{static name="\
UnsupportedProtocolError";constructor(e="Unsupported protocol error"){super(e),this.name="UnsupportedProtocolError"}}class C9 extends Error{static name="\
InvalidMessageError";constructor(e="Invalid message"){super(e),this.name="InvalidMessageError"}}class T9 extends Error{static name="\
ProtocolError";constructor(e="Protocol error"){super(e),this.name="ProtocolError"}}let R9=class extends Error{static name="\
TimeoutError";constructor(e="Timed out"){super(e),this.name="TimeoutError"}};class B9 extends Error{static name="NotStar\
tedError";constructor(e="Not started"){super(e),this.name="NotStartedError"}}class L9 extends Error{static name="DialErr\
or";constructor(e="Dial error"){super(e),this.name="DialError"}}class D9 extends Error{static name="ListenError";constructor(e="\
Listen error"){super(e),this.name="ListenError"}}class $9 extends Error{static name="LimitedConnectionError";constructor(e="\
Limited connection"){super(e),this.name="LimitedConnectionError"}}class N9 extends Error{static name="TooManyInboundProt\
ocolStreamsError";constructor(e="Too many inbound protocol streams"){super(e),this.name="TooManyInboundProtocolStreamsEr\
ror"}}class P9 extends Error{static name="TooManyOutboundProtocolStreamsError";constructor(e="Too many outbound protocol\
 streams"){super(e),this.name="TooManyOutboundProtocolStreamsError"}}class O9 extends Error{static name="UnsupportedKeyT\
ypeError";constructor(e="Unsupported key type"){super(e),this.name="UnsupportedKeyTypeError"}}class lm extends Error{name="\
TimeoutError";constructor(e,r){super(e,r),Error.captureStackTrace?.(this,lm)}}const mN=t=>"reason"in t?t.reason:new DOMException(
"This operation was aborted.","AbortError"),gN=2**31-1,bN=(t,e)=>{if(typeof t!="number"||Math.sign(t)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function yN(t,e){
const{milliseconds:r,fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
t.cancel?.()}catch{}},f=new Promise((h,p)=>{const m=()=>{p(mN(o)),l()},b=bN(r,i);try{b?p(b):o?.aborted?m():o&&(c=m,o.addEventListener(
"abort",c,{once:!0}))}finally{t.then(h,p)}if(b||o?.aborted||r>gN)return;const g=n||s===!1||s instanceof Error?void 0:new lm(
s??`Promise timed out after ${r} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(n)try{h(n())}catch(u){p(u)}else s===!1?
h():p(s instanceof Error?s:g);l()},r)}).finally(()=>{try{f.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return f.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},f}const BE=t=>typeof t=="function"?{filter:t}:
{...t},wN=t=>t===1/0||Number.isSafeInteger(t)&&t>=0,vN=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],EN=t=>{for(const[e,r]of vN){const n=t?.[e],s=t?.[r];if(typeof n=="function"&&typeof s=="functi\
on")return{addListener:n.bind(t),removeListener:s.bind(t)}}throw new TypeError("Emitter is not compatible")},kN=t=>{const e=new Map;
for(const[r,n]of t)for(const s of Array.isArray(r)?r:[r])e.has(s)||e.set(s,n);return e},xN=({addListener:t,removeListener:e,
handlers:r,signal:n,abortHandler:s,isDone:i})=>{n?.addEventListener("abort",s,{once:!0});for(const[o,a]of r)if(t(o,a),i()){
e(o,a);return}},SN=({removeListener:t,handlers:e,signal:r,abortHandler:n})=>{for(const[s,i]of e)t(s,i);r?.removeEventListener(
"abort",n)},AN=(t,e,r)=>{let n=Promise.resolve();return(s,i)=>{n=n.then(async()=>{if(e())return;let o;try{o=t?await t(s):
!0}catch(a){e()||r(a);return}e()||i(o)})}};function IN(t,e,r){let n=()=>{},s=!1,i;const o=new Promise((a,c)=>{r=BE(r);const{
filter:l}=r;if(!wN(r.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof r.timeout==
"number"&&!(r.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${r.timeout}\
\``);r.signal?.throwIfAborted();const{addListener:d,removeListener:f}=EN(t);if(r.count===0){a([]);return}const h=[],p=k=>{
n(),c(k)},m=AN(l,()=>s,p),b=k=>{h.push(k),r.count===h.length&&(n(),a(h))},g=(...k)=>{if(s)return;const A=r.multiArgs?k:k[0];
if(!l){b(A);return}m(A,S=>{S&&b(A)})},u=(...k)=>{p(r.rejectionMultiArgs?k:k[0])},y=()=>{p(r.signal.reason)},E={addListener:d,
removeListener:f,handlers:kN([[e,g],[r.rejectionEvents??["error"],u]]),signal:r.signal,abortHandler:y,isDone:()=>s};n=()=>{
s=!0,clearTimeout(i),SN(E)},xN(E),!(s||!r.resolveImmediately)&&(Number.isFinite(r.timeout)&&r.timeout<=2**31-1&&(i=setTimeout(
n,r.timeout)),a(h))});if(o.cancel=n,typeof r.timeout=="number"&&r.timeout>0&&!r.resolveImmediately){const a=yN(o,{milliseconds:r.
timeout});return a.cancel=()=>{n(),a.clear()},a}return o}function LE(t,e,r){const n=IN(t,e,{...BE(r),count:1,resolveImmediately:!1}),
s=n.then(i=>i[0]);return s.cancel=n.cancel,s}class U9 extends Error{remainingPoints;msBeforeNext;consumedPoints;isFirstInDuration;constructor(e="\
Rate limit exceeded",r){super(e),this.name="RateLimitError",this.remainingPoints=r.remainingPoints,this.msBeforeNext=r.msBeforeNext,
this.consumedPoints=r.consumedPoints,this.isFirstInDuration=r.isFirstInDuration}}class F9 extends Error{static name="Que\
ueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class Jl extends Error{static name="\
UnexpectedEOFError";name="UnexpectedEOFError"}class z9 extends Error{static name="MaxEarlyStreamsError";name="MaxEarlySt\
reamsError"}class q9 extends Error{static name="StreamClosedError";name="StreamClosedError"}const _N=Math.pow(2,7),CN=Math.
pow(2,14),TN=Math.pow(2,21),dm=Math.pow(2,28),um=Math.pow(2,35),fm=Math.pow(2,42),hm=Math.pow(2,49),et=128,yr=127;function Ud(t){
if(t<_N)return 1;if(t<CN)return 2;if(t<TN)return 3;if(t<dm)return 4;if(t<um)return 5;if(t<fm)return 6;if(t<hm)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function RN(t,e,r=0){
switch(Ud(t)){case 8:e[r++]=t&255|et,t/=128;case 7:e[r++]=t&255|et,t/=128;case 6:e[r++]=t&255|et,t/=128;case 5:e[r++]=t&
255|et,t/=128;case 4:e[r++]=t&255|et,t>>>=7;case 3:e[r++]=t&255|et,t>>>=7;case 2:e[r++]=t&255|et,t>>>=7;case 1:{e[r++]=t&
255,t>>>=7;break}default:throw new Error("unreachable")}return e}function MN(t,e,r=0){switch(Ud(t)){case 8:e.set(r++,t&255|
et),t/=128;case 7:e.set(r++,t&255|et),t/=128;case 6:e.set(r++,t&255|et),t/=128;case 5:e.set(r++,t&255|et),t/=128;case 4:
e.set(r++,t&255|et),t>>>=7;case 3:e.set(r++,t&255|et),t>>>=7;case 2:e.set(r++,t&255|et),t>>>=7;case 1:{e.set(r++,t&255),
t>>>=7;break}default:throw new Error("unreachable")}return e}function BN(t,e){let r=t[e],n=0;if(n+=r&yr,r<et||(r=t[e+1],
n+=(r&yr)<<7,r<et)||(r=t[e+2],n+=(r&yr)<<14,r<et)||(r=t[e+3],n+=(r&yr)<<21,r<et)||(r=t[e+4],n+=(r&yr)*dm,r<et)||(r=t[e+5],
n+=(r&yr)*um,r<et)||(r=t[e+6],n+=(r&yr)*fm,r<et)||(r=t[e+7],n+=(r&yr)*hm,r<et))return n;throw new RangeError("Could not \
decode varint")}function LN(t,e){let r=t.get(e),n=0;if(n+=r&yr,r<et||(r=t.get(e+1),n+=(r&yr)<<7,r<et)||(r=t.get(e+2),n+=
(r&yr)<<14,r<et)||(r=t.get(e+3),n+=(r&yr)<<21,r<et)||(r=t.get(e+4),n+=(r&yr)*dm,r<et)||(r=t.get(e+5),n+=(r&yr)*um,r<et)||
(r=t.get(e+6),n+=(r&yr)*fm,r<et)||(r=t.get(e+7),n+=(r&yr)*hm,r<et))return n;throw new RangeError("Could not decode varin\
t")}function DN(t,e,r=0){return e==null&&(e=Ql(Ud(t))),e instanceof Uint8Array?RN(t,e,r):MN(t,e,r)}function $N(t,e=0){return t instanceof
Uint8Array?BN(t,e):LN(t,e)}const NN=4194304;class Gy extends Error{static name="UnwrappedError";name="UnwrappedError"}class PN extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class ON extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class UN extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}function FN(t){
return typeof t?.closeRead=="function"}function zN(t){return typeof t?.close=="function"}function sf(t){return FN(t)?t.remoteWriteStatus!==
"writable"&&t.readBufferLength===0:zN(t)?t.status!=="open":!1}function qN(t){return t?.addEventListener!=null&&t?.removeEventListener!=
null&&t?.send!=null&&t?.push!=null&&t?.log!=null}function jN(t,e){const r=e?.maxBufferSize??NN,n=new Ns;let s,i=!1,o;if(!qN(
t))throw new hN("Argument should be a Stream or a Multiaddr");const a=f=>{if(!i&&o==null){if(n.append(f.data),n.byteLength>
r){const h=n.byteLength;n.consume(h);const p=new pN(`Read buffer overflow - ${h} > ${r}`);o=p,s?.reject(p),queueMicrotask(
()=>{t.abort(p)});return}s?.resolve()}};t.addEventListener("message",a);const c=f=>{f.error!=null?s?.reject(f.error):s?.
resolve()};t.addEventListener("close",c);const l=()=>{s?.resolve()};t.addEventListener("remoteCloseWrite",l);const d={readBuffer:n,
async read(f){if(i===!0)throw new Gy("Stream was unwrapped");if(o!=null)throw o;if(sf(t)){if(n.byteLength===0&&f?.bytes==
null)return null;if(f?.bytes!=null&&n.byteLength<f.bytes)throw t.log.error("closed after reading %d/%d bytes",n.byteLength,
f.bytes),new Jl(`Unexpected EOF - stream closed after reading ${n.byteLength}/${f.bytes} bytes`)}const h=f?.bytes??1;for(s=
Promise.withResolvers();;){if(n.byteLength>=h){s.resolve();break}if(await c1(s.promise,f?.signal),sf(t)){if(n.byteLength===
0&&f?.bytes==null)return null;break}s=Promise.withResolvers()}const p=f?.bytes??n.byteLength;if(n.byteLength<p){if(sf(t))
throw t.log.error("closed while reading %d/%d bytes",n.byteLength,p),new Jl(`Unexpected EOF - stream closed while readin\
g ${n.byteLength}/${p} bytes`);return d.read(f)}const m=n.sublist(0,p);return n.consume(p),m},async write(f,h){if(i===!0)
throw new Gy("Stream was unwrapped");t.send(f)||await LE(t,"drain",{signal:h?.signal,rejectionEvents:["close"]})},unwrap(){
return i||(i=!0,t.removeEventListener("message",a),t.removeEventListener("close",c),t.removeEventListener("remoteCloseWr\
ite",l),n.byteLength>0&&(t.log("stream unwrapped with %d unread bytes",n.byteLength),t.unshift(n),n.consume(n.byteLength))),
t}};return d}function DE(t,e={}){const r=jN(t,e);e.maxDataLength!=null&&e.maxLengthLength==null&&(e.maxLengthLength=Ud(e.
maxDataLength));const n=e?.lengthDecoder??$N,s=e?.lengthEncoder??DN;return{async read(o){let a=-1;const c=new Ns;for(;;){
const d=await r.read({...o,bytes:1});if(d==null)break;c.append(d);try{a=n(c)}catch(f){if(f instanceof RangeError)continue;
throw f}if(a<0)throw new PN("Invalid message length");if(e?.maxLengthLength!=null&&c.byteLength>e.maxLengthLength)throw new UN(
`Message length length too long - ${c.byteLength} > ${e.maxLengthLength}`);if(a>-1)break}if(e?.maxDataLength!=null&&a>e.
maxDataLength)throw new ON(`Message length too long - ${a} > ${e.maxDataLength}`);const l=await r.read({...o,bytes:a});if(l==
null)throw t.log.error("tried to read %d bytes but the stream closed",a),new Jl(`Unexpected EOF - tried to read ${a} byt\
es but the stream closed`);if(l.byteLength!==a)throw t.log.error("read %d/%d bytes before the stream closed",l.byteLength,
a),new Jl(`Unexpected EOF - read ${l.byteLength}/${a} bytes before the stream closed`);return l},async write(o,a){await r.
write(new Ns(s(o.byteLength),o),a)},async writeV(o,a){const c=new Ns(...o.flatMap(l=>[s(l.byteLength),l]));await r.write(
c,a)},unwrap(){return r.unwrap()}}}function j9(t,e){const r=DE(t,e),n={read:async(s,i)=>{const o=await r.read(i);return s.
decode(o,i)},write:async(s,i,o)=>{await r.write(i.encode(s),o)},writeV:async(s,i,o)=>{await r.writeV(s.map(a=>i.encode(a)),
o)},pb:s=>({read:async i=>n.read(s,i),write:async(i,o)=>n.write(i,s,o),writeV:async(i,o)=>n.writeV(i,s,o),unwrap:()=>n}),
unwrap:()=>r.unwrap()};return n}function GN(t){return t?.addEventListener!=null}function WN(t){const e=a1();let r;const n=o=>{
e.push(o.data)},s=()=>{e.end(),t.removeEventListener("message",n),t.removeEventListener("close",i),t.removeEventListener(
"remoteCloseWrite",s)},i=o=>{e.end(o.error),o.error!=null&&r?.reject(o.error),t.removeEventListener("message",n),t.removeEventListener(
"close",i),t.removeEventListener("remoteCloseWrite",s)};return t.addEventListener("message",n),t.addEventListener("close",
i,{once:!0}),t.addEventListener("remoteCloseWrite",s,{once:!0}),{source:e,async sink(o){async function*a(){yield*o}const c=a();
for(;;){r=Promise.withResolvers();const{done:l,value:d}=await Promise.race([c.next(),r.promise]);if(t.writeStatus==="clo\
sing"||t.writeStatus==="closed"||(d!=null&&(t.send(d)||await Promise.race([LE(t,"drain",{rejectionEvents:["close"]})])),
l===!0))break}await t.close()}}}function G9(...t){const e=t.map(r=>GN(r)?WN(r):r);return l1(...e)}const pm=Object.freeze(
["text-generation","image-text-to-text","text-to-image","automatic-speech-recognition","text-to-speech"]);function $h(t,e){
const r=t?.modalities,n=t?.outputModalities;return!Array.isArray(r)||!Array.isArray(n)||!pm.includes(e)||t.task!==e&&!(e===
"text-generation"&&t.task==="image-text-to-text")?!1:e==="automatic-speech-recognition"?r.includes("audio")&&n.includes(
"text"):!r.includes("text")||e==="image-text-to-text"&&!r.includes("image")?!1:n.includes(e==="text-to-image"?"image":e===
"text-to-speech"?"audio":"text")}function $E(t){if(t?.available!==!0||t.queueAvailable===!1)return!1;const e=t.queuedRequests??
0,r=t.queueCapacity??Ae.maxQueued;return Number.isSafeInteger(e)&&e>=0&&Number.isSafeInteger(r)&&r>=0&&(!t.busy||e<r)}function Yl({
task:t,mode:e="local",candidates:r=[]}={}){if(!pm.includes(t)||!["mixed","local","peers"].includes(e)||!Array.isArray(r))
throw new Error("Invalid inference routing policy");const n=r.filter(i=>!(!$E(i)||!$h(i,t)||typeof i.manifestCid!="strin\
g"||!i.manifestCid||typeof i.key!="string"||!i.key||typeof i.runtime!="string"||![!0,!1].includes(i.local)||e==="local"&&
!i.local||e==="peers"&&i.local));if(n.sort((i,o)=>+!i.local-+!o.local||+!!i.busy-+!!o.busy||+(i.task!==t)-+(o.task!==t)||
(i.queuedRequests??0)-(o.queuedRequests??0)||Math.max(0,o.idleForMs??0)-Math.max(0,i.idleForMs??0)||i.manifestCid.localeCompare(
o.manifestCid)||i.key.localeCompare(o.key)),!n.length)throw Object.assign(new Error(e==="local"?"No compatible local mod\
el has available inference capacity.":e==="peers"?"No compatible peer model has available inference capacity.":"No compa\
tible local model or peer host has available inference capacity."),{code:"ERR_INFERENCE_NO_MODEL"});const s=structuredClone(
n[0]);return{candidate:s,route:{kind:"baseline",target:s.key,manifestCid:s.manifestCid,runtime:s.runtime,modelName:s.name??
s.manifestCid,local:s.local,task:t,modelTask:s.task,reason:`${s.local?"Local-first execution":"Peer execution"}; ${s.busy?
"bounded available queue":"ready capacity"}; baseline routing, not learned quality ranking`}}}const Ps=Object.freeze({chunkBytes:64*
1024,inputSampleRate:16e3,inputSeconds:20,outputSeconds:30,maxSampleRate:48e3}),Wy=(t,e,r)=>{if(!Number.isSafeInteger(t)||
t<e||t>r)throw new Error("Invalid audio numeric field");return t};function rc(t,{input:e=!1}={}){if(!t||t.format!=="f32l\
e"||t.channels!==1||!/^[a-f0-9]{64}$/.test(t.sha256??""))throw new Error("Audio requires mono f32le PCM and a SHA-256 di\
gest");const r=Wy(t.sampleRate,e?16e3:8e3,e?16e3:Ps.maxSampleRate),n=Wy(t.sampleCount,e?1600:1,r*(e?Ps.inputSeconds:Ps.outputSeconds));
return{format:"f32le",channels:1,sampleRate:r,sampleCount:n,sha256:t.sha256}}function mm(t,e=0,r=t.length,n=!1){if(!(t instanceof
Float32Array))throw new Error("Audio samples must be Float32 PCM");const s=new Uint8Array((r-e)*4),i=new DataView(s.buffer);
for(let o=e;o<r;o++){const a=t[o];if(!Number.isFinite(a)||Math.abs(a)>(n?1.01:10))throw new Error("Invalid PCM sample");
i.setFloat32((o-e)*4,a,!0)}return s}function HN(t,e,r={}){if(!(t instanceof Float32Array))throw new Error("Audio samples\
 must be Float32 PCM");const n=rc({format:"f32le",channels:1,sampleRate:e,sampleCount:t.length,sha256:"0".repeat(64)},r),
s=ka.create();for(let i=0;i<t.length;i+=Ps.chunkBytes/4)s.update(mm(t,i,Math.min(t.length,i+Ps.chunkBytes/4),r.input));return{
...n,sha256:T0(s.digest())}}async function NE(t,e,{requestId:r,signal:n,credit:s,input:i=!1}){const o=new Float32Array(e.
sampleCount),a=ka.create();let c=0;for(;c<o.byteLength;){const l=await t.rpc.read({signal:n});if(!l.byteLength||l.byteLength%
4||l.byteLength>Ps.chunkBytes||l.byteLength>o.byteLength-c)throw new Error("Invalid PCM transfer frame");const d=l.subarray(),
f=new DataView(d.buffer,d.byteOffset,d.byteLength);a.update(d);for(let h=0;h<d.length;h+=4){const p=f.getFloat32(h,!0);if(!Number.
isFinite(p)||Math.abs(p)>(i?1.01:10))throw new Error("Invalid PCM sample");o[(c+h)/4]=p}if(c+=d.length,c===o.byteLength&&
T0(a.digest())!==e.sha256)throw new Error("Audio digest mismatch");await t.write({type:s,requestId:r,offset:c},n)}return o}
async function W9(t,{samples:e,requestId:r,signal:n}){for(let s=0;s<e.length;){const i=Math.min(e.length,s+Ps.chunkBytes/
4);await t.rpc.write(mm(e,s,i,!0),{signal:n});const o=await t.read(n);if(o.type!=="audio-credit"||o.requestId!==r||o.offset!==
i*4)throw new Error("Invalid audio transfer credit");s=i}}async function H9(t,{audio:e,requestId:r,signal:n}){const s=rc(
e,{input:!0});return{samples:await NE(t,s,{requestId:r,signal:n,input:!0,credit:"audio-credit"}),sampleRate:s.sampleRate}}
async function V9(t,{samples:e,metadata:r,requestId:n,controls:s,signal:i}){const o=s.expect(0);await t.write({type:"res\
ult-audio",requestId:n,audio:r},i),await o;for(let a=0;a<e.length;){const c=Math.min(e.length,a+Ps.chunkBytes/4),l=s.expect(
c*4);await t.rpc.write(mm(e,a,c),{signal:i}),await l,a=c}}async function K9(t,{audio:e,requestId:r,signal:n}){const s=rc(
e);return await t.write({type:"result-credit",requestId:r,offset:0},n),{audio:await NE(t,s,{requestId:r,signal:n,credit:"\
result-credit"}),sampleRate:s.sampleRate,metadata:s}}const VN="/peercompute/inference/3.0.0",of="/peercompute/inference/\
2.0.0",Nh=t=>["automatic-speech-recognition","text-to-speech"].includes(t),KN=256,Os=Object.freeze({frameBytes:128*1024,
imageChunkBytes:64*1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,maximumHostedModels:16,
queryTimeoutMs:5e3,requestTimeoutMs:12e4,recordTtlMs:15e3}),PE=new TextEncoder,QN=new TextDecoder("utf-8",{fatal:!0}),gm=t=>PE.
encode(t).length,Kc=t=>Qi.parse(Ti(t,128)).toV1().toString();function Ti(t,e=256){if(typeof t!="string"||!t.length||gm(t)>
e)throw new Error("Invalid inference text field");return t}function Ct(t,e,r=0){if(!Number.isSafeInteger(t)||t<r||t>e)throw new Error(
"Invalid inference numeric field");return t}function Q9(t){return t?.status==="open"&&!!t.remotePeer&&(t.encryption==="/\
noise"||t.encryption==="/tls/1.0.0"||t.encryption==="native"&&t.remoteAddr?.getComponents?.().some(({name:e})=>e==="webr\
tc"||e==="webrtc-direct"))}function Hy(t){if(!t||typeof t!="object")throw new Error("Invalid model descriptor");if(!Array.
isArray(t.modalities)||t.modalities.length>4||t.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const e=t.task??(t.modalities.includes("image")?"image-text-to-text":"text-generation");if(!pm.
includes(e))throw new Error("Invalid model task");const r=e==="text-to-image"?["image"]:e==="text-to-speech"?["audio"]:[
"text"];if(t.outputModalities!==void 0&&(!Array.isArray(t.outputModalities)||t.outputModalities.length!==1||t.outputModalities[0]!==
r[0]))throw new Error("Model output modalities do not match its task");if(e==="text-to-image"&&(t.modalities.length!==1||
t.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");if(Nh(e)&&(t.modalities.length!==1||
t.modalities[0]!==(e==="text-to-speech"?"text":"audio")))throw new Error("Invalid speech model modalities");return{manifestCid:Kc(
t.manifestCid),modelId:Ti(t.modelId),name:Ti(t.name),task:e,outputModalities:r,modalities:[...new Set(t.modalities)],runtime:Ti(
t.runtime,128),repository:Ti(t.repository,256),revision:Ti(t.revision,128),totalBytes:Ct(t.totalBytes,64*1024**3)}}function J9(t,e=!0,{
defaultMaxNewTokens:r=KN,protocol:n=VN}={}){if(!t||!Array.isArray(t.sharedModels)||t.sharedModels.length>Os.maximumModels)
throw new Error("Invalid shared model catalog");const s=[...new Map(t.sharedModels.map(l=>{const d=Hy(l);return[d.manifestCid,
d]})).values()].filter(l=>n!==of||!Nh(l.task)),i=(l,d={})=>({...Hy(l),maxNewTokens:Ct(l.maxNewTokens===void 0?r:l.maxNewTokens,
Ae.maxNewTokens,1),busy:!!(l.busy??d.busy),idleForMs:Ct(l.idleForMs??d.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:Ct(
l.queuedRequests??d.queuedRequests??0,1024),queueCapacity:Ct(l.queueCapacity??Ae.maxQueued,1024),queueAvailable:l.queueAvailable!==
!1});let o=e&&t.hostedModel?i(t.hostedModel,t):null;n===of&&Nh(o?.task)&&(o=null);const a=t.hostedModels??(o?[o]:[]);if(!Array.
isArray(a)||a.length>Os.maximumHostedModels)throw new Error("Invalid hosted model list");const c=e?a.map(l=>i(l)):[];if(new Set(
c.map(l=>l.manifestCid)).size!==c.length)throw new Error("Duplicate hosted model identity");return{sharedModels:s,hostedModel:o,
...n!==of?{hostedModels:c}:{},busy:!!t.busy,idleForMs:Ct(t.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:Ct(t.queuedRequests??
0,1024)}}function Y9(t,{imageBytes:e=!1}={}){if(Vo(t.requestId),t.task==="automatic-speech-recognition"){if(t.prompt!=null||
t.messages!=null||t.image!=null||!t.audio)throw new Error("ASR accepts audio only");const n=e?HN(t.audio.samples,t.audio.
sampleRate,{input:!0}):rc(t.audio,{input:!0});return{requestId:t.requestId,manifestCid:Kc(t.manifestCid),task:t.task,audio:{
...n,...e?{samples:new Float32Array(t.audio.samples)}:{}}}}if(t.audio!=null)throw new Error("Only ASR accepts audio inpu\
t");if(t.task==="text-to-speech"){if(t.image!=null||t.messages!=null||typeof t.prompt!="string")throw new Error("TTS acc\
epts one text prompt");const n=t.prompt.trim();if(!n||[...n].length>256||gm(n)>1024)throw new Error("Speech text exceeds\
 its budget");return{requestId:t.requestId,manifestCid:Kc(t.manifestCid),task:t.task,prompt:n}}const r={requestId:t.requestId,
manifestCid:Kc(t.manifestCid),messages:Pd(t),maxNewTokens:Ct(t.maxNewTokens??Ae.maxNewTokens,Ae.maxNewTokens,1)};if(t.task!==
void 0){if(!["text-generation","image-text-to-text","text-to-image"].includes(t.task))throw new Error("Invalid inference\
 task");r.task=t.task}t.seed!==void 0&&(r.seed=Ct(t.seed,4294967295)),t.steps!==void 0&&(r.steps=Ct(t.steps,8,1));for(const n of[
"width","height"])t[n]!==void 0&&(r[n]=Ct(t[n],512,512));if(r.task==="text-to-image"&&(t.image!=null||r.messages.length!==
1||r.messages[0].role!=="user"))throw new Error("Image generation needs one text prompt");if(t.image!=null){const{width:n,
height:s,channels:i}=t.image;if(Ct(n,Ae.maxImagePixels,1),Ct(s,Ae.maxImagePixels,1),i!==4||n*s>Ae.maxImagePixels)throw new Error(
"Invalid inference image dimensions");e&&Nd(t.image),r.image={width:n,height:s,channels:4},e&&(r.image.data=new Uint8Array(
t.image.data))}return r}function JN(t,{imageBytes:e=!1}={}){if(!t||typeof t!="object")throw new Error("Invalid result im\
age");const r=Ct(t.width,1024,1),n=Ct(t.height,1024,1);if(t.channels!==4||r*n>Ae.maxImagePixels||!/^[a-f0-9]{64}$/.test(
t.sha256??""))throw new Error("Invalid result image dimensions or digest");return e&&Nd(t),{width:r,height:n,channels:4,
sha256:t.sha256,...e?{data:t.data}:{}}}function X9(t,e={}){const r=t?.text??(t?.audio?"":void 0);if(typeof r!="string"||
gm(r)>Ae.maxOutputBytes)throw new Error("Invalid inference result text");const n=t.finishReason===void 0?"unknown":t.finishReason;
if(!["stop","length","unknown"].includes(n))throw new Error("Invalid inference finish reason");const s={text:r,finishReason:n};
if(t.contextTruncated!==void 0){if(typeof t.contextTruncated!="boolean")throw new Error("Invalid inference context trunc\
ation flag");s.contextTruncated=t.contextTruncated}for(const i of["inputTokens","outputTokens","gpuDispatches","gpuSubmi\
ssions"])t[i]!=null&&(s[i]=Ct(t[i],Number.MAX_SAFE_INTEGER));return t.image!=null&&(s.image=JN(t.image,e)),t.audio!=null&&
(s.audio=rc(t.audio)),t.seed!==void 0&&(s.seed=Ct(t.seed,4294967295)),t.steps!==void 0&&(s.steps=Ct(t.steps,8,1)),s}function Z9(t){
if(!["text-encoder","denoise","decode"].includes(t.stage))throw new Error("Invalid image generation stage");const e=Ct(t.
steps,8,1);return{type:"diffusion-progress",stage:t.stage,steps:e,step:Ct(t.step,e)}}function eU(t){const e=DE(t,{maxDataLength:Os.
frameBytes,maxBufferSize:Os.frameBytes*2+32});return{rpc:e,async read(r){return JSON.parse(QN.decode((await e.read({signal:r})).
subarray()))},async write(r,n){const s=PE.encode(JSON.stringify(r));if(s.length>Os.frameBytes)throw new Error("Inference\
 frame exceeds its byte limit");await e.write(s,{signal:n})}}}function No(t,e){const r=o=>Number.isSafeInteger(o)&&o>=0?
o:1/0,n=r(t.totalBytes),s=r(e.totalBytes);if(n!==s)return n<s?-1:1;const i=o=>`${o.name??""}\0${o.key??o.manifestCid??""}`;
return i(t)<i(e)?-1:i(t)>i(e)?1:0}function Po(t={}){const e=[...t.modalities??["text"]],r=t.task??(e.includes("image")?"\
image-text-to-text":"text-generation");return{task:r,modalities:e,outputModalities:[...t.outputModalities??[r==="text-to\
-image"?"image":r==="text-to-speech"?"audio":"text"]]}}const _n=t=>(t?.model??t)?.runtime==="transformers-speech";function af(t,e,r){
return new Promise((n,s)=>{let i;const o=(c,l)=>{clearTimeout(i),e?.removeEventListener("abort",a),c(l)},a=()=>o(s,e.reason);
e?.addEventListener("abort",a,{once:!0}),Promise.resolve(t).then(c=>o(n,c),c=>o(s,c)),r!==void 0&&(i=setTimeout(()=>o(n),
r)),e?.aborted&&a()})}function YN(t,{catalog:e,now:r=Date.now,preferences:n=pE({storeName:t.store.lockName??t.store.name})}={}){
const s=Object.fromEntries(["importCatalog","importPackage","importHub","ensure","load","connect","connectBackend","disp\
ose"].filter(_=>typeof t[_]=="function").map(_=>[_,t[_].bind(t)])),i={},o=new Map,a=new Map,c=new Map,l={status:"unavail\
able",code:"model_verification_required",reason:"This saved package needs local verification. Open Stored Models and cho\
ose Verify locally. No download is required to check the saved bytes."},d=new Set,f=new Map,h=new Map,p=new AbortController,
m=B$(),b=new Set,g=new Map,u=new Set,y=new Map,E=new Map,k=new Map,A=new Set;let S=!0,v=!0,w=!1,I,C,T,P,L,N=null,H=0,te=r(),
X=Promise.resolve(),j=n.readLastLoaded(),ae={connected:!1,peerCount:0,sharedModelCount:0,hostedModelCount:0,errors:[],checkedAt:null};
const fe=()=>{if(w)throw new Error("Model console is closed")},Te=_=>_?AbortSignal.any([_,p.signal]):p.signal;function he(_){
const B=!_.model&&kh(_,Object.values(e));return t.getModelCompatibility?.(B||_)??{status:"unknown",reason:"Local memory \
fit is unverified."}}function ye(_){const B=he(_);if(["checking","unavailable"].includes(B.status))throw Object.assign(new Error(
B.reason||"This model cannot load on this device"),{code:"ERR_MODEL_LOCAL_UNAVAILABLE",availability:B});return B}function F(_){
if(ye(_),_n(_)&&!t.getServiceForModel)throw Object.assign(new Error(Eh),{code:"ERR_MODEL_VOICE_MANAGED"})}if(t.setMemoryBudgets){
const _=t.setMemoryBudgets.bind(t);t.setMemoryBudgets=B=>{if(fe(),P||t.service.getStatus().status==="loading"||t.getResidentModelStates?.().
some(R=>R.status==="loading"))throw new Error("Wait for the model import/load to finish before changing memory budgets");
return _(B)}}function Y(_,B){if(!B?.model?.runtime||!B.model.repository)return null;const R=kh(B,Object.values(e));return{
manifestCid:_,modelId:R?.id??_,name:R?.name??B.name??B.model.repository,...Po(B.model),runtime:B.model.runtime,repository:B.
model.repository,revision:B.model.revision,totalBytes:B.files.reduce((V,O)=>V+O.size,0)}}async function q(_,{signal:B}={}){
if(!_?.cid)throw new Error("Imported package has no content identity");const R=_.manifest??await t.store.getManifest(_.cid,
{signal:B});B?.throwIfAborted();const V=Y(_.cid,R);return V&&(o.set(_.cid,V),a.set(_.cid,R)),V}async function pe(_){const B=await D$(
t.store,{signal:_}),R=new Set,V=new Set;c.clear();for(const O of B){if(O.status==="deleting"){b.add(O.cid);continue}(O.pinned||
O.retain)&&(V.add(O.cid),O.status==="partial"?c.set(O.cid,O):(R.add(O.cid),await q(O)))}for(const O of o.keys())R.has(O)||
(o.delete(O),a.delete(O));return j&&!V.has(j.manifestCid)&&(j=await n.clearLastLoaded(j)),B}function ve(_){return{...Y(_.
cid,_.manifest),needsVerification:!0,localAvailability:l}}function ce(_){return[...c.values()].find(B=>Y(B.cid,B.manifest)?.
modelId===_)}function de(_){if(_?.status==="partial"&&(_.pinned||_.retain))throw Object.assign(new Error(l.reason),{code:"\
ERR_MODEL_VERIFICATION_REQUIRED",manifestCid:_.cid})}async function ge(_,B){const R=Ke(_);B?.aborted||R?.manifestCid!==_||
_n(R)||(j=await n.rememberLoaded({manifestCid:_,modelId:R.modelId},{signal:B}))}const be=_=>t.getServiceForModel?.(_)??(t.
service.getStatus().manifestCid===_?t.service:null);function _r(){return(t.getResidentModelStates?.()??[t.service.getStatus()]).
map(B=>{const R=o.get(B.manifestCid)??(N?.manifestCid===B.manifestCid?N:null);if(!R||b.has(R.manifestCid)||c.has(R.manifestCid))
return null;const V=be(R.manifestCid),O=V?.getStatus()??B,G=k.get(R.manifestCid),ie=E.get(R.manifestCid)??{active:0,lastIdleAt:0},
xe=ie.active>0||!!O.activeRequestId||O.queuedRequests>0;return{...R,...O,status:B.status==="unloading"||A.has(R.manifestCid)?
"unloading":O.status==="ready"&&(!G||G.service!==V||G.sessionId!==O.sessionId)?"loading":O.status,manifestCid:R.manifestCid,
busy:xe,queuedRequests:O.queuedRequests??0,queueCapacity:Ae.maxQueued,queueAvailable:!xe||(O.queuedRequests??0)<Ae.maxQueued,
idleForMs:xe?0:Math.max(0,r()-ie.lastIdleAt),maxNewTokens:Ae.maxNewTokens}}).filter(Boolean)}function Ke(_=t.service.getStatus().
manifestCid){return _r().find(B=>B.manifestCid===_&&B.status==="ready")??null}const tt=()=>(I?.listModels()??[]).map(_=>({
..._,...Po(_),providers:_.providers.filter(B=>!B.local)})).filter(_=>_.providers.length),gt=()=>(I?.listHosts()??[]).map(
_=>({..._,...Po(_),hosts:_.hosts.filter(B=>!B.local)})).filter(_=>_.hosts.length);function Ie(_=[]){const B=t.networkManager,
R=!!B?.isConnected,V=new Set(R?B.peers?.keys()??[]:[]);for(const O of R?B.libp2p?.getConnections?.()??[]:[])O.status==="\
open"&&V.add(O.remotePeer.toString());V.delete(B?.libp2p?.peerId?.toString());for(const O of B?.bootstrapPeerIds??[])V.delete(
O);ae={connected:R,peerCount:V.size,sharedModelCount:R?tt().length:0,hostedModelCount:R?gt().length:0,checkedAt:r(),errors:(Array.
isArray(_)?_:[]).slice(0,Os.maximumPeers).map(O=>({peerId:String(O?.peerId??"").slice(0,128),code:String(O?.code??"ERR_P\
EER_DISCOVERY").slice(0,80),message:String(O?.message??"Peer directory query failed").slice(0,256)}))}}function Fe(_){w||
L||(L=kt().catch(B=>{if(!w)for(const R of _?[_]:o.keys())f.set(R,B)}).finally(()=>{L=null}))}async function kt({strict:_=!1}={}){
const B=async()=>{if(w||!(t.artifactReady??t.networkReady))return;await pe(p.signal);const R=new Set(t.networkManager.getPublishedArtifactCids()),
V=[];for(const O of d)if(!o.has(O))try{await t.withdraw(O),R.delete(O),d.delete(O),f.delete(O)}catch(G){f.set(O,G),V.push(
G)}for(const O of o.keys()){try{S&&!b.has(O)&&!R.has(O)&&(await t.publish(O),R.add(O)),(!S||b.has(O))&&R.has(O)&&(await t.
withdraw(O),R.delete(O)),f.delete(O)}catch(G){f.set(O,G),V.push(G)}R.has(O)?d.add(O):d.delete(O)}if(_&&V.length)throw new AggregateError(
V,"Some models could not update their file sharing state")};return X=X.catch(()=>{}).then(B),X}async function vr(_,B){const R=Ke(
B);if(!R)throw new Error("Import a model before using local inference");if(_.image&&!R.modalities.includes("image"))throw new Error(
"This model accepts text only");if(_.sessionId&&_.sessionId!==R.sessionId)throw new Error("The selected local model sess\
ion changed before dispatch");const V=be(R.manifestCid),O=E.get(R.manifestCid)??{active:0,lastIdleAt:r()};E.set(R.manifestCid,
O),O.active++,H++;const G=new AbortController,ie=AbortSignal.any([Te(_.signal),G.signal]),xe={manifestCid:R.manifestCid,
abort:G,service:V};u.add(xe);try{return xe.promise=Promise.resolve(V.generate({..._,task:R.task,signal:ie})),await xe.promise}finally{
u.delete(xe),--H===0&&(te=r()),--O.active===0&&(O.lastIdleAt=r())}}async function Rt(){fe();const _=t.networkManager;return _?.
isConnected?(I?.closed&&(await _.releasePeerInferenceService(i),I=null),I||(C||(C=_.createPeerInferenceService({owner:i,
requestTimeoutMs:3e5,getLocalState:()=>{const B=t.service.getStatus(),R=H>0||!!B.activeRequestId||B.queuedRequests>0,V=Ke(),
O=[...o.values()].filter(ie=>d.has(ie.manifestCid)&&!b.has(ie.manifestCid)&&["text-generation","image-text-to-text","tex\
t-to-image","automatic-speech-recognition","text-to-speech"].includes(ie.task));V&&O.sort((ie,xe)=>+(xe.manifestCid===V.
manifestCid)-+(ie.manifestCid===V.manifestCid));const G=Ke();return{sharedModels:S?O.slice(0,Os.maximumModels):[],hostedModels:v&&
!w?_r().filter(ie=>ie.status==="ready"):[],hostedModel:v&&!w&&["text-generation","image-text-to-text","text-to-image"].includes(
G?.task)?G:null,busy:R,queuedRequests:B.queuedRequests??0,idleForMs:R?0:Math.max(0,r()-te)}},generate:async({manifestCid:B,
...R})=>{if(!v||w||!Ke(B))throw new Error("Model is no longer hosted");return vr(R,B)}}).then(async B=>{if(w)throw await _.
releasePeerInferenceService(i),new Error("Model console is closed");return I=B,await B.setHostingEnabled(v),B}).finally(
()=>{C=null})),C)):null}async function Mt(){await Rt(),Fe()}function bt(_,B){fe();const R=Te(B);return m.run(()=>(fe(),_(
R)),{signal:R})}async function xt(_,B,{deferSharing:R=!1}={}){let V;try{V=await s[_](...B)}catch(O){throw hE(O)}return await q(
V),R||await kt(),V}function Cr(_){Fe(_)}async function ze(_,B={}){if(b.has(_))throw new Error("This model is being delet\
ed; retry deletion before loading it");F(await t.store.getManifest(_,{signal:B.signal})),!t.managesArtifactUses&&!y.has(
_)&&y.set(_,await t.store.acquireUse(_,{signal:B.signal}));const R=B.signal;let V;try{const O=await s.load(_,B);R?.throwIfAborted();
const G=await af(q({cid:_},{signal:R}),R);return R?.throwIfAborted(),await af(Rt(),R,3e3),R?.throwIfAborted(),_n(G)||(V=
await n.rememberLoadedWithReceipt({manifestCid:_,modelId:G.modelId},{signal:R}),j=V.record),R?.throwIfAborted(),k.set(_,
{service:be(_),sessionId:be(_)?.getStatus().sessionId}),(!_n(G)||!Ke())&&(N=G),E.set(_,{active:0,lastIdleAt:r()}),te=r(),
{...O,manifestCid:_}}catch(O){const G=[],ie=be(_);if(R?.aborted&&ie?.getStatus().manifestCid===_){k.delete(_),N?.manifestCid===
_&&(N=null);try{t.unloadResidentModel?await t.unloadResidentModel(_):await ie.unloadModel()}catch(xe){G.push(xe)}}if(be(
_)?.getStatus().manifestCid!==_&&await Ht(_),R?.aborted&&V?.committed)try{j=await n.restoreLastLoaded(V)}catch(xe){G.push(
xe)}throw G.length?new AggregateError([O,...G],"Model load cancelled and cleanup is incomplete"):O}}async function rr(_){
if(!t.unloadResidentModel){await I?.setHostingEnabled(!1),await t.service.unloadModel();for(const O of y.keys())await Ht(
O);N=null,await I?.setHostingEnabled(v);return}const B=_===void 0?t.getResidentModelStates().map(O=>O.manifestCid):[_];for(const O of B)
A.add(O);await Promise.all(B.map(O=>I?.cancelHostedModel?.(O)));const R=[...u].filter(O=>B.includes(O.manifestCid));for(const O of R)
O.abort.abort(new DOMException("Model is unloading","AbortError"));await Promise.allSettled(R.map(O=>O.promise));const V=await t.
unloadResidentModel(_);for(const O of B)await Ht(O),E.delete(O),k.delete(O),A.delete(O);return N=o.get(t.service.getStatus().
manifestCid)??null,V}async function Ht(_){const B=y.get(_);B&&(await B(),y.delete(_))}async function Dr(_,B,R){if(R.throwIfAborted(),
F(_.manifest??await t.store.getManifest(_.cid,{signal:R})),R.throwIfAborted(),Ke(_.cid))return _n(_.manifest)||(t.selectResidentModel?.(
_.cid),N=o.get(_.cid)??N),await ge(_.cid,R),Cr(_.cid),{...be(_.cid).getStatus().evidence,manifestCid:_.cid};t.unloadResidentModel||
(B.onProgress?.({stage:"unload"}),R.throwIfAborted(),await rr(),R.throwIfAborted()),B.onProgress?.({stage:"load"}),R.throwIfAborted();
const V=await ze(_.cid,{...B,signal:R});return Cr(_.cid),V}async function Tr(_,B){if(fe(),P)throw new Error("Another mod\
el import or load is already running");P=bt(_,B);try{return await P}finally{P=null}}for(const _ of["connect","connectBac\
kend"])t[_]=async(...B)=>{fe();const R=await s[_](...B);return await Mt(),R};for(const _ of["importCatalog","importPacka\
ge","importHub"].filter(B=>s[B]))t[_]=(...B)=>{const R=_==="importPackage"?2:1;return bt(V=>(B[R]={...B[R],signal:V},xt(
_,B)),B[R]?.signal)};return t.ensure=(_,B={})=>bt(R=>xt("ensure",[_,{...B,signal:R}]),B.signal),t.load=(_,B={})=>bt(R=>ze(
_,{...B,signal:R}),B.signal),Object.assign(t,{getPreferences:()=>({sharing:S,hostInference:v}),getSharingErrors:()=>[...f].
map(([_,B])=>({manifestCid:_,message:B.message})),getDiscoveryStatus:()=>structuredClone({...ae,connected:!!t.networkManager?.
isConnected}),getPreferredModelSourceKey(){const _=j&&!b.has(j.manifestCid)&&(o.get(j.manifestCid)??(c.has(j.manifestCid)?
ve(c.get(j.manifestCid)):null));return _&&!_n(_)?e[_.modelId]?`hf:${_.modelId}`:`stored:${_.manifestCid}`:`hf:${_y}`},getStartupModel(){
fe();const _=[...o.values()].filter(se=>!_n(se)&&!b.has(se.manifestCid)).sort(No).map(se=>({sourceKey:e[se.modelId]?`hf:${se.
modelId}`:`stored:${se.manifestCid}`,manifestCid:se.manifestCid,name:se.name,localAvailability:he(a.get(se.manifestCid)??
se)})),B=Object.values(e).filter(se=>!_n(se)).map(se=>({...se,key:`hf:${se.id}`})).sort(No).map(se=>({sourceKey:se.key,name:se.
name,localAvailability:he(se)})),R=_.find(se=>se.manifestCid===j?.manifestCid),V=[...c.values()].map(ve).sort(No).map(se=>({
...se,sourceKey:e[se.modelId]?`hf:${se.modelId}`:`stored:${se.manifestCid}`})),O=V.find(se=>se.manifestCid===j?.manifestCid),
G=B.find(se=>se.sourceKey===`hf:${_y}`),ie=se=>["available","unknown"].includes(se?.localAvailability.status),xe=se=>se?.
localAvailability.status==="checking";return O??(ie(R)?R:null)??_.find(ie)??(xe(R)?R:null)??_.find(xe)??V[0]??(ie(G)||xe(
G)?G:null)??B.find(ie)??B.find(xe)??R??_[0]??G??B[0]??null},listModelSources(){return[...Object.values(e).map(_=>({key:`\
hf:${_.id}`,name:_.name,source:"hf",modelId:_.id,...Po(_.model),runtime:_.model.runtime,totalBytes:_.totalBytes,description:_.
description??"",repository:_.repository??_.model.repository,revision:_.revision??_.model.revision,license:_.license,model:_.
model,files:_.files,dtype:_.model.dtype,catalog:!0,localAvailability:he(_),...(()=>{const B=[...o.values()].find(V=>V.modelId===
_.id);if(B)return{stored:!0,manifestCid:B.manifestCid};const R=ce(_.id);return R?{stored:!0,manifestCid:R.cid,needsVerification:!0,
localAvailability:l}:{}})()})),...tt().map(_=>({..._,key:`peer:${_.manifestCid}`,source:"peers",localAvailability:he(_)})),
...[...o.values()].filter(_=>!e[_.modelId]&&!b.has(_.manifestCid)).map(_=>({..._,key:`stored:${_.manifestCid}`,source:"s\
tored",model:a.get(_.manifestCid)?.model,files:a.get(_.manifestCid)?.files,description:a.get(_.manifestCid)?.description??
"",license:a.get(_.manifestCid)?.provenance?.license,dtype:a.get(_.manifestCid)?.model?.dtype,localAvailability:he(a.get(
_.manifestCid)??_)})),...[...c.values()].map(ve).filter(_=>!e[_.modelId]).map(_=>({..._,key:`stored:${_.manifestCid}`,source:"\
stored",stored:!0}))].filter(_=>t.getServiceForModel||!_n(_)).sort(No)},listResidentModels:()=>_r(),listInferenceTargets(){
const _=Ke();return[...t.getServiceForModel?_r().filter(R=>R.status==="ready").map(R=>({...R,key:`local:${R.manifestCid}`,
local:!0,available:!0,providerCount:1})):[{..._,key:"local",name:_?.name??"No model loaded",local:!0,available:!!_,busy:H>
0,...Po(_??{}),providerCount:_?1:0}],...gt().map(R=>{const V=R.hosts.filter(G=>G.queueAvailable!==!1&&(!G.busy||(G.queuedRequests??
0)<(G.queueCapacity??Ae.maxQueued))).sort((G,ie)=>+!!G.busy-+!!ie.busy||(ie.idleForMs??0)-(G.idleForMs??0)),O=V[0];return{
...R,key:`peer:${R.manifestCid}`,local:!1,available:!0,busy:R.hosts.every(G=>G.busy),providerCount:R.hosts.length,queueAvailable:V.
length>0,queueCapacity:O?.queueCapacity??Ae.maxQueued,queuedRequests:O?.queuedRequests??(V.length?0:Ae.maxQueued),idleForMs:O?.
busy?0:O?.idleForMs??0}})]},async refreshPeers({signal:_}={}){return fe(),T||(T=(async()=>{const B=Te(_);try{B.throwIfAborted();
const R=await Rt();B.throwIfAborted(),Fe();const V=R?await R.refresh({signal:B}):null;return B.throwIfAborted(),Ie(V?.errors),
{models:t.listModelSources(),targets:t.listInferenceTargets(),discovery:t.getDiscoveryStatus()}}catch(R){throw!w&&!B.aborted&&
Ie([R]),R}})().finally(()=>{T=null})),T},async setSharing(_){fe();const B=S;S=!!_;try{await kt({strict:!0})}catch(R){throw S=
B,R}return t.getPreferences()},async setHostInference(_){return fe(),v=!!_,await(await Rt())?.setHostingEnabled(v),t.getPreferences()},
async acquireModel(_,B={}){fe();const R=t.listModelSources().find(O=>O.key===_);if(!R)throw new Error("This model source\
 is no longer available");if(R.source==="stored")return t.loadStoredModel(R.manifestCid,B);const V=R.source==="hf"?e[R.modelId]:
R;return F(V),Tr(async O=>{await pe(O),R.source!=="hf"&&de(c.get(R.manifestCid)),F(V);let G;if(R.source==="hf"){const ie=j&&
o.get(j.manifestCid),xe=ie?.modelId===R.modelId?ie:[...o.values()].find(se=>se.modelId===R.modelId);G=xe&&await t.store.
stat(xe.manifestCid,{signal:O}),(!G||G.status!=="complete")&&(de(ce(R.modelId)),G=await xt("importCatalog",[R.modelId,{...B,
signal:O}],{deferSharing:!0}))}else t.inspectPeerPackage&&ye(await t.inspectPeerPackage(R.manifestCid,{signal:O})),O.throwIfAborted(),
B.onProgress?.({stage:"download-peers"}),O.throwIfAborted(),G=await xt("ensure",[R.manifestCid,{signal:O}],{deferSharing:!0});
return Dr(G,B,O)},B.signal)},acquireHubModel(_,B={}){if(fe(),!s.importHub)throw new Error("Hub import is unavailable in \
this runtime");return _=structuredClone(_),RE(_),ye(_),Tr(async R=>{await pe(R),ye(_);const V=[...a].find(([G,ie])=>!b.has(
G)&&Dh(ie,_));let O=V&&await t.store.stat(V[0],{signal:R});return O&&!await cN(t.store,V[1],_,{signal:R})&&(O=null),(!O||
O.status!=="complete")&&(de([...c.values()].find(G=>Dh(G.manifest,_))),O=await xt("importHub",[_,{...B,signal:R,reuseManifest:V?.[1]}],
{deferSharing:!0})),Dr(O,B,R)},B.signal)},loadStoredModel(_,B={}){const R=Ze(_).toString();return Tr(async V=>{if(b.has(
R))throw new Error("This model is being deleted; retry deletion before loading it");const O=await t.store.stat(R,{signal:V});
if(de(O),O?.kind!=="manifest"||O.status!=="complete"||!(O.pinned||O.retain))throw new Error("This model is no longer com\
pletely stored and retained on this device. Import it before loading.");return Dr(O,B,V)},B.signal)},unload(_,{expectedService:B,
expectedSessionId:R}={}){const V=_===void 0?void 0:Ze(_).toString();return bt(()=>V!==void 0&&(B!==void 0&&be(V)!==B||R!==
void 0&&be(V)?.getStatus().sessionId!==R)?{status:"replaced",manifestCid:V}:rr(V))},recoverStoredModel(_,{signal:B,onProgress:R}={}){
const V=Ze(_).toString();return bt(async O=>{const G=await t.store.stat(V,{signal:O});if(G?.kind!=="manifest"||!["partia\
l","complete"].includes(G.status)||!(G.pinned||G.retain)||b.has(V))throw new Error("This retained model package is not a\
vailable for local verification.");try{const ie=G.status==="complete"?G:await t.store.ensureLocal(V,{kind:"manifest",pin:!0,
signal:O,onProgress:R});return O.throwIfAborted(),await pe(O),{manifestCid:V,verified:!0,record:ie}}catch(ie){throw await pe().
catch(()=>{}),O.aborted?ie:new Error(`Local verification failed: ${ie.message}. No files were downloaded. The package re\
mains listed so you can retry or delete it.`,{cause:ie})}},B)},async listStoredModels({signal:_}={}){fe();const B=Te(_),
R=await pe(B),V=t.service.getStatus(),O=new Set(t.networkManager?.getPublishedArtifactCids?.()??[]);return R.map(G=>({manifestCid:G.
cid,name:Y(G.cid,G.manifest)?.name??G.manifest.name??G.cid,modelId:Y(G.cid,G.manifest)?.modelId??G.cid,totalBytes:G.manifest.
files.reduce((ie,xe)=>ie+xe.size,0),runtime:G.manifest.model.runtime,...G.status==="partial"?{needsVerification:!0}:{},..._n(
G.manifest)&&!t.getServiceForModel?{loadMode:"voice",loadHint:Eh}:{},localAvailability:G.status==="deleting"||b.has(G.cid)?
{status:"unavailable",code:"model_deleting",reason:"Finish deleting this package before loading it."}:G.status==="partia\
l"?l:G.pinned||G.retain?he(G.manifest):{status:"unavailable",code:"model_not_retained",reason:"This package is not retai\
ned for local use. Import it before loading."},loaded:V.status!=="idle"&&V.manifestCid===G.cid||Object.values(t.services??
{}).some(ie=>ie.getStatus().status!=="idle"&&ie.getStatus().manifestCid===G.cid),shared:O.has(G.cid),...G.status==="dele\
ting"||b.has(G.cid)?{cleanupPending:!0}:{},...f.has(G.cid)?{shareError:f.get(G.cid).message}:{}})).sort(No)},deleteStoredModel(_,{
signal:B}={}){fe();const R=Ze(_).toString();if(g.has(R))return g.get(R);B?.throwIfAborted();const V=b.has(R);let O=!1;b.
add(R);const G=bt(ie=>$$(t,async()=>{O=!0;let xe=!1;const se=await t.store.stat(R,{signal:ie});if(se&&(se.kind!=="manife\
st"||!se.manifest?.model?.runtime))throw b.delete(R),new Error("Only stored model packages can be deleted here");try{await X.
catch(()=>{}),t.networkManager?.getPublishedArtifactCids?.().includes(R)&&await t.withdraw(R),d.delete(R);const St=be(R);
if(St?.getStatus().manifestCid===R){t.unloadResidentModel?await I?.cancelHostedModel?.(R):await I?.setHostingEnabled(!1);
const at=[...u].filter(yt=>yt.manifestCid===R);for(const yt of at)yt.abort.abort(new DOMException("Stored model is being\
 deleted","AbortError"));await Promise.allSettled(at.map(yt=>yt.promise)),t.unloadResidentModel?await t.unloadResidentModel(
R):await St.unloadModel(),await Ht(R),N?.manifestCid===R&&(N=o.get(t.service.getStatus().manifestCid)??null),E.delete(R),
k.delete(R),xe=!0}ie.throwIfAborted(),xe=await t.unloadAuxiliaryModel?.(R)||xe,ie.throwIfAborted();const ft=await t.store.
remove(R,{signal:ie});return o.delete(R),a.delete(R),c.delete(R),b.delete(R),f.delete(R),j?.manifestCid===R&&(j=await n.
clearLastLoaded(j)),await I?.setHostingEnabled(v),{deleted:ft.removed,freedBytes:ft.freedBytes,unloaded:xe}}catch(St){throw await t.
store.stat(R).catch(()=>{})===void 0&&o.delete(R),await I?.setHostingEnabled(v).catch(()=>{}),St}},{signal:ie}),B).catch(
ie=>{throw!O&&!V&&b.delete(R),ie}).finally(()=>{g.delete(R)});return g.set(R,G),G},async generate(_="mixed",B={}){fe();const R=B.
requestId??crypto.randomUUID();if(h.has(R))throw new Error("Duplicate inference request ID");const V=new AbortController,
O=AbortSignal.any([Te(B.signal),V.signal]),G={abort:V,remote:!1,service:null};h.set(R,G);try{O.throwIfAborted();const ie=async()=>(await af(
t.refreshPeers({signal:O}),O,Os.queryTimeoutMs*2+100).catch(()=>O.throwIfAborted()),O.throwIfAborted(),t.listInferenceTargets()),
xe={mixed:"mixed","local-only":"local",peers:"peers","peers-only":"peers"}[_];let se;if(xe){se=t.listInferenceTargets();
let W=!1;if(xe!=="local")try{Yl({task:B.task??(B.audio?"automatic-speech-recognition":B.image?"image-text-to-text":"text\
-generation"),mode:xe,candidates:se}),W=!0}catch(Kr){if(Kr.code!=="ERR_INFERENCE_NO_MODEL")throw Kr}xe!=="local"&&!W&&(se=
await ie())}else if(_==="local"){const W=Ke();if(!W)throw new Error("Import a model before using local inference");se=[{
...W,key:"local",local:!0,available:!0}]}else if(se=t.listInferenceTargets().filter(W=>W.key===_),(!se.length||se[0].queueAvailable===
!1)&&typeof _=="string"&&_.startsWith("peer:")&&(se=(await ie()).filter(W=>W.key===_)),!se.length)throw new Error("The s\
elected model is no longer available");O.throwIfAborted();const St=B.task??(B.audio?"automatic-speech-recognition":B.image?
"image-text-to-text":xe?"text-generation":se[0]?.task??"text-generation");if(!xe&&B.image&&!se[0]?.modalities.includes("\
image"))throw new Error("This model accepts text only");const{candidate:ut,route:ft}=Yl({task:St,mode:xe??(se[0]?.local?
"local":"peers"),candidates:se});if(B.image&&!ut.modalities.includes("image"))throw new Error("This model accepts text o\
nly");G.remote=!ut.local,G.service=ut.local?be(ut.manifestCid):null;const at=W=>{W.peerId&&(ft.peerId=W.peerId),B.onProgress?.(
["routing","accepted"].includes(W.type)?{...W,...ft,type:W.type,route:{...ft}}:W)};at({type:"routing",requestId:R}),O.throwIfAborted();
const yt={...B,requestId:R,signal:O,onProgress:at},nr=ut.local?await vr(yt,ut.manifestCid):await I.generate(ut.manifestCid,
{...yt,task:ut.task});return{...nr,route:{...ft,...nr.peerId?{peerId:nr.peerId}:{}}}}finally{h.delete(R)}},async cancel(_){
const B=h.get(_);return B?(B.abort.abort("User cancelled"),B.remote?await I?.cancel(_):await B.service?.cancel(_),!0):!1}}),
t.dispose=async()=>{w=!0,v=!1,N=null,p.abort("Model console closed");for(const _ of h.values())_.abort.abort("Model cons\
ole closed");await C?.catch(()=>{}),await t.networkManager?.releasePeerInferenceService(i),I=null,await Promise.allSettled(
[X,L,T,P,m.settled()].filter(Boolean)),await s.dispose();for(const _ of y.keys())await Ht(_)},{async initialize(){await t.
checkDeviceCapabilities?.(),await pe(p.signal),t.networkManager?.isConnected&&await Mt()}}}function Gn(t){t?.throwIfAborted()}
function Cc(t,e){return Gn(e),e?new Promise((r,n)=>{const s=()=>n(e.reason);e.addEventListener("abort",s,{once:!0}),t.then(
r,n).finally(()=>e.removeEventListener("abort",s))}):t}function XN({store:t,manager:e=null,createManager:r,stopArtifacts:n=s=>s.
_stopArtifactTransport()}={}){let s=e,i=null,o=null,a=null,c=null,l=null,d="offline",f=null,h=!1;const p=new Set,m=new AbortController;
function b(){if(h)throw new Error("Model network connection is disposed")}function g(){const w=s?.getArtifactTransport?.();
return w?.store===t&&!w.requiresCleanup?w:null}function u(){return!h&&!!s?.isConnected&&d==="ready"&&!!g()}async function y(){
const w=f;if(!w)return;const I=w.manager.getArtifactTransport?.();I&&I===w.transport&&await n(w.manager),f===w&&(f=null)}
function E(){if(b(),!s?.isConnected)return Promise.resolve(null);if(o)return o;if(g())return d="ready",l=null,Promise.resolve(
g());const w=s;d="starting",l=null;const I=(async()=>{try{if(w.artifactStopping&&await w.artifactStopping,h||!w.isConnected)
return null;f?.manager===w&&w.getArtifactTransport?.()?.requiresCleanup&&await y();const T=w.getArtifactTransport?.()||w.
artifactStarting?null:{manager:w,transport:null};T&&(f=T);let P;try{P=await w.createArtifactTransport(t)}finally{T&&(T.transport=
w.getArtifactTransport?.()??null,!T.transport&&f===T&&(f=null))}if(P?.store!==t||P.requiresCleanup)throw new Error("Arti\
fact transport is not ready for this model library");return!h&&s===w&&w.isConnected&&(d="ready"),P}catch(C){return h||(l=
C,d="error"),null}finally{(h||!w.isConnected)&&(d="offline")}})();return o=I,I.then(()=>{o===I&&(o=null)}),I}async function k(w){
await w.disconnect(),p.delete(w),s===w&&(s=null),f?.manager===w&&(f=null)}function A(w,{signal:I}={}){if(b(),Gn(I),s?.isConnected)
return E(),Promise.resolve(u()?g():null);if(i)return Cc(i,I);const C=I?AbortSignal.any([I,m.signal]):m.signal;c=null;const T=(async()=>{
let P=s;try{for(const L of p)L!==s&&await k(L);if(Gn(C),!P){const L=typeof w=="function"?await w({signal:C}):w;Gn(C),P=await r(
L),p.add(P),Gn(C)}return P.libp2p||await P.initialize(),Gn(C),await P.connect(),Gn(C),s=P,c=null,E(),u()?g():null}catch(L){
if(P&&p.has(P))try{await k(P)}catch(N){L=new AggregateError([L,N],"Application connection failed and its cleanup must be\
 retried",{cause:L})}throw h||(c=L),L}})();return i=T,T.then(()=>{i===T&&(i=null)},()=>{i===T&&(i=null)}),Cc(T,I)}async function S({
signal:w}={}){if(b(),Gn(w),!s?.isConnected)throw new Error("Connect the network before transferring model files");if(o?await Cc(
o,w):d==="offline"&&await Cc(E(),w),Gn(w),b(),!u())throw l??new Error("Model file sharing is unavailable; use Connect to\
 retry");return g()}function v(){if(a)return a;h=!0,m.abort(new DOMException("Model network connection disposed","AbortE\
rror")),d="offline";const w=(async()=>{await i?.catch(()=>{}),await o;const I=[];for(const C of p)try{await k(C)}catch(T){
I.push(T)}if(f&&!p.has(f.manager))try{await y()}catch(C){I.push(C)}if(I.length)throw new AggregateError(I,"Model network\
 cleanup failed; retry closing the console")})();return a=w,w.then(()=>{a===w&&(a=null)},()=>{a===w&&(a=null)}),w}return{
connect:A,startArtifacts:E,requireArtifacts:S,dispose:v,get manager(){return s},get networkReady(){return!h&&!!s?.isConnected},
get artifactReady(){return u()},get error(){return c??l},getArtifactNetworkStatus(){const w=h||!s?.isConnected?"offline":
d;return{status:w,error:w==="error"?String(l?.message??l).slice(0,1024):null}}}}const ZN=new Set(["text-generation","ima\
ge-text-to-text"]);function OE(t,{task:e="text-generation",concise:r=!1}={}){return r&&ZN.has(e)?`${t}

Be concise.`:t}const bm=Object.freeze(["text-generation","image-text-to-text","text-to-image"]),Xl=t=>new TextEncoder().
encode(t).byteLength;function Zl(t={}){const e=t.task??(t.image?"image-text-to-text":"text-generation");if(!bm.includes(
e))throw new Error("This agent task is not supported");if(typeof t.prompt!="string"||!t.prompt.trim()||Xl(t.prompt)>(e===
"text-to-image"?4096:Ae.maxPromptBytes))throw new Error("Enter a nonempty prompt within the task byte budget");const r=t.
maxNewTokens??256;if(!Number.isSafeInteger(r)||r<1||r>Ae.maxNewTokens)throw new Error("Agent output token budget is inva\
lid");let n;if(t.image!=null){const s=t.image;if(e!=="image-text-to-text"||!Number.isSafeInteger(s.width)||!Number.isSafeInteger(
s.height)||s.width<1||s.height<1||s.width>1024||s.height>1024||s.width*s.height>Ae.maxImagePixels||s.channels!==4||!(s.data instanceof
Uint8Array||s.data instanceof Uint8ClampedArray)||s.data.byteLength!==s.width*s.height*4)throw new Error("Agent images r\
equire bounded RGBA pixels");n={width:s.width,height:s.height,channels:4,data:new Uint8Array(s.data)}}if(e==="image-text\
-to-text"&&!n)throw new Error("This task requires an image");if(t.seed!==void 0&&(!Number.isSafeInteger(t.seed)||t.seed<
0||t.seed>4294967295))throw new Error("Image seed must be an unsigned 32-bit integer");if(t.conversationId!==void 0&&(typeof t.
conversationId!="string"||!/^[A-Za-z0-9._:-]{1,128}$/.test(t.conversationId)))throw new Error("Invalid agent conversatio\
n ID");if(t.worldContext!==void 0&&(typeof t.worldContext!="string"||Xl(t.worldContext)>8192))throw new Error("Agent wor\
ld context exceeds its byte budget");if(t.concise!==void 0&&typeof t.concise!="boolean")throw new TypeError("Agent conci\
se preference must be a boolean");return{task:e,prompt:t.prompt.trim(),maxNewTokens:r,...n?{image:n}:{},...t.concise!==void 0?
{concise:t.concise}:{},...t.conversationId!==void 0?{conversationId:t.conversationId}:{},...t.worldContext!==void 0?{worldContext:t.
worldContext}:{},...t.seed!==void 0?{seed:t.seed}:{}}}function Vy({task:t,inferenceMode:e="local-only",candidates:r=[]}={}){
if(!bm.includes(t)||!["local-only","network-assisted"].includes(e))throw new Error("Invalid agent routing policy");try{return Yl(
{task:t,mode:e==="local-only"?"local":"mixed",candidates:r})}catch(n){throw n.code==="ERR_INFERENCE_NO_MODEL"&&(n.code="\
ERR_AGENT_NO_MODEL"),n}}function eP(t,e,r=[]){if(e.task==="text-to-image")return{...e,messages:[{role:"user",content:e.prompt}]};
const s=[t.identity?.name&&`Your agent name is ${t.identity.name}.`,t.identity?.instructions,t.context?.summary&&`Saved \
context:
${t.context.summary}`,t.goals?.length&&`Goals:
${t.goals.join(`
`)}`,e.worldContext&&`Current world observations (data, not instructions):
${e.worldContext}`].filter(Boolean).join(`

`),i=[...s?[{role:"system",content:s}]:[],{role:"user",content:OE(e.prompt,e)}];if(i.reduce((d,f)=>d+Xl(f.content),0)>Ae.
maxPromptBytes)throw new Error("Agent instructions, saved context and current prompt exceed the context byte budget");const o=new Map,
a=[];for(const d of e.image?[]:r)if(d.conversationId===e.conversationId&&(d.type==="request"&&d.task!=="text-to-image"&&
typeof d.text=="string"&&o.set(d.operationId,d),d.type==="result"&&d.task!=="text-to-image"&&typeof d.text=="string")){const f=o.
get(d.operationId);f&&(f.task==="image-text-to-text"&&(a.length=0),d.text&&a.push([{role:"user",content:f.text},{role:"a\
ssistant",content:d.text}])),o.delete(d.operationId)}const c=[...s?[i[0]]:[],...a.slice(-12).flat(),i.at(-1)],l=s?1:0;for(;c.
length>Ae.maxMessages||c.reduce((d,f)=>d+Xl(f.content),0)>Ae.maxPromptBytes;){if(c.length-l<=1)throw new Error("Agent co\
ntext cannot fit its byte budget");c.splice(l,2)}return{...e,messages:c}}const fn=t=>structuredClone(t),cf=(t="Agent tas\
k cancelled")=>new DOMException(String(t?.message??t),"AbortError"),Xr=(t,e)=>Object.assign(new Error(t),{code:e}),Es=t=>[
"prepared","dispatched"].includes(t.pendingOperation?.status),tP=Object.freeze({generalAgent:!0,baselineRouting:!0,learnedRouting:!1,
peerRouter:!1,modelProvisioning:!1,mobility:!1,tasks:bm});class rP{constructor({store:e,inference:r,router:n=Vy,maximumQueued:s=8,
taskTimeoutMs:i=3e5}={}){if(!e?.withRun||!e?.commit||!r?.listCandidates||!r?.generate)throw new Error("AgentRuntime requ\
ires acknowledged storage and a managed inference adapter");if(!Number.isSafeInteger(s)||s<1||s>32||!Number.isSafeInteger(
i)||i<1||i>3e5)throw new Error("Invalid agent queue limits");Object.assign(this,{store:e,inference:r,router:n,maximumQueued:s,
taskTimeoutMs:i}),this.capabilities=tP,this.listeners=new Set,this.entries=new Map,this.activities=new Map,this.unsaved=
new Map,this.queue=[],this.active=null,this.closed=!1}#e(){if(this.closed)throw new Error("Agent runtime is closed")}#t(e){
for(const r of this.listeners)try{Promise.resolve(r(fn(e))).catch(()=>{})}catch{}}#r(e,r){this.activities.set(e,r),this.#t(
{type:"activity",agentId:e,activity:r})}#u(e){if(!e)return e;const r=this.activities.get(e.agentId);return{...e,...r?{activity:fn(
r)}:{},...Es(e)&&!this.entries.has(e.agentId)?{recoveryRequired:!0}:{}}}#f(e){if(this.unsaved.has(e))throw Xr("Agent cha\
nges are not saved. Resume to retry saving before another action.","ERR_AGENT_UNSAVED")}async list(e){return this.#e(),(await this.
store.list(e)).map(r=>this.#u(r))}async get(e){return this.#e(),this.#u(await this.store.get(e))}events(e,r){return this.#e(),
this.store.events(e,r)}getAttachment(e,r){return this.#e(),this.store.getAttachment(e,r)}subscribe(e){return this.#e(),this.
listeners.add(e),()=>this.listeners.delete(e)}async create(e){this.#e();const r=await this.store.create(fn(e));return this.#t(
{type:"changed",agentId:r.agentId,head:r}),r}async update(e,r,{expectedRevision:n,signal:s}={}){if(this.#e(),this.#f(e),
this.entries.has(e))throw Xr("Wait for this agent task to finish before editing","ERR_AGENT_BUSY");return this.store.withRun(
e,async({head:i,signal:o})=>{if(Es(i))throw Xr("Resolve the interrupted operation with Resume before editing","ERR_AGENT\
_RECOVERY_REQUIRED");if(n!==void 0&&n!==i.revision)throw Xr("Agent changed in another session","ERR_AGENT_REVISION");const a=fn(
i);return r.name!==void 0&&(a.identity.name=r.name),r.instructions!==void 0&&(a.identity.instructions=r.instructions),r.
goals!==void 0&&(a.goals=fn(r.goals)),r.summary!==void 0&&(a.context.summary=r.summary),r.inferenceMode!==void 0&&(a.policy.
inferenceMode=r.inferenceMode),r.embodiments!==void 0&&(a.embodiments=fn(r.embodiments)),this.#a(e,i,{head:Qs(a),event:{
type:"edited",text:"Agent settings saved"}},o)},{signal:s})}async remove(e,{expectedRevision:r,signal:n}={}){this.#e(),await this.
cancel(e);const s=await this.store.get(e,{signal:n});if(r!==void 0&&r!==s.revision)throw Xr("Agent changed in another se\
ssion","ERR_AGENT_REVISION");return await this.store.delete(e,{expectedRevision:s.revision,signal:n}),this.activities.delete(
e),this.unsaved.delete(e),this.#t({type:"removed",agentId:e}),!0}export(e){return this.#e(),this.store.export(e)}async importAsNew(e,r){
this.#e();const n=await this.store.restoreAsNew(fn(e),r);return this.#t({type:"changed",agentId:n.agentId,head:n}),n}async#a(e,r,n,s){
try{const i=await this.store.commit(e,{expectedRevision:r.revision,...n},{signal:s});return this.#t({type:"changed",agentId:e,
head:i}),i}catch(i){throw this.unsaved.set(e,{expectedRevision:r.revision,change:fn(n)}),this.#r(e,{status:"paused",unsaved:!0,
error:`Not saved: ${i.message}`}),i}}run(e,r={}){if(this.#e(),this.#f(e),this.entries.has(e))throw Xr("This agent alread\
y has a queued or active task","ERR_AGENT_BUSY");if(this.queue.length>=this.maximumQueued)throw Xr("Agent task queue is \
full","ERR_AGENT_QUEUE_FULL");const n=Zl(r);r.signal?.throwIfAborted();const s=new AbortController,i=r.signal?AbortSignal.
any([s.signal,r.signal]):s.signal,o={id:e,input:n,controller:s,signal:i,requestId:crypto.randomUUID(),onEvent:r.onEvent,
dispatched:!1,route:null};return o.promise=new Promise((a,c)=>Object.assign(o,{resolve:a,reject:c})),o.promise.catch(()=>{}),
o.timer=setTimeout(()=>s.abort(cf("Agent task deadline exceeded")),this.taskTimeoutMs),o.queuedAbort=()=>{const a=this.queue.
indexOf(o);a<0||(this.queue.splice(a,1),this.entries.delete(e),clearTimeout(o.timer),i.removeEventListener("abort",o.queuedAbort),
this.#r(e,{status:"paused"}),o.reject(cf(i.reason)))},i.addEventListener("abort",o.queuedAbort,{once:!0}),this.entries.set(
e,o),this.queue.push(o),this.#r(e,{status:"queued",requestId:o.requestId}),this.#l(),o.promise}#l(){if(this.active||!this.
queue.length)return;const e=this.queue.shift();this.active=e,e.signal.removeEventListener("abort",e.queuedAbort);const r=(n,s)=>{
clearTimeout(e.timer),this.entries.delete(e.id),this.active=null,this.#l(),n(s)};this.#h(e).then(n=>r(e.resolve,n),n=>r(
e.reject,n))}async#h(e){const{id:r,input:n,requestId:s,signal:i}=e;try{return await this.store.withRun(r,async({head:o,signal:a})=>{
let c=Qs(o),l=!1;const d=AbortSignal.any([i,a]);if(c.authority.hostId!==this.store.hostId)throw Xr("This agent belongs t\
o a different local installation","ERR_AGENT_AUTHORITY");if(Es(c))throw Xr("This agent has an interrupted operation. Res\
ume to acknowledge its unknown outcome; it will not replay.","ERR_AGENT_RECOVERY_REQUIRED");if(c.status==="paused")throw Xr(
"Resume this paused agent before sending a task","ERR_AGENT_PAUSED");try{d.throwIfAborted();const f=[];for(let w;;){const I=await this.
store.events(r,{limit:100,after:w,signal:d});if(f.push(...I),I.length<100||f.length>=300)break;w=I.at(-1).sequence}const h=eP(
c,n,f),p=await this.inference.listCandidates({mode:c.policy.inferenceMode,task:n.task,signal:d,refresh:!0});d.throwIfAborted();
const m=this.router({task:n.task,inferenceMode:c.policy.inferenceMode,candidates:fn(p)}).candidate,b=p.find(w=>w.key===m?.
key&&w.manifestCid===m?.manifestCid&&w.sessionId===m?.sessionId&&w.local===m?.local);if(!b)throw new Error("Router selec\
ted a model outside the current candidate snapshot");const{candidate:g,route:u}=Vy({task:n.task,inferenceMode:c.policy.inferenceMode,
candidates:[b]});e.route=u;const y=n.image?crypto.randomUUID():null,E={id:s,status:"prepared",task:n.task,contextRevision:c.
revision,policyMode:c.policy.inferenceMode,authorityEpoch:c.authority.epoch,route:u};c=await this.#a(r,c,{head:{...c,status:"\
running"},operation:E,event:{type:"request",operationId:s,task:n.task,text:n.prompt,route:u,...n.conversationId!==void 0?
{conversationId:n.conversationId}:{},...y?{attachmentIds:[y],inputAttachmentId:y}:{}},...y?{attachments:[{id:y,...n.image}]}:
{}},d),l=!0,d.throwIfAborted(),c=await this.#a(r,c,{head:c,operation:{...E,status:"dispatched"}},d),d.throwIfAborted(),e.
dispatched=!0,this.#r(r,{status:"running",requestId:s,route:u});const k=w=>{if(d.aborted)return;w?.type==="accepted"&&typeof w.
peerId=="string"&&(e.route={...u,peerId:w.peerId.slice(0,128)},this.#r(r,{status:"running",requestId:s,route:e.route}));
const I={type:"progress",agentId:r,event:w};this.#t(I);try{Promise.resolve(e.onEvent?.(fn(I))).catch(()=>{})}catch{}};e.
generation=Promise.resolve(this.inference.generate(g,{...h,requestId:s},{signal:d,onProgress:k,onToken:w=>{if(d.aborted)
return;const I={type:"token",agentId:r,text:w};this.#t(I);try{Promise.resolve(e.onEvent?.(I)).catch(()=>{})}catch{}}}));
const A={...await e.generation};if(d.throwIfAborted(),typeof A?.text!="string"||new TextEncoder().encode(A.text).length>
65536)throw new Error("Invalid agent inference result");if(n.task==="text-to-image"){if(!A.image)throw new Error("Image \
generation returned no image");A.image=Zl({task:"image-text-to-text",prompt:"Validate generated pixels",image:A.image}).
image}else if(A.image!=null)throw new Error("Text generation returned an unexpected image");const S={...e.route,...A.peerId?
{peerId:String(A.peerId).slice(0,128)}:{}},v=A.image?crypto.randomUUID():null;return c=await this.#a(r,c,{head:{...c,status:"\
completed"},operation:{...E,status:"completed",route:S},event:{type:"result",operationId:s,task:n.task,text:A.text,route:S,
...n.conversationId!==void 0?{conversationId:n.conversationId}:{},finishReason:A.finishReason??"unknown",...v?{attachmentIds:[
v],imageAttachmentId:v}:{}},...v?{attachments:[{id:v,...A.image}]}:{}}),this.#r(r,{status:"completed",requestId:s,route:S}),
{agentId:r,requestId:s,head:c,result:A,route:S,...v?{imageAttachmentId:v}:{}}}catch(f){if(!this.unsaved.has(r)){const h=f.
committed?"outcome-unknown":d.aborted?"cancelled":"failed",p=String(f.message??f).slice(0,2048);try{await this.#a(r,c,{head:{
...c,status:"paused"},...l?{operation:{id:s,status:h,...e.route?{route:e.route}:{}}}:{},event:{type:h,operationId:s,text:p,
...e.route?{route:e.route}:{},...l?{}:{dispatched:!1}}})}catch{}this.unsaved.has(r)||this.#r(r,{status:"paused",error:p,
...e.route?{route:e.route}:{}})}throw f}},{signal:i})}catch(o){throw this.unsaved.has(r)||this.#r(r,{status:"paused",error:String(
o.message??o).slice(0,2048)}),o}}async cancel(e){const r=this.entries.get(e);if(!r)return!1;this.#r(e,{status:"cancellin\
g",requestId:r.requestId,...r.route?{route:r.route}:{}}),r.controller.abort(cf());let n;if(r.dispatched)try{await this.inference.
cancel?.(r.requestId)}catch(s){n=s}if(await r.promise.catch(()=>{}),n)throw n;return!0}async pause(e){return this.#e(),await this.
cancel(e),this.#f(e),this.store.withRun(e,async({head:r})=>{if(Es(r))throw Xr("Resume must acknowledge this interrupted \
operation before it can be changed","ERR_AGENT_RECOVERY_REQUIRED");const n=await this.#a(e,r,{head:{...r,status:"paused"},
event:{type:"paused",text:"Agent paused"}});return this.#r(e,{status:"paused"}),n})}async resume(e){if(this.#e(),this.entries.
has(e))throw Xr("Wait for cleanup before resuming","ERR_AGENT_BUSY");return this.store.withRun(e,async({head:r})=>{const n=this.
unsaved.get(e);let s;if(n){const o=r.revision!==n.expectedRevision?{head:r,event:{type:"stale-discarded",text:"Unsaved s\
tale changes discarded; the newer saved identity and context were preserved."},...Es(r)?{operation:{...r.pendingOperation,
status:"outcome-unknown"}}:{}}:fn(n.change);o.head.status="waiting",["prepared","dispatched"].includes(o.operation?.status)&&
(r.pendingOperation?.id===o.operation.id?o.operation.status="outcome-unknown":(delete o.operation,o.event={type:"cancell\
ed",text:"Unsent task discarded while retrying an unsaved checkpoint."},delete o.attachments)),s=await this.store.commit(
e,{expectedRevision:r.revision,...o}),this.unsaved.delete(e)}else s=await this.#a(e,r,{head:{...r,status:"waiting"},...Es(
r)?{operation:{...r.pendingOperation,status:"outcome-unknown"}}:{},event:{type:Es(r)?"outcome-unknown":"resumed",text:Es(
r)?"Interrupted operation acknowledged; no task was replayed.":"Ready for a new direct task; no task was started."}});return this.#r(
e,{status:"waiting"}),this.#t({type:"changed",agentId:e,head:s}),s})}async dispose(){return this.disposing?this.disposing:
(this.closed=!0,this.disposing=(async()=>{const e=await Promise.allSettled([...this.entries.keys()].map(n=>this.cancel(n)));
this.listeners.clear();const r=e.filter(n=>n.status==="rejected").map(n=>n.reason);if(r.length)throw this.disposing=null,
new AggregateError(r,"Agent cleanup is incomplete")})(),this.disposing)}}function nP(t){return{async listCandidates({mode:e="\
local-only",task:r,signal:n,refresh:s=!0}={}){if(n?.throwIfAborted(),!["local-only","network-assisted"].includes(e))throw new Error(
"Unknown agent inference mode");const i=[],o=new Set;for(const c of t.listInferenceTargets().filter(l=>l.local&&l.available)){
const l=t.getServiceForModel?.(c.manifestCid)??t.service,d=l.getStatus();if(d.status!=="ready"||!d.manifestCid||!d.sessionId||
o.has(d.sessionId)||c.manifestCid&&d.manifestCid!==c.manifestCid)continue;const f=await t.store.getManifest(d.manifestCid,
{signal:n});n?.throwIfAborted();const h=l.getStatus();(t.getServiceForModel?.(d.manifestCid)??t.service)===l&&h.status===
"ready"&&h.sessionId===d.sessionId&&h.manifestCid===d.manifestCid&&(o.add(d.sessionId),i.push({...c,manifestCid:d.manifestCid,
sessionId:d.sessionId,runtime:f.model.runtime,task:f.model.task??c.task,modalities:f.model.modalities??c.modalities,outputModalities:f.
model.outputModalities??c.outputModalities}))}if(e==="local-only")return i;if(r)try{return Yl({task:r,mode:"local",candidates:i}),
i}catch(c){if(c.code!=="ERR_INFERENCE_NO_MODEL")throw c}let a=!0;if(s)try{await t.refreshPeers({signal:n})}catch{n?.throwIfAborted(),
a=!1}return n?.throwIfAborted(),a&&i.push(...t.listInferenceTargets().filter(c=>c.local===!1&&c.available)),i},generate(e,r,n={}){
if(n.signal?.throwIfAborted(),e.local){const i=(t.getServiceForModel?.(e.manifestCid)??t.service).getStatus();if(i.status!==
"ready"||i.manifestCid!==e.manifestCid||i.sessionId!==e.sessionId)throw Object.assign(new Error("The selected local mode\
l changed before dispatch"),{code:"ERR_AGENT_STALE_MODEL"})}else if(e.key!==`peer:${e.manifestCid}`)throw new Error("Inv\
alid peer model identity");return t.generate(e.local&&!t.getServiceForModel?"local":e.key,{...r,...n,...e.local?{sessionId:e.
sessionId}:{}})},cancel:e=>t.cancel(e)}}const sP=""+new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.
url).href,iP=""+new URL("ort-wasm-simd-threaded.asyncify-DXIbolS2.mjs",import.meta.url).href,oP=""+new URL("wllama-DrYkK\
wf9.wasm",import.meta.url).href,aP=""+new URL("ort-wasm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,cP=""+new URL(
"ort-wasm-simd-threaded.jsep-CdNSU0KB.mjs",import.meta.url).href,lf=Object.freeze({...Md,...Jp,...Xi,...Ya,...ri});function df(t){
if(t){const e=new URL(t,location.href);return{mjs:new URL("ort-wasm-simd-threaded.asyncify.mjs",e).href,wasm:new URL("or\
t-wasm-simd-threaded.asyncify.wasm",e).href}}return{mjs:new URL(iP,location.href).href,wasm:new URL(sP,location.href).href}}
function Ky(){return{wasm:new URL(oP,location.href).href}}function Qy(){return{mjs:new URL(cP,location.href).href,wasm:new URL(
aP,location.href).href}}async function Jy(){const{validateGgufCapabilities:t}=await qt(async()=>{const{validateGgufCapabilities:e}=await Promise.
resolve().then(()=>xE);return{validateGgufCapabilities:e}},void 0,import.meta.url);return t()}async function lP({
stateManager:t,computeManager:e,networkManager:r,storeName:n="inference-models",runtimeBaseUrl:s,collectGpuEvidence:i=!1,
memoryBudgets:o,preferenceStorage:a,residentModelSlots:c=8,probeDeviceCapabilities:l=k$,ggufRuntimeOptions:d={n_ctx:2048,
n_batch:64,n_gpu_layers:99999,n_threads:1}}={}){if(!Number.isInteger(c)||c<1||c>8)throw new Error("Managed model slots m\
ust be between one and eight");let f=null,h;const p=!t,m=!e,b=t??new YB(r??null,{enablePersistence:!1,disableNetworkProvider:!0,
disableBroadcast:!0}),g=e??new ED({requireWorkers:!0,enableWorkers:!0,enableWebGPU:!0,minWorkers:1,targetWorkers:1,maxWorkers:c,
autoScaleWorkers:!1,workerBootstrapTimeoutMs:6e4}),u=_$({computeManager:g,owned:m,initial:o}),y=u.admissionOptions,k=r?.
getArtifactTransport?.()?.store??b.getArtifactStore(n),A=k??b.createArtifactStore({name:n,capacity:"browser",maximumTraversalBlocks:131072});
let S,v,w,I,C;const T=new Set,P=new Set,L=new WeakSet;function N(F){if(T.add(F),!L.has(F)){L.add(F);const Y=F.dispose.bind(
F);F.dispose=async()=>{const q=await Y();return T.delete(F),P.delete(F),q}}return F}let H,te,X=!1;const j=new Map,ae=XN(
{store:A,manager:r,async createManager(F){const{NetworkManager:Y}=await qt(async()=>{const{NetworkManager:q}=await import("./NetworkManager-DVeZM72H.js").
then(pe=>pe.U);return{NetworkManager:q}},__vite__mapDeps([6,2]),import.meta.url);return new Y(F)}});try{await A.open(),S=await g.
createModelInferenceService({artifactStore:A,resourceBudgets:u.initialResourceBudgets(c),admissionOptions:y,resourceEstimate:Ko,
runtimeAssets:df(s),collectGpuEvidence:i,generationTimeoutMs:3e5}),v=await fe(d),w=await g.createModelInferenceService({
artifactStore:A,runtime:"onnx-diffusion",runtimeAssets:Qy(),runtimeOptions:{},collectGpuEvidence:i,admissionOptions:y,resourceEstimate:Ko,
loadTimeoutMs:3e5,generationTimeoutMs:3e5}),I=S;for(const F of[S,v,w])N(F);C=new kD({artifactStore:A,maximumResidents:c,
async createService({manifest:F,runtimeOptions:Y}){const q=F.model?.runtime;q==="llama.cpp"&&await Jy();const pe=ce=>ce&&
!P.has(ce)&&!ce.closed&&ce.getStatus().status==="idle";let ve=q==="llama.cpp"?v:q==="onnx-diffusion"?w:q==="transformers\
.js"?S:null;if(!pe(ve)||q==="llama.cpp"&&Y.ggufGpuLayers!==void 0){const ce=q==="llama.cpp"?Ky():q==="onnx-diffusion"?Qy():
df(s);ve=await g.createModelInferenceService({artifactStore:A,runtime:q,runtimeAssets:ce,resourceEstimate:Ko,collectGpuEvidence:i,
admissionOptions:y,...q==="llama.cpp"?{runtimeOptions:{...d,...Y.ggufGpuLayers!==void 0?{n_gpu_layers:Y.ggufGpuLayers}:{}},
loadTimeoutMs:30*6e4}:{loadTimeoutMs:3e5},generationTimeoutMs:3e5}),N(ve),q==="transformers.js"&&!pe(S)&&S.closed&&(S=ve),
q==="llama.cpp"&&v.closed&&(v=ve),q==="onnx-diffusion"&&w.closed&&(w=ve)}return P.add(ve),ve}}),ae.networkReady&&ae.startArtifacts()}catch(F){
throw await w?.dispose().catch(()=>{}),await v?.dispose().catch(()=>{}),await S?.dispose().catch(()=>{}),m&&await g.destroy().
catch(()=>{}),p?await b.destroy().catch(()=>{}):k||await A.destroy().catch(()=>{}),F}async function fe(F){return g.createModelInferenceService(
{artifactStore:A,runtime:"llama.cpp",runtimeAssets:Ky(),runtimeOptions:F,collectGpuEvidence:i,admissionOptions:y,resourceEstimate:Ko,
loadTimeoutMs:30*6e4,generationTimeoutMs:3e5})}const Te=q$(),he={searchModelHub:F=>Te.search(F),inspectModelHub:(F,Y={})=>Y$(
F,{...Y,client:Te,catalog:lf}),findModelConversions:(F,Y={})=>t7(F,{...Y,client:Te}),stateManager:b,computeManager:g,store:A,
async getAgentController(){if(X)throw new Error("Model console is closed");return H||(te||(te=(async()=>{const F=`${n}-a\
gents`,Y=b.getAgentRecordStore(F)??b.createAgentRecordStore({name:F});if(await Y.open(),X)throw new Error("Model console\
 is closed");return H=new rP({store:Y,inference:nP(he)}),H})().finally(()=>{te=null})),te)},get service(){return I},get services(){
const F={onnx:S,gguf:v,diffusion:w,...Object.fromEntries(j)};for(const Y of C.list()){const q=C.getService(Y.manifestCid);
q&&!Object.values(F).includes(q)&&(F[Y.manifestCid]=q)}return F},managesArtifactUses:!0,getServiceForModel(F){return C.getService(
F)??[...j.values()].find(Y=>Y.getStatus().manifestCid===F)??null},getResidentModelStates:()=>C.list(),selectResidentModel(F){
const Y=C.getService(F);if(Y?.getStatus().status!=="ready")throw new Error("The selected model is not ready");I=Y},async unloadResidentModel(F){
const Y=await C.unload(F);return(F===void 0||I.getStatus().manifestCid===F||["idle","closed"].includes(I.getStatus().status))&&
(I=C.list().map(q=>C.getService(q.manifestCid)).find(q=>q?.getStatus().status==="ready")??S),Y},runtimeAssets:df(s),registerAuxiliaryService(F,Y){
if(X||!/^[a-z][a-z0-9-]{0,63}$/.test(F)||["onnx","gguf","diffusion"].includes(F)||j.has(F)||!Y?.getStatus||!Y.unloadModel||
!Y.dispose)throw new Error("Invalid or duplicate auxiliary model service");return j.set(F,Y),()=>{const q=Y.getStatus();
if(!["idle","closed"].includes(q.status)||q.manifestCid)throw new Error("Unload the auxiliary model before unregistering\
 it");j.get(F)===Y&&j.delete(F)}},async unloadAuxiliaryModel(F){let Y=!1;for(const q of j.values())q.getStatus().manifestCid===
F&&(await q.unloadModel(),Y=!0);return Y},getDeviceCapabilities:()=>f,async checkDeviceCapabilities(){return h??=Promise.
resolve().then(()=>l()).then(F=>(f=F,F)),h},getMemoryBudgets:u.get,setMemoryBudgets:u.set,getMemoryBudgetStatus:u.status,
getModelCompatibility(F){const Y=g.resourceBroker?.reportPressure().pools,q=u.get();for(const[pe,ve]of[["cpuBytes","cpu"],
["gpuBytes","gpu"]]){const ce=Y?.[ve]?.memoryBytes;Number.isSafeInteger(ce)&&ce>0&&(q[pe]=Math.min(q[pe]??ce,ce))}return S$(
F,{device:f,budgets:q})},async inspectPeerPackage(F,{signal:Y}={}){const q=Ze(F);if(q.code!==85)throw new Error("Model p\
ackages require a manifest CID");try{return await A.getManifest(q.toString(),{signal:Y})}catch(ce){if(Y?.throwIfAborted(),
!ae.networkReady)throw ce}await ae.requireArtifacts({signal:Y});const pe=await ae.manager.fetchArtifactBlock(q.toString(),
{artifactCid:q.toString(),signal:Y});if(Y?.throwIfAborted(),!(pe instanceof Uint8Array)||pe.byteLength>ti)throw new Error(
"Peer model manifest exceeds its metadata budget");if(!em(pe).every((ce,de)=>ce===q.multihash.digest[de]))throw new Error(
"Peer model manifest CID mismatch");return lh(pe)},checkGgufCapabilities:Jy,get networkManager(){return ae.manager},get networkReady(){
return ae.networkReady},get artifactReady(){return ae.artifactReady},get networkError(){return ae.error},getArtifactNetworkStatus:()=>ae.
getArtifactNetworkStatus(),async connectBackend(F={}){return ae.connect(({signal:Y})=>P$({...F,signal:Y}),F)},async connect(F,{
signal:Y}={}){return Y?.throwIfAborted(),ae.connect(()=>{if(typeof F!="string"||F.length>1024||!/^\/(?:dns4|dns6|ip4|ip6)\//.
test(F)||!F.includes("/p2p/"))throw new Error("Enter a relay multiaddress including its peer ID");return{bootstrapPeers:[
F]}},{signal:Y})},async importCatalog(F,Y={}){const q=lf[F];if(!q)throw new Error("Unknown approved model");const pe=Md[F]?
AD:Xi[F]?BD:Ya[F]?DD:ri[F]?(ve,ce)=>xD(ri[ve],ri[ve].files.find(de=>de.path===ce)):_D;return Xu(A,{schema:"peercompute.a\
rtifact.manifest.v1",name:q.name,files:q.files,model:q.model,provenance:{...q.provenance,license:q.license}},ve=>pe(F,ve),
Y)},async importHub(F,{reuseManifest:Y,...q}={}){const pe=lN(RE(F),Y),ve=he.getModelCompatibility(F);if(["checking","una\
vailable"].includes(ve.status))throw new Error(ve.reason);return Xu(A,pe,ce=>Na(F.repository,F.revision,ce),q)},async importPackage(F,Y,{
expectedCid:q,...pe}={}){F=as(F);const ve=new URL(Y,location.href);if(ve.origin!==location.origin)throw new Error("Fixtu\
re package source must be same-origin");const ce=await Xu(A,F,de=>new URL(de.split("/").map(encodeURIComponent).join("/"),
ve).href,pe);if(q&&ce.cid!==q)throw new Error("Package manifest CID changed during import");return ce},async load(F,{ggufGpuLayers:Y,
...q}={}){const pe=await A.getManifest(F,{signal:q.signal}),ve=pe.model?.runtime==="llama.cpp",ce=pe.model?.runtime==="o\
nnx-diffusion";if(!ve&&!ce&&!["transformers.js","transformers-speech"].includes(pe.model?.runtime))throw new Error("This\
 package can be stored and hosted, but its model runtime is unavailable in this browser demo");if(ve&&Y!==void 0&&(!Number.
isSafeInteger(Y)||Y<1||Y>99999))throw new Error("GGUF GPU layers must be between 1 and 99999 (all layers)");const de=await C.
load(F,{signal:q.signal,onProgress:q.onProgress,runtimeOptions:Y===void 0?{}:{ggufGpuLayers:Y}});return(pe.model.runtime!==
"transformers-speech"||I.getStatus().status!=="ready")&&(I=C.getService(F)),de},async ensure(F,Y={}){return await ae.requireArtifacts(
Y),A.ensureLocal(F,{...Y,fetchBlock:(q,pe)=>ae.manager.fetchArtifactBlock(q,{...pe,artifactCid:F})})},async publish(F){return await ae.
requireArtifacts(),ae.manager.announceArtifact(F)},async withdraw(F){return await ae.requireArtifacts(),ae.manager.withdrawArtifact(
F)},async dispose(){X=!0,await te?.catch(()=>{}),await H?.dispose();for(const q of j.values())await q.dispose();j.clear(),
await C.dispose();const Y=(await Promise.allSettled([...T].map(q=>q.dispose()))).filter(q=>q.status==="rejected").map(q=>q.
reason);if(Y.length)throw new AggregateError(Y,"Some managed model services could not finish cleanup");await ae.dispose(),
m&&await g.destroy(),p&&await b.destroy()}},ye=YN(he,{catalog:lf,preferences:pE({storeName:A.lockName??A.name??n,storage:a})});
try{await ye.initialize()}catch(F){throw await he.dispose(),F}return he}function dP(t){const e=new URL(t),r=e.searchParams.
get("prod")==="1"?"prod":e.searchParams.get("dev")==="1"?"dev":null,n=["5189","5176","5187"].includes(e.port)&&/^\/(?:index\.html)?$/.
test(e.pathname);return n?(e.port="4173",e.pathname="/"):e.pathname=e.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/,
"/"),e.search=r?`?${r}=1`:n?"?dev=1":"",e.hash="",e.href}const Pr=(t,e,r)=>{const n=document.createElement(t);return e&&
(n.className=e),r!==void 0&&(n.textContent=r),n},Qc=t=>Number.isSafeInteger(t)&&t>=0?t:null,Ph=t=>String(t?.message??t??
"").trim().slice(0,256);function uP(t){const e=new Map;for(const r of Array.isArray(t)?t:[]){const n=typeof r?.manifestCid==
"string"?r.manifestCid.trim():"";if(!n||r.local===!0||r.available!==!0)continue;e.has(n)||e.set(n,{cid:n,name:Ph(r.name)||
"Unnamed model",hosts:new Map,hasHostList:!1,fallbackCount:0,fallbackBusy:!0});const s=e.get(n);if(Array.isArray(r.hosts)){
s.hasHostList=!0;for(const i of r.hosts)i?.local===!0||typeof i?.peerId!="string"||!i.peerId.trim()||s.hosts.set(i.peerId,
(s.hosts.get(i.peerId)??!0)&&i.busy===!0)}else{const i=Qc(r.providerCount)??0;s.fallbackCount=Math.max(s.fallbackCount,i),
i>0&&(s.fallbackBusy&&=r.busy===!0)}}return[...e.values()].map(r=>({cid:r.cid,name:r.name,peerCount:r.hasHostList?r.hosts.
size:r.fallbackCount,busy:r.hasHostList?[...r.hosts.values()].every(Boolean):r.fallbackBusy})).filter(r=>r.peerCount>0).
sort((r,n)=>r.name.localeCompare(n.name)||r.cid.localeCompare(n.cid))}function fP({container:t}={}){if(!t?.append)throw new TypeError(
"A network status container is required");const e=Pr("button","pc-network-trigger");e.type="button",e.setAttribute("aria\
-label","Network status"),e.setAttribute("aria-haspopup","dialog"),e.setAttribute("aria-expanded","false");const r=document.
createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox","0 0 24 24"),r.setAttribute("aria-hidden","\
true"),r.setAttribute("focusable","false");for(const[I,C]of[["path",{d:"M12 8v4M5 16v-4h14v4"}],["rect",{x:"9",y:"2",width:"\
6",height:"6",rx:"1"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1"}],["rect",{x:"16",y:"16",width:"6",height:"6",rx:"\
1"}]]){const T=document.createElementNS(r.namespaceURI,I);for(const[P,L]of Object.entries(C))T.setAttribute(P,L);r.append(
T)}e.append(r);const n=Pr("section","pc-network-popover");n.id=`pc-network-${crypto.randomUUID()}`,n.setAttribute("role",
"dialog"),n.setAttribute("aria-modal","false"),n.tabIndex=-1,n.hidden=!0;const s=typeof n.showPopover=="function";s&&n.setAttribute(
"popover","manual"),e.setAttribute("aria-controls",n.id);const i=Pr("h2","","Network status");i.id=`${n.id}-title`,n.setAttribute(
"aria-labelledby",i.id);const o=Pr("button","pc-network-close","×");o.type="button",o.setAttribute("aria-label","Close \
network status");const a=Pr("div","pc-network-header");a.append(i,o);const c=Pr("p","pc-network-state"),l=Pr("p","pc-net\
work-summary");l.id=`${n.id}-status`,l.setAttribute("role","status"),l.setAttribute("aria-live","polite"),l.setAttribute(
"aria-atomic","true"),n.setAttribute("aria-describedby",l.id),n.append(a,c,l);const d=Pr("h3","pc-network-models-heading",
"Peer inference models");d.id=`${n.id}-models`;const f=Pr("ul","pc-network-models");f.setAttribute("aria-labelledby",d.id);
const h=Pr("p","pc-network-models-empty");n.append(d,f,h),t.append(e,n);let p=!1,m=!1,b="",g="";function u(){if(!p||m)return;
const I=window.visualViewport,C=I?.offsetLeft??0,T=I?.offsetTop??0,P=I?.width??window.innerWidth,L=I?.height??window.innerHeight,
N=8,H=Math.max(1,P-N*2),te=Math.max(1,L-N*2);n.style.width=`${Math.min(360,H)}px`,n.style.maxHeight=`${te}px`;const X=e.
getBoundingClientRect(),j=n.getBoundingClientRect(),ae=C+N,fe=C+P-N-j.width,Te=T+N,he=T+L-N-j.height,ye=X.bottom+N,F=ye<=
he?ye:X.top-N-j.height;n.style.left=`${Math.max(ae,Math.min(X.right-j.width,fe))}px`,n.style.top=`${Math.max(Te,Math.min(
F,he))}px`}function y({restoreFocus:I=!0}={}){if(!p)return;const C=n.contains(document.activeElement)||document.activeElement===
e;p=!1,e.setAttribute("aria-expanded","false"),s&&n.matches(":popover-open")&&n.hidePopover(),n.hidden=!0,I&&C&&e.isConnected&&
!e.disabled&&e.getClientRects().length&&e.focus({preventScroll:!0})}function E(){m||p||!e.isConnected||e.disabled||(p=!0,
n.hidden=!1,e.setAttribute("aria-expanded","true"),s&&n.showPopover(),u(),n.focus({preventScroll:!0}))}function k(){p?y():
E()}function A(I){!p||I.composedPath().includes(n)||I.composedPath().includes(e)||y({restoreFocus:!1})}function S(I){p&&
I.key==="Escape"&&(I.preventDefault(),I.stopPropagation(),y())}function v(){s&&p&&!n.matches(":popover-open")&&y()}e.addEventListener(
"click",k),o.addEventListener("click",y),document.addEventListener("pointerdown",A,!0),document.addEventListener("keydow\
n",S),n.addEventListener("toggle",v),window.addEventListener("resize",u),window.addEventListener("scroll",u,!0),window.visualViewport?.
addEventListener("resize",u),window.visualViewport?.addEventListener("scroll",u);function w(I={}){if(m)return b;const C=I.
connected===!0,T=I.connecting===!0,P=Qc(I.peerCount),L=Qc(I.sharedModelCount),N=Qc(I.hostedModelCount),H=Ph(I.issue),te=Ph(
I.artifacts?.error),X=I.artifacts?.status,j=!C&&!T?"offline":C&&P>0&&L>0&&N>0?"healthy":"pending",ae={healthy:"Healthy",
pending:"Pending",offline:"Offline"}[j],Te=[C?`Peer network connected${P!==null?` · ${P} peers`:" · peer count unknown"}\
 · ${L!==null?L:"Unknown"} shared models · ${N!==null?N:"Unknown"} hosted models.`:T?"Connecting to peer network…":"\
Peer network is offline."];H?Te.push("Discovery issue: "+H):C&&P===0?Te.push("Waiting for other peers."):C&&N===0&&Te.push(
"No peer is currently advertising a loaded model for inference."),X==="starting"&&Te.push("File sharing is preparing sto\
red models. Inference discovery remains available."),X==="error"||te?Te.push("File sharing unavailable: "+(te||"Initiali\
zation failed")):C&&X==="offline"&&Te.push("File sharing is offline. Inference discovery remains available."),b=Te.join(
" "),e.dataset.state=n.dataset.state=j,e.title=`Network status — ${ae}`,e.setAttribute("aria-description",`Network sta\
te: ${ae}.`),c.textContent=ae,l.textContent!==b&&(l.textContent=b);const he=uP(C?I.inferenceModels:[]),ye=JSON.stringify(
he);if(ye!==g){g=ye;const F=n.scrollTop;f.replaceChildren(...he.map(Y=>{const q=Pr("li","pc-network-model");return q.dataset.
modelCid=Y.cid,q.append(Pr("span","pc-network-model-name",Y.name),Pr("span","pc-network-model-hosts",`${Y.peerCount} pee\
r${Y.peerCount===1?"":"s"}${Y.busy?" · busy":""}`)),q})),n.scrollTop=F}return f.hidden=he.length===0,h.hidden=he.length>
0,h.textContent=C?"No peer inference models are available.":T?"Waiting for the peer network…":"Connect to the peer net\
work to discover models.",u(),b}return w(),{trigger:e,element:n,status:l,update:w,close:y,dispose(){m||(y({restoreFocus:!1}),
m=!0,e.removeEventListener("click",k),o.removeEventListener("click",y),document.removeEventListener("pointerdown",A,!0),
document.removeEventListener("keydown",S),n.removeEventListener("toggle",v),window.removeEventListener("resize",u),window.
removeEventListener("scroll",u,!0),window.visualViewport?.removeEventListener("resize",u),window.visualViewport?.removeEventListener(
"scroll",u),n.remove(),e.remove())}}}const J=(t,e,r)=>{const n=document.createElement(t);return e!==void 0&&(n.textContent=
e),r&&(n.className=r),n},nt=(t,e)=>{const r=J("button",t);return r.type="button",e&&r.setAttribute("aria-label",e),r},Cn=(t,e)=>{
const r=J("label",t);return r.append(e),r},Yy=(t,e,r)=>{const n=J("label",void 0,"pc-chat-toggle");n.title=e,t.type="che\
ckbox",t.setAttribute("aria-label",e);const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute(
"viewBox","0 0 24 24"),s.setAttribute("aria-hidden","true"),s.setAttribute("focusable","false");for(const o of r){const a=document.
createElementNS(s.namespaceURI,"path");a.setAttribute("d",o),s.append(a)}const i=J("span",void 0,"pc-chat-toggle-glyph");
return i.setAttribute("aria-hidden","true"),i.append(s),n.append(t,i),n};function Ks(t,{dismissible:e=!0}={}){const r=J(
"dialog",void 0,"pc-model-dialog"),n=J("h2",t);n.id=`model-dialog-${crypto.randomUUID()}`,r.setAttribute("aria-labelledb\
y",n.id);const s=J("div",void 0,"pc-dialog-header");if(s.append(n),e){const a=nt("Done");a.autofocus=!0,a.onclick=()=>r.
close(),s.append(a)}const i=J("div",void 0,"pc-dialog-body"),o=J("p","","pc-inference-status");return o.setAttribute("ro\
le","status"),r.append(s,i,o),r.addEventListener("keydown",a=>{if(a.key!=="Tab")return;const c=[...r.querySelectorAll("b\
utton,input,select,textarea,a[href],[tabindex]")].filter(f=>!f.disabled&&f.tabIndex>=0&&f.getClientRects().length);if(!c.
length){a.preventDefault(),r.focus();return}const l=c[0],d=c.at(-1);(a.shiftKey&&document.activeElement===l||!a.shiftKey&&
document.activeElement===d)&&(a.preventDefault(),(a.shiftKey?d:l)?.focus())}),{element:r,body:i,status:o}}function Ss(t){
return!Number.isSafeInteger(t)||t<0?"Unknown size":t>=1024**3?`${(t/1024**3).toFixed(2)} GiB`:t>=1024**2?`${(t/1024**2).
toFixed(1)} MiB`:`${Math.ceil(t/1024)} KiB`}function hP(t){const e=r=>Number.isSafeInteger(r.totalBytes)&&r.totalBytes>=
0?r.totalBytes:1/0;return[...t].sort((r,n)=>e(r)-e(n)||String(r.name).localeCompare(String(n.name))||String(r.key??r.manifestCid).
localeCompare(String(n.key??n.manifestCid)))}function pP(t){const e=J("section",void 0,"pc-inference-panel");e.setAttribute(
"aria-label","Model chat");const r=J("nav",void 0,"pc-console-navigation");r.setAttribute("aria-label","Console navigati\
on");const n=J("a","←","pc-console-back");n.href=dP(location.href),n.setAttribute("aria-label","Back to demo overview"),
n.title="Back to demo overview";const s=nt("☰","Menu");s.title="Menu",s.className="pc-icon-button";const i=J("div",void 0,
"pc-navigation-main"),o=J("div",void 0,"pc-navigation-actions");i.append(n),o.append(s),r.append(i,o),e.append(r);const a=nt(
"Models");a.setAttribute("aria-haspopup","dialog");const c=nt("Agents");c.setAttribute("aria-haspopup","dialog"),c.disabled=
!0;const l=nt("Models"),d=nt("Config","Configure model chat");l.setAttribute("aria-haspopup","dialog");const f=Ks("Confi\
g"),h=Ks("Model setup"),p=Ks("About PeerCompute"),m=Ks("Chat options"),b=m.element;b.classList.add("pc-chat-options"),m.
status.hidden=!0;const g=nt("⚙","Chat options");g.title="Chat options",g.className="pc-chat-icon";const u=J("section",
void 0,"pc-model-library"),y=J("div",void 0,"pc-dialog-body"),E=J("p","","pc-inference-status");E.setAttribute("role","s\
tatus"),u.append(y);const k=Ks("Leave model console?",{dismissible:!1}),A=nt("Stay here"),S=nt("Leave");A.autofocus=!0,k.
body.append(J("p","Are you sure? Leaving stops the models and inference hosted by this page. Stored model files remain o\
n this device."),A,S);const v=Ks("Loading model",{dismissible:!1}),w=v.element;w.classList.add("pc-model-loading"),w.tabIndex=
-1;const I=J("span",void 0,"pc-loading-spinner");I.setAttribute("aria-hidden","true");const C=J("strong","","pc-loading-\
model"),T=nt("Cancel");T.autofocus=!0,v.status.id=`model-load-progress-${crypto.randomUUID()}`,v.status.setAttribute("ar\
ia-live","polite"),v.status.setAttribute("aria-atomic","true"),w.setAttribute("aria-describedby",v.status.id),v.body.append(
I,C,v.status,T);const P=Ks("Menu"),L=P.element;L.classList.add("pc-console-menu");const N=nt("About"),H=nt("Install");H.
hidden=!0,P.body.append(l,d,N,H);const te=p.element;p.body.append(J("p","PeerCompute runs models in your browser using W\
ebGPU. You can chat with a model on this device or use inference hosted by another peer.")),p.body.append(J("p","Model f\
iles are identified by their content and shared over IPFS. File sharing and hosted inference are available while the hos\
ting browser stays online."));const X=J("ul",void 0,"pc-about-links");for(const[je,Pt]of[["Tsotchke-Corporation on Huggi\
ng Face","https://huggingface.co/Tsotchke-Corporation"],["tsotchke.org","https://tsotchke.org"],["tsotchke.net","https:/\
/tsotchke.net"]]){const ht=J("a",je);ht.href=Pt,ht.target="_blank",ht.rel="noopener noreferrer";const vn=J("li");vn.append(
ht),X.append(vn)}p.body.append(X);const j=f.element,ae=h.element,fe=J("strong"),Te=J("p","","pc-inference-note"),he=J("s\
elect"),ye=J("select");he.setAttribute("aria-label","Browser"),ye.setAttribute("aria-label","Operating system");for(const[
je,Pt]of[["chrome","Chrome"],["chromium","Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Firefox"],["safari","\
Safari"],["other","Other browser"]]){const ht=J("option",Pt);ht.value=je,he.append(ht)}for(const[je,Pt]of[["linux","Linu\
x"],["windows","Windows"],["macos","macOS"],["android","Android"],["ios","iOS / iPadOS"],["other","Other system"]]){const ht=J(
"option",Pt);ht.value=je,ye.append(ht)}const F=J("div",void 0,"pc-config-grid");F.append(Cn("Browser",he),Cn("Operating \
system",ye));const Y=J("div",void 0,"pc-model-help-details"),q=J("textarea");q.readOnly=!0,q.rows=3,q.setAttribute("aria\
-label","Browser launch command"),q.spellcheck=!1;const pe=nt("Copy command"),ve=nt("Open Config"),ce=J("div",void 0,"pc\
-model-help-command");ce.append(q,pe),h.body.append(fe,Te,F,J("p","Browser detection is approximate. Adjust these choice\
s if needed.","pc-inference-note"),Y,ce,ve);for(const[je,Pt]of[[d,j],[N,te],[s,L],[g,b]])Pt.id=`model-window-${crypto.randomUUID()}`,
je.setAttribute("aria-controls",Pt.id),je.setAttribute("aria-haspopup","dialog");const de=J("div",void 0,"pc-model-toolb\
ar");de.append(a,c),i.append(de);const ge=J("input");ge.type="checkbox",ge.checked=!0;const be=J("input");be.type="check\
box",be.checked=!0;const _r=J("div",void 0,"pc-model-preferences"),Ke=Cn("Share with peers",ge);Ke.prepend(ge),Ke.title=
"Share imported model files with connected peers while this browser stays online.";const tt=Cn("Host inference",be);tt.prepend(
be),tt.title="Allow connected peers to send requests to compatible models loaded on this device.",_r.append(Ke,tt),f.body.
append(_r);const gt=J("p","Opening model chat…","pc-inference-status pc-status-quiet");gt.setAttribute("role","status"),
e.append(gt);const Ie=J("input");Ie.type="number",Ie.min="1",Ie.max="99999",Ie.value="99999",Ie.setAttribute("aria-label",
"GGUF GPU layer limit");const Fe=J("div",void 0,"pc-config-grid"),kt=J("input"),vr=J("input");for(const je of[kt,vr])je.
type="number",je.min="0",je.max="1024",je.step="any",je.placeholder="Auto";Fe.append(Cn("Model RAM budget (GiB)",kt),Cn(
"Model GPU memory budget (GiB)",vr));const Rt=J("p","","pc-inference-note");f.body.append(Fe,Rt);const Mt=J("p","","pc-i\
nference-note");Mt.setAttribute("aria-label","Estimated model memory reservations"),f.body.append(Mt);const bt=J("div",void 0,
"pc-config-grid");bt.append(Cn("GGUF GPU layers",Ie)),f.body.append(bt),f.body.append(J("p","99999 uses all GPU layers. \
The 27B model was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.","pc-inference-note"));const xt=J(
"input");xt.placeholder="Optional relay multiaddress",xt.setAttribute("aria-label","Artifact relay multiaddress");const Cr=nt(
"Connect"),ze=J("div",void 0,"pc-config-row");ze.append(xt,Cr),f.body.append(ze);const rr=J("p","","pc-inference-note");
f.body.append(rr);const Ht=J("input");Ht.type="file",Ht.setAttribute("aria-label","Pin a file locally"),f.body.append(Cn(
"Pin a file locally",Ht));const Dr=nt("Unload all local models");f.body.append(Dr);const Tr=nt("Clear conversation");f.body.
append(Tr),f.body.append(J("p","Clear chat history to start a new conversation while keeping the loaded model and stored\
 files.","pc-inference-note")),y.append(J("p","Select models, then Load selected or Delete selected. Loading uses compat\
ible saved packages. Deleting also unloads selected models; files needed by other packages are kept. Unload keeps saved \
files.","pc-inference-note"));const _=J("ul",void 0,"pc-stored-models");_.setAttribute("aria-label","Stored model packag\
es");const B=nt("Refresh"),R=nt("Stop loading");R.hidden=!0;const V=nt("Load selected");V.disabled=!0;const O=nt("Delete\
 selected");O.disabled=!0,O.className="pc-delete-model";const G=J("p","0 models selected.","pc-inference-note");G.setAttribute(
"aria-live","polite");const ie=J("div",void 0,"pc-stored-footer"),xe=J("div",void 0,"pc-stored-footer-actions");xe.append(
V,O,B,R),ie.append(G,xe),y.append(_),u.append(ie,E);const se=J("div",void 0,"pc-inference-transcript");se.setAttribute("\
role","log"),se.setAttribute("aria-label","Conversation"),se.setAttribute("aria-live","polite");const St=J("p","Open Mod\
els to load one, or use ⚙ to choose a peer model.","pc-chat-empty");se.append(St),e.append(se);const ut=J("div",void 0,
"pc-inference-actions");e.append(ut);const ft=J("div",void 0,"pc-chat-attachment");ft.hidden=!0;const at=J("img");at.alt=
"Selected image";const yt=J("span"),nr=nt("×","Remove attached image");ft.append(at,yt,nr),e.append(ft);const W=J("text\
area");W.rows=2,W.maxLength=16e3,W.placeholder="Message…",W.setAttribute("aria-label","Message"),e.append(W);const Kr=J(
"input"),ls=J("input"),gn=Yy(Kr,"Generate image",["M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-\
1Z","M3 17l6-6 4 4 3-3 5 5","M16 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"]),Qr=J("div",void 0,"pc-inference-note");Qr.hidden=!0,Qr.
setAttribute("aria-live","polite");const bn=nt("Use text chat");Qr.append(J("span","Image generation is unavailable for \
this chat target. Your image prompt is kept. "),bn),e.append(Qr);const Vt=Yy(ls,"Speak replies",["M6 9a6 6 0 0 1 12 0c0 \
4-4 5-4 8a4 4 0 0 1-8 0","M10 10a2 2 0 1 1 4 0c0 2-3 2-3 5"]),cn=J("input");cn.type="checkbox",cn.checked=!0;const sr=J(
"div",void 0,"pc-model-preferences pc-conversation-options");sr.append(Cn("Be concise",cn));const ir=J("p","","pc-infere\
nce-note pc-route-policy");ir.setAttribute("aria-live","polite");const yn=J("select");yn.setAttribute("aria-label","Chat\
 target"),m.body.append(Cn("Chat target",yn),sr,ir);const At=nt("+","Attach image");At.title="Attach an image",At.className=
"pc-chat-icon";const De=J("input");De.type="file",De.accept="image/png,image/jpeg,image/webp,image/gif",De.hidden=!0,De.
setAttribute("aria-label","Choose image attachment");const lt=nt("Resume agent");lt.hidden=!0,e.append(lt);const qe=nt("\
Send"),Re=nt("Talk"),Jr=nt("Stop");Jr.hidden=!0,qe.className="pc-chat-send",Jr.className="pc-chat-stop",Re.title="Hold t\
o record a voice message; release to send. Load a speech-recognition model or use a compatible peer.";const Ws=J("div",void 0,
"pc-chat-controls");Ws.append(g,At,De,gn,Vt,Re,qe,Jr),e.append(Ws),e.append(j,ae,te,L,b,w,k.element);const wn=fP({container:e});
return o.prepend(wn.trigger),t.append(e),{panel:e,browse:a,agents:c,networkInfo:wn,discoveryStatus:wn.status,modelsMenu:l,
configure:d,chatConfigure:g,chatOptions:b,chatOptionsStatus:m.status,sharing:ge,hosting:be,status:gt,configuration:j,configurationStatus:f.
status,storedContent:u,storedList:_,storedRefresh:B,storedCancel:R,storedLoadSelected:V,storedDeleteSelected:O,storedSelection:G,
storedStatus:E,gpuLayers:Ie,leaveConfirmation:k.element,leaveStatus:k.status,stay:A,leave:S,back:n,menu:s,menuWindow:L,menuStatus:P.
status,about:te,aboutButton:N,install:H,loading:w,loadingModel:C,loadingStatus:v.status,loadingCancel:T,compatibility:ae,
helpModel:fe,helpReason:Te,helpBrowser:he,helpOs:ye,helpDetails:Y,helpCommandGroup:ce,helpCommand:q,helpCopy:pe,helpConfig:ve,
helpStatus:h.status,cpuBudget:kt,gpuBudget:vr,memoryNote:Rt,memoryPressure:Mt,relay:xt,connect:Cr,networkStatus:rr,file:Ht,
unload:Dr,clearChat:Tr,transcript:se,empty:St,proposed:ut,attachment:ft,attachmentImage:at,attachmentName:yt,removeAttachment:nr,
prompt:W,target:yn,attach:At,imageFile:De,send:qe,cancel:Jr,talk:Re,generateImage:Kr,imageUnavailable:Qr,useTextChat:bn,
speakReplies:ls,beConcise:cn,modeStatus:ir,resumeAgent:lt}}function mP(t,e){t.helpModel.textContent=e.name,t.helpReason.
textContent=e.reason,t.helpDetails.replaceChildren();for(const r of e.paragraphs)t.helpDetails.append(J("p",r,"pc-infere\
nce-note"));if(e.steps.length){const r=J("ol");for(const n of e.steps)r.append(J("li",n));t.helpDetails.append(r)}for(const r of e.
links){const n=J("a",r.label);n.href=r.url,n.target="_blank",n.rel="noopener noreferrer";const s=J("p",void 0,"pc-infere\
nce-note");s.append(n),t.helpDetails.append(s)}t.helpCommand.value=e.command??"",t.helpCommandGroup.hidden=!e.command,t.
helpConfig.hidden=!e.openConfig,t.helpStatus.textContent=""}function aa(t){return!!t.manifestCid}function Xy(t){return aa(
t)&&!t.loaded&&!t.cleanupPending&&!t.needsVerification&&!["checking","unavailable"].includes(t.localAvailability?.status)}
function gP(t,e,{selected:r=new Set,onSelect:n,onRecover:s,onUnload:i}={}){t.storedList.replaceChildren(),e.length||t.storedList.
append(J("li","No models stored on this device.","pc-stored-empty"));for(const o of hP(e)){const a=J("li",void 0,"pc-sto\
red-model");if(a.dataset.modelCid=o.manifestCid,n){const f=J("input");f.type="checkbox",f.setAttribute("aria-label",`Sel\
ect ${o.name}`),f.dataset.inactive=String(!aa(o)),f.disabled=f.dataset.inactive==="true",f.checked=!f.disabled&&r.has(o.
manifestCid),f.onchange=()=>n(o,f.checked),a.append(f)}const c=J("div");c.append(J("strong",o.name));const l=[Ss(o.totalBytes),
...o.loaded?["Loaded"]:[],...o.shared?["Shared"]:[],...o.cleanupPending?["Cleanup pending"]:[],...o.needsVerification?["\
Needs local verification"]:[]];c.append(J("p",l.join(" · "),"pc-inference-note")),o.shareError&&c.append(J("p",`Sharing\
 unavailable: ${String(o.shareError).slice(0,256)}`,"pc-inference-note"));const d=["checking","unavailable"].includes(o.
localAvailability?.status);if(o.task==="automatic-speech-recognition"&&c.append(J("p","Speech recognition · used by Talk\
.","pc-inference-note")),o.task==="text-to-speech"&&c.append(J("p","Speech synthesis · used by Speak replies.","pc-infe\
rence-note")),d&&c.append(J("p",String(o.localAvailability.reason||"This model is unavailable on this device.").slice(0,
512),"pc-inference-note")),a.append(c),o.cleanupPending&&c.append(J("p","Select this model and Delete selected to retry \
cleanup.","pc-inference-note")),o.needsVerification||o.loaded){const f=o.needsVerification?"Verify locally":"Unload",h=nt(
f,`${f} ${o.name}`);h.dataset.inactive=String(!!(o.cleanupPending||(o.needsVerification?!s:!i))),h.disabled=h.dataset.inactive===
"true",h.onclick=()=>{o.needsVerification?s?.(o):i?.(o)};const p=J("div",void 0,"pc-stored-actions");p.append(h),a.append(
p)}t.storedList.append(a)}}function uf(t,e,r,{image:n,targetName:s}={}){t.empty.remove();const i=J("article",void 0,`pc-\
chat-message pc-chat-message-${e}`);if(i.append(J("span",e==="user"?"YOU":s||"MODEL","pc-chat-speaker")),n){const a=J("i\
mg");a.src=n,a.alt="Attached image",a.className="pc-chat-image",i.append(a)}const o=J("p",r);return i.append(o),t.transcript.
append(i),o}const Zy=Object.freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"Microsoft Edge",brave:"Brave",firefox:"\
Firefox",safari:"Safari",other:"Other browser"}),ew=Object.freeze({linux:"Linux",windows:"Windows",macos:"macOS",android:"\
Android",ios:"iOS / iPadOS",other:"Other operating system"}),tw=Object.freeze({chrome:"google-chrome --enable-dawn-featu\
res=vulkan_enable_f16_on_nvidia",chromium:"chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia",edge:"microsoft-\
edge --enable-dawn-features=vulkan_enable_f16_on_nvidia",brave:"brave-browser --enable-dawn-features=vulkan_enable_f16_o\
n_nvidia"}),bP="https://www.chromium.org/developers/how-tos/run-chromium-with-flags/",yP="https://github.com/google/dawn\
/commit/8f96ae09bbaac54d52ca6f8aff8606ffdbe9de3f";function Ys(t,e,r=""){return typeof t!="string"?r:t.slice(0,e).replace(
/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g," ").trim()||r}function rw(t,e){return typeof t=="string"&&Object.
hasOwn(e,t)?t:"other"}function UE(t=globalThis.navigator){const e=t??{},r=Ys(e.userAgent,4096),n=Ys(e.userAgentData?.platform,
80)||Ys(e.platform,80),s=Array.isArray(e.userAgentData?.brands)?e.userAgentData.brands.slice(0,16).map(a=>Ys(a?.brand,80)).
join(" "):"";let i="other";/iPhone|iPad|iPod|\biOS\b/i.test(`${n} ${r}`)||/Mac/i.test(`${n} ${r}`)&&e.maxTouchPoints>1?i=
"ios":/Android/i.test(`${n} ${r}`)?i="android":/Windows|Win32|Win64/i.test(n)?i="windows":/macOS|Mac/i.test(n)?i="macos":
/Linux/i.test(n)?i="linux":/Windows/i.test(r)?i="windows":/Macintosh|Mac OS X/i.test(r)?i="macos":/Linux|X11/i.test(r)&&
(i="linux");let o="other";return/Brave/i.test(s)||/Brave\//i.test(r)||typeof e.brave?.isBrave=="function"?o="brave":/Microsoft Edge/i.
test(s)||/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(r)?o="edge":/Firefox/i.test(s)||/(?:Firefox|FxiOS)\//i.test(r)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.
test(r)?o="other":/Google Chrome/i.test(s)||/CriOS\//i.test(r)?o="chrome":/Chromium\//i.test(r)?o="chromium":/Chrome\//i.
test(r)?o="chrome":/Chromium/i.test(s)?o="chromium":/Safari\//i.test(r)&&/Version\//i.test(r)&&(o="safari"),{browser:o,os:i}}
function wP(t,{environment:e=UE()}={}){const r=t?.localAvailability??{},n=Ys(r.code,100),s=rw(e?.browser,Zy),i=rw(e?.os,
ew),o={name:Ys(t?.name,180,"Selected model"),reason:Ys(r.reason,500,"Compatibility has not been fully verified."),environmentLabel:`${Zy[s]}\
 on ${ew[i]}`,paragraphs:[],steps:[],command:null,commandLabel:"",links:[],openConfig:!1};return r.status==="checking"||
n==="device_checking"?(o.paragraphs.push("The browser capability check is still running. This does not mean the model is\
 unsupported."),o.steps.push("Wait for the check to finish. If it remains pending, reload the page and check again.")):n===
"cpu_budget_exceeded"||n==="gpu_budget_exceeded"?(o.openConfig=!0,o.paragraphs.push("The model reservation exceeds a con\
figured memory budget. This budget is an admission limit, not a measurement of free RAM or GPU memory."),o.steps.push("O\
pen Config and review the RAM and GPU memory budgets. Raise or clear an optional limit only when appropriate for your de\
vice.","A shared compute pool may impose its own limit. Choose a smaller model or a peer-hosted model if that limit stil\
l applies.")):n==="gpu_feature_unavailable"&&/\bshader-f16\b/i.test(o.reason)?(o.paragraphs.push("This browser does not \
expose the shader-f16 feature required by this model runtime. GPU memory capacity alone does not establish FP16 support."),
i==="linux"&&Object.hasOwn(tw,s)?(o.command=tw[s],o.commandLabel="Optional Linux NVIDIA / Vulkan launch command",o.paragraphs.
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
Chromium command-line instructions",url:bP},{label:"Dawn NVIDIA FP16 driver restriction",url:yP})):n==="gpu_feature_unav\
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
"Choose a smaller available model or a peer-hosted model if local loading fails.")),o}const vP=new Set(["image/png","ima\
ge/jpeg","image/webp","image/gif"]);async function EP(t,{signal:e}={}){if(!t||!vP.has(t.type))throw new Error("Choose a \
PNG, JPEG, WebP or GIF image");if(t.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");e?.throwIfAborted();
const r=await createImageBitmap(t);try{if(e?.throwIfAborted(),!r.width||!r.height||r.width*r.height>32*1024**2)throw new Error(
"Choose an image smaller than 32 megapixels");const n=Math.min(1,512/Math.max(r.width,r.height)),s=document.createElement(
"canvas");s.width=Math.max(1,Math.round(r.width*n)),s.height=Math.max(1,Math.round(r.height*n));const i=s.getContext("2d",
{willReadFrequently:!0});if(!i)throw new Error("Image decoding is unavailable");i.drawImage(r,0,0,s.width,s.height);const o=i.
getImageData(0,0,s.width,s.height),a=document.createElement("canvas"),c=Math.min(1,96/Math.max(s.width,s.height));return a.
width=Math.max(1,Math.round(s.width*c)),a.height=Math.max(1,Math.round(s.height*c)),a.getContext("2d").drawImage(s,0,0,a.
width,a.height),{name:t.name.slice(0,160),preview:a.toDataURL("image/webp",.8),image:{data:new Uint8Array(o.data),width:s.
width,height:s.height,channels:4}}}finally{r.close()}}const Oh=new Map([["image/png","png"],["image/jpeg","jpg"],["image\
/webp","webp"],["image/gif","gif"]]),Uh=8*1024**2,ff=64*1024,Fh=t=>t.reason??new DOMException("Image selection cancelled",
"AbortError");function zh(t,e){return e.aborted?(Promise.resolve(t).catch(()=>{}),Promise.reject(Fh(e))):new Promise((r,n)=>{
const s=()=>n(Fh(e));e.addEventListener("abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.removeEventListener(
"abort",s))})}function kP(t,e){if(!t)return null;let r=[...t.items??[]].filter(o=>o.kind==="file").map(o=>o.getAsFile()).
filter(Boolean);if(r.length||(r=[...t.files??[]]),r.length)return r.length===1?{file:r[0]}:{error:"Attach one image at a\
 time."};const n=t.getData("text/html");if(n&&/<img\b|blob:/i.test(n)){if(n.length>ff)return{error:"Image clipboard info\
rmation is too large. Save the image and attach the file."};const o=e.createElement("template");o.innerHTML=n;const a=[...o.
content.querySelectorAll("img")];if(a.length>1)return{error:"Attach one image at a time."};if(a.length)return{url:a[0].getAttribute(
"src")??""};const c=[...o.content.querySelectorAll("a[href]")].map(l=>l.getAttribute("href")).filter(l=>/^blob:/i.test(l));
if(c.length>1)return{error:"Attach one image at a time."};if(c.length)return{url:c[0]}}const s=t.getData("text/uri-list");
if(s&&/(?:^|\n)blob:/i.test(s)){if(s.length>ff)return{error:"Image clipboard information is too large. Attach the image \
file instead."};const o=s.split(/\r?\n/).map(a=>a.trim()).filter(a=>a&&!a.startsWith("#"));return o.length===1?{url:o[0]}:
{error:"Attach one image at a time."}}const i=t.getData("text/plain").trim();return/^blob:/i.test(i)?i.length<=ff?{url:i}:
{error:"Image link is too long. Attach the image file instead."}:null}function FE(t){if(!Oh.has(t.type))throw new Error(
"Choose a PNG, JPEG, WebP or GIF image.");if(!Number.isSafeInteger(t.size)||t.size<=0)throw new Error("This image is emp\
ty or unreadable. Attach the image file again.");if(t.size>Uh)throw new Error("Choose an image smaller than 8 MiB.");return t}
async function xP(t,{document:e,fetchImpl:r,source:n,signal:s}){let i;try{i=new URL(t)}catch{throw new Error("This image\
 link is invalid. Save the image and attach the file.")}if(i.protocol!=="blob:")throw new Error("Drag or paste the image\
 file itself; remote image links are not downloaded.");if(i.origin==="null"||i.origin!==e.location.origin)throw new Error(
"This image belongs to another website or browser tab. Save the image, then attach the file.");let o;try{o=await zh(r(i.
href,{signal:s,credentials:"omit",redirect:"error"}),s)}catch(p){throw s.throwIfAborted(),new Error("This image link exp\
ired or is unavailable. Copy the image again, or save and attach its file.",{cause:p})}if(!o.ok)throw o.body?.cancel().catch(
()=>{}),new Error("This image link is unavailable. Copy the image again or attach its file.");const a=o.headers.get("con\
tent-type")?.split(";")[0].trim().toLowerCase();if(!Oh.has(a))throw o.body?.cancel().catch(()=>{}),new Error("The image \
link must contain a PNG, JPEG, WebP or GIF image.");const c=o.headers.get("content-length");if(c!==null&&(!/^\d+$/.test(
c)||Number(c)>Uh))throw o.body?.cancel().catch(()=>{}),new Error("Choose an image smaller than 8 MiB.");if(!o.body)throw new Error(
"This image has no readable data. Attach the image file instead.");const l=o.body.getReader(),d=[];let f=0,h=!1;try{for(;;){
const{done:p,value:m}=await zh(l.read(),s);if(s.throwIfAborted(),p){h=!0;break}if(f+=m.byteLength,f>Uh)throw new Error("\
Choose an image smaller than 8 MiB.");d.push(m)}if(c!==null&&f!==Number(c))throw new Error("The image was interrupted. C\
opy it again or attach the file.");return FE(new File(d,`${n==="paste"?"pasted":"dropped"}-image.${Oh.get(a)}`,{type:a}))}finally{
h||l.cancel(Fh(s)).catch(()=>{});try{l.releaseLock()}catch{}}}function SP({textarea:t,onFile:e,onError:r=()=>{},canAccept:n=()=>!0,
onPendingChange:s=()=>{},fetchImpl:i=globalThis.fetch,timeoutMs:o=1e4}={}){if(!t?.addEventListener||typeof e!="function"||
typeof i!="function")throw new TypeError("Chat image input requires a textarea, onFile and fetch");if(!Number.isSafeInteger(
o)||o<10||o>3e4)throw new RangeError("Invalid image input timeout");let a=null,c=!1,l=Promise.resolve();const d=u=>{try{
Promise.resolve(r(u)).catch(()=>{})}catch{}},f=()=>{const u=n();if(u!==!0)throw new Error(typeof u=="string"&&u?u:"Image\
s are unavailable for this chat target right now.")},h=(u=new DOMException("Image selection cancelled","AbortError"))=>a?.
controller.abort(u);function p(u,y){if(c)return;let E;try{E=kP(y==="paste"?u.clipboardData:u.dataTransfer,t.ownerDocument)}catch(S){
u.preventDefault(),d(S);return}if(!E)return;u.preventDefault(),h();const k={controller:new AbortController};a=k,s(!0);const A=setTimeout(
()=>k.controller.abort(Object.assign(new Error("Reading the image timed out. Attach the file again."),{code:"ERR_CHAT_IM\
AGE_TIMEOUT"})),o);l=(async()=>{try{if(f(),E.error)throw new Error(E.error);const S=E.file?FE(E.file):await xP(E.url,{document:t.
ownerDocument,fetchImpl:i,source:y,signal:k.controller.signal});k.controller.signal.throwIfAborted(),f(),await zh(e(S,{signal:k.
controller.signal,source:y}),k.controller.signal)}catch(S){!c&&a===k&&!(k.controller.signal.aborted&&k.controller.signal.
reason?.name==="AbortError")&&d(S)}finally{clearTimeout(A),a===k&&(a=null,c||s(!1))}})()}const m=u=>p(u,"paste"),b=u=>p(
u,"drop"),g=u=>{if(c)return;const y=u.dataTransfer;!y||![...y.types].some(k=>["Files","text/html","text/uri-list"].includes(
k))||(u.preventDefault(),y.dropEffect=n()===!0?"copy":"none")};return t.addEventListener("paste",m),t.addEventListener("\
dragover",g),t.addEventListener("drop",b),{cancel:h,whenIdle:()=>l,dispose(){return c||(c=!0,h(),t.removeEventListener("\
paste",m),t.removeEventListener("dragover",g),t.removeEventListener("drop",b),a&&s(!1)),l}}}const nw=1024*1024,AP=6,IP=24*
1024*1024,sw=t=>{if(t?.aborted)throw new DOMException("Image generation cancelled","AbortError")};function _P(t){const e=new Map;
let r=0,n=!1;function s(o,{expired:a=!1}={}){const c=e.get(o);if(c)if(URL.revokeObjectURL(c.url),r-=c.bytes,e.delete(o),
a&&t.contains(o)){const l=document.createElement("p");l.className="pc-inference-note",l.textContent="Earlier image previ\
ew released.",o.replaceWith(l)}else o.removeAttribute("src")}function i(){for(const o of e.keys())t.contains(o)||s(o);for(;e.
size>AP||r>IP;)s(e.keys().next().value,{expired:!0})}return{async append(o,a,{signal:c,prompt:l=""}={}){if(sw(c),n)throw new Error(
"Conversation image renderer is closed");const{width:d,height:f,channels:h,data:p}=a??{};if(!Number.isSafeInteger(d)||!Number.
isSafeInteger(f)||d<1||f<1||d*f>nw||h!==4||!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||p.byteLength!==d*
f*4)throw new Error("Generated image must contain bounded RGBA pixels");const m=new OffscreenCanvas(d,f),b=m.getContext(
"2d");if(!b)throw new Error("Image preview encoding is unavailable");b.putImageData(new ImageData(new Uint8ClampedArray(
p),d,f),0,0);const g=await m.convertToBlob({type:"image/png"});if(sw(c),n||!t.contains(o))throw new DOMException("Conver\
sation closed","AbortError");if(g.type!=="image/png"||g.size>nw*4+65536)throw new Error("Generated image preview exceeds\
 its byte budget");const u=document.createElement("img");u.className="pc-generated-image",u.width=d,u.height=f,u.alt=l?`\
Generated image: ${l.slice(0,160)}`:"Generated image";const y=URL.createObjectURL(g);return u.src=y,e.set(u,{url:y,bytes:g.
size}),r+=g.size,o.after(u),i(),u},prune:i,dispose(){n=!0;for(const o of e.keys())s(o)}}}const ni=t=>Number.isSafeInteger(
t)&&t>=0;function Oo(t){return ni(t)?t>=1024**3?`${(t/1024**3).toFixed(2)} GiB`:t>=1024**2?`${(t/1024**2).toFixed(1)} Mi\
B`:`${Math.ceil(t/1024)} KiB`:"Unknown size"}function qh(t){return t.task??t.model?.task??(t.browserSummary?"unknown":t.
modalities?.includes("image")?"image-text-to-text":"text-generation")}function Jc(t){const e=t.dtype??t.model?.dtype;if(typeof e==
"string")return e.toLowerCase();if(e&&typeof e=="object"&&!Array.isArray(e)){const r=[...new Set(Object.values(e).filter(
n=>typeof n=="string").map(n=>n.toLowerCase()))];if(r.length===1)return r[0];if(r.length)return`mixed (${r.sort().join("\
, ")})`}return""}function ed(t){const e=t.trim();if(!/^https?:\/\//i.test(e))return{query:e,repository:null};try{const r=Jn(
e);return{query:r.repository,...r,reference:e}}catch{return{query:"",repository:null,error:"Enter a Hugging Face model U\
RL or search by name and description."}}}function zE(t,e){try{const r=e?.(t)??t.localAvailability;if(r&&typeof r.then!="\
function")return r;r?.catch?.(()=>{})}catch{return{status:"unknown",reason:"Device compatibility could not be checked."}}
return{status:"unknown",reason:"Memory fit has not been verified on this device."}}const ca=t=>["checking","unavailable"].
includes(t?.status),Ri=t=>!!(t.browserSummary||t.requiresInspection);function iw(t,e,r,{includeUninspected:n=!1}={}){const s=ed(
e.query).query.toLowerCase().split(/\s+/).filter(Boolean);function i(c){const l=n&&Ri(c),d=c.browserOrigin??(c.source===
"stored"?"stored":c.source==="peers"?"peers":"catalog");if(e.source!=="all"&&d!==e.source&&!(e.source==="stored"&&c.stored===
!0))return!1;const f=qh(c),h=Jc(c);if(e.task!=="all"&&f!==e.task&&!(l&&f==="unknown")||e.precision!=="all"&&h!==e.precision&&
!(l&&(!h||h==="unknown")))return!1;if(d!=="hub"){const b=[c.name,c.modelId,c.id,c.description,c.repository,c.model?.repository,
f,c.runtime,c.model?.runtime,h,c.source,d,d==="stored"?"local stored on this device":"",...c.tags??[]].join(" ").toLowerCase();
if(!s.every(g=>b.includes(g)))return!1}const p=c.totalBytes;if(e.size==="unknown"&&ni(p))return!1;if(e.size!=="all"&&e.size!==
"unknown"){if(ni(p)){if(e.size==="large"?p<8*1024**3:p>Number(e.size))return!1}else if(!l)return!1}const m=zE(c,r);return!(!l&&
(e.compatibility==="eligible"&&!c.browserPeerAvailable&&(ca(m)||c.loadable===!1||Ri(c))||e.compatibility==="setup"&&(Ri(
c)||!ca(m)&&c.loadable!==!1)))}const o=t.flatMap(c=>{const l=[c,...c.browserVariants??[]].filter(i),d=l.find(f=>!Ri(f))??
l[0];return d?[{...c,browserFilterPending:Ri(d),browserMatchingVariant:d===c?null:d.name??d.id}]:[]}),a=c=>ni(c.totalBytes)?
c.totalBytes:1/0;return o.sort((c,l)=>{if(e.sort!=="name"){if(a(c)===1/0&&a(l)!==1/0)return 1;if(a(l)===1/0&&a(c)!==1/0)
return-1;const d=(a(c)-a(l))*(e.sort==="largest"?-1:1);if(d)return d}return String(c.name??c.repository).localeCompare(String(
l.name??l.repository))||String(c.key).localeCompare(String(l.key))})}function Uo(t,e){const r=t.manifestCid??t.package?.
manifestCid;return e.filter(n=>!n.local&&n.available===!0&&(n.key===t.key||r&&n.key===`peer:${r}`))}function Tn(t){return typeof t==
"string"&&/^[\w.-]+\/[\w.-]+$/.test(t)?`https://huggingface.co/${t}`:null}const CP=new Set(["quantized","converted","der\
ived","finetune","merge","adapter"]),la=(t,e)=>typeof t=="string"?t.slice(0,e):"";function ow(t){if(typeof t!="string")return null;
const e=ed(t),r=e.repository??t;return e.error||!Tn(r)?null:{repository:r,key:`${r.toLowerCase()}@${e.revision??"main"}`,
reference:e.revision?`${Tn(r)}/tree/${e.revision}`:r}}function TP(t,e){if(!t||!Tn(t.repository)||t.repository.length>160||
typeof t.sourceRepository!="string"||t.sourceRepository.toLowerCase()!==e.toLowerCase()||t.repository.toLowerCase()===e.
toLowerCase()||!CP.has(t.relationship)||t.evidence?.kind!=="publisher-base-model"||!/^[a-f0-9]{40}$/i.test(t.evidence.revision??
"")||t.revision&&t.revision!==t.evidence.revision)return null;const r=[...new Set((Array.isArray(t.formats)?t.formats:[]).
filter(s=>["ONNX","GGUF"].includes(s)))];if(!r.length)return null;const n=t.evidence.revision.toLowerCase();return{repository:t.
repository,name:la(t.name,256)||t.repository,description:la(t.description,4e3),task:la(t.task,64)||void 0,formats:r,revision:n,
sourceRepository:e,relationship:t.relationship,reference:`${Tn(t.repository)}/tree/${n}`,status:"candidate",requiresInspection:!0}}
function RP({findConversions:t,onChange:e=()=>{}}={}){const r=new Map;let n=null,s=!1;function i(a,c){for(r.delete(a),r.
set(a,c);r.size>32;)r.delete(r.keys().next().value)}function o(){if(!n)return;const a=n;n=null,a.controller.abort(),i(a.
key,{status:"cancelled",items:[]}),e()}return{get:a=>r.get(ow(a)?.key),cancel:o,async find(a){const c=ow(a);if(s||!t||!c)
return;const l=r.get(c.key);if(l?.status==="complete"||l?.status==="pending"&&n?.key===c.key)return;o();const d={...c,controller:new AbortController};
n=d,i(d.key,{status:"pending",items:[]}),e();try{const f=await t(d.reference,{signal:d.controller.signal});if(s||n!==d||
d.controller.signal.aborted)return;if(!f||!Array.isArray(f.items))throw new Error("Invalid related-model response");const h=[
...new Map(f.items.slice(0,100).map(p=>TP(p,d.repository)).filter(Boolean).map(p=>[`${p.repository}@${p.revision}`,p])).
values()].slice(0,24);i(d.key,{status:"complete",items:h,warning:la(f.warning,1e3),cached:f.cached===!0})}catch(f){!s&&n===
d&&!d.controller.signal.aborted&&i(d.key,{status:"error",items:[],error:la(f?.message??String(f),1e3)})}finally{n===d&&(n=
null,e())}},dispose(){s=!0,o(),r.clear()}}}const ue=(t,e,r)=>{const n=document.createElement(t);return e!==void 0&&(n.textContent=
String(e)),r&&(n.className=r),n},Or=t=>{const e=ue("button",t);return e.type="button",e},MP=t=>({stored:"Stored on this \
device",peers:"Peer files",hub:"Hugging Face search",catalog:"Catalog"})[t.browserOrigin]??(t.source==="stored"?"Stored \
on this device":t.source==="peers"?"Peer files":"Catalog"),hf=t=>Ri(t)?"Needs inspection":t.loadable===!1&&!t.inferenceOnly?
"Unsupported":t.browserOrigin==="hub"||t.inferenceOnly||["stored","peers"].includes(t.source)?"Candidate":"Catalog",Fo=t=>String(
t?.message??t??"Request failed").slice(0,1e3);function BP({container:t,getSources:e=()=>[],getTargets:r=()=>[],searchModels:n,
inspectModel:s,findConversions:i,getCompatibility:o,onLoad:a,onUsePeer:c,onSetup:l,storedContent:d,hasStoredModels:f=()=>!1,
onStoredOpen:h,onConfigure:p,onDismiss:m,keepOpenOnAction:b=!1}={}){if(!t?.append)throw new TypeError("A model browser c\
ontainer is required");const g=ue("dialog",void 0,"pc-model-browser");g.id=`model-browser-dialog-${crypto.randomUUID()}`;
const u=ue("h2","Models");u.id=`model-browser-${crypto.randomUUID()}`,g.setAttribute("aria-labelledby",u.id);const y=ue(
"div",void 0,"pc-browser-header"),E=Or("Done"),k=ue("div",void 0,"pc-browser-header-actions"),A=Or("Config");A.hidden=!p,
A.onclick=()=>p?.(),k.append(A,E),y.append(u,k);const S=ue("p","","pc-browser-status");S.setAttribute("role","status"),S.
hidden=!0;const v=ue("section",void 0,"pc-browser-page");v.hidden=!0,v.tabIndex=-1;const w=ue("div",void 0,"pc-browser-t\
abs");w.setAttribute("role","tablist"),w.setAttribute("aria-label","Model library");const I={},C={};for(const[D,Z]of[["s\
tored","Stored models"],["browse","Browse models"]]){if(D==="stored"&&!d)continue;const ee=Or(Z),K=ue("section",void 0,`\
pc-browser-tab-panel pc-browser-${D}-panel`);ee.id=`${g.id}-${D}-tab`,K.id=`${g.id}-${D}-panel`,ee.setAttribute("role","\
tab"),ee.setAttribute("aria-controls",K.id),K.setAttribute("role","tabpanel"),K.setAttribute("aria-labelledby",ee.id),I[D]=
ee,C[D]=K,w.append(ee)}const T=ue("p","","pc-browser-status");T.setAttribute("role","status"),d&&(d.classList.add("pc-br\
owser-stored-content"),C.stored.append(T,d)),w.hidden=!d;const P=ue("div",void 0,"pc-browser-controls"),L=ue("div",void 0,
"pc-browser-search"),N=ue("input");N.type="search",N.maxLength=256,N.autofocus=!0,N.placeholder="Name, description or hu\
ggingface.co/owner/model",N.setAttribute("aria-label","Search models"),L.append(N),P.append(L);const H=ue("details",void 0,
"pc-browser-filters"),te=ue("summary"),X=ue("span","Filters and sorting"),j=ue("span","","pc-browser-summary");te.append(
X,j);const ae=ue("div",void 0,"pc-browser-filter-fields");H.append(te,ae),P.append(H);const fe=matchMedia("(max-width:65\
0px)"),Te=()=>{H.open=!fe.matches,fe.matches||(R=!1),at()};H.open=!fe.matches,fe.addEventListener("change",Te);const he={};
function ye(D,Z,ee){const K=ue("select");K.setAttribute("aria-label",Z);const re=ue("label",Z);for(const[_e,Je]of ee){const Ee=ue(
"option",Je);Ee.value=_e,K.append(Ee)}return re.append(K),ae.append(re),he[D]=K,K}ye("source","Source",[["all","All sour\
ces"],["catalog","Catalog"],["stored","Stored on this device"],["peers","Peer files"],["hub","Hugging Face search"]]),ye(
"task","Task",[["all","All tasks"],["text-generation","Text and code"],["image-text-to-text","Image understanding"],["te\
xt-to-image","Image generation"],["automatic-speech-recognition","Speech recognition"],["text-to-speech","Speech synthes\
is"]]),ye("size","Package size",[["all","Any size"],[String(500*1024**2),"Up to 500 MiB"],[String(1024**3),"Up to 1 GiB"],
[String(4*1024**3),"Up to 4 GiB"],[String(8*1024**3),"Up to 8 GiB"],["large","8 GiB and larger"],["unknown","Unknown siz\
e"]]),ye("precision","Precision",[["all","All precisions"]]),ye("compatibility","Compatibility",[["all","All models"],["\
eligible","Usable locally or via peers"],["setup","Needs local setup / unsupported"]]),ye("sort","Sort models",[["smalle\
st","Package size: smallest first"],["largest","Package size: largest first"],["name","Name"]]);const F=ue("p","","pc-br\
owser-status");F.setAttribute("role","status"),F.setAttribute("aria-live","polite");const Y=ue("div",void 0,"pc-browser-\
content"),q=ue("ul",void 0,"pc-browser-results");q.setAttribute("aria-label","Model results");const pe=ue("section",void 0,
"pc-browser-details");pe.setAttribute("aria-label","Model details"),Y.append(q,pe);const ve=Or("More Hugging Face result\
s");ve.className="pc-browser-more",ve.hidden=!0,C.browse.append(P,F,Y,ve),g.append(y,S,w,...Object.values(C),v),t.append(
g);let ce=!1,de=!1,ge=!1,be=null,_r=null,Ke,tt,gt,Ie=0,Fe=0,kt=[],vr=null,Rt="",Mt=!1,bt=null,xt=!1,Cr=!1,ze="",rr="",Ht,
Dr,Tr,_=null,B="browse",R=!1,V=0,O,G=0,ie,xe,se=!1;const St=new Map,ut=new Map,ft=RP({findConversions:i,onChange:()=>qe()});
function at(){g.classList.toggle("pc-browser-show-details",!ie&&fe.matches&&B==="browse"&&R),u.textContent=ie?.title??"M\
odels",w.hidden=!!ie||!d,v.hidden=!ie,A.hidden=!p||!!ie,A.disabled=de||ge||se,E.disabled=se,E.textContent=ie?.buttonLabel??
"Done";for(const[D,Z]of Object.entries(C)){const ee=D===B;Z.hidden=!!ie||!ee,I[D].setAttribute("aria-selected",String(ee)),
I[D].tabIndex=ee?0:-1,I[D].disabled=de||ge}E.title=ie?"Return to Models":fe.matches&&R?"Return to model results":"Close \
Models"}function yt({focus:D=!0}={}){R=!1,at(),q.scrollTop=V,D&&g.open&&(q.querySelector('[aria-pressed="true"]')??N).focus(
{preventScroll:!0})}function nr(){!fe.matches||B!=="browse"||(V=q.scrollTop,R=!0,at(),E.focus({preventScroll:!0}))}function W(){
O?.abort(),O=null,G++}function Kr(){if(W(),!h)return;const D=new AbortController,Z=G;O=D,T.textContent="",Promise.resolve().
then(()=>{if(!D.signal.aborted)return h({signal:D.signal})}).catch(ee=>{!ce&&!D.signal.aborted&&Z===G&&(T.textContent=`S\
tored models unavailable: ${Fo(ee)}`)}).finally(()=>{O===D&&(O=null)})}function ls(D,{focus:Z=!1,refreshStored:ee=!0}={}){
C[D]||(D="browse"),B==="browse"&&!R&&(V=q.scrollTop),B!==D&&(W(),D==="stored"&&Pt()),B=D,R=!1,at(),D==="browse"?(qe(),q.
scrollTop=V,g.open&&xt&&!tt&&!de&&ht(Cr)):ee&&g.open&&Kr(),Z&&I[D].focus({preventScroll:!0})}q.addEventListener("scroll",
()=>{B==="browse"&&!R&&(V=q.scrollTop)});for(const[D,Z]of Object.entries(I))Z.onclick=()=>{!de&&!ge&&B!==D&&ls(D,{focus:!0})},
Z.addEventListener("keydown",ee=>{const K=Object.keys(I),re=K.indexOf(D),_e=ee.key==="Home"?K[0]:ee.key==="End"?K.at(-1):
ee.key==="ArrowRight"?K[(re+1)%K.length]:ee.key==="ArrowLeft"?K[(re+K.length-1)%K.length]:null;_e&&!de&&!ge&&(ee.preventDefault(),
ls(_e,{focus:!0,refreshStored:_e!==B}))});function gn(){return(e()??[]).filter(D=>D&&typeof D.key=="string")}function Qr(){
return(r()??[]).filter(Boolean)}function bn(){const D=gn(),Z=Qr();for(const K of Z)K.local||K.available!==!0||D.some(re=>Uo(
re,[K]).length)||D.push({...K,source:"peers",inferenceOnly:!0,loadable:!1,manifestCid:K.manifestCid??K.key?.replace(/^peer:/,
""),reason:"Files not advertised; use peer inference."});const ee=kt.map(K=>({...K,key:K.browserKey??`hub:${K.repository}`,
browserOrigin:"hub",browserSummary:!0}));for(const K of ee){const re=St.get(K.inspectReference??K.repository),_e=Vt(re);
if(_e){const Je=re.variants.map(Ee=>cn(K,re,Ee));Object.assign(K,cn(K,re,_e),{browserVariants:Je})}else re&&Object.assign(
K,{browserSummary:!1,loadable:!1,revision:re.revision,description:re.description??K.description,license:re.license,reason:"\
No supported package variants were found in this repository."})}return[...D,...ee].map(K=>({...K,browserPeerAvailable:Uo(
K,Z).length>0}))}function Vt(D){if(!D?.variants?.length)return null;const Z=[...D.variants].sort((ee,K)=>(ni(ee.totalBytes)?
ee.totalBytes:1/0)-(ni(K.totalBytes)?K.totalBytes:1/0)||String(ee.name??ee.key).localeCompare(String(K.name??K.key)));return Z.
find(ee=>(ee.key??ee.id)===ut.get(D.browserReference??D.repository))??Z[0]}function cn(D,Z,ee){const K=ee.package??{};return{
...K,...D,...ee,key:D.key,browserOrigin:"hub",browserSummary:!1,name:ee.name??D.name??D.repository,repository:Z.repository,
revision:Z.revision,description:Z.description??D.description,license:ee.license??Z.license??K.license??D.license,package:ee.
package,loadable:ee.loadable===!0&&!!ee.package,model:ee.model??K.model,task:ee.task??K.model?.task,dtype:ee.dtype??K.model?.
dtype,localAvailability:ee.localAvailability??K.localAvailability}}function sr(){return{query:N.value,...Object.fromEntries(
Object.entries(he).map(([D,Z])=>[D,Z.value]))}}function ir(D){return zE(D.package??D,o)}function yn(D){return D&&!D.browserSummary&&
D.loadable!==!1&&!D.requiresInspection&&(D.browserOrigin!=="hub"||!!D.package)&&!ca(ir(D))}function At(D){return iw([{...D,
browserVariants:[]}],sr(),ir,{includeUninspected:!0}).length>0}function De(D){const Z=D?.repository??D?.model?.repository,
ee=St.get(D?.inspectReference??Z);return Tn(Z)&&/^[a-f0-9]{40}$/i.test(ee?.revision??"")?`${Tn(Z)}/tree/${ee.revision}`:
null}function lt(D){const Z=he.precision.value,ee=new Set(D.flatMap(_e=>[_e,..._e.browserVariants??[]]).map(Jc).filter(_e=>_e&&
_e!=="unknown"));Z!=="all"&&ee.add(Z);const K=[...ee].sort().join(`
`);if(K===Tr)return;Tr=K;const re=[ue("option","All precisions")];re[0].value="all";for(const _e of[...ee].sort()){const Je=ue(
"option",_e);Je.value=_e,re.push(Je)}he.precision.replaceChildren(...re),he.precision.value=Z}function qe({revealSelected:D=!1}={}){
if(ce)return;const Z=bn();lt(Z);const ee=iw(Z,sr(),me=>ir(me),{includeUninspected:!0}),K=ee.filter(me=>me.browserFilterPending),
re=[...ee.filter(me=>!me.browserFilterPending),...K],_e=_===be&&!re.some(me=>me.key===be)?Z.find(me=>me.key===be):null;_r=
_e||re.some(me=>me.key===be)?be:re[0]?.key??null;const Je=document.activeElement?.closest?.("[data-model-key]")?.dataset.
modelKey,Ee=B==="browse"&&!R?q.scrollTop:V,_t=new Map([...q.children].map(me=>[me.querySelector("[data-model-key]")?.dataset.
modelKey,me])),Ge=[],pt=me=>_t.get(void 0)?.isEqualNode(me)?_t.get(void 0):me;for(const me of re){me===K[0]&&Ge.push(pt(
ue("li","Needs inspection — package filters are not yet verified","pc-browser-candidates")));const ke=ue("li"),Be=Or("");
Be.className="pc-browser-result",Be.dataset.modelKey=me.key,Be.setAttribute("aria-pressed",String(me.key===_r)),Be.append(
ue("strong",me.name??me.repository??me.modelId),ue("small",me.repository??me.model?.repository??me.modelId??""),ue("smal\
l",`${MP(me)} · ${Oo(me.totalBytes)}${ni(me.totalBytes)?" package":""} · ${Jc(me)||"Precision unknown"}`),ue("small",`${hf(
me)} · ${me.browserSummary?"Inspect variants":qh(me)}`)),me.browserMatchingVariant&&Be.append(ue("small",`Matching vari\
ant: ${me.browserMatchingVariant}`)),Be.disabled=de||ge;const wt=me.key;Be.onclick=()=>{if(de||ge||ce)return;const Ei=bn().
find(po=>po.key===wt);if(!Ei)return;be=wt,_=null,ze="",rr="",qe({revealSelected:!0}),nr();const ho=Ei.inspectReference??
Ei.repository;Ei.browserOrigin==="hub"&&!St.has(ho)&&je(ho)},ke.append(Be);const Rr=_t.get(wt);Ge.push(Rr?.isEqualNode(ke)?
Rr:ke)}re.length||Ge.push(pt(ue("li","No matching models. Clear a filter or try another search.","pc-browser-empty")));let it=q.
firstChild;for(const me of Ge)me===it?it=it.nextSibling:q.insertBefore(me,it);for(;it;){const me=it.nextSibling;it.remove(),
it=me}q.scrollTop=Ee,V=Ee,Je&&[...q.querySelectorAll("[data-model-key]")].find(me=>me.dataset.modelKey===Je)?.focus({preventScroll:!0}),
j.textContent=`${re.length} model${re.length===1?"":"s"}`,j.title=K.length?`${K.length} need inspection before package f\
ilters can be verified`:"";const En=Object.entries(he).filter(([me,ke])=>me!=="sort"&&ke.value!=="all").length;X.textContent=
`Filters and sorting${En?` (${En})`:""}`,X.title=En?`${En} active filters`:"",F.textContent=rr||ze||(bt?`Inspecting ${bt}\
…`:"")||(Mt?"Searching Hugging Face metadata…":Rt)||"",ve.hidden=!vr,ve.disabled=de||ge||Mt;for(const me of[N,...Object.
values(he)])me.disabled=de||ge;if(Re(_e?{..._e,browserHiddenByFilters:!0}:re.find(me=>me.key===_r)),D&&g.open&&B==="brow\
se"&&!R){const me=q.querySelector('[aria-pressed="true"]');if(me){const ke=me.getBoundingClientRect(),Be=q.getBoundingClientRect();
ke.top<Be.top?q.scrollTop+=ke.top-Be.top:ke.bottom>Be.bottom&&(q.scrollTop+=Math.min(ke.top-Be.top,ke.bottom-Be.bottom)),
V=q.scrollTop}}at()}function Re(D){const Z=D?.repository??D?.model?.repository,ee=JSON.stringify({source:D,compatibility:D?
ir(D):null,targets:D?Uo(D,Qr()):[],conversions:ft.get(De(D)),selectedMatches:D?At(D):!1,busy:de,actionPending:ge,inspecting:bt});
if(ee===Dr)return;Dr=ee;const K=pe.contains(document.activeElement)?document.activeElement.dataset.browserControl:null;if(pe.
replaceChildren(),!D){pe.append(ue("p","Choose a model to see its package, compatibility and available peers.","pc-brows\
er-note"));return}const re=ue("div");if(pe.append(re),re.append(ue("span",hf(D),"pc-browser-badge"),ue("h3",D.name??D.repository)),
D.description&&re.append(ue("p",String(D.description).slice(0,4e3),"pc-browser-note")),D.browserMatchingVariant&&re.append(
ue("p",`Matching variant: ${D.browserMatchingVariant}. Your selected variant is unchanged; choose a matching package bel\
ow.`,"pc-browser-note")),D.browserFilterPending&&re.append(ue("p","Needs inspection: size, precision and compatibility f\
ilters cannot be confirmed until the package is inspected.","pc-browser-warning")),D.browserHiddenByFilters||!At(D)){re.
append(ue("p","The selected package does not match your current filters. Change the filters or choose a matching variant\
 before loading.","pc-browser-warning"));const ke=Or("Show selected package");ke.disabled=de||ge,ke.title="Clear package\
 filters and show this Hugging Face selection; keep the search text.",ke.onclick=()=>{if(!(de||ge)){for(const Be of["tas\
k","size","precision","compatibility"])he[Be].value="all";["all","hub"].includes(he.source.value)||(he.source.value="hub"),
qe({revealSelected:!0})}},re.append(ke)}const _e=D.inspectReference??Z,Je=Tn(Z);if(Je){const ke=ue("a",Z);ke.href=Je,ke.
target="_blank",ke.rel="noopener noreferrer",re.append(ke)}const Ee=St.get(_e);if(D.browserConversion&&Jr(re,D.browserConversion),
D.browserOrigin==="hub"&&Ee?.variants?.length){const ke=ue("label","Package variant","pc-browser-variants"),Be=ue("selec\
t");Be.setAttribute("aria-label","Package variant");for(const wt of Ee.variants){const Rr=ue("option",`${wt.name??wt.id??
wt.key} · ${wt.dtype??"Precision unknown"} · ${Oo(wt.totalBytes)}${wt.requiresInspection?" · Needs inspection":wt.loadable===
!1?" · Unsupported":""}`);Rr.value=wt.key??wt.id,Be.append(Rr)}Be.value=Vt(Ee)?.key??Vt(Ee)?.id,Be.disabled=de||ge,Be.onchange=
()=>{const wt=Be.value;ut.set(_e,wt),qe({revealSelected:!0}),Ee.variants.find(Rr=>(Rr.key??Rr.id)===wt)?.requiresInspection&&
je(_e,wt)},ke.append(Be),re.append(ke)}const _t=ue("dl",void 0,"pc-browser-facts"),Ge=(ke,Be)=>_t.append(ue("dt",ke),ue(
"dd",Be));Ge("Task",D.browserSummary&&!D.task?"Inspect to determine":qh(D)),Ge("Package",Oo(D.totalBytes)),Ge("Precision",
Jc(D)||"Unknown"),Ge("License",typeof D.license=="string"?D.license:D.license?.spdx??D.license?.join?.(", ")??"Not suppl\
ied"),Ge("Revision",D.revision??D.model?.revision??"Not inspected");const pt=ir(D);Ge("Estimated RAM",Oo(pt.cpuBytes>0?pt.
cpuBytes:void 0)),Ge("Estimated GPU memory",Oo(pt.gpuBytes>0?pt.gpuBytes:void 0)),re.append(_t),typeof D.license?.notice==
"string"&&re.append(ue("p",D.license.notice.slice(0,1e3),"pc-browser-note")),re.append(ue("p",D.browserSummary?"Search m\
etadata is not a verified runnable package. Inspect its variants before loading.":D.loadable===!1?D.reason||"This packag\
e is not supported by the current runtimes.":pt.reason||(pt.status==="available"?"Required device features are available\
.":"Memory fit is unverified; this browser cannot report free GPU memory."),ca(pt)||D.loadable===!1?"pc-browser-warning":
"pc-browser-note")),re.append(ue("p",hf(D)==="Catalog"?"Catalog provenance does not guarantee model quality or performan\
ce on this device.":"Candidate packages have not necessarily been tested on this device. Review the model card and licen\
se.","pc-browser-note")),Ee&&i&&De(D)&&Ws(re,D,Z);const it=ue("div",void 0,"pc-browser-actions");if(D.browserSummary||D.
requiresInspection){const ke=Or(D.requiresInspection?"Inspect selected variant":"Inspect variants");ke.disabled=de||ge||
bt===_e||!s,ke.onclick=()=>{be=D.key;const Be=Vt(Ee);je(_e,D.requiresInspection?Be?.key??Be?.id:void 0)},it.append(ke)}const En=Or(
"Load");En.disabled=de||ge||!yn(D)||!At(D)||!a,En.onclick=()=>{const ke=bn().find(Be=>Be.key===D.key);if(de||ge||!yn(ke)||
!At(ke)){qe();return}wn(()=>a(ke.package??ke))},it.append(En);const me=Uo(D,Qr());for(const ke of me){const Be=Or(`Use p\
eer${ke.busy?" (busy)":""}`);Be.disabled=de||ge||!c,Be.title=`${ke.providerCount??1} online provider${ke.providerCount===
1?"":"s"}; uses the peer without downloading model weights.`,Be.onclick=()=>{const wt=Uo(D,Qr()).find(Rr=>Rr.key===ke.key);
!de&&!ge&&wt?wn(()=>c(wt.key)):qe()},it.append(Be)}if(!D.browserSummary&&ca(pt)&&l){const ke=Or("Setup help");ke.disabled=
de||ge,ke.onclick=()=>void wn(()=>l(D.package??D)),it.append(ke)}if(me.length&&re.append(ue("p","Peer inference stays av\
ailable even when this device cannot load the model. The selected peer receives your prompt.","pc-browser-note")),pe.append(
it),K){const ke=[...pe.querySelectorAll("[data-browser-control]")].find(Be=>Be.dataset.browserControl===K);ke?ke.focus({
preventScroll:!0}):K==="conversion-search"&&pe.querySelector("[data-conversion-repository]")?.focus({preventScroll:!0})}}
function Jr(D,Z){D.append(ue("p",`Publisher-declared source: ${Z.sourceRepository}. Relationship: ${Z.relationship}. Thi\
s does not prove equivalent weights or the same source revision.`,"pc-browser-note"));const ee=Or("Back to source model");
ee.disabled=de||ge,ee.onclick=()=>{de||ge||!bn().some(K=>K.key===Z.sourceKey)||(be=Z.sourceKey,_=be,qe({revealSelected:!0}))},
D.append(ee)}function Ws(D,Z,ee){const K=De(Z),re=ft.get(K),_e=ue("section",void 0,"pc-browser-conversions");_e.setAttribute(
"aria-label","Related browser packages"),_e.append(ue("h4","Related browser packages"));const Je=ue("p","","pc-browser-n\
ote");if(Je.setAttribute("role","status"),Je.textContent=re?.status==="pending"?"Finding publisher-declared conversions…":
re?.status==="error"?`Conversion search unavailable: ${re.error}`:re?.status==="cancelled"?"Conversion search cancelled.\
 You can retry.":re?.status==="complete"?[re.items.length?"Candidates need package inspection before loading.":"No publi\
sher-declared ONNX or GGUF relatives were found.",re.warning,re.cached?"Showing cached conversion metadata.":""].filter(
Boolean).join(" "):"Find ONNX or GGUF packages whose publisher identifies this source model.",_e.append(Je),re?.status!==
"complete"){const Ee=Or(re?.status==="pending"?"Cancel conversion search":"Find browser conversions");Ee.dataset.browserControl=
"conversion-search",Ee.disabled=de||ge,Ee.onclick=()=>{de||ge||(_=Z.key,re?.status==="pending"?ft.cancel():ft.find(K))},
_e.append(Ee)}for(const Ee of re?.items??[]){const _t=Or("");_t.className="pc-browser-conversion",_t.dataset.conversionRepository=
Ee.repository,_t.dataset.browserControl=`conversion:${Ee.repository}`,_t.append(ue("strong",Ee.name),ue("small",Ee.repository),
ue("small",`${Ee.formats.join(" / ")} · ${Ee.relationship} · Candidate · Needs inspection`),ue("small",`Publisher-dec\
lared source: ${Ee.sourceRepository}`)),_t.disabled=de||ge,_t.onclick=()=>{if(de||ge)return;const Ge=`hub:${Ee.repository}\
@${Ee.revision}`,pt={repository:Ee.repository,name:Ee.name,description:Ee.description,task:Ee.task,browserKey:Ge,inspectReference:Ee.
reference,browserConversion:{sourceKey:Z.key,sourceRepository:ee,relationship:Ee.relationship}};kt=[...kt.filter(it=>(it.
browserKey??`hub:${it.repository}`)!==Ge),pt],be=Ge,_=Ge,ze="",rr="",qe({revealSelected:!0}),St.has(Ee.reference)||je(Ee.
reference)},_e.append(_t)}D.append(_e)}async function wn(D){if(!(ce||de||ge)){ge=!0,b||Hs(),qe();try{await D()}catch(Z){
ce||(rr=Fo(Z))}finally{ge=!1,qe()}}}async function je(D,Z){const ee=ed(D),K=ee.repository??D;if(ce||de||!s||!Tn(K))return;
_=be;const re=Z?St.get(D)?.revision:null,_e=ee.revision??re,Je=Z&&/^[a-f0-9]{40}$/i.test(re??"")?`${Tn(K)}/tree/${re}`:D;
gt?.abort();const Ee=new AbortController;gt=Ee;const _t=++Fe,Ge=be;bt=D,ze="",qe();try{const pt=await s(Je,{selectedVariant:Z,
signal:Ee.signal});if(ce||Ee.signal.aborted||_t!==Fe)return;if(!pt||pt.repository!==K||!Array.isArray(pt.variants))throw new Error(
"Invalid model inspection response");if(_e&&pt.revision!==_e)throw new Error("Inspection returned a different model revi\
sion");St.set(D,{...pt,browserReference:D}),pt.variants.length||(ze="No supported package variants were found in this re\
pository.")}catch(pt){!ce&&!Ee.signal.aborted&&_t===Fe&&(ze=`Inspection failed: ${Fo(pt)}`)}finally{_t===Fe&&(bt=null,gt=
null,qe({revealSelected:be===Ge}))}}function Pt(){clearTimeout(Ke),tt?.abort(),gt?.abort(),ft.cancel(),++Ie,++Fe,tt=null,
gt=null,Mt=!1,bt=null}async function ht(D=!1){if(clearTimeout(Ke),ce||de||ie||!g.open||B!=="browse")return;const Z=ed(N.
value);if(Z.error){xt=!1,Rt=Z.error,qe();return}if(!vn())return;tt?.abort();const ee=new AbortController;tt=ee,xt=!0,Cr=
D;const K=++Ie;Mt=!0,Rt="",qe();try{const re=await n({query:Z.query,task:he.task.value==="all"?void 0:he.task.value,cursor:D?
vr:void 0,signal:ee.signal});if(ce||ee.signal.aborted||K!==Ie)return;if(!re||!Array.isArray(re.items))throw new Error("I\
nvalid search response");let _e=re.items.filter(Je=>Je&&Tn(Je.repository));if(Z.repository){const Je=_e.find(Ee=>Ee.repository===
Z.repository);_e=_e.filter(Ee=>Ee.repository!==Z.repository),_e.unshift({...Je,repository:Z.repository,name:Je?.name??Z.
repository,inspectReference:Z.reference,browserKey:`hub:${Z.repository}${Z.revision?"@"+Z.revision:""}`})}kt=[...new Map(
[...D?kt:[],..._e].map(Je=>[Je.repository,Je])).values()].slice(0,200),vr=kt.length<200?re.nextCursor??null:null,Rt=[re.
warning,re.cached?"Showing cached Hugging Face results.":""].filter(Boolean).join(" ")}catch(re){!ce&&!ee.signal.aborted&&
K===Ie&&(Rt=`Hugging Face search unavailable: ${Fo(re)}. Catalog, stored models and peer files remain available.`)}finally{
K===Ie&&(xt=!1,Mt=!1,tt=null,qe())}}function vn(){return!!(n&&["all","hub"].includes(he.source.value)&&(N.value.trim()||
he.source.value==="hub"))}function wi(){Pt(),kt=[],vr=null,Rt="",ze="",rr="",_=null,xt=vn(),Cr=!1,qe(),xt&&(Ke=setTimeout(
()=>void ht(),350))}N.addEventListener("input",wi),N.addEventListener("keydown",D=>{D.key==="Enter"&&(D.preventDefault(),
ht())});for(const[D,Z]of Object.entries(he))Z.addEventListener("change",()=>{D==="task"||D==="source"?wi():qe()});ve.onclick=
()=>void ht(!0);function Hs(){Pt(),W(),R=!1,at(),g.open&&g.close()}async function vi(){if(se)return;if(!ie&&fe.matches&&
B==="browse"&&R){yt();return}const D=ie?.onBack??m;if(!D){Hs();return}se=!0,at();try{await D()}catch(Z){ce||(S.textContent=
`Could not close: ${Fo(Z)}. Try again.`,S.hidden=!1)}finally{se=!1,ce||at()}}return E.onclick=vi,g.addEventListener("can\
cel",D=>{D.preventDefault(),vi()}),g.addEventListener("close",()=>{g.open||(Pt(),W(),R=!1,at(),Ht?.isConnected&&Ht.focus(
{preventScroll:!0}))}),g.addEventListener("keydown",D=>{if(D.key==="Escape"){D.preventDefault(),vi();return}if(D.key!=="\
Tab")return;const Z=[...g.querySelectorAll("button,input,select,a[href],summary")].filter(re=>!re.disabled&&re.getClientRects().
length),ee=Z[0],K=Z.at(-1);D.shiftKey&&document.activeElement===ee&&(D.preventDefault(),K?.focus()),!D.shiftKey&&document.
activeElement===K&&(D.preventDefault(),ee?.focus())}),{element:g,setFeedback(D){ce||(S.textContent=String(D??"").slice(0,
2048),S.hidden=!S.textContent)},showPage({title:D,content:Z,onBack:ee,buttonLabel:K="Done"}){ce||(ie||(xe=document.activeElement),
Pt(),W(),ie={title:D,onBack:ee,buttonLabel:K},v.replaceChildren(Z),at(),g.open||g.showModal(),(v.querySelector("[autofoc\
us],button:not(:disabled),input:not(:disabled)")??E).focus({preventScroll:!0}))},showLibrary({refreshStored:D=!1}={}){if(!ce&&
(ie=null,v.replaceChildren(),at(),qe(),g.open)){const Z=xe;xe=null,(Z?.isConnected&&!Z.disabled&&Z.getClientRects().length?
Z:R?E:I[B]??N).focus({preventScroll:!0}),B==="stored"&&D?Kr():B==="browse"&&xt&&!tt&&!de&&ht(Cr)}},open({selectedKey:D,tab:Z,
refreshStored:ee=!0}={}){if(ce)return;D!==void 0&&(be=D,_!==D&&(_=null));const K=Z??(d&&f()?"stored":"browse");g.open||(Ht=
document.activeElement,B=C[K]?K:"browse",R=!1,at(),g.showModal()),ls(K,{refreshStored:ee}),B==="browse"?N.focus({preventScroll:!0}):
I.stored.focus({preventScroll:!0})},close(){!ce&&g.open&&Hs()},isStoredOpen:()=>!ce&&g.open&&!ie&&B==="stored",getActiveTab:()=>B,
refresh:qe,setBusy(D){const Z=de;de=!!D,de&&Pt(),qe(),Z&&!de&&g.open&&B==="browse"&&xt&&!tt&&ht(Cr)},dispose(){ce||(ce=!0,
Pt(),W(),fe.removeEventListener("change",Te),g.open&&g.close(),g.remove(),St.clear(),ut.clear(),ft.dispose())}}}function LP({
browser:t,onRequestClose:e}){const r=new Map;let n,s,i=!1;function o(){n=null,t.showLibrary({refreshStored:i}),i=!1}function a(){
return s||(t.setFeedback("Closing Models… Waiting for cleanup."),s=Promise.resolve().then(e).catch(c=>{throw o(),t.setFeedback(
`Could not close Models: ${c.message}. Click Done to retry.`),c}).finally(()=>{s=null}),s)}return{requestClose:a,showLibrary:o,
isShowing:c=>n===c,show(c,{closeWindow:l=!1,refreshStoredOnReturn:d=!1}={}){let f=r.get(c);if(!f){f=document.createElement(
"section"),f.className="pc-management-content";for(const h of[...c.children])h.classList.contains("pc-dialog-header")||f.
append(h);r.set(c,f)}n=c,i=d,t.showPage({title:c.querySelector("h2")?.textContent??"Models",content:f,buttonLabel:l?"Clo\
se Models":"Done",onBack:l?a:o})}}}let DP=0;function $P(t){const e=(ce,de,ge)=>{const be=document.createElement(ce);return de&&
(be.textContent=de),ge&&(be.className=ge),be},r=ce=>{const de=e("button",ce);return de.type="button",de},n=(ce,de)=>{const ge=e(
"label",ce);return ge.append(de),ge},s=(ce,de,ge)=>{const be=e(ce);return be.setAttribute("aria-label",de),ge&&(be.maxLength=
ge),be},i=e("dialog",null,"pc-agent-console"),o=e("h2","Agents");o.id=`pc-agents-${++DP}`,i.setAttribute("aria-labelledb\
y",o.id);const a=r("Done"),c=e("header");c.append(o,a);const l=e("p","","pc-agent-status");l.setAttribute("role","status"),
l.setAttribute("aria-live","polite");const d=e("div",null,"pc-agent-body"),f=e("div",null,"pc-agent-main"),h=e("aside");
h.setAttribute("aria-label","Saved agents");const p=r("New agent"),m=r("Restore as new"),b=s("input","Restore agent file");
b.type="file",b.accept=".json,application/json",b.hidden=!0;const g=e("div",null,"pc-agent-buttons");g.append(p,m,b);const u=e(
"div",null,"pc-agent-list");u.setAttribute("aria-label","Agent list"),h.append(g,u);const y=e("section",null,"pc-agent-w\
orkspace"),E=e("h3","Create or select an agent"),k=e("p","","pc-agent-note"),A=e("p","","pc-agent-note"),S=e("p","","pc-\
agent-record-text"),v=e("p","","pc-agent-record-text"),w=e("dl",null,"pc-agent-record");for(const[ce,de]of[["Instruction\
s",S],["Goals",A],["Saved memory summary",v]]){const ge=e("dd");ge.append(de),w.append(e("dt",ce),ge)}const I=e("div",null,
"pc-agent-buttons"),C=r("Chat"),T=r("Edit agent"),P=r("Pause"),L=r("Resume"),N=r("Export"),H=r("Delete agent");I.append(
C,T,P,L,N,H);const te=e("p","","pc-agent-policy"),X=e("p","Chat opens this agent in the main conversation. Resume allows\
 new messages; it never starts a task.","pc-agent-note");y.append(E,k,I,te,w,X),f.append(h,y);const j=e("form",null,"pc-\
agent-editor");j.hidden=!0;const ae=e("h3","New agent"),fe=s("input","Agent name",120);fe.required=!0;const Te=s("textar\
ea","Instructions",16e3);Te.rows=4;const he=s("textarea","Goals",8e3);he.rows=3;const ye=s("textarea","Saved memory summ\
ary",16e3);ye.rows=4;const F=s("select","Inference policy");for(const[ce,de]of[["local-only","Local only"],["network-ass\
isted","Mixed · local first, then peers"]]){const ge=e("option",de);ge.value=ce,F.append(ge)}const Y=e("p","Mixed uses \
a compatible local model first, then an available peer. Your instructions, goals, saved context, messages and attachment\
s may be sent to that peer. Local only keeps execution on this device.","pc-agent-policy"),q=r("Save agent");q.type="sub\
mit";const pe=r("Cancel edit"),ve=e("div",null,"pc-agent-buttons");return ve.append(q,pe),j.append(ae,n("Name",fe),n("In\
structions",Te),n("Goals · one per line",he),n("Saved memory summary",ye),n("Inference policy",F),Y,ve),d.append(f,j),i.
append(c,l,d),t.append(i),{element:i,close:a,status:l,body:d,main:f,create:p,restore:m,restoreFile:b,list:u,workspace:y,
name:E,metadata:k,identity:A,instructionsText:S,summaryText:v,chat:C,edit:T,pause:P,resume:L,exportButton:N,remove:H,policy:te,
editor:j,editorHeading:ae,agentName:fe,instructions:Te,goals:he,summary:ye,mode:F,save:q,cancelEdit:pe}}const pf=t=>String(
t?.message||t||"Agent operation failed"),NP=new Set(["queued","running","cancelling"]);function PP({container:t,controller:e,
onChat:r}={}){if(!t||!e)throw new TypeError("Agent Console needs a container and controller");const n=$P(t);let s=!1,i=null,
o=null,a=[],c=0,l=null,d=null,f=null,h=null,p=!0,m=!1,b=null,g=null;const u=new Map,y=()=>!!(l||d||i&&i!==o?.agentId||NP.
has(o?.activity?.status));function E(L,N=!1){s||(n.status.textContent=L,n.status.dataset.error=String(N))}function k(){const L=y(),
N=!!o,H=o?.status==="paused",te=!!(o?.activity?.unsaved||o?.recoveryRequired);for(const X of[n.create,n.restore,n.edit,n.
remove,n.exportButton])X.disabled=L||X!==n.create&&X!==n.restore&&!N;n.restore.hidden=typeof e.importAsNew!="function",n.
exportButton.hidden=typeof e.export!="function",n.chat.hidden=typeof r!="function",n.chat.disabled=!N||L,n.pause.disabled=
!N||H||!!(l||d),n.resume.disabled=!N||!H&&!te||L;for(const X of[n.agentName,n.instructions,n.goals,n.summary,n.mode,n.save,
n.cancelEdit])X.disabled=!!(l||d);for(const X of n.list.querySelectorAll("button"))X.disabled=L;n.element.setAttribute("\
aria-busy",String(!!(l||d)))}function A(){if(n.list.replaceChildren(),!a.length){const L=document.createElement("p");L.className=
"pc-agent-note",L.textContent="No saved agents. Create one to keep its identity and context on this device.",n.list.append(
L)}for(const L of a){const N=document.createElement("button");N.type="button",N.dataset.agentId=L.agentId,N.setAttribute(
"aria-current",String(L.agentId===i)),N.append(document.createTextNode(L.identity?.name||"Unnamed agent"));const H=document.
createElement("small");H.textContent=L.activity?.status||L.status||"Saved",N.append(H),N.addEventListener("click",()=>{y()||
s||(i=L.agentId,k(),v())}),n.list.append(N)}}function S(){n.name.textContent=o?.identity?.name||"Create or select an age\
nt",n.metadata.textContent=o?`${o.activity?.status||o.status} · Saved revision ${o.revision} · ${new Date(o.updatedAt).
toLocaleString()}`:"",o?.activity?.unsaved&&(n.metadata.textContent+=" · Unsaved outcome — resolve storage before more m\
essages"),o?.recoveryRequired&&(n.metadata.textContent+=" · Interrupted outcome — Resume acknowledges it without replay"),
n.instructionsText.textContent=o?.identity?.instructions||"No instructions saved.",n.identity.textContent=o?.goals?.join(
`
`)||"No goals saved.",n.summaryText.textContent=o?.context?.summary||"No memory summary saved.",n.policy.textContent=o?o.
policy?.inferenceMode==="network-assisted"?"Mixed · local first, then peers. Selected agent context and message inputs m\
ay be sent to the executing peer.":"Local only. Tasks use a ready model on this device; no peer fallback.":"",A(),k()}async function v(){
const L=++c;try{const N=await e.list({limit:100});if(s||L!==c)return;a=N,a.some(X=>X.agentId===i)||(i=a[0]?.agentId??null);
const H=i,te=H?await e.get(H):null;return s||L!==c||i!==H?void 0:(o=te,S(),!0)}catch(N){return!s&&L===c&&E(`Could not re\
ad saved agents: ${pf(N)}`,!0),!1}}function w(){m=!0,!b&&(b=(async()=>{for(;m&&!s;)m=!1,await v()})().finally(()=>{b=null}))}
async function I(L,N,H,te="Saved.",X=""){if(l||d||s)return;E(L);const j=Promise.resolve().then(async()=>{try{const ae=await N();
return s||(await H?.(ae),await v()&&E(te)),ae}catch(ae){E(X+pf(ae),!0)}});l=j,k();try{return await j}finally{l===j&&(l=null),
s||k()}}function C(L){y()||s||(f=L?{id:L.agentId,revision:L.revision}:{},n.editorHeading.textContent=L?"Edit agent":"New\
 general agent",n.agentName.value=L?.identity?.name||"",n.instructions.value=L?.identity?.instructions||"",n.goals.value=
(L?.goals||[]).join(`
`),n.summary.value=L?.context?.summary||"",n.mode.value=L?.policy?.inferenceMode||"network-assisted",n.main.hidden=!0,n.
editor.hidden=!1,E(""),k(),n.agentName.focus())}function T(){f=null,n.main.hidden=!1,n.editor.hidden=!0,n.create.focus()}
n.close.addEventListener("click",()=>n.element.close()),n.element.addEventListener("close",()=>{!s&&!n.element.open&&p&&
h?.isConnected&&h.focus()}),n.element.addEventListener("keydown",L=>{if(L.key!=="Tab")return;const N=[...n.element.querySelectorAll(
"button,input,textarea,select,[tabindex]")].filter(X=>!X.disabled&&X.getClientRects().length),H=N[0],te=N.at(-1);L.shiftKey&&
document.activeElement===H?(L.preventDefault(),te?.focus()):!L.shiftKey&&document.activeElement===te&&(L.preventDefault(),
H?.focus())}),n.chat.addEventListener("click",()=>{if(!o||y()||s||typeof r!="function")return;const L=o.agentId;E("Openi\
ng conversation…");const N=Promise.resolve().then(()=>r(L));d=N,k(),N.then(()=>{s||(p=!1,n.element.close())},H=>E(`Cou\
ld not open chat: ${pf(H)}`,!0)).finally(()=>{d===N&&(d=null),s||k()})}),n.create.addEventListener("click",()=>C()),n.edit.
addEventListener("click",()=>{o&&C(o)}),n.cancelEdit.addEventListener("click",T),n.editor.addEventListener("submit",L=>{
if(L.preventDefault(),!f||!n.agentName.value.trim())return;const N={name:n.agentName.value.trim(),instructions:n.instructions.
value,goals:n.goals.value.split(`
`).map(te=>te.trim()).filter(Boolean),summary:n.summary.value,inferenceMode:n.mode.value},H=f;I("Saving agent…",()=>H.
id?e.update(H.id,N,{expectedRevision:H.revision}):e.create(N),te=>{i=te.agentId,T()})}),n.remove.addEventListener("click",
()=>{if(o&&!y()){const L=o.agentId;I("Deleting agent…",()=>e.remove(L),()=>{i=null,o=null})}}),n.resume.addEventListener(
"click",()=>{if(o&&!n.resume.disabled){const L=o.agentId;I("Resuming agent…",()=>e.resume(L),null,"Resumed. Send a mes\
sage in the main chat when ready.")}}),n.pause.addEventListener("click",()=>{if(o&&!n.pause.disabled){const L=o.agentId;
I("Pausing; waiting for task cleanup…",()=>e.pause(L),null,"Paused. Resume allows new messages but does not run them.",
"Cleanup incomplete: ")}}),n.exportButton.addEventListener("click",()=>{if(!o||y())return;const L=o.agentId;I("Preparing\
 export…",()=>e.export(L),N=>{const H=new Blob([JSON.stringify(N,null,2)],{type:"application/json"}),te=URL.createObjectURL(
H),X=document.createElement("a");X.href=te,X.download=`agent-${L}.json`,X.click();const j=setTimeout(()=>{URL.revokeObjectURL(
te),u.delete(te)},1e3);u.set(te,j)})}),n.restore.addEventListener("click",()=>n.restoreFile.click()),n.restoreFile.addEventListener(
"change",()=>{const L=n.restoreFile.files?.[0];n.restoreFile.value="",!(!L||y())&&I("Restoring as a new paused agent…",
async()=>{if(L.size>12*1024*1024)throw new Error("Agent backup exceeds 12 MiB");return e.importAsNew(JSON.parse(await L.
text()))},N=>{i=N.agentId})});const P=e.subscribe?.(L=>{!s&&["changed","activity","removed"].includes(L.type)&&w()});return k(),
{element:n.element,async open(L={}){if(s)throw new Error("Agent Console is closed");L.selectedId!==void 0&&!l&&!d&&(i=L.
selectedId),h=document.activeElement,p=!0,n.element.open||n.element.showModal(),await v()},dispose(){if(g)return g;s=!0,
++c,m=!1,P?.(),n.element.close();for(const[L,N]of u)clearTimeout(N),URL.revokeObjectURL(L);return u.clear(),g=Promise.allSettled(
[l,d,b]).then(()=>{n.element.remove()}),g}}}const ks=t=>structuredClone(t),zo=(t,e)=>Object.assign(new Error(e),{code:t}),
OP=new Set(["queued","running","cancelling"]),UP=t=>new TextEncoder().encode(t).byteLength;function aw(t){if(!t)throw zo(
"ERR_AGENT_NOT_FOUND","This saved agent no longer exists.");if(t.activity?.unsaved)throw zo("ERR_AGENT_UNSAVED","Agent c\
hanges are not saved. Resume to retry saving before another task.");if(t.recoveryRequired)throw zo("ERR_AGENT_RECOVERY_R\
EQUIRED","Resume to acknowledge this interrupted task; it will not replay.");if(t.status==="paused")throw zo("ERR_AGENT_\
PAUSED","Resume this paused agent before sending a task.");if(OP.has(t.activity?.status)||t.status==="running")throw zo(
"ERR_AGENT_BUSY","Wait for this agent task and its cleanup to finish.");if(!["local-only","network-assisted"].includes(t.
policy?.inferenceMode))throw new Error("Unknown agent inference policy");return t}function FP({controller:t,onChange:e}={}){
if(!t?.list||!t?.get||!t?.events||!t?.run||!t?.cancel||!t?.resume||!t?.getAttachment)throw new TypeError("Agent chat req\
uires a persistent agent controller");const r=new AbortController;let n=!1,s=[],i,o=!1,a=0;function c(){if(n)throw new Error(
"Agent chat session is closed")}function l(S,...v){if(!(n||typeof S!="function"))try{Promise.resolve(S(...v)).catch(()=>{})}catch{}}
function d(S){l(e,ks(s),S)}function f(S,v){c();const w=v?AbortSignal.any([v,r.signal]):r.signal;return w.throwIfAborted(),
new Promise((I,C)=>{const T=()=>C(w.reason);w.addEventListener("abort",T,{once:!0}),Promise.resolve().then(()=>(w.throwIfAborted(),
S(w))).then(P=>(w.throwIfAborted(),ks(P))).then(I,C).finally(()=>w.removeEventListener("abort",T))})}function h(){return c(),
i||(o=!0,i=(async()=>{for(;o;){o=!1;const S=a,v=await f(w=>t.list({limit:100,signal:w}));if(!Array.isArray(v)||v.length>
100)throw new Error("Invalid saved-agent list");if(S!==a){o=!0;continue}s=v,d()}return ks(s)})().finally(()=>{i=null}),i)}
const p=t.subscribe?.(S=>{n||!["changed","removed","activity"].includes(S?.type)||(a++,o=!0,h().catch(v=>{n||d({error:v})}))});
async function m(S,{signal:v}={}){mt(S);const w=await f(()=>t.get(S),v);if(w&&w.agentId!==S)throw new Error("Saved agent\
 identity does not match the requested chat");return w}async function b(S,{signal:v}={}){mt(S);const w=[];let I;for(let T=0;T<
3;T++){const P=await f(L=>t.events(S,{limit:100,after:I,signal:L}),v);if(!Array.isArray(P)||P.length>100)throw new Error(
"Invalid saved agent history");for(const L of P){if(L.agentId!==void 0&&L.agentId!==S)throw new Error("Saved history bel\
ongs to another agent");if(!Number.isSafeInteger(L.sequence)||L.sequence<=(I??0))throw new Error("Invalid agent history \
cursor");I=L.sequence,w.push(L)}if(P.length<100)break}const C=new Set(w.filter(T=>T.conversationId!==void 0&&T.operationId).
map(T=>T.operationId));return w.filter(T=>T.conversationId===void 0&&!C.has(T.operationId))}async function g(S,v,{signal:w}={}){
mt(S),mt(v);const I=await f(()=>t.getAttachment(S,v),w);if(!I)return null;if(I.id!==v||I.agentId!==void 0&&I.agentId!==S)
throw new Error("Saved image belongs to another agent attachment");return I1(I)}async function u(S,{task:v,prompt:w,image:I,
maxNewTokens:C,seed:T,concise:P,signal:L,onToken:N,onProgress:H}={}){mt(S),c(),L?.throwIfAborted();const te=Zl({task:v,prompt:w,
image:I,maxNewTokens:C,seed:T,concise:P});aw(await m(S,{signal:L})),L?.throwIfAborted();const X=await t.run(S,{...te,signal:L,
onEvent(ae){n||L?.aborted||ae?.agentId!==S||(ae.type==="token"&&typeof ae.text=="string"?l(N,ae.text):ae.type==="progres\
s"&&l(H,ks(ae.event)))}}),j=ks(X?.result);if(X?.agentId!==void 0&&X.agentId!==S)throw new Error("Agent result belongs to\
 another chat");if(!j||typeof j.text!="string"||UP(j.text)>65536)throw new Error("Invalid saved agent result");if(j.image!=
null){if(te.task!=="text-to-image")throw new Error("Unexpected image in agent text response");j.image=Zl({task:"image-te\
xt-to-text",prompt:"Validate result",image:j.image}).image}else if(te.task==="text-to-image")throw new Error("Agent imag\
e generation returned no image");return{...j,route:ks(X.route),agentId:S,requestId:X.requestId}}async function y(S,v){return aw(
await m(S,v)).policy.inferenceMode==="local-only"?"local-only":"mixed"}function E(S){return c(),mt(S),t.cancel(S)}async function k(S){
c(),mt(S);const v=await t.resume(S);return n||await h(),ks(v)}function A(){n||(n=!0,a++,o=!1,r.abort(new DOMException("A\
gent chat session closed","AbortError")),p?.(),s=[])}return{refresh:h,list:()=>ks(s),get:m,history:b,attachment:g,run:u,
speechTarget:y,cancel:E,resume:k,dispose:A}}function zP({button:t,onStart:e,onRelease:r,onCancel:n}){if(!t?.ownerDocument||
typeof e!="function"||typeof r!="function"||typeof n!="function")throw new TypeError("HoldToRecord requires a button and\
 start/release/cancel callbacks");const s=t.ownerDocument,i=s.defaultView,o=[],a=t.style.touchAction;let c=null,l=!1;t.style.
touchAction="none";function d(u,y,E,k){u.addEventListener(y,E,k),o.push(()=>u.removeEventListener(y,E,k))}function f(){const u=c;
if(c=null,u?.kind==="pointer")try{t.hasPointerCapture(u.pointerId)&&t.releasePointerCapture(u.pointerId)}catch{}return u}
function h(u,y,E){const k=f();k&&u({...k,event:y,reason:E})}function p(u,y){h(n,u,y)}function m(){return!l&&!c&&!t.disabled&&
t.getAttribute("aria-disabled")!=="true"}function b(u,y){if(c=u,u.kind==="pointer")try{t.setPointerCapture(u.pointerId)}catch{}
try{e({...u,event:y})}catch(E){throw f(),E}}const g=u=>u.key===" "||u.key==="Spacebar"?"Space":u.key==="Enter"?"Enter":null;
return d(t,"pointerdown",u=>{!m()||u.isPrimary===!1||u.button!==0||(u.preventDefault(),t.focus({preventScroll:!0}),b({kind:"\
pointer",pointerId:u.pointerId},u))}),d(i,"pointerup",u=>{c?.kind!=="pointer"||u.pointerId!==c.pointerId||(u.preventDefault(),
h(r,u,"release"))},!0),d(i,"pointercancel",u=>{c?.kind==="pointer"&&u.pointerId===c.pointerId&&p(u,"pointercancel")},!0),
d(t,"lostpointercapture",u=>{c?.kind==="pointer"&&u.pointerId===c.pointerId&&p(u,"lostpointercapture")}),d(t,"keydown",u=>{
const y=g(u);y&&(u.preventDefault(),!u.repeat&&m()&&b({kind:"keyboard",key:y},u))}),d(i,"keyup",u=>{c?.kind!=="keyboard"||
g(u)!==c.key||(u.preventDefault(),h(r,u,"release"))},!0),d(t,"click",u=>u.preventDefault()),d(t,"contextmenu",u=>u.preventDefault()),
d(t,"blur",u=>p(u,"blur")),d(i,"blur",u=>p(u,"blur")),d(s,"visibilitychange",u=>{s.hidden&&p(u,"hidden")}),{getState:()=>c?
{...c}:null,reset(){f()},dispose(){if(!l){l=!0;try{p(void 0,"dispose")}finally{for(const u of o)u();t.style.touchAction===
"none"&&(t.style.touchAction=a)}}}}}const qP=async t=>(await qt(async()=>{const{createVoiceSession:e}=await import("./VoiceSession-BoKzGcNV.js");
return{createVoiceSession:e}},__vite__mapDeps([7,2]),import.meta.url)).createVoiceSession(t),jP=async()=>(await qt(async()=>{const{
createWorldAudio:t}=await import("./WorldAudio-DrkXZENb.js");return{createWorldAudio:t}},[],import.meta.url)).
createWorldAudio();async function GP({container:t=document.body,stateManager:e,computeManager:r,networkManager:n,getContext:s,
actions:i,runtimeBaseUrl:o,onClose:a,onRequestClose:c,autoConnect:l=!1,managementOnly:d=!1,runtimeFactory:f=lP,refreshIntervalMs:h=5e3,
pwaInstallController:p,voiceSessionFactory:m=qP,audioFactory:b=jP,navigate:g=u=>location.assign(u)}={}){const u=pP(t);if(d){
u.panel.setAttribute("aria-label","Model management"),u.panel.classList.add("pc-model-management");for(const M of[u.back,
u.agents,u.transcript,u.proposed,u.attachment,u.prompt,u.resumeAgent,u.send.parentElement,u.clearChat,u.clearChat.nextElementSibling])
M&&(M.style.display="none");const x=document.createElement("p");x.className="pc-inference-note",x.textContent="Manage mo\
dels for this world. Loaded models remain available to residents when you return to the world.",u.panel.append(x)}const y=_P(
u.panel),E=document.createElement("div");E.hidden=!0,u.panel.append(E);const k=new TextEncoder,A=new Map,S=new Set;let v,
w,I,C,T,P,L=!1,N=!1,H=!1,te,X,j,ae,fe,Te,he,ye,F,Y=!1,q=!1,pe=[],ve=!0,ce,de=!1,ge=!1;const be=new Set;let _r,Ke=[],tt=[],
gt,Ie,Fe,kt,vr,Rt=0,Mt,bt,xt,Cr,ze,rr,Ht,Dr,Tr,_,B,R=[],V="mixed",O,G,ie,xe,se=!1,St=0,ut,ft,at,yt,nr={status:"idle",active:!1,
recording:!1};const W=()=>!N&&!H,Kr=x=>["checking","unavailable"].includes(x?.localAvailability?.status),ls=x=>String(x?.
localAvailability?.reason||(x?.localAvailability?.status==="checking"?"Checking this device…":"Unavailable on this dev\
ice.")).slice(0,512),gn=()=>u.generateImage.checked?"text-to-image":T?"image-text-to-text":"text-generation",Qr=()=>!!(v?.
getDiscoveryStatus?.()?.connected??v?.networkReady),bn=x=>x?.available===!0&&(x.automatic||x.local||Qr()),Vt=x=>typeof x==
"string"&&x.startsWith("agent:")?x.slice(6):null,cn=x=>x?x.activity?.unsaved?"Agent changes are not saved. Resume to ret\
ry saving before another message.":x.recoveryRequired?"This agent has an interrupted task. Resume to acknowledge it; it \
will not replay.":["queued","running","cancelling"].includes(x.activity?.status)?"This agent is busy.":x.status==="pause\
d"?"This agent is paused. Resume it to chat.":"":"This agent is unavailable.",sr=(x,M)=>bn(x)&&(x.agentId?tt.some(U=>(x.
local||x.inferenceMode==="local-only"?U.local:!0)&&bn(U)&&$h(U,M)):$h(x,M)),ir=(x=gn())=>{const M=u.target.value||"mixed",
U=Vt(M);if(U){const z=R.find(Le=>Le.agentId===U),Q=cn(z),we=z?.policy?.inferenceMode!=="network-assisted";return{key:M,agentId:U,
head:z,name:z?.identity?.name??"Unavailable agent",reason:Q,available:!Q,automatic:!0,local:we,inferenceMode:we?"local-o\
nly":"network-assisted",modalities:["text","image"],outputModalities:x==="text-to-image"?["image"]:["text"]}}return["mix\
ed","local-only"].includes(M)?{key:M,automatic:!0,task:x,name:M==="mixed"?"Mixed":"Local only",local:M==="local-only",available:tt.
some(z=>(M==="mixed"||z.local)&&sr(z,x)),modalities:x==="image-text-to-text"?["text","image"]:["text"],outputModalities:x===
"text-to-image"?["image"]:["text"]}:tt.find(z=>z.key===M)},yn=(x,M)=>sr(x,M)?(x.automatic?tt:[x]).some(U=>(!x.local||U.local)&&
sr(U,M)&&$E(U)):!1,At=()=>{i?.invalidate?.(),u.proposed.replaceChildren()};function De(x,{quiet:M=!1}={}){return u.status.
textContent=x,u.status.classList.toggle("pc-status-quiet",M),d&&Ie?.setFeedback(x),x}const lt=x=>{if(!W())return;const M=(x.
name==="AbortError"?"Cancelled: ":"Error: ")+x.message+(/context budget/i.test(x.message)?". Use Config → Clear conversa\
tion to start again, or shorten the prompt.":"");De(M),u.chatOptions.open&&(u.chatOptionsStatus.textContent=M,u.chatOptionsStatus.
hidden=!1),(u.configuration.open||Fe?.isShowing(u.configuration))&&(u.configurationStatus.textContent=M),Ie?.isStoredOpen()&&
(u.storedStatus.textContent=M)},qe=()=>{for(;u.transcript.children.length>24||k.encode(u.transcript.textContent).byteLength>
128*1024;)u.transcript.firstElementChild?.remove();y.prune(),u.transcript.scrollTop=u.transcript.scrollHeight};function Re(){
const x=ir();u.prompt.placeholder=u.generateImage.checked?"Describe an image…":"Message…",u.browse.disabled=ve||!!w,
u.modelsMenu.disabled=ve||!!ze,u.chatConfigure.disabled=ve||!!w,Ie?.setBusy(H||ve||!!w),u.agents.disabled=!!w||!!Tr||!v?.
getAgentController,u.cpuBudget.disabled=u.gpuBudget.disabled=!!w||!v?.setMemoryBudgets;const M=u.generateImage.checked&&
!!T;u.send.disabled=!!w||se||L||de||M||!yn(x,gn())||!u.prompt.value.trim()&&!T,u.cancel.hidden=!w||!!ze,u.target.disabled=
!!w,u.attach.disabled=!!w||u.generateImage.checked||!sr(ir("image-text-to-text"),"image-text-to-text"),u.attach.title=u.
generateImage.checked?"Generate image uses a text prompt. Uncheck it to attach an image.":sr(ir("image-text-to-text"),"i\
mage-text-to-text")?"Attach an image for a vision model":"Choose Mixed or a loaded local or peer vision model to attach \
an image.";const U=sr(ir("text-to-image"),"text-to-image");u.generateImage.disabled=!!w||!U,u.generateImage.parentElement.
title=U?"Generate image":"No image-generation model is available for this chat target. Load one or choose a compatible p\
eer.",u.imageUnavailable.hidden=!u.generateImage.checked||U||!!w,u.useTextChat.disabled=!!w,u.speakReplies.disabled=u.beConcise.
disabled=!!w;const z=nr.recording||nr.status==="requesting-microphone";u.talk.textContent=nr.recording?"Release":"Talk",
u.talk.setAttribute("aria-label","Talk"),u.talk.setAttribute("aria-pressed",String(z)),u.talk.disabled=!!ze||!!w&&(!yt||
yt.released)||se||L||de||M||!!x?.agentId&&!x.available,u.resumeAgent.hidden=!x?.agentId||!x.reason||/busy|unavailable/i.
test(x.reason),u.resumeAgent.disabled=!!w||se,u.modeStatus.textContent=M?"Generate image uses a text prompt. Remove the \
attached image or uncheck Generate image.":x?.agentId?`${x.name} · ${x.local?"Local only, including voice.":"Mixed: loc\
al first, then peers, including voice."} Identity and conversation are saved on this device.${x.reason?" "+x.reason:""}`:
x?.key==="mixed"?"Mixed uses a compatible loaded local model first, then an online peer. Messages, images and voice may \
be sent to that peer.":x?.key==="local-only"||x?.local?"Local execution only. Voice also uses compatible local speech mo\
dels.":"This target runs on another peer. Messages and attachments go to that host; voice uses available local or peer s\
peech models.",!M&&x&&!x.reason&&!sr(x,gn())?u.modeStatus.textContent+=` No compatible ${u.generateImage.checked?"image-\
generation":T?"vision":"text"} model is available for this choice. Load one or choose another target.`:!M&&x&&!x.reason&&
!yn(x,gn())&&(u.modeStatus.textContent+=" Compatible models have no available queue capacity. You can keep drafting; sen\
ding resumes when capacity is available."),u.empty.textContent=x?.agentId&&x.reason?`${x.name}: ${x.reason}`:sr(x,gn())?
u.generateImage.checked?"Describe an image to get started. Use ⚙ for chat options.":"Ask a question to get started. Us\
e ⚙ for chat options.":"Open Models to load one, or use ⚙ to choose a peer model.",u.unload.disabled=!!w,u.clearChat.
disabled=!!w||!!x?.agentId,u.clearChat.title=x?.agentId?"Agent history and memory are persistent. Manage this agent thro\
ugh Agents.":"",(u.configuration.open||Fe?.isShowing(u.configuration))&&D(),u.storedRefresh.disabled=!!w||!!ye;for(const Le of u.
storedList.querySelectorAll("button,input"))Le.disabled=!!w||!!ye||Le.dataset.inactive==="true";const Q=pe.filter(Le=>be.
has(Le.manifestCid)),we=v?.loadStoredModel?Q.filter(Xy).length:0;u.storedLoadSelected.disabled=!!w||!!ye||!we,u.storedDeleteSelected.
disabled=!!w||!!ye||!v?.deleteStoredModel||!Q.length,u.storedSelection.textContent=`${Q.length} model${Q.length===1?"":"\
s"} selected.`+(Q.length!==we?` ${we} ready to load.`:""),u.storedCancel.hidden=!w||!(Y||q)||!!ze,u.storedCancel.disabled=
!!w?.signal.aborted}function Jr(){gt||(gt=v.getPreferredModelSourceKey?.()??Ke.find(x=>x.modelId==="smolvlm-256m-q4"&&x.
source==="hf")?.key??Ke.find(x=>!Kr(x))?.key??Ke[0]?.key),Ie?.refresh(),Re()}function Ws(){vr&&(Rt++,mP(u,wP(vr,{environment:{
browser:u.helpBrowser.value,os:u.helpOs.value}})))}function wn(x){if(!W()||w)return;if(x.needsVerification||x.localAvailability?.
code==="model_verification_required"){Rr({tab:"stored"});return}vr={...x,localAvailability:x.localAvailability??v.getModelCompatibility?.(
x.package??x)};const M=UE();if(u.helpBrowser.value=M.browser,u.helpOs.value=M.os,Ws(),Fe){Fe.show(u.compatibility);return}
u.networkInfo.close(),u.chatOptions.close(),u.menuWindow.close(),u.configuration.close(),Ie?.close(),u.about.close(),u.compatibility.
open||u.compatibility.showModal()}function je(){const x=u.target.value||"mixed",M=tt.find(z=>z.key===x),U=u.target.selectedOptions[0]?.
textContent;Ke=v.listModelSources(),kt&&!Ke.some(z=>z.key===kt.key)&&Ke.push(kt),tt=v.listInferenceTargets(),Jr(),u.target.
replaceChildren();for(const[z,Q]of[["mixed","Mixed · local first, then peers"],["local-only","Local only · automatic"]]){
const we=document.createElement("option");we.value=z,we.textContent=Q,u.target.append(we)}for(const z of R){const Q=document.
createElement("option");Q.value=`agent:${z.agentId}`,Q.textContent=`Agent · ${String(z.identity?.name??"Unnamed agent").
slice(0,120)}`+(cn(z)?` (${z.activity?.status||z.status||"unavailable"})`:""),u.target.append(Q)}for(const z of tt.filter(
Q=>!["automatic-speech-recognition","text-to-speech"].includes(Q.task))){const Q=document.createElement("option");Q.value=
z.key,Q.textContent=(z.local?"Local · ":"Peers · ")+String(z.name).slice(0,140)+(z.task==="text-to-image"?" · Image ge\
neration":"")+(z.busy?" (busy)":z.available?"":" (unavailable)"),u.target.append(Q)}if(!tt.some(z=>z.key===x)&&!R.some(z=>`\
agent:${z.agentId}`===x)&&!["mixed","local-only"].includes(x)&&U){const z=document.createElement("option");z.value=x,z.disabled=
!0,z.textContent=(M?.name??U.replace(/ \(unavailable\)$/,""))+" (unavailable)",u.target.append(z)}u.target.value=x,u.target.
value||(u.target.value="mixed"),Re()}function Pt(){if(!W()||!_)return;const x=Vt(V),M=R.find(z=>z.agentId===x);R=_.list(),
je();const U=R.find(z=>z.agentId===x);x&&!w&&!se&&M?.revision!==U?.revision&&vn(V)}async function ht(){return!_&&!B&&(B=
(async()=>{const x=await v.getAgentController();if(!W())throw new DOMException("Console closed","AbortError");return _=FP(
{controller:x,onChange:Pt}),await _.refresh(),R=_.list(),je(),_})().finally(()=>{B=null})),_??await B}async function vn(x){
ie?.abort();const M=new AbortController;ie=M;const U=++St,z=Vt(x);if(!z)return;se=!0,Re();const Q=()=>W()&&!M.signal.aborted&&
U===St&&V===x;xe=(async()=>{try{const we=await ht(),[Le,Qe]=await Promise.all([we.get(z,{signal:M.signal}),we.history(z,
{signal:M.signal})]);if(!Q())return;if(!Le)throw new Error("This saved agent no longer exists. Choose another chat or cr\
eate an agent.");const Ne=R.findIndex(Ye=>Ye.agentId===z);Ne>=0&&(R[Ne]=Le),u.transcript.replaceChildren(u.empty),y.prune();
const Bt=new Set(Qe.filter(Ye=>Ye.type==="request").map(Ye=>Ye.operationId)),Ot=Qe.filter(Ye=>["request","result"].includes(
Ye.type)||["failed","cancelled","outcome-unknown"].includes(Ye.type)&&Bt.has(Ye.operationId)).slice(-24),Ut=new Set,or=new Set(
Ot.filter(Ye=>Ye.inputAttachmentId||Ye.imageAttachmentId).slice(-6));for(const Ye of Ot){if(!Q())return;const nc=`${Ye.type}\
:${Ye.operationId??Ye.sequence}`;if(Ut.has(nc))continue;Ut.add(nc);const Yr=uf(u,Ye.type==="request"?"user":"assistant",
Ye.text||"",{targetName:`Agent · ${Le.identity.name}${Ye.route?" · "+po(Ye.route):""}`});Yr.parentElement.dataset.operationId=
Ye.operationId??"";const mo=Ye.inputAttachmentId||Ye.imageAttachmentId;if(mo)try{if(!or.has(Ye))throw new Error("Older p\
review omitted");const $r=await we.attachment(z,mo,{signal:M.signal});if(!Q())return;const dt=await y.append(Yr,$r,{signal:M.
signal,prompt:Ye.text});Ye.type==="request"&&(dt.className="pc-chat-image",dt.alt="Saved attached image")}catch{if(!Q())
return;const dt=document.createElement("p");dt.className="pc-inference-note",dt.textContent="Saved image preview is unav\
ailable.",Yr.after(dt)}}qe()}catch(we){Q()&&(u.transcript.replaceChildren(u.empty),y.prune(),lt(we))}finally{U===St&&(se=
!1,ie=null,W()&&Re())}})(),await xe}async function wi(x){if(!W()||w)return;const M=V,U=!!Vt(M),z=!!Vt(x);if(M===x){z&&await vn(
x),Re();return}ie?.abort(),St++,se=!1,V=x,u.target.value=x,(U||z)&&(ce?.cancel(),P?.abort(),wt(),u.prompt.value=""),At(),
z?(U||E.append(...u.transcript.childNodes),u.transcript.replaceChildren(u.empty),y.prune(),await vn(x)):U&&(u.transcript.
replaceChildren(...E.childNodes),u.transcript.children.length||u.transcript.append(u.empty),y.prune(),qe()),Re()}function Hs(x){
if(!v)return;const M=v.getDiscoveryStatus?.(),U=M?.connected??v.networkReady;U&&(Te=null);const z=x?.message??Te?.message??
M?.errors?.[0]?.message;u.networkStatus.textContent=u.networkInfo.update({connected:U,connecting:!!ae&&!ae.signal.aborted,
peerCount:M?.peerCount,sharedModelCount:M?.sharedModelCount??Ke.filter(Q=>Q.source==="peers").length,hostedModelCount:M?.
hostedModelCount??tt.filter(Q=>!Q.local&&Q.available).length,inferenceModels:U?v.listInferenceTargets().filter(Q=>!Q.local&&
Q.available):[],issue:z,artifacts:v.getArtifactNetworkStatus?.()})}function vi(){const x=v.getMemoryBudgets?.()??{};u.cpuBudget.
value=x.cpuBytes==null?"":String(x.cpuBytes/1024**3),u.gpuBudget.value=x.gpuBytes==null?"":String(x.gpuBytes/1024**3);const M=v.
getDeviceCapabilities?.()?.deviceMemoryGiB;u.memoryNote.textContent=(Number.isFinite(M)&&M>0?`Browser-reported RAM: appr\
oximately ${M} GiB. `:"")+"Optional combined limits for all loaded models, using conservative estimates. Auto sets no ap\
plication byte cap; an embedding app’s limits still apply. Your browser cannot report free GPU memory. Actual allocation\
s may fail. Lowering a limit keeps loaded models and restricts future loads.",D()}function D(){const x=v?.getMemoryBudgetStatus?.();
if(u.memoryPressure.hidden=!x,x){const M=(U,z)=>{const Q=x[U];return`${z}: ${Ss(Q.reservedBytes)} estimated reserved; ${Q.
budgetBytes===null?"no application cap":`${Ss(Q.budgetBytes)} combined budget`}${Q.overBudget?" (over budget; unload a m\
odel or raise the limit before adding another)":""}.`};u.memoryPressure.textContent=M("cpu","RAM")+" "+M("gpu","GPU")+(x.
owned?"":" The embedding app owns the shared resource pool; its limits cannot be raised here.")+" These totals are estim\
ates, not measured RAM or VRAM use."}}function Z(){if(!(!W()||w||!v.setMemoryBudgets))try{const x=[u.cpuBudget,u.gpuBudget].
map(M=>{M.setCustomValidity(""),M.removeAttribute("aria-invalid");const U=M.value.trim(),z=U?Math.round(Number(U)*1024**
3):null;if(M.validity.badInput||U&&(!Number.isFinite(Number(U))||Number(U)<=0||Number(U)>1024||!Number.isSafeInteger(z)||
z<1)){const Q="Enter a memory budget above 0 and at most 1024 GiB, or leave it blank.";throw M.setCustomValidity(Q),M.setAttribute(
"aria-invalid","true"),new Error(Q)}return z});v.setMemoryBudgets({cpuBytes:x[0],gpuBytes:x[1]}),vi(),Ke=v.listModelSources(),
Jr(),u.configurationStatus.textContent="Combined memory budgets updated for future loads."}catch(x){lt(x)}}async function ee(){
if(!W()||X)return X;const x=new AbortController;return j=x,X=(async()=>{try{await v.refreshPeers({signal:x.signal}),W()&&
(CSS.supports("selector(:open)")&&u.target.matches(":open")?(tt=v.listInferenceTargets(),Re()):je(),Hs())}catch(M){W()&&
!x.signal.aborted&&(tt=v.listInferenceTargets(),Re(),Hs(M))}finally{X=null,j=null}})(),X}const K=x=>{if(!W())return;let M;
if(x.stage==="import"?(M=(x.reused?"Using saved file ":"Downloading ")+(x.index+1)+"/"+x.total+": "+x.path,Number.isSafeInteger(
x.loaded)&&Number.isSafeInteger(x.totalBytes)&&x.loaded>=0&&x.totalBytes>0&&(M+=` · ${Ss(x.loaded)} / ${Ss(x.totalBytes)}`),
x.retryAttempt&&(M+=` · Connection interrupted; retry ${x.retryAttempt}/${x.maxRetries} in ${Math.ceil(x.retryDelayMs/1e3)}\
s`)):x.type==="model-load"?M="Loading model: "+(x.stage||x.status||"initializing GPU")+(x.file?" · "+x.file:""):M={prepare:"\
Preparing model…",verify:"Verifying stored model files…","download-peers":"Fetching and verifying model files from p\
eers…",unload:"Releasing the previous model…",load:"Loading model into RAM and GPU memory…"}[x.stage],x.stage==="v\
erify"&&Number.isSafeInteger(x.loaded)&&Number.isSafeInteger(x.totalBytes)&&x.totalBytes>0&&(M+=` · ${Ss(x.loaded)} / ${Ss(
x.totalBytes)}`),!M)return;const U=`${x.type??""}:${x.stage??x.status??""}:${x.path??x.file??""}`;U!==xt&&(xt=U,Cr=performance.
now()),bt=String(M).slice(0,512),De(bt),ze&&!ze.controller.signal.aborted&&(u.loadingStatus.textContent=bt),Y&&Ie?.isStoredOpen()&&
(u.storedStatus.textContent=bt),Mt||(Mt=setInterval(()=>{W()&&w&&!w.signal.aborted&&(De(`${bt} (${Math.floor((performance.
now()-Cr)/1e3)}s)`),ze&&(u.loadingStatus.textContent=u.status.textContent),Y&&Ie?.isStoredOpen()&&(u.storedStatus.textContent=
u.status.textContent))},1e3))};function re(){!ze||ze.controller.signal.aborted||ze.controller.abort(new DOMException("Mo\
del load cancelled","AbortError"))}async function _e(){if(w&&(w.abort(new DOMException("Models window closed","AbortErro\
r")),await I),rr)throw new Error("Model cleanup is incomplete. Retry Unload in Stored models or Config before closing.",
{cause:rr});return c?c():Fd()}function Je(){const x=v.getResidentModelStates?.()??v.listResidentModels?.();(!x||!x.some(
M=>!["ready","idle","closed"].includes(M.status)))&&(rr=null)}function Ee(x,M){u.networkInfo.close(),u.chatOptions.close();
const U={controller:x,focus:document.activeElement,previousDialog:[...u.panel.querySelectorAll("dialog[open]")].at(-1)};
ze=U,u.loadingModel.textContent=String(M).slice(0,256),u.loadingStatus.textContent="Preparing model…",u.loadingCancel.
disabled=!1,U.onAbort=()=>{u.loadingCancel.disabled=!0,u.loadingStatus.textContent="Cancelling load… Waiting for cleanup\
.",W()&&(Fe?Ie.element:u.loading).focus()},x.signal.addEventListener("abort",U.onAbort,{once:!0}),Re(),Fe?Fe.show(u.loading,
{closeWindow:!0}):u.loading.showModal()}function _t(x){const M=ze;if(!M||M.controller!==x||(x.signal.removeEventListener(
"abort",M.onAbort),ze=null,u.loading.close(),!W()))return;if(Fe){Fe.showLibrary();return}(M.focus?.isConnected&&M.focus.
matches("button,input,select,textarea,a[href],[tabindex]")&&!M.focus.disabled&&M.focus.getClientRects().length?M.focus:M.
previousDialog?.open?M.previousDialog.querySelector("button:not(:disabled)"):u.browse.disabled?u.menu:u.browse)?.focus()}
async function Ge(x,{modelName:M}={}){if(!W()||w)return;const U=new AbortController;w=U,Re(),I=(async()=>{try{M!==void 0&&
Ee(U,M),await x(U.signal)}catch(z){d&&M!==void 0&&U.signal.aborted&&z instanceof AggregateError&&(rr=z),lt(z)}finally{clearInterval(
Mt),Mt=null,xt=null,O=null,G=null;try{W()&&(await _?.refresh().catch(lt),Vt(V)&&await vn(V),je(),qe())}finally{w===U&&(w=
null),W()&&Re(),_t(U)}}})(),await I}function pt(x){if(!W()||!Ie?.isStoredOpen()||!x||document.activeElement!==document.body&&
document.activeElement?.getClientRects().length)return;(x.isConnected&&!x.disabled&&x.getClientRects().length?x:u.storedContent.
querySelector("button:not(:disabled)"))?.focus()}async function it({signal:x,preserveStatus:M=!1,quietCancellation:U=!1}={}){
if(!W())return!1;if(he)return F?.aborted?(await he,!W()||x?.aborted?!1:it({signal:x,preserveStatus:M,quietCancellation:U})):
he;const z=new AbortController;ye=z;const Q=x?AbortSignal.any([z.signal,x]):z.signal;F=Q;const we=u.storedContent.contains(
document.activeElement)?document.activeElement:null;return M||(u.storedStatus.textContent="Reading stored models…"),Re(),
he=(async()=>{await Promise.resolve();try{Q.throwIfAborted();const Le=await v.listStoredModels({signal:Q});if(Q.throwIfAborted(),
W()){pe=Le;const Qe=new Set(Le.filter(aa).map(Ne=>Ne.manifestCid));for(const Ne of be)Qe.has(Ne)||be.delete(Ne);gP(u,Le,
{selected:be,onRecover:v.recoverStoredModel?ke:void 0,onUnload:me,onSelect:(Ne,Bt)=>{!W()||w||ye||!aa(Ne)||!pe.some(Ot=>Ot.
manifestCid===Ne.manifestCid)||(Bt?be.add(Ne.manifestCid):be.delete(Ne.manifestCid),Re())}}),M||(u.storedStatus.textContent=
`${Le.length} model${Le.length===1?"":"s"} stored.`)}return!0}catch(Le){return U&&(x?.aborted||z.signal.aborted)||M||(lt(
Le),W()&&(u.storedStatus.textContent="Error: "+Le.message)),!1}finally{he=null,ye=null,F=null,W()&&(Re(),pt(we))}})(),he}
async function En(x){if(!W()||w||ye||!v.deleteStoredModel)return;const M=[...new Map(x.filter(aa).map(z=>[z.manifestCid,
z])).values()];if(!M.length)return;const U=u.storedContent.contains(document.activeElement)?document.activeElement:null;
q=!0,u.storedCancel.textContent="Stop deleting";try{await Ge(async z=>{let Q=0,we=0,Le=0,Qe;try{for(const Ut of M){z.throwIfAborted(),
u.storedStatus.textContent=`Deleting ${Q+1} / ${M.length}: ${Ut.name}…`;const or=await v.deleteStoredModel(Ut.manifestCid,
{signal:z});Q++,or.deleted&&we++,Number.isSafeInteger(or.freedBytes)&&or.freedBytes>0&&(Le+=or.freedBytes),be.delete(Ut.
manifestCid),or.unloaded&&(A.delete(`local:${Ut.manifestCid}`),At())}}catch(Ut){Qe=Ut}he&&await he;const Ne=await it({preserveStatus:!0}),
Bt=Le>0?` Freed ${Ss(Le)}.`:"";if(Qe){const Ut=new Error(`Completed ${Q} of ${M.length} deletions.${Bt} ${Qe.message}`+(Ne?
"":" Use Refresh to check the stored library."),{cause:Qe});throw Ut.name=Qe.name,Ut}if(!Ne)throw new Error("Deletion fi\
nished, but the stored library could not be refreshed. Use Refresh to check its state.");const Ot=M.length===1?we?`Delet\
ed ${M[0].name}.`:"This model is no longer stored.":`Deleted ${we} models.`+(we<Q?` ${Q-we} already absent.`:"");u.storedStatus.
textContent=Ot+Bt,De(Ot,{quiet:!0})})}finally{q=!1,u.storedCancel.textContent="Stop loading",W()&&(Re(),pt(U))}}async function me(x){
!W()||w||ye||!x.loaded||await Ge(async()=>{await v.unload(x.manifestCid),Je(),A.delete(`local:${x.manifestCid}`),At(),await it(),
je(),De(u.storedStatus.textContent=`Unloaded ${x.name}. Its files remain stored.`,{quiet:!0})})}async function ke(x){if(!(!W()||
w||ye||!x.needsVerification)){Y=!0,u.storedCancel.textContent="Cancel verification";try{await Ge(async M=>{K({stage:"ver\
ify"});try{await v.recoverStoredModel(x.manifestCid,{signal:M,onProgress:U=>{M.aborted||K(U)}})}catch(U){throw await it(),
U}M.throwIfAborted(),await it(),je(),De(u.storedStatus.textContent=`Verified ${x.name} from local files. You can now loa\
d it.`,{quiet:!0})})}finally{Y=!1,u.storedCancel.textContent="Stop loading",W()&&Re()}}}async function Be(x){if(!W()||w||
ye||!v.loadStoredModel)return;const M=[...new Map(x.filter(Xy).map(Q=>[Q.manifestCid,Q])).values()];if(!M.length)return;
Y=!0;let U=!1,z=!1;try{await Ge(async Q=>{At();const we=[];let Le=0,Qe=!1;try{for(const[Ne,Bt]of M.entries()){Q.throwIfAborted(),
u.loadingModel.textContent=M.length>1?`${Ne+1} / ${M.length} · ${Bt.name}`:Bt.name,K({stage:"verify"});try{await v.loadStoredModel(
Bt.manifestCid,{signal:Q,onProgress:Ot=>{Q.aborted||K(Ot)},ggufGpuLayers:Number(u.gpuLayers.value)}),Q.throwIfAborted(),
Le++,be.delete(Bt.manifestCid)}catch(Ot){const Ut=v.listResidentModels?.().find(or=>or.manifestCid===Bt.manifestCid);if(Ot instanceof
AggregateError||Ut&&!["ready","idle"].includes(Ut.status)||(Q.throwIfAborted(),Ot.name==="AbortError"))throw Ot;we.push(
{model:Bt,error:Ot})}}}finally{Qe=await it({signal:Q}),z=Q.aborted}if(Q.throwIfAborted(),!Qe)throw new Error("Model load\
ing finished, but the stored library could not be refreshed. Use Refresh to check its state.");if(gt=v.getPreferredModelSourceKey?.()??
gt,je(),we.length)throw new Error(M.length===1?we[0].error.message:`Loaded ${Le} of ${M.length} models. ${we.map(({model:Ne,
error:Bt})=>`${Ne.name}: ${Bt.message}`).join("; ")}`);De(u.storedStatus.textContent=M.length===1?`Loaded ${M[0].name}. \
Compatible tasks can now use it.`:`Loaded ${Le} models. Compatible tasks can now use them.`,{quiet:!0}),U=!0},{modelName:M.
length===1?M[0].name:`${M.length} selected models`})}finally{Y=!1,W()&&(Re(),U&&!be.size&&!d?(Ie?.close(),u.prompt.focus()):
z&&it({preserveStatus:!0}))}}function wt(){T=null,u.attachment.hidden=!0,u.attachmentImage.removeAttribute("src"),u.imageFile.
value="",Re()}try{v=await f({stateManager:e,computeManager:r,networkManager:n,runtimeBaseUrl:o});const x=v.getPreferences();
u.sharing.checked=x.sharing,u.hosting.checked=x.hostInference,vi(),Ie=BP({container:u.panel,keepOpenOnAction:d,onConfigure:d?
()=>u.configure.click():void 0,onDismiss:d?()=>Fe.requestClose():void 0,storedContent:u.storedContent,hasStoredModels:()=>pe.
length>0||Ke.some(M=>M.source==="stored"),onStoredOpen:({signal:M}={})=>it({signal:M,quietCancellation:!0}),getSources:()=>Ke,
getTargets:()=>tt,searchModels:M=>v.searchModelHub(M),inspectModel:(M,U)=>v.inspectModelHub(M,U),findConversions:v.findModelConversions?
(M,U)=>v.findModelConversions(M,U):void 0,getCompatibility:M=>M.localAvailability??v.getModelCompatibility?.(M.package??
M)??{status:"unknown",reason:"Local memory fit is unverified."},onLoad:Ei,onUsePeer(M){je();const U=tt.find(Q=>Q.key===M&&
Q.available&&!Q.local);if(!U){lt(new Error("This inference host is no longer available. Refresh the model browser."));return}
if(d){De("This peer model is available to residents with network-assisted routing. Return to the world to chat.");return}
const z=["automatic-speech-recognition","text-to-speech"].includes(U.task);wi(z?"mixed":M).then(()=>u.prompt.focus()).catch(
lt),z&&De("Mixed routing can use compatible peer speech models. Use Talk or Speak replies.",{quiet:!0})},onSetup:wn}),d&&
(Fe=LP({browser:Ie,onRequestClose:_e}));for(const M of[u.browse,u.modelsMenu])M.setAttribute("aria-controls",Ie.element.
id);Ie.element.addEventListener("close",()=>{!d&&W()&&!u.panel.querySelector("dialog[open]")&&(document.activeElement===
document.body||!document.activeElement?.getClientRects().length)&&u.browse.focus()}),je(),De("Ready.",{quiet:!0})}catch(x){
throw u.networkInfo.dispose(),u.panel.remove(),x}u.chatConfigure.onclick=()=>{!W()||ve||w||(u.chatOptionsStatus.textContent=
"",u.chatOptionsStatus.hidden=!0,u.networkInfo.close(),u.menuWindow.close(),u.configuration.close(),u.about.close(),u.compatibility.
close(),Ie?.close(),u.chatOptions.open||u.chatOptions.showModal())},u.chatOptions.addEventListener("close",()=>{W()&&!u.
panel.querySelector("dialog[open]")&&(document.activeElement===document.body||!document.activeElement?.getClientRects().
length)&&u.chatConfigure.focus()}),u.configure.onclick=()=>{if(!(!W()||ze)){if(Fe){u.configurationStatus.textContent="",
D(),Fe.show(u.configuration,{refreshStoredOnReturn:!0});return}u.networkInfo.close(),u.chatOptions.close(),u.menuWindow.
close(),u.about.close(),u.compatibility.close(),Ie?.close(),u.configurationStatus.textContent="",u.configuration.showModal()}};
function Rr(x={}){!W()||ve||ze||(Fe&&Fe.showLibrary(),u.networkInfo.close(),u.chatOptions.close(),u.menuWindow.close(),u.
about.close(),u.compatibility.close(),u.configuration.close(),Ie.open({selectedKey:gt,...x}))}u.browse.onclick=u.modelsMenu.
onclick=()=>Rr(),u.menu.onclick=()=>{!W()||ze||(u.networkInfo.close(),u.chatOptions.close(),u.about.close(),u.compatibility.
close(),u.configuration.close(),Ie?.close(),u.menuWindow.showModal())},u.aboutButton.onclick=()=>{!W()||ze||(u.networkInfo.
close(),u.chatOptions.close(),u.menuWindow.close(),u.about.showModal())};for(const x of[u.menuWindow,u.configuration,u.about])
x.addEventListener("close",()=>{W()&&![u.loading,u.menuWindow,u.configuration,u.about,u.compatibility,u.chatOptions,Ie.element].
some(M=>M.open)&&document.activeElement!==u.prompt&&u.menu.focus()});if(p){const x=(M=p.getState())=>{W()&&(u.install.hidden=
!1,u.install.disabled=M.installed||M.installing,u.install.textContent=M.installed?"Installed":M.installing?"Installing…":
"Install",u.menuStatus.textContent=String(M.instructions??"").slice(0,512))};x(),Ht=p.subscribe?.(x),u.install.onclick=async()=>{
if(!(!W()||u.install.disabled))try{const M=await p.install();W()&&(x(),M.instructions&&(u.menuStatus.textContent=String(
M.instructions).slice(0,512)))}catch(M){W()&&(u.menuStatus.textContent="Installation unavailable: "+String(M.message).slice(
0,256))}}}u.storedRefresh.onclick=()=>{it()},u.storedLoadSelected.onclick=()=>{Be(pe.filter(x=>be.has(x.manifestCid)))},
u.storedDeleteSelected.onclick=()=>{En(pe.filter(x=>be.has(x.manifestCid)))},u.back.onclick=x=>{x.preventDefault(),W()&&
!u.leaveConfirmation.open&&(u.networkInfo.close(),u.chatOptions.close(),u.leaveConfirmation.showModal())},u.stay.onclick=
()=>{ge||(u.leaveConfirmation.close(),u.back.focus())},u.leaveConfirmation.addEventListener("cancel",x=>{ge&&x.preventDefault()}),
u.leave.onclick=async()=>{if(u.leave.disabled)return;const x=u.back.href;ge=!0,u.leave.disabled=u.stay.disabled=!0,u.leaveStatus.
textContent="Stopping models and closing connections…";try{await Fd(),g(x)}catch(M){u.panel.inert=!1,u.leave.disabled=
!1,u.leaveStatus.textContent=`Could not finish cleanup: ${M.message}. Click Leave to retry.`,u.leaveConfirmation.open||u.
leaveConfirmation.showModal(),u.leave.focus()}},u.helpBrowser.onchange=u.helpOs.onchange=Ws,u.helpConfig.onclick=()=>u.configure.
click(),u.compatibility.addEventListener("close",()=>{Rt++,W()&&!u.configuration.open&&!Ie?.element.open&&!u.about.open&&
!u.menuWindow.open&&!u.chatOptions.open&&u.browse.focus()}),u.helpCopy.onclick=async()=>{const x=u.helpCommand.value;if(!x||
!W())return;const M=++Rt,U=()=>W()&&(u.compatibility.open||Fe?.isShowing(u.compatibility))&&Rt===M;try{await navigator.clipboard.
writeText(x),U()&&(u.helpStatus.textContent="Command copied.")}catch{U()&&(u.helpCommand.focus(),u.helpCommand.select(),
u.helpStatus.textContent="Clipboard unavailable. Select and copy the command above.")}},u.cpuBudget.onchange=u.gpuBudget.
onchange=Z,u.target.onchange=()=>{u.chatOptionsStatus.textContent="",u.chatOptionsStatus.hidden=!0,wi(u.target.value).catch(
lt)},u.resumeAgent.onclick=()=>{const x=Vt(u.target.value);!x||w||Ge(async M=>{await(await ht()).resume(x),M.throwIfAborted(),
De("Agent ready. Send a message.",{quiet:!0})})},u.generateImage.onchange=()=>{u.generateImage.checked&&(u.speakReplies.
checked=!1),At(),Re()},u.useTextChat.onclick=()=>{w||(u.generateImage.checked=!1,At(),Re(),u.prompt.focus())},u.speakReplies.
onchange=()=>{u.speakReplies.checked&&(u.generateImage.checked=!1),At(),Re()},u.prompt.oninput=Re;for(const[x,M]of[[u.sharing,
"setSharing"],[u.hosting,"setHostInference"]])x.onchange=()=>{if(!W())return;const U=x.checked;x.disabled=!0;const z=(async()=>{
try{await v[M](U),W()&&(u.configurationStatus.textContent="Preferences updated.")}catch(Q){x.checked=!U,lt(Q)}finally{W()&&
(x.disabled=!1)}})();S.add(z),z.finally(()=>S.delete(z))};async function Ei(x){if(!W()||w)return;const M=typeof x=="stri\
ng"?x:x?.key;Ke=v.listModelSources();let U=M?Ke.find(Q=>Q.key===M)??(kt?.key===M?kt:null):x;if(!U){Jr();return}U.package&&
(U={...U,localAvailability:v.getModelCompatibility(U.package)});const z=!U.key&&U.model&&Array.isArray(U.files);if(z&&(U=
kt={...U,key:`hub:${U.id}`,source:"hf",package:U,localAvailability:v.getModelCompatibility(U)}),Kr(U)){wn(U);return}return gt=
U.key,z&&Ke.push(U),Jr(),Ge(async Q=>{At(),K({stage:"prepare"});const we={signal:Q,onProgress:Qe=>{Q.aborted||K(Qe)},ggufGpuLayers:Number(
u.gpuLayers.value)};U.package?await v.acquireHubModel(U.package,we):await v.acquireModel(U.key,we),Q.throwIfAborted(),gt=
v.getPreferredModelSourceKey?.()??gt,kt=null,je(),Re();const Le=!!v.getSharingErrors?.().length;De(Le?"Model ready. Shar\
ing is unavailable for some stored models; see Models → Stored models.":d?"Model ready. Return to the world to use it.":
"Model ready. Send a message.",{quiet:!Le})},{modelName:U.name})}u.unload.onclick=()=>Ge(async()=>{At(),await v.unload(),
Je();for(const x of A.keys())(x==="local"||x.startsWith("local:"))&&A.delete(x);De("Local models unloaded. Stored files \
are kept.",{quiet:!0}),u.configurationStatus.textContent=u.status.textContent}),u.clearChat.onclick=()=>{!W()||w||Vt(u.target.
value)||(A.clear(),At(),u.transcript.replaceChildren(u.empty),y.prune(),De(u.configurationStatus.textContent="Conversati\
on cleared. Ready for a new message.",{quiet:!0}))},u.connect.onclick=()=>Ge(async x=>{u.relay.value.trim()?await v.connect(
u.relay.value.trim(),{signal:x}):await v.connectBackend({signal:x}),await ee()}),u.file.onchange=()=>Ge(async x=>{const M=u.
file.files[0];M&&(await v.store.importFile(M.stream(),{expectedSize:M.size,pin:!0,signal:x}),De("Pinned "+M.name+" local\
ly.",{quiet:!0}),u.file.value="")}),u.attach.onclick=()=>u.imageFile.click();async function ho(x,{signal:M}={}){if(!x||!W())
return;P?.abort();const U=new AbortController;P=U;const z=M?AbortSignal.any([U.signal,M]):U.signal;L=!0,Re();try{const Q=await EP(
x,{signal:z});if(!W()||z.aborted)return;T=Q,u.attachmentImage.src=Q.preview,u.attachmentName.textContent=Q.name,u.attachment.
hidden=!1,Re(),u.prompt.focus()}catch(Q){z.aborted||lt(Q)}finally{P===U&&(L=!1,W()&&Re())}}ce=SP({textarea:u.prompt,onFile:ho,
onError:lt,onPendingChange:x=>{x&&P?.abort(),de=x,W()&&Re()},canAccept:()=>W()?w||se?"Wait for the current chat operatio\
n to finish.":u.generateImage.checked?"Uncheck Generate image to attach an image for a vision model.":sr(ir("image-text-\
to-text"),"image-text-to-text")||"Choose Mixed or a loaded local or peer vision model to attach an image.":"This chat is\
 closing."}),u.imageFile.onchange=()=>{ce.cancel(),ho(u.imageFile.files[0])},u.removeAttachment.onclick=()=>{ce.cancel(),
P?.abort(),wt()},u.cancel.onclick=()=>{if(ze){re();return}w?.abort(new DOMException("User cancelled","AbortError")),nr.active&&
ut?.cancel().catch(lt),Y&&(u.storedStatus.textContent="Cancelling verification… Waiting for cleanup."),q&&(u.storedStatus.
textContent="Cancelling deletion… Waiting for cleanup."),Re(),C&&v.cancel(C).catch(lt),O&&_?.cancel(O).catch(lt)},u.loadingCancel.
onclick=re,u.loading.addEventListener("cancel",x=>{x.preventDefault(),re()}),u.storedCancel.onclick=()=>u.cancel.click();
const po=x=>x&&typeof x.local=="boolean"?`${x.local?"Local":"Peer"} · ${String(x.modelName??x.manifestCid??"model").slice(
0,180)}`:null;function wm(x,M){nr=x,W()&&(!M?.aborted&&x.status!=="idle"&&x.status!=="closed"&&De({"requesting-microphon\
e":"Waiting for microphone permission… keep holding Talk.",recording:"Listening… release Talk to send.",transcribing:"\
Transcribing voice…",synthesizing:"Preparing spoken reply…",playing:"Speaking…"}[x.status]??x.status),Re())}async function vm(x){
!ut&&!ft&&(ft=(async()=>{at=await b();try{return ut=await m({audio:at,execute:async(U,z)=>{if(G){const we=await(await ht()).
speechTarget(G,{signal:z.signal});U=U==="local-only"||we==="local-only"?"local-only":"mixed"}const Q=z.requestId??crypto.
randomUUID();C=Q;try{return await v.generate(U,{...z,requestId:Q})}finally{C===Q&&(C=null)}}}),ut}catch(U){throw await at?.
dispose(),at=null,U}})().finally(()=>{ft=null}));const M=ut??await ft;return x?.throwIfAborted(),M}function Em(x){if(!W()||
w?.signal.aborted)return;const M=po(x.route??(x.type==="routing"||x.type==="route"?x:null));M&&De(`${nr.status==="transc\
ribing"?"Speech recognition":"Speech"} · ${M}`)}async function km(x,{text:M=u.prompt.value.trim(),preserveDraft:U=!1}={}){
const z=ir(),Q=z?.key??u.target.value,we=z?.agentId,Le=gn(),Qe=Le==="text-to-image",Ne=T;if(Qe&&Ne)throw new Error("Remo\
ve the attached image or uncheck Generate image.");if(!sr(z,Le))throw new Error("No compatible model is available. Load \
one in Models or choose another target.");if(!yn(z,Le))throw new Error("Compatible models have no available queue capaci\
ty. Wait for capacity or choose another target.");if(Ne&&!z.modalities?.includes("image"))throw new Error("This model ac\
cepts text only. Remove the image or choose an image model.");if(At(),we){const $r=await ht(),dt=await $r.get(we,{signal:x}),
Xe=cn(dt);if(Xe)throw new Error(Xe)}const Bt=Qe||we?null:await s?.({includeImage:!1}),Ot=(typeof Bt=="string"?Bt:Bt?.text??
"").slice(0,16e3),Ut=Qe||we?"":String(i?.instructions??"").slice(0,8e3),or=Ne||we?[]:A.get(Q)??[],Ye=M||"Describe this i\
mage.",nc=Qe?void 0:[...Ot||Ut?[{role:"system",content:Ot+`
`+Ut}]:[],...or.slice(-6),{role:"user",content:OE(Ye,{task:Le,concise:u.beConcise.checked})}];uf(u,"user",M,{image:Ne?.preview});
const Yr=uf(u,"assistant","",{targetName:z.automatic?"Choosing model…":z.name}),mo=$r=>{const dt=po($r);!dt||!W()||x.aborted||
(Yr.parentElement.querySelector(".pc-chat-speaker").textContent=we?`Agent · ${z.name} · ${dt}`:dt,Yr.parentElement.dataset.
routeTarget=String($r.target??"").slice(0,256),De(`Using ${dt}`))};U||(u.prompt.value=""),wt(),qe(),C=we?null:crypto.randomUUID(),
O=we,G=we,De("Choosing a compatible model…");try{const $r={onProgress(Xe){mo(Xe.route??(["route","routing","accepted"].
includes(Xe.type)?Xe:null)),W()&&Qe&&Number.isSafeInteger(Xe.step)&&Number.isSafeInteger(Xe.steps)&&Xe.step>=0&&Xe.step<=
Xe.steps&&Xe.steps<=100&&De(`Generating image: ${Xe.step}/${Xe.steps} steps…`)},onToken(Xe){W()&&!x.aborted&&!Qe&&(Yr.
textContent+=Xe,qe())}},dt=we?await _.run(we,{signal:x,task:Le,prompt:Ye,concise:u.beConcise.checked,...Ne?{image:Ne.image}:
{},maxNewTokens:1024,...$r}):await v.generate(Q,{requestId:C,signal:x,task:Le,...Qe?{prompt:M}:{messages:nc,image:Ne?.image,
maxNewTokens:1024},...$r});if(x.aborted)throw new DOMException("Generation cancelled","AbortError");if(mo(dt.route),Qe){
if(!z.outputModalities?.includes("image"))throw new Error("This target did not advertise image output");await y.append(Yr,
dt.image,{signal:x,prompt:M})}else{if(typeof dt.text!="string")throw new Error("Model returned an invalid text response");
if(Yr.textContent=dt.text,!we){for(or.push({role:"user",content:Ye},{role:"assistant",content:dt.text});or.length>6||k.encode(
JSON.stringify(or)).byteLength>24*1024;)or.splice(0,2);A.delete(Q),A.set(Q,or),A.size>8&&A.delete(A.keys().next().value)}}
if(De("Ready.",{quiet:!0}),!Qe){const Xe=[];if(dt.finishReason==="length"?Xe.push("Response reached the model’s output o\
r context limit and may be incomplete."):dt.finishReason!=="stop"&&Xe.push("The model did not report whether this respon\
se is complete."),dt.contextTruncated&&Xe.push("Older conversation turns were omitted to fit the model’s context."),Xe.
length){const ln=document.createElement("p");ln.className="pc-inference-note",ln.textContent=Xe.join(" "),Yr.after(ln),De(
Xe.join(" "))}}try{for(const Xe of(Qe?[]:i?.propose(dt.text)??[]).slice(0,4)){const ln=document.createElement("button");
ln.type="button",ln.textContent="Apply: "+Xe.label,ln.onclick=async()=>{ln.disabled=!0;try{await Xe.apply()}catch(zd){lt(
zd)}},u.proposed.append(ln)}}catch{}if(!Qe&&u.speakReplies.checked&&dt.text.trim())try{const Xe=await vm(x),ln=we?await _.
speechTarget(we,{signal:x}):Q;await Xe.speak(dt.text,{target:ln,signal:x,onProgress:Em,onState:zd=>wm(zd,x)}),x.throwIfAborted(),
De("Ready.",{quiet:!0})}catch(Xe){x.throwIfAborted(),De(`Text reply received. Voice: ${Xe.message}. Load a speech-synthe\
sis model in Models or use a compatible peer.`)}return dt}catch($r){throw Yr.textContent||(Yr.textContent=$r.name==="Abo\
rtError"?"Cancelled.":"Request failed."),$r}finally{C=null,O=null,G=null,qe()}}async function xm(){u.send.disabled||await Ge(
x=>km(x))}u.send.onclick=()=>{xm()};const Sm=zP({button:u.talk,onStart(){if(!W()||u.talk.disabled||w)return;const x={controller:new AbortController,
released:!1};yt=x,Ge(async M=>{const U=AbortSignal.any([M,x.controller.signal]);U.throwIfAborted();const z=u.target.value||
"mixed";G=Vt(z);const Q=G?await(await ht()).speechTarget(G,{signal:U}):z,we=await vm(U);let Le,Qe;try{Qe=await we.record(
{target:Q,signal:U,onProgress:Em,onState:Ne=>{Ne.status!=="idle"&&(Le=Ne.status),Ne.recording&&(x.captureReady=!0),wm(Ne,
U)}})}catch(Ne){throw U.throwIfAborted(),Le==="transcribing"?new Error(`${Ne.message}. Load a speech-recognition model i\
n Models or use a compatible peer.`,{cause:Ne}):Ne}if(U.throwIfAborted(),!Qe.text?.trim())throw new Error("No speech rec\
ognized. Try again or type a message.");await km(U,{text:Qe.text.trim(),preserveDraft:!0})}).finally(()=>{yt===x&&(yt=null,
Sm.reset(),W()&&Re())})},onRelease(){const x=yt;!x||x.released||(x.released=!0,nr.recording?Promise.resolve().then(()=>ut.
stop()).catch(M=>{x.controller.abort(M),lt(M)}):x.captureReady||x.controller.abort(new DOMException("Microphone was not \
ready. Hold Talk again to record.","AbortError")),W()&&Re())},onCancel(){!yt||yt.released||(yt.released=!0,yt.controller.
abort(new DOMException("Recording cancelled","AbortError")),W()&&Re())}});u.agents.onclick=()=>{!W()||u.agents.disabled||
(Tr=(async()=>{try{const x=await v.getAgentController();if(!W())return;await ht(),Dr??=PP({container:u.panel,controller:x,
onChat:async M=>{await _.refresh(),je(),await wi(`agent:${M}`),requestAnimationFrame(()=>{W()&&u.prompt.focus()})},onBrowseModels:()=>{
W()&&u.browse.click()}}),u.networkInfo.close(),u.chatOptions.close(),u.menuWindow.close(),u.configuration.close(),Ie?.close(),
u.about.close(),u.compatibility.close(),await Dr.open({selectedId:Vt(u.target.value)})}catch(x){lt(x)}})().finally(()=>{
Tr=null,W()&&Re()}),Re())},u.prompt.onkeydown=x=>{x.key==="Enter"&&!x.shiftKey&&!x.isComposing&&(x.preventDefault(),xm())};
const Am=(async()=>{const x=await it();if(W()){if(ve=!1,Re(),d){Ie.open({tab:!x||pe.length?"stored":"browse",refreshStored:!1,
selectedKey:gt});return}if(!x||pe.length){Ie.open({tab:"stored",refreshStored:!1,selectedKey:gt}),x&&De("Choose stored m\
odels to load, or close the library to use peers.",{quiet:!0});return}try{const M=v.getStartupModel?.();M&&(gt=M.sourceKey,
Jr(),M.manifestCid?De("The remembered model is no longer in the stored library. Choose a model to load."):Kr(M)?De(M.needsVerification?
`${M.name} is saved but needs local verification. Open Models → Stored models → Verify locally. No model download has st\
arted.`:`Cannot load ${M.name}: ${ls(M)}`):Ge(async U=>{K({stage:"prepare"});const z={signal:U,onProgress:Q=>{U.aborted||
K(Q)},ggufGpuLayers:Number(u.gpuLayers.value)};await v.acquireModel(M.sourceKey,z),U.throwIfAborted(),je(),De(`Loaded ${M.
name}. Send a message.`,{quiet:!0})},{modelName:M.name}))}catch(M){lt(M)}}})();if(_r=setInterval(()=>{ee(),_?.refresh().
catch(lt)},Math.max(20,h)),!d&&v.getAgentController&&ht().catch(x=>{W()&&lt(x)}),l&&!v.networkReady){const x=new AbortController;
ae=x,fe=v.connectBackend({signal:x.signal}).then(()=>ee()).catch(M=>{W()&&!x.signal.aborted&&(Te=M)}).finally(()=>{ae===
x&&(ae=null),W()&&Hs()})}else ee();async function Fd(){if(clearInterval(Mt),Mt=null,!N){if(te)return te;if(H=!0,Sm.dispose(),
u.networkInfo.dispose(),u.chatOptions.close(),Fe){Ie.setBusy(!0),Ie.setFeedback("Closing Models… Waiting for cleanup.");
for(const x of u.storedContent.querySelectorAll("button,input"))x.disabled=!0}else Ie?.dispose(),u.panel.inert=!0;Ht?.(),
y.dispose(),u.menuWindow.close(),u.compatibility.close(),u.configuration.close(),u.about.close(),te=(async()=>{clearInterval(
_r),w?.abort("Chat closed"),ie?.abort(),P?.abort(),j?.abort(),ae?.abort(),ye?.abort(),await ce?.dispose(),await _?.dispose(),
At(),await I,await X,await fe,await he,await Am,await Promise.allSettled([...S]),await Tr,await B?.catch(()=>{}),await xe,
await Dr?.dispose(),await ft,await ut?.dispose(),await v.dispose(),N=!0,Ie?.dispose(),A.clear(),T=null,u.panel.remove(),
a?.()})();try{await te}catch(x){throw Fe&&(Fe.showLibrary(),Ie.setBusy(!0),Ie.setFeedback(`Could not close Models: ${x.message}\
. Click Done to retry.`)),x}finally{te=null}}}return{element:u.panel,runtime:v,dispose:Fd,refreshPeers:ee,startupReady:Am,
openModels:Rr}}function WP({scope:t=globalThis,onChange:e}={}){const r=new Set(e?[e]:[]),n=t.matchMedia?.("(display-mode\
: standalone)");let s=n?.matches===!0||t.navigator?.standalone===!0,i=null,o=!1,a=!1;const c=t.isSecureContext===!0,l="o\
nbeforeinstallprompt"in t,d=()=>s?"PeerCompute is installed on this device.":c?/iPad|iPhone|iPod/.test(t.navigator?.userAgent??
"")?"In Safari, open Share, then Add to Home Screen. The app shell can open offline; models remain managed by the browse\
r’s storage.":"Use your browser’s Install app or Add to Home Screen menu, if available. The app shell can open offline\
; downloading models and peer connections need a network.":"Open this console over HTTPS to install it.",f=()=>Object.freeze(
{supported:c&&l,available:c&&!!i&&!s&&!o&&!a,installed:s,installing:o,instructions:d()}),h=()=>{if(a)return;const g=f();
for(const u of r)try{u(g)}catch{}},p=g=>{!c||s||a||typeof g.prompt!="function"||(g.preventDefault(),i=g,h())},m=()=>{s=!0,
i=null,o=!1,h()},b=()=>{s=n?.matches===!0||t.navigator?.standalone===!0,h()};return t.addEventListener?.("beforeinstallp\
rompt",p),t.addEventListener?.("appinstalled",m),n?.addEventListener?.("change",b),Object.freeze({getState:f,subscribe(g){
if(typeof g!="function")throw new TypeError("Install listener must be a function");return a?()=>{}:(r.add(g),g(f()),()=>r.
delete(g))},async install(){if(s)return{outcome:"installed"};if(!i||o||a||!c)return{outcome:"unavailable",instructions:d()};
const g=i;i=null,o=!0,h();try{const u=await g.prompt();return{outcome:(g.userChoice?await g.userChoice:u)?.outcome==="ac\
cepted"?"accepted":"dismissed"}}finally{o=!1,h()}},dispose(){a||(a=!0,i=null,r.clear(),t.removeEventListener?.("beforein\
stallprompt",p),t.removeEventListener?.("appinstalled",m),n?.removeEventListener?.("change",b))}})}async function HP({scope:t=globalThis}={}){
if(!t.isSecureContext||!t.navigator?.serviceWorker)return null;const e=new URL("./",t.location.href),r=new URL("pages-is\
olation-sw.js",e).href,n=t.navigator.serviceWorker;return n.controller&&n.controller.scriptURL!==r?null:n.register(r,{scope:e.
href,type:"module",updateViaCache:"none"})}const ym=WP();window.inferencePwa=ym;HP().catch(()=>{});window.addEventListener(
"pagehide",t=>{t.persisted||ym.dispose()});async function VP(){try{window.inferencePanel=await GP({container:document.querySelector(
"#panel"),autoConnect:!0,pwaInstallController:ym})}catch(t){const e=document.createElement("p");e.textContent=t.message,
document.querySelector("#panel").append(e)}}VP();const tU=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,
{value:"Module"}));export{l9 as $,f9 as A,di as B,by as C,O9 as D,A9 as E,I9 as F,tM as G,A6 as H,hN as I,S9 as J,Fr as K,kM as L,Ae as M,k9 as N,
SM as O,$d as P,F9 as Q,U9 as R,E9 as S,cs as T,Ns as U,bE as V,a9 as W,o9 as X,im as Y,wE as Z,d9 as _,Ql as a,g9 as a$,
c9 as a0,Nn as a1,gv as a2,L9 as a3,R9 as a4,B9 as a5,x9 as a6,b9 as a7,jN as a8,pM as a9,u9 as aA,Qn as aB,tE as aC,H7 as aD,
am as aE,EE as aF,kE as aG,p$ as aH,V7 as aI,vE as aJ,Od as aK,_E as aL,TE as aM,CE as aN,as as aO,$a as aP,K7 as aQ,Q7 as aR,
Zn as aS,nm as aT,uE as aU,Qu as aV,n9 as aW,t9 as aX,e9 as aY,an as aZ,nM as a_,sM as aa,C9 as ab,DE as ac,_9 as ad,$9 as ae,
P9 as af,N9 as ag,h9 as ah,y9 as ai,j9 as aj,D9 as ak,Kt as al,Vn as am,p9 as an,T9 as ao,U7 as ap,G9 as aq,l1 as ar,sE as as,
nE as at,Vo as au,Qi as av,zt as aw,Nd as ax,Pd as ay,wh as az,vs as b,sm as b0,I6 as b1,O0 as b2,ja as b3,BO as b4,Pv as b5,
lM as b6,JN as b7,T0 as b8,Os as b9,ka as ba,Ct as bb,VN as bc,of as bd,Q9 as be,J9 as bf,Kc as bg,eU as bh,Y9 as bi,Nh as bj,
H9 as bk,gm as bl,Z9 as bm,X9 as bn,HN as bo,V9 as bp,W9 as bq,K9 as br,KN as bs,tU as bt,LE as c,a1 as d,fN as e,v9 as f,
pN as g,q9 as h,w9 as i,z9 as j,$N as k,Ud as l,PN as m,Da as n,Xa as o,sn as p,gy as q,c1 as r,ZO as s,r9 as t,s9 as u,
$D as v,i9 as w,m9 as x,em as y,XO as z};
