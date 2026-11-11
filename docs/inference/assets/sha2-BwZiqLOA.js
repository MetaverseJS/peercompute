const H=e=>e/4294967296|0,L=e=>e>>>0;function O(e,t,s,n){const o=H(s),r=L(s);e.setUint32(t,n?r:o,n),e.setUint32(t+4,n?o:
r,n)}function E(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"&&"BYTES_PER_\
ELEMENT"in e&&e.BYTES_PER_ELEMENT===1}const U=e=>e?`"${e}" `:"";function g(e,t,s=""){if(E(e)&&t===void 0)return e;const n=E(
e),o="",r=n?`length=${e.length}`:`type=${typeof e}`,c=U(s)+"expected Uint8Array"+o+", got "+r;throw n?new RangeError(c):
new TypeError(c)}const j=(e,t)=>{if(e===null||typeof e!="object"||Array.isArray(e))throw new TypeError((t==="object"?"":
`"${t}" `)+"expected object, got type="+typeof e)},A=(e,t)=>{j(e,t);const s=Object.getPrototypeOf(e);if(s!==Object.prototype&&
s!==null)throw new TypeError(`"${t}" expected plain object`);if(Object.hasOwn(e,"__proto__"))throw new TypeError(`"${t}.\
__proto__" is not allowed`)};function m(e,t=!0){if(e.destroyed)throw new Error("hash was destroyed");if(t&&e.finished)throw new Error(
"digest() was already called")}function B(e,t){g(e,void 0,"output");const s=t.outputLen;if(!(e.length>=s))throw new RangeError(
'"output" expected length >= '+s)}function _(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function y(e){return new DataView(
e.buffer,e.byteOffset,e.byteLength)}function a(e,t){return e<<32-t|e>>>t}const T=typeof Uint8Array.from([]).toHex=="func\
tion"&&typeof Uint8Array.fromHex=="function",F=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function W(e){
if(g(e),T)return e.toHex();let t="";for(let s=0;s<e.length;s++)t+=F[e[s]];return t}function S(e,t,s="opts"){return A(e,"\
defaults"),t!==void 0&&A(t,s),Object.assign(Object.create(null),e,t)}function C(e,t={}){if(typeof e!="function")throw new TypeError(
'"hashCons" expected function, got type='+typeof e);t=S({},t,"info");const s=(o,r)=>e(r).update(o).digest(),n=e(void 0);
return s.outputLen=n.outputLen,s.blockLen=n.blockLen,s.canXOF=n.canXOF,s.create=o=>e(o),Object.assign(s,t),Object.freeze(
s)}const D=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});function k(e,t,s){return e&t^~e&s}function M(e,t,s){
return e&t^e&s^t&s}class G{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(t,s,n,o){
this.blockLen=t,this.outputLen=s,this.padOffset=n,this.isLE=o,this.buffer=new Uint8Array(t),this.view=y(this.buffer)}update(t){
m(this),g(t);const{view:s,buffer:n,blockLen:o}=this,r=t.length;let c=!1;for(let i=0;i<r;){const h=Math.min(o-this.pos,r-
i);if(h===o){const x=y(t);for(;o<=r-i;i+=o)this.process(x,i);c=!0;continue}n.set(i===0&&h===r?t:t.subarray(i,i+h),this.pos),
this.pos+=h,i+=h,this.pos===o&&(this.process(s,0),this.pos=0,c=!0)}return this.length+=t.length,c&&this.roundClean(),this}digestInto(t){
m(this),B(t,this),this.finished=!0;const{buffer:s,view:n,blockLen:o,isLE:r}=this;let{pos:c}=this;s[c++]=128,s.fill(0,c),
this.padOffset>o-c&&(this.process(n,0),s.fill(0)),O(n,o-8,this.length*8,r),this.process(n,0),this.roundClean();const i=t===
s?n:y(t),h=this.outputLen,x=h/4,u=this.get();if(h%4||x>u.length)throw new Error("invalid outputLen");for(let f=0;f<x;f++)
i.setUint32(4*f,u[f],r)}digest(){const{buffer:t,outputLen:s}=this;this.digestInto(t);const n=t.slice(0,s);return this.destroy(),
n}_cloneIntoMeta(t){const{buffer:s,length:n,finished:o,destroyed:r,pos:c}=this;return t.destroyed=r,t.finished=o,t.length=
n,t.pos=c,c&&t.buffer.set(s),t}clone(){return this._cloneInto()}}const N=Uint32Array.from([1779033703,3144134277,1013904242,
2773480762,1359893119,2600822924,528734635,1541459225]),$=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,
961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,
3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,
3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,
2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,
958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),d=new Uint32Array(64);class R extends G{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(t,s){super(64,t,8,!1),this.
A=s[0]|0,this.B=s[1]|0,this.C=s[2]|0,this.D=s[3]|0,this.E=s[4]|0,this.F=s[5]|0,this.G=s[6]|0,this.H=s[7]|0}get(){const{A:t,
B:s,C:n,D:o,E:r,F:c,G:i,H:h}=this;return[t,s,n,o,r,c,i,h]}set(t,s,n,o,r,c,i,h){this.A=t|0,this.B=s|0,this.C=n|0,this.D=o|
0,this.E=r|0,this.F=c|0,this.G=i|0,this.H=h|0}_cloneInto(t){return(t||=new this.constructor).set(...this.get()),this._cloneIntoMeta(
t)}process(t,s){for(let f=0;f<16;f++,s+=4)d[f]=t.getUint32(s,!1);for(let f=16;f<64;f++){const p=d[f-15],b=d[f-2],w=a(p,7)^
a(p,18)^p>>>3,l=a(b,17)^a(b,19)^b>>>10;d[f]=l+d[f-7]+w+d[f-16]|0}let{A:n,B:o,C:r,D:c,E:i,F:h,G:x,H:u}=this;for(let f=0;f<
64;f++){const p=a(i,6)^a(i,11)^a(i,25),b=u+p+k(i,h,x)+$[f]+d[f]|0,l=(a(n,2)^a(n,13)^a(n,22))+M(n,o,r)|0;u=x,x=h,h=i,i=c+
b|0,c=r,r=o,o=n,n=b+l|0}n=n+this.A|0,o=o+this.B|0,r=r+this.C|0,c=c+this.D|0,i=i+this.E|0,h=h+this.F|0,x=x+this.G|0,u=u+this.
H|0,this.set(n,o,r,c,i,h,x,u)}roundClean(){_(d)}destroy(){this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),_(this.buffer)}}class P extends R{constructor(){
super(32,N)}}const X=C(()=>new P,D(1));export{W as b,X as s};
