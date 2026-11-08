const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-Cj3RfR7N.js","./GgufArtifactReader-CFX3HPRc.js","./index-DGU-D0cB.js","./modelTask-BPAx77_w.js","./modelTask-BqbEMTnA.js","./ModelInferenceService-D967skUg.js","./NetworkManager-90M8GHuE.js","./VoiceSession-Dcf7zETG.js"])))=>i.map(i=>d[i]);
import{_ as Ft}from"./index-DGU-D0cB.js";const bn=()=>new Map,gf=t=>{const e=bn();return t.forEach((r,n)=>{e.set(n,r)}),
e},js=(t,e,r)=>{let n=t.get(e);return n===void 0&&t.set(e,n=r()),n},NE=(t,e)=>{const r=[];for(const[n,s]of t)r.push(e(s,
n));return r},PE=(t,e)=>{for(const[r,n]of t)if(e(n,r))return!0;return!1},zi=()=>new Set,qd=t=>t[t.length-1],OE=(t,e)=>{for(let r=0;r<
e.length;r++)t.push(e[r])},Os=Array.from,qh=(t,e)=>{for(let r=0;r<t.length;r++)if(!e(t[r],r,t))return!1;return!0},nw=(t,e)=>{
for(let r=0;r<t.length;r++)if(e(t[r],r,t))return!0;return!1},UE=(t,e)=>{const r=new Array(t);for(let n=0;n<t;n++)r[n]=e(
n,r);return r},td=Array.isArray;class jh{constructor(){this._observers=bn()}on(e,r){js(this._observers,e,zi).add(r)}once(e,r){
const n=(...s)=>{this.off(e,n),r(...s)};this.on(e,n)}off(e,r){const n=this._observers.get(e);n!==void 0&&(n.delete(r),n.
size===0&&this._observers.delete(e))}emit(e,r){return Os((this._observers.get(e)||bn()).values()).forEach(n=>n(...r))}destroy(){
this._observers=bn()}}const Rn=Math.floor,Rc=Math.abs,sw=(t,e)=>t<e?t:e,di=(t,e)=>t>e?t:e,iw=t=>t!==0?t<0:1/t<0,Em=1,km=2,
jd=4,Gd=8,la=32,Kn=64,Hr=128,rd=31,bf=63,Xs=127,FE=2147483647,Xc=Number.MAX_SAFE_INTEGER,xm=Number.MIN_SAFE_INTEGER,zE=Number.
isInteger||(t=>typeof t=="number"&&isFinite(t)&&Rn(t)===t),qE=String.fromCharCode,jE=t=>t.toLowerCase(),GE=/^\s*/g,WE=t=>t.
replace(GE,""),HE=/([A-Z])/g,Sm=(t,e)=>WE(t.replace(HE,r=>`${e}${jE(r)}`)),VE=t=>{const e=unescape(encodeURIComponent(t)),
r=e.length,n=new Uint8Array(r);for(let s=0;s<r;s++)n[s]=e.codePointAt(s);return n},da=typeof TextEncoder<"u"?new TextEncoder:
null,KE=t=>da.encode(t),QE=da?KE:VE;let Jo=typeof TextDecoder>"u"?null:new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});
Jo&&Jo.decode(new Uint8Array).length===1&&(Jo=null);const JE=(t,e)=>UE(e,()=>t).join("");let Na=class{constructor(){this.
cpos=0,this.cbuf=new Uint8Array(100),this.bufs=[]}};const nd=()=>new Na,XE=t=>{let e=t.cpos;for(let r=0;r<t.bufs.length;r++)
e+=t.bufs[r].length;return e},Cn=t=>{const e=new Uint8Array(XE(t));let r=0;for(let n=0;n<t.bufs.length;n++){const s=t.bufs[n];
e.set(s,r),r+=s.length}return e.set(new Uint8Array(t.cbuf.buffer,0,t.cpos),r),e},YE=(t,e)=>{const r=t.cbuf.length;r-t.cpos<
e&&(t.bufs.push(new Uint8Array(t.cbuf.buffer,0,t.cpos)),t.cbuf=new Uint8Array(di(r,e)*2),t.cpos=0)},Ot=(t,e)=>{const r=t.
cbuf.length;t.cpos===r&&(t.bufs.push(t.cbuf),t.cbuf=new Uint8Array(r*2),t.cpos=0),t.cbuf[t.cpos++]=e},yf=Ot,Pe=(t,e)=>{for(;e>
Xs;)Ot(t,Hr|Xs&e),e=Rn(e/128);Ot(t,Xs&e)},Gh=(t,e)=>{const r=iw(e);for(r&&(e=-e),Ot(t,(e>bf?Hr:0)|(r?Kn:0)|bf&e),e=Rn(e/
64);e>0;)Ot(t,(e>Xs?Hr:0)|Xs&e),e=Rn(e/128)},wf=new Uint8Array(3e4),ZE=wf.length/3,ek=(t,e)=>{if(e.length<ZE){const r=da.
encodeInto(e,wf).written||0;Pe(t,r);for(let n=0;n<r;n++)Ot(t,wf[n])}else qr(t,QE(e))},tk=(t,e)=>{const r=unescape(encodeURIComponent(
e)),n=r.length;Pe(t,n);for(let s=0;s<n;s++)Ot(t,r.codePointAt(s))},Mi=da&&da.encodeInto?ek:tk,sd=(t,e)=>{const r=t.cbuf.
length,n=t.cpos,s=sw(r-n,e.length),i=e.length-s;t.cbuf.set(e.subarray(0,s),n),t.cpos+=s,i>0&&(t.bufs.push(t.cbuf),t.cbuf=
new Uint8Array(di(r*2,i)),t.cbuf.set(e.subarray(s)),t.cpos=i)},qr=(t,e)=>{Pe(t,e.byteLength),sd(t,e)},Wh=(t,e)=>{YE(t,e);
const r=new DataView(t.cbuf.buffer,t.cpos,e);return t.cpos+=e,r},rk=(t,e)=>Wh(t,4).setFloat32(0,e,!1),nk=(t,e)=>Wh(t,8).
setFloat64(0,e,!1),sk=(t,e)=>Wh(t,8).setBigInt64(0,e,!1),Am=new DataView(new ArrayBuffer(4)),ik=t=>(Am.setFloat32(0,t),Am.
getFloat32(0)===t),ua=(t,e)=>{switch(typeof e){case"string":Ot(t,119),Mi(t,e);break;case"number":zE(e)&&Rc(e)<=FE?(Ot(t,
125),Gh(t,e)):ik(e)?(Ot(t,124),rk(t,e)):(Ot(t,123),nk(t,e));break;case"bigint":Ot(t,122),sk(t,e);break;case"object":if(e===
null)Ot(t,126);else if(td(e)){Ot(t,117),Pe(t,e.length);for(let r=0;r<e.length;r++)ua(t,e[r])}else if(e instanceof Uint8Array)
Ot(t,116),qr(t,e);else{Ot(t,118);const r=Object.keys(e);Pe(t,r.length);for(let n=0;n<r.length;n++){const s=r[n];Mi(t,s),
ua(t,e[s])}}break;case"boolean":Ot(t,e?120:121);break;default:Ot(t,127)}};class Im extends Na{constructor(e){super(),this.
w=e,this.s=null,this.count=0}write(e){this.s===e?this.count++:(this.count>0&&Pe(this,this.count-1),this.count=1,this.w(this,
e),this.s=e)}}const _m=t=>{t.count>0&&(Gh(t.encoder,t.count===1?t.s:-t.s),t.count>1&&Pe(t.encoder,t.count-2))};class Tc{constructor(){
this.encoder=new Na,this.s=0,this.count=0}write(e){this.s===e?this.count++:(_m(this),this.count=1,this.s=e)}toUint8Array(){
return _m(this),Cn(this.encoder)}}const Cm=t=>{if(t.count>0){const e=t.diff*2+(t.count===1?0:1);Gh(t.encoder,e),t.count>
1&&Pe(t.encoder,t.count-2)}};class Wd{constructor(){this.encoder=new Na,this.s=0,this.count=0,this.diff=0}write(e){this.
diff===e-this.s?(this.s=e,this.count++):(Cm(this),this.count=1,this.diff=e-this.s,this.s=e)}toUint8Array(){return Cm(this),
Cn(this.encoder)}}class ok{constructor(){this.sarr=[],this.s="",this.lensE=new Tc}write(e){this.s+=e,this.s.length>19&&(this.
sarr.push(this.s),this.s=""),this.lensE.write(e.length)}toUint8Array(){const e=new Na;return this.sarr.push(this.s),this.
s="",Mi(e,this.sarr.join("")),sd(e,this.lensE.toUint8Array()),Cn(e)}}const es=t=>new Error(t),yn=()=>{throw es("Method u\
nimplemented")},sn=()=>{throw es("Unexpected case")},ow=es("Unexpected end of array"),aw=es("Integer out of Range");let id=class{constructor(e){
this.arr=e,this.pos=0}};const Xi=t=>new id(t),ak=t=>t.pos!==t.arr.length,ck=(t,e)=>{const r=new Uint8Array(t.arr.buffer,
t.pos+t.arr.byteOffset,e);return t.pos+=e,r},jr=t=>ck(t,De(t)),qi=t=>t.arr[t.pos++],De=t=>{let e=0,r=1;const n=t.arr.length;
for(;t.pos<n;){const s=t.arr[t.pos++];if(e=e+(s&Xs)*r,r*=128,s<Hr)return e;if(e>Xc)throw aw}throw ow},Hh=t=>{let e=t.arr[t.
pos++],r=e&bf,n=64;const s=(e&Kn)>0?-1:1;if((e&Hr)===0)return s*r;const i=t.arr.length;for(;t.pos<i;){if(e=t.arr[t.pos++],
r=r+(e&Xs)*n,n*=128,e<Hr)return s*r;if(r>Xc)throw aw}throw ow},lk=t=>{let e=De(t);if(e===0)return"";{let r=String.fromCodePoint(
qi(t));if(--e<100)for(;e--;)r+=String.fromCodePoint(qi(t));else for(;e>0;){const n=e<1e4?e:1e4,s=t.arr.subarray(t.pos,t.
pos+n);t.pos+=n,r+=String.fromCodePoint.apply(null,s),e-=n}return decodeURIComponent(escape(r))}},dk=t=>Jo.decode(jr(t)),
Bi=Jo?dk:lk,Vh=(t,e)=>{const r=new DataView(t.arr.buffer,t.arr.byteOffset+t.pos,e);return t.pos+=e,r},uk=t=>Vh(t,4).getFloat32(
0,!1),fk=t=>Vh(t,8).getFloat64(0,!1),hk=t=>Vh(t,8).getBigInt64(0,!1),pk=[t=>{},t=>null,Hh,uk,fk,hk,t=>!1,t=>!0,Bi,t=>{const e=De(
t),r={};for(let n=0;n<e;n++){const s=Bi(t);r[s]=fa(t)}return r},t=>{const e=De(t),r=[];for(let n=0;n<e;n++)r.push(fa(t));
return r},jr],fa=t=>pk[127-qi(t)](t);class Rm extends id{constructor(e,r){super(e),this.reader=r,this.s=null,this.count=
0}read(){return this.count===0&&(this.s=this.reader(this),ak(this)?this.count=De(this)+1:this.count=-1),this.count--,this.
s}}class Mc extends id{constructor(e){super(e),this.s=0,this.count=0}read(){if(this.count===0){this.s=Hh(this);const e=iw(
this.s);this.count=1,e&&(this.s=-this.s,this.count=De(this)+2)}return this.count--,this.s}}class Hd extends id{constructor(e){
super(e),this.s=0,this.count=0,this.diff=0}read(){if(this.count===0){const e=Hh(this),r=e&1;this.diff=Rn(e/2),this.count=
1,r&&(this.count=De(this)+2)}return this.s+=this.diff,this.count--,this.s}}class mk{constructor(e){this.decoder=new Mc(e),
this.str=Bi(this.decoder),this.spos=0}read(){const e=this.spos+this.decoder.read(),r=this.str.slice(this.spos,e);return this.
spos=e,r}}const gk=crypto.getRandomValues.bind(crypto),cw=()=>gk(new Uint32Array(1))[0],bk="10000000-1000-4000-8000"+-1e11,
yk=()=>bk.replace(/[018]/g,t=>(t^cw()&15>>t/4).toString(16)),ji=t=>new Promise(t);Promise.all.bind(Promise);const Tm=t=>t===
void 0?null:t;class wk{constructor(){this.map=new Map}setItem(e,r){this.map.set(e,r)}getItem(e){return this.map.get(e)}}
let lw=new wk,vk=!0;try{typeof localStorage<"u"&&localStorage&&(lw=localStorage,vk=!1)}catch{}const Ek=lw,ha=Symbol("Equ\
ality"),dw=(t,e)=>t===e||!!t?.[ha]?.(e)||!1,kk=t=>typeof t=="object",xk=Object.assign,Sk=Object.keys,Yc=t=>Sk(t).length,
Ak=t=>{for(const e in t)return!1;return!0},Pa=(t,e)=>{for(const r in t)if(!e(t[r],r))return!1;return!0},Kh=(t,e)=>Object.
prototype.hasOwnProperty.call(t,e),Ik=(t,e)=>t===e||Yc(t)===Yc(e)&&Pa(t,(r,n)=>(r!==void 0||Kh(e,n))&&dw(e[n],r)),Qh=(t,e,r=0)=>{
try{for(;r<t.length;r++)t[r](...e)}finally{r<t.length&&Qh(t,e,r+1)}},Bc=(t,e)=>{if(t===e)return!0;if(t==null||e==null||t.
constructor!==e.constructor&&(t.constructor||Object)!==(e.constructor||Object))return!1;if(t[ha]!=null)return t[ha](e);switch(t.
constructor){case ArrayBuffer:t=new Uint8Array(t),e=new Uint8Array(e);case Uint8Array:{if(t.byteLength!==e.byteLength)return!1;
for(let r=0;r<t.length;r++)if(t[r]!==e[r])return!1;break}case Set:{if(t.size!==e.size)return!1;for(const r of t)if(!e.has(
r))return!1;break}case Map:{if(t.size!==e.size)return!1;for(const r of t.keys())if(!e.has(r)||!Bc(t.get(r),e.get(r)))return!1;
break}case void 0:case Object:if(Yc(t)!==Yc(e))return!1;for(const r in t)if(!Kh(t,r)||!Bc(t[r],e[r]))return!1;break;case Array:
if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++)if(!Bc(t[r],e[r]))return!1;break;default:return!1}return!0},_k=(t,e)=>e.
includes(t);var uw={};const pa=typeof process<"u"&&process.release&&/node|io\.js/.test(process.release.name)&&Object.prototype.
toString.call(typeof process<"u"?process:0)==="[object process]";let En;const Ck=()=>{if(En===void 0)if(pa){En=bn();const t=process.
argv;let e=null;for(let r=0;r<t.length;r++){const n=t[r];n[0]==="-"?(e!==null&&En.set(e,""),e=n):e!==null&&(En.set(e,n),
e=null)}e!==null&&En.set(e,"")}else typeof location=="object"?(En=bn(),(location.search||"?").slice(1).split("&").forEach(
t=>{if(t.length!==0){const[e,r]=t.split("=");En.set(`--${Sm(e,"-")}`,r),En.set(`-${Sm(e,"-")}`,r)}})):En=bn();return En},
vf=t=>Ck().has(t),Ef=t=>Tm(pa?uw[t.toUpperCase().replaceAll("-","_")]:Ek.getItem(t)),fw=t=>vf("--"+t)||Ef(t)!==null,Rk=fw(
"production"),Tk=pa&&_k(uw.FORCE_COLOR,["true","1","2"]),Mk=Tk||!vf("--no-colors")&&!fw("no-color")&&(!pa||process.stdout.
isTTY)&&(!pa||vf("--color")||Ef("COLORTERM")!==null||(Ef("TERM")||"").includes("color")),Bk=t=>new Uint8Array(t),Lk=t=>{
const e=Bk(t.byteLength);return e.set(t),e};class Dk{constructor(e,r){this.left=e,this.right=r}}const Un=(t,e)=>new Dk(t,
e),Mm=t=>t.next()>=.5,Vd=(t,e,r)=>Rn(t.next()*(r+1-e)+e),hw=(t,e,r)=>Rn(t.next()*(r+1-e)+e),Jh=(t,e,r)=>hw(t,e,r),$k=t=>qE(
Jh(t,97,122)),Nk=(t,e=0,r=20)=>{const n=Jh(t,e,r);let s="";for(let i=0;i<n;i++)s+=$k(t);return s},Kd=(t,e)=>e[Jh(t,0,e.length-
1)],Pk=Symbol("0schema");class Ok{constructor(){this._rerrs=[]}extend(e,r,n,s=null){this._rerrs.push({path:e,expected:r,
has:n,message:s})}toString(){const e=[];for(let r=this._rerrs.length-1;r>0;r--){const n=this._rerrs[r];e.push(JE(" ",(this.
_rerrs.length-r)*2)+`${n.path!=null?`[${n.path}] `:""}${n.has} doesn't match ${n.expected}. ${n.message}`)}return e.join(
`
`)}}const kf=(t,e)=>t===e?!0:t==null||e==null||t.constructor!==e.constructor?!1:t[ha]?dw(t,e):td(t)?qh(t,r=>nw(e,n=>kf(r,
n))):kk(t)?Pa(t,(r,n)=>kf(r,e[n])):!1;class Ar{static _dilutes=!1;extends(e){let[r,n]=[this.shape,e.shape];return this.constructor.
_dilutes&&([n,r]=[r,n]),kf(r,n)}equals(e){return this.constructor===e.constructor&&Bc(this.shape,e.shape)}[Pk](){return!0}[ha](e){
return this.equals(e)}validate(e){return this.check(e)}check(e,r){yn()}get nullable(){return Yi(this,dd)}get optional(){
return new gw(this)}cast(e){return Bm(e,this),e}expect(e){return Bm(e,this),e}}class Xh extends Ar{constructor(e,r){super(),
this.shape=e,this._c=r}check(e,r=void 0){const n=e?.constructor===this.shape&&(this._c==null||this._c(e));return!n&&r?.extend(
null,this.shape.name,e?.constructor.name,e?.constructor!==this.shape?"Constructor match failed":"Check failed"),n}}const _t=(t,e=null)=>new Xh(
t,e);_t(Xh);class Yh extends Ar{constructor(e){super(),this.shape=e}check(e,r){const n=this.shape(e);return!n&&r?.extend(
null,"custom prop",e?.constructor.name,"failed to check custom prop"),n}}const jt=t=>new Yh(t);_t(Yh);class od extends Ar{constructor(e){
super(),this.shape=e}check(e,r){const n=this.shape.some(s=>s===e);return!n&&r?.extend(null,this.shape.join(" | "),e.toString()),
n}}const ad=(...t)=>new od(t),pw=_t(od),Uk=RegExp.escape||(t=>t.replace(/[().|&,$^[\]]/g,e=>"\\"+e)),mw=t=>{if(Gi.check(
t))return[Uk(t)];if(pw.check(t))return t.shape.map(e=>e+"");if(Aw.check(t))return["[+-]?\\d+.?\\d*"];if(Iw.check(t))return[
".*"];if(Zc.check(t))return t.shape.map(mw).flat(1);sn()};class Fk extends Ar{constructor(e){super(),this.shape=e,this._r=
new RegExp("^"+e.map(mw).map(r=>`(${r.join("|")})`).join("")+"$")}check(e,r){const n=this._r.exec(e)!=null;return!n&&r?.
extend(null,this._r.toString(),e.toString(),"String doesn't match string template."),n}}_t(Fk);const zk=Symbol("optional");
class gw extends Ar{constructor(e){super(),this.shape=e}check(e,r){const n=e===void 0||this.shape.check(e);return!n&&r?.
extend(null,"undefined (optional)","()"),n}get[zk](){return!0}}const qk=_t(gw);class jk extends Ar{check(e,r){return r?.
extend(null,"never",typeof e),!1}}_t(jk);class cd extends Ar{constructor(e,r=!1){super(),this.shape=e,this._isPartial=r}static _dilutes=!0;get partial(){
return new cd(this.shape,!0)}check(e,r){return e==null?(r?.extend(null,"object","null"),!1):Pa(this.shape,(n,s)=>{const i=this.
_isPartial&&!Kh(e,s)||n.check(e[s],r);return!i&&r?.extend(s.toString(),n.toString(),typeof e[s],"Object property does no\
t match"),i})}}const Gk=t=>new cd(t),Wk=_t(cd),Hk=jt(t=>t!=null&&(t.constructor===Object||t.constructor==null));class bw extends Ar{constructor(e,r){
super(),this.shape={keys:e,values:r}}check(e,r){return e!=null&&Pa(e,(n,s)=>{const i=this.shape.keys.check(s,r);return!i&&
r?.extend(s+"","Record",typeof e,i?"Key doesn't match schema":"Value doesn't match value"),i&&this.shape.values.check(n,
r)})}}const yw=(t,e)=>new bw(t,e),Vk=_t(bw);class ww extends Ar{constructor(e){super(),this.shape=e}check(e,r){return e!=
null&&Pa(this.shape,(n,s)=>{const i=n.check(e[s],r);return!i&&r?.extend(s.toString(),"Tuple",typeof n),i})}}const Kk=(...t)=>new ww(
t);_t(ww);class vw extends Ar{constructor(e){super(),this.shape=e.length===1?e[0]:new Zh(e)}check(e,r){const n=td(e)&&qh(
e,s=>this.shape.check(s));return!n&&r?.extend(null,"Array",""),n}}const Ew=(...t)=>new vw(t),Qk=_t(vw),Jk=jt(t=>td(t));class kw extends Ar{constructor(e,r){
super(),this.shape=e,this._c=r}check(e,r){const n=e instanceof this.shape&&(this._c==null||this._c(e));return!n&&r?.extend(
null,this.shape.name,e?.constructor.name),n}}const Xk=(t,e=null)=>new kw(t,e);_t(kw);const Yk=Xk(Ar);class Zk extends Ar{constructor(e){
super(),this.len=e.length-1,this.args=Kk(...e.slice(-1)),this.res=e[this.len]}check(e,r){const n=e.constructor===Function&&
e.length<=this.len;return!n&&r?.extend(null,"function",typeof e),n}}const ex=_t(Zk),tx=jt(t=>typeof t=="function");class rx extends Ar{constructor(e){
super(),this.shape=e}check(e,r){const n=qh(this.shape,s=>s.check(e,r));return!n&&r?.extend(null,"Intersectinon",typeof e),
n}}_t(rx,t=>t.shape.length>0);class Zh extends Ar{static _dilutes=!0;constructor(e){super(),this.shape=e}check(e,r){const n=nw(
this.shape,s=>s.check(e,r));return r?.extend(null,"Union",typeof e),n}}const Yi=(...t)=>t.findIndex(e=>Zc.check(e))>=0?Yi(
...t.map(e=>ma(e)).map(e=>Zc.check(e)?e.shape:[e]).flat(1)):t.length===1?t[0]:new Zh(t),Zc=_t(Zh),xw=()=>!0,el=jt(xw),nx=_t(
Yh,t=>t.shape===xw),ep=jt(t=>typeof t=="bigint"),sx=jt(t=>t===ep),Sw=jt(t=>typeof t=="symbol");jt(t=>t===Sw);const Li=jt(
t=>typeof t=="number"),Aw=jt(t=>t===Li),Gi=jt(t=>typeof t=="string"),Iw=jt(t=>t===Gi),ld=jt(t=>typeof t=="boolean"),ix=jt(
t=>t===ld),_w=ad(void 0);_t(od,t=>t.shape.length===1&&t.shape[0]===void 0);ad(void 0);const dd=ad(null),ox=_t(od,t=>t.shape.
length===1&&t.shape[0]===null);_t(Uint8Array);_t(Xh,t=>t.shape===Uint8Array);const ax=Yi(Li,Gi,dd,_w,ep,ld,Sw);(()=>{const t=Ew(
el),e=yw(Gi,el),r=Yi(Li,Gi,dd,ld,t,e);return t.shape=r,e.shape.values=r,r})();const ma=t=>{if(Yk.check(t))return t;if(Hk.
check(t)){const e={};for(const r in t)e[r]=ma(t[r]);return Gk(e)}else{if(Jk.check(t))return Yi(...t.map(ma));if(ax.check(
t))return ad(t);if(tx.check(t))return _t(t)}sn()},Bm=Rk?()=>{}:(t,e)=>{const r=new Ok;if(!e.check(t,r))throw es(`Expecte\
d value to be of type ${e.constructor.name}.
${r.toString()}`)};class cx{constructor(e){this.patterns=[],this.$state=e}if(e,r){return this.patterns.push({if:ma(e),h:r}),
this}else(e){return this.if(el,e)}done(){return(e,r)=>{for(let n=0;n<this.patterns.length;n++){const s=this.patterns[n];
if(s.if.check(e))return s.h(e,r)}throw es("Unhandled pattern")}}}const lx=t=>new cx(t),Cw=lx(el).if(Aw,(t,e)=>Vd(e,xm,Xc)).
if(Iw,(t,e)=>Nk(e)).if(ix,(t,e)=>Mm(e)).if(sx,(t,e)=>BigInt(Vd(e,xm,Xc))).if(Zc,(t,e)=>vi(e,Kd(e,t.shape))).if(Wk,(t,e)=>{
const r={};for(const n in t.shape){let s=t.shape[n];if(qk.check(s)){if(Mm(e))continue;s=s.shape}r[n]=Cw(s,e)}return r}).
if(Qk,(t,e)=>{const r=[],n=hw(e,0,42);for(let s=0;s<n;s++)r.push(vi(e,t.shape));return r}).if(pw,(t,e)=>Kd(e,t.shape)).if(
ox,(t,e)=>null).if(ex,(t,e)=>{const r=vi(e,t.res);return()=>r}).if(nx,(t,e)=>vi(e,Kd(e,[Li,Gi,dd,_w,ep,ld,Ew(Li),yw(Yi("\
a","b","c"),Li)]))).if(Vk,(t,e)=>{const r={},n=Vd(e,0,3);for(let s=0;s<n;s++){const i=vi(e,t.shape.keys),o=vi(e,t.shape.
values);r[i]=o}return r}).done(),vi=(t,e)=>Cw(ma(e),t),ud=typeof document<"u"?document:{};jt(t=>t.nodeType===px);typeof DOMParser<
"u"&&new DOMParser;jt(t=>t.nodeType===ux);jt(t=>t.nodeType===fx);const dx=t=>NE(t,(e,r)=>`${r}:${e};`).join(""),ux=ud.ELEMENT_NODE,
fx=ud.TEXT_NODE,hx=ud.DOCUMENT_NODE,px=ud.DOCUMENT_FRAGMENT_NODE;jt(t=>t.nodeType===hx);const ts=Symbol,Rw=ts(),Tw=ts(),
mx=ts(),gx=ts(),bx=ts(),Mw=ts(),yx=ts(),Bw=ts(),wx=ts(),vx=t=>{t.length===1&&t[0]?.constructor===Function&&(t=t[0]());const e=[],
r=[];let n=0;for(;n<t.length;n++){const s=t[n];if(s===void 0)break;if(s.constructor===String||s.constructor===Number)e.push(
s);else if(s.constructor===Object)break}for(n>0&&r.push(e.join(""));n<t.length;n++){const s=t[n];s instanceof Symbol||r.
push(s)}return r},Ex={[Rw]:Un("font-weight","bold"),[Tw]:Un("font-weight","normal"),[mx]:Un("color","blue"),[bx]:Un("col\
or","green"),[gx]:Un("color","grey"),[Mw]:Un("color","red"),[yx]:Un("color","purple"),[Bw]:Un("color","orange"),[wx]:Un(
"color","black")},kx=t=>{t.length===1&&t[0]?.constructor===Function&&(t=t[0]());const e=[],r=[],n=bn();let s=[],i=0;for(;i<
t.length;i++){const o=t[i],a=Ex[o];if(a!==void 0)n.set(a.left,a.right);else{if(o===void 0)break;if(o.constructor===String||
o.constructor===Number){const c=dx(n);i>0||c.length>0?(e.push("%c"+o),r.push(c)):e.push(o)}else break}}for(i>0&&(s=r,s.unshift(
e.join("")));i<t.length;i++){const o=t[i];o instanceof Symbol||s.push(o)}return s},xx=Mk?kx:vx,Sx=(...t)=>{console.log(...xx(
t)),Ax.forEach(e=>e.print(t))},Ax=zi(),Lw=t=>({[Symbol.iterator](){return this},next:t}),Ix=(t,e)=>Lw(()=>{let r;do r=t.
next();while(!r.done&&!e(r.value));return r}),Qd=(t,e)=>Lw(()=>{const{done:r,value:n}=t.next();return{done:r,value:r?void 0:
e(n)}});class tp{constructor(e,r){this.clock=e,this.len=r}}class Oa{constructor(){this.clients=new Map}}const xf=(t,e,r)=>e.
clients.forEach((n,s)=>{const i=t.doc.store.clients.get(s);for(let o=0;o<n.length;o++){const a=n[o];Hw(t,i,a.clock,a.len,
r)}}),_x=(t,e)=>{let r=0,n=t.length-1;for(;r<=n;){const s=Rn((r+n)/2),i=t[s],o=i.clock;if(o<=e){if(e<o+i.len)return s;r=
s+1}else n=s-1}return null},Dw=(t,e)=>{const r=t.clients.get(e.client);return r!==void 0&&_x(r,e.clock)!==null},rp=t=>{t.
clients.forEach(e=>{e.sort((s,i)=>s.clock-i.clock);let r,n;for(r=1,n=1;r<e.length;r++){const s=e[n-1],i=e[r];s.clock+s.len>=
i.clock?s.len=di(s.len,i.clock+i.len-s.clock):(n<r&&(e[n]=i),n++)}e.length=n})},Cx=t=>{const e=new Oa;for(let r=0;r<t.length;r++)
t[r].clients.forEach((n,s)=>{if(!e.clients.has(s)){const i=n.slice();for(let o=r+1;o<t.length;o++)OE(i,t[o].clients.get(
s)||[]);e.clients.set(s,i)}});return rp(e),e},tl=(t,e,r,n)=>{js(t.clients,e,()=>[]).push(new tp(r,n))},Rx=()=>new Oa,Tx=t=>{
const e=Rx();return t.clients.forEach((r,n)=>{const s=[];for(let i=0;i<r.length;i++){const o=r[i];if(o.deleted){const a=o.
id.clock;let c=o.length;if(i+1<r.length)for(let l=r[i+1];i+1<r.length&&l.deleted;l=r[++i+1])c+=l.length;s.push(new tp(a,
c))}}s.length>0&&e.clients.set(n,s)}),e},Zi=(t,e)=>{Pe(t.restEncoder,e.clients.size),Os(e.clients.entries()).sort((r,n)=>n[0]-
r[0]).forEach(([r,n])=>{t.resetDsCurVal(),Pe(t.restEncoder,r);const s=n.length;Pe(t.restEncoder,s);for(let i=0;i<s;i++){
const o=n[i];t.writeDsClock(o.clock),t.writeDsLen(o.len)}})},np=t=>{const e=new Oa,r=De(t.restDecoder);for(let n=0;n<r;n++){
t.resetDsCurVal();const s=De(t.restDecoder),i=De(t.restDecoder);if(i>0){const o=js(e.clients,s,()=>[]);for(let a=0;a<i;a++)
o.push(new tp(t.readDsClock(),t.readDsLen()))}}return e},Lm=(t,e,r)=>{const n=new Oa,s=De(t.restDecoder);for(let i=0;i<s;i++){
t.resetDsCurVal();const o=De(t.restDecoder),a=De(t.restDecoder),c=r.clients.get(o)||[],l=zt(r,o);for(let d=0;d<a;d++){const u=t.
readDsClock(),h=u+t.readDsLen();if(u<l){l<h&&tl(n,o,l,h-l);let p=Tn(c,u),m=c[p];for(!m.deleted&&m.id.clock<u&&(c.splice(
p+1,0,ll(e,m,u-m.id.clock)),p++);p<c.length&&(m=c[p++],m.id.clock<h);)m.deleted||(h<m.id.clock+m.length&&c.splice(p,0,ll(
e,m,h-m.id.clock)),m.delete(e))}else tl(n,o,u,h-u)}}if(n.clients.size>0){const i=new ni;return Pe(i.restEncoder,0),Zi(i,
n),i.toUint8Array()}return null},$w=cw;class eo extends jh{constructor({guid:e=yk(),collectionid:r=null,gc:n=!0,gcFilter:s=()=>!0,
meta:i=null,autoLoad:o=!1,shouldLoad:a=!0}={}){super(),this.gc=n,this.gcFilter=s,this.clientID=$w(),this.guid=e,this.collectionid=
r,this.share=new Map,this.store=new Gw,this._transaction=null,this._transactionCleanups=[],this.subdocs=new Set,this._item=
null,this.shouldLoad=a,this.autoLoad=o,this.meta=i,this.isLoaded=!1,this.isSynced=!1,this.whenLoaded=ji(l=>{this.on("loa\
d",()=>{this.isLoaded=!0,l(this)})});const c=()=>ji(l=>{const d=u=>{(u===void 0||u===!0)&&(this.off("sync",d),l())};this.
on("sync",d)});this.on("sync",l=>{l===!1&&this.isSynced&&(this.whenSynced=c()),this.isSynced=l===void 0||l===!0,this.isLoaded||
this.emit("load",[])}),this.whenSynced=c()}load(){const e=this._item;e!==null&&!this.shouldLoad&&ct(e.parent.doc,r=>{r.subdocsLoaded.
add(this)},null,!0),this.shouldLoad=!0}getSubdocs(){return this.subdocs}getSubdocGuids(){return new Set(Os(this.subdocs).
map(e=>e.guid))}transact(e,r=null){return ct(this,e,r)}get(e,r=Jt){const n=js(this.share,e,()=>{const i=new r;return i._integrate(
this,null),i}),s=n.constructor;if(r!==Jt&&s!==r)if(s===Jt){const i=new r;i._map=n._map,n._map.forEach(o=>{for(;o!==null;o=
o.left)o.parent=i}),i._start=n._start;for(let o=i._start;o!==null;o=o.right)o.parent=i;return i._length=n._length,this.share.
set(e,i),i._integrate(this,null),i}else throw new Error(`Type with the name ${e} has already been defined with a differe\
nt constructor`);return n}getArray(e=""){return this.get(e,$i)}getText(e=""){return this.get(e,Hi)}getMap(e=""){return this.
get(e,Xn)}getXmlFragment(e=""){return this.get(e,si)}toJSON(){const e={};return this.share.forEach((r,n)=>{e[n]=r.toJSON()}),
e}destroy(){Os(this.subdocs).forEach(r=>r.destroy());const e=this._item;if(e!==null){this._item=null;const r=e.content;r.
doc=new eo({guid:this.guid,...r.opts,shouldLoad:!1}),r.doc._item=e,ct(e.parent.doc,n=>{const s=r.doc;e.deleted||n.subdocsAdded.
add(s),n.subdocsRemoved.add(this)},null,!0)}this.emit("destroyed",[!0]),this.emit("destroy",[this]),super.destroy()}on(e,r){
super.on(e,r)}off(e,r){super.off(e,r)}}class Nw{constructor(e){this.restDecoder=e}resetDsCurVal(){}readDsClock(){return De(
this.restDecoder)}readDsLen(){return De(this.restDecoder)}}class Pw extends Nw{readLeftID(){return Oe(De(this.restDecoder),
De(this.restDecoder))}readRightID(){return Oe(De(this.restDecoder),De(this.restDecoder))}readClient(){return De(this.restDecoder)}readInfo(){
return qi(this.restDecoder)}readString(){return Bi(this.restDecoder)}readParentInfo(){return De(this.restDecoder)===1}readTypeRef(){
return De(this.restDecoder)}readLen(){return De(this.restDecoder)}readAny(){return fa(this.restDecoder)}readBuf(){return Lk(
jr(this.restDecoder))}readJSON(){return JSON.parse(Bi(this.restDecoder))}readKey(){return Bi(this.restDecoder)}}class Mx{constructor(e){
this.dsCurrVal=0,this.restDecoder=e}resetDsCurVal(){this.dsCurrVal=0}readDsClock(){return this.dsCurrVal+=De(this.restDecoder),
this.dsCurrVal}readDsLen(){const e=De(this.restDecoder)+1;return this.dsCurrVal+=e,e}}class Wi extends Mx{constructor(e){
super(e),this.keys=[],De(e),this.keyClockDecoder=new Hd(jr(e)),this.clientDecoder=new Mc(jr(e)),this.leftClockDecoder=new Hd(
jr(e)),this.rightClockDecoder=new Hd(jr(e)),this.infoDecoder=new Rm(jr(e),qi),this.stringDecoder=new mk(jr(e)),this.parentInfoDecoder=
new Rm(jr(e),qi),this.typeRefDecoder=new Mc(jr(e)),this.lenDecoder=new Mc(jr(e))}readLeftID(){return new Di(this.clientDecoder.
read(),this.leftClockDecoder.read())}readRightID(){return new Di(this.clientDecoder.read(),this.rightClockDecoder.read())}readClient(){
return this.clientDecoder.read()}readInfo(){return this.infoDecoder.read()}readString(){return this.stringDecoder.read()}readParentInfo(){
return this.parentInfoDecoder.read()===1}readTypeRef(){return this.typeRefDecoder.read()}readLen(){return this.lenDecoder.
read()}readAny(){return fa(this.restDecoder)}readBuf(){return jr(this.restDecoder)}readJSON(){return fa(this.restDecoder)}readKey(){
const e=this.keyClockDecoder.read();if(e<this.keys.length)return this.keys[e];{const r=this.stringDecoder.read();return this.
keys.push(r),r}}}class Ow{constructor(){this.restEncoder=nd()}toUint8Array(){return Cn(this.restEncoder)}resetDsCurVal(){}writeDsClock(e){
Pe(this.restEncoder,e)}writeDsLen(e){Pe(this.restEncoder,e)}}class Ua extends Ow{writeLeftID(e){Pe(this.restEncoder,e.client),
Pe(this.restEncoder,e.clock)}writeRightID(e){Pe(this.restEncoder,e.client),Pe(this.restEncoder,e.clock)}writeClient(e){Pe(
this.restEncoder,e)}writeInfo(e){yf(this.restEncoder,e)}writeString(e){Mi(this.restEncoder,e)}writeParentInfo(e){Pe(this.
restEncoder,e?1:0)}writeTypeRef(e){Pe(this.restEncoder,e)}writeLen(e){Pe(this.restEncoder,e)}writeAny(e){ua(this.restEncoder,
e)}writeBuf(e){qr(this.restEncoder,e)}writeJSON(e){Mi(this.restEncoder,JSON.stringify(e))}writeKey(e){Mi(this.restEncoder,
e)}}class Uw{constructor(){this.restEncoder=nd(),this.dsCurrVal=0}toUint8Array(){return Cn(this.restEncoder)}resetDsCurVal(){
this.dsCurrVal=0}writeDsClock(e){const r=e-this.dsCurrVal;this.dsCurrVal=e,Pe(this.restEncoder,r)}writeDsLen(e){e===0&&sn(),
Pe(this.restEncoder,e-1),this.dsCurrVal+=e}}class ni extends Uw{constructor(){super(),this.keyMap=new Map,this.keyClock=
0,this.keyClockEncoder=new Wd,this.clientEncoder=new Tc,this.leftClockEncoder=new Wd,this.rightClockEncoder=new Wd,this.
infoEncoder=new Im(yf),this.stringEncoder=new ok,this.parentInfoEncoder=new Im(yf),this.typeRefEncoder=new Tc,this.lenEncoder=
new Tc}toUint8Array(){const e=nd();return Pe(e,0),qr(e,this.keyClockEncoder.toUint8Array()),qr(e,this.clientEncoder.toUint8Array()),
qr(e,this.leftClockEncoder.toUint8Array()),qr(e,this.rightClockEncoder.toUint8Array()),qr(e,Cn(this.infoEncoder)),qr(e,this.
stringEncoder.toUint8Array()),qr(e,Cn(this.parentInfoEncoder)),qr(e,this.typeRefEncoder.toUint8Array()),qr(e,this.lenEncoder.
toUint8Array()),sd(e,Cn(this.restEncoder)),Cn(e)}writeLeftID(e){this.clientEncoder.write(e.client),this.leftClockEncoder.
write(e.clock)}writeRightID(e){this.clientEncoder.write(e.client),this.rightClockEncoder.write(e.clock)}writeClient(e){this.
clientEncoder.write(e)}writeInfo(e){this.infoEncoder.write(e)}writeString(e){this.stringEncoder.write(e)}writeParentInfo(e){
this.parentInfoEncoder.write(e?1:0)}writeTypeRef(e){this.typeRefEncoder.write(e)}writeLen(e){this.lenEncoder.write(e)}writeAny(e){
ua(this.restEncoder,e)}writeBuf(e){qr(this.restEncoder,e)}writeJSON(e){ua(this.restEncoder,e)}writeKey(e){const r=this.keyMap.
get(e);r===void 0?(this.keyClockEncoder.write(this.keyClock++),this.stringEncoder.write(e)):this.keyClockEncoder.write(r)}}
const Bx=(t,e,r,n)=>{n=di(n,e[0].id.clock);const s=Tn(e,n);Pe(t.restEncoder,e.length-s),t.writeClient(r),Pe(t.restEncoder,
n);const i=e[s];i.write(t,n-i.id.clock);for(let o=s+1;o<e.length;o++)e[o].write(t,0)},sp=(t,e,r)=>{const n=new Map;r.forEach(
(s,i)=>{zt(e,i)>s&&n.set(i,s)}),fd(e).forEach((s,i)=>{r.has(i)||n.set(i,0)}),Pe(t.restEncoder,n.size),Os(n.entries()).sort(
(s,i)=>i[0]-s[0]).forEach(([s,i])=>{Bx(t,e.clients.get(s),s,i)})},Lx=(t,e)=>{const r=bn(),n=De(t.restDecoder);for(let s=0;s<
n;s++){const i=De(t.restDecoder),o=new Array(i),a=t.readClient();let c=De(t.restDecoder);r.set(a,{i:0,refs:o});for(let l=0;l<
i;l++){const d=t.readInfo();switch(rd&d){case 0:{const u=t.readLen();o[l]=new tn(Oe(a,c),u),c+=u;break}case 10:{const u=De(
t.restDecoder);o[l]=new rn(Oe(a,c),u),c+=u;break}default:{const u=(d&(Kn|Hr))===0,h=new Dt(Oe(a,c),null,(d&Hr)===Hr?t.readLeftID():
null,null,(d&Kn)===Kn?t.readRightID():null,u?t.readParentInfo()?e.get(t.readString()):t.readLeftID():null,u&&(d&la)===la?
t.readString():null,u0(t,d));o[l]=h,c+=h.length}}}}return r},Dx=(t,e,r)=>{const n=[];let s=Os(r.keys()).sort((p,m)=>p-m);
if(s.length===0)return null;const i=()=>{if(s.length===0)return null;let p=r.get(s[s.length-1]);for(;p.refs.length===p.i;)
if(s.pop(),s.length>0)p=r.get(s[s.length-1]);else return null;return p};let o=i();if(o===null&&n.length===0)return null;
const a=new Gw,c=new Map,l=(p,m)=>{const b=c.get(p);(b==null||b>m)&&c.set(p,m)};let d=o.refs[o.i++];const u=new Map,h=()=>{
for(const p of n){const m=p.id.client,b=r.get(m);b?(b.i--,a.clients.set(m,b.refs.slice(b.i)),r.delete(m),b.i=0,b.refs=[]):
a.clients.set(m,[p]),s=s.filter(g=>g!==m)}n.length=0};for(;;){if(d.constructor!==rn){const m=js(u,d.id.client,()=>zt(e,d.
id.client))-d.id.clock;if(m<0)n.push(d),l(d.id.client,d.id.clock-1),h();else{const b=d.getMissing(t,e);if(b!==null){n.push(
d);const g=r.get(b)||{refs:[],i:0};if(g.refs.length===g.i)l(b,zt(e,b)),h();else{d=g.refs[g.i++];continue}}else(m===0||m<
d.length)&&(d.integrate(t,m),u.set(d.id.client,d.id.clock+d.length))}}if(n.length>0)d=n.pop();else if(o!==null&&o.i<o.refs.
length)d=o.refs[o.i++];else{if(o=i(),o===null)break;d=o.refs[o.i++]}}if(a.clients.size>0){const p=new ni;return sp(p,a,new Map),
Pe(p.restEncoder,0),{missing:c,update:p.toUint8Array()}}return null},$x=(t,e)=>sp(t,e.doc.store,e.beforeState),Nx=(t,e,r,n=new Wi(
t))=>ct(e,s=>{s.local=!1;let i=!1;const o=s.doc,a=o.store,c=Lx(n,o),l=Dx(s,a,c),d=a.pendingStructs;if(d){for(const[h,p]of d.
missing)if(p<zt(a,h)){i=!0;break}if(l){for(const[h,p]of l.missing){const m=d.missing.get(h);(m==null||m>p)&&d.missing.set(
h,p)}d.update=nl([d.update,l.update])}}else a.pendingStructs=l;const u=Lm(n,s,a);if(a.pendingDs){const h=new Wi(Xi(a.pendingDs));
De(h.restDecoder);const p=Lm(h,s,a);u&&p?a.pendingDs=nl([u,p]):a.pendingDs=u||p}else a.pendingDs=u;if(i){const h=a.pendingStructs.
update;a.pendingStructs=null,Fw(s.doc,h)}},r,!1),Fw=(t,e,r,n=Wi)=>{const s=Xi(e);Nx(s,t,r,new n(s))},rl=(t,e,r)=>Fw(t,e,
r,Pw),Px=(t,e,r=new Map)=>{sp(t,e.store,r),Zi(t,Tx(e.store))},Ox=(t,e=new Uint8Array([0]),r=new ni)=>{const n=zw(e);Px(r,
t,n);const s=[r.toUint8Array()];if(t.store.pendingDs&&s.push(t.store.pendingDs),t.store.pendingStructs&&s.push(Zx(t.store.
pendingStructs.update,e)),s.length>1){if(r.constructor===Ua)return Xx(s.map((i,o)=>o===0?i:tS(i)));if(r.constructor===ni)
return nl(s)}return s[0]},ip=(t,e)=>Ox(t,e,new Ua),Ux=t=>{const e=new Map,r=De(t.restDecoder);for(let n=0;n<r;n++){const s=De(
t.restDecoder),i=De(t.restDecoder);e.set(s,i)}return e},zw=t=>Ux(new Nw(Xi(t))),qw=(t,e)=>(Pe(t.restEncoder,e.size),Os(e.
entries()).sort((r,n)=>n[0]-r[0]).forEach(([r,n])=>{Pe(t.restEncoder,r),Pe(t.restEncoder,n)}),t),Fx=(t,e)=>qw(t,fd(e.store)),
zx=(t,e=new Uw)=>(t instanceof Map?qw(e,t):Fx(e,t),e.toUint8Array()),qx=t=>zx(t,new Ow);class jx{constructor(){this.l=[]}}
const Dm=()=>new jx,$m=(t,e)=>t.l.push(e),Nm=(t,e)=>{const r=t.l,n=r.length;t.l=r.filter(s=>e!==s),n===t.l.length&&console.
error("[yjs] Tried to remove event handler that doesn't exist.")},jw=(t,e,r)=>Qh(t.l,[e,r]);class Di{constructor(e,r){this.
client=e,this.clock=r}}const sc=(t,e)=>t===e||t!==null&&e!==null&&t.client===e.client&&t.clock===e.clock,Oe=(t,e)=>new Di(
t,e),Gx=t=>{for(const[e,r]of t.doc.share.entries())if(r===t)return e;throw sn()},mo=(t,e)=>e===void 0?!t.deleted:e.sv.has(
t.id.client)&&(e.sv.get(t.id.client)||0)>t.id.clock&&!Dw(e.ds,t.id),Sf=(t,e)=>{const r=js(t.meta,Sf,zi),n=t.doc.store;r.
has(e)||(e.sv.forEach((s,i)=>{s<zt(n,i)&&Us(t,Oe(i,s))}),xf(t,e.ds,s=>{}),r.add(e))};class Gw{constructor(){this.clients=
new Map,this.pendingStructs=null,this.pendingDs=null}}const fd=t=>{const e=new Map;return t.clients.forEach((r,n)=>{const s=r[r.
length-1];e.set(n,s.id.clock+s.length)}),e},zt=(t,e)=>{const r=t.clients.get(e);if(r===void 0)return 0;const n=r[r.length-
1];return n.id.clock+n.length},Ww=(t,e)=>{let r=t.clients.get(e.id.client);if(r===void 0)r=[],t.clients.set(e.id.client,
r);else{const n=r[r.length-1];if(n.id.clock+n.length!==e.id.clock)throw sn()}r.push(e)},Tn=(t,e)=>{let r=0,n=t.length-1,
s=t[n],i=s.id.clock;if(i===e)return n;let o=Rn(e/(i+s.length-1)*n);for(;r<=n;){if(s=t[o],i=s.id.clock,i<=e){if(e<i+s.length)
return o;r=o+1}else n=o-1;o=Rn((r+n)/2)}throw sn()},Wx=(t,e)=>{const r=t.clients.get(e.client);return r[Tn(r,e.clock)]},
Jd=Wx,Af=(t,e,r)=>{const n=Tn(e,r),s=e[n];return s.id.clock<r&&s instanceof Dt?(e.splice(n+1,0,ll(t,s,r-s.id.clock)),n+1):
n},Us=(t,e)=>{const r=t.doc.store.clients.get(e.client);return r[Af(t,r,e.clock)]},Pm=(t,e,r)=>{const n=e.clients.get(r.
client),s=Tn(n,r.clock),i=n[s];return r.clock!==i.id.clock+i.length-1&&i.constructor!==tn&&n.splice(s+1,0,ll(t,i,r.clock-
i.id.clock+1)),i},Hx=(t,e,r)=>{const n=t.clients.get(e.id.client);n[Tn(n,e.id.clock)]=r},Hw=(t,e,r,n,s)=>{if(n===0)return;
const i=r+n;let o=Af(t,e,r),a;do a=e[o++],i<a.id.clock+a.length&&Af(t,e,i),s(a);while(o<e.length&&e[o].id.clock<i)};class Vx{constructor(e,r,n){
this.doc=e,this.deleteSet=new Oa,this.beforeState=fd(e.store),this.afterState=new Map,this.changed=new Map,this.changedParentTypes=
new Map,this._mergeStructs=[],this.origin=r,this.meta=new Map,this.local=n,this.subdocsAdded=new Set,this.subdocsRemoved=
new Set,this.subdocsLoaded=new Set}}const Om=(t,e)=>e.deleteSet.clients.size===0&&!PE(e.afterState,(r,n)=>e.beforeState.
get(n)!==r)?!1:(rp(e.deleteSet),$x(t,e),Zi(t,e.deleteSet),!0),Um=(t,e,r)=>{const n=e._item;(n===null||n.id.clock<(t.beforeState.
get(n.id.client)||0)&&!n.deleted)&&js(t.changed,e,zi).add(r)},Lc=(t,e)=>{const r=t[e-1],n=t[e];r.deleted===n.deleted&&r.
constructor===n.constructor&&r.mergeWith(n)&&(t.splice(e,1),n instanceof Dt&&n.parentSub!==null&&n.parent._map.get(n.parentSub)===
n&&n.parent._map.set(n.parentSub,r))},Kx=(t,e,r)=>{for(const[n,s]of t.clients.entries()){const i=e.clients.get(n);for(let o=s.
length-1;o>=0;o--){const a=s[o],c=a.clock+a.len;for(let l=Tn(i,a.clock),d=i[l];l<i.length&&d.id.clock<c;d=i[++l]){const u=i[l];
if(a.clock+a.len<=u.id.clock)break;u instanceof Dt&&u.deleted&&!u.keep&&r(u)&&u.gc(e,!1)}}}},Qx=(t,e)=>{t.clients.forEach(
(r,n)=>{const s=e.clients.get(n);for(let i=r.length-1;i>=0;i--){const o=r[i],a=sw(s.length-1,1+Tn(s,o.clock+o.len-1));for(let c=a,
l=s[c];c>0&&l.id.clock>=o.clock;l=s[--c])Lc(s,c)}})},Vw=(t,e)=>{if(e<t.length){const r=t[e],n=r.doc,s=n.store,i=r.deleteSet,
o=r._mergeStructs;try{rp(i),r.afterState=fd(r.doc.store),n.emit("beforeObserverCalls",[r,n]);const a=[];r.changed.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&l._callObserver(r,c)})),a.push(()=>{r.changedParentTypes.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&(c=c.filter(d=>d.target._item===null||!d.target._item.deleted),c.
forEach(d=>{d.currentTarget=l}),c.sort((d,u)=>d.path.length-u.path.length),jw(l._dEH,c,r))})),a.push(()=>n.emit("afterTr\
ansaction",[r,n]))}),Qh(a,[])}finally{n.gc&&Kx(i,s,n.gcFilter),Qx(i,s),r.afterState.forEach((d,u)=>{const h=r.beforeState.
get(u)||0;if(h!==d){const p=s.clients.get(u),m=di(Tn(p,h),1);for(let b=p.length-1;b>=m;b--)Lc(p,b)}});for(let d=0;d<o.length;d++){
const{client:u,clock:h}=o[d].id,p=s.clients.get(u),m=Tn(p,h);m+1<p.length&&Lc(p,m+1),m>0&&Lc(p,m)}if(!r.local&&r.afterState.
get(n.clientID)!==r.beforeState.get(n.clientID)&&(Sx(Bw,Rw,"[yjs] ",Tw,Mw,"Changed the client-id because another client \
seems to be using it."),n.clientID=$w()),n.emit("afterTransactionCleanup",[r,n]),n._observers.has("update")){const d=new Ua;
Om(d,r)&&n.emit("update",[d.toUint8Array(),r.origin,n,r])}if(n._observers.has("updateV2")){const d=new ni;Om(d,r)&&n.emit(
"updateV2",[d.toUint8Array(),r.origin,n,r])}const{subdocsAdded:a,subdocsLoaded:c,subdocsRemoved:l}=r;(a.size>0||l.size>0||
c.size>0)&&(a.forEach(d=>{d.clientID=n.clientID,d.collectionid==null&&(d.collectionid=n.collectionid),n.subdocs.add(d)}),
l.forEach(d=>n.subdocs.delete(d)),n.emit("subdocs",[{loaded:c,added:a,removed:l},n,r]),l.forEach(d=>d.destroy())),t.length<=
e+1?(n._transactionCleanups=[],n.emit("afterAllTransactions",[n,t])):Vw(t,e+1)}}},ct=(t,e,r=null,n=!0)=>{const s=t._transactionCleanups;
let i=!1,o=null;t._transaction===null&&(i=!0,t._transaction=new Vx(t,r,n),s.push(t._transaction),s.length===1&&t.emit("b\
eforeAllTransactions",[t]),t.emit("beforeTransaction",[t._transaction,t]));try{o=e(t._transaction)}finally{if(i){const a=t.
_transaction===s[0];t._transaction=null,a&&Vw(s,0)}}return o};function*Jx(t){const e=De(t.restDecoder);for(let r=0;r<e;r++){
const n=De(t.restDecoder),s=t.readClient();let i=De(t.restDecoder);for(let o=0;o<n;o++){const a=t.readInfo();if(a===10){
const c=De(t.restDecoder);yield new rn(Oe(s,i),c),i+=c}else if((rd&a)!==0){const c=(a&(Kn|Hr))===0,l=new Dt(Oe(s,i),null,
(a&Hr)===Hr?t.readLeftID():null,null,(a&Kn)===Kn?t.readRightID():null,c?t.readParentInfo()?t.readString():t.readLeftID():
null,c&&(a&la)===la?t.readString():null,u0(t,a));yield l,i+=l.length}else{const c=t.readLen();yield new tn(Oe(s,i),c),i+=
c}}}}class op{constructor(e,r){this.gen=Jx(e),this.curr=null,this.done=!1,this.filterSkips=r,this.next()}next(){do this.
curr=this.gen.next().value||null;while(this.filterSkips&&this.curr!==null&&this.curr.constructor===rn);return this.curr}}
class ap{constructor(e){this.currClient=0,this.startClock=0,this.written=0,this.encoder=e,this.clientStructs=[]}}const Xx=t=>nl(
t,Pw,Ua),Yx=(t,e)=>{if(t.constructor===tn){const{client:r,clock:n}=t.id;return new tn(Oe(r,n+e),t.length-e)}else if(t.constructor===
rn){const{client:r,clock:n}=t.id;return new rn(Oe(r,n+e),t.length-e)}else{const r=t,{client:n,clock:s}=r.id;return new Dt(
Oe(n,s+e),null,Oe(n,s+e-1),null,r.rightOrigin,r.parent,r.parentSub,r.content.splice(e))}},nl=(t,e=Wi,r=ni)=>{if(t.length===
1)return t[0];const n=t.map(d=>new e(Xi(d)));let s=n.map(d=>new op(d,!0)),i=null;const o=new r,a=new ap(o);for(;s=s.filter(
h=>h.curr!==null),s.sort((h,p)=>{if(h.curr.id.client===p.curr.id.client){const m=h.curr.id.clock-p.curr.id.clock;return m===
0?h.curr.constructor===p.curr.constructor?0:h.curr.constructor===rn?1:-1:m}else return p.curr.id.client-h.curr.id.client}),
s.length!==0;){const d=s[0],u=d.curr.id.client;if(i!==null){let h=d.curr,p=!1;for(;h!==null&&h.id.clock+h.length<=i.struct.
id.clock+i.struct.length&&h.id.client>=i.struct.id.client;)h=d.next(),p=!0;if(h===null||h.id.client!==u||p&&h.id.clock>i.
struct.id.clock+i.struct.length)continue;if(u!==i.struct.id.client)Rs(a,i.struct,i.offset),i={struct:h,offset:0},d.next();else if(i.
struct.id.clock+i.struct.length<h.id.clock)if(i.struct.constructor===rn)i.struct.length=h.id.clock+h.length-i.struct.id.
clock;else{Rs(a,i.struct,i.offset);const m=h.id.clock-i.struct.id.clock-i.struct.length;i={struct:new rn(Oe(u,i.struct.id.
clock+i.struct.length),m),offset:0}}else{const m=i.struct.id.clock+i.struct.length-h.id.clock;m>0&&(i.struct.constructor===
rn?i.struct.length-=m:h=Yx(h,m)),i.struct.mergeWith(h)||(Rs(a,i.struct,i.offset),i={struct:h,offset:0},d.next())}}else i=
{struct:d.curr,offset:0},d.next();for(let h=d.curr;h!==null&&h.id.client===u&&h.id.clock===i.struct.id.clock+i.struct.length&&
h.constructor!==rn;h=d.next())Rs(a,i.struct,i.offset),i={struct:h,offset:0}}i!==null&&(Rs(a,i.struct,i.offset),i=null),cp(
a);const c=n.map(d=>np(d)),l=Cx(c);return Zi(o,l),o.toUint8Array()},Zx=(t,e,r=Wi,n=ni)=>{const s=zw(e),i=new n,o=new ap(
i),a=new r(Xi(t)),c=new op(a,!1);for(;c.curr;){const d=c.curr,u=d.id.client,h=s.get(u)||0;if(c.curr.constructor===rn){c.
next();continue}if(d.id.clock+d.length>h)for(Rs(o,d,di(h-d.id.clock,0)),c.next();c.curr&&c.curr.id.client===u;)Rs(o,c.curr,
0),c.next();else for(;c.curr&&c.curr.id.client===u&&c.curr.id.clock+c.curr.length<=h;)c.next()}cp(o);const l=np(a);return Zi(
i,l),i.toUint8Array()},Kw=t=>{t.written>0&&(t.clientStructs.push({written:t.written,restEncoder:Cn(t.encoder.restEncoder)}),
t.encoder.restEncoder=nd(),t.written=0)},Rs=(t,e,r)=>{t.written>0&&t.currClient!==e.id.client&&Kw(t),t.written===0&&(t.currClient=
e.id.client,t.encoder.writeClient(e.id.client),Pe(t.encoder.restEncoder,e.id.clock+r)),e.write(t.encoder,r),t.written++},
cp=t=>{Kw(t);const e=t.encoder.restEncoder;Pe(e,t.clientStructs.length);for(let r=0;r<t.clientStructs.length;r++){const n=t.
clientStructs[r];Pe(e,n.written),sd(e,n.restEncoder)}},eS=(t,e,r)=>{const n=new e(Xi(t)),s=new op(n,!1),i=new r,o=new ap(
i);for(let c=s.curr;c!==null;c=s.next())Rs(o,c,0);cp(o);const a=np(n);return Zi(i,a),i.toUint8Array()},tS=t=>eS(t,Wi,Ua);
class hd{constructor(e,r){this.target=e,this.currentTarget=e,this.transaction=r,this._changes=null,this._keys=null,this.
_delta=null}get path(){return rS(this.currentTarget,this.target)}deletes(e){return Dw(this.transaction.deleteSet,e.id)}get keys(){
if(this._keys===null){const e=new Map,r=this.target;this.transaction.changed.get(r).forEach(s=>{if(s!==null){const i=r._map.
get(s);let o,a;if(this.adds(i)){let c=i.left;for(;c!==null&&this.adds(c);)c=c.left;if(this.deletes(i))if(c!==null&&this.
deletes(c))o="delete",a=qd(c.content.getContent());else return;else c!==null&&this.deletes(c)?(o="update",a=qd(c.content.
getContent())):(o="add",a=void 0)}else if(this.deletes(i))o="delete",a=qd(i.content.getContent());else return;e.set(s,{action:o,
oldValue:a})}}),this._keys=e}return this._keys}get delta(){return this.changes.delta}adds(e){return e.id.clock>=(this.transaction.
beforeState.get(e.id.client)||0)}get changes(){let e=this._changes;if(e===null){const r=this.target,n=zi(),s=zi(),i=[];if(e=
{added:n,deleted:s,delta:i,keys:this.keys},this.transaction.changed.get(r).has(null)){let a=null;const c=()=>{a&&i.push(
a)};for(let l=r._start;l!==null;l=l.right)l.deleted?this.deletes(l)&&!this.adds(l)&&((a===null||a.delete===void 0)&&(c(),
a={delete:0}),a.delete+=l.length,s.add(l)):this.adds(l)?((a===null||a.insert===void 0)&&(c(),a={insert:[]}),a.insert=a.insert.
concat(l.content.getContent()),n.add(l)):((a===null||a.retain===void 0)&&(c(),a={retain:0}),a.retain+=l.length);a!==null&&
a.retain===void 0&&c()}this._changes=e}return e}}const rS=(t,e)=>{const r=[];for(;e._item!==null&&e!==t;){if(e._item.parentSub!==
null)r.unshift(e._item.parentSub);else{let n=0,s=e._item.parent._start;for(;s!==e._item&&s!==null;)s.deleted||n++,s=s.right;
r.unshift(n)}e=e._item.parent}return r},Qw=80;let lp=0;class nS{constructor(e,r){e.marker=!0,this.p=e,this.index=r,this.
timestamp=lp++}}const sS=t=>{t.timestamp=lp++},Jw=(t,e,r)=>{t.p.marker=!1,t.p=e,e.marker=!0,t.index=r,t.timestamp=lp++},
iS=(t,e,r)=>{if(t.length>=Qw){const n=t.reduce((s,i)=>s.timestamp<i.timestamp?s:i);return Jw(n,e,r),n}else{const n=new nS(
e,r);return t.push(n),n}},pd=(t,e)=>{if(t._start===null||e===0||t._searchMarker===null)return null;const r=t._searchMarker.
length===0?null:t._searchMarker.reduce((i,o)=>Rc(e-i.index)<Rc(e-o.index)?i:o);let n=t._start,s=0;for(r!==null&&(n=r.p,s=
r.index,sS(r));n.right!==null&&s<e;){if(!n.deleted&&n.countable){if(e<s+n.length)break;s+=n.length}n=n.right}for(;n.left!==
null&&s>e;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);for(;n.left!==null&&n.left.id.client===n.id.client&&n.left.id.
clock+n.left.length===n.id.clock;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);return r!==null&&Rc(r.index-s)<n.parent.
length/Qw?(Jw(r,n,s),r):iS(t._searchMarker,n,s)},ga=(t,e,r)=>{for(let n=t.length-1;n>=0;n--){const s=t[n];if(r>0){let i=s.
p;for(i.marker=!1;i&&(i.deleted||!i.countable);)i=i.left,i&&!i.deleted&&i.countable&&(s.index-=i.length);if(i===null||i.
marker===!0){t.splice(n,1);continue}s.p=i,i.marker=!0}(e<s.index||r>0&&e===s.index)&&(s.index=di(e,s.index+r))}},md=(t,e,r)=>{
const n=t,s=e.changedParentTypes;for(;js(s,t,()=>[]).push(r),t._item!==null;)t=t._item.parent;jw(n._eH,r,e)};class Jt{constructor(){
this._item=null,this._map=new Map,this._start=null,this.doc=null,this._length=0,this._eH=Dm(),this._dEH=Dm(),this._searchMarker=
null}get parent(){return this._item?this._item.parent:null}_integrate(e,r){this.doc=e,this._item=r}_copy(){throw yn()}clone(){
throw yn()}_write(e){}get _first(){let e=this._start;for(;e!==null&&e.deleted;)e=e.right;return e}_callObserver(e,r){!e.
local&&this._searchMarker&&(this._searchMarker.length=0)}observe(e){$m(this._eH,e)}observeDeep(e){$m(this._dEH,e)}unobserve(e){
Nm(this._eH,e)}unobserveDeep(e){Nm(this._dEH,e)}toJSON(){}}const Xw=(t,e,r)=>{e<0&&(e=t._length+e),r<0&&(r=t._length+r);
let n=r-e;const s=[];let i=t._start;for(;i!==null&&n>0;){if(i.countable&&!i.deleted){const o=i.content.getContent();if(o.
length<=e)e-=o.length;else{for(let a=e;a<o.length&&n>0;a++)s.push(o[a]),n--;e=0}}i=i.right}return s},Yw=t=>{const e=[];let r=t.
_start;for(;r!==null;){if(r.countable&&!r.deleted){const n=r.content.getContent();for(let s=0;s<n.length;s++)e.push(n[s])}
r=r.right}return e},ba=(t,e)=>{let r=0,n=t._start;for(;n!==null;){if(n.countable&&!n.deleted){const s=n.content.getContent();
for(let i=0;i<s.length;i++)e(s[i],r++,t)}n=n.right}},Zw=(t,e)=>{const r=[];return ba(t,(n,s)=>{r.push(e(n,s,t))}),r},oS=t=>{
let e=t._start,r=null,n=0;return{[Symbol.iterator](){return this},next:()=>{if(r===null){for(;e!==null&&e.deleted;)e=e.right;
if(e===null)return{done:!0,value:void 0};r=e.content.getContent(),n=0,e=e.right}const s=r[n++];return r.length<=n&&(r=null),
{done:!1,value:s}}}},e0=(t,e)=>{const r=pd(t,e);let n=t._start;for(r!==null&&(n=r.p,e-=r.index);n!==null;n=n.right)if(!n.
deleted&&n.countable){if(e<n.length)return n.content.getContent()[e];e-=n.length}},sl=(t,e,r,n)=>{let s=r;const i=t.doc,
o=i.clientID,a=i.store,c=r===null?e._start:r.right;let l=[];const d=()=>{l.length>0&&(s=new Dt(Oe(o,zt(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new ii(l)),s.integrate(t,0),l=[])};n.forEach(u=>{if(u===null)l.push(u);else switch(u.constructor){case Number:case Object:case Boolean:case Array:case String:
l.push(u);break;default:switch(d(),u.constructor){case Uint8Array:case ArrayBuffer:s=new Dt(Oe(o,zt(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new Fa(new Uint8Array(u))),s.integrate(t,0);break;case eo:s=new Dt(Oe(o,zt(a,o)),s,s&&s.lastId,c,c&&c.id,
e,null,new za(u)),s.integrate(t,0);break;default:if(u instanceof Jt)s=new Dt(Oe(o,zt(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,
new rs(u)),s.integrate(t,0);else throw new Error("Unexpected content type in insert operation")}}}),d()},t0=es("Length e\
xceeded!"),r0=(t,e,r,n)=>{if(r>e._length)throw t0;if(r===0)return e._searchMarker&&ga(e._searchMarker,r,n.length),sl(t,e,
null,n);const s=r,i=pd(e,r);let o=e._start;for(i!==null&&(o=i.p,r-=i.index,r===0&&(o=o.prev,r+=o&&o.countable&&!o.deleted?
o.length:0));o!==null;o=o.right)if(!o.deleted&&o.countable){if(r<=o.length){r<o.length&&Us(t,Oe(o.id.client,o.id.clock+r));
break}r-=o.length}return e._searchMarker&&ga(e._searchMarker,s,n.length),sl(t,e,o,n)},aS=(t,e,r)=>{let s=(e._searchMarker||
[]).reduce((i,o)=>o.index>i.index?o:i,{index:0,p:e._start}).p;if(s)for(;s.right;)s=s.right;return sl(t,e,s,r)},n0=(t,e,r,n)=>{
if(n===0)return;const s=r,i=n,o=pd(e,r);let a=e._start;for(o!==null&&(a=o.p,r-=o.index);a!==null&&r>0;a=a.right)!a.deleted&&
a.countable&&(r<a.length&&Us(t,Oe(a.id.client,a.id.clock+r)),r-=a.length);for(;n>0&&a!==null;)a.deleted||(n<a.length&&Us(
t,Oe(a.id.client,a.id.clock+n)),a.delete(t),n-=a.length),a=a.right;if(n>0)throw t0;e._searchMarker&&ga(e._searchMarker,s,
-i+n)},il=(t,e,r)=>{const n=e._map.get(r);n!==void 0&&n.delete(t)},dp=(t,e,r,n)=>{const s=e._map.get(r)||null,i=t.doc,o=i.
clientID;let a;if(n==null)a=new ii([n]);else switch(n.constructor){case Number:case Object:case Boolean:case Array:case String:
a=new ii([n]);break;case Uint8Array:a=new Fa(n);break;case eo:a=new za(n);break;default:if(n instanceof Jt)a=new rs(n);else
throw new Error("Unexpected content type")}new Dt(Oe(o,zt(i.store,o)),s,s&&s.lastId,null,null,e,r,a).integrate(t,0)},up=(t,e)=>{
const r=t._map.get(e);return r!==void 0&&!r.deleted?r.content.getContent()[r.length-1]:void 0},s0=t=>{const e={};return t.
_map.forEach((r,n)=>{r.deleted||(e[n]=r.content.getContent()[r.length-1])}),e},i0=(t,e)=>{const r=t._map.get(e);return r!==
void 0&&!r.deleted},ic=t=>Ix(t.entries(),e=>!e[1].deleted);class cS extends hd{constructor(e,r){super(e,r),this._transaction=
r}}class $i extends Jt{constructor(){super(),this._prelimContent=[],this._searchMarker=[]}static from(e){const r=new $i;
return r.push(e),r}_integrate(e,r){super._integrate(e,r),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){
return new $i}clone(){const e=new $i;return e.insert(0,this.toArray().map(r=>r instanceof Jt?r.clone():r)),e}get length(){
return this._prelimContent===null?this._length:this._prelimContent.length}_callObserver(e,r){super._callObserver(e,r),md(
this,e,new cS(this,e))}insert(e,r){this.doc!==null?ct(this.doc,n=>{r0(n,this,e,r)}):this._prelimContent.splice(e,0,...r)}push(e){
this.doc!==null?ct(this.doc,r=>{aS(r,this,e)}):this._prelimContent.push(...e)}unshift(e){this.insert(0,e)}delete(e,r=1){
this.doc!==null?ct(this.doc,n=>{n0(n,this,e,r)}):this._prelimContent.splice(e,r)}get(e){return e0(this,e)}toArray(){return Yw(
this)}slice(e=0,r=this.length){return Xw(this,e,r)}toJSON(){return this.map(e=>e instanceof Jt?e.toJSON():e)}map(e){return Zw(
this,e)}forEach(e){ba(this,e)}[Symbol.iterator](){return oS(this)}_write(e){e.writeTypeRef(MS)}}const lS=t=>new $i;class dS extends hd{constructor(e,r,n){
super(e,r),this.keysChanged=n}}class Xn extends Jt{constructor(e){super(),this._prelimContent=null,e===void 0?this._prelimContent=
new Map:this._prelimContent=new Map(e)}_integrate(e,r){super._integrate(e,r),this._prelimContent.forEach((n,s)=>{this.set(
s,n)}),this._prelimContent=null}_copy(){return new Xn}clone(){const e=new Xn;return this.forEach((r,n)=>{e.set(n,r instanceof
Jt?r.clone():r)}),e}_callObserver(e,r){md(this,e,new dS(this,e,r))}toJSON(){const e={};return this._map.forEach((r,n)=>{
if(!r.deleted){const s=r.content.getContent()[r.length-1];e[n]=s instanceof Jt?s.toJSON():s}}),e}get size(){return[...ic(
this._map)].length}keys(){return Qd(ic(this._map),e=>e[0])}values(){return Qd(ic(this._map),e=>e[1].content.getContent()[e[1].
length-1])}entries(){return Qd(ic(this._map),e=>[e[0],e[1].content.getContent()[e[1].length-1]])}forEach(e){this._map.forEach(
(r,n)=>{r.deleted||e(r.content.getContent()[r.length-1],n,this)})}[Symbol.iterator](){return this.entries()}delete(e){this.
doc!==null?ct(this.doc,r=>{il(r,this,e)}):this._prelimContent.delete(e)}set(e,r){return this.doc!==null?ct(this.doc,n=>{
dp(n,this,e,r)}):this._prelimContent.set(e,r),r}get(e){return up(this,e)}has(e){return i0(this,e)}clear(){this.doc!==null?
ct(this.doc,e=>{this.forEach(function(r,n,s){il(e,s,n)})}):this._prelimContent.clear()}_write(e){e.writeTypeRef(BS)}}const uS=t=>new Xn,
Ts=(t,e)=>t===e||typeof t=="object"&&typeof e=="object"&&t&&e&&Ik(t,e);class If{constructor(e,r,n,s){this.left=e,this.right=
r,this.index=n,this.currentAttributes=s}forward(){switch(this.right===null&&sn(),this.right.content.constructor){case $t:
this.right.deleted||to(this.currentAttributes,this.right.content);break;default:this.right.deleted||(this.index+=this.right.
length);break}this.left=this.right,this.right=this.right.right}}const Fm=(t,e,r)=>{for(;e.right!==null&&r>0;){switch(e.right.
content.constructor){case $t:e.right.deleted||to(e.currentAttributes,e.right.content);break;default:e.right.deleted||(r<
e.right.length&&Us(t,Oe(e.right.id.client,e.right.id.clock+r)),e.index+=e.right.length,r-=e.right.length);break}e.left=e.
right,e.right=e.right.right}return e},oc=(t,e,r)=>{const n=new Map,s=pd(e,r);if(s){const i=new If(s.p.left,s.p,s.index,n);
return Fm(t,i,r-s.index)}else{const i=new If(null,e._start,0,n);return Fm(t,i,r)}},o0=(t,e,r,n)=>{for(;r.right!==null&&(r.
right.deleted===!0||r.right.content.constructor===$t&&Ts(n.get(r.right.content.key),r.right.content.value));)r.right.deleted||
n.delete(r.right.content.key),r.forward();const s=t.doc,i=s.clientID;n.forEach((o,a)=>{const c=r.left,l=r.right,d=new Dt(
Oe(i,zt(s.store,i)),c,c&&c.lastId,l,l&&l.id,e,null,new $t(a,o));d.integrate(t,0),r.right=d,r.forward()})},to=(t,e)=>{const{
key:r,value:n}=e;n===null?t.delete(r):t.set(r,n)},a0=(t,e)=>{for(;t.right!==null;){if(!(t.right.deleted||t.right.content.
constructor===$t&&Ts(e[t.right.content.key]||null,t.right.content.value)))break;t.forward()}},c0=(t,e,r,n)=>{const s=t.doc,
i=s.clientID,o=new Map;for(const a in n){const c=n[a],l=r.currentAttributes.get(a)||null;if(!Ts(l,c)){o.set(a,l);const{left:d,
right:u}=r;r.right=new Dt(Oe(i,zt(s.store,i)),d,d&&d.lastId,u,u&&u.id,e,null,new $t(a,c)),r.right.integrate(t,0),r.forward()}}
return o},Xd=(t,e,r,n,s)=>{r.currentAttributes.forEach((h,p)=>{s[p]===void 0&&(s[p]=null)});const i=t.doc,o=i.clientID;a0(
r,s);const a=c0(t,e,r,s),c=n.constructor===String?new Mn(n):n instanceof Jt?new rs(n):new ui(n);let{left:l,right:d,index:u}=r;
e._searchMarker&&ga(e._searchMarker,r.index,c.getLength()),d=new Dt(Oe(o,zt(i.store,o)),l,l&&l.lastId,d,d&&d.id,e,null,c),
d.integrate(t,0),r.right=d,r.index=u,r.forward(),o0(t,e,r,a)},zm=(t,e,r,n,s)=>{const i=t.doc,o=i.clientID;a0(r,s);const a=c0(
t,e,r,s);e:for(;r.right!==null&&(n>0||a.size>0&&(r.right.deleted||r.right.content.constructor===$t));){if(!r.right.deleted)
switch(r.right.content.constructor){case $t:{const{key:c,value:l}=r.right.content,d=s[c];if(d!==void 0){if(Ts(d,l))a.delete(
c);else{if(n===0)break e;a.set(c,l)}r.right.delete(t)}else r.currentAttributes.set(c,l);break}default:n<r.right.length&&
Us(t,Oe(r.right.id.client,r.right.id.clock+n)),n-=r.right.length;break}r.forward()}if(n>0){let c="";for(;n>0;n--)c+=`
`;r.right=new Dt(Oe(o,zt(i.store,o)),r.left,r.left&&r.left.lastId,r.right,r.right&&r.right.id,e,null,new Mn(c)),r.right.
integrate(t,0),r.forward()}o0(t,e,r,a)},l0=(t,e,r,n,s)=>{let i=e;const o=bn();for(;i&&(!i.countable||i.deleted);){if(!i.
deleted&&i.content.constructor===$t){const l=i.content;o.set(l.key,l)}i=i.right}let a=0,c=!1;for(;e!==i;){if(r===e&&(c=!0),
!e.deleted){const l=e.content;switch(l.constructor){case $t:{const{key:d,value:u}=l,h=n.get(d)||null;(o.get(d)!==l||h===
u)&&(e.delete(t),a++,!c&&(s.get(d)||null)===u&&h!==u&&(h===null?s.delete(d):s.set(d,h))),!c&&!e.deleted&&to(s,l);break}}}
e=e.right}return a},fS=(t,e)=>{for(;e&&e.right&&(e.right.deleted||!e.right.countable);)e=e.right;const r=new Set;for(;e&&
(e.deleted||!e.countable);){if(!e.deleted&&e.content.constructor===$t){const n=e.content.key;r.has(n)?e.delete(t):r.add(
n)}e=e.left}},hS=t=>{let e=0;return ct(t.doc,r=>{let n=t._start,s=t._start,i=bn();const o=gf(i);for(;s;){if(s.deleted===
!1)switch(s.content.constructor){case $t:to(o,s.content);break;default:e+=l0(r,n,s,i,o),i=gf(o),n=s;break}s=s.right}}),e},
qm=(t,e,r)=>{const n=r,s=gf(e.currentAttributes),i=e.right;for(;r>0&&e.right!==null;){if(e.right.deleted===!1)switch(e.right.
content.constructor){case rs:case ui:case Mn:r<e.right.length&&Us(t,Oe(e.right.id.client,e.right.id.clock+r)),r-=e.right.
length,e.right.delete(t);break}e.forward()}i&&l0(t,i,e.right,s,e.currentAttributes);const o=(e.left||e.right).parent;return o.
_searchMarker&&ga(o._searchMarker,e.index,-n+r),e};class pS extends hd{constructor(e,r,n){super(e,r),this.childListChanged=
!1,this.keysChanged=new Set,n.forEach(s=>{s===null?this.childListChanged=!0:this.keysChanged.add(s)})}get changes(){if(this.
_changes===null){const e={keys:this.keys,delta:this.delta,added:new Set,deleted:new Set};this._changes=e}return this._changes}get delta(){
if(this._delta===null){const e=this.target.doc,r=[];ct(e,n=>{const s=new Map,i=new Map;let o=this.target._start,a=null;const c={};
let l="",d=0,u=0;const h=()=>{if(a!==null){let p=null;switch(a){case"delete":u>0&&(p={delete:u}),u=0;break;case"insert":
(typeof l=="object"||l.length>0)&&(p={insert:l},s.size>0&&(p.attributes={},s.forEach((m,b)=>{m!==null&&(p.attributes[b]=
m)}))),l="";break;case"retain":d>0&&(p={retain:d},Ak(c)||(p.attributes=xk({},c))),d=0;break}p&&r.push(p),a=null}};for(;o!==
null;){switch(o.content.constructor){case rs:case ui:this.adds(o)?this.deletes(o)||(h(),a="insert",l=o.content.getContent()[0],
h()):this.deletes(o)?(a!=="delete"&&(h(),a="delete"),u+=1):o.deleted||(a!=="retain"&&(h(),a="retain"),d+=1);break;case Mn:
this.adds(o)?this.deletes(o)||(a!=="insert"&&(h(),a="insert"),l+=o.content.str):this.deletes(o)?(a!=="delete"&&(h(),a="d\
elete"),u+=o.length):o.deleted||(a!=="retain"&&(h(),a="retain"),d+=o.length);break;case $t:{const{key:p,value:m}=o.content;
if(this.adds(o)){if(!this.deletes(o)){const b=s.get(p)||null;Ts(b,m)?m!==null&&o.delete(n):(a==="retain"&&h(),Ts(m,i.get(
p)||null)?delete c[p]:c[p]=m)}}else if(this.deletes(o)){i.set(p,m);const b=s.get(p)||null;Ts(b,m)||(a==="retain"&&h(),c[p]=
b)}else if(!o.deleted){i.set(p,m);const b=c[p];b!==void 0&&(Ts(b,m)?b!==null&&o.delete(n):(a==="retain"&&h(),m===null?delete c[p]:
c[p]=m))}o.deleted||(a==="insert"&&h(),to(s,o.content));break}}o=o.right}for(h();r.length>0;){const p=r[r.length-1];if(p.
retain!==void 0&&p.attributes===void 0)r.pop();else break}}),this._delta=r}return this._delta}}class Hi extends Jt{constructor(e){
super(),this._pending=e!==void 0?[()=>this.insert(0,e)]:[],this._searchMarker=[]}get length(){return this._length}_integrate(e,r){
super._integrate(e,r);try{this._pending.forEach(n=>n())}catch(n){console.error(n)}this._pending=null}_copy(){return new Hi}clone(){
const e=new Hi;return e.applyDelta(this.toDelta()),e}_callObserver(e,r){super._callObserver(e,r);const n=new pS(this,e,r),
s=e.doc;if(md(this,e,n),!e.local){let i=!1;for(const[o,a]of e.afterState.entries()){const c=e.beforeState.get(o)||0;if(a!==
c&&(Hw(e,s.store.clients.get(o),c,a,l=>{!l.deleted&&l.content.constructor===$t&&(i=!0)}),i))break}i||xf(e,e.deleteSet,o=>{
o instanceof tn||i||o.parent===this&&o.content.constructor===$t&&(i=!0)}),ct(s,o=>{i?hS(this):xf(o,o.deleteSet,a=>{a instanceof
tn||a.parent===this&&fS(o,a)})})}}toString(){let e="",r=this._start;for(;r!==null;)!r.deleted&&r.countable&&r.content.constructor===
Mn&&(e+=r.content.str),r=r.right;return e}toJSON(){return this.toString()}applyDelta(e,{sanitize:r=!0}={}){this.doc!==null?
ct(this.doc,n=>{const s=new If(null,this._start,0,new Map);for(let i=0;i<e.length;i++){const o=e[i];if(o.insert!==void 0){
const a=!r&&typeof o.insert=="string"&&i===e.length-1&&s.right===null&&o.insert.slice(-1)===`
`?o.insert.slice(0,-1):o.insert;(typeof a!="string"||a.length>0)&&Xd(n,this,s,a,o.attributes||{})}else o.retain!==void 0?
zm(n,this,s,o.retain,o.attributes||{}):o.delete!==void 0&&qm(n,s,o.delete)}}):this._pending.push(()=>this.applyDelta(e))}toDelta(e,r,n){
const s=[],i=new Map,o=this.doc;let a="",c=this._start;function l(){if(a.length>0){const u={};let h=!1;i.forEach((m,b)=>{
h=!0,u[b]=m});const p={insert:a};h&&(p.attributes=u),s.push(p),a=""}}const d=()=>{for(;c!==null;){if(mo(c,e)||r!==void 0&&
mo(c,r))switch(c.content.constructor){case Mn:{const u=i.get("ychange");e!==void 0&&!mo(c,e)?(u===void 0||u.user!==c.id.
client||u.type!=="removed")&&(l(),i.set("ychange",n?n("removed",c.id):{type:"removed"})):r!==void 0&&!mo(c,r)?(u===void 0||
u.user!==c.id.client||u.type!=="added")&&(l(),i.set("ychange",n?n("added",c.id):{type:"added"})):u!==void 0&&(l(),i.delete(
"ychange")),a+=c.content.str;break}case rs:case ui:{l();const u={insert:c.content.getContent()[0]};if(i.size>0){const h={};
u.attributes=h,i.forEach((p,m)=>{h[m]=p})}s.push(u);break}case $t:mo(c,e)&&(l(),to(i,c.content));break}c=c.right}l()};return e||
r?ct(o,u=>{e&&Sf(u,e),r&&Sf(u,r),d()},"cleanup"):d(),s}insert(e,r,n){if(r.length<=0)return;const s=this.doc;s!==null?ct(
s,i=>{const o=oc(i,this,e);n||(n={},o.currentAttributes.forEach((a,c)=>{n[c]=a})),Xd(i,this,o,r,n)}):this._pending.push(
()=>this.insert(e,r,n))}insertEmbed(e,r,n={}){const s=this.doc;s!==null?ct(s,i=>{const o=oc(i,this,e);Xd(i,this,o,r,n)}):
this._pending.push(()=>this.insertEmbed(e,r,n))}delete(e,r){if(r===0)return;const n=this.doc;n!==null?ct(n,s=>{qm(s,oc(s,
this,e),r)}):this._pending.push(()=>this.delete(e,r))}format(e,r,n){if(r===0)return;const s=this.doc;s!==null?ct(s,i=>{const o=oc(
i,this,e);o.right!==null&&zm(i,this,o,r,n)}):this._pending.push(()=>this.format(e,r,n))}removeAttribute(e){this.doc!==null?
ct(this.doc,r=>{il(r,this,e)}):this._pending.push(()=>this.removeAttribute(e))}setAttribute(e,r){this.doc!==null?ct(this.
doc,n=>{dp(n,this,e,r)}):this._pending.push(()=>this.setAttribute(e,r))}getAttribute(e){return up(this,e)}getAttributes(){
return s0(this)}_write(e){e.writeTypeRef(LS)}}const mS=t=>new Hi;class Yd{constructor(e,r=()=>!0){this._filter=r,this._root=
e,this._currentNode=e._start,this._firstCall=!0}[Symbol.iterator](){return this}next(){let e=this._currentNode,r=e&&e.content&&
e.content.type;if(e!==null&&(!this._firstCall||e.deleted||!this._filter(r)))do if(r=e.content.type,!e.deleted&&(r.constructor===
ya||r.constructor===si)&&r._start!==null)e=r._start;else for(;e!==null;)if(e.right!==null){e=e.right;break}else e.parent===
this._root?e=null:e=e.parent._item;while(e!==null&&(e.deleted||!this._filter(e.content.type)));return this._firstCall=!1,
e===null?{value:void 0,done:!0}:(this._currentNode=e,{value:e.content.type,done:!1})}}class si extends Jt{constructor(){
super(),this._prelimContent=[]}get firstChild(){const e=this._first;return e?e.content.getContent()[0]:null}_integrate(e,r){
super._integrate(e,r),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new si}clone(){const e=new si;
return e.insert(0,this.toArray().map(r=>r instanceof Jt?r.clone():r)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}createTreeWalker(e){return new Yd(this,e)}querySelector(e){e=e.toUpperCase();const n=new Yd(
this,s=>s.nodeName&&s.nodeName.toUpperCase()===e).next();return n.done?null:n.value}querySelectorAll(e){return e=e.toUpperCase(),
Os(new Yd(this,r=>r.nodeName&&r.nodeName.toUpperCase()===e))}_callObserver(e,r){md(this,e,new yS(this,r,e))}toString(){return Zw(
this,e=>e.toString()).join("")}toJSON(){return this.toString()}toDOM(e=document,r={},n){const s=e.createDocumentFragment();
return n!==void 0&&n._createAssociation(s,this),ba(this,i=>{s.insertBefore(i.toDOM(e,r,n),null)}),s}insert(e,r){this.doc!==
null?ct(this.doc,n=>{r0(n,this,e,r)}):this._prelimContent.splice(e,0,...r)}insertAfter(e,r){if(this.doc!==null)ct(this.doc,
n=>{const s=e&&e instanceof Jt?e._item:e;sl(n,this,s,r)});else{const n=this._prelimContent,s=e===null?0:n.findIndex(i=>i===
e)+1;if(s===0&&e!==null)throw es("Reference item not found");n.splice(s,0,...r)}}delete(e,r=1){this.doc!==null?ct(this.doc,
n=>{n0(n,this,e,r)}):this._prelimContent.splice(e,r)}toArray(){return Yw(this)}push(e){this.insert(this.length,e)}unshift(e){
this.insert(0,e)}get(e){return e0(this,e)}slice(e=0,r=this.length){return Xw(this,e,r)}forEach(e){ba(this,e)}_write(e){e.
writeTypeRef($S)}}const gS=t=>new si;class ya extends si{constructor(e="UNDEFINED"){super(),this.nodeName=e,this._prelimAttrs=
new Map}get nextSibling(){const e=this._item?this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this.
_item?this._item.prev:null;return e?e.content.type:null}_integrate(e,r){super._integrate(e,r),this._prelimAttrs.forEach(
(n,s)=>{this.setAttribute(s,n)}),this._prelimAttrs=null}_copy(){return new ya(this.nodeName)}clone(){const e=new ya(this.
nodeName),r=this.getAttributes();for(const n in r)e.setAttribute(n,r[n]);return e.insert(0,this.toArray().map(n=>n instanceof
Jt?n.clone():n)),e}toString(){const e=this.getAttributes(),r=[],n=[];for(const a in e)n.push(a);n.sort();const s=n.length;
for(let a=0;a<s;a++){const c=n[a];r.push(c+'="'+e[c]+'"')}const i=this.nodeName.toLocaleLowerCase(),o=r.length>0?" "+r.join(
" "):"";return`<${i}${o}>${super.toString()}</${i}>`}removeAttribute(e){this.doc!==null?ct(this.doc,r=>{il(r,this,e)}):this.
_prelimAttrs.delete(e)}setAttribute(e,r){this.doc!==null?ct(this.doc,n=>{dp(n,this,e,r)}):this._prelimAttrs.set(e,r)}getAttribute(e){
return up(this,e)}hasAttribute(e){return i0(this,e)}getAttributes(){return s0(this)}toDOM(e=document,r={},n){const s=e.createElement(
this.nodeName),i=this.getAttributes();for(const o in i)s.setAttribute(o,i[o]);return ba(this,o=>{s.appendChild(o.toDOM(e,
r,n))}),n!==void 0&&n._createAssociation(s,this),s}_write(e){e.writeTypeRef(DS),e.writeKey(this.nodeName)}}const bS=t=>new ya(
t.readKey());class yS extends hd{constructor(e,r,n){super(e,n),this.childListChanged=!1,this.attributesChanged=new Set,r.
forEach(s=>{s===null?this.childListChanged=!0:this.attributesChanged.add(s)})}}class ol extends Xn{constructor(e){super(),
this.hookName=e}_copy(){return new ol(this.hookName)}clone(){const e=new ol(this.hookName);return this.forEach((r,n)=>{e.
set(n,r)}),e}toDOM(e=document,r={},n){const s=r[this.hookName];let i;return s!==void 0?i=s.createDom(this):i=document.createElement(
this.hookName),i.setAttribute("data-yjs-hook",this.hookName),n!==void 0&&n._createAssociation(i,this),i}_write(e){e.writeTypeRef(
NS),e.writeKey(this.hookName)}}const wS=t=>new ol(t.readKey());class al extends Hi{get nextSibling(){const e=this._item?
this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this._item?this._item.prev:null;return e?e.content.
type:null}_copy(){return new al}clone(){const e=new al;return e.applyDelta(this.toDelta()),e}toDOM(e=document,r,n){const s=e.
createTextNode(this.toString());return n!==void 0&&n._createAssociation(s,this),s}toString(){return this.toDelta().map(e=>{
const r=[];for(const s in e.attributes){const i=[];for(const o in e.attributes[s])i.push({key:o,value:e.attributes[s][o]});
i.sort((o,a)=>o.key<a.key?-1:1),r.push({nodeName:s,attrs:i})}r.sort((s,i)=>s.nodeName<i.nodeName?-1:1);let n="";for(let s=0;s<
r.length;s++){const i=r[s];n+=`<${i.nodeName}`;for(let o=0;o<i.attrs.length;o++){const a=i.attrs[o];n+=` ${a.key}="${a.value}\
"`}n+=">"}n+=e.insert;for(let s=r.length-1;s>=0;s--)n+=`</${r[s].nodeName}>`;return n}).join("")}toJSON(){return this.toString()}_write(e){
e.writeTypeRef(PS)}}const vS=t=>new al;class fp{constructor(e,r){this.id=e,this.length=r}get deleted(){throw yn()}mergeWith(e){
return!1}write(e,r,n){throw yn()}integrate(e,r){throw yn()}}const ES=0;class tn extends fp{get deleted(){return!0}delete(){}mergeWith(e){
return this.constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,r){r>0&&(this.id.clock+=r,this.length-=
r),Ww(e.doc.store,this)}write(e,r){e.writeInfo(ES),e.writeLen(this.length-r)}getMissing(e,r){return null}}class Fa{constructor(e){
this.content=e}getLength(){return 1}getContent(){return[this.content]}isCountable(){return!0}copy(){return new Fa(this.content)}splice(e){
throw yn()}mergeWith(e){return!1}integrate(e,r){}delete(e){}gc(e){}write(e,r){e.writeBuf(this.content)}getRef(){return 3}}
const kS=t=>new Fa(t.readBuf());class wa{constructor(e){this.len=e}getLength(){return this.len}getContent(){return[]}isCountable(){
return!1}copy(){return new wa(this.len)}splice(e){const r=new wa(this.len-e);return this.len=e,r}mergeWith(e){return this.
len+=e.len,!0}integrate(e,r){tl(e.deleteSet,r.id.client,r.id.clock,this.len),r.markDeleted()}delete(e){}gc(e){}write(e,r){
e.writeLen(this.len-r)}getRef(){return 1}}const xS=t=>new wa(t.readLen()),d0=(t,e)=>new eo({guid:t,...e,shouldLoad:e.shouldLoad||
e.autoLoad||!1});class za{constructor(e){e._item&&console.error("This document was already integrated as a sub-document.\
 You should create a second instance instead with the same guid."),this.doc=e;const r={};this.opts=r,e.gc||(r.gc=!1),e.autoLoad&&
(r.autoLoad=!0),e.meta!==null&&(r.meta=e.meta)}getLength(){return 1}getContent(){return[this.doc]}isCountable(){return!0}copy(){
return new za(d0(this.doc.guid,this.opts))}splice(e){throw yn()}mergeWith(e){return!1}integrate(e,r){this.doc._item=r,e.
subdocsAdded.add(this.doc),this.doc.shouldLoad&&e.subdocsLoaded.add(this.doc)}delete(e){e.subdocsAdded.has(this.doc)?e.subdocsAdded.
delete(this.doc):e.subdocsRemoved.add(this.doc)}gc(e){}write(e,r){e.writeString(this.doc.guid),e.writeAny(this.opts)}getRef(){
return 9}}const SS=t=>new za(d0(t.readString(),t.readAny()));class ui{constructor(e){this.embed=e}getLength(){return 1}getContent(){
return[this.embed]}isCountable(){return!0}copy(){return new ui(this.embed)}splice(e){throw yn()}mergeWith(e){return!1}integrate(e,r){}delete(e){}gc(e){}write(e,r){
e.writeJSON(this.embed)}getRef(){return 5}}const AS=t=>new ui(t.readJSON());class $t{constructor(e,r){this.key=e,this.value=
r}getLength(){return 1}getContent(){return[]}isCountable(){return!1}copy(){return new $t(this.key,this.value)}splice(e){
throw yn()}mergeWith(e){return!1}integrate(e,r){r.parent._searchMarker=null}delete(e){}gc(e){}write(e,r){e.writeKey(this.
key),e.writeJSON(this.value)}getRef(){return 6}}const IS=t=>new $t(t.readKey(),t.readJSON());class cl{constructor(e){this.
arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new cl(this.arr)}splice(e){
const r=new cl(this.arr.slice(e));return this.arr=this.arr.slice(0,e),r}mergeWith(e){return this.arr=this.arr.concat(e.arr),
!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){const n=this.arr.length;e.writeLen(n-r);for(let s=r;s<n;s++){const i=this.
arr[s];e.writeString(i===void 0?"undefined":JSON.stringify(i))}}getRef(){return 2}}const _S=t=>{const e=t.readLen(),r=[];
for(let n=0;n<e;n++){const s=t.readString();s==="undefined"?r.push(void 0):r.push(JSON.parse(s))}return new cl(r)};class ii{constructor(e){
this.arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new ii(this.
arr)}splice(e){const r=new ii(this.arr.slice(e));return this.arr=this.arr.slice(0,e),r}mergeWith(e){return this.arr=this.
arr.concat(e.arr),!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){const n=this.arr.length;e.writeLen(n-r);for(let s=r;s<
n;s++){const i=this.arr[s];e.writeAny(i)}}getRef(){return 8}}const CS=t=>{const e=t.readLen(),r=[];for(let n=0;n<e;n++)r.
push(t.readAny());return new ii(r)};class Mn{constructor(e){this.str=e}getLength(){return this.str.length}getContent(){return this.
str.split("")}isCountable(){return!0}copy(){return new Mn(this.str)}splice(e){const r=new Mn(this.str.slice(e));this.str=
this.str.slice(0,e);const n=this.str.charCodeAt(e-1);return n>=55296&&n<=56319&&(this.str=this.str.slice(0,e-1)+"�",r.
str="�"+r.str.slice(1)),r}mergeWith(e){return this.str+=e.str,!0}integrate(e,r){}delete(e){}gc(e){}write(e,r){e.writeString(
r===0?this.str:this.str.slice(r))}getRef(){return 4}}const RS=t=>new Mn(t.readString()),TS=[lS,uS,mS,bS,gS,wS,vS],MS=0,BS=1,
LS=2,DS=3,$S=4,NS=5,PS=6;class rs{constructor(e){this.type=e}getLength(){return 1}getContent(){return[this.type]}isCountable(){
return!0}copy(){return new rs(this.type._copy())}splice(e){throw yn()}mergeWith(e){return!1}integrate(e,r){this.type._integrate(
e.doc,r)}delete(e){let r=this.type._start;for(;r!==null;)r.deleted?e._mergeStructs.push(r):r.delete(e),r=r.right;this.type.
_map.forEach(n=>{n.deleted?e._mergeStructs.push(n):n.delete(e)}),e.changed.delete(this.type)}gc(e){let r=this.type._start;
for(;r!==null;)r.gc(e,!0),r=r.right;this.type._start=null,this.type._map.forEach(n=>{for(;n!==null;)n.gc(e,!0),n=n.left}),
this.type._map=new Map}write(e,r){this.type._write(e)}getRef(){return 7}}const OS=t=>new rs(TS[t.readTypeRef()](t)),ll=(t,e,r)=>{
const{client:n,clock:s}=e.id,i=new Dt(Oe(n,s+r),e,Oe(n,s+r-1),e.right,e.rightOrigin,e.parent,e.parentSub,e.content.splice(
r));return e.deleted&&i.markDeleted(),e.keep&&(i.keep=!0),e.redone!==null&&(i.redone=Oe(e.redone.client,e.redone.clock+r)),
e.right=i,i.right!==null&&(i.right.left=i),t._mergeStructs.push(i),i.parentSub!==null&&i.right===null&&i.parent._map.set(
i.parentSub,i),e.length=r,i};class Dt extends fp{constructor(e,r,n,s,i,o,a,c){super(e,c.getLength()),this.origin=n,this.
left=r,this.right=s,this.rightOrigin=i,this.parent=o,this.parentSub=a,this.redone=null,this.content=c,this.info=this.content.
isCountable()?km:0}set marker(e){(this.info&Gd)>0!==e&&(this.info^=Gd)}get marker(){return(this.info&Gd)>0}get keep(){return(this.
info&Em)>0}set keep(e){this.keep!==e&&(this.info^=Em)}get countable(){return(this.info&km)>0}get deleted(){return(this.info&
jd)>0}set deleted(e){this.deleted!==e&&(this.info^=jd)}markDeleted(){this.info|=jd}getMissing(e,r){if(this.origin&&this.
origin.client!==this.id.client&&this.origin.clock>=zt(r,this.origin.client))return this.origin.client;if(this.rightOrigin&&
this.rightOrigin.client!==this.id.client&&this.rightOrigin.clock>=zt(r,this.rightOrigin.client))return this.rightOrigin.
client;if(this.parent&&this.parent.constructor===Di&&this.id.client!==this.parent.client&&this.parent.clock>=zt(r,this.parent.
client))return this.parent.client;if(this.origin&&(this.left=Pm(e,r,this.origin),this.origin=this.left.lastId),this.rightOrigin&&
(this.right=Us(e,this.rightOrigin),this.rightOrigin=this.right.id),(this.left&&this.left.constructor===tn||this.right&&this.
right.constructor===tn)&&(this.parent=null),!this.parent)this.left&&this.left.constructor===Dt&&(this.parent=this.left.parent,
this.parentSub=this.left.parentSub),this.right&&this.right.constructor===Dt&&(this.parent=this.right.parent,this.parentSub=
this.right.parentSub);else if(this.parent.constructor===Di){const n=Jd(r,this.parent);n.constructor===tn?this.parent=null:
this.parent=n.content.type}return null}integrate(e,r){if(r>0&&(this.id.clock+=r,this.left=Pm(e,e.doc.store,Oe(this.id.client,
this.id.clock-1)),this.origin=this.left.lastId,this.content=this.content.splice(r),this.length-=r),this.parent){if(!this.
left&&(!this.right||this.right.left!==null)||this.left&&this.left.right!==this.right){let n=this.left,s;if(n!==null)s=n.
right;else if(this.parentSub!==null)for(s=this.parent._map.get(this.parentSub)||null;s!==null&&s.left!==null;)s=s.left;else
s=this.parent._start;const i=new Set,o=new Set;for(;s!==null&&s!==this.right;){if(o.add(s),i.add(s),sc(this.origin,s.origin)){
if(s.id.client<this.id.client)n=s,i.clear();else if(sc(this.rightOrigin,s.rightOrigin))break}else if(s.origin!==null&&o.
has(Jd(e.doc.store,s.origin)))i.has(Jd(e.doc.store,s.origin))||(n=s,i.clear());else break;s=s.right}this.left=n}if(this.
left!==null){const n=this.left.right;this.right=n,this.left.right=this}else{let n;if(this.parentSub!==null)for(n=this.parent.
_map.get(this.parentSub)||null;n!==null&&n.left!==null;)n=n.left;else n=this.parent._start,this.parent._start=this;this.
right=n}this.right!==null?this.right.left=this:this.parentSub!==null&&(this.parent._map.set(this.parentSub,this),this.left!==
null&&this.left.delete(e)),this.parentSub===null&&this.countable&&!this.deleted&&(this.parent._length+=this.length),Ww(e.
doc.store,this),this.content.integrate(e,this),Um(e,this.parent,this.parentSub),(this.parent._item!==null&&this.parent._item.
deleted||this.parentSub!==null&&this.right!==null)&&this.delete(e)}else new tn(this.id,this.length).integrate(e,0)}get next(){
let e=this.right;for(;e!==null&&e.deleted;)e=e.right;return e}get prev(){let e=this.left;for(;e!==null&&e.deleted;)e=e.left;
return e}get lastId(){return this.length===1?this.id:Oe(this.id.client,this.id.clock+this.length-1)}mergeWith(e){if(this.
constructor===e.constructor&&sc(e.origin,this.lastId)&&this.right===e&&sc(this.rightOrigin,e.rightOrigin)&&this.id.client===
e.id.client&&this.id.clock+this.length===e.id.clock&&this.deleted===e.deleted&&this.redone===null&&e.redone===null&&this.
content.constructor===e.content.constructor&&this.content.mergeWith(e.content)){const r=this.parent._searchMarker;return r&&
r.forEach(n=>{n.p===e&&(n.p=this,!this.deleted&&this.countable&&(n.index-=this.length))}),e.keep&&(this.keep=!0),this.right=
e.right,this.right!==null&&(this.right.left=this),this.length+=e.length,!0}return!1}delete(e){if(!this.deleted){const r=this.
parent;this.countable&&this.parentSub===null&&(r._length-=this.length),this.markDeleted(),tl(e.deleteSet,this.id.client,
this.id.clock,this.length),Um(e,r,this.parentSub),this.content.delete(e)}}gc(e,r){if(!this.deleted)throw sn();this.content.
gc(e),r?Hx(e,this,new tn(this.id,this.length)):this.content=new wa(this.length)}write(e,r){const n=r>0?Oe(this.id.client,
this.id.clock+r-1):this.origin,s=this.rightOrigin,i=this.parentSub,o=this.content.getRef()&rd|(n===null?0:Hr)|(s===null?
0:Kn)|(i===null?0:la);if(e.writeInfo(o),n!==null&&e.writeLeftID(n),s!==null&&e.writeRightID(s),n===null&&s===null){const a=this.
parent;if(a._item!==void 0){const c=a._item;if(c===null){const l=Gx(a);e.writeParentInfo(!0),e.writeString(l)}else e.writeParentInfo(
!1),e.writeLeftID(c.id)}else a.constructor===String?(e.writeParentInfo(!0),e.writeString(a)):a.constructor===Di?(e.writeParentInfo(
!1),e.writeLeftID(a)):sn();i!==null&&e.writeString(i)}this.content.write(e,r)}}const u0=(t,e)=>US[e&rd](t),US=[()=>{sn()},
xS,_S,kS,RS,AS,IS,OS,CS,SS,()=>{sn()}],FS=10;class rn extends fp{get deleted(){return!0}delete(){}mergeWith(e){return this.
constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,r){sn()}write(e,r){e.writeInfo(FS),Pe(e.restEncoder,
this.length-r)}getMissing(e,r){return null}}const f0=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<
"u"?global:{},h0="__ $YJS$ __";f0[h0]===!0&&console.error("Yjs was already imported. This breaks constructor checks and \
will lead to issues! - https://github.com/yjs/yjs/issues/438");f0[h0]=!0;const fi=t=>ji((e,r)=>{t.onerror=n=>r(new Error(
n.target.error)),t.onsuccess=n=>e(n.target.result)}),zS=(t,e)=>ji((r,n)=>{const s=indexedDB.open(t);s.onupgradeneeded=i=>e(
i.target.result),s.onerror=i=>n(es(i.target.error)),s.onsuccess=i=>{const o=i.target.result;o.onversionchange=()=>{o.close()},
r(o)}}),qS=t=>fi(indexedDB.deleteDatabase(t)),jS=(t,e)=>e.forEach(r=>t.createObjectStore.apply(t,r)),zo=(t,e,r="readwrit\
e")=>{const n=t.transaction(e,r);return e.map(s=>XS(n,s))},p0=(t,e)=>fi(t.count(e)),GS=(t,e)=>fi(t.get(e)),m0=(t,e)=>fi(
t.delete(e)),WS=(t,e,r)=>fi(t.put(e,r)),_f=(t,e)=>fi(t.add(e)),HS=(t,e,r)=>fi(t.getAll(e,r)),VS=(t,e,r)=>{let n=null;return JS(
t,e,s=>(n=s,!1),r).then(()=>n)},KS=(t,e=null)=>VS(t,e,"prev"),QS=(t,e)=>ji((r,n)=>{t.onerror=n,t.onsuccess=async s=>{const i=s.
target.result;if(i===null||await e(i)===!1)return r();i.continue()}}),JS=(t,e,r,n="next")=>QS(t.openKeyCursor(e,n),s=>r(
s.key)),XS=(t,e)=>t.objectStore(e),YS=(t,e)=>IDBKeyRange.upperBound(t,e),ZS=(t,e)=>IDBKeyRange.lowerBound(t,e),Zd="custo\
m",g0="updates",b0=500,y0=(t,e=()=>{},r=()=>{})=>{const[n]=zo(t.db,[g0]);return HS(n,ZS(t._dbref,!1)).then(s=>{t._destroyed||
(e(n),ct(t.doc,()=>{s.forEach(i=>rl(t.doc,i))},t,!1),r(n))}).then(()=>KS(n).then(s=>{t._dbref=s+1})).then(()=>p0(n).then(
s=>{t._dbsize=s})).then(()=>n)},eA=(t,e=!0)=>y0(t).then(r=>{(e||t._dbsize>=b0)&&_f(r,ip(t.doc)).then(()=>m0(r,YS(t._dbref,
!0))).then(()=>p0(r).then(n=>{t._dbsize=n}))});class tA extends jh{constructor(e,r){super(),this.doc=r,this.name=e,this.
_dbref=0,this._dbsize=0,this._destroyed=!1,this.db=null,this.synced=!1,this._db=zS(e,n=>jS(n,[["updates",{autoIncrement:!0}],
["custom"]])),this.whenSynced=ji(n=>this.on("synced",()=>n(this))),this._db.then(n=>{this.db=n,y0(this,o=>_f(o,ip(r)),()=>{
if(this._destroyed)return this;this.synced=!0,this.emit("synced",[this])})}),this._storeTimeout=1e3,this._storeTimeoutId=
null,this._storeUpdate=(n,s)=>{if(this.db&&s!==this){const[i]=zo(this.db,[g0]);_f(i,n),++this._dbsize>=b0&&(this._storeTimeoutId!==
null&&clearTimeout(this._storeTimeoutId),this._storeTimeoutId=setTimeout(()=>{eA(this,!1),this._storeTimeoutId=null},this.
_storeTimeout))}},r.on("update",this._storeUpdate),this.destroy=this.destroy.bind(this),r.on("destroy",this.destroy)}destroy(){
return this._storeTimeoutId&&clearTimeout(this._storeTimeoutId),this.doc.off("update",this._storeUpdate),this.doc.off("d\
estroy",this.destroy),this._destroyed=!0,this._db.then(e=>{e.close()})}clearData(){return this.destroy().then(()=>{qS(this.
name)})}get(e){return this._db.then(r=>{const[n]=zo(r,[Zd],"readonly");return GS(n,e)})}set(e,r){return this._db.then(n=>{
const[s]=zo(n,[Zd]);return WS(s,r,e)})}del(e){return this._db.then(r=>{const[n]=zo(r,[Zd]);return m0(n,e)})}}const jm="y\
js-update",Gm="yjs-sync-request",Wm="yjs-sync-response";function eu(t){return t instanceof Uint8Array?t:Array.isArray(t)?
new Uint8Array(t):t&&typeof t=="object"?new Uint8Array(Object.values(t)):new Uint8Array(0)}class rA extends jh{constructor(e,r,n={}){
super(),this.networkManager=e,this.doc=r,this.topic=n.topic||"peercompute-state-sync",this.peerId=n.peerId||e?.peerId||null,
this.initialSync=n.initialSync!==!1,this.syncRequestCounter=0,this.initialSyncTimer=null,this.awareness=null,this._onDocumentUpdate=
this._onDocumentUpdate.bind(this),this._onNetworkMessage=this._onNetworkMessage.bind(this),this.doc.on("update",this._onDocumentUpdate),
this.networkManager?.addMessageHandler&&this.networkManager.addMessageHandler(this._onNetworkMessage),this.initialSync&&
(this.initialSyncTimer=setTimeout(()=>{this.initialSyncTimer=null,this.requestSync().catch(s=>{console.error("[PeerCompu\
teProvider] Initial sync request failed",s)})},0)),console.log("[PeerComputeProvider] Initialized")}_getLocalPeerId(){return this.
peerId||this.networkManager?.peerId||this.networkManager?.getPeerId?.()||null}async requestSync(){if(typeof this.networkManager?.
broadcast!="function")return;const e=`${this._getLocalPeerId()||"peer"}:${Date.now()}:${++this.syncRequestCounter}`,r=qx(
this.doc);await this.networkManager.broadcast({type:Gm,data:{requestId:e,sourcePeerId:this._getLocalPeerId(),stateVector:Array.
from(r)}},{topic:this.topic})}async _sendSyncResponse(e,r={}){const n=eu(r.stateVector),s=ip(this.doc,n);if(s.byteLength===
0)return;const i={type:Wm,data:{requestId:r.requestId||null,sourcePeerId:this._getLocalPeerId(),targetPeerId:e||r.sourcePeerId||
null,update:Array.from(s)}};if(e&&typeof this.networkManager?.sendToPeer=="function"){await this.networkManager.sendToPeer(
e,i);return}typeof this.networkManager?.broadcast=="function"&&await this.networkManager.broadcast(i,{topic:this.topic})}_onDocumentUpdate(e,r){
if(r!==this){if(typeof this.networkManager?.broadcast!="function")return;this.networkManager.broadcast({type:jm,data:Array.
from(e)},{topic:this.topic}).catch(n=>{console.error("[PeerComputeProvider] Broadcast failed",n)})}}_onNetworkMessage(e,r){
if(!(!r||e===this._getLocalPeerId())){if(r.type===jm){const n=eu(r.data);n.byteLength>0&&rl(this.doc,n,this);return}if(r.
type===Gm){this._sendSyncResponse(e,r.data||{}).catch(n=>{console.error("[PeerComputeProvider] Sync response failed",n)});
return}if(r.type===Wm){const n=r.data?.targetPeerId||null,s=this._getLocalPeerId();if(n&&s&&n!==s)return;const i=eu(r.data?.
update);i.byteLength>0&&rl(this.doc,i,this)}}}destroy(){this.initialSyncTimer&&(clearTimeout(this.initialSyncTimer),this.
initialSyncTimer=null),this.doc.off("update",this._onDocumentUpdate),this.networkManager=null}}class nA{constructor({ydoc:e,
stateMap:r,hotStore:n,deltaNamespace:s="deltas"}={}){if(!e||!r)throw new Error("[DataState] ydoc and stateMap are requir\
ed");this.ydoc=e,this.state=r,this.hotStore=n||new Map,this.deltaNamespace=s,this.localArtifactCaches=new Map,this.artifactStores=
new Map}_getNamespaceMap(e){let r=this.state.get(e);return r||(r=new Xn,this.state.set(e,r)),r}commitDelta(e={}){const r=e.
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
length)throw new AggregateError(r,"Artifact storage cleanup failed");this.artifactStores.clear()}}const Hm="peercompute.\
local-artifact.v1",sA="peercompute-local-artifacts-v1",kn="artifacts",iA=64,oA=32*1024*1024,aA=8*1024*1024,Vm=16*1024,Km=2048,
cA=96;function gn(t,e,r){const n=new t(r);return n.code=e,n}function Cf(){if(typeof DOMException=="function")return new DOMException(
"The operation was aborted.","AbortError");const t=new Error("The operation was aborted.");return t.name="AbortError",t}
function go(t){if(t?.aborted)throw t.reason??Cf()}function tu(t,e){if(!Number.isSafeInteger(t)||t<1)throw new RangeError(
`${e} must be a positive safe integer.`);return t}function ac(t,e){if(!Number.isFinite(t)||t<0)throw new RangeError(`${e}\
 must be a finite non-negative timestamp.`);return t}function lA(t){const e=String(t??"").trim();if(!e||e.length>cA||!/^[a-z0-9][a-z0-9._-]*$/iu.
test(e))throw new TypeError("Local artifact cache name must be a short identifier containing letters, numbers, dot, dash\
, or underscore.");return e}function ru(t){const e=String(t??"");if(!e||e.length>Km)throw new TypeError(`Local artifact \
cache keys must contain 1-${Km} characters.`);return e}function w0(t,e){const r=String(t??"").trim();if(!r||r.length>256)
throw new TypeError(`${e} must be a non-empty string of at most 256 characters.`);return r}function dA(t){const e=w0(t,"\
mediaType").split(";",1)[0].trim().toLowerCase();if(!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(e))throw new TypeError(
"mediaType must be a valid MIME type.");return e}function Qm(t){if(t instanceof Uint8Array)return t.slice();if(t instanceof
ArrayBuffer)return new Uint8Array(t.slice(0));if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength).
slice();throw new TypeError("Local artifact cache values must contain ArrayBuffer or typed-array bytes.")}function qo(t={}){
if(!t||typeof t!="object"||Array.isArray(t))throw new TypeError("Local artifact metadata must be an object.");let e;try{
e=JSON.stringify(t)}catch{throw new TypeError("Local artifact metadata must be JSON-serializable.")}e===void 0&&(e="{}");
const r=new TextEncoder().encode(e).byteLength;if(r>Vm)throw gn(RangeError,"ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE",`Loca\
l artifact metadata exceeds the ${Vm}-byte cap.`);const n=JSON.parse(e);if(!n||typeof n!="object"||Array.isArray(n))throw new TypeError(
"Local artifact metadata must serialize to an object.");return{metadata:n,byteLength:r}}async function Jm(t){if(!globalThis.
crypto?.subtle?.digest)throw gn(Error,"ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE","SHA-256 is unavailable; local artifacts can\
not be admitted without integrity metadata.");const e=await globalThis.crypto.subtle.digest("SHA-256",t);return`sha256:${Array.
from(new Uint8Array(e),r=>r.toString(16).padStart(2,"0")).join("")}`}function Rf(t){return Object.freeze(qo(t).metadata)}
function cc(t,e,r={}){return Object.freeze({bytes:t.bytes.slice(),metadata:Rf(t.metadata),cacheStatus:e,...r})}function nu(t){
return new Promise((e,r)=>{t.onsuccess=()=>e(t.result),t.onerror=()=>r(t.error??new Error("IndexedDB request failed."))})}
function lc(t){return new Promise((e,r)=>{t.oncomplete=()=>e(),t.onerror=()=>r(t.error??new Error("IndexedDB transaction\
 failed.")),t.onabort=()=>r(t.error??new Error("IndexedDB transaction aborted."))})}function su(t,e){return`${t}\0${e}`}
class uA{constructor({name:e,maximumEntries:r=iA,maximumBytes:n=oA,maximumEntryBytes:s=Math.min(aA,n),persistent:i=!0,clock:o=Date.
now,indexedDBImpl:a=globalThis.indexedDB,onDestroy:c=null}={}){if(this.name=lA(e),this.maximumEntries=tu(r,"maximumEntri\
es"),this.maximumBytes=tu(n,"maximumBytes"),this.maximumEntryBytes=tu(s,"maximumEntryBytes"),this.maximumEntryBytes>this.
maximumBytes)throw new RangeError("maximumEntryBytes must not exceed maximumBytes.");if(typeof o!="function")throw new TypeError(
"clock must be a function.");if(c!==null&&typeof c!="function")throw new TypeError("onDestroy must be a function or null\
.");this.clock=o,this.indexedDB=a,this.persistenceConfigured=i===!0,this.persistenceAvailable=this.persistenceConfigured&&
typeof a?.open=="function",this.onDestroy=c,this.entries=new Map,this.inflight=new Map,this.residentBytes=0,this.reservedBytes=
0,this.databasePromise=null,this.database=null,this.persistenceQueue=Promise.resolve(),this.destroyed=!1,this.generation=
0,this.counters={hits:0,misses:0,coalesced:0,stale:0,evictions:0,rejected:0,validationFailures:0,persistenceFailures:0}}#e(){
if(this.destroyed)throw gn(Error,"ERR_LOCAL_ARTIFACT_CACHE_DESTROYED","Local artifact cache is destroyed.")}#t(e,r){r.metadata.
accessedAt=this.clock(),this.entries.delete(e),this.entries.set(e,r)}#r(e,{eviction:r=!1}={}){const n=this.entries.get(e);
return n?(this.entries.delete(e),this.residentBytes=Math.max(0,this.residentBytes-n.storageBytes),r&&(this.counters.evictions+=
1),!0):!1}#u({key:e,entryBytes:r=null,reservationBytes:n=0}={}){const s=this.entries.get(e),i=s?.storageBytes??0,o=()=>{
const a=r!==null,c=this.entries.size+(a&&!s?1:0),l=a?this.residentBytes-i+r+this.reservedBytes+n:this.residentBytes+this.
reservedBytes+n;return c>this.maximumEntries||l>this.maximumBytes};for(;o();){let a=!1;for(const c of this.entries.keys())
if(c!==e){this.#r(c,{eviction:!0}),a=!0;break}if(!a)return!1}return!0}#f(e,r){return r.storageBytes>this.maximumEntryBytes||
r.bytes.byteLength>this.maximumEntryBytes?(this.counters.rejected+=1,!1):this.#u({key:e,entryBytes:r.storageBytes})?(this.#r(
e),this.entries.set(e,r),this.residentBytes+=r.storageBytes,!0):(this.counters.rejected+=1,!1)}#a(e){const r=this.entries.
get(e)?.storageBytes??0,n=Math.max(0,this.maximumEntryBytes-Math.min(r,this.maximumEntryBytes));if(this.inflight.size>=this.
maximumEntries||!this.#u({key:e,reservationBytes:n}))throw this.counters.rejected+=1,gn(Error,"ERR_LOCAL_ARTIFACT_CACHE_\
BUSY","Local artifact cache has no bounded capacity for another in-flight load.");return this.reservedBytes+=n,n}#l(e){this.
reservedBytes=Math.max(0,this.reservedBytes-e)}async#h(){return!this.persistenceAvailable||this.destroyed?null:this.database?
this.database:(this.databasePromise||(this.databasePromise=new Promise((e,r)=>{let n;try{n=this.indexedDB.open(sA,1)}catch(s){
r(s);return}n.onupgradeneeded=()=>{const s=n.result;s.objectStoreNames.contains(kn)||s.createObjectStore(kn,{keyPath:"id"})},
n.onsuccess=()=>e(n.result),n.onerror=()=>r(n.error??new Error("Unable to open the local artifact database.")),n.onblocked=
()=>r(new Error("Opening the local artifact database was blocked."))}).then(e=>(this.database=e,e.onversionchange=()=>{e.
close(),this.database===e&&(this.database=null)},e)).catch(e=>(this.#c(e),null))),this.databasePromise)}#c(e){this.persistenceAvailable&&
(this.counters.persistenceFailures+=1),this.persistenceAvailable=!1;try{this.database?.close?.()}catch{}this.database=null}async#m(e){
const r=await this.#h();if(!r)return null;let n;try{const s=r.transaction(kn,"readonly"),i=lc(s);i.catch(()=>{});const o=s.
objectStore(kn).get(su(this.name,e));n=await nu(o),await i}catch(s){return this.#c(s),null}if(!n||n.cacheName!==this.name||
n.key!==e)return null;try{return{bytes:Qm(n.bytes),metadata:qo(n.metadata).metadata,storageBytes:Number(n.storageBytes)}}catch{
return{bytes:null,metadata:null,storageBytes:Number.NaN}}}async#d(e,r){const n=await this.#h();if(n)try{const s=n.transaction(
kn,"readwrite"),i=lc(s);i.catch(()=>{});const o=s.objectStore(kn);o.put({id:su(this.name,e),cacheName:this.name,key:e,bytes:r.
bytes.slice(),metadata:qo(r.metadata).metadata,storageBytes:r.storageBytes});const c=(await nu(o.getAll())).filter(d=>d?.
cacheName===this.name).sort((d,u)=>Number(d.metadata?.accessedAt??0)-Number(u.metadata?.accessedAt??0)||String(d.id).localeCompare(
String(u.id)));let l=c.reduce((d,u)=>{const h=Number(u.storageBytes);return d+(Number.isSafeInteger(h)&&h>=0?h:this.maximumBytes+
1)},0);for(;c.length>this.maximumEntries||l>this.maximumBytes;){const d=c.shift();if(!d)break;const u=Number(d.storageBytes);
l-=Number.isSafeInteger(u)&&u>=0?u:this.maximumBytes+1,o.delete(d.id)}await i}catch(s){this.#c(s)}}async#i(e){const r=await this.#h();
if(r)try{const n=r.transaction(kn,"readwrite"),s=lc(n);s.catch(()=>{}),n.objectStore(kn).delete(su(this.name,e)),await s}catch(n){
this.#c(n)}}async#o(){const e=await this.#h();if(e)try{const r=e.transaction(kn,"readwrite"),n=lc(r);n.catch(()=>{});const s=r.
objectStore(kn),i=await nu(s.getAll());for(const o of i)o?.cacheName===this.name&&s.delete(o.id);await n}catch(r){this.#c(
r)}}#n(e){if(!this.persistenceAvailable)return Promise.resolve();const r=this.persistenceQueue.then(e,e);return this.persistenceQueue=
r.catch(()=>{}),r}async#w(e,r){const n=e?.metadata;if(!e?.bytes||n?.schema!==Hm||e.bytes.byteLength>this.maximumEntryBytes||
!Number.isSafeInteger(e.storageBytes)||e.storageBytes!==e.bytes.byteLength||e.storageBytes>this.maximumBytes||!Number.isFinite(
n.byteLength)||n.byteLength!==e.bytes.byteLength||typeof n.sha256!="string"||typeof n.sourceId!="string"||typeof n.mediaType!=
"string"||!Number.isFinite(n.freshUntil)||!Number.isFinite(n.staleUntil)||n.staleUntil<n.freshUntil)throw gn(Error,"ERR_\
LOCAL_ARTIFACT_SCHEMA","Local artifact metadata is invalid.");if(await Jm(e.bytes)!==n.sha256)throw gn(Error,"ERR_LOCAL_\
ARTIFACT_INTEGRITY","Local artifact SHA-256 does not match its bytes.");if(r&&await r(e.bytes.slice(),Rf(n))===!1)throw gn(
Error,"ERR_LOCAL_ARTIFACT_VALIDATION","Local artifact validator rejected the bytes.");return e}async#s(e,{allowStale:r=!1,
validate:n,sourceId:s,mediaType:i}={}){let o=this.entries.get(e)??null,a=!1;if(o||(o=await this.#m(e),a=!!o),!o)return null;
try{if(s&&o.metadata.sourceId!==s)throw gn(Error,"ERR_LOCAL_ARTIFACT_SOURCE","Local artifact source identifier does not \
match.");if(i&&o.metadata.mediaType!==i)throw gn(Error,"ERR_LOCAL_ARTIFACT_MEDIA_TYPE","Local artifact media type does n\
ot match.");a&&await this.#w(o,n)}catch{return this.counters.validationFailures+=1,this.#r(e),await this.#n(()=>this.#i(
e)),null}const c=this.clock();if(c>o.metadata.staleUntil)return this.#r(e),await this.#n(()=>this.#i(e)),null;const l=c<
o.metadata.freshUntil;return!l&&!r?null:(a&&this.#f(e,o),this.entries.has(e)&&this.#t(e,o),this.#n(()=>this.#d(e,o)),{entry:o,
fresh:l})}async read(e,{validate:r,allowStale:n=!1,signal:s}={}){this.#e();const i=ru(e);if(r!==void 0&&typeof r!="funct\
ion")throw new TypeError("validate must be a function.");go(s);const o=await this.#s(i,{allowStale:n,validate:r});return go(
s),o?(o.fresh?this.counters.hits+=1:this.counters.stale+=1,cc(o.entry,o.fresh?"hit":"stale")):null}async#g({bytes:e,metadata:r={}},n){
const s=Qm(e);if(s.byteLength>this.maximumEntryBytes)throw this.counters.rejected+=1,gn(RangeError,"ERR_LOCAL_ARTIFACT_E\
NTRY_TOO_LARGE",`Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`);const{metadata:i}=qo(r),o=this.clock(),
a=ac(n.freshUntil,"freshUntil"),c=ac(n.staleUntil,"staleUntil");if(c<a)throw new RangeError("staleUntil must be greater \
than or equal to freshUntil.");const l=Number.isFinite(i.freshUntil)?i.freshUntil:a,d=Number.isFinite(i.staleUntil)?i.staleUntil:
c,u=Math.min(c,d),h=Math.min(a,l,u),p=await Jm(s),m={...i,schema:Hm,sourceId:n.sourceId,mediaType:n.mediaType,byteLength:s.
byteLength,sha256:p,createdAt:o,accessedAt:o,freshUntil:h,staleUntil:u},b=qo(m),g={bytes:s,metadata:b.metadata,storageBytes:s.
byteLength};if(n.validate)try{if(await n.validate(s.slice(),Rf(g.metadata))===!1)throw gn(Error,"ERR_LOCAL_ARTIFACT_VALI\
DATION","Local artifact validator rejected the bytes.")}catch(f){throw this.counters.validationFailures+=1,f}return g}#p(e,r,n){
go(r);const s={};return e.subscribers.add(s),n&&(this.counters.coalesced+=1),new Promise((i,o)=>{let a=!1;const c=()=>{a||
(a=!0,r?.removeEventListener?.("abort",l),e.subscribers.delete(s))},l=()=>{c(),!e.settled&&e.subscribers.size===0&&e.controller.
abort(),o(r.reason??Cf())};r?.addEventListener?.("abort",l,{once:!0}),e.promise.then(d=>{c(),i(n?Object.freeze({...d,cacheStatus:"\
coalesced"}):d)},d=>{c(),o(d)})})}async getOrLoad({key:e,sourceId:r,mediaType:n,freshUntil:s,staleUntil:i,signal:o,loader:a,
validate:c}={}){this.#e();const l=ru(e),d=w0(r,"sourceId"),u=dA(n);if(typeof a!="function")throw new TypeError("loader m\
ust be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("validate must be a function.");if(ac(s,"fr\
eshUntil"),ac(i,"staleUntil"),i<s)throw new RangeError("staleUntil must be greater than or equal to freshUntil.");go(o);
let h=this.inflight.get(l);if(h)return this.#p(h,o,!0);const p=await this.#s(l,{allowStale:!0,validate:c,sourceId:d,mediaType:u});
if(go(o),p?.fresh)return this.counters.hits+=1,cc(p.entry,"hit");if(h=this.inflight.get(l),h)return this.#p(h,o,!0);const m=this.#a(
l),b=this.generation,g=new AbortController,f={controller:g,subscribers:new Set,settled:!1,invalidated:!1,promise:null};let y=!1;
return f.promise=Promise.resolve().then(()=>a({signal:g.signal,maximumBytes:this.maximumEntryBytes})).then(E=>{if(g.signal.
aborted)throw g.signal.reason??Cf();const k=E&&typeof E=="object"&&"bytes"in E?E:{bytes:E,metadata:{}};return this.#g(k,
{sourceId:d,mediaType:u,freshUntil:s,staleUntil:i,validate:c})}).then(async E=>(this.#l(m),y=!0,!g.signal.aborted&&!f.invalidated&&
!this.destroyed&&b===this.generation&&(this.#f(l,E),this.entries.get(l)===E&&await this.#n(()=>this.#d(l,E))),this.counters.
misses+=1,cc(E,"miss"))).catch(E=>{if(p&&this.clock()<=p.entry.metadata.staleUntil)return this.counters.stale+=1,cc(p.entry,
"stale",{refreshErrorCode:typeof E?.code=="string"?E.code:"UPSTREAM_REFRESH_FAILED"});throw E}).finally(()=>{f.settled=!0,
y||this.#l(m),this.inflight.get(l)===f&&this.inflight.delete(l)}),this.inflight.set(l,f),this.#p(f,o,!1)}async delete(e){
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
0;try{this.database?.close?.()}catch{}this.database=null,this.onDestroy?.(this),this.onDestroy=null}}}function fA(t,e){if(t===
e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function hp(t){
if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return va(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return va(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function hA(t){return t?.buffer instanceof ArrayBuffer}function va(t){return hA(t)?t:t.slice()}function pA(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;for(var N=u.
repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.length-y)*h+
1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){for(var C=x-k;C!==
x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(f);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var mA=pA,gA=mA;let bA=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},yA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return v0(this,e)}},
wA=class{decoders;constructor(e){this.decoders=e}or(e){return v0(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function v0(t,e){return new wA({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let vA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new bA(e,r,n),this.decoder=new yA(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function E0({name:t,prefix:e,encode:r,decode:n}){return new vA(t,e,r,
n)}function gd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=gA(r,t,n);return E0({prefix:e,
name:t,encode:s,decode:o=>hp(i(o))})}function EA(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function kA(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function xA(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function ns({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=xA(n,s);return E0(
{prefix:e,name:t,encode(o){return kA(o,n,r)},decode(o){return EA(o,i,r,t)}})}const Dc=ns({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ns({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ns({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ns({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const iu=gd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});gd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Ss=gd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});gd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var SA=k0,Xm=128,AA=-128,IA=Math.pow(2,31);function k0(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=IA;)e[r++]=t&255|Xm,t/=128;for(;t&AA;)e[r++]=t&255|Xm,t>>>=7;return e[r]=t|0,k0.bytes=r-n+1,e}var _A=Tf,
CA=128,Ym=127;function Tf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Tf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&Ym)<<s:(o&Ym)*Math.pow(2,s),s+=7}while(o>=CA);return Tf.bytes=i-n,r}var RA=Math.pow(
2,7),TA=Math.pow(2,14),MA=Math.pow(2,21),BA=Math.pow(2,28),LA=Math.pow(2,35),DA=Math.pow(2,42),$A=Math.pow(2,49),NA=Math.
pow(2,56),PA=Math.pow(2,63),OA=function(t){return t<RA?1:t<TA?2:t<MA?3:t<BA?4:t<LA?5:t<DA?6:t<$A?7:t<NA?8:t<PA?9:10},UA={
encode:SA,decode:_A,encodingLength:OA},dl=UA;function Mf(t,e=0){const r=dl.decode(t,e),n=dl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function ul(t,e,r=0){return dl.encode(t,e,r),e}function fl(t){return dl.encodingLength(t)}function x0(t,e){const r=e.
byteLength,n=fl(t),s=n+fl(r),i=new Uint8Array(s+r);return ul(t,i,0),ul(r,i,n),i.set(e,s),new pp(t,r,e,i)}function FA(t){
const e=hp(t),[r,n]=Mf(e),[s,i]=Mf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new pp(r,s,o,e)}function zA(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&fA(t.bytes,r.bytes)}}let pp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
va(n),this.bytes=va(s)}};function Zm(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return jA(r,Bf(t),e??Ss.encoder);default:
return GA(r,Bf(t),e??Dc.encoder)}}const eg=new WeakMap;function Bf(t){const e=eg.get(t);if(e==null){const r=new Map;return eg.
set(t,r),r}return e}let Vi=class ir{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=va(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
bo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==WA)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return ir.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=x0(e,
r);return ir.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return ir.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&zA(e.multihash,n.multihash)}toString(e){return Zm(this,e)}toJSON(){return{"/":Zm(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof ir)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new ir(n,s,i,o??tg(n,s,i.bytes))}else if(r[HA]===!0){const{version:n,
multihash:s,code:i}=r,o=FA(s);return ir.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==bo)throw new Error(`Version 0 CID must use dag-pb (code: ${bo}) block encoding`);return new ir(e,r,n,n.bytes)}case 1:{
const s=tg(e,r,n.bytes);return new ir(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return ir.
create(0,bo,e)}static createV1(e,r){return ir.create(1,e,r)}static decode(e){const[r,n]=ir.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=ir.inspectBytes(e),n=r.size-r.multihashSize,
s=hp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new pp(r.multihashCode,r.digestSize,i,s);return[r.version===0?ir.createV0(o):ir.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=Mf(e.subarray(r));return r+=h,u};let s=n(),
i=bo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=qA(e,r),
i=ir.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Bf(
i).set(n,e),i}};function qA(t,e){switch(t[0]){case"Q":{const r=e??Ss;return[Ss.prefix,r.decode(`${Ss.prefix}${t}`)]}case Ss.
prefix:{const r=e??Ss;return[Ss.prefix,r.decode(t)]}case Dc.prefix:{const r=e??Dc;return[Dc.prefix,r.decode(t)]}case iu.
prefix:{const r=e??iu;return[iu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function jA(t,e,r){const{prefix:n}=r;if(n!==
Ss.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function GA(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const bo=112,WA=18;function tg(t,e,r){const n=fl(t),s=n+fl(e),i=new Uint8Array(s+r.
byteLength);return ul(t,i,0),ul(e,i,n),i.set(r,s),i}const HA=Symbol.for("@ipld/js-cid/CID"),VA=20;function KA({name:t,code:e,
encode:r,minDigestLength:n,maxDigestLength:s}){return new QA(t,e,r,n,s)}let QA=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){
this.name=e,this.code=r,this.encode=n,this.minDigestLength=s??VA,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){
if(r.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
rg(n,this.code,r?.truncate):n.then(s=>rg(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}};
function rg(t,e,r){if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${t.byteLength}`);t=t.subarray(0,r)}return x0(e,t)}function JA(t){return async e=>new Uint8Array(await crypto.
subtle.digest(t,e))}const ng=KA({name:"sha2-256",code:18,encode:JA("SHA-256")}),XA=t=>t/2**32|0,YA=t=>t>>>0;function ZA(t,e,r,n){
const s=XA(r),i=YA(r);t.setUint32(e,n?i:s,n),t.setUint32(e+4,n?s:i,n)}function sg(t){return t instanceof Uint8Array||ArrayBuffer.
isView(t)&&t.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in t&&t.BYTES_PER_ELEMENT===1}const e2=t=>t?`"${t}" `:"";
function mp(t,e,r=""){if(sg(t)&&e===void 0)return t;const n=sg(t),s="",i=n?`length=${t.length}`:`type=${typeof t}`,o=e2(
r)+"expected Uint8Array"+s+", got "+i;throw n?new RangeError(o):new TypeError(o)}const t2=(t,e)=>{if(t===null||typeof t!=
"object"||Array.isArray(t))throw new TypeError((e==="object"?"":`"${e}" `)+"expected object, got type="+typeof t)},ig=(t,e)=>{
t2(t,e);const r=Object.getPrototypeOf(t);if(r!==Object.prototype&&r!==null)throw new TypeError(`"${e}" expected plain ob\
ject`);if(Object.hasOwn(t,"__proto__"))throw new TypeError(`"${e}.__proto__" is not allowed`)};function og(t,e=!0){if(t.
destroyed)throw new Error("hash was destroyed");if(e&&t.finished)throw new Error("digest() was already called")}function r2(t,e){
mp(t,void 0,"output");const r=e.outputLen;if(!(t.length>=r))throw new RangeError('"output" expected length >= '+r)}function ag(...t){
for(let e=0;e<t.length;e++)t[e].fill(0)}function ou(t){return new DataView(t.buffer,t.byteOffset,t.byteLength)}function xn(t,e){
return t<<32-e|t>>>e}const n2=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",s2=Array.
from({length:256},(t,e)=>e.toString(16).padStart(2,"0"));function S0(t){if(mp(t),n2)return t.toHex();let e="";for(let r=0;r<
t.length;r++)e+=s2[t[r]];return e}function i2(t,e,r="opts"){return ig(t,"defaults"),e!==void 0&&ig(e,r),Object.assign(Object.
create(null),t,e)}function o2(t,e={}){if(typeof t!="function")throw new TypeError('"hashCons" expected function, got typ\
e='+typeof t);e=i2({},e,"info");const r=(s,i)=>t(i).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=
n.blockLen,r.canXOF=n.canXOF,r.create=s=>t(s),Object.assign(r,e),Object.freeze(r)}const a2=t=>({oid:Uint8Array.from([6,9,
96,134,72,1,101,3,4,2,t])});function c2(t,e,r){return t&e^~t&r}function l2(t,e,r){return t&e^t&r^e&r}let d2=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){
this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=ou(this.buffer)}update(e){
og(this),mp(e);const{view:r,buffer:n,blockLen:s}=this,i=e.length;let o=!1;for(let a=0;a<i;){const c=Math.min(s-this.pos,
i-a);if(c===s){const l=ou(e);for(;s<=i-a;a+=s)this.process(l,a);o=!0;continue}n.set(a===0&&c===i?e:e.subarray(a,a+c),this.
pos),this.pos+=c,a+=c,this.pos===s&&(this.process(r,0),this.pos=0,o=!0)}return this.length+=e.length,o&&this.roundClean(),
this}digestInto(e){og(this),r2(e,this),this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;r[o++]=
128,r.fill(0,o),this.padOffset>s-o&&(this.process(n,0),r.fill(0)),ZA(n,s-8,this.length*8,i),this.process(n,0),this.roundClean();
const a=e===r?n:ou(e),c=this.outputLen,l=c/4,d=this.get();if(c%4||l>d.length)throw new Error("invalid outputLen");for(let u=0;u<
l;u++)a.setUint32(4*u,d[u],i)}digest(){const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.
destroy(),n}_cloneIntoMeta(e){const{buffer:r,length:n,finished:s,destroyed:i,pos:o}=this;return e.destroyed=i,e.finished=
s,e.length=n,e.pos=o,o&&e.buffer.set(r),e}clone(){return this._cloneInto()}};const u2=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),f2=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),ls=new Uint32Array(64);let h2=class extends d2{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,r){super(64,e,
8,!1),this.A=r[0]|0,this.B=r[1]|0,this.C=r[2]|0,this.D=r[3]|0,this.E=r[4]|0,this.F=r[5]|0,this.G=r[6]|0,this.H=r[7]|0}get(){
const{A:e,B:r,C:n,D:s,E:i,F:o,G:a,H:c}=this;return[e,r,n,s,i,o,a,c]}set(e,r,n,s,i,o,a,c){this.A=e|0,this.B=r|0,this.C=n|
0,this.D=s|0,this.E=i|0,this.F=o|0,this.G=a|0,this.H=c|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),
this._cloneIntoMeta(e)}process(e,r){for(let u=0;u<16;u++,r+=4)ls[u]=e.getUint32(r,!1);for(let u=16;u<64;u++){const h=ls[u-
15],p=ls[u-2],m=xn(h,7)^xn(h,18)^h>>>3,b=xn(p,17)^xn(p,19)^p>>>10;ls[u]=b+ls[u-7]+m+ls[u-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:d}=this;for(let u=0;u<64;u++){const h=xn(a,6)^xn(a,11)^xn(a,25),p=d+h+c2(a,c,l)+f2[u]+ls[u]|0,b=(xn(n,2)^xn(n,13)^
xn(n,22))+l2(n,s,i)|0;d=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+b|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(n,s,i,o,a,c,l,d)}roundClean(){ag(ls)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),ag(this.buffer)}},p2=class extends h2{constructor(){super(32,u2)}};const Ea=o2(()=>new p2,a2(1));function m2(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
function gp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return ka(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return ka(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function g2(t){return t?.buffer instanceof ArrayBuffer}function ka(t){return g2(t)?t:t.slice()}function b2(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;for(var N=u.
repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.length-y)*h+
1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){for(var C=x-k;C!==
x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(f);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var y2=b2,w2=y2;let v2=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},E2=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return A0(this,e)}},
k2=class{decoders;constructor(e){this.decoders=e}or(e){return A0(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function A0(t,e){return new k2({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let x2=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new v2(e,r,n),this.decoder=new E2(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function I0({name:t,prefix:e,encode:r,decode:n}){return new x2(t,e,r,
n)}function bd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=w2(r,t,n);return I0({prefix:e,
name:t,encode:s,decode:o=>gp(i(o))})}function S2(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function A2(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function I2(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function ss({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=I2(n,s);return I0(
{prefix:e,name:t,encode(o){return A2(o,n,r)},decode(o){return S2(o,i,r,t)}})}const $c=ss({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});ss({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});ss({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});ss({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const au=bd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});bd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const As=bd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});bd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var _2=_0,cg=128,C2=-128,R2=Math.pow(2,31);function _0(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=R2;)e[r++]=t&255|cg,t/=128;for(;t&C2;)e[r++]=t&255|cg,t>>>=7;return e[r]=t|0,_0.bytes=r-n+1,e}var T2=Lf,
M2=128,lg=127;function Lf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Lf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&lg)<<s:(o&lg)*Math.pow(2,s),s+=7}while(o>=M2);return Lf.bytes=i-n,r}var B2=Math.pow(
2,7),L2=Math.pow(2,14),D2=Math.pow(2,21),$2=Math.pow(2,28),N2=Math.pow(2,35),P2=Math.pow(2,42),O2=Math.pow(2,49),U2=Math.
pow(2,56),F2=Math.pow(2,63),z2=function(t){return t<B2?1:t<L2?2:t<D2?3:t<$2?4:t<N2?5:t<P2?6:t<O2?7:t<U2?8:t<F2?9:10},q2={
encode:_2,decode:T2,encodingLength:z2},hl=q2;function Df(t,e=0){const r=hl.decode(t,e),n=hl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function pl(t,e,r=0){return hl.encode(t,e,r),e}function ml(t){return hl.encodingLength(t)}function j2(t,e){const r=e.
byteLength,n=ml(t),s=n+ml(r),i=new Uint8Array(s+r);return pl(t,i,0),pl(r,i,n),i.set(e,s),new bp(t,r,e,i)}function G2(t){
const e=gp(t),[r,n]=Df(e),[s,i]=Df(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new bp(r,s,o,e)}function W2(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&m2(t.bytes,r.bytes)}}let bp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
ka(n),this.bytes=ka(s)}};function dg(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return V2(r,$f(t),e??As.encoder);default:
return K2(r,$f(t),e??$c.encoder)}}const ug=new WeakMap;function $f(t){const e=ug.get(t);if(e==null){const r=new Map;return ug.
set(t,r),r}return e}let jo=class or{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=ka(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
yo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==Q2)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return or.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=j2(e,
r);return or.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return or.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&W2(e.multihash,n.multihash)}toString(e){return dg(this,e)}toJSON(){return{"/":dg(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof or)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new or(n,s,i,o??fg(n,s,i.bytes))}else if(r[J2]===!0){const{version:n,
multihash:s,code:i}=r,o=G2(s);return or.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==yo)throw new Error(`Version 0 CID must use dag-pb (code: ${yo}) block encoding`);return new or(e,r,n,n.bytes)}case 1:{
const s=fg(e,r,n.bytes);return new or(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return or.
create(0,yo,e)}static createV1(e,r){return or.create(1,e,r)}static decode(e){const[r,n]=or.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=or.inspectBytes(e),n=r.size-r.multihashSize,
s=gp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new bp(r.multihashCode,r.digestSize,i,s);return[r.version===0?or.createV0(o):or.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=Df(e.subarray(r));return r+=h,u};let s=n(),
i=yo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=H2(e,r),
i=or.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return $f(
i).set(n,e),i}};function H2(t,e){switch(t[0]){case"Q":{const r=e??As;return[As.prefix,r.decode(`${As.prefix}${t}`)]}case As.
prefix:{const r=e??As;return[As.prefix,r.decode(t)]}case $c.prefix:{const r=e??$c;return[$c.prefix,r.decode(t)]}case au.
prefix:{const r=e??au;return[au.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function V2(t,e,r){const{prefix:n}=r;if(n!==
As.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function K2(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const yo=112,Q2=18;function fg(t,e,r){const n=ml(t),s=n+ml(e),i=new Uint8Array(s+r.
byteLength);return pl(t,i,0),pl(e,i,n),i.set(r,s),i}const J2=Symbol.for("@ipld/js-cid/CID"),X2=new TextDecoder;function yp(t,e){
let r=0;for(let n=0;;n+=7){if(n>=64)throw new Error("protobuf: varint overflow");if(e>=t.length)throw new Error("protobu\
f: unexpected end of data");const s=t[e++];if(r+=n<28?(s&127)<<n:(s&127)*2**n,s<128)break}return[r,e]}function gl(t,e){let r;
[r,e]=yp(t,e);const n=e+r;if(r<0||n<0)throw new Error("protobuf: invalid length");if(n>t.length)throw new Error("protobu\
f: unexpected end of data");return[t.subarray(e,n),n]}function C0(t,e){let r;return[r,e]=yp(t,e),[r&7,r>>3,e]}function Y2(t){
const e={},r=t.length;let n=0;for(;n<r;){let s,i;if([s,i,n]=C0(t,n),i===1){if(e.Hash)throw new Error("protobuf: (PBLink)\
 duplicate Hash section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Hash`);if(e.Name!==void 0)
throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");if(e.Tsize!==void 0)throw new Error("protobu\
f: (PBLink) invalid order, found Tsize before Hash");[e.Hash,n]=gl(t,n)}else if(i===2){if(e.Name!==void 0)throw new Error(
"protobuf: (PBLink) duplicate Name section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Name`);
if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");let o;[o,n]=gl(t,n),e.Name=
X2.decode(o)}else if(i===3){if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) duplicate Tsize section");if(s!==0)throw new Error(
`protobuf: (PBLink) wrong wireType (${s}) for Tsize`);[e.Tsize,n]=yp(t,n)}else throw new Error(`protobuf: (PBLink) inval\
id fieldNumber, expected 1, 2 or 3, got ${i}`)}if(n>r)throw new Error("protobuf: (PBLink) unexpected end of data");return e}
function Z2(t){const e=t.length;let r=0,n,s=!1,i;for(;r<e;){let a,c;if([a,c,r]=C0(t,r),a!==2)throw new Error(`protobuf: \
(PBNode) invalid wireType, expected 2, got ${a}`);if(c===1){if(i)throw new Error("protobuf: (PBNode) duplicate Data sect\
ion");[i,r]=gl(t,r),n&&(s=!0)}else if(c===2){if(s)throw new Error("protobuf: (PBNode) duplicate Links section");n||(n=[]);
let l;[l,r]=gl(t,r),n.push(Y2(l))}else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${c}`)}
if(r>e)throw new Error("protobuf: (PBNode) unexpected end of data");const o={};return i&&(o.Data=i),o.Links=n||[],o}const R0=new TextEncoder,
hg=2**32,eI=2**31;function tI(t,e){let r=e.length;if(typeof t.Tsize=="number"){if(t.Tsize<0)throw new Error("Tsize canno\
t be negative");if(!Number.isSafeInteger(t.Tsize))throw new Error("Tsize too large for encoding");r=Xo(e,r,t.Tsize)-1,e[r]=
24}if(typeof t.Name=="string"){const n=R0.encode(t.Name);r-=n.length,e.set(n,r),r=Xo(e,r,n.length)-1,e[r]=18}return t.Hash&&
(r-=t.Hash.length,e.set(t.Hash,r),r=Xo(e,r,t.Hash.length)-1,e[r]=10),e.length-r}function pg(t,e,r){return t-=e.Data.length,
r.set(e.Data,t),t=Xo(r,t,e.Data.length)-1,r[t]=10,t}function rI(t,e){const r=sI(t),n=new Uint8Array(r);let s=r;const i=e?.
fieldOrder==="data-first"?e.fieldOrder:"links-first";if(t.Data&&i==="links-first"&&(s=pg(s,t,n)),t.Links)for(let o=t.Links.
length-1;o>=0;o--){const a=tI(t.Links[o],n.subarray(0,s));s-=a,s=Xo(n,s,a)-1,n[s]=18}return t.Data&&i==="data-first"&&(s=
pg(s,t,n)),n}function nI(t){let e=0;if(t.Hash){const r=t.Hash.length;e+=1+r+Ni(r)}if(typeof t.Name=="string"){const r=R0.
encode(t.Name).length;e+=1+r+Ni(r)}return typeof t.Tsize=="number"&&(e+=1+Ni(t.Tsize)),e}function sI(t){let e=0;if(t.Data){
const r=t.Data.length;e+=1+r+Ni(r)}if(t.Links)for(const r of t.Links){const n=nI(r);e+=1+n+Ni(n)}return e}function Xo(t,e,r){
e-=Ni(r);const n=e;for(;r>=eI;)t[e++]=r&127|128,r/=128;for(;r>=128;)t[e++]=r&127|128,r>>>=7;return t[e]=r,n}function Ni(t){
return t%2===0&&t++,Math.floor((iI(t)+6)/7)}function iI(t){let e=0;return t>=hg&&(t=Math.floor(t/hg),e=32),t>=65536&&(t>>>=
16,e+=16),t>=256&&(t>>>=8,e+=8),e+oI[t]}const oI=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],aI=["Data","Links"],cI=["Hash","Name",
"Tsize"],Nf=new TextEncoder;function T0(t,e){if(t===e)return 0;const r=t.Name?Nf.encode(t.Name):[],n=e.Name?Nf.encode(e.
Name):[];let s=r.length,i=n.length;for(let o=0,a=Math.min(s,i);o<a;++o)if(r[o]!==n[o]){s=r[o],i=n[o];break}return s<i?-1:
i<s?1:0}function mg(t,e){return!Object.keys(t).some(r=>!e.includes(r))}function M0(t){if(typeof t.asCID=="object"){const r=jo.
asCID(t);if(!r)throw new TypeError("Invalid DAG-PB form");return{Hash:r}}if(typeof t!="object"||Array.isArray(t))throw new TypeError(
"Invalid DAG-PB form");const e={};if(t.Hash){let r=jo.asCID(t.Hash);try{r||(typeof t.Hash=="string"?r=jo.parse(t.Hash):t.
Hash instanceof Uint8Array&&(r=jo.decode(t.Hash)))}catch(n){throw new TypeError(`Invalid DAG-PB form: ${n.message}`)}r&&
(e.Hash=r)}if(!e.Hash)throw new TypeError("Invalid DAG-PB form");return typeof t.Name=="string"&&(e.Name=t.Name),typeof t.
Tsize=="number"&&(e.Tsize=t.Tsize),e}function Bn(t){if((t instanceof Uint8Array||typeof t=="string")&&(t={Data:t}),typeof t!=
"object"||Array.isArray(t))throw new TypeError("Invalid DAG-PB form");const e={};if(t.Data!==void 0)if(typeof t.Data=="s\
tring")e.Data=Nf.encode(t.Data);else if(t.Data instanceof Uint8Array)e.Data=t.Data;else throw new TypeError("Invalid DAG\
-PB form");if(t.Links!==void 0)if(Array.isArray(t.Links))e.Links=t.Links.map(M0),e.Links.sort(T0);else throw new TypeError(
"Invalid DAG-PB form");else e.Links=[];return e}function B0(t){if(!t||typeof t!="object"||Array.isArray(t)||t instanceof
Uint8Array||t["/"]&&t["/"]===t.bytes)throw new TypeError("Invalid DAG-PB form");if(!mg(t,aI))throw new TypeError("Invali\
d DAG-PB form (extraneous properties)");if(t.Data!==void 0&&!(t.Data instanceof Uint8Array))throw new TypeError("Invalid\
 DAG-PB form (Data must be bytes)");if(!Array.isArray(t.Links))throw new TypeError("Invalid DAG-PB form (Links must be a\
 list)");for(let e=0;e<t.Links.length;e++){const r=t.Links[e];if(!r||typeof r!="object"||Array.isArray(r)||r instanceof Uint8Array||
r["/"]&&r["/"]===r.bytes)throw new TypeError("Invalid DAG-PB form (bad link)");if(!mg(r,cI))throw new TypeError("Invalid\
 DAG-PB form (extraneous properties on link)");if(r.Hash===void 0)throw new TypeError("Invalid DAG-PB form (link must ha\
ve a Hash)");if(r.Hash==null||!r.Hash["/"]||r.Hash["/"]!==r.Hash.bytes)throw new TypeError("Invalid DAG-PB form (link Ha\
sh must be a CID)");if(r.Name!==void 0&&typeof r.Name!="string")throw new TypeError("Invalid DAG-PB form (link Name must\
 be a string)");if(r.Tsize!==void 0){if(typeof r.Tsize!="number"||r.Tsize%1!==0)throw new TypeError("Invalid DAG-PB form\
 (link Tsize must be an integer)");if(r.Tsize<0)throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)")}
if(e>0&&T0(r,t.Links[e-1])===-1)throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")}}function lI(t,e=[]){
return Bn({Data:t,Links:e})}function dI(t,e,r){return M0({Hash:r,Name:t,Tsize:e})}function uI(t){return t instanceof ArrayBuffer?
new Uint8Array(t,0,t.byteLength):t}const fI="dag-pb",qa=112;function Ln(t,e){B0(t);const r={};return t.Links&&(r.Links=t.
Links.map(n=>{const s={};return n.Hash&&(s.Hash=n.Hash.bytes),n.Name!==void 0&&(s.Name=n.Name),n.Tsize!==void 0&&(s.Tsize=
n.Tsize),s})),t.Data&&(r.Data=t.Data),rI(r,e)}function xa(t){const e=uI(t),r=Z2(e),n={};return r.Data&&(n.Data=r.Data),r.
Links&&(n.Links=r.Links.map(s=>{const i={};try{i.Hash=jo.decode(s.Hash)}catch{}if(!i.Hash)throw new Error("Invalid Hash \
field found in link, expected CID");return s.Name!==void 0&&(i.Name=s.Name),s.Tsize!==void 0&&(i.Tsize=s.Tsize),i})),n}const L0=Object.
freeze(Object.defineProperty({__proto__:null,code:qa,createLink:dI,createNode:lI,decode:xa,encode:Ln,name:fI,prepare:Bn,
validate:B0},Symbol.toStringTag,{value:"Module"}));function hI(t){return t[Symbol.asyncIterator]!=null}function pI(t){if(hI(
t))return(async()=>{for await(const e of t)return e})();for(const e of t)return e}function mI(t){return t[Symbol.asyncIterator]!=
null}function D0(t,e=1){return e=Number(e),mI(t)?(async function*(){let r=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error(
"Batch size must be an integer");for await(const n of t)for(r.push(n);r.length>=e;)yield r.slice(0,e),r=r.slice(e);for(;r.
length>0;)yield r.slice(0,e),r=r.slice(e)})():(function*(){let r=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error("Bat\
ch size must be an integer");for(const n of t)for(r.push(n);r.length>=e;)yield r.slice(0,e),r=r.slice(e);for(;r.length>0;)
yield r.slice(0,e),r=r.slice(e)})()}async function*$0(t,e=1){for await(const r of D0(t,e)){const n=r.map(async s=>s().then(
i=>({ok:!0,value:i}),i=>({ok:!1,err:i})));for(let s=0;s<n.length;s++){const i=await n[s];if(i.ok)yield i.value;else throw i.
err}}}function ds(t=0){return new Uint8Array(t)}function bl(t=0){return new Uint8Array(t)}function gI(t){return t?.buffer instanceof
ArrayBuffer}function bI(t){if(gI(t))return t;const e=t.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function gg(t,e){
e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=bl(e);let n=0;for(const s of t)r.set(s,n),n+=s.length;return bI(r)}function yI(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
const N0=Symbol.for("@achingbrain/uint8arraylist");function bg(t,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let r=0;for(const n of t){const s=r+n.byteLength;if(e<s)return{buf:n,index:e-r};r=s}throw new RangeError("ind\
ex is out of bounds")}function dc(t){return!!t?.[N0]}let cu=class Nc{bufs;length;[N0]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let r=0;for(const n of e)if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.push(n);else if(dc(
n)){r+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=r}prepend(...e){this.prependAll(e)}prependAll(e){let r=0;for(const n of e.reverse())
if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.unshift(n);else if(dc(n))r+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=r}get(e){const r=bg(this.
bufs,e);return r.buf[r.index]}set(e,r){const n=bg(this.bufs,e);n.buf[n.index]=r}write(e,r=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(r+n,e[n]);else if(dc(e))for(let n=0;n<e.length;n++)this.set(r+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,r){const{bufs:n,length:s}=this._subList(e,r);return gg(n,s)}subarray(e,r){const{bufs:n,length:s}=this.
_subList(e,r);return n.length===1?n[0]:gg(n,s)}sublist(e,r){const{bufs:n,length:s}=this._subList(e,r),i=new Nc;return i.
length=s,i.bufs=n,i}_subList(e,r){if(e=e??0,r=r??this.length,e<0&&(e=this.length+e),r<0&&(r=this.length+r),e<0||r>this.length)
throw new RangeError("index is out of bounds");if(e===r)return{bufs:[],length:0};if(e===0&&r===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,d=r>a&&r<=c;if(l&&d){if(e===a&&r===c){n.push(o);break}const u=e-a;n.push(
o.subarray(u,u+(r-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(d){if(r===c){n.push(
o);break}n.push(o.subarray(0,r-a));break}n.push(o)}return{bufs:n,length:r-e}}indexOf(e,r=0){if(!dc(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(r=Number(r??0),isNaN(r)&&(r=0),r<0&&(r=this.length+r),r<0&&(r=0),e.length===0)return r>this.length?this.length:r;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let u=0;u<
i;u++)o[u]=-1;for(let u=0;u<s;u++)o[n[u]]=u;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let d;for(let u=r;u<=
c;u+=d){d=0;for(let h=l;h>=0;h--){const p=this.get(u+h);if(n[h]!==p){d=Math.max(1,h-a[p]);break}}if(d===0)return u}return-1}getInt8(e){
const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt8(0)}setInt8(e,r){const n=bl(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,r),this.write(n,e)}getInt16(e,r){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,r)}setInt16(e,r,n){const s=ds(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,r,n),this.write(s,e)}getInt32(e,r){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,r)}setInt32(e,r,n){const s=ds(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,r,n),this.write(s,e)}getBigInt64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,r)}setBigInt64(e,r,n){const s=ds(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,r,n),this.write(s,e)}getUint8(e){const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint8(0)}setUint8(e,r){const n=bl(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,r),this.write(n,e)}getUint16(e,r){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,r)}setUint16(e,r,n){const s=ds(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,r,n),this.write(s,e)}getUint32(e,r){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,r)}setUint32(e,r,n){const s=ds(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,r,n),this.write(s,e)}getBigUint64(e,r){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,r)}setBigUint64(e,r,n){const s=ds(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,r,n),this.write(s,e)}getFloat32(e,r){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,r)}setFloat32(e,r,n){const s=ds(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,r,n),this.write(s,e)}getFloat64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,r)}setFloat64(e,r,n){const s=ds(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,r,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Nc)||e.bufs.length!==this.bufs.length)return!1;for(let r=0;r<
this.bufs.length;r++)if(!yI(this.bufs[r],e.bufs[r]))return!1;return!0}static fromUint8Arrays(e,r){const n=new Nc;return n.
bufs=e,r==null&&(r=e.reduce((s,i)=>s+i.byteLength,0)),n.length=r,n}};const P0=1,O0=BigInt(34),U0=8,F0=262144,wI="links-b\
ytes",z0=262144,vI=1048576,EI=50,kI=10,xI=!0,SI=!0,AI=!1,II="file",_I="links-first",q0=(t={})=>{const e=t.chunkSize??z0;
return async function*(n){let s=new cu,i=0,o=!1;for await(const a of n)for(s.append(a),i+=a.length;i>=e;)if(yield s.subarray(
0,e),o=!0,e===s.length)s=new cu,i=0;else{const l=new cu;l.append(s.sublist(e)),s=l,i-=e}(!o||i>0)&&(yield s.subarray(0,i))}};
function CI(t){return t.buffer instanceof ArrayBuffer}function j0(t){return CI(t)?t:t.slice()}class Sa extends Error{static name="\
InvalidTypeError";static code="ERR_INVALID_TYPE";name=Sa.name;code=Sa.code;constructor(e="Invalid type"){super(e)}}function yl(t=0){
return new Uint8Array(t)}const RI=Math.pow(2,7),TI=Math.pow(2,14),MI=Math.pow(2,21),G0=Math.pow(2,28),W0=Math.pow(2,35),
H0=Math.pow(2,42),V0=Math.pow(2,49),Sr=128,us=127;function wp(t){if(t<RI)return 1;if(t<TI)return 2;if(t<MI)return 3;if(t<
G0)return 4;if(t<W0)return 5;if(t<H0)return 6;if(t<V0)return 7;if(Number.MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function BI(t,e,r=0){switch(wp(t)){case 8:e[r++]=t&255|Sr,t/=128;case 7:
e[r++]=t&255|Sr,t/=128;case 6:e[r++]=t&255|Sr,t/=128;case 5:e[r++]=t&255|Sr,t/=128;case 4:e[r++]=t&255|Sr,t>>>=7;case 3:
e[r++]=t&255|Sr,t>>>=7;case 2:e[r++]=t&255|Sr,t>>>=7;case 1:{e[r++]=t&255,t>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function LI(t,e){let r=t[e],n=0;if(n+=r&us,r<Sr||(r=t[e+1],n+=(r&us)<<7,r<Sr)||(r=t[e+2],n+=(r&us)<<14,r<
Sr)||(r=t[e+3],n+=(r&us)<<21,r<Sr)||(r=t[e+4],n+=(r&us)*G0,r<Sr)||(r=t[e+5],n+=(r&us)*W0,r<Sr)||(r=t[e+6],n+=(r&us)*H0,r<
Sr)||(r=t[e+7],n+=(r&us)*V0,r<Sr))return n;throw new RangeError("Could not decode varint")}const vp=new Float32Array([-0]),
Ms=new Uint8Array(vp.buffer);function DI(t,e,r){vp[0]=t,e[r]=Ms[0],e[r+1]=Ms[1],e[r+2]=Ms[2],e[r+3]=Ms[3]}function $I(t,e){
return Ms[0]=t[e],Ms[1]=t[e+1],Ms[2]=t[e+2],Ms[3]=t[e+3],vp[0]}const Ep=new Float64Array([-0]),fr=new Uint8Array(Ep.buffer);
function NI(t,e,r){Ep[0]=t,e[r]=fr[0],e[r+1]=fr[1],e[r+2]=fr[2],e[r+3]=fr[3],e[r+4]=fr[4],e[r+5]=fr[5],e[r+6]=fr[6],e[r+
7]=fr[7]}function PI(t,e){return fr[0]=t[e],fr[1]=t[e+1],fr[2]=t[e+2],fr[3]=t[e+3],fr[4]=t[e+4],fr[5]=t[e+5],fr[6]=t[e+6],
fr[7]=t[e+7],Ep[0]}const OI=BigInt(Number.MAX_SAFE_INTEGER),UI=BigInt(Number.MIN_SAFE_INTEGER);class mr{lo;hi;constructor(e,r){
this.lo=e>>>0,this.hi=r>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&
(n=n+1>>>0),-(r+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const r=~this.lo+1>>>0;let n=~this.hi>>>0;return r===0&&(n=n+1>>>0),-(BigInt(r)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,r=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?r===0?e<16384?e<128?1:2:e<2097152?3:4:r<16384?r<128?5:6:r<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return Ys;if(e<OI&&e>UI)return this.fromNumber(Number(e));const r=e<0n;r&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return r&&(n=~n|0n,s=~s|0n,++s>yg&&(s=0n,++n>yg&&(n=0n))),new mr(Number(s),Number(n))}static fromNumber(e){
if(e===0)return Ys;const r=e<0;r&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return r&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new mr(n,s)}static from(e){return typeof e=="number"?mr.fromNumber(e):typeof e=="bigint"?mr.
fromBigInt(e):typeof e=="string"?mr.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new mr(e.low>>>0,e.high>>>0):Ys}}const Ys=new mr(
0,0);Ys.toBigInt=function(){return 0n};Ys.zzEncode=Ys.zzDecode=function(){return this};Ys.length=function(){return 1};const yg=4294967296n;
function FI(t){let e=0,r=0;for(let n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:(r&64512)===55296&&(t.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function zI(t,e,r){if(r-e<1)return"";let s;const i=[];let o=0,a;for(;e<r;)a=
t[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|t[e++]&63:a>239&&a<365?(a=((a&7)<<18|(t[e++]&63)<<12|(t[e++]&63)<<6|
t[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(t[e++]&63)<<6|t[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function K0(t,e,r){const n=r;let s,i;for(let o=0;o<t.length;++o)
s=t.charCodeAt(o),s<128?e[r++]=s:s<2048?(e[r++]=s>>6|192,e[r++]=s&63|128):(s&64512)===55296&&((i=t.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[r++]=s>>18|240,e[r++]=s>>12&63|128,e[r++]=s>>6&63|128,e[r++]=s&63|128):(e[r++]=
s>>12|224,e[r++]=s>>6&63|128,e[r++]=s&63|128);return r-n}function fn(t,e){return RangeError(`index out of range: ${t.pos}\
 + ${e??1} > ${t.len}`)}function uc(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}class qI{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=j0(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,fn(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw fn(this,4);return uc(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw fn(
this,4);return uc(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw fn(this,4);const e=$I(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw fn(this,4);const e=PI(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),r=this.pos,n=this.pos+e;if(n>this.len)throw fn(this,e);return this.pos+=e,r===n?new Uint8Array(0):
this.buf.subarray(r,n)}string(){const e=this.bytes();return zI(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw fn(this,e);this.pos+=e}else do if(this.pos>=this.len)throw fn(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new mr(0,0);let r=0;if(this.len-this.pos>4){
for(;r<4;++r)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;r=0}else{for(;r<3;++r){
if(this.pos>=this.len)throw fn(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<r*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<r*7)>>>0,e}if(this.len-this.pos>4){for(;r<5;++r)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;r<5;++r){if(this.pos>=this.len)throw fn(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<r*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw fn(this,8);const e=uc(this.buf,this.pos+=4),r=uc(this.buf,this.pos+=4);return new mr(e,r)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=LI(this.buf,this.pos);
return this.pos+=wp(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Q0(t){return new qI(t instanceof Uint8Array?t:
t.subarray())}function ro(t,e,r){const n=Q0(t);return e.decode(n,void 0,r)}function Pf(t){if(t instanceof Uint8Array&&t.
constructor.name==="Uint8Array")return vg(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(
t))return vg(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function jI(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const wg=4096;function GI(t){const e=t.
length;if(e<=wg)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=wg));return r}function WI(t){return t?.buffer instanceof ArrayBuffer}function vg(t){return WI(t)?t:t.slice()}
function HI(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var d=t.length,u=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=
256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;
for(var N=u.repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.
length-y)*h+1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){
for(var C=x-k;C!==x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(
f);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var VI=HI,KI=VI;let QI=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},JI=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return J0(this,e)}},
XI=class{decoders;constructor(e){this.decoders=e}or(e){return J0(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function J0(t,e){return new XI({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let YI=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new QI(e,r,n),this.decoder=new JI(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function yd({name:t,prefix:e,encode:r,decode:n}){return new YI(t,e,r,
n)}function ja({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=KI(r,t,n);return yd({prefix:e,
name:t,encode:s,decode:o=>Pf(i(o))})}function ZI(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function e_(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function t_(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Xt({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=t_(n,s);return yd(
{prefix:e,name:t,encode(o){return e_(o,n,r)},decode(o){return ZI(o,i,r,t)}})}const r_=ja({prefix:"9",name:"base10",alphabet:"\
0123456789"}),n_=Object.freeze(Object.defineProperty({__proto__:null,base10:r_},Symbol.toStringTag,{value:"Module"})),s_=Xt(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),i_=Xt({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),o_=Object.freeze(Object.defineProperty({__proto__:null,
base16:s_,base16upper:i_},Symbol.toStringTag,{value:"Module"})),a_=Xt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
c_=Object.freeze(Object.defineProperty({__proto__:null,base2:a_},Symbol.toStringTag,{value:"Module"})),X0=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),l_=X0.reduce((t,e,r)=>(t[r]=e,t),[]),d_=X0.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function u_(t){return t.reduce((e,r)=>(e+=l_[r],e),"")}function f_(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=d_[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const h_=yd({prefix:"🚀",name:"\
base256emoji",encode:u_,decode:f_}),p_=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:h_},Symbol.toStringTag,
{value:"Module"})),m_=Xt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
g_=Xt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),b_=Xt(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),y_=Xt({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),w_=Xt({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),v_=Xt({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),E_=Xt({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),k_=Xt({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),x_=Xt({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),S_=Object.freeze(Object.defineProperty({__proto__:null,
base32:m_,base32hex:w_,base32hexpad:E_,base32hexpadupper:k_,base32hexupper:v_,base32pad:b_,base32padupper:y_,base32upper:g_,
base32z:x_},Symbol.toStringTag,{value:"Module"})),A_=ja({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),I_=ja({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
__=Object.freeze(Object.defineProperty({__proto__:null,base36:A_,base36upper:I_},Symbol.toStringTag,{value:"Module"})),C_=ja(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),R_=ja({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),T_=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:C_,base58flickr:R_},Symbol.toStringTag,{value:"Module"})),M_=Xt({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),B_=Xt({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),L_=Xt({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),D_=Xt({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),$_=Object.freeze(Object.defineProperty(
{__proto__:null,base64:M_,base64pad:B_,base64url:L_,base64urlpad:D_},Symbol.toStringTag,{value:"Module"})),N_=Xt({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),P_=Object.freeze(Object.defineProperty({__proto__:null,base8:N_},Symbol.
toStringTag,{value:"Module"})),O_=yd({prefix:"\0",name:"identity",encode:t=>GI(Pf(t)),decode:t=>Pf(jI(t))}),U_=Object.freeze(
Object.defineProperty({__proto__:null,identity:O_},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Eg={...U_,...c_,...P_,...n_,...o_,...S_,...__,...T_,...$_,...p_};function Y0(t,e,r,n){return{name:t,prefix:e,encoder:{
name:t,prefix:e,encode:r},decoder:{decode:n}}}const kg=Y0("utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().
encode(t.substring(1))),lu=Y0("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},
t=>{t=t.substring(1);const e=yl(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}),F_={utf8:kg,"utf-8":kg,
hex:Eg.base16,latin1:lu,ascii:lu,binary:lu,...Eg};function z_(t,e="utf8"){const r=F_[e];if(r==null)throw new Error(`Unsu\
pported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}function q_(t){let n,s=8192;return function(o){if(o<
1||o>4096)return yl(o);s+o>8192&&(n=yl(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Go{fn;len;next;val;constructor(e,r,n){
this.fn=e,this.len=r,this.next=void 0,this.val=n}}function du(){}class j_{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const G_=q_();function W_(t){return globalThis.Buffer!=null?yl(
t):G_(t)}class Of{len;head;tail;states;constructor(){this.len=0,this.head=new Go(du,0,0),this.tail=this.head,this.states=
null}_push(e,r,n){return this.tail=this.tail.next=new Go(e,r,n),this.len+=r,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new V_((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(fc,10,
mr.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const r=mr.fromBigInt(e);return this.
_push(fc,r.length(),r)}uint64Number(e){return this._push(BI,wp(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const r=mr.
fromBigInt(e).zzEncode();return this._push(fc,r.length(),r)}sint64Number(e){const r=mr.fromNumber(e).zzEncode();return this.
_push(fc,r.length(),r)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(uu,1,e?1:0)}fixed32(e){return this.
_push(wo,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const r=mr.fromBigInt(e);return this._push(wo,4,r.lo)._push(
wo,4,r.hi)}fixed64Number(e){const r=mr.fromNumber(e);return this._push(wo,4,r.lo)._push(wo,4,r.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(DI,4,e)}double(e){return this._push(NI,8,e)}bytes(e){const r=e.length>>>0;return r===
0?this._push(uu,1,0):this.uint32(r)._push(K_,r,e)}string(e){const r=FI(e);return r!==0?this.uint32(r)._push(K0,r,e):this.
_push(uu,1,0)}fork(){return this.states=new j_(this),this.head=this.tail=new Go(du,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Go(du,0,0),this.len=0),this}ldelim(){const e=this.head,r=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=r,this.len+=n),this}finish(){let e=this.head.next;const r=W_(this.len);
let n=0;for(;e!=null;)e.fn(e.val,r,n),n+=e.len,e=e.next;return r}}function uu(t,e,r){e[r]=t&255}function H_(t,e,r){for(;t>
127;)e[r++]=t&127|128,t>>>=7;e[r]=t}class V_ extends Go{next;constructor(e,r){super(H_,e,r),this.next=void 0}}function fc(t,e,r){
for(;t.hi!==0;)e[r++]=t.lo&127|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=t.lo&127|128,t.lo=t.lo>>>
7;e[r++]=t.lo}function wo(t,e,r){e[r]=t&255,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function K_(t,e,r){e.set(t,
r)}globalThis.Buffer!=null&&(Of.prototype.bytes=function(t){const e=t.length>>>0;return this.uint32(e),e>0&&this._push(Q_,
e,t),this},Of.prototype.string=function(t){const e=globalThis.Buffer.byteLength(t);return this.uint32(e),e>0&&this._push(
J_,e,t),this});function Q_(t,e,r){e.set(t,r)}function J_(t,e,r){t.length<40?K0(t,e,r):e.utf8Write!=null?e.utf8Write(t,r):
e.set(z_(t),r)}function X_(){return new Of}function no(t,e){const r=X_();return e.encode(t,r,{lengthDelimited:!1}),r.finish()}
function*so(t,e,r){const n=Q0(t);yield*e.stream(n,void 0,".",r)}const Z0={VARINT:0,LENGTH_DELIMITED:2};function ev(t,e,r,n,s){
return{name:t,type:e,encode:r,decode:n,stream:s}}function Y_(t){function e(i){if(t[i.toString()]==null)throw new Error("\
Invalid enum value");return t[i]}const r=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return ev("enum",Z0.VARINT,r,n,s)}function io(t,e,r){return ev("message",Z0.LENGTH_DELIMITED,t,e,
r)}class Ki extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var hr;(function(t){(function(o){o.RAW="RAW",o.DIRECTORY=
"DIRECTORY",o.FILE="FILE",o.METADATA="METADATA",o.SYMLINK="SYMLINK",o.HAMT_SHARD="HAMT_SHARD"})(t.Type||(t.Type={}));let e;
(function(o){o[o.RAW=0]="RAW",o[o.DIRECTORY=1]="DIRECTORY",o[o.FILE=2]="FILE",o[o.METADATA=3]="METADATA",o[o.SYMLINK=4]=
"SYMLINK",o[o.HAMT_SHARD=5]="HAMT_SHARD"})(e||(e={})),(function(o){o.codec=()=>Y_(e)})(t.Type||(t.Type={}));let r;t.codec=
()=>(r==null&&(r=io((o,a,c={})=>{if(c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),t.Type.codec().encode(o.
type,a)),o.data!=null&&(a.uint32(18),a.bytes(o.data)),o.fileSize!=null&&(a.uint32(24),a.uint64(o.fileSize)),o.blockSizes!=
null&&o.blockSizes.length>0)for(const l of o.blockSizes)a.uint32(32),a.uint64(l);o.hashType!=null&&(a.uint32(40),a.uint64(
o.hashType)),o.fanOut!=null&&(a.uint32(48),a.uint64(o.fanOut)),o.mode!=null&&(a.uint32(56),a.uint32(o.mode)),o.mtime!=null&&
(a.uint32(66),Yo.codec().encode(o.mtime,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={blockSizes:[]},d=a==
null?o.len:o.pos+a;for(;o.pos<d;){const u=o.uint32();switch(u>>>3){case 1:{l.type=t.Type.codec().decode(o);break}case 2:{
l.data=o.bytes();break}case 3:{l.fileSize=o.uint64();break}case 4:{if(c.limits?.blockSizes!=null&&l.blockSizes.length===
c.limits.blockSizes)throw new Ki('Decode error - repeated field "blockSizes" had too many elements');l.blockSizes.push(o.
uint64());break}case 5:{l.hashType=o.uint64();break}case 6:{l.fanOut=o.uint64();break}case 7:{l.mode=o.uint32();break}case 8:{
l.mtime=Yo.codec().decode(o,o.uint32(),{limits:c.limits?.mtime});break}default:{o.skipType(u&7);break}}}return l},function*(o,a,c,l={}){
const d={blockSizes:0},u=a==null?o.len:o.pos+a;for(c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-1):c,type:"\
start",message:"UnixFS"});o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{yield{field:`${c}type`,value:t.Type.codec().
decode(o)};break}case 2:{yield{field:`${c}data`,value:o.bytes()};break}case 3:{yield{field:`${c}fileSize`,value:o.uint64()};
break}case 4:{if(l.limits?.blockSizes!=null&&d.blockSizes===l.limits.blockSizes)throw new Ki('Streaming decode error - r\
epeated field "blockSizes" had too many elements');yield{field:`${c}blockSizes[]`,index:d.blockSizes,value:o.uint64()},d.
blockSizes++;break}case 5:{yield{field:`${c}hashType`,value:o.uint64()};break}case 6:{yield{field:`${c}fanOut`,value:o.uint64()};
break}case 7:{yield{field:`${c}mode`,value:o.uint32()};break}case 8:{yield*Yo.codec().stream(o,o.uint32(),`${c}mtime.`,{
limits:l.limits?.mtime});break}default:{o.skipType(h&7);break}}}c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-
1):c,type:"end",message:"UnixFS"})})),r);function n(o){return no(o,t.codec())}t.encode=n;function s(o,a){return ro(o,t.codec(),
a)}t.decode=s;function i(o,a){return so(o,t.codec(),a)}t.stream=i})(hr||(hr={}));var Yo;(function(t){let e;t.codec=()=>(e==
null&&(e=io((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.seconds!=null&&(o.uint32(8),o.int64(i.seconds)),i.fractionalNanoseconds!=
null&&(o.uint32(21),o.fixed32(i.fractionalNanoseconds)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?
i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.seconds=i.int64();break}case 2:{a.fractionalNanoseconds=
i.fixed32();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"UnixTime"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}seconds`,value:i.int64()};break}case 2:{yield{field:`${a}fractionalNanoseconds`,value:i.
fixed32()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"UnixTime"})})),e);function r(i){return no(i,t.codec())}t.encode=r;function n(i,o){return ro(i,t.codec(),o)}
t.decode=n;function s(i,o){return so(i,t.codec(),o)}t.stream=s})(Yo||(Yo={}));var xg;(function(t){let e;t.codec=()=>(e==
null&&(e=io((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.mimeType!=null&&(o.uint32(10),o.string(i.mimeType)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.mimeType=
i.string();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Metadata"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}mimeType`,value:i.string()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Metadata"})})),e);function r(i){return no(i,t.codec())}
t.encode=r;function n(i,o){return ro(i,t.codec(),o)}t.decode=n;function s(i,o){return so(i,t.codec(),o)}t.stream=s})(xg||
(xg={}));var Ls;(function(t){let e;t.codec=()=>(e==null&&(e=io((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.hash!=null&&
(o.uint32(10),o.bytes(i.hash)),i.name!=null&&(o.uint32(18),o.string(i.name)),i.tSize!=null&&(o.uint32(24),o.uint64(i.tSize)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{a.hash=i.bytes();break}case 2:{a.name=i.string();break}case 3:{a.tSize=i.uint64();break}default:{i.skipType(l&
7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"Link"});i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{yield{field:`${a}hash`,
value:i.bytes()};break}case 2:{yield{field:`${a}name`,value:i.string()};break}case 3:{yield{field:`${a}tSize`,value:i.uint64()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Link"})})),e);function r(i){return no(i,t.codec())}t.encode=r;function n(i,o){return ro(i,t.codec(),o)}t.decode=n;function s(i,o){
return so(i,t.codec(),o)}t.stream=s})(Ls||(Ls={}));var Aa;(function(t){let e;t.codec=()=>(e==null&&(e=io((i,o,a={})=>{if(a.
lengthDelimited!==!1&&o.fork(),i.data!=null&&(o.uint32(10),hr.codec().encode(i.data,o)),i.links!=null&&i.links.length>0)
for(const c of i.links)o.uint32(18),Ls.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const d=i.uint32();switch(d>>>3){case 1:{c.data=hr.codec().decode(i,i.uint32(),{limits:a.
limits?.data});break}case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Ki('Decode error - repe\
ated field "links" had too many elements');c.links.push(Ls.codec().decode(i,i.uint32(),{limits:a.limits?.links$}));break}default:{
i.skipType(d&7);break}}}return c},function*(i,o,a,c={}){const l={links:0},d=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.
endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Node"});i.pos<d;){const u=i.uint32();switch(u>>>3){case 1:{
yield*hr.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}case 2:{if(c.limits?.links!=null&&l.links===
c.limits.links)throw new Ki('Streaming decode error - repeated field "links" had too many elements');for(const h of Ls.codec().
stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}default:{i.skipType(
u&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Node"})})),e);function r(i){
return no(i,t.codec())}t.encode=r;function n(i,o){return ro(i,t.codec(),o)}t.decode=n;function s(i,o){return so(i,t.codec(),
o)}t.stream=s})(Aa||(Aa={}));var Sg;(function(t){let e;t.codec=()=>(e==null&&(e=io((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.links!=null&&i.links.length>0)for(const c of i.links)o.uint32(18),Ls.codec().encode(c,o);i.data!=null&&(o.uint32(
10),hr.codec().encode(i.data,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},l=o==null?i.len:i.pos+
o;for(;i.pos<l;){const d=i.uint32();switch(d>>>3){case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new Ki(
'Decode error - repeated field "links" had too many elements');c.links.push(Ls.codec().decode(i,i.uint32(),{limits:a.limits?.
links$}));break}case 1:{c.data=hr.codec().decode(i,i.uint32(),{limits:a.limits?.data});break}default:{i.skipType(d&7);break}}}
return c},function*(i,o,a,c={}){const l={links:0},d=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"LegacyNode"});i.pos<d;){const u=i.uint32();switch(u>>>3){case 2:{if(c.limits?.links!=
null&&l.links===c.limits.links)throw new Ki('Streaming decode error - repeated field "links" had too many elements');for(const h of Ls.
codec().stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...h,index:l.links};l.links++;break}case 1:{
yield*hr.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}default:{i.skipType(u&7);break}}}a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"LegacyNode"})})),e);function r(i){return no(
i,t.codec())}t.encode=r;function n(i,o){return ro(i,t.codec(),o)}t.decode=n;function s(i,o){return so(i,t.codec(),o)}t.stream=
s})(Sg||(Sg={}));const Ag={RAW:"raw",DIRECTORY:"directory",FILE:"file",METADATA:"metadata",SYMLINK:"symlink",HAMT_SHARD:"\
hamt-sharded-directory"},Z_=["directory","hamt-sharded-directory"],Ig=parseInt("0644",8),_g=parseInt("0755",8);class Lr{static unmarshal(e){
const r=hr.decode(e),n=new Lr({type:Ag[r.type!=null?r.type.toString():"FILE"],data:r.data,blockSizes:r.blockSizes,mode:r.
mode,mtime:r.mtime!=null?{secs:r.mtime.seconds??0n,nsecs:r.mtime.fractionalNanoseconds}:void 0,fanout:r.fanOut});return n.
_originalMode=r.mode??0,n}type;data;blockSizes;hashType;fanout;mtime;_mode;_originalMode;constructor(e={type:"file"}){const{
type:r,data:n,blockSizes:s,hashType:i,fanout:o,mtime:a,mode:c}=e;if(r!=null&&!Object.values(Ag).includes(r))throw new Sa(
"Type: "+r+" is not valid");this.type=r??"file",this.hashType=i,this.fanout=o,this.blockSizes=s??[],this._originalMode=0,
this.mode=c,this.mtime=a,n!=null&&(this.data=j0(n))}set mode(e){e==null?this._mode=this.isDirectory()?_g:Ig:this._mode=e&
4095}get mode(){return this._mode}isDirectory(){return Z_.includes(this.type)}addBlockSize(e){this.blockSizes.push(e)}removeBlockSize(e){
this.blockSizes.splice(e,1)}fileSize(){if(this.isDirectory())return 0n;let e=0n;return this.blockSizes.forEach(r=>{e+=r}),
this.data!=null&&(e+=BigInt(this.data.length)),e}marshal(){let e;switch(this.type){case"raw":e=hr.Type.RAW;break;case"di\
rectory":e=hr.Type.DIRECTORY;break;case"file":e=hr.Type.FILE;break;case"metadata":e=hr.Type.METADATA;break;case"symlink":
e=hr.Type.SYMLINK;break;case"hamt-sharded-directory":e=hr.Type.HAMT_SHARD;break;default:throw new Sa(`Type: ${e} is not \
valid`)}let r=this.data;(this.data==null||this.data.length===0)&&(r=void 0);let n;this.mode!=null&&(n=this._originalMode&
4294963200|(this.mode??0),n===Ig&&!this.isDirectory()&&(n=void 0),n===_g&&this.isDirectory()&&(n=void 0));let s;return this.
mtime!=null&&(s={seconds:this.mtime.secs,fractionalNanoseconds:this.mtime.nsecs}),hr.encode({type:e,data:r,fileSize:this.
type==="file"||this.type==="raw"?this.fileSize():void 0,blockSizes:this.blockSizes,hashType:this.hashType,fanOut:this.fanout,
mode:n,mtime:s})}}function eC(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)
if(t[r]!==e[r])return!1;return!0}function oi(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Ia(
t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Ia(new Uint8Array(t.buffer,t.byteOffset,
t.byteLength));throw new Error("Unknown type, must be binary type")}function tC(t){const e=new Uint8Array(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}const Cg=4096;function rC(t){const e=t.length;if(e<=Cg)return String.fromCharCode.
apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Cg));return r}function nC(t){
return t?.buffer instanceof ArrayBuffer}function Ia(t){return nC(t)?t:t.slice()}const sC="raw",Uf=85;function iC(t){return oi(
t)}function oC(t){return oi(t)}const aC=Object.freeze(Object.defineProperty({__proto__:null,code:Uf,decode:oC,encode:iC,
name:sC},Symbol.toStringTag,{value:"Module"}));class Dn extends Event{type;detail;constructor(e,r){super(e),this.type=e,
this.detail=r}}function cC(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-
E;R!==S&&v[R]===0;)R++;for(var N=u.repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.
length-y)*h+1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){
for(var C=x-k;C!==x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(
f);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var lC=cC,dC=lC;let uC=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},fC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return tv(this,e)}},
hC=class{decoders;constructor(e){this.decoders=e}or(e){return tv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function tv(t,e){return new hC({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let pC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new uC(e,r,n),this.decoder=new fC(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function wd({name:t,prefix:e,encode:r,decode:n}){return new pC(t,e,r,
n)}function Ga({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=dC(r,t,n);return wd({prefix:e,
name:t,encode:s,decode:o=>oi(i(o))})}function mC(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function gC(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function bC(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Yt({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=bC(n,s);return wd(
{prefix:e,name:t,encode(o){return gC(o,n,r)},decode(o){return mC(o,i,r,t)}})}const Zo=Yt({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),yC=Yt({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),wC=Yt({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),vC=Yt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),EC=Yt({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),kC=Yt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),xC=Yt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),SC=Yt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),AC=Yt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),IC=Object.freeze(Object.defineProperty({__proto__:null,base32:Zo,base32hex:EC,base32hexpad:xC,
base32hexpadupper:SC,base32hexupper:kC,base32pad:wC,base32padupper:vC,base32upper:yC,base32z:AC},Symbol.toStringTag,{value:"\
Module"})),Pc=Ga({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),_C=Ga({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),CC=Object.freeze(Object.defineProperty(
{__proto__:null,base36:Pc,base36upper:_C},Symbol.toStringTag,{value:"Module"})),Wn=Ga({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),RC=Ga({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),TC=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Wn,
base58flickr:RC},Symbol.toStringTag,{value:"Module"}));var MC=rv,Rg=128,BC=-128,LC=Math.pow(2,31);function rv(t,e,r){e=e||
[],r=r||0;for(var n=r;t>=LC;)e[r++]=t&255|Rg,t/=128;for(;t&BC;)e[r++]=t&255|Rg,t>>>=7;return e[r]=t|0,rv.bytes=r-n+1,e}var DC=Ff,
$C=128,Tg=127;function Ff(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Ff.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&Tg)<<s:(o&Tg)*Math.pow(2,s),s+=7}while(o>=$C);return Ff.bytes=i-n,r}var NC=Math.pow(
2,7),PC=Math.pow(2,14),OC=Math.pow(2,21),UC=Math.pow(2,28),FC=Math.pow(2,35),zC=Math.pow(2,42),qC=Math.pow(2,49),jC=Math.
pow(2,56),GC=Math.pow(2,63),WC=function(t){return t<NC?1:t<PC?2:t<OC?3:t<UC?4:t<FC?5:t<zC?6:t<qC?7:t<jC?8:t<GC?9:10},HC={
encode:MC,decode:DC,encodingLength:WC},wl=HC;function zf(t,e=0){const r=wl.decode(t,e),n=wl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function vl(t,e,r=0){return wl.encode(t,e,r),e}function El(t){return wl.encodingLength(t)}function nv(t,e){const r=e.
byteLength,n=El(t),s=n+El(r),i=new Uint8Array(s+r);return vl(t,i,0),vl(r,i,n),i.set(e,s),new kp(t,r,e,i)}function VC(t){
const e=oi(t),[r,n]=zf(e),[s,i]=zf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new kp(r,s,o,e)}function KC(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&eC(t.bytes,r.bytes)}}let kp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ia(n),this.bytes=Ia(s)}};function Mg(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return XC(r,qf(t),e??Wn.encoder);default:
return YC(r,qf(t),e??Zo.encoder)}}const Bg=new WeakMap;function qf(t){const e=Bg.get(t);if(e==null){const r=new Map;return Bg.
set(t,r),r}return e}let QC=class ar{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ia(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
vo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==ZC)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return ar.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=nv(e,
r);return ar.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return ar.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&KC(e.multihash,n.multihash)}toString(e){return Mg(this,e)}toJSON(){return{"/":Mg(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof ar)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new ar(n,s,i,o??Lg(n,s,i.bytes))}else if(r[e8]===!0){const{version:n,
multihash:s,code:i}=r,o=VC(s);return ar.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==vo)throw new Error(`Version 0 CID must use dag-pb (code: ${vo}) block encoding`);return new ar(e,r,n,n.bytes)}case 1:{
const s=Lg(e,r,n.bytes);return new ar(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return ar.
create(0,vo,e)}static createV1(e,r){return ar.create(1,e,r)}static decode(e){const[r,n]=ar.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=ar.inspectBytes(e),n=r.size-r.multihashSize,
s=oi(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new kp(r.multihashCode,r.digestSize,i,s);return[r.version===0?ar.createV0(o):ar.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=zf(e.subarray(r));return r+=h,u};let s=n(),
i=vo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=JC(e,r),
i=ar.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return qf(
i).set(n,e),i}};function JC(t,e){switch(t[0]){case"Q":{const r=e??Wn;return[Wn.prefix,r.decode(`${Wn.prefix}${t}`)]}case Wn.
prefix:{const r=e??Wn;return[Wn.prefix,r.decode(t)]}case Zo.prefix:{const r=e??Zo;return[Zo.prefix,r.decode(t)]}case Pc.
prefix:{const r=e??Pc;return[Pc.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function XC(t,e,r){const{prefix:n}=r;if(n!==
Wn.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function YC(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const vo=112,ZC=18;function Lg(t,e,r){const n=El(t),s=n+El(e),i=new Uint8Array(s+r.
byteLength);return vl(t,i,0),vl(e,i,n),i.set(r,s),i}const e8=Symbol.for("@ipld/js-cid/CID"),t8=20;function r8({name:t,code:e,
encode:r,minDigestLength:n,maxDigestLength:s}){return new n8(t,e,r,n,s)}let n8=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){
this.name=e,this.code=r,this.encode=n,this.minDigestLength=s??t8,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){
if(r.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Dg(n,this.code,r?.truncate):n.then(s=>Dg(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Dg(t,e,r){if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${t.byteLength}`);t=t.subarray(0,r)}return nv(e,t)}function s8(t){return async e=>new Uint8Array(await crypto.
subtle.digest(t,e))}const i8=r8({name:"sha2-256",code:18,encode:s8("SHA-256")}),Fs=async(t,e,r)=>{r.codec==null&&(r.codec=
L0);const n=await i8.digest(t),s=QC.create(r.cidVersion??P0,r.codec.code,n);return await e.put(s,t,r),s};function o8(t){
return async function*(r,n){let s=0n;for await(let i of r.content)yield async()=>{let o;const a={codec:L0,cidVersion:t.cidVersion,
onProgress:t.onProgress};t.rawLeaves?(a.codec=aC,a.cidVersion=1):(o=new Lr({type:t.leafType,data:i}),i=Ln({Data:o.marshal(),
Links:[]},t));const c=await Fs(i,n,a);return s+=BigInt(i.byteLength),t.onProgress?.(new Dn("unixfs:importer:progress:fil\
e:write",{bytesWritten:s,cid:c,path:r.path})),{cid:c,unixfs:o,size:BigInt(i.length),block:i}}}}let a8=class jf extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=jf.name;code=jf.code;constructor(e="Invalid parameters"){super(
e)}};class Yn extends Error{static name="InvalidContentError";static code="ERR_INVALID_CONTENT";name=Yn.name;code=Yn.code;constructor(e="\
Invalid content"){super(e)}}class $g extends Error{static name="InvalidShardingStrategyError";static code="ERR_SHARDING_\
STRATEGY";name=Yn.name;code=Yn.code}const c8=async(t,e,r)=>{const n=new Lr({type:"directory",mtime:t.mtime,mode:t.mode}),
s=Ln(Bn({Data:n.marshal()}),r),i=await Fs(s,e,r),o=t.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:t.
originalPath,block:s}};async function*l8(t,e,r){let n=-1,s;for await(const i of $0(r.bufferImporter(t,e),r.blockWriteConcurrency)){
if(n++,n===0){s={...i,single:!0};continue}else n===1&&s!=null&&(yield{...s,block:void 0,single:void 0},s=void 0);yield{...i,
block:void 0}}s!=null&&(yield s)}function Ng(t){return t.single===!0}const d8=(t,e,r)=>async function(s){if(s.length===1&&
Ng(s[0])&&r.reduceSingleLeafToSelf){const d=s[0];let u=d.block;return Ng(d)&&(t.mtime!==void 0||t.mode!==void 0)&&(d.unixfs=
new Lr({type:"file",mtime:t.mtime,mode:t.mode,data:d.block}),u={Data:d.unixfs.marshal(),Links:[]},d.block=Ln(Bn(u),r),d.
cid=await Fs(d.block,e,{...r,cidVersion:r.cidVersion}),d.size=BigInt(d.block.length)),r.onProgress?.(new Dn("unixfs:impo\
rter:progress:file:layout",{cid:d.cid,path:t.originalPath})),{cid:d.cid,path:t.path,unixfs:d.unixfs,size:d.size,originalPath:t.
originalPath}}const i=new Lr({type:"file",mtime:t.mtime,mode:t.mode}),o=s.filter(d=>d.cid.code===Uf&&d.size>0||d.unixfs!=
null&&d.unixfs.data==null&&d.unixfs.fileSize()>0n?!0:!!d.unixfs?.data?.length).map(d=>d.cid.code===Uf?(i.addBlockSize(d.
size),{Name:"",Tsize:Number(d.size),Hash:d.cid}):(d.unixfs?.data==null?i.addBlockSize(d.unixfs?.fileSize()??0n):i.addBlockSize(
BigInt(d.unixfs.data.length)),{Name:"",Tsize:Number(d.size),Hash:d.cid})),a={Data:i.marshal(),Links:o},c=Ln(Bn(a),r),l=await Fs(
c,e,r);return r.onProgress?.(new Dn("unixfs:importer:progress:file:layout",{cid:l,path:t.originalPath})),{cid:l,path:t.path,
unixfs:i,size:BigInt(c.length+a.Links.reduce((d,u)=>d+(u.Tsize??0),0)),originalPath:t.originalPath,block:c}},u8=async(t,e,r)=>r.
layout(l8(t,e,r),d8(t,e,r)),f8=Ga({prefix:"9",name:"base10",alphabet:"0123456789"}),h8=Object.freeze(Object.defineProperty(
{__proto__:null,base10:f8},Symbol.toStringTag,{value:"Module"})),p8=Yt({prefix:"f",name:"base16",alphabet:"0123456789abc\
def",bitsPerChar:4,caseInsensitive:!0}),m8=Yt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
g8=Object.freeze(Object.defineProperty({__proto__:null,base16:p8,base16upper:m8},Symbol.toStringTag,{value:"Module"})),b8=Yt(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),y8=Object.freeze(Object.defineProperty({__proto__:null,base2:b8},
Symbol.toStringTag,{value:"Module"})),sv=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
w8=sv.reduce((t,e,r)=>(t[r]=e,t),[]),v8=sv.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return t[n]=r,t},[]);function E8(t){return t.reduce((e,r)=>(e+=w8[r],e),"")}function k8(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=v8[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const x8=wd({prefix:"🚀",name:"\
base256emoji",encode:E8,decode:k8}),S8=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:x8},Symbol.toStringTag,
{value:"Module"})),A8=Yt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),I8=Yt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),_8=Yt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),C8=Yt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),R8=Object.freeze(Object.defineProperty({__proto__:null,base64:A8,base64pad:I8,
base64url:_8,base64urlpad:C8},Symbol.toStringTag,{value:"Module"})),T8=Yt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
M8=Object.freeze(Object.defineProperty({__proto__:null,base8:T8},Symbol.toStringTag,{value:"Module"})),B8=wd({prefix:"\0",
name:"identity",encode:t=>rC(oi(t)),decode:t=>oi(tC(t))}),L8=Object.freeze(Object.defineProperty({__proto__:null,identity:B8},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const Pg={...L8,...y8,...M8,...h8,...g8,...IC,...CC,
...TC,...R8,...S8};function iv(t,e,r,n){return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const Og=iv(
"utf8","u",t=>"u"+new TextDecoder("utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),fu=iv("ascii","a",t=>{let e="\
a";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=bl(t.length);for(let r=0;r<
t.length;r++)e[r]=t.charCodeAt(r);return e}),D8={utf8:Og,"utf-8":Og,hex:Pg.base16,latin1:fu,ascii:fu,binary:fu,...Pg};function ov(t,e="\
utf8"){const r=D8[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}
const $8=async(t,e,r)=>{const n=new Lr({type:"symlink",data:ov(t.link),mtime:t.mtime,mode:t.mode}),s=Ln(Bn({Data:n.marshal()})),
i=await Fs(s,e,r),o=t.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:t.originalPath,block:s}};function N8(t){
return Symbol.iterator in t}function P8(t){return Symbol.asyncIterator in t}function O8(t){try{if(t instanceof Uint8Array)
return(async function*(){yield t})();if(N8(t))return(async function*(){yield*t})();if(P8(t))return t}catch{throw new Yn(
"Content was invalid")}throw new Yn("Content was invalid")}function U8(t){return typeof t.path=="string"}function F8(t){
return async function*(r,n){for await(const s of r){let i;if(U8(s)&&(i=s.path,s.path=s.path.split("/").filter(o=>o!=null&&
o!==".").join("/")),z8(s)){const o={path:s.path,mtime:s.mtime,mode:s.mode,content:(async function*(){let c=0n;for await(const l of t.
chunker(t.chunkValidator(O8(s.content)))){const d=BigInt(l.byteLength);c+=d,t.onProgress?.(new Dn("unixfs:importer:progr\
ess:file:read",{bytesRead:c,chunkSize:d,path:s.path})),yield l}})(),originalPath:i},a=t.fileBuilder??u8;yield async()=>a(
o,n,t)}else if(q8(s)){const o={path:s.path,link:s.link,mtime:s.mtime,mode:s.mode,originalPath:i},a=t.symlinkBuilder??$8;
yield async()=>a(o,n,t)}else if(s.path!=null){const o={path:s.path,mtime:s.mtime,mode:s.mode,originalPath:i},a=t.dirBuilder??
c8;yield async()=>a(o,n,t)}else throw new Error("Import candidate must have content or path or both")}}}function z8(t){return t.
content!=null}function q8(t){return t.link!=null}const j8=()=>async function*(e){for await(const r of e){if(r.length===void 0)
throw new Yn("Content was invalid");if(typeof r=="string"||r instanceof String)yield ov(r.toString());else if(Array.isArray(
r))yield Uint8Array.from(r);else if(r instanceof Uint8Array)yield r;else throw new Yn("Content was invalid")}},G8=174;function av(t){
const e=t?.maxChildrenPerNode??G8;return async function r(n,s){const i=[];for await(const o of D0(n,e))i.push(await s(o));
return i.length>1?r(i,s):i[0]}}class _a{options;root;dir;path;dirty;flat;parent;parentKey;unixfs;mode;mtime;cid;size;nodeSize;constructor(e,r){
this.options=r??{},this.root=e.root,this.dir=e.dir,this.path=e.path,this.dirty=e.dirty,this.flat=e.flat,this.parent=e.parent,
this.parentKey=e.parentKey,this.unixfs=e.unixfs,this.mode=e.mode,this.mtime=e.mtime}}const Ug=2**32,W8=[0,1,2,2,3,3,3,3,
4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8];function H8(t){let e=0;return t>=Ug&&(t=Math.floor(t/Ug),e=32),t>=65536&&(t>>>=16,e+=16),t>=256&&(t>>>=
8,e+=8),e+W8[t]}function Bs(t){return t%2===0&&t++,Math.floor((H8(t)+6)/7)}function hu(t){let e=0;for(let r=0;r<t.length;r++){
const n=t.charCodeAt(r);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319&&r+1<t.length?(r++,e+=4):e+=3}return e}function V8(t,e,r){
let n=1+Bs(e)+e;return n+=1+Bs(t)+t,n+=1+Bs(r),1+Bs(n)+n}const K8=493;function Q8(t,e){let r=2;if(t!==void 0&&t!==K8&&(r+=
1+Bs(t)),e!=null){let n=0;const s=Number(e.secs);s<0?n+=11:n+=1+Bs(s),e.nsecs!=null&&(n+=5),r+=1+Bs(n)+n}return 1+Bs(r)+
r}function pu(t,e){return e?.cid!=null&&e?.size!=null?t+e.cid.byteLength:0}function mu(t,e){return e?.cid!=null&&e?.size!=
null?V8(t,e.cid.byteLength,Number(e.size)):0}class xp extends _a{_children;constructor(e,r){super(e,r),this._children=new Map}async put(e,r){
if(this.nodeSize!==void 0){const n=this._children.get(e),s=hu(e),i=this.options?.shardSplitStrategy;if(i==="links-bytes")
this.nodeSize-=pu(s,n),this.nodeSize+=pu(s,r);else if(i==="block-bytes")this.nodeSize-=mu(s,n),this.nodeSize+=mu(s,r);else
throw new $g(`Invalid shardSplitStrategy: ${i}`);this.nodeSize<0&&(this.nodeSize=void 0)}this.cid=void 0,this.size=void 0,
this._children.set(e,r)}async get(e){return Promise.resolve(this._children.get(e))}childCount(){return this._children.size}directChildrenCount(){
return this.childCount()}onlyChild(){return this._children.values().next().value}*eachChildSeries(){for(const[e,r]of this.
_children.entries())yield{key:e,child:r}}marshal(){const e=new Lr({type:"directory",mtime:this.mtime,mode:this.mode}),r=[];
for(const[s,i]of this._children.entries())if(!(i.size==null||i.cid==null)){if(i.cid==null)throw new Error("Directory con\
tents must be flushed before marshaling");r.push({Hash:i.cid,Name:s,Tsize:i.size==null?void 0:Number(i.size)})}const n={
Data:e.marshal(),Links:r};return Ln(Bn(n),this.options)}async estimateNodeSize(){if(this.nodeSize!==void 0)return this.nodeSize;
const e=this.options?.shardSplitStrategy;if(e==="links-bytes"){this.nodeSize=0;for(const[r,n]of this._children.entries())
this.nodeSize+=pu(hu(r),n)}else if(e==="block-bytes"){this.nodeSize=Q8(this.mode,this.mtime);for(const[r,n]of this._children.
entries())this.nodeSize+=mu(hu(r),n)}else throw new $g(`Invalid shardSplitStrategy: ${e}`);return this.nodeSize}async*flush(e){
const r=[];for(const[c,l]of this._children.entries()){let d=l;if(l instanceof _a)for await(const u of l.flush(e))d=u,yield u;
d.size!=null&&d.cid!=null&&r.push({Name:c,Tsize:Number(d.size),Hash:d.cid})}const n=new Lr({type:"directory",mtime:this.
mtime,mode:this.mode}),s={Data:n.marshal(),Links:r},i=Ln(Bn(s),this.options),o=await Fs(i,e,this.options),a=i.length+s.Links.
reduce((c,l)=>c+(l.Tsize??0),0);this.cid=o,this.size=a,yield{cid:o,unixfs:n,path:this.path,size:BigInt(a)}}}function J8(t){
return t?.buffer instanceof ArrayBuffer}function Fg(t){return J8(t)?t:t.slice()}var X8=cv,zg=128,Y8=-128,Z8=Math.pow(2,31);
function cv(t,e,r){e=e||[],r=r||0;for(var n=r;t>=Z8;)e[r++]=t&255|zg,t/=128;for(;t&Y8;)e[r++]=t&255|zg,t>>>=7;return e[r]=
t|0,cv.bytes=r-n+1,e}var e6=Gf,t6=128,qg=127;function Gf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Gf.bytes=
0,new RangeError("Could not decode varint");o=t[i++],r+=s<28?(o&qg)<<s:(o&qg)*Math.pow(2,s),s+=7}while(o>=t6);return Gf.
bytes=i-n,r}var r6=Math.pow(2,7),n6=Math.pow(2,14),s6=Math.pow(2,21),i6=Math.pow(2,28),o6=Math.pow(2,35),a6=Math.pow(2,42),
c6=Math.pow(2,49),l6=Math.pow(2,56),d6=Math.pow(2,63),u6=function(t){return t<r6?1:t<n6?2:t<s6?3:t<i6?4:t<o6?5:t<a6?6:t<
c6?7:t<l6?8:t<d6?9:10},f6={encode:X8,decode:e6,encodingLength:u6},lv=f6;function jg(t,e,r=0){return lv.encode(t,e,r),e}function Gg(t){
return lv.encodingLength(t)}function h6(t,e){const r=e.byteLength,n=Gg(t),s=n+Gg(r),i=new Uint8Array(s+r);return jg(t,i,
0),jg(r,i,n),i.set(e,s),new p6(t,r,e,i)}let p6=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,
this.digest=Fg(n),this.bytes=Fg(s)}};const m6=20;function g6({name:t,code:e,encode:r,minDigestLength:n,maxDigestLength:s}){
return new b6(t,e,r,n,s)}class b6{name;code;encode;minDigestLength;maxDigestLength;constructor(e,r,n,s,i){this.name=e,this.
code=r,this.encode=n,this.minDigestLength=s??m6,this.maxDigestLength=i}digest(e,r){if(r?.truncate!=null){if(r.truncate<this.
minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.
maxDigestLength!=null&&r.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?Wg(n,
this.code,r?.truncate):n.then(s=>Wg(s,this.code,r?.truncate))}else throw Error("Unknown type, must be binary type")}}function Wg(t,e,r){
if(r!=null&&r!==t.byteLength){if(r>t.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${t.
byteLength}`);t=t.subarray(0,r)}return h6(e,t)}function fs(t,e){const r=t.lo+e.lo>>>0,n=t.hi+e.hi+(r<t.lo?1:0)>>>0;return{
lo:r,hi:n}}function Yr(t,e){const r=t.lo&65535,n=t.lo>>>16,s=e.lo&65535,i=e.lo>>>16,o=r*s,a=r*i,c=n*s,l=n*i,d=(o>>>16)+(a&
65535)+(c&65535)>>>0,u=(d<<16|o&65535)>>>0,h=l+(a>>>16)+(c>>>16)+(d>>>16),p=Math.imul(t.lo,e.hi),m=Math.imul(t.hi,e.lo),
b=h+p+m>>>0;return{lo:u,hi:b}}function Ei(t,e){if(e===0)return t;if(e===32)return{lo:t.hi,hi:t.lo};if(e<32){const s=(t.lo<<
e|t.hi>>>32-e)>>>0,i=(t.hi<<e|t.lo>>>32-e)>>>0;return{lo:s,hi:i}}e-=32;const r=(t.hi<<e|t.lo>>>32-e)>>>0,n=(t.lo<<e|t.hi>>>
32-e)>>>0;return{lo:r,hi:n}}function bt(t,e){return{lo:(t.lo^e.lo)>>>0,hi:(t.hi^e.hi)>>>0}}function gu(t,e){return{lo:t.
hi>>>e-32,hi:0}}function tt(t,e){return{lo:t>>>0,hi:e>>>0}}function Hg(t,e){const r=e*8,n=t[r]|t[r+1]<<8|t[r+2]<<16|t[r+
3]<<24,s=t[r+4]|t[r+5]<<8|t[r+6]<<16|t[r+7]<<24;return{lo:n>>>0,hi:s>>>0}}function Vg(t){return t=bt(t,gu(t,33)),t=Yr(t,
tt(3981806797,4283543511)),t=bt(t,gu(t,33)),t=Yr(t,tt(444984403,3301882366)),t=bt(t,gu(t,33)),t}function y6(t,e=0){let r=tt(
e,0),n=tt(e,0);const s=t.length,i=Math.floor(s/16),o=tt(289559509,2277735313),a=tt(658871167,1291169091);for(let h=0;h<i;h++){
let p=Hg(t,h*2),m=Hg(t,h*2+1);p=Yr(p,o),p=Ei(p,31),p=Yr(p,a),r=bt(r,p),r=Ei(r,27),r=fs(r,n),r=fs(Yr(r,tt(5,0)),tt(1390208809,
0)),m=Yr(m,a),m=Ei(m,33),m=Yr(m,o),n=bt(n,m),n=Ei(n,31),n=fs(n,r),n=fs(Yr(n,tt(5,0)),tt(944331445,0))}let c=tt(0,0),l=tt(
0,0);const d=t.slice(i*16);switch(d.length){case 15:l=bt(l,tt(0,d[14]<<16));case 14:l=bt(l,tt(0,d[13]<<8));case 13:l=bt(
l,tt(0,d[12]));case 12:l=bt(l,tt(d[11]<<24,0));case 11:l=bt(l,tt(d[10]<<16,0));case 10:l=bt(l,tt(d[9]<<8,0));case 9:l=bt(
l,tt(d[8],0)),l=Yr(l,a),l=Ei(l,33),l=Yr(l,o),n=bt(n,l);case 8:c=bt(c,tt(0,d[7]<<24));case 7:c=bt(c,tt(0,d[6]<<16));case 6:
c=bt(c,tt(0,d[5]<<8));case 5:c=bt(c,tt(0,d[4]));case 4:c=bt(c,tt(d[3]<<24,0));case 3:c=bt(c,tt(d[2]<<16,0));case 2:c=bt(
c,tt(d[1]<<8,0));case 1:c=bt(c,tt(d[0],0)),c=Yr(c,o),c=Ei(c,31),c=Yr(c,a),r=bt(r,c)}const u=tt(s,0);return r=bt(r,u),n=bt(
n,u),r=fs(r,n),n=fs(n,r),r=Vg(r),n=Vg(n),r=fs(r,n),n=fs(n,r),new Uint8Array([r.hi>>>24&255,r.hi>>>16&255,r.hi>>>8&255,r.
hi&255,r.lo>>>24&255,r.lo>>>16&255,r.lo>>>8&255,r.lo&255,n.hi>>>24&255,n.hi>>>16&255,n.hi>>>8&255,n.hi&255,n.lo>>>24&255,
n.lo>>>16&255,n.lo>>>8&255,n.lo&255])}const dv=g6({name:"murmur3-128",code:34,encode:t=>y6(t)});let w6=class Wf extends Error{static name="\
NotFoundError";name=Wf.name;static code="ERR_NOT_FOUND";code=Wf.code;constructor(e="Not Found"){super(e)}};class v6{has(e,r){
return Promise.reject(new Error(".has is not implemented"))}put(e,r,n){return Promise.reject(new Error(".put is not impl\
emented"))}async*putMany(e,r){for await(const{cid:n,bytes:s}of e)await this.put(n,s,r),yield n}get(e,r){throw new Error(
".get is not implemented")}async*getMany(e,r){for await(const n of e)yield{cid:n,bytes:this.get(n,r)}}delete(e,r){return Promise.
reject(new Error(".delete is not implemented"))}async*deleteMany(e,r){for await(const n of e)await this.delete(n,r),yield n}async*getAll(e){
throw new Error(".getAll is not implemented")}}class E6 extends v6{put(e,r,n){return n?.signal?.throwIfAborted(),e}get(e,r){
throw r?.signal?.throwIfAborted(),new w6}has(e,r){return r?.signal?.throwIfAborted(),!1}async delete(e,r){r?.signal?.throwIfAborted()}async*getAll(e){
e?.signal?.throwIfAborted()}}function uv(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.
default:t}var bu,Kg;function k6(){if(Kg)return bu;Kg=1;const t=7;bu=class{constructor(){this._bitArrays=[],this._data=[],
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
const a=this._bytePosFor(o,!1);this._bitArrays[a]&=~(1<<o-a*t)}_setInternalPos(o,a,c,l){const d=this._data,u=[a,c];if(l)
this._sortData(),d[o]=u;else{if(d.length)if(d[d.length-1][0]>=a)d.push(u);else if(d[0][0]<=a)d.unshift(u);else{const h=Math.
round(d.length/2);this._data=d.slice(0,h).concat(u).concat(d.slice(h))}else this._data.push(u);this._changedData=!0,this.
_changedLength=!0}}_unsetInternalPos(o){this._data.splice(o,1)}_sortData(){this._changedData&&this._data.sort(n),this._changedData=
!1}bitField(){const o=[];let a=8,c=0,l=0,d;const u=this._bitArrays.slice();for(;u.length||c;){c===0&&(d=u.shift(),c=7);const p=Math.
min(c,a),m=~(255<<p),b=d&m;l|=b<<8-a,d=d>>>p,c-=p,a-=p,(!a||!c&&!u.length)&&(o.push(l),l=0,a=8)}for(var h=o.length-1;h>0&&
o[h]===0;h--)o.pop();return o}compactArray(){return this._sortData(),this._data.map(s)}};function e(i,o){return i+r(o)}function r(i){
let o=i;return o=o-(o>>1&1431655765),o=(o&858993459)+(o>>2&858993459),(o+(o>>4)&252645135)*16843009>>24}function n(i,o){
return i[0]-o[0]}function s(i){return i[1]}return bu}var x6=k6();const S6=uv(x6);function Hf(t){if(t instanceof Uint8Array&&
t.constructor.name==="Uint8Array")return Jg(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(
t))return Jg(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary type")}function A6(t){
const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e}const Qg=4096;function I6(t){const e=t.
length;if(e<=Qg)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.
subarray(n,n+=Qg));return r}function _6(t){return t?.buffer instanceof ArrayBuffer}function Jg(t){return _6(t)?t:t.slice()}
function C6(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var d=t.length,u=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=
256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;
for(var N=u.repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.
length-y)*h+1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){
for(var C=x-k;C!==x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(
f);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var R6=C6,T6=R6;let M6=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},B6=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return fv(this,e)}},
L6=class{decoders;constructor(e){this.decoders=e}or(e){return fv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function fv(t,e){return new L6({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let D6=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new M6(e,r,n),this.decoder=new B6(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function vd({name:t,prefix:e,encode:r,decode:n}){return new D6(t,e,r,
n)}function Wa({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=T6(r,t,n);return vd({prefix:e,
name:t,encode:s,decode:o=>Hf(i(o))})}function $6(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function N6(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function P6(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Zt({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=P6(n,s);return vd(
{prefix:e,name:t,encode(o){return N6(o,n,r)},decode(o){return $6(o,i,r,t)}})}const O6=Wa({prefix:"9",name:"base10",alphabet:"\
0123456789"}),U6=Object.freeze(Object.defineProperty({__proto__:null,base10:O6},Symbol.toStringTag,{value:"Module"})),F6=Zt(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),z6=Zt({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),q6=Object.freeze(Object.defineProperty({__proto__:null,
base16:F6,base16upper:z6},Symbol.toStringTag,{value:"Module"})),j6=Zt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
G6=Object.freeze(Object.defineProperty({__proto__:null,base2:j6},Symbol.toStringTag,{value:"Module"})),hv=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),W6=hv.reduce((t,e,r)=>(t[r]=e,t),[]),H6=hv.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function V6(t){return t.reduce((e,r)=>(e+=W6[r],e),"")}function K6(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=H6[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const Q6=vd({prefix:"🚀",name:"\
base256emoji",encode:V6,decode:K6}),J6=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:Q6},Symbol.toStringTag,
{value:"Module"})),X6=Zt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
Y6=Zt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Z6=Zt(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),e3=Zt({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),t3=Zt({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),r3=Zt({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),n3=Zt({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),s3=Zt({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),i3=Zt({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),o3=Object.freeze(Object.defineProperty({__proto__:null,
base32:X6,base32hex:t3,base32hexpad:n3,base32hexpadupper:s3,base32hexupper:r3,base32pad:Z6,base32padupper:e3,base32upper:Y6,
base32z:i3},Symbol.toStringTag,{value:"Module"})),a3=Wa({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),c3=Wa({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
l3=Object.freeze(Object.defineProperty({__proto__:null,base36:a3,base36upper:c3},Symbol.toStringTag,{value:"Module"})),d3=Wa(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),u3=Wa({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),f3=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:d3,base58flickr:u3},Symbol.toStringTag,{value:"Module"})),h3=Zt({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),p3=Zt({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),m3=Zt({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),g3=Zt({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),b3=Object.freeze(Object.defineProperty(
{__proto__:null,base64:h3,base64pad:p3,base64url:m3,base64urlpad:g3},Symbol.toStringTag,{value:"Module"})),y3=Zt({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),w3=Object.freeze(Object.defineProperty({__proto__:null,base8:y3},Symbol.
toStringTag,{value:"Module"})),v3=vd({prefix:"\0",name:"identity",encode:t=>I6(Hf(t)),decode:t=>Hf(A6(t))}),E3=Object.freeze(
Object.defineProperty({__proto__:null,identity:v3},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Xg={...E3,...G6,...w3,...U6,...q6,...o3,...l3,...f3,...b3,...J6};function pv(t=0){return new Uint8Array(t)}function mv(t,e,r,n){
return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const Yg=mv("utf8","u",t=>"u"+new TextDecoder(
"utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),yu=mv("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)
e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=pv(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}),k3={utf8:Yg,"utf-8":Yg,hex:Xg.base16,latin1:yu,ascii:yu,binary:yu,...Xg};function x3(t,e="utf8"){const r=k3[e];
if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}class Wr{_options;_popCount;_parent;_posAtParent;_children;key;constructor(e,r,n=0){
this._options=e,this._popCount=0,this._parent=r,this._posAtParent=n,this._children=new S6,this.key=null}async put(e,r){const n=await this.
_findNewBucketAndPos(e);n.bucket._putAt(n,e,r)}async get(e){const r=await this._findChild(e);if(r!=null)return r.value}async del(e){
const r=await this._findPlace(e),n=r.bucket._at(r.pos);n!=null&&n.key===e&&r.bucket._delAt(r.pos)}leafCount(){return this.
_children.compactArray().reduce((r,n)=>n instanceof Wr?r+n.leafCount():r+1,0)}childrenCount(){return this._children.length}onlyChild(){
return this._children.get(0)}*eachLeafSeries(){const e=this._children.compactArray();for(const r of e)r instanceof Wr?yield*r.
eachLeafSeries():yield r}serialize(e,r){const n=[];return r(this._children.reduce((s,i,o)=>(i!=null&&(i instanceof Wr?s.
push(i.serialize(e,r)):s.push(e(i,o))),s),n))}async asyncTransform(e,r){return gv(this,e,r)}toJSON(){return this.serialize(
A3,I3)}prettyPrint(){return JSON.stringify(this.toJSON(),null,"  ")}tableSize(){return Math.pow(2,this._options.bits)}async _findChild(e){
const r=await this._findPlace(e),n=r.bucket._at(r.pos);if(!(n instanceof Wr)&&n!=null&&n.key===e)return n}async _findPlace(e){
const r=this._options.hash(typeof e=="string"?x3(e):e),n=await r.take(this._options.bits),s=this._children.get(n);return s instanceof
Wr?s._findPlace(r):{bucket:this,pos:n,hash:r,existingChild:s}}async _findNewBucketAndPos(e){const r=await this._findPlace(
e);if(r.existingChild!=null&&r.existingChild.key!==e){const n=new Wr(this._options,r.bucket,r.pos);r.bucket._putObjectAt(
r.pos,n);const s=await n._findPlace(r.existingChild.hash);return s.bucket._putAt(s,r.existingChild.key,r.existingChild.value),
n._findNewBucketAndPos(r.hash)}return r}_putAt(e,r,n){this._putObjectAt(e.pos,{key:r,value:n,hash:e.hash})}_putObjectAt(e,r){
this._children.get(e)==null&&this._popCount++,this._children.set(e,r)}_delAt(e){if(e===-1)throw new Error("Invalid posit\
ion");this._children.get(e)!=null&&this._popCount--,this._children.unset(e),this._level()}_level(){if(this._parent!=null&&
this._popCount<=1)if(this._popCount===1){const e=this._children.find(S3);if(e!=null&&!(e instanceof Wr)){const r=e.hash;
r.untake(this._options.bits);const n={pos:this._posAtParent,hash:r,bucket:this._parent};this._parent._putAt(n,e.key,e.value)}}else
this._parent._delAt(this._posAtParent)}_at(e){return this._children.get(e)}}function S3(t){return!!t}function A3(t,e){return t.
key}function I3(t){return t}async function gv(t,e,r){const n=[];for(const s of t._children.compactArray())if(s instanceof
Wr)await gv(s,e,r);else{const i=await e(s);n.push({bitField:t._children.bitField(),children:i})}return r(n)}function _3(t){
return t?.buffer instanceof ArrayBuffer}function C3(t){if(_3(t))return t;const e=t.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function R3(t,e){e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=pv(e);let n=0;for(const s of t)r.set(
s,n),n+=s.length;return C3(r)}const T3=[255,254,252,248,240,224,192,128],M3=[1,3,7,15,31,63,127,255];class B3{_value;_currentBytePos;_currentBitPos;constructor(e){
this._value=e,this._currentBytePos=e.length-1,this._currentBitPos=7}availableBits(){return this._currentBitPos+1+this._currentBytePos*
8}totalBits(){return this._value.length*8}take(e){let r=e,n=0;for(;r>0&&this._haveBits();){const s=this._value[this._currentBytePos],
i=this._currentBitPos+1,o=Math.min(i,r),a=L3(s,i-o,o);n=(n<<o)+a,r-=o,this._currentBitPos-=o,this._currentBitPos<0&&(this.
_currentBitPos=7,this._currentBytePos--)}return n}untake(e){for(this._currentBitPos+=e;this._currentBitPos>7;)this._currentBitPos-=
8,this._currentBytePos+=1}_haveBits(){return this._currentBytePos>=0}}function L3(t,e,r){const n=D3(e,r);return(t&n)>>>e}
function D3(t,e){return T3[t]&M3[Math.min(e+t-1,7)]}function $3(t){function e(r){return r instanceof Zg?r:new Zg(r,t)}return e}
class Zg{_value;_hashFn;_depth;_availableBits;_currentBufferIndex;_buffers;constructor(e,r){if(!(e instanceof Uint8Array))
throw new Error("can only hash Uint8Arrays");this._value=e,this._hashFn=r,this._depth=-1,this._availableBits=0,this._currentBufferIndex=
0,this._buffers=[]}async take(e){let r=e;for(;this._availableBits<r;)await this._produceMoreBits();let n=0;for(;r>0;){const s=this.
_buffers[this._currentBufferIndex],i=Math.min(s.availableBits(),r),o=s.take(i);n=(n<<i)+o,r-=i,this._availableBits-=i,s.
availableBits()===0&&this._currentBufferIndex++}return n}untake(e){let r=e;for(;r>0;){const n=this._buffers[this._currentBufferIndex],
s=Math.min(n.totalBits()-n.availableBits(),r);n.untake(s),r-=s,this._availableBits+=s,this._currentBufferIndex>0&&n.totalBits()===
n.availableBits()&&(this._depth--,this._currentBufferIndex--)}}async _produceMoreBits(){this._depth++;const e=this._depth>
0?R3([this._value,Uint8Array.from([this._depth])]):this._value,r=await this._hashFn(e),n=new B3(r);this._buffers.push(n),
this._availableBits+=n.availableBits()}}function bv(t){if(t==null||t.hashFn==null)throw new Error("please define an opti\
ons.hashFn");const e={bits:t.bits??8,hash:$3(t.hashFn)};return new Wr(e)}async function N3(t){return(await dv.encode(t)).
slice(0,8).reverse()}class P3 extends _a{bucket;constructor(e,r){super(e,r),this.bucket=bv({hashFn:N3,bits:r.shardFanoutBits??
U0})}async put(e,r){this.cid=void 0,this.size=void 0,this.nodeSize=void 0,await this.bucket.put(e,r)}async get(e){return this.
bucket.get(e)}childCount(){return this.bucket.leafCount()}directChildrenCount(){return this.bucket.childrenCount()}onlyChild(){
return this.bucket.onlyChild()}*eachChildSeries(){for(const{key:e,value:r}of this.bucket.eachLeafSeries())yield{key:e,child:r}}async estimateNodeSize(){
if(this.nodeSize!==void 0)return this.nodeSize;const e=new E6,r=await vv(this.bucket,this,e,this.options);return this.nodeSize=
r.size,this.nodeSize}async*flush(e){for await(const r of yv(this.bucket,e,this,this.options))yield{...r,path:this.path}}}
async function*yv(t,e,r,n){const s=t._children,i=(t.tableSize()-1).toString(16).length,o=[];let a=0n;for(let m=0;m<s.length;m++){
const b=s.get(m);if(b==null)continue;const g=m.toString(16).toUpperCase().padStart(i,"0");if(b instanceof Wr){let f;for await(const y of yv(
b,e,null,n))f=y;if(f==null)throw new Error("Could not flush sharded directory, no sub-shard found");o.push({Name:g,Tsize:Number(
f.size),Hash:f.cid}),a+=f.size}else if(wv(b.value)){const f=b.value;let y;for await(const k of f.flush(e))y=k,yield y;if(y==
null)throw new Error("Did not flush dir");const E=g+b.key;o.push({Name:E,Tsize:Number(y.size),Hash:y.cid}),a+=y.size}else{
const f=b.value;if(f.cid==null)continue;const y=g+b.key,E=f.size;o.push({Name:y,Tsize:Number(E),Hash:f.cid}),a+=BigInt(E??
0)}}const c=Uint8Array.from(s.bitField().reverse()),l=new Lr({type:"hamt-sharded-directory",data:c,fanout:BigInt(t.tableSize()),
hashType:O0,mtime:r?.mtime,mode:r?.mode}),d={Data:l.marshal(),Links:o},u=Ln(Bn(d),n),h=await Fs(u,e,n),p=BigInt(u.byteLength)+
a;yield{cid:h,unixfs:l,size:p}}function wv(t){return typeof t.flush=="function"}async function vv(t,e,r,n){const s=t._children,
i=(t.tableSize()-1).toString(16).length,o=[];let a=0;for(let h=0;h<s.length;h++){const p=s.get(h);if(p==null)continue;const m=h.
toString(16).toUpperCase().padStart(i,"0");if(p instanceof Wr){const{size:b,cid:g}=await vv(p,null,r,n);o.push({Name:m,Tsize:Number(
b),Hash:g}),a+=m.length+g.byteLength}else if(wv(p.value)){const b=p.value,g=b.nodeSize;if(b.cid==null)throw new Error("C\
hild directory has not been persisted");o.push({Name:m+p.key,Tsize:Number(g),Hash:b.cid}),a+=m.length+b.cid.byteLength}else{
const b=p.value,g=m+p.key,f=b.size;o.push({Name:g,Tsize:Number(f),Hash:b.cid}),a+=m.length+b.cid.byteLength}}const c=Uint8Array.
from(s.bitField().reverse()),l=new Lr({type:"hamt-sharded-directory",data:c,fanout:BigInt(t.tableSize()),hashType:O0,mtime:e?.
mtime,mode:e?.mode}),d=Ln(Bn({Data:l.marshal(),Links:o}),n);return{cid:await Fs(d,r,n),size:n.shardSplitStrategy==="link\
s-bytes"?a:d.length}}async function Ev(t,e){let r=e;const n=e.options.shardSplitThresholdBytes??F0;e instanceof xp&&await e.
estimateNodeSize()>n&&(r=await O3(e));const s=r.parent;if(s!=null){if(r!==e){if(t!=null&&(t.parent=r),r.parentKey==null)
throw new Error("No parent key found");await s.put(r.parentKey,r)}return Ev(r,s)}return r}async function O3(t){const e=new P3(
{root:t.root,dir:!0,parent:t.parent,parentKey:t.parentKey,path:t.path,dirty:t.dirty,flat:!1,mtime:t.mtime,mode:t.mode},t.
options);for(const{key:r,child:n}of t.eachChildSeries())await e.put(r,n);return e}const U3=(t="")=>t.split(/(?<!\\)\//).
filter(Boolean);async function F3(t,e,r){const n=U3(t.path??""),s=n.length-1;let i=e,o="";for(let a=0;a<n.length;a++){const c=n[a];
o+=`${o!==""?"/":""}${c}`;const l=a===s;if(i.dirty=!0,i.cid=void 0,i.size=void 0,l)await i.put(c,t),e=await Ev(null,i);else{
let d=await i.get(c);(d==null||!(d instanceof _a))&&(d=new xp({root:!1,dir:!0,parent:i,parentKey:c,path:o,dirty:!0,flat:!0,
mtime:d?.unixfs?.mtime,mode:d?.unixfs?.mode},r)),await i.put(c,d),i=d}}return e}async function*eb(t,e){if(!(t instanceof
_a)){t.unixfs?.isDirectory()===!0&&(yield t);return}yield*t.flush(e)}function z3(t){return async function*(r,n){let s=new xp(
{root:!0,dir:!0,path:"",dirty:!0,flat:!0},t),i,o=!1;for await(const a of r){if(a==null)continue;const c=`${a.originalPath??
""}`.split("/")[0];c!=null&&c!==""&&(i==null?(i=c,o=!0):i!==c&&(o=!1)),s=await F3(a,s,t),a.unixfs?.isDirectory()!==!0&&(yield a)}
if(t.wrapWithDirectory||o&&s.childCount()>1)yield*eb(s,n);else for(const a of s.eachChildSeries())a!=null&&(yield*eb(a.child,
n))}}async function*q3(t,e,r={}){let n;Symbol.asyncIterator in t||Symbol.iterator in t?n=t:n=[t];let s,i;r.profile==="un\
ixfs-v0-2015"?(r.shardSplitStrategy=r.shardSplitStrategy??"links-bytes",r.cidVersion=r.cidVersion??0,r.rawLeaves=r.rawLeaves??
!1,s=z0,i=174,r.fieldOrder="links-first"):r.profile==="unixfs-v1-2025"&&(r.shardSplitStrategy=r.shardSplitStrategy??"blo\
ck-bytes",r.cidVersion=r.cidVersion??1,r.rawLeaves=r.rawLeaves??!0,s=vI,i=1024,r.fieldOrder="links-first");const o=r.wrapWithDirectory??
AI,a=r.shardSplitThresholdBytes??F0,c=r.shardSplitStrategy??wI,l=r.shardFanoutBits??U0,d=r.cidVersion??P0,u=r.rawLeaves??
SI,h=r.leafType??II,p=r.fileImportConcurrency??EI,m=r.blockWriteConcurrency??kI,b=r.reduceSingleLeafToSelf??xI,g=r.fieldOrder??
_I,f=r.chunker??q0({chunkSize:s}),y=r.chunkValidator??j8(),E=r.dagBuilder??F8({chunker:f,chunkValidator:y,wrapWithDirectory:o,
layout:r.layout??av({maxChildrenPerNode:i}),bufferImporter:r.bufferImporter??o8({cidVersion:d,rawLeaves:u,leafType:h,onProgress:r.
onProgress}),blockWriteConcurrency:m,reduceSingleLeafToSelf:b,cidVersion:d,onProgress:r.onProgress,dirBuilder:r.dirBuilder,
fileBuilder:r.fileBuilder,fieldOrder:g}),k=r.treeBuilder??z3({wrapWithDirectory:o,shardSplitThresholdBytes:a,shardSplitStrategy:c,
shardFanoutBits:l,cidVersion:d,onProgress:r.onProgress,fieldOrder:g});for await(const x of k($0(E(n,e),p),e))yield{cid:x.
cid,path:x.path,unixfs:x.unixfs,size:x.size}}async function j3(t,e,r={}){const n=await pI(q3([t],e,r));if(n==null)throw new a8(
"Nothing imported");return n}async function G3(t,e,r={}){return j3({content:t},e,r)}function W3(t,e){if(t===e)return!0;if(t.
byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function Sp(t){if(t instanceof
Uint8Array&&t.constructor.name==="Uint8Array")return Ca(t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.
isView(t))return Ca(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function H3(t){return t?.buffer instanceof ArrayBuffer}function Ca(t){return H3(t)?t:t.slice()}function V3(t,e,r){if(t.
length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;for(var N=u.
repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.length-y)*h+
1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){for(var C=x-k;C!==
x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(f);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var K3=V3,Q3=K3;let J3=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},X3=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return kv(this,e)}},
Y3=class{decoders;constructor(e){this.decoders=e}or(e){return kv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function kv(t,e){return new Y3({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let Z3=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new J3(e,r,n),this.decoder=new X3(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function xv({name:t,prefix:e,encode:r,decode:n}){return new Z3(t,e,r,
n)}function Ed({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=Q3(r,t,n);return xv({prefix:e,
name:t,encode:s,decode:o=>Sp(i(o))})}function e5(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function t5(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function r5(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function is({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=r5(n,s);return xv(
{prefix:e,name:t,encode(o){return t5(o,n,r)},decode(o){return e5(o,i,r,t)}})}const Oc=is({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});is({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});is({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});is({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});is({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});is({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});is({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});is({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});is({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const wu=Ed(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ed({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Is=Ed({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ed({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var n5=Sv,tb=128,s5=-128,i5=Math.pow(2,31);function Sv(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=i5;)e[r++]=t&255|tb,t/=128;for(;t&s5;)e[r++]=t&255|tb,t>>>=7;return e[r]=t|0,Sv.bytes=r-n+1,e}var o5=Vf,
a5=128,rb=127;function Vf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Vf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&rb)<<s:(o&rb)*Math.pow(2,s),s+=7}while(o>=a5);return Vf.bytes=i-n,r}var c5=Math.pow(
2,7),l5=Math.pow(2,14),d5=Math.pow(2,21),u5=Math.pow(2,28),f5=Math.pow(2,35),h5=Math.pow(2,42),p5=Math.pow(2,49),m5=Math.
pow(2,56),g5=Math.pow(2,63),b5=function(t){return t<c5?1:t<l5?2:t<d5?3:t<u5?4:t<f5?5:t<h5?6:t<p5?7:t<m5?8:t<g5?9:10},y5={
encode:n5,decode:o5,encodingLength:b5},kl=y5;function Kf(t,e=0){const r=kl.decode(t,e),n=kl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function xl(t,e,r=0){return kl.encode(t,e,r),e}function Sl(t){return kl.encodingLength(t)}function w5(t,e){const r=e.
byteLength,n=Sl(t),s=n+Sl(r),i=new Uint8Array(s+r);return xl(t,i,0),xl(r,i,n),i.set(e,s),new Ap(t,r,e,i)}function Av(t){
const e=Sp(t),[r,n]=Kf(e),[s,i]=Kf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Ap(r,s,o,e)}function v5(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&W3(t.bytes,r.bytes)}}let Ap=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ca(n),this.bytes=Ca(s)}};function nb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return k5(r,Qf(t),e??Is.encoder);default:
return x5(r,Qf(t),e??Oc.encoder)}}const sb=new WeakMap;function Qf(t){const e=sb.get(t);if(e==null){const r=new Map;return sb.
set(t,r),r}return e}let ai=class cr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ca(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
Eo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==S5)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return cr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=w5(e,
r);return cr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return cr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&v5(e.multihash,n.multihash)}toString(e){return nb(this,e)}toJSON(){return{"/":nb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof cr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new cr(n,s,i,o??ib(n,s,i.bytes))}else if(r[A5]===!0){const{version:n,
multihash:s,code:i}=r,o=Av(s);return cr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==Eo)throw new Error(`Version 0 CID must use dag-pb (code: ${Eo}) block encoding`);return new cr(e,r,n,n.bytes)}case 1:{
const s=ib(e,r,n.bytes);return new cr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return cr.
create(0,Eo,e)}static createV1(e,r){return cr.create(1,e,r)}static decode(e){const[r,n]=cr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=cr.inspectBytes(e),n=r.size-r.multihashSize,
s=Sp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new Ap(r.multihashCode,r.digestSize,i,s);return[r.version===0?cr.createV0(o):cr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=Kf(e.subarray(r));return r+=h,u};let s=n(),
i=Eo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=E5(e,r),
i=cr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Qf(
i).set(n,e),i}};function E5(t,e){switch(t[0]){case"Q":{const r=e??Is;return[Is.prefix,r.decode(`${Is.prefix}${t}`)]}case Is.
prefix:{const r=e??Is;return[Is.prefix,r.decode(t)]}case Oc.prefix:{const r=e??Oc;return[Oc.prefix,r.decode(t)]}case wu.
prefix:{const r=e??wu;return[wu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function k5(t,e,r){const{prefix:n}=r;if(n!==
Is.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function x5(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const Eo=112,S5=18;function ib(t,e,r){const n=Sl(t),s=n+Sl(e),i=new Uint8Array(s+r.
byteLength);return xl(t,i,0),xl(e,i,n),i.set(r,s),i}const A5=Symbol.for("@ipld/js-cid/CID");class Ra extends Error{static name="\
BadPathError";static code="ERR_BAD_PATH";name=Ra.name;code=Ra.code;constructor(e="Bad path"){super(e)}}let hi=class Jf extends Error{static name="\
NotFoundError";static code="ERR_NOT_FOUND";name=Jf.name;code=Jf.code;constructor(e="Not found"){super(e)}};class Ta extends Error{static name="\
NoResolverError";static code="ERR_NO_RESOLVER";name=Ta.name;code=Ta.code;constructor(e="No resolver"){super(e)}}class qt extends Error{static name="\
NotUnixFSError";static code="ERR_NOT_UNIXFS";name=qt.name;code=qt.code;constructor(e="Not UnixFS"){super(e)}}class Al extends Error{static name="\
OverReadError";static code="ERR_OVER_READ";name=Al.name;code=Al.code;constructor(e="Over read"){super(e)}}class Il extends Error{static name="\
UnderReadError";static code="ERR_UNDER_READ";name=Il.name;code=Il.code;constructor(e="Under read"){super(e)}}let Wo=class Xf extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Xf.name;code=Xf.code;constructor(e="Invalid parameters"){super(
e)}};const I5=["Object","Uint8Array","RegExp","Date","Error","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayB\
uffer","DataView","Promise","URL","HTMLElement","Int8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array",
"Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Tagged"];function Iv(t){if(t===null)return"\
null";if(t===void 0)return"undefined";if(t===!0||t===!1)return"boolean";const e=typeof t;if(e==="string"||e==="number"||
e==="bigint"||e==="symbol")return e;if(e==="function")return"Function";if(Array.isArray(t))return"Array";if(t instanceof
Uint8Array)return"Uint8Array";if(t.constructor===Object)return"Object";const r=_5(t);return r||"Object"}function _5(t){const e=Object.
prototype.toString.call(t).slice(8,-1);if(I5.includes(e))return e}class ${constructor(e,r,n){this.major=e,this.majorEncoded=
e<<5,this.name=r,this.terminal=n}toString(){return`Type[${this.major}].${this.name}`}compare(e){return this.major<e.major?
-1:this.major>e.major?1:0}static equals(e,r){return e===r||e.major===r.major&&e.name===r.name}}$.uint=new $(0,"uint",!0);
$.negint=new $(1,"negint",!0);$.bytes=new $(2,"bytes",!0);$.string=new $(3,"string",!0);$.array=new $(4,"array",!1);$.map=
new $(5,"map",!1);$.tag=new $(6,"tag",!1);$.float=new $(7,"float",!0);$.false=new $(7,"false",!0);$.true=new $(7,"true",
!0);$.null=new $(7,"null",!0);$.undefined=new $(7,"undefined",!0);$.break=new $(7,"break",!0);class oe{constructor(e,r,n){
this.type=e,this.value=r,this.encodedLength=n,this.encodedBytes=void 0,this.byteValue=void 0}toString(){return`Token[${this.
type}].${this.value}`}}const Ha=globalThis.process&&!globalThis.process.browser&&globalThis.Buffer&&typeof globalThis.Buffer.
isBuffer=="function",C5=new TextEncoder;function _l(t){return Ha&&globalThis.Buffer.isBuffer(t)}function kd(t){return t instanceof
Uint8Array?_l(t)?new Uint8Array(t.buffer,t.byteOffset,t.byteLength):t:Uint8Array.from(t)}const R5=24,T5=200,Ip=Ha?t=>t.length>=
R5?globalThis.Buffer.from(t):ab(t):t=>t.length>=T5?C5.encode(t):ab(t),Fn=t=>Uint8Array.from(t),M5=Ha?(t,e,r)=>_l(t)?new Uint8Array(
t.subarray(e,r)):t.slice(e,r):(t,e,r)=>t.slice(e,r),B5=Ha?(t,e)=>(t=t.map(r=>r instanceof Uint8Array?r:globalThis.Buffer.
from(r)),kd(globalThis.Buffer.concat(t,e))):(t,e)=>{const r=new Uint8Array(e);let n=0;for(let s of t)n+s.length>r.length&&
(s=s.subarray(0,r.length-n)),r.set(s,n),n+=s.length;return r},ob=Ha?t=>globalThis.Buffer.allocUnsafe(t):t=>new Uint8Array(
t);function _v(t,e){if(_l(t)&&_l(e))return t.compare(e);for(let r=0;r<t.length;r++)if(t[r]!==e[r])return t[r]<e[r]?-1:1;
return 0}function ab(t){const e=[];let r=0;for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);s<128?e[r++]=s:s<2048?(e[r++]=
s>>6|192,e[r++]=s&63|128):(s&64512)===55296&&n+1<t.length&&(t.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(t.
charCodeAt(++n)&1023),e[r++]=s>>18|240,e[r++]=s>>12&63|128,e[r++]=s>>6&63|128,e[r++]=s&63|128):(s>=55296&&s<=57343&&(s=65533),
e[r++]=s>>12|224,e[r++]=s>>6&63|128,e[r++]=s&63|128)}return e}const cb=4096;function L5(t){const e=t.length;if(e<=cb)return String.
fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=cb));return r}const D5=256;
class Cl{constructor(e=D5){this.chunkSize=e,this.cursor=0,this.maxCursor=-1,this.chunks=[],this._initReuseChunk=null}reset(){
this.cursor=0,this.maxCursor=-1,this.chunks.length&&(this.chunks=[]),this._initReuseChunk!==null&&(this.chunks.push(this.
_initReuseChunk),this.maxCursor=this._initReuseChunk.length-1)}pushByte(e){let r=this.chunks[this.chunks.length-1];this.
cursor>this.maxCursor&&(r=ob(this.chunkSize),this.chunks.push(r),this.maxCursor+=r.length,this._initReuseChunk===null&&(this.
_initReuseChunk=r));const n=r.length-(this.maxCursor-this.cursor)-1;r[n]=e,this.cursor++}push(e){let r=this.chunks[this.
chunks.length-1];if(this.cursor+e.length<=this.maxCursor+1){const s=r.length-(this.maxCursor-this.cursor)-1;r.set(e,s)}else{
if(r){const s=r.length-(this.maxCursor-this.cursor)-1;s<r.length&&(this.chunks[this.chunks.length-1]=r.subarray(0,s),this.
maxCursor=this.cursor-1)}e.length<64&&e.length<this.chunkSize?(r=ob(this.chunkSize),this.chunks.push(r),this.maxCursor+=
r.length,this._initReuseChunk===null&&(this._initReuseChunk=r),r.set(e,0)):(this.chunks.push(e),this.maxCursor+=e.length)}
this.cursor+=e.length}toBytes(e=!1){let r;if(this.chunks.length===1){const n=this.chunks[0];e&&this.cursor>n.length/2?(r=
this.cursor===n.length?n:n.subarray(0,this.cursor),this._initReuseChunk=null,this.chunks=[]):r=M5(n,0,this.cursor)}else r=
B5(this.chunks,this.cursor);return e&&this.reset(),r}}class $5{constructor(e){this.dest=e,this.cursor=0,this.chunks=[e]}reset(){
this.cursor=0}pushByte(e){if(this.cursor>=this.dest.length)throw new Error("write out of bounds, destination buffer is t\
oo small");this.dest[this.cursor++]=e}push(e){if(this.cursor+e.length>this.dest.length)throw new Error("write out of bou\
nds, destination buffer is too small");this.dest.set(e,this.cursor),this.cursor+=e.length}toBytes(e=!1){const r=this.dest.
subarray(0,this.cursor);return e&&this.reset(),r}}const ce="CBOR decode error:",Pi="CBOR encode error:";function oo(t,e,r){
if(t.length-e<r)throw new Error(`${ce} not enough data for type`)}const Qt=[24,256,65536,4294967296,BigInt("184467440737\
09551616")];function pi(t,e,r){oo(t,e,1);const n=t[e];if(r.strict===!0&&n<Qt[0])throw new Error(`${ce} integer encoded i\
n more bytes than necessary (strict decode)`);return n}function mi(t,e,r){oo(t,e,2);const n=t[e]<<8|t[e+1];if(r.strict===
!0&&n<Qt[1])throw new Error(`${ce} integer encoded in more bytes than necessary (strict decode)`);return n}function gi(t,e,r){
oo(t,e,4);const n=t[e]*16777216+(t[e+1]<<16)+(t[e+2]<<8)+t[e+3];if(r.strict===!0&&n<Qt[2])throw new Error(`${ce} integer\
 encoded in more bytes than necessary (strict decode)`);return n}function bi(t,e,r){oo(t,e,8);const n=t[e]*16777216+(t[e+
1]<<16)+(t[e+2]<<8)+t[e+3],s=t[e+4]*16777216+(t[e+5]<<16)+(t[e+6]<<8)+t[e+7],i=(BigInt(n)<<BigInt(32))+BigInt(s);if(r.strict===
!0&&i<Qt[3])throw new Error(`${ce} integer encoded in more bytes than necessary (strict decode)`);if(i<=Number.MAX_SAFE_INTEGER)
return Number(i);if(r.allowBigInt===!0)return i;throw new Error(`${ce} integers outside of the safe integer range are no\
t supported`)}function N5(t,e,r,n){return new oe($.uint,pi(t,e+1,n),2)}function P5(t,e,r,n){return new oe($.uint,mi(t,e+
1,n),3)}function O5(t,e,r,n){return new oe($.uint,gi(t,e+1,n),5)}function U5(t,e,r,n){return new oe($.uint,bi(t,e+1,n),9)}
function ao(t,e){return Vr(t,0,e.value)}function Vr(t,e,r){if(r<Qt[0]){const n=Number(r);t.pushByte(e|n)}else if(r<Qt[1]){
const n=Number(r);t.push([e|24,n])}else if(r<Qt[2]){const n=Number(r);t.push([e|25,n>>>8,n&255])}else if(r<Qt[3]){const n=Number(
r);t.push([e|26,n>>>24&255,n>>>16&255,n>>>8&255,n&255])}else{const n=BigInt(r);if(n<Qt[4]){const s=[e|27,0,0,0,0,0,0,0];
let i=Number(n&BigInt(4294967295)),o=Number(n>>BigInt(32)&BigInt(4294967295));s[8]=i&255,i=i>>8,s[7]=i&255,i=i>>8,s[6]=i&
255,i=i>>8,s[5]=i&255,s[4]=o&255,o=o>>8,s[3]=o&255,o=o>>8,s[2]=o&255,o=o>>8,s[1]=o&255,t.push(s)}else throw new Error(`${ce}\
 encountered BigInt larger than allowable range`)}}ao.encodedSize=function(e){return Vr.encodedSize(e.value)};Vr.encodedSize=
function(e){return e<Qt[0]?1:e<Qt[1]?2:e<Qt[2]?3:e<Qt[3]?5:9};ao.compareTokens=function(e,r){return e.value<r.value?-1:e.
value>r.value?1:0};function F5(t,e,r,n){return new oe($.negint,-1-pi(t,e+1,n),2)}function z5(t,e,r,n){return new oe($.negint,
-1-mi(t,e+1,n),3)}function q5(t,e,r,n){return new oe($.negint,-1-gi(t,e+1,n),5)}const _p=BigInt(-1),Cv=BigInt(1);function j5(t,e,r,n){
const s=bi(t,e+1,n);if(typeof s!="bigint"){const i=-1-s;if(i>=Number.MIN_SAFE_INTEGER)return new oe($.negint,i,9)}if(n.allowBigInt!==
!0)throw new Error(`${ce} integers outside of the safe integer range are not supported`);return new oe($.negint,_p-BigInt(
s),9)}function Cp(t,e){const r=e.value,n=typeof r=="bigint"?r*_p-Cv:r*-1-1;Vr(t,e.type.majorEncoded,n)}Cp.encodedSize=function(e){
const r=e.value,n=typeof r=="bigint"?r*_p-Cv:r*-1-1;return n<Qt[0]?1:n<Qt[1]?2:n<Qt[2]?3:n<Qt[3]?5:9};Cp.compareTokens=function(e,r){
return e.value<r.value?1:e.value>r.value?-1:0};function Va(t,e,r,n){oo(t,e,r+n);const s=t.slice(e+r,e+r+n);return new oe(
$.bytes,s,r+n)}function G5(t,e,r,n){return Va(t,e,1,r)}function W5(t,e,r,n){return Va(t,e,2,pi(t,e+1,n))}function H5(t,e,r,n){
return Va(t,e,3,mi(t,e+1,n))}function V5(t,e,r,n){return Va(t,e,5,gi(t,e+1,n))}function K5(t,e,r,n){const s=bi(t,e+1,n);
if(typeof s=="bigint")throw new Error(`${ce} 64-bit integer bytes lengths not supported`);return Va(t,e,9,s)}function Rl(t){
return t.encodedBytes===void 0&&(t.encodedBytes=$.equals(t.type,$.string)?Ip(t.value):t.value),t.encodedBytes}function xd(t,e){
const r=Rl(e);Vr(t,e.type.majorEncoded,r.length),t.push(r)}xd.encodedSize=function(e){const r=Rl(e);return Vr.encodedSize(
r.length)+r.length};xd.compareTokens=function(e,r){return Q5(Rl(e),Rl(r))};function Q5(t,e){return t.length<e.length?-1:
t.length>e.length?1:_v(t,e)}const lb=new TextDecoder("utf-8",{ignoreBOM:!0}),J5=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),
X5=32;function Y5(t,e,r,n){if(r-e<X5){let i="";for(let o=e;o<r;o++){const a=t[o];if(a&128)return n.strictUtf8===!0?db(t,
e,r):lb.decode(t.subarray(e,r));i+=String.fromCharCode(a)}return i}return n.strictUtf8===!0?db(t,e,r):lb.decode(t.subarray(
e,r))}function db(t,e,r){try{return J5.decode(t.subarray(e,r))}catch{throw new Error(`${ce} invalid UTF-8 in text string`)}}
function Ka(t,e,r,n,s){const i=r+n;oo(t,e,i);const o=new oe($.string,Y5(t,e+r,e+i,s),i);return s.retainStringBytes===!0&&
(o.byteValue=t.slice(e+r,e+i)),o}function Z5(t,e,r,n){return Ka(t,e,1,r,n)}function e4(t,e,r,n){return Ka(t,e,2,pi(t,e+1,
n),n)}function t4(t,e,r,n){return Ka(t,e,3,mi(t,e+1,n),n)}function r4(t,e,r,n){return Ka(t,e,5,gi(t,e+1,n),n)}function n4(t,e,r,n){
const s=bi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${ce} 64-bit integer string lengths not supported`);return Ka(
t,e,9,s,n)}const s4=xd;function co(t,e,r,n){return new oe($.array,n,r)}function i4(t,e,r,n){return co(t,e,1,r)}function o4(t,e,r,n){
return co(t,e,2,pi(t,e+1,n))}function a4(t,e,r,n){return co(t,e,3,mi(t,e+1,n))}function c4(t,e,r,n){return co(t,e,5,gi(t,
e+1,n))}function l4(t,e,r,n){const s=bi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${ce} 64-bit integer array lengt\
hs not supported`);return co(t,e,9,s)}function d4(t,e,r,n){if(n.allowIndefinite===!1)throw new Error(`${ce} indefinite l\
ength items not allowed`);return co(t,e,1,1/0)}function Rp(t,e){Vr(t,$.array.majorEncoded,e.value)}Rp.compareTokens=ao.compareTokens;
Rp.encodedSize=function(e){return Vr.encodedSize(e.value)};function lo(t,e,r,n){return new oe($.map,n,r)}function u4(t,e,r,n){
return lo(t,e,1,r)}function f4(t,e,r,n){return lo(t,e,2,pi(t,e+1,n))}function h4(t,e,r,n){return lo(t,e,3,mi(t,e+1,n))}function p4(t,e,r,n){
return lo(t,e,5,gi(t,e+1,n))}function m4(t,e,r,n){const s=bi(t,e+1,n);if(typeof s=="bigint")throw new Error(`${ce} 64-bi\
t integer map lengths not supported`);return lo(t,e,9,s)}function g4(t,e,r,n){if(n.allowIndefinite===!1)throw new Error(
`${ce} indefinite length items not allowed`);return lo(t,e,1,1/0)}function Tp(t,e){Vr(t,$.map.majorEncoded,e.value)}Tp.compareTokens=
ao.compareTokens;Tp.encodedSize=function(e){return Vr.encodedSize(e.value)};function b4(t,e,r,n){return new oe($.tag,r,1)}
function y4(t,e,r,n){return new oe($.tag,pi(t,e+1,n),2)}function w4(t,e,r,n){return new oe($.tag,mi(t,e+1,n),3)}function v4(t,e,r,n){
return new oe($.tag,gi(t,e+1,n),5)}function E4(t,e,r,n){return new oe($.tag,bi(t,e+1,n),9)}function Mp(t,e){Vr(t,$.tag.majorEncoded,
e.value)}Mp.compareTokens=ao.compareTokens;Mp.encodedSize=function(e){return Vr.encodedSize(e.value)};const Bp=20,Lp=21,
Dp=22,$p=23;function k4(t,e,r,n){if(n.allowUndefined===!1)throw new Error(`${ce} undefined values are not supported`);return n.
coerceUndefinedToNull===!0?new oe($.null,null,1):new oe($.undefined,void 0,1)}function x4(t,e,r,n){if(n.allowIndefinite===
!1)throw new Error(`${ce} indefinite length items not allowed`);return new oe($.break,void 0,1)}function Np(t,e,r){if(r){
if(r.allowNaN===!1&&Number.isNaN(t))throw new Error(`${ce} NaN values are not supported`);if(r.allowInfinity===!1&&(t===
1/0||t===-1/0))throw new Error(`${ce} Infinity values are not supported`)}return new oe($.float,t,e)}function S4(t,e,r,n){
return Np(Ad(t,e+1),3,n)}function A4(t,e,r,n){return Np(Id(t,e+1),5,n)}function I4(t,e,r,n){return Np(Mv(t,e+1),9,n)}function Sd(t,e,r){
const n=e.value;if(n===!1)t.pushByte($.float.majorEncoded|Bp);else if(n===!0)t.pushByte($.float.majorEncoded|Lp);else if(n===
null)t.pushByte($.float.majorEncoded|Dp);else if(n===void 0)t.pushByte($.float.majorEncoded|$p);else{let s,i=!1;(!r||r.float64!==
!0)&&(Pp(n),s=Ad(Bt,1),n===s||Number.isNaN(n)?(Bt[0]=249,t.push(Bt.slice(0,3)),i=!0):(Op(n),s=Id(Bt,1),n===s&&(Bt[0]=250,
t.push(Bt.slice(0,5)),i=!0))),i||(Tv(n),s=Mv(Bt,1),Bt[0]=251,t.push(Bt.slice(0,9)))}}Sd.encodedSize=function(e,r){const n=e.
value;if(n===!1||n===!0||n===null||n===void 0)return 1;if(!r||r.float64!==!0){Pp(n);let s=Ad(Bt,1);if(n===s||Number.isNaN(
n))return 3;if(Op(n),s=Id(Bt,1),n===s)return 5}return 9};const Rv=new ArrayBuffer(9),Zr=new DataView(Rv,1),Bt=new Uint8Array(
Rv,0);function Pp(t){if(t===1/0)Zr.setUint16(0,31744,!1);else if(t===-1/0)Zr.setUint16(0,64512,!1);else if(Number.isNaN(
t))Zr.setUint16(0,32256,!1);else{Zr.setFloat32(0,t);const e=Zr.getUint32(0),r=(e&2139095040)>>23,n=e&8388607;if(r===255)
Zr.setUint16(0,31744,!1);else if(r===0)Zr.setUint16(0,(e&2147483648)>>16|n>>13,!1);else{const s=r-127;s<-24?Zr.setUint16(
0,0):s<-14?Zr.setUint16(0,(e&2147483648)>>16|1<<24+s,!1):Zr.setUint16(0,(e&2147483648)>>16|s+15<<10|n>>13,!1)}}}function Ad(t,e){
if(t.length-e<2)throw new Error(`${ce} not enough data for float16`);const r=(t[e]<<8)+t[e+1];if(r===31744)return 1/0;if(r===
64512)return-1/0;if(r===32256)return NaN;const n=r>>10&31,s=r&1023;let i;return n===0?i=s*2**-24:n!==31?i=(s+1024)*2**(n-
25):i=s===0?1/0:NaN,r&32768?-i:i}function Op(t){Zr.setFloat32(0,t,!1)}function Id(t,e){if(t.length-e<4)throw new Error(`${ce}\
 not enough data for float32`);const r=(t.byteOffset||0)+e;return new DataView(t.buffer,r,4).getFloat32(0,!1)}function Tv(t){
Zr.setFloat64(0,t,!1)}function Mv(t,e){if(t.length-e<8)throw new Error(`${ce} not enough data for float64`);const r=(t.byteOffset||
0)+e;return new DataView(t.buffer,r,8).getFloat64(0,!1)}function _4(t,e){const r=t.value;if(r===!1)return Uint8Array.of(
$.float.majorEncoded|Bp);if(r===!0)return Uint8Array.of($.float.majorEncoded|Lp);if(r===null)return Uint8Array.of($.float.
majorEncoded|Dp);if(r===void 0)return Uint8Array.of($.float.majorEncoded|$p);if(!e){if(Pp(r),r===Ad(Bt,1)||Number.isNaN(
r))return Bt[0]=249,Bt.slice(0,3);if(Op(r),r===Id(Bt,1))return Bt[0]=250,Bt.slice(0,5)}return Tv(r),Bt[0]=251,Bt.slice(0,
9)}function ub(t,e){const r=t,n=e?.float64===!0,s=n?r._keyBytesFloat64:r._keyBytes;if(s!==void 0)return s;const i=_4(t,n);
return n?r._keyBytesFloat64=i:r._keyBytes=i,i}Sd.compareTokens=function(e,r,n){const s=ub(e,n),i=ub(r,n);return s.length!==
i.length?s.length<i.length?-1:1:_v(s,i)};function He(t,e,r){throw new Error(`${ce} encountered invalid minor (${r}) for \
major ${t[e]>>>5}`)}function _d(t){return()=>{throw new Error(`${ce} ${t}`)}}const ne=[];for(let t=0;t<=23;t++)ne[t]=He;
ne[24]=N5;ne[25]=P5;ne[26]=O5;ne[27]=U5;ne[28]=He;ne[29]=He;ne[30]=He;ne[31]=He;for(let t=32;t<=55;t++)ne[t]=He;ne[56]=F5;
ne[57]=z5;ne[58]=q5;ne[59]=j5;ne[60]=He;ne[61]=He;ne[62]=He;ne[63]=He;for(let t=64;t<=87;t++)ne[t]=G5;ne[88]=W5;ne[89]=H5;
ne[90]=V5;ne[91]=K5;ne[92]=He;ne[93]=He;ne[94]=He;ne[95]=_d("indefinite length bytes/strings are not supported");for(let t=96;t<=
119;t++)ne[t]=Z5;ne[120]=e4;ne[121]=t4;ne[122]=r4;ne[123]=n4;ne[124]=He;ne[125]=He;ne[126]=He;ne[127]=_d("indefinite len\
gth bytes/strings are not supported");for(let t=128;t<=151;t++)ne[t]=i4;ne[152]=o4;ne[153]=a4;ne[154]=c4;ne[155]=l4;ne[156]=
He;ne[157]=He;ne[158]=He;ne[159]=d4;for(let t=160;t<=183;t++)ne[t]=u4;ne[184]=f4;ne[185]=h4;ne[186]=p4;ne[187]=m4;ne[188]=
He;ne[189]=He;ne[190]=He;ne[191]=g4;for(let t=192;t<=215;t++)ne[t]=b4;ne[216]=y4;ne[217]=w4;ne[218]=v4;ne[219]=E4;ne[220]=
He;ne[221]=He;ne[222]=He;ne[223]=He;for(let t=224;t<=243;t++)ne[t]=_d("simple values are not supported");ne[244]=He;ne[245]=
He;ne[246]=He;ne[247]=k4;ne[248]=_d("simple values are not supported");ne[249]=S4;ne[250]=A4;ne[251]=I4;ne[252]=He;ne[253]=
He;ne[254]=He;ne[255]=x4;const Nn=[];for(let t=0;t<24;t++)Nn[t]=new oe($.uint,t,1);for(let t=-1;t>=-24;t--)Nn[31-t]=new oe(
$.negint,t,1);Nn[64]=new oe($.bytes,new Uint8Array(0),1);Nn[96]=new oe($.string,"",1);Nn[128]=new oe($.array,0,1);Nn[160]=
new oe($.map,0,1);Nn[244]=new oe($.false,!1,1);Nn[245]=new oe($.true,!0,1);Nn[246]=new oe($.null,null,1);function C4(t){
switch(t.type){case $.false:return Fn([244]);case $.true:return Fn([245]);case $.null:return Fn([246]);case $.bytes:return t.
value.length?void 0:Fn([64]);case $.string:return t.value===""?Fn([96]):void 0;case $.array:return t.value===0?Fn([128]):
void 0;case $.map:return t.value===0?Fn([160]):void 0;case $.uint:return t.value<24?Fn([Number(t.value)]):void 0;case $.
negint:if(t.value>=-24)return Fn([31-Number(t.value)])}}const R4={float64:!1,mapSorter:Up,quickEncodeToken:C4};function T4(){
const t=[];return t[$.uint.major]=ao,t[$.negint.major]=Cp,t[$.bytes.major]=xd,t[$.string.major]=s4,t[$.array.major]=Rp,t[$.
map.major]=Tp,t[$.tag.major]=Mp,t[$.float.major]=Sd,t}const Oi=T4(),Uc=new Cl;let Fc=!1;class Qi{constructor(e,r){this.obj=
e,this.parent=r}includes(e){let r=this;do if(r.obj===e)return!0;while(r=r.parent);return!1}static createCheck(e,r){if(e&&
e.includes(r))throw new Error(`${Pi} object contains circular references`);return new Qi(r,e)}}const hs={null:new oe($.null,
null),undefined:new oe($.undefined,void 0),true:new oe($.true,!0),false:new oe($.false,!1),emptyArray:new oe($.array,0),
emptyMap:new oe($.map,0)},$n={number(t,e,r,n){return!Number.isInteger(t)||!Number.isSafeInteger(t)?new oe($.float,t):t>=
0?new oe($.uint,t):new oe($.negint,t)},bigint(t,e,r,n){return t>=BigInt(0)?new oe($.uint,t):new oe($.negint,t)},Uint8Array(t,e,r,n){
return new oe($.bytes,t)},string(t,e,r,n){return new oe($.string,t)},boolean(t,e,r,n){return t?hs.true:hs.false},null(t,e,r,n){
return hs.null},undefined(t,e,r,n){return hs.undefined},ArrayBuffer(t,e,r,n){return new oe($.bytes,new Uint8Array(t))},DataView(t,e,r,n){
return new oe($.bytes,new Uint8Array(t.buffer,t.byteOffset,t.byteLength))},Array(t,e,r,n){if(!t.length)return r.addBreakTokens===
!0?[hs.emptyArray,new oe($.break)]:hs.emptyArray;n=Qi.createCheck(n,t);const s=[];let i=0;for(const o of t)s[i++]=Ri(o,r,
n);return r.addBreakTokens?[new oe($.array,t.length),s,new oe($.break)]:[new oe($.array,t.length),s]},Object(t,e,r,n){const s=e!==
"Object",i=s?t.keys():Object.keys(t),o=s?t.size:i.length;let a;if(o){a=new Array(o),n=Qi.createCheck(n,t);const c=!s&&r.
ignoreUndefinedProperties;let l=0;for(const d of i){const u=s?t.get(d):t[d];c&&u===void 0||(a[l++]=[Ri(d,r,n),Ri(u,r,n)])}
l<o&&(a.length=l)}return a?.length?(M4(a,r),r.addBreakTokens?[new oe($.map,a.length),a,new oe($.break)]:[new oe($.map,a.
length),a]):r.addBreakTokens===!0?[hs.emptyMap,new oe($.break)]:hs.emptyMap},Tagged(t,e,r,n){return[new oe($.tag,t.tag),
Ri(t.value,r,n)]}};$n.Map=$n.Object;$n.Buffer=$n.Uint8Array;for(const t of"Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 B\
igUint64 BigInt64 Float32 Float64".split(" "))$n[`${t}Array`]=$n.DataView;function Ri(t,e={},r){const n=Iv(t),s=e&&e.typeEncoders&&
e.typeEncoders[n]||$n[n];if(typeof s=="function"){const o=s(t,n,e,r);if(o!=null)return o}const i=$n[n];if(!i)throw new Error(
`${Pi} unsupported type: ${n}`);return i(t,n,e,r)}function M4(t,e){const r=e.mapSorter;r&&t.sort((n,s)=>r(n,s,e))}function Up(t,e,r){
const n=Array.isArray(t[0])?t[0][0]:t[0],s=Array.isArray(e[0])?e[0][0]:e[0];if(n.type.major!==s.type.major)return n.type.
compare(s.type);const i=n.type.major,o=Oi[i].compareTokens(n,s,r);return o===0&&console.warn("WARNING: complex key types\
 used, CBOR key sorting guarantees are gone"),o}function Ui(t,e,r,n){if(Array.isArray(e))for(const s of e)Ui(t,s,r,n);else
r[e.type.major](t,e,n)}const fb=$.uint.majorEncoded,hb=$.negint.majorEncoded,B4=$.bytes.majorEncoded,L4=$.string.majorEncoded,
pb=$.array.majorEncoded,vu=$.map.majorEncoded,D4=$.float.majorEncoded|Bp,$4=$.float.majorEncoded|Lp,N4=$.float.majorEncoded|
Dp,P4=$.float.majorEncoded|$p,O4=BigInt(-1),U4=BigInt(1);function ks(t,e,r){r<24?t.pushByte(e|Number(r)):Vr(t,e,r)}function F4(t){
return t.addBreakTokens!==!0}function z4(t,e,r,n,s){const i=r==="Map",o=i?e.keys():Object.keys(e),a=i?e.size:o.length;if(!a){
t.pushByte(vu);return}s=Qi.createCheck(s,e);const c=!i&&n.ignoreUndefinedProperties,l=new Array(a);let d=0;for(const u of o){
const h=i?e.get(u):e[u];c&&h===void 0||(l[d++]=[Ri(u,n,s),h])}if(d===0){t.pushByte(vu);return}d<a&&(l.length=d),l.sort((u,h)=>Up(
u,h,n)),ks(t,vu,d);for(const[u,h]of l)Ui(t,u,Oi,n),Tl(t,h,n,s)}function Tl(t,e,r,n){const s=Iv(e),i=r.typeEncoders&&r.typeEncoders[s];
if(i){const o=i(e,s,r,n);if(o!=null){Ui(t,o,Oi,r);return}}switch(s){case"null":t.pushByte(N4);return;case"undefined":t.pushByte(
P4);return;case"boolean":t.pushByte(e?$4:D4);return;case"number":!Number.isInteger(e)||!Number.isSafeInteger(e)?Sd(t,new oe(
$.float,e),r):e>=0?ks(t,fb,e):ks(t,hb,e*-1-1);return;case"bigint":e>=BigInt(0)?ks(t,fb,e):ks(t,hb,e*O4-U4);return;case"s\
tring":{const o=Ip(e);ks(t,L4,o.length),t.push(o);return}case"Uint8Array":ks(t,B4,e.length),t.push(e);return;case"Array":
if(!e.length){t.pushByte(pb);return}n=Qi.createCheck(n,e),ks(t,pb,e.length);for(const o of e)Tl(t,o,r,n);return;case"Obj\
ect":case"Map":if(r.mapSorter===Up)z4(t,e,s,r,n);else{const o=$n.Object(e,s,r,n);Ui(t,o,Oi,r)}return;default:{const o=$n[s];
if(!o)throw new Error(`${Pi} unsupported type: ${s}`);const a=o(e,s,r,n);Ui(t,a,Oi,r)}}}function q4(t,e,r,n){const s=n instanceof
Uint8Array;let i=s?new $5(n):Fc?new Cl:Uc;const o=Ri(t,r);if(!Array.isArray(o)&&r.quickEncodeToken){const a=r.quickEncodeToken(
o);if(a)return s?(i.push(a),i.toBytes()):a;const c=e[o.type.major];if(c.encodedSize){const l=c.encodedSize(o,r);if(s||(i=
new Cl(l)),c(i,o,r),i.chunks.length!==1)throw new Error(`Unexpected error: pre-calculated length for ${o} was wrong`);return s?
i.toBytes():kd(i.chunks[0])}}return i.reset(),Ui(i,o,e,r),i.toBytes(!0)}function xO(t,e){if(e=Object.assign({},R4,e),F4(
e)){if(Fc){const r=new Cl;return Tl(r,t,e,void 0),r.toBytes()}Fc=!0;try{return Uc.reset(),Tl(Uc,t,e,void 0),Uc.toBytes(!0)}finally{
Fc=!1}}return q4(t,Oi,e)}const j4={strict:!1,allowIndefinite:!0,allowUndefined:!0,allowBigInt:!0};class G4{constructor(e,r={}){
this._pos=0,this.data=e,this.options=r}pos(){return this._pos}done(){return this._pos>=this.data.length}next(){const e=this.
data[this._pos];let r=Nn[e];if(r===void 0){const n=ne[e];if(!n)throw e===void 0?new Error(`${ce} not enough data`):new Error(
`${ce} no decoder for major type ${e>>>5} (byte 0x${e.toString(16).padStart(2,"0")})`);const s=e&31;r=n(this.data,this._pos,
s,this.options)}return this._pos+=r.encodedLength,r}}const zs=Symbol.for("DONE"),qs=Symbol.for("BREAK");function W4(t,e,r){
const n=[];for(let s=0;s<t.value;s++){const i=ci(e,r);if(i===qs){if(t.value===1/0)break;throw new Error(`${ce} got unexp\
ected break to lengthed array`)}if(i===zs)throw new Error(`${ce} found array but not enough entries (got ${s}, expected ${t.
value})`);n[s]=i}return n}function H4(t,e,r){const n=r.useMaps===!0,s=r.rejectDuplicateMapKeys===!0,i=n?void 0:{},o=n?new Map:
void 0;for(let a=0;a<t.value;a++){const c=ci(e,r);if(c===qs){if(t.value===1/0)break;throw new Error(`${ce} got unexpecte\
d break to lengthed map`)}if(c===zs)throw new Error(`${ce} found map but not enough entries (got ${a} [no key], expected\
 ${t.value})`);if(!n&&typeof c!="string")throw new Error(`${ce} non-string keys not supported (got ${typeof c})`);if(s&&
(n&&o.has(c)||!n&&Object.hasOwn(i,c)))throw new Error(`${ce} found repeat map key "${c}"`);const l=ci(e,r);if(l===zs)throw new Error(
`${ce} found map but not enough entries (got ${a} [no value], expected ${t.value})`);if(l===qs)throw new Error(`${ce} go\
t unexpected break to map value`);n?o.set(c,l):c==="__proto__"?Object.defineProperty(i,c,{value:l,configurable:!0,enumerable:!0,
writable:!0}):i[c]=l}return n?o:i}function*V4(t,e,r){for(let n=0;n<t.value;n++){const s=ci(e,r);if(s===qs){if(t.value===
1/0)break;throw new Error(`${ce} got unexpected break to lengthed map`)}if(s===zs)throw new Error(`${ce} found map but n\
ot enough entries (got ${n} [no key], expected ${t.value})`);const i=ci(e,r);if(i===zs)throw new Error(`${ce} found map \
but not enough entries (got ${n} [no value], expected ${t.value})`);if(i===qs)throw new Error(`${ce} got unexpected brea\
k to map value`);yield[s,i]}}function K4(t,e){const r=function(){if(r._called)throw new Error(`${ce} tag decode() may on\
ly be called once`);r._called=!0;const n=ci(t,e);if(n===zs)throw new Error(`${ce} tag content missing`);if(n===qs)throw new Error(
`${ce} got unexpected break in tag content`);return n};return r.entries=function(){if(r._called)throw new Error(`${ce} t\
ag decode() may only be called once`);if(r._called=!0,t.done())throw new Error(`${ce} tag content missing`);const n=t.next();
if(!$.equals(n.type,$.map))throw new Error(`${ce} entries() requires map content, got ${n.type.name}`);const s=[];for(const i of V4(
n,t,e))s.push(i);return s},r._called=!1,r}function ci(t,e){if(t.done())return zs;const r=t.next();if($.equals(r.type,$.break))
return qs;if(r.type.terminal)return r.value;if($.equals(r.type,$.array))return W4(r,t,e);if($.equals(r.type,$.map))return H4(
r,t,e);if($.equals(r.type,$.tag)){if(e.tags&&typeof e.tags[r.value]=="function"){const n=K4(t,e),s=e.tags[r.value](n);if(!n.
_called)throw new Error(`${ce} tag decoder must call decode() or entries()`);return s}throw new Error(`${ce} tag not sup\
ported (${r.value})`)}throw new Error("unsupported")}function Q4(t,e){if(!(t instanceof Uint8Array))throw new Error(`${ce}\
 data to decode must be a Uint8Array`);e=Object.assign({},j4,e);const r=kd(t),n=e.tokenizer||new G4(r,e),s=ci(n,e);if(s===
zs)throw new Error(`${ce} did not find any content to decode`);if(s===qs)throw new Error(`${ce} got unexpected break`);return[
s,t.subarray(n.pos())]}function Bv(t,e){const[r,n]=Q4(t,e);if(n.length>0)throw new Error(`${ce} too many terminals, data\
 makes no sense`);return r}function J4(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)
if(t[r]!==e[r])return!1;return!0}function Fp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Ma(
t);if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return Ma(new Uint8Array(t.buffer,t.byteOffset,
t.byteLength));throw new Error("Unknown type, must be binary type")}function X4(t){return t?.buffer instanceof ArrayBuffer}
function Ma(t){return X4(t)?t:t.slice()}function Y4(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-
E;R!==S&&v[R]===0;)R++;for(var N=u.repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.
length-y)*h+1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){
for(var C=x-k;C!==x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(
f);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var Z4=Y4,eR=Z4;let tR=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},rR=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Lv(this,e)}},
nR=class{decoders;constructor(e){this.decoders=e}or(e){return Lv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Lv(t,e){return new nR({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let sR=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new tR(e,r,n),this.decoder=new rR(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Dv({name:t,prefix:e,encode:r,decode:n}){return new sR(t,e,r,
n)}function Cd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=eR(r,t,n);return Dv({prefix:e,
name:t,encode:s,decode:o=>Fp(i(o))})}function iR(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function oR(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function aR(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function os({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=aR(n,s);return Dv(
{prefix:e,name:t,encode(o){return oR(o,n,r)},decode(o){return iR(o,i,r,t)}})}const zc=os({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});os({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});os({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});os({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});os({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});os({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});os({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});os({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});os({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Eu=Cd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Cd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const _s=Cd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Cd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var cR=$v,mb=128,lR=-128,dR=Math.pow(2,31);function $v(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=dR;)e[r++]=t&255|mb,t/=128;for(;t&lR;)e[r++]=t&255|mb,t>>>=7;return e[r]=t|0,$v.bytes=r-n+1,e}var uR=Yf,
fR=128,gb=127;function Yf(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Yf.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&gb)<<s:(o&gb)*Math.pow(2,s),s+=7}while(o>=fR);return Yf.bytes=i-n,r}var hR=Math.pow(
2,7),pR=Math.pow(2,14),mR=Math.pow(2,21),gR=Math.pow(2,28),bR=Math.pow(2,35),yR=Math.pow(2,42),wR=Math.pow(2,49),vR=Math.
pow(2,56),ER=Math.pow(2,63),kR=function(t){return t<hR?1:t<pR?2:t<mR?3:t<gR?4:t<bR?5:t<yR?6:t<wR?7:t<vR?8:t<ER?9:10},xR={
encode:cR,decode:uR,encodingLength:kR},Ml=xR;function Zf(t,e=0){const r=Ml.decode(t,e),n=Ml.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function Bl(t,e,r=0){return Ml.encode(t,e,r),e}function Ll(t){return Ml.encodingLength(t)}function SR(t,e){const r=e.
byteLength,n=Ll(t),s=n+Ll(r),i=new Uint8Array(s+r);return Bl(t,i,0),Bl(r,i,n),i.set(e,s),new zp(t,r,e,i)}function AR(t){
const e=Fp(t),[r,n]=Zf(e),[s,i]=Zf(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new zp(r,s,o,e)}function IR(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&J4(t.bytes,r.bytes)}}let zp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ma(n),this.bytes=Ma(s)}};function bb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return CR(r,eh(t),e??_s.encoder);default:
return RR(r,eh(t),e??zc.encoder)}}const yb=new WeakMap;function eh(t){const e=yb.get(t);if(e==null){const r=new Map;return yb.
set(t,r),r}return e}let Nv=class lr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ma(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
ko)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==TR)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return lr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=SR(e,
r);return lr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return lr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&IR(e.multihash,n.multihash)}toString(e){return bb(this,e)}toJSON(){return{"/":bb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof lr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new lr(n,s,i,o??wb(n,s,i.bytes))}else if(r[MR]===!0){const{version:n,
multihash:s,code:i}=r,o=AR(s);return lr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==ko)throw new Error(`Version 0 CID must use dag-pb (code: ${ko}) block encoding`);return new lr(e,r,n,n.bytes)}case 1:{
const s=wb(e,r,n.bytes);return new lr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return lr.
create(0,ko,e)}static createV1(e,r){return lr.create(1,e,r)}static decode(e){const[r,n]=lr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=lr.inspectBytes(e),n=r.size-r.multihashSize,
s=Fp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new zp(r.multihashCode,r.digestSize,i,s);return[r.version===0?lr.createV0(o):lr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=Zf(e.subarray(r));return r+=h,u};let s=n(),
i=ko;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=_R(e,r),
i=lr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return eh(
i).set(n,e),i}};function _R(t,e){switch(t[0]){case"Q":{const r=e??_s;return[_s.prefix,r.decode(`${_s.prefix}${t}`)]}case _s.
prefix:{const r=e??_s;return[_s.prefix,r.decode(t)]}case zc.prefix:{const r=e??zc;return[zc.prefix,r.decode(t)]}case Eu.
prefix:{const r=e??Eu;return[Eu.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function CR(t,e,r){const{prefix:n}=r;if(n!==
_s.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function RR(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const ko=112,TR=18;function wb(t,e,r){const n=Ll(t),s=n+Ll(e),i=new Uint8Array(s+r.
byteLength);return Bl(t,i,0),Bl(e,i,n),i.set(r,s),i}const MR=Symbol.for("@ipld/js-cid/CID"),Pv=42;function BR(t){return t instanceof
ArrayBuffer?new Uint8Array(t,0,t.byteLength):t}function LR(t){if(t.asCID!==t&&t["/"]!==t.bytes)return null;const e=Nv.asCID(
t);if(!e)return null;const r=new Uint8Array(e.bytes.byteLength+1);return r.set(e.bytes,1),[new oe($.tag,Pv),new oe($.bytes,
r)]}function DR(){throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")}function $R(t){
if(Number.isNaN(t))throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");if(t===1/0||t===
-1/0)throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");return null}
function NR(t){for(const e of t.keys())if(typeof e!="string"||e.length===0)throw new Error("Non-string Map keys are not \
supported by the IPLD Data Model and cannot be encoded");return null}const PR={typeEncoders:{Map:NR,Object:LR,undefined:DR,
number:$R}};({...PR.typeEncoders});function OR(t){const e=t();if(e[0]!==0)throw new Error("Invalid CID for CBOR tag 42; \
expected leading 0x00");return Nv.decode(e.subarray(1))}const th={allowIndefinite:!1,coerceUndefinedToNull:!0,allowNaN:!1,
allowInfinity:!1,allowBigInt:!0,strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{[Pv]:OR}};({...th,tags:{...th.tags}});
const Ov=113,Uv=t=>Bv(BR(t),th);class RO extends Array{constructor(){super(),this.inRecursive=[]}prefix(e){const r=this.
inRecursive[this.inRecursive.length-1];r&&($.equals(r.type,$.array)&&(r.elements++,r.elements!==1&&e.push([44])),$.equals(
r.type,$.map)&&(r.elements++,r.elements!==1&&(r.elements%2===1?e.push([44]):e.push([58]))))}[$.uint.major](e,r){this.prefix(
e);const n=String(r.value),s=[];for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);e.push(s)}[$.negint.major](e,r){this[$.uint.
major](e,r)}[$.bytes.major](e,r){throw new Error(`${Pi} unsupported type: Uint8Array`)}[$.string.major](e,r){this.prefix(
e);const n=Ip(JSON.stringify(r.value));e.push(n.length>32?kd(n):n)}[$.array.major](e,r){this.prefix(e),this.inRecursive.
push({type:$.array,elements:0}),e.push([91])}[$.map.major](e,r){this.prefix(e),this.inRecursive.push({type:$.map,elements:0}),
e.push([123])}[$.tag.major](e,r){}[$.float.major](e,r){if(r.type.name==="break"){const o=this.inRecursive.pop();if(o){if($.
equals(o.type,$.array))e.push([93]);else if($.equals(o.type,$.map))e.push([125]);else throw new Error("Unexpected recurs\
ive type; this should not happen!");return}throw new Error("Unexpected break; this should not happen!")}if(r.value===void 0)
throw new Error(`${Pi} unsupported type: undefined`);if(this.prefix(e),r.type.name==="true"){e.push([116,114,117,101]);return}else if(r.
type.name==="false"){e.push([102,97,108,115,101]);return}else if(r.type.name==="null"){e.push([110,117,108,108]);return}
if(typeof r.value=="number"&&!Number.isFinite(r.value))throw new Error(`${Pi} unsupported type: ${r.value}`);const n=String(
r.value),s=[];let i=!1;for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o),!i&&(s[o]===46||s[o]===101||s[o]===69)&&(i=!0);i||
(s.push(46),s.push(48)),e.push(s)}}const vb=1e3;class Fv{constructor(e,r={}){this._pos=0,this.data=e,this.options=r,this.
modeStack=["value"],this.lastToken=""}pos(){return this._pos}done(){return this._pos>=this.data.length}ch(){return this.
data[this._pos]}currentMode(){return this.modeStack[this.modeStack.length-1]}skipWhitespace(){let e=this.ch();for(;e===32||
e===9||e===13||e===10;)e=this.data[++this._pos]}expect(e){if(this.data.length-this._pos<e.length)throw new Error(`${ce} \
unexpected end of input at position ${this._pos}`);for(let r=0;r<e.length;r++)if(this.data[this._pos++]!==e[r])throw new Error(
`${ce} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`)}parseNumber(){const e=this.
_pos;let r=!1,n=!1;const s=a=>{for(;!this.done();){const c=this.ch();if(a.includes(c))this._pos++;else break}};if(this.ch()===
45&&(r=!0,this._pos++),this.ch()===48)if(this._pos++,this.ch()===46)this._pos++,n=!0;else return new oe($.uint,0,this._pos-
e);if(s([48,49,50,51,52,53,54,55,56,57]),r&&this._pos===e+1)throw new Error(`${ce} unexpected token at position ${this._pos}`);
if(!this.done()&&this.ch()===46){if(n)throw new Error(`${ce} unexpected token at position ${this._pos}`);n=!0,this._pos++,
s([48,49,50,51,52,53,54,55,56,57])}if(!this.done()&&(this.ch()===101||this.ch()===69)&&(n=!0,this._pos++,!this.done()&&(this.
ch()===43||this.ch()===45)&&this._pos++,s([48,49,50,51,52,53,54,55,56,57])),this._pos-e>vb)throw new Error(`${ce} number\
 at position ${e} exceeds ${vb} characters`);const i=String.fromCharCode.apply(null,this.data.subarray(e,this._pos)),o=parseFloat(
i);if(n){if(this.options.allowInfinity===!1&&!Number.isFinite(o))throw new Error(`${ce} Infinity values are not supporte\
d`);return new oe($.float,o,this._pos-e)}if(this.options.allowBigInt!==!0||Number.isSafeInteger(o)){if(!Number.isFinite(
o))throw new Error(`${ce} integer at position ${e} is too large for a Number, use allowBigInt`);return new oe(o>=0?$.uint:
$.negint,o,this._pos-e)}return new oe(o>=0?$.uint:$.negint,BigInt(i),this._pos-e)}parseString(){if(this.ch()!==34)throw new Error(
`${ce} unexpected character at position ${this._pos}; this shouldn't happen`);this._pos++;for(let i=this._pos,o=0;i<this.
data.length&&o<65536;i++,o++){const a=this.data[i];if(a===92||a<32||a>=128)break;if(a===34){const c=String.fromCharCode.
apply(null,this.data.subarray(this._pos,i));return this._pos=i+1,new oe($.string,c,o)}}const e=this._pos,r=[],n=()=>{if(this.
_pos+4>=this.data.length)throw new Error(`${ce} unexpected end of unicode escape sequence at position ${this._pos}`);let i=0;
for(let o=0;o<4;o++){let a=this.ch();if(a>=48&&a<=57)a-=48;else if(a>=97&&a<=102)a=a-97+10;else if(a>=65&&a<=70)a=a-65+10;else
throw new Error(`${ce} unexpected unicode escape character at position ${this._pos}`);i=i*16+a,this._pos++}return i},s=()=>{
const i=this.ch();let o=null,a=i>239?4:i>223?3:i>191?2:1;if(this._pos+a>this.data.length)throw new Error(`${ce} unexpect\
ed unicode sequence at position ${this._pos}`);let c,l,d,u;switch(a){case 1:i<128&&(o=i);break;case 2:c=this.data[this._pos+
1],(c&192)===128&&(u=(i&31)<<6|c&63,u>127&&(o=u));break;case 3:c=this.data[this._pos+1],l=this.data[this._pos+2],(c&192)===
128&&(l&192)===128&&(u=(i&15)<<12|(c&63)<<6|l&63,u>2047&&(u<55296||u>57343)&&(o=u));break;case 4:c=this.data[this._pos+1],
l=this.data[this._pos+2],d=this.data[this._pos+3],(c&192)===128&&(l&192)===128&&(d&192)===128&&(u=(i&15)<<18|(c&63)<<12|
(l&63)<<6|d&63,u>65535&&u<1114112&&(o=u))}if(o===null){if(this.options.strictUtf8===!0)throw new Error(`${ce} invalid UT\
F-8 in text string at position ${this._pos}`);o=65533,a=1}else o>65535&&(o-=65536,r.push(o>>>10&1023|55296),o=56320|o&1023);
r.push(o),this._pos+=a};for(;!this.done();){const i=this.ch();let o;switch(i){case 92:if(this._pos++,this.done())throw new Error(
`${ce} unexpected string termination at position ${this._pos}`);switch(o=this.ch(),this._pos++,o){case 34:case 39:case 92:case 47:
r.push(o);break;case 98:r.push(8);break;case 116:r.push(9);break;case 110:r.push(10);break;case 102:r.push(12);break;case 114:
r.push(13);break;case 117:r.push(n());break;default:throw new Error(`${ce} unexpected string escape character at positio\
n ${this._pos}`)}break;case 34:return this._pos++,new oe($.string,L5(r),this._pos-e);default:if(i<32)throw new Error(`${ce}\
 invalid control character at position ${this._pos}`);i<128?(r.push(i),this._pos++):s()}}throw new Error(`${ce} unexpect\
ed end of string at position ${this._pos}`)}parseValue(){switch(this.ch()){case 123:return this.modeStack.push("obj-star\
t"),this._pos++,new oe($.map,1/0,1);case 91:return this.modeStack.push("array-start"),this._pos++,new oe($.array,1/0,1);case 34:
return this.parseString();case 110:return this.expect([110,117,108,108]),new oe($.null,null,4);case 102:return this.expect(
[102,97,108,115,101]),new oe($.false,!1,5);case 116:return this.expect([116,114,117,101]),new oe($.true,!0,4);case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
return this.parseNumber();default:throw new Error(`${ce} unexpected character at position ${this._pos}`)}}next(){switch(this.
skipWhitespace(),this.currentMode()){case"value":return this.modeStack.pop(),this.parseValue();case"array-value":{if(this.
modeStack.pop(),this.ch()===93)return this._pos++,this.skipWhitespace(),new oe($.break,void 0,1);if(this.ch()!==44)throw new Error(
`${ce} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.
ch())}'`);return this._pos++,this.modeStack.push("array-value"),this.skipWhitespace(),this.parseValue()}case"array-start":
return this.modeStack.pop(),this.ch()===93?(this._pos++,this.skipWhitespace(),new oe($.break,void 0,1)):(this.modeStack.
push("array-value"),this.skipWhitespace(),this.parseValue());case"obj-key":if(this.ch()===125)return this.modeStack.pop(),
this._pos++,this.skipWhitespace(),new oe($.break,void 0,1);if(this.ch()!==44)throw new Error(`${ce} unexpected character\
 at position ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);this._pos++,this.
skipWhitespace();case"obj-start":{if(this.modeStack.pop(),this.ch()===125)return this._pos++,this.skipWhitespace(),new oe(
$.break,void 0,1);const e=this.parseString();if(this.skipWhitespace(),this.ch()!==58)throw new Error(`${ce} unexpected c\
haracter at position ${this._pos}, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);
return this._pos++,this.modeStack.push("obj-value"),e}case"obj-value":return this.modeStack.pop(),this.modeStack.push("o\
bj-key"),this.skipWhitespace(),this.parseValue();default:throw new Error(`${ce} unexpected parse state at position ${this.
_pos}; this shouldn't happen`)}}}function UR(t,e){return e=Object.assign({tokenizer:new Fv(t,e)},e),Bv(t,e)}function FR(t,e){
if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}
function qp(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return Ba(t);if(t instanceof ArrayBuffer)return new Uint8Array(
t);if(ArrayBuffer.isView(t))return Ba(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error("Unknown type,\
 must be binary type")}function zR(t){return t?.buffer instanceof ArrayBuffer}function Ba(t){return zR(t)?t:t.slice()}function qR(t,e,r){
if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,r){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),
h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>
0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-E;R!==S&&v[R]===0;)R++;for(var N=u.
repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.length-y)*h+
1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&I!==-1;I--,w++)
v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){for(var C=x-k;C!==
x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(f);if(y)return y;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var jR=qR,GR=jR;let WR=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},HR=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return zv(this,e)}},
VR=class{decoders;constructor(e){this.decoders=e}or(e){return zv(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function zv(t,e){return new VR({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let KR=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new WR(e,r,n),this.decoder=new HR(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function qv({name:t,prefix:e,encode:r,decode:n}){return new KR(t,e,r,
n)}function Rd({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=GR(r,t,n);return qv({prefix:e,
name:t,encode:s,decode:o=>qp(i(o))})}function QR(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function JR(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function XR(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function Kr({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=XR(n,s);return qv(
{prefix:e,name:t,encode(o){return JR(o,n,r)},decode(o){return QR(o,i,r,t)}})}const qc=Kr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Kr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Kr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Kr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const ku=Rd(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Rd({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Cs=Rd({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Rd({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var YR=jv,Eb=128,ZR=-128,eT=Math.pow(2,31);function jv(t,e,r){e=e||[],r=
r||0;for(var n=r;t>=eT;)e[r++]=t&255|Eb,t/=128;for(;t&ZR;)e[r++]=t&255|Eb,t>>>=7;return e[r]=t|0,jv.bytes=r-n+1,e}var tT=rh,
rT=128,kb=127;function rh(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw rh.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&kb)<<s:(o&kb)*Math.pow(2,s),s+=7}while(o>=rT);return rh.bytes=i-n,r}var nT=Math.pow(
2,7),sT=Math.pow(2,14),iT=Math.pow(2,21),oT=Math.pow(2,28),aT=Math.pow(2,35),cT=Math.pow(2,42),lT=Math.pow(2,49),dT=Math.
pow(2,56),uT=Math.pow(2,63),fT=function(t){return t<nT?1:t<sT?2:t<iT?3:t<oT?4:t<aT?5:t<cT?6:t<lT?7:t<dT?8:t<uT?9:10},hT={
encode:YR,decode:tT,encodingLength:fT},Dl=hT;function nh(t,e=0){const r=Dl.decode(t,e),n=Dl.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&t[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[r,
n]}function $l(t,e,r=0){return Dl.encode(t,e,r),e}function Nl(t){return Dl.encodingLength(t)}function pT(t,e){const r=e.
byteLength,n=Nl(t),s=n+Nl(r),i=new Uint8Array(s+r);return $l(t,i,0),$l(r,i,n),i.set(e,s),new jp(t,r,e,i)}function mT(t){
const e=qp(t),[r,n]=nh(e),[s,i]=nh(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new jp(r,s,o,e)}function gT(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof
Uint8Array&&FR(t.bytes,r.bytes)}}let jp=class{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=
Ba(n),this.bytes=Ba(s)}};function xb(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return wT(r,sh(t),e??Cs.encoder);default:
return vT(r,sh(t),e??qc.encoder)}}const Sb=new WeakMap;function sh(t){const e=Sb.get(t);if(e==null){const r=new Map;return Sb.
set(t,r),r}return e}let bT=class dr{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.
multihash=n,this.bytes=Ba(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==
xo)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(r.code!==ET)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return dr.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=pT(e,
r);return dr.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return dr.equals(this,e)}static equals(e,r){const n=r;return n!=null&&
e.code===n.code&&e.version===n.version&&gT(e.multihash,n.multihash)}toString(e){return xb(this,e)}toJSON(){return{"/":xb(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const r=e;if(r instanceof dr)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===
r){const{version:n,code:s,multihash:i,bytes:o}=r;return new dr(n,s,i,o??Ab(n,s,i.bytes))}else if(r[kT]===!0){const{version:n,
multihash:s,code:i}=r,o=mT(s);return dr.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(r!==xo)throw new Error(`Version 0 CID must use dag-pb (code: ${xo}) block encoding`);return new dr(e,r,n,n.bytes)}case 1:{
const s=Ab(e,r,n.bytes);return new dr(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return dr.
create(0,xo,e)}static createV1(e,r){return dr.create(1,e,r)}static decode(e){const[r,n]=dr.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return r}static decodeFirst(e){const r=dr.inspectBytes(e),n=r.size-r.multihashSize,
s=qp(e.subarray(n,n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
r.multihashSize-r.digestSize),o=new jp(r.multihashCode,r.digestSize,i,s);return[r.version===0?dr.createV0(o):dr.createV1(
r.codec,o),e.subarray(r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=nh(e.subarray(r));return r+=h,u};let s=n(),
i=xo;if(s===18?(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,
d=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=yT(e,r),
i=dr.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return sh(
i).set(n,e),i}};function yT(t,e){switch(t[0]){case"Q":{const r=e??Cs;return[Cs.prefix,r.decode(`${Cs.prefix}${t}`)]}case Cs.
prefix:{const r=e??Cs;return[Cs.prefix,r.decode(t)]}case qc.prefix:{const r=e??qc;return[qc.prefix,r.decode(t)]}case ku.
prefix:{const r=e??ku;return[ku.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[t[0],e.decode(t)]}}}function wT(t,e,r){const{prefix:n}=r;if(n!==
Cs.prefix)throw Error(`Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).
slice(1);return e.set(n,i),i}else return s}function vT(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(
t);return e.set(n,i),i}else return s}const xo=112,ET=18;function Ab(t,e,r){const n=Nl(t),s=n+Nl(e),i=new Uint8Array(s+r.
byteLength);return $l(t,i,0),$l(e,i,n),i.set(r,s),i}const kT=Symbol.for("@ipld/js-cid/CID"),xT=Kr({prefix:"m",name:"base\
64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});Kr({prefix:"M",name:"bas\
e64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});Kr({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});Kr({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});function ST(t){
return t instanceof ArrayBuffer?new Uint8Array(t,0,t.byteLength):t}class AT extends Fv{constructor(e,r){super(e,r),this.
tokenBuffer=[]}done(){return this.tokenBuffer.length===0&&super.done()}_next(){return this.tokenBuffer.length>0?this.tokenBuffer.
pop():super.next()}next(){const e=this._next();if($.equals(e.type,$.map)){const r=this._next();if($.equals(r.type,$.string)&&
r.value==="/"){const n=this._next();if($.equals(n.type,$.string)){const s=this._next();if(!$.equals(s.type,$.break))throw new Error(
"Invalid encoded CID form");return this.tokenBuffer.push(n),new oe($.tag,42,0)}if($.equals(n.type,$.map)){const s=this._next();
if($.equals(s.type,$.string)&&s.value==="bytes"){const i=this._next();if($.equals(i.type,$.string)){for(let a=0;a<2;a++){
const c=this._next();if(!$.equals(c.type,$.break))throw new Error("Invalid encoded Bytes form")}const o=xT.decode(`m${i.
value}`);return new oe($.bytes,o,i.value.length)}this.tokenBuffer.push(i)}this.tokenBuffer.push(s)}this.tokenBuffer.push(
n)}this.tokenBuffer.push(r)}return e}}const Ib={allowIndefinite:!1,allowUndefined:!1,allowNaN:!1,allowInfinity:!1,allowBigInt:!0,
strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{42:t=>bT.parse(t())}},Gv=297,Wv=t=>{const e=ST(t),r=Object.assign(Ib,
{tokenizer:new AT(e,Ib)});return UR(e,r)};new TextDecoder;new TextEncoder;new TextEncoder;const IT=new TextDecoder,Hv=512;
function Vv(t){return JSON.parse(IT.decode(t))}const Gp=85,_T=0,Kv={code:_T},Qv=81,CT=10;function RT(t=0){return new Uint8Array(
t)}function TT(t){return t?.buffer instanceof ArrayBuffer}function MT(t){if(TT(t))return t;const e=t.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function _b(t,e){e==null&&(e=t.reduce((s,i)=>s+i.length,0));const r=RT(e);let n=0;for(const s of t)
r.set(s,n),n+=s.length;return MT(r)}function BT(t){return t[Symbol.asyncIterator]!=null}function on(t){if(BT(t))return(async()=>{
let n=new Uint8Array(0);for await(const s of t)n=_b([n,s],n.length+s.length);return n})();const e=[];let r=0;for(const n of t)
e.push(n),r+=n.byteLength;return _b(e,r)}function Wp(t){return t==null?!1:ai.asCID(t)===t}function Hp(t,e){let r,n=0,s="";
for(;n<e.length;){const i=e[n];if(n++,!Object.hasOwnProperty.call(t,i))throw new Ra(`Object did not have key "${i}"`);if(s+=
`/${i}`,r=t[i],t=r,Wp(r))break}return{value:r,rest:e.slice(n),path:s.substring(1)}}async function*Cb(t,e,r,n){const s=await on(
r.get(t,n)),i=Uv(s),o=Hp(i,e);yield{cid:Wp(o.value)?o.value:t,name:o.path,rest:o.rest}}async function*LT(t,e,r,n){const s=await on(
r.get(t,n)),i=Wv(s),o=Hp(i,e);yield{cid:Wp(o.value)?o.value:t,name:o.path,rest:o.rest}}function ih(t){return t.type==="D\
IRECTORY"}function Jv(t){return t.type==="FILE"}function Xv(t){return t.type==="RAW"}function Yv(t){return t.type==="SYM\
LINK"}function Fi(t){return t.type==="HAMT_SHARD"&&t.data instanceof Uint8Array&&typeof t.fanOut=="bigint"&&typeof t.hashType==
"bigint"}function Zs(t){return typeof t.name=="string"&&ai.asCID(t.hash)===t.hash}function*Zv(t){let e={},r={};for(const n of Aa.
stream(t))switch(n.field){case".data":{if(n.type==="start"&&(r={}),n.type==="end"){if(ih(r)||Fi(r)||Jv(r)||Xv(r)||Yv(r)){
yield r;return}throw new qt("PBNode Data was not a valid UnixFS type")}break}case".data.type":{r.type=n.value;break}case"\
.data.data":{r.data=n.value;break}case".data.fanOut":{r.fanOut=n.value;break}case".data.hashType":{r.hashType=n.value;break}case"\
.links[]":{n.type==="start"&&(e={type:"LINK"}),n.type==="end"&&Zs(e)&&(yield e);break}case".links[].name":{e.name=n.value;
break}case".links[].hash":{e.hash=ai.decode(n.value);break}}}const Rb=(t,e)=>t.toString(16).toUpperCase().padStart(e,"0").
substring(0,e),DT=t=>{let e=t.bucket;const r=[];for(;e._parent!=null;)r.push(e),e=e._parent;return r.push(e),r.reverse()};
async function*oh(t,e,r,n,s,i,o){const a=(i.lastBucket.tableSize()-1).toString(16).length;let c=[];for(const g of e){if(!Zs(
g))throw new qt("Invalid link");if(c.push(g),g.name.length===a){const f=parseInt(g.name,16);i.lastBucket._putObjectAt(f,
new Wr({hash:i.lastBucket._options.hash,bits:i.lastBucket._options.bits},i.lastBucket,f))}if(g.name.substring(a)===r){yield{
cid:g.hash,name:r,rest:n};return}await i.rootBucket.put(g.name.substring(a),!0)}const l=await i.rootBucket._findNewBucketAndPos(
r);let d=Rb(l.pos,a);const u=DT(l);u.length>i.hamtDepth&&(i.lastBucket=u[i.hamtDepth],d=Rb(i.lastBucket._posAtParent,a));
const h=c.find(g=>g.name==null?!1:g.name===d);if(h==null)return;i.hamtDepth++;const p=await on(s.get(h.hash,o));o?.yieldSubShards===
!0&&(yield{cid:h.hash,name:h.name,rest:[r,...n]});const m=Zv(p),{value:b}=m.next();if(c=[],b!=null){if(Fi(b)){yield*oh(b,
m,r,n,s,i,o);return}if(!Zs(b))throw new qt("Did not read Link or Data from dag-pb block");c.push(b);for(const g of m){if(Fi(
g)){yield*oh(g,c,r,n,s,i,o);return}if(!Zs(g))throw new qt("Did not read Link or Data from dag-pb block");c.push(g)}}}function*Tb(t,e,r){
for(const n of t){if(!Zs(n))throw new qt("Invalid link");if(n.name===e[0]){yield{cid:n.hash,name:e[0],rest:e.slice(1)};return}}
throw new hi(`No link "${e[0]}" found under ${r}`)}const $T=async function(t){return(await dv.encode(t)).slice(0,8).reverse()};
async function*Mb(t,e,r,n,s,i){const o=bv({hashFn:$T,bits:Math.log2(Number(t.fanOut))}),a={rootBucket:o,hamtDepth:1,lastBucket:o};
for await(const c of oh(t,e,r[0],r.slice(1),s,a,i))if(yield c,c.name===r[0])return;throw new hi(`No link "${r[0]}" found\
 under ${n}`)}async function*NT(t,e,r,n){const s=await on(r.get(t,n)),i=[],o=Zv(s),{value:a}=o.next();let c=!1,l=!1;if(a!=
null){if(l=ih(a),c=Fi(a),Jv(a)||Xv(a)||Yv(a)){yield{cid:t,name:e[0],rest:e.slice(1)};return}if(l||c&&n?.translateHAMTPath===
!1){yield*Tb(o,e,t);return}if(c){yield*Mb(a,o,e,t,r,n);return}if(!Zs(a))throw new qt("Did not read Link or Data from dag\
-pb block");i.push(a);for(const d of o){if(l=ih(d),c=Fi(d),l||c&&n?.translateHAMTPath===!1){yield*Tb(i,e,t);return}if(Fi(
d)){yield*Mb(d,i,e,t,r,n);return}if(!Zs(d))throw new qt("Did not read Link or Data from dag-pb block");i.push(d)}}throw new hi(
`No link "${e[0]}" found under ${t}`)}async function*PT(t,e,r,n){if(e.length!==0)throw new Ra(`Cannot load path /${e.join(
"/")} from identity block`)}async function*OT(t,e,r,n){const s=await on(r.get(t,n)),i=Vv(s),o=Hp(i,e);yield{cid:t,name:o.
path,rest:o.rest}}async function*UT(t,e,r,n){if(e.length!==0)throw new hi(`Cannot load path /${e.join("/")} from raw blo\
ck`)}const FT={[qa]:NT,[Gp]:UT,[Ov]:Cb,[Qv]:Cb,[Gv]:LT,[Kv.code]:PT,[Hv]:OT};async function*zT(t,e,r={}){for(t=t.toString(),
t.startsWith("/ipfs/")&&(t=t.substring(6));t.endsWith("/");)t=t.substring(0,t.length-1);let[n,...s]=t.split(/(?<!\\)\//g).
filter(Boolean),i=ai.parse(n),o=[i],a=`${i}`;for(yield{cid:i,name:a,path:a,roots:o,remainder:s};s.length>0;){const c=FT[i.
code];if(c==null)throw new Ta(`No resolver for code ${i.code}`);let l=!1;for await(const d of c(i,s,e,r)){if(i=d.cid,l=!o[o.
length-1].equals(i),s=d.rest,!l)break;o=[...o,d.cid],a=`${a}/${d.name}`,yield{cid:d.cid,name:d.name,path:a,roots:o,remainder:d.
rest}}if(!l)break}if(r?.signal?.throwIfAborted(),s.length!==0)throw new hi(`Could not resolve path /${s.join("/")} under\
 ${t}`)}function qT(t){return t[Symbol.asyncIterator]!=null}function jT(t){if(qT(t))return(async()=>{let r;for await(const n of t)
r=n;return r})();let e;for(const r of t)e=r;return e}async function Bb(t,e,r,n,s){const i=await on(n.get(t,s)),o=Uv(i);return{
type:"object",cid:t,name:e,path:r,object:o,node:i,size:BigInt(i.byteLength)}}async function GT(t,e,r,n,s){const i=await on(
n.get(t,s)),o=Wv(i);return{type:"object",cid:t,name:e,path:r,object:o,node:i,size:BigInt(i.byteLength)}}function ah(t,e,r,n){
const s=BigInt(t.length),i=BigInt(e+s);return r>=i||n<e?new Uint8Array(0):(n>=e&&n<i&&(t=t.subarray(0,Number(n-e))),r>=e&&
r<i&&(t=t.subarray(Number(r-e))),t)}const e1=(t,e=0,r=t)=>{const n=BigInt(t),s=BigInt(e??0);let i=BigInt(r);if(i!==n&&(i=
s+i),i>n&&(i=n),s<0n)throw new Wo("Offset must be greater than or equal to 0");if(s>n)throw new Wo("Offset must be less \
than the file size");if(i<0n)throw new Wo("Length must be greater than or equal to 0");if(i>n)throw new Wo("Length must \
be less than the file size");return{start:s,end:i}};function t1(t,e){async function*r(n={}){const{start:s,end:i}=e1(t.length,
n.offset,n.length),o=ah(t,0n,s,i);n.onProgress?.(new Dn(e,{bytesRead:BigInt(o.byteLength),totalBytes:i-s,fileSize:BigInt(
t.byteLength)})),yield o}return r}async function WT(t,e,r,n,s){const i=Av(t.multihash.bytes);return{type:"identity",cid:t,
name:e,path:r,content:t1(i.digest,"unixfs:exporter:progress:identity"),size:BigInt(i.bytes.byteLength),node:i.bytes}}async function HT(t,e,r,n,s){
const i=await on(n.get(t,s)),o=Vv(i);return{type:"object",cid:t,name:e,path:r,object:o,size:BigInt(i.byteLength),node:i}}
async function VT(t,e,r,n,s){const i=await on(n.get(t,s));return{type:"raw",cid:t,name:e,path:r,content:t1(i,"unixfs:exp\
orter:progress:raw"),size:BigInt(i.length),node:i}}function KT(t,e,r,n){async function*s(i={}){const o=i.offset??0,a=i.length??
e.Links.length,c=e.Links.slice(o,o+a);i.onProgress?.(new Dn("unixfs:exporter:walk:directory",{cid:t})),yield*c.map(l=>({
cid:l.Hash,name:l.Name??"",path:`${n}/${l.Name??""}`,size:BigInt(l.Tsize??0)}))}return s}function QT(t){const[e,r]=t[Symbol.
asyncIterator]!=null?[t[Symbol.asyncIterator](),Symbol.asyncIterator]:[t[Symbol.iterator](),Symbol.iterator],n=[];return{
peek:()=>e.next(),push:s=>{n.push(s)},next:()=>n.length>0?{done:!1,value:n.shift()}:e.next(),[r](){return this}}}function JT(t){
return t[Symbol.asyncIterator]!=null}function XT(t,e){let r=0;if(JT(t))return(async function*(){for await(const c of t)yield e(
c,r++)})();const n=QT(t),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,r++);if(typeof o.then==
"function")return(async function*(){yield await o;for(const c of n)yield e(c,r++)})();const a=e;return(function*(){yield o;
for(const c of n)yield a(c,r++)})()}function nn(){const t={};return t.promise=new Promise((e,r)=>{t.resolve=e,t.reject=r}),
t}const hc=globalThis.CustomEvent??Event;async function*YT(t,e={}){let r=e.concurrency??1/0;r<1&&(r=1/0);const n=e.ordered??
!1,s=new EventTarget,i=[];let o=nn(),a=nn(),c=!1,l,d=!1,u=!1;s.addEventListener("task-complete",()=>{a.resolve()}),Promise.
resolve().then(async()=>{try{for await(const b of t){if(i.length===r&&(o=nn(),await o.promise),d||u)break;const g={done:!1};
i.push(g),b().then(f=>{g.done=!0,g.ok=!0,g.value=f,s.dispatchEvent(new hc("task-complete"))},f=>{g.done=!0,g.err=f,s.dispatchEvent(
new hc("task-complete"))})}c=!0,s.dispatchEvent(new hc("task-complete"))}catch(b){l=b,s.dispatchEvent(new hc("task-compl\
ete"))}});function h(){return n?i[0]?.done:!!i.find(b=>b.done)}function*p(){for(;i.length>0&&i[0].done;){const b=i[0];if(i.
shift(),b.ok)yield b.value;else throw d=!0,o.resolve(),b.err;o.resolve()}}function*m(){for(;h();)for(let b=0;b<i.length;b++)
if(i[b].done){const g=i[b];if(i.splice(b,1),b--,g.ok)yield g.value;else throw d=!0,o.resolve(),g.err;o.resolve()}}try{for(;;){
if(h()||(a=nn(),await a.promise),l!=null||(n?yield*p():yield*m(),l!=null))throw l;if(c&&i.length===0)break}}finally{u=!0,
o.resolve()}}let Lb=class{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a\
 FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){
return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.top+1&this.mask,!0)}shift(){const e=this.
buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,e}isEmpty(){return this.
buffer[this.btm]===void 0}},xu=class{size;hwm;head;tail;constructor(e={}){this.hwm=e.splitLimit??16,this.head=new Lb(this.
hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?e.byteLength:1}push(e){if(e?.value!=null&&
(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const r=this.head;this.head=r.next=new Lb(2*this.head.buffer.
length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.tail.next!=null){const r=this.tail.next;this.
tail.next=null,this.tail=r,e=this.tail.shift()}return e?.value!=null&&(this.size-=this.calculateSize(e.value)),e}isEmpty(){
return this.head.isEmpty()}},ZT=class extends Error{type;code;constructor(e,r){super(e??"The operation was aborted"),this.
type="aborted",this.code=r??"ABORT_ERR"}};function r1(t={}){return eM(r=>{const n=r.shift();if(n==null)return{done:!0};if(n.
error!=null)throw n.error;return{done:n.done===!0,value:n.value}},t)}function eM(t,e){e=e??{};let r=e.onEnd,n=new xu,s,i,
o,a=nn();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,f)=>{i=y=>{i=null,n.push(y);try{g(t(n))}catch(E){
f(E)}return s}}):t(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=nn()})}},l=g=>i!=null?i(g):(n.push(g),s),d=g=>(n=
new xu,i!=null?i({error:g}):(n.push({error:g}),s)),u=g=>{if(o)return s;if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error(
"objectMode was not true but tried to push non-Uint8Array value");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?d(
g):l({done:!0})),p=()=>(n=new xu,h(),{done:!0}),m=g=>(h(g),{done:!0});if(s={[Symbol.asyncIterator](){return this},next:c,
return:p,throw:m,push:u,end:h,get readableLength(){return n.size},onEmpty:async g=>{const f=g?.signal;if(f?.throwIfAborted(),
n.isEmpty())return;let y,E;f!=null&&(y=new Promise((k,x)=>{E=()=>{x(new ZT)},f.addEventListener("abort",E)}));try{await Promise.
race([a.promise,y])}finally{E!=null&&f!=null&&f?.removeEventListener("abort",E)}}},r==null)return s;const b=s;return s={
[Symbol.asyncIterator](){return this},next(){return b.next()},throw(g){return b.throw(g),r!=null&&(r(g),r=void 0),{done:!0}},
return(){return b.return(),r!=null&&(r(),r=void 0),{done:!0}},push:u,end(g){return b.end(g),r!=null&&(r(g),r=void 0),s},
get readableLength(){return b.readableLength},onEmpty:g=>b.onEmpty(g)},s}function tM(t){return t.reason}function n1(t,e,r){
if(e==null||t==null)return t;const n=r?.translateError??tM;if(e.aborted)return t.catch(()=>{}),Promise.reject(n(e));let s;
return Promise.race([t,new Promise((i,o)=>{s=()=>{o(n(e))},e.addEventListener("abort",s)})]).finally(()=>{s!=null&&e.removeEventListener(
"abort",s)})}class rM{readNext;haveNext;ended;nextResult;error;constructor(){this.ended=!1,this.readNext=nn(),this.haveNext=
nn()}[Symbol.asyncIterator](){return this}async next(){if(this.nextResult==null&&await this.haveNext.promise,this.nextResult==
null)throw new Error("HaveNext promise resolved but nextResult was undefined");const e=this.nextResult;return this.nextResult=
void 0,this.readNext.resolve(),this.readNext=nn(),e}async throw(e){return this.ended=!0,this.error=e,e!=null&&(this.haveNext.
promise.catch(()=>{}),this.haveNext.reject(e)),{done:!0,value:void 0}}async return(){const e={done:!0,value:void 0};return this.
ended=!0,this.nextResult=e,this.haveNext.resolve(),e}async push(e,r){await this._push(e,r)}async end(e,r){e!=null?await this.
throw(e):await this._push(void 0,r)}async _push(e,r){if(e!=null&&this.ended)throw this.error??new Error("Cannot push val\
ue onto an ended pushable");for(;this.nextResult!=null;)await this.readNext.promise;e!=null?this.nextResult={done:!1,value:e}:
(this.ended=!0,this.nextResult={done:!0,value:void 0}),this.haveNext.resolve(),this.haveNext=nn(),await n1(this.readNext.
promise,r?.signal,r)}}function nM(){return new rM}function sM(t){return t[Symbol.asyncIterator]!=null}async function iM(t,e,r){
try{await Promise.all(t.map(async n=>{for await(const s of n)await e.push(s,{signal:r}),r.throwIfAborted()})),await e.end(
void 0,{signal:r})}catch(n){await e.end(n,{signal:r}).catch(()=>{})}}async function*oM(t){const e=new AbortController,r=nM();
iM(t,r,e.signal).catch(()=>{});try{yield*r}finally{e.abort()}}function*aM(t){for(const e of t)yield*e}function cM(...t){
const e=[];for(const r of t)sM(r)||e.push(r);return e.length===t.length?aM(e):oM(t)}function s1(t,...e){if(t==null)throw new Error(
"Empty pipeline");if(Su(t)){const n=t;t=()=>n.source}else if(o1(t)||i1(t)){const n=t;t=()=>n}const r=[t,...e];if(r.length>
1&&Su(r[r.length-1])&&(r[r.length-1]=r[r.length-1].sink),r.length>2)for(let n=1;n<r.length-1;n++)Su(r[n])&&(r[n]=dM(r[n]));
return lM(...r)}const lM=(...t)=>{let e;for(;t.length>0;)e=t.shift()(e);return e},i1=t=>t?.[Symbol.asyncIterator]!=null,
o1=t=>t?.[Symbol.iterator]!=null,Su=t=>t==null?!1:t.sink!=null&&t.source!=null,dM=t=>e=>{const r=t.sink(e);if(r?.then!=null){
const n=r1({objectMode:!0});r.then(()=>{n.end()},o=>{n.end(o)});let s;const i=t.source;if(i1(i))s=async function*(){yield*i,
n.end()};else if(o1(i))s=function*(){yield*i,n.end()};else throw new Error("Unknown duplex source type - must be Iterabl\
e or AsyncIterable");return cM(n,s())}return t.source};class Db{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&
e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.
top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.
top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.
btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class Au{size;hwm;head;tail;constructor(e={}){this.hwm=
e.splitLimit??16,this.head=new Db(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?
e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const r=this.head;
this.head=r.next=new Db(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.
tail.next!=null){const r=this.tail.next;this.tail.next=null,this.tail=r,e=this.tail.shift()}return e?.value!=null&&(this.
size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}let uM=class extends Error{type;code;constructor(e,r){
super(e??"The operation was aborted"),this.type="aborted",this.code=r??"ABORT_ERR"}};function fM(t={}){return hM(r=>{const n=r.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},t)}function hM(t,e){
e=e??{};let r=e.onEnd,n=new Au,s,i,o,a=nn();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((g,f)=>{
i=y=>{i=null,n.push(y);try{g(t(n))}catch(E){f(E)}return s}}):t(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
nn()})}},l=g=>i!=null?i(g):(n.push(g),s),d=g=>(n=new Au,i!=null?i({error:g}):(n.push({error:g}),s)),u=g=>{if(o)return s;
if(e?.objectMode!==!0&&g?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:g})},h=g=>o?s:(o=!0,g!=null?d(g):l({done:!0})),p=()=>(n=new Au,h(),{done:!0}),m=g=>(h(g),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:p,throw:m,push:u,end:h,get readableLength(){return n.size},onEmpty:async g=>{
const f=g?.signal;if(f?.throwIfAborted(),n.isEmpty())return;let y,E;f!=null&&(y=new Promise((k,x)=>{E=()=>{x(new uM)},f.
addEventListener("abort",E)}));try{await Promise.race([a.promise,y])}finally{E!=null&&f!=null&&f?.removeEventListener("a\
bort",E)}}},r==null)return s;const b=s;return s={[Symbol.asyncIterator](){return this},next(){return b.next()},throw(g){
return b.throw(g),r!=null&&(r(g),r=void 0),{done:!0}},return(){return b.return(),r!=null&&(r(),r=void 0),{done:!0}},push:u,
end(g){return b.end(g),r!=null&&(r(g),r=void 0),s},get readableLength(){return b.readableLength},onEmpty:g=>b.onEmpty(g)},
s}var Iu={exports:{}},$b;function pM(){return $b||($b=1,(function(t){var e=Object.prototype.hasOwnProperty,r="~";function n(){}
Object.create&&(n.prototype=Object.create(null),new n().__proto__||(r=!1));function s(c,l,d){this.fn=c,this.context=l,this.
once=d||!1}function i(c,l,d,u,h){if(typeof d!="function")throw new TypeError("The listener must be a function");var p=new s(
d,u||c,h),m=r?r+l:l;return c._events[m]?c._events[m].fn?c._events[m]=[c._events[m],p]:c._events[m].push(p):(c._events[m]=
p,c._eventsCount++),c}function o(c,l){--c._eventsCount===0?c._events=new n:delete c._events[l]}function a(){this._events=
new n,this._eventsCount=0}a.prototype.eventNames=function(){var l=[],d,u;if(this._eventsCount===0)return l;for(u in d=this.
_events)e.call(d,u)&&l.push(r?u.slice(1):u);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(d)):
l},a.prototype.listeners=function(l){var d=r?r+l:l,u=this._events[d];if(!u)return[];if(u.fn)return[u.fn];for(var h=0,p=u.
length,m=new Array(p);h<p;h++)m[h]=u[h].fn;return m},a.prototype.listenerCount=function(l){var d=r?r+l:l,u=this._events[d];
return u?u.fn?1:u.length:0},a.prototype.emit=function(l,d,u,h,p,m){var b=r?r+l:l;if(!this._events[b])return!1;var g=this.
_events[b],f=arguments.length,y,E;if(g.fn){switch(g.once&&this.removeListener(l,g.fn,void 0,!0),f){case 1:return g.fn.call(
g.context),!0;case 2:return g.fn.call(g.context,d),!0;case 3:return g.fn.call(g.context,d,u),!0;case 4:return g.fn.call(
g.context,d,u,h),!0;case 5:return g.fn.call(g.context,d,u,h,p),!0;case 6:return g.fn.call(g.context,d,u,h,p,m),!0}for(E=
1,y=new Array(f-1);E<f;E++)y[E-1]=arguments[E];g.fn.apply(g.context,y)}else{var k=g.length,x;for(E=0;E<k;E++)switch(g[E].
once&&this.removeListener(l,g[E].fn,void 0,!0),f){case 1:g[E].fn.call(g[E].context);break;case 2:g[E].fn.call(g[E].context,
d);break;case 3:g[E].fn.call(g[E].context,d,u);break;case 4:g[E].fn.call(g[E].context,d,u,h);break;default:if(!y)for(x=1,
y=new Array(f-1);x<f;x++)y[x-1]=arguments[x];g[E].fn.apply(g[E].context,y)}}return!0},a.prototype.on=function(l,d,u){return i(
this,l,d,u,!1)},a.prototype.once=function(l,d,u){return i(this,l,d,u,!0)},a.prototype.removeListener=function(l,d,u,h){var p=r?
r+l:l;if(!this._events[p])return this;if(!d)return o(this,p),this;var m=this._events[p];if(m.fn)m.fn===d&&(!h||m.once)&&
(!u||m.context===u)&&o(this,p);else{for(var b=0,g=[],f=m.length;b<f;b++)(m[b].fn!==d||h&&!m[b].once||u&&m[b].context!==u)&&
g.push(m[b]);g.length?this._events[p]=g.length===1?g[0]:g:o(this,p)}return this},a.prototype.removeAllListeners=function(l){
var d;return l?(d=r?r+l:l,this._events[d]&&o(this,d)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.
removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=r,a.EventEmitter=a,t.exports=a})(Iu)),Iu.exports}var mM=pM();
const gM=uv(mM);let bM=class a1 extends Error{name="TimeoutError";constructor(e,r){super(e,r),Error.captureStackTrace?.(
this,a1)}};const Nb=t=>t.reason??new DOMException("This operation was aborted.","AbortError");function yM(t,e){const{milliseconds:r,
fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const d=new Promise((u,h)=>{if(typeof r!=
"number"||Math.sign(r)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${r}\``);if(o?.
aborted){h(Nb(o));return}if(o&&(c=()=>{h(Nb(o))},o.addEventListener("abort",c,{once:!0})),t.then(u,h),r===Number.POSITIVE_INFINITY)
return;const p=new bM;a=i.setTimeout.call(void 0,()=>{if(n){try{u(n())}catch(m){h(m)}return}typeof t.cancel=="function"&&
t.cancel(),s===!1?u():s instanceof Error?h(s):(p.message=s??`Promise timed out after ${r} milliseconds`,h(p))},r)}).finally(
()=>{d.clear(),c&&o&&o.removeEventListener("abort",c)});return d.clear=()=>{i.clearTimeout.call(void 0,a),a=void 0},d}function wM(t,e,r){
let n=0,s=t.length;for(;s>0;){const i=Math.trunc(s/2);let o=n+i;r(t[o],e)<=0?(n=++o,s-=i+1):s=i}return n}const vM=100;class Pb{#e=[];#t=0;enqueue(e,r){
const{priority:n=0,id:s}=r??{},{size:i}=this,o={priority:n,id:s,run:e};if(i===0){this.#e.length=0,this.#t=0,this.#e.push(
o);return}if(this.#e.at(-1).priority>=n){this.#e.push(o);return}this.#r();const a=wM(this.#e,o,(c,l)=>l.priority-c.priority);
this.#e.splice(a,0,o)}setPriority(e,r){const n=this.#e.findIndex((i,o)=>o>=this.#t&&i.id===e);if(n===-1)throw new ReferenceError(
`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.splice(n,1);this.enqueue(s.run,{priority:r,
id:e})}remove(e){const r=this.#e.findIndex((n,s)=>s<this.#t?!1:typeof e=="string"?n.id===e:n.run===e);r!==-1&&this.#e.splice(
r,1)}dequeue(){if(this.#t===this.#e.length)return;const e=this.#e[this.#t];return this.#t++,this.#t===this.#e.length?(this.#e.
length=0,this.#t=0):this.#t>vM&&this.#t>this.#e.length/2&&this.#r(),e?.run}filter(e){const r=[];for(let n=this.#t;n<this.#e.
length;n++){const s=this.#e[n];s.priority===e.priority&&r.push(s.run)}return r}get size(){return this.#e.length-this.#t}#r(){
this.#t!==0&&(this.#e.splice(0,this.#t),this.#t=0)}}class EM extends gM{#e;#t;#r=0;#u;#f=!1;#a=!1;#l;#h=0;#c;#m;#d;#i=[];#o=0;#n;#w;#s=0;#g;#p;#B=1n;#v=new Map;#k=new Set;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:Pb,strict:!1,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expe\
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
this.#T(),this.#R()}#U(e){if(this.#d){if(this.#x(e),this.#S()>=this.#u){const n=this.#i[this.#o],s=this.#l-(e-n);return this.#_(
s),!0}return!1}if(this.#c===void 0){const r=this.#h-e;if(r<0)this.#r=this.#e?this.#s:0;else return this.#_(r),!0}return!1}#_(e){
this.#m===void 0&&(this.#m=setTimeout(()=>{this.#O()},e))}#A(){this.#c&&(clearInterval(this.#c),this.#c=void 0)}#C(){this.#m&&
(clearTimeout(this.#m),this.#m=void 0)}#E(){if(this.#n.size===0){if(this.#A(),this.emit("empty"),this.#s===0){if(this.#C(),
this.#d&&this.#o>0){const r=Date.now();this.#x(r)}this.emit("idle")}return!1}let e=!1;if(!this.#p){const r=Date.now(),n=!this.#U(
r);if(this.#$&&this.#N){const s=this.#n.dequeue();this.#t||(this.#L(r),this.#y()),n&&this.#R(),s(),this.emit("active"),e=
!0}}return e}#R(){this.#t||this.#c!==void 0||this.#d||(this.#c=setInterval(()=>{this.#T()},this.#l),this.#h=Date.now()+this.#l)}#T(){
this.#d||(this.#c!==void 0&&(this.#r===0&&this.#s===0?this.#A():this.#h=Date.now()+this.#l),this.#r=this.#e?this.#s:0),this.#I(),
this.#y()}#I(){for(;this.#E(););}get concurrency(){return this.#g}set concurrency(e){if(!(typeof e=="number"&&e>=1))throw new TypeError(
`Expected \`concurrency\` to be a number from 1 and up, got \`${e}\` (${typeof e})`);this.#g=e,this.#I()}setPriority(e,r){
if(typeof r!="number"||!Number.isFinite(r))throw new TypeError(`Expected \`priority\` to be a finite number, got \`${r}\`\
 (${typeof r})`);this.#n.setPriority(e,r)}async add(e,r={}){if(r={timeout:this.timeout,...r,id:r.id??(this.#B++).toString()},
r.timeout!==void 0&&!(Number.isFinite(r.timeout)&&r.timeout>0))throw new TypeError(`Expected \`timeout\` to be a positive \
finite number, got \`${r.timeout}\` (${typeof r.timeout})`);return new Promise((n,s)=>{const i=Symbol(`task-${r.id}`);let o=()=>{};
const a=async()=>{o(),this.#s++,this.#v.set(i,{id:r.id,priority:r.priority??0,startTime:Date.now(),timeout:r.timeout});let l;
try{try{r.signal?.throwIfAborted()}catch(h){throw this.#z(),this.#v.delete(i),h}let d=e({signal:r.signal});if(r.timeout!==
void 0&&(d=yM(Promise.resolve(d),{milliseconds:r.timeout,message:`Task timed out after ${r.timeout}ms (queue has ${this.#s}\
 running, ${this.#n.size} waiting)`})),r.signal){const{signal:h}=r;d=Promise.race([d,new Promise((p,m)=>{l=()=>{m(h.reason)},
h.addEventListener("abort",l,{once:!0}),h.aborted&&l()})])}const u=await d;n(u),this.emit("completed",u)}catch(d){s(d),this.
emit("error",d)}finally{l&&r.signal?.removeEventListener("abort",l),this.#v.delete(i),queueMicrotask(()=>{this.#P()})}};
this.#n.enqueue(a,r);const c=()=>{if(this.#n instanceof Pb){this.#n.remove(a);return}this.#n.remove?.(r.id)};if(r.signal){
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
map(e=>({...e,timeoutRemaining:e.timeout?Math.max(0,e.startTime+e.timeout-Date.now()):void 0}))}}async function c1(t,e,r,n,s,i,o){
if(e instanceof Uint8Array){const l=ah(e,n,s,i);r.push(l);return}if(e.Data==null)throw new qt("no data in PBNode");let a;
try{a=Lr.unmarshal(e.Data)}catch(l){throw new qt(l.message)}if(a.data!=null){const l=a.data,d=ah(l,n,s,i);r.push(d),n+=BigInt(
d.byteLength)}const c=[];if(e.Links.length!==a.blockSizes.length)throw new qt("Inconsistent block sizes and dag links");
for(let l=0;l<e.Links.length;l++){const d=e.Links[l],u=n,h=u+a.blockSizes[l];if((s>=u&&s<h||i>=u&&i<=h||s<u&&i>h)&&c.push(
{link:d,blockStart:n}),n=h,n>i)break}await s1(c,l=>XT(l,d=>async()=>{const u=await on(t.get(d.link.Hash,o));return{...d,
block:u}}),l=>YT(l,{ordered:!0,concurrency:o.blockReadConcurrency??CT}),async l=>{for await(const{link:d,block:u,blockStart:h}of l){
let p;switch(d.Hash.code){case qa:p=xa(u);break;case Gp:p=u;break;default:r.end(new qt(`Unsupported codec: ${d.Hash.code}`));
return}const m=new EM({concurrency:1});m.on("error",b=>{r.end(b)}),m.add(async()=>{o.onProgress?.(new Dn("unixfs:exporte\
r:walk:file",{cid:d.Hash})),await c1(t,p,r,h,s,i,o)}),await m.onIdle()}}),n>=i&&r.end()}function Ob(t,e,r,n,s){async function*i(o={}){
const a=r.fileSize();if(a===void 0)throw new Error("File was a directory");const{start:c,end:l}=e1(a,o.offset,o.length);
if(l===0n)return;let d=0n;const u=l-c,h=fM();o.onProgress?.(new Dn("unixfs:exporter:walk:file",{cid:t})),c1(s,e,h,0n,c,l,
o).catch(p=>{h.end(p)});for await(const p of h)if(p!=null){if(d+=BigInt(p.byteLength),d>u)throw h.end(),new Al("Read too\
 many bytes - the file size reported by the UnixFS data in the root node may be incorrect");d===u&&h.end(),o.onProgress?.(
new Dn("unixfs:exporter:progress:unixfs:file",{bytesRead:d,totalBytes:u,fileSize:a})),yield p}if(d<u)throw new Il("Trave\
rsed entire DAG but did not read enough bytes")}return i}async function*kM(t,e,r,n){let s=-1,i=0;for await(const o of l1(
t,e,r,n))if(s++,!(n.offset!=null&&n.offset<s)&&(yield o,i++,n.length!=null&&n.length===i))return}async function*l1(t,e,r,n){
const s=await on(r.get(t,n)),i=Aa.decode(s);if(i.data?.fanOut==null)throw new qt("missing fanout");const o=(i.data.fanOut-
1n).toString(16).length;for(const a of i.links){if(a.name==null||a.hash==null)continue;const c=ai.decode(a.hash);if(a.name.
length===o)yield*l1(c,e,r,n);else{const l=a.name.substring(o);yield{cid:c,name:a.name.substring(o),path:`${e}/${l}`,size:BigInt(
a.tSize??0)}}}}function xM(t,e,r,n,s){function i(o={}){return o.onProgress?.(new Dn("unixfs:exporter:walk:hamt-sharded-d\
irectory",{cid:t})),kM(t,n,s,o)}return i}const SM={raw:Ob,file:Ob,directory:KT,"hamt-sharded-directory":xM,metadata:(t,e,r,n)=>()=>[],
symlink:(t,e,r,n)=>()=>[]};async function AM(t,e,r,n,s){const i=await on(n.get(t,s));let o;try{o=xa(i)}catch(l){throw new qt(
l.message)}if(o.Data==null)throw new qt("no data in PBNode");let a;try{a=Lr.unmarshal(o.Data)}catch(l){throw new qt(l.message)}
const c=SM[a.type](t,o,a,r,n);if(c==null)throw new hi("could not find content exporter");return a.isDirectory()?{type:"d\
irectory",cid:t,name:e,path:r,entries:c,unixfs:a,node:o,size:BigInt(i.byteLength)}:{type:"file",cid:t,name:e,path:r,content:c,
unixfs:a,node:o,size:a.fileSize()}}const IM={[qa]:AM,[Gp]:VT,[Ov]:Bb,[Qv]:Bb,[Gv]:GT,[Kv.code]:WT,[Hv]:HT};async function Ub(t,e,r={}){
let n,s;if(t instanceof String||typeof t=="string"){const o=await jT(zT(t,e,r));if(o==null)throw new hi(`Could not walk \
path to ${t}`);n=o.cid,s=o.name,t=o.path}else if(ai.asCID(t)===t||t instanceof ai)n=t,s=t=n.toString();else throw new Wo(
"Path must be string or CID");const i=IM[n.code];if(i==null)throw new Ta(`No resolver for code ${n.code}`);return i(n,s,
t,e,r)}function ch(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8Array")return zb(t);if(t instanceof ArrayBuffer)
return new Uint8Array(t);if(ArrayBuffer.isView(t))return zb(new Uint8Array(t.buffer,t.byteOffset,t.byteLength));throw new Error(
"Unknown type, must be binary type")}function _M(t){const e=new Uint8Array(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}const Fb=4096;function CM(t){const e=t.length;if(e<=Fb)return String.fromCharCode.apply(String,t);let r="",n=0;
for(;n<e;)r+=String.fromCharCode.apply(String,t.subarray(n,n+=Fb));return r}function RM(t){return t?.buffer instanceof ArrayBuffer}
function zb(t){return RM(t)?t:t.slice()}function TM(t,e,r){if(t.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<t.length;i++){var o=t.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,r){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var d=t.length,u=t.charAt(0),h=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var y=0,E=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,y++;for(var S=(x-k)*p+1>>>0,v=new Uint8Array(S);k!==x;){for(var w=f[k],I=0,C=S-1;(w!==
0||I<E)&&C!==-1;C--,I++)w+=256*v[C]>>>0,v[C]=w%d>>>0,w=w/d>>>0;if(w!==0)throw new Error("Non-zero carry");E=I,k++}for(var R=S-
E;R!==S&&v[R]===0;)R++;for(var N=u.repeat(y);R<S;++R)N+=t.charAt(v[R]);return N}function b(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var y=0;if(f[y]!==" "){for(var E=0,k=0;f[y]===u;)E++,y++;for(var x=(f.
length-y)*h+1>>>0,S=new Uint8Array(x);f[y];){var v=n[f.charCodeAt(y)];if(v===255)return;for(var w=0,I=x-1;(v!==0||w<k)&&
I!==-1;I--,w++)v+=d*S[I]>>>0,S[I]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=w,y++}if(f[y]!==" "){
for(var C=x-k;C!==x&&S[C]===0;)C++;for(var R=new Uint8Array(E+(x-C)),N=E;C!==x;)R[N++]=S[C++];return R}}}function g(f){var y=b(
f);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:b,decode:g}}var MM=TM,BM=MM;let LM=class{name;prefix;baseEncode;constructor(e,r,n){
this.name=e,this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},DM=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){
this.name=e,this.prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return d1(this,e)}},
$M=class{decoders;constructor(e){this.decoders=e}or(e){return d1(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function d1(t,e){return new $M({...t.decoders??{[t.prefix]:t},...e.decoders??
{[e.prefix]:e}})}let NM=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){this.name=e,this.prefix=
r,this.baseEncode=n,this.baseDecode=s,this.encoder=new LM(e,r,n),this.decoder=new DM(e,r,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Td({name:t,prefix:e,encode:r,decode:n}){return new NM(t,e,r,
n)}function Qa({name:t,prefix:e,alphabet:r,caseInsensitive:n=!1}){const{encode:s,decode:i}=BM(r,t,n);return Td({prefix:e,
name:t,encode:s,decode:o=>ch(i(o))})}function PM(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*
r/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<r|d,o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function OM(t,e,r){const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=
8;o>r;)o-=r,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function UM(t,e){const r={};
for(let n=0;n<t.length;++n)if(r[t[n]]=n,e){const s=t[n].toLowerCase(),i=t[n].toUpperCase();s!==t[n]&&(r[s]=n),i!==t[n]&&
(r[i]=n)}return r}function er({name:t,prefix:e,bitsPerChar:r,alphabet:n,caseInsensitive:s=!1}){const i=UM(n,s);return Td(
{prefix:e,name:t,encode(o){return OM(o,n,r)},decode(o){return PM(o,i,r,t)}})}const FM=Qa({prefix:"9",name:"base10",alphabet:"\
0123456789"}),zM=Object.freeze(Object.defineProperty({__proto__:null,base10:FM},Symbol.toStringTag,{value:"Module"})),qM=er(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),jM=er({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),GM=Object.freeze(Object.defineProperty({__proto__:null,
base16:qM,base16upper:jM},Symbol.toStringTag,{value:"Module"})),WM=er({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
HM=Object.freeze(Object.defineProperty({__proto__:null,base2:WM},Symbol.toStringTag,{value:"Module"})),u1=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),VM=u1.reduce((t,e,r)=>(t[r]=e,t),[]),KM=u1.reduce((t,e,r)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return t[n]=r,t},[]);function QM(t){return t.reduce((e,r)=>(e+=VM[r],e),"")}function JM(t){const e=[];
for(const r of t){const n=r.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${r}`);const s=KM[n];if(s==null)
throw new Error(`Non-base256emoji character: ${r}`);e.push(s)}return new Uint8Array(e)}const XM=Td({prefix:"🚀",name:"\
base256emoji",encode:QM,decode:JM}),YM=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:XM},Symbol.toStringTag,
{value:"Module"})),ZM=er({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
eB=er({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),tB=er(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),rB=er({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),nB=er({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),sB=er({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),iB=er({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),oB=er({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),aB=er({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),cB=Object.freeze(Object.defineProperty({__proto__:null,
base32:ZM,base32hex:nB,base32hexpad:iB,base32hexpadupper:oB,base32hexupper:sB,base32pad:tB,base32padupper:rB,base32upper:eB,
base32z:aB},Symbol.toStringTag,{value:"Module"})),lB=Qa({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),dB=Qa({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
uB=Object.freeze(Object.defineProperty({__proto__:null,base36:lB,base36upper:dB},Symbol.toStringTag,{value:"Module"})),fB=Qa(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),hB=Qa({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),pB=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:fB,base58flickr:hB},Symbol.toStringTag,{value:"Module"})),mB=er({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),gB=er({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),bB=er({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),yB=er({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),wB=Object.freeze(Object.defineProperty(
{__proto__:null,base64:mB,base64pad:gB,base64url:bB,base64urlpad:yB},Symbol.toStringTag,{value:"Module"})),vB=er({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),EB=Object.freeze(Object.defineProperty({__proto__:null,base8:vB},Symbol.
toStringTag,{value:"Module"})),kB=Td({prefix:"\0",name:"identity",encode:t=>CM(ch(t)),decode:t=>ch(_M(t))}),xB=Object.freeze(
Object.defineProperty({__proto__:null,identity:kB},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const qb={...xB,...HM,...EB,...zM,...GM,...cB,...uB,...pB,...wB,...YM};function SB(t=0){return new Uint8Array(t)}function f1(t,e,r,n){
return{name:t,prefix:e,encoder:{name:t,prefix:e,encode:r},decoder:{decode:n}}}const jb=f1("utf8","u",t=>"u"+new TextDecoder(
"utf8").decode(t),t=>new TextEncoder().encode(t.substring(1))),_u=f1("ascii","a",t=>{let e="a";for(let r=0;r<t.length;r++)
e+=String.fromCharCode(t[r]);return e},t=>{t=t.substring(1);const e=SB(t.length);for(let r=0;r<t.length;r++)e[r]=t.charCodeAt(
r);return e}),h1={utf8:jb,"utf-8":jb,hex:qb.base16,latin1:_u,ascii:_u,binary:_u,...qb};function AB(t,e="utf8"){const r=h1[e];
if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.decoder.decode(`${r.prefix}${t}`)}function IB(t,e="ut\
f8"){const r=h1[e];if(r==null)throw new Error(`Unsupported encoding "${e}"`);return r.encoder.encode(t).substring(1)}const jn="\
/",p1=new TextEncoder().encode(jn),pc=p1[0];class zr{_buf;constructor(e,r){if(typeof e=="string")this._buf=AB(e);else if(e instanceof
Uint8Array)this._buf=e;else throw new Error("Invalid key, should be String of Uint8Array");if(r==null&&(r=!0),r&&this.clean(),
this._buf.byteLength===0||this._buf[0]!==pc)throw new Error("Invalid key")}toString(e="utf8"){return IB(this._buf,e)}uint8Array(){
return this._buf}get[Symbol.toStringTag](){return`Key(${this.toString()})`}static withNamespaces(e){return new zr(e.join(
jn))}static random(){return new zr(Math.random().toString().substring(2))}static asKey(e){return e instanceof Uint8Array||
typeof e=="string"?new zr(e):typeof e.uint8Array=="function"?new zr(e.uint8Array()):null}clean(){if((this._buf==null||this.
_buf.byteLength===0)&&(this._buf=p1),this._buf[0]!==pc){const e=new Uint8Array(this._buf.byteLength+1);e.fill(pc,0,1),e.
set(this._buf,1),this._buf=e}for(;this._buf.byteLength>1&&this._buf[this._buf.byteLength-1]===pc;)this._buf=this._buf.subarray(
0,-1)}less(e){const r=this.list(),n=e.list();for(let s=0;s<r.length;s++){if(n.length<s+1)return!1;const i=r[s],o=n[s];if(i<
o)return!0;if(i>o)return!1}return r.length<n.length}reverse(){return zr.withNamespaces(this.list().slice().reverse())}namespaces(){
return this.list()}baseNamespace(){const e=this.namespaces();return e[e.length-1]}list(){return this.toString().split(jn).
slice(1)}type(){return _B(this.baseNamespace())}name(){return CB(this.baseNamespace())}instance(e){return new zr(this.toString()+
":"+e)}path(){let e=this.parent().toString();return e.endsWith(jn)||(e+=jn),e+=this.type(),new zr(e)}parent(){const e=this.
list();return e.length===1?new zr(jn):new zr(e.slice(0,-1).join(jn))}child(e){return this.toString()===jn?e:e.toString()===
jn?this:new zr(this.toString()+e.toString(),!1)}isAncestorOf(e){return e.toString()===this.toString()?!1:e.toString().startsWith(
this.toString())}isDecendantOf(e){return e.toString()===this.toString()?!1:this.toString().startsWith(e.toString())}isTopLevel(){
return this.list().length===1}concat(...e){return zr.withNamespaces([...this.namespaces(),...RB(e.map(r=>r.namespaces()))])}}
function _B(t){const e=t.split(":");return e.length<2?"":e.slice(0,-1).join(":")}function CB(t){const e=t.split(":");return e[e.
length-1]}function RB(t){return[].concat(...t)}const TB="peercompute-ipfs-artifacts-v1-",lh=["blocks","roots","routing"],
m1=t=>t instanceof Uint8Array?t.byteLength:new TextEncoder().encode(JSON.stringify(t)).byteLength,Cu=t=>t===void 0?void 0:
structuredClone(t),jc=()=>({bytes:0,entries:0,generation:0});function g1(t,e,r,{maximumBytes:n=Number.MAX_SAFE_INTEGER,maximumEntries:s=Number.
MAX_SAFE_INTEGER}={}){const i={bytes:t.bytes-(e?.size||0)+r,entries:t.entries+(e?0:1),generation:(t.generation||0)+1};if(Object.
values(i).some(o=>!Number.isSafeInteger(o)||o<0))throw new RangeError("Artifact storage accounting exceeds safe integer \
range.");if(i.bytes>n||i.entries>s)throw new DOMException("Artifact storage quota exceeded.","QuotaExceededError");return i}
class MB{constructor({name:e="memory"}={}){this.name=e,this.data=new Map(lh.map(r=>[r,new Map])),this.usage=new Map(lh.map(
r=>[r,jc()]))}async open(){}async close(){}async get(e,r){return Cu(this.data.get(e).get(r)?.value)}async getUsage(e){return{
...this.usage.get(e)}}async put(e,r,n,s){const i=this.data.get(e),o=i.get(r);if(e==="blocks"&&o)return!1;const a=m1(n),c=g1(
this.usage.get(e),o,a,s);return i.set(r,{value:Cu(n),size:a,generation:c.generation}),this.usage.set(e,c),!0}async delete(e,r){
const n=this.data.get(e),s=n.get(r);if(!s)return!1;const i=this.usage.get(e);return this.usage.set(e,{...i,bytes:i.bytes-
s.size,entries:i.entries-1}),n.delete(r),!0}async scan(e,{after:r,limit:n=16,keysOnly:s=!1}={}){return[...this.data.get(
e).keys()].sort().filter(i=>r===void 0||i>r).slice(0,n).map(i=>({key:i,generation:this.data.get(e).get(i).generation,...s?
{}:{value:Cu(this.data.get(e).get(i).value)}}))}}function Sn(t){return new Promise((e,r)=>{t.onsuccess=()=>e(t.result),t.
onerror=()=>r(t.error)})}class BB{constructor({name:e="default",indexedDBImpl:r=globalThis.indexedDB,keyRange:n=globalThis.
IDBKeyRange}={}){this.name=`${TB}${e}`,this.indexedDB=r,this.keyRange=n,this.database=null,this.opening=null}async open(){
if(!this.database){if(this.opening)return this.opening;if(!this.indexedDB?.open||!this.keyRange)throw new Error("Persist\
ent artifacts require IndexedDB and IDBKeyRange.");this.opening=new Promise((e,r)=>{const n=this.indexedDB.open(this.name,
1);let s=!1;n.onupgradeneeded=()=>{for(const i of[...lh,"usage"])n.result.createObjectStore(i)},n.onerror=()=>r(n.error),
n.onblocked=()=>{s=!0,r(new Error("Artifact database open blocked by another context."))},n.onsuccess=()=>{if(s){n.result.
close();return}this.database=n.result,this.database.onversionchange=()=>{this.database?.close(),this.database=null},e()}});
try{await this.opening}finally{this.opening=null}}}async close(){await this.opening,this.database?.close(),this.database=
null}async _transaction(e,r,n){if(!this.database)throw new Error("Artifact database is closed.");const s=this.database.transaction(
e,r),i=new Promise((o,a)=>{s.oncomplete=o,s.onabort=()=>a(s.error||new Error("Artifact transaction aborted.")),s.onerror=
()=>{}});try{const o=await n(s);return await i,o}catch(o){try{s.abort()}catch{}throw await i.catch(()=>{}),o}}async get(e,r){
return this._transaction([e],"readonly",async n=>(await Sn(n.objectStore(e).get(r)))?.value)}async getUsage(e){return this.
_transaction(["usage"],"readonly",async r=>await Sn(r.objectStore("usage").get(e))||jc())}async put(e,r,n,s){return this.
_transaction([e,"usage"],"readwrite",async i=>{const o=i.objectStore(e),a=i.objectStore("usage"),[c,l]=await Promise.all(
[Sn(o.get(r)),Sn(a.get(e))]);if(e==="blocks"&&c)return!1;const d=m1(n),u=g1(l||jc(),c,d,s);return await Promise.all([Sn(
o.put({value:n,size:d,generation:u.generation},r)),Sn(a.put(u,e))]),!0})}async delete(e,r){return this._transaction([e,"\
usage"],"readwrite",async n=>{const s=n.objectStore(e),i=n.objectStore("usage"),[o,a]=await Promise.all([Sn(s.get(r)),Sn(
i.get(e))]);if(!o)return!1;const c=a||jc();return await Promise.all([Sn(s.delete(r)),Sn(i.put({...c,bytes:c.bytes-o.size,
entries:c.entries-1},e))]),!0})}async scan(e,{after:r,limit:n=16,keysOnly:s=!1}={}){return this._transaction([e],"readon\
ly",i=>new Promise((o,a)=>{const c=i.objectStore(e),l=r===void 0?void 0:this.keyRange.lowerBound(r,!0),d=c.openCursor(l),
u=[];d.onerror=()=>a(d.error),d.onsuccess=()=>{const h=d.result;if(!h||u.length>=n){o(u);return}u.push({key:h.key,generation:h.
value.generation,...s?{}:{value:h.value.value}}),u.length>=n?o(u):h.continue()}}))}}const Ru=new Map;function Ze(t){if(t?.
aborted)throw t.reason||new DOMException("Aborted","AbortError")}async function So(t,e,r,n){if(Ze(r),n)return new Promise(
(i,o)=>{n.request(t,{mode:e,...r?{signal:r}:{}},async()=>{await new Promise(a=>i(a))}).catch(o)});let s=Ru.get(t);return s||
(s={readers:0,writer:!1,queue:[]},Ru.set(t,s)),new Promise((i,o)=>{const a=()=>{for(;s.queue.length&&!s.writer;){const l=s.
queue[0];if(l.mode==="exclusive"&&s.readers)break;s.queue.shift(),l.signal?.removeEventListener("abort",l.abort),l.mode===
"exclusive"?s.writer=!0:s.readers++;let d=!1;if(l.resolve(()=>{d||(d=!0,l.mode==="exclusive"?s.writer=!1:s.readers--,a(),
!s.writer&&!s.readers&&!s.queue.length&&Ru.delete(t))}),l.mode==="exclusive")break}},c={mode:e,signal:r,resolve:i,abort:()=>{
const l=s.queue.indexOf(c);l>=0&&s.queue.splice(l,1),o(r.reason||new DOMException("Aborted","AbortError")),a()}};r?.addEventListener(
"abort",c.abort,{once:!0}),s.queue.push(c),a()})}const b1="peercompute.artifact.manifest.v1",ei=256*1024,y1=16*1024**3,Pl=new TextEncoder;
function Je(t){const e=Vi.asCID(t)||Vi.parse(String(t));if(![85,112].includes(e.code)||e.multihash.code!==18||e.multihash.
digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return e.toV1()}function Gc(t,e=0,r={
remaining:ei}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((r.remaining-=2)<0)throw new RangeError(
"Manifest exceeds byte limit.");if(typeof t=="string"){if(t.length>r.remaining||(r.remaining-=Pl.encode(t).length)<0)throw new RangeError(
"Manifest exceeds byte limit.");return t}if(t===null||typeof t=="boolean"||typeof t=="number"&&Number.isFinite(t))return t;
if(Array.isArray(t)){if(t.length>4096)throw new RangeError("Manifest array exceeds item limit.");return t.map(s=>Gc(s,e+
1,r))}if(!t||typeof t!="object"||Object.getPrototypeOf(t)!==Object.prototype)throw new TypeError("Manifest values must b\
e JSON values.");const n=Object.keys(t);if(n.length>1024)throw new RangeError("Manifest object exceeds key limit.");return Object.
fromEntries(n.sort().map(s=>(Gc(s,e+1,r),[s,Gc(t[s],e+1,r)])))}function as(t,{maximumBytes:e=ei,maximumFiles:r=1024,maximumFileBytes:n=y1}={}){
if(!t||t.schema!==b1||!Array.isArray(t.files)||t.files.length===0||t.files.length>r)throw new TypeError("Manifest requir\
es the supported schema and a bounded, nonempty files array.");const s=new Set(["schema","name","description","files","m\
odel","provenance"]);if(Object.keys(t).some(c=>!s.has(c)))throw new TypeError("Unsupported manifest field.");for(const c of[
"name","description"])if(t[c]!==void 0&&typeof t[c]!="string")throw new TypeError(`Manifest ${c} must be a string.`);if(t.
model!==void 0&&(!t.model||typeof t.model!="object"||Array.isArray(t.model)))throw new TypeError("Manifest model extensi\
on must be an object.");const i=new Set,o=t.files.map(c=>{if(!c||typeof c!="object")throw new TypeError("Invalid manifes\
t file.");if(Object.keys(c).some(u=>!["path","cid","size","sha256","mediaType"].includes(u)))throw new TypeError("Unsupp\
orted manifest file field.");const{path:l,size:d}=c;if(typeof l!="string"||!l||Pl.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(l)||l.split("/").some(u=>!u||u==="."||u==="..")||i.has(l))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(d)||d<0||d>n)throw new RangeError("Invalid \
file size.");if(c.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(c.sha256))throw new TypeError("Invalid SHA-256.");if(c.mediaType!==
void 0&&(typeof c.mediaType!="string"||c.mediaType.length>256))throw new TypeError("Invalid media type.");return i.add(l),
{...c,cid:Je(c.cid).toString()}}).sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),a=Gc({...t,files:o},0,{remaining:e});if(Pl.
encode(JSON.stringify(a)).byteLength>e)throw new RangeError("Manifest exceeds byte limit.");return a}function Gb(t,e){return Pl.
encode(JSON.stringify(as(t,e)))}function dh(t,e={}){if(t.byteLength>(e.maximumBytes??ei))throw new RangeError("Manifest \
exceeds byte limit.");return as(JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(t)),e)}const Ao=Object.freeze({name:"\
peercompute.unixfs.v1",cidVersion:1,hash:"sha2-256",rawLeaves:!0,chunkSize:256*1024,maxChildrenPerNode:174,layout:"balan\
ced",reduceSingleLeafToSelf:!0}),Tu=t=>Array.from(t,e=>e.toString(16).padStart(2,"0")).join(""),Io=Symbol("artifact-impo\
rt-retention"),Vp=Symbol("verified-artifact-damage");function vr(t,e,r=1){if(!Number.isSafeInteger(t)||t<r)throw new RangeError(
`Invalid ${e}.`);return t}function Mu(t){const e=new Error(`Artifact block not found: ${t}`);return e.name="NotFoundErro\
r",e.code="ERR_NOT_FOUND",e[Vp]=!0,e}const Er=t=>Object.assign(new Error(t),{code:"ERR_ARTIFACT_INTEGRITY",[Vp]:!0}),Wb=t=>t?.[Vp]===
!0;function Ol(t,e){return e?(e.aborted&&(Promise.resolve(t).catch(()=>{}),Ze(e)),new Promise((r,n)=>{const s=()=>n(e.reason||
new DOMException("Aborted","AbortError"));e.addEventListener("abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.
removeEventListener("abort",s))})):t}async function*Hb(t,e){if(t instanceof Uint8Array){yield t;return}if(t?.getReader){
const r=t.getReader();let n=!1;try{for(;;){const s=await Ol(r.read(),e);if(s.done){n=!0;return}yield s.value}}finally{n||
r.cancel().catch(()=>{}),r.releaseLock()}return}if(t?.[Symbol.asyncIterator]||t?.[Symbol.iterator]){const r=t[Symbol.asyncIterator]?.()||
t[Symbol.iterator]();let n=!1;try{for(;;){const s=await Ol(r.next(),e);if(s.done){n=!0;return}yield s.value}}finally{n||
Promise.resolve(r.return?.()).catch(()=>{})}return}throw new TypeError("Artifact source must be bytes or a byte stream.")}
class LB{constructor({name:e="default",persistent:r=!0,backend:n,ownsBackend:s=n===void 0,capacity:i="bounded",maximumBytes:o=i===
"browser"?Number.MAX_SAFE_INTEGER:2*1024**3,maximumBlockBytes:a=2*1024**2,maximumFileBytes:c=y1,maximumTraversalBlocks:l=65536,
maximumStoredBlocks:d=i==="browser"?Number.MAX_SAFE_INTEGER:l,maximumRoots:u=i==="browser"?Number.MAX_SAFE_INTEGER:1024,
maximumRoutingBytes:h=16*1024**2,maximumConcurrentBlockWrites:p=4,maximumQueuedBlockWrites:m=16,lockManager:b=globalThis.
navigator?.locks,onDestroy:g,indexedDBImpl:f,keyRange:y}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/u.test(e))throw new TypeError(
"Invalid artifact store name.");if(!["bounded","browser"].includes(i))throw new TypeError("Invalid artifact storage capa\
city policy.");this.capacity=i,this.name=e,this.persistent=r,this.backend=n||(r?new BB({name:e,indexedDBImpl:f,keyRange:y}):
new MB({name:e})),this.ownsBackend=s,this.maximumBytes=vr(o,"maximumBytes"),this.maximumBlockBytes=vr(a,"maximumBlockByt\
es"),this.maximumFileBytes=vr(c,"maximumFileBytes"),this.maximumTraversalBlocks=vr(l,"maximumTraversalBlocks"),this.maximumStoredBlocks=
vr(d,"maximumStoredBlocks"),this.maximumRoots=vr(u,"maximumRoots"),this.maximumRoutingBytes=vr(h,"maximumRoutingBytes"),
this.maximumConcurrentBlockWrites=vr(p,"maximumConcurrentBlockWrites"),this.maximumQueuedBlockWrites=vr(m,"maximumQueued\
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
signal]):this.controller.signal;Ze(n),await this.open();const s=r==="none"?()=>{}:await So(`${this.lockName}:gc`,r,n,this.
lockManager);try{Ze(n)}catch(l){throw s(),l}let i;const a={settled:new Promise(l=>{i=l}),paused:!1,finish:()=>{n.removeEventListener(
"abort",c),s(),this.operations.delete(a),i()}},c=()=>{a.paused&&a.finish()};return n.addEventListener("abort",c,{once:!0}),
this.operations.add(a),{signal:n,finish:a.finish,pause:()=>{a.paused=!0,n.aborted&&a.finish()},resume:()=>{a.paused=!1,Ze(
n)}}}async _run(e,r,n,s){if(s&&(s.store!==this||!s.held||n==="exclusive"))throw new Error("Artifact retention scope is n\
o longer active.");const i=s?AbortSignal.any([s.signal,...e?[e]:[]]):e,o=await this._begin(i,s?"none":n);try{const a=await r(
o.signal);return Ze(o.signal),a}finally{o.finish()}}async _writeRoot(e,r,n){const s=await So(`${this.lockName}:roots`,"e\
xclusive",n,this.lockManager);try{Ze(n);const i=await this.backend.get("roots",e),o=r(i);return Ze(n),o===void 0?void 0:
(await this.backend.put("roots",e,o,{maximumEntries:this.maximumRoots,maximumBytes:Math.min(Number.MAX_SAFE_INTEGER,this.
maximumRoots*(ei+2048))}),this.rootUsage=await this.backend.getUsage("roots"),structuredClone(o))}finally{s()}}async _readBlock(e,r){
Ze(r);const n=Je(e),s=await this.backend.get("blocks",n.toString());if(!s)throw Mu(n);return await this._verifyBlock(n,s),
Ze(r),s}async _verifyBlock(e,r){if(!(r instanceof Uint8Array)||r.byteLength>this.maximumBlockBytes)throw new RangeError(
"Artifact block exceeds byte limit.");const n=await ng.digest(r);if(!Vi.createV1(e.code,n).equals(e))throw Er("Artifact \
block CID verification failed.")}async _blockWritePermit(e){if(Ze(e),this.activeBlockWrites>=this.maximumConcurrentBlockWrites){
if(this.waitingBlockWrites.length>=this.maximumQueuedBlockWrites)throw new Error("Artifact block write queue is full.");
await new Promise((r,n)=>{const s={resolve:r,signal:e,abort:()=>{const i=this.waitingBlockWrites.indexOf(s);i>=0&&this.waitingBlockWrites.
splice(i,1),n(e.reason||new DOMException("Aborted","AbortError"))}};e?.addEventListener("abort",s.abort,{once:!0}),this.
waitingBlockWrites.push(s)})}else this.activeBlockWrites++;return()=>{const r=this.waitingBlockWrites.shift();r?(r.signal?.
removeEventListener("abort",r.abort),r.resolve()):this.activeBlockWrites--}}async _putBlock(e,r,n){const s=await this._blockWritePermit(
n);try{return await this._persistBlock(e,r,n)}finally{s()}}async _persistBlock(e,r,n){Ze(n);const s=Je(e),i=r instanceof
Uint8Array?null:new Uint8Array(this.maximumBlockBytes);let o=0,a;for await(const c of Hb(r,n)){if(Ze(n),!(c instanceof Uint8Array))
throw new TypeError("Artifact streams require Uint8Array chunks.");if(o+=c.byteLength,o>this.maximumBlockBytes)throw new RangeError(
"Artifact block exceeds byte limit.");i?i.set(c,o-c.byteLength):a=c.slice()}return a=i?i.slice(0,o):a,await this._verifyBlock(
s,a),Ze(n),await this.backend.put("blocks",s.toString(),a,{maximumBytes:this.maximumBytes,maximumEntries:this.maximumStoredBlocks}),
this.usage=await this.backend.getUsage("blocks"),s}_localBlocks(e){const r=this;return{async*get(n){yield await r._readBlock(
n,e)},put:(n,s)=>r._putBlock(n,s,e)}}async importFile(e,{signal:r,expectedSize:n,expectedSha256:s,pin:i=!0,[Io]:o}={}){if(n!==
void 0&&vr(n,"expectedSize",0),n>this.maximumFileBytes)throw new RangeError("File exceeds byte limit.");if(s!==void 0&&!/^[a-f0-9]{64}$/u.
test(s))throw new TypeError("Invalid expected SHA-256.");return this._run(r,async a=>{const c=Ea.create();let l=0;const d=this;
async function*u(){for await(const b of Hb(e,a)){if(Ze(a),!(b instanceof Uint8Array))throw new TypeError("Artifact strea\
ms require Uint8Array chunks.");if(l+=b.byteLength,l>d.maximumFileBytes||n!==void 0&&l>n)throw new RangeError("File exce\
eds declared byte limit.");for(let g=0;g<b.byteLength;g+=Ao.chunkSize){const f=b.subarray(g,g+Ao.chunkSize);c.update(f),
yield f}}}const h=await G3(u(),this._localBlocks(a),{cidVersion:1,rawLeaves:!0,reduceSingleLeafToSelf:!0,wrapWithDirectory:!1,
chunker:q0({chunkSize:Ao.chunkSize}),layout:av({maxChildrenPerNode:Ao.maxChildrenPerNode}),fileImportConcurrency:1,blockWriteConcurrency:1}),
p=Tu(c.digest());if(n!==void 0&&n!==l)throw new Error("File size does not match expected size.");if(s!==void 0&&s!==p)throw new Error(
"File SHA-256 does not match expected digest.");const m=h.cid.toV1().toString();return this._writeRoot(m,b=>({cid:m,kind:"\
file",size:l,sha256:p,status:"complete",pinned:!!(i||b?.pinned),retain:!1,profile:Ao.name}),a)},void 0,o)}async importManifest(e,{
signal:r,pin:n=!0,[Io]:s}={}){const i=as(e,{maximumFileBytes:this.maximumFileBytes}),o=Gb(i);return this._run(r,async a=>{
for(const l of i.files)await this._recordVerifiedFile(l,a);const c=Vi.createV1(85,await ng.digest(o));return await this.
_putBlock(c,o,a),this._writeRoot(c.toString(),l=>({cid:c.toString(),kind:"manifest",size:o.byteLength,manifest:i,status:"\
complete",pinned:!!(n||l?.pinned),retain:!1}),a)},void 0,s)}async _verifyFile(e,r={},n,s){const i=await Ub(Je(e).toString(),
this._localBlocks(n));if(!["file","raw"].includes(i.type))throw Er("Artifact root must identify a file.");const o=Number(
i.type==="raw"?i.node.byteLength:i.unixfs.fileSize());if(!Number.isSafeInteger(o)||o>this.maximumFileBytes)throw new RangeError(
"Artifact file exceeds its size limit.");if(r.size!==void 0&&o!==r.size)throw Er("Artifact file size differs from its ma\
nifest.");const a=Ea.create();let c=0;for await(const d of this._fileChunks(e,{size:o,signal:n})){if(Ze(n),c+=d.byteLength,
c>o)throw Er("Artifact content exceeds declared size.");a.update(d),s?.(d.byteLength)}const l=Tu(a.digest());if(c!==o||r.
sha256!==void 0&&l!==r.sha256)throw Er("Artifact file integrity differs from its manifest.");return{size:o,sha256:l}}async*_fileChunks(e,{
size:r,offset:n=0,length:s=r-n,signal:i}){const o=n+s,a=[{cid:Je(e),start:0,size:r,depth:0}];let c=0,l=0;for(;a.length;){
Ze(i);const d=a.pop();if(++c>this.maximumTraversalBlocks||d.depth>64)throw new RangeError("Artifact file traversal excee\
ds its bounds.");const u=await this._readBlock(d.cid,i);if(d.cid.code===85){if(u.byteLength!==d.size)throw Er("Raw file \
block size differs from its UnixFS link.");const y=u.subarray(Math.max(0,n-d.start),Math.min(u.length,o-d.start));y.length&&
(l+=y.length,yield y);continue}const h=xa(u);if(!h.Data)throw Er("UnixFS file node has no metadata.");const p=Lr.unmarshal(
h.Data),m=Aa.decode(u).data?.fileSize;if(!["file","raw"].includes(p.type)||h.Links.length!==p.blockSizes.length||Number(
p.fileSize())!==d.size||m!==void 0&&m!==BigInt(d.size))throw Er("UnixFS file metadata is inconsistent.");const b=p.data||
new Uint8Array;let g=d.start+b.length;const f=[];for(let y=0;y<h.Links.length;y++){const E=Number(p.blockSizes[y]);if(!Number.
isSafeInteger(E)||E<0)throw Er("Invalid UnixFS child size.");const k=Je(h.Links[y].Hash),x=h.Links[y].Tsize;if(x!==void 0&&
(!Number.isSafeInteger(x)||x<E||k.code===85&&x!==E))throw Er("Invalid UnixFS link DAG size.");if(g<o&&g+E>n&&f.push({cid:k,
start:g,size:E,depth:d.depth+1}),g+=E,!Number.isSafeInteger(g))throw Er("Invalid UnixFS file extent.")}if(g!==d.start+d.
size)throw Er("UnixFS child sizes differ from their parent.");if(a.length+f.length>this.maximumTraversalBlocks)throw new RangeError(
"UnixFS pending traversal exceeds limit.");for(let y=f.length-1;y>=0;y--)a.push(f[y]);if(b.length&&d.start<o&&d.start+b.
length>n){const y=b.subarray(Math.max(0,n-d.start),Math.min(b.length,o-d.start));l+=y.length,yield y}}if(l!==s)throw Er(
"UnixFS read did not produce the requested number of bytes.")}async _recordVerifiedFile(e,r,n){const s=await this._verifyFile(
e.cid,e,r,n);return this._writeRoot(e.cid,i=>({...i,cid:e.cid,kind:"file",...s,status:"complete",pinned:!!i?.pinned,retain:!1}),
r)}async*_walk(e,{signal:r,fetchBlock:n,allowMissing:s=!1,onMissing:i}={}){const o=e.map(c=>Je(c)),a=new Set;for(;o.length;){
Ze(r);const c=o.pop(),l=c.toString();if(a.has(l))continue;if(a.size>=this.maximumTraversalBlocks)throw new RangeError("A\
rtifact DAG traversal exceeds block limit.");a.add(l);let d;try{d=await this._readBlock(c,r)}catch(u){if(u.code!=="ERR_N\
OT_FOUND")throw u;if(i?.(u),n)await this._putBlock(c,await Ol(n(c,{signal:r}),r),r),d=await this._readBlock(c,r);else{if(s)
continue;throw u}}if(yield l,c.code===qa){const u=xa(d).Links;if(o.length+u.length>this.maximumTraversalBlocks)throw new RangeError(
"Artifact DAG links exceed limit.");for(const h of u)o.push(Je(h.Hash))}}}async _invalidateRoot(e,r){Wb(r)&&await this._writeRoot(
e,n=>!n||n.status==="deleting"?void 0:{...n,cid:e,kind:n.kind||"file",status:"partial",pinned:!!n.pinned,retain:!0})}async _checkRootIdentity(e,r,n){
const s=await this._readBlock(e,n);if(r.kind==="manifest"){let i;try{i=Gb(r.manifest)}catch{throw Er("Artifact manifest \
metadata is invalid.")}if(i.length!==s.length||i.some((o,a)=>o!==s[a]))throw Er("Artifact manifest metadata differs from\
 its verified root.")}return s}async _withRootVerification(e,r,n){return this._run(r,async s=>{const i=await So(`${this.
lockName}:verify:${e}`,"exclusive",s,this.lockManager);try{return await n(s)}finally{i()}})}async ensureLocal(e,{signal:r,
fetchBlock:n,pin:s=!0,kind:i,onProgress:o}={}){const a=Je(e).toString();if(o!==void 0&&typeof o!="function")throw new TypeError(
"Artifact progress must be a function.");return this._withRootVerification(a,r,c=>this._ensureLocal(a,{signal:c,fetchBlock:n,
pin:s,kind:i,onProgress:o}))}async _ensureLocal(e,{signal:r,fetchBlock:n,pin:s,kind:i,onProgress:o}){const a=await this.
backend.get("roots",e);if(a?.status==="deleting")throw new Error("Artifact deletion is pending; finish deletion before i\
mporting this root.");let c=0,l=a?.size||0,d=0,u=1,h=null,p=-1/0;const m=(y=!1)=>{const E=performance.now();if(o&&(y||E-
p>=100)){p=E;try{Promise.resolve(o({stage:"verify",path:h,loaded:c,totalBytes:l,completedFiles:d,totalFiles:u})).catch(()=>{})}catch{}}
Ze(r)},b=y=>{c+=y,m()};let g;const f=y=>{Wb(y)&&(g=y)};try{if(a?.status!=="complete"&&await this._writeRoot(e,S=>({...S,
cid:e,kind:i||S?.kind||"file",status:"partial",pinned:!!S?.pinned,retain:!0}),r),n)for await(const S of this._walk([e],{
signal:r,fetchBlock:n,onMissing:f}));let y;const E=Je(e).code===85?await this._readBlock(e,r):null;if(E&&E.byteLength<=ei){
let S;try{S=JSON.parse(new TextDecoder().decode(E))}catch{}(S?.schema===b1||i==="manifest")&&(y=dh(E,{maximumFileBytes:this.
maximumFileBytes}))}if(i==="manifest"&&!y)throw new TypeError("Manifest must be a bounded canonical JSON raw block.");if(y){
if(a?.status!=="complete"&&await this._writeRoot(e,S=>({...S,kind:"manifest",manifest:y,retain:!0}),r),l=y.files.reduce(
(S,v)=>S+v.size,0),u=y.files.length,!Number.isSafeInteger(l))throw new RangeError("Artifact verification byte count exce\
eds safe bounds.");m(!0);for(const S of y.files){if(h=S.path,n)for await(const v of this._walk([S.cid],{signal:r,fetchBlock:n,
onMissing:f}));await this._recordVerifiedFile(S,r,b),d++,m(!0)}}const k=y?{size:E.byteLength,manifest:y}:await this._verifyFile(
e,{},r,b),x=await this._writeRoot(e,S=>({cid:e,kind:y?"manifest":"file",...k,status:"complete",pinned:!!(s||S?.pinned),retain:!1}),
r);return g=void 0,l=c,d=u,h=null,m(!0),x}catch(y){throw await this._invalidateRoot(e,g||y),y}}async stat(e,{signal:r,[Io]:n}={}){
const s=Je(e).toString();return this._run(r,()=>this.backend.get("roots",s),void 0,n)}async getManifest(e,{signal:r,[Io]:n}={}){
const s=Je(e).toString();return this._run(r,async i=>dh(await this._readBlock(s,i),{maximumFileBytes:this.maximumFileBytes}),
void 0,n)}async*openRead(e,{offset:r=0,length:n,signal:s}={}){vr(r,"offset",0),n!==void 0&&vr(n,"length",0);const i=await this.
_begin(s);try{const o=await Ub(Je(e).toString(),this._localBlocks(i.signal));if(!["file","raw"].includes(o.type))throw new TypeError(
"Artifact root must identify a file.");const a=Number(o.type==="raw"?o.node.byteLength:o.unixfs.fileSize());if(a>this.maximumFileBytes||
r>a||n!==void 0&&n>a-r)throw new RangeError("Artifact range exceeds file size.");if(n===0||r===a)return;for await(const c of this.
_fileChunks(e,{size:a,offset:r,length:n,signal:i.signal}))Ze(i.signal),i.pause(),yield c,i.resume()}finally{i.finish()}}async pin(e,{
signal:r}={}){const n=Je(e).toString();return this._withRootVerification(n,r,async s=>{const i=await this.backend.get("r\
oots",n);if(i?.status!=="complete"||!i.pinned&&!i.retain)return this._ensureLocal(n,{signal:s,pin:!0});try{return await this.
_checkRootIdentity(n,i,s),i.pinned?structuredClone(i):this._writeRoot(n,o=>({...o,pinned:!0}),s)}catch(o){throw await this.
_invalidateRoot(n,o),o}})}async unpin(e,{signal:r}={}){const n=Je(e).toString();return this._run(r,s=>this._writeRoot(n,
i=>{if(!i)throw Mu(n);return{...i,pinned:!1,retain:!1}},s))}async withRetention(e,{signal:r}={}){if(typeof e!="function")
throw new TypeError("Artifact retention requires a callback.");const n=await this._begin(r),s={store:this,signal:n.signal,
held:!0,accepting:!0},i=new Set,o={};for(const a of["stat","getManifest","importFile","importManifest"])o[a]=(c,l={})=>{
if(!s.accepting)return Promise.reject(new Error("Artifact retention scope is no longer active."));if(i.size>=32)return Promise.
reject(new Error("Artifact retention operation queue is full."));const d=this[a](c,{...l,[Io]:s});return i.add(d),d.finally(
()=>i.delete(d)).catch(()=>{}),d};o.getStats=()=>this.getStats(),Object.freeze(o);try{const a=await Ol(Promise.resolve().
then(()=>(Ze(n.signal),e(o))),n.signal);return s.accepting=!1,await Promise.all([...i]),Ze(n.signal),a}finally{s.accepting=
!1,await Promise.allSettled([...i]),s.held=!1,n.finish()}}async acquireUse(e,{signal:r}={}){const n=Je(e).toString(),s=await this.
_begin(r,"none");let i;try{i=await So(`${this.lockName}:use:${n}`,"shared",s.signal,this.lockManager);const o=await this.
stat(n,{signal:s.signal});if(o?.status!=="complete"||!o.pinned&&!o.retain)throw new Error("Artifact use requires a compl\
ete retained root.");Ze(s.signal);let a=!1;const c=()=>{a||(a=!0,this.controller.signal.removeEventListener("abort",c),i(),
s.finish())};return this.controller.signal.addEventListener("abort",c,{once:!0}),this.controller.signal.aborted&&(c(),Ze(
this.controller.signal)),c}catch(o){throw i?.(),s.finish(),o}}async*_entries(e,r=!1){let n;for(;;){const s=await this.backend.
scan(e,{after:n,limit:16,keysOnly:r});if(!s.length)return;for(const i of s)yield i;n=s.at(-1).key}}async*list({signal:e}={}){
const r=await this._begin(e);try{for await(const n of this._entries("roots"))Ze(r.signal),r.pause(),yield n.value,r.resume()}finally{
r.finish()}}async*listBlockCids(e,{signal:r}={}){const n=Je(e).toString(),s=await this._begin(r);try{const i=await this.
backend.get("roots",n);if(i?.status!=="complete")throw new Error("Artifact serving requires a complete local root.");await this.
_checkRootIdentity(n,i,s.signal);const o=[n,...(i.manifest?.files||[]).map(a=>a.cid)];for await(const a of this._walk(o,
{signal:s.signal}))s.pause(),yield a,s.resume()}catch(i){throw await this._invalidateRoot(n,i),i}finally{s.finish()}}async _collectGarbage(e,r){
const n=await this.backend.getUsage("blocks"),s=n.generation||0,i=new Set;for await(const{value:l}of this._entries("root\
s")){if(l.cid===r||!l.pinned&&!l.retain)continue;const d=[l.cid,...(l.manifest?.files||[]).map(u=>u.cid)];for await(const u of this.
_walk(d,{signal:e,allowMissing:l.status!=="complete"}))if(i.add(u),i.size>n.entries)throw new RangeError("Artifact GC ex\
ceeds the stored block collection.")}const o=r?await this.backend.get("roots",r):null,a=!!(r&&i.has(r));if(o)if(a){const l=o.
kind==="manifest"?{cid:r,kind:"file",size:o.size,sha256:Tu(Je(r).multihash.digest),status:o.status,pinned:!1,retain:!1}:
{...o,pinned:!1,retain:!1};await this._writeRoot(r,()=>l,e)}else{const l={...o,pinned:!1,status:"deleting"};delete l.retain,
delete l.profile,await this._writeRoot(r,()=>l,e)}let c=0;for await(const{key:l,generation:d}of this._entries("blocks",!0))
Ze(e),d<=s&&!i.has(l)&&await this.backend.delete("blocks",l)&&c++;for await(const{key:l,value:d}of this._entries("roots"))
!d.pinned&&!d.retain&&!i.has(l)&&await this.backend.delete("roots",l);return this.usage=await this.backend.getUsage("blo\
cks"),this.rootUsage=await this.backend.getUsage("roots"),{deletedBlocks:c,freedBytes:n.bytes-this.usage.bytes,storedBytes:this.
usage.bytes,blockCount:this.usage.entries,...r?{cid:r,removed:!!o,retainedByOtherRoot:a}:{}}}async gc({signal:e}={}){return this.
_run(e,r=>this._collectGarbage(r),"exclusive")}async remove(e,{signal:r,useWaitMs:n=1e3}={}){const s=Je(e).toString();if(vr(
n,"useWaitMs"),n>3e4)throw new RangeError("Artifact use wait exceeds limit.");await this.open();const i=new AbortController,
o=setTimeout(()=>i.abort(Object.assign(new Error("This model is in use in another session. Unload it before deleting."),
{code:"ERR_ARTIFACT_IN_USE"})),n);o.unref?.();let a;try{a=await So(`${this.lockName}:use:${s}`,"exclusive",AbortSignal.any(
[i.signal,this.controller.signal,...r?[r]:[]]),this.lockManager)}finally{clearTimeout(o)}try{return await this._run(r,async c=>{
try{return await this._collectGarbage(c,s)}finally{this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.
backend.getUsage("roots")}},"exclusive")}finally{a()}}getStats(){return Object.freeze({name:this.name,isOpen:this.isOpen,
persistent:this.persistent,storedBytes:this.usage.bytes,blockCount:this.usage.entries,rootCount:this.rootUsage.entries,maximumBytes:this.
maximumBytes,maximumStoredBlocks:this.maximumStoredBlocks,capacity:this.capacity,pending:this.operations.size})}getBlockstore(){
return this.blockstore}getDatastore(){return this.datastore}_createBlockstore(){const e=this,r={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},async*get(n,{signal:s}={}){const i=await e._begin(s,"none");try{const o=await e._readBlock(
n,i.signal);i.pause(),yield o,i.resume()}finally{i.finish()}},put:(n,s,{signal:i}={})=>e._run(i,o=>e._putBlock(n,s,o),"n\
one"),has:(n,{signal:s}={})=>e._run(s,async()=>await e.backend.get("blocks",Je(n).toString())!==void 0,"none"),delete:async()=>{
throw new Error("Artifact blocks can only be removed through StateManager garbage collection.")},async*getAll({signal:n}={}){
const s=await e._begin(n);try{for await(const{key:i}of e._entries("blocks",!0))Ze(s.signal),s.pause(),yield{cid:Je(i),bytes:r.
get(i,{signal:s.signal})},s.resume()}finally{s.finish()}}};return r.putMany=async function*(n,s){for await(const{cid:i,bytes:o}of n)
yield await r.put(i,o,s)},r.getMany=async function*(n,s){for await(const i of n)yield{cid:i,bytes:r.get(i,s)}},r.deleteMany=
async function*(){throw new Error("Use ArtifactStore.gc() to remove blocks.")},r}_createDatastore(){const e=this,r=s=>{const i=s.
toString();if(i.length>2048)throw new RangeError("Datastore key exceeds limit.");return i},n={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},get:(s,{signal:i}={})=>e._run(i,async()=>{const o=await e.backend.get("routing",r(s));
if(o===void 0)throw Mu(s);return o},"none"),has:(s,{signal:i}={})=>e._run(i,async()=>await e.backend.get("routing",r(s))!==
void 0,"none"),put:(s,i,{signal:o}={})=>e._run(o,async a=>{if(Ze(a),!(i instanceof Uint8Array)||i.byteLength>ei)throw new RangeError(
"Datastore value exceeds limit.");return await e.backend.put("routing",r(s),i,{maximumBytes:e.maximumRoutingBytes,maximumEntries:4096}),
s},"none"),delete:(s,{signal:i}={})=>e._run(i,async()=>{await e.backend.delete("routing",r(s))},"none"),query:(s={},i={})=>e.
_queryDatastore(s,i,!1),queryKeys:(s={},i={})=>e._queryDatastore(s,i,!0),batch:()=>{const s=[];let i=0;const o=(a,c)=>{if(s.
length>=4096||(i+=c?.byteLength||0)>e.maximumRoutingBytes)throw new RangeError("Datastore batch exceeds limit.");s.push(
{key:a,value:c?.slice()})};return{put:(a,c)=>o(a,c),delete:a=>o(a),commit:async a=>{for(const{key:c,value:l}of s)l===void 0?
await n.delete(c,a):await n.put(c,l,a);s.length=0}}}};return n.putMany=async function*(s,i){for await(const o of s)await n.
put(o.key,o.value,i),yield o},n.getMany=async function*(s,i){for await(const o of s)yield{key:o,value:await n.get(o,i)}},
n.deleteMany=async function*(s,i){for await(const o of s)await n.delete(o,i),yield o},n}async*_queryDatastore(e,{signal:r}={},n){
const s=await this._begin(r,"none");try{const i=[];let o=0,a=0;const c=vr(e.offset??0,"query offset",0),l=vr(e.limit??4096,
"query limit",0);for await(const d of this._entries("routing",n)){if(Ze(s.signal),e.prefix&&!d.key.startsWith(e.prefix))
continue;const u=new zr(d.key),h=n?u:{key:u,value:d.value};if(!e.filters?.some(p=>!p(h))&&(e.orders?.length?i.push(h):o++>=
c&&a<l&&(a++,s.pause(),yield h,s.resume()),!e.orders?.length&&a>=l))return}if(e.orders?.length){i.sort((d,u)=>{for(const h of e.
orders){const p=h(d,u);if(p)return p}return 0});for(const d of i.slice(c,c+l))s.pause(),yield d,s.resume()}}finally{s.finish()}}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.controller.abort(new DOMException("Artifact store destroy\
ed.","AbortError")),this.destroying=(async()=>{try{await this.opening?.catch(()=>{}),await Promise.allSettled([...this.operations].
map(e=>e.settled)),this.ownsBackend&&await this.backend.close()}finally{this.isOpen=!1,this.onDestroy?.(this)}})(),this.
destroying)}}const w1=new TextEncoder,DB=Object.freeze({bindings:8,agents:16,promptBytes:16*1024,replyBytes:64*1024});function $B(t){
if(!t||!/^[a-f0-9]{64}$/.test(t.sha256??"")||!Number.isInteger(t.width)||!Number.isInteger(t.height)||t.width<1||t.height<
1||t.width>256||t.height>256||t.channels!==4)throw new Error("Invalid agent face");return{sha256:t.sha256,width:t.width,
height:t.height,channels:4}}function Bu(t,e,r){if(typeof t!="string"||!t.trim()||/[\u0000-\u001f]/.test(t)||w1.encode(t).
length>e)throw new Error(`Invalid world agent ${r}`);return t}function NB(t){if(!Array.isArray(t)||t.length!==3||t.some(
e=>!Number.isFinite(e)||Math.abs(e)>1e8))throw new Error("World position must contain three bounded coordinates");return[
...t]}function PB(t){if(!Array.isArray(t)||t.length>DB.bindings)throw new Error("Too many agent world bindings");const e=new Set;
return t.map(r=>{const n=Bu(r?.worldId,240,"world");if(e.has(n))throw new Error("Duplicate agent world binding");if(e.add(
n),!/^#[a-f0-9]{6}$/i.test(r.color??"")||typeof r.shared!="boolean")throw new Error("Invalid agent body settings");if(r.
respondToWorldChat!==void 0&&typeof r.respondToWorldChat!="boolean")throw new Error("Invalid world chat preference");const s={
worldId:n,position:NB(r.position),color:r.color,shared:r.shared,respondToWorldChat:r.respondToWorldChat??!1};if(r.appearancePrompt!==
void 0){if(typeof r.appearancePrompt!="string"||r.appearancePrompt.includes("\0")||w1.encode(r.appearancePrompt).length>
2048)throw new Error("Invalid appearance prompt");s.appearancePrompt=r.appearancePrompt.trim()}if(r.appearanceRequestId!==
void 0&&(s.appearanceRequestId=Bu(r.appearanceRequestId,128,"appearance request")),r.face!==void 0){const i=Bu(r.face?.attachmentId,
128,"face attachment");if(!/^[A-Za-z0-9._:-]+$/.test(i))throw new Error("Invalid face attachment");s.face={...$B(r.face),
attachmentId:i}}return s})}const Ul="peercompute.agent.v1",Vb="peercompute.agent.export.v1",Kt=Object.freeze({headBytes:64*
1024,eventBytes:128*1024,operationBytes:16*1024,events:256,historyBytes:8*1024*1024,operations:256,attachmentBytes:4*1024*
1024,attachmentCount:64,attachmentTotalBytes:64*1024*1024,exportBytes:12*1024*1024}),OB=new Set(["paused","running","wai\
ting","completed","error"]),UB=Object.freeze(["prepared","dispatched","completed","failed","cancelled","outcome-unknown"]),
uh=t=>["prepared","dispatched"].includes(t?.status),v1=new TextEncoder;function nr(t,e){return Object.assign(new Error(e),
{code:t})}function ht(t,e="identifier"){if(typeof t!="string"||!/^[A-Za-z0-9._:-]{1,128}$/.test(t))throw new TypeError(`\
Invalid agent ${e}`);return t}function Qs(t,e,r="data"){let n=0;function s(a,c){if(++n>2e4||c>16)throw new RangeError(`A\
gent ${r} is too complex`);if(!(a===null||typeof a=="string"||typeof a=="boolean")&&!(typeof a=="number"&&Number.isFinite(
a))){if(!a||typeof a!="object"||!Array.isArray(a)&&![Object.prototype,null].includes(Object.getPrototypeOf(a)))throw new TypeError(
`Invalid agent ${r}`);for(const[l,d]of Object.entries(a)){if(["__proto__","prototype","constructor"].includes(l))throw new TypeError(
`Invalid agent ${r} key`);s(d,c+1)}}}s(t,0);const i=JSON.stringify(t),o=v1.encode(i).byteLength;if(o>e)throw new RangeError(
`Agent ${r} exceeds its byte budget`);return{value:JSON.parse(i),bytes:o}}function mc(t,e,r){if(typeof t!="string"||t.includes(
"\0")||v1.encode(t).byteLength>e)throw new TypeError(`Invalid agent ${r}`);return t}function fh(t={}){if(!t||typeof t!="\
object"||Array.isArray(t))throw new TypeError("Invalid agent input");const e=mc(t.name??"",240,"name").trim();if(!e)throw new TypeError(
"Agent name is required");const r=t.goals??[];if(!Array.isArray(r)||r.length>16)throw new TypeError("Invalid agent goals");
const n=t.inferenceMode??"local-only";if(!["local-only","network-assisted"].includes(n))throw new TypeError("Invalid age\
nt inference mode");return{identity:{name:e,instructions:mc(t.instructions??"",16*1024,"instructions")},goals:r.map(s=>mc(
s,4096,"goal").trim()).filter(Boolean),context:{summary:mc(t.summary??"",24*1024,"summary")},policy:{inferenceMode:n},...t.
embodiments!==void 0?{embodiments:PB(t.embodiments)}:{}}}function hh(t){const{value:e}=Qs(t,Kt.operationBytes,"operation");
if(!e||Array.isArray(e))throw new TypeError("Invalid agent operation");if(ht(e.id,"operation ID"),!UB.includes(e.status))
throw new TypeError("Invalid agent operation status");return e}function Ks(t){if(!t||t.schema!==Ul||t.agentKind!=="gener\
al")throw new TypeError("Unsupported agent schema or kind");const e=fh({name:t.identity?.name,instructions:t.identity?.instructions,
goals:t.goals,summary:t.context?.summary,inferenceMode:t.policy?.inferenceMode,embodiments:t.embodiments});if(ht(t.agentId,
"ID"),t.authority?.kind!=="local"||t.authority.epoch!==0)throw new TypeError("Portable agent authority is not supported");
if(ht(t.authority.hostId,"local host ID"),!Number.isSafeInteger(t.revision)||t.revision<1||!OB.has(t.status))throw new TypeError(
"Invalid agent revision or status");for(const s of["createdAt","updatedAt"])if(!Number.isSafeInteger(t[s])||t[s]<0)throw new TypeError(
"Invalid agent timestamp");const r=t.pendingOperation==null?null:hh(t.pendingOperation);if(r&&!uh(r))throw new TypeError(
"Only active operations may be pending");const n={schema:Ul,agentId:t.agentId,agentKind:"general",...e,authority:{kind:"\
local",hostId:t.authority.hostId,epoch:0},revision:t.revision,status:t.status,createdAt:t.createdAt,updatedAt:t.updatedAt,
pendingOperation:r};return Qs(n,Kt.headBytes,"head").value}function Kb(t){const e=Qs(t,Kt.eventBytes,"event");if(!e.value||
Array.isArray(e.value))throw new TypeError("Invalid agent event");const r=e.value.attachmentIds;if(r!==void 0&&(!Array.isArray(
r)||r.length>4||new Set(r).size!==r.length))throw new TypeError("Invalid agent attachment references");return r?.forEach(
n=>ht(n,"attachment ID")),e.value}function E1(t){if(ht(t?.id,"attachment ID"),!Number.isSafeInteger(t.width)||!Number.isSafeInteger(
t.height)||t.width<1||t.height<1||t.width>1024||t.height>1024||t.channels!==4||!(t.data instanceof Uint8Array)||t.data.byteLength!==
t.width*t.height*4||t.data.byteLength>Kt.attachmentBytes)throw new TypeError("Invalid bounded RGBA agent attachment");return{
id:t.id,width:t.width,height:t.height,channels:4,data:t.data.slice()}}const xt=t=>new Promise((e,r)=>{t.onsuccess=()=>e(
t.result),t.onerror=()=>r(t.error)}),FB=t=>t===void 0?void 0:structuredClone(t),Lu=["heads","events","operations","attac\
hments"];class zB{constructor({name:e="default",indexedDBImpl:r=globalThis.indexedDB,keyRange:n=globalThis.IDBKeyRange,lockManager:s=globalThis.
navigator?.locks,now:i=Date.now,onDestroy:o}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/.test(e))throw new TypeError("I\
nvalid agent store name");this.name=e,this.databaseName=`peercompute-agents-v1-${e}`,this.lockName=this.databaseName,this.
persistent=!0,this.indexedDB=r,this.keyRange=n,this.lockManager=s,this.now=i,this.onDestroy=o,this.database=null,this.hostId=
null,this.runs=new Set,this.transactions=new Set,this.lifetime=new AbortController}async open(){if(this.closing||this.destroyed)
throw new Error("Agent store is closed");if(this.database)return this;if(this.opening)return this.opening;if(!this.indexedDB?.
open||!this.keyRange)throw nr("ERR_AGENT_STORAGE_UNAVAILABLE","Private agent persistence requires IndexedDB");this.opening=
(async()=>(this.database=await new Promise((e,r)=>{const n=this.indexedDB.open(this.databaseName,1);let s=!1;n.onupgradeneeded=
()=>{const i=n.result;i.createObjectStore("heads",{keyPath:"id"}),i.createObjectStore("events",{keyPath:["agentId","sequ\
ence"]}),i.createObjectStore("operations",{keyPath:["agentId","id"]}),i.createObjectStore("attachments",{keyPath:["agent\
Id","id"]}),i.createObjectStore("metadata")},n.onerror=()=>{s=!0,r(n.error)},n.onblocked=()=>{s=!0,r(nr("ERR_AGENT_STORA\
GE_BLOCKED","Another tab is blocking the agent database upgrade"))},n.onsuccess=()=>{s?n.result.close():e(n.result)}}),this.
database.onversionchange=()=>{this.database?.close(),this.database=null,this.lifetime.abort(nr("ERR_AGENT_STORAGE_CHANGE\
D","Agent storage changed; pause and reload this tab"))},this.hostId=await this._transaction(["metadata"],"readwrite",async e=>{
const r=e.objectStore("metadata");let n=await xt(r.get("hostId"));return n||(n=crypto.randomUUID(),await xt(r.put(n,"hos\
tId"))),ht(n,"local host ID")}),this))();try{return await this.opening}catch(e){throw this.database?.close(),this.database=
null,e}finally{this.opening=null}}_time(){const e=this.now();if(!Number.isSafeInteger(e)||e<0)throw new Error("Invalid a\
gent clock");return e}_newWork(){if(this.closing||this.destroyed)throw new Error("Agent store is closing")}async _transaction(e,r,n,s){
if(s?.throwIfAborted(),!this.database||this.destroyed)throw nr("ERR_AGENT_STORAGE_UNAVAILABLE","Agent database is unavai\
lable");const i=this.database.transaction(e,r),o=new Promise((c,l)=>{i.oncomplete=c,i.onabort=()=>l(i.error||s?.reason||
new Error("Agent transaction aborted")),i.onerror=()=>{}});this.transactions.add(o),o.catch(()=>{});const a=()=>{try{i.abort()}catch{}};
s?.addEventListener("abort",a,{once:!0});try{const c=await n(i);return await o,FB(c)}catch(c){throw a(),await o.catch(()=>{}),
c}finally{this.transactions.delete(o),s?.removeEventListener("abort",a)}}_range(e,r,n=!1){return this.keyRange.bound([e,
r??(n?0:"")],[e,n?Number.MAX_SAFE_INTEGER:"￿"],r!==void 0,!1)}_scan(e,r,n,s,i=o=>o){return new Promise((o,a)=>{const c=[],
l=e.objectStore(r).openCursor(n);l.onerror=()=>a(l.error),l.onsuccess=()=>{const d=l.result;if(!d||c.length>=s)return o(
c);c.push(i(d.value)),c.length>=s?o(c):d.continue()}})}_limit(e){if(!Number.isSafeInteger(e)||e<1||e>100)throw new RangeError(
"Agent page limit must be 1–100");return e}async create(e,{signal:r}={}){this._newWork();const n=fh(e),s=this._time(),
i=Ks({schema:Ul,agentId:crypto.randomUUID(),agentKind:"general",...n,authority:{kind:"local",hostId:this.hostId,epoch:0},
revision:1,status:"paused",createdAt:s,updatedAt:s,pendingOperation:null});return this._transaction(["heads"],"readwrite",
async o=>(await xt(o.objectStore("heads").add({id:i.agentId,record:i,eventCount:0,eventBytes:0,nextSequence:1,operationCount:0,
attachmentCount:0,attachmentBytes:0})),i),r)}get(e,{signal:r}={}){return ht(e),this._transaction(["heads"],"readonly",async n=>(await xt(
n.objectStore("heads").get(e)))?.record,r)}list({after:e,limit:r=50,signal:n}={}){return e!==void 0&&ht(e),this._transaction(
["heads"],"readonly",s=>this._scan(s,"heads",e===void 0?null:this.keyRange.lowerBound(e,!0),this._limit(r),i=>i.record),
n)}events(e,{after:r,limit:n=50,signal:s}={}){if(ht(e),r!==void 0&&(!Number.isSafeInteger(r)||r<0))throw new TypeError("\
Invalid event cursor");return this._transaction(["events"],"readonly",i=>this._scan(i,"events",this._range(e,r,!0),this.
_limit(n)),s)}operations(e,{after:r,limit:n=50,signal:s}={}){return ht(e),r!==void 0&&ht(r),this._transaction(["operatio\
ns"],"readonly",i=>this._scan(i,"operations",this._range(e,r),this._limit(n)),s)}getOperation(e,r,{signal:n}={}){return ht(
e),ht(r),this._transaction(["operations"],"readonly",s=>xt(s.objectStore("operations").get([e,r])),n)}getAttachment(e,r,{
signal:n}={}){return ht(e),ht(r),this._transaction(["attachments"],"readonly",s=>xt(s.objectStore("attachments").get([e,
r])),n)}async commit(e,{expectedRevision:r,head:n,event:s,operation:i,attachments:o=[]},{signal:a}={}){if(ht(e),!Number.
isSafeInteger(r)||r<1)throw new TypeError("Expected agent revision is required");const c=n===void 0?null:Ks(n),l=s===void 0?
null:Kb(s),d=i===void 0?null:hh(i);if(!Array.isArray(o)||o.length>4)throw new TypeError("Too many agent attachments");const u=o.
map(E1);if(new Set(u.map(p=>p.id)).size!==u.length)throw new TypeError("Duplicate agent attachment");if(u.some(p=>!l?.attachmentIds?.
includes(p.id)))throw new Error("Agent attachments require event references");const h=this._time();return this._transaction(
Lu,"readwrite",async p=>{const m=p.objectStore("heads"),b=await xt(m.get(e));if(!b)throw nr("ERR_AGENT_NOT_FOUND","Agent\
 no longer exists");const g=b.record;if(g.revision!==r)throw nr("ERR_AGENT_CONFLICT","Agent changed in another operation\
; reload before saving");const f=c??g;if(f.agentId!==e||f.authority.hostId!==g.authority.hostId||f.createdAt!==g.createdAt||
f.authority.hostId!==this.hostId)throw new Error("Agent identity and local authority cannot be changed");let y=g.pendingOperation;
if(d){const E=p.objectStore("operations"),k=await xt(E.get([e,d.id]));if(d.status==="prepared"){if(k||y)throw nr("ERR_AG\
ENT_OPERATION_CONFLICT","An agent operation already exists or awaits reconciliation");b.operationCount++}else if(!k||!uh(
k)||y?.id!==d.id)throw nr("ERR_AGENT_OPERATION_CONFLICT","Agent operation is no longer active");if(b.operationCount>Kt.operations)
throw nr("ERR_AGENT_HISTORY_FULL","Agent operation history is full; export before continuing");const x=hh({...k,...d,agentId:e,
updatedAt:h});await xt(E.put(x)),y=uh(x)?x:null}for(const E of u){const k=p.objectStore("attachments");if(await xt(k.get(
[e,E.id])))throw new Error("Agent attachments are immutable");if(b.attachmentCount++,b.attachmentBytes+=E.data.byteLength,
b.attachmentCount>Kt.attachmentCount||b.attachmentBytes>Kt.attachmentTotalBytes)throw nr("ERR_AGENT_HISTORY_FULL","Priva\
te image history is full");await xt(k.add({...E,agentId:e}))}if(l){for(const x of l.attachmentIds??[])if(!await xt(p.objectStore(
"attachments").get([e,x])))throw new Error("Agent attachment is missing");const E={...l,agentId:e,sequence:b.nextSequence++,
at:h},{bytes:k}=Qs(E,Kt.eventBytes,"event");if(b.eventCount++,b.eventBytes+=k,b.eventCount>Kt.events||b.eventBytes>Kt.historyBytes)
throw nr("ERR_AGENT_HISTORY_FULL","Agent history is full; export before continuing");await xt(p.objectStore("events").add(
E))}return b.record=Ks({...f,revision:g.revision+1,updatedAt:h,pendingOperation:y}),await xt(m.put(b)),b.record},a)}async withRun(e,r,{
signal:n}={}){if(this._newWork(),ht(e),n?.throwIfAborted(),typeof r!="function")throw new TypeError("Agent run callback \
is required");if(!this.lockManager?.request)throw nr("ERR_AGENT_LOCK_UNAVAILABLE","This browser cannot safely coordinate\
 agent execution between tabs");const s=n?AbortSignal.any([n,this.lifetime.signal]):this.lifetime.signal,i=this.lockManager.
request(`${this.lockName}:run:${e}`,{mode:"exclusive",ifAvailable:!0},async o=>{if(!o)throw nr("ERR_AGENT_BUSY","This ag\
ent is running or being edited in another tab");s.throwIfAborted();const a=await this.get(e,{signal:s});if(!a)throw nr("\
ERR_AGENT_NOT_FOUND","Agent no longer exists");if(a.authority.hostId!==this.hostId)throw new Error("This installation do\
es not own the agent");return r({signal:s,runId:crypto.randomUUID(),head:a})});this.runs.add(i);try{return await i}finally{
this.runs.delete(i)}}async delete(e,{expectedRevision:r,signal:n}={}){if(!Number.isSafeInteger(r)||r<1)throw new TypeError(
"Expected agent revision is required");return this.withRun(e,()=>this._transaction(Lu,"readwrite",async s=>{if((await xt(
s.objectStore("heads").get(e))).record.revision!==r)throw nr("ERR_AGENT_CONFLICT","Agent changed before deletion");return await Promise.
all([xt(s.objectStore("heads").delete(e)),xt(s.objectStore("events").delete(this._range(e,void 0,!0))),xt(s.objectStore(
"operations").delete(this._range(e))),xt(s.objectStore("attachments").delete(this._range(e)))]),{deleted:!0,agentId:e}},
n),{signal:n})}export(e,{signal:r}={}){return ht(e),this._transaction(Lu,"readonly",async n=>{const s=await xt(n.objectStore(
"heads").get(e));if(!s)throw nr("ERR_AGENT_NOT_FOUND","Agent no longer exists");const[i,o]=await Promise.all([this._scan(
n,"events",this._range(e,void 0,!0),Kt.events),this._scan(n,"attachments",this._range(e),Kt.attachmentCount,({id:a,width:c,
height:l,channels:d})=>({id:a,width:c,height:l,channels:d,omitted:!0}))]);return Qs({schema:Vb,exportedAt:this._time(),agent:{
...s.record,status:"paused",pendingOperation:null},events:i,attachments:o,attachmentsOmitted:!0},Kt.exportBytes,"export").
value},r)}async restoreAsNew(e,{name:r,signal:n}={}){this._newWork();const s=Qs(e,Kt.exportBytes,"export").value;if(s.schema!==
Vb||!Array.isArray(s.events)||s.events.length>Kt.events)throw new TypeError("Unsupported agent export");const i=Ks(s.agent),
o=fh({name:r??i.identity.name,instructions:i.identity.instructions,goals:i.goals,summary:i.context.summary,inferenceMode:"\
local-only"}),a=this._time(),c=crypto.randomUUID(),l=Ks({schema:Ul,agentId:c,agentKind:"general",...o,authority:{kind:"l\
ocal",hostId:this.hostId,epoch:0},revision:1,status:"paused",createdAt:a,updatedAt:a,pendingOperation:null});let d=0;const u=s.
events.map((h,p)=>{const{agentId:m,sequence:b,at:g,attachmentIds:f,...y}=Kb(h),E={...y,agentId:c,sequence:p+1,at:a,restoredFrom:i.
agentId,...f?.length?{attachmentsOmitted:!0}:{}};return d+=Qs(E,Kt.eventBytes,"event").bytes,E});if(d>Kt.historyBytes)throw new RangeError(
"Restored agent history exceeds its byte budget");return this._transaction(["heads","events"],"readwrite",async h=>{await xt(
h.objectStore("heads").add({id:c,record:l,eventCount:u.length,eventBytes:d,nextSequence:u.length+1,operationCount:0,attachmentCount:0,
attachmentBytes:0}));for(const p of u)await xt(h.objectStore("events").add(p));return l},n)}getStatus(){return{persistent:!0,
available:!!this.database,executionAvailable:!!this.lockManager?.request,activeRuns:this.runs.size}}async destroy(){return this.
destroying?this.destroying:(this.closing=!0,this.destroying=(async()=>{this.lifetime.abort(new DOMException("Agent store\
 closed","AbortError")),await this.opening?.catch(()=>{}),await Promise.allSettled([...this.runs]),await Promise.allSettled(
[...this.transactions]),this.database?.close(),this.database=null,this.destroyed=!0,this.onDestroy?.(this)})(),this.destroying)}}
const qB="peercompute.state.task-graph-cache-artifact-admission.v0",jB="peercompute.state.task-graph-cache-artifact-inva\
lidation.v0",ki="taskGraphCacheArtifactAdmissions",GB="taskGraphCacheArtifactInvalidations";function Qb(t,e=[]){return Array.
isArray(t)?t.map(r=>String(r||"").trim()).filter(Boolean):typeof t=="string"?t.split(",").map(r=>r.trim()).filter(Boolean):
[...e]}function _o(t){if(t==null)return t;if(typeof structuredClone=="function")try{return structuredClone(t)}catch{}return JSON.
parse(JSON.stringify(t))}class WB{constructor(e,r={}){this.networkManager=e,this.libp2pNode=e?e.getLibp2pNode():null,this.
config={docName:r.docName||"peercompute-state",topic:r.topic||"peercompute-state-sync",enablePersistence:r.enablePersistence!==
!1,disableNetworkProvider:r.disableNetworkProvider||!1,disableBroadcast:r.disableBroadcast||!1,broadcastNamespaces:Array.
isArray(r.broadcastNamespaces)?r.broadcastNamespaces:null,...r},this.ydoc=new eo,this.state=this.ydoc.getMap("state"),this.
dataState=new nA({ydoc:this.ydoc,stateMap:this.state,hotStore:r.hotStore,deltaNamespace:r.deltaNamespace||"deltas"}),this.
indexeddbProvider=null,this.libp2pProvider=null,this.subscribers=new Map,this.globalSubscribers=new Set,this.isInitialized=
!1,this.persistenceFailed=!1,this.agentRecordStores=new Map}_getNamespaceMap(e){let r=this.state.get(e);return r||(r=new Xn,
this.state.set(e,r)),r}applyRemoteUpdate(e){try{const r=(()=>{if(e instanceof Uint8Array)return e;if(Array.isArray(e))return new Uint8Array(
e);if(e&&typeof e=="object"){const s=Object.values(e);return new Uint8Array(s)}return new Uint8Array(0)})();if(r.byteLength===
0){console.warn("[StateManager] Remote update was empty, skipping");return}const n=r;rl(this.ydoc,n,this)}catch(r){console.
error("[StateManager] Failed to apply remote update:",r)}}applyStateSet(e,r,n){try{this.ydoc.transact(()=>{if(n){const s=this.
_getNamespaceMap(n);r===void 0?s.delete(e):s.set(e,r)}else r===void 0?this.state.delete(e):this.state.set(e,r)},"remote-\
state-set")}catch(s){console.error("[StateManager] Failed to apply state-set:",s)}}commitDelta(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");this.dataState.commitDelta(e)}getDataState(){return this.dataState}createLocalArtifactCache(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const r=new uA({...e,onDestroy:n=>{this.dataState.unregisterLocalArtifactCache(
n.name,n)}});try{return this.dataState.registerLocalArtifactCache(r.name,r)}catch(n){throw r.destroy(),n}}getLocalArtifactCache(e){
return this.dataState.getLocalArtifactCache(e)}createArtifactStore(e={}){if(this.destroyed)throw new Error("StateManager\
 is destroyed");const r=e.name||"default";if(this.getArtifactStore(r))throw new Error(`Artifact store ${r} is already re\
gistered`);const n=new LB({...e,name:r,onDestroy:s=>{this.dataState.unregisterArtifactStore(s),e.onDestroy?.(s)}});return this.
dataState.registerArtifactStore(n)}getArtifactStore(e="default"){return this.dataState.getArtifactStore(e)}createAgentRecordStore(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const r=e.name||"default";if(this.agentRecordStores.has(r))
throw new Error(`Agent store ${r} is already registered`);const n=new zB({...e,name:r,onDestroy:s=>{this.agentRecordStores.
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
rtifact.cacheKey");const s=Number.isFinite(r.admittedAt)?r.admittedAt:Date.now(),i=Qb(r.invalidationRefs??e.invalidationRefs??
e.admission?.invalidationRefs,[]),o={schema:qB,admissionId:String(r.admissionId||e.admission?.admissionId||`task-graph-c\
ache-admission:${n}:${s}`),cacheKey:n,artifactId:e.artifactId||`${n}:artifact`,artifactSchema:e.schema||null,artifactStatus:e.
status||null,cacheScope:e.cacheScope||r.cacheScope||null,cacheKeySource:e.cacheKeySource||r.cacheKeySource||null,inputHash:e.
inputHash||r.inputHash||null,resultHash:e.resultHash||r.resultHash||null,status:r.status||"admitted",admitted:!0,authority:r.
authority||"state-manager",validatorId:r.validatorId||e.admission?.validatorId||null,reason:r.reason||"state-manager-cac\
he-artifact-admission",invalidationRefs:i,admittedAt:s,acceptedAt:s,expiresAt:r.expiresAt??e.expiresAt??null,sourceNodeId:r.
sourceNodeId||this.state.get("nodeId")||null,artifact:_o(e)};return this.writeScoped(ki,n,o),_o(o)}invalidateTaskGraphCacheArtifact(e,r={}){
if(!this.isInitialized)throw new Error("StateManager not initialized");const n=e&&typeof e=="object"?e:null,s=String(r.cacheKey||
n?.cacheKey||e||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires a cacheKey");const i=this.readScoped(
ki,s),o=Number.isFinite(r.invalidatedAt)?r.invalidatedAt:Date.now(),a=Qb(r.invalidationRefs??n?.invalidationRefs??i?.invalidationRefs,
[]),c={schema:jB,invalidationId:String(r.invalidationId||`task-graph-cache-invalidation:${s}:${o}`),cacheKey:s,artifactId:n?.
artifactId||i?.artifactId||`${s}:artifact`,status:"invalidated",authority:r.authority||"state-manager",reason:r.reason||
"state-manager-cache-artifact-invalidated",invalidationRefs:a,previousAdmissionStatus:i?.status||null,invalidatedAt:o,sourceNodeId:r.
sourceNodeId||this.state.get("nodeId")||null};return this.writeScoped(GB,c.invalidationId,c),i&&this.writeScoped(ki,s,{...i,
status:"invalidated",admitted:!1,invalidatedAt:o,invalidation:c}),_o(c)}getTaskGraphCacheArtifactAdmission(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");const r=String(e||"").trim();if(!r)return null;const n=this.readScoped(ki,
r);return n?_o(n):null}listTaskGraphCacheArtifactAdmissions(e={}){if(!this.isInitialized)throw new Error("StateManager n\
ot initialized");const r=e.includeInvalidated!==!1;return this.listNamespaceKeys(ki).map(n=>this.readScoped(ki,n)).filter(
n=>n&&(r||n.admitted===!0)).map(n=>_o(n)).sort((n,s)=>String(n.cacheKey||"").localeCompare(String(s.cacheKey||"")))}async initialize(e={}){
if(this.isInitialized){console.warn("[StateManager] Already initialized");return}try{if(this.config.enablePersistence&&(this.
indexeddbProvider=new tA(this.config.docName,this.ydoc),await new Promise(r=>{this.indexeddbProvider.once("synced",r)}),
console.log("[StateManager] IndexedDB persistence loaded")),this.networkManager&&!this.config.disableNetworkProvider)try{
this.libp2pProvider=new rA(this.networkManager,this.ydoc,{topic:this.config.topic}),console.log("[StateManager] PeerComp\
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
n.keys()),i=null,o=!0;const a=()=>{const u=this.state.get(e);return u instanceof Xn?u:null};let c;const l=(u,h=null)=>{if(!o||
u===n)return;const p=s,m=u?Array.from(u.entries()):[],b=new Set(m.map(([g])=>g));n?.unobserve(c),n=u,s=b,i=h,n?.observe(
c);for(const g of p)if(!b.has(g)){if(!o||a()!==n)return;r(void 0,g)}for(const[g,f]of m){if(!o||a()!==n)return;r(f,g)}};c=
(u,h)=>{if(!o||u.target!==n)return;const p=a();if(p!==n){l(p,h);return}h!==i&&u.keysChanged.forEach(m=>{!o||u.target!==n||
a()!==n||(n.has(m)?s.add(m):s.delete(m),r(n.get(m),m))})};const d=(u,h)=>{!o||!u.keysChanged.has(e)||l(a(),h)};return n.
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
pending}}}const Du=new Map,$u=new Map,HB={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array};function k1(t="Uint8Array"){const e=HB[t];if(!e)throw new Error(
`Unsupported typed array view: ${t}`);return e}function VB(t){return new t.constructor(t)}function x1(t){return ArrayBuffer.
isView(t)&&!(t instanceof DataView)}function KB(t){return t instanceof ArrayBuffer?new Uint8Array(t):x1(t)?new Uint8Array(
t.buffer,t.byteOffset,t.byteLength):Array.isArray(t)?Uint8Array.from(t):null}async function Kp(t){const e=String(t);return Du.
has(e)||Du.set(e,Ft(()=>import(`${e}`),[],import.meta.url)),Du.get(e)}async function Jb(t){const e=KB(t);if(e)
return e;if(typeof t=="string"||t instanceof URL){const r=await fetch(String(t));if(!r.ok)throw new Error(`Failed to fet\
ch wasm module: ${r.status} ${r.statusText}`);const n=await r.arrayBuffer();return new Uint8Array(n)}throw new Error("wa\
sm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function QB(t){if(typeof t=="string"||
t instanceof URL){const r=String(t);return $u.has(r)||$u.set(r,(async()=>{const n=await Jb(t);return WebAssembly.compile(
n)})()),$u.get(r)}const e=await Jb(t);return WebAssembly.compile(e)}async function JB(t,e){if(t.importsModule){const r=await Kp(
t.importsModule),n=t.importsExport||"default",s=r[n];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="obje\
ct")return s;throw new Error(`WASM imports export "${n}" must be a function or object`)}return t.imports&&typeof t.imports==
"object"?t.imports:{}}function S1(t,e,r={}){const n=r.exportName||e.memoryExport||"memory",s=t.exports?.[n];if(!(s instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return s}function XB(t,e){if(Object.prototype.
hasOwnProperty.call(t,"values"))return t.values;const r=t.dataKey||t.name;if(r&&e&&Object.prototype.hasOwnProperty.call(
e,r))return e[r]}function YB(t,e){if(t==null)return null;if(t instanceof e)return t;if(x1(t))return new e(t.buffer,t.byteOffset,
Math.floor(t.byteLength/e.BYTES_PER_ELEMENT));if(t instanceof ArrayBuffer)return new e(t);if(Array.isArray(t))return e.from(
t);throw new Error(`Unsupported memory input for ${e.name}`)}function Xb(t,e,r){(Array.isArray(e.inputViews)?e.inputViews:
[]).forEach(s=>{const i=k1(s.view),o=YB(XB(s,r),i);if(!o)return;const a=S1(t,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0;new i(a.buffer,c,o.length).set(o)})}function ZB(t,e){const r=Array.isArray(e.outputViews)?e.outputViews:[];if(r.length===
0)return null;const n={};return r.forEach((s,i)=>{const o=k1(s.view),a=S1(t,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0,l=Number.isFinite(s.length)?s.length:0;if(l<=0)throw new Error(`WASM output view "${s.name||i}" must provide a positiv\
e length`);const d=s.name||`output${i}`;n[d]=VB(new o(a.buffer,c,l))}),n}function A1(t,e){return Array.isArray(e.args)?e.
args:Array.isArray(t.args)?t.args:Array.isArray(t.data?.args)?t.data.args:[]}function eL(t={}){const e=globalThis.navigator?.
gpu??null;if(t.webgpu?.required===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!e,gpu:e,async requestAdapter(n=t.webgpu?.adapterOptions){return e?e.requestAdapter(n):null},async requestDevice(n={}){
if(!e)return null;const s=n.adapter||await e.requestAdapter(n.adapterOptions||t.webgpu?.adapterOptions);return s?s.requestDevice(
n.deviceDescriptor||t.webgpu?.deviceDescriptor):null}}}async function I1(t){const e=t.wasm||{},r=e.source??t.wasmSource??
t.source;if(!r)throw new Error("wasm tasks require wasm.source");const n=await QB(r),s=await JB(e,{task:t,data:t.data??null,
WebAssembly}),i=await WebAssembly.instantiate(n,s);return Xb(i,e,t.data??null),{module:n,instance:i,exports:i.exports,imports:s,
task:t,data:t.data??null,callExport(o,a=[]){const c=i.exports?.[o];if(typeof c!="function")throw new Error(`WASM export \
"${o}" was not found`);return c(...a)},readOutputViews(){return ZB(i,e)},writeInputViews(o){Xb(i,e,o)}}}async function tL(t,e,r){
const n=t.wasm||{};if(!n.resultModule)return r.value;const s=await Kp(n.resultModule),i=n.resultExport||"default",o=s[i];
if(typeof o!="function")throw new Error(`WASM result export "${i}" must be a function`);const a=await o({...r,wasm:e,task:t,
data:t.data??null});return typeof a>"u"?r:a}async function rL(t){const e=await I1(t),r=t.wasm||{},n=A1(t,r),s=r.entry?await e.
callExport(r.entry,n):void 0,i=e.readOutputViews();return tL(t,e,{returnValue:s,outputs:i,value:i?typeof s>"u"?i:{returnValue:s,
outputs:i}:s})}async function nL(t){const e=await I1(t),r=t.hostModule||t.module;if(!r)throw new Error("wasm-webgpu task\
s require hostModule or module");t.wasm?.callEntryBeforeHost&&t.wasm.entry&&(e.entryResult=await e.callExport(t.wasm.entry,
A1(t,t.wasm)));const n=await Kp(r),s=t.hostExport||t.exportName||"default",i=n[s];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return i({task:t,data:t.data??null,wasm:e,webgpu:eL(t)})}async function sL(t){
if(typeof t!="string"||!t.trim())throw new Error("module path must be a non-empty string");return t==="peercompute:model\
-inference"?Ft(()=>Promise.resolve().then(()=>Y7),void 0,import.meta.url):t==="peercompute:gguf-inference"?Ft(
()=>import("./modelTask-Cj3RfR7N.js"),__vite__mapDeps([0,1,2]),import.meta.url):t==="peercompute:diffusion-inference"?Ft(()=>import("./modelTask-BPAx77_w.js"),
__vite__mapDeps([3,2,1]),import.meta.url):t==="peercompute:speech-inference"?Ft(()=>import("./modelTask-BqbEMTnA.js"),__vite__mapDeps([4,2]),
import.meta.url):Ft(()=>import(`${t}`),[],import.meta.url)}function iL(t={}){return typeof t.runtime=="str\
ing"&&t.runtime.trim()?t.runtime.trim().toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"js"}async function oL(t,e){
let r;if(t.fn?r=new Function(`return (${t.fn});`)():t.module&&(r=(await sL(t.module))[t.exportName||"default"]),typeof r!=
"function")throw new Error("Handler not found for task");return r(t.data,e)}async function aL(t,e={}){const r=iL(t);switch(r){case"\
js":return oL(t,e);case"wasm":return rL(t);case"wasm-webgpu":return nL(t);default:throw new Error(`Unsupported compute r\
untime: ${r}`)}}const cL="peercompute.compute.solver-descriptor.v0",lL="peercompute.compute.solver-task.v0";function Fl(t,e){
const r=String(t||"").trim();if(!r)throw new Error(`${e} is required`);return r}function ea(t){return t==null?t:JSON.parse(
JSON.stringify(t))}function dL(t){if(typeof t=="string")return{name:Fl(t,"field.name"),unit:null,dimensions:null,location:null};
if(!t||typeof t!="object")throw new Error("field must be a string or object");return{name:Fl(t.name,"field.name"),unit:t.
unit??null,dimensions:t.dimensions??null,location:t.location??null,role:t.role??null}}function Nu(t=[]){if(!Array.isArray(
t))throw new Error("fields must be an array");return t.map(dL)}function uL(t){return t.runtime?String(t.runtime).trim().
toLowerCase():t.wasm?t.hostModule||t.module?"wasm-webgpu":"wasm":"js"}function fL(t={}){if(!t||typeof t!="object")throw new Error(
"solver descriptor is required");const e=Fl(t.id,"solver.id"),r=Fl(t.kind||t.family,"solver.kind"),n=uL(t),s=!!(t.module||
t.fn||t.wasm||t.wasmSource||t.source);return{schema:cL,id:e,kind:r,version:t.version||"0.0.0",label:t.label||e,description:t.
description||"",runtime:n,module:t.module,exportName:t.exportName||"default",fn:t.fn,hostModule:t.hostModule,hostExport:t.
hostExport,wasm:t.wasm,wasmSource:t.wasmSource,source:t.source,webgpu:t.webgpu||null,inputFields:Nu(t.inputFields||t.inputs||
[]),outputFields:Nu(t.outputFields||t.outputs||[]),conservedFields:Nu(t.conservedFields||t.conserved||[]),timestep:{mode:t.
timestep?.mode||t.timestepMode||"explicit",maxDt:t.timestep?.maxDt??t.maxDt??null,subcycles:t.timestep?.subcycles??t.subcycles??
1},validity:ea(t.validity||t.validityDomain||{}),affinity:{policy:t.affinity?.policy||t.affinityPolicy||"state-key",keyFields:Array.
isArray(t.affinity?.keyFields)?[...t.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{scope:t.warmDelta?.scope||t.
scope||"solver-deltas",schema:t.warmDelta?.schema||`peercompute.solver.${e}.delta.v0`},metadata:ea(t.metadata||{}),hasExecutor:s}}
class hL{constructor(e=[]){this.solvers=new Map;for(const r of e)this.register(r)}register(e){const r=fL(e);return this.
solvers.set(r.id,r),r}unregister(e){return this.solvers.delete(e)}has(e){return this.solvers.has(e)}get(e){const r=this.
solvers.get(e);if(!r)throw new Error(`Solver not registered: ${e}`);return r}list(){return Array.from(this.solvers.values()).
map(e=>ea(e))}createTask(e,{id:r,input:n={},stateKey:s=n.stateKey||n.taskId||e,affinityKey:i,scope:o,version:a,timestamp:c,
data:l={},placementHint:d,webgpu:u}={}){const h=this.get(e);if(!h.hasExecutor)throw new Error(`Solver has no executable \
task target: ${e}`);const p=r||`${h.id}:${s}:${Date.now()}`,m=o||h.warmDelta.scope,b=d??l.placementHint??null;return{id:p,
solverId:h.id,taskFamily:h.id,runtime:h.runtime,module:h.module,exportName:h.exportName,fn:h.fn,hostModule:h.hostModule,
hostExport:h.hostExport,wasm:h.wasm,wasmSource:h.wasmSource,source:h.source,webgpu:u||h.webgpu||void 0,affinityKey:i||`${h.
id}:${s}`,placementHint:ea(b),data:{schema:lL,solver:{id:h.id,kind:h.kind,version:h.version,inputFields:h.inputFields,outputFields:h.
outputFields,conservedFields:h.conservedFields,timestep:h.timestep,validity:h.validity,warmDelta:{scope:m,schema:h.warmDelta.
schema}},stateKey:s,scope:m,version:a??null,timestamp:c??Date.now(),input:n,...l,placementHint:ea(b)}}}}const pL="peerco\
mpute.compute.gpu-resident-lane-manager.v0",mL="peercompute.compute.gpu-resident-lane.v0",gL="peercompute.compute.gpu-re\
sident-lane-lease.v0",bL="peercompute.compute.gpu-resident-lane-lease-identity.v0",yL="peercompute.compute.gpu-resident-\
lane-execution.v0",_1="peercompute.compute.gpu-resident-lane-copy-budget.v0",wL="peercompute.compute.gpu-fence-report.v0",
vL="peercompute.compute.gpu-resident-lane-stage-plan.v0",EL="peercompute.compute.gpu-resident-lane-stage-execution.v0",kL="\
peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0",ph="queue.onSubmittedWorkDone-before-readback-map",C1="\
explicit-stage-dependencies",Yb="sequential-stage-order",xL="defer-read-write-conflicting-ready-stages";function gc(t,e=0){
const r=Number(t);return Number.isFinite(r)?r:e}function Ge(t,e=null){return String(t??"").trim()||e}function Lt(t,e=[]){
return Array.isArray(t)?t.map(r=>Ge(r)).filter(Boolean):typeof t=="string"?t.split(",").map(r=>Ge(r)).filter(Boolean):[...e]}
function et(t){return t==null?t:JSON.parse(JSON.stringify(t))}function Zb(t={}){const e=t?.residentSequenceLaneContract||
t?.residentLaneContract||t?.laneContract||t?.executionContract||null;return!e||typeof e!="object"?null:et(e)}function SL(t={},e=0){
const r=Ge(t.id,`stage:${e}`);return{...et(t),id:r,index:e,lawNodeId:Ge(t.lawNodeId,null),runtimeTarget:Ge(t.runtimeTarget,
null),dependsOn:Lt(t.dependsOn??t.dependencies),inputFrom:Ge(t.inputFrom??t.primaryInputFrom??t.inputStageId,null),reads:Lt(
t.reads??t.readFamilies),writes:Lt(t.writes??t.writeFamilies)}}function bc(t=null,{laneId:e=null,stateKey:r=null,domainKey:n=null,
queueFencePolicy:s=null}={}){if(!t||typeof t!="object")return null;const i=Array.isArray(t.passDagStages)?t.passDagStages.
map((a,c)=>SL(a,c)):[],o=Ge(t.stageDependencyMode??t.dependencyMode,i.some(a=>a.dependsOn.length>0)||t.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:vL,status:i.length>0?t.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:Ge(t.laneId,e),stateKey:Ge(t.stateKey,r),domainKey:Ge(t.domainKey,n),queueFencePolicy:Ge(t.
queueFencePolicy,s||ph),contractSchema:Ge(t.schema,null),contractStatus:Ge(t.status,null),sequenceMode:Ge(t.sequenceMode,
null),sequenceRunnable:t.sequenceRunnable===!0,defaultEnabled:t.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o===
"explicit-stage-dependencies",stageCount:i.length,stages:i}}function AL(t={}){const e=t&&typeof t=="object"?t:{value:t};
return{value:Object.prototype.hasOwnProperty.call(e,"value")?e.value:t,retainedBufferRefs:Lt(e.retainedBufferRefs??e.gpuFence?.
retainedBufferRefs),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?et(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?et(e.summary):null}}function zl(t={}){const e=t.copyBudget&&typeof t.copyBudget=="object"?t.copyBudget:t;return{
schema:_1,uploadBytes:Math.max(0,Math.round(gc(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
gc(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(gc(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(gc(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:Ge(e.fullReadbackReason??
e.readbackReason,null)}}function IL(t={},e={}){const r=zl(t),n=zl(e);return{schema:_1,uploadBytes:r.uploadBytes+n.uploadBytes,
readbackBytes:r.readbackBytes+n.readbackBytes,retainedBytes:Math.max(r.retainedBytes,n.retainedBytes),compactSummaryBytes:r.
compactSummaryBytes+n.compactSummaryBytes,fullReadbackReason:n.fullReadbackReason||r.fullReadbackReason||null}}function _L(t={}){
return t.parallelStageExecution===!0||t.dependencyMode===C1||(t.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function CL(t,{
baseInput:e=null,currentValue:r=null,stageValues:n={}}={}){if(t.inputFrom&&Object.prototype.hasOwnProperty.call(n,t.inputFrom))
return n[t.inputFrom];const s=Lt(t.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(n,s[0])?n[s[0]]:
s.length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(i=>[i,n[i]])),previousValue:r,
baseInput:e}:r}function Pu(t=[],e=[]){const r=new Set(Lt(e));return Lt(t).filter(n=>r.has(n))}function RL(t={},e={}){const r=Pu(
t.writes,e.writes);if(r.length>0)return{conflictType:"write-write",families:r};const n=Pu(t.writes,e.reads);if(n.length>
0)return{conflictType:"write-read",families:n};const s=Pu(t.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function TL(t=[]){const e=[],r=[];for(const n of t){const s=e.map(i=>({stage:i,conflict:RL(i,n)})).find(
i=>i.conflict);s?r.push({stageId:n.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(n)}return{batch:e,deferred:r}}function ML(t={}){const e=new Set((t.stages||[]).map(r=>r.id));for(const r of t.
stages||[])for(const n of r.dependsOn||[])if(!e.has(n)){const s=new Error(`GPU resident lane stage ${r.id} depends on un\
known stage ${n}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=et(r),s}}function ey(t={}){ML(t);
const e=_L(t),r=[],n=[];if(e){const s=new Map((t.stages||[]).map(o=>[o.id,o])),i=new Set;for(;s.size>0;){const o=(t.stages||
[]).filter(d=>s.has(d.id)).filter(d=>(d.dependsOn||[]).every(u=>i.has(u)));if(!o.length){const d=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw d.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",d}const{batch:a,deferred:c}=TL(o),l=r.length;n.push(...c.map(d=>({...d,batchIndex:l}))),
r.push(a.map(d=>d.id));for(const d of a)s.delete(d.id),i.add(d.id)}}else for(const s of t.stages||[])r.push([s.id]);return{
dependencyMode:e?C1:Yb,parallelStageExecution:e,stateFamilyConflictPolicy:e?xL:Yb,stateFamilyConflictDeferrals:n,stateFamilyConflictDeferralCount:n.
length,executionBatches:r,maxConcurrentStageCount:r.reduce((s,i)=>Math.max(s,i.length),0)}}function BL(t={},{batchIndex:e=-1,
executorSource:r=null,gpuHubExecutorDescriptor:n=null}={}){const s=et(n?.workerPolicy),i=Ge(s?.mode,null),o=s?.status===
"worker-ready",a=i==="dedicated-worker";let c="missing-stage-executor";return r==="stage-plan-executor"?c="stage-plan-ex\
ecutor":r==="provided-stage-executor"?c="provided-stage-executor":r==="gpu-hub-resident-stage-executor"&&(o?c="gpu-hub-w\
orker-resident-stage":a?c="gpu-hub-inline-fallback-for-worker-stage":c="gpu-hub-inline-resident-stage"),{stageId:t.id,lawNodeId:t.
lawNodeId,runtimeTarget:t.runtimeTarget,batchIndex:e,dependsOn:Lt(t.dependsOn),inputFrom:Ge(t.inputFrom,null),reads:Lt(t.
reads),writes:Lt(t.writes),executorSource:r,placementTarget:c,gpuHubExecutorDescriptor:et(n),workerPolicy:s,workerResidencyStatus:s?.
status||null,workerRequested:a,workerReady:o,sameDeviceRequired:s?.sameDeviceRequired===!0,bufferTransferPolicy:s?.bufferTransferPolicy||
null}}function LL(t){return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consum\
er-queue-completed"].includes(String(t||""))}class DL{constructor({gpuHub:e=null,deviceId:r="gpu-hub",now:n=()=>Date.now()}={}){
this.gpuHub=e,this.deviceId=r,this.now=n,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:pL,
laneCount:0,activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:r,domainKey:n,solverId:s}={}){return Ge(e,`gpu-lane:${Ge(
r||n||s,"default")}`)}getOrCreateLane(e={}){const r=this.resolveLaneId(e),n=Ge(e.stateKey,null),s=Ge(e.sourceFamily,null),
i=this.lanes.get(r);if(i){if(n&&i.stateKey&&i.stateKey!==n)throw new Error(`GPU resident lane ${r} already owns stateKey\
 ${i.stateKey}, not ${n}`);if(n&&!i.stateKey&&(i.stateKey=n),s&&i.sourceFamily&&i.sourceFamily!==s)throw new Error(`GPU \
resident lane ${r} already owns sourceFamily ${i.sourceFamily}, not ${s}`);return s&&!i.sourceFamily&&(i.sourceFamily=s),
e.domainKey&&!i.domainKey&&(i.domainKey=Ge(e.domainKey,null)),e.solverId&&!i.solverId&&(i.solverId=Ge(e.solverId,null)),
i}const o={schema:mL,laneId:r,stateKey:n,sourceFamily:s,domainKey:Ge(e.domainKey,null),solverId:Ge(e.solverId,null),deviceId:Ge(
e.deviceId,this.deviceId),queueFencePolicy:Ge(e.queueFencePolicy,ph),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
Lt(e.retainedBufferRefs)),copyBudget:zl(e.copyBudget||{}),residentSequenceLaneContract:Zb(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=bc(o.residentSequenceLaneContract,o),this.lanes.set(r,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const r=this.getOrCreateLane(e),n=Ge(e.leaseId,`${r.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(n))throw new Error(`GPU resident lane lease already exists: ${n}`);const s=zl(e.
copyBudget||{}),i=Zb(e)||et(r.residentSequenceLaneContract),o=bc(i,{laneId:r.laneId,stateKey:r.stateKey,domainKey:r.domainKey,
queueFencePolicy:r.queueFencePolicy});i&&(r.residentSequenceLaneContract=et(i),r.stagePlan=et(o));const a={schema:gL,leaseId:n,
laneId:r.laneId,stateKey:r.stateKey,sourceFamily:Ge(e.sourceFamily,r.sourceFamily),domainKey:r.domainKey,solverId:Ge(e.solverId,
r.solverId),taskId:Ge(e.taskId,null),owner:Ge(e.owner,"compute-manager"),readFamilies:Lt(e.readFamilies),writeFamilies:Lt(
e.writeFamilies),retainedBufferRefs:Lt(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:r.queueFencePolicy,residentSequenceLaneContract:i,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(n,a),r.activeLeases.set(n,a),r.copyBudget=IL(r.copyBudget,s);for(const c of a.retainedBufferRefs)r.retainedBufferRefs.
add(c);return r.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),et(a)}createFenceReport(e,{status:r="queue-work-completed",method:n="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=r,queueCompletionMethod:i=n,readbackCompletionStatus:o=null,readbackCompletionMethod:a=null,
retainedBufferRefs:c=null,completed:l=null,source:d="gpu-resident-lane-manager"}={}){const u=typeof e=="string"?this.leases.
get(e):e;if(!u)throw new Error(`Unknown GPU resident lane lease: ${e}`);const h=this.lanes.get(u.laneId),p=l==null?LL(r):
l===!0;return{schema:wL,status:r,method:n,fenceSatisfied:p,required:!0,laneId:u.laneId,stateKey:u.stateKey,queueFencePolicy:u.
queueFencePolicy||h?.queueFencePolicy||ph,queueCompletionStatus:s,queueCompletionMethod:i,readbackCompletionStatus:o,readbackCompletionMethod:a,
retainedBufferRefs:Lt(c,u.retainedBufferRefs),workerId:null,deviceId:h?.deviceId||this.deviceId,completedAt:p?this.now():
null,source:d}}completeLease(e,r={}){const n=this.leases.get(e);if(!n)throw new Error(`Unknown GPU resident lane lease: ${e}`);
const s=this.lanes.get(n.laneId),i=this.createFenceReport(n,r);if(n.status=i.fenceSatisfied?"completed":"completed-unsat\
isfied-fence",n.gpuFence=i,n.releasedAt=this.now(),n.releaseReason=r.releaseReason||n.status,Array.isArray(r.retainedBufferRefs)&&
(n.retainedBufferRefs=Lt(r.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=i,s.updatedAt=this.now();for(const o of n.
retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,
this.stats.completedLeaseCount+=1,this.stats.lastFence=et(i),{schema:yL,lease:et(n),gpuFence:i,lane:s?this.snapshotLane(
s.laneId):null,residentSequenceLaneContract:et(n.residentSequenceLaneContract),stagePlan:et(n.stagePlan),stageExecution:et(
n.stageExecution)}}async executeStagePlan(e,{input:r=null,context:n={},executor:s=null,stageExecutors:i={},allowMissingExecutors:o=!1}={}){
const a=typeof e=="string"?this.leases.get(e):e;if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const c=this.
lanes.get(a.laneId),l=a.stagePlan||bc(a.residentSequenceLaneContract,{laneId:a.laneId,stateKey:a.stateKey,domainKey:a.domainKey,
queueFencePolicy:a.queueFencePolicy});if(!l||!Array.isArray(l.stages)||l.stages.length===0){const k=new Error(`GPU resid\
ent lane lease ${a.leaseId} has no executable stage plan`);throw k.code="ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING",k}const d=this.
now(),u=[],h={},p=ey(l),m=new Map(l.stages.map(k=>[k.id,k]));let b=r;const g=async(k,x)=>{let S=typeof s=="function"?s:i?.[k.
id]||i?.[k.lawNodeId],v=typeof s=="function"?"stage-plan-executor":S?"provided-stage-executor":null;typeof S!="function"&&
this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(k)&&typeof this.
gpuHub.executeResidentStage=="function"&&(S=D=>this.gpuHub.executeResidentStage(D),v="gpu-hub-resident-stage-executor");
const w=v==="gpu-hub-resident-stage-executor"&&typeof this.gpuHub?.describeResidentStageExecutor=="function"?this.gpuHub.
describeResidentStageExecutor(k):null;if(typeof S!="function"){if(!o){const D=new Error(`Missing GPU resident lane stage\
 executor: ${k.id}`);throw D.code="ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING",D.stage=et(k),D}return{result:{stageId:k.
id,lawNodeId:k.lawNodeId,status:"blocked-missing-stage-executor",retainedBufferRefs:[],workerResidency:null},value:x}}const I=this.
now(),C=await S({stage:et(k),stageIndex:k.index,input:x,lease:et(a),lane:c?this.snapshotLane(c.laneId):null,context:n}),
R=AL(C),N=Lt(R.retainedBufferRefs);if(N.length>0&&(a.retainedBufferRefs=Lt([...a.retainedBufferRefs,...N]),c)){for(const D of N)
c.retainedBufferRefs.add(D);c.updatedAt=this.now()}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,runtimeTarget:k.runtimeTarget,
status:"completed",executorSource:v,startedAt:I,completedAt:this.now(),retainedBufferRefs:N,gpuFence:R.gpuFence,workerResidency:et(
w?.workerPolicy),summary:R.summary},value:R.value}};if(p.parallelStageExecution===!0)for(const k of p.executionBatches){
const x=k.map(v=>m.get(v)).filter(Boolean),S=await Promise.all(x.map(v=>g(v,CL(v,{baseInput:r,currentValue:b,stageValues:h}))));
for(let v=0;v<x.length;v+=1){const w=x[v],I=S[v];h[w.id]=I.value,b=I.value,u.push(I.result)}}else for(const k of p.executionBatches){
const x=m.get(k[0]),S=await g(x,b);b=S.value,h[x.id]=S.value,u.push(S.result)}const y=u.some(k=>k.status!=="completed"),
E={schema:EL,status:y?"blocked":"completed",leaseId:a.leaseId,laneId:a.laneId,stateKey:a.stateKey,stagePlan:et(l),stageCount:l.
stages.length,completedStageCount:u.filter(k=>k.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:u,retainedBufferRefs:Lt(a.retainedBufferRefs),output:b,startedAt:d,completedAt:this.
now()};return a.stageExecution=et(E),c&&(c.updatedAt=this.now()),E}preflightStagePlacement(e,{executor:r=null,stageExecutors:n={},
allowMissingExecutors:s=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(i.laneId),a=i.stagePlan||bc(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!a||!Array.isArray(a.stages)||a.stages.
length===0){const g=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw g.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",g}const c=ey(a),l=new Map;c.executionBatches.forEach((g,f)=>{for(const y of g)l.set(y,
f)});const d=a.stages.map(g=>{let f=typeof r=="function"?r:n?.[g.id]||n?.[g.lawNodeId],y=typeof r=="function"?"stage-pla\
n-executor":f?"provided-stage-executor":null,E=null;return typeof f!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(g)&&typeof this.gpuHub.describeResidentStageExecutor=="function"&&(E=this.
gpuHub.describeResidentStageExecutor(g),y="gpu-hub-resident-stage-executor"),BL(g,{batchIndex:l.get(g.id)??-1,executorSource:y,
gpuHubExecutorDescriptor:E})}),u=d.filter(g=>!g.executorSource).map(g=>g.stageId),h=d.filter(g=>g.workerRequested).map(g=>g.
stageId),p=d.filter(g=>g.workerReady).map(g=>g.stageId),m=d.filter(g=>g.workerRequested&&!g.workerReady).map(g=>g.stageId),
b=s===!0||u.length===0;return{schema:kL,status:b?"placement-preflight-ready":"blocked-missing-stage-executors",authority:"\
compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,domainKey:i.
domainKey,deviceId:o?.deviceId||this.deviceId,stagePlan:et(a),stageCount:a.stages.length,dependencyMode:c.dependencyMode,
parallelStageExecution:c.parallelStageExecution,stateFamilyConflictPolicy:c.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:c.
stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:c.stateFamilyConflictDeferralCount,placementBatches:c.executionBatches,
maxConcurrentStageCount:c.maxConcurrentStageCount,stagePlacements:d,executorSources:Object.fromEntries(d.map(g=>[g.stageId,
g.executorSource])),workerResidencyStatuses:Object.fromEntries(d.map(g=>[g.stageId,g.workerResidencyStatus])),missingExecutorStageIds:u,
missingExecutorCount:u.length,workerRequestedStageIds:h,workerRequestedCount:h.length,workerReadyStageIds:p,workerReadyCount:p.
length,workerFallbackStageIds:m,workerFallbackCount:m.length,canExecute:b,createdAt:this.now()}}planStagePlacement(e,r={}){
return this.preflightStagePlacement(e,r)}rejectLease(e,r="lane-validation-rejected"){const n=this.leases.get(e);if(!n)throw new Error(
`Unknown GPU resident lane lease: ${e}`);const s=this.lanes.get(n.laneId);return n.status="rejected",n.releasedAt=this.now(),
n.releaseReason=r,s&&(s.activeLeases.delete(e),s.updatedAt=this.now()),this.leases.delete(e),this.stats.activeLeaseCount=
this.leases.size,this.stats.rejectedLeaseCount+=1,et(n)}snapshotLane(e){const r=this.lanes.get(e);return r?{schema:r.schema,
laneId:r.laneId,stateKey:r.stateKey,domainKey:r.domainKey,solverId:r.solverId,deviceId:r.deviceId,queueFencePolicy:r.queueFencePolicy,
status:r.status,activeLeaseCount:r.activeLeases.size,retainedBufferRefs:[...r.retainedBufferRefs].sort(),copyBudget:et(r.
copyBudget),residentSequenceLaneContract:et(r.residentSequenceLaneContract),stagePlan:et(r.stagePlan),createdAt:r.createdAt,
updatedAt:r.updatedAt,lastFence:et(r.lastFence)}:null}listLanes(){return[...this.lanes.keys()].sort().map(e=>this.snapshotLane(
e))}getStats(){return{...et(this.stats),laneCount:this.lanes.size,activeLeaseCount:this.leases.size,lanes:this.listLanes()}}}
function $L(){return new Worker(new URL(""+new URL("computeWorker-D83yf32r.js",import.meta.url).href,import.meta.url),{type:"\
module"})}const ty=128,ry=5e3,NL="peercompute.compute.worker-utilization.v0",ny="peercompute.compute.task-placement.v0",
PL="peercompute.compute.remote-placement-provenance.v0",Ou="peercompute.compute.remote-placement-verification.v0",sy="pe\
ercompute.compute.remote-placement-validation.v0",Co="peercompute.compute.remote-placement-retry.v0",iy="peercompute.com\
pute.remote-task-envelope.v0",oy="peercompute.compute.task-packet.v0",OL="peercompute.compute.task-execution.v0",ay="pee\
rcompute.compute.task-graph-result.v0",UL="peercompute.compute.task-graph-context.v0",FL="peercompute.compute.task-graph\
-cache-policy.v0",zL="peercompute.compute.task-graph-cache-inputs.v0",qL="peercompute.compute.task-graph-cache-artifact.\
v0",mh="peercompute.compute.task-graph-cache-admission.v0",cy="peercompute.compute.remote-task-graph-cache-import.v0",jL="\
peercompute.compute.remote-task-graph-state-seed-policy.v0",GL="peercompute.compute.task-graph-placement-policy.v0",Uu="\
peercompute.compute.task-graph-cancellation.v0",R1="peercompute.compute.task-graph-gpu-resident-lane.v0",WL="peercompute\
.compute.gpu-fence-report.v0",xi=["timeout","executor-error"],yc=["rejected","verification-failed","validation-failed"],
HL=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","\
maxComputeWorkgroupsPerDimension"];function xe(t,e,r=0,n=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(t));return Number.
isFinite(s)?Math.min(n,Math.max(r,s)):e}function Br(t,e,r=0,n=Number.MAX_SAFE_INTEGER){const s=Number(t);return Number.isFinite(
s)?Math.min(n,Math.max(r,s)):e}function VL({cpuCores:t,deviceMemoryGB:e,gpuAvailable:r,declaredTier:n}){return n?String(
n):t>=32||e>=64?"cluster":r&&(t>=12||e>=16)?"workstation":t<=4||e&&e<=4?"mobile":"laptop"}function gh(t){return t==="clu\
ster"?8192:t==="workstation"?2048:t==="mobile"?384:1024}function T1(t){return t==="cluster"?4096:t==="workstation"?1024:
t==="mobile"?192:512}function KL({tier:t,deviceMemoryGB:e}){const r=gh(t);if(!e)return r;const n=e*1024*.25;return Math.
max(128,Math.min(r,n))}function M1(t={}){if(!t)return null;const e=t.gpuLimits||t,r={};for(const n of HL){const s=xe(e[n],
null,0,Number.MAX_SAFE_INTEGER);s!=null&&(r[n]=s)}return Object.keys(r).length>0?r:null}function Fu(t={},e={}){const r=typeof navigator<
"u"?navigator:null,n=xe(t.cpuCores??t.hardwareConcurrency??r?.hardwareConcurrency,4,1,512),s=Br(t.deviceMemoryGB??t.deviceMemory??
r?.deviceMemory,null,0,2048),i=t.gpuAvailable??e.webgpu??!!r?.gpu,o=VL({cpuCores:n,deviceMemoryGB:s??0,gpuAvailable:i,declaredTier:t.
tier||t.deviceClass}),a=Br(t.memoryBudgetMB??t.ramBudgetMB,KL({tier:o,deviceMemoryGB:s}),0,1048576),c=Br(t.gpuMemoryBudgetMB??
t.gpuBudgetMB??t.vramBudgetMB,i?T1(o):0,0,1048576),l=Br(t.budgetScale??t.resourceBudgetScale??t.computeScale,1,.05,64),d=M1(
t.gpuLimits||{maxBufferSize:t.gpuMaxBufferSize??t.maxBufferSize,maxStorageBufferBindingSize:t.gpuMaxStorageBufferBindingSize??
t.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:t.gpuMaxComputeWorkgroupStorageSize??t.maxComputeWorkgroupStorageSize,
maxComputeInvocationsPerWorkgroup:t.gpuMaxComputeInvocationsPerWorkgroup??t.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:t.
gpuMaxComputeWorkgroupsPerDimension??t.maxComputeWorkgroupsPerDimension});return{schema:"peercompute.compute.resource-pr\
ofile.v0",tier:o,cpuCores:n,deviceMemoryGB:s,memoryBudgetMB:a,gpuMemoryBudgetMB:c,budgetScale:l,gpuLimits:d,gpuLimitsSource:d?
t.gpuLimitsSource||"configured":null,gpuAvailable:!!i,wasmAvailable:!!e.wasm,source:t.source||(t.tier?"configured":"brow\
ser")}}function QL(t){const e=t.cpuCores||4;return t.tier==="cluster"?Math.min(64,Math.max(8,e)):t.tier==="workstation"?
Math.min(16,Math.max(4,e)):t.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.floor(e*.75)))}function zu(t={},e){
const r=xe(t.maxWorkers,null,1,ty),n=QL(e),s=r??Math.min(ty,Math.max(n,e.cpuCores||n)),i=xe(t.minWorkers,Math.min(s,e.tier===
"mobile"?1:2),0,s),o=xe(t.targetWorkers??t.initialWorkers,Math.min(s,Math.max(i,n)),i,s);return{schema:"peercompute.comp\
ute.worker-policy.v0",autoScale:t.autoScaleWorkers!==!1,minWorkers:i,targetWorkers:o,maxWorkers:s,scaleUpQueueDepth:xe(t.
scaleUpQueueDepth,1,1,1024),idleScaleDownMs:xe(t.idleScaleDownMs,5e3,0,6e5)}}function JL(t){return t==="cluster"?4:t==="\
workstation"?2:t==="mobile"?.5:1}function XL(t){return t==="cluster"?4:t==="workstation"?2:1}function YL(t){return t==="\
cluster"?64:t==="workstation"?16:t==="mobile"?2:8}function wc(t,e=1){return Br(t,e,.25,8)}function ZL(t){const e=String(
t||"");return e==="manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function eD(t,e){const r=Math.
max(1,e);return Math.max(r,Math.round(t/r)*r)}function Or(){return typeof performance<"u"&&typeof performance.now=="func\
tion"?performance.now():Date.now()}function tD(t){const e=Math.max(0,Number(t)||0);return e<=0?Promise.resolve():new Promise(
r=>setTimeout(r,e))}function qu(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,
totalDurationMs:0}}function rD(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,timedOut:0,
rejected:0,verificationFailed:0,validationFailed:0}}function We(t,e=[]){return Array.isArray(t)?t.map(r=>String(r||"").trim()).
filter(Boolean):typeof t=="string"?t.split(",").map(r=>r.trim()).filter(Boolean):[...e]}function vc(...t){const e=new Set,
r=[];for(const n of t)for(const s of We(n,[]))e.has(s)||(e.add(s),r.push(s));return r}function Ce(...t){for(const e of t)
if(e!=null)return e;return null}function nD(t={}){const e=t.webgpu||t.data?.webgpu||{},r=t.gpuFence||t.gpuFenceRequirement||
e.gpuFence||e.fence||e.fenceRequirement||{},n=r.required===!0||r.fenceRequired===!0||e.fenceRequired===!0||e.requiresFence===
!0||e.requiresQueueFence===!0,s=Ce(r.laneId,r.gpuLaneId,e.laneId,e.gpuLaneId),i=Ce(r.stateKey,r.gpuStateKey,e.stateKey,e.
gpuStateKey,t.stateKey,t.data?.stateKey,t.data?.input?.stateKey),o=Ce(r.queueFencePolicy,r.fencePolicy,e.queueFencePolicy,
e.fencePolicy),a=We(r.retainedBufferRefs??e.retainedBufferRefs,[]);return!n&&!s&&!i&&!o&&a.length===0?null:{schema:"peer\
compute.compute.gpu-fence-requirement.v0",required:n,laneId:s?String(s):null,stateKey:i?String(i):null,queueFencePolicy:o?
String(o):null,retainedBufferRefs:a,source:r.source||(e&&Object.keys(e).length>0?"task.webgpu":"task.gpuFence")}}function sD(t={},e=null){
const r=t.webgpu||t.data?.webgpu||{},n=t.gpuResidentLane||t.gpuResidentLaneLease||t.residentLane||r.gpuResidentLane||r.residentLane||
{},s=Ce(n.residency,r.residency,t.residency,t.data?.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===!0||
String(s||"").trim().toLowerCase()==="gpu-lane",o=Ce(n.laneId,n.gpuLaneId,r.laneId,r.gpuLaneId,e?.laneId),a=Ce(n.stateKey,
n.gpuStateKey,r.stateKey,r.gpuStateKey,t.stateKey,t.data?.stateKey,t.data?.input?.stateKey,e?.stateKey),c=Ce(n.domainKey,
n.domain,r.domainKey,t.domainKey,t.data?.domainKey),l=Ce(n.sourceFamily,r.sourceFamily,t.data?.sourceFamily,t.data?.input?.
sourceFamily),d=Ce(n.queueFencePolicy,n.fencePolicy,r.queueFencePolicy,e?.queueFencePolicy),u=We(n.retainedBufferRefs??r.
retainedBufferRefs,e?.retainedBufferRefs||[]),h=n.copyBudget&&typeof n.copyBudget=="object"?JSON.parse(JSON.stringify(n.
copyBudget)):r.copyBudget&&typeof r.copyBudget=="object"?JSON.parse(JSON.stringify(r.copyBudget)):{},p=Ce(n.residentSequenceLaneContract,
n.residentLaneContract,n.laneContract,r.residentSequenceLaneContract,t.data?.residentSequenceLaneContract,t.data?.input?.
residentSequenceLaneContract,t.lawGraphNode?.residentSequenceLaneContract,null);return!i&&!o&&!a&&u.length===0&&Object.keys(
h).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task.v0",enabled:!0,localExecution:String(Ce(n.localExecution,
n.executionMode,r.localExecution,"inline")||"inline").trim().toLowerCase()==="worker"?"worker":"inline",laneId:o?String(
o):null,stateKey:a?String(a):null,sourceFamily:l?String(l):null,domainKey:c?String(c):null,solverId:Ce(n.solverId,t.solverId,
t.data?.solverId)||null,owner:Ce(n.owner,t.owner,t.taskFamily,t.solverId,"compute-manager-task"),readFamilies:We(n.readFamilies??
n.reads??r.readFamilies),writeFamilies:We(n.writeFamilies??n.writes??r.writeFamilies),retainedBufferRefs:u,queueFencePolicy:d?
String(d):null,copyBudget:h,residentSequenceLaneContract:p&&typeof p=="object"?Fe(p):null}}function Fe(t){if(t==null)return t;
if(typeof structuredClone=="function")try{return structuredClone(t)}catch{}return JSON.parse(JSON.stringify(t))}function iD(t={},e=[]){
const r=t.cacheInputs||t.cachePolicy?.inputs||t.cache?.inputs||t.inputRefs||null,n=r&&typeof r=="object"?r:{},s=We(n.stateRefs??
n.states??t.stateRefs),i=We(n.closureRefs??n.closures??t.closureRefs),o=We(n.invalidationRefs??n.invalidates??t.invalidationRefs),
a=We(n.retainedBufferRefs??t.retainedBufferRefs),c=We(n.inputHashes??n.hashes??t.inputHashes),l=We(n.lawIds??n.laws??t.lawIds),
d=We(n.stateFamilies??t.stateFamilies),u=We(n.readFamilies??t.readFamilies),h=We(n.writeFamilies??t.writeFamilies),p=Ce(
n.values,n.value,n.parameters,t.cacheInputValues,null),m=e.map(y=>({id:y.id,dependsOn:[...y.dependsOn],taskFamily:y.taskFamily||
y.task?.taskFamily||y.task?.solverId||null,solverId:y.solverId||y.task?.solverId||null,cacheInput:Ce(y.cacheInput,y.cacheInputs,
y.task?.cacheInput,null)}));if(!(r!=null||s.length>0||i.length>0||o.length>0||a.length>0||c.length>0||l.length>0||d.length>
0||u.length>0||h.length>0||p!=null||m.some(y=>y.cacheInput!=null||y.taskFamily||y.solverId)))return null;const g={graphFamily:String(
Ce(n.graphFamily,t.graphFamily,t.taskFamily,"task-graph")||"task-graph"),graphVersion:String(Ce(n.graphVersion,t.graphVersion,
t.version,"v0")||"v0"),lawGraphId:Ce(n.lawGraphId,t.lawGraphId,null),stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,
inputHashes:c,lawIds:l,stateFamilies:d,readFamilies:u,writeFamilies:h,scaleRegime:Ce(n.scaleRegime,t.scaleRegime,null),units:Ce(
n.units,t.units,null),values:p,nodes:m},f=ra(ta(g));return{schema:zL,status:"content-addressed-inputs-declared",inputHash:f,
stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,stateFamilies:d,readFamilies:u,
writeFamilies:h,nodeCount:e.length,source:r?"graph.cacheInputs":"graph-derived-input-refs"}}function oD(t={},e=[]){const r=t.
cachePolicy||t.cache||{},n=String(Ce(t.cacheKey,r.cacheKey,r.key,"")||"").trim()||null,s=iD(t,e),i=String(Ce(r.scope,t.cacheScope,
"compute-manager-local")||"compute-manager-local"),o=s?`${i}:${s.inputHash}`:null,a=n||o,c=String(Ce(t.cacheMode,r.mode,
a?"read-through":"disabled")||"disabled").trim().toLowerCase(),l=r.enabled!==!1&&a!=null&&c!=="disabled"&&c!=="off";let d="\
disabled";return l&&(c==="record-only"||c==="write-only"?d="record-only":c==="read-only"?d="read-only":d="read-through"),
{schema:FL,cacheKey:a,mode:d,readEnabled:d==="read-through"||d==="read-only",writeEnabled:d==="read-through"||d==="recor\
d-only",ttlMs:xe(r.ttlMs??t.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:i,requireAdmitted:r.requireAdmitted!==!1&&t.cacheRequireAdmitted!==
!1,explicitCacheKey:n,derivedCacheKey:o,keySource:n?"explicit":o?"content-addressed-inputs":null,inputHash:s?.inputHash||
null,inputs:s,status:l?"cache-policy-enabled":"cache-policy-disabled"}}function aD(t={}){const e=Ce(t.stateSeedPayload,t.
cachePolicy?.stateSeedPayload,t.cache?.stateSeedPayload,t.remoteStateSeedPayload,null);return e==null?null:Fe(e)}function bh(t,e=new WeakSet){
if(t==null)return t;if(typeof t=="function"||typeof t=="symbol")return;if(typeof t!="object")return t;if(ArrayBuffer.isView(
t))return new t.constructor(t);if(t instanceof ArrayBuffer)return t.slice(0);if(e.has(t))return null;if(e.add(t),Array.isArray(
t))return t.map(n=>bh(n,e)).filter(n=>n!==void 0);const r={};for(const[n,s]of Object.entries(t)){const i=bh(s,e);i!==void 0&&
(r[n]=i)}return r}function cD(t={},e={},r={}){const n=e.resultInputs||e.resultInputMap||(t&&typeof t=="object"?t.resultInputs:
null);if(!n||typeof n!="object"||Array.isArray(n))return t;const s=t.data&&typeof t.data=="object"&&!Array.isArray(t.data)?
{...t.data}:{},i={};for(const[o,a]of Object.entries(n)){const c=typeof a=="string"?a:String(a?.nodeId||a?.resultId||a?.from||
"").trim();if(!(!o||!c)){if(!Object.prototype.hasOwnProperty.call(r,c))throw new Error(`Task graph node ${e.id} requeste\
d unavailable result input ${o} from ${c}`);s[o]=bh(r[c]),i[o]=c}}return Object.keys(i).length===0?t:{...t,data:s,taskGraphResultInputs:i}}
function lD(t={},e={}){const r=t.cacheAdmission||t.cachePolicy?.admission||t.cache?.admission||{},n=r.admitted===!0||r.accepted===
!0||r.status==="admitted"||r.status==="admission-accepted",s=e.mode==="record-only",i=r.status||(n?"admitted":s?"recorde\
d-not-admitted":"pending-admission");return{schema:mh,status:i,admitted:n,authority:String(Ce(r.authority,t.cacheAuthority,
"compute-manager-local")||"compute-manager-local"),admissionId:Ce(r.admissionId,r.id,null),validatorId:Ce(r.validatorId,
r.validator,null),reason:String(Ce(r.reason,s?"record-only-cache-artifact-requires-state-manager-admission":"cache-artif\
act-admission-pending","")||""),invalidationRefs:We(r.invalidationRefs??e.inputs?.invalidationRefs),acceptedAt:n?r.acceptedAt||
Date.now():null}}function dD({graphId:t,cachePolicy:e,result:r,storedAt:n,expiresAt:s,admission:i}={}){const o=ra(ta({schema:r?.
schema,graphId:r?.graphId,status:r?.status,nodeReports:r?.nodeReports,nodeResults:r?.nodeResults}));return{schema:qL,artifactId:`${e.
cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.inputHash,resultHash:o,
graphId:t,status:i?.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:i?.admitted===!0,admission:i,
inputs:e.inputs,invalidationRefs:We(i?.invalidationRefs,e.inputs?.invalidationRefs||[]),stateSeedPayload:r?.stateSeedPayload!=
null?Fe(r.stateSeedPayload):null,storedAt:n,expiresAt:s,ttlMs:e.ttlMs,resultSchema:r?.schema||null,nodeCount:r?.nodeCount??
null,resultNodeSchemas:(r?.nodeReports||[]).map(a=>({nodeId:a.nodeId,resultSchema:a.resultSchema||null,taskFamily:a.taskFamily||
null}))}}function uD(t={}){const e=t.placementPolicy||t.placement||t.placementHint||{},r=String(Ce(e.requestedPlacement,
e.placement,e.mode,t.requestedPlacement,t.placementMode,"local")||"local").trim().toLowerCase();return{schema:GL,requestedPlacement:r,
locality:String(Ce(e.locality,t.locality,r==="local"?"local-inline":"distributed")||""),authority:String(Ce(e.authority,
t.authority,"compute-manager")||"compute-manager"),targetPeerIds:We(e.targetPeerIds??e.peers??t.targetPeerIds),targetClusterId:Ce(
e.targetClusterId,e.clusterId,t.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||t.gpuResident===!0,
advisory:e.advisory!==!1}}function fD(t={},e=null){const r=t.webgpu||{},n=t.gpuResidentLane||t.gpuResidentLaneLease||t.residentLane||
r.gpuResidentLane||r.residentLane||{},s=Ce(n.residency,r.residency,t.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=Ce(n.laneId,n.gpuLaneId,r.laneId,r.gpuLaneId),a=Ce(n.stateKey,n.gpuStateKey,
r.stateKey,r.gpuStateKey,t.stateKey),c=Ce(n.domainKey,n.domain,r.domainKey,t.domainKey),l=We(n.retainedBufferRefs??r.retainedBufferRefs??
t.retainedBufferRefs),d=n.copyBudget&&typeof n.copyBudget=="object"?Fe(n.copyBudget):r.copyBudget&&typeof r.copyBudget==
"object"?Fe(r.copyBudget):{};return!i&&!o&&!a&&l.length===0&&Object.keys(d).length===0?null:{schema:R1,enabled:!0,laneId:o?
String(o):null,stateKey:a?String(a):null,domainKey:c?String(c):null,solverId:Ce(n.solverId,t.solverId,null),taskId:e,owner:Ce(
n.owner,t.owner,"compute-manager-task-graph"),readFamilies:We(n.readFamilies??n.reads??r.readFamilies??t.readFamilies),writeFamilies:We(
n.writeFamilies??n.writes??r.writeFamilies??t.writeFamilies),retainedBufferRefs:l,queueFencePolicy:Ce(n.queueFencePolicy,
n.fencePolicy,r.queueFencePolicy,null),copyBudget:d}}function hD(t){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(t||""))}
function Ec(t=null,e=null){const r=t&&typeof t=="object"?t:{},n=r.status||r.queueCompletionStatus||r.fenceStatus||r.completionStatus||
(e?.required?"gpu-fence-report-missing":null);if(!n&&!e?.required)return null;const s=r.method||r.queueCompletionMethod||
r.fenceMethod||r.completionMethod||null,i=r.fenceSatisfied===!0||r.satisfied===!0||r.completed===!0||hD(n);return{schema:r.
schema||WL,status:n,method:s,fenceSatisfied:i,required:e?.required===!0||r.required===!0,laneId:Ce(r.laneId,r.gpuLaneId,
e?.laneId),stateKey:Ce(r.stateKey,r.gpuStateKey,e?.stateKey),queueFencePolicy:Ce(r.queueFencePolicy,r.fencePolicy,e?.queueFencePolicy),
queueCompletionStatus:r.queueCompletionStatus||n||null,queueCompletionMethod:r.queueCompletionMethod||s||null,retainedBufferRefs:We(
r.retainedBufferRefs,e?.retainedBufferRefs||[]),workerId:r.workerId||r.remoteWorkerId||null,deviceId:r.deviceId||r.gpuDeviceId||
null,completedAt:r.completedAt||null,source:r.source||null}}function ju(t){return t?typeof t=="function"?t.placementExecutorId||
t.id||t.name||"placement-executor":t.id||t.name||t.constructor?.name||"placement-executor":null}function Gu(t){return t?
typeof t=="function"?t.placementAdmissionId||t.id||t.name||"placement-admission":t.id||t.name||t.constructor?.name||"pla\
cement-admission":null}function Wu(t){return t?typeof t=="function"?t.placementResultValidatorId||t.id||t.name||"placeme\
nt-result-validator":t.id||t.name||t.constructor?.name||"placement-result-validator":null}function Hu(t){return t?typeof t==
"function"?t.placementTaskSignerId||t.id||t.name||"placement-task-signer":t.id||t.name||t.constructor?.name||"placement-\
task-signer":null}function pD(t){return(Array.isArray(t)?t:[]).slice(0,64).map((r,n)=>{const s=r&&typeof r=="object"?r:{};
return{schema:s.schema||null,role:s.role||null,index:n,peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||
s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.transportPeerId||null,responderNodeId:s.responderNodeId||
null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.
remoteExecution&&typeof s.remoteExecution=="object"?JSON.parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&
typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||
null,inputHash:s.inputHash||null,taskHash:s.taskHash||null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||
s.outputHash||null,commitDeltaHash:s.commitDeltaHash||s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.
validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===
!0,errorCode:s.errorCode||null,errorMessage:s.errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(
Number(s.durationMs).toFixed(3)):null}})}function yh(t){if(t==null)return t;if(typeof t=="number")return Number.isFinite(
t)?t:String(t);if(typeof t=="string"||typeof t=="boolean")return t;if(typeof t=="bigint")return`${t.toString()}n`;if(typeof t==
"function")return`[Function:${t.name||"anonymous"}]`;if(ArrayBuffer.isView(t))return{typedArray:t.constructor?.name||"Ty\
pedArray",values:Array.from(t)};if(t instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(t))};if(Array.
isArray(t))return t.map(yh);if(typeof t=="object"){const e={};for(const r of Object.keys(t).sort()){if(r==="taskPacket"||
r==="taskEnvelope")continue;const n=yh(t[r]);n!==void 0&&(e[r]=n)}return e}return String(t)}function ta(t){return JSON.stringify(
yh(t))}function ra(t){const e=String(t??"");let r=2166136261;for(let n=0;n<e.length;n+=1)r^=e.charCodeAt(n),r=Math.imul(
r,16777619)>>>0;return`fnv1a32-${r.toString(16).padStart(8,"0")}`}function Vu({executorId:t,kind:e="worker",ordinal:r=null,
status:n="active"}={}){return{executorId:t,kind:e,ordinal:r,status:n,activeTaskCount:0,submitted:0,completed:0,failed:0,
abandoned:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,
lastStartedAt:null,lastCompletedAt:null,byRuntime:{},byTaskFamily:{}}}class mD{constructor(e={}){const r=typeof navigator<
"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4,n=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<
"u";this.workerPolicyOverrides={minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.
maxWorkers,autoScaleWorkers:e.autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},
this.resourceProfile=Fu(e.resourceProfile||e,{wasm:s,webgpu:n}),this.workerPolicy=zu(this.workerPolicyOverrides,this.resourceProfile),
this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:xe(
e.workerBootstrapTimeoutMs,ry,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,
maxWorkers:this.workerPolicy.maxWorkers||r,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.
workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.
config.workerBootstrapTimeoutMs=xe(e.workerBootstrapTimeoutMs,ry,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=
new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,this.taskGraphCacheArtifacts=new Map,this.workerAffinities=
new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=new Map,this.modelServices=new Set,this.resourceBroker=
e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=new WeakMap,this.workerRequirementError=null,this.
workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=new Map,this.nextWorkerOrdinal=1,
this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,Vu({executorId:this.inlineExecutorId,kind:"\
inline",ordinal:0,status:"active"})),this.solverRegistry=new hL(e.solvers||[]),this.gpuResidentLaneManager=e.gpuResidentLaneManager||
new DL({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.targetWorkerCount=this.workerPolicy.
targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=0,this.workerResizeHistory=[],
this.placementExecutor=typeof e.placementExecutor=="function"||e.placementExecutor?.submitTask?e.placementExecutor:null,
this.placementExecutorId=e.placementExecutorId||ju(this.placementExecutor),this.placementAdmission=typeof e.placementAdmission==
"function"||e.placementAdmission?.admitTask?e.placementAdmission:null,this.placementAdmissionId=e.placementAdmissionId||
Gu(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="function"||e.placementResultValidator?.
validateTaskResult||e.placementResultValidator?.validateResult?e.placementResultValidator:null,this.placementResultValidatorId=
e.placementResultValidatorId||Wu(this.placementResultValidator),this.placementTaskSigner=typeof e.placementTaskSigner=="\
function"||e.placementTaskSigner?.signTaskPacket||e.placementTaskSigner?.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||
e.remoteTaskSigner:null,this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||Hu(this.placementTaskSigner),
this.placementTimeoutMs=xe(e.placementTimeoutMs??e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.
remoteResultVerification!==!1&&e.placementResultVerification!==!1,this.placementRetryPolicy={schema:Co,maxAttempts:xe(e.
placementMaxAttempts??e.remotePlacementMaxAttempts,1,1,100),baseDelayMs:xe(e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,
50,0,6e5),maxDelayMs:xe(e.placementRetryMaxDelayMs??e.remotePlacementRetryMaxDelayMs,1e3,0,6e5),jitterFraction:Br(e.placementRetryJitterFraction??
e.remotePlacementRetryJitterFraction,0,0,1),retryableErrorKinds:We(e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
xi),terminalErrorKinds:[...yc]},this.manualWorkerAutoScaleCooldownMs=xe(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,
4e3,0,6e5),this.workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=null,this.lastWorkerResize={schema:"peercomput\
e.compute.worker-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.targetWorkerCount,targetWorkers:this.
targetWorkerCount,previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.stats={schema:"peercompute.compute\
.manager-stats.v0",totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,workerTasksCompleted:0,
remoteTasksCompleted:0,remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,remoteTasksValidationFailed:0,
remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,taskGraphsCompleted:0,taskGraphsFailed:0,
taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,taskGraphCacheArtifactsAdmitted:0,
taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,taskGraphCacheReadBlocked:0,
totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{},taskPlacement:{schema:ny,totalSubmitted:0,totalCompleted:0,totalFailed:0,localSubmitted:0,remoteRequested:0,
remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,remoteValidationFailed:0,remoteAttempts:0,
remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,byRecommendedPlacement:{},byActualPlacement:{}}},
this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities={cpu:!0,wasm:s,webgpu:n,wasmWebgpu:s&&n},this.initialized=
!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const r=xe(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,
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
{ResourceLeaseBroker:l},{ResidentModelAdmission:d},u]=await Promise.all([Ft(()=>import("./ModelInferenceService-D967skUg.js"),
__vite__mapDeps([5,2]),import.meta.url),Ft(()=>import("./ResourceLeaseBroker-CdfzqIEP.js"),[],import.meta.url),Ft(
()=>import("./ResidentModelAdmission-ns7tB3GD.js"),[],import.meta.url),s==="llama.cpp"?Ft(()=>Promise.resolve().
then(()=>yE),void 0,import.meta.url).then(m=>m.ggufRuntimeDefinition):s==="onnx-diffusion"?Ft(()=>Promise.resolve().
then(()=>tN),void 0,import.meta.url).then(m=>m.diffusionRuntimeDefinition):s==="transformers-speech"?Ft(()=>Promise.
resolve().then(()=>u$),void 0,import.meta.url).then(m=>m.speechRuntimeDefinition):null]);if(this.destroying||a!==
this.workerLifecycleRevision)throw new Error("ComputeManager shutdown interrupted service creation");if(r&&this.resourceBroker&&
r!==this.resourceBroker)throw new Error("Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){
if(!r&&!n)throw new Error("Configure inference CPU/GPU resource budgets");this.resourceBroker=r||new l({capacities:n})}const h=new c(
{...o,runtimeDefinition:u,artifactStore:e,computeManager:this,admission:new d({...i,broker:this.resourceBroker})});this.
modelServices.add(h);const p=h.dispose.bind(h);return h.dispose=async()=>{const m=await p();return this.modelServices.delete(
h),m},h}async refreshGpuLimits(){if(typeof navigator>"u"||!navigator.gpu?.requestAdapter)return this.getResourceProfile();
let e=null;try{e=await navigator.gpu.requestAdapter()}catch{return this.getResourceProfile()}const r=M1(e?.limits);return r?
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
e,s),l=this._taskFamilyStats(c);l.submitted+=1;const d=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:c}),u=nD(e),
h=sD(e,u);this._recordPlacementSubmitted(d);const p={id:o,runtime:s,taskFamily:c,solverId:e.solverId,placement:d,gpuFence:u,
gpuResidentLane:h,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey};if(p.
requireWorker&&(h?.localExecution==="inline"||d.requestedPlacement!=="local"&&!d.advisory))throw this._createRequiredWorkerError(
"required local worker conflicts with requested placement");if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&
!this.workerAffinities.has(p.affinityKey))throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers({reason:"task-demand"}),this.workerRequirementError)
throw this.workerRequirementError;return new Promise((m,b)=>{const g={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};
let f;const y=new Promise(S=>{f=S}),E=()=>{this.cancelTask(o).catch(()=>{})},k=(S,v)=>{g.settled||(g.settled=!0,clearTimeout(
g.timer),clearTimeout(g.bootstrapTimer),e.signal?.removeEventListener("abort",E),S(v),f())},x={id:o,payload:p,control:g,
completion:y,resolve:S=>k(m,S),reject:S=>k(b,S),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.
isArray(e.transferables)?e.transferables:[],submittedAt:Or(),runtime:s,taskFamily:c,placement:d};if(p.requireWorker&&!this.
workers.some(S=>this.workerBootstrap.get(S)?.status==="ready")&&(g.bootstrapTimer=setTimeout(()=>{const S=this.taskQueue.
findIndex(v=>v.id===o);S<0||(this.taskQueue.splice(S,1),this._recordTaskCompletion(x,{ok:!1,mode:"queued"}),x.reject(this.
_createRequiredWorkerError("task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),e.signal?.addEventListener(
"abort",E,{once:!0}),e.signal?.aborted){x.reject(e.signal.reason||new DOMException("Compute task cancelled","AbortError"));
return}this._dispatchToPlacementExecutor(x)||this._dispatchToWorker(x)||(this.taskQueue.push(x),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Fu(e,this.capabilities),this.
workerPolicy=zu(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:r="manual"}={}){const n=this.targetWorkerCount,s=this.workers.length,i=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=xe(e,this.targetWorkerCount,i,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,ZL(r)&&this._holdWorkerAutoScale(r),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:r,previousTargetWorkers:n,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(r),this._scheduleNext(),this._recordWorkerResize({reason:r,previousTargetWorkers:n,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:r=4096,minItems:n=1024,
maxItems:s=65536,itemStrideBytes:i=0,memoryFraction:o=.25,layerCount:a=1,maxShardsPerLayer:c=8}={}){const l=Math.max(1,this.
targetWorkerCount||this.workerPolicy.targetWorkers||1),d=xe(a,1,1,1024),u=XL(this.resourceProfile.tier),h=Math.max(1,Math.
floor(l/d)),p=xe(Math.min(u,h),1,1,Math.max(1,c)),m=JL(this.resourceProfile.tier),b=wc(l/YL(this.resourceProfile.tier)),
g=Br(this.resourceProfile.memoryBudgetMB,gh(this.resourceProfile.tier),0,1048576),f=Br(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),y=wc(g/gh(this.resourceProfile.tier)),E=this.resourceProfile.gpuAvailable?wc(f/Math.max(1,T1(this.resourceProfile.
tier))):.75,k=Br(this.resourceProfile.budgetScale,1,.05,64),x=wc(Math.min(b,y,E)*k),S=xe(i,0,0,1048576),v=Br(o,.25,.01,1),
w=S>0&&g>0?Math.max(n,Math.floor(g*1024*1024*v/S)):s,I=S>0&&this.resourceProfile.gpuLimits?Math.min(xe(this.resourceProfile.
gpuLimits.maxBufferSize,Number.MAX_SAFE_INTEGER,0),xe(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.
MAX_SAFE_INTEGER,0)):Number.MAX_SAFE_INTEGER,C=Number.isFinite(I)&&I>0&&S>0?Math.max(n,Math.floor(I*v/S)):s,R=Math.max(n,
Math.min(s,w,C)),N=xe(eD(r*m*x,256),r,n,R),P=Object.entries({workers:b,memory:y,gpu:E,explicit:k}).sort((j,Z)=>j[1]-Z[1])[0]?.[0]||
"workers";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:N,minItems:n,maxItems:s,effectiveMaxItems:R,
itemStrideBytes:S,workerCount:l,shardsPerLayer:p,layerCount:d,plannedWorkerTasks:d*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:x,limitingFactor:P,workerScale:b,memoryScale:y,gpuScale:E,explicitScale:k,memoryBudgetMB:g,
gpuMemoryBudgetMB:f,memoryFraction:v,memoryMaxItems:w,gpuMaxItems:C,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,r={}){const n=this.solverRegistry.createTask(e,
r);return this.submitTask(n)}async submitTaskGraph(e={}){const r=String(e.graphId||e.id||`task-graph:${Date.now()}`).trim(),
n=Array.isArray(e.nodes)?e.nodes:[];if(!n.length)throw new Error("submitTaskGraph requires at least one node");const s=[],
i=new Map;for(const P of n){const j=String(P?.id||P?.nodeId||P?.task?.id||"").trim();if(!j)throw new Error("submitTaskGr\
aph node id is required");if(i.has(j))throw new Error(`Duplicate task graph node id: ${j}`);const Z=We(P.dependsOn||P.dependencies||
[]),X={...P,id:j,dependsOn:Z};s.push(X),i.set(j,X)}for(const P of s)for(const j of P.dependsOn)if(!i.has(j))throw new Error(
`Task graph node ${P.id} depends on unknown node ${j}`);this.stats.taskGraphsSubmitted+=1;const o=oD(e,s),a=aD(e),c=lD(e,
o),l=uD(e),d=fD(e,r),u=String(e.cancellation?.mode||e.cancellationMode||"cooperative").trim()||"cooperative",h=e.abortSignal||
e.cancelSignal||e.signal||e.cancellation?.signal||null,p={schema:Uu,mode:u,status:"not-cancelled",reason:null};let m=o.readEnabled?
this.taskGraphCache.get(o.cacheKey):null;const b=Date.now();m&&m.expiresAt&&m.expiresAt<=b&&(this.taskGraphCache.delete(
o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),m=null);let g=null;if(m&&o.requireAdmitted&&m.artifact?.admitted!==
!0&&(this.stats.taskGraphCacheReadBlocked+=1,g="blocked-unadmitted-cache-artifact",m=null),m){this.stats.taskGraphCacheHits+=
1,this.stats.taskGraphsCompleted+=1;const P=Fe(m.result),j=Fe(m.artifact||P.cacheArtifact||null);return{...P,cachePolicy:o,
cacheAdmission:j?.admission||P.cacheAdmission||c,cacheAdmissionStatus:j?.admission?.status||P.cacheAdmissionStatus||null,
cacheArtifact:j,cacheArtifactSchema:j?.schema||null,cacheArtifactStatus:j?.status||null,cacheStatus:"hit",cacheHit:!0,cachedAt:m.
storedAt,durationMs:0}}const f=new Map(s.map(P=>[P.id,P])),y={},E=[],k=[],x=[],S=Or(),v={graphId:r,startedAt:S,cancelled:h?.
aborted===!0,reason:h?.reason||null,cacheKey:o.cacheKey,stateSeedPayload:a,placementPolicy:l,graphLaneSpec:d},w=()=>{v.cancelled=
!0,v.reason=h?.reason||"abort-signal"};h?.addEventListener&&h.addEventListener("abort",w,{once:!0}),this.activeTaskGraphs.
set(r,v);const I=()=>{if(!v.cancelled)return;p.status="cancelled",p.reason=String(v.reason||"cancelled");const P=new Error(
`Task graph cancelled: ${r}`);throw P.code="TASK_GRAPH_CANCELLED",P.graphId=r,P.cancellation={...p},P};let C=null,R=null,
N=d?"required":"not-required",D=g||(o.readEnabled?"miss":o.writeEnabled?"record-only":"disabled");try{for(I(),d&&(C=this.
acquireGpuResidentLaneLease({...d,taskId:r,owner:d.owner||"compute-manager-task-graph"}),N="active");f.size>0;){I();const j=new Set(
Object.keys(y)),Z=Array.from(f.values()).filter(q=>q.dependsOn.every(ue=>j.has(ue)));if(!Z.length)throw new Error(`Task \
graph has a cycle or unsatisfied dependency: ${Array.from(f.keys()).join(", ")}`);x.push(Z.map(q=>q.id));const X=await Promise.
all(Z.map(async q=>{I();const ue={schema:UL,graphId:r,nodeId:q.id,dependsOn:[...q.dependsOn],completedNodeIds:Object.keys(
y),nodeResults:y,results:y,cachePolicy:o,cacheKey:o.cacheKey,cacheInputs:o.inputs,stateSeedPayload:a,placementPolicy:l,cancellation:p,
graphLease:C,graphLeaseSpec:d,getResult(Ie){return y[Ie]}};let he=typeof q.createTask=="function"?await q.createTask(ue):
typeof q.task=="function"?await q.task(ue):q.task;if(!he||typeof he!="object")throw new Error(`Task graph node ${q.id} d\
id not produce a task`);he=cD(he,q,y),I();const ze=Or(),be=await this.submitTask(he);return I(),{node:q,task:he,result:be,
durationMs:Math.max(0,Or()-ze)}}));for(const q of X)f.delete(q.node.id),y[q.node.id]=q.result,k.push(q.node.id),E.push({
nodeId:q.node.id,dependsOn:[...q.node.dependsOn],taskId:q.task.id||null,taskFamily:q.task.taskFamily||q.task.solverId||null,
solverId:q.task.solverId||null,status:"completed",durationMs:q.durationMs,resultSchema:q.result?.computeTaskResultSchema||
q.result?.schema||null})}C?.leaseId&&(R=this.completeGpuResidentLaneLease(C.leaseId,{status:"ordered-before-consumer-que\
ue-completed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-comple\
ted",queueCompletionMethod:"compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),N=R?.lease?.status||
"completed");const P={schema:ay,graphId:r,status:"completed",nodeCount:s.length,edgeCount:s.reduce((j,Z)=>j+Z.dependsOn.
length,0),executionOrder:k,executionBatches:x,nodeReports:E,nodeResults:y,cachePolicy:o,cacheKey:o.cacheKey,cacheKeySource:o.
keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:a,cacheAdmission:c,cacheAdmissionStatus:c.status,
cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:D,cacheHit:!1,placementPolicy:l,cancellation:p,
cancellationStatus:p.status,graphLeaseRequired:d!=null,graphLeaseStatus:N,graphLeaseSpec:d,graphLease:C,graphLeaseExecution:R,
durationMs:Math.max(0,Or()-S)};if(o.writeEnabled){const j=Date.now(),Z=o.ttlMs>0?j+o.ttlMs:null,X=dD({graphId:r,cachePolicy:o,
result:P,storedAt:j,expiresAt:Z,admission:c});this.taskGraphCache.set(o.cacheKey,{storedAt:j,expiresAt:Z,artifact:Fe(X),
result:Fe(P)}),this.taskGraphCacheArtifacts.set(o.cacheKey,Fe(X)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,D=o.readEnabled?"miss-stored":"recorded",P.cacheStatus=D,P.cachedAt=j,P.cacheArtifact=X,P.cacheArtifactSchema=X.schema,
P.cacheArtifactStatus=X.status}return this.stats.taskGraphsCompleted+=1,P}catch(P){const j=v.cancelled||P?.code==="TASK_\
GRAPH_CANCELLED";if(j?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,C?.leaseId&&!R)try{this.rejectGpuResidentLaneLease(
C.leaseId,j?"task-graph-cancelled":"task-graph-failed"),N=j?"rejected-cancelled":"rejected-failed"}catch{N="reject-faile\
d"}throw P.graphId=P.graphId||r,P.taskGraphStatus=j?"cancelled":"failed",P.graphLeaseStatus=N,P.cancellation=P.cancellation||
{...p},P}finally{h?.removeEventListener&&h.removeEventListener("abort",w),this.activeTaskGraphs.delete(r)}}getGpuResidentLaneManager(){
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
s.reject(i),this._ensureTargetWorkers({reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(c,xe(
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
r||"cancelTaskGraph")}}listActiveTaskGraphs(){return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:ay,graphId:e.
graphId,status:e.cancelled?"cancel-requested":"running",startedAt:e.startedAt,cacheKey:e.cacheKey||null,placementPolicy:e.
placementPolicy?JSON.parse(JSON.stringify(e.placementPolicy)):null,graphLeaseRequired:e.graphLaneSpec!=null,cancellationReason:e.
reason||null}))}getTaskGraphCacheArtifact(e){const r=String(e||"").trim(),n=this.taskGraphCacheArtifacts.get(r);return n?
Fe(n):null}listTaskGraphCacheArtifacts(){return Array.from(this.taskGraphCacheArtifacts.values()).map(e=>Fe(e)).sort((e,r)=>String(
e.cacheKey||"").localeCompare(String(r.cacheKey||"")))}importRemoteTaskGraphCacheResult(e={},r={},n={}){const s=e?.cacheArtifact&&
typeof e.cacheArtifact=="object"?e.cacheArtifact:null,i=String(s?.cacheKey||e?.cacheKey||r?.cacheKey||"").trim();if(!i)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires a cacheKey");if(!s)throw this.
stats.taskGraphRemoteCacheImportBlocked+=1,new Error("importRemoteTaskGraphCacheResult requires result.cacheArtifact");if(r?.
admitted!==!0){this.stats.taskGraphRemoteCacheImportBlocked+=1;const b=new Error(`Remote task graph cache artifact is no\
t admitted: ${i}`);throw b.code="ERR_REMOTE_TASK_GRAPH_CACHE_ARTIFACT_NOT_ADMITTED",b.cacheKey=i,b}const o=Date.now(),a=s.
storedAt||e.cachedAt||o,c=s.expiresAt||null,l=We(e?.graphLeaseSpec?.retainedBufferRefs,e?.cacheInputs?.retainedBufferRefs,
s?.inputs?.retainedBufferRefs),d={schema:R1,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,status:l.length>
0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:l.length>0?"remote-gpu-resident-re\
fs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:e?.graphLeaseSpec?.laneId||e?.
graphLease?.laneId||null,stateKey:e?.graphLeaseSpec?.stateKey||e?.graphLease?.stateKey||null,retainedBufferRefs:l,graphLeaseStatus:e?.
graphLeaseStatus||null,graphLeaseRequired:e?.graphLeaseRequired===!0},u={schema:mh,status:"admitted",admitted:!0,authority:r.
authority||"node-kernel-state-manager",admissionId:r.admissionId||null,validatorId:r.validatorId||null,reason:r.reason||
"remote-task-graph-cache-artifact-admitted",invalidationRefs:We(r.invalidationRefs,s.invalidationRefs),acceptedAt:r.acceptedAt||
r.admittedAt||o},h={schema:cy,status:"imported-admitted-remote-cache-result",cacheKey:i,graphId:e?.graphId||s.graphId||null,
sourcePeerId:n.sourcePeerId||r.sourcePeerId||null,responderId:n.responderId||r.responderId||null,requestId:n.requestId||
r.requestId||null,admissionId:r.admissionId||null,importedAt:o,remoteArtifactStatus:s.status||null,remoteArtifactAdmitted:s.
admitted===!0,retainedGpuLaneRefs:d,retainedGpuLaneRefsStatus:d.status,resultHash:s.resultHash||null,inputHash:s.inputHash||
e?.cacheInputHash||null},p={...Fe(s),cacheKey:i,status:"admitted-remote-cache-artifact-recorded",admitted:!0,admission:u,
stateAdmission:Fe(r),remoteCacheImport:h,remoteGraphLeaseRefs:d},m={...Fe(e),cacheKey:i,cacheAdmission:u,cacheAdmissionStatus:u.
status,cacheArtifact:Fe(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.schema||null,cacheStatus:"remote-imported",
cacheHit:!1,remoteTaskGraphCacheImport:h,remoteGraphLeaseRefs:d};return this.taskGraphCacheArtifacts.set(i,Fe(p)),this.taskGraphCache.
set(i,{storedAt:a,expiresAt:c,artifact:Fe(p),result:Fe(m)}),this.stats.taskGraphRemoteCacheImports+=1,Fe(h)}evaluateRemoteTaskGraphStateSeedPolicy(e,r={}){
const n=e&&typeof e=="object"?e:r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim(),i=Date.now(),o=s&&this.taskGraphCache.
get(s)||null,a=s&&(this.taskGraphCacheArtifacts.get(s)||o?.artifact)||null,c=o?.result||null,l=c?.remoteTaskGraphCacheImport||
a?.remoteCacheImport||null,d=Ce(c?.stateSeedPayload,c?.stateSeed,c?.warmStateSeed,a?.stateSeedPayload,a?.stateSeed,a?.outputs?.
stateSeed,n?.stateSeedPayload,n?.stateSeed),u=c?.remoteGraphLeaseRefs||a?.remoteGraphLeaseRefs||l?.retainedGpuLaneRefs||
null,h=vc(c?.cacheInputs?.stateFamilies,c?.cachePolicy?.inputs?.stateFamilies,a?.inputs?.stateFamilies,a?.cacheInputs?.stateFamilies,
n?.stateFamilies),p=vc(c?.cacheInputs?.readFamilies,c?.cachePolicy?.inputs?.readFamilies,a?.inputs?.readFamilies,a?.cacheInputs?.
readFamilies,n?.readFamilies),m=vc(c?.cacheInputs?.writeFamilies,c?.cachePolicy?.inputs?.writeFamilies,a?.inputs?.writeFamilies,
a?.cacheInputs?.writeFamilies,n?.writeFamilies),b=We(n?.allowedStateFamilies??n?.allowedFamilies,[]),g=vc(u?.retainedBufferRefs,
c?.graphLeaseSpec?.retainedBufferRefs,c?.cacheInputs?.retainedBufferRefs,a?.inputs?.retainedBufferRefs,n?.retainedBufferRefs),
f=u?.usableLocally===!0&&u?.remoteOnly!==!0,y=l?.schema===cy||c?.cacheStatus==="remote-imported"||a?.status==="admitted-\
remote-cache-artifact-recorded",E=a?.admitted===!0,k=n?.requireStateFamilies!==!1,x=b.length>0?h.filter(P=>!b.includes(P)):
[];let S="state-family-not-evaluated";h.length===0?S=k?"state-family-missing":"state-family-not-declared":b.length===0?S=
"state-family-policy-not-declared":x.length>0?S="state-family-blocked":S="state-family-allowed";let v="policy-ready",w="\
remote-cache-import-admitted-for-local-policy";s?!o&&!a?(v="blocked-cache-miss",w="cache-entry-not-found"):E?y?S==="stat\
e-family-missing"?(v="blocked-missing-state-families",w="remote-import-did-not-declare-state-families"):S==="state-famil\
y-policy-not-declared"?(v="blocked-missing-state-family-policy",w="allowed-state-family-policy-is-required"):S==="state-\
family-blocked"&&(v="blocked-state-family-policy",w="remote-import-declares-state-families-outside-policy"):(v="blocked-\
not-remote-import",w="cache-entry-did-not-originate-from-admitted-remote-task-graph-import"):(v="blocked-unadmitted-cach\
e-artifact",w="cache-artifact-is-not-admitted"):(v="blocked-no-cache-key",w="remote-state-seed-policy-requires-cache-key");
const I=v==="policy-ready",C=n?.allowWarmStateSeed===!0,R=n?.allowHotBufferRefresh===!0,N=C?I?"warm-state-seed-allowed":
"warm-state-seed-blocked":"warm-state-seed-not-requested";let D=R?"no-retained-buffer-refs":"hot-buffer-refresh-not-requ\
ested";return R&&!I?D="hot-buffer-refresh-blocked":R&&g.length>0&&f?D="local-buffer-refs-usable":R&&g.length>0&&(D="loca\
l-refresh-required"),{schema:jL,status:v,reason:w,cacheKey:s||null,requestedAt:i,cacheEntryPresent:o!=null,artifactPresent:a!=
null,admitted:E,remoteImported:y,importStatus:l?.status||null,importSchema:l?.schema||null,importReport:l?Fe(l):null,stateFamilies:h,
readFamilies:p,writeFamilies:m,stateSeedPayloadAvailable:d!=null,stateSeedPayload:d!=null?Fe(d):null,allowedStateFamilies:b,
disallowedStateFamilies:x,stateFamilyStatus:S,warmStateSeedRequested:C,warmStateSeedStatus:N,hotBufferRefreshRequested:R,
hotBufferRefreshStatus:D,retainedBufferRefs:g,remoteRetainedRefsUsableLocally:f,remoteGraphLeaseRefs:u?Fe(u):null}}admitTaskGraphCacheArtifact(e,r={}){
const n=e&&typeof e=="object"?e:r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("admitTask\
GraphCacheArtifact requires a cacheKey");const i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||i?.artifact||
null;if(!o)return null;const a=Fe(n||{}),c=a.admittedAt||a.acceptedAt||Date.now(),l={schema:mh,status:"admitted",admitted:!0,
authority:a.authority||"state-manager",admissionId:a.admissionId||null,validatorId:a.validatorId||null,reason:a.reason||
"state-manager-cache-artifact-admitted",invalidationRefs:We(a.invalidationRefs),acceptedAt:c},d=o.admitted===!0,u={...Fe(
o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:l,stateAdmission:a};if(this.taskGraphCacheArtifacts.set(
s,Fe(u)),i){const h=Fe(i.result||{});h.cacheAdmission=l,h.cacheAdmissionStatus=l.status,h.cacheArtifact=Fe(u),h.cacheArtifactStatus=
u.status,h.cacheArtifactSchema=u.schema||null,this.taskGraphCache.set(s,{...i,artifact:Fe(u),result:h})}return d||(this.
stats.taskGraphCacheArtifactsAdmitted+=1),Fe(u)}invalidateTaskGraphCacheArtifact(e,r={}){const n=e&&typeof e=="object"?e:
r,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires\
 a cacheKey");const i=Fe(n||{}),o=this.taskGraphCache.get(s),a=this.taskGraphCacheArtifacts.get(s)||o?.artifact||null;if(this.
taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!a)return{cacheKey:s,status:"invalidated",admitted:!1,
invalidation:i};const c={...Fe(a),status:"invalidated",admitted:!1,invalidation:i,invalidatedAt:i.invalidatedAt||Date.now()};
return this.taskGraphCacheArtifacts.set(s,Fe(c)),Fe(c)}configurePlacementHooks(e={}){const r=u=>Object.prototype.hasOwnProperty.
call(e,u),n=(...u)=>{for(const h of u)if(r(h))return{found:!0,value:e[h]};return{found:!1,value:void 0}},s=n("placementE\
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
placementTimeoutMs=xe(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(r("remoteResult\
Verification")||r("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const c={...this.placementRetryPolicy},l=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},d=u=>Object.prototype.
hasOwnProperty.call(l,u)||Object.prototype.hasOwnProperty.call(e,u);return(d("maxAttempts")||d("placementMaxAttempts")||
d("remotePlacementMaxAttempts"))&&(c.maxAttempts=xe(l.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,
c.maxAttempts,1,100)),(d("baseDelayMs")||d("placementRetryBaseDelayMs")||d("remotePlacementRetryBaseDelayMs"))&&(c.baseDelayMs=
xe(l.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,c.baseDelayMs,0,6e5)),(d("maxDelayMs")||
d("placementRetryMaxDelayMs")||d("remotePlacementRetryMaxDelayMs"))&&(c.maxDelayMs=xe(l.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,c.maxDelayMs,0,6e5)),(d("jitterFraction")||d("placementRetryJitterFraction")||d("remote\
PlacementRetryJitterFraction"))&&(c.jitterFraction=Br(l.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
c.jitterFraction,0,1)),(d("retryableErrorKinds")||d("placementRetryableErrorKinds")||d("remotePlacementRetryableErrorKin\
ds"))&&(c.retryableErrorKinds=We(l.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
c.retryableErrorKinds||xi)),this.placementRetryPolicy=this._getPlacementRetryPolicyReport(c),this.getCapabilities()}getCapabilities(){
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
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:Co,maxAttempts:xe(e?.maxAttempts,
1,1,100),baseDelayMs:xe(e?.baseDelayMs,0,0,6e5),maxDelayMs:xe(e?.maxDelayMs,0,0,6e5),jitterFraction:Br(e?.jitterFraction,
0,0,1),retryableErrorKinds:We(e?.retryableErrorKinds,xi),terminalErrorKinds:[...yc]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,r){}_handleTaskError(e,r){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,r=null){const n=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return n.name="RequiredWorkerUnavailableError",n.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",n.reason=e,r!=null&&(n.cause=r),n}_failRequiredWorkerPool(e){const r=e?.code==="ERR_COMPUTE_RE\
QUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError(e?.message||String(e||"the required worker pool failed"),e);
this.workerRequirementError=r,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;for(const n of[
...this.workers])this._markWorkerBootstrapFailed(n,r),this._removeWorker(n);for(const[n,s]of this.activeTasks.entries())
this.workers.includes(s.worker)||this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(s,r.code),this._recordTaskCompletion(
s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:r.message}),s.reject(Object.
assign(new Error(r.message),{name:r.name,code:r.code,workerTerminated:!this.workers.includes(s.worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(
r),r}_createWorkerBootstrapRecord(e){let r=null,n=null;const s={status:"bootstrapping",startedAt:Or(),readyAt:null,reason:null,
promise:null,resolve:null,reject:null,timeout:null,messageErrorListener:null};if(s.promise=new Promise((i,o)=>{r=i,n=o}),
s.promise.catch(()=>{}),s.resolve=r,s.reject=n,this.workerBootstrap.set(e,s),this.config.requireWorkers){const i=this.config.
workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(
`worker bootstrap did not acknowledge readiness within ${i}ms`))},i)}return s}_markWorkerBootstrapped(e){const r=this.workerBootstrap.
get(e);!r||r.status!=="bootstrapping"||(clearTimeout(r.timeout),r.timeout=null,r.status="ready",r.readyAt=Or(),r.resolve?.(
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
gpuResidentLane,placement:r},i=ra(ta(n)),o=ra(ta(s)),a=ra(ta({codeHash:i,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:r?.requestedPlacement||null}));return{schema:oy,taskId:e.id||null,runtime:e.runtime||
null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:r?.requestedPlacement||null,gpuFenceRequired:e.
gpuFence?.required===!0,gpuFenceSchema:e.gpuFence?.schema||null,gpuLaneId:e.gpuFence?.laneId||null,gpuStateKey:e.gpuFence?.
stateKey||null,gpuQueueFencePolicy:e.gpuFence?.queueFencePolicy||null,gpuResidentLaneSchema:e.gpuResidentLane?.schema||null,
gpuResidentLaneLocalExecution:e.gpuResidentLane?.localExecution||null,codeHash:i,inputHash:o,taskHash:a,hashAlgorithm:"f\
nv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{signed:!1,reason:e===
!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"custom-signa\
ture"};if(typeof e=="object"){const r=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!r,signature:r,signatureAlgorithm:e.
signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(r?"signed":"no-signature")}}return{signed:!0,signature:String(
e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:r=null}={}){const n=e.payload?.
taskPacket||null,s=e.placement||e.payload?.placement||null,i={schema:iy,taskPacketSchema:n?.schema||null,taskPacket:n,mode:r,
signed:!1,signerId:null,signature:null,signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)
return i;const o={manager:this,task:e,placement:s,payload:e.payload,taskPacket:n,mode:r},a=this.placementTaskSigner,c=typeof a==
"function"?await a(n,o):a.signTaskPacket?await a.signTaskPacket(n,o):await a.signEnvelope(i,o),l=this._normalizePlacementTaskSignature(
c);return{...i,...l,schema:l.schema||iy,taskPacket:n,signerId:l.signerId||this.placementTaskSignerId||"placement-task-si\
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
mode:r=null,finalResult:n=null,commitDelta:s=null,provenance:i=null}={}){if(!this.placementResultValidator)return{schema:sy,
valid:!0,reason:"no-result-validator",validationId:null,mode:r,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.
placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||
null,mode:r,finalResult:n,commitDelta:s,provenance:i},a=this.placementResultValidator,c=typeof a=="function"?await a(n,o):
a.validateTaskResult?await a.validateTaskResult(n,o):await a.validateResult(n,o),l=this._normalizePlacementValidationResult(
c);return{...l,schema:l.schema||sy,validationId:l.validationId||this.placementResultValidatorId||"placement-result-valid\
ator",mode:r,decidedAt:Date.now()}}_placementRejectedError(e,{mode:r}){const n=new Error(`Remote placement rejected for ${r}\
: ${e?.reason||"admission-denied"}`);return n.name="PlacementAdmissionRejectedError",n.code="ERR_COMPUTE_PLACEMENT_REJEC\
TED",n.placementMode=r,n.reason=e?.reason||"admission-denied",n.admission=e||null,n}_placementValidationError(e,r,{mode:n}){
const s=new Error(`Remote placement result validation failed for ${n}: ${e?.reason||"validation-denied"}`);return s.name=
"PlacementResultValidationError",s.code="ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=n,s.reason=e?.reason||"valida\
tion-denied",s.validation=e||null,s.provenance=r||null,s}_placementTimeoutFor(e){return xe(e.placement?.timeoutMs??e.payload?.
placement?.timeoutMs??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){const r=e.placement||
e.payload?.placement||{},n=this.placementRetryPolicy||{},s=xe(r.maxAttempts??r.retryMaxAttempts??r.remoteMaxAttempts??r.
remoteRetryMaxAttempts??n.maxAttempts,1,1,100),i=xe(r.retryBaseDelayMs??r.remoteRetryBaseDelayMs??n.baseDelayMs,0,0,6e5),
o=xe(r.retryMaxDelayMs??r.remoteRetryMaxDelayMs??n.maxDelayMs,i,0,6e5),a=Br(r.retryJitterFraction??r.remoteRetryJitterFraction??
n.jitterFraction,0,0,1);return this._getPlacementRetryPolicyReport({...n,maxAttempts:s,baseDelayMs:i,maxDelayMs:o,jitterFraction:a,
retryableErrorKinds:We(r.retryableErrorKinds??r.remoteRetryableErrorKinds??n.retryableErrorKinds,xi)})}_placementErrorKind(e){
return e?.code==="ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":e?.code==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":e?.code===
"ERR_COMPUTE_PLACEMENT_VERIFICATION"?"verification-failed":e?.code==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-fail\
ed":"executor-error"}_placementRetryDelayMs(e,r){const n=xe(r?.baseDelayMs,0,0,6e5),s=xe(r?.maxDelayMs,n,0,6e5),i=Math.max(
0,xe(e,1,1,100)-1),o=Math.min(s,n*2**i),a=Br(r?.jitterFraction,0,0,1);if(a<=0||o<=0)return o;const c=o*a*Math.random();return Math.
min(s,Math.round(o+c))}_placementRetryDecision({attempt:e,errorKind:r,err:n,policy:s,mode:i}){const o=new Set(We(s?.retryableErrorKinds,
xi)),a=new Set(yc),c=xe(s?.maxAttempts,1,1,100),l=a.has(r),d=!l&&o.has(r),u=e<c,h=d&&u;return{schema:Co,mode:i,attempt:e,
nextAttempt:h?e+1:null,maxAttempts:c,errorKind:r,errorCode:n?.code||null,errorMessage:n?.message||String(n||""),retryable:d,
terminal:l,retryScheduled:h,exhausted:d&&c>1&&!u,delayMs:h?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{
mode:r,ok:n=!0,errorKind:s=null}={}){const i=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||
this._placementRetryPolicyFor(e),a=i.filter(l=>l.retryScheduled).length,c=i[i.length-1]||null;return{schema:Co,mode:r,maxAttempts:o.
maxAttempts,attemptCount:xe(e.placementAttempt,a+1,0,100),retryCount:a,retried:a>0,retryableErrorKinds:We(o.retryableErrorKinds,
xi),terminalErrorKinds:[...yc],exhausted:!n&&!!c?.exhausted,finalErrorKind:n?null:s||c?.errorKind||null,events:JSON.parse(
JSON.stringify(i))}}_runPlacementExecutor(e,{signal:r=null,timeoutMs:n=this.placementTimeoutMs,mode:s=null,attempt:i=1,retryPolicy:o=null}={}){
const a={manager:this,task:e,placement:e.placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||
null,taskEnvelope:e.payload?.taskEnvelope||null,signal:r,timeoutMs:n,mode:s,attempt:i,retryPolicy:o};return typeof this.
placementExecutor=="function"?this.placementExecutor(e.payload,a):this.placementExecutor.submitTask(e.payload,a)}_runPlacementExecutorWithTimeout(e,{
mode:r,attempt:n=1,retryPolicy:s=null}={}){const i=this._placementTimeoutFor(e),o=typeof AbortController<"u"?new AbortController:
null,a=Promise.resolve().then(()=>this._runPlacementExecutor(e,{signal:o?.signal||null,timeoutMs:i,mode:r,attempt:n,retryPolicy:s}));
if(i<=0)return a;let c=null;const l=new Promise((d,u)=>{c=setTimeout(()=>{const h=new Error(`Placement executor timed ou\
t after ${i}ms for ${r}`);h.name="PlacementExecutorTimeoutError",h.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",h.timeoutMs=i,h.
placementMode=r;try{o?.abort?.(h)}catch{}u(h)},i)});return Promise.race([a,l]).finally(()=>{c!=null&&clearTimeout(c)})}_normalizeRemotePlacementProvenance(e,{
task:r,mode:n,result:s,finalResult:i,startedAt:o=null,completedAtMs:a=null,completedAt:c=Date.now()}={}){const l=e&&typeof e==
"object"?e:{},d=r?.payload||{},u=r?.placement||d.placement||{},h=Number.isFinite(Number(l.durationMs))?Number(l.durationMs):
Number.isFinite(Number(l.roundTripMs))?Number(l.roundTripMs):Number.isFinite(Number(o))&&Number.isFinite(Number(a))?Math.
max(0,Number(a)-Number(o)):null,p=s&&typeof s=="object"?s:{},m=i&&typeof i=="object"?i:{},b=r?.placementAdmission||null,
g=d.taskPacket||null,f=d.taskEnvelope||null,y=pD(l.replicas||l.replicaResults||l.quorum?.replicas||p.replicas||p.replicaResults),
E=Ec(l.gpuFence||l.gpuFenceReport||p.gpuFence||p.gpuFenceReport||m.gpuFence||m.gpuFenceReport||l.remoteExecution?.gpuFence||
l.remoteExecution?.gpuFenceReport||l.remoteExecution?.computeExecution?.gpuFence,d.gpuFence||g?.gpuFence||null);return{schema:PL,
taskPacketSchema:g?.schema||null,taskEnvelopeSchema:f?.schema||null,taskSigned:f?.signed===!0,signerId:l.signerId||f?.signerId||
null,signatureAlgorithm:l.signatureAlgorithm||f?.signatureAlgorithm||null,mode:n,executorId:l.executorId||this.placementExecutorId||
"placement-executor",promotedReplicaExecutorId:l.promotedReplicaExecutorId||null,admissionId:b?.admissionId||null,admissionReason:b?.
reason||null,requestedPlacement:u.requestedPlacement||null,taskId:d.id||r?.id||null,taskFamily:d.taskFamily||r?.taskFamily||
null,solverId:d.solverId||u.solverId||null,solverKey:u.solverKey||null,peerId:l.peerId||l.remotePeerId||null,targetPeerId:l.
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
l.promotedReplica)):null,replicaSuccessCount:xe(l.replicaSuccessCount,0,0,1e6),replicaFailureCount:xe(l.replicaFailureCount,
0,0,1e6),redundantReplicaCount:xe(l.redundantReplicaCount??y.length,y.length,0,1e6),replicaCount:y.length,quorumReplicaCount:xe(
l.quorumReplicaCount??y.length,y.length,0,1e6),replicas:y,validated:l.validated===!0,durationMs:h==null?null:Number(h.toFixed(
3)),completedAt:c}}_verifyRemotePlacementProvenance(e={},r={}){const n=r?.payload?.taskPacket||null,s=Date.now();if(!this.
remoteResultVerification)return{schema:Ou,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!n||n.schema!==
oy)return{schema:Ou,verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:n?.schema||null,mismatchFields:[
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
call(e,"result")&&(i=e.result)}const c=Date.now(),l=Or(),d=this._normalizeRemotePlacementProvenance(a,{task:r,mode:n,result:e,
finalResult:i,startedAt:s,completedAtMs:l,completedAt:c}),u=this._verifyRemotePlacementProvenance(d,r);if(d.verification=
u,d.verified=u.verified,!u.verified)throw this._placementVerificationError(u,d,{mode:n});return{finalResult:i,commitDelta:o,
provenance:d}}async _runRemotePlacementWithRetries(e,{mode:r}){const n=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
n,e.placementRetryEvents=[];for(let i=1;i<=n.maxAttempts;i+=1){e.placementAttempt=i,this._recordPlacementAttempt(e,{mode:r,
attempt:i,retryPolicy:n});const o=Or();try{const a=await this._runPlacementExecutorWithTimeout(e,{mode:r,attempt:i,retryPolicy:n}),
{finalResult:c,commitDelta:l,provenance:d}=this._unwrapPlacementExecutorResult(a,e,{mode:r,startedAt:o}),u=await this._runPlacementResultValidator(
e,{mode:r,finalResult:c,commitDelta:l,provenance:d});if(d.validation=u,!u.valid)throw this._placementValidationError(u,d,
{mode:r});return d.retry=this._placementRetrySummary(e,{mode:r,ok:!0}),{finalResult:c,commitDelta:l,provenance:d}}catch(a){
const c=this._placementErrorKind(a),l=this._placementRetryDecision({attempt:i,errorKind:c,err:a,policy:n,mode:r});if(a.retry=
l,e.placementRetryEvents.push(l),!l.retryScheduled)throw a;this._recordPlacementRetry(e,{mode:r,retry:l}),await tD(l.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${r}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=r,s.retry=this._placementRetrySummary(e,{mode:r,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){const r=e.placement||e.payload?.placement||{};if(!this._canDispatchRemotePlacement(
r))return!1;const n=`remote-${r.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(e.payload,r);const s={...e,
startedAt:Or(),executionMode:n,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.placementAdmissionId,
placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(s,{mode:n})).
then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:n})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:n});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:n})).then(({finalResult:i,commitDelta:o,provenance:a})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:n,provenance:a,admission:s.placementAdmission,retry:a.retry||this._placementRetrySummary(s,{mode:n,ok:!0})}),s.resolve(
i)}).catch(i=>{const o=this._placementErrorKind(i),a=i?.retry?.schema===Co?this._placementRetrySummary(s,{mode:n,ok:!1,errorKind:o}):
null;this._recordTaskCompletion(s,{ok:!1,mode:n,errorKind:o,errorMessage:i?.message||String(i),admission:s.placementAdmission||
i?.admission||null,provenance:i?.provenance||null,retry:a}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this.
_scheduleIdleScaleDown(),this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,
{type:"module"}):$L();this._createWorkerBootstrapRecord(e);const r=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const n=`\
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
n,i.lastDurationMs=d,i.maxDurationMs=Math.max(i.maxDurationMs,d);const u=i.completed+i.failed;i.averageDurationMs=u>0?Number(
(i.totalDurationMs/u).toFixed(3)):0,i.lastRuntime=o,i.lastTaskFamily=a,i.lastCompletedAt=Date.now();for(const h of[c,l]){
h.totalDurationMs+=n,h.lastDurationMs=d,h.maxDurationMs=Math.max(h.maxDurationMs,d);const p=h.completed+h.failed;h.averageDurationMs=
p>0?Number((h.totalDurationMs/p).toFixed(3)):0}}_recordExecutorAbandon(e){const r=e.executorId;if(!r||!e.executorActive)
return;const n=this.workerUtilization.get(r);n&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),n.abandoned+=1,e.executorActive=
!1)}_cloneExecutorStats(e){return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(u=>u.kind==="worker").sort((u,h)=>(u.ordinal??0)-(h.ordinal??
0)).map(u=>this._cloneExecutorStats(u)),r=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),n=e.filter(u=>u.status==="active"),s=e.filter(u=>u.status==="retired"),i=[r,...e],o=e.reduce((u,h)=>u+(h.
activeTaskCount||0),0),a=i.reduce((u,h)=>u+(h.submitted||0),0),c=i.reduce((u,h)=>u+(h.completed||0),0),l=i.reduce((u,h)=>u+
(h.failed||0),0),d=[...i].sort((u,h)=>(h.activeTaskCount||0)-(u.activeTaskCount||0)||(h.completed||0)-(u.completed||0)||
(h.submitted||0)-(u.submitted||0))[0]||r;return{schema:NL,generatedAt:Date.now(),inline:r,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:n.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:r.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(r.activeTaskCount||0),totalSubmitted:a,totalCompleted:c,totalFailed:l,
busiestExecutorId:d.executorId||null,busiestActiveTaskCount:d.activeTaskCount||0,busiestCompleted:d.completed||0}}}_placementBucket(e,r){
const n=String(r||"unknown");return e[n]||(e[n]=rD()),e[n]}_normalizeTaskPlacement(e={},{runtime:r="unknown",taskFamily:n="\
unknown"}={}){const s=e.placementHint||e.placement||e.data?.placementHint||e.data?.placement||e.data?.solver?.placementHint||
null,i=s?.recommendedPlacement||s?.requestedPlacement||s?.placement||"local",o=["local","peer","cluster"].includes(String(
i).trim().toLowerCase())?String(i).trim().toLowerCase():"local";return{schema:ny,source:s?"task-placement-hint-v0":"defa\
ult-local",advisoryOnly:s?.advisoryOnly!==!1,requestedPlacement:o,recommendedPlacement:o,actualPlacement:null,solverKey:s?.
solverKey||e.solverId||e.data?.solver?.id||null,solverId:s?.solverId||e.solverId||e.data?.solver?.id||null,taskFamily:n,
runtime:r,syncMode:s?.syncMode||null,timeoutMs:xe(s?.timeoutMs,this.placementTimeoutMs,0,36e5),confidence:Number.isFinite(
Number(s?.confidence))?Number(s.confidence):null,targetReplicaCount:xe(s?.targetReplicaCount,0,0,1e6),peerId:s?.peerId||
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
stats.taskPlacement;if(!l||!d)return;const u=l.requestedPlacement||"local",h=String(n||"unknown"),p=h.startsWith("remote\
-")?h:h==="worker"?"local-worker":h==="inline"?"local-inline":`local-${h}`;r?d.totalCompleted+=1:d.totalFailed+=1,p.startsWith(
"remote-")&&(r?d.remoteExecuted+=1:(d.remoteFailed+=1,s==="timeout"&&(d.remoteTimedOut+=1),s==="rejected"&&(d.remoteRejected+=
1),s==="verification-failed"&&(d.remoteVerificationFailed+=1),s==="validation-failed"&&(d.remoteValidationFailed+=1),c?.
exhausted&&(d.remoteRetryExhausted+=1)));const m=this._placementBucket(d.byRecommendedPlacement,u),b=this._placementBucket(
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
runtime||e.payload?.runtime||"unknown",d=this._runtimeStats(l),u=e.taskFamily||e.payload?.taskFamily||"unknown",h=this._taskFamilyStats(
u),p=Or(),m=Math.max(0,p-(e.submittedAt||e.startedAt||p)),b=Math.max(0,p-(e.startedAt||e.submittedAt||p));r?(this.stats.
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
h.maxDurationMs=Math.max(h.maxDurationMs,h.lastDurationMs);const f=h.completed+h.failed;h.averageDurationMs=f>0?Number((h.
totalDurationMs/f).toFixed(3)):0,this._recordExecutorCompletion(e,{ok:r,durationMs:b}),this._recordPlacementCompletion(e,
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
const n=xe(r,0,0,6e5);if(n<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+n;return s>=this.workerAutoScaleHoldUntil&&
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
payload,n=e.gpuResidentLaneLease;if(!n)return r;const s=Object.freeze({schema:bL,authoritative:!0,leaseId:n.leaseId,laneId:n.
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
return!1}if(!i){const c=new Set(this.workerAffinities.values()),l=new Set([...this.residentWorkerAffinities].map(u=>this.
workerAffinities.get(u))),d=s.filter(u=>!n.has(u)&&!l.has(u));i=d.find(u=>!c.has(u))||d[0],i&&r&&this.workerAffinities.set(
r,i)}if(!i)return!1;clearTimeout(e.control?.bootstrapTimer);const o=this._workerId(i)||"worker-unknown",a={...e,worker:i,
workerId:o,startedAt:Or(),executionMode:"worker"};this._recordExecutorStart(o,a,{kind:"worker"}),this.activeTasks.set(e.
id,a);try{i.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(c){this._handleWorkerFailure(i,c)}
return!0}_buildTaskExecutionReport(e,{mode:r=null,result:n=null}={}){const s=r||e.executionMode||null,i=e.runtime||e.payload?.
runtime||null,o=e.taskFamily||e.payload?.taskFamily||null,a=e.id||e.payload?.id||null,c=n&&typeof n=="object"?n:{},l=Ec(
c.gpuFence||c.gpuFenceReport,e.payload?.gpuFence||null)||e.gpuResidentLaneExecution?.gpuFence||null,d=e.executorId||(s===
"inline"||s==="inline-fallback"?this.inlineExecutorId:null),u=s==="worker"&&(e.workerId||e.executorId)||null;return{schema:OL,
taskId:a,runtime:i,taskFamily:o,executionMode:s,executorId:d,workerId:u,gpuFenceRequirement:e.payload?.gpuFence||null,gpuFence:l,
gpuFenceStatus:l?.status??null,gpuFenceSatisfied:l?.fenceSatisfied??!1,gpuResidentLaneRequirement:e.payload?.gpuResidentLane||
null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,r,{
mode:n=null}={}){if(r.payload?.returnEnvelope!==!0)return e;const s=this._buildTaskExecutionReport(r,{mode:n,result:e});
if(e&&typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==
null&&s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
if(e.payload?.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohibited for this task"));return}
e.startedAt=Or(),e.executionMode||="inline",this._recordExecutorStart(this.inlineExecutorId,e,{kind:"inline"});try{this.
_acquireTaskGpuResidentLaneLease(e);const r=await aL(this._taskPayloadWithGpuResidentLaneLeaseIdentity(e)),n=this._completeTaskGpuResidentLaneLease(
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
workers.length;if(this.destroying||!this.initialized||!this._supportsWorkers())return this.workers.length;const r=xe(this.
targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);if(r<=this.workers.length)return this.
workers.length;const n=this.targetWorkerCount,s=this.workers.length;for(;this.workers.length<r&&this._spawnWorker(););return this.
workers.length!==s&&this._recordWorkerResize({reason:e,previousTargetWorkers:n,previousWorkerCount:s}),this.workers.length}}
function Ii(t){t?.throwIfAborted()}function ly(t,e){return e?(Ii(e),new Promise((r,n)=>{const s=()=>n(e.reason);e.addEventListener(
"abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.removeEventListener("abort",s))})):t}class gD{constructor({
artifactStore:e,createService:r,maximumResidents:n=8}={}){if(!e?.acquireUse||!e.getManifest||typeof r!="function")throw new TypeError(
"Resident models require artifact use leases and a managed service factory");if(!Number.isInteger(n)||n<1||n>8)throw new RangeError(
"Invalid resident model limit");this.store=e,this.createService=r,this.maximumResidents=n,this.entries=new Map,this.closed=
!1,this.controller=new AbortController}getService(e){return this.entries.get(e)?.service??null}list(){return[...this.entries.
values()].map(e=>({manifest:e.manifest,runtimeOptions:structuredClone(e.options),...e.service?.getStatus(),manifestCid:e.
cid,status:e.unloading?"unloading":e.loading?"loading":e.service?.getStatus().status??"loading"}))}load(e,{signal:r,onProgress:n,
runtimeOptions:s={}}={}){if(this.closed)return Promise.reject(new Error("Resident model registry is closed"));const i=Je(
e).toString(),o=this.entries.get(i);if(o)return JSON.stringify(o.options)!==JSON.stringify(s)?Promise.reject(new Error("\
Unload this model before changing its runtime options")):o.unloading?Promise.reject(new Error("This model is unloading")):
o.loading?ly(o.loading,r):o.service.getStatus().status==="ready"?ly(Promise.resolve(o.result),r):Promise.reject(new Error(
"This resident model needs acknowledged cleanup before reloading"));if(this.entries.size>=this.maximumResidents)return Promise.
reject(new Error("Resident model capacity exceeded; unload a model first"));Ii(r);const a=new AbortController,c=AbortSignal.
any([a.signal,this.controller.signal,...r?[r]:[]]),l={cid:i,options:structuredClone(s),controller:a,service:null,releaseUse:null,
loading:null};this.entries.set(i,l);const d=async()=>{try{return l.releaseUse=await this.store.acquireUse(i,{signal:c}),
Ii(c),l.manifest=await this.store.getManifest(i,{signal:c}),Ii(c),l.service=await this.createService({manifestCid:i,manifest:l.
manifest,runtimeOptions:l.options}),Ii(c),l.result=await l.service.loadModel({manifestCid:i,signal:c,onProgress:n}),Ii(c),
l.result}catch(u){try{await this._release(l)}catch(h){throw new AggregateError([u,h],"Model load failed and cleanup is i\
ncomplete")}throw u}finally{l.loading=null}};return l.loading=d(),l.loading}async _release(e){await e.service?.dispose(),
await e.releaseUse?.(),e.releaseUse=null,this.entries.get(e.cid)===e&&this.entries.delete(e.cid)}async unload(e){if(e===
void 0){const i=(await Promise.allSettled([...this.entries.keys()].map(o=>this.unload(o)))).filter(o=>o.status==="reject\
ed").map(o=>o.reason);if(i.length)throw new AggregateError(i,"Some resident models could not finish cleanup");return{status:"\
unloaded"}}const r=this.entries.get(Je(e).toString());if(!r)return{status:"absent"};if(r.unloading)return r.unloading;const n=(async()=>(r.
controller.abort(new DOMException("Model is unloading","AbortError")),await r.loading?.catch(()=>{}),this.entries.get(r.
cid)===r&&await this._release(r),{manifestCid:r.cid,status:"unloaded"}))();r.unloading=n;try{return await n}finally{r.unloading=
null}}async dispose(){return this.closed=!0,this.controller.abort(new DOMException("Resident registry closed","AbortErro\
r")),this.unload()}}const B1=t=>(t&&typeof t=="object"&&(Object.values(t).forEach(B1),Object.freeze(t)),t),ti=B1({"moons\
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
2f0b435b322169cd75157e053493d967d17f"}],totalBytes:262829688}});function bD(t,e){const r=ti[t?.id];if(!r||r.repository!==
t.repository||r.revision!==t.revision||!r.files.some(n=>n.path===e.path&&n.size===e.size&&n.sha256===e.sha256))throw new Error(
"Untrusted speech source file");return`https://huggingface.co/${r.repository}/resolve/${r.revision}/${e.path}`}function L1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&L1(e);return Object.freeze(t)}const yD=L1({"nemotron-3-nano-4b-q4":{
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
0be4398bd63f5457"},{path:"vocab.json",size:800662,gitBlobSha1:"0ad5ecc2035b7031b88afb544ee95e2d49baa484"}]}});function D1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&D1(e);return Object.freeze(t)}const Md=D1({...yD,"qwen3-0.6b-q4":{
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
g.json",size:10069,gitBlobSha1:"1a7a8b42ef296f48ac686bab602f518da32dd85c"}]}});function wD(t,e){const r=Md[t];if(!r||!r.
files.some(s=>s.path===e))throw new Error("Unknown catalog model file");const n=e.split("/").map(encodeURIComponent).join(
"/");return`https://huggingface.co/${r.repository}/resolve/${r.revision}/${n}`}const Ro="Tsotchke-Corporation/Qwen3.8-27\
B-GeoRefine-D14-abl-GGUF",To="5ce3fd841676adf2c1a10d7193637d46007e88f7",dy=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],vD="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function $1(t){
for(const e of Object.values(t))e&&typeof e=="object"&&$1(e);return Object.freeze(t)}const Qp=$1({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ro,revision:To,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:vD},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ro}/blob/${To}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ro,revision:To,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ro}/blob/${To}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ro,revision:To},weightBytes:14199740480,
totalBytes:dy.reduce((t,e)=>t+e.size,0),files:dy}});function ED(t,e){const r=Qp[t];if(!r||!r.files.some(s=>s.path===e))throw new Error(
"Unknown catalog artifact model file.");const n=e.split("/").map(encodeURIComponent).join("/");return`https://huggingfac\
e.co/${r.repository}/resolve/${r.revision}/${n}`}function N1(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(N1),Object.freeze(t)),t}const kD=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],xD=N1(Object.fromEntries(kD.map(t=>{const{dtype:e,sourceModel:r,blockCount:n,nextnPredictLayers:s,...i}=t,
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
files.reduce((c,l)=>c+l.size,0)}]})));function Jp(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.values(t).
forEach(Jp),Object.freeze(t)),t}const Hn="Tsotchke-Corporation",P1=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
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
06e0df3640f9ae04fff09706ef"}]}],SD=Jp(Object.fromEntries(P1.map(t=>{const{architecture:e,quantizationTypes:r,sourceModel:n,
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
reduce((o,a)=>o+a.size,0)}]})));Jp({organization:Hn,sourceUrl:`https://huggingface.co/${Hn}`,checkedAt:"2026-11-04",repositories:[
...P1.map(({id:t,repository:e,revision:r})=>({repository:e,revision:r,catalogId:t,format:"GGUF",codecRequired:!1})),{repository:`${Hn}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Hn}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Hn}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${Hn}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Mo="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Bo="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Ku=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],wh=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function O1(t){return t&&typeof t=="object"&&!Object.isFrozen(t)&&(Object.
values(t).forEach(O1),Object.freeze(t)),t}const AD=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:t,...e})=>[e.id,O1({...e,
status:"execution-candidate",format:"GGUF",capabilities:wh,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:t,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((r,n)=>r+n.size,0)})])),Ji=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Mo,revision:Bo,status:"ex\
ecution-candidate",format:"GGUF",capabilities:wh,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Mo}/blob\
/${Bo}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Mo,
revision:Bo,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Mo}/blob/${Bo}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Mo,revision:Bo},weightBytes:Ku[0].size,totalBytes:Ku.reduce((t,e)=>t+e.size,0),files:Ku},
...AD,...xD,...SD,...Object.fromEntries(Object.entries(Qp).map(([t,e])=>[t,{...e,status:"execution-candidate",capabilities:wh}]))});
function ID(t,e){const r=Ji[t],n=r?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog GGUF model file.");
const s=n.source??{repository:r.repository,revision:r.revision,path:e};return`https://huggingface.co/${s.repository}/res\
olve/${s.revision}/${s.path.split("/").map(encodeURIComponent).join("/")}`}function U1(t){return t&&typeof t=="object"&&
!Object.isFrozen(t)&&(Object.values(t).forEach(U1),Object.freeze(t)),t}const _D=[{id:"sd-turbo-onnx",name:"Stable Diffus\
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
Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"}}],Ja=U1(Object.fromEntries(_D.map(t=>[
t.id,{...t,status:"execution-candidate",format:"ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires hardware WebGPU with shader-f16 and an \
admitted managed ONNX diffusion worker. Device execution must be verified."},provenance:{...t.provenance,repository:t.repository,
revision:t.revision,format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${t.repository}/bl\
ob/${t.revision}/README.md`,fileSources:Object.fromEntries(t.files.map(e=>[e.path,e.source]))},model:{runtime:"onnx-diff\
usion",runtimeVersion:"1.31.1",architecture:t.architecture,format:"ONNX",task:"text-to-image",pipeline:t.pipeline,dtype:t.
dtype,...t.weightQuantization?{weightQuantization:t.weightQuantization}:{},modalities:["text"],outputModalities:["image"],
requiredFeatures:["shader-f16"],width:512,height:512,steps:t.steps,padTokenId:t.padTokenId,repository:t.repository,revision:t.
revision},weightBytes:t.files.filter(e=>e.path.endsWith(".onnx")).reduce((e,r)=>e+r.size,0),totalBytes:t.files.reduce((e,r)=>e+
r.size,0)}])));function CD(t,e){const n=Ja[t]?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog diffusio\
n model file.");const s=n.source;return`https://huggingface.co/${s.repository}/resolve/${s.revision}/${s.path.split("/").
map(encodeURIComponent).join("/")}`}/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */function RD(t){
return t instanceof Uint8Array||ArrayBuffer.isView(t)&&t.constructor.name==="Uint8Array"}function uy(t,e=""){if(!Number.
isSafeInteger(t)||t<0){const r=e&&`"${e}" `;throw new Error(`${r}expected integer >= 0, got ${t}`)}}function Xa(t,e,r=""){
const n=RD(t),s=t?.length,i=e!==void 0;if(!n||i&&s!==e){const o=r&&`"${r}" `,a=i?` of length ${e}`:"",c=n?`length=${s}`:
`type=${typeof t}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return t}function jO(t){if(typeof t!="function"||
typeof t.create!="function")throw new Error("Hash must wrapped by utils.createHasher");uy(t.outputLen),uy(t.blockLen)}function fy(t,e=!0){
if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has a\
lready been called")}function TD(t,e){Xa(t,void 0,"digestInto() output");const r=e.outputLen;if(t.length<r)throw new Error(
'"digestInto() output" expected to be of length >='+r)}function li(...t){for(let e=0;e<t.length;e++)t[e].fill(0)}function Qu(t){
return new DataView(t.buffer,t.byteOffset,t.byteLength)}function An(t,e){return t<<32-e|t>>>e}function Ju(t,e){return t<<
e|t>>>32-e>>>0}const F1=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",MD=Array.from(
{length:256},(t,e)=>e.toString(16).padStart(2,"0"));function La(t){if(Xa(t),F1)return t.toHex();let e="";for(let r=0;r<t.
length;r++)e+=MD[t[r]];return e}const zn={_0:48,_9:57,A:65,F:70,a:97,f:102};function hy(t){if(t>=zn._0&&t<=zn._9)return t-
zn._0;if(t>=zn.A&&t<=zn.F)return t-(zn.A-10);if(t>=zn.a&&t<=zn.f)return t-(zn.a-10)}function GO(t){if(typeof t!="string")
throw new Error("hex string expected, got "+typeof t);if(F1)return Uint8Array.fromHex(t);const e=t.length,r=e/2;if(e%2)throw new Error(
"hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(r);for(let s=0,i=0;s<r;s++,i+=2){const o=hy(
t.charCodeAt(i)),a=hy(t.charCodeAt(i+1));if(o===void 0||a===void 0){const c=t[i]+t[i+1];throw new Error('hex string expe\
cted, got non-hex character "'+c+'" at index '+i)}n[s]=o*16+a}return n}const BD=async()=>{};async function WO(t,e,r){let n=Date.
now();for(let s=0;s<t;s++){r(s);const i=Date.now()-n;i>=0&&i<e||(await BD(),n+=i)}}function LD(t){if(typeof t!="string")
throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(t))}function HO(t,e=""){return typeof t==
"string"?LD(t):Xa(t,void 0,e)}function VO(...t){let e=0;for(let n=0;n<t.length;n++){const s=t[n];Xa(s),e+=s.length}const r=new Uint8Array(
e);for(let n=0,s=0;n<t.length;n++){const i=t[n];r.set(i,s),s+=i.length}return r}function KO(t,e){if(e!==void 0&&{}.toString.
call(e)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(t,e)}function Xp(t,e={}){
const r=(s,i)=>t(i).update(s).digest(),n=t(void 0);return r.outputLen=n.outputLen,r.blockLen=n.blockLen,r.create=s=>t(s),
Object.assign(r,e),Object.freeze(r)}function QO(t=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.
getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(
t))}const z1=t=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,t])});function q1(t,e,r){return t&e^~t&r}function j1(t,e,r){
return t&e^t&r^e&r}class Yp{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,r,n,s){
this.blockLen=e,this.outputLen=r,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=Qu(this.buffer)}update(e){
fy(this),Xa(e);const{view:r,buffer:n,blockLen:s}=this,i=e.length;for(let o=0;o<i;){const a=Math.min(s-this.pos,i-o);if(a===
s){const c=Qu(e);for(;s<=i-o;o+=s)this.process(c,o);continue}n.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===
s&&(this.process(r,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){fy(this),TD(e,this),
this.finished=!0;const{buffer:r,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;r[o++]=128,li(this.buffer.subarray(o)),this.
padOffset>s-o&&(this.process(n,0),o=0);for(let u=o;u<s;u++)r[u]=0;n.setBigUint64(s-8,BigInt(this.length*8),i),this.process(
n,0);const a=Qu(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,d=this.
get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)a.setUint32(4*u,d[u],i)}digest(){
const{buffer:e,outputLen:r}=this;this.digestInto(e);const n=e.slice(0,r);return this.destroy(),n}_cloneInto(e){e||=new this.
constructor,e.set(...this.get());const{blockLen:r,buffer:n,length:s,finished:i,destroyed:o,pos:a}=this;return e.destroyed=
o,e.finished=i,e.length=s,e.pos=a,s%r&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const ps=Uint32Array.from([1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),sr=Uint32Array.from([1779033703,4089235720,
3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,
1541459225,327033209]),kc=BigInt(2**32-1),py=BigInt(32);function DD(t,e=!1){return e?{h:Number(t&kc),l:Number(t>>py&kc)}:
{h:Number(t>>py&kc)|0,l:Number(t&kc)|0}}function $D(t,e=!1){const r=t.length;let n=new Uint32Array(r),s=new Uint32Array(
r);for(let i=0;i<r;i++){const{h:o,l:a}=DD(t[i],e);[n[i],s[i]]=[o,a]}return[n,s]}const my=(t,e,r)=>t>>>r,gy=(t,e,r)=>t<<32-
r|e>>>r,Si=(t,e,r)=>t>>>r|e<<32-r,Ai=(t,e,r)=>t<<32-r|e>>>r,xc=(t,e,r)=>t<<64-r|e>>>r-32,Sc=(t,e,r)=>t>>>r-32|e<<64-r;function qn(t,e,r,n){
const s=(e>>>0)+(n>>>0);return{h:t+r+(s/2**32|0)|0,l:s|0}}const ND=(t,e,r)=>(t>>>0)+(e>>>0)+(r>>>0),PD=(t,e,r,n)=>e+r+n+
(t/2**32|0)|0,OD=(t,e,r,n)=>(t>>>0)+(e>>>0)+(r>>>0)+(n>>>0),UD=(t,e,r,n,s)=>e+r+n+s+(t/2**32|0)|0,FD=(t,e,r,n,s)=>(t>>>0)+
(e>>>0)+(r>>>0)+(n>>>0)+(s>>>0),zD=(t,e,r,n,s,i)=>e+r+n+s+i+(t/2**32|0)|0,qD=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),ms=new Uint32Array(64);class jD extends Yp{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:r,C:n,D:s,E:i,
F:o,G:a,H:c}=this;return[e,r,n,s,i,o,a,c]}set(e,r,n,s,i,o,a,c){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=i|0,this.
F=o|0,this.G=a|0,this.H=c|0}process(e,r){for(let u=0;u<16;u++,r+=4)ms[u]=e.getUint32(r,!1);for(let u=16;u<64;u++){const h=ms[u-
15],p=ms[u-2],m=An(h,7)^An(h,18)^h>>>3,b=An(p,17)^An(p,19)^p>>>10;ms[u]=b+ms[u-7]+m+ms[u-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:d}=this;for(let u=0;u<64;u++){const h=An(a,6)^An(a,11)^An(a,25),p=d+h+q1(a,c,l)+qD[u]+ms[u]|0,b=(An(n,2)^An(n,13)^
An(n,22))+j1(n,s,i)|0;d=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+b|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(n,s,i,o,a,c,l,d)}roundClean(){li(ms)}destroy(){this.set(0,0,0,0,0,0,
0,0),li(this.buffer)}}class GD extends jD{A=ps[0]|0;B=ps[1]|0;C=ps[2]|0;D=ps[3]|0;E=ps[4]|0;F=ps[5]|0;G=ps[6]|0;H=ps[7]|
0;constructor(){super(32)}}const G1=$D(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189db\
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
5fcb6fab3ad6faec","0x6c44198c4a475817"].map(t=>BigInt(t))),WD=G1[0],HD=G1[1],gs=new Uint32Array(80),bs=new Uint32Array(80);
class VD extends Yp{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:r,Bh:n,Bl:s,Ch:i,Cl:o,Dh:a,Dl:c,Eh:l,El:d,Fh:u,
Fl:h,Gh:p,Gl:m,Hh:b,Hl:g}=this;return[e,r,n,s,i,o,a,c,l,d,u,h,p,m,b,g]}set(e,r,n,s,i,o,a,c,l,d,u,h,p,m,b,g){this.Ah=e|0,
this.Al=r|0,this.Bh=n|0,this.Bl=s|0,this.Ch=i|0,this.Cl=o|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=d|0,this.Fh=u|0,
this.Fl=h|0,this.Gh=p|0,this.Gl=m|0,this.Hh=b|0,this.Hl=g|0}process(e,r){for(let E=0;E<16;E++,r+=4)gs[E]=e.getUint32(r),
bs[E]=e.getUint32(r+=4);for(let E=16;E<80;E++){const k=gs[E-15]|0,x=bs[E-15]|0,S=Si(k,x,1)^Si(k,x,8)^my(k,x,7),v=Ai(k,x,
1)^Ai(k,x,8)^gy(k,x,7),w=gs[E-2]|0,I=bs[E-2]|0,C=Si(w,I,19)^xc(w,I,61)^my(w,I,6),R=Ai(w,I,19)^Sc(w,I,61)^gy(w,I,6),N=OD(
v,R,bs[E-7],bs[E-16]),D=UD(N,S,C,gs[E-7],gs[E-16]);gs[E]=D|0,bs[E]=N|0}let{Ah:n,Al:s,Bh:i,Bl:o,Ch:a,Cl:c,Dh:l,Dl:d,Eh:u,
El:h,Fh:p,Fl:m,Gh:b,Gl:g,Hh:f,Hl:y}=this;for(let E=0;E<80;E++){const k=Si(u,h,14)^Si(u,h,18)^xc(u,h,41),x=Ai(u,h,14)^Ai(
u,h,18)^Sc(u,h,41),S=u&p^~u&b,v=h&m^~h&g,w=FD(y,x,v,HD[E],bs[E]),I=zD(w,f,k,S,WD[E],gs[E]),C=w|0,R=Si(n,s,28)^xc(n,s,34)^
xc(n,s,39),N=Ai(n,s,28)^Sc(n,s,34)^Sc(n,s,39),D=n&i^n&a^i&a,P=s&o^s&c^o&c;f=b|0,y=g|0,b=p|0,g=m|0,p=u|0,m=h|0,{h:u,l:h}=
qn(l|0,d|0,I|0,C|0),l=a|0,d=c|0,a=i|0,c=o|0,i=n|0,o=s|0;const j=ND(C,N,P);n=PD(j,I,R,D),s=j|0}({h:n,l:s}=qn(this.Ah|0,this.
Al|0,n|0,s|0)),{h:i,l:o}=qn(this.Bh|0,this.Bl|0,i|0,o|0),{h:a,l:c}=qn(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:d}=qn(this.Dh|
0,this.Dl|0,l|0,d|0),{h:u,l:h}=qn(this.Eh|0,this.El|0,u|0,h|0),{h:p,l:m}=qn(this.Fh|0,this.Fl|0,p|0,m|0),{h:b,l:g}=qn(this.
Gh|0,this.Gl|0,b|0,g|0),{h:f,l:y}=qn(this.Hh|0,this.Hl|0,f|0,y|0),this.set(n,s,i,o,a,c,l,d,u,h,p,m,b,g,f,y)}roundClean(){
li(gs,bs)}destroy(){li(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class KD extends VD{Ah=sr[0]|0;Al=sr[1]|0;Bh=sr[2]|
0;Bl=sr[3]|0;Ch=sr[4]|0;Cl=sr[5]|0;Dh=sr[6]|0;Dl=sr[7]|0;Eh=sr[8]|0;El=sr[9]|0;Fh=sr[10]|0;Fl=sr[11]|0;Gh=sr[12]|0;Gl=sr[13]|
0;Hh=sr[14]|0;Hl=sr[15]|0;constructor(){super(64)}}const Zp=Xp(()=>new GD,z1(1)),JO=Xp(()=>new KD,z1(3)),ql=1024**3,Qn=Object.
freeze({maximumBytes:8*ql,maximumFileBytes:2*ql-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*
1024**2}),W1=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),QD=["qwen2","qwen3","llama"],by=["phi","phi3","gemma","gem\
ma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2","nemotron_h"],yy=["idefics3","smolvlm","qwe\
n3_5"],JD=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","phi3","phi2","granite","starcoder2","olmo","olmo2",
"stablelm","nemotron","smollm3"],H1=Object.freeze([...[...QD,...by,...yy].map(t=>{const e=yy.includes(t);return Object.freeze(
{runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:t,task:e?"image-text-to-text":"text-generation",qualification:"\
candidate",modalities:Object.freeze(e?["text","image"]:["text"]),modules:Object.freeze(e?["embed_tokens","vision_encoder",
"decoder_model_merged"]:["model"]),dtypes:t==="qwen3_5"?Object.freeze(["q4"]):W1,requiresMemoryProfile:by.includes(t),contextTokens:2048,
maximumBytes:e?t==="qwen3_5"?2*ql:Qn.legacyMaximumBytes:Qn.maximumBytes,maximumFileBytes:Qn.maximumFileBytes})}),...JD.map(
t=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:t,modelArchitecture:t==="qwen35"?"qwen3_5":t,task:"\
text-generation",modalities:Object.freeze(["text"]),qualification:"candidate"}))]);function Ya(t,e){return H1.find(r=>r.
runtime===t&&r.architecture===e)??null}function XD(t){return H1.filter(e=>e.runtime===t)}const YD=t=>t==="fp32"?"":t==="\
q8"?"_quantized":`_${t}`;function V1(t){const e=typeof t=="string"?[t]:t&&typeof t=="object"&&!Array.isArray(t)?Object.values(
t):[];if(!e.length||e.length>16||e.some(r=>!W1.includes(r)))throw new Error("Unsupported ONNX precision");return e}function em(t){
const e=t?.["transformers.js_config"]??{},r=e.device_config??{};return Object.hasOwn(r,"webgpu")?{...e,...r.webgpu}:{...e}}
function K1(t,e={}){const r=V1(t),n=em(e).kv_cache_dtype;return r.some(i=>["fp16","q4f16"].includes(i)||(typeof n=="stri\
ng"?n:n?.[i])==="float16")?["shader-f16"]:[]}function ZD(t,e,r,n){if(V1(n),typeof n!="string"||!/^[A-Za-z0-9_-]{1,100}$/.
test(r))throw new Error("Invalid ONNX module");const s=e==="qwen3_5"&&n==="q4"?1:em(t).use_external_data_format,i=`${r}${YD(
n)}.onnx`,o=s&&typeof s=="object"?s[i]??s[r]??0:s??0;if(!(typeof o=="boolean"||Number.isSafeInteger(o)&&o>=0&&o<=32))throw new Error(
"Unsupported external-data chunk configuration");return Array.from({length:Number(o)},(a,c)=>`onnx/${i}_data${c?`_${c}`:
""}`)}function Fr(t,e,r=1048576,n=1){if(!Number.isSafeInteger(t)||t<n||t>r)throw new Error(`Invalid model memory dimensi\
on: ${e}`);return t}function Q1(t){const e=em(t).free_dimension_overrides;if(e&&(typeof e!="object"||Array.isArray(e)||Object.
keys(e).length))throw new Error("Dynamic ONNX free_dimension_overrides are not admitted by this memory profile");const r=t?.
model_type,n=Ya("transformers.js",r);if(!n)throw new Error("Unsupported model memory architecture");const s=n.task==="im\
age-text-to-text"?t.text_config??t:t,i=s.layer_types??s.layers_block_type,o=Fr(s.num_hidden_layers??i?.length,"layers",512),
a=Fr(s.hidden_size,"hidden size",65536),c=Fr(s.num_attention_heads,"attention heads",1024),l=Fr(s.num_key_value_heads??c,
"KV heads",1024),d=Fr(s.head_dim??a/c,"head dimension",4096),u=Fr(s.vocab_size??t.vocab_size,"vocabulary");if(i!==void 0&&
(!Array.isArray(i)||i.length!==o||i.some(E=>!["attention","mamba","mlp","moe","full_attention","sliding_attention","line\
ar_attention"].includes(E))))throw new Error("Invalid model memory layer types");let h=o,p=0,m=0,b=0,g=0,f=0,y=0;if(r===
"nemotron_h"){if(!i)throw new Error("Nemotron requires explicit recurrent layer types");if(h=i.filter(k=>k==="attention").
length,p=i.filter(k=>k==="mamba").length,i.some(k=>!["attention","mamba","mlp","moe"].includes(k)))throw new Error("Unsu\
pported Nemotron layer type");g=Fr(s.mamba_num_heads,"SSM heads",1024),f=Fr(s.mamba_head_dim,"SSM head dimension",4096),
y=Fr(s.ssm_state_size,"SSM state size",4096);const E=Fr(s.n_groups,"SSM groups",1024);b=Fr(s.conv_kernel,"convolution ke\
rnel",256),m=Fr(g*f+2*E*y,"convolution channels")}return Bd({schema:"peercompute.onnx.memory.v1",architecture:r,layers:o,
hiddenSize:a,heads:c,kvHeads:l,headDim:d,vocabulary:u,attentionLayers:h,recurrentLayers:p,convChannels:m,convKernel:b,ssmHeads:g,
ssmHeadDim:f,stateSize:y})}function Bd(t){const e=["schema","architecture","layers","hiddenSize","heads","kvHeads","head\
Dim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"];if(!t||
t.schema!=="peercompute.onnx.memory.v1"||!Ya("transformers.js",t.architecture)||Object.keys(t).some(n=>!e.includes(n)))throw new Error(
"Invalid model memory profile");for(const n of e.slice(2))Fr(t[n],n,1048576,["attentionLayers","recurrentLayers","convCh\
annels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(n)?0:1);if(t.layers>512||t.attentionLayers+t.recurrentLayers>
t.layers||t.kvHeads>t.heads||t.architecture!=="nemotron_h"&&t.recurrentLayers)throw new Error("Invalid model memory laye\
r geometry");const r=2*(2*t.attentionLayers*t.kvHeads*t.headDim*2048*4+t.recurrentLayers*(t.ssmHeads*t.ssmHeadDim*t.stateSize+
t.convChannels*t.convKernel)*4);if(!Number.isSafeInteger(r)||r>16*ql)throw new Error("Model cache/state exceeds its boun\
ded memory envelope");return Object.fromEntries(e.map(n=>[n,t[n]]))}function e$(t){const e=Bd(t);return 2*(2*e.attentionLayers*
e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4)}function J1(t,e){
if(e?.model_type!==t.architecture)throw new Error("Model config architecture does not match its admitted manifest");if(e.
auto_map&&Object.keys(e.auto_map).length)throw new Error("Custom model code is not admitted");if(t.memoryProfile&&JSON.stringify(
Bd(t.memoryProfile))!==JSON.stringify(Q1(e)))throw new Error("Model memory profile differs from its verified config");return K1(
t.dtype,e)}const wy="transformers.js",Ld="4.3.2",Se=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:Qn.
maximumBytes,maxFileBytes:Qn.maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*
1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),t$=Object.
freeze({maxModelBytes:2*1024**3,maxFileBytes:Se.maxFileBytes,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*
512}),X1=Object.freeze({maxModelBytes:Se.maxModelBytes,maxFileBytes:Se.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,
maxProcessedImagePixels:Se.maxImagePixels}),r$=Object.freeze({...X1,maxModelBytes:Qn.legacyMaximumBytes});function Za(t,{
files:e,totalBytes:r,config:n}={}){const s=t?.architecture==="qwen3_5"?t$:["idefics3","smolvlm"].includes(t?.architecture)?
r$:X1;if(n&&J1(t,n),e){r=0;for(const l of e){if(!Number.isSafeInteger(l.size)||l.size<0)throw new Error("Invalid model f\
ile size");if(l.size>Se.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONN\
X file must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});r+=l.size}}if(r!==void 0&&(!Number.isSafeInteger(
r)||r<0||r>s.maxModelBytes))throw Object.assign(new Error(`Model exceeds its admitted file budget of ${s.maxModelBytes/1024**
3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const i=t?.memoryProfile&&Bd(t.memoryProfile);if(i&&i.architecture!==t.architecture)
throw new Error("Model memory architecture mismatch");if(!i&&!(r>Qn.legacyMaximumBytes))return s;const o=r??0,a=i?e$(i):
0,c=1024**3;return{...s,minimumCpuBytes:Math.max(s.minimumCpuBytes,2*o+2*c+a),minimumGpuBytes:Math.max(s.minimumGpuBytes,
2*o+c+a),cacheBytes:a}}function vh(t="Operation cancelled"){return t?.name==="AbortError"?t:new DOMException(typeof t=="\
string"?t:"Operation cancelled","AbortError")}function Ut(t){if(t?.aborted)throw vh(t.reason)}function Ho(t){if(typeof t!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(t))throw new Error("Invalid model session ID");return t}function Da(t){if(typeof t!=
"string"||!t||new TextEncoder().encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("/")||t.split(
"/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return t}function Y1(t){let e;try{e=JSON.
stringify(t)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>Se.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const r=JSON.parse(e);if(r.schema!=="peercompute.artifact.\
manifest.v1"||!Array.isArray(r.files)||!r.files.length||r.files.length>Se.maxFiles)throw new Error("Invalid model manife\
st files");const n=new Set,s=Za(r.model,{files:r.files});let i=0;for(const u of r.files){if(Da(u.path),n.has(u.path))throw new Error(
"Duplicate model artifact path");n.add(u.path);const h=Vi.parse(u.cid);if(![85,112].includes(h.code)||h.multihash.code!==
18||h.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||
!/^[a-f0-9]{64}$/i.test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),
i+=u.size,!Number.isSafeInteger(i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=r.
model,a=Ya(wy,o?.architecture);if(o?.runtime!==wy||o.runtimeVersion!==Ld||!a)throw new Error("Model runtime, architectur\
e or dtype is not approved");if(o.task??=a.task,o.task!==a.task)throw new Error("Model task does not match its admitted \
architecture");if((a.requiresMemoryProfile||a.task==="text-generation"&&i>Qn.legacyMaximumBytes)&&!o.memoryProfile)throw new Error(
"This model requires a verified config memory profile");const c=typeof o.dtype=="string"?[["model",o.dtype]]:o.dtype&&typeof o.
dtype=="object"&&!Array.isArray(o.dtype)?Object.entries(o.dtype):[];if(!c.length||c.length>16||c.some(([u,h])=>!/^[A-Za-z0-9_-]{1,100}$/.
test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(h)))throw new Error("Invalid model dtype configuration");if(o.architecture===
"qwen3_5"&&c.some(([,u])=>u!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const l=u=>u==="fp3\
2"?"":u==="q8"?"_quantized":`_${u}`,d=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof o.dtype!="stri\
ng"||o.task==="text-generation")&&d.push(...c.map(([u,h])=>`onnx/${u}${l(h)}.onnx`)),o.task==="image-text-to-text")for(const u of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const h=typeof o.dtype=="string"?o.dtype:o.dtype[u];if(!h)throw new Error(
"Multimodal dtype configuration is missing a module");d.push(`onnx/${u}${l(h)}.onnx`),o.architecture==="qwen3_5"&&d.push(
`onnx/${u}${l(h)}.onnx_data`)}if(d.some(u=>!n.has(u)))throw new Error("Incomplete model package");if(o.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(o.requiredFeatures!==void 0&&(!Array.isArray(o.requiredFeatures)||o.requiredFeatures.length>
32||o.requiredFeatures.some(u=>typeof u!="string"||u.length>80)))throw new Error("Invalid model GPU features");return{manifest:r,
totalBytes:i,resourcePolicy:s}}function Z1(t,e){const r=new URL(e),n={};for(const s of["mjs","wasm"]){if(typeof t?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(t[s],r);if(i.origin!==r.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const yt=Object.freeze({maximumBytes:16*1024**3,headerBytes:16*
1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,stringBytes:1024**2}),tm=Object.freeze(XD("lla\
ma.cpp").map(t=>t.architecture)),eE="peercompute.gguf.header.v1",n$="3.8.1",Eh=new Map([[0,["F32",1,4]],[1,["F16",1,2]],
[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,
["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",
256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],
[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),jl=new Map([[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_\
0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k\
_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,
"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),s$=new TextDecoder("utf-8",{fatal:!0}),i$=t=>Array.
from(t,e=>e.toString(16).padStart(2,"0")).join(""),Re=t=>new Error(`Unsupported GGUF Hub package: ${t}`);function kr(t,e,r,n=0){
if(!Number.isSafeInteger(t)||t<n||t>e)throw Re(`invalid ${r}`);return t}class o$ extends Error{constructor(){super("Trun\
cated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function tE(t,{size:e}={}){if(!(t instanceof Uint8Array))throw Re(
"header bytes required");if(kr(e,yt.maximumBytes,"file size",24),t.length>yt.headerBytes||t.length>e)throw Re("header by\
te budget exceeded");const r=new DataView(t.buffer,t.byteOffset,t.byteLength);let n=0;function s(v){if(kr(v,yt.headerBytes,
"header field length"),n+v>yt.headerBytes)throw Re("header byte budget exceeded");if(n+v>t.length)throw new o$;const w=n;
return n+=v,w}const i=()=>r.getUint32(s(4),!0),o=()=>{const v=r.getBigUint64(s(8),!0);if(v>BigInt(Number.MAX_SAFE_INTEGER))
throw Re("unsafe 64-bit value");return Number(v)};function a(v=yt.stringBytes,w=!0){const I=kr(o(),v,"string length"),C=s(
I);return w?s$.decode(t.subarray(C,C+I)):void 0}function c(v,w=!0,I=!1){if(v===8)return a(yt.stringBytes,w);if(v===9){if(I)
throw Re("nested metadata arrays");const D=i(),P=kr(o(),yt.arrayItems,"array count");if(D===9||D>12)throw Re("metadata a\
rray type");if(D===8)for(let j=0;j<P;j++)a(yt.stringBytes,!1);else s(P*[1,1,2,2,4,4,4,1,0,0,8,8,8][D]);return{array:!0,element:D,
count:P}}const C=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!C[v])throw Re("metadata value type");const R=s(C[v]);if(!w)return;if(v===
0)return r.getUint8(R);if(v===1)return r.getInt8(R);if(v===2)return r.getUint16(R,!0);if(v===3)return r.getInt16(R,!0);if(v===
4)return r.getUint32(R,!0);if(v===5)return r.getInt32(R,!0);if(v===6)return r.getFloat32(R,!0);if(v===7){const D=r.getUint8(
R);if(D>1)throw Re("boolean value");return!!D}if(v===12)return r.getFloat64(R,!0);const N=v===10?r.getBigUint64(R,!0):r.
getBigInt64(R,!0);if(N>BigInt(Number.MAX_SAFE_INTEGER)||N<BigInt(Number.MIN_SAFE_INTEGER))throw Re("unsafe metadata inte\
ger");return Number(N)}if(i()!==1179993927)throw Re("magic or byte order");const l=i();if(![2,3].includes(l))throw Re("v\
ersion");const d=kr(o(),yt.tensors,"tensor count",1),u=kr(o(),yt.metadata,"metadata count",1),h=new Map;for(let v=0;v<u;v++){
const w=a(512);if(!w||h.has(w)||/[\u0000-\u001f\u007f]/u.test(w))throw Re("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.
test(w))throw Re("custom tensor layout requires catalog review");const I=i(),C=["general.architecture","general.type","g\
eneral.file_type","general.alignment","general.name","general.quantization_version","split.count","split.no","split.tens\
ors.count","tokenizer.ggml.model","tokenizer.ggml.tokens"].includes(w);h.set(w,c(I,C))}const p=h.get("general.architectu\
re");if(!tm.includes(p))throw Re("architecture");if(h.has("general.type")&&h.get("general.type")!=="model")throw Re("ada\
pter or non-model GGUF");if(/georefine/i.test(h.get("general.name")??""))throw Re("custom GeoRefine model requires catal\
og review");if((h.get("split.count")??1)!==1||(h.get("split.no")??0)!==0||(h.get("split.tensors.count")??d)!==d)throw Re(
"split GGUF requires complete shard admission");if(![void 0,2].includes(h.get("general.quantization_version")))throw Re(
"quantization version");const m=h.get("general.file_type");if(!jl.has(m))throw Re("file quantization type");if(!["llama",
"gpt2"].includes(h.get("tokenizer.ggml.model"))||h.get("tokenizer.ggml.tokens")?.element!==8||!h.get("tokenizer.ggml.tok\
ens")?.count)throw Re("self-contained supported tokenizer required");const b=kr(h.get("general.alignment")??32,4096,"ali\
gnment",1);if(b&b-1)throw Re("alignment must be a power of two");const g=new Set,f=new Set,y=[];let E=0;for(let v=0;v<d;v++){
const w=a(512);if(!w||g.has(w)||/georefine|[\u0000-\u001f\u007f]/iu.test(w))throw Re("duplicate or custom tensor name");
g.add(w);const I=kr(i(),4,"tensor dimensions",1);let C=1,R=0;for(let Z=0;Z<I;Z++){const X=kr(o(),yt.maximumBytes,"tensor\
 dimension",1);Z===0&&(R=X),C*=X,kr(C,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const N=i(),D=Eh.get(N);if(!D||R%
D[1])throw Re("unsupported tensor codec or quantized row shape");const P=kr(C/D[1]*D[2],e,"tensor bytes",1),j=o();if(j%b||
j+P>e)throw Re("tensor offset exceeds file or alignment");y.push({start:j,end:j+P}),f.add(N),E=Math.max(E,P)}if(!g.has("\
token_embd.weight")||!g.has("output_norm.weight"))throw Re("text model tensor layout");const k=n,x=Math.ceil(n/b)*b;y.sort(
(v,w)=>v.start-w.start);let S=0;for(const v of y){if(v.start<S||x+v.end>e)throw Re("overlapping or truncated tensor data");
S=v.end}return{schema:eE,version:l,architecture:p,fileType:m,dtype:jl.get(m),tensorCount:d,metadataCount:u,headerBytes:k,
dataOffset:x,maximumTensorBytes:E,tensorTypes:[...f].sort((v,w)=>v-w),headerSha256:i$(Ea(t.subarray(0,k)))}}async function rE({
readRange:t,size:e,signal:r}={}){if(typeof t!="function")throw Re("range reader required");kr(e,yt.maximumBytes,"file si\
ze",24);let n=new Uint8Array(0),s=Math.min(64*1024,e);for(;;){Ut(r);const i=new Uint8Array(s);i.set(n);for(let o=n.length;o<
s;){const a=Math.min(yt.rangeBytes,s-o),c=await t(o,a,{signal:r});if(Ut(r),!(c instanceof Uint8Array)||c.length!==a)throw Re(
"truncated range response");i.set(c,o),o+=a}n=i;try{return tE(n,{size:e})}catch(o){if(o.code!=="ERR_GGUF_HEADER_TRUNCATE\
D"||s===e)throw o;if(s===yt.headerBytes)throw Re("header exceeds bounded probe");s=Math.min(s*2,e,yt.headerBytes)}}}function a$(t){
if(!t||t.schema!==eE||![2,3].includes(t.version)||!tm.includes(t.architecture)||!jl.has(t.fileType)||jl.get(t.fileType)!==
t.dtype||!/^[a-f0-9]{64}$/.test(t.headerSha256??""))throw Re("header profile");for(const[r,n]of[["tensorCount",yt.tensors],
["metadataCount",yt.metadata],["headerBytes",yt.headerBytes],["dataOffset",yt.headerBytes+4096],["maximumTensorBytes",yt.
maximumBytes]])kr(t[r],n,r,1);if(t.dataOffset<t.headerBytes||!Array.isArray(t.tensorTypes)||!t.tensorTypes.length||t.tensorTypes.
length>Eh.size||t.tensorTypes.some((r,n)=>!Eh.has(r)||n>0&&r<=t.tensorTypes[n-1]))throw Re("tensor profile");const e=["s\
chema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerBytes","dataOffset","maximumTens\
orBytes","tensorTypes","headerSha256"];if(Object.keys(t).some(r=>!e.includes(r)))throw Re("unexpected header profile fie\
ld");return Object.fromEntries(e.map(r=>[r,t[r]]))}function nE({repository:t,revision:e,file:r,header:n}={}){if(typeof t!=
"string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(t)||!/^[a-f0-9]{40}$/.test(e??""))throw Re(
"immutable Hugging Face repository/revision required");if(Da(r?.path),!r.path.endsWith(".gguf")||!/^[a-f0-9]{64}$/.test(
r.sha256??""))throw Re("pinned GGUF SHA-256 required");kr(r.size,yt.maximumBytes,"weight size",24);const s=a$(n);if(s.dataOffset+
s.maximumTensorBytes>r.size)throw Re("header/file size mismatch");const i=r.size>4*1024**3;return{model:{runtime:"llama.\
cpp",runtimeVersion:n$,architecture:s.architecture==="qwen35"?"qwen3_5":s.architecture,format:"GGUF",task:"text-generati\
on",dtype:s.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:t,revision:e,gguf:{...s,path:r.path,size:r.
size,sha256:r.sha256}},weights:[r],totalBytes:r.size,resourcePolicy:{maxModelBytes:yt.maximumBytes,minimumCpuBytes:(i?8:
2)*1024**3,minimumGpuBytes:(i?16:2)*1024**3}}}function Dd(t,{files:e,totalBytes:r}={}){if(!t?.gguf)throw Re("bounded hea\
der profile required");const{path:n,size:s,sha256:i,...o}=t.gguf,a=nE({repository:t.repository,revision:t.revision,file:{
path:n,size:s,sha256:i},header:o});for(const c of["runtime","runtimeVersion","architecture","format","task","dtype"])if(t[c]!==
a.model[c])throw Re(`model ${c} disagrees with header`);if(JSON.stringify(t.modalities)!=='["text"]'||JSON.stringify(t.requiredFeatures)!==
'["shader-f16"]')throw Re("text-only/f16 capability profile required");if(e){const c=e.filter(l=>l.path.endsWith(".gguf"));
if(c.length!==1||c[0].path!==n||c[0].size!==s||c[0].sha256!==i||e.some(l=>!/^[a-f0-9]{64}$/.test(l.sha256??"")))throw Re(
"file closure/digest mismatch");a.weights=c,r=e.reduce((l,d)=>l+d.size,0)}return a.totalBytes=kr(r??s,yt.maximumBytes,"p\
ackage bytes",s),a}async function c$(t,e,r,{signal:n}={}){if(!t.gguf)return;const s=Dd(t,{files:e}).model.gguf,i=await rE(
{size:e[0].size,signal:n,readRange:(d,u,h)=>r.read(e[0].path,d,u,h)}),{path:o,size:a,sha256:c,...l}=s;if(JSON.stringify(
i)!==JSON.stringify(l))throw Re("stored header does not match inspected package")}const l$=Object.freeze(Object.defineProperty(
{__proto__:null,GGUF_HUB_ARCHITECTURES:tm,GGUF_HUB_LIMITS:yt,inspectGgufHeader:rE,parseGgufHeader:tE,resolveGgufHubProfile:nE,
validateGgufHubModel:Dd,verifyGgufHubWeights:c$},Symbol.toStringTag,{value:"Module"})),Zn=Object.freeze({sampleRate:16e3,
maxInputSeconds:20,maxOutputSeconds:30,maxTextBytes:1024,maxTextCharacters:256,maxTranscriptBytes:8192,residentBytes:1024**
3}),sE=(t,e)=>t&&e&&typeof t=="object"&&typeof e=="object"?Object.keys(t).length===Object.keys(e).length&&Object.keys(t).
every(r=>sE(t[r],e[r])):t===e;function rm(t){const e=as(t),r=Object.values(ti).find(n=>sE(n.model,e.model));if(!r||e.files.
length!==r.files.length)throw new Error("Speech package is outside the pinned catalog");for(const n of r.files){const s=e.
files.find(i=>i.path===n.path);if(!s||s.size!==n.size||s.sha256!==n.sha256)throw new Error("Speech file differs from its\
 pinned digest")}return{manifest:e,trusted:r,totalBytes:r.totalBytes,resourcePolicy:{minimumCpuBytes:Zn.residentBytes,minimumGpuBytes:Zn.
residentBytes,maxModelBytes:512*1024**2}}}function iE(t,e,r=Zn.maxInputSeconds){if(!(t instanceof Float32Array)||e!==Zn.
sampleRate||t.length<1600||t.length>e*r)throw new Error("Speech input requires 0.1–20 seconds of mono Float32 PCM at 160\
00 Hz");for(const n of t)if(!Number.isFinite(n)||Math.abs(n)>1.01)throw new Error("Invalid PCM sample");return{samples:t,
sampleRate:e}}function oE(t,e){const{trusted:r}=rm(e);if(t.image)throw new Error("Speech does not accept image inputs");
if(r.model.task==="automatic-speech-recognition"){if(t.prompt!=null||t.messages!=null)throw new Error("ASR accepts audio\
 only");return{task:r.model.task,audio:iE(t.audio?.samples,t.audio?.sampleRate)}}if(t.audio!=null||t.messages!=null||typeof t.
prompt!="string")throw new Error("TTS accepts one text prompt");const n=t.prompt.trim();if(!n||[...n].length>Zn.maxTextCharacters||
new TextEncoder().encode(n).length>Zn.maxTextBytes)throw new Error("Speak one short sentence at a time (maximum 256 char\
acters)");return{task:r.model.task,prompt:n}}const d$=Object.freeze({id:"transformers-speech",moduleUrl:"peercompute:spe\
ech-inference",acceptsAudio:!0,validateManifest:rm,validateRuntimeAssets:Z1,normalizeGenerationInput:oE,terminateOnUnload:!0}),
u$=Object.freeze(Object.defineProperty({__proto__:null,SPEECH_LIMITS:Zn,normalizeSpeechInput:oE,speechRuntimeDefinition:d$,
validatePcm:iE,validateSpeechManifest:rm},Symbol.toStringTag,{value:"Module"})),xr=1024**3,f$=[...Object.values(Md),...Object.
values(Ji),...Object.values(Ja),...Object.values(ti)],h$=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkg\
roupStorageSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWo\
rkgroupSizeZ","maxComputeWorkgroupsPerDimension"],p$=new Set(["transformers.js","llama.cpp","onnx-diffusion","transforme\
rs-speech"]),kh="Load this speech model from Browse models, or use Enable voice in a world-agent window.";function xh(t,e=f$){
const r=t?.model??t??{},n=e.filter(s=>s.model.runtime===r.runtime&&(s.repository??s.model.repository)===(r.repository??t?.
repository)&&(s.revision??s.model.revision)===(r.revision??t?.revision)&&["architecture","task","format","dtype"].every(
i=>!t?.model&&r[i]===void 0||Gl(r[i],s.model[i]))&&(r.runtime!=="transformers-speech"||t?.model&&Gl(r,s.model)&&Array.isArray(
t.files)&&t.files.length===s.files.length&&s.files.every(i=>t.files.some(o=>o.path===i.path&&o.size===i.size&&o.sha256===
i.sha256)))&&(!t?.model||!Array.isArray(t.files)||!Array.isArray(s.files)||m$(r.runtime,t.files,s.files)));return n.length===
1?n[0]:t?.model?void 0:n.find(s=>s.id===t?.modelId)}function m$(t,e,r){const n=o=>t!=="llama.cpp"||o.path?.endsWith(".gg\
uf"),s=e.filter(n),i=r.filter(n);return s.length===i.length&&s.every(o=>i.some(a=>a.path===o.path&&a.size===o.size&&(a.sha256===
void 0||a.sha256===o.sha256)))}function aE(t){const e=t?.model??t??{},r=xh(t),n=t?.model?e:r?.model??e,s=t?.files??r?.files;
let i=null;if(s!==void 0){if(!Array.isArray(s)||!s.length||s.length>Se.maxFiles)throw new Error("Invalid model file list");
i=0;for(const o of s){if(!o||!Number.isSafeInteger(o.size)||o.size<0)throw new Error("Invalid model file size");if(i+=o.
size,!Number.isSafeInteger(i))throw new Error("Invalid model package size")}}else Number.isSafeInteger(t?.totalBytes)&&t.
totalBytes>=0&&(i=t.totalBytes);return{model:n,files:s,trusted:r,totalBytes:i,descriptorOnly:!t?.model&&!r&&s===void 0}}
function Vo(t){const{model:e,totalBytes:r,files:n,trusted:s,descriptorOnly:i}=aE(t);if(e.runtime==="transformers-speech"){
if(!s)throw Object.assign(new Error("Speech package differs from the pinned voice catalog"),{code:"ERR_MODEL_SPEECH_UNVE\
RIFIED"});return{cpuBytes:Zn.residentBytes,gpuBytes:Zn.residentBytes}}if(e.runtime==="onnx-diffusion")return{cpuBytes:8*
xr,gpuBytes:8*xr};if(e.runtime==="llama.cpp"){if(r===null)return{cpuBytes:0,gpuBytes:0};const o=r>4*xr;return{cpuBytes:(o?
8:2)*xr,gpuBytes:(o?16:2)*xr}}if(e.runtime==="transformers.js"){if(i)return{cpuBytes:4*xr,gpuBytes:4*xr};const o=Za(e,{...n?
{files:n}:{},...r!==null?{totalBytes:r}:{}});return{cpuBytes:Math.max(4*xr,o.minimumCpuBytes),gpuBytes:Math.max(4*xr,o.minimumGpuBytes)}}
throw new Error("Unsupported model runtime")}function Sh(t={}){if(t===null&&(t={}),typeof t!="object"||Array.isArray(t)||
![Object.prototype,null].includes(Object.getPrototypeOf(t))||Object.keys(t).some(r=>!["cpuBytes","gpuBytes"].includes(r)))
throw new TypeError("Invalid model memory budgets");const e={};for(const r of["cpuBytes","gpuBytes"]){const n=t[r];if(n==
null)e[r]=null;else{if(!Number.isSafeInteger(n)||n<=0||n>1024*xr)throw new RangeError(`Invalid ${r} memory budget`);e[r]=
n}}return e}async function g$({scope:t=globalThis,timeoutMs:e=3e3}={}){if(!Number.isSafeInteger(e)||e<1||e>6e4)throw new RangeError(
"Invalid device probe timeout");const r=t.WebAssembly,n=t.navigator?.deviceMemory,s={webgpu:null,features:[],limits:{},crossOriginIsolated:t.
crossOriginIsolated===!0,sharedArrayBuffer:typeof t.SharedArrayBuffer=="function",jspi:typeof r?.Suspending=="function"&&
typeof r?.promising=="function",memory64:!1,deviceMemoryGiB:typeof n=="number"&&Number.isFinite(n)&&n>0?n:null};if(s.sharedArrayBuffer&&
typeof r?.Memory=="function")try{new r.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"}),s.memory64=!0}catch{}const i=t.
navigator?.gpu;if(typeof i?.requestAdapter!="function")return{...s,webgpu:!1};const o=performance.now()+e,a=new Error("G\
PU capability check timed out");let c,l,d,u=!1;const h=()=>{if(u||performance.now()>=o)throw a},p=async()=>{h();let m=await i.
requestAdapter({powerPreference:"high-performance"});return h(),m==null&&(await new Promise(b=>{d=b,l=setTimeout(b,100)}),
l=d=void 0,h(),m=await i.requestAdapter({powerPreference:"high-performance"}),h()),m};try{const m=await Promise.race([p(),
new Promise((b,g)=>{c=setTimeout(()=>g(a),e)})]);if(!m||m.isFallbackAdapter||m.info?.isFallbackAdapter)return{...s,webgpu:!1};
s.features=[...m.features].filter(b=>typeof b=="string"&&b.length<=80).slice(0,64).sort();for(const b of h$){const g=m.limits?.[b];
Number.isSafeInteger(g)&&g>0&&(s.limits[b]=g)}s.webgpu=!0}catch(m){s.probeError=String(m?.message??m).slice(0,300)}finally{
u=!0,clearTimeout(c),clearTimeout(l),d?.()}return s}function b$({model:t,files:e,totalBytes:r,trusted:n,descriptorOnly:s}){
if(!p$.has(t.runtime))return["runtime_unsupported","This model runtime is not supported locally"];if(t.requiredFeatures!==
void 0&&(!Array.isArray(t.requiredFeatures)||t.requiredFeatures.length>32||t.requiredFeatures.some(o=>typeof o!="string"||
!o||o.length>80)))return["model_invalid","Invalid model GPU feature requirements"];if(t.runtime==="transformers-speech")
return null;const i=t.runtime==="llama.cpp"?16*xr:t.runtime==="onnx-diffusion"?3*xr:Za(t).maxModelBytes;if(!s&&r!==null&&
r>i)return["package_too_large",`Model package is ${(r/xr).toFixed(2)} GiB; this runtime supports up to ${Number((i/xr).toFixed(
2))} GiB.`];if(t.runtime==="transformers.js"){const o=Ya("transformers.js",t.architecture);if((!s||t.runtimeVersion!==void 0)&&
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
o.size>=2*xr)?["file_too_large","A file exceeds the diffusion loader’s supported buffer size"]:null}function Gl(t,e){return t===
e?!0:!t||!e||typeof t!="object"||typeof e!="object"||Array.isArray(t)!==Array.isArray(e)?!1:Object.keys(t).length===Object.
keys(e).length&&Object.keys(t).every(r=>Gl(t[r],e[r]))}function y$(t,{device:e,budgets:r={}}={}){const n=Sh(r);let s,i,o;
try{s=aE(t),i=Vo(t)}catch(h){o=h,i={cpuBytes:0,gpuBytes:0}}const a=(h,p,m)=>({status:h,reason:m,code:p,...i});if(!e)return a(
"checking","device_checking","Checking device compatibility");if(o)return a("unavailable",o.code==="ERR_MODEL_FILE_TOO_L\
ARGE"?"file_too_large":o.code==="ERR_MODEL_PACKAGE_TOO_LARGE"?"package_too_large":o.code==="ERR_MODEL_SPEECH_UNVERIFIED"?
"catalog_unsupported":"model_invalid",o.message);const c=b$(s);if(c)return a("unavailable",...c);if(n.cpuBytes!==null&&i.
cpuBytes>n.cpuBytes)return a("unavailable","cpu_budget_exceeded","Exceeds configured RAM memory budget");if(n.gpuBytes!==
null&&i.gpuBytes>n.gpuBytes)return a("unavailable","gpu_budget_exceeded","Exceeds configured GPU memory budget");if(e.webgpu===
!1)return a("unavailable","webgpu_unavailable","Hardware WebGPU is unavailable in this browser");if(s.model.runtime==="l\
lama.cpp")for(const[h,p]of[["crossOriginIsolated","GGUF requires cross-origin isolation"],["sharedArrayBuffer","GGUF req\
uires SharedArrayBuffer"],["jspi","GGUF requires WebAssembly JSPI"],["memory64","GGUF requires shared WebAssembly memory\
64"]]){if(e[h]===!1)return a("unavailable",`gguf_${h}_unavailable`,p);if(e[h]!==!0)return a("unknown","device_probe_unkn\
own","GGUF browser prerequisites have not been verified")}if(e.webgpu!==!0)return a("unknown","device_probe_unknown","GP\
U capability check is incomplete; RAM/GPU memory fit is unverified");const l=new Set(e.features??[]),d=new Set(s.model.requiredFeatures??
[]),u=s.model.dtype;(["llama.cpp","onnx-diffusion"].includes(s.model.runtime)||(typeof u=="string"?[u]:Object.values(u??
{})).some(h=>["fp16","q4f16"].includes(h)))&&d.add("shader-f16");for(const h of d)if(!l.has(h)){const p=h==="shader-f16"&&
s.model.runtime==="llama.cpp"?"This GGUF engine requires FP16 GPU math (shader-f16), even with quantized weights. This b\
rowser does not expose it; see Setup help.":h==="shader-f16"?"Required FP16 GPU math (shader-f16) is unavailable in this\
 browser":`Required GPU feature ${h} is unavailable in this browser`;return a("unavailable","gpu_feature_unavailable",p)}
return s.descriptorOnly?a("unknown","model_metadata_unverified","Model metadata and RAM/GPU memory fit require verificat\
ion before loading"):s.model.runtime==="transformers-speech"?a("unknown","voice_managed",`${kh} RAM/GPU memory fit is un\
verified.`):a("unknown","memory_fit_unverified","Required features are supported; RAM/GPU memory fit is unverified")}const vy=1024**
3,w$=t=>Number.isSafeInteger(t)&&t>0?t:null,v$=(t,e)=>t===null?e:e===null?t:Math.min(t,e);function E$({computeManager:t,
owned:e=!1,initial:r}={}){if(!t||typeof e!="boolean")throw new TypeError("Model budgets require a manager and explicit o\
wnership");let n=Sh(r);const s=()=>({...n}),i={allowUnboundedMemory:e,getMemoryBudgets:s};function o(l){if(!Number.isInteger(
l)||l<1||l>8)throw new RangeError("Invalid resident capacity");return{cpu:{units:l,memoryBytes:e?n.cpuBytes??0:12*vy},gpu:{
units:l,memoryBytes:e?n.gpuBytes??0:16*vy}}}function a(l){const d=Sh(l);if(e){const u=t.resourceBroker;if(!u?.setMemoryBudgets)
throw new Error("The owned model resource broker is not initialized");u.setMemoryBudgets({cpu:d.cpuBytes,gpu:d.gpuBytes})}
return n=d,s()}function c(){const l=t.resourceBroker?.reportPressure().pools??{},d={owned:e};for(const u of["cpu","gpu"]){
const h=w$(l[u]?.memoryBytes),p=n[`${u}Bytes`],m=v$(p,h),b=l[u]?.activeMemoryBytes??0;d[u]={reservedBytes:b,budgetBytes:m,
configuredBytes:p,brokerBytes:h,overBudget:m!==null&&b>m}}return d}return{get:s,set:a,status:c,initialResourceBudgets:o,
admissionOptions:i}}const Lo=Uint32Array.from([1732584193,4023233417,2562383102,271733878,3285377520]),ys=new Uint32Array(
80);class k$ extends Yp{A=Lo[0]|0;B=Lo[1]|0;C=Lo[2]|0;D=Lo[3]|0;E=Lo[4]|0;constructor(){super(64,20,8,!1)}get(){const{A:e,
B:r,C:n,D:s,E:i}=this;return[e,r,n,s,i]}set(e,r,n,s,i){this.A=e|0,this.B=r|0,this.C=n|0,this.D=s|0,this.E=i|0}process(e,r){
for(let c=0;c<16;c++,r+=4)ys[c]=e.getUint32(r,!1);for(let c=16;c<80;c++)ys[c]=Ju(ys[c-3]^ys[c-8]^ys[c-14]^ys[c-16],1);let{
A:n,B:s,C:i,D:o,E:a}=this;for(let c=0;c<80;c++){let l,d;c<20?(l=q1(s,i,o),d=1518500249):c<40?(l=s^i^o,d=1859775393):c<60?
(l=j1(s,i,o),d=2400959708):(l=s^i^o,d=3395469782);const u=Ju(n,5)+l+a+d+ys[c]|0;a=o,o=i,i=Ju(s,30),s=n,n=u}n=n+this.A|0,
s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.E|0,this.set(n,s,i,o,a)}roundClean(){li(ys)}destroy(){this.set(0,0,0,0,0),
li(this.buffer)}}const nm=Xp(()=>new k$),x$=new Set([408,429,500,502,503,504]);function S$(t,e){return e?.throwIfAborted(),
new Promise((r,n)=>{const s=()=>{clearTimeout(i),n(e.reason)},i=setTimeout(()=>{e?.removeEventListener("abort",s),r()},t);
e?.addEventListener("abort",s,{once:!0})})}function Ey(t){return["TypeError","NetworkError","TimeoutError"].includes(t?.
name)}function Xu(t){try{Promise.resolve(t()).catch(()=>{})}catch{}}async function*A$(t,e,{signal:r,fetchImpl:n=fetch,onRetry:s,
maxRetries:i=5,baseRetryMs:o=1e3,inactivityTimeoutMs:a=3e4}={}){let c=0,l=0,d,u=!1;const h=!!(t.sha256||t.gitBlobSha1);for(;;){
r?.throwIfAborted();const p=new AbortController,m=r?AbortSignal.any([r,p.signal]):p.signal;let b,g,f;const y=async k=>{let x,
S;m.throwIfAborted();const v=new Promise((I,C)=>{S=()=>C(m.reason),m.addEventListener("abort",S,{once:!0})}),w=new Promise(
(I,C)=>{x=setTimeout(()=>{const R=new DOMException("Model download stopped receiving data","TimeoutError");p.abort(R),C(
R)},a)});try{return await Promise.race([k(),w,v])}finally{clearTimeout(x),m.removeEventListener("abort",S)}};try{try{b=await y(
async()=>{const k=await n(e(t.path),{signal:m,credentials:"omit",cache:"no-store",...c?{headers:{Range:`bytes=${c}-${t.size-
1}`}}:{}});if(m.aborted)throw Xu(()=>k.body?.cancel?.()),m.reason;return k})}catch(k){if(r?.throwIfAborted(),!Ey(k))throw k;
f=k}if(b)if(b.ok){if(!b.body)throw new Error(`Artifact source has no body: ${t.path}`);const k=b.headers?.get("content-e\
ncoding");if(c&&(u||k&&k!=="identity"))throw new Error(`Cannot resume an encoded model download: ${t.path}`);if(c||b.status===
206){const S=b.headers?.get("content-range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/u);if(b.status!==206||!S||Number(S[1])!==
c||Number(S[2])!==t.size-1||Number(S[3])!==t.size)throw new Error(`Model download cannot resume: invalid or ignored byte\
 range for ${t.path}. Retry Load.`)}const x=b.headers?.get("etag");if(c&&d&&x&&x!==d)throw new Error(`Model source chang\
ed during download: ${t.path}`);if(c||(d=x,u=!!(k&&k!=="identity")),b.body.getReader){const S=b.body.getReader();g={next:()=>S.
read(),return:async()=>{try{await S.cancel()}finally{S.releaseLock()}}}}else g=b.body[Symbol.asyncIterator]();for(;;){let S;
try{S=await y(()=>g.next())}catch(v){if(r?.throwIfAborted(),!Ey(v))throw v;f=v;break}if(r?.throwIfAborted(),S.done){if(c===
t.size)return;f=new Error(`Model download ended before all bytes arrived: ${t.path}`);break}if(!(S.value instanceof Uint8Array)||
c+S.value.byteLength>t.size)throw new Error(`Model download exceeds its declared size or has invalid bytes: ${t.path}`);
c+=S.value.byteLength,yield S.value}}else{const k=new Error(`Artifact source failed: ${t.path} (${b.status})`);if(!x$.has(
b.status))throw k;f=k}}finally{p.abort(),Xu(g?()=>g.return?.():()=>b?.body?.cancel?.())}if(r?.throwIfAborted(),c>0&&c===
t.size&&h)return;if(c&&!h||l>=i){const k=new Error(`Download interrupted for ${t.path} after ${c} of ${t.size} bytes. `+
(c&&!h?"This file cannot be safely resumed. ":`Recovery failed after ${l} retries. `)+"Check your connection and retry L\
oad.",{cause:f});throw k.code="ERR_MODEL_DOWNLOAD_INTERRUPTED",k}l+=1;const E=Math.min(o*2**(l-1),8e3);s?.({loaded:c,retryAttempt:l,
maxRetries:i,retryDelayMs:E}),await S$(E,r)}}function I$(){let t=Promise.resolve();return{run(e,{signal:r}={}){const n=t.
catch(()=>{}).then(()=>(r?.throwIfAborted(),e()));return t=n,n},settled:()=>t.catch(()=>{})}}function cE(t){if(t?.code===
"ERR_MODEL_STORAGE_FULL"||t?.name!=="QuotaExceededError")return t;const e=new Error("The browser refused additional stor\
age. Delete an unused stored model or free device storage, then retry the import.",{cause:t});return e.name="QuotaExceed\
edError",e.code="ERR_MODEL_STORAGE_FULL",e}async function _$(t,e,r){const n=o=>`${o.sha256}:${o.size}`,s=new Set(e.filter(
o=>!o.cid&&!o.gitBlobSha1&&/^[a-f0-9]{64}$/.test(o.sha256)&&Number.isSafeInteger(o.size)&&o.size>=0).map(n)),i=new Map;if(r?.
throwIfAborted(),!s.size)return i;for await(const o of t.list({signal:r})){if(r?.throwIfAborted(),o.kind!=="file"||o.status!==
"complete")continue;const a=n(o);if(s.delete(a)&&(i.set(a,o.cid),!s.size))break}return i}async function Yu(t,e,r,{signal:n,
onProgress:s,fetchImpl:i=fetch}={}){try{const o=await _$(t,e.files,n);return await t.withRetention(async a=>{const c=[];
for(let l=0;l<e.files.length;l+=1){n?.throwIfAborted();const d=e.files[l],u=()=>globalThis.performance?.now()??Date.now();
let h=0,p=u();const m=(y={})=>s?.({stage:"import",path:d.path,index:l,total:e.files.length,loaded:h,totalBytes:d.size,...y});
m();const b=d.cid||!d.gitBlobSha1&&o.get(`${d.sha256}:${d.size}`);let g=b?await a.stat(b,{signal:n}):null;const f=g?.kind===
"file"&&g.status==="complete"&&g.size===d.size&&g.sha256===d.sha256;if(!f){const y=d.gitBlobSha1?nm.create().update(new TextEncoder().
encode(`blob ${d.size}\0`)):null;async function*E(){for await(const k of A$(d,r,{signal:n,fetchImpl:i,onRetry:m})){n?.throwIfAborted(),
y?.update(k),h+=k.byteLength,yield k;const x=u();h<d.size&&x-p>=100&&(p=x,m())}if(y&&La(y.digest())!==d.gitBlobSha1)throw new Error(
`Source Git blob SHA-1 mismatch: ${d.path}`)}g=await a.importFile(E(),{expectedSize:d.size,...d.sha256?{expectedSha256:d.
sha256}:{},signal:n,pin:!1})}if(d.cid&&g.cid!==d.cid)throw new Error(`Imported CID differs: ${d.path}`);n?.throwIfAborted(),
h=d.size,m(f?{reused:!0}:{}),c.push({path:d.path,cid:g.cid,size:g.size,sha256:g.sha256})}return n?.throwIfAborted(),s?.(
{stage:"verify",total:e.files.length,totalBytes:c.reduce((l,d)=>l+d.size,0)}),n?.throwIfAborted(),a.importManifest({...e,
files:c},{pin:!0,signal:n})},{signal:n})}catch(o){throw cE(o)}}async function C$(t,{signal:e}={}){const r=[];for await(const n of t.
list({signal:e})){if(e?.throwIfAborted(),n.kind==="manifest"&&n.status==="partial"&&(n.pinned||n.retain)){try{const s=as(
n.manifest);if(s.model?.runtime!==void 0){if(typeof s.model.runtime!="string"||!s.model.runtime.trim())throw new Error("\
Invalid model runtime");r.push(n)}}catch(s){throw new Error(`Stored package ${n.cid} has invalid recovery metadata: ${s.
message}`,{cause:s})}continue}n.kind==="manifest"&&["complete","deleting"].includes(n.status)&&n.manifest?.model?.runtime&&
r.push(n)}return r}async function R$(t,e,{signal:r}={}){const n=t.store,s=t.networkManager?.getArtifactTransport?.();if(!n.
persistent||s?.store===n&&s.releaseOwnership)return e();if(!n.lockManager?.request){if(n.backend?.hasExclusiveLock)return e();
throw new Error("Stored model deletion requires exclusive network ownership for this store")}return n.lockManager.request(
`${n.lockName}:network-owner`,{mode:"exclusive",ifAvailable:!0},async i=>{if(!i)throw new Error("Another tab owns file s\
haring for this library. Delete the model from that tab, or close that tab and retry.");return r?.throwIfAborted(),e()})}
const ky="qwen3.5-0.8b-abliterated-q4-k-m-gguf";function lE({storeName:t="inference-models",storage:e,locks:r=globalThis.
navigator?.locks}={}){const n=`peercompute:model-console:last-loaded:v1:${encodeURIComponent(String(t))}`;if(e===void 0)
try{e=globalThis.localStorage}catch{e=null}function s(h){if(h?.version!==1||typeof h.manifestCid!="string"||h.manifestCid.
length>128||typeof h.modelId!="string"||!h.modelId||h.modelId.length>256||h.selectionId!==void 0&&!/^[a-f0-9-]{36}$/.test(
h.selectionId))return null;try{return{version:1,manifestCid:Je(h.manifestCid).toString(),modelId:h.modelId,...h.selectionId?
{selectionId:h.selectionId}:{}}}catch{return null}}let i=null,o=!1;const a=()=>i?{...i}:null;function c(h=!1){if(o&&!h)return a();
try{if(!e?.getItem)return a();const p=e.getItem(n);try{i=typeof p=="string"&&p.length<=1024?s(JSON.parse(p)):null}catch{
i=null}o=!1}catch{}return a()}async function l(h,p){if(!r?.request)return h(!0);let m=!1;try{return await r.request(`${n}\
:write`,{mode:"exclusive",signal:p?AbortSignal.any([p,AbortSignal.timeout(1e3)]):AbortSignal.timeout(1e3)},()=>(m=!0,h(!0)))}catch(b){
if(m)throw b;return h(!1)}}function d(h,{signal:p}={}){const m=s({...h,version:1,selectionId:crypto.randomUUID()});if(!m)
throw new TypeError("A stored model preference requires a valid CID and model ID");return l(b=>{if(p?.aborted)return{record:c(),
committed:!1};const g=c(b);if(i=m,o=!b,b)try{e?.setItem(n,JSON.stringify(m))}catch{o=!0}return{record:a(),previous:g,committed:!0,
persisted:!o&&!!e?.setItem}},p)}const u=(h,p)=>h&&p&&h.manifestCid===p.manifestCid&&h.modelId===p.modelId&&h.selectionId===
p.selectionId;return c(),{readLastLoaded:c,rememberLoaded:(h,p)=>d(h,p).then(m=>m.record),rememberLoadedWithReceipt:d,restoreLastLoaded(h){
const p=s(h?.record),m=s(h?.previous);return!h?.committed||!p?Promise.resolve(c()):l(b=>{const g=c(h.persisted);if(!u(g,
p))return g;if(h.persisted&&!b)throw new Error("The cancelled load was cleaned up, but its saved selection could not be \
restored");if(h.persisted)try{m?e.setItem(n,JSON.stringify(m)):e.removeItem(n)}catch(f){throw new Error("The cancelled l\
oad was cleaned up, but its saved selection could not be restored",{cause:f})}return i=m,o=!h.persisted||!b,a()})},clearLastLoaded(h=a()){
const p=s(h);return l(m=>{const b=c(!0);if(!p||!b||b.manifestCid!==p.manifestCid||b.modelId!==p.modelId||b.selectionId!==
p.selectionId)return b;if(i=null,o=!m,m)try{e?.removeItem(n)}catch{o=!0}return null})}}}const T$="https://secretworkshop\
.net/peercompute/config/relay-config.json";async function xy(t,{fetchImpl:e,signal:r,maximumBytes:n}){const s=await e(t,
{cache:"no-store",signal:r});if(!s.ok||!s.body)throw new Error(`Relay configuration unavailable (${s.status})`);const i=[];
let o=0;for await(const l of s.body){if(o+=l.byteLength,o>n)throw new Error("Relay configuration exceeds its byte limit");
i.push(l)}const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=l.byteLength;return JSON.parse(new TextDecoder(
"utf-8",{fatal:!0}).decode(a))}async function M$({fetchImpl:t=globalThis.fetch,signal:e,baseUrl:r=globalThis.location?.href}={}){
const n=AbortSignal.timeout(2e4),s=e?AbortSignal.any([e,n]):n;let i;try{i=await xy(new URL("./relay-config-source.json",
r).href,{fetchImpl:t,signal:s,maximumBytes:16*1024})}catch(l){if(s.aborted)throw l}const o=new URL(i?.relayConfigUrl??T$);
if(o.protocol!=="https:"||o.hostname!=="secretworkshop.net"||o.username||o.password)throw new Error("Relay configuration\
 must use the approved Secret Workshop HTTPS backend");const a=await xy(o.href,{fetchImpl:t,signal:s,maximumBytes:64*1024}),
c=[...new Set((Array.isArray(a.bootstrapPeers)?a.bootstrapPeers:[]).filter(l=>typeof l=="string"&&l.length<=2048&&l.startsWith(
"/")&&l.includes("/wss/")&&l.includes("/p2p/")))].slice(0,16);if(!c.length)throw new Error("Production relay configurati\
on contains no secure bootstrap peers");return{bootstrapPeers:c,transportManager:{faultTolerance:"no-fatal"},...a.webrtc&&
typeof a.webrtc=="object"?{webrtc:a.webrtc}:{},pubsubType:a.pubsubType==="gossipsub"?"gossipsub":"floodsub",...a.gossipsub&&
typeof a.gossipsub=="object"?{gossipsub:a.gossipsub}:{}}}const en="https://huggingface.co",Zu="peercompute.huggingface-m\
etadata.v1",B$=2*1024*1024,Sy=2*1024*1024,ef=20,Wc=new TextEncoder,L$=t=>JSON.parse(JSON.stringify(t)),Ti=(t,e=1600)=>typeof t==
"string"?t.slice(0,e):"";function Jn(t){if(typeof t!="string"||t.length>1024)throw new Error("Enter a Hugging Face owner\
/model repository");let e=t.trim(),r,n;if(e.startsWith("https://")){const i=new URL(e);if(i.origin!==en||i.username||i.password||
i.search||i.hash)throw new Error("Use a public huggingface.co repository URL without credentials or query parameters");const o=i.
pathname.replace(/\/$/,"").slice(1).split("/");if(e=o.slice(0,2).join("/"),o.length>2){if(!["tree","blob","resolve"].includes(
o[2])||!o[3])throw new Error("Unsupported Hugging Face repository URL");o[3]!=="main"&&(r=Ds(o[3])),o.length>4&&(n=ec(o.
slice(4).join("/")))}}const s=e.split("/");if(s.length!==2||s.some(i=>!/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(i)||i.includes(
"..")||i.includes("--"))||["datasets","spaces","api"].includes(s[0]))throw new Error("Enter a Hugging Face owner/model r\
epository");return{repository:e,...r?{revision:r}:{},...n?{path:n}:{}}}function Ds(t){if(typeof t!="string"||!/^[a-f0-9]{40}$/i.
test(t))throw new Error("An immutable 40-character model revision is required");return t.toLowerCase()}function ec(t){if(typeof t!=
"string"||!t||Wc.encode(t).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(t)||t.startsWith("/")||t.split("/").some(e=>!e||
e==="."||e===".."))throw new Error("Invalid Hugging Face file path");return t}function $a(t,e,r){return t=Jn(t).repository,
`${en}/${t}/resolve/${Ds(e)}/${ec(r).split("/").map(encodeURIComponent).join("/")}`}class ur extends Error{constructor(e,{
status:r,retryAfterMs:n,cause:s,code:i}={}){super(e,{cause:s}),this.name="HuggingFaceError",this.status=r,this.retryAfterMs=
n,this.code=i}}function Wl(t){t?.throwIfAborted()}function na(t){return t?.reason??new DOMException("Operation cancelled",
"AbortError")}function dE(t,e,r){return e?.aborted?(Promise.resolve(t).then(r,()=>{}),Promise.reject(na(e))):new Promise(
(n,s)=>{let i=!1;const o=()=>{i=!0,s(na(e))};e?.addEventListener("abort",o,{once:!0}),Promise.resolve(t).then(a=>{if(e?.
removeEventListener("abort",o),i){r?.(a);return}n(a)},a=>{e?.removeEventListener("abort",o),s(a)})})}function D$(t,e){if(!t)
return 1e3;const r=Number(t);return Math.max(0,Math.min(36e5,Number.isFinite(r)?r*1e3:Date.parse(t)-e||1e3))}async function Ay(t,e,r){
const n=t.headers.get("content-length");if(n&&Number(n)>e)throw t.body?.cancel().catch(()=>{}),new ur("Hub metadata exce\
eds the response budget");if(!t.body)throw new ur("Hub returned an empty metadata response");const s=t.body.getReader(),
i=[];let o=0;try{for(;;){Wl(r);const{done:l,value:d}=await dE(s.read(),r);if(l)break;if(o+=d.byteLength,o>e)throw new ur(
"Hub metadata exceeds the response budget");i.push(d)}Wl(r)}catch(l){throw s.cancel().catch(()=>{}),l}finally{s.releaseLock()}
const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=l.byteLength;return a}function sa(t){return Ti(t,12e3).
replace(/^---[\s\S]*?---\s*/,"").replace(/<[^>]*>/g," ").replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/\[([^\]]*)\]\([^)]*\)/g,
"$1").replace(/[`#*_]/g,"").replace(/\s+/g," ").trim().slice(0,1600)}function $$(t,e){let r;try{r=Jn(t.id??t.name??t.modelId).
repository}catch{return null}if(t.private||t.isPrivate||t.type&&t.type!=="model")return null;const n=(Array.isArray(t.tags)?
t.tags:typeof t.tags=="string"?t.tags.split(",").map(o=>o.trim()):[]).filter(o=>typeof o=="string").slice(0,80).map(o=>Ti(
o,150)),s=Array.isArray(t.formatted?.fileContent)?t.formatted.fileContent.slice(0,500).map(o=>Ti(o.text,12e3)).join(""):
"",i=Ti(t.pipeline_tag??t.cardData?.pipeline_tag??n.find(o=>["text-generation","image-text-to-text","text-to-image","aut\
omatic-speech-recognition","text-to-speech","feature-extraction"].includes(o)),100);return{repository:r,name:r.split("/")[1],
description:sa(s||t.description||t.cardData?.model_description||""),task:i||null,tags:n,license:Ti(t.cardData?.license??
n.find(o=>o.startsWith("license:"))?.slice(8),100)||null,url:`${en}/${r}`,gated:!!t.gated,source:e,downloads:Number.isSafeInteger(
t.downloads)?t.downloads:null,likes:Number.isSafeInteger(t.likes)?t.likes:null,revision:/^[a-f0-9]{40}$/i.test(t.sha??"")?
t.sha.toLowerCase():null}}function tf(t,e,r){const n=t.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/);if(!n)return null;
const s=new URL(n[1],e);if(s.origin!==en||s.pathname!==r||s.username||s.password||s.hash)throw new ur("Hub supplied an i\
nvalid pagination URL");return s.href}function N$({fetchImpl:t=globalThis.fetch,storage:e,timeoutMs:r=15e3,now:n=()=>Date.
now(),sleep:s=(i,o)=>new Promise((a,c)=>{const l=()=>{clearTimeout(d),c(na(o))},d=setTimeout(()=>{o?.removeEventListener(
"abort",l),a()},i);o?.addEventListener("abort",l,{once:!0}),o?.aborted&&l()})}={}){if(typeof t!="function")throw new Error(
"A fetch implementation is required");if(!Number.isFinite(r)||r<1||r>6e4)throw new Error("Invalid metadata timeout");if(e===
void 0)try{e=globalThis.localStorage}catch{e=null}const i=new Map;let o=0;try{const u=e?.getItem(Zu);if(typeof u=="strin\
g"&&Wc.encode(u).length<=Sy){const h=JSON.parse(u);if(Array.isArray(h))for(const p of h.slice(-40))Array.isArray(p)&&typeof p[0]==
"string"&&Number.isFinite(p[1]?.at)&&p[1].at<=n()&&p[1].at>n()-7*864e5&&typeof p[1].value?.text=="string"&&i.set(p[0],p[1])}}catch{}
function a(u,h){if(Wc.encode(JSON.stringify(h)).length>512*1024)return;i.delete(u),i.set(u,{at:n(),value:h});let p=JSON.
stringify([...i]);for(;i.size>40||Wc.encode(p).length>Sy;)i.delete(i.keys().next().value),p=JSON.stringify([...i]);try{e?.
setItem(Zu,p)}catch{}}async function c(u,{signal:h,maximum:p=B$,headers:m,raw:b=!1,cacheable:g=!0,validateResponse:f}={}){
Wl(h);const y=new URL(u);if(y.origin!==en||y.username||y.password)throw new Error("Only public Hugging Face metadata is \
allowed");const E=u,k=i.get(E),x=new AbortController,S=()=>x.abort(na(h));h?.addEventListener("abort",S,{once:!0});const v=setTimeout(
()=>x.abort(new DOMException("Hugging Face metadata request timed out","TimeoutError")),r);try{for(let w=0;w<2;w+=1){if(o>
n())throw new ur("Hugging Face is rate limiting requests. Retry shortly.",{status:429,retryAfterMs:o-n(),code:"ERR_HF_RA\
TE_LIMIT"});const I=await dE(t(u,{signal:x.signal,credentials:"omit",referrerPolicy:"no-referrer",headers:m}),x.signal,N=>{
N.body?.cancel().catch(()=>{})});if(I.status===429||I.status===503){const N=D$(I.headers.get("retry-after"),n());if(I.body?.
cancel().catch(()=>{}),w===0&&N<=2e3){await s(N,x.signal);continue}throw I.status===429&&(o=n()+N),new ur("Hugging Face \
is temporarily unavailable or rate limiting requests. Retry shortly.",{status:I.status,retryAfterMs:N,code:"ERR_HF_RATE_\
LIMIT"})}if(!I.ok)throw I.body?.cancel().catch(()=>{}),new ur(I.status===401||I.status===403?"This model requires Huggin\
g Face access approval or authentication; anonymous import is unavailable.":`Hugging Face metadata request failed (${I.status}\
)`,{status:I.status});if(f)try{f(I)}catch(N){throw I.body?.cancel().catch(()=>{}),N}if(b)return{response:I,bytes:await Ay(
I,p,x.signal)};const R={text:new TextDecoder().decode(await Ay(I,p,x.signal)),link:I.headers.get("link")};return g&&a(E,
R),{...R,cached:!1}}}catch(w){if(h?.aborted)throw na(h);if(g&&k&&k.at>n()-7*864e5&&(!w.status||w.status===429||w.status>=
500))return{...L$(k.value),cached:!0,warning:"Showing cached metadata; Hugging Face could not be refreshed."};throw x.signal.
aborted?x.signal.reason:w}finally{clearTimeout(v),h?.removeEventListener("abort",S)}}async function l(u,h){const p=await c(
u,h);try{return{...p,data:JSON.parse(p.text)}}catch{throw new ur("Hugging Face returned malformed metadata")}}return{async listDerivedModels(u,{
signal:h}={}){u=Jn(u).repository;const p=new URL("/api/models",en);p.searchParams.set("filter",`base_model:${u}`),p.searchParams.
set("full","true"),p.searchParams.set("cardData","true"),p.searchParams.set("limit","40");const m=await l(p.href,{signal:h});
if(!Array.isArray(m.data)||m.data.length>40)throw new ur("Invalid related-model metadata");const b=tf({headers:new Headers(
{link:m.link??""})},p.href,"/api/models");return{items:m.data,truncated:!!b,...m.cached?{cached:!0}:{},...m.warning?{warning:m.
warning}:{}}},async search({query:u="",task:h,cursor:p,signal:m}={}){if(typeof u!="string"||u.length>250||/[\u0000-\u001f]/.
test(u))throw new Error("Model search must be at most 250 characters");if(u=u.trim(),h&&!/^[a-z][a-z-]{0,79}$/.test(h))throw new Error(
"Invalid model task filter");let b={query:u,task:h||null,nameCursor:null,namesDone:!1,skip:0,cardsDone:!u};if(p){if(typeof p!=
"string"||p.length>16e3)throw new Error("Invalid search cursor");try{const w=JSON.parse(decodeURIComponent(p));if(w.query!==
u||w.task!==(h||null)||!Number.isSafeInteger(w.skip)||w.skip<0||w.skip>1e4||typeof w.namesDone!="boolean"||typeof w.cardsDone!=
"boolean"||w.nameCursor!==null&&(typeof w.nameCursor!="string"||w.nameCursor.length>12e3))throw new Error;b=w}catch{throw new Error(
"Invalid search cursor")}}const g=new URL("/api/models",en);g.searchParams.set("search",u),g.searchParams.set("limit",ef),
g.searchParams.set("full","true"),g.searchParams.set("cardData","true"),h&&g.searchParams.set("filter",h),b.nameCursor&&
g.searchParams.set("cursor",b.nameCursor);const f=new URL("/api/search/full-text",en);f.searchParams.set("q",u),f.searchParams.
set("type","model"),f.searchParams.set("limit",ef),f.searchParams.set("skip",b.skip);const y=await Promise.allSettled([b.
namesDone?Promise.resolve(null):l(g.href,{signal:m}),b.cardsDone?Promise.resolve(null):l(f.href,{signal:m})]);Wl(m);const E=new Map,
k=[];let x=!1,S=0,v;for(let w=0;w<y.length;w+=1){const I=y[w];if(I.status==="rejected"){v=I.reason,k.push(`${w?"Full-car\
d":"Name"} search unavailable: ${Ti(I.reason.message,220)}`),w?b.cardsDone=!0:b.namesDone=!0;continue}const C=I.value;if(!C)
continue;S+=1,x||=C.cached,C.warning&&k.push(C.warning);const R=w?C.data?.hits:C.data;if(!Array.isArray(R)||R.length>100)
throw new ur("Invalid Hub search result");for(const N of R){const D=$$(N,w?"card":"name");if(!D||h&&D.task!==h&&!D.tags.
includes(h))continue;const P=E.get(D.repository);E.set(D.repository,P?{...P,description:D.description||P.description,source:"\
name+card"}:D)}if(w)b.skip+=R.length,b.cardsDone=R.length<ef||b.skip>=(C.data.estimatedTotalHits??1/0)||b.skip>=1e4;else{
const N=tf({headers:new Headers({link:C.link??""})},g.href,"/api/models");b.nameCursor=N?new URL(N).searchParams.get("cu\
rsor"):null,b.namesDone=!b.nameCursor}}if(!S&&v)throw v;return{items:[...E.values()],nextCursor:b.namesDone&&b.cardsDone?
null:encodeURIComponent(JSON.stringify(b)),...k.length?{warning:[...new Set(k)].join(" ")}:{},...x?{cached:!0}:{}}},async getModel(u,{
revision:h,signal:p}={}){u=Jn(u).repository;const m=`${en}/api/models/${u}${h?`/revision/${Ds(h)}`:""}?blobs=true`,b=await l(
m,{signal:p});if(!b.data||typeof b.data!="object"||Array.isArray(b.data))throw new ur("Invalid model metadata");return{...b.
data,...b.cached?{cached:!0,warning:b.warning}:{}}},async listFiles(u,h,{signal:p}={}){u=Jn(u).repository,h=Ds(h);const m=`\
/api/models/${u}/tree/${h}`;let b=`${en}${m}?recursive=true&limit=1000`;const g=[],f=new Set;for(;b;){if(f.has(b)||f.size>=
16)throw new ur("Repository file listing exceeds its page budget");f.add(b);const y=await l(b,{signal:p});if(y.cached&&(g.
cached=!0,g.warning=y.warning),!Array.isArray(y.data)||y.data.length>1e3)throw new ur("Invalid repository file listing");
if(g.push(...y.data.filter(E=>E.type==="file")),g.length>8192)throw new ur("Repository contains too many files to inspec\
t safely");b=tf({headers:new Headers({link:y.link??""})},b,m)}return g},async readText(u,h,p,{signal:m,maxBytes:b=256*1024}={}){
if(!Number.isSafeInteger(b)||b<1||b>512*1024)throw new Error("Invalid metadata file budget");if(!/\.(json|md|txt|jinja)$/i.
test(ec(p))&&!/^(LICENSE|NOTICE)(\.[A-Za-z]+)?$/i.test(p))throw new Error("Only text metadata may be inspected");return(await c(
$a(u,h,p),{signal:m,maximum:b})).text},async readRange(u,h,p,m,b,{signal:g}={}){if(!Number.isSafeInteger(m)||m<0||!Number.
isSafeInteger(b)||b<1||b>1024*1024||!Number.isSafeInteger(m+b))throw new Error("Invalid bounded metadata range");const{response:f,
bytes:y}=await c($a(u,h,p),{signal:g,maximum:b,raw:!0,cacheable:!1,headers:{Range:`bytes=${m}-${m+b-1}`},validateResponse(k){
const x=k.headers.get("content-range")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);if(k.status!==206||!x||Number(x[1])!==m||Number(
x[2])!==m+b-1)throw new ur("The model server did not honor the bounded metadata range")}}),E=f.headers.get("content-rang\
e")?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);if(f.status!==206||!E||Number(E[1])!==m||Number(E[2])!==m+b-1||y.length!==b)throw new ur(
"The model server did not honor the bounded metadata range");return y},clearCache(){i.clear();try{e?.removeItem(Zu)}catch{}}}}
const rf=32,P$=["q4","q4f16","q8","fp16","fp32"],O$=new Set(["config.json","tokenizer.json","tokenizer_config.json","add\
ed_tokens.json","special_tokens_map.json","vocab.json","merges.txt","tokenizer.model","sentencepiece.bpe.model","generat\
ion_config.json","preprocessor_config.json","processor_config.json","chat_template.json","chat_template.jinja"]),U$=t=>t===
"fp32"?"":t==="q8"?"_quantized":`_${t}`,Ah=new TextEncoder;function F$(t){const e=ec(t.path??t.rfilename),r=t.size;if(!Number.
isSafeInteger(r)||r<0)throw new Error(`Missing exact file size: ${e}`);if(t.lfs){const s=t.lfs.oid??t.lfs.sha256;if(!/^[a-f0-9]{64}$/i.
test(s??"")||t.lfs.size!==r)throw new Error(`Invalid LFS digest or size: ${e}`);return{path:e,size:r,sha256:s.toLowerCase()}}
const n=t.oid??t.blobId;if(!/^[a-f0-9]{40}$/i.test(n??""))throw new Error(`Missing immutable Git file digest: ${e}`);return{
path:e,size:r,gitBlobSha1:n.toLowerCase()}}function z$(t){const e=t.reduce((r,n)=>r+n.size,0);if(!Number.isSafeInteger(e))
throw new Error("Selected package size exceeds integer bounds");return e}function q$(t){return O$.has(t)||/^(README(?:\.[A-Za-z]+)?|LICENSE(?:\.[A-Za-z0-9_-]+)?|NOTICE(?:\.[A-Za-z0-9_-]+)?)$/i.
test(t)}function Iy(t){return t.map(e=>`${e.path}:${e.sha256??e.gitBlobSha1}:${e.size}`).sort().join("|")}function Ko(t,e,r){
return`hf-${La(Zp(Ah.encode(`${t}@${e}:${r}`))).slice(0,24)}`}function Ih(t,{reason:e=null,dtype:r=t.model?.dtype,key:n=t.
id}={}){const s=t.capabilities?.browserInference===!1;return{key:n,id:t.id,name:t.name,repository:t.repository,revision:t.
revision,dtype:r,task:t.model?.task??"text-generation",totalBytes:t.totalBytes,model:t.model,files:t.files,license:t.license,
format:t.provenance?.format??t.format,loadable:!e&&!s,reason:e??(s?t.capabilities.executionReason??"No browser runtime i\
s available for this package":null),package:t,status:t.status??"candidate"}}function j$(t,e,r){return{spdx:typeof t.cardData?.
license=="string"?t.cardData.license.slice(0,100):(t.tags??[]).find(s=>typeof s=="string"&&s.startsWith("license:"))?.slice(
8,108)??"Unknown",sourceUrl:`${new URL($a(e,r,"README.md")).origin}/${e}/blob/${r}/README.md`,notice:"Publisher-reported\
 license. Review the model card and license files; preserve applicable notices.",reviewRequired:!0}}function _h(t,e,r,n,s,i,o){
return{id:Ko(t,e,o),name:`${t.split("/")[1]} (${o})`,description:r,repository:t,revision:e,status:"candidate",license:n,
files:s,totalBytes:z$(s),weightBytes:s.filter(a=>/\.onnx(?:_data(?:_\d+)?)?$|\.gguf$/i.test(a.path)).reduce((a,c)=>a+c.size,
0),model:i,provenance:{repository:t,revision:e,format:i.runtime==="llama.cpp"?"GGUF":"ONNX",modelCardUrl:`${Ch}/${t}/blo\
b/${e}/README.md`,source:"huggingface-discovery"}}}const Ch="https://huggingface.co";function G$({repository:t,revision:e,
description:r="",license:n,files:s,config:i,gated:o=!1}){const a=new Map(s.map(g=>[g.path,g])),c=i?.model_type,l=Ya("tra\
nsformers.js",c),d=l?.task==="image-text-to-text",u=l?.modules??["model"];let h,p;if(l)try{h=Q1(i)}catch(g){p=g.message}
const m=s.filter(g=>q$(g.path)),b=[];for(const g of P$){const f=u.map(w=>`onnx/${w}${U$(g)}.onnx`);if(!f.some(w=>a.has(w)))
continue;let y=null;l||(y=`Architecture ${c||"unknown"} has no admitted browser adapter`),i?.auto_map&&Object.keys(i.auto_map).
length&&(y="This configuration declares custom model code; no custom code is executed"),o&&(y="This repository requires \
Hugging Face access approval; anonymous import is unavailable"),l&&!l.dtypes.includes(g)&&(y=c==="qwen3_5"?"The Qwen3.5 \
browser adapter currently admits only all-q4 modules":`Precision ${g} has no admitted browser adapter for ${c}`),p&&(y??=
`Model memory profile unavailable: ${p}`);const E=[];try{for(const w of u)E.push(...ZD(i??{},c,w,g))}catch(w){y??=w.message}
const k=[...f,...E,"config.json","tokenizer.json","tokenizer_config.json"].filter(w=>!a.has(w));d&&!a.has("preprocessor_\
config.json")&&!a.has("processor_config.json")&&k.push("preprocessor_config.json or processor_config.json"),k.length&&(y??=
`Incomplete package: missing ${k.join(", ")}`);for(const w of f)s.some(I=>I.path.startsWith(`${w}_data`)&&!E.includes(I.
path))&&(y??="External ONNX data is present but not fully declared for this variant in the runtime configuration");const x=[
...new Set([...m.map(w=>w.path),...f,...E])].filter(w=>a.has(w)).sort().map(w=>a.get(w)),S={runtime:"transformers.js",runtimeVersion:Ld,
architecture:c,task:d?"image-text-to-text":"text-generation",dtype:d?Object.fromEntries(u.map(w=>[w,g])):g,modalities:l?.
modalities??["text"],requiredFeatures:K1(g,i??{}),repository:t,revision:e,...h?{memoryProfile:h}:{}},v=_h(t,e,r,n,x,S,g);
try{Za(S,{files:x,totalBytes:v.totalBytes,config:i})}catch(w){y??=w.message}x.length>1024&&(y??="Selected package has to\
o many files for the browser adapter"),b.push(Ih(v,{reason:y,dtype:g}))}return b}async function _y(t,e,r,n,s,i=256*1024){
if(n.size>i)throw new Error(`Metadata file is too large to inspect: ${n.path}`);const o=await t.readText(e,r,n.path,{signal:s,
maxBytes:i}),a=Ah.encode(o);if(a.length!==n.size)throw new Error(`Metadata size changed: ${n.path}`);if(n.gitBlobSha1){const l=nm.
create().update(Ah.encode(`blob ${n.size}\0`)).update(a).digest();if(La(l)!==n.gitBlobSha1)throw new Error(`Metadata Git\
 digest changed: ${n.path}`)}const c=La(Zp(a));if(n.sha256&&c!==n.sha256)throw new Error(`Metadata SHA-256 changed: ${n.
path}`);return n.sha256=c,o}async function W$(t,{client:e,catalog:r={},signal:n,selectedVariant:s}={}){if(!e?.getModel||
!e?.listFiles||!e?.readText)throw new Error("A Hugging Face metadata client is required");n?.throwIfAborted();const i=Jn(
t),o=i.repository,a=await e.getModel(o,{revision:i.revision,signal:n}),c=Ds(a.sha);if(i.revision&&c!==i.revision)throw new Error(
"Hugging Face returned a different model revision");const l=j$(a,o,c),d=[];a.warning&&d.push(a.warning);let u;try{u=await e.
listFiles(o,c,{signal:n})}catch(w){if(n?.throwIfAborted(),![401,403].includes(w.status)&&!a.gated&&!a.private&&!a.disabled)
throw w;return{repository:o,revision:c,description:sa(a.description??""),license:l,url:`${Ch}/${o}/tree/${c}`,gated:!0,variants:[
{key:Ko(o,c,"access-required"),id:Ko(o,c,"access-required"),name:o.split("/")[1],task:a.pipeline_tag??null,totalBytes:null,
dtype:null,loadable:!1,reason:"This model requires access approval or authentication on Hugging Face; anonymous import i\
s unavailable",package:null}]}}u.warning&&d.push(u.warning);const h=u.map(F$),p=new Set;for(const w of h){if(p.has(w.path))
throw new Error("Duplicate repository file path");p.add(w.path)}let m=sa(a.description??a.cardData?.model_description??""),
b=null,g;const f=h.find(w=>w.path==="README.md");if(f&&f.size<=128*1024)try{m=sa(await _y(e,o,c,f,n,128*1024))||m}catch(w){
n?.throwIfAborted(),d.push(`Model card unavailable: ${w.message}`)}const y=h.find(w=>w.path==="config.json");if(y)try{if(b=
JSON.parse(await _y(e,o,c,y,n)),!b||typeof b!="object"||Array.isArray(b))throw new Error("Invalid model configuration")}catch(w){
n?.throwIfAborted(),g=w.message}const E=Object.values(r).filter(w=>w.repository===o&&w.revision===c),k=!!(a.gated||a.private||
a.disabled),x=E.map(w=>Ih(w,{reason:k?"This repository requires Hugging Face access approval; anonymous import is unavai\
lable":null})),S=new Set(E.map(w=>Iy(w.files)));if(h.some(w=>w.path.endsWith(".onnx"))){const w=G$({repository:o,revision:c,
description:m,license:l,files:h,config:b,gated:!!(a.gated||a.private||a.disabled)});for(const I of w)E.find(R=>R.model.runtime===
"transformers.js"&&JSON.stringify(R.model.dtype)===JSON.stringify(I.model.dtype)&&R.files.every(N=>I.files.some(D=>D.path===
N.path&&D.size===N.size&&(N.sha256?N.sha256===D.sha256:N.gitBlobSha1===D.gitBlobSha1)))&&R.files.length===I.files.length)||
S.has(Iy(I.files))||(g&&(I.loadable=!1,I.reason=`Model configuration unavailable: ${g}`),x.push(I))}const v=h.filter(w=>/\.gguf$/i.
test(w.path));if(v.length){const{inspectGgufHeader:w,resolveGgufHubProfile:I,GGUF_HUB_LIMITS:C}=await Ft(async()=>{const{
inspectGgufHeader:R,resolveGgufHubProfile:N,GGUF_HUB_LIMITS:D}=await Promise.resolve().then(()=>l$);return{inspectGgufHeader:R,
resolveGgufHubProfile:N,GGUF_HUB_LIMITS:D}},void 0,import.meta.url);for(const R of v.slice(0,rf)){if(n?.throwIfAborted(),
E.some(X=>X.files.some(q=>q.path===R.path&&q.sha256===R.sha256)))continue;const N=[R,...h.filter(X=>/^(README|LICENSE|NOTICE)(\.[A-Za-z0-9_-]+)?$/i.
test(X.path))].sort((X,q)=>X.path.localeCompare(q.path));let D=_h(o,c,m,l,N,{runtime:"llama.cpp",task:"text-generation",
format:"GGUF",dtype:"unknown",modalities:["text"],repository:o,revision:c},R.path),P,j=!1;try{if(a.gated||a.private||a.disabled)
throw new Error("This repository requires Hugging Face access approval; anonymous import is unavailable");if(/mmproj|vision|projector/i.
test(R.path))throw new Error("A vision projector is not a standalone text model");if(!R.sha256)throw new Error("GGUF req\
uires an upstream whole-file SHA-256 digest");if(D.totalBytes>C.maximumBytes)throw new Error("Selected package exceeds t\
he browser GGUF adapter’s 16 GiB file budget");if(/-\d{5}-of-\d{5}\.gguf$/i.test(R.path))throw new Error("Split GGUF p\
ackages require complete shard admission and are not supported by this adapter");if(![D.id,R.path].includes(s??i.path))j=
!0,P="Select this variant to inspect its bounded GGUF header";else{const X=await w({size:R.size,signal:n,readRange:(ue,he,ze)=>e.
readRange(o,c,R.path,ue,he,ze)}),q=I({repository:o,revision:c,file:R,header:X});D=_h(o,c,m,l,N,q.model,R.path)}}catch(X){
n?.throwIfAborted(),P=X.message}const Z=Ih(D,{reason:P});Z.filePath=R.path,j&&(Z.requiresInspection=!0,Z.dtype=R.path.match(
/(?:^|[._-])(Q\d(?:_[A-Z0-9]+)*|IQ\d(?:_[A-Z0-9]+)*|F16|F32|BF16)(?=\.|$)/i)?.[1]?.toLowerCase()??"unknown",Z.precisionSource=
"filename"),x.push(Z)}v.length>rf&&d.push(`Showing the first ${rf} GGUF files; this repository contains ${v.length}.`)}return x.
length||x.push({key:Ko(o,c,"unsupported"),id:Ko(o,c,"unsupported"),name:o.split("/")[1],dtype:null,task:a.pipeline_tag??
null,totalBytes:null,model:null,files:[],loadable:!1,reason:a.gated?"This model requires access approval on Hugging Face":
"No complete package for an admitted ONNX, standard GGUF, or catalog diffusion adapter was found",package:null}),{repository:o,
revision:c,description:m,license:l,url:`${Ch}/${o}/tree/${c}`,variants:x,gated:k,...d.length?{warning:d.join(" ")}:{},...a.
cached||u.cached?{cached:!0}:{}}}const nf=12,H$=3,V$="These are publisher-declared base-model relationships, not proof o\
f identical weights or conversion from the selected source revision. Inspect a candidate before importing.",Mr=t=>t.toLowerCase();
function Qo(t){try{return Jn(t).repository}catch{return null}}function Cy(t){const e=t?.cardData?.base_model;return(Array.
isArray(e)?e:[e]).slice(0,32).map(Qo).filter(Boolean)}function Ac(t){const e=new Set;for(const r of(Array.isArray(t?.siblings)?
t.siblings:[]).slice(0,8192)){let n;try{n=ec(r.rfilename??r.path)}catch{continue}/\.onnx$/i.test(n)&&e.add("ONNX"),/\.gguf$/i.
test(n)&&!/mmproj|projector/i.test(n)&&e.add("GGUF")}return[...e].sort()}function K$(t,e){const r=t.cardData?.base_model_relation;
if(["quantized","converted","finetune","merge","adapter"].includes(r))return r;const n=Array.isArray(t.tags)?t.tags:[];for(const s of[
"merge","adapter","finetune","quantized"])if(n.some(i=>typeof i=="string"&&Mr(i)===`base_model:${s}:${Mr(e)}`))return s;
return"derived"}async function Q$(t,{client:e,signal:r}={}){if(!e?.getModel||!e?.listDerivedModels)throw new Error("A Hu\
gging Face lineage metadata client is required");r?.throwIfAborted();const n=Jn(t),s=await e.getModel(n.repository,{revision:n.
revision,signal:r});r?.throwIfAborted();const i=Qo(s.id??s.modelId)??n.repository;if(Mr(i)!==Mr(n.repository))throw new Error(
"Hugging Face returned a different source repository");const o=Ds(s.sha);if(n.revision&&o!==n.revision)throw new Error("\
Hugging Face returned a different source revision");const a=await e.listDerivedModels(i,{signal:r});if(r?.throwIfAborted(),
!Array.isArray(a.items)||a.items.length>40)throw new Error("Related-model listing exceeds its metadata budget");const c=[
s.warning,a.warning].filter(Boolean);let l=!!(s.cached||a.cached);const d=new Set,u=a.items.filter(g=>{const f=Qo(g?.id??
g?.modelId);return!f||d.has(Mr(f))||Mr(f)===Mr(i)||g.private||g.disabled||!Ac(g).length||!Cy(g).some(y=>Mr(y)===Mr(i))?!1:
(d.add(Mr(f)),!0)}).sort((g,f)=>Number(Ac(f).includes("ONNX"))-Number(Ac(g).includes("ONNX")));(a.truncated||u.length>nf)&&
c.push(`Discovery is bounded to 40 related repositories and ${nf} pinned candidate inspections; more exports may exist.`);
const h=u.slice(0,nf),p=new Array(h.length);let m=0,b=0;return await Promise.all(Array.from({length:Math.min(H$,h.length)},
async()=>{for(;m<h.length;){r?.throwIfAborted();const g=m++,f=h[g],y=Qo(f.id??f.modelId);try{const E=Ds(f.sha),k=await e.
getModel(y,{revision:E,signal:r});if(r?.throwIfAborted(),Ds(k.sha)!==E||Mr(Qo(k.id??k.modelId)??y)!==Mr(y))throw new Error(
"Candidate identity changed during pinned inspection");const x=Cy(k),S=Ac(k);if(!x.some(w=>Mr(w)===Mr(i))||!S.length||k.
private||k.disabled)throw new Error("Candidate has no matching pinned source lineage and export files");l||=!!k.cached,k.
warning&&c.push(k.warning);const v=K$(k,i);p[g]={repository:y,revision:E,name:y.split("/")[1],task:typeof k.pipeline_tag==
"string"?k.pipeline_tag.slice(0,100):null,formats:S,sourceRepository:i,sourceRevision:o,relationship:v,evidence:{kind:"p\
ublisher-base-model",revision:E,url:`${en}/${y}/blob/${E}/README.md`,sourceRevisionVerified:!1},description:sa(k.description??
k.cardData?.model_description??""),license:typeof k.cardData?.license=="string"?k.cardData.license.slice(0,100):null,url:`${en}\
/${y}/tree/${E}`,status:"candidate",requiresInspection:!0,gated:!!k.gated}}catch(E){r?.throwIfAborted(),b+=1,b<=3&&c.push(
`${y}: ${String(E.message).slice(0,180)}`)}}})),r?.throwIfAborted(),b>3&&c.push(`${b-3} further candidate metadata reque\
sts failed.`),{sourceRepository:i,sourceRevision:o,items:p.filter(Boolean),lineageNotice:V$,...c.length?{warning:[...new Set(
c)].join(" ")}:{},...l?{cached:!0}:{}}}function J$(t,e){if(t===e)return!0;if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<
t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}function sm(t){if(t instanceof Uint8Array&&t.constructor.name==="Uint8\
Array")return t;if(t instanceof ArrayBuffer)return new Uint8Array(t);if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,
t.byteOffset,t.byteLength);throw new Error("Unknown type, must be binary type")}function XO(t){return new TextEncoder().
encode(t)}function YO(t){return new TextDecoder().decode(t)}function X$(t,e){if(t.length>=255)throw new TypeError("Alpha\
bet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var s=0;s<t.length;s++){var i=t.charAt(s),o=i.
charCodeAt(0);if(r[o]!==255)throw new TypeError(i+" is ambiguous");r[o]=s}var a=t.length,c=t.charAt(0),l=Math.log(a)/Math.
log(256),d=Math.log(256)/Math.log(a);function u(m){if(m instanceof Uint8Array||(ArrayBuffer.isView(m)?m=new Uint8Array(m.
buffer,m.byteOffset,m.byteLength):Array.isArray(m)&&(m=Uint8Array.from(m))),!(m instanceof Uint8Array))throw new TypeError(
"Expected Uint8Array");if(m.length===0)return"";for(var b=0,g=0,f=0,y=m.length;f!==y&&m[f]===0;)f++,b++;for(var E=(y-f)*
d+1>>>0,k=new Uint8Array(E);f!==y;){for(var x=m[f],S=0,v=E-1;(x!==0||S<g)&&v!==-1;v--,S++)x+=256*k[v]>>>0,k[v]=x%a>>>0,x=
x/a>>>0;if(x!==0)throw new Error("Non-zero carry");g=S,f++}for(var w=E-g;w!==E&&k[w]===0;)w++;for(var I=c.repeat(b);w<E;++w)
I+=t.charAt(k[w]);return I}function h(m){if(typeof m!="string")throw new TypeError("Expected String");if(m.length===0)return new Uint8Array;
var b=0;if(m[b]!==" "){for(var g=0,f=0;m[b]===c;)g++,b++;for(var y=(m.length-b)*l+1>>>0,E=new Uint8Array(y);m[b];){var k=r[m.
charCodeAt(b)];if(k===255)return;for(var x=0,S=y-1;(k!==0||x<f)&&S!==-1;S--,x++)k+=a*E[S]>>>0,E[S]=k%256>>>0,k=k/256>>>0;
if(k!==0)throw new Error("Non-zero carry");f=x,b++}if(m[b]!==" "){for(var v=y-f;v!==y&&E[v]===0;)v++;for(var w=new Uint8Array(
g+(y-v)),I=g;v!==y;)w[I++]=E[v++];return w}}}function p(m){var b=h(m);if(b)return b;throw new Error(`Non-${e} character`)}
return{encode:u,decodeUnsafe:h,decode:p}}var Y$=X$,Z$=Y$;class e7{name;prefix;baseEncode;constructor(e,r,n){this.name=e,
this.prefix=r,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}}class t7{name;prefix;baseDecode;prefixCodePoint;constructor(e,r,n){this.name=e,this.
prefix=r;const s=r.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return uE(this,e)}}class r7{decoders;constructor(e){
this.decoders=e}or(e){return uE(this,e)}decode(e){const r=e[0],n=this.decoders[r];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function uE(t,e){return new r7({...t.decoders??{[t.prefix]:t},...e.decoders??{[e.prefix]:e}})}class n7{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,r,n,s){
this.name=e,this.prefix=r,this.baseEncode=n,this.baseDecode=s,this.encoder=new e7(e,r,n),this.decoder=new t7(e,r,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function fE({name:t,prefix:e,encode:r,decode:n}){
return new n7(t,e,r,n)}function $d({name:t,prefix:e,alphabet:r}){const{encode:n,decode:s}=Z$(r,t);return fE({prefix:e,name:t,
encode:n,decode:i=>sm(s(i))})}function s7(t,e,r,n){let s=t.length;for(;t[s-1]==="=";)--s;const i=new Uint8Array(s*r/8|0);
let o=0,a=0,c=0;for(let l=0;l<s;++l){const d=e[t[l]];if(d===void 0)throw new SyntaxError(`Non-${n} character`);a=a<<r|d,
o+=r,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=r||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}function i7(t,e,r){
const n=e[e.length-1]==="=",s=(1<<r)-1;let i="",o=0,a=0;for(let c=0;c<t.length;++c)for(a=a<<8|t[c],o+=8;o>r;)o-=r,i+=e[s&
a>>o];if(o!==0&&(i+=e[s&a<<r-o]),n)for(;(i.length*r&7)!==0;)i+="=";return i}function o7(t){const e={};for(let r=0;r<t.length;++r)
e[t[r]]=r;return e}function cs({name:t,prefix:e,bitsPerChar:r,alphabet:n}){const s=o7(n);return fE({prefix:e,name:t,encode(i){
return i7(i,n,r)},decode(i){return s7(i,s,r,t)}})}const ia=cs({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuv\
wxyz234567",bitsPerChar:5}),a7=cs({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),
c7=cs({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),l7=cs({prefix:"C",name:"\
base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),d7=cs({prefix:"v",name:"base32hex",alphabet:"\
0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),u7=cs({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJ\
KLMNOPQRSTUV",bitsPerChar:5}),f7=cs({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),
h7=cs({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),p7=cs({prefix:"h",
name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),ZO=Object.freeze(Object.defineProperty({__proto__:null,
base32:ia,base32hex:d7,base32hexpad:f7,base32hexpadupper:h7,base32hexupper:u7,base32pad:c7,base32padupper:l7,base32upper:a7,
base32z:p7},Symbol.toStringTag,{value:"Module"})),Hc=$d({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz"}),m7=$d({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),e9=Object.freeze(Object.
defineProperty({__proto__:null,base36:Hc,base36upper:m7},Symbol.toStringTag,{value:"Module"})),Vn=$d({name:"base58btc",prefix:"\
z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),g7=$d({name:"base58flickr",prefix:"Z",alphabet:"\
123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),t9=Object.freeze(Object.defineProperty({__proto__:null,base58btc:Vn,
base58flickr:g7},Symbol.toStringTag,{value:"Module"}));var b7=hE,Ry=128,y7=-128,w7=Math.pow(2,31);function hE(t,e,r){e=e||
[],r=r||0;for(var n=r;t>=w7;)e[r++]=t&255|Ry,t/=128;for(;t&y7;)e[r++]=t&255|Ry,t>>>=7;return e[r]=t|0,hE.bytes=r-n+1,e}var v7=Rh,
E7=128,Ty=127;function Rh(t,n){var r=0,n=n||0,s=0,i=n,o,a=t.length;do{if(i>=a)throw Rh.bytes=0,new RangeError("Could not\
 decode varint");o=t[i++],r+=s<28?(o&Ty)<<s:(o&Ty)*Math.pow(2,s),s+=7}while(o>=E7);return Rh.bytes=i-n,r}var k7=Math.pow(
2,7),x7=Math.pow(2,14),S7=Math.pow(2,21),A7=Math.pow(2,28),I7=Math.pow(2,35),_7=Math.pow(2,42),C7=Math.pow(2,49),R7=Math.
pow(2,56),T7=Math.pow(2,63),M7=function(t){return t<k7?1:t<x7?2:t<S7?3:t<A7?4:t<I7?5:t<_7?6:t<C7?7:t<R7?8:t<T7?9:10},B7={
encode:b7,decode:v7,encodingLength:M7},Hl=B7;function Th(t,e=0){return[Hl.decode(t,e),Hl.decode.bytes]}function Vl(t,e,r=0){
return Hl.encode(t,e,r),e}function Kl(t){return Hl.encodingLength(t)}function pE(t,e){const r=e.byteLength,n=Kl(t),s=n+Kl(
r),i=new Uint8Array(s+r);return Vl(t,i,0),Vl(r,i,n),i.set(e,s),new im(t,r,e,i)}function L7(t){const e=sm(t),[r,n]=Th(e),
[s,i]=Th(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect length");return new im(r,s,o,e)}
function D7(t,e){if(t===e)return!0;{const r=e;return t.code===r.code&&t.size===r.size&&r.bytes instanceof Uint8Array&&J$(
t.bytes,r.bytes)}}class im{code;size;digest;bytes;constructor(e,r,n,s){this.code=e,this.size=r,this.digest=n,this.bytes=
s}}function My(t,e){const{bytes:r,version:n}=t;switch(n){case 0:return N7(r,Mh(t),e??Vn.encoder);default:return P7(r,Mh(
t),e??ia.encoder)}}const By=new WeakMap;function Mh(t){const e=By.get(t);if(e==null){const r=new Map;return By.set(t,r),
r}return e}class Vt{code;version;multihash;bytes;"/";constructor(e,r,n,s){this.code=r,this.version=e,this.multihash=n,this.
bytes=s,this["/"]=s}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.
byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:r}=this;if(e!==Do)throw new Error(
"Cannot convert a non dag-pb CID to CIDv0");if(r.code!==O7)throw new Error("Cannot convert non sha2-256 multihash CID to\
 CIDv0");return Vt.createV0(r)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a \
bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:r}=this.multihash,n=pE(e,r);return Vt.createV1(
this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a\
 bug please report`)}}equals(e){return Vt.equals(this,e)}static equals(e,r){const n=r;return n!=null&&e.code===n.code&&e.
version===n.version&&D7(e.multihash,n.multihash)}toString(e){return My(this,e)}toJSON(){return{"/":My(this)}}link(){return this}[Symbol.
toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()})`}static asCID(e){if(e==null)
return null;const r=e;if(r instanceof Vt)return r;if(r["/"]!=null&&r["/"]===r.bytes||r.asCID===r){const{version:n,code:s,
multihash:i,bytes:o}=r;return new Vt(n,s,i,o??Ly(n,s,i.bytes))}else if(r[U7]===!0){const{version:n,multihash:s,code:i}=r,
o=L7(s);return Vt.create(n,i,o)}else return null}static create(e,r,n){if(typeof r!="number")throw new Error("String code\
cs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(r!==
Do)throw new Error(`Version 0 CID must use dag-pb (code: ${Do}) block encoding`);return new Vt(e,r,n,n.bytes)}case 1:{const s=Ly(
e,r,n.bytes);return new Vt(e,r,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Vt.create(0,Do,
e)}static createV1(e,r){return Vt.create(1,e,r)}static decode(e){const[r,n]=Vt.decodeFirst(e);if(n.length!==0)throw new Error(
"Incorrect length");return r}static decodeFirst(e){const r=Vt.inspectBytes(e),n=r.size-r.multihashSize,s=sm(e.subarray(n,
n+r.multihashSize));if(s.byteLength!==r.multihashSize)throw new Error("Incorrect length");const i=s.subarray(r.multihashSize-
r.digestSize),o=new im(r.multihashCode,r.digestSize,i,s);return[r.version===0?Vt.createV0(o):Vt.createV1(r.codec,o),e.subarray(
r.size)]}static inspectBytes(e){let r=0;const n=()=>{const[u,h]=Th(e.subarray(r));return r+=h,u};let s=n(),i=Do;if(s===18?
(s=0,r=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=r,a=n(),c=n(),l=r+c,d=l-o;return{version:s,
codec:i,multihashCode:a,digestSize:c,multihashSize:d,size:l}}static parse(e,r){const[n,s]=$7(e,r),i=Vt.decode(s);if(i.version===
0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Mh(i).set(n,e),i}}function $7(t,e){
switch(t[0]){case"Q":{const r=e??Vn;return[Vn.prefix,r.decode(`${Vn.prefix}${t}`)]}case Vn.prefix:{const r=e??Vn;return[
Vn.prefix,r.decode(t)]}case ia.prefix:{const r=e??ia;return[ia.prefix,r.decode(t)]}case Hc.prefix:{const r=e??Hc;return[
Hc.prefix,r.decode(t)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase d\
ecoder must be provided");return[t[0],e.decode(t)]}}}function N7(t,e,r){const{prefix:n}=r;if(n!==Vn.prefix)throw Error(`\
Cannot string encode V0 in ${r.name} encoding`);const s=e.get(n);if(s==null){const i=r.encode(t).slice(1);return e.set(n,
i),i}else return s}function P7(t,e,r){const{prefix:n}=r,s=e.get(n);if(s==null){const i=r.encode(t);return e.set(n,i),i}else
return s}const Do=112,O7=18;function Ly(t,e,r){const n=Kl(t),s=n+Kl(e),i=new Uint8Array(s+r.byteLength);return Vl(t,i,0),
Vl(e,i,n),i.set(r,s),i}const U7=Symbol.for("@ipld/js-cid/CID"),mE="3.8.1",Bh=2048,Ws=1024**3;function om(t){const e=as(t),
r=e.model,n=Object.values(Ji).filter(l=>l.model.runtime==="llama.cpp"&&l.repository===r?.repository&&l.revision===r?.revision&&
l.model.architecture===r?.architecture&&l.model.task===r?.task&&l.model.dtype===r?.dtype),s=n.length===1?n[0]:void 0;if(!s&&
r?.gguf){const l=Dd(r,{files:e.files});for(const d of Object.values(Ji))if(!(d.repository!==r.repository||d.revision!==r.
revision))for(const u of d.files.filter(h=>h.path.endsWith(".gguf"))){const h=l.weights.find(p=>p.path===u.path);if(h&&(h.
size!==u.size||h.sha256!==u.sha256))throw new Error("GGUF weights do not match the pinned catalog digests")}return{...l,
manifest:e}}if(!s||r.runtime!=="llama.cpp"||r.runtimeVersion!==void 0&&r.runtimeVersion!==mE||s.model.runtimeVersion!==void 0&&
r.runtimeVersion!==s.model.runtimeVersion||r.dtype!==s.model.dtype||r.format!=="GGUF"||r.task!=="text-generation")throw new Error(
"GGUF model revision is not in the trusted runtime catalog");const i=e.files.filter(l=>l.path.endsWith(".gguf")),o=s.files.
filter(l=>l.path.endsWith(".gguf"));if(!i.length||i.length!==o.length||i.some(l=>!o.some(d=>d.path===l.path&&d.size===l.
size&&d.sha256===l.sha256)))throw new Error("GGUF weights do not match the pinned catalog digests");const a=e.files.reduce(
(l,d)=>l+d.size,0);if(!Number.isSafeInteger(a)||a>16*Ws)throw new Error("GGUF package exceeds its byte budget");const c=i.
reduce((l,d)=>l+d.size,0)>4*Ws;return{manifest:e,weights:i,totalBytes:a,resourcePolicy:{maxModelBytes:16*Ws,minimumCpuBytes:c?
8*Ws:2*Ws,minimumGpuBytes:c?16*Ws:2*Ws}}}function gE(t,e=globalThis.location?.href){const r=new URL(e);if(!t||Object.keys(
t).some(s=>s!=="wasm")||typeof t.wasm!="string")throw new Error("GGUF runtime needs one trusted WASM asset");const n=new URL(
t.wasm,r);if(n.origin!==r.origin||!["http:","https:"].includes(n.protocol)||n.username||n.password||n.search||n.hash||!n.
pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fixed same-origin asset");return{wasm:n.href}}function bE(t={}){
if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).some(r=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(
r)))throw new Error("Unknown GGUF runtime option");const e={n_ctx:Bh,n_batch:64,n_gpu_layers:99999,n_threads:1,...t};if(!Number.
isInteger(e.n_ctx)||e.n_ctx<64||e.n_ctx>Bh||!Number.isInteger(e.n_batch)||e.n_batch<1||e.n_batch>128||!Number.isInteger(
e.n_gpu_layers)||e.n_gpu_layers<1||e.n_gpu_layers>99999||e.n_threads!==1)throw new Error("GGUF options exceed the manage\
d GPU runtime bounds");return Object.freeze(e)}async function F7({scope:t=globalThis,gpu:e=t.navigator?.gpu}={}){if(!t.crossOriginIsolated||
!t.SharedArrayBuffer)throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const r=t.WebAssembly;
if(typeof r?.Suspending!="function"||typeof r?.promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{
new r.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly me\
mory64")}const n=await e?.requestAdapter({powerPreference:"high-performance"});if(!n||n.isFallbackAdapter||n.info?.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!n.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:n.info?.vendor??"",architecture:n.info?.architecture??
"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const z7=Object.freeze({id:"\
llama.cpp",moduleUrl:"peercompute:gguf-inference",validateManifest:om,validateRuntimeAssets:gE,validateRuntimeOptions:bE,
retainArtifactBridge:!0,terminateOnUnload:!0,validateGenerationInput({image:t,maxNewTokens:e}){if(t)throw new Error("Thi\
s GGUF adapter currently accepts text only");if(!Number.isInteger(e)||e<1||e>Se.maxNewTokens)throw new Error("GGUF outpu\
t exceeds its token budget")}}),yE=Object.freeze(Object.defineProperty({__proto__:null,GGUF_CONTEXT_LIMIT:Bh,GGUF_RUNTIME_VERSION:mE,
ggufRuntimeDefinition:z7,validateGgufCapabilities:F7,validateGgufManifest:om,validateGgufRuntimeAssets:gE,validateGgufRuntimeOptions:bE},
Symbol.toStringTag,{value:"Module"})),q7="peercompute.model-artifact-read.v1",am=q7;function wE(t,e){const r=n=>e(n.data);
return t.addEventListener("message",r),t.start?.(),()=>t.removeEventListener("message",r)}function Gr(t,e,r=[]){t.postMessage(
{protocol:am,...e},r)}function r9(t,{store:e,manifest:r,chunkBytes:n=Se.chunkBytes,maxReads:s=Se.maxReads}={}){if(!e?.stat||
!e?.openRead)throw new Error("A verified artifact store is required");if(!Number.isInteger(n)||n<1||n>Se.chunkBytes||!Number.
isInteger(s)||s<1||s>Se.maxReads)throw new Error("Invalid artifact bridge bounds");const i=new Map(r.files.map(h=>[Da(h.
path),h])),o=new Map;let a=!1,c=0;async function l(h,p){const m=o.get(h);if(m){o.delete(h),m.controller.abort(p);try{await m.
iterator?.return?.()}catch{}}}async function d(h){if(a||h?.protocol!==am||typeof h.id!="string"||h.id.length>128)return;
const{id:p}=h;try{if(h.type==="cancel"){await l(p,"Reader cancelled");return}if(h.type==="open"){if(o.has(p))throw new Error(
"Duplicate artifact reader");if(o.size>=s)throw new Error("Artifact reader limit reached");const y=i.get(h.path);if(!y)throw new Error(
"Artifact path is not in the manifest");const E=h.offset??0,k=h.length??y.size-E;if(!Number.isSafeInteger(E)||!Number.isSafeInteger(
k)||E<0||k<0||E>y.size||k>y.size-E)throw new Error("Invalid artifact byte range");const x={controller:new AbortController,
remaining:k,pulling:!1};o.set(p,x);const S=await e.stat(y.cid);if(Ut(x.controller.signal),a||o.get(p)!==x)return;if(!S||
S.status!=="complete"||S.size!==y.size||S.sha256!==y.sha256)throw new Error("Model artifact is incomplete or has a diffe\
rent size");const v=await e.openRead(y.cid,{offset:E,length:k,signal:x.controller.signal});if(x.iterator=v[Symbol.asyncIterator](),
a||x.controller.signal.aborted||o.get(p)!==x){await x.iterator.return?.();return}Gr(t,{type:"ready",id:p,size:k});return}
if(h.type!=="pull")return;const m=o.get(p);if(!m?.iterator||m.pulling)throw new Error("Invalid artifact pull credit");m.
pulling=!0;const b=await m.iterator.next();if(a||m.controller.signal.aborted||o.get(p)!==m)return;if(b.done){if(m.remaining!==
0)throw new Error("Truncated model artifact");o.delete(p),Gr(t,{type:"end",id:p});return}const g=b.value;if(!(g instanceof
Uint8Array)||!g.byteLength||g.byteLength>n||g.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bo\
unds");m.remaining-=g.byteLength,m.pulling=!1,c+=g.byteLength;const f=g.slice();Gr(t,{type:"chunk",id:p,bytes:f},[f.buffer])}catch(m){
await l(p,m),a||Gr(t,{type:"error",id:p,message:m?.message||"Artifact read failed"})}}const u=wE(t,h=>{d(h)});return{getStats:()=>({
activeReads:o.size,deliveredBytes:c}),async close(){if(!a){a=!0;try{Gr(t,{type:"closed",message:"Artifact bridge closed"})}catch{}
u(),await Promise.all([...o.keys()].map(h=>l(h,"Artifact bridge closed"))),t.close()}}}}function j7(t,{manifest:e,baseUrl:r,
signal:n,chunkBytes:s=Se.chunkBytes,maxReads:i=Se.maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>Se.maxReads||
!Number.isInteger(o)||o<0||o>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(r),c=new Map(e.files.
map(f=>[Da(f.path),f])),l=new Map,d=[];let u=0,h=!1;function p(){for(;!h&&l.size<i&&d.length;){const f=d.shift();l.set(f.
id,f),f.active=!0,Gr(t,{type:"open",id:f.id,path:f.path})}}function m(f,y){l.delete(f.id);const E=d.indexOf(f);if(E>=0&&
d.splice(E,1),n?.removeEventListener("abort",f.abort),f.requestSignal?.removeEventListener("abort",f.abort),y){f.reject?.(
y);try{f.streamController?.error(y)}catch{}}f.resolvePull?.(),p()}const b=wE(t,f=>{if(f?.protocol!==am)return;const y=l.
get(f.id);if(y){if(f.type==="error"){m(y,new Error(f.message));return}if(f.type==="ready"){if(y.ready||f.size!==y.file.size){
m(y,new Error("Invalid artifact response size")),Gr(t,{type:"cancel",id:y.id});return}y.ready=!0,Gr(t,{type:"pull",id:y.
id})}else if(f.type==="chunk"){if(!y.ready||!y.resolvePull||!(f.bytes instanceof Uint8Array)||!f.bytes.byteLength||f.bytes.
byteLength>s||y.received+f.bytes.byteLength>y.file.size){Gr(t,{type:"cancel",id:y.id}),m(y,new Error("Invalid artifact c\
hunk"));return}y.received+=f.bytes.byteLength,y.streamController.enqueue(f.bytes);const E=y.resolvePull;y.resolvePull=null,
E()}else f.type==="end"&&(!y.ready||y.received!==y.file.size?m(y,new Error("Truncated artifact response")):(y.streamController.
close(),m(y)))}});async function g(f,y={}){if(h)throw new Error("Artifact bridge is closed");if(Ut(n),Ut(y.signal),y.method&&
y.method!=="GET")throw new Error("Model adapter supports GET only");const E=String(f);if(/[\\]/.test(E)||/%(?:2e|2f|5c|00)/i.
test(E)||/\/(?:\.|\.\.)(?:\/|$)/.test(E))throw new Error("Invalid artifact URL");const k=new URL(E,a);if(k.origin!==a.origin||
k.username||k.password||k.search||k.hash||!k.pathname.startsWith(a.pathname))throw new Error("Model path is outside its \
manifest");const x=Da(decodeURIComponent(k.pathname.slice(a.pathname.length))),S=c.get(x);if(!S)return new Response("Art\
ifact path is not in the manifest",{status:404});const v=`read-${++u}`,w={id:v,path:x,file:S,requestSignal:y.signal,received:0,
ready:!1,active:!1,queued:!1};w.abort=()=>{w.active&&Gr(t,{type:"cancel",id:v}),m(w,vh(n?.reason??y.signal?.reason))};const I=new ReadableStream(
{start(C){w.streamController=C},pull(){if(h)throw new Error("Artifact bridge is closed");if(Ut(n),Ut(y.signal),!w.active&&
!w.queued&&l.size>=i&&d.length>=o)throw new Error("Artifact reader limit reached");return new Promise(C=>{w.resolvePull=
C,w.ready?Gr(t,{type:"pull",id:v}):w.queued||(w.queued=!0,n?.addEventListener("abort",w.abort,{once:!0}),y.signal?.addEventListener(
"abort",w.abort,{once:!0}),d.push(w),p())})},cancel(){w.active&&Gr(t,{type:"cancel",id:v}),m(w)}},{highWaterMark:0});return new Response(
I,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"application/octet-stream"}})}return{fetch:g,close(f="\
Artifact bridge closed"){if(!h){h=!0;for(const y of[...l.values(),...d])y.active&&Gr(t,{type:"cancel",id:y.id}),m(y,vh(f));
b(),t.close()}}}}const Vc=t=>new TextEncoder().encode(t).byteLength;function G7(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function Nd(t){if(t==null)return null;
if(!Number.isSafeInteger(t.width)||!Number.isSafeInteger(t.height)||t.width<1||t.height<1||t.width*t.height>Se.maxImagePixels||
t.channels!==4||!(t.data instanceof Uint8Array||t.data instanceof Uint8ClampedArray)||t.data.byteLength!==t.width*t.height*
4||t.data.byteLength>Se.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fi\
les are not accepted");return t}function Pd(t){const e=t.messages??(typeof t.prompt=="string"?[{role:"user",content:t.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>Se.maxMessages)throw new Error("Invalid inference messages");let r=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(r+=Vc(n.content),r>Se.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function vE(t){if(!t)return;let e;const r=new Set;for(const n of[t.model,t.processor,
t.tokenizer])if(!(!n||r.has(n))){r.add(n);try{await n.dispose?.()}catch(s){e??=s}}if(e)throw e}function Lh(t,e=new Set){
if(!(!t||typeof t!="object"||e.has(t))){if(e.add(t),typeof t.dispose=="function"){t.dispose();return}for(const r of Object.
values(t))Lh(r,e)}}function W7(t){const e=t.findIndex(n=>n.role==="user");if(e<0)return null;const r=t.findIndex((n,s)=>s>
e&&n.role==="user");return r<0?null:t.filter((n,s)=>s<e||s>=r||n.role==="system")}function H7(t,e,r){const n={...t.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,t.generation_config);const s=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],i=e.at(-1),o=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return o(i)&&s.some(a=>o(a)&&BigInt(a)===BigInt(i))?"stop":e.length>=r?"length":"unknown"}function hn(t,e,r){const n=t===
"out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${t}: ${String(
e?.message??e??"operation failed").slice(0,240)}`,s=new Error(`Model session lost: ${r} ${n}`,{cause:e});return s.code=t===
"out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",s}function V7(t){let e,r,n=!1;const s=a=>{n||(t.lost=!0,(!t.
gpuFailure||a.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(t.gpuFailure=a),t.active?.abort(a))},i=({error:a})=>s(hn(a?.constructor?.
name==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",a,r?.stage??"resident model")),o=()=>{if(!(!r||r.device)){
r.device=e;for(const a of["validation","out-of-memory","internal"])e.pushErrorScope(a),r.filters.push(a)}};return{attach(a){
if(e&&e!==a)throw hn("device changed",null,"load");if(!e){if(!a||typeof a.pushErrorScope!="function"||typeof a.popErrorScope!=
"function"||typeof a.queue?.onSubmittedWorkDone!="function"||typeof a.addEventListener!="function"||typeof a.removeEventListener!=
"function"||typeof a.destroy!="function"||typeof a.lost?.then!="function")throw hn("device unavailable",null,"load");e=a,
t.runtimeDevice=e,e.addEventListener("uncapturederror",i),e.lost.then(c=>s(hn("device lost",c,r?.stage??"resident model")),
c=>s(hn("device lost",c,r?.stage??"resident model")))}try{o()}catch(c){const l=hn("error scope failure",c,r?.stage??"loa\
d");throw s(l),l}},async run(a,c){if(t.lost)throw t.gpuFailure??hn("device lost",null,a);if(r)throw new Error("Overlappi\
ng model GPU operations are not allowed");const l={stage:a,filters:[],device:null};r=l;let d,u;try{if(e&&this.attach(e),
d=await c(),!e)throw hn("device unavailable",null,a)}catch(m){u=m}if(e)try{await e.queue.onSubmittedWorkDone()}catch(m){
s(hn("queue failure",m,a))}const h=await Promise.all(l.filters.reverse().map(async m=>{try{return{filter:m,error:await l.
device.popErrorScope()}}catch(b){return{filter:m,error:b,scopeFailed:!0}}}));r=null;for(const m of h)m.scopeFailed&&s(hn(
"error scope failure",m.error,a));const p=["out-of-memory","internal","validation"].map(m=>h.find(b=>b.filter===m&&b.error&&
!b.scopeFailed)).find(Boolean);if(p&&s(hn(p.filter,p.error,a)),u instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.
test(u?.message??"")){const m=new Error("Model session lost: native inference runtime failed",{cause:u});m.code="ERR_MOD\
EL_RUNTIME",s(m)}if(typeof u?.code=="string"&&u.code.startsWith("ERR_MODEL_GPU")&&s(u),t.gpuFailure)throw t.gpuFailure;if(u)
throw u;return d},dispose(){n=!0,e?.removeEventListener("uncapturederror",i)}}}function K7(t){const e=["maxBindGroups","\
maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBi\
ndingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","ma\
xComputeWorkgroupSizeZ"],r={};for(const s of e){const i=t.limits?.[s];if(!Number.isSafeInteger(i)||i<=0)throw new Error(
`WebGPU adapter has an invalid ${s} limit`);r[s]=i}const n=["chromium-experimental-subgroup-matrix","timestamp-query","s\
hader-f16","subgroups","subgroup-size-control"].filter(s=>t.features.has(s));return{requiredLimits:r,requiredFeatures:n}}
async function Dy(t){await vE(t.components),t.restoreGpuEvidence?.(),t.gpuGuard?.dispose(),t.ownedDevice?.destroy(),t.ownedDevice=
null}async function Q7({library:t,modelPath:e,options:r,manifest:n,adapterFeatures:s=[]}){const i={};try{const o=await t.
AutoConfig.from_pretrained(e,r),a=J1(n.model,o);for(const l of a)if(!s.includes(l))throw new Error(`Model config require\
s unsupported GPU feature: ${l}`);const c={...r,config:o};if(n.model.architecture==="qwen3_5"&&(c.use_external_data_format=
1),n.model.task==="image-text-to-text"){if(i.processor=await t.AutoProcessor.from_pretrained(e,r),n.model.architecture===
"qwen3_5"){const l=i.processor.image_processor;if(!l)throw new Error("Qwen3.5 image processor is unavailable");l.min_pixels=
256*256,l.max_pixels=Za(n.model).maxProcessedImagePixels,l.do_normalize??=!0}i.tokenizer=i.processor.tokenizer,i.model=await t.
AutoModelForImageTextToText.from_pretrained(e,c)}else i.tokenizer=await t.AutoTokenizer.from_pretrained(e,r),i.model=await t.
AutoModelForCausalLM.from_pretrained(e,c);return i}catch(o){throw await vE(i),o}}function $y(t){return{sessionId:t.sessionId,
manifestCid:t.manifestCid,status:t.lost?"lost":t.status,task:t.manifest.model.task,dtype:t.manifest.model.dtype,workerId:t.
workerId,adapter:t.adapter,runtimeAdapter:t.runtimeAdapter??null,gpuDispatches:t.gpuDispatches??0,gpuSubmissions:t.gpuSubmissions??
0,gpuProfileSamples:t.gpuProfileSamples??0,collectGpuEvidence:t.collectGpuEvidence===!0,runtimeFeatures:t.runtimeFeatures??
[],generatedRequests:t.generatedRequests}}function EE({loadLibrary:t=()=>Ft(()=>import("./transformers.web-DGNMtDcj.js"),
[],import.meta.url),loadModel:e=Q7,gpu:r=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=G7}={}){
const i=new Map;let o;async function a(l,d){if(i.size)throw new Error("This inference worker already has a resident/load\
ing model");const u=Ho(l.sessionId),{manifest:h}=Y1(l.manifest),p=Z1(l.runtimeAssets,n);if(!l.artifactPort?.postMessage)
throw new Error("An artifact reader port is required");Ut(d.signal);const m={sessionId:u,manifest:h,manifestCid:l.manifestCid,
status:"loading",workerId:d.workerId??null,generatedRequests:0,components:null};i.set(u,m);let b;try{const g=await r?.requestAdapter(
{powerPreference:"high-performance"});if(Ut(d.signal),!g||g.info?.isFallbackAdapter||g.isFallbackAdapter)throw new Error(
"A hardware WebGPU adapter is required; CPU/software fallback is disabled");const f=typeof h.model.dtype=="string"?[h.model.
dtype]:Object.values(h.model.dtype),y=new Set(h.model.requiredFeatures??[]);f.some(I=>["fp16","q4f16"].includes(I))&&y.add(
"shader-f16");for(const I of y)if(!g.features.has(I))throw new Error(`Model requires unsupported GPU feature: ${I}`);m.adapter=
{vendor:g.info?.vendor??"",architecture:g.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...y]};const E=await(o??=
t());if(Ut(d.signal),E.env.version!==Ld)throw new Error("Unexpected Transformers runtime version");const k=new URL("/__p\
eercompute_models/",n);b=j7(l.artifactPort,{manifest:h,baseUrl:new URL(`${u}/`,k).href,signal:d.signal});const{env:x}=E;
x.logLevel=50,x.allowLocalModels=!0,x.allowRemoteModels=!1,x.localModelPath=k.pathname,x.useBrowserCache=!1,x.useFSCache=
!1,x.useWasmCache=!1,x.fetch=async(...I)=>{try{return await b.fetch(...I)}catch(C){throw d.emitProgress?.({type:"artifac\
t-read-error",sessionId:u,message:C.message}),C}},x.backends.onnx.wasm.proxy=!1,x.backends.onnx.wasm.numThreads=1,x.backends.
onnx.wasm.wasmPaths=p,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=l.collectGpuEvidence===
!0,x.backends.onnx.webgpu&&(x.backends.onnx.webgpu.profiling={mode:l.collectGpuEvidence===!0?"default":"off",ondata:()=>{
m.gpuProfileSamples+=1}});const S={local_files_only:!0,device:"webgpu",dtype:h.model.dtype,session_options:{executionProviders:[
"webgpu"]},progress_callback:I=>{d.signal?.aborted||d.emitProgress?.({type:"model-load",sessionId:u,status:String(I.status??
"").slice(0,40),file:typeof I.file=="string"?I.file.slice(0,512):void 0,loaded:Number.isFinite(I.loaded)?I.loaded:void 0,
total:Number.isFinite(I.total)?I.total:void 0})}};m.library=E,m.gpuGuard=V7(m),await m.gpuGuard.run("load",async()=>{const I=x.
backends.onnx.webgpu;if(!I)throw new Error("The WebGPU runtime is unavailable");I.adapter=g,m.ownedDevice=await g.requestDevice(
K7(g)),m.gpuGuard.attach(m.ownedDevice),S.session_options.executionProviders=[{name:"webgpu",device:m.ownedDevice}],m.components=
await e({library:E,modelPath:u,options:S,manifest:h,adapterFeatures:[...g.features]});for(const C of y)if(!m.runtimeDevice.
features.has(C))throw new Error(`ORT device is missing required GPU feature: ${C}`);Ut(d.signal)});const v=m.runtimeDevice;
if(m.runtimeFeatures=[...v?.features??[]],m.collectGpuEvidence&&v){const I=v.createCommandEncoder.bind(v),C=v.queue.submit.
bind(v.queue),R=Object.getOwnPropertyDescriptor(v,"createCommandEncoder"),N=Object.getOwnPropertyDescriptor(v.queue,"sub\
mit");m.restoreGpuEvidence=()=>{R?Object.defineProperty(v,"createCommandEncoder",R):delete v.createCommandEncoder,N?Object.
defineProperty(v.queue,"submit",N):delete v.queue.submit,m.restoreGpuEvidence=null},v.createCommandEncoder=(...D)=>{const P=I(
...D),j=P.beginComputePass.bind(P);return P.beginComputePass=(...Z)=>{const X=j(...Z);for(const q of["dispatchWorkgroups",
"dispatchWorkgroupsIndirect"]){const ue=X[q].bind(X);X[q]=(...he)=>{const ze=ue(...he);return m.gpuDispatches+=1,ze}}return X},
P},v.queue.submit=(...D)=>{const P=C(...D);return m.gpuSubmissions+=1,P}}const w=v?.adapterInfo??x.backends.onnx.webgpu?.
adapter?.info;if(w){if(w.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");m.runtimeAdapter={vendor:w.
vendor,architecture:w.architecture,isFallbackAdapter:w.isFallbackAdapter??!1}}if(Ut(d.signal),m.lost)throw m.gpuFailure;
return m.status="ready",$y(m)}catch(g){try{await Dy(m),i.delete(u)}catch(f){m.status="ready",m.lost=!0;const y=new Error(
`MODEL_DISPOSE_FAILED: ${f.message}`);throw y.code="MODEL_DISPOSE_FAILED",y}throw g}finally{b?.close(),b||l.artifactPort.
close()}}async function c(l,d){const u=i.get(Ho(l.sessionId));if(!u||u.lost)throw new Error("Model session lost or not l\
oaded");if(u.status!=="ready")throw new Error("Model session is busy");const h=Ho(l.requestId),p=l.maxNewTokens??Se.maxNewTokens;
if(!Number.isInteger(p)||p<1||p>Se.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let m=Pd(l);
const b=Nd(l.image);if(b&&u.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image \
inputs");Ut(d.signal);const g=new AbortController,f=new u.library.InterruptableStoppingCriteria,y=()=>{g.abort(d.signal?.
reason),f.interrupt()};d.signal?.addEventListener("abort",y,{once:!0}),g.signal.addEventListener("abort",()=>f.interrupt(),
{once:!0}),u.active=g,u.requestId=h,u.status="generating";let E,k,x=0,S=0,v,w=!1;const I=u.gpuDispatches??0,C=u.gpuSubmissions??
0;try{Ut(d.signal);const{tokenizer:R,processor:N,model:D}=u.components;let P;for(;;){Ut(g.signal);let ue=m;if(N&&(ue=m.map(
Ie=>({role:Ie.role,content:[{type:"text",text:Ie.content}]})),b)){const Ie=ue.findLast(U=>U.role==="user");if(!Ie)throw new Error(
"An image requires a user message");Ie.content.unshift({type:"image"})}const he=(N??R).apply_chat_template(ue,{tokenize:!1,
add_generation_prompt:!0,enable_thinking:!1});if(typeof he!="string"||Vc(he)>Se.maxPromptBytes)throw new Error("Template\
d prompt exceeds its byte budget");if(b){const Ie=new u.library.RawImage(b.data,b.width,b.height,b.channels);E=await N(he,
Ie,{do_image_splitting:!1})}else E=await R(he,{truncation:!1,padding:!1});if(Ut(g.signal),P=E.input_ids?.dims?.at(-1),!Number.
isSafeInteger(P)||P<1)throw new Error("Invalid model input token count");if(P+p<=Se.maxContextTokens)break;const ze=W7(m);
if(!ze)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or req\
uest fewer output tokens");const be=E;E=void 0,Lh(be),m=ze,w=!0}Ut(g.signal);const j=new u.library.TextStreamer(R,{skip_prompt:!0,
skip_special_tokens:!0,callback_function:ue=>{if(!(g.signal.aborted||v)){if(S+=Vc(ue),S>Se.maxOutputBytes){v=new Error("\
Generated text exceeded its byte budget"),g.abort(v);return}try{if(d.emitProgress?.({type:"token",sessionId:u.sessionId,
requestId:h,sequence:x++,text:ue})===!1)throw new Error("Token consumer rejected output")}catch(he){v=he,g.abort(he)}}}});
if(await u.gpuGuard.run("generation",async()=>{k=await D.generate({...E,max_new_tokens:p,do_sample:!1,streamer:j,stopping_criteria:[
f]})}),v)throw v;if(u.lost)throw u.gpuFailure;Ut(g.signal);const Z=k.tolist();if(Z.length!==1||Z[0].length<P||Z[0].length>
P+p)throw new Error("Model returned an over-budget token sequence");const X=Z[0].slice(P),q=R.decode(X,{skip_special_tokens:!0});
if(Vc(q)>Se.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");return u.generatedRequests+=1,{sessionId:u.
sessionId,requestId:h,text:q,inputTokens:P,outputTokens:X.length,finishReason:H7(D,X,p),contextTruncated:w,workerId:u.workerId,
gpuDispatches:(u.gpuDispatches??0)-I,gpuSubmissions:(u.gpuSubmissions??0)-C,gpuProfileSamples:u.gpuProfileSamples??0}}catch(R){
throw u.gpuFailure??R}finally{d.signal?.removeEventListener("abort",y);try{const R=new Set;let N;for(const D of[E,k])try{
Lh(D,R)}catch(P){N??=P}if(N){u.lost=!0;const D=u.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:N});
throw D.code??="MODEL_DISPOSE_FAILED",u.gpuFailure=D,D}}finally{u.active=null,u.requestId=null,u.status="ready"}}}return async function(d={},u={}){
if(s(),d.command==="load")return a(d,u);if(d.command==="generate")return c(d,u);const h=i.get(Ho(d.sessionId));if(d.command===
"status")return h?$y(h):{sessionId:d.sessionId,status:"absent"};if(d.command==="cancel")return h?.requestId===d.requestId&&
h.active?.abort("Generation cancelled"),{sessionId:d.sessionId,cancellationRequested:!0};if(d.command==="unload"){if(!h)
return{sessionId:d.sessionId,status:"absent"};if(h.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");h.status="unloading";try{await Dy(h)}catch(p){h.status="ready",h.lost=!0;const m=new Error(`MODEL_DIS\
POSE_FAILED: ${p.message}`);throw m.code="MODEL_DISPOSE_FAILED",m}return i.delete(d.sessionId),{sessionId:d.sessionId,status:"\
unloaded"}}throw new Error("Unknown model task command")}}const J7=EE(),X7=(t,e)=>J7(t,e),Y7=Object.freeze(Object.defineProperty(
{__proto__:null,createModelTaskRuntime:EE,handleModelTask:X7,normalizeModelMessages:Pd,validateImageInput:Nd},Symbol.toStringTag,
{value:"Module"})),kE="1.31.1",Z7=512*512*4,Ic=1024**3;function Od(t){const e=as(t),r=e.model,n=Object.values(Ja).find(i=>i.
model.repository===r?.repository&&i.model.revision===r?.revision&&i.model.pipeline===r?.pipeline);if(!n||r.runtime!=="on\
nx-diffusion"||r.runtimeVersion!==kE||r.task!=="text-to-image"||r.architecture!==n.model.architecture||JSON.stringify(r.
modalities)!=='["text"]'||JSON.stringify(r.outputModalities)!=='["image"]'||e.files.length!==n.files.length)throw new Error(
"Diffusion package is not in the trusted runtime catalog");for(const i of["format","dtype","steps","width","height","pad\
TokenId","weightQuantization","requiredFeatures"]){const o=(a,c)=>a&&c&&typeof a=="object"&&typeof c=="object"?Object.keys(
a).length===Object.keys(c).length&&Object.keys(a).every(l=>o(a[l],c[l])):a===c;if(!o(r[i],n.model[i]))throw new Error(`D\
iffusion ${i} differs from the trusted profile`)}for(const i of n.files){const o=e.files.find(a=>a.path===i.path);if(!o||
o.size!==i.size||o.sha256!==i.sha256)throw new Error("Diffusion files differ from pinned catalog digests")}const s=e.files.
reduce((i,o)=>i+o.size,0);if(!Number.isSafeInteger(s)||s>3*Ic)throw new Error("Diffusion package exceeds its admitted by\
te budget");return{manifest:e,trusted:n,totalBytes:s,resourcePolicy:{maxModelBytes:3*Ic,minimumCpuBytes:8*Ic,minimumGpuBytes:8*
Ic}}}function xE(t,e){const{trusted:r}=Od(e);if(t.image)throw new Error("This diffusion runtime accepts text only");const n=Pd(
t);if(n.length!==1||n[0].role!=="user")throw new Error("Diffusion requires exactly one user prompt");const s=n[0].content.
trim();if(!s||new TextEncoder().encode(s).length>4096)throw new Error("Diffusion needs a text prompt of at most 4096 byt\
es");const i=t.seed??crypto.getRandomValues(new Uint32Array(1))[0];if(!Number.isSafeInteger(i)||i<0||i>4294967295)throw new Error(
"Diffusion seed must be uint32");const o=t.steps??r.steps;if(o!==r.steps||(t.width??512)!==512||(t.height??512)!==512)throw new Error(
`This diffusion profile requires 512×512 and ${r.steps} steps`);return{task:"text-to-image",prompt:s,messages:[{role:"u\
ser",content:s}],seed:i,steps:o,width:512,height:512}}function SE(t,e=globalThis.location?.href){if(!t||Object.keys(t).some(
s=>!["mjs","wasm"].includes(s)))throw new Error("Unexpected diffusion runtime assets");const r=new URL(e),n={};for(const s of[
"mjs","wasm"]){if(typeof t[s]!="string")throw new Error("Trusted diffusion runtime assets are required");const i=new URL(
t[s],r);if(i.origin!==r.origin||i.username||i.password||i.hash||!["http:","https:"].includes(i.protocol)||!new RegExp(`(\
?:^|/)ort-wasm-simd-threaded\\.jsep(?:-[A-Za-z0-9_-]+)?\\.${s}$`).test(i.pathname))throw new Error("Diffusion assets mus\
t be same-origin ORT JSEP files");n[s]=i.href}return n}const eN=Object.freeze({id:"onnx-diffusion",moduleUrl:"peercomput\
e:diffusion-inference",validateManifest:Od,validateRuntimeAssets:SE,normalizeGenerationInput:xE,validateRuntimeOptions(t){
if(!t||typeof t!="object"||Array.isArray(t)||Object.keys(t).length)throw new Error("Diffusion runtime options are fixed \
by the trusted model profile");return{}},terminateOnUnload:!0}),tN=Object.freeze(Object.defineProperty({__proto__:null,DIFFUSION_IMAGE_BYTES:Z7,
DIFFUSION_RUNTIME_VERSION:kE,diffusionRuntimeDefinition:eN,normalizeDiffusionInput:xE,validateDiffusionManifest:Od,validateDiffusionRuntimeAssets:SE},
Symbol.toStringTag,{value:"Module"}));function AE(t){if(!t||JSON.stringify(t).length>256*1024)throw new Error("Invalid H\
ub package metadata");const e=structuredClone(t),r=e.model;if(!r||e.repository!==r.repository||e.revision!==r.revision||
!/^[a-f0-9]{40}$/.test(e.revision??""))throw new Error("Hub packages require a pinned immutable revision");if(!Array.isArray(
e.files)||!e.files.length||e.files.length>1024)throw new Error("Invalid Hub package files");let n=0;const s=e.files.map(
a=>{if($a(e.repository,e.revision,a.path),!Number.isSafeInteger(a.size)||a.size<0)throw new Error("Invalid Hub file size");
if(a.sha256!==void 0&&!/^[a-f0-9]{64}$/.test(a.sha256))throw new Error("Invalid Hub SHA256");if(a.gitBlobSha1!==void 0&&
!/^[a-f0-9]{40}$/.test(a.gitBlobSha1))throw new Error("Invalid Hub Git digest");if(!a.sha256&&!a.gitBlobSha1)throw new Error(
"Hub file has no verifiable digest");if(/\.(onnx(?:_data(?:_\d+)?)?|gguf|bin)$/i.test(a.path)&&!a.sha256)throw new Error(
"Model weight files require SHA256");n+=a.size;const c=a.sha256??"0".repeat(64),l=Uint8Array.from(c.match(/../g),d=>Number.
parseInt(d,16));return{path:a.path,size:a.size,sha256:c,cid:Vt.createV1(85,pE(18,l)).toString()}});if(!Number.isSafeInteger(
n)||e.totalBytes!==n)throw new Error("Hub package size does not match selected files");const i={schema:"peercompute.arti\
fact.manifest.v1",name:String(e.name??e.repository).slice(0,256),...e.description?{description:String(e.description).slice(
0,4e3)}:{},model:r,files:s,provenance:{...e.provenance,source:"huggingface",repository:e.repository,revision:e.revision,
...e.license?{license:e.license}:{}}},o=as(i);if(r.runtime==="transformers.js")Y1(o);else if(r.runtime==="llama.cpp")om(
o);else if(r.runtime==="onnx-diffusion")Od(o);else throw new Error("This Hub package has no supported runtime");return{...i,
files:e.files.map(({path:a,size:c,sha256:l,gitBlobSha1:d})=>({path:a,size:c,...l?{sha256:l}:{},...d?{gitBlobSha1:d}:{}}))}}
const Dh=t=>Array.isArray(t)?t.map(Dh):t&&typeof t=="object"?Object.fromEntries(Object.keys(t).sort().map(e=>[e,Dh(t[e])])):
t,Ny=t=>JSON.stringify(Dh(t));function $h(t,e){return!t||!e||t.model?.repository!==e.model?.repository||t.model?.revision!==
e.model?.revision||t.model?.runtime!==e.model?.runtime||Ny(t.model)!==Ny(e.model)?!1:t.files?.length===e.files?.length&&
e.files.every(r=>t.files.some(n=>n.path===r.path&&n.size===r.size&&(!r.sha256||n.sha256===r.sha256)))}async function rN(t,e,r,{
signal:n}={}){if(!$h(e,r))return!1;for(const s of r.files.filter(i=>i.gitBlobSha1&&!i.sha256)){n?.throwIfAborted();const i=e.
files.find(c=>c.path===s.path),o=nm.create().update(new TextEncoder().encode(`blob ${s.size}\0`));let a=0;try{for await(const c of t.
openRead(i.cid,{signal:n})){if(n?.throwIfAborted(),a+=c.byteLength,a>s.size)return!1;o.update(c)}}catch{return n?.throwIfAborted(),
!1}if(a!==s.size||La(o.digest())!==s.gitBlobSha1)return!1}return n?.throwIfAborted(),!0}function nN(t,e){return e?.files?
{...t,files:t.files.map(r=>{if(!r.sha256)return r;const n=e.files.find(s=>s.path===r.path&&s.size===r.size&&s.sha256===r.
sha256);if(!n?.cid)return r;try{return{...r,cid:Je(n.cid).toString()}}catch{return r}})}:t}function ws(t=0){return new Uint8Array(
t)}function Ql(t=0){return new Uint8Array(t)}function sN(t){return t?.buffer instanceof ArrayBuffer}function iN(t){if(sN(
t))return t;const e=t.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Py(t,e){e==null&&(e=t.reduce((s,i)=>s+
i.length,0));const r=Ql(e);let n=0;for(const s of t)r.set(s,n),n+=s.length;return iN(r)}function oN(t,e){if(t===e)return!0;
if(t.byteLength!==e.byteLength)return!1;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return!1;return!0}const IE=Symbol.
for("@achingbrain/uint8arraylist");function Oy(t,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let r=0;
for(const n of t){const s=r+n.byteLength;if(e<s)return{buf:n,index:e-r};r=s}throw new RangeError("index is out of bounds")}
function _c(t){return!!t?.[IE]}class $s{bufs;length;[IE]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.
appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let r=0;for(const n of e)if(n instanceof Uint8Array)r+=n.byteLength,this.bufs.push(n);else if(_c(n)){r+=n.byteLength;for(const s of n.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
r}prepend(...e){this.prependAll(e)}prependAll(e){let r=0;for(const n of e.reverse())if(n instanceof Uint8Array)r+=n.byteLength,
this.bufs.unshift(n);else if(_c(n))r+=n.byteLength,this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=r}get(e){const r=Oy(this.bufs,e);return r.buf[r.index]}set(e,r){
const n=Oy(this.bufs,e);n.buf[n.index]=r}write(e,r=0){if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(r+n,
e[n]);else if(_c(e))for(let n=0;n<e.length;n++)this.set(r+n,e.get(n));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,r){const{
bufs:n,length:s}=this._subList(e,r);return Py(n,s)}subarray(e,r){const{bufs:n,length:s}=this._subList(e,r);return n.length===
1?n[0]:Py(n,s)}sublist(e,r){const{bufs:n,length:s}=this._subList(e,r),i=new $s;return i.length=s,i.bufs=n,i}_subList(e,r){
if(e=e??0,r=r??this.length,e<0&&(e=this.length+e),r<0&&(r=this.length+r),e<0||r>this.length)throw new RangeError("index \
is out of bounds");if(e===r)return{bufs:[],length:0};if(e===0&&r===this.length)return{bufs:[...this.bufs],length:this.length};
const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,d=r>a&&r<=c;if(l&&d){if(e===a&&r===c){n.push(o);break}const u=e-a;n.push(o.subarray(u,u+(r-e)));break}if(l){if(e===
0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(d){if(r===c){n.push(o);break}n.push(o.subarray(0,r-a));break}n.
push(o)}return{bufs:n,length:r-e}}indexOf(e,r=0){if(!_c(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();if(r=Number(r??0),isNaN(
r)&&(r=0),r<0&&(r=this.length+r),r<0&&(r=0),e.length===0)return r>this.length?this.length:r;const s=n.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let u=0;u<i;u++)o[u]=-1;
for(let u=0;u<s;u++)o[n[u]]=u;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let d;for(let u=r;u<=c;u+=d){d=0;
for(let h=l;h>=0;h--){const p=this.get(u+h);if(n[h]!==p){d=Math.max(1,h-a[p]);break}}if(d===0)return u}return-1}getInt8(e){
const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).getInt8(0)}setInt8(e,r){const n=Ql(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,r),this.write(n,e)}getInt16(e,r){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,r)}setInt16(e,r,n){const s=ws(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,r,n),this.write(s,e)}getInt32(e,r){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,r)}setInt32(e,r,n){const s=ws(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,r,n),this.write(s,e)}getBigInt64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,r)}setBigInt64(e,r,n){const s=ws(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,r,n),this.write(s,e)}getUint8(e){const r=this.subarray(e,e+1);return new DataView(r.buffer,r.byteOffset,r.byteLength).
getUint8(0)}setUint8(e,r){const n=Ql(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,r),this.write(n,e)}getUint16(e,r){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,r)}setUint16(e,r,n){const s=ws(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,r,n),this.write(s,e)}getUint32(e,r){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,r)}setUint32(e,r,n){const s=ws(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,r,n),this.write(s,e)}getBigUint64(e,r){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,r)}setBigUint64(e,r,n){const s=ws(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,r,n),this.write(s,e)}getFloat32(e,r){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,r)}setFloat32(e,r,n){const s=ws(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,r,n),this.write(s,e)}getFloat64(e,r){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,r)}setFloat64(e,r,n){const s=ws(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,r,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof $s)||e.bufs.length!==this.bufs.length)return!1;for(let r=0;r<
this.bufs.length;r++)if(!oN(this.bufs[r],e.bufs[r]))return!1;return!0}static fromUint8Arrays(e,r){const n=new $s;return n.
bufs=e,r==null&&(r=e.reduce((s,i)=>s+i.byteLength,0)),n.length=r,n}}class n9 extends Error{static name="AbortError";constructor(e="\
The operation was aborted"){super(e),this.name="AbortError"}}class s9 extends Error{static name="UnexpectedPeerError";constructor(e="\
Unexpected Peer"){super(e),this.name="UnexpectedPeerError"}}class i9 extends Error{static name="InvalidCryptoExchangeErr\
or";constructor(e="Invalid crypto exchange"){super(e),this.name="InvalidCryptoExchangeError"}}class aN extends Error{static name="\
InvalidParametersError";constructor(e="Invalid parameters"){super(e),this.name="InvalidParametersError"}}class o9 extends Error{static name="\
InvalidPublicKeyError";constructor(e="Invalid public key"){super(e),this.name="InvalidPublicKeyError"}}class a9 extends Error{static name="\
InvalidPrivateKeyError";constructor(e="Invalid private key"){super(e),this.name="InvalidPrivateKeyError"}}class c9 extends Error{static name="\
ConnectionClosedError";constructor(e="The connection is closed"){super(e),this.name="ConnectionClosedError"}}class l9 extends Error{static name="\
ConnectionFailedError";constructor(e="Connection failed"){super(e),this.name="ConnectionFailedError"}}class d9 extends Error{static name="\
MuxerClosedError";constructor(e="The muxer is closed"){super(e),this.name="MuxerClosedError"}}class u9 extends Error{static name="\
StreamResetError";constructor(e="The stream has been reset"){super(e),this.name="StreamResetError"}}class f9 extends Error{static name="\
StreamStateError";constructor(e="The stream is in an invalid state"){super(e),this.name="StreamStateError"}}class cN extends Error{static name="\
StreamBufferError";constructor(e="The stream buffer was full"){super(e),this.name="StreamBufferError"}}class h9 extends Error{static name="\
NotFoundError";constructor(e="Not found"){super(e),this.name="NotFoundError"}}class p9 extends Error{static name="Invali\
dPeerIdError";constructor(e="Invalid PeerID"){super(e),this.name="InvalidPeerIdError"}}class m9 extends Error{static name="\
InvalidMultiaddrError";constructor(e="Invalid multiaddr"){super(e),this.name="InvalidMultiaddrError"}}class g9 extends Error{static name="\
InvalidCIDError";constructor(e="Invalid CID"){super(e),this.name="InvalidCIDError"}}class b9 extends Error{static name="\
InvalidMultihashError";constructor(e="Invalid Multihash"){super(e),this.name="InvalidMultihashError"}}class y9 extends Error{static name="\
UnsupportedProtocolError";constructor(e="Unsupported protocol error"){super(e),this.name="UnsupportedProtocolError"}}class w9 extends Error{static name="\
InvalidMessageError";constructor(e="Invalid message"){super(e),this.name="InvalidMessageError"}}class v9 extends Error{static name="\
ProtocolError";constructor(e="Protocol error"){super(e),this.name="ProtocolError"}}let E9=class extends Error{static name="\
TimeoutError";constructor(e="Timed out"){super(e),this.name="TimeoutError"}};class x9 extends Error{static name="NotStar\
tedError";constructor(e="Not started"){super(e),this.name="NotStartedError"}}class S9 extends Error{static name="DialErr\
or";constructor(e="Dial error"){super(e),this.name="DialError"}}class A9 extends Error{static name="ListenError";constructor(e="\
Listen error"){super(e),this.name="ListenError"}}class I9 extends Error{static name="LimitedConnectionError";constructor(e="\
Limited connection"){super(e),this.name="LimitedConnectionError"}}class _9 extends Error{static name="TooManyInboundProt\
ocolStreamsError";constructor(e="Too many inbound protocol streams"){super(e),this.name="TooManyInboundProtocolStreamsEr\
ror"}}class C9 extends Error{static name="TooManyOutboundProtocolStreamsError";constructor(e="Too many outbound protocol\
 streams"){super(e),this.name="TooManyOutboundProtocolStreamsError"}}class R9 extends Error{static name="UnsupportedKeyT\
ypeError";constructor(e="Unsupported key type"){super(e),this.name="UnsupportedKeyTypeError"}}class cm extends Error{name="\
TimeoutError";constructor(e,r){super(e,r),Error.captureStackTrace?.(this,cm)}}const lN=t=>"reason"in t?t.reason:new DOMException(
"This operation was aborted.","AbortError"),dN=2**31-1,uN=(t,e)=>{if(typeof t!="number"||Math.sign(t)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function fN(t,e){
const{milliseconds:r,fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
t.cancel?.()}catch{}},u=new Promise((h,p)=>{const m=()=>{p(lN(o)),l()},b=uN(r,i);try{b?p(b):o?.aborted?m():o&&(c=m,o.addEventListener(
"abort",c,{once:!0}))}finally{t.then(h,p)}if(b||o?.aborted||r>dN)return;const g=n||s===!1||s instanceof Error?void 0:new cm(
s??`Promise timed out after ${r} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(n)try{h(n())}catch(f){p(f)}else s===!1?
h():p(s instanceof Error?s:g);l()},r)}).finally(()=>{try{u.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return u.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},u}const _E=t=>typeof t=="function"?{filter:t}:
{...t},hN=t=>t===1/0||Number.isSafeInteger(t)&&t>=0,pN=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],mN=t=>{for(const[e,r]of pN){const n=t?.[e],s=t?.[r];if(typeof n=="function"&&typeof s=="functi\
on")return{addListener:n.bind(t),removeListener:s.bind(t)}}throw new TypeError("Emitter is not compatible")},gN=t=>{const e=new Map;
for(const[r,n]of t)for(const s of Array.isArray(r)?r:[r])e.has(s)||e.set(s,n);return e},bN=({addListener:t,removeListener:e,
handlers:r,signal:n,abortHandler:s,isDone:i})=>{n?.addEventListener("abort",s,{once:!0});for(const[o,a]of r)if(t(o,a),i()){
e(o,a);return}},yN=({removeListener:t,handlers:e,signal:r,abortHandler:n})=>{for(const[s,i]of e)t(s,i);r?.removeEventListener(
"abort",n)},wN=(t,e,r)=>{let n=Promise.resolve();return(s,i)=>{n=n.then(async()=>{if(e())return;let o;try{o=t?await t(s):
!0}catch(a){e()||r(a);return}e()||i(o)})}};function vN(t,e,r){let n=()=>{},s=!1,i;const o=new Promise((a,c)=>{r=_E(r);const{
filter:l}=r;if(!hN(r.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof r.timeout==
"number"&&!(r.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${r.timeout}\
\``);r.signal?.throwIfAborted();const{addListener:d,removeListener:u}=mN(t);if(r.count===0){a([]);return}const h=[],p=k=>{
n(),c(k)},m=wN(l,()=>s,p),b=k=>{h.push(k),r.count===h.length&&(n(),a(h))},g=(...k)=>{if(s)return;const x=r.multiArgs?k:k[0];
if(!l){b(x);return}m(x,S=>{S&&b(x)})},f=(...k)=>{p(r.rejectionMultiArgs?k:k[0])},y=()=>{p(r.signal.reason)},E={addListener:d,
removeListener:u,handlers:gN([[e,g],[r.rejectionEvents??["error"],f]]),signal:r.signal,abortHandler:y,isDone:()=>s};n=()=>{
s=!0,clearTimeout(i),yN(E)},bN(E),!(s||!r.resolveImmediately)&&(Number.isFinite(r.timeout)&&r.timeout<=2**31-1&&(i=setTimeout(
n,r.timeout)),a(h))});if(o.cancel=n,typeof r.timeout=="number"&&r.timeout>0&&!r.resolveImmediately){const a=fN(o,{milliseconds:r.
timeout});return a.cancel=()=>{n(),a.clear()},a}return o}function CE(t,e,r){const n=vN(t,e,{..._E(r),count:1,resolveImmediately:!1}),
s=n.then(i=>i[0]);return s.cancel=n.cancel,s}class T9 extends Error{remainingPoints;msBeforeNext;consumedPoints;isFirstInDuration;constructor(e="\
Rate limit exceeded",r){super(e),this.name="RateLimitError",this.remainingPoints=r.remainingPoints,this.msBeforeNext=r.msBeforeNext,
this.consumedPoints=r.consumedPoints,this.isFirstInDuration=r.isFirstInDuration}}class M9 extends Error{static name="Que\
ueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class Jl extends Error{static name="\
UnexpectedEOFError";name="UnexpectedEOFError"}class B9 extends Error{static name="MaxEarlyStreamsError";name="MaxEarlySt\
reamsError"}class L9 extends Error{static name="StreamClosedError";name="StreamClosedError"}const EN=Math.pow(2,7),kN=Math.
pow(2,14),xN=Math.pow(2,21),lm=Math.pow(2,28),dm=Math.pow(2,35),um=Math.pow(2,42),fm=Math.pow(2,49),Xe=128,pr=127;function Ud(t){
if(t<EN)return 1;if(t<kN)return 2;if(t<xN)return 3;if(t<lm)return 4;if(t<dm)return 5;if(t<um)return 6;if(t<fm)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&t>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function SN(t,e,r=0){
switch(Ud(t)){case 8:e[r++]=t&255|Xe,t/=128;case 7:e[r++]=t&255|Xe,t/=128;case 6:e[r++]=t&255|Xe,t/=128;case 5:e[r++]=t&
255|Xe,t/=128;case 4:e[r++]=t&255|Xe,t>>>=7;case 3:e[r++]=t&255|Xe,t>>>=7;case 2:e[r++]=t&255|Xe,t>>>=7;case 1:{e[r++]=t&
255,t>>>=7;break}default:throw new Error("unreachable")}return e}function AN(t,e,r=0){switch(Ud(t)){case 8:e.set(r++,t&255|
Xe),t/=128;case 7:e.set(r++,t&255|Xe),t/=128;case 6:e.set(r++,t&255|Xe),t/=128;case 5:e.set(r++,t&255|Xe),t/=128;case 4:
e.set(r++,t&255|Xe),t>>>=7;case 3:e.set(r++,t&255|Xe),t>>>=7;case 2:e.set(r++,t&255|Xe),t>>>=7;case 1:{e.set(r++,t&255),
t>>>=7;break}default:throw new Error("unreachable")}return e}function IN(t,e){let r=t[e],n=0;if(n+=r&pr,r<Xe||(r=t[e+1],
n+=(r&pr)<<7,r<Xe)||(r=t[e+2],n+=(r&pr)<<14,r<Xe)||(r=t[e+3],n+=(r&pr)<<21,r<Xe)||(r=t[e+4],n+=(r&pr)*lm,r<Xe)||(r=t[e+5],
n+=(r&pr)*dm,r<Xe)||(r=t[e+6],n+=(r&pr)*um,r<Xe)||(r=t[e+7],n+=(r&pr)*fm,r<Xe))return n;throw new RangeError("Could not \
decode varint")}function _N(t,e){let r=t.get(e),n=0;if(n+=r&pr,r<Xe||(r=t.get(e+1),n+=(r&pr)<<7,r<Xe)||(r=t.get(e+2),n+=
(r&pr)<<14,r<Xe)||(r=t.get(e+3),n+=(r&pr)<<21,r<Xe)||(r=t.get(e+4),n+=(r&pr)*lm,r<Xe)||(r=t.get(e+5),n+=(r&pr)*dm,r<Xe)||
(r=t.get(e+6),n+=(r&pr)*um,r<Xe)||(r=t.get(e+7),n+=(r&pr)*fm,r<Xe))return n;throw new RangeError("Could not decode varin\
t")}function CN(t,e,r=0){return e==null&&(e=Ql(Ud(t))),e instanceof Uint8Array?SN(t,e,r):AN(t,e,r)}function RN(t,e=0){return t instanceof
Uint8Array?IN(t,e):_N(t,e)}const TN=4194304;class Uy extends Error{static name="UnwrappedError";name="UnwrappedError"}class MN extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class BN extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class LN extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}function DN(t){
return typeof t?.closeRead=="function"}function $N(t){return typeof t?.close=="function"}function sf(t){return DN(t)?t.remoteWriteStatus!==
"writable"&&t.readBufferLength===0:$N(t)?t.status!=="open":!1}function NN(t){return t?.addEventListener!=null&&t?.removeEventListener!=
null&&t?.send!=null&&t?.push!=null&&t?.log!=null}function PN(t,e){const r=e?.maxBufferSize??TN,n=new $s;let s,i=!1,o;if(!NN(
t))throw new aN("Argument should be a Stream or a Multiaddr");const a=u=>{if(!i&&o==null){if(n.append(u.data),n.byteLength>
r){const h=n.byteLength;n.consume(h);const p=new cN(`Read buffer overflow - ${h} > ${r}`);o=p,s?.reject(p),queueMicrotask(
()=>{t.abort(p)});return}s?.resolve()}};t.addEventListener("message",a);const c=u=>{u.error!=null?s?.reject(u.error):s?.
resolve()};t.addEventListener("close",c);const l=()=>{s?.resolve()};t.addEventListener("remoteCloseWrite",l);const d={readBuffer:n,
async read(u){if(i===!0)throw new Uy("Stream was unwrapped");if(o!=null)throw o;if(sf(t)){if(n.byteLength===0&&u?.bytes==
null)return null;if(u?.bytes!=null&&n.byteLength<u.bytes)throw t.log.error("closed after reading %d/%d bytes",n.byteLength,
u.bytes),new Jl(`Unexpected EOF - stream closed after reading ${n.byteLength}/${u.bytes} bytes`)}const h=u?.bytes??1;for(s=
Promise.withResolvers();;){if(n.byteLength>=h){s.resolve();break}if(await n1(s.promise,u?.signal),sf(t)){if(n.byteLength===
0&&u?.bytes==null)return null;break}s=Promise.withResolvers()}const p=u?.bytes??n.byteLength;if(n.byteLength<p){if(sf(t))
throw t.log.error("closed while reading %d/%d bytes",n.byteLength,p),new Jl(`Unexpected EOF - stream closed while readin\
g ${n.byteLength}/${p} bytes`);return d.read(u)}const m=n.sublist(0,p);return n.consume(p),m},async write(u,h){if(i===!0)
throw new Uy("Stream was unwrapped");t.send(u)||await CE(t,"drain",{signal:h?.signal,rejectionEvents:["close"]})},unwrap(){
return i||(i=!0,t.removeEventListener("message",a),t.removeEventListener("close",c),t.removeEventListener("remoteCloseWr\
ite",l),n.byteLength>0&&(t.log("stream unwrapped with %d unread bytes",n.byteLength),t.unshift(n),n.consume(n.byteLength))),
t}};return d}function RE(t,e={}){const r=PN(t,e);e.maxDataLength!=null&&e.maxLengthLength==null&&(e.maxLengthLength=Ud(e.
maxDataLength));const n=e?.lengthDecoder??RN,s=e?.lengthEncoder??CN;return{async read(o){let a=-1;const c=new $s;for(;;){
const d=await r.read({...o,bytes:1});if(d==null)break;c.append(d);try{a=n(c)}catch(u){if(u instanceof RangeError)continue;
throw u}if(a<0)throw new MN("Invalid message length");if(e?.maxLengthLength!=null&&c.byteLength>e.maxLengthLength)throw new LN(
`Message length length too long - ${c.byteLength} > ${e.maxLengthLength}`);if(a>-1)break}if(e?.maxDataLength!=null&&a>e.
maxDataLength)throw new BN(`Message length too long - ${a} > ${e.maxDataLength}`);const l=await r.read({...o,bytes:a});if(l==
null)throw t.log.error("tried to read %d bytes but the stream closed",a),new Jl(`Unexpected EOF - tried to read ${a} byt\
es but the stream closed`);if(l.byteLength!==a)throw t.log.error("read %d/%d bytes before the stream closed",l.byteLength,
a),new Jl(`Unexpected EOF - read ${l.byteLength}/${a} bytes before the stream closed`);return l},async write(o,a){await r.
write(new $s(s(o.byteLength),o),a)},async writeV(o,a){const c=new $s(...o.flatMap(l=>[s(l.byteLength),l]));await r.write(
c,a)},unwrap(){return r.unwrap()}}}function D9(t,e){const r=RE(t,e),n={read:async(s,i)=>{const o=await r.read(i);return s.
decode(o,i)},write:async(s,i,o)=>{await r.write(i.encode(s),o)},writeV:async(s,i,o)=>{await r.writeV(s.map(a=>i.encode(a)),
o)},pb:s=>({read:async i=>n.read(s,i),write:async(i,o)=>n.write(i,s,o),writeV:async(i,o)=>n.writeV(i,s,o),unwrap:()=>n}),
unwrap:()=>r.unwrap()};return n}function ON(t){return t?.addEventListener!=null}function UN(t){const e=r1();let r;const n=o=>{
e.push(o.data)},s=()=>{e.end(),t.removeEventListener("message",n),t.removeEventListener("close",i),t.removeEventListener(
"remoteCloseWrite",s)},i=o=>{e.end(o.error),o.error!=null&&r?.reject(o.error),t.removeEventListener("message",n),t.removeEventListener(
"close",i),t.removeEventListener("remoteCloseWrite",s)};return t.addEventListener("message",n),t.addEventListener("close",
i,{once:!0}),t.addEventListener("remoteCloseWrite",s,{once:!0}),{source:e,async sink(o){async function*a(){yield*o}const c=a();
for(;;){r=Promise.withResolvers();const{done:l,value:d}=await Promise.race([c.next(),r.promise]);if(t.writeStatus==="clo\
sing"||t.writeStatus==="closed"||(d!=null&&(t.send(d)||await Promise.race([CE(t,"drain",{rejectionEvents:["close"]})])),
l===!0))break}await t.close()}}}function $9(...t){const e=t.map(r=>ON(r)?UN(r):r);return s1(...e)}const hm=Object.freeze(
["text-generation","image-text-to-text","text-to-image","automatic-speech-recognition","text-to-speech"]);function Kc(t,e){
const r=t?.modalities,n=t?.outputModalities;return!Array.isArray(r)||!Array.isArray(n)||!hm.includes(e)||t.task!==e&&!(e===
"text-generation"&&t.task==="image-text-to-text")?!1:e==="automatic-speech-recognition"?r.includes("audio")&&n.includes(
"text"):!r.includes("text")||e==="image-text-to-text"&&!r.includes("image")?!1:n.includes(e==="text-to-image"?"image":e===
"text-to-speech"?"audio":"text")}function TE(t){if(t?.available!==!0||t.queueAvailable===!1)return!1;const e=t.queuedRequests??
0,r=t.queueCapacity??Se.maxQueued;return Number.isSafeInteger(e)&&e>=0&&Number.isSafeInteger(r)&&r>=0&&(!t.busy||e<r)}function Xl({
task:t,mode:e="local",candidates:r=[]}={}){if(!hm.includes(t)||!["mixed","local","peers"].includes(e)||!Array.isArray(r))
throw new Error("Invalid inference routing policy");const n=r.filter(i=>!(!TE(i)||!Kc(i,t)||typeof i.manifestCid!="strin\
g"||!i.manifestCid||typeof i.key!="string"||!i.key||typeof i.runtime!="string"||![!0,!1].includes(i.local)||e==="local"&&
!i.local||e==="peers"&&i.local));if(n.sort((i,o)=>+!i.local-+!o.local||+!!i.busy-+!!o.busy||+(i.task!==t)-+(o.task!==t)||
(i.queuedRequests??0)-(o.queuedRequests??0)||Math.max(0,o.idleForMs??0)-Math.max(0,i.idleForMs??0)||i.manifestCid.localeCompare(
o.manifestCid)||i.key.localeCompare(o.key)),!n.length)throw Object.assign(new Error(e==="local"?"No compatible local mod\
el has available inference capacity.":e==="peers"?"No compatible peer model has available inference capacity.":"No compa\
tible local model or peer host has available inference capacity."),{code:"ERR_INFERENCE_NO_MODEL"});const s=structuredClone(
n[0]);return{candidate:s,route:{kind:"baseline",target:s.key,manifestCid:s.manifestCid,runtime:s.runtime,modelName:s.name??
s.manifestCid,local:s.local,task:t,modelTask:s.task,reason:`${s.local?"Local-first execution":"Peer execution"}; ${s.busy?
"bounded available queue":"ready capacity"}; baseline routing, not learned quality ranking`}}}const Ns=Object.freeze({chunkBytes:64*
1024,inputSampleRate:16e3,inputSeconds:20,outputSeconds:30,maxSampleRate:48e3}),Fy=(t,e,r)=>{if(!Number.isSafeInteger(t)||
t<e||t>r)throw new Error("Invalid audio numeric field");return t};function tc(t,{input:e=!1}={}){if(!t||t.format!=="f32l\
e"||t.channels!==1||!/^[a-f0-9]{64}$/.test(t.sha256??""))throw new Error("Audio requires mono f32le PCM and a SHA-256 di\
gest");const r=Fy(t.sampleRate,e?16e3:8e3,e?16e3:Ns.maxSampleRate),n=Fy(t.sampleCount,e?1600:1,r*(e?Ns.inputSeconds:Ns.outputSeconds));
return{format:"f32le",channels:1,sampleRate:r,sampleCount:n,sha256:t.sha256}}function pm(t,e=0,r=t.length,n=!1){if(!(t instanceof
Float32Array))throw new Error("Audio samples must be Float32 PCM");const s=new Uint8Array((r-e)*4),i=new DataView(s.buffer);
for(let o=e;o<r;o++){const a=t[o];if(!Number.isFinite(a)||Math.abs(a)>(n?1.01:10))throw new Error("Invalid PCM sample");
i.setFloat32((o-e)*4,a,!0)}return s}function FN(t,e,r={}){if(!(t instanceof Float32Array))throw new Error("Audio samples\
 must be Float32 PCM");const n=tc({format:"f32le",channels:1,sampleRate:e,sampleCount:t.length,sha256:"0".repeat(64)},r),
s=Ea.create();for(let i=0;i<t.length;i+=Ns.chunkBytes/4)s.update(pm(t,i,Math.min(t.length,i+Ns.chunkBytes/4),r.input));return{
...n,sha256:S0(s.digest())}}async function ME(t,e,{requestId:r,signal:n,credit:s,input:i=!1}){const o=new Float32Array(e.
sampleCount),a=Ea.create();let c=0;for(;c<o.byteLength;){const l=await t.rpc.read({signal:n});if(!l.byteLength||l.byteLength%
4||l.byteLength>Ns.chunkBytes||l.byteLength>o.byteLength-c)throw new Error("Invalid PCM transfer frame");const d=l.subarray(),
u=new DataView(d.buffer,d.byteOffset,d.byteLength);a.update(d);for(let h=0;h<d.length;h+=4){const p=u.getFloat32(h,!0);if(!Number.
isFinite(p)||Math.abs(p)>(i?1.01:10))throw new Error("Invalid PCM sample");o[(c+h)/4]=p}if(c+=d.length,c===o.byteLength&&
S0(a.digest())!==e.sha256)throw new Error("Audio digest mismatch");await t.write({type:s,requestId:r,offset:c},n)}return o}
async function N9(t,{samples:e,requestId:r,signal:n}){for(let s=0;s<e.length;){const i=Math.min(e.length,s+Ns.chunkBytes/
4);await t.rpc.write(pm(e,s,i,!0),{signal:n});const o=await t.read(n);if(o.type!=="audio-credit"||o.requestId!==r||o.offset!==
i*4)throw new Error("Invalid audio transfer credit");s=i}}async function P9(t,{audio:e,requestId:r,signal:n}){const s=tc(
e,{input:!0});return{samples:await ME(t,s,{requestId:r,signal:n,input:!0,credit:"audio-credit"}),sampleRate:s.sampleRate}}
async function O9(t,{samples:e,metadata:r,requestId:n,controls:s,signal:i}){const o=s.expect(0);await t.write({type:"res\
ult-audio",requestId:n,audio:r},i),await o;for(let a=0;a<e.length;){const c=Math.min(e.length,a+Ns.chunkBytes/4),l=s.expect(
c*4);await t.rpc.write(pm(e,a,c),{signal:i}),await l,a=c}}async function U9(t,{audio:e,requestId:r,signal:n}){const s=tc(
e);return await t.write({type:"result-credit",requestId:r,offset:0},n),{audio:await ME(t,s,{requestId:r,signal:n,credit:"\
result-credit"}),sampleRate:s.sampleRate,metadata:s}}const zN="/peercompute/inference/3.0.0",of="/peercompute/inference/\
2.0.0",Nh=t=>["automatic-speech-recognition","text-to-speech"].includes(t),qN=256,Ps=Object.freeze({frameBytes:128*1024,
imageChunkBytes:64*1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,maximumHostedModels:16,
queryTimeoutMs:5e3,requestTimeoutMs:12e4,recordTtlMs:15e3}),BE=new TextEncoder,jN=new TextDecoder("utf-8",{fatal:!0}),mm=t=>BE.
encode(t).length,Qc=t=>Vi.parse(_i(t,128)).toV1().toString();function _i(t,e=256){if(typeof t!="string"||!t.length||mm(t)>
e)throw new Error("Invalid inference text field");return t}function It(t,e,r=0){if(!Number.isSafeInteger(t)||t<r||t>e)throw new Error(
"Invalid inference numeric field");return t}function F9(t){return t?.status==="open"&&!!t.remotePeer&&(t.encryption==="/\
noise"||t.encryption==="/tls/1.0.0"||t.encryption==="native"&&t.remoteAddr?.getComponents?.().some(({name:e})=>e==="webr\
tc"||e==="webrtc-direct"))}function zy(t){if(!t||typeof t!="object")throw new Error("Invalid model descriptor");if(!Array.
isArray(t.modalities)||t.modalities.length>4||t.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const e=t.task??(t.modalities.includes("image")?"image-text-to-text":"text-generation");if(!hm.
includes(e))throw new Error("Invalid model task");const r=e==="text-to-image"?["image"]:e==="text-to-speech"?["audio"]:[
"text"];if(t.outputModalities!==void 0&&(!Array.isArray(t.outputModalities)||t.outputModalities.length!==1||t.outputModalities[0]!==
r[0]))throw new Error("Model output modalities do not match its task");if(e==="text-to-image"&&(t.modalities.length!==1||
t.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");if(Nh(e)&&(t.modalities.length!==1||
t.modalities[0]!==(e==="text-to-speech"?"text":"audio")))throw new Error("Invalid speech model modalities");return{manifestCid:Qc(
t.manifestCid),modelId:_i(t.modelId),name:_i(t.name),task:e,outputModalities:r,modalities:[...new Set(t.modalities)],runtime:_i(
t.runtime,128),repository:_i(t.repository,256),revision:_i(t.revision,128),totalBytes:It(t.totalBytes,64*1024**3)}}function z9(t,e=!0,{
defaultMaxNewTokens:r=qN,protocol:n=zN}={}){if(!t||!Array.isArray(t.sharedModels)||t.sharedModels.length>Ps.maximumModels)
throw new Error("Invalid shared model catalog");const s=[...new Map(t.sharedModels.map(l=>{const d=zy(l);return[d.manifestCid,
d]})).values()].filter(l=>n!==of||!Nh(l.task)),i=(l,d={})=>({...zy(l),maxNewTokens:It(l.maxNewTokens===void 0?r:l.maxNewTokens,
Se.maxNewTokens,1),busy:!!(l.busy??d.busy),idleForMs:It(l.idleForMs??d.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:It(
l.queuedRequests??d.queuedRequests??0,1024),queueCapacity:It(l.queueCapacity??Se.maxQueued,1024),queueAvailable:l.queueAvailable!==
!1});let o=e&&t.hostedModel?i(t.hostedModel,t):null;n===of&&Nh(o?.task)&&(o=null);const a=t.hostedModels??(o?[o]:[]);if(!Array.
isArray(a)||a.length>Ps.maximumHostedModels)throw new Error("Invalid hosted model list");const c=e?a.map(l=>i(l)):[];if(new Set(
c.map(l=>l.manifestCid)).size!==c.length)throw new Error("Duplicate hosted model identity");return{sharedModels:s,hostedModel:o,
...n!==of?{hostedModels:c}:{},busy:!!t.busy,idleForMs:It(t.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:It(t.queuedRequests??
0,1024)}}function q9(t,{imageBytes:e=!1}={}){if(Ho(t.requestId),t.task==="automatic-speech-recognition"){if(t.prompt!=null||
t.messages!=null||t.image!=null||!t.audio)throw new Error("ASR accepts audio only");const n=e?FN(t.audio.samples,t.audio.
sampleRate,{input:!0}):tc(t.audio,{input:!0});return{requestId:t.requestId,manifestCid:Qc(t.manifestCid),task:t.task,audio:{
...n,...e?{samples:new Float32Array(t.audio.samples)}:{}}}}if(t.audio!=null)throw new Error("Only ASR accepts audio inpu\
t");if(t.task==="text-to-speech"){if(t.image!=null||t.messages!=null||typeof t.prompt!="string")throw new Error("TTS acc\
epts one text prompt");const n=t.prompt.trim();if(!n||[...n].length>256||mm(n)>1024)throw new Error("Speech text exceeds\
 its budget");return{requestId:t.requestId,manifestCid:Qc(t.manifestCid),task:t.task,prompt:n}}const r={requestId:t.requestId,
manifestCid:Qc(t.manifestCid),messages:Pd(t),maxNewTokens:It(t.maxNewTokens??Se.maxNewTokens,Se.maxNewTokens,1)};if(t.task!==
void 0){if(!["text-generation","image-text-to-text","text-to-image"].includes(t.task))throw new Error("Invalid inference\
 task");r.task=t.task}t.seed!==void 0&&(r.seed=It(t.seed,4294967295)),t.steps!==void 0&&(r.steps=It(t.steps,8,1));for(const n of[
"width","height"])t[n]!==void 0&&(r[n]=It(t[n],512,512));if(r.task==="text-to-image"&&(t.image!=null||r.messages.length!==
1||r.messages[0].role!=="user"))throw new Error("Image generation needs one text prompt");if(t.image!=null){const{width:n,
height:s,channels:i}=t.image;if(It(n,Se.maxImagePixels,1),It(s,Se.maxImagePixels,1),i!==4||n*s>Se.maxImagePixels)throw new Error(
"Invalid inference image dimensions");e&&Nd(t.image),r.image={width:n,height:s,channels:4},e&&(r.image.data=new Uint8Array(
t.image.data))}return r}function GN(t,{imageBytes:e=!1}={}){if(!t||typeof t!="object")throw new Error("Invalid result im\
age");const r=It(t.width,1024,1),n=It(t.height,1024,1);if(t.channels!==4||r*n>Se.maxImagePixels||!/^[a-f0-9]{64}$/.test(
t.sha256??""))throw new Error("Invalid result image dimensions or digest");return e&&Nd(t),{width:r,height:n,channels:4,
sha256:t.sha256,...e?{data:t.data}:{}}}function j9(t,e={}){const r=t?.text??(t?.audio?"":void 0);if(typeof r!="string"||
mm(r)>Se.maxOutputBytes)throw new Error("Invalid inference result text");const n=t.finishReason===void 0?"unknown":t.finishReason;
if(!["stop","length","unknown"].includes(n))throw new Error("Invalid inference finish reason");const s={text:r,finishReason:n};
if(t.contextTruncated!==void 0){if(typeof t.contextTruncated!="boolean")throw new Error("Invalid inference context trunc\
ation flag");s.contextTruncated=t.contextTruncated}for(const i of["inputTokens","outputTokens","gpuDispatches","gpuSubmi\
ssions"])t[i]!=null&&(s[i]=It(t[i],Number.MAX_SAFE_INTEGER));return t.image!=null&&(s.image=GN(t.image,e)),t.audio!=null&&
(s.audio=tc(t.audio)),t.seed!==void 0&&(s.seed=It(t.seed,4294967295)),t.steps!==void 0&&(s.steps=It(t.steps,8,1)),s}function G9(t){
if(!["text-encoder","denoise","decode"].includes(t.stage))throw new Error("Invalid image generation stage");const e=It(t.
steps,8,1);return{type:"diffusion-progress",stage:t.stage,steps:e,step:It(t.step,e)}}function W9(t){const e=RE(t,{maxDataLength:Ps.
frameBytes,maxBufferSize:Ps.frameBytes*2+32});return{rpc:e,async read(r){return JSON.parse(jN.decode((await e.read({signal:r})).
subarray()))},async write(r,n){const s=BE.encode(JSON.stringify(r));if(s.length>Ps.frameBytes)throw new Error("Inference\
 frame exceeds its byte limit");await e.write(s,{signal:n})}}}function $o(t,e){const r=o=>Number.isSafeInteger(o)&&o>=0?
o:1/0,n=r(t.totalBytes),s=r(e.totalBytes);if(n!==s)return n<s?-1:1;const i=o=>`${o.name??""}\0${o.key??o.manifestCid??""}`;
return i(t)<i(e)?-1:i(t)>i(e)?1:0}function No(t={}){const e=[...t.modalities??["text"]],r=t.task??(e.includes("image")?"\
image-text-to-text":"text-generation");return{task:r,modalities:e,outputModalities:[...t.outputModalities??[r==="text-to\
-image"?"image":r==="text-to-speech"?"audio":"text"]]}}const In=t=>(t?.model??t)?.runtime==="transformers-speech";function af(t,e,r){
return new Promise((n,s)=>{let i;const o=(c,l)=>{clearTimeout(i),e?.removeEventListener("abort",a),c(l)},a=()=>o(s,e.reason);
e?.addEventListener("abort",a,{once:!0}),Promise.resolve(t).then(c=>o(n,c),c=>o(s,c)),r!==void 0&&(i=setTimeout(()=>o(n),
r)),e?.aborted&&a()})}function WN(t,{catalog:e,now:r=Date.now,preferences:n=lE({storeName:t.store.lockName??t.store.name})}={}){
const s=Object.fromEntries(["importCatalog","importPackage","importHub","ensure","load","connect","connectBackend","disp\
ose"].filter(_=>typeof t[_]=="function").map(_=>[_,t[_].bind(t)])),i={},o=new Map,a=new Map,c=new Map,l={status:"unavail\
able",code:"model_verification_required",reason:"This saved package needs local verification. Open Stored Models and cho\
ose Verify locally. No download is required to check the saved bytes."},d=new Set,u=new Map,h=new Map,p=new AbortController,
m=I$(),b=new Set,g=new Map,f=new Set,y=new Map,E=new Map,k=new Map,x=new Set;let S=!0,v=!0,w=!1,I,C,R,N,D,P=null,j=0,Z=r(),
X=Promise.resolve(),q=n.readLastLoaded(),ue={connected:!1,peerCount:0,sharedModelCount:0,hostedModelCount:0,errors:[],checkedAt:null};
const he=()=>{if(w)throw new Error("Model console is closed")},ze=_=>_?AbortSignal.any([_,p.signal]):p.signal;function be(_){
const B=!_.model&&xh(_,Object.values(e));return t.getModelCompatibility?.(B||_)??{status:"unknown",reason:"Local memory \
fit is unverified."}}function Ie(_){const B=be(_);if(["checking","unavailable"].includes(B.status))throw Object.assign(new Error(
B.reason||"This model cannot load on this device"),{code:"ERR_MODEL_LOCAL_UNAVAILABLE",availability:B});return B}function U(_){
if(Ie(_),In(_)&&!t.getServiceForModel)throw Object.assign(new Error(kh),{code:"ERR_MODEL_VOICE_MANAGED"})}if(t.setMemoryBudgets){
const _=t.setMemoryBudgets.bind(t);t.setMemoryBudgets=B=>{if(he(),N||t.service.getStatus().status==="loading"||t.getResidentModelStates?.().
some(T=>T.status==="loading"))throw new Error("Wait for the model import/load to finish before changing memory budgets");
return _(B)}}function Y(_,B){if(!B?.model?.runtime||!B.model.repository)return null;const T=xh(B,Object.values(e));return{
manifestCid:_,modelId:T?.id??_,name:T?.name??B.name??B.model.repository,...No(B.model),runtime:B.model.runtime,repository:B.
model.repository,revision:B.model.revision,totalBytes:B.files.reduce((H,O)=>H+O.size,0)}}async function W(_,{signal:B}={}){
if(!_?.cid)throw new Error("Imported package has no content identity");const T=_.manifest??await t.store.getManifest(_.cid,
{signal:B});B?.throwIfAborted();const H=Y(_.cid,T);return H&&(o.set(_.cid,H),a.set(_.cid,T)),H}async function pe(_){const B=await C$(
t.store,{signal:_}),T=new Set,H=new Set;c.clear();for(const O of B){if(O.status==="deleting"){b.add(O.cid);continue}(O.pinned||
O.retain)&&(H.add(O.cid),O.status==="partial"?c.set(O.cid,O):(T.add(O.cid),await W(O)))}for(const O of o.keys())T.has(O)||
(o.delete(O),a.delete(O));return q&&!H.has(q.manifestCid)&&(q=await n.clearLastLoaded(q)),B}function ve(_){return{...Y(_.
cid,_.manifest),needsVerification:!0,localAvailability:l}}function ae(_){return[...c.values()].find(B=>Y(B.cid,B.manifest)?.
modelId===_)}function le(_){if(_?.status==="partial"&&(_.pinned||_.retain))throw Object.assign(new Error(l.reason),{code:"\
ERR_MODEL_VERIFICATION_REQUIRED",manifestCid:_.cid})}async function me(_,B){const T=Ve(_);B?.aborted||T?.manifestCid!==_||
In(T)||(q=await n.rememberLoaded({manifestCid:_,modelId:T.modelId},{signal:B}))}const ye=_=>t.getServiceForModel?.(_)??(t.
service.getStatus().manifestCid===_?t.service:null);function Ir(){return(t.getResidentModelStates?.()??[t.service.getStatus()]).
map(B=>{const T=o.get(B.manifestCid)??(P?.manifestCid===B.manifestCid?P:null);if(!T||b.has(T.manifestCid)||c.has(T.manifestCid))
return null;const H=ye(T.manifestCid),O=H?.getStatus()??B,G=k.get(T.manifestCid),ie=E.get(T.manifestCid)??{active:0,lastIdleAt:0},
ke=ie.active>0||!!O.activeRequestId||O.queuedRequests>0;return{...T,...O,status:B.status==="unloading"||x.has(T.manifestCid)?
"unloading":O.status==="ready"&&(!G||G.service!==H||G.sessionId!==O.sessionId)?"loading":O.status,manifestCid:T.manifestCid,
busy:ke,queuedRequests:O.queuedRequests??0,queueCapacity:Se.maxQueued,queueAvailable:!ke||(O.queuedRequests??0)<Se.maxQueued,
idleForMs:ke?0:Math.max(0,r()-ie.lastIdleAt),maxNewTokens:Se.maxNewTokens}}).filter(Boolean)}function Ve(_=t.service.getStatus().
manifestCid){return Ir().find(B=>B.manifestCid===_&&B.status==="ready")??null}const nt=()=>(I?.listModels()??[]).map(_=>({
..._,...No(_),providers:_.providers.filter(B=>!B.local)})).filter(_=>_.providers.length),pt=()=>(I?.listHosts()??[]).map(
_=>({..._,...No(_),hosts:_.hosts.filter(B=>!B.local)})).filter(_=>_.hosts.length);function Ae(_=[]){const B=t.networkManager,
T=!!B?.isConnected,H=new Set(T?B.peers?.keys()??[]:[]);for(const O of T?B.libp2p?.getConnections?.()??[]:[])O.status==="\
open"&&H.add(O.remotePeer.toString());H.delete(B?.libp2p?.peerId?.toString());for(const O of B?.bootstrapPeerIds??[])H.delete(
O);ue={connected:T,peerCount:H.size,sharedModelCount:T?nt().length:0,hostedModelCount:T?pt().length:0,checkedAt:r(),errors:(Array.
isArray(_)?_:[]).slice(0,Ps.maximumPeers).map(O=>({peerId:String(O?.peerId??"").slice(0,128),code:String(O?.code??"ERR_P\
EER_DISCOVERY").slice(0,80),message:String(O?.message??"Peer directory query failed").slice(0,256)}))}}function qe(_){w||
D||(D=wt().catch(B=>{if(!w)for(const T of _?[_]:o.keys())u.set(T,B)}).finally(()=>{D=null}))}async function wt({strict:_=!1}={}){
const B=async()=>{if(w||!(t.artifactReady??t.networkReady))return;await pe(p.signal);const T=new Set(t.networkManager.getPublishedArtifactCids()),
H=[];for(const O of d)if(!o.has(O))try{await t.withdraw(O),T.delete(O),d.delete(O),u.delete(O)}catch(G){u.set(O,G),H.push(
G)}for(const O of o.keys()){try{S&&!b.has(O)&&!T.has(O)&&(await t.publish(O),T.add(O)),(!S||b.has(O))&&T.has(O)&&(await t.
withdraw(O),T.delete(O)),u.delete(O)}catch(G){u.set(O,G),H.push(G)}T.has(O)?d.add(O):d.delete(O)}if(_&&H.length)throw new AggregateError(
H,"Some models could not update their file sharing state")};return X=X.catch(()=>{}).then(B),X}async function gr(_,B){const T=Ve(
B);if(!T)throw new Error("Import a model before using local inference");if(_.image&&!T.modalities.includes("image"))throw new Error(
"This model accepts text only");if(_.sessionId&&_.sessionId!==T.sessionId)throw new Error("The selected local model sess\
ion changed before dispatch");const H=ye(T.manifestCid),O=E.get(T.manifestCid)??{active:0,lastIdleAt:r()};E.set(T.manifestCid,
O),O.active++,j++;const G=new AbortController,ie=AbortSignal.any([ze(_.signal),G.signal]),ke={manifestCid:T.manifestCid,
abort:G,service:H};f.add(ke);try{return ke.promise=Promise.resolve(H.generate({..._,task:T.task,signal:ie})),await ke.promise}finally{
f.delete(ke),--j===0&&(Z=r()),--O.active===0&&(O.lastIdleAt=r())}}async function Ct(){he();const _=t.networkManager;return _?.
isConnected?(I?.closed&&(await _.releasePeerInferenceService(i),I=null),I||(C||(C=_.createPeerInferenceService({owner:i,
requestTimeoutMs:3e5,getLocalState:()=>{const B=t.service.getStatus(),T=j>0||!!B.activeRequestId||B.queuedRequests>0,H=Ve(),
O=[...o.values()].filter(ie=>d.has(ie.manifestCid)&&!b.has(ie.manifestCid)&&["text-generation","image-text-to-text","tex\
t-to-image","automatic-speech-recognition","text-to-speech"].includes(ie.task));H&&O.sort((ie,ke)=>+(ke.manifestCid===H.
manifestCid)-+(ie.manifestCid===H.manifestCid));const G=Ve();return{sharedModels:S?O.slice(0,Ps.maximumModels):[],hostedModels:v&&
!w?Ir().filter(ie=>ie.status==="ready"):[],hostedModel:v&&!w&&["text-generation","image-text-to-text","text-to-image"].includes(
G?.task)?G:null,busy:T,queuedRequests:B.queuedRequests??0,idleForMs:T?0:Math.max(0,r()-Z)}},generate:async({manifestCid:B,
...T})=>{if(!v||w||!Ve(B))throw new Error("Model is no longer hosted");return gr(T,B)}}).then(async B=>{if(w)throw await _.
releasePeerInferenceService(i),new Error("Model console is closed");return I=B,await B.setHostingEnabled(v),B}).finally(
()=>{C=null})),C)):null}async function Rt(){await Ct(),qe()}function mt(_,B){he();const T=ze(B);return m.run(()=>(he(),_(
T)),{signal:T})}async function vt(_,B,{deferSharing:T=!1}={}){let H;try{H=await s[_](...B)}catch(O){throw cE(O)}return await W(
H),T||await wt(),H}function _r(_){qe(_)}async function je(_,B={}){if(b.has(_))throw new Error("This model is being delet\
ed; retry deletion before loading it");U(await t.store.getManifest(_,{signal:B.signal})),!t.managesArtifactUses&&!y.has(
_)&&y.set(_,await t.store.acquireUse(_,{signal:B.signal}));const T=B.signal;let H;try{const O=await s.load(_,B);T?.throwIfAborted();
const G=await af(W({cid:_},{signal:T}),T);return T?.throwIfAborted(),await af(Ct(),T,3e3),T?.throwIfAborted(),In(G)||(H=
await n.rememberLoadedWithReceipt({manifestCid:_,modelId:G.modelId},{signal:T}),q=H.record),T?.throwIfAborted(),k.set(_,
{service:ye(_),sessionId:ye(_)?.getStatus().sessionId}),(!In(G)||!Ve())&&(P=G),E.set(_,{active:0,lastIdleAt:r()}),Z=r(),
{...O,manifestCid:_}}catch(O){const G=[],ie=ye(_);if(T?.aborted&&ie?.getStatus().manifestCid===_){k.delete(_),P?.manifestCid===
_&&(P=null);try{t.unloadResidentModel?await t.unloadResidentModel(_):await ie.unloadModel()}catch(ke){G.push(ke)}}if(ye(
_)?.getStatus().manifestCid!==_&&await Gt(_),T?.aborted&&H?.committed)try{q=await n.restoreLastLoaded(H)}catch(ke){G.push(
ke)}throw G.length?new AggregateError([O,...G],"Model load cancelled and cleanup is incomplete"):O}}async function tr(_){
if(!t.unloadResidentModel){await I?.setHostingEnabled(!1),await t.service.unloadModel();for(const O of y.keys())await Gt(
O);P=null,await I?.setHostingEnabled(v);return}const B=_===void 0?t.getResidentModelStates().map(O=>O.manifestCid):[_];for(const O of B)
x.add(O);await Promise.all(B.map(O=>I?.cancelHostedModel?.(O)));const T=[...f].filter(O=>B.includes(O.manifestCid));for(const O of T)
O.abort.abort(new DOMException("Model is unloading","AbortError"));await Promise.allSettled(T.map(O=>O.promise));const H=await t.
unloadResidentModel(_);for(const O of B)await Gt(O),E.delete(O),k.delete(O),x.delete(O);return P=o.get(t.service.getStatus().
manifestCid)??null,H}async function Gt(_){const B=y.get(_);B&&(await B(),y.delete(_))}async function Dr(_,B,T){if(T.throwIfAborted(),
U(_.manifest??await t.store.getManifest(_.cid,{signal:T})),T.throwIfAborted(),Ve(_.cid))return In(_.manifest)||(t.selectResidentModel?.(
_.cid),P=o.get(_.cid)??P),await me(_.cid,T),_r(_.cid),{...ye(_.cid).getStatus().evidence,manifestCid:_.cid};t.unloadResidentModel||
(B.onProgress?.({stage:"unload"}),T.throwIfAborted(),await tr(),T.throwIfAborted()),B.onProgress?.({stage:"load"}),T.throwIfAborted();
const H=await je(_.cid,{...B,signal:T});return _r(_.cid),H}async function Cr(_,B){if(he(),N)throw new Error("Another mod\
el import or load is already running");N=mt(_,B);try{return await N}finally{N=null}}for(const _ of["connect","connectBac\
kend"])t[_]=async(...B)=>{he();const T=await s[_](...B);return await Rt(),T};for(const _ of["importCatalog","importPacka\
ge","importHub"].filter(B=>s[B]))t[_]=(...B)=>{const T=_==="importPackage"?2:1;return mt(H=>(B[T]={...B[T],signal:H},vt(
_,B)),B[T]?.signal)};return t.ensure=(_,B={})=>mt(T=>vt("ensure",[_,{...B,signal:T}]),B.signal),t.load=(_,B={})=>mt(T=>je(
_,{...B,signal:T}),B.signal),Object.assign(t,{getPreferences:()=>({sharing:S,hostInference:v}),getSharingErrors:()=>[...u].
map(([_,B])=>({manifestCid:_,message:B.message})),getDiscoveryStatus:()=>structuredClone({...ue,connected:!!t.networkManager?.
isConnected}),getPreferredModelSourceKey(){const _=q&&!b.has(q.manifestCid)&&(o.get(q.manifestCid)??(c.has(q.manifestCid)?
ve(c.get(q.manifestCid)):null));return _&&!In(_)?e[_.modelId]?`hf:${_.modelId}`:`stored:${_.manifestCid}`:`hf:${ky}`},getStartupModel(){
he();const _=[...o.values()].filter(se=>!In(se)&&!b.has(se.manifestCid)).sort($o).map(se=>({sourceKey:e[se.modelId]?`hf:${se.
modelId}`:`stored:${se.manifestCid}`,manifestCid:se.manifestCid,name:se.name,localAvailability:be(a.get(se.manifestCid)??
se)})),B=Object.values(e).filter(se=>!In(se)).map(se=>({...se,key:`hf:${se.id}`})).sort($o).map(se=>({sourceKey:se.key,name:se.
name,localAvailability:be(se)})),T=_.find(se=>se.manifestCid===q?.manifestCid),H=[...c.values()].map(ve).sort($o).map(se=>({
...se,sourceKey:e[se.modelId]?`hf:${se.modelId}`:`stored:${se.manifestCid}`})),O=H.find(se=>se.manifestCid===q?.manifestCid),
G=B.find(se=>se.sourceKey===`hf:${ky}`),ie=se=>["available","unknown"].includes(se?.localAvailability.status),ke=se=>se?.
localAvailability.status==="checking";return O??(ie(T)?T:null)??_.find(ie)??(ke(T)?T:null)??_.find(ke)??H[0]??(ie(G)||ke(
G)?G:null)??B.find(ie)??B.find(ke)??T??_[0]??G??B[0]??null},listModelSources(){return[...Object.values(e).map(_=>({key:`\
hf:${_.id}`,name:_.name,source:"hf",modelId:_.id,...No(_.model),runtime:_.model.runtime,totalBytes:_.totalBytes,description:_.
description??"",repository:_.repository??_.model.repository,revision:_.revision??_.model.revision,license:_.license,model:_.
model,files:_.files,dtype:_.model.dtype,catalog:!0,localAvailability:be(_),...(()=>{const B=[...o.values()].find(H=>H.modelId===
_.id);if(B)return{stored:!0,manifestCid:B.manifestCid};const T=ae(_.id);return T?{stored:!0,manifestCid:T.cid,needsVerification:!0,
localAvailability:l}:{}})()})),...nt().map(_=>({..._,key:`peer:${_.manifestCid}`,source:"peers",localAvailability:be(_)})),
...[...o.values()].filter(_=>!e[_.modelId]&&!b.has(_.manifestCid)).map(_=>({..._,key:`stored:${_.manifestCid}`,source:"s\
tored",model:a.get(_.manifestCid)?.model,files:a.get(_.manifestCid)?.files,description:a.get(_.manifestCid)?.description??
"",license:a.get(_.manifestCid)?.provenance?.license,dtype:a.get(_.manifestCid)?.model?.dtype,localAvailability:be(a.get(
_.manifestCid)??_)})),...[...c.values()].map(ve).filter(_=>!e[_.modelId]).map(_=>({..._,key:`stored:${_.manifestCid}`,source:"\
stored",stored:!0}))].filter(_=>t.getServiceForModel||!In(_)).sort($o)},listResidentModels:()=>Ir(),listInferenceTargets(){
const _=Ve();return[...t.getServiceForModel?Ir().filter(T=>T.status==="ready").map(T=>({...T,key:`local:${T.manifestCid}`,
local:!0,available:!0,providerCount:1})):[{..._,key:"local",name:_?.name??"No model loaded",local:!0,available:!!_,busy:j>
0,...No(_??{}),providerCount:_?1:0}],...pt().map(T=>{const H=T.hosts.filter(G=>G.queueAvailable!==!1&&(!G.busy||(G.queuedRequests??
0)<(G.queueCapacity??Se.maxQueued))).sort((G,ie)=>+!!G.busy-+!!ie.busy||(ie.idleForMs??0)-(G.idleForMs??0)),O=H[0];return{
...T,key:`peer:${T.manifestCid}`,local:!1,available:!0,busy:T.hosts.every(G=>G.busy),providerCount:T.hosts.length,queueAvailable:H.
length>0,queueCapacity:O?.queueCapacity??Se.maxQueued,queuedRequests:O?.queuedRequests??(H.length?0:Se.maxQueued),idleForMs:O?.
busy?0:O?.idleForMs??0}})]},async refreshPeers({signal:_}={}){return he(),R||(R=(async()=>{const B=ze(_);try{B.throwIfAborted();
const T=await Ct();B.throwIfAborted(),qe();const H=T?await T.refresh({signal:B}):null;return B.throwIfAborted(),Ae(H?.errors),
{models:t.listModelSources(),targets:t.listInferenceTargets(),discovery:t.getDiscoveryStatus()}}catch(T){throw!w&&!B.aborted&&
Ae([T]),T}})().finally(()=>{R=null})),R},async setSharing(_){he();const B=S;S=!!_;try{await wt({strict:!0})}catch(T){throw S=
B,T}return t.getPreferences()},async setHostInference(_){return he(),v=!!_,await(await Ct())?.setHostingEnabled(v),t.getPreferences()},
async acquireModel(_,B={}){he();const T=t.listModelSources().find(O=>O.key===_);if(!T)throw new Error("This model source\
 is no longer available");if(T.source==="stored")return t.loadStoredModel(T.manifestCid,B);const H=T.source==="hf"?e[T.modelId]:
T;return U(H),Cr(async O=>{await pe(O),T.source!=="hf"&&le(c.get(T.manifestCid)),U(H);let G;if(T.source==="hf"){const ie=q&&
o.get(q.manifestCid),ke=ie?.modelId===T.modelId?ie:[...o.values()].find(se=>se.modelId===T.modelId);G=ke&&await t.store.
stat(ke.manifestCid,{signal:O}),(!G||G.status!=="complete")&&(le(ae(T.modelId)),G=await vt("importCatalog",[T.modelId,{...B,
signal:O}],{deferSharing:!0}))}else t.inspectPeerPackage&&Ie(await t.inspectPeerPackage(T.manifestCid,{signal:O})),O.throwIfAborted(),
B.onProgress?.({stage:"download-peers"}),O.throwIfAborted(),G=await vt("ensure",[T.manifestCid,{signal:O}],{deferSharing:!0});
return Dr(G,B,O)},B.signal)},acquireHubModel(_,B={}){if(he(),!s.importHub)throw new Error("Hub import is unavailable in \
this runtime");return _=structuredClone(_),AE(_),Ie(_),Cr(async T=>{await pe(T),Ie(_);const H=[...a].find(([G,ie])=>!b.has(
G)&&$h(ie,_));let O=H&&await t.store.stat(H[0],{signal:T});return O&&!await rN(t.store,H[1],_,{signal:T})&&(O=null),(!O||
O.status!=="complete")&&(le([...c.values()].find(G=>$h(G.manifest,_))),O=await vt("importHub",[_,{...B,signal:T,reuseManifest:H?.[1]}],
{deferSharing:!0})),Dr(O,B,T)},B.signal)},loadStoredModel(_,B={}){const T=Je(_).toString();return Cr(async H=>{if(b.has(
T))throw new Error("This model is being deleted; retry deletion before loading it");const O=await t.store.stat(T,{signal:H});
if(le(O),O?.kind!=="manifest"||O.status!=="complete"||!(O.pinned||O.retain))throw new Error("This model is no longer com\
pletely stored and retained on this device. Import it before loading.");return Dr(O,B,H)},B.signal)},unload(_,{expectedService:B,
expectedSessionId:T}={}){const H=_===void 0?void 0:Je(_).toString();return mt(()=>H!==void 0&&(B!==void 0&&ye(H)!==B||T!==
void 0&&ye(H)?.getStatus().sessionId!==T)?{status:"replaced",manifestCid:H}:tr(H))},recoverStoredModel(_,{signal:B,onProgress:T}={}){
const H=Je(_).toString();return mt(async O=>{const G=await t.store.stat(H,{signal:O});if(G?.kind!=="manifest"||!["partia\
l","complete"].includes(G.status)||!(G.pinned||G.retain)||b.has(H))throw new Error("This retained model package is not a\
vailable for local verification.");try{const ie=G.status==="complete"?G:await t.store.ensureLocal(H,{kind:"manifest",pin:!0,
signal:O,onProgress:T});return O.throwIfAborted(),await pe(O),{manifestCid:H,verified:!0,record:ie}}catch(ie){throw await pe().
catch(()=>{}),O.aborted?ie:new Error(`Local verification failed: ${ie.message}. No files were downloaded. The package re\
mains listed so you can retry or delete it.`,{cause:ie})}},B)},async listStoredModels({signal:_}={}){he();const B=ze(_),
T=await pe(B),H=t.service.getStatus(),O=new Set(t.networkManager?.getPublishedArtifactCids?.()??[]);return T.map(G=>({manifestCid:G.
cid,name:Y(G.cid,G.manifest)?.name??G.manifest.name??G.cid,modelId:Y(G.cid,G.manifest)?.modelId??G.cid,totalBytes:G.manifest.
files.reduce((ie,ke)=>ie+ke.size,0),runtime:G.manifest.model.runtime,...G.status==="partial"?{needsVerification:!0}:{},...In(
G.manifest)&&!t.getServiceForModel?{loadMode:"voice",loadHint:kh}:{},localAvailability:G.status==="deleting"||b.has(G.cid)?
{status:"unavailable",code:"model_deleting",reason:"Finish deleting this package before loading it."}:G.status==="partia\
l"?l:G.pinned||G.retain?be(G.manifest):{status:"unavailable",code:"model_not_retained",reason:"This package is not retai\
ned for local use. Import it before loading."},loaded:H.status!=="idle"&&H.manifestCid===G.cid||Object.values(t.services??
{}).some(ie=>ie.getStatus().status!=="idle"&&ie.getStatus().manifestCid===G.cid),shared:O.has(G.cid),...G.status==="dele\
ting"||b.has(G.cid)?{cleanupPending:!0}:{},...u.has(G.cid)?{shareError:u.get(G.cid).message}:{}})).sort($o)},deleteStoredModel(_,{
signal:B}={}){he();const T=Je(_).toString();if(g.has(T))return g.get(T);B?.throwIfAborted();const H=b.has(T);let O=!1;b.
add(T);const G=mt(ie=>R$(t,async()=>{O=!0;let ke=!1;const se=await t.store.stat(T,{signal:ie});if(se&&(se.kind!=="manife\
st"||!se.manifest?.model?.runtime))throw b.delete(T),new Error("Only stored model packages can be deleted here");try{await X.
catch(()=>{}),t.networkManager?.getPublishedArtifactCids?.().includes(T)&&await t.withdraw(T),d.delete(T);const Et=ye(T);
if(Et?.getStatus().manifestCid===T){t.unloadResidentModel?await I?.cancelHostedModel?.(T):await I?.setHostingEnabled(!1);
const st=[...f].filter(St=>St.manifestCid===T);for(const St of st)St.abort.abort(new DOMException("Stored model is being\
 deleted","AbortError"));await Promise.allSettled(st.map(St=>St.promise)),t.unloadResidentModel?await t.unloadResidentModel(
T):await Et.unloadModel(),await Gt(T),P?.manifestCid===T&&(P=o.get(t.service.getStatus().manifestCid)??null),E.delete(T),
k.delete(T),ke=!0}ie.throwIfAborted(),ke=await t.unloadAuxiliaryModel?.(T)||ke,ie.throwIfAborted();const ut=await t.store.
remove(T,{signal:ie});return o.delete(T),a.delete(T),c.delete(T),b.delete(T),u.delete(T),q?.manifestCid===T&&(q=await n.
clearLastLoaded(q)),await I?.setHostingEnabled(v),{deleted:ut.removed,freedBytes:ut.freedBytes,unloaded:ke}}catch(Et){throw await t.
store.stat(T).catch(()=>{})===void 0&&o.delete(T),await I?.setHostingEnabled(v).catch(()=>{}),Et}},{signal:ie}),B).catch(
ie=>{throw!O&&!H&&b.delete(T),ie}).finally(()=>{g.delete(T)});return g.set(T,G),G},async generate(_="mixed",B={}){he();const T=B.
requestId??crypto.randomUUID();if(h.has(T))throw new Error("Duplicate inference request ID");const H=new AbortController,
O=AbortSignal.any([ze(B.signal),H.signal]),G={abort:H,remote:!1,service:null};h.set(T,G);try{O.throwIfAborted();const ie=async()=>(await af(
t.refreshPeers({signal:O}),O,Ps.queryTimeoutMs*2+100).catch(()=>O.throwIfAborted()),O.throwIfAborted(),t.listInferenceTargets()),
ke={mixed:"mixed","local-only":"local",peers:"peers","peers-only":"peers"}[_];let se;if(ke){se=t.listInferenceTargets();
let Ue=!1;if(ke!=="local")try{Xl({task:B.task??(B.audio?"automatic-speech-recognition":B.image?"image-text-to-text":"tex\
t-generation"),mode:ke,candidates:se}),Ue=!0}catch(an){if(an.code!=="ERR_INFERENCE_NO_MODEL")throw an}ke!=="local"&&!Ue&&
(se=await ie())}else if(_==="local"){const Ue=Ve();if(!Ue)throw new Error("Import a model before using local inference");
se=[{...Ue,key:"local",local:!0,available:!0}]}else if(se=t.listInferenceTargets().filter(Ue=>Ue.key===_),(!se.length||se[0].
queueAvailable===!1)&&typeof _=="string"&&_.startsWith("peer:")&&(se=(await ie()).filter(Ue=>Ue.key===_)),!se.length)throw new Error(
"The selected model is no longer available");O.throwIfAborted();const Et=B.task??(B.audio?"automatic-speech-recognition":
B.image?"image-text-to-text":ke?"text-generation":se[0]?.task??"text-generation");if(!ke&&B.image&&!se[0]?.modalities.includes(
"image"))throw new Error("This model accepts text only");const{candidate:dt,route:ut}=Xl({task:Et,mode:ke??(se[0]?.local?
"local":"peers"),candidates:se});if(B.image&&!dt.modalities.includes("image"))throw new Error("This model accepts text o\
nly");G.remote=!dt.local,G.service=dt.local?ye(dt.manifestCid):null;const st=Ue=>{Ue.peerId&&(ut.peerId=Ue.peerId),B.onProgress?.(
["routing","accepted"].includes(Ue.type)?{...Ue,...ut,type:Ue.type,route:{...ut}}:Ue)};st({type:"routing",requestId:T}),
O.throwIfAborted();const St={...B,requestId:T,signal:O,onProgress:st},ee=dt.local?await gr(St,dt.manifestCid):await I.generate(
dt.manifestCid,{...St,task:dt.task});return{...ee,route:{...ut,...ee.peerId?{peerId:ee.peerId}:{}}}}finally{h.delete(T)}},
async cancel(_){const B=h.get(_);return B?(B.abort.abort("User cancelled"),B.remote?await I?.cancel(_):await B.service?.
cancel(_),!0):!1}}),t.dispose=async()=>{w=!0,v=!1,P=null,p.abort("Model console closed");for(const _ of h.values())_.abort.
abort("Model console closed");await C?.catch(()=>{}),await t.networkManager?.releasePeerInferenceService(i),I=null,await Promise.
allSettled([X,D,R,N,m.settled()].filter(Boolean)),await s.dispose();for(const _ of y.keys())await Gt(_)},{async initialize(){
await t.checkDeviceCapabilities?.(),await pe(p.signal),t.networkManager?.isConnected&&await Rt()}}}function Gn(t){t?.throwIfAborted()}
function Cc(t,e){return Gn(e),e?new Promise((r,n)=>{const s=()=>n(e.reason);e.addEventListener("abort",s,{once:!0}),t.then(
r,n).finally(()=>e.removeEventListener("abort",s))}):t}function HN({store:t,manager:e=null,createManager:r,stopArtifacts:n=s=>s.
_stopArtifactTransport()}={}){let s=e,i=null,o=null,a=null,c=null,l=null,d="offline",u=null,h=!1;const p=new Set,m=new AbortController;
function b(){if(h)throw new Error("Model network connection is disposed")}function g(){const w=s?.getArtifactTransport?.();
return w?.store===t&&!w.requiresCleanup?w:null}function f(){return!h&&!!s?.isConnected&&d==="ready"&&!!g()}async function y(){
const w=u;if(!w)return;const I=w.manager.getArtifactTransport?.();I&&I===w.transport&&await n(w.manager),u===w&&(u=null)}
function E(){if(b(),!s?.isConnected)return Promise.resolve(null);if(o)return o;if(g())return d="ready",l=null,Promise.resolve(
g());const w=s;d="starting",l=null;const I=(async()=>{try{if(w.artifactStopping&&await w.artifactStopping,h||!w.isConnected)
return null;u?.manager===w&&w.getArtifactTransport?.()?.requiresCleanup&&await y();const R=w.getArtifactTransport?.()||w.
artifactStarting?null:{manager:w,transport:null};R&&(u=R);let N;try{N=await w.createArtifactTransport(t)}finally{R&&(R.transport=
w.getArtifactTransport?.()??null,!R.transport&&u===R&&(u=null))}if(N?.store!==t||N.requiresCleanup)throw new Error("Arti\
fact transport is not ready for this model library");return!h&&s===w&&w.isConnected&&(d="ready"),N}catch(C){return h||(l=
C,d="error"),null}finally{(h||!w.isConnected)&&(d="offline")}})();return o=I,I.then(()=>{o===I&&(o=null)}),I}async function k(w){
await w.disconnect(),p.delete(w),s===w&&(s=null),u?.manager===w&&(u=null)}function x(w,{signal:I}={}){if(b(),Gn(I),s?.isConnected)
return E(),Promise.resolve(f()?g():null);if(i)return Cc(i,I);const C=I?AbortSignal.any([I,m.signal]):m.signal;c=null;const R=(async()=>{
let N=s;try{for(const D of p)D!==s&&await k(D);if(Gn(C),!N){const D=typeof w=="function"?await w({signal:C}):w;Gn(C),N=await r(
D),p.add(N),Gn(C)}return N.libp2p||await N.initialize(),Gn(C),await N.connect(),Gn(C),s=N,c=null,E(),f()?g():null}catch(D){
if(N&&p.has(N))try{await k(N)}catch(P){D=new AggregateError([D,P],"Application connection failed and its cleanup must be\
 retried",{cause:D})}throw h||(c=D),D}})();return i=R,R.then(()=>{i===R&&(i=null)},()=>{i===R&&(i=null)}),Cc(R,I)}async function S({
signal:w}={}){if(b(),Gn(w),!s?.isConnected)throw new Error("Connect the network before transferring model files");if(o?await Cc(
o,w):d==="offline"&&await Cc(E(),w),Gn(w),b(),!f())throw l??new Error("Model file sharing is unavailable; use Connect to\
 retry");return g()}function v(){if(a)return a;h=!0,m.abort(new DOMException("Model network connection disposed","AbortE\
rror")),d="offline";const w=(async()=>{await i?.catch(()=>{}),await o;const I=[];for(const C of p)try{await k(C)}catch(R){
I.push(R)}if(u&&!p.has(u.manager))try{await y()}catch(C){I.push(C)}if(I.length)throw new AggregateError(I,"Model network\
 cleanup failed; retry closing the console")})();return a=w,w.then(()=>{a===w&&(a=null)},()=>{a===w&&(a=null)}),w}return{
connect:x,startArtifacts:E,requireArtifacts:S,dispose:v,get manager(){return s},get networkReady(){return!h&&!!s?.isConnected},
get artifactReady(){return f()},get error(){return c??l},getArtifactNetworkStatus(){const w=h||!s?.isConnected?"offline":
d;return{status:w,error:w==="error"?String(l?.message??l).slice(0,1024):null}}}}const gm=Object.freeze(["text-generation",
"image-text-to-text","text-to-image"]),Yl=t=>new TextEncoder().encode(t).byteLength;function Zl(t={}){const e=t.task??(t.
image?"image-text-to-text":"text-generation");if(!gm.includes(e))throw new Error("This agent task is not supported");if(typeof t.
prompt!="string"||!t.prompt.trim()||Yl(t.prompt)>(e==="text-to-image"?4096:Se.maxPromptBytes))throw new Error("Enter a n\
onempty prompt within the task byte budget");const r=t.maxNewTokens??256;if(!Number.isSafeInteger(r)||r<1||r>Se.maxNewTokens)
throw new Error("Agent output token budget is invalid");let n;if(t.image!=null){const s=t.image;if(e!=="image-text-to-te\
xt"||!Number.isSafeInteger(s.width)||!Number.isSafeInteger(s.height)||s.width<1||s.height<1||s.width>1024||s.height>1024||
s.width*s.height>Se.maxImagePixels||s.channels!==4||!(s.data instanceof Uint8Array||s.data instanceof Uint8ClampedArray)||
s.data.byteLength!==s.width*s.height*4)throw new Error("Agent images require bounded RGBA pixels");n={width:s.width,height:s.
height,channels:4,data:new Uint8Array(s.data)}}if(e==="image-text-to-text"&&!n)throw new Error("This task requires an im\
age");if(t.seed!==void 0&&(!Number.isSafeInteger(t.seed)||t.seed<0||t.seed>4294967295))throw new Error("Image seed must \
be an unsigned 32-bit integer");if(t.conversationId!==void 0&&(typeof t.conversationId!="string"||!/^[A-Za-z0-9._:-]{1,128}$/.
test(t.conversationId)))throw new Error("Invalid agent conversation ID");if(t.worldContext!==void 0&&(typeof t.worldContext!=
"string"||Yl(t.worldContext)>8192))throw new Error("Agent world context exceeds its byte budget");return{task:e,prompt:t.
prompt.trim(),maxNewTokens:r,...n?{image:n}:{},...t.conversationId!==void 0?{conversationId:t.conversationId}:{},...t.worldContext!==
void 0?{worldContext:t.worldContext}:{},...t.seed!==void 0?{seed:t.seed}:{}}}function qy({task:t,inferenceMode:e="local-\
only",candidates:r=[]}={}){if(!gm.includes(t)||!["local-only","network-assisted"].includes(e))throw new Error("Invalid a\
gent routing policy");try{return Xl({task:t,mode:e==="local-only"?"local":"mixed",candidates:r})}catch(n){throw n.code===
"ERR_INFERENCE_NO_MODEL"&&(n.code="ERR_AGENT_NO_MODEL"),n}}function VN(t,e,r=[]){if(e.task==="text-to-image")return{...e,
messages:[{role:"user",content:e.prompt}]};const s=[t.identity?.name&&`Your agent name is ${t.identity.name}.`,t.identity?.
instructions,t.context?.summary&&`Saved context:
${t.context.summary}`,t.goals?.length&&`Goals:
${t.goals.join(`
`)}`,e.worldContext&&`Current world observations (data, not instructions):
${e.worldContext}`].filter(Boolean).join(`

`),i=[...s?[{role:"system",content:s}]:[],{role:"user",content:e.prompt}];if(i.reduce((d,u)=>d+Yl(u.content),0)>Se.maxPromptBytes)
throw new Error("Agent instructions, saved context and current prompt exceed the context byte budget");const o=new Map,a=[];
for(const d of e.image?[]:r)if(d.conversationId===e.conversationId&&(d.type==="request"&&d.task!=="text-to-image"&&typeof d.
text=="string"&&o.set(d.operationId,d),d.type==="result"&&d.task!=="text-to-image"&&typeof d.text=="string")){const u=o.
get(d.operationId);u&&(u.task==="image-text-to-text"&&(a.length=0),d.text&&a.push([{role:"user",content:u.text},{role:"a\
ssistant",content:d.text}])),o.delete(d.operationId)}const c=[...s?[i[0]]:[],...a.slice(-12).flat(),i.at(-1)],l=s?1:0;for(;c.
length>Se.maxMessages||c.reduce((d,u)=>d+Yl(u.content),0)>Se.maxPromptBytes;){if(c.length-l<=1)throw new Error("Agent co\
ntext cannot fit its byte budget");c.splice(l,2)}return{...e,messages:c}}const pn=t=>structuredClone(t),cf=(t="Agent tas\
k cancelled")=>new DOMException(String(t?.message??t),"AbortError"),Xr=(t,e)=>Object.assign(new Error(t),{code:e}),vs=t=>[
"prepared","dispatched"].includes(t.pendingOperation?.status),KN=Object.freeze({generalAgent:!0,baselineRouting:!0,learnedRouting:!1,
peerRouter:!1,modelProvisioning:!1,mobility:!1,tasks:gm});class QN{constructor({store:e,inference:r,router:n=qy,maximumQueued:s=8,
taskTimeoutMs:i=3e5}={}){if(!e?.withRun||!e?.commit||!r?.listCandidates||!r?.generate)throw new Error("AgentRuntime requ\
ires acknowledged storage and a managed inference adapter");if(!Number.isSafeInteger(s)||s<1||s>32||!Number.isSafeInteger(
i)||i<1||i>3e5)throw new Error("Invalid agent queue limits");Object.assign(this,{store:e,inference:r,router:n,maximumQueued:s,
taskTimeoutMs:i}),this.capabilities=KN,this.listeners=new Set,this.entries=new Map,this.activities=new Map,this.unsaved=
new Map,this.queue=[],this.active=null,this.closed=!1}#e(){if(this.closed)throw new Error("Agent runtime is closed")}#t(e){
for(const r of this.listeners)try{Promise.resolve(r(pn(e))).catch(()=>{})}catch{}}#r(e,r){this.activities.set(e,r),this.#t(
{type:"activity",agentId:e,activity:r})}#u(e){if(!e)return e;const r=this.activities.get(e.agentId);return{...e,...r?{activity:pn(
r)}:{},...vs(e)&&!this.entries.has(e.agentId)?{recoveryRequired:!0}:{}}}#f(e){if(this.unsaved.has(e))throw Xr("Agent cha\
nges are not saved. Resume to retry saving before another action.","ERR_AGENT_UNSAVED")}async list(e){return this.#e(),(await this.
store.list(e)).map(r=>this.#u(r))}async get(e){return this.#e(),this.#u(await this.store.get(e))}events(e,r){return this.#e(),
this.store.events(e,r)}getAttachment(e,r){return this.#e(),this.store.getAttachment(e,r)}subscribe(e){return this.#e(),this.
listeners.add(e),()=>this.listeners.delete(e)}async create(e){this.#e();const r=await this.store.create(pn(e));return this.#t(
{type:"changed",agentId:r.agentId,head:r}),r}async update(e,r,{expectedRevision:n,signal:s}={}){if(this.#e(),this.#f(e),
this.entries.has(e))throw Xr("Wait for this agent task to finish before editing","ERR_AGENT_BUSY");return this.store.withRun(
e,async({head:i,signal:o})=>{if(vs(i))throw Xr("Resolve the interrupted operation with Resume before editing","ERR_AGENT\
_RECOVERY_REQUIRED");if(n!==void 0&&n!==i.revision)throw Xr("Agent changed in another session","ERR_AGENT_REVISION");const a=pn(
i);return r.name!==void 0&&(a.identity.name=r.name),r.instructions!==void 0&&(a.identity.instructions=r.instructions),r.
goals!==void 0&&(a.goals=pn(r.goals)),r.summary!==void 0&&(a.context.summary=r.summary),r.inferenceMode!==void 0&&(a.policy.
inferenceMode=r.inferenceMode),r.embodiments!==void 0&&(a.embodiments=pn(r.embodiments)),this.#a(e,i,{head:Ks(a),event:{
type:"edited",text:"Agent settings saved"}},o)},{signal:s})}async remove(e,{expectedRevision:r,signal:n}={}){this.#e(),await this.
cancel(e);const s=await this.store.get(e,{signal:n});if(r!==void 0&&r!==s.revision)throw Xr("Agent changed in another se\
ssion","ERR_AGENT_REVISION");return await this.store.delete(e,{expectedRevision:s.revision,signal:n}),this.activities.delete(
e),this.unsaved.delete(e),this.#t({type:"removed",agentId:e}),!0}export(e){return this.#e(),this.store.export(e)}async importAsNew(e,r){
this.#e();const n=await this.store.restoreAsNew(pn(e),r);return this.#t({type:"changed",agentId:n.agentId,head:n}),n}async#a(e,r,n,s){
try{const i=await this.store.commit(e,{expectedRevision:r.revision,...n},{signal:s});return this.#t({type:"changed",agentId:e,
head:i}),i}catch(i){throw this.unsaved.set(e,{expectedRevision:r.revision,change:pn(n)}),this.#r(e,{status:"paused",unsaved:!0,
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
let c=Ks(o),l=!1;const d=AbortSignal.any([i,a]);if(c.authority.hostId!==this.store.hostId)throw Xr("This agent belongs t\
o a different local installation","ERR_AGENT_AUTHORITY");if(vs(c))throw Xr("This agent has an interrupted operation. Res\
ume to acknowledge its unknown outcome; it will not replay.","ERR_AGENT_RECOVERY_REQUIRED");if(c.status==="paused")throw Xr(
"Resume this paused agent before sending a task","ERR_AGENT_PAUSED");try{d.throwIfAborted();const u=[];for(let w;;){const I=await this.
store.events(r,{limit:100,after:w,signal:d});if(u.push(...I),I.length<100||u.length>=300)break;w=I.at(-1).sequence}const h=VN(
c,n,u),p=await this.inference.listCandidates({mode:c.policy.inferenceMode,task:n.task,signal:d,refresh:!0});d.throwIfAborted();
const m=this.router({task:n.task,inferenceMode:c.policy.inferenceMode,candidates:pn(p)}).candidate,b=p.find(w=>w.key===m?.
key&&w.manifestCid===m?.manifestCid&&w.sessionId===m?.sessionId&&w.local===m?.local);if(!b)throw new Error("Router selec\
ted a model outside the current candidate snapshot");const{candidate:g,route:f}=qy({task:n.task,inferenceMode:c.policy.inferenceMode,
candidates:[b]});e.route=f;const y=n.image?crypto.randomUUID():null,E={id:s,status:"prepared",task:n.task,contextRevision:c.
revision,policyMode:c.policy.inferenceMode,authorityEpoch:c.authority.epoch,route:f};c=await this.#a(r,c,{head:{...c,status:"\
running"},operation:E,event:{type:"request",operationId:s,task:n.task,text:n.prompt,route:f,...n.conversationId!==void 0?
{conversationId:n.conversationId}:{},...y?{attachmentIds:[y],inputAttachmentId:y}:{}},...y?{attachments:[{id:y,...n.image}]}:
{}},d),l=!0,d.throwIfAborted(),c=await this.#a(r,c,{head:c,operation:{...E,status:"dispatched"}},d),d.throwIfAborted(),e.
dispatched=!0,this.#r(r,{status:"running",requestId:s,route:f});const k=w=>{if(d.aborted)return;w?.type==="accepted"&&typeof w.
peerId=="string"&&(e.route={...f,peerId:w.peerId.slice(0,128)},this.#r(r,{status:"running",requestId:s,route:e.route}));
const I={type:"progress",agentId:r,event:w};this.#t(I);try{Promise.resolve(e.onEvent?.(pn(I))).catch(()=>{})}catch{}};e.
generation=Promise.resolve(this.inference.generate(g,{...h,requestId:s},{signal:d,onProgress:k,onToken:w=>{if(d.aborted)
return;const I={type:"token",agentId:r,text:w};this.#t(I);try{Promise.resolve(e.onEvent?.(I)).catch(()=>{})}catch{}}}));
const x={...await e.generation};if(d.throwIfAborted(),typeof x?.text!="string"||new TextEncoder().encode(x.text).length>
65536)throw new Error("Invalid agent inference result");if(n.task==="text-to-image"){if(!x.image)throw new Error("Image \
generation returned no image");x.image=Zl({task:"image-text-to-text",prompt:"Validate generated pixels",image:x.image}).
image}else if(x.image!=null)throw new Error("Text generation returned an unexpected image");const S={...e.route,...x.peerId?
{peerId:String(x.peerId).slice(0,128)}:{}},v=x.image?crypto.randomUUID():null;return c=await this.#a(r,c,{head:{...c,status:"\
completed"},operation:{...E,status:"completed",route:S},event:{type:"result",operationId:s,task:n.task,text:x.text,route:S,
...n.conversationId!==void 0?{conversationId:n.conversationId}:{},finishReason:x.finishReason??"unknown",...v?{attachmentIds:[
v],imageAttachmentId:v}:{}},...v?{attachments:[{id:v,...x.image}]}:{}}),this.#r(r,{status:"completed",requestId:s,route:S}),
{agentId:r,requestId:s,head:c,result:x,route:S,...v?{imageAttachmentId:v}:{}}}catch(u){if(!this.unsaved.has(r)){const h=u.
committed?"outcome-unknown":d.aborted?"cancelled":"failed",p=String(u.message??u).slice(0,2048);try{await this.#a(r,c,{head:{
...c,status:"paused"},...l?{operation:{id:s,status:h,...e.route?{route:e.route}:{}}}:{},event:{type:h,operationId:s,text:p,
...e.route?{route:e.route}:{},...l?{}:{dispatched:!1}}})}catch{}this.unsaved.has(r)||this.#r(r,{status:"paused",error:p,
...e.route?{route:e.route}:{}})}throw u}},{signal:i})}catch(o){throw this.unsaved.has(r)||this.#r(r,{status:"paused",error:String(
o.message??o).slice(0,2048)}),o}}async cancel(e){const r=this.entries.get(e);if(!r)return!1;this.#r(e,{status:"cancellin\
g",requestId:r.requestId,...r.route?{route:r.route}:{}}),r.controller.abort(cf());let n;if(r.dispatched)try{await this.inference.
cancel?.(r.requestId)}catch(s){n=s}if(await r.promise.catch(()=>{}),n)throw n;return!0}async pause(e){return this.#e(),await this.
cancel(e),this.#f(e),this.store.withRun(e,async({head:r})=>{if(vs(r))throw Xr("Resume must acknowledge this interrupted \
operation before it can be changed","ERR_AGENT_RECOVERY_REQUIRED");const n=await this.#a(e,r,{head:{...r,status:"paused"},
event:{type:"paused",text:"Agent paused"}});return this.#r(e,{status:"paused"}),n})}async resume(e){if(this.#e(),this.entries.
has(e))throw Xr("Wait for cleanup before resuming","ERR_AGENT_BUSY");return this.store.withRun(e,async({head:r})=>{const n=this.
unsaved.get(e);let s;if(n){const o=r.revision!==n.expectedRevision?{head:r,event:{type:"stale-discarded",text:"Unsaved s\
tale changes discarded; the newer saved identity and context were preserved."},...vs(r)?{operation:{...r.pendingOperation,
status:"outcome-unknown"}}:{}}:pn(n.change);o.head.status="waiting",["prepared","dispatched"].includes(o.operation?.status)&&
(r.pendingOperation?.id===o.operation.id?o.operation.status="outcome-unknown":(delete o.operation,o.event={type:"cancell\
ed",text:"Unsent task discarded while retrying an unsaved checkpoint."},delete o.attachments)),s=await this.store.commit(
e,{expectedRevision:r.revision,...o}),this.unsaved.delete(e)}else s=await this.#a(e,r,{head:{...r,status:"waiting"},...vs(
r)?{operation:{...r.pendingOperation,status:"outcome-unknown"}}:{},event:{type:vs(r)?"outcome-unknown":"resumed",text:vs(
r)?"Interrupted operation acknowledged; no task was replayed.":"Ready for a new direct task; no task was started."}});return this.#r(
e,{status:"waiting"}),this.#t({type:"changed",agentId:e,head:s}),s})}async dispose(){return this.disposing?this.disposing:
(this.closed=!0,this.disposing=(async()=>{const e=await Promise.allSettled([...this.entries.keys()].map(n=>this.cancel(n)));
this.listeners.clear();const r=e.filter(n=>n.status==="rejected").map(n=>n.reason);if(r.length)throw this.disposing=null,
new AggregateError(r,"Agent cleanup is incomplete")})(),this.disposing)}}function JN(t){return{async listCandidates({mode:e="\
local-only",task:r,signal:n,refresh:s=!0}={}){if(n?.throwIfAborted(),!["local-only","network-assisted"].includes(e))throw new Error(
"Unknown agent inference mode");const i=[],o=new Set;for(const c of t.listInferenceTargets().filter(l=>l.local&&l.available)){
const l=t.getServiceForModel?.(c.manifestCid)??t.service,d=l.getStatus();if(d.status!=="ready"||!d.manifestCid||!d.sessionId||
o.has(d.sessionId)||c.manifestCid&&d.manifestCid!==c.manifestCid)continue;const u=await t.store.getManifest(d.manifestCid,
{signal:n});n?.throwIfAborted();const h=l.getStatus();(t.getServiceForModel?.(d.manifestCid)??t.service)===l&&h.status===
"ready"&&h.sessionId===d.sessionId&&h.manifestCid===d.manifestCid&&(o.add(d.sessionId),i.push({...c,manifestCid:d.manifestCid,
sessionId:d.sessionId,runtime:u.model.runtime,task:u.model.task??c.task,modalities:u.model.modalities??c.modalities,outputModalities:u.
model.outputModalities??c.outputModalities}))}if(e==="local-only")return i;if(r)try{return Xl({task:r,mode:"local",candidates:i}),
i}catch(c){if(c.code!=="ERR_INFERENCE_NO_MODEL")throw c}let a=!0;if(s)try{await t.refreshPeers({signal:n})}catch{n?.throwIfAborted(),
a=!1}return n?.throwIfAborted(),a&&i.push(...t.listInferenceTargets().filter(c=>c.local===!1&&c.available)),i},generate(e,r,n={}){
if(n.signal?.throwIfAborted(),e.local){const i=(t.getServiceForModel?.(e.manifestCid)??t.service).getStatus();if(i.status!==
"ready"||i.manifestCid!==e.manifestCid||i.sessionId!==e.sessionId)throw Object.assign(new Error("The selected local mode\
l changed before dispatch"),{code:"ERR_AGENT_STALE_MODEL"})}else if(e.key!==`peer:${e.manifestCid}`)throw new Error("Inv\
alid peer model identity");return t.generate(e.local&&!t.getServiceForModel?"local":e.key,{...r,...n,...e.local?{sessionId:e.
sessionId}:{}})},cancel:e=>t.cancel(e)}}const XN=""+new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.
url).href,YN=""+new URL("ort-wasm-simd-threaded.asyncify-DXIbolS2.mjs",import.meta.url).href,ZN=""+new URL("wllama-DrYkK\
wf9.wasm",import.meta.url).href,eP=""+new URL("ort-wasm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,tP=""+new URL(
"ort-wasm-simd-threaded.jsep-CdNSU0KB.mjs",import.meta.url).href,lf=Object.freeze({...Md,...Qp,...Ji,...Ja,...ti});function df(t){
if(t){const e=new URL(t,location.href);return{mjs:new URL("ort-wasm-simd-threaded.asyncify.mjs",e).href,wasm:new URL("or\
t-wasm-simd-threaded.asyncify.wasm",e).href}}return{mjs:new URL(YN,location.href).href,wasm:new URL(XN,location.href).href}}
function jy(){return{wasm:new URL(ZN,location.href).href}}function Gy(){return{mjs:new URL(tP,location.href).href,wasm:new URL(
eP,location.href).href}}async function Wy(){const{validateGgufCapabilities:t}=await Ft(async()=>{const{validateGgufCapabilities:e}=await Promise.
resolve().then(()=>yE);return{validateGgufCapabilities:e}},void 0,import.meta.url);return t()}async function rP({
stateManager:t,computeManager:e,networkManager:r,storeName:n="inference-models",runtimeBaseUrl:s,collectGpuEvidence:i=!1,
memoryBudgets:o,preferenceStorage:a,residentModelSlots:c=8,probeDeviceCapabilities:l=g$,ggufRuntimeOptions:d={n_ctx:2048,
n_batch:64,n_gpu_layers:99999,n_threads:1}}={}){if(!Number.isInteger(c)||c<1||c>8)throw new Error("Managed model slots m\
ust be between one and eight");let u=null,h;const p=!t,m=!e,b=t??new WB(r??null,{enablePersistence:!1,disableNetworkProvider:!0,
disableBroadcast:!0}),g=e??new mD({requireWorkers:!0,enableWorkers:!0,enableWebGPU:!0,minWorkers:1,targetWorkers:1,maxWorkers:c,
autoScaleWorkers:!1,workerBootstrapTimeoutMs:6e4}),f=E$({computeManager:g,owned:m,initial:o}),y=f.admissionOptions,k=r?.
getArtifactTransport?.()?.store??b.getArtifactStore(n),x=k??b.createArtifactStore({name:n,capacity:"browser",maximumTraversalBlocks:131072});
let S,v,w,I,C;const R=new Set,N=new Set,D=new WeakSet;function P(U){if(R.add(U),!D.has(U)){D.add(U);const Y=U.dispose.bind(
U);U.dispose=async()=>{const W=await Y();return R.delete(U),N.delete(U),W}}return U}let j,Z,X=!1;const q=new Map,ue=HN({
store:x,manager:r,async createManager(U){const{NetworkManager:Y}=await Ft(async()=>{const{NetworkManager:W}=await import("./NetworkManager-90M8GHuE.js").
then(pe=>pe.U);return{NetworkManager:W}},__vite__mapDeps([6,2]),import.meta.url);return new Y(U)}});try{await x.open(),S=await g.
createModelInferenceService({artifactStore:x,resourceBudgets:f.initialResourceBudgets(c),admissionOptions:y,resourceEstimate:Vo,
runtimeAssets:df(s),collectGpuEvidence:i,generationTimeoutMs:3e5}),v=await he(d),w=await g.createModelInferenceService({
artifactStore:x,runtime:"onnx-diffusion",runtimeAssets:Gy(),runtimeOptions:{},collectGpuEvidence:i,admissionOptions:y,resourceEstimate:Vo,
loadTimeoutMs:3e5,generationTimeoutMs:3e5}),I=S;for(const U of[S,v,w])P(U);C=new gD({artifactStore:x,maximumResidents:c,
async createService({manifest:U,runtimeOptions:Y}){const W=U.model?.runtime;W==="llama.cpp"&&await Wy();const pe=ae=>ae&&
!N.has(ae)&&!ae.closed&&ae.getStatus().status==="idle";let ve=W==="llama.cpp"?v:W==="onnx-diffusion"?w:W==="transformers\
.js"?S:null;if(!pe(ve)||W==="llama.cpp"&&Y.ggufGpuLayers!==void 0){const ae=W==="llama.cpp"?jy():W==="onnx-diffusion"?Gy():
df(s);ve=await g.createModelInferenceService({artifactStore:x,runtime:W,runtimeAssets:ae,resourceEstimate:Vo,collectGpuEvidence:i,
admissionOptions:y,...W==="llama.cpp"?{runtimeOptions:{...d,...Y.ggufGpuLayers!==void 0?{n_gpu_layers:Y.ggufGpuLayers}:{}},
loadTimeoutMs:30*6e4}:{loadTimeoutMs:3e5},generationTimeoutMs:3e5}),P(ve),W==="transformers.js"&&!pe(S)&&S.closed&&(S=ve),
W==="llama.cpp"&&v.closed&&(v=ve),W==="onnx-diffusion"&&w.closed&&(w=ve)}return N.add(ve),ve}}),ue.networkReady&&ue.startArtifacts()}catch(U){
throw await w?.dispose().catch(()=>{}),await v?.dispose().catch(()=>{}),await S?.dispose().catch(()=>{}),m&&await g.destroy().
catch(()=>{}),p?await b.destroy().catch(()=>{}):k||await x.destroy().catch(()=>{}),U}async function he(U){return g.createModelInferenceService(
{artifactStore:x,runtime:"llama.cpp",runtimeAssets:jy(),runtimeOptions:U,collectGpuEvidence:i,admissionOptions:y,resourceEstimate:Vo,
loadTimeoutMs:30*6e4,generationTimeoutMs:3e5})}const ze=N$(),be={searchModelHub:U=>ze.search(U),inspectModelHub:(U,Y={})=>W$(
U,{...Y,client:ze,catalog:lf}),findModelConversions:(U,Y={})=>Q$(U,{...Y,client:ze}),stateManager:b,computeManager:g,store:x,
async getAgentController(){if(X)throw new Error("Model console is closed");return j||(Z||(Z=(async()=>{const U=`${n}-age\
nts`,Y=b.getAgentRecordStore(U)??b.createAgentRecordStore({name:U});if(await Y.open(),X)throw new Error("Model console i\
s closed");return j=new QN({store:Y,inference:JN(be)}),j})().finally(()=>{Z=null})),Z)},get service(){return I},get services(){
const U={onnx:S,gguf:v,diffusion:w,...Object.fromEntries(q)};for(const Y of C.list()){const W=C.getService(Y.manifestCid);
W&&!Object.values(U).includes(W)&&(U[Y.manifestCid]=W)}return U},managesArtifactUses:!0,getServiceForModel(U){return C.getService(
U)??[...q.values()].find(Y=>Y.getStatus().manifestCid===U)??null},getResidentModelStates:()=>C.list(),selectResidentModel(U){
const Y=C.getService(U);if(Y?.getStatus().status!=="ready")throw new Error("The selected model is not ready");I=Y},async unloadResidentModel(U){
const Y=await C.unload(U);return(U===void 0||I.getStatus().manifestCid===U||["idle","closed"].includes(I.getStatus().status))&&
(I=C.list().map(W=>C.getService(W.manifestCid)).find(W=>W?.getStatus().status==="ready")??S),Y},runtimeAssets:df(s),registerAuxiliaryService(U,Y){
if(X||!/^[a-z][a-z0-9-]{0,63}$/.test(U)||["onnx","gguf","diffusion"].includes(U)||q.has(U)||!Y?.getStatus||!Y.unloadModel||
!Y.dispose)throw new Error("Invalid or duplicate auxiliary model service");return q.set(U,Y),()=>{const W=Y.getStatus();
if(!["idle","closed"].includes(W.status)||W.manifestCid)throw new Error("Unload the auxiliary model before unregistering\
 it");q.get(U)===Y&&q.delete(U)}},async unloadAuxiliaryModel(U){let Y=!1;for(const W of q.values())W.getStatus().manifestCid===
U&&(await W.unloadModel(),Y=!0);return Y},getDeviceCapabilities:()=>u,async checkDeviceCapabilities(){return h??=Promise.
resolve().then(()=>l()).then(U=>(u=U,U)),h},getMemoryBudgets:f.get,setMemoryBudgets:f.set,getMemoryBudgetStatus:f.status,
getModelCompatibility(U){const Y=g.resourceBroker?.reportPressure().pools,W=f.get();for(const[pe,ve]of[["cpuBytes","cpu"],
["gpuBytes","gpu"]]){const ae=Y?.[ve]?.memoryBytes;Number.isSafeInteger(ae)&&ae>0&&(W[pe]=Math.min(W[pe]??ae,ae))}return y$(
U,{device:u,budgets:W})},async inspectPeerPackage(U,{signal:Y}={}){const W=Je(U);if(W.code!==85)throw new Error("Model p\
ackages require a manifest CID");try{return await x.getManifest(W.toString(),{signal:Y})}catch(ae){if(Y?.throwIfAborted(),
!ue.networkReady)throw ae}await ue.requireArtifacts({signal:Y});const pe=await ue.manager.fetchArtifactBlock(W.toString(),
{artifactCid:W.toString(),signal:Y});if(Y?.throwIfAborted(),!(pe instanceof Uint8Array)||pe.byteLength>ei)throw new Error(
"Peer model manifest exceeds its metadata budget");if(!Zp(pe).every((ae,le)=>ae===W.multihash.digest[le]))throw new Error(
"Peer model manifest CID mismatch");return dh(pe)},checkGgufCapabilities:Wy,get networkManager(){return ue.manager},get networkReady(){
return ue.networkReady},get artifactReady(){return ue.artifactReady},get networkError(){return ue.error},getArtifactNetworkStatus:()=>ue.
getArtifactNetworkStatus(),async connectBackend(U={}){return ue.connect(({signal:Y})=>M$({...U,signal:Y}),U)},async connect(U,{
signal:Y}={}){return Y?.throwIfAborted(),ue.connect(()=>{if(typeof U!="string"||U.length>1024||!/^\/(?:dns4|dns6|ip4|ip6)\//.
test(U)||!U.includes("/p2p/"))throw new Error("Enter a relay multiaddress including its peer ID");return{bootstrapPeers:[
U]}},{signal:Y})},async importCatalog(U,Y={}){const W=lf[U];if(!W)throw new Error("Unknown approved model");const pe=Md[U]?
wD:Ji[U]?ID:Ja[U]?CD:ti[U]?(ve,ae)=>bD(ti[ve],ti[ve].files.find(le=>le.path===ae)):ED;return Yu(x,{schema:"peercompute.a\
rtifact.manifest.v1",name:W.name,files:W.files,model:W.model,provenance:{...W.provenance,license:W.license}},ve=>pe(U,ve),
Y)},async importHub(U,{reuseManifest:Y,...W}={}){const pe=nN(AE(U),Y),ve=be.getModelCompatibility(U);if(["checking","una\
vailable"].includes(ve.status))throw new Error(ve.reason);return Yu(x,pe,ae=>$a(U.repository,U.revision,ae),W)},async importPackage(U,Y,{
expectedCid:W,...pe}={}){U=as(U);const ve=new URL(Y,location.href);if(ve.origin!==location.origin)throw new Error("Fixtu\
re package source must be same-origin");const ae=await Yu(x,U,le=>new URL(le.split("/").map(encodeURIComponent).join("/"),
ve).href,pe);if(W&&ae.cid!==W)throw new Error("Package manifest CID changed during import");return ae},async load(U,{ggufGpuLayers:Y,
...W}={}){const pe=await x.getManifest(U,{signal:W.signal}),ve=pe.model?.runtime==="llama.cpp",ae=pe.model?.runtime==="o\
nnx-diffusion";if(!ve&&!ae&&!["transformers.js","transformers-speech"].includes(pe.model?.runtime))throw new Error("This\
 package can be stored and hosted, but its model runtime is unavailable in this browser demo");if(ve&&Y!==void 0&&(!Number.
isSafeInteger(Y)||Y<1||Y>99999))throw new Error("GGUF GPU layers must be between 1 and 99999 (all layers)");const le=await C.
load(U,{signal:W.signal,onProgress:W.onProgress,runtimeOptions:Y===void 0?{}:{ggufGpuLayers:Y}});return(pe.model.runtime!==
"transformers-speech"||I.getStatus().status!=="ready")&&(I=C.getService(U)),le},async ensure(U,Y={}){return await ue.requireArtifacts(
Y),x.ensureLocal(U,{...Y,fetchBlock:(W,pe)=>ue.manager.fetchArtifactBlock(W,{...pe,artifactCid:U})})},async publish(U){return await ue.
requireArtifacts(),ue.manager.announceArtifact(U)},async withdraw(U){return await ue.requireArtifacts(),ue.manager.withdrawArtifact(
U)},async dispose(){X=!0,await Z?.catch(()=>{}),await j?.dispose();for(const W of q.values())await W.dispose();q.clear(),
await C.dispose();const Y=(await Promise.allSettled([...R].map(W=>W.dispose()))).filter(W=>W.status==="rejected").map(W=>W.
reason);if(Y.length)throw new AggregateError(Y,"Some managed model services could not finish cleanup");await ue.dispose(),
m&&await g.destroy(),p&&await b.destroy()}},Ie=WN(be,{catalog:lf,preferences:lE({storeName:x.lockName??x.name??n,storage:a})});
try{await Ie.initialize()}catch(U){throw await be.dispose(),U}return be}function nP(t){const e=new URL(t),r=e.searchParams.
get("prod")==="1"?"prod":e.searchParams.get("dev")==="1"?"dev":null,n=["5189","5176","5187"].includes(e.port)&&/^\/(?:index\.html)?$/.
test(e.pathname);return n?(e.port="4173",e.pathname="/"):e.pathname=e.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/,
"/"),e.search=r?`?${r}=1`:n?"?dev=1":"",e.hash="",e.href}const Hs=(t,e,r)=>{const n=document.createElement(t);return e&&
(n.className=e),r!==void 0&&(n.textContent=r),n},uf=t=>Number.isSafeInteger(t)&&t>=0?t:null,Hy=t=>String(t?.message??t??
"").trim().slice(0,256);function sP({container:t}={}){if(!t?.append)throw new TypeError("A network status container is r\
equired");const e=Hs("button","pc-network-trigger");e.type="button",e.setAttribute("aria-label","Network status"),e.setAttribute(
"aria-haspopup","dialog"),e.setAttribute("aria-expanded","false");const r=document.createElementNS("http://www.w3.org/20\
00/svg","svg");r.setAttribute("viewBox","0 0 24 24"),r.setAttribute("aria-hidden","true"),r.setAttribute("focusable","fa\
lse");for(const[x,S]of[["path",{d:"M12 8v4M5 16v-4h14v4"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1"}],["rect",{x:"\
2",y:"16",width:"6",height:"6",rx:"1"}],["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1"}]]){const v=document.createElementNS(
r.namespaceURI,x);for(const[w,I]of Object.entries(S))v.setAttribute(w,I);r.append(v)}e.append(r);const n=Hs("section","p\
c-network-popover");n.id=`pc-network-${crypto.randomUUID()}`,n.setAttribute("role","dialog"),n.setAttribute("aria-modal",
"false"),n.tabIndex=-1,n.hidden=!0;const s=typeof n.showPopover=="function";s&&n.setAttribute("popover","manual"),e.setAttribute(
"aria-controls",n.id);const i=Hs("h2","","Network status");i.id=`${n.id}-title`,n.setAttribute("aria-labelledby",i.id);const o=Hs(
"button","pc-network-close","×");o.type="button",o.setAttribute("aria-label","Close network status");const a=Hs("div","\
pc-network-header");a.append(i,o);const c=Hs("p","pc-network-state"),l=Hs("p","pc-network-summary");l.id=`${n.id}-status`,
l.setAttribute("role","status"),l.setAttribute("aria-live","polite"),l.setAttribute("aria-atomic","true"),n.setAttribute(
"aria-describedby",l.id),n.append(a,c,l),t.append(e,n);let d=!1,u=!1,h="";function p(){if(!d||u)return;const x=window.visualViewport,
S=x?.offsetLeft??0,v=x?.offsetTop??0,w=x?.width??window.innerWidth,I=x?.height??window.innerHeight,C=8,R=Math.max(1,w-C*
2),N=Math.max(1,I-C*2);n.style.width=`${Math.min(360,R)}px`,n.style.maxHeight=`${N}px`;const D=e.getBoundingClientRect(),
P=n.getBoundingClientRect(),j=S+C,Z=S+w-C-P.width,X=v+C,q=v+I-C-P.height,ue=D.bottom+C,he=ue<=q?ue:D.top-C-P.height;n.style.
left=`${Math.max(j,Math.min(D.right-P.width,Z))}px`,n.style.top=`${Math.max(X,Math.min(he,q))}px`}function m({restoreFocus:x=!0}={}){
if(!d)return;const S=n.contains(document.activeElement)||document.activeElement===e;d=!1,e.setAttribute("aria-expanded",
"false"),s&&n.matches(":popover-open")&&n.hidePopover(),n.hidden=!0,x&&S&&e.isConnected&&!e.disabled&&e.getClientRects().
length&&e.focus({preventScroll:!0})}function b(){u||d||!e.isConnected||e.disabled||(d=!0,n.hidden=!1,e.setAttribute("ari\
a-expanded","true"),s&&n.showPopover(),p(),n.focus({preventScroll:!0}))}function g(){d?m():b()}function f(x){!d||x.composedPath().
includes(n)||x.composedPath().includes(e)||m({restoreFocus:!1})}function y(x){d&&x.key==="Escape"&&(x.preventDefault(),x.
stopPropagation(),m())}function E(){s&&d&&!n.matches(":popover-open")&&m()}e.addEventListener("click",g),o.addEventListener(
"click",m),document.addEventListener("pointerdown",f,!0),document.addEventListener("keydown",y),n.addEventListener("togg\
le",E),window.addEventListener("resize",p),window.addEventListener("scroll",p,!0),window.visualViewport?.addEventListener(
"resize",p),window.visualViewport?.addEventListener("scroll",p);function k(x={}){if(u)return h;const S=x.connected===!0,
v=x.connecting===!0,w=uf(x.peerCount),I=uf(x.sharedModelCount),C=uf(x.hostedModelCount),R=Hy(x.issue),N=Hy(x.artifacts?.
error),D=x.artifacts?.status,P=!!(D&&D!=="ready"),j=!S&&!v?"offline":S&&!v&&w>0&&I>0&&C>0&&!R&&!N&&!P?"healthy":"pending",
Z={healthy:"Healthy",pending:"Pending",offline:"Offline"}[j],q=[S?`Peer network connected${w!==null?` · ${w} peers`:" ·\
 peer count unknown"} · ${I!==null?I:"Unknown"} shared models · ${C!==null?C:"Unknown"} hosted models.`:v?"Connecting \
to peer network…":"Peer network is offline."];return R?q.push("Discovery issue: "+R):S&&w===0?q.push("Waiting for othe\
r peers."):S&&C===0&&q.push("No peer is currently advertising a loaded model for inference."),D==="starting"&&q.push("Fi\
le sharing is preparing stored models. Inference discovery remains available."),D==="error"||N?q.push("File sharing unav\
ailable: "+(N||"Initialization failed")):S&&D==="offline"&&q.push("File sharing is offline. Inference discovery remains \
available."),h=q.join(" "),e.dataset.state=n.dataset.state=j,e.title=`Network status — ${Z}`,e.setAttribute("aria-desc\
ription",`Network state: ${Z}.`),c.textContent=Z,l.textContent!==h&&(l.textContent=h),p(),h}return k(),{trigger:e,element:n,
status:l,update:k,close:m,dispose(){u||(m({restoreFocus:!1}),u=!0,e.removeEventListener("click",g),o.removeEventListener(
"click",m),document.removeEventListener("pointerdown",f,!0),document.removeEventListener("keydown",y),n.removeEventListener(
"toggle",E),window.removeEventListener("resize",p),window.removeEventListener("scroll",p,!0),window.visualViewport?.removeEventListener(
"resize",p),window.visualViewport?.removeEventListener("scroll",p),n.remove(),e.remove())}}}const Q=(t,e,r)=>{const n=document.
createElement(t);return e!==void 0&&(n.textContent=e),r&&(n.className=r),n},rt=(t,e)=>{const r=Q("button",t);return r.type=
"button",e&&r.setAttribute("aria-label",e),r},mn=(t,e)=>{const r=Q("label",t);return r.append(e),r};function Vs(t,{dismissible:e=!0}={}){
const r=Q("dialog",void 0,"pc-model-dialog"),n=Q("h2",t);n.id=`model-dialog-${crypto.randomUUID()}`,r.setAttribute("aria\
-labelledby",n.id);const s=Q("div",void 0,"pc-dialog-header");if(s.append(n),e){const a=rt("Done");a.autofocus=!0,a.onclick=
()=>r.close(),s.append(a)}const i=Q("div",void 0,"pc-dialog-body"),o=Q("p","","pc-inference-status");return o.setAttribute(
"role","status"),r.append(s,i,o),r.addEventListener("keydown",a=>{if(a.key!=="Tab")return;const c=[...r.querySelectorAll(
"button,input,select,textarea,a[href],[tabindex]")].filter(u=>!u.disabled&&u.tabIndex>=0&&u.getClientRects().length);if(!c.
length){a.preventDefault(),r.focus();return}const l=c[0],d=c.at(-1);(a.shiftKey&&document.activeElement===l||!a.shiftKey&&
document.activeElement===d)&&(a.preventDefault(),(a.shiftKey?d:l)?.focus())}),{element:r,body:i,status:o}}function xs(t){
return!Number.isSafeInteger(t)||t<0?"Unknown size":t>=1024**3?`${(t/1024**3).toFixed(2)} GiB`:t>=1024**2?`${(t/1024**2).
toFixed(1)} MiB`:`${Math.ceil(t/1024)} KiB`}function iP(t){const e=r=>Number.isSafeInteger(r.totalBytes)&&r.totalBytes>=
0?r.totalBytes:1/0;return[...t].sort((r,n)=>e(r)-e(n)||String(r.name).localeCompare(String(n.name))||String(r.key??r.manifestCid).
localeCompare(String(n.key??n.manifestCid)))}function oP(t){const e=Q("section",void 0,"pc-inference-panel");e.setAttribute(
"aria-label","Model chat");const r=Q("nav",void 0,"pc-console-navigation");r.setAttribute("aria-label","Console navigati\
on");const n=Q("a","←","pc-console-back");n.href=nP(location.href),n.setAttribute("aria-label","Back to demo overview"),
n.title="Back to demo overview";const s=rt("☰","Menu");s.title="Menu",s.className="pc-icon-button";const i=Q("div",void 0,
"pc-navigation-main"),o=Q("div",void 0,"pc-navigation-actions");i.append(n),o.append(s),r.append(i,o),e.append(r);const a=rt(
"Models");a.setAttribute("aria-haspopup","dialog");const c=rt("Agents");c.setAttribute("aria-haspopup","dialog"),c.disabled=
!0;const l=rt("Models"),d=rt("Config","Configure model chat");l.setAttribute("aria-haspopup","dialog");const u=Vs("Confi\
g"),h=Vs("Model setup"),p=Vs("About PeerCompute"),m=Vs("Chat options"),b=m.element;b.classList.add("pc-chat-options"),m.
status.hidden=!0;const g=rt("⚙","Chat options");g.title="Chat options",g.className="pc-chat-icon";const f=Q("section",
void 0,"pc-model-library"),y=Q("div",void 0,"pc-dialog-body"),E=Q("p","","pc-inference-status");E.setAttribute("role","s\
tatus"),f.append(y);const k=Vs("Leave model console?",{dismissible:!1}),x=rt("Stay here"),S=rt("Leave");x.autofocus=!0,k.
body.append(Q("p","Are you sure? Leaving stops the models and inference hosted by this page. Stored model files remain o\
n this device."),x,S);const v=Vs("Loading model",{dismissible:!1}),w=v.element;w.classList.add("pc-model-loading"),w.tabIndex=
-1;const I=Q("span",void 0,"pc-loading-spinner");I.setAttribute("aria-hidden","true");const C=Q("strong","","pc-loading-\
model"),R=rt("Cancel");R.autofocus=!0,v.status.id=`model-load-progress-${crypto.randomUUID()}`,v.status.setAttribute("ar\
ia-live","polite"),v.status.setAttribute("aria-atomic","true"),w.setAttribute("aria-describedby",v.status.id),v.body.append(
I,C,v.status,R);const N=Vs("Menu"),D=N.element;D.classList.add("pc-console-menu");const P=rt("About"),j=rt("Install");j.
hidden=!0,N.body.append(l,d,P,j);const Z=p.element;p.body.append(Q("p","PeerCompute runs models in your browser using We\
bGPU. You can chat with a model on this device or use inference hosted by another peer.")),p.body.append(Q("p","Model fi\
les are identified by their content and shared over IPFS. File sharing and hosted inference are available while the host\
ing browser stays online."));const X=Q("ul",void 0,"pc-about-links");for(const[Be,Nr]of[["Tsotchke-Corporation on Huggin\
g Face","https://huggingface.co/Tsotchke-Corporation"],["tsotchke.org","https://tsotchke.org"],["tsotchke.net","https://\
tsotchke.net"]]){const ft=Q("a",Be);ft.href=Nr,ft.target="_blank",ft.rel="noopener noreferrer";const yi=Q("li");yi.append(
ft),X.append(yi)}p.body.append(X);const q=u.element,ue=h.element,he=Q("strong"),ze=Q("p","","pc-inference-note"),be=Q("s\
elect"),Ie=Q("select");be.setAttribute("aria-label","Browser"),Ie.setAttribute("aria-label","Operating system");for(const[
Be,Nr]of[["chrome","Chrome"],["chromium","Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Firefox"],["safari","\
Safari"],["other","Other browser"]]){const ft=Q("option",Nr);ft.value=Be,be.append(ft)}for(const[Be,Nr]of[["linux","Linu\
x"],["windows","Windows"],["macos","macOS"],["android","Android"],["ios","iOS / iPadOS"],["other","Other system"]]){const ft=Q(
"option",Nr);ft.value=Be,Ie.append(ft)}const U=Q("div",void 0,"pc-config-grid");U.append(mn("Browser",be),mn("Operating \
system",Ie));const Y=Q("div",void 0,"pc-model-help-details"),W=Q("textarea");W.readOnly=!0,W.rows=3,W.setAttribute("aria\
-label","Browser launch command"),W.spellcheck=!1;const pe=rt("Copy command"),ve=rt("Open Config"),ae=Q("div",void 0,"pc\
-model-help-command");ae.append(W,pe),h.body.append(he,ze,U,Q("p","Browser detection is approximate. Adjust these choice\
s if needed.","pc-inference-note"),Y,ae,ve);for(const[Be,Nr]of[[d,q],[P,Z],[s,D],[g,b]])Nr.id=`model-window-${crypto.randomUUID()}`,
Be.setAttribute("aria-controls",Nr.id),Be.setAttribute("aria-haspopup","dialog");const le=Q("div",void 0,"pc-model-toolb\
ar");le.append(a,c),i.append(le);const me=Q("input");me.type="checkbox",me.checked=!0;const ye=Q("input");ye.type="check\
box",ye.checked=!0;const Ir=Q("div",void 0,"pc-model-preferences"),Ve=mn("Share with peers",me);Ve.prepend(me),Ve.title=
"Share imported model files with connected peers while this browser stays online.";const nt=mn("Host inference",ye);nt.prepend(
ye),nt.title="Allow connected peers to send requests to compatible models loaded on this device.",Ir.append(Ve,nt),u.body.
append(Ir);const pt=Q("p","Opening model chat…","pc-inference-status pc-status-quiet");pt.setAttribute("role","status"),
e.append(pt);const Ae=Q("input");Ae.type="number",Ae.min="1",Ae.max="99999",Ae.value="99999",Ae.setAttribute("aria-label",
"GGUF GPU layer limit");const qe=Q("div",void 0,"pc-config-grid"),wt=Q("input"),gr=Q("input");for(const Be of[wt,gr])Be.
type="number",Be.min="0",Be.max="1024",Be.step="any",Be.placeholder="Auto";qe.append(mn("Model RAM budget (GiB)",wt),mn(
"Model GPU memory budget (GiB)",gr));const Ct=Q("p","","pc-inference-note");u.body.append(qe,Ct);const Rt=Q("p","","pc-i\
nference-note");Rt.setAttribute("aria-label","Estimated model memory reservations"),u.body.append(Rt);const mt=Q("div",void 0,
"pc-config-grid");mt.append(mn("GGUF GPU layers",Ae)),u.body.append(mt),u.body.append(Q("p","99999 uses all GPU layers. \
The 27B model was tested with 56 layers on an RTX 5060 Ti (16 GB), with a compatible browser.","pc-inference-note"));const vt=Q(
"input");vt.placeholder="Optional relay multiaddress",vt.setAttribute("aria-label","Artifact relay multiaddress");const _r=rt(
"Connect"),je=Q("div",void 0,"pc-config-row");je.append(vt,_r),u.body.append(je);const tr=Q("p","","pc-inference-note");
u.body.append(tr);const Gt=Q("input");Gt.type="file",Gt.setAttribute("aria-label","Pin a file locally"),u.body.append(mn(
"Pin a file locally",Gt));const Dr=rt("Unload all local models");u.body.append(Dr);const Cr=rt("Clear conversation");u.body.
append(Cr),u.body.append(Q("p","Clear chat history to start a new conversation while keeping the loaded model and stored\
 files.","pc-inference-note")),y.append(Q("p","Select models, then Load selected or Delete selected. Loading uses compat\
ible saved packages. Deleting also unloads selected models; files needed by other packages are kept. Unload keeps saved \
files.","pc-inference-note"));const _=Q("ul",void 0,"pc-stored-models");_.setAttribute("aria-label","Stored model packag\
es");const B=rt("Refresh"),T=rt("Stop loading");T.hidden=!0;const H=rt("Load selected");H.disabled=!0;const O=rt("Delete\
 selected");O.disabled=!0,O.className="pc-delete-model";const G=Q("p","0 models selected.","pc-inference-note");G.setAttribute(
"aria-live","polite");const ie=Q("div",void 0,"pc-stored-footer"),ke=Q("div",void 0,"pc-stored-footer-actions");ke.append(
H,O,B,T),ie.append(G,ke),y.append(_),f.append(ie,E);const se=Q("div",void 0,"pc-inference-transcript");se.setAttribute("\
role","log"),se.setAttribute("aria-label","Conversation"),se.setAttribute("aria-live","polite");const Et=Q("p","Open Mod\
els to load one, or use ⚙ to choose a peer model.","pc-chat-empty");se.append(Et),e.append(se);const dt=Q("div",void 0,
"pc-inference-actions");e.append(dt);const ut=Q("div",void 0,"pc-chat-attachment");ut.hidden=!0;const st=Q("img");st.alt=
"Selected image";const St=Q("span"),ee=rt("×","Remove attached image");ut.append(st,St,ee),e.append(ut);const Ue=Q("tex\
tarea");Ue.rows=2,Ue.maxLength=16e3,Ue.placeholder="Message…",Ue.setAttribute("aria-label","Message"),e.append(Ue);const an=Q(
"input"),Rr=Q("input");an.type=Rr.type="checkbox";const br=Q("div",void 0,"pc-model-preferences pc-conversation-options");
br.append(mn("Generate image",an),mn("Speak replies",Rr));const Qr=Q("p","","pc-inference-note pc-route-policy");Qr.setAttribute(
"aria-live","polite");const Wt=Q("select");Wt.setAttribute("aria-label","Chat target"),m.body.append(mn("Chat target",Wt),
br,Qr);const yr=rt("+","Attach image");yr.title="Attach an image",yr.className="pc-chat-icon";const $r=Q("input");$r.type=
"file",$r.accept="image/png,image/jpeg,image/webp,image/gif",$r.hidden=!0,$r.setAttribute("aria-label","Choose image att\
achment");const Ht=rt("Resume agent");Ht.hidden=!0,e.append(Ht);const $e=rt("Send"),it=rt("Talk"),wr=rt("Stop");wr.hidden=
!0,it.title="Record a voice message, then press Stop recording to send. Load a speech-recognition model or use a compati\
ble peer.";const Ne=Q("div",void 0,"pc-chat-controls");Ne.append(g,yr,$r,it,$e,wr),e.append(Ne),e.append(q,ue,Z,D,b,w,k.
element);const cn=sP({container:e});return o.prepend(cn.trigger),t.append(e),{panel:e,browse:a,agents:c,networkInfo:cn,discoveryStatus:cn.
status,modelsMenu:l,configure:d,chatConfigure:g,chatOptions:b,chatOptionsStatus:m.status,sharing:me,hosting:ye,status:pt,
configuration:q,configurationStatus:u.status,storedContent:f,storedList:_,storedRefresh:B,storedCancel:T,storedLoadSelected:H,
storedDeleteSelected:O,storedSelection:G,storedStatus:E,gpuLayers:Ae,leaveConfirmation:k.element,leaveStatus:k.status,stay:x,
leave:S,back:n,menu:s,menuWindow:D,menuStatus:N.status,about:Z,aboutButton:P,install:j,loading:w,loadingModel:C,loadingStatus:v.
status,loadingCancel:R,compatibility:ue,helpModel:he,helpReason:ze,helpBrowser:be,helpOs:Ie,helpDetails:Y,helpCommandGroup:ae,
helpCommand:W,helpCopy:pe,helpConfig:ve,helpStatus:h.status,cpuBudget:wt,gpuBudget:gr,memoryNote:Ct,memoryPressure:Rt,relay:vt,
connect:_r,networkStatus:tr,file:Gt,unload:Dr,clearChat:Cr,transcript:se,empty:Et,proposed:dt,attachment:ut,attachmentImage:st,
attachmentName:St,removeAttachment:ee,prompt:Ue,target:Wt,attach:yr,imageFile:$r,send:$e,cancel:wr,talk:it,generateImage:an,
speakReplies:Rr,modeStatus:Qr,resumeAgent:Ht}}function aP(t,e){t.helpModel.textContent=e.name,t.helpReason.textContent=e.
reason,t.helpDetails.replaceChildren();for(const r of e.paragraphs)t.helpDetails.append(Q("p",r,"pc-inference-note"));if(e.
steps.length){const r=Q("ol");for(const n of e.steps)r.append(Q("li",n));t.helpDetails.append(r)}for(const r of e.links){
const n=Q("a",r.label);n.href=r.url,n.target="_blank",n.rel="noopener noreferrer";const s=Q("p",void 0,"pc-inference-not\
e");s.append(n),t.helpDetails.append(s)}t.helpCommand.value=e.command??"",t.helpCommandGroup.hidden=!e.command,t.helpConfig.
hidden=!e.openConfig,t.helpStatus.textContent=""}function oa(t){return!!t.manifestCid}function Vy(t){return oa(t)&&!t.loaded&&
!t.cleanupPending&&!t.needsVerification&&!["checking","unavailable"].includes(t.localAvailability?.status)}function cP(t,e,{
selected:r=new Set,onSelect:n,onRecover:s,onUnload:i}={}){t.storedList.replaceChildren(),e.length||t.storedList.append(Q(
"li","No models stored on this device.","pc-stored-empty"));for(const o of iP(e)){const a=Q("li",void 0,"pc-stored-model");
if(a.dataset.modelCid=o.manifestCid,n){const u=Q("input");u.type="checkbox",u.setAttribute("aria-label",`Select ${o.name}`),
u.dataset.inactive=String(!oa(o)),u.disabled=u.dataset.inactive==="true",u.checked=!u.disabled&&r.has(o.manifestCid),u.onchange=
()=>n(o,u.checked),a.append(u)}const c=Q("div");c.append(Q("strong",o.name));const l=[xs(o.totalBytes),...o.loaded?["Loa\
ded"]:[],...o.shared?["Shared"]:[],...o.cleanupPending?["Cleanup pending"]:[],...o.needsVerification?["Needs local verif\
ication"]:[]];c.append(Q("p",l.join(" · "),"pc-inference-note")),o.shareError&&c.append(Q("p",`Sharing unavailable: ${String(
o.shareError).slice(0,256)}`,"pc-inference-note"));const d=["checking","unavailable"].includes(o.localAvailability?.status);
if(o.task==="automatic-speech-recognition"&&c.append(Q("p","Speech recognition · used by Talk.","pc-inference-note")),o.
task==="text-to-speech"&&c.append(Q("p","Speech synthesis · used by Speak replies.","pc-inference-note")),d&&c.append(Q(
"p",String(o.localAvailability.reason||"This model is unavailable on this device.").slice(0,512),"pc-inference-note")),a.
append(c),o.cleanupPending&&c.append(Q("p","Select this model and Delete selected to retry cleanup.","pc-inference-note")),
o.needsVerification||o.loaded){const u=o.needsVerification?"Verify locally":"Unload",h=rt(u,`${u} ${o.name}`);h.dataset.
inactive=String(!!(o.cleanupPending||(o.needsVerification?!s:!i))),h.disabled=h.dataset.inactive==="true",h.onclick=()=>{
o.needsVerification?s?.(o):i?.(o)};const p=Q("div",void 0,"pc-stored-actions");p.append(h),a.append(p)}t.storedList.append(
a)}}function ff(t,e,r,{image:n,targetName:s}={}){t.empty.remove();const i=Q("article",void 0,`pc-chat-message pc-chat-me\
ssage-${e}`);if(i.append(Q("span",e==="user"?"YOU":s||"MODEL","pc-chat-speaker")),n){const a=Q("img");a.src=n,a.alt="Att\
ached image",a.className="pc-chat-image",i.append(a)}const o=Q("p",r);return i.append(o),t.transcript.append(i),o}const Ky=Object.
freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"Microsoft Edge",brave:"Brave",firefox:"Firefox",safari:"Safari",
other:"Other browser"}),Qy=Object.freeze({linux:"Linux",windows:"Windows",macos:"macOS",android:"Android",ios:"iOS / iPa\
dOS",other:"Other operating system"}),Jy=Object.freeze({chrome:"google-chrome --enable-dawn-features=vulkan_enable_f16_o\
n_nvidia",chromium:"chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia",edge:"microsoft-edge --enable-dawn-feat\
ures=vulkan_enable_f16_on_nvidia",brave:"brave-browser --enable-dawn-features=vulkan_enable_f16_on_nvidia"}),lP="https:/\
/www.chromium.org/developers/how-tos/run-chromium-with-flags/",dP="https://github.com/google/dawn/commit/8f96ae09bbaac54\
d52ca6f8aff8606ffdbe9de3f";function Js(t,e,r=""){return typeof t!="string"?r:t.slice(0,e).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,
" ").trim()||r}function Xy(t,e){return typeof t=="string"&&Object.hasOwn(e,t)?t:"other"}function LE(t=globalThis.navigator){
const e=t??{},r=Js(e.userAgent,4096),n=Js(e.userAgentData?.platform,80)||Js(e.platform,80),s=Array.isArray(e.userAgentData?.
brands)?e.userAgentData.brands.slice(0,16).map(a=>Js(a?.brand,80)).join(" "):"";let i="other";/iPhone|iPad|iPod|\biOS\b/i.
test(`${n} ${r}`)||/Mac/i.test(`${n} ${r}`)&&e.maxTouchPoints>1?i="ios":/Android/i.test(`${n} ${r}`)?i="android":/Windows|Win32|Win64/i.
test(n)?i="windows":/macOS|Mac/i.test(n)?i="macos":/Linux/i.test(n)?i="linux":/Windows/i.test(r)?i="windows":/Macintosh|Mac OS X/i.
test(r)?i="macos":/Linux|X11/i.test(r)&&(i="linux");let o="other";return/Brave/i.test(s)||/Brave\//i.test(r)||typeof e.brave?.
isBrave=="function"?o="brave":/Microsoft Edge/i.test(s)||/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(r)?o="edge":/Firefox/i.test(
s)||/(?:Firefox|FxiOS)\//i.test(r)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.test(r)?o="other":/Google Chrome/i.
test(s)||/CriOS\//i.test(r)?o="chrome":/Chromium\//i.test(r)?o="chromium":/Chrome\//i.test(r)?o="chrome":/Chromium/i.test(
s)?o="chromium":/Safari\//i.test(r)&&/Version\//i.test(r)&&(o="safari"),{browser:o,os:i}}function uP(t,{environment:e=LE()}={}){
const r=t?.localAvailability??{},n=Js(r.code,100),s=Xy(e?.browser,Ky),i=Xy(e?.os,Qy),o={name:Js(t?.name,180,"Selected mo\
del"),reason:Js(r.reason,500,"Compatibility has not been fully verified."),environmentLabel:`${Ky[s]} on ${Qy[i]}`,paragraphs:[],
steps:[],command:null,commandLabel:"",links:[],openConfig:!1};return r.status==="checking"||n==="device_checking"?(o.paragraphs.
push("The browser capability check is still running. This does not mean the model is unsupported."),o.steps.push("Wait f\
or the check to finish. If it remains pending, reload the page and check again.")):n==="cpu_budget_exceeded"||n==="gpu_b\
udget_exceeded"?(o.openConfig=!0,o.paragraphs.push("The model reservation exceeds a configured memory budget. This budge\
t is an admission limit, not a measurement of free RAM or GPU memory."),o.steps.push("Open Config and review the RAM and\
 GPU memory budgets. Raise or clear an optional limit only when appropriate for your device.","A shared compute pool may\
 impose its own limit. Choose a smaller model or a peer-hosted model if that limit still applies.")):n==="gpu_feature_un\
available"&&/\bshader-f16\b/i.test(o.reason)?(o.paragraphs.push("This browser does not expose the shader-f16 feature req\
uired by this model runtime. GPU memory capacity alone does not establish FP16 support."),i==="linux"&&Object.hasOwn(Jy,
s)?(o.command=Jy[s],o.commandLabel="Optional Linux NVIDIA / Vulkan launch command",o.paragraphs.push("If this Linux mach\
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
nstructions",url:lP},{label:"Dawn NVIDIA FP16 driver restriction",url:dP})):n==="gpu_feature_unavailable"?(o.paragraphs.
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
model or a peer-hosted model if local loading fails.")),o}const fP=new Set(["image/png","image/jpeg","image/webp","image\
/gif"]);async function hP(t,{signal:e}={}){if(!t||!fP.has(t.type))throw new Error("Choose a PNG, JPEG, WebP or GIF image");
if(t.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");e?.throwIfAborted();const r=await createImageBitmap(
t);try{if(e?.throwIfAborted(),!r.width||!r.height||r.width*r.height>32*1024**2)throw new Error("Choose an image smaller \
than 32 megapixels");const n=Math.min(1,512/Math.max(r.width,r.height)),s=document.createElement("canvas");s.width=Math.
max(1,Math.round(r.width*n)),s.height=Math.max(1,Math.round(r.height*n));const i=s.getContext("2d",{willReadFrequently:!0});
if(!i)throw new Error("Image decoding is unavailable");i.drawImage(r,0,0,s.width,s.height);const o=i.getImageData(0,0,s.
width,s.height),a=document.createElement("canvas"),c=Math.min(1,96/Math.max(s.width,s.height));return a.width=Math.max(1,
Math.round(s.width*c)),a.height=Math.max(1,Math.round(s.height*c)),a.getContext("2d").drawImage(s,0,0,a.width,a.height),
{name:t.name.slice(0,160),preview:a.toDataURL("image/webp",.8),image:{data:new Uint8Array(o.data),width:s.width,height:s.
height,channels:4}}}finally{r.close()}}const Ph=new Map([["image/png","png"],["image/jpeg","jpg"],["image/webp","webp"],
["image/gif","gif"]]),Oh=8*1024**2,hf=64*1024,Uh=t=>t.reason??new DOMException("Image selection cancelled","AbortError");
function Fh(t,e){return e.aborted?(Promise.resolve(t).catch(()=>{}),Promise.reject(Uh(e))):new Promise((r,n)=>{const s=()=>n(
Uh(e));e.addEventListener("abort",s,{once:!0}),Promise.resolve(t).then(r,n).finally(()=>e.removeEventListener("abort",s))})}
function pP(t,e){if(!t)return null;let r=[...t.items??[]].filter(o=>o.kind==="file").map(o=>o.getAsFile()).filter(Boolean);
if(r.length||(r=[...t.files??[]]),r.length)return r.length===1?{file:r[0]}:{error:"Attach one image at a time."};const n=t.
getData("text/html");if(n&&/<img\b|blob:/i.test(n)){if(n.length>hf)return{error:"Image clipboard information is too larg\
e. Save the image and attach the file."};const o=e.createElement("template");o.innerHTML=n;const a=[...o.content.querySelectorAll(
"img")];if(a.length>1)return{error:"Attach one image at a time."};if(a.length)return{url:a[0].getAttribute("src")??""};const c=[
...o.content.querySelectorAll("a[href]")].map(l=>l.getAttribute("href")).filter(l=>/^blob:/i.test(l));if(c.length>1)return{
error:"Attach one image at a time."};if(c.length)return{url:c[0]}}const s=t.getData("text/uri-list");if(s&&/(?:^|\n)blob:/i.
test(s)){if(s.length>hf)return{error:"Image clipboard information is too large. Attach the image file instead."};const o=s.
split(/\r?\n/).map(a=>a.trim()).filter(a=>a&&!a.startsWith("#"));return o.length===1?{url:o[0]}:{error:"Attach one image\
 at a time."}}const i=t.getData("text/plain").trim();return/^blob:/i.test(i)?i.length<=hf?{url:i}:{error:"Image link is \
too long. Attach the image file instead."}:null}function DE(t){if(!Ph.has(t.type))throw new Error("Choose a PNG, JPEG, W\
ebP or GIF image.");if(!Number.isSafeInteger(t.size)||t.size<=0)throw new Error("This image is empty or unreadable. Atta\
ch the image file again.");if(t.size>Oh)throw new Error("Choose an image smaller than 8 MiB.");return t}async function mP(t,{
document:e,fetchImpl:r,source:n,signal:s}){let i;try{i=new URL(t)}catch{throw new Error("This image link is invalid. Sav\
e the image and attach the file.")}if(i.protocol!=="blob:")throw new Error("Drag or paste the image file itself; remote \
image links are not downloaded.");if(i.origin==="null"||i.origin!==e.location.origin)throw new Error("This image belongs\
 to another website or browser tab. Save the image, then attach the file.");let o;try{o=await Fh(r(i.href,{signal:s,credentials:"\
omit",redirect:"error"}),s)}catch(p){throw s.throwIfAborted(),new Error("This image link expired or is unavailable. Copy\
 the image again, or save and attach its file.",{cause:p})}if(!o.ok)throw o.body?.cancel().catch(()=>{}),new Error("This\
 image link is unavailable. Copy the image again or attach its file.");const a=o.headers.get("content-type")?.split(";")[0].
trim().toLowerCase();if(!Ph.has(a))throw o.body?.cancel().catch(()=>{}),new Error("The image link must contain a PNG, JP\
EG, WebP or GIF image.");const c=o.headers.get("content-length");if(c!==null&&(!/^\d+$/.test(c)||Number(c)>Oh))throw o.body?.
cancel().catch(()=>{}),new Error("Choose an image smaller than 8 MiB.");if(!o.body)throw new Error("This image has no re\
adable data. Attach the image file instead.");const l=o.body.getReader(),d=[];let u=0,h=!1;try{for(;;){const{done:p,value:m}=await Fh(
l.read(),s);if(s.throwIfAborted(),p){h=!0;break}if(u+=m.byteLength,u>Oh)throw new Error("Choose an image smaller than 8 \
MiB.");d.push(m)}if(c!==null&&u!==Number(c))throw new Error("The image was interrupted. Copy it again or attach the file\
.");return DE(new File(d,`${n==="paste"?"pasted":"dropped"}-image.${Ph.get(a)}`,{type:a}))}finally{h||l.cancel(Uh(s)).catch(
()=>{});try{l.releaseLock()}catch{}}}function gP({textarea:t,onFile:e,onError:r=()=>{},canAccept:n=()=>!0,onPendingChange:s=()=>{},
fetchImpl:i=globalThis.fetch,timeoutMs:o=1e4}={}){if(!t?.addEventListener||typeof e!="function"||typeof i!="function")throw new TypeError(
"Chat image input requires a textarea, onFile and fetch");if(!Number.isSafeInteger(o)||o<10||o>3e4)throw new RangeError(
"Invalid image input timeout");let a=null,c=!1,l=Promise.resolve();const d=f=>{try{Promise.resolve(r(f)).catch(()=>{})}catch{}},
u=()=>{const f=n();if(f!==!0)throw new Error(typeof f=="string"&&f?f:"Images are unavailable for this chat target right \
now.")},h=(f=new DOMException("Image selection cancelled","AbortError"))=>a?.controller.abort(f);function p(f,y){if(c)return;
let E;try{E=pP(y==="paste"?f.clipboardData:f.dataTransfer,t.ownerDocument)}catch(S){f.preventDefault(),d(S);return}if(!E)
return;f.preventDefault(),h();const k={controller:new AbortController};a=k,s(!0);const x=setTimeout(()=>k.controller.abort(
Object.assign(new Error("Reading the image timed out. Attach the file again."),{code:"ERR_CHAT_IMAGE_TIMEOUT"})),o);l=(async()=>{
try{if(u(),E.error)throw new Error(E.error);const S=E.file?DE(E.file):await mP(E.url,{document:t.ownerDocument,fetchImpl:i,
source:y,signal:k.controller.signal});k.controller.signal.throwIfAborted(),u(),await Fh(e(S,{signal:k.controller.signal,
source:y}),k.controller.signal)}catch(S){!c&&a===k&&!(k.controller.signal.aborted&&k.controller.signal.reason?.name==="A\
bortError")&&d(S)}finally{clearTimeout(x),a===k&&(a=null,c||s(!1))}})()}const m=f=>p(f,"paste"),b=f=>p(f,"drop"),g=f=>{if(c)
return;const y=f.dataTransfer;!y||![...y.types].some(k=>["Files","text/html","text/uri-list"].includes(k))||(f.preventDefault(),
y.dropEffect=n()===!0?"copy":"none")};return t.addEventListener("paste",m),t.addEventListener("dragover",g),t.addEventListener(
"drop",b),{cancel:h,whenIdle:()=>l,dispose(){return c||(c=!0,h(),t.removeEventListener("paste",m),t.removeEventListener(
"dragover",g),t.removeEventListener("drop",b),a&&s(!1)),l}}}const Yy=1024*1024,bP=6,yP=24*1024*1024,Zy=t=>{if(t?.aborted)
throw new DOMException("Image generation cancelled","AbortError")};function wP(t){const e=new Map;let r=0,n=!1;function s(o,{
expired:a=!1}={}){const c=e.get(o);if(c)if(URL.revokeObjectURL(c.url),r-=c.bytes,e.delete(o),a&&t.contains(o)){const l=document.
createElement("p");l.className="pc-inference-note",l.textContent="Earlier image preview released.",o.replaceWith(l)}else
o.removeAttribute("src")}function i(){for(const o of e.keys())t.contains(o)||s(o);for(;e.size>bP||r>yP;)s(e.keys().next().
value,{expired:!0})}return{async append(o,a,{signal:c,prompt:l=""}={}){if(Zy(c),n)throw new Error("Conversation image re\
nderer is closed");const{width:d,height:u,channels:h,data:p}=a??{};if(!Number.isSafeInteger(d)||!Number.isSafeInteger(u)||
d<1||u<1||d*u>Yy||h!==4||!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||p.byteLength!==d*u*4)throw new Error(
"Generated image must contain bounded RGBA pixels");const m=new OffscreenCanvas(d,u),b=m.getContext("2d");if(!b)throw new Error(
"Image preview encoding is unavailable");b.putImageData(new ImageData(new Uint8ClampedArray(p),d,u),0,0);const g=await m.
convertToBlob({type:"image/png"});if(Zy(c),n||!t.contains(o))throw new DOMException("Conversation closed","AbortError");
if(g.type!=="image/png"||g.size>Yy*4+65536)throw new Error("Generated image preview exceeds its byte budget");const f=document.
createElement("img");f.className="pc-generated-image",f.width=d,f.height=u,f.alt=l?`Generated image: ${l.slice(0,160)}`:
"Generated image";const y=URL.createObjectURL(g);return f.src=y,e.set(f,{url:y,bytes:g.size}),r+=g.size,o.after(f),i(),f},
prune:i,dispose(){n=!0;for(const o of e.keys())s(o)}}}const ri=t=>Number.isSafeInteger(t)&&t>=0;function Po(t){return ri(
t)?t>=1024**3?`${(t/1024**3).toFixed(2)} GiB`:t>=1024**2?`${(t/1024**2).toFixed(1)} MiB`:`${Math.ceil(t/1024)} KiB`:"Unk\
nown size"}function zh(t){return t.task??t.model?.task??(t.browserSummary?"unknown":t.modalities?.includes("image")?"ima\
ge-text-to-text":"text-generation")}function Jc(t){const e=t.dtype??t.model?.dtype;if(typeof e=="string")return e.toLowerCase();
if(e&&typeof e=="object"&&!Array.isArray(e)){const r=[...new Set(Object.values(e).filter(n=>typeof n=="string").map(n=>n.
toLowerCase()))];if(r.length===1)return r[0];if(r.length)return`mixed (${r.sort().join(", ")})`}return""}function ed(t){
const e=t.trim();if(!/^https?:\/\//i.test(e))return{query:e,repository:null};try{const r=Jn(e);return{query:r.repository,
...r,reference:e}}catch{return{query:"",repository:null,error:"Enter a Hugging Face model URL or search by name and desc\
ription."}}}function $E(t,e){try{const r=e?.(t)??t.localAvailability;if(r&&typeof r.then!="function")return r;r?.catch?.(
()=>{})}catch{return{status:"unknown",reason:"Device compatibility could not be checked."}}return{status:"unknown",reason:"\
Memory fit has not been verified on this device."}}const aa=t=>["checking","unavailable"].includes(t?.status),Ci=t=>!!(t.
browserSummary||t.requiresInspection);function ew(t,e,r,{includeUninspected:n=!1}={}){const s=ed(e.query).query.toLowerCase().
split(/\s+/).filter(Boolean);function i(c){const l=n&&Ci(c),d=c.browserOrigin??(c.source==="stored"?"stored":c.source===
"peers"?"peers":"catalog");if(e.source!=="all"&&d!==e.source&&!(e.source==="stored"&&c.stored===!0))return!1;const u=zh(
c),h=Jc(c);if(e.task!=="all"&&u!==e.task&&!(l&&u==="unknown")||e.precision!=="all"&&h!==e.precision&&!(l&&(!h||h==="unkn\
own")))return!1;if(d!=="hub"){const b=[c.name,c.modelId,c.id,c.description,c.repository,c.model?.repository,u,c.runtime,
c.model?.runtime,h,c.source,d,d==="stored"?"local stored on this device":"",...c.tags??[]].join(" ").toLowerCase();if(!s.
every(g=>b.includes(g)))return!1}const p=c.totalBytes;if(e.size==="unknown"&&ri(p))return!1;if(e.size!=="all"&&e.size!==
"unknown"){if(ri(p)){if(e.size==="large"?p<8*1024**3:p>Number(e.size))return!1}else if(!l)return!1}const m=$E(c,r);return!(!l&&
(e.compatibility==="eligible"&&!c.browserPeerAvailable&&(aa(m)||c.loadable===!1||Ci(c))||e.compatibility==="setup"&&(Ci(
c)||!aa(m)&&c.loadable!==!1)))}const o=t.flatMap(c=>{const l=[c,...c.browserVariants??[]].filter(i),d=l.find(u=>!Ci(u))??
l[0];return d?[{...c,browserFilterPending:Ci(d),browserMatchingVariant:d===c?null:d.name??d.id}]:[]}),a=c=>ri(c.totalBytes)?
c.totalBytes:1/0;return o.sort((c,l)=>{if(e.sort!=="name"){if(a(c)===1/0&&a(l)!==1/0)return 1;if(a(l)===1/0&&a(c)!==1/0)
return-1;const d=(a(c)-a(l))*(e.sort==="largest"?-1:1);if(d)return d}return String(c.name??c.repository).localeCompare(String(
l.name??l.repository))||String(c.key).localeCompare(String(l.key))})}function Oo(t,e){const r=t.manifestCid??t.package?.
manifestCid;return e.filter(n=>!n.local&&n.available===!0&&(n.key===t.key||r&&n.key===`peer:${r}`))}function _n(t){return typeof t==
"string"&&/^[\w.-]+\/[\w.-]+$/.test(t)?`https://huggingface.co/${t}`:null}const vP=new Set(["quantized","converted","der\
ived","finetune","merge","adapter"]),ca=(t,e)=>typeof t=="string"?t.slice(0,e):"";function tw(t){if(typeof t!="string")return null;
const e=ed(t),r=e.repository??t;return e.error||!_n(r)?null:{repository:r,key:`${r.toLowerCase()}@${e.revision??"main"}`,
reference:e.revision?`${_n(r)}/tree/${e.revision}`:r}}function EP(t,e){if(!t||!_n(t.repository)||t.repository.length>160||
typeof t.sourceRepository!="string"||t.sourceRepository.toLowerCase()!==e.toLowerCase()||t.repository.toLowerCase()===e.
toLowerCase()||!vP.has(t.relationship)||t.evidence?.kind!=="publisher-base-model"||!/^[a-f0-9]{40}$/i.test(t.evidence.revision??
"")||t.revision&&t.revision!==t.evidence.revision)return null;const r=[...new Set((Array.isArray(t.formats)?t.formats:[]).
filter(s=>["ONNX","GGUF"].includes(s)))];if(!r.length)return null;const n=t.evidence.revision.toLowerCase();return{repository:t.
repository,name:ca(t.name,256)||t.repository,description:ca(t.description,4e3),task:ca(t.task,64)||void 0,formats:r,revision:n,
sourceRepository:e,relationship:t.relationship,reference:`${_n(t.repository)}/tree/${n}`,status:"candidate",requiresInspection:!0}}
function kP({findConversions:t,onChange:e=()=>{}}={}){const r=new Map;let n=null,s=!1;function i(a,c){for(r.delete(a),r.
set(a,c);r.size>32;)r.delete(r.keys().next().value)}function o(){if(!n)return;const a=n;n=null,a.controller.abort(),i(a.
key,{status:"cancelled",items:[]}),e()}return{get:a=>r.get(tw(a)?.key),cancel:o,async find(a){const c=tw(a);if(s||!t||!c)
return;const l=r.get(c.key);if(l?.status==="complete"||l?.status==="pending"&&n?.key===c.key)return;o();const d={...c,controller:new AbortController};
n=d,i(d.key,{status:"pending",items:[]}),e();try{const u=await t(d.reference,{signal:d.controller.signal});if(s||n!==d||
d.controller.signal.aborted)return;if(!u||!Array.isArray(u.items))throw new Error("Invalid related-model response");const h=[
...new Map(u.items.slice(0,100).map(p=>EP(p,d.repository)).filter(Boolean).map(p=>[`${p.repository}@${p.revision}`,p])).
values()].slice(0,24);i(d.key,{status:"complete",items:h,warning:ca(u.warning,1e3),cached:u.cached===!0})}catch(u){!s&&n===
d&&!d.controller.signal.aborted&&i(d.key,{status:"error",items:[],error:ca(u?.message??String(u),1e3)})}finally{n===d&&(n=
null,e())}},dispose(){s=!0,o(),r.clear()}}}const de=(t,e,r)=>{const n=document.createElement(t);return e!==void 0&&(n.textContent=
String(e)),r&&(n.className=r),n},Ur=t=>{const e=de("button",t);return e.type="button",e},xP=t=>({stored:"Stored on this \
device",peers:"Peer files",hub:"Hugging Face search",catalog:"Catalog"})[t.browserOrigin]??(t.source==="stored"?"Stored \
on this device":t.source==="peers"?"Peer files":"Catalog"),pf=t=>Ci(t)?"Needs inspection":t.loadable===!1&&!t.inferenceOnly?
"Unsupported":t.browserOrigin==="hub"||t.inferenceOnly||["stored","peers"].includes(t.source)?"Candidate":"Catalog",Uo=t=>String(
t?.message??t??"Request failed").slice(0,1e3);function SP({container:t,getSources:e=()=>[],getTargets:r=()=>[],searchModels:n,
inspectModel:s,findConversions:i,getCompatibility:o,onLoad:a,onUsePeer:c,onSetup:l,storedContent:d,hasStoredModels:u=()=>!1,
onStoredOpen:h,onConfigure:p,onDismiss:m,keepOpenOnAction:b=!1}={}){if(!t?.append)throw new TypeError("A model browser c\
ontainer is required");const g=de("dialog",void 0,"pc-model-browser");g.id=`model-browser-dialog-${crypto.randomUUID()}`;
const f=de("h2","Models");f.id=`model-browser-${crypto.randomUUID()}`,g.setAttribute("aria-labelledby",f.id);const y=de(
"div",void 0,"pc-browser-header"),E=Ur("Done"),k=de("div",void 0,"pc-browser-header-actions"),x=Ur("Config");x.hidden=!p,
x.onclick=()=>p?.(),k.append(x,E),y.append(f,k);const S=de("p","","pc-browser-status");S.setAttribute("role","status"),S.
hidden=!0;const v=de("section",void 0,"pc-browser-page");v.hidden=!0,v.tabIndex=-1;const w=de("div",void 0,"pc-browser-t\
abs");w.setAttribute("role","tablist"),w.setAttribute("aria-label","Model library");const I={},C={};for(const[L,V]of[["s\
tored","Stored models"],["browse","Browse models"]]){if(L==="stored"&&!d)continue;const te=Ur(V),J=de("section",void 0,`\
pc-browser-tab-panel pc-browser-${L}-panel`);te.id=`${g.id}-${L}-tab`,J.id=`${g.id}-${L}-panel`,te.setAttribute("role","\
tab"),te.setAttribute("aria-controls",J.id),J.setAttribute("role","tabpanel"),J.setAttribute("aria-labelledby",te.id),I[L]=
te,C[L]=J,w.append(te)}const R=de("p","","pc-browser-status");R.setAttribute("role","status"),d&&(d.classList.add("pc-br\
owser-stored-content"),C.stored.append(R,d)),w.hidden=!d;const N=de("div",void 0,"pc-browser-controls"),D=de("div",void 0,
"pc-browser-search"),P=de("input");P.type="search",P.maxLength=256,P.autofocus=!0,P.placeholder="Name, description or hu\
ggingface.co/owner/model",P.setAttribute("aria-label","Search models"),D.append(P),N.append(D);const j=de("details",void 0,
"pc-browser-filters"),Z=de("summary"),X=de("span","Filters and sorting"),q=de("span","","pc-browser-summary");Z.append(X,
q);const ue=de("div",void 0,"pc-browser-filter-fields");j.append(Z,ue),N.append(j);const he=matchMedia("(max-width:650px\
)"),ze=()=>{j.open=!he.matches,he.matches||(T=!1),st()};j.open=!he.matches,he.addEventListener("change",ze);const be={};
function Ie(L,V,te){const J=de("select");J.setAttribute("aria-label",V);const re=de("label",V);for(const[_e,Te]of te){const Ee=de(
"option",Te);Ee.value=_e,J.append(Ee)}return re.append(J),ue.append(re),be[L]=J,J}Ie("source","Source",[["all","All sour\
ces"],["catalog","Catalog"],["stored","Stored on this device"],["peers","Peer files"],["hub","Hugging Face search"]]),Ie(
"task","Task",[["all","All tasks"],["text-generation","Text and code"],["image-text-to-text","Image understanding"],["te\
xt-to-image","Image generation"],["automatic-speech-recognition","Speech recognition"],["text-to-speech","Speech synthes\
is"]]),Ie("size","Package size",[["all","Any size"],[String(500*1024**2),"Up to 500 MiB"],[String(1024**3),"Up to 1 GiB"],
[String(4*1024**3),"Up to 4 GiB"],[String(8*1024**3),"Up to 8 GiB"],["large","8 GiB and larger"],["unknown","Unknown siz\
e"]]),Ie("precision","Precision",[["all","All precisions"]]),Ie("compatibility","Compatibility",[["all","All models"],["\
eligible","Usable locally or via peers"],["setup","Needs local setup / unsupported"]]),Ie("sort","Sort models",[["smalle\
st","Package size: smallest first"],["largest","Package size: largest first"],["name","Name"]]);const U=de("p","","pc-br\
owser-status");U.setAttribute("role","status"),U.setAttribute("aria-live","polite");const Y=de("div",void 0,"pc-browser-\
content"),W=de("ul",void 0,"pc-browser-results");W.setAttribute("aria-label","Model results");const pe=de("section",void 0,
"pc-browser-details");pe.setAttribute("aria-label","Model details"),Y.append(W,pe);const ve=Ur("More Hugging Face result\
s");ve.className="pc-browser-more",ve.hidden=!0,C.browse.append(N,U,Y,ve),g.append(y,S,w,...Object.values(C),v),t.append(
g);let ae=!1,le=!1,me=!1,ye=null,Ir=null,Ve,nt,pt,Ae=0,qe=0,wt=[],gr=null,Ct="",Rt=!1,mt=null,vt=!1,_r=!1,je="",tr="",Gt,
Dr,Cr,_=null,B="browse",T=!1,H=0,O,G=0,ie,ke,se=!1;const Et=new Map,dt=new Map,ut=kP({findConversions:i,onChange:()=>Be()});
function st(){g.classList.toggle("pc-browser-show-details",!ie&&he.matches&&B==="browse"&&T),f.textContent=ie?.title??"M\
odels",w.hidden=!!ie||!d,v.hidden=!ie,x.hidden=!p||!!ie,x.disabled=le||me||se,E.disabled=se,E.textContent=ie?.buttonLabel??
"Done";for(const[L,V]of Object.entries(C)){const te=L===B;V.hidden=!!ie||!te,I[L].setAttribute("aria-selected",String(te)),
I[L].tabIndex=te?0:-1,I[L].disabled=le||me}E.title=ie?"Return to Models":he.matches&&T?"Return to model results":"Close \
Models"}function St({focus:L=!0}={}){T=!1,st(),W.scrollTop=H,L&&g.open&&(W.querySelector('[aria-pressed="true"]')??P).focus(
{preventScroll:!0})}function ee(){!he.matches||B!=="browse"||(H=W.scrollTop,T=!0,st(),E.focus({preventScroll:!0}))}function Ue(){
O?.abort(),O=null,G++}function an(){if(Ue(),!h)return;const L=new AbortController,V=G;O=L,R.textContent="",Promise.resolve().
then(()=>{if(!L.signal.aborted)return h({signal:L.signal})}).catch(te=>{!ae&&!L.signal.aborted&&V===G&&(R.textContent=`S\
tored models unavailable: ${Uo(te)}`)}).finally(()=>{O===L&&(O=null)})}function Rr(L,{focus:V=!1,refreshStored:te=!0}={}){
C[L]||(L="browse"),B==="browse"&&!T&&(H=W.scrollTop),B!==L&&(Ue(),L==="stored"&&dn()),B=L,T=!1,st(),L==="browse"?(Be(),W.
scrollTop=H,g.open&&vt&&!nt&&!le&&wn(_r)):te&&g.open&&an(),V&&I[L].focus({preventScroll:!0})}W.addEventListener("scroll",
()=>{B==="browse"&&!T&&(H=W.scrollTop)});for(const[L,V]of Object.entries(I))V.onclick=()=>{!le&&!me&&B!==L&&Rr(L,{focus:!0})},
V.addEventListener("keydown",te=>{const J=Object.keys(I),re=J.indexOf(L),_e=te.key==="Home"?J[0]:te.key==="End"?J.at(-1):
te.key==="ArrowRight"?J[(re+1)%J.length]:te.key==="ArrowLeft"?J[(re+J.length-1)%J.length]:null;_e&&!le&&!me&&(te.preventDefault(),
Rr(_e,{focus:!0,refreshStored:_e!==B}))});function br(){return(e()??[]).filter(L=>L&&typeof L.key=="string")}function Qr(){
return(r()??[]).filter(Boolean)}function Wt(){const L=br(),V=Qr();for(const J of V)J.local||J.available!==!0||L.some(re=>Oo(
re,[J]).length)||L.push({...J,source:"peers",inferenceOnly:!0,loadable:!1,manifestCid:J.manifestCid??J.key?.replace(/^peer:/,
""),reason:"Files not advertised; use peer inference."});const te=wt.map(J=>({...J,key:J.browserKey??`hub:${J.repository}`,
browserOrigin:"hub",browserSummary:!0}));for(const J of te){const re=Et.get(J.inspectReference??J.repository),_e=yr(re);
if(_e){const Te=re.variants.map(Ee=>$r(J,re,Ee));Object.assign(J,$r(J,re,_e),{browserVariants:Te})}else re&&Object.assign(
J,{browserSummary:!1,loadable:!1,revision:re.revision,description:re.description??J.description,license:re.license,reason:"\
No supported package variants were found in this repository."})}return[...L,...te].map(J=>({...J,browserPeerAvailable:Oo(
J,V).length>0}))}function yr(L){if(!L?.variants?.length)return null;const V=[...L.variants].sort((te,J)=>(ri(te.totalBytes)?
te.totalBytes:1/0)-(ri(J.totalBytes)?J.totalBytes:1/0)||String(te.name??te.key).localeCompare(String(J.name??J.key)));return V.
find(te=>(te.key??te.id)===dt.get(L.browserReference??L.repository))??V[0]}function $r(L,V,te){const J=te.package??{};return{
...J,...L,...te,key:L.key,browserOrigin:"hub",browserSummary:!1,name:te.name??L.name??L.repository,repository:V.repository,
revision:V.revision,description:V.description??L.description,license:te.license??V.license??J.license??L.license,package:te.
package,loadable:te.loadable===!0&&!!te.package,model:te.model??J.model,task:te.task??J.model?.task,dtype:te.dtype??J.model?.
dtype,localAvailability:te.localAvailability??J.localAvailability}}function Ht(){return{query:P.value,...Object.fromEntries(
Object.entries(be).map(([L,V])=>[L,V.value]))}}function $e(L){return $E(L.package??L,o)}function it(L){return L&&!L.browserSummary&&
L.loadable!==!1&&!L.requiresInspection&&(L.browserOrigin!=="hub"||!!L.package)&&!aa($e(L))}function wr(L){return ew([{...L,
browserVariants:[]}],Ht(),$e,{includeUninspected:!0}).length>0}function Ne(L){const V=L?.repository??L?.model?.repository,
te=Et.get(L?.inspectReference??V);return _n(V)&&/^[a-f0-9]{40}$/i.test(te?.revision??"")?`${_n(V)}/tree/${te.revision}`:
null}function cn(L){const V=be.precision.value,te=new Set(L.flatMap(_e=>[_e,..._e.browserVariants??[]]).map(Jc).filter(_e=>_e&&
_e!=="unknown"));V!=="all"&&te.add(V);const J=[...te].sort().join(`
`);if(J===Cr)return;Cr=J;const re=[de("option","All precisions")];re[0].value="all";for(const _e of[...te].sort()){const Te=de(
"option",_e);Te.value=_e,re.push(Te)}be.precision.replaceChildren(...re),be.precision.value=V}function Be({revealSelected:L=!1}={}){
if(ae)return;const V=Wt();cn(V);const te=ew(V,Ht(),fe=>$e(fe),{includeUninspected:!0}),J=te.filter(fe=>fe.browserFilterPending),
re=[...te.filter(fe=>!fe.browserFilterPending),...J],_e=_===ye&&!re.some(fe=>fe.key===ye)?V.find(fe=>fe.key===ye):null;Ir=
_e||re.some(fe=>fe.key===ye)?ye:re[0]?.key??null;const Te=document.activeElement?.closest?.("[data-model-key]")?.dataset.
modelKey,Ee=B==="browse"&&!T?W.scrollTop:H,Ye=new Map([...W.children].map(fe=>[fe.querySelector("[data-model-key]")?.dataset.
modelKey,fe])),At=[],gt=fe=>Ye.get(void 0)?.isEqualNode(fe)?Ye.get(void 0):fe;for(const fe of re){fe===J[0]&&At.push(gt(
de("li","Needs inspection — package filters are not yet verified","pc-browser-candidates")));const we=de("li"),Me=Ur("");
Me.className="pc-browser-result",Me.dataset.modelKey=fe.key,Me.setAttribute("aria-pressed",String(fe.key===Ir)),Me.append(
de("strong",fe.name??fe.repository??fe.modelId),de("small",fe.repository??fe.model?.repository??fe.modelId??""),de("smal\
l",`${xP(fe)} · ${Po(fe.totalBytes)}${ri(fe.totalBytes)?" package":""} · ${Jc(fe)||"Precision unknown"}`),de("small",`${pf(
fe)} · ${fe.browserSummary?"Inspect variants":zh(fe)}`)),fe.browserMatchingVariant&&Me.append(de("small",`Matching vari\
ant: ${fe.browserMatchingVariant}`)),Me.disabled=le||me;const kt=fe.key;Me.onclick=()=>{if(le||me||ae)return;const Gs=Wt().
find(rc=>rc.key===kt);if(!Gs)return;ye=kt,_=null,je="",tr="",Be({revealSelected:!0}),ee();const ho=Gs.inspectReference??
Gs.repository;Gs.browserOrigin==="hub"&&!Et.has(ho)&&Pn(ho)},we.append(Me);const Tr=Ye.get(kt);At.push(Tr?.isEqualNode(we)?
Tr:we)}re.length||At.push(gt(de("li","No matching models. Clear a filter or try another search.","pc-browser-empty")));let Tt=W.
firstChild;for(const fe of At)fe===Tt?Tt=Tt.nextSibling:W.insertBefore(fe,Tt);for(;Tt;){const fe=Tt.nextSibling;Tt.remove(),
Tt=fe}W.scrollTop=Ee,H=Ee,Te&&[...W.querySelectorAll("[data-model-key]")].find(fe=>fe.dataset.modelKey===Te)?.focus({preventScroll:!0}),
q.textContent=`${re.length} model${re.length===1?"":"s"}`,q.title=J.length?`${J.length} need inspection before package f\
ilters can be verified`:"";const vn=Object.entries(be).filter(([fe,we])=>fe!=="sort"&&we.value!=="all").length;X.textContent=
`Filters and sorting${vn?` (${vn})`:""}`,X.title=vn?`${vn} active filters`:"",U.textContent=tr||je||(mt?`Inspecting ${mt}\
…`:"")||(Rt?"Searching Hugging Face metadata…":Ct)||"",ve.hidden=!gr,ve.disabled=le||me||Rt;for(const fe of[P,...Object.
values(be)])fe.disabled=le||me;if(Nr(_e?{..._e,browserHiddenByFilters:!0}:re.find(fe=>fe.key===Ir)),L&&g.open&&B==="brow\
se"&&!T){const fe=W.querySelector('[aria-pressed="true"]');if(fe){const we=fe.getBoundingClientRect(),Me=W.getBoundingClientRect();
we.top<Me.top?W.scrollTop+=we.top-Me.top:we.bottom>Me.bottom&&(W.scrollTop+=Math.min(we.top-Me.top,we.bottom-Me.bottom)),
H=W.scrollTop}}st()}function Nr(L){const V=L?.repository??L?.model?.repository,te=JSON.stringify({source:L,compatibility:L?
$e(L):null,targets:L?Oo(L,Qr()):[],conversions:ut.get(Ne(L)),selectedMatches:L?wr(L):!1,busy:le,actionPending:me,inspecting:mt});
if(te===Dr)return;Dr=te;const J=pe.contains(document.activeElement)?document.activeElement.dataset.browserControl:null;if(pe.
replaceChildren(),!L){pe.append(de("p","Choose a model to see its package, compatibility and available peers.","pc-brows\
er-note"));return}const re=de("div");if(pe.append(re),re.append(de("span",pf(L),"pc-browser-badge"),de("h3",L.name??L.repository)),
L.description&&re.append(de("p",String(L.description).slice(0,4e3),"pc-browser-note")),L.browserMatchingVariant&&re.append(
de("p",`Matching variant: ${L.browserMatchingVariant}. Your selected variant is unchanged; choose a matching package bel\
ow.`,"pc-browser-note")),L.browserFilterPending&&re.append(de("p","Needs inspection: size, precision and compatibility f\
ilters cannot be confirmed until the package is inspected.","pc-browser-warning")),L.browserHiddenByFilters||!wr(L)){re.
append(de("p","The selected package does not match your current filters. Change the filters or choose a matching variant\
 before loading.","pc-browser-warning"));const we=Ur("Show selected package");we.disabled=le||me,we.title="Clear package\
 filters and show this Hugging Face selection; keep the search text.",we.onclick=()=>{if(!(le||me)){for(const Me of["tas\
k","size","precision","compatibility"])be[Me].value="all";["all","hub"].includes(be.source.value)||(be.source.value="hub"),
Be({revealSelected:!0})}},re.append(we)}const _e=L.inspectReference??V,Te=_n(V);if(Te){const we=de("a",V);we.href=Te,we.
target="_blank",we.rel="noopener noreferrer",re.append(we)}const Ee=Et.get(_e);if(L.browserConversion&&ft(re,L.browserConversion),
L.browserOrigin==="hub"&&Ee?.variants?.length){const we=de("label","Package variant","pc-browser-variants"),Me=de("selec\
t");Me.setAttribute("aria-label","Package variant");for(const kt of Ee.variants){const Tr=de("option",`${kt.name??kt.id??
kt.key} · ${kt.dtype??"Precision unknown"} · ${Po(kt.totalBytes)}${kt.requiresInspection?" · Needs inspection":kt.loadable===
!1?" · Unsupported":""}`);Tr.value=kt.key??kt.id,Me.append(Tr)}Me.value=yr(Ee)?.key??yr(Ee)?.id,Me.disabled=le||me,Me.onchange=
()=>{const kt=Me.value;dt.set(_e,kt),Be({revealSelected:!0}),Ee.variants.find(Tr=>(Tr.key??Tr.id)===kt)?.requiresInspection&&
Pn(_e,kt)},we.append(Me),re.append(we)}const Ye=de("dl",void 0,"pc-browser-facts"),At=(we,Me)=>Ye.append(de("dt",we),de(
"dd",Me));At("Task",L.browserSummary&&!L.task?"Inspect to determine":zh(L)),At("Package",Po(L.totalBytes)),At("Precision",
Jc(L)||"Unknown"),At("License",typeof L.license=="string"?L.license:L.license?.spdx??L.license?.join?.(", ")??"Not suppl\
ied"),At("Revision",L.revision??L.model?.revision??"Not inspected");const gt=$e(L);At("Estimated RAM",Po(gt.cpuBytes>0?gt.
cpuBytes:void 0)),At("Estimated GPU memory",Po(gt.gpuBytes>0?gt.gpuBytes:void 0)),re.append(Ye),typeof L.license?.notice==
"string"&&re.append(de("p",L.license.notice.slice(0,1e3),"pc-browser-note")),re.append(de("p",L.browserSummary?"Search m\
etadata is not a verified runnable package. Inspect its variants before loading.":L.loadable===!1?L.reason||"This packag\
e is not supported by the current runtimes.":gt.reason||(gt.status==="available"?"Required device features are available\
.":"Memory fit is unverified; this browser cannot report free GPU memory."),aa(gt)||L.loadable===!1?"pc-browser-warning":
"pc-browser-note")),re.append(de("p",pf(L)==="Catalog"?"Catalog provenance does not guarantee model quality or performan\
ce on this device.":"Candidate packages have not necessarily been tested on this device. Review the model card and licen\
se.","pc-browser-note")),Ee&&i&&Ne(L)&&yi(re,L,V);const Tt=de("div",void 0,"pc-browser-actions");if(L.browserSummary||L.
requiresInspection){const we=Ur(L.requiresInspection?"Inspect selected variant":"Inspect variants");we.disabled=le||me||
mt===_e||!s,we.onclick=()=>{ye=L.key;const Me=yr(Ee);Pn(_e,L.requiresInspection?Me?.key??Me?.id:void 0)},Tt.append(we)}const vn=Ur(
"Load");vn.disabled=le||me||!it(L)||!wr(L)||!a,vn.onclick=()=>{const we=Wt().find(Me=>Me.key===L.key);if(le||me||!it(we)||
!wr(we)){Be();return}ln(()=>a(we.package??we))},Tt.append(vn);const fe=Oo(L,Qr());for(const we of fe){const Me=Ur(`Use p\
eer${we.busy?" (busy)":""}`);Me.disabled=le||me||!c,Me.title=`${we.providerCount??1} online provider${we.providerCount===
1?"":"s"}; uses the peer without downloading model weights.`,Me.onclick=()=>{const kt=Oo(L,Qr()).find(Tr=>Tr.key===we.key);
!le&&!me&&kt?ln(()=>c(kt.key)):Be()},Tt.append(Me)}if(!L.browserSummary&&aa(gt)&&l){const we=Ur("Setup help");we.disabled=
le||me,we.onclick=()=>void ln(()=>l(L.package??L)),Tt.append(we)}if(fe.length&&re.append(de("p","Peer inference stays av\
ailable even when this device cannot load the model. The selected peer receives your prompt.","pc-browser-note")),pe.append(
Tt),J){const we=[...pe.querySelectorAll("[data-browser-control]")].find(Me=>Me.dataset.browserControl===J);we?we.focus({
preventScroll:!0}):J==="conversion-search"&&pe.querySelector("[data-conversion-repository]")?.focus({preventScroll:!0})}}
function ft(L,V){L.append(de("p",`Publisher-declared source: ${V.sourceRepository}. Relationship: ${V.relationship}. Thi\
s does not prove equivalent weights or the same source revision.`,"pc-browser-note"));const te=Ur("Back to source model");
te.disabled=le||me,te.onclick=()=>{le||me||!Wt().some(J=>J.key===V.sourceKey)||(ye=V.sourceKey,_=ye,Be({revealSelected:!0}))},
L.append(te)}function yi(L,V,te){const J=Ne(V),re=ut.get(J),_e=de("section",void 0,"pc-browser-conversions");_e.setAttribute(
"aria-label","Related browser packages"),_e.append(de("h4","Related browser packages"));const Te=de("p","","pc-browser-n\
ote");if(Te.setAttribute("role","status"),Te.textContent=re?.status==="pending"?"Finding publisher-declared conversions…":
re?.status==="error"?`Conversion search unavailable: ${re.error}`:re?.status==="cancelled"?"Conversion search cancelled.\
 You can retry.":re?.status==="complete"?[re.items.length?"Candidates need package inspection before loading.":"No publi\
sher-declared ONNX or GGUF relatives were found.",re.warning,re.cached?"Showing cached conversion metadata.":""].filter(
Boolean).join(" "):"Find ONNX or GGUF packages whose publisher identifies this source model.",_e.append(Te),re?.status!==
"complete"){const Ee=Ur(re?.status==="pending"?"Cancel conversion search":"Find browser conversions");Ee.dataset.browserControl=
"conversion-search",Ee.disabled=le||me,Ee.onclick=()=>{le||me||(_=V.key,re?.status==="pending"?ut.cancel():ut.find(J))},
_e.append(Ee)}for(const Ee of re?.items??[]){const Ye=Ur("");Ye.className="pc-browser-conversion",Ye.dataset.conversionRepository=
Ee.repository,Ye.dataset.browserControl=`conversion:${Ee.repository}`,Ye.append(de("strong",Ee.name),de("small",Ee.repository),
de("small",`${Ee.formats.join(" / ")} · ${Ee.relationship} · Candidate · Needs inspection`),de("small",`Publisher-dec\
lared source: ${Ee.sourceRepository}`)),Ye.disabled=le||me,Ye.onclick=()=>{if(le||me)return;const At=`hub:${Ee.repository}\
@${Ee.revision}`,gt={repository:Ee.repository,name:Ee.name,description:Ee.description,task:Ee.task,browserKey:At,inspectReference:Ee.
reference,browserConversion:{sourceKey:V.key,sourceRepository:te,relationship:Ee.relationship}};wt=[...wt.filter(Tt=>(Tt.
browserKey??`hub:${Tt.repository}`)!==At),gt],ye=At,_=At,je="",tr="",Be({revealSelected:!0}),Et.has(Ee.reference)||Pn(Ee.
reference)},_e.append(Ye)}L.append(_e)}async function ln(L){if(!(ae||le||me)){me=!0,b||fo(),Be();try{await L()}catch(V){
ae||(tr=Uo(V))}finally{me=!1,Be()}}}async function Pn(L,V){const te=ed(L),J=te.repository??L;if(ae||le||!s||!_n(J))return;
_=ye;const re=V?Et.get(L)?.revision:null,_e=te.revision??re,Te=V&&/^[a-f0-9]{40}$/i.test(re??"")?`${_n(J)}/tree/${re}`:L;
pt?.abort();const Ee=new AbortController;pt=Ee;const Ye=++qe,At=ye;mt=L,je="",Be();try{const gt=await s(Te,{selectedVariant:V,
signal:Ee.signal});if(ae||Ee.signal.aborted||Ye!==qe)return;if(!gt||gt.repository!==J||!Array.isArray(gt.variants))throw new Error(
"Invalid model inspection response");if(_e&&gt.revision!==_e)throw new Error("Inspection returned a different model revi\
sion");Et.set(L,{...gt,browserReference:L}),gt.variants.length||(je="No supported package variants were found in this re\
pository.")}catch(gt){!ae&&!Ee.signal.aborted&&Ye===qe&&(je=`Inspection failed: ${Uo(gt)}`)}finally{Ye===qe&&(mt=null,pt=
null,Be({revealSelected:ye===At}))}}function dn(){clearTimeout(Ve),nt?.abort(),pt?.abort(),ut.cancel(),++Ae,++qe,nt=null,
pt=null,Rt=!1,mt=null}async function wn(L=!1){if(clearTimeout(Ve),ae||le||ie||!g.open||B!=="browse")return;const V=ed(P.
value);if(V.error){vt=!1,Ct=V.error,Be();return}if(!uo())return;nt?.abort();const te=new AbortController;nt=te,vt=!0,_r=
L;const J=++Ae;Rt=!0,Ct="",Be();try{const re=await n({query:V.query,task:be.task.value==="all"?void 0:be.task.value,cursor:L?
gr:void 0,signal:te.signal});if(ae||te.signal.aborted||J!==Ae)return;if(!re||!Array.isArray(re.items))throw new Error("I\
nvalid search response");let _e=re.items.filter(Te=>Te&&_n(Te.repository));if(V.repository){const Te=_e.find(Ee=>Ee.repository===
V.repository);_e=_e.filter(Ee=>Ee.repository!==V.repository),_e.unshift({...Te,repository:V.repository,name:Te?.name??V.
repository,inspectReference:V.reference,browserKey:`hub:${V.repository}${V.revision?"@"+V.revision:""}`})}wt=[...new Map(
[...L?wt:[],..._e].map(Te=>[Te.repository,Te])).values()].slice(0,200),gr=wt.length<200?re.nextCursor??null:null,Ct=[re.
warning,re.cached?"Showing cached Hugging Face results.":""].filter(Boolean).join(" ")}catch(re){!ae&&!te.signal.aborted&&
J===Ae&&(Ct=`Hugging Face search unavailable: ${Uo(re)}. Catalog, stored models and peer files remain available.`)}finally{
J===Ae&&(vt=!1,Rt=!1,nt=null,Be())}}function uo(){return!!(n&&["all","hub"].includes(be.source.value)&&(P.value.trim()||
be.source.value==="hub"))}function wi(){dn(),wt=[],gr=null,Ct="",je="",tr="",_=null,vt=uo(),_r=!1,Be(),vt&&(Ve=setTimeout(
()=>void wn(),350))}P.addEventListener("input",wi),P.addEventListener("keydown",L=>{L.key==="Enter"&&(L.preventDefault(),
wn())});for(const[L,V]of Object.entries(be))V.addEventListener("change",()=>{L==="task"||L==="source"?wi():Be()});ve.onclick=
()=>void wn(!0);function fo(){dn(),Ue(),T=!1,st(),g.open&&g.close()}async function On(){if(se)return;if(!ie&&he.matches&&
B==="browse"&&T){St();return}const L=ie?.onBack??m;if(!L){fo();return}se=!0,st();try{await L()}catch(V){ae||(S.textContent=
`Could not close: ${Uo(V)}. Try again.`,S.hidden=!1)}finally{se=!1,ae||st()}}return E.onclick=On,g.addEventListener("can\
cel",L=>{L.preventDefault(),On()}),g.addEventListener("close",()=>{g.open||(dn(),Ue(),T=!1,st(),Gt?.isConnected&&Gt.focus(
{preventScroll:!0}))}),g.addEventListener("keydown",L=>{if(L.key==="Escape"){L.preventDefault(),On();return}if(L.key!=="\
Tab")return;const V=[...g.querySelectorAll("button,input,select,a[href],summary")].filter(re=>!re.disabled&&re.getClientRects().
length),te=V[0],J=V.at(-1);L.shiftKey&&document.activeElement===te&&(L.preventDefault(),J?.focus()),!L.shiftKey&&document.
activeElement===J&&(L.preventDefault(),te?.focus())}),{element:g,setFeedback(L){ae||(S.textContent=String(L??"").slice(0,
2048),S.hidden=!S.textContent)},showPage({title:L,content:V,onBack:te,buttonLabel:J="Done"}){ae||(ie||(ke=document.activeElement),
dn(),Ue(),ie={title:L,onBack:te,buttonLabel:J},v.replaceChildren(V),st(),g.open||g.showModal(),(v.querySelector("[autofo\
cus],button:not(:disabled),input:not(:disabled)")??E).focus({preventScroll:!0}))},showLibrary({refreshStored:L=!1}={}){if(!ae&&
(ie=null,v.replaceChildren(),st(),Be(),g.open)){const V=ke;ke=null,(V?.isConnected&&!V.disabled&&V.getClientRects().length?
V:T?E:I[B]??P).focus({preventScroll:!0}),B==="stored"&&L?an():B==="browse"&&vt&&!nt&&!le&&wn(_r)}},open({selectedKey:L,tab:V,
refreshStored:te=!0}={}){if(ae)return;L!==void 0&&(ye=L,_!==L&&(_=null));const J=V??(d&&u()?"stored":"browse");g.open||(Gt=
document.activeElement,B=C[J]?J:"browse",T=!1,st(),g.showModal()),Rr(J,{refreshStored:te}),B==="browse"?P.focus({preventScroll:!0}):
I.stored.focus({preventScroll:!0})},close(){!ae&&g.open&&fo()},isStoredOpen:()=>!ae&&g.open&&!ie&&B==="stored",getActiveTab:()=>B,
refresh:Be,setBusy(L){const V=le;le=!!L,le&&dn(),Be(),V&&!le&&g.open&&B==="browse"&&vt&&!nt&&wn(_r)},dispose(){ae||(ae=!0,
dn(),Ue(),he.removeEventListener("change",ze),g.open&&g.close(),g.remove(),Et.clear(),dt.clear(),ut.dispose())}}}function AP({
browser:t,onRequestClose:e}){const r=new Map;let n,s,i=!1;function o(){n=null,t.showLibrary({refreshStored:i}),i=!1}function a(){
return s||(t.setFeedback("Closing Models… Waiting for cleanup."),s=Promise.resolve().then(e).catch(c=>{throw o(),t.setFeedback(
`Could not close Models: ${c.message}. Click Done to retry.`),c}).finally(()=>{s=null}),s)}return{requestClose:a,showLibrary:o,
isShowing:c=>n===c,show(c,{closeWindow:l=!1,refreshStoredOnReturn:d=!1}={}){let u=r.get(c);if(!u){u=document.createElement(
"section"),u.className="pc-management-content";for(const h of[...c.children])h.classList.contains("pc-dialog-header")||u.
append(h);r.set(c,u)}n=c,i=d,t.showPage({title:c.querySelector("h2")?.textContent??"Models",content:u,buttonLabel:l?"Clo\
se Models":"Done",onBack:l?a:o})}}}let IP=0;function _P(t){const e=(ae,le,me)=>{const ye=document.createElement(ae);return le&&
(ye.textContent=le),me&&(ye.className=me),ye},r=ae=>{const le=e("button",ae);return le.type="button",le},n=(ae,le)=>{const me=e(
"label",ae);return me.append(le),me},s=(ae,le,me)=>{const ye=e(ae);return ye.setAttribute("aria-label",le),me&&(ye.maxLength=
me),ye},i=e("dialog",null,"pc-agent-console"),o=e("h2","Agents");o.id=`pc-agents-${++IP}`,i.setAttribute("aria-labelledb\
y",o.id);const a=r("Done"),c=e("header");c.append(o,a);const l=e("p","","pc-agent-status");l.setAttribute("role","status"),
l.setAttribute("aria-live","polite");const d=e("div",null,"pc-agent-body"),u=e("div",null,"pc-agent-main"),h=e("aside");
h.setAttribute("aria-label","Saved agents");const p=r("New agent"),m=r("Restore as new"),b=s("input","Restore agent file");
b.type="file",b.accept=".json,application/json",b.hidden=!0;const g=e("div",null,"pc-agent-buttons");g.append(p,m,b);const f=e(
"div",null,"pc-agent-list");f.setAttribute("aria-label","Agent list"),h.append(g,f);const y=e("section",null,"pc-agent-w\
orkspace"),E=e("h3","Create or select an agent"),k=e("p","","pc-agent-note"),x=e("p","","pc-agent-note"),S=e("p","","pc-\
agent-record-text"),v=e("p","","pc-agent-record-text"),w=e("dl",null,"pc-agent-record");for(const[ae,le]of[["Instruction\
s",S],["Goals",x],["Saved memory summary",v]]){const me=e("dd");me.append(le),w.append(e("dt",ae),me)}const I=e("div",null,
"pc-agent-buttons"),C=r("Chat"),R=r("Edit agent"),N=r("Pause"),D=r("Resume"),P=r("Export"),j=r("Delete agent");I.append(
C,R,N,D,P,j);const Z=e("p","","pc-agent-policy"),X=e("p","Chat opens this agent in the main conversation. Resume allows \
new messages; it never starts a task.","pc-agent-note");y.append(E,k,I,Z,w,X),u.append(h,y);const q=e("form",null,"pc-ag\
ent-editor");q.hidden=!0;const ue=e("h3","New agent"),he=s("input","Agent name",120);he.required=!0;const ze=s("textarea",
"Instructions",16e3);ze.rows=4;const be=s("textarea","Goals",8e3);be.rows=3;const Ie=s("textarea","Saved memory summary",
16e3);Ie.rows=4;const U=s("select","Inference policy");for(const[ae,le]of[["local-only","Local only"],["network-assisted",
"Mixed · local first, then peers"]]){const me=e("option",le);me.value=ae,U.append(me)}const Y=e("p","Mixed uses a compa\
tible local model first, then an available peer. Your instructions, goals, saved context, messages and attachments may b\
e sent to that peer. Local only keeps execution on this device.","pc-agent-policy"),W=r("Save agent");W.type="submit";const pe=r(
"Cancel edit"),ve=e("div",null,"pc-agent-buttons");return ve.append(W,pe),q.append(ue,n("Name",he),n("Instructions",ze),
n("Goals · one per line",be),n("Saved memory summary",Ie),n("Inference policy",U),Y,ve),d.append(u,q),i.append(c,l,d),t.
append(i),{element:i,close:a,status:l,body:d,main:u,create:p,restore:m,restoreFile:b,list:f,workspace:y,name:E,metadata:k,
identity:x,instructionsText:S,summaryText:v,chat:C,edit:R,pause:N,resume:D,exportButton:P,remove:j,policy:Z,editor:q,editorHeading:ue,
agentName:he,instructions:ze,goals:be,summary:Ie,mode:U,save:W,cancelEdit:pe}}const mf=t=>String(t?.message||t||"Agent o\
peration failed"),CP=new Set(["queued","running","cancelling"]);function RP({container:t,controller:e,onChat:r}={}){if(!t||
!e)throw new TypeError("Agent Console needs a container and controller");const n=_P(t);let s=!1,i=null,o=null,a=[],c=0,l=null,
d=null,u=null,h=null,p=!0,m=!1,b=null,g=null;const f=new Map,y=()=>!!(l||d||i&&i!==o?.agentId||CP.has(o?.activity?.status));
function E(D,P=!1){s||(n.status.textContent=D,n.status.dataset.error=String(P))}function k(){const D=y(),P=!!o,j=o?.status===
"paused",Z=!!(o?.activity?.unsaved||o?.recoveryRequired);for(const X of[n.create,n.restore,n.edit,n.remove,n.exportButton])
X.disabled=D||X!==n.create&&X!==n.restore&&!P;n.restore.hidden=typeof e.importAsNew!="function",n.exportButton.hidden=typeof e.
export!="function",n.chat.hidden=typeof r!="function",n.chat.disabled=!P||D,n.pause.disabled=!P||j||!!(l||d),n.resume.disabled=
!P||!j&&!Z||D;for(const X of[n.agentName,n.instructions,n.goals,n.summary,n.mode,n.save,n.cancelEdit])X.disabled=!!(l||d);
for(const X of n.list.querySelectorAll("button"))X.disabled=D;n.element.setAttribute("aria-busy",String(!!(l||d)))}function x(){
if(n.list.replaceChildren(),!a.length){const D=document.createElement("p");D.className="pc-agent-note",D.textContent="No\
 saved agents. Create one to keep its identity and context on this device.",n.list.append(D)}for(const D of a){const P=document.
createElement("button");P.type="button",P.dataset.agentId=D.agentId,P.setAttribute("aria-current",String(D.agentId===i)),
P.append(document.createTextNode(D.identity?.name||"Unnamed agent"));const j=document.createElement("small");j.textContent=
D.activity?.status||D.status||"Saved",P.append(j),P.addEventListener("click",()=>{y()||s||(i=D.agentId,k(),v())}),n.list.
append(P)}}function S(){n.name.textContent=o?.identity?.name||"Create or select an agent",n.metadata.textContent=o?`${o.
activity?.status||o.status} · Saved revision ${o.revision} · ${new Date(o.updatedAt).toLocaleString()}`:"",o?.activity?.
unsaved&&(n.metadata.textContent+=" · Unsaved outcome — resolve storage before more messages"),o?.recoveryRequired&&(n.
metadata.textContent+=" · Interrupted outcome — Resume acknowledges it without replay"),n.instructionsText.textContent=
o?.identity?.instructions||"No instructions saved.",n.identity.textContent=o?.goals?.join(`
`)||"No goals saved.",n.summaryText.textContent=o?.context?.summary||"No memory summary saved.",n.policy.textContent=o?o.
policy?.inferenceMode==="network-assisted"?"Mixed · local first, then peers. Selected agent context and message inputs m\
ay be sent to the executing peer.":"Local only. Tasks use a ready model on this device; no peer fallback.":"",x(),k()}async function v(){
const D=++c;try{const P=await e.list({limit:100});if(s||D!==c)return;a=P,a.some(X=>X.agentId===i)||(i=a[0]?.agentId??null);
const j=i,Z=j?await e.get(j):null;return s||D!==c||i!==j?void 0:(o=Z,S(),!0)}catch(P){return!s&&D===c&&E(`Could not read\
 saved agents: ${mf(P)}`,!0),!1}}function w(){m=!0,!b&&(b=(async()=>{for(;m&&!s;)m=!1,await v()})().finally(()=>{b=null}))}
async function I(D,P,j,Z="Saved.",X=""){if(l||d||s)return;E(D);const q=Promise.resolve().then(async()=>{try{const ue=await P();
return s||(await j?.(ue),await v()&&E(Z)),ue}catch(ue){E(X+mf(ue),!0)}});l=q,k();try{return await q}finally{l===q&&(l=null),
s||k()}}function C(D){y()||s||(u=D?{id:D.agentId,revision:D.revision}:{},n.editorHeading.textContent=D?"Edit agent":"New\
 general agent",n.agentName.value=D?.identity?.name||"",n.instructions.value=D?.identity?.instructions||"",n.goals.value=
(D?.goals||[]).join(`
`),n.summary.value=D?.context?.summary||"",n.mode.value=D?.policy?.inferenceMode||"network-assisted",n.main.hidden=!0,n.
editor.hidden=!1,E(""),k(),n.agentName.focus())}function R(){u=null,n.main.hidden=!1,n.editor.hidden=!0,n.create.focus()}
n.close.addEventListener("click",()=>n.element.close()),n.element.addEventListener("close",()=>{!s&&!n.element.open&&p&&
h?.isConnected&&h.focus()}),n.element.addEventListener("keydown",D=>{if(D.key!=="Tab")return;const P=[...n.element.querySelectorAll(
"button,input,textarea,select,[tabindex]")].filter(X=>!X.disabled&&X.getClientRects().length),j=P[0],Z=P.at(-1);D.shiftKey&&
document.activeElement===j?(D.preventDefault(),Z?.focus()):!D.shiftKey&&document.activeElement===Z&&(D.preventDefault(),
j?.focus())}),n.chat.addEventListener("click",()=>{if(!o||y()||s||typeof r!="function")return;const D=o.agentId;E("Openi\
ng conversation…");const P=Promise.resolve().then(()=>r(D));d=P,k(),P.then(()=>{s||(p=!1,n.element.close())},j=>E(`Cou\
ld not open chat: ${mf(j)}`,!0)).finally(()=>{d===P&&(d=null),s||k()})}),n.create.addEventListener("click",()=>C()),n.edit.
addEventListener("click",()=>{o&&C(o)}),n.cancelEdit.addEventListener("click",R),n.editor.addEventListener("submit",D=>{
if(D.preventDefault(),!u||!n.agentName.value.trim())return;const P={name:n.agentName.value.trim(),instructions:n.instructions.
value,goals:n.goals.value.split(`
`).map(Z=>Z.trim()).filter(Boolean),summary:n.summary.value,inferenceMode:n.mode.value},j=u;I("Saving agent…",()=>j.id?
e.update(j.id,P,{expectedRevision:j.revision}):e.create(P),Z=>{i=Z.agentId,R()})}),n.remove.addEventListener("click",()=>{
if(o&&!y()){const D=o.agentId;I("Deleting agent…",()=>e.remove(D),()=>{i=null,o=null})}}),n.resume.addEventListener("c\
lick",()=>{if(o&&!n.resume.disabled){const D=o.agentId;I("Resuming agent…",()=>e.resume(D),null,"Resumed. Send a messa\
ge in the main chat when ready.")}}),n.pause.addEventListener("click",()=>{if(o&&!n.pause.disabled){const D=o.agentId;I(
"Pausing; waiting for task cleanup…",()=>e.pause(D),null,"Paused. Resume allows new messages but does not run them.","\
Cleanup incomplete: ")}}),n.exportButton.addEventListener("click",()=>{if(!o||y())return;const D=o.agentId;I("Preparing \
export…",()=>e.export(D),P=>{const j=new Blob([JSON.stringify(P,null,2)],{type:"application/json"}),Z=URL.createObjectURL(
j),X=document.createElement("a");X.href=Z,X.download=`agent-${D}.json`,X.click();const q=setTimeout(()=>{URL.revokeObjectURL(
Z),f.delete(Z)},1e3);f.set(Z,q)})}),n.restore.addEventListener("click",()=>n.restoreFile.click()),n.restoreFile.addEventListener(
"change",()=>{const D=n.restoreFile.files?.[0];n.restoreFile.value="",!(!D||y())&&I("Restoring as a new paused agent…",
async()=>{if(D.size>12*1024*1024)throw new Error("Agent backup exceeds 12 MiB");return e.importAsNew(JSON.parse(await D.
text()))},P=>{i=P.agentId})});const N=e.subscribe?.(D=>{!s&&["changed","activity","removed"].includes(D.type)&&w()});return k(),
{element:n.element,async open(D={}){if(s)throw new Error("Agent Console is closed");D.selectedId!==void 0&&!l&&!d&&(i=D.
selectedId),h=document.activeElement,p=!0,n.element.open||n.element.showModal(),await v()},dispose(){if(g)return g;s=!0,
++c,m=!1,N?.(),n.element.close();for(const[D,P]of f)clearTimeout(P),URL.revokeObjectURL(D);return f.clear(),g=Promise.allSettled(
[l,d,b]).then(()=>{n.element.remove()}),g}}}const Es=t=>structuredClone(t),Fo=(t,e)=>Object.assign(new Error(e),{code:t}),
TP=new Set(["queued","running","cancelling"]),MP=t=>new TextEncoder().encode(t).byteLength;function rw(t){if(!t)throw Fo(
"ERR_AGENT_NOT_FOUND","This saved agent no longer exists.");if(t.activity?.unsaved)throw Fo("ERR_AGENT_UNSAVED","Agent c\
hanges are not saved. Resume to retry saving before another task.");if(t.recoveryRequired)throw Fo("ERR_AGENT_RECOVERY_R\
EQUIRED","Resume to acknowledge this interrupted task; it will not replay.");if(t.status==="paused")throw Fo("ERR_AGENT_\
PAUSED","Resume this paused agent before sending a task.");if(TP.has(t.activity?.status)||t.status==="running")throw Fo(
"ERR_AGENT_BUSY","Wait for this agent task and its cleanup to finish.");if(!["local-only","network-assisted"].includes(t.
policy?.inferenceMode))throw new Error("Unknown agent inference policy");return t}function BP({controller:t,onChange:e}={}){
if(!t?.list||!t?.get||!t?.events||!t?.run||!t?.cancel||!t?.resume||!t?.getAttachment)throw new TypeError("Agent chat req\
uires a persistent agent controller");const r=new AbortController;let n=!1,s=[],i,o=!1,a=0;function c(){if(n)throw new Error(
"Agent chat session is closed")}function l(S,...v){if(!(n||typeof S!="function"))try{Promise.resolve(S(...v)).catch(()=>{})}catch{}}
function d(S){l(e,Es(s),S)}function u(S,v){c();const w=v?AbortSignal.any([v,r.signal]):r.signal;return w.throwIfAborted(),
new Promise((I,C)=>{const R=()=>C(w.reason);w.addEventListener("abort",R,{once:!0}),Promise.resolve().then(()=>(w.throwIfAborted(),
S(w))).then(N=>(w.throwIfAborted(),Es(N))).then(I,C).finally(()=>w.removeEventListener("abort",R))})}function h(){return c(),
i||(o=!0,i=(async()=>{for(;o;){o=!1;const S=a,v=await u(w=>t.list({limit:100,signal:w}));if(!Array.isArray(v)||v.length>
100)throw new Error("Invalid saved-agent list");if(S!==a){o=!0;continue}s=v,d()}return Es(s)})().finally(()=>{i=null}),i)}
const p=t.subscribe?.(S=>{n||!["changed","removed","activity"].includes(S?.type)||(a++,o=!0,h().catch(v=>{n||d({error:v})}))});
async function m(S,{signal:v}={}){ht(S);const w=await u(()=>t.get(S),v);if(w&&w.agentId!==S)throw new Error("Saved agent\
 identity does not match the requested chat");return w}async function b(S,{signal:v}={}){ht(S);const w=[];let I;for(let R=0;R<
3;R++){const N=await u(D=>t.events(S,{limit:100,after:I,signal:D}),v);if(!Array.isArray(N)||N.length>100)throw new Error(
"Invalid saved agent history");for(const D of N){if(D.agentId!==void 0&&D.agentId!==S)throw new Error("Saved history bel\
ongs to another agent");if(!Number.isSafeInteger(D.sequence)||D.sequence<=(I??0))throw new Error("Invalid agent history \
cursor");I=D.sequence,w.push(D)}if(N.length<100)break}const C=new Set(w.filter(R=>R.conversationId!==void 0&&R.operationId).
map(R=>R.operationId));return w.filter(R=>R.conversationId===void 0&&!C.has(R.operationId))}async function g(S,v,{signal:w}={}){
ht(S),ht(v);const I=await u(()=>t.getAttachment(S,v),w);if(!I)return null;if(I.id!==v||I.agentId!==void 0&&I.agentId!==S)
throw new Error("Saved image belongs to another agent attachment");return E1(I)}async function f(S,{task:v,prompt:w,image:I,
maxNewTokens:C,seed:R,signal:N,onToken:D,onProgress:P}={}){ht(S),c(),N?.throwIfAborted();const j=Zl({task:v,prompt:w,image:I,
maxNewTokens:C,seed:R});rw(await m(S,{signal:N})),N?.throwIfAborted();const Z=await t.run(S,{...j,signal:N,onEvent(q){n||
N?.aborted||q?.agentId!==S||(q.type==="token"&&typeof q.text=="string"?l(D,q.text):q.type==="progress"&&l(P,Es(q.event)))}}),
X=Es(Z?.result);if(Z?.agentId!==void 0&&Z.agentId!==S)throw new Error("Agent result belongs to another chat");if(!X||typeof X.
text!="string"||MP(X.text)>65536)throw new Error("Invalid saved agent result");if(X.image!=null){if(j.task!=="text-to-im\
age")throw new Error("Unexpected image in agent text response");X.image=Zl({task:"image-text-to-text",prompt:"Validate r\
esult",image:X.image}).image}else if(j.task==="text-to-image")throw new Error("Agent image generation returned no image");
return{...X,route:Es(Z.route),agentId:S,requestId:Z.requestId}}async function y(S,v){return rw(await m(S,v)).policy.inferenceMode===
"local-only"?"local-only":"mixed"}function E(S){return c(),ht(S),t.cancel(S)}async function k(S){c(),ht(S);const v=await t.
resume(S);return n||await h(),Es(v)}function x(){n||(n=!0,a++,o=!1,r.abort(new DOMException("Agent chat session closed",
"AbortError")),p?.(),s=[])}return{refresh:h,list:()=>Es(s),get:m,history:b,attachment:g,run:f,speechTarget:y,cancel:E,resume:k,
dispose:x}}const LP=async t=>(await Ft(async()=>{const{createVoiceSession:e}=await import("./VoiceSession-Dcf7zETG.js");
return{createVoiceSession:e}},__vite__mapDeps([7,2]),import.meta.url)).createVoiceSession(t),DP=async()=>(await Ft(async()=>{const{
createWorldAudio:t}=await import("./WorldAudio-DrkXZENb.js");return{createWorldAudio:t}},[],import.meta.url)).
createWorldAudio();async function $P({container:t=document.body,stateManager:e,computeManager:r,networkManager:n,getContext:s,
actions:i,runtimeBaseUrl:o,onClose:a,onRequestClose:c,autoConnect:l=!1,managementOnly:d=!1,runtimeFactory:u=rP,refreshIntervalMs:h=5e3,
pwaInstallController:p,voiceSessionFactory:m=LP,audioFactory:b=DP,navigate:g=f=>location.assign(f)}={}){const f=oP(t);if(d){
f.panel.setAttribute("aria-label","Model management"),f.panel.classList.add("pc-model-management");for(const M of[f.back,
f.agents,f.transcript,f.proposed,f.attachment,f.prompt,f.resumeAgent,f.send.parentElement,f.clearChat,f.clearChat.nextElementSibling])
M&&(M.style.display="none");const A=document.createElement("p");A.className="pc-inference-note",A.textContent="Manage mo\
dels for this world. Loaded models remain available to residents when you return to the world.",f.panel.append(A)}const y=wP(
f.panel),E=document.createElement("div");E.hidden=!0,f.panel.append(E);const k=new TextEncoder,x=new Map,S=new Set;let v,
w,I,C,R,N,D=!1,P=!1,j=!1,Z,X,q,ue,he,ze,be,Ie,U,Y=!1,W=!1,pe=[],ve=!0,ae,le=!1,me=!1;const ye=new Set;let Ir,Ve=[],nt=[],
pt,Ae,qe,wt,gr,Ct=0,Rt,mt,vt,_r,je,tr,Gt,Dr,Cr,_,B,T=[],H="mixed",O,G,ie,ke,se=!1,Et=0,dt,ut,st,St={status:"idle",active:!1,
recording:!1};const ee=()=>!P&&!j,Ue=A=>["checking","unavailable"].includes(A?.localAvailability?.status),an=A=>String(A?.
localAvailability?.reason||(A?.localAvailability?.status==="checking"?"Checking this device…":"Unavailable on this dev\
ice.")).slice(0,512),Rr=()=>f.generateImage.checked?"text-to-image":R?"image-text-to-text":"text-generation",br=A=>typeof A==
"string"&&A.startsWith("agent:")?A.slice(6):null,Qr=A=>A?A.activity?.unsaved?"Agent changes are not saved. Resume to ret\
ry saving before another message.":A.recoveryRequired?"This agent has an interrupted task. Resume to acknowledge it; it \
will not replay.":["queued","running","cancelling"].includes(A.activity?.status)?"This agent is busy.":A.status==="pause\
d"?"This agent is paused. Resume it to chat.":"":"This agent is unavailable.",Wt=(A,M)=>A?.available===!0&&(A.agentId?nt.
some(F=>(A.local||A.inferenceMode==="local-only"?F.local:!0)&&F.available&&Kc(F,M)):Kc(A,M)),yr=(A=Rr())=>{const M=f.target.
value||"mixed",F=br(M);if(F){const z=T.find(Le=>Le.agentId===F),K=Qr(z),ge=z?.policy?.inferenceMode!=="network-assisted";
return{key:M,agentId:F,head:z,name:z?.identity?.name??"Unavailable agent",reason:K,available:!K,automatic:!0,local:ge,inferenceMode:ge?
"local-only":"network-assisted",modalities:["text","image"],outputModalities:A==="text-to-image"?["image"]:["text"]}}return[
"mixed","local-only"].includes(M)?{key:M,automatic:!0,task:A,name:M==="mixed"?"Mixed":"Local only",local:M==="local-only",
available:nt.some(z=>(M==="mixed"||z.local)&&Wt(z,A)),modalities:A==="image-text-to-text"?["text","image"]:["text"],outputModalities:A===
"text-to-image"?["image"]:["text"]}:nt.find(z=>z.key===M)},$r=(A,M)=>Wt(A,M)?(A.automatic?nt:[A]).some(F=>(!A.local||F.local)&&
Kc(F,M)&&TE(F)):!1,Ht=()=>{i?.invalidate?.(),f.proposed.replaceChildren()};function $e(A,{quiet:M=!1}={}){return f.status.
textContent=A,f.status.classList.toggle("pc-status-quiet",M),d&&Ae?.setFeedback(A),A}const it=A=>{if(!ee())return;const M=(A.
name==="AbortError"?"Cancelled: ":"Error: ")+A.message+(/context budget/i.test(A.message)?". Use Config → Clear conversa\
tion to start again, or shorten the prompt.":"");$e(M),f.chatOptions.open&&(f.chatOptionsStatus.textContent=M,f.chatOptionsStatus.
hidden=!1),(f.configuration.open||qe?.isShowing(f.configuration))&&(f.configurationStatus.textContent=M),Ae?.isStoredOpen()&&
(f.storedStatus.textContent=M)},wr=()=>{for(;f.transcript.children.length>24||k.encode(f.transcript.textContent).byteLength>
128*1024;)f.transcript.firstElementChild?.remove();y.prune(),f.transcript.scrollTop=f.transcript.scrollHeight};function Ne(){
const A=yr();f.prompt.placeholder=f.generateImage.checked?"Describe an image…":"Message…",f.browse.disabled=ve||!!w,
f.modelsMenu.disabled=ve||!!je,f.chatConfigure.disabled=ve||!!w,Ae?.setBusy(j||ve||!!w),f.agents.disabled=!!w||!!Cr||!v?.
getAgentController,f.cpuBudget.disabled=f.gpuBudget.disabled=!!w||!v?.setMemoryBudgets;const M=f.generateImage.checked&&
!!R;f.send.disabled=!!w||se||D||le||M||!$r(A,Rr())||!f.prompt.value.trim()&&!R,f.cancel.hidden=!w||!!je,f.target.disabled=
!!w,f.attach.disabled=!!w||f.generateImage.checked||!Wt(yr("image-text-to-text"),"image-text-to-text"),f.attach.title=f.
generateImage.checked?"Generate image uses a text prompt. Uncheck it to attach an image.":Wt(yr("image-text-to-text"),"i\
mage-text-to-text")?"Attach an image for a vision model":"Choose Mixed or a loaded local or peer vision model to attach \
an image.",f.generateImage.disabled=f.speakReplies.disabled=!!w;const F=St.recording||St.status==="requesting-microphone";
f.talk.textContent=F?"Stop recording":"Talk",f.talk.disabled=!!je||!!w&&!F||se||D||le||M||!!A?.agentId&&!A.available,f.resumeAgent.
hidden=!A?.agentId||!A.reason||/busy|unavailable/i.test(A.reason),f.resumeAgent.disabled=!!w||se,f.modeStatus.textContent=
M?"Generate image uses a text prompt. Remove the attached image or uncheck Generate image.":A?.agentId?`${A.name} · ${A.
local?"Local only, including voice.":"Mixed: local first, then peers, including voice."} Identity and conversation are s\
aved on this device.${A.reason?" "+A.reason:""}`:A?.key==="mixed"?"Mixed uses a compatible loaded local model first, the\
n an online peer. Messages, images and voice may be sent to that peer.":A?.key==="local-only"||A?.local?"Local execution\
 only. Voice also uses compatible local speech models.":"This target runs on another peer. Messages and attachments go t\
o that host; voice uses available local or peer speech models.",!M&&A&&!A.reason&&!Wt(A,Rr())?f.modeStatus.textContent+=
` No compatible ${f.generateImage.checked?"image-generation":R?"vision":"text"} model is available for this choice. Load\
 one or choose another target.`:!M&&A&&!A.reason&&!$r(A,Rr())&&(f.modeStatus.textContent+=" Compatible models have no av\
ailable queue capacity. You can keep drafting; sending resumes when capacity is available."),f.empty.textContent=A?.agentId&&
A.reason?`${A.name}: ${A.reason}`:Wt(A,Rr())?f.generateImage.checked?"Describe an image to get started. Use ⚙ for chat o\
ptions.":"Ask a question to get started. Use ⚙ for models, images and voice.":"Open Models to load one, or use ⚙ to ch\
oose a peer model.",f.unload.disabled=!!w,f.clearChat.disabled=!!w||!!A?.agentId,f.clearChat.title=A?.agentId?"Agent his\
tory and memory are persistent. Manage this agent through Agents.":"",(f.configuration.open||qe?.isShowing(f.configuration))&&
wi(),f.storedRefresh.disabled=!!w||!!Ie;for(const ge of f.storedList.querySelectorAll("button,input"))ge.disabled=!!w||!!Ie||
ge.dataset.inactive==="true";const z=pe.filter(ge=>ye.has(ge.manifestCid)),K=v?.loadStoredModel?z.filter(Vy).length:0;f.
storedLoadSelected.disabled=!!w||!!Ie||!K,f.storedDeleteSelected.disabled=!!w||!!Ie||!v?.deleteStoredModel||!z.length,f.
storedSelection.textContent=`${z.length} model${z.length===1?"":"s"} selected.`+(z.length!==K?` ${K} ready to load.`:""),
f.storedCancel.hidden=!w||!(Y||W)||!!je,f.storedCancel.disabled=!!w?.signal.aborted}function cn(){pt||(pt=v.getPreferredModelSourceKey?.()??
Ve.find(A=>A.modelId==="smolvlm-256m-q4"&&A.source==="hf")?.key??Ve.find(A=>!Ue(A))?.key??Ve[0]?.key),Ae?.refresh(),Ne()}
function Be(){gr&&(Ct++,aP(f,uP(gr,{environment:{browser:f.helpBrowser.value,os:f.helpOs.value}})))}function Nr(A){if(!ee()||
w)return;if(A.needsVerification||A.localAvailability?.code==="model_verification_required"){we({tab:"stored"});return}gr=
{...A,localAvailability:A.localAvailability??v.getModelCompatibility?.(A.package??A)};const M=LE();if(f.helpBrowser.value=
M.browser,f.helpOs.value=M.os,Be(),qe){qe.show(f.compatibility);return}f.networkInfo.close(),f.chatOptions.close(),f.menuWindow.
close(),f.configuration.close(),Ae?.close(),f.about.close(),f.compatibility.open||f.compatibility.showModal()}function ft(){
const A=f.target.value||"mixed",M=nt.find(z=>z.key===A),F=f.target.selectedOptions[0]?.textContent;Ve=v.listModelSources(),
wt&&!Ve.some(z=>z.key===wt.key)&&Ve.push(wt),nt=v.listInferenceTargets(),cn(),f.target.replaceChildren();for(const[z,K]of[
["mixed","Mixed · local first, then peers"],["local-only","Local only · automatic"]]){const ge=document.createElement(
"option");ge.value=z,ge.textContent=K,f.target.append(ge)}for(const z of T){const K=document.createElement("option");K.value=
`agent:${z.agentId}`,K.textContent=`Agent · ${String(z.identity?.name??"Unnamed agent").slice(0,120)}`+(Qr(z)?` (${z.activity?.
status||z.status||"unavailable"})`:""),f.target.append(K)}for(const z of nt.filter(K=>!["automatic-speech-recognition","\
text-to-speech"].includes(K.task))){const K=document.createElement("option");K.value=z.key,K.textContent=(z.local?"Local\
 · ":"Peers · ")+String(z.name).slice(0,140)+(z.task==="text-to-image"?" · Image generation":"")+(z.busy?" (busy)":z.
available?"":" (unavailable)"),f.target.append(K)}if(!nt.some(z=>z.key===A)&&!T.some(z=>`agent:${z.agentId}`===A)&&!["mi\
xed","local-only"].includes(A)&&F){const z=document.createElement("option");z.value=A,z.disabled=!0,z.textContent=(M?.name??
F.replace(/ \(unavailable\)$/,""))+" (unavailable)",f.target.append(z)}f.target.value=A,f.target.value||(f.target.value=
"mixed"),Ne()}function yi(){if(!ee()||!_)return;const A=br(H),M=T.find(z=>z.agentId===A);T=_.list(),ft();const F=T.find(
z=>z.agentId===A);A&&!w&&!se&&M?.revision!==F?.revision&&Pn(H)}async function ln(){return!_&&!B&&(B=(async()=>{const A=await v.
getAgentController();if(!ee())throw new DOMException("Console closed","AbortError");return _=BP({controller:A,onChange:yi}),
await _.refresh(),T=_.list(),ft(),_})().finally(()=>{B=null})),_??await B}async function Pn(A){ie?.abort();const M=new AbortController;
ie=M;const F=++Et,z=br(A);if(!z)return;se=!0,Ne();const K=()=>ee()&&!M.signal.aborted&&F===Et&&H===A;ke=(async()=>{try{const ge=await ln(),
[Le,ot]=await Promise.all([ge.get(z,{signal:M.signal}),ge.history(z,{signal:M.signal})]);if(!K())return;if(!Le)throw new Error(
"This saved agent no longer exists. Choose another chat or create an agent.");const at=T.findIndex(Ke=>Ke.agentId===z);at>=
0&&(T[at]=Le),f.transcript.replaceChildren(f.empty),y.prune();const Mt=new Set(ot.filter(Ke=>Ke.type==="request").map(Ke=>Ke.
operationId)),Nt=ot.filter(Ke=>["request","result"].includes(Ke.type)||["failed","cancelled","outcome-unknown"].includes(
Ke.type)&&Mt.has(Ke.operationId)).slice(-24),Pt=new Set,rr=new Set(Nt.filter(Ke=>Ke.inputAttachmentId||Ke.imageAttachmentId).
slice(-6));for(const Ke of Nt){if(!K())return;const nc=`${Ke.type}:${Ke.operationId??Ke.sequence}`;if(Pt.has(nc))continue;
Pt.add(nc);const Jr=ff(f,Ke.type==="request"?"user":"assistant",Ke.text||"",{targetName:`Agent · ${Le.identity.name}${Ke.
route?" · "+Tr(Ke.route):""}`});Jr.parentElement.dataset.operationId=Ke.operationId??"";const po=Ke.inputAttachmentId||
Ke.imageAttachmentId;if(po)try{if(!rr.has(Ke))throw new Error("Older preview omitted");const Pr=await ge.attachment(z,po,
{signal:M.signal});if(!K())return;const lt=await y.append(Jr,Pr,{signal:M.signal,prompt:Ke.text});Ke.type==="request"&&(lt.
className="pc-chat-image",lt.alt="Saved attached image")}catch{if(!K())return;const lt=document.createElement("p");lt.className=
"pc-inference-note",lt.textContent="Saved image preview is unavailable.",Jr.after(lt)}}wr()}catch(ge){K()&&(f.transcript.
replaceChildren(f.empty),y.prune(),it(ge))}finally{F===Et&&(se=!1,ie=null,ee()&&Ne())}})(),await ke}async function dn(A){
if(!ee()||w)return;const M=H,F=!!br(M),z=!!br(A);if(M===A){z&&await Pn(A),Ne();return}ie?.abort(),Et++,se=!1,H=A,f.target.
value=A,(F||z)&&(ae?.cancel(),N?.abort(),fe(),f.prompt.value=""),Ht(),z?(F||E.append(...f.transcript.childNodes),f.transcript.
replaceChildren(f.empty),y.prune(),await Pn(A)):F&&(f.transcript.replaceChildren(...E.childNodes),f.transcript.children.
length||f.transcript.append(f.empty),y.prune(),wr()),Ne()}function wn(A){if(!v)return;const M=v.getDiscoveryStatus?.(),F=M?.
connected??v.networkReady;F&&(ze=null);const z=A?.message??ze?.message??M?.errors?.[0]?.message;f.networkStatus.textContent=
f.networkInfo.update({connected:F,connecting:!!ue&&!ue.signal.aborted,peerCount:M?.peerCount,sharedModelCount:M?.sharedModelCount??
Ve.filter(K=>K.source==="peers").length,hostedModelCount:M?.hostedModelCount??nt.filter(K=>!K.local&&K.available).length,
issue:z,artifacts:v.getArtifactNetworkStatus?.()})}function uo(){const A=v.getMemoryBudgets?.()??{};f.cpuBudget.value=A.
cpuBytes==null?"":String(A.cpuBytes/1024**3),f.gpuBudget.value=A.gpuBytes==null?"":String(A.gpuBytes/1024**3);const M=v.
getDeviceCapabilities?.()?.deviceMemoryGiB;f.memoryNote.textContent=(Number.isFinite(M)&&M>0?`Browser-reported RAM: appr\
oximately ${M} GiB. `:"")+"Optional combined limits for all loaded models, using conservative estimates. Auto sets no ap\
plication byte cap; an embedding app’s limits still apply. Your browser cannot report free GPU memory. Actual allocation\
s may fail. Lowering a limit keeps loaded models and restricts future loads.",wi()}function wi(){const A=v?.getMemoryBudgetStatus?.();
if(f.memoryPressure.hidden=!A,A){const M=(F,z)=>{const K=A[F];return`${z}: ${xs(K.reservedBytes)} estimated reserved; ${K.
budgetBytes===null?"no application cap":`${xs(K.budgetBytes)} combined budget`}${K.overBudget?" (over budget; unload a m\
odel or raise the limit before adding another)":""}.`};f.memoryPressure.textContent=M("cpu","RAM")+" "+M("gpu","GPU")+(A.
owned?"":" The embedding app owns the shared resource pool; its limits cannot be raised here.")+" These totals are estim\
ates, not measured RAM or VRAM use."}}function fo(){if(!(!ee()||w||!v.setMemoryBudgets))try{const A=[f.cpuBudget,f.gpuBudget].
map(M=>{M.setCustomValidity(""),M.removeAttribute("aria-invalid");const F=M.value.trim(),z=F?Math.round(Number(F)*1024**
3):null;if(M.validity.badInput||F&&(!Number.isFinite(Number(F))||Number(F)<=0||Number(F)>1024||!Number.isSafeInteger(z)||
z<1)){const K="Enter a memory budget above 0 and at most 1024 GiB, or leave it blank.";throw M.setCustomValidity(K),M.setAttribute(
"aria-invalid","true"),new Error(K)}return z});v.setMemoryBudgets({cpuBytes:A[0],gpuBytes:A[1]}),uo(),Ve=v.listModelSources(),
cn(),f.configurationStatus.textContent="Combined memory budgets updated for future loads."}catch(A){it(A)}}async function On(){
if(!ee()||X)return X;const A=new AbortController;return q=A,X=(async()=>{try{await v.refreshPeers({signal:A.signal}),ee()&&
(CSS.supports("selector(:open)")&&f.target.matches(":open")||ft(),wn())}catch(M){ee()&&!A.signal.aborted&&wn(M)}finally{
X=null,q=null}})(),X}const L=A=>{if(!ee())return;let M;if(A.stage==="import"?(M=(A.reused?"Using saved file ":"Downloadi\
ng ")+(A.index+1)+"/"+A.total+": "+A.path,Number.isSafeInteger(A.loaded)&&Number.isSafeInteger(A.totalBytes)&&A.loaded>=
0&&A.totalBytes>0&&(M+=` · ${xs(A.loaded)} / ${xs(A.totalBytes)}`),A.retryAttempt&&(M+=` · Connection interrupted; retr\
y ${A.retryAttempt}/${A.maxRetries} in ${Math.ceil(A.retryDelayMs/1e3)}s`)):A.type==="model-load"?M="Loading model: "+(A.
stage||A.status||"initializing GPU")+(A.file?" · "+A.file:""):M={prepare:"Preparing model…",verify:"Verifying stored \
model files…","download-peers":"Fetching and verifying model files from peers…",unload:"Releasing the previous model\
…",load:"Loading model into RAM and GPU memory…"}[A.stage],A.stage==="verify"&&Number.isSafeInteger(A.loaded)&&Number.
isSafeInteger(A.totalBytes)&&A.totalBytes>0&&(M+=` · ${xs(A.loaded)} / ${xs(A.totalBytes)}`),!M)return;const F=`${A.type??
""}:${A.stage??A.status??""}:${A.path??A.file??""}`;F!==vt&&(vt=F,_r=performance.now()),mt=String(M).slice(0,512),$e(mt),
je&&!je.controller.signal.aborted&&(f.loadingStatus.textContent=mt),Y&&Ae?.isStoredOpen()&&(f.storedStatus.textContent=mt),
Rt||(Rt=setInterval(()=>{ee()&&w&&!w.signal.aborted&&($e(`${mt} (${Math.floor((performance.now()-_r)/1e3)}s)`),je&&(f.loadingStatus.
textContent=f.status.textContent),Y&&Ae?.isStoredOpen()&&(f.storedStatus.textContent=f.status.textContent))},1e3))};function V(){
!je||je.controller.signal.aborted||je.controller.abort(new DOMException("Model load cancelled","AbortError"))}async function te(){
if(w&&(w.abort(new DOMException("Models window closed","AbortError")),await I),tr)throw new Error("Model cleanup is inco\
mplete. Retry Unload in Stored models or Config before closing.",{cause:tr});return c?c():Fd()}function J(){const A=v.getResidentModelStates?.()??
v.listResidentModels?.();(!A||!A.some(M=>!["ready","idle","closed"].includes(M.status)))&&(tr=null)}function re(A,M){f.networkInfo.
close(),f.chatOptions.close();const F={controller:A,focus:document.activeElement,previousDialog:[...f.panel.querySelectorAll(
"dialog[open]")].at(-1)};je=F,f.loadingModel.textContent=String(M).slice(0,256),f.loadingStatus.textContent="Preparing m\
odel…",f.loadingCancel.disabled=!1,F.onAbort=()=>{f.loadingCancel.disabled=!0,f.loadingStatus.textContent="Cancelling \
load… Waiting for cleanup.",ee()&&(qe?Ae.element:f.loading).focus()},A.signal.addEventListener("abort",F.onAbort,{once:!0}),
Ne(),qe?qe.show(f.loading,{closeWindow:!0}):f.loading.showModal()}function _e(A){const M=je;if(!M||M.controller!==A||(A.
signal.removeEventListener("abort",M.onAbort),je=null,f.loading.close(),!ee()))return;if(qe){qe.showLibrary();return}(M.
focus?.isConnected&&M.focus.matches("button,input,select,textarea,a[href],[tabindex]")&&!M.focus.disabled&&M.focus.getClientRects().
length?M.focus:M.previousDialog?.open?M.previousDialog.querySelector("button:not(:disabled)"):f.browse.disabled?f.menu:f.
browse)?.focus()}async function Te(A,{modelName:M}={}){if(!ee()||w)return;const F=new AbortController;w=F,Ne(),I=(async()=>{
try{M!==void 0&&re(F,M),await A(F.signal)}catch(z){d&&M!==void 0&&F.signal.aborted&&z instanceof AggregateError&&(tr=z),
it(z)}finally{clearInterval(Rt),Rt=null,vt=null,O=null,G=null;try{ee()&&(await _?.refresh().catch(it),br(H)&&await Pn(H),
ft(),wr())}finally{w===F&&(w=null),ee()&&Ne(),_e(F)}}})(),await I}function Ee(A){if(!ee()||!Ae?.isStoredOpen()||!A||document.
activeElement!==document.body&&document.activeElement?.getClientRects().length)return;(A.isConnected&&!A.disabled&&A.getClientRects().
length?A:f.storedContent.querySelector("button:not(:disabled)"))?.focus()}async function Ye({signal:A,preserveStatus:M=!1,
quietCancellation:F=!1}={}){if(!ee())return!1;if(be)return U?.aborted?(await be,!ee()||A?.aborted?!1:Ye({signal:A,preserveStatus:M,
quietCancellation:F})):be;const z=new AbortController;Ie=z;const K=A?AbortSignal.any([z.signal,A]):z.signal;U=K;const ge=f.
storedContent.contains(document.activeElement)?document.activeElement:null;return M||(f.storedStatus.textContent="Readin\
g stored models…"),Ne(),be=(async()=>{await Promise.resolve();try{K.throwIfAborted();const Le=await v.listStoredModels(
{signal:K});if(K.throwIfAborted(),ee()){pe=Le;const ot=new Set(Le.filter(oa).map(at=>at.manifestCid));for(const at of ye)
ot.has(at)||ye.delete(at);cP(f,Le,{selected:ye,onRecover:v.recoverStoredModel?Tt:void 0,onUnload:gt,onSelect:(at,Mt)=>{!ee()||
w||Ie||!oa(at)||!pe.some(Nt=>Nt.manifestCid===at.manifestCid)||(Mt?ye.add(at.manifestCid):ye.delete(at.manifestCid),Ne())}}),
M||(f.storedStatus.textContent=`${Le.length} model${Le.length===1?"":"s"} stored.`)}return!0}catch(Le){return F&&(A?.aborted||
z.signal.aborted)||M||(it(Le),ee()&&(f.storedStatus.textContent="Error: "+Le.message)),!1}finally{be=null,Ie=null,U=null,
ee()&&(Ne(),Ee(ge))}})(),be}async function At(A){if(!ee()||w||Ie||!v.deleteStoredModel)return;const M=[...new Map(A.filter(
oa).map(z=>[z.manifestCid,z])).values()];if(!M.length)return;const F=f.storedContent.contains(document.activeElement)?document.
activeElement:null;W=!0,f.storedCancel.textContent="Stop deleting";try{await Te(async z=>{let K=0,ge=0,Le=0,ot;try{for(const Pt of M){
z.throwIfAborted(),f.storedStatus.textContent=`Deleting ${K+1} / ${M.length}: ${Pt.name}…`;const rr=await v.deleteStoredModel(
Pt.manifestCid,{signal:z});K++,rr.deleted&&ge++,Number.isSafeInteger(rr.freedBytes)&&rr.freedBytes>0&&(Le+=rr.freedBytes),
ye.delete(Pt.manifestCid),rr.unloaded&&(x.delete(`local:${Pt.manifestCid}`),Ht())}}catch(Pt){ot=Pt}be&&await be;const at=await Ye(
{preserveStatus:!0}),Mt=Le>0?` Freed ${xs(Le)}.`:"";if(ot){const Pt=new Error(`Completed ${K} of ${M.length} deletions.${Mt}\
 ${ot.message}`+(at?"":" Use Refresh to check the stored library."),{cause:ot});throw Pt.name=ot.name,Pt}if(!at)throw new Error(
"Deletion finished, but the stored library could not be refreshed. Use Refresh to check its state.");const Nt=M.length===
1?ge?`Deleted ${M[0].name}.`:"This model is no longer stored.":`Deleted ${ge} models.`+(ge<K?` ${K-ge} already absent.`:
"");f.storedStatus.textContent=Nt+Mt,$e(Nt,{quiet:!0})})}finally{W=!1,f.storedCancel.textContent="Stop loading",ee()&&(Ne(),
Ee(F))}}async function gt(A){!ee()||w||Ie||!A.loaded||await Te(async()=>{await v.unload(A.manifestCid),J(),x.delete(`loc\
al:${A.manifestCid}`),Ht(),await Ye(),ft(),$e(f.storedStatus.textContent=`Unloaded ${A.name}. Its files remain stored.`,
{quiet:!0})})}async function Tt(A){if(!(!ee()||w||Ie||!A.needsVerification)){Y=!0,f.storedCancel.textContent="Cancel ver\
ification";try{await Te(async M=>{L({stage:"verify"});try{await v.recoverStoredModel(A.manifestCid,{signal:M,onProgress:F=>{
M.aborted||L(F)}})}catch(F){throw await Ye(),F}M.throwIfAborted(),await Ye(),ft(),$e(f.storedStatus.textContent=`Verifie\
d ${A.name} from local files. You can now load it.`,{quiet:!0})})}finally{Y=!1,f.storedCancel.textContent="Stop loading",
ee()&&Ne()}}}async function vn(A){if(!ee()||w||Ie||!v.loadStoredModel)return;const M=[...new Map(A.filter(Vy).map(K=>[K.
manifestCid,K])).values()];if(!M.length)return;Y=!0;let F=!1,z=!1;try{await Te(async K=>{Ht();const ge=[];let Le=0,ot=!1;
try{for(const[at,Mt]of M.entries()){K.throwIfAborted(),f.loadingModel.textContent=M.length>1?`${at+1} / ${M.length} · ${Mt.
name}`:Mt.name,L({stage:"verify"});try{await v.loadStoredModel(Mt.manifestCid,{signal:K,onProgress:Nt=>{K.aborted||L(Nt)},
ggufGpuLayers:Number(f.gpuLayers.value)}),K.throwIfAborted(),Le++,ye.delete(Mt.manifestCid)}catch(Nt){const Pt=v.listResidentModels?.().
find(rr=>rr.manifestCid===Mt.manifestCid);if(Nt instanceof AggregateError||Pt&&!["ready","idle"].includes(Pt.status)||(K.
throwIfAborted(),Nt.name==="AbortError"))throw Nt;ge.push({model:Mt,error:Nt})}}}finally{ot=await Ye({signal:K}),z=K.aborted}
if(K.throwIfAborted(),!ot)throw new Error("Model loading finished, but the stored library could not be refreshed. Use Re\
fresh to check its state.");if(pt=v.getPreferredModelSourceKey?.()??pt,ft(),ge.length)throw new Error(M.length===1?ge[0].
error.message:`Loaded ${Le} of ${M.length} models. ${ge.map(({model:at,error:Mt})=>`${at.name}: ${Mt.message}`).join("; ")}`);
$e(f.storedStatus.textContent=M.length===1?`Loaded ${M[0].name}. Compatible tasks can now use it.`:`Loaded ${Le} models.\
 Compatible tasks can now use them.`,{quiet:!0}),F=!0},{modelName:M.length===1?M[0].name:`${M.length} selected models`})}finally{
Y=!1,ee()&&(Ne(),F&&!ye.size&&!d?(Ae?.close(),f.prompt.focus()):z&&Ye({preserveStatus:!0}))}}function fe(){R=null,f.attachment.
hidden=!0,f.attachmentImage.removeAttribute("src"),f.imageFile.value="",Ne()}try{v=await u({stateManager:e,computeManager:r,
networkManager:n,runtimeBaseUrl:o});const A=v.getPreferences();f.sharing.checked=A.sharing,f.hosting.checked=A.hostInference,
uo(),Ae=SP({container:f.panel,keepOpenOnAction:d,onConfigure:d?()=>f.configure.click():void 0,onDismiss:d?()=>qe.requestClose():
void 0,storedContent:f.storedContent,hasStoredModels:()=>pe.length>0||Ve.some(M=>M.source==="stored"),onStoredOpen:({signal:M}={})=>Ye(
{signal:M,quietCancellation:!0}),getSources:()=>Ve,getTargets:()=>nt,searchModels:M=>v.searchModelHub(M),inspectModel:(M,F)=>v.
inspectModelHub(M,F),findConversions:v.findModelConversions?(M,F)=>v.findModelConversions(M,F):void 0,getCompatibility:M=>M.
localAvailability??v.getModelCompatibility?.(M.package??M)??{status:"unknown",reason:"Local memory fit is unverified."},
onLoad:Me,onUsePeer(M){ft();const F=nt.find(K=>K.key===M&&K.available&&!K.local);if(!F){it(new Error("This inference hos\
t is no longer available. Refresh the model browser."));return}if(d){$e("This peer model is available to residents with \
network-assisted routing. Return to the world to chat.");return}const z=["automatic-speech-recognition","text-to-speech"].
includes(F.task);dn(z?"mixed":M).then(()=>f.prompt.focus()).catch(it),z&&$e("Mixed routing can use compatible peer speec\
h models. Use Talk or Speak replies.",{quiet:!0})},onSetup:Nr}),d&&(qe=AP({browser:Ae,onRequestClose:te}));for(const M of[
f.browse,f.modelsMenu])M.setAttribute("aria-controls",Ae.element.id);Ae.element.addEventListener("close",()=>{!d&&ee()&&
!f.panel.querySelector("dialog[open]")&&(document.activeElement===document.body||!document.activeElement?.getClientRects().
length)&&f.browse.focus()}),ft(),$e("Ready.",{quiet:!0})}catch(A){throw f.networkInfo.dispose(),f.panel.remove(),A}f.chatConfigure.
onclick=()=>{!ee()||ve||w||(f.chatOptionsStatus.textContent="",f.chatOptionsStatus.hidden=!0,f.networkInfo.close(),f.menuWindow.
close(),f.configuration.close(),f.about.close(),f.compatibility.close(),Ae?.close(),f.chatOptions.open||f.chatOptions.showModal())},
f.chatOptions.addEventListener("close",()=>{ee()&&!f.panel.querySelector("dialog[open]")&&(document.activeElement===document.
body||!document.activeElement?.getClientRects().length)&&f.chatConfigure.focus()}),f.configure.onclick=()=>{if(!(!ee()||
je)){if(qe){f.configurationStatus.textContent="",wi(),qe.show(f.configuration,{refreshStoredOnReturn:!0});return}f.networkInfo.
close(),f.chatOptions.close(),f.menuWindow.close(),f.about.close(),f.compatibility.close(),Ae?.close(),f.configurationStatus.
textContent="",f.configuration.showModal()}};function we(A={}){!ee()||ve||je||(qe&&qe.showLibrary(),f.networkInfo.close(),
f.chatOptions.close(),f.menuWindow.close(),f.about.close(),f.compatibility.close(),f.configuration.close(),Ae.open({selectedKey:pt,
...A}))}f.browse.onclick=f.modelsMenu.onclick=()=>we(),f.menu.onclick=()=>{!ee()||je||(f.networkInfo.close(),f.chatOptions.
close(),f.about.close(),f.compatibility.close(),f.configuration.close(),Ae?.close(),f.menuWindow.showModal())},f.aboutButton.
onclick=()=>{!ee()||je||(f.networkInfo.close(),f.chatOptions.close(),f.menuWindow.close(),f.about.showModal())};for(const A of[
f.menuWindow,f.configuration,f.about])A.addEventListener("close",()=>{ee()&&![f.loading,f.menuWindow,f.configuration,f.about,
f.compatibility,f.chatOptions,Ae.element].some(M=>M.open)&&document.activeElement!==f.prompt&&f.menu.focus()});if(p){const A=(M=p.
getState())=>{ee()&&(f.install.hidden=!1,f.install.disabled=M.installed||M.installing,f.install.textContent=M.installed?
"Installed":M.installing?"Installing…":"Install",f.menuStatus.textContent=String(M.instructions??"").slice(0,512))};A(),
Gt=p.subscribe?.(A),f.install.onclick=async()=>{if(!(!ee()||f.install.disabled))try{const M=await p.install();ee()&&(A(),
M.instructions&&(f.menuStatus.textContent=String(M.instructions).slice(0,512)))}catch(M){ee()&&(f.menuStatus.textContent=
"Installation unavailable: "+String(M.message).slice(0,256))}}}f.storedRefresh.onclick=()=>{Ye()},f.storedLoadSelected.onclick=
()=>{vn(pe.filter(A=>ye.has(A.manifestCid)))},f.storedDeleteSelected.onclick=()=>{At(pe.filter(A=>ye.has(A.manifestCid)))},
f.back.onclick=A=>{A.preventDefault(),ee()&&!f.leaveConfirmation.open&&(f.networkInfo.close(),f.chatOptions.close(),f.leaveConfirmation.
showModal())},f.stay.onclick=()=>{me||(f.leaveConfirmation.close(),f.back.focus())},f.leaveConfirmation.addEventListener(
"cancel",A=>{me&&A.preventDefault()}),f.leave.onclick=async()=>{if(f.leave.disabled)return;const A=f.back.href;me=!0,f.leave.
disabled=f.stay.disabled=!0,f.leaveStatus.textContent="Stopping models and closing connections…";try{await Fd(),g(A)}catch(M){
f.panel.inert=!1,f.leave.disabled=!1,f.leaveStatus.textContent=`Could not finish cleanup: ${M.message}. Click Leave to r\
etry.`,f.leaveConfirmation.open||f.leaveConfirmation.showModal(),f.leave.focus()}},f.helpBrowser.onchange=f.helpOs.onchange=
Be,f.helpConfig.onclick=()=>f.configure.click(),f.compatibility.addEventListener("close",()=>{Ct++,ee()&&!f.configuration.
open&&!Ae?.element.open&&!f.about.open&&!f.menuWindow.open&&!f.chatOptions.open&&f.browse.focus()}),f.helpCopy.onclick=async()=>{
const A=f.helpCommand.value;if(!A||!ee())return;const M=++Ct,F=()=>ee()&&(f.compatibility.open||qe?.isShowing(f.compatibility))&&
Ct===M;try{await navigator.clipboard.writeText(A),F()&&(f.helpStatus.textContent="Command copied.")}catch{F()&&(f.helpCommand.
focus(),f.helpCommand.select(),f.helpStatus.textContent="Clipboard unavailable. Select and copy the command above.")}},f.
cpuBudget.onchange=f.gpuBudget.onchange=fo,f.target.onchange=()=>{f.chatOptionsStatus.textContent="",f.chatOptionsStatus.
hidden=!0,dn(f.target.value).catch(it)},f.resumeAgent.onclick=()=>{const A=br(f.target.value);!A||w||Te(async M=>{await(await ln()).
resume(A),M.throwIfAborted(),$e("Agent ready. Send a message.",{quiet:!0})})},f.generateImage.onchange=()=>{Ht(),Ne()},f.
speakReplies.onchange=Ne,f.prompt.oninput=Ne;for(const[A,M]of[[f.sharing,"setSharing"],[f.hosting,"setHostInference"]])A.
onchange=()=>{if(!ee())return;const F=A.checked;A.disabled=!0;const z=(async()=>{try{await v[M](F),ee()&&(f.configurationStatus.
textContent="Preferences updated.")}catch(K){A.checked=!F,it(K)}finally{ee()&&(A.disabled=!1)}})();S.add(z),z.finally(()=>S.
delete(z))};async function Me(A){if(!ee()||w)return;const M=typeof A=="string"?A:A?.key;Ve=v.listModelSources();let F=M?
Ve.find(K=>K.key===M)??(wt?.key===M?wt:null):A;if(!F){cn();return}F.package&&(F={...F,localAvailability:v.getModelCompatibility(
F.package)});const z=!F.key&&F.model&&Array.isArray(F.files);if(z&&(F=wt={...F,key:`hub:${F.id}`,source:"hf",package:F,localAvailability:v.
getModelCompatibility(F)}),Ue(F)){Nr(F);return}return pt=F.key,z&&Ve.push(F),cn(),Te(async K=>{Ht(),L({stage:"prepare"});
const ge={signal:K,onProgress:ot=>{K.aborted||L(ot)},ggufGpuLayers:Number(f.gpuLayers.value)};F.package?await v.acquireHubModel(
F.package,ge):await v.acquireModel(F.key,ge),K.throwIfAborted(),pt=v.getPreferredModelSourceKey?.()??pt,wt=null,ft(),Ne();
const Le=!!v.getSharingErrors?.().length;$e(Le?"Model ready. Sharing is unavailable for some stored models; see Models →\
 Stored models.":d?"Model ready. Return to the world to use it.":"Model ready. Send a message.",{quiet:!Le})},{modelName:F.
name})}f.unload.onclick=()=>Te(async()=>{Ht(),await v.unload(),J();for(const A of x.keys())(A==="local"||A.startsWith("l\
ocal:"))&&x.delete(A);$e("Local models unloaded. Stored files are kept.",{quiet:!0}),f.configurationStatus.textContent=f.
status.textContent}),f.clearChat.onclick=()=>{!ee()||w||br(f.target.value)||(x.clear(),Ht(),f.transcript.replaceChildren(
f.empty),y.prune(),$e(f.configurationStatus.textContent="Conversation cleared. Ready for a new message.",{quiet:!0}))},f.
connect.onclick=()=>Te(async A=>{f.relay.value.trim()?await v.connect(f.relay.value.trim(),{signal:A}):await v.connectBackend(
{signal:A}),await On()}),f.file.onchange=()=>Te(async A=>{const M=f.file.files[0];M&&(await v.store.importFile(M.stream(),
{expectedSize:M.size,pin:!0,signal:A}),$e("Pinned "+M.name+" locally.",{quiet:!0}),f.file.value="")}),f.attach.onclick=()=>f.
imageFile.click();async function kt(A,{signal:M}={}){if(!A||!ee())return;N?.abort();const F=new AbortController;N=F;const z=M?
AbortSignal.any([F.signal,M]):F.signal;D=!0,Ne();try{const K=await hP(A,{signal:z});if(!ee()||z.aborted)return;R=K,f.attachmentImage.
src=K.preview,f.attachmentName.textContent=K.name,f.attachment.hidden=!1,Ne(),f.prompt.focus()}catch(K){z.aborted||it(K)}finally{
N===F&&(D=!1,ee()&&Ne())}}ae=gP({textarea:f.prompt,onFile:kt,onError:it,onPendingChange:A=>{A&&N?.abort(),le=A,ee()&&Ne()},
canAccept:()=>ee()?w||se?"Wait for the current chat operation to finish.":f.generateImage.checked?"Uncheck Generate imag\
e to attach an image for a vision model.":Wt(yr("image-text-to-text"),"image-text-to-text")||"Choose Mixed or a loaded l\
ocal or peer vision model to attach an image.":"This chat is closing."}),f.imageFile.onchange=()=>{ae.cancel(),kt(f.imageFile.
files[0])},f.removeAttachment.onclick=()=>{ae.cancel(),N?.abort(),fe()},f.cancel.onclick=()=>{if(je){V();return}w?.abort(
new DOMException("User cancelled","AbortError")),St.active&&dt?.cancel().catch(it),Y&&(f.storedStatus.textContent="Cance\
lling verification… Waiting for cleanup."),W&&(f.storedStatus.textContent="Cancelling deletion… Waiting for cleanup."),
Ne(),C&&v.cancel(C).catch(it),O&&_?.cancel(O).catch(it)},f.loadingCancel.onclick=V,f.loading.addEventListener("cancel",A=>{
A.preventDefault(),V()}),f.storedCancel.onclick=()=>f.cancel.click();const Tr=A=>A&&typeof A.local=="boolean"?`${A.local?
"Local":"Peer"} · ${String(A.modelName??A.manifestCid??"model").slice(0,180)}`:null;function Gs(A,M){St=A,ee()&&(!M?.aborted&&
A.status!=="idle"&&A.status!=="closed"&&$e({"requesting-microphone":"Waiting for microphone permission…",recording:"Li\
stening… press Stop recording to send.",transcribing:"Transcribing voice…",synthesizing:"Preparing spoken reply…",
playing:"Speaking…"}[A.status]??A.status),Ne())}async function ho(A){!dt&&!ut&&(ut=(async()=>{st=await b();try{return dt=
await m({audio:st,execute:async(F,z)=>{if(G){const ge=await(await ln()).speechTarget(G,{signal:z.signal});F=F==="local-o\
nly"||ge==="local-only"?"local-only":"mixed"}const K=z.requestId??crypto.randomUUID();C=K;try{return await v.generate(F,
{...z,requestId:K})}finally{C===K&&(C=null)}}}),dt}catch(F){throw await st?.dispose(),st=null,F}})().finally(()=>{ut=null}));
const M=dt??await ut;return A?.throwIfAborted(),M}function rc(A){if(!ee()||w?.signal.aborted)return;const M=Tr(A.route??
(A.type==="routing"||A.type==="route"?A:null));M&&$e(`${St.status==="transcribing"?"Speech recognition":"Speech"} · ${M}`)}
async function ym(A,{text:M=f.prompt.value.trim(),preserveDraft:F=!1}={}){const z=yr(),K=z?.key??f.target.value,ge=z?.agentId,
Le=Rr(),ot=Le==="text-to-image",at=R;if(ot&&at)throw new Error("Remove the attached image or uncheck Generate image.");if(!Wt(
z,Le))throw new Error("No compatible model is available. Load one in Models or choose another target.");if(!$r(z,Le))throw new Error(
"Compatible models have no available queue capacity. Wait for capacity or choose another target.");if(at&&!z.modalities?.
includes("image"))throw new Error("This model accepts text only. Remove the image or choose an image model.");if(Ht(),ge){
const Pr=await ln(),lt=await Pr.get(ge,{signal:A}),Qe=Qr(lt);if(Qe)throw new Error(Qe)}const Mt=ot||ge?null:await s?.({includeImage:!1}),
Nt=(typeof Mt=="string"?Mt:Mt?.text??"").slice(0,16e3),Pt=ot||ge?"":String(i?.instructions??"").slice(0,8e3),rr=at||ge?[]:
x.get(K)??[],Ke=M||"Describe this image.",nc=ot?void 0:[...Nt||Pt?[{role:"system",content:Nt+`
`+Pt}]:[],...rr.slice(-6),{role:"user",content:Ke}];ff(f,"user",M,{image:at?.preview});const Jr=ff(f,"assistant","",{targetName:z.
automatic?"Choosing model…":z.name}),po=Pr=>{const lt=Tr(Pr);!lt||!ee()||A.aborted||(Jr.parentElement.querySelector(".\
pc-chat-speaker").textContent=ge?`Agent · ${z.name} · ${lt}`:lt,Jr.parentElement.dataset.routeTarget=String(Pr.target??
"").slice(0,256),$e(`Using ${lt}`))};F||(f.prompt.value=""),fe(),wr(),C=ge?null:crypto.randomUUID(),O=ge,G=ge,$e("Choosi\
ng a compatible model…");try{const Pr={onProgress(Qe){po(Qe.route??(["route","routing","accepted"].includes(Qe.type)?Qe:
null)),ee()&&ot&&Number.isSafeInteger(Qe.step)&&Number.isSafeInteger(Qe.steps)&&Qe.step>=0&&Qe.step<=Qe.steps&&Qe.steps<=
100&&$e(`Generating image: ${Qe.step}/${Qe.steps} steps…`)},onToken(Qe){ee()&&!A.aborted&&!ot&&(Jr.textContent+=Qe,wr())}},
lt=ge?await _.run(ge,{signal:A,task:Le,prompt:Ke,...at?{image:at.image}:{},maxNewTokens:1024,...Pr}):await v.generate(K,
{requestId:C,signal:A,task:Le,...ot?{prompt:M}:{messages:nc,image:at?.image,maxNewTokens:1024},...Pr});if(A.aborted)throw new DOMException(
"Generation cancelled","AbortError");if(po(lt.route),ot){if(!z.outputModalities?.includes("image"))throw new Error("This\
 target did not advertise image output");await y.append(Jr,lt.image,{signal:A,prompt:M})}else{if(typeof lt.text!="string")
throw new Error("Model returned an invalid text response");if(Jr.textContent=lt.text,!ge){for(rr.push({role:"user",content:Ke},
{role:"assistant",content:lt.text});rr.length>6||k.encode(JSON.stringify(rr)).byteLength>24*1024;)rr.splice(0,2);x.delete(
K),x.set(K,rr),x.size>8&&x.delete(x.keys().next().value)}}if($e("Ready.",{quiet:!0}),!ot){const Qe=[];if(lt.finishReason===
"length"?Qe.push("Response reached the model’s output or context limit and may be incomplete."):lt.finishReason!=="sto\
p"&&Qe.push("The model did not report whether this response is complete."),lt.contextTruncated&&Qe.push("Older conversat\
ion turns were omitted to fit the model’s context."),Qe.length){const un=document.createElement("p");un.className="pc-\
inference-note",un.textContent=Qe.join(" "),Jr.after(un),$e(Qe.join(" "))}}try{for(const Qe of(ot?[]:i?.propose(lt.text)??
[]).slice(0,4)){const un=document.createElement("button");un.type="button",un.textContent="Apply: "+Qe.label,un.onclick=
async()=>{un.disabled=!0;try{await Qe.apply()}catch(zd){it(zd)}},f.proposed.append(un)}}catch{}if(!ot&&f.speakReplies.checked&&
lt.text.trim())try{const Qe=await ho(A),un=ge?await _.speechTarget(ge,{signal:A}):K;await Qe.speak(lt.text,{target:un,signal:A,
onProgress:rc,onState:zd=>Gs(zd,A)}),A.throwIfAborted(),$e("Ready.",{quiet:!0})}catch(Qe){A.throwIfAborted(),$e(`Text re\
ply received. Voice: ${Qe.message}. Load a speech-synthesis model in Models or use a compatible peer.`)}return lt}catch(Pr){
throw Jr.textContent||(Jr.textContent=Pr.name==="AbortError"?"Cancelled.":"Request failed."),Pr}finally{C=null,O=null,G=
null,wr()}}async function wm(){f.send.disabled||await Te(A=>ym(A))}f.send.onclick=()=>{wm()},f.talk.onclick=()=>{if(!(!ee()||
f.talk.disabled)){if(St.recording||St.status==="requesting-microphone"){Promise.resolve().then(()=>dt.stop()).catch(it);
return}Te(async A=>{const M=f.target.value||"mixed";G=br(M);const F=G?await(await ln()).speechTarget(G,{signal:A}):M,z=await ho(
A);let K,ge;try{ge=await z.record({target:F,signal:A,onProgress:rc,onState:Le=>{Le.status!=="idle"&&(K=Le.status),Gs(Le,
A)}})}catch(Le){throw A.throwIfAborted(),K==="transcribing"?new Error(`${Le.message}. Load a speech-recognition model in\
 Models or use a compatible peer.`,{cause:Le}):Le}if(A.throwIfAborted(),!ge.text?.trim())throw new Error("No speech reco\
gnized. Try again or type a message.");await ym(A,{text:ge.text.trim(),preserveDraft:!0})})}},f.agents.onclick=()=>{!ee()||
f.agents.disabled||(Cr=(async()=>{try{const A=await v.getAgentController();if(!ee())return;await ln(),Dr??=RP({container:f.
panel,controller:A,onChat:async M=>{await _.refresh(),ft(),await dn(`agent:${M}`),requestAnimationFrame(()=>{ee()&&f.prompt.
focus()})},onBrowseModels:()=>{ee()&&f.browse.click()}}),f.networkInfo.close(),f.chatOptions.close(),f.menuWindow.close(),
f.configuration.close(),Ae?.close(),f.about.close(),f.compatibility.close(),await Dr.open({selectedId:br(f.target.value)})}catch(A){
it(A)}})().finally(()=>{Cr=null,ee()&&Ne()}),Ne())},f.prompt.onkeydown=A=>{A.key==="Enter"&&!A.shiftKey&&!A.isComposing&&
(A.preventDefault(),wm())};const vm=(async()=>{const A=await Ye();if(ee()){if(ve=!1,Ne(),d){Ae.open({tab:!A||pe.length?"\
stored":"browse",refreshStored:!1,selectedKey:pt});return}if(!A||pe.length){Ae.open({tab:"stored",refreshStored:!1,selectedKey:pt}),
A&&$e("Choose stored models to load, or close the library to use peers.",{quiet:!0});return}try{const M=v.getStartupModel?.();
M&&(pt=M.sourceKey,cn(),M.manifestCid?$e("The remembered model is no longer in the stored library. Choose a model to loa\
d."):Ue(M)?$e(M.needsVerification?`${M.name} is saved but needs local verification. Open Models → Stored models → Verify\
 locally. No model download has started.`:`Cannot load ${M.name}: ${an(M)}`):Te(async F=>{L({stage:"prepare"});const z={
signal:F,onProgress:K=>{F.aborted||L(K)},ggufGpuLayers:Number(f.gpuLayers.value)};await v.acquireModel(M.sourceKey,z),F.
throwIfAborted(),ft(),$e(`Loaded ${M.name}. Send a message.`,{quiet:!0})},{modelName:M.name}))}catch(M){it(M)}}})();if(Ir=
setInterval(()=>{On(),_?.refresh().catch(it)},Math.max(20,h)),!d&&v.getAgentController&&ln().catch(A=>{ee()&&it(A)}),l&&
!v.networkReady){const A=new AbortController;ue=A,he=v.connectBackend({signal:A.signal}).then(()=>On()).catch(M=>{ee()&&
!A.signal.aborted&&(ze=M)}).finally(()=>{ue===A&&(ue=null),ee()&&wn()})}else On();async function Fd(){if(clearInterval(Rt),
Rt=null,!P){if(Z)return Z;if(j=!0,f.networkInfo.dispose(),f.chatOptions.close(),qe){Ae.setBusy(!0),Ae.setFeedback("Closi\
ng Models… Waiting for cleanup.");for(const A of f.storedContent.querySelectorAll("button,input"))A.disabled=!0}else Ae?.
dispose(),f.panel.inert=!0;Gt?.(),y.dispose(),f.menuWindow.close(),f.compatibility.close(),f.configuration.close(),f.about.
close(),Z=(async()=>{clearInterval(Ir),w?.abort("Chat closed"),ie?.abort(),N?.abort(),q?.abort(),ue?.abort(),Ie?.abort(),
await ae?.dispose(),await _?.dispose(),Ht(),await I,await X,await he,await be,await vm,await Promise.allSettled([...S]),
await Cr,await B?.catch(()=>{}),await ke,await Dr?.dispose(),await ut,await dt?.dispose(),await v.dispose(),P=!0,Ae?.dispose(),
x.clear(),R=null,f.panel.remove(),a?.()})();try{await Z}catch(A){throw qe&&(qe.showLibrary(),Ae.setBusy(!0),Ae.setFeedback(
`Could not close Models: ${A.message}. Click Done to retry.`)),A}finally{Z=null}}}return{element:f.panel,runtime:v,dispose:Fd,
refreshPeers:On,startupReady:vm,openModels:we}}function NP({scope:t=globalThis,onChange:e}={}){const r=new Set(e?[e]:[]),
n=t.matchMedia?.("(display-mode: standalone)");let s=n?.matches===!0||t.navigator?.standalone===!0,i=null,o=!1,a=!1;const c=t.
isSecureContext===!0,l="onbeforeinstallprompt"in t,d=()=>s?"PeerCompute is installed on this device.":c?/iPad|iPhone|iPod/.
test(t.navigator?.userAgent??"")?"In Safari, open Share, then Add to Home Screen. The app shell can open offline; models\
 remain managed by the browser’s storage.":"Use your browser’s Install app or Add to Home Screen menu, if available. T\
he app shell can open offline; downloading models and peer connections need a network.":"Open this console over HTTPS to\
 install it.",u=()=>Object.freeze({supported:c&&l,available:c&&!!i&&!s&&!o&&!a,installed:s,installing:o,instructions:d()}),
h=()=>{if(a)return;const g=u();for(const f of r)try{f(g)}catch{}},p=g=>{!c||s||a||typeof g.prompt!="function"||(g.preventDefault(),
i=g,h())},m=()=>{s=!0,i=null,o=!1,h()},b=()=>{s=n?.matches===!0||t.navigator?.standalone===!0,h()};return t.addEventListener?.(
"beforeinstallprompt",p),t.addEventListener?.("appinstalled",m),n?.addEventListener?.("change",b),Object.freeze({getState:u,
subscribe(g){if(typeof g!="function")throw new TypeError("Install listener must be a function");return a?()=>{}:(r.add(g),
g(u()),()=>r.delete(g))},async install(){if(s)return{outcome:"installed"};if(!i||o||a||!c)return{outcome:"unavailable",instructions:d()};
const g=i;i=null,o=!0,h();try{const f=await g.prompt();return{outcome:(g.userChoice?await g.userChoice:f)?.outcome==="ac\
cepted"?"accepted":"dismissed"}}finally{o=!1,h()}},dispose(){a||(a=!0,i=null,r.clear(),t.removeEventListener?.("beforein\
stallprompt",p),t.removeEventListener?.("appinstalled",m),n?.removeEventListener?.("change",b))}})}async function PP({scope:t=globalThis}={}){
if(!t.isSecureContext||!t.navigator?.serviceWorker)return null;const e=new URL("./",t.location.href),r=new URL("pages-is\
olation-sw.js",e).href,n=t.navigator.serviceWorker;return n.controller&&n.controller.scriptURL!==r?null:n.register(r,{scope:e.
href,type:"module",updateViaCache:"none"})}const bm=NP();window.inferencePwa=bm;PP().catch(()=>{});window.addEventListener(
"pagehide",t=>{t.persisted||bm.dispose()});async function OP(){try{window.inferencePanel=await $P({container:document.querySelector(
"#panel"),autoConnect:!0,pwaInstallController:bm})}catch(t){const e=document.createElement("p");e.textContent=t.message,
document.querySelector("#panel").append(e)}}OP();const H9=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,
{value:"Module"}));export{e9 as $,n9 as A,li as B,fy as C,R9 as D,g9 as E,b9 as F,QT as G,w6 as H,aN as I,m9 as J,zr as K,gM as L,Se as M,h9 as N,
yM as O,$d as P,M9 as Q,T9 as R,f9 as S,cs as T,$s as U,fE as V,YO as W,XO as X,sm as Y,pE as Z,t9 as _,Ql as a,a9 as a$,
ZO as a0,Dn as a1,uv as a2,S9 as a3,E9 as a4,x9 as a5,p9 as a6,c9 as a7,PN as a8,cM as a9,r9 as aA,Qn as aB,J1 as aC,F7 as aD,
om as aE,gE as aF,bE as aG,c$ as aH,z7 as aI,mE as aJ,Od as aK,kE as aL,SE as aM,xE as aN,as as aO,Da as aP,q7 as aQ,j7 as aR,
Zn as aS,rm as aT,oE as aU,Qu as aV,KO as aW,HO as aX,WO as aY,on as aZ,XT as a_,YT as aa,w9 as ab,RE as ac,y9 as ad,I9 as ae,
C9 as af,_9 as ag,s9 as ah,l9 as ai,D9 as aj,A9 as ak,Vt as al,Vn as am,i9 as an,v9 as ao,L7 as ap,$9 as aq,s1 as ar,Z1 as as,
Y1 as at,Ho as au,Vi as av,Ut as aw,Nd as ax,Pd as ay,vh as az,ws as b,nm as b0,v6 as b1,L0 as b2,qa as b3,xO as b4,Bv as b5,
nM as b6,GN as b7,S0 as b8,Ps as b9,Ea as ba,It as bb,zN as bc,of as bd,F9 as be,z9 as bf,Qc as bg,W9 as bh,q9 as bi,Nh as bj,
P9 as bk,mm as bl,G9 as bm,j9 as bn,FN as bo,O9 as bp,N9 as bq,U9 as br,qN as bs,H9 as bt,CE as c,r1 as d,oN as e,u9 as f,
cN as g,L9 as h,d9 as i,B9 as j,RN as k,Ud as l,MN as m,La as n,Xa as o,nn as p,uy as q,n1 as r,GO as s,VO as t,QO as u,
RD as v,JO as w,o9 as x,Zp as y,jO as z};
