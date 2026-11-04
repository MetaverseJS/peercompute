const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./modelTask-unobKtl8.js","./GgufArtifactReader-D-AKJ8ex.js","./runtimeDefinition-CuF6Fycr.js","./index-BbhYZWtV.js","./modelTask-_nqpry9E.js","./runtimeDefinition-V89Xz8gA.js","./ModelInferenceService-Gy9kAP4d.js","./NetworkManager-Ca7bkWsa.js"])))=>i.map(i=>d[i]);
import{_ as Et}from"./index-BbhYZWtV.js";const Ot=()=>new Map,hl=r=>{const e=Ot();return r.forEach((t,n)=>{e.set(n,t)}),
e},nn=(r,e,t)=>{let n=r.get(e);return n===void 0&&r.set(e,n=t()),n},Hy=(r,e)=>{const t=[];for(const[n,s]of r)t.push(e(s,
n));return t},Ky=(r,e)=>{for(const[t,n]of r)if(e(n,t))return!0;return!1},Hn=()=>new Set,tc=r=>r[r.length-1],Qy=(r,e)=>{for(let t=0;t<
e.length;t++)r.push(e[t])},Yr=Array.from,bu=(r,e)=>{for(let t=0;t<r.length;t++)if(!e(r[t],t,r))return!1;return!0},Kp=(r,e)=>{
for(let t=0;t<r.length;t++)if(e(r[t],t,r))return!0;return!1},Jy=(r,e)=>{const t=new Array(r);for(let n=0;n<r;n++)t[n]=e(
n,t);return t},ya=Array.isArray;class yu{constructor(){this._observers=Ot()}on(e,t){nn(this._observers,e,Hn).add(t)}once(e,t){
const n=(...s)=>{this.off(e,n),t(...s)};this.on(e,n)}off(e,t){const n=this._observers.get(e);n!==void 0&&(n.delete(t),n.
size===0&&this._observers.delete(e))}emit(e,t){return Yr((this._observers.get(e)||Ot()).values()).forEach(n=>n(...t))}destroy(){
this._observers=Ot()}}const Jt=Math.floor,io=Math.abs,Qp=(r,e)=>r<e?r:e,bn=(r,e)=>r>e?r:e,Jp=r=>r!==0?r<0:1/r<0,Fd=1,Od=2,
rc=4,nc=8,Xs=32,mr=64,xt=128,wa=31,fl=63,on=127,Xy=2147483647,Ao=Number.MAX_SAFE_INTEGER,zd=Number.MIN_SAFE_INTEGER,Yy=Number.
isInteger||(r=>typeof r=="number"&&isFinite(r)&&Jt(r)===r),Zy=String.fromCharCode,ew=r=>r.toLowerCase(),tw=/^\s*/g,rw=r=>r.
replace(tw,""),nw=/([A-Z])/g,qd=(r,e)=>rw(r.replace(nw,t=>`${e}${ew(t)}`)),sw=r=>{const e=unescape(encodeURIComponent(r)),
t=e.length,n=new Uint8Array(t);for(let s=0;s<t;s++)n[s]=e.codePointAt(s);return n},Ys=typeof TextEncoder<"u"?new TextEncoder:
null,iw=r=>Ys.encode(r),ow=Ys?iw:sw;let Gs=typeof TextDecoder>"u"?null:new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});
Gs&&Gs.decode(new Uint8Array).length===1&&(Gs=null);const aw=(r,e)=>Jy(e,()=>r).join("");let ki=class{constructor(){this.
cpos=0,this.cbuf=new Uint8Array(100),this.bufs=[]}};const ka=()=>new ki,cw=r=>{let e=r.cpos;for(let t=0;t<r.bufs.length;t++)
e+=r.bufs[t].length;return e},Qt=r=>{const e=new Uint8Array(cw(r));let t=0;for(let n=0;n<r.bufs.length;n++){const s=r.bufs[n];
e.set(s,t),t+=s.length}return e.set(new Uint8Array(r.cbuf.buffer,0,r.cpos),t),e},lw=(r,e)=>{const t=r.cbuf.length;t-r.cpos<
e&&(r.bufs.push(new Uint8Array(r.cbuf.buffer,0,r.cpos)),r.cbuf=new Uint8Array(bn(t,e)*2),r.cpos=0)},Le=(r,e)=>{const t=r.
cbuf.length;r.cpos===t&&(r.bufs.push(r.cbuf),r.cbuf=new Uint8Array(t*2),r.cpos=0),r.cbuf[r.cpos++]=e},pl=Le,re=(r,e)=>{for(;e>
on;)Le(r,xt|on&e),e=Jt(e/128);Le(r,on&e)},wu=(r,e)=>{const t=Jp(e);for(t&&(e=-e),Le(r,(e>fl?xt:0)|(t?mr:0)|fl&e),e=Jt(e/
64);e>0;)Le(r,(e>on?xt:0)|on&e),e=Jt(e/128)},ml=new Uint8Array(3e4),uw=ml.length/3,dw=(r,e)=>{if(e.length<uw){const t=Ys.
encodeInto(e,ml).written||0;re(r,t);for(let n=0;n<t;n++)Le(r,ml[n])}else gt(r,ow(e))},hw=(r,e)=>{const t=unescape(encodeURIComponent(
e)),n=t.length;re(r,n);for(let s=0;s<n;s++)Le(r,t.codePointAt(s))},$n=Ys&&Ys.encodeInto?dw:hw,Ea=(r,e)=>{const t=r.cbuf.
length,n=r.cpos,s=Qp(t-n,e.length),i=e.length-s;r.cbuf.set(e.subarray(0,s),n),r.cpos+=s,i>0&&(r.bufs.push(r.cbuf),r.cbuf=
new Uint8Array(bn(t*2,i)),r.cbuf.set(e.subarray(s)),r.cpos=i)},gt=(r,e)=>{re(r,e.byteLength),Ea(r,e)},ku=(r,e)=>{lw(r,e);
const t=new DataView(r.cbuf.buffer,r.cpos,e);return r.cpos+=e,t},fw=(r,e)=>ku(r,4).setFloat32(0,e,!1),pw=(r,e)=>ku(r,8).
setFloat64(0,e,!1),mw=(r,e)=>ku(r,8).setBigInt64(0,e,!1),jd=new DataView(new ArrayBuffer(4)),gw=r=>(jd.setFloat32(0,r),jd.
getFloat32(0)===r),Zs=(r,e)=>{switch(typeof e){case"string":Le(r,119),$n(r,e);break;case"number":Yy(e)&&io(e)<=Xy?(Le(r,
125),wu(r,e)):gw(e)?(Le(r,124),fw(r,e)):(Le(r,123),pw(r,e));break;case"bigint":Le(r,122),mw(r,e);break;case"object":if(e===
null)Le(r,126);else if(ya(e)){Le(r,117),re(r,e.length);for(let t=0;t<e.length;t++)Zs(r,e[t])}else if(e instanceof Uint8Array)
Le(r,116),gt(r,e);else{Le(r,118);const t=Object.keys(e);re(r,t.length);for(let n=0;n<t.length;n++){const s=t[n];$n(r,s),
Zs(r,e[s])}}break;case"boolean":Le(r,e?120:121);break;default:Le(r,127)}};class Gd extends ki{constructor(e){super(),this.
w=e,this.s=null,this.count=0}write(e){this.s===e?this.count++:(this.count>0&&re(this,this.count-1),this.count=1,this.w(this,
e),this.s=e)}}const Wd=r=>{r.count>0&&(wu(r.encoder,r.count===1?r.s:-r.s),r.count>1&&re(r.encoder,r.count-2))};class oo{constructor(){
this.encoder=new ki,this.s=0,this.count=0}write(e){this.s===e?this.count++:(Wd(this),this.count=1,this.s=e)}toUint8Array(){
return Wd(this),Qt(this.encoder)}}const Vd=r=>{if(r.count>0){const e=r.diff*2+(r.count===1?0:1);wu(r.encoder,e),r.count>
1&&re(r.encoder,r.count-2)}};class sc{constructor(){this.encoder=new ki,this.s=0,this.count=0,this.diff=0}write(e){this.
diff===e-this.s?(this.s=e,this.count++):(Vd(this),this.count=1,this.diff=e-this.s,this.s=e)}toUint8Array(){return Vd(this),
Qt(this.encoder)}}class bw{constructor(){this.sarr=[],this.s="",this.lensE=new oo}write(e){this.s+=e,this.s.length>19&&(this.
sarr.push(this.s),this.s=""),this.lensE.write(e.length)}toUint8Array(){const e=new ki;return this.sarr.push(this.s),this.
s="",$n(e,this.sarr.join("")),Ea(e,this.lensE.toUint8Array()),Qt(e)}}const yr=r=>new Error(r),zt=()=>{throw yr("Method u\
nimplemented")},Dt=()=>{throw yr("Unexpected case")},Xp=yr("Unexpected end of array"),Yp=yr("Integer out of Range");let xa=class{constructor(e){
this.arr=e,this.pos=0}};const rs=r=>new xa(r),yw=r=>r.pos!==r.arr.length,ww=(r,e)=>{const t=new Uint8Array(r.arr.buffer,
r.pos+r.arr.byteOffset,e);return r.pos+=e,t},bt=r=>ww(r,te(r)),Kn=r=>r.arr[r.pos++],te=r=>{let e=0,t=1;const n=r.arr.length;
for(;r.pos<n;){const s=r.arr[r.pos++];if(e=e+(s&on)*t,t*=128,s<xt)return e;if(e>Ao)throw Yp}throw Xp},Eu=r=>{let e=r.arr[r.
pos++],t=e&fl,n=64;const s=(e&mr)>0?-1:1;if((e&xt)===0)return s*t;const i=r.arr.length;for(;r.pos<i;){if(e=r.arr[r.pos++],
t=t+(e&on)*n,n*=128,e<xt)return s*t;if(t>Ao)throw Yp}throw Xp},kw=r=>{let e=te(r);if(e===0)return"";{let t=String.fromCodePoint(
Kn(r));if(--e<100)for(;e--;)t+=String.fromCodePoint(Kn(r));else for(;e>0;){const n=e<1e4?e:1e4,s=r.arr.subarray(r.pos,r.
pos+n);r.pos+=n,t+=String.fromCodePoint.apply(null,s),e-=n}return decodeURIComponent(escape(t))}},Ew=r=>Gs.decode(bt(r)),
Nn=Gs?Ew:kw,xu=(r,e)=>{const t=new DataView(r.arr.buffer,r.arr.byteOffset+r.pos,e);return r.pos+=e,t},xw=r=>xu(r,4).getFloat32(
0,!1),vw=r=>xu(r,8).getFloat64(0,!1),Sw=r=>xu(r,8).getBigInt64(0,!1),Aw=[r=>{},r=>null,Eu,xw,vw,Sw,r=>!1,r=>!0,Nn,r=>{const e=te(
r),t={};for(let n=0;n<e;n++){const s=Nn(r);t[s]=ei(r)}return t},r=>{const e=te(r),t=[];for(let n=0;n<e;n++)t.push(ei(r));
return t},bt],ei=r=>Aw[127-Kn(r)](r);class Hd extends xa{constructor(e,t){super(e),this.reader=t,this.s=null,this.count=
0}read(){return this.count===0&&(this.s=this.reader(this),yw(this)?this.count=te(this)+1:this.count=-1),this.count--,this.
s}}class ao extends xa{constructor(e){super(e),this.s=0,this.count=0}read(){if(this.count===0){this.s=Eu(this);const e=Jp(
this.s);this.count=1,e&&(this.s=-this.s,this.count=te(this)+2)}return this.count--,this.s}}class ic extends xa{constructor(e){
super(e),this.s=0,this.count=0,this.diff=0}read(){if(this.count===0){const e=Eu(this),t=e&1;this.diff=Jt(e/2),this.count=
1,t&&(this.count=te(this)+2)}return this.s+=this.diff,this.count--,this.s}}class _w{constructor(e){this.decoder=new ao(e),
this.str=Nn(this.decoder),this.spos=0}read(){const e=this.spos+this.decoder.read(),t=this.str.slice(this.spos,e);return this.
spos=e,t}}const Iw=crypto.getRandomValues.bind(crypto),Zp=()=>Iw(new Uint32Array(1))[0],Cw="10000000-1000-4000-8000"+-1e11,
Tw=()=>Cw.replace(/[018]/g,r=>(r^Zp()&15>>r/4).toString(16)),Qn=r=>new Promise(r);Promise.all.bind(Promise);const Kd=r=>r===
void 0?null:r;class Mw{constructor(){this.map=new Map}setItem(e,t){this.map.set(e,t)}getItem(e){return this.map.get(e)}}
let em=new Mw,Rw=!0;try{typeof localStorage<"u"&&localStorage&&(em=localStorage,Rw=!1)}catch{}const Bw=em,ti=Symbol("Equ\
ality"),tm=(r,e)=>r===e||!!r?.[ti]?.(e)||!1,Lw=r=>typeof r=="object",Dw=Object.assign,Pw=Object.keys,_o=r=>Pw(r).length,
$w=r=>{for(const e in r)return!1;return!0},Ei=(r,e)=>{for(const t in r)if(!e(r[t],t))return!1;return!0},vu=(r,e)=>Object.
prototype.hasOwnProperty.call(r,e),Nw=(r,e)=>r===e||_o(r)===_o(e)&&Ei(r,(t,n)=>(t!==void 0||vu(e,n))&&tm(e[n],t)),Su=(r,e,t=0)=>{
try{for(;t<r.length;t++)r[t](...e)}finally{t<r.length&&Su(r,e,t+1)}},co=(r,e)=>{if(r===e)return!0;if(r==null||e==null||r.
constructor!==e.constructor&&(r.constructor||Object)!==(e.constructor||Object))return!1;if(r[ti]!=null)return r[ti](e);switch(r.
constructor){case ArrayBuffer:r=new Uint8Array(r),e=new Uint8Array(e);case Uint8Array:{if(r.byteLength!==e.byteLength)return!1;
for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;break}case Set:{if(r.size!==e.size)return!1;for(const t of r)if(!e.has(
t))return!1;break}case Map:{if(r.size!==e.size)return!1;for(const t of r.keys())if(!e.has(t)||!co(r.get(t),e.get(t)))return!1;
break}case void 0:case Object:if(_o(r)!==_o(e))return!1;for(const t in r)if(!vu(r,t)||!co(r[t],e[t]))return!1;break;case Array:
if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(!co(r[t],e[t]))return!1;break;default:return!1}return!0},Uw=(r,e)=>e.
includes(r);var rm={};const ri=typeof process<"u"&&process.release&&/node|io\.js/.test(process.release.name)&&Object.prototype.
toString.call(typeof process<"u"?process:0)==="[object process]";let Gt;const Fw=()=>{if(Gt===void 0)if(ri){Gt=Ot();const r=process.
argv;let e=null;for(let t=0;t<r.length;t++){const n=r[t];n[0]==="-"?(e!==null&&Gt.set(e,""),e=n):e!==null&&(Gt.set(e,n),
e=null)}e!==null&&Gt.set(e,"")}else typeof location=="object"?(Gt=Ot(),(location.search||"?").slice(1).split("&").forEach(
r=>{if(r.length!==0){const[e,t]=r.split("=");Gt.set(`--${qd(e,"-")}`,t),Gt.set(`-${qd(e,"-")}`,t)}})):Gt=Ot();return Gt},
gl=r=>Fw().has(r),bl=r=>Kd(ri?rm[r.toUpperCase().replaceAll("-","_")]:Bw.getItem(r)),nm=r=>gl("--"+r)||bl(r)!==null,Ow=nm(
"production"),zw=ri&&Uw(rm.FORCE_COLOR,["true","1","2"]),qw=zw||!gl("--no-colors")&&!nm("no-color")&&(!ri||process.stdout.
isTTY)&&(!ri||gl("--color")||bl("COLORTERM")!==null||(bl("TERM")||"").includes("color")),jw=r=>new Uint8Array(r),Gw=r=>{
const e=jw(r.byteLength);return e.set(r),e};class Ww{constructor(e,t){this.left=e,this.right=t}}const ar=(r,e)=>new Ww(r,
e),Qd=r=>r.next()>=.5,oc=(r,e,t)=>Jt(r.next()*(t+1-e)+e),sm=(r,e,t)=>Jt(r.next()*(t+1-e)+e),Au=(r,e,t)=>sm(r,e,t),Vw=r=>Zy(
Au(r,97,122)),Hw=(r,e=0,t=20)=>{const n=Au(r,e,t);let s="";for(let i=0;i<n;i++)s+=Vw(r);return s},ac=(r,e)=>e[Au(r,0,e.length-
1)],Kw=Symbol("0schema");class Qw{constructor(){this._rerrs=[]}extend(e,t,n,s=null){this._rerrs.push({path:e,expected:t,
has:n,message:s})}toString(){const e=[];for(let t=this._rerrs.length-1;t>0;t--){const n=this._rerrs[t];e.push(aw(" ",(this.
_rerrs.length-t)*2)+`${n.path!=null?`[${n.path}] `:""}${n.has} doesn't match ${n.expected}. ${n.message}`)}return e.join(
`
`)}}const yl=(r,e)=>r===e?!0:r==null||e==null||r.constructor!==e.constructor?!1:r[ti]?tm(r,e):ya(r)?bu(r,t=>Kp(e,n=>yl(t,
n))):Lw(r)?Ei(r,(t,n)=>yl(t,e[n])):!1;class ot{static _dilutes=!1;extends(e){let[t,n]=[this.shape,e.shape];return this.constructor.
_dilutes&&([n,t]=[t,n]),yl(t,n)}equals(e){return this.constructor===e.constructor&&co(this.shape,e.shape)}[Kw](){return!0}[ti](e){
return this.equals(e)}validate(e){return this.check(e)}check(e,t){zt()}get nullable(){return ns(this,Ia)}get optional(){
return new am(this)}cast(e){return Jd(e,this),e}expect(e){return Jd(e,this),e}}class _u extends ot{constructor(e,t){super(),
this.shape=e,this._c=t}check(e,t=void 0){const n=e?.constructor===this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name,e?.constructor!==this.shape?"Constructor match failed":"Check failed"),n}}const Se=(r,e=null)=>new _u(
r,e);Se(_u);class Iu extends ot{constructor(e){super(),this.shape=e}check(e,t){const n=this.shape(e);return!n&&t?.extend(
null,"custom prop",e?.constructor.name,"failed to check custom prop"),n}}const $e=r=>new Iu(r);Se(Iu);class va extends ot{constructor(e){
super(),this.shape=e}check(e,t){const n=this.shape.some(s=>s===e);return!n&&t?.extend(null,this.shape.join(" | "),e.toString()),
n}}const Sa=(...r)=>new va(r),im=Se(va),Jw=RegExp.escape||(r=>r.replace(/[().|&,$^[\]]/g,e=>"\\"+e)),om=r=>{if(Jn.check(
r))return[Jw(r)];if(im.check(r))return r.shape.map(e=>e+"");if(gm.check(r))return["[+-]?\\d+.?\\d*"];if(bm.check(r))return[
".*"];if(Io.check(r))return r.shape.map(om).flat(1);Dt()};class Xw extends ot{constructor(e){super(),this.shape=e,this._r=
new RegExp("^"+e.map(om).map(t=>`(${t.join("|")})`).join("")+"$")}check(e,t){const n=this._r.exec(e)!=null;return!n&&t?.
extend(null,this._r.toString(),e.toString(),"String doesn't match string template."),n}}Se(Xw);const Yw=Symbol("optional");
class am extends ot{constructor(e){super(),this.shape=e}check(e,t){const n=e===void 0||this.shape.check(e);return!n&&t?.
extend(null,"undefined (optional)","()"),n}get[Yw](){return!0}}const Zw=Se(am);class e0 extends ot{check(e,t){return t?.
extend(null,"never",typeof e),!1}}Se(e0);class Aa extends ot{constructor(e,t=!1){super(),this.shape=e,this._isPartial=t}static _dilutes=!0;get partial(){
return new Aa(this.shape,!0)}check(e,t){return e==null?(t?.extend(null,"object","null"),!1):Ei(this.shape,(n,s)=>{const i=this.
_isPartial&&!vu(e,s)||n.check(e[s],t);return!i&&t?.extend(s.toString(),n.toString(),typeof e[s],"Object property does no\
t match"),i})}}const t0=r=>new Aa(r),r0=Se(Aa),n0=$e(r=>r!=null&&(r.constructor===Object||r.constructor==null));class cm extends ot{constructor(e,t){
super(),this.shape={keys:e,values:t}}check(e,t){return e!=null&&Ei(e,(n,s)=>{const i=this.shape.keys.check(s,t);return!i&&
t?.extend(s+"","Record",typeof e,i?"Key doesn't match schema":"Value doesn't match value"),i&&this.shape.values.check(n,
t)})}}const lm=(r,e)=>new cm(r,e),s0=Se(cm);class um extends ot{constructor(e){super(),this.shape=e}check(e,t){return e!=
null&&Ei(this.shape,(n,s)=>{const i=n.check(e[s],t);return!i&&t?.extend(s.toString(),"Tuple",typeof n),i})}}const i0=(...r)=>new um(
r);Se(um);class dm extends ot{constructor(e){super(),this.shape=e.length===1?e[0]:new Cu(e)}check(e,t){const n=ya(e)&&bu(
e,s=>this.shape.check(s));return!n&&t?.extend(null,"Array",""),n}}const hm=(...r)=>new dm(r),o0=Se(dm),a0=$e(r=>ya(r));class fm extends ot{constructor(e,t){
super(),this.shape=e,this._c=t}check(e,t){const n=e instanceof this.shape&&(this._c==null||this._c(e));return!n&&t?.extend(
null,this.shape.name,e?.constructor.name),n}}const c0=(r,e=null)=>new fm(r,e);Se(fm);const l0=c0(ot);class u0 extends ot{constructor(e){
super(),this.len=e.length-1,this.args=i0(...e.slice(-1)),this.res=e[this.len]}check(e,t){const n=e.constructor===Function&&
e.length<=this.len;return!n&&t?.extend(null,"function",typeof e),n}}const d0=Se(u0),h0=$e(r=>typeof r=="function");class f0 extends ot{constructor(e){
super(),this.shape=e}check(e,t){const n=bu(this.shape,s=>s.check(e,t));return!n&&t?.extend(null,"Intersectinon",typeof e),
n}}Se(f0,r=>r.shape.length>0);class Cu extends ot{static _dilutes=!0;constructor(e){super(),this.shape=e}check(e,t){const n=Kp(
this.shape,s=>s.check(e,t));return t?.extend(null,"Union",typeof e),n}}const ns=(...r)=>r.findIndex(e=>Io.check(e))>=0?ns(
...r.map(e=>ni(e)).map(e=>Io.check(e)?e.shape:[e]).flat(1)):r.length===1?r[0]:new Cu(r),Io=Se(Cu),pm=()=>!0,Co=$e(pm),p0=Se(
Iu,r=>r.shape===pm),Tu=$e(r=>typeof r=="bigint"),m0=$e(r=>r===Tu),mm=$e(r=>typeof r=="symbol");$e(r=>r===mm);const Un=$e(
r=>typeof r=="number"),gm=$e(r=>r===Un),Jn=$e(r=>typeof r=="string"),bm=$e(r=>r===Jn),_a=$e(r=>typeof r=="boolean"),g0=$e(
r=>r===_a),ym=Sa(void 0);Se(va,r=>r.shape.length===1&&r.shape[0]===void 0);Sa(void 0);const Ia=Sa(null),b0=Se(va,r=>r.shape.
length===1&&r.shape[0]===null);Se(Uint8Array);Se(_u,r=>r.shape===Uint8Array);const y0=ns(Un,Jn,Ia,ym,Tu,_a,mm);(()=>{const r=hm(
Co),e=lm(Jn,Co),t=ns(Un,Jn,Ia,_a,r,e);return r.shape=t,e.shape.values=t,t})();const ni=r=>{if(l0.check(r))return r;if(n0.
check(r)){const e={};for(const t in r)e[t]=ni(r[t]);return t0(e)}else{if(a0.check(r))return ns(...r.map(ni));if(y0.check(
r))return Sa(r);if(h0.check(r))return Se(r)}Dt()},Jd=Ow?()=>{}:(r,e)=>{const t=new Qw;if(!e.check(r,t))throw yr(`Expecte\
d value to be of type ${e.constructor.name}.
${t.toString()}`)};class w0{constructor(e){this.patterns=[],this.$state=e}if(e,t){return this.patterns.push({if:ni(e),h:t}),
this}else(e){return this.if(Co,e)}done(){return(e,t)=>{for(let n=0;n<this.patterns.length;n++){const s=this.patterns[n];
if(s.if.check(e))return s.h(e,t)}throw yr("Unhandled pattern")}}}const k0=r=>new w0(r),wm=k0(Co).if(gm,(r,e)=>oc(e,zd,Ao)).
if(bm,(r,e)=>Hw(e)).if(g0,(r,e)=>Qd(e)).if(m0,(r,e)=>BigInt(oc(e,zd,Ao))).if(Io,(r,e)=>Cn(e,ac(e,r.shape))).if(r0,(r,e)=>{
const t={};for(const n in r.shape){let s=r.shape[n];if(Zw.check(s)){if(Qd(e))continue;s=s.shape}t[n]=wm(s,e)}return t}).
if(o0,(r,e)=>{const t=[],n=sm(e,0,42);for(let s=0;s<n;s++)t.push(Cn(e,r.shape));return t}).if(im,(r,e)=>ac(e,r.shape)).if(
b0,(r,e)=>null).if(d0,(r,e)=>{const t=Cn(e,r.res);return()=>t}).if(p0,(r,e)=>Cn(e,ac(e,[Un,Jn,Ia,ym,Tu,_a,hm(Un),lm(ns("\
a","b","c"),Un)]))).if(s0,(r,e)=>{const t={},n=oc(e,0,3);for(let s=0;s<n;s++){const i=Cn(e,r.shape.keys),o=Cn(e,r.shape.
values);t[i]=o}return t}).done(),Cn=(r,e)=>wm(ni(e),r),Ca=typeof document<"u"?document:{};$e(r=>r.nodeType===A0);typeof DOMParser<
"u"&&new DOMParser;$e(r=>r.nodeType===x0);$e(r=>r.nodeType===v0);const E0=r=>Hy(r,(e,t)=>`${t}:${e};`).join(""),x0=Ca.ELEMENT_NODE,
v0=Ca.TEXT_NODE,S0=Ca.DOCUMENT_NODE,A0=Ca.DOCUMENT_FRAGMENT_NODE;$e(r=>r.nodeType===S0);const wr=Symbol,km=wr(),Em=wr(),
_0=wr(),I0=wr(),C0=wr(),xm=wr(),T0=wr(),vm=wr(),M0=wr(),R0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],
t=[];let n=0;for(;n<r.length;n++){const s=r[n];if(s===void 0)break;if(s.constructor===String||s.constructor===Number)e.push(
s);else if(s.constructor===Object)break}for(n>0&&t.push(e.join(""));n<r.length;n++){const s=r[n];s instanceof Symbol||t.
push(s)}return t},B0={[km]:ar("font-weight","bold"),[Em]:ar("font-weight","normal"),[_0]:ar("color","blue"),[C0]:ar("col\
or","green"),[I0]:ar("color","grey"),[xm]:ar("color","red"),[T0]:ar("color","purple"),[vm]:ar("color","orange"),[M0]:ar(
"color","black")},L0=r=>{r.length===1&&r[0]?.constructor===Function&&(r=r[0]());const e=[],t=[],n=Ot();let s=[],i=0;for(;i<
r.length;i++){const o=r[i],a=B0[o];if(a!==void 0)n.set(a.left,a.right);else{if(o===void 0)break;if(o.constructor===String||
o.constructor===Number){const c=E0(n);i>0||c.length>0?(e.push("%c"+o),t.push(c)):e.push(o)}else break}}for(i>0&&(s=t,s.unshift(
e.join("")));i<r.length;i++){const o=r[i];o instanceof Symbol||s.push(o)}return s},D0=qw?L0:R0,P0=(...r)=>{console.log(...D0(
r)),$0.forEach(e=>e.print(r))},$0=Hn(),Sm=r=>({[Symbol.iterator](){return this},next:r}),N0=(r,e)=>Sm(()=>{let t;do t=r.
next();while(!t.done&&!e(t.value));return t}),cc=(r,e)=>Sm(()=>{const{done:t,value:n}=r.next();return{done:t,value:t?void 0:
e(n)}});class Mu{constructor(e,t){this.clock=e,this.len=t}}class xi{constructor(){this.clients=new Map}}const wl=(r,e,t)=>e.
clients.forEach((n,s)=>{const i=r.doc.store.clients.get(s);for(let o=0;o<n.length;o++){const a=n[o];Nm(r,i,a.clock,a.len,
t)}}),U0=(r,e)=>{let t=0,n=r.length-1;for(;t<=n;){const s=Jt((t+n)/2),i=r[s],o=i.clock;if(o<=e){if(e<o+i.len)return s;t=
s+1}else n=s-1}return null},Am=(r,e)=>{const t=r.clients.get(e.client);return t!==void 0&&U0(t,e.clock)!==null},Ru=r=>{r.
clients.forEach(e=>{e.sort((s,i)=>s.clock-i.clock);let t,n;for(t=1,n=1;t<e.length;t++){const s=e[n-1],i=e[t];s.clock+s.len>=
i.clock?s.len=bn(s.len,i.clock+i.len-s.clock):(n<t&&(e[n]=i),n++)}e.length=n})},F0=r=>{const e=new xi;for(let t=0;t<r.length;t++)
r[t].clients.forEach((n,s)=>{if(!e.clients.has(s)){const i=n.slice();for(let o=t+1;o<r.length;o++)Qy(i,r[o].clients.get(
s)||[]);e.clients.set(s,i)}});return Ru(e),e},To=(r,e,t,n)=>{nn(r.clients,e,()=>[]).push(new Mu(t,n))},O0=()=>new xi,z0=r=>{
const e=O0();return r.clients.forEach((t,n)=>{const s=[];for(let i=0;i<t.length;i++){const o=t[i];if(o.deleted){const a=o.
id.clock;let c=o.length;if(i+1<t.length)for(let l=t[i+1];i+1<t.length&&l.deleted;l=t[++i+1])c+=l.length;s.push(new Mu(a,
c))}}s.length>0&&e.clients.set(n,s)}),e},ss=(r,e)=>{re(r.restEncoder,e.clients.size),Yr(e.clients.entries()).sort((t,n)=>n[0]-
t[0]).forEach(([t,n])=>{r.resetDsCurVal(),re(r.restEncoder,t);const s=n.length;re(r.restEncoder,s);for(let i=0;i<s;i++){
const o=n[i];r.writeDsClock(o.clock),r.writeDsLen(o.len)}})},Bu=r=>{const e=new xi,t=te(r.restDecoder);for(let n=0;n<t;n++){
r.resetDsCurVal();const s=te(r.restDecoder),i=te(r.restDecoder);if(i>0){const o=nn(e.clients,s,()=>[]);for(let a=0;a<i;a++)
o.push(new Mu(r.readDsClock(),r.readDsLen()))}}return e},Xd=(r,e,t)=>{const n=new xi,s=te(r.restDecoder);for(let i=0;i<s;i++){
r.resetDsCurVal();const o=te(r.restDecoder),a=te(r.restDecoder),c=t.clients.get(o)||[],l=De(t,o);for(let u=0;u<a;u++){const h=r.
readDsClock(),d=h+r.readDsLen();if(h<l){l<d&&To(n,o,l,d-l);let p=Xt(c,h),m=c[p];for(!m.deleted&&m.id.clock<h&&(c.splice(
p+1,0,No(e,m,h-m.id.clock)),p++);p<c.length&&(m=c[p++],m.id.clock<d);)m.deleted||(d<m.id.clock+m.length&&c.splice(p,0,No(
e,m,d-m.id.clock)),m.delete(e))}else To(n,o,h,d-h)}}if(n.clients.size>0){const i=new un;return re(i.restEncoder,0),ss(i,
n),i.toUint8Array()}return null},_m=Zp;class is extends yu{constructor({guid:e=Tw(),collectionid:t=null,gc:n=!0,gcFilter:s=()=>!0,
meta:i=null,autoLoad:o=!1,shouldLoad:a=!0}={}){super(),this.gc=n,this.gcFilter=s,this.clientID=_m(),this.guid=e,this.collectionid=
t,this.share=new Map,this.store=new Pm,this._transaction=null,this._transactionCleanups=[],this.subdocs=new Set,this._item=
null,this.shouldLoad=a,this.autoLoad=o,this.meta=i,this.isLoaded=!1,this.isSynced=!1,this.whenLoaded=Qn(l=>{this.on("loa\
d",()=>{this.isLoaded=!0,l(this)})});const c=()=>Qn(l=>{const u=h=>{(h===void 0||h===!0)&&(this.off("sync",u),l())};this.
on("sync",u)});this.on("sync",l=>{l===!1&&this.isSynced&&(this.whenSynced=c()),this.isSynced=l===void 0||l===!0,this.isLoaded||
this.emit("load",[])}),this.whenSynced=c()}load(){const e=this._item;e!==null&&!this.shouldLoad&&pe(e.parent.doc,t=>{t.subdocsLoaded.
add(this)},null,!0),this.shouldLoad=!0}getSubdocs(){return this.subdocs}getSubdocGuids(){return new Set(Yr(this.subdocs).
map(e=>e.guid))}transact(e,t=null){return pe(this,e,t)}get(e,t=Oe){const n=nn(this.share,e,()=>{const i=new t;return i._integrate(
this,null),i}),s=n.constructor;if(t!==Oe&&s!==t)if(s===Oe){const i=new t;i._map=n._map,n._map.forEach(o=>{for(;o!==null;o=
o.left)o.parent=i}),i._start=n._start;for(let o=i._start;o!==null;o=o.right)o.parent=i;return i._length=n._length,this.share.
set(e,i),i._integrate(this,null),i}else throw new Error(`Type with the name ${e} has already been defined with a differe\
nt constructor`);return n}getArray(e=""){return this.get(e,On)}getText(e=""){return this.get(e,Yn)}getMap(e=""){return this.
get(e,gr)}getXmlFragment(e=""){return this.get(e,dn)}toJSON(){const e={};return this.share.forEach((t,n)=>{e[n]=t.toJSON()}),
e}destroy(){Yr(this.subdocs).forEach(t=>t.destroy());const e=this._item;if(e!==null){this._item=null;const t=e.content;t.
doc=new is({guid:this.guid,...t.opts,shouldLoad:!1}),t.doc._item=e,pe(e.parent.doc,n=>{const s=t.doc;e.deleted||n.subdocsAdded.
add(s),n.subdocsRemoved.add(this)},null,!0)}this.emit("destroyed",[!0]),this.emit("destroy",[this]),super.destroy()}on(e,t){
super.on(e,t)}off(e,t){super.off(e,t)}}class Im{constructor(e){this.restDecoder=e}resetDsCurVal(){}readDsClock(){return te(
this.restDecoder)}readDsLen(){return te(this.restDecoder)}}class Cm extends Im{readLeftID(){return ne(te(this.restDecoder),
te(this.restDecoder))}readRightID(){return ne(te(this.restDecoder),te(this.restDecoder))}readClient(){return te(this.restDecoder)}readInfo(){
return Kn(this.restDecoder)}readString(){return Nn(this.restDecoder)}readParentInfo(){return te(this.restDecoder)===1}readTypeRef(){
return te(this.restDecoder)}readLen(){return te(this.restDecoder)}readAny(){return ei(this.restDecoder)}readBuf(){return Gw(
bt(this.restDecoder))}readJSON(){return JSON.parse(Nn(this.restDecoder))}readKey(){return Nn(this.restDecoder)}}class q0{constructor(e){
this.dsCurrVal=0,this.restDecoder=e}resetDsCurVal(){this.dsCurrVal=0}readDsClock(){return this.dsCurrVal+=te(this.restDecoder),
this.dsCurrVal}readDsLen(){const e=te(this.restDecoder)+1;return this.dsCurrVal+=e,e}}class Xn extends q0{constructor(e){
super(e),this.keys=[],te(e),this.keyClockDecoder=new ic(bt(e)),this.clientDecoder=new ao(bt(e)),this.leftClockDecoder=new ic(
bt(e)),this.rightClockDecoder=new ic(bt(e)),this.infoDecoder=new Hd(bt(e),Kn),this.stringDecoder=new _w(bt(e)),this.parentInfoDecoder=
new Hd(bt(e),Kn),this.typeRefDecoder=new ao(bt(e)),this.lenDecoder=new ao(bt(e))}readLeftID(){return new Fn(this.clientDecoder.
read(),this.leftClockDecoder.read())}readRightID(){return new Fn(this.clientDecoder.read(),this.rightClockDecoder.read())}readClient(){
return this.clientDecoder.read()}readInfo(){return this.infoDecoder.read()}readString(){return this.stringDecoder.read()}readParentInfo(){
return this.parentInfoDecoder.read()===1}readTypeRef(){return this.typeRefDecoder.read()}readLen(){return this.lenDecoder.
read()}readAny(){return ei(this.restDecoder)}readBuf(){return bt(this.restDecoder)}readJSON(){return ei(this.restDecoder)}readKey(){
const e=this.keyClockDecoder.read();if(e<this.keys.length)return this.keys[e];{const t=this.stringDecoder.read();return this.
keys.push(t),t}}}class Tm{constructor(){this.restEncoder=ka()}toUint8Array(){return Qt(this.restEncoder)}resetDsCurVal(){}writeDsClock(e){
re(this.restEncoder,e)}writeDsLen(e){re(this.restEncoder,e)}}class vi extends Tm{writeLeftID(e){re(this.restEncoder,e.client),
re(this.restEncoder,e.clock)}writeRightID(e){re(this.restEncoder,e.client),re(this.restEncoder,e.clock)}writeClient(e){re(
this.restEncoder,e)}writeInfo(e){pl(this.restEncoder,e)}writeString(e){$n(this.restEncoder,e)}writeParentInfo(e){re(this.
restEncoder,e?1:0)}writeTypeRef(e){re(this.restEncoder,e)}writeLen(e){re(this.restEncoder,e)}writeAny(e){Zs(this.restEncoder,
e)}writeBuf(e){gt(this.restEncoder,e)}writeJSON(e){$n(this.restEncoder,JSON.stringify(e))}writeKey(e){$n(this.restEncoder,
e)}}class Mm{constructor(){this.restEncoder=ka(),this.dsCurrVal=0}toUint8Array(){return Qt(this.restEncoder)}resetDsCurVal(){
this.dsCurrVal=0}writeDsClock(e){const t=e-this.dsCurrVal;this.dsCurrVal=e,re(this.restEncoder,t)}writeDsLen(e){e===0&&Dt(),
re(this.restEncoder,e-1),this.dsCurrVal+=e}}class un extends Mm{constructor(){super(),this.keyMap=new Map,this.keyClock=
0,this.keyClockEncoder=new sc,this.clientEncoder=new oo,this.leftClockEncoder=new sc,this.rightClockEncoder=new sc,this.
infoEncoder=new Gd(pl),this.stringEncoder=new bw,this.parentInfoEncoder=new Gd(pl),this.typeRefEncoder=new oo,this.lenEncoder=
new oo}toUint8Array(){const e=ka();return re(e,0),gt(e,this.keyClockEncoder.toUint8Array()),gt(e,this.clientEncoder.toUint8Array()),
gt(e,this.leftClockEncoder.toUint8Array()),gt(e,this.rightClockEncoder.toUint8Array()),gt(e,Qt(this.infoEncoder)),gt(e,this.
stringEncoder.toUint8Array()),gt(e,Qt(this.parentInfoEncoder)),gt(e,this.typeRefEncoder.toUint8Array()),gt(e,this.lenEncoder.
toUint8Array()),Ea(e,Qt(this.restEncoder)),Qt(e)}writeLeftID(e){this.clientEncoder.write(e.client),this.leftClockEncoder.
write(e.clock)}writeRightID(e){this.clientEncoder.write(e.client),this.rightClockEncoder.write(e.clock)}writeClient(e){this.
clientEncoder.write(e)}writeInfo(e){this.infoEncoder.write(e)}writeString(e){this.stringEncoder.write(e)}writeParentInfo(e){
this.parentInfoEncoder.write(e?1:0)}writeTypeRef(e){this.typeRefEncoder.write(e)}writeLen(e){this.lenEncoder.write(e)}writeAny(e){
Zs(this.restEncoder,e)}writeBuf(e){gt(this.restEncoder,e)}writeJSON(e){Zs(this.restEncoder,e)}writeKey(e){const t=this.keyMap.
get(e);t===void 0?(this.keyClockEncoder.write(this.keyClock++),this.stringEncoder.write(e)):this.keyClockEncoder.write(t)}}
const j0=(r,e,t,n)=>{n=bn(n,e[0].id.clock);const s=Xt(e,n);re(r.restEncoder,e.length-s),r.writeClient(t),re(r.restEncoder,
n);const i=e[s];i.write(r,n-i.id.clock);for(let o=s+1;o<e.length;o++)e[o].write(r,0)},Lu=(r,e,t)=>{const n=new Map;t.forEach(
(s,i)=>{De(e,i)>s&&n.set(i,s)}),Ta(e).forEach((s,i)=>{t.has(i)||n.set(i,0)}),re(r.restEncoder,n.size),Yr(n.entries()).sort(
(s,i)=>i[0]-s[0]).forEach(([s,i])=>{j0(r,e.clients.get(s),s,i)})},G0=(r,e)=>{const t=Ot(),n=te(r.restDecoder);for(let s=0;s<
n;s++){const i=te(r.restDecoder),o=new Array(i),a=r.readClient();let c=te(r.restDecoder);t.set(a,{i:0,refs:o});for(let l=0;l<
i;l++){const u=r.readInfo();switch(wa&u){case 0:{const h=r.readLen();o[l]=new Rt(ne(a,c),h),c+=h;break}case 10:{const h=te(
r.restDecoder);o[l]=new Bt(ne(a,c),h),c+=h;break}default:{const h=(u&(mr|xt))===0,d=new Te(ne(a,c),null,(u&xt)===xt?r.readLeftID():
null,null,(u&mr)===mr?r.readRightID():null,h?r.readParentInfo()?e.get(r.readString()):r.readLeftID():null,h&&(u&Xs)===Xs?
r.readString():null,rg(r,u));o[l]=d,c+=d.length}}}}return t},W0=(r,e,t)=>{const n=[];let s=Yr(t.keys()).sort((p,m)=>p-m);
if(s.length===0)return null;const i=()=>{if(s.length===0)return null;let p=t.get(s[s.length-1]);for(;p.refs.length===p.i;)
if(s.pop(),s.length>0)p=t.get(s[s.length-1]);else return null;return p};let o=i();if(o===null&&n.length===0)return null;
const a=new Pm,c=new Map,l=(p,m)=>{const y=c.get(p);(y==null||y>m)&&c.set(p,m)};let u=o.refs[o.i++];const h=new Map,d=()=>{
for(const p of n){const m=p.id.client,y=t.get(m);y?(y.i--,a.clients.set(m,y.refs.slice(y.i)),t.delete(m),y.i=0,y.refs=[]):
a.clients.set(m,[p]),s=s.filter(b=>b!==m)}n.length=0};for(;;){if(u.constructor!==Bt){const m=nn(h,u.id.client,()=>De(e,u.
id.client))-u.id.clock;if(m<0)n.push(u),l(u.id.client,u.id.clock-1),d();else{const y=u.getMissing(r,e);if(y!==null){n.push(
u);const b=t.get(y)||{refs:[],i:0};if(b.refs.length===b.i)l(y,De(e,y)),d();else{u=b.refs[b.i++];continue}}else(m===0||m<
u.length)&&(u.integrate(r,m),h.set(u.id.client,u.id.clock+u.length))}}if(n.length>0)u=n.pop();else if(o!==null&&o.i<o.refs.
length)u=o.refs[o.i++];else{if(o=i(),o===null)break;u=o.refs[o.i++]}}if(a.clients.size>0){const p=new un;return Lu(p,a,new Map),
re(p.restEncoder,0),{missing:c,update:p.toUint8Array()}}return null},V0=(r,e)=>Lu(r,e.doc.store,e.beforeState),H0=(r,e,t,n=new Xn(
r))=>pe(e,s=>{s.local=!1;let i=!1;const o=s.doc,a=o.store,c=G0(n,o),l=W0(s,a,c),u=a.pendingStructs;if(u){for(const[d,p]of u.
missing)if(p<De(a,d)){i=!0;break}if(l){for(const[d,p]of l.missing){const m=u.missing.get(d);(m==null||m>p)&&u.missing.set(
d,p)}u.update=Ro([u.update,l.update])}}else a.pendingStructs=l;const h=Xd(n,s,a);if(a.pendingDs){const d=new Xn(rs(a.pendingDs));
te(d.restDecoder);const p=Xd(d,s,a);h&&p?a.pendingDs=Ro([h,p]):a.pendingDs=h||p}else a.pendingDs=h;if(i){const d=a.pendingStructs.
update;a.pendingStructs=null,Rm(s.doc,d)}},t,!1),Rm=(r,e,t,n=Xn)=>{const s=rs(e);H0(s,r,t,new n(s))},Mo=(r,e,t)=>Rm(r,e,
t,Cm),K0=(r,e,t=new Map)=>{Lu(r,e.store,t),ss(r,z0(e.store))},Q0=(r,e=new Uint8Array([0]),t=new un)=>{const n=Bm(e);K0(t,
r,n);const s=[t.toUint8Array()];if(r.store.pendingDs&&s.push(r.store.pendingDs),r.store.pendingStructs&&s.push(u1(r.store.
pendingStructs.update,e)),s.length>1){if(t.constructor===vi)return c1(s.map((i,o)=>o===0?i:h1(i)));if(t.constructor===un)
return Ro(s)}return s[0]},Du=(r,e)=>Q0(r,e,new vi),J0=r=>{const e=new Map,t=te(r.restDecoder);for(let n=0;n<t;n++){const s=te(
r.restDecoder),i=te(r.restDecoder);e.set(s,i)}return e},Bm=r=>J0(new Im(rs(r))),Lm=(r,e)=>(re(r.restEncoder,e.size),Yr(e.
entries()).sort((t,n)=>n[0]-t[0]).forEach(([t,n])=>{re(r.restEncoder,t),re(r.restEncoder,n)}),r),X0=(r,e)=>Lm(r,Ta(e.store)),
Y0=(r,e=new Mm)=>(r instanceof Map?Lm(e,r):X0(e,r),e.toUint8Array()),Z0=r=>Y0(r,new Tm);class e1{constructor(){this.l=[]}}
const Yd=()=>new e1,Zd=(r,e)=>r.l.push(e),eh=(r,e)=>{const t=r.l,n=t.length;r.l=t.filter(s=>e!==s),n===r.l.length&&console.
error("[yjs] Tried to remove event handler that doesn't exist.")},Dm=(r,e,t)=>Su(r.l,[e,t]);class Fn{constructor(e,t){this.
client=e,this.clock=t}}const $i=(r,e)=>r===e||r!==null&&e!==null&&r.client===e.client&&r.clock===e.clock,ne=(r,e)=>new Fn(
r,e),t1=r=>{for(const[e,t]of r.doc.share.entries())if(t===r)return e;throw Dt()},bs=(r,e)=>e===void 0?!r.deleted:e.sv.has(
r.id.client)&&(e.sv.get(r.id.client)||0)>r.id.clock&&!Am(e.ds,r.id),kl=(r,e)=>{const t=nn(r.meta,kl,Hn),n=r.doc.store;t.
has(e)||(e.sv.forEach((s,i)=>{s<De(n,i)&&Zr(r,ne(i,s))}),wl(r,e.ds,s=>{}),t.add(e))};class Pm{constructor(){this.clients=
new Map,this.pendingStructs=null,this.pendingDs=null}}const Ta=r=>{const e=new Map;return r.clients.forEach((t,n)=>{const s=t[t.
length-1];e.set(n,s.id.clock+s.length)}),e},De=(r,e)=>{const t=r.clients.get(e);if(t===void 0)return 0;const n=t[t.length-
1];return n.id.clock+n.length},$m=(r,e)=>{let t=r.clients.get(e.id.client);if(t===void 0)t=[],r.clients.set(e.id.client,
t);else{const n=t[t.length-1];if(n.id.clock+n.length!==e.id.clock)throw Dt()}t.push(e)},Xt=(r,e)=>{let t=0,n=r.length-1,
s=r[n],i=s.id.clock;if(i===e)return n;let o=Jt(e/(i+s.length-1)*n);for(;t<=n;){if(s=r[o],i=s.id.clock,i<=e){if(e<i+s.length)
return o;t=o+1}else n=o-1;o=Jt((t+n)/2)}throw Dt()},r1=(r,e)=>{const t=r.clients.get(e.client);return t[Xt(t,e.clock)]},
lc=r1,El=(r,e,t)=>{const n=Xt(e,t),s=e[n];return s.id.clock<t&&s instanceof Te?(e.splice(n+1,0,No(r,s,t-s.id.clock)),n+1):
n},Zr=(r,e)=>{const t=r.doc.store.clients.get(e.client);return t[El(r,t,e.clock)]},th=(r,e,t)=>{const n=e.clients.get(t.
client),s=Xt(n,t.clock),i=n[s];return t.clock!==i.id.clock+i.length-1&&i.constructor!==Rt&&n.splice(s+1,0,No(r,i,t.clock-
i.id.clock+1)),i},n1=(r,e,t)=>{const n=r.clients.get(e.id.client);n[Xt(n,e.id.clock)]=t},Nm=(r,e,t,n,s)=>{if(n===0)return;
const i=t+n;let o=El(r,e,t),a;do a=e[o++],i<a.id.clock+a.length&&El(r,e,i),s(a);while(o<e.length&&e[o].id.clock<i)};class s1{constructor(e,t,n){
this.doc=e,this.deleteSet=new xi,this.beforeState=Ta(e.store),this.afterState=new Map,this.changed=new Map,this.changedParentTypes=
new Map,this._mergeStructs=[],this.origin=t,this.meta=new Map,this.local=n,this.subdocsAdded=new Set,this.subdocsRemoved=
new Set,this.subdocsLoaded=new Set}}const rh=(r,e)=>e.deleteSet.clients.size===0&&!Ky(e.afterState,(t,n)=>e.beforeState.
get(n)!==t)?!1:(Ru(e.deleteSet),V0(r,e),ss(r,e.deleteSet),!0),nh=(r,e,t)=>{const n=e._item;(n===null||n.id.clock<(r.beforeState.
get(n.id.client)||0)&&!n.deleted)&&nn(r.changed,e,Hn).add(t)},lo=(r,e)=>{const t=r[e-1],n=r[e];t.deleted===n.deleted&&t.
constructor===n.constructor&&t.mergeWith(n)&&(r.splice(e,1),n instanceof Te&&n.parentSub!==null&&n.parent._map.get(n.parentSub)===
n&&n.parent._map.set(n.parentSub,t))},i1=(r,e,t)=>{for(const[n,s]of r.clients.entries()){const i=e.clients.get(n);for(let o=s.
length-1;o>=0;o--){const a=s[o],c=a.clock+a.len;for(let l=Xt(i,a.clock),u=i[l];l<i.length&&u.id.clock<c;u=i[++l]){const h=i[l];
if(a.clock+a.len<=h.id.clock)break;h instanceof Te&&h.deleted&&!h.keep&&t(h)&&h.gc(e,!1)}}}},o1=(r,e)=>{r.clients.forEach(
(t,n)=>{const s=e.clients.get(n);for(let i=t.length-1;i>=0;i--){const o=t[i],a=Qp(s.length-1,1+Xt(s,o.clock+o.len-1));for(let c=a,
l=s[c];c>0&&l.id.clock>=o.clock;l=s[--c])lo(s,c)}})},Um=(r,e)=>{if(e<r.length){const t=r[e],n=t.doc,s=n.store,i=t.deleteSet,
o=t._mergeStructs;try{Ru(i),t.afterState=Ta(t.doc.store),n.emit("beforeObserverCalls",[t,n]);const a=[];t.changed.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&l._callObserver(t,c)})),a.push(()=>{t.changedParentTypes.forEach(
(c,l)=>a.push(()=>{(l._item===null||!l._item.deleted)&&(c=c.filter(u=>u.target._item===null||!u.target._item.deleted),c.
forEach(u=>{u.currentTarget=l}),c.sort((u,h)=>u.path.length-h.path.length),Dm(l._dEH,c,t))})),a.push(()=>n.emit("afterTr\
ansaction",[t,n]))}),Su(a,[])}finally{n.gc&&i1(i,s,n.gcFilter),o1(i,s),t.afterState.forEach((u,h)=>{const d=t.beforeState.
get(h)||0;if(d!==u){const p=s.clients.get(h),m=bn(Xt(p,d),1);for(let y=p.length-1;y>=m;y--)lo(p,y)}});for(let u=0;u<o.length;u++){
const{client:h,clock:d}=o[u].id,p=s.clients.get(h),m=Xt(p,d);m+1<p.length&&lo(p,m+1),m>0&&lo(p,m)}if(!t.local&&t.afterState.
get(n.clientID)!==t.beforeState.get(n.clientID)&&(P0(vm,km,"[yjs] ",Em,xm,"Changed the client-id because another client \
seems to be using it."),n.clientID=_m()),n.emit("afterTransactionCleanup",[t,n]),n._observers.has("update")){const u=new vi;
rh(u,t)&&n.emit("update",[u.toUint8Array(),t.origin,n,t])}if(n._observers.has("updateV2")){const u=new un;rh(u,t)&&n.emit(
"updateV2",[u.toUint8Array(),t.origin,n,t])}const{subdocsAdded:a,subdocsLoaded:c,subdocsRemoved:l}=t;(a.size>0||l.size>0||
c.size>0)&&(a.forEach(u=>{u.clientID=n.clientID,u.collectionid==null&&(u.collectionid=n.collectionid),n.subdocs.add(u)}),
l.forEach(u=>n.subdocs.delete(u)),n.emit("subdocs",[{loaded:c,added:a,removed:l},n,t]),l.forEach(u=>u.destroy())),r.length<=
e+1?(n._transactionCleanups=[],n.emit("afterAllTransactions",[n,r])):Um(r,e+1)}}},pe=(r,e,t=null,n=!0)=>{const s=r._transactionCleanups;
let i=!1,o=null;r._transaction===null&&(i=!0,r._transaction=new s1(r,t,n),s.push(r._transaction),s.length===1&&r.emit("b\
eforeAllTransactions",[r]),r.emit("beforeTransaction",[r._transaction,r]));try{o=e(r._transaction)}finally{if(i){const a=r.
_transaction===s[0];r._transaction=null,a&&Um(s,0)}}return o};function*a1(r){const e=te(r.restDecoder);for(let t=0;t<e;t++){
const n=te(r.restDecoder),s=r.readClient();let i=te(r.restDecoder);for(let o=0;o<n;o++){const a=r.readInfo();if(a===10){
const c=te(r.restDecoder);yield new Bt(ne(s,i),c),i+=c}else if((wa&a)!==0){const c=(a&(mr|xt))===0,l=new Te(ne(s,i),null,
(a&xt)===xt?r.readLeftID():null,null,(a&mr)===mr?r.readRightID():null,c?r.readParentInfo()?r.readString():r.readLeftID():
null,c&&(a&Xs)===Xs?r.readString():null,rg(r,a));yield l,i+=l.length}else{const c=r.readLen();yield new Rt(ne(s,i),c),i+=
c}}}}class Pu{constructor(e,t){this.gen=a1(e),this.curr=null,this.done=!1,this.filterSkips=t,this.next()}next(){do this.
curr=this.gen.next().value||null;while(this.filterSkips&&this.curr!==null&&this.curr.constructor===Bt);return this.curr}}
class $u{constructor(e){this.currClient=0,this.startClock=0,this.written=0,this.encoder=e,this.clientStructs=[]}}const c1=r=>Ro(
r,Cm,vi),l1=(r,e)=>{if(r.constructor===Rt){const{client:t,clock:n}=r.id;return new Rt(ne(t,n+e),r.length-e)}else if(r.constructor===
Bt){const{client:t,clock:n}=r.id;return new Bt(ne(t,n+e),r.length-e)}else{const t=r,{client:n,clock:s}=t.id;return new Te(
ne(n,s+e),null,ne(n,s+e-1),null,t.rightOrigin,t.parent,t.parentSub,t.content.splice(e))}},Ro=(r,e=Xn,t=un)=>{if(r.length===
1)return r[0];const n=r.map(u=>new e(rs(u)));let s=n.map(u=>new Pu(u,!0)),i=null;const o=new t,a=new $u(o);for(;s=s.filter(
d=>d.curr!==null),s.sort((d,p)=>{if(d.curr.id.client===p.curr.id.client){const m=d.curr.id.clock-p.curr.id.clock;return m===
0?d.curr.constructor===p.curr.constructor?0:d.curr.constructor===Bt?1:-1:m}else return p.curr.id.client-d.curr.id.client}),
s.length!==0;){const u=s[0],h=u.curr.id.client;if(i!==null){let d=u.curr,p=!1;for(;d!==null&&d.id.clock+d.length<=i.struct.
id.clock+i.struct.length&&d.id.client>=i.struct.id.client;)d=u.next(),p=!0;if(d===null||d.id.client!==h||p&&d.id.clock>i.
struct.id.clock+i.struct.length)continue;if(h!==i.struct.id.client)Vr(a,i.struct,i.offset),i={struct:d,offset:0},u.next();else if(i.
struct.id.clock+i.struct.length<d.id.clock)if(i.struct.constructor===Bt)i.struct.length=d.id.clock+d.length-i.struct.id.
clock;else{Vr(a,i.struct,i.offset);const m=d.id.clock-i.struct.id.clock-i.struct.length;i={struct:new Bt(ne(h,i.struct.id.
clock+i.struct.length),m),offset:0}}else{const m=i.struct.id.clock+i.struct.length-d.id.clock;m>0&&(i.struct.constructor===
Bt?i.struct.length-=m:d=l1(d,m)),i.struct.mergeWith(d)||(Vr(a,i.struct,i.offset),i={struct:d,offset:0},u.next())}}else i=
{struct:u.curr,offset:0},u.next();for(let d=u.curr;d!==null&&d.id.client===h&&d.id.clock===i.struct.id.clock+i.struct.length&&
d.constructor!==Bt;d=u.next())Vr(a,i.struct,i.offset),i={struct:d,offset:0}}i!==null&&(Vr(a,i.struct,i.offset),i=null),Nu(
a);const c=n.map(u=>Bu(u)),l=F0(c);return ss(o,l),o.toUint8Array()},u1=(r,e,t=Xn,n=un)=>{const s=Bm(e),i=new n,o=new $u(
i),a=new t(rs(r)),c=new Pu(a,!1);for(;c.curr;){const u=c.curr,h=u.id.client,d=s.get(h)||0;if(c.curr.constructor===Bt){c.
next();continue}if(u.id.clock+u.length>d)for(Vr(o,u,bn(d-u.id.clock,0)),c.next();c.curr&&c.curr.id.client===h;)Vr(o,c.curr,
0),c.next();else for(;c.curr&&c.curr.id.client===h&&c.curr.id.clock+c.curr.length<=d;)c.next()}Nu(o);const l=Bu(a);return ss(
i,l),i.toUint8Array()},Fm=r=>{r.written>0&&(r.clientStructs.push({written:r.written,restEncoder:Qt(r.encoder.restEncoder)}),
r.encoder.restEncoder=ka(),r.written=0)},Vr=(r,e,t)=>{r.written>0&&r.currClient!==e.id.client&&Fm(r),r.written===0&&(r.currClient=
e.id.client,r.encoder.writeClient(e.id.client),re(r.encoder.restEncoder,e.id.clock+t)),e.write(r.encoder,t),r.written++},
Nu=r=>{Fm(r);const e=r.encoder.restEncoder;re(e,r.clientStructs.length);for(let t=0;t<r.clientStructs.length;t++){const n=r.
clientStructs[t];re(e,n.written),Ea(e,n.restEncoder)}},d1=(r,e,t)=>{const n=new e(rs(r)),s=new Pu(n,!1),i=new t,o=new $u(
i);for(let c=s.curr;c!==null;c=s.next())Vr(o,c,0);Nu(o);const a=Bu(n);return ss(i,a),i.toUint8Array()},h1=r=>d1(r,Xn,vi);
class Ma{constructor(e,t){this.target=e,this.currentTarget=e,this.transaction=t,this._changes=null,this._keys=null,this.
_delta=null}get path(){return f1(this.currentTarget,this.target)}deletes(e){return Am(this.transaction.deleteSet,e.id)}get keys(){
if(this._keys===null){const e=new Map,t=this.target;this.transaction.changed.get(t).forEach(s=>{if(s!==null){const i=t._map.
get(s);let o,a;if(this.adds(i)){let c=i.left;for(;c!==null&&this.adds(c);)c=c.left;if(this.deletes(i))if(c!==null&&this.
deletes(c))o="delete",a=tc(c.content.getContent());else return;else c!==null&&this.deletes(c)?(o="update",a=tc(c.content.
getContent())):(o="add",a=void 0)}else if(this.deletes(i))o="delete",a=tc(i.content.getContent());else return;e.set(s,{action:o,
oldValue:a})}}),this._keys=e}return this._keys}get delta(){return this.changes.delta}adds(e){return e.id.clock>=(this.transaction.
beforeState.get(e.id.client)||0)}get changes(){let e=this._changes;if(e===null){const t=this.target,n=Hn(),s=Hn(),i=[];if(e=
{added:n,deleted:s,delta:i,keys:this.keys},this.transaction.changed.get(t).has(null)){let a=null;const c=()=>{a&&i.push(
a)};for(let l=t._start;l!==null;l=l.right)l.deleted?this.deletes(l)&&!this.adds(l)&&((a===null||a.delete===void 0)&&(c(),
a={delete:0}),a.delete+=l.length,s.add(l)):this.adds(l)?((a===null||a.insert===void 0)&&(c(),a={insert:[]}),a.insert=a.insert.
concat(l.content.getContent()),n.add(l)):((a===null||a.retain===void 0)&&(c(),a={retain:0}),a.retain+=l.length);a!==null&&
a.retain===void 0&&c()}this._changes=e}return e}}const f1=(r,e)=>{const t=[];for(;e._item!==null&&e!==r;){if(e._item.parentSub!==
null)t.unshift(e._item.parentSub);else{let n=0,s=e._item.parent._start;for(;s!==e._item&&s!==null;)s.deleted||n++,s=s.right;
t.unshift(n)}e=e._item.parent}return t},Om=80;let Uu=0;class p1{constructor(e,t){e.marker=!0,this.p=e,this.index=t,this.
timestamp=Uu++}}const m1=r=>{r.timestamp=Uu++},zm=(r,e,t)=>{r.p.marker=!1,r.p=e,e.marker=!0,r.index=t,r.timestamp=Uu++},
g1=(r,e,t)=>{if(r.length>=Om){const n=r.reduce((s,i)=>s.timestamp<i.timestamp?s:i);return zm(n,e,t),n}else{const n=new p1(
e,t);return r.push(n),n}},Ra=(r,e)=>{if(r._start===null||e===0||r._searchMarker===null)return null;const t=r._searchMarker.
length===0?null:r._searchMarker.reduce((i,o)=>io(e-i.index)<io(e-o.index)?i:o);let n=r._start,s=0;for(t!==null&&(n=t.p,s=
t.index,m1(t));n.right!==null&&s<e;){if(!n.deleted&&n.countable){if(e<s+n.length)break;s+=n.length}n=n.right}for(;n.left!==
null&&s>e;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);for(;n.left!==null&&n.left.id.client===n.id.client&&n.left.id.
clock+n.left.length===n.id.clock;)n=n.left,!n.deleted&&n.countable&&(s-=n.length);return t!==null&&io(t.index-s)<n.parent.
length/Om?(zm(t,n,s),t):g1(r._searchMarker,n,s)},si=(r,e,t)=>{for(let n=r.length-1;n>=0;n--){const s=r[n];if(t>0){let i=s.
p;for(i.marker=!1;i&&(i.deleted||!i.countable);)i=i.left,i&&!i.deleted&&i.countable&&(s.index-=i.length);if(i===null||i.
marker===!0){r.splice(n,1);continue}s.p=i,i.marker=!0}(e<s.index||t>0&&e===s.index)&&(s.index=bn(e,s.index+t))}},Ba=(r,e,t)=>{
const n=r,s=e.changedParentTypes;for(;nn(s,r,()=>[]).push(t),r._item!==null;)r=r._item.parent;Dm(n._eH,t,e)};class Oe{constructor(){
this._item=null,this._map=new Map,this._start=null,this.doc=null,this._length=0,this._eH=Yd(),this._dEH=Yd(),this._searchMarker=
null}get parent(){return this._item?this._item.parent:null}_integrate(e,t){this.doc=e,this._item=t}_copy(){throw zt()}clone(){
throw zt()}_write(e){}get _first(){let e=this._start;for(;e!==null&&e.deleted;)e=e.right;return e}_callObserver(e,t){!e.
local&&this._searchMarker&&(this._searchMarker.length=0)}observe(e){Zd(this._eH,e)}observeDeep(e){Zd(this._dEH,e)}unobserve(e){
eh(this._eH,e)}unobserveDeep(e){eh(this._dEH,e)}toJSON(){}}const qm=(r,e,t)=>{e<0&&(e=r._length+e),t<0&&(t=r._length+t);
let n=t-e;const s=[];let i=r._start;for(;i!==null&&n>0;){if(i.countable&&!i.deleted){const o=i.content.getContent();if(o.
length<=e)e-=o.length;else{for(let a=e;a<o.length&&n>0;a++)s.push(o[a]),n--;e=0}}i=i.right}return s},jm=r=>{const e=[];let t=r.
_start;for(;t!==null;){if(t.countable&&!t.deleted){const n=t.content.getContent();for(let s=0;s<n.length;s++)e.push(n[s])}
t=t.right}return e},ii=(r,e)=>{let t=0,n=r._start;for(;n!==null;){if(n.countable&&!n.deleted){const s=n.content.getContent();
for(let i=0;i<s.length;i++)e(s[i],t++,r)}n=n.right}},Gm=(r,e)=>{const t=[];return ii(r,(n,s)=>{t.push(e(n,s,r))}),t},b1=r=>{
let e=r._start,t=null,n=0;return{[Symbol.iterator](){return this},next:()=>{if(t===null){for(;e!==null&&e.deleted;)e=e.right;
if(e===null)return{done:!0,value:void 0};t=e.content.getContent(),n=0,e=e.right}const s=t[n++];return t.length<=n&&(t=null),
{done:!1,value:s}}}},Wm=(r,e)=>{const t=Ra(r,e);let n=r._start;for(t!==null&&(n=t.p,e-=t.index);n!==null;n=n.right)if(!n.
deleted&&n.countable){if(e<n.length)return n.content.getContent()[e];e-=n.length}},Bo=(r,e,t,n)=>{let s=t;const i=r.doc,
o=i.clientID,a=i.store,c=t===null?e._start:t.right;let l=[];const u=()=>{l.length>0&&(s=new Te(ne(o,De(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new hn(l)),s.integrate(r,0),l=[])};n.forEach(h=>{if(h===null)l.push(h);else switch(h.constructor){case Number:case Object:case Boolean:case Array:case String:
l.push(h);break;default:switch(u(),h.constructor){case Uint8Array:case ArrayBuffer:s=new Te(ne(o,De(a,o)),s,s&&s.lastId,
c,c&&c.id,e,null,new Si(new Uint8Array(h))),s.integrate(r,0);break;case is:s=new Te(ne(o,De(a,o)),s,s&&s.lastId,c,c&&c.id,
e,null,new Ai(h)),s.integrate(r,0);break;default:if(h instanceof Oe)s=new Te(ne(o,De(a,o)),s,s&&s.lastId,c,c&&c.id,e,null,
new kr(h)),s.integrate(r,0);else throw new Error("Unexpected content type in insert operation")}}}),u()},Vm=yr("Length e\
xceeded!"),Hm=(r,e,t,n)=>{if(t>e._length)throw Vm;if(t===0)return e._searchMarker&&si(e._searchMarker,t,n.length),Bo(r,e,
null,n);const s=t,i=Ra(e,t);let o=e._start;for(i!==null&&(o=i.p,t-=i.index,t===0&&(o=o.prev,t+=o&&o.countable&&!o.deleted?
o.length:0));o!==null;o=o.right)if(!o.deleted&&o.countable){if(t<=o.length){t<o.length&&Zr(r,ne(o.id.client,o.id.clock+t));
break}t-=o.length}return e._searchMarker&&si(e._searchMarker,s,n.length),Bo(r,e,o,n)},y1=(r,e,t)=>{let s=(e._searchMarker||
[]).reduce((i,o)=>o.index>i.index?o:i,{index:0,p:e._start}).p;if(s)for(;s.right;)s=s.right;return Bo(r,e,s,t)},Km=(r,e,t,n)=>{
if(n===0)return;const s=t,i=n,o=Ra(e,t);let a=e._start;for(o!==null&&(a=o.p,t-=o.index);a!==null&&t>0;a=a.right)!a.deleted&&
a.countable&&(t<a.length&&Zr(r,ne(a.id.client,a.id.clock+t)),t-=a.length);for(;n>0&&a!==null;)a.deleted||(n<a.length&&Zr(
r,ne(a.id.client,a.id.clock+n)),a.delete(r),n-=a.length),a=a.right;if(n>0)throw Vm;e._searchMarker&&si(e._searchMarker,s,
-i+n)},Lo=(r,e,t)=>{const n=e._map.get(t);n!==void 0&&n.delete(r)},Fu=(r,e,t,n)=>{const s=e._map.get(t)||null,i=r.doc,o=i.
clientID;let a;if(n==null)a=new hn([n]);else switch(n.constructor){case Number:case Object:case Boolean:case Array:case String:
a=new hn([n]);break;case Uint8Array:a=new Si(n);break;case is:a=new Ai(n);break;default:if(n instanceof Oe)a=new kr(n);else
throw new Error("Unexpected content type")}new Te(ne(o,De(i.store,o)),s,s&&s.lastId,null,null,e,t,a).integrate(r,0)},Ou=(r,e)=>{
const t=r._map.get(e);return t!==void 0&&!t.deleted?t.content.getContent()[t.length-1]:void 0},Qm=r=>{const e={};return r.
_map.forEach((t,n)=>{t.deleted||(e[n]=t.content.getContent()[t.length-1])}),e},Jm=(r,e)=>{const t=r._map.get(e);return t!==
void 0&&!t.deleted},Ni=r=>N0(r.entries(),e=>!e[1].deleted);class w1 extends Ma{constructor(e,t){super(e,t),this._transaction=
t}}class On extends Oe{constructor(){super(),this._prelimContent=[],this._searchMarker=[]}static from(e){const t=new On;
return t.push(e),t}_integrate(e,t){super._integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){
return new On}clone(){const e=new On;return e.insert(0,this.toArray().map(t=>t instanceof Oe?t.clone():t)),e}get length(){
return this._prelimContent===null?this._length:this._prelimContent.length}_callObserver(e,t){super._callObserver(e,t),Ba(
this,e,new w1(this,e))}insert(e,t){this.doc!==null?pe(this.doc,n=>{Hm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}push(e){
this.doc!==null?pe(this.doc,t=>{y1(t,this,e)}):this._prelimContent.push(...e)}unshift(e){this.insert(0,e)}delete(e,t=1){
this.doc!==null?pe(this.doc,n=>{Km(n,this,e,t)}):this._prelimContent.splice(e,t)}get(e){return Wm(this,e)}toArray(){return jm(
this)}slice(e=0,t=this.length){return qm(this,e,t)}toJSON(){return this.map(e=>e instanceof Oe?e.toJSON():e)}map(e){return Gm(
this,e)}forEach(e){ii(this,e)}[Symbol.iterator](){return b1(this)}_write(e){e.writeTypeRef(q1)}}const k1=r=>new On;class E1 extends Ma{constructor(e,t,n){
super(e,t),this.keysChanged=n}}class gr extends Oe{constructor(e){super(),this._prelimContent=null,e===void 0?this._prelimContent=
new Map:this._prelimContent=new Map(e)}_integrate(e,t){super._integrate(e,t),this._prelimContent.forEach((n,s)=>{this.set(
s,n)}),this._prelimContent=null}_copy(){return new gr}clone(){const e=new gr;return this.forEach((t,n)=>{e.set(n,t instanceof
Oe?t.clone():t)}),e}_callObserver(e,t){Ba(this,e,new E1(this,e,t))}toJSON(){const e={};return this._map.forEach((t,n)=>{
if(!t.deleted){const s=t.content.getContent()[t.length-1];e[n]=s instanceof Oe?s.toJSON():s}}),e}get size(){return[...Ni(
this._map)].length}keys(){return cc(Ni(this._map),e=>e[0])}values(){return cc(Ni(this._map),e=>e[1].content.getContent()[e[1].
length-1])}entries(){return cc(Ni(this._map),e=>[e[0],e[1].content.getContent()[e[1].length-1]])}forEach(e){this._map.forEach(
(t,n)=>{t.deleted||e(t.content.getContent()[t.length-1],n,this)})}[Symbol.iterator](){return this.entries()}delete(e){this.
doc!==null?pe(this.doc,t=>{Lo(t,this,e)}):this._prelimContent.delete(e)}set(e,t){return this.doc!==null?pe(this.doc,n=>{
Fu(n,this,e,t)}):this._prelimContent.set(e,t),t}get(e){return Ou(this,e)}has(e){return Jm(this,e)}clear(){this.doc!==null?
pe(this.doc,e=>{this.forEach(function(t,n,s){Lo(e,s,n)})}):this._prelimContent.clear()}_write(e){e.writeTypeRef(j1)}}const x1=r=>new gr,
Hr=(r,e)=>r===e||typeof r=="object"&&typeof e=="object"&&r&&e&&Nw(r,e);class xl{constructor(e,t,n,s){this.left=e,this.right=
t,this.index=n,this.currentAttributes=s}forward(){switch(this.right===null&&Dt(),this.right.content.constructor){case Me:
this.right.deleted||os(this.currentAttributes,this.right.content);break;default:this.right.deleted||(this.index+=this.right.
length);break}this.left=this.right,this.right=this.right.right}}const sh=(r,e,t)=>{for(;e.right!==null&&t>0;){switch(e.right.
content.constructor){case Me:e.right.deleted||os(e.currentAttributes,e.right.content);break;default:e.right.deleted||(t<
e.right.length&&Zr(r,ne(e.right.id.client,e.right.id.clock+t)),e.index+=e.right.length,t-=e.right.length);break}e.left=e.
right,e.right=e.right.right}return e},Ui=(r,e,t)=>{const n=new Map,s=Ra(e,t);if(s){const i=new xl(s.p.left,s.p,s.index,n);
return sh(r,i,t-s.index)}else{const i=new xl(null,e._start,0,n);return sh(r,i,t)}},Xm=(r,e,t,n)=>{for(;t.right!==null&&(t.
right.deleted===!0||t.right.content.constructor===Me&&Hr(n.get(t.right.content.key),t.right.content.value));)t.right.deleted||
n.delete(t.right.content.key),t.forward();const s=r.doc,i=s.clientID;n.forEach((o,a)=>{const c=t.left,l=t.right,u=new Te(
ne(i,De(s.store,i)),c,c&&c.lastId,l,l&&l.id,e,null,new Me(a,o));u.integrate(r,0),t.right=u,t.forward()})},os=(r,e)=>{const{
key:t,value:n}=e;n===null?r.delete(t):r.set(t,n)},Ym=(r,e)=>{for(;r.right!==null;){if(!(r.right.deleted||r.right.content.
constructor===Me&&Hr(e[r.right.content.key]||null,r.right.content.value)))break;r.forward()}},Zm=(r,e,t,n)=>{const s=r.doc,
i=s.clientID,o=new Map;for(const a in n){const c=n[a],l=t.currentAttributes.get(a)||null;if(!Hr(l,c)){o.set(a,l);const{left:u,
right:h}=t;t.right=new Te(ne(i,De(s.store,i)),u,u&&u.lastId,h,h&&h.id,e,null,new Me(a,c)),t.right.integrate(r,0),t.forward()}}
return o},uc=(r,e,t,n,s)=>{t.currentAttributes.forEach((d,p)=>{s[p]===void 0&&(s[p]=null)});const i=r.doc,o=i.clientID;Ym(
t,s);const a=Zm(r,e,t,s),c=n.constructor===String?new Yt(n):n instanceof Oe?new kr(n):new yn(n);let{left:l,right:u,index:h}=t;
e._searchMarker&&si(e._searchMarker,t.index,c.getLength()),u=new Te(ne(o,De(i.store,o)),l,l&&l.lastId,u,u&&u.id,e,null,c),
u.integrate(r,0),t.right=u,t.index=h,t.forward(),Xm(r,e,t,a)},ih=(r,e,t,n,s)=>{const i=r.doc,o=i.clientID;Ym(t,s);const a=Zm(
r,e,t,s);e:for(;t.right!==null&&(n>0||a.size>0&&(t.right.deleted||t.right.content.constructor===Me));){if(!t.right.deleted)
switch(t.right.content.constructor){case Me:{const{key:c,value:l}=t.right.content,u=s[c];if(u!==void 0){if(Hr(u,l))a.delete(
c);else{if(n===0)break e;a.set(c,l)}t.right.delete(r)}else t.currentAttributes.set(c,l);break}default:n<t.right.length&&
Zr(r,ne(t.right.id.client,t.right.id.clock+n)),n-=t.right.length;break}t.forward()}if(n>0){let c="";for(;n>0;n--)c+=`
`;t.right=new Te(ne(o,De(i.store,o)),t.left,t.left&&t.left.lastId,t.right,t.right&&t.right.id,e,null,new Yt(c)),t.right.
integrate(r,0),t.forward()}Xm(r,e,t,a)},eg=(r,e,t,n,s)=>{let i=e;const o=Ot();for(;i&&(!i.countable||i.deleted);){if(!i.
deleted&&i.content.constructor===Me){const l=i.content;o.set(l.key,l)}i=i.right}let a=0,c=!1;for(;e!==i;){if(t===e&&(c=!0),
!e.deleted){const l=e.content;switch(l.constructor){case Me:{const{key:u,value:h}=l,d=n.get(u)||null;(o.get(u)!==l||d===
h)&&(e.delete(r),a++,!c&&(s.get(u)||null)===h&&d!==h&&(d===null?s.delete(u):s.set(u,d))),!c&&!e.deleted&&os(s,l);break}}}
e=e.right}return a},v1=(r,e)=>{for(;e&&e.right&&(e.right.deleted||!e.right.countable);)e=e.right;const t=new Set;for(;e&&
(e.deleted||!e.countable);){if(!e.deleted&&e.content.constructor===Me){const n=e.content.key;t.has(n)?e.delete(r):t.add(
n)}e=e.left}},S1=r=>{let e=0;return pe(r.doc,t=>{let n=r._start,s=r._start,i=Ot();const o=hl(i);for(;s;){if(s.deleted===
!1)switch(s.content.constructor){case Me:os(o,s.content);break;default:e+=eg(t,n,s,i,o),i=hl(o),n=s;break}s=s.right}}),e},
oh=(r,e,t)=>{const n=t,s=hl(e.currentAttributes),i=e.right;for(;t>0&&e.right!==null;){if(e.right.deleted===!1)switch(e.right.
content.constructor){case kr:case yn:case Yt:t<e.right.length&&Zr(r,ne(e.right.id.client,e.right.id.clock+t)),t-=e.right.
length,e.right.delete(r);break}e.forward()}i&&eg(r,i,e.right,s,e.currentAttributes);const o=(e.left||e.right).parent;return o.
_searchMarker&&si(o._searchMarker,e.index,-n+t),e};class A1 extends Ma{constructor(e,t,n){super(e,t),this.childListChanged=
!1,this.keysChanged=new Set,n.forEach(s=>{s===null?this.childListChanged=!0:this.keysChanged.add(s)})}get changes(){if(this.
_changes===null){const e={keys:this.keys,delta:this.delta,added:new Set,deleted:new Set};this._changes=e}return this._changes}get delta(){
if(this._delta===null){const e=this.target.doc,t=[];pe(e,n=>{const s=new Map,i=new Map;let o=this.target._start,a=null;const c={};
let l="",u=0,h=0;const d=()=>{if(a!==null){let p=null;switch(a){case"delete":h>0&&(p={delete:h}),h=0;break;case"insert":
(typeof l=="object"||l.length>0)&&(p={insert:l},s.size>0&&(p.attributes={},s.forEach((m,y)=>{m!==null&&(p.attributes[y]=
m)}))),l="";break;case"retain":u>0&&(p={retain:u},$w(c)||(p.attributes=Dw({},c))),u=0;break}p&&t.push(p),a=null}};for(;o!==
null;){switch(o.content.constructor){case kr:case yn:this.adds(o)?this.deletes(o)||(d(),a="insert",l=o.content.getContent()[0],
d()):this.deletes(o)?(a!=="delete"&&(d(),a="delete"),h+=1):o.deleted||(a!=="retain"&&(d(),a="retain"),u+=1);break;case Yt:
this.adds(o)?this.deletes(o)||(a!=="insert"&&(d(),a="insert"),l+=o.content.str):this.deletes(o)?(a!=="delete"&&(d(),a="d\
elete"),h+=o.length):o.deleted||(a!=="retain"&&(d(),a="retain"),u+=o.length);break;case Me:{const{key:p,value:m}=o.content;
if(this.adds(o)){if(!this.deletes(o)){const y=s.get(p)||null;Hr(y,m)?m!==null&&o.delete(n):(a==="retain"&&d(),Hr(m,i.get(
p)||null)?delete c[p]:c[p]=m)}}else if(this.deletes(o)){i.set(p,m);const y=s.get(p)||null;Hr(y,m)||(a==="retain"&&d(),c[p]=
y)}else if(!o.deleted){i.set(p,m);const y=c[p];y!==void 0&&(Hr(y,m)?y!==null&&o.delete(n):(a==="retain"&&d(),m===null?delete c[p]:
c[p]=m))}o.deleted||(a==="insert"&&d(),os(s,o.content));break}}o=o.right}for(d();t.length>0;){const p=t[t.length-1];if(p.
retain!==void 0&&p.attributes===void 0)t.pop();else break}}),this._delta=t}return this._delta}}class Yn extends Oe{constructor(e){
super(),this._pending=e!==void 0?[()=>this.insert(0,e)]:[],this._searchMarker=[]}get length(){return this._length}_integrate(e,t){
super._integrate(e,t);try{this._pending.forEach(n=>n())}catch(n){console.error(n)}this._pending=null}_copy(){return new Yn}clone(){
const e=new Yn;return e.applyDelta(this.toDelta()),e}_callObserver(e,t){super._callObserver(e,t);const n=new A1(this,e,t),
s=e.doc;if(Ba(this,e,n),!e.local){let i=!1;for(const[o,a]of e.afterState.entries()){const c=e.beforeState.get(o)||0;if(a!==
c&&(Nm(e,s.store.clients.get(o),c,a,l=>{!l.deleted&&l.content.constructor===Me&&(i=!0)}),i))break}i||wl(e,e.deleteSet,o=>{
o instanceof Rt||i||o.parent===this&&o.content.constructor===Me&&(i=!0)}),pe(s,o=>{i?S1(this):wl(o,o.deleteSet,a=>{a instanceof
Rt||a.parent===this&&v1(o,a)})})}}toString(){let e="",t=this._start;for(;t!==null;)!t.deleted&&t.countable&&t.content.constructor===
Yt&&(e+=t.content.str),t=t.right;return e}toJSON(){return this.toString()}applyDelta(e,{sanitize:t=!0}={}){this.doc!==null?
pe(this.doc,n=>{const s=new xl(null,this._start,0,new Map);for(let i=0;i<e.length;i++){const o=e[i];if(o.insert!==void 0){
const a=!t&&typeof o.insert=="string"&&i===e.length-1&&s.right===null&&o.insert.slice(-1)===`
`?o.insert.slice(0,-1):o.insert;(typeof a!="string"||a.length>0)&&uc(n,this,s,a,o.attributes||{})}else o.retain!==void 0?
ih(n,this,s,o.retain,o.attributes||{}):o.delete!==void 0&&oh(n,s,o.delete)}}):this._pending.push(()=>this.applyDelta(e))}toDelta(e,t,n){
const s=[],i=new Map,o=this.doc;let a="",c=this._start;function l(){if(a.length>0){const h={};let d=!1;i.forEach((m,y)=>{
d=!0,h[y]=m});const p={insert:a};d&&(p.attributes=h),s.push(p),a=""}}const u=()=>{for(;c!==null;){if(bs(c,e)||t!==void 0&&
bs(c,t))switch(c.content.constructor){case Yt:{const h=i.get("ychange");e!==void 0&&!bs(c,e)?(h===void 0||h.user!==c.id.
client||h.type!=="removed")&&(l(),i.set("ychange",n?n("removed",c.id):{type:"removed"})):t!==void 0&&!bs(c,t)?(h===void 0||
h.user!==c.id.client||h.type!=="added")&&(l(),i.set("ychange",n?n("added",c.id):{type:"added"})):h!==void 0&&(l(),i.delete(
"ychange")),a+=c.content.str;break}case kr:case yn:{l();const h={insert:c.content.getContent()[0]};if(i.size>0){const d={};
h.attributes=d,i.forEach((p,m)=>{d[m]=p})}s.push(h);break}case Me:bs(c,e)&&(l(),os(i,c.content));break}c=c.right}l()};return e||
t?pe(o,h=>{e&&kl(h,e),t&&kl(h,t),u()},"cleanup"):u(),s}insert(e,t,n){if(t.length<=0)return;const s=this.doc;s!==null?pe(
s,i=>{const o=Ui(i,this,e);n||(n={},o.currentAttributes.forEach((a,c)=>{n[c]=a})),uc(i,this,o,t,n)}):this._pending.push(
()=>this.insert(e,t,n))}insertEmbed(e,t,n={}){const s=this.doc;s!==null?pe(s,i=>{const o=Ui(i,this,e);uc(i,this,o,t,n)}):
this._pending.push(()=>this.insertEmbed(e,t,n))}delete(e,t){if(t===0)return;const n=this.doc;n!==null?pe(n,s=>{oh(s,Ui(s,
this,e),t)}):this._pending.push(()=>this.delete(e,t))}format(e,t,n){if(t===0)return;const s=this.doc;s!==null?pe(s,i=>{const o=Ui(
i,this,e);o.right!==null&&ih(i,this,o,t,n)}):this._pending.push(()=>this.format(e,t,n))}removeAttribute(e){this.doc!==null?
pe(this.doc,t=>{Lo(t,this,e)}):this._pending.push(()=>this.removeAttribute(e))}setAttribute(e,t){this.doc!==null?pe(this.
doc,n=>{Fu(n,this,e,t)}):this._pending.push(()=>this.setAttribute(e,t))}getAttribute(e){return Ou(this,e)}getAttributes(){
return Qm(this)}_write(e){e.writeTypeRef(G1)}}const _1=r=>new Yn;class dc{constructor(e,t=()=>!0){this._filter=t,this._root=
e,this._currentNode=e._start,this._firstCall=!0}[Symbol.iterator](){return this}next(){let e=this._currentNode,t=e&&e.content&&
e.content.type;if(e!==null&&(!this._firstCall||e.deleted||!this._filter(t)))do if(t=e.content.type,!e.deleted&&(t.constructor===
oi||t.constructor===dn)&&t._start!==null)e=t._start;else for(;e!==null;)if(e.right!==null){e=e.right;break}else e.parent===
this._root?e=null:e=e.parent._item;while(e!==null&&(e.deleted||!this._filter(e.content.type)));return this._firstCall=!1,
e===null?{value:void 0,done:!0}:(this._currentNode=e,{value:e.content.type,done:!1})}}class dn extends Oe{constructor(){
super(),this._prelimContent=[]}get firstChild(){const e=this._first;return e?e.content.getContent()[0]:null}_integrate(e,t){
super._integrate(e,t),this.insert(0,this._prelimContent),this._prelimContent=null}_copy(){return new dn}clone(){const e=new dn;
return e.insert(0,this.toArray().map(t=>t instanceof Oe?t.clone():t)),e}get length(){return this._prelimContent===null?this.
_length:this._prelimContent.length}createTreeWalker(e){return new dc(this,e)}querySelector(e){e=e.toUpperCase();const n=new dc(
this,s=>s.nodeName&&s.nodeName.toUpperCase()===e).next();return n.done?null:n.value}querySelectorAll(e){return e=e.toUpperCase(),
Yr(new dc(this,t=>t.nodeName&&t.nodeName.toUpperCase()===e))}_callObserver(e,t){Ba(this,e,new T1(this,t,e))}toString(){return Gm(
this,e=>e.toString()).join("")}toJSON(){return this.toString()}toDOM(e=document,t={},n){const s=e.createDocumentFragment();
return n!==void 0&&n._createAssociation(s,this),ii(this,i=>{s.insertBefore(i.toDOM(e,t,n),null)}),s}insert(e,t){this.doc!==
null?pe(this.doc,n=>{Hm(n,this,e,t)}):this._prelimContent.splice(e,0,...t)}insertAfter(e,t){if(this.doc!==null)pe(this.doc,
n=>{const s=e&&e instanceof Oe?e._item:e;Bo(n,this,s,t)});else{const n=this._prelimContent,s=e===null?0:n.findIndex(i=>i===
e)+1;if(s===0&&e!==null)throw yr("Reference item not found");n.splice(s,0,...t)}}delete(e,t=1){this.doc!==null?pe(this.doc,
n=>{Km(n,this,e,t)}):this._prelimContent.splice(e,t)}toArray(){return jm(this)}push(e){this.insert(this.length,e)}unshift(e){
this.insert(0,e)}get(e){return Wm(this,e)}slice(e=0,t=this.length){return qm(this,e,t)}forEach(e){ii(this,e)}_write(e){e.
writeTypeRef(V1)}}const I1=r=>new dn;class oi extends dn{constructor(e="UNDEFINED"){super(),this.nodeName=e,this._prelimAttrs=
new Map}get nextSibling(){const e=this._item?this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this.
_item?this._item.prev:null;return e?e.content.type:null}_integrate(e,t){super._integrate(e,t),this._prelimAttrs.forEach(
(n,s)=>{this.setAttribute(s,n)}),this._prelimAttrs=null}_copy(){return new oi(this.nodeName)}clone(){const e=new oi(this.
nodeName),t=this.getAttributes();for(const n in t)e.setAttribute(n,t[n]);return e.insert(0,this.toArray().map(n=>n instanceof
Oe?n.clone():n)),e}toString(){const e=this.getAttributes(),t=[],n=[];for(const a in e)n.push(a);n.sort();const s=n.length;
for(let a=0;a<s;a++){const c=n[a];t.push(c+'="'+e[c]+'"')}const i=this.nodeName.toLocaleLowerCase(),o=t.length>0?" "+t.join(
" "):"";return`<${i}${o}>${super.toString()}</${i}>`}removeAttribute(e){this.doc!==null?pe(this.doc,t=>{Lo(t,this,e)}):this.
_prelimAttrs.delete(e)}setAttribute(e,t){this.doc!==null?pe(this.doc,n=>{Fu(n,this,e,t)}):this._prelimAttrs.set(e,t)}getAttribute(e){
return Ou(this,e)}hasAttribute(e){return Jm(this,e)}getAttributes(){return Qm(this)}toDOM(e=document,t={},n){const s=e.createElement(
this.nodeName),i=this.getAttributes();for(const o in i)s.setAttribute(o,i[o]);return ii(this,o=>{s.appendChild(o.toDOM(e,
t,n))}),n!==void 0&&n._createAssociation(s,this),s}_write(e){e.writeTypeRef(W1),e.writeKey(this.nodeName)}}const C1=r=>new oi(
r.readKey());class T1 extends Ma{constructor(e,t,n){super(e,n),this.childListChanged=!1,this.attributesChanged=new Set,t.
forEach(s=>{s===null?this.childListChanged=!0:this.attributesChanged.add(s)})}}class Do extends gr{constructor(e){super(),
this.hookName=e}_copy(){return new Do(this.hookName)}clone(){const e=new Do(this.hookName);return this.forEach((t,n)=>{e.
set(n,t)}),e}toDOM(e=document,t={},n){const s=t[this.hookName];let i;return s!==void 0?i=s.createDom(this):i=document.createElement(
this.hookName),i.setAttribute("data-yjs-hook",this.hookName),n!==void 0&&n._createAssociation(i,this),i}_write(e){e.writeTypeRef(
H1),e.writeKey(this.hookName)}}const M1=r=>new Do(r.readKey());class Po extends Yn{get nextSibling(){const e=this._item?
this._item.next:null;return e?e.content.type:null}get prevSibling(){const e=this._item?this._item.prev:null;return e?e.content.
type:null}_copy(){return new Po}clone(){const e=new Po;return e.applyDelta(this.toDelta()),e}toDOM(e=document,t,n){const s=e.
createTextNode(this.toString());return n!==void 0&&n._createAssociation(s,this),s}toString(){return this.toDelta().map(e=>{
const t=[];for(const s in e.attributes){const i=[];for(const o in e.attributes[s])i.push({key:o,value:e.attributes[s][o]});
i.sort((o,a)=>o.key<a.key?-1:1),t.push({nodeName:s,attrs:i})}t.sort((s,i)=>s.nodeName<i.nodeName?-1:1);let n="";for(let s=0;s<
t.length;s++){const i=t[s];n+=`<${i.nodeName}`;for(let o=0;o<i.attrs.length;o++){const a=i.attrs[o];n+=` ${a.key}="${a.value}\
"`}n+=">"}n+=e.insert;for(let s=t.length-1;s>=0;s--)n+=`</${t[s].nodeName}>`;return n}).join("")}toJSON(){return this.toString()}_write(e){
e.writeTypeRef(K1)}}const R1=r=>new Po;class zu{constructor(e,t){this.id=e,this.length=t}get deleted(){throw zt()}mergeWith(e){
return!1}write(e,t,n){throw zt()}integrate(e,t){throw zt()}}const B1=0;class Rt extends zu{get deleted(){return!0}delete(){}mergeWith(e){
return this.constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){t>0&&(this.id.clock+=t,this.length-=
t),$m(e.doc.store,this)}write(e,t){e.writeInfo(B1),e.writeLen(this.length-t)}getMissing(e,t){return null}}class Si{constructor(e){
this.content=e}getLength(){return 1}getContent(){return[this.content]}isCountable(){return!0}copy(){return new Si(this.content)}splice(e){
throw zt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeBuf(this.content)}getRef(){return 3}}
const L1=r=>new Si(r.readBuf());class ai{constructor(e){this.len=e}getLength(){return this.len}getContent(){return[]}isCountable(){
return!1}copy(){return new ai(this.len)}splice(e){const t=new ai(this.len-e);return this.len=e,t}mergeWith(e){return this.
len+=e.len,!0}integrate(e,t){To(e.deleteSet,t.id.client,t.id.clock,this.len),t.markDeleted()}delete(e){}gc(e){}write(e,t){
e.writeLen(this.len-t)}getRef(){return 1}}const D1=r=>new ai(r.readLen()),tg=(r,e)=>new is({guid:r,...e,shouldLoad:e.shouldLoad||
e.autoLoad||!1});class Ai{constructor(e){e._item&&console.error("This document was already integrated as a sub-document.\
 You should create a second instance instead with the same guid."),this.doc=e;const t={};this.opts=t,e.gc||(t.gc=!1),e.autoLoad&&
(t.autoLoad=!0),e.meta!==null&&(t.meta=e.meta)}getLength(){return 1}getContent(){return[this.doc]}isCountable(){return!0}copy(){
return new Ai(tg(this.doc.guid,this.opts))}splice(e){throw zt()}mergeWith(e){return!1}integrate(e,t){this.doc._item=t,e.
subdocsAdded.add(this.doc),this.doc.shouldLoad&&e.subdocsLoaded.add(this.doc)}delete(e){e.subdocsAdded.has(this.doc)?e.subdocsAdded.
delete(this.doc):e.subdocsRemoved.add(this.doc)}gc(e){}write(e,t){e.writeString(this.doc.guid),e.writeAny(this.opts)}getRef(){
return 9}}const P1=r=>new Ai(tg(r.readString(),r.readAny()));class yn{constructor(e){this.embed=e}getLength(){return 1}getContent(){
return[this.embed]}isCountable(){return!0}copy(){return new yn(this.embed)}splice(e){throw zt()}mergeWith(e){return!1}integrate(e,t){}delete(e){}gc(e){}write(e,t){
e.writeJSON(this.embed)}getRef(){return 5}}const $1=r=>new yn(r.readJSON());class Me{constructor(e,t){this.key=e,this.value=
t}getLength(){return 1}getContent(){return[]}isCountable(){return!1}copy(){return new Me(this.key,this.value)}splice(e){
throw zt()}mergeWith(e){return!1}integrate(e,t){t.parent._searchMarker=null}delete(e){}gc(e){}write(e,t){e.writeKey(this.
key),e.writeJSON(this.value)}getRef(){return 6}}const N1=r=>new Me(r.readKey(),r.readJSON());class $o{constructor(e){this.
arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new $o(this.arr)}splice(e){
const t=new $o(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.arr.concat(e.arr),
!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<n;s++){const i=this.
arr[s];e.writeString(i===void 0?"undefined":JSON.stringify(i))}}getRef(){return 2}}const U1=r=>{const e=r.readLen(),t=[];
for(let n=0;n<e;n++){const s=r.readString();s==="undefined"?t.push(void 0):t.push(JSON.parse(s))}return new $o(t)};class hn{constructor(e){
this.arr=e}getLength(){return this.arr.length}getContent(){return this.arr}isCountable(){return!0}copy(){return new hn(this.
arr)}splice(e){const t=new hn(this.arr.slice(e));return this.arr=this.arr.slice(0,e),t}mergeWith(e){return this.arr=this.
arr.concat(e.arr),!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){const n=this.arr.length;e.writeLen(n-t);for(let s=t;s<
n;s++){const i=this.arr[s];e.writeAny(i)}}getRef(){return 8}}const F1=r=>{const e=r.readLen(),t=[];for(let n=0;n<e;n++)t.
push(r.readAny());return new hn(t)};class Yt{constructor(e){this.str=e}getLength(){return this.str.length}getContent(){return this.
str.split("")}isCountable(){return!0}copy(){return new Yt(this.str)}splice(e){const t=new Yt(this.str.slice(e));this.str=
this.str.slice(0,e);const n=this.str.charCodeAt(e-1);return n>=55296&&n<=56319&&(this.str=this.str.slice(0,e-1)+"�",t.
str="�"+t.str.slice(1)),t}mergeWith(e){return this.str+=e.str,!0}integrate(e,t){}delete(e){}gc(e){}write(e,t){e.writeString(
t===0?this.str:this.str.slice(t))}getRef(){return 4}}const O1=r=>new Yt(r.readString()),z1=[k1,x1,_1,C1,I1,M1,R1],q1=0,j1=1,
G1=2,W1=3,V1=4,H1=5,K1=6;class kr{constructor(e){this.type=e}getLength(){return 1}getContent(){return[this.type]}isCountable(){
return!0}copy(){return new kr(this.type._copy())}splice(e){throw zt()}mergeWith(e){return!1}integrate(e,t){this.type._integrate(
e.doc,t)}delete(e){let t=this.type._start;for(;t!==null;)t.deleted?e._mergeStructs.push(t):t.delete(e),t=t.right;this.type.
_map.forEach(n=>{n.deleted?e._mergeStructs.push(n):n.delete(e)}),e.changed.delete(this.type)}gc(e){let t=this.type._start;
for(;t!==null;)t.gc(e,!0),t=t.right;this.type._start=null,this.type._map.forEach(n=>{for(;n!==null;)n.gc(e,!0),n=n.left}),
this.type._map=new Map}write(e,t){this.type._write(e)}getRef(){return 7}}const Q1=r=>new kr(z1[r.readTypeRef()](r)),No=(r,e,t)=>{
const{client:n,clock:s}=e.id,i=new Te(ne(n,s+t),e,ne(n,s+t-1),e.right,e.rightOrigin,e.parent,e.parentSub,e.content.splice(
t));return e.deleted&&i.markDeleted(),e.keep&&(i.keep=!0),e.redone!==null&&(i.redone=ne(e.redone.client,e.redone.clock+t)),
e.right=i,i.right!==null&&(i.right.left=i),r._mergeStructs.push(i),i.parentSub!==null&&i.right===null&&i.parent._map.set(
i.parentSub,i),e.length=t,i};class Te extends zu{constructor(e,t,n,s,i,o,a,c){super(e,c.getLength()),this.origin=n,this.
left=t,this.right=s,this.rightOrigin=i,this.parent=o,this.parentSub=a,this.redone=null,this.content=c,this.info=this.content.
isCountable()?Od:0}set marker(e){(this.info&nc)>0!==e&&(this.info^=nc)}get marker(){return(this.info&nc)>0}get keep(){return(this.
info&Fd)>0}set keep(e){this.keep!==e&&(this.info^=Fd)}get countable(){return(this.info&Od)>0}get deleted(){return(this.info&
rc)>0}set deleted(e){this.deleted!==e&&(this.info^=rc)}markDeleted(){this.info|=rc}getMissing(e,t){if(this.origin&&this.
origin.client!==this.id.client&&this.origin.clock>=De(t,this.origin.client))return this.origin.client;if(this.rightOrigin&&
this.rightOrigin.client!==this.id.client&&this.rightOrigin.clock>=De(t,this.rightOrigin.client))return this.rightOrigin.
client;if(this.parent&&this.parent.constructor===Fn&&this.id.client!==this.parent.client&&this.parent.clock>=De(t,this.parent.
client))return this.parent.client;if(this.origin&&(this.left=th(e,t,this.origin),this.origin=this.left.lastId),this.rightOrigin&&
(this.right=Zr(e,this.rightOrigin),this.rightOrigin=this.right.id),(this.left&&this.left.constructor===Rt||this.right&&this.
right.constructor===Rt)&&(this.parent=null),!this.parent)this.left&&this.left.constructor===Te&&(this.parent=this.left.parent,
this.parentSub=this.left.parentSub),this.right&&this.right.constructor===Te&&(this.parent=this.right.parent,this.parentSub=
this.right.parentSub);else if(this.parent.constructor===Fn){const n=lc(t,this.parent);n.constructor===Rt?this.parent=null:
this.parent=n.content.type}return null}integrate(e,t){if(t>0&&(this.id.clock+=t,this.left=th(e,e.doc.store,ne(this.id.client,
this.id.clock-1)),this.origin=this.left.lastId,this.content=this.content.splice(t),this.length-=t),this.parent){if(!this.
left&&(!this.right||this.right.left!==null)||this.left&&this.left.right!==this.right){let n=this.left,s;if(n!==null)s=n.
right;else if(this.parentSub!==null)for(s=this.parent._map.get(this.parentSub)||null;s!==null&&s.left!==null;)s=s.left;else
s=this.parent._start;const i=new Set,o=new Set;for(;s!==null&&s!==this.right;){if(o.add(s),i.add(s),$i(this.origin,s.origin)){
if(s.id.client<this.id.client)n=s,i.clear();else if($i(this.rightOrigin,s.rightOrigin))break}else if(s.origin!==null&&o.
has(lc(e.doc.store,s.origin)))i.has(lc(e.doc.store,s.origin))||(n=s,i.clear());else break;s=s.right}this.left=n}if(this.
left!==null){const n=this.left.right;this.right=n,this.left.right=this}else{let n;if(this.parentSub!==null)for(n=this.parent.
_map.get(this.parentSub)||null;n!==null&&n.left!==null;)n=n.left;else n=this.parent._start,this.parent._start=this;this.
right=n}this.right!==null?this.right.left=this:this.parentSub!==null&&(this.parent._map.set(this.parentSub,this),this.left!==
null&&this.left.delete(e)),this.parentSub===null&&this.countable&&!this.deleted&&(this.parent._length+=this.length),$m(e.
doc.store,this),this.content.integrate(e,this),nh(e,this.parent,this.parentSub),(this.parent._item!==null&&this.parent._item.
deleted||this.parentSub!==null&&this.right!==null)&&this.delete(e)}else new Rt(this.id,this.length).integrate(e,0)}get next(){
let e=this.right;for(;e!==null&&e.deleted;)e=e.right;return e}get prev(){let e=this.left;for(;e!==null&&e.deleted;)e=e.left;
return e}get lastId(){return this.length===1?this.id:ne(this.id.client,this.id.clock+this.length-1)}mergeWith(e){if(this.
constructor===e.constructor&&$i(e.origin,this.lastId)&&this.right===e&&$i(this.rightOrigin,e.rightOrigin)&&this.id.client===
e.id.client&&this.id.clock+this.length===e.id.clock&&this.deleted===e.deleted&&this.redone===null&&e.redone===null&&this.
content.constructor===e.content.constructor&&this.content.mergeWith(e.content)){const t=this.parent._searchMarker;return t&&
t.forEach(n=>{n.p===e&&(n.p=this,!this.deleted&&this.countable&&(n.index-=this.length))}),e.keep&&(this.keep=!0),this.right=
e.right,this.right!==null&&(this.right.left=this),this.length+=e.length,!0}return!1}delete(e){if(!this.deleted){const t=this.
parent;this.countable&&this.parentSub===null&&(t._length-=this.length),this.markDeleted(),To(e.deleteSet,this.id.client,
this.id.clock,this.length),nh(e,t,this.parentSub),this.content.delete(e)}}gc(e,t){if(!this.deleted)throw Dt();this.content.
gc(e),t?n1(e,this,new Rt(this.id,this.length)):this.content=new ai(this.length)}write(e,t){const n=t>0?ne(this.id.client,
this.id.clock+t-1):this.origin,s=this.rightOrigin,i=this.parentSub,o=this.content.getRef()&wa|(n===null?0:xt)|(s===null?
0:mr)|(i===null?0:Xs);if(e.writeInfo(o),n!==null&&e.writeLeftID(n),s!==null&&e.writeRightID(s),n===null&&s===null){const a=this.
parent;if(a._item!==void 0){const c=a._item;if(c===null){const l=t1(a);e.writeParentInfo(!0),e.writeString(l)}else e.writeParentInfo(
!1),e.writeLeftID(c.id)}else a.constructor===String?(e.writeParentInfo(!0),e.writeString(a)):a.constructor===Fn?(e.writeParentInfo(
!1),e.writeLeftID(a)):Dt();i!==null&&e.writeString(i)}this.content.write(e,t)}}const rg=(r,e)=>J1[e&wa](r),J1=[()=>{Dt()},
D1,U1,L1,O1,$1,N1,Q1,F1,P1,()=>{Dt()}],X1=10;class Bt extends zu{get deleted(){return!0}delete(){}mergeWith(e){return this.
constructor!==e.constructor?!1:(this.length+=e.length,!0)}integrate(e,t){Dt()}write(e,t){e.writeInfo(X1),re(e.restEncoder,
this.length-t)}getMissing(e,t){return null}}const ng=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<
"u"?global:{},sg="__ $YJS$ __";ng[sg]===!0&&console.error("Yjs was already imported. This breaks constructor checks and \
will lead to issues! - https://github.com/yjs/yjs/issues/438");ng[sg]=!0;const wn=r=>Qn((e,t)=>{r.onerror=n=>t(new Error(
n.target.error)),r.onsuccess=n=>e(n.target.result)}),Y1=(r,e)=>Qn((t,n)=>{const s=indexedDB.open(r);s.onupgradeneeded=i=>e(
i.target.result),s.onerror=i=>n(yr(i.target.error)),s.onsuccess=i=>{const o=i.target.result;o.onversionchange=()=>{o.close()},
t(o)}}),Z1=r=>wn(indexedDB.deleteDatabase(r)),ek=(r,e)=>e.forEach(t=>r.createObjectStore.apply(r,t)),Ns=(r,e,t="readwrit\
e")=>{const n=r.transaction(e,t);return e.map(s=>ck(n,s))},ig=(r,e)=>wn(r.count(e)),tk=(r,e)=>wn(r.get(e)),og=(r,e)=>wn(
r.delete(e)),rk=(r,e,t)=>wn(r.put(e,t)),vl=(r,e)=>wn(r.add(e)),nk=(r,e,t)=>wn(r.getAll(e,t)),sk=(r,e,t)=>{let n=null;return ak(
r,e,s=>(n=s,!1),t).then(()=>n)},ik=(r,e=null)=>sk(r,e,"prev"),ok=(r,e)=>Qn((t,n)=>{r.onerror=n,r.onsuccess=async s=>{const i=s.
target.result;if(i===null||await e(i)===!1)return t();i.continue()}}),ak=(r,e,t,n="next")=>ok(r.openKeyCursor(e,n),s=>t(
s.key)),ck=(r,e)=>r.objectStore(e),lk=(r,e)=>IDBKeyRange.upperBound(r,e),uk=(r,e)=>IDBKeyRange.lowerBound(r,e),hc="custo\
m",ag="updates",cg=500,lg=(r,e=()=>{},t=()=>{})=>{const[n]=Ns(r.db,[ag]);return nk(n,uk(r._dbref,!1)).then(s=>{r._destroyed||
(e(n),pe(r.doc,()=>{s.forEach(i=>Mo(r.doc,i))},r,!1),t(n))}).then(()=>ik(n).then(s=>{r._dbref=s+1})).then(()=>ig(n).then(
s=>{r._dbsize=s})).then(()=>n)},dk=(r,e=!0)=>lg(r).then(t=>{(e||r._dbsize>=cg)&&vl(t,Du(r.doc)).then(()=>og(t,lk(r._dbref,
!0))).then(()=>ig(t).then(n=>{r._dbsize=n}))});class hk extends yu{constructor(e,t){super(),this.doc=t,this.name=e,this.
_dbref=0,this._dbsize=0,this._destroyed=!1,this.db=null,this.synced=!1,this._db=Y1(e,n=>ek(n,[["updates",{autoIncrement:!0}],
["custom"]])),this.whenSynced=Qn(n=>this.on("synced",()=>n(this))),this._db.then(n=>{this.db=n,lg(this,o=>vl(o,Du(t)),()=>{
if(this._destroyed)return this;this.synced=!0,this.emit("synced",[this])})}),this._storeTimeout=1e3,this._storeTimeoutId=
null,this._storeUpdate=(n,s)=>{if(this.db&&s!==this){const[i]=Ns(this.db,[ag]);vl(i,n),++this._dbsize>=cg&&(this._storeTimeoutId!==
null&&clearTimeout(this._storeTimeoutId),this._storeTimeoutId=setTimeout(()=>{dk(this,!1),this._storeTimeoutId=null},this.
_storeTimeout))}},t.on("update",this._storeUpdate),this.destroy=this.destroy.bind(this),t.on("destroy",this.destroy)}destroy(){
return this._storeTimeoutId&&clearTimeout(this._storeTimeoutId),this.doc.off("update",this._storeUpdate),this.doc.off("d\
estroy",this.destroy),this._destroyed=!0,this._db.then(e=>{e.close()})}clearData(){return this.destroy().then(()=>{Z1(this.
name)})}get(e){return this._db.then(t=>{const[n]=Ns(t,[hc],"readonly");return tk(n,e)})}set(e,t){return this._db.then(n=>{
const[s]=Ns(n,[hc]);return rk(s,t,e)})}del(e){return this._db.then(t=>{const[n]=Ns(t,[hc]);return og(n,e)})}}const ah="y\
js-update",ch="yjs-sync-request",lh="yjs-sync-response";function fc(r){return r instanceof Uint8Array?r:Array.isArray(r)?
new Uint8Array(r):r&&typeof r=="object"?new Uint8Array(Object.values(r)):new Uint8Array(0)}class fk extends yu{constructor(e,t,n={}){
super(),this.networkManager=e,this.doc=t,this.topic=n.topic||"peercompute-state-sync",this.peerId=n.peerId||e?.peerId||null,
this.initialSync=n.initialSync!==!1,this.syncRequestCounter=0,this.initialSyncTimer=null,this.awareness=null,this._onDocumentUpdate=
this._onDocumentUpdate.bind(this),this._onNetworkMessage=this._onNetworkMessage.bind(this),this.doc.on("update",this._onDocumentUpdate),
this.networkManager?.addMessageHandler&&this.networkManager.addMessageHandler(this._onNetworkMessage),this.initialSync&&
(this.initialSyncTimer=setTimeout(()=>{this.initialSyncTimer=null,this.requestSync().catch(s=>{console.error("[PeerCompu\
teProvider] Initial sync request failed",s)})},0)),console.log("[PeerComputeProvider] Initialized")}_getLocalPeerId(){return this.
peerId||this.networkManager?.peerId||this.networkManager?.getPeerId?.()||null}async requestSync(){if(typeof this.networkManager?.
broadcast!="function")return;const e=`${this._getLocalPeerId()||"peer"}:${Date.now()}:${++this.syncRequestCounter}`,t=Z0(
this.doc);await this.networkManager.broadcast({type:ch,data:{requestId:e,sourcePeerId:this._getLocalPeerId(),stateVector:Array.
from(t)}},{topic:this.topic})}async _sendSyncResponse(e,t={}){const n=fc(t.stateVector),s=Du(this.doc,n);if(s.byteLength===
0)return;const i={type:lh,data:{requestId:t.requestId||null,sourcePeerId:this._getLocalPeerId(),targetPeerId:e||t.sourcePeerId||
null,update:Array.from(s)}};if(e&&typeof this.networkManager?.sendToPeer=="function"){await this.networkManager.sendToPeer(
e,i);return}typeof this.networkManager?.broadcast=="function"&&await this.networkManager.broadcast(i,{topic:this.topic})}_onDocumentUpdate(e,t){
if(t!==this){if(typeof this.networkManager?.broadcast!="function")return;this.networkManager.broadcast({type:ah,data:Array.
from(e)},{topic:this.topic}).catch(n=>{console.error("[PeerComputeProvider] Broadcast failed",n)})}}_onNetworkMessage(e,t){
if(!(!t||e===this._getLocalPeerId())){if(t.type===ah){const n=fc(t.data);n.byteLength>0&&Mo(this.doc,n,this);return}if(t.
type===ch){this._sendSyncResponse(e,t.data||{}).catch(n=>{console.error("[PeerComputeProvider] Sync response failed",n)});
return}if(t.type===lh){const n=t.data?.targetPeerId||null,s=this._getLocalPeerId();if(n&&s&&n!==s)return;const i=fc(t.data?.
update);i.byteLength>0&&Mo(this.doc,i,this)}}}destroy(){this.initialSyncTimer&&(clearTimeout(this.initialSyncTimer),this.
initialSyncTimer=null),this.doc.off("update",this._onDocumentUpdate),this.networkManager=null}}class pk{constructor({ydoc:e,
stateMap:t,hotStore:n,deltaNamespace:s="deltas"}={}){if(!e||!t)throw new Error("[DataState] ydoc and stateMap are requir\
ed");this.ydoc=e,this.state=t,this.hotStore=n||new Map,this.deltaNamespace=s,this.localArtifactCaches=new Map,this.artifactStores=
new Map}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new gr,this.state.set(e,t)),t}commitDelta(e={}){const t=e.
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
length)throw new AggregateError(t,"Artifact storage cleanup failed");this.artifactStores.clear()}}const uh="peercompute.\
local-artifact.v1",mk="peercompute-local-artifacts-v1",Wt="artifacts",gk=64,bk=32*1024*1024,yk=8*1024*1024,dh=16*1024,hh=2048,
wk=96;function Ft(r,e,t){const n=new r(t);return n.code=e,n}function Sl(){if(typeof DOMException=="function")return new DOMException(
"The operation was aborted.","AbortError");const r=new Error("The operation was aborted.");return r.name="AbortError",r}
function ys(r){if(r?.aborted)throw r.reason??Sl()}function pc(r,e){if(!Number.isSafeInteger(r)||r<1)throw new RangeError(
`${e} must be a positive safe integer.`);return r}function Fi(r,e){if(!Number.isFinite(r)||r<0)throw new RangeError(`${e}\
 must be a finite non-negative timestamp.`);return r}function kk(r){const e=String(r??"").trim();if(!e||e.length>wk||!/^[a-z0-9][a-z0-9._-]*$/iu.
test(e))throw new TypeError("Local artifact cache name must be a short identifier containing letters, numbers, dot, dash\
, or underscore.");return e}function mc(r){const e=String(r??"");if(!e||e.length>hh)throw new TypeError(`Local artifact \
cache keys must contain 1-${hh} characters.`);return e}function ug(r,e){const t=String(r??"").trim();if(!t||t.length>256)
throw new TypeError(`${e} must be a non-empty string of at most 256 characters.`);return t}function Ek(r){const e=ug(r,"\
mediaType").split(";",1)[0].trim().toLowerCase();if(!/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/u.test(e))throw new TypeError(
"mediaType must be a valid MIME type.");return e}function fh(r){if(r instanceof Uint8Array)return r.slice();if(r instanceof
ArrayBuffer)return new Uint8Array(r.slice(0));if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength).
slice();throw new TypeError("Local artifact cache values must contain ArrayBuffer or typed-array bytes.")}function Us(r={}){
if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError("Local artifact metadata must be an object.");let e;try{
e=JSON.stringify(r)}catch{throw new TypeError("Local artifact metadata must be JSON-serializable.")}e===void 0&&(e="{}");
const t=new TextEncoder().encode(e).byteLength;if(t>dh)throw Ft(RangeError,"ERR_LOCAL_ARTIFACT_METADATA_TOO_LARGE",`Loca\
l artifact metadata exceeds the ${dh}-byte cap.`);const n=JSON.parse(e);if(!n||typeof n!="object"||Array.isArray(n))throw new TypeError(
"Local artifact metadata must serialize to an object.");return{metadata:n,byteLength:t}}async function ph(r){if(!globalThis.
crypto?.subtle?.digest)throw Ft(Error,"ERR_LOCAL_ARTIFACT_HASH_UNAVAILABLE","SHA-256 is unavailable; local artifacts can\
not be admitted without integrity metadata.");const e=await globalThis.crypto.subtle.digest("SHA-256",r);return`sha256:${Array.
from(new Uint8Array(e),t=>t.toString(16).padStart(2,"0")).join("")}`}function Al(r){return Object.freeze(Us(r).metadata)}
function Oi(r,e,t={}){return Object.freeze({bytes:r.bytes.slice(),metadata:Al(r.metadata),cacheStatus:e,...t})}function gc(r){
return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.onerror=()=>t(r.error??new Error("IndexedDB request failed."))})}
function zi(r){return new Promise((e,t)=>{r.oncomplete=()=>e(),r.onerror=()=>t(r.error??new Error("IndexedDB transaction\
 failed.")),r.onabort=()=>t(r.error??new Error("IndexedDB transaction aborted."))})}function bc(r,e){return`${r}\0${e}`}
class xk{constructor({name:e,maximumEntries:t=gk,maximumBytes:n=bk,maximumEntryBytes:s=Math.min(yk,n),persistent:i=!0,clock:o=Date.
now,indexedDBImpl:a=globalThis.indexedDB,onDestroy:c=null}={}){if(this.name=kk(e),this.maximumEntries=pc(t,"maximumEntri\
es"),this.maximumBytes=pc(n,"maximumBytes"),this.maximumEntryBytes=pc(s,"maximumEntryBytes"),this.maximumEntryBytes>this.
maximumBytes)throw new RangeError("maximumEntryBytes must not exceed maximumBytes.");if(typeof o!="function")throw new TypeError(
"clock must be a function.");if(c!==null&&typeof c!="function")throw new TypeError("onDestroy must be a function or null\
.");this.clock=o,this.indexedDB=a,this.persistenceConfigured=i===!0,this.persistenceAvailable=this.persistenceConfigured&&
typeof a?.open=="function",this.onDestroy=c,this.entries=new Map,this.inflight=new Map,this.residentBytes=0,this.reservedBytes=
0,this.databasePromise=null,this.database=null,this.persistenceQueue=Promise.resolve(),this.destroyed=!1,this.generation=
0,this.counters={hits:0,misses:0,coalesced:0,stale:0,evictions:0,rejected:0,validationFailures:0,persistenceFailures:0}}#e(){
if(this.destroyed)throw Ft(Error,"ERR_LOCAL_ARTIFACT_CACHE_DESTROYED","Local artifact cache is destroyed.")}#r(e,t){t.metadata.
accessedAt=this.clock(),this.entries.delete(e),this.entries.set(e,t)}#n(e,{eviction:t=!1}={}){const n=this.entries.get(e);
return n?(this.entries.delete(e),this.residentBytes=Math.max(0,this.residentBytes-n.storageBytes),t&&(this.counters.evictions+=
1),!0):!1}#d({key:e,entryBytes:t=null,reservationBytes:n=0}={}){const s=this.entries.get(e),i=s?.storageBytes??0,o=()=>{
const a=t!==null,c=this.entries.size+(a&&!s?1:0),l=a?this.residentBytes-i+t+this.reservedBytes+n:this.residentBytes+this.
reservedBytes+n;return c>this.maximumEntries||l>this.maximumBytes};for(;o();){let a=!1;for(const c of this.entries.keys())
if(c!==e){this.#n(c,{eviction:!0}),a=!0;break}if(!a)return!1}return!0}#p(e,t){return t.storageBytes>this.maximumEntryBytes||
t.bytes.byteLength>this.maximumEntryBytes?(this.counters.rejected+=1,!1):this.#d({key:e,entryBytes:t.storageBytes})?(this.#n(
e),this.entries.set(e,t),this.residentBytes+=t.storageBytes,!0):(this.counters.rejected+=1,!1)}#b(e){const t=this.entries.
get(e)?.storageBytes??0,n=Math.max(0,this.maximumEntryBytes-Math.min(t,this.maximumEntryBytes));if(this.inflight.size>=this.
maximumEntries||!this.#d({key:e,reservationBytes:n}))throw this.counters.rejected+=1,Ft(Error,"ERR_LOCAL_ARTIFACT_CACHE_\
BUSY","Local artifact cache has no bounded capacity for another in-flight load.");return this.reservedBytes+=n,n}#u(e){this.
reservedBytes=Math.max(0,this.reservedBytes-e)}async#h(){return!this.persistenceAvailable||this.destroyed?null:this.database?
this.database:(this.databasePromise||(this.databasePromise=new Promise((e,t)=>{let n;try{n=this.indexedDB.open(mk,1)}catch(s){
t(s);return}n.onupgradeneeded=()=>{const s=n.result;s.objectStoreNames.contains(Wt)||s.createObjectStore(Wt,{keyPath:"id"})},
n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error??new Error("Unable to open the local artifact database.")),n.onblocked=
()=>t(new Error("Opening the local artifact database was blocked."))}).then(e=>(this.database=e,e.onversionchange=()=>{e.
close(),this.database===e&&(this.database=null)},e)).catch(e=>(this.#a(e),null))),this.databasePromise)}#a(e){this.persistenceAvailable&&
(this.counters.persistenceFailures+=1),this.persistenceAvailable=!1;try{this.database?.close?.()}catch{}this.database=null}async#f(e){
const t=await this.#h();if(!t)return null;let n;try{const s=t.transaction(Wt,"readonly"),i=zi(s);i.catch(()=>{});const o=s.
objectStore(Wt).get(bc(this.name,e));n=await gc(o),await i}catch(s){return this.#a(s),null}if(!n||n.cacheName!==this.name||
n.key!==e)return null;try{return{bytes:fh(n.bytes),metadata:Us(n.metadata).metadata,storageBytes:Number(n.storageBytes)}}catch{
return{bytes:null,metadata:null,storageBytes:Number.NaN}}}async#c(e,t){const n=await this.#h();if(n)try{const s=n.transaction(
Wt,"readwrite"),i=zi(s);i.catch(()=>{});const o=s.objectStore(Wt);o.put({id:bc(this.name,e),cacheName:this.name,key:e,bytes:t.
bytes.slice(),metadata:Us(t.metadata).metadata,storageBytes:t.storageBytes});const c=(await gc(o.getAll())).filter(u=>u?.
cacheName===this.name).sort((u,h)=>Number(u.metadata?.accessedAt??0)-Number(h.metadata?.accessedAt??0)||String(u.id).localeCompare(
String(h.id)));let l=c.reduce((u,h)=>{const d=Number(h.storageBytes);return u+(Number.isSafeInteger(d)&&d>=0?d:this.maximumBytes+
1)},0);for(;c.length>this.maximumEntries||l>this.maximumBytes;){const u=c.shift();if(!u)break;const h=Number(u.storageBytes);
l-=Number.isSafeInteger(h)&&h>=0?h:this.maximumBytes+1,o.delete(u.id)}await i}catch(s){this.#a(s)}}async#i(e){const t=await this.#h();
if(t)try{const n=t.transaction(Wt,"readwrite"),s=zi(n);s.catch(()=>{}),n.objectStore(Wt).delete(bc(this.name,e)),await s}catch(n){
this.#a(n)}}async#o(){const e=await this.#h();if(e)try{const t=e.transaction(Wt,"readwrite"),n=zi(t);n.catch(()=>{});const s=t.
objectStore(Wt),i=await gc(s.getAll());for(const o of i)o?.cacheName===this.name&&s.delete(o.id);await n}catch(t){this.#a(
t)}}#t(e){if(!this.persistenceAvailable)return Promise.resolve();const t=this.persistenceQueue.then(e,e);return this.persistenceQueue=
t.catch(()=>{}),t}async#w(e,t){const n=e?.metadata;if(!e?.bytes||n?.schema!==uh||e.bytes.byteLength>this.maximumEntryBytes||
!Number.isSafeInteger(e.storageBytes)||e.storageBytes!==e.bytes.byteLength||e.storageBytes>this.maximumBytes||!Number.isFinite(
n.byteLength)||n.byteLength!==e.bytes.byteLength||typeof n.sha256!="string"||typeof n.sourceId!="string"||typeof n.mediaType!=
"string"||!Number.isFinite(n.freshUntil)||!Number.isFinite(n.staleUntil)||n.staleUntil<n.freshUntil)throw Ft(Error,"ERR_\
LOCAL_ARTIFACT_SCHEMA","Local artifact metadata is invalid.");if(await ph(e.bytes)!==n.sha256)throw Ft(Error,"ERR_LOCAL_\
ARTIFACT_INTEGRITY","Local artifact SHA-256 does not match its bytes.");if(t&&await t(e.bytes.slice(),Al(n))===!1)throw Ft(
Error,"ERR_LOCAL_ARTIFACT_VALIDATION","Local artifact validator rejected the bytes.");return e}async#s(e,{allowStale:t=!1,
validate:n,sourceId:s,mediaType:i}={}){let o=this.entries.get(e)??null,a=!1;if(o||(o=await this.#f(e),a=!!o),!o)return null;
try{if(s&&o.metadata.sourceId!==s)throw Ft(Error,"ERR_LOCAL_ARTIFACT_SOURCE","Local artifact source identifier does not \
match.");if(i&&o.metadata.mediaType!==i)throw Ft(Error,"ERR_LOCAL_ARTIFACT_MEDIA_TYPE","Local artifact media type does n\
ot match.");a&&await this.#w(o,n)}catch{return this.counters.validationFailures+=1,this.#n(e),await this.#t(()=>this.#i(
e)),null}const c=this.clock();if(c>o.metadata.staleUntil)return this.#n(e),await this.#t(()=>this.#i(e)),null;const l=c<
o.metadata.freshUntil;return!l&&!t?null:(a&&this.#p(e,o),this.entries.has(e)&&this.#r(e,o),this.#t(()=>this.#c(e,o)),{entry:o,
fresh:l})}async read(e,{validate:t,allowStale:n=!1,signal:s}={}){this.#e();const i=mc(e);if(t!==void 0&&typeof t!="funct\
ion")throw new TypeError("validate must be a function.");ys(s);const o=await this.#s(i,{allowStale:n,validate:t});return ys(
s),o?(o.fresh?this.counters.hits+=1:this.counters.stale+=1,Oi(o.entry,o.fresh?"hit":"stale")):null}async#m({bytes:e,metadata:t={}},n){
const s=fh(e);if(s.byteLength>this.maximumEntryBytes)throw this.counters.rejected+=1,Ft(RangeError,"ERR_LOCAL_ARTIFACT_E\
NTRY_TOO_LARGE",`Local artifact exceeds the ${this.maximumEntryBytes}-byte entry cap.`);const{metadata:i}=Us(t),o=this.clock(),
a=Fi(n.freshUntil,"freshUntil"),c=Fi(n.staleUntil,"staleUntil");if(c<a)throw new RangeError("staleUntil must be greater \
than or equal to freshUntil.");const l=Number.isFinite(i.freshUntil)?i.freshUntil:a,u=Number.isFinite(i.staleUntil)?i.staleUntil:
c,h=Math.min(c,u),d=Math.min(a,l,h),p=await ph(s),m={...i,schema:uh,sourceId:n.sourceId,mediaType:n.mediaType,byteLength:s.
byteLength,sha256:p,createdAt:o,accessedAt:o,freshUntil:d,staleUntil:h},y=Us(m),b={bytes:s,metadata:y.metadata,storageBytes:s.
byteLength};if(n.validate)try{if(await n.validate(s.slice(),Al(b.metadata))===!1)throw Ft(Error,"ERR_LOCAL_ARTIFACT_VALI\
DATION","Local artifact validator rejected the bytes.")}catch(f){throw this.counters.validationFailures+=1,f}return b}#l(e,t,n){
ys(t);const s={};return e.subscribers.add(s),n&&(this.counters.coalesced+=1),new Promise((i,o)=>{let a=!1;const c=()=>{a||
(a=!0,t?.removeEventListener?.("abort",l),e.subscribers.delete(s))},l=()=>{c(),!e.settled&&e.subscribers.size===0&&e.controller.
abort(),o(t.reason??Sl())};t?.addEventListener?.("abort",l,{once:!0}),e.promise.then(u=>{c(),i(n?Object.freeze({...u,cacheStatus:"\
coalesced"}):u)},u=>{c(),o(u)})})}async getOrLoad({key:e,sourceId:t,mediaType:n,freshUntil:s,staleUntil:i,signal:o,loader:a,
validate:c}={}){this.#e();const l=mc(e),u=ug(t,"sourceId"),h=Ek(n);if(typeof a!="function")throw new TypeError("loader m\
ust be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("validate must be a function.");if(Fi(s,"fr\
eshUntil"),Fi(i,"staleUntil"),i<s)throw new RangeError("staleUntil must be greater than or equal to freshUntil.");ys(o);
let d=this.inflight.get(l);if(d)return this.#l(d,o,!0);const p=await this.#s(l,{allowStale:!0,validate:c,sourceId:u,mediaType:h});
if(ys(o),p?.fresh)return this.counters.hits+=1,Oi(p.entry,"hit");if(d=this.inflight.get(l),d)return this.#l(d,o,!0);const m=this.#b(
l),y=this.generation,b=new AbortController,f={controller:b,subscribers:new Set,settled:!1,invalidated:!1,promise:null};let g=!1;
return f.promise=Promise.resolve().then(()=>a({signal:b.signal,maximumBytes:this.maximumEntryBytes})).then(w=>{if(b.signal.
aborted)throw b.signal.reason??Sl();const k=w&&typeof w=="object"&&"bytes"in w?w:{bytes:w,metadata:{}};return this.#m(k,
{sourceId:u,mediaType:h,freshUntil:s,staleUntil:i,validate:c})}).then(async w=>(this.#u(m),g=!0,!b.signal.aborted&&!f.invalidated&&
!this.destroyed&&y===this.generation&&(this.#p(l,w),this.entries.get(l)===w&&await this.#t(()=>this.#c(l,w))),this.counters.
misses+=1,Oi(w,"miss"))).catch(w=>{if(p&&this.clock()<=p.entry.metadata.staleUntil)return this.counters.stale+=1,Oi(p.entry,
"stale",{refreshErrorCode:typeof w?.code=="string"?w.code:"UPSTREAM_REFRESH_FAILED"});throw w}).finally(()=>{f.settled=!0,
g||this.#u(m),this.inflight.get(l)===f&&this.inflight.delete(l)}),this.inflight.set(l,f),this.#l(f,o,!1)}async delete(e){
this.#e();const t=mc(e),n=this.inflight.get(t);n&&(n.invalidated=!0),n?.controller.abort(),this.#n(t),await this.#t(()=>this.#i(
t))}async clear(){this.#e(),this.generation+=1;for(const e of this.inflight.values())e.invalidated=!0,e.controller.abort();
this.entries.clear(),this.residentBytes=0,await this.#t(()=>this.#o())}getStats(){const e=this.clock();let t=0,n=0;for(const s of this.
entries.values())e<s.metadata.freshUntil?t+=1:e<=s.metadata.staleUntil&&(n+=1);return Object.freeze({schema:"peercompute\
.local-artifact-cache-stats.v1",entries:this.entries.size,freshEntries:t,staleEntries:n,residentBytes:this.residentBytes,
maximumEntries:this.maximumEntries,maximumBytes:this.maximumBytes,maximumEntryBytes:this.maximumEntryBytes,pending:this.
inflight.size,reservedBytes:this.reservedBytes,persistenceConfigured:this.persistenceConfigured,persistenceAvailable:this.
persistenceAvailable,...this.counters})}async destroy(){if(!this.destroyed){this.destroyed=!0,this.generation+=1;for(const e of this.
inflight.values())e.invalidated=!0,e.controller.abort();await Promise.allSettled([...this.inflight.values()].map(e=>e.promise)),
await this.persistenceQueue.catch(()=>{}),this.entries.clear(),this.inflight.clear(),this.residentBytes=0,this.reservedBytes=
0;try{this.database?.close?.()}catch{}this.database=null,this.onDestroy?.(this),this.onDestroy=null}}}function vk(r,e){if(r===
e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function qu(r){
if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return ci(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return ci(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function Sk(r){return r?.buffer instanceof ArrayBuffer}function ci(r){return Sk(r)?r:r.slice()}function Ak(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),
d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>
0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;for(var R=h.
repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.length-g)*d+
1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&C!==-1;C--,E++)
v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(f);if(g)return g;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var _k=Ak,Ik=_k;let Ck=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},Tk=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return dg(this,e)}},
Mk=class{decoders;constructor(e){this.decoders=e}or(e){return dg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function dg(r,e){return new Mk({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let Rk=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new Ck(e,t,n),this.decoder=new Tk(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function hg({name:r,prefix:e,encode:t,decode:n}){return new Rk(r,e,t,
n)}function La({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=Ik(t,r,n);return hg({prefix:e,
name:r,encode:s,decode:o=>qu(i(o))})}function Bk(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function Lk(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function Dk(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Er({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=Dk(n,s);return hg(
{prefix:e,name:r,encode(o){return Lk(o,n,t)},decode(o){return Bk(o,i,t,r)}})}const uo=Er({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Er({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Er({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Er({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const yc=La(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});La({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const zr=La({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});La({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var Pk=fg,mh=128,$k=-128,Nk=Math.pow(2,31);function fg(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=Nk;)e[t++]=r&255|mh,r/=128;for(;r&$k;)e[t++]=r&255|mh,r>>>=7;return e[t]=r|0,fg.bytes=t-n+1,e}var Uk=_l,
Fk=128,gh=127;function _l(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw _l.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&gh)<<s:(o&gh)*Math.pow(2,s),s+=7}while(o>=Fk);return _l.bytes=i-n,t}var Ok=Math.pow(
2,7),zk=Math.pow(2,14),qk=Math.pow(2,21),jk=Math.pow(2,28),Gk=Math.pow(2,35),Wk=Math.pow(2,42),Vk=Math.pow(2,49),Hk=Math.
pow(2,56),Kk=Math.pow(2,63),Qk=function(r){return r<Ok?1:r<zk?2:r<qk?3:r<jk?4:r<Gk?5:r<Wk?6:r<Vk?7:r<Hk?8:r<Kk?9:10},Jk={
encode:Pk,decode:Uk,encodingLength:Qk},Uo=Jk;function Il(r,e=0){const t=Uo.decode(r,e),n=Uo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Fo(r,e,t=0){return Uo.encode(r,e,t),e}function Oo(r){return Uo.encodingLength(r)}function pg(r,e){const t=e.
byteLength,n=Oo(r),s=n+Oo(t),i=new Uint8Array(s+t);return Fo(r,i,0),Fo(t,i,n),i.set(e,s),new ju(r,t,e,i)}function Xk(r){
const e=qu(r),[t,n]=Il(e),[s,i]=Il(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new ju(t,s,o,e)}function Yk(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&vk(r.bytes,t.bytes)}}let ju=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
ci(n),this.bytes=ci(s)}};function bh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return eE(t,Cl(r),e??zr.encoder);default:
return tE(t,Cl(r),e??uo.encoder)}}const yh=new WeakMap;function Cl(r){const e=yh.get(r);if(e==null){const t=new Map;return yh.
set(r,t),t}return e}let Zn=class He{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=ci(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ws)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==rE)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return He.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=pg(e,
t);return He.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return He.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&Yk(e.multihash,n.multihash)}toString(e){return bh(this,e)}toJSON(){return{"/":bh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof He)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new He(n,s,i,o??wh(n,s,i.bytes))}else if(t[nE]===!0){const{version:n,
multihash:s,code:i}=t,o=Xk(s);return He.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ws)throw new Error(`Version 0 CID must use dag-pb (code: ${ws}) block encoding`);return new He(e,t,n,n.bytes)}case 1:{
const s=wh(e,t,n.bytes);return new He(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return He.
create(0,ws,e)}static createV1(e,t){return He.create(1,e,t)}static decode(e){const[t,n]=He.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=He.inspectBytes(e),n=t.size-t.multihashSize,
s=qu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new ju(t.multihashCode,t.digestSize,i,s);return[t.version===0?He.createV0(o):He.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Il(e.subarray(t));return t+=d,h};let s=n(),
i=ws;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=Zk(e,t),
i=He.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Cl(
i).set(n,e),i}};function Zk(r,e){switch(r[0]){case"Q":{const t=e??zr;return[zr.prefix,t.decode(`${zr.prefix}${r}`)]}case zr.
prefix:{const t=e??zr;return[zr.prefix,t.decode(r)]}case uo.prefix:{const t=e??uo;return[uo.prefix,t.decode(r)]}case yc.
prefix:{const t=e??yc;return[yc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function eE(r,e,t){const{prefix:n}=t;if(n!==
zr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function tE(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ws=112,rE=18;function wh(r,e,t){const n=Oo(r),s=n+Oo(e),i=new Uint8Array(s+t.
byteLength);return Fo(r,i,0),Fo(e,i,n),i.set(t,s),i}const nE=Symbol.for("@ipld/js-cid/CID"),sE=20;function iE({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new oE(r,e,t,n,s)}let oE=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??sE,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
kh(n,this.code,t?.truncate):n.then(s=>kh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function kh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return pg(e,r)}function aE(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const Eh=iE({name:"sha2-256",code:18,encode:aE("SHA-256")}),cE=r=>r/2**32|0,lE=r=>r>>>0;function uE(r,e,t,n){
const s=cE(t),i=lE(t);r.setUint32(e,n?i:s,n),r.setUint32(e+4,n?s:i,n)}function xh(r){return r instanceof Uint8Array||ArrayBuffer.
isView(r)&&r.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in r&&r.BYTES_PER_ELEMENT===1}const dE=r=>r?`"${r}" `:"";
function Gu(r,e,t=""){if(xh(r)&&e===void 0)return r;const n=xh(r),s="",i=n?`length=${r.length}`:`type=${typeof r}`,o=dE(
t)+"expected Uint8Array"+s+", got "+i;throw n?new RangeError(o):new TypeError(o)}const hE=(r,e)=>{if(r===null||typeof r!=
"object"||Array.isArray(r))throw new TypeError((e==="object"?"":`"${e}" `)+"expected object, got type="+typeof r)},vh=(r,e)=>{
hE(r,e);const t=Object.getPrototypeOf(r);if(t!==Object.prototype&&t!==null)throw new TypeError(`"${e}" expected plain ob\
ject`);if(Object.hasOwn(r,"__proto__"))throw new TypeError(`"${e}.__proto__" is not allowed`)};function Sh(r,e=!0){if(r.
destroyed)throw new Error("hash was destroyed");if(e&&r.finished)throw new Error("digest() was already called")}function fE(r,e){
Gu(r,void 0,"output");const t=e.outputLen;if(!(r.length>=t))throw new RangeError('"output" expected length >= '+t)}function Ah(...r){
for(let e=0;e<r.length;e++)r[e].fill(0)}function wc(r){return new DataView(r.buffer,r.byteOffset,r.byteLength)}function Vt(r,e){
return r<<32-e|r>>>e}const pE=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",mE=Array.
from({length:256},(r,e)=>e.toString(16).padStart(2,"0"));function HR(r){if(Gu(r),pE)return r.toHex();let e="";for(let t=0;t<
r.length;t++)e+=mE[r[t]];return e}function gE(r,e,t="opts"){return vh(r,"defaults"),e!==void 0&&vh(e,t),Object.assign(Object.
create(null),r,e)}function bE(r,e={}){if(typeof r!="function")throw new TypeError('"hashCons" expected function, got typ\
e='+typeof r);e=gE({},e,"info");const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=
n.blockLen,t.canXOF=n.canXOF,t.create=s=>r(s),Object.assign(t,e),Object.freeze(t)}const yE=r=>({oid:Uint8Array.from([6,9,
96,134,72,1,101,3,4,2,r])});function wE(r,e,t){return r&e^~r&t}function kE(r,e,t){return r&e^r&t^e&t}let EE=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=wc(this.buffer)}update(e){
Sh(this),Gu(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;let o=!1;for(let a=0;a<i;){const c=Math.min(s-this.pos,
i-a);if(c===s){const l=wc(e);for(;s<=i-a;a+=s)this.process(l,a);o=!0;continue}n.set(a===0&&c===i?e:e.subarray(a,a+c),this.
pos),this.pos+=c,a+=c,this.pos===s&&(this.process(t,0),this.pos=0,o=!0)}return this.length+=e.length,o&&this.roundClean(),
this}digestInto(e){Sh(this),fE(e,this),this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=
128,t.fill(0,o),this.padOffset>s-o&&(this.process(n,0),t.fill(0)),uE(n,s-8,this.length*8,i),this.process(n,0),this.roundClean();
const a=e===t?n:wc(e),c=this.outputLen,l=c/4,u=this.get();if(c%4||l>u.length)throw new Error("invalid outputLen");for(let h=0;h<
l;h++)a.setUint32(4*h,u[h],i)}digest(){const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.
destroy(),n}_cloneIntoMeta(e){const{buffer:t,length:n,finished:s,destroyed:i,pos:o}=this;return e.destroyed=i,e.finished=
s,e.length=n,e.pos=o,o&&e.buffer.set(t),e}clone(){return this._cloneInto()}};const xE=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),vE=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Cr=new Uint32Array(64);let SE=class extends EE{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,
8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){
const{A:e,B:t,C:n,D:s,E:i,F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|
0,this.D=s|0,this.E=i|0,this.F=o|0,this.G=a|0,this.H=c|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),
this._cloneIntoMeta(e)}process(e,t){for(let h=0;h<16;h++,t+=4)Cr[h]=e.getUint32(t,!1);for(let h=16;h<64;h++){const d=Cr[h-
15],p=Cr[h-2],m=Vt(d,7)^Vt(d,18)^d>>>3,y=Vt(p,17)^Vt(p,19)^p>>>10;Cr[h]=y+Cr[h-7]+m+Cr[h-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let h=0;h<64;h++){const d=Vt(a,6)^Vt(a,11)^Vt(a,25),p=u+d+wE(a,c,l)+vE[h]+Cr[h]|0,y=(Vt(n,2)^Vt(n,13)^
Vt(n,22))+kE(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){Ah(Cr)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),Ah(this.buffer)}},AE=class extends SE{constructor(){super(32,xE)}};const _h=bE(()=>new AE,yE(1));function _E(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
function Wu(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return li(r);if(r instanceof ArrayBuffer)return new Uint8Array(
r);if(ArrayBuffer.isView(r))return li(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type,\
 must be binary type")}function IE(r){return r?.buffer instanceof ArrayBuffer}function li(r){return IE(r)?r:r.slice()}function CE(r,e,t){
if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),
d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>
0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;for(var R=h.
repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.length-g)*d+
1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&C!==-1;C--,E++)
v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(f);if(g)return g;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var TE=CE,ME=TE;let RE=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},BE=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return mg(this,e)}},
LE=class{decoders;constructor(e){this.decoders=e}or(e){return mg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function mg(r,e){return new LE({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let DE=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new RE(e,t,n),this.decoder=new BE(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function gg({name:r,prefix:e,encode:t,decode:n}){return new DE(r,e,t,
n)}function Da({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=ME(t,r,n);return gg({prefix:e,
name:r,encode:s,decode:o=>Wu(i(o))})}function PE(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function $E(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function NE(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function xr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=NE(n,s);return gg(
{prefix:e,name:r,encode(o){return $E(o,n,t)},decode(o){return PE(o,i,t,r)}})}const ho=xr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});xr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});xr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});xr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const kc=Da(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Da({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const qr=Da({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Da({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var UE=bg,Ih=128,FE=-128,OE=Math.pow(2,31);function bg(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=OE;)e[t++]=r&255|Ih,r/=128;for(;r&FE;)e[t++]=r&255|Ih,r>>>=7;return e[t]=r|0,bg.bytes=t-n+1,e}var zE=Tl,
qE=128,Ch=127;function Tl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Tl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Ch)<<s:(o&Ch)*Math.pow(2,s),s+=7}while(o>=qE);return Tl.bytes=i-n,t}var jE=Math.pow(
2,7),GE=Math.pow(2,14),WE=Math.pow(2,21),VE=Math.pow(2,28),HE=Math.pow(2,35),KE=Math.pow(2,42),QE=Math.pow(2,49),JE=Math.
pow(2,56),XE=Math.pow(2,63),YE=function(r){return r<jE?1:r<GE?2:r<WE?3:r<VE?4:r<HE?5:r<KE?6:r<QE?7:r<JE?8:r<XE?9:10},ZE={
encode:UE,decode:zE,encodingLength:YE},zo=ZE;function Ml(r,e=0){const t=zo.decode(r,e),n=zo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function qo(r,e,t=0){return zo.encode(r,e,t),e}function jo(r){return zo.encodingLength(r)}function ex(r,e){const t=e.
byteLength,n=jo(r),s=n+jo(t),i=new Uint8Array(s+t);return qo(r,i,0),qo(t,i,n),i.set(e,s),new Vu(r,t,e,i)}function tx(r){
const e=Wu(r),[t,n]=Ml(e),[s,i]=Ml(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Vu(t,s,o,e)}function rx(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&_E(r.bytes,t.bytes)}}let Vu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
li(n),this.bytes=li(s)}};function Th(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return sx(t,Rl(r),e??qr.encoder);default:
return ix(t,Rl(r),e??ho.encoder)}}const Mh=new WeakMap;function Rl(r){const e=Mh.get(r);if(e==null){const t=new Map;return Mh.
set(r,t),t}return e}let Fs=class Ke{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=li(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
ks)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==ox)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ke.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=ex(e,
t);return Ke.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ke.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&rx(e.multihash,n.multihash)}toString(e){return Th(this,e)}toJSON(){return{"/":Th(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ke)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ke(n,s,i,o??Rh(n,s,i.bytes))}else if(t[ax]===!0){const{version:n,
multihash:s,code:i}=t,o=tx(s);return Ke.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==ks)throw new Error(`Version 0 CID must use dag-pb (code: ${ks}) block encoding`);return new Ke(e,t,n,n.bytes)}case 1:{
const s=Rh(e,t,n.bytes);return new Ke(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ke.
create(0,ks,e)}static createV1(e,t){return Ke.create(1,e,t)}static decode(e){const[t,n]=Ke.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ke.inspectBytes(e),n=t.size-t.multihashSize,
s=Wu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Vu(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ke.createV0(o):Ke.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Ml(e.subarray(t));return t+=d,h};let s=n(),
i=ks;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=nx(e,t),
i=Ke.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Rl(
i).set(n,e),i}};function nx(r,e){switch(r[0]){case"Q":{const t=e??qr;return[qr.prefix,t.decode(`${qr.prefix}${r}`)]}case qr.
prefix:{const t=e??qr;return[qr.prefix,t.decode(r)]}case ho.prefix:{const t=e??ho;return[ho.prefix,t.decode(r)]}case kc.
prefix:{const t=e??kc;return[kc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function sx(r,e,t){const{prefix:n}=t;if(n!==
qr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function ix(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const ks=112,ox=18;function Rh(r,e,t){const n=jo(r),s=n+jo(e),i=new Uint8Array(s+t.
byteLength);return qo(r,i,0),qo(e,i,n),i.set(t,s),i}const ax=Symbol.for("@ipld/js-cid/CID"),cx=new TextDecoder;function Hu(r,e){
let t=0;for(let n=0;;n+=7){if(n>=64)throw new Error("protobuf: varint overflow");if(e>=r.length)throw new Error("protobu\
f: unexpected end of data");const s=r[e++];if(t+=n<28?(s&127)<<n:(s&127)*2**n,s<128)break}return[t,e]}function Go(r,e){let t;
[t,e]=Hu(r,e);const n=e+t;if(t<0||n<0)throw new Error("protobuf: invalid length");if(n>r.length)throw new Error("protobu\
f: unexpected end of data");return[r.subarray(e,n),n]}function yg(r,e){let t;return[t,e]=Hu(r,e),[t&7,t>>3,e]}function lx(r){
const e={},t=r.length;let n=0;for(;n<t;){let s,i;if([s,i,n]=yg(r,n),i===1){if(e.Hash)throw new Error("protobuf: (PBLink)\
 duplicate Hash section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Hash`);if(e.Name!==void 0)
throw new Error("protobuf: (PBLink) invalid order, found Name before Hash");if(e.Tsize!==void 0)throw new Error("protobu\
f: (PBLink) invalid order, found Tsize before Hash");[e.Hash,n]=Go(r,n)}else if(i===2){if(e.Name!==void 0)throw new Error(
"protobuf: (PBLink) duplicate Name section");if(s!==2)throw new Error(`protobuf: (PBLink) wrong wireType (${s}) for Name`);
if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) invalid order, found Tsize before Name");let o;[o,n]=Go(r,n),e.Name=
cx.decode(o)}else if(i===3){if(e.Tsize!==void 0)throw new Error("protobuf: (PBLink) duplicate Tsize section");if(s!==0)throw new Error(
`protobuf: (PBLink) wrong wireType (${s}) for Tsize`);[e.Tsize,n]=Hu(r,n)}else throw new Error(`protobuf: (PBLink) inval\
id fieldNumber, expected 1, 2 or 3, got ${i}`)}if(n>t)throw new Error("protobuf: (PBLink) unexpected end of data");return e}
function ux(r){const e=r.length;let t=0,n,s=!1,i;for(;t<e;){let a,c;if([a,c,t]=yg(r,t),a!==2)throw new Error(`protobuf: \
(PBNode) invalid wireType, expected 2, got ${a}`);if(c===1){if(i)throw new Error("protobuf: (PBNode) duplicate Data sect\
ion");[i,t]=Go(r,t),n&&(s=!0)}else if(c===2){if(s)throw new Error("protobuf: (PBNode) duplicate Links section");n||(n=[]);
let l;[l,t]=Go(r,t),n.push(lx(l))}else throw new Error(`protobuf: (PBNode) invalid fieldNumber, expected 1 or 2, got ${c}`)}
if(t>e)throw new Error("protobuf: (PBNode) unexpected end of data");const o={};return i&&(o.Data=i),o.Links=n||[],o}const wg=new TextEncoder,
Bh=2**32,dx=2**31;function hx(r,e){let t=e.length;if(typeof r.Tsize=="number"){if(r.Tsize<0)throw new Error("Tsize canno\
t be negative");if(!Number.isSafeInteger(r.Tsize))throw new Error("Tsize too large for encoding");t=Ws(e,t,r.Tsize)-1,e[t]=
24}if(typeof r.Name=="string"){const n=wg.encode(r.Name);t-=n.length,e.set(n,t),t=Ws(e,t,n.length)-1,e[t]=18}return r.Hash&&
(t-=r.Hash.length,e.set(r.Hash,t),t=Ws(e,t,r.Hash.length)-1,e[t]=10),e.length-t}function Lh(r,e,t){return r-=e.Data.length,
t.set(e.Data,r),r=Ws(t,r,e.Data.length)-1,t[r]=10,r}function fx(r,e){const t=mx(r),n=new Uint8Array(t);let s=t;const i=e?.
fieldOrder==="data-first"?e.fieldOrder:"links-first";if(r.Data&&i==="links-first"&&(s=Lh(s,r,n)),r.Links)for(let o=r.Links.
length-1;o>=0;o--){const a=hx(r.Links[o],n.subarray(0,s));s-=a,s=Ws(n,s,a)-1,n[s]=18}return r.Data&&i==="data-first"&&(s=
Lh(s,r,n)),n}function px(r){let e=0;if(r.Hash){const t=r.Hash.length;e+=1+t+zn(t)}if(typeof r.Name=="string"){const t=wg.
encode(r.Name).length;e+=1+t+zn(t)}return typeof r.Tsize=="number"&&(e+=1+zn(r.Tsize)),e}function mx(r){let e=0;if(r.Data){
const t=r.Data.length;e+=1+t+zn(t)}if(r.Links)for(const t of r.Links){const n=px(t);e+=1+n+zn(n)}return e}function Ws(r,e,t){
e-=zn(t);const n=e;for(;t>=dx;)r[e++]=t&127|128,t/=128;for(;t>=128;)r[e++]=t&127|128,t>>>=7;return r[e]=t,n}function zn(r){
return r%2===0&&r++,Math.floor((gx(r)+6)/7)}function gx(r){let e=0;return r>=Bh&&(r=Math.floor(r/Bh),e=32),r>=65536&&(r>>>=
16,e+=16),r>=256&&(r>>>=8,e+=8),e+bx[r]}const bx=[0,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],yx=["Data","Links"],wx=["Hash","Name",
"Tsize"],Bl=new TextEncoder;function kg(r,e){if(r===e)return 0;const t=r.Name?Bl.encode(r.Name):[],n=e.Name?Bl.encode(e.
Name):[];let s=t.length,i=n.length;for(let o=0,a=Math.min(s,i);o<a;++o)if(t[o]!==n[o]){s=t[o],i=n[o];break}return s<i?-1:
i<s?1:0}function Dh(r,e){return!Object.keys(r).some(t=>!e.includes(t))}function Eg(r){if(typeof r.asCID=="object"){const t=Fs.
asCID(r);if(!t)throw new TypeError("Invalid DAG-PB form");return{Hash:t}}if(typeof r!="object"||Array.isArray(r))throw new TypeError(
"Invalid DAG-PB form");const e={};if(r.Hash){let t=Fs.asCID(r.Hash);try{t||(typeof r.Hash=="string"?t=Fs.parse(r.Hash):r.
Hash instanceof Uint8Array&&(t=Fs.decode(r.Hash)))}catch(n){throw new TypeError(`Invalid DAG-PB form: ${n.message}`)}t&&
(e.Hash=t)}if(!e.Hash)throw new TypeError("Invalid DAG-PB form");return typeof r.Name=="string"&&(e.Name=r.Name),typeof r.
Tsize=="number"&&(e.Tsize=r.Tsize),e}function Zt(r){if((r instanceof Uint8Array||typeof r=="string")&&(r={Data:r}),typeof r!=
"object"||Array.isArray(r))throw new TypeError("Invalid DAG-PB form");const e={};if(r.Data!==void 0)if(typeof r.Data=="s\
tring")e.Data=Bl.encode(r.Data);else if(r.Data instanceof Uint8Array)e.Data=r.Data;else throw new TypeError("Invalid DAG\
-PB form");if(r.Links!==void 0)if(Array.isArray(r.Links))e.Links=r.Links.map(Eg),e.Links.sort(kg);else throw new TypeError(
"Invalid DAG-PB form");else e.Links=[];return e}function xg(r){if(!r||typeof r!="object"||Array.isArray(r)||r instanceof
Uint8Array||r["/"]&&r["/"]===r.bytes)throw new TypeError("Invalid DAG-PB form");if(!Dh(r,yx))throw new TypeError("Invali\
d DAG-PB form (extraneous properties)");if(r.Data!==void 0&&!(r.Data instanceof Uint8Array))throw new TypeError("Invalid\
 DAG-PB form (Data must be bytes)");if(!Array.isArray(r.Links))throw new TypeError("Invalid DAG-PB form (Links must be a\
 list)");for(let e=0;e<r.Links.length;e++){const t=r.Links[e];if(!t||typeof t!="object"||Array.isArray(t)||t instanceof Uint8Array||
t["/"]&&t["/"]===t.bytes)throw new TypeError("Invalid DAG-PB form (bad link)");if(!Dh(t,wx))throw new TypeError("Invalid\
 DAG-PB form (extraneous properties on link)");if(t.Hash===void 0)throw new TypeError("Invalid DAG-PB form (link must ha\
ve a Hash)");if(t.Hash==null||!t.Hash["/"]||t.Hash["/"]!==t.Hash.bytes)throw new TypeError("Invalid DAG-PB form (link Ha\
sh must be a CID)");if(t.Name!==void 0&&typeof t.Name!="string")throw new TypeError("Invalid DAG-PB form (link Name must\
 be a string)");if(t.Tsize!==void 0){if(typeof t.Tsize!="number"||t.Tsize%1!==0)throw new TypeError("Invalid DAG-PB form\
 (link Tsize must be an integer)");if(t.Tsize<0)throw new TypeError("Invalid DAG-PB form (link Tsize cannot be negative)")}
if(e>0&&kg(t,r.Links[e-1])===-1)throw new TypeError("Invalid DAG-PB form (links must be sorted by Name bytes)")}}function kx(r,e=[]){
return Zt({Data:r,Links:e})}function Ex(r,e,t){return Eg({Hash:t,Name:r,Tsize:e})}function xx(r){return r instanceof ArrayBuffer?
new Uint8Array(r,0,r.byteLength):r}const vx="dag-pb",_i=112;function er(r,e){xg(r);const t={};return r.Links&&(t.Links=r.
Links.map(n=>{const s={};return n.Hash&&(s.Hash=n.Hash.bytes),n.Name!==void 0&&(s.Name=n.Name),n.Tsize!==void 0&&(s.Tsize=
n.Tsize),s})),r.Data&&(t.Data=r.Data),fx(t,e)}function ui(r){const e=xx(r),t=ux(e),n={};return t.Data&&(n.Data=t.Data),t.
Links&&(n.Links=t.Links.map(s=>{const i={};try{i.Hash=Fs.decode(s.Hash)}catch{}if(!i.Hash)throw new Error("Invalid Hash \
field found in link, expected CID");return s.Name!==void 0&&(i.Name=s.Name),s.Tsize!==void 0&&(i.Tsize=s.Tsize),i})),n}const vg=Object.
freeze(Object.defineProperty({__proto__:null,code:_i,createLink:Ex,createNode:kx,decode:ui,encode:er,name:vx,prepare:Zt,
validate:xg},Symbol.toStringTag,{value:"Module"}));function Sx(r){return r[Symbol.asyncIterator]!=null}function Ax(r){if(Sx(
r))return(async()=>{for await(const e of r)return e})();for(const e of r)return e}function _x(r){return r[Symbol.asyncIterator]!=
null}function Sg(r,e=1){return e=Number(e),_x(r)?(async function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error(
"Batch size must be an integer");for await(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.
length>0;)yield t.slice(0,e),t=t.slice(e)})():(function*(){let t=[];if(e<1&&(e=1),e!==Math.round(e))throw new Error("Bat\
ch size must be an integer");for(const n of r)for(t.push(n);t.length>=e;)yield t.slice(0,e),t=t.slice(e);for(;t.length>0;)
yield t.slice(0,e),t=t.slice(e)})()}async function*Ag(r,e=1){for await(const t of Sg(r,e)){const n=t.map(async s=>s().then(
i=>({ok:!0,value:i}),i=>({ok:!1,err:i})));for(let s=0;s<n.length;s++){const i=await n[s];if(i.ok)yield i.value;else throw i.
err}}}function Tr(r=0){return new Uint8Array(r)}function Wo(r=0){return new Uint8Array(r)}function Ix(r){return r?.buffer instanceof
ArrayBuffer}function Cx(r){if(Ix(r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Ph(r,e){
e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=Wo(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return Cx(t)}function Tx(r,e){
if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}
const _g=Symbol.for("@achingbrain/uint8arraylist");function $h(r,e){if(e==null||e<0)throw new RangeError("index is out o\
f bounds");let t=0;for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("ind\
ex is out of bounds")}function qi(r){return!!r?.[_g]}let Ec=class fo{bufs;length;[_g]=!0;constructor(...e){this.bufs=[],
this.length=0,e.length>0&&this.appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){
this.appendAll(e)}appendAll(e){let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(qi(
n)){t+=n.byteLength;for(const s of n.bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uin\
t8Array or a Uint8ArrayList");this.length+=t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())
if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.unshift(n);else if(qi(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else
throw new Error("Could not prepend value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=$h(this.
bufs,e);return t.buf[t.index]}set(e,t){const n=$h(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)
for(let n=0;n<e.length;n++)this.set(t+n,e[n]);else if(qi(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error(
"Could not write value, must be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=
0)){if(e===this.byteLength){this.bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=
this.bufs[0].byteLength,this.length-=this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),
this.length-=e;break}}}slice(e,t){const{bufs:n,length:s}=this._subList(e,t);return Ph(n,s)}subarray(e,t){const{bufs:n,length:s}=this.
_subList(e,t);return n.length===1?n[0]:Ph(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new fo;return i.
length=s,i.bufs=n,i}_subList(e,t){if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)
throw new RangeError("index is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[
...this.bufs],length:this.length};const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.
byteLength;if(s=c,e>=c)continue;const l=e>=a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const h=e-a;n.push(
o.subarray(h,h+(t-e)));break}if(l){if(e===0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(
o);break}n.push(o.subarray(0,t-a));break}n.push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!qi(e)&&!(e instanceof Uint8Array))
throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();
if(t=Number(t??0),isNaN(t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.
byteLength;if(s===0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<
i;h++)o[h]=-1;for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let h=t;h<=
c;h+=u){u=0;for(let d=l;d>=0;d--){const p=this.get(h+d);if(n[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=Wo(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Tr(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Tr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Tr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=Wo(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Tr(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Tr(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Tr(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Tr(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Tr(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof fo)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!Tx(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new fo;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}};const Ig=1,Cg=BigInt(34),Tg=8,Mg=262144,Mx="links-b\
ytes",Rg=262144,Rx=1048576,Bx=50,Lx=10,Dx=!0,Px=!0,$x=!1,Nx="file",Ux="links-first",Bg=(r={})=>{const e=r.chunkSize??Rg;
return async function*(n){let s=new Ec,i=0,o=!1;for await(const a of n)for(s.append(a),i+=a.length;i>=e;)if(yield s.subarray(
0,e),o=!0,e===s.length)s=new Ec,i=0;else{const l=new Ec;l.append(s.sublist(e)),s=l,i-=e}(!o||i>0)&&(yield s.subarray(0,i))}};
function Fx(r){return r.buffer instanceof ArrayBuffer}function Lg(r){return Fx(r)?r:r.slice()}class di extends Error{static name="\
InvalidTypeError";static code="ERR_INVALID_TYPE";name=di.name;code=di.code;constructor(e="Invalid type"){super(e)}}function Vo(r=0){
return new Uint8Array(r)}const Ox=Math.pow(2,7),zx=Math.pow(2,14),qx=Math.pow(2,21),Dg=Math.pow(2,28),Pg=Math.pow(2,35),
$g=Math.pow(2,42),Ng=Math.pow(2,49),it=128,Mr=127;function Ku(r){if(r<Ox)return 1;if(r<zx)return 2;if(r<qx)return 3;if(r<
Dg)return 4;if(r<Pg)return 5;if(r<$g)return 6;if(r<Ng)return 7;if(Number.MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)
throw new RangeError("Could not encode varint");return 8}function jx(r,e,t=0){switch(Ku(r)){case 8:e[t++]=r&255|it,r/=128;case 7:
e[t++]=r&255|it,r/=128;case 6:e[t++]=r&255|it,r/=128;case 5:e[t++]=r&255|it,r/=128;case 4:e[t++]=r&255|it,r>>>=7;case 3:
e[t++]=r&255|it,r>>>=7;case 2:e[t++]=r&255|it,r>>>=7;case 1:{e[t++]=r&255,r>>>=7;break}default:throw new Error("unreacha\
ble")}return e}function Gx(r,e){let t=r[e],n=0;if(n+=t&Mr,t<it||(t=r[e+1],n+=(t&Mr)<<7,t<it)||(t=r[e+2],n+=(t&Mr)<<14,t<
it)||(t=r[e+3],n+=(t&Mr)<<21,t<it)||(t=r[e+4],n+=(t&Mr)*Dg,t<it)||(t=r[e+5],n+=(t&Mr)*Pg,t<it)||(t=r[e+6],n+=(t&Mr)*$g,t<
it)||(t=r[e+7],n+=(t&Mr)*Ng,t<it))return n;throw new RangeError("Could not decode varint")}const Qu=new Float32Array([-0]),
Kr=new Uint8Array(Qu.buffer);function Wx(r,e,t){Qu[0]=r,e[t]=Kr[0],e[t+1]=Kr[1],e[t+2]=Kr[2],e[t+3]=Kr[3]}function Vx(r,e){
return Kr[0]=r[e],Kr[1]=r[e+1],Kr[2]=r[e+2],Kr[3]=r[e+3],Qu[0]}const Ju=new Float64Array([-0]),Ze=new Uint8Array(Ju.buffer);
function Hx(r,e,t){Ju[0]=r,e[t]=Ze[0],e[t+1]=Ze[1],e[t+2]=Ze[2],e[t+3]=Ze[3],e[t+4]=Ze[4],e[t+5]=Ze[5],e[t+6]=Ze[6],e[t+
7]=Ze[7]}function Kx(r,e){return Ze[0]=r[e],Ze[1]=r[e+1],Ze[2]=r[e+2],Ze[3]=r[e+3],Ze[4]=r[e+4],Ze[5]=r[e+5],Ze[6]=r[e+6],
Ze[7]=r[e+7],Ju[0]}const Qx=BigInt(Number.MAX_SAFE_INTEGER),Jx=BigInt(Number.MIN_SAFE_INTEGER);class rt{lo;hi;constructor(e,t){
this.lo=e>>>0,this.hi=t>>>0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&
(n=n+1>>>0),-(t+n*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.
hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let n=~this.hi>>>0;return t===0&&(n=n+1>>>0),-(BigInt(t)+(BigInt(n)<<
32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){
const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.
lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.
lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return n===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:
8:n<128?9:10}static fromBigInt(e){if(e===0n)return an;if(e<Qx&&e>Jx)return this.fromNumber(Number(e));const t=e<0n;t&&(e=
-e);let n=e>>32n,s=e-(n<<32n);return t&&(n=~n|0n,s=~s|0n,++s>Nh&&(s=0n,++n>Nh&&(n=0n))),new rt(Number(s),Number(n))}static fromNumber(e){
if(e===0)return an;const t=e<0;t&&(e=-e);let n=e>>>0,s=(e-n)/4294967296>>>0;return t&&(s=~s>>>0,n=~n>>>0,++n>4294967295&&
(n=0,++s>4294967295&&(s=0))),new rt(n,s)}static from(e){return typeof e=="number"?rt.fromNumber(e):typeof e=="bigint"?rt.
fromBigInt(e):typeof e=="string"?rt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new rt(e.low>>>0,e.high>>>0):an}}const an=new rt(
0,0);an.toBigInt=function(){return 0n};an.zzEncode=an.zzDecode=function(){return this};an.length=function(){return 1};const Nh=4294967296n;
function Xx(r){let e=0,t=0;for(let n=0;n<r.length;++n)t=r.charCodeAt(n),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(r.charCodeAt(
n+1)&64512)===56320?(++n,e+=4):e+=3;return e}function Yx(r,e,t){if(t-e<1)return"";let s;const i=[];let o=0,a;for(;e<t;)a=
r[e++],a<128?i[o++]=a:a>191&&a<224?i[o++]=(a&31)<<6|r[e++]&63:a>239&&a<365?(a=((a&7)<<18|(r[e++]&63)<<12|(r[e++]&63)<<6|
r[e++]&63)-65536,i[o++]=55296+(a>>10),i[o++]=56320+(a&1023)):i[o++]=(a&15)<<12|(r[e++]&63)<<6|r[e++]&63,o>8191&&((s??(s=
[])).push(String.fromCharCode.apply(String,i)),o=0);return s!=null?(o>0&&s.push(String.fromCharCode.apply(String,i.slice(
0,o))),s.join("")):String.fromCharCode.apply(String,i.slice(0,o))}function Ug(r,e,t){const n=t;let s,i;for(let o=0;o<r.length;++o)
s=r.charCodeAt(o),s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&((i=r.charCodeAt(o+1))&64512)===
56320?(s=65536+((s&1023)<<10)+(i&1023),++o,e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=
s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128);return t-n}function Ut(r,e){return RangeError(`index out of range: ${r.pos}\
 + ${e??1} > ${r.len}`)}function ji(r,e){return(r[e-4]|r[e-3]<<8|r[e-2]<<16|r[e-1]<<24)>>>0}class Zx{buf;pos;len;_slice=Uint8Array.
prototype.subarray;constructor(e){this.buf=Lg(e),this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.
pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.
pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.
buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Ut(this,
10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==
0}fixed32(){if(this.pos+4>this.len)throw Ut(this,4);return ji(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Ut(
this,4);return ji(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Ut(this,4);const e=Vx(this.buf,this.pos);
return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Ut(this,4);const e=Kx(this.buf,this.pos);return this.pos+=8,e}bytes(){
const e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw Ut(this,e);return this.pos+=e,t===n?new Uint8Array(0):
this.buf.subarray(t,n)}string(){const e=this.bytes();return Yx(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+
e>this.len)throw Ut(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Ut(this);while((this.buf[this.pos++]&128)!==
0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());
break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid\
 wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new rt(0,0);let t=0;if(this.len-this.pos>4){
for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.
pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){
if(this.pos>=this.len)throw Ut(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}
return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.
pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Ut(this);if(e.hi=
(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){
if(this.pos+8>this.len)throw Ut(this,8);const e=ji(this.buf,this.pos+=4),t=ji(this.buf,this.pos+=4);return new rt(e,t)}int64(){
return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.
readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=Gx(this.buf,this.pos);
return this.pos+=Ku(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().
zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().
zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){
return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().
toNumber()}sfixed64String(){return this.readFixed64().toString()}}function Fg(r){return new Zx(r instanceof Uint8Array?r:
r.subarray())}function as(r,e,t){const n=Fg(r);return e.decode(n,void 0,t)}function Ll(r){if(r instanceof Uint8Array&&r.
constructor.name==="Uint8Array")return Fh(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return Fh(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function ev(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const Uh=4096;function tv(r){const e=r.
length;if(e<=Uh)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=Uh));return t}function rv(r){return r?.buffer instanceof ArrayBuffer}function Fh(r){return rv(r)?r:r.slice()}
function nv(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=
256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;
for(var R=h.repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.
length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&
C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var sv=nv,iv=sv;let ov=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},av=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Og(this,e)}},
cv=class{decoders;constructor(e){this.decoders=e}or(e){return Og(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Og(r,e){return new cv({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let lv=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new ov(e,t,n),this.decoder=new av(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Pa({name:r,prefix:e,encode:t,decode:n}){return new lv(r,e,t,
n)}function Ii({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=iv(t,r,n);return Pa({prefix:e,
name:r,encode:s,decode:o=>Ll(i(o))})}function uv(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function dv(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function hv(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function ze({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=hv(n,s);return Pa(
{prefix:e,name:r,encode(o){return dv(o,n,t)},decode(o){return uv(o,i,t,r)}})}const fv=Ii({prefix:"9",name:"base10",alphabet:"\
0123456789"}),pv=Object.freeze(Object.defineProperty({__proto__:null,base10:fv},Symbol.toStringTag,{value:"Module"})),mv=ze(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),gv=ze({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),bv=Object.freeze(Object.defineProperty({__proto__:null,
base16:mv,base16upper:gv},Symbol.toStringTag,{value:"Module"})),yv=ze({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
wv=Object.freeze(Object.defineProperty({__proto__:null,base2:yv},Symbol.toStringTag,{value:"Module"})),zg=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),kv=zg.reduce((r,e,t)=>(r[t]=e,r),[]),Ev=zg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function xv(r){return r.reduce((e,t)=>(e+=kv[t],e),"")}function vv(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=Ev[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const Sv=Pa({prefix:"🚀",name:"\
base256emoji",encode:xv,decode:vv}),Av=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:Sv},Symbol.toStringTag,
{value:"Module"})),_v=ze({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
Iv=ze({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),Cv=ze(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Tv=ze({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Mv=ze({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Rv=ze({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Bv=ze({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),Lv=ze({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Dv=ze({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),Pv=Object.freeze(Object.defineProperty({__proto__:null,
base32:_v,base32hex:Mv,base32hexpad:Bv,base32hexpadupper:Lv,base32hexupper:Rv,base32pad:Cv,base32padupper:Tv,base32upper:Iv,
base32z:Dv},Symbol.toStringTag,{value:"Module"})),$v=Ii({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),Nv=Ii({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
Uv=Object.freeze(Object.defineProperty({__proto__:null,base36:$v,base36upper:Nv},Symbol.toStringTag,{value:"Module"})),Fv=Ii(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Ov=Ii({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),zv=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:Fv,base58flickr:Ov},Symbol.toStringTag,{value:"Module"})),qv=ze({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),jv=ze({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Gv=ze({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Wv=ze({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),Vv=Object.freeze(Object.defineProperty(
{__proto__:null,base64:qv,base64pad:jv,base64url:Gv,base64urlpad:Wv},Symbol.toStringTag,{value:"Module"})),Hv=ze({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),Kv=Object.freeze(Object.defineProperty({__proto__:null,base8:Hv},Symbol.
toStringTag,{value:"Module"})),Qv=Pa({prefix:"\0",name:"identity",encode:r=>tv(Ll(r)),decode:r=>Ll(ev(r))}),Jv=Object.freeze(
Object.defineProperty({__proto__:null,identity:Qv},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const Oh={...Jv,...wv,...Kv,...pv,...bv,...Pv,...Uv,...zv,...Vv,...Av};function qg(r,e,t,n){return{name:r,prefix:e,encoder:{
name:r,prefix:e,encode:t},decoder:{decode:n}}}const zh=qg("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().
encode(r.substring(1))),xc=qg("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},
r=>{r=r.substring(1);const e=Vo(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Xv={utf8:zh,"utf-8":zh,
hex:Oh.base16,latin1:xc,ascii:xc,binary:xc,...Oh};function Yv(r,e="utf8"){const t=Xv[e];if(t==null)throw new Error(`Unsu\
pported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function Zv(r){let n,s=8192;return function(o){if(o<
1||o>4096)return Vo(o);s+o>8192&&(n=Vo(8192),s=0);const a=n.subarray(s,s+=o);return(s&7)!==0&&(s=(s|7)+1),a}}class Os{fn;len;next;val;constructor(e,t,n){
this.fn=e,this.len=t,this.next=void 0,this.val=n}}function vc(){}class eS{head;tail;len;next;constructor(e){this.head=e.
head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const tS=Zv();function rS(r){return globalThis.Buffer!=null?Vo(
r):tS(r)}class Dl{len;head;tail;states;constructor(){this.len=0,this.head=new Os(vc,0,0),this.tail=this.head,this.states=
null}_push(e,t,n){return this.tail=this.tail.next=new Os(e,t,n),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.
tail.next=new sS((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(Gi,10,
rt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=rt.fromBigInt(e);return this.
_push(Gi,t.length(),t)}uint64Number(e){return this._push(jx,Ku(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){
return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=rt.
fromBigInt(e).zzEncode();return this._push(Gi,t.length(),t)}sint64Number(e){const t=rt.fromNumber(e).zzEncode();return this.
_push(Gi,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(Sc,1,e?1:0)}fixed32(e){return this.
_push(Es,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=rt.fromBigInt(e);return this._push(Es,4,t.lo)._push(
Es,4,t.hi)}fixed64Number(e){const t=rt.fromNumber(e);return this._push(Es,4,t.lo)._push(Es,4,t.hi)}fixed64String(e){return this.
fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.
fixed64String(e)}float(e){return this._push(Wx,4,e)}double(e){return this._push(Hx,8,e)}bytes(e){const t=e.length>>>0;return t===
0?this._push(Sc,1,0):this.uint32(t)._push(iS,t,e)}string(e){const t=Xx(e);return t!==0?this.uint32(t)._push(Ug,t,e):this.
_push(Sc,1,0)}fork(){return this.states=new eS(this),this.head=this.tail=new Os(vc,0,0),this.len=0,this}reset(){return this.
states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):
(this.head=this.tail=new Os(vc,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,n=this.len;return this.reset().
uint32(n),n!==0&&(this.tail.next=e.next,this.tail=t,this.len+=n),this}finish(){let e=this.head.next;const t=rS(this.len);
let n=0;for(;e!=null;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t}}function Sc(r,e,t){e[t]=r&255}function nS(r,e,t){for(;r>
127;)e[t++]=r&127|128,r>>>=7;e[t]=r}class sS extends Os{next;constructor(e,t){super(nS,e,t),this.next=void 0}}function Gi(r,e,t){
for(;r.hi!==0;)e[t++]=r.lo&127|128,r.lo=(r.lo>>>7|r.hi<<25)>>>0,r.hi>>>=7;for(;r.lo>127;)e[t++]=r.lo&127|128,r.lo=r.lo>>>
7;e[t++]=r.lo}function Es(r,e,t){e[t]=r&255,e[t+1]=r>>>8&255,e[t+2]=r>>>16&255,e[t+3]=r>>>24}function iS(r,e,t){e.set(r,
t)}globalThis.Buffer!=null&&(Dl.prototype.bytes=function(r){const e=r.length>>>0;return this.uint32(e),e>0&&this._push(oS,
e,r),this},Dl.prototype.string=function(r){const e=globalThis.Buffer.byteLength(r);return this.uint32(e),e>0&&this._push(
aS,e,r),this});function oS(r,e,t){e.set(r,t)}function aS(r,e,t){r.length<40?Ug(r,e,t):e.utf8Write!=null?e.utf8Write(r,t):
e.set(Yv(r),t)}function cS(){return new Dl}function cs(r,e){const t=cS();return e.encode(r,t,{lengthDelimited:!1}),t.finish()}
function*ls(r,e,t){const n=Fg(r);yield*e.stream(n,void 0,".",t)}const jg={VARINT:0,LENGTH_DELIMITED:2};function Gg(r,e,t,n,s){
return{name:r,type:e,encode:t,decode:n,stream:s}}function lS(r){function e(i){if(r[i.toString()]==null)throw new Error("\
Invalid enum value");return r[i]}const t=function(o,a){const c=e(o);a.int32(c)},n=function(o){const a=o.int32();return e(
a)},s=function*(o,a){};return Gg("enum",jg.VARINT,t,n,s)}function us(r,e,t){return Gg("message",jg.LENGTH_DELIMITED,r,e,
t)}class es extends Error{code="ERR_MAX_LENGTH";name="MaxLengthError"}var et;(function(r){(function(o){o.RAW="RAW",o.DIRECTORY=
"DIRECTORY",o.FILE="FILE",o.METADATA="METADATA",o.SYMLINK="SYMLINK",o.HAMT_SHARD="HAMT_SHARD"})(r.Type||(r.Type={}));let e;
(function(o){o[o.RAW=0]="RAW",o[o.DIRECTORY=1]="DIRECTORY",o[o.FILE=2]="FILE",o[o.METADATA=3]="METADATA",o[o.SYMLINK=4]=
"SYMLINK",o[o.HAMT_SHARD=5]="HAMT_SHARD"})(e||(e={})),(function(o){o.codec=()=>lS(e)})(r.Type||(r.Type={}));let t;r.codec=
()=>(t==null&&(t=us((o,a,c={})=>{if(c.lengthDelimited!==!1&&a.fork(),o.type!=null&&(a.uint32(8),r.Type.codec().encode(o.
type,a)),o.data!=null&&(a.uint32(18),a.bytes(o.data)),o.fileSize!=null&&(a.uint32(24),a.uint64(o.fileSize)),o.blockSizes!=
null&&o.blockSizes.length>0)for(const l of o.blockSizes)a.uint32(32),a.uint64(l);o.hashType!=null&&(a.uint32(40),a.uint64(
o.hashType)),o.fanOut!=null&&(a.uint32(48),a.uint64(o.fanOut)),o.mode!=null&&(a.uint32(56),a.uint32(o.mode)),o.mtime!=null&&
(a.uint32(66),Vs.codec().encode(o.mtime,a)),c.lengthDelimited!==!1&&a.ldelim()},(o,a,c={})=>{const l={blockSizes:[]},u=a==
null?o.len:o.pos+a;for(;o.pos<u;){const h=o.uint32();switch(h>>>3){case 1:{l.type=r.Type.codec().decode(o);break}case 2:{
l.data=o.bytes();break}case 3:{l.fileSize=o.uint64();break}case 4:{if(c.limits?.blockSizes!=null&&l.blockSizes.length===
c.limits.blockSizes)throw new es('Decode error - repeated field "blockSizes" had too many elements');l.blockSizes.push(o.
uint64());break}case 5:{l.hashType=o.uint64();break}case 6:{l.fanOut=o.uint64();break}case 7:{l.mode=o.uint32();break}case 8:{
l.mtime=Vs.codec().decode(o,o.uint32(),{limits:c.limits?.mtime});break}default:{o.skipType(h&7);break}}}return l},function*(o,a,c,l={}){
const u={blockSizes:0},h=a==null?o.len:o.pos+a;for(c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-1):c,type:"\
start",message:"UnixFS"});o.pos<h;){const d=o.uint32();switch(d>>>3){case 1:{yield{field:`${c}type`,value:r.Type.codec().
decode(o)};break}case 2:{yield{field:`${c}data`,value:o.bytes()};break}case 3:{yield{field:`${c}fileSize`,value:o.uint64()};
break}case 4:{if(l.limits?.blockSizes!=null&&u.blockSizes===l.limits.blockSizes)throw new es('Streaming decode error - r\
epeated field "blockSizes" had too many elements');yield{field:`${c}blockSizes[]`,index:u.blockSizes,value:o.uint64()},u.
blockSizes++;break}case 5:{yield{field:`${c}hashType`,value:o.uint64()};break}case 6:{yield{field:`${c}fanOut`,value:o.uint64()};
break}case 7:{yield{field:`${c}mode`,value:o.uint32()};break}case 8:{yield*Vs.codec().stream(o,o.uint32(),`${c}mtime.`,{
limits:l.limits?.mtime});break}default:{o.skipType(d&7);break}}}c!=="."&&(yield{field:c.endsWith(".")?c.substring(0,c.length-
1):c,type:"end",message:"UnixFS"})})),t);function n(o){return cs(o,r.codec())}r.encode=n;function s(o,a){return as(o,r.codec(),
a)}r.decode=s;function i(o,a){return ls(o,r.codec(),a)}r.stream=i})(et||(et={}));var Vs;(function(r){let e;r.codec=()=>(e==
null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.seconds!=null&&(o.uint32(8),o.int64(i.seconds)),i.fractionalNanoseconds!=
null&&(o.uint32(21),o.fixed32(i.fractionalNanoseconds)),a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?
i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.seconds=i.int64();break}case 2:{a.fractionalNanoseconds=
i.fixed32();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"UnixTime"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}seconds`,value:i.int64()};break}case 2:{yield{field:`${a}fractionalNanoseconds`,value:i.
fixed32()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"\
end",message:"UnixTime"})})),e);function t(i){return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}
r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=s})(Vs||(Vs={}));var qh;(function(r){let e;r.codec=()=>(e==
null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.mimeType!=null&&(o.uint32(10),o.string(i.mimeType)),a.lengthDelimited!==
!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{a.mimeType=
i.string();break}default:{i.skipType(l&7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Metadata"});i.pos<c;){const l=i.uint32();
switch(l>>>3){case 1:{yield{field:`${a}mimeType`,value:i.string()};break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{
field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Metadata"})})),e);function t(i){return cs(i,r.codec())}
r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=s})(qh||
(qh={}));var Jr;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{a.lengthDelimited!==!1&&o.fork(),i.hash!=null&&
(o.uint32(10),o.bytes(i.hash)),i.name!=null&&(o.uint32(18),o.string(i.name)),i.tSize!=null&&(o.uint32(24),o.uint64(i.tSize)),
a.lengthDelimited!==!1&&o.ldelim()},(i,o)=>{const a={},c=o==null?i.len:i.pos+o;for(;i.pos<c;){const l=i.uint32();switch(l>>>
3){case 1:{a.hash=i.bytes();break}case 2:{a.name=i.string();break}case 3:{a.tSize=i.uint64();break}default:{i.skipType(l&
7);break}}}return a},function*(i,o,a){const c=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"Link"});i.pos<c;){const l=i.uint32();switch(l>>>3){case 1:{yield{field:`${a}hash`,
value:i.bytes()};break}case 2:{yield{field:`${a}name`,value:i.string()};break}case 3:{yield{field:`${a}tSize`,value:i.uint64()};
break}default:{i.skipType(l&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"\
Link"})})),e);function t(i){return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){
return ls(i,r.codec(),o)}r.stream=s})(Jr||(Jr={}));var hi;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{if(a.
lengthDelimited!==!1&&o.fork(),i.data!=null&&(o.uint32(10),et.codec().encode(i.data,o)),i.links!=null&&i.links.length>0)
for(const c of i.links)o.uint32(18),Jr.codec().encode(c,o);a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},
l=o==null?i.len:i.pos+o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 1:{c.data=et.codec().decode(i,i.uint32(),{limits:a.
limits?.data});break}case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new es('Decode error - repe\
ated field "links" had too many elements');c.links.push(Jr.codec().decode(i,i.uint32(),{limits:a.limits?.links$}));break}default:{
i.skipType(u&7);break}}}return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.
endsWith(".")?a.substring(0,a.length-1):a,type:"start",message:"Node"});i.pos<u;){const h=i.uint32();switch(h>>>3){case 1:{
yield*et.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}case 2:{if(c.limits?.links!=null&&l.links===
c.limits.links)throw new es('Streaming decode error - repeated field "links" had too many elements');for(const d of Jr.codec().
stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...d,index:l.links};l.links++;break}default:{i.skipType(
h&7);break}}}a!=="."&&(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"Node"})})),e);function t(i){
return cs(i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),
o)}r.stream=s})(hi||(hi={}));var jh;(function(r){let e;r.codec=()=>(e==null&&(e=us((i,o,a={})=>{if(a.lengthDelimited!==!1&&
o.fork(),i.links!=null&&i.links.length>0)for(const c of i.links)o.uint32(18),Jr.codec().encode(c,o);i.data!=null&&(o.uint32(
10),et.codec().encode(i.data,o)),a.lengthDelimited!==!1&&o.ldelim()},(i,o,a={})=>{const c={links:[]},l=o==null?i.len:i.pos+
o;for(;i.pos<l;){const u=i.uint32();switch(u>>>3){case 2:{if(a.limits?.links!=null&&c.links.length===a.limits.links)throw new es(
'Decode error - repeated field "links" had too many elements');c.links.push(Jr.codec().decode(i,i.uint32(),{limits:a.limits?.
links$}));break}case 1:{c.data=et.codec().decode(i,i.uint32(),{limits:a.limits?.data});break}default:{i.skipType(u&7);break}}}
return c},function*(i,o,a,c={}){const l={links:0},u=o==null?i.len:i.pos+o;for(a!=="."&&(yield{field:a.endsWith(".")?a.substring(
0,a.length-1):a,type:"start",message:"LegacyNode"});i.pos<u;){const h=i.uint32();switch(h>>>3){case 2:{if(c.limits?.links!=
null&&l.links===c.limits.links)throw new es('Streaming decode error - repeated field "links" had too many elements');for(const d of Jr.
codec().stream(i,i.uint32(),`${a}links[].`,{limits:c.limits?.links$}))yield{...d,index:l.links};l.links++;break}case 1:{
yield*et.codec().stream(i,i.uint32(),`${a}data.`,{limits:c.limits?.data});break}default:{i.skipType(h&7);break}}}a!=="."&&
(yield{field:a.endsWith(".")?a.substring(0,a.length-1):a,type:"end",message:"LegacyNode"})})),e);function t(i){return cs(
i,r.codec())}r.encode=t;function n(i,o){return as(i,r.codec(),o)}r.decode=n;function s(i,o){return ls(i,r.codec(),o)}r.stream=
s})(jh||(jh={}));const Gh={RAW:"raw",DIRECTORY:"directory",FILE:"file",METADATA:"metadata",SYMLINK:"symlink",HAMT_SHARD:"\
hamt-sharded-directory"},uS=["directory","hamt-sharded-directory"],Wh=parseInt("0644",8),Vh=parseInt("0755",8);class dt{static unmarshal(e){
const t=et.decode(e),n=new dt({type:Gh[t.type!=null?t.type.toString():"FILE"],data:t.data,blockSizes:t.blockSizes,mode:t.
mode,mtime:t.mtime!=null?{secs:t.mtime.seconds??0n,nsecs:t.mtime.fractionalNanoseconds}:void 0,fanout:t.fanOut});return n.
_originalMode=t.mode??0,n}type;data;blockSizes;hashType;fanout;mtime;_mode;_originalMode;constructor(e={type:"file"}){const{
type:t,data:n,blockSizes:s,hashType:i,fanout:o,mtime:a,mode:c}=e;if(t!=null&&!Object.values(Gh).includes(t))throw new di(
"Type: "+t+" is not valid");this.type=t??"file",this.hashType=i,this.fanout=o,this.blockSizes=s??[],this._originalMode=0,
this.mode=c,this.mtime=a,n!=null&&(this.data=Lg(n))}set mode(e){e==null?this._mode=this.isDirectory()?Vh:Wh:this._mode=e&
4095}get mode(){return this._mode}isDirectory(){return uS.includes(this.type)}addBlockSize(e){this.blockSizes.push(e)}removeBlockSize(e){
this.blockSizes.splice(e,1)}fileSize(){if(this.isDirectory())return 0n;let e=0n;return this.blockSizes.forEach(t=>{e+=t}),
this.data!=null&&(e+=BigInt(this.data.length)),e}marshal(){let e;switch(this.type){case"raw":e=et.Type.RAW;break;case"di\
rectory":e=et.Type.DIRECTORY;break;case"file":e=et.Type.FILE;break;case"metadata":e=et.Type.METADATA;break;case"symlink":
e=et.Type.SYMLINK;break;case"hamt-sharded-directory":e=et.Type.HAMT_SHARD;break;default:throw new di(`Type: ${e} is not \
valid`)}let t=this.data;(this.data==null||this.data.length===0)&&(t=void 0);let n;this.mode!=null&&(n=this._originalMode&
4294963200|(this.mode??0),n===Wh&&!this.isDirectory()&&(n=void 0),n===Vh&&this.isDirectory()&&(n=void 0));let s;return this.
mtime!=null&&(s={seconds:this.mtime.secs,fractionalNanoseconds:this.mtime.nsecs}),et.encode({type:e,data:t,fileSize:this.
type==="file"||this.type==="raw"?this.fileSize():void 0,blockSizes:this.blockSizes,hashType:this.hashType,fanOut:this.fanout,
mode:n,mtime:s})}}function dS(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function fn(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return fi(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return fi(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function hS(r){const e=new Uint8Array(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}const Hh=4096;function fS(r){const e=r.length;if(e<=Hh)return String.fromCharCode.
apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=Hh));return t}function pS(r){
return r?.buffer instanceof ArrayBuffer}function fi(r){return pS(r)?r:r.slice()}const mS="raw",Pl=85;function gS(r){return fn(
r)}function bS(r){return fn(r)}const yS=Object.freeze(Object.defineProperty({__proto__:null,code:Pl,decode:bS,encode:gS,
name:mS},Symbol.toStringTag,{value:"Module"}));class tr extends Event{type;detail;constructor(e,t){super(e),this.type=e,
this.detail=t}}function wS(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),
s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==
0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-
w;M!==A&&v[M]===0;)M++;for(var R=h.repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.
length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&
C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var kS=wS,ES=kS;let xS=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},vS=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Wg(this,e)}},
SS=class{decoders;constructor(e){this.decoders=e}or(e){return Wg(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Wg(r,e){return new SS({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let AS=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new xS(e,t,n),this.decoder=new vS(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function $a({name:r,prefix:e,encode:t,decode:n}){return new AS(r,e,t,
n)}function Ci({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=ES(t,r,n);return $a({prefix:e,
name:r,encode:s,decode:o=>fn(i(o))})}function _S(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function IS(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function CS(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function qe({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=CS(n,s);return $a(
{prefix:e,name:r,encode(o){return IS(o,n,t)},decode(o){return _S(o,i,t,r)}})}const Hs=qe({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),TS=qe({prefix:"B",name:"base32upper",alphabet:"ABCD\
EFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),MS=qe({prefix:"c",name:"base32pad",alphabet:"abcdefghij\
klmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),RS=qe({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJ\
KLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),BS=qe({prefix:"v",name:"base32hex",alphabet:"0123456789abcde\
fghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),LS=qe({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),DS=qe({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghi\
jklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),PS=qe({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEF\
GHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),$S=qe({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwis\
za345h769",bitsPerChar:5}),NS=Object.freeze(Object.defineProperty({__proto__:null,base32:Hs,base32hex:BS,base32hexpad:DS,
base32hexpadupper:PS,base32hexupper:LS,base32pad:MS,base32padupper:RS,base32upper:TS,base32z:$S},Symbol.toStringTag,{value:"\
Module"})),po=Ci({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),US=Ci({prefix:"\
K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),FS=Object.freeze(Object.defineProperty(
{__proto__:null,base36:po,base36upper:US},Symbol.toStringTag,{value:"Module"})),fr=Ci({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),OS=Ci({name:"base58flickr",prefix:"Z",alphabet:"123456789a\
bcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),zS=Object.freeze(Object.defineProperty({__proto__:null,base58btc:fr,
base58flickr:OS},Symbol.toStringTag,{value:"Module"}));var qS=Vg,Kh=128,jS=-128,GS=Math.pow(2,31);function Vg(r,e,t){e=e||
[],t=t||0;for(var n=t;r>=GS;)e[t++]=r&255|Kh,r/=128;for(;r&jS;)e[t++]=r&255|Kh,r>>>=7;return e[t]=r|0,Vg.bytes=t-n+1,e}var WS=$l,
VS=128,Qh=127;function $l(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw $l.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&Qh)<<s:(o&Qh)*Math.pow(2,s),s+=7}while(o>=VS);return $l.bytes=i-n,t}var HS=Math.pow(
2,7),KS=Math.pow(2,14),QS=Math.pow(2,21),JS=Math.pow(2,28),XS=Math.pow(2,35),YS=Math.pow(2,42),ZS=Math.pow(2,49),e2=Math.
pow(2,56),t2=Math.pow(2,63),r2=function(r){return r<HS?1:r<KS?2:r<QS?3:r<JS?4:r<XS?5:r<YS?6:r<ZS?7:r<e2?8:r<t2?9:10},n2={
encode:qS,decode:WS,encodingLength:r2},Ho=n2;function Nl(r,e=0){const t=Ho.decode(r,e),n=Ho.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Ko(r,e,t=0){return Ho.encode(r,e,t),e}function Qo(r){return Ho.encodingLength(r)}function Hg(r,e){const t=e.
byteLength,n=Qo(r),s=n+Qo(t),i=new Uint8Array(s+t);return Ko(r,i,0),Ko(t,i,n),i.set(e,s),new Xu(r,t,e,i)}function s2(r){
const e=fn(r),[t,n]=Nl(e),[s,i]=Nl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new Xu(t,s,o,e)}function i2(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&dS(r.bytes,t.bytes)}}let Xu=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
fi(n),this.bytes=fi(s)}};function Jh(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return c2(t,Ul(r),e??fr.encoder);default:
return l2(t,Ul(r),e??Hs.encoder)}}const Xh=new WeakMap;function Ul(r){const e=Xh.get(r);if(e==null){const t=new Map;return Xh.
set(r,t),t}return e}let o2=class Qe{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=fi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
xs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==u2)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Qe.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=Hg(e,
t);return Qe.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Qe.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&i2(e.multihash,n.multihash)}toString(e){return Jh(this,e)}toJSON(){return{"/":Jh(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Qe)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Qe(n,s,i,o??Yh(n,s,i.bytes))}else if(t[d2]===!0){const{version:n,
multihash:s,code:i}=t,o=s2(s);return Qe.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==xs)throw new Error(`Version 0 CID must use dag-pb (code: ${xs}) block encoding`);return new Qe(e,t,n,n.bytes)}case 1:{
const s=Yh(e,t,n.bytes);return new Qe(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Qe.
create(0,xs,e)}static createV1(e,t){return Qe.create(1,e,t)}static decode(e){const[t,n]=Qe.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Qe.inspectBytes(e),n=t.size-t.multihashSize,
s=fn(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new Xu(t.multihashCode,t.digestSize,i,s);return[t.version===0?Qe.createV0(o):Qe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Nl(e.subarray(t));return t+=d,h};let s=n(),
i=xs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=a2(e,t),
i=Qe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Ul(
i).set(n,e),i}};function a2(r,e){switch(r[0]){case"Q":{const t=e??fr;return[fr.prefix,t.decode(`${fr.prefix}${r}`)]}case fr.
prefix:{const t=e??fr;return[fr.prefix,t.decode(r)]}case Hs.prefix:{const t=e??Hs;return[Hs.prefix,t.decode(r)]}case po.
prefix:{const t=e??po;return[po.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function c2(r,e,t){const{prefix:n}=t;if(n!==
fr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function l2(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const xs=112,u2=18;function Yh(r,e,t){const n=Qo(r),s=n+Qo(e),i=new Uint8Array(s+t.
byteLength);return Ko(r,i,0),Ko(e,i,n),i.set(t,s),i}const d2=Symbol.for("@ipld/js-cid/CID"),h2=20;function f2({name:r,code:e,
encode:t,minDigestLength:n,maxDigestLength:s}){return new p2(r,e,t,n,s)}let p2=class{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){
this.name=e,this.code=t,this.encode=n,this.minDigestLength=s??h2,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){
if(t.truncate<this.minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);
if(this.maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less th\
an or equal to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?
Zh(n,this.code,t?.truncate):n.then(s=>Zh(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}};
function Zh(r,e,t){if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be les\
s than or equal to ${r.byteLength}`);r=r.subarray(0,t)}return Hg(e,r)}function m2(r){return async e=>new Uint8Array(await crypto.
subtle.digest(r,e))}const g2=f2({name:"sha2-256",code:18,encode:m2("SHA-256")}),en=async(r,e,t)=>{t.codec==null&&(t.codec=
vg);const n=await g2.digest(r),s=o2.create(t.cidVersion??Ig,t.codec.code,n);return await e.put(s,r,t),s};function b2(r){
return async function*(t,n){let s=0n;for await(let i of t.content)yield async()=>{let o;const a={codec:vg,cidVersion:r.cidVersion,
onProgress:r.onProgress};r.rawLeaves?(a.codec=yS,a.cidVersion=1):(o=new dt({type:r.leafType,data:i}),i=er({Data:o.marshal(),
Links:[]},r));const c=await en(i,n,a);return s+=BigInt(i.byteLength),r.onProgress?.(new tr("unixfs:importer:progress:fil\
e:write",{bytesWritten:s,cid:c,path:t.path})),{cid:c,unixfs:o,size:BigInt(i.length),block:i}}}}let y2=class Fl extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Fl.name;code=Fl.code;constructor(e="Invalid parameters"){super(
e)}};class br extends Error{static name="InvalidContentError";static code="ERR_INVALID_CONTENT";name=br.name;code=br.code;constructor(e="\
Invalid content"){super(e)}}class ef extends Error{static name="InvalidShardingStrategyError";static code="ERR_SHARDING_\
STRATEGY";name=br.name;code=br.code}const w2=async(r,e,t)=>{const n=new dt({type:"directory",mtime:r.mtime,mode:r.mode}),
s=er(Zt({Data:n.marshal()}),t),i=await en(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.
originalPath,block:s}};async function*k2(r,e,t){let n=-1,s;for await(const i of Ag(t.bufferImporter(r,e),t.blockWriteConcurrency)){
if(n++,n===0){s={...i,single:!0};continue}else n===1&&s!=null&&(yield{...s,block:void 0,single:void 0},s=void 0);yield{...i,
block:void 0}}s!=null&&(yield s)}function tf(r){return r.single===!0}const E2=(r,e,t)=>async function(s){if(s.length===1&&
tf(s[0])&&t.reduceSingleLeafToSelf){const u=s[0];let h=u.block;return tf(u)&&(r.mtime!==void 0||r.mode!==void 0)&&(u.unixfs=
new dt({type:"file",mtime:r.mtime,mode:r.mode,data:u.block}),h={Data:u.unixfs.marshal(),Links:[]},u.block=er(Zt(h),t),u.
cid=await en(u.block,e,{...t,cidVersion:t.cidVersion}),u.size=BigInt(u.block.length)),t.onProgress?.(new tr("unixfs:impo\
rter:progress:file:layout",{cid:u.cid,path:r.originalPath})),{cid:u.cid,path:r.path,unixfs:u.unixfs,size:u.size,originalPath:r.
originalPath}}const i=new dt({type:"file",mtime:r.mtime,mode:r.mode}),o=s.filter(u=>u.cid.code===Pl&&u.size>0||u.unixfs!=
null&&u.unixfs.data==null&&u.unixfs.fileSize()>0n?!0:!!u.unixfs?.data?.length).map(u=>u.cid.code===Pl?(i.addBlockSize(u.
size),{Name:"",Tsize:Number(u.size),Hash:u.cid}):(u.unixfs?.data==null?i.addBlockSize(u.unixfs?.fileSize()??0n):i.addBlockSize(
BigInt(u.unixfs.data.length)),{Name:"",Tsize:Number(u.size),Hash:u.cid})),a={Data:i.marshal(),Links:o},c=er(Zt(a),t),l=await en(
c,e,t);return t.onProgress?.(new tr("unixfs:importer:progress:file:layout",{cid:l,path:r.originalPath})),{cid:l,path:r.path,
unixfs:i,size:BigInt(c.length+a.Links.reduce((u,h)=>u+(h.Tsize??0),0)),originalPath:r.originalPath,block:c}},x2=async(r,e,t)=>t.
layout(k2(r,e,t),E2(r,e,t)),v2=Ci({prefix:"9",name:"base10",alphabet:"0123456789"}),S2=Object.freeze(Object.defineProperty(
{__proto__:null,base10:v2},Symbol.toStringTag,{value:"Module"})),A2=qe({prefix:"f",name:"base16",alphabet:"0123456789abc\
def",bitsPerChar:4,caseInsensitive:!0}),_2=qe({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),
I2=Object.freeze(Object.defineProperty({__proto__:null,base16:A2,base16upper:_2},Symbol.toStringTag,{value:"Module"})),C2=qe(
{prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),T2=Object.freeze(Object.defineProperty({__proto__:null,base2:C2},
Symbol.toStringTag,{value:"Module"})),Kg=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁\
🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥\
🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲\
🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯\
💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),
M2=Kg.reduce((r,e,t)=>(r[t]=e,r),[]),R2=Kg.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(`Invalid\
 character: ${e}`);return r[n]=t,r},[]);function B2(r){return r.reduce((e,t)=>(e+=M2[t],e),"")}function L2(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=R2[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const D2=$a({prefix:"🚀",name:"\
base256emoji",encode:B2,decode:L2}),P2=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:D2},Symbol.toStringTag,
{value:"Module"})),$2=qe({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456\
789+/",bitsPerChar:6}),N2=qe({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\
0123456789+/=",bitsPerChar:6}),U2=qe({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr\
stuvwxyz0123456789-_",bitsPerChar:6}),F2=qe({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh\
ijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),O2=Object.freeze(Object.defineProperty({__proto__:null,base64:$2,base64pad:N2,
base64url:U2,base64urlpad:F2},Symbol.toStringTag,{value:"Module"})),z2=qe({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),
q2=Object.freeze(Object.defineProperty({__proto__:null,base8:z2},Symbol.toStringTag,{value:"Module"})),j2=$a({prefix:"\0",
name:"identity",encode:r=>fS(fn(r)),decode:r=>fn(hS(r))}),G2=Object.freeze(Object.defineProperty({__proto__:null,identity:j2},
Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const rf={...G2,...T2,...q2,...S2,...I2,...NS,...FS,
...zS,...O2,...P2};function Qg(r,e,t,n){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const nf=Qg(
"utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Ac=Qg("ascii","a",r=>{let e="\
a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Wo(r.length);for(let t=0;t<
r.length;t++)e[t]=r.charCodeAt(t);return e}),W2={utf8:nf,"utf-8":nf,hex:rf.base16,latin1:Ac,ascii:Ac,binary:Ac,...rf};function Jg(r,e="\
utf8"){const t=W2[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}
const V2=async(r,e,t)=>{const n=new dt({type:"symlink",data:Jg(r.link),mtime:r.mtime,mode:r.mode}),s=er(Zt({Data:n.marshal()})),
i=await en(s,e,t),o=r.path;return{cid:i,path:o,unixfs:n,size:BigInt(s.length),originalPath:r.originalPath,block:s}};function H2(r){
return Symbol.iterator in r}function K2(r){return Symbol.asyncIterator in r}function Q2(r){try{if(r instanceof Uint8Array)
return(async function*(){yield r})();if(H2(r))return(async function*(){yield*r})();if(K2(r))return r}catch{throw new br(
"Content was invalid")}throw new br("Content was invalid")}function J2(r){return typeof r.path=="string"}function X2(r){
return async function*(t,n){for await(const s of t){let i;if(J2(s)&&(i=s.path,s.path=s.path.split("/").filter(o=>o!=null&&
o!==".").join("/")),Y2(s)){const o={path:s.path,mtime:s.mtime,mode:s.mode,content:(async function*(){let c=0n;for await(const l of r.
chunker(r.chunkValidator(Q2(s.content)))){const u=BigInt(l.byteLength);c+=u,r.onProgress?.(new tr("unixfs:importer:progr\
ess:file:read",{bytesRead:c,chunkSize:u,path:s.path})),yield l}})(),originalPath:i},a=r.fileBuilder??x2;yield async()=>a(
o,n,r)}else if(Z2(s)){const o={path:s.path,link:s.link,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.symlinkBuilder??V2;
yield async()=>a(o,n,r)}else if(s.path!=null){const o={path:s.path,mtime:s.mtime,mode:s.mode,originalPath:i},a=r.dirBuilder??
w2;yield async()=>a(o,n,r)}else throw new Error("Import candidate must have content or path or both")}}}function Y2(r){return r.
content!=null}function Z2(r){return r.link!=null}const eA=()=>async function*(e){for await(const t of e){if(t.length===void 0)
throw new br("Content was invalid");if(typeof t=="string"||t instanceof String)yield Jg(t.toString());else if(Array.isArray(
t))yield Uint8Array.from(t);else if(t instanceof Uint8Array)yield t;else throw new br("Content was invalid")}},tA=174;function Xg(r){
const e=r?.maxChildrenPerNode??tA;return async function t(n,s){const i=[];for await(const o of Sg(n,e))i.push(await s(o));
return i.length>1?t(i,s):i[0]}}class pi{options;root;dir;path;dirty;flat;parent;parentKey;unixfs;mode;mtime;cid;size;nodeSize;constructor(e,t){
this.options=t??{},this.root=e.root,this.dir=e.dir,this.path=e.path,this.dirty=e.dirty,this.flat=e.flat,this.parent=e.parent,
this.parentKey=e.parentKey,this.unixfs=e.unixfs,this.mode=e.mode,this.mtime=e.mtime}}const sf=2**32,rA=[0,1,2,2,3,3,3,3,
4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,
8,8,8,8,8,8,8,8];function nA(r){let e=0;return r>=sf&&(r=Math.floor(r/sf),e=32),r>=65536&&(r>>>=16,e+=16),r>=256&&(r>>>=
8,e+=8),e+rA[r]}function Qr(r){return r%2===0&&r++,Math.floor((nA(r)+6)/7)}function _c(r){let e=0;for(let t=0;t<r.length;t++){
const n=r.charCodeAt(t);n<128?e++:n<2048?e+=2:n>=55296&&n<=56319&&t+1<r.length?(t++,e+=4):e+=3}return e}function sA(r,e,t){
let n=1+Qr(e)+e;return n+=1+Qr(r)+r,n+=1+Qr(t),1+Qr(n)+n}const iA=493;function oA(r,e){let t=2;if(r!==void 0&&r!==iA&&(t+=
1+Qr(r)),e!=null){let n=0;const s=Number(e.secs);s<0?n+=11:n+=1+Qr(s),e.nsecs!=null&&(n+=5),t+=1+Qr(n)+n}return 1+Qr(t)+
t}function Ic(r,e){return e?.cid!=null&&e?.size!=null?r+e.cid.byteLength:0}function Cc(r,e){return e?.cid!=null&&e?.size!=
null?sA(r,e.cid.byteLength,Number(e.size)):0}class Yu extends pi{_children;constructor(e,t){super(e,t),this._children=new Map}async put(e,t){
if(this.nodeSize!==void 0){const n=this._children.get(e),s=_c(e),i=this.options?.shardSplitStrategy;if(i==="links-bytes")
this.nodeSize-=Ic(s,n),this.nodeSize+=Ic(s,t);else if(i==="block-bytes")this.nodeSize-=Cc(s,n),this.nodeSize+=Cc(s,t);else
throw new ef(`Invalid shardSplitStrategy: ${i}`);this.nodeSize<0&&(this.nodeSize=void 0)}this.cid=void 0,this.size=void 0,
this._children.set(e,t)}async get(e){return Promise.resolve(this._children.get(e))}childCount(){return this._children.size}directChildrenCount(){
return this.childCount()}onlyChild(){return this._children.values().next().value}*eachChildSeries(){for(const[e,t]of this.
_children.entries())yield{key:e,child:t}}marshal(){const e=new dt({type:"directory",mtime:this.mtime,mode:this.mode}),t=[];
for(const[s,i]of this._children.entries())if(!(i.size==null||i.cid==null)){if(i.cid==null)throw new Error("Directory con\
tents must be flushed before marshaling");t.push({Hash:i.cid,Name:s,Tsize:i.size==null?void 0:Number(i.size)})}const n={
Data:e.marshal(),Links:t};return er(Zt(n),this.options)}async estimateNodeSize(){if(this.nodeSize!==void 0)return this.nodeSize;
const e=this.options?.shardSplitStrategy;if(e==="links-bytes"){this.nodeSize=0;for(const[t,n]of this._children.entries())
this.nodeSize+=Ic(_c(t),n)}else if(e==="block-bytes"){this.nodeSize=oA(this.mode,this.mtime);for(const[t,n]of this._children.
entries())this.nodeSize+=Cc(_c(t),n)}else throw new ef(`Invalid shardSplitStrategy: ${e}`);return this.nodeSize}async*flush(e){
const t=[];for(const[c,l]of this._children.entries()){let u=l;if(l instanceof pi)for await(const h of l.flush(e))u=h,yield h;
u.size!=null&&u.cid!=null&&t.push({Name:c,Tsize:Number(u.size),Hash:u.cid})}const n=new dt({type:"directory",mtime:this.
mtime,mode:this.mode}),s={Data:n.marshal(),Links:t},i=er(Zt(s),this.options),o=await en(i,e,this.options),a=i.length+s.Links.
reduce((c,l)=>c+(l.Tsize??0),0);this.cid=o,this.size=a,yield{cid:o,unixfs:n,path:this.path,size:BigInt(a)}}}function aA(r){
return r?.buffer instanceof ArrayBuffer}function of(r){return aA(r)?r:r.slice()}var cA=Yg,af=128,lA=-128,uA=Math.pow(2,31);
function Yg(r,e,t){e=e||[],t=t||0;for(var n=t;r>=uA;)e[t++]=r&255|af,r/=128;for(;r&lA;)e[t++]=r&255|af,r>>>=7;return e[t]=
r|0,Yg.bytes=t-n+1,e}var dA=Ol,hA=128,cf=127;function Ol(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Ol.bytes=
0,new RangeError("Could not decode varint");o=r[i++],t+=s<28?(o&cf)<<s:(o&cf)*Math.pow(2,s),s+=7}while(o>=hA);return Ol.
bytes=i-n,t}var fA=Math.pow(2,7),pA=Math.pow(2,14),mA=Math.pow(2,21),gA=Math.pow(2,28),bA=Math.pow(2,35),yA=Math.pow(2,42),
wA=Math.pow(2,49),kA=Math.pow(2,56),EA=Math.pow(2,63),xA=function(r){return r<fA?1:r<pA?2:r<mA?3:r<gA?4:r<bA?5:r<yA?6:r<
wA?7:r<kA?8:r<EA?9:10},vA={encode:cA,decode:dA,encodingLength:xA},Zg=vA;function lf(r,e,t=0){return Zg.encode(r,e,t),e}function uf(r){
return Zg.encodingLength(r)}function SA(r,e){const t=e.byteLength,n=uf(r),s=n+uf(t),i=new Uint8Array(s+t);return lf(r,i,
0),lf(t,i,n),i.set(e,s),new AA(r,t,e,i)}let AA=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,
this.digest=of(n),this.bytes=of(s)}};const _A=20;function IA({name:r,code:e,encode:t,minDigestLength:n,maxDigestLength:s}){
return new CA(r,e,t,n,s)}class CA{name;code;encode;minDigestLength;maxDigestLength;constructor(e,t,n,s,i){this.name=e,this.
code=t,this.encode=n,this.minDigestLength=s??_A,this.maxDigestLength=i}digest(e,t){if(t?.truncate!=null){if(t.truncate<this.
minDigestLength)throw new Error(`Invalid truncate option, must be greater than or equal to ${this.minDigestLength}`);if(this.
maxDigestLength!=null&&t.truncate>this.maxDigestLength)throw new Error(`Invalid truncate option, must be less than or eq\
ual to ${this.maxDigestLength}`)}if(e instanceof Uint8Array){const n=this.encode(e);return n instanceof Uint8Array?df(n,
this.code,t?.truncate):n.then(s=>df(s,this.code,t?.truncate))}else throw Error("Unknown type, must be binary type")}}function df(r,e,t){
if(t!=null&&t!==r.byteLength){if(t>r.byteLength)throw new Error(`Invalid truncate option, must be less than or equal to ${r.
byteLength}`);r=r.subarray(0,t)}return SA(e,r)}function Rr(r,e){const t=r.lo+e.lo>>>0,n=r.hi+e.hi+(t<r.lo?1:0)>>>0;return{
lo:t,hi:n}}function Tt(r,e){const t=r.lo&65535,n=r.lo>>>16,s=e.lo&65535,i=e.lo>>>16,o=t*s,a=t*i,c=n*s,l=n*i,u=(o>>>16)+(a&
65535)+(c&65535)>>>0,h=(u<<16|o&65535)>>>0,d=l+(a>>>16)+(c>>>16)+(u>>>16),p=Math.imul(r.lo,e.hi),m=Math.imul(r.hi,e.lo),
y=d+p+m>>>0;return{lo:h,hi:y}}function Tn(r,e){if(e===0)return r;if(e===32)return{lo:r.hi,hi:r.lo};if(e<32){const s=(r.lo<<
e|r.hi>>>32-e)>>>0,i=(r.hi<<e|r.lo>>>32-e)>>>0;return{lo:s,hi:i}}e-=32;const t=(r.hi<<e|r.lo>>>32-e)>>>0,n=(r.lo<<e|r.hi>>>
32-e)>>>0;return{lo:t,hi:n}}function be(r,e){return{lo:(r.lo^e.lo)>>>0,hi:(r.hi^e.hi)>>>0}}function Tc(r,e){return{lo:r.
hi>>>e-32,hi:0}}function de(r,e){return{lo:r>>>0,hi:e>>>0}}function hf(r,e){const t=e*8,n=r[t]|r[t+1]<<8|r[t+2]<<16|r[t+
3]<<24,s=r[t+4]|r[t+5]<<8|r[t+6]<<16|r[t+7]<<24;return{lo:n>>>0,hi:s>>>0}}function ff(r){return r=be(r,Tc(r,33)),r=Tt(r,
de(3981806797,4283543511)),r=be(r,Tc(r,33)),r=Tt(r,de(444984403,3301882366)),r=be(r,Tc(r,33)),r}function TA(r,e=0){let t=de(
e,0),n=de(e,0);const s=r.length,i=Math.floor(s/16),o=de(289559509,2277735313),a=de(658871167,1291169091);for(let d=0;d<i;d++){
let p=hf(r,d*2),m=hf(r,d*2+1);p=Tt(p,o),p=Tn(p,31),p=Tt(p,a),t=be(t,p),t=Tn(t,27),t=Rr(t,n),t=Rr(Tt(t,de(5,0)),de(1390208809,
0)),m=Tt(m,a),m=Tn(m,33),m=Tt(m,o),n=be(n,m),n=Tn(n,31),n=Rr(n,t),n=Rr(Tt(n,de(5,0)),de(944331445,0))}let c=de(0,0),l=de(
0,0);const u=r.slice(i*16);switch(u.length){case 15:l=be(l,de(0,u[14]<<16));case 14:l=be(l,de(0,u[13]<<8));case 13:l=be(
l,de(0,u[12]));case 12:l=be(l,de(u[11]<<24,0));case 11:l=be(l,de(u[10]<<16,0));case 10:l=be(l,de(u[9]<<8,0));case 9:l=be(
l,de(u[8],0)),l=Tt(l,a),l=Tn(l,33),l=Tt(l,o),n=be(n,l);case 8:c=be(c,de(0,u[7]<<24));case 7:c=be(c,de(0,u[6]<<16));case 6:
c=be(c,de(0,u[5]<<8));case 5:c=be(c,de(0,u[4]));case 4:c=be(c,de(u[3]<<24,0));case 3:c=be(c,de(u[2]<<16,0));case 2:c=be(
c,de(u[1]<<8,0));case 1:c=be(c,de(u[0],0)),c=Tt(c,o),c=Tn(c,31),c=Tt(c,a),t=be(t,c)}const h=de(s,0);return t=be(t,h),n=be(
n,h),t=Rr(t,n),n=Rr(n,t),t=ff(t),n=ff(n),t=Rr(t,n),n=Rr(n,t),new Uint8Array([t.hi>>>24&255,t.hi>>>16&255,t.hi>>>8&255,t.
hi&255,t.lo>>>24&255,t.lo>>>16&255,t.lo>>>8&255,t.lo&255,n.hi>>>24&255,n.hi>>>16&255,n.hi>>>8&255,n.hi&255,n.lo>>>24&255,
n.lo>>>16&255,n.lo>>>8&255,n.lo&255])}const eb=IA({name:"murmur3-128",code:34,encode:r=>TA(r)});let MA=class zl extends Error{static name="\
NotFoundError";name=zl.name;static code="ERR_NOT_FOUND";code=zl.code;constructor(e="Not Found"){super(e)}};class RA{has(e,t){
return Promise.reject(new Error(".has is not implemented"))}put(e,t,n){return Promise.reject(new Error(".put is not impl\
emented"))}async*putMany(e,t){for await(const{cid:n,bytes:s}of e)await this.put(n,s,t),yield n}get(e,t){throw new Error(
".get is not implemented")}async*getMany(e,t){for await(const n of e)yield{cid:n,bytes:this.get(n,t)}}delete(e,t){return Promise.
reject(new Error(".delete is not implemented"))}async*deleteMany(e,t){for await(const n of e)await this.delete(n,t),yield n}async*getAll(e){
throw new Error(".getAll is not implemented")}}class BA extends RA{put(e,t,n){return n?.signal?.throwIfAborted(),e}get(e,t){
throw t?.signal?.throwIfAborted(),new MA}has(e,t){return t?.signal?.throwIfAborted(),!1}async delete(e,t){t?.signal?.throwIfAborted()}async*getAll(e){
e?.signal?.throwIfAborted()}}function tb(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.
default:r}var Mc,pf;function LA(){if(pf)return Mc;pf=1;const r=7;Mc=class{constructor(){this._bitArrays=[],this._data=[],
this._length=0,this._changedLength=!1,this._changedData=!1}set(o,a){let c=this._internalPositionFor(o,!1);if(a===void 0)
c!==-1&&(this._unsetInternalPos(c),this._unsetBit(o),this._changedLength=!0,this._changedData=!0);else{let l=!1;c===-1?(c=
this._data.length,this._setBit(o),this._changedData=!0):l=!0,this._setInternalPos(c,o,a,l),this._changedLength=!0}}unset(o){
this.set(o,void 0)}get(o){this._sortData();const a=this._internalPositionFor(o,!0);if(a!==-1)return this._data[a][1]}push(o){
return this.set(this.length,o),this.length}get length(){if(this._sortData(),this._changedLength){const o=this._data[this.
_data.length-1];this._length=o?o[0]+1:0,this._changedLength=!1}return this._length}forEach(o){let a=0;for(;a<this.length;)
o(this.get(a),a,this),a++}map(o){let a=0,c=new Array(this.length);for(;a<this.length;)c[a]=o(this.get(a),a,this),a++;return c}reduce(o,a){
let c=0,l=a;for(;c<this.length;){const u=this.get(c);l=o(l,u,c),c++}return l}find(o){let a=0,c,l;for(;a<this.length&&!c;)
l=this.get(a),c=o(l),a++;return c?l:void 0}_internalPositionFor(o,a){const c=this._bytePosFor(o,a);if(c>=this._bitArrays.
length)return-1;const l=this._bitArrays[c],u=o-c*r;if(!((l&1<<u)>0))return-1;const d=this._bitArrays.slice(0,c).reduce(e,
0),p=~(4294967295<<u+1),m=t(l&p);return d+m-1}_bytePosFor(o,a){const c=Math.floor(o/r),l=c+1;for(;!a&&this._bitArrays.length<
l;)this._bitArrays.push(0);return c}_setBit(o){const a=this._bytePosFor(o,!1);this._bitArrays[a]|=1<<o-a*r}_unsetBit(o){
const a=this._bytePosFor(o,!1);this._bitArrays[a]&=~(1<<o-a*r)}_setInternalPos(o,a,c,l){const u=this._data,h=[a,c];if(l)
this._sortData(),u[o]=h;else{if(u.length)if(u[u.length-1][0]>=a)u.push(h);else if(u[0][0]<=a)u.unshift(h);else{const d=Math.
round(u.length/2);this._data=u.slice(0,d).concat(h).concat(u.slice(d))}else this._data.push(h);this._changedData=!0,this.
_changedLength=!0}}_unsetInternalPos(o){this._data.splice(o,1)}_sortData(){this._changedData&&this._data.sort(n),this._changedData=
!1}bitField(){const o=[];let a=8,c=0,l=0,u;const h=this._bitArrays.slice();for(;h.length||c;){c===0&&(u=h.shift(),c=7);const p=Math.
min(c,a),m=~(255<<p),y=u&m;l|=y<<8-a,u=u>>>p,c-=p,a-=p,(!a||!c&&!h.length)&&(o.push(l),l=0,a=8)}for(var d=o.length-1;d>0&&
o[d]===0;d--)o.pop();return o}compactArray(){return this._sortData(),this._data.map(s)}};function e(i,o){return i+t(o)}function t(i){
let o=i;return o=o-(o>>1&1431655765),o=(o&858993459)+(o>>2&858993459),(o+(o>>4)&252645135)*16843009>>24}function n(i,o){
return i[0]-o[0]}function s(i){return i[1]}return Mc}var DA=LA();const PA=tb(DA);function ql(r){if(r instanceof Uint8Array&&
r.constructor.name==="Uint8Array")return gf(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(
r))return gf(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function $A(r){
const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}const mf=4096;function NA(r){const e=r.
length;if(e<=mf)return String.fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.
subarray(n,n+=mf));return t}function UA(r){return r?.buffer instanceof ArrayBuffer}function gf(r){return UA(r)?r:r.slice()}
function FA(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)
n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambigu\
ous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}
var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||
(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof
Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===
0;)k++,g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=
256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;
for(var R=h.repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expect\
ed String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.
length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&
C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var OA=FA,zA=OA;let qA=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},jA=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return rb(this,e)}},
GA=class{decoders;constructor(e){this.decoders=e}or(e){return rb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function rb(r,e){return new GA({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let WA=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new qA(e,t,n),this.decoder=new jA(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Na({name:r,prefix:e,encode:t,decode:n}){return new WA(r,e,t,
n)}function Ti({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=zA(t,r,n);return Na({prefix:e,
name:r,encode:s,decode:o=>ql(i(o))})}function VA(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function HA(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function KA(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function je({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=KA(n,s);return Na(
{prefix:e,name:r,encode(o){return HA(o,n,t)},decode(o){return VA(o,i,t,r)}})}const QA=Ti({prefix:"9",name:"base10",alphabet:"\
0123456789"}),JA=Object.freeze(Object.defineProperty({__proto__:null,base10:QA},Symbol.toStringTag,{value:"Module"})),XA=je(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),YA=je({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),ZA=Object.freeze(Object.defineProperty({__proto__:null,
base16:XA,base16upper:YA},Symbol.toStringTag,{value:"Module"})),e8=je({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
t8=Object.freeze(Object.defineProperty({__proto__:null,base2:e8},Symbol.toStringTag,{value:"Module"})),nb=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),r8=nb.reduce((r,e,t)=>(r[t]=e,r),[]),n8=nb.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function s8(r){return r.reduce((e,t)=>(e+=r8[t],e),"")}function i8(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=n8[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const o8=Na({prefix:"🚀",name:"\
base256emoji",encode:s8,decode:i8}),a8=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:o8},Symbol.toStringTag,
{value:"Module"})),c8=je({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
l8=je({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),u8=je(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),d8=je({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),h8=je({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),f8=je({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),p8=je({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),m8=je({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),g8=je({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),b8=Object.freeze(Object.defineProperty({__proto__:null,
base32:c8,base32hex:h8,base32hexpad:p8,base32hexpadupper:m8,base32hexupper:f8,base32pad:u8,base32padupper:d8,base32upper:l8,
base32z:g8},Symbol.toStringTag,{value:"Module"})),y8=Ti({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),w8=Ti({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
k8=Object.freeze(Object.defineProperty({__proto__:null,base36:y8,base36upper:w8},Symbol.toStringTag,{value:"Module"})),E8=Ti(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),x8=Ti({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),v8=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:E8,base58flickr:x8},Symbol.toStringTag,{value:"Module"})),S8=je({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),A8=je({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),_8=je({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),I8=je({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),C8=Object.freeze(Object.defineProperty(
{__proto__:null,base64:S8,base64pad:A8,base64url:_8,base64urlpad:I8},Symbol.toStringTag,{value:"Module"})),T8=je({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),M8=Object.freeze(Object.defineProperty({__proto__:null,base8:T8},Symbol.
toStringTag,{value:"Module"})),R8=Na({prefix:"\0",name:"identity",encode:r=>NA(ql(r)),decode:r=>ql($A(r))}),B8=Object.freeze(
Object.defineProperty({__proto__:null,identity:R8},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const bf={...B8,...t8,...M8,...JA,...ZA,...b8,...k8,...v8,...C8,...a8};function sb(r=0){return new Uint8Array(r)}function ib(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const yf=ib("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Rc=ib("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=sb(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),L8={utf8:yf,"utf-8":yf,hex:bf.base16,latin1:Rc,ascii:Rc,binary:Rc,...bf};function D8(r,e="utf8"){const t=L8[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}class wt{_options;_popCount;_parent;_posAtParent;_children;key;constructor(e,t,n=0){
this._options=e,this._popCount=0,this._parent=t,this._posAtParent=n,this._children=new PA,this.key=null}async put(e,t){const n=await this.
_findNewBucketAndPos(e);n.bucket._putAt(n,e,t)}async get(e){const t=await this._findChild(e);if(t!=null)return t.value}async del(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);n!=null&&n.key===e&&t.bucket._delAt(t.pos)}leafCount(){return this.
_children.compactArray().reduce((t,n)=>n instanceof wt?t+n.leafCount():t+1,0)}childrenCount(){return this._children.length}onlyChild(){
return this._children.get(0)}*eachLeafSeries(){const e=this._children.compactArray();for(const t of e)t instanceof wt?yield*t.
eachLeafSeries():yield t}serialize(e,t){const n=[];return t(this._children.reduce((s,i,o)=>(i!=null&&(i instanceof wt?s.
push(i.serialize(e,t)):s.push(e(i,o))),s),n))}async asyncTransform(e,t){return ob(this,e,t)}toJSON(){return this.serialize(
$8,N8)}prettyPrint(){return JSON.stringify(this.toJSON(),null,"  ")}tableSize(){return Math.pow(2,this._options.bits)}async _findChild(e){
const t=await this._findPlace(e),n=t.bucket._at(t.pos);if(!(n instanceof wt)&&n!=null&&n.key===e)return n}async _findPlace(e){
const t=this._options.hash(typeof e=="string"?D8(e):e),n=await t.take(this._options.bits),s=this._children.get(n);return s instanceof
wt?s._findPlace(t):{bucket:this,pos:n,hash:t,existingChild:s}}async _findNewBucketAndPos(e){const t=await this._findPlace(
e);if(t.existingChild!=null&&t.existingChild.key!==e){const n=new wt(this._options,t.bucket,t.pos);t.bucket._putObjectAt(
t.pos,n);const s=await n._findPlace(t.existingChild.hash);return s.bucket._putAt(s,t.existingChild.key,t.existingChild.value),
n._findNewBucketAndPos(t.hash)}return t}_putAt(e,t,n){this._putObjectAt(e.pos,{key:t,value:n,hash:e.hash})}_putObjectAt(e,t){
this._children.get(e)==null&&this._popCount++,this._children.set(e,t)}_delAt(e){if(e===-1)throw new Error("Invalid posit\
ion");this._children.get(e)!=null&&this._popCount--,this._children.unset(e),this._level()}_level(){if(this._parent!=null&&
this._popCount<=1)if(this._popCount===1){const e=this._children.find(P8);if(e!=null&&!(e instanceof wt)){const t=e.hash;
t.untake(this._options.bits);const n={pos:this._posAtParent,hash:t,bucket:this._parent};this._parent._putAt(n,e.key,e.value)}}else
this._parent._delAt(this._posAtParent)}_at(e){return this._children.get(e)}}function P8(r){return!!r}function $8(r,e){return r.
key}function N8(r){return r}async function ob(r,e,t){const n=[];for(const s of r._children.compactArray())if(s instanceof
wt)await ob(s,e,t);else{const i=await e(s);n.push({bitField:r._children.bitField(),children:i})}return t(n)}function U8(r){
return r?.buffer instanceof ArrayBuffer}function F8(r){if(U8(r))return r;const e=r.slice();return new Uint8Array(e.buffer,
0,e.byteLength)}function O8(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=sb(e);let n=0;for(const s of r)t.set(
s,n),n+=s.length;return F8(t)}const z8=[255,254,252,248,240,224,192,128],q8=[1,3,7,15,31,63,127,255];class j8{_value;_currentBytePos;_currentBitPos;constructor(e){
this._value=e,this._currentBytePos=e.length-1,this._currentBitPos=7}availableBits(){return this._currentBitPos+1+this._currentBytePos*
8}totalBits(){return this._value.length*8}take(e){let t=e,n=0;for(;t>0&&this._haveBits();){const s=this._value[this._currentBytePos],
i=this._currentBitPos+1,o=Math.min(i,t),a=G8(s,i-o,o);n=(n<<o)+a,t-=o,this._currentBitPos-=o,this._currentBitPos<0&&(this.
_currentBitPos=7,this._currentBytePos--)}return n}untake(e){for(this._currentBitPos+=e;this._currentBitPos>7;)this._currentBitPos-=
8,this._currentBytePos+=1}_haveBits(){return this._currentBytePos>=0}}function G8(r,e,t){const n=W8(e,t);return(r&n)>>>e}
function W8(r,e){return z8[r]&q8[Math.min(e+r-1,7)]}function V8(r){function e(t){return t instanceof wf?t:new wf(t,r)}return e}
class wf{_value;_hashFn;_depth;_availableBits;_currentBufferIndex;_buffers;constructor(e,t){if(!(e instanceof Uint8Array))
throw new Error("can only hash Uint8Arrays");this._value=e,this._hashFn=t,this._depth=-1,this._availableBits=0,this._currentBufferIndex=
0,this._buffers=[]}async take(e){let t=e;for(;this._availableBits<t;)await this._produceMoreBits();let n=0;for(;t>0;){const s=this.
_buffers[this._currentBufferIndex],i=Math.min(s.availableBits(),t),o=s.take(i);n=(n<<i)+o,t-=i,this._availableBits-=i,s.
availableBits()===0&&this._currentBufferIndex++}return n}untake(e){let t=e;for(;t>0;){const n=this._buffers[this._currentBufferIndex],
s=Math.min(n.totalBits()-n.availableBits(),t);n.untake(s),t-=s,this._availableBits+=s,this._currentBufferIndex>0&&n.totalBits()===
n.availableBits()&&(this._depth--,this._currentBufferIndex--)}}async _produceMoreBits(){this._depth++;const e=this._depth>
0?O8([this._value,Uint8Array.from([this._depth])]):this._value,t=await this._hashFn(e),n=new j8(t);this._buffers.push(n),
this._availableBits+=n.availableBits()}}function ab(r){if(r==null||r.hashFn==null)throw new Error("please define an opti\
ons.hashFn");const e={bits:r.bits??8,hash:V8(r.hashFn)};return new wt(e)}async function H8(r){return(await eb.encode(r)).
slice(0,8).reverse()}class K8 extends pi{bucket;constructor(e,t){super(e,t),this.bucket=ab({hashFn:H8,bits:t.shardFanoutBits??
Tg})}async put(e,t){this.cid=void 0,this.size=void 0,this.nodeSize=void 0,await this.bucket.put(e,t)}async get(e){return this.
bucket.get(e)}childCount(){return this.bucket.leafCount()}directChildrenCount(){return this.bucket.childrenCount()}onlyChild(){
return this.bucket.onlyChild()}*eachChildSeries(){for(const{key:e,value:t}of this.bucket.eachLeafSeries())yield{key:e,child:t}}async estimateNodeSize(){
if(this.nodeSize!==void 0)return this.nodeSize;const e=new BA,t=await ub(this.bucket,this,e,this.options);return this.nodeSize=
t.size,this.nodeSize}async*flush(e){for await(const t of cb(this.bucket,e,this,this.options))yield{...t,path:this.path}}}
async function*cb(r,e,t,n){const s=r._children,i=(r.tableSize()-1).toString(16).length,o=[];let a=0n;for(let m=0;m<s.length;m++){
const y=s.get(m);if(y==null)continue;const b=m.toString(16).toUpperCase().padStart(i,"0");if(y instanceof wt){let f;for await(const g of cb(
y,e,null,n))f=g;if(f==null)throw new Error("Could not flush sharded directory, no sub-shard found");o.push({Name:b,Tsize:Number(
f.size),Hash:f.cid}),a+=f.size}else if(lb(y.value)){const f=y.value;let g;for await(const k of f.flush(e))g=k,yield g;if(g==
null)throw new Error("Did not flush dir");const w=b+y.key;o.push({Name:w,Tsize:Number(g.size),Hash:g.cid}),a+=g.size}else{
const f=y.value;if(f.cid==null)continue;const g=b+y.key,w=f.size;o.push({Name:g,Tsize:Number(w),Hash:f.cid}),a+=BigInt(w??
0)}}const c=Uint8Array.from(s.bitField().reverse()),l=new dt({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),
hashType:Cg,mtime:t?.mtime,mode:t?.mode}),u={Data:l.marshal(),Links:o},h=er(Zt(u),n),d=await en(h,e,n),p=BigInt(h.byteLength)+
a;yield{cid:d,unixfs:l,size:p}}function lb(r){return typeof r.flush=="function"}async function ub(r,e,t,n){const s=r._children,
i=(r.tableSize()-1).toString(16).length,o=[];let a=0;for(let d=0;d<s.length;d++){const p=s.get(d);if(p==null)continue;const m=d.
toString(16).toUpperCase().padStart(i,"0");if(p instanceof wt){const{size:y,cid:b}=await ub(p,null,t,n);o.push({Name:m,Tsize:Number(
y),Hash:b}),a+=m.length+b.byteLength}else if(lb(p.value)){const y=p.value,b=y.nodeSize;if(y.cid==null)throw new Error("C\
hild directory has not been persisted");o.push({Name:m+p.key,Tsize:Number(b),Hash:y.cid}),a+=m.length+y.cid.byteLength}else{
const y=p.value,b=m+p.key,f=y.size;o.push({Name:b,Tsize:Number(f),Hash:y.cid}),a+=m.length+y.cid.byteLength}}const c=Uint8Array.
from(s.bitField().reverse()),l=new dt({type:"hamt-sharded-directory",data:c,fanout:BigInt(r.tableSize()),hashType:Cg,mtime:e?.
mtime,mode:e?.mode}),u=er(Zt({Data:l.marshal(),Links:o}),n);return{cid:await en(u,t,n),size:n.shardSplitStrategy==="link\
s-bytes"?a:u.length}}async function db(r,e){let t=e;const n=e.options.shardSplitThresholdBytes??Mg;e instanceof Yu&&await e.
estimateNodeSize()>n&&(t=await Q8(e));const s=t.parent;if(s!=null){if(t!==e){if(r!=null&&(r.parent=t),t.parentKey==null)
throw new Error("No parent key found");await s.put(t.parentKey,t)}return db(t,s)}return t}async function Q8(r){const e=new K8(
{root:r.root,dir:!0,parent:r.parent,parentKey:r.parentKey,path:r.path,dirty:r.dirty,flat:!1,mtime:r.mtime,mode:r.mode},r.
options);for(const{key:t,child:n}of r.eachChildSeries())await e.put(t,n);return e}const J8=(r="")=>r.split(/(?<!\\)\//).
filter(Boolean);async function X8(r,e,t){const n=J8(r.path??""),s=n.length-1;let i=e,o="";for(let a=0;a<n.length;a++){const c=n[a];
o+=`${o!==""?"/":""}${c}`;const l=a===s;if(i.dirty=!0,i.cid=void 0,i.size=void 0,l)await i.put(c,r),e=await db(null,i);else{
let u=await i.get(c);(u==null||!(u instanceof pi))&&(u=new Yu({root:!1,dir:!0,parent:i,parentKey:c,path:o,dirty:!0,flat:!0,
mtime:u?.unixfs?.mtime,mode:u?.unixfs?.mode},t)),await i.put(c,u),i=u}}return e}async function*kf(r,e){if(!(r instanceof
pi)){r.unixfs?.isDirectory()===!0&&(yield r);return}yield*r.flush(e)}function Y8(r){return async function*(t,n){let s=new Yu(
{root:!0,dir:!0,path:"",dirty:!0,flat:!0},r),i,o=!1;for await(const a of t){if(a==null)continue;const c=`${a.originalPath??
""}`.split("/")[0];c!=null&&c!==""&&(i==null?(i=c,o=!0):i!==c&&(o=!1)),s=await X8(a,s,r),a.unixfs?.isDirectory()!==!0&&(yield a)}
if(r.wrapWithDirectory||o&&s.childCount()>1)yield*kf(s,n);else for(const a of s.eachChildSeries())a!=null&&(yield*kf(a.child,
n))}}async function*Z8(r,e,t={}){let n;Symbol.asyncIterator in r||Symbol.iterator in r?n=r:n=[r];let s,i;t.profile==="un\
ixfs-v0-2015"?(t.shardSplitStrategy=t.shardSplitStrategy??"links-bytes",t.cidVersion=t.cidVersion??0,t.rawLeaves=t.rawLeaves??
!1,s=Rg,i=174,t.fieldOrder="links-first"):t.profile==="unixfs-v1-2025"&&(t.shardSplitStrategy=t.shardSplitStrategy??"blo\
ck-bytes",t.cidVersion=t.cidVersion??1,t.rawLeaves=t.rawLeaves??!0,s=Rx,i=1024,t.fieldOrder="links-first");const o=t.wrapWithDirectory??
$x,a=t.shardSplitThresholdBytes??Mg,c=t.shardSplitStrategy??Mx,l=t.shardFanoutBits??Tg,u=t.cidVersion??Ig,h=t.rawLeaves??
Px,d=t.leafType??Nx,p=t.fileImportConcurrency??Bx,m=t.blockWriteConcurrency??Lx,y=t.reduceSingleLeafToSelf??Dx,b=t.fieldOrder??
Ux,f=t.chunker??Bg({chunkSize:s}),g=t.chunkValidator??eA(),w=t.dagBuilder??X2({chunker:f,chunkValidator:g,wrapWithDirectory:o,
layout:t.layout??Xg({maxChildrenPerNode:i}),bufferImporter:t.bufferImporter??b2({cidVersion:u,rawLeaves:h,leafType:d,onProgress:t.
onProgress}),blockWriteConcurrency:m,reduceSingleLeafToSelf:y,cidVersion:u,onProgress:t.onProgress,dirBuilder:t.dirBuilder,
fileBuilder:t.fileBuilder,fieldOrder:b}),k=t.treeBuilder??Y8({wrapWithDirectory:o,shardSplitThresholdBytes:a,shardSplitStrategy:c,
shardFanoutBits:l,cidVersion:u,onProgress:t.onProgress,fieldOrder:b});for await(const x of k(Ag(w(n,e),p),e))yield{cid:x.
cid,path:x.path,unixfs:x.unixfs,size:x.size}}async function e_(r,e,t={}){const n=await Ax(Z8([r],e,t));if(n==null)throw new y2(
"Nothing imported");return n}async function t_(r,e,t={}){return e_({content:r},e,t)}function r_(r,e){if(r===e)return!0;if(r.
byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function Zu(r){if(r instanceof
Uint8Array&&r.constructor.name==="Uint8Array")return mi(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.
isView(r))return mi(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary ty\
pe")}function n_(r){return r?.buffer instanceof ArrayBuffer}function mi(r){return n_(r)?r:r.slice()}function s_(r,e,t){if(r.
length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<
r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.
toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),
d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?
f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))
throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,
g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>
0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;for(var R=h.
repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expected String");
if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.length-g)*d+
1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&C!==-1;C--,E++)
v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){for(var I=x-k;I!==
x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(f);if(g)return g;
throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var i_=s_,o_=i_;let a_=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},c_=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return hb(this,e)}},
l_=class{decoders;constructor(e){this.decoders=e}or(e){return hb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function hb(r,e){return new l_({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let u_=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new a_(e,t,n),this.decoder=new c_(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function fb({name:r,prefix:e,encode:t,decode:n}){return new u_(r,e,t,
n)}function Ua({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=o_(t,r,n);return fb({prefix:e,
name:r,encode:s,decode:o=>Zu(i(o))})}function d_(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function h_(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function f_(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function vr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=f_(n,s);return fb(
{prefix:e,name:r,encode(o){return h_(o,n,t)},decode(o){return d_(o,i,t,r)}})}const mo=vr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});vr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});vr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});vr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Bc=Ua(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Ua({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const jr=Ua({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Ua({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var p_=pb,Ef=128,m_=-128,g_=Math.pow(2,31);function pb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=g_;)e[t++]=r&255|Ef,r/=128;for(;r&m_;)e[t++]=r&255|Ef,r>>>=7;return e[t]=r|0,pb.bytes=t-n+1,e}var b_=jl,
y_=128,xf=127;function jl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw jl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&xf)<<s:(o&xf)*Math.pow(2,s),s+=7}while(o>=y_);return jl.bytes=i-n,t}var w_=Math.pow(
2,7),k_=Math.pow(2,14),E_=Math.pow(2,21),x_=Math.pow(2,28),v_=Math.pow(2,35),S_=Math.pow(2,42),A_=Math.pow(2,49),__=Math.
pow(2,56),I_=Math.pow(2,63),C_=function(r){return r<w_?1:r<k_?2:r<E_?3:r<x_?4:r<v_?5:r<S_?6:r<A_?7:r<__?8:r<I_?9:10},T_={
encode:p_,decode:b_,encodingLength:C_},Jo=T_;function Gl(r,e=0){const t=Jo.decode(r,e),n=Jo.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function Xo(r,e,t=0){return Jo.encode(r,e,t),e}function Yo(r){return Jo.encodingLength(r)}function M_(r,e){const t=e.
byteLength,n=Yo(r),s=n+Yo(t),i=new Uint8Array(s+t);return Xo(r,i,0),Xo(t,i,n),i.set(e,s),new ed(r,t,e,i)}function mb(r){
const e=Zu(r),[t,n]=Gl(e),[s,i]=Gl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new ed(t,s,o,e)}function R_(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&r_(r.bytes,t.bytes)}}let ed=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
mi(n),this.bytes=mi(s)}};function vf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return L_(t,Wl(r),e??jr.encoder);default:
return D_(t,Wl(r),e??mo.encoder)}}const Sf=new WeakMap;function Wl(r){const e=Sf.get(r);if(e==null){const t=new Map;return Sf.
set(r,t),t}return e}let pn=class Je{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=mi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
vs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==P_)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Je.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=M_(e,
t);return Je.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Je.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&R_(e.multihash,n.multihash)}toString(e){return vf(this,e)}toJSON(){return{"/":vf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Je)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Je(n,s,i,o??Af(n,s,i.bytes))}else if(t[$_]===!0){const{version:n,
multihash:s,code:i}=t,o=mb(s);return Je.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==vs)throw new Error(`Version 0 CID must use dag-pb (code: ${vs}) block encoding`);return new Je(e,t,n,n.bytes)}case 1:{
const s=Af(e,t,n.bytes);return new Je(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Je.
create(0,vs,e)}static createV1(e,t){return Je.create(1,e,t)}static decode(e){const[t,n]=Je.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Je.inspectBytes(e),n=t.size-t.multihashSize,
s=Zu(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new ed(t.multihashCode,t.digestSize,i,s);return[t.version===0?Je.createV0(o):Je.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Gl(e.subarray(t));return t+=d,h};let s=n(),
i=vs;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=B_(e,t),
i=Je.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Wl(
i).set(n,e),i}};function B_(r,e){switch(r[0]){case"Q":{const t=e??jr;return[jr.prefix,t.decode(`${jr.prefix}${r}`)]}case jr.
prefix:{const t=e??jr;return[jr.prefix,t.decode(r)]}case mo.prefix:{const t=e??mo;return[mo.prefix,t.decode(r)]}case Bc.
prefix:{const t=e??Bc;return[Bc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function L_(r,e,t){const{prefix:n}=t;if(n!==
jr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function D_(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const vs=112,P_=18;function Af(r,e,t){const n=Yo(r),s=n+Yo(e),i=new Uint8Array(s+t.
byteLength);return Xo(r,i,0),Xo(e,i,n),i.set(t,s),i}const $_=Symbol.for("@ipld/js-cid/CID");class gi extends Error{static name="\
BadPathError";static code="ERR_BAD_PATH";name=gi.name;code=gi.code;constructor(e="Bad path"){super(e)}}let kn=class Vl extends Error{static name="\
NotFoundError";static code="ERR_NOT_FOUND";name=Vl.name;code=Vl.code;constructor(e="Not found"){super(e)}};class bi extends Error{static name="\
NoResolverError";static code="ERR_NO_RESOLVER";name=bi.name;code=bi.code;constructor(e="No resolver"){super(e)}}class Pe extends Error{static name="\
NotUnixFSError";static code="ERR_NOT_UNIXFS";name=Pe.name;code=Pe.code;constructor(e="Not UnixFS"){super(e)}}class Zo extends Error{static name="\
OverReadError";static code="ERR_OVER_READ";name=Zo.name;code=Zo.code;constructor(e="Over read"){super(e)}}class ea extends Error{static name="\
UnderReadError";static code="ERR_UNDER_READ";name=ea.name;code=ea.code;constructor(e="Under read"){super(e)}}let zs=class Hl extends Error{static name="\
InvalidParametersError";static code="ERR_INVALID_PARAMS";name=Hl.name;code=Hl.code;constructor(e="Invalid parameters"){super(
e)}};const N_=["Object","Uint8Array","RegExp","Date","Error","Map","Set","WeakMap","WeakSet","ArrayBuffer","SharedArrayB\
uffer","DataView","Promise","URL","HTMLElement","Int8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array",
"Uint32Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Tagged"];function gb(r){if(r===null)return"\
null";if(r===void 0)return"undefined";if(r===!0||r===!1)return"boolean";const e=typeof r;if(e==="string"||e==="number"||
e==="bigint"||e==="symbol")return e;if(e==="function")return"Function";if(Array.isArray(r))return"Array";if(r instanceof
Uint8Array)return"Uint8Array";if(r.constructor===Object)return"Object";const t=U_(r);return t||"Object"}function U_(r){const e=Object.
prototype.toString.call(r).slice(8,-1);if(N_.includes(e))return e}class S{constructor(e,t,n){this.major=e,this.majorEncoded=
e<<5,this.name=t,this.terminal=n}toString(){return`Type[${this.major}].${this.name}`}compare(e){return this.major<e.major?
-1:this.major>e.major?1:0}static equals(e,t){return e===t||e.major===t.major&&e.name===t.name}}S.uint=new S(0,"uint",!0);
S.negint=new S(1,"negint",!0);S.bytes=new S(2,"bytes",!0);S.string=new S(3,"string",!0);S.array=new S(4,"array",!1);S.map=
new S(5,"map",!1);S.tag=new S(6,"tag",!1);S.float=new S(7,"float",!0);S.false=new S(7,"false",!0);S.true=new S(7,"true",
!0);S.null=new S(7,"null",!0);S.undefined=new S(7,"undefined",!0);S.break=new S(7,"break",!0);class j{constructor(e,t,n){
this.type=e,this.value=t,this.encodedLength=n,this.encodedBytes=void 0,this.byteValue=void 0}toString(){return`Token[${this.
type}].${this.value}`}}const Mi=globalThis.process&&!globalThis.process.browser&&globalThis.Buffer&&typeof globalThis.Buffer.
isBuffer=="function",F_=new TextEncoder;function ta(r){return Mi&&globalThis.Buffer.isBuffer(r)}function Fa(r){return r instanceof
Uint8Array?ta(r)?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):r:Uint8Array.from(r)}const O_=24,z_=200,td=Mi?r=>r.length>=
O_?globalThis.Buffer.from(r):If(r):r=>r.length>=z_?F_.encode(r):If(r),cr=r=>Uint8Array.from(r),q_=Mi?(r,e,t)=>ta(r)?new Uint8Array(
r.subarray(e,t)):r.slice(e,t):(r,e,t)=>r.slice(e,t),j_=Mi?(r,e)=>(r=r.map(t=>t instanceof Uint8Array?t:globalThis.Buffer.
from(t)),Fa(globalThis.Buffer.concat(r,e))):(r,e)=>{const t=new Uint8Array(e);let n=0;for(let s of r)n+s.length>t.length&&
(s=s.subarray(0,t.length-n)),t.set(s,n),n+=s.length;return t},_f=Mi?r=>globalThis.Buffer.allocUnsafe(r):r=>new Uint8Array(
r);function bb(r,e){if(ta(r)&&ta(e))return r.compare(e);for(let t=0;t<r.length;t++)if(r[t]!==e[t])return r[t]<e[t]?-1:1;
return 0}function If(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=
s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.
charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(s>=55296&&s<=57343&&(s=65533),
e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e}const Cf=4096;function G_(r){const e=r.length;if(e<=Cf)return String.
fromCharCode.apply(String,r);let t="",n=0;for(;n<e;)t+=String.fromCharCode.apply(String,r.slice(n,n+=Cf));return t}const W_=256;
class ra{constructor(e=W_){this.chunkSize=e,this.cursor=0,this.maxCursor=-1,this.chunks=[],this._initReuseChunk=null}reset(){
this.cursor=0,this.maxCursor=-1,this.chunks.length&&(this.chunks=[]),this._initReuseChunk!==null&&(this.chunks.push(this.
_initReuseChunk),this.maxCursor=this._initReuseChunk.length-1)}pushByte(e){let t=this.chunks[this.chunks.length-1];this.
cursor>this.maxCursor&&(t=_f(this.chunkSize),this.chunks.push(t),this.maxCursor+=t.length,this._initReuseChunk===null&&(this.
_initReuseChunk=t));const n=t.length-(this.maxCursor-this.cursor)-1;t[n]=e,this.cursor++}push(e){let t=this.chunks[this.
chunks.length-1];if(this.cursor+e.length<=this.maxCursor+1){const s=t.length-(this.maxCursor-this.cursor)-1;t.set(e,s)}else{
if(t){const s=t.length-(this.maxCursor-this.cursor)-1;s<t.length&&(this.chunks[this.chunks.length-1]=t.subarray(0,s),this.
maxCursor=this.cursor-1)}e.length<64&&e.length<this.chunkSize?(t=_f(this.chunkSize),this.chunks.push(t),this.maxCursor+=
t.length,this._initReuseChunk===null&&(this._initReuseChunk=t),t.set(e,0)):(this.chunks.push(e),this.maxCursor+=e.length)}
this.cursor+=e.length}toBytes(e=!1){let t;if(this.chunks.length===1){const n=this.chunks[0];e&&this.cursor>n.length/2?(t=
this.cursor===n.length?n:n.subarray(0,this.cursor),this._initReuseChunk=null,this.chunks=[]):t=q_(n,0,this.cursor)}else t=
j_(this.chunks,this.cursor);return e&&this.reset(),t}}class V_{constructor(e){this.dest=e,this.cursor=0,this.chunks=[e]}reset(){
this.cursor=0}pushByte(e){if(this.cursor>=this.dest.length)throw new Error("write out of bounds, destination buffer is t\
oo small");this.dest[this.cursor++]=e}push(e){if(this.cursor+e.length>this.dest.length)throw new Error("write out of bou\
nds, destination buffer is too small");this.dest.set(e,this.cursor),this.cursor+=e.length}toBytes(e=!1){const t=this.dest.
subarray(0,this.cursor);return e&&this.reset(),t}}const G="CBOR decode error:",qn="CBOR encode error:";function ds(r,e,t){
if(r.length-e<t)throw new Error(`${G} not enough data for type`)}const Fe=[24,256,65536,4294967296,BigInt("1844674407370\
9551616")];function En(r,e,t){ds(r,e,1);const n=r[e];if(t.strict===!0&&n<Fe[0])throw new Error(`${G} integer encoded in \
more bytes than necessary (strict decode)`);return n}function xn(r,e,t){ds(r,e,2);const n=r[e]<<8|r[e+1];if(t.strict===!0&&
n<Fe[1])throw new Error(`${G} integer encoded in more bytes than necessary (strict decode)`);return n}function vn(r,e,t){
ds(r,e,4);const n=r[e]*16777216+(r[e+1]<<16)+(r[e+2]<<8)+r[e+3];if(t.strict===!0&&n<Fe[2])throw new Error(`${G} integer \
encoded in more bytes than necessary (strict decode)`);return n}function Sn(r,e,t){ds(r,e,8);const n=r[e]*16777216+(r[e+
1]<<16)+(r[e+2]<<8)+r[e+3],s=r[e+4]*16777216+(r[e+5]<<16)+(r[e+6]<<8)+r[e+7],i=(BigInt(n)<<BigInt(32))+BigInt(s);if(t.strict===
!0&&i<Fe[3])throw new Error(`${G} integer encoded in more bytes than necessary (strict decode)`);if(i<=Number.MAX_SAFE_INTEGER)
return Number(i);if(t.allowBigInt===!0)return i;throw new Error(`${G} integers outside of the safe integer range are not\
 supported`)}function H_(r,e,t,n){return new j(S.uint,En(r,e+1,n),2)}function K_(r,e,t,n){return new j(S.uint,xn(r,e+1,n),
3)}function Q_(r,e,t,n){return new j(S.uint,vn(r,e+1,n),5)}function J_(r,e,t,n){return new j(S.uint,Sn(r,e+1,n),9)}function hs(r,e){
return vt(r,0,e.value)}function vt(r,e,t){if(t<Fe[0]){const n=Number(t);r.pushByte(e|n)}else if(t<Fe[1]){const n=Number(
t);r.push([e|24,n])}else if(t<Fe[2]){const n=Number(t);r.push([e|25,n>>>8,n&255])}else if(t<Fe[3]){const n=Number(t);r.push(
[e|26,n>>>24&255,n>>>16&255,n>>>8&255,n&255])}else{const n=BigInt(t);if(n<Fe[4]){const s=[e|27,0,0,0,0,0,0,0];let i=Number(
n&BigInt(4294967295)),o=Number(n>>BigInt(32)&BigInt(4294967295));s[8]=i&255,i=i>>8,s[7]=i&255,i=i>>8,s[6]=i&255,i=i>>8,s[5]=
i&255,s[4]=o&255,o=o>>8,s[3]=o&255,o=o>>8,s[2]=o&255,o=o>>8,s[1]=o&255,r.push(s)}else throw new Error(`${G} encountered \
BigInt larger than allowable range`)}}hs.encodedSize=function(e){return vt.encodedSize(e.value)};vt.encodedSize=function(e){
return e<Fe[0]?1:e<Fe[1]?2:e<Fe[2]?3:e<Fe[3]?5:9};hs.compareTokens=function(e,t){return e.value<t.value?-1:e.value>t.value?
1:0};function X_(r,e,t,n){return new j(S.negint,-1-En(r,e+1,n),2)}function Y_(r,e,t,n){return new j(S.negint,-1-xn(r,e+1,
n),3)}function Z_(r,e,t,n){return new j(S.negint,-1-vn(r,e+1,n),5)}const rd=BigInt(-1),yb=BigInt(1);function e6(r,e,t,n){
const s=Sn(r,e+1,n);if(typeof s!="bigint"){const i=-1-s;if(i>=Number.MIN_SAFE_INTEGER)return new j(S.negint,i,9)}if(n.allowBigInt!==
!0)throw new Error(`${G} integers outside of the safe integer range are not supported`);return new j(S.negint,rd-BigInt(
s),9)}function nd(r,e){const t=e.value,n=typeof t=="bigint"?t*rd-yb:t*-1-1;vt(r,e.type.majorEncoded,n)}nd.encodedSize=function(e){
const t=e.value,n=typeof t=="bigint"?t*rd-yb:t*-1-1;return n<Fe[0]?1:n<Fe[1]?2:n<Fe[2]?3:n<Fe[3]?5:9};nd.compareTokens=function(e,t){
return e.value<t.value?1:e.value>t.value?-1:0};function Ri(r,e,t,n){ds(r,e,t+n);const s=r.slice(e+t,e+t+n);return new j(
S.bytes,s,t+n)}function t6(r,e,t,n){return Ri(r,e,1,t)}function r6(r,e,t,n){return Ri(r,e,2,En(r,e+1,n))}function n6(r,e,t,n){
return Ri(r,e,3,xn(r,e+1,n))}function s6(r,e,t,n){return Ri(r,e,5,vn(r,e+1,n))}function i6(r,e,t,n){const s=Sn(r,e+1,n);
if(typeof s=="bigint")throw new Error(`${G} 64-bit integer bytes lengths not supported`);return Ri(r,e,9,s)}function na(r){
return r.encodedBytes===void 0&&(r.encodedBytes=S.equals(r.type,S.string)?td(r.value):r.value),r.encodedBytes}function Oa(r,e){
const t=na(e);vt(r,e.type.majorEncoded,t.length),r.push(t)}Oa.encodedSize=function(e){const t=na(e);return vt.encodedSize(
t.length)+t.length};Oa.compareTokens=function(e,t){return o6(na(e),na(t))};function o6(r,e){return r.length<e.length?-1:
r.length>e.length?1:bb(r,e)}const Tf=new TextDecoder("utf-8",{ignoreBOM:!0}),a6=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}),
c6=32;function l6(r,e,t,n){if(t-e<c6){let i="";for(let o=e;o<t;o++){const a=r[o];if(a&128)return n.strictUtf8===!0?Mf(r,
e,t):Tf.decode(r.subarray(e,t));i+=String.fromCharCode(a)}return i}return n.strictUtf8===!0?Mf(r,e,t):Tf.decode(r.subarray(
e,t))}function Mf(r,e,t){try{return a6.decode(r.subarray(e,t))}catch{throw new Error(`${G} invalid UTF-8 in text string`)}}
function Bi(r,e,t,n,s){const i=t+n;ds(r,e,i);const o=new j(S.string,l6(r,e+t,e+i,s),i);return s.retainStringBytes===!0&&
(o.byteValue=r.slice(e+t,e+i)),o}function u6(r,e,t,n){return Bi(r,e,1,t,n)}function d6(r,e,t,n){return Bi(r,e,2,En(r,e+1,
n),n)}function h6(r,e,t,n){return Bi(r,e,3,xn(r,e+1,n),n)}function f6(r,e,t,n){return Bi(r,e,5,vn(r,e+1,n),n)}function p6(r,e,t,n){
const s=Sn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit integer string lengths not supported`);return Bi(
r,e,9,s,n)}const m6=Oa;function fs(r,e,t,n){return new j(S.array,n,t)}function g6(r,e,t,n){return fs(r,e,1,t)}function b6(r,e,t,n){
return fs(r,e,2,En(r,e+1,n))}function y6(r,e,t,n){return fs(r,e,3,xn(r,e+1,n))}function w6(r,e,t,n){return fs(r,e,5,vn(r,
e+1,n))}function k6(r,e,t,n){const s=Sn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit integer array length\
s not supported`);return fs(r,e,9,s)}function E6(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${G} indefinite len\
gth items not allowed`);return fs(r,e,1,1/0)}function sd(r,e){vt(r,S.array.majorEncoded,e.value)}sd.compareTokens=hs.compareTokens;
sd.encodedSize=function(e){return vt.encodedSize(e.value)};function ps(r,e,t,n){return new j(S.map,n,t)}function x6(r,e,t,n){
return ps(r,e,1,t)}function v6(r,e,t,n){return ps(r,e,2,En(r,e+1,n))}function S6(r,e,t,n){return ps(r,e,3,xn(r,e+1,n))}function A6(r,e,t,n){
return ps(r,e,5,vn(r,e+1,n))}function _6(r,e,t,n){const s=Sn(r,e+1,n);if(typeof s=="bigint")throw new Error(`${G} 64-bit\
 integer map lengths not supported`);return ps(r,e,9,s)}function I6(r,e,t,n){if(n.allowIndefinite===!1)throw new Error(`${G}\
 indefinite length items not allowed`);return ps(r,e,1,1/0)}function id(r,e){vt(r,S.map.majorEncoded,e.value)}id.compareTokens=
hs.compareTokens;id.encodedSize=function(e){return vt.encodedSize(e.value)};function C6(r,e,t,n){return new j(S.tag,t,1)}
function T6(r,e,t,n){return new j(S.tag,En(r,e+1,n),2)}function M6(r,e,t,n){return new j(S.tag,xn(r,e+1,n),3)}function R6(r,e,t,n){
return new j(S.tag,vn(r,e+1,n),5)}function B6(r,e,t,n){return new j(S.tag,Sn(r,e+1,n),9)}function od(r,e){vt(r,S.tag.majorEncoded,
e.value)}od.compareTokens=hs.compareTokens;od.encodedSize=function(e){return vt.encodedSize(e.value)};const ad=20,cd=21,
ld=22,ud=23;function L6(r,e,t,n){if(n.allowUndefined===!1)throw new Error(`${G} undefined values are not supported`);return n.
coerceUndefinedToNull===!0?new j(S.null,null,1):new j(S.undefined,void 0,1)}function D6(r,e,t,n){if(n.allowIndefinite===
!1)throw new Error(`${G} indefinite length items not allowed`);return new j(S.break,void 0,1)}function dd(r,e,t){if(t){if(t.
allowNaN===!1&&Number.isNaN(r))throw new Error(`${G} NaN values are not supported`);if(t.allowInfinity===!1&&(r===1/0||r===
-1/0))throw new Error(`${G} Infinity values are not supported`)}return new j(S.float,r,e)}function P6(r,e,t,n){return dd(
qa(r,e+1),3,n)}function $6(r,e,t,n){return dd(ja(r,e+1),5,n)}function N6(r,e,t,n){return dd(Eb(r,e+1),9,n)}function za(r,e,t){
const n=e.value;if(n===!1)r.pushByte(S.float.majorEncoded|ad);else if(n===!0)r.pushByte(S.float.majorEncoded|cd);else if(n===
null)r.pushByte(S.float.majorEncoded|ld);else if(n===void 0)r.pushByte(S.float.majorEncoded|ud);else{let s,i=!1;(!t||t.float64!==
!0)&&(hd(n),s=qa(Ie,1),n===s||Number.isNaN(n)?(Ie[0]=249,r.push(Ie.slice(0,3)),i=!0):(fd(n),s=ja(Ie,1),n===s&&(Ie[0]=250,
r.push(Ie.slice(0,5)),i=!0))),i||(kb(n),s=Eb(Ie,1),Ie[0]=251,r.push(Ie.slice(0,9)))}}za.encodedSize=function(e,t){const n=e.
value;if(n===!1||n===!0||n===null||n===void 0)return 1;if(!t||t.float64!==!0){hd(n);let s=qa(Ie,1);if(n===s||Number.isNaN(
n))return 3;if(fd(n),s=ja(Ie,1),n===s)return 5}return 9};const wb=new ArrayBuffer(9),Mt=new DataView(wb,1),Ie=new Uint8Array(
wb,0);function hd(r){if(r===1/0)Mt.setUint16(0,31744,!1);else if(r===-1/0)Mt.setUint16(0,64512,!1);else if(Number.isNaN(
r))Mt.setUint16(0,32256,!1);else{Mt.setFloat32(0,r);const e=Mt.getUint32(0),t=(e&2139095040)>>23,n=e&8388607;if(t===255)
Mt.setUint16(0,31744,!1);else if(t===0)Mt.setUint16(0,(e&2147483648)>>16|n>>13,!1);else{const s=t-127;s<-24?Mt.setUint16(
0,0):s<-14?Mt.setUint16(0,(e&2147483648)>>16|1<<24+s,!1):Mt.setUint16(0,(e&2147483648)>>16|s+15<<10|n>>13,!1)}}}function qa(r,e){
if(r.length-e<2)throw new Error(`${G} not enough data for float16`);const t=(r[e]<<8)+r[e+1];if(t===31744)return 1/0;if(t===
64512)return-1/0;if(t===32256)return NaN;const n=t>>10&31,s=t&1023;let i;return n===0?i=s*2**-24:n!==31?i=(s+1024)*2**(n-
25):i=s===0?1/0:NaN,t&32768?-i:i}function fd(r){Mt.setFloat32(0,r,!1)}function ja(r,e){if(r.length-e<4)throw new Error(`${G}\
 not enough data for float32`);const t=(r.byteOffset||0)+e;return new DataView(r.buffer,t,4).getFloat32(0,!1)}function kb(r){
Mt.setFloat64(0,r,!1)}function Eb(r,e){if(r.length-e<8)throw new Error(`${G} not enough data for float64`);const t=(r.byteOffset||
0)+e;return new DataView(r.buffer,t,8).getFloat64(0,!1)}function U6(r,e){const t=r.value;if(t===!1)return Uint8Array.of(
S.float.majorEncoded|ad);if(t===!0)return Uint8Array.of(S.float.majorEncoded|cd);if(t===null)return Uint8Array.of(S.float.
majorEncoded|ld);if(t===void 0)return Uint8Array.of(S.float.majorEncoded|ud);if(!e){if(hd(t),t===qa(Ie,1)||Number.isNaN(
t))return Ie[0]=249,Ie.slice(0,3);if(fd(t),t===ja(Ie,1))return Ie[0]=250,Ie.slice(0,5)}return kb(t),Ie[0]=251,Ie.slice(0,
9)}function Rf(r,e){const t=r,n=e?.float64===!0,s=n?t._keyBytesFloat64:t._keyBytes;if(s!==void 0)return s;const i=U6(r,n);
return n?t._keyBytesFloat64=i:t._keyBytes=i,i}za.compareTokens=function(e,t,n){const s=Rf(e,n),i=Rf(t,n);return s.length!==
i.length?s.length<i.length?-1:1:bb(s,i)};function ae(r,e,t){throw new Error(`${G} encountered invalid minor (${t}) for m\
ajor ${r[e]>>>5}`)}function Ga(r){return()=>{throw new Error(`${G} ${r}`)}}const z=[];for(let r=0;r<=23;r++)z[r]=ae;z[24]=
H_;z[25]=K_;z[26]=Q_;z[27]=J_;z[28]=ae;z[29]=ae;z[30]=ae;z[31]=ae;for(let r=32;r<=55;r++)z[r]=ae;z[56]=X_;z[57]=Y_;z[58]=
Z_;z[59]=e6;z[60]=ae;z[61]=ae;z[62]=ae;z[63]=ae;for(let r=64;r<=87;r++)z[r]=t6;z[88]=r6;z[89]=n6;z[90]=s6;z[91]=i6;z[92]=
ae;z[93]=ae;z[94]=ae;z[95]=Ga("indefinite length bytes/strings are not supported");for(let r=96;r<=119;r++)z[r]=u6;z[120]=
d6;z[121]=h6;z[122]=f6;z[123]=p6;z[124]=ae;z[125]=ae;z[126]=ae;z[127]=Ga("indefinite length bytes/strings are not suppor\
ted");for(let r=128;r<=151;r++)z[r]=g6;z[152]=b6;z[153]=y6;z[154]=w6;z[155]=k6;z[156]=ae;z[157]=ae;z[158]=ae;z[159]=E6;for(let r=160;r<=
183;r++)z[r]=x6;z[184]=v6;z[185]=S6;z[186]=A6;z[187]=_6;z[188]=ae;z[189]=ae;z[190]=ae;z[191]=I6;for(let r=192;r<=215;r++)
z[r]=C6;z[216]=T6;z[217]=M6;z[218]=R6;z[219]=B6;z[220]=ae;z[221]=ae;z[222]=ae;z[223]=ae;for(let r=224;r<=243;r++)z[r]=Ga(
"simple values are not supported");z[244]=ae;z[245]=ae;z[246]=ae;z[247]=L6;z[248]=Ga("simple values are not supported");
z[249]=P6;z[250]=$6;z[251]=N6;z[252]=ae;z[253]=ae;z[254]=ae;z[255]=D6;const nr=[];for(let r=0;r<24;r++)nr[r]=new j(S.uint,
r,1);for(let r=-1;r>=-24;r--)nr[31-r]=new j(S.negint,r,1);nr[64]=new j(S.bytes,new Uint8Array(0),1);nr[96]=new j(S.string,
"",1);nr[128]=new j(S.array,0,1);nr[160]=new j(S.map,0,1);nr[244]=new j(S.false,!1,1);nr[245]=new j(S.true,!0,1);nr[246]=
new j(S.null,null,1);function F6(r){switch(r.type){case S.false:return cr([244]);case S.true:return cr([245]);case S.null:
return cr([246]);case S.bytes:return r.value.length?void 0:cr([64]);case S.string:return r.value===""?cr([96]):void 0;case S.
array:return r.value===0?cr([128]):void 0;case S.map:return r.value===0?cr([160]):void 0;case S.uint:return r.value<24?cr(
[Number(r.value)]):void 0;case S.negint:if(r.value>=-24)return cr([31-Number(r.value)])}}const O6={float64:!1,mapSorter:pd,
quickEncodeToken:F6};function z6(){const r=[];return r[S.uint.major]=hs,r[S.negint.major]=nd,r[S.bytes.major]=Oa,r[S.string.
major]=m6,r[S.array.major]=sd,r[S.map.major]=id,r[S.tag.major]=od,r[S.float.major]=za,r}const jn=z6(),go=new ra;let bo=!1;
class ts{constructor(e,t){this.obj=e,this.parent=t}includes(e){let t=this;do if(t.obj===e)return!0;while(t=t.parent);return!1}static createCheck(e,t){
if(e&&e.includes(t))throw new Error(`${qn} object contains circular references`);return new ts(t,e)}}const Br={null:new j(
S.null,null),undefined:new j(S.undefined,void 0),true:new j(S.true,!0),false:new j(S.false,!1),emptyArray:new j(S.array,
0),emptyMap:new j(S.map,0)},rr={number(r,e,t,n){return!Number.isInteger(r)||!Number.isSafeInteger(r)?new j(S.float,r):r>=
0?new j(S.uint,r):new j(S.negint,r)},bigint(r,e,t,n){return r>=BigInt(0)?new j(S.uint,r):new j(S.negint,r)},Uint8Array(r,e,t,n){
return new j(S.bytes,r)},string(r,e,t,n){return new j(S.string,r)},boolean(r,e,t,n){return r?Br.true:Br.false},null(r,e,t,n){
return Br.null},undefined(r,e,t,n){return Br.undefined},ArrayBuffer(r,e,t,n){return new j(S.bytes,new Uint8Array(r))},DataView(r,e,t,n){
return new j(S.bytes,new Uint8Array(r.buffer,r.byteOffset,r.byteLength))},Array(r,e,t,n){if(!r.length)return t.addBreakTokens===
!0?[Br.emptyArray,new j(S.break)]:Br.emptyArray;n=ts.createCheck(n,r);const s=[];let i=0;for(const o of r)s[i++]=Pn(o,t,
n);return t.addBreakTokens?[new j(S.array,r.length),s,new j(S.break)]:[new j(S.array,r.length),s]},Object(r,e,t,n){const s=e!==
"Object",i=s?r.keys():Object.keys(r),o=s?r.size:i.length;let a;if(o){a=new Array(o),n=ts.createCheck(n,r);const c=!s&&t.
ignoreUndefinedProperties;let l=0;for(const u of i){const h=s?r.get(u):r[u];c&&h===void 0||(a[l++]=[Pn(u,t,n),Pn(h,t,n)])}
l<o&&(a.length=l)}return a?.length?(q6(a,t),t.addBreakTokens?[new j(S.map,a.length),a,new j(S.break)]:[new j(S.map,a.length),
a]):t.addBreakTokens===!0?[Br.emptyMap,new j(S.break)]:Br.emptyMap},Tagged(r,e,t,n){return[new j(S.tag,r.tag),Pn(r.value,
t,n)]}};rr.Map=rr.Object;rr.Buffer=rr.Uint8Array;for(const r of"Uint8Clamped Uint16 Uint32 Int8 Int16 Int32 BigUint64 Bi\
gInt64 Float32 Float64".split(" "))rr[`${r}Array`]=rr.DataView;function Pn(r,e={},t){const n=gb(r),s=e&&e.typeEncoders&&
e.typeEncoders[n]||rr[n];if(typeof s=="function"){const o=s(r,n,e,t);if(o!=null)return o}const i=rr[n];if(!i)throw new Error(
`${qn} unsupported type: ${n}`);return i(r,n,e,t)}function q6(r,e){const t=e.mapSorter;t&&r.sort((n,s)=>t(n,s,e))}function pd(r,e,t){
const n=Array.isArray(r[0])?r[0][0]:r[0],s=Array.isArray(e[0])?e[0][0]:e[0];if(n.type.major!==s.type.major)return n.type.
compare(s.type);const i=n.type.major,o=jn[i].compareTokens(n,s,t);return o===0&&console.warn("WARNING: complex key types\
 used, CBOR key sorting guarantees are gone"),o}function Gn(r,e,t,n){if(Array.isArray(e))for(const s of e)Gn(r,s,t,n);else
t[e.type.major](r,e,n)}const Bf=S.uint.majorEncoded,Lf=S.negint.majorEncoded,j6=S.bytes.majorEncoded,G6=S.string.majorEncoded,
Df=S.array.majorEncoded,Lc=S.map.majorEncoded,W6=S.float.majorEncoded|ad,V6=S.float.majorEncoded|cd,H6=S.float.majorEncoded|
ld,K6=S.float.majorEncoded|ud,Q6=BigInt(-1),J6=BigInt(1);function Or(r,e,t){t<24?r.pushByte(e|Number(t)):vt(r,e,t)}function X6(r){
return r.addBreakTokens!==!0}function Y6(r,e,t,n,s){const i=t==="Map",o=i?e.keys():Object.keys(e),a=i?e.size:o.length;if(!a){
r.pushByte(Lc);return}s=ts.createCheck(s,e);const c=!i&&n.ignoreUndefinedProperties,l=new Array(a);let u=0;for(const h of o){
const d=i?e.get(h):e[h];c&&d===void 0||(l[u++]=[Pn(h,n,s),d])}if(u===0){r.pushByte(Lc);return}u<a&&(l.length=u),l.sort((h,d)=>pd(
h,d,n)),Or(r,Lc,u);for(const[h,d]of l)Gn(r,h,jn,n),sa(r,d,n,s)}function sa(r,e,t,n){const s=gb(e),i=t.typeEncoders&&t.typeEncoders[s];
if(i){const o=i(e,s,t,n);if(o!=null){Gn(r,o,jn,t);return}}switch(s){case"null":r.pushByte(H6);return;case"undefined":r.pushByte(
K6);return;case"boolean":r.pushByte(e?V6:W6);return;case"number":!Number.isInteger(e)||!Number.isSafeInteger(e)?za(r,new j(
S.float,e),t):e>=0?Or(r,Bf,e):Or(r,Lf,e*-1-1);return;case"bigint":e>=BigInt(0)?Or(r,Bf,e):Or(r,Lf,e*Q6-J6);return;case"s\
tring":{const o=td(e);Or(r,G6,o.length),r.push(o);return}case"Uint8Array":Or(r,j6,e.length),r.push(e);return;case"Array":
if(!e.length){r.pushByte(Df);return}n=ts.createCheck(n,e),Or(r,Df,e.length);for(const o of e)sa(r,o,t,n);return;case"Obj\
ect":case"Map":if(t.mapSorter===pd)Y6(r,e,s,t,n);else{const o=rr.Object(e,s,t,n);Gn(r,o,jn,t)}return;default:{const o=rr[s];
if(!o)throw new Error(`${qn} unsupported type: ${s}`);const a=o(e,s,t,n);Gn(r,a,jn,t)}}}function Z6(r,e,t,n){const s=n instanceof
Uint8Array;let i=s?new V_(n):bo?new ra:go;const o=Pn(r,t);if(!Array.isArray(o)&&t.quickEncodeToken){const a=t.quickEncodeToken(
o);if(a)return s?(i.push(a),i.toBytes()):a;const c=e[o.type.major];if(c.encodedSize){const l=c.encodedSize(o,t);if(s||(i=
new ra(l)),c(i,o,t),i.chunks.length!==1)throw new Error(`Unexpected error: pre-calculated length for ${o} was wrong`);return s?
i.toBytes():Fa(i.chunks[0])}}return i.reset(),Gn(i,o,e,t),i.toBytes(!0)}function vB(r,e){if(e=Object.assign({},O6,e),X6(
e)){if(bo){const t=new ra;return sa(t,r,e,void 0),t.toBytes()}bo=!0;try{return go.reset(),sa(go,r,e,void 0),go.toBytes(!0)}finally{
bo=!1}}return Z6(r,jn,e)}const eI={strict:!1,allowIndefinite:!0,allowUndefined:!0,allowBigInt:!0};class tI{constructor(e,t={}){
this._pos=0,this.data=e,this.options=t}pos(){return this._pos}done(){return this._pos>=this.data.length}next(){const e=this.
data[this._pos];let t=nr[e];if(t===void 0){const n=z[e];if(!n)throw e===void 0?new Error(`${G} not enough data`):new Error(
`${G} no decoder for major type ${e>>>5} (byte 0x${e.toString(16).padStart(2,"0")})`);const s=e&31;t=n(this.data,this._pos,
s,this.options)}return this._pos+=t.encodedLength,t}}const tn=Symbol.for("DONE"),rn=Symbol.for("BREAK");function rI(r,e,t){
const n=[];for(let s=0;s<r.value;s++){const i=mn(e,t);if(i===rn){if(r.value===1/0)break;throw new Error(`${G} got unexpe\
cted break to lengthed array`)}if(i===tn)throw new Error(`${G} found array but not enough entries (got ${s}, expected ${r.
value})`);n[s]=i}return n}function nI(r,e,t){const n=t.useMaps===!0,s=t.rejectDuplicateMapKeys===!0,i=n?void 0:{},o=n?new Map:
void 0;for(let a=0;a<r.value;a++){const c=mn(e,t);if(c===rn){if(r.value===1/0)break;throw new Error(`${G} got unexpected\
 break to lengthed map`)}if(c===tn)throw new Error(`${G} found map but not enough entries (got ${a} [no key], expected ${r.
value})`);if(!n&&typeof c!="string")throw new Error(`${G} non-string keys not supported (got ${typeof c})`);if(s&&(n&&o.
has(c)||!n&&Object.hasOwn(i,c)))throw new Error(`${G} found repeat map key "${c}"`);const l=mn(e,t);if(l===tn)throw new Error(
`${G} found map but not enough entries (got ${a} [no value], expected ${r.value})`);if(l===rn)throw new Error(`${G} got \
unexpected break to map value`);n?o.set(c,l):c==="__proto__"?Object.defineProperty(i,c,{value:l,configurable:!0,enumerable:!0,
writable:!0}):i[c]=l}return n?o:i}function*sI(r,e,t){for(let n=0;n<r.value;n++){const s=mn(e,t);if(s===rn){if(r.value===
1/0)break;throw new Error(`${G} got unexpected break to lengthed map`)}if(s===tn)throw new Error(`${G} found map but not\
 enough entries (got ${n} [no key], expected ${r.value})`);const i=mn(e,t);if(i===tn)throw new Error(`${G} found map but\
 not enough entries (got ${n} [no value], expected ${r.value})`);if(i===rn)throw new Error(`${G} got unexpected break to\
 map value`);yield[s,i]}}function iI(r,e){const t=function(){if(t._called)throw new Error(`${G} tag decode() may only be\
 called once`);t._called=!0;const n=mn(r,e);if(n===tn)throw new Error(`${G} tag content missing`);if(n===rn)throw new Error(
`${G} got unexpected break in tag content`);return n};return t.entries=function(){if(t._called)throw new Error(`${G} tag\
 decode() may only be called once`);if(t._called=!0,r.done())throw new Error(`${G} tag content missing`);const n=r.next();
if(!S.equals(n.type,S.map))throw new Error(`${G} entries() requires map content, got ${n.type.name}`);const s=[];for(const i of sI(
n,r,e))s.push(i);return s},t._called=!1,t}function mn(r,e){if(r.done())return tn;const t=r.next();if(S.equals(t.type,S.break))
return rn;if(t.type.terminal)return t.value;if(S.equals(t.type,S.array))return rI(t,r,e);if(S.equals(t.type,S.map))return nI(
t,r,e);if(S.equals(t.type,S.tag)){if(e.tags&&typeof e.tags[t.value]=="function"){const n=iI(r,e),s=e.tags[t.value](n);if(!n.
_called)throw new Error(`${G} tag decoder must call decode() or entries()`);return s}throw new Error(`${G} tag not suppo\
rted (${t.value})`)}throw new Error("unsupported")}function oI(r,e){if(!(r instanceof Uint8Array))throw new Error(`${G} \
data to decode must be a Uint8Array`);e=Object.assign({},eI,e);const t=Fa(r),n=e.tokenizer||new tI(t,e),s=mn(n,e);if(s===
tn)throw new Error(`${G} did not find any content to decode`);if(s===rn)throw new Error(`${G} got unexpected break`);return[
s,r.subarray(n.pos())]}function xb(r,e){const[t,n]=oI(r,e);if(n.length>0)throw new Error(`${G} too many terminals, data \
makes no sense`);return t}function aI(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)
if(r[t]!==e[t])return!1;return!0}function md(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return yi(
r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return yi(new Uint8Array(r.buffer,r.byteOffset,
r.byteLength));throw new Error("Unknown type, must be binary type")}function cI(r){return r?.buffer instanceof ArrayBuffer}
function yi(r){return cI(r)?r:r.slice()}function lI(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==
0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-
w;M!==A&&v[M]===0;)M++;for(var R=h.repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.
length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&
C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var uI=lI,dI=uI;let hI=class{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}},fI=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return vb(this,e)}},
pI=class{decoders;constructor(e){this.decoders=e}or(e){return vb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function vb(r,e){return new pI({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let mI=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new hI(e,t,n),this.decoder=new fI(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Sb({name:r,prefix:e,encode:t,decode:n}){return new mI(r,e,t,
n)}function Wa({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=dI(t,r,n);return Sb({prefix:e,
name:r,encode:s,decode:o=>md(i(o))})}function gI(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function bI(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function yI(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Sr({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=yI(n,s);return Sb(
{prefix:e,name:r,encode(o){return bI(o,n,t)},decode(o){return gI(o,i,t,r)}})}const yo=Sr({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});Sr({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});Sr({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});Sr({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Dc=Wa(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Wa({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Gr=Wa({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Wa({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var wI=Ab,Pf=128,kI=-128,EI=Math.pow(2,31);function Ab(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=EI;)e[t++]=r&255|Pf,r/=128;for(;r&kI;)e[t++]=r&255|Pf,r>>>=7;return e[t]=r|0,Ab.bytes=t-n+1,e}var xI=Kl,
vI=128,$f=127;function Kl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Kl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&$f)<<s:(o&$f)*Math.pow(2,s),s+=7}while(o>=vI);return Kl.bytes=i-n,t}var SI=Math.pow(
2,7),AI=Math.pow(2,14),_I=Math.pow(2,21),II=Math.pow(2,28),CI=Math.pow(2,35),TI=Math.pow(2,42),MI=Math.pow(2,49),RI=Math.
pow(2,56),BI=Math.pow(2,63),LI=function(r){return r<SI?1:r<AI?2:r<_I?3:r<II?4:r<CI?5:r<TI?6:r<MI?7:r<RI?8:r<BI?9:10},DI={
encode:wI,decode:xI,encodingLength:LI},ia=DI;function Ql(r,e=0){const t=ia.decode(r,e),n=ia.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function oa(r,e,t=0){return ia.encode(r,e,t),e}function aa(r){return ia.encodingLength(r)}function PI(r,e){const t=e.
byteLength,n=aa(r),s=n+aa(t),i=new Uint8Array(s+t);return oa(r,i,0),oa(t,i,n),i.set(e,s),new gd(r,t,e,i)}function $I(r){
const e=md(r),[t,n]=Ql(e),[s,i]=Ql(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new gd(t,s,o,e)}function NI(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&aI(r.bytes,t.bytes)}}let gd=class{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
yi(n),this.bytes=yi(s)}};function Nf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return FI(t,Jl(r),e??Gr.encoder);default:
return OI(t,Jl(r),e??yo.encoder)}}const Uf=new WeakMap;function Jl(r){const e=Uf.get(r);if(e==null){const t=new Map;return Uf.
set(r,t),t}return e}let _b=class Xe{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.
multihash=n,this.bytes=yi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
Ss)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==zI)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Xe.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=PI(e,
t);return Xe.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Xe.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&NI(e.multihash,n.multihash)}toString(e){return Nf(this,e)}toJSON(){return{"/":Nf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Xe)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Xe(n,s,i,o??Ff(n,s,i.bytes))}else if(t[qI]===!0){const{version:n,
multihash:s,code:i}=t,o=$I(s);return Xe.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==Ss)throw new Error(`Version 0 CID must use dag-pb (code: ${Ss}) block encoding`);return new Xe(e,t,n,n.bytes)}case 1:{
const s=Ff(e,t,n.bytes);return new Xe(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Xe.
create(0,Ss,e)}static createV1(e,t){return Xe.create(1,e,t)}static decode(e){const[t,n]=Xe.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Xe.inspectBytes(e),n=t.size-t.multihashSize,
s=md(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new gd(t.multihashCode,t.digestSize,i,s);return[t.version===0?Xe.createV0(o):Xe.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Ql(e.subarray(t));return t+=d,h};let s=n(),
i=Ss;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=UI(e,t),
i=Xe.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Jl(
i).set(n,e),i}};function UI(r,e){switch(r[0]){case"Q":{const t=e??Gr;return[Gr.prefix,t.decode(`${Gr.prefix}${r}`)]}case Gr.
prefix:{const t=e??Gr;return[Gr.prefix,t.decode(r)]}case yo.prefix:{const t=e??yo;return[yo.prefix,t.decode(r)]}case Dc.
prefix:{const t=e??Dc;return[Dc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function FI(r,e,t){const{prefix:n}=t;if(n!==
Gr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function OI(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const Ss=112,zI=18;function Ff(r,e,t){const n=aa(r),s=n+aa(e),i=new Uint8Array(s+t.
byteLength);return oa(r,i,0),oa(e,i,n),i.set(t,s),i}const qI=Symbol.for("@ipld/js-cid/CID"),Ib=42;function jI(r){return r instanceof
ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}function GI(r){if(r.asCID!==r&&r["/"]!==r.bytes)return null;const e=_b.asCID(
r);if(!e)return null;const t=new Uint8Array(e.bytes.byteLength+1);return t.set(e.bytes,1),[new j(S.tag,Ib),new j(S.bytes,
t)]}function WI(){throw new Error("`undefined` is not supported by the IPLD Data Model and cannot be encoded")}function VI(r){
if(Number.isNaN(r))throw new Error("`NaN` is not supported by the IPLD Data Model and cannot be encoded");if(r===1/0||r===
-1/0)throw new Error("`Infinity` and `-Infinity` is not supported by the IPLD Data Model and cannot be encoded");return null}
function HI(r){for(const e of r.keys())if(typeof e!="string"||e.length===0)throw new Error("Non-string Map keys are not \
supported by the IPLD Data Model and cannot be encoded");return null}const KI={typeEncoders:{Map:HI,Object:GI,undefined:WI,
number:VI}};({...KI.typeEncoders});function QI(r){const e=r();if(e[0]!==0)throw new Error("Invalid CID for CBOR tag 42; \
expected leading 0x00");return _b.decode(e.subarray(1))}const Xl={allowIndefinite:!1,coerceUndefinedToNull:!0,allowNaN:!1,
allowInfinity:!1,allowBigInt:!0,strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{[Ib]:QI}};({...Xl,tags:{...Xl.tags}});
const Cb=113,Tb=r=>xb(jI(r),Xl);class TB extends Array{constructor(){super(),this.inRecursive=[]}prefix(e){const t=this.
inRecursive[this.inRecursive.length-1];t&&(S.equals(t.type,S.array)&&(t.elements++,t.elements!==1&&e.push([44])),S.equals(
t.type,S.map)&&(t.elements++,t.elements!==1&&(t.elements%2===1?e.push([44]):e.push([58]))))}[S.uint.major](e,t){this.prefix(
e);const n=String(t.value),s=[];for(let i=0;i<n.length;i++)s[i]=n.charCodeAt(i);e.push(s)}[S.negint.major](e,t){this[S.uint.
major](e,t)}[S.bytes.major](e,t){throw new Error(`${qn} unsupported type: Uint8Array`)}[S.string.major](e,t){this.prefix(
e);const n=td(JSON.stringify(t.value));e.push(n.length>32?Fa(n):n)}[S.array.major](e,t){this.prefix(e),this.inRecursive.
push({type:S.array,elements:0}),e.push([91])}[S.map.major](e,t){this.prefix(e),this.inRecursive.push({type:S.map,elements:0}),
e.push([123])}[S.tag.major](e,t){}[S.float.major](e,t){if(t.type.name==="break"){const o=this.inRecursive.pop();if(o){if(S.
equals(o.type,S.array))e.push([93]);else if(S.equals(o.type,S.map))e.push([125]);else throw new Error("Unexpected recurs\
ive type; this should not happen!");return}throw new Error("Unexpected break; this should not happen!")}if(t.value===void 0)
throw new Error(`${qn} unsupported type: undefined`);if(this.prefix(e),t.type.name==="true"){e.push([116,114,117,101]);return}else if(t.
type.name==="false"){e.push([102,97,108,115,101]);return}else if(t.type.name==="null"){e.push([110,117,108,108]);return}
if(typeof t.value=="number"&&!Number.isFinite(t.value))throw new Error(`${qn} unsupported type: ${t.value}`);const n=String(
t.value),s=[];let i=!1;for(let o=0;o<n.length;o++)s[o]=n.charCodeAt(o),!i&&(s[o]===46||s[o]===101||s[o]===69)&&(i=!0);i||
(s.push(46),s.push(48)),e.push(s)}}const Of=1e3;class Mb{constructor(e,t={}){this._pos=0,this.data=e,this.options=t,this.
modeStack=["value"],this.lastToken=""}pos(){return this._pos}done(){return this._pos>=this.data.length}ch(){return this.
data[this._pos]}currentMode(){return this.modeStack[this.modeStack.length-1]}skipWhitespace(){let e=this.ch();for(;e===32||
e===9||e===13||e===10;)e=this.data[++this._pos]}expect(e){if(this.data.length-this._pos<e.length)throw new Error(`${G} u\
nexpected end of input at position ${this._pos}`);for(let t=0;t<e.length;t++)if(this.data[this._pos++]!==e[t])throw new Error(
`${G} unexpected token at position ${this._pos}, expected to find '${String.fromCharCode(...e)}'`)}parseNumber(){const e=this.
_pos;let t=!1,n=!1;const s=a=>{for(;!this.done();){const c=this.ch();if(a.includes(c))this._pos++;else break}};if(this.ch()===
45&&(t=!0,this._pos++),this.ch()===48)if(this._pos++,this.ch()===46)this._pos++,n=!0;else return new j(S.uint,0,this._pos-
e);if(s([48,49,50,51,52,53,54,55,56,57]),t&&this._pos===e+1)throw new Error(`${G} unexpected token at position ${this._pos}`);
if(!this.done()&&this.ch()===46){if(n)throw new Error(`${G} unexpected token at position ${this._pos}`);n=!0,this._pos++,
s([48,49,50,51,52,53,54,55,56,57])}if(!this.done()&&(this.ch()===101||this.ch()===69)&&(n=!0,this._pos++,!this.done()&&(this.
ch()===43||this.ch()===45)&&this._pos++,s([48,49,50,51,52,53,54,55,56,57])),this._pos-e>Of)throw new Error(`${G} number \
at position ${e} exceeds ${Of} characters`);const i=String.fromCharCode.apply(null,this.data.subarray(e,this._pos)),o=parseFloat(
i);if(n){if(this.options.allowInfinity===!1&&!Number.isFinite(o))throw new Error(`${G} Infinity values are not supported`);
return new j(S.float,o,this._pos-e)}if(this.options.allowBigInt!==!0||Number.isSafeInteger(o)){if(!Number.isFinite(o))throw new Error(
`${G} integer at position ${e} is too large for a Number, use allowBigInt`);return new j(o>=0?S.uint:S.negint,o,this._pos-
e)}return new j(o>=0?S.uint:S.negint,BigInt(i),this._pos-e)}parseString(){if(this.ch()!==34)throw new Error(`${G} unexpe\
cted character at position ${this._pos}; this shouldn't happen`);this._pos++;for(let i=this._pos,o=0;i<this.data.length&&
o<65536;i++,o++){const a=this.data[i];if(a===92||a<32||a>=128)break;if(a===34){const c=String.fromCharCode.apply(null,this.
data.subarray(this._pos,i));return this._pos=i+1,new j(S.string,c,o)}}const e=this._pos,t=[],n=()=>{if(this._pos+4>=this.
data.length)throw new Error(`${G} unexpected end of unicode escape sequence at position ${this._pos}`);let i=0;for(let o=0;o<
4;o++){let a=this.ch();if(a>=48&&a<=57)a-=48;else if(a>=97&&a<=102)a=a-97+10;else if(a>=65&&a<=70)a=a-65+10;else throw new Error(
`${G} unexpected unicode escape character at position ${this._pos}`);i=i*16+a,this._pos++}return i},s=()=>{const i=this.
ch();let o=null,a=i>239?4:i>223?3:i>191?2:1;if(this._pos+a>this.data.length)throw new Error(`${G} unexpected unicode seq\
uence at position ${this._pos}`);let c,l,u,h;switch(a){case 1:i<128&&(o=i);break;case 2:c=this.data[this._pos+1],(c&192)===
128&&(h=(i&31)<<6|c&63,h>127&&(o=h));break;case 3:c=this.data[this._pos+1],l=this.data[this._pos+2],(c&192)===128&&(l&192)===
128&&(h=(i&15)<<12|(c&63)<<6|l&63,h>2047&&(h<55296||h>57343)&&(o=h));break;case 4:c=this.data[this._pos+1],l=this.data[this.
_pos+2],u=this.data[this._pos+3],(c&192)===128&&(l&192)===128&&(u&192)===128&&(h=(i&15)<<18|(c&63)<<12|(l&63)<<6|u&63,h>
65535&&h<1114112&&(o=h))}if(o===null){if(this.options.strictUtf8===!0)throw new Error(`${G} invalid UTF-8 in text string\
 at position ${this._pos}`);o=65533,a=1}else o>65535&&(o-=65536,t.push(o>>>10&1023|55296),o=56320|o&1023);t.push(o),this.
_pos+=a};for(;!this.done();){const i=this.ch();let o;switch(i){case 92:if(this._pos++,this.done())throw new Error(`${G} \
unexpected string termination at position ${this._pos}`);switch(o=this.ch(),this._pos++,o){case 34:case 39:case 92:case 47:
t.push(o);break;case 98:t.push(8);break;case 116:t.push(9);break;case 110:t.push(10);break;case 102:t.push(12);break;case 114:
t.push(13);break;case 117:t.push(n());break;default:throw new Error(`${G} unexpected string escape character at position\
 ${this._pos}`)}break;case 34:return this._pos++,new j(S.string,G_(t),this._pos-e);default:if(i<32)throw new Error(`${G}\
 invalid control character at position ${this._pos}`);i<128?(t.push(i),this._pos++):s()}}throw new Error(`${G} unexpecte\
d end of string at position ${this._pos}`)}parseValue(){switch(this.ch()){case 123:return this.modeStack.push("obj-start"),
this._pos++,new j(S.map,1/0,1);case 91:return this.modeStack.push("array-start"),this._pos++,new j(S.array,1/0,1);case 34:
return this.parseString();case 110:return this.expect([110,117,108,108]),new j(S.null,null,4);case 102:return this.expect(
[102,97,108,115,101]),new j(S.false,!1,5);case 116:return this.expect([116,114,117,101]),new j(S.true,!0,4);case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
return this.parseNumber();default:throw new Error(`${G} unexpected character at position ${this._pos}`)}}next(){switch(this.
skipWhitespace(),this.currentMode()){case"value":return this.modeStack.pop(),this.parseValue();case"array-value":{if(this.
modeStack.pop(),this.ch()===93)return this._pos++,this.skipWhitespace(),new j(S.break,void 0,1);if(this.ch()!==44)throw new Error(
`${G} unexpected character at position ${this._pos}, was expecting array delimiter but found '${String.fromCharCode(this.
ch())}'`);return this._pos++,this.modeStack.push("array-value"),this.skipWhitespace(),this.parseValue()}case"array-start":
return this.modeStack.pop(),this.ch()===93?(this._pos++,this.skipWhitespace(),new j(S.break,void 0,1)):(this.modeStack.push(
"array-value"),this.skipWhitespace(),this.parseValue());case"obj-key":if(this.ch()===125)return this.modeStack.pop(),this.
_pos++,this.skipWhitespace(),new j(S.break,void 0,1);if(this.ch()!==44)throw new Error(`${G} unexpected character at pos\
ition ${this._pos}, was expecting object delimiter but found '${String.fromCharCode(this.ch())}'`);this._pos++,this.skipWhitespace();case"\
obj-start":{if(this.modeStack.pop(),this.ch()===125)return this._pos++,this.skipWhitespace(),new j(S.break,void 0,1);const e=this.
parseString();if(this.skipWhitespace(),this.ch()!==58)throw new Error(`${G} unexpected character at position ${this._pos}\
, was expecting key/value delimiter ':' but found '${String.fromCharCode(this.ch())}'`);return this._pos++,this.modeStack.
push("obj-value"),e}case"obj-value":return this.modeStack.pop(),this.modeStack.push("obj-key"),this.skipWhitespace(),this.
parseValue();default:throw new Error(`${G} unexpected parse state at position ${this._pos}; this shouldn't happen`)}}}function JI(r,e){
return e=Object.assign({tokenizer:new Mb(r,e)},e),xb(r,e)}function XI(r,e){if(r===e)return!0;if(r.byteLength!==e.byteLength)
return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}function bd(r){if(r instanceof Uint8Array&&r.constructor.
name==="Uint8Array")return wi(r);if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return wi(
new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error("Unknown type, must be binary type")}function YI(r){
return r?.buffer instanceof ArrayBuffer}function wi(r){return YI(r)?r:r.slice()}function ZI(r,e,t){if(r.length>=255)throw new TypeError(
"Alphabet too long");for(var n=new Uint8Array(256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(
i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(
0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(
256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,
f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.from(f))),!(f instanceof Uint8Array))throw new TypeError("Exp\
ected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,k=0,x=f.length;k!==x&&f[k]===0;)k++,g++;for(var A=(x-k)*p+1>>>
0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>
0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-w;M!==A&&v[M]===0;)M++;for(var R=h.repeat(g);M<A;++M)R+=
r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError("Expected String");if(f.length===0)return new Uint8Array;
var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.
charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;
if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(
w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(f);if(g)return g;throw new Error(`Non-${e} character`)}
return{encode:m,decodeUnsafe:y,decode:b}}var eC=ZI,tC=eC;let rC=class{name;prefix;baseEncode;constructor(e,t,n){this.name=
e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error(
"Unknown type, must be binary type")}},nC=class{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){this.name=e,this.
prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=s,this.
baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode m\
ultibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Rb(this,e)}},
sC=class{decoders;constructor(e){this.decoders=e}or(e){return Rb(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=
null)return n.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed w\
ith ${Object.keys(this.decoders)} are supported`)}};function Rb(r,e){return new sC({...r.decoders??{[r.prefix]:r},...e.decoders??
{[e.prefix]:e}})}let iC=class{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){this.name=e,this.prefix=
t,this.baseEncode=n,this.baseDecode=s,this.encoder=new rC(e,t,n),this.decoder=new nC(e,t,s)}encode(e){return this.encoder.
encode(e)}decode(e){return this.decoder.decode(e)}};function Bb({name:r,prefix:e,encode:t,decode:n}){return new iC(r,e,t,
n)}function Va({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=tC(t,r,n);return Bb({prefix:e,
name:r,encode:s,decode:o=>bd(i(o))})}function oC(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(s*
t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);a=
a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function aC(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function cC(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function St({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=cC(n,s);return Bb(
{prefix:e,name:r,encode(o){return aC(o,n,t)},decode(o){return oC(o,i,t,r)}})}const wo=St({prefix:"b",name:"base32",alphabet:"\
abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});St({prefix:"B",name:"base32upper",alphabet:"ABCDEFG\
HIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});St({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnop\
qrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});St({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRS\
TUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});St({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopq\
rstuv",bitsPerChar:5,caseInsensitive:!0});St({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTU\
V",bitsPerChar:5,caseInsensitive:!0});St({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,
caseInsensitive:!0});St({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,
caseInsensitive:!0});St({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const Pc=Va(
{prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Va({prefix:"K",name:"base\
36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Wr=Va({name:"base58btc",prefix:"z",alphabet:"\
123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Va({name:"base58flickr",prefix:"Z",alphabet:"123456789abcd\
efghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var lC=Lb,zf=128,uC=-128,dC=Math.pow(2,31);function Lb(r,e,t){e=e||[],t=
t||0;for(var n=t;r>=dC;)e[t++]=r&255|zf,r/=128;for(;r&uC;)e[t++]=r&255|zf,r>>>=7;return e[t]=r|0,Lb.bytes=t-n+1,e}var hC=Yl,
fC=128,qf=127;function Yl(r,n){var t=0,n=n||0,s=0,i=n,o,a=r.length;do{if(i>=a)throw Yl.bytes=0,new RangeError("Could not\
 decode varint");o=r[i++],t+=s<28?(o&qf)<<s:(o&qf)*Math.pow(2,s),s+=7}while(o>=fC);return Yl.bytes=i-n,t}var pC=Math.pow(
2,7),mC=Math.pow(2,14),gC=Math.pow(2,21),bC=Math.pow(2,28),yC=Math.pow(2,35),wC=Math.pow(2,42),kC=Math.pow(2,49),EC=Math.
pow(2,56),xC=Math.pow(2,63),vC=function(r){return r<pC?1:r<mC?2:r<gC?3:r<bC?4:r<yC?5:r<wC?6:r<kC?7:r<EC?8:r<xC?9:10},SC={
encode:lC,decode:hC,encodingLength:vC},ca=SC;function Zl(r,e=0){const t=ca.decode(r,e),n=ca.decode.bytes;if(n>9)throw new RangeError(
"Invalid varint: too long");if(n>1&&r[e+n-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,
n]}function la(r,e,t=0){return ca.encode(r,e,t),e}function ua(r){return ca.encodingLength(r)}function AC(r,e){const t=e.
byteLength,n=ua(r),s=n+ua(t),i=new Uint8Array(s+t);return la(r,i,0),la(t,i,n),i.set(e,s),new yd(r,t,e,i)}function _C(r){
const e=bd(r),[t,n]=Zl(e),[s,i]=Zl(e.subarray(n)),o=e.subarray(n+i);if(o.byteLength!==s)throw new Error("Incorrect lengt\
h");return new yd(t,s,o,e)}function IC(r,e){if(r===e)return!0;{const t=e;return r.code===t.code&&r.size===t.size&&t.bytes instanceof
Uint8Array&&XI(r.bytes,t.bytes)}}class yd{code;size;digest;bytes;constructor(e,t,n,s){this.code=e,this.size=t,this.digest=
wi(n),this.bytes=wi(s)}}function jf(r,e){const{bytes:t,version:n}=r;switch(n){case 0:return TC(t,eu(r),e??Wr.encoder);default:
return MC(t,eu(r),e??wo.encoder)}}const Gf=new WeakMap;function eu(r){const e=Gf.get(r);if(e==null){const t=new Map;return Gf.
set(r,t),t}return e}class Ne{code;version;multihash;bytes;"/";constructor(e,t,n,s){this.code=t,this.version=e,this.multihash=
n,this.bytes=wi(s),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){
return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==
As)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==RC)throw new Error("Cannot convert non sha2-2\
56 multihash CID to CIDv0");return Ne.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to ve\
rsion 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,n=AC(e,
t);return Ne.createV1(this.code,n)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} t\
o version 1. This is a bug please report`)}}equals(e){return Ne.equals(this,e)}static equals(e,t){const n=t;return n!=null&&
e.code===n.code&&e.version===n.version&&IC(e.multihash,n.multihash)}toString(e){return jf(this,e)}toJSON(){return{"/":jf(
this)}}link(){return this}[Symbol.toStringTag]="CID";[Symbol.for("nodejs.util.inspect.custom")](){return`CID(${this.toString()}\
)`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof Ne)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===
t){const{version:n,code:s,multihash:i,bytes:o}=t;return new Ne(n,s,i,o??Wf(n,s,i.bytes))}else if(t[BC]===!0){const{version:n,
multihash:s,code:i}=t,o=_C(s);return Ne.create(n,i,o)}else return null}static create(e,t,n){if(typeof t!="number")throw new Error(
"String codecs are no longer supported");if(!(n.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{
if(t!==As)throw new Error(`Version 0 CID must use dag-pb (code: ${As}) block encoding`);return new Ne(e,t,n,n.bytes)}case 1:{
const s=Wf(e,t,n.bytes);return new Ne(e,t,n,s)}default:throw new Error("Invalid version")}}static createV0(e){return Ne.
create(0,As,e)}static createV1(e,t){return Ne.create(1,e,t)}static decode(e){const[t,n]=Ne.decodeFirst(e);if(n.length!==
0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=Ne.inspectBytes(e),n=t.size-t.multihashSize,
s=bd(e.subarray(n,n+t.multihashSize));if(s.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=s.subarray(
t.multihashSize-t.digestSize),o=new yd(t.multihashCode,t.digestSize,i,s);return[t.version===0?Ne.createV0(o):Ne.createV1(
t.codec,o),e.subarray(t.size)]}static inspectBytes(e){let t=0;const n=()=>{const[h,d]=Zl(e.subarray(t));return t+=d,h};let s=n(),
i=As;if(s===18?(s=0,t=0):i=n(),s!==0&&s!==1)throw new RangeError(`Invalid CID version ${s}`);const o=t,a=n(),c=n(),l=t+c,
u=l-o;return{version:s,codec:i,multihashCode:a,digestSize:c,multihashSize:u,size:l}}static parse(e,t){const[n,s]=CC(e,t),
i=Ne.decode(s);if(i.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return eu(
i).set(n,e),i}}function CC(r,e){switch(r[0]){case"Q":{const t=e??Wr;return[Wr.prefix,t.decode(`${Wr.prefix}${r}`)]}case Wr.
prefix:{const t=e??Wr;return[Wr.prefix,t.decode(r)]}case wo.prefix:{const t=e??wo;return[wo.prefix,t.decode(r)]}case Pc.
prefix:{const t=e??Pc;return[Pc.prefix,t.decode(r)]}default:{if(e==null)throw Error("To parse non base32, base36 or base\
58btc encoded CID multibase decoder must be provided");return[r[0],e.decode(r)]}}}function TC(r,e,t){const{prefix:n}=t;if(n!==
Wr.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const s=e.get(n);if(s==null){const i=t.encode(r).
slice(1);return e.set(n,i),i}else return s}function MC(r,e,t){const{prefix:n}=t,s=e.get(n);if(s==null){const i=t.encode(
r);return e.set(n,i),i}else return s}const As=112,RC=18;function Wf(r,e,t){const n=ua(r),s=n+ua(e),i=new Uint8Array(s+t.
byteLength);return la(r,i,0),la(e,i,n),i.set(t,s),i}const BC=Symbol.for("@ipld/js-cid/CID"),LC=St({prefix:"m",name:"base\
64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});St({prefix:"M",name:"bas\
e64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});St({prefix:"u",name:"\
base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});St({prefix:"U",name:"\
base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});function DC(r){
return r instanceof ArrayBuffer?new Uint8Array(r,0,r.byteLength):r}class PC extends Mb{constructor(e,t){super(e,t),this.
tokenBuffer=[]}done(){return this.tokenBuffer.length===0&&super.done()}_next(){return this.tokenBuffer.length>0?this.tokenBuffer.
pop():super.next()}next(){const e=this._next();if(S.equals(e.type,S.map)){const t=this._next();if(S.equals(t.type,S.string)&&
t.value==="/"){const n=this._next();if(S.equals(n.type,S.string)){const s=this._next();if(!S.equals(s.type,S.break))throw new Error(
"Invalid encoded CID form");return this.tokenBuffer.push(n),new j(S.tag,42,0)}if(S.equals(n.type,S.map)){const s=this._next();
if(S.equals(s.type,S.string)&&s.value==="bytes"){const i=this._next();if(S.equals(i.type,S.string)){for(let a=0;a<2;a++){
const c=this._next();if(!S.equals(c.type,S.break))throw new Error("Invalid encoded Bytes form")}const o=LC.decode(`m${i.
value}`);return new j(S.bytes,o,i.value.length)}this.tokenBuffer.push(i)}this.tokenBuffer.push(s)}this.tokenBuffer.push(
n)}this.tokenBuffer.push(t)}return e}}const Vf={allowIndefinite:!1,allowUndefined:!1,allowNaN:!1,allowInfinity:!1,allowBigInt:!0,
strict:!0,useMaps:!1,rejectDuplicateMapKeys:!0,tags:{42:r=>Ne.parse(r())}},Db=297,Pb=r=>{const e=DC(r),t=Object.assign(Vf,
{tokenizer:new PC(e,Vf)});return JI(e,t)};new TextDecoder;new TextEncoder;new TextEncoder;const $C=new TextDecoder,$b=512;
function Nb(r){return JSON.parse($C.decode(r))}const wd=85,NC=0,Ub={code:NC},Fb=81,UC=10;function FC(r=0){return new Uint8Array(
r)}function OC(r){return r?.buffer instanceof ArrayBuffer}function zC(r){if(OC(r))return r;const e=r.slice();return new Uint8Array(
e.buffer,0,e.byteLength)}function Hf(r,e){e==null&&(e=r.reduce((s,i)=>s+i.length,0));const t=FC(e);let n=0;for(const s of r)
t.set(s,n),n+=s.length;return zC(t)}function qC(r){return r[Symbol.asyncIterator]!=null}function Pt(r){if(qC(r))return(async()=>{
let n=new Uint8Array(0);for await(const s of r)n=Hf([n,s],n.length+s.length);return n})();const e=[];let t=0;for(const n of r)
e.push(n),t+=n.byteLength;return Hf(e,t)}function kd(r){return r==null?!1:pn.asCID(r)===r}function Ed(r,e){let t,n=0,s="";
for(;n<e.length;){const i=e[n];if(n++,!Object.hasOwnProperty.call(r,i))throw new gi(`Object did not have key "${i}"`);if(s+=
`/${i}`,t=r[i],r=t,kd(t))break}return{value:t,rest:e.slice(n),path:s.substring(1)}}async function*Kf(r,e,t,n){const s=await Pt(
t.get(r,n)),i=Tb(s),o=Ed(i,e);yield{cid:kd(o.value)?o.value:r,name:o.path,rest:o.rest}}async function*jC(r,e,t,n){const s=await Pt(
t.get(r,n)),i=Pb(s),o=Ed(i,e);yield{cid:kd(o.value)?o.value:r,name:o.path,rest:o.rest}}function tu(r){return r.type==="D\
IRECTORY"}function Ob(r){return r.type==="FILE"}function zb(r){return r.type==="RAW"}function qb(r){return r.type==="SYM\
LINK"}function Wn(r){return r.type==="HAMT_SHARD"&&r.data instanceof Uint8Array&&typeof r.fanOut=="bigint"&&typeof r.hashType==
"bigint"}function cn(r){return typeof r.name=="string"&&pn.asCID(r.hash)===r.hash}function*jb(r){let e={},t={};for(const n of hi.
stream(r))switch(n.field){case".data":{if(n.type==="start"&&(t={}),n.type==="end"){if(tu(t)||Wn(t)||Ob(t)||zb(t)||qb(t)){
yield t;return}throw new Pe("PBNode Data was not a valid UnixFS type")}break}case".data.type":{t.type=n.value;break}case"\
.data.data":{t.data=n.value;break}case".data.fanOut":{t.fanOut=n.value;break}case".data.hashType":{t.hashType=n.value;break}case"\
.links[]":{n.type==="start"&&(e={type:"LINK"}),n.type==="end"&&cn(e)&&(yield e);break}case".links[].name":{e.name=n.value;
break}case".links[].hash":{e.hash=pn.decode(n.value);break}}}const Qf=(r,e)=>r.toString(16).toUpperCase().padStart(e,"0").
substring(0,e),GC=r=>{let e=r.bucket;const t=[];for(;e._parent!=null;)t.push(e),e=e._parent;return t.push(e),t.reverse()};
async function*ru(r,e,t,n,s,i,o){const a=(i.lastBucket.tableSize()-1).toString(16).length;let c=[];for(const b of e){if(!cn(
b))throw new Pe("Invalid link");if(c.push(b),b.name.length===a){const f=parseInt(b.name,16);i.lastBucket._putObjectAt(f,
new wt({hash:i.lastBucket._options.hash,bits:i.lastBucket._options.bits},i.lastBucket,f))}if(b.name.substring(a)===t){yield{
cid:b.hash,name:t,rest:n};return}await i.rootBucket.put(b.name.substring(a),!0)}const l=await i.rootBucket._findNewBucketAndPos(
t);let u=Qf(l.pos,a);const h=GC(l);h.length>i.hamtDepth&&(i.lastBucket=h[i.hamtDepth],u=Qf(i.lastBucket._posAtParent,a));
const d=c.find(b=>b.name==null?!1:b.name===u);if(d==null)return;i.hamtDepth++;const p=await Pt(s.get(d.hash,o));o?.yieldSubShards===
!0&&(yield{cid:d.hash,name:d.name,rest:[t,...n]});const m=jb(p),{value:y}=m.next();if(c=[],y!=null){if(Wn(y)){yield*ru(y,
m,t,n,s,i,o);return}if(!cn(y))throw new Pe("Did not read Link or Data from dag-pb block");c.push(y);for(const b of m){if(Wn(
b)){yield*ru(b,c,t,n,s,i,o);return}if(!cn(b))throw new Pe("Did not read Link or Data from dag-pb block");c.push(b)}}}function*Jf(r,e,t){
for(const n of r){if(!cn(n))throw new Pe("Invalid link");if(n.name===e[0]){yield{cid:n.hash,name:e[0],rest:e.slice(1)};return}}
throw new kn(`No link "${e[0]}" found under ${t}`)}const WC=async function(r){return(await eb.encode(r)).slice(0,8).reverse()};
async function*Xf(r,e,t,n,s,i){const o=ab({hashFn:WC,bits:Math.log2(Number(r.fanOut))}),a={rootBucket:o,hamtDepth:1,lastBucket:o};
for await(const c of ru(r,e,t[0],t.slice(1),s,a,i))if(yield c,c.name===t[0])return;throw new kn(`No link "${t[0]}" found\
 under ${n}`)}async function*VC(r,e,t,n){const s=await Pt(t.get(r,n)),i=[],o=jb(s),{value:a}=o.next();let c=!1,l=!1;if(a!=
null){if(l=tu(a),c=Wn(a),Ob(a)||zb(a)||qb(a)){yield{cid:r,name:e[0],rest:e.slice(1)};return}if(l||c&&n?.translateHAMTPath===
!1){yield*Jf(o,e,r);return}if(c){yield*Xf(a,o,e,r,t,n);return}if(!cn(a))throw new Pe("Did not read Link or Data from dag\
-pb block");i.push(a);for(const u of o){if(l=tu(u),c=Wn(u),l||c&&n?.translateHAMTPath===!1){yield*Jf(i,e,r);return}if(Wn(
u)){yield*Xf(u,i,e,r,t,n);return}if(!cn(u))throw new Pe("Did not read Link or Data from dag-pb block");i.push(u)}}throw new kn(
`No link "${e[0]}" found under ${r}`)}async function*HC(r,e,t,n){if(e.length!==0)throw new gi(`Cannot load path /${e.join(
"/")} from identity block`)}async function*KC(r,e,t,n){const s=await Pt(t.get(r,n)),i=Nb(s),o=Ed(i,e);yield{cid:r,name:o.
path,rest:o.rest}}async function*QC(r,e,t,n){if(e.length!==0)throw new kn(`Cannot load path /${e.join("/")} from raw blo\
ck`)}const JC={[_i]:VC,[wd]:QC,[Cb]:Kf,[Fb]:Kf,[Db]:jC,[Ub.code]:HC,[$b]:KC};async function*XC(r,e,t={}){for(r=r.toString(),
r.startsWith("/ipfs/")&&(r=r.substring(6));r.endsWith("/");)r=r.substring(0,r.length-1);let[n,...s]=r.split(/(?<!\\)\//g).
filter(Boolean),i=pn.parse(n),o=[i],a=`${i}`;for(yield{cid:i,name:a,path:a,roots:o,remainder:s};s.length>0;){const c=JC[i.
code];if(c==null)throw new bi(`No resolver for code ${i.code}`);let l=!1;for await(const u of c(i,s,e,t)){if(i=u.cid,l=!o[o.
length-1].equals(i),s=u.rest,!l)break;o=[...o,u.cid],a=`${a}/${u.name}`,yield{cid:u.cid,name:u.name,path:a,roots:o,remainder:u.
rest}}if(!l)break}if(t?.signal?.throwIfAborted(),s.length!==0)throw new kn(`Could not resolve path /${s.join("/")} under\
 ${r}`)}function YC(r){return r[Symbol.asyncIterator]!=null}function ZC(r){if(YC(r))return(async()=>{let t;for await(const n of r)
t=n;return t})();let e;for(const t of r)e=t;return e}async function Yf(r,e,t,n,s){const i=await Pt(n.get(r,s)),o=Tb(i);return{
type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}async function e3(r,e,t,n,s){const i=await Pt(
n.get(r,s)),o=Pb(i);return{type:"object",cid:r,name:e,path:t,object:o,node:i,size:BigInt(i.byteLength)}}function nu(r,e,t,n){
const s=BigInt(r.length),i=BigInt(e+s);return t>=i||n<e?new Uint8Array(0):(n>=e&&n<i&&(r=r.subarray(0,Number(n-e))),t>=e&&
t<i&&(r=r.subarray(Number(t-e))),r)}const Gb=(r,e=0,t=r)=>{const n=BigInt(r),s=BigInt(e??0);let i=BigInt(t);if(i!==n&&(i=
s+i),i>n&&(i=n),s<0n)throw new zs("Offset must be greater than or equal to 0");if(s>n)throw new zs("Offset must be less \
than the file size");if(i<0n)throw new zs("Length must be greater than or equal to 0");if(i>n)throw new zs("Length must \
be less than the file size");return{start:s,end:i}};function Wb(r,e){async function*t(n={}){const{start:s,end:i}=Gb(r.length,
n.offset,n.length),o=nu(r,0n,s,i);n.onProgress?.(new tr(e,{bytesRead:BigInt(o.byteLength),totalBytes:i-s,fileSize:BigInt(
r.byteLength)})),yield o}return t}async function t3(r,e,t,n,s){const i=mb(r.multihash.bytes);return{type:"identity",cid:r,
name:e,path:t,content:Wb(i.digest,"unixfs:exporter:progress:identity"),size:BigInt(i.bytes.byteLength),node:i.bytes}}async function r3(r,e,t,n,s){
const i=await Pt(n.get(r,s)),o=Nb(i);return{type:"object",cid:r,name:e,path:t,object:o,size:BigInt(i.byteLength),node:i}}
async function n3(r,e,t,n,s){const i=await Pt(n.get(r,s));return{type:"raw",cid:r,name:e,path:t,content:Wb(i,"unixfs:exp\
orter:progress:raw"),size:BigInt(i.length),node:i}}function s3(r,e,t,n){async function*s(i={}){const o=i.offset??0,a=i.length??
e.Links.length,c=e.Links.slice(o,o+a);i.onProgress?.(new tr("unixfs:exporter:walk:directory",{cid:r})),yield*c.map(l=>({
cid:l.Hash,name:l.Name??"",path:`${n}/${l.Name??""}`,size:BigInt(l.Tsize??0)}))}return s}function i3(r){const[e,t]=r[Symbol.
asyncIterator]!=null?[r[Symbol.asyncIterator](),Symbol.asyncIterator]:[r[Symbol.iterator](),Symbol.iterator],n=[];return{
peek:()=>e.next(),push:s=>{n.push(s)},next:()=>n.length>0?{done:!1,value:n.shift()}:e.next(),[t](){return this}}}function o3(r){
return r[Symbol.asyncIterator]!=null}function a3(r,e){let t=0;if(o3(r))return(async function*(){for await(const c of r)yield e(
c,t++)})();const n=i3(r),{value:s,done:i}=n.next();if(i===!0)return(function*(){})();const o=e(s,t++);if(typeof o.then==
"function")return(async function*(){yield await o;for(const c of n)yield e(c,t++)})();const a=e;return(function*(){yield o;
for(const c of n)yield a(c,t++)})()}function Lt(){const r={};return r.promise=new Promise((e,t)=>{r.resolve=e,r.reject=t}),
r}const Wi=globalThis.CustomEvent??Event;async function*c3(r,e={}){let t=e.concurrency??1/0;t<1&&(t=1/0);const n=e.ordered??
!1,s=new EventTarget,i=[];let o=Lt(),a=Lt(),c=!1,l,u=!1,h=!1;s.addEventListener("task-complete",()=>{a.resolve()}),Promise.
resolve().then(async()=>{try{for await(const y of r){if(i.length===t&&(o=Lt(),await o.promise),u||h)break;const b={done:!1};
i.push(b),y().then(f=>{b.done=!0,b.ok=!0,b.value=f,s.dispatchEvent(new Wi("task-complete"))},f=>{b.done=!0,b.err=f,s.dispatchEvent(
new Wi("task-complete"))})}c=!0,s.dispatchEvent(new Wi("task-complete"))}catch(y){l=y,s.dispatchEvent(new Wi("task-compl\
ete"))}});function d(){return n?i[0]?.done:!!i.find(y=>y.done)}function*p(){for(;i.length>0&&i[0].done;){const y=i[0];if(i.
shift(),y.ok)yield y.value;else throw u=!0,o.resolve(),y.err;o.resolve()}}function*m(){for(;d();)for(let y=0;y<i.length;y++)
if(i[y].done){const b=i[y];if(i.splice(y,1),y--,b.ok)yield b.value;else throw u=!0,o.resolve(),b.err;o.resolve()}}try{for(;;){
if(d()||(a=Lt(),await a.promise),l!=null||(n?yield*p():yield*m(),l!=null))throw l;if(c&&i.length===0)break}}finally{h=!0,
o.resolve()}}let Zf=class{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&e)!==0)throw new Error("Max size for a\
 FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.top=0,this.btm=0,this.next=null}push(e){
return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.top+1&this.mask,!0)}shift(){const e=this.
buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.btm+1&this.mask,e}isEmpty(){return this.
buffer[this.btm]===void 0}},$c=class{size;hwm;head;tail;constructor(e={}){this.hwm=e.splitLimit??16,this.head=new Zf(this.
hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?e.byteLength:1}push(e){if(e?.value!=null&&
(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;this.head=t.next=new Zf(2*this.head.buffer.
length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.tail.next!=null){const t=this.tail.next;this.
tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.size-=this.calculateSize(e.value)),e}isEmpty(){
return this.head.isEmpty()}},l3=class extends Error{type;code;constructor(e,t){super(e??"The operation was aborted"),this.
type="aborted",this.code=t??"ABORT_ERR"}};function Vb(r={}){return u3(t=>{const n=t.shift();if(n==null)return{done:!0};if(n.
error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function u3(r,e){e=e??{};let t=e.onEnd,n=new $c,s,i,
o,a=Lt();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((b,f)=>{i=g=>{i=null,n.push(g);try{b(r(n))}catch(w){
f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=Lt()})}},l=b=>i!=null?i(b):(n.push(b),s),u=b=>(n=
new $c,i!=null?i({error:b}):(n.push({error:b}),s)),h=b=>{if(o)return s;if(e?.objectMode!==!0&&b?.byteLength==null)throw new Error(
"objectMode was not true but tried to push non-Uint8Array value");return l({done:!1,value:b})},d=b=>o?s:(o=!0,b!=null?u(
b):l({done:!0})),p=()=>(n=new $c,d(),{done:!0}),m=b=>(d(b),{done:!0});if(s={[Symbol.asyncIterator](){return this},next:c,
return:p,throw:m,push:h,end:d,get readableLength(){return n.size},onEmpty:async b=>{const f=b?.signal;if(f?.throwIfAborted(),
n.isEmpty())return;let g,w;f!=null&&(g=new Promise((k,x)=>{w=()=>{x(new l3)},f.addEventListener("abort",w)}));try{await Promise.
race([a.promise,g])}finally{w!=null&&f!=null&&f?.removeEventListener("abort",w)}}},t==null)return s;const y=s;return s={
[Symbol.asyncIterator](){return this},next(){return y.next()},throw(b){return y.throw(b),t!=null&&(t(b),t=void 0),{done:!0}},
return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:h,end(b){return y.end(b),t!=null&&(t(b),t=void 0),s},
get readableLength(){return y.readableLength},onEmpty:b=>y.onEmpty(b)},s}function d3(r){return r.reason}function Hb(r,e,t){
if(e==null||r==null)return r;const n=t?.translateError??d3;if(e.aborted)return r.catch(()=>{}),Promise.reject(n(e));let s;
return Promise.race([r,new Promise((i,o)=>{s=()=>{o(n(e))},e.addEventListener("abort",s)})]).finally(()=>{s!=null&&e.removeEventListener(
"abort",s)})}class h3{readNext;haveNext;ended;nextResult;error;constructor(){this.ended=!1,this.readNext=Lt(),this.haveNext=
Lt()}[Symbol.asyncIterator](){return this}async next(){if(this.nextResult==null&&await this.haveNext.promise,this.nextResult==
null)throw new Error("HaveNext promise resolved but nextResult was undefined");const e=this.nextResult;return this.nextResult=
void 0,this.readNext.resolve(),this.readNext=Lt(),e}async throw(e){return this.ended=!0,this.error=e,e!=null&&(this.haveNext.
promise.catch(()=>{}),this.haveNext.reject(e)),{done:!0,value:void 0}}async return(){const e={done:!0,value:void 0};return this.
ended=!0,this.nextResult=e,this.haveNext.resolve(),e}async push(e,t){await this._push(e,t)}async end(e,t){e!=null?await this.
throw(e):await this._push(void 0,t)}async _push(e,t){if(e!=null&&this.ended)throw this.error??new Error("Cannot push val\
ue onto an ended pushable");for(;this.nextResult!=null;)await this.readNext.promise;e!=null?this.nextResult={done:!1,value:e}:
(this.ended=!0,this.nextResult={done:!0,value:void 0}),this.haveNext.resolve(),this.haveNext=Lt(),await Hb(this.readNext.
promise,t?.signal,t)}}function f3(){return new h3}function p3(r){return r[Symbol.asyncIterator]!=null}async function m3(r,e,t){
try{await Promise.all(r.map(async n=>{for await(const s of n)await e.push(s,{signal:t}),t.throwIfAborted()})),await e.end(
void 0,{signal:t})}catch(n){await e.end(n,{signal:t}).catch(()=>{})}}async function*g3(r){const e=new AbortController,t=f3();
m3(r,t,e.signal).catch(()=>{});try{yield*t}finally{e.abort()}}function*b3(r){for(const e of r)yield*e}function y3(...r){
const e=[];for(const t of r)p3(t)||e.push(t);return e.length===r.length?b3(e):g3(r)}function Kb(r,...e){if(r==null)throw new Error(
"Empty pipeline");if(Nc(r)){const n=r;r=()=>n.source}else if(Jb(r)||Qb(r)){const n=r;r=()=>n}const t=[r,...e];if(t.length>
1&&Nc(t[t.length-1])&&(t[t.length-1]=t[t.length-1].sink),t.length>2)for(let n=1;n<t.length-1;n++)Nc(t[n])&&(t[n]=k3(t[n]));
return w3(...t)}const w3=(...r)=>{let e;for(;r.length>0;)e=r.shift()(e);return e},Qb=r=>r?.[Symbol.asyncIterator]!=null,
Jb=r=>r?.[Symbol.iterator]!=null,Nc=r=>r==null?!1:r.sink!=null&&r.source!=null,k3=r=>e=>{const t=r.sink(e);if(t?.then!=null){
const n=Vb({objectMode:!0});t.then(()=>{n.end()},o=>{n.end(o)});let s;const i=r.source;if(Qb(i))s=async function*(){yield*i,
n.end()};else if(Jb(i))s=function*(){yield*i,n.end()};else throw new Error("Unknown duplex source type - must be Iterabl\
e or AsyncIterable");return y3(n,s())}return r.source};class ep{buffer;mask;top;btm;next;constructor(e){if(!(e>0)||(e-1&
e)!==0)throw new Error("Max size for a FixedFIFO should be a power of two");this.buffer=new Array(e),this.mask=e-1,this.
top=0,this.btm=0,this.next=null}push(e){return this.buffer[this.top]!==void 0?!1:(this.buffer[this.top]=e,this.top=this.
top+1&this.mask,!0)}shift(){const e=this.buffer[this.btm];if(e!==void 0)return this.buffer[this.btm]=void 0,this.btm=this.
btm+1&this.mask,e}isEmpty(){return this.buffer[this.btm]===void 0}}class Uc{size;hwm;head;tail;constructor(e={}){this.hwm=
e.splitLimit??16,this.head=new ep(this.hwm),this.tail=this.head,this.size=0}calculateSize(e){return e?.byteLength!=null?
e.byteLength:1}push(e){if(e?.value!=null&&(this.size+=this.calculateSize(e.value)),!this.head.push(e)){const t=this.head;
this.head=t.next=new ep(2*this.head.buffer.length),this.head.push(e)}}shift(){let e=this.tail.shift();if(e===void 0&&this.
tail.next!=null){const t=this.tail.next;this.tail.next=null,this.tail=t,e=this.tail.shift()}return e?.value!=null&&(this.
size-=this.calculateSize(e.value)),e}isEmpty(){return this.head.isEmpty()}}let E3=class extends Error{type;code;constructor(e,t){
super(e??"The operation was aborted"),this.type="aborted",this.code=t??"ABORT_ERR"}};function x3(r={}){return v3(t=>{const n=t.
shift();if(n==null)return{done:!0};if(n.error!=null)throw n.error;return{done:n.done===!0,value:n.value}},r)}function v3(r,e){
e=e??{};let t=e.onEnd,n=new Uc,s,i,o,a=Lt();const c=async()=>{try{return n.isEmpty()?o?{done:!0}:await new Promise((b,f)=>{
i=g=>{i=null,n.push(g);try{b(r(n))}catch(w){f(w)}return s}}):r(n)}finally{n.isEmpty()&&queueMicrotask(()=>{a.resolve(),a=
Lt()})}},l=b=>i!=null?i(b):(n.push(b),s),u=b=>(n=new Uc,i!=null?i({error:b}):(n.push({error:b}),s)),h=b=>{if(o)return s;
if(e?.objectMode!==!0&&b?.byteLength==null)throw new Error("objectMode was not true but tried to push non-Uint8Array val\
ue");return l({done:!1,value:b})},d=b=>o?s:(o=!0,b!=null?u(b):l({done:!0})),p=()=>(n=new Uc,d(),{done:!0}),m=b=>(d(b),{done:!0});
if(s={[Symbol.asyncIterator](){return this},next:c,return:p,throw:m,push:h,end:d,get readableLength(){return n.size},onEmpty:async b=>{
const f=b?.signal;if(f?.throwIfAborted(),n.isEmpty())return;let g,w;f!=null&&(g=new Promise((k,x)=>{w=()=>{x(new E3)},f.
addEventListener("abort",w)}));try{await Promise.race([a.promise,g])}finally{w!=null&&f!=null&&f?.removeEventListener("a\
bort",w)}}},t==null)return s;const y=s;return s={[Symbol.asyncIterator](){return this},next(){return y.next()},throw(b){
return y.throw(b),t!=null&&(t(b),t=void 0),{done:!0}},return(){return y.return(),t!=null&&(t(),t=void 0),{done:!0}},push:h,
end(b){return y.end(b),t!=null&&(t(b),t=void 0),s},get readableLength(){return y.readableLength},onEmpty:b=>y.onEmpty(b)},
s}var Fc={exports:{}},tp;function S3(){return tp||(tp=1,(function(r){var e=Object.prototype.hasOwnProperty,t="~";function n(){}
Object.create&&(n.prototype=Object.create(null),new n().__proto__||(t=!1));function s(c,l,u){this.fn=c,this.context=l,this.
once=u||!1}function i(c,l,u,h,d){if(typeof u!="function")throw new TypeError("The listener must be a function");var p=new s(
u,h||c,d),m=t?t+l:l;return c._events[m]?c._events[m].fn?c._events[m]=[c._events[m],p]:c._events[m].push(p):(c._events[m]=
p,c._eventsCount++),c}function o(c,l){--c._eventsCount===0?c._events=new n:delete c._events[l]}function a(){this._events=
new n,this._eventsCount=0}a.prototype.eventNames=function(){var l=[],u,h;if(this._eventsCount===0)return l;for(h in u=this.
_events)e.call(u,h)&&l.push(t?h.slice(1):h);return Object.getOwnPropertySymbols?l.concat(Object.getOwnPropertySymbols(u)):
l},a.prototype.listeners=function(l){var u=t?t+l:l,h=this._events[u];if(!h)return[];if(h.fn)return[h.fn];for(var d=0,p=h.
length,m=new Array(p);d<p;d++)m[d]=h[d].fn;return m},a.prototype.listenerCount=function(l){var u=t?t+l:l,h=this._events[u];
return h?h.fn?1:h.length:0},a.prototype.emit=function(l,u,h,d,p,m){var y=t?t+l:l;if(!this._events[y])return!1;var b=this.
_events[y],f=arguments.length,g,w;if(b.fn){switch(b.once&&this.removeListener(l,b.fn,void 0,!0),f){case 1:return b.fn.call(
b.context),!0;case 2:return b.fn.call(b.context,u),!0;case 3:return b.fn.call(b.context,u,h),!0;case 4:return b.fn.call(
b.context,u,h,d),!0;case 5:return b.fn.call(b.context,u,h,d,p),!0;case 6:return b.fn.call(b.context,u,h,d,p,m),!0}for(w=
1,g=new Array(f-1);w<f;w++)g[w-1]=arguments[w];b.fn.apply(b.context,g)}else{var k=b.length,x;for(w=0;w<k;w++)switch(b[w].
once&&this.removeListener(l,b[w].fn,void 0,!0),f){case 1:b[w].fn.call(b[w].context);break;case 2:b[w].fn.call(b[w].context,
u);break;case 3:b[w].fn.call(b[w].context,u,h);break;case 4:b[w].fn.call(b[w].context,u,h,d);break;default:if(!g)for(x=1,
g=new Array(f-1);x<f;x++)g[x-1]=arguments[x];b[w].fn.apply(b[w].context,g)}}return!0},a.prototype.on=function(l,u,h){return i(
this,l,u,h,!1)},a.prototype.once=function(l,u,h){return i(this,l,u,h,!0)},a.prototype.removeListener=function(l,u,h,d){var p=t?
t+l:l;if(!this._events[p])return this;if(!u)return o(this,p),this;var m=this._events[p];if(m.fn)m.fn===u&&(!d||m.once)&&
(!h||m.context===h)&&o(this,p);else{for(var y=0,b=[],f=m.length;y<f;y++)(m[y].fn!==u||d&&!m[y].once||h&&m[y].context!==h)&&
b.push(m[y]);b.length?this._events[p]=b.length===1?b[0]:b:o(this,p)}return this},a.prototype.removeAllListeners=function(l){
var u;return l?(u=t?t+l:l,this._events[u]&&o(this,u)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.
removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=t,a.EventEmitter=a,r.exports=a})(Fc)),Fc.exports}var A3=S3();
const _3=tb(A3);let I3=class Xb extends Error{name="TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(
this,Xb)}};const rp=r=>r.reason??new DOMException("This operation was aborted.","AbortError");function C3(r,e){const{milliseconds:t,
fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const u=new Promise((h,d)=>{if(typeof t!=
"number"||Math.sign(t)!==1)throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${t}\``);if(o?.
aborted){d(rp(o));return}if(o&&(c=()=>{d(rp(o))},o.addEventListener("abort",c,{once:!0})),r.then(h,d),t===Number.POSITIVE_INFINITY)
return;const p=new I3;a=i.setTimeout.call(void 0,()=>{if(n){try{h(n())}catch(m){d(m)}return}typeof r.cancel=="function"&&
r.cancel(),s===!1?h():s instanceof Error?d(s):(p.message=s??`Promise timed out after ${t} milliseconds`,d(p))},t)}).finally(
()=>{u.clear(),c&&o&&o.removeEventListener("abort",c)});return u.clear=()=>{i.clearTimeout.call(void 0,a),a=void 0},u}function T3(r,e,t){
let n=0,s=r.length;for(;s>0;){const i=Math.trunc(s/2);let o=n+i;t(r[o],e)<=0?(n=++o,s-=i+1):s=i}return n}const M3=100;class np{#e=[];#r=0;enqueue(e,t){
const{priority:n=0,id:s}=t??{},{size:i}=this,o={priority:n,id:s,run:e};if(i===0){this.#e.length=0,this.#r=0,this.#e.push(
o);return}if(this.#e.at(-1).priority>=n){this.#e.push(o);return}this.#n();const a=T3(this.#e,o,(c,l)=>l.priority-c.priority);
this.#e.splice(a,0,o)}setPriority(e,t){const n=this.#e.findIndex((i,o)=>o>=this.#r&&i.id===e);if(n===-1)throw new ReferenceError(
`No promise function with the id "${e}" exists in the queue.`);const[s]=this.#e.splice(n,1);this.enqueue(s.run,{priority:t,
id:e})}remove(e){const t=this.#e.findIndex((n,s)=>s<this.#r?!1:typeof e=="string"?n.id===e:n.run===e);t!==-1&&this.#e.splice(
t,1)}dequeue(){if(this.#r===this.#e.length)return;const e=this.#e[this.#r];return this.#r++,this.#r===this.#e.length?(this.#e.
length=0,this.#r=0):this.#r>M3&&this.#r>this.#e.length/2&&this.#n(),e?.run}filter(e){const t=[];for(let n=this.#r;n<this.#e.
length;n++){const s=this.#e[n];s.priority===e.priority&&t.push(s.run)}return t}get size(){return this.#e.length-this.#r}#n(){
this.#r!==0&&(this.#e.splice(0,this.#r),this.#r=0)}}class R3 extends _3{#e;#r;#n=0;#d;#p=!1;#b=!1;#u;#h=0;#a;#f;#c;#i=[];#o=0;#t;#w;#s=0;#m;#l;#B=1n;#k=new Map;#x=new Set;timeout;constructor(e){
if(super(),e={carryoverIntervalCount:!1,intervalCap:Number.POSITIVE_INFINITY,interval:0,concurrency:Number.POSITIVE_INFINITY,
autoStart:!0,queueClass:np,strict:!1,...e},!(typeof e.intervalCap=="number"&&e.intervalCap>=1))throw new TypeError(`Expe\
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
try{try{t.signal?.throwIfAborted()}catch(d){throw this.#z(),this.#k.delete(i),d}let u=e({signal:t.signal});if(t.timeout!==
void 0&&(u=C3(Promise.resolve(u),{milliseconds:t.timeout,message:`Task timed out after ${t.timeout}ms (queue has ${this.#s}\
 running, ${this.#t.size} waiting)`})),t.signal){const{signal:d}=t;u=Promise.race([u,new Promise((p,m)=>{l=()=>{m(d.reason)},
d.addEventListener("abort",l,{once:!0}),d.aborted&&l()})])}const h=await u;n(h),this.emit("completed",h)}catch(u){s(u),this.
emit("error",u)}finally{l&&t.signal?.removeEventListener("abort",l),this.#k.delete(i),queueMicrotask(()=>{this.#N()})}};
this.#t.enqueue(a,t);const c=()=>{if(this.#t instanceof np){this.#t.remove(a);return}this.#t.remove?.(t.id)};if(t.signal){
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
map(e=>({...e,timeoutRemaining:e.timeout?Math.max(0,e.startTime+e.timeout-Date.now()):void 0}))}}async function Yb(r,e,t,n,s,i,o){
if(e instanceof Uint8Array){const l=nu(e,n,s,i);t.push(l);return}if(e.Data==null)throw new Pe("no data in PBNode");let a;
try{a=dt.unmarshal(e.Data)}catch(l){throw new Pe(l.message)}if(a.data!=null){const l=a.data,u=nu(l,n,s,i);t.push(u),n+=BigInt(
u.byteLength)}const c=[];if(e.Links.length!==a.blockSizes.length)throw new Pe("Inconsistent block sizes and dag links");
for(let l=0;l<e.Links.length;l++){const u=e.Links[l],h=n,d=h+a.blockSizes[l];if((s>=h&&s<d||i>=h&&i<=d||s<h&&i>d)&&c.push(
{link:u,blockStart:n}),n=d,n>i)break}await Kb(c,l=>a3(l,u=>async()=>{const h=await Pt(r.get(u.link.Hash,o));return{...u,
block:h}}),l=>c3(l,{ordered:!0,concurrency:o.blockReadConcurrency??UC}),async l=>{for await(const{link:u,block:h,blockStart:d}of l){
let p;switch(u.Hash.code){case _i:p=ui(h);break;case wd:p=h;break;default:t.end(new Pe(`Unsupported codec: ${u.Hash.code}`));
return}const m=new R3({concurrency:1});m.on("error",y=>{t.end(y)}),m.add(async()=>{o.onProgress?.(new tr("unixfs:exporte\
r:walk:file",{cid:u.Hash})),await Yb(r,p,t,d,s,i,o)}),await m.onIdle()}}),n>=i&&t.end()}function sp(r,e,t,n,s){async function*i(o={}){
const a=t.fileSize();if(a===void 0)throw new Error("File was a directory");const{start:c,end:l}=Gb(a,o.offset,o.length);
if(l===0n)return;let u=0n;const h=l-c,d=x3();o.onProgress?.(new tr("unixfs:exporter:walk:file",{cid:r})),Yb(s,e,d,0n,c,l,
o).catch(p=>{d.end(p)});for await(const p of d)if(p!=null){if(u+=BigInt(p.byteLength),u>h)throw d.end(),new Zo("Read too\
 many bytes - the file size reported by the UnixFS data in the root node may be incorrect");u===h&&d.end(),o.onProgress?.(
new tr("unixfs:exporter:progress:unixfs:file",{bytesRead:u,totalBytes:h,fileSize:a})),yield p}if(u<h)throw new ea("Trave\
rsed entire DAG but did not read enough bytes")}return i}async function*B3(r,e,t,n){let s=-1,i=0;for await(const o of Zb(
r,e,t,n))if(s++,!(n.offset!=null&&n.offset<s)&&(yield o,i++,n.length!=null&&n.length===i))return}async function*Zb(r,e,t,n){
const s=await Pt(t.get(r,n)),i=hi.decode(s);if(i.data?.fanOut==null)throw new Pe("missing fanout");const o=(i.data.fanOut-
1n).toString(16).length;for(const a of i.links){if(a.name==null||a.hash==null)continue;const c=pn.decode(a.hash);if(a.name.
length===o)yield*Zb(c,e,t,n);else{const l=a.name.substring(o);yield{cid:c,name:a.name.substring(o),path:`${e}/${l}`,size:BigInt(
a.tSize??0)}}}}function L3(r,e,t,n,s){function i(o={}){return o.onProgress?.(new tr("unixfs:exporter:walk:hamt-sharded-d\
irectory",{cid:r})),B3(r,n,s,o)}return i}const D3={raw:sp,file:sp,directory:s3,"hamt-sharded-directory":L3,metadata:(r,e,t,n)=>()=>[],
symlink:(r,e,t,n)=>()=>[]};async function P3(r,e,t,n,s){const i=await Pt(n.get(r,s));let o;try{o=ui(i)}catch(l){throw new Pe(
l.message)}if(o.Data==null)throw new Pe("no data in PBNode");let a;try{a=dt.unmarshal(o.Data)}catch(l){throw new Pe(l.message)}
const c=D3[a.type](r,o,a,t,n);if(c==null)throw new kn("could not find content exporter");return a.isDirectory()?{type:"d\
irectory",cid:r,name:e,path:t,entries:c,unixfs:a,node:o,size:BigInt(i.byteLength)}:{type:"file",cid:r,name:e,path:t,content:c,
unixfs:a,node:o,size:a.fileSize()}}const $3={[_i]:P3,[wd]:n3,[Cb]:Yf,[Fb]:Yf,[Db]:e3,[Ub.code]:t3,[$b]:r3};async function ip(r,e,t={}){
let n,s;if(r instanceof String||typeof r=="string"){const o=await ZC(XC(r,e,t));if(o==null)throw new kn(`Could not walk \
path to ${r}`);n=o.cid,s=o.name,r=o.path}else if(pn.asCID(r)===r||r instanceof pn)n=r,s=r=n.toString();else throw new zs(
"Path must be string or CID");const i=$3[n.code];if(i==null)throw new bi(`No resolver for code ${n.code}`);return i(n,s,
r,e,t)}function su(r){if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return ap(r);if(r instanceof ArrayBuffer)
return new Uint8Array(r);if(ArrayBuffer.isView(r))return ap(new Uint8Array(r.buffer,r.byteOffset,r.byteLength));throw new Error(
"Unknown type, must be binary type")}function N3(r){const e=new Uint8Array(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}const op=4096;function U3(r){const e=r.length;if(e<=op)return String.fromCharCode.apply(String,r);let t="",n=0;
for(;n<e;)t+=String.fromCharCode.apply(String,r.subarray(n,n+=op));return t}function F3(r){return r?.buffer instanceof ArrayBuffer}
function ap(r){return F3(r)?r:r.slice()}function O3(r,e,t){if(r.length>=255)throw new TypeError("Alphabet too long");for(var n=new Uint8Array(
256),s=0;s<n.length;s++)n[s]=255;for(var i=0;i<r.length;i++){var o=r.charAt(i),a=o.charCodeAt(0);if(n[a]!==255)throw new TypeError(
o+" is ambiguous");if(n[a]=i,t){var c=o.toLowerCase().charCodeAt(0),l=o.toUpperCase().charCodeAt(0);c!==a&&(n[c]=i),l!==
a&&(n[l]=i)}}var u=r.length,h=r.charAt(0),d=Math.log(u)/Math.log(256),p=Math.log(256)/Math.log(u);function m(f){if(f instanceof
Uint8Array||(ArrayBuffer.isView(f)?f=new Uint8Array(f.buffer,f.byteOffset,f.byteLength):Array.isArray(f)&&(f=Uint8Array.
from(f))),!(f instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(f.length===0)return"";for(var g=0,w=0,
k=0,x=f.length;k!==x&&f[k]===0;)k++,g++;for(var A=(x-k)*p+1>>>0,v=new Uint8Array(A);k!==x;){for(var E=f[k],C=0,I=A-1;(E!==
0||C<w)&&I!==-1;I--,C++)E+=256*v[I]>>>0,v[I]=E%u>>>0,E=E/u>>>0;if(E!==0)throw new Error("Non-zero carry");w=C,k++}for(var M=A-
w;M!==A&&v[M]===0;)M++;for(var R=h.repeat(g);M<A;++M)R+=r.charAt(v[M]);return R}function y(f){if(typeof f!="string")throw new TypeError(
"Expected String");if(f.length===0)return new Uint8Array;var g=0;if(f[g]!==" "){for(var w=0,k=0;f[g]===h;)w++,g++;for(var x=(f.
length-g)*d+1>>>0,A=new Uint8Array(x);f[g];){var v=n[f.charCodeAt(g)];if(v===255)return;for(var E=0,C=x-1;(v!==0||E<k)&&
C!==-1;C--,E++)v+=u*A[C]>>>0,A[C]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");k=E,g++}if(f[g]!==" "){
for(var I=x-k;I!==x&&A[I]===0;)I++;for(var M=new Uint8Array(w+(x-I)),R=w;I!==x;)M[R++]=A[I++];return M}}}function b(f){var g=y(
f);if(g)return g;throw new Error(`Non-${e} character`)}return{encode:m,decodeUnsafe:y,decode:b}}var z3=O3,q3=z3;class j3{name;prefix;baseEncode;constructor(e,t,n){
this.name=e,this.prefix=t,this.baseEncode=n}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(
e)}`;throw Error("Unknown type, must be binary type")}}class G3{name;prefix;baseDecode;prefixCodePoint;constructor(e,t,n){
this.name=e,this.prefix=t;const s=t.codePointAt(0);if(s===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=
s,this.baseDecode=n}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to d\
ecode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.
baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return ey(this,e)}}class W3{decoders;constructor(e){
this.decoders=e}or(e){return ey(this,e)}decode(e){const t=e[0],n=this.decoders[t];if(n!=null)return n.decode(e);throw RangeError(
`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are sup\
ported`)}}function ey(r,e){return new W3({...r.decoders??{[r.prefix]:r},...e.decoders??{[e.prefix]:e}})}class V3{name;prefix;baseEncode;baseDecode;encoder;decoder;constructor(e,t,n,s){
this.name=e,this.prefix=t,this.baseEncode=n,this.baseDecode=s,this.encoder=new j3(e,t,n),this.decoder=new G3(e,t,s)}encode(e){
return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function Ha({name:r,prefix:e,encode:t,decode:n}){
return new V3(r,e,t,n)}function Li({name:r,prefix:e,alphabet:t,caseInsensitive:n=!1}){const{encode:s,decode:i}=q3(t,r,n);
return Ha({prefix:e,name:r,encode:s,decode:o=>su(i(o))})}function H3(r,e,t,n){let s=r.length;for(;r[s-1]==="=";)--s;const i=new Uint8Array(
s*t/8|0);let o=0,a=0,c=0;for(let l=0;l<s;++l){const u=e[r[l]];if(u===void 0)throw new SyntaxError(`Non-${n} character`);
a=a<<t|u,o+=t,o>=8&&(o-=8,i[c++]=255&a>>o)}if(o>=t||(255&a<<8-o)!==0)throw new SyntaxError("Unexpected end of data");return i}
function K3(r,e,t){const n=e[e.length-1]==="=",s=(1<<t)-1;let i="",o=0,a=0;for(let c=0;c<r.length;++c)for(a=a<<8|r[c],o+=
8;o>t;)o-=t,i+=e[s&a>>o];if(o!==0&&(i+=e[s&a<<t-o]),n)for(;(i.length*t&7)!==0;)i+="=";return i}function Q3(r,e){const t={};
for(let n=0;n<r.length;++n)if(t[r[n]]=n,e){const s=r[n].toLowerCase(),i=r[n].toUpperCase();s!==r[n]&&(t[s]=n),i!==r[n]&&
(t[i]=n)}return t}function Ge({name:r,prefix:e,bitsPerChar:t,alphabet:n,caseInsensitive:s=!1}){const i=Q3(n,s);return Ha(
{prefix:e,name:r,encode(o){return K3(o,n,t)},decode(o){return H3(o,i,t,r)}})}const J3=Li({prefix:"9",name:"base10",alphabet:"\
0123456789"}),X3=Object.freeze(Object.defineProperty({__proto__:null,base10:J3},Symbol.toStringTag,{value:"Module"})),Y3=Ge(
{prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Z3=Ge({prefix:"F",name:"base16u\
pper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),e5=Object.freeze(Object.defineProperty({__proto__:null,
base16:Y3,base16upper:Z3},Symbol.toStringTag,{value:"Module"})),t5=Ge({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),
r5=Object.freeze(Object.defineProperty({__proto__:null,base2:t5},Symbol.toStringTag,{value:"Module"})),ty=Array.from("🚀\
🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌\
😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠\
☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖\
👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍\
📣🥂"),n5=ty.reduce((r,e,t)=>(r[t]=e,r),[]),s5=ty.reduce((r,e,t)=>{const n=e.codePointAt(0);if(n==null)throw new Error(
`Invalid character: ${e}`);return r[n]=t,r},[]);function i5(r){return r.reduce((e,t)=>(e+=n5[t],e),"")}function o5(r){const e=[];
for(const t of r){const n=t.codePointAt(0);if(n==null)throw new Error(`Invalid character: ${t}`);const s=s5[n];if(s==null)
throw new Error(`Non-base256emoji character: ${t}`);e.push(s)}return new Uint8Array(e)}const a5=Ha({prefix:"🚀",name:"\
base256emoji",encode:i5,decode:o5}),c5=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:a5},Symbol.toStringTag,
{value:"Module"})),l5=Ge({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),
u5=Ge({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),d5=Ge(
{prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),h5=Ge({prefix:"\
C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),f5=Ge({prefix:"\
v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),p5=Ge({prefix:"V",name:"\
base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),m5=Ge({prefix:"t",name:"b\
ase32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),g5=Ge({prefix:"T",name:"bas\
e32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),b5=Ge({prefix:"h",name:"\
base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),y5=Object.freeze(Object.defineProperty({__proto__:null,
base32:l5,base32hex:f5,base32hexpad:m5,base32hexpadupper:g5,base32hexupper:p5,base32pad:d5,base32padupper:h5,base32upper:u5,
base32z:b5},Symbol.toStringTag,{value:"Module"})),w5=Li({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqr\
stuvwxyz",caseInsensitive:!0}),k5=Li({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),
E5=Object.freeze(Object.defineProperty({__proto__:null,base36:w5,base36upper:k5},Symbol.toStringTag,{value:"Module"})),x5=Li(
{name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),v5=Li({name:"base58\
flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),S5=Object.freeze(Object.defineProperty(
{__proto__:null,base58btc:x5,base58flickr:v5},Symbol.toStringTag,{value:"Module"})),A5=Ge({prefix:"m",name:"base64",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),_5=Ge({prefix:"M",name:"base64pad",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),I5=Ge({prefix:"u",name:"base64url",alphabet:"\
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),C5=Ge({prefix:"U",name:"base64urlpad",
alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),T5=Object.freeze(Object.defineProperty(
{__proto__:null,base64:A5,base64pad:_5,base64url:I5,base64urlpad:C5},Symbol.toStringTag,{value:"Module"})),M5=Ge({prefix:"\
7",name:"base8",alphabet:"01234567",bitsPerChar:3}),R5=Object.freeze(Object.defineProperty({__proto__:null,base8:M5},Symbol.
toStringTag,{value:"Module"})),B5=Ha({prefix:"\0",name:"identity",encode:r=>U3(su(r)),decode:r=>su(N3(r))}),L5=Object.freeze(
Object.defineProperty({__proto__:null,identity:B5},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;
const cp={...L5,...r5,...R5,...X3,...e5,...y5,...E5,...S5,...T5,...c5};function D5(r=0){return new Uint8Array(r)}function ry(r,e,t,n){
return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:n}}}const lp=ry("utf8","u",r=>"u"+new TextDecoder(
"utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Oc=ry("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)
e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=D5(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(
t);return e}),ny={utf8:lp,"utf-8":lp,hex:cp.base16,latin1:Oc,ascii:Oc,binary:Oc,...cp};function P5(r,e="utf8"){const t=ny[e];
if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${r}`)}function $5(r,e="ut\
f8"){const t=ny[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(r).substring(1)}const dr="\
/",sy=new TextEncoder().encode(dr),Vi=sy[0];class mt{_buf;constructor(e,t){if(typeof e=="string")this._buf=P5(e);else if(e instanceof
Uint8Array)this._buf=e;else throw new Error("Invalid key, should be String of Uint8Array");if(t==null&&(t=!0),t&&this.clean(),
this._buf.byteLength===0||this._buf[0]!==Vi)throw new Error("Invalid key")}toString(e="utf8"){return $5(this._buf,e)}uint8Array(){
return this._buf}get[Symbol.toStringTag](){return`Key(${this.toString()})`}static withNamespaces(e){return new mt(e.join(
dr))}static random(){return new mt(Math.random().toString().substring(2))}static asKey(e){return e instanceof Uint8Array||
typeof e=="string"?new mt(e):typeof e.uint8Array=="function"?new mt(e.uint8Array()):null}clean(){if((this._buf==null||this.
_buf.byteLength===0)&&(this._buf=sy),this._buf[0]!==Vi){const e=new Uint8Array(this._buf.byteLength+1);e.fill(Vi,0,1),e.
set(this._buf,1),this._buf=e}for(;this._buf.byteLength>1&&this._buf[this._buf.byteLength-1]===Vi;)this._buf=this._buf.subarray(
0,-1)}less(e){const t=this.list(),n=e.list();for(let s=0;s<t.length;s++){if(n.length<s+1)return!1;const i=t[s],o=n[s];if(i<
o)return!0;if(i>o)return!1}return t.length<n.length}reverse(){return mt.withNamespaces(this.list().slice().reverse())}namespaces(){
return this.list()}baseNamespace(){const e=this.namespaces();return e[e.length-1]}list(){return this.toString().split(dr).
slice(1)}type(){return N5(this.baseNamespace())}name(){return U5(this.baseNamespace())}instance(e){return new mt(this.toString()+
":"+e)}path(){let e=this.parent().toString();return e.endsWith(dr)||(e+=dr),e+=this.type(),new mt(e)}parent(){const e=this.
list();return e.length===1?new mt(dr):new mt(e.slice(0,-1).join(dr))}child(e){return this.toString()===dr?e:e.toString()===
dr?this:new mt(this.toString()+e.toString(),!1)}isAncestorOf(e){return e.toString()===this.toString()?!1:e.toString().startsWith(
this.toString())}isDecendantOf(e){return e.toString()===this.toString()?!1:this.toString().startsWith(e.toString())}isTopLevel(){
return this.list().length===1}concat(...e){return mt.withNamespaces([...this.namespaces(),...F5(e.map(t=>t.namespaces()))])}}
function N5(r){const e=r.split(":");return e.length<2?"":e.slice(0,-1).join(":")}function U5(r){const e=r.split(":");return e[e.
length-1]}function F5(r){return[].concat(...r)}const O5="peercompute-ipfs-artifacts-v1-",iu=["blocks","roots","routing"],
iy=r=>r instanceof Uint8Array?r.byteLength:new TextEncoder().encode(JSON.stringify(r)).byteLength,zc=r=>r===void 0?void 0:
structuredClone(r),ko=()=>({bytes:0,entries:0,generation:0});function oy(r,e,t,{maximumBytes:n=Number.MAX_SAFE_INTEGER,maximumEntries:s=Number.
MAX_SAFE_INTEGER}={}){const i={bytes:r.bytes-(e?.size||0)+t,entries:r.entries+(e?0:1),generation:(r.generation||0)+1};if(Object.
values(i).some(o=>!Number.isSafeInteger(o)||o<0))throw new RangeError("Artifact storage accounting exceeds safe integer \
range.");if(i.bytes>n||i.entries>s)throw new DOMException("Artifact storage quota exceeded.","QuotaExceededError");return i}
class z5{constructor({name:e="memory"}={}){this.name=e,this.data=new Map(iu.map(t=>[t,new Map])),this.usage=new Map(iu.map(
t=>[t,ko()]))}async open(){}async close(){}async get(e,t){return zc(this.data.get(e).get(t)?.value)}async getUsage(e){return{
...this.usage.get(e)}}async put(e,t,n,s){const i=this.data.get(e),o=i.get(t);if(e==="blocks"&&o)return!1;const a=iy(n),c=oy(
this.usage.get(e),o,a,s);return i.set(t,{value:zc(n),size:a,generation:c.generation}),this.usage.set(e,c),!0}async delete(e,t){
const n=this.data.get(e),s=n.get(t);if(!s)return!1;const i=this.usage.get(e);return this.usage.set(e,{...i,bytes:i.bytes-
s.size,entries:i.entries-1}),n.delete(t),!0}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return[...this.data.get(
e).keys()].sort().filter(i=>t===void 0||i>t).slice(0,n).map(i=>({key:i,generation:this.data.get(e).get(i).generation,...s?
{}:{value:zc(this.data.get(e).get(i).value)}}))}}function Ht(r){return new Promise((e,t)=>{r.onsuccess=()=>e(r.result),r.
onerror=()=>t(r.error)})}class q5{constructor({name:e="default",indexedDBImpl:t=globalThis.indexedDB,keyRange:n=globalThis.
IDBKeyRange}={}){this.name=`${O5}${e}`,this.indexedDB=t,this.keyRange=n,this.database=null,this.opening=null}async open(){
if(!this.database){if(this.opening)return this.opening;if(!this.indexedDB?.open||!this.keyRange)throw new Error("Persist\
ent artifacts require IndexedDB and IDBKeyRange.");this.opening=new Promise((e,t)=>{const n=this.indexedDB.open(this.name,
1);let s=!1;n.onupgradeneeded=()=>{for(const i of[...iu,"usage"])n.result.createObjectStore(i)},n.onerror=()=>t(n.error),
n.onblocked=()=>{s=!0,t(new Error("Artifact database open blocked by another context."))},n.onsuccess=()=>{if(s){n.result.
close();return}this.database=n.result,this.database.onversionchange=()=>{this.database?.close(),this.database=null},e()}});
try{await this.opening}finally{this.opening=null}}}async close(){await this.opening,this.database?.close(),this.database=
null}async _transaction(e,t,n){if(!this.database)throw new Error("Artifact database is closed.");const s=this.database.transaction(
e,t),i=new Promise((o,a)=>{s.oncomplete=o,s.onabort=()=>a(s.error||new Error("Artifact transaction aborted.")),s.onerror=
()=>{}});try{const o=await n(s);return await i,o}catch(o){try{s.abort()}catch{}throw await i.catch(()=>{}),o}}async get(e,t){
return this._transaction([e],"readonly",async n=>(await Ht(n.objectStore(e).get(t)))?.value)}async getUsage(e){return this.
_transaction(["usage"],"readonly",async t=>await Ht(t.objectStore("usage").get(e))||ko())}async put(e,t,n,s){return this.
_transaction([e,"usage"],"readwrite",async i=>{const o=i.objectStore(e),a=i.objectStore("usage"),[c,l]=await Promise.all(
[Ht(o.get(t)),Ht(a.get(e))]);if(e==="blocks"&&c)return!1;const u=iy(n),h=oy(l||ko(),c,u,s);return await Promise.all([Ht(
o.put({value:n,size:u,generation:h.generation},t)),Ht(a.put(h,e))]),!0})}async delete(e,t){return this._transaction([e,"\
usage"],"readwrite",async n=>{const s=n.objectStore(e),i=n.objectStore("usage"),[o,a]=await Promise.all([Ht(s.get(t)),Ht(
i.get(e))]);if(!o)return!1;const c=a||ko();return await Promise.all([Ht(s.delete(t)),Ht(i.put({...c,bytes:c.bytes-o.size,
entries:c.entries-1},e))]),!0})}async scan(e,{after:t,limit:n=16,keysOnly:s=!1}={}){return this._transaction([e],"readon\
ly",i=>new Promise((o,a)=>{const c=i.objectStore(e),l=t===void 0?void 0:this.keyRange.lowerBound(t,!0),u=c.openCursor(l),
h=[];u.onerror=()=>a(u.error),u.onsuccess=()=>{const d=u.result;if(!d||h.length>=n){o(h);return}h.push({key:d.key,generation:d.
value.generation,...s?{}:{value:d.value.value}}),h.length>=n?o(h):d.continue()}}))}}const qc=new Map;function he(r){if(r?.
aborted)throw r.reason||new DOMException("Aborted","AbortError")}async function Hi(r,e,t,n){if(he(t),n)return new Promise(
(i,o)=>{n.request(r,{mode:e,...t?{signal:t}:{}},async()=>{await new Promise(a=>i(a))}).catch(o)});let s=qc.get(r);return s||
(s={readers:0,writer:!1,queue:[]},qc.set(r,s)),new Promise((i,o)=>{const a=()=>{for(;s.queue.length&&!s.writer;){const l=s.
queue[0];if(l.mode==="exclusive"&&s.readers)break;s.queue.shift(),l.signal?.removeEventListener("abort",l.abort),l.mode===
"exclusive"?s.writer=!0:s.readers++;let u=!1;if(l.resolve(()=>{u||(u=!0,l.mode==="exclusive"?s.writer=!1:s.readers--,a(),
!s.writer&&!s.readers&&!s.queue.length&&qc.delete(r))}),l.mode==="exclusive")break}},c={mode:e,signal:t,resolve:i,abort:()=>{
const l=s.queue.indexOf(c);l>=0&&s.queue.splice(l,1),o(t.reason||new DOMException("Aborted","AbortError")),a()}};t?.addEventListener(
"abort",c.abort,{once:!0}),s.queue.push(c),a()})}const ay="peercompute.artifact.manifest.v1",ln=256*1024,cy=16*1024**3,da=new TextEncoder;
function ye(r){const e=Zn.asCID(r)||Zn.parse(String(r));if(![85,112].includes(e.code)||e.multihash.code!==18||e.multihash.
digest.byteLength!==32)throw new TypeError("Artifacts require raw or dag-pb CIDs with SHA-256.");return e.toV1()}function Eo(r,e=0,t={
remaining:ln}){if(e>12)throw new RangeError("Manifest nesting exceeds 12 levels.");if((t.remaining-=2)<0)throw new RangeError(
"Manifest exceeds byte limit.");if(typeof r=="string"){if(r.length>t.remaining||(t.remaining-=da.encode(r).length)<0)throw new RangeError(
"Manifest exceeds byte limit.");return r}if(r===null||typeof r=="boolean"||typeof r=="number"&&Number.isFinite(r))return r;
if(Array.isArray(r)){if(r.length>4096)throw new RangeError("Manifest array exceeds item limit.");return r.map(s=>Eo(s,e+
1,t))}if(!r||typeof r!="object"||Object.getPrototypeOf(r)!==Object.prototype)throw new TypeError("Manifest values must b\
e JSON values.");const n=Object.keys(r);if(n.length>1024)throw new RangeError("Manifest object exceeds key limit.");return Object.
fromEntries(n.sort().map(s=>(Eo(s,e+1,t),[s,Eo(r[s],e+1,t)])))}function Ka(r,{maximumBytes:e=ln,maximumFiles:t=1024,maximumFileBytes:n=cy}={}){
if(!r||r.schema!==ay||!Array.isArray(r.files)||r.files.length===0||r.files.length>t)throw new TypeError("Manifest requir\
es the supported schema and a bounded, nonempty files array.");const s=new Set(["schema","name","description","files","m\
odel","provenance"]);if(Object.keys(r).some(c=>!s.has(c)))throw new TypeError("Unsupported manifest field.");for(const c of[
"name","description"])if(r[c]!==void 0&&typeof r[c]!="string")throw new TypeError(`Manifest ${c} must be a string.`);if(r.
model!==void 0&&(!r.model||typeof r.model!="object"||Array.isArray(r.model)))throw new TypeError("Manifest model extensi\
on must be an object.");const i=new Set,o=r.files.map(c=>{if(!c||typeof c!="object")throw new TypeError("Invalid manifes\
t file.");if(Object.keys(c).some(h=>!["path","cid","size","sha256","mediaType"].includes(h)))throw new TypeError("Unsupp\
orted manifest file field.");const{path:l,size:u}=c;if(typeof l!="string"||!l||da.encode(l).length>512||/[\\?#%\u0000-\u001f\u007f:]/u.
test(l)||l.split("/").some(h=>!h||h==="."||h==="..")||i.has(l))throw new TypeError("Manifest paths must be unique, relat\
ive POSIX paths without traversal or URL escapes.");if(!Number.isSafeInteger(u)||u<0||u>n)throw new RangeError("Invalid \
file size.");if(c.sha256!==void 0&&!/^[a-f0-9]{64}$/u.test(c.sha256))throw new TypeError("Invalid SHA-256.");if(c.mediaType!==
void 0&&(typeof c.mediaType!="string"||c.mediaType.length>256))throw new TypeError("Invalid media type.");return i.add(l),
{...c,cid:ye(c.cid).toString()}}).sort((c,l)=>c.path<l.path?-1:c.path>l.path?1:0),a=Eo({...r,files:o},0,{remaining:e});if(da.
encode(JSON.stringify(a)).byteLength>e)throw new RangeError("Manifest exceeds byte limit.");return a}function j5(r,e){return da.
encode(JSON.stringify(Ka(r,e)))}function ou(r,e={}){if(r.byteLength>(e.maximumBytes??ln))throw new RangeError("Manifest \
exceeds byte limit.");return Ka(JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(r)),e)}const _s=Object.freeze({name:"\
peercompute.unixfs.v1",cidVersion:1,hash:"sha2-256",rawLeaves:!0,chunkSize:256*1024,maxChildrenPerNode:174,layout:"balan\
ced",reduceSingleLeafToSelf:!0}),jc=r=>Array.from(r,e=>e.toString(16).padStart(2,"0")).join(""),Is=Symbol("artifact-impo\
rt-retention");function st(r,e,t=1){if(!Number.isSafeInteger(r)||r<t)throw new RangeError(`Invalid ${e}.`);return r}function Gc(r){
const e=new Error(`Artifact block not found: ${r}`);return e.name="NotFoundError",e.code="ERR_NOT_FOUND",e}function ha(r,e){
return e?(e.aborted&&(Promise.resolve(r).catch(()=>{}),he(e)),new Promise((t,n)=>{const s=()=>n(e.reason||new DOMException(
"Aborted","AbortError"));e.addEventListener("abort",s,{once:!0}),Promise.resolve(r).then(t,n).finally(()=>e.removeEventListener(
"abort",s))})):r}async function*up(r,e){if(r instanceof Uint8Array){yield r;return}if(r?.getReader){const t=r.getReader();
let n=!1;try{for(;;){const s=await ha(t.read(),e);if(s.done){n=!0;return}yield s.value}}finally{n||t.cancel().catch(()=>{}),
t.releaseLock()}return}if(r?.[Symbol.asyncIterator]||r?.[Symbol.iterator]){const t=r[Symbol.asyncIterator]?.()||r[Symbol.
iterator]();let n=!1;try{for(;;){const s=await ha(t.next(),e);if(s.done){n=!0;return}yield s.value}}finally{n||Promise.resolve(
t.return?.()).catch(()=>{})}return}throw new TypeError("Artifact source must be bytes or a byte stream.")}class G5{constructor({
name:e="default",persistent:t=!0,backend:n,ownsBackend:s=n===void 0,capacity:i="bounded",maximumBytes:o=i==="browser"?Number.
MAX_SAFE_INTEGER:2*1024**3,maximumBlockBytes:a=2*1024**2,maximumFileBytes:c=cy,maximumTraversalBlocks:l=65536,maximumStoredBlocks:u=i===
"browser"?Number.MAX_SAFE_INTEGER:l,maximumRoots:h=i==="browser"?Number.MAX_SAFE_INTEGER:1024,maximumRoutingBytes:d=16*1024**
2,maximumConcurrentBlockWrites:p=4,maximumQueuedBlockWrites:m=16,lockManager:y=globalThis.navigator?.locks,onDestroy:b,indexedDBImpl:f,
keyRange:g}={}){if(typeof e!="string"||!/^[\w.-]{1,80}$/u.test(e))throw new TypeError("Invalid artifact store name.");if(![
"bounded","browser"].includes(i))throw new TypeError("Invalid artifact storage capacity policy.");this.capacity=i,this.name=
e,this.persistent=t,this.backend=n||(t?new q5({name:e,indexedDBImpl:f,keyRange:g}):new z5({name:e})),this.ownsBackend=s,
this.maximumBytes=st(o,"maximumBytes"),this.maximumBlockBytes=st(a,"maximumBlockBytes"),this.maximumFileBytes=st(c,"maxi\
mumFileBytes"),this.maximumTraversalBlocks=st(l,"maximumTraversalBlocks"),this.maximumStoredBlocks=st(u,"maximumStoredBl\
ocks"),this.maximumRoots=st(h,"maximumRoots"),this.maximumRoutingBytes=st(d,"maximumRoutingBytes"),this.maximumConcurrentBlockWrites=
st(p,"maximumConcurrentBlockWrites"),this.maximumQueuedBlockWrites=st(m,"maximumQueuedBlockWrites",0),this.activeBlockWrites=
0,this.waitingBlockWrites=[],this.lockManager=y,this.lockName=`peercompute-artifacts:${this.backend.name||e}`,this.onDestroy=
b,this.controller=new AbortController,this.operations=new Set,this.isOpen=!1,this.destroyed=!1,this.usage={bytes:0,entries:0},
this.rootUsage={bytes:0,entries:0},this.blockstore=this._createBlockstore(),this.datastore=this._createDatastore()}async open(){
if(this.destroyed)throw new Error("Artifact store is destroyed.");if(this.opening)return this.opening;if(!this.isOpen){this.
opening=(async()=>{if(this.persistent&&!this.lockManager?.request&&!this.backend.supportsExclusiveAccess)throw new Error(
"Persistent artifact storage requires Web Locks for cross-context GC safety.");if(await this.backend.open(),this.persistent&&
!this.lockManager?.request&&!this.backend.hasExclusiveLock)throw new Error("Persistent artifact backend did not acquire \
its exclusive storage lock.");this.usage=await this.backend.getUsage("blocks"),this.rootUsage=await this.backend.getUsage(
"roots"),this.isOpen=!0})();try{await this.opening}finally{this.opening=null}}}async _begin(e,t="shared"){if(this.destroyed)
throw new Error("Artifact store is destroyed.");const n=e?AbortSignal.any([e,this.controller.signal]):this.controller.signal;
he(n),await this.open();const s=t==="none"?()=>{}:await Hi(`${this.lockName}:gc`,t,n,this.lockManager);try{he(n)}catch(l){
throw s(),l}let i;const a={settled:new Promise(l=>{i=l}),paused:!1,finish:()=>{n.removeEventListener("abort",c),s(),this.
operations.delete(a),i()}},c=()=>{a.paused&&a.finish()};return n.addEventListener("abort",c,{once:!0}),this.operations.add(
a),{signal:n,finish:a.finish,pause:()=>{a.paused=!0,n.aborted&&a.finish()},resume:()=>{a.paused=!1,he(n)}}}async _run(e,t,n,s){
if(s&&(s.store!==this||!s.held||n==="exclusive"))throw new Error("Artifact retention scope is no longer active.");const i=s?
AbortSignal.any([s.signal,...e?[e]:[]]):e,o=await this._begin(i,s?"none":n);try{const a=await t(o.signal);return he(o.signal),
a}finally{o.finish()}}async _writeRoot(e,t,n){const s=await Hi(`${this.lockName}:roots`,"exclusive",n,this.lockManager);
try{he(n);const i=await this.backend.get("roots",e),o=t(i);return he(n),await this.backend.put("roots",e,o,{maximumEntries:this.
maximumRoots,maximumBytes:Math.min(Number.MAX_SAFE_INTEGER,this.maximumRoots*(ln+2048))}),this.rootUsage=await this.backend.
getUsage("roots"),structuredClone(o)}finally{s()}}async _readBlock(e,t){he(t);const n=ye(e),s=await this.backend.get("bl\
ocks",n.toString());if(!s)throw Gc(n);return await this._verifyBlock(n,s),he(t),s}async _verifyBlock(e,t){if(!(t instanceof
Uint8Array)||t.byteLength>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");const n=await Eh.
digest(t);if(!Zn.createV1(e.code,n).equals(e))throw new Error("Artifact block CID verification failed.")}async _blockWritePermit(e){
if(he(e),this.activeBlockWrites>=this.maximumConcurrentBlockWrites){if(this.waitingBlockWrites.length>=this.maximumQueuedBlockWrites)
throw new Error("Artifact block write queue is full.");await new Promise((t,n)=>{const s={resolve:t,signal:e,abort:()=>{
const i=this.waitingBlockWrites.indexOf(s);i>=0&&this.waitingBlockWrites.splice(i,1),n(e.reason||new DOMException("Abort\
ed","AbortError"))}};e?.addEventListener("abort",s.abort,{once:!0}),this.waitingBlockWrites.push(s)})}else this.activeBlockWrites++;
return()=>{const t=this.waitingBlockWrites.shift();t?(t.signal?.removeEventListener("abort",t.abort),t.resolve()):this.activeBlockWrites--}}async _putBlock(e,t,n){
const s=await this._blockWritePermit(n);try{return await this._persistBlock(e,t,n)}finally{s()}}async _persistBlock(e,t,n){
he(n);const s=ye(e),i=t instanceof Uint8Array?null:new Uint8Array(this.maximumBlockBytes);let o=0,a;for await(const c of up(
t,n)){if(he(n),!(c instanceof Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(o+=c.byteLength,
o>this.maximumBlockBytes)throw new RangeError("Artifact block exceeds byte limit.");i?i.set(c,o-c.byteLength):a=c.slice()}
return a=i?i.slice(0,o):a,await this._verifyBlock(s,a),he(n),await this.backend.put("blocks",s.toString(),a,{maximumBytes:this.
maximumBytes,maximumEntries:this.maximumStoredBlocks}),this.usage=await this.backend.getUsage("blocks"),s}_localBlocks(e){
const t=this;return{async*get(n){yield await t._readBlock(n,e)},put:(n,s)=>t._putBlock(n,s,e)}}async importFile(e,{signal:t,
expectedSize:n,expectedSha256:s,pin:i=!0,[Is]:o}={}){if(n!==void 0&&st(n,"expectedSize",0),n>this.maximumFileBytes)throw new RangeError(
"File exceeds byte limit.");if(s!==void 0&&!/^[a-f0-9]{64}$/u.test(s))throw new TypeError("Invalid expected SHA-256.");return this.
_run(t,async a=>{const c=_h.create();let l=0;const u=this;async function*h(){for await(const y of up(e,a)){if(he(a),!(y instanceof
Uint8Array))throw new TypeError("Artifact streams require Uint8Array chunks.");if(l+=y.byteLength,l>u.maximumFileBytes||
n!==void 0&&l>n)throw new RangeError("File exceeds declared byte limit.");for(let b=0;b<y.byteLength;b+=_s.chunkSize){const f=y.
subarray(b,b+_s.chunkSize);c.update(f),yield f}}}const d=await t_(h(),this._localBlocks(a),{cidVersion:1,rawLeaves:!0,reduceSingleLeafToSelf:!0,
wrapWithDirectory:!1,chunker:Bg({chunkSize:_s.chunkSize}),layout:Xg({maxChildrenPerNode:_s.maxChildrenPerNode}),fileImportConcurrency:1,
blockWriteConcurrency:1}),p=jc(c.digest());if(n!==void 0&&n!==l)throw new Error("File size does not match expected size.");
if(s!==void 0&&s!==p)throw new Error("File SHA-256 does not match expected digest.");const m=d.cid.toV1().toString();return this.
_writeRoot(m,y=>({cid:m,kind:"file",size:l,sha256:p,status:"complete",pinned:!!(i||y?.pinned),retain:!1,profile:_s.name}),
a)},void 0,o)}async importManifest(e,{signal:t,pin:n=!0,[Is]:s}={}){const i=Ka(e,{maximumFileBytes:this.maximumFileBytes}),
o=j5(i);return this._run(t,async a=>{for(const l of i.files)await this._recordVerifiedFile(l,a);const c=Zn.createV1(85,await Eh.
digest(o));return await this._putBlock(c,o,a),this._writeRoot(c.toString(),l=>({cid:c.toString(),kind:"manifest",size:o.
byteLength,manifest:i,status:"complete",pinned:!!(n||l?.pinned),retain:!1}),a)},void 0,s)}async _verifyFile(e,t={},n){const s=await ip(
ye(e).toString(),this._localBlocks(n));if(!["file","raw"].includes(s.type))throw new TypeError("Artifact root must ident\
ify a file.");const i=Number(s.type==="raw"?s.node.byteLength:s.unixfs.fileSize());if(!Number.isSafeInteger(i)||i>this.maximumFileBytes||
t.size!==void 0&&i!==t.size)throw new RangeError("Artifact file size differs from its manifest or limit.");const o=_h.create();
let a=0;for await(const l of this._fileChunks(e,{size:i,signal:n})){if(he(n),a+=l.byteLength,a>i)throw new RangeError("A\
rtifact content exceeds declared size.");o.update(l)}const c=jc(o.digest());if(a!==i||t.sha256!==void 0&&c!==t.sha256)throw new Error(
"Artifact file integrity differs from its manifest.");return{size:i,sha256:c}}async*_fileChunks(e,{size:t,offset:n=0,length:s=t-
n,signal:i}){const o=n+s,a=[{cid:ye(e),start:0,size:t,depth:0}];let c=0,l=0;for(;a.length;){he(i);const u=a.pop();if(++c>
this.maximumTraversalBlocks||u.depth>64)throw new RangeError("Artifact file traversal exceeds its bounds.");const h=await this.
_readBlock(u.cid,i);if(u.cid.code===85){if(h.byteLength!==u.size)throw new Error("Raw file block size differs from its U\
nixFS link.");const g=h.subarray(Math.max(0,n-u.start),Math.min(h.length,o-u.start));g.length&&(l+=g.length,yield g);continue}
const d=ui(h);if(!d.Data)throw new Error("UnixFS file node has no metadata.");const p=dt.unmarshal(d.Data),m=hi.decode(h).
data?.fileSize;if(!["file","raw"].includes(p.type)||d.Links.length!==p.blockSizes.length||Number(p.fileSize())!==u.size||
m!==void 0&&m!==BigInt(u.size))throw new Error("UnixFS file metadata is inconsistent.");const y=p.data||new Uint8Array;let b=u.
start+y.length;const f=[];for(let g=0;g<d.Links.length;g++){const w=Number(p.blockSizes[g]);if(!Number.isSafeInteger(w)||
w<0)throw new RangeError("Invalid UnixFS child size.");const k=ye(d.Links[g].Hash),x=d.Links[g].Tsize;if(x!==void 0&&(!Number.
isSafeInteger(x)||x<w||k.code===85&&x!==w))throw new Error("Invalid UnixFS link DAG size.");if(b<o&&b+w>n&&f.push({cid:k,
start:b,size:w,depth:u.depth+1}),b+=w,!Number.isSafeInteger(b))throw new RangeError("Invalid UnixFS file extent.")}if(b!==
u.start+u.size)throw new Error("UnixFS child sizes differ from their parent.");if(a.length+f.length>this.maximumTraversalBlocks)
throw new RangeError("UnixFS pending traversal exceeds limit.");for(let g=f.length-1;g>=0;g--)a.push(f[g]);if(y.length&&
u.start<o&&u.start+y.length>n){const g=y.subarray(Math.max(0,n-u.start),Math.min(y.length,o-u.start));l+=g.length,yield g}}
if(l!==s)throw new Error("UnixFS read did not produce the requested number of bytes.")}async _recordVerifiedFile(e,t){const n=await this.
_verifyFile(e.cid,e,t);return this._writeRoot(e.cid,s=>({...s,cid:e.cid,kind:"file",...n,status:"complete",pinned:!!s?.pinned,
retain:!1}),t)}async*_walk(e,{signal:t,fetchBlock:n,allowMissing:s=!1}={}){const i=e.map(a=>ye(a)),o=new Set;for(;i.length;){
he(t);const a=i.pop(),c=a.toString();if(o.has(c))continue;if(o.size>=this.maximumTraversalBlocks)throw new RangeError("A\
rtifact DAG traversal exceeds block limit.");o.add(c);let l;try{l=await this._readBlock(a,t)}catch(u){if(u.code!=="ERR_N\
OT_FOUND")throw u;if(n)await this._putBlock(a,await ha(n(a,{signal:t}),t),t),l=await this._readBlock(a,t);else{if(s)continue;
throw u}}if(yield c,a.code===_i){const u=ui(l).Links;if(i.length+u.length>this.maximumTraversalBlocks)throw new RangeError(
"Artifact DAG links exceed limit.");for(const h of u)i.push(ye(h.Hash))}}}async ensureLocal(e,{signal:t,fetchBlock:n,pin:s=!0,
kind:i}={}){const o=ye(e).toString();return this._run(t,async a=>{await this._writeRoot(o,h=>({...h,cid:o,kind:i||h?.kind||
"file",status:"partial",pinned:!!h?.pinned,retain:!0}),a);for await(const h of this._walk([o],{signal:a,fetchBlock:n}));
let c;const l=ye(o).code===85?await this._readBlock(o,a):null;if(l&&l.byteLength<=ln){let h;try{h=JSON.parse(new TextDecoder().
decode(l))}catch{}(h?.schema===ay||i==="manifest")&&(c=ou(l,{maximumFileBytes:this.maximumFileBytes}))}if(i==="manifest"&&
!c)throw new TypeError("Manifest must be a bounded canonical JSON raw block.");if(c){await this._writeRoot(o,h=>({...h,kind:"\
manifest",manifest:c,retain:!0}),a);for(const h of c.files){for await(const d of this._walk([h.cid],{signal:a,fetchBlock:n}))
;await this._recordVerifiedFile(h,a)}}const u=c?{size:l.byteLength,manifest:c}:await this._verifyFile(o,{},a);return this.
_writeRoot(o,h=>({cid:o,kind:c?"manifest":"file",...u,status:"complete",pinned:!!(s||h?.pinned),retain:!1}),a)})}async stat(e,{
signal:t,[Is]:n}={}){const s=ye(e).toString();return this._run(t,()=>this.backend.get("roots",s),void 0,n)}async getManifest(e,{
signal:t,[Is]:n}={}){const s=ye(e).toString();return this._run(t,async i=>ou(await this._readBlock(s,i),{maximumFileBytes:this.
maximumFileBytes}),void 0,n)}async*openRead(e,{offset:t=0,length:n,signal:s}={}){st(t,"offset",0),n!==void 0&&st(n,"leng\
th",0);const i=await this._begin(s);try{const o=await ip(ye(e).toString(),this._localBlocks(i.signal));if(!["file","raw"].
includes(o.type))throw new TypeError("Artifact root must identify a file.");const a=Number(o.type==="raw"?o.node.byteLength:
o.unixfs.fileSize());if(a>this.maximumFileBytes||t>a||n!==void 0&&n>a-t)throw new RangeError("Artifact range exceeds fil\
e size.");if(n===0||t===a)return;for await(const c of this._fileChunks(e,{size:a,offset:t,length:n,signal:i.signal}))he(
i.signal),i.pause(),yield c,i.resume()}finally{i.finish()}}async pin(e,{signal:t}={}){return this.ensureLocal(e,{signal:t,
pin:!0})}async unpin(e,{signal:t}={}){const n=ye(e).toString();return this._run(t,s=>this._writeRoot(n,i=>{if(!i)throw Gc(
n);return{...i,pinned:!1,retain:!1}},s))}async withRetention(e,{signal:t}={}){if(typeof e!="function")throw new TypeError(
"Artifact retention requires a callback.");const n=await this._begin(t),s={store:this,signal:n.signal,held:!0,accepting:!0},
i=new Set,o={};for(const a of["stat","getManifest","importFile","importManifest"])o[a]=(c,l={})=>{if(!s.accepting)return Promise.
reject(new Error("Artifact retention scope is no longer active."));if(i.size>=32)return Promise.reject(new Error("Artifa\
ct retention operation queue is full."));const u=this[a](c,{...l,[Is]:s});return i.add(u),u.finally(()=>i.delete(u)).catch(
()=>{}),u};o.getStats=()=>this.getStats(),Object.freeze(o);try{const a=await ha(Promise.resolve().then(()=>(he(n.signal),
e(o))),n.signal);return s.accepting=!1,await Promise.all([...i]),he(n.signal),a}finally{s.accepting=!1,await Promise.allSettled(
[...i]),s.held=!1,n.finish()}}async acquireUse(e,{signal:t}={}){const n=ye(e).toString(),s=await this._begin(t,"none");let i;
try{i=await Hi(`${this.lockName}:use:${n}`,"shared",s.signal,this.lockManager);const o=await this.stat(n,{signal:s.signal});
if(o?.status!=="complete"||!o.pinned&&!o.retain)throw new Error("Artifact use requires a complete retained root.");he(s.
signal);let a=!1;const c=()=>{a||(a=!0,this.controller.signal.removeEventListener("abort",c),i(),s.finish())};return this.
controller.signal.addEventListener("abort",c,{once:!0}),this.controller.signal.aborted&&(c(),he(this.controller.signal)),
c}catch(o){throw i?.(),s.finish(),o}}async*_entries(e,t=!1){let n;for(;;){const s=await this.backend.scan(e,{after:n,limit:16,
keysOnly:t});if(!s.length)return;for(const i of s)yield i;n=s.at(-1).key}}async*list({signal:e}={}){const t=await this._begin(
e);try{for await(const n of this._entries("roots"))he(t.signal),t.pause(),yield n.value,t.resume()}finally{t.finish()}}async*listBlockCids(e,{
signal:t}={}){const n=ye(e).toString(),s=await this._begin(t);try{const i=await this.backend.get("roots",n);if(i?.status!==
"complete")throw new Error("Artifact serving requires a complete local root.");const o=[n,...(i.manifest?.files||[]).map(
a=>a.cid)];for await(const a of this._walk(o,{signal:s.signal}))s.pause(),yield a,s.resume()}finally{s.finish()}}async _collectGarbage(e,t){
const n=await this.backend.getUsage("blocks"),s=n.generation||0,i=new Set;for await(const{value:l}of this._entries("root\
s")){if(l.cid===t||!l.pinned&&!l.retain)continue;const u=[l.cid,...(l.manifest?.files||[]).map(h=>h.cid)];for await(const h of this.
_walk(u,{signal:e,allowMissing:l.status!=="complete"}))if(i.add(h),i.size>n.entries)throw new RangeError("Artifact GC ex\
ceeds the stored block collection.")}const o=t?await this.backend.get("roots",t):null,a=!!(t&&i.has(t));if(o)if(a){const l=o.
kind==="manifest"?{cid:t,kind:"file",size:o.size,sha256:jc(ye(t).multihash.digest),status:o.status,pinned:!1,retain:!1}:
{...o,pinned:!1,retain:!1};await this._writeRoot(t,()=>l,e)}else{const l={...o,pinned:!1,status:"deleting"};delete l.retain,
delete l.profile,await this._writeRoot(t,()=>l,e)}let c=0;for await(const{key:l,generation:u}of this._entries("blocks",!0))
he(e),u<=s&&!i.has(l)&&await this.backend.delete("blocks",l)&&c++;for await(const{key:l,value:u}of this._entries("roots"))
!u.pinned&&!u.retain&&!i.has(l)&&await this.backend.delete("roots",l);return this.usage=await this.backend.getUsage("blo\
cks"),this.rootUsage=await this.backend.getUsage("roots"),{deletedBlocks:c,freedBytes:n.bytes-this.usage.bytes,storedBytes:this.
usage.bytes,blockCount:this.usage.entries,...t?{cid:t,removed:!!o,retainedByOtherRoot:a}:{}}}async gc({signal:e}={}){return this.
_run(e,t=>this._collectGarbage(t),"exclusive")}async remove(e,{signal:t,useWaitMs:n=1e3}={}){const s=ye(e).toString();if(st(
n,"useWaitMs"),n>3e4)throw new RangeError("Artifact use wait exceeds limit.");await this.open();const i=new AbortController,
o=setTimeout(()=>i.abort(Object.assign(new Error("This model is in use in another session. Unload it before deleting."),
{code:"ERR_ARTIFACT_IN_USE"})),n);o.unref?.();let a;try{a=await Hi(`${this.lockName}:use:${s}`,"exclusive",AbortSignal.any(
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
const s=await e._begin(n);try{for await(const{key:i}of e._entries("blocks",!0))he(s.signal),s.pause(),yield{cid:ye(i),bytes:t.
get(i,{signal:s.signal})},s.resume()}finally{s.finish()}}};return t.putMany=async function*(n,s){for await(const{cid:i,bytes:o}of n)
yield await t.put(i,o,s)},t.getMany=async function*(n,s){for await(const i of n)yield{cid:i,bytes:t.get(i,s)}},t.deleteMany=
async function*(){throw new Error("Use ArtifactStore.gc() to remove blocks.")},t}_createDatastore(){const e=this,t=s=>{const i=s.
toString();if(i.length>2048)throw new RangeError("Datastore key exceeds limit.");return i},n={open:async()=>{},close:async()=>{},
start:async()=>{},stop:async()=>{},get:(s,{signal:i}={})=>e._run(i,async()=>{const o=await e.backend.get("routing",t(s));
if(o===void 0)throw Gc(s);return o},"none"),has:(s,{signal:i}={})=>e._run(i,async()=>await e.backend.get("routing",t(s))!==
void 0,"none"),put:(s,i,{signal:o}={})=>e._run(o,async a=>{if(he(a),!(i instanceof Uint8Array)||i.byteLength>ln)throw new RangeError(
"Datastore value exceeds limit.");return await e.backend.put("routing",t(s),i,{maximumBytes:e.maximumRoutingBytes,maximumEntries:4096}),
s},"none"),delete:(s,{signal:i}={})=>e._run(i,async()=>{await e.backend.delete("routing",t(s))},"none"),query:(s={},i={})=>e.
_queryDatastore(s,i,!1),queryKeys:(s={},i={})=>e._queryDatastore(s,i,!0),batch:()=>{const s=[];let i=0;const o=(a,c)=>{if(s.
length>=4096||(i+=c?.byteLength||0)>e.maximumRoutingBytes)throw new RangeError("Datastore batch exceeds limit.");s.push(
{key:a,value:c?.slice()})};return{put:(a,c)=>o(a,c),delete:a=>o(a),commit:async a=>{for(const{key:c,value:l}of s)l===void 0?
await n.delete(c,a):await n.put(c,l,a);s.length=0}}}};return n.putMany=async function*(s,i){for await(const o of s)await n.
put(o.key,o.value,i),yield o},n.getMany=async function*(s,i){for await(const o of s)yield{key:o,value:await n.get(o,i)}},
n.deleteMany=async function*(s,i){for await(const o of s)await n.delete(o,i),yield o},n}async*_queryDatastore(e,{signal:t}={},n){
const s=await this._begin(t,"none");try{const i=[];let o=0,a=0;const c=st(e.offset??0,"query offset",0),l=st(e.limit??4096,
"query limit",0);for await(const u of this._entries("routing",n)){if(he(s.signal),e.prefix&&!u.key.startsWith(e.prefix))
continue;const h=new mt(u.key),d=n?h:{key:h,value:u.value};if(!e.filters?.some(p=>!p(d))&&(e.orders?.length?i.push(d):o++>=
c&&a<l&&(a++,s.pause(),yield d,s.resume()),!e.orders?.length&&a>=l))return}if(e.orders?.length){i.sort((u,h)=>{for(const d of e.
orders){const p=d(u,h);if(p)return p}return 0});for(const u of i.slice(c,c+l))s.pause(),yield u,s.resume()}}finally{s.finish()}}async destroy(){
return this.destroying?this.destroying:(this.destroyed=!0,this.controller.abort(new DOMException("Artifact store destroy\
ed.","AbortError")),this.destroying=(async()=>{try{await this.opening?.catch(()=>{}),await Promise.allSettled([...this.operations].
map(e=>e.settled)),this.ownsBackend&&await this.backend.close()}finally{this.isOpen=!1,this.onDestroy?.(this)}})(),this.
destroying)}}const W5="peercompute.state.task-graph-cache-artifact-admission.v0",V5="peercompute.state.task-graph-cache-\
artifact-invalidation.v0",Mn="taskGraphCacheArtifactAdmissions",H5="taskGraphCacheArtifactInvalidations";function dp(r,e=[]){
return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r=="string"?r.split(",").map(t=>t.trim()).
filter(Boolean):[...e]}function Cs(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}class K5{constructor(e,t={}){this.networkManager=e,this.libp2pNode=e?e.getLibp2pNode():
null,this.config={docName:t.docName||"peercompute-state",topic:t.topic||"peercompute-state-sync",enablePersistence:t.enablePersistence!==
!1,disableNetworkProvider:t.disableNetworkProvider||!1,disableBroadcast:t.disableBroadcast||!1,broadcastNamespaces:Array.
isArray(t.broadcastNamespaces)?t.broadcastNamespaces:null,...t},this.ydoc=new is,this.state=this.ydoc.getMap("state"),this.
dataState=new pk({ydoc:this.ydoc,stateMap:this.state,hotStore:t.hotStore,deltaNamespace:t.deltaNamespace||"deltas"}),this.
indexeddbProvider=null,this.libp2pProvider=null,this.subscribers=new Map,this.globalSubscribers=new Set,this.isInitialized=
!1,this.persistenceFailed=!1}_getNamespaceMap(e){let t=this.state.get(e);return t||(t=new gr,this.state.set(e,t)),t}applyRemoteUpdate(e){
try{const t=(()=>{if(e instanceof Uint8Array)return e;if(Array.isArray(e))return new Uint8Array(e);if(e&&typeof e=="obje\
ct"){const s=Object.values(e);return new Uint8Array(s)}return new Uint8Array(0)})();if(t.byteLength===0){console.warn("[\
StateManager] Remote update was empty, skipping");return}const n=t;Mo(this.ydoc,n,this)}catch(t){console.error("[StateMa\
nager] Failed to apply remote update:",t)}}applyStateSet(e,t,n){try{this.ydoc.transact(()=>{if(n){const s=this._getNamespaceMap(
n);t===void 0?s.delete(e):s.set(e,t)}else t===void 0?this.state.delete(e):this.state.set(e,t)},"remote-state-set")}catch(s){
console.error("[StateManager] Failed to apply state-set:",s)}}commitDelta(e){if(!this.isInitialized)throw new Error("Sta\
teManager not initialized");this.dataState.commitDelta(e)}getDataState(){return this.dataState}createLocalArtifactCache(e={}){
if(this.destroyed)throw new Error("StateManager is destroyed");const t=new xk({...e,onDestroy:n=>{this.dataState.unregisterLocalArtifactCache(
n.name,n)}});try{return this.dataState.registerLocalArtifactCache(t.name,t)}catch(n){throw t.destroy(),n}}getLocalArtifactCache(e){
return this.dataState.getLocalArtifactCache(e)}createArtifactStore(e={}){if(this.destroyed)throw new Error("StateManager\
 is destroyed");const t=e.name||"default";if(this.getArtifactStore(t))throw new Error(`Artifact store ${t} is already re\
gistered`);const n=new G5({...e,name:t,onDestroy:s=>{this.dataState.unregisterArtifactStore(s),e.onDestroy?.(s)}});return this.
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
t.admittedAt)?t.admittedAt:Date.now(),i=dp(t.invalidationRefs??e.invalidationRefs??e.admission?.invalidationRefs,[]),o={
schema:W5,admissionId:String(t.admissionId||e.admission?.admissionId||`task-graph-cache-admission:${n}:${s}`),cacheKey:n,
artifactId:e.artifactId||`${n}:artifact`,artifactSchema:e.schema||null,artifactStatus:e.status||null,cacheScope:e.cacheScope||
t.cacheScope||null,cacheKeySource:e.cacheKeySource||t.cacheKeySource||null,inputHash:e.inputHash||t.inputHash||null,resultHash:e.
resultHash||t.resultHash||null,status:t.status||"admitted",admitted:!0,authority:t.authority||"state-manager",validatorId:t.
validatorId||e.admission?.validatorId||null,reason:t.reason||"state-manager-cache-artifact-admission",invalidationRefs:i,
admittedAt:s,acceptedAt:s,expiresAt:t.expiresAt??e.expiresAt??null,sourceNodeId:t.sourceNodeId||this.state.get("nodeId")||
null,artifact:Cs(e)};return this.writeScoped(Mn,n,o),Cs(o)}invalidateTaskGraphCacheArtifact(e,t={}){if(!this.isInitialized)
throw new Error("StateManager not initialized");const n=e&&typeof e=="object"?e:null,s=String(t.cacheKey||n?.cacheKey||e||
"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires a cacheKey");const i=this.readScoped(Mn,s),o=Number.
isFinite(t.invalidatedAt)?t.invalidatedAt:Date.now(),a=dp(t.invalidationRefs??n?.invalidationRefs??i?.invalidationRefs,[]),
c={schema:V5,invalidationId:String(t.invalidationId||`task-graph-cache-invalidation:${s}:${o}`),cacheKey:s,artifactId:n?.
artifactId||i?.artifactId||`${s}:artifact`,status:"invalidated",authority:t.authority||"state-manager",reason:t.reason||
"state-manager-cache-artifact-invalidated",invalidationRefs:a,previousAdmissionStatus:i?.status||null,invalidatedAt:o,sourceNodeId:t.
sourceNodeId||this.state.get("nodeId")||null};return this.writeScoped(H5,c.invalidationId,c),i&&this.writeScoped(Mn,s,{...i,
status:"invalidated",admitted:!1,invalidatedAt:o,invalidation:c}),Cs(c)}getTaskGraphCacheArtifactAdmission(e){if(!this.isInitialized)
throw new Error("StateManager not initialized");const t=String(e||"").trim();if(!t)return null;const n=this.readScoped(Mn,
t);return n?Cs(n):null}listTaskGraphCacheArtifactAdmissions(e={}){if(!this.isInitialized)throw new Error("StateManager n\
ot initialized");const t=e.includeInvalidated!==!1;return this.listNamespaceKeys(Mn).map(n=>this.readScoped(Mn,n)).filter(
n=>n&&(t||n.admitted===!0)).map(n=>Cs(n)).sort((n,s)=>String(n.cacheKey||"").localeCompare(String(s.cacheKey||"")))}async initialize(e={}){
if(this.isInitialized){console.warn("[StateManager] Already initialized");return}try{if(this.config.enablePersistence&&(this.
indexeddbProvider=new hk(this.config.docName,this.ydoc),await new Promise(t=>{this.indexeddbProvider.once("synced",t)}),
console.log("[StateManager] IndexedDB persistence loaded")),this.networkManager&&!this.config.disableNetworkProvider)try{
this.libp2pProvider=new fk(this.networkManager,this.ydoc,{topic:this.config.topic}),console.log("[StateManager] PeerComp\
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
n.keys()),i=null,o=!0;const a=()=>{const h=this.state.get(e);return h instanceof gr?h:null};let c;const l=(h,d=null)=>{if(!o||
h===n)return;const p=s,m=h?Array.from(h.entries()):[],y=new Set(m.map(([b])=>b));n?.unobserve(c),n=h,s=y,i=d,n?.observe(
c);for(const b of p)if(!y.has(b)){if(!o||a()!==n)return;t(void 0,b)}for(const[b,f]of m){if(!o||a()!==n)return;t(f,b)}};c=
(h,d)=>{if(!o||h.target!==n)return;const p=a();if(p!==n){l(p,d);return}d!==i&&h.keysChanged.forEach(m=>{!o||h.target!==n||
a()!==n||(n.has(m)?s.add(m):s.delete(m),t(n.get(m),m))})};const u=(h,d)=>{!o||!h.keysChanged.has(e)||l(a(),d)};return n.
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
pending}}}const Wc=new Map,Vc=new Map,Q5={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,
Float32Array,Float64Array,BigInt64Array,BigUint64Array};function ly(r="Uint8Array"){const e=Q5[r];if(!e)throw new Error(
`Unsupported typed array view: ${r}`);return e}function J5(r){return new r.constructor(r)}function uy(r){return ArrayBuffer.
isView(r)&&!(r instanceof DataView)}function X5(r){return r instanceof ArrayBuffer?new Uint8Array(r):uy(r)?new Uint8Array(
r.buffer,r.byteOffset,r.byteLength):Array.isArray(r)?Uint8Array.from(r):null}async function xd(r){const e=String(r);return Wc.
has(e)||Wc.set(e,Et(()=>import(`${e}`),[],import.meta.url)),Wc.get(e)}async function hp(r){const e=X5(r);if(e)
return e;if(typeof r=="string"||r instanceof URL){const t=await fetch(String(r));if(!t.ok)throw new Error(`Failed to fet\
ch wasm module: ${t.status} ${t.statusText}`);const n=await t.arrayBuffer();return new Uint8Array(n)}throw new Error("wa\
sm.source must be a URL string, URL, ArrayBuffer, TypedArray, or byte array")}async function Y5(r){if(typeof r=="string"||
r instanceof URL){const t=String(r);return Vc.has(t)||Vc.set(t,(async()=>{const n=await hp(r);return WebAssembly.compile(
n)})()),Vc.get(t)}const e=await hp(r);return WebAssembly.compile(e)}async function Z5(r,e){if(r.importsModule){const t=await xd(
r.importsModule),n=r.importsExport||"default",s=t[n];if(typeof s=="function")return await s(e)||{};if(s&&typeof s=="obje\
ct")return s;throw new Error(`WASM imports export "${n}" must be a function or object`)}return r.imports&&typeof r.imports==
"object"?r.imports:{}}function dy(r,e,t={}){const n=t.exportName||e.memoryExport||"memory",s=r.exports?.[n];if(!(s instanceof
WebAssembly.Memory))throw new Error(`WASM memory export "${n}" was not found`);return s}function e4(r,e){if(Object.prototype.
hasOwnProperty.call(r,"values"))return r.values;const t=r.dataKey||r.name;if(t&&e&&Object.prototype.hasOwnProperty.call(
e,t))return e[t]}function t4(r,e){if(r==null)return null;if(r instanceof e)return r;if(uy(r))return new e(r.buffer,r.byteOffset,
Math.floor(r.byteLength/e.BYTES_PER_ELEMENT));if(r instanceof ArrayBuffer)return new e(r);if(Array.isArray(r))return e.from(
r);throw new Error(`Unsupported memory input for ${e.name}`)}function fp(r,e,t){(Array.isArray(e.inputViews)?e.inputViews:
[]).forEach(s=>{const i=ly(s.view),o=t4(e4(s,t),i);if(!o)return;const a=dy(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0;new i(a.buffer,c,o.length).set(o)})}function r4(r,e){const t=Array.isArray(e.outputViews)?e.outputViews:[];if(t.length===
0)return null;const n={};return t.forEach((s,i)=>{const o=ly(s.view),a=dy(r,e,s),c=Number.isFinite(s.byteOffset)?s.byteOffset:
0,l=Number.isFinite(s.length)?s.length:0;if(l<=0)throw new Error(`WASM output view "${s.name||i}" must provide a positiv\
e length`);const u=s.name||`output${i}`;n[u]=J5(new o(a.buffer,c,l))}),n}function hy(r,e){return Array.isArray(e.args)?e.
args:Array.isArray(r.args)?r.args:Array.isArray(r.data?.args)?r.data.args:[]}function n4(r={}){const e=globalThis.navigator?.
gpu??null;if(r.webgpu?.required===!0&&!e)throw new Error("WebGPU is required for this task but navigator.gpu is unavaila\
ble");return{supported:!!e,gpu:e,async requestAdapter(n=r.webgpu?.adapterOptions){return e?e.requestAdapter(n):null},async requestDevice(n={}){
if(!e)return null;const s=n.adapter||await e.requestAdapter(n.adapterOptions||r.webgpu?.adapterOptions);return s?s.requestDevice(
n.deviceDescriptor||r.webgpu?.deviceDescriptor):null}}}async function fy(r){const e=r.wasm||{},t=e.source??r.wasmSource??
r.source;if(!t)throw new Error("wasm tasks require wasm.source");const n=await Y5(t),s=await Z5(e,{task:r,data:r.data??null,
WebAssembly}),i=await WebAssembly.instantiate(n,s);return fp(i,e,r.data??null),{module:n,instance:i,exports:i.exports,imports:s,
task:r,data:r.data??null,callExport(o,a=[]){const c=i.exports?.[o];if(typeof c!="function")throw new Error(`WASM export \
"${o}" was not found`);return c(...a)},readOutputViews(){return r4(i,e)},writeInputViews(o){fp(i,e,o)}}}async function s4(r,e,t){
const n=r.wasm||{};if(!n.resultModule)return t.value;const s=await xd(n.resultModule),i=n.resultExport||"default",o=s[i];
if(typeof o!="function")throw new Error(`WASM result export "${i}" must be a function`);const a=await o({...t,wasm:e,task:r,
data:r.data??null});return typeof a>"u"?t:a}async function i4(r){const e=await fy(r),t=r.wasm||{},n=hy(r,t),s=t.entry?await e.
callExport(t.entry,n):void 0,i=e.readOutputViews();return s4(r,e,{returnValue:s,outputs:i,value:i?typeof s>"u"?i:{returnValue:s,
outputs:i}:s})}async function o4(r){const e=await fy(r),t=r.hostModule||r.module;if(!t)throw new Error("wasm-webgpu task\
s require hostModule or module");r.wasm?.callEntryBeforeHost&&r.wasm.entry&&(e.entryResult=await e.callExport(r.wasm.entry,
hy(r,r.wasm)));const n=await xd(t),s=r.hostExport||r.exportName||"default",i=n[s];if(typeof i!="function")throw new Error(
`wasm-webgpu host export "${s}" must be a function`);return i({task:r,data:r.data??null,wasm:e,webgpu:n4(r)})}async function a4(r){
if(typeof r!="string"||!r.trim())throw new Error("module path must be a non-empty string");return r==="peercompute:model\
-inference"?Et(()=>Promise.resolve().then(()=>aR),void 0,import.meta.url):r==="peercompute:gguf-inference"?Et(
()=>import("./modelTask-unobKtl8.js"),__vite__mapDeps([0,1,2,3]),import.meta.url):r==="peercompute:diffusion-inference"?Et(()=>import("./modelTask-_nqpry9E.js"),
__vite__mapDeps([4,3,1,5]),import.meta.url):Et(()=>import(`${r}`),[],import.meta.url)}function c4(r={}){return typeof r.
runtime=="string"&&r.runtime.trim()?r.runtime.trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"j\
s"}async function l4(r,e){let t;if(r.fn?t=new Function(`return (${r.fn});`)():r.module&&(t=(await a4(r.module))[r.exportName||
"default"]),typeof t!="function")throw new Error("Handler not found for task");return t(r.data,e)}async function u4(r,e={}){
const t=c4(r);switch(t){case"js":return l4(r,e);case"wasm":return i4(r);case"wasm-webgpu":return o4(r);default:throw new Error(
`Unsupported compute runtime: ${t}`)}}const d4="peercompute.compute.solver-descriptor.v0",h4="peercompute.compute.solver\
-task.v0";function fa(r,e){const t=String(r||"").trim();if(!t)throw new Error(`${e} is required`);return t}function Ks(r){
return r==null?r:JSON.parse(JSON.stringify(r))}function f4(r){if(typeof r=="string")return{name:fa(r,"field.name"),unit:null,
dimensions:null,location:null};if(!r||typeof r!="object")throw new Error("field must be a string or object");return{name:fa(
r.name,"field.name"),unit:r.unit??null,dimensions:r.dimensions??null,location:r.location??null,role:r.role??null}}function Hc(r=[]){
if(!Array.isArray(r))throw new Error("fields must be an array");return r.map(f4)}function p4(r){return r.runtime?String(
r.runtime).trim().toLowerCase():r.wasm?r.hostModule||r.module?"wasm-webgpu":"wasm":"js"}function m4(r={}){if(!r||typeof r!=
"object")throw new Error("solver descriptor is required");const e=fa(r.id,"solver.id"),t=fa(r.kind||r.family,"solver.kin\
d"),n=p4(r),s=!!(r.module||r.fn||r.wasm||r.wasmSource||r.source);return{schema:d4,id:e,kind:t,version:r.version||"0.0.0",
label:r.label||e,description:r.description||"",runtime:n,module:r.module,exportName:r.exportName||"default",fn:r.fn,hostModule:r.
hostModule,hostExport:r.hostExport,wasm:r.wasm,wasmSource:r.wasmSource,source:r.source,webgpu:r.webgpu||null,inputFields:Hc(
r.inputFields||r.inputs||[]),outputFields:Hc(r.outputFields||r.outputs||[]),conservedFields:Hc(r.conservedFields||r.conserved||
[]),timestep:{mode:r.timestep?.mode||r.timestepMode||"explicit",maxDt:r.timestep?.maxDt??r.maxDt??null,subcycles:r.timestep?.
subcycles??r.subcycles??1},validity:Ks(r.validity||r.validityDomain||{}),affinity:{policy:r.affinity?.policy||r.affinityPolicy||
"state-key",keyFields:Array.isArray(r.affinity?.keyFields)?[...r.affinity.keyFields]:["solverId","stateKey"]},warmDelta:{
scope:r.warmDelta?.scope||r.scope||"solver-deltas",schema:r.warmDelta?.schema||`peercompute.solver.${e}.delta.v0`},metadata:Ks(
r.metadata||{}),hasExecutor:s}}class g4{constructor(e=[]){this.solvers=new Map;for(const t of e)this.register(t)}register(e){
const t=m4(e);return this.solvers.set(t.id,t),t}unregister(e){return this.solvers.delete(e)}has(e){return this.solvers.has(
e)}get(e){const t=this.solvers.get(e);if(!t)throw new Error(`Solver not registered: ${e}`);return t}list(){return Array.
from(this.solvers.values()).map(e=>Ks(e))}createTask(e,{id:t,input:n={},stateKey:s=n.stateKey||n.taskId||e,affinityKey:i,
scope:o,version:a,timestamp:c,data:l={},placementHint:u,webgpu:h}={}){const d=this.get(e);if(!d.hasExecutor)throw new Error(
`Solver has no executable task target: ${e}`);const p=t||`${d.id}:${s}:${Date.now()}`,m=o||d.warmDelta.scope,y=u??l.placementHint??
null;return{id:p,solverId:d.id,taskFamily:d.id,runtime:d.runtime,module:d.module,exportName:d.exportName,fn:d.fn,hostModule:d.
hostModule,hostExport:d.hostExport,wasm:d.wasm,wasmSource:d.wasmSource,source:d.source,webgpu:h||d.webgpu||void 0,affinityKey:i||
`${d.id}:${s}`,placementHint:Ks(y),data:{schema:h4,solver:{id:d.id,kind:d.kind,version:d.version,inputFields:d.inputFields,
outputFields:d.outputFields,conservedFields:d.conservedFields,timestep:d.timestep,validity:d.validity,warmDelta:{scope:m,
schema:d.warmDelta.schema}},stateKey:s,scope:m,version:a??null,timestamp:c??Date.now(),input:n,...l,placementHint:Ks(y)}}}}
const b4="peercompute.compute.gpu-resident-lane-manager.v0",y4="peercompute.compute.gpu-resident-lane.v0",w4="peercomput\
e.compute.gpu-resident-lane-lease.v0",k4="peercompute.compute.gpu-resident-lane-lease-identity.v0",E4="peercompute.compu\
te.gpu-resident-lane-execution.v0",py="peercompute.compute.gpu-resident-lane-copy-budget.v0",x4="peercompute.compute.gpu\
-fence-report.v0",v4="peercompute.compute.gpu-resident-lane-stage-plan.v0",S4="peercompute.compute.gpu-resident-lane-sta\
ge-execution.v0",A4="peercompute.compute.gpu-resident-lane-stage-placement-preflight.v0",au="queue.onSubmittedWorkDone-b\
efore-readback-map",my="explicit-stage-dependencies",pp="sequential-stage-order",_4="defer-read-write-conflicting-ready-\
stages";function Ki(r,e=0){const t=Number(r);return Number.isFinite(t)?t:e}function ie(r,e=null){return String(r??"").trim()||
e}function Ce(r,e=[]){return Array.isArray(r)?r.map(t=>ie(t)).filter(Boolean):typeof r=="string"?r.split(",").map(t=>ie(
t)).filter(Boolean):[...e]}function ue(r){return r==null?r:JSON.parse(JSON.stringify(r))}function mp(r={}){const e=r?.residentSequenceLaneContract||
r?.residentLaneContract||r?.laneContract||r?.executionContract||null;return!e||typeof e!="object"?null:ue(e)}function I4(r={},e=0){
const t=ie(r.id,`stage:${e}`);return{...ue(r),id:t,index:e,lawNodeId:ie(r.lawNodeId,null),runtimeTarget:ie(r.runtimeTarget,
null),dependsOn:Ce(r.dependsOn??r.dependencies),inputFrom:ie(r.inputFrom??r.primaryInputFrom??r.inputStageId,null),reads:Ce(
r.reads??r.readFamilies),writes:Ce(r.writes??r.writeFamilies)}}function Qi(r=null,{laneId:e=null,stateKey:t=null,domainKey:n=null,
queueFencePolicy:s=null}={}){if(!r||typeof r!="object")return null;const i=Array.isArray(r.passDagStages)?r.passDagStages.
map((a,c)=>I4(a,c)):[],o=ie(r.stageDependencyMode??r.dependencyMode,i.some(a=>a.dependsOn.length>0)||r.parallelStageExecution===
!0?"explicit-stage-dependencies":"sequential-stage-order");return{schema:v4,status:i.length>0?r.sequenceRunnable===!0?"c\
ontract-stage-plan-ready":"contract-stage-plan-review-only":"contract-stage-plan-empty",authority:"compute-manager-gpu-r\
esident-lane-manager",laneId:ie(r.laneId,e),stateKey:ie(r.stateKey,t),domainKey:ie(r.domainKey,n),queueFencePolicy:ie(r.
queueFencePolicy,s||au),contractSchema:ie(r.schema,null),contractStatus:ie(r.status,null),sequenceMode:ie(r.sequenceMode,
null),sequenceRunnable:r.sequenceRunnable===!0,defaultEnabled:r.defaultEnabled===!0,dependencyMode:o,parallelStageExecution:o===
"explicit-stage-dependencies",stageCount:i.length,stages:i}}function C4(r={}){const e=r&&typeof r=="object"?r:{value:r};
return{value:Object.prototype.hasOwnProperty.call(e,"value")?e.value:r,retainedBufferRefs:Ce(e.retainedBufferRefs??e.gpuFence?.
retainedBufferRefs),gpuFence:e.gpuFence&&typeof e.gpuFence=="object"?ue(e.gpuFence):null,summary:e.summary&&typeof e.summary==
"object"?ue(e.summary):null}}function pa(r={}){const e=r.copyBudget&&typeof r.copyBudget=="object"?r.copyBudget:r;return{
schema:py,uploadBytes:Math.max(0,Math.round(Ki(e.uploadBytes??e.expectedUploadBytes,0))),readbackBytes:Math.max(0,Math.round(
Ki(e.readbackBytes??e.expectedReadbackBytes,0))),retainedBytes:Math.max(0,Math.round(Ki(e.retainedBytes??e.expectedRetainedBytes,
0))),compactSummaryBytes:Math.max(0,Math.round(Ki(e.compactSummaryBytes??e.summaryBytes,0))),fullReadbackReason:ie(e.fullReadbackReason??
e.readbackReason,null)}}function T4(r={},e={}){const t=pa(r),n=pa(e);return{schema:py,uploadBytes:t.uploadBytes+n.uploadBytes,
readbackBytes:t.readbackBytes+n.readbackBytes,retainedBytes:Math.max(t.retainedBytes,n.retainedBytes),compactSummaryBytes:t.
compactSummaryBytes+n.compactSummaryBytes,fullReadbackReason:n.fullReadbackReason||t.fullReadbackReason||null}}function M4(r={}){
return r.parallelStageExecution===!0||r.dependencyMode===my||(r.stages||[]).some(e=>(e.dependsOn||[]).length>0)}function R4(r,{
baseInput:e=null,currentValue:t=null,stageValues:n={}}={}){if(r.inputFrom&&Object.prototype.hasOwnProperty.call(n,r.inputFrom))
return n[r.inputFrom];const s=Ce(r.dependsOn);return s.length===1&&Object.prototype.hasOwnProperty.call(n,s[0])?n[s[0]]:
s.length>1?{source:"gpu-resident-lane-stage-dependencies",dependencyResults:Object.fromEntries(s.map(i=>[i,n[i]])),previousValue:t,
baseInput:e}:t}function Kc(r=[],e=[]){const t=new Set(Ce(e));return Ce(r).filter(n=>t.has(n))}function B4(r={},e={}){const t=Kc(
r.writes,e.writes);if(t.length>0)return{conflictType:"write-write",families:t};const n=Kc(r.writes,e.reads);if(n.length>
0)return{conflictType:"write-read",families:n};const s=Kc(r.reads,e.writes);return s.length>0?{conflictType:"read-write",
families:s}:null}function L4(r=[]){const e=[],t=[];for(const n of r){const s=e.map(i=>({stage:i,conflict:B4(i,n)})).find(
i=>i.conflict);s?t.push({stageId:n.id,blockedByStageId:s.stage.id,conflictType:s.conflict.conflictType,families:s.conflict.
families}):e.push(n)}return{batch:e,deferred:t}}function D4(r={}){const e=new Set((r.stages||[]).map(t=>t.id));for(const t of r.
stages||[])for(const n of t.dependsOn||[])if(!e.has(n)){const s=new Error(`GPU resident lane stage ${t.id} depends on un\
known stage ${n}`);throw s.code="ERR_GPU_RESIDENT_LANE_STAGE_DEPENDENCY_MISSING",s.stage=ue(t),s}}function gp(r={}){D4(r);
const e=M4(r),t=[],n=[];if(e){const s=new Map((r.stages||[]).map(o=>[o.id,o])),i=new Set;for(;s.size>0;){const o=(r.stages||
[]).filter(u=>s.has(u.id)).filter(u=>(u.dependsOn||[]).every(h=>i.has(h)));if(!o.length){const u=new Error(`GPU resident\
 lane stage plan has a cycle or unsatisfied dependencies: ${Array.from(s.keys()).join(", ")}`);throw u.code="ERR_GPU_RES\
IDENT_LANE_STAGE_DEPENDENCY_CYCLE",u}const{batch:a,deferred:c}=L4(o),l=t.length;n.push(...c.map(u=>({...u,batchIndex:l}))),
t.push(a.map(u=>u.id));for(const u of a)s.delete(u.id),i.add(u.id)}}else for(const s of r.stages||[])t.push([s.id]);return{
dependencyMode:e?my:pp,parallelStageExecution:e,stateFamilyConflictPolicy:e?_4:pp,stateFamilyConflictDeferrals:n,stateFamilyConflictDeferralCount:n.
length,executionBatches:t,maxConcurrentStageCount:t.reduce((s,i)=>Math.max(s,i.length),0)}}function P4(r={},{batchIndex:e=-1,
executorSource:t=null,gpuHubExecutorDescriptor:n=null}={}){const s=ue(n?.workerPolicy),i=ie(s?.mode,null),o=s?.status===
"worker-ready",a=i==="dedicated-worker";let c="missing-stage-executor";return t==="stage-plan-executor"?c="stage-plan-ex\
ecutor":t==="provided-stage-executor"?c="provided-stage-executor":t==="gpu-hub-resident-stage-executor"&&(o?c="gpu-hub-w\
orker-resident-stage":a?c="gpu-hub-inline-fallback-for-worker-stage":c="gpu-hub-inline-resident-stage"),{stageId:r.id,lawNodeId:r.
lawNodeId,runtimeTarget:r.runtimeTarget,batchIndex:e,dependsOn:Ce(r.dependsOn),inputFrom:ie(r.inputFrom,null),reads:Ce(r.
reads),writes:Ce(r.writes),executorSource:t,placementTarget:c,gpuHubExecutorDescriptor:ue(n),workerPolicy:s,workerResidencyStatus:s?.
status||null,workerRequested:a,workerReady:o,sameDeviceRequired:s?.sameDeviceRequired===!0,bufferTransferPolicy:s?.bufferTransferPolicy||
null}}function $4(r){return["gpu-fence-completed","queue-work-completed","readback-map-completed","ordered-before-consum\
er-queue-completed"].includes(String(r||""))}class N4{constructor({gpuHub:e=null,deviceId:t="gpu-hub",now:n=()=>Date.now()}={}){
this.gpuHub=e,this.deviceId=t,this.now=n,this.lanes=new Map,this.leases=new Map,this.nextLeaseOrdinal=1,this.stats={schema:b4,
laneCount:0,activeLeaseCount:0,completedLeaseCount:0,rejectedLeaseCount:0,totalUploadBytes:0,totalReadbackBytes:0,totalCompactSummaryBytes:0,
maxRetainedBytes:0,lastFence:null}}resolveLaneId({laneId:e,stateKey:t,domainKey:n,solverId:s}={}){return ie(e,`gpu-lane:${ie(
t||n||s,"default")}`)}getOrCreateLane(e={}){const t=this.resolveLaneId(e),n=ie(e.stateKey,null),s=ie(e.sourceFamily,null),
i=this.lanes.get(t);if(i){if(n&&i.stateKey&&i.stateKey!==n)throw new Error(`GPU resident lane ${t} already owns stateKey\
 ${i.stateKey}, not ${n}`);if(n&&!i.stateKey&&(i.stateKey=n),s&&i.sourceFamily&&i.sourceFamily!==s)throw new Error(`GPU \
resident lane ${t} already owns sourceFamily ${i.sourceFamily}, not ${s}`);return s&&!i.sourceFamily&&(i.sourceFamily=s),
e.domainKey&&!i.domainKey&&(i.domainKey=ie(e.domainKey,null)),e.solverId&&!i.solverId&&(i.solverId=ie(e.solverId,null)),
i}const o={schema:y4,laneId:t,stateKey:n,sourceFamily:s,domainKey:ie(e.domainKey,null),solverId:ie(e.solverId,null),deviceId:ie(
e.deviceId,this.deviceId),queueFencePolicy:ie(e.queueFencePolicy,au),status:"ready",activeLeases:new Map,retainedBufferRefs:new Set(
Ce(e.retainedBufferRefs)),copyBudget:pa(e.copyBudget||{}),residentSequenceLaneContract:mp(e),stagePlan:null,createdAt:this.
now(),updatedAt:this.now(),lastFence:null};return o.stagePlan=Qi(o.residentSequenceLaneContract,o),this.lanes.set(t,o),this.
stats.laneCount=this.lanes.size,o}acquireLease(e={}){const t=this.getOrCreateLane(e),n=ie(e.leaseId,`${t.laneId}:lease:${this.
nextLeaseOrdinal++}`);if(this.leases.has(n))throw new Error(`GPU resident lane lease already exists: ${n}`);const s=pa(e.
copyBudget||{}),i=mp(e)||ue(t.residentSequenceLaneContract),o=Qi(i,{laneId:t.laneId,stateKey:t.stateKey,domainKey:t.domainKey,
queueFencePolicy:t.queueFencePolicy});i&&(t.residentSequenceLaneContract=ue(i),t.stagePlan=ue(o));const a={schema:w4,leaseId:n,
laneId:t.laneId,stateKey:t.stateKey,sourceFamily:ie(e.sourceFamily,t.sourceFamily),domainKey:t.domainKey,solverId:ie(e.solverId,
t.solverId),taskId:ie(e.taskId,null),owner:ie(e.owner,"compute-manager"),readFamilies:Ce(e.readFamilies),writeFamilies:Ce(
e.writeFamilies),retainedBufferRefs:Ce(e.retainedBufferRefs),copyBudget:s,queueFencePolicy:t.queueFencePolicy,residentSequenceLaneContract:i,
stagePlan:o,stageExecution:null,status:"active",acquiredAt:this.now(),releasedAt:null,releaseReason:null,gpuFence:null};
this.leases.set(n,a),t.activeLeases.set(n,a),t.copyBudget=T4(t.copyBudget,s);for(const c of a.retainedBufferRefs)t.retainedBufferRefs.
add(c);return t.updatedAt=this.now(),this.stats.activeLeaseCount=this.leases.size,this.stats.totalUploadBytes+=s.uploadBytes,
this.stats.totalReadbackBytes+=s.readbackBytes,this.stats.totalCompactSummaryBytes+=s.compactSummaryBytes,this.stats.maxRetainedBytes=
Math.max(this.stats.maxRetainedBytes,s.retainedBytes),ue(a)}createFenceReport(e,{status:t="queue-work-completed",method:n="\
queue.onSubmittedWorkDone",queueCompletionStatus:s=t,queueCompletionMethod:i=n,readbackCompletionStatus:o=null,readbackCompletionMethod:a=null,
retainedBufferRefs:c=null,completed:l=null,source:u="gpu-resident-lane-manager"}={}){const h=typeof e=="string"?this.leases.
get(e):e;if(!h)throw new Error(`Unknown GPU resident lane lease: ${e}`);const d=this.lanes.get(h.laneId),p=l==null?$4(t):
l===!0;return{schema:x4,status:t,method:n,fenceSatisfied:p,required:!0,laneId:h.laneId,stateKey:h.stateKey,queueFencePolicy:h.
queueFencePolicy||d?.queueFencePolicy||au,queueCompletionStatus:s,queueCompletionMethod:i,readbackCompletionStatus:o,readbackCompletionMethod:a,
retainedBufferRefs:Ce(c,h.retainedBufferRefs),workerId:null,deviceId:d?.deviceId||this.deviceId,completedAt:p?this.now():
null,source:u}}completeLease(e,t={}){const n=this.leases.get(e);if(!n)throw new Error(`Unknown GPU resident lane lease: ${e}`);
const s=this.lanes.get(n.laneId),i=this.createFenceReport(n,t);if(n.status=i.fenceSatisfied?"completed":"completed-unsat\
isfied-fence",n.gpuFence=i,n.releasedAt=this.now(),n.releaseReason=t.releaseReason||n.status,Array.isArray(t.retainedBufferRefs)&&
(n.retainedBufferRefs=Ce(t.retainedBufferRefs)),s){s.activeLeases.delete(e),s.lastFence=i,s.updatedAt=this.now();for(const o of n.
retainedBufferRefs)s.retainedBufferRefs.add(o)}return this.leases.delete(e),this.stats.activeLeaseCount=this.leases.size,
this.stats.completedLeaseCount+=1,this.stats.lastFence=ue(i),{schema:E4,lease:ue(n),gpuFence:i,lane:s?this.snapshotLane(
s.laneId):null,residentSequenceLaneContract:ue(n.residentSequenceLaneContract),stagePlan:ue(n.stagePlan),stageExecution:ue(
n.stageExecution)}}async executeStagePlan(e,{input:t=null,context:n={},executor:s=null,stageExecutors:i={},allowMissingExecutors:o=!1}={}){
const a=typeof e=="string"?this.leases.get(e):e;if(!a)throw new Error(`Unknown GPU resident lane lease: ${e}`);const c=this.
lanes.get(a.laneId),l=a.stagePlan||Qi(a.residentSequenceLaneContract,{laneId:a.laneId,stateKey:a.stateKey,domainKey:a.domainKey,
queueFencePolicy:a.queueFencePolicy});if(!l||!Array.isArray(l.stages)||l.stages.length===0){const k=new Error(`GPU resid\
ent lane lease ${a.leaseId} has no executable stage plan`);throw k.code="ERR_GPU_RESIDENT_LANE_STAGE_PLAN_MISSING",k}const u=this.
now(),h=[],d={},p=gp(l),m=new Map(l.stages.map(k=>[k.id,k]));let y=t;const b=async(k,x)=>{let A=typeof s=="function"?s:i?.[k.
id]||i?.[k.lawNodeId],v=typeof s=="function"?"stage-plan-executor":A?"provided-stage-executor":null;typeof A!="function"&&
this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor=="function"&&this.gpuHub.hasResidentStageExecutor(k)&&typeof this.
gpuHub.executeResidentStage=="function"&&(A=$=>this.gpuHub.executeResidentStage($),v="gpu-hub-resident-stage-executor");
const E=v==="gpu-hub-resident-stage-executor"&&typeof this.gpuHub?.describeResidentStageExecutor=="function"?this.gpuHub.
describeResidentStageExecutor(k):null;if(typeof A!="function"){if(!o){const $=new Error(`Missing GPU resident lane stage\
 executor: ${k.id}`);throw $.code="ERR_GPU_RESIDENT_LANE_STAGE_EXECUTOR_MISSING",$.stage=ue(k),$}return{result:{stageId:k.
id,lawNodeId:k.lawNodeId,status:"blocked-missing-stage-executor",retainedBufferRefs:[],workerResidency:null},value:x}}const C=this.
now(),I=await A({stage:ue(k),stageIndex:k.index,input:x,lease:ue(a),lane:c?this.snapshotLane(c.laneId):null,context:n}),
M=C4(I),R=Ce(M.retainedBufferRefs);if(R.length>0&&(a.retainedBufferRefs=Ce([...a.retainedBufferRefs,...R]),c)){for(const $ of R)
c.retainedBufferRefs.add($);c.updatedAt=this.now()}return{result:{stageId:k.id,lawNodeId:k.lawNodeId,runtimeTarget:k.runtimeTarget,
status:"completed",executorSource:v,startedAt:C,completedAt:this.now(),retainedBufferRefs:R,gpuFence:M.gpuFence,workerResidency:ue(
E?.workerPolicy),summary:M.summary},value:M.value}};if(p.parallelStageExecution===!0)for(const k of p.executionBatches){
const x=k.map(v=>m.get(v)).filter(Boolean),A=await Promise.all(x.map(v=>b(v,R4(v,{baseInput:t,currentValue:y,stageValues:d}))));
for(let v=0;v<x.length;v+=1){const E=x[v],C=A[v];d[E.id]=C.value,y=C.value,h.push(C.result)}}else for(const k of p.executionBatches){
const x=m.get(k[0]),A=await b(x,y);y=A.value,d[x.id]=A.value,h.push(A.result)}const g=h.some(k=>k.status!=="completed"),
w={schema:S4,status:g?"blocked":"completed",leaseId:a.leaseId,laneId:a.laneId,stateKey:a.stateKey,stagePlan:ue(l),stageCount:l.
stages.length,completedStageCount:h.filter(k=>k.status==="completed").length,dependencyMode:p.dependencyMode,parallelStageExecution:p.
parallelStageExecution,stateFamilyConflictPolicy:p.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:p.stateFamilyConflictDeferrals,
stateFamilyConflictDeferralCount:p.stateFamilyConflictDeferralCount,executionBatches:p.executionBatches,maxConcurrentStageCount:p.
maxConcurrentStageCount,stageResults:h,retainedBufferRefs:Ce(a.retainedBufferRefs),output:y,startedAt:u,completedAt:this.
now()};return a.stageExecution=ue(w),c&&(c.updatedAt=this.now()),w}preflightStagePlacement(e,{executor:t=null,stageExecutors:n={},
allowMissingExecutors:s=!1}={}){const i=typeof e=="string"?this.leases.get(e):e;if(!i)throw new Error(`Unknown GPU resid\
ent lane lease: ${e}`);const o=this.lanes.get(i.laneId),a=i.stagePlan||Qi(i.residentSequenceLaneContract,{laneId:i.laneId,
stateKey:i.stateKey,domainKey:i.domainKey,queueFencePolicy:i.queueFencePolicy});if(!a||!Array.isArray(a.stages)||a.stages.
length===0){const b=new Error(`GPU resident lane lease ${i.leaseId} has no executable stage plan`);throw b.code="ERR_GPU\
_RESIDENT_LANE_STAGE_PLAN_MISSING",b}const c=gp(a),l=new Map;c.executionBatches.forEach((b,f)=>{for(const g of b)l.set(g,
f)});const u=a.stages.map(b=>{let f=typeof t=="function"?t:n?.[b.id]||n?.[b.lawNodeId],g=typeof t=="function"?"stage-pla\
n-executor":f?"provided-stage-executor":null,w=null;return typeof f!="function"&&this.gpuHub&&typeof this.gpuHub.hasResidentStageExecutor==
"function"&&this.gpuHub.hasResidentStageExecutor(b)&&typeof this.gpuHub.describeResidentStageExecutor=="function"&&(w=this.
gpuHub.describeResidentStageExecutor(b),g="gpu-hub-resident-stage-executor"),P4(b,{batchIndex:l.get(b.id)??-1,executorSource:g,
gpuHubExecutorDescriptor:w})}),h=u.filter(b=>!b.executorSource).map(b=>b.stageId),d=u.filter(b=>b.workerRequested).map(b=>b.
stageId),p=u.filter(b=>b.workerReady).map(b=>b.stageId),m=u.filter(b=>b.workerRequested&&!b.workerReady).map(b=>b.stageId),
y=s===!0||h.length===0;return{schema:A4,status:y?"placement-preflight-ready":"blocked-missing-stage-executors",authority:"\
compute-manager-gpu-resident-lane-manager",advisory:!0,leaseId:i.leaseId,laneId:i.laneId,stateKey:i.stateKey,domainKey:i.
domainKey,deviceId:o?.deviceId||this.deviceId,stagePlan:ue(a),stageCount:a.stages.length,dependencyMode:c.dependencyMode,
parallelStageExecution:c.parallelStageExecution,stateFamilyConflictPolicy:c.stateFamilyConflictPolicy,stateFamilyConflictDeferrals:c.
stateFamilyConflictDeferrals,stateFamilyConflictDeferralCount:c.stateFamilyConflictDeferralCount,placementBatches:c.executionBatches,
maxConcurrentStageCount:c.maxConcurrentStageCount,stagePlacements:u,executorSources:Object.fromEntries(u.map(b=>[b.stageId,
b.executorSource])),workerResidencyStatuses:Object.fromEntries(u.map(b=>[b.stageId,b.workerResidencyStatus])),missingExecutorStageIds:h,
missingExecutorCount:h.length,workerRequestedStageIds:d,workerRequestedCount:d.length,workerReadyStageIds:p,workerReadyCount:p.
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
function U4(){return new Worker(new URL(""+new URL("computeWorker-CVoC4HQV.js",import.meta.url).href,import.meta.url),{type:"\
module"})}const bp=128,yp=5e3,F4="peercompute.compute.worker-utilization.v0",wp="peercompute.compute.task-placement.v0",
O4="peercompute.compute.remote-placement-provenance.v0",Qc="peercompute.compute.remote-placement-verification.v0",kp="pe\
ercompute.compute.remote-placement-validation.v0",Ts="peercompute.compute.remote-placement-retry.v0",Ep="peercompute.com\
pute.remote-task-envelope.v0",xp="peercompute.compute.task-packet.v0",z4="peercompute.compute.task-execution.v0",vp="pee\
rcompute.compute.task-graph-result.v0",q4="peercompute.compute.task-graph-context.v0",j4="peercompute.compute.task-graph\
-cache-policy.v0",G4="peercompute.compute.task-graph-cache-inputs.v0",W4="peercompute.compute.task-graph-cache-artifact.\
v0",cu="peercompute.compute.task-graph-cache-admission.v0",Sp="peercompute.compute.remote-task-graph-cache-import.v0",V4="\
peercompute.compute.remote-task-graph-state-seed-policy.v0",H4="peercompute.compute.task-graph-placement-policy.v0",Jc="\
peercompute.compute.task-graph-cancellation.v0",gy="peercompute.compute.task-graph-gpu-resident-lane.v0",K4="peercompute\
.compute.gpu-fence-report.v0",Rn=["timeout","executor-error"],Ji=["rejected","verification-failed","validation-failed"],
Q4=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxComputeInvocationsPerWorkgroup","\
maxComputeWorkgroupsPerDimension"];function X(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Math.floor(Number(r));return Number.
isFinite(s)?Math.min(n,Math.max(t,s)):e}function ut(r,e,t=0,n=Number.MAX_SAFE_INTEGER){const s=Number(r);return Number.isFinite(
s)?Math.min(n,Math.max(t,s)):e}function J4({cpuCores:r,deviceMemoryGB:e,gpuAvailable:t,declaredTier:n}){return n?String(
n):r>=32||e>=64?"cluster":t&&(r>=12||e>=16)?"workstation":r<=4||e&&e<=4?"mobile":"laptop"}function lu(r){return r==="clu\
ster"?8192:r==="workstation"?2048:r==="mobile"?384:1024}function by(r){return r==="cluster"?4096:r==="workstation"?1024:
r==="mobile"?192:512}function X4({tier:r,deviceMemoryGB:e}){const t=lu(r);if(!e)return t;const n=e*1024*.25;return Math.
max(128,Math.min(t,n))}function yy(r={}){if(!r)return null;const e=r.gpuLimits||r,t={};for(const n of Q4){const s=X(e[n],
null,0,Number.MAX_SAFE_INTEGER);s!=null&&(t[n]=s)}return Object.keys(t).length>0?t:null}function Xc(r={},e={}){const t=typeof navigator<
"u"?navigator:null,n=X(r.cpuCores??r.hardwareConcurrency??t?.hardwareConcurrency,4,1,512),s=ut(r.deviceMemoryGB??r.deviceMemory??
t?.deviceMemory,null,0,2048),i=r.gpuAvailable??e.webgpu??!!t?.gpu,o=J4({cpuCores:n,deviceMemoryGB:s??0,gpuAvailable:i,declaredTier:r.
tier||r.deviceClass}),a=ut(r.memoryBudgetMB??r.ramBudgetMB,X4({tier:o,deviceMemoryGB:s}),0,1048576),c=ut(r.gpuMemoryBudgetMB??
r.gpuBudgetMB??r.vramBudgetMB,i?by(o):0,0,1048576),l=ut(r.budgetScale??r.resourceBudgetScale??r.computeScale,1,.05,64),u=yy(
r.gpuLimits||{maxBufferSize:r.gpuMaxBufferSize??r.maxBufferSize,maxStorageBufferBindingSize:r.gpuMaxStorageBufferBindingSize??
r.maxStorageBufferBindingSize,maxComputeWorkgroupStorageSize:r.gpuMaxComputeWorkgroupStorageSize??r.maxComputeWorkgroupStorageSize,
maxComputeInvocationsPerWorkgroup:r.gpuMaxComputeInvocationsPerWorkgroup??r.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupsPerDimension:r.
gpuMaxComputeWorkgroupsPerDimension??r.maxComputeWorkgroupsPerDimension});return{schema:"peercompute.compute.resource-pr\
ofile.v0",tier:o,cpuCores:n,deviceMemoryGB:s,memoryBudgetMB:a,gpuMemoryBudgetMB:c,budgetScale:l,gpuLimits:u,gpuLimitsSource:u?
r.gpuLimitsSource||"configured":null,gpuAvailable:!!i,wasmAvailable:!!e.wasm,source:r.source||(r.tier?"configured":"brow\
ser")}}function Y4(r){const e=r.cpuCores||4;return r.tier==="cluster"?Math.min(64,Math.max(8,e)):r.tier==="workstation"?
Math.min(16,Math.max(4,e)):r.tier==="mobile"?Math.min(2,Math.max(1,e)):Math.min(8,Math.max(2,Math.floor(e*.75)))}function Yc(r={},e){
const t=X(r.maxWorkers,null,1,bp),n=Y4(e),s=t??Math.min(bp,Math.max(n,e.cpuCores||n)),i=X(r.minWorkers,Math.min(s,e.tier===
"mobile"?1:2),0,s),o=X(r.targetWorkers??r.initialWorkers,Math.min(s,Math.max(i,n)),i,s);return{schema:"peercompute.compu\
te.worker-policy.v0",autoScale:r.autoScaleWorkers!==!1,minWorkers:i,targetWorkers:o,maxWorkers:s,scaleUpQueueDepth:X(r.scaleUpQueueDepth,
1,1,1024),idleScaleDownMs:X(r.idleScaleDownMs,5e3,0,6e5)}}function Z4(r){return r==="cluster"?4:r==="workstation"?2:r===
"mobile"?.5:1}function eT(r){return r==="cluster"?4:r==="workstation"?2:1}function tT(r){return r==="cluster"?64:r==="wo\
rkstation"?16:r==="mobile"?2:8}function Xi(r,e=1){return ut(r,e,.25,8)}function rT(r){const e=String(r||"");return e==="\
manual"||e==="demo-api"||e.startsWith("manual-")||e.startsWith("user-")}function nT(r,e){const t=Math.max(1,e);return Math.
max(t,Math.round(r/t)*t)}function pt(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():
Date.now()}function sT(r){const e=Math.max(0,Number(r)||0);return e<=0?Promise.resolve():new Promise(t=>setTimeout(t,e))}
function Zc(){return{submitted:0,completed:0,failed:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0}}
function iT(){return{submitted:0,attempted:0,completed:0,failed:0,retried:0,retryExhausted:0,timedOut:0,rejected:0,verificationFailed:0,
validationFailed:0}}function oe(r,e=[]){return Array.isArray(r)?r.map(t=>String(t||"").trim()).filter(Boolean):typeof r==
"string"?r.split(",").map(t=>t.trim()).filter(Boolean):[...e]}function Yi(...r){const e=new Set,t=[];for(const n of r)for(const s of oe(
n,[]))e.has(s)||(e.add(s),t.push(s));return t}function Z(...r){for(const e of r)if(e!=null)return e;return null}function oT(r={}){
const e=r.webgpu||r.data?.webgpu||{},t=r.gpuFence||r.gpuFenceRequirement||e.gpuFence||e.fence||e.fenceRequirement||{},n=t.
required===!0||t.fenceRequired===!0||e.fenceRequired===!0||e.requiresFence===!0||e.requiresQueueFence===!0,s=Z(t.laneId,
t.gpuLaneId,e.laneId,e.gpuLaneId),i=Z(t.stateKey,t.gpuStateKey,e.stateKey,e.gpuStateKey,r.stateKey,r.data?.stateKey,r.data?.
input?.stateKey),o=Z(t.queueFencePolicy,t.fencePolicy,e.queueFencePolicy,e.fencePolicy),a=oe(t.retainedBufferRefs??e.retainedBufferRefs,
[]);return!n&&!s&&!i&&!o&&a.length===0?null:{schema:"peercompute.compute.gpu-fence-requirement.v0",required:n,laneId:s?String(
s):null,stateKey:i?String(i):null,queueFencePolicy:o?String(o):null,retainedBufferRefs:a,source:t.source||(e&&Object.keys(
e).length>0?"task.webgpu":"task.gpuFence")}}function aT(r={},e=null){const t=r.webgpu||r.data?.webgpu||{},n=r.gpuResidentLane||
r.gpuResidentLaneLease||r.residentLane||t.gpuResidentLane||t.residentLane||{},s=Z(n.residency,t.residency,r.residency,r.
data?.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===!0||String(s||"").trim().toLowerCase()==="gpu-lane",
o=Z(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId,e?.laneId),a=Z(n.stateKey,n.gpuStateKey,t.stateKey,t.gpuStateKey,r.stateKey,
r.data?.stateKey,r.data?.input?.stateKey,e?.stateKey),c=Z(n.domainKey,n.domain,t.domainKey,r.domainKey,r.data?.domainKey),
l=Z(n.sourceFamily,t.sourceFamily,r.data?.sourceFamily,r.data?.input?.sourceFamily),u=Z(n.queueFencePolicy,n.fencePolicy,
t.queueFencePolicy,e?.queueFencePolicy),h=oe(n.retainedBufferRefs??t.retainedBufferRefs,e?.retainedBufferRefs||[]),d=n.copyBudget&&
typeof n.copyBudget=="object"?JSON.parse(JSON.stringify(n.copyBudget)):t.copyBudget&&typeof t.copyBudget=="object"?JSON.
parse(JSON.stringify(t.copyBudget)):{},p=Z(n.residentSequenceLaneContract,n.residentLaneContract,n.laneContract,t.residentSequenceLaneContract,
r.data?.residentSequenceLaneContract,r.data?.input?.residentSequenceLaneContract,r.lawGraphNode?.residentSequenceLaneContract,
null);return!i&&!o&&!a&&h.length===0&&Object.keys(d).length===0?null:{schema:"peercompute.compute.gpu-resident-lane-task\
.v0",enabled:!0,localExecution:String(Z(n.localExecution,n.executionMode,t.localExecution,"inline")||"inline").trim().toLowerCase()===
"worker"?"worker":"inline",laneId:o?String(o):null,stateKey:a?String(a):null,sourceFamily:l?String(l):null,domainKey:c?String(
c):null,solverId:Z(n.solverId,r.solverId,r.data?.solverId)||null,owner:Z(n.owner,r.owner,r.taskFamily,r.solverId,"comput\
e-manager-task"),readFamilies:oe(n.readFamilies??n.reads??t.readFamilies),writeFamilies:oe(n.writeFamilies??n.writes??t.
writeFamilies),retainedBufferRefs:h,queueFencePolicy:u?String(u):null,copyBudget:d,residentSequenceLaneContract:p&&typeof p==
"object"?se(p):null}}function se(r){if(r==null)return r;if(typeof structuredClone=="function")try{return structuredClone(
r)}catch{}return JSON.parse(JSON.stringify(r))}function cT(r={},e=[]){const t=r.cacheInputs||r.cachePolicy?.inputs||r.cache?.
inputs||r.inputRefs||null,n=t&&typeof t=="object"?t:{},s=oe(n.stateRefs??n.states??r.stateRefs),i=oe(n.closureRefs??n.closures??
r.closureRefs),o=oe(n.invalidationRefs??n.invalidates??r.invalidationRefs),a=oe(n.retainedBufferRefs??r.retainedBufferRefs),
c=oe(n.inputHashes??n.hashes??r.inputHashes),l=oe(n.lawIds??n.laws??r.lawIds),u=oe(n.stateFamilies??r.stateFamilies),h=oe(
n.readFamilies??r.readFamilies),d=oe(n.writeFamilies??r.writeFamilies),p=Z(n.values,n.value,n.parameters,r.cacheInputValues,
null),m=e.map(g=>({id:g.id,dependsOn:[...g.dependsOn],taskFamily:g.taskFamily||g.task?.taskFamily||g.task?.solverId||null,
solverId:g.solverId||g.task?.solverId||null,cacheInput:Z(g.cacheInput,g.cacheInputs,g.task?.cacheInput,null)}));if(!(t!=
null||s.length>0||i.length>0||o.length>0||a.length>0||c.length>0||l.length>0||u.length>0||h.length>0||d.length>0||p!=null||
m.some(g=>g.cacheInput!=null||g.taskFamily||g.solverId)))return null;const b={graphFamily:String(Z(n.graphFamily,r.graphFamily,
r.taskFamily,"task-graph")||"task-graph"),graphVersion:String(Z(n.graphVersion,r.graphVersion,r.version,"v0")||"v0"),lawGraphId:Z(
n.lawGraphId,r.lawGraphId,null),stateRefs:s,closureRefs:i,invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,
stateFamilies:u,readFamilies:h,writeFamilies:d,scaleRegime:Z(n.scaleRegime,r.scaleRegime,null),units:Z(n.units,r.units,null),
values:p,nodes:m},f=Js(Qs(b));return{schema:G4,status:"content-addressed-inputs-declared",inputHash:f,stateRefs:s,closureRefs:i,
invalidationRefs:o,retainedBufferRefs:a,inputHashes:c,lawIds:l,stateFamilies:u,readFamilies:h,writeFamilies:d,nodeCount:e.
length,source:t?"graph.cacheInputs":"graph-derived-input-refs"}}function lT(r={},e=[]){const t=r.cachePolicy||r.cache||{},
n=String(Z(r.cacheKey,t.cacheKey,t.key,"")||"").trim()||null,s=cT(r,e),i=String(Z(t.scope,r.cacheScope,"compute-manager-\
local")||"compute-manager-local"),o=s?`${i}:${s.inputHash}`:null,a=n||o,c=String(Z(r.cacheMode,t.mode,a?"read-through":"\
disabled")||"disabled").trim().toLowerCase(),l=t.enabled!==!1&&a!=null&&c!=="disabled"&&c!=="off";let u="disabled";return l&&
(c==="record-only"||c==="write-only"?u="record-only":c==="read-only"?u="read-only":u="read-through"),{schema:j4,cacheKey:a,
mode:u,readEnabled:u==="read-through"||u==="read-only",writeEnabled:u==="read-through"||u==="record-only",ttlMs:X(t.ttlMs??
r.cacheTtlMs,0,0,Number.MAX_SAFE_INTEGER),scope:i,requireAdmitted:t.requireAdmitted!==!1&&r.cacheRequireAdmitted!==!1,explicitCacheKey:n,
derivedCacheKey:o,keySource:n?"explicit":o?"content-addressed-inputs":null,inputHash:s?.inputHash||null,inputs:s,status:l?
"cache-policy-enabled":"cache-policy-disabled"}}function uT(r={}){const e=Z(r.stateSeedPayload,r.cachePolicy?.stateSeedPayload,
r.cache?.stateSeedPayload,r.remoteStateSeedPayload,null);return e==null?null:se(e)}function uu(r,e=new WeakSet){if(r==null)
return r;if(typeof r=="function"||typeof r=="symbol")return;if(typeof r!="object")return r;if(ArrayBuffer.isView(r))return new r.
constructor(r);if(r instanceof ArrayBuffer)return r.slice(0);if(e.has(r))return null;if(e.add(r),Array.isArray(r))return r.
map(n=>uu(n,e)).filter(n=>n!==void 0);const t={};for(const[n,s]of Object.entries(r)){const i=uu(s,e);i!==void 0&&(t[n]=i)}
return t}function dT(r={},e={},t={}){const n=e.resultInputs||e.resultInputMap||(r&&typeof r=="object"?r.resultInputs:null);
if(!n||typeof n!="object"||Array.isArray(n))return r;const s=r.data&&typeof r.data=="object"&&!Array.isArray(r.data)?{...r.
data}:{},i={};for(const[o,a]of Object.entries(n)){const c=typeof a=="string"?a:String(a?.nodeId||a?.resultId||a?.from||"").
trim();if(!(!o||!c)){if(!Object.prototype.hasOwnProperty.call(t,c))throw new Error(`Task graph node ${e.id} requested un\
available result input ${o} from ${c}`);s[o]=uu(t[c]),i[o]=c}}return Object.keys(i).length===0?r:{...r,data:s,taskGraphResultInputs:i}}
function hT(r={},e={}){const t=r.cacheAdmission||r.cachePolicy?.admission||r.cache?.admission||{},n=t.admitted===!0||t.accepted===
!0||t.status==="admitted"||t.status==="admission-accepted",s=e.mode==="record-only",i=t.status||(n?"admitted":s?"recorde\
d-not-admitted":"pending-admission");return{schema:cu,status:i,admitted:n,authority:String(Z(t.authority,r.cacheAuthority,
"compute-manager-local")||"compute-manager-local"),admissionId:Z(t.admissionId,t.id,null),validatorId:Z(t.validatorId,t.
validator,null),reason:String(Z(t.reason,s?"record-only-cache-artifact-requires-state-manager-admission":"cache-artifact\
-admission-pending","")||""),invalidationRefs:oe(t.invalidationRefs??e.inputs?.invalidationRefs),acceptedAt:n?t.acceptedAt||
Date.now():null}}function fT({graphId:r,cachePolicy:e,result:t,storedAt:n,expiresAt:s,admission:i}={}){const o=Js(Qs({schema:t?.
schema,graphId:t?.graphId,status:t?.status,nodeReports:t?.nodeReports,nodeResults:t?.nodeResults}));return{schema:W4,artifactId:`${e.
cacheKey}:artifact`,cacheKey:e.cacheKey,cacheScope:e.scope,cacheKeySource:e.keySource,inputHash:e.inputHash,resultHash:o,
graphId:r,status:i?.admitted?"admitted-cache-artifact-recorded":"recorded-not-admitted",admitted:i?.admitted===!0,admission:i,
inputs:e.inputs,invalidationRefs:oe(i?.invalidationRefs,e.inputs?.invalidationRefs||[]),stateSeedPayload:t?.stateSeedPayload!=
null?se(t.stateSeedPayload):null,storedAt:n,expiresAt:s,ttlMs:e.ttlMs,resultSchema:t?.schema||null,nodeCount:t?.nodeCount??
null,resultNodeSchemas:(t?.nodeReports||[]).map(a=>({nodeId:a.nodeId,resultSchema:a.resultSchema||null,taskFamily:a.taskFamily||
null}))}}function pT(r={}){const e=r.placementPolicy||r.placement||r.placementHint||{},t=String(Z(e.requestedPlacement,e.
placement,e.mode,r.requestedPlacement,r.placementMode,"local")||"local").trim().toLowerCase();return{schema:H4,requestedPlacement:t,
locality:String(Z(e.locality,r.locality,t==="local"?"local-inline":"distributed")||""),authority:String(Z(e.authority,r.
authority,"compute-manager")||"compute-manager"),targetPeerIds:oe(e.targetPeerIds??e.peers??r.targetPeerIds),targetClusterId:Z(
e.targetClusterId,e.clusterId,r.targetClusterId,null),gpuResident:e.gpuResident===!0||e.gpuLane===!0||r.gpuResident===!0,
advisory:e.advisory!==!1}}function mT(r={},e=null){const t=r.webgpu||{},n=r.gpuResidentLane||r.gpuResidentLaneLease||r.residentLane||
t.gpuResidentLane||t.residentLane||{},s=Z(n.residency,t.residency,r.residency),i=n.enabled===!0||n.required===!0||n.leaseRequired===
!0||String(s||"").trim().toLowerCase()==="gpu-lane",o=Z(n.laneId,n.gpuLaneId,t.laneId,t.gpuLaneId),a=Z(n.stateKey,n.gpuStateKey,
t.stateKey,t.gpuStateKey,r.stateKey),c=Z(n.domainKey,n.domain,t.domainKey,r.domainKey),l=oe(n.retainedBufferRefs??t.retainedBufferRefs??
r.retainedBufferRefs),u=n.copyBudget&&typeof n.copyBudget=="object"?se(n.copyBudget):t.copyBudget&&typeof t.copyBudget==
"object"?se(t.copyBudget):{};return!i&&!o&&!a&&l.length===0&&Object.keys(u).length===0?null:{schema:gy,enabled:!0,laneId:o?
String(o):null,stateKey:a?String(a):null,domainKey:c?String(c):null,solverId:Z(n.solverId,r.solverId,null),taskId:e,owner:Z(
n.owner,r.owner,"compute-manager-task-graph"),readFamilies:oe(n.readFamilies??n.reads??t.readFamilies??r.readFamilies),writeFamilies:oe(
n.writeFamilies??n.writes??t.writeFamilies??r.writeFamilies),retainedBufferRefs:l,queueFencePolicy:Z(n.queueFencePolicy,
n.fencePolicy,t.queueFencePolicy,null),copyBudget:u}}function gT(r){return["gpu-fence-completed","remote-gpu-fence-compl\
eted","queue-work-completed","readback-map-completed","ordered-before-consumer-queue-completed"].includes(String(r||""))}
function Zi(r=null,e=null){const t=r&&typeof r=="object"?r:{},n=t.status||t.queueCompletionStatus||t.fenceStatus||t.completionStatus||
(e?.required?"gpu-fence-report-missing":null);if(!n&&!e?.required)return null;const s=t.method||t.queueCompletionMethod||
t.fenceMethod||t.completionMethod||null,i=t.fenceSatisfied===!0||t.satisfied===!0||t.completed===!0||gT(n);return{schema:t.
schema||K4,status:n,method:s,fenceSatisfied:i,required:e?.required===!0||t.required===!0,laneId:Z(t.laneId,t.gpuLaneId,e?.
laneId),stateKey:Z(t.stateKey,t.gpuStateKey,e?.stateKey),queueFencePolicy:Z(t.queueFencePolicy,t.fencePolicy,e?.queueFencePolicy),
queueCompletionStatus:t.queueCompletionStatus||n||null,queueCompletionMethod:t.queueCompletionMethod||s||null,retainedBufferRefs:oe(
t.retainedBufferRefs,e?.retainedBufferRefs||[]),workerId:t.workerId||t.remoteWorkerId||null,deviceId:t.deviceId||t.gpuDeviceId||
null,completedAt:t.completedAt||null,source:t.source||null}}function el(r){return r?typeof r=="function"?r.placementExecutorId||
r.id||r.name||"placement-executor":r.id||r.name||r.constructor?.name||"placement-executor":null}function tl(r){return r?
typeof r=="function"?r.placementAdmissionId||r.id||r.name||"placement-admission":r.id||r.name||r.constructor?.name||"pla\
cement-admission":null}function rl(r){return r?typeof r=="function"?r.placementResultValidatorId||r.id||r.name||"placeme\
nt-result-validator":r.id||r.name||r.constructor?.name||"placement-result-validator":null}function nl(r){return r?typeof r==
"function"?r.placementTaskSignerId||r.id||r.name||"placement-task-signer":r.id||r.name||r.constructor?.name||"placement-\
task-signer":null}function bT(r){return(Array.isArray(r)?r:[]).slice(0,64).map((t,n)=>{const s=t&&typeof t=="object"?t:{};
return{schema:s.schema||null,role:s.role||null,index:n,peerId:s.peerId||s.remotePeerId||null,remotePeerId:s.remotePeerId||
s.peerId||null,targetPeerId:s.targetPeerId||null,transportPeerId:s.transportPeerId||null,responderNodeId:s.responderNodeId||
null,responderPeerId:s.responderPeerId||null,clusterId:s.clusterId||null,workerId:s.workerId||s.remoteWorkerId||null,remoteExecution:s.
remoteExecution&&typeof s.remoteExecution=="object"?JSON.parse(JSON.stringify(s.remoteExecution)):null,gpuFence:s.gpuFence&&
typeof s.gpuFence=="object"?JSON.parse(JSON.stringify(s.gpuFence)):null,executorId:s.executorId||null,codeHash:s.codeHash||
null,inputHash:s.inputHash||null,taskHash:s.taskHash||null,outputHash:s.outputHash||s.resultHash||null,resultHash:s.resultHash||
s.outputHash||null,commitDeltaHash:s.commitDeltaHash||s.deltaHash||null,resultSchema:s.resultSchema||s.schema||null,validated:s.
validated===!0||s.valid===!0,ok:s.ok!==!1&&s.accepted!==!1&&s.valid!==!1,promoted:s.promoted===!0,usedAsCommitSource:s.usedAsCommitSource===
!0,errorCode:s.errorCode||null,errorMessage:s.errorMessage||null,durationMs:Number.isFinite(Number(s.durationMs))?Number(
Number(s.durationMs).toFixed(3)):null}})}function du(r){if(r==null)return r;if(typeof r=="number")return Number.isFinite(
r)?r:String(r);if(typeof r=="string"||typeof r=="boolean")return r;if(typeof r=="bigint")return`${r.toString()}n`;if(typeof r==
"function")return`[Function:${r.name||"anonymous"}]`;if(ArrayBuffer.isView(r))return{typedArray:r.constructor?.name||"Ty\
pedArray",values:Array.from(r)};if(r instanceof ArrayBuffer)return{arrayBufferBytes:Array.from(new Uint8Array(r))};if(Array.
isArray(r))return r.map(du);if(typeof r=="object"){const e={};for(const t of Object.keys(r).sort()){if(t==="taskPacket"||
t==="taskEnvelope")continue;const n=du(r[t]);n!==void 0&&(e[t]=n)}return e}return String(r)}function Qs(r){return JSON.stringify(
du(r))}function Js(r){const e=String(r??"");let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(
t,16777619)>>>0;return`fnv1a32-${t.toString(16).padStart(8,"0")}`}function sl({executorId:r,kind:e="worker",ordinal:t=null,
status:n="active"}={}){return{executorId:r,kind:e,ordinal:t,status:n,activeTaskCount:0,submitted:0,completed:0,failed:0,
abandoned:0,averageDurationMs:0,lastDurationMs:0,maxDurationMs:0,totalDurationMs:0,lastRuntime:null,lastTaskFamily:null,
lastStartedAt:null,lastCompletedAt:null,byRuntime:{},byTaskFamily:{}}}class yT{constructor(e={}){const t=typeof navigator<
"u"&&navigator.hardwareConcurrency?navigator.hardwareConcurrency:4,n=typeof navigator<"u"&&!!navigator.gpu,s=typeof WebAssembly<
"u";this.workerPolicyOverrides={minWorkers:e.minWorkers,targetWorkers:e.targetWorkers,initialWorkers:e.initialWorkers,maxWorkers:e.
maxWorkers,autoScaleWorkers:e.autoScaleWorkers,scaleUpQueueDepth:e.scaleUpQueueDepth,idleScaleDownMs:e.idleScaleDownMs},
this.resourceProfile=Xc(e.resourceProfile||e,{wasm:s,webgpu:n}),this.workerPolicy=Yc(this.workerPolicyOverrides,this.resourceProfile),
this.config={enableWebGPU:e.enableWebGPU||!1,enableWorkers:e.enableWorkers!==!1,requireWorkers:e.requireWorkers===!0,workerBootstrapTimeoutMs:X(
e.workerBootstrapTimeoutMs,yp,1,6e4),minWorkers:this.workerPolicy.minWorkers,targetWorkers:this.workerPolicy.targetWorkers,
maxWorkers:this.workerPolicy.maxWorkers||t,autoScaleWorkers:this.workerPolicy.autoScale,...e},this.config.minWorkers=this.
workerPolicy.minWorkers,this.config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.
maxWorkers,this.config.autoScaleWorkers=this.workerPolicy.autoScale,this.config.requireWorkers=e.requireWorkers===!0,this.
config.workerBootstrapTimeoutMs=X(e.workerBootstrapTimeoutMs,yp,1,6e4),this.workers=[],this.taskQueue=[],this.activeTasks=
new Map,this.activeTaskGraphs=new Map,this.taskGraphCache=new Map,this.taskGraphCacheArtifacts=new Map,this.workerAffinities=
new Map,this.residentWorkerAffinities=new Set,this.workerTerminationFailures=new Map,this.modelServices=new Set,this.resourceBroker=
e.resourceBroker||null,this.workerIds=new WeakMap,this.workerBootstrap=new WeakMap,this.workerRequirementError=null,this.
workerInitializationPromise=null,this.workerLifecycleRevision=0,this.workerUtilization=new Map,this.nextWorkerOrdinal=1,
this.inlineExecutorId="inline",this.workerUtilization.set(this.inlineExecutorId,sl({executorId:this.inlineExecutorId,kind:"\
inline",ordinal:0,status:"active"})),this.solverRegistry=new g4(e.solvers||[]),this.gpuResidentLaneManager=e.gpuResidentLaneManager||
new N4({gpuHub:e.gpuHub||null,deviceId:e.gpuDeviceId||e.deviceId||"compute-manager-gpu"}),this.targetWorkerCount=this.workerPolicy.
targetWorkers,this.workerSpawnFailures=0,this.workerRetirements=0,this.workerPoolRevision=0,this.workerResizeHistory=[],
this.placementExecutor=typeof e.placementExecutor=="function"||e.placementExecutor?.submitTask?e.placementExecutor:null,
this.placementExecutorId=e.placementExecutorId||el(this.placementExecutor),this.placementAdmission=typeof e.placementAdmission==
"function"||e.placementAdmission?.admitTask?e.placementAdmission:null,this.placementAdmissionId=e.placementAdmissionId||
tl(this.placementAdmission),this.placementResultValidator=typeof e.placementResultValidator=="function"||e.placementResultValidator?.
validateTaskResult||e.placementResultValidator?.validateResult?e.placementResultValidator:null,this.placementResultValidatorId=
e.placementResultValidatorId||rl(this.placementResultValidator),this.placementTaskSigner=typeof e.placementTaskSigner=="\
function"||e.placementTaskSigner?.signTaskPacket||e.placementTaskSigner?.signEnvelope||e.remoteTaskSigner?e.placementTaskSigner||
e.remoteTaskSigner:null,this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||nl(this.placementTaskSigner),
this.placementTimeoutMs=X(e.placementTimeoutMs??e.remotePlacementTimeoutMs,3e4,0,36e5),this.remoteResultVerification=e.remoteResultVerification!==
!1&&e.placementResultVerification!==!1,this.placementRetryPolicy={schema:Ts,maxAttempts:X(e.placementMaxAttempts??e.remotePlacementMaxAttempts,
1,1,100),baseDelayMs:X(e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,50,0,6e5),maxDelayMs:X(e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,1e3,0,6e5),jitterFraction:ut(e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
0,0,1),retryableErrorKinds:oe(e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,Rn),terminalErrorKinds:[
...Ji]},this.manualWorkerAutoScaleCooldownMs=X(e.manualWorkerAutoScaleCooldownMs??e.workerResizeCooldownMs,4e3,0,6e5),this.
workerAutoScaleHoldUntil=0,this.workerAutoScaleHoldReason=null,this.lastWorkerResize={schema:"peercompute.compute.worker\
-resize.v0",revision:0,reason:"initial",previousTargetWorkers:this.targetWorkerCount,targetWorkers:this.targetWorkerCount,
previousWorkerCount:0,workerCount:0,changed:!1,timestamp:null},this.stats={schema:"peercompute.compute.manager-stats.v0",
totalTasksSubmitted:0,totalTasksCompleted:0,totalTasksFailed:0,inlineTasksCompleted:0,workerTasksCompleted:0,remoteTasksCompleted:0,
remoteTasksFailed:0,remoteTasksTimedOut:0,remoteTasksRejected:0,remoteTasksVerificationFailed:0,remoteTasksValidationFailed:0,
remoteTaskAttempts:0,remoteTasksRetried:0,remoteTasksRetryExhausted:0,taskGraphsSubmitted:0,taskGraphsCompleted:0,taskGraphsFailed:0,
taskGraphsCancelled:0,taskGraphCacheHits:0,taskGraphCacheWrites:0,taskGraphCacheArtifactsWritten:0,taskGraphCacheArtifactsAdmitted:0,
taskGraphRemoteCacheImports:0,taskGraphRemoteCacheImportBlocked:0,taskGraphCacheInvalidations:0,taskGraphCacheReadBlocked:0,
totalTaskDurationMs:0,averageTaskDurationMs:0,lastTaskDurationMs:0,minTaskDurationMs:null,maxTaskDurationMs:0,lastCompletedAt:null,
byRuntime:{},byTaskFamily:{},taskPlacement:{schema:wp,totalSubmitted:0,totalCompleted:0,totalFailed:0,localSubmitted:0,remoteRequested:0,
remoteExecuted:0,remoteFailed:0,remoteTimedOut:0,remoteRejected:0,remoteVerificationFailed:0,remoteValidationFailed:0,remoteAttempts:0,
remoteRetried:0,remoteRetryExhausted:0,lastPlacement:null,lastRemotePlacement:null,byRecommendedPlacement:{},byActualPlacement:{}}},
this.scaleDownTimer=null,this.commitDeltaHandler=null,this.capabilities={cpu:!0,wasm:s,webgpu:n,wasmWebgpu:s&&n},this.initialized=
!1,this.workerBootstrapURL=e.workerBootstrapURL||e.computeWorkerBootstrapURL||e.workerScriptURL||e.workerScriptUrl||null}setCommitDeltaHandler(e){
this.commitDeltaHandler=e}commitDelta(e){this.commitDeltaHandler&&this.commitDeltaHandler(e)}async initialize(){if(this.
destroying)throw new Error("ComputeManager is shutting down");if(this.workerRequirementError)throw this.workerRequirementError;
if(this.workerInitializationPromise)return this.workerInitializationPromise;if(this.initialized)return;const e=this.workerLifecycleRevision;
if(this.initialized=!0,!this._supportsWorkers()){if(this.config.requireWorkers)throw this._failRequiredWorkerPool(this._createRequiredWorkerError(
"browser Worker construction is unavailable or workers were disabled"));console.warn("[ComputeManager] Web Workers not a\
vailable; falling back to inline execution");return}const t=X(this.targetWorkerCount,this.workerPolicy.targetWorkers,0,this.
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
{ResidentModelAdmission:l},u]=await Promise.all([Et(()=>import("./ModelInferenceService-Gy9kAP4d.js"),__vite__mapDeps([6,3]),import.meta.
url),Et(()=>import("./ResourceLeaseBroker-BgqO15eI.js"),[],import.meta.url),Et(()=>import("./ResidentModelAdmission-DVtD0-m7.js"),
[],import.meta.url),s==="llama.cpp"?Et(()=>import("./runtimeDefinition-CuF6Fycr.js"),__vite__mapDeps([2,3]),import.meta.
url).then(p=>p.ggufRuntimeDefinition):s==="onnx-diffusion"?Et(()=>import("./runtimeDefinition-V89Xz8gA.js"),__vite__mapDeps([5,3]),
import.meta.url).then(p=>p.diffusionRuntimeDefinition):null]);if(this.destroying||o!==this.workerLifecycleRevision)throw new Error(
"ComputeManager shutdown interrupted service creation");if(t&&this.resourceBroker&&t!==this.resourceBroker)throw new Error(
"Model sessions must share the ComputeManager resource broker");if(!this.resourceBroker){if(!t&&!n)throw new Error("Conf\
igure inference CPU/GPU resource budgets");this.resourceBroker=t||new c({capacities:n})}const h=new a({...i,runtimeDefinition:u,
artifactStore:e,computeManager:this,admission:new l({broker:this.resourceBroker})});this.modelServices.add(h);const d=h.
dispose.bind(h);return h.dispose=async()=>{const p=await d();return this.modelServices.delete(h),p},h}async refreshGpuLimits(){
if(typeof navigator>"u"||!navigator.gpu?.requestAdapter)return this.getResourceProfile();let e=null;try{e=await navigator.
gpu.requestAdapter()}catch{return this.getResourceProfile()}const t=yy(e?.limits);return t?(this.resourceProfile=Xc({...this.
resourceProfile,gpuAvailable:!0,gpuLimits:t,gpuLimitsSource:"adapter",source:this.resourceProfile.source||"browser"},this.
capabilities),this.workerPolicy=Yc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.
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
e,s),l=this._taskFamilyStats(c);l.submitted+=1;const u=this._normalizeTaskPlacement(e,{runtime:s,taskFamily:c}),h=oT(e),
d=aT(e,h);this._recordPlacementSubmitted(u);const p={id:o,runtime:s,taskFamily:c,solverId:e.solverId,placement:u,gpuFence:h,
gpuResidentLane:d,data:e.data??null,fn:e.fn?e.fn.toString():void 0,module:e.module,hostModule:e.hostModule,exportName:e.
exportName||"default",hostExport:e.hostExport,wasm:e.wasm,wasmSource:e.wasmSource,source:e.source,args:e.args,webgpu:e.webgpu,
suppressCommitDelta:e.suppressCommitDelta===!0||e.commitDelta===!1,returnEnvelope:e.returnEnvelope===!0||e.returnRawResult===
!0,requireWorker:e.requireWorker===!0,affinityKey:e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey};if(p.
requireWorker&&(d?.localExecution==="inline"||u.requestedPlacement!=="local"&&!u.advisory))throw this._createRequiredWorkerError(
"required local worker conflicts with requested placement");if(p.affinityKey&&this.residentWorkerAffinities.has(p.affinityKey)&&
!this.workerAffinities.has(p.affinityKey))throw Object.assign(new Error("Resident worker was terminated"),{workerTerminated:!0,
code:"ERR_COMPUTE_WORKER_TERMINATED"});if(this._ensureTargetWorkers({reason:"task-demand"}),this.workerRequirementError)
throw this.workerRequirementError;return new Promise((m,y)=>{const b={settled:!1,cancelRequested:!1,timer:null,bootstrapTimer:null};
let f;const g=new Promise(A=>{f=A}),w=()=>{this.cancelTask(o).catch(()=>{})},k=(A,v)=>{b.settled||(b.settled=!0,clearTimeout(
b.timer),clearTimeout(b.bootstrapTimer),e.signal?.removeEventListener("abort",w),A(v),f())},x={id:o,payload:p,control:b,
completion:g,resolve:A=>k(m,A),reject:A=>k(y,A),onProgress:typeof e.onProgress=="function"?e.onProgress:null,transferables:Array.
isArray(e.transferables)?e.transferables:[],submittedAt:pt(),runtime:s,taskFamily:c,placement:u};if(p.requireWorker&&!this.
workers.some(A=>this.workerBootstrap.get(A)?.status==="ready")&&(b.bootstrapTimer=setTimeout(()=>{const A=this.taskQueue.
findIndex(v=>v.id===o);A<0||(this.taskQueue.splice(A,1),this._recordTaskCompletion(x,{ok:!1,mode:"queued"}),x.reject(this.
_createRequiredWorkerError("task worker readiness timed out")))},this.config.workerBootstrapTimeoutMs)),e.signal?.addEventListener(
"abort",w,{once:!0}),e.signal?.aborted){x.reject(e.signal.reason||new DOMException("Compute task cancelled","AbortError"));
return}this._dispatchToPlacementExecutor(x)||this._dispatchToWorker(x)||(this.taskQueue.push(x),this._maybeScaleForQueue(),
this._scheduleNext())})}getResourceProfile(){return{...this.resourceProfile}}getWorkerPolicy(){return{...this.workerPolicy,
targetWorkers:this.targetWorkerCount}}setResourceProfile(e={}){return this.resourceProfile=Xc(e,this.capabilities),this.
workerPolicy=Yc(this.workerPolicyOverrides,this.resourceProfile),this.config.minWorkers=this.workerPolicy.minWorkers,this.
config.targetWorkers=this.workerPolicy.targetWorkers,this.config.maxWorkers=this.workerPolicy.maxWorkers,this.config.autoScaleWorkers=
this.workerPolicy.autoScale,this.resizeWorkers(this.workerPolicy.targetWorkers,{reason:"resource-profile-update"})}resizeWorkers(e,{
reason:t="manual"}={}){const n=this.targetWorkerCount,s=this.workers.length,i=this.config.requireWorkers?Math.max(1,this.
workerPolicy.minWorkers):this.workerPolicy.minWorkers,o=X(e,this.targetWorkerCount,i,this.workerPolicy.maxWorkers);if(this.
targetWorkerCount=o,rT(t)&&this._holdWorkerAutoScale(t),!this.initialized||!this._supportsWorkers())return this._recordWorkerResize(
{reason:t,previousTargetWorkers:n,previousWorkerCount:s}),this.getCapabilities();for(;this.workers.length<this.targetWorkerCount&&
this._spawnWorker(););return this._retireIdleWorkers(t),this._scheduleNext(),this._recordWorkerResize({reason:t,previousTargetWorkers:n,
previousWorkerCount:s}),this.getCapabilities()}estimateWorkloadBudget({itemName:e="items",baseItems:t=4096,minItems:n=1024,
maxItems:s=65536,itemStrideBytes:i=0,memoryFraction:o=.25,layerCount:a=1,maxShardsPerLayer:c=8}={}){const l=Math.max(1,this.
targetWorkerCount||this.workerPolicy.targetWorkers||1),u=X(a,1,1,1024),h=eT(this.resourceProfile.tier),d=Math.max(1,Math.
floor(l/u)),p=X(Math.min(h,d),1,1,Math.max(1,c)),m=Z4(this.resourceProfile.tier),y=Xi(l/tT(this.resourceProfile.tier)),b=ut(
this.resourceProfile.memoryBudgetMB,lu(this.resourceProfile.tier),0,1048576),f=ut(this.resourceProfile.gpuMemoryBudgetMB,
0,0,1048576),g=Xi(b/lu(this.resourceProfile.tier)),w=this.resourceProfile.gpuAvailable?Xi(f/Math.max(1,by(this.resourceProfile.
tier))):.75,k=ut(this.resourceProfile.budgetScale,1,.05,64),x=Xi(Math.min(y,g,w)*k),A=X(i,0,0,1048576),v=ut(o,.25,.01,1),
E=A>0&&b>0?Math.max(n,Math.floor(b*1024*1024*v/A)):s,C=A>0&&this.resourceProfile.gpuLimits?Math.min(X(this.resourceProfile.
gpuLimits.maxBufferSize,Number.MAX_SAFE_INTEGER,0),X(this.resourceProfile.gpuLimits.maxStorageBufferBindingSize,Number.MAX_SAFE_INTEGER,
0)):Number.MAX_SAFE_INTEGER,I=Number.isFinite(C)&&C>0&&A>0?Math.max(n,Math.floor(C*v/A)):s,M=Math.max(n,Math.min(s,E,I)),
R=X(nT(t*m*x,256),t,n,M),P=Object.entries({workers:y,memory:g,gpu:w,explicit:k}).sort((O,Q)=>O[1]-Q[1])[0]?.[0]||"worker\
s";return{schema:"peercompute.compute.workload-budget.v0",itemName:e,itemCount:R,minItems:n,maxItems:s,effectiveMaxItems:M,
itemStrideBytes:A,workerCount:l,shardsPerLayer:p,layerCount:u,plannedWorkerTasks:u*p,capacity:{schema:"peercompute.compu\
te.capacity-budget.v0",budgetScale:x,limitingFactor:P,workerScale:y,memoryScale:g,gpuScale:w,explicitScale:k,memoryBudgetMB:b,
gpuMemoryBudgetMB:f,memoryFraction:v,memoryMaxItems:E,gpuMaxItems:I,gpuLimits:this.resourceProfile.gpuLimits?{...this.resourceProfile.
gpuLimits}:null},resourceProfile:this.getResourceProfile(),workerPolicy:this.getWorkerPolicy()}}registerSolver(e){return this.
solverRegistry.register(e)}unregisterSolver(e){return this.solverRegistry.unregister(e)}getSolver(e){return this.solverRegistry.
get(e)}listSolvers(){return this.solverRegistry.list()}submitSolverTask(e,t={}){const n=this.solverRegistry.createTask(e,
t);return this.submitTask(n)}async submitTaskGraph(e={}){const t=String(e.graphId||e.id||`task-graph:${Date.now()}`).trim(),
n=Array.isArray(e.nodes)?e.nodes:[];if(!n.length)throw new Error("submitTaskGraph requires at least one node");const s=[],
i=new Map;for(const P of n){const O=String(P?.id||P?.nodeId||P?.task?.id||"").trim();if(!O)throw new Error("submitTaskGr\
aph node id is required");if(i.has(O))throw new Error(`Duplicate task graph node id: ${O}`);const Q=oe(P.dependsOn||P.dependencies||
[]),H={...P,id:O,dependsOn:Q};s.push(H),i.set(O,H)}for(const P of s)for(const O of P.dependsOn)if(!i.has(O))throw new Error(
`Task graph node ${P.id} depends on unknown node ${O}`);this.stats.taskGraphsSubmitted+=1;const o=lT(e,s),a=uT(e),c=hT(e,
o),l=pT(e),u=mT(e,t),h=String(e.cancellation?.mode||e.cancellationMode||"cooperative").trim()||"cooperative",d=e.abortSignal||
e.cancelSignal||e.signal||e.cancellation?.signal||null,p={schema:Jc,mode:h,status:"not-cancelled",reason:null};let m=o.readEnabled?
this.taskGraphCache.get(o.cacheKey):null;const y=Date.now();m&&m.expiresAt&&m.expiresAt<=y&&(this.taskGraphCache.delete(
o.cacheKey),this.taskGraphCacheArtifacts.delete(o.cacheKey),m=null);let b=null;if(m&&o.requireAdmitted&&m.artifact?.admitted!==
!0&&(this.stats.taskGraphCacheReadBlocked+=1,b="blocked-unadmitted-cache-artifact",m=null),m){this.stats.taskGraphCacheHits+=
1,this.stats.taskGraphsCompleted+=1;const P=se(m.result),O=se(m.artifact||P.cacheArtifact||null);return{...P,cachePolicy:o,
cacheAdmission:O?.admission||P.cacheAdmission||c,cacheAdmissionStatus:O?.admission?.status||P.cacheAdmissionStatus||null,
cacheArtifact:O,cacheArtifactSchema:O?.schema||null,cacheArtifactStatus:O?.status||null,cacheStatus:"hit",cacheHit:!0,cachedAt:m.
storedAt,durationMs:0}}const f=new Map(s.map(P=>[P.id,P])),g={},w=[],k=[],x=[],A=pt(),v={graphId:t,startedAt:A,cancelled:d?.
aborted===!0,reason:d?.reason||null,cacheKey:o.cacheKey,stateSeedPayload:a,placementPolicy:l,graphLaneSpec:u},E=()=>{v.cancelled=
!0,v.reason=d?.reason||"abort-signal"};d?.addEventListener&&d.addEventListener("abort",E,{once:!0}),this.activeTaskGraphs.
set(t,v);const C=()=>{if(!v.cancelled)return;p.status="cancelled",p.reason=String(v.reason||"cancelled");const P=new Error(
`Task graph cancelled: ${t}`);throw P.code="TASK_GRAPH_CANCELLED",P.graphId=t,P.cancellation={...p},P};let I=null,M=null,
R=u?"required":"not-required",$=b||(o.readEnabled?"miss":o.writeEnabled?"record-only":"disabled");try{for(C(),u&&(I=this.
acquireGpuResidentLaneLease({...u,taskId:t,owner:u.owner||"compute-manager-task-graph"}),R="active");f.size>0;){C();const O=new Set(
Object.keys(g)),Q=Array.from(f.values()).filter(V=>V.dependsOn.every(fe=>O.has(fe)));if(!Q.length)throw new Error(`Task \
graph has a cycle or unsatisfied dependency: ${Array.from(f.keys()).join(", ")}`);x.push(Q.map(V=>V.id));const H=await Promise.
all(Q.map(async V=>{C();const fe={schema:q4,graphId:t,nodeId:V.id,dependsOn:[...V.dependsOn],completedNodeIds:Object.keys(
g),nodeResults:g,results:g,cachePolicy:o,cacheKey:o.cacheKey,cacheInputs:o.inputs,stateSeedPayload:a,placementPolicy:l,cancellation:p,
graphLease:I,graphLeaseSpec:u,getResult(ge){return g[ge]}};let ee=typeof V.createTask=="function"?await V.createTask(fe):
typeof V.task=="function"?await V.task(fe):V.task;if(!ee||typeof ee!="object")throw new Error(`Task graph node ${V.id} d\
id not produce a task`);ee=dT(ee,V,g),C();const me=pt(),we=await this.submitTask(ee);return C(),{node:V,task:ee,result:we,
durationMs:Math.max(0,pt()-me)}}));for(const V of H)f.delete(V.node.id),g[V.node.id]=V.result,k.push(V.node.id),w.push({
nodeId:V.node.id,dependsOn:[...V.node.dependsOn],taskId:V.task.id||null,taskFamily:V.task.taskFamily||V.task.solverId||null,
solverId:V.task.solverId||null,status:"completed",durationMs:V.durationMs,resultSchema:V.result?.computeTaskResultSchema||
V.result?.schema||null})}I?.leaseId&&(M=this.completeGpuResidentLaneLease(I.leaseId,{status:"ordered-before-consumer-que\
ue-completed",method:"compute-manager-task-graph-completion",queueCompletionStatus:"ordered-before-consumer-queue-comple\
ted",queueCompletionMethod:"compute-manager-task-graph-completion",releaseReason:"task-graph-completed"}),R=M?.lease?.status||
"completed");const P={schema:vp,graphId:t,status:"completed",nodeCount:s.length,edgeCount:s.reduce((O,Q)=>O+Q.dependsOn.
length,0),executionOrder:k,executionBatches:x,nodeReports:w,nodeResults:g,cachePolicy:o,cacheKey:o.cacheKey,cacheKeySource:o.
keySource,cacheInputHash:o.inputHash,cacheInputs:o.inputs,stateSeedPayload:a,cacheAdmission:c,cacheAdmissionStatus:c.status,
cacheArtifact:null,cacheArtifactSchema:null,cacheArtifactStatus:null,cacheStatus:$,cacheHit:!1,placementPolicy:l,cancellation:p,
cancellationStatus:p.status,graphLeaseRequired:u!=null,graphLeaseStatus:R,graphLeaseSpec:u,graphLease:I,graphLeaseExecution:M,
durationMs:Math.max(0,pt()-A)};if(o.writeEnabled){const O=Date.now(),Q=o.ttlMs>0?O+o.ttlMs:null,H=fT({graphId:t,cachePolicy:o,
result:P,storedAt:O,expiresAt:Q,admission:c});this.taskGraphCache.set(o.cacheKey,{storedAt:O,expiresAt:Q,artifact:se(H),
result:se(P)}),this.taskGraphCacheArtifacts.set(o.cacheKey,se(H)),this.stats.taskGraphCacheWrites+=1,this.stats.taskGraphCacheArtifactsWritten+=
1,$=o.readEnabled?"miss-stored":"recorded",P.cacheStatus=$,P.cachedAt=O,P.cacheArtifact=H,P.cacheArtifactSchema=H.schema,
P.cacheArtifactStatus=H.status}return this.stats.taskGraphsCompleted+=1,P}catch(P){const O=v.cancelled||P?.code==="TASK_\
GRAPH_CANCELLED";if(O?this.stats.taskGraphsCancelled+=1:this.stats.taskGraphsFailed+=1,I?.leaseId&&!M)try{this.rejectGpuResidentLaneLease(
I.leaseId,O?"task-graph-cancelled":"task-graph-failed"),R=O?"rejected-cancelled":"rejected-failed"}catch{R="reject-faile\
d"}throw P.graphId=P.graphId||t,P.taskGraphStatus=O?"cancelled":"failed",P.graphLeaseStatus=R,P.cancellation=P.cancellation||
{...p},P}finally{d?.removeEventListener&&d.removeEventListener("abort",E),this.activeTaskGraphs.delete(t)}}getGpuResidentLaneManager(){
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
s.reject(i),this._ensureTargetWorkers({reason:"cancelled-worker"}),this._scheduleNext()}};s.control.timer=setTimeout(c,X(
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
s=this.activeTaskGraphs.get(n);return s?(s.cancelled=!0,s.reason=String(t||"cancelTaskGraph"),{schema:Jc,graphId:n,status:"\
cancel-requested",cancelled:!0,reason:s.reason}):{schema:Jc,graphId:n||null,status:"not-found",cancelled:!1,reason:String(
t||"cancelTaskGraph")}}listActiveTaskGraphs(){return Array.from(this.activeTaskGraphs.values()).map(e=>({schema:vp,graphId:e.
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
storedAt||e.cachedAt||o,c=s.expiresAt||null,l=oe(e?.graphLeaseSpec?.retainedBufferRefs,e?.cacheInputs?.retainedBufferRefs,
s?.inputs?.retainedBufferRefs),u={schema:gy,source:"remote-task-graph-result",remoteOnly:!0,usableLocally:!1,status:l.length>
0?"remote-retained-buffer-refs-metadata-only":"no-remote-retained-buffer-refs",reason:l.length>0?"remote-gpu-resident-re\
fs-are-not-local-device-leases":"remote-result-did-not-declare-retained-buffer-refs",laneId:e?.graphLeaseSpec?.laneId||e?.
graphLease?.laneId||null,stateKey:e?.graphLeaseSpec?.stateKey||e?.graphLease?.stateKey||null,retainedBufferRefs:l,graphLeaseStatus:e?.
graphLeaseStatus||null,graphLeaseRequired:e?.graphLeaseRequired===!0},h={schema:cu,status:"admitted",admitted:!0,authority:t.
authority||"node-kernel-state-manager",admissionId:t.admissionId||null,validatorId:t.validatorId||null,reason:t.reason||
"remote-task-graph-cache-artifact-admitted",invalidationRefs:oe(t.invalidationRefs,s.invalidationRefs),acceptedAt:t.acceptedAt||
t.admittedAt||o},d={schema:Sp,status:"imported-admitted-remote-cache-result",cacheKey:i,graphId:e?.graphId||s.graphId||null,
sourcePeerId:n.sourcePeerId||t.sourcePeerId||null,responderId:n.responderId||t.responderId||null,requestId:n.requestId||
t.requestId||null,admissionId:t.admissionId||null,importedAt:o,remoteArtifactStatus:s.status||null,remoteArtifactAdmitted:s.
admitted===!0,retainedGpuLaneRefs:u,retainedGpuLaneRefsStatus:u.status,resultHash:s.resultHash||null,inputHash:s.inputHash||
e?.cacheInputHash||null},p={...se(s),cacheKey:i,status:"admitted-remote-cache-artifact-recorded",admitted:!0,admission:h,
stateAdmission:se(t),remoteCacheImport:d,remoteGraphLeaseRefs:u},m={...se(e),cacheKey:i,cacheAdmission:h,cacheAdmissionStatus:h.
status,cacheArtifact:se(p),cacheArtifactStatus:p.status,cacheArtifactSchema:p.schema||null,cacheStatus:"remote-imported",
cacheHit:!1,remoteTaskGraphCacheImport:d,remoteGraphLeaseRefs:u};return this.taskGraphCacheArtifacts.set(i,se(p)),this.taskGraphCache.
set(i,{storedAt:a,expiresAt:c,artifact:se(p),result:se(m)}),this.stats.taskGraphRemoteCacheImports+=1,se(d)}evaluateRemoteTaskGraphStateSeedPolicy(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim(),i=Date.now(),o=s&&this.taskGraphCache.
get(s)||null,a=s&&(this.taskGraphCacheArtifacts.get(s)||o?.artifact)||null,c=o?.result||null,l=c?.remoteTaskGraphCacheImport||
a?.remoteCacheImport||null,u=Z(c?.stateSeedPayload,c?.stateSeed,c?.warmStateSeed,a?.stateSeedPayload,a?.stateSeed,a?.outputs?.
stateSeed,n?.stateSeedPayload,n?.stateSeed),h=c?.remoteGraphLeaseRefs||a?.remoteGraphLeaseRefs||l?.retainedGpuLaneRefs||
null,d=Yi(c?.cacheInputs?.stateFamilies,c?.cachePolicy?.inputs?.stateFamilies,a?.inputs?.stateFamilies,a?.cacheInputs?.stateFamilies,
n?.stateFamilies),p=Yi(c?.cacheInputs?.readFamilies,c?.cachePolicy?.inputs?.readFamilies,a?.inputs?.readFamilies,a?.cacheInputs?.
readFamilies,n?.readFamilies),m=Yi(c?.cacheInputs?.writeFamilies,c?.cachePolicy?.inputs?.writeFamilies,a?.inputs?.writeFamilies,
a?.cacheInputs?.writeFamilies,n?.writeFamilies),y=oe(n?.allowedStateFamilies??n?.allowedFamilies,[]),b=Yi(h?.retainedBufferRefs,
c?.graphLeaseSpec?.retainedBufferRefs,c?.cacheInputs?.retainedBufferRefs,a?.inputs?.retainedBufferRefs,n?.retainedBufferRefs),
f=h?.usableLocally===!0&&h?.remoteOnly!==!0,g=l?.schema===Sp||c?.cacheStatus==="remote-imported"||a?.status==="admitted-\
remote-cache-artifact-recorded",w=a?.admitted===!0,k=n?.requireStateFamilies!==!1,x=y.length>0?d.filter(P=>!y.includes(P)):
[];let A="state-family-not-evaluated";d.length===0?A=k?"state-family-missing":"state-family-not-declared":y.length===0?A=
"state-family-policy-not-declared":x.length>0?A="state-family-blocked":A="state-family-allowed";let v="policy-ready",E="\
remote-cache-import-admitted-for-local-policy";s?!o&&!a?(v="blocked-cache-miss",E="cache-entry-not-found"):w?g?A==="stat\
e-family-missing"?(v="blocked-missing-state-families",E="remote-import-did-not-declare-state-families"):A==="state-famil\
y-policy-not-declared"?(v="blocked-missing-state-family-policy",E="allowed-state-family-policy-is-required"):A==="state-\
family-blocked"&&(v="blocked-state-family-policy",E="remote-import-declares-state-families-outside-policy"):(v="blocked-\
not-remote-import",E="cache-entry-did-not-originate-from-admitted-remote-task-graph-import"):(v="blocked-unadmitted-cach\
e-artifact",E="cache-artifact-is-not-admitted"):(v="blocked-no-cache-key",E="remote-state-seed-policy-requires-cache-key");
const C=v==="policy-ready",I=n?.allowWarmStateSeed===!0,M=n?.allowHotBufferRefresh===!0,R=I?C?"warm-state-seed-allowed":
"warm-state-seed-blocked":"warm-state-seed-not-requested";let $=M?"no-retained-buffer-refs":"hot-buffer-refresh-not-requ\
ested";return M&&!C?$="hot-buffer-refresh-blocked":M&&b.length>0&&f?$="local-buffer-refs-usable":M&&b.length>0&&($="loca\
l-refresh-required"),{schema:V4,status:v,reason:E,cacheKey:s||null,requestedAt:i,cacheEntryPresent:o!=null,artifactPresent:a!=
null,admitted:w,remoteImported:g,importStatus:l?.status||null,importSchema:l?.schema||null,importReport:l?se(l):null,stateFamilies:d,
readFamilies:p,writeFamilies:m,stateSeedPayloadAvailable:u!=null,stateSeedPayload:u!=null?se(u):null,allowedStateFamilies:y,
disallowedStateFamilies:x,stateFamilyStatus:A,warmStateSeedRequested:I,warmStateSeedStatus:R,hotBufferRefreshRequested:M,
hotBufferRefreshStatus:$,retainedBufferRefs:b,remoteRetainedRefsUsableLocally:f,remoteGraphLeaseRefs:h?se(h):null}}admitTaskGraphCacheArtifact(e,t={}){
const n=e&&typeof e=="object"?e:t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("admitTask\
GraphCacheArtifact requires a cacheKey");const i=this.taskGraphCache.get(s),o=this.taskGraphCacheArtifacts.get(s)||i?.artifact||
null;if(!o)return null;const a=se(n||{}),c=a.admittedAt||a.acceptedAt||Date.now(),l={schema:cu,status:"admitted",admitted:!0,
authority:a.authority||"state-manager",admissionId:a.admissionId||null,validatorId:a.validatorId||null,reason:a.reason||
"state-manager-cache-artifact-admitted",invalidationRefs:oe(a.invalidationRefs),acceptedAt:c},u=o.admitted===!0,h={...se(
o),status:"admitted-cache-artifact-recorded",admitted:!0,admission:l,stateAdmission:a};if(this.taskGraphCacheArtifacts.set(
s,se(h)),i){const d=se(i.result||{});d.cacheAdmission=l,d.cacheAdmissionStatus=l.status,d.cacheArtifact=se(h),d.cacheArtifactStatus=
h.status,d.cacheArtifactSchema=h.schema||null,this.taskGraphCache.set(s,{...i,artifact:se(h),result:d})}return u||(this.
stats.taskGraphCacheArtifactsAdmitted+=1),se(h)}invalidateTaskGraphCacheArtifact(e,t={}){const n=e&&typeof e=="object"?e:
t,s=String(typeof e=="string"?e:n?.cacheKey||"").trim();if(!s)throw new Error("invalidateTaskGraphCacheArtifact requires\
 a cacheKey");const i=se(n||{}),o=this.taskGraphCache.get(s),a=this.taskGraphCacheArtifacts.get(s)||o?.artifact||null;if(this.
taskGraphCache.delete(s),this.stats.taskGraphCacheInvalidations+=1,!a)return{cacheKey:s,status:"invalidated",admitted:!1,
invalidation:i};const c={...se(a),status:"invalidated",admitted:!1,invalidation:i,invalidatedAt:i.invalidatedAt||Date.now()};
return this.taskGraphCacheArtifacts.set(s,se(c)),se(c)}configurePlacementHooks(e={}){const t=h=>Object.prototype.hasOwnProperty.
call(e,h),n=(...h)=>{for(const d of h)if(t(d))return{found:!0,value:e[d]};return{found:!1,value:void 0}},s=n("placementE\
xecutor","remotePlacementExecutor","executor");s.found?(this.placementExecutor=typeof s.value=="function"||s.value?.submitTask?
s.value:null,this.placementExecutorId=e.placementExecutorId||e.remotePlacementExecutorId||e.executorId||el(this.placementExecutor)):
(t("placementExecutorId")||t("remotePlacementExecutorId")||t("executorId"))&&(this.placementExecutorId=e.placementExecutorId||
e.remotePlacementExecutorId||e.executorId||el(this.placementExecutor));const i=n("placementAdmission","remotePlacementAd\
mission","admission");i.found?(this.placementAdmission=typeof i.value=="function"||i.value?.admitTask?i.value:null,this.
placementAdmissionId=e.placementAdmissionId||e.remotePlacementAdmissionId||e.admissionId||tl(this.placementAdmission)):(t(
"placementAdmissionId")||t("remotePlacementAdmissionId")||t("admissionId"))&&(this.placementAdmissionId=e.placementAdmissionId||
e.remotePlacementAdmissionId||e.admissionId||tl(this.placementAdmission));const o=n("placementResultValidator","remotePl\
acementResultValidator","resultValidator","validator");o.found?(this.placementResultValidator=typeof o.value=="function"||
o.value?.validateTaskResult||o.value?.validateResult?o.value:null,this.placementResultValidatorId=e.placementResultValidatorId||
e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||rl(this.placementResultValidator)):(t("placement\
ResultValidatorId")||t("remotePlacementResultValidatorId")||t("resultValidatorId")||t("validatorId"))&&(this.placementResultValidatorId=
e.placementResultValidatorId||e.remotePlacementResultValidatorId||e.resultValidatorId||e.validatorId||rl(this.placementResultValidator));
const a=n("placementTaskSigner","remoteTaskSigner","taskSigner","signer");a.found?(this.placementTaskSigner=typeof a.value==
"function"||a.value?.signTaskPacket||a.value?.signEnvelope?a.value:null,this.placementTaskSignerId=e.placementTaskSignerId||
e.remoteTaskSignerId||e.taskSignerId||e.signerId||nl(this.placementTaskSigner)):(t("placementTaskSignerId")||t("remoteTa\
skSignerId")||t("taskSignerId")||t("signerId"))&&(this.placementTaskSignerId=e.placementTaskSignerId||e.remoteTaskSignerId||
e.taskSignerId||e.signerId||nl(this.placementTaskSigner)),(t("placementTimeoutMs")||t("remotePlacementTimeoutMs"))&&(this.
placementTimeoutMs=X(e.placementTimeoutMs??e.remotePlacementTimeoutMs,this.placementTimeoutMs,0,36e5)),(t("remoteResultV\
erification")||t("placementResultVerification"))&&(this.remoteResultVerification=e.remoteResultVerification!==!1&&e.placementResultVerification!==
!1);const c={...this.placementRetryPolicy},l=e.placementRetryPolicy||e.remotePlacementRetryPolicy||{},u=h=>Object.prototype.
hasOwnProperty.call(l,h)||Object.prototype.hasOwnProperty.call(e,h);return(u("maxAttempts")||u("placementMaxAttempts")||
u("remotePlacementMaxAttempts"))&&(c.maxAttempts=X(l.maxAttempts??e.placementMaxAttempts??e.remotePlacementMaxAttempts,c.
maxAttempts,1,100)),(u("baseDelayMs")||u("placementRetryBaseDelayMs")||u("remotePlacementRetryBaseDelayMs"))&&(c.baseDelayMs=
X(l.baseDelayMs??e.placementRetryBaseDelayMs??e.remotePlacementRetryBaseDelayMs,c.baseDelayMs,0,6e5)),(u("maxDelayMs")||
u("placementRetryMaxDelayMs")||u("remotePlacementRetryMaxDelayMs"))&&(c.maxDelayMs=X(l.maxDelayMs??e.placementRetryMaxDelayMs??
e.remotePlacementRetryMaxDelayMs,c.maxDelayMs,0,6e5)),(u("jitterFraction")||u("placementRetryJitterFraction")||u("remote\
PlacementRetryJitterFraction"))&&(c.jitterFraction=ut(l.jitterFraction??e.placementRetryJitterFraction??e.remotePlacementRetryJitterFraction,
c.jitterFraction,0,1)),(u("retryableErrorKinds")||u("placementRetryableErrorKinds")||u("remotePlacementRetryableErrorKin\
ds"))&&(c.retryableErrorKinds=oe(l.retryableErrorKinds??e.placementRetryableErrorKinds??e.remotePlacementRetryableErrorKinds,
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
byTaskFamily))}}_getPlacementRetryPolicyReport(e=this.placementRetryPolicy){return{schema:Ts,maxAttempts:X(e?.maxAttempts,
1,1,100),baseDelayMs:X(e?.baseDelayMs,0,0,6e5),maxDelayMs:X(e?.maxDelayMs,0,0,6e5),jitterFraction:ut(e?.jitterFraction,0,
0,1),retryableErrorKinds:oe(e?.retryableErrorKinds,Rn),terminalErrorKinds:[...Ji]}}async _executeTask(e){}_scheduleNext(){}_handleTaskComplete(e,t){}_handleTaskError(e,t){}_supportsWorkers(){
return typeof Worker<"u"&&this.config.enableWorkers}_createRequiredWorkerError(e,t=null){const n=new Error(`ComputeManag\
er requires a bootstrapped browser worker: ${e}`);return n.name="RequiredWorkerUnavailableError",n.code="ERR_COMPUTE_REQ\
UIRED_WORKER_UNAVAILABLE",n.reason=e,t!=null&&(n.cause=t),n}_failRequiredWorkerPool(e){const t=e?.code==="ERR_COMPUTE_RE\
QUIRED_WORKER_UNAVAILABLE"?e:this._createRequiredWorkerError(e?.message||String(e||"the required worker pool failed"),e);
this.workerRequirementError=t,this.initialized=!1,clearTimeout(this.scaleDownTimer),this.scaleDownTimer=null;for(const n of[
...this.workers])this._markWorkerBootstrapFailed(n,t),this._removeWorker(n);for(const[n,s]of this.activeTasks.entries())
this.workers.includes(s.worker)||this.activeTasks.delete(n),this._rejectTaskGpuResidentLaneLease(s,t.code),this._recordTaskCompletion(
s,{ok:!1,mode:s.executionMode||"worker",errorKind:"required-worker-unavailable",errorMessage:t.message}),s.reject(Object.
assign(new Error(t.message),{name:t.name,code:t.code,workerTerminated:!this.workers.includes(s.worker)}));return this._rejectQueuedTasksForRequiredWorkerFailure(
t),t}_createWorkerBootstrapRecord(e){let t=null,n=null;const s={status:"bootstrapping",startedAt:pt(),readyAt:null,reason:null,
promise:null,resolve:null,reject:null,timeout:null,messageErrorListener:null};if(s.promise=new Promise((i,o)=>{t=i,n=o}),
s.promise.catch(()=>{}),s.resolve=t,s.reject=n,this.workerBootstrap.set(e,s),this.config.requireWorkers){const i=this.config.
workerBootstrapTimeoutMs;s.timeout=setTimeout(()=>{s.status==="bootstrapping"&&this._handleWorkerFailure(e,this._createRequiredWorkerError(
`worker bootstrap did not acknowledge readiness within ${i}ms`))},i)}return s}_markWorkerBootstrapped(e){const t=this.workerBootstrap.
get(e);!t||t.status!=="bootstrapping"||(clearTimeout(t.timeout),t.timeout=null,t.status="ready",t.readyAt=pt(),t.resolve?.(
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
gpuResidentLane,placement:t},i=Js(Qs(n)),o=Js(Qs(s)),a=Js(Qs({codeHash:i,inputHash:o,id:e.id,runtime:e.runtime,taskFamily:e.
taskFamily,solverId:e.solverId,placement:t?.requestedPlacement||null}));return{schema:xp,taskId:e.id||null,runtime:e.runtime||
null,taskFamily:e.taskFamily||null,solverId:e.solverId||null,requestedPlacement:t?.requestedPlacement||null,gpuFenceRequired:e.
gpuFence?.required===!0,gpuFenceSchema:e.gpuFence?.schema||null,gpuLaneId:e.gpuFence?.laneId||null,gpuStateKey:e.gpuFence?.
stateKey||null,gpuQueueFencePolicy:e.gpuFence?.queueFencePolicy||null,gpuResidentLaneSchema:e.gpuResidentLane?.schema||null,
gpuResidentLaneLocalExecution:e.gpuResidentLane?.localExecution||null,codeHash:i,inputHash:o,taskHash:a,hashAlgorithm:"f\
nv1a32-stable-json",generatedAt:Date.now()}}_normalizePlacementTaskSignature(e){if(e==null||e===!1)return{signed:!1,reason:e===
!1?"signer-declined":"no-signature"};if(typeof e=="string")return{signed:!0,signature:e,signatureAlgorithm:"custom-signa\
ture"};if(typeof e=="object"){const t=e.signature||e.value||null;return{...e,signed:e.signed!==!1&&!!t,signature:t,signatureAlgorithm:e.
signatureAlgorithm||e.algorithm||"custom-signature",reason:e.reason||(t?"signed":"no-signature")}}return{signed:!0,signature:String(
e),signatureAlgorithm:"custom-signature",reason:"signed"}}async _createTaskEnvelope(e,{mode:t=null}={}){const n=e.payload?.
taskPacket||null,s=e.placement||e.payload?.placement||null,i={schema:Ep,taskPacketSchema:n?.schema||null,taskPacket:n,mode:t,
signed:!1,signerId:null,signature:null,signatureAlgorithm:null,reason:"no-task-signer",createdAt:Date.now()};if(!this.placementTaskSigner)
return i;const o={manager:this,task:e,placement:s,payload:e.payload,taskPacket:n,mode:t},a=this.placementTaskSigner,c=typeof a==
"function"?await a(n,o):a.signTaskPacket?await a.signTaskPacket(n,o):await a.signEnvelope(i,o),l=this._normalizePlacementTaskSignature(
c);return{...i,...l,schema:l.schema||Ep,taskPacket:n,signerId:l.signerId||this.placementTaskSignerId||"placement-task-si\
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
mode:t=null,finalResult:n=null,commitDelta:s=null,provenance:i=null}={}){if(!this.placementResultValidator)return{schema:kp,
valid:!0,reason:"no-result-validator",validationId:null,mode:t,decidedAt:Date.now()};const o={manager:this,task:e,placement:e.
placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||null,taskEnvelope:e.payload?.taskEnvelope||
null,mode:t,finalResult:n,commitDelta:s,provenance:i},a=this.placementResultValidator,c=typeof a=="function"?await a(n,o):
a.validateTaskResult?await a.validateTaskResult(n,o):await a.validateResult(n,o),l=this._normalizePlacementValidationResult(
c);return{...l,schema:l.schema||kp,validationId:l.validationId||this.placementResultValidatorId||"placement-result-valid\
ator",mode:t,decidedAt:Date.now()}}_placementRejectedError(e,{mode:t}){const n=new Error(`Remote placement rejected for ${t}\
: ${e?.reason||"admission-denied"}`);return n.name="PlacementAdmissionRejectedError",n.code="ERR_COMPUTE_PLACEMENT_REJEC\
TED",n.placementMode=t,n.reason=e?.reason||"admission-denied",n.admission=e||null,n}_placementValidationError(e,t,{mode:n}){
const s=new Error(`Remote placement result validation failed for ${n}: ${e?.reason||"validation-denied"}`);return s.name=
"PlacementResultValidationError",s.code="ERR_COMPUTE_PLACEMENT_VALIDATION",s.placementMode=n,s.reason=e?.reason||"valida\
tion-denied",s.validation=e||null,s.provenance=t||null,s}_placementTimeoutFor(e){return X(e.placement?.timeoutMs??e.payload?.
placement?.timeoutMs??this.placementTimeoutMs,this.placementTimeoutMs,0,36e5)}_placementRetryPolicyFor(e={}){const t=e.placement||
e.payload?.placement||{},n=this.placementRetryPolicy||{},s=X(t.maxAttempts??t.retryMaxAttempts??t.remoteMaxAttempts??t.remoteRetryMaxAttempts??
n.maxAttempts,1,1,100),i=X(t.retryBaseDelayMs??t.remoteRetryBaseDelayMs??n.baseDelayMs,0,0,6e5),o=X(t.retryMaxDelayMs??t.
remoteRetryMaxDelayMs??n.maxDelayMs,i,0,6e5),a=ut(t.retryJitterFraction??t.remoteRetryJitterFraction??n.jitterFraction,0,
0,1);return this._getPlacementRetryPolicyReport({...n,maxAttempts:s,baseDelayMs:i,maxDelayMs:o,jitterFraction:a,retryableErrorKinds:oe(
t.retryableErrorKinds??t.remoteRetryableErrorKinds??n.retryableErrorKinds,Rn)})}_placementErrorKind(e){return e?.code===
"ERR_COMPUTE_PLACEMENT_TIMEOUT"?"timeout":e?.code==="ERR_COMPUTE_PLACEMENT_REJECTED"?"rejected":e?.code==="ERR_COMPUTE_P\
LACEMENT_VERIFICATION"?"verification-failed":e?.code==="ERR_COMPUTE_PLACEMENT_VALIDATION"?"validation-failed":"executor-\
error"}_placementRetryDelayMs(e,t){const n=X(t?.baseDelayMs,0,0,6e5),s=X(t?.maxDelayMs,n,0,6e5),i=Math.max(0,X(e,1,1,100)-
1),o=Math.min(s,n*2**i),a=ut(t?.jitterFraction,0,0,1);if(a<=0||o<=0)return o;const c=o*a*Math.random();return Math.min(s,
Math.round(o+c))}_placementRetryDecision({attempt:e,errorKind:t,err:n,policy:s,mode:i}){const o=new Set(oe(s?.retryableErrorKinds,
Rn)),a=new Set(Ji),c=X(s?.maxAttempts,1,1,100),l=a.has(t),u=!l&&o.has(t),h=e<c,d=u&&h;return{schema:Ts,mode:i,attempt:e,
nextAttempt:d?e+1:null,maxAttempts:c,errorKind:t,errorCode:n?.code||null,errorMessage:n?.message||String(n||""),retryable:u,
terminal:l,retryScheduled:d,exhausted:u&&c>1&&!h,delayMs:d?this._placementRetryDelayMs(e,s):0,decidedAt:Date.now()}}_placementRetrySummary(e,{
mode:t,ok:n=!0,errorKind:s=null}={}){const i=Array.isArray(e.placementRetryEvents)?e.placementRetryEvents:[],o=e.placementRetryPolicy||
this._placementRetryPolicyFor(e),a=i.filter(l=>l.retryScheduled).length,c=i[i.length-1]||null;return{schema:Ts,mode:t,maxAttempts:o.
maxAttempts,attemptCount:X(e.placementAttempt,a+1,0,100),retryCount:a,retried:a>0,retryableErrorKinds:oe(o.retryableErrorKinds,
Rn),terminalErrorKinds:[...Ji],exhausted:!n&&!!c?.exhausted,finalErrorKind:n?null:s||c?.errorKind||null,events:JSON.parse(
JSON.stringify(i))}}_runPlacementExecutor(e,{signal:t=null,timeoutMs:n=this.placementTimeoutMs,mode:s=null,attempt:i=1,retryPolicy:o=null}={}){
const a={manager:this,task:e,placement:e.placement||e.payload?.placement||null,payload:e.payload,taskPacket:e.payload?.taskPacket||
null,taskEnvelope:e.payload?.taskEnvelope||null,signal:t,timeoutMs:n,mode:s,attempt:i,retryPolicy:o};return typeof this.
placementExecutor=="function"?this.placementExecutor(e.payload,a):this.placementExecutor.submitTask(e.payload,a)}_runPlacementExecutorWithTimeout(e,{
mode:t,attempt:n=1,retryPolicy:s=null}={}){const i=this._placementTimeoutFor(e),o=typeof AbortController<"u"?new AbortController:
null,a=Promise.resolve().then(()=>this._runPlacementExecutor(e,{signal:o?.signal||null,timeoutMs:i,mode:t,attempt:n,retryPolicy:s}));
if(i<=0)return a;let c=null;const l=new Promise((u,h)=>{c=setTimeout(()=>{const d=new Error(`Placement executor timed ou\
t after ${i}ms for ${t}`);d.name="PlacementExecutorTimeoutError",d.code="ERR_COMPUTE_PLACEMENT_TIMEOUT",d.timeoutMs=i,d.
placementMode=t;try{o?.abort?.(d)}catch{}h(d)},i)});return Promise.race([a,l]).finally(()=>{c!=null&&clearTimeout(c)})}_normalizeRemotePlacementProvenance(e,{
task:t,mode:n,result:s,finalResult:i,startedAt:o=null,completedAtMs:a=null,completedAt:c=Date.now()}={}){const l=e&&typeof e==
"object"?e:{},u=t?.payload||{},h=t?.placement||u.placement||{},d=Number.isFinite(Number(l.durationMs))?Number(l.durationMs):
Number.isFinite(Number(l.roundTripMs))?Number(l.roundTripMs):Number.isFinite(Number(o))&&Number.isFinite(Number(a))?Math.
max(0,Number(a)-Number(o)):null,p=s&&typeof s=="object"?s:{},m=i&&typeof i=="object"?i:{},y=t?.placementAdmission||null,
b=u.taskPacket||null,f=u.taskEnvelope||null,g=bT(l.replicas||l.replicaResults||l.quorum?.replicas||p.replicas||p.replicaResults),
w=Zi(l.gpuFence||l.gpuFenceReport||p.gpuFence||p.gpuFenceReport||m.gpuFence||m.gpuFenceReport||l.remoteExecution?.gpuFence||
l.remoteExecution?.gpuFenceReport||l.remoteExecution?.computeExecution?.gpuFence,u.gpuFence||b?.gpuFence||null);return{schema:O4,
taskPacketSchema:b?.schema||null,taskEnvelopeSchema:f?.schema||null,taskSigned:f?.signed===!0,signerId:l.signerId||f?.signerId||
null,signatureAlgorithm:l.signatureAlgorithm||f?.signatureAlgorithm||null,mode:n,executorId:l.executorId||this.placementExecutorId||
"placement-executor",promotedReplicaExecutorId:l.promotedReplicaExecutorId||null,admissionId:y?.admissionId||null,admissionReason:y?.
reason||null,requestedPlacement:h.requestedPlacement||null,taskId:u.id||t?.id||null,taskFamily:u.taskFamily||t?.taskFamily||
null,solverId:u.solverId||h.solverId||null,solverKey:h.solverKey||null,peerId:l.peerId||l.remotePeerId||null,targetPeerId:l.
targetPeerId||null,transportPeerId:l.transportPeerId||null,responderNodeId:l.responderNodeId||null,responderPeerId:l.responderPeerId||
null,requesterId:l.requesterId||null,requestId:l.requestId||null,clusterId:l.clusterId||null,workerId:l.workerId||l.remoteWorkerId||
null,remoteExecution:l.remoteExecution&&typeof l.remoteExecution=="object"?JSON.parse(JSON.stringify(l.remoteExecution)):
null,gpuFence:w,gpuFenceStatus:w?.status??null,gpuFenceSatisfied:w?.fenceSatisfied??!1,codeHash:l.codeHash||p.codeHash||
b?.codeHash||null,inputHash:l.inputHash||p.inputHash||b?.inputHash||null,taskHash:l.taskHash||p.taskHash||b?.taskHash||null,
outputHash:l.outputHash||p.outputHash||null,resultHash:l.resultHash||p.resultHash||l.outputHash||p.outputHash||null,commitDeltaHash:l.
commitDeltaHash||p.commitDeltaHash||l.deltaHash||p.deltaHash||null,resultSchema:l.resultSchema||m.schema||p.schema||null,
role:l.role||null,trustLevel:l.trustLevel||"injected-executor",redundantPlacement:l.redundantPlacement&&typeof l.redundantPlacement==
"object"?JSON.parse(JSON.stringify(l.redundantPlacement)):null,primary:l.primary&&typeof l.primary=="object"?JSON.parse(
JSON.stringify(l.primary)):null,primaryFailure:l.primaryFailure&&typeof l.primaryFailure=="object"?JSON.parse(JSON.stringify(
l.primaryFailure)):null,promotedReplica:l.promotedReplica&&typeof l.promotedReplica=="object"?JSON.parse(JSON.stringify(
l.promotedReplica)):null,replicaSuccessCount:X(l.replicaSuccessCount,0,0,1e6),replicaFailureCount:X(l.replicaFailureCount,
0,0,1e6),redundantReplicaCount:X(l.redundantReplicaCount??g.length,g.length,0,1e6),replicaCount:g.length,quorumReplicaCount:X(
l.quorumReplicaCount??g.length,g.length,0,1e6),replicas:g,validated:l.validated===!0,durationMs:d==null?null:Number(d.toFixed(
3)),completedAt:c}}_verifyRemotePlacementProvenance(e={},t={}){const n=t?.payload?.taskPacket||null,s=Date.now();if(!this.
remoteResultVerification)return{schema:Qc,verified:!0,skipped:!0,reason:"verification-disabled",checkedAt:s};if(!n||n.schema!==
xp)return{schema:Qc,verified:!1,skipped:!1,reason:"task-packet-missing",taskPacketSchema:n?.schema||null,mismatchFields:[
"taskPacket"],checks:[],checkedAt:s};const i=["codeHash","inputHash","taskHash"].map(c=>{const l=n[c]||null,u=e?.[c]||null;
return{field:c,expected:l,actual:u,ok:!!l&&l===u}});n.gpuFenceRequired===!0&&i.push({field:"gpuFence",expected:"fence-sa\
tisfied",actual:e?.gpuFence?.status||null,ok:e?.gpuFence?.fenceSatisfied===!0});const o=i.filter(c=>!c.ok).map(c=>c.field),
a=o.length===0?"hashes-match":o.includes("gpuFence")?"gpu-fence-missing-or-unsatisfied":"hash-mismatch";return{schema:Qc,
verified:o.length===0,skipped:!1,reason:a,taskPacketSchema:n.schema,hashAlgorithm:n.hashAlgorithm||null,mismatchFields:o,
checks:i,checkedAt:s}}_placementVerificationError(e,t,{mode:n}){const s=new Error(`Remote placement verification failed \
for ${n}: ${e?.reason||"hash-mismatch"}`);return s.name="PlacementResultVerificationError",s.code="ERR_COMPUTE_PLACEMENT\
_VERIFICATION",s.placementMode=n,s.reason=e?.reason||"hash-mismatch",s.verification=e||null,s.provenance=t||null,s}_unwrapPlacementExecutorResult(e,t,{
mode:n,startedAt:s}){let i=e,o=null,a=null;if(e&&typeof e=="object"){Object.prototype.hasOwnProperty.call(e,"commitDelta")&&
(o=e.commitDelta),a=e.provenance||e.remoteProvenance||e.placementProvenance||null;const d=Object.prototype.hasOwnProperty.
call(e,"commitDelta")||a||Object.prototype.hasOwnProperty.call(e,"remoteProvenance")||Object.prototype.hasOwnProperty.call(
e,"placementProvenance");d&&Object.prototype.hasOwnProperty.call(e,"value")?i=e.value:d&&Object.prototype.hasOwnProperty.
call(e,"result")&&(i=e.result)}const c=Date.now(),l=pt(),u=this._normalizeRemotePlacementProvenance(a,{task:t,mode:n,result:e,
finalResult:i,startedAt:s,completedAtMs:l,completedAt:c}),h=this._verifyRemotePlacementProvenance(u,t);if(u.verification=
h,u.verified=h.verified,!h.verified)throw this._placementVerificationError(h,u,{mode:n});return{finalResult:i,commitDelta:o,
provenance:u}}async _runRemotePlacementWithRetries(e,{mode:t}){const n=this._placementRetryPolicyFor(e);e.placementRetryPolicy=
n,e.placementRetryEvents=[];for(let i=1;i<=n.maxAttempts;i+=1){e.placementAttempt=i,this._recordPlacementAttempt(e,{mode:t,
attempt:i,retryPolicy:n});const o=pt();try{const a=await this._runPlacementExecutorWithTimeout(e,{mode:t,attempt:i,retryPolicy:n}),
{finalResult:c,commitDelta:l,provenance:u}=this._unwrapPlacementExecutorResult(a,e,{mode:t,startedAt:o}),h=await this._runPlacementResultValidator(
e,{mode:t,finalResult:c,commitDelta:l,provenance:u});if(u.validation=h,!h.valid)throw this._placementValidationError(h,u,
{mode:t});return u.retry=this._placementRetrySummary(e,{mode:t,ok:!0}),{finalResult:c,commitDelta:l,provenance:u}}catch(a){
const c=this._placementErrorKind(a),l=this._placementRetryDecision({attempt:i,errorKind:c,err:a,policy:n,mode:t});if(a.retry=
l,e.placementRetryEvents.push(l),!l.retryScheduled)throw a;this._recordPlacementRetry(e,{mode:t,retry:l}),await sT(l.delayMs)}}
const s=new Error(`Remote placement exhausted retry policy for ${t}`);throw s.name="PlacementRetryExhaustedError",s.code=
"ERR_COMPUTE_PLACEMENT_RETRY_EXHAUSTED",s.placementMode=t,s.retry=this._placementRetrySummary(e,{mode:t,ok:!1,errorKind:"\
executor-error"}),s}_dispatchToPlacementExecutor(e){const t=e.placement||e.payload?.placement||{};if(!this._canDispatchRemotePlacement(
t))return!1;const n=`remote-${t.requestedPlacement}`;e.payload.taskPacket=this._createTaskPacket(e.payload,t);const s={...e,
startedAt:pt(),executionMode:n,placementExecutorId:this.placementExecutorId,placementAdmissionId:this.placementAdmissionId,
placementAdmission:null};return this.activeTasks.set(e.id,s),Promise.resolve().then(()=>this._createTaskEnvelope(s,{mode:n})).
then(i=>(s.payload.taskEnvelope=i,null)).then(()=>this._runPlacementAdmission(s,{mode:n})).then(i=>{if(s.placementAdmission=
i,!i.accepted)throw this._placementRejectedError(i,{mode:n});return null}).then(()=>this._runRemotePlacementWithRetries(
s,{mode:n})).then(({finalResult:i,commitDelta:o,provenance:a})=>{o&&this.commitDelta(o),this._recordTaskCompletion(s,{ok:!0,
mode:n,provenance:a,admission:s.placementAdmission,retry:a.retry||this._placementRetrySummary(s,{mode:n,ok:!0})}),s.resolve(
i)}).catch(i=>{const o=this._placementErrorKind(i),a=i?.retry?.schema===Ts?this._placementRetrySummary(s,{mode:n,ok:!1,errorKind:o}):
null;this._recordTaskCompletion(s,{ok:!1,mode:n,errorKind:o,errorMessage:i?.message||String(i),admission:s.placementAdmission||
i?.admission||null,provenance:i?.provenance||null,retry:a}),s.reject(i)}).finally(()=>{this.activeTasks.delete(e.id),this.
_scheduleIdleScaleDown(),this._scheduleNext()}),!0}_spawnWorker(){try{const e=this.workerBootstrapURL?new Worker(this.workerBootstrapURL,
{type:"module"}):U4();this._createWorkerBootstrapRecord(e);const t=this.nextWorkerOrdinal;this.nextWorkerOrdinal+=1;const n=`\
worker-${t}`;if(this.workerIds.set(e,n),this.workerUtilization.set(n,sl({executorId:n,kind:"worker",ordinal:t,status:"ac\
tive"})),e.onmessage=s=>this._handleWorkerMessage(e,s.data),e.onerror=s=>this._handleWorkerFailure(e,s),typeof e.addEventListener==
"function"){const s=this.workerBootstrap.get(e),i=o=>this._handleWorkerFailure(e,o);s&&(s.messageErrorListener=i),e.addEventListener(
"messageerror",i)}return this.workers.push(e),e}catch(e){return this.workerSpawnFailures+=1,this.config.requireWorkers?(this.
_failRequiredWorkerPool(this._createRequiredWorkerError("constructing a browser worker threw",e)),null):(console.warn("[\
ComputeManager] Failed to start worker; falling back to inline execution",e),null)}}_workerId(e){return this.workerIds.get(
e)||null}_executorStats(e,{kind:t="worker",ordinal:n=null,status:s="active"}={}){const i=String(e||this.inlineExecutorId);
return this.workerUtilization.has(i)||this.workerUtilization.set(i,sl({executorId:i,kind:t,ordinal:n,status:s})),this.workerUtilization.
get(i)}_executorBucket(e,t){const n=String(t||"unknown");return e[n]||(e[n]=Zc()),e[n]}_recordExecutorStart(e,t,{kind:n="\
worker"}={}){const s=this._executorStats(e,{kind:n}),i=t.runtime||t.payload?.runtime||"unknown",o=t.taskFamily||t.payload?.
taskFamily||"unknown";s.status=s.status==="retired"?"retired":"active",s.activeTaskCount+=1,s.submitted+=1,s.lastRuntime=
i,s.lastTaskFamily=o,s.lastStartedAt=Date.now(),this._executorBucket(s.byRuntime,i).submitted+=1,this._executorBucket(s.
byTaskFamily,o).submitted+=1,t.executorId=s.executorId,t.executorActive=!0}_recordExecutorCompletion(e,{ok:t=!0,durationMs:n=0}={}){
const s=e.executorId;if(!s)return;const i=this.workerUtilization.get(s);if(!i)return;e.executorActive&&(i.activeTaskCount=
Math.max(0,i.activeTaskCount-1),e.executorActive=!1);const o=e.runtime||e.payload?.runtime||"unknown",a=e.taskFamily||e.
payload?.taskFamily||"unknown",c=this._executorBucket(i.byRuntime,o),l=this._executorBucket(i.byTaskFamily,a);t?(i.completed+=
1,c.completed+=1,l.completed+=1):(i.failed+=1,c.failed+=1,l.failed+=1);const u=Number(Math.max(0,n).toFixed(3));i.totalDurationMs+=
n,i.lastDurationMs=u,i.maxDurationMs=Math.max(i.maxDurationMs,u);const h=i.completed+i.failed;i.averageDurationMs=h>0?Number(
(i.totalDurationMs/h).toFixed(3)):0,i.lastRuntime=o,i.lastTaskFamily=a,i.lastCompletedAt=Date.now();for(const d of[c,l]){
d.totalDurationMs+=n,d.lastDurationMs=u,d.maxDurationMs=Math.max(d.maxDurationMs,u);const p=d.completed+d.failed;d.averageDurationMs=
p>0?Number((d.totalDurationMs/p).toFixed(3)):0}}_recordExecutorAbandon(e){const t=e.executorId;if(!t||!e.executorActive)
return;const n=this.workerUtilization.get(t);n&&(n.activeTaskCount=Math.max(0,n.activeTaskCount-1),n.abandoned+=1,e.executorActive=
!1)}_cloneExecutorStats(e){return JSON.parse(JSON.stringify({...e,activeTaskCount:Math.max(0,e.activeTaskCount||0)}))}_getWorkerUtilizationReport(){
const e=Array.from(this.workerUtilization.values()).filter(h=>h.kind==="worker").sort((h,d)=>(h.ordinal??0)-(d.ordinal??
0)).map(h=>this._cloneExecutorStats(h)),t=this._cloneExecutorStats(this._executorStats(this.inlineExecutorId,{kind:"inli\
ne",ordinal:0})),n=e.filter(h=>h.status==="active"),s=e.filter(h=>h.status==="retired"),i=[t,...e],o=e.reduce((h,d)=>h+(d.
activeTaskCount||0),0),a=i.reduce((h,d)=>h+(d.submitted||0),0),c=i.reduce((h,d)=>h+(d.completed||0),0),l=i.reduce((h,d)=>h+
(d.failed||0),0),u=[...i].sort((h,d)=>(d.activeTaskCount||0)-(h.activeTaskCount||0)||(d.completed||0)-(h.completed||0)||
(d.submitted||0)-(h.submitted||0))[0]||t;return{schema:F4,generatedAt:Date.now(),inline:t,workers:e,summary:{workerCount:this.
workers.length,activeWorkerCount:n.length,retiredWorkerCount:s.length,retainedWorkerCount:e.length,inlineActiveTaskCount:t.
activeTaskCount||0,workerActiveTaskCount:o,activeTaskCount:o+(t.activeTaskCount||0),totalSubmitted:a,totalCompleted:c,totalFailed:l,
busiestExecutorId:u.executorId||null,busiestActiveTaskCount:u.activeTaskCount||0,busiestCompleted:u.completed||0}}}_placementBucket(e,t){
const n=String(t||"unknown");return e[n]||(e[n]=iT()),e[n]}_normalizeTaskPlacement(e={},{runtime:t="unknown",taskFamily:n="\
unknown"}={}){const s=e.placementHint||e.placement||e.data?.placementHint||e.data?.placement||e.data?.solver?.placementHint||
null,i=s?.recommendedPlacement||s?.requestedPlacement||s?.placement||"local",o=["local","peer","cluster"].includes(String(
i).trim().toLowerCase())?String(i).trim().toLowerCase():"local";return{schema:wp,source:s?"task-placement-hint-v0":"defa\
ult-local",advisoryOnly:s?.advisoryOnly!==!1,requestedPlacement:o,recommendedPlacement:o,actualPlacement:null,solverKey:s?.
solverKey||e.solverId||e.data?.solver?.id||null,solverId:s?.solverId||e.solverId||e.data?.solver?.id||null,taskFamily:n,
runtime:t,syncMode:s?.syncMode||null,timeoutMs:X(s?.timeoutMs,this.placementTimeoutMs,0,36e5),confidence:Number.isFinite(
Number(s?.confidence))?Number(s.confidence):null,targetReplicaCount:X(s?.targetReplicaCount,0,0,1e6),peerId:s?.peerId||s?.
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
stats.taskPlacement;if(!l||!u)return;const h=l.requestedPlacement||"local",d=String(n||"unknown"),p=d.startsWith("remote\
-")?d:d==="worker"?"local-worker":d==="inline"?"local-inline":`local-${d}`;t?u.totalCompleted+=1:u.totalFailed+=1,p.startsWith(
"remote-")&&(t?u.remoteExecuted+=1:(u.remoteFailed+=1,s==="timeout"&&(u.remoteTimedOut+=1),s==="rejected"&&(u.remoteRejected+=
1),s==="verification-failed"&&(u.remoteVerificationFailed+=1),s==="validation-failed"&&(u.remoteValidationFailed+=1),c?.
exhausted&&(u.remoteRetryExhausted+=1)));const m=this._placementBucket(u.byRecommendedPlacement,h),y=this._placementBucket(
u.byActualPlacement,p);t?(m.completed+=1,y.completed+=1):(m.failed+=1,y.failed+=1,s==="timeout"&&(m.timedOut+=1,y.timedOut+=
1),s==="rejected"&&(m.rejected+=1,y.rejected+=1),s==="verification-failed"&&(m.verificationFailed+=1,y.verificationFailed+=
1),s==="validation-failed"&&(m.validationFailed+=1,y.validationFailed+=1),c?.exhausted&&(m.retryExhausted+=1,y.retryExhausted+=
1)),y.submitted+=1,u.lastPlacement={...l,actualPlacement:p,completedAt:Date.now(),ok:t,errorKind:s,errorMessage:i,admission:a,
provenance:o,retry:c},p.startsWith("remote-")&&(u.lastRemotePlacement=JSON.parse(JSON.stringify(u.lastPlacement)))}_runtimeStats(e){
const t=String(e||"unknown");return this.stats.byRuntime[t]||(this.stats.byRuntime[t]=Zc()),this.stats.byRuntime[t]}_normalizeTaskFamily(e={},t="\
unknown"){const n=e.taskFamily||e.solverId||e.data?.solver?.id||e.data?.solverId||e.data?.taskFamily;if(n)return String(
n).trim()||"unknown";if(e.affinityKey||e.workerKey||e.data?.affinityKey||e.data?.stateKey){const s=String(e.affinityKey||
e.workerKey||e.data?.affinityKey||e.data?.stateKey),[i]=s.split(":");if(i)return i}return String(t||"unknown")}_taskFamilyStats(e){
const t=String(e||"unknown");return this.stats.byTaskFamily[t]||(this.stats.byTaskFamily[t]=Zc()),this.stats.byTaskFamily[t]}_recordTaskCompletion(e,{
ok:t=!0,mode:n="unknown",errorKind:s=null,errorMessage:i=null,provenance:o=null,admission:a=null,retry:c=null}={}){const l=e.
runtime||e.payload?.runtime||"unknown",u=this._runtimeStats(l),h=e.taskFamily||e.payload?.taskFamily||"unknown",d=this._taskFamilyStats(
h),p=pt(),m=Math.max(0,p-(e.submittedAt||e.startedAt||p)),y=Math.max(0,p-(e.startedAt||e.submittedAt||p));t?(this.stats.
totalTasksCompleted+=1,u.completed+=1,d.completed+=1,n==="worker"?this.stats.workerTasksCompleted+=1:String(n||"").startsWith(
"remote-")?this.stats.remoteTasksCompleted+=1:this.stats.inlineTasksCompleted+=1):(this.stats.totalTasksFailed+=1,u.failed+=
1,d.failed+=1,String(n||"").startsWith("remote-")&&(this.stats.remoteTasksFailed+=1,s==="timeout"&&(this.stats.remoteTasksTimedOut+=
1),s==="rejected"&&(this.stats.remoteTasksRejected+=1),s==="verification-failed"&&(this.stats.remoteTasksVerificationFailed+=
1),s==="validation-failed"&&(this.stats.remoteTasksValidationFailed+=1),c?.exhausted&&(this.stats.remoteTasksRetryExhausted+=
1))),this.stats.totalTaskDurationMs+=m,this.stats.lastTaskDurationMs=Number(m.toFixed(3)),this.stats.minTaskDurationMs=this.
stats.minTaskDurationMs==null?this.stats.lastTaskDurationMs:Math.min(this.stats.minTaskDurationMs,this.stats.lastTaskDurationMs),
this.stats.maxTaskDurationMs=Math.max(this.stats.maxTaskDurationMs,this.stats.lastTaskDurationMs),this.stats.averageTaskDurationMs=
this.stats.totalTasksCompleted+this.stats.totalTasksFailed>0?Number((this.stats.totalTaskDurationMs/(this.stats.totalTasksCompleted+
this.stats.totalTasksFailed)).toFixed(3)):0,this.stats.lastCompletedAt=Date.now(),u.totalDurationMs+=m,u.lastDurationMs=
this.stats.lastTaskDurationMs,u.maxDurationMs=Math.max(u.maxDurationMs,u.lastDurationMs);const b=u.completed+u.failed;u.
averageDurationMs=b>0?Number((u.totalDurationMs/b).toFixed(3)):0,d.totalDurationMs+=m,d.lastDurationMs=this.stats.lastTaskDurationMs,
d.maxDurationMs=Math.max(d.maxDurationMs,d.lastDurationMs);const f=d.completed+d.failed;d.averageDurationMs=f>0?Number((d.
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
const n=X(t,0,0,6e5);if(n<=0)return this._getWorkerAutoScaleHoldStatus();const s=Date.now()+n;return s>=this.workerAutoScaleHoldUntil&&
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
payload,n=e.gpuResidentLaneLease;if(!n)return t;const s=Object.freeze({schema:k4,authoritative:!0,leaseId:n.leaseId,laneId:n.
laneId,stateKey:n.stateKey,sourceFamily:n.sourceFamily,domainKey:n.domainKey,solverId:n.solverId,taskId:n.taskId,owner:n.
owner}),i=t?.data;return!i||typeof i!="object"||Array.isArray(i)?{...t,gpuResidentLaneLeaseIdentity:s}:{...t,data:{...i,
gpuResidentLaneLeaseIdentity:s},gpuResidentLaneLeaseIdentity:s}}_completeTaskGpuResidentLaneLease(e,t,{mode:n=null}={}){
const s=e.gpuResidentLaneLease;if(!s||e.gpuResidentLaneExecution)return t;const i=t&&typeof t=="object"?t:{},o=Zi(i.gpuFence||
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
gpuFence?.required!==!0)return;const n=t&&typeof t=="object"?t:{},s=e.gpuResidentLaneExecution?.gpuFence||Zi(n.gpuFence||
n.gpuFenceReport,e.payload.gpuFence);if(s?.fenceSatisfied===!0)return;const i=new Error(`GPU fence missing or unsatisfie\
d for task ${e.id||e.payload?.id||"unknown"}`);throw i.name="GpuFenceUnsatisfiedError",i.code="ERR_COMPUTE_GPU_FENCE_UNS\
ATISFIED",i.gpuFence=s||null,i.gpuFenceRequirement=e.payload.gpuFence,i}_dispatchToWorker(e){if(this._requiresInlineExecution(
e))return!1;const t=e.payload?.affinityKey;if(t&&this.residentWorkerAffinities.has(t)&&!this.workerAffinities.has(t))return this.
_recordTaskCompletion(e,{ok:!1,mode:"queued"}),e.reject(Object.assign(new Error("Resident worker was terminated"),{code:"\
ERR_COMPUTE_WORKER_TERMINATED",workerTerminated:!0})),!0;const n=new Set(Array.from(this.activeTasks.values()).map(c=>c.
worker)),s=this.workers.filter(c=>!this.workerTerminationFailures.has(c)&&(!(this.config.requireWorkers||e.payload?.requireWorker)||
this.workerBootstrap.get(c)?.status==="ready"));let i=null;if(t&&this.workerAffinities.has(t)){const c=this.workerAffinities.
get(t);if(!this.workers.includes(c))this.workerAffinities.delete(t);else if(s.includes(c)){if(n.has(c))return!1;i=c}else
return!1}if(!i){const c=new Set(this.workerAffinities.values()),l=new Set([...this.residentWorkerAffinities].map(h=>this.
workerAffinities.get(h))),u=s.filter(h=>!n.has(h)&&!l.has(h));i=u.find(h=>!c.has(h))||u[0],i&&t&&this.workerAffinities.set(
t,i)}if(!i)return!1;clearTimeout(e.control?.bootstrapTimer);const o=this._workerId(i)||"worker-unknown",a={...e,worker:i,
workerId:o,startedAt:pt(),executionMode:"worker"};this._recordExecutorStart(o,a,{kind:"worker"}),this.activeTasks.set(e.
id,a);try{i.postMessage({type:"run",...e.payload,workerId:o},e.transferables||[])}catch(c){this._handleWorkerFailure(i,c)}
return!0}_buildTaskExecutionReport(e,{mode:t=null,result:n=null}={}){const s=t||e.executionMode||null,i=e.runtime||e.payload?.
runtime||null,o=e.taskFamily||e.payload?.taskFamily||null,a=e.id||e.payload?.id||null,c=n&&typeof n=="object"?n:{},l=Zi(
c.gpuFence||c.gpuFenceReport,e.payload?.gpuFence||null)||e.gpuResidentLaneExecution?.gpuFence||null,u=e.executorId||(s===
"inline"||s==="inline-fallback"?this.inlineExecutorId:null),h=s==="worker"&&(e.workerId||e.executorId)||null;return{schema:z4,
taskId:a,runtime:i,taskFamily:o,executionMode:s,executorId:u,workerId:h,gpuFenceRequirement:e.payload?.gpuFence||null,gpuFence:l,
gpuFenceStatus:l?.status??null,gpuFenceSatisfied:l?.fenceSatisfied??!1,gpuResidentLaneRequirement:e.payload?.gpuResidentLane||
null,gpuResidentLaneExecution:e.gpuResidentLaneExecution||null,gpuResidentLaneRejected:e.gpuResidentLaneRejected||null}}_attachTaskExecutionReport(e,t,{
mode:n=null}={}){if(t.payload?.returnEnvelope!==!0)return e;const s=this._buildTaskExecutionReport(t,{mode:n,result:e});
if(e&&typeof e=="object"&&!Array.isArray(e)){const i={...e};return i.computeExecution||(i.computeExecution=s),i.workerId==
null&&s.workerId&&(i.workerId=s.workerId),i}return{value:e,computeExecution:s,...s.workerId?{workerId:s.workerId}:{}}}async _executeInline(e){
if(e.payload?.requireWorker){e.reject(this._createRequiredWorkerError("inline execution is prohibited for this task"));return}
e.startedAt=pt(),e.executionMode||="inline",this._recordExecutorStart(this.inlineExecutorId,e,{kind:"inline"});try{this.
_acquireTaskGpuResidentLaneLease(e);const t=await u4(this._taskPayloadWithGpuResidentLaneLeaseIdentity(e)),n=this._completeTaskGpuResidentLaneLease(
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
workers.length;if(this.destroying||!this.initialized||!this._supportsWorkers())return this.workers.length;const t=X(this.
targetWorkerCount,this.workerPolicy.targetWorkers,0,this.workerPolicy.maxWorkers);if(t<=this.workers.length)return this.
workers.length;const n=this.targetWorkerCount,s=this.workers.length;for(;this.workers.length<t&&this._spawnWorker(););return this.
workers.length!==s&&this._recordWorkerResize({reason:e,previousTargetWorkers:n,previousWorkerCount:s}),this.workers.length}}
function wy(r){for(const e of Object.values(r))e&&typeof e=="object"&&wy(e);return Object.freeze(r)}const wT=wy({"qwen2.\
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
9baa484"}]}});function ky(r){for(const e of Object.values(r))e&&typeof e=="object"&&ky(e);return Object.freeze(r)}const Qa=ky(
{...wT,"qwen3-0.6b-q4":{id:"qwen3-0.6b-q4",name:"Qwen3 0.6B (q4)",repository:"onnx-community/Qwen3-0.6B-ONNX",revision:"\
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
g.json",size:10069,gitBlobSha1:"1a7a8b42ef296f48ac686bab602f518da32dd85c"}]}});function kT(r,e){const t=Qa[r];if(!t||!t.
files.some(s=>s.path===e))throw new Error("Unknown catalog model file");const n=e.split("/").map(encodeURIComponent).join(
"/");return`https://huggingface.co/${t.repository}/resolve/${t.revision}/${n}`}const Ms="Tsotchke-Corporation/Qwen3.8-27\
B-GeoRefine-D14-abl-GGUF",Rs="5ce3fd841676adf2c1a10d7193637d46007e88f7",Ap=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],ET="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function Ey(r){
for(const e of Object.values(r))e&&typeof e=="object"&&Ey(e);return Object.freeze(r)}const vd=Ey({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ms,revision:Rs,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:ET},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ms}/blob/${Rs}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ms,revision:Rs,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ms}/blob/${Rs}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ms,revision:Rs},weightBytes:14199740480,
totalBytes:Ap.reduce((r,e)=>r+e.size,0),files:Ap}});function xT(r,e){const t=vd[r];if(!t||!t.files.some(s=>s.path===e))throw new Error(
"Unknown catalog artifact model file.");const n=e.split("/").map(encodeURIComponent).join("/");return`https://huggingfac\
e.co/${t.repository}/resolve/${t.revision}/${n}`}function xy(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.
values(r).forEach(xy),Object.freeze(r)),r}const vT=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],ST=xy(Object.fromEntries(vT.map(r=>{const{dtype:e,sourceModel:t,blockCount:n,nextnPredictLayers:s,...i}=r,
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
files.reduce((c,l)=>c+l.size,0)}]})));function Sd(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.values(r).
forEach(Sd),Object.freeze(r)),r}const pr="Tsotchke-Corporation",vy=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${pr}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
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
S GGUF, candidate text)",repository:`${pr}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
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
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${pr}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
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
06e0df3640f9ae04fff09706ef"}]}],AT=Sd(Object.fromEntries(vy.map(r=>{const{architecture:e,quantizationTypes:t,sourceModel:n,
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
reduce((o,a)=>o+a.size,0)}]})));Sd({organization:pr,sourceUrl:`https://huggingface.co/${pr}`,checkedAt:"2026-11-04",repositories:[
...vy.map(({id:r,repository:e,revision:t})=>({repository:e,revision:t,catalogId:r,format:"GGUF",codecRequired:!1})),{repository:`${pr}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${pr}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${pr}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${pr}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Bs="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ls="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",il=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],hu=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function Sy(r){return r&&typeof r=="object"&&!Object.isFrozen(r)&&(Object.
values(r).forEach(Sy),Object.freeze(r)),r}const _T=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:r,...e})=>[e.id,Sy({...e,
status:"execution-candidate",format:"GGUF",capabilities:hu,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:r,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.
revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((t,n)=>t+n.size,0)})])),Ja=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Bs,revision:Ls,status:"ex\
ecution-candidate",format:"GGUF",capabilities:hu,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Bs}/blob\
/${Ls}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Bs,
revision:Ls,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Bs}/blob/${Ls}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Bs,revision:Ls},weightBytes:il[0].size,totalBytes:il.reduce((r,e)=>r+e.size,0),files:il},
..._T,...ST,...AT,...Object.fromEntries(Object.entries(vd).map(([r,e])=>[r,{...e,status:"execution-candidate",capabilities:hu}]))});
function IT(r,e){const t=Ja[r],n=t?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog GGUF model file.");
const s=n.source??{repository:t.repository,revision:t.revision,path:e};return`https://huggingface.co/${s.repository}/res\
olve/${s.revision}/${s.path.split("/").map(encodeURIComponent).join("/")}`}function Ay(r){return r&&typeof r=="object"&&
!Object.isFrozen(r)&&(Object.values(r).forEach(Ay),Object.freeze(r)),r}const CT=[{id:"sd-turbo-onnx",name:"Stable Diffus\
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
Lykon/dreamshaper-8-lcm",baseRevision:"4645d8bc6a8e6b106d21606d63e8460cdad4f1a6"}}],Xa=Ay(Object.fromEntries(CT.map(r=>[
r.id,{...r,status:"execution-candidate",format:"ONNX",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires hardware WebGPU with shader-f16 and an \
admitted managed ONNX diffusion worker. Device execution must be verified."},provenance:{...r.provenance,repository:r.repository,
revision:r.revision,format:"ONNX",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${r.repository}/bl\
ob/${r.revision}/README.md`,fileSources:Object.fromEntries(r.files.map(e=>[e.path,e.source]))},model:{runtime:"onnx-diff\
usion",runtimeVersion:"1.31.1",architecture:r.architecture,format:"ONNX",task:"text-to-image",pipeline:r.pipeline,dtype:r.
dtype,...r.weightQuantization?{weightQuantization:r.weightQuantization}:{},modalities:["text"],outputModalities:["image"],
requiredFeatures:["shader-f16"],width:512,height:512,steps:r.steps,padTokenId:r.padTokenId,repository:r.repository,revision:r.
revision},weightBytes:r.files.filter(e=>e.path.endsWith(".onnx")).reduce((e,t)=>e+t.size,0),totalBytes:r.files.reduce((e,t)=>e+
t.size,0)}])));function TT(r,e){const n=Xa[r]?.files.find(i=>i.path===e);if(!n)throw new Error("Unknown catalog diffusio\
n model file.");const s=n.source;return`https://huggingface.co/${s.repository}/resolve/${s.revision}/${s.path.split("/").
map(encodeURIComponent).join("/")}`}/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */function MT(r){
return r instanceof Uint8Array||ArrayBuffer.isView(r)&&r.constructor.name==="Uint8Array"}function _p(r,e=""){if(!Number.
isSafeInteger(r)||r<0){const t=e&&`"${e}" `;throw new Error(`${t}expected integer >= 0, got ${r}`)}}function Di(r,e,t=""){
const n=MT(r),s=r?.length,i=e!==void 0;if(!n||i&&s!==e){const o=t&&`"${t}" `,a=i?` of length ${e}`:"",c=n?`length=${s}`:
`type=${typeof r}`;throw new Error(o+"expected Uint8Array"+a+", got "+c)}return r}function UB(r){if(typeof r!="function"||
typeof r.create!="function")throw new Error("Hash must wrapped by utils.createHasher");_p(r.outputLen),_p(r.blockLen)}function Ip(r,e=!0){
if(r.destroyed)throw new Error("Hash instance has been destroyed");if(e&&r.finished)throw new Error("Hash#digest() has a\
lready been called")}function RT(r,e){Di(r,void 0,"digestInto() output");const t=e.outputLen;if(r.length<t)throw new Error(
'"digestInto() output" expected to be of length >='+t)}function gn(...r){for(let e=0;e<r.length;e++)r[e].fill(0)}function ol(r){
return new DataView(r.buffer,r.byteOffset,r.byteLength)}function Kt(r,e){return r<<32-e|r>>>e}function al(r,e){return r<<
e|r>>>32-e>>>0}const _y=typeof Uint8Array.from([]).toHex=="function"&&typeof Uint8Array.fromHex=="function",BT=Array.from(
{length:256},(r,e)=>e.toString(16).padStart(2,"0"));function LT(r){if(Di(r),_y)return r.toHex();let e="";for(let t=0;t<r.
length;t++)e+=BT[r[t]];return e}const lr={_0:48,_9:57,A:65,F:70,a:97,f:102};function Cp(r){if(r>=lr._0&&r<=lr._9)return r-
lr._0;if(r>=lr.A&&r<=lr.F)return r-(lr.A-10);if(r>=lr.a&&r<=lr.f)return r-(lr.a-10)}function FB(r){if(typeof r!="string")
throw new Error("hex string expected, got "+typeof r);if(_y)return Uint8Array.fromHex(r);const e=r.length,t=e/2;if(e%2)throw new Error(
"hex string expected, got unpadded hex of length "+e);const n=new Uint8Array(t);for(let s=0,i=0;s<t;s++,i+=2){const o=Cp(
r.charCodeAt(i)),a=Cp(r.charCodeAt(i+1));if(o===void 0||a===void 0){const c=r[i]+r[i+1];throw new Error('hex string expe\
cted, got non-hex character "'+c+'" at index '+i)}n[s]=o*16+a}return n}const DT=async()=>{};async function OB(r,e,t){let n=Date.
now();for(let s=0;s<r;s++){t(s);const i=Date.now()-n;i>=0&&i<e||(await DT(),n+=i)}}function PT(r){if(typeof r!="string")
throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(r))}function zB(r,e=""){return typeof r==
"string"?PT(r):Di(r,void 0,e)}function qB(...r){let e=0;for(let n=0;n<r.length;n++){const s=r[n];Di(s),e+=s.length}const t=new Uint8Array(
e);for(let n=0,s=0;n<r.length;n++){const i=r[n];t.set(i,s),s+=i.length}return t}function jB(r,e){if(e!==void 0&&{}.toString.
call(e)!=="[object Object]")throw new Error("options must be object or undefined");return Object.assign(r,e)}function Ad(r,e={}){
const t=(s,i)=>r(i).update(s).digest(),n=r(void 0);return t.outputLen=n.outputLen,t.blockLen=n.blockLen,t.create=s=>r(s),
Object.assign(t,e),Object.freeze(t)}function GB(r=32){const e=typeof globalThis=="object"?globalThis.crypto:null;if(typeof e?.
getRandomValues!="function")throw new Error("crypto.getRandomValues must be defined");return e.getRandomValues(new Uint8Array(
r))}const Iy=r=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,r])});function Cy(r,e,t){return r&e^~r&t}function Ty(r,e,t){
return r&e^r&t^e&t}class _d{blockLen;outputLen;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,s){
this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=s,this.buffer=new Uint8Array(e),this.view=ol(this.buffer)}update(e){
Ip(this),Di(e);const{view:t,buffer:n,blockLen:s}=this,i=e.length;for(let o=0;o<i;){const a=Math.min(s-this.pos,i-o);if(a===
s){const c=ol(e);for(;s<=i-o;o+=s)this.process(c,o);continue}n.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===
s&&(this.process(t,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){Ip(this),RT(e,this),
this.finished=!0;const{buffer:t,view:n,blockLen:s,isLE:i}=this;let{pos:o}=this;t[o++]=128,gn(this.buffer.subarray(o)),this.
padOffset>s-o&&(this.process(n,0),o=0);for(let h=o;h<s;h++)t[h]=0;n.setBigUint64(s-8,BigInt(this.length*8),i),this.process(
n,0);const a=ol(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen must be aligned to 32bit");const l=c/4,u=this.
get();if(l>u.length)throw new Error("_sha2: outputLen bigger than state");for(let h=0;h<l;h++)a.setUint32(4*h,u[h],i)}digest(){
const{buffer:e,outputLen:t}=this;this.digestInto(e);const n=e.slice(0,t);return this.destroy(),n}_cloneInto(e){e||=new this.
constructor,e.set(...this.get());const{blockLen:t,buffer:n,length:s,finished:i,destroyed:o,pos:a}=this;return e.destroyed=
o,e.finished=i,e.length=s,e.pos=a,s%t&&e.buffer.set(n),e}clone(){return this._cloneInto()}}const Lr=Uint32Array.from([1779033703,
3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),Ve=Uint32Array.from([1779033703,4089235720,
3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,
1541459225,327033209]),eo=BigInt(2**32-1),Tp=BigInt(32);function $T(r,e=!1){return e?{h:Number(r&eo),l:Number(r>>Tp&eo)}:
{h:Number(r>>Tp&eo)|0,l:Number(r&eo)|0}}function NT(r,e=!1){const t=r.length;let n=new Uint32Array(t),s=new Uint32Array(
t);for(let i=0;i<t;i++){const{h:o,l:a}=$T(r[i],e);[n[i],s[i]]=[o,a]}return[n,s]}const Mp=(r,e,t)=>r>>>t,Rp=(r,e,t)=>r<<32-
t|e>>>t,Bn=(r,e,t)=>r>>>t|e<<32-t,Ln=(r,e,t)=>r<<32-t|e>>>t,to=(r,e,t)=>r<<64-t|e>>>t-32,ro=(r,e,t)=>r>>>t-32|e<<64-t;function ur(r,e,t,n){
const s=(e>>>0)+(n>>>0);return{h:r+t+(s/2**32|0)|0,l:s|0}}const UT=(r,e,t)=>(r>>>0)+(e>>>0)+(t>>>0),FT=(r,e,t,n)=>e+t+n+
(r/2**32|0)|0,OT=(r,e,t,n)=>(r>>>0)+(e>>>0)+(t>>>0)+(n>>>0),zT=(r,e,t,n,s)=>e+t+n+s+(r/2**32|0)|0,qT=(r,e,t,n,s)=>(r>>>0)+
(e>>>0)+(t>>>0)+(n>>>0)+(s>>>0),jT=(r,e,t,n,s,i)=>e+t+n+s+i+(r/2**32|0)|0,GT=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Dr=new Uint32Array(64);class WT extends _d{constructor(e){super(64,e,8,!1)}get(){const{A:e,B:t,C:n,D:s,E:i,
F:o,G:a,H:c}=this;return[e,t,n,s,i,o,a,c]}set(e,t,n,s,i,o,a,c){this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0,this.
F=o|0,this.G=a|0,this.H=c|0}process(e,t){for(let h=0;h<16;h++,t+=4)Dr[h]=e.getUint32(t,!1);for(let h=16;h<64;h++){const d=Dr[h-
15],p=Dr[h-2],m=Kt(d,7)^Kt(d,18)^d>>>3,y=Kt(p,17)^Kt(p,19)^p>>>10;Dr[h]=y+Dr[h-7]+m+Dr[h-16]|0}let{A:n,B:s,C:i,D:o,E:a,F:c,
G:l,H:u}=this;for(let h=0;h<64;h++){const d=Kt(a,6)^Kt(a,11)^Kt(a,25),p=u+d+Cy(a,c,l)+GT[h]+Dr[h]|0,y=(Kt(n,2)^Kt(n,13)^
Kt(n,22))+Ty(n,s,i)|0;u=l,l=c,c=a,a=o+p|0,o=i,i=s,s=n,n=p+y|0}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.
E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(n,s,i,o,a,c,l,u)}roundClean(){gn(Dr)}destroy(){this.set(0,0,0,0,0,0,
0,0),gn(this.buffer)}}class VT extends WT{A=Lr[0]|0;B=Lr[1]|0;C=Lr[2]|0;D=Lr[3]|0;E=Lr[4]|0;F=Lr[5]|0;G=Lr[6]|0;H=Lr[7]|
0;constructor(){super(32)}}const My=NT(["0x428a2f98d728ae22","0x7137449123ef65cd","0xb5c0fbcfec4d3b2f","0xe9b5dba58189db\
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
5fcb6fab3ad6faec","0x6c44198c4a475817"].map(r=>BigInt(r))),HT=My[0],KT=My[1],Pr=new Uint32Array(80),$r=new Uint32Array(80);
class QT extends _d{constructor(e){super(128,e,16,!1)}get(){const{Ah:e,Al:t,Bh:n,Bl:s,Ch:i,Cl:o,Dh:a,Dl:c,Eh:l,El:u,Fh:h,
Fl:d,Gh:p,Gl:m,Hh:y,Hl:b}=this;return[e,t,n,s,i,o,a,c,l,u,h,d,p,m,y,b]}set(e,t,n,s,i,o,a,c,l,u,h,d,p,m,y,b){this.Ah=e|0,
this.Al=t|0,this.Bh=n|0,this.Bl=s|0,this.Ch=i|0,this.Cl=o|0,this.Dh=a|0,this.Dl=c|0,this.Eh=l|0,this.El=u|0,this.Fh=h|0,
this.Fl=d|0,this.Gh=p|0,this.Gl=m|0,this.Hh=y|0,this.Hl=b|0}process(e,t){for(let w=0;w<16;w++,t+=4)Pr[w]=e.getUint32(t),
$r[w]=e.getUint32(t+=4);for(let w=16;w<80;w++){const k=Pr[w-15]|0,x=$r[w-15]|0,A=Bn(k,x,1)^Bn(k,x,8)^Mp(k,x,7),v=Ln(k,x,
1)^Ln(k,x,8)^Rp(k,x,7),E=Pr[w-2]|0,C=$r[w-2]|0,I=Bn(E,C,19)^to(E,C,61)^Mp(E,C,6),M=Ln(E,C,19)^ro(E,C,61)^Rp(E,C,6),R=OT(
v,M,$r[w-7],$r[w-16]),$=zT(R,A,I,Pr[w-7],Pr[w-16]);Pr[w]=$|0,$r[w]=R|0}let{Ah:n,Al:s,Bh:i,Bl:o,Ch:a,Cl:c,Dh:l,Dl:u,Eh:h,
El:d,Fh:p,Fl:m,Gh:y,Gl:b,Hh:f,Hl:g}=this;for(let w=0;w<80;w++){const k=Bn(h,d,14)^Bn(h,d,18)^to(h,d,41),x=Ln(h,d,14)^Ln(
h,d,18)^ro(h,d,41),A=h&p^~h&y,v=d&m^~d&b,E=qT(g,x,v,KT[w],$r[w]),C=jT(E,f,k,A,HT[w],Pr[w]),I=E|0,M=Bn(n,s,28)^to(n,s,34)^
to(n,s,39),R=Ln(n,s,28)^ro(n,s,34)^ro(n,s,39),$=n&i^n&a^i&a,P=s&o^s&c^o&c;f=y|0,g=b|0,y=p|0,b=m|0,p=h|0,m=d|0,{h,l:d}=ur(
l|0,u|0,C|0,I|0),l=a|0,u=c|0,a=i|0,c=o|0,i=n|0,o=s|0;const O=UT(I,R,P);n=FT(O,C,M,$),s=O|0}({h:n,l:s}=ur(this.Ah|0,this.
Al|0,n|0,s|0)),{h:i,l:o}=ur(this.Bh|0,this.Bl|0,i|0,o|0),{h:a,l:c}=ur(this.Ch|0,this.Cl|0,a|0,c|0),{h:l,l:u}=ur(this.Dh|
0,this.Dl|0,l|0,u|0),{h,l:d}=ur(this.Eh|0,this.El|0,h|0,d|0),{h:p,l:m}=ur(this.Fh|0,this.Fl|0,p|0,m|0),{h:y,l:b}=ur(this.
Gh|0,this.Gl|0,y|0,b|0),{h:f,l:g}=ur(this.Hh|0,this.Hl|0,f|0,g|0),this.set(n,s,i,o,a,c,l,u,h,d,p,m,y,b,f,g)}roundClean(){
gn(Pr,$r)}destroy(){gn(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}}class JT extends QT{Ah=Ve[0]|0;Al=Ve[1]|0;Bh=Ve[2]|
0;Bl=Ve[3]|0;Ch=Ve[4]|0;Cl=Ve[5]|0;Dh=Ve[6]|0;Dl=Ve[7]|0;Eh=Ve[8]|0;El=Ve[9]|0;Fh=Ve[10]|0;Fl=Ve[11]|0;Gh=Ve[12]|0;Gl=Ve[13]|
0;Hh=Ve[14]|0;Hl=Ve[15]|0;constructor(){super(64)}}const XT=Ad(()=>new VT,Iy(1)),WB=Ad(()=>new JT,Iy(3)),YT="transformer\
s.js",Id="4.3.2",le=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:1536*1024*1024,maxContextTokens:2048,
maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,
maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),ZT=Object.freeze({maxModelBytes:2*1024**3,minimumCpuBytes:8*1024**3,
minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),eM=Object.freeze({maxModelBytes:le.maxModelBytes,minimumCpuBytes:0,
minimumGpuBytes:0,maxProcessedImagePixels:le.maxImagePixels}),cl=new Set(["qwen3","qwen2","llama"]);function Ya(r){return r?.
architecture==="qwen3_5"?ZT:eM}function fu(r="Operation cancelled"){return r?.name==="AbortError"?r:new DOMException(typeof r==
"string"?r:"Operation cancelled","AbortError")}function Ye(r){if(r?.aborted)throw fu(r.reason)}function qs(r){if(typeof r!=
"string"||!/^[A-Za-z0-9_-]{1,128}$/.test(r))throw new Error("Invalid model session ID");return r}function ma(r){if(typeof r!=
"string"||!r||new TextEncoder().encode(r).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(r)||r.startsWith("/")||r.split(
"/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return r}function tM(r){let e;try{e=JSON.
stringify(r)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>le.maxManifestBytes)
throw new Error("Model manifest exceeds its metadata budget");const t=JSON.parse(e);if(t.schema!=="peercompute.artifact.\
manifest.v1"||!Array.isArray(t.files)||!t.files.length||t.files.length>le.maxFiles)throw new Error("Invalid model manife\
st files");const n=new Set,s=Ya(t.model);let i=0;for(const u of t.files){if(ma(u.path),n.has(u.path))throw new Error("Du\
plicate model artifact path");n.add(u.path);const h=Zn.parse(u.cid);if(![85,112].includes(h.code)||h.multihash.code!==18||
h.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(u.size)||u.size<0||!/^[a-f0-9]{64}$/i.
test(u.sha256??""))throw new Error("Invalid model file size/digest");if(u.sha256=u.sha256.toLowerCase(),i+=u.size,!Number.
isSafeInteger(i)||i>s.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const o=t.model;if(o?.runtime!==
YT||o.runtimeVersion!==Id||![...cl,"idefics3","smolvlm","qwen3_5"].includes(o.architecture))throw new Error("Model runti\
me, architecture or dtype is not approved");if(o.task??=cl.has(o.architecture)?"text-generation":"image-text-to-text",![
"text-generation","image-text-to-text"].includes(o.task)||cl.has(o.architecture)!==(o.task==="text-generation"))throw new Error(
"Model task does not match its admitted architecture");const a=typeof o.dtype=="string"?[["model",o.dtype]]:o.dtype&&typeof o.
dtype=="object"&&!Array.isArray(o.dtype)?Object.entries(o.dtype):[];if(!a.length||a.length>16||a.some(([u,h])=>!/^[A-Za-z0-9_-]{1,100}$/.
test(u)||!["fp32","fp16","q4","q4f16","q8"].includes(h)))throw new Error("Invalid model dtype configuration");if(o.architecture===
"qwen3_5"&&a.some(([,u])=>u!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const c=u=>u==="fp3\
2"?"":u==="q8"?"_quantized":`_${u}`,l=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof o.dtype!="stri\
ng"||o.task==="text-generation")&&l.push(...a.map(([u,h])=>`onnx/${u}${c(h)}.onnx`)),o.task==="image-text-to-text")for(const u of[
"embed_tokens","vision_encoder","decoder_model_merged"]){const h=typeof o.dtype=="string"?o.dtype:o.dtype[u];if(!h)throw new Error(
"Multimodal dtype configuration is missing a module");l.push(`onnx/${u}${c(h)}.onnx`),o.architecture==="qwen3_5"&&l.push(
`onnx/${u}${c(h)}.onnx_data`)}if(l.some(u=>!n.has(u)))throw new Error("Incomplete model package");if(o.task==="image-tex\
t-to-text"&&!n.has("preprocessor_config.json")&&!n.has("processor_config.json"))throw new Error("Multimodal processor co\
nfiguration is missing");if(o.requiredFeatures!==void 0&&(!Array.isArray(o.requiredFeatures)||o.requiredFeatures.length>
32||o.requiredFeatures.some(u=>typeof u!="string"||u.length>80)))throw new Error("Invalid model GPU features");return{manifest:t,
totalBytes:i,resourcePolicy:s}}function rM(r,e){const t=new URL(e),n={};for(const s of["mjs","wasm"]){if(typeof r?.[s]!=
"string")throw new Error("Trusted ORT runtime assets are required");const i=new URL(r[s],t);if(i.origin!==t.origin||i.username||
i.password||i.hash||!["http:","https:"].includes(i.protocol)||!i.pathname.endsWith(`.${s}`))throw new Error("ORT assets \
must be approved same-origin runtime files");n[s]=i.href}return n}const kt=1024**3,nM=[...Object.values(Qa),...Object.values(
Ja),...Object.values(Xa)],sM=["maxBufferSize","maxStorageBufferBindingSize","maxComputeWorkgroupStorageSize","maxCompute\
InvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWor\
kgroupsPerDimension"],iM=new Set(["transformers.js","llama.cpp","onnx-diffusion"]);function pu(r,e=nM){const t=r?.model??
r??{},n=e.filter(s=>s.model.runtime===t.runtime&&(s.repository??s.model.repository)===(t.repository??r?.repository)&&(s.
revision??s.model.revision)===(t.revision??r?.revision)&&["architecture","task","format","dtype"].every(i=>!r?.model&&t[i]===
void 0||Cd(t[i],s.model[i]))&&(!r?.model||!Array.isArray(r.files)||!Array.isArray(s.files)||oM(t.runtime,r.files,s.files)));
return n.length===1?n[0]:r?.model?void 0:n.find(s=>s.id===r?.modelId)}function oM(r,e,t){const n=o=>r!=="llama.cpp"||o.path?.
endsWith(".gguf"),s=e.filter(n),i=t.filter(n);return s.length===i.length&&s.every(o=>i.some(a=>a.path===o.path&&a.size===
o.size&&(a.sha256===void 0||a.sha256===o.sha256)))}function Ry(r){const e=r?.model??r??{},t=pu(r),n=r?.model?e:t?.model??
e,s=r?.files??t?.files;let i=null;if(s!==void 0){if(!Array.isArray(s)||!s.length||s.length>le.maxFiles)throw new Error("\
Invalid model file list");i=0;for(const o of s){if(!o||!Number.isSafeInteger(o.size)||o.size<0)throw new Error("Invalid \
model file size");if(i+=o.size,!Number.isSafeInteger(i))throw new Error("Invalid model package size")}}else Number.isSafeInteger(
r?.totalBytes)&&r.totalBytes>=0&&(i=r.totalBytes);return{model:n,files:s,trusted:t,totalBytes:i,descriptorOnly:!r?.model&&
!t&&s===void 0}}function xo(r){const{model:e,totalBytes:t}=Ry(r);if(e.runtime==="onnx-diffusion")return{cpuBytes:8*kt,gpuBytes:8*
kt};if(e.runtime==="llama.cpp"){if(t===null)return{cpuBytes:0,gpuBytes:0};const n=t>4*kt;return{cpuBytes:(n?8:2)*kt,gpuBytes:(n?
16:2)*kt}}if(e.runtime==="transformers.js"){const n=Ya(e);return{cpuBytes:Math.max(4*kt,n.minimumCpuBytes),gpuBytes:Math.
max(4*kt,n.minimumGpuBytes)}}throw new Error("Unsupported model runtime")}function mu(r={}){if(r===null&&(r={}),typeof r!=
"object"||Array.isArray(r)||![Object.prototype,null].includes(Object.getPrototypeOf(r))||Object.keys(r).some(t=>!["cpuBy\
tes","gpuBytes"].includes(t)))throw new TypeError("Invalid model memory budgets");const e={};for(const t of["cpuBytes","\
gpuBytes"]){const n=r[t];if(n==null)e[t]=null;else{if(!Number.isSafeInteger(n)||n<=0||n>1024*kt)throw new RangeError(`In\
valid ${t} memory budget`);e[t]=n}}return e}async function aM({scope:r=globalThis,timeoutMs:e=3e3}={}){if(!Number.isSafeInteger(
e)||e<1||e>6e4)throw new RangeError("Invalid device probe timeout");const t=r.WebAssembly,n=r.navigator?.deviceMemory,s={
webgpu:null,features:[],limits:{},crossOriginIsolated:r.crossOriginIsolated===!0,sharedArrayBuffer:typeof r.SharedArrayBuffer==
"function",jspi:typeof t?.Suspending=="function"&&typeof t?.promising=="function",memory64:!1,deviceMemoryGiB:typeof n==
"number"&&Number.isFinite(n)&&n>0?n:null};if(s.sharedArrayBuffer&&typeof t?.Memory=="function")try{new t.Memory({initial:0n,
maximum:1n,shared:!0,address:"i64"}),s.memory64=!0}catch{}const i=r.navigator?.gpu;if(typeof i?.requestAdapter!="functio\
n")return{...s,webgpu:!1};const o=performance.now()+e,a=new Error("GPU capability check timed out");let c,l,u,h=!1;const d=()=>{
if(h||performance.now()>=o)throw a},p=async()=>{d();let m=await i.requestAdapter({powerPreference:"high-performance"});return d(),
m==null&&(await new Promise(y=>{u=y,l=setTimeout(y,100)}),l=u=void 0,d(),m=await i.requestAdapter({powerPreference:"high\
-performance"}),d()),m};try{const m=await Promise.race([p(),new Promise((y,b)=>{c=setTimeout(()=>b(a),e)})]);if(!m||m.isFallbackAdapter||
m.info?.isFallbackAdapter)return{...s,webgpu:!1};s.features=[...m.features].filter(y=>typeof y=="string"&&y.length<=80).
slice(0,64).sort();for(const y of sM){const b=m.limits?.[y];Number.isSafeInteger(b)&&b>0&&(s.limits[y]=b)}s.webgpu=!0}catch(m){
s.probeError=String(m?.message??m).slice(0,300)}finally{h=!0,clearTimeout(c),clearTimeout(l),u?.()}return s}function cM({
model:r,files:e,totalBytes:t,trusted:n,descriptorOnly:s}){if(!iM.has(r.runtime))return["runtime_unsupported","This model\
 runtime is not supported locally"];if(r.requiredFeatures!==void 0&&(!Array.isArray(r.requiredFeatures)||r.requiredFeatures.
length>32||r.requiredFeatures.some(o=>typeof o!="string"||!o||o.length>80)))return["model_invalid","Invalid model GPU fe\
ature requirements"];const i=r.runtime==="llama.cpp"?16*kt:r.runtime==="onnx-diffusion"?3*kt:Ya(r).maxModelBytes;if(!s&&
t!==null&&t>i)return["package_too_large",`Model package is ${(t/kt).toFixed(2)} GiB; this runtime supports up to ${Number(
(i/kt).toFixed(2))} GiB.`];if(r.runtime==="transformers.js"){if((!s||r.runtimeVersion!==void 0)&&r.runtimeVersion!==Id||
(!s||r.architecture!==void 0)&&!["qwen2","qwen3","llama","qwen3_5","idefics3","smolvlm"].includes(r.architecture))return[
"runtime_unsupported","Model version or architecture is not supported locally"];const o=typeof r.dtype=="string"?[r.dtype]:
r.dtype&&typeof r.dtype=="object"&&!Array.isArray(r.dtype)?Object.values(r.dtype):[];if((!s||r.dtype!==void 0)&&(!o.length||
o.some(a=>!["fp32","fp16","q4","q4f16","q8"].includes(a))||r.architecture==="qwen3_5"&&o.some(a=>a!=="q4")))return["runt\
ime_unsupported","Model precision is not supported by this runtime"]}else{if(!n||r.runtimeVersion!==n.model.runtimeVersion&&
!(r.runtime==="llama.cpp"&&n.model.runtimeVersion===void 0&&r.runtimeVersion==="3.8.1"))return["catalog_unsupported","Th\
is package is not in the approved local runtime catalog"];for(const o of r.runtime==="onnx-diffusion"?["architecture","t\
ask","format","dtype","pipeline","width","height","steps","padTokenId","weightQuantization","modalities","outputModaliti\
es","requiredFeatures"]:["architecture","task","format","dtype"])if(!Cd(r[o],n.model[o]))return["catalog_unsupported","M\
odel profile differs from the approved runtime catalog"];if(e){const o=r.runtime==="llama.cpp"?n.files.filter(c=>c.path.
endsWith(".gguf")):n.files,a=r.runtime==="llama.cpp"?e.filter(c=>c.path?.endsWith(".gguf")):e;if(a.length!==o.length||a.
some(c=>!o.some(l=>l.path===c.path&&l.size===c.size&&l.sha256===c.sha256)))return["catalog_unsupported","Model files dif\
fer from the approved runtime catalog"]}}return r.runtime==="onnx-diffusion"&&e?.some(o=>o.size<=0||o.size>=2*kt)?["file\
_too_large","A file exceeds the diffusion loader’s supported buffer size"]:null}function Cd(r,e){return r===e?!0:!r||!e||
typeof r!="object"||typeof e!="object"||Array.isArray(r)!==Array.isArray(e)?!1:Object.keys(r).length===Object.keys(e).length&&
Object.keys(r).every(t=>Cd(r[t],e[t]))}function lM(r,{device:e,budgets:t={}}={}){const n=mu(t);let s,i,o;try{s=Ry(r),i=xo(
r)}catch(d){o=d,i={cpuBytes:0,gpuBytes:0}}const a=(d,p,m)=>({status:d,reason:m,code:p,...i});if(!e)return a("checking","\
device_checking","Checking device compatibility");if(o)return a("unavailable","model_invalid",o.message);const c=cM(s);if(c)
return a("unavailable",...c);if(n.cpuBytes!==null&&i.cpuBytes>n.cpuBytes)return a("unavailable","cpu_budget_exceeded","E\
xceeds configured RAM memory budget");if(n.gpuBytes!==null&&i.gpuBytes>n.gpuBytes)return a("unavailable","gpu_budget_exc\
eeded","Exceeds configured GPU memory budget");if(e.webgpu===!1)return a("unavailable","webgpu_unavailable","Hardware We\
bGPU is unavailable in this browser");if(s.model.runtime==="llama.cpp")for(const[d,p]of[["crossOriginIsolated","GGUF req\
uires cross-origin isolation"],["sharedArrayBuffer","GGUF requires SharedArrayBuffer"],["jspi","GGUF requires WebAssembl\
y JSPI"],["memory64","GGUF requires shared WebAssembly memory64"]]){if(e[d]===!1)return a("unavailable",`gguf_${d}_unava\
ilable`,p);if(e[d]!==!0)return a("unknown","device_probe_unknown","GGUF browser prerequisites have not been verified")}if(e.
webgpu!==!0)return a("unknown","device_probe_unknown","GPU capability check is incomplete; RAM/GPU memory fit is unverif\
ied");const l=new Set(e.features??[]),u=new Set(s.model.requiredFeatures??[]),h=s.model.dtype;(s.model.runtime!=="transf\
ormers.js"||(typeof h=="string"?[h]:Object.values(h??{})).some(d=>["fp16","q4f16"].includes(d)))&&u.add("shader-f16");for(const d of u)
if(!l.has(d))return a("unavailable","gpu_feature_unavailable",d==="shader-f16"?"Required FP16 GPU math (shader-f16) is u\
navailable in this browser":`Required GPU feature ${d} is unavailable in this browser`);return s.descriptorOnly?a("unkno\
wn","model_metadata_unverified","Model metadata and RAM/GPU memory fit require verification before loading"):a("unknown",
"memory_fit_unverified","Required features are supported; RAM/GPU memory fit is unverified")}const Ds=Uint32Array.from([
1732584193,4023233417,2562383102,271733878,3285377520]),Nr=new Uint32Array(80);class uM extends _d{A=Ds[0]|0;B=Ds[1]|0;C=Ds[2]|
0;D=Ds[3]|0;E=Ds[4]|0;constructor(){super(64,20,8,!1)}get(){const{A:e,B:t,C:n,D:s,E:i}=this;return[e,t,n,s,i]}set(e,t,n,s,i){
this.A=e|0,this.B=t|0,this.C=n|0,this.D=s|0,this.E=i|0}process(e,t){for(let c=0;c<16;c++,t+=4)Nr[c]=e.getUint32(t,!1);for(let c=16;c<
80;c++)Nr[c]=al(Nr[c-3]^Nr[c-8]^Nr[c-14]^Nr[c-16],1);let{A:n,B:s,C:i,D:o,E:a}=this;for(let c=0;c<80;c++){let l,u;c<20?(l=
Cy(s,i,o),u=1518500249):c<40?(l=s^i^o,u=1859775393):c<60?(l=Ty(s,i,o),u=2400959708):(l=s^i^o,u=3395469782);const h=al(n,
5)+l+a+u+Nr[c]|0;a=o,o=i,i=al(s,30),s=n,n=h}n=n+this.A|0,s=s+this.B|0,i=i+this.C|0,o=o+this.D|0,a=a+this.E|0,this.set(n,
s,i,o,a)}roundClean(){gn(Nr)}destroy(){this.set(0,0,0,0,0),gn(this.buffer)}}const dM=Ad(()=>new uM);function hM(){let r=Promise.
resolve();return{run(e,{signal:t}={}){const n=r.catch(()=>{}).then(()=>(t?.throwIfAborted(),e()));return r=n,n},settled:()=>r.
catch(()=>{})}}function By(r){if(r?.code==="ERR_MODEL_STORAGE_FULL"||r?.name!=="QuotaExceededError")return r;const e=new Error(
"The browser refused additional storage. Delete an unused stored model or free device storage, then retry the import.",{
cause:r});return e.name="QuotaExceededError",e.code="ERR_MODEL_STORAGE_FULL",e}async function Bp(r,e,t,{signal:n,onProgress:s,
fetchImpl:i=fetch}={}){try{return await r.withRetention(async o=>{const a=[];for(let c=0;c<e.files.length;c+=1){n?.throwIfAborted();
const l=e.files[c],u=()=>globalThis.performance?.now()??Date.now();let h=0,d=u();const p=()=>s?.({stage:"import",path:l.
path,index:c,total:e.files.length,loaded:h,totalBytes:l.size});p();let m=l.cid?await o.stat(l.cid,{signal:n}):null;if(!m||
m.status!=="complete"||m.size!==l.size||m.sha256!==l.sha256){const y=await i(t(l.path),{signal:n});if(!y.ok||!y.body)throw new Error(
`Artifact source failed: ${l.path} (${y.status})`);const b=l.gitBlobSha1?dM.create().update(new TextEncoder().encode(`bl\
ob ${l.size}\0`)):null;async function*f(){for await(const g of y.body){n?.throwIfAborted(),b?.update(g),h+=g.byteLength,
yield g;const w=u();h<l.size&&w-d>=100&&(d=w,p())}if(b&&LT(b.digest())!==l.gitBlobSha1)throw new Error(`Source Git blob \
SHA-1 mismatch: ${l.path}`)}m=await o.importFile(f(),{expectedSize:l.size,...l.sha256?{expectedSha256:l.sha256}:{},signal:n,
pin:!1})}if(l.cid&&m.cid!==l.cid)throw new Error(`Imported CID differs: ${l.path}`);n?.throwIfAborted(),h=l.size,p(),a.push(
{path:l.path,cid:m.cid,size:m.size,sha256:m.sha256})}return n?.throwIfAborted(),s?.({stage:"verify",total:e.files.length,
totalBytes:a.reduce((c,l)=>c+l.size,0)}),n?.throwIfAborted(),o.importManifest({...e,files:a},{pin:!0,signal:n})},{signal:n})}catch(o){
throw By(o)}}async function fM(r,{signal:e}={}){const t=[];for await(const n of r.list({signal:e}))e?.throwIfAborted(),n.
kind==="manifest"&&["complete","deleting"].includes(n.status)&&n.manifest?.model?.runtime&&t.push(n);return t}async function pM(r,e,{
signal:t}={}){const n=r.store,s=r.networkManager?.getArtifactTransport?.();if(!n.persistent||s?.store===n&&s.releaseOwnership)
return e();if(!n.lockManager?.request){if(n.backend?.hasExclusiveLock)return e();throw new Error("Stored model deletion \
requires exclusive network ownership for this store")}return n.lockManager.request(`${n.lockName}:network-owner`,{mode:"\
exclusive",ifAvailable:!0},async i=>{if(!i)throw new Error("Another tab owns file sharing for this library. Delete the m\
odel from that tab, or close that tab and retry.");return t?.throwIfAborted(),e()})}const ll="qwen3.5-0.8b-abliterated-q\
4-k-m-gguf";function Ly({storeName:r="inference-models",storage:e,locks:t=globalThis.navigator?.locks}={}){const n=`peer\
compute:model-console:last-loaded:v1:${encodeURIComponent(String(r))}`;if(e===void 0)try{e=globalThis.localStorage}catch{
e=null}function s(u){if(u?.version!==1||typeof u.manifestCid!="string"||u.manifestCid.length>128||typeof u.modelId!="str\
ing"||!u.modelId||u.modelId.length>256||u.selectionId!==void 0&&!/^[a-f0-9-]{36}$/.test(u.selectionId))return null;try{return{
version:1,manifestCid:ye(u.manifestCid).toString(),modelId:u.modelId,...u.selectionId?{selectionId:u.selectionId}:{}}}catch{
return null}}let i=null,o=!1;const a=()=>i?{...i}:null;function c(u=!1){if(o&&!u)return a();try{if(!e?.getItem)return a();
const h=e.getItem(n);try{i=typeof h=="string"&&h.length<=1024?s(JSON.parse(h)):null}catch{i=null}o=!1}catch{}return a()}
async function l(u,h){if(!t?.request)return u(!0);try{return await t.request(`${n}:write`,{mode:"exclusive",signal:h?AbortSignal.
any([h,AbortSignal.timeout(1e3)]):AbortSignal.timeout(1e3)},()=>u(!0))}catch{return u(!1)}}return c(),{readLastLoaded:c,
rememberLoaded(u,{signal:h}={}){const d=s({...u,version:1,selectionId:crypto.randomUUID()});if(!d)throw new TypeError("A\
 stored model preference requires a valid CID and model ID");return l(p=>{if(h?.aborted)return c();if(i=d,o=!p,p)try{e?.
setItem(n,JSON.stringify(d))}catch{o=!0}return a()},h)},clearLastLoaded(u=a()){const h=s(u);return l(d=>{const p=c(!0);if(!h||
!p||p.manifestCid!==h.manifestCid||p.modelId!==h.modelId||p.selectionId!==h.selectionId)return p;if(i=null,o=!d,d)try{e?.
removeItem(n)}catch{o=!0}return null})}}}const mM="https://secretworkshop.net/peercompute/config/relay-config.json";async function Lp(r,{
fetchImpl:e,signal:t,maximumBytes:n}){const s=await e(r,{cache:"no-store",signal:t});if(!s.ok||!s.body)throw new Error(`\
Relay configuration unavailable (${s.status})`);const i=[];let o=0;for await(const l of s.body){if(o+=l.byteLength,o>n)throw new Error(
"Relay configuration exceeds its byte limit");i.push(l)}const a=new Uint8Array(o);let c=0;for(const l of i)a.set(l,c),c+=
l.byteLength;return JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(a))}async function gM({fetchImpl:r=globalThis.
fetch,signal:e,baseUrl:t=globalThis.location?.href}={}){const n=AbortSignal.timeout(2e4),s=e?AbortSignal.any([e,n]):n;let i;
try{i=await Lp(new URL("./relay-config-source.json",t).href,{fetchImpl:r,signal:s,maximumBytes:16*1024})}catch(l){if(s.aborted)
throw l}const o=new URL(i?.relayConfigUrl??mM);if(o.protocol!=="https:"||o.hostname!=="secretworkshop.net"||o.username||
o.password)throw new Error("Relay configuration must use the approved Secret Workshop HTTPS backend");const a=await Lp(o.
href,{fetchImpl:r,signal:s,maximumBytes:64*1024}),c=[...new Set((Array.isArray(a.bootstrapPeers)?a.bootstrapPeers:[]).filter(
l=>typeof l=="string"&&l.length<=2048&&l.startsWith("/")&&l.includes("/wss/")&&l.includes("/p2p/")))].slice(0,16);if(!c.
length)throw new Error("Production relay configuration contains no secure bootstrap peers");return{bootstrapPeers:c,transportManager:{
faultTolerance:"no-fatal"},...a.webrtc&&typeof a.webrtc=="object"?{webrtc:a.webrtc}:{},pubsubType:a.pubsubType==="gossip\
sub"?"gossipsub":"floodsub",...a.gossipsub&&typeof a.gossipsub=="object"?{gossipsub:a.gossipsub}:{}}}function Ur(r=0){return new Uint8Array(
r)}function ga(r=0){return new Uint8Array(r)}function bM(r){return r?.buffer instanceof ArrayBuffer}function yM(r){if(bM(
r))return r;const e=r.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Dp(r,e){e==null&&(e=r.reduce((s,i)=>s+
i.length,0));const t=ga(e);let n=0;for(const s of r)t.set(s,n),n+=s.length;return yM(t)}function wM(r,e){if(r===e)return!0;
if(r.byteLength!==e.byteLength)return!1;for(let t=0;t<r.byteLength;t++)if(r[t]!==e[t])return!1;return!0}const Dy=Symbol.
for("@achingbrain/uint8arraylist");function Pp(r,e){if(e==null||e<0)throw new RangeError("index is out of bounds");let t=0;
for(const n of r){const s=t+n.byteLength;if(e<s)return{buf:n,index:e-t};t=s}throw new RangeError("index is out of bounds")}
function no(r){return!!r?.[Dy]}class Xr{bufs;length;[Dy]=!0;constructor(...e){this.bufs=[],this.length=0,e.length>0&&this.
appendAll(e)}*[Symbol.iterator](){yield*this.bufs}get byteLength(){return this.length}append(...e){this.appendAll(e)}appendAll(e){
let t=0;for(const n of e)if(n instanceof Uint8Array)t+=n.byteLength,this.bufs.push(n);else if(no(n)){t+=n.byteLength;for(const s of n.
bufs)this.bufs.push(s)}else throw new Error("Could not append value, must be an Uint8Array or a Uint8ArrayList");this.length+=
t}prepend(...e){this.prependAll(e)}prependAll(e){let t=0;for(const n of e.reverse())if(n instanceof Uint8Array)t+=n.byteLength,
this.bufs.unshift(n);else if(no(n))t+=n.byteLength,this.bufs.unshift(...n.bufs);else throw new Error("Could not prepend \
value, must be an Uint8Array or a Uint8ArrayList");this.length+=t}get(e){const t=Pp(this.bufs,e);return t.buf[t.index]}set(e,t){
const n=Pp(this.bufs,e);n.buf[n.index]=t}write(e,t=0){if(e instanceof Uint8Array)for(let n=0;n<e.length;n++)this.set(t+n,
e[n]);else if(no(e))for(let n=0;n<e.length;n++)this.set(t+n,e.get(n));else throw new Error("Could not write value, must \
be an Uint8Array or a Uint8ArrayList")}consume(e){if(e=Math.trunc(e),!(Number.isNaN(e)||e<=0)){if(e===this.byteLength){this.
bufs=[],this.length=0;return}for(;this.bufs.length>0;)if(e>=this.bufs[0].byteLength)e-=this.bufs[0].byteLength,this.length-=
this.bufs[0].byteLength,this.bufs.shift();else{this.bufs[0]=this.bufs[0].subarray(e),this.length-=e;break}}}slice(e,t){const{
bufs:n,length:s}=this._subList(e,t);return Dp(n,s)}subarray(e,t){const{bufs:n,length:s}=this._subList(e,t);return n.length===
1?n[0]:Dp(n,s)}sublist(e,t){const{bufs:n,length:s}=this._subList(e,t),i=new Xr;return i.length=s,i.bufs=n,i}_subList(e,t){
if(e=e??0,t=t??this.length,e<0&&(e=this.length+e),t<0&&(t=this.length+t),e<0||t>this.length)throw new RangeError("index \
is out of bounds");if(e===t)return{bufs:[],length:0};if(e===0&&t===this.length)return{bufs:[...this.bufs],length:this.length};
const n=[];let s=0;for(let i=0;i<this.bufs.length;i++){const o=this.bufs[i],a=s,c=a+o.byteLength;if(s=c,e>=c)continue;const l=e>=
a&&e<c,u=t>a&&t<=c;if(l&&u){if(e===a&&t===c){n.push(o);break}const h=e-a;n.push(o.subarray(h,h+(t-e)));break}if(l){if(e===
0){n.push(o);continue}n.push(o.subarray(e-a));continue}if(u){if(t===c){n.push(o);break}n.push(o.subarray(0,t-a));break}n.
push(o)}return{bufs:n,length:t-e}}indexOf(e,t=0){if(!no(e)&&!(e instanceof Uint8Array))throw new TypeError('The "value" \
argument must be a Uint8ArrayList or Uint8Array');const n=e instanceof Uint8Array?e:e.subarray();if(t=Number(t??0),isNaN(
t)&&(t=0),t<0&&(t=this.length+t),t<0&&(t=0),e.length===0)return t>this.length?this.length:t;const s=n.byteLength;if(s===
0)throw new TypeError("search must be at least 1 byte long");const i=256,o=new Int32Array(i);for(let h=0;h<i;h++)o[h]=-1;
for(let h=0;h<s;h++)o[n[h]]=h;const a=o,c=this.byteLength-n.byteLength,l=n.byteLength-1;let u;for(let h=t;h<=c;h+=u){u=0;
for(let d=l;d>=0;d--){const p=this.get(h+d);if(n[d]!==p){u=Math.max(1,d-a[p]);break}}if(u===0)return h}return-1}getInt8(e){
const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).getInt8(0)}setInt8(e,t){const n=ga(
1);new DataView(n.buffer,n.byteOffset,n.byteLength).setInt8(0,t),this.write(n,e)}getInt16(e,t){const n=this.subarray(e,e+
2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getInt16(0,t)}setInt16(e,t,n){const s=Ur(2);new DataView(s.buffer,
s.byteOffset,s.byteLength).setInt16(0,t,n),this.write(s,e)}getInt32(e,t){const n=this.subarray(e,e+4);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getInt32(0,t)}setInt32(e,t,n){const s=Ur(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setInt32(0,t,n),this.write(s,e)}getBigInt64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getBigInt64(0,t)}setBigInt64(e,t,n){const s=Ur(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setBigInt64(
0,t,n),this.write(s,e)}getUint8(e){const t=this.subarray(e,e+1);return new DataView(t.buffer,t.byteOffset,t.byteLength).
getUint8(0)}setUint8(e,t){const n=ga(1);new DataView(n.buffer,n.byteOffset,n.byteLength).setUint8(0,t),this.write(n,e)}getUint16(e,t){
const n=this.subarray(e,e+2);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint16(0,t)}setUint16(e,t,n){const s=Ur(
2);new DataView(s.buffer,s.byteOffset,s.byteLength).setUint16(0,t,n),this.write(s,e)}getUint32(e,t){const n=this.subarray(
e,e+4);return new DataView(n.buffer,n.byteOffset,n.byteLength).getUint32(0,t)}setUint32(e,t,n){const s=Ur(4);new DataView(
s.buffer,s.byteOffset,s.byteLength).setUint32(0,t,n),this.write(s,e)}getBigUint64(e,t){const n=this.subarray(e,e+8);return new DataView(
n.buffer,n.byteOffset,n.byteLength).getBigUint64(0,t)}setBigUint64(e,t,n){const s=Ur(8);new DataView(s.buffer,s.byteOffset,
s.byteLength).setBigUint64(0,t,n),this.write(s,e)}getFloat32(e,t){const n=this.subarray(e,e+4);return new DataView(n.buffer,
n.byteOffset,n.byteLength).getFloat32(0,t)}setFloat32(e,t,n){const s=Ur(4);new DataView(s.buffer,s.byteOffset,s.byteLength).
setFloat32(0,t,n),this.write(s,e)}getFloat64(e,t){const n=this.subarray(e,e+8);return new DataView(n.buffer,n.byteOffset,
n.byteLength).getFloat64(0,t)}setFloat64(e,t,n){const s=Ur(8);new DataView(s.buffer,s.byteOffset,s.byteLength).setFloat64(
0,t,n),this.write(s,e)}equals(e){if(e==null||!(e instanceof Xr)||e.bufs.length!==this.bufs.length)return!1;for(let t=0;t<
this.bufs.length;t++)if(!wM(this.bufs[t],e.bufs[t]))return!1;return!0}static fromUint8Arrays(e,t){const n=new Xr;return n.
bufs=e,t==null&&(t=e.reduce((s,i)=>s+i.byteLength,0)),n.length=t,n}}class VB extends Error{static name="AbortError";constructor(e="\
The operation was aborted"){super(e),this.name="AbortError"}}class HB extends Error{static name="UnexpectedPeerError";constructor(e="\
Unexpected Peer"){super(e),this.name="UnexpectedPeerError"}}class KB extends Error{static name="InvalidCryptoExchangeErr\
or";constructor(e="Invalid crypto exchange"){super(e),this.name="InvalidCryptoExchangeError"}}class kM extends Error{static name="\
InvalidParametersError";constructor(e="Invalid parameters"){super(e),this.name="InvalidParametersError"}}class QB extends Error{static name="\
InvalidPublicKeyError";constructor(e="Invalid public key"){super(e),this.name="InvalidPublicKeyError"}}class JB extends Error{static name="\
InvalidPrivateKeyError";constructor(e="Invalid private key"){super(e),this.name="InvalidPrivateKeyError"}}class XB extends Error{static name="\
ConnectionClosedError";constructor(e="The connection is closed"){super(e),this.name="ConnectionClosedError"}}class YB extends Error{static name="\
ConnectionFailedError";constructor(e="Connection failed"){super(e),this.name="ConnectionFailedError"}}class ZB extends Error{static name="\
MuxerClosedError";constructor(e="The muxer is closed"){super(e),this.name="MuxerClosedError"}}class eL extends Error{static name="\
StreamResetError";constructor(e="The stream has been reset"){super(e),this.name="StreamResetError"}}class tL extends Error{static name="\
StreamStateError";constructor(e="The stream is in an invalid state"){super(e),this.name="StreamStateError"}}class EM extends Error{static name="\
StreamBufferError";constructor(e="The stream buffer was full"){super(e),this.name="StreamBufferError"}}class rL extends Error{static name="\
NotFoundError";constructor(e="Not found"){super(e),this.name="NotFoundError"}}class nL extends Error{static name="Invali\
dPeerIdError";constructor(e="Invalid PeerID"){super(e),this.name="InvalidPeerIdError"}}class sL extends Error{static name="\
InvalidMultiaddrError";constructor(e="Invalid multiaddr"){super(e),this.name="InvalidMultiaddrError"}}class iL extends Error{static name="\
InvalidCIDError";constructor(e="Invalid CID"){super(e),this.name="InvalidCIDError"}}class oL extends Error{static name="\
InvalidMultihashError";constructor(e="Invalid Multihash"){super(e),this.name="InvalidMultihashError"}}class aL extends Error{static name="\
UnsupportedProtocolError";constructor(e="Unsupported protocol error"){super(e),this.name="UnsupportedProtocolError"}}class cL extends Error{static name="\
InvalidMessageError";constructor(e="Invalid message"){super(e),this.name="InvalidMessageError"}}class lL extends Error{static name="\
ProtocolError";constructor(e="Protocol error"){super(e),this.name="ProtocolError"}}let uL=class extends Error{static name="\
TimeoutError";constructor(e="Timed out"){super(e),this.name="TimeoutError"}};class hL extends Error{static name="NotStar\
tedError";constructor(e="Not started"){super(e),this.name="NotStartedError"}}class fL extends Error{static name="DialErr\
or";constructor(e="Dial error"){super(e),this.name="DialError"}}class pL extends Error{static name="ListenError";constructor(e="\
Listen error"){super(e),this.name="ListenError"}}class mL extends Error{static name="LimitedConnectionError";constructor(e="\
Limited connection"){super(e),this.name="LimitedConnectionError"}}class gL extends Error{static name="TooManyInboundProt\
ocolStreamsError";constructor(e="Too many inbound protocol streams"){super(e),this.name="TooManyInboundProtocolStreamsEr\
ror"}}class bL extends Error{static name="TooManyOutboundProtocolStreamsError";constructor(e="Too many outbound protocol\
 streams"){super(e),this.name="TooManyOutboundProtocolStreamsError"}}class yL extends Error{static name="UnsupportedKeyT\
ypeError";constructor(e="Unsupported key type"){super(e),this.name="UnsupportedKeyTypeError"}}class Td extends Error{name="\
TimeoutError";constructor(e,t){super(e,t),Error.captureStackTrace?.(this,Td)}}const xM=r=>"reason"in r?r.reason:new DOMException(
"This operation was aborted.","AbortError"),vM=2**31-1,SM=(r,e)=>{if(typeof r!="number"||Math.sign(r)!==1)return new TypeError(
`Expected \`milliseconds\` to be a positive number, got \`${r}\``);if(typeof e?.setTimeout!="function"||typeof e?.clearTimeout!=
"function")return new TypeError("Expected `customTimers` to have a `setTimeout` and a `clearTimeout` function")};function AM(r,e){
const{milliseconds:t,fallback:n,message:s,customTimers:i={setTimeout,clearTimeout},signal:o}=e;let a,c;const l=()=>{try{
r.cancel?.()}catch{}},h=new Promise((d,p)=>{const m=()=>{p(xM(o)),l()},y=SM(t,i);try{y?p(y):o?.aborted?m():o&&(c=m,o.addEventListener(
"abort",c,{once:!0}))}finally{r.then(d,p)}if(y||o?.aborted||t>vM)return;const b=n||s===!1||s instanceof Error?void 0:new Td(
s??`Promise timed out after ${t} milliseconds`);a=i.setTimeout.call(void 0,()=>{if(n)try{d(n())}catch(f){p(f)}else s===!1?
d():p(s instanceof Error?s:b);l()},t)}).finally(()=>{try{h.clear()}catch{}try{c&&o.removeEventListener("abort",c)}catch{}});
return h.clear=()=>{a!==void 0&&(i.clearTimeout.call(void 0,a),a=void 0)},h}const Py=r=>typeof r=="function"?{filter:r}:
{...r},_M=r=>r===1/0||Number.isSafeInteger(r)&&r>=0,IM=[["addEventListener","removeEventListener"],["on","off"],["addLis\
tener","removeListener"]],CM=r=>{for(const[e,t]of IM){const n=r?.[e],s=r?.[t];if(typeof n=="function"&&typeof s=="functi\
on")return{addListener:n.bind(r),removeListener:s.bind(r)}}throw new TypeError("Emitter is not compatible")},TM=r=>{const e=new Map;
for(const[t,n]of r)for(const s of Array.isArray(t)?t:[t])e.has(s)||e.set(s,n);return e},MM=({addListener:r,removeListener:e,
handlers:t,signal:n,abortHandler:s,isDone:i})=>{n?.addEventListener("abort",s,{once:!0});for(const[o,a]of t)if(r(o,a),i()){
e(o,a);return}},RM=({removeListener:r,handlers:e,signal:t,abortHandler:n})=>{for(const[s,i]of e)r(s,i);t?.removeEventListener(
"abort",n)},BM=(r,e,t)=>{let n=Promise.resolve();return(s,i)=>{n=n.then(async()=>{if(e())return;let o;try{o=r?await r(s):
!0}catch(a){e()||t(a);return}e()||i(o)})}};function LM(r,e,t){let n=()=>{},s=!1,i;const o=new Promise((a,c)=>{t=Py(t);const{
filter:l}=t;if(!_M(t.count))throw new TypeError("The `count` option should be at least 0 or more");if(typeof t.timeout==
"number"&&!(t.timeout>0))throw new TypeError(`Expected the \`timeout\` option to be a positive number, got \`${t.timeout}\
\``);t.signal?.throwIfAborted();const{addListener:u,removeListener:h}=CM(r);if(t.count===0){a([]);return}const d=[],p=k=>{
n(),c(k)},m=BM(l,()=>s,p),y=k=>{d.push(k),t.count===d.length&&(n(),a(d))},b=(...k)=>{if(s)return;const x=t.multiArgs?k:k[0];
if(!l){y(x);return}m(x,A=>{A&&y(x)})},f=(...k)=>{p(t.rejectionMultiArgs?k:k[0])},g=()=>{p(t.signal.reason)},w={addListener:u,
removeListener:h,handlers:TM([[e,b],[t.rejectionEvents??["error"],f]]),signal:t.signal,abortHandler:g,isDone:()=>s};n=()=>{
s=!0,clearTimeout(i),RM(w)},MM(w),!(s||!t.resolveImmediately)&&(Number.isFinite(t.timeout)&&t.timeout<=2**31-1&&(i=setTimeout(
n,t.timeout)),a(d))});if(o.cancel=n,typeof t.timeout=="number"&&t.timeout>0&&!t.resolveImmediately){const a=AM(o,{milliseconds:t.
timeout});return a.cancel=()=>{n(),a.clear()},a}return o}function $y(r,e,t){const n=LM(r,e,{...Py(t),count:1,resolveImmediately:!1}),
s=n.then(i=>i[0]);return s.cancel=n.cancel,s}class wL extends Error{remainingPoints;msBeforeNext;consumedPoints;isFirstInDuration;constructor(e="\
Rate limit exceeded",t){super(e),this.name="RateLimitError",this.remainingPoints=t.remainingPoints,this.msBeforeNext=t.msBeforeNext,
this.consumedPoints=t.consumedPoints,this.isFirstInDuration=t.isFirstInDuration}}class kL extends Error{static name="Que\
ueFullError";constructor(e="The queue was full"){super(e),this.name="QueueFullError"}}class ba extends Error{static name="\
UnexpectedEOFError";name="UnexpectedEOFError"}class EL extends Error{static name="MaxEarlyStreamsError";name="MaxEarlySt\
reamsError"}class xL extends Error{static name="StreamClosedError";name="StreamClosedError"}const DM=Math.pow(2,7),PM=Math.
pow(2,14),$M=Math.pow(2,21),Md=Math.pow(2,28),Rd=Math.pow(2,35),Bd=Math.pow(2,42),Ld=Math.pow(2,49),ce=128,tt=127;function Za(r){
if(r<DM)return 1;if(r<PM)return 2;if(r<$M)return 3;if(r<Md)return 4;if(r<Rd)return 5;if(r<Bd)return 6;if(r<Ld)return 7;if(Number.
MAX_SAFE_INTEGER!=null&&r>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function NM(r,e,t=0){
switch(Za(r)){case 8:e[t++]=r&255|ce,r/=128;case 7:e[t++]=r&255|ce,r/=128;case 6:e[t++]=r&255|ce,r/=128;case 5:e[t++]=r&
255|ce,r/=128;case 4:e[t++]=r&255|ce,r>>>=7;case 3:e[t++]=r&255|ce,r>>>=7;case 2:e[t++]=r&255|ce,r>>>=7;case 1:{e[t++]=r&
255,r>>>=7;break}default:throw new Error("unreachable")}return e}function UM(r,e,t=0){switch(Za(r)){case 8:e.set(t++,r&255|
ce),r/=128;case 7:e.set(t++,r&255|ce),r/=128;case 6:e.set(t++,r&255|ce),r/=128;case 5:e.set(t++,r&255|ce),r/=128;case 4:
e.set(t++,r&255|ce),r>>>=7;case 3:e.set(t++,r&255|ce),r>>>=7;case 2:e.set(t++,r&255|ce),r>>>=7;case 1:{e.set(t++,r&255),
r>>>=7;break}default:throw new Error("unreachable")}return e}function FM(r,e){let t=r[e],n=0;if(n+=t&tt,t<ce||(t=r[e+1],
n+=(t&tt)<<7,t<ce)||(t=r[e+2],n+=(t&tt)<<14,t<ce)||(t=r[e+3],n+=(t&tt)<<21,t<ce)||(t=r[e+4],n+=(t&tt)*Md,t<ce)||(t=r[e+5],
n+=(t&tt)*Rd,t<ce)||(t=r[e+6],n+=(t&tt)*Bd,t<ce)||(t=r[e+7],n+=(t&tt)*Ld,t<ce))return n;throw new RangeError("Could not \
decode varint")}function OM(r,e){let t=r.get(e),n=0;if(n+=t&tt,t<ce||(t=r.get(e+1),n+=(t&tt)<<7,t<ce)||(t=r.get(e+2),n+=
(t&tt)<<14,t<ce)||(t=r.get(e+3),n+=(t&tt)<<21,t<ce)||(t=r.get(e+4),n+=(t&tt)*Md,t<ce)||(t=r.get(e+5),n+=(t&tt)*Rd,t<ce)||
(t=r.get(e+6),n+=(t&tt)*Bd,t<ce)||(t=r.get(e+7),n+=(t&tt)*Ld,t<ce))return n;throw new RangeError("Could not decode varin\
t")}function zM(r,e,t=0){return e==null&&(e=ga(Za(r))),e instanceof Uint8Array?NM(r,e,t):UM(r,e,t)}function qM(r,e=0){return r instanceof
Uint8Array?FM(r,e):OM(r,e)}const jM=4194304;class $p extends Error{static name="UnwrappedError";name="UnwrappedError"}class GM extends Error{name="\
InvalidMessageLengthError";code="ERR_INVALID_MSG_LENGTH"}class WM extends Error{name="InvalidDataLengthError";code="ERR_\
MSG_DATA_TOO_LONG"}class VM extends Error{name="InvalidDataLengthLengthError";code="ERR_MSG_LENGTH_TOO_LONG"}function HM(r){
return typeof r?.closeRead=="function"}function KM(r){return typeof r?.close=="function"}function ul(r){return HM(r)?r.remoteWriteStatus!==
"writable"&&r.readBufferLength===0:KM(r)?r.status!=="open":!1}function QM(r){return r?.addEventListener!=null&&r?.removeEventListener!=
null&&r?.send!=null&&r?.push!=null&&r?.log!=null}function JM(r,e){const t=e?.maxBufferSize??jM,n=new Xr;let s,i=!1,o;if(!QM(
r))throw new kM("Argument should be a Stream or a Multiaddr");const a=h=>{if(!i&&o==null){if(n.append(h.data),n.byteLength>
t){const d=n.byteLength;n.consume(d);const p=new EM(`Read buffer overflow - ${d} > ${t}`);o=p,s?.reject(p),queueMicrotask(
()=>{r.abort(p)});return}s?.resolve()}};r.addEventListener("message",a);const c=h=>{h.error!=null?s?.reject(h.error):s?.
resolve()};r.addEventListener("close",c);const l=()=>{s?.resolve()};r.addEventListener("remoteCloseWrite",l);const u={readBuffer:n,
async read(h){if(i===!0)throw new $p("Stream was unwrapped");if(o!=null)throw o;if(ul(r)){if(n.byteLength===0&&h?.bytes==
null)return null;if(h?.bytes!=null&&n.byteLength<h.bytes)throw r.log.error("closed after reading %d/%d bytes",n.byteLength,
h.bytes),new ba(`Unexpected EOF - stream closed after reading ${n.byteLength}/${h.bytes} bytes`)}const d=h?.bytes??1;for(s=
Promise.withResolvers();;){if(n.byteLength>=d){s.resolve();break}if(await Hb(s.promise,h?.signal),ul(r)){if(n.byteLength===
0&&h?.bytes==null)return null;break}s=Promise.withResolvers()}const p=h?.bytes??n.byteLength;if(n.byteLength<p){if(ul(r))
throw r.log.error("closed while reading %d/%d bytes",n.byteLength,p),new ba(`Unexpected EOF - stream closed while readin\
g ${n.byteLength}/${p} bytes`);return u.read(h)}const m=n.sublist(0,p);return n.consume(p),m},async write(h,d){if(i===!0)
throw new $p("Stream was unwrapped");r.send(h)||await $y(r,"drain",{signal:d?.signal,rejectionEvents:["close"]})},unwrap(){
return i||(i=!0,r.removeEventListener("message",a),r.removeEventListener("close",c),r.removeEventListener("remoteCloseWr\
ite",l),n.byteLength>0&&(r.log("stream unwrapped with %d unread bytes",n.byteLength),r.unshift(n),n.consume(n.byteLength))),
r}};return u}function Ny(r,e={}){const t=JM(r,e);e.maxDataLength!=null&&e.maxLengthLength==null&&(e.maxLengthLength=Za(e.
maxDataLength));const n=e?.lengthDecoder??qM,s=e?.lengthEncoder??zM;return{async read(o){let a=-1;const c=new Xr;for(;;){
const u=await t.read({...o,bytes:1});if(u==null)break;c.append(u);try{a=n(c)}catch(h){if(h instanceof RangeError)continue;
throw h}if(a<0)throw new GM("Invalid message length");if(e?.maxLengthLength!=null&&c.byteLength>e.maxLengthLength)throw new VM(
`Message length length too long - ${c.byteLength} > ${e.maxLengthLength}`);if(a>-1)break}if(e?.maxDataLength!=null&&a>e.
maxDataLength)throw new WM(`Message length too long - ${a} > ${e.maxDataLength}`);const l=await t.read({...o,bytes:a});if(l==
null)throw r.log.error("tried to read %d bytes but the stream closed",a),new ba(`Unexpected EOF - tried to read ${a} byt\
es but the stream closed`);if(l.byteLength!==a)throw r.log.error("read %d/%d bytes before the stream closed",l.byteLength,
a),new ba(`Unexpected EOF - read ${l.byteLength}/${a} bytes before the stream closed`);return l},async write(o,a){await t.
write(new Xr(s(o.byteLength),o),a)},async writeV(o,a){const c=new Xr(...o.flatMap(l=>[s(l.byteLength),l]));await t.write(
c,a)},unwrap(){return t.unwrap()}}}function vL(r,e){const t=Ny(r,e),n={read:async(s,i)=>{const o=await t.read(i);return s.
decode(o,i)},write:async(s,i,o)=>{await t.write(i.encode(s),o)},writeV:async(s,i,o)=>{await t.writeV(s.map(a=>i.encode(a)),
o)},pb:s=>({read:async i=>n.read(s,i),write:async(i,o)=>n.write(i,s,o),writeV:async(i,o)=>n.writeV(i,s,o),unwrap:()=>n}),
unwrap:()=>t.unwrap()};return n}function XM(r){return r?.addEventListener!=null}function YM(r){const e=Vb();let t;const n=o=>{
e.push(o.data)},s=()=>{e.end(),r.removeEventListener("message",n),r.removeEventListener("close",i),r.removeEventListener(
"remoteCloseWrite",s)},i=o=>{e.end(o.error),o.error!=null&&t?.reject(o.error),r.removeEventListener("message",n),r.removeEventListener(
"close",i),r.removeEventListener("remoteCloseWrite",s)};return r.addEventListener("message",n),r.addEventListener("close",
i,{once:!0}),r.addEventListener("remoteCloseWrite",s,{once:!0}),{source:e,async sink(o){async function*a(){yield*o}const c=a();
for(;;){t=Promise.withResolvers();const{done:l,value:u}=await Promise.race([c.next(),t.promise]);if(r.writeStatus==="clo\
sing"||r.writeStatus==="closed"||(u!=null&&(r.send(u)||await Promise.race([$y(r,"drain",{rejectionEvents:["close"]})])),
l===!0))break}await r.close()}}}function SL(...r){const e=r.map(t=>XM(t)?YM(t):t);return Kb(...e)}const ZM="peercompute.\
model-artifact-read.v1",Dd=ZM;function Uy(r,e){const t=n=>e(n.data);return r.addEventListener("message",t),r.start?.(),()=>r.
removeEventListener("message",t)}function yt(r,e,t=[]){r.postMessage({protocol:Dd,...e},t)}function AL(r,{store:e,manifest:t,
chunkBytes:n=le.chunkBytes,maxReads:s=le.maxReads}={}){if(!e?.stat||!e?.openRead)throw new Error("A verified artifact st\
ore is required");if(!Number.isInteger(n)||n<1||n>le.chunkBytes||!Number.isInteger(s)||s<1||s>le.maxReads)throw new Error(
"Invalid artifact bridge bounds");const i=new Map(t.files.map(d=>[ma(d.path),d])),o=new Map;let a=!1,c=0;async function l(d,p){
const m=o.get(d);if(m){o.delete(d),m.controller.abort(p);try{await m.iterator?.return?.()}catch{}}}async function u(d){if(a||
d?.protocol!==Dd||typeof d.id!="string"||d.id.length>128)return;const{id:p}=d;try{if(d.type==="cancel"){await l(p,"Reade\
r cancelled");return}if(d.type==="open"){if(o.has(p))throw new Error("Duplicate artifact reader");if(o.size>=s)throw new Error(
"Artifact reader limit reached");const g=i.get(d.path);if(!g)throw new Error("Artifact path is not in the manifest");const w=d.
offset??0,k=d.length??g.size-w;if(!Number.isSafeInteger(w)||!Number.isSafeInteger(k)||w<0||k<0||w>g.size||k>g.size-w)throw new Error(
"Invalid artifact byte range");const x={controller:new AbortController,remaining:k,pulling:!1};o.set(p,x);const A=await e.
stat(g.cid);if(Ye(x.controller.signal),a||o.get(p)!==x)return;if(!A||A.status!=="complete"||A.size!==g.size||A.sha256!==
g.sha256)throw new Error("Model artifact is incomplete or has a different size");const v=await e.openRead(g.cid,{offset:w,
length:k,signal:x.controller.signal});if(x.iterator=v[Symbol.asyncIterator](),a||x.controller.signal.aborted||o.get(p)!==
x){await x.iterator.return?.();return}yt(r,{type:"ready",id:p,size:k});return}if(d.type!=="pull")return;const m=o.get(p);
if(!m?.iterator||m.pulling)throw new Error("Invalid artifact pull credit");m.pulling=!0;const y=await m.iterator.next();
if(a||m.controller.signal.aborted||o.get(p)!==m)return;if(y.done){if(m.remaining!==0)throw new Error("Truncated model ar\
tifact");o.delete(p),yt(r,{type:"end",id:p});return}const b=y.value;if(!(b instanceof Uint8Array)||!b.byteLength||b.byteLength>
n||b.byteLength>m.remaining)throw new Error("Artifact chunk exceeds admitted bounds");m.remaining-=b.byteLength,m.pulling=
!1,c+=b.byteLength;const f=b.slice();yt(r,{type:"chunk",id:p,bytes:f},[f.buffer])}catch(m){await l(p,m),a||yt(r,{type:"e\
rror",id:p,message:m?.message||"Artifact read failed"})}}const h=Uy(r,d=>{u(d)});return{getStats:()=>({activeReads:o.size,
deliveredBytes:c}),async close(){if(!a){a=!0;try{yt(r,{type:"closed",message:"Artifact bridge closed"})}catch{}h(),await Promise.
all([...o.keys()].map(d=>l(d,"Artifact bridge closed"))),r.close()}}}}function eR(r,{manifest:e,baseUrl:t,signal:n,chunkBytes:s=le.
chunkBytes,maxReads:i=le.maxReads,maxQueuedReads:o=32}={}){if(!Number.isInteger(i)||i<1||i>le.maxReads||!Number.isInteger(
o)||o<0||o>32)throw new RangeError("Invalid artifact reader limits");const a=new URL(t),c=new Map(e.files.map(f=>[ma(f.path),
f])),l=new Map,u=[];let h=0,d=!1;function p(){for(;!d&&l.size<i&&u.length;){const f=u.shift();l.set(f.id,f),f.active=!0,
yt(r,{type:"open",id:f.id,path:f.path})}}function m(f,g){l.delete(f.id);const w=u.indexOf(f);if(w>=0&&u.splice(w,1),n?.removeEventListener(
"abort",f.abort),f.requestSignal?.removeEventListener("abort",f.abort),g){f.reject?.(g);try{f.streamController?.error(g)}catch{}}
f.resolvePull?.(),p()}const y=Uy(r,f=>{if(f?.protocol!==Dd)return;const g=l.get(f.id);if(g){if(f.type==="error"){m(g,new Error(
f.message));return}if(f.type==="ready"){if(g.ready||f.size!==g.file.size){m(g,new Error("Invalid artifact response size")),
yt(r,{type:"cancel",id:g.id});return}g.ready=!0,yt(r,{type:"pull",id:g.id})}else if(f.type==="chunk"){if(!g.ready||!g.resolvePull||
!(f.bytes instanceof Uint8Array)||!f.bytes.byteLength||f.bytes.byteLength>s||g.received+f.bytes.byteLength>g.file.size){
yt(r,{type:"cancel",id:g.id}),m(g,new Error("Invalid artifact chunk"));return}g.received+=f.bytes.byteLength,g.streamController.
enqueue(f.bytes);const w=g.resolvePull;g.resolvePull=null,w()}else f.type==="end"&&(!g.ready||g.received!==g.file.size?m(
g,new Error("Truncated artifact response")):(g.streamController.close(),m(g)))}});async function b(f,g={}){if(d)throw new Error(
"Artifact bridge is closed");if(Ye(n),Ye(g.signal),g.method&&g.method!=="GET")throw new Error("Model adapter supports GE\
T only");const w=String(f);if(/[\\]/.test(w)||/%(?:2e|2f|5c|00)/i.test(w)||/\/(?:\.|\.\.)(?:\/|$)/.test(w))throw new Error(
"Invalid artifact URL");const k=new URL(w,a);if(k.origin!==a.origin||k.username||k.password||k.search||k.hash||!k.pathname.
startsWith(a.pathname))throw new Error("Model path is outside its manifest");const x=ma(decodeURIComponent(k.pathname.slice(
a.pathname.length))),A=c.get(x);if(!A)return new Response("Artifact path is not in the manifest",{status:404});const v=`\
read-${++h}`,E={id:v,path:x,file:A,requestSignal:g.signal,received:0,ready:!1,active:!1,queued:!1};E.abort=()=>{E.active&&
yt(r,{type:"cancel",id:v}),m(E,fu(n?.reason??g.signal?.reason))};const C=new ReadableStream({start(I){E.streamController=
I},pull(){if(d)throw new Error("Artifact bridge is closed");if(Ye(n),Ye(g.signal),!E.active&&!E.queued&&l.size>=i&&u.length>=
o)throw new Error("Artifact reader limit reached");return new Promise(I=>{E.resolvePull=I,E.ready?yt(r,{type:"pull",id:v}):
E.queued||(E.queued=!0,n?.addEventListener("abort",E.abort,{once:!0}),g.signal?.addEventListener("abort",E.abort,{once:!0}),
u.push(E),p())})},cancel(){E.active&&yt(r,{type:"cancel",id:v}),m(E)}},{highWaterMark:0});return new Response(C,{headers:{
"Content-Length":String(A.size),"Content-Type":A.mediaType||"application/octet-stream"}})}return{fetch:b,close(f="Artifa\
ct bridge closed"){if(!d){d=!0;for(const g of[...l.values(),...u])g.active&&yt(r,{type:"cancel",id:g.id}),m(g,fu(f));y(),
r.close()}}}}const vo=r=>new TextEncoder().encode(r).byteLength;function tR(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function ec(r){if(r==null)return null;
if(!Number.isSafeInteger(r.width)||!Number.isSafeInteger(r.height)||r.width<1||r.height<1||r.width*r.height>le.maxImagePixels||
r.channels!==4||!(r.data instanceof Uint8Array||r.data instanceof Uint8ClampedArray)||r.data.byteLength!==r.width*r.height*
4||r.data.byteLength>le.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded fi\
les are not accepted");return r}function Pd(r){const e=r.messages??(typeof r.prompt=="string"?[{role:"user",content:r.prompt}]:
null);if(!Array.isArray(e)||!e.length||e.length>le.maxMessages)throw new Error("Invalid inference messages");let t=0;return e.
map(n=>{if(!n||!["system","user","assistant"].includes(n.role)||typeof n.content!="string")throw new Error("Only text me\
ssage content is accepted");if(t+=vo(n.content),t>le.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{
role:n.role,content:n.content}})}async function gu(r){if(!r)return;let e;const t=new Set;for(const n of[r.model,r.processor,
r.tokenizer])if(!(!n||t.has(n))){t.add(n);try{await n.dispose?.()}catch(s){e??=s}}if(e)throw e}function So(r,e=new Set){
if(!(!r||typeof r!="object"||e.has(r))){if(e.add(r),typeof r.dispose=="function"){r.dispose();return}for(const t of Object.
values(r))So(t,e)}}function rR(r){const e=r.findIndex(n=>n.role==="user");if(e<0)return null;const t=r.findIndex((n,s)=>s>
e&&n.role==="user");return t<0?null:r.filter((n,s)=>s<e||s>=t||n.role==="system")}function nR(r,e,t){const n={...r.config};
for(const a of["decoder","generator","text_config"])Object.assign(n,n[a]);Object.assign(n,r.generation_config);const s=Array.
isArray(n.eos_token_id)?n.eos_token_id:[n.eos_token_id],i=e.at(-1),o=a=>typeof a=="bigint"||Number.isSafeInteger(a)&&a>=
0;return o(i)&&s.some(a=>o(a)&&BigInt(a)===BigInt(i))?"stop":e.length>=t?"length":"unknown"}async function sR({library:r,
modelPath:e,options:t,manifest:n}){const s={};try{const i=await r.AutoConfig.from_pretrained(e,t);if(i.model_type!==n.model.
architecture)throw new Error("Model config architecture does not match its admitted manifest");const o={...t,config:i};if(n.
model.architecture==="qwen3_5"&&(o.use_external_data_format=1),n.model.task==="image-text-to-text"){if(s.processor=await r.
AutoProcessor.from_pretrained(e,t),n.model.architecture==="qwen3_5"){const a=s.processor.image_processor;if(!a)throw new Error(
"Qwen3.5 image processor is unavailable");a.min_pixels=256*256,a.max_pixels=Ya(n.model).maxProcessedImagePixels,a.do_normalize??=
!0}s.tokenizer=s.processor.tokenizer,s.model=await r.AutoModelForImageTextToText.from_pretrained(e,o)}else s.tokenizer=await r.
AutoTokenizer.from_pretrained(e,t),s.model=await r.AutoModelForCausalLM.from_pretrained(e,o);return s}catch(i){throw await gu(
s),i}}function Np(r){return{sessionId:r.sessionId,manifestCid:r.manifestCid,status:r.lost?"lost":r.status,task:r.manifest.
model.task,dtype:r.manifest.model.dtype,workerId:r.workerId,adapter:r.adapter,runtimeAdapter:r.runtimeAdapter??null,gpuDispatches:r.
gpuDispatches??0,gpuSubmissions:r.gpuSubmissions??0,gpuProfileSamples:r.gpuProfileSamples??0,collectGpuEvidence:r.collectGpuEvidence===
!0,runtimeFeatures:r.runtimeFeatures??[],generatedRequests:r.generatedRequests}}function Fy({loadLibrary:r=()=>Et(()=>import("./transformers.web-DGNMtDcj.js"),
[],import.meta.url),loadModel:e=sR,gpu:t=globalThis.navigator?.gpu,baseUrl:n=globalThis.location?.href,assertWorker:s=tR}={}){
const i=new Map;let o;async function a(l,u){if(i.size)throw new Error("This inference worker already has a resident/load\
ing model");const h=qs(l.sessionId),{manifest:d}=tM(l.manifest),p=rM(l.runtimeAssets,n);if(!l.artifactPort?.postMessage)
throw new Error("An artifact reader port is required");Ye(u.signal);const m={sessionId:h,manifest:d,manifestCid:l.manifestCid,
status:"loading",workerId:u.workerId??null,generatedRequests:0,components:null};i.set(h,m);let y;try{const b=await t?.requestAdapter(
{powerPreference:"high-performance"});if(Ye(u.signal),!b||b.info?.isFallbackAdapter||b.isFallbackAdapter)throw new Error(
"A hardware WebGPU adapter is required; CPU/software fallback is disabled");const f=typeof d.model.dtype=="string"?[d.model.
dtype]:Object.values(d.model.dtype),g=new Set(d.model.requiredFeatures??[]);f.some(C=>["fp16","q4f16"].includes(C))&&g.add(
"shader-f16");for(const C of g)if(!b.features.has(C))throw new Error(`Model requires unsupported GPU feature: ${C}`);m.adapter=
{vendor:b.info?.vendor??"",architecture:b.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[...g]};const w=await(o??=
r());if(Ye(u.signal),w.env.version!==Id)throw new Error("Unexpected Transformers runtime version");const k=new URL("/__p\
eercompute_models/",n);y=eR(l.artifactPort,{manifest:d,baseUrl:new URL(`${h}/`,k).href,signal:u.signal});const{env:x}=w;
x.logLevel=50,x.allowLocalModels=!0,x.allowRemoteModels=!1,x.localModelPath=k.pathname,x.useBrowserCache=!1,x.useFSCache=
!1,x.useWasmCache=!1,x.fetch=async(...C)=>{try{return await y.fetch(...C)}catch(I){throw u.emitProgress?.({type:"artifac\
t-read-error",sessionId:h,message:I.message}),I}},x.backends.onnx.wasm.proxy=!1,x.backends.onnx.wasm.numThreads=1,x.backends.
onnx.wasm.wasmPaths=p,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=l.collectGpuEvidence===
!0,x.backends.onnx.webgpu&&(x.backends.onnx.webgpu.profiling={mode:l.collectGpuEvidence===!0?"default":"off",ondata:()=>{
m.gpuProfileSamples+=1}});const A={local_files_only:!0,device:"webgpu",dtype:d.model.dtype,session_options:{executionProviders:[
"webgpu"]},progress_callback:C=>{u.signal?.aborted||u.emitProgress?.({type:"model-load",sessionId:h,status:String(C.status??
"").slice(0,40),file:typeof C.file=="string"?C.file.slice(0,512):void 0,loaded:Number.isFinite(C.loaded)?C.loaded:void 0,
total:Number.isFinite(C.total)?C.total:void 0})}};m.library=w,m.components=await e({library:w,modelPath:h,options:A,manifest:d}),
Ye(u.signal);const v=await x.backends.onnx.webgpu?.device;if(m.runtimeDevice=v,m.runtimeFeatures=[...v?.features??[]],m.
collectGpuEvidence&&v){const C=v.createCommandEncoder.bind(v),I=v.queue.submit.bind(v.queue),M=Object.getOwnPropertyDescriptor(
v,"createCommandEncoder"),R=Object.getOwnPropertyDescriptor(v.queue,"submit");m.restoreGpuEvidence=()=>{M?Object.defineProperty(
v,"createCommandEncoder",M):delete v.createCommandEncoder,R?Object.defineProperty(v.queue,"submit",R):delete v.queue.submit,
m.restoreGpuEvidence=null},v.createCommandEncoder=(...$)=>{const P=C(...$),O=P.beginComputePass.bind(P);return P.beginComputePass=
(...Q)=>{const H=O(...Q);for(const V of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const fe=H[V].bind(H);H[V]=(...ee)=>{
const me=fe(...ee);return m.gpuDispatches+=1,me}}return H},P},v.queue.submit=(...$)=>{const P=I(...$);return m.gpuSubmissions+=
1,P}}const E=v?.adapterInfo??x.backends.onnx.webgpu?.adapter?.info;if(E){if(E.isFallbackAdapter)throw new Error("ORT sel\
ected a software GPU adapter");m.runtimeAdapter={vendor:E.vendor,architecture:E.architecture,isFallbackAdapter:E.isFallbackAdapter??
!1}}return v?.lost&&v.lost.then(()=>{i.get(h)===m&&(m.lost=!0,m.active?.abort("GPU device lost"))}),Ye(u.signal),m.status=
"ready",Np(m)}catch(b){try{await gu(m.components),m.restoreGpuEvidence?.(),i.delete(h)}catch(f){m.status="ready",m.lost=
!0;const g=new Error(`MODEL_DISPOSE_FAILED: ${f.message}`);throw g.code="MODEL_DISPOSE_FAILED",g}throw b}finally{y?.close(),
y||l.artifactPort.close()}}async function c(l,u){const h=i.get(qs(l.sessionId));if(!h||h.lost)throw new Error("Model ses\
sion lost or not loaded");if(h.status!=="ready")throw new Error("Model session is busy");const d=qs(l.requestId),p=l.maxNewTokens??
le.maxNewTokens;if(!Number.isInteger(p)||p<1||p>le.maxNewTokens)throw new Error("Generation exceeds its output-token bud\
get");let m=Pd(l);const y=ec(l.image);if(y&&h.manifest.model.task!=="image-text-to-text")throw new Error("This model doe\
s not admit image inputs");Ye(u.signal);const b=new AbortController,f=new h.library.InterruptableStoppingCriteria,g=()=>{
b.abort(u.signal?.reason),f.interrupt()};u.signal?.addEventListener("abort",g,{once:!0}),b.signal.addEventListener("abor\
t",()=>f.interrupt(),{once:!0}),h.active=b,h.requestId=d,h.status="generating";let w,k,x=0,A=0,v,E=!1;const C=h.gpuDispatches??
0,I=h.gpuSubmissions??0;try{Ye(u.signal);const{tokenizer:M,processor:R,model:$}=h.components;let P;for(;;){Ye(b.signal);
let fe=m;if(R&&(fe=m.map(ge=>({role:ge.role,content:[{type:"text",text:ge.content}]})),y)){const ge=fe.findLast(ht=>ht.role===
"user");if(!ge)throw new Error("An image requires a user message");ge.content.unshift({type:"image"})}const ee=(R??M).apply_chat_template(
fe,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof ee!="string"||vo(ee)>le.maxPromptBytes)throw new Error(
"Templated prompt exceeds its byte budget");if(y){const ge=new h.library.RawImage(y.data,y.width,y.height,y.channels);w=
await R(ee,ge,{do_image_splitting:!1})}else w=await M(ee,{truncation:!1,padding:!1});if(Ye(b.signal),P=w.input_ids?.dims?.
at(-1),!Number.isSafeInteger(P)||P<1)throw new Error("Invalid model input token count");if(P+p<=le.maxContextTokens)break;
const me=rR(m);if(!me)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten th\
e prompt or request fewer output tokens");const we=w;w=void 0,So(we),m=me,E=!0}Ye(b.signal);const O=new h.library.TextStreamer(
M,{skip_prompt:!0,skip_special_tokens:!0,callback_function:fe=>{if(!(b.signal.aborted||v)){if(A+=vo(fe),A>le.maxOutputBytes){
v=new Error("Generated text exceeded its byte budget"),b.abort(v);return}try{if(u.emitProgress?.({type:"token",sessionId:h.
sessionId,requestId:d,sequence:x++,text:fe})===!1)throw new Error("Token consumer rejected output")}catch(ee){v=ee,b.abort(
ee)}}}});if(k=await $.generate({...w,max_new_tokens:p,do_sample:!1,streamer:O,stopping_criteria:[f]}),await h.runtimeDevice?.
queue.onSubmittedWorkDone(),v)throw v;if(h.lost)throw new Error("GPU device lost; model session is unavailable");Ye(b.signal);
const Q=k.tolist();if(Q.length!==1||Q[0].length<P||Q[0].length>P+p)throw new Error("Model returned an over-budget token \
sequence");const H=Q[0].slice(P),V=M.decode(H,{skip_special_tokens:!0});if(vo(V)>le.maxOutputBytes)throw new Error("Gene\
rated text exceeds its byte budget");return h.generatedRequests+=1,{sessionId:h.sessionId,requestId:d,text:V,inputTokens:P,
outputTokens:H.length,finishReason:nR($,H,p),contextTruncated:E,workerId:h.workerId,gpuDispatches:(h.gpuDispatches??0)-C,
gpuSubmissions:(h.gpuSubmissions??0)-I,gpuProfileSamples:h.gpuProfileSamples??0}}finally{u.signal?.removeEventListener("\
abort",g);try{const M=new Set;So(w,M),So(k,M)}finally{h.active=null,h.requestId=null,h.status="ready"}}}return async function(u={},h={}){
if(s(),u.command==="load")return a(u,h);if(u.command==="generate")return c(u,h);const d=i.get(qs(u.sessionId));if(u.command===
"status")return d?Np(d):{sessionId:u.sessionId,status:"absent"};if(u.command==="cancel")return d?.requestId===u.requestId&&
d.active?.abort("Generation cancelled"),{sessionId:u.sessionId,cancellationRequested:!0};if(u.command==="unload"){if(!d)
return{sessionId:u.sessionId,status:"absent"};if(d.status!=="ready")throw new Error("Cancel and await active model work \
before unloading");d.status="unloading";try{await gu(d.components),d.restoreGpuEvidence?.()}catch(p){d.status="ready",d.
lost=!0;const m=new Error(`MODEL_DISPOSE_FAILED: ${p.message}`);throw m.code="MODEL_DISPOSE_FAILED",m}return i.delete(u.
sessionId),{sessionId:u.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}const iR=Fy(),oR=(r,e)=>iR(
r,e),aR=Object.freeze(Object.defineProperty({__proto__:null,createModelTaskRuntime:Fy,handleModelTask:oR,normalizeModelMessages:Pd,
validateImageInput:ec},Symbol.toStringTag,{value:"Module"})),_L="/peercompute/inference/2.0.0",cR=256,Vn=Object.freeze({
frameBytes:128*1024,imageChunkBytes:64*1024,maximumPeers:32,maximumModels:128,maximumInbound:5,maximumPerPeer:2,maximumOutbound:5,
queryTimeoutMs:5e3,requestTimeoutMs:12e4,recordTtlMs:15e3}),Oy=new TextEncoder,lR=new TextDecoder("utf-8",{fatal:!0}),zy=r=>Oy.
encode(r).length,qy=r=>Zn.parse(Dn(r,128)).toV1().toString();function Dn(r,e=256){if(typeof r!="string"||!r.length||zy(r)>
e)throw new Error("Invalid inference text field");return r}function Ue(r,e,t=0){if(!Number.isSafeInteger(r)||r<t||r>e)throw new Error(
"Invalid inference numeric field");return r}function IL(r){return r?.status==="open"&&!!r.remotePeer&&(r.encryption==="/\
noise"||r.encryption==="/tls/1.0.0"||r.encryption==="native"&&r.remoteAddr?.getComponents?.().some(({name:e})=>e==="webr\
tc"||e==="webrtc-direct"))}function Up(r){if(!r||typeof r!="object")throw new Error("Invalid model descriptor");if(!Array.
isArray(r.modalities)||r.modalities.length>4||r.modalities.some(n=>!["text","image","audio","video"].includes(n)))throw new Error(
"Invalid model modalities");const e=r.task??(r.modalities.includes("image")?"image-text-to-text":"text-generation");if(![
"text-generation","image-text-to-text","text-to-image"].includes(e))throw new Error("Invalid model task");const t=e==="t\
ext-to-image"?["image"]:["text"];if(r.outputModalities!==void 0&&(!Array.isArray(r.outputModalities)||r.outputModalities.
length!==1||r.outputModalities[0]!==t[0]))throw new Error("Model output modalities do not match its task");if(e==="text-\
to-image"&&(r.modalities.length!==1||r.modalities[0]!=="text"))throw new Error("Image generation accepts text input only");
return{manifestCid:qy(r.manifestCid),modelId:Dn(r.modelId),name:Dn(r.name),task:e,outputModalities:t,modalities:[...new Set(
r.modalities)],runtime:Dn(r.runtime,128),repository:Dn(r.repository,256),revision:Dn(r.revision,128),totalBytes:Ue(r.totalBytes,
64*1024**3)}}function CL(r,e=!0,{defaultMaxNewTokens:t=cR}={}){if(!r||!Array.isArray(r.sharedModels)||r.sharedModels.length>
Vn.maximumModels)throw new Error("Invalid shared model catalog");const n=[...new Map(r.sharedModels.map(i=>{const o=Up(i);
return[o.manifestCid,o]})).values()],s=e&&r.hostedModel?Up(r.hostedModel):null;return s&&(s.maxNewTokens=Ue(r.hostedModel.
maxNewTokens===void 0?t:r.hostedModel.maxNewTokens,le.maxNewTokens,1)),{sharedModels:n,hostedModel:s,busy:!!r.busy,idleForMs:Ue(
r.idleForMs??0,Number.MAX_SAFE_INTEGER),queuedRequests:Ue(r.queuedRequests??0,1024)}}function TL(r,{imageBytes:e=!1}={}){
qs(r.requestId);const t={requestId:r.requestId,manifestCid:qy(r.manifestCid),messages:Pd(r),maxNewTokens:Ue(r.maxNewTokens??
le.maxNewTokens,le.maxNewTokens,1)};if(r.task!==void 0){if(!["text-generation","image-text-to-text","text-to-image"].includes(
r.task))throw new Error("Invalid inference task");t.task=r.task}r.seed!==void 0&&(t.seed=Ue(r.seed,4294967295)),r.steps!==
void 0&&(t.steps=Ue(r.steps,8,1));for(const n of["width","height"])r[n]!==void 0&&(t[n]=Ue(r[n],512,512));if(t.task==="t\
ext-to-image"&&(r.image!=null||t.messages.length!==1||t.messages[0].role!=="user"))throw new Error("Image generation nee\
ds one text prompt");if(r.image!=null){const{width:n,height:s,channels:i}=r.image;if(Ue(n,le.maxImagePixels,1),Ue(s,le.maxImagePixels,
1),i!==4||n*s>le.maxImagePixels)throw new Error("Invalid inference image dimensions");e&&ec(r.image),t.image={width:n,height:s,
channels:4},e&&(t.image.data=new Uint8Array(r.image.data))}return t}function uR(r,{imageBytes:e=!1}={}){if(!r||typeof r!=
"object")throw new Error("Invalid result image");const t=Ue(r.width,1024,1),n=Ue(r.height,1024,1);if(r.channels!==4||t*n>
le.maxImagePixels||!/^[a-f0-9]{64}$/.test(r.sha256??""))throw new Error("Invalid result image dimensions or digest");return e&&
ec(r),{width:t,height:n,channels:4,sha256:r.sha256,...e?{data:r.data}:{}}}function ML(r,e={}){if(typeof r?.text!="string"||
zy(r.text)>le.maxOutputBytes)throw new Error("Invalid inference result text");const t=r.finishReason===void 0?"unknown":
r.finishReason;if(!["stop","length","unknown"].includes(t))throw new Error("Invalid inference finish reason");const n={text:r.
text,finishReason:t};if(r.contextTruncated!==void 0){if(typeof r.contextTruncated!="boolean")throw new Error("Invalid in\
ference context truncation flag");n.contextTruncated=r.contextTruncated}for(const s of["inputTokens","outputTokens","gpu\
Dispatches","gpuSubmissions"])r[s]!=null&&(n[s]=Ue(r[s],Number.MAX_SAFE_INTEGER));return r.image!=null&&(n.image=uR(r.image,
e)),r.seed!==void 0&&(n.seed=Ue(r.seed,4294967295)),r.steps!==void 0&&(n.steps=Ue(r.steps,8,1)),n}function RL(r){if(!["t\
ext-encoder","denoise","decode"].includes(r.stage))throw new Error("Invalid image generation stage");const e=Ue(r.steps,
8,1);return{type:"diffusion-progress",stage:r.stage,steps:e,step:Ue(r.step,e)}}function BL(r){const e=Ny(r,{maxDataLength:Vn.
frameBytes,maxBufferSize:Vn.frameBytes*2+32});return{rpc:e,async read(t){return JSON.parse(lR.decode((await e.read({signal:t})).
subarray()))},async write(t,n){const s=Oy.encode(JSON.stringify(t));if(s.length>Vn.frameBytes)throw new Error("Inference\
 frame exceeds its byte limit");await e.write(s,{signal:n})}}}function dl(r,e){const t=o=>Number.isSafeInteger(o)&&o>=0?
o:1/0,n=t(r.totalBytes),s=t(e.totalBytes);if(n!==s)return n<s?-1:1;const i=o=>`${o.name??""}\0${o.key??o.manifestCid??""}`;
return i(r)<i(e)?-1:i(r)>i(e)?1:0}function Ps(r={}){const e=[...r.modalities??["text"]],t=r.task??(e.includes("image")?"\
image-text-to-text":"text-generation");return{task:t,modalities:e,outputModalities:[...r.outputModalities??[t==="text-to\
-image"?"image":"text"]]}}function dR(r,{catalog:e,now:t=Date.now,preferences:n=Ly({storeName:r.store.lockName??r.store.
name})}={}){const s=Object.fromEntries(["importCatalog","importPackage","ensure","load","connect","connectBackend","disp\
ose"].map(_=>[_,r[_].bind(r)])),i={},o=new Map,a=new Map,c=new Set,l=new Map,u=new Map,h=new AbortController,d=hM(),p=new Set,
m=new Map,y=new Set,b=new Map;let f=!0,g=!0,w=!1,k,x,A,v,E,C=null,I=0,M=t(),R=Promise.resolve(),$=n.readLastLoaded(),P={
connected:!1,peerCount:0,sharedModelCount:0,hostedModelCount:0,errors:[],checkedAt:null};const O=()=>{if(w)throw new Error(
"Model console is closed")},Q=_=>_?AbortSignal.any([_,h.signal]):h.signal;function H(_){const B=!_.model&&pu(_,Object.values(
e));return r.getModelCompatibility?.(B||_)??{status:"unknown",reason:"Local memory fit is unverified."}}function V(_){const B=H(
_);if(["checking","unavailable"].includes(B.status))throw Object.assign(new Error(B.reason||"This model cannot load on t\
his device"),{code:"ERR_MODEL_LOCAL_UNAVAILABLE",availability:B});return B}if(r.setMemoryBudgets){const _=r.setMemoryBudgets.
bind(r);r.setMemoryBudgets=B=>{if(O(),v||r.service.getStatus().status==="loading")throw new Error("Wait for the model im\
port/load to finish before changing memory budgets");return _(B)}}function fe(_,B){if(!B?.model?.runtime||!B.model.repository)
return null;const L=pu(B,Object.values(e));return{manifestCid:_,modelId:L?.id??_,name:L?.name??B.name??B.model.repository,
...Ps(B.model),runtime:B.model.runtime,repository:B.model.repository,revision:B.model.revision,totalBytes:B.files.reduce(
(W,F)=>W+F.size,0)}}async function ee(_){if(!_?.cid)throw new Error("Imported package has no content identity");const B=_.
manifest??await r.store.getManifest(_.cid),L=fe(_.cid,B);return L&&(o.set(_.cid,L),a.set(_.cid,B)),L}async function me(_){
const B=await fM(r.store,{signal:_}),L=new Set;for(const W of B){if(W.status==="deleting"){p.add(W.cid);continue}(W.pinned||
W.retain)&&(L.add(W.cid),await ee(W))}for(const W of o.keys())L.has(W)||(o.delete(W),a.delete(W));return $&&!L.has($.manifestCid)&&
($=await n.clearLastLoaded($)),B}async function we(_,B){const L=ge();B?.aborted||L?.manifestCid!==_||($=await n.rememberLoaded(
{manifestCid:_,modelId:L.modelId},{signal:B}))}function ge(){const _=r.service.getStatus();return C&&!p.has(C.manifestCid)&&
_.status==="ready"&&_.manifestCid===C.manifestCid?C:null}const ht=()=>(k?.listModels()??[]).map(_=>({..._,...Ps(_),providers:_.
providers.filter(B=>!B.local)})).filter(_=>_.providers.length),at=()=>(k?.listHosts()??[]).map(_=>({..._,...Ps(_),hosts:_.
hosts.filter(B=>!B.local)})).filter(_=>_.hosts.length);function $t(_=[]){const B=r.networkManager,L=!!B?.isConnected,W=new Set(
L?B.peers?.keys()??[]:[]);for(const F of L?B.libp2p?.getConnections?.()??[]:[])F.status==="open"&&W.add(F.remotePeer.toString());
W.delete(B?.libp2p?.peerId?.toString());for(const F of B?.bootstrapPeerIds??[])W.delete(F);P={connected:L,peerCount:W.size,
sharedModelCount:L?ht().length:0,hostedModelCount:L?at().length:0,checkedAt:t(),errors:(Array.isArray(_)?_:[]).slice(0,Vn.
maximumPeers).map(F=>({peerId:String(F?.peerId??"").slice(0,128),code:String(F?.code??"ERR_PEER_DISCOVERY").slice(0,80),
message:String(F?.message??"Peer directory query failed").slice(0,256)}))}}function nt(_){w||E||(E=sr().catch(B=>{if(!w)
for(const L of _?[_]:o.keys())l.set(L,B)}).finally(()=>{E=null}))}async function sr({strict:_=!1}={}){const B=async()=>{
if(w||!(r.artifactReady??r.networkReady))return;await me(h.signal);const L=new Set(r.networkManager.getPublishedArtifactCids()),
W=[];for(const F of c)if(!o.has(F))try{await r.withdraw(F),L.delete(F),c.delete(F),l.delete(F)}catch(K){l.set(F,K),W.push(
K)}for(const F of o.keys()){try{f&&!p.has(F)&&!L.has(F)&&(await r.publish(F),L.add(F)),(!f||p.has(F))&&L.has(F)&&(await r.
withdraw(F),L.delete(F)),l.delete(F)}catch(K){l.set(F,K),W.push(K)}L.has(F)?c.add(F):c.delete(F)}if(_&&W.length)throw new AggregateError(
W,"Some models could not update their file sharing state")};return R=R.catch(()=>{}).then(B),R}async function ir(_){const B=ge();
if(!B)throw new Error("Import a model before using local inference");if(_.image&&!B.modalities.includes("image"))throw new Error(
"This model accepts text only");I++;const L=new AbortController,W=AbortSignal.any([Q(_.signal),L.signal]),F={manifestCid:B.
manifestCid,abort:L};y.add(F);try{return F.promise=Promise.resolve(r.service.generate({..._,task:B.task,signal:W})),await F.
promise}finally{y.delete(F),--I===0&&(M=t())}}async function J(){O();const _=r.networkManager;return _?.isConnected?(k?.
closed&&(await _.releasePeerInferenceService(i),k=null),k||(x||(x=_.createPeerInferenceService({owner:i,requestTimeoutMs:3e5,
getLocalState:()=>{const B=r.service.getStatus(),L=I>0||!!B.activeRequestId||B.queuedRequests>0,W=ge(),F=[...o.values()].
filter(K=>c.has(K.manifestCid)&&!p.has(K.manifestCid));return W&&F.sort((K,ke)=>+(ke.manifestCid===W.manifestCid)-+(K.manifestCid===
W.manifestCid)),{sharedModels:f?F.slice(0,Vn.maximumModels):[],hostedModel:g&&!w?ge():null,busy:L,queuedRequests:B.queuedRequests??
0,idleForMs:L?0:Math.max(0,t()-M)}},generate:async({manifestCid:B,...L})=>{if(!g||w||ge()?.manifestCid!==B)throw new Error(
"Model is no longer hosted");return ir(L)}}).then(async B=>{if(w)throw await _.releasePeerInferenceService(i),new Error(
"Model console is closed");return k=B,await B.setHostingEnabled(g),B}).finally(()=>{x=null})),x)):null}async function xe(){
await J(),nt()}function At(_,B){O();const L=Q(B);return d.run(()=>(O(),_(L)),{signal:L})}async function _t(_,B,{deferSharing:L=!1}={}){
let W;try{W=await s[_](...B)}catch(F){throw By(F)}return await ee(W),L||await sr(),W}function Ar(_){nt(_)}async function _r(_,B={}){
if(p.has(_))throw new Error("This model is being deleted; retry deletion before loading it");V(await r.store.getManifest(
_,{signal:B.signal})),b.has(_)||b.set(_,await r.store.acquireUse(_,{signal:B.signal}));let L;try{L=await s.load(_,B)}catch(W){
throw r.service.getStatus().manifestCid!==_&&await Re(_),W}return C=await ee({cid:_}),M=t(),await J(),await we(_,B.signal),
{...L,manifestCid:_}}async function ct(){await k?.setHostingEnabled(!1),await r.service.unloadModel();for(const _ of b.keys())
await Re(_);C=null,await k?.setHostingEnabled(g)}async function Re(_){const B=b.get(_);B&&(await B(),b.delete(_))}async function qt(_,B,L){
if(L.throwIfAborted(),V(_.manifest??await r.store.getManifest(_.cid,{signal:L})),L.throwIfAborted(),ge()?.manifestCid===
_.cid)return await we(_.cid,L),Ar(_.cid),{...r.service.getStatus().evidence,manifestCid:_.cid};B.onProgress?.({stage:"un\
load"}),L.throwIfAborted(),await ct(),L.throwIfAborted(),B.onProgress?.({stage:"load"}),L.throwIfAborted();const W=await _r(
_.cid,{...B,signal:L});return Ar(_.cid),W}async function Ae(_,B){if(O(),v)throw new Error("Another model import or load \
is already running");v=At(_,B);try{return await v}finally{v=null}}for(const _ of["connect","connectBackend"])r[_]=async(...B)=>{
O();const L=await s[_](...B);return await xe(),L};for(const _ of["importCatalog","importPackage"])r[_]=(...B)=>{const L=_===
"importPackage"?2:1;return At(W=>(B[L]={...B[L],signal:W},_t(_,B)),B[L]?.signal)};return r.ensure=(_,B={})=>At(L=>_t("en\
sure",[_,{...B,signal:L}]),B.signal),r.load=(_,B={})=>At(L=>_r(_,{...B,signal:L}),B.signal),Object.assign(r,{getPreferences:()=>({
sharing:f,hostInference:g}),getSharingErrors:()=>[...l].map(([_,B])=>({manifestCid:_,message:B.message})),getDiscoveryStatus:()=>structuredClone(
{...P,connected:!!r.networkManager?.isConnected}),getPreferredModelSourceKey(){const _=$&&!p.has($.manifestCid)&&o.get($.
manifestCid);return _?e[_.modelId]?`hf:${_.modelId}`:`stored:${_.manifestCid}`:`hf:${ll}`},getStartupModel(){O();const _=[
...o.values()].filter(F=>!p.has(F.manifestCid)).sort(dl),B=F=>H(a.get(F.manifestCid)??F),L=_.find(F=>F.manifestCid===$?.
manifestCid)??_.find(F=>!["checking","unavailable"].includes(B(F).status))??_[0];if(L)return{sourceKey:e[L.modelId]?`hf:${L.
modelId}`:`stored:${L.manifestCid}`,manifestCid:L.manifestCid,name:L.name,localAvailability:B(L)};const W=e[ll];return W?
{sourceKey:`hf:${ll}`,name:W.name,localAvailability:H(W)}:null},listModelSources(){return[...Object.values(e).map(_=>({key:`\
hf:${_.id}`,name:_.name,source:"hf",modelId:_.id,...Ps(_.model),runtime:_.model.runtime,totalBytes:_.totalBytes,localAvailability:H(
_)})),...ht().map(_=>({..._,key:`peer:${_.manifestCid}`,source:"peers",localAvailability:H(_)})),...[...o.values()].filter(
_=>!e[_.modelId]&&!p.has(_.manifestCid)).map(_=>({..._,key:`stored:${_.manifestCid}`,source:"stored",localAvailability:H(
a.get(_.manifestCid)??_)}))].sort(dl)},listInferenceTargets(){const _=ge();return[{key:"local",name:_?.name??"No model l\
oaded",local:!0,available:!!_,busy:I>0,...Ps(_??{}),providerCount:_?1:0},...at().map(B=>({...B,key:`peer:${B.manifestCid}`,
local:!1,available:!0,busy:B.hosts.every(L=>L.busy),providerCount:B.hosts.length}))]},async refreshPeers({signal:_}={}){
return O(),A||(A=(async()=>{const B=Q(_);try{B.throwIfAborted();const L=await J();B.throwIfAborted(),nt();const W=L?await L.
refresh({signal:B}):null;return B.throwIfAborted(),$t(W?.errors),{models:r.listModelSources(),targets:r.listInferenceTargets(),
discovery:r.getDiscoveryStatus()}}catch(L){throw!w&&!B.aborted&&$t([L]),L}})().finally(()=>{A=null})),A},async setSharing(_){
O();const B=f;f=!!_;try{await sr({strict:!0})}catch(L){throw f=B,L}return r.getPreferences()},async setHostInference(_){
return O(),g=!!_,await(await J())?.setHostingEnabled(g),r.getPreferences()},async acquireModel(_,B={}){O();const L=r.listModelSources().
find(F=>F.key===_);if(!L)throw new Error("This model source is no longer available");if(L.source==="stored")return r.loadStoredModel(
L.manifestCid,B);const W=L.source==="hf"?e[L.modelId]:L;return V(W),Ae(async F=>{V(W);let K;if(L.source==="hf"){const ke=$&&
o.get($.manifestCid),_e=ke?.modelId===L.modelId?ke:[...o.values()].find(lt=>lt.modelId===L.modelId);K=_e&&await r.store.
stat(_e.manifestCid,{signal:F}),(!K||K.status!=="complete")&&(K=await _t("importCatalog",[L.modelId,{...B,signal:F}],{deferSharing:!0}))}else
r.inspectPeerPackage&&V(await r.inspectPeerPackage(L.manifestCid,{signal:F})),F.throwIfAborted(),B.onProgress?.({stage:"\
download-peers"}),F.throwIfAborted(),K=await _t("ensure",[L.manifestCid,{signal:F}],{deferSharing:!0});return qt(K,B,F)},
B.signal)},loadStoredModel(_,B={}){const L=ye(_).toString();return Ae(async W=>{if(p.has(L))throw new Error("This model \
is being deleted; retry deletion before loading it");const F=await r.store.stat(L,{signal:W});if(F?.kind!=="manifest"||F.
status!=="complete"||!(F.pinned||F.retain))throw new Error("This model is no longer completely stored and retained on th\
is device. Import it before loading.");return qt(F,B,W)},B.signal)},unload(){return At(()=>ct())},async listStoredModels({
signal:_}={}){O();const B=Q(_),L=await me(B),W=r.service.getStatus(),F=new Set(r.networkManager?.getPublishedArtifactCids?.()??
[]);return L.map(K=>({manifestCid:K.cid,name:fe(K.cid,K.manifest)?.name??K.manifest.name??K.cid,modelId:fe(K.cid,K.manifest)?.
modelId??K.cid,totalBytes:K.manifest.files.reduce((ke,_e)=>ke+_e.size,0),runtime:K.manifest.model.runtime,localAvailability:K.
status==="deleting"||p.has(K.cid)?{status:"unavailable",code:"model_deleting",reason:"Finish deleting this package befor\
e loading it."}:K.pinned||K.retain?H(K.manifest):{status:"unavailable",code:"model_not_retained",reason:"This package is\
 not retained for local use. Import it before loading."},loaded:W.status!=="idle"&&W.manifestCid===K.cid,shared:F.has(K.
cid),...K.status==="deleting"||p.has(K.cid)?{cleanupPending:!0}:{},...l.has(K.cid)?{shareError:l.get(K.cid).message}:{}})).
sort(dl)},deleteStoredModel(_,{signal:B}={}){O();const L=ye(_).toString();if(m.has(L))return m.get(L);B?.throwIfAborted(),
p.add(L);const W=At(F=>pM(r,async()=>{let K=!1;const ke=await r.store.stat(L,{signal:F});if(ke&&(ke.kind!=="manifest"||!ke.
manifest?.model?.runtime))throw p.delete(L),new Error("Only stored model packages can be deleted here");try{await R.catch(
()=>{}),r.networkManager?.getPublishedArtifactCids?.().includes(L)&&await r.withdraw(L),c.delete(L);const _e=r.service.getStatus();
if(C?.manifestCid===L||_e.manifestCid===L){await k?.setHostingEnabled(!1);const Be=[...y].filter(We=>We.manifestCid===L);
for(const We of Be)We.abort.abort(new DOMException("Stored model is being deleted","AbortError"));await Promise.allSettled(
Be.map(We=>We.promise)),await r.service.unloadModel(),await Re(L),C=null,K=!0}F.throwIfAborted();const It=await r.store.
remove(L,{signal:F});return o.delete(L),a.delete(L),p.delete(L),l.delete(L),$?.manifestCid===L&&($=await n.clearLastLoaded(
$)),await k?.setHostingEnabled(g),{deleted:It.removed,freedBytes:It.freedBytes,unloaded:K}}catch(_e){throw await r.store.
stat(L).catch(()=>{})===void 0&&o.delete(L),await k?.setHostingEnabled(g).catch(()=>{}),_e}},{signal:F}),B).finally(()=>{
m.delete(L)});return m.set(L,W),W},async generate(_,B={}){O();const L=B.requestId??crypto.randomUUID();if(u.has(L))throw new Error(
"Duplicate inference request ID");const W=new AbortController,F=AbortSignal.any([Q(B.signal),W.signal]),K={abort:W,remote:_!==
"local"};u.set(L,K);try{const ke={...B,requestId:L,signal:F};if(_==="local")return await ir(ke);const _e=at().find(lt=>`\
peer:${lt.manifestCid}`===_);if(!_e)throw new Error("No peer is currently hosting that model");if(B.image&&!_e.modalities.
includes("image"))throw new Error("This model accepts text only");return await k.generate(_e.manifestCid,{...ke,task:_e.
task})}finally{u.delete(L)}},async cancel(_){const B=u.get(_);return B?(B.abort.abort("User cancelled"),B.remote?await k?.
cancel(_):await r.service.cancel(_),!0):!1}}),r.dispose=async()=>{w=!0,g=!1,C=null,h.abort("Model console closed");for(const _ of u.
values())_.abort.abort("Model console closed");await x?.catch(()=>{}),await r.networkManager?.releasePeerInferenceService(
i),k=null,await Promise.allSettled([R,E,A,v,d.settled()].filter(Boolean)),await s.dispose();for(const _ of b.keys())await Re(
_)},{async initialize(){await r.checkDeviceCapabilities?.(),await me(h.signal),r.networkManager?.isConnected&&await xe()}}}
function hr(r){r?.throwIfAborted()}function so(r,e){return hr(e),e?new Promise((t,n)=>{const s=()=>n(e.reason);e.addEventListener(
"abort",s,{once:!0}),r.then(t,n).finally(()=>e.removeEventListener("abort",s))}):r}function hR({store:r,manager:e=null,createManager:t,
stopArtifacts:n=s=>s._stopArtifactTransport()}={}){let s=e,i=null,o=null,a=null,c=null,l=null,u="offline",h=null,d=!1;const p=new Set,
m=new AbortController;function y(){if(d)throw new Error("Model network connection is disposed")}function b(){const E=s?.
getArtifactTransport?.();return E?.store===r&&!E.requiresCleanup?E:null}function f(){return!d&&!!s?.isConnected&&u==="re\
ady"&&!!b()}async function g(){const E=h;if(!E)return;const C=E.manager.getArtifactTransport?.();C&&C===E.transport&&await n(
E.manager),h===E&&(h=null)}function w(){if(y(),!s?.isConnected)return Promise.resolve(null);if(o)return o;if(b())return u=
"ready",l=null,Promise.resolve(b());const E=s;u="starting",l=null;const C=(async()=>{try{if(E.artifactStopping&&await E.
artifactStopping,d||!E.isConnected)return null;h?.manager===E&&E.getArtifactTransport?.()?.requiresCleanup&&await g();const M=E.
getArtifactTransport?.()||E.artifactStarting?null:{manager:E,transport:null};M&&(h=M);let R;try{R=await E.createArtifactTransport(
r)}finally{M&&(M.transport=E.getArtifactTransport?.()??null,!M.transport&&h===M&&(h=null))}if(R?.store!==r||R.requiresCleanup)
throw new Error("Artifact transport is not ready for this model library");return!d&&s===E&&E.isConnected&&(u="ready"),R}catch(I){
return d||(l=I,u="error"),null}finally{(d||!E.isConnected)&&(u="offline")}})();return o=C,C.then(()=>{o===C&&(o=null)}),
C}async function k(E){await E.disconnect(),p.delete(E),s===E&&(s=null),h?.manager===E&&(h=null)}function x(E,{signal:C}={}){
if(y(),hr(C),s?.isConnected)return w(),Promise.resolve(f()?b():null);if(i)return so(i,C);const I=C?AbortSignal.any([C,m.
signal]):m.signal;c=null;const M=(async()=>{let R=s;try{for(const $ of p)$!==s&&await k($);if(hr(I),!R){const $=typeof E==
"function"?await E({signal:I}):E;hr(I),R=await t($),p.add(R),hr(I)}return R.libp2p||await R.initialize(),hr(I),await R.connect(),
hr(I),s=R,c=null,w(),f()?b():null}catch($){if(R&&p.has(R))try{await k(R)}catch(P){$=new AggregateError([$,P],"Applicatio\
n connection failed and its cleanup must be retried",{cause:$})}throw d||(c=$),$}})();return i=M,M.then(()=>{i===M&&(i=null)},
()=>{i===M&&(i=null)}),so(M,C)}async function A({signal:E}={}){if(y(),hr(E),!s?.isConnected)throw new Error("Connect the\
 network before transferring model files");if(o?await so(o,E):u==="offline"&&await so(w(),E),hr(E),y(),!f())throw l??new Error(
"Model file sharing is unavailable; use Connect to retry");return b()}function v(){if(a)return a;d=!0,m.abort(new DOMException(
"Model network connection disposed","AbortError")),u="offline";const E=(async()=>{await i?.catch(()=>{}),await o;const C=[];
for(const I of p)try{await k(I)}catch(M){C.push(M)}if(h&&!p.has(h.manager))try{await g()}catch(I){C.push(I)}if(C.length)
throw new AggregateError(C,"Model network cleanup failed; retry closing the console")})();return a=E,E.then(()=>{a===E&&
(a=null)},()=>{a===E&&(a=null)}),E}return{connect:x,startArtifacts:w,requireArtifacts:A,dispose:v,get manager(){return s},
get networkReady(){return!d&&!!s?.isConnected},get artifactReady(){return f()},get error(){return c??l},getArtifactNetworkStatus(){
const E=d||!s?.isConnected?"offline":u;return{status:E,error:E==="error"?String(l?.message??l).slice(0,1024):null}}}}const fR=""+
new URL("ort-wasm-simd-threaded.asyncify-CxOG5pUO.wasm",import.meta.url).href,pR=""+new URL("ort-wasm-simd-threaded.asyn\
cify-DXIbolS2.mjs",import.meta.url).href,mR=""+new URL("wllama-DrYkKwf9.wasm",import.meta.url).href,gR=""+new URL("ort-w\
asm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,bR=""+new URL("ort-wasm-simd-threaded.jsep-CdNSU0KB.mjs",import.meta.
url).href,Fp=Object.freeze({...Qa,...vd,...Ja,...Xa});function yR(r){if(r){const e=new URL(r,location.href);return{mjs:new URL(
"ort-wasm-simd-threaded.asyncify.mjs",e).href,wasm:new URL("ort-wasm-simd-threaded.asyncify.wasm",e).href}}return{mjs:new URL(
pR,location.href).href,wasm:new URL(fR,location.href).href}}function wR(){return{wasm:new URL(mR,location.href).href}}function kR(){
return{mjs:new URL(bR,location.href).href,wasm:new URL(gR,location.href).href}}async function Op(){const{validateGgufCapabilities:r}=await Et(
async()=>{const{validateGgufCapabilities:e}=await import("./runtimeDefinition-CuF6Fycr.js");return{validateGgufCapabilities:e}},
__vite__mapDeps([2,3]),import.meta.url);return r()}async function ER({stateManager:r,computeManager:e,networkManager:t,storeName:n="\
inference-models",runtimeBaseUrl:s,collectGpuEvidence:i=!1,memoryBudgets:o,preferenceStorage:a,probeDeviceCapabilities:c=aM,
ggufRuntimeOptions:l={n_ctx:2048,n_batch:64,n_gpu_layers:99999,n_threads:1}}={}){let u=mu(o),h=null,d;const p=!r,m=!e,y=r??
new K5(t??null,{enablePersistence:!1,disableNetworkProvider:!0,disableBroadcast:!0}),b=e??new yT({requireWorkers:!0,enableWorkers:!0,
enableWebGPU:!0,minWorkers:1,targetWorkers:1,maxWorkers:1,autoScaleWorkers:!1,workerBootstrapTimeoutMs:6e4}),g=t?.getArtifactTransport?.()?.
store??y.getArtifactStore(n),w=g??y.createArtifactStore({name:n,capacity:"browser",maximumTraversalBlocks:131072});let k,
x,A,v;const E=hR({store:w,manager:t,async createManager(R){const{NetworkManager:$}=await Et(async()=>{const{NetworkManager:P}=await import("./NetworkManager-Ca7bkWsa.js").
then(O=>O.U);return{NetworkManager:P}},__vite__mapDeps([7,3]),import.meta.url);return new $(R)}});try{await w.open();const R=12*
1024**3,$=16*1024**3;k=await b.createModelInferenceService({artifactStore:w,resourceBudgets:{cpu:{units:1,memoryBytes:R},
gpu:{units:1,memoryBytes:$}},resourceEstimate:xo,runtimeAssets:yR(s),collectGpuEvidence:i,generationTimeoutMs:3e5}),x=await C(
l),A=await b.createModelInferenceService({artifactStore:w,runtime:"onnx-diffusion",runtimeAssets:kR(),runtimeOptions:{},
collectGpuEvidence:i,resourceEstimate:xo,loadTimeoutMs:3e5,generationTimeoutMs:3e5}),v=k,E.networkReady&&E.startArtifacts()}catch(R){
throw await A?.dispose().catch(()=>{}),await x?.dispose().catch(()=>{}),await k?.dispose().catch(()=>{}),m&&await b.destroy().
catch(()=>{}),p?await y.destroy().catch(()=>{}):g||await w.destroy().catch(()=>{}),R}async function C(R){return b.createModelInferenceService(
{artifactStore:w,runtime:"llama.cpp",runtimeAssets:wR(),runtimeOptions:R,collectGpuEvidence:i,resourceEstimate:xo,loadTimeoutMs:30*
6e4,generationTimeoutMs:3e5})}const I={stateManager:y,computeManager:b,store:w,get service(){return v},get services(){return{
onnx:k,gguf:x,diffusion:A}},getDeviceCapabilities:()=>h,async checkDeviceCapabilities(){return d??=Promise.resolve().then(
()=>c()).then(R=>(h=R,R)),d},getMemoryBudgets:()=>({...u}),setMemoryBudgets(R){return u=mu(R),{...u}},getModelCompatibility(R){
const $=b.resourceBroker?.reportPressure().pools,P={...u};for(const[O,Q]of[["cpuBytes","cpu"],["gpuBytes","gpu"]]){const H=$?.[Q]?.
memoryBytes;Number.isSafeInteger(H)&&H>0&&(P[O]=Math.min(P[O]??H,H))}return lM(R,{device:h,budgets:P})},async inspectPeerPackage(R,{
signal:$}={}){const P=ye(R);if(P.code!==85)throw new Error("Model packages require a manifest CID");try{return await w.getManifest(
P.toString(),{signal:$})}catch(H){if($?.throwIfAborted(),!E.networkReady)throw H}await E.requireArtifacts({signal:$});const O=await E.
manager.fetchArtifactBlock(P.toString(),{artifactCid:P.toString(),signal:$});if($?.throwIfAborted(),!(O instanceof Uint8Array)||
O.byteLength>ln)throw new Error("Peer model manifest exceeds its metadata budget");if(!XT(O).every((H,V)=>H===P.multihash.
digest[V]))throw new Error("Peer model manifest CID mismatch");return ou(O)},checkGgufCapabilities:Op,get networkManager(){
return E.manager},get networkReady(){return E.networkReady},get artifactReady(){return E.artifactReady},get networkError(){
return E.error},getArtifactNetworkStatus:()=>E.getArtifactNetworkStatus(),async connectBackend(R={}){return E.connect(({
signal:$})=>gM({...R,signal:$}),R)},async connect(R,{signal:$}={}){return $?.throwIfAborted(),E.connect(()=>{if(typeof R!=
"string"||R.length>1024||!/^\/(?:dns4|dns6|ip4|ip6)\//.test(R)||!R.includes("/p2p/"))throw new Error("Enter a relay mult\
iaddress including its peer ID");return{bootstrapPeers:[R]}},{signal:$})},async importCatalog(R,$={}){const P=Fp[R];if(!P)
throw new Error("Unknown approved model");const O=Qa[R]?kT:Ja[R]?IT:Xa[R]?TT:xT;return Bp(w,{schema:"peercompute.artifac\
t.manifest.v1",name:P.name,files:P.files,model:P.model,provenance:{...P.provenance,license:P.license}},Q=>O(R,Q),$)},async importPackage(R,$,{
expectedCid:P,...O}={}){R=Ka(R);const Q=new URL($,location.href);if(Q.origin!==location.origin)throw new Error("Fixture \
package source must be same-origin");const H=await Bp(w,R,V=>new URL(V.split("/").map(encodeURIComponent).join("/"),Q).href,
O);if(P&&H.cid!==P)throw new Error("Package manifest CID changed during import");return H},async load(R,{ggufGpuLayers:$,
...P}={}){const O=await w.getManifest(R,{signal:P.signal}),Q=O.model?.runtime==="llama.cpp",H=O.model?.runtime==="onnx-d\
iffusion";if(!Q&&!H&&O.model?.runtime!=="transformers.js")throw new Error("This package can be stored and hosted, but it\
s model runtime is unavailable in this browser demo");if([k,x,A].some(V=>V.getStatus().status!=="idle"))throw new Error(
"Unload the resident model before loading another package");if(Q&&(await Op(),$!==void 0)){if(!Number.isSafeInteger($)||
$<1||$>99999)throw new Error("GGUF GPU layers must be between 1 and 99999 (all layers)");const V=await C({...l,n_gpu_layers:$});
try{await x.dispose()}catch(fe){throw await V.dispose(),fe}x=V}return v=Q?x:H?A:k,v.loadModel({manifestCid:R,...P})},async ensure(R,$={}){
return await E.requireArtifacts($),w.ensureLocal(R,{...$,fetchBlock:(P,O)=>E.manager.fetchArtifactBlock(P,{...O,artifactCid:R})})},
async publish(R){return await E.requireArtifacts(),E.manager.announceArtifact(R)},async withdraw(R){return await E.requireArtifacts(),
E.manager.withdrawArtifact(R)},async dispose(){await A.dispose(),await x.dispose(),await k.dispose(),await E.dispose(),m&&
await b.destroy(),p&&await y.destroy()}},M=dR(I,{catalog:Fp,preferences:Ly({storeName:w.lockName??w.name??n,storage:a})});
try{await M.initialize()}catch(R){throw await I.dispose(),R}return I}function xR(r){const e=new URL(r),t=e.searchParams.
get("prod")==="1"?"prod":e.searchParams.get("dev")==="1"?"dev":null,n=["5189","5176","5187"].includes(e.port)&&/^\/(?:index\.html)?$/.
test(e.pathname);return n?(e.port="4173",e.pathname="/"):e.pathname=e.pathname.replace(/\/(?:inference|cubechat|earth)(?:\/index\.html|\/)?$/,
"/"),e.search=t?`?${t}=1`:n?"?dev=1":"",e.hash="",e.href}const q=(r,e,t)=>{const n=document.createElement(r);return e!==
void 0&&(n.textContent=e),t&&(n.className=t),n},Ee=(r,e)=>{const t=q("button",r);return t.type="button",e&&t.setAttribute(
"aria-label",e),t},Fr=(r,e)=>{const t=q("label",r);return t.append(e),t};function $s(r){const e=q("dialog",void 0,"pc-mo\
del-dialog"),t=q("h2",r);t.id=`model-dialog-${crypto.randomUUID()}`,e.setAttribute("aria-labelledby",t.id);const n=Ee("D\
one");n.autofocus=!0,n.onclick=()=>e.close();const s=q("div",void 0,"pc-dialog-header");s.append(t,n);const i=q("div",void 0,
"pc-dialog-body"),o=q("p","","pc-inference-status");return o.setAttribute("role","status"),e.append(s,i,o),e.addEventListener(
"keydown",a=>{if(a.key!=="Tab")return;const c=[...e.querySelectorAll("button,input,select,textarea,a[href],[tabindex]")].
filter(h=>!h.disabled&&h.tabIndex>=0&&h.getClientRects().length),l=c[0],u=c.at(-1);(a.shiftKey&&document.activeElement===
l||!a.shiftKey&&document.activeElement===u)&&(a.preventDefault(),(a.shiftKey?u:l)?.focus())}),{element:e,body:i,status:o}}
function js(r){return!Number.isSafeInteger(r)||r<0?"Unknown size":r>=1024**3?`${(r/1024**3).toFixed(2)} GiB`:r>=1024**2?
`${(r/1024**2).toFixed(1)} MiB`:`${Math.ceil(r/1024)} KiB`}function jy(r){const e=t=>Number.isSafeInteger(t.totalBytes)&&
t.totalBytes>=0?t.totalBytes:1/0;return[...r].sort((t,n)=>e(t)-e(n)||String(t.name).localeCompare(String(n.name))||String(
t.key??t.manifestCid).localeCompare(String(n.key??n.manifestCid)))}function vR(r){const e=q("section",void 0,"pc-inferen\
ce-panel");e.setAttribute("aria-label","Model chat");const t=q("nav",void 0,"pc-console-navigation");t.setAttribute("ari\
a-label","Console navigation");const n=q("a","←","pc-console-back");n.href=xR(location.href),n.setAttribute("aria-labe\
l","Back to demo overview"),n.title="Back to demo overview";const s=Ee("☰","Menu");s.title="Menu",t.append(n,s),e.append(
t);const i=q("input");i.type="search",i.placeholder="Filter models",i.setAttribute("aria-label","Filter models"),i.maxLength=
256;const o=q("select");o.setAttribute("aria-label","Model and source");const a=Ee("Load"),c=Ee("Stored Models"),l=Ee("C\
onfig","Configure model chat"),u=$s("Config"),h=$s("Stored Models"),d=$s("Model setup"),p=$s("About PeerCompute"),m=$s("\
Menu"),y=m.element;y.classList.add("pc-console-menu");const b=Ee("About"),f=Ee("Install");f.hidden=!0,m.body.append(c,l,
b,f);const g=p.element;p.body.append(q("p","PeerCompute runs models in your browser using WebGPU. You can chat with a mo\
del on this device or use inference hosted by another peer.")),p.body.append(q("p","Model files are identified by their \
content and shared over IPFS. File sharing and hosted inference are available while the hosting browser stays online."));
const w=q("ul",void 0,"pc-about-links");for(const[T,D]of[["Tsotchke-Corporation on Hugging Face","https://huggingface.co\
/Tsotchke-Corporation"],["tsotchke.org","https://tsotchke.org"],["tsotchke.net","https://tsotchke.net"]]){const U=q("a",
T);U.href=D,U.target="_blank",U.rel="noopener noreferrer";const N=q("li");N.append(U),w.append(N)}p.body.append(w);const k=u.
element,x=h.element,A=d.element,v=q("strong"),E=q("p","","pc-inference-note"),C=q("select"),I=q("select");C.setAttribute(
"aria-label","Browser"),I.setAttribute("aria-label","Operating system");for(const[T,D]of[["chrome","Chrome"],["chromium",
"Chromium"],["edge","Edge"],["brave","Brave"],["firefox","Firefox"],["safari","Safari"],["other","Other browser"]]){const U=q(
"option",D);U.value=T,C.append(U)}for(const[T,D]of[["linux","Linux"],["windows","Windows"],["macos","macOS"],["android",
"Android"],["ios","iOS / iPadOS"],["other","Other system"]]){const U=q("option",D);U.value=T,I.append(U)}const M=q("div",
void 0,"pc-config-grid");M.append(Fr("Browser",C),Fr("Operating system",I));const R=q("div",void 0,"pc-model-help-detail\
s"),$=q("textarea");$.readOnly=!0,$.rows=3,$.setAttribute("aria-label","Browser launch command"),$.spellcheck=!1;const P=Ee(
"Copy command"),O=Ee("Open Config"),Q=q("div",void 0,"pc-model-help-command");Q.append($,P),d.body.append(v,E,M,q("p","B\
rowser detection is approximate. Adjust these choices if needed.","pc-inference-note"),R,Q,O);for(const[T,D]of[[l,k],[c,
x],[b,g],[s,y]])D.id=`model-window-${crypto.randomUUID()}`,T.setAttribute("aria-controls",D.id),T.setAttribute("aria-has\
popup","dialog");const H=q("div",void 0,"pc-model-toolbar");H.append(i,o,a),e.append(H);const V=q("p","","pc-model-avail\
ability");V.setAttribute("aria-live","polite"),V.id=`model-availability-${crypto.randomUUID()}`,o.setAttribute("aria-des\
cribedby",V.id),e.append(V);const fe=Ee("Setup help","Set up selected model");fe.hidden=!0,fe.className="pc-source-help",
e.append(fe);const ee=q("p","Connecting to peer network…","pc-network-summary");ee.setAttribute("aria-live","polite"),
e.append(ee);const me=q("input");me.type="checkbox",me.checked=!0;const we=q("input");we.type="checkbox",we.checked=!0;const ge=q(
"div",void 0,"pc-model-preferences"),ht=Fr("Share with peers",me);ht.prepend(me),ht.title="Share imported model files wi\
th connected peers while this browser stays online.";const at=Fr("Host inference",we);at.prepend(we),at.title="Allow con\
nected peers to send requests to the model loaded on this device.",ge.append(ht,at),u.body.append(ge);const $t=q("p","Op\
ening model chat…","pc-inference-status");$t.setAttribute("role","status"),e.append($t);const nt=q("input");nt.type="n\
umber",nt.min="1",nt.max="99999",nt.value="99999",nt.setAttribute("aria-label","GGUF GPU layer limit");const sr=q("div",
void 0,"pc-config-grid"),ir=q("input"),J=q("input");for(const T of[ir,J])T.type="number",T.min="0",T.max="1024",T.step="\
any",T.placeholder="Auto";sr.append(Fr("Model RAM budget (GiB)",ir),Fr("Model GPU memory budget (GiB)",J));const xe=q("p",
"","pc-inference-note");u.body.append(sr,xe);const At=q("div",void 0,"pc-config-grid");At.append(Fr("GGUF GPU layers",nt)),
u.body.append(At),u.body.append(q("p","99999 uses all GPU layers. The 27B model was tested with 56 layers on an RTX 5060\
 Ti (16 GB), with a compatible browser.","pc-inference-note"));const _t=q("input");_t.placeholder="Optional relay multia\
ddress",_t.setAttribute("aria-label","Artifact relay multiaddress");const Ar=Ee("Connect"),_r=q("div",void 0,"pc-config-\
row");_r.append(_t,Ar),u.body.append(_r);const ct=q("p","","pc-inference-note");u.body.append(ct);const Re=q("input");Re.
type="file",Re.setAttribute("aria-label","Pin a file locally"),u.body.append(Fr("Pin a file locally",Re));const qt=Ee("U\
nload local model");u.body.append(qt);const Ae=Ee("Clear conversation");u.body.append(Ae),u.body.append(q("p","Clear cha\
t history to start a new conversation while keeping the loaded model and stored files.","pc-inference-note")),h.body.append(
q("p","Load uses the files already on this device and replaces the current local model. Delete removes a model and unloa\
ds it if needed. Files used by other stored models or pinned separately are kept.","pc-inference-note"));const _=q("ul",
void 0,"pc-stored-models");_.setAttribute("aria-label","Stored model packages");const B=Ee("Refresh"),L=Ee("Stop loading");
L.hidden=!0,h.body.append(_,B,L);const W=q("div",void 0,"pc-inference-transcript");W.setAttribute("role","log"),W.setAttribute(
"aria-label","Conversation"),W.setAttribute("aria-live","polite");const F=q("p","Load a model or choose an available pee\
r to start chatting.","pc-chat-empty");W.append(F),e.append(W);const K=q("div",void 0,"pc-inference-actions");e.append(K);
const ke=q("div",void 0,"pc-chat-attachment");ke.hidden=!0;const _e=q("img");_e.alt="Selected image";const lt=q("span"),
It=Ee("×","Remove attached image");ke.append(_e,lt,It),e.append(ke);const Be=q("textarea");Be.rows=2,Be.maxLength=16e3,
Be.placeholder="Message…",Be.setAttribute("aria-label","Message"),e.append(Be);const We=q("select");We.setAttribute("a\
ria-label","Chat target");const ms=Ee("+","Attach image");ms.title="Attach an image";const Ir=q("input");Ir.type="file",
Ir.accept="image/png,image/jpeg,image/webp,image/gif",Ir.hidden=!0,Ir.setAttribute("aria-label","Choose image attachment");
const gs=Ee("Send"),An=Ee("Stop");An.hidden=!0;const Pi=q("div",void 0,"pc-chat-controls");return Pi.append(We,ms,Ir,gs,
An),e.append(Pi),e.append(k,x,A,g,y),r.append(e),{panel:e,sourceFilter:i,source:o,sourceStatus:V,sourceHelp:fe,discoveryStatus:ee,
acquire:a,stored:c,configure:l,sharing:me,hosting:we,status:$t,configuration:k,configurationStatus:u.status,storedModels:x,
storedList:_,storedRefresh:B,storedCancel:L,storedStatus:h.status,gpuLayers:nt,back:n,menu:s,menuWindow:y,menuStatus:m.status,
about:g,aboutButton:b,install:f,compatibility:A,helpModel:v,helpReason:E,helpBrowser:C,helpOs:I,helpDetails:R,helpCommandGroup:Q,
helpCommand:$,helpCopy:P,helpConfig:O,helpStatus:d.status,cpuBudget:ir,gpuBudget:J,memoryNote:xe,relay:_t,connect:Ar,networkStatus:ct,
file:Re,unload:qt,clearChat:Ae,transcript:W,empty:F,proposed:K,attachment:ke,attachmentImage:_e,attachmentName:lt,removeAttachment:It,
prompt:Be,target:We,attach:ms,imageFile:Ir,send:gs,cancel:An}}function SR(r,e){r.helpModel.textContent=e.name,r.helpReason.
textContent=e.reason,r.helpDetails.replaceChildren();for(const t of e.paragraphs)r.helpDetails.append(q("p",t,"pc-infere\
nce-note"));if(e.steps.length){const t=q("ol");for(const n of e.steps)t.append(q("li",n));r.helpDetails.append(t)}for(const t of e.
links){const n=q("a",t.label);n.href=t.url,n.target="_blank",n.rel="noopener noreferrer";const s=q("p",void 0,"pc-infere\
nce-note");s.append(n),r.helpDetails.append(s)}r.helpCommand.value=e.command??"",r.helpCommandGroup.hidden=!e.command,r.
helpConfig.hidden=!e.openConfig,r.helpStatus.textContent=""}function AR(r,e,t,n){r.storedList.replaceChildren(),e.length||
r.storedList.append(q("li","No models stored on this device.","pc-stored-empty"));for(const s of jy(e)){const i=q("li",void 0,
"pc-stored-model"),o=q("div");o.append(q("strong",s.name));const a=[js(s.totalBytes),...s.loaded?["Loaded"]:[],...s.shared?
["Shared"]:[],...s.cleanupPending?["Cleanup pending"]:[]];o.append(q("p",a.join(" · "),"pc-inference-note")),s.shareError&&
o.append(q("p",`Sharing unavailable: ${String(s.shareError).slice(0,256)}`,"pc-inference-note"));const c=["checking","un\
available"].includes(s.localAvailability?.status);c&&o.append(q("p",String(s.localAvailability.reason||"This model is un\
available on this device.").slice(0,512),"pc-inference-note"));const l=Ee(s.loaded?"Loaded":"Load",`${s.loaded?"Loaded":
"Load"} ${s.name}`);l.dataset.inactive=String(!!(s.loaded||s.cleanupPending||c||!n)),l.disabled=l.dataset.inactive==="tr\
ue",l.onclick=()=>n?.(s);const u=s.cleanupPending?"Retry delete":"Delete",h=Ee(u,`${u} ${s.name}`);h.className="pc-delet\
e-model";const d=q("div",void 0,"pc-stored-actions");d.append(l,h),h.onclick=()=>t(s),i.append(o,d),r.storedList.append(
i)}}function zp(r,e,t,{image:n,targetName:s}={}){r.empty.remove();const i=q("article",void 0,`pc-chat-message pc-chat-me\
ssage-${e}`);if(i.append(q("span",e==="user"?"YOU":s||"MODEL","pc-chat-speaker")),n){const a=q("img");a.src=n,a.alt="Att\
ached image",a.className="pc-chat-image",i.append(a)}const o=q("p",t);return i.append(o),r.transcript.append(i),o}const qp=Object.
freeze({chrome:"Google Chrome",chromium:"Chromium",edge:"Microsoft Edge",brave:"Brave",firefox:"Firefox",safari:"Safari",
other:"Other browser"}),jp=Object.freeze({linux:"Linux",windows:"Windows",macos:"macOS",android:"Android",ios:"iOS / iPa\
dOS",other:"Other operating system"}),Gp=Object.freeze({chrome:"google-chrome --enable-dawn-features=vulkan_enable_f16_o\
n_nvidia",chromium:"chromium --enable-dawn-features=vulkan_enable_f16_on_nvidia",edge:"microsoft-edge --enable-dawn-feat\
ures=vulkan_enable_f16_on_nvidia",brave:"brave-browser --enable-dawn-features=vulkan_enable_f16_on_nvidia"}),_R="https:/\
/www.chromium.org/developers/how-tos/run-chromium-with-flags/",IR="https://github.com/google/dawn/commit/8f96ae09bbaac54\
d52ca6f8aff8606ffdbe9de3f";function sn(r,e,t=""){return typeof r!="string"?t:r.slice(0,e).replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,
" ").trim()||t}function Wp(r,e){return typeof r=="string"&&Object.hasOwn(e,r)?r:"other"}function Gy(r=globalThis.navigator){
const e=r??{},t=sn(e.userAgent,4096),n=sn(e.userAgentData?.platform,80)||sn(e.platform,80),s=Array.isArray(e.userAgentData?.
brands)?e.userAgentData.brands.slice(0,16).map(a=>sn(a?.brand,80)).join(" "):"";let i="other";/iPhone|iPad|iPod|\biOS\b/i.
test(`${n} ${t}`)||/Mac/i.test(`${n} ${t}`)&&e.maxTouchPoints>1?i="ios":/Android/i.test(`${n} ${t}`)?i="android":/Windows|Win32|Win64/i.
test(n)?i="windows":/macOS|Mac/i.test(n)?i="macos":/Linux/i.test(n)?i="linux":/Windows/i.test(t)?i="windows":/Macintosh|Mac OS X/i.
test(t)?i="macos":/Linux|X11/i.test(t)&&(i="linux");let o="other";return/Brave/i.test(s)||/Brave\//i.test(t)||typeof e.brave?.
isBrave=="function"?o="brave":/Microsoft Edge/i.test(s)||/(?:Edg|EdgA|EdgiOS|Edge)\//i.test(t)?o="edge":/Firefox/i.test(
s)||/(?:Firefox|FxiOS)\//i.test(t)?o="firefox":/OPR\/|Opera|SamsungBrowser\/|Vivaldi\/|Electron\//i.test(t)?o="other":/Google Chrome/i.
test(s)||/CriOS\//i.test(t)?o="chrome":/Chromium\//i.test(t)?o="chromium":/Chrome\//i.test(t)?o="chrome":/Chromium/i.test(
s)?o="chromium":/Safari\//i.test(t)&&/Version\//i.test(t)&&(o="safari"),{browser:o,os:i}}function CR(r,{environment:e=Gy()}={}){
const t=r?.localAvailability??{},n=sn(t.code,100),s=Wp(e?.browser,qp),i=Wp(e?.os,jp),o={name:sn(r?.name,180,"Selected mo\
del"),reason:sn(t.reason,500,"Compatibility has not been fully verified."),environmentLabel:`${qp[s]} on ${jp[i]}`,paragraphs:[],
steps:[],command:null,commandLabel:"",links:[],openConfig:!1};return t.status==="checking"||n==="device_checking"?(o.paragraphs.
push("The browser capability check is still running. This does not mean the model is unsupported."),o.steps.push("Wait f\
or the check to finish. If it remains pending, reload the page and check again.")):n==="cpu_budget_exceeded"||n==="gpu_b\
udget_exceeded"?(o.openConfig=!0,o.paragraphs.push("The model reservation exceeds a configured memory budget. This budge\
t is an admission limit, not a measurement of free RAM or GPU memory."),o.steps.push("Open Config and review the RAM and\
 GPU memory budgets. Raise or clear an optional limit only when appropriate for your device.","A shared compute pool may\
 impose its own limit. Choose a smaller model or a peer-hosted model if that limit still applies.")):n==="gpu_feature_un\
available"&&/\bshader-f16\b/i.test(o.reason)?(o.paragraphs.push("This browser does not expose the shader-f16 feature req\
uired by this model runtime. GPU memory capacity alone does not establish FP16 support."),i==="linux"&&Object.hasOwn(Gp,
s)?(o.command=Gp[s],o.commandLabel="Optional Linux NVIDIA / Vulkan launch command",o.paragraphs.push("If this Linux mach\
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
nstructions",url:_R},{label:"Dawn NVIDIA FP16 driver restriction",url:IR})):n==="gpu_feature_unavailable"?(o.paragraphs.
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
model or a peer-hosted model if local loading fails.")),o}const TR=new Set(["image/png","image/jpeg","image/webp","image\
/gif"]);async function MR(r,{signal:e}={}){if(!r||!TR.has(r.type))throw new Error("Choose a PNG, JPEG, WebP or GIF image");
if(r.size>8*1024**2)throw new Error("Choose an image smaller than 8 MiB");e?.throwIfAborted();const t=await createImageBitmap(
r);try{if(e?.throwIfAborted(),!t.width||!t.height||t.width*t.height>32*1024**2)throw new Error("Choose an image smaller \
than 32 megapixels");const n=Math.min(1,512/Math.max(t.width,t.height)),s=document.createElement("canvas");s.width=Math.
max(1,Math.round(t.width*n)),s.height=Math.max(1,Math.round(t.height*n));const i=s.getContext("2d",{willReadFrequently:!0});
if(!i)throw new Error("Image decoding is unavailable");i.drawImage(t,0,0,s.width,s.height);const o=i.getImageData(0,0,s.
width,s.height),a=document.createElement("canvas"),c=Math.min(1,96/Math.max(s.width,s.height));return a.width=Math.max(1,
Math.round(s.width*c)),a.height=Math.max(1,Math.round(s.height*c)),a.getContext("2d").drawImage(s,0,0,a.width,a.height),
{name:r.name.slice(0,160),preview:a.toDataURL("image/webp",.8),image:{data:new Uint8Array(o.data),width:s.width,height:s.
height,channels:4}}}finally{t.close()}}const Vp=1024*1024,RR=6,BR=24*1024*1024,Hp=r=>{if(r?.aborted)throw new DOMException(
"Image generation cancelled","AbortError")};function LR(r){const e=new Map;let t=0,n=!1;function s(o,{expired:a=!1}={}){
const c=e.get(o);if(c)if(URL.revokeObjectURL(c.url),t-=c.bytes,e.delete(o),a&&r.contains(o)){const l=document.createElement(
"p");l.className="pc-inference-note",l.textContent="Earlier image preview released.",o.replaceWith(l)}else o.removeAttribute(
"src")}function i(){for(const o of e.keys())r.contains(o)||s(o);for(;e.size>RR||t>BR;)s(e.keys().next().value,{expired:!0})}
return{async append(o,a,{signal:c,prompt:l=""}={}){if(Hp(c),n)throw new Error("Conversation image renderer is closed");const{
width:u,height:h,channels:d,data:p}=a??{};if(!Number.isSafeInteger(u)||!Number.isSafeInteger(h)||u<1||h<1||u*h>Vp||d!==4||
!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||p.byteLength!==u*h*4)throw new Error("Generated image must c\
ontain bounded RGBA pixels");const m=new OffscreenCanvas(u,h),y=m.getContext("2d");if(!y)throw new Error("Image preview \
encoding is unavailable");y.putImageData(new ImageData(new Uint8ClampedArray(p),u,h),0,0);const b=await m.convertToBlob(
{type:"image/png"});if(Hp(c),n||!r.contains(o))throw new DOMException("Conversation closed","AbortError");if(b.type!=="i\
mage/png"||b.size>Vp*4+65536)throw new Error("Generated image preview exceeds its byte budget");const f=document.createElement(
"img");f.className="pc-generated-image",f.width=u,f.height=h,f.alt=l?`Generated image: ${l.slice(0,160)}`:"Generated ima\
ge";const g=URL.createObjectURL(b);return f.src=g,e.set(f,{url:g,bytes:b.size}),t+=b.size,o.after(f),i(),f},prune:i,dispose(){
n=!0;for(const o of e.keys())s(o)}}}async function DR({container:r=document.body,stateManager:e,computeManager:t,networkManager:n,
getContext:s,actions:i,runtimeBaseUrl:o,onClose:a,autoConnect:c=!1,runtimeFactory:l=ER,refreshIntervalMs:u=5e3,pwaInstallController:h}={}){
const d=vR(r),p=LR(d.transcript),m=new TextEncoder,y=new Map,b=new Set;let f,g,w,k,x,A,v=!1,E=!1,C=!1,I,M,R,$,P,O,Q,H,V=!1,
fe,ee=[],me=[],we,ge,ht=0,at,$t,nt,sr,ir;const J=()=>!E&&!C,xe=T=>["checking","unavailable"].includes(T?.localAvailability?.
status),At=T=>T.source==="hf"?"Hugging Face":T.source==="stored"?"Stored on this device":"Peers",_t=T=>String(T?.localAvailability?.
reason||(T?.localAvailability?.status==="checking"?"Checking this device…":"Unavailable on this device.")).slice(0,512),
Ar=T=>{const D=U=>Number.isFinite(U)&&U>0&&U<=1099511627776?`${Number((U/1073741824).toFixed(1))} GiB`:"unknown";return`\
est. RAM ${D(T?.localAvailability?.cpuBytes)} / GPU ${D(T?.localAvailability?.gpuBytes)}`},_r=()=>me.find(T=>T.key===d.target.
value),ct=()=>{i?.invalidate?.(),d.proposed.replaceChildren()},Re=T=>{if(!J())return;const D=(T.name==="AbortError"?"Can\
celled: ":"Error: ")+T.message+(/context budget/i.test(T.message)?". Use Config → Clear conversation to start again, or \
shorten the prompt.":"");d.status.textContent=D,d.configuration.open&&(d.configurationStatus.textContent=D),d.storedModels.
open&&(d.storedStatus.textContent=D)},qt=()=>{for(;d.transcript.children.length>24||m.encode(d.transcript.textContent).byteLength>
128*1024;)d.transcript.firstElementChild?.remove();p.prune(),d.transcript.scrollTop=d.transcript.scrollHeight};function Ae(){
const T=_r(),D=ee.find(U=>U.key===d.source.value);d.prompt.placeholder=T?.task==="text-to-image"?"Describe an image…":
"Message…",d.acquire.disabled=!!g||!D||xe(D),d.source.disabled=!!g,d.sourceFilter.disabled=!!g,d.sourceHelp.disabled=!!g,
d.cpuBudget.disabled=d.gpuBudget.disabled=!!g||!f?.setMemoryBudgets,d.send.disabled=!!g||v||!T?.available||!d.prompt.value.
trim()&&!x,d.cancel.hidden=!g,d.target.disabled=!!g,d.attach.disabled=!!g||!T?.modalities?.includes("image"),d.unload.disabled=
!!g,d.clearChat.disabled=!!g,d.storedRefresh.disabled=!!g||!!H;for(const U of d.storedList.querySelectorAll("button"))U.
disabled=!!g||!!H||U.dataset.inactive==="true";d.storedCancel.hidden=!g||!V}function _(){const T=d.source.value,D=d.sourceFilter.
value.trim().toLowerCase().split(/\s+/).filter(Boolean),U=jy(ee).filter(N=>{const Y=[N.name,N.modelId,N.task,N.runtime,N.
source,At(N),N.source==="stored"?"local":"",N.task==="text-to-image"?"Image generation":""].join(" ").toLowerCase();return D.
every(ft=>Y.includes(ft))});we||(we=f.getPreferredModelSourceKey?.()??ee.find(N=>N.modelId==="smolvlm-256m-q4"&&N.source===
"hf")?.key??ee.find(N=>!xe(N))?.key??ee[0]?.key),d.source.replaceChildren();for(const N of U){const Y=document.createElement(
"option");Y.value=N.key,Y.textContent=String(N.name).slice(0,140)+(N.task==="text-to-image"?" · Image generation":"")+"\
 · "+At(N)+" · "+js(N.totalBytes)+" package · "+Ar(N)+(xe(N)?" · Setup required — select for help":""),Y.dataset.unavailable=
String(xe(N)),d.source.append(Y)}if(U.length){const N=U.find(Y=>Y.key===we)??U.find(Y=>Y.key===T)??U.find(Y=>!xe(Y))??U[0];
if(xe(N)&&!(f.getPreferredModelSourceKey&&N.key===we)){const Y=document.createElement("option");Y.value="",Y.disabled=!0,
Y.textContent="Choose a model — select unavailable models for help",d.source.prepend(Y),d.source.value=""}else d.source.
value=N.key}else{const N=document.createElement("option");N.value="",N.disabled=!0,N.textContent="No matching models",d.
source.append(N),d.source.value=""}W(U),Ae()}function B(){ge&&(ht++,SR(d,CR(ge,{environment:{browser:d.helpBrowser.value,
os:d.helpOs.value}})))}function L(T){if(!J()||g)return;ge=T;const D=Gy();d.helpBrowser.value=D.browser,d.helpOs.value=D.
os,B(),d.menuWindow.close(),d.configuration.close(),d.storedModels.close(),d.about.close(),d.compatibility.open||d.compatibility.
showModal()}function W(T){const D=ee.find(Y=>Y.key===d.source.value),U=T.filter(xe),N=D?[Ar(D)+". Planning estimates; ac\
tual memory use varies."]:[];if(T.length?D?.localAvailability?.reason&&!xe(D)&&N.push(String(D.localAvailability.reason).
slice(0,512)):N.push("No matching models. Clear or change the filter."),U.length){const Y=new Map;for(const ft of U){const Ct=_t(
ft),jt=Y.get(Ct)??[];jt.push(String(ft.name).slice(0,140)),Y.set(Ct,jt)}N.push([...Y].map(([ft,Ct])=>`${Ct.join(", ")}: ${ft}`).
join(" "))}d.sourceStatus.textContent=N.join(" "),d.sourceStatus.hidden=!N.length,d.sourceHelp.hidden=!D||!xe(D)}function F(){
const T=d.target.value||"local",D=me.find(N=>N.key===T),U=d.target.selectedOptions[0]?.textContent;ee=f.listModelSources(),
me=f.listInferenceTargets(),_(),d.target.replaceChildren();for(const N of me){const Y=document.createElement("option");Y.
value=N.key,Y.textContent=(N.local?"Local · ":"Peers · ")+String(N.name).slice(0,140)+(N.task==="text-to-image"?" · Im\
age generation":"")+(N.busy?" (busy)":N.available?"":" (unavailable)"),d.target.append(Y)}if(!me.some(N=>N.key===T)&&T!==
"local"&&U){const N=document.createElement("option");N.value=T,N.disabled=!0,N.textContent=(D?.name??U.replace(/ \(unavailable\)$/,
""))+" (unavailable)",d.target.append(N)}d.target.value=T,!d.target.value&&me.some(N=>N.key==="local")&&(d.target.value=
"local"),Ae()}function K(T){if(!f)return;const D=f.getDiscoveryStatus?.(),U=D?.connected??f.networkReady;U&&(O=null);const Y=[
U?`Peer network connected${Number.isSafeInteger(D?.peerCount)?` · ${D.peerCount} peers`:""} · ${D?.sharedModelCount??ee.
filter(jt=>jt.source==="peers").length} shared models · ${D?.hostedModelCount??me.filter(jt=>!jt.local&&jt.available).length}\
 hosted models.`:$&&!$.signal.aborted?"Connecting to peer network…":"Peer network is offline."],ft=T?.message??O?.message??
D?.errors?.[0]?.message;ft?Y.push("Discovery issue: "+String(ft).slice(0,256)):U&&D?.peerCount===0?Y.push("Waiting for o\
ther peers."):U&&D?.hostedModelCount===0&&Y.push("No peer is currently advertising a loaded model for inference.");const Ct=f.
getArtifactNetworkStatus?.();Ct?.status==="starting"&&Y.push("File sharing is preparing stored models. Inference discove\
ry remains available."),Ct?.status==="error"&&Y.push("File sharing unavailable: "+String(Ct.error??"Initialization faile\
d").slice(0,256)),d.discoveryStatus.textContent=d.networkStatus.textContent=Y.join(" ")}function ke(){const T=f.getMemoryBudgets?.()??
{};d.cpuBudget.value=T.cpuBytes==null?"":String(T.cpuBytes/1024**3),d.gpuBudget.value=T.gpuBytes==null?"":String(T.gpuBytes/
1024**3);const D=f.getDeviceCapabilities?.()?.deviceMemoryGiB;d.memoryNote.textContent=(Number.isFinite(D)&&D>0?`Browser\
-reported RAM: approximately ${D} GiB. `:"")+"Optional estimates for future model loads. Leave blank for automatic check\
s. Your browser cannot report free GPU memory. Storage and loaded models are unchanged."}function _e(){if(!(!J()||g||!f.
setMemoryBudgets))try{const T=[d.cpuBudget,d.gpuBudget].map(D=>{D.setCustomValidity(""),D.removeAttribute("aria-invalid");
const U=D.value.trim(),N=U?Math.round(Number(U)*1024**3):null;if(D.validity.badInput||U&&(!Number.isFinite(Number(U))||Number(
U)<=0||Number(U)>1024||!Number.isSafeInteger(N)||N<1)){const Y="Enter a memory budget above 0 and at most 1024 GiB, or l\
eave it blank.";throw D.setCustomValidity(Y),D.setAttribute("aria-invalid","true"),new Error(Y)}return N});f.setMemoryBudgets(
{cpuBytes:T[0],gpuBytes:T[1]}),ke(),ee=f.listModelSources(),_(),d.configurationStatus.textContent="Memory budgets update\
d for future loads."}catch(T){Re(T)}}async function lt(){if(!J()||M)return M;const T=new AbortController;return R=T,M=(async()=>{
try{await f.refreshPeers({signal:T.signal}),J()&&(CSS.supports("selector(:open)")&&(d.source.matches(":open")||d.target.
matches(":open"))||F(),K())}catch(D){J()&&!T.signal.aborted&&K(D)}finally{M=null,R=null}})(),M}const It=T=>{if(!J())return;
let D;if(T.stage==="import"?(D="Downloading "+(T.index+1)+"/"+T.total+": "+T.path,Number.isSafeInteger(T.loaded)&&Number.
isSafeInteger(T.totalBytes)&&T.loaded>=0&&T.totalBytes>0&&(D+=` · ${js(T.loaded)} / ${js(T.totalBytes)}`)):T.type==="mo\
del-load"?D="Loading model: "+(T.stage||T.status||"initializing GPU")+(T.file?" · "+T.file:""):D={prepare:"Preparing mo\
del…",verify:"Verifying stored model files…","download-peers":"Fetching and verifying model files from peers…",unload:"\
Releasing the previous model…",load:"Loading model into RAM and GPU memory…"}[T.stage],!D)return;const U=`${T.type??
""}:${T.stage??T.status??""}:${T.path??T.file??""}`;U!==nt&&(nt=U,sr=performance.now()),$t=String(D).slice(0,512),d.status.
textContent=$t,V&&d.storedModels.open&&(d.storedStatus.textContent=$t),at||(at=setInterval(()=>{J()&&g&&!g.signal.aborted&&
(d.status.textContent=`${$t} (${Math.floor((performance.now()-sr)/1e3)}s)`,V&&d.storedModels.open&&(d.storedStatus.textContent=
d.status.textContent))},1e3))};async function Be(T){if(!J()||g)return;const D=new AbortController;g=D,Ae(),w=(async()=>{
try{await T(D.signal)}catch(U){Re(U)}finally{clearInterval(at),at=null,nt=null,g===D&&(g=null),J()&&(F(),qt())}})(),await w}
async function We(){if(!J()||Q)return Q;const T=new AbortController;return H=T,d.storedStatus.textContent="Reading store\
d models…",Ae(),Q=(async()=>{try{const D=await f.listStoredModels({signal:T.signal});return J()&&(AR(d,D,ms,f.loadStoredModel?
Ir:void 0),d.storedStatus.textContent=`${D.length} model${D.length===1?"":"s"} stored.`),!0}catch(D){return Re(D),!1}finally{
Q=null,H=null,J()&&Ae()}})(),Q}function ms(T){return Be(async D=>{d.storedStatus.textContent=`Deleting ${T.name}…`;let U;
try{U=await f.deleteStoredModel(T.manifestCid,{signal:D})}catch(N){throw await We(),N}if(U.unloaded&&(y.delete("local"),
ct()),await We()){const N=U.deleted?`Deleted ${T.name}.`:"This model is no longer stored.";d.storedStatus.textContent=N+
(U.freedBytes>0?` Freed ${js(U.freedBytes)}.`:""),d.status.textContent=N}})}async function Ir(T){if(!J()||g||H||T.loaded||
T.cleanupPending)return;if(xe(T)){L(T);return}V=!0;let D=!1;try{await Be(async U=>{ct(),It({stage:"verify"});try{await f.
loadStoredModel(T.manifestCid,{signal:U,onProgress:N=>{U.aborted||It(N)},ggufGpuLayers:Number(d.gpuLayers.value)})}catch(N){
throw await We(),N}U.throwIfAborted(),y.delete("local"),we=f.getPreferredModelSourceKey?.()??we,F(),d.target.value="loca\
l",await We(),d.status.textContent=d.storedStatus.textContent=`Loaded ${T.name}. Send a message.`,D=!0})}finally{V=!1,J()&&
(Ae(),D&&(d.storedModels.close(),d.prompt.focus()))}}function gs(){x=null,d.attachment.hidden=!0,d.attachmentImage.removeAttribute(
"src"),d.imageFile.value="",Ae()}try{f=await l({stateManager:e,computeManager:t,networkManager:n,runtimeBaseUrl:o});const T=f.
getPreferences();d.sharing.checked=T.sharing,d.hosting.checked=T.hostInference,ke(),F(),d.status.textContent="Ready."}catch(T){
throw d.panel.remove(),T}d.configure.onclick=()=>{J()&&(d.menuWindow.close(),d.about.close(),d.compatibility.close(),d.storedModels.
close(),d.configurationStatus.textContent="",d.configuration.showModal())},d.stored.onclick=()=>{J()&&(d.menuWindow.close(),
d.about.close(),d.compatibility.close(),d.configuration.close(),d.storedModels.showModal(),We())},d.menu.onclick=()=>{J()&&
(d.about.close(),d.compatibility.close(),d.configuration.close(),d.storedModels.close(),d.menuWindow.showModal())},d.aboutButton.
onclick=()=>{J()&&(d.menuWindow.close(),d.about.showModal())};for(const T of[d.menuWindow,d.configuration,d.storedModels,
d.about])T.addEventListener("close",()=>{J()&&![d.menuWindow,d.configuration,d.storedModels,d.about,d.compatibility].some(
D=>D.open)&&document.activeElement!==d.prompt&&d.menu.focus()});if(h){const T=(D=h.getState())=>{J()&&(d.install.hidden=
!1,d.install.disabled=D.installed||D.installing,d.install.textContent=D.installed?"Installed":D.installing?"Installing…":
"Install",d.menuStatus.textContent=String(D.instructions??"").slice(0,512))};T(),ir=h.subscribe?.(T),d.install.onclick=async()=>{
if(!(!J()||d.install.disabled))try{const D=await h.install();J()&&(T(),D.instructions&&(d.menuStatus.textContent=String(
D.instructions).slice(0,512)))}catch(D){J()&&(d.menuStatus.textContent="Installation unavailable: "+String(D.message).slice(
0,256))}}}d.storedRefresh.onclick=()=>{We()},d.sourceFilter.oninput=_,d.sourceHelp.onclick=()=>{const T=ee.find(D=>D.key===
d.source.value);T&&xe(T)&&L(T)},d.source.onchange=()=>{if(!J()||g)return;const T=d.source.value;ee=f.listModelSources();
const D=ee.find(U=>U.key===T);D&&xe(D)?(_(),L(D)):(we=T,_())},d.helpBrowser.onchange=d.helpOs.onchange=B,d.helpConfig.onclick=
()=>d.configure.click(),d.compatibility.addEventListener("close",()=>{ht++,J()&&!d.configuration.open&&!d.storedModels.open&&
!d.about.open&&!d.menuWindow.open&&d.source.focus()}),d.helpCopy.onclick=async()=>{const T=d.helpCommand.value;if(!T||!J())
return;const D=++ht,U=()=>J()&&d.compatibility.open&&ht===D;try{await navigator.clipboard.writeText(T),U()&&(d.helpStatus.
textContent="Command copied.")}catch{U()&&(d.helpCommand.focus(),d.helpCommand.select(),d.helpStatus.textContent="Clipbo\
ard unavailable. Select and copy the command above.")}},d.cpuBudget.onchange=d.gpuBudget.onchange=_e,d.target.onchange=()=>{
ct(),Ae()},d.prompt.oninput=Ae;for(const[T,D]of[[d.sharing,"setSharing"],[d.hosting,"setHostInference"]])T.onchange=()=>{
if(!J())return;const U=T.checked;T.disabled=!0;const N=(async()=>{try{await f[D](U),J()&&(d.configurationStatus.textContent=
"Preferences updated.")}catch(Y){T.checked=!U,Re(Y)}finally{J()&&(T.disabled=!1)}})();b.add(N),N.finally(()=>b.delete(N))};
d.acquire.onclick=()=>{if(!J()||g)return;const T=d.source.value;ee=f.listModelSources();const D=ee.find(U=>U.key===T);if(!D||
xe(D)){_(),D&&L(D);return}return Be(async U=>{ct(),It({stage:"prepare"}),await f.acquireModel(T,{signal:U,onProgress:N=>{
U.aborted||It(N)},ggufGpuLayers:Number(d.gpuLayers.value)}),U.throwIfAborted(),y.delete("local"),F(),d.target.value="loc\
al",Ae(),d.status.textContent=f.getSharingErrors?.().length?"Model ready. Sharing is unavailable for some stored models;\
 see Stored Models.":"Model ready. Send a message."})},d.unload.onclick=()=>Be(async()=>{ct(),await f.unload(),y.delete(
"local"),d.status.textContent="Local model unloaded.",d.configurationStatus.textContent=d.status.textContent}),d.clearChat.
onclick=()=>{!J()||g||(y.clear(),ct(),d.transcript.replaceChildren(d.empty),p.prune(),d.status.textContent=d.configurationStatus.
textContent="Conversation cleared. Ready for a new message.")},d.connect.onclick=()=>Be(async T=>{d.relay.value.trim()?await f.
connect(d.relay.value.trim(),{signal:T}):await f.connectBackend({signal:T}),await lt()}),d.file.onchange=()=>Be(async T=>{
const D=d.file.files[0];D&&(await f.store.importFile(D.stream(),{expectedSize:D.size,pin:!0,signal:T}),d.status.textContent=
"Pinned "+D.name+" locally.",d.file.value="")}),d.attach.onclick=()=>d.imageFile.click(),d.imageFile.onchange=async()=>{
A?.abort();const T=new AbortController;A=T;const D=d.imageFile.files[0];if(D){v=!0,Ae();try{const U=await MR(D,{signal:T.
signal});if(!J()||T.signal.aborted)return;x=U,d.attachmentImage.src=U.preview,d.attachmentName.textContent=U.name,d.attachment.
hidden=!1,Ae(),d.prompt.focus()}catch(U){T.signal.aborted||Re(U)}finally{A===T&&(v=!1,J()&&Ae())}}},d.removeAttachment.onclick=
()=>{A?.abort(),gs()},d.cancel.onclick=()=>{g?.abort(new DOMException("User cancelled","AbortError")),k&&f.cancel(k).catch(
Re)},d.storedCancel.onclick=()=>d.cancel.click();async function An(){d.send.disabled||await Be(async T=>{const D=_r(),U=D.
key,N=D.task==="text-to-image",Y=d.prompt.value.trim(),ft=x;if(ft&&!D.modalities?.includes("image"))throw new Error("Thi\
s model accepts text only. Remove the image or choose an image model.");ct();const Ct=N?null:await s?.({includeImage:!1}),
jt=(typeof Ct=="string"?Ct:Ct?.text??"").slice(0,16e3),Nd=N?"":String(i?.instructions??"").slice(0,8e3),_n=y.get(U)??[],
Ud=Y||"Describe this image.",Wy=N?void 0:[...jt||Nd?[{role:"system",content:jt+`
`+Nd}]:[],..._n.slice(-6),{role:"user",content:Ud}];zp(d,"user",Y,{image:ft?.preview});const In=zp(d,"assistant","",{targetName:D.
name});d.prompt.value="",gs(),qt(),k=crypto.randomUUID(),d.status.textContent=D.local?N?"Generating image…":"Generatin\
g…":"Waiting for peer…";try{const Nt=await f.generate(U,{requestId:k,signal:T,...N?{prompt:Y}:{messages:Wy,image:ft?.
image,maxNewTokens:1024},onProgress(ve){J()&&N&&Number.isSafeInteger(ve.step)&&Number.isSafeInteger(ve.steps)&&ve.step>=
0&&ve.step<=ve.steps&&ve.steps<=100&&(d.status.textContent=`Generating image: ${ve.step}/${ve.steps} steps…`)},onToken(ve){
J()&&!N&&(In.textContent+=ve,qt())}});if(T.aborted)throw new DOMException("Generation cancelled","AbortError");if(N){if(!D.
outputModalities?.includes("image"))throw new Error("This target did not advertise image output");await p.append(In,Nt.image,
{signal:T,prompt:Y})}else{if(typeof Nt.text!="string")throw new Error("Model returned an invalid text response");for(In.
textContent=Nt.text,_n.push({role:"user",content:Ud},{role:"assistant",content:Nt.text});_n.length>6||m.encode(JSON.stringify(
_n)).byteLength>24*1024;)_n.splice(0,2);y.delete(U),y.set(U,_n),y.size>8&&y.delete(y.keys().next().value)}if(d.status.textContent=
"Ready.",!N){const ve=[];if(Nt.finishReason==="length"?ve.push("Response reached the model’s output or context limit and\
 may be incomplete."):Nt.finishReason!=="stop"&&ve.push("The model did not report whether this response is complete."),Nt.
contextTruncated&&ve.push("Older conversation turns were omitted to fit the model’s context."),ve.length){const or=document.
createElement("p");or.className="pc-inference-note",or.textContent=ve.join(" "),In.after(or),d.status.textContent=ve.join(
" ")}}try{for(const ve of(N?[]:i?.propose(Nt.text)??[]).slice(0,4)){const or=document.createElement("button");or.type="b\
utton",or.textContent="Apply: "+ve.label,or.onclick=async()=>{or.disabled=!0;try{await ve.apply()}catch(Vy){Re(Vy)}},d.proposed.
append(or)}}catch{}}catch(Nt){throw In.textContent||(In.textContent=Nt.name==="AbortError"?"Cancelled.":"Request failed."),
Nt}finally{k=null,qt()}})}d.send.onclick=()=>{An()},d.prompt.onkeydown=T=>{T.key==="Enter"&&!T.shiftKey&&!T.isComposing&&
(T.preventDefault(),An())};try{const T=f.getStartupModel?.();T&&(we=T.sourceKey,_(),xe(T)?d.status.textContent=`Cannot l\
oad ${T.name}: ${_t(T)}`:Be(async D=>{It({stage:T.manifestCid?"verify":"prepare"});const U={signal:D,onProgress:N=>{D.aborted||
It(N)},ggufGpuLayers:Number(d.gpuLayers.value)};T.manifestCid?await f.loadStoredModel(T.manifestCid,U):await f.acquireModel(
T.sourceKey,U),D.throwIfAborted(),y.delete("local"),F(),d.status.textContent=`Loaded ${T.name}. Send a message.`}))}catch(T){
Re(T)}if(fe=setInterval(()=>{lt()},Math.max(20,u)),c&&!f.networkReady){const T=new AbortController;$=T,P=f.connectBackend(
{signal:T.signal}).then(()=>lt()).catch(D=>{J()&&!T.signal.aborted&&(O=D)}).finally(()=>{$===T&&($=null),J()&&K()})}else
lt();async function Pi(){if(clearInterval(at),at=null,!E){if(I)return I;C=!0,ir?.(),p.dispose(),d.menuWindow.close(),d.compatibility.
close(),d.storedModels.close(),d.configuration.close(),d.about.close(),d.panel.inert=!0,I=(async()=>{clearInterval(fe),g?.
abort("Chat closed"),A?.abort(),R?.abort(),$?.abort(),H?.abort(),ct(),await w,await M,await P,await Q,await Promise.allSettled(
[...b]),await f.dispose(),E=!0,y.clear(),x=null,d.panel.remove(),a?.()})();try{await I}finally{I=null}}}return{element:d.
panel,runtime:f,dispose:Pi,refreshPeers:lt}}function PR({scope:r=globalThis,onChange:e}={}){const t=new Set(e?[e]:[]),n=r.
matchMedia?.("(display-mode: standalone)");let s=n?.matches===!0||r.navigator?.standalone===!0,i=null,o=!1,a=!1;const c=r.
isSecureContext===!0,l="onbeforeinstallprompt"in r,u=()=>s?"PeerCompute is installed on this device.":c?/iPad|iPhone|iPod/.
test(r.navigator?.userAgent??"")?"In Safari, open Share, then Add to Home Screen. The app shell can open offline; models\
 remain managed by the browser’s storage.":"Use your browser’s Install app or Add to Home Screen menu, if available. T\
he app shell can open offline; downloading models and peer connections need a network.":"Open this console over HTTPS to\
 install it.",h=()=>Object.freeze({supported:c&&l,available:c&&!!i&&!s&&!o&&!a,installed:s,installing:o,instructions:u()}),
d=()=>{if(a)return;const b=h();for(const f of t)try{f(b)}catch{}},p=b=>{!c||s||a||typeof b.prompt!="function"||(b.preventDefault(),
i=b,d())},m=()=>{s=!0,i=null,o=!1,d()},y=()=>{s=n?.matches===!0||r.navigator?.standalone===!0,d()};return r.addEventListener?.(
"beforeinstallprompt",p),r.addEventListener?.("appinstalled",m),n?.addEventListener?.("change",y),Object.freeze({getState:h,
subscribe(b){if(typeof b!="function")throw new TypeError("Install listener must be a function");return a?()=>{}:(t.add(b),
b(h()),()=>t.delete(b))},async install(){if(s)return{outcome:"installed"};if(!i||o||a||!c)return{outcome:"unavailable",instructions:u()};
const b=i;i=null,o=!0,d();try{const f=await b.prompt();return{outcome:(b.userChoice?await b.userChoice:f)?.outcome==="ac\
cepted"?"accepted":"dismissed"}}finally{o=!1,d()}},dispose(){a||(a=!0,i=null,t.clear(),r.removeEventListener?.("beforein\
stallprompt",p),r.removeEventListener?.("appinstalled",m),n?.removeEventListener?.("change",y))}})}async function $R({scope:r=globalThis}={}){
if(!r.isSecureContext||!r.navigator?.serviceWorker)return null;const e=new URL("./",r.location.href),t=new URL("pages-is\
olation-sw.js",e).href,n=r.navigator.serviceWorker;return n.controller&&n.controller.scriptURL!==t?null:n.register(t,{scope:e.
href,type:"module",updateViaCache:"none"})}const $d=PR();window.inferencePwa=$d;$R().catch(()=>{});window.addEventListener(
"pagehide",r=>{r.persisted||$d.dispose()});async function NR(){try{window.inferencePanel=await DR({container:document.querySelector(
"#panel"),autoConnect:!0,pwaInstallController:$d})}catch(r){const e=document.createElement("p");e.textContent=r.message,
document.querySelector("#panel").append(e)}}NR();const LL=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,
{value:"Module"}));export{c3 as $,VB as A,Ip as B,yL as C,iL as D,oL as E,i3 as F,MA as G,sL as H,kM as I,_3 as J,mt as K,C3 as L,ZB as M,rL as N,
tr as O,tb as P,kL as Q,wL as R,tL as S,fL as T,Xr as U,uL as V,hL as W,nL as X,XB as Y,JM as Z,y3 as _,ga as a,cL as a0,
Ny as a1,aL as a2,mL as a3,bL as a4,gL as a5,HB as a6,YB as a7,vL as a8,pL as a9,dM as aA,RA as aB,vg as aC,_i as aD,vB as aE,
xb as aF,f3 as aG,uR as aH,HR as aI,Vn as aJ,_h as aK,Ue as aL,_L as aM,IL as aN,CL as aO,BL as aP,TL as aQ,zy as aR,RL as aS,
ML as aT,cR as aU,LL as aV,KB as aa,lL as ab,SL as ac,Kb as ad,rM as ae,tM as af,qs as ag,Zn as ah,Ye as ai,le as aj,ec as ak,
Pd as al,fu as am,AL as an,Ka as ao,Ja as ap,Xa as aq,ma as ar,ZM as as,ol as at,jB as au,zB as av,OB as aw,Pt as ax,a3 as ay,
JB as az,Ur as b,$y as c,Vb as d,wM as e,eL as f,EM as g,xL as h,EL as i,qM as j,Za as k,GM as l,LT as m,Di as n,_p as o,
Lt as p,FB as q,Hb as r,qB as s,GB as t,MT as u,WB as v,QB as w,XT as x,UB as y,gn as z};
